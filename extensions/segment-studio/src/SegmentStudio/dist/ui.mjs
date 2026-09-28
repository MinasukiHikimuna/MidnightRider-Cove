import oo from "@cove/runtime/react";
import { createPortal as ks } from "@cove/runtime/react-dom";
import { extensionFetch as Ri } from "@cove/runtime/api";
import * as Mi from "@cove/runtime/components";
import { formatDuration as ws, EntityReferenceSelector as Wn, useExtensionKeyboardBindings as Ns, VideoPlayer as Ai, useRegisterExtensionKeyboardActions as Ei, getDefaultFilter as Di, useListUrlState as Oi, ListPage as Pi } from "@cove/runtime/components";
import { StepBack as Is, StepForward as Cs, Loader2 as $s } from "@cove/runtime/lucide-react";
const io = "com.midnightrider.segment-studio", Ts = "segment-studio-editor", Li = "segment-studio.layout.v1", sn = "segment-studio.operations.v1", ji = "segment-studio.collapsed-segment-groups.v1", Fi = "segment-studio.playback-shortcuts.v1", Bi = "segment-studio.timing-clipboard.v1", Gi = "segment-studio.hide-derived-segments.v1", Ki = "segment-studio.merge-confirmation.v1", Nt = ["unreviewed", "approved", "rejected"], Rs = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], zo = "(min-width: 1024px) and (min-height: 640px)", Uo = "(min-width: 1024px) and (min-height: 900px)", Vn = 1e-3, Ho = 15, Ms = 30, zi = 12, Tt = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, ao = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30
}, Jt = {
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
function Ui(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((a) => a.segment));
  return r.find((o) => o.id === t) ?? kr(e, null, 1, !0) ?? r[0] ?? null;
}
function kr(e, t, r, o = !1) {
  var u;
  const a = e.findIndex((g) => g.markers.some((y) => y.segment.id === t));
  if (a < 0) {
    if (!o) return null;
    const g = e.flatMap((y) => y.markers.map((h) => h.segment)).filter((y) => y.reviewState === "unreviewed");
    return r < 0 ? g.at(-1) ?? null : g[0] ?? null;
  }
  const i = e[a], s = i.markers.findIndex((g) => g.segment.id === t);
  if (!o)
    return ((u = (r < 0 ? i.markers.slice(0, s).reverse() : i.markers.slice(s + 1)).find((y) => y.segment.reviewState === "unreviewed")) == null ? void 0 : u.segment) ?? null;
  const l = e.flatMap((g) => g.markers.map((y) => y.segment)), d = l.findIndex((g) => g.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((g) => g.reviewState === "unreviewed") ?? null;
}
function As(e, t, r, o = null) {
  var d, c;
  const a = Number(t);
  if (!Number.isFinite(a)) return null;
  const i = e.flatMap((u, g) => u.markers.filter(({ segment: y }) => {
    const h = Number(y.startSec), p = y.endSec == null ? h + Ms : Number(y.endSec);
    return Number.isFinite(h) && Number.isFinite(p) && p >= h && h <= a + Ho + Vn && p >= a - Ho - Vn;
  }).map(({ segment: y }) => ({ segment: y, laneIndex: g }))).sort((u, g) => u.laneIndex - g.laneIndex || Math.abs(u.segment.startSec - a) - Math.abs(g.segment.startSec - a) || u.segment.id - g.segment.id);
  if (i.length === 0) return null;
  const s = e.findIndex((u) => u.markers.some((g) => g.segment.id === o));
  if (s < 0) return r < 0 ? i.at(-1).segment : i[0].segment;
  const l = i.filter((u) => u.laneIndex !== s);
  return l.length === 0 ? r < 0 ? i.at(-1).segment : i[0].segment : r < 0 ? ((d = l.findLast((u) => u.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((u) => u.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function Es(e, t, r) {
  var i;
  const o = Number(r);
  if (!Number.isFinite(o) || t == null) return null;
  const a = (Array.isArray(e) ? e : []).find((s) => {
    var l;
    return (l = s.markers) == null ? void 0 : l.some(({ segment: d }) => d.id === t);
  });
  return a ? ((i = a.markers.map(({ segment: s }) => {
    const l = Number(s.startSec), d = s.endSec == null ? l : Number(s.endSec), c = Number.isFinite(d) && d >= l ? d : l, u = o < l ? l - o : o > c ? o - c : 0;
    return { segment: s, distance: u, startDistance: Math.abs(l - o) };
  }).filter((s) => Number.isFinite(s.distance)).sort((s, l) => s.distance - l.distance || s.startDistance - l.startDistance || String(s.segment.id).localeCompare(String(l.segment.id)))[0]) == null ? void 0 : i.segment) ?? null : null;
}
function wr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function fu(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, a) => e * a / (r - 1));
}
function Ds(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function yu(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function Os(e, t, r = 1, o = 48) {
  const a = Math.max(1, Math.ceil((Number(e) || 0) / 60)), i = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(a * Math.max(1, o) / i));
}
function Ps(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Ls(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function js(e, t, r, o, a = 160, i = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - a - Math.max(0, Number(i) || 0)), l = a + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Jr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function Fs(e, t, r = 10) {
  const o = Jr(e, t), a = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - a)
  };
}
function qo(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function Bs(e, t = zi) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function Hi(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : Tt.timelineRatio;
}
function Yr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function on(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? Tt.detailWidth : Math.min(Yr(t, 0), Math.max(240, e));
}
function hr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? Tt.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function Gs(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function so(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: Tt.timelineRatio, maximum: Tt.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function lo(e, t) {
  const r = Hi(e);
  if (!(t > 0)) return r;
  const o = so(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function Ks(e) {
  if (!e) return { ...Tt };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? Hi(r) : Tt.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: on(t == null ? void 0 : t.detailWidth),
      markerRailWidth: on(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: hr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...Tt };
  }
}
function zs(e, t, r) {
  return r > 0 ? lo((t + r - e) / r, r) : Tt.timelineRatio;
}
function bu(e, t, r, o, a = 2) {
  const i = Math.max(0, Number(a) || 0);
  return e < r + i ? e - r - i : t > o - i ? t - o + i : 0;
}
function Us(e, t, r, o = null) {
  var d;
  const a = [...e].sort((c, u) => c.startSec - u.startSec || c.id - u.id), i = a.findIndex((c) => c.id === o), s = Number((d = a[i]) == null ? void 0 : d.startSec), l = Number(t);
  return i >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= Vn ? a[i + (r < 0 ? -1 : 1)] ?? null : r < 0 ? a.findLast((c) => c.startSec < l) ?? null : a.find((c) => c.startSec > l) ?? null;
}
function mr(e, t, r, o) {
  return e === t && r === o;
}
function Hs({ beginRequest: e, fetchDetail: t, isCurrent: r, isSameVideo: o }) {
  let a = null, i = null;
  return function({ onLoaded: l, onError: d }) {
    const c = e(), u = (async () => {
      try {
        const g = await t(c);
        if (r(c))
          return l(g), g;
      } catch (g) {
        if (r(c))
          return d(g), null;
      }
      return o(c) && a !== u && i.videoId === c.videoId ? a : null;
    })();
    return a = u, i = c, u;
  };
}
const Nn = "__segment-studio-cleared-selection__";
function _s(e) {
  return e === "true";
}
function qs(e) {
  return e !== "false";
}
function _i() {
  try {
    return qs(window.localStorage.getItem(Ki));
  } catch {
    return !0;
  }
}
function qi(e) {
  try {
    window.localStorage.setItem(Ki, String(!!e));
  } catch {
  }
}
function Ws(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function Dt(e = {}) {
  const t = Nt.filter((u) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(u) : !0), r = Number(e.performerId), o = Number(e.tagId), a = Number(e.segmentGroupId), i = e.segmentGroupId === "ungrouped" ? "ungrouped" : a > 0 ? a : null, s = String(e.sourceKey || "").trim() || null, l = (u, g) => {
    const y = Number(u);
    return Number.isFinite(y) ? Math.min(1, Math.max(0, y)) : g;
  }, d = l(e.confidenceMin, 0), c = l(e.confidenceMax, 1);
  return {
    reviewStates: t,
    performerId: r > 0 ? r : null,
    tagId: o > 0 ? o : null,
    segmentGroupId: i,
    sourceKey: s,
    confidenceMin: Math.min(d, c),
    confidenceMax: Math.max(d, c),
    includeUnscored: e.includeUnscored !== !1
  };
}
function zr(e, t, r, o = !1, a = []) {
  var c, u;
  const i = Dt(r), s = i.performerId == null ? null : new Set((t || []).filter((g) => Number(g.performerId) === i.performerId).map((g) => g.segmentId)), l = new Set((a || []).flatMap((g) => g.tags || []).map((g) => Number(g.tagId))), d = i.segmentGroupId == null || i.segmentGroupId === "ungrouped" ? null : new Set(((u = (c = (a || []).find((g) => Number(g.id) === i.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : u.map((g) => Number(g.tagId))) || []);
  return Ws(e || [], o).filter((g) => {
    if (g.reviewState != null && !i.reviewStates.includes(g.reviewState) || s && !s.has(g.id) || i.tagId != null && Number(g.tagId) !== i.tagId || d && !d.has(Number(g.tagId)) || i.segmentGroupId === "ungrouped" && l.has(Number(g.tagId)) || i.sourceKey != null && g.sourceKey !== i.sourceKey) return !1;
    const y = Number(g.confidence);
    return g.confidence == null || !Number.isFinite(y) ? i.includeUnscored : y >= i.confidenceMin && y <= i.confidenceMax;
  });
}
function Wi(e, t, r, o = !1, a = []) {
  var l;
  const i = Dt(r);
  if (!e) return { filters: i, hideDerivedSegments: o };
  if (i.reviewStates.includes(e.reviewState) || (i.reviewStates = Dt({
    ...i,
    reviewStates: [...i.reviewStates, e.reviewState]
  }).reviewStates), i.performerId != null && !(t || []).some((d) => d.segmentId === e.id && Number(d.performerId) === i.performerId) && (i.performerId = null), i.tagId != null && Number(e.tagId) !== i.tagId && (i.tagId = null), i.segmentGroupId != null) {
    const d = new Set((a || []).flatMap((c) => c.tags || []).map((c) => Number(c.tagId)));
    if (i.segmentGroupId === "ungrouped")
      d.has(Number(e.tagId)) && (i.segmentGroupId = null);
    else {
      const c = (a || []).find((u) => Number(u.id) === i.segmentGroupId);
      (l = c == null ? void 0 : c.tags) != null && l.some((u) => Number(u.tagId) === Number(e.tagId)) || (i.segmentGroupId = null);
    }
  }
  i.sourceKey != null && e.sourceKey !== i.sourceKey && (i.sourceKey = null);
  const s = Number(e.confidence);
  return e.confidence != null && Number.isFinite(s) && (i.confidenceMin = Math.min(i.confidenceMin, Math.floor(s * 100) / 100), i.confidenceMax = Math.max(i.confidenceMax, Math.ceil(s * 100) / 100)), (e.confidence == null || !Number.isFinite(s)) && (i.includeUnscored = !0), {
    filters: Dt(i),
    hideDerivedSegments: o && !e.isDerived
  };
}
function Vs(e, t = !1) {
  const r = Dt(e);
  return +(r.reviewStates.length !== Nt.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function Js(e, t, r) {
  const o = Number(e), a = Number(t), i = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(a) || !(i > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - a) / i)) * 100) / 100;
}
function Ys(e, t, r, o) {
  const a = Math.round(Math.min(1, Math.max(0, Number(o))) * 100) / 100;
  if (r === "minimum") {
    const s = Math.min(a, t);
    return {
      minimum: s,
      maximum: t,
      coincidentTop: s === t ? "maximum" : "minimum"
    };
  }
  const i = Math.max(a, e);
  return {
    minimum: e,
    maximum: i,
    coincidentTop: i === e ? "minimum" : "maximum"
  };
}
function Qs(e, t, r = null, o = {}) {
  if (t === Nn) return null;
  const a = t ?? r, i = (e || []).flatMap((s) => (s.markers || []).map((l) => l.segment)).find((s) => s.id === a);
  if (i) return i;
  if (o.reference) {
    const s = o.visibleLanes ?? e;
    return s.flatMap((d) => (d.markers || []).map((c) => c.segment)).find((d) => d.id === o.reference.id) ?? xr(s, o.reference);
  }
  return Ui(e);
}
function Vi(e, t, r, o = !1) {
  const a = [...new Set((e || []).filter((s) => s != null))];
  if (!o) return { selectedSegmentIds: [r], activeSegmentId: r };
  if (!a.includes(r))
    return { selectedSegmentIds: [...a, r], activeSegmentId: r };
  const i = a.filter((s) => s !== r);
  return i.length === 0 ? { selectedSegmentIds: a, activeSegmentId: t } : {
    selectedSegmentIds: i,
    activeSegmentId: r === t ? i.at(-1) ?? null : t
  };
}
function Zs(e, t, r) {
  const o = [...new Set((e || []).filter((s) => s != null))], a = [...new Set((r || []).filter((s) => s != null))];
  if (a.length === 0)
    return { selectedSegmentIds: o, activeSegmentId: t };
  const i = new Set(a);
  if (a.every((s) => o.includes(s))) {
    const s = o.filter((l) => !i.has(l));
    return s.length === 0 ? { selectedSegmentIds: o, activeSegmentId: t } : {
      selectedSegmentIds: s,
      activeSegmentId: i.has(t) ? s.at(-1) : t
    };
  }
  return {
    selectedSegmentIds: [.../* @__PURE__ */ new Set([...o, ...a])],
    activeSegmentId: a[0]
  };
}
function Xs(e, t, r, o, a = !1) {
  const i = [...new Set((o || []).filter((c) => c != null))], s = i.indexOf(t), l = i.indexOf(r);
  if (s < 0 || l < 0)
    return Vi(e, t, r, a);
  const d = i.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: a ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function el(e, t, r = null, o = !1) {
  const a = (e == null ? void 0 : e.selectedSegmentIds) || [], i = (e == null ? void 0 : e.activeSegmentId) ?? null, s = (e == null ? void 0 : e.anchorSegmentId) ?? i, l = (e == null ? void 0 : e.rangeBaseSegmentIds) || [];
  if (r) {
    const u = [...new Set(r)];
    if (!u.includes(s) || !u.includes(t))
      return {
        selectedSegmentIds: [t],
        activeSegmentId: t,
        anchorSegmentId: t,
        rangeBaseSegmentIds: []
      };
    const g = o ? [.../* @__PURE__ */ new Set([...l, ...a])] : l;
    return {
      ...Xs(g, s, t, u, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: g
    };
  }
  const d = Vi(a, i, t, o);
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
    rangeBaseSegmentIds: d.selectedSegmentIds.filter((u) => u !== c)
  };
}
function tl(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], a = new Set(o), i = [...new Set((e || []).filter((s) => a.has(s)))];
  return r != null && a.has(r) && !i.includes(r) && i.push(r), i.length === 0 && (e || []).length > 0 && o.length > 0 && i.push(o[0]), i;
}
function nl(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function Wo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), a = Number(t == null ? void 0 : t.startSec) || 0, i = Math.max(a, Number((t == null ? void 0 : t.endSec) ?? a) || a);
  return i < r ? r - i : a > o ? a - o : 0;
}
function Vo(e, t, r, o = () => !0) {
  return (e || []).map((a) => a.segment).filter((a) => a && !r.has(a.id) && o(a)).sort((a, i) => Wo(t, a) - Wo(t, i) || Math.abs(Number(a.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(a.startSec) - Number(i.startSec) || Number(a.id) - Number(i.id))[0] ?? null;
}
function Qr(e, t) {
  return ((e == null ? void 0 : e.markers) || []).map((r) => r.segment).filter((r) => r && !t.has(r.id));
}
function Ur(e) {
  return e.reviewState === "unreviewed";
}
function Jo(e, t) {
  const r = Number(e.startSec) || 0;
  return r !== t.startSec ? r > t.startSec : Number(e.id) > Number(t.id);
}
function Yo(e, t, r, o, a) {
  if (t < 0)
    return Vo(e.flatMap((s) => s.markers || []), r, o, a);
  const i = e.map((s, l) => ({ lane: s, index: l })).filter(({ lane: s }) => Qr(s, o).some(a)).sort((s, l) => Math.abs(s.index - t) - Math.abs(l.index - t) || +(s.index < t) - +(l.index < t) || s.index - l.index);
  for (const { lane: s } of i) {
    const l = Vo(s.markers, r, o, a);
    if (l) return l;
  }
  return null;
}
function vr(e, t) {
  var i;
  const r = (e || []).find((s) => (s.markers || []).some(({ segment: l }) => l.id === t)), o = (i = r == null ? void 0 : r.markers.find((s) => s.segment.id === t)) == null ? void 0 : i.segment;
  if (!o) return null;
  const a = Number(o.startSec) || 0;
  return {
    laneKey: r.key,
    id: o.id,
    startSec: a,
    endSec: Number(o.endSec ?? a) || a
  };
}
function xr(e, t, r = {}) {
  const o = e || [];
  if (o.length === 0) return null;
  const a = new Set(r.removedIds || []);
  if (t == null) {
    const s = { markers: o.flatMap((d) => d.markers || []) }, l = Qr(s, a);
    return l.find(Ur) ?? l[0] ?? null;
  }
  a.add(t.id);
  const i = o.findIndex((s) => s.key === t.laneKey);
  if (i >= 0) {
    const s = Qr(o[i], a).filter(Ur), l = s.find((c) => Jo(c, t));
    if (l) return l;
    const d = s.filter((c) => !Jo(c, t)).at(-1);
    if (d) return d;
  }
  return Yo(o, i, t, a, Ur) ?? Yo(o, i, t, a, () => !0);
}
function rl(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function Qo(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function ol() {
  try {
    return _s(window.localStorage.getItem(Gi));
  } catch {
    return !1;
  }
}
function il(e) {
  try {
    window.localStorage.setItem(Gi, String(!!e));
  } catch {
  }
}
const Qn = [
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
function sl(e) {
  return al.has(e);
}
function Ji(e) {
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
function ll(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Qn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, a]) => r.has(o) && Array.isArray(a)).map(([o, a]) => [o, a.slice(0, 4).map(Ji).filter(Boolean)]));
  } catch {
    return {};
  }
}
function dl(e = {}) {
  const t = ll(e);
  return Qn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function Zo(e, t = 2) {
  const o = [...new Set(e.map((s) => s.category))].map((s, l) => ({
    category: s,
    index: l,
    shortcuts: e.filter((d) => d.category === s)
  })), a = Math.max(1, Math.min(o.length || 1, Math.floor(t) || 1)), i = Array.from({ length: a }, () => ({ groups: [], weight: 0 }));
  return [...o].sort((s, l) => l.shortcuts.length - s.shortcuts.length || s.index - l.index).forEach((s) => {
    const l = i.reduce((d, c) => c.weight < d.weight ? c : d);
    l.groups.push(s), l.weight += s.shortcuts.length + 2;
  }), i.map((s) => s.groups.sort((l, d) => l.index - d.index));
}
function hu(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : Ji({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function vu(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function Zr(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), a = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !a) return !1;
  const i = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (i && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function Xo(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function xu(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), a = Xo(e.code, t.key), i = Xo(t.code, e.key);
  if (!r && !o && !a && !i) return !1;
  const s = a ? t.key : e.key, l = a ? e.code : i ? t.code : o ? e.code : e.code || t.code;
  for (const d of [!1, !0])
    for (const c of [!1, !0])
      for (const u of [!1, !0])
        for (const g of [!1, !0]) {
          const y = {
            key: s,
            code: l,
            ctrlKey: d,
            metaKey: c,
            altKey: u,
            shiftKey: g
          };
          if (Zr(y, e) && Zr(y, t)) return !0;
        }
  return !1;
}
function In(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function Su(e, t) {
  return [!1, !0].some((r) => In(e, r) && In(t, r));
}
function cl(e, t = !1, r = {}) {
  return dl(r).find((o) => In(o, t) && o.bindings.some((a) => Zr(e, a))) || null;
}
function Yi(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function ul(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Yi).join(" / ") : "Unassigned";
}
function ku(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, ul(o)].some((a) => String(a || "").toLowerCase().includes(r))) : e;
}
function wu(e) {
  return e === "review" ? "review" : "editor";
}
function rt(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((a) => a.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function ml(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function gl(e, t, r) {
  const o = t.map(({ id: i, itemId: s, nativeSegmentId: l }) => ({
    id: i,
    itemId: s,
    nativeSegmentId: l
  })), a = o.find((i) => i.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: a };
}
function pl(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((a) => rt(t, a)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: rt(t, e.activeIdentity) || r[0]
  };
}
function fl(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function Nu(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((a) => fl(o, a))));
}
function ei(e, t) {
  var o;
  if (e) {
    const a = (t == null ? void 0 : t.nativeSegmentId) ?? (t == null ? void 0 : t.id) ?? null;
    if (a == null) throw new Error("Duplicate response did not include a stable native identity.");
    return { nativeSegmentId: a };
  }
  const r = ((o = t == null ? void 0 : t.createdDraft) == null ? void 0 : o.itemId) ?? null;
  if (r == null) throw new Error("Duplicate response did not include a stable item identity.");
  return { itemId: r };
}
function yl(e, t, r, o) {
  const a = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${a}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${a}`;
}
function bl(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const a = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(a) && a > 0 ? { kind: "create", tagId: a, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function hl(e, t, r) {
  return e != null && (r == null || t !== r);
}
function vl(e, t, r, o = null) {
  if (r === t.tagId) return null;
  const a = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: r,
    tagName: o || ((a == null ? void 0 : a.tagId) === r ? a.tagName : null)
  };
}
function xl({ tagEditing: e, selectedSegmentIds: t, activeSegmentId: r }, o) {
  return !(e && r === o && (t == null ? void 0 : t.length) === 1 && t[0] === o);
}
function Xr(e, t) {
  return e === t;
}
function Sl(e, t, r) {
  const o = (e || []).find((a) => a.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((a) => a.itemId === o.itemId) || null;
}
function kl(e, t, r) {
  const o = [...e || []].sort((a, i) => a.startSec - i.startSec || a.id - i.id);
  return r < 0 ? o.filter((a) => a.startSec < t - Vn).at(-1) || null : o.find((a) => a.startSec > t + Vn) || null;
}
function Hr(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function ti(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: Nt.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function Iu(e, t = null, r = !1) {
  const o = ti(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function kn(e, t, r, o) {
  const a = Number(e);
  return Number.isFinite(a) ? Math.min(o, Math.max(r, a)) : t;
}
function Qi(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: kn(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: kn(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: kn(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(kn(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(kn(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(kn(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...ao };
  }
}
function wl(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function Zi() {
  try {
    return Qi(window.localStorage.getItem(Fi));
  } catch {
    return { ...ao };
  }
}
function ni(e) {
  const t = Qi(JSON.stringify(e));
  try {
    window.localStorage.setItem(Fi, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Yt = Object.freeze({
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
  analysisReview: "analysis.review",
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
function Xi(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", a = t && r && o;
  return {
    schemaVersion: a ? 1 : 0,
    requestedMode: a ? eo(e.requestedMode) : "basic",
    effectiveMode: a ? eo(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: a && e.legacyCompatibilityRequired === !0,
    capabilities: a && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((i) => typeof i == "string"))] : []
  };
}
function Cn(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function Nl(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Il(e) {
  const t = [];
  return Cn(e, Yt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), Cn(e, Yt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function Cl(e) {
  return [
    ["general", "General", Yt.settingsGeneral],
    ["shortcuts", "Shortcuts", Yt.settingsShortcuts],
    ["performer-slots", "Performer slots", Yt.settingsPerformerSlots],
    ["derivation", "Derivation", Yt.settingsDerivation]
  ].filter(([, , r]) => Cn(e, r)).map(([r, o]) => [r, o]);
}
function $l(e, t) {
  return e === "segments" && !Cn(
    t,
    Yt.navigationSegmentInventory
  ) || e === "bin" && !Cn(
    t,
    Yt.recyclingBinView
  ) ? "videos" : e;
}
function Tl(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Rl(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, a = Number(t), i = Number.isFinite(a) && a >= 0 ? Math.trunc(a) : 0, s = i > 0 ? `

${i} collected incorrect ${i === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
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
}, ri = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: Nt.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function Ml(e) {
  const t = String(e || "").split(",").filter((r) => Nt.includes(r));
  return t.length === 0 ? [...Nt] : [...new Set(t)];
}
function wn(e) {
  return ea(e).values;
}
function ea(e) {
  if (!e) return { activityTagId: null, values: {} };
  try {
    const t = JSON.parse(String(e));
    if (!t || Array.isArray(t) || typeof t != "object") return { activityTagId: null, values: {} };
    const r = t.values && typeof t.values == "object" && !Array.isArray(t.values) ? t.values : t;
    return {
      activityTagId: Number.isInteger(Number(t.activityTagId)) && Number(t.activityTagId) > 0 ? Number(t.activityTagId) : null,
      values: Object.fromEntries(Object.entries(r).filter(([o, a]) => o && Number.isInteger(Number(a)) && Number(a) > 0))
    };
  } catch {
    return { activityTagId: null, values: {} };
  }
}
function qr(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function oi(e, t) {
  var l;
  const r = ii(t.activitiesCriterion, t.activityId), o = ii(t.performersCriterion, t.performerId), a = r.length === 1 ? r[0] : null, i = ea(t.slots), s = a && (i.activityTagId == null || i.activityTagId === a) ? Object.entries(i.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: a,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: Al(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function ii(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function Al(e, t) {
  return Nt.includes(e == null ? void 0 : e.value) ? [e.value] : Ml(t);
}
function ta(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function El(e) {
  var a;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((a = e.videoFile) == null ? void 0 : a.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Dl(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function ai(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Ol(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((a) => a.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function ct(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function co(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Wr(e, t) {
  const r = new Set(co(t).map((o) => String(ct(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function Xt(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function si(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(Xt).sort().join(",")}`;
}
function na(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((h) => String(h.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const a = e[0].allowSamePerformerInMultipleSlots === !0, i = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (i === 0) return [];
  if (o.length === 0 && e.every((h) => {
    var p;
    return !((p = h.genderHints) != null && p.length);
  }) && e.length === t.length && !a) {
    const h = [...e].sort((f, w) => String(f.slotDefinitionId).localeCompare(String(w.slotDefinitionId))), p = [...t].sort((f, w) => String(f.name).localeCompare(String(w.name)) || Number(ct(f)) - Number(ct(w)));
    return [{
      assignments: Object.fromEntries(h.map((f, w) => [String(f.slotDefinitionId), String(ct(p[w]))])),
      description: p.map((f) => f.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((h) => t.map((p, f) => ({ performer: p, index: f })).filter(({ performer: p }) => {
    var f;
    return !((f = h.genderHints) != null && f.length) || h.genderHints.some((w) => Xt(w) === Xt(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), u = a ? c.filter((h) => h.length > 0).length : li(c, t.length);
  if (u === 0) return [];
  const g = new Map(t.map((h, p) => [String(ct(h)), p]));
  function y(h, p, f) {
    if (s.length >= i) return;
    const w = c.slice(h), $ = a ? w.filter((F) => F.length > 0).length : li(w.map((F) => F.filter((G) => !p.has(String(ct(t[G]))))), t.length);
    if (f + $ < u) return;
    if (h === e.length) {
      if (f !== u) return;
      const F = Object.fromEntries(d.map(({ slot: A, performer: I }) => [String(A.slotDefinitionId), I ? String(ct(I)) : ""])), G = o.length === 0 ? Object.values(F).sort().join(",") : [...new Set(e.map((A) => String(A.label || "")))].map((A) => `${A}:${d.filter(({ slot: I }) => String(I.label || "") === A).map(({ performer: I }) => I ? String(ct(I)) : "").sort().join(",")}`).join("|");
      !l.has(G) && s.length < i && (l.add(G), s.push({
        assignments: F,
        description: d.map(({ slot: A, performer: I }) => o.length ? `${A.label}: ${(I == null ? void 0 : I.name) || "Unassigned"}` : (I == null ? void 0 : I.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const m = e[h], B = [...d].reverse().find(({ slot: F }) => si(F) === si(m)), W = B ? g.get(String(ct(B.performer))) : -1;
    for (const F of c[h]) {
      const G = t[F], A = ct(G);
      if (!(F < W) && !(A == null || !a && p.has(String(A))) && (d.push({ slot: m, performer: G }), a || p.add(String(A)), y(h + 1, p, f + 1), a || p.delete(String(A)), d.pop(), s.length >= i))
        return;
    }
    d.push({ slot: m, performer: null }), y(h + 1, p, f), d.pop();
  }
  return y(0, /* @__PURE__ */ new Set(), 0), s;
}
function li(e, t) {
  const r = Array(t).fill(-1);
  function o(a, i) {
    for (const s of e[a])
      if (!i.has(s) && (i.add(s), r[s] === -1 || o(r[s], i)))
        return r[s] = a, !0;
    return !1;
  }
  return e.reduce((a, i, s) => a + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Pl(e, t) {
  if (!(e != null && e.length) || !(t != null && t.length)) return null;
  const r = e.some((l) => String(l.label || "").trim());
  if (r && e.some((l) => !String(l.label || "").trim())) return null;
  const o = e[0].allowSamePerformerInMultipleSlots === !0;
  if (!r && e.every((l) => {
    var d;
    return !((d = l.genderHints) != null && d.length);
  }) && e.length === t.length && !o) {
    const l = [...e].sort((c, u) => String(c.slotDefinitionId).localeCompare(String(u.slotDefinitionId))), d = [...t].sort((c, u) => String(c.name).localeCompare(String(u.name)) || c.performerId - u.performerId);
    return l.map((c, u) => ({ slot: c, performer: d[u] }));
  }
  const a = /* @__PURE__ */ new Map(), i = [];
  function s(l, d) {
    var u;
    if (a.size > 1) return;
    if (l === e.length) {
      const g = [...new Set(e.map((y) => y.label || ""))].map((y) => `${y}:${i.filter((h) => (h.slot.label || "") === y).map((h) => h.performer.performerId).sort((h, p) => h - p).join(",")}`).join("|");
      a.has(g) || a.set(g, [...i]);
      return;
    }
    const c = e[l];
    for (const g of t)
      !o && d.has(g.performerId) || (u = c.genderHints) != null && u.length && !c.genderHints.some((y) => Xt(y) === Xt(g.gender)) || (i.push({ slot: c, performer: g }), o || d.add(g.performerId), s(l + 1, d), o || d.delete(g.performerId), i.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), a.size === 1 ? [...a.values()][0] : null;
}
function Ll(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = r.assignment || [], a = o.map(({ slot: l, performer: d }) => `${l.slotDefinitionId}:${d.performerId}`).join("|"), i = `${r.tagId}:${a}`;
    t.has(i) || t.set(i, {
      key: i,
      tagName: r.tagName || "Tag segment",
      candidates: [],
      assignment: o,
      counts: { unreviewed: 0, approved: 0, rejected: 0 }
    });
    const s = t.get(i);
    s.candidates.push(r), s.counts[r.reviewState] = (s.counts[r.reviewState] || 0) + 1;
  }
  return [...t.values()].map((r) => ({
    ...r,
    candidates: [...r.candidates].sort((o, a) => o.startSec - a.startSec || (o.endSec ?? o.startSec) - (a.endSec ?? a.startSec) || o.id - a.id)
  }));
}
function jl(e, t, r = 20) {
  const o = String(t || "").trim().toLocaleLowerCase(), a = (i) => {
    var d;
    if (!o) return !0;
    const s = String(((d = i.segment) == null ? void 0 : d.tagName) || i.tagName || "").toLocaleLowerCase();
    if (s.includes(o)) return !0;
    let l = -1;
    for (const c of o) {
      const u = s.indexOf(c, l + 1);
      if (u < 0) return !1;
      l = u;
    }
    return !0;
  };
  return (e || []).filter(a).slice(0, Math.max(1, Number(r) || 20));
}
function Fl(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function Bl(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function ra(e, t, r) {
  const o = ct, a = new Set((t || []).map(o)), i = new Set((r || []).map(Xt));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? a.has(o(l)), u = d.isVideoPerformer ?? a.has(o(d));
    if (c !== u) return u - c;
    const g = Xt(l.gender || l.genderIdentity), y = Xt(d.gender || d.genderIdentity), h = l.matchesGenderHint ?? i.has(g);
    return (d.matchesGenderHint ?? i.has(y)) - h || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
function Gl() {
  return null;
}
function Kl(e) {
  return typeof e == "function" || typeof e == "object" && e !== null && "$$typeof" in e;
}
function oa(e, t) {
  const r = e[t];
  return Kl(r) ? r : Gl;
}
const zl = oa(Mi, "ExtensionEntityActions"), Ul = oa(Mi, "ExtensionSelectionActions"), { useEffect: ge, useId: ia, useLayoutEffect: di, useMemo: We, useReducer: Hl, useRef: me, useState: K, useSyncExternalStore: _l } = oo, n = oo.createElement, aa = "/api/plugins/segment-studio";
function Ue(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(sn) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = to();
    return t[e] = r, window.localStorage.setItem(sn, JSON.stringify(t)), r;
  } catch {
    return to();
  }
}
function He(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(sn) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(sn, JSON.stringify(t));
  } catch {
  }
}
function uo(e) {
  try {
    return JSON.parse(window.localStorage.getItem(sn) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function mo(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(sn) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(sn, JSON.stringify(t));
  } catch {
  }
}
function ql(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function Wl(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const a = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(a), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function ee(e, t, r = 0) {
  var d;
  const o = await Ri(`${aa}${e}`, t);
  if (o.status === 204) return null;
  const a = await o.text(), i = ql(a);
  if (!o.ok) {
    const c = new Error(((d = i.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = i.value, c;
  }
  if (i.parsed) return i.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await Wl(250 * (r + 1), t == null ? void 0 : t.signal), ee(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function Vl(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${aa}${e}`, o = await Ri(r, t);
  if (!o.ok) {
    const a = await o.json().catch(() => null);
    throw new Error((a == null ? void 0 : a.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: Jl(
      o.headers.get("Content-Disposition")
    )
  };
}
function Jl(e, t = "segment-studio-ai-feedback.zip") {
  var s, l, d;
  const r = String(e || ""), o = (s = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(r)) == null ? void 0 : s[1];
  let a = null;
  if (o)
    try {
      a = decodeURIComponent(o.replace(/^"|"$/g, ""));
    } catch {
      a = null;
    }
  if (!a) {
    const c = /filename\s*=\s*(?:"([^"]+)"|([^;]+))/i.exec(r);
    a = (c == null ? void 0 : c[1]) || ((l = c == null ? void 0 : c[2]) == null ? void 0 : l.trim()) || null;
  }
  return ((d = a == null ? void 0 : a.split(/[\\/]/).pop()) == null ? void 0 : d.replace(/[\u0000-\u001f\u007f]/g, "").trim()) || t;
}
function De(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), a = Math.floor(o / 3600), i = Math.floor(o % 3600 / 60), s = o % 60, l = a > 0 ? `${a}:${String(i).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${i}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function to() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function sa(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function Yl(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, a = Number(e.retainedSharedSegmentCount) || 0, i = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = a > 0 ? ` ${a} shared derived segment${a === 1 ? "" : "s"} will be kept.` : "", c = i > 0 ? ` ${i} feedback-protected rejected segment${i === 1 ? "" : "s"} will be kept until ${i === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function la(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), a = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: a };
}
function Ql(e, t) {
  const { sceneCount: r, segmentCount: o } = la(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function da(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = la(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(Ql(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const a = `bin-empty:${e.fingerprint}`, i = await ee("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Ue(a),
      expectedFingerprint: e.fingerprint
    })
  });
  return He(a), {
    status: "emptied",
    sceneCount: Array.isArray(i.videoIds) ? i.videoIds.length : o.sceneCount,
    segmentCount: Number(i.deletedCount) || o.segmentCount
  };
}
function ci({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const Kt = {
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
function Cu(e, t) {
  return {
    ...(Kt[e] || Kt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function ca(e) {
  return { ...(Kt[e] || Kt.unreviewed).badge };
}
function ua(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const ma = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function Zl(e, t, r = "not-applicable", o = !1) {
  const a = Kt[e] || Kt.unreviewed, i = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: a.row.borderLeftColor,
    backgroundColor: i,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Xl(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function ed(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function td(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function nd(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function Cr(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function rd(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function ln({ state: e, includeLabel: t = !0 }) {
  const r = Kt[e] || Kt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: ca(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function od(e, t = null) {
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
function $u(e, t) {
  var i, s, l;
  if (!t) return !1;
  const r = e.target, o = ((i = e.view) == null ? void 0 : i.document) ?? (r == null ? void 0 : r.ownerDocument), a = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || a === t || ((l = t.contains) == null ? void 0 : l.call(t, a)) || r === (o == null ? void 0 : o.body) && a === o.body;
}
function id(e, t = document) {
  return !(e.defaultPrevented || od(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function Tu(e, t = document, r = !1, o = {}) {
  return id(e, t) ? cl(e, r, o) != null : !1;
}
function ad(e, t, r = null) {
  return !(!t || e instanceof Element && (t.contains(e) || r != null && r.contains(e)));
}
function Rt(e, { onCancel: t, onConfirm: r } = {}) {
  var s, l;
  if (e.key === "Enter" && (e.isComposing || (s = e.nativeEvent) != null && s.isComposing || e.keyCode === 229)) return !1;
  const o = typeof ((l = e.target) == null ? void 0 : l.closest) == "function" ? e.target.closest("button, a, select, option, textarea") : e.target, a = String((o == null ? void 0 : o.tagName) || "").toLowerCase();
  if (a === "select" || a === "option") return !1;
  if (e.key === "Enter" && e.repeat && (a === "button" || a === "a"))
    return e.preventDefault(), !1;
  if (e.key === "Enter" && (e.repeat || ["button", "a", "textarea"].includes(a))) return !1;
  const i = e.key === "Escape" ? t : e.key === "Enter" ? r : null;
  return i ? (e.preventDefault(), e.stopPropagation(), i(), !0) : !1;
}
function sd(e, t) {
  var o, a, i, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (i = (a = e.currentTarget) == null ? void 0 : a.querySelector) == null ? void 0 : i.call(a, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function ld({ confirm: e, cancel: t, confirmReady: r }) {
  const o = r && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function go({ confirmRef: e, cancelRef: t, confirmReady: r }) {
  ge(() => {
    const o = requestAnimationFrame(() => ld({
      confirm: e.current,
      cancel: t == null ? void 0 : t.current,
      confirmReady: r
    }));
    return () => cancelAnimationFrame(o);
  }, [r]);
}
function Vt(e) {
  var i;
  if (e.key !== "Tab") return !1;
  const t = [...e.currentTarget.querySelectorAll(
    "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
  )].filter((s) => !s.hidden && s.getAttribute("aria-hidden") !== "true");
  if (t.length === 0)
    return e.preventDefault(), e.currentTarget.focus(), !0;
  const r = t[0], o = t[t.length - 1], a = (i = e.currentTarget.ownerDocument) == null ? void 0 : i.activeElement;
  return !t.includes(a) || !e.shiftKey && a === o || e.shiftKey && a === r ? (e.preventDefault(), (e.shiftKey ? o : r).focus(), !0) : !1;
}
function ui(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, a = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? a.filter((i) => i.sequence > o && i.sequence <= r).sort((i, s) => s.sequence - i.sequence).map((i) => ({ action: i, direction: "backward", state: i.beforeState })) : a.filter((i) => i.sequence > r && i.sequence <= o).sort((i, s) => i.sequence - s.sequence).map((i) => ({ action: i, direction: "forward", state: i.afterState }));
}
function po(e, t = !0) {
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
function gr(e, t = !0) {
  return {
    type: "segment",
    identity: po(e, t),
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
function Et(e, t = !0) {
  return {
    type: "segments",
    segments: (e || []).map((r) => ({
      identity: po(r, t),
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
function pr(e, t) {
  return {
    type: "incorrectExamples",
    collected: t,
    entries: (e || []).map(({ segment: r, result: o, example: a }) => ({
      exampleId: (o == null ? void 0 : o.exampleId) ?? (a == null ? void 0 : a.id) ?? null,
      originalIdentity: po(r),
      collectedIdentity: {
        itemId: (o == null ? void 0 : o.itemId) ?? (a == null ? void 0 : a.itemId) ?? null,
        nativeSegmentId: (o == null ? void 0 : o.nativeSegmentId) ?? null,
        published: (o == null ? void 0 : o.nativeSegmentId) != null,
        revision: (o == null ? void 0 : o.revision) ?? null
      }
    }))
  };
}
function Nr(e) {
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
function ga(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function pa(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = t.get(r.segmentId);
    o ? o.push(r) : t.set(r.segmentId, [r]);
  }
  for (const r of t.values())
    r.sort((o, a) => o.sortOrder - a.sortOrder || String(o.slotDefinitionId).localeCompare(String(a.slotDefinitionId)));
  return t;
}
function fo(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function dd(e, t) {
  const r = (t || []).map((a) => ga(e, a.id));
  if (r.length === 0 || r.some((a) => a.length === 0)) return null;
  const o = (a) => a.map((i) => JSON.stringify({
    label: It(i),
    genderHints: [...i.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: i.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((a) => o(a) === o(r[0])) ? r : null;
}
function cd(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : dd(e, t);
}
function ud({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const a = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return a.length === 0 ? "Choose one segment to edit it." : a.length === 1 ? `Selected segments can be ${a[0]}.` : `Selected segments can be ${a.slice(0, -1).join(", ")} or ${a.at(-1)}.`;
}
function Ru(e, t) {
  return fo(ga(e, t));
}
function It(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function md(e, t) {
  const r = (d) => It(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), a = (d) => {
    const c = /* @__PURE__ */ new Map();
    for (const u of d || []) {
      const g = r(u);
      c.has(g) || c.set(g, []), c.get(g).push(u);
    }
    return c;
  }, i = a(e), s = a(t), l = [];
  for (const [d, c] of i) {
    const u = s.get(d);
    if (!u || c.length !== u.length)
      continue;
    const g = [...c].sort(o), y = [...u].sort(o);
    g.forEach((h, p) => l.push({
      sourceSlotDefinitionId: h.id,
      derivedSlotDefinitionId: y[p].id
    }));
  }
  return l;
}
function gd(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = md(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function pd(e) {
  const t = It(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, a = String((e == null ? void 0 : e.performerName) || "").trim(), i = o ? a || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map($r).filter(Boolean);
  return {
    label: t,
    performer: i,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${i}`
  };
}
function $r(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function Ir(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function mi(e) {
  const t = [], r = [...e.segments].sort((i, s) => i.startSec - s.startSec || i.id - s.id).map((i) => {
    const s = Number(i.startSec) || 0, l = i.endSec == null ? s : Number(i.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((u) => u.end <= s && u.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: i, track: c };
  }), { segments: o, ...a } = e;
  return {
    ...a,
    markers: r,
    counts: Ir(o),
    trackCount: Math.max(1, t.length)
  };
}
function fd(e) {
  const t = e.map(It), r = /* @__PURE__ */ new Map();
  for (const a of t) r.set(a, (r.get(a) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((a, i) => {
    const s = t[i], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(a.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function yd(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], u = d.length > 0 && d.every((g) => Number(g.performerId) > 0) ? d.map((g) => `${g.slotDefinitionId}:${Number(g.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: u };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [mi({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
  const a = o.map((l) => r.find((d) => d.signature === l).slots), i = new Set((a[0] || []).filter((l) => a.every((d) => d.some((c) => String(c.slotDefinitionId) === String(l.slotDefinitionId) && Number(c.performerId) === Number(l.performerId)))).map((l) => String(l.slotDefinitionId))), s = /* @__PURE__ */ new Map();
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
        const c = fd(l.slots), u = l.slots.filter((f) => !i.has(String(f.slotDefinitionId))), g = o.length === 1 ? l.slots : u, y = g.map((f) => `${c.get(String(f.slotDefinitionId))} · ${f.performerName || `Performer ${f.performerId}`}`).join(" · "), h = [...new Map(g.map((f) => [
          Number(f.performerId),
          { id: Number(f.performerId), name: f.performerName || `Performer ${f.performerId}` }
        ])).values()], p = l.slots.map((f) => ({
          slotDefinitionId: String(f.slotDefinitionId),
          label: c.get(String(f.slotDefinitionId)),
          performer: {
            id: Number(f.performerId),
            name: f.performerName || `Performer ${f.performerId}`
          }
        }));
        s.set(d, {
          ...e,
          key: `${e.key}:performers:${d}`,
          performerLabel: y,
          performers: h,
          performerAssignments: p,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(mi);
}
function an(e, t = [], r = []) {
  const o = /* @__PURE__ */ new Map();
  for (const [s, l] of t.entries())
    for (const d of l.tags || [])
      o.set(d.tagId, {
        segmentGroupId: l.id,
        segmentGroupName: l.name,
        segmentGroupSortOrder: s,
        segmentGroupTagSortOrder: d.sortOrder,
        tagSortName: d.tagSortName || null
      });
  const a = /* @__PURE__ */ new Map();
  for (const s of e) {
    const l = s.tagName || "Tag segment", d = s.tagId == null ? `name:${l}` : `tag:${s.tagId}`;
    if (!a.has(d)) {
      const u = o.get(s.tagId);
      a.set(d, {
        key: d,
        tagId: s.tagId,
        label: l,
        // A segment shown with a new tag has no sort name yet; the group catalog knows it.
        tagSortName: s.tagSortName || (u == null ? void 0 : u.tagSortName) || null,
        segmentGroupId: (u == null ? void 0 : u.segmentGroupId) ?? null,
        segmentGroupName: (u == null ? void 0 : u.segmentGroupName) ?? null,
        segmentGroupSortOrder: (u == null ? void 0 : u.segmentGroupSortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (u == null ? void 0 : u.segmentGroupTagSortOrder) ?? Number.MAX_SAFE_INTEGER,
        segments: []
      });
    }
    a.get(d).segments.push(s);
  }
  const i = /* @__PURE__ */ new Map();
  for (const s of r || [])
    i.has(s.segmentId) || i.set(s.segmentId, []), i.get(s.segmentId).push(s);
  for (const s of i.values())
    s.sort((l, d) => l.sortOrder - d.sortOrder || String(l.slotDefinitionId).localeCompare(String(d.slotDefinitionId)));
  return [...a.values()].sort((s, l) => s.segmentGroupSortOrder - l.segmentGroupSortOrder || s.segmentGroupTagSortOrder - l.segmentGroupTagSortOrder || (s.tagSortName || s.label).localeCompare(l.tagSortName || l.label, void 0, {
    sensitivity: "base"
  }) || s.key.localeCompare(l.key)).flatMap((s) => yd(s, i));
}
function yo(e) {
  var r;
  const t = [];
  for (const o of e) {
    const a = o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`;
    let i = t.at(-1);
    (!i || i.key !== a) && (i = {
      key: a,
      id: o.segmentGroupId,
      name: o.segmentGroupName || "Ungrouped",
      lanes: [],
      counts: { unreviewed: 0, approved: 0, rejected: 0 }
    }, t.push(i)), i.lanes.push(o);
    for (const s of Nt)
      i.counts[s] += Number((r = o.counts) == null ? void 0 : r[s]) || 0;
  }
  return t;
}
function fa(e) {
  return (e || []).some((t) => t.id != null);
}
const bd = {
  group: 38,
  lane: 33,
  segment: 41
};
function hd(e, t = []) {
  const r = new Set(t || []), o = [];
  let a = 0;
  const i = (s) => {
    const l = bd[s.kind];
    o.push({ ...s, top: a, height: l }), a += l;
  };
  for (const s of e || [])
    if (i({ kind: "group", key: `${s.key}:header`, group: s }), !r.has(s.key))
      for (const l of s.lanes || []) {
        i({ kind: "lane", key: `${l.key}:label`, group: s, lane: l });
        for (const d of l.markers || [])
          i({ kind: "segment", key: `segment:${d.segment.id}`, group: s, lane: l, segment: d.segment });
      }
  return { rows: o, height: a };
}
function ya(e, t, r, o = 240) {
  const a = Math.max(0, Number(t) - o), i = Math.max(a, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= a && s.top <= i);
}
function vd(e, t = [], r = !0) {
  const o = new Set(t || []), a = [];
  let i = 0;
  const s = (l, d) => {
    a.push({ ...l, top: i, height: d }), i += d;
  };
  for (const l of e || [])
    if (r && s({ kind: "group", key: `header:${l.key}`, group: l }, 32), !o.has(l.key))
      for (const [d, c] of (l.lanes || []).entries()) {
        const u = Math.max(1.75, c.trackCount * 1.25 + 0.5) * 16;
        s({ kind: "lane", key: c.key, group: l, lane: c, laneIndex: d }, u);
      }
  return { rows: a, height: i };
}
function xd(e, t) {
  const r = new Set(t || []), o = (e || []).map((a) => {
    const i = (a.markers || []).filter(({ segment: s }) => r.has(s.id));
    return i.length === 0 ? null : {
      ...a,
      selectedCount: i.length,
      counts: Ir(i.map(({ segment: s }) => s)),
      markers: i
    };
  }).filter(Boolean);
  return yo(o).map((a) => {
    const i = a.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...a,
      selectedCount: i.length,
      counts: Ir(i)
    };
  });
}
function ba(e, { nativeOnly: t = !1 } = {}) {
  const r = (e || []).flatMap((a) => a.lanes || []);
  if (r.length !== 1 || (r[0].markers || []).length < 2) return null;
  const o = r[0].markers.map(({ segment: a }) => a).sort((a, i) => a.startSec - i.startSec || (a.nativeSegmentId ?? a.itemId ?? a.id) - (i.nativeSegmentId ?? i.itemId ?? i.id));
  return t && o.some((a) => a.nativeSegmentId == null) || !t && new Set(o.map((a) => a.nativeSegmentId != null ? "native" : "extension")).size !== 1 ? null : {
    lane: r[0],
    segments: o,
    startSec: o[0].startSec,
    endSec: Math.max(...o.map((a) => a.endSec ?? a.startSec))
  };
}
function gi(e, t) {
  const r = new Set(t.removedSegmentIds || []), o = new Set(t.removedItemIds || []), a = t.survivor, i = (e.segments || []).filter((c) => !r.has(c.id)).map((c) => c.id === a.id ? { ...c, ...a } : c);
  i.some((c) => c.id === a.id) || i.push(a);
  const s = t.performerSlots == null ? e.performerSlots : (e.performerSlots || []).filter((c) => c.segmentId !== a.id && !r.has(c.segmentId)).concat(t.performerSlots), l = { ...e.performerSlotRevisions || {} };
  t.performerSlotRevisions != null && (delete l[a.id], r.forEach((c) => delete l[c]), Object.assign(l, t.performerSlotRevisions));
  const d = { ...e.itemMetadata || {} };
  return t.itemMetadata != null && (a.itemId != null && delete d[a.itemId], o.forEach((c) => delete d[c]), Object.assign(d, t.itemMetadata)), {
    ...e,
    segments: i,
    performerSlots: s,
    performerSlotRevisions: l,
    itemMetadata: d,
    approvedSetVersion: t.approvedSetVersion ?? e.approvedSetVersion
  };
}
function tn(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function Jn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function Sd(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var r;
    return (r = t[0]) == null ? void 0 : r.toUpperCase();
  }).join("") || "?";
}
function Yn({ performer: e, compact: t = !1, tooltip: r = null }) {
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
    }, o ? Sd(e.name) : "—"),
    o ? n("img", {
      key: "image",
      src: `/api/performers/${e.id}/image?max=64`,
      alt: "",
      loading: "lazy",
      className: "absolute inset-0 h-full w-full object-cover",
      onError: (a) => {
        a.currentTarget.style.display = "none";
      }
    }) : null
  ]);
}
function ha({ assignments: e, className: t = "" }) {
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
      n(Yn, {
        key: `${r.key}:avatar`,
        performer: r.performer
      })
    ];
  }));
}
function Tr({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = me(null), a = `performer-slots-${ia()}`, [i, s] = K(null);
  function l() {
    var h;
    const c = (h = o.current) == null ? void 0 : h.getBoundingClientRect();
    if (!c) return;
    const u = Math.max(0, Math.min(256, window.innerWidth - 16)), g = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), y = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - u - 8, c.right - u)),
      top: y >= g + 8 ? c.bottom + 4 : Math.max(8, c.top - g - 4),
      width: u
    });
  }
  ge(() => {
    if (i)
      return window.addEventListener("scroll", l, !0), window.addEventListener("resize", l), () => {
        window.removeEventListener("scroll", l, !0), window.removeEventListener("resize", l);
      };
  }, [i != null, t == null ? void 0 : t.length]);
  const d = (t || []).map((c) => `${c.label}: ${c.performer.name}`).join(", ") || "Performer assignments";
  return r ? n("span", {
    ref: o,
    tabIndex: 0,
    className: "relative ml-auto flex shrink-0 -space-x-1 rounded-full focus:outline-none focus:ring-2 focus:ring-accent",
    "aria-label": d,
    "aria-describedby": a,
    onMouseEnter: l,
    onMouseLeave: () => s(null),
    onFocus: l,
    onBlur: () => s(null),
    onKeyDown: (c) => {
      c.key === "Escape" && s(null);
    }
  }, [
    ...e.slice(0, 3).map((c) => n(Yn, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    i ? ks(n("span", {
      id: a,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...i, maxHeight: "calc(100vh - 1rem)" }
    }, n(ha, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : n("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => n(Yn, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function kd(e, t) {
  const r = new Set(tn(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function va(e, t) {
  return t ? tn(e).filter((r) => r !== t) : tn(e);
}
function wd(e, t) {
  const r = tn(t), o = new Set(tn(e));
  return r.length > 0 && r.every((a) => o.has(a)) ? [] : r;
}
function Gt(e, t) {
  const r = (e || []).find((o) => o.markers.some((a) => a.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function pi(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const a = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), u = Number.isFinite(c) && c >= d ? c : d, g = d <= o && u >= o, y = g ? 0 : Math.min(Math.abs(o - d), Math.abs(o - u));
    return { contains: g, distance: y, duration: u - d, start: d };
  }, i = a(e), s = a(t);
  return Number(s.contains) - Number(i.contains) || (i.contains && s.contains ? s.duration - i.duration : i.distance - s.distance) || i.start - s.start || e.segment.id - t.segment.id;
}
function no(e, t, r, o = null) {
  var u, g, y, h, p, f;
  const a = e.findIndex((w) => w.markers.some(($) => $.segment.id === t));
  if (a < 0) {
    const w = [...((u = e[0]) == null ? void 0 : u.markers) || []];
    return o != null && Number.isFinite(Number(o)) && w.sort(($, m) => pi($, m, o)), ((g = w[0]) == null ? void 0 : g.segment) ?? null;
  }
  const i = e[a], s = i.markers.findIndex((w) => w.segment.id === t);
  if (r === "left" || r === "right") {
    const w = r === "left" ? -1 : 1, $ = Math.min(i.markers.length - 1, Math.max(0, s + w));
    return ((y = i.markers[$]) == null ? void 0 : y.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, a + (r === "up" ? -1 : 1))), d = Number((h = i.markers[s]) == null ? void 0 : h.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === a ? ((p = i.markers[s]) == null ? void 0 : p.segment) ?? null : ((f = [...e[l].markers].sort(c ? (w, $) => pi(w, $, Number(o)) : (w, $) => Math.abs(w.segment.startSec - d) - Math.abs($.segment.startSec - d) || w.segment.startSec - $.segment.startSec || w.segment.id - $.segment.id)[0]) == null ? void 0 : f.segment) ?? null;
}
function Nd(e, t, r) {
  const o = (e || []).find((i) => i.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const a = no([o], t, r);
  return a ? { segment: a, segmentIds: o.markers.map((i) => i.segment.id) } : null;
}
function Id(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function Cd(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function $d(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [bi(r)];
  const a = o - r, i = a < 30 ? [4] : a < 60 ? [4, 20] : a < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(i.map((l) => bi(Math.min(s, r + l))))];
}
function Td(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), a = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(a) ? "remove" : "collect",
    segments: r
  };
}
function Rd(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function _n(e, t) {
  if (!e || !t) return e;
  const r = new Set(t.removedSegmentIds || []), o = new Map(
    (t.identityChanges || []).map((c) => [c.previousId, c.currentId])
  ), a = new Map(
    [...t.upsertedSegments || [], ...t.upsertedBasicSegments || []].map((c) => [c.id, c])
  ), i = (e.segments || []).filter((c) => !r.has(c.id)).map((c) => a.has(c.id) ? { ...c, ...a.get(c.id) } : c), s = new Set(i.map((c) => c.id));
  for (const c of a.values())
    s.has(c.id) || i.push(c);
  i.sort((c, u) => Number(c.startSec) - Number(u.startSec) || String(c.key || "").localeCompare(String(u.key || "")));
  const l = (e.performerSlots || []).filter((c) => !r.has(c.segmentId) || o.has(c.segmentId)).map((c) => o.has(c.segmentId) ? { ...c, segmentId: o.get(c.segmentId) } : c), d = {};
  for (const [c, u] of Object.entries(
    e.performerSlotRevisions || {}
  )) {
    const g = Number(c);
    r.has(g) && !o.has(g) || (d[o.get(g) ?? c] = u);
  }
  return {
    ...e,
    approvedSetVersion: t.approvedSetVersion || e.approvedSetVersion,
    segments: i,
    performerSlots: l,
    performerSlotRevisions: d
  };
}
function fi(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const a = new Set(
    (Array.isArray(t) ? t : []).map((i) => i == null ? void 0 : i.itemId).filter((i) => i != null)
  );
  return a.size === 0 ? o : o.filter((i) => (i == null ? void 0 : i.itemId) == null || !a.has(i.itemId));
}
function Md(e) {
  if (!Array.isArray(e)) return [];
  const t = [], r = /* @__PURE__ */ new Map();
  for (const o of e) {
    if (!o) continue;
    const a = String(o.tagName || "").trim() || "Tag segment";
    let i = r.get(a);
    i || (i = { tagName: a, examples: [] }, r.set(a, i), t.push(i)), i.examples.push(o);
  }
  return t;
}
async function Ad(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await yi(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const a = o.getContext("2d");
    if (!a)
      throw new Error("This browser cannot capture video frames.");
    const i = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], u = $d(
        d.startSec,
        d.endSec
      );
      for (const [g, y] of u.entries()) {
        Math.abs(r.currentTime - y) > 5e-4 && (r.currentTime = y, await yi(r, "seeked")), a.drawImage(r, 0, 0, o.width, o.height);
        const h = await Ed(o), p = `example-${l + 1}-frame-${g + 1}`;
        c.push({ fieldName: p, timestampSec: y }), s.push({
          fieldName: p,
          file: new File(
            [h],
            `${p}.jpg`,
            { type: "image/jpeg" }
          )
        });
      }
      i.push({
        exampleId: d.id,
        expectedExampleRevision: d.revision,
        expectedRepresentationRevision: d.representationRevision,
        frames: c
      });
    }
    return { captures: i, files: s };
  } finally {
    r.pause(), r.removeAttribute("src"), r.load(), r.remove();
  }
}
function yi(e, t) {
  return t === "loadedmetadata" && e.readyState >= 1 || t === "loadeddata" && e.readyState >= 2 ? Promise.resolve() : new Promise((r, o) => {
    const a = setTimeout(
      () => l(
        o,
        new Error("Timed out while reading video frames.")
      ),
      3e4
    ), i = () => l(r), s = () => l(
      o,
      new Error("The video could not be decoded for frame capture.")
    ), l = (d, c) => {
      clearTimeout(a), e.removeEventListener(t, i), e.removeEventListener("error", s), d(c);
    };
    e.addEventListener(t, i, { once: !0 }), e.addEventListener("error", s, { once: !0 });
  });
}
function Ed(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function bi(e) {
  return Math.round(e * 1e3) / 1e3;
}
function Mu(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((a) => o.has(a.id) ? { ...a, ...r } : a).sort((a, i) => a.startSec - i.startSec || a.id - i.id)
  };
}
function Dd(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function Au(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function Eu(e, t, r) {
  const o = new Map((t || []).map((a) => [a.id, a]));
  return {
    ...e,
    segments: (e.segments || []).map((a) => {
      const i = o.get(a.id);
      return i ? r.reduce((s, l) => ({ ...s, [l]: i[l] }), a) : a;
    }).sort((a, i) => a.startSec - i.startSec || a.id - i.id)
  };
}
function Du(e, t) {
  const r = t || [], o = new Set((e.segments || []).map((a) => a.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...r.filter((a) => !o.has(a.id))
    ].sort((a, i) => a.startSec - i.startSec || a.id - i.id)
  };
}
function Zt(e, t, r, o) {
  const a = (r || []).map((d) => ({ ...d, segmentId: t })), i = e.performerSlots || [], s = i.findIndex((d) => d.segmentId === t), l = i.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...a), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function Od(e, t) {
  const r = [...t || []].sort((s, l) => s.startSec - l.startSec || s.id - l.id), o = r[0];
  if (!o) return e;
  const a = new Set(r.slice(1).map((s) => s.id)), i = {
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
    segments: (e.segments || []).filter((s) => !a.has(s.id)).map((s) => s.id === o.id ? i : s).sort((s, l) => s.startSec - l.startSec || s.id - l.id)
  };
}
function $n(e, t) {
  return !e || !t ? !1 : e.itemId != null && e.itemId === t.itemId || e.nativeSegmentId != null && e.nativeSegmentId === t.nativeSegmentId ? !0 : e.id != null && e.id === t.id;
}
function bo(e, t) {
  return (e || []).some((r) => (t || []).some((o) => $n(r, o)));
}
function $t(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function xa(e, t) {
  return (e || []).find((r) => $n(t, r)) || null;
}
function Sa(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Pd(e, t) {
  var r;
  return ((r = e.running) == null ? void 0 : r.kind) === t;
}
function Ou(e) {
  return e.running != null || e.queued.length > 0;
}
const hi = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
function fr(e) {
  return Object.freeze({
    id: e.id,
    kind: e.kind,
    lockId: e.lockId,
    targets: e.targets,
    exclusive: e.exclusive,
    meta: e.meta
  });
}
function Ld({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let r = 1, o = null, a = [], i = null, s = !1, l = 0, d = 0;
  const c = () => !t && d < l, u = /* @__PURE__ */ new Map();
  let g = hi;
  const y = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set();
  let p = [];
  function f() {
    g = o == null && a.length === 0 && i == null ? hi : Object.freeze({
      running: o ? fr(o) : null,
      queued: Object.freeze(a.map(fr)),
      lastFailure: i
    });
    for (const S of [...h]) S();
    if (o == null && a.length === 0) {
      const S = p;
      p = [];
      for (const E of S) E();
    }
  }
  function w(S, E) {
    y.set(S.id, E.status), S.resolve(E);
  }
  function $(S) {
    if (S.dependsOn == null) return "met";
    const E = y.get(S.dependsOn);
    return E === "fulfilled" ? "met" : E != null ? "failed" : "pending";
  }
  function m(S) {
    o = S;
    const E = { ...e(), taskId: S.id, targets: S.targets };
    E.resolveTargets = () => S.targets.map((R) => xa(E.segments, R)).filter(Boolean), f();
    let U;
    try {
      U = S.run(E);
    } catch (R) {
      U = Promise.reject(R);
    }
    Promise.resolve(U).then(
      (R) => B(S, { status: "fulfilled", value: R }),
      (R) => B(S, { status: "rejected", error: R })
    );
  }
  function B(S, E) {
    S.settled || (S.settled = !0, w(S, E), !s && (o = null, E.status === "rejected" && (i = Object.freeze({ id: S.id, kind: S.kind, error: E.error })), f(), l += 1, t && W()));
  }
  function W() {
    if (s || o != null || c()) return;
    let S = !1;
    for (let E = 0; E < a.length; E += 1) {
      const U = a[E], R = $(U);
      if (R === "failed") {
        a = a.filter((M) => M !== U), w(U, { status: "dropped", reason: "dependency-failed" }), S = !0, E -= 1;
        continue;
      }
      if (R !== "pending" && !(U.exclusive && E > 0) && !a.slice(0, E).some((M) => bo(M.targets, U.targets)) && !(U.ready && !U.ready(e(), fr(U)))) {
        a = a.filter((M) => M !== U), m(U);
        return;
      }
    }
    S && f();
  }
  function F(S) {
    if (s || (o == null ? void 0 : o.exclusive) || a.some((z) => z.exclusive) || o != null && S.whenBusy !== "enqueue" || S.exclusive && (o != null || a.length > 0 || c())) return null;
    let U;
    const R = new Promise((z) => {
      U = z;
    }), M = {
      id: r++,
      kind: S.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: S.lockId ?? -1,
      targets: Object.freeze((S.targets || []).map(A)),
      exclusive: S.exclusive === !0,
      dependsOn: S.dependsOn ?? null,
      ready: S.ready || null,
      meta: S.meta ?? null,
      run: S.run,
      resolve: U
    };
    return a = [...a, M], f(), W(), { id: M.id, done: R };
  }
  function G(S = {}) {
    let E = null;
    const U = F({
      ...S,
      whenBusy: "reject",
      run: () => new Promise((M) => {
        E = M;
      })
    });
    if (!U) return null;
    if (E == null)
      return k((M) => M.id === U.id), null;
    let R = !1;
    return () => {
      R || (R = !0, E(), (o == null ? void 0 : o.id) === U.id && B(o, { status: "fulfilled", value: void 0 }));
    };
  }
  function A(S) {
    return (S == null ? void 0 : S.id) == null || S.itemId != null || S.nativeSegmentId != null ? S : u.get(S.id) || S;
  }
  function I(S, E) {
    u.set(S, { ...E });
    let U = !1;
    for (const R of a)
      R.targets.some((M) => M.id === S && M.itemId == null && M.nativeSegmentId == null) && (R.targets = Object.freeze(R.targets.map((M) => M.id === S ? { ...E } : M)), U = !0);
    return U && f(), U;
  }
  function k(S) {
    const E = a.filter((U) => S(fr(U)));
    if (E.length === 0) return 0;
    a = a.filter((U) => !E.includes(U));
    for (const U of E) w(U, { status: "cancelled" });
    return f(), W(), E.length;
  }
  return {
    enqueue: F,
    acquire: G,
    cancel: k,
    retarget: I,
    stableIdentity: A,
    // The host reads `settledCount()` while rendering and reports it here once that render commits.
    settledCount: () => l,
    markCommitted(S = l) {
      d = Math.max(d, S);
    },
    poke: () => W(),
    subscribe(S) {
      return h.add(S), () => h.delete(S);
    },
    getSnapshot: () => g,
    whenIdle() {
      return o == null && a.length === 0 ? Promise.resolve() : new Promise((S) => p.push(S));
    },
    dispose() {
      if (s) return;
      const S = a;
      a = [], s = !0;
      for (const U of S) w(U, { status: "cancelled" });
      h.clear();
      const E = p;
      p = [];
      for (const U of E) U();
    }
  };
}
let jd = 1;
function Wt() {
  return `pending-${jd++}`;
}
function Fd(e) {
  return e.sort((t, r) => t.startSec - r.startSec || t.id - r.id);
}
function Sr(e, t) {
  return (t || []).some((r) => $n(r, e));
}
function Bd(e, t) {
  return [...e || [], {
    id: t.id ?? Wt(),
    taskId: t.taskId ?? null,
    op: t.op,
    targets: t.targets || (t.segment ? [{ id: t.segment.id }] : []),
    values: t.values || null,
    segment: t.segment || null,
    meta: t.meta || null,
    settled: !1
  }];
}
function ka(e, t) {
  return t && (e || []).find((r) => {
    var o;
    return ((o = r.meta) == null ? void 0 : o.kind) === "held-tag" && !r.settled && Sr(t, r.targets);
  }) || null;
}
function Gd(e) {
  return (e || []).filter((t) => t.op === "insert" && !t.settled).map((t) => t.segment);
}
function wa(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function Na(e, t) {
  const r = (e || []).filter((o) => !wa(o, t));
  return r.length === (e || []).length ? e : r;
}
function Ia(e, t) {
  let r = !1;
  const o = (e || []).map((a) => a.settled || !wa(a, t) ? a : (r = !0, { ...a, settled: !0, settledDetail: null }));
  return r ? o : e;
}
function Kd(e, t, r) {
  let o = !1;
  const a = (e || []).map((i) => i.targets.some((s) => s.id === t && s.itemId == null && s.nativeSegmentId == null) ? (o = !0, {
    ...i,
    targets: i.targets.map((s) => s.id === t ? { ...r } : s)
  }) : i);
  return o ? a : e;
}
function zd(e, t) {
  if (!t || t.length === 0) return e;
  let r = [...e || []];
  for (const o of t)
    if (o.op === "insert")
      r.some((a) => $n(o.segment, a)) || r.push(o.segment);
    else if (o.op === "patch")
      r = r.map((a) => Sr(a, o.targets) ? { ...a, ...o.values } : a);
    else if (o.op === "remove")
      r = r.filter((a) => !Sr(a, o.targets));
    else if (o.op === "merge") {
      const [a, ...i] = o.targets;
      r = r.filter((s) => !Sr(s, i)).map((s) => $n(a, s) ? { ...s, ...o.values } : s);
    }
  return Fd(r);
}
function Ca(e, t) {
  if (!e || e.length === 0) return e;
  const r = [
    ...(t == null ? void 0 : t.segments) || [],
    ...e.filter((i) => i.op === "insert" && !i.settled).map((i) => i.segment)
  ];
  let o = !1;
  const a = [];
  for (const i of e) {
    if (i.op !== "insert" && !i.targets.some((s) => r.some((l) => $n(s, l)))) {
      o = !0;
      continue;
    }
    if (i.settled) {
      i.settledDetail == null ? (a.push({ ...i, settledDetail: t }), o = !0) : i.settledDetail !== t ? o = !0 : a.push(i);
      continue;
    }
    a.push(i);
  }
  return o ? a : e;
}
function Ud(e, t, r) {
  return r ? Na(e, t) : Ia(e, t);
}
function Hd(e, t) {
  switch (t.type) {
    case "confirm":
      return Ud(e, t.key, t.applied);
    case "add":
      return Bd(e, t.entry);
    case "discard":
      return Na(e, t.key);
    case "settle":
      return Ia(e, t.key);
    case "retarget":
      return Kd(e, t.temporaryId, t.identity);
    case "prune":
      return Ca(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
function vi(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function _d(e) {
  const { acquireSaveLock: t, compatibilityMode: r, dispatchPendingChanges: o, enqueueSave: a, pendingChanges: i, retargetSaveTasks: s, currentTime: l, detail: d, editorFilters: c, endInput: u, hideDerivedSegments: g, historyRef: y, mediaDuration: h, onConflict: p, onDetailChange: f, onReload: w, optimisticSegmentIdRef: $, pendingDuplicateRef: m, pendingFirstSegmentStartSecRef: B, pendingTagEditSegmentIdRef: W, performerSlots: F, replaceSegmentSelection: G, savingSegmentId: A, segments: I, selectedSegment: k, selectedSegmentIdRef: S, selectedSegments: E, selectionAnchorIdRef: U, selectionRangeBaseIdsRef: R, setCreatingSegmentId: M, setEditorFilters: z, setFirstSegmentTagOpen: Y, setHideDerivedSegments: H, setHistory: ae, setHistoryOpen: de, setPublishApprovedError: ve, setSaveMessage: D, setSelectedSegmentGroupKey: le, setSelectedSegmentId: se, setSelectedSegmentIds: X, setTagEditing: ye, startInput: fe, tagEditingRef: Ce, timelineDuration: Pe, video: pe } = e;
  function Q(L) {
    y.current = L || Jt, ae(y.current);
  }
  async function he(L, re, N, q, j = null) {
    var Z;
    try {
      const be = await ee(`/videos/${pe.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: y.current.revision,
          kind: L,
          label: re,
          beforeState: N,
          afterState: q,
          receiptId: j
        })
      });
      return Q(be), !0;
    } catch (be) {
      return be.status === 409 && ((Z = be.payload) != null && Z.current) && Q(be.payload.current), D("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function T(L, re, N = !0, q = null, j = !1, Z = re, be = !0) {
    if (!L || A != null) return null;
    const ue = t("segment", L.id);
    if (!ue) return null;
    try {
      return await J(L, re, {
        recordHistory: N,
        historyLabel: q,
        optimisticValues: j ? Z : null,
        restoreSelectionOnFailure: be
      });
    } finally {
      ue();
    }
  }
  async function J(L, re, {
    recordHistory: N = !0,
    historyLabel: q = null,
    optimisticValues: j = null,
    pendingChangeId: Z = null,
    restoreSelectionOnFailure: be = !0,
    onReload: ue = w,
    onConflict: $e = p
  } = {}) {
    var ht;
    const pt = E.map((Xe) => Xe.id), Ge = S.current, Te = N && !r ? crypto.randomUUID() : null;
    D(N ? "Saving directly to Cove…" : "Restoring history…");
    const Ye = Z ?? (j ? Wt() : null);
    j && !Z && o({
      type: "add",
      entry: { id: Ye, op: "patch", targets: [$t(L)], values: j }
    });
    const it = (Xe) => {
      Ye && o({ type: "confirm", key: Ye, applied: Xe });
    };
    try {
      if (r && L.nativeSegmentId == null && L.itemId != null) {
        const ut = `draft-update:${pe.id}:${L.itemId}:${L.revision}:${re.tagId}:${re.startSec}:${re.endSec ?? "open"}:${re.reviewState ?? L.reviewState}`, Fe = await ee(`/videos/${pe.id}/drafts/${L.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ue(ut),
            expectedRevision: L.revision,
            startSec: re.startSec,
            endSec: re.endSec,
            tagId: re.tagId,
            reviewState: re.reviewState
          })
        });
        He(ut), Fe.performerSlots != null && f((_e) => Zt(_e, L.id, Fe.performerSlots, Fe.performerSlotRevision), pe.id);
        const Qe = {
          ...L,
          ...Fe.draft,
          id: L.id,
          itemId: L.itemId
        };
        return N && await he(
          "segment.update",
          q || "Changed segment",
          gr(L, r),
          gr(
            Qe,
            r
          )
        ), vi(L, re, r) ? it(await ue() != null) : (f((_e) => ({
          ..._e,
          approvedSetVersion: Fe.approvedSetVersion || _e.approvedSetVersion,
          segments: (_e.segments || []).map((Je) => Je.id === L.id ? Qe : Je).sort((Je, st) => Je.startSec - st.startSec || Je.id - st.id)
        }), pe.id), it(!0)), D(((ht = Fe.draft) == null ? void 0 : ht.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), Qe;
      }
      const Xe = await ee(`/videos/${pe.id}/segments/${L.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...re,
          expectedUpdatedAt: L.updatedAt,
          historyReceiptId: Te
        })
      }), yt = {
        ...L,
        ...Xe,
        reviewState: re.reviewState ?? L.reviewState
      };
      return vi(L, re, r) ? it(await ue() != null) : (f((ut) => ({
        ...ut,
        segments: (ut.segments || []).map((Fe) => Fe.id === L.id ? yt : Fe).sort((Fe, Qe) => Fe.startSec - Qe.startSec || Fe.id - Qe.id)
      }), pe.id), it(!0)), N && await he(
        "segment.update",
        q || "Changed segment",
        gr(L, r),
        gr(
          yt,
          r
        ),
        Te
      ), D(N ? "Saved to Cove" : "History restored"), yt;
    } catch (Xe) {
      return Ye && o({ type: "discard", key: Ye }), Ye && be && (X(pt), se(Ge), U.current = Ge, R.current = []), Xe.status === 409 ? (D("Conflict — loading the latest segment…"), await $e()) : D(Xe.message || "Unable to save the segment."), null;
    }
  }
  async function C() {
    if (!r) return !1;
    const L = I.filter((q) => !q.published && q.reviewState === "approved").length;
    if (L === 0 || A != null) return !1;
    const re = `complete-review:${pe.id}:${d.approvedSetVersion}`, N = t("publish", -1);
    if (!N) return !1;
    ve(""), D(`Publishing ${L} Approved draft${L === 1 ? "" : "s"}…`);
    try {
      const q = await ee(`/videos/${pe.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ue(re),
          expectedApprovedSetVersion: d.approvedSetVersion
        })
      });
      He(re), Q(Jt), de(!1);
      const j = await w(), Z = Sl(
        I,
        S.current,
        q.published
      ), be = Z ? rt(j == null ? void 0 : j.segments, Z) : null;
      return be && se(be.id), D(`${q.published.length} Approved draft${q.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (q) {
      const j = q.status === 409 ? "The approved drafts changed. Review the updated list and try again." : q.message || "Unable to publish the approved drafts.";
      return q.status === 409 && await p(), ve(j), D(j), !1;
    } finally {
      N();
    }
  }
  async function v(L = null, re = null) {
    if (A != null || b()) return;
    const N = L != null ? B.current : null, q = Number.isFinite(N) ? N : l, j = Math.min(Pe, q + 20);
    if (j <= q) {
      D("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const Z = bl(I, k, L);
    if (Z.kind === "choose-tag") {
      B.current = q, D(""), Y(!0);
      return;
    }
    if (Z.kind === "invalid-selection") {
      D("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: be } = Z, ue = `create-draft:${pe.id}:${be}:${q}`, $e = r ? null : crypto.randomUUID(), pt = S.current, Ge = {
      ...k || {},
      id: $.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: be,
      tagName: re || (k == null ? void 0 : k.tagName) || "Tag segment",
      tagSortName: be === (k == null ? void 0 : k.tagId) && (k == null ? void 0 : k.tagSortName) || null,
      startSec: q,
      endSec: j,
      // Full mode creates manual drafts already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, Te = Dd(d, Ge), Ye = Gt(
      an(Te.segments, Te.segmentGroups || [], Te.performerSlots || []),
      Ge.id
    ), it = a({
      kind: "create",
      lockId: -1,
      run: (Xe) => ht(Xe)
    });
    if (!it) return;
    await it.done;
    async function ht({ onReload: Xe, taskId: yt }) {
      var Fe;
      const ut = Wt();
      o({ type: "add", entry: { id: ut, taskId: yt, op: "insert", segment: Ge } }), Y(!1), Z.openTagEditor && (M(Ge.id), W.current = Ge.id, ye(!0)), G(Ge.id), le(Ye);
      try {
        let Qe;
        if (r) {
          const st = await ee(`/videos/${pe.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: Ue(ue), tagId: be, startSec: q, endSec: j })
          });
          He(ue), Qe = { itemId: (Fe = st.draft) == null ? void 0 : Fe.itemId }, st.performerSlots != null && f((Ot) => Zt(Ot, Ge.id, st.performerSlots, st.performerSlotRevision), pe.id);
        } else
          Qe = { nativeSegmentId: (await ee(`/videos/${pe.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: be,
              startSec: q,
              endSec: j,
              historyReceiptId: $e
            })
          })).id };
        B.current = null, Y(!1);
        const _e = await Xe();
        if (o({ type: "discard", key: ut }), !_e) {
          f((st) => Zt(st, Ge.id, []), pe.id), G(pt), D(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${Z.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const Je = rt(_e == null ? void 0 : _e.segments, Qe);
        Je ? (o({ type: "retarget", temporaryId: Ge.id, identity: $t(Je) }), s(Ge.id, $t(Je)), Z.openTagEditor && (Ce.current && (W.current = Je.id), M(Je.id)), G(Je.id), le(Gt(
          an(_e.segments || [], _e.segmentGroups || [], _e.performerSlots || []),
          Je.id
        )), r || await he(
          "segment.create",
          "Created segment",
          Et([], !1),
          Et([Je], !1),
          $e
        )) : (ye(!1), D(`Segment created, but it could not be selected${Z.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (Qe) {
        throw o({ type: "discard", key: ut }), G(pt), L != null && Y(!0), D(Qe.message || "Unable to create the draft."), Qe;
      } finally {
        M(null);
      }
    }
  }
  function b() {
    return ka(i, k) ? (D("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function x() {
    if (E.length !== 1 || !k || A != null || b()) return;
    const L = l;
    if (L <= k.startSec || k.endSec != null && L >= k.endSec) {
      D("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const re = `split-draft:${k.itemId}:${k.revision}:${L}`, N = r ? null : Et([k], !1), q = r ? null : crypto.randomUUID(), j = t("split", k.id);
    if (j)
      try {
        let Z = null;
        r && k.nativeSegmentId == null ? (await ee(`/videos/${pe.id}/drafts/${k.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ue(re),
            expectedRevision: k.revision,
            splitSec: L
          })
        }), He(re)) : Z = { nativeSegmentId: (await ee(`/videos/${pe.id}/segments/${k.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: k.updatedAt,
            splitSec: L,
            historyReceiptId: q
          })
        })).id };
        const be = await w();
        if (!r) {
          const ue = [
            rt(be == null ? void 0 : be.segments, {
              nativeSegmentId: k.nativeSegmentId ?? k.id
            }),
            rt(
              be == null ? void 0 : be.segments,
              Z
            )
          ].filter(Boolean);
          await he(
            "segment.split",
            "Split segment",
            N,
            Et(ue, !1),
            q
          );
        }
        D(r ? `Segment split; both ranges remain ${k.reviewState}.` : "Segment split.");
      } catch (Z) {
        Z.status === 409 ? await p() : D(Z.message || "Unable to split the draft.");
      } finally {
        j();
      }
  }
  async function P(L = !1) {
    if (E.length !== 1 || !k || A != null || b()) return;
    const re = L ? l : k.startSec, N = yl(pe.id, k, L, re), q = r ? null : crypto.randomUUID(), j = k, Z = S.current, be = j.endSec == null ? null : j.endSec - j.startSec, ue = {
      ...j,
      id: $.current--,
      itemId: null,
      nativeSegmentId: null,
      startSec: re,
      endSec: be == null ? null : re + be,
      // Full mode creates the copy already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : j.reviewState,
      revision: 0,
      updatedAt: null
    }, $e = (F || []).filter((Te) => Te.segmentId === j.id), pt = a({
      kind: "duplicate",
      lockId: -1,
      targets: [$t(j)],
      run: (Te) => Ge(Te)
    });
    if (!pt) return;
    await pt.done;
    async function Ge({ onReload: Te, onConflict: Ye, taskId: it }) {
      var yt, ut;
      const ht = Wt();
      o({ type: "add", entry: { id: ht, taskId: it, op: "insert", segment: ue } }), $e.length > 0 && f((Fe) => Zt(Fe, ue.id, $e), pe.id), L || (M(ue.id), W.current = ue.id, ye(!0)), G(ue.id);
      const Xe = () => {
        o({ type: "discard", key: ht }), $e.length > 0 && f((Fe) => Zt(Fe, ue.id, []), pe.id);
      };
      try {
        const Fe = ((yt = m.current) == null ? void 0 : yt.operationKey) === N ? m.current : null;
        let Qe = (Fe == null ? void 0 : Fe.duplicateIdentity) ?? null;
        if (Qe == null && r && j.nativeSegmentId == null) {
          const Ot = await ee(`/videos/${pe.id}/drafts/${j.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ue(N),
              expectedRevision: j.revision,
              startSec: L ? re : null
            })
          });
          Qe = ei(!1, Ot), m.current = { operationKey: N, duplicateIdentity: Qe };
        } else if (Qe == null) {
          const Ot = await ee(`/videos/${pe.id}/segments/${j.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: j.updatedAt,
              startSec: L ? re : null,
              historyReceiptId: q
            })
          });
          Qe = ei(!0, Ot), m.current = { operationKey: N, duplicateIdentity: Qe };
        }
        const _e = await Te();
        Xe();
        const Je = rt(_e == null ? void 0 : _e.segments, Qe);
        if (!Je) {
          ye(!1), G(Z), D(_e ? "Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection." : "Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.");
          return;
        }
        o({ type: "retarget", temporaryId: ue.id, identity: $t(Je) }), s(ue.id, $t(Je));
        const st = Wi(
          Je,
          _e.performerSlots || [],
          c,
          g,
          _e.segmentGroups || []
        );
        z(st.filters), H(st.hideDerivedSegments), !L && Ce.current && (W.current = Je.id), G(Je.id), le(Gt(
          an(_e.segments || [], _e.segmentGroups || [], _e.performerSlots || []),
          Je.id
        )), r && j.nativeSegmentId == null && He(N), m.current = null, D(L ? "Duplicate created at the playhead." : "Duplicate created in place."), r || await he(
          "segment.duplicate",
          "Duplicated segment",
          Et([], !1),
          Et([Je], !1),
          q
        );
      } catch (Fe) {
        throw Xe(), ye(!1), G(Z), ((ut = m.current) == null ? void 0 : ut.operationKey) === N ? D("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : Fe.status === 409 ? await Ye() : D(Fe.message || "Unable to duplicate the draft."), Fe;
      } finally {
        M(null);
      }
    }
  }
  async function te() {
    if (E.length !== 1 || !k) return;
    const L = Number(fe), re = u.trim() === "" ? null : Number(u), N = _o(L, re, h);
    if (N.error) {
      D(N.error);
      return;
    }
    if (L === k.startSec && re === k.endSec) {
      D("Timing is unchanged.");
      return;
    }
    await T(k, { startSec: L, endSec: re, tagId: k.tagId }, !0, null, !0);
  }
  async function ne(L, re) {
    if (E.length !== 1 || !k) return;
    const N = _o(L, re, h);
    if (N.error) {
      D(N.error);
      return;
    }
    if (L === k.startSec && re === k.endSec) {
      D("Timing is unchanged.");
      return;
    }
    await T(k, { startSec: L, endSec: re, tagId: k.tagId }, !0, null, !0);
  }
  return { acceptHistory: Q, recordHistoryAction: he, mutateSegment: T, runSegmentMutation: J, completeReview: C, createSegment: v, splitSegment: x, duplicateSegment: P, saveTiming: te, applyShortcutTiming: ne };
}
function qd() {
  const [e, t] = K(() => typeof window < "u" && window.matchMedia(zo).matches);
  return ge(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(zo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Wd() {
  const [e, t] = K(() => typeof window < "u" && window.matchMedia(Uo).matches);
  return ge(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Uo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Vd() {
  try {
    return Ks(window.localStorage.getItem(Li));
  } catch {
    return { ...Tt };
  }
}
function Jd() {
  try {
    return tn(JSON.parse(window.localStorage.getItem(ji) || "[]"));
  } catch {
    return [];
  }
}
function Yd(e) {
  try {
    window.localStorage.setItem(ji, JSON.stringify(tn(e)));
  } catch {
  }
}
function Qd(e) {
  try {
    window.localStorage.setItem(Li, JSON.stringify(e));
  } catch {
  }
}
function Zd() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Bi) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Xd(e) {
  try {
    return window.localStorage.setItem(Bi, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function ec({ status: e }) {
  const t = ma[e];
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
function en({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, Nt.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...ca(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${Kt[t].symbol}${e[t]}`)));
}
function tc({ videoId: e, segmentId: t, itemId: r, slots: o, revision: a, performerCandidates: i, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: u, shortcutRef: g }) {
  const y = co(i), [h, p] = K(() => Wr(o, y)), [f, w] = K(!1), [$, m] = K(""), B = me(!1), W = o.map((S) => `${S.slotDefinitionId}:${S.performerId || ""}`).join("|"), F = y.map((S) => ct(S)).join("|"), G = na(
    o,
    y
  );
  ge(() => {
    p(Wr(o, y)), m("");
  }, [t, r, W, F]);
  async function A(S = h) {
    if (!B.current) {
      B.current = !0, w(!0), m("Saving performer slots…");
      try {
        const E = Wr(o.map((M) => ({
          ...M,
          performerId: S[M.slotDefinitionId] || null
        })), y), U = o.map((M) => {
          const z = E[M.slotDefinitionId] ? Number(E[M.slotDefinitionId]) : null, Y = y.find((H) => String(ct(H)) === String(z));
          return {
            ...M,
            performerId: z,
            performerName: (Y == null ? void 0 : Y.name) || null
          };
        });
        if (s(U) === !1) {
          m("");
          return;
        }
        const R = await ee(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: a,
            assignments: o.map((M) => ({ slotDefinitionId: M.slotDefinitionId, performerId: E[M.slotDefinitionId] ? Number(E[M.slotDefinitionId]) : null }))
          })
        });
        m("Performer slots saved."), await l(R, {
          beforeState: Nr([{
            segmentId: t,
            itemId: r,
            revision: a,
            slots: o
          }]),
          afterState: Nr([{
            segmentId: t,
            itemId: r,
            revision: R.revision,
            slots: R.slots || []
          }])
        });
      } catch (E) {
        d && await d(o, E), E.status === 409 ? (m("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : m(E.message || "Unable to save performer slots.");
      } finally {
        B.current = !1, w(!1);
      }
    }
  }
  function I(S, E) {
    m(`Option ${E + 1} applied; save to confirm.`), p({ ...h, ...S.assignments });
  }
  async function k(S) {
    const E = { ...h, ...S.assignments };
    p(E), await A(E);
  }
  return ge(() => {
    if (g)
      return g.current = (S) => B.current || !G[S] ? !1 : (k(G[S]), !0), () => {
        g.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    G.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, G.map((S, E) => n("button", {
        key: E,
        type: "button",
        disabled: f,
        onClick: () => I(S, E),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${E + 1}: ${S.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, E + 1),
        n("span", { key: "description" }, S.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${G.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((S) => n("label", { key: S.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, It(S)),
      (S.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(S.genderHints || []).map($r).join(" · ")}`) : null,
      n("select", { key: "select", value: h[S.slotDefinitionId] || "", disabled: f, onChange: (E) => p({ ...h, [S.slotDefinitionId]: E.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ra(y, y, S.genderHints).map((E) => n("option", { key: ct(E), value: ct(E) }, E.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: u, type: "button", disabled: f, onClick: () => A(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, $)])
  ]);
}
function nc({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: a, shortcutRef: i, acquireSaveLock: s = () => () => {
} }) {
  var A;
  const l = ((A = t[0]) == null ? void 0 : A.slots) || [], d = co(r), c = na(
    l,
    d
  ), u = "__mixed__", g = () => Object.fromEntries(l.map((I, k) => {
    const S = t.map((E) => {
      var U;
      return String(((U = E.slots[k]) == null ? void 0 : U.performerId) || "");
    });
    return [I.slotDefinitionId, S.every((E) => E === S[0]) ? S[0] : u];
  })), [y, h] = K(g), [p, f] = K(!1), [w, $] = K(""), m = me(!1), B = t.map((I) => `${I.itemId ?? `native:${I.segmentId}`}:${I.revision}:${I.slots.map((k) => `${k.slotDefinitionId}:${k.performerId || ""}`).join(",")}`).join("|");
  ge(() => {
    h(g());
  }, [B]);
  async function W(I = y) {
    if (m.current) return;
    const k = s();
    if (!k) {
      $("Wait for the current save to finish before saving performer slots.");
      return;
    }
    m.current = !0, f(!0), $(`Saving performer slots for ${t.length} segments…`);
    const S = [];
    try {
      for (const E of t) {
        const U = E.slots.map((M, z) => {
          const Y = I[l[z].slotDefinitionId];
          return {
            slotDefinitionId: M.slotDefinitionId,
            performerId: Y === u ? M.performerId || null : Y ? Number(Y) : null
          };
        }), R = await ee(E.itemId != null ? `/videos/${e}/drafts/${E.itemId}/slots` : `/videos/${e}/segments/${E.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: E.revision, assignments: U })
        });
        S.push({
          segmentId: E.segmentId,
          itemId: E.itemId,
          revision: R.revision,
          slots: R.slots || []
        });
      }
      $("Performer slots saved."), await o({
        beforeState: Nr(t),
        afterState: Nr(S)
      });
    } catch (E) {
      const U = await a();
      E.status === 409 ? $(U ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : $(E.message || (U ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      m.current = !1, f(!1), k();
    }
  }
  function F(I, k) {
    $(`Option ${k + 1} applied; save to confirm.`), h({ ...y, ...I.assignments });
  }
  async function G(I) {
    const k = { ...y, ...I.assignments };
    h(k), await W(k);
  }
  return ge(() => {
    if (i)
      return i.current = (I) => m.current || !c[I] ? !1 : (G(c[I]), !0), () => {
        i.current = null;
      };
  }), n("div", { className: "space-y-3" }, [
    n(
      "p",
      { key: "scope", className: "text-xs text-secondary" },
      `Changes apply to all ${t.length} selected segments. Mixed values remain unchanged unless replaced.`
    ),
    c.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, c.map((I, k) => n("button", {
        key: k,
        type: "button",
        disabled: p,
        onClick: () => F(I, k),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${k + 1} to all selected segments: ${I.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, k + 1),
        n("span", { key: "description" }, I.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${c.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, l.map((I) => n("label", {
      key: I.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, It(I)),
      n("select", {
        key: "select",
        value: y[I.slotDefinitionId] || "",
        disabled: p,
        onChange: (k) => h({ ...y, [I.slotDefinitionId]: k.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        y[I.slotDefinitionId] === u ? n("option", { key: "mixed", value: u }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ra(d, d, I.genderHints).map((k) => n("option", {
          key: ct(k),
          value: ct(k)
        }, k.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: p,
        onClick: () => W(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, w)
    ])
  ]);
}
function zt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function rc(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return zt(t);
  const o = [...new Set(r.map((a) => zt(a.sourceKey, a.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function Rr() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function yr({ name: e }) {
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
function oc({ hidden: e }) {
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
    n(Rr, { key: "derived" })
  ]);
}
function ic({ segment: e, provenance: t }) {
  var u;
  const [r, o] = K(!1), a = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, i = t.key === a ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(i.items) ? i.items : [], l = `segment-provenance-${e.id}`, d = rc(i, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
  return n("section", { "aria-label": "Segment provenance", className: "rounded-md border border-border bg-surface" }, [
    n("button", {
      key: "toggle",
      type: "button",
      onClick: () => o((g) => !g),
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
      i.loading ? n("p", { className: "text-xs text-secondary" }, "Loading provenance…") : i.error ? n("p", { className: "text-xs text-secondary" }, i.error) : s.length === 0 ? n(
        "p",
        { className: "text-xs text-secondary" },
        (u = e.sourceKey) != null && u.includes("stash-marker-studio") ? "Imported from Stash Marker Studio. Detailed run and model information was not recorded for this legacy segment." : "No detailed provenance was recorded for this segment."
      ) : s.map((g) => {
        const y = g.modelIdentifier || g.modelKey, h = g.value == null ? null : typeof g.value == "string" ? g.value : JSON.stringify(g.value);
        return n("div", { key: g.id || `${g.fieldKey}:${g.sourceKey}:${g.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            zt(g.sourceKey, g.sourceDisplayName)
          ),
          g.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${g.fieldKey}${h == null ? "" : ` · ${h}`}`
          ) : null,
          g.relation === "inherited" ? n("div", { key: "relation", className: "text-secondary" }, "Inherited origin") : null,
          y ? n(
            "div",
            { key: "model", className: "text-secondary" },
            `Model ${y}${g.modelVersion ? ` · ${g.modelVersion}` : ""}`
          ) : null,
          g.activityExternalRunId || g.sourceRunId ? n("div", { key: "run", className: "break-all text-secondary" }, `Run ${g.activityExternalRunId || g.sourceRunId}`) : null,
          g.confidence != null ? n(
            "div",
            { key: "confidence", className: "text-secondary" },
            `Confidence ${Math.round(g.confidence * 100)}%`
          ) : null,
          g.recordedAt || g.createdAt ? n("div", { key: "recorded", className: "text-secondary" }, `Recorded ${g.recordedAt || g.createdAt}`) : null
        ]);
      })
    ) : null
  ]);
}
function ac({
  selectedGroups: e,
  selectedSegments: t,
  activeSegmentId: r,
  detailPanelRef: o,
  onReduceSelection: a,
  reviewable: i,
  tagEditable: s,
  slotsEditable: l,
  onEditSlots: d,
  slotButtonRef: c,
  saveMessage: u
}) {
  const [g, y] = K([]), h = e.flatMap(($) => $.lanes.map((m) => m.key)), p = h.join("|");
  ge(() => {
    const $ = new Set(h);
    y((m) => m.filter((B) => $.has(B)));
  }, [p]);
  const f = Ir(t), w = !!ba(
    e,
    { nativeOnly: !i }
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
        `${h.length} swimlane${h.length === 1 ? "" : "s"} · ${e.length} group${e.length === 1 ? "" : "s"}`
      ),
      i ? n(en, { key: "counts", counts: f }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      ud({ mergeable: w, reviewable: i, tagEditable: s, slotsEditable: l })
    ),
    l ? n("button", {
      key: "slots",
      ref: c,
      type: "button",
      onClick: d,
      className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/40"
    }, "Edit performer slots") : null,
    u ? n("p", {
      key: "save-message",
      role: "status",
      "aria-live": "polite",
      className: "text-xs text-secondary"
    }, u) : null,
    ...e.map(($) => n("section", {
      key: $.key,
      "data-selected-segment-group": $.key,
      className: "space-y-1.5"
    }, [
      n("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        n("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, $.name),
        n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${$.selectedCount} selected`)
      ]),
      ...$.lanes.map((m) => {
        const B = g.includes(m.key), W = m.markers.some(({ segment: G }) => G.id === r), F = `selected-segment-lane-${m.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: m.key,
          "data-selected-segment-lane": m.key,
          className: `rounded-md border ${W ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": B,
            "aria-controls": F,
            "aria-current": W ? "true" : void 0,
            onClick: () => y((G) => B ? G.filter((A) => A !== m.key) : [...G, m.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, B ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Jn(m)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(m.selectedCount)),
            i ? n(en, { key: "states", counts: m.counts }) : null
          ]),
          B ? n("div", {
            key: "segments",
            id: F,
            className: "space-y-1 border-t border-border p-1.5"
          }, m.markers.map(({ segment: G }) => {
            const A = G.endSec == null ? De(G.startSec) : `${De(G.startSec)} – ${De(G.endSec)}`;
            return n("button", {
              key: G.id,
              type: "button",
              onClick: () => a(G),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${G.id === r ? "bg-accent/15" : ""}`,
              "aria-label": i ? `${G.tagName || "Segment"}, ${G.reviewState}, ${A}` : `${G.tagName || "Segment"}, ${A}`,
              "aria-current": G.id === r ? "true" : void 0
            }, [
              i ? n(ln, {
                key: "state",
                state: G.reviewState,
                includeLabel: !1
              }) : null,
              G.isDerived ? n(Rr, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, A),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                zt(G.sourceKey)
              )
            ]);
          })) : null
        ]);
      })
    ]))
  ]);
}
const Un = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"]
}, xi = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], Si = [
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
function Zn(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function $a(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function ki(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function br(e, t, r, o = null) {
  const a = ki(t), i = ki(t, "excludes");
  a.forEach((l) => e.append(r, String(l))), i.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (a.length > 0 || i.length > 0) && e.set(o, "true");
}
function sc(e, t, r = null) {
  var g, y, h;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const a = (g = t.hasSegmentsCriterion) == null ? void 0 : g.value;
  typeof a == "boolean" ? o.set("hasSegments", String(a)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), br(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), br(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), br(o, t.performersCriterion, "performer"), br(o, t.studiosCriterion, "studio", "includeSubstudios");
  const i = Number(t.segmentTagId ?? t.tagId) || null;
  i && !o.has("segmentTag") && o.set("segmentTagId", String(i));
  const s = wi(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = wi(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((y = t.reviewStateCriterion) == null ? void 0 : y.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const u = (h = t.shotBoundariesCriterion) == null ? void 0 : h.value;
  return r && typeof u == "boolean" ? o.set("hasShotBoundaries", String(u)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function wi(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function lc(e, t, r, o = null, a = !1) {
  const i = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (a && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((u) => i.add(u));
  } else i.has(r) ? i.delete(r) : i.add(r);
  return i;
}
function Ta({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(ci, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, Nt.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const a = Kt[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: a.badge
    }, `${a.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(ci, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function Ra({ item: e, selected: t, selectionActive: r, onSelect: o }) {
  return o ? n("button", {
    type: "button",
    "aria-label": t ? "Deselect item" : "Select item",
    "aria-pressed": t,
    onClick: (a) => {
      a.preventDefault(), a.stopPropagation(), o(e.videoId, a.shiftKey);
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
function dc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: a = !1, onSelect: i = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: a ? (l) => {
      l.button === 0 && i(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative flex min-h-full flex-col overflow-hidden rounded-md border bg-card shadow-sm transition-colors hover:border-accent/60 ${a ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    a ? null : n("a", {
      key: "link",
      href: `/segment-studio/${e.videoId}`,
      onClick: (l) => Zn(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      n(Ra, { key: "selection", item: e, selected: o, selectionActive: a, onSelect: i }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, ws(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(Ta, { item: e, showReviewStates: r }))
    ])
  ]);
}
function cc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: a = !1, onSelect: i = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: a ? (l) => {
      l.button === 0 && i(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${a ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n(Ra, { key: "selection", item: e, selected: o, selectionActive: a, onSelect: i }),
    n(a ? "div" : "a", {
      key: "link",
      href: a ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: a ? void 0 : (l) => Zn(l, t, s),
      className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
      n("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
        n("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
        n(Ta, { key: "segments", item: e, showReviewStates: r })
      ]),
      n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function ho({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const a = Il(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, a.map((i) => n("a", {
      key: i.key,
      href: i.href,
      onClick: (s) => Zn(s, t, i.route),
      "aria-current": e === i.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === i.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, i.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && Cn(
        o,
        Yt.recyclingBinView
      ) ? n(Ma, { key: "bin", onNavigate: t }) : null,
      n(Aa, { key: "settings", onNavigate: t })
    ])
  ]);
}
const ro = "segment-studio:recycling-bin-changed";
function uc(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function qn() {
  window.dispatchEvent(new CustomEvent(ro));
}
function Ma({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = K(null);
  ge(() => {
    let i = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const u = await ee("/bin"), g = Number(u == null ? void 0 : u.totalCount);
        !i && c === s && o(Number.isFinite(g) && g >= 0 ? Math.trunc(g) : null);
      } catch {
        !i && c === s && o(null);
      }
    }, d = () => {
      l();
    };
    return l(), window.addEventListener(ro, d), window.addEventListener("focus", d), () => {
      i = !0, window.removeEventListener(ro, d), window.removeEventListener("focus", d);
    };
  }, []);
  const a = uc(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (i) => Zn(i, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, a)]);
}
function Aa({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => Zn(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function mc({ mode: e, onModeChange: t, disabled: r = !1 }) {
  function o(a) {
    const i = eo(a.target.value);
    t == null || t(i);
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
function gc({ minimum: e, maximum: t, onChange: r }) {
  const o = me(null), [a, i] = K("maximum"), s = (y, h) => {
    const p = Ys(e, t, y, h);
    i(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (y, h) => {
    var f;
    const p = (f = o.current) == null ? void 0 : f.getBoundingClientRect();
    p && s(y, Js(h.clientX, p.left, p.width));
  }, d = (y, h) => {
    var p, f;
    h.preventDefault(), (f = (p = h.currentTarget).setPointerCapture) == null || f.call(p, h.pointerId), l(y, h);
  }, c = (y, h) => {
    var p, f;
    (f = (p = h.currentTarget).hasPointerCapture) != null && f.call(p, h.pointerId) && l(y, h);
  }, u = (y, h) => {
    const p = y === "minimum" ? e : t, f = y === "minimum" ? 0 : e, w = y === "minimum" ? t : 1, $ = h.shiftKey ? 0.1 : 0.01;
    let m = null;
    ["ArrowLeft", "ArrowDown"].includes(h.key) && (m = p - $), ["ArrowRight", "ArrowUp"].includes(h.key) && (m = p + $), h.key === "PageDown" && (m = p - 0.1), h.key === "PageUp" && (m = p + 0.1), h.key === "Home" && (m = f), h.key === "End" && (m = w), m != null && (h.preventDefault(), s(y, Math.min(w, Math.max(f, m))));
  }, g = (y, h) => n("span", {
    key: y,
    role: "slider",
    tabIndex: 0,
    "aria-label": y === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((y === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((y === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(h * 100),
    "aria-valuetext": `${Math.round(h * 100)} percent`,
    onPointerDown: (p) => d(y, p),
    onPointerMove: (p) => c(y, p),
    onKeyDown: (p) => u(y, p),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${h * 100}%`,
      touchAction: "none",
      zIndex: e === t && a === y ? 2 : 1
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
        g("minimum", e),
        g("maximum", t)
      ])
    )
  ]);
}
function pc({ saving: e, error: t, onSelect: r, onClose: o }) {
  const a = me(null);
  ge(() => {
    var l;
    const s = (l = a.current) == null ? void 0 : l.querySelector("input");
    s == null || s.focus({ preventScroll: !0 });
  }, []);
  const i = () => {
    e || o();
  };
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (s) => {
      s.target === s.currentTarget && i();
    },
    onKeyDownCapture: (s) => Rt(s, { onCancel: i })
  }, n("section", {
    ref: a,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
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
    n(Wn, {
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
      onClick: i,
      className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40 disabled:opacity-50"
    }, e ? "Creating…" : "Cancel"))
  ]));
}
function fc({
  filters: e,
  hideDerivedSegments: t,
  performers: r,
  provenanceSources: o,
  reviewCounts: a,
  segments: i,
  segmentGroups: s,
  reviewMode: l = !1,
  onChange: d,
  onHideDerivedChange: c,
  onClose: u
}) {
  const g = Dt(e), y = [...new Map((i || []).map((m) => [
    Number(m.tagId),
    m.tagName || `Tag ${m.tagId}`
  ])).entries()].sort((m, B) => m[1].localeCompare(B[1]) || m[0] - B[0]), h = new Set((i || []).map((m) => Number(m.tagId))), p = (s || []).filter((m) => Number(m.id) === g.segmentGroupId || (m.tags || []).some((B) => h.has(Number(B.tagId)))), f = (m) => d(Dt({ ...g, ...m })), w = (m) => f({
    reviewStates: g.reviewStates.includes(m) ? g.reviewStates.filter((B) => B !== m) : [...g.reviewStates, m]
  }), $ = (m) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${m ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && u();
    },
    onKeyDownCapture: (m) => Rt(m, { onCancel: u })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
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
        onClick: u,
        "aria-label": "Close editor filters",
        className: "rounded-md px-2 py-1 text-xl leading-none text-secondary hover:bg-muted/40 hover:text-foreground"
      }, "×")
    ]),
    n("div", { key: "body", className: "min-h-0 space-y-5 overflow-y-auto p-5" }, [
      l ? n("fieldset", { key: "approval", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Approval state"),
        n("div", { className: "flex flex-wrap gap-2" }, Nt.map((m) => {
          const B = g.reviewStates.includes(m), W = Kt[m];
          return n("button", {
            key: m,
            type: "button",
            onClick: () => w(m),
            "aria-pressed": B,
            className: $(B)
          }, `${W.symbol} ${m} (${a[m] || 0})`);
        }))
      ]) : null,
      l ? n("fieldset", { key: "performer", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Performer"),
        n("p", { className: "text-xs text-secondary" }, "Any assigned slot may match the selected performer."),
        n("div", { className: "flex flex-wrap gap-2" }, [
          n("button", {
            key: "any",
            type: "button",
            onClick: () => f({ performerId: null }),
            "aria-pressed": g.performerId == null,
            className: $(g.performerId == null)
          }, "All performers"),
          ...r.map((m) => {
            const B = Number(ct(m));
            return n("button", {
              key: B,
              type: "button",
              onClick: () => f({ performerId: B }),
              "aria-pressed": g.performerId === B,
              className: $(g.performerId === B)
            }, m.name);
          })
        ])
      ]) : null,
      n("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        n("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Tag"),
          n("select", {
            key: "select",
            value: g.tagId ?? "",
            onChange: (m) => f({
              tagId: m.target.value === "" ? null : Number(m.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...y.map(([m, B]) => n("option", { key: m, value: m }, B))
          ])
        ]),
        n("label", {
          key: "segment-group",
          className: "space-y-1 text-xs text-secondary"
        }, [
          n("span", { key: "label" }, "Segment group"),
          n("select", {
            key: "select",
            value: g.segmentGroupId ?? "",
            onChange: (m) => f({
              segmentGroupId: m.target.value === "" ? null : m.target.value === "ungrouped" ? "ungrouped" : Number(m.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All Segment groups"),
            ...p.map((m) => n("option", { key: m.id, value: m.id }, m.name)),
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
            onClick: () => f({ sourceKey: null }),
            "aria-pressed": g.sourceKey == null,
            className: $(g.sourceKey == null)
          }, "All provenance"),
          ...o.map((m) => n("button", {
            key: m,
            type: "button",
            onClick: () => f({ sourceKey: m }),
            "aria-pressed": g.sourceKey === m,
            title: m,
            className: $(g.sourceKey === m)
          }, zt(m)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(gc, {
          minimum: g.confidenceMin,
          maximum: g.confidenceMax,
          onChange: ({ minimum: m, maximum: B }) => f({
            confidenceMin: m,
            confidenceMax: B
          })
        }),
        n("label", {
          key: "unscored",
          className: "flex items-center gap-2 text-xs text-secondary"
        }, [
          n("input", {
            key: "input",
            type: "checkbox",
            checked: g.includeUnscored,
            onChange: (m) => f({
              includeUnscored: m.target.checked
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
          onChange: (m) => c(m.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]"
        }),
        n(oc, { key: "icon", hidden: t }),
        n("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    n("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(Dt({})), l && c(!1);
        },
        className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
      }, "Reset filters"),
      n("button", {
        key: "done",
        type: "button",
        onClick: u,
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground"
      }, "Done")
    ])
  ]));
}
const Ea = "segment-studio-editor-history";
function yc({ history: e, historySaving: t, anchorRef: r, onRestore: o, onClose: a }) {
  const i = me(null);
  return ge(() => {
    const s = (d) => {
      ad(d.target, i.current, r == null ? void 0 : r.current) && a();
    }, l = (d) => {
      var g, y, h;
      if (d.key !== "Escape" || d.defaultPrevented || document.querySelector("[role='dialog'], [aria-modal='true']")) return;
      const c = document.activeElement, u = c instanceof Element && (((g = i.current) == null ? void 0 : g.contains(c)) || ((y = r == null ? void 0 : r.current) == null ? void 0 : y.contains(c)));
      d.preventDefault(), a(), u && ((h = r == null ? void 0 : r.current) == null || h.focus({ preventScroll: !0 }));
    };
    return document.addEventListener("pointerdown", s), document.addEventListener("keydown", l), () => {
      document.removeEventListener("pointerdown", s), document.removeEventListener("keydown", l);
    };
  }, [r, a]), n("div", {
    ref: i,
    id: Ea,
    role: "group",
    "aria-label": "Editor history",
    className: "absolute right-3 top-full z-30 mt-1 w-full max-w-md rounded-md border border-border bg-surface p-2 shadow-lg"
  }, [
    n("div", { key: "heading", className: "flex items-center justify-between gap-3 px-2 py-1" }, [
      n("h2", { key: "title", className: "text-sm font-semibold text-foreground" }, "Editor history"),
      n("button", {
        key: "close",
        type: "button",
        onClick: a,
        className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
      }, "Close")
    ]),
    n("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
      ...[...e.actions].reverse().map((s) => n("button", {
        key: s.sequence,
        type: "button",
        disabled: t,
        onClick: () => o(s.sequence),
        "aria-current": e.cursorSequence === s.sequence ? "step" : void 0,
        className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${s.sequence > e.cursorSequence ? "text-secondary" : "text-foreground"} ${e.cursorSequence === s.sequence ? "bg-accent/15" : ""}`
      }, [
        n("span", { key: "label", className: "min-w-0 flex-1 truncate" }, s.label),
        n("time", {
          key: "time",
          dateTime: s.createdAt,
          className: "shrink-0 text-[10px] text-secondary"
        }, new Date(s.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
      ])),
      n("button", {
        key: "baseline",
        type: "button",
        disabled: t,
        onClick: () => o(e.baselineSequence),
        "aria-current": e.cursorSequence === e.baselineSequence ? "step" : void 0,
        className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${e.cursorSequence === e.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
      }, "Before recent changes")
    ])
  ]);
}
function bc({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Qn.filter((l) => In(l, e)), a = Zo(o, 1)[0], i = Zo(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((u) => n("div", { key: u.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, u.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[u.id] ? t[u.id].length > 0 ? t[u.id] : ["Unassigned"] : u.bindings.map(Yi)).map((g, y) => n("kbd", { key: `${u.id}:${y}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, g))
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
    onKeyDownCapture: (l) => Rt(l, { onCancel: r })
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
      n("div", { key: "mobile", className: "space-y-6 lg:hidden" }, a.map(s)),
      n(
        "div",
        { key: "desktop", className: "hidden items-start gap-6 lg:grid lg:grid-cols-2" },
        i.map((l, d) => n("div", { key: d, className: "space-y-6" }, l.map(s)))
      )
    ])
  ]));
}
function hc({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: a,
  onClose: i
}) {
  const s = Md(e), [l, d] = K([]), c = s.map((u) => u.tagName).join("|");
  return ge(() => {
    const u = new Set(s.map((g) => g.tagName));
    d((g) => g.filter((y) => u.has(y)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !t && r == null && i();
    },
    onKeyDownCapture: (u) => Rt(u, {
      onCancel: t || r != null ? void 0 : i
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", { key: "title", id: "segment-studio-examples-title", className: "text-lg font-semibold text-foreground" }, "AI Feedback"),
      n("p", { key: "description", className: "mt-1 text-sm text-secondary" }, `${e.length} registered-AI example${e.length === 1 ? "" : "s"} in this video. Expand a tag to inspect or restore examples before export.`)
    ]),
    n("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      n("div", { key: "items", className: "space-y-3" }, e.length ? s.map((u, g) => {
        const y = l.includes(u.tagName), h = `incorrect-example-tag-${g}`;
        return n("section", {
          key: u.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": y,
            "aria-controls": h,
            onClick: () => d((p) => y ? p.filter((f) => f !== u.tagName) : [...p, u.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: Cr(!1) }
          }, [
            n(
              "span",
              { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" },
              y ? "▾" : "▸"
            ),
            n(
              "span",
              { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
              u.tagName
            ),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${u.examples.length} example${u.examples.length === 1 ? "" : "s"}`
            )
          ]),
          y ? n("div", {
            key: "examples",
            id: h,
            className: "divide-y divide-border border-t border-border"
          }, u.examples.map((p) => {
            const f = `${De(p.startSec)}${p.endSec == null ? "" : ` – ${De(p.endSec)}`}`, w = r === p.id;
            return n("div", {
              key: p.id,
              className: "flex items-center justify-between gap-3 px-3 py-2 text-sm"
            }, [
              n(
                "span",
                { key: "time", className: "font-mono text-xs text-secondary" },
                f
              ),
              n("button", {
                key: "remove",
                type: "button",
                disabled: t || r != null,
                onClick: () => a(p),
                "aria-label": `${w ? "Restoring" : "Restore to review"} ${u.tagName} example at ${f}`,
                className: "rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
              }, w ? "Restoring…" : "Restore to review")
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
        onClick: i,
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
function vc({ segments: e, onSelect: t, onClose: r }) {
  const [o, a] = K(""), [i, s] = K(0), l = me(null), d = We(() => jl(e, o), [e, o]), c = Math.min(i, Math.max(0, d.length - 1)), u = Bl(d);
  ge(() => {
    var y;
    (y = l.current) == null || y.scrollIntoView({ block: "nearest" });
  }, [c, o]);
  const g = () => {
    const y = d[c];
    y && t(y.segment || y);
  };
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-start justify-center bg-black/70 p-4 pt-[10vh]",
    onMouseDown: (y) => {
      y.target === y.currentTarget && r();
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-quick-search-title",
    tabIndex: -1,
    className: "flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    onKeyDownCapture: (y) => {
      var h;
      if (y.key === "Tab")
        Vt(y);
      else if (y.key === "Escape")
        y.preventDefault(), y.stopPropagation(), r();
      else if (y.key === "ArrowDown" || y.key === "ArrowUp") {
        y.preventDefault(), y.stopPropagation();
        const p = y.key === "ArrowDown" ? 1 : -1;
        s((f) => d.length ? (f + p + d.length) % d.length : 0);
      } else y.key === "Enter" && !((h = y.nativeEvent) != null && h.isComposing) && (y.preventDefault(), y.stopPropagation(), g());
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
        onChange: (y) => {
          a(y.target.value), s(0);
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
    }, d.length ? d.flatMap((y, h) => {
      var F;
      const p = y.segment || y, f = p.endSec == null ? De(p.startSec) : `${De(p.startSec)} – ${De(p.endSec)}`, w = `${zt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, $ = h === c, m = h > 0 ? d[h - 1].groupKey : null, B = u && y.groupKey !== m ? n("div", {
        key: `group:${y.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, y.groupName) : null, W = n("button", {
        key: p.id,
        id: `segment-quick-search-${p.id}`,
        ref: $ ? l : null,
        type: "button",
        role: "option",
        "aria-selected": $,
        onMouseEnter: () => s(h),
        onClick: () => t(p),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${$ ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        u ? n("span", { key: "group", className: "sr-only" }, `${y.groupName} group`) : null,
        n(ln, { key: "review", state: p.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        (F = y.performers) != null && F.length ? n(Tr, {
          key: "performers",
          performers: y.performers,
          performerAssignments: y.performerAssignments
        }) : null,
        n(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          f
        ),
        n("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: w
        }, w)
      ]);
      return B ? [B, W] : [W];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function xc(e) {
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
    drafts: r.drafts.sort((o, a) => o.startSec - a.startSec || String(o.id).localeCompare(String(a.id)))
  })).sort((r, o) => r.tagName.localeCompare(o.tagName) || r.key.localeCompare(o.key));
}
function Sc({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: a,
  onClose: i
}) {
  const s = We(() => xc(e), [e]), [l, d] = K([]), c = s.reduce((h, p) => h + p.drafts.length, 0), u = me(null);
  go({ confirmRef: u, cancelRef: o, confirmReady: !t && c > 0 });
  const g = (h) => d((p) => p.includes(h) ? p.filter((f) => f !== h) : [...p, h]), y = (h) => `segment-studio-publish-approved-${h.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && !t && i();
    },
    onKeyDownCapture: (h) => Rt(h, {
      onCancel: t ? void 0 : i,
      onConfirm: c > 0 && !t ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
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
      ].flatMap(([h, p]) => [
        n("dt", { key: `${h}:label`, className: "text-secondary" }, h),
        n("dd", { key: `${h}:value`, className: "font-semibold text-foreground" }, String(p))
      ])),
      s.length ? n("div", { key: "groups", className: "space-y-2" }, s.map((h) => {
        const p = l.includes(h.key);
        return n("section", { key: h.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": p,
            "aria-controls": y(h),
            onClick: () => g(h.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: Cr(!1) }
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, p ? "▾" : "▸"),
            n("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, h.tagName),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${h.drafts.length} draft${h.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          p ? n("div", {
            key: "drafts",
            id: y(h),
            className: "divide-y divide-border border-t border-border"
          }, h.drafts.map((f) => {
            const w = f.endSec == null ? De(f.startSec) : `${De(f.startSec)} – ${De(f.endSec)}`, $ = `${zt(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`;
            return n("div", { key: f.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(ln, { key: "review", state: f.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, w),
              n("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: $
              }, $)
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
        onClick: i,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Cancel"),
      n("button", {
        key: "confirm",
        ref: u,
        type: "button",
        disabled: t || c === 0,
        onClick: a,
        className: "rounded-md border border-emerald-500/60 bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-emerald-500/30 disabled:opacity-50"
      }, t ? "Publishing…" : `Publish ${c} approved draft${c === 1 ? "" : "s"}`)
    ])
  ]));
}
function kc({ candidates: e, processing: t, error: r, onConfirm: o, onClose: a }) {
  const i = Ll(e), [s, l] = K(() => /* @__PURE__ */ new Set()), [d, c] = K(() => new Set(i.map((f) => f.key))), u = i.flatMap((f) => d.has(f.key) ? f.candidates : []), g = (f) => l((w) => {
    const $ = new Set(w);
    return $.has(f) ? $.delete(f) : $.add(f), $;
  }), y = (f) => c((w) => {
    const $ = new Set(w);
    return $.has(f) ? $.delete(f) : $.add(f), $;
  }), h = (f) => f.assignment.map(({ slot: w, performer: $ }) => `${w.label || `Slot ${w.sortOrder + 1}`}: ${$.name}`).join(", "), p = (f) => `segment-studio-auto-assign-${f.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (f) => {
      f.target === f.currentTarget && !t && a();
    },
    onKeyDownCapture: (f) => {
      f.key === "Enter" && f.target instanceof HTMLInputElement || Rt(f, {
        onCancel: t ? void 0 : a,
        onConfirm: u.length && !t ? () => o(u) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
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
      e.length ? n("div", { className: "space-y-3" }, i.map((f) => n("section", { key: f.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
        n("header", {
          key: "header",
          className: "flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2",
          style: { background: Cr(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(f.key),
            disabled: t,
            onChange: () => y(f.key),
            "aria-label": `Include ${f.tagName} assignment: ${h(f)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(f.key),
            "aria-controls": p(f),
            "aria-label": `${s.has(f.key) ? "Collapse" : "Expand"} ${f.tagName} assignment: ${h(f)}`,
            onClick: () => g(f.key),
            className: "shrink-0 rounded px-1 text-sm text-secondary hover:bg-muted/50 hover:text-foreground disabled:opacity-50"
          }, s.has(f.key) ? "▾" : "▸"),
          n(
            "span",
            { key: "tag", className: "min-w-24 flex-1 truncate text-sm font-semibold text-foreground" },
            f.tagName
          ),
          n(
            "span",
            { key: "performers", className: "flex min-w-0 flex-wrap items-center gap-2" },
            f.assignment.map(({ slot: w, performer: $ }) => {
              const m = w.label || `Slot ${w.sortOrder + 1}`;
              return n("span", {
                key: w.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${m}: ${$.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${m}: ${$.name}`
                }, `${m}: ${$.name}`),
                n(Yn, {
                  key: "avatar",
                  performer: { id: $.performerId, name: $.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(en, { key: "states", counts: f.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(f.candidates),
            "aria-label": `Auto-Assign ${f.tagName}: ${h(f)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${f.candidates.length})`)
        ]),
        s.has(f.key) ? n(
          "div",
          { key: "segments", id: p(f), className: "divide-y divide-border/70" },
          f.candidates.map((w) => {
            const $ = w.endSec == null ? De(w.startSec) : `${De(w.startSec)} – ${De(w.endSec)}`, m = `${zt(w.sourceKey)}${w.confidence == null ? "" : ` · ${Math.round(w.confidence * 100)}%`}`;
            return n("div", {
              key: w.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(ln, { key: "review", state: w.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                w.tagName || "Tag segment"
              ),
              n(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                $
              ),
              n("span", {
                key: "provenance",
                className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                title: m
              }, m)
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
      n("button", { key: "cancel", type: "button", disabled: t, onClick: a, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Cancel"),
      n("button", {
        key: "confirm",
        type: "button",
        autoFocus: !0,
        disabled: t || u.length === 0,
        onClick: () => o(u),
        className: "rounded-md border border-violet-400/60 bg-violet-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-violet-500/30 disabled:opacity-50"
      }, t ? "Assigning…" : `Auto-Assign ${u.length} Segment${u.length === 1 ? "" : "s"}`)
    ])
  ]));
}
function wc({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, a = Number(e.dependentSegmentCount) || 0, i = Number(e.deletedSegmentCount) || o + a, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => Rt(d, { onCancel: r, onConfirm: t })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
    className: "w-full max-w-lg overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", { key: "title", id: "segment-studio-delete-rejected-title", className: "text-lg font-semibold text-foreground" }, "Permanently delete rejected segments?"),
      n(
        "p",
        { key: "summary", className: "mt-1 text-sm text-secondary" },
        `${o} rejected segment${o === 1 ? "" : "s"}${a ? ` and ${a} dependent derived segment${a === 1 ? "" : "s"}` : ""} will be deleted (${i} total).`
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
function Nc({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: a,
  onClose: i
}) {
  const [s, l] = K(!1), d = me(null);
  if (go({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : De(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !t && i();
    },
    onKeyDownCapture: (u) => Rt(u, {
      onCancel: t ? void 0 : i,
      onConfirm: t ? void 0 : () => a(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
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
        `${De(e.startSec)} – ${c}`
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
          onChange: (u) => l(u.target.checked),
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
        onClick: i,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Cancel"),
      n("button", {
        key: "confirm",
        ref: d,
        type: "button",
        disabled: t,
        onClick: () => a(s),
        className: "rounded-md border border-destructive/60 bg-destructive/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-destructive/25 disabled:opacity-50"
      }, t ? "Merging…" : "Merge segments")
    ])
  ]));
}
function Ic(e) {
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
function Cc({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: a, onConfirm: i, onClose: s }) {
  var g, y;
  const l = e ? e.createCount + e.linkCount : 0, d = me(null);
  go({ confirmRef: d, cancelRef: a, confirmReady: !t && !r && l > 0 && !o });
  const c = ((g = e == null ? void 0 : e.outputs) == null ? void 0 : g.slice(0, 200)) || [], u = Ic(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && !r && s();
    },
    onKeyDownCapture: (h) => Rt(h, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
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
        ].flatMap(([h, p]) => [
          n("dt", { key: `${h}:label`, className: "text-secondary" }, h),
          n("dd", { key: `${h}:value`, className: "font-semibold text-foreground" }, String(p))
        ])),
        e.conflictCount > 0 ? n(
          "p",
          { key: "conflicts", role: "status", className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground" },
          `${e.conflictCount} existing derivation ${e.conflictCount === 1 ? "branch was" : "branches were"} skipped because its lineage no longer matches the active rule. Resolve these through lineage maintenance.`
        ) : null,
        u.length ? n("div", { key: "outputs", className: "space-y-2" }, [
          ...u.map((h) => n("article", {
            key: h.key,
            className: "rounded-md border border-border bg-surface p-3"
          }, [
            n("div", { key: "root", className: "flex min-w-0 items-center gap-2" }, [
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
                `${h.rootTagName} @ ${De(h.rootStartSec)}`
              ),
              n(
                "span",
                { key: "count", className: "shrink-0 text-xs font-medium text-secondary" },
                `${h.outputs.length} ${h.outputs.length === 1 ? "change" : "changes"}`
              )
            ]),
            n(
              "div",
              { key: "tree", className: "mt-2 space-y-1 border-l border-border pl-2" },
              h.outputs.map((p, f) => n("div", {
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
          (((y = e.outputs) == null ? void 0 : y.length) || 0) > c.length ? n(
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
      n("button", { key: "cancel", ref: a, type: "button", disabled: r, onClick: s, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Cancel"),
      n("button", {
        key: "confirm",
        ref: d,
        type: "button",
        disabled: t || r || l === 0,
        onClick: i,
        className: "rounded-md border border-indigo-400/60 bg-indigo-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-indigo-500/30 disabled:opacity-50"
      }, r ? "Materializing…" : `Materialize ${l} change${l === 1 ? "" : "s"}`)
    ])
  ]));
}
function $c({
  compatibilityMode: e,
  selectedSegment: t,
  selectedSegments: r = [],
  selectedGroups: o = [],
  saveMessage: a,
  savingSegmentId: i,
  creatingSegmentId: s = null,
  saveTag: l,
  saveTiming: d,
  slotStatus: c,
  performerSlotsAvailable: u,
  selectedPerformerSlots: g,
  performerSlots: y,
  detail: h,
  video: p,
  slotButtonRef: f,
  tagSearchRef: w,
  onDetailChange: $,
  setSaveMessage: m,
  acquireSaveLock: B,
  onSlotsChanged: W,
  onRecordHistory: F,
  onCancelQueuedReview: G,
  splitSegment: A,
  duplicateSegment: I,
  provenance: k,
  lineage: S,
  onNavigateLineageItem: E,
  tagEditing: U,
  onCancelTagEditing: R,
  detailPanelRef: M,
  onReduceSelection: z
}) {
  var fe, Ce, Pe, pe;
  const Y = me(null), H = me(null), ae = () => {
    var Q;
    (Q = H.current) == null || Q.call(H), H.current = null;
  }, de = me(null), ve = me(null), D = me(null), le = me(null), [se, X] = K(!1);
  ge(() => {
    Y.current && (Y.current.scrollTop = 0), X(!1);
  }, [t == null ? void 0 : t.id]), ge(() => {
    var Q, he;
    se && ((he = (Q = de.current) == null ? void 0 : Q.querySelector("input, select, button")) == null || he.focus({ preventScroll: !0 }));
  }, [se]);
  function ye() {
    X(!1), requestAnimationFrame(() => {
      var Q;
      return (Q = f.current) == null ? void 0 : Q.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const Q = !r.some((J) => J.isDerived), he = e && u ? cd(y, r) : null, T = (he == null ? void 0 : he.map((J, C) => {
      var b;
      const v = r[C];
      return {
        segmentId: v.nativeSegmentId,
        itemId: v.published ? null : v.itemId,
        revision: (b = h.performerSlotRevisions) == null ? void 0 : b[v.id],
        slots: J
      };
    })) || [];
    return n(oo.Fragment, null, [
      n(ac, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: M,
        onReduceSelection: z,
        reviewable: e,
        tagEditable: Q,
        slotsEditable: T.length > 0 && i == null,
        onEditSlots: () => X(!0),
        slotButtonRef: f,
        saveMessage: a
      }),
      U && Q ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (J) => {
          J.target === J.currentTarget && R();
        },
        onKeyDownCapture: (J) => Rt(J, { onCancel: R })
      }, n("section", {
        ref: w,
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
        n(Wn, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (J, C) => J == null ? R() : l(J, C == null ? void 0 : C.label),
          disabled: i != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: R,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      se && T.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (J) => {
          J.target === J.currentTarget && ye();
        },
        onKeyDownCapture: (J) => {
          var v, b;
          if (!(typeof ((v = J.target) == null ? void 0 : v.closest) == "function" ? J.target.closest("input, textarea, select, [contenteditable='true']") : null) && !J.repeat && !J.ctrlKey && !J.altKey && !J.metaKey && !J.shiftKey && /^[1-9]$/.test(J.key) && ((b = le.current) != null && b.call(le, Number(J.key) - 1))) {
            J.preventDefault(), J.stopPropagation();
            return;
          }
          Rt(J, { onCancel: ye });
        }
      }, n("section", {
        ref: de,
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
          n("button", { key: "close", type: "button", onClick: ye, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(nc, {
          videoId: p.id,
          targets: T,
          performerCandidates: h.performerCandidates || [],
          shortcutRef: le,
          acquireSaveLock: () => B("slots", -1),
          onSaved: async ({ beforeState: J, afterState: C }) => {
            await F(
              "performer-slots.assign",
              `Assigned performers to ${T.length} segments`,
              J,
              C
            ), ye(), await W();
          },
          onConflict: W
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (Q) => {
      Y.current = Q, M && (M.current = Q);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(ln, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(Rr, { key: "derived" }) : null,
        t && U ? n("div", {
          key: "tag-editor",
          ref: w,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (Q) => {
            Q.key === "Escape" && (Q.preventDefault(), Q.stopPropagation(), R());
          },
          onKeyDown: (Q) => {
            sd(Q, t.tagName) && (Q.preventDefault(), Q.stopPropagation(), l(t.tagId));
          }
        }, n(Wn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (Q, he) => Q == null ? R() : l(Q, he == null ? void 0 : he.label),
          disabled: hl(i, t.id, s) || ((fe = S.data) == null ? void 0 : fe.tagReadOnly) === !0,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? n("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : n("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? n("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        n("span", { key: "start" }, De(t.startSec)),
        t.endSec == null ? null : n("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : n("span", { key: "end" }, De(t.endSec))
      ]) : null,
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(ec, { status: c })) : null,
      t && u && g.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(ha, {
        assignments: g.map((Q) => {
          const he = pd(Q);
          return {
            key: String(Q.slotDefinitionId),
            label: he.label,
            performer: he.filled ? { id: Number(Q.performerId), name: he.performer } : null,
            title: he.title
          };
        })
      })) : null,
      a ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, a) : null
    ]),
    t ? n(ic, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: k
    }) : null,
    t ? n("div", { key: "controls", hidden: !0 }, [
      n("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        n("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        S.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : S.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, S.error) : S.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${S.data.derived ? "Derived segment" : "Root segment"} · ${S.data.componentSize} segment${S.data.componentSize === 1 ? "" : "s"} · ${S.data.integrityState}`
          ),
          (Ce = S.data.parents) != null && Ce.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...S.data.parents.map((Q) => n("button", {
              key: Q.nodeId,
              type: "button",
              onClick: () => E(Q.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${Q.ruleKey} ${Q.ruleVersion}`))
          ]) : null,
          (Pe = S.data.children) != null && Pe.length ? n("p", { key: "children" }, `Children: ${S.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: i != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: f,
          type: "button",
          disabled: i != null || !u || g.length === 0,
          onClick: () => X(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: u ? g.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, g.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: i != null,
          onClick: A,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        n("button", {
          key: "duplicate",
          type: "button",
          disabled: i != null,
          onClick: () => I(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        n("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: i != null,
          onClick: () => I(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    se && e && t && u && g.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (Q) => {
        Q.target === Q.currentTarget && ye();
      },
      onKeyDownCapture: (Q) => {
        var T, J;
        if (!(typeof ((T = Q.target) == null ? void 0 : T.closest) == "function" ? Q.target.closest("input, textarea, select, [contenteditable='true']") : null) && !Q.repeat && !Q.ctrlKey && !Q.altKey && !Q.metaKey && !Q.shiftKey && /^[1-9]$/.test(Q.key) && ((J = D.current) != null && J.call(D, Number(Q.key) - 1))) {
          Q.preventDefault(), Q.stopPropagation();
          return;
        }
        Rt(Q, {
          onCancel: ye,
          onConfirm: () => {
            var C;
            return (C = ve.current) == null ? void 0 : C.click();
          }
        });
      }
    }, n("section", {
      ref: de,
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
        n("button", { key: "close", type: "button", onClick: ye, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(tc, {
        key: `${t.id}:${h.performerSlotsRevision || h.slotRevision || ""}`,
        videoId: p.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: g,
        revision: (pe = h.performerSlotRevisions) == null ? void 0 : pe[t.id],
        performerCandidates: h.performerCandidates || [],
        confirmRef: ve,
        shortcutRef: D,
        onOptimisticSave: (Q) => {
          const he = B("slots", t.id);
          if (!he)
            return m("Wait for the current save to finish before saving performer slots."), !1;
          H.current = he, $((T) => Zt(
            T,
            t.id,
            Q
          ), p.id), m("Saving performer slots…"), ye();
        },
        onSaved: async (Q, { beforeState: he, afterState: T }) => {
          $((J) => Zt(
            J,
            t.id,
            Q.slots || [],
            Q.revision
          ), p.id), m("Performer slots saved.");
          try {
            await F(
              "performer-slots.assign",
              "Assigned performers",
              he,
              T
            ), await W(Q) || G([t]);
          } finally {
            ae();
          }
        },
        onRollback: async (Q, he) => {
          G([t]), $((T) => {
            var J;
            return Zt(
              T,
              t.id,
              Q,
              (J = h.performerSlotRevisions) == null ? void 0 : J[t.id]
            );
          }, p.id), m(he.message || "Unable to save performer slots.");
          try {
            he.status === 409 && await W();
          } finally {
            ae();
          }
        },
        onConflict: W
      }))
    ])) : null
  ]);
}
function Tc({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: a = [], selectedGroupKey: i, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: u, onZoomChange: g, onSelectGroup: y, onToggleGroup: h, onSelect: p, onSelectSegments: f, onSelectAll: w, onConfigureTag: $, onSeekTime: m, centerRef: B, showReviewState: W = !0, swimlaneTitleWidth: F, onSwimlaneTitleWidthChange: G }) {
  const A = me(null), I = me(null), [k, S] = K(0), [E, U] = K({ scrollTop: 0, height: 320 }), [R, M] = K(null), z = We(
    () => an(e, r, o),
    [e, r, o]
  ), Y = We(
    () => pa(o),
    [o]
  ), H = We(() => yo(z), [z]), ae = We(
    () => vd(H, a, fa(H)),
    [H, a]
  ), de = We(
    () => ya(ae.rows, Math.max(0, E.scrollTop - 24), E.height),
    [ae, E]
  ), ve = Math.max(0, Number(d) || 0), D = Gs(k), le = hr(F, D), se = le / 16, X = Fs(c, ve, se), ye = Ds(ve), fe = Os(ve, Math.max(1, k - se * 16), u), Ce = ye.filter((b, x) => x === 0 || x % fe === 0), Pe = We(() => z.map((b) => `${b.key}:${b.trackCount}:${b.markers.map(({ segment: x, track: P }) => `${x.id}:${x.startSec}:${x.endSec ?? ""}:${P}`).join(",")}`).join("|"), [z]);
  function pe() {
    const b = I.current;
    if (!b) return;
    const x = b.querySelector("[data-timeline-track]"), P = b.firstElementChild, te = x == null ? void 0 : x.getBoundingClientRect(), ne = P == null ? void 0 : P.getBoundingClientRect(), L = te && ne ? Math.max(0, te.left - ne.left) : se * 16, re = (ne == null ? void 0 : ne.width) ?? b.scrollWidth;
    b.scrollTo({
      left: js(c, ve, re, b.clientWidth, L, zi),
      behavior: "smooth"
    });
  }
  ge(() => (B.current = pe, () => {
    B.current === pe && (B.current = null);
  })), ge(() => {
    pe();
  }, [u]);
  function Q() {
    const b = I.current, x = ae.rows.find((re) => re.kind === "lane" && re.lane.markers.some(({ segment: N }) => N.id === s));
    if (!b || !x) return;
    const P = 24, te = x.top + P, ne = te + x.height;
    let L = b.scrollTop;
    te < b.scrollTop + P ? L = Math.max(0, te - P) : ne > b.scrollTop + b.clientHeight && (L = Math.max(0, ne - b.clientHeight)), L !== b.scrollTop && (b.scrollTop = L), U({ scrollTop: L, height: b.clientHeight });
  }
  ge(() => {
    Q();
  }, [s, Pe, ae]), ge(() => {
    const b = I.current, x = ae.rows.find((re) => re.kind === "group" && re.group.key === i);
    if (!b || !x) return;
    const P = 24, te = x.top + P, ne = te + x.height;
    let L = b.scrollTop;
    te < b.scrollTop + P ? L = Math.max(0, te - P) : ne > b.scrollTop + b.clientHeight && (L = Math.max(0, ne - b.clientHeight)), L !== b.scrollTop && (b.scrollTop = L), U({ scrollTop: L, height: b.clientHeight });
  }, [i, ae]), ge(() => {
    const b = I.current;
    if (!b || typeof ResizeObserver > "u") return;
    const x = () => {
      S(b.clientWidth), U({ scrollTop: b.scrollTop, height: b.clientHeight }), Q();
    }, P = new ResizeObserver(x);
    return P.observe(b), x(), () => P.disconnect();
  }, [s, Pe, ae]);
  function he(b) {
    if (!(ve > 0)) return;
    const x = b.currentTarget.getBoundingClientRect(), P = Math.min(1, Math.max(0, (b.clientX - x.left) / x.width));
    m(P * ve);
  }
  function T(b) {
    const x = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let P = null;
    Object.hasOwn(x, b.key) && (P = c + x[b.key]), b.key === "Home" && (P = 0), b.key === "End" && (P = ve), P != null && (b.preventDefault(), b.stopPropagation(), m(Math.min(ve, Math.max(0, P))));
  }
  function J(b) {
    var P;
    const x = (P = A.current) == null ? void 0 : P.getBoundingClientRect();
    x && G(hr(b.clientX - x.left, D));
  }
  function C(b) {
    const x = b.shiftKey ? 40 : 16;
    let P = null;
    b.key === "ArrowLeft" && (P = le - x), b.key === "ArrowRight" && (P = le + x), b.key === "Home" && (P = 160), b.key === "End" && (P = D), P != null && (b.preventDefault(), b.stopPropagation(), G(hr(P, D)));
  }
  const v = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: A,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (b) => {
          (b.metaKey || b.ctrlKey) && (b.preventDefault(), w == null || w());
        },
        onKeyDown: (b) => {
          b.key !== "Enter" && b.key !== " " || (b.preventDefault(), w == null || w());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: v, disabled: u <= 1, onClick: () => g(wr(u - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: v, disabled: u === 1, onClick: () => g(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(u * 100)}%`),
      n("button", { key: "in", type: "button", className: v, disabled: u >= 8, onClick: () => g(wr(u + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: v, onClick: pe, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(D),
      "aria-valuenow": Math.round(le),
      "aria-valuetext": `${Math.round(le)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (b) => {
        b.currentTarget.setPointerCapture(b.pointerId), J(b);
      },
      onPointerMove: (b) => {
        b.currentTarget.hasPointerCapture(b.pointerId) && J(b);
      },
      onKeyDown: C,
      onDoubleClick: () => G(Tt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${le - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: I,
      onScroll: (b) => U({
        scrollTop: b.currentTarget.scrollTop,
        height: b.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: Bs(u) }, [
      n("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${se}rem minmax(0,1fr)`, height: "1.5rem" } }, [
        n("div", { key: "axis-label", "data-timeline-label-gutter": "true", "aria-hidden": "true", className: "sticky left-0 z-40 border-r border-border", style: { backgroundColor: "var(--color-surface)" } }),
        n("div", {
          key: "ticks",
          role: "slider",
          tabIndex: 0,
          "data-timeline-seeker": "true",
          "data-timeline-track": "true",
          "aria-label": "Timeline seek",
          "aria-valuemin": 0,
          "aria-valuemax": ve,
          "aria-valuenow": Math.min(ve, Math.max(0, c)),
          "aria-valuetext": De(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: he,
          onKeyDown: T
        }, Ce.map((b, x) => n("span", {
          key: b,
          className: `absolute top-0 ${Ps(x, Ce.length, ve > 0 ? b / ve * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Ls(x, Ce.length, ve > 0 ? b / ve * 100 : 0)
        }, De(b))).concat(t.map((b) => {
          const x = ve > 0 ? b.startSec / ve * 100 : 0;
          return n("button", {
            key: `shot-boundary:${b.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${De(b.startSec)} – ${De(b.endSec)}`,
            title: `Shot boundary · ${b.source || "manual"} · ${De(b.startSec)} – ${De(b.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${x}%`, width: "2px" },
            onClick: (P) => {
              P.stopPropagation(), m(b.startSec);
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
            ...qo(X),
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
        style: z.length > 0 ? { height: ae.height } : void 0
      }, [
        z.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...qo(X, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        z.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : de.map((b) => {
          var q;
          const x = b.group, P = a.includes(x.key), te = i === x.key, ne = Cr(te);
          if (b.kind === "group") return n("div", {
            key: b.key,
            "data-segment-group": x.key,
            "data-segment-group-collapsed": P ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${se}rem minmax(0,1fr)`,
              backgroundColor: ne,
              top: b.top,
              height: b.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (j) => {
                if (j.metaKey || j.ctrlKey) {
                  f(x.lanes.flatMap((Z) => Z.markers.map((be) => be.segment.id)));
                  return;
                }
                y(x.key), h(x.key);
              },
              "aria-expanded": !P,
              "aria-current": te ? "true" : void 0,
              "data-selected-timeline-group": te ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: x.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: ne
              },
              title: `${P ? "Expand" : "Collapse"} ${x.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, P ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, x.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              P ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${x.lanes.length} swimlane${x.lanes.length === 1 ? "" : "s"} hidden`
                ),
                W ? n(en, { key: "states", counts: x.counts }) : null
              ] : null
            )
          ]);
          const L = b.lane, re = td(b.laneIndex), N = L.markers.some(({ segment: j }) => j.id === s);
          return n("div", {
            key: b.key,
            "data-grouped-swimlane": x.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${se}rem minmax(0,1fr)`,
              top: b.top,
              height: b.height,
              backgroundColor: re
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": N ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: nd(N, re),
              title: `${Jn(L)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Jn(L),
              onClick: (j) => {
                (j.metaKey || j.ctrlKey) && f(L.markers.map((Z) => Z.segment.id));
              },
              onMouseEnter: () => M(L.key),
              onMouseLeave: () => M((j) => j === L.key ? null : j)
            }, [
              L.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (j) => {
                  j.stopPropagation(), $({ tagId: L.tagId, tagName: L.label, trigger: j.currentTarget });
                },
                "aria-label": `Configure ${L.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: R === L.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, L.label),
              (q = L.performers) != null && q.length ? n(Tr, {
                key: "performers",
                performers: L.performers,
                performerAssignments: L.performerAssignments
              }) : null,
              W ? n(en, { key: "counts", counts: L.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, L.markers.map(({ segment: j, track: Z }) => {
              var ht;
              const be = Jr(j.startSec, ve), ue = j.endSec == null ? j.startSec : Math.max(j.startSec, j.endSec), $e = Math.max(0, Jr(ue, ve) - be), pt = l.includes(j.id), Ge = j.id === s, Te = fo(Y.get(j.id)), Ye = j.endSec == null ? De(j.startSec) : `${De(j.startSec)} – ${De(j.endSec)}`, it = (ht = ma[Te]) == null ? void 0 : ht.label;
              return n("button", {
                key: j.id,
                type: "button",
                onClick: (Xe) => {
                  Xe.stopPropagation(), p(j, {
                    additive: Xe.metaKey || Xe.ctrlKey,
                    rangeSegmentIds: Xe.shiftKey ? L.markers.map((yt) => yt.segment.id) : null
                  });
                },
                "aria-pressed": pt,
                "aria-current": Ge ? "true" : void 0,
                "data-selected-timeline-marker": Ge ? "true" : void 0,
                "data-selected-segment-shortcut-target": Ge ? "true" : void 0,
                "aria-label": W ? `${j.tagName || "Tag segment"}${L.performerLabel ? `, ${L.performerLabel}` : ""}, ${j.reviewState}${it ? `, ${it}` : ""}, ${Ye}` : `${j.tagName || "Tag segment"}${L.performerLabel ? `, ${L.performerLabel}` : ""}, ${Ye}`,
                title: W ? `${j.tagName || "Tag segment"}${L.performerLabel ? ` · ${L.performerLabel}` : ""} · ${j.reviewState}${it ? ` · ${it}` : ""} · ${Ye}` : `${j.tagName || "Tag segment"}${L.performerLabel ? ` · ${L.performerLabel}` : ""} · ${Ye}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...W ? Zl(j.reviewState, pt, Te, Ge) : Xl(pt, Ge),
                  left: `${be}%`,
                  top: `${rd(Z)}rem`,
                  width: ed(j.endSec, $e),
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
function vo({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: a
}) {
  const [i, s] = K(null), [l, d] = K([]), [c, u] = K(null), [g, y] = K(""), [h, p] = K(!0), [f, w] = K(null), [$, m] = K(""), [B, W] = K(!1), F = me(null), G = me(0);
  ge(() => {
    const R = requestAnimationFrame(() => {
      var M;
      return (M = F.current) == null ? void 0 : M.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(R);
  }, [e]), ge(() => {
    const R = new AbortController();
    return p(!0), m(""), Promise.all([
      r ? ee(`/slot-definitions/${e}`, { signal: R.signal }) : Promise.resolve(null),
      ee("/segment-groups", { signal: R.signal })
    ]).then(([M, z]) => {
      const Y = z.find((H) => (H.tags || []).some((ae) => Number(ae.tagId) === Number(e)));
      s(M), d(z), u((Y == null ? void 0 : Y.id) ?? null), y(Y == null ? "" : String(Y.id)), W(!1);
    }).catch((M) => {
      M.name !== "AbortError" && m(M.message || "Unable to load tag configuration.");
    }).finally(() => {
      R.signal.aborted || p(!1);
    }), () => R.abort();
  }, [r, e]);
  function A(R, M) {
    s({
      ...i,
      definitions: i.definitions.map((z, Y) => Y === R ? { ...z, ...M } : z)
    });
  }
  function I(R, M) {
    const z = R + M;
    if (z < 0 || z >= i.definitions.length) return;
    const Y = [...i.definitions];
    [Y[R], Y[z]] = [Y[z], Y[R]], s({
      ...i,
      definitions: Y.map((H, ae) => ({ ...H, sortOrder: ae }))
    });
  }
  function k(R) {
    const M = i.definitions[R], z = Number(M.assignmentCount) || 0, Y = z === 0 ? "" : ` and its ${z} assignment${z === 1 ? "" : "s"}`;
    window.confirm(`Delete “${It(M)}”${Y}?`) && (z > 0 && W(!0), s({
      ...i,
      definitions: i.definitions.filter((H, ae) => ae !== R).map((H, ae) => ({ ...H, sortOrder: ae }))
    }));
  }
  async function S() {
    var M;
    w("slots"), m("Saving performer slots…");
    let R;
    try {
      R = await ee(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: i.revision,
          allowSamePerformerInMultipleSlots: !!i.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: B,
          definitions: i.definitions.map((z, Y) => {
            var H;
            return {
              id: z.id || void 0,
              label: ((H = z.label) == null ? void 0 : H.trim()) || null,
              sortOrder: Y,
              genderHints: z.genderHints || []
            };
          })
        })
      }), s(R), W(!1);
    } catch (z) {
      z.status === 409 ? (m("Performer slots changed elsewhere; current values were reloaded."), (M = z.payload) != null && M.current && (s(z.payload.current), W(!1))) : m(z.message || "Unable to save performer slots."), w(null);
      return;
    }
    try {
      await o(), m("Performer slots saved.");
    } catch {
      m("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      w(null);
    }
  }
  async function E() {
    const R = g === "" ? null : Number(g);
    if (R !== c) {
      w("group"), m("Saving tag group…");
      try {
        await ee(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: R })
        });
      } catch (M) {
        m(M.message || "Unable to assign the tag group."), w(null);
        return;
      }
      try {
        const [M, z] = await Promise.allSettled([
          ee("/segment-groups"),
          o()
        ]);
        if (M.status === "fulfilled") {
          d(M.value);
          const Y = M.value.find((ae) => (ae.tags || []).some((de) => Number(de.tagId) === Number(e))), H = (Y == null ? void 0 : Y.id) ?? null;
          u(H), y(H == null ? "" : String(H));
        }
        m(
          M.status === "fulfilled" && z.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        w(null);
      }
    }
  }
  l.find((R) => Number(R.id) === Number(c));
  const U = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (R) => {
      R.target === R.currentTarget && !f && a();
    },
    onKeyDownCapture: (R) => Rt(R, {
      onCancel: f ? void 0 : a
    })
  }, n("section", {
    ref: F,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
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
        h ? null : n("label", { key: "choice", className: "block space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Assigned group"),
          n("select", {
            key: "select",
            value: g,
            disabled: f != null,
            onChange: (R) => y(R.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((R) => n("option", { key: R.id, value: String(R.id) }, R.name))
          ])
        ]),
        h ? null : n("button", {
          key: "save",
          type: "button",
          disabled: f != null || (g === "" ? null : Number(g)) === c,
          onClick: E,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, f === "group" ? "Saving…" : "Save tag group")
      ]),
      r ? n("section", { key: "slots", className: "space-y-3 border-t border-border pt-5", "aria-labelledby": "inline-tag-slots-heading" }, [
        n("div", { key: "heading" }, [
          n("h3", { key: "title", id: "inline-tag-slots-heading", className: "text-sm font-semibold text-foreground" }, "Performer slots"),
          n("p", { key: "copy", className: "text-xs text-secondary" }, "Define the ordered performer roles used by this tag.")
        ]),
        h ? n("p", { key: "loading", className: "rounded-md border border-dashed border-border p-4 text-sm text-secondary" }, "Loading performer slots…") : i ? n("div", { key: "editor", className: "space-y-3" }, [
          n("label", { key: "duplicates", className: "flex items-center gap-2 text-sm" }, [
            n("input", {
              key: "input",
              type: "checkbox",
              checked: !!i.allowSamePerformerInMultipleSlots,
              disabled: f != null,
              onChange: (R) => s({ ...i, allowSamePerformerInMultipleSlots: R.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(i.definitions || []).map((R, M) => n("article", {
            key: R.id || R._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: R.label || "",
                disabled: f != null,
                onChange: (z) => A(M, { label: z.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Rs.map((z) => n("label", { key: z, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: f != null,
                  checked: (R.genderHints || []).includes(z),
                  onChange: (Y) => A(M, {
                    genderHints: Y.target.checked ? [.../* @__PURE__ */ new Set([...R.genderHints || [], z])] : (R.genderHints || []).filter((H) => H !== z)
                  })
                }),
                n("span", { key: "text" }, $r(z))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${R.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: f != null || M === 0, onClick: () => I(M, -1), className: U, "aria-label": `Move ${It(R)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: f != null || M === i.definitions.length - 1, onClick: () => I(M, 1), className: U, "aria-label": `Move ${It(R)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: f != null, onClick: () => k(M), className: `${U} text-red-300` }, "Delete")
            ])
          ])),
          n("div", { key: "buttons", className: "flex items-center gap-2" }, [
            n("button", {
              key: "add",
              type: "button",
              disabled: f != null,
              onClick: () => s({
                ...i,
                definitions: [...i.definitions, {
                  _clientKey: `new-${++G.current}`,
                  label: "",
                  sortOrder: i.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: U
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: f != null,
              onClick: S,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, f === "slots" ? "Saving…" : "Save performer slots")
          ])
        ]) : null
      ]) : null,
      $ ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, $) : null
    ]),
    n(
      "footer",
      { key: "footer", className: "flex items-center justify-end border-t border-border px-5 py-4" },
      n("button", {
        type: "button",
        disabled: f != null,
        onClick: a,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Close")
    )
  ]));
}
function Rc(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function Mc(e) {
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, approvalFacetCounts: a, autoAssignCandidates: i, autoAssignError: s, autoAssignOpen: l, autoAssignPerformers: d, autoAssigning: c, cancelQueuedReviewsForSegments: u, canMoveSelectionToBin: g, captureTrainingExport: y, centerTimelineRef: h, closeEditorFilters: p, closeFirstSegmentTagDialog: f, closeMaterializeDialog: w, closeMergeConfirmation: $, closePublishApprovedDialog: m, closeTagEditing: B, collapsedSegmentGroups: W, commonActionsRef: F, compatibilityMode: G, configuringTag: A, createSegment: I, creatingSegmentId: k, currentTime: S, deleteRejectedSegments: E, detail: U, detailPanelRef: R, detailWidth: M, duplicateSegment: z, editorFilters: Y, editorLayout: H, editorRef: ae, exportingExamples: de, filtersButtonRef: ve, filtersOpen: D, firstSegmentTagOpen: le, focusRowRef: se, handleSeparatorKeyDown: X, handleSeparatorPointerDown: ye, handleSeparatorPointerMove: fe, hasNextUnreviewed: Ce, hasPreviousUnreviewed: Pe, hideDerivedSegments: pe, history: Q, historyOpen: he, historySaving: T, horizontalLayoutSize: J, importNativeSegments: C, incorrectExamples: v, incorrectExamplesOpen: b, lineage: x, markerRailWidth: P, materializeButtonRef: te, materializeCancelButtonRef: ne, materializeDerivedSegments: L, materializeError: re, materializeLoading: N, materializeOpen: q, materializePreview: j, materializing: Z, mediaStackRef: be, mergeCancelButtonRef: ue, mergeConfirmation: $e, mergeSaving: pt, mergeSelectedSwimlane: Ge, nativeImportState: Te, onDetailChange: Ye, onNavigate: it, onReload: ht, onSlotsChanged: Xe, openPublishApprovedDialog: yt, panelSeparatorProps: ut, pendingInitialSeekRef: Fe, performerSlots: Qe, performerSlotsAvailable: _e, playbackControlsRef: Je, previewDerivedSegments: st, provenance: Ot, provenanceSources: V, publishApprovedCancelButtonRef: oe, publishApprovedDrafts: Re, publishApprovedError: Ne, publishApprovedOpen: Se, quickSearchOpen: et, railScrollRef: Ke, railToggleRef: Ze, recordHistoryAction: Me, rejectedDeletionPreview: Ae, removeIncorrectExample: qe, removingExampleId: Ee, restoreHistoryTarget: je, runEditorAction: tt, saveMessage: ke, saveTag: Le, saveTiming: Oe, savingSegmentId: ft, seekRef: Ve, segmentGroups: lt, segmentRailLayout: Pt, segments: at, selectAllVideoSegments: Ie, selectSegment: we, selectSegmentCollection: nt, selectedGroups: Mt, selectedPerformerSlots: mt, selectedSegment: vt, selectedSegmentGroupKey: bt, selectedSegmentIds: Lt, selectedSegments: Ut, selectedSlotStatus: Mr, setAutoAssignError: Tn, setAutoAssignOpen: Rn, setConfiguringTag: dn, setCurrentTime: nn, setEditorFilters: cn, setEditorLayout: Xn, setFiltersOpen: Ar, setHideDerivedSegments: er, setHistoryOpen: Mn, setIncorrectExamplesOpen: un, setQuickSearchOpen: mn, setRailViewport: tr, setRejectedDeletionPreview: gn, setSaveMessage: Er, setSelectedSegmentGroupKey: An, setSelectedSegmentId: En, setShortcutsOpen: Qt, setTimelineZoom: Dn, shotBoundaries: On, shortcutsOpen: xt, slotButtonRef: nr, splitLayout: jt, splitSegment: rr, stepVideoFrame: Pn, tagEditing: Ln, tagSearchRef: jn, timelineDuration: Dr, timelineRatioBounds: or, timelineZoom: Fn, toggleSegmentGroup: pn, toggleSegmentRail: Bn, updateTimelineRatio: ot, video: Be, videoPerformers: ir, visibleCounts: Or, visibleSegmentRailRows: Ht, visibleSegments: St, wideLayout: rn, workspaceRef: Gn } = e, fn = We(
    () => at.filter((_) => !_.published && _.reviewState === "approved"),
    [at]
  ), yn = Ns(io), bn = fn.length, ar = me(null), sr = We(() => () => Mn(!1), [Mn]), Kn = j ? j.createCount + j.linkCount : null, _t = ft != null, At = Ut.length > 0, Ft = Ut.length === 1, Pr = At && Ut.every((_) => _.reviewState === "approved"), Lr = At && Ut.every((_) => _.reviewState === "rejected"), jr = [
    { id: "marker.create", label: "New segment", disabled: _t },
    { id: "marker.editTag", label: "Edit tag", disabled: _t || !At },
    { id: "marker.setStart", label: "Set start", disabled: _t || !Ft },
    { id: "marker.setEnd", label: "Set end", disabled: _t || !Ft },
    { id: "marker.split", label: "Split", disabled: _t || !Ft },
    ...G ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !Pe, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Pr ? "Unapprove" : "Approve", disabled: _t || !At, tone: "approve" },
      { id: "marker.reject", label: Lr ? "Unreject" : "Reject", disabled: _t || !At, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !Ce, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...G ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: _t || !g, tone: "reject" }
    ]
  ];
  function Fr(_) {
    const xe = Lt.includes(_.id), Ct = _.id === (vt == null ? void 0 : vt.id), ce = _.endSec == null ? De(_.startSec) : `${De(_.startSec)} – ${De(_.endSec)}`, kt = `${zt(_.sourceKey)}${_.confidence != null ? ` · ${Math.round(_.confidence * 100)}%` : ""}`;
    return n("button", {
      key: _.id,
      type: "button",
      onClick: (qt) => we(_, { additive: qt.metaKey || qt.ctrlKey }),
      "aria-pressed": xe,
      "aria-current": Ct ? "true" : void 0,
      "data-selected-segment-shortcut-target": Ct ? "true" : void 0,
      "aria-label": G ? `${_.tagName || "Tag segment"}, ${_.reviewState}${_.isDerived ? ", derived segment" : ""}, ${ce}` : `${_.tagName || "Tag segment"}${_.isDerived ? ", derived segment" : ""}, ${ce}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: ua(xe, Ct)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        G ? n(ln, { key: "review", state: _.reviewState, includeLabel: !1 }) : null,
        _.isDerived ? n(Rr, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          _.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, ce),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: kt
        }, kt)
      ])
    ]);
  }
  const hn = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", gt = [...Q.actions || []].reverse().find((_) => _.sequence <= Q.cursorSequence);
  return n("section", {
    ref: ae,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${jt ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "relative flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (_) => $a(_, it, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${Be.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: Be.title || `Video ${Be.id}`
          }, Be.title || `Video ${Be.id}`)),
          ...ir.map((_) => n(Yn, {
            key: ct(_),
            performer: { id: ct(_), name: _.name },
            compact: !0,
            tooltip: _.name
          })),
          G ? n(en, { key: "review-counts", counts: Or }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          G ? null : n(Ma, { key: "bin", onNavigate: it, compact: !0 }),
          n(Aa, { key: "settings", onNavigate: it, compact: !0 })
        ])
      ]),
      G && U.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${U.nativeImportCount} Cove segment${U.nativeImportCount === 1 ? "" : "s"} ${U.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        Te.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, Te.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => C("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => C("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        Te.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, Te.error) : null
      ]) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          // Run AI and any other contributed video action, rendered by the host
          // exactly as they are on a video's own page rather than reimplemented here.
          // The host queues the run and returns at once. In Full mode,
          // useSegmentAnalysis reloads the editor when Segment Studio's review
          // results for the run arrive.
          Be != null && Be.id ? n(zl, {
            key: "extension-actions",
            entityType: "video",
            entityId: Be.id,
            pageType: Ts,
            renderMode: "toolbar"
          }) : null,
          G ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: ft != null || i.length === 0,
            onClick: () => {
              Tn(""), Rn(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${i.length ? ` (${i.length})` : ""}`) : null,
          G ? n("button", {
            key: "materialize-derived",
            ref: te,
            type: "button",
            disabled: ft != null || N || Z || Kn === 0,
            onClick: st,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, N ? "Analyzing…" : `Auto-Materialize${Kn != null ? ` (${Kn})` : ""}`) : null,
          G ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: ft != null || bn === 0,
            onClick: (_) => yt(_.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": Se,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${bn ? ` (${bn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: de || Ee != null || v.length === 0,
            onClick: () => un(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": b,
            "aria-label": `Open AI feedback collection, ${v.length} example${v.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${v.length ? ` (${v.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: ve,
            type: "button",
            onClick: () => Ar(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": D,
            className: `${hn} ${r ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(yr, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${r ? ` (${r})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => Qt(!0),
            className: hn
          }, [n(yr, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            ref: ar,
            type: "button",
            disabled: (G ? Q.actions.length === 0 : gt == null) || ft != null || T,
            onClick: G ? () => Mn((_) => !_) : () => je(
              gt.sequence - 1
            ),
            "aria-controls": G ? Ea : void 0,
            "aria-expanded": G ? he : void 0,
            className: hn
          }, [
            n(yr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, G ? `History${Q.actions.length ? ` (${Q.actions.length})` : ""}` : gt ? `Undo ${gt.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: Ze,
            type: "button",
            onClick: Bn,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": H.markerRailOpen,
            className: hn
          }, [
            n(yr, { key: "icon", name: "list" }),
            n("span", { key: "label" }, H.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ]),
      G && he ? n(yc, {
        key: "history-popover",
        history: Q,
        historySaving: T,
        anchorRef: ar,
        onRestore: je,
        onClose: sr
      }) : null
    ]),
    D ? n(fc, {
      key: "editor-filters",
      filters: Y,
      hideDerivedSegments: pe,
      performers: ir,
      provenanceSources: V,
      reviewCounts: a,
      segments: at,
      segmentGroups: lt,
      reviewMode: G,
      onChange: cn,
      onHideDerivedChange: er,
      onClose: p
    }) : null,
    le ? n(pc, {
      key: "first-segment-tag-dialog",
      saving: ft != null,
      error: ke,
      onSelect: (_, xe) => I(_, xe),
      onClose: f
    }) : null,
    et ? n(vc, {
      key: "quick-search-dialog",
      segments: Fl(o),
      onSelect: (_) => {
        mn(!1), we(_, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        mn(!1), requestAnimationFrame(() => {
          var _;
          return (_ = ae.current) == null ? void 0 : _.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    l ? n(kc, {
      key: "auto-assign-dialog",
      candidates: i,
      processing: c,
      error: s,
      onConfirm: d,
      onClose: () => Rn(!1)
    }) : null,
    $e ? n(Nc, {
      key: "merge-selection-dialog",
      merge: $e,
      processing: pt,
      undoable: !G,
      cancelButtonRef: ue,
      onConfirm: (_) => Ge(!0, _, $e),
      onClose: $
    }) : null,
    q ? n(Cc, {
      key: "materialize-derived-dialog",
      preview: j,
      loading: N,
      processing: Z,
      error: re,
      cancelButtonRef: ne,
      onConfirm: L,
      onClose: () => {
        Z || w();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: Gn,
      className: `${jt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      H.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: rn ? { position: "absolute", top: 0, right: 0, width: P, height: J.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        at.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : St.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: Ke,
          onScroll: (_) => tr({
            scrollTop: _.currentTarget.scrollTop,
            height: _.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: Pt.height }
        }, Ht.map((_) => {
          var Ct;
          let xe;
          if (_.kind === "group") {
            const ce = W.includes(_.group.key), kt = _.group.lanes.reduce((qt, lr) => qt + lr.markers.length, 0);
            xe = n("button", {
              type: "button",
              onClick: () => {
                An(_.group.key), pn(_.group.key);
              },
              "aria-expanded": !ce,
              "aria-current": bt === _.group.key ? "true" : void 0,
              "data-segment-rail-group": _.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${bt === _.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, ce ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: _.group.name }, _.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, kt),
              G && ce ? n(en, { key: "states", counts: _.group.counts }) : null
            ]);
          } else _.kind === "lane" ? xe = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Jn(_.lane),
            "aria-label": Jn(_.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, _.lane.label),
            (Ct = _.lane.performers) != null && Ct.length ? n(Tr, {
              key: "performers",
              performers: _.lane.performers,
              performerAssignments: _.lane.performerAssignments
            }) : null,
            G ? n(en, { key: "states", counts: _.lane.counts }) : null
          ]) : xe = Fr(_.segment);
          return n("div", {
            key: _.key,
            className: "absolute left-0 right-0",
            style: { top: _.top, height: _.height }
          }, xe);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${jt ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: be,
          className: `${jt ? "min-h-0 flex-1" : ""} grid`,
          style: jt ? {
            gridTemplateRows: `minmax(16rem, ${(1 - H.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${H.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: se,
            className: "grid min-h-0 gap-2",
            style: rn ? {
              gridTemplateColumns: H.markerRailOpen ? `${M}px 0.5rem minmax(0,1fr) 0.5rem ${P}px` : `${M}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n($c, {
              key: "tools",
              compatibilityMode: G,
              selectedSegment: vt,
              selectedSegments: Ut,
              selectedGroups: Mt,
              saveMessage: ke,
              savingSegmentId: ft,
              creatingSegmentId: k,
              acquireSaveLock: t,
              setSaveMessage: Er,
              saveTag: Le,
              slotStatus: Mr,
              performerSlotsAvailable: _e,
              selectedPerformerSlots: mt,
              performerSlots: Qe,
              detail: U,
              onDetailChange: Ye,
              onCancelQueuedReview: u,
              video: Be,
              slotButtonRef: nr,
              tagSearchRef: jn,
              tagEditing: Ln,
              onCancelTagEditing: B,
              detailPanelRef: R,
              onReduceSelection: (_) => {
                we(_), requestAnimationFrame(() => {
                  var xe;
                  return (xe = R.current) == null ? void 0 : xe.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Oe,
              onSlotsChanged: Xe,
              onRecordHistory: Me,
              splitSegment: rr,
              duplicateSegment: z,
              provenance: Ot,
              lineage: x,
              onNavigateLineageItem: (_) => {
                const xe = at.find((Ct) => Ct.itemId === _);
                xe && En(xe.id);
              }
            }),
            rn ? n(
              "div",
              { key: "detail-separator", ...ut("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Be.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Ai, {
                streamUrl: `/api/stream/video/${Be.id}`,
                posterUrl: `/api/stream/video/${Be.id}/screenshot?v=${encodeURIComponent(Be.updatedAt || "")}`,
                format: Be.videoFile.format,
                audioCodec: Be.videoFile.audioCodec,
                duration: Be.videoFile.duration,
                videoId: Be.id,
                trackingEnabled: !1,
                onSeekRegister: (_) => {
                  Ve.current = _, Ol(Fe.current, at, _) && (Fe.current = null);
                },
                onPlaybackControlRegister: (_) => {
                  Je.current = _;
                },
                onTimeUpdate: nn
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            rn && H.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...ut("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            rn && H.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: F,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...jr.map((_) => {
              var ce;
              const xe = (ce = yn[_.id]) == null ? void 0 : ce[0], Ct = _.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : _.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: _.id,
                type: "button",
                disabled: _.disabled,
                "data-action-id": _.id,
                onClick: (kt) => {
                  const qt = kt.currentTarget;
                  tt(_.id, { target: qt, preserveFocus: !0 }), _.focusWhenDisabled && requestAnimationFrame(() => {
                    Rc(qt, F.current, _.focusWhenDisabled);
                  });
                },
                title: xe ? `${_.label} (${xe})` : _.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${Ct}`
              }, [
                n("span", { key: "label" }, _.label),
                xe ? n("kbd", {
                  key: "shortcut",
                  className: "rounded border border-border/70 bg-background/70 px-1 py-0.5 font-mono text-[10px] leading-none text-secondary"
                }, xe) : null
              ]);
            }),
            n("div", { key: "frame-actions", className: "ml-auto flex items-center gap-1" }, [
              n("button", {
                key: "previous-frame",
                type: "button",
                disabled: !Be.videoFile,
                onClick: () => Pn(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(Is, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !Be.videoFile,
                onClick: () => Pn(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(Cs, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          jt ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(or.minimum * 100),
            "aria-valuemax": Math.round(or.maximum * 100),
            "aria-valuenow": Math.round(H.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(H.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: ye,
            onPointerMove: fe,
            onKeyDown: X,
            onDoubleClick: () => ot(Tt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: jt ? void 0 : { height: "20rem" } }, n(Tc, {
            segments: St,
            shotBoundaries: On,
            segmentGroups: lt,
            performerSlots: Qe,
            collapsedGroupKeys: W,
            selectedGroupKey: bt,
            selectedSegmentId: vt == null ? void 0 : vt.id,
            selectedSegmentIds: Lt,
            duration: Dr,
            currentTime: S,
            zoom: Fn,
            onZoomChange: Dn,
            onSelectGroup: An,
            onToggleGroup: pn,
            onSelect: (_, xe) => we(_, xe),
            onSelectSegments: nt,
            onSelectAll: Ie,
            onConfigureTag: (_) => dn(_),
            onSeekTime: (_) => {
              var xe;
              return (xe = Ve.current) == null ? void 0 : xe.call(Ve, _, !1);
            },
            centerRef: h,
            showReviewState: G,
            swimlaneTitleWidth: H.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (_) => Xn((xe) => ({ ...xe, swimlaneTitleWidth: _ }))
          }))
        ])
      ])
    ]),
    A ? n(vo, {
      key: `configure-tag:${A.tagId}`,
      tagId: A.tagId,
      tagName: A.tagName,
      performerSlotsEnabled: G,
      onSaved: ht,
      onClose: () => {
        const _ = A.trigger;
        dn(null), requestAnimationFrame(() => {
          var xe;
          _ != null && _.isConnected ? _.focus({ preventScroll: !0 }) : (xe = ae.current) == null || xe.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Se ? n(Sc, {
      key: "publish-approved-dialog",
      drafts: fn,
      processing: ft === -1,
      error: Ne,
      cancelButtonRef: oe,
      onConfirm: Re,
      onClose: m
    }) : null,
    Ae ? n(wc, {
      key: "rejected-deletion-dialog",
      preview: Ae,
      onConfirm: () => {
        E(Ae), requestAnimationFrame(() => {
          var _;
          return (_ = ae.current) == null ? void 0 : _.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        gn(null), requestAnimationFrame(() => {
          var _;
          return (_ = ae.current) == null ? void 0 : _.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    xt ? n(bc, {
      key: "shortcuts-dialog",
      reviewMode: G,
      bindings: yn,
      onClose: () => Qt(!1)
    }) : null,
    b ? n(hc, {
      key: "incorrect-examples-dialog",
      examples: v,
      exporting: de,
      removingExampleId: Ee,
      onExport: y,
      onRemove: qe,
      onClose: () => un(!1)
    }) : null
  ]);
}
function Ac(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: a, segmentGroups: i, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: u, setCollapsedSegmentGroups: g, setEditorFilters: y, setHideDerivedSegments: h, setSaveMessage: p, setSelectedSegmentGroupKey: f, setSelectedSegmentId: w, setSelectedSegmentIds: $ } = e;
  function m(A) {
    const I = Gt(t, A);
    I && g((k) => va(k, I));
  }
  function B(A) {
    w(A), $(A == null ? [] : [A]), c.current = A, u.current = [];
  }
  function W(A, {
    focusEditor: I = !1,
    seekToSegment: k = !1,
    additive: S = !1,
    rangeSegmentIds: E = null
  } = {}) {
    var R, M;
    const U = el({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: u.current
    }, A.id, E, S);
    $(U.selectedSegmentIds), w(U.activeSegmentId), c.current = U.anchorSegmentId, u.current = U.rangeBaseSegmentIds, U.activeSegmentId != null && f(Gt(t, U.activeSegmentId)), m(A.id), I && ((R = r.current) == null || R.focus({ preventScroll: !0 })), k && ((M = a.current) == null || M.call(a, A.startSec, !1));
  }
  function F(A) {
    const I = Zs(
      d,
      l,
      A
    );
    $(I.selectedSegmentIds), w(I.activeSegmentId), c.current = I.activeSegmentId, u.current = [], I.activeSegmentId != null && (f(Gt(t, I.activeSegmentId)), m(I.activeSegmentId));
  }
  function G() {
    var k;
    const A = nl(s), I = A.includes(l) ? l : A[0] ?? null;
    y(Dt({})), h(!1), $(A), w(I), c.current = I, u.current = [], I != null && f(Gt(
      an(s, i, o),
      I
    )), p(A.length === 0 ? "There are no segments to select." : `${A.length} segments selected. Collapsed Segment groups keep their selected segments.`), (k = r.current) == null || k.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: m, replaceSegmentSelection: B, selectSegment: W, selectSegmentCollection: F, selectAllVideoSegments: G };
}
function Ec(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: a, detailPanelRef: i, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, stableSaveIdentity: c, historyRef: u, onConflict: g, onDetailChange: y, onReload: h, recordHistoryAction: p, revealSegmentGroupForSelection: f, savingSegmentId: w, selectedGroups: $, selectedSegment: m, selectedSegmentIdRef: B, selectedSegments: W, selectionAnchorIdRef: F, selectionRangeBaseIdsRef: G, setMergeConfirmation: A, setSaveMessage: I, setSelectedSegmentId: k, setSelectedSegmentIds: S, video: E } = e;
  function U() {
    A(null), requestAnimationFrame(() => {
      var Y;
      return (Y = i.current) == null ? void 0 : Y.focus({ preventScroll: !0 });
    });
  }
  async function R(Y = !1, H = !1, ae = null) {
    if (w != null) return;
    const de = ae || ba(
      $,
      { nativeOnly: !o }
    );
    if (!de) {
      I("Select at least two segments from one swimlane.");
      return;
    }
    if (!Y && _i()) {
      A(de);
      return;
    }
    H && qi(!1);
    const ve = de.endSec == null ? "open end" : De(de.endSec);
    let D = de.segments[0];
    const le = o ? null : Et(de.segments, !1), se = o ? null : crypto.randomUUID(), X = de.segments.map((pe) => pe.id), ye = Od(a, de.segments).segments.find((pe) => pe.id === D.id), fe = {
      startSec: ye.startSec,
      endSec: ye.endSec,
      sourceKey: ye.sourceKey,
      sourceRunId: ye.sourceRunId,
      confidence: ye.confidence,
      isDerived: ye.isDerived
    }, Ce = r("merge", de.segments[0].id);
    if (!Ce) return;
    U();
    const Pe = Wt();
    s({
      type: "add",
      entry: { id: Pe, op: "merge", targets: de.segments.map($t), values: fe }
    }), S([D.id]), k(D.id), F.current = D.id, G.current = [];
    try {
      const pe = de.segments.slice(1);
      if (!o || D.nativeSegmentId != null) {
        const Q = pe.map((T) => {
          const J = `merge-native-selection:${E.id}:${D.id}:${T.id}:${D.updatedAt}:${T.updatedAt}`;
          return { key: J, operationId: Ue(J), segmentId: T.id, expectedUpdatedAt: T.updatedAt };
        }), he = await ee(`/videos/${E.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: D.id,
            expectedSurvivorUpdatedAt: D.updatedAt,
            consumedSegments: Q.map(({ key: T, ...J }) => J),
            historyReceiptId: se
          })
        });
        D = he.survivor, y((T) => gi(T, he), E.id), s({ type: "confirm", key: Pe, applied: !0 }), Q.forEach(({ key: T }) => He(T));
      } else {
        const Q = pe.map((T) => {
          const J = `merge-draft-selection:${E.id}:${D.itemId}:${T.itemId}:${D.revision}:${T.revision}`;
          return { key: J, operationId: Ue(J), itemId: T.itemId, expectedRevision: T.revision };
        }), he = await ee(`/videos/${E.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: D.itemId,
            expectedSurvivorRevision: D.revision,
            consumedDrafts: Q.map(({ key: T, ...J }) => J)
          })
        });
        D = he.survivor, y((T) => gi(T, he), E.id), s({ type: "confirm", key: Pe, applied: !0 }), Q.forEach(({ key: T }) => He(T));
      }
      S([D.id]), k(D.id), F.current = D.id, G.current = [], o ? t(Jt) : await p(
        "segments.merge",
        `Merged ${de.segments.length} segments`,
        le,
        Et([D], !1),
        se
      ), f(D.id), I(`${de.segments.length} segments merged into ${De(de.startSec)} – ${ve}.`);
    } catch (pe) {
      s({ type: "discard", key: Pe }), S(X), k((m == null ? void 0 : m.id) ?? X[0] ?? null), F.current = (m == null ? void 0 : m.id) ?? X[0] ?? null, G.current = [], pe.status === 409 ? await g() : I(pe.message || "Unable to merge selected segments.");
    } finally {
      Ce();
    }
  }
  function M(Y, H = W, ae = m) {
    if (H.length === 0) return Promise.resolve(null);
    const de = gl(Y, H, ae), ve = Math.max(0, de.identities.indexOf(de.activeIdentity)), D = d(), le = Sa(D) != null || D.queued.some((X) => bo(X.targets, de.identities.map(c))), se = l({
      kind: "review",
      lockId: de.activeIdentity.id,
      targets: de.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (X) => z(X, {
        ...de,
        identities: X.targets,
        activeIdentity: X.targets[ve]
      })
    });
    return se ? (le && I(`${Y === "approved" ? "Approval" : "Rejection"} queued…`), se.done) : (I("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function z({ detail: Y, segments: H, onConflict: ae, onReload: de }, ve) {
    var he;
    const D = pl(ve, H);
    if (!D) {
      I("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: le, selectedSegments: se, selectedSegment: X } = D, ye = ml(se, le), fe = se.filter((T) => T.reviewState !== ye);
    if (fe.length === 0) return;
    const Ce = se.map((T) => ({
      id: T.id,
      itemId: T.itemId,
      nativeSegmentId: T.nativeSegmentId
    })), Pe = Ce.find((T) => T.id === (X == null ? void 0 : X.id)) || Ce[0], pe = (T, J = !1) => {
      if (!(T != null && T.segments) || !J && !Xr(B.current, Pe.id))
        return;
      const C = Ce.map((b) => rt(T == null ? void 0 : T.segments, b)).filter(Boolean), v = rt(T == null ? void 0 : T.segments, Pe) || C[0] || null;
      S(C.map((b) => b.id)), k((v == null ? void 0 : v.id) ?? null), F.current = (v == null ? void 0 : v.id) ?? null, G.current = [];
    };
    I(`Updating ${fe.length} selected segment${fe.length === 1 ? "" : "s"}…`);
    const Q = Wt();
    s({
      type: "add",
      entry: { id: Q, op: "patch", targets: fe.map($t), values: { reviewState: ye } }
    });
    try {
      const T = await ee(`/videos/${E.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: u.current.revision,
          reviewState: ye,
          segments: se.map((b) => b.published ? {
            nativeSegmentId: b.nativeSegmentId,
            expectedUpdatedAt: b.updatedAt
          } : {
            itemId: b.itemId,
            expectedRevision: b.revision
          })
        })
      }), J = new Map((T.items || []).map((b) => [
        b.requestedNativeSegmentId != null ? `native:${b.requestedNativeSegmentId}` : `item:${b.requestedItemId}`,
        b
      ]));
      if (Ce.forEach((b) => {
        const x = J.get(b.nativeSegmentId != null ? `native:${b.nativeSegmentId}` : `item:${b.itemId}`);
        x && (b.nativeSegmentId = x.nativeSegmentId, b.itemId = x.itemId);
      }), T.history && t(T.history), ye === "rejected" && !T.editorDelta || (T.items || []).some((b) => b.requestedNativeSegmentId != null && b.nativeSegmentId !== b.requestedNativeSegmentId)) {
        const b = await de();
        s({ type: "confirm", key: Q, applied: b != null }), pe(b), I(`${T.updatedCount} selected segment${T.updatedCount === 1 ? "" : "s"} ${ye === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const v = T.editorDelta ? (b) => _n(b, T.editorDelta) : (b) => ({
        ...b,
        approvedSetVersion: T.approvedSetVersion || b.approvedSetVersion,
        segments: (b.segments || []).map((x) => {
          const P = J.get(x.nativeSegmentId != null ? `native:${x.nativeSegmentId}` : `item:${x.itemId}`);
          return P ? {
            ...x,
            id: P.nativeSegmentId != null ? P.nativeSegmentId : -P.itemId,
            itemId: P.itemId,
            nativeSegmentId: P.nativeSegmentId,
            published: P.nativeSegmentId != null,
            reviewState: ye,
            revision: P.nativeSegmentId != null ? x.revision : P.revision,
            updatedAt: P.updatedAt
          } : x;
        })
      });
      y(v, E.id), s({ type: "confirm", key: Q, applied: !0 }), pe(v(Y)), I(`${T.updatedCount} selected segment${T.updatedCount === 1 ? "" : "s"} ${ye === "approved" ? "approved" : ye === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (T) {
      s({ type: "discard", key: Q }), T.status === 409 && ((he = T.payload) != null && he.currentHistory) && t(T.payload.currentHistory);
      const J = T.status === 409 ? await ae() : Y;
      pe(J, !0), I(T.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: U, mergeSelectedSwimlane: R, saveSelectedReviewState: M };
}
function Dc(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: a, autoAssigning: i, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: u, detail: g, editorFilters: y, editorRef: h, cancelSaveTasks: p, dispatchPendingChanges: f, enqueueSave: w, stableSaveIdentity: $, exportingExamples: m, hideDerivedSegments: B, incorrectExamples: W, lineage: F, materializeButtonRef: G, materializePreview: A, materializeRestoreFocusRef: I, materializing: k, mutateSegment: S, runSegmentMutation: E, pendingChanges: U, onConflict: R, onDetailChange: M, onReload: z, performerSlots: Y, recordHistoryAction: H, refreshMaterializationPreview: ae, removingExampleId: de, revealSegmentGroupForSelection: ve, savingSegmentId: D, segmentGroups: le, segments: se, selectedSegment: X, selectedSegmentIdRef: ye, selectedSegments: fe, selectionAnchorIdRef: Ce, selectionRangeBaseIdsRef: Pe, setAutoAssignError: pe, setAutoAssignOpen: Q, setAutoAssigning: he, setEditorFilters: T, setExportingExamples: J, setHideDerivedSegments: C, setIncorrectExamples: v, setMaterializeError: b, setMaterializeLoading: x, setMaterializeOpen: P, setMaterializePreview: te, setMaterializing: ne, setRejectedDeletionPreview: L, setRemovingExampleId: re, setSaveMessage: N, setSelectedSegmentGroupKey: q, setSelectedSegmentId: j, setSelectedSegmentIds: Z, swimlanes: be, video: ue } = e;
  async function $e() {
    var Ee, je, tt;
    if (fe.length === 0 || !X || D != null) return;
    const V = Td(fe, W), oe = V.segments;
    if (oe.length === 0) return;
    const Re = fe.map((ke) => ({
      id: ke.id,
      itemId: ke.itemId,
      nativeSegmentId: ke.nativeSegmentId
    })), Ne = Re.find((ke) => ke.id === X.id) || Re[0], Se = [], et = [];
    let Ke = !1, Ze = g, Me = !1;
    const Ae = [], qe = r("feedback", Ne.id);
    if (qe) {
      N(V.action === "remove" ? `Removing ${oe.length} selected incorrect example${oe.length === 1 ? "" : "s"}…` : `Collecting ${oe.length} selected segment${oe.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const ke = async (Ie, we) => {
          const nt = Ie.nativeSegmentId != null, Mt = V.action === "remove" ? `incorrect-example-remove:${ue.id}:${we == null ? void 0 : we.id}:${we == null ? void 0 : we.revision}:${we == null ? void 0 : we.representationRevision}` : `incorrect-example-collect:${ue.id}:${nt ? `native:${Ie.nativeSegmentId}:${Ie.updatedAt}` : `item:${Ie.itemId}:${Ie.revision}`}`;
          if (V.action === "remove" && !we)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let mt;
          try {
            mt = V.action === "remove" ? await ee(
              `/videos/${ue.id}/incorrect-examples/${we.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: Ue(Mt),
                  expectedExampleRevision: we.revision,
                  expectedRepresentationRevision: we.representationRevision
                })
              }
            ) : await ee(`/videos/${ue.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Ue(Mt),
                nativeSegmentId: nt ? Ie.nativeSegmentId : null,
                itemId: nt ? null : Ie.itemId,
                expectedUpdatedAt: nt ? Ie.updatedAt : null,
                expectedRevision: nt ? null : Ie.revision
              })
            });
          } catch (vt) {
            throw vt.operationKey = Mt, vt;
          }
          if (!Rd(V.action, mt))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return He(Mt), mt;
        };
        for (const Ie of oe) {
          const we = V.action === "remove" ? W.find((nt) => nt.itemId != null && nt.itemId === Ie.itemId) : null;
          try {
            const nt = Re.find((bt) => bt.id === Ie.id);
            let Mt = rt(
              Ze == null ? void 0 : Ze.segments,
              nt
            ) || Ie, mt;
            try {
              mt = await ke(Mt, we);
            } catch (bt) {
              if (bt.status === 409 && ((je = (Ee = bt.payload) == null ? void 0 : Ee.result) == null ? void 0 : je.code) === "OPERATION_REPLAYED")
                Ze = await ee(
                  `/videos/${ue.id}/editor`
                ), Me = !0, Ae.length = 0, He(bt.operationKey), mt = bt.payload.result;
              else {
                if (V.action !== "collect" || bt.status !== 409) throw bt;
                const Lt = await ee(
                  `/videos/${ue.id}/editor`
                );
                Ze = Lt, Me = !0, Ae.length = 0;
                const Ut = rt(
                  Lt == null ? void 0 : Lt.segments,
                  nt
                );
                if (!Ut) throw bt;
                Mt = Ut, mt = await ke(Mt, null);
              }
            }
            nt && mt.itemId != null && (nt.itemId = mt.itemId), Ze = _n(
              Ze,
              mt.editorDelta
            ), Ae.push(mt.editorDelta);
            const vt = { segment: Ie, result: mt, example: we };
            Se.push(vt);
          } catch (nt) {
            if (et.push(nt), ![400, 404, 409].includes(nt.status)) break;
          }
        }
        if (c && Se.length > 0) {
          const Ie = V.action === "remove", we = Se.length;
          await H(
            Ie ? "feedback.remove" : "feedback.collect",
            Ie ? `Removed ${we} incorrect AI example${we === 1 ? "" : "s"}` : `Collected ${we} incorrect AI example${we === 1 ? "" : "s"}`,
            pr(Se, Ie),
            pr(Se, !Ie)
          ) || (Ke = !0);
        }
        Se.some(({ result: Ie }) => Ie.representation === "basicNativeBin") && qn();
        const Le = Xr(
          ye.current,
          Ne.id
        ), Oe = V.action === "collect" && Se.some(({ segment: Ie }) => Ie.id === Ne.id), ft = Se.map(({ segment: Ie }) => Ie.id), Ve = Oe ? xr(
          be,
          vr(o, Ne.id),
          { removedIds: ft }
        ) : null, lt = Oe ? (Ve == null ? void 0 : Ve.id) ?? null : Ne.id;
        Le && Oe && (Z(Ve ? [Ve.id] : []), j((Ve == null ? void 0 : Ve.id) ?? Nn), Ce.current = (Ve == null ? void 0 : Ve.id) ?? null, Pe.current = []);
        const Pt = await ee(`/videos/${ue.id}/incorrect-examples`);
        v(Pt);
        const at = Ze;
        if (M(Me ? at : (Ie) => Ae.reduce(_n, Ie), ue.id), Le && Xr(
          ye.current,
          lt
        )) {
          let Ie, we;
          Oe ? (we = Ve ? rt(at == null ? void 0 : at.segments, {
            id: Ve.id,
            itemId: Ve.itemId,
            nativeSegmentId: Ve.nativeSegmentId
          }) : null, Ie = we ? [we] : []) : (Ie = Re.map((nt) => rt(at == null ? void 0 : at.segments, nt)).filter(Boolean), we = rt(at == null ? void 0 : at.segments, Ne) || Ie[0] || null), Z(Ie.map((nt) => nt.id)), j((we == null ? void 0 : we.id) ?? (Oe ? Nn : null)), Ce.current = (we == null ? void 0 : we.id) ?? null, Pe.current = [], q(we ? Gt(o, we.id) : null), we && ve(we.id);
        }
        if (et.length > 0) {
          const Ie = ((tt = et[0]) == null ? void 0 : tt.message) || "Only segments with registered AI provenance can be collected.";
          Se.length === 0 ? N(Ie) : V.action === "remove" ? N(
            `Partially removed ${Se.length} of ${oe.length} selected incorrect examples. ${Ie}`
          ) : N(
            `Partially collected ${Se.length} of ${oe.length} selected segments. ${Ie}`
          );
        } else if (V.action === "remove")
          N(
            `${Se.length} incorrect example${Se.length === 1 ? "" : "s"} removed and ${Se.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const Ie = Se.filter(({ result: we }) => we.representation === "basicNativeBin").length;
          N(Ie === Se.length ? `${Se.length} incorrect AI example${Se.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${Se.length} incorrect AI example${Se.length === 1 ? "" : "s"} collected and ${Se.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        Ke && N("The change saved, but editor history could not be updated.");
      } catch (ke) {
        N(ke.message || "Unable to update the selected incorrect examples.");
      } finally {
        qe();
      }
    }
  }
  async function pt(V) {
    if (!V || de != null || m) return;
    const oe = r("feedback", -1);
    if (!oe) {
      N("Wait for the current save to finish before removing the incorrect example.");
      return;
    }
    try {
      await Ge(V);
    } finally {
      oe();
    }
  }
  async function Ge(V) {
    var Re, Ne;
    re(V.id);
    const oe = `incorrect-example-remove:${ue.id}:${V.id}:${V.revision}:${V.representationRevision}`;
    try {
      let Se, et = !1;
      try {
        Se = await ee(
          `/videos/${ue.id}/incorrect-examples/${V.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ue(oe),
              expectedExampleRevision: V.revision,
              expectedRepresentationRevision: V.representationRevision
            })
          }
        );
      } catch (Me) {
        if (Me.status !== 409 || ((Ne = (Re = Me.payload) == null ? void 0 : Re.result) == null ? void 0 : Ne.code) !== "OPERATION_REPLAYED")
          throw Me;
        Se = Me.payload.result, et = !0;
      }
      He(oe);
      let Ke = !0;
      if (c) {
        const Ae = [{ segment: rt(g.segments, {
          itemId: V.itemId
        }) || {
          id: V.itemId == null ? null : -V.itemId,
          itemId: V.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: V.representationRevision
        }, result: Se, example: V }];
        Ke = await H(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          pr(Ae, !0),
          pr(Ae, !1)
        );
      }
      const Ze = await ee(
        `/videos/${ue.id}/incorrect-examples`
      );
      v(Ze), et ? await z() : M(
        (Me) => _n(Me, Se.editorDelta),
        ue.id
      ), V.representation === "basicNativeBin" && qn(), N(Ke ? et ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : V.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (Se) {
      Se.status === 409 && await R(), N(Se.message || "Unable to remove the incorrect example.");
    } finally {
      re(null);
    }
  }
  async function Te() {
    if (m || de != null || W.length === 0) return;
    J(!0);
    const V = `incorrect-example-export:${ue.id}:${W.map((oe) => `${oe.id}:${oe.revision}:${oe.representationRevision}`).join(",")}`;
    try {
      const oe = await Ad(
        ue.id,
        W
      ), Re = new FormData();
      Re.append("metadata", JSON.stringify({
        operationId: Ue(V),
        examples: oe.captures
      }));
      for (const Me of oe.files)
        Re.append(Me.fieldName, Me.file);
      const Ne = await ee(
        `/videos/${ue.id}/incorrect-examples/export`,
        { method: "POST", body: Re }
      ), Se = await Vl(Ne.downloadUrl), et = URL.createObjectURL(Se.blob), Ke = document.createElement("a");
      Ke.href = et, Ke.download = Se.fileName, Ke.click(), setTimeout(() => URL.revokeObjectURL(et), 1e3);
      const Ze = await ee(
        `/training-exports/${Ne.id}/complete`,
        { method: "POST" }
      );
      He(V), v(await ee(
        `/videos/${ue.id}/incorrect-examples`
      )), N(
        `Downloaded ${Ne.exampleCount} incorrect example${Ne.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Ze.clearedExampleCount} from the working collection.`
      );
    } catch (oe) {
      N(oe.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      J(!1);
    }
  }
  async function Ye(V = null) {
    const oe = se.filter((je) => je.reviewState === "rejected"), Re = oe.length, Ne = W.some((je) => je.representation === "fullItem");
    if (V == null && Re === 0 && !Ne) {
      N("There are no rejected segments to delete.");
      return;
    }
    if (V == null) {
      const je = r("delete-rejected", -1);
      if (!je) return;
      N("Preparing deletion summary…");
      try {
        const tt = await ee(`/videos/${ue.id}/rejected/deletion/preview`, { method: "POST" }), ke = Number(tt.deletedSegmentCount) || 0, Le = Number(tt.deferredRejectedSegmentCount) || 0, Oe = Number(tt.protectedIncorrectExampleCount) || 0;
        if (ke === 0) {
          Le > 0 ? N(
            `${Le} feedback-protected rejected segment${Le === 1 ? "" : "s"} kept. ${Oe} AI feedback example${Oe === 1 ? "" : "s"} must be exported before ${Le === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : N("There are no rejected segments to delete.");
          return;
        }
        if (!sa(tt, N)) return;
        L(tt), N("");
      } catch (tt) {
        N(tt.message || "Unable to prepare rejected segment deletion.");
      } finally {
        je();
      }
      return;
    }
    const Se = V, et = Number(Se.deferredRejectedSegmentCount) || 0, Ke = ye.current, Ze = oe.map((je) => je.id), Me = et === 0 && Ze.includes(Ke), Ae = Me ? xr(
      be,
      vr(o, Ke),
      { removedIds: Ze }
    ) : null, qe = r("delete-rejected", -1);
    if (!qe) return;
    L(null), N("Deleting rejected segments…");
    const Ee = et === 0 ? Wt() : null;
    Ee && f({
      type: "add",
      entry: { id: Ee, op: "remove", targets: oe.map($t) }
    }), Me && (Z(Ae ? [Ae.id] : []), j((Ae == null ? void 0 : Ae.id) ?? Nn), Ce.current = (Ae == null ? void 0 : Ae.id) ?? null, Pe.current = []);
    try {
      const je = `rejected-dependency-delete:${ue.id}:${Se.fingerprint}`, tt = await ee(`/videos/${ue.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ue(je),
          fingerprint: Se.fingerprint
        })
      });
      He(je);
      const ke = await z();
      Ee && f({ type: "confirm", key: Ee, applied: ke != null }), tt.deletedSegmentCount > 0 && t(Jt);
      const Le = et > 0 ? ` ${et} feedback-protected rejected segment${et === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      N(`${tt.deletedSegmentCount} segment${tt.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Le}`);
    } catch (je) {
      Ee && f({ type: "discard", key: Ee }), Me && (Z(Ke == null ? [] : [Ke]), j(Ke), Ce.current = Ke, Pe.current = []), N(je.message || "Unable to delete rejected segments.");
    } finally {
      qe();
    }
  }
  async function it(V = a) {
    if (i || V.length === 0) return;
    const oe = r("auto-assign", -1);
    if (!oe) {
      pe("Wait for the current save to finish before assigning performers.");
      return;
    }
    try {
      await ht(V);
    } finally {
      oe();
    }
  }
  async function ht(V) {
    he(!0), pe("");
    try {
      const oe = await ee(`/videos/${ue.id}/segments/auto-assign-performer-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeSegmentIds: V.flatMap((Re) => Re.nativeSegmentId == null ? [] : [Re.nativeSegmentId]),
          itemIds: V.flatMap((Re) => Re.published || Re.itemId == null ? [] : [Re.itemId])
        })
      });
      Q(!1), await z(), N(`${oe.assignedSegmentCount} segment${oe.assignedSegmentCount === 1 ? "" : "s"} received ${oe.assignedSlotCount} performer-slot assignment${oe.assignedSlotCount === 1 ? "" : "s"}.`);
    } catch (oe) {
      pe(oe.message || "Unable to auto-assign performers.");
    } finally {
      he(!1);
    }
  }
  async function Xe() {
    P(!0), b(""), !A && (x(!0), ae());
  }
  function yt() {
    I.current = !0, P(!1), requestAnimationFrame(() => {
      var V;
      return (V = G.current) == null ? void 0 : V.focus({ preventScroll: !0 });
    });
  }
  async function ut() {
    if (!A || k || A.createCount + A.linkCount === 0)
      return;
    const V = r("materialize", -1);
    if (!V) {
      b("Wait for the current save to finish before materializing derived segments.");
      return;
    }
    try {
      await Fe();
    } finally {
      V();
    }
  }
  async function Fe() {
    ne(!0), b("");
    let V;
    try {
      const oe = `materialize-derived:${ue.id}:${A.fingerprint}`;
      V = await ee(`/videos/${ue.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ue(oe),
          fingerprint: A.fingerprint,
          maxDepth: 3
        })
      }), He(oe);
    } catch (oe) {
      oe.status === 409 && te(null), b(oe.message || "Unable to materialize derived segments."), ne(!1);
      return;
    }
    te((oe) => oe && { ...oe, createCount: 0, linkCount: 0 });
    try {
      await z(), yt(), te(null);
      const oe = V.createdCount + V.linkedCount;
      N(`${V.createdCount} derived segment${V.createdCount === 1 ? "" : "s"} created and ${V.linkedCount} existing segment${V.linkedCount === 1 ? "" : "s"} linked.`), oe === 0 && N("Every applicable derivation was already materialized.");
    } catch {
      b("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    ne(!1);
  }
  async function Qe(V, oe = null) {
    var Se, et, Ke, Ze;
    const Re = {
      tagId: V,
      ...oe ? { tagName: oe } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (fe.length > 1) {
      const Me = fe.filter((ke) => ke.tagId !== V);
      if (Me.length === 0) {
        d();
        return;
      }
      const Ae = fe.map((ke) => ({
        id: ke.id,
        itemId: ke.itemId,
        nativeSegmentId: ke.nativeSegmentId
      })), qe = fe.map((ke) => !c || ke.nativeSegmentId != null ? `native:${ke.nativeSegmentId}:${ke.updatedAt}` : `item:${ke.itemId}:${ke.revision}`).sort().join(","), Ee = `bulk-tag:${ue.id}:${V}:${qe}`, je = r("tag", (X == null ? void 0 : X.id) ?? Me[0].id);
      if (!je) return;
      N(`Changing tag for ${Me.length} selected segment${Me.length === 1 ? "" : "s"}…`);
      const tt = Wt();
      f({
        type: "add",
        entry: { id: tt, op: "patch", targets: Me.map($t), values: Re }
      }), d();
      try {
        const ke = c ? null : crypto.randomUUID();
        await ee(`/videos/${ue.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ue(Ee),
            tagId: V,
            historyReceiptId: ke,
            segments: fe.map((lt) => {
              const Pt = !c || lt.nativeSegmentId != null;
              return {
                nativeSegmentId: Pt ? lt.nativeSegmentId : null,
                itemId: Pt ? null : lt.itemId,
                expectedUpdatedAt: Pt ? lt.updatedAt : null,
                expectedRevision: Pt ? null : lt.revision
              };
            })
          })
        }), He(Ee);
        const Le = Et(
          fe,
          c
        ), Oe = await z();
        f({ type: "confirm", key: tt, applied: Oe != null });
        const ft = Ae.map((lt) => rt(Oe == null ? void 0 : Oe.segments, lt)).filter(Boolean);
        await H(
          "segments.tag",
          `Changed tag for ${Me.length} segment${Me.length === 1 ? "" : "s"}`,
          Le,
          Et(ft, c),
          ke
        );
        const Ve = Ae.map((lt) => rt(Oe == null ? void 0 : Oe.segments, lt)).filter(Boolean);
        Z(Ve.map((lt) => lt.id)), j(((Se = Ve.find((lt) => lt.id === (X == null ? void 0 : X.id))) == null ? void 0 : Se.id) ?? ((et = Ve[0]) == null ? void 0 : et.id) ?? null), d(), N(`${Me.length} selected segment${Me.length === 1 ? "" : "s"} retagged.`);
      } catch (ke) {
        f({ type: "discard", key: tt });
        const Le = Ae.map((ft) => rt(g.segments, ft)).filter(Boolean), Oe = rt(g.segments, {
          id: X == null ? void 0 : X.id,
          itemId: X == null ? void 0 : X.itemId,
          nativeSegmentId: X == null ? void 0 : X.nativeSegmentId
        }) || Le[0] || null;
        Z(Le.map((ft) => ft.id)), j((Oe == null ? void 0 : Oe.id) ?? null), Ce.current = (Oe == null ? void 0 : Oe.id) ?? null, Pe.current = [], ke.status === 409 && await R(), N(ke.message || "Unable to change the selected segment tags.");
      } finally {
        je();
      }
      return;
    }
    if (fe.length !== 1 || !X) return;
    const Ne = ka(U, X);
    if (X.id === u || Ne) {
      const Me = Ne ? { segmentId: X.id, tagId: Ne.values.tagId, tagName: Ne.meta.tagName } : null, Ae = vl(Me, X, V, oe);
      if (Ae && !_e(X, Ae)) {
        d();
        return;
      }
      if (Ne && (p((qe) => {
        var Ee;
        return ((Ee = qe.meta) == null ? void 0 : Ee.pendingChangeId) === Ne.id;
      }), f({ type: "discard", key: Ne.id })), Ae) {
        const qe = Wi(
          { ...X, tagId: Ae.tagId },
          Y,
          y,
          B,
          le
        );
        T(qe.filters), C(qe.hideDerivedSegments), N("Tag change queued…");
      } else Ne && N("");
      d();
      return;
    }
    if (V === X.tagId) {
      d();
      return;
    }
    if (X.itemId != null && ((Ze = (Ke = F.data) == null ? void 0 : Ke.children) == null ? void 0 : Ze.length) > 0) {
      const Me = r("lineage-tag", X.id);
      if (!Me) return;
      N("Checking lineage impact…");
      let Ae = null;
      try {
        const qe = await ee(`/items/${X.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: X.revision, tagId: V })
        }), Ee = qe.deletedItemIds.length > 0 || qe.removedEdgeIds.length > 0;
        if (Ee && !window.confirm(
          `Changing this tag removes ${qe.removedEdgeIds.length} lineage edge${qe.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${qe.deletedItemIds.length} derived segment${qe.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
        )) {
          N("Tag change canceled.");
          return;
        }
        Ae = Wt(), f({
          type: "add",
          entry: { id: Ae, op: "patch", targets: [$t(X)], values: Re }
        }), d();
        const je = `tag-change:${X.itemId}:${X.revision}:${qe.componentFingerprint}:${V}`;
        await ee(`/items/${X.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ue(je),
            expectedRevision: X.revision,
            componentFingerprint: qe.componentFingerprint,
            tagId: V
          })
        }), He(je);
        const tt = await z();
        f({ type: "confirm", key: Ae, applied: tt != null }), d(), N(Ee ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch (qe) {
        Ae && f({ type: "discard", key: Ae }), Z([X.id]), j(X.id), Ce.current = X.id, Pe.current = [], qe.status === 409 ? (N("Lineage changed — loading the latest segments…"), await R()) : N(qe.message || "Unable to reconcile the lineage.");
      } finally {
        Me();
      }
      return;
    }
    d(), await S(X, {
      startSec: X.startSec,
      endSec: X.endSec,
      tagId: V
    }, !0, null, !0, Re);
  }
  function _e(V, oe) {
    const Re = Wt(), Ne = $($t(V));
    f({
      type: "add",
      entry: {
        id: Re,
        op: "patch",
        targets: [Ne],
        values: { tagId: oe.tagId, tagName: oe.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: oe.tagName }
      }
    });
    const Se = U.find((Ke) => Ke.op === "insert" && Ke.segment.id === V.id);
    return w({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [Ne],
      dependsOn: (Se == null ? void 0 : Se.taskId) ?? null,
      meta: { pendingChangeId: Re },
      ready: (Ke, Ze) => {
        const Me = xa(Ke.segments, Ze.targets[0]);
        return !Me || xl(Ke, Me.id);
      },
      run: (Ke) => Je(Ke, Re, oe)
    }) ? !0 : (f({ type: "discard", key: Re }), N("Wait for the history restore to finish."), !1);
  }
  async function Je(V, oe, Re) {
    const [Ne] = V.resolveTargets();
    if (!Ne) {
      f({ type: "discard", key: oe }), N(`The new segment was not retagged${Re.tagName ? ` to ${Re.tagName}` : ""}. Choose its tag again.`);
      return;
    }
    if (Ne.tagId === Re.tagId) {
      f({ type: "discard", key: oe });
      return;
    }
    await E(Ne, {
      startSec: Ne.startSec,
      endSec: Ne.endSec,
      tagId: Re.tagId
    }, {
      pendingChangeId: oe,
      restoreSelectionOnFailure: !1,
      onReload: V.onReload,
      onConflict: V.onConflict
    }) || N(`The new segment was not retagged${Re.tagName ? ` to ${Re.tagName}` : ""}. Choose its tag again.`);
  }
  async function st() {
    var Ze, Me, Ae, qe;
    if (!l || !X || D != null) return;
    const V = [...fe].sort((Ee, je) => Number(Ee.nativeSegmentId ?? Ee.id) - Number(je.nativeSegmentId ?? je.id)), oe = new Set(V.map((Ee) => Ee.id)), Re = V.map((Ee) => `${Ee.nativeSegmentId ?? Ee.id}:${Ee.updatedAt}`).join("|"), Ne = r("bin", X.id);
    if (!Ne) return;
    N(`Moving ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin…`);
    const Se = `bulk-move:${ue.id}:${Re}`, et = Ue(Se), Ke = c ? null : crypto.randomUUID();
    try {
      const Ee = (Le = !1) => ee(`/videos/${ue.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: et,
          segments: V.map((Oe) => ({
            segmentId: Oe.nativeSegmentId ?? Oe.id,
            expectedUpdatedAt: Oe.updatedAt
          })),
          discardMissingImage: Le,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: Ke
        })
      });
      let je;
      try {
        je = await Ee(
          uo(Se)
        );
      } catch (Le) {
        if (((Ze = Le.payload) == null ? void 0 : Ze.code) !== "missing-image" || !window.confirm(`${Le.message}

Continue and discard the missing image reference?`)) throw Le;
        mo(Se), je = await Ee(!0);
      }
      He(Se), qn();
      const tt = new Map((je.items || []).map((Le) => [
        Number(Le.segmentId),
        Le
      ]));
      await H(
        "segments.moveToBin",
        `Moved ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin`,
        Et(V, !1),
        Et(V.map((Le) => {
          const Oe = tt.get(
            Number(Le.nativeSegmentId ?? Le.id)
          );
          return {
            ...Le,
            recycleBinItemId: (Oe == null ? void 0 : Oe.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (Oe == null ? void 0 : Oe.revision) ?? null
          };
        }), !1),
        Ke
      );
      const ke = xr(
        be,
        vr(o, X.id),
        { removedIds: [...oe] }
      );
      M((Le) => ({
        ...Le,
        segments: (Le.segments || []).filter((Oe) => !oe.has(Oe.id))
      }), ue.id), Z(ke ? [ke.id] : []), j((ke == null ? void 0 : ke.id) ?? Nn), Ce.current = (ke == null ? void 0 : ke.id) ?? null, Pe.current = [], ke && (q(Gt(o, ke.id)), ve(ke.id)), requestAnimationFrame(() => {
        var Le;
        return (Le = h.current) == null ? void 0 : Le.focus({ preventScroll: !0 });
      }), N(`Moved ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Ee) {
      const je = ((Me = Ee.payload) == null ? void 0 : Me.code) || ((qe = (Ae = Ee.payload) == null ? void 0 : Ae.result) == null ? void 0 : qe.code);
      Ee.status === 409 && je === "CANONICAL_SEGMENT_CHANGED" ? await R() : N(Ee.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Ne();
    }
  }
  async function Ot() {
    if (!(c || s.current || D != null)) {
      s.current = !0, N("Checking the recycling bin…");
      try {
        const V = await ee("/bin"), oe = await da(V, () => N("Emptying the recycling bin…"));
        if (oe.status === "empty") {
          N("The recycling bin is empty.");
          return;
        }
        if (oe.status === "canceled") {
          N("The recycling bin was not emptied.");
          return;
        }
        N(`${oe.segmentCount} segment${oe.segmentCount === 1 ? "" : "s"} from ${oe.sceneCount} scene${oe.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (V) {
        N(V.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: $e, removeIncorrectExample: pt, captureTrainingExport: Te, deleteRejectedSegments: Ye, autoAssignPerformers: it, previewDerivedSegments: Xe, closeMaterializeDialog: yt, materializeDerivedSegments: ut, saveTag: Qe, moveToBin: st, emptyRecyclingBin: Ot };
}
function Oc(e) {
  const { acceptHistory: t, acquireSaveLock: r, enqueueSave: o, getSaveQueueSnapshot: a, commonActionsRef: i, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: u, history: g, historyRef: y, historySaving: h, horizontalLayoutSize: p, mediaStackHeight: f, mediaStackRef: w, onDetailChange: $, onReload: m, railToggleRef: B, recordHistoryAction: W, savingSegmentId: F, setCollapsedSegmentGroups: G, setEditorLayout: A, setHistorySaving: I, setIncorrectExamples: k, setSaveMessage: S, shotBoundaries: E, timelineDuration: U, video: R, workspaceRef: M } = e;
  async function z(C, v, b) {
    var ne, L, re, N;
    const x = C.type === "segment" ? [C] : C.segments || [], P = (v == null ? void 0 : v.type) === "segment" ? [v] : (v == null ? void 0 : v.segments) || [];
    let te = b;
    for (const [q, j] of x.entries()) {
      const Z = P[q], be = ((ne = j.identity) == null ? void 0 : ne.nativeSegmentId) != null || ((L = j.identity) == null ? void 0 : L.published) === !0, ue = ((re = Z == null ? void 0 : Z.identity) == null ? void 0 : re.recycleBinItemId) ?? ((N = Z == null ? void 0 : Z.identity) == null ? void 0 : N.itemId);
      let $e = rt(te.segments, Z == null ? void 0 : Z.identity) || rt(te.segments, j.identity);
      if (!$e && be && ue != null && Z.identity.revision != null) {
        const Te = `history-restore:${R.id}:${ue}:${Z.identity.revision}`;
        await ee(`/bin/${ue}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ue(Te),
            expectedRevision: Z.identity.revision
          })
        }), He(Te), te = await m(), $e = te.segments.find((Ye) => Ye.tagId === j.values.tagId && Ye.startSec === j.values.startSec && Ye.endSec === j.values.endSec);
      }
      if (!$e)
        throw new Error("A segment in this history state no longer exists.");
      if (($e.nativeSegmentId != null || $e.published === !0) !== be) {
        if (be) {
          const Te = $e.recycleBinItemId ?? $e.itemId ?? ue;
          if (Te == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Ye = `history-restore:${R.id}:${Te}:${$e.revision}:${j.values.reviewState ?? "native"}`;
          await ee(`/bin/${Te}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ue(Ye),
              expectedRevision: $e.revision
            })
          }), He(Ye);
        } else {
          const Te = `history-bin:${R.id}:${$e.nativeSegmentId}:${$e.updatedAt}:${j.values.reviewState}`;
          await ee(`/videos/${R.id}/segments/${$e.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ue(Te),
              expectedUpdatedAt: $e.updatedAt,
              reviewState: j.values.reviewState
            })
          }), He(Te);
        }
        if (te = await m(), !be)
          continue;
        if ($e = rt(te.segments, j.identity) || te.segments.find((Te) => Te.tagId === j.values.tagId && Te.startSec === j.values.startSec && Te.endSec === j.values.endSec), !$e)
          throw new Error("The restored segment could not be found.");
      }
      const Ge = j.values;
      if ($e.nativeSegmentId == null && $e.itemId != null) {
        const Te = `history-draft-update:${R.id}:${$e.itemId}:${$e.revision}:${Ge.tagId}:${Ge.startSec}:${Ge.endSec ?? "open"}:${Ge.reviewState}`;
        await ee(`/videos/${R.id}/drafts/${$e.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ue(Te),
            expectedRevision: $e.revision,
            ...Ge
          })
        }), He(Te);
      } else
        await ee(`/videos/${R.id}/segments/${$e.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Ge, expectedUpdatedAt: $e.updatedAt })
        });
      te = await m();
    }
    return te;
  }
  async function Y(C, v) {
    var b;
    for (const x of C.targets || []) {
      const P = rt(v.segments, x.identity);
      if (!P)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const te = (b = v.performerSlotRevisions) == null ? void 0 : b[P.id];
      await ee(P.published ? `/videos/${R.id}/segments/${P.nativeSegmentId}/slots` : `/videos/${R.id}/drafts/${P.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: te,
          assignments: x.assignments
        })
      }), v = await m();
    }
    return v;
  }
  async function H(C, v, b) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let x = v, P = await ee(`/videos/${R.id}/incorrect-examples`);
    const te = (ne) => P.find((L) => {
      var re;
      return L.id === ne.exampleId || ((re = ne.collectedIdentity) == null ? void 0 : re.itemId) != null && L.itemId === ne.collectedIdentity.itemId;
    });
    for (const [ne, L] of (C.entries || []).entries()) {
      const re = `history-feedback:${R.id}:${b.action.sequence}:${b.direction}:${ne}`, N = te(L);
      if (C.collected && N) {
        He(re);
        continue;
      }
      let q;
      if (C.collected) {
        const j = rt(
          x.segments,
          L.collectedIdentity
        ) || rt(
          x.segments,
          L.originalIdentity
        );
        if (!j)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const Z = j.nativeSegmentId != null;
        q = await ee(`/videos/${R.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ue(re),
            nativeSegmentId: Z ? j.nativeSegmentId : null,
            itemId: Z ? null : j.itemId,
            expectedUpdatedAt: Z ? j.updatedAt : null,
            expectedRevision: Z ? null : j.revision
          })
        });
      } else {
        if (!N) {
          He(re);
          continue;
        }
        q = await ee(
          `/videos/${R.id}/incorrect-examples/${N.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ue(re),
              expectedExampleRevision: N.revision,
              expectedRepresentationRevision: N.representationRevision
            })
          }
        );
      }
      He(re), x = _n(
        x,
        q.editorDelta
      ), P = await ee(
        `/videos/${R.id}/incorrect-examples`
      );
    }
    return k(P), x;
  }
  async function ae(C, v, b = []) {
    const x = C.state;
    if (!s && ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")) {
      const te = `basic-history:${R.id}:${y.current.revision}:${C.action.sequence}:${C.direction}`, ne = await ee(`/videos/${R.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ue(te),
          expectedHistoryRevision: y.current.revision,
          actionSequence: C.action.sequence,
          direction: C.direction
        })
      });
      return t(ne.history), b.push(te), m();
    }
    const P = C.direction === "backward" ? C.action.afterState : C.action.beforeState;
    if ((x == null ? void 0 : x.type) === "composite") {
      let te = v;
      const ne = (P == null ? void 0 : P.type) === "composite" ? P.states || [] : [];
      for (const [L, re] of (x.states || []).entries()) {
        const N = ne[L];
        te = await ae({
          ...C,
          state: re,
          action: {
            ...C.action,
            beforeState: C.direction === "backward" ? re : N,
            afterState: C.direction === "backward" ? N : re
          }
        }, te, b);
      }
      return te;
    }
    if ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")
      return z(
        x,
        P,
        v
      );
    if ((x == null ? void 0 : x.type) === "performerSlots")
      return Y(x, v);
    if ((x == null ? void 0 : x.type) === "incorrectExamples")
      return H(x, v, C);
    if ((x == null ? void 0 : x.type) === "shots") {
      const te = Hr(v.shotBoundaries || []), ne = await ee(`/videos/${R.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ue(`history-shots:${R.id}:${te}:${x.fingerprint}`),
          expectedFingerprint: te,
          boundaries: x.boundaries
        })
      });
      return { ...v, shotBoundaries: ne };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function de(C) {
    if (h || C === g.cursorSequence) return;
    if (F != null) {
      S("Finish the pending saves before restoring history.");
      return;
    }
    if (ui(g, C).length === 0) return;
    const b = o({
      kind: "history",
      lockId: -1,
      exclusive: !0,
      run: (x) => ve(x.detail, C)
    });
    if (!b) {
      S("Finish the pending saves before restoring history.");
      return;
    }
    await b.done;
  }
  async function ve(C, v) {
    var x;
    const b = ui(y.current, v);
    if (b.length !== 0) {
      I(!0), S(`Restoring ${b.length} history ${b.length === 1 ? "action" : "actions"}…`);
      try {
        let P = C;
        const te = [];
        for (const L of b)
          P = await ae(
            L,
            P,
            te
          );
        const ne = s ? await ee(`/videos/${R.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: y.current.revision,
            targetSequence: v
          })
        }) : y.current;
        te.forEach(He), t(ne), await m(), S("History restored.");
      } catch (P) {
        P.status === 409 && ((x = P.payload) != null && x.current) && t(P.payload.current), await m(), S(P.message || "Unable to restore editor history.");
      } finally {
        I(!1);
      }
    }
  }
  function D(C) {
    A((v) => ({ ...v, timelineRatio: lo(C, f) }));
  }
  function le(C) {
    var x, P;
    const v = (x = w.current) == null ? void 0 : x.getBoundingClientRect();
    if (!v) return;
    const b = ((P = i.current) == null ? void 0 : P.offsetHeight) || 0;
    D(zs(
      C.clientY,
      v.top + b,
      Math.max(0, v.height - b)
    ));
  }
  function se(C) {
    C.currentTarget.setPointerCapture(C.pointerId), le(C);
  }
  function X(C) {
    C.currentTarget.hasPointerCapture(C.pointerId) && le(C);
  }
  function ye(C) {
    const v = C.shiftKey ? 0.1 : 0.05;
    let b = null;
    C.key === "ArrowUp" && (b = c.timelineRatio + v), C.key === "ArrowDown" && (b = c.timelineRatio - v);
    const x = so(f);
    C.key === "Home" && (b = x.minimum), C.key === "End" && (b = x.maximum), b != null && (C.preventDefault(), C.stopPropagation(), D(b));
  }
  function fe(C) {
    const v = C === "detailWidth" ? p.focusRow : p.workspace, b = p.workspace > 0 ? Yr(p.workspace, 600) : 560, x = on(c.markerRailWidth, b), P = C === "detailWidth" ? 344 + (c.markerRailOpen ? x + 24 : 0) : 600;
    return v > 0 ? Yr(v, P) : 560;
  }
  function Ce(C, v) {
    A((b) => ({ ...b, [C]: on(v, fe(C)) }));
  }
  function Pe(C, v) {
    var x, P;
    const b = v === "detailWidth" ? (x = u.current) == null ? void 0 : x.getBoundingClientRect() : (P = M.current) == null ? void 0 : P.getBoundingClientRect();
    b && Ce(v, v === "detailWidth" ? C.clientX - b.left : b.right - C.clientX);
  }
  function pe(C, v) {
    const b = fe(C), x = on(c[C], b);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": v,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(b),
      "aria-valuenow": Math.round(x),
      "aria-valuetext": `${Math.round(x)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (P) => {
        P.currentTarget.setPointerCapture(P.pointerId), Pe(P, C);
      },
      onPointerMove: (P) => {
        P.currentTarget.hasPointerCapture(P.pointerId) && Pe(P, C);
      },
      onKeyDown: (P) => {
        const te = P.shiftKey ? 40 : 16;
        let ne = null;
        P.key === "ArrowLeft" && (ne = C === "detailWidth" ? -te : te), P.key === "ArrowRight" && (ne = C === "detailWidth" ? te : -te);
        let L = ne == null ? null : x + ne;
        P.key === "Home" && (L = 240), P.key === "End" && (L = b), L != null && (P.preventDefault(), P.stopPropagation(), Ce(C, L));
      },
      onDoubleClick: () => Ce(C, Tt[C]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function Q() {
    A((C) => ({ ...C, markerRailOpen: !C.markerRailOpen })), requestAnimationFrame(() => {
      var C;
      return (C = B.current) == null ? void 0 : C.focus({ preventScroll: !0 });
    });
  }
  function he(C) {
    G((v) => v.includes(C) ? v.filter((b) => b !== C) : tn([...v, C]));
  }
  function T(C, v = !0, b = l) {
    const x = a().running != null, P = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (te) => J(te.detail, C, v, b)
    });
    return P ? (x && S(C === "split" ? "Shot boundary queued…" : "Shot merge queued…"), P.done.then((te) => te.value ?? null)) : (S("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function J(C, v, b, x) {
    var re;
    const P = (C == null ? void 0 : C.shotBoundaries) || [], te = Number((re = R.videoFile) == null ? void 0 : re.duration) || U, ne = Hr(P), L = `shot-${v}:${R.id}:${x.toFixed(3)}:${te.toFixed(3)}:${ne}`;
    S(v === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const N = await ee(`/videos/${R.id}/shot-boundaries/${v}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Ue(L), timeSec: x })
      });
      return He(L), $((q) => ({ ...q, shotBoundaries: N }), R.id), b && await W(
        "shots.update",
        v === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: P,
          fingerprint: ne
        },
        {
          type: "shots",
          boundaries: N,
          fingerprint: Hr(N)
        }
      ), S(v === "split" ? "Shot boundary added." : "Shots merged."), N;
    } catch (N) {
      return S(N.message || "Unable to edit shot boundaries."), null;
    }
  }
  return { applySegmentHistoryState: z, applyPerformerSlotHistoryState: Y, applyHistoryState: ae, restoreHistoryTarget: de, updateTimelineRatio: D, updateTimelineRatioFromPointer: le, handleSeparatorPointerDown: se, handleSeparatorPointerMove: X, handleSeparatorKeyDown: ye, panelWidthMaximum: fe, updatePanelWidth: Ce, handlePanelSeparatorPointer: Pe, panelSeparatorProps: pe, toggleSegmentRail: Q, toggleSegmentGroup: he, mutateShotBoundary: T };
}
function Pc(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: a, createSegment: i, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: u, emptyRecyclingBin: g, lineage: y, mediaDuration: h, mergeSelectedSwimlane: p, moveToBin: f, mutateShotBoundary: w, openPublishApprovedDialog: $, playbackControlsRef: m, playbackShortcutConfig: B, saveSelectedReviewState: W, seekRef: F, segmentGroupKeys: G, selectSegment: A, selectedSegment: I, selectedSegmentGroupForSegment: k, selectedSegmentGroupKey: S, selectedSegments: E, setCollapsedSegmentGroups: U, setIncorrectExamplesOpen: R, setQuickSearchOpen: M, setSaveMessage: z, setSelectedSegmentGroupKey: Y, setTagEditing: H, setTimelineZoom: ae, shotBoundaries: de, slotButtonRef: ve, splitSegment: D, swimlanes: le, timelineDuration: se, toggleIncorrectExample: X, toggleSegmentGroup: ye, updateTimelineRatio: fe, videoFrameRate: Ce, visibleSegments: Pe } = e;
  function pe(T) {
    var J, C;
    (J = m.current) == null || J.pause(), (C = m.current) == null || C.seekBy(wl(T, Ce));
  }
  function Q(T, J) {
    if (E.length > 1 && sl(T.id))
      return;
    let C = null;
    T.id === "video.playPause" && (C = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.toggle();
    }), T.id === "video.seekSmallBackward" && (C = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(-B.smallSeekTime);
    }), T.id === "video.seekSmallForward" && (C = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(B.smallSeekTime);
    }), T.id === "video.seekMediumBackward" && (C = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(-B.mediumSeekTime);
    }), T.id === "video.seekMediumForward" && (C = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(B.mediumSeekTime);
    }), T.id === "video.seekLongBackward" && (C = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(-B.longSeekTime);
    }), T.id === "video.seekLongForward" && (C = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(B.longSeekTime);
    }), T.id === "video.playSelected" && I && (C = () => {
      var v;
      (v = F.current) == null || v.call(F, I.startSec, !0), requestAnimationFrame(() => {
        var b;
        return (b = u.current) == null ? void 0 : b.focus({ preventScroll: !0 });
      });
    }), (T.id === "video.playPreviousSegment" || T.id === "video.playNextSegment") && (C = () => {
      var b;
      const v = no(
        le,
        I == null ? void 0 : I.id,
        T.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !v || v.id === (I == null ? void 0 : I.id) || (A(v, { focusEditor: !0, seekToSegment: !1 }), (b = F.current) == null || b.call(F, v.startSec, !0));
    }), T.id.startsWith("video.seekPercent") && (C = () => {
      var b;
      const v = Number(T.id.slice(17)) / 10;
      (b = F.current) == null || b.call(F, rl(h ?? se, v), !1);
    }), T.id === "video.jumpToSegmentStart" && I && (C = () => {
      var v;
      return (v = F.current) == null ? void 0 : v.call(F, I.startSec, !1);
    }), T.id === "video.jumpToSegmentEnd" && I && (C = () => {
      var v;
      return (v = F.current) == null ? void 0 : v.call(F, I.endSec ?? I.startSec, !1);
    }), T.id === "video.jumpToVideoStart" && (C = () => {
      var v;
      return (v = F.current) == null ? void 0 : v.call(F, 0, !1);
    }), T.id === "video.jumpToVideoEnd" && (C = () => {
      var v;
      return (v = F.current) == null ? void 0 : v.call(F, se, !1);
    }), T.id.startsWith("video.frame") && (C = () => {
      const v = T.id.includes("Small") ? "small" : T.id.includes("Medium") ? "medium" : "long", b = B[`${v}FrameStep`] * (T.id.endsWith("Backward") ? -1 : 1);
      pe(b);
    }), T.id.startsWith("navigation.swimlane") && (C = () => {
      const v = T.id.slice(19).toLowerCase(), b = no(le, I == null ? void 0 : I.id, v, s);
      b && A(b, { focusEditor: !0, seekToSegment: !1 });
    }), (T.id === "navigation.extendSwimlaneLeft" || T.id === "navigation.extendSwimlaneRight") && (C = () => {
      const v = Nd(
        t,
        I == null ? void 0 : I.id,
        T.id.endsWith("Left") ? "left" : "right"
      );
      v && A(v.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: v.segmentIds
      });
    }), (T.id === "navigation.segmentGroupUp" || T.id === "navigation.segmentGroupDown") && (C = () => {
      const v = Id(
        G,
        S ?? k,
        T.id.endsWith("Up") ? -1 : 1
      );
      v && Y(v);
    }), (T.id === "navigation.previousAtPlayhead" || T.id === "navigation.nextAtPlayhead") && (C = () => {
      const v = Us(Pe, s, T.id === "navigation.previousAtPlayhead" ? -1 : 1, I == null ? void 0 : I.id);
      v && A(v, { focusEditor: !0, seekToSegment: !1 });
    }), T.id === "navigation.nearestInCurrentSwimlane" && (C = () => {
      const v = Es(
        le,
        I == null ? void 0 : I.id,
        s
      );
      v && A(v, { focusEditor: !0, seekToSegment: !1 });
    }), T.id.includes("Unreviewed") && (C = () => {
      const v = kr(
        le,
        I == null ? void 0 : I.id,
        T.id.startsWith("navigation.previous") ? -1 : 1,
        T.id.endsWith("Global")
      );
      v && A(v, { focusEditor: !J.preserveFocus, seekToSegment: !1 });
    }), (T.id === "navigation.nextTouchingPlayhead" || T.id === "navigation.previousTouchingPlayhead") && (C = () => {
      const v = As(le, s, T.id === "navigation.previousTouchingPlayhead" ? -1 : 1, I == null ? void 0 : I.id);
      v && A(v, { focusEditor: !0, seekToSegment: !1 });
    }), T.id === "navigation.quickSearch" && (C = () => M(!0)), (T.id === "navigation.previousShot" || T.id === "navigation.nextShot") && (C = () => {
      var b;
      const v = kl(de, s, T.id === "navigation.previousShot" ? -1 : 1);
      v && ((b = F.current) == null || b.call(F, v.startSec, !1));
    }), T.id === "shot.split" && (C = () => w("split")), T.id === "shot.merge" && (C = () => w("merge")), T.id === "marker.create" && (C = () => i()), T.id === "marker.duplicate" && (C = () => d(!1)), T.id === "marker.duplicateAtPlayhead" && (C = () => d(!0)), T.id === "marker.split" && (C = () => D()), T.id === "marker.editTag" && (C = () => {
      var v;
      if (E.length > 1 && E.some((b) => b.isDerived)) {
        z("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((v = y.data) != null && v.tagReadOnly) {
        z("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      H(!0);
    }), T.id === "marker.setStart" && I && (C = () => r(s, I.endSec)), T.id === "marker.setEnd" && I && (C = () => r(I.startSec, s)), T.id === "marker.copyTiming" && I && (C = () => {
      z(Xd(I) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), T.id === "marker.pasteTiming" && I && (C = () => {
      const v = Zd();
      if (!v) {
        z("No copied segment timing is available.");
        return;
      }
      r(v.startSec, v.endSec);
    }), T.id === "marker.mergeSelection" && (C = () => p()), T.id === "marker.moveToBin" && (C = () => f()), T.id === "marker.toggleIncorrectExample" && I && (C = () => X()), T.id === "marker.openIncorrectExamples" && (C = () => R(!0)), T.id === "markerGroup.toggleCollapse" && S && (C = () => ye(S)), T.id === "markerGroup.toggleAll" && (C = () => U((v) => wd(v, G))), T.id === "marker.assignSlots" && (C = () => {
      var v;
      return (v = ve.current) == null ? void 0 : v.click();
    }), T.id === "navigation.zoomIn" && (C = () => ae((v) => wr(v + 0.5))), T.id === "navigation.zoomOut" && (C = () => ae((v) => wr(v - 0.5))), T.id === "navigation.resetZoom" && (C = () => ae(1)), T.id === "navigation.centerPlayhead" && (C = () => {
      var v;
      return (v = o.current) == null ? void 0 : v.call(o);
    }), T.id === "layout.growSwimlanes" && (C = () => fe(c.timelineRatio + 0.05)), T.id === "layout.shrinkSwimlanes" && (C = () => fe(c.timelineRatio - 0.05)), T.id === "marker.confirm" && I && (C = () => W("approved")), T.id === "system.publishApproved" && (C = () => $(J.target)), T.id === "marker.reject" && I && (C = () => W("rejected")), T.id === "system.emptyBin" && (C = () => g()), T.id === "system.deleteRejected" && (C = () => l()), C && C();
  }
  function he(T, J) {
    const C = Qn.find((v) => v.id === T);
    C && In(C, a) && Q(C, J);
  }
  return {
    executeShortcutById: he,
    stepVideoFrame: (T) => pe(T < 0 ? -1 : 1)
  };
}
const Lc = 3e4;
function jc(e) {
  return e === !0;
}
function Fc() {
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
function Bc({
  fetchRuns: e,
  onCompletedRun: t,
  windowTarget: r,
  documentTarget: o,
  intervalMs: a = Lc
}) {
  const i = Fc();
  let s = null, l = !1, d = null;
  const c = () => o.visibilityState !== "hidden";
  async function u() {
    if (!(l || !i.isActive())) {
      l = !0;
      try {
        const p = await e(i.signal);
        if (!i.isActive()) return;
        const f = (Array.isArray(p) ? p : []).filter(($) => ($ == null ? void 0 : $.status) === "completed" && $.id != null).map(($) => String($.id));
        if (s === null) {
          s = new Set(f);
          return;
        }
        const w = f.filter(($) => !s.has($));
        if (w.length === 0) return;
        w.forEach(($) => s.add($)), await t();
      } catch {
      } finally {
        l = !1;
      }
    }
  }
  function g() {
    clearTimeout(d), d = null, !(!i.isActive() || !c()) && (d = setTimeout(async () => {
      d = null, await u(), g();
    }, a));
  }
  function y() {
    u();
  }
  function h() {
    c() ? (u(), g()) : (clearTimeout(d), d = null);
  }
  return u(), g(), r.addEventListener("focus", y), o.addEventListener("visibilitychange", h), function() {
    i.dispose(), clearTimeout(d), d = null, r.removeEventListener("focus", y), o.removeEventListener("visibilitychange", h);
  };
}
function Gc(e, t, r, o = !1, a = () => () => {
}) {
  const [i, s] = K({
    busy: !1,
    reviewState: null,
    error: ""
  }), l = me(r);
  ge(() => {
    l.current = r;
  }, [r]);
  async function d(c) {
    const u = a("import", -1);
    if (!u) {
      s({ busy: !1, reviewState: null, error: "Wait for the current save to finish before importing Cove segments." });
      return;
    }
    s({ busy: !0, reviewState: c, error: "" });
    try {
      await ee(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: to(), reviewState: c })
      }), await t(), s({ busy: !1, reviewState: null, error: "" });
    } catch (g) {
      s({
        busy: !1,
        reviewState: null,
        error: g.message || "Unable to import Cove segments."
      });
    } finally {
      u();
    }
  }
  return ge(() => {
    if (jc(o))
      return Bc({
        fetchRuns: (c) => ee(`/videos/${e}/analysis-runs`, { signal: c }),
        onCompletedRun: () => l.current(),
        windowTarget: window,
        documentTarget: document
      });
  }, [e, o]), {
    importNativeSegments: d,
    nativeImportState: i
  };
}
const Hn = Object.freeze([]);
function Kc(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function zc({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onAnalysisCompleted: a, onSlotsChanged: i, splitLayout: s, initialSegmentId: l, compatibilityMode: d = !1, profile: c, onNavigate: u }) {
  var Lo, jo, Fo, Bo, Go;
  const g = me(null), [y, h] = K(null), [p, f] = K([]), w = me(null), $ = me(null), m = me([]), B = me(null), [W, F] = K(() => Dt({})), [G, A] = K(!1), [I, k] = K(ol), [S, E] = K(0), U = me(null), [R] = K(() => Ld({
    getContext: () => U.current,
    drainAfterSettle: !1
  })), M = _l(R.subscribe, R.getSnapshot), z = Sa(M), Y = (O, ie) => R.acquire({ kind: O, lockId: ie }), H = (O) => R.enqueue(O), ae = (O) => R.stableIdentity(O), de = me(!1);
  ge(() => (de.current = !0, () => {
    de.current = !1, queueMicrotask(() => {
      de.current || R.dispose();
    });
  }), []);
  const ve = (O) => R.cancel(O), D = (O, ie) => R.retarget(O, ie), le = R.getSnapshot, [se, X] = Hl(Hd, []), [ye, fe] = K(""), [Ce, Pe] = K(""), [pe, Q] = K(""), [he, T] = K(1), [J, C] = K(Vd), [v, b] = K(0), [x, P] = K({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [te, ne] = K(Jt), L = me(Jt), [re, N] = K(!1), [q, j] = K(!1), [Z, be] = K(!1), ue = me(!1);
  ue.current = Z;
  const [$e, pt] = K(null), [Ge, Te] = K(!1), [Ye, it] = K(null), [ht, Xe] = K(null), yt = me(null), [ut, Fe] = K(!1), [Qe, _e] = K(""), Je = me(null), st = me(null), Ot = me(!1), [V, oe] = K(Jd), [Re, Ne] = K(null), [Se, et] = K(!1), [Ke, Ze] = K(!1), [Me, Ae] = K(!1), [qe, Ee] = K(!1), [je, tt] = K(!1), [ke, Le] = K(""), {
    importNativeSegments: Oe,
    nativeImportState: ft
  } = Gc(
    e.video.id,
    o,
    a,
    d,
    (O, ie) => R.acquire({ kind: O, lockId: ie })
  ), [Ve, lt] = K(!1), [Pt, at] = K(null), [Ie, we] = K(d), [nt, Mt] = K(0), [mt, vt] = K(!1), [bt, Lt] = K(""), [Ut, Mr] = K(null), Tn = me(null), Rn = me(null), dn = me(!1), [nn, cn] = K([]), [Xn, Ar] = K(!1), [er, Mn] = K(null), un = qd(), mn = me(null), tr = me(null), gn = me(null), Er = me(l), An = me(null), En = me(null), Qt = me(null), Dn = me(null), On = me(null), xt = me(null), nr = me(null), jt = me(null), rr = me(null), Pn = me(null), Ln = me(null), jn = me(null), Dr = me(-1e12), or = me(null), Fn = me(null), [pn, Bn] = K({ scrollTop: 0, height: 512 });
  ge(() => {
    if (!Ve || mt || !bt) return;
    const O = requestAnimationFrame(() => {
      var ie;
      return (ie = Rn.current) == null ? void 0 : ie.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(O);
  }, [Ve, mt, bt]), ge(() => {
    if (!dn.current || Ve || Ie) return;
    const O = requestAnimationFrame(() => {
      var ie;
      (ie = Tn.current) == null || ie.focus({ preventScroll: !0 }), dn.current = !1;
    });
    return () => cancelAnimationFrame(O);
  }, [Ve, Ie]);
  const ot = e.video, Be = e.segments || Hn, ir = We(() => JSON.stringify({
    segments: Be.map((O) => [
      O.id,
      O.itemId,
      O.nativeSegmentId,
      O.tagId,
      O.startSec,
      O.endSec,
      O.reviewState,
      O.published,
      O.sourceKey,
      O.sourceRunId,
      O.confidence,
      O.revision,
      O.updatedAt
    ]),
    performerSlots: (e.performerSlots || Hn).map((O) => [
      O.segmentId,
      O.slotDefinitionId,
      O.performerId,
      O.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [Be, e.performerSlots, e.itemMetadata]);
  ge(() => {
    if (!d) {
      at(null), we(!1);
      return;
    }
    if (z != null) {
      we(!0);
      return;
    }
    let O = !0;
    we(!0);
    const ie = setTimeout(() => {
      ee(`/videos/${ot.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((ze) => {
        O && (at(ze), Lt(""));
      }).catch((ze) => {
        O && (at(null), Lt(ze.message || "Unable to preview derived segments."));
      }).finally(() => {
        O && we(!1);
      });
    }, 150);
    return () => {
      O = !1, clearTimeout(ie);
    };
  }, [d, ot.id, ir, nt, z]);
  const Or = () => Mt((O) => O + 1), Ht = e.segmentGroups || Hn, St = e.performerSlots || Hn, rn = d && e.performerSlotsAvailable !== !1, Gn = We(
    () => (e.performerCandidates || []).filter((O) => O.isVideoPerformer),
    [e.performerCandidates]
  ), fn = e.shotBoundaries || Hn, yn = We(
    () => pa(St),
    [St]
  ), bn = We(
    () => Be.map((O) => {
      const ie = yn.get(O.id) || [];
      return {
        ...O,
        slots: ie,
        assignment: ie.every((ze) => ze.performerId == null) ? Pl(ie, Gn) : null
      };
    }).filter((O) => O.slots.length > 0 && O.assignment != null),
    [Be, yn, Gn]
  ), ar = Number((Lo = ot.videoFile) == null ? void 0 : Lo.frameRate) > 0 ? Number(ot.videoFile.frameRate) : 30;
  function sr() {
    const O = ue.current;
    be(!1), O && requestAnimationFrame(() => {
      var ie;
      return (ie = xt.current) == null ? void 0 : ie.focus({ preventScroll: !0 });
    });
  }
  function Kn() {
    z == null && (jn.current = null, Te(!1), fe(""), requestAnimationFrame(() => {
      var O;
      return (O = xt.current) == null ? void 0 : O.focus({ preventScroll: !0 });
    }));
  }
  function _t() {
    A(!1), requestAnimationFrame(() => {
      var O, ie;
      (O = jt.current) != null && O.isConnected ? jt.current.focus({ preventScroll: !0 }) : (ie = xt.current) == null || ie.focus({ preventScroll: !0 });
    });
  }
  ge(() => {
    Ln.current === y ? (Ln.current = null, be(!0)) : be(!1);
  }, [y]), ge(() => {
    var ie;
    if (!Z) return;
    const O = (ie = Pn.current) == null ? void 0 : ie.querySelector("input");
    document.activeElement !== O && (O == null || O.focus({ preventScroll: !0 }), O == null || O.select());
  }, [Z, y]), ge(() => {
    var ie;
    if (Z) return;
    const O = (ie = xt.current) == null ? void 0 : ie.ownerDocument;
    O && O.activeElement === O.body && xt.current.focus({ preventScroll: !0 });
  }, [Z]), ge(() => {
    var ze, dt, Bt;
    const O = an(
      zr(
        e.segments,
        e.performerSlots || [],
        Dt({}),
        d && I,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), ie = ((ze = e.segments.find((Sn) => Sn.id === l)) == null ? void 0 : ze.id) ?? ((dt = Ui(O)) == null ? void 0 : dt.id) ?? null;
    h(ie), f(ie == null ? [] : [ie]), $.current = ie, m.current = [], Ne(Gt(O, ie)), F(Dt({})), A(!1), jn.current = null, Te(!1), T(1), fe(""), ne(Jt), L.current = Jt, N(!1), (Bt = xt.current) == null || Bt.focus({ preventScroll: !0 });
  }, [ot.id, l]), ge(() => {
    const O = new AbortController();
    return ee(`/videos/${ot.id}/incorrect-examples`, { signal: O.signal }).then(cn).catch((ie) => {
      ie.name !== "AbortError" && cn([]);
    }), () => O.abort();
  }, [ot.id, c == null ? void 0 : c.effectiveMode]), ge(() => {
    const O = new AbortController();
    return ee(`/videos/${ot.id}/history`, { signal: O.signal }).then((ie) => {
      const ze = ie || Jt;
      L.current = ze, ne(ze);
    }).catch((ie) => {
      ie.name !== "AbortError" && fe(ie.message || "Unable to load editor history.");
    }), () => O.abort();
  }, [ot.id]), ge(() => {
    Qd(J);
  }, [J.timelineRatio, J.markerRailOpen, J.detailWidth, J.markerRailWidth, J.swimlaneTitleWidth]), ge(() => {
    Yd(V);
  }, [V]), ge(() => {
    il(I);
  }, [I]), ge(() => {
    const O = En.current;
    if (!s || !O || typeof ResizeObserver > "u") return;
    const ie = () => {
      var Bt;
      const dt = Math.max(0, O.clientHeight - (((Bt = Qt.current) == null ? void 0 : Bt.offsetHeight) || 0));
      b(dt), C((Sn) => {
        const Ko = lo(Sn.timelineRatio, dt);
        return Ko === Sn.timelineRatio ? Sn : { ...Sn, timelineRatio: Ko };
      });
    }, ze = new ResizeObserver(ie);
    return ze.observe(O), Qt.current && ze.observe(Qt.current), ie(), () => ze.disconnect();
  }, [s]), ge(() => {
    if (!un || typeof ResizeObserver > "u") return;
    const O = On.current, ie = Dn.current;
    if (!O || !ie) return;
    const ze = () => P({
      workspace: O.clientWidth,
      focusRow: ie.clientWidth,
      focusRowHeight: ie.clientHeight
    }), dt = new ResizeObserver(ze);
    return dt.observe(O), dt.observe(ie), ze(), () => dt.disconnect();
  }, [un, J.markerRailOpen]);
  const At = We(
    () => zd(Be, se),
    [Be, se]
  );
  di(() => {
    Ca(se, e) !== se && X({ type: "prune", detail: e });
  }, [e, se]);
  const Ft = We(
    () => fi(
      zr(
        At,
        St,
        W,
        d && I,
        Ht
      ),
      nn,
      !0
    ),
    [
      At,
      St,
      W,
      I,
      Ht,
      d,
      nn
    ]
  ), Pr = Object.fromEntries(Nt.map((O) => [O, Ft.filter((ie) => ie.reviewState === O).length])), Lr = fi(
    zr(
      At,
      St,
      { ...W, reviewStates: Nt },
      d && I,
      Ht
    ),
    nn,
    !0
  ), jr = Object.fromEntries(Nt.map((O) => [O, Lr.filter((ie) => ie.reviewState === O).length])), Fr = [...new Set(At.map((O) => O.sourceKey).filter(Boolean))].sort((O, ie) => zt(O).localeCompare(zt(ie))), hn = Vs(
    W,
    d && I
  ), gt = We(
    () => an(Ft, Ht, St),
    [Ft, Ht, St]
  ), _ = We(
    () => kd(gt, V),
    [gt, V]
  ), xe = Qs(
    gt,
    y,
    l,
    {
      visibleLanes: _,
      reference: ((jo = g.current) == null ? void 0 : jo.videoId) === ot.id ? g.current.reference : null
    }
  );
  ge(() => {
    const O = vr(gt, xe == null ? void 0 : xe.id);
    O && (g.current = { videoId: ot.id, reference: O });
  }, [ot.id, xe == null ? void 0 : xe.id, gt]);
  const Ct = We(() => {
    const O = Gd(se);
    return O.length === 0 ? Be : [...Be, ...O];
  }, [Be, se]), ce = xe == null ? null : Ct.find((O) => O.id === xe.id) || xe, kt = Qo(Ct, Qo(Ft, p).map((O) => O.id)), qt = !d && kt.length > 0 && kt.every((O) => O.nativeSegmentId != null), lr = Ft.map((O) => O.id), Da = lr.join("|");
  w.current = (ce == null ? void 0 : ce.id) ?? null;
  const xo = yn.get(ce == null ? void 0 : ce.id) || [], Oa = fo(xo), So = We(
    () => xd(gt, p),
    [gt, p]
  ), dr = We(() => yo(gt), [gt]), zn = We(
    () => hd(dr, V),
    [dr, V]
  ), Pa = We(
    () => ya(
      zn.rows,
      pn.scrollTop,
      pn.height
    ),
    [zn, pn]
  ), La = kr(_, ce == null ? void 0 : ce.id, -1, !0) != null, ja = kr(_, ce == null ? void 0 : ce.id, 1, !0) != null, vn = ce ? Gt(gt, ce.id) : null, Br = fa(dr) ? dr.map((O) => O.key) : [], Fa = Br.join("|"), cr = Math.max(
    0,
    Number((Fo = ot.videoFile) == null ? void 0 : Fo.duration) || 0,
    ...At.map((O) => Number(O.endSec ?? O.startSec) || 0)
  ), ko = Number((Bo = ot.videoFile) == null ? void 0 : Bo.duration) > 0 ? Number(ot.videoFile.duration) : null;
  te.actions;
  const Ba = Zi();
  ge(() => {
    const O = y === Nn ? y : (ce == null ? void 0 : ce.id) ?? null;
    O !== y && h(O);
  }, [ce, y]), ge(() => {
    f((O) => {
      const ie = tl(
        O,
        lr,
        (ce == null ? void 0 : ce.id) ?? null
      );
      return ie.length === O.length && ie.every((ze, dt) => ze === O[dt]) ? O : ie;
    });
  }, [Da, ce == null ? void 0 : ce.id]);
  const xn = (ce == null ? void 0 : ce.itemId) == null ? null : ((Go = e.itemMetadata) == null ? void 0 : Go[ce.itemId]) || null, Ga = {
    key: (ce == null ? void 0 : ce.itemId) != null ? `item:${ce.itemId}` : (ce == null ? void 0 : ce.nativeSegmentId) != null ? `native:${ce.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (xn == null ? void 0 : xn.provenance) || (ce == null ? void 0 : ce.fieldProvenance) || [] : []
  }, Gr = (ce == null ? void 0 : ce.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (xn == null ? void 0 : xn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  ge(() => {
    Pe(xe == null ? "" : String(xe.startSec)), Q((xe == null ? void 0 : xe.endSec) == null ? "" : String(xe.endSec));
  }, [xe == null ? void 0 : xe.id, xe == null ? void 0 : xe.startSec, xe == null ? void 0 : xe.endSec]), ge(() => {
    vn && oe((O) => va(O, vn));
  }, [ot.id, l, vn]), ge(() => {
    Ne((O) => Cd(Br, O, vn));
  }, [ot.id, Fa, vn]), ge(() => {
    if (!J.markerRailOpen || (ce == null ? void 0 : ce.id) == null) return;
    const O = Fn.current, ie = zn.rows.find((Bt) => Bt.kind === "segment" && Bt.segment.id === ce.id);
    if (!O || !ie) return;
    const ze = ie.top + ie.height;
    let dt = O.scrollTop;
    ie.top < O.scrollTop ? dt = ie.top : ze > O.scrollTop + O.clientHeight && (dt = Math.max(0, ze - O.clientHeight)), dt !== O.scrollTop && (O.scrollTop = dt), Bn({ scrollTop: dt, height: O.clientHeight });
  }, [ce == null ? void 0 : ce.id, zn, J.markerRailOpen]), ge(() => {
    const O = Fn.current;
    if (!J.markerRailOpen || !O) return;
    const ie = () => Bn({
      scrollTop: O.scrollTop,
      height: O.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      ie();
      return;
    }
    const ze = new ResizeObserver(ie);
    return ze.observe(O), ie(), () => ze.disconnect();
  }, [J.markerRailOpen]);
  const { revealSegmentGroupForSelection: wo, replaceSegmentSelection: Ka, selectSegment: No, selectSegmentCollection: za, selectAllVideoSegments: Ua } = Ac({
    allSwimlanes: gt,
    editorRef: xt,
    performerSlots: St,
    seekRef: mn,
    segmentGroups: Ht,
    segments: Be,
    selectedSegmentId: y,
    selectedSegmentIds: p,
    selectionAnchorIdRef: $,
    selectionRangeBaseIdsRef: m,
    setCollapsedSegmentGroups: oe,
    setEditorFilters: F,
    setHideDerivedSegments: k,
    setSaveMessage: fe,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: h,
    setSelectedSegmentIds: f
  }), { acceptHistory: Kr, recordHistoryAction: ur, mutateSegment: Ha, runSegmentMutation: _a, completeReview: qa, createSegment: Io, splitSegment: Co, duplicateSegment: $o, saveTiming: Wa, applyShortcutTiming: Va } = _d({
    compatibilityMode: d,
    currentTime: S,
    detail: e,
    editorFilters: W,
    endInput: pe,
    hideDerivedSegments: I,
    historyRef: L,
    mediaDuration: ko,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: Dr,
    pendingDuplicateRef: or,
    pendingFirstSegmentStartSecRef: jn,
    pendingTagEditSegmentIdRef: Ln,
    performerSlots: St,
    enqueueSave: H,
    pendingChanges: se,
    retargetSaveTasks: D,
    replaceSegmentSelection: Ka,
    savingSegmentId: z,
    segments: Be,
    selectedSegment: ce,
    selectedSegmentIdRef: w,
    selectedSegments: kt,
    selectionAnchorIdRef: $,
    selectionRangeBaseIdsRef: m,
    setCreatingSegmentId: pt,
    setEditorFilters: F,
    setFirstSegmentTagOpen: Te,
    setHideDerivedSegments: k,
    setHistory: ne,
    setHistoryOpen: N,
    setPublishApprovedError: _e,
    setSaveMessage: fe,
    acquireSaveLock: Y,
    dispatchPendingChanges: X,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: h,
    setSelectedSegmentIds: f,
    setTagEditing: be,
    startInput: Ce,
    tagEditingRef: ue,
    timelineDuration: cr,
    video: ot
  });
  function To(O = null) {
    var dt;
    if (!d || z != null || !Be.some((Bt) => !Bt.published && Bt.reviewState === "approved")) return;
    const ie = ((dt = xt.current) == null ? void 0 : dt.ownerDocument) ?? document, ze = ie.activeElement === ie.body ? null : ie.activeElement;
    st.current = O != null && O.isConnected && O !== ie.body ? O : ze, _e(""), Fe(!0);
  }
  function Ro() {
    z == null && (Fe(!1), _e(""), requestAnimationFrame(() => {
      Kc(
        st.current,
        xt.current
      ), st.current = null;
    }));
  }
  async function Ja() {
    await qa() && Ro();
  }
  const { closeMergeConfirmation: Ya, mergeSelectedSwimlane: Mo, saveSelectedReviewState: Qa } = Ec({
    acceptHistory: Kr,
    compatibilityMode: d,
    detail: e,
    detailPanelRef: B,
    getSaveQueueSnapshot: le,
    historyRef: L,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: ur,
    revealSegmentGroupForSelection: wo,
    savingSegmentId: z,
    selectedGroups: So,
    selectedSegment: ce,
    selectedSegmentIdRef: w,
    selectedSegments: kt,
    selectionAnchorIdRef: $,
    selectionRangeBaseIdsRef: m,
    setMergeConfirmation: it,
    setSaveMessage: fe,
    acquireSaveLock: Y,
    dispatchPendingChanges: X,
    enqueueSave: H,
    stableSaveIdentity: ae,
    setSelectedSegmentId: h,
    setSelectedSegmentIds: f,
    video: ot
  }), Za = (O) => {
    const ie = (O || []).map($t);
    R.cancel((ze) => ze.kind === "review" && bo(ze.targets, ie));
  }, Xa = R.settledCount();
  di(() => {
    R.markCommitted(Xa), U.current = {
      detail: e,
      segments: Be,
      onConflict: r,
      onDetailChange: t,
      onReload: o,
      tagEditing: Z,
      selectedSegmentIds: p,
      activeSegmentId: (ce == null ? void 0 : ce.id) ?? null
    };
  }), ge(() => {
    R.poke();
  });
  const { toggleIncorrectExample: es, removeIncorrectExample: ts, captureTrainingExport: ns, deleteRejectedSegments: Ao, autoAssignPerformers: rs, previewDerivedSegments: os, closeMaterializeDialog: is, materializeDerivedSegments: as, saveTag: ss, moveToBin: ls, emptyRecyclingBin: ds } = Dc({
    acceptHistory: Kr,
    allSwimlanes: gt,
    autoAssignCandidates: bn,
    autoAssigning: je,
    binEmptyingRef: Ot,
    canMoveSelectionToBin: qt,
    closeTagEditing: sr,
    compatibilityMode: d,
    creatingSegmentId: $e,
    detail: e,
    editorFilters: W,
    editorRef: xt,
    exportingExamples: Xn,
    hideDerivedSegments: I,
    incorrectExamples: nn,
    lineage: Gr,
    materializeButtonRef: Tn,
    materializePreview: Pt,
    materializeRestoreFocusRef: dn,
    materializing: mt,
    mutateSegment: Ha,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: St,
    cancelSaveTasks: ve,
    dispatchPendingChanges: X,
    enqueueSave: H,
    stableSaveIdentity: ae,
    pendingChanges: se,
    runSegmentMutation: _a,
    recordHistoryAction: ur,
    refreshMaterializationPreview: Or,
    removingExampleId: er,
    revealSegmentGroupForSelection: wo,
    savingSegmentId: z,
    segmentGroups: Ht,
    segments: Be,
    selectedSegment: ce,
    selectedSegmentIdRef: w,
    selectedSegments: kt,
    selectionAnchorIdRef: $,
    selectionRangeBaseIdsRef: m,
    setAutoAssignError: Le,
    setAutoAssignOpen: Ee,
    setAutoAssigning: tt,
    setEditorFilters: F,
    setExportingExamples: Ar,
    setHideDerivedSegments: k,
    setIncorrectExamples: cn,
    setMaterializeError: Lt,
    setMaterializeLoading: we,
    setMaterializeOpen: lt,
    setMaterializePreview: at,
    setMaterializing: vt,
    setRemovingExampleId: Mn,
    setRejectedDeletionPreview: Xe,
    setSaveMessage: fe,
    acquireSaveLock: Y,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: h,
    setSelectedSegmentIds: f,
    swimlanes: _,
    video: ot
  }), { restoreHistoryTarget: cs, updateTimelineRatio: Eo, handleSeparatorPointerDown: us, handleSeparatorPointerMove: ms, handleSeparatorKeyDown: gs, panelWidthMaximum: Do, panelSeparatorProps: ps, toggleSegmentRail: fs, toggleSegmentGroup: Oo, mutateShotBoundary: ys } = Oc({
    acceptHistory: Kr,
    compatibilityMode: d,
    currentTime: S,
    detail: e,
    editorLayout: J,
    focusRowRef: Dn,
    history: te,
    historyRef: L,
    historySaving: q,
    horizontalLayoutSize: x,
    mediaStackHeight: v,
    mediaStackRef: En,
    commonActionsRef: Qt,
    onDetailChange: t,
    onReload: o,
    railToggleRef: nr,
    recordHistoryAction: ur,
    savingSegmentId: z,
    setCollapsedSegmentGroups: oe,
    setEditorLayout: C,
    setHistorySaving: j,
    setIncorrectExamples: cn,
    setSaveMessage: fe,
    acquireSaveLock: Y,
    enqueueSave: H,
    getSaveQueueSnapshot: le,
    shotBoundaries: fn,
    timelineDuration: cr,
    video: ot,
    workspaceRef: On
  }), { executeShortcutById: Po, stepVideoFrame: bs } = Pc({
    allSwimlanes: gt,
    applyShortcutTiming: Va,
    centerTimelineRef: An,
    compatibilityMode: d,
    createSegment: Io,
    currentTime: S,
    deleteRejectedSegments: Ao,
    duplicateSegment: $o,
    editorLayout: J,
    editorRef: xt,
    emptyRecyclingBin: ds,
    lineage: Gr,
    mediaDuration: ko,
    mergeSelectedSwimlane: Mo,
    moveToBin: ls,
    mutateShotBoundary: ys,
    openPublishApprovedDialog: To,
    playbackControlsRef: tr,
    playbackShortcutConfig: Ba,
    saveSelectedReviewState: Qa,
    seekRef: mn,
    segmentGroupKeys: Br,
    selectSegment: No,
    selectedSegment: ce,
    selectedSegmentGroupForSegment: vn,
    selectedSegmentGroupKey: Re,
    selectedSegments: kt,
    setCollapsedSegmentGroups: oe,
    setIncorrectExamplesOpen: Ae,
    setQuickSearchOpen: Ze,
    setSaveMessage: fe,
    setSelectedSegmentGroupKey: Ne,
    setTagEditing: be,
    setTimelineZoom: T,
    shotBoundaries: fn,
    slotButtonRef: rr,
    splitSegment: Co,
    swimlanes: _,
    timelineDuration: cr,
    toggleIncorrectExample: es,
    toggleSegmentGroup: Oo,
    updateTimelineRatio: Eo,
    videoFrameRate: ar,
    visibleSegments: Ft
  });
  gn.current = Po;
  const hs = We(() => Qn.map((O) => ({
    id: O.id,
    enabled: In(O, d),
    surface: "local",
    action: (ie) => {
      var ze;
      return (ze = gn.current) == null ? void 0 : ze.call(gn, O.id, ie);
    }
  })), [d]);
  Ei(io, hs);
  const vs = so(v), xs = on(J.markerRailWidth, Do("markerRailWidth")), Ss = on(J.detailWidth, Do("detailWidth"));
  return n(Mc, {
    activeFilterCount: hn,
    allSwimlanes: gt,
    approvalFacetCounts: jr,
    autoAssignCandidates: bn,
    autoAssignError: ke,
    autoAssignOpen: qe,
    autoAssignPerformers: rs,
    autoAssigning: je,
    canMoveSelectionToBin: qt,
    captureTrainingExport: ns,
    cancelQueuedReviewsForSegments: Za,
    removeIncorrectExample: ts,
    rejectedDeletionPreview: ht,
    centerTimelineRef: An,
    closeEditorFilters: _t,
    closeFirstSegmentTagDialog: Kn,
    closeMaterializeDialog: is,
    closeMergeConfirmation: Ya,
    closePublishApprovedDialog: Ro,
    closeTagEditing: sr,
    collapsedSegmentGroups: V,
    commonActionsRef: Qt,
    compatibilityMode: d,
    configuringTag: Ut,
    createSegment: Io,
    currentTime: S,
    deleteRejectedSegments: Ao,
    detail: e,
    detailPanelRef: B,
    detailWidth: Ss,
    duplicateSegment: $o,
    editorFilters: W,
    editorLayout: J,
    editorRef: xt,
    exportingExamples: Xn,
    filtersButtonRef: jt,
    filtersOpen: G,
    firstSegmentTagOpen: Ge,
    focusRowRef: Dn,
    handleSeparatorKeyDown: gs,
    handleSeparatorPointerDown: us,
    handleSeparatorPointerMove: ms,
    hideDerivedSegments: I,
    history: te,
    historyOpen: re,
    historySaving: q,
    hasNextUnreviewed: ja,
    hasPreviousUnreviewed: La,
    horizontalLayoutSize: x,
    importNativeSegments: Oe,
    incorrectExamples: nn,
    incorrectExamplesOpen: Me,
    removingExampleId: er,
    lineage: Gr,
    markerRailWidth: xs,
    materializeButtonRef: Tn,
    materializeCancelButtonRef: Rn,
    materializeDerivedSegments: as,
    materializeError: bt,
    materializeLoading: Ie,
    materializeOpen: Ve,
    materializePreview: Pt,
    materializing: mt,
    mediaStackRef: En,
    mergeCancelButtonRef: yt,
    mergeConfirmation: Ye,
    mergeSaving: Pd(M, "merge"),
    mergeSelectedSwimlane: Mo,
    nativeImportState: ft,
    onNavigate: u,
    onDetailChange: t,
    openPublishApprovedDialog: To,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: ps,
    pendingInitialSeekRef: Er,
    performerSlots: St,
    performerSlotsAvailable: rn,
    playbackControlsRef: tr,
    previewDerivedSegments: os,
    provenance: Ga,
    provenanceSources: Fr,
    publishApprovedCancelButtonRef: Je,
    publishApprovedDrafts: Ja,
    publishApprovedError: Qe,
    publishApprovedOpen: ut,
    quickSearchOpen: Ke,
    railScrollRef: Fn,
    railToggleRef: nr,
    recordHistoryAction: ur,
    restoreHistoryTarget: cs,
    runEditorAction: Po,
    stepVideoFrame: bs,
    saveMessage: ye,
    setSaveMessage: fe,
    saveTag: ss,
    saveTiming: Wa,
    savingSegmentId: z,
    acquireSaveLock: Y,
    seekRef: mn,
    segmentGroups: Ht,
    segmentRailLayout: zn,
    segments: At,
    selectAllVideoSegments: Ua,
    selectSegment: No,
    selectSegmentCollection: za,
    selectedGroups: So,
    selectedPerformerSlots: xo,
    selectedSegment: xe,
    selectedSegmentGroupKey: Re,
    selectedSegmentIds: p,
    selectedSegments: kt,
    selectedSlotStatus: Oa,
    setAutoAssignError: Le,
    setAutoAssignOpen: Ee,
    setConfiguringTag: Mr,
    setCurrentTime: E,
    setEditorFilters: F,
    setEditorLayout: C,
    setFiltersOpen: A,
    setHideDerivedSegments: k,
    setHistoryOpen: N,
    setIncorrectExamplesOpen: Ae,
    setQuickSearchOpen: Ze,
    setRejectedDeletionPreview: Xe,
    setRailViewport: Bn,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: h,
    setShortcutsOpen: et,
    setTimelineZoom: T,
    shotBoundaries: fn,
    shortcutsOpen: Se,
    slotButtonRef: rr,
    splitLayout: s,
    splitSegment: Co,
    tagEditing: Z,
    creatingSegmentId: $e,
    tagSearchRef: Pn,
    timelineDuration: cr,
    timelineRatioBounds: vs,
    timelineZoom: he,
    toggleSegmentGroup: Oo,
    toggleSegmentRail: fs,
    updateTimelineRatio: Eo,
    video: ot,
    videoPerformers: Gn,
    visibleCounts: Pr,
    visibleSegmentRailRows: Pa,
    visibleSegments: Ft,
    wideLayout: un,
    workspaceRef: On
  });
}
function Uc(e = [], t = []) {
  const r = new Map((t || []).map((s) => [
    Number(s.tagId),
    {
      ...s,
      tagId: Number(s.tagId),
      definitions: [...s.definitions || []].sort((l, d) => (l.sortOrder ?? 0) - (d.sortOrder ?? 0) || String(l.id).localeCompare(String(d.id)))
    }
  ])), o = /* @__PURE__ */ new Set(), a = [...e || []].sort((s, l) => (s.sortOrder ?? 0) - (l.sortOrder ?? 0) || Number(s.id) - Number(l.id)).map((s) => ({
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
  })), i = [...r.values()].filter((s) => !o.has(s.tagId) && s.definitions.length > 0).map((s) => ({
    tagId: s.tagId,
    tagName: s.tagName || `Tag ${s.tagId}`,
    sortOrder: 0,
    allowSamePerformerInMultipleSlots: !!s.allowSamePerformerInMultipleSlots,
    definitions: s.definitions
  })).sort((s, l) => String(s.tagName).localeCompare(String(l.tagName), void 0, {
    numeric: !0,
    sensitivity: "base"
  }) || s.tagId - l.tagId);
  return i.length > 0 && a.push({
    id: "ungrouped",
    overviewKey: "ungrouped",
    name: "Ungrouped",
    sortOrder: a.length,
    synthetic: !0,
    tags: i
  }), a;
}
function Hc(e = [], t = "", r = "all") {
  const o = String(t || "").trim().toLocaleLowerCase();
  return e.map((a) => ({
    ...a,
    tags: (a.tags || []).filter((i) => {
      const s = (i.definitions || []).length > 0;
      return r === "with" && !s || r === "without" && s ? !1 : o ? [
        i.tagName,
        ...(i.definitions || []).map((l) => l.label)
      ].some((l) => String(l || "").toLocaleLowerCase().includes(o)) : !0;
    })
  })).filter((a) => a.tags.length > 0);
}
function wt(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function _c(e = [], t = []) {
  var h;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((p, f) => (p.sortOrder ?? 0) - (f.sortOrder ?? 0) || Number(p.id) - Number(f.id)).forEach((p, f) => {
    [...p.tags || []].sort((w, $) => (w.sortOrder ?? 0) - ($.sortOrder ?? 0) || Number(w.tagId) - Number($.tagId)).forEach((w, $) => r.set(Number(w.tagId), {
      key: `group:${p.id}`,
      id: p.id,
      name: p.name,
      sortOrder: p.sortOrder ?? f,
      tagSortOrder: w.sortOrder ?? $
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function a(p, f) {
    const w = Number(p);
    if (!o.has(w)) {
      const $ = r.get(w);
      o.set(w, {
        tagId: w,
        name: f || `Tag ${w}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: ($ == null ? void 0 : $.key) || "ungrouped",
        segmentGroupId: ($ == null ? void 0 : $.id) ?? null,
        segmentGroupName: ($ == null ? void 0 : $.name) || "Ungrouped",
        segmentGroupSortOrder: ($ == null ? void 0 : $.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: ($ == null ? void 0 : $.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(w);
  }
  const i = /* @__PURE__ */ new Map();
  e.forEach((p) => {
    const f = a(p.sourceTagId, p.sourceTagName), w = a(p.derivedTagId, p.derivedTagName);
    f.outgoingRuleCount++, w.incomingRuleCount++;
    const $ = `${f.tagId}:${w.tagId}`;
    i.has($) || i.set($, {
      id: $,
      sourceTagId: f.tagId,
      derivedTagId: w.tagId,
      rules: [],
      edgeCount: 0
    });
    const m = i.get($);
    m.rules.push(p), m.edgeCount += Number(p.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...i.values()], d = new Map(s.map((p) => [p.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((p) => {
    var f, w;
    (f = d.get(p.sourceTagId)) == null || f.add(p.derivedTagId), (w = d.get(p.derivedTagId)) == null || w.add(p.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), u = [];
  for (const p of s) {
    if (c.has(p.tagId)) continue;
    const f = [p.tagId], w = [];
    for (c.add(p.tagId); f.length > 0; ) {
      const A = f.shift();
      w.push(A);
      for (const I of d.get(A) || [])
        c.has(I) || (c.add(I), f.push(I));
    }
    const $ = new Set(w), m = w.map((A) => o.get(A)), B = l.filter((A) => $.has(A.sourceTagId) && $.has(A.derivedTagId)), W = B.flatMap((A) => A.rules), F = m.filter((A) => A.outgoingRuleCount === 0).sort((A, I) => wt(A.name, I.name)), G = F.length > 0 ? F : [...m].sort((A, I) => wt(A.name, I.name));
    u.push({
      id: [...w].sort((A, I) => A - I).join(":"),
      label: G.length > 1 ? `${G[0].name} + ${G.length - 1}` : ((h = G[0]) == null ? void 0 : h.name) || "Derivation component",
      nodes: m,
      connections: B,
      rules: W,
      segmentGroupKeys: [...new Set(m.map((A) => A.segmentGroupKey))],
      materializedEdgeCount: W.reduce(
        (A, I) => A + (Number(I.edgeCount) || 0),
        0
      )
    });
  }
  u.sort((p, f) => f.rules.length - p.rules.length || wt(p.label, f.label));
  const g = /* @__PURE__ */ new Map();
  s.forEach((p) => {
    g.has(p.segmentGroupKey) || g.set(p.segmentGroupKey, {
      key: p.segmentGroupKey,
      id: p.segmentGroupId,
      name: p.segmentGroupName,
      sortOrder: p.segmentGroupSortOrder,
      nodes: [],
      ruleIds: /* @__PURE__ */ new Set(),
      componentIds: /* @__PURE__ */ new Set()
    }), g.get(p.segmentGroupKey).nodes.push(p);
  }), u.forEach((p) => {
    p.nodes.forEach((f) => {
      var w;
      return (w = g.get(f.segmentGroupKey)) == null ? void 0 : w.componentIds.add(p.id);
    }), p.rules.forEach((f) => {
      var w, $;
      (w = g.get(o.get(Number(f.sourceTagId)).segmentGroupKey)) == null || w.ruleIds.add(f.id), ($ = g.get(o.get(Number(f.derivedTagId)).segmentGroupKey)) == null || $.ruleIds.add(f.id);
    });
  });
  const y = [...g.values()].sort((p, f) => p.sortOrder - f.sortOrder || wt(p.name, f.name)).map((p) => ({
    ...p,
    ruleCount: p.ruleIds.size,
    componentCount: p.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: u,
    segmentGroups: y
  };
}
function qc(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const u = new Map(e.nodes.map((k) => [k.tagId, /* @__PURE__ */ new Set()])), g = new Map(e.nodes.map((k) => [k.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((k) => {
    var S, E;
    (S = u.get(k.sourceTagId)) == null || S.add(k.derivedTagId), (E = g.get(k.derivedTagId)) == null || E.add(k.sourceTagId);
  });
  const y = new Map(e.nodes.map((k) => {
    var S;
    return [
      k.tagId,
      ((S = g.get(k.tagId)) == null ? void 0 : S.size) || 0
    ];
  })), h = new Map(e.nodes.map((k) => [k.tagId, 0])), p = e.nodes.filter((k) => y.get(k.tagId) === 0).sort((k, S) => wt(k.name, S.name)).map((k) => k.tagId), f = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const k = p.shift();
    if (!f.has(k)) {
      f.add(k);
      for (const S of u.get(k) || [])
        h.set(S, Math.max(h.get(S) || 0, (h.get(k) || 0) + 1)), y.set(S, y.get(S) - 1), y.get(S) === 0 && p.push(S);
    }
  }
  f.size !== e.nodes.length && e.nodes.filter((k) => !f.has(k.tagId)).sort((k, S) => wt(k.name, S.name)).forEach((k) => h.set(k.tagId, 0));
  const w = Math.max(0, ...h.values()), $ = Math.max(
    t,
    240 + w * 296
  ), m = /* @__PURE__ */ new Map();
  e.nodes.forEach((k) => {
    m.has(k.segmentGroupKey) || m.set(k.segmentGroupKey, {
      key: k.segmentGroupKey,
      id: k.segmentGroupId,
      name: k.segmentGroupName,
      sortOrder: k.segmentGroupSortOrder,
      nodes: []
    }), m.get(k.segmentGroupKey).nodes.push(k);
  });
  const B = [...m.values()].sort((k, S) => k.sortOrder - S.sortOrder || wt(k.name, S.name));
  let W = 28;
  const F = [], G = B.map((k) => {
    const S = /* @__PURE__ */ new Map();
    k.nodes.forEach((z) => {
      const Y = h.get(z.tagId) || 0;
      S.has(Y) || S.set(Y, []), S.get(Y).push(z);
    });
    for (const z of S.values())
      z.sort((Y, H) => Y.segmentGroupTagSortOrder - H.segmentGroupTagSortOrder || wt(Y.name, H.name));
    const E = Math.max(1, ...[...S.values()].map((z) => z.length)), U = E * 58 + (E - 1) * 18, R = 70 + U, M = {
      ...k,
      x: 12,
      y: W,
      width: $ - 24,
      height: R
    };
    for (const [z, Y] of S.entries()) {
      const H = Y.length * 58 + Math.max(0, Y.length - 1) * 18, ae = (U - H) / 2;
      Y.forEach((de, ve) => F.push({
        ...de,
        rank: z,
        x: 28 + z * 296,
        y: W + 34 + 18 + ae + ve * 76,
        width: 184,
        height: 58
      }));
    }
    return W += R + 16, M;
  }), A = new Map(F.map((k) => [k.tagId, k])), I = e.connections.map((k) => {
    const S = A.get(k.sourceTagId), E = A.get(k.derivedTagId), U = S.x + S.width, R = S.y + S.height / 2, M = E.x, z = E.y + E.height / 2, Y = Math.max(48, (M - U) * 0.48);
    return {
      ...k,
      path: `M ${U} ${R} C ${U + Y} ${R}, ${M - Y} ${z}, ${M} ${z}`
    };
  });
  return {
    width: $,
    height: Math.max(r, W - 16 + 28),
    nodes: F,
    connections: I,
    groups: G
  };
}
function Wc(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, a = 0;
  const i = [], s = [], l = [];
  return e.forEach((d) => {
    const c = qc(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), u = 20, g = o, y = c.nodes.map((p) => ({
      ...p,
      x: p.x + u,
      y: p.y + g
    })), h = new Map(y.map((p) => [p.tagId, p]));
    i.push(...y), l.push(...c.groups.map((p) => ({
      ...p,
      componentId: d.id,
      x: p.x + u,
      y: p.y + g
    }))), s.push(...c.connections.map((p) => {
      const f = h.get(p.sourceTagId), w = h.get(p.derivedTagId), $ = f.x + f.width, m = f.y + f.height / 2, B = w.x, W = w.y + w.height / 2, F = Math.max(48, (B - $) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${$} ${m} C ${$ + F} ${m}, ${B - F} ${W}, ${B} ${W}`
      };
    })), a = Math.max(a, c.width), o += c.height + 32;
  }), {
    width: Math.max(720, a + 40),
    height: Math.max(420, o - 32 + 20),
    nodes: i,
    connections: s,
    groups: l
  };
}
function Ni(e, t = []) {
  if (!(e != null && e.sourceTagId) || !(e != null && e.derivedTagId)) return null;
  const r = Number(e.sourceTagId), o = Number(e.derivedTagId);
  if (r === o)
    return {
      code: "LINEAGE_CYCLE",
      message: "A tag cannot derive itself because that would create a cycle."
    };
  const a = t.filter((d) => d.id !== e.ruleId);
  if (a.some((d) => Number(d.sourceTagId) === r && Number(d.derivedTagId) === o))
    return {
      code: "LINEAGE_RULE_DUPLICATE",
      message: "A rule already maps this source tag to this derived tag."
    };
  const i = /* @__PURE__ */ new Map();
  a.forEach((d) => {
    const c = Number(d.sourceTagId);
    i.has(c) || i.set(c, /* @__PURE__ */ new Set()), i.get(c).add(Number(d.derivedTagId));
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
      for (const c of i.get(d) || []) s.push(c);
    }
  }
  return null;
}
function Vc(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function Jc(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: a, deleteRule: i, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: u, editorRef: g, emptyDraft: y, graph: h, layout: p, listSort: f, materializationOffer: w, materializeOutgoingRules: $, materializeRule: m, message: B, normalizedQuery: W, query: F, refreshConfiguredTag: G, revealEditor: A, rules: I, save: k, segmentGroupKey: S, selectedNode: E, selectedRule: U, selection: R, setConfiguringTag: M, setDraft: z, setListSort: Y, setMaterializationOffer: H, setQuery: ae, setSegmentGroupKey: de, setSelection: ve, setView: D, sortedVisibleRules: le, sourceSlots: se, sourceSlotsLoading: X, updateMapping: ye, updateTag: fe, view: Ce, visibleComponents: Pe, visibleRules: pe } = e;
  function Q(v) {
    const b = h.nodes.find((P) => P.tagId === Number(v.sourceTagId)), x = h.nodes.find((P) => P.tagId === Number(v.derivedTagId));
    return (b == null ? void 0 : b.segmentGroupKey) === (x == null ? void 0 : x.segmentGroupKey) ? b.segmentGroupKey : "cross-group";
  }
  function he() {
    return n("div", { key: "editor", ref: g, className: "space-y-4 p-4" }, [
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
          onClick: () => z(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      n("div", { key: "tags", className: "space-y-3" }, [
        n("div", { key: "source", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Source tag (specific)"),
            n(Wn, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (v, b) => fe("source", v, b == null ? void 0 : b.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !X && se.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (v) => M({
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
            n(Wn, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (v, b) => fe("derived", v, b == null ? void 0 : b.label),
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
              onClick: (v) => M({
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
            disabled: r || se.length === 0 || s.length === 0,
            onClick: () => z((v) => ({
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
          ...d.slotMappings.map((v, b) => n("div", { key: b, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: v.sourceSlotDefinitionId,
              disabled: r,
              onChange: (x) => ye(b, "sourceSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${b + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...se.map((x) => n("option", { key: x.id, value: x.id }, It(x)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: v.derivedSlotDefinitionId,
              disabled: r,
              onChange: (x) => ye(b, "derivedSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${b + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((x) => n("option", { key: x.id, value: x.id }, It(x)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => z((x) => ({
                ...x,
                slotMappings: x.slotMappings.filter((P, te) => te !== b)
              })),
              className: `${o} shrink-0 text-red-300`,
              "aria-label": `Remove performer slot mapping ${b + 1}`,
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
          onClick: k,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => z(null), className: o }, "Cancel")
      ])
    ]);
  }
  function T() {
    if (E) {
      const x = pe.filter((ne) => Number(ne.derivedTagId) === E.tagId), P = pe.filter((ne) => Number(ne.sourceTagId) === E.tagId), te = (ne, L, re) => n("div", {
        key: ne.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, L),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${ne.sourceTagName} → ${ne.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          re ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => m(ne),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => u(ne, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => i(ne),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, E.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, E.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${E.incomingRuleCount} incoming · ${E.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (ne) => M({
            tagId: E.tagId,
            tagName: E.name,
            trigger: ne.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        P.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => $(E, P),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${P.length})`) : null,
        P.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...P.map((ne) => te(ne, "Derives", !0))
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
            x.map((ne) => te(ne, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!U)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const v = h.nodes.find((x) => x.tagId === Number(U.sourceTagId)), b = h.nodes.find((x) => x.tagId === Number(U.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (v == null ? void 0 : v.segmentGroupName) || "Ungrouped"),
          (v == null ? void 0 : v.segmentGroupKey) !== (b == null ? void 0 : b.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(b == null ? void 0 : b.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${U.sourceTagName} → ${U.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${U.edgeCount} materialized lineage edge${U.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (w == null ? void 0 : w.ruleId) === U.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
        n(
          "p",
          { key: "summary", className: "text-sm font-medium text-foreground" },
          `${w.createCount + w.linkCount} pending derivation${w.createCount + w.linkCount === 1 ? "" : "s"}`
        ),
        n(
          "p",
          { key: "details", className: "text-xs text-secondary" },
          `${w.createCount} new segments · ${w.linkCount} existing segments to link`
        ),
        n("div", { key: "actions", className: "flex gap-2" }, [
          n("button", {
            key: "materialize",
            type: "button",
            disabled: r,
            onClick: () => m(U, w),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => H(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        U.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : U.slotMappings.map((x, P) => n("div", {
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
          U.createdAt ? new Date(U.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          U.updatedAt ? new Date(U.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => m(U),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => u(U),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => i(U),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function J() {
    if (Pe.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, W ? "No derivation relationships match your search." : "No derivation rules.");
    const v = E == null ? void 0 : E.tagId, b = /* @__PURE__ */ new Set();
    return E && (b.add(E.tagId), p.connections.forEach((x) => {
      (x.sourceTagId === E.tagId || x.derivedTagId === E.tagId) && (b.add(x.sourceTagId), b.add(x.derivedTagId));
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
          className: `absolute rounded-xl border ${S === x.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
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
            const P = v === x.sourceTagId || v === x.derivedTagId, te = E != null, ne = P ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${x.id}:visible`,
              d: x.path,
              fill: "none",
              stroke: ne,
              strokeWidth: P ? 2.5 : 1.5,
              opacity: te && !P ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((x) => {
          const P = !W || x.name.toLocaleLowerCase().includes(W), te = E != null, ne = b.has(x.tagId), L = (E == null ? void 0 : E.tagId) === x.tagId;
          return n("button", {
            key: `node:${x.tagId}`,
            type: "button",
            onClick: () => ve({ type: "node", id: x.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${L ? "border-accent bg-accent/15 ring-2 ring-accent/25" : ne ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${x.x}px`,
              top: `${x.y}px`,
              width: `${x.width}px`,
              height: `${x.height}px`,
              opacity: !P || te && !ne ? 0.62 : 1
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
          const P = p.nodes.find((ne) => ne.tagId === x.sourceTagId), te = p.nodes.find((ne) => ne.tagId === x.derivedTagId);
          return n("div", {
            key: `bundle:${x.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(P.x + P.width + te.x) / 2 - 24}px`,
              top: `${(P.y + P.height / 2 + te.y + te.height / 2) / 2 - 10}px`
            },
            "aria-label": `${x.rules.length} rules connect ${x.rules[0].sourceTagName} to ${x.rules[0].derivedTagName}`
          }, `${x.rules.length} rules`);
        })
      ])
    ]);
  }
  function C() {
    if (Pe.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        W ? "No derivation relationships match your search." : "No derivation rules."
      );
    const v = /* @__PURE__ */ new Map();
    le.forEach((x) => {
      const P = Q(x);
      v.has(P) || v.set(P, []), v.get(P).push(x);
    });
    const b = [
      ...h.segmentGroups.map((x) => x.key),
      "cross-group"
    ].filter((x) => v.has(x));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, b.map((x) => {
      const P = h.segmentGroups.find((L) => L.key === x), te = x === "cross-group" ? "Cross-group relationships" : (P == null ? void 0 : P.name) || "Ungrouped", ne = v.get(x);
      return n("section", { key: x, "aria-label": te }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, te),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${ne.length} rule${ne.length === 1 ? "" : "s"}`
          )
        ]),
        n("div", { key: "table", role: "table", "aria-label": `${te} derivation rules` }, [
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
          ...ne.map((L) => n("button", {
            key: L.id,
            type: "button",
            role: "row",
            onClick: () => ve({ type: "rule", id: L.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(U == null ? void 0 : U.id) === L.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${L.sourceTagName} → ${L.derivedTagName}` },
              `${L.sourceTagName} → ${L.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(L.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(L.edgeCount))
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
          `${I.length} rules · ${h.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          z(y()), ve(null), A();
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
          value: F,
          onChange: (v) => {
            ae(v.target.value), ve(null);
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
          value: S,
          disabled: d != null,
          onChange: (v) => {
            de(v.target.value), ve(null), z(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...h.segmentGroups.map((v) => n("option", { key: v.key, value: v.key }, v.name))
        ])
      ]),
      Ce === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: f,
          onChange: (v) => Y(v.target.value),
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
        ].map(([v, b]) => n("button", {
          key: v,
          type: "button",
          onClick: () => {
            D(v), v === "graph" && (R == null ? void 0 : R.type) === "rule" && ve(null);
          },
          "aria-pressed": Ce === v,
          className: `rounded px-3 py-1.5 text-sm font-medium ${Ce === v ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
        }, b))
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
        Ce === "graph" ? J() : C()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? he() : T()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      B ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, B) : null
    ]),
    a ? n(vo, {
      key: `derivation-configure-tag:${a.tagId}`,
      tagId: a.tagId,
      tagName: a.tagName,
      onSaved: () => G(a),
      onClose: () => {
        const v = a.trigger;
        M(null), requestAnimationFrame(() => {
          v != null && v.isConnected && v.focus();
        });
      }
    }) : null
  ]);
}
function Yc({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, a] = K([]), [i, s] = K(null), [l, d] = K([]), [c, u] = K([]), [g, y] = K(!1), [h, p] = K(!1), [f, w] = K(!1), [$, m] = K(""), [B, W] = K(""), [F, G] = K("graph"), [A, I] = K("all"), [k, S] = K(null), [E, U] = K("relationship"), [R, M] = K(null), [z, Y] = K(null), H = me(null), ae = me(null), de = ia().replace(/:/g, "");
  function ve() {
    requestAnimationFrame(() => {
      var N;
      return (N = H.current) == null ? void 0 : N.scrollIntoView({ block: "nearest" });
    });
  }
  async function D(N) {
    const q = await ee("/derivation-rules", N ? { signal: N } : void 0);
    a(q || []);
  }
  ge(() => {
    const N = new AbortController();
    return D(N.signal).catch((q) => {
      q.name !== "AbortError" && m(q.message || "Unable to load derived segment rules.");
    }), () => N.abort();
  }, []), ge(() => {
    const N = new AbortController();
    return i != null && i.sourceTagId ? (y(!0), ee(`/slot-definitions/${i.sourceTagId}`, { signal: N.signal }).then((q) => d(q.definitions || [])).catch((q) => {
      q.name !== "AbortError" && d([]);
    }).finally(() => {
      N.signal.aborted || y(!1);
    })) : (d([]), y(!1)), i != null && i.derivedTagId ? (p(!0), ee(`/slot-definitions/${i.derivedTagId}`, { signal: N.signal }).then((q) => u(q.definitions || [])).catch((q) => {
      q.name !== "AbortError" && u([]);
    }).finally(() => {
      N.signal.aborted || p(!1);
    })) : (u([]), p(!1)), () => N.abort();
  }, [i == null ? void 0 : i.sourceTagId, i == null ? void 0 : i.derivedTagId]), ge(() => {
    if (!(i != null && i.sourceTagId) || !(i != null && i.derivedTagId) || i.ruleId != null || g || h)
      return;
    const N = `${i.sourceTagId}:${i.derivedTagId}`;
    ae.current !== N && (ae.current = N, s((q) => !q || Number(q.sourceTagId) !== Number(i.sourceTagId) || Number(q.derivedTagId) !== Number(i.derivedTagId) ? q : gd(q, l, c)));
  }, [
    i == null ? void 0 : i.ruleId,
    i == null ? void 0 : i.sourceTagId,
    i == null ? void 0 : i.derivedTagId,
    l,
    c,
    g,
    h
  ]);
  function le(N, q = !1) {
    q || S({ type: "rule", id: N.id }), ae.current = null, s({
      ruleId: N.id,
      sourceTagId: N.sourceTagId,
      sourceTagName: N.sourceTagName,
      derivedTagId: N.derivedTagId,
      derivedTagName: N.derivedTagName,
      slotMappings: N.slotMappings.map((j) => ({
        sourceSlotDefinitionId: j.sourceSlotDefinitionId,
        derivedSlotDefinitionId: j.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), m(""), ve();
  }
  function se(N, q, j = "") {
    ae.current = null, N === "source" ? (d([]), y(q != null)) : (u([]), p(q != null)), s((Z) => ({
      ...Z,
      [`${N}TagId`]: q == null ? null : Number(q),
      [`${N}TagName`]: j || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function X(N) {
    (i == null ? void 0 : i.ruleId) == null && (ae.current = null);
    const q = [D(), t == null ? void 0 : t()];
    return N.draftKind === "source" ? (y(!0), q.push(ee(`/slot-definitions/${N.tagId}`).then((j) => d(j.definitions || [])).finally(() => y(!1)))) : N.draftKind === "derived" && (p(!0), q.push(ee(`/slot-definitions/${N.tagId}`).then((j) => u(j.definitions || [])).finally(() => p(!1)))), Promise.all(q);
  }
  function ye(N, q, j) {
    s((Z) => ({
      ...Z,
      slotMappings: Z.slotMappings.map((be, ue) => ue === N ? { ...be, [q]: j } : be)
    }));
  }
  async function fe() {
    if (!(i != null && i.sourceTagId) || !(i != null && i.derivedTagId)) return;
    const N = Ni(i, o);
    if (N) {
      m(N.message);
      return;
    }
    if (i.slotMappings.some((q) => !q.sourceSlotDefinitionId || !q.derivedSlotDefinitionId)) {
      m("Complete or remove every performer slot mapping before saving.");
      return;
    }
    w(!0), m(i.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let q = null;
      if (i.ruleId != null) {
        const Z = await ee(
          `/derivation-rules/${i.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${Z.deletedSegmentCount}
Removed lineage edges: ${Z.removedEdgeCount}
Shared derived segments retained: ${Z.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        q = Z.fingerprint;
      }
      m("Saving derived segment rule…");
      const j = await ee("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: i.ruleId,
          sourceTagId: i.sourceTagId,
          derivedTagId: i.derivedTagId,
          slotMappings: i.slotMappings,
          cleanupFingerprint: q
        })
      });
      if (await D(), S(F === "graph" ? { type: "node", id: Number(j.sourceTagId) } : { type: "rule", id: j.id }), s(null), i.ruleId == null)
        try {
          const Z = await ee(
            `/derivation-rules/${j.id}/materialization/preview`,
            { method: "POST" }
          );
          M(
            Z.createCount + Z.linkCount > 0 ? Z : null
          ), m(Z.createCount + Z.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          M(null), m("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        M(null), m("Derived segment rule saved. Previous materializations were removed.");
    } catch (q) {
      m(q.message || "Unable to save derived segment rule.");
    } finally {
      w(!1);
    }
  }
  async function Ce(N) {
    w(!0), m("Previewing rule deletion…");
    try {
      const q = await ee(
        `/derivation-rules/${N.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${N.sourceTagName} → ${N.derivedTagName}?

Deleted segments: ${q.deletedSegmentCount}
Removed lineage edges: ${q.removedEdgeCount}
Shared derived segments retained: ${q.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const j = `derivation-rule-delete:${N.id}:${q.fingerprint}`;
      await ee(`/derivation-rules/${N.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ue(j),
          fingerprint: q.fingerprint
        })
      }), He(j), await D(), (i == null ? void 0 : i.ruleId) === N.id && s(null), (k == null ? void 0 : k.type) === "rule" && k.id === N.id && S(null), (R == null ? void 0 : R.ruleId) === N.id && M(null), m(`Rule deleted with ${q.deletedSegmentCount} exclusively derived segment${q.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (q) {
      m(q.message || "Unable to delete derived segment rule.");
    } finally {
      w(!1);
    }
  }
  async function Pe(N, q = null) {
    const j = q || await ee(
      `/derivation-rules/${N.id}/materialization/preview`,
      { method: "POST" }
    );
    if (j.createCount + j.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const Z = `derivation-rule-materialize:${N.id}:${j.fingerprint}`, be = await ee(`/derivation-rules/${N.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Ue(Z),
        fingerprint: j.fingerprint
      })
    });
    return He(Z), be;
  }
  async function pe(N, q = null) {
    w(!0), m("Finding pending derivations…");
    try {
      const j = await Pe(N, q);
      if (M(null), await D(), j.createdCount + j.linkedCount === 0) {
        m("Every applicable derivation is already materialized.");
        return;
      }
      m(
        `${j.createdCount} derived segment${j.createdCount === 1 ? "" : "s"} created and ${j.linkedCount} existing segment${j.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (j) {
      m(j.message || "Unable to materialize pending derivations.");
    } finally {
      w(!1);
    }
  }
  async function Q(N, q) {
    if (q.length === 0) return;
    w(!0), m(`Finding pending derivations from ${N.name}…`);
    let j = 0, Z = 0;
    try {
      for (const be of q) {
        const ue = await Pe(be);
        j += ue.createdCount, Z += ue.linkedCount;
      }
      M(null), await D(), m(j + Z === 0 ? `Every outgoing derivation from ${N.name} is already materialized.` : `${j} derived segment${j === 1 ? "" : "s"} created and ${Z} existing segment${Z === 1 ? "" : "s"} linked from ${N.name}.`);
    } catch (be) {
      await D().catch(() => {
      }), m(be.message || `Unable to materialize derivations from ${N.name}.`);
    } finally {
      w(!1);
    }
  }
  const he = Ni(i, o), T = We(
    () => _c(o, e),
    [o, e]
  ), J = B.trim().toLocaleLowerCase(), v = T.components.filter((N) => A === "all" || N.segmentGroupKeys.includes(A)).filter((N) => !J || N.nodes.some((q) => q.name.toLocaleLowerCase().includes(J))), b = v.flatMap((N) => N.rules), x = new Set(
    v.flatMap((N) => N.nodes.map((q) => q.tagId))
  ), P = We(
    () => Wc(v),
    [v]
  ), te = F === "list" ? Vc(
    k,
    b,
    J.length > 0
  ) : null, ne = (k == null ? void 0 : k.type) === "node" && T.nodes.find((N) => N.tagId === k.id && x.has(N.tagId)) || null, L = [...b].sort((N, q) => E === "source" ? wt(N.sourceTagName, q.sourceTagName) || wt(N.derivedTagName, q.derivedTagName) : E === "target" ? wt(N.derivedTagName, q.derivedTagName) || wt(N.sourceTagName, q.sourceTagName) : E === "materialized" ? (Number(q.edgeCount) || 0) - (Number(N.edgeCount) || 0) || wt(N.sourceTagName, q.sourceTagName) : wt(
    `${N.sourceTagName} ${N.derivedTagName}`,
    `${q.sourceTagName} ${q.derivedTagName}`
  ));
  return n(Jc, {
    arrowMarkerId: de,
    busy: f,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: z,
    deleteRule: Ce,
    derivedSlots: c,
    derivedSlotsLoading: h,
    draft: i,
    draftIssue: he,
    editRule: le,
    editorRef: H,
    emptyDraft: r,
    graph: T,
    layout: P,
    listSort: E,
    materializationOffer: R,
    materializeOutgoingRules: Q,
    materializeRule: pe,
    message: $,
    normalizedQuery: J,
    query: B,
    refreshConfiguredTag: X,
    revealEditor: ve,
    rules: o,
    save: fe,
    segmentGroupKey: A,
    selectedNode: ne,
    selectedRule: te,
    selection: k,
    setConfiguringTag: Y,
    setDraft: s,
    setListSort: U,
    setMaterializationOffer: M,
    setQuery: W,
    setSegmentGroupKey: I,
    setSelection: S,
    setView: G,
    sortedVisibleRules: L,
    sourceSlots: l,
    sourceSlotsLoading: g,
    updateMapping: ye,
    updateTag: se,
    view: F,
    visibleComponents: v,
    visibleRules: b
  });
}
function Qc() {
  const [e, t] = K(Zi), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(i, s) {
    t((l) => ni({ ...l, [i]: s }));
  }
  function a() {
    t(ni(ao));
  }
  return n("section", { className: "space-y-3 rounded-lg border border-border bg-surface p-4", "aria-labelledby": "segment-studio-playback-shortcuts-title" }, [
    n("div", { key: "heading", className: "flex flex-wrap items-start justify-between gap-3" }, [
      n("div", { key: "copy" }, [
        n("h2", { key: "title", id: "segment-studio-playback-shortcuts-title", className: "font-semibold text-foreground" }, "Playback shortcuts"),
        n("p", { key: "description", className: "mt-1 text-xs text-secondary" }, "Configure seek intervals and frame-step sizes used by the keyboard-first editor. These settings are stored in this browser.")
      ]),
      n("button", { key: "reset", type: "button", onClick: a, className: "rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted/40" }, "Reset defaults")
    ]),
    n("div", { key: "fields", className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, r.map(([i, s, l, d, c]) => n("label", { key: i, className: "space-y-1 text-xs text-secondary" }, [
      n("span", { key: "label" }, s),
      n("input", {
        key: "input",
        type: "number",
        min: l,
        max: d,
        step: c,
        value: e[i],
        onChange: (u) => o(i, u.target.value),
        className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
      })
    ])))
  ]);
}
function Zc({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, a] = K([]), [i, s] = K(!1), [l, d] = K(!1), [c, u] = K(""), [g, y] = K(""), [h, p] = K("all"), [f, w] = K(() => /* @__PURE__ */ new Set()), [$, m] = K(null);
  ge(() => {
    if (!e || i) return;
    const M = new AbortController();
    return d(!0), u(""), ee("/slot-definitions", { signal: M.signal }).then((z) => {
      a(z || []), s(!0);
    }).catch((z) => {
      z.name !== "AbortError" && u(z.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      M.signal.aborted || d(!1);
    }), () => M.abort();
  }, [e, i]);
  async function B() {
    d(!0), u("");
    try {
      const M = await ee("/slot-definitions");
      a(M || []), s(!0);
    } catch (M) {
      u(M.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function W() {
    const [M] = await Promise.all([
      ee("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    a(M || []), s(!0), u("");
  }
  function F() {
    const M = $ == null ? void 0 : $.trigger;
    m(null), requestAnimationFrame(() => {
      M != null && M.isConnected && M.focus({ preventScroll: !0 });
    });
  }
  function G(M) {
    w((z) => {
      const Y = new Set(z);
      return Y.has(M) ? Y.delete(M) : Y.add(M), Y;
    });
  }
  const A = We(
    () => Uc(t, o),
    [t, o]
  ), I = We(
    () => Hc(A, g, h),
    [A, g, h]
  ), k = A.flatMap((M) => M.tags), S = k.filter((M) => M.definitions.length > 0).length, E = k.length - S, U = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], R = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
      i ? n(
        "p",
        { key: "summary", className: "mt-2 text-xs text-secondary" },
        `${k.length} tags · ${S} with slots · ${E} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: g,
          onChange: (M) => y(M.target.value),
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
          U.map(([M, z]) => n("button", {
            key: M,
            type: "button",
            onClick: () => p(M),
            "aria-pressed": h === M,
            className: `rounded px-3 py-1.5 text-xs font-medium ${h === M ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, z))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => w(/* @__PURE__ */ new Set()),
          className: R
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => w(new Set(A.map((M) => M.overviewKey))),
          className: R
        }, "Collapse all")
      ])
    ]),
    l && !i ? n(
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
        onClick: B,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    i && I.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    i ? n("div", { key: "groups", className: "space-y-3" }, I.map((M) => {
      const z = f.has(M.overviewKey), Y = M.tags.filter((H) => H.definitions.length > 0).length;
      return n("article", {
        key: M.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => G(M.overviewKey),
          "aria-expanded": !z,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, z ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, M.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${M.tags.length} tag${M.tags.length === 1 ? "" : "s"} · ${Y} with slots`
          )
        ]),
        z ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          M.tags.map((H) => n("li", {
            key: H.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: H.tagName }, H.tagName),
              H.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            H.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${H.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, H.definitions.map((ae) => n("li", {
              key: ae.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, It(ae)),
              ...(ae.genderHints || []).map((de) => n("span", {
                key: de,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, $r(de)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (ae) => m({
                tagId: H.tagId,
                tagName: H.tagName,
                trigger: ae.currentTarget
              }),
              "aria-label": `Edit performer slots for ${H.tagName}`,
              className: `${R} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    $ ? n(vo, {
      key: `performer-slots-configure:${$.tagId}`,
      tagId: $.tagId,
      tagName: $.tagName,
      onSaved: W,
      onClose: F
    }) : null
  ]);
}
function Xc({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, a] = K("general"), [i, s] = K([]), [l, d] = K(!1), [c, u] = K(""), [g, y] = K(_i), h = Cl(t), p = h.map(([m]) => m);
  ge(() => {
    p.includes(o) || a(p[0] || "general");
  }, [t.effectiveMode]);
  async function f(m) {
    const B = await ee("/segment-groups", m ? { signal: m } : void 0);
    s(B || []);
  }
  ge(() => {
    const m = new AbortController();
    return f(m.signal).catch((B) => {
      B.name !== "AbortError" && u(B.message || "Unable to load tag groups.");
    }), () => m.abort();
  }, []);
  async function w(m) {
    if (m !== t.requestedMode) {
      d(!0), u("");
      try {
        const B = await ee(
          `/preferences/transition?mode=${encodeURIComponent(m)}`
        );
        let W = !1, F = null, G = null, A = null, I = !1;
        if (t.requestedMode === "basic" && m === "full") {
          if (!window.confirm(Rl(
            B.recyclingBinCount,
            B.protectedRecyclingBinCount
          )))
            return;
          I = !0, B.recyclingBinCount > 0 && (W = !0, A = B.recyclingBinFingerprint, F = `mode-switch-empty-bin:${A}`, G = Ue(F));
        }
        let k = !1;
        if (t.requestedMode === "full" && m === "basic") {
          if (!window.confirm(Tl(
            B.extensionOwnedSegmentCount
          )))
            return;
          k = !0;
        }
        const S = await ee("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: m,
            confirmHiddenExtensionOwnedSegments: k,
            confirmBasicHistoryCleanup: I,
            emptyRecyclingBin: W,
            operationId: G,
            expectedRecyclingBinFingerprint: A
          })
        });
        F && He(F), r == null || r(Xi(S)), u("Workflow mode saved.");
      } catch (B) {
        u(B.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  const $ = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (m) => $a(m, e, $), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      h.map(([m, B]) => n("button", {
        key: m,
        type: "button",
        onClick: () => a(m),
        "aria-current": o === m ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === m ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, B))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(Qc)
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
      n(mc, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: w,
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
          checked: g,
          onChange: (m) => {
            const B = m.target.checked;
            qi(B), y(B);
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
    p.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(Yc, {
        segmentGroups: i,
        onSegmentGroupsChanged: () => f()
      })
    ) : null,
    p.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(Zc, {
        active: o === "performer-slots",
        segmentGroups: i,
        onSegmentGroupsChanged: () => f()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function Ii({ facets: e, values: t, disabled: r, onChange: o }) {
  var a;
  return r ? n(
    "p",
    { className: "rounded-md border border-dashed border-border p-3 text-xs text-secondary" },
    "Performer slot filters are unavailable for your current access. Browse and playback remain available."
  ) : (a = e == null ? void 0 : e.slots) != null && a.length ? n("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, e.slots.map((i) => n("label", { key: i.id, className: "space-y-1 text-xs text-secondary" }, [
    n("span", { key: "label" }, It(i)),
    n("select", {
      key: "select",
      value: t[i.id] || "",
      onChange: (s) => o(i.id, s.target.value),
      className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
    }, [
      n("option", { key: "all", value: "" }, "Any assigned performer"),
      ...(i.performers || []).map((s) => n("option", { key: s.id, value: s.id }, `${s.name} (${s.assignmentCount})`))
    ])
  ]))) : null;
}
function eu({ item: e, selected: t, busy: r, onSelect: o, onRestore: a, onPurge: i }) {
  var u, g;
  const s = [...e.slots || []].sort((y, h) => y.sortOrder - h.sortOrder || String(y.slotDefinitionId).localeCompare(String(h.slotDefinitionId))), l = [...new Map(s.map((y) => [
    y.performerId,
    { id: y.performerId, name: y.performerName }
  ])).values()], d = s.map((y) => ({
    slotDefinitionId: y.slotDefinitionId,
    label: It(y),
    performer: { id: y.performerId, name: y.performerName }
  })), c = ta(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: ua(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((u = e.activity) == null ? void 0 : u.name) || "segment"}, ${e.reviewState}, ${De(e.startSec)} to ${e.endSec == null ? "end of video" : De(e.endSec)}` }, [
      n("div", { key: "image", className: "relative aspect-video bg-black" }, [
        n("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        n("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${De(e.startSec)} → end` : `${De(e.startSec)} – ${De(e.endSec)}`)
      ]),
      n("div", { key: "body", className: "flex flex-col gap-1.5 p-2.5" }, [
        n("div", { key: "segment", className: "flex min-w-0 items-center gap-1.5" }, [
          n(ln, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((g = e.activity) == null ? void 0 : g.name) || "Tag segment"),
          l.length ? n(Tr, {
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
        n("button", { key: "restore", type: "button", disabled: r, onClick: () => a(e), className: "text-xs font-semibold text-accent hover:underline disabled:opacity-50" }, "Restore"),
        n("button", { key: "purge", type: "button", disabled: r, onClick: () => i(e), className: "text-xs font-semibold text-red-400 hover:underline disabled:opacity-50" }, "Delete permanently")
      ] : n("a", {
        href: c,
        className: "text-xs font-semibold text-accent hover:underline"
      }, "Edit segment")
    )
  ]);
}
function tu({ item: e, index: t, count: r, onPrevious: o, onNext: a, onClose: i, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(Ai, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: El(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: a, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: i, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: ta(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Ci({ onNavigate: e, profile: t }) {
  const r = We(() => {
    const D = Di("ext:com.midnightrider.segment-studio:segments");
    return D ? {
      ..._r,
      defaultFilter: { ..._r.defaultFilter, ...D.findFilter || {} },
      defaultObjectFilter: D.objectFilter || {}
    } : _r;
  }, []), { filter: o, objectFilter: a, setFilter: i, setObjectFilter: s } = Oi(r), [l, d] = K(null), [c, u] = K({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [g, y] = K(null), [h, p] = K(null), [f, w] = K(0), [$, m] = K(""), [B, W] = K(!0), [F, G] = K(""), A = me(0), I = oi(o, a), k = I.activityTagId, S = wn(a.slots), E = We(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (D) => Object.keys(wn(D)).length > 0,
    sanitize: (D) => qr(k, wn(D)),
    summarize: (D) => `${Object.keys(wn(D)).length} assigned`,
    renderEditor: (D, le) => k ? n(Ii, {
      facets: l,
      values: wn(D),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (se, X) => {
        const ye = { ...wn(D) };
        X ? ye[se] = Number(X) : delete ye[se], le(qr(k, ye));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [k, l, c.performerSlotsAvailable]), U = JSON.stringify(I);
  ge(() => {
    if (d(null), !k) return;
    const D = new AbortController();
    return ee(`/browse/activities/${k}/facets`, { signal: D.signal }).then(d).catch((le) => {
      le.status === 403 ? d({ slots: [], restricted: !0 }) : le.name !== "AbortError" && G(le.message);
    }), () => D.abort();
  }, [k]), ge(() => {
    const D = ++A.current, le = new AbortController();
    return W(!0), G(""), ee("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(I), signal: le.signal }).then((se) => {
      D === A.current && u({ ...se, totalCount: se.totalCount ?? se.total ?? 0 });
    }).catch((se) => {
      if (!(D !== A.current || se.name === "AbortError")) {
        if (se.status === 400 && se.message.includes("unrestricted performer read access")) {
          u((X) => ({ ...X, performerSlotsAvailable: !1 })), s({ ...a, performerId: void 0, performersCriterion: void 0, slots: void 0 }), G("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        G(se.message);
      }
    }).finally(() => {
      D === A.current && W(!1);
    }), () => {
      A.current++, le.abort();
    };
  }, [U, f]);
  const R = c.items.findIndex((D) => D.key === g), M = c.items[R] || null;
  function z(D) {
    s(D), i({ ...o, page: 1 });
  }
  function Y(D) {
    const le = oi(o, D), se = D.slots && le.activityTagId != null && le.slotAssignments.length > 0 ? D.slots : void 0;
    z({ ...D, slots: se });
  }
  function H(D, le) {
    const se = { ...S };
    le ? se[D] = Number(le) : delete se[D], z({ ...a, slots: qr(k, se) });
  }
  function ae() {
    const D = document.querySelector(`[data-segment-key="${g}"]`);
    y(null), requestAnimationFrame(() => D == null ? void 0 : D.focus());
  }
  async function de(D) {
    var X;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(D.key), m("");
    const le = `browse-restore:${D.itemId}:${D.revision}`, se = Ue(le);
    try {
      const ye = (fe = !1) => ee(`/bin/${D.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: se,
          expectedRevision: D.revision,
          discardMissingImage: fe
        })
      });
      try {
        await ye(uo(le));
      } catch (fe) {
        if (((X = fe.payload) == null ? void 0 : X.code) !== "missing-image" || !window.confirm(`${fe.message}

Continue and discard the missing image reference?`))
          throw fe;
        mo(le), await ye(!0);
      }
      He(le), g === D.key && y(null), m("Segment restored to Cove."), w((fe) => fe + 1);
    } catch (ye) {
      m(ye.message || "Unable to restore the segment."), ye.status === 409 && w((fe) => fe + 1);
    } finally {
      p(null);
    }
  }
  async function ve(D) {
    p(D.key), m("");
    try {
      const le = await ee(`/items/${D.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: D.revision })
      });
      if (!sa(le, m) || !Yl(le))
        return;
      const se = `browse-dependency-delete:${D.itemId}:${le.fingerprint}`;
      await ee(`/items/${D.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ue(se),
          fingerprint: le.fingerprint
        })
      }), He(se), g === D.key && y(null), m(`${le.deletedSegmentCount} segment${le.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), w((X) => X + 1);
    } catch (le) {
      m(le.message || "Unable to permanently delete the segment."), le.status === 409 && w((se) => se + 1);
    } finally {
      p(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(ho, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(Pi, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: i,
      totalCount: c.totalCount,
      isLoading: B,
      error: F ? new Error(F) : null,
      onRetry: () => w((D) => D + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? ri.filter((D) => D.id !== "performers") : ri,
      objectFilter: a,
      onObjectFilterChange: Y,
      customFilterSections: E,
      searchPlaceholder: "Search segments..."
    }, [
      k ? n(Ii, { key: "slots", facets: l, values: S, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: H }) : null,
      n(tu, { key: "player", item: M, index: R, count: c.items.length, onPrevious: () => {
        var D;
        return y((D = c.items[R - 1]) == null ? void 0 : D.key);
      }, onNext: () => {
        var D;
        return y((D = c.items[R + 1]) == null ? void 0 : D.key);
      }, onClose: ae, onNavigate: e }),
      $ ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, $) : null,
      !B && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      B ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((D) => n(eu, {
        key: D.key,
        item: D,
        selected: D.key === g,
        busy: h === D.key,
        onSelect: () => y(D.key),
        onRestore: de,
        onPurge: ve
      })))
    ])
  ]);
}
function nu({ onNavigate: e, profile: t }) {
  const [r, o] = K([]), [a, i] = K(""), [s, l] = K(0), [d, c] = K(!0), [u, g] = K(null), [y, h] = K(""), p = me(null);
  async function f(m) {
    const B = await ee("/bin", m ? { signal: m } : void 0);
    return o(B.items || []), i(B.fingerprint || ""), l(Number(B.totalCount) || 0), B;
  }
  ge(() => {
    const m = new AbortController();
    return c(!0), f(m.signal).catch((B) => {
      B.name !== "AbortError" && h(B.message);
    }).finally(() => {
      m.signal.aborted || c(!1);
    }), () => m.abort();
  }, []), Ei(io, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var m;
      return (m = p.current) == null ? void 0 : m.call(p);
    }
  }]);
  async function w(m) {
    var F;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    g(m.itemId), h("");
    const B = `restore:${m.itemId}:${m.revision}`, W = Ue(B);
    try {
      const G = (A = !1) => ee(`/bin/${m.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: W, expectedRevision: m.revision, discardMissingImage: A })
      });
      try {
        await G(uo(B));
      } catch (A) {
        if (((F = A.payload) == null ? void 0 : F.code) !== "missing-image" || !window.confirm(`${A.message}

Continue and discard the missing image reference?`)) throw A;
        mo(B), await G(!0);
      }
      He(B), await f(), qn(), h("Segment restored with a new native ID.");
    } catch (G) {
      h(G.message || "Unable to restore the segment."), G.status === 409 && await f();
    } finally {
      g(null);
    }
  }
  async function $() {
    if (u == null)
      try {
        const m = await da({
          items: r,
          fingerprint: a,
          totalCount: s
        }, () => {
          g(-1), h("");
        });
        if (m.status !== "emptied") return;
        await f(), qn(), h(`${m.segmentCount} segment${m.segmentCount === 1 ? "" : "s"} from ${m.sceneCount} scene${m.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (m) {
        h(m.message || "Unable to empty the recycling bin."), m.status === 409 && await f();
      } finally {
        g(null);
      }
  }
  return p.current = $, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    n(ho, {
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
        disabled: d || u != null || s === 0,
        onClick: $,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, u === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    y ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, y) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((m) => n("article", { key: m.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${m.tagName || "Tag segment"} · ${m.videoTitle || `Video ${m.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, m.endSec == null ? De(m.startSec) : `${De(m.startSec)} – ${De(m.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${m.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${m.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: u != null, onClick: () => w(m), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const $i = "ext:com.midnightrider.segment-studio:videos";
function Vr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const a = We(() => {
    var de;
    const H = Di($i), ae = (de = H == null ? void 0 : H.uiOptions) == null ? void 0 : de.displayMode;
    return H ? {
      ...Un,
      defaultFilter: { ...Un.defaultFilter, ...H.findFilter || {} },
      defaultObjectFilter: H.objectFilter || {},
      defaultDisplayMode: Un.allowedDisplayModes.includes(ae) ? ae : Un.defaultDisplayMode
    } : Un;
  }, []), { filter: i, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: u } = Oi(a), [g, y] = K({ items: [], totalCount: 0 }), [h, p] = K(!0), [f, w] = K(""), [$, m] = K(0), [B, W] = K(/* @__PURE__ */ new Set()), F = me(0), G = me(null), A = JSON.stringify(i), I = JSON.stringify(s), k = t || r === "review";
  ge(() => {
    G.current = null, W(/* @__PURE__ */ new Set());
  }, [A, I]), ge(() => {
    const H = ++F.current, ae = new AbortController();
    return p(!0), w(""), ee(`/videos?${sc(i, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: ae.signal }).then((de) => {
      H === F.current && y(de);
    }).catch((de) => {
      H === F.current && de.name !== "AbortError" && w(de.message || "Unable to discover videos.");
    }).finally(() => {
      H === F.current && p(!1);
    }), () => {
      F.current++, ae.abort();
    };
  }, [A, I, t, r, $]);
  function S(H) {
    d({ ...H, page: H.page || 1 });
  }
  function E(H) {
    c(H), d({ ...i, page: 1 });
  }
  function U(H, ae = !1) {
    W((de) => lc(
      de,
      g.items.map((ve) => ve.videoId),
      H,
      G.current,
      ae
    )), G.current = H;
  }
  function R() {
    G.current = null, W(new Set(g.items.map((H) => H.videoId)));
  }
  function M() {
    G.current = null, W(/* @__PURE__ */ new Set());
  }
  function z() {
    G.current = null, W((H) => new Set(g.items.map((ae) => ae.videoId).filter((ae) => !H.has(ae))));
  }
  const Y = t || r === "review" ? Si : Si.filter((H) => !["reviewState", "shotBoundaries"].includes(H.id));
  return n("div", { className: "w-full space-y-5" }, [
    n(ho, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(Pi, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: $i,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: i,
      onFilterChange: S,
      totalCount: g.totalCount,
      isLoading: h,
      error: f ? new Error(f) : null,
      onRetry: () => m((H) => H + 1),
      sortOptions: t || r === "review" ? [...xi, { value: "unreviewed_count", label: "Unreviewed count" }] : xi,
      displayMode: l,
      onDisplayModeChange: u,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: Y,
      objectFilter: s,
      onObjectFilterChange: E,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: k ? B : void 0,
      onSelectAll: k ? R : void 0,
      onSelectNone: k ? M : void 0,
      onInvertSelection: k ? z : void 0,
      // The host renders whatever extensions contribute for a video selection, so
      // Run AI here is the same action, and the same dialog, as the native videos
      // page. Only the contributed actions are rendered: Segment Studio's own
      // ownership and lineage rules govern deletion, so the native bulk mutations
      // that would bypass them stay out of this bar.
      selectionActions: k && B.size > 0 ? n(Ul, { entityType: "video", selectedIds: B }) : null
    }, [
      !h && g.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !h && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, g.items.map((H) => n(dc, { key: H.videoId, item: H, onNavigate: e, showReviewStates: k, selected: B.has(H.videoId), selectionActive: B.size > 0, onSelect: k ? U : null }))) : null,
      !h && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, g.items.map((H) => n(cc, { key: H.videoId, item: H, onNavigate: e, showReviewStates: k, selected: B.has(H.videoId), selectionActive: B.size > 0, onSelect: k ? U : null }))) : null
    ])
  ]);
}
function Ti({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [a, i] = K(null), [s, l] = K(!0), [d, c] = K(""), u = me(0), g = me(0), y = me(e), h = Wd();
  y.current = e;
  const [p] = K(() => Hs({
    beginRequest: () => ({ requestId: ++g.current, videoId: y.current }),
    fetchDetail: (F) => ee(f(F.videoId)),
    isCurrent: (F) => mr(F.requestId, g.current, F.videoId, y.current),
    isSameVideo: (F) => F.videoId === y.current
  })), f = (F) => `/videos/${F}/editor`;
  async function w(F, G, A) {
    const I = await ee(f(G), A ? { signal: A.signal } : void 0);
    return mr(F, A ? u.current : g.current, G, y.current) ? (i(I), !0) : !1;
  }
  ge(() => {
    const F = ++u.current, G = e, A = new AbortController();
    return i(null), l(!0), c(""), w(F, G, A).catch((I) => {
      mr(F, u.current, G, y.current) && I.name !== "AbortError" && c(I.message || "Unable to load the editor.");
    }).finally(() => {
      mr(F, u.current, G, y.current) && l(!1);
    }), () => {
      u.current++, g.current++, A.abort();
    };
  }, [e]);
  function $(F, G) {
    i((A) => (A == null ? void 0 : A.video.id) !== G ? A : typeof F == "function" ? F(A) : F);
  }
  function m() {
    return p({
      onLoaded: (F) => {
        i(F), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: (F) => c(F.message || "Unable to reload the latest segment.")
    });
  }
  function B() {
    return p({
      onLoaded: (F) => {
        i(F), c("");
      },
      onError: (F) => c(F.message || "Unable to reload performer slots.")
    });
  }
  function W() {
    return p({
      onLoaded: (F) => {
        i(F), c("");
      },
      onError: (F) => c(F.message || "Unable to load the new AI review results.")
    });
  }
  return n("div", {
    className: `mx-auto flex w-full flex-col gap-2 ${h ? "lg:overflow-hidden" : "p-3 sm:p-4"}`,
    style: h ? {
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
      n($s, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    a ? n(zc, {
      key: a.video.id,
      detail: a,
      onDetailChange: $,
      onConflict: m,
      onReload: B,
      onAnalysisCompleted: W,
      onSlotsChanged: B,
      splitLayout: h,
      profile: o,
      initialSegmentId: ai() ? -ai() : Dl(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function ru(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function ou(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function iu(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function au({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: a
}) {
  const i = o.legacyCompatibilityRequired, s = Nl(o), l = ru(e, t, window.location.pathname), d = ou(e, t, window.location.pathname), c = iu(e, t, window.location.pathname), u = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if ($l(u, o) === "videos" && u !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Vr, {
      onNavigate: r,
      compatibilityMode: i,
      mode: s,
      profile: o
    });
  if (l) return n(Xc, {
    onNavigate: r,
    profile: o,
    onProfileChange: a
  });
  if (i) {
    if (d) return n(Ci, { onNavigate: r, profile: o });
    const h = Number(e);
    return Number.isInteger(h) && h > 0 ? n(Ti, {
      videoId: h,
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
  if (c) return n(nu, { onNavigate: r, profile: o });
  const y = Number(e);
  return d ? n(Ci, { onNavigate: r, profile: o }) : Number.isInteger(y) && y > 0 ? n(Ti, {
    videoId: y,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(Vr, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function su({ id: e, slug: t, onNavigate: r }) {
  const [o, a] = K(null), [i, s] = K("");
  return ge(() => {
    const l = new AbortController();
    return ee("/preferences", { signal: l.signal }).then((d) => a(Xi(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), i ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, i) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(au, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: a
  });
}
function lu(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function du(e, t) {
  const r = lu(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const Pu = {
  components: { SegmentStudioPage: su },
  actionHandlers: { openSegmentStudio: du }
};
export {
  Lc as ANALYSIS_RUN_CHECK_INTERVAL_MS,
  Nn as CLEARED_SEGMENT_SELECTION_ID,
  xi as DISCOVERY_SORT_OPTIONS,
  Yt as SEGMENT_STUDIO_CAPABILITIES,
  io as SEGMENT_STUDIO_EXTENSION_ID,
  Qn as SEGMENT_STUDIO_SHORTCUTS,
  Vs as activeEditorFilterCount,
  Bd as addPendingChange,
  gd as applyDerivationRuleSlotSuggestions,
  _n as applyFeedbackEditorDelta,
  zd as applyPendingChanges,
  gi as applySegmentMergeDelta,
  Xl as basicSegmentTimelineStyle,
  El as browseClipEnd,
  ta as browseEditorHref,
  oi as buildBrowseRequest,
  _c as buildDerivationRuleGraph,
  sc as buildDiscoverySearchParams,
  Ds as buildMinuteTimelineTicks,
  Uc as buildPerformerSlotOverview,
  Fl as buildSegmentQuickSearchEntries,
  hd as buildSegmentRailRows,
  vd as buildTimelineRows,
  fu as buildTimelineTicks,
  js as calculateCenteredTimelineScroll,
  Yr as calculateEditorPanelMaximum,
  Os as calculateMinuteLabelStride,
  yu as calculateMinuteTimelineWidth,
  Gs as calculateSwimlaneTitleMaximum,
  Fs as calculateTimelinePlayheadPosition,
  so as calculateTimelineRatioBounds,
  zs as calculateTimelineRatioFromPointer,
  bu as calculateVerticalRevealOffset,
  on as clampEditorPanelWidth,
  hr as clampSwimlaneTitleWidth,
  Hi as clampTimelineRatio,
  lo as clampTimelineRatioForHeight,
  wr as clampTimelineZoom,
  rc as compactProvenanceSummary,
  Ud as confirmPendingChange,
  Hs as createEditorReloader,
  gl as createQueuedReviewRequest,
  Ld as createSaveQueue,
  Fc as createSegmentAnalysisRequestScope,
  Pu as default,
  Na as discardPendingChange,
  Jl as downloadFileNameFromContentDisposition,
  Js as dualRangeValueFromPointer,
  ei as duplicateIdentityFromResponse,
  yl as duplicateOperationKey,
  Wi as editorVisibilityIncludingSegment,
  kd as expandedSwimlanes,
  Tl as extensionOwnedSegmentsModeSwitchPrompt,
  $d as feedbackFrameTimestamps,
  Rd as feedbackResultMatchesAction,
  Td as feedbackSelectionPlan,
  Ws as filterDerivedSegments,
  zr as filterEditorSegments,
  Hc as filterPerformerSlotOverview,
  jl as filterSegmentQuickSearch,
  ku as filterSegmentStudioShortcuts,
  Id as findAdjacentSegmentGroupKey,
  kl as findAdjacentShot,
  cl as findEditorShortcut,
  Ui as findInitialSegmentSelection,
  Es as findNearestSegmentInCurrentSwimlane,
  xr as findNextUnprocessed,
  Sl as findPublishedSelectionIdentity,
  rt as findSegmentByStableIdentity,
  Us as findSegmentFromPlayhead,
  As as findSegmentNearPlayhead,
  Nd as findSwimlaneRangeSelection,
  no as findSwimlaneSelection,
  Pl as findUniquePerformerSlotAssignment,
  kr as findUnreviewedSelection,
  ld as focusDialogDefaultButton,
  $r as formatGenderHint,
  wl as frameStepSeconds,
  na as generatePerformerSlotAssignmentRecommendations,
  xc as groupApprovedDraftsForPublishing,
  Ll as groupAutoAssignCandidates,
  Md as groupIncorrectExamplesByTag,
  Ic as groupMaterializationOutputs,
  an as groupSegmentsIntoSwimlanes,
  xd as groupSelectedSwimlanes,
  yo as groupSwimlanesBySegmentGroup,
  Rt as handleModalKey,
  fa as hasGroupedSwimlanes,
  Cn as hasSegmentStudioCapability,
  ka as heldTagChangeFor,
  xl as heldTagReady,
  fi as hideCollectedFeedbackSegments,
  ui as historyActionsForTarget,
  pr as incorrectExampleHistoryState,
  pa as indexPerformerSlotsBySegment,
  Iu as initialReviewFilter,
  Dd as insertSegmentProjection,
  mr as isCurrentEditorRequest,
  od as isEditableTarget,
  $u as isEditorShortcutOwner,
  Pd as isKindRunning,
  Ou as isSaveQueueBusy,
  iu as isSegmentStudioBinRoute,
  ou as isSegmentStudioSegmentsRoute,
  ru as isSegmentStudioSettingsRoute,
  qc as layoutDerivationRuleComponent,
  Wc as layoutDerivationRuleComponents,
  Od as mergeSegmentsProjection,
  ud as multiSelectionActionHint,
  tn as normalizeCollapsedSegmentGroups,
  wi as normalizeDiscoveryIds,
  Dt as normalizeEditorSegmentFilters,
  Xt as normalizeGender,
  ti as normalizeReviewFilter,
  Xi as normalizeSegmentStudioFeatureProfile,
  wu as normalizeSegmentStudioMode,
  eo as normalizeSegmentStudioPublicMode,
  wn as parseBrowseSlotFilters,
  Ks as parseEditorLayout,
  _s as parseHideDerivedSegmentsPreference,
  qs as parseMergeConfirmationPreference,
  Qi as parsePlaybackShortcutConfig,
  ll as parseShortcutBindingOverrides,
  Zt as patchPerformerSlotProjection,
  Mu as patchSegmentProjection,
  Hd as pendingChangesReducer,
  Gd as pendingInsertedSegments,
  rl as percentageSeekTime,
  Ol as performInitialSegmentSeek,
  ct as performerOptionId,
  Nr as performerSlotHistoryState,
  It as performerSlotLabel,
  pd as performerSlotPresentation,
  Ru as performerSlotStatus,
  fo as performerSlotStatusFromSegmentSlots,
  ga as performerSlotsForSegment,
  zt as provenanceSourceLabel,
  Ca as prunePendingChanges,
  vl as queueCreatedSegmentTagChoice,
  ra as rankPerformerOptions,
  Cd as reconcileSegmentGroupKey,
  tl as reconcileSelectedSegmentIds,
  uc as recyclingBinActionText,
  Ql as recyclingBinDeletionPrompt,
  la as recyclingBinDeletionSummary,
  Rl as recyclingBinModeSwitchPrompt,
  Nu as removeQueuedReviewsForSegments,
  Au as removeSegmentsProjection,
  ai as requestedOwnedItemId,
  Dl as requestedSegmentId,
  Qs as resolveEditorSegmentSelection,
  pl as resolveQueuedReviewRequest,
  bl as resolveSegmentCreationAction,
  $l as resolveSegmentStudioRoute,
  dl as resolveSegmentStudioShortcuts,
  xa as resolveSegmentTarget,
  Vc as resolveSelectedDerivationRule,
  Qo as resolveSelectedSegments,
  Rc as restoreDisabledToolbarActionFocus,
  Kc as restorePublishApprovedFocus,
  Eu as restoreSegmentFieldsProjection,
  Du as restoreSegmentsProjection,
  Kd as retargetPendingChanges,
  va as revealCollapsedSegmentGroup,
  $n as sameSegmentIdentity,
  Sa as savingSegmentIdFrom,
  ca as segmentBadgeStyle,
  Cr as segmentGroupHeaderBackground,
  Gt as segmentGroupKeyForSegment,
  po as segmentHistoryIdentity,
  gr as segmentHistoryState,
  $t as segmentIdentity,
  ua as segmentRailItemStyle,
  Cu as segmentStateStyle,
  lu as segmentStudioActionTarget,
  Nl as segmentStudioLegacyMode,
  Zl as segmentTimelineStyle,
  Et as segmentsHistoryState,
  nl as selectAllVideoSegmentIds,
  Ml as selectedBrowseStates,
  ba as selectedSwimlaneMerge,
  vr as selectionReferenceForSegment,
  $a as setBackLinkNavigation,
  Ia as settlePendingChange,
  dd as sharedPerformerSlotShape,
  cd as sharedTagPerformerSlotShape,
  In as shortcutAvailableInMode,
  ul as shortcutBindingDisplayText,
  hu as shortcutBindingFromEvent,
  xu as shortcutBindingsOverlap,
  Su as shortcutModesOverlap,
  sl as shortcutRequiresSingleSegment,
  Hr as shotBoundaryFingerprint,
  sd as shouldAcceptCurrentTagFromEnter,
  ad as shouldDismissPopover,
  vu as shouldExitShortcutCapture,
  Tu as shouldHandleEditorShortcut,
  jc as shouldLoadSegmentAnalysis,
  vi as shouldReloadAfterSegmentMutation,
  Xr as shouldRestoreTransitionSelection,
  Bl as shouldShowQuickSearchGroups,
  Zo as splitShortcutCategoriesIntoColumns,
  Bc as startCompletedRunWatch,
  md as suggestDerivationRuleSlotMappings,
  Jn as swimlaneDisplayLabel,
  rd as swimlaneMarkerTop,
  td as swimlaneStripeBackground,
  hl as tagEditorLockedBySave,
  bo as targetsOverlap,
  Bs as timelineContentStyle,
  qo as timelinePlayheadHorizontalStyle,
  ed as timelineSegmentWidth,
  Ps as timelineTickAlignment,
  Ls as timelineTickPosition,
  Jr as timelineTimePercent,
  wd as toggleAllCollapsedSegmentGroups,
  ml as toggledSelectionReviewState,
  Vt as trapModalFocus,
  ql as tryParseJsonResponseText,
  el as updateAnchoredSegmentSelection,
  lc as updateDiscoverySelection,
  Ys as updateDualRangeValues,
  Zs as updateSegmentCollectionSelection,
  Xs as updateSegmentRangeSelection,
  Vi as updateSegmentSelection,
  Ni as validateDerivationRuleDraft,
  _o as validateSegmentTiming,
  co as videoPerformerOptions,
  Wr as videoPerformerSlotAssignments,
  Cl as visibleSegmentStudioSettingsTabs,
  Il as visibleSegmentStudioTabs,
  ya as visibleVirtualRows
};
