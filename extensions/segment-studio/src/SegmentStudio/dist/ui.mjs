import Ro from "@cove/runtime/react";
import { createPortal as nl } from "@cove/runtime/react-dom";
import { extensionFetch as Eo } from "@cove/runtime/api";
import * as dr from "@cove/runtime/components";
import { formatDuration as rl, EntityReferenceSelector as cr, useExtensionKeyboardBindings as ol, VideoPlayer as ta, useRegisterExtensionKeyboardActions as na, getDefaultFilter as ra, useListUrlState as oa, ListPage as ia, VIDEO_CRITERIA as il, VIDEO_SORT_OPTIONS as al } from "@cove/runtime/components";
import { StepBack as sl, StepForward as ll, Loader2 as dl } from "@cove/runtime/lucide-react";
const Ao = "com.midnightrider.segment-studio", cl = "segment-studio-editor", aa = "segment-studio.layout.v1", vn = "segment-studio.operations.v1", sa = "segment-studio.collapsed-segment-groups.v1", la = "segment-studio.playback-shortcuts.v1", da = "segment-studio.timing-clipboard.v1", ca = "segment-studio.hide-derived-segments.v1", ua = "segment-studio.merge-confirmation.v1", Et = ["unreviewed", "approved", "rejected"], ul = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], vi = "(min-width: 1024px) and (min-height: 640px)", Si = "(min-width: 1024px) and (min-height: 900px)", ur = 1e-3, xi = 15, ml = 30, ma = 12, Mt = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, Mo = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30
}, Qt = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function ki(e, t, n) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(n) && n > 0;
  return e < 0 || o && e > n || t != null && (t < 0 || o && t > n) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function ga(e, t = null) {
  const n = e.flatMap((o) => o.markers.map((i) => i.segment));
  return n.find((o) => o.id === t) ?? Kr(e, null, 1, !0) ?? n[0] ?? null;
}
function Kr(e, t, n, o = !1) {
  var m;
  const i = e.findIndex((p) => p.markers.some((y) => y.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const p = e.flatMap((y) => y.markers.map((h) => h.segment)).filter((y) => y.reviewState === "unreviewed");
    return n < 0 ? p.at(-1) ?? null : p[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((p) => p.segment.id === t);
  if (!o)
    return ((m = (n < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((y) => y.segment.reviewState === "unreviewed")) == null ? void 0 : m.segment) ?? null;
  const l = e.flatMap((p) => p.markers.map((y) => y.segment)), d = l.findIndex((p) => p.id === t);
  return (n < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((p) => p.reviewState === "unreviewed") ?? null;
}
function gl(e, t, n, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((m, p) => m.markers.filter(({ segment: y }) => {
    const h = Number(y.startSec), f = y.endSec == null ? h + ml : Number(y.endSec);
    return Number.isFinite(h) && Number.isFinite(f) && f >= h && h <= i + xi + ur && f >= i - xi - ur;
  }).map(({ segment: y }) => ({ segment: y, laneIndex: p }))).sort((m, p) => m.laneIndex - p.laneIndex || Math.abs(m.segment.startSec - i) - Math.abs(p.segment.startSec - i) || m.segment.id - p.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((m) => m.markers.some((p) => p.segment.id === o));
  if (s < 0) return n < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((m) => m.laneIndex !== s);
  return l.length === 0 ? n < 0 ? a.at(-1).segment : a[0].segment : n < 0 ? ((d = l.findLast((m) => m.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((m) => m.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function fl(e, t, n) {
  var a;
  const o = Number(n);
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
function zr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function gm(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const n = Math.max(2, Math.floor(t));
  return Array.from({ length: n }, (o, i) => e * i / (n - 1));
}
function pl(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, n) => n * 60);
}
function fm(e, t = 1, n = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, n) : Math.ceil(e / 60) * Math.max(1, n) * Math.max(1, t);
}
function yl(e, t, n = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(n) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function bl(e, t, n = null) {
  return e <= 0 || e >= t - 1 && (n == null || n >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function hl(e, t, n) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && n >= 100 ? { right: "0" } : { left: `${n}%` };
}
function vl(e, t, n, o, i = 160, a = 0) {
  if (!(t > 0) || !(n > o)) return 0;
  const s = Math.max(0, n - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(n - o, Math.max(0, l - o / 2));
}
function yo(e, t) {
  const n = Number(e);
  return t > 0 && Number.isFinite(n) ? Math.min(1, Math.max(0, n / t)) * 100 : 0;
}
function Sl(e, t, n = 10) {
  const o = yo(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(n) || 0) * (1 - i)
  };
}
function wi(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function xl(e, t = ma) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function fa(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : Mt.timelineRatio;
}
function bo(e, t) {
  const n = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(n) ? n : 560));
}
function yn(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? Mt.detailWidth : Math.min(bo(t, 0), Math.max(240, e));
}
function jr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? Mt.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function kl(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function Do(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: Mt.timelineRatio, maximum: Mt.timelineRatio };
  const n = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: n, maximum: Math.max(n, o) };
}
function Oo(e, t) {
  const n = fa(e);
  if (!(t > 0)) return n;
  const o = Do(t);
  return Math.min(o.maximum, Math.max(o.minimum, n));
}
function wl(e) {
  if (!e) return { ...Mt };
  try {
    const t = JSON.parse(e), n = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof n == "number" && Number.isFinite(n) ? fa(n) : Mt.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: yn(t == null ? void 0 : t.detailWidth),
      markerRailWidth: yn(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: jr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...Mt };
  }
}
function Nl(e, t, n) {
  return n > 0 ? Oo((t + n - e) / n, n) : Mt.timelineRatio;
}
function pm(e, t, n, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < n + a ? e - n - a : t > o - a ? t - o + a : 0;
}
function Il(e, t, n, o = null) {
  var d;
  const i = [...e].sort((c, m) => c.startSec - m.startSec || c.id - m.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= ur ? i[a + (n < 0 ? -1 : 1)] ?? null : n < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function Mr(e, t, n, o) {
  return e === t && n === o;
}
function Cl({ beginRequest: e, fetchDetail: t, isCurrent: n, isSameVideo: o }) {
  let i = null, a = null;
  return function({ onLoaded: l, onError: d, prepare: c = null }) {
    const m = e(), p = (async () => {
      try {
        const y = await t(m);
        if (n(m)) {
          const h = c ? c(y, m) : y;
          return l(h), h;
        }
      } catch (y) {
        if (n(m))
          return d(y), null;
      }
      return o(m) && i !== p && a.videoId === m.videoId ? i : null;
    })();
    return i = p, a = m, p;
  };
}
const Pn = "__segment-studio-cleared-selection__";
function $l(e) {
  return e === "true";
}
function Tl(e) {
  return e !== "false";
}
function pa() {
  try {
    return Tl(window.localStorage.getItem(ua));
  } catch {
    return !0;
  }
}
function ya(e) {
  try {
    window.localStorage.setItem(ua, String(!!e));
  } catch {
  }
}
function Rl(e, t) {
  return t ? e.filter((n) => !n.isDerived) : e;
}
function Ft(e = {}) {
  const t = Et.filter((m) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(m) : !0), n = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (m, p) => {
    const y = Number(m);
    return Number.isFinite(y) ? Math.min(1, Math.max(0, y)) : p;
  }, d = l(e.confidenceMin, 0), c = l(e.confidenceMax, 1);
  return {
    reviewStates: t,
    performerId: n > 0 ? n : null,
    tagId: o > 0 ? o : null,
    segmentGroupId: a,
    sourceKey: s,
    confidenceMin: Math.min(d, c),
    confidenceMax: Math.max(d, c),
    includeUnscored: e.includeUnscored !== !1
  };
}
function lo(e, t, n, o = !1, i = []) {
  var c, m;
  const a = Ft(n), s = a.performerId == null ? null : new Set((t || []).filter((p) => Number(p.performerId) === a.performerId).map((p) => p.segmentId)), l = new Set((i || []).flatMap((p) => p.tags || []).map((p) => Number(p.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((m = (c = (i || []).find((p) => Number(p.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : m.map((p) => Number(p.tagId))) || []);
  return Rl(e || [], o).filter((p) => {
    if (p.reviewState != null && !a.reviewStates.includes(p.reviewState) || s && !s.has(p.id) || a.tagId != null && Number(p.tagId) !== a.tagId || d && !d.has(Number(p.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(p.tagId)) || a.sourceKey != null && p.sourceKey !== a.sourceKey) return !1;
    const y = Number(p.confidence);
    return p.confidence == null || !Number.isFinite(y) ? a.includeUnscored : y >= a.confidenceMin && y <= a.confidenceMax;
  });
}
function ba(e, t, n, o = !1, i = []) {
  var l;
  const a = Ft(n);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = Ft({
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
    filters: Ft(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function El(e, t = !1) {
  const n = Ft(e);
  return +(n.reviewStates.length !== Et.length) + +(n.performerId != null) + +(n.tagId != null) + +(n.segmentGroupId != null) + +(n.sourceKey != null) + +(n.confidenceMin > 0 || n.confidenceMax < 1) + +!n.includeUnscored + Number(t);
}
function Al(e, t, n) {
  const o = Number(e), i = Number(t), a = Number(n);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function Ml(e, t, n, o) {
  const i = Math.round(Math.min(1, Math.max(0, Number(o))) * 100) / 100;
  if (n === "minimum") {
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
function Dl(e, t, n = null, o = {}) {
  if (t === Pn) return null;
  const i = t ?? n, a = (e || []).flatMap((s) => (s.markers || []).map((l) => l.segment)).find((s) => s.id === i);
  if (a) return a;
  if (o.reference) {
    const s = o.visibleLanes ?? e;
    return s.flatMap((d) => (d.markers || []).map((c) => c.segment)).find((d) => d.id === o.reference.id) ?? Gr(s, o.reference);
  }
  return ga(e);
}
function ha(e, t, n, o = !1) {
  const i = [...new Set((e || []).filter((s) => s != null))];
  if (!o) return { selectedSegmentIds: [n], activeSegmentId: n };
  if (!i.includes(n))
    return { selectedSegmentIds: [...i, n], activeSegmentId: n };
  const a = i.filter((s) => s !== n);
  return a.length === 0 ? { selectedSegmentIds: i, activeSegmentId: t } : {
    selectedSegmentIds: a,
    activeSegmentId: n === t ? a.at(-1) ?? null : t
  };
}
function Ol(e, t, n) {
  const o = [...new Set((e || []).filter((s) => s != null))], i = [...new Set((n || []).filter((s) => s != null))];
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
function Pl(e, t, n, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(n);
  if (s < 0 || l < 0)
    return ha(e, t, n, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: n
  };
}
function Ll(e, t, n = null, o = !1) {
  const i = (e == null ? void 0 : e.selectedSegmentIds) || [], a = (e == null ? void 0 : e.activeSegmentId) ?? null, s = (e == null ? void 0 : e.anchorSegmentId) ?? a, l = (e == null ? void 0 : e.rangeBaseSegmentIds) || [];
  if (n) {
    const m = [...new Set(n)];
    if (!m.includes(s) || !m.includes(t))
      return {
        selectedSegmentIds: [t],
        activeSegmentId: t,
        anchorSegmentId: t,
        rangeBaseSegmentIds: []
      };
    const p = o ? [.../* @__PURE__ */ new Set([...l, ...i])] : l;
    return {
      ...Pl(p, s, t, m, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: p
    };
  }
  const d = ha(i, a, t, o);
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
function jl(e, t, n) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return n != null && i.has(n) && !a.includes(n) && a.push(n), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function Fl(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function rn(e, t) {
  const n = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(n, Number((e == null ? void 0 : e.endSec) ?? n) || n), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < n ? n - a : i > o ? i - o : 0;
}
function Ni(e, t, n, o = () => !0) {
  const i = t.anchor ?? t;
  return (e || []).map((a) => a.segment).filter((a) => a && !n.has(a.id) && o(a)).sort((a, s) => rn(t, a) - rn(t, s) || rn(i, a) - rn(i, s) || Math.abs(Number(a.startSec) - Number(i.startSec)) - Math.abs(Number(s.startSec) - Number(i.startSec)) || Number(a.startSec) - Number(s.startSec) || Number(a.id) - Number(s.id))[0] ?? null;
}
function ho(e, t) {
  return ((e == null ? void 0 : e.markers) || []).map((n) => n.segment).filter((n) => n && !t.has(n.id));
}
function co(e) {
  return e.reviewState === "unreviewed";
}
function Ii(e, t) {
  const n = Number(e.startSec) || 0;
  return n !== t.startSec ? n > t.startSec : Number(e.id) > Number(t.id);
}
function Ci(e, t, n, o, i) {
  var s;
  return t < 0 ? Ni(e.flatMap((l) => l.markers || []), n, o, i) : ((s = e.map((l, d) => ({ index: d, found: Ni(l.markers, n, o, i) })).filter(({ found: l }) => l).sort((l, d) => Math.abs(l.index - t) - Math.abs(d.index - t) || rn(n, l.found) - rn(n, d.found) || rn(n.anchor ?? n, l.found) - rn(n.anchor ?? n, d.found) || +(l.index < t) - +(d.index < t) || l.index - d.index)[0]) == null ? void 0 : s.found) ?? null;
}
function Gl(e, t, n) {
  if (ho(e, n).length > 0) return t;
  const o = ((e == null ? void 0 : e.markers) || []).map((s) => s.segment).filter((s) => s && n.has(s.id));
  if (o.length <= 1) return t;
  const i = Math.min(t.startSec, ...o.map((s) => Number(s.startSec) || 0)), a = Math.max(t.endSec, ...o.map((s) => Number(s.endSec ?? s.startSec) || 0));
  return { ...t, startSec: i, endSec: a, anchor: t };
}
function Fr(e, t) {
  var a;
  const n = (e || []).find((s) => (s.markers || []).some(({ segment: l }) => l.id === t)), o = (a = n == null ? void 0 : n.markers.find((s) => s.segment.id === t)) == null ? void 0 : a.segment;
  if (!o) return null;
  const i = Number(o.startSec) || 0;
  return {
    laneKey: n.key,
    id: o.id,
    startSec: i,
    endSec: Number(o.endSec ?? i) || i
  };
}
function Gr(e, t, n = {}) {
  const o = e || [];
  if (o.length === 0) return null;
  const i = new Set(n.removedIds || []);
  if (t == null) {
    const l = { markers: o.flatMap((c) => c.markers || []) }, d = ho(l, i);
    return d.find(co) ?? d[0] ?? null;
  }
  i.add(t.id);
  const a = o.findIndex((l) => l.key === t.laneKey);
  if (a >= 0) {
    const l = ho(o[a], i).filter(co), d = l.find((m) => Ii(m, t));
    if (d) return d;
    const c = l.filter((m) => !Ii(m, t)).at(-1);
    if (c) return c;
  }
  const s = Gl(o[a], t, i);
  return Ci(o, a, s, i, co) ?? Ci(o, a, s, i, () => !0);
}
function Bl(e, t) {
  const n = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return n * o / 10;
}
function $i(e, t) {
  const n = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => n.get(o)).filter(Boolean);
}
function Ul() {
  try {
    return $l(window.localStorage.getItem(ca));
  } catch {
    return !1;
  }
}
function Kl(e) {
  try {
    window.localStorage.setItem(ca, String(!!e));
  } catch {
  }
}
const fr = [
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
    const n = t + 1;
    return {
      id: `video.seekPercent${n * 10}`,
      category: "Playback",
      bindings: [{ key: String(n) }],
      description: `Seek to ${n * 10}% of the video`
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
], zl = /* @__PURE__ */ new Set([
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
function _l(e) {
  return zl.has(e);
}
function va(e) {
  if (!e || typeof e != "object" || typeof e.key != "string") return null;
  const t = e.key === " " ? " " : e.key.trim(), n = typeof e.code == "string" ? e.code.trim() : "", o = ["Comma", "Period"].includes(n) ? n : "";
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
function Hl(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const n = new Set(fr.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => n.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(va).filter(Boolean)]));
  } catch {
    return {};
  }
}
function ql(e = {}) {
  const t = Hl(e);
  return fr.map((n) => ({
    ...n,
    bindings: Object.hasOwn(t, n.id) ? t[n.id] : n.bindings
  }));
}
function Ti(e, t = 2) {
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
function ym(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : va({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function bm(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function vo(e, t) {
  const n = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (n !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function Ri(e, t) {
  const n = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(n != null && n.includes(String(t || "").toLowerCase()));
}
function hm(e, t) {
  if (!e || !t) return !1;
  const n = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = Ri(e.code, t.key), a = Ri(t.code, e.key);
  if (!n && !o && !i && !a) return !1;
  const s = i ? t.key : e.key, l = i ? e.code : a ? t.code : o ? e.code : e.code || t.code;
  for (const d of [!1, !0])
    for (const c of [!1, !0])
      for (const m of [!1, !0])
        for (const p of [!1, !0]) {
          const y = {
            key: s,
            code: l,
            ctrlKey: d,
            metaKey: c,
            altKey: m,
            shiftKey: p
          };
          if (vo(y, e) && vo(y, t)) return !0;
        }
  return !1;
}
function Gn(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function vm(e, t) {
  return [!1, !0].some((n) => Gn(e, n) && Gn(t, n));
}
function Wl(e, t = !1, n = {}) {
  return ql(n).find((o) => Gn(o, t) && o.bindings.some((i) => vo(e, i))) || null;
}
function Sa(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function Vl(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Sa).join(" / ") : "Unassigned";
}
function Sm(e, t) {
  const n = String(t || "").trim().toLowerCase();
  return n ? e.filter((o) => [o.description, o.category, Vl(o)].some((i) => String(i || "").toLowerCase().includes(n))) : e;
}
function xm(e) {
  return e === "review" ? "review" : "editor";
}
function mt(e, { itemId: t = null, nativeSegmentId: n = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return n == null ? null : (e || []).find((o) => o.nativeSegmentId === n) || null;
}
function Ei(e, t) {
  return (e || []).length > 0 && e.every((n) => n.reviewState === t) ? "unreviewed" : t;
}
function Jl(e, t, n) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (n == null ? void 0 : n.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function Yl(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const n = e.identities.map((i) => mt(t, i)).filter(Boolean);
  return n.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: n,
    selectedSegment: mt(t, e.activeIdentity) || n[0]
  };
}
function Ql(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function km(e, t) {
  return (e || []).filter((n) => !n.identities.some((o) => (t || []).some((i) => Ql(o, i))));
}
function Ai(e, t) {
  var o;
  if (e) {
    const i = (t == null ? void 0 : t.nativeSegmentId) ?? (t == null ? void 0 : t.id) ?? null;
    if (i == null) throw new Error("Duplicate response did not include a stable native identity.");
    return { nativeSegmentId: i };
  }
  const n = ((o = t == null ? void 0 : t.createdDraft) == null ? void 0 : o.itemId) ?? null;
  if (n == null) throw new Error("Duplicate response did not include a stable item identity.");
  return { itemId: n };
}
function Xl(e, t, n, o) {
  const i = n ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function Zl(e, t, n = null) {
  const o = Number(n);
  if (n != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function ed(e, t, n) {
  return e != null && (n == null || t !== n);
}
function td(e, t, n, o = null) {
  if (n === t.tagId) return null;
  const i = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: n,
    tagName: o || ((i == null ? void 0 : i.tagId) === n ? i.tagName : null)
  };
}
function nd({ tagEditing: e, selectedSegmentIds: t, activeSegmentId: n }, o) {
  return !(e && n === o && (t == null ? void 0 : t.length) === 1 && t[0] === o);
}
function So(e, t) {
  return e === t;
}
function rd(e, t, n) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (n || []).find((i) => i.itemId === o.itemId) || null;
}
function od(e, t, n) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return n < 0 ? o.filter((i) => i.startSec < t - ur).at(-1) || null : o.find((i) => i.startSec > t + ur) || null;
}
function uo(e) {
  return [...e || []].sort((t, n) => t.startSec - n.startSec || t.id - n.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function Mi(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: Et.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function wm(e, t = null, n = !1) {
  const o = Mi(n ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function On(e, t, n, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(n, i)) : t;
}
function xa(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: On(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: On(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: On(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(On(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(On(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(On(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...Mo };
  }
}
function id(e, t = 30) {
  const n = Number(t);
  return Number(e) / (Number.isFinite(n) && n > 0 ? n : 30);
}
function ka() {
  try {
    return xa(window.localStorage.getItem(la));
  } catch {
    return { ...Mo };
  }
}
function Di(e) {
  const t = xa(JSON.stringify(e));
  try {
    window.localStorage.setItem(la, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Xt = Object.freeze({
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
function xo(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function wa(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, n = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && n && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? xo(e.requestedMode) : "basic",
    effectiveMode: i ? xo(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function Bn(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function ad(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function sd(e) {
  const t = [];
  return Bn(e, Xt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), Bn(e, Xt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function ld(e) {
  return [
    ["general", "General", Xt.settingsGeneral],
    ["shortcuts", "Shortcuts", Xt.settingsShortcuts],
    ["performer-slots", "Performer slots", Xt.settingsPerformerSlots],
    ["derivation", "Derivation", Xt.settingsDerivation]
  ].filter(([, , n]) => Bn(e, n)).map(([n, o]) => [n, o]);
}
function dd(e, t) {
  return e === "segments" && !Bn(
    t,
    Xt.navigationSegmentInventory
  ) || e === "bin" && !Bn(
    t,
    Xt.recyclingBinView
  ) ? "videos" : e;
}
function cd(e) {
  const t = Number(e), n = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (n === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = n === 1;
  return `You have ${n} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function ud(e, t = 0) {
  const n = Number(e), o = Number.isFinite(n) && n >= 0 ? Math.trunc(n) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const mo = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, Oi = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: Et.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
], Ut = "slottedPerformerCriterion", pr = "slotCriterion", jn = "*", Na = "unassignedSlotCriterion", bn = "_filterExpression";
function md(e, t = {}, n = []) {
  const o = n.filter((a) => a.type !== "related"), i = new Map((e || []).filter((a) => a.key !== jn).map((a) => [a.key, a.label]));
  for (const a of gd(t)) a !== jn && !i.has(a) && i.set(a, a);
  return {
    id: "slottedPerformer",
    label: "Slotted Performer",
    type: "related",
    entityType: "performers",
    filterKey: Ut,
    category: "related",
    supportsDistinctSiblingMatches: !0,
    relatedCriteria: () => o,
    relatedContextCriteria: [
      {
        id: "slot",
        label: "Slot",
        type: "enum",
        filterKey: pr,
        modifiers: ["EQUALS"],
        options: [{ value: jn, label: "Any" }, ...[...i].map(([a, s]) => ({ value: a, label: s }))]
      },
      { id: "specificPerformer", label: "Specific Performer", type: "multiId", entityType: "performers", filterKey: "performerIdsCriterion", modifiers: ["INCLUDES", "EXCLUDES"] },
      { id: "ageAtVideoDate", label: "Age (then)", type: "number", filterKey: "ageAtHostDateCriterion" },
      { id: "performerOccurrenceTags", label: "Occurrence Tags", type: "multiId", entityType: "tags", filterKey: "performerOccurrenceTagsCriterion" },
      { id: "unassignedSlot", label: "Unassigned Slot", type: "bool", filterKey: Na }
    ],
    relatedResultLabel: "segments"
  };
}
function gd(e) {
  const t = [], n = (o) => {
    var a, s, l;
    if (!o || typeof o != "object") return;
    const i = (s = (a = o[Ut]) == null ? void 0 : a[pr]) == null ? void 0 : s.value;
    typeof i == "string" && t.push(i);
    for (const d of ((l = o[bn]) == null ? void 0 : l.children) || o.children || []) n(d.filter || d.group);
  };
  return n(e), t;
}
function fd(e, t) {
  return {
    [pr]: { modifier: "EQUALS", value: e },
    performerIdsCriterion: { modifier: "INCLUDES", value: t }
  };
}
function pd(e, t) {
  const n = Ta(e.performersCriterion, e.performerId), o = e.slots !== void 0;
  if (!n.length && e.performersCriterion === void 0 && e.performerId === void 0 && !o || o && !t) return e;
  const i = { ...e };
  delete i.performersCriterion, delete i.performerId, delete i.slots;
  const a = bd(e.slots), s = new Map((t || []).flatMap((d) => (d.slotDefinitionIds || []).map((c) => [String(c), d.key]))), l = Object.entries(a.values).map(([d, c]) => fd(s.get(String(d)) ?? jn, [Number(c)]));
  if (n.length && l.push({ [pr]: { modifier: "EQUALS", value: jn }, performerIdsCriterion: { modifier: "INCLUDES", value: n } }), l.length === 1 && i[Ut] === void 0) i[Ut] = l[0];
  else if (l.length) {
    const d = l.slice(0, Object.keys(a.values).length).map((p) => ({ filter: { [Ut]: p } })), c = d.length > 1 ? [{ group: { operator: "AND", relatedScope: { filterKey: Ut, matchMode: "distinct" }, children: d } }] : d;
    n.length && c.push({ filter: { [Ut]: l.at(-1) } });
    const m = [...i[bn] ? [{ group: i[bn] }] : [], ...c];
    i[bn] = m.length === 1 && m[0].group ? m[0].group : { operator: "AND", children: m };
  }
  return a.activityTagId && i.activitiesCriterion === void 0 && i.activityId === void 0 && (i.activitiesCriterion = { modifier: "INCLUDES", value: [a.activityTagId] }), i;
}
function yd(e) {
  const t = String(e || "").split(",").filter((n) => Et.includes(n));
  return t.length === 0 ? [...Et] : [...new Set(t)];
}
function bd(e) {
  if (!e) return { activityTagId: null, values: {} };
  try {
    const t = JSON.parse(String(e));
    if (!t || Array.isArray(t) || typeof t != "object") return { activityTagId: null, values: {} };
    const n = t.values && typeof t.values == "object" && !Array.isArray(t.values) ? t.values : t;
    return {
      activityTagId: Number.isInteger(Number(t.activityTagId)) && Number(t.activityTagId) > 0 ? Number(t.activityTagId) : null,
      values: Object.fromEntries(Object.entries(n).filter(([o, i]) => o && o !== "activityTagId" && Number.isInteger(Number(i)) && Number(i) > 0))
    };
  } catch {
    return { activityTagId: null, values: {} };
  }
}
function ko(e) {
  return Array.isArray(e) ? e.map(ko) : !e || typeof e != "object" ? e : Object.fromEntries(Object.entries(e).filter(([t]) => !t.startsWith("_")).map(([t, n]) => [
    t,
    t === "modifier" && typeof n == "string" && /^[A-Z_]+$/.test(n) ? n.toLowerCase().replace(/_([a-z])/g, (o, i) => i.toUpperCase()) : ko(n)
  ]));
}
function hd(e) {
  var l, d;
  if (!e || typeof e != "object") return null;
  const { [Na]: t, [pr]: n, ...o } = e, i = typeof (n == null ? void 0 : n.value) == "string" && n.value ? n.value : jn, a = typeof (t == null ? void 0 : t.value) == "boolean" ? t.value : null, s = o._matchAll === !0 || !!((d = (l = o.findFilter) == null ? void 0 : l.q) != null && d.trim()) || Object.keys(o.objectFilter || {}).length > 0 || o.performerIdsCriterion !== void 0 || o.ageAtHostDateCriterion !== void 0 || o.performerOccurrenceTagsCriterion !== void 0;
  return !s && a === null && !n ? null : { role: i, performers: s || a === null ? ko(o) : null, unassigned: a };
}
function Ia(e, { legacyStates: t = !1 } = {}) {
  var o, i;
  const n = Et.includes((o = e.reviewStateCriterion) == null ? void 0 : o.value) ? [e.reviewStateCriterion.value] : t && e.states ? yd(e.states) : [];
  return {
    activityTagIds: Ta(e.activitiesCriterion, e.activityId),
    includeActivitySubtags: ((i = e.activitiesCriterion) == null ? void 0 : i.depth) === -1,
    reviewStates: n,
    slottedPerformer: hd(e[Ut])
  };
}
function Ca(e) {
  if (!e || typeof e != "object" || !Array.isArray(e.children)) return null;
  const t = e.children.flatMap((n) => {
    if (n != null && n.group) {
      const o = Ca(n.group);
      return o ? [{ group: o }] : [];
    }
    return n != null && n.filter && typeof n.filter == "object" ? [{ filter: Ia(n.filter) }] : [];
  });
  return t.length ? e._semanticNone ? { operator: "NOT", children: t.length === 1 ? t : [{ group: { operator: "OR", children: t } }] } : {
    operator: ["OR", "NOT", "JUST_ONE"].includes(e.operator) ? e.operator : "AND",
    ...e.relatedScope ? { relatedScope: e.relatedScope } : {},
    ...e.distinctRelatedMatches === !0 ? { distinctRelatedMatches: !0 } : {},
    children: t
  } : null;
}
function vd(e, t) {
  const n = Ca(t[bn]);
  return {
    query: String(e.q || "").trim() || null,
    ...Ia(t, { legacyStates: !0 }),
    ...n ? { filterExpression: n } : {},
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc"
  };
}
function Sd(e) {
  const { [Ut]: t, [bn]: n, ...o } = e, i = $a(n);
  return i ? { ...o, [bn]: i } : o;
}
function $a(e) {
  if (!e || typeof e != "object" || !Array.isArray(e.children)) return null;
  const t = e.children.flatMap((i) => {
    if (i != null && i.group) {
      const l = $a(i.group);
      return l ? [{ ...i, group: l }] : [];
    }
    if (!(i != null && i.filter) || typeof i.filter != "object") return [];
    const { [Ut]: a, ...s } = i.filter;
    return Object.keys(s).length ? [{ ...i, filter: s }] : [];
  });
  if (!t.length) return null;
  const { relatedScope: n, ...o } = e;
  return { ...o, ...n && n.filterKey !== Ut ? { relatedScope: n } : {}, children: t };
}
function Ta(e, t) {
  const n = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(n.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function Ra(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function xd(e) {
  var i;
  const t = Number(e.startSec) || 0, n = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(n)) return Math.max(t, n);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function kd(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Pi(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function wd(e, t, n) {
  if (typeof n != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (n(o.startSec, !1), !0) : !1;
}
function yt(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function Po(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function go(e, t) {
  const n = new Set(Po(t).map((o) => String(yt(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && n.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function on(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function Li(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(on).sort().join(",")}`;
}
function Ea(e, t, n = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((h) => String(h.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(n)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((h) => {
    var f;
    return !((f = h.genderHints) != null && f.length);
  }) && e.length === t.length && !i) {
    const h = [...e].sort((b, x) => String(b.slotDefinitionId).localeCompare(String(x.slotDefinitionId))), f = [...t].sort((b, x) => String(b.name).localeCompare(String(x.name)) || Number(yt(b)) - Number(yt(x)));
    return [{
      assignments: Object.fromEntries(h.map((b, x) => [String(b.slotDefinitionId), String(yt(f[x]))])),
      description: f.map((b) => b.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((h) => t.map((f, b) => ({ performer: f, index: b })).filter(({ performer: f }) => {
    var b;
    return !((b = h.genderHints) != null && b.length) || h.genderHints.some((x) => on(x) === on(f.gender || f.genderIdentity));
  }).map(({ index: f }) => f)), m = i ? c.filter((h) => h.length > 0).length : ji(c, t.length);
  if (m === 0) return [];
  const p = new Map(t.map((h, f) => [String(yt(h)), f]));
  function y(h, f, b) {
    if (s.length >= a) return;
    const x = c.slice(h), I = i ? x.filter((Y) => Y.length > 0).length : ji(x.map((Y) => Y.filter((P) => !f.has(String(yt(t[P]))))), t.length);
    if (b + I < m) return;
    if (h === e.length) {
      if (b !== m) return;
      const Y = Object.fromEntries(d.map(({ slot: L, performer: E }) => [String(L.slotDefinitionId), E ? String(yt(E)) : ""])), P = o.length === 0 ? Object.values(Y).sort().join(",") : [...new Set(e.map((L) => String(L.label || "")))].map((L) => `${L}:${d.filter(({ slot: E }) => String(E.label || "") === L).map(({ performer: E }) => E ? String(yt(E)) : "").sort().join(",")}`).join("|");
      !l.has(P) && s.length < a && (l.add(P), s.push({
        assignments: Y,
        description: d.map(({ slot: L, performer: E }) => o.length ? `${L.label}: ${(E == null ? void 0 : E.name) || "Unassigned"}` : (E == null ? void 0 : E.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const g = e[h], O = [...d].reverse().find(({ slot: Y }) => Li(Y) === Li(g)), J = O ? p.get(String(yt(O.performer))) : -1;
    for (const Y of c[h]) {
      const P = t[Y], L = yt(P);
      if (!(Y < J) && !(L == null || !i && f.has(String(L))) && (d.push({ slot: g, performer: P }), i || f.add(String(L)), y(h + 1, f, b + 1), i || f.delete(String(L)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: g, performer: null }), y(h + 1, f, b), d.pop();
  }
  return y(0, /* @__PURE__ */ new Set(), 0), s;
}
function ji(e, t) {
  const n = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), n[s] === -1 || o(n[s], a)))
        return n[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Nd(e, t) {
  if (!(e != null && e.length) || !(t != null && t.length)) return null;
  const n = e.some((l) => String(l.label || "").trim());
  if (n && e.some((l) => !String(l.label || "").trim())) return null;
  const o = e[0].allowSamePerformerInMultipleSlots === !0;
  if (!n && e.every((l) => {
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
      const p = [...new Set(e.map((y) => y.label || ""))].map((y) => `${y}:${a.filter((h) => (h.slot.label || "") === y).map((h) => h.performer.performerId).sort((h, f) => h - f).join(",")}`).join("|");
      i.has(p) || i.set(p, [...a]);
      return;
    }
    const c = e[l];
    for (const p of t)
      !o && d.has(p.performerId) || (m = c.genderHints) != null && m.length && !c.genderHints.some((y) => on(y) === on(p.gender)) || (a.push({ slot: c, performer: p }), o || d.add(p.performerId), s(l + 1, d), o || d.delete(p.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Id(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e || []) {
    const o = n.assignment || [], i = o.map(({ slot: l, performer: d }) => `${l.slotDefinitionId}:${d.performerId}`).join("|"), a = `${n.tagId}:${i}`;
    t.has(a) || t.set(a, {
      key: a,
      tagName: n.tagName || "Tag segment",
      candidates: [],
      assignment: o,
      counts: { unreviewed: 0, approved: 0, rejected: 0 }
    });
    const s = t.get(a);
    s.candidates.push(n), s.counts[n.reviewState] = (s.counts[n.reviewState] || 0) + 1;
  }
  return [...t.values()].map((n) => ({
    ...n,
    candidates: [...n.candidates].sort((o, i) => o.startSec - i.startSec || (o.endSec ?? o.startSec) - (i.endSec ?? i.startSec) || o.id - i.id)
  }));
}
function Cd(e, t, n = 20) {
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
  return (e || []).filter(i).slice(0, Math.max(1, Number(n) || 20));
}
function $d(e) {
  return (e || []).flatMap((t) => t.markers.map((n) => ({
    segment: n.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function Td(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function Aa(e, t, n) {
  const o = yt, i = new Set((t || []).map(o)), a = new Set((n || []).map(on));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), m = d.isVideoPerformer ?? i.has(o(d));
    if (c !== m) return m - c;
    const p = on(l.gender || l.genderIdentity), y = on(d.gender || d.genderIdentity), h = l.matchesGenderHint ?? a.has(p);
    return (d.matchesGenderHint ?? a.has(y)) - h || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
function Ma() {
  return null;
}
function Rd(e) {
  return typeof e == "function" || typeof e == "object" && e !== null && "$$typeof" in e;
}
function Da(e, t) {
  const n = e[t];
  return Rd(n) ? n : Ma;
}
const Ed = Da(dr, "ExtensionEntityActions"), Oa = Da(dr, "ExtensionSelectionActions"), pn = Oa !== Ma, { useEffect: fe, useId: Pa, useLayoutEffect: Fi, useMemo: Je, useReducer: Ad, useRef: ce, useState: G, useSyncExternalStore: Md } = Ro, r = Ro.createElement, Dd = dr.PERFORMER_CRITERIA ?? [], Od = typeof dr.useDocumentTitle == "function" ? dr.useDocumentTitle : () => {
}, La = "/api/plugins/segment-studio";
function Ye(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(vn) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const n = wo();
    return t[e] = n, window.localStorage.setItem(vn, JSON.stringify(t)), n;
  } catch {
    return wo();
  }
}
function Qe(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(vn) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(vn, JSON.stringify(t));
  } catch {
  }
}
function Lo(e) {
  try {
    return JSON.parse(window.localStorage.getItem(vn) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function jo(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(vn) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(vn, JSON.stringify(t));
  } catch {
  }
}
function Pd(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function Ld(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((n, o) => {
    const i = setTimeout(n, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function ee(e, t, n = 0) {
  var d;
  const o = await Eo(`${La}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Pd(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && n < 2)
    return await Ld(250 * (n + 1), t == null ? void 0 : t.signal), ee(e, t, n + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function jd(e, t) {
  const n = await Eo(e, t);
  if (!n.ok) {
    const o = await n.json().catch(() => null);
    throw new Error((o == null ? void 0 : o.error) || (o == null ? void 0 : o.detail) || (o == null ? void 0 : o.title) || "Unable to load Cove data.");
  }
  return n.json();
}
async function Fd(e, t) {
  const n = String(e).startsWith("/api/") ? e : `${La}${e}`, o = await Eo(n, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: Gd(
      o.headers.get("Content-Disposition")
    )
  };
}
function Gd(e, t = "segment-studio-ai-feedback.zip") {
  var s, l, d;
  const n = String(e || ""), o = (s = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(n)) == null ? void 0 : s[1];
  let i = null;
  if (o)
    try {
      i = decodeURIComponent(o.replace(/^"|"$/g, ""));
    } catch {
      i = null;
    }
  if (!i) {
    const c = /filename\s*=\s*(?:"([^"]+)"|([^;]+))/i.exec(n);
    i = (c == null ? void 0 : c[1]) || ((l = c == null ? void 0 : c[2]) == null ? void 0 : l.trim()) || null;
  }
  return ((d = i == null ? void 0 : i.split(/[\\/]/).pop()) == null ? void 0 : d.replace(/[\u0000-\u001f\u007f]/g, "").trim()) || t;
}
function Fe(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", n = Math.abs(e), o = Math.floor(n), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((n - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function wo() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function ja(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function Bd(e) {
  const t = Number(e.selectedSegmentCount) || 0, n = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + n, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = n > 0 ? ` and ${n} dependent derived segment${n === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function Fa(e, t) {
  const n = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : n.length;
  return { sceneCount: new Set(n.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function Ud(e, t) {
  const { sceneCount: n, segmentCount: o } = Fa(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${n} scene${n === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function Ga(e, t) {
  const n = (e == null ? void 0 : e.items) || [], o = Fa(n, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(Ud(n, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await ee("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Ye(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return Qe(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function Gi({ children: e }) {
  return r("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const zt = {
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
function Nm(e, t) {
  return {
    ...(zt[e] || zt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function Ba(e) {
  return { ...(zt[e] || zt.unreviewed).badge };
}
function Ua(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const Ka = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function Kd(e, t, n = "not-applicable", o = !1) {
  const i = zt[e] || zt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (n === "empty" || n === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function zd(e, t = !1) {
  const n = "rgb(20, 184, 166)";
  return {
    borderColor: n,
    backgroundColor: n,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function _d(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function Hd(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function Fo(e) {
  const t = typeof e == "string" ? e.trim() : "";
  return /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t) ? t.slice(0, 7).toLowerCase() : null;
}
function qd(e) {
  return (e == null ? void 0 : e.id) == null ? "var(--color-border)" : Fo(e.color) || "var(--color-accent)";
}
function Wd(e, t, n = null) {
  const o = Fo(n);
  return e ? {
    backgroundColor: t,
    boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
  } : o ? { backgroundColor: t, boxShadow: `inset 3px 0 0 color-mix(in srgb, ${o} 55%, transparent)` } : { backgroundColor: t };
}
function Vr(e = !1, t = null) {
  return `color-mix(in srgb, ${Fo(t) || "var(--color-accent)"} ${e ? 14 : 8}%, var(--color-surface))`;
}
function Vd(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function Sn({ state: e, includeLabel: t = !0 }) {
  const n = zt[e] || zt.unreviewed;
  return r("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: Ba(e)
  }, t ? `${n.symbol} ${e}` : n.symbol);
}
function Jd(e, t = null) {
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
  const n = e.closest("[role='separator']");
  return n ? t == null || ["Home", "End", "Tab"].includes(t) ? !0 : n.getAttribute("aria-orientation") === "horizontal" ? ["ArrowUp", "ArrowDown"].includes(t) : ["ArrowLeft", "ArrowRight"].includes(t) : !1;
}
function Im(e, t) {
  var a, s, l;
  if (!t) return !1;
  const n = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (n == null ? void 0 : n.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return n === t || ((s = t.contains) == null ? void 0 : s.call(t, n)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || n === (o == null ? void 0 : o.body) && i === o.body;
}
function Yd(e, t = document) {
  return !(e.defaultPrevented || Jd(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function Cm(e, t = document, n = !1, o = {}) {
  return Yd(e, t) ? Wl(e, n, o) != null : !1;
}
function Qd(e, t, n = null) {
  return !(!t || e instanceof Element && (t.contains(e) || n != null && n.contains(e)));
}
function Dt(e, { onCancel: t, onConfirm: n } = {}) {
  var s, l;
  if (e.key === "Enter" && (e.isComposing || (s = e.nativeEvent) != null && s.isComposing || e.keyCode === 229)) return !1;
  const o = typeof ((l = e.target) == null ? void 0 : l.closest) == "function" ? e.target.closest("button, a, select, option, textarea") : e.target, i = String((o == null ? void 0 : o.tagName) || "").toLowerCase();
  if (i === "select" || i === "option") return !1;
  if (e.key === "Enter" && e.repeat && (i === "button" || i === "a"))
    return e.preventDefault(), !1;
  if (e.key === "Enter" && (e.repeat || ["button", "a", "textarea"].includes(i))) return !1;
  const a = e.key === "Escape" ? t : e.key === "Enter" ? n : null;
  return a ? (e.preventDefault(), e.stopPropagation(), a(), !0) : !1;
}
function Xd(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const n = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !n || n.value.trim() !== String(t || "").trim() || (s = n.getAttribute) != null && s.call(n, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function Zd({ confirm: e, cancel: t, confirmReady: n }) {
  const o = n && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function Go({ confirmRef: e, cancelRef: t, confirmReady: n }) {
  fe(() => {
    const o = requestAnimationFrame(() => Zd({
      confirm: e.current,
      cancel: t == null ? void 0 : t.current,
      confirmReady: n
    }));
    return () => cancelAnimationFrame(o);
  }, [n]);
}
function Vt(e) {
  var a;
  if (e.key !== "Tab") return !1;
  const t = [...e.currentTarget.querySelectorAll(
    "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
  )].filter((s) => !s.hidden && s.getAttribute("aria-hidden") !== "true");
  if (t.length === 0)
    return e.preventDefault(), e.currentTarget.focus(), !0;
  const n = t[0], o = t[t.length - 1], i = (a = e.currentTarget.ownerDocument) == null ? void 0 : a.activeElement;
  return !t.includes(i) || !e.shiftKey && i === o || e.shiftKey && i === n ? (e.preventDefault(), (e.shiftKey ? o : n).focus(), !0) : !1;
}
function Bi(e, t) {
  const n = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < n ? i.filter((a) => a.sequence > o && a.sequence <= n).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > n && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function Bo(e, t = !0) {
  const n = (e == null ? void 0 : e.nativeSegmentId) ?? (e != null && e.published ? (e == null ? void 0 : e.id) ?? null : null);
  return t ? {
    itemId: (e == null ? void 0 : e.itemId) ?? null,
    nativeSegmentId: n,
    published: n != null,
    revision: (e == null ? void 0 : e.revision) ?? null
  } : {
    nativeSegmentId: n,
    recycleBinItemId: (e == null ? void 0 : e.recycleBinItemId) ?? null,
    revision: (e == null ? void 0 : e.revision) ?? null,
    updatedAt: (e == null ? void 0 : e.updatedAt) ?? null
  };
}
function Dr(e, t = !0) {
  return {
    type: "segment",
    identity: Bo(e, t),
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
function jt(e, t = !0) {
  return {
    type: "segments",
    segments: (e || []).map((n) => ({
      identity: Bo(n, t),
      values: {
        startSec: n.startSec,
        endSec: n.endSec ?? null,
        tagId: n.tagId,
        sourceKey: n.sourceKey || "user",
        sourceRunId: n.sourceRunId ?? null,
        confidence: n.confidence ?? null,
        ...t ? {} : {
          kind: n.kind || "tag",
          refId: n.refId ?? null,
          payloadJson: n.payloadJson ?? null,
          title: n.title ?? null,
          colorHint: n.colorHint ?? null,
          imageBlobId: n.imageBlobId ?? null,
          createdAt: n.createdAt,
          fieldProvenance: n.fieldProvenance || []
        },
        ...t ? { reviewState: n.reviewState } : {}
      }
    }))
  };
}
function Or(e, t) {
  return {
    type: "incorrectExamples",
    collected: t,
    entries: (e || []).map(({ segment: n, result: o, example: i }) => ({
      exampleId: (o == null ? void 0 : o.exampleId) ?? (i == null ? void 0 : i.id) ?? null,
      originalIdentity: Bo(n),
      collectedIdentity: {
        itemId: (o == null ? void 0 : o.itemId) ?? (i == null ? void 0 : i.itemId) ?? null,
        nativeSegmentId: (o == null ? void 0 : o.nativeSegmentId) ?? null,
        published: (o == null ? void 0 : o.nativeSegmentId) != null,
        revision: (o == null ? void 0 : o.revision) ?? null
      }
    }))
  };
}
function _r(e) {
  return {
    type: "performerSlots",
    targets: (e || []).map((t) => ({
      identity: {
        itemId: t.itemId ?? null,
        nativeSegmentId: t.segmentId ?? null
      },
      revision: t.revision,
      assignments: (t.slots || []).map((n) => ({
        slotDefinitionId: n.slotDefinitionId,
        performerId: n.performerId ?? null
      }))
    }))
  };
}
function za(e, t) {
  return (e || []).filter((n) => n.segmentId === t).sort((n, o) => n.sortOrder - o.sortOrder || String(n.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function _a(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e || []) {
    const o = t.get(n.segmentId);
    o ? o.push(n) : t.set(n.segmentId, [n]);
  }
  for (const n of t.values())
    n.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function Uo(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((n) => Number(n.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function ec(e, t) {
  const n = (t || []).map((i) => za(e, i.id));
  if (n.length === 0 || n.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: Ot(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return n.every((i) => o(i) === o(n[0])) ? n : null;
}
function tc(e, t) {
  return new Set((t || []).map((n) => n.tagId)).size !== 1 ? null : ec(e, t);
}
function nc({ mergeable: e, reviewable: t, tagEditable: n = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    n ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function $m(e, t) {
  return Uo(za(e, t));
}
function Ot(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function rc(e, t) {
  const n = (d) => Ot(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
    const c = /* @__PURE__ */ new Map();
    for (const m of d || []) {
      const p = n(m);
      c.has(p) || c.set(p, []), c.get(p).push(m);
    }
    return c;
  }, a = i(e), s = i(t), l = [];
  for (const [d, c] of a) {
    const m = s.get(d);
    if (!m || c.length !== m.length)
      continue;
    const p = [...c].sort(o), y = [...m].sort(o);
    p.forEach((h, f) => l.push({
      sourceSlotDefinitionId: h.id,
      derivedSlotDefinitionId: y[f].id
    }));
  }
  return l;
}
function oc(e, t, n) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = rc(t, n);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function ic(e) {
  const t = Ot(e), n = Number(e == null ? void 0 : e.performerId), o = n > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${n}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(Jr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function Jr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function Hr(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const n of e)
    Object.hasOwn(t, n.reviewState) && (t[n.reviewState] += 1);
  return t;
}
function Ui(e) {
  const t = [], n = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((m) => m.end <= s && m.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: n,
    counts: Hr(o),
    trackCount: Math.max(1, t.length)
  };
}
function ac(e) {
  const t = e.map(Ot), n = /* @__PURE__ */ new Map();
  for (const i of t) n.set(i, (n.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), n.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function sc(e, t) {
  const n = e.segments.map((l) => {
    const d = t.get(l.id) || [], m = d.length > 0 && d.every((p) => Number(p.performerId) > 0) ? d.map((p) => `${p.slotDefinitionId}:${Number(p.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: m };
  }), o = [...new Set(n.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [Ui({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
  const i = o.map((l) => n.find((d) => d.signature === l).slots), a = new Set((i[0] || []).filter((l) => i.every((d) => d.some((c) => String(c.slotDefinitionId) === String(l.slotDefinitionId) && Number(c.performerId) === Number(l.performerId)))).map((l) => String(l.slotDefinitionId))), s = /* @__PURE__ */ new Map();
  for (const l of n) {
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
        const c = ac(l.slots), m = l.slots.filter((b) => !a.has(String(b.slotDefinitionId))), p = o.length === 1 ? l.slots : m, y = p.map((b) => `${c.get(String(b.slotDefinitionId))} · ${b.performerName || `Performer ${b.performerId}`}`).join(" · "), h = [...new Map(p.map((b) => [
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
          performerLabel: y,
          performers: h,
          performerAssignments: f,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(Ui);
}
function hn(e, t = [], n = []) {
  const o = /* @__PURE__ */ new Map();
  for (const [s, l] of t.entries())
    for (const d of l.tags || [])
      o.set(d.tagId, {
        segmentGroupId: l.id,
        segmentGroupName: l.name,
        segmentGroupColor: l.color ?? null,
        segmentGroupSortOrder: s,
        segmentGroupTagSortOrder: d.sortOrder,
        tagSortName: d.tagSortName || null
      });
  const i = /* @__PURE__ */ new Map();
  for (const s of e) {
    const l = s.tagName || "Tag segment", d = s.tagId == null ? `name:${l}` : `tag:${s.tagId}`;
    if (!i.has(d)) {
      const m = o.get(s.tagId);
      i.set(d, {
        key: d,
        tagId: s.tagId,
        label: l,
        // A segment shown with a new tag has no sort name yet; the group catalog knows it.
        tagSortName: s.tagSortName || (m == null ? void 0 : m.tagSortName) || null,
        segmentGroupId: (m == null ? void 0 : m.segmentGroupId) ?? null,
        segmentGroupName: (m == null ? void 0 : m.segmentGroupName) ?? null,
        segmentGroupColor: (m == null ? void 0 : m.segmentGroupColor) ?? null,
        segmentGroupSortOrder: (m == null ? void 0 : m.segmentGroupSortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (m == null ? void 0 : m.segmentGroupTagSortOrder) ?? Number.MAX_SAFE_INTEGER,
        segments: []
      });
    }
    i.get(d).segments.push(s);
  }
  const a = /* @__PURE__ */ new Map();
  for (const s of n || [])
    a.has(s.segmentId) || a.set(s.segmentId, []), a.get(s.segmentId).push(s);
  for (const s of a.values())
    s.sort((l, d) => l.sortOrder - d.sortOrder || String(l.slotDefinitionId).localeCompare(String(d.slotDefinitionId)));
  return [...i.values()].sort((s, l) => s.segmentGroupSortOrder - l.segmentGroupSortOrder || s.segmentGroupTagSortOrder - l.segmentGroupTagSortOrder || (s.tagSortName || s.label).localeCompare(l.tagSortName || l.label, void 0, {
    sensitivity: "base"
  }) || s.key.localeCompare(l.key)).flatMap((s) => sc(s, a));
}
function Ko(e) {
  var n;
  const t = [];
  for (const o of e) {
    const i = o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`;
    let a = t.at(-1);
    (!a || a.key !== i) && (a = {
      key: i,
      id: o.segmentGroupId,
      name: o.segmentGroupName || "Ungrouped",
      color: o.segmentGroupColor ?? null,
      lanes: [],
      counts: { unreviewed: 0, approved: 0, rejected: 0 }
    }, t.push(a)), a.lanes.push(o);
    for (const s of Et)
      a.counts[s] += Number((n = o.counts) == null ? void 0 : n[s]) || 0;
  }
  return t;
}
function Ha(e) {
  return (e || []).some((t) => t.id != null);
}
const lc = {
  group: 38,
  lane: 33,
  segment: 41
};
function dc(e, t = []) {
  const n = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = lc[s.kind];
    o.push({ ...s, top: i, height: l }), i += l;
  };
  for (const s of e || [])
    if (a({ kind: "group", key: `${s.key}:header`, group: s }), !n.has(s.key))
      for (const l of s.lanes || []) {
        a({ kind: "lane", key: `${l.key}:label`, group: s, lane: l });
        for (const d of l.markers || [])
          a({ kind: "segment", key: `segment:${d.segment.id}`, group: s, lane: l, segment: d.segment });
      }
  return { rows: o, height: i };
}
function qa(e, t, n, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(n)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function cc(e, t = [], n = !0) {
  const o = new Set(t || []), i = [];
  let a = 0;
  const s = (l, d) => {
    i.push({ ...l, top: a, height: d }), a += d;
  };
  for (const l of e || [])
    if (n && s({ kind: "group", key: `header:${l.key}`, group: l }, 32), !o.has(l.key))
      for (const [d, c] of (l.lanes || []).entries()) {
        const m = Math.max(1.75, c.trackCount * 1.25 + 0.5) * 16;
        s({ kind: "lane", key: c.key, group: l, lane: c, laneIndex: d }, m);
      }
  return { rows: i, height: a };
}
function uc(e, t) {
  const n = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => n.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: Hr(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return Ko(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: Hr(a)
    };
  });
}
function Wa(e, { nativeOnly: t = !1 } = {}) {
  const n = (e || []).flatMap((i) => i.lanes || []);
  if (n.length !== 1 || (n[0].markers || []).length < 2) return null;
  const o = n[0].markers.map(({ segment: i }) => i).sort((i, a) => i.startSec - a.startSec || (i.nativeSegmentId ?? i.itemId ?? i.id) - (a.nativeSegmentId ?? a.itemId ?? a.id));
  return t && o.some((i) => i.nativeSegmentId == null) || !t && new Set(o.map((i) => i.nativeSegmentId != null ? "native" : "extension")).size !== 1 ? null : {
    lane: n[0],
    segments: o,
    startSec: o[0].startSec,
    endSec: Math.max(...o.map((i) => i.endSec ?? i.startSec))
  };
}
function Ki(e, t) {
  const n = new Set(t.removedSegmentIds || []), o = new Set(t.removedItemIds || []), i = t.survivor, a = (e.segments || []).filter((c) => !n.has(c.id)).map((c) => c.id === i.id ? { ...c, ...i } : c);
  a.some((c) => c.id === i.id) || a.push(i);
  const s = t.performerSlots == null ? e.performerSlots : (e.performerSlots || []).filter((c) => c.segmentId !== i.id && !n.has(c.segmentId)).concat(t.performerSlots), l = { ...e.performerSlotRevisions || {} };
  t.performerSlotRevisions != null && (delete l[i.id], n.forEach((c) => delete l[c]), Object.assign(l, t.performerSlotRevisions));
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
function ln(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function mr(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function mc(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var n;
    return (n = t[0]) == null ? void 0 : n.toUpperCase();
  }).join("") || "?";
}
function gr({ performer: e, compact: t = !1, tooltip: n = null }) {
  const o = Number(e == null ? void 0 : e.id) > 0;
  return r("span", {
    title: n || void 0,
    "aria-label": n || void 0,
    className: `relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted font-semibold text-secondary ${t ? "h-[1.125rem] w-[1.125rem] border-border text-[7px]" : `h-6 w-6 justify-self-end text-[8px] ${o ? "border-border" : "border-dashed border-amber-500/50"}`}`
  }, [
    r("span", {
      key: "fallback",
      "aria-hidden": "true",
      className: "flex h-full w-full items-center justify-center"
    }, o ? mc(e.name) : "—"),
    o ? r("img", {
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
function Va({ assignments: e, className: t = "" }) {
  return r("span", {
    className: `grid items-center gap-x-3 gap-y-1.5 ${t}`,
    style: { gridTemplateColumns: "minmax(4.5rem, auto) minmax(0, 1fr) 1.5rem" }
  }, (e || []).flatMap((n) => {
    var o;
    return [
      r("span", {
        key: `${n.key}:slot`,
        className: "truncate text-[10px] font-semibold uppercase tracking-wide text-secondary"
      }, n.label),
      r("span", {
        key: `${n.key}:performer`,
        className: "min-w-0 truncate text-xs text-foreground",
        title: n.title,
        "aria-label": n.title
      }, ((o = n.performer) == null ? void 0 : o.name) || "Unfilled"),
      r(gr, {
        key: `${n.key}:avatar`,
        performer: n.performer
      })
    ];
  }));
}
function Yr({ performers: e, performerAssignments: t, interactive: n = !0 }) {
  const o = ce(null), i = `performer-slots-${Pa()}`, [a, s] = G(null);
  function l() {
    var h;
    const c = (h = o.current) == null ? void 0 : h.getBoundingClientRect();
    if (!c) return;
    const m = Math.max(0, Math.min(256, window.innerWidth - 16)), p = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), y = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - m - 8, c.right - m)),
      top: y >= p + 8 ? c.bottom + 4 : Math.max(8, c.top - p - 4),
      width: m
    });
  }
  fe(() => {
    if (a)
      return window.addEventListener("scroll", l, !0), window.addEventListener("resize", l), () => {
        window.removeEventListener("scroll", l, !0), window.removeEventListener("resize", l);
      };
  }, [a != null, t == null ? void 0 : t.length]);
  const d = (t || []).map((c) => `${c.label}: ${c.performer.name}`).join(", ") || "Performer assignments";
  return n ? r("span", {
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
    ...e.slice(0, 3).map((c) => r(gr, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? nl(r("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, r(Va, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : r("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => r(gr, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function gc(e, t) {
  const n = new Set(ln(t));
  return (e || []).filter((o) => !n.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function Ja(e, t) {
  return t ? ln(e).filter((n) => n !== t) : ln(e);
}
function fc(e, t) {
  const n = ln(t), o = new Set(ln(e));
  return n.length > 0 && n.every((i) => o.has(i)) ? [] : n;
}
function Kt(e, t) {
  const n = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return n ? n.segmentGroupId == null ? "ungrouped" : `group:${n.segmentGroupId}` : null;
}
function zi(e, t, n) {
  const o = Number(n);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), m = Number.isFinite(c) && c >= d ? c : d, p = d <= o && m >= o, y = p ? 0 : Math.min(Math.abs(o - d), Math.abs(o - m));
    return { contains: p, distance: y, duration: m - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function No(e, t, n, o = null) {
  var m, p, y, h, f, b;
  const i = e.findIndex((x) => x.markers.some((I) => I.segment.id === t));
  if (i < 0) {
    const x = [...((m = e[0]) == null ? void 0 : m.markers) || []];
    return o != null && Number.isFinite(Number(o)) && x.sort((I, g) => zi(I, g, o)), ((p = x[0]) == null ? void 0 : p.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((x) => x.segment.id === t);
  if (n === "left" || n === "right") {
    const x = n === "left" ? -1 : 1, I = Math.min(a.markers.length - 1, Math.max(0, s + x));
    return ((y = a.markers[I]) == null ? void 0 : y.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (n === "up" ? -1 : 1))), d = Number((h = a.markers[s]) == null ? void 0 : h.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((f = a.markers[s]) == null ? void 0 : f.segment) ?? null : ((b = [...e[l].markers].sort(c ? (x, I) => zi(x, I, Number(o)) : (x, I) => Math.abs(x.segment.startSec - d) - Math.abs(I.segment.startSec - d) || x.segment.startSec - I.segment.startSec || x.segment.id - I.segment.id)[0]) == null ? void 0 : b.segment) ?? null;
}
function pc(e, t, n) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = No([o], t, n);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function yc(e, t, n) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + n))];
}
function bc(e, t, n) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(n) ? n : e[0];
}
function hc(e, t) {
  const n = Number(e);
  if (!Number.isFinite(n)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= n) return [qi(n)];
  const i = o - n, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(n, o - 1e-3);
  return [...new Set(a.map((l) => qi(Math.min(s, n + l))))];
}
function vc(e, t) {
  const n = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: n.length > 0 && n.every(i) ? "remove" : "collect",
    segments: n
  };
}
function Sc(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function an(e, t) {
  if (!e || !t) return e;
  const n = new Set(t.removedSegmentIds || []), o = new Map(
    (t.identityChanges || []).map((m) => [m.previousId, m.currentId])
  ), i = new Map(
    [...t.upsertedSegments || [], ...t.upsertedBasicSegments || []].map((m) => [m.id, m])
  ), a = (e.segments || []).filter((m) => !n.has(m.id)).map((m) => i.has(m.id) ? { ...m, ...i.get(m.id) } : m), s = new Set(a.map((m) => m.id));
  for (const m of i.values())
    s.has(m.id) || a.push(m);
  a.sort((m, p) => Number(m.startSec) - Number(p.startSec) || String(m.key || "").localeCompare(String(p.key || "")));
  const l = t.performerSlots != null ? new Set(i.keys()) : /* @__PURE__ */ new Set(), d = (e.performerSlots || []).filter((m) => !n.has(m.segmentId) || o.has(m.segmentId)).map((m) => o.has(m.segmentId) ? { ...m, segmentId: o.get(m.segmentId) } : m).filter((m) => !l.has(m.segmentId));
  t.performerSlots != null && d.push(...t.performerSlots);
  const c = {};
  for (const [m, p] of Object.entries(
    e.performerSlotRevisions || {}
  )) {
    const y = Number(m);
    if (n.has(y) && !o.has(y)) continue;
    const h = o.get(y) ?? y;
    l.has(h) || (c[h] = p);
  }
  return t.performerSlotRevisions != null && Object.assign(c, t.performerSlotRevisions), {
    ...e,
    approvedSetVersion: t.approvedSetVersion || e.approvedSetVersion,
    segments: a,
    performerSlots: d,
    performerSlotRevisions: c
  };
}
function _i(e, t, n) {
  const o = Array.isArray(e) ? e : [];
  if (!n) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function xc(e) {
  if (!Array.isArray(e)) return [];
  const t = [], n = /* @__PURE__ */ new Map();
  for (const o of e) {
    if (!o) continue;
    const i = String(o.tagName || "").trim() || "Tag segment";
    let a = n.get(i);
    a || (a = { tagName: i, examples: [] }, n.set(i, a), t.push(a)), a.examples.push(o);
  }
  return t;
}
async function kc(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const n = document.createElement("video");
  n.preload = "auto", n.muted = !0, n.playsInline = !0, n.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(n);
  try {
    if (n.src = `/api/stream/video/${encodeURIComponent(e)}`, await Hi(n, "loadeddata"), !n.videoWidth || !n.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = n.videoWidth, o.height = n.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], m = hc(
        d.startSec,
        d.endSec
      );
      for (const [p, y] of m.entries()) {
        Math.abs(n.currentTime - y) > 5e-4 && (n.currentTime = y, await Hi(n, "seeked")), i.drawImage(n, 0, 0, o.width, o.height);
        const h = await wc(o), f = `example-${l + 1}-frame-${p + 1}`;
        c.push({ fieldName: f, timestampSec: y }), s.push({
          fieldName: f,
          file: new File(
            [h],
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
    n.pause(), n.removeAttribute("src"), n.load(), n.remove();
  }
}
function Hi(e, t) {
  return t === "loadedmetadata" && e.readyState >= 1 || t === "loadeddata" && e.readyState >= 2 ? Promise.resolve() : new Promise((n, o) => {
    const i = setTimeout(
      () => l(
        o,
        new Error("Timed out while reading video frames.")
      ),
      3e4
    ), a = () => l(n), s = () => l(
      o,
      new Error("The video could not be decoded for frame capture.")
    ), l = (d, c) => {
      clearTimeout(i), e.removeEventListener(t, a), e.removeEventListener("error", s), d(c);
    };
    e.addEventListener(t, a, { once: !0 }), e.addEventListener("error", s, { once: !0 });
  });
}
function wc(e) {
  return new Promise((t, n) => {
    e.toBlob(
      (o) => o ? t(o) : n(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function qi(e) {
  return Math.round(e * 1e3) / 1e3;
}
function Tm(e, t, n) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...n } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Nc(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((n, o) => n.startSec - o.startSec || n.id - o.id)
  };
}
function Rm(e, t) {
  const n = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !n.has(o.id))
  };
}
function Em(e, t, n) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? n.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Am(e, t) {
  const n = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...n.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Fn(e, t, n, o) {
  const i = (n || []).map((d) => ({ ...d, segmentId: t })), a = e.performerSlots || [], s = a.findIndex((d) => d.segmentId === t), l = a.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...i), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function fo(e, t) {
  const n = e.performerSlots || [], o = e.performerSlotRevisions || {};
  if (!n.some((s) => s.segmentId === t) && !(t in o)) return e;
  const { [t]: i, ...a } = o;
  return {
    ...e,
    performerSlots: n.filter((s) => s.segmentId !== t),
    performerSlotRevisions: a
  };
}
function Ic(e, t) {
  const n = [...t || []].sort((s, l) => s.startSec - l.startSec || s.id - l.id), o = n[0];
  if (!o) return e;
  const i = new Set(n.slice(1).map((s) => s.id)), a = {
    ...o,
    startSec: n[0].startSec,
    endSec: Math.max(...n.map((s) => s.endSec ?? s.startSec)),
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
function Un(e, t) {
  return !e || !t ? !1 : e.itemId != null && e.itemId === t.itemId || e.nativeSegmentId != null && e.nativeSegmentId === t.nativeSegmentId ? !0 : e.id != null && e.id === t.id;
}
function Qr(e, t) {
  return (e || []).some((n) => (t || []).some((o) => Un(n, o)));
}
function pt(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function Ya(e, t) {
  return (e || []).find((n) => Un(t, n)) || null;
}
function Qa(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Cc(e, t) {
  var n;
  return ((n = e.running) == null ? void 0 : n.kind) === t;
}
function Mm(e) {
  return e.running != null || e.queued.length > 0;
}
const $c = /* @__PURE__ */ new Set(["segment", "split", "create", "duplicate", "review", "held-tag"]);
function zo(e) {
  return e.running ? [e.running, ...e.queued] : e.queued;
}
function Io(e) {
  return zo(e).some((t) => t.kind === "create" || t.kind === "duplicate");
}
function Ln(e) {
  return zo(e).some((t) => !$c.has(t.kind));
}
function Br(e) {
  return e != null && e.itemId == null && e.nativeSegmentId == null && e.id < 0;
}
function Tc(e, t) {
  if (Ln(e) || (t || []).some(Br)) return !0;
  const n = (t || []).map(pt);
  return zo(e).some((o) => Qr(o.targets, n));
}
const Wi = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
function Pr(e) {
  return Object.freeze({
    id: e.id,
    kind: e.kind,
    lockId: e.lockId,
    targets: e.targets,
    exclusive: e.exclusive,
    meta: e.meta
  });
}
function Rc({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let n = 1, o = null, i = [], a = null, s = !1, l = 0, d = 0;
  const c = () => !t && d < l, m = /* @__PURE__ */ new Map();
  let p = Wi;
  const y = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set();
  let f = [];
  function b() {
    p = o == null && i.length === 0 && a == null ? Wi : Object.freeze({
      running: o ? Pr(o) : null,
      queued: Object.freeze(i.map(Pr)),
      lastFailure: a
    });
    for (const w of [...h]) w();
    if (o == null && i.length === 0) {
      const w = f;
      f = [];
      for (const C of w) C();
    }
  }
  function x(w, C) {
    y.set(w.id, C.status), w.resolve(C);
  }
  function I(w) {
    if (w.dependsOn == null) return "met";
    const C = y.get(w.dependsOn);
    return C === "fulfilled" ? "met" : C != null ? "failed" : "pending";
  }
  function g(w) {
    o = w;
    const C = { ...e(), taskId: w.id, targets: w.targets };
    C.resolveTargets = () => w.targets.map((M) => Ya(C.segments, M)).filter(Boolean), b();
    let A;
    try {
      A = w.run(C);
    } catch (M) {
      A = Promise.reject(M);
    }
    Promise.resolve(A).then(
      (M) => O(w, { status: "fulfilled", value: M }),
      (M) => O(w, { status: "rejected", error: M })
    );
  }
  function O(w, C) {
    w.settled || (w.settled = !0, x(w, C), !s && (o = null, C.status === "rejected" && (a = Object.freeze({ id: w.id, kind: w.kind, error: C.error })), b(), l += 1, t && J()));
  }
  function J() {
    if (s || o != null || c()) return;
    let w = !1;
    for (let C = 0; C < i.length; C += 1) {
      const A = i[C], M = I(A);
      if (M === "failed") {
        i = i.filter((T) => T !== A), x(A, { status: "dropped", reason: "dependency-failed" }), w = !0, C -= 1;
        continue;
      }
      if (M !== "pending" && !(A.exclusive && C > 0) && !i.slice(0, C).some((T) => Qr(T.targets, A.targets)) && !(A.ready && !A.ready(e(), Pr(A)))) {
        i = i.filter((T) => T !== A), g(A);
        return;
      }
    }
    w && b();
  }
  function Y(w) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((_) => _.exclusive) || o != null && w.whenBusy !== "enqueue" || w.exclusive && (o != null || i.length > 0 || c())) return null;
    let A;
    const M = new Promise((_) => {
      A = _;
    }), T = {
      id: n++,
      kind: w.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: w.lockId ?? -1,
      targets: Object.freeze((w.targets || []).map(L)),
      exclusive: w.exclusive === !0,
      dependsOn: w.dependsOn ?? null,
      ready: w.ready || null,
      meta: w.meta ?? null,
      run: w.run,
      resolve: A
    };
    return i = [...i, T], b(), J(), { id: T.id, done: M };
  }
  function P(w = {}) {
    let C = null;
    const A = Y({
      ...w,
      whenBusy: "reject",
      run: () => new Promise((T) => {
        C = T;
      })
    });
    if (!A) return null;
    if (C == null)
      return S((T) => T.id === A.id), null;
    let M = !1;
    return () => {
      M || (M = !0, C(), (o == null ? void 0 : o.id) === A.id && O(o, { status: "fulfilled", value: void 0 }));
    };
  }
  function L(w) {
    return (w == null ? void 0 : w.id) == null || w.itemId != null || w.nativeSegmentId != null ? w : m.get(w.id) || w;
  }
  function E(w, C) {
    m.set(w, { ...C });
    let A = !1;
    for (const M of i)
      M.targets.some((T) => T.id === w && T.itemId == null && T.nativeSegmentId == null) && (M.targets = Object.freeze(M.targets.map((T) => T.id === w ? { ...C } : T)), A = !0);
    return A && b(), A;
  }
  function S(w) {
    const C = i.filter((A) => w(Pr(A)));
    if (C.length === 0) return 0;
    i = i.filter((A) => !C.includes(A));
    for (const A of C) x(A, { status: "cancelled" });
    return b(), J(), C.length;
  }
  return {
    enqueue: Y,
    acquire: P,
    cancel: S,
    retarget: E,
    stableIdentity: L,
    // The host reads `settledCount()` while rendering and reports it here once that render commits.
    settledCount: () => l,
    markCommitted(w = l) {
      d = Math.max(d, w);
    },
    poke: () => J(),
    subscribe(w) {
      return h.add(w), () => h.delete(w);
    },
    getSnapshot: () => p,
    whenIdle() {
      return o == null && i.length === 0 ? Promise.resolve() : new Promise((w) => f.push(w));
    },
    dispose() {
      if (s) return;
      const w = i;
      i = [], s = !0;
      for (const A of w) x(A, { status: "cancelled" });
      h.clear();
      const C = f;
      f = [];
      for (const A of C) A();
    }
  };
}
let Ec = 1;
function Tt() {
  return `pending-${Ec++}`;
}
function Ac(e) {
  return e.sort((t, n) => t.startSec - n.startSec || t.id - n.id);
}
function Ur(e, t) {
  return (t || []).some((n) => Un(n, e));
}
function Mc(e, t) {
  return [...e || [], {
    id: t.id ?? Tt(),
    taskId: t.taskId ?? null,
    op: t.op,
    targets: t.targets || (t.segment ? [{ id: t.segment.id }] : []),
    values: t.values || null,
    segment: t.segment || null,
    meta: t.meta || null,
    settled: !1
  }];
}
function Xa(e, t) {
  return t && (e || []).find((n) => {
    var o;
    return ((o = n.meta) == null ? void 0 : o.kind) === "held-tag" && !n.settled && Ur(t, n.targets);
  }) || null;
}
function Dc(e) {
  return (e || []).filter((t) => t.op === "insert" && !t.settled).map((t) => t.segment);
}
function Za(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function es(e, t) {
  const n = (e || []).filter((o) => !Za(o, t));
  return n.length === (e || []).length ? e : n;
}
function ts(e, t) {
  let n = !1;
  const o = (e || []).map((i) => i.settled || !Za(i, t) ? i : (n = !0, { ...i, settled: !0, settledDetail: null }));
  return n ? o : e;
}
function Oc(e, t, n) {
  let o = !1;
  const i = (e || []).map((a) => a.targets.some((s) => s.id === t && s.itemId == null && s.nativeSegmentId == null) ? (o = !0, {
    ...a,
    targets: a.targets.map((s) => s.id === t ? { ...n } : s)
  }) : a);
  return o ? i : e;
}
function _o(e, t) {
  if (!t || t.length === 0) return e;
  let n = [...e || []];
  for (const o of t)
    if (o.op === "insert")
      n.some((i) => Un(o.segment, i)) || n.push(o.segment);
    else if (o.op === "patch")
      n = n.map((i) => Ur(i, o.targets) ? { ...i, ...o.values } : i);
    else if (o.op === "remove")
      n = n.filter((i) => !Ur(i, o.targets));
    else if (o.op === "merge") {
      const [i, ...a] = o.targets;
      n = n.filter((s) => !Ur(s, a)).map((s) => Un(i, s) ? { ...s, ...o.values } : s);
    }
  return Ac(n);
}
function ns(e, t) {
  if (!e || e.length === 0) return e;
  const n = [
    ...(t == null ? void 0 : t.segments) || [],
    ...e.filter((a) => a.op === "insert" && !a.settled).map((a) => a.segment)
  ];
  let o = !1;
  const i = [];
  for (const a of e) {
    if (a.op !== "insert" && !a.targets.some((s) => n.some((l) => Un(s, l)))) {
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
function Pc(e, t, n) {
  return n ? es(e, t) : ts(e, t);
}
function Lc(e, t) {
  switch (t.type) {
    case "confirm":
      return Pc(e, t.key, t.applied);
    case "add":
      return Mc(e, t.entry);
    case "discard":
      return es(e, t.key);
    case "settle":
      return ts(e, t.key);
    case "retarget":
      return Oc(e, t.temporaryId, t.identity);
    case "prune":
      return ns(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
function Vi(e, t, n) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function jc(e) {
  const { acquireSaveLock: t, compatibilityMode: n, getRequestedSelectionId: o, dispatchPendingChanges: i, displayedSelectedSegment: a, enqueueSave: s, getSaveQueueSnapshot: l, pendingChanges: d, retargetSaveTasks: c, currentTime: m, detail: p, editorFilters: y, endInput: h, hideDerivedSegments: f, historyRef: b, mediaDuration: x, onConflict: I, onDetailChange: g, onReload: O, optimisticSegmentIdRef: J, pendingDuplicateRef: Y, pendingFirstSegmentStartSecRef: P, pendingTagEditSegmentIdRef: L, performerSlots: E, replaceSegmentSelection: S, savingSegmentId: w, segments: C, selectedSegment: A, selectedSegmentIdRef: M, selectedSegments: T, selectionAnchorIdRef: _, selectionRangeBaseIdsRef: ne, setCreatingSegmentId: U, setEditorFilters: re, setFirstSegmentTagOpen: pe, setHideDerivedSegments: ae, setHistory: Ne, setHistoryOpen: ye, setPublishApprovedError: Me, setSaveMessage: q, setSelectedSegmentGroupKey: Q, setSelectedSegmentId: ue, setSelectedSegmentIds: ve, setTagEditing: xe, startInput: be, tagEditingRef: z, timelineDuration: ke, video: se } = e;
  function N($) {
    b.current = $ || Qt, Ne(b.current);
  }
  async function j($, W, me, he, Z = null) {
    var Ke;
    try {
      const Te = await ee(`/videos/${se.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: b.current.revision,
          kind: $,
          label: W,
          beforeState: me,
          afterState: he,
          receiptId: Z
        })
      });
      return N(Te), !0;
    } catch (Te) {
      return Te.status === 409 && ((Ke = Te.payload) != null && Ke.current) && N(Te.payload.current), q("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function k($, W, me = !0, he = null, Z = !1, Ke = W, Te = !0) {
    if (!$ || Br($) || Ln(l())) return null;
    const [Ce = $] = _o([$], (d || []).filter((ot) => ot.op !== "insert")), Oe = Object.fromEntries(Object.entries(W).filter(([ot, Pe]) => Pe !== Ce[ot])), He = Z ? Tt() : null, gt = o == null ? void 0 : o();
    He && i({
      type: "add",
      entry: {
        id: He,
        op: "patch",
        targets: [pt($)],
        values: Ke === W ? Oe : Ke
      }
    });
    const Ge = s({
      kind: "segment",
      lockId: $.id,
      targets: [pt($)],
      whenBusy: "enqueue",
      // Save against the segment as it is when the task runs, so a save queued behind another
      // save of the same segment sends that save's revision.
      run: (ot) => {
        const [Pe] = ot.resolveTargets();
        if (!Pe)
          return He && i({ type: "discard", key: He }), q("The segment changed before its save could run."), null;
        const rt = Object.fromEntries(Object.keys(W).map((xt) => [xt, Pe[xt]]));
        return v(Pe, { ...rt, ...Oe }, {
          recordHistory: me,
          historyLabel: he,
          pendingChangeId: He,
          restoreSelectionOnFailure: Te,
          requestedSelectionId: gt
        });
      }
    });
    if (!Ge)
      return He && i({ type: "discard", key: He }), null;
    const ft = await Ge.done;
    return ft.status !== "fulfilled" ? (He && i({ type: "discard", key: He }), null) : ft.value ?? null;
  }
  async function v($, W, {
    recordHistory: me = !0,
    historyLabel: he = null,
    optimisticValues: Z = null,
    pendingChangeId: Ke = null,
    restoreSelectionOnFailure: Te = !0,
    // The selection when the edit was requested, which a queued save captures before it waits.
    requestedSelectionId: Ce = o == null ? void 0 : o(),
    onReload: Oe = O,
    onConflict: He = I
  } = {}) {
    var xt;
    const gt = T.map((lt) => lt.id), Ge = (A == null ? void 0 : A.id) ?? M.current, ft = me && !n ? crypto.randomUUID() : null;
    q(me ? "Saving directly to Cove…" : "Restoring history…");
    const ot = Ke ?? (Z ? Tt() : null);
    Z && !Ke && i({
      type: "add",
      entry: { id: ot, op: "patch", targets: [pt($)], values: Z }
    });
    const Pe = (lt) => {
      ot && i({ type: "confirm", key: ot, applied: lt });
    }, rt = async (lt) => {
      if (lt) {
        g((ht) => an(ht, lt), se.id), Pe(!0);
        return;
      }
      Pe(await Oe() != null);
    };
    try {
      if (n && $.nativeSegmentId == null && $.itemId != null) {
        const it = `draft-update:${se.id}:${$.itemId}:${$.revision}:${W.tagId}:${W.startSec}:${W.endSec ?? "open"}:${W.reviewState ?? $.reviewState}`, B = await ee(`/videos/${se.id}/drafts/${$.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ye(it),
            expectedRevision: $.revision,
            startSec: W.startSec,
            endSec: W.endSec,
            tagId: W.tagId,
            reviewState: W.reviewState
          })
        });
        Qe(it), B.performerSlots != null && g((le) => Fn(le, $.id, B.performerSlots, B.performerSlotRevision), se.id);
        const X = {
          ...$,
          ...B.draft,
          id: $.id,
          itemId: $.itemId
        };
        return me && await j(
          "segment.update",
          he || "Changed segment",
          Dr($, n),
          Dr(
            X,
            n
          )
        ), Vi($, W, n) ? await rt(B.editorDelta) : (g((le) => ({
          ...le,
          approvedSetVersion: B.approvedSetVersion || le.approvedSetVersion,
          segments: (le.segments || []).map((ge) => ge.id === $.id ? X : ge).sort((ge, de) => ge.startSec - de.startSec || ge.id - de.id)
        }), se.id), Pe(!0)), q(((xt = B.draft) == null ? void 0 : xt.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), X;
      }
      const { editorDelta: lt, ...ht } = await ee(`/videos/${se.id}/segments/${$.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...W,
          expectedUpdatedAt: $.updatedAt,
          historyReceiptId: ft
        })
      }), Ze = {
        ...$,
        ...ht,
        reviewState: W.reviewState ?? $.reviewState
      };
      return Vi($, W, n) ? await rt(lt) : (g((it) => ({
        ...it,
        segments: (it.segments || []).map((B) => B.id === $.id ? Ze : B).sort((B, X) => B.startSec - X.startSec || B.id - X.id)
      }), se.id), Pe(!0)), me && await j(
        "segment.update",
        he || "Changed segment",
        Dr($, n),
        Dr(
          Ze,
          n
        ),
        ft
      ), q(me ? "Saved to Cove" : "History restored"), Ze;
    } catch (lt) {
      return ot && i({ type: "discard", key: ot }), ot && Te && (o == null || o() === Ce) && (ve(gt), ue(Ge), _.current = Ge, ne.current = []), lt.status === 409 ? (q("Conflict — loading the latest segment…"), await He()) : q(lt.message || "Unable to save the segment."), null;
    }
  }
  async function u() {
    if (!n) return !1;
    const $ = C.filter((he) => !he.published && he.reviewState === "approved").length;
    if ($ === 0 || w != null) return !1;
    const W = `complete-review:${se.id}:${p.approvedSetVersion}`, me = t("publish", -1);
    if (!me) return !1;
    Me(""), q(`Publishing ${$} Approved draft${$ === 1 ? "" : "s"}…`);
    try {
      const he = await ee(`/videos/${se.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ye(W),
          expectedApprovedSetVersion: p.approvedSetVersion
        })
      });
      Qe(W), N(Qt), ye(!1);
      const Z = await O(), Ke = rd(
        C,
        M.current,
        he.published
      ), Te = Ke ? mt(Z == null ? void 0 : Z.segments, Ke) : null;
      return Te && ue(Te.id), q(`${he.published.length} Approved draft${he.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (he) {
      const Z = he.status === 409 ? "The approved drafts changed. Review the updated list and try again." : he.message || "Unable to publish the approved drafts.";
      return he.status === 409 && await I(), Me(Z), q(Z), !1;
    } finally {
      me();
    }
  }
  async function R($, W, me) {
    return $ ? (g((he) => an(he, $), se.id), an(W, $)) : me();
  }
  async function V($ = null, W = null) {
    const me = l();
    if (Ln(me) || Io(me) || ie()) return;
    const he = $ != null ? P.current : null, Z = Number.isFinite(he) ? he : m, Ke = Math.min(ke, Z + 20);
    if (Ke <= Z) {
      q("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const Te = Zl(C, A, $);
    if (Te.kind === "choose-tag") {
      P.current = Z, q(""), pe(!0);
      return;
    }
    if (Te.kind === "invalid-selection") {
      q("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: Ce } = Te, Oe = `create-draft:${se.id}:${Ce}:${Z}`, He = n ? null : crypto.randomUUID(), gt = M.current, Ge = {
      ...A || {},
      id: J.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: Ce,
      tagName: W || (A == null ? void 0 : A.tagName) || "Tag segment",
      tagSortName: Ce === (A == null ? void 0 : A.tagId) && (A == null ? void 0 : A.tagSortName) || null,
      startSec: Z,
      endSec: Ke,
      // Full mode creates manual drafts already approved; match it so a queued review toggles as displayed.
      reviewState: n ? "approved" : "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, ft = Nc(p, Ge), ot = Kt(
      hn(ft.segments, ft.segmentGroups || [], ft.performerSlots || []),
      Ge.id
    ), Pe = Tt(), rt = s({
      kind: "create",
      lockId: -1,
      whenBusy: "enqueue",
      run: (ht) => lt(ht)
    });
    if (!rt) return;
    i({ type: "add", entry: { id: Pe, taskId: rt.id, op: "insert", segment: Ge } }), pe(!1), Te.openTagEditor && (U(Ge.id), L.current = Ge.id, xe(!0)), S(Ge.id), Q(ot), (await rt.done).status === "cancelled" && (i({ type: "discard", key: Pe }), U(null), M.current === Ge.id && S(gt));
    async function lt({ detail: ht, onReload: Ze }) {
      var it;
      try {
        let B, X = null;
        if (n) {
          const de = await ee(`/videos/${se.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: Ye(Oe), tagId: Ce, startSec: Z, endSec: Ke })
          });
          Qe(Oe), B = { itemId: (it = de.draft) == null ? void 0 : it.itemId }, X = de.editorDelta ?? null, de.performerSlots != null && !X && g((De) => Fn(De, Ge.id, de.performerSlots, de.performerSlotRevision), se.id);
        } else
          B = { nativeSegmentId: (await ee(`/videos/${se.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: Ce,
              startSec: Z,
              endSec: Ke,
              historyReceiptId: He
            })
          })).id };
        P.current = null, pe(!1);
        const le = await R(X, ht, Ze);
        if (i({ type: "discard", key: Pe }), !le) {
          g((de) => fo(de, Ge.id), se.id), M.current === Ge.id && S(gt), q(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${Te.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const ge = mt(le == null ? void 0 : le.segments, B);
        ge ? (i({ type: "retarget", temporaryId: Ge.id, identity: pt(ge) }), c(Ge.id, pt(ge)), Te.openTagEditor && (z.current && (L.current = ge.id), U(ge.id)), M.current === Ge.id && (S(ge.id), Q(Kt(
          hn(le.segments || [], le.segmentGroups || [], le.performerSlots || []),
          ge.id
        ))), n || await j(
          "segment.create",
          "Created segment",
          jt([], !1),
          jt([ge], !1),
          He
        )) : (xe(!1), q(`Segment created, but it could not be selected${Te.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (B) {
        throw i({ type: "discard", key: Pe }), g((X) => fo(X, Ge.id), se.id), M.current === Ge.id && S(gt), $ != null && pe(!0), q(B.message || "Unable to create the draft."), B;
      } finally {
        U(null);
      }
    }
  }
  function ie() {
    return Xa(d, A) ? (q("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function te() {
    if (T.length !== 1 || !A || Br(A) || Ln(l()) || ie()) return;
    const $ = (a == null ? void 0 : a.id) === A.id ? a : A, W = m;
    if (W <= $.startSec || $.endSec != null && W >= $.endSec) {
      q("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const me = pt(A), he = {
      ...$,
      id: J.current--,
      itemId: null,
      nativeSegmentId: null,
      startSec: W,
      endSec: $.endSec,
      revision: 0,
      updatedAt: null
    }, Z = Tt(), Ke = Tt();
    i({ type: "add", entry: { id: Z, op: "patch", targets: [me], values: { endSec: W } } }), i({ type: "add", entry: { id: Ke, op: "insert", segment: he } });
    const Te = () => {
      i({ type: "discard", key: Z }), i({ type: "discard", key: Ke });
    }, Ce = s({
      kind: "split",
      lockId: A.id,
      targets: [me],
      whenBusy: "enqueue",
      run: (gt) => He(gt)
    });
    if (!Ce) {
      Te();
      return;
    }
    (await Ce.done).status !== "fulfilled" && Te();
    async function He({ detail: gt, resolveTargets: Ge, onReload: ft, onConflict: ot }) {
      var ht;
      const [Pe] = Ge();
      if (!Pe || W <= Pe.startSec || Pe.endSec != null && W >= Pe.endSec) {
        Te(), q(Pe ? "The segment changed before the split could run; move the playhead inside it and split again." : "The segment changed before the split could run.");
        return;
      }
      const rt = `split-draft:${Pe.itemId}:${Pe.revision}:${W}`, xt = n ? null : jt([Pe], !1), lt = n ? null : crypto.randomUUID();
      try {
        let Ze, it;
        if (n && Pe.nativeSegmentId == null) {
          const le = await ee(`/videos/${se.id}/drafts/${Pe.itemId}/split`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ye(rt),
              expectedRevision: Pe.revision,
              splitSec: W
            })
          });
          Qe(rt), Ze = { itemId: (ht = le.createdDraft) == null ? void 0 : ht.itemId }, it = le.editorDelta ?? null;
        } else {
          const le = await ee(`/videos/${se.id}/segments/${Pe.id}/split`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: Pe.updatedAt,
              splitSec: W,
              historyReceiptId: lt
            })
          });
          Ze = { nativeSegmentId: le.id }, it = le.editorDelta ?? null;
        }
        const B = await R(it, gt, ft), X = mt(B == null ? void 0 : B.segments, Ze);
        if (X ? (i({ type: "retarget", temporaryId: he.id, identity: pt(X) }), c(he.id, pt(X)), M.current === he.id && S(X.id)) : M.current === he.id && S(Pe.id), i({ type: "confirm", key: Z, applied: B != null }), i({ type: "discard", key: Ke }), !n) {
          const le = [
            mt(B == null ? void 0 : B.segments, {
              nativeSegmentId: Pe.nativeSegmentId ?? Pe.id
            }),
            X
          ].filter(Boolean);
          await j(
            "segment.split",
            "Split segment",
            xt,
            jt(le, !1),
            lt
          );
        }
        q(n ? `Segment split; both ranges remain ${Pe.reviewState}.` : "Segment split.");
      } catch (Ze) {
        Te(), M.current === he.id && S(Pe.id), Ze.status === 409 ? await ot() : q(Ze.message || "Unable to split the draft.");
      }
    }
  }
  async function je($ = !1) {
    const W = l();
    if (T.length !== 1 || !A || Br(A) || Ln(W) || Io(W) || ie()) return;
    const me = $ ? m : ((a == null ? void 0 : a.id) === A.id ? a : A).startSec, he = n ? null : crypto.randomUUID(), Z = A, Ke = M.current, Te = (a == null ? void 0 : a.id) === Z.id ? a : Z, Ce = Te.endSec == null ? null : Te.endSec - Te.startSec, Oe = {
      ...Z,
      id: J.current--,
      itemId: null,
      nativeSegmentId: null,
      startSec: me,
      endSec: Ce == null ? null : me + Ce,
      // Full mode creates the copy as an approved draft, even from a published segment; match it so a
      // queued review toggles as displayed and the copy waits for Publish approved like other drafts.
      reviewState: n ? "approved" : Z.reviewState,
      published: n ? !1 : Z.published,
      revision: 0,
      updatedAt: null
    }, He = (E || []).filter((rt) => rt.segmentId === Z.id), gt = Tt(), Ge = () => {
      i({ type: "discard", key: gt }), He.length > 0 && g((rt) => fo(rt, Oe.id), se.id);
    }, ft = s({
      kind: "duplicate",
      lockId: -1,
      targets: [pt(Z)],
      whenBusy: "enqueue",
      run: (rt) => Pe(rt)
    });
    if (!ft) return;
    i({ type: "add", entry: { id: gt, taskId: ft.id, op: "insert", segment: Oe } }), He.length > 0 && g((rt) => Fn(rt, Oe.id, He), se.id), $ || (U(Oe.id), L.current = Oe.id, xe(!0)), S(Oe.id), (await ft.done).status === "cancelled" && (Ge(), U(null), M.current === Oe.id && S(Ke));
    async function Pe({ detail: rt, resolveTargets: xt, onReload: lt, onConflict: ht }) {
      var B, X;
      const [Ze] = xt(), it = Ze ? Xl(se.id, Ze, $, me) : null;
      try {
        if (!Ze) throw new Error("The segment changed before the duplicate could run.");
        const le = ((B = Y.current) == null ? void 0 : B.operationKey) === it ? Y.current : null;
        let ge = (le == null ? void 0 : le.duplicateIdentity) ?? null, de = null;
        if (ge == null && n) {
          const Le = Ze.nativeSegmentId == null ? `/videos/${se.id}/drafts/${Ze.itemId}/duplicate` : `/videos/${se.id}/segments/${Ze.nativeSegmentId}/duplicate-draft`, tt = await ee(Le, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ye(it),
              ...Ze.nativeSegmentId == null ? { expectedRevision: Ze.revision } : { expectedUpdatedAt: Ze.updatedAt },
              startSec: $ ? me : null
            })
          });
          ge = Ai(!1, tt), de = tt.editorDelta ?? null, Y.current = { operationKey: it, duplicateIdentity: ge };
        } else if (ge == null) {
          const Le = await ee(`/videos/${se.id}/segments/${Ze.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: Ze.updatedAt,
              startSec: $ ? me : null,
              historyReceiptId: he
            })
          });
          ge = Ai(!0, Le), Y.current = { operationKey: it, duplicateIdentity: ge };
        }
        const De = await R(de, rt, lt);
        Ge();
        const Ee = mt(De == null ? void 0 : De.segments, ge);
        if (!Ee) {
          M.current === Oe.id && (xe(!1), S(Ke)), q(De ? "Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection." : "Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.");
          return;
        }
        i({ type: "retarget", temporaryId: Oe.id, identity: pt(Ee) }), c(Oe.id, pt(Ee));
        const Xe = ba(
          Ee,
          De.performerSlots || [],
          y,
          f,
          De.segmentGroups || []
        );
        re(Xe.filters), ae(Xe.hideDerivedSegments), !$ && z.current && (L.current = Ee.id), M.current === Oe.id && (S(Ee.id), Q(Kt(
          hn(De.segments || [], De.segmentGroups || [], De.performerSlots || []),
          Ee.id
        ))), n && Qe(it), Y.current = null, q($ ? "Duplicate created at the playhead." : "Duplicate created in place."), n || await j(
          "segment.duplicate",
          "Duplicated segment",
          jt([], !1),
          jt([Ee], !1),
          he
        );
      } catch (le) {
        throw Ge(), M.current === Oe.id && (xe(!1), S(Ke)), it != null && ((X = Y.current) == null ? void 0 : X.operationKey) === it ? q("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : le.status === 409 ? await ht() : q(le.message || "Unable to duplicate the draft."), le;
      } finally {
        U(null);
      }
    }
  }
  async function H() {
    if (T.length !== 1 || !A) return;
    const $ = Number(be), W = h.trim() === "" ? null : Number(h), me = ki($, W, x);
    if (me.error) {
      q(me.error);
      return;
    }
    const he = (a == null ? void 0 : a.id) === A.id ? a : A;
    if ($ === he.startSec && W === he.endSec) {
      q("Timing is unchanged.");
      return;
    }
    await k(A, { startSec: $, endSec: W, tagId: he.tagId }, !0, null, !0);
  }
  async function F($, W) {
    if (T.length !== 1 || !A) return;
    const me = ki($, W, x);
    if (me.error) {
      q(me.error);
      return;
    }
    const he = (a == null ? void 0 : a.id) === A.id ? a : A;
    if ($ === he.startSec && W === he.endSec) {
      q("Timing is unchanged.");
      return;
    }
    await k(A, { startSec: $, endSec: W, tagId: he.tagId }, !0, null, !0);
  }
  return { acceptHistory: N, recordHistoryAction: j, mutateSegment: k, runSegmentMutation: v, completeReview: u, createSegment: V, splitSegment: te, duplicateSegment: je, saveTiming: H, applyShortcutTiming: F };
}
function Fc() {
  const [e, t] = G(() => typeof window < "u" && window.matchMedia(vi).matches);
  return fe(() => {
    if (typeof window > "u") return;
    const n = window.matchMedia(vi), o = () => t(n.matches);
    return o(), n.addEventListener("change", o), () => n.removeEventListener("change", o);
  }, []), e;
}
function Gc() {
  const [e, t] = G(() => typeof window < "u" && window.matchMedia(Si).matches);
  return fe(() => {
    if (typeof window > "u") return;
    const n = window.matchMedia(Si), o = () => t(n.matches);
    return o(), n.addEventListener("change", o), () => n.removeEventListener("change", o);
  }, []), e;
}
function Bc() {
  try {
    return wl(window.localStorage.getItem(aa));
  } catch {
    return { ...Mt };
  }
}
function Uc() {
  try {
    return ln(JSON.parse(window.localStorage.getItem(sa) || "[]"));
  } catch {
    return [];
  }
}
function Kc(e) {
  try {
    window.localStorage.setItem(sa, JSON.stringify(ln(e)));
  } catch {
  }
}
function zc(e) {
  try {
    window.localStorage.setItem(aa, JSON.stringify(e));
  } catch {
  }
}
function _c() {
  try {
    const e = JSON.parse(window.localStorage.getItem(da) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Hc(e) {
  try {
    return window.localStorage.setItem(da, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function qc({ status: e }) {
  const t = Ka[e];
  return t ? r("span", {
    "aria-label": `Slot status: ${e}`,
    className: "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: {
      borderColor: t.color,
      backgroundColor: t.backgroundColor,
      color: "var(--color-foreground)"
    }
  }, "Slots unfilled") : null;
}
function sn({ counts: e }) {
  return r("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, Et.map((t) => r("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...Ba(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${zt[t].symbol}${e[t]}`)));
}
function Wc({ videoId: e, segmentId: t, itemId: n, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: m, shortcutRef: p }) {
  const y = Po(a), [h, f] = G(() => go(o, y)), [b, x] = G(!1), [I, g] = G(""), O = ce(!1), J = o.map((w) => `${w.slotDefinitionId}:${w.performerId || ""}`).join("|"), Y = y.map((w) => yt(w)).join("|"), P = Ea(
    o,
    y
  );
  fe(() => {
    f(go(o, y)), g("");
  }, [t, n, J, Y]);
  async function L(w = h) {
    if (!O.current) {
      O.current = !0, x(!0), g("Saving performer slots…");
      try {
        const C = go(o.map((T) => ({
          ...T,
          performerId: w[T.slotDefinitionId] || null
        })), y), A = o.map((T) => {
          const _ = C[T.slotDefinitionId] ? Number(C[T.slotDefinitionId]) : null, ne = y.find((U) => String(yt(U)) === String(_));
          return {
            ...T,
            performerId: _,
            performerName: (ne == null ? void 0 : ne.name) || null
          };
        });
        if (s(A) === !1) {
          g("");
          return;
        }
        const M = await ee(n != null ? `/videos/${e}/drafts/${n}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((T) => ({ slotDefinitionId: T.slotDefinitionId, performerId: C[T.slotDefinitionId] ? Number(C[T.slotDefinitionId]) : null }))
          })
        });
        g("Performer slots saved."), await l(M, {
          beforeState: _r([{
            segmentId: t,
            itemId: n,
            revision: i,
            slots: o
          }]),
          afterState: _r([{
            segmentId: t,
            itemId: n,
            revision: M.revision,
            slots: M.slots || []
          }])
        });
      } catch (C) {
        d && await d(o, C), C.status === 409 ? (g("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : g(C.message || "Unable to save performer slots.");
      } finally {
        O.current = !1, x(!1);
      }
    }
  }
  function E(w, C) {
    g(`Option ${C + 1} applied; save to confirm.`), f({ ...h, ...w.assignments });
  }
  async function S(w) {
    const C = { ...h, ...w.assignments };
    f(C), await L(C);
  }
  return fe(() => {
    if (p)
      return p.current = (w) => O.current || !P[w] ? !1 : (S(P[w]), !0), () => {
        p.current = null;
      };
  }), r("div", { className: "space-y-2" }, [
    P.length ? r("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      r("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      r("div", { key: "options", className: "space-y-2" }, P.map((w, C) => r("button", {
        key: C,
        type: "button",
        disabled: b,
        onClick: () => E(w, C),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${C + 1}: ${w.description}`
      }, [
        r("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, C + 1),
        r("span", { key: "description" }, w.description)
      ]))),
      r("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${P.length} to apply and save`)
    ]) : null,
    r("div", { key: "slots", className: "grid gap-2" }, o.map((w) => r("label", { key: w.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      r("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Ot(w)),
      (w.genderHints || []).length ? r("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(w.genderHints || []).map(Jr).join(" · ")}`) : null,
      r("select", { key: "select", value: h[w.slotDefinitionId] || "", disabled: b, onChange: (C) => f({ ...h, [w.slotDefinitionId]: C.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        r("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Aa(y, y, w.genderHints).map((C) => r("option", { key: yt(C), value: yt(C) }, C.name))
      ])
    ]))),
    r("div", { key: "actions", className: "flex items-center gap-3" }, [r("button", { key: "save", ref: m, type: "button", disabled: b, onClick: () => L(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), r("span", { key: "message", role: "status", className: "text-xs text-secondary" }, I)])
  ]);
}
function Vc({ videoId: e, targets: t, performerCandidates: n, onSaved: o, onConflict: i, shortcutRef: a, acquireSaveLock: s = () => () => {
} }) {
  var L;
  const l = ((L = t[0]) == null ? void 0 : L.slots) || [], d = Po(n), c = Ea(
    l,
    d
  ), m = "__mixed__", p = () => Object.fromEntries(l.map((E, S) => {
    const w = t.map((C) => {
      var A;
      return String(((A = C.slots[S]) == null ? void 0 : A.performerId) || "");
    });
    return [E.slotDefinitionId, w.every((C) => C === w[0]) ? w[0] : m];
  })), [y, h] = G(p), [f, b] = G(!1), [x, I] = G(""), g = ce(!1), O = t.map((E) => `${E.itemId ?? `native:${E.segmentId}`}:${E.revision}:${E.slots.map((S) => `${S.slotDefinitionId}:${S.performerId || ""}`).join(",")}`).join("|");
  fe(() => {
    h(p());
  }, [O]);
  async function J(E = y) {
    if (g.current) return;
    const S = s();
    if (!S) {
      I("Wait for the current save to finish before saving performer slots.");
      return;
    }
    g.current = !0, b(!0), I(`Saving performer slots for ${t.length} segments…`);
    const w = [];
    try {
      for (const C of t) {
        const A = C.slots.map((T, _) => {
          const ne = E[l[_].slotDefinitionId];
          return {
            slotDefinitionId: T.slotDefinitionId,
            performerId: ne === m ? T.performerId || null : ne ? Number(ne) : null
          };
        }), M = await ee(C.itemId != null ? `/videos/${e}/drafts/${C.itemId}/slots` : `/videos/${e}/segments/${C.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: C.revision, assignments: A })
        });
        w.push({
          segmentId: C.segmentId,
          itemId: C.itemId,
          revision: M.revision,
          slots: M.slots || []
        });
      }
      I("Performer slots saved."), await o({
        beforeState: _r(t),
        afterState: _r(w)
      });
    } catch (C) {
      const A = await i();
      C.status === 409 ? I(A ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : I(C.message || (A ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      g.current = !1, b(!1), S();
    }
  }
  function Y(E, S) {
    I(`Option ${S + 1} applied; save to confirm.`), h({ ...y, ...E.assignments });
  }
  async function P(E) {
    const S = { ...y, ...E.assignments };
    h(S), await J(S);
  }
  return fe(() => {
    if (a)
      return a.current = (E) => g.current || !c[E] ? !1 : (P(c[E]), !0), () => {
        a.current = null;
      };
  }), r("div", { className: "space-y-3" }, [
    r(
      "p",
      { key: "scope", className: "text-xs text-secondary" },
      `Changes apply to all ${t.length} selected segments. Mixed values remain unchanged unless replaced.`
    ),
    c.length ? r("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      r("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      r("div", { key: "options", className: "space-y-2" }, c.map((E, S) => r("button", {
        key: S,
        type: "button",
        disabled: f,
        onClick: () => Y(E, S),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${S + 1} to all selected segments: ${E.description}`
      }, [
        r("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, S + 1),
        r("span", { key: "description" }, E.description)
      ]))),
      r("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${c.length} to apply and save across the selection`)
    ]) : null,
    r("div", { key: "slots", className: "grid gap-2" }, l.map((E) => r("label", {
      key: E.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      r("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Ot(E)),
      r("select", {
        key: "select",
        value: y[E.slotDefinitionId] || "",
        disabled: f,
        onChange: (S) => h({ ...y, [E.slotDefinitionId]: S.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        y[E.slotDefinitionId] === m ? r("option", { key: "mixed", value: m }, "Mixed — leave unchanged") : null,
        r("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Aa(d, d, E.genderHints).map((S) => r("option", {
          key: yt(S),
          value: yt(S)
        }, S.name))
      ])
    ]))),
    r("div", { key: "actions", className: "flex items-center gap-3" }, [
      r("button", {
        key: "save",
        type: "button",
        disabled: f,
        onClick: () => J(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      r("span", { key: "message", role: "status", className: "text-xs text-secondary" }, x)
    ])
  ]);
}
function _t(e, t = null) {
  const n = String(e || "").trim().toLowerCase();
  return n === "ext:segment-studio:stash-marker-studio" || n === "stash-marker-studio" || n === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : n === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : n === "segment-studio/user" || n === "user" ? "Manual" : n === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : n === "tpdb" ? "TPDB" : n ? n.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function Jc(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const n = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (n.length === 0) return _t(t);
  const o = [...new Set(n.map((i) => _t(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function Xr() {
  return r("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function Lr({ name: e }) {
  const t = {
    filter: [
      r("path", { key: "shape", d: "M3 5h18l-7 8v5l-4 2v-7L3 5Z" })
    ],
    keyboard: [
      r("rect", { key: "frame", x: "3", y: "6", width: "18", height: "12", rx: "2" }),
      r("path", { key: "keys", d: "M7 10h.01M11 10h.01M15 10h.01M19 10h.01M7 14h.01M11 14h6" })
    ],
    history: [
      r("path", { key: "shape", d: "M3 12a9 9 0 1 0 3-6.7L3 8" }),
      r("path", { key: "arrow", d: "M3 3v5h5M12 7v5l3 2" })
    ],
    list: [
      r("path", { key: "rows", d: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" })
    ]
  };
  return r("svg", {
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
function Yc({ hidden: e }) {
  return r("span", { className: "flex items-center gap-0.5", "aria-hidden": "true" }, [
    r("svg", {
      key: "eye",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.8,
      className: "h-4 w-4"
    }, [
      r("path", { key: "outline", d: "M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" }),
      r("circle", { key: "pupil", cx: 12, cy: 12, r: 2.5 }),
      e ? r("path", { key: "slash", d: "M4 4l16 16" }) : null
    ]),
    r(Xr, { key: "derived" })
  ]);
}
function Qc({ segment: e, provenance: t }) {
  var m;
  const [n, o] = G(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = Jc(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
  return r("section", { "aria-label": "Segment provenance", className: "rounded-md border border-border bg-surface" }, [
    r("button", {
      key: "toggle",
      type: "button",
      onClick: () => o((p) => !p),
      "aria-expanded": n,
      "aria-controls": l,
      className: "flex w-full min-w-0 items-center gap-2 px-2 py-1.5 text-left"
    }, [
      r("span", { key: "chevron", "aria-hidden": "true", className: "w-3 shrink-0 text-[10px] text-secondary" }, n ? "▼" : "▶"),
      r("span", { key: "heading", className: "shrink-0 text-[11px] font-semibold text-foreground" }, "Provenance"),
      r(
        "span",
        { key: "summary", className: "min-w-0 flex-1 truncate text-right text-[11px] text-secondary" },
        `${d}${c}`
      )
    ]),
    n ? r(
      "div",
      { key: "details", id: l, className: "space-y-2 border-t border-border px-3 py-2" },
      a.loading ? r("p", { className: "text-xs text-secondary" }, "Loading provenance…") : a.error ? r("p", { className: "text-xs text-secondary" }, a.error) : s.length === 0 ? r(
        "p",
        { className: "text-xs text-secondary" },
        (m = e.sourceKey) != null && m.includes("stash-marker-studio") ? "Imported from Stash Marker Studio. Detailed run and model information was not recorded for this legacy segment." : "No detailed provenance was recorded for this segment."
      ) : s.map((p) => {
        const y = p.modelIdentifier || p.modelKey, h = p.value == null ? null : typeof p.value == "string" ? p.value : JSON.stringify(p.value);
        return r("div", { key: p.id || `${p.fieldKey}:${p.sourceKey}:${p.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          r(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            _t(p.sourceKey, p.sourceDisplayName)
          ),
          p.fieldKey ? r(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${p.fieldKey}${h == null ? "" : ` · ${h}`}`
          ) : null,
          p.relation === "inherited" ? r("div", { key: "relation", className: "text-secondary" }, "Inherited origin") : null,
          y ? r(
            "div",
            { key: "model", className: "text-secondary" },
            `Model ${y}${p.modelVersion ? ` · ${p.modelVersion}` : ""}`
          ) : null,
          p.activityExternalRunId || p.sourceRunId ? r("div", { key: "run", className: "break-all text-secondary" }, `Run ${p.activityExternalRunId || p.sourceRunId}`) : null,
          p.confidence != null ? r(
            "div",
            { key: "confidence", className: "text-secondary" },
            `Confidence ${Math.round(p.confidence * 100)}%`
          ) : null,
          p.recordedAt || p.createdAt ? r("div", { key: "recorded", className: "text-secondary" }, `Recorded ${p.recordedAt || p.createdAt}`) : null
        ]);
      })
    ) : null
  ]);
}
function Xc({
  selectedGroups: e,
  selectedSegments: t,
  activeSegmentId: n,
  detailPanelRef: o,
  onReduceSelection: i,
  reviewable: a,
  tagEditable: s,
  slotsEditable: l,
  onEditSlots: d,
  slotButtonRef: c,
  saveMessage: m
}) {
  const [p, y] = G([]), h = e.flatMap((I) => I.lanes.map((g) => g.key)), f = h.join("|");
  fe(() => {
    const I = new Set(h);
    y((g) => g.filter((O) => I.has(O)));
  }, [f]);
  const b = Hr(t), x = !!Wa(
    e,
    { nativeOnly: !a }
  );
  return r("section", {
    ref: o,
    tabIndex: -1,
    "aria-label": "Selected segment details",
    className: "min-h-0 space-y-3 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    r("header", { key: "summary", className: "space-y-1" }, [
      r(
        "div",
        { key: "title", className: "text-sm font-semibold text-foreground" },
        `${t.length} segments selected`
      ),
      r(
        "div",
        { key: "scope", className: "text-xs text-secondary" },
        `${h.length} swimlane${h.length === 1 ? "" : "s"} · ${e.length} group${e.length === 1 ? "" : "s"}`
      ),
      a ? r(sn, { key: "counts", counts: b }) : null
    ]),
    r(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      nc({ mergeable: x, reviewable: a, tagEditable: s, slotsEditable: l })
    ),
    l ? r("button", {
      key: "slots",
      ref: c,
      type: "button",
      onClick: d,
      className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/40"
    }, "Edit performer slots") : null,
    m ? r("p", {
      key: "save-message",
      role: "status",
      "aria-live": "polite",
      className: "text-xs text-secondary"
    }, m) : null,
    ...e.map((I) => r("section", {
      key: I.key,
      "data-selected-segment-group": I.key,
      className: "space-y-1.5"
    }, [
      r("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        r("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, I.name),
        r("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${I.selectedCount} selected`)
      ]),
      ...I.lanes.map((g) => {
        const O = p.includes(g.key), J = g.markers.some(({ segment: P }) => P.id === n), Y = `selected-segment-lane-${g.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return r("div", {
          key: g.key,
          "data-selected-segment-lane": g.key,
          className: `rounded-md border ${J ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          r("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": O,
            "aria-controls": Y,
            "aria-current": J ? "true" : void 0,
            onClick: () => y((P) => O ? P.filter((L) => L !== g.key) : [...P, g.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            r("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, O ? "▾" : "▸"),
            r("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, mr(g)),
            r("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(g.selectedCount)),
            a ? r(sn, { key: "states", counts: g.counts }) : null
          ]),
          O ? r("div", {
            key: "segments",
            id: Y,
            className: "space-y-1 border-t border-border p-1.5"
          }, g.markers.map(({ segment: P }) => {
            const L = P.endSec == null ? Fe(P.startSec) : `${Fe(P.startSec)} – ${Fe(P.endSec)}`;
            return r("button", {
              key: P.id,
              type: "button",
              onClick: () => i(P),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${P.id === n ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${P.tagName || "Segment"}, ${P.reviewState}, ${L}` : `${P.tagName || "Segment"}, ${L}`,
              "aria-current": P.id === n ? "true" : void 0
            }, [
              a ? r(Sn, {
                key: "state",
                state: P.reviewState,
                includeLabel: !1
              }) : null,
              P.isDerived ? r(Xr, { key: "derived" }) : null,
              r("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, L),
              r(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                _t(P.sourceKey)
              )
            ]);
          })) : null
        ]);
      })
    ]))
  ]);
}
const Wt = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"]
}, rs = "com.midnightrider.segment-studio", Zc = /* @__PURE__ */ new Set(["hasSegments"]), eu = /* @__PURE__ */ new Set(["segment_count", "unreviewed_count"]), tu = {
  EQUALS: "equals",
  NOT_EQUALS: "notEquals",
  GREATER_THAN: "greaterThan",
  LESS_THAN: "lessThan",
  INCLUDES: "includes",
  EXCLUDES: "excludes",
  INCLUDES_ALL: "includesAll",
  EXCLUDES_ALL: "excludesAll",
  IS_NULL: "isNull",
  NOT_NULL: "notNull",
  BETWEEN: "between",
  NOT_BETWEEN: "notBetween",
  MATCHES_REGEX: "matchesRegex",
  NOT_MATCHES_REGEX: "notMatchesRegex",
  UNDER_PATH: "underPath",
  NOT_UNDER_PATH: "notUnderPath"
};
function sr(e, t, n) {
  return { extensionId: rs, filterId: e, modifier: t, value: n };
}
function Ji(e) {
  return typeof e == "boolean" ? e : e === "has" ? !0 : e === "none" ? !1 : null;
}
function Yi(e) {
  const t = Wr(e == null ? void 0 : e.value), n = Wr(e == null ? void 0 : e.excludes), o = { INCLUDES_ALL: "includesall", EXCLUDES: "excludes", IS_NULL: "isnull", NOT_NULL: "notnull" }[e == null ? void 0 : e.modifier] ?? "includes";
  return o === "isnull" || o === "notnull" ? sr("segment-tags", o, {}) : t.length === 0 && (o === "excludes" || n.length === 0) ? null : sr("segment-tags", o, {
    ...t.length > 0 ? { value: t } : {},
    ...n.length > 0 && o !== "excludes" ? { excludes: n } : {},
    ...(e == null ? void 0 : e.depth) === -1 ? { depth: -1 } : {}
  });
}
function Co(e = {}, { fullMode: t = !0 } = {}) {
  var x, I, g;
  const n = [
    "hasSegmentsCriterion",
    "segments",
    "reviewStateCriterion",
    "reviewState",
    "shotBoundariesCriterion",
    "shotBoundaries",
    "segmentTagsCriterion",
    "segmentTagId",
    "tagId",
    "videoTagIds",
    "performerIds",
    "studioId"
  ];
  if (!n.some((O) => Object.hasOwn(e, O))) return e;
  const o = { ...e };
  n.forEach((O) => delete o[O]);
  const i = [], a = Ji(((x = e.hasSegmentsCriterion) == null ? void 0 : x.value) ?? e.segments);
  a !== null && i.push(sr("has-segments", "equals", a));
  const s = ((I = e.reviewStateCriterion) == null ? void 0 : I.value) ?? e.reviewState;
  t && ["unreviewed", "approved", "rejected"].includes(s) && i.push(sr("review-state", "equals", s));
  const l = Ji(((g = e.shotBoundariesCriterion) == null ? void 0 : g.value) ?? e.shotBoundaries);
  t && l !== null && i.push(sr("has-shot-boundaries", "equals", l));
  const d = Number(e.segmentTagId ?? e.tagId) || null, c = e.segmentTagsCriterion ? Yi(e.segmentTagsCriterion) : d ? Yi({ value: [d] }) : null;
  c && i.push(c);
  const m = Wr(e.videoTagIds);
  m.length > 0 && !o.tagsCriterion && (o.tagsCriterion = { modifier: "INCLUDES", value: m });
  const p = Wr(e.performerIds);
  p.length > 0 && !o.performersCriterion && (o.performersCriterion = { modifier: "INCLUDES", value: p });
  const y = Number(e.studioId) || null;
  y && !o.studiosCriterion && (o.studiosCriterion = { modifier: "INCLUDES", value: [y] });
  const h = Array.isArray(e.extensionCriteria) ? e.extensionCriteria : [], f = new Set(h.filter((O) => (O == null ? void 0 : O.extensionId) === rs).map((O) => O.filterId)), b = [...h, ...i.filter((O) => !f.has(O.filterId))];
  return b.length > 0 ? o.extensionCriteria = b : delete o.extensionCriteria, o;
}
function $o(e) {
  return eu.has(e == null ? void 0 : e.sort) ? { ...e, sort: Wt.defaultFilter.sort, direction: Wt.defaultFilter.direction } : e;
}
function qr(e) {
  return Array.isArray(e) ? e.map(qr) : !e || typeof e != "object" ? e : Object.fromEntries(Object.entries(e).map(([t, n]) => [
    t,
    t === "modifier" && typeof n == "string" ? tu[n] ?? n : qr(n)
  ]));
}
function nu(e, t, { fullMode: n = !0 } = {}) {
  var d;
  const o = $o(e), i = {
    page: o.page || 1,
    perPage: o.perPage || Wt.defaultFilter.perPage,
    sort: o.sort || Wt.defaultFilter.sort,
    direction: o.direction || Wt.defaultFilter.direction
  };
  o.q && (i.q = o.q), i.sort === "random" && Number.isInteger(o.seed) && o.seed > 0 && (i.seed = o.seed);
  const a = { ...Co(t, { fullMode: n }) };
  delete a.includeCompilationGroups;
  const { _filterExpression: s, ...l } = a;
  return {
    findFilter: i,
    objectFilter: qr(l),
    ...(d = s == null ? void 0 : s.children) != null && d.length ? { filterExpression: qr(s) } : {}
  };
}
function ru(e) {
  return e.filter((t) => !Zc.has(t.id));
}
function ou(e, t) {
  var o;
  const n = Array.isArray(e.files) && e.files.length > 0 ? e.files[0] : null;
  return {
    videoId: e.id,
    title: ((o = e.title) == null ? void 0 : o.trim()) || (n == null ? void 0 : n.basename) || `Video ${e.id}`,
    details: e.details ?? null,
    date: e.date ?? null,
    organized: !!e.organized,
    isVr: !!e.isVr,
    duration: Number(n == null ? void 0 : n.duration) || 0,
    updatedAt: e.updatedAt,
    segmentCount: (t == null ? void 0 : t.segmentCount) ?? 0,
    unreviewedCount: (t == null ? void 0 : t.unreviewedCount) ?? 0,
    approvedCount: (t == null ? void 0 : t.approvedCount) ?? 0,
    rejectedCount: (t == null ? void 0 : t.rejectedCount) ?? 0
  };
}
function yr(e, t, n) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(n));
}
function os(e, t, n) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(n));
}
function Wr(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((n) => Number.isInteger(n) && n > 0))];
}
function iu(e, t, n, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(n);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((m) => a.add(m));
  } else a.has(n) ? a.delete(n) : a.add(n);
  return a;
}
function is({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? r("div", { className: "text-[11px]" }, r(Gi, null, "No tag segments")) : t ? r("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, Et.flatMap((n) => {
    const o = Number(e[`${n}Count`]) || 0;
    if (o === 0) return [];
    const i = zt[n];
    return [r("span", {
      key: n,
      title: `${o} ${n} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : r(
    "div",
    { className: "text-[11px]" },
    r(Gi, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function as({ item: e, selected: t, selectionActive: n, onSelect: o }) {
  return o ? r("button", {
    type: "button",
    "aria-label": t ? "Deselect item" : "Select item",
    "aria-pressed": t,
    onClick: (i) => {
      i.preventDefault(), i.stopPropagation(), o(e.videoId, i.shiftKey);
    },
    className: `absolute left-0.5 top-0.5 z-10 flex h-8 w-8 items-center justify-center rounded-md transition-opacity ${t || n ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`
  }, r("span", {
    className: `flex h-4 w-4 items-center justify-center rounded border shadow-sm ${t ? "border-accent bg-accent text-white" : "border-border bg-background/95 text-transparent"}`
  }, r("svg", {
    viewBox: "0 0 16 16",
    className: "h-3 w-3",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, r("path", { d: "M3.5 8.25 6.5 11.25 12.5 4.75" })))) : null;
}
function au({ item: e, onNavigate: t, showReviewStates: n = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return r("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative flex min-h-full flex-col overflow-hidden rounded-md border bg-card shadow-sm transition-colors hover:border-accent/60 ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    i ? null : r("a", {
      key: "link",
      href: `/segment-studio/${e.videoId}`,
      onClick: (l) => yr(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    r("div", { key: "media", className: "relative aspect-video bg-black" }, [
      r("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      r(as, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? r("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, rl(e.duration)) : null
    ]),
    r("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      r("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      r("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? r("span", { key: "date" }, e.date) : null,
        e.organized ? r("span", { key: "organized" }, "Organized") : null,
        e.isVr ? r("span", { key: "vr" }, "VR") : null
      ]),
      r("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, r(is, { item: e, showReviewStates: n }))
    ])
  ]);
}
function su({ item: e, onNavigate: t, showReviewStates: n = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return r("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    r(as, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
    r(i ? "div" : "a", {
      key: "link",
      href: i ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: i ? void 0 : (l) => yr(l, t, s),
      className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }, [
      r("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
      r("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
        r("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
        r(is, { key: "segments", item: e, showReviewStates: n })
      ]),
      r("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function Ho({ active: e, onNavigate: t, showBin: n = !1, profile: o }) {
  const i = sd(o);
  return r("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    r("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => r("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => yr(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    r("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      n && Bn(
        o,
        Xt.recyclingBinView
      ) ? r(ss, { key: "bin", onNavigate: t }) : null,
      r(ls, { key: "settings", onNavigate: t })
    ])
  ]);
}
const To = "segment-studio:recycling-bin-changed";
function lu(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function lr() {
  window.dispatchEvent(new CustomEvent(To));
}
function ss({ onNavigate: e, compact: t = !1 }) {
  const [n, o] = G(null);
  fe(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const m = await ee("/bin"), p = Number(m == null ? void 0 : m.totalCount);
        !a && c === s && o(Number.isFinite(p) && p >= 0 ? Math.trunc(p) : null);
      } catch {
        !a && c === s && o(null);
      }
    }, d = () => {
      l();
    };
    return l(), window.addEventListener(To, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(To, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = lu(n);
  return r("a", {
    href: "/segment-studio/bin",
    onClick: (a) => yr(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": n == null ? "Open recycling bin" : `Open recycling bin, ${n} item${n === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [r("span", { key: "icon", "aria-hidden": "true" }, "♲"), r("span", { key: "label" }, i)]);
}
function ls({ onNavigate: e, compact: t = !1 }) {
  return r("a", {
    href: "/segment-studio/settings",
    onClick: (n) => yr(n, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [r("span", { key: "icon", "aria-hidden": "true" }, "⚙"), r("span", { key: "label" }, "Settings")]);
}
function du({ mode: e, onModeChange: t, disabled: n = !1 }) {
  function o(i) {
    const a = xo(i.target.value);
    t == null || t(a);
  }
  return r("label", { className: "block space-y-1 text-xs text-secondary" }, [
    r("span", { key: "label" }, "Mode"),
    r("select", {
      key: "select",
      value: e,
      onChange: o,
      disabled: n,
      className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
    }, [
      r("option", { key: "basic", value: "basic" }, "Basic"),
      r("option", { key: "full", value: "full" }, "Full")
    ]),
    r("span", { key: "help", className: "block max-w-sm" }, "Mode is saved to your Cove user account and applies across browsers.")
  ]);
}
function cu({ minimum: e, maximum: t, onChange: n }) {
  const o = ce(null), [i, a] = G("maximum"), s = (y, h) => {
    const f = Ml(e, t, y, h);
    a(f.coincidentTop), n({ minimum: f.minimum, maximum: f.maximum });
  }, l = (y, h) => {
    var b;
    const f = (b = o.current) == null ? void 0 : b.getBoundingClientRect();
    f && s(y, Al(h.clientX, f.left, f.width));
  }, d = (y, h) => {
    var f, b;
    h.preventDefault(), (b = (f = h.currentTarget).setPointerCapture) == null || b.call(f, h.pointerId), l(y, h);
  }, c = (y, h) => {
    var f, b;
    (b = (f = h.currentTarget).hasPointerCapture) != null && b.call(f, h.pointerId) && l(y, h);
  }, m = (y, h) => {
    const f = y === "minimum" ? e : t, b = y === "minimum" ? 0 : e, x = y === "minimum" ? t : 1, I = h.shiftKey ? 0.1 : 0.01;
    let g = null;
    ["ArrowLeft", "ArrowDown"].includes(h.key) && (g = f - I), ["ArrowRight", "ArrowUp"].includes(h.key) && (g = f + I), h.key === "PageDown" && (g = f - 0.1), h.key === "PageUp" && (g = f + 0.1), h.key === "Home" && (g = b), h.key === "End" && (g = x), g != null && (h.preventDefault(), s(y, Math.min(x, Math.max(b, g))));
  }, p = (y, h) => r("span", {
    key: y,
    role: "slider",
    tabIndex: 0,
    "aria-label": y === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((y === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((y === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(h * 100),
    "aria-valuetext": `${Math.round(h * 100)} percent`,
    onPointerDown: (f) => d(y, f),
    onPointerMove: (f) => c(y, f),
    onKeyDown: (f) => m(y, f),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${h * 100}%`,
      touchAction: "none",
      zIndex: e === t && i === y ? 2 : 1
    }
  });
  return r("div", { className: "space-y-2", "data-confidence-range": "true" }, [
    r("div", { key: "values", className: "flex items-center justify-between gap-4 text-xs text-secondary" }, [
      r("span", { key: "minimum" }, ["Minimum ", r("strong", { key: "value", className: "font-mono text-foreground" }, `${Math.round(e * 100)}%`)]),
      r("span", { key: "maximum" }, ["Maximum ", r("strong", { key: "value", className: "font-mono text-foreground" }, `${Math.round(t * 100)}%`)])
    ]),
    r(
      "div",
      { key: "track-wrap", className: "px-2 py-2" },
      r("div", {
        ref: o,
        className: "relative h-2 rounded-full bg-muted"
      }, [
        r("span", {
          key: "selected-range",
          "aria-hidden": "true",
          className: "absolute inset-y-0 rounded-full bg-accent",
          style: { left: `${e * 100}%`, right: `${(1 - t) * 100}%` }
        }),
        p("minimum", e),
        p("maximum", t)
      ])
    )
  ]);
}
function uu({ saving: e, error: t, onSelect: n, onClose: o }) {
  const i = ce(null);
  fe(() => {
    var l;
    const s = (l = i.current) == null ? void 0 : l.querySelector("input");
    s == null || s.focus({ preventScroll: !0 });
  }, []);
  const a = () => {
    e || o();
  };
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (s) => {
      s.target === s.currentTarget && a();
    },
    onKeyDownCapture: (s) => Dt(s, { onCancel: a })
  }, r("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
    className: "w-full max-w-lg space-y-4 rounded-lg border border-border bg-card p-5 shadow-2xl"
  }, [
    r("header", { key: "header", className: "space-y-1" }, [
      r("h2", {
        key: "title",
        id: "segment-studio-first-segment-tag-title",
        className: "text-lg font-semibold text-foreground"
      }, "Choose a tag for the first segment"),
      r(
        "p",
        { key: "description", className: "text-sm text-secondary" },
        "The selected tag creates the first swimlane at the playhead."
      )
    ]),
    r(cr, {
      key: "tag",
      entityType: "tag",
      value: null,
      selectedDisplay: "input",
      selectedLabel: "",
      onChange: (s, l) => {
        s != null && n(s, l == null ? void 0 : l.label);
      },
      disabled: e,
      placeholder: "Find a tag…",
      inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
      creatable: !1,
      allowCreate: !1
    }),
    t ? r("p", { key: "error", role: "status", className: "text-sm text-red-300" }, t) : null,
    r("div", { key: "actions", className: "flex justify-end" }, r("button", {
      type: "button",
      disabled: e,
      onClick: a,
      className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40 disabled:opacity-50"
    }, e ? "Creating…" : "Cancel"))
  ]));
}
function mu({
  filters: e,
  hideDerivedSegments: t,
  performers: n,
  provenanceSources: o,
  reviewCounts: i,
  segments: a,
  segmentGroups: s,
  reviewMode: l = !1,
  onChange: d,
  onHideDerivedChange: c,
  onClose: m
}) {
  const p = Ft(e), y = [...new Map((a || []).map((g) => [
    Number(g.tagId),
    g.tagName || `Tag ${g.tagId}`
  ])).entries()].sort((g, O) => g[1].localeCompare(O[1]) || g[0] - O[0]), h = new Set((a || []).map((g) => Number(g.tagId))), f = (s || []).filter((g) => Number(g.id) === p.segmentGroupId || (g.tags || []).some((O) => h.has(Number(O.tagId)))), b = (g) => d(Ft({ ...p, ...g })), x = (g) => b({
    reviewStates: p.reviewStates.includes(g) ? p.reviewStates.filter((O) => O !== g) : [...p.reviewStates, g]
  }), I = (g) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${g ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && m();
    },
    onKeyDownCapture: (g) => Dt(g, { onCancel: m })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
    className: "flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
  }, [
    r("header", { key: "header", className: "flex items-start justify-between gap-4 border-b border-border px-5 py-4" }, [
      r("div", { key: "copy" }, [
        r("h2", { id: "segment-studio-editor-filters-title", className: "text-lg font-semibold text-foreground" }, "Editor filters"),
        r(
          "p",
          { className: "mt-1 text-sm text-secondary" },
          "These filters apply to the segment rail, swimlanes, selection, counts, and keyboard navigation."
        )
      ]),
      r("button", {
        key: "close",
        type: "button",
        autoFocus: !0,
        onClick: m,
        "aria-label": "Close editor filters",
        className: "rounded-md px-2 py-1 text-xl leading-none text-secondary hover:bg-muted/40 hover:text-foreground"
      }, "×")
    ]),
    r("div", { key: "body", className: "min-h-0 space-y-5 overflow-y-auto p-5" }, [
      l ? r("fieldset", { key: "approval", className: "space-y-2" }, [
        r("legend", { className: "text-sm font-semibold text-foreground" }, "Approval state"),
        r("div", { className: "flex flex-wrap gap-2" }, Et.map((g) => {
          const O = p.reviewStates.includes(g), J = zt[g];
          return r("button", {
            key: g,
            type: "button",
            onClick: () => x(g),
            "aria-pressed": O,
            className: I(O)
          }, `${J.symbol} ${g} (${i[g] || 0})`);
        }))
      ]) : null,
      l ? r("fieldset", { key: "performer", className: "space-y-2" }, [
        r("legend", { className: "text-sm font-semibold text-foreground" }, "Performer"),
        r("p", { className: "text-xs text-secondary" }, "Any assigned slot may match the selected performer."),
        r("div", { className: "flex flex-wrap gap-2" }, [
          r("button", {
            key: "any",
            type: "button",
            onClick: () => b({ performerId: null }),
            "aria-pressed": p.performerId == null,
            className: I(p.performerId == null)
          }, "All performers"),
          ...n.map((g) => {
            const O = Number(yt(g));
            return r("button", {
              key: O,
              type: "button",
              onClick: () => b({ performerId: O }),
              "aria-pressed": p.performerId === O,
              className: I(p.performerId === O)
            }, g.name);
          })
        ])
      ]) : null,
      r("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        r("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          r("span", { key: "label" }, "Tag"),
          r("select", {
            key: "select",
            value: p.tagId ?? "",
            onChange: (g) => b({
              tagId: g.target.value === "" ? null : Number(g.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            r("option", { key: "all", value: "" }, "All tags"),
            ...y.map(([g, O]) => r("option", { key: g, value: g }, O))
          ])
        ]),
        r("label", {
          key: "segment-group",
          className: "space-y-1 text-xs text-secondary"
        }, [
          r("span", { key: "label" }, "Segment group"),
          r("select", {
            key: "select",
            value: p.segmentGroupId ?? "",
            onChange: (g) => b({
              segmentGroupId: g.target.value === "" ? null : g.target.value === "ungrouped" ? "ungrouped" : Number(g.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            r("option", { key: "all", value: "" }, "All Segment groups"),
            ...f.map((g) => r("option", { key: g.id, value: g.id }, g.name)),
            r("option", { key: "ungrouped", value: "ungrouped" }, "Ungrouped")
          ])
        ])
      ]),
      r("fieldset", { key: "provenance", className: "space-y-2" }, [
        r("legend", { className: "text-sm font-semibold text-foreground" }, "Provenance"),
        r("div", { className: "flex flex-wrap gap-2" }, [
          r("button", {
            key: "all",
            type: "button",
            onClick: () => b({ sourceKey: null }),
            "aria-pressed": p.sourceKey == null,
            className: I(p.sourceKey == null)
          }, "All provenance"),
          ...o.map((g) => r("button", {
            key: g,
            type: "button",
            onClick: () => b({ sourceKey: g }),
            "aria-pressed": p.sourceKey === g,
            title: g,
            className: I(p.sourceKey === g)
          }, _t(g)))
        ])
      ]),
      r("fieldset", { key: "confidence", className: "space-y-3" }, [
        r("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        r(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        r(cu, {
          minimum: p.confidenceMin,
          maximum: p.confidenceMax,
          onChange: ({ minimum: g, maximum: O }) => b({
            confidenceMin: g,
            confidenceMax: O
          })
        }),
        r("label", {
          key: "unscored",
          className: "flex items-center gap-2 text-xs text-secondary"
        }, [
          r("input", {
            key: "input",
            type: "checkbox",
            checked: p.includeUnscored,
            onChange: (g) => b({
              includeUnscored: g.target.checked
            }),
            className: "h-4 w-4 accent-[var(--color-accent)]"
          }),
          r("span", { key: "label" }, "Include unscored segments")
        ])
      ]),
      l ? r("label", { key: "derived", className: "flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground" }, [
        r("input", {
          key: "input",
          type: "checkbox",
          checked: t,
          onChange: (g) => c(g.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]"
        }),
        r(Yc, { key: "icon", hidden: t }),
        r("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    r("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      r("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(Ft({})), l && c(!1);
        },
        className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
      }, "Reset filters"),
      r("button", {
        key: "done",
        type: "button",
        onClick: m,
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground"
      }, "Done")
    ])
  ]));
}
const ds = "segment-studio-editor-history";
function gu({ history: e, historySaving: t, anchorRef: n, onRestore: o, onClose: i }) {
  const a = ce(null);
  return fe(() => {
    const s = (d) => {
      Qd(d.target, a.current, n == null ? void 0 : n.current) && i();
    }, l = (d) => {
      var p, y, h;
      if (d.key !== "Escape" || d.defaultPrevented || document.querySelector("[role='dialog'], [aria-modal='true']")) return;
      const c = document.activeElement, m = c instanceof Element && (((p = a.current) == null ? void 0 : p.contains(c)) || ((y = n == null ? void 0 : n.current) == null ? void 0 : y.contains(c)));
      d.preventDefault(), i(), m && ((h = n == null ? void 0 : n.current) == null || h.focus({ preventScroll: !0 }));
    };
    return document.addEventListener("pointerdown", s), document.addEventListener("keydown", l), () => {
      document.removeEventListener("pointerdown", s), document.removeEventListener("keydown", l);
    };
  }, [n, i]), r("div", {
    ref: a,
    id: ds,
    role: "group",
    "aria-label": "Editor history",
    className: "absolute right-3 top-full z-30 mt-1 w-full max-w-md rounded-md border border-border bg-surface p-2 shadow-lg"
  }, [
    r("div", { key: "heading", className: "flex items-center justify-between gap-3 px-2 py-1" }, [
      r("h2", { key: "title", className: "text-sm font-semibold text-foreground" }, "Editor history"),
      r("button", {
        key: "close",
        type: "button",
        onClick: i,
        className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
      }, "Close")
    ]),
    r("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
      ...[...e.actions].reverse().map((s) => r("button", {
        key: s.sequence,
        type: "button",
        disabled: t,
        onClick: () => o(s.sequence),
        "aria-current": e.cursorSequence === s.sequence ? "step" : void 0,
        className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${s.sequence > e.cursorSequence ? "text-secondary" : "text-foreground"} ${e.cursorSequence === s.sequence ? "bg-accent/15" : ""}`
      }, [
        r("span", { key: "label", className: "min-w-0 flex-1 truncate" }, s.label),
        r("time", {
          key: "time",
          dateTime: s.createdAt,
          className: "shrink-0 text-[10px] text-secondary"
        }, new Date(s.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
      ])),
      r("button", {
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
function fu({ reviewMode: e, bindings: t, onClose: n }) {
  const o = fr.filter((l) => Gn(l, e)), i = Ti(o, 1)[0], a = Ti(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((m) => r("div", { key: m.id, className: "flex items-center justify-between text-sm" }, [
      r("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, m.description),
      r(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[m.id] ? t[m.id].length > 0 ? t[m.id] : ["Unassigned"] : m.bindings.map(Sa)).map((p, y) => r("kbd", { key: `${m.id}:${y}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, p))
      )
    ]));
    return r("section", { key: l, className: "space-y-2", "aria-label": `${l} shortcuts` }, [
      r("h3", { key: "heading", className: "mb-3 font-semibold text-primary" }, l),
      r("div", { key: "items", className: "space-y-1" }, c)
    ]);
  };
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (l) => {
      l.target === l.currentTarget && n();
    },
    onKeyDownCapture: (l) => Dt(l, { onCancel: n })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-shortcuts-title",
    className: "flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
  }, [
    r("header", { key: "header", className: "flex shrink-0 items-center justify-between gap-4 p-6 pb-4" }, [
      r("h2", { key: "title", id: "segment-studio-shortcuts-title", className: "text-xl font-bold text-foreground" }, "Keyboard shortcuts"),
      r("button", { key: "close", type: "button", autoFocus: !0, onClick: n, className: "rounded-md px-2 py-1 text-xl leading-none text-secondary hover:bg-muted/40 hover:text-foreground", "aria-label": "Close keyboard shortcuts" }, "×")
    ]),
    r("div", { key: "body", className: "min-h-0 overflow-y-auto px-6 pb-6" }, [
      r("div", { key: "mobile", className: "space-y-6 lg:hidden" }, i.map(s)),
      r(
        "div",
        { key: "desktop", className: "hidden items-start gap-6 lg:grid lg:grid-cols-2" },
        a.map((l, d) => r("div", { key: d, className: "space-y-6" }, l.map(s)))
      )
    ])
  ]));
}
function pu({
  examples: e,
  exporting: t,
  removingExampleId: n,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = xc(e), [l, d] = G([]), c = s.map((m) => m.tagName).join("|");
  return fe(() => {
    const m = new Set(s.map((p) => p.tagName));
    d((p) => p.filter((y) => m.has(y)));
  }, [c]), r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && n == null && a();
    },
    onKeyDownCapture: (m) => Dt(m, {
      onCancel: t || n != null ? void 0 : a
    })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    r("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      r("h2", { key: "title", id: "segment-studio-examples-title", className: "text-lg font-semibold text-foreground" }, "AI Feedback"),
      r("p", { key: "description", className: "mt-1 text-sm text-secondary" }, `${e.length} registered-AI example${e.length === 1 ? "" : "s"} in this video. Expand a tag to inspect or restore examples before export.`)
    ]),
    r("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      r("div", { key: "items", className: "space-y-3" }, e.length ? s.map((m, p) => {
        const y = l.includes(m.tagName), h = `incorrect-example-tag-${p}`;
        return r("section", {
          key: m.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          r("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": y,
            "aria-controls": h,
            onClick: () => d((f) => y ? f.filter((b) => b !== m.tagName) : [...f, m.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: Vr(!1) }
          }, [
            r(
              "span",
              { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" },
              y ? "▾" : "▸"
            ),
            r(
              "span",
              { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
              m.tagName
            ),
            r(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${m.examples.length} example${m.examples.length === 1 ? "" : "s"}`
            )
          ]),
          y ? r("div", {
            key: "examples",
            id: h,
            className: "divide-y divide-border border-t border-border"
          }, m.examples.map((f) => {
            const b = `${Fe(f.startSec)}${f.endSec == null ? "" : ` – ${Fe(f.endSec)}`}`, x = n === f.id;
            return r("div", {
              key: f.id,
              className: "flex items-center justify-between gap-3 px-3 py-2 text-sm"
            }, [
              r(
                "span",
                { key: "time", className: "font-mono text-xs text-secondary" },
                b
              ),
              r("button", {
                key: "remove",
                type: "button",
                disabled: t || n != null,
                onClick: () => i(f),
                "aria-label": `${x ? "Restoring" : "Restore to review"} ${m.tagName} example at ${b}`,
                className: "rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
              }, x ? "Restoring…" : "Restore to review")
            ]);
          })) : null
        ]);
      }) : [r("p", { key: "empty", className: "text-sm text-secondary" }, "Select one or more segments and press C to collect incorrect examples.")]),
      r(
        "p",
        { key: "artifact-help", className: "mt-4 text-xs text-secondary" },
        "The ZIP contains sampled JPEG frames, legacy metadata.json, and a provenance-rich manifest.json. Download it for manual submission; Segment Studio does not upload it automatically."
      )
    ]),
    r("footer", { key: "footer", className: "flex items-center justify-end gap-2 border-t border-border px-5 py-4" }, [
      r("button", {
        key: "cancel",
        type: "button",
        autoFocus: !0,
        disabled: t || n != null,
        onClick: a,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Cancel"),
      r("button", {
        key: "confirm",
        type: "button",
        disabled: t || n != null || e.length === 0,
        onClick: o,
        className: "rounded-md border border-cyan-400/60 bg-cyan-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-cyan-500/30 disabled:opacity-50"
      }, t ? "Capturing frames…" : `Download ${e.length} Example${e.length === 1 ? "" : "s"}`)
    ])
  ]));
}
function yu({ segments: e, onSelect: t, onClose: n }) {
  const [o, i] = G(""), [a, s] = G(0), l = ce(null), d = Je(() => Cd(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), m = Td(d);
  fe(() => {
    var y;
    (y = l.current) == null || y.scrollIntoView({ block: "nearest" });
  }, [c, o]);
  const p = () => {
    const y = d[c];
    y && t(y.segment || y);
  };
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-start justify-center bg-black/70 p-4 pt-[10vh]",
    onMouseDown: (y) => {
      y.target === y.currentTarget && n();
    }
  }, r("section", {
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
        y.preventDefault(), y.stopPropagation(), n();
      else if (y.key === "ArrowDown" || y.key === "ArrowUp") {
        y.preventDefault(), y.stopPropagation();
        const f = y.key === "ArrowDown" ? 1 : -1;
        s((b) => d.length ? (b + f + d.length) % d.length : 0);
      } else y.key === "Enter" && !((h = y.nativeEvent) != null && h.isComposing) && (y.preventDefault(), y.stopPropagation(), p());
    }
  }, [
    r("header", { key: "header", className: "border-b border-border p-4" }, [
      r(
        "h2",
        { key: "title", id: "segment-studio-quick-search-title", className: "text-base font-semibold text-foreground" },
        "Select a segment"
      ),
      r("input", {
        key: "input",
        type: "search",
        autoFocus: !0,
        value: o,
        onChange: (y) => {
          i(y.target.value), s(0);
        },
        placeholder: "Search segment tags…",
        "aria-label": "Search segment tags",
        "aria-controls": "segment-studio-quick-search-results",
        "aria-activedescendant": d[c] ? `segment-quick-search-${(d[c].segment || d[c]).id}` : void 0,
        className: "mt-3 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
      })
    ]),
    r("div", {
      key: "results",
      id: "segment-studio-quick-search-results",
      role: "listbox",
      "aria-label": "Matching segments",
      className: "min-h-0 flex-1 overflow-y-auto p-2"
    }, d.length ? d.flatMap((y, h) => {
      var Y;
      const f = y.segment || y, b = f.endSec == null ? Fe(f.startSec) : `${Fe(f.startSec)} – ${Fe(f.endSec)}`, x = `${_t(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`, I = h === c, g = h > 0 ? d[h - 1].groupKey : null, O = m && y.groupKey !== g ? r("div", {
        key: `group:${y.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, y.groupName) : null, J = r("button", {
        key: f.id,
        id: `segment-quick-search-${f.id}`,
        ref: I ? l : null,
        type: "button",
        role: "option",
        "aria-selected": I,
        onMouseEnter: () => s(h),
        onClick: () => t(f),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${I ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        m ? r("span", { key: "group", className: "sr-only" }, `${y.groupName} group`) : null,
        r(Sn, { key: "review", state: f.reviewState, includeLabel: !1 }),
        r(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          f.tagName || "Tag segment"
        ),
        (Y = y.performers) != null && Y.length ? r(Yr, {
          key: "performers",
          performers: y.performers,
          performerAssignments: y.performerAssignments
        }) : null,
        r(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          b
        ),
        r("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: x
        }, x)
      ]);
      return O ? [O, J] : [J];
    }) : r("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function bu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e || []) {
    if (n.published || n.reviewState !== "approved") continue;
    const o = String(n.tagId ?? `name:${n.tagName || ""}`);
    t.has(o) || t.set(o, {
      key: o,
      tagName: n.tagName || "Tag segment",
      drafts: []
    }), t.get(o).drafts.push(n);
  }
  return [...t.values()].map((n) => ({
    ...n,
    drafts: n.drafts.sort((o, i) => o.startSec - i.startSec || String(o.id).localeCompare(String(i.id)))
  })).sort((n, o) => n.tagName.localeCompare(o.tagName) || n.key.localeCompare(o.key));
}
function hu({
  drafts: e,
  processing: t,
  error: n,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = Je(() => bu(e), [e]), [l, d] = G([]), c = s.reduce((h, f) => h + f.drafts.length, 0), m = ce(null);
  Go({ confirmRef: m, cancelRef: o, confirmReady: !t && c > 0 });
  const p = (h) => d((f) => f.includes(h) ? f.filter((b) => b !== h) : [...f, h]), y = (h) => `segment-studio-publish-approved-${h.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && !t && a();
    },
    onKeyDownCapture: (h) => Dt(h, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    r("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      r(
        "h2",
        { key: "title", id: "segment-studio-publish-approved-title", className: "text-lg font-semibold text-foreground" },
        "Publish approved drafts?"
      ),
      r(
        "p",
        { key: "description", className: "mt-1 text-sm text-secondary" },
        "These approved drafts will become native Cove segments. Expand a tag to inspect timing and provenance before publishing."
      )
    ]),
    r("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      r("dl", { key: "summary", className: "mb-4 grid grid-cols-2 gap-2 rounded-md border border-border bg-surface p-3 text-sm" }, [
        ["Approved drafts", c],
        ["Tags", s.length]
      ].flatMap(([h, f]) => [
        r("dt", { key: `${h}:label`, className: "text-secondary" }, h),
        r("dd", { key: `${h}:value`, className: "font-semibold text-foreground" }, String(f))
      ])),
      s.length ? r("div", { key: "groups", className: "space-y-2" }, s.map((h) => {
        const f = l.includes(h.key);
        return r("section", { key: h.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          r("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": f,
            "aria-controls": y(h),
            onClick: () => p(h.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: Vr(!1) }
          }, [
            r("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, f ? "▾" : "▸"),
            r("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, h.tagName),
            r(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${h.drafts.length} draft${h.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          f ? r("div", {
            key: "drafts",
            id: y(h),
            className: "divide-y divide-border border-t border-border"
          }, h.drafts.map((b) => {
            const x = b.endSec == null ? Fe(b.startSec) : `${Fe(b.startSec)} – ${Fe(b.endSec)}`, I = `${_t(b.sourceKey)}${b.confidence == null ? "" : ` · ${Math.round(b.confidence * 100)}%`}`;
            return r("div", { key: b.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              r(Sn, { key: "review", state: b.reviewState, includeLabel: !1 }),
              r("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, x),
              r("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: I
              }, I)
            ]);
          })) : null
        ]);
      })) : r(
        "p",
        { key: "empty", className: "rounded-md border border-dashed border-border p-6 text-center text-sm text-secondary" },
        "No unpublished approved drafts are available."
      )
    ]),
    n ? r("p", { key: "error", role: "alert", className: "mx-5 mb-3 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" }, n) : null,
    r("footer", { key: "footer", className: "flex items-center justify-end gap-2 border-t border-border px-5 py-4" }, [
      r("button", {
        key: "cancel",
        ref: o,
        type: "button",
        disabled: t,
        onClick: a,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Cancel"),
      r("button", {
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
function vu({ candidates: e, processing: t, error: n, onConfirm: o, onClose: i }) {
  const a = Id(e), [s, l] = G(() => /* @__PURE__ */ new Set()), [d, c] = G(() => new Set(a.map((b) => b.key))), m = a.flatMap((b) => d.has(b.key) ? b.candidates : []), p = (b) => l((x) => {
    const I = new Set(x);
    return I.has(b) ? I.delete(b) : I.add(b), I;
  }), y = (b) => c((x) => {
    const I = new Set(x);
    return I.has(b) ? I.delete(b) : I.add(b), I;
  }), h = (b) => b.assignment.map(({ slot: x, performer: I }) => `${x.label || `Slot ${x.sortOrder + 1}`}: ${I.name}`).join(", "), f = (b) => `segment-studio-auto-assign-${b.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && !t && i();
    },
    onKeyDownCapture: (b) => {
      b.key === "Enter" && b.target instanceof HTMLInputElement || Dt(b, {
        onCancel: t ? void 0 : i,
        onConfirm: m.length && !t ? () => o(m) : void 0
      });
    }
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
    className: "flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
  }, [
    r("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      r("h2", { key: "title", id: "segment-studio-auto-assign-title", className: "text-lg font-semibold text-foreground" }, "Auto-Assign Performers"),
      r(
        "p",
        { key: "description", className: "mt-1 text-sm text-secondary" },
        `${e.length} unfilled segment${e.length === 1 ? "" : "s"} ${e.length === 1 ? "has" : "have"} one valid complete assignment. Only these reviewed segments can change.`
      )
    ]),
    r(
      "div",
      { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" },
      e.length ? r("div", { className: "space-y-3" }, a.map((b) => r("section", { key: b.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
        r("header", {
          key: "header",
          className: "flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2",
          style: { background: Vr(!1) }
        }, [
          r("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(b.key),
            disabled: t,
            onChange: () => y(b.key),
            "aria-label": `Include ${b.tagName} assignment: ${h(b)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          r("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(b.key),
            "aria-controls": f(b),
            "aria-label": `${s.has(b.key) ? "Collapse" : "Expand"} ${b.tagName} assignment: ${h(b)}`,
            onClick: () => p(b.key),
            className: "shrink-0 rounded px-1 text-sm text-secondary hover:bg-muted/50 hover:text-foreground disabled:opacity-50"
          }, s.has(b.key) ? "▾" : "▸"),
          r(
            "span",
            { key: "tag", className: "min-w-24 flex-1 truncate text-sm font-semibold text-foreground" },
            b.tagName
          ),
          r(
            "span",
            { key: "performers", className: "flex min-w-0 flex-wrap items-center gap-2" },
            b.assignment.map(({ slot: x, performer: I }) => {
              const g = x.label || `Slot ${x.sortOrder + 1}`;
              return r("span", {
                key: x.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${g}: ${I.name}`
              }, [
                r("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${g}: ${I.name}`
                }, `${g}: ${I.name}`),
                r(gr, {
                  key: "avatar",
                  performer: { id: I.performerId, name: I.name },
                  compact: !0
                })
              ]);
            })
          ),
          r(sn, { key: "states", counts: b.counts }),
          r("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(b.candidates),
            "aria-label": `Auto-Assign ${b.tagName}: ${h(b)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${b.candidates.length})`)
        ]),
        s.has(b.key) ? r(
          "div",
          { key: "segments", id: f(b), className: "divide-y divide-border/70" },
          b.candidates.map((x) => {
            const I = x.endSec == null ? Fe(x.startSec) : `${Fe(x.startSec)} – ${Fe(x.endSec)}`, g = `${_t(x.sourceKey)}${x.confidence == null ? "" : ` · ${Math.round(x.confidence * 100)}%`}`;
            return r("div", {
              key: x.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              r(Sn, { key: "review", state: x.reviewState, includeLabel: !1 }),
              r(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                x.tagName || "Tag segment"
              ),
              r(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                I
              ),
              r("span", {
                key: "provenance",
                className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                title: g
              }, g)
            ]);
          })
        ) : null
      ]))) : r(
        "p",
        { className: "rounded-md border border-dashed border-border p-6 text-center text-sm text-secondary" },
        "No segments have completely unfilled performer slots."
      )
    ),
    n ? r("p", { key: "error", role: "alert", className: "mx-5 mb-3 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" }, n) : null,
    r("footer", { key: "footer", className: "flex items-center justify-end gap-2 border-t border-border px-5 py-4" }, [
      r("button", { key: "cancel", type: "button", disabled: t, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Cancel"),
      r("button", {
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
function Su({ preview: e, onConfirm: t, onClose: n }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && n();
    },
    onKeyDownCapture: (d) => Dt(d, { onCancel: n, onConfirm: t })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
    className: "w-full max-w-lg overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
  }, [
    r("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      r("h2", { key: "title", id: "segment-studio-delete-rejected-title", className: "text-lg font-semibold text-foreground" }, "Permanently delete rejected segments?"),
      r(
        "p",
        { key: "summary", className: "mt-1 text-sm text-secondary" },
        `${o} rejected segment${o === 1 ? "" : "s"}${i ? ` and ${i} dependent derived segment${i === 1 ? "" : "s"}` : ""} will be deleted (${a} total).`
      )
    ]),
    r("div", { key: "body", className: "space-y-2 px-5 py-4 text-sm text-secondary" }, [
      s ? r("p", { key: "retained" }, `${s} shared derived segment${s === 1 ? "" : "s"} will be kept.`) : null,
      l ? r("p", { key: "deferred" }, `${l} feedback-protected rejected segment${l === 1 ? "" : "s"} will be kept until AI feedback is exported.`) : null,
      r("p", { key: "warning", className: "font-medium text-foreground" }, "This cannot be undone.")
    ]),
    r("footer", { key: "footer", className: "flex justify-end gap-2 border-t border-border px-5 py-4" }, [
      r("button", { key: "cancel", type: "button", onClick: n, className: "rounded-md border border-border px-3 py-1.5 text-sm" }, "Cancel"),
      r("button", { key: "confirm", type: "button", autoFocus: !0, onClick: t, className: "rounded-md border border-destructive/60 bg-destructive/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-destructive/25" }, "Delete permanently")
    ])
  ]));
}
function xu({
  merge: e,
  processing: t,
  undoable: n = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = G(!1), d = ce(null);
  if (Go({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Fe(e.endSec);
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && a();
    },
    onKeyDownCapture: (m) => Dt(m, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
    className: "w-full max-w-lg rounded-lg border border-border bg-card shadow-2xl"
  }, [
    r("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      r(
        "h2",
        { key: "title", id: "segment-studio-merge-title", className: "text-lg font-semibold text-foreground" },
        `Merge ${e.segments.length} selected segments?`
      ),
      r(
        "p",
        { key: "range", className: "mt-1 font-mono text-xs text-secondary" },
        `${Fe(e.startSec)} – ${c}`
      )
    ]),
    r("div", { key: "body", className: "space-y-3 px-5 py-4 text-sm text-secondary" }, [
      r(
        "p",
        { key: "survivor" },
        n ? "The chronologically first segment is retained and replaces the other selected native ranges." : "The chronologically first segment is retained and the others are permanently removed."
      ),
      r(
        "p",
        { key: "provenance" },
        n ? "The merged result becomes manually sourced. You can undo the native merge from the editor toolbar." : "The merged result becomes manually sourced; model, confidence, and active provenance are removed. This cannot be undone."
      ),
      r("label", { key: "skip", className: "flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-foreground" }, [
        r("input", {
          key: "input",
          type: "checkbox",
          checked: s,
          onChange: (m) => l(m.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]"
        }),
        r("span", { key: "label" }, "Do not ask again")
      ])
    ]),
    r("footer", { key: "footer", className: "flex justify-end gap-2 border-t border-border px-5 py-4" }, [
      r("button", {
        key: "cancel",
        ref: o,
        type: "button",
        disabled: t,
        onClick: a,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Cancel"),
      r("button", {
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
function ku(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e || []) {
    const o = String(n.rootItemId || `${n.rootTagName}:${n.rootStartSec}`);
    t.has(o) || t.set(o, {
      key: o,
      rootTagName: n.rootTagName || n.sourceTagName,
      rootStartSec: n.rootStartSec,
      outputs: []
    }), t.get(o).outputs.push(n);
  }
  return [...t.values()];
}
function wu({ preview: e, loading: t, processing: n, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var p, y;
  const l = e ? e.createCount + e.linkCount : 0, d = ce(null);
  Go({ confirmRef: d, cancelRef: i, confirmReady: !t && !n && l > 0 && !o });
  const c = ((p = e == null ? void 0 : e.outputs) == null ? void 0 : p.slice(0, 200)) || [], m = ku(c);
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && !n && s();
    },
    onKeyDownCapture: (h) => Dt(h, {
      onCancel: n ? void 0 : s,
      onConfirm: e && l > 0 && !n ? a : void 0
    })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    r("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      r("h2", { key: "title", id: "segment-studio-materialize-derived-title", className: "text-lg font-semibold text-foreground" }, "Auto-Materialize Derived Segments"),
      r(
        "p",
        { key: "description", className: "mt-1 text-sm text-secondary" },
        "Preview derivation rules before creating or linking any segments."
      )
    ]),
    r(
      "div",
      { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" },
      t ? r("p", { className: "rounded-md border border-dashed border-border p-6 text-center text-sm text-secondary" }, "Analyzing derived segments…") : e ? r("div", { className: "space-y-4" }, [
        r("dl", { key: "summary", className: "grid grid-cols-2 gap-2 rounded-md border border-border bg-surface p-3 text-sm sm:grid-cols-5" }, [
          ["Source roots", e.sourceCount],
          ["Create", e.createCount],
          ["Link existing", e.linkCount],
          ["Already materialized", e.alreadyMaterializedCount],
          ["Conflicts skipped", e.conflictCount || 0]
        ].flatMap(([h, f]) => [
          r("dt", { key: `${h}:label`, className: "text-secondary" }, h),
          r("dd", { key: `${h}:value`, className: "font-semibold text-foreground" }, String(f))
        ])),
        e.conflictCount > 0 ? r(
          "p",
          { key: "conflicts", role: "status", className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground" },
          `${e.conflictCount} existing derivation ${e.conflictCount === 1 ? "branch was" : "branches were"} skipped because its lineage no longer matches the active rule. Resolve these through lineage maintenance.`
        ) : null,
        m.length ? r("div", { key: "outputs", className: "space-y-2" }, [
          ...m.map((h) => r("article", {
            key: h.key,
            className: "rounded-md border border-border bg-surface p-3"
          }, [
            r("div", { key: "root", className: "flex min-w-0 items-center gap-2" }, [
              r(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
                `${h.rootTagName} @ ${Fe(h.rootStartSec)}`
              ),
              r(
                "span",
                { key: "count", className: "shrink-0 text-xs font-medium text-secondary" },
                `${h.outputs.length} ${h.outputs.length === 1 ? "change" : "changes"}`
              )
            ]),
            r(
              "div",
              { key: "tree", className: "mt-2 space-y-1 border-l border-border pl-2" },
              h.outputs.map((f, b) => r("div", {
                key: `${f.ruleId}:${f.depth}:${b}`,
                className: "flex min-w-0 items-center gap-2 text-sm",
                style: { marginLeft: `${Math.max(0, f.depth - 1) * 1.25}rem` }
              }, [
                r("span", { key: "branch", "aria-hidden": "true", className: "shrink-0 text-secondary" }, "↳"),
                r(
                  "span",
                  { key: "tags", className: "min-w-0 flex-1 truncate text-foreground" },
                  `${f.sourceTagName} → ${f.derivedTagName}`
                ),
                r("span", { key: "depth", className: "shrink-0 text-[11px] text-secondary" }, `Level ${f.depth}`),
                r(
                  "span",
                  { key: "action", className: "shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-foreground" },
                  f.action === "create" ? "Create" : "Link existing"
                )
              ]))
            )
          ])),
          (((y = e.outputs) == null ? void 0 : y.length) || 0) > c.length ? r(
            "p",
            { key: "more", className: "text-xs text-secondary" },
            `${e.outputs.length - c.length} additional output${e.outputs.length - c.length === 1 ? "" : "s"} omitted from this preview list.`
          ) : null
        ]) : r(
          "p",
          { key: "empty", className: "rounded-md border border-dashed border-border p-6 text-center text-sm text-secondary" },
          e.conflictCount > 0 ? "No safe materialization changes are available until the conflicting lineage is resolved." : "Every applicable derivation is already materialized."
        )
      ]) : null
    ),
    o ? r("p", { key: "error", role: "alert", className: "mx-5 mb-3 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" }, o) : null,
    r("footer", { key: "footer", className: "flex items-center justify-end gap-2 border-t border-border px-5 py-4" }, [
      r("button", { key: "cancel", ref: i, type: "button", disabled: n, onClick: s, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Cancel"),
      r("button", {
        key: "confirm",
        ref: d,
        type: "button",
        disabled: t || n || l === 0,
        onClick: a,
        className: "rounded-md border border-indigo-400/60 bg-indigo-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-indigo-500/30 disabled:opacity-50"
      }, n ? "Materializing…" : `Materialize ${l} change${l === 1 ? "" : "s"}`)
    ])
  ]));
}
function Nu({
  compatibilityMode: e,
  selectedSegment: t,
  selectedSegments: n = [],
  selectedGroups: o = [],
  saveMessage: i,
  savingSegmentId: a,
  selectionBusy: s = a != null,
  creatingSegmentId: l = null,
  saveTag: d,
  saveTiming: c,
  slotStatus: m,
  performerSlotsAvailable: p,
  selectedPerformerSlots: y,
  performerSlots: h,
  detail: f,
  video: b,
  slotButtonRef: x,
  tagSearchRef: I,
  onDetailChange: g,
  setSaveMessage: O,
  acquireSaveLock: J,
  onSlotsChanged: Y,
  onRecordHistory: P,
  onCancelQueuedReview: L,
  splitSegment: E,
  duplicateSegment: S,
  provenance: w,
  lineage: C,
  onNavigateLineageItem: A,
  tagEditing: M,
  onCancelTagEditing: T,
  detailPanelRef: _,
  onReduceSelection: ne
}) {
  var ve, xe, be;
  const U = ce(null), re = ce(null), pe = () => {
    var z;
    (z = re.current) == null || z.call(re), re.current = null;
  }, ae = ce(null), Ne = ce(null), ye = ce(null), Me = ce(null), [q, Q] = G(!1);
  fe(() => {
    U.current && (U.current.scrollTop = 0), Q(!1);
  }, [t == null ? void 0 : t.id]), fe(() => {
    var z, ke;
    q && ((ke = (z = ae.current) == null ? void 0 : z.querySelector("input, select, button")) == null || ke.focus({ preventScroll: !0 }));
  }, [q]);
  function ue() {
    Q(!1), requestAnimationFrame(() => {
      var z;
      return (z = x.current) == null ? void 0 : z.focus({ preventScroll: !0 });
    });
  }
  if (n.length > 1) {
    const z = !n.some((N) => N.isDerived), ke = e && p ? tc(h, n) : null, se = (ke == null ? void 0 : ke.map((N, j) => {
      var v;
      const k = n[j];
      return {
        segmentId: k.nativeSegmentId,
        itemId: k.published ? null : k.itemId,
        revision: (v = f.performerSlotRevisions) == null ? void 0 : v[k.id],
        slots: N
      };
    })) || [];
    return r(Ro.Fragment, null, [
      r(Xc, {
        key: "details",
        selectedGroups: o,
        selectedSegments: n,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: _,
        onReduceSelection: ne,
        reviewable: e,
        tagEditable: z,
        slotsEditable: se.length > 0 && a == null,
        onEditSlots: () => Q(!0),
        slotButtonRef: x,
        saveMessage: i
      }),
      M && z ? r("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (N) => {
          N.target === N.currentTarget && T();
        },
        onKeyDownCapture: (N) => Dt(N, { onCancel: T })
      }, r("section", {
        ref: I,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "segment-studio-multi-tag-dialog-title",
        className: "w-full max-w-lg space-y-3 rounded-lg border border-border bg-card p-4 shadow-2xl"
      }, [
        r("header", { key: "header", className: "space-y-1" }, [
          r("h2", {
            key: "title",
            id: "segment-studio-multi-tag-dialog-title",
            className: "text-base font-semibold text-foreground"
          }, `Change tag for ${n.length} segments`),
          r(
            "p",
            { key: "description", className: "text-xs text-secondary" },
            "Choose one tag to apply across the complete selection."
          )
        ]),
        r(cr, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (N, j) => N == null ? T() : d(N, j == null ? void 0 : j.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        r("button", {
          key: "cancel",
          type: "button",
          onClick: T,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      q && se.length > 0 ? r("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (N) => {
          N.target === N.currentTarget && ue();
        },
        onKeyDownCapture: (N) => {
          var k, v;
          if (!(typeof ((k = N.target) == null ? void 0 : k.closest) == "function" ? N.target.closest("input, textarea, select, [contenteditable='true']") : null) && !N.repeat && !N.ctrlKey && !N.altKey && !N.metaKey && !N.shiftKey && /^[1-9]$/.test(N.key) && ((v = Me.current) != null && v.call(Me, Number(N.key) - 1))) {
            N.preventDefault(), N.stopPropagation();
            return;
          }
          Dt(N, { onCancel: ue });
        }
      }, r("section", {
        ref: ae,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "segment-studio-multi-slot-dialog-title",
        tabIndex: -1,
        className: "flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
      }, [
        r("header", { key: "header", className: "flex items-start justify-between gap-4 border-b border-border px-4 py-3" }, [
          r("div", { key: "copy" }, [
            r("h2", { key: "title", id: "segment-studio-multi-slot-dialog-title", className: "text-base font-semibold text-foreground" }, "Performer slots"),
            r("p", { key: "description", className: "mt-0.5 text-xs text-secondary" }, "Assign the shared performer-slot shape across the selection.")
          ]),
          r("button", { key: "close", type: "button", onClick: ue, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        r("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, r(Vc, {
          videoId: b.id,
          targets: se,
          performerCandidates: f.performerCandidates || [],
          shortcutRef: Me,
          acquireSaveLock: () => J("slots", -1),
          onSaved: async ({ beforeState: N, afterState: j }) => {
            await P(
              "performer-slots.assign",
              `Assigned performers to ${se.length} segments`,
              N,
              j
            ), ue(), await Y();
          },
          onConflict: Y
        }))
      ])) : null
    ]);
  }
  return r("div", {
    ref: (z) => {
      U.current = z, _ && (_.current = z);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    r("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      r("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? r(Sn, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? r(Xr, { key: "derived" }) : null,
        t && M ? r("div", {
          key: "tag-editor",
          ref: I,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (z) => {
            z.key === "Escape" && (z.preventDefault(), z.stopPropagation(), T());
          },
          onKeyDown: (z) => {
            Xd(z, t.tagName) && (z.preventDefault(), z.stopPropagation(), d(t.tagId));
          }
        }, r(cr, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (z, ke) => z == null ? T() : d(z, ke == null ? void 0 : ke.label),
          // Until lineage loads, the projection's derived flag says whether a rule sets the tag.
          disabled: ed(s ? a ?? -1 : null, t.id, l) || (C.data ? C.data.tagReadOnly === !0 : t.isDerived === !0),
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? r("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : r("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? r("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        r("span", { key: "start" }, Fe(t.startSec)),
        t.endSec == null ? null : r("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : r("span", { key: "end" }, Fe(t.endSec))
      ]) : null,
      e && t && (m === "empty" || m === "partial") ? r("div", { key: "slots-row" }, r(qc, { status: m })) : null,
      t && p && y.length > 0 ? r("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, r(Va, {
        assignments: y.map((z) => {
          const ke = ic(z);
          return {
            key: String(z.slotDefinitionId),
            label: ke.label,
            performer: ke.filled ? { id: Number(z.performerId), name: ke.performer } : null,
            title: ke.title
          };
        })
      })) : null,
      i ? r("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? r(Qc, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: w
    }) : null,
    t ? r("div", { key: "controls", hidden: !0 }, [
      r("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        r("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        C.loading ? r("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : C.error ? r("p", { key: "error", className: "mt-1 text-xs text-secondary" }, C.error) : C.data ? r("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          r(
            "p",
            { key: "summary" },
            `${C.data.derived ? "Derived segment" : "Root segment"} · ${C.data.componentSize} segment${C.data.componentSize === 1 ? "" : "s"} · ${C.data.integrityState}`
          ),
          (ve = C.data.parents) != null && ve.length ? r("div", { key: "parents" }, [
            r("span", { key: "label" }, "Parents: "),
            ...C.data.parents.map((z) => r("button", {
              key: z.nodeId,
              type: "button",
              onClick: () => A(z.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${z.ruleKey} ${z.ruleVersion}`))
          ]) : null,
          (xe = C.data.children) != null && xe.length ? r("p", { key: "children" }, `Children: ${C.data.children.length}`) : null
        ]) : r("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      r("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        r("button", { key: "apply", type: "button", disabled: s, onClick: c, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? r("button", {
          key: "slots",
          ref: x,
          type: "button",
          disabled: a != null || !p || y.length === 0,
          onClick: () => Q(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: p ? y.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, y.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        r("button", {
          key: "split",
          type: "button",
          disabled: s,
          onClick: E,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        r("button", {
          key: "duplicate",
          type: "button",
          disabled: s,
          onClick: () => S(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        r("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: s,
          onClick: () => S(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    q && e && t && p && y.length > 0 ? r("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (z) => {
        z.target === z.currentTarget && ue();
      },
      onKeyDownCapture: (z) => {
        var se, N;
        if (!(typeof ((se = z.target) == null ? void 0 : se.closest) == "function" ? z.target.closest("input, textarea, select, [contenteditable='true']") : null) && !z.repeat && !z.ctrlKey && !z.altKey && !z.metaKey && !z.shiftKey && /^[1-9]$/.test(z.key) && ((N = ye.current) != null && N.call(ye, Number(z.key) - 1))) {
          z.preventDefault(), z.stopPropagation();
          return;
        }
        Dt(z, {
          onCancel: ue,
          onConfirm: () => {
            var j;
            return (j = Ne.current) == null ? void 0 : j.click();
          }
        });
      }
    }, r("section", {
      ref: ae,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "segment-studio-slot-dialog-title",
      "data-performer-slot-dialog": "true",
      className: "flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
    }, [
      r("header", { key: "header", className: "flex shrink-0 items-start justify-between gap-4 border-b border-border px-4 py-3" }, [
        r("div", { key: "copy" }, [
          r("h2", { key: "title", id: "segment-studio-slot-dialog-title", className: "text-base font-semibold text-foreground" }, "Performer slots"),
          r("p", { key: "description", className: "mt-0.5 text-xs text-secondary" }, "Candidates matching each slot's gender hints are ranked first.")
        ]),
        r("button", { key: "close", type: "button", onClick: ue, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      r("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, r(Wc, {
        key: `${t.id}:${f.performerSlotsRevision || f.slotRevision || ""}`,
        videoId: b.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: y,
        revision: (be = f.performerSlotRevisions) == null ? void 0 : be[t.id],
        performerCandidates: f.performerCandidates || [],
        confirmRef: Ne,
        shortcutRef: ye,
        onOptimisticSave: (z) => {
          const ke = J("slots", t.id);
          if (!ke)
            return O("Wait for the current save to finish before saving performer slots."), !1;
          re.current = ke, g((se) => Fn(
            se,
            t.id,
            z
          ), b.id), O("Saving performer slots…"), ue();
        },
        onSaved: async (z, { beforeState: ke, afterState: se }) => {
          g((N) => Fn(
            N,
            t.id,
            z.slots || [],
            z.revision
          ), b.id), O("Performer slots saved.");
          try {
            await P(
              "performer-slots.assign",
              "Assigned performers",
              ke,
              se
            ), await Y(z) || L([t]);
          } finally {
            pe();
          }
        },
        onRollback: async (z, ke) => {
          L([t]), g((se) => {
            var N;
            return Fn(
              se,
              t.id,
              z,
              (N = f.performerSlotRevisions) == null ? void 0 : N[t.id]
            );
          }, b.id), O(ke.message || "Unable to save performer slots.");
          try {
            ke.status === 409 && await Y();
          } finally {
            pe();
          }
        },
        onConflict: Y
      }))
    ])) : null
  ]);
}
function Iu({ segments: e, shotBoundaries: t = [], segmentGroups: n, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: m, onZoomChange: p, onSelectGroup: y, onToggleGroup: h, onSelect: f, onSelectSegments: b, onSelectAll: x, onConfigureTag: I, onSeekTime: g, centerRef: O, showReviewState: J = !0, swimlaneTitleWidth: Y, onSwimlaneTitleWidthChange: P }) {
  const L = ce(null), E = ce(null), [S, w] = G(0), [C, A] = G({ scrollTop: 0, height: 320 }), [M, T] = G(null), _ = Je(
    () => hn(e, n, o),
    [e, n, o]
  ), ne = Je(
    () => _a(o),
    [o]
  ), U = Je(() => Ko(_), [_]), re = Je(
    () => cc(U, i, Ha(U)),
    [U, i]
  ), pe = Je(
    () => qa(re.rows, Math.max(0, C.scrollTop - 24), C.height),
    [re, C]
  ), ae = Math.max(0, Number(d) || 0), Ne = kl(S), ye = jr(Y, Ne), Me = ye / 16, q = Sl(c, ae, Me), Q = pl(ae), ue = yl(ae, Math.max(1, S - Me * 16), m), ve = Q.filter((v, u) => u === 0 || u % ue === 0), xe = Je(() => _.map((v) => `${v.key}:${v.trackCount}:${v.markers.map(({ segment: u, track: R }) => `${u.id}:${u.startSec}:${u.endSec ?? ""}:${R}`).join(",")}`).join("|"), [_]);
  function be() {
    const v = E.current;
    if (!v) return;
    const u = v.querySelector("[data-timeline-track]"), R = v.firstElementChild, V = u == null ? void 0 : u.getBoundingClientRect(), ie = R == null ? void 0 : R.getBoundingClientRect(), te = V && ie ? Math.max(0, V.left - ie.left) : Me * 16, je = (ie == null ? void 0 : ie.width) ?? v.scrollWidth;
    v.scrollTo({
      left: vl(c, ae, je, v.clientWidth, te, ma),
      behavior: "smooth"
    });
  }
  fe(() => (O.current = be, () => {
    O.current === be && (O.current = null);
  })), fe(() => {
    be();
  }, [m]);
  function z() {
    const v = E.current, u = re.rows.find((je) => je.kind === "lane" && je.lane.markers.some(({ segment: H }) => H.id === s));
    if (!v || !u) return;
    const R = 24, V = u.top + R, ie = V + u.height;
    let te = v.scrollTop;
    V < v.scrollTop + R ? te = Math.max(0, V - R) : ie > v.scrollTop + v.clientHeight && (te = Math.max(0, ie - v.clientHeight)), te !== v.scrollTop && (v.scrollTop = te), A({ scrollTop: te, height: v.clientHeight });
  }
  fe(() => {
    z();
  }, [s, xe, re]), fe(() => {
    const v = E.current, u = re.rows.find((je) => je.kind === "group" && je.group.key === a);
    if (!v || !u) return;
    const R = 24, V = u.top + R, ie = V + u.height;
    let te = v.scrollTop;
    V < v.scrollTop + R ? te = Math.max(0, V - R) : ie > v.scrollTop + v.clientHeight && (te = Math.max(0, ie - v.clientHeight)), te !== v.scrollTop && (v.scrollTop = te), A({ scrollTop: te, height: v.clientHeight });
  }, [a, re]), fe(() => {
    const v = E.current;
    if (!v || typeof ResizeObserver > "u") return;
    const u = () => {
      w(v.clientWidth), A({ scrollTop: v.scrollTop, height: v.clientHeight }), z();
    }, R = new ResizeObserver(u);
    return R.observe(v), u(), () => R.disconnect();
  }, [s, xe, re]);
  function ke(v) {
    if (!(ae > 0)) return;
    const u = v.currentTarget.getBoundingClientRect(), R = Math.min(1, Math.max(0, (v.clientX - u.left) / u.width));
    g(R * ae);
  }
  function se(v) {
    const u = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let R = null;
    Object.hasOwn(u, v.key) && (R = c + u[v.key]), v.key === "Home" && (R = 0), v.key === "End" && (R = ae), R != null && (v.preventDefault(), v.stopPropagation(), g(Math.min(ae, Math.max(0, R))));
  }
  function N(v) {
    var R;
    const u = (R = L.current) == null ? void 0 : R.getBoundingClientRect();
    u && P(jr(v.clientX - u.left, Ne));
  }
  function j(v) {
    const u = v.shiftKey ? 40 : 16;
    let R = null;
    v.key === "ArrowLeft" && (R = ye - u), v.key === "ArrowRight" && (R = ye + u), v.key === "Home" && (R = 160), v.key === "End" && (R = Ne), R != null && (v.preventDefault(), v.stopPropagation(), P(jr(R, Ne)));
  }
  const k = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return r("section", {
    ref: L,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    r("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      r("button", {
        key: "title",
        type: "button",
        onClick: (v) => {
          (v.metaKey || v.ctrlKey) && (v.preventDefault(), x == null || x());
        },
        onKeyDown: (v) => {
          v.key !== "Enter" && v.key !== " " || (v.preventDefault(), x == null || x());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      r("button", { key: "out", type: "button", className: k, disabled: m <= 1, onClick: () => p(zr(m - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      r("button", { key: "fit", type: "button", className: k, disabled: m === 1, onClick: () => p(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(m * 100)}%`),
      r("button", { key: "in", type: "button", className: k, disabled: m >= 8, onClick: () => p(zr(m + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      r("button", { key: "center", type: "button", className: k, onClick: be, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    r("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(Ne),
      "aria-valuenow": Math.round(ye),
      "aria-valuetext": `${Math.round(ye)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (v) => {
        v.currentTarget.setPointerCapture(v.pointerId), N(v);
      },
      onPointerMove: (v) => {
        v.currentTarget.hasPointerCapture(v.pointerId) && N(v);
      },
      onKeyDown: j,
      onDoubleClick: () => P(Mt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${ye - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, r("span", { className: "h-16 w-1 rounded-full bg-border" })),
    r("div", {
      key: "scroll",
      ref: E,
      onScroll: (v) => A({
        scrollTop: v.currentTarget.scrollTop,
        height: v.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, r("div", { style: xl(m) }, [
      r("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${Me}rem minmax(0,1fr)`, height: "1.5rem" } }, [
        r("div", { key: "axis-label", "data-timeline-label-gutter": "true", "aria-hidden": "true", className: "sticky left-0 z-40 border-r border-border", style: { backgroundColor: "var(--color-surface)" } }),
        r("div", {
          key: "ticks",
          role: "slider",
          tabIndex: 0,
          "data-timeline-seeker": "true",
          "data-timeline-track": "true",
          "aria-label": "Timeline seek",
          "aria-valuemin": 0,
          "aria-valuemax": ae,
          "aria-valuenow": Math.min(ae, Math.max(0, c)),
          "aria-valuetext": Fe(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: ke,
          onKeyDown: se
        }, ve.map((v, u) => r("span", {
          key: v,
          className: `absolute top-0 ${bl(u, ve.length, ae > 0 ? v / ae * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: hl(u, ve.length, ae > 0 ? v / ae * 100 : 0)
        }, Fe(v))).concat(t.map((v) => {
          const u = ae > 0 ? v.startSec / ae * 100 : 0;
          return r("button", {
            key: `shot-boundary:${v.startSec}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Fe(v.startSec)} – ${Fe(v.endSec)}`,
            title: `Shot boundary · ${v.source || "manual"} · ${Fe(v.startSec)} – ${Fe(v.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${u}%`, width: "2px" },
            onClick: (R) => {
              R.stopPropagation(), g(v.startSec);
            }
          }, [
            r("span", {
              key: "line",
              "aria-hidden": "true",
              className: "block h-full w-full bg-orange-400 opacity-60 transition-opacity group-hover:opacity-100"
            }),
            r("span", {
              key: "indicator",
              "aria-hidden": "true",
              className: "absolute bottom-0 left-0 h-1 w-1 -translate-x-1/2 rounded-full bg-orange-400 opacity-80"
            })
          ]);
        }), r("span", {
          key: "playhead",
          "data-timeline-playhead": "axis",
          "aria-hidden": "true",
          className: "pointer-events-none absolute top-0 z-20",
          style: {
            ...wi(q),
            width: "2px",
            height: "calc(100% + 2px)",
            backgroundColor: "var(--color-accent)"
          }
        })))
      ]),
      r("div", {
        key: "body",
        "data-timeline-body": "true",
        className: "relative",
        style: _.length > 0 ? { height: re.height } : void 0
      }, [
        _.length > 0 ? r("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...wi(q, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        _.length === 0 ? r("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : pe.map((v) => {
          var F;
          const u = v.group, R = i.includes(u.key), V = a === u.key, ie = Vr(V, u.color);
          if (v.kind === "group") return r("div", {
            key: v.key,
            "data-segment-group": u.key,
            "data-segment-group-collapsed": R ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${Me}rem minmax(0,1fr)`,
              backgroundColor: ie,
              top: v.top,
              height: v.height
            }
          }, [
            r("button", {
              key: "name",
              type: "button",
              onClick: ($) => {
                if ($.metaKey || $.ctrlKey) {
                  b(u.lanes.flatMap((W) => W.markers.map((me) => me.segment.id)));
                  return;
                }
                y(u.key), h(u.key);
              },
              "aria-expanded": !R,
              "aria-current": V ? "true" : void 0,
              "data-selected-timeline-group": V ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: qd(u),
                backgroundColor: ie,
                // Headers are tinted by their own group colors, so selection needs the accent to stand out.
                // An outline leaves the box-shadow hover and focus rings free.
                ...V ? { outline: "1px solid var(--color-accent)", outlineOffset: "-1px" } : {}
              },
              title: `${R ? "Expand" : "Collapse"} ${u.name}`
            }, [
              r("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, R ? "▶" : "▼"),
              r("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, u.name)
            ]),
            r(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              R ? [
                r(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${u.lanes.length} swimlane${u.lanes.length === 1 ? "" : "s"} hidden`
                ),
                J ? r(sn, { key: "states", counts: u.counts }) : null
              ] : null
            )
          ]);
          const te = v.lane, je = Hd(v.laneIndex), H = te.markers.some(({ segment: $ }) => $.id === s);
          return r("div", {
            key: v.key,
            "data-grouped-swimlane": u.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${Me}rem minmax(0,1fr)`,
              top: v.top,
              height: v.height,
              backgroundColor: je
            }
          }, [
            r("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": H ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: Wd(H, je, u.color),
              title: `${mr(te)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": mr(te),
              onClick: ($) => {
                ($.metaKey || $.ctrlKey) && b(te.markers.map((W) => W.segment.id));
              },
              onMouseEnter: () => T(te.key),
              onMouseLeave: () => T(($) => $ === te.key ? null : $)
            }, [
              te.tagId != null ? r("button", {
                key: "configure",
                type: "button",
                onClick: ($) => {
                  $.stopPropagation(), I({ tagId: te.tagId, tagName: te.label, trigger: $.currentTarget });
                },
                "aria-label": `Configure ${te.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: M === te.key ? 1 : void 0 }
              }, "⚙") : null,
              r("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, te.label),
              (F = te.performers) != null && F.length ? r(Yr, {
                key: "performers",
                performers: te.performers,
                performerAssignments: te.performerAssignments
              }) : null,
              J ? r(sn, { key: "counts", counts: te.counts }) : null
            ]),
            r("div", { key: "track", className: "relative" }, te.markers.map(({ segment: $, track: W }) => {
              var gt;
              const me = yo($.startSec, ae), he = $.endSec == null ? $.startSec : Math.max($.startSec, $.endSec), Z = Math.max(0, yo(he, ae) - me), Ke = l.includes($.id), Te = $.id === s, Ce = Uo(ne.get($.id)), Oe = $.endSec == null ? Fe($.startSec) : `${Fe($.startSec)} – ${Fe($.endSec)}`, He = (gt = Ka[Ce]) == null ? void 0 : gt.label;
              return r("button", {
                key: $.id,
                type: "button",
                onClick: (Ge) => {
                  Ge.stopPropagation(), f($, {
                    additive: Ge.metaKey || Ge.ctrlKey,
                    rangeSegmentIds: Ge.shiftKey ? te.markers.map((ft) => ft.segment.id) : null
                  });
                },
                "aria-pressed": Ke,
                "aria-current": Te ? "true" : void 0,
                "data-selected-timeline-marker": Te ? "true" : void 0,
                "data-selected-segment-shortcut-target": Te ? "true" : void 0,
                "aria-label": J ? `${$.tagName || "Tag segment"}${te.performerLabel ? `, ${te.performerLabel}` : ""}, ${$.reviewState}${He ? `, ${He}` : ""}, ${Oe}` : `${$.tagName || "Tag segment"}${te.performerLabel ? `, ${te.performerLabel}` : ""}, ${Oe}`,
                title: J ? `${$.tagName || "Tag segment"}${te.performerLabel ? ` · ${te.performerLabel}` : ""} · ${$.reviewState}${He ? ` · ${He}` : ""} · ${Oe}` : `${$.tagName || "Tag segment"}${te.performerLabel ? ` · ${te.performerLabel}` : ""} · ${Oe}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...J ? Kd($.reviewState, Ke, Ce, Te) : zd(Ke, Te),
                  left: `${me}%`,
                  top: `${Vd(W)}rem`,
                  width: _d($.endSec, Z),
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
function qo({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: n = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = G(null), [l, d] = G([]), [c, m] = G(null), [p, y] = G(""), [h, f] = G(!0), [b, x] = G(null), [I, g] = G(""), [O, J] = G(!1), Y = ce(null), P = ce(0);
  fe(() => {
    const M = requestAnimationFrame(() => {
      var T;
      return (T = Y.current) == null ? void 0 : T.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(M);
  }, [e]), fe(() => {
    const M = new AbortController();
    return f(!0), g(""), Promise.all([
      n ? ee(`/slot-definitions/${e}`, { signal: M.signal }) : Promise.resolve(null),
      ee("/segment-groups", { signal: M.signal })
    ]).then(([T, _]) => {
      const ne = _.find((U) => (U.tags || []).some((re) => Number(re.tagId) === Number(e)));
      s(T), d(_), m((ne == null ? void 0 : ne.id) ?? null), y(ne == null ? "" : String(ne.id)), J(!1);
    }).catch((T) => {
      T.name !== "AbortError" && g(T.message || "Unable to load tag configuration.");
    }).finally(() => {
      M.signal.aborted || f(!1);
    }), () => M.abort();
  }, [n, e]);
  function L(M, T) {
    s({
      ...a,
      definitions: a.definitions.map((_, ne) => ne === M ? { ..._, ...T } : _)
    });
  }
  function E(M, T) {
    const _ = M + T;
    if (_ < 0 || _ >= a.definitions.length) return;
    const ne = [...a.definitions];
    [ne[M], ne[_]] = [ne[_], ne[M]], s({
      ...a,
      definitions: ne.map((U, re) => ({ ...U, sortOrder: re }))
    });
  }
  function S(M) {
    const T = a.definitions[M], _ = Number(T.assignmentCount) || 0, ne = _ === 0 ? "" : ` and its ${_} assignment${_ === 1 ? "" : "s"}`;
    window.confirm(`Delete “${Ot(T)}”${ne}?`) && (_ > 0 && J(!0), s({
      ...a,
      definitions: a.definitions.filter((U, re) => re !== M).map((U, re) => ({ ...U, sortOrder: re }))
    }));
  }
  async function w() {
    var T;
    x("slots"), g("Saving performer slots…");
    let M;
    try {
      M = await ee(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: O,
          definitions: a.definitions.map((_, ne) => {
            var U;
            return {
              id: _.id || void 0,
              label: ((U = _.label) == null ? void 0 : U.trim()) || null,
              sortOrder: ne,
              genderHints: _.genderHints || []
            };
          })
        })
      }), s(M), J(!1);
    } catch (_) {
      _.status === 409 ? (g("Performer slots changed elsewhere; current values were reloaded."), (T = _.payload) != null && T.current && (s(_.payload.current), J(!1))) : g(_.message || "Unable to save performer slots."), x(null);
      return;
    }
    try {
      await o(), g("Performer slots saved.");
    } catch {
      g("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      x(null);
    }
  }
  async function C() {
    const M = p === "" ? null : Number(p);
    if (M !== c) {
      x("group"), g("Saving tag group…");
      try {
        await ee(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: M })
        });
      } catch (T) {
        g(T.message || "Unable to assign the tag group."), x(null);
        return;
      }
      try {
        const [T, _] = await Promise.allSettled([
          ee("/segment-groups"),
          o()
        ]);
        if (T.status === "fulfilled") {
          d(T.value);
          const ne = T.value.find((re) => (re.tags || []).some((pe) => Number(pe.tagId) === Number(e))), U = (ne == null ? void 0 : ne.id) ?? null;
          m(U), y(U == null ? "" : String(U));
        }
        g(
          T.status === "fulfilled" && _.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        x(null);
      }
    }
  }
  l.find((M) => Number(M.id) === Number(c));
  const A = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (M) => {
      M.target === M.currentTarget && !b && i();
    },
    onKeyDownCapture: (M) => Dt(M, {
      onCancel: b ? void 0 : i
    })
  }, r("section", {
    ref: Y,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: Vt,
    className: "flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
  }, [
    r("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      r("h2", {
        key: "title",
        id: "segment-studio-inline-tag-configuration-title",
        className: "text-lg font-semibold text-foreground"
      }, `Configure Tag: ${t}`),
      r(
        "p",
        { key: "description", className: "mt-1 text-sm text-secondary" },
        n ? "Assign this tag to a Cove tag group and configure its performer roles." : "Assign this tag to a Cove tag group."
      )
    ]),
    r("div", { key: "body", className: "min-h-0 flex-1 space-y-5 overflow-y-auto p-5" }, [
      r("section", { key: "group", className: "space-y-3", "aria-labelledby": "inline-tag-segment-group-heading" }, [
        r("div", { key: "heading" }, [
          r("h3", { key: "title", id: "inline-tag-segment-group-heading", className: "text-sm font-semibold text-foreground" }, "Cove tag group"),
          r(
            "p",
            { key: "copy", className: "text-xs text-secondary" },
            "Choose where this tag appears in the swimlane hierarchy."
          )
        ]),
        h ? null : r("label", { key: "choice", className: "block space-y-1 text-xs text-secondary" }, [
          r("span", { key: "label" }, "Assigned group"),
          r("select", {
            key: "select",
            value: p,
            disabled: b != null,
            onChange: (M) => y(M.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            r("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((M) => r("option", { key: M.id, value: String(M.id) }, M.name))
          ])
        ]),
        h ? null : r("button", {
          key: "save",
          type: "button",
          disabled: b != null || (p === "" ? null : Number(p)) === c,
          onClick: C,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, b === "group" ? "Saving…" : "Save tag group")
      ]),
      n ? r("section", { key: "slots", className: "space-y-3 border-t border-border pt-5", "aria-labelledby": "inline-tag-slots-heading" }, [
        r("div", { key: "heading" }, [
          r("h3", { key: "title", id: "inline-tag-slots-heading", className: "text-sm font-semibold text-foreground" }, "Performer slots"),
          r("p", { key: "copy", className: "text-xs text-secondary" }, "Define the ordered performer roles used by this tag.")
        ]),
        h ? r("p", { key: "loading", className: "rounded-md border border-dashed border-border p-4 text-sm text-secondary" }, "Loading performer slots…") : a ? r("div", { key: "editor", className: "space-y-3" }, [
          r("label", { key: "duplicates", className: "flex items-center gap-2 text-sm" }, [
            r("input", {
              key: "input",
              type: "checkbox",
              checked: !!a.allowSamePerformerInMultipleSlots,
              disabled: b != null,
              onChange: (M) => s({ ...a, allowSamePerformerInMultipleSlots: M.target.checked })
            }),
            r("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((M, T) => r("article", {
            key: M.id || M._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            r("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              r("span", { key: "label" }, "Slot label"),
              r("input", {
                key: "input",
                value: M.label || "",
                disabled: b != null,
                onChange: (_) => L(T, { label: _.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            r("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              r("legend", { key: "label" }, "Gender hints"),
              r("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, ul.map((_) => r("label", { key: _, className: "inline-flex items-center gap-1" }, [
                r("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: b != null,
                  checked: (M.genderHints || []).includes(_),
                  onChange: (ne) => L(T, {
                    genderHints: ne.target.checked ? [.../* @__PURE__ */ new Set([...M.genderHints || [], _])] : (M.genderHints || []).filter((U) => U !== _)
                  })
                }),
                r("span", { key: "text" }, Jr(_))
              ])))
            ]),
            r("div", { key: "actions", className: "flex items-end gap-1" }, [
              r("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${M.assignmentCount || 0} assigned`),
              r("button", { key: "up", type: "button", disabled: b != null || T === 0, onClick: () => E(T, -1), className: A, "aria-label": `Move ${Ot(M)} up` }, "↑"),
              r("button", { key: "down", type: "button", disabled: b != null || T === a.definitions.length - 1, onClick: () => E(T, 1), className: A, "aria-label": `Move ${Ot(M)} down` }, "↓"),
              r("button", { key: "delete", type: "button", disabled: b != null, onClick: () => S(T), className: `${A} text-red-300` }, "Delete")
            ])
          ])),
          r("div", { key: "buttons", className: "flex items-center gap-2" }, [
            r("button", {
              key: "add",
              type: "button",
              disabled: b != null,
              onClick: () => s({
                ...a,
                definitions: [...a.definitions, {
                  _clientKey: `new-${++P.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: A
            }, "Add slot"),
            r("button", {
              key: "save",
              type: "button",
              disabled: b != null,
              onClick: w,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, b === "slots" ? "Saving…" : "Save performer slots")
          ])
        ]) : null
      ]) : null,
      I ? r("p", { key: "message", role: "status", className: "text-sm text-secondary" }, I) : null
    ]),
    r(
      "footer",
      { key: "footer", className: "flex items-center justify-end border-t border-border px-5 py-4" },
      r("button", {
        type: "button",
        disabled: b != null,
        onClick: i,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Close")
    )
  ]));
}
function Cu(e, t, n) {
  if (!(e != null && e.disabled) || !n) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${n}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function $u(e) {
  const { acquireSaveLock: t, activeFilterCount: n, allSwimlanes: o, approvalFacetCounts: i, autoAssignCandidates: a, autoAssignError: s, autoAssignOpen: l, autoAssignPerformers: d, autoAssigning: c, cancelQueuedReviewsForSegments: m, canMoveSelectionToBin: p, captureTrainingExport: y, centerTimelineRef: h, closeEditorFilters: f, closeFirstSegmentTagDialog: b, closeMaterializeDialog: x, closeMergeConfirmation: I, closePublishApprovedDialog: g, closeTagEditing: O, collapsedSegmentGroups: J, commonActionsRef: Y, compatibilityMode: P, configuringTag: L, createSegment: E, creatingSegmentId: S, currentTime: w, deleteRejectedSegments: C, detail: A, detailPanelRef: M, detailWidth: T, duplicateSegment: _, editorFilters: ne, editorLayout: U, editorRef: re, exportingExamples: pe, filtersButtonRef: ae, filtersOpen: Ne, firstSegmentTagOpen: ye, focusRowRef: Me, handleSeparatorKeyDown: q, handleSeparatorPointerDown: Q, handleSeparatorPointerMove: ue, hasNextUnreviewed: ve, hasPreviousUnreviewed: xe, hideDerivedSegments: be, history: z, historyOpen: ke, historySaving: se, horizontalLayoutSize: N, importNativeSegments: j, incorrectExamples: k, incorrectExamplesOpen: v, lineage: u, markerRailWidth: R, materializeButtonRef: V, materializeCancelButtonRef: ie, materializeDerivedSegments: te, materializeError: je, materializeLoading: H, materializeOpen: F, materializePreview: $, materializing: W, mediaStackRef: me, mergeCancelButtonRef: he, mergeConfirmation: Z, mergeSaving: Ke, mergeSelectedSwimlane: Te, nativeImportState: Ce, onDetailChange: Oe, onNavigate: He, onReload: gt, onSlotsChanged: Ge, openPublishApprovedDialog: ft, panelSeparatorProps: ot, pendingInitialSeekRef: Pe, performerSlots: rt, performerSlotsAvailable: xt, playbackControlsRef: lt, previewDerivedSegments: ht, provenance: Ze, provenanceSources: it, publishApprovedCancelButtonRef: B, publishApprovedDrafts: X, publishApprovedError: le, publishApprovedOpen: ge, quickSearchOpen: de, railScrollRef: De, railToggleRef: Ee, recordHistoryAction: Xe, rejectedDeletionPreview: Le, removeIncorrectExample: tt, removingExampleId: We, restoreHistoryTarget: Ae, runEditorAction: $e, saveMessage: et, saveTag: Ue, saveTiming: Be, savingSegmentId: we, editorHeldByOtherWork: Gt, segmentCreationPending: qe, selectionBusy: vt, seekRef: At, segmentGroups: nt, segmentRailLayout: Re, segments: Ie, selectAllVideoSegments: dt, selectSegment: kt, selectSegmentCollection: bt, selectedGroups: Ht, selectedPerformerSlots: St, selectedSegment: It, selectedSegmentGroupKey: Zt, selectedSegmentIds: dn, selectedSegments: en, selectedSlotStatus: Kn, setAutoAssignError: zn, setAutoAssignOpen: br, setConfiguringTag: hr, setCurrentTime: _n, setEditorFilters: vr, setEditorLayout: Hn, setFiltersOpen: cn, setHideDerivedSegments: xn, setHistoryOpen: kn, setIncorrectExamplesOpen: Sr, setQuickSearchOpen: qn, setRailViewport: Zr, setRejectedDeletionPreview: Wn, setSaveMessage: Vn, setSelectedSegmentGroupKey: Jn, setSelectedSegmentId: wn, setShortcutsOpen: xr, setTimelineZoom: kr, shotBoundaries: Yn, shortcutsOpen: un, slotButtonRef: Qn, splitLayout: Bt, splitSegment: Ct, stepVideoFrame: Xn, tagEditing: Zn, tagSearchRef: wr, timelineDuration: Nr, timelineRatioBounds: Nn, timelineZoom: er, toggleSegmentGroup: Ir, toggleSegmentRail: eo, updateTimelineRatio: tr, video: at, videoPerformers: In, visibleCounts: st, visibleSegmentRailRows: wt, visibleSegments: Cr, wideLayout: mn, workspaceRef: qt } = e;
  Od(at ? at.title || `Video ${at.id}` : null);
  const $t = Je(
    () => Ie.filter((K) => !K.published && K.reviewState === "approved"),
    [Ie]
  ), $r = ol(Ao), gn = $t.length, Cn = ce(null), nr = Je(() => () => kn(!1), [kn]), $n = $ ? $.createCount + $.linkCount : null, fn = en.length > 0, Tn = en.length === 1, to = fn && en.every((K) => K.reviewState === "approved"), no = fn && en.every((K) => K.reviewState === "rejected"), tn = [
    // Segment edits queue behind saves of other segments; only saves of the selection, or work that
    // holds the whole editor, disable them.
    // A create already waiting would be repeated by a second press, so it waits for that one.
    { id: "marker.create", label: "New segment", disabled: Gt || qe },
    // Retagging several segments at once holds the whole editor, so it waits for every save.
    { id: "marker.editTag", label: "Edit tag", disabled: vt || !fn || en.length > 1 && we != null },
    { id: "marker.setStart", label: "Set start", disabled: vt || !Tn },
    { id: "marker.setEnd", label: "Set end", disabled: vt || !Tn },
    { id: "marker.split", label: "Split", disabled: vt || !Tn },
    ...P ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !xe, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: to ? "Unapprove" : "Approve", disabled: vt || !fn, tone: "approve" },
      { id: "marker.reject", label: no ? "Unreject" : "Reject", disabled: vt || !fn, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !ve, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...P ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: we != null || !p, tone: "reject" }
    ]
  ];
  function Jt(K) {
    const Ve = dn.includes(K.id), Pt = K.id === (It == null ? void 0 : It.id), ct = K.endSec == null ? Fe(K.startSec) : `${Fe(K.startSec)} – ${Fe(K.endSec)}`, Lt = `${_t(K.sourceKey)}${K.confidence != null ? ` · ${Math.round(K.confidence * 100)}%` : ""}`;
    return r("button", {
      key: K.id,
      type: "button",
      onClick: (ze) => kt(K, { additive: ze.metaKey || ze.ctrlKey }),
      "aria-pressed": Ve,
      "aria-current": Pt ? "true" : void 0,
      "data-selected-segment-shortcut-target": Pt ? "true" : void 0,
      "aria-label": P ? `${K.tagName || "Tag segment"}, ${K.reviewState}${K.isDerived ? ", derived segment" : ""}, ${ct}` : `${K.tagName || "Tag segment"}${K.isDerived ? ", derived segment" : ""}, ${ct}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: Ua(Ve, Pt)
    }, [
      r("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        P ? r(Sn, { key: "review", state: K.reviewState, includeLabel: !1 }) : null,
        K.isDerived ? r(Xr, { key: "derived" }) : null,
        r(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          K.tagName || "Tag segment"
        ),
        r("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, ct),
        r("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: Lt
        }, Lt)
      ])
    ]);
  }
  const Rn = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", En = [...z.actions || []].reverse().find((K) => K.sequence <= z.cursorSequence);
  return r("section", {
    ref: re,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${Bt ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    r("header", { key: "header", className: "relative flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      r("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        r("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          r("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (K) => os(K, He, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          r("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, r("a", {
            href: `/video/${at.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: at.title || `Video ${at.id}`
          }, at.title || `Video ${at.id}`)),
          ...In.map((K) => r(gr, {
            key: yt(K),
            performer: { id: yt(K), name: K.name },
            compact: !0,
            tooltip: K.name
          })),
          P ? r(sn, { key: "review-counts", counts: st }) : null
        ]),
        r("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          P ? null : r(ss, { key: "bin", onNavigate: He, compact: !0 }),
          r(ls, { key: "settings", onNavigate: He, compact: !0 })
        ])
      ]),
      P && A.nativeImportCount > 0 ? r("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        r(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${A.nativeImportCount} Cove segment${A.nativeImportCount === 1 ? "" : "s"} ${A.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        Ce.busy ? r("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, Ce.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          r("button", {
            key: "review",
            type: "button",
            onClick: () => j("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          r("button", {
            key: "approved",
            type: "button",
            onClick: () => j("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        Ce.error ? r("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, Ce.error) : null
      ]) : null,
      r("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        r("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          // Run AI and any other contributed video action, rendered by the host
          // exactly as they are on a video's own page rather than reimplemented here.
          // The host queues the run and returns at once. In Full mode,
          // useSegmentAnalysis reloads the editor when Segment Studio's review
          // results for the run arrive.
          at != null && at.id ? r(Ed, {
            key: "extension-actions",
            entityType: "video",
            entityId: at.id,
            pageType: cl,
            renderMode: "toolbar"
          }) : null,
          P ? r("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: we != null || a.length === 0,
            onClick: () => {
              zn(""), br(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${a.length ? ` (${a.length})` : ""}`) : null,
          P ? r("button", {
            key: "materialize-derived",
            ref: V,
            type: "button",
            disabled: we != null || H || W || $n === 0,
            onClick: ht,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, H ? "Analyzing…" : `Auto-Materialize${$n != null ? ` (${$n})` : ""}`) : null,
          P ? r("button", {
            key: "complete-review",
            type: "button",
            disabled: we != null || gn === 0,
            onClick: (K) => ft(K.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": ge,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${gn ? ` (${gn})` : ""}`) : null,
          r("button", {
            key: "feedback",
            type: "button",
            disabled: pe || We != null || k.length === 0,
            onClick: () => Sr(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": v,
            "aria-label": `Open AI feedback collection, ${k.length} example${k.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${k.length ? ` (${k.length})` : ""}`)
        ]),
        r("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          r("button", {
            key: "filters",
            ref: ae,
            type: "button",
            onClick: () => cn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": Ne,
            className: `${Rn} ${n ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            r(Lr, { key: "icon", name: "filter" }),
            r("span", { key: "label" }, `Filter${n ? ` (${n})` : ""}`)
          ]),
          r("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => xr(!0),
            className: Rn
          }, [r(Lr, { key: "icon", name: "keyboard" }), r("span", { key: "label" }, "Shortcuts")]),
          r("button", {
            key: "history",
            ref: Cn,
            type: "button",
            disabled: (P ? z.actions.length === 0 : En == null) || we != null || se,
            onClick: P ? () => kn((K) => !K) : () => Ae(
              En.sequence - 1
            ),
            "aria-controls": P ? ds : void 0,
            "aria-expanded": P ? ke : void 0,
            className: Rn
          }, [
            r(Lr, { key: "icon", name: "history" }),
            r("span", { key: "label" }, P ? `History${z.actions.length ? ` (${z.actions.length})` : ""}` : En ? `Undo ${En.label}` : "Undo")
          ]),
          r("button", {
            key: "rail",
            ref: Ee,
            type: "button",
            onClick: eo,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": U.markerRailOpen,
            className: Rn
          }, [
            r(Lr, { key: "icon", name: "list" }),
            r("span", { key: "label" }, U.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ]),
      P && ke ? r(gu, {
        key: "history-popover",
        history: z,
        historySaving: se,
        anchorRef: Cn,
        onRestore: Ae,
        onClose: nr
      }) : null
    ]),
    Ne ? r(mu, {
      key: "editor-filters",
      filters: ne,
      hideDerivedSegments: be,
      performers: In,
      provenanceSources: it,
      reviewCounts: i,
      segments: Ie,
      segmentGroups: nt,
      reviewMode: P,
      onChange: vr,
      onHideDerivedChange: xn,
      onClose: f
    }) : null,
    ye ? r(uu, {
      key: "first-segment-tag-dialog",
      saving: we != null,
      error: et,
      onSelect: (K, Ve) => E(K, Ve),
      onClose: b
    }) : null,
    de ? r(yu, {
      key: "quick-search-dialog",
      segments: $d(o),
      onSelect: (K) => {
        qn(!1), kt(K, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        qn(!1), requestAnimationFrame(() => {
          var K;
          return (K = re.current) == null ? void 0 : K.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    l ? r(vu, {
      key: "auto-assign-dialog",
      candidates: a,
      processing: c,
      error: s,
      onConfirm: d,
      onClose: () => br(!1)
    }) : null,
    Z ? r(xu, {
      key: "merge-selection-dialog",
      merge: Z,
      processing: Ke,
      undoable: !P,
      cancelButtonRef: he,
      onConfirm: (K) => Te(!0, K, Z),
      onClose: I
    }) : null,
    F ? r(wu, {
      key: "materialize-derived-dialog",
      preview: $,
      loading: H,
      processing: W,
      error: je,
      cancelButtonRef: ie,
      onConfirm: te,
      onClose: () => {
        W || x();
      }
    }) : null,
    r("div", {
      key: "workspace",
      ref: qt,
      className: `${Bt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      U.markerRailOpen ? r("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: mn ? { position: "absolute", top: 0, right: 0, width: R, height: N.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        Ie.length === 0 ? r("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : Cr.length === 0 ? r(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : r("div", {
          key: "segments",
          ref: De,
          onScroll: (K) => Zr({
            scrollTop: K.currentTarget.scrollTop,
            height: K.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, r("div", {
          className: "relative",
          style: { height: Re.height }
        }, wt.map((K) => {
          var Pt;
          let Ve;
          if (K.kind === "group") {
            const ct = J.includes(K.group.key), Lt = K.group.lanes.reduce((ze, Tr) => ze + Tr.markers.length, 0);
            Ve = r("button", {
              type: "button",
              onClick: () => {
                Jn(K.group.key), Ir(K.group.key);
              },
              "aria-expanded": !ct,
              "aria-current": Zt === K.group.key ? "true" : void 0,
              "data-segment-rail-group": K.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${Zt === K.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              r("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, ct ? "▸" : "▾"),
              r("span", { key: "name", className: "min-w-0 flex-1 truncate", title: K.group.name }, K.group.name),
              r("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Lt),
              P && ct ? r(sn, { key: "states", counts: K.group.counts }) : null
            ]);
          } else K.kind === "lane" ? Ve = r("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: mr(K.lane),
            "aria-label": mr(K.lane)
          }, [
            r("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, K.lane.label),
            (Pt = K.lane.performers) != null && Pt.length ? r(Yr, {
              key: "performers",
              performers: K.lane.performers,
              performerAssignments: K.lane.performerAssignments
            }) : null,
            P ? r(sn, { key: "states", counts: K.lane.counts }) : null
          ]) : Ve = Jt(K.segment);
          return r("div", {
            key: K.key,
            className: "absolute left-0 right-0",
            style: { top: K.top, height: K.height }
          }, Ve);
        })))
      ]) : null,
      r("div", { key: "review-pane", className: `${Bt ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        r("div", {
          key: "media-stack",
          ref: me,
          className: `${Bt ? "min-h-0 flex-1" : ""} grid`,
          style: Bt ? {
            gridTemplateRows: `minmax(16rem, ${(1 - U.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${U.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          r("div", {
            key: "focus-row",
            ref: Me,
            className: "grid min-h-0 gap-2",
            style: mn ? {
              gridTemplateColumns: U.markerRailOpen ? `${T}px 0.5rem minmax(0,1fr) 0.5rem ${R}px` : `${T}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            r(Nu, {
              key: "tools",
              compatibilityMode: P,
              selectedSegment: It,
              selectedSegments: en,
              selectedGroups: Ht,
              saveMessage: et,
              savingSegmentId: we,
              selectionBusy: vt,
              creatingSegmentId: S,
              acquireSaveLock: t,
              setSaveMessage: Vn,
              saveTag: Ue,
              slotStatus: Kn,
              performerSlotsAvailable: xt,
              selectedPerformerSlots: St,
              performerSlots: rt,
              detail: A,
              onDetailChange: Oe,
              onCancelQueuedReview: m,
              video: at,
              slotButtonRef: Qn,
              tagSearchRef: wr,
              tagEditing: Zn,
              onCancelTagEditing: O,
              detailPanelRef: M,
              onReduceSelection: (K) => {
                kt(K), requestAnimationFrame(() => {
                  var Ve;
                  return (Ve = M.current) == null ? void 0 : Ve.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Be,
              onSlotsChanged: Ge,
              onRecordHistory: Xe,
              splitSegment: Ct,
              duplicateSegment: _,
              provenance: Ze,
              lineage: u,
              onNavigateLineageItem: (K) => {
                const Ve = Ie.find((Pt) => Pt.itemId === K);
                Ve && wn(Ve.id);
              }
            }),
            mn ? r(
              "div",
              { key: "detail-separator", ...ot("detailWidth", "Resize segment details") },
              r("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            at.videoFile ? r(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              r("div", { className: "h-full min-h-0 w-full" }, r(ta, {
                streamUrl: `/api/stream/video/${at.id}`,
                posterUrl: `/api/stream/video/${at.id}/screenshot?v=${encodeURIComponent(at.updatedAt || "")}`,
                format: at.videoFile.format,
                audioCodec: at.videoFile.audioCodec,
                duration: at.videoFile.duration,
                videoId: at.id,
                trackingEnabled: !1,
                onSeekRegister: (K) => {
                  At.current = K, wd(Pe.current, Ie, K) && (Pe.current = null);
                },
                onPlaybackControlRegister: (K) => {
                  lt.current = K;
                },
                onTimeUpdate: _n
              }))
            ) : r("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            mn && U.markerRailOpen ? r(
              "div",
              { key: "rail-separator", ...ot("markerRailWidth", "Resize segment rail") },
              r("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            mn && U.markerRailOpen ? r("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          r("div", {
            key: "common-actions",
            ref: Y,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...tn.map((K) => {
              var ct;
              const Ve = (ct = $r[K.id]) == null ? void 0 : ct[0], Pt = K.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : K.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return r("button", {
                key: K.id,
                type: "button",
                disabled: K.disabled,
                "data-action-id": K.id,
                onClick: (Lt) => {
                  const ze = Lt.currentTarget;
                  $e(K.id, { target: ze, preserveFocus: !0 }), K.focusWhenDisabled && requestAnimationFrame(() => {
                    Cu(ze, Y.current, K.focusWhenDisabled);
                  });
                },
                title: Ve ? `${K.label} (${Ve})` : K.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${Pt}`
              }, [
                r("span", { key: "label" }, K.label),
                Ve ? r("kbd", {
                  key: "shortcut",
                  className: "rounded border border-border/70 bg-background/70 px-1 py-0.5 font-mono text-[10px] leading-none text-secondary"
                }, Ve) : null
              ]);
            }),
            r("div", { key: "frame-actions", className: "ml-auto flex items-center gap-1" }, [
              r("button", {
                key: "previous-frame",
                type: "button",
                disabled: !at.videoFile,
                onClick: () => Xn(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, r(sl, { className: "h-4 w-4", "aria-hidden": !0 })),
              r("button", {
                key: "next-frame",
                type: "button",
                disabled: !at.videoFile,
                onClick: () => Xn(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, r(ll, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          Bt ? r("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(Nn.minimum * 100),
            "aria-valuemax": Math.round(Nn.maximum * 100),
            "aria-valuenow": Math.round(U.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(U.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: Q,
            onPointerMove: ue,
            onKeyDown: q,
            onDoubleClick: () => tr(Mt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, r("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          r("div", { key: "timeline", className: "min-h-0", style: Bt ? void 0 : { height: "20rem" } }, r(Iu, {
            segments: Cr,
            shotBoundaries: Yn,
            segmentGroups: nt,
            performerSlots: rt,
            collapsedGroupKeys: J,
            selectedGroupKey: Zt,
            selectedSegmentId: It == null ? void 0 : It.id,
            selectedSegmentIds: dn,
            duration: Nr,
            currentTime: w,
            zoom: er,
            onZoomChange: kr,
            onSelectGroup: Jn,
            onToggleGroup: Ir,
            onSelect: (K, Ve) => kt(K, Ve),
            onSelectSegments: bt,
            onSelectAll: dt,
            onConfigureTag: (K) => hr(K),
            onSeekTime: (K) => {
              var Ve;
              return (Ve = At.current) == null ? void 0 : Ve.call(At, K, !1);
            },
            centerRef: h,
            showReviewState: P,
            swimlaneTitleWidth: U.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (K) => Hn((Ve) => ({ ...Ve, swimlaneTitleWidth: K }))
          }))
        ])
      ])
    ]),
    L ? r(qo, {
      key: `configure-tag:${L.tagId}`,
      tagId: L.tagId,
      tagName: L.tagName,
      performerSlotsEnabled: P,
      onSaved: gt,
      onClose: () => {
        const K = L.trigger;
        hr(null), requestAnimationFrame(() => {
          var Ve;
          K != null && K.isConnected ? K.focus({ preventScroll: !0 }) : (Ve = re.current) == null || Ve.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    ge ? r(hu, {
      key: "publish-approved-dialog",
      drafts: $t,
      processing: we === -1,
      error: le,
      cancelButtonRef: B,
      onConfirm: X,
      onClose: g
    }) : null,
    Le ? r(Su, {
      key: "rejected-deletion-dialog",
      preview: Le,
      onConfirm: () => {
        C(Le), requestAnimationFrame(() => {
          var K;
          return (K = re.current) == null ? void 0 : K.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Wn(null), requestAnimationFrame(() => {
          var K;
          return (K = re.current) == null ? void 0 : K.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    un ? r(fu, {
      key: "shortcuts-dialog",
      reviewMode: P,
      bindings: $r,
      onClose: () => xr(!1)
    }) : null,
    v ? r(pu, {
      key: "incorrect-examples-dialog",
      examples: k,
      exporting: pe,
      removingExampleId: We,
      onExport: y,
      onRemove: tt,
      onClose: () => Sr(!1)
    }) : null
  ]);
}
function Tu(e) {
  const { allSwimlanes: t, editorRef: n, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: m, setCollapsedSegmentGroups: p, setEditorFilters: y, setHideDerivedSegments: h, setSaveMessage: f, setSelectedSegmentGroupKey: b, setSelectedSegmentId: x, setSelectedSegmentIds: I } = e;
  function g(L) {
    const E = Kt(t, L);
    E && p((S) => Ja(S, E));
  }
  function O(L) {
    x(L), I(L == null ? [] : [L]), c.current = L, m.current = [];
  }
  function J(L, {
    focusEditor: E = !1,
    seekToSegment: S = !1,
    additive: w = !1,
    rangeSegmentIds: C = null
  } = {}) {
    var M, T;
    const A = Ll({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: m.current
    }, L.id, C, w);
    I(A.selectedSegmentIds), x(A.activeSegmentId), c.current = A.anchorSegmentId, m.current = A.rangeBaseSegmentIds, A.activeSegmentId != null && b(Kt(t, A.activeSegmentId)), g(L.id), E && ((M = n.current) == null || M.focus({ preventScroll: !0 })), S && ((T = i.current) == null || T.call(i, L.startSec, !1));
  }
  function Y(L) {
    const E = Ol(
      d,
      l,
      L
    );
    I(E.selectedSegmentIds), x(E.activeSegmentId), c.current = E.activeSegmentId, m.current = [], E.activeSegmentId != null && (b(Kt(t, E.activeSegmentId)), g(E.activeSegmentId));
  }
  function P() {
    var S;
    const L = Fl(s), E = L.includes(l) ? l : L[0] ?? null;
    y(Ft({})), h(!1), I(L), x(E), c.current = E, m.current = [], E != null && b(Kt(
      hn(s, a, o),
      E
    )), f(L.length === 0 ? "There are no segments to select." : `${L.length} segments selected. Collapsed Segment groups keep their selected segments.`), (S = n.current) == null || S.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: g, replaceSegmentSelection: O, selectSegment: J, selectSegmentCollection: Y, selectAllVideoSegments: P };
}
function Ru(e) {
  const { acceptHistory: t, acquireSaveLock: n, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, pendingChanges: c, stableSaveIdentity: m, historyRef: p, onConflict: y, onDetailChange: h, onReload: f, recordHistoryAction: b, revealSegmentGroupForSelection: x, savingSegmentId: I, selectedGroups: g, selectedSegment: O, selectedSegmentIdRef: J, selectedSegments: Y, selectionAnchorIdRef: P, selectionRangeBaseIdsRef: L, setMergeConfirmation: E, setSaveMessage: S, setSelectedSegmentId: w, setSelectedSegmentIds: C, video: A } = e;
  function M() {
    E(null), requestAnimationFrame(() => {
      var U;
      return (U = a.current) == null ? void 0 : U.focus({ preventScroll: !0 });
    });
  }
  async function T(U = !1, re = !1, pe = null) {
    if (I != null) return;
    const ae = pe || Wa(
      g,
      { nativeOnly: !o }
    );
    if (!ae) {
      S("Select at least two segments from one swimlane.");
      return;
    }
    if (!U && pa()) {
      E(ae);
      return;
    }
    re && ya(!1);
    const Ne = ae.endSec == null ? "open end" : Fe(ae.endSec);
    let ye = ae.segments[0];
    const Me = o ? null : jt(ae.segments, !1), q = o ? null : crypto.randomUUID(), Q = ae.segments.map((z) => z.id), ue = Ic(i, ae.segments).segments.find((z) => z.id === ye.id), ve = {
      startSec: ue.startSec,
      endSec: ue.endSec,
      sourceKey: ue.sourceKey,
      sourceRunId: ue.sourceRunId,
      confidence: ue.confidence,
      isDerived: ue.isDerived
    }, xe = n("merge", ae.segments[0].id);
    if (!xe) return;
    M();
    const be = Tt();
    s({
      type: "add",
      entry: { id: be, op: "merge", targets: ae.segments.map(pt), values: ve }
    }), C([ye.id]), w(ye.id), P.current = ye.id, L.current = [];
    try {
      const z = ae.segments.slice(1);
      if (!o || ye.nativeSegmentId != null) {
        const ke = z.map((N) => {
          const j = `merge-native-selection:${A.id}:${ye.id}:${N.id}:${ye.updatedAt}:${N.updatedAt}`;
          return { key: j, operationId: Ye(j), segmentId: N.id, expectedUpdatedAt: N.updatedAt };
        }), se = await ee(`/videos/${A.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: ye.id,
            expectedSurvivorUpdatedAt: ye.updatedAt,
            consumedSegments: ke.map(({ key: N, ...j }) => j),
            historyReceiptId: q
          })
        });
        ye = se.survivor, h((N) => Ki(N, se), A.id), s({ type: "confirm", key: be, applied: !0 }), ke.forEach(({ key: N }) => Qe(N));
      } else {
        const ke = z.map((N) => {
          const j = `merge-draft-selection:${A.id}:${ye.itemId}:${N.itemId}:${ye.revision}:${N.revision}`;
          return { key: j, operationId: Ye(j), itemId: N.itemId, expectedRevision: N.revision };
        }), se = await ee(`/videos/${A.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: ye.itemId,
            expectedSurvivorRevision: ye.revision,
            consumedDrafts: ke.map(({ key: N, ...j }) => j)
          })
        });
        ye = se.survivor, h((N) => Ki(N, se), A.id), s({ type: "confirm", key: be, applied: !0 }), ke.forEach(({ key: N }) => Qe(N));
      }
      C([ye.id]), w(ye.id), P.current = ye.id, L.current = [], o ? t(Qt) : await b(
        "segments.merge",
        `Merged ${ae.segments.length} segments`,
        Me,
        jt([ye], !1),
        q
      ), x(ye.id), S(`${ae.segments.length} segments merged into ${Fe(ae.startSec)} – ${Ne}.`);
    } catch (z) {
      s({ type: "discard", key: be }), C(Q), w((O == null ? void 0 : O.id) ?? Q[0] ?? null), P.current = (O == null ? void 0 : O.id) ?? Q[0] ?? null, L.current = [], z.status === 409 ? await y() : S(z.message || "Unable to merge selected segments.");
    } finally {
      xe();
    }
  }
  function _(U, re = Y, pe = O) {
    if (re.length === 0) return Promise.resolve(null);
    const ae = Jl(U, re, pe), Ne = Math.max(0, ae.identities.indexOf(ae.activeIdentity)), ye = d(), Me = Qa(ye) != null || ye.queued.some((z) => Qr(z.targets, ae.identities.map(m))), q = _o(re, (c || []).filter((z) => z.op !== "insert")), Q = Ei(q, U), ue = q.filter((z) => z.reviewState !== Q).map(pt), ve = ue.length > 0 ? Tt() : null;
    ve && s({
      type: "add",
      entry: { id: ve, op: "patch", targets: ue, values: { reviewState: Q } }
    });
    const xe = () => {
      ve && s({ type: "discard", key: ve });
    }, be = l({
      kind: "review",
      lockId: ae.activeIdentity.id,
      targets: ae.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (z) => (xe(), ne(z, {
        ...ae,
        identities: z.targets,
        activeIdentity: z.targets[Ne]
      }))
    });
    return be ? (Me && S(`${U === "approved" ? "Approval" : "Rejection"} queued…`), be.done.then((z) => (z.status !== "fulfilled" && xe(), z))) : (xe(), S("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function ne({ detail: U, segments: re, onConflict: pe, onReload: ae }, Ne) {
    var se;
    const ye = Yl(Ne, re);
    if (!ye) {
      S("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: Me, selectedSegments: q, selectedSegment: Q } = ye, ue = Ei(q, Me), ve = q.filter((N) => N.reviewState !== ue);
    if (ve.length === 0) return;
    const xe = q.map((N) => ({
      id: N.id,
      itemId: N.itemId,
      nativeSegmentId: N.nativeSegmentId
    })), be = xe.find((N) => N.id === (Q == null ? void 0 : Q.id)) || xe[0], z = (N, j = !1) => {
      if (!(N != null && N.segments) || !j && !So(J.current, be.id))
        return;
      const k = xe.map((u) => mt(N == null ? void 0 : N.segments, u)).filter(Boolean), v = mt(N == null ? void 0 : N.segments, be) || k[0] || null;
      C(k.map((u) => u.id)), w((v == null ? void 0 : v.id) ?? null), P.current = (v == null ? void 0 : v.id) ?? null, L.current = [];
    };
    S(`Updating ${ve.length} selected segment${ve.length === 1 ? "" : "s"}…`);
    const ke = Tt();
    s({
      type: "add",
      entry: { id: ke, op: "patch", targets: ve.map(pt), values: { reviewState: ue } }
    });
    try {
      const N = await ee(`/videos/${A.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: p.current.revision,
          reviewState: ue,
          segments: q.map((u) => u.published ? {
            nativeSegmentId: u.nativeSegmentId,
            expectedUpdatedAt: u.updatedAt
          } : {
            itemId: u.itemId,
            expectedRevision: u.revision
          })
        })
      }), j = new Map((N.items || []).map((u) => [
        u.requestedNativeSegmentId != null ? `native:${u.requestedNativeSegmentId}` : `item:${u.requestedItemId}`,
        u
      ]));
      if (xe.forEach((u) => {
        const R = j.get(u.nativeSegmentId != null ? `native:${u.nativeSegmentId}` : `item:${u.itemId}`);
        R && (u.nativeSegmentId = R.nativeSegmentId, u.itemId = R.itemId);
      }), N.history && t(N.history), ue === "rejected" && !N.editorDelta || (N.items || []).some((u) => u.requestedNativeSegmentId != null && u.nativeSegmentId !== u.requestedNativeSegmentId)) {
        const u = await ae();
        s({ type: "confirm", key: ke, applied: u != null }), z(u), S(`${N.updatedCount} selected segment${N.updatedCount === 1 ? "" : "s"} ${ue === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const v = N.editorDelta ? (u) => an(u, N.editorDelta) : (u) => ({
        ...u,
        approvedSetVersion: N.approvedSetVersion || u.approvedSetVersion,
        segments: (u.segments || []).map((R) => {
          const V = j.get(R.nativeSegmentId != null ? `native:${R.nativeSegmentId}` : `item:${R.itemId}`);
          return V ? {
            ...R,
            id: V.nativeSegmentId != null ? V.nativeSegmentId : -V.itemId,
            itemId: V.itemId,
            nativeSegmentId: V.nativeSegmentId,
            published: V.nativeSegmentId != null,
            reviewState: ue,
            revision: V.nativeSegmentId != null ? R.revision : V.revision,
            updatedAt: V.updatedAt
          } : R;
        })
      });
      h(v, A.id), s({ type: "confirm", key: ke, applied: !0 }), z(v(U)), S(`${N.updatedCount} selected segment${N.updatedCount === 1 ? "" : "s"} ${ue === "approved" ? "approved" : ue === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (N) {
      s({ type: "discard", key: ke }), N.status === 409 && ((se = N.payload) != null && se.currentHistory) && t(N.payload.currentHistory);
      const j = N.status === 409 ? await pe() : U;
      z(j, !0), S(N.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: M, mergeSelectedSwimlane: T, saveSelectedReviewState: _ };
}
function Eu(e) {
  const { acceptHistory: t, acquireSaveLock: n, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: m, detail: p, displayedSelectedSegment: y, editorFilters: h, editorRef: f, cancelSaveTasks: b, dispatchPendingChanges: x, enqueueSave: I, stableSaveIdentity: g, exportingExamples: O, hideDerivedSegments: J, incorrectExamples: Y, lineage: P, materializeButtonRef: L, materializePreview: E, materializeRestoreFocusRef: S, materializing: w, mutateSegment: C, runSegmentMutation: A, pendingChanges: M, onConflict: T, onDetailChange: _, onReload: ne, performerSlots: U, recordHistoryAction: re, refreshMaterializationPreview: pe, removingExampleId: ae, revealSegmentGroupForSelection: Ne, savingSegmentId: ye, segmentGroups: Me, segments: q, selectedSegment: Q, selectedSegmentIdRef: ue, selectedSegments: ve, selectionAnchorIdRef: xe, selectionRangeBaseIdsRef: be, setAutoAssignError: z, setAutoAssignOpen: ke, setAutoAssigning: se, setEditorFilters: N, setExportingExamples: j, setHideDerivedSegments: k, setIncorrectExamples: v, setMaterializeError: u, setMaterializeLoading: R, setMaterializeOpen: V, setMaterializePreview: ie, setMaterializing: te, setRejectedDeletionPreview: je, setRemovingExampleId: H, setSaveMessage: F, setSelectedSegmentGroupKey: $, setSelectedSegmentId: W, setSelectedSegmentIds: me, swimlanes: he, video: Z } = e;
  async function Ke() {
    var Ae, $e, et;
    if (ve.length === 0 || !Q || ye != null) return;
    const B = vc(ve, Y), X = B.segments;
    if (X.length === 0) return;
    const le = ve.map((Ue) => ({
      id: Ue.id,
      itemId: Ue.itemId,
      nativeSegmentId: Ue.nativeSegmentId
    })), ge = le.find((Ue) => Ue.id === Q.id) || le[0], de = [], De = [];
    let Ee = !1, Xe = p, Le = !1;
    const tt = [], We = n("feedback", ge.id);
    if (We) {
      F(B.action === "remove" ? `Removing ${X.length} selected incorrect example${X.length === 1 ? "" : "s"}…` : `Collecting ${X.length} selected segment${X.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const Ue = async (Re, Ie) => {
          const dt = Re.nativeSegmentId != null, kt = B.action === "remove" ? `incorrect-example-remove:${Z.id}:${Ie == null ? void 0 : Ie.id}:${Ie == null ? void 0 : Ie.revision}:${Ie == null ? void 0 : Ie.representationRevision}` : `incorrect-example-collect:${Z.id}:${dt ? `native:${Re.nativeSegmentId}:${Re.updatedAt}` : `item:${Re.itemId}:${Re.revision}`}`;
          if (B.action === "remove" && !Ie)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let bt;
          try {
            bt = B.action === "remove" ? await ee(
              `/videos/${Z.id}/incorrect-examples/${Ie.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: Ye(kt),
                  expectedExampleRevision: Ie.revision,
                  expectedRepresentationRevision: Ie.representationRevision
                })
              }
            ) : await ee(`/videos/${Z.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Ye(kt),
                nativeSegmentId: dt ? Re.nativeSegmentId : null,
                itemId: dt ? null : Re.itemId,
                expectedUpdatedAt: dt ? Re.updatedAt : null,
                expectedRevision: dt ? null : Re.revision
              })
            });
          } catch (Ht) {
            throw Ht.operationKey = kt, Ht;
          }
          if (!Sc(B.action, bt))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return Qe(kt), bt;
        };
        for (const Re of X) {
          const Ie = B.action === "remove" ? Y.find((dt) => dt.itemId != null && dt.itemId === Re.itemId) : null;
          try {
            const dt = le.find((St) => St.id === Re.id);
            let kt = mt(
              Xe == null ? void 0 : Xe.segments,
              dt
            ) || Re, bt;
            try {
              bt = await Ue(kt, Ie);
            } catch (St) {
              if (St.status === 409 && (($e = (Ae = St.payload) == null ? void 0 : Ae.result) == null ? void 0 : $e.code) === "OPERATION_REPLAYED")
                Xe = await ee(
                  `/videos/${Z.id}/editor`
                ), Le = !0, tt.length = 0, Qe(St.operationKey), bt = St.payload.result;
              else {
                if (B.action !== "collect" || St.status !== 409) throw St;
                const It = await ee(
                  `/videos/${Z.id}/editor`
                );
                Xe = It, Le = !0, tt.length = 0;
                const Zt = mt(
                  It == null ? void 0 : It.segments,
                  dt
                );
                if (!Zt) throw St;
                kt = Zt, bt = await Ue(kt, null);
              }
            }
            dt && bt.itemId != null && (dt.itemId = bt.itemId), Xe = an(
              Xe,
              bt.editorDelta
            ), tt.push(bt.editorDelta);
            const Ht = { segment: Re, result: bt, example: Ie };
            de.push(Ht);
          } catch (dt) {
            if (De.push(dt), ![400, 404, 409].includes(dt.status)) break;
          }
        }
        if (c && de.length > 0) {
          const Re = B.action === "remove", Ie = de.length;
          await re(
            Re ? "feedback.remove" : "feedback.collect",
            Re ? `Removed ${Ie} incorrect AI example${Ie === 1 ? "" : "s"}` : `Collected ${Ie} incorrect AI example${Ie === 1 ? "" : "s"}`,
            Or(de, Re),
            Or(de, !Re)
          ) || (Ee = !0);
        }
        de.some(({ result: Re }) => Re.representation === "basicNativeBin") && lr();
        const Be = So(
          ue.current,
          ge.id
        ), we = B.action === "collect" && de.some(({ segment: Re }) => Re.id === ge.id), Gt = de.map(({ segment: Re }) => Re.id), qe = we ? Gr(
          he,
          Fr(o, ge.id),
          { removedIds: Gt }
        ) : null, vt = we ? (qe == null ? void 0 : qe.id) ?? null : ge.id;
        Be && we && (me(qe ? [qe.id] : []), W((qe == null ? void 0 : qe.id) ?? Pn), xe.current = (qe == null ? void 0 : qe.id) ?? null, be.current = []);
        const At = await ee(`/videos/${Z.id}/incorrect-examples`);
        v(At);
        const nt = Xe;
        if (_(Le ? nt : (Re) => tt.reduce(an, Re), Z.id), Be && So(
          ue.current,
          vt
        )) {
          let Re, Ie;
          we ? (Ie = qe ? mt(nt == null ? void 0 : nt.segments, {
            id: qe.id,
            itemId: qe.itemId,
            nativeSegmentId: qe.nativeSegmentId
          }) : null, Re = Ie ? [Ie] : []) : (Re = le.map((dt) => mt(nt == null ? void 0 : nt.segments, dt)).filter(Boolean), Ie = mt(nt == null ? void 0 : nt.segments, ge) || Re[0] || null), me(Re.map((dt) => dt.id)), W((Ie == null ? void 0 : Ie.id) ?? (we ? Pn : null)), xe.current = (Ie == null ? void 0 : Ie.id) ?? null, be.current = [], $(Ie ? Kt(o, Ie.id) : null), Ie && Ne(Ie.id);
        }
        if (De.length > 0) {
          const Re = ((et = De[0]) == null ? void 0 : et.message) || "Only segments with registered AI provenance can be collected.";
          de.length === 0 ? F(Re) : B.action === "remove" ? F(
            `Partially removed ${de.length} of ${X.length} selected incorrect examples. ${Re}`
          ) : F(
            `Partially collected ${de.length} of ${X.length} selected segments. ${Re}`
          );
        } else if (B.action === "remove")
          F(
            `${de.length} incorrect example${de.length === 1 ? "" : "s"} removed and ${de.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const Re = de.filter(({ result: Ie }) => Ie.representation === "basicNativeBin").length;
          F(Re === de.length ? `${de.length} incorrect AI example${de.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${de.length} incorrect AI example${de.length === 1 ? "" : "s"} collected and ${de.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        Ee && F("The change saved, but editor history could not be updated.");
      } catch (Ue) {
        F(Ue.message || "Unable to update the selected incorrect examples.");
      } finally {
        We();
      }
    }
  }
  async function Te(B) {
    if (!B || ae != null || O) return;
    const X = n("feedback", -1);
    if (!X) {
      F("Wait for the current save to finish before removing the incorrect example.");
      return;
    }
    try {
      await Ce(B);
    } finally {
      X();
    }
  }
  async function Ce(B) {
    var le, ge;
    H(B.id);
    const X = `incorrect-example-remove:${Z.id}:${B.id}:${B.revision}:${B.representationRevision}`;
    try {
      let de, De = !1;
      try {
        de = await ee(
          `/videos/${Z.id}/incorrect-examples/${B.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ye(X),
              expectedExampleRevision: B.revision,
              expectedRepresentationRevision: B.representationRevision
            })
          }
        );
      } catch (Le) {
        if (Le.status !== 409 || ((ge = (le = Le.payload) == null ? void 0 : le.result) == null ? void 0 : ge.code) !== "OPERATION_REPLAYED")
          throw Le;
        de = Le.payload.result, De = !0;
      }
      Qe(X);
      let Ee = !0;
      if (c) {
        const tt = [{ segment: mt(p.segments, {
          itemId: B.itemId
        }) || {
          id: B.itemId == null ? null : -B.itemId,
          itemId: B.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: B.representationRevision
        }, result: de, example: B }];
        Ee = await re(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          Or(tt, !0),
          Or(tt, !1)
        );
      }
      const Xe = await ee(
        `/videos/${Z.id}/incorrect-examples`
      );
      v(Xe), De ? await ne() : _(
        (Le) => an(Le, de.editorDelta),
        Z.id
      ), B.representation === "basicNativeBin" && lr(), F(Ee ? De ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : B.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (de) {
      de.status === 409 && await T(), F(de.message || "Unable to remove the incorrect example.");
    } finally {
      H(null);
    }
  }
  async function Oe() {
    if (O || ae != null || Y.length === 0) return;
    j(!0);
    const B = `incorrect-example-export:${Z.id}:${Y.map((X) => `${X.id}:${X.revision}:${X.representationRevision}`).join(",")}`;
    try {
      const X = await kc(
        Z.id,
        Y
      ), le = new FormData();
      le.append("metadata", JSON.stringify({
        operationId: Ye(B),
        examples: X.captures
      }));
      for (const Le of X.files)
        le.append(Le.fieldName, Le.file);
      const ge = await ee(
        `/videos/${Z.id}/incorrect-examples/export`,
        { method: "POST", body: le }
      ), de = await Fd(ge.downloadUrl), De = URL.createObjectURL(de.blob), Ee = document.createElement("a");
      Ee.href = De, Ee.download = de.fileName, Ee.click(), setTimeout(() => URL.revokeObjectURL(De), 1e3);
      const Xe = await ee(
        `/training-exports/${ge.id}/complete`,
        { method: "POST" }
      );
      Qe(B), v(await ee(
        `/videos/${Z.id}/incorrect-examples`
      )), F(
        `Downloaded ${ge.exampleCount} incorrect example${ge.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Xe.clearedExampleCount} from the working collection.`
      );
    } catch (X) {
      F(X.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      j(!1);
    }
  }
  async function He(B = null) {
    const X = q.filter(($e) => $e.reviewState === "rejected"), le = X.length, ge = Y.some(($e) => $e.representation === "fullItem");
    if (B == null && le === 0 && !ge) {
      F("There are no rejected segments to delete.");
      return;
    }
    if (B == null) {
      const $e = n("delete-rejected", -1);
      if (!$e) return;
      F("Preparing deletion summary…");
      try {
        const et = await ee(`/videos/${Z.id}/rejected/deletion/preview`, { method: "POST" }), Ue = Number(et.deletedSegmentCount) || 0, Be = Number(et.deferredRejectedSegmentCount) || 0, we = Number(et.protectedIncorrectExampleCount) || 0;
        if (Ue === 0) {
          Be > 0 ? F(
            `${Be} feedback-protected rejected segment${Be === 1 ? "" : "s"} kept. ${we} AI feedback example${we === 1 ? "" : "s"} must be exported before ${Be === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : F("There are no rejected segments to delete.");
          return;
        }
        if (!ja(et, F)) return;
        je(et), F("");
      } catch (et) {
        F(et.message || "Unable to prepare rejected segment deletion.");
      } finally {
        $e();
      }
      return;
    }
    const de = B, De = Number(de.deferredRejectedSegmentCount) || 0, Ee = ue.current, Xe = X.map(($e) => $e.id), Le = De === 0 && Xe.includes(Ee), tt = Le ? Gr(
      he,
      Fr(o, Ee),
      { removedIds: Xe }
    ) : null, We = n("delete-rejected", -1);
    if (!We) return;
    je(null), F("Deleting rejected segments…");
    const Ae = De === 0 ? Tt() : null;
    Ae && x({
      type: "add",
      entry: { id: Ae, op: "remove", targets: X.map(pt) }
    }), Le && (me(tt ? [tt.id] : []), W((tt == null ? void 0 : tt.id) ?? Pn), xe.current = (tt == null ? void 0 : tt.id) ?? null, be.current = []);
    try {
      const $e = `rejected-dependency-delete:${Z.id}:${de.fingerprint}`, et = await ee(`/videos/${Z.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ye($e),
          fingerprint: de.fingerprint
        })
      });
      Qe($e);
      const Ue = await ne();
      Ae && x({ type: "confirm", key: Ae, applied: Ue != null }), et.deletedSegmentCount > 0 && t(Qt);
      const Be = De > 0 ? ` ${De} feedback-protected rejected segment${De === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      F(`${et.deletedSegmentCount} segment${et.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Be}`);
    } catch ($e) {
      Ae && x({ type: "discard", key: Ae }), Le && (me(Ee == null ? [] : [Ee]), W(Ee), xe.current = Ee, be.current = []), F($e.message || "Unable to delete rejected segments.");
    } finally {
      We();
    }
  }
  async function gt(B = i) {
    if (a || B.length === 0) return;
    const X = n("auto-assign", -1);
    if (!X) {
      z("Wait for the current save to finish before assigning performers.");
      return;
    }
    try {
      await Ge(B);
    } finally {
      X();
    }
  }
  async function Ge(B) {
    se(!0), z("");
    try {
      const X = await ee(`/videos/${Z.id}/segments/auto-assign-performer-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeSegmentIds: B.flatMap((le) => le.nativeSegmentId == null ? [] : [le.nativeSegmentId]),
          itemIds: B.flatMap((le) => le.published || le.itemId == null ? [] : [le.itemId])
        })
      });
      ke(!1), await ne(), F(`${X.assignedSegmentCount} segment${X.assignedSegmentCount === 1 ? "" : "s"} received ${X.assignedSlotCount} performer-slot assignment${X.assignedSlotCount === 1 ? "" : "s"}.`);
    } catch (X) {
      z(X.message || "Unable to auto-assign performers.");
    } finally {
      se(!1);
    }
  }
  async function ft() {
    V(!0), u(""), !E && (R(!0), pe());
  }
  function ot() {
    S.current = !0, V(!1), requestAnimationFrame(() => {
      var B;
      return (B = L.current) == null ? void 0 : B.focus({ preventScroll: !0 });
    });
  }
  async function Pe() {
    if (!E || w || E.createCount + E.linkCount === 0)
      return;
    const B = n("materialize", -1);
    if (!B) {
      u("Wait for the current save to finish before materializing derived segments.");
      return;
    }
    try {
      await rt();
    } finally {
      B();
    }
  }
  async function rt() {
    te(!0), u("");
    let B;
    try {
      const X = `materialize-derived:${Z.id}:${E.fingerprint}`;
      B = await ee(`/videos/${Z.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ye(X),
          fingerprint: E.fingerprint,
          maxDepth: 3
        })
      }), Qe(X);
    } catch (X) {
      X.status === 409 && ie(null), u(X.message || "Unable to materialize derived segments."), te(!1);
      return;
    }
    ie((X) => X && { ...X, createCount: 0, linkCount: 0 });
    try {
      await ne(), ot(), ie(null);
      const X = B.createdCount + B.linkedCount;
      F(`${B.createdCount} derived segment${B.createdCount === 1 ? "" : "s"} created and ${B.linkedCount} existing segment${B.linkedCount === 1 ? "" : "s"} linked.`), X === 0 && F("Every applicable derivation was already materialized.");
    } catch {
      u("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    te(!1);
  }
  async function xt(B, X = null) {
    var Ee, Xe, Le, tt;
    const le = {
      tagId: B,
      ...X ? { tagName: X } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (ve.length > 1) {
      const We = ve.filter((we) => we.tagId !== B);
      if (We.length === 0) {
        d();
        return;
      }
      const Ae = ve.map((we) => ({
        id: we.id,
        itemId: we.itemId,
        nativeSegmentId: we.nativeSegmentId
      })), $e = ve.map((we) => !c || we.nativeSegmentId != null ? `native:${we.nativeSegmentId}:${we.updatedAt}` : `item:${we.itemId}:${we.revision}`).sort().join(","), et = `bulk-tag:${Z.id}:${B}:${$e}`, Ue = n("tag", (Q == null ? void 0 : Q.id) ?? We[0].id);
      if (!Ue) return;
      F(`Changing tag for ${We.length} selected segment${We.length === 1 ? "" : "s"}…`);
      const Be = Tt();
      x({
        type: "add",
        entry: { id: Be, op: "patch", targets: We.map(pt), values: le }
      }), d();
      try {
        const we = c ? null : crypto.randomUUID();
        await ee(`/videos/${Z.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ye(et),
            tagId: B,
            historyReceiptId: we,
            segments: ve.map((nt) => {
              const Re = !c || nt.nativeSegmentId != null;
              return {
                nativeSegmentId: Re ? nt.nativeSegmentId : null,
                itemId: Re ? null : nt.itemId,
                expectedUpdatedAt: Re ? nt.updatedAt : null,
                expectedRevision: Re ? null : nt.revision
              };
            })
          })
        }), Qe(et);
        const Gt = jt(
          ve,
          c
        ), qe = await ne();
        x({ type: "confirm", key: Be, applied: qe != null });
        const vt = Ae.map((nt) => mt(qe == null ? void 0 : qe.segments, nt)).filter(Boolean);
        await re(
          "segments.tag",
          `Changed tag for ${We.length} segment${We.length === 1 ? "" : "s"}`,
          Gt,
          jt(vt, c),
          we
        );
        const At = Ae.map((nt) => mt(qe == null ? void 0 : qe.segments, nt)).filter(Boolean);
        me(At.map((nt) => nt.id)), W(((Ee = At.find((nt) => nt.id === (Q == null ? void 0 : Q.id))) == null ? void 0 : Ee.id) ?? ((Xe = At[0]) == null ? void 0 : Xe.id) ?? null), d(), F(`${We.length} selected segment${We.length === 1 ? "" : "s"} retagged.`);
      } catch (we) {
        x({ type: "discard", key: Be });
        const Gt = Ae.map((vt) => mt(p.segments, vt)).filter(Boolean), qe = mt(p.segments, {
          id: Q == null ? void 0 : Q.id,
          itemId: Q == null ? void 0 : Q.itemId,
          nativeSegmentId: Q == null ? void 0 : Q.nativeSegmentId
        }) || Gt[0] || null;
        me(Gt.map((vt) => vt.id)), W((qe == null ? void 0 : qe.id) ?? null), xe.current = (qe == null ? void 0 : qe.id) ?? null, be.current = [], we.status === 409 && await T(), F(we.message || "Unable to change the selected segment tags.");
      } finally {
        Ue();
      }
      return;
    }
    if (ve.length !== 1 || !Q) return;
    const ge = Xa(M, Q);
    if (Q.id === m || ge) {
      const We = ge ? { segmentId: Q.id, tagId: ge.values.tagId, tagName: ge.meta.tagName } : null, Ae = td(We, Q, B, X);
      if (Ae && !lt(Q, Ae)) {
        d();
        return;
      }
      if (ge && (b(($e) => {
        var et;
        return ((et = $e.meta) == null ? void 0 : et.pendingChangeId) === ge.id;
      }), x({ type: "discard", key: ge.id })), Ae) {
        const $e = ba(
          { ...Q, tagId: Ae.tagId },
          U,
          h,
          J,
          Me
        );
        N($e.filters), k($e.hideDerivedSegments), F("Tag change queued…");
      } else ge && F("");
      d();
      return;
    }
    if (B === Q.tagId) {
      d();
      return;
    }
    let de = ((Le = P.data) == null ? void 0 : Le.children) ?? null;
    if (de == null && P.loading && Q.itemId != null) {
      d();
      try {
        const We = await ee(`/videos/${Z.id}/items/${Q.itemId}/metadata`);
        de = ((tt = We == null ? void 0 : We.lineage) == null ? void 0 : tt.children) ?? null;
      } catch {
      }
    }
    if (Q.itemId != null && (de == null ? void 0 : de.length) > 0) {
      const We = n("lineage-tag", Q.id);
      if (!We) {
        F("Wait for the current save to finish, then choose the tag again.");
        return;
      }
      F("Checking lineage impact…");
      let Ae = null;
      try {
        const $e = await ee(`/items/${Q.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: Q.revision, tagId: B })
        }), et = $e.deletedItemIds.length > 0 || $e.removedEdgeIds.length > 0;
        if (et && !window.confirm(
          `Changing this tag removes ${$e.removedEdgeIds.length} lineage edge${$e.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${$e.deletedItemIds.length} derived segment${$e.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
        )) {
          F("Tag change canceled.");
          return;
        }
        Ae = Tt(), x({
          type: "add",
          entry: { id: Ae, op: "patch", targets: [pt(Q)], values: le }
        }), d();
        const Ue = `tag-change:${Q.itemId}:${Q.revision}:${$e.componentFingerprint}:${B}`;
        await ee(`/items/${Q.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ye(Ue),
            expectedRevision: Q.revision,
            componentFingerprint: $e.componentFingerprint,
            tagId: B
          })
        }), Qe(Ue);
        const Be = await ne();
        x({ type: "confirm", key: Ae, applied: Be != null }), d(), F(et ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch ($e) {
        Ae && x({ type: "discard", key: Ae }), me([Q.id]), W(Q.id), xe.current = Q.id, be.current = [], $e.status === 409 ? (F("Lineage changed — loading the latest segments…"), await T()) : F($e.message || "Unable to reconcile the lineage.");
      } finally {
        We();
      }
      return;
    }
    d();
    const De = (y == null ? void 0 : y.id) === Q.id ? y : Q;
    await C(Q, {
      startSec: De.startSec,
      endSec: De.endSec,
      tagId: B
    }, !0, null, !0, le);
  }
  function lt(B, X) {
    const le = Tt(), ge = g(pt(B));
    x({
      type: "add",
      entry: {
        id: le,
        op: "patch",
        targets: [ge],
        values: { tagId: X.tagId, tagName: X.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: X.tagName }
      }
    });
    const de = M.find((Ee) => Ee.op === "insert" && Ee.segment.id === B.id);
    return I({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [ge],
      dependsOn: (de == null ? void 0 : de.taskId) ?? null,
      meta: { pendingChangeId: le },
      ready: (Ee, Xe) => {
        const Le = Ya(Ee.segments, Xe.targets[0]);
        return !Le || nd(Ee, Le.id);
      },
      run: (Ee) => ht(Ee, le, X)
    }) ? !0 : (x({ type: "discard", key: le }), F("Wait for the history restore to finish."), !1);
  }
  async function ht(B, X, le) {
    const [ge] = B.resolveTargets();
    if (!ge) {
      x({ type: "discard", key: X }), F(`The new segment was not retagged${le.tagName ? ` to ${le.tagName}` : ""}. Choose its tag again.`);
      return;
    }
    if (ge.tagId === le.tagId) {
      x({ type: "discard", key: X });
      return;
    }
    await A(ge, {
      startSec: ge.startSec,
      endSec: ge.endSec,
      tagId: le.tagId
    }, {
      pendingChangeId: X,
      restoreSelectionOnFailure: !1,
      onReload: B.onReload,
      onConflict: B.onConflict
    }) || F(`The new segment was not retagged${le.tagName ? ` to ${le.tagName}` : ""}. Choose its tag again.`);
  }
  async function Ze() {
    var Xe, Le, tt, We;
    if (!l || !Q || ye != null) return;
    const B = [...ve].sort((Ae, $e) => Number(Ae.nativeSegmentId ?? Ae.id) - Number($e.nativeSegmentId ?? $e.id)), X = new Set(B.map((Ae) => Ae.id)), le = B.map((Ae) => `${Ae.nativeSegmentId ?? Ae.id}:${Ae.updatedAt}`).join("|"), ge = n("bin", Q.id);
    if (!ge) return;
    F(`Moving ${B.length} segment${B.length === 1 ? "" : "s"} to recycling bin…`);
    const de = `bulk-move:${Z.id}:${le}`, De = Ye(de), Ee = c ? null : crypto.randomUUID();
    try {
      const Ae = (Be = !1) => ee(`/videos/${Z.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: De,
          segments: B.map((we) => ({
            segmentId: we.nativeSegmentId ?? we.id,
            expectedUpdatedAt: we.updatedAt
          })),
          discardMissingImage: Be,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: Ee
        })
      });
      let $e;
      try {
        $e = await Ae(
          Lo(de)
        );
      } catch (Be) {
        if (((Xe = Be.payload) == null ? void 0 : Xe.code) !== "missing-image" || !window.confirm(`${Be.message}

Continue and discard the missing image reference?`)) throw Be;
        jo(de), $e = await Ae(!0);
      }
      Qe(de), lr();
      const et = new Map(($e.items || []).map((Be) => [
        Number(Be.segmentId),
        Be
      ]));
      await re(
        "segments.moveToBin",
        `Moved ${B.length} segment${B.length === 1 ? "" : "s"} to recycling bin`,
        jt(B, !1),
        jt(B.map((Be) => {
          const we = et.get(
            Number(Be.nativeSegmentId ?? Be.id)
          );
          return {
            ...Be,
            recycleBinItemId: (we == null ? void 0 : we.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (we == null ? void 0 : we.revision) ?? null
          };
        }), !1),
        Ee
      );
      const Ue = Gr(
        he,
        Fr(o, Q.id),
        { removedIds: [...X] }
      );
      _((Be) => ({
        ...Be,
        segments: (Be.segments || []).filter((we) => !X.has(we.id))
      }), Z.id), me(Ue ? [Ue.id] : []), W((Ue == null ? void 0 : Ue.id) ?? Pn), xe.current = (Ue == null ? void 0 : Ue.id) ?? null, be.current = [], Ue && ($(Kt(o, Ue.id)), Ne(Ue.id)), requestAnimationFrame(() => {
        var Be;
        return (Be = f.current) == null ? void 0 : Be.focus({ preventScroll: !0 });
      }), F(`Moved ${B.length} segment${B.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Ae) {
      const $e = ((Le = Ae.payload) == null ? void 0 : Le.code) || ((We = (tt = Ae.payload) == null ? void 0 : tt.result) == null ? void 0 : We.code);
      Ae.status === 409 && $e === "CANONICAL_SEGMENT_CHANGED" ? await T() : F(Ae.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      ge();
    }
  }
  async function it() {
    if (!(c || s.current || ye != null)) {
      s.current = !0, F("Checking the recycling bin…");
      try {
        const B = await ee("/bin"), X = await Ga(B, () => F("Emptying the recycling bin…"));
        if (X.status === "empty") {
          F("The recycling bin is empty.");
          return;
        }
        if (X.status === "canceled") {
          F("The recycling bin was not emptied.");
          return;
        }
        F(`${X.segmentCount} segment${X.segmentCount === 1 ? "" : "s"} from ${X.sceneCount} scene${X.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (B) {
        F(B.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: Ke, removeIncorrectExample: Te, captureTrainingExport: Oe, deleteRejectedSegments: He, autoAssignPerformers: gt, previewDerivedSegments: ft, closeMaterializeDialog: ot, materializeDerivedSegments: Pe, saveTag: xt, moveToBin: Ze, emptyRecyclingBin: it };
}
function Au(e) {
  const { acceptHistory: t, acquireSaveLock: n, enqueueSave: o, getSaveQueueSnapshot: i, commonActionsRef: a, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: m, history: p, historyRef: y, historySaving: h, horizontalLayoutSize: f, mediaStackHeight: b, mediaStackRef: x, onDetailChange: I, onReload: g, railToggleRef: O, recordHistoryAction: J, savingSegmentId: Y, setCollapsedSegmentGroups: P, setEditorLayout: L, setHistorySaving: E, setIncorrectExamples: S, setSaveMessage: w, shotBoundaries: C, timelineDuration: A, video: M, workspaceRef: T } = e;
  async function _(j, k, v) {
    var ie, te, je, H;
    const u = j.type === "segment" ? [j] : j.segments || [], R = (k == null ? void 0 : k.type) === "segment" ? [k] : (k == null ? void 0 : k.segments) || [];
    let V = v;
    for (const [F, $] of u.entries()) {
      const W = R[F], me = ((ie = $.identity) == null ? void 0 : ie.nativeSegmentId) != null || ((te = $.identity) == null ? void 0 : te.published) === !0, he = ((je = W == null ? void 0 : W.identity) == null ? void 0 : je.recycleBinItemId) ?? ((H = W == null ? void 0 : W.identity) == null ? void 0 : H.itemId);
      let Z = mt(V.segments, W == null ? void 0 : W.identity) || mt(V.segments, $.identity);
      if (!Z && me && he != null && W.identity.revision != null) {
        const Ce = `history-restore:${M.id}:${he}:${W.identity.revision}`;
        await ee(`/bin/${he}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ye(Ce),
            expectedRevision: W.identity.revision
          })
        }), Qe(Ce), V = await g(), Z = V.segments.find((Oe) => Oe.tagId === $.values.tagId && Oe.startSec === $.values.startSec && Oe.endSec === $.values.endSec);
      }
      if (!Z)
        throw new Error("A segment in this history state no longer exists.");
      if ((Z.nativeSegmentId != null || Z.published === !0) !== me) {
        if (me) {
          const Ce = Z.recycleBinItemId ?? Z.itemId ?? he;
          if (Ce == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Oe = `history-restore:${M.id}:${Ce}:${Z.revision}:${$.values.reviewState ?? "native"}`;
          await ee(`/bin/${Ce}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ye(Oe),
              expectedRevision: Z.revision
            })
          }), Qe(Oe);
        } else {
          const Ce = `history-bin:${M.id}:${Z.nativeSegmentId}:${Z.updatedAt}:${$.values.reviewState}`;
          await ee(`/videos/${M.id}/segments/${Z.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ye(Ce),
              expectedUpdatedAt: Z.updatedAt,
              reviewState: $.values.reviewState
            })
          }), Qe(Ce);
        }
        if (V = await g(), !me)
          continue;
        if (Z = mt(V.segments, $.identity) || V.segments.find((Ce) => Ce.tagId === $.values.tagId && Ce.startSec === $.values.startSec && Ce.endSec === $.values.endSec), !Z)
          throw new Error("The restored segment could not be found.");
      }
      const Te = $.values;
      if (Z.nativeSegmentId == null && Z.itemId != null) {
        const Ce = `history-draft-update:${M.id}:${Z.itemId}:${Z.revision}:${Te.tagId}:${Te.startSec}:${Te.endSec ?? "open"}:${Te.reviewState}`;
        await ee(`/videos/${M.id}/drafts/${Z.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ye(Ce),
            expectedRevision: Z.revision,
            ...Te
          })
        }), Qe(Ce);
      } else
        await ee(`/videos/${M.id}/segments/${Z.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Te, expectedUpdatedAt: Z.updatedAt })
        });
      V = await g();
    }
    return V;
  }
  async function ne(j, k) {
    var v;
    for (const u of j.targets || []) {
      const R = mt(k.segments, u.identity);
      if (!R)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const V = (v = k.performerSlotRevisions) == null ? void 0 : v[R.id];
      await ee(R.published ? `/videos/${M.id}/segments/${R.nativeSegmentId}/slots` : `/videos/${M.id}/drafts/${R.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: V,
          assignments: u.assignments
        })
      }), k = await g();
    }
    return k;
  }
  async function U(j, k, v) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let u = k, R = await ee(`/videos/${M.id}/incorrect-examples`);
    const V = (ie) => R.find((te) => {
      var je;
      return te.id === ie.exampleId || ((je = ie.collectedIdentity) == null ? void 0 : je.itemId) != null && te.itemId === ie.collectedIdentity.itemId;
    });
    for (const [ie, te] of (j.entries || []).entries()) {
      const je = `history-feedback:${M.id}:${v.action.sequence}:${v.direction}:${ie}`, H = V(te);
      if (j.collected && H) {
        Qe(je);
        continue;
      }
      let F;
      if (j.collected) {
        const $ = mt(
          u.segments,
          te.collectedIdentity
        ) || mt(
          u.segments,
          te.originalIdentity
        );
        if (!$)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const W = $.nativeSegmentId != null;
        F = await ee(`/videos/${M.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ye(je),
            nativeSegmentId: W ? $.nativeSegmentId : null,
            itemId: W ? null : $.itemId,
            expectedUpdatedAt: W ? $.updatedAt : null,
            expectedRevision: W ? null : $.revision
          })
        });
      } else {
        if (!H) {
          Qe(je);
          continue;
        }
        F = await ee(
          `/videos/${M.id}/incorrect-examples/${H.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ye(je),
              expectedExampleRevision: H.revision,
              expectedRepresentationRevision: H.representationRevision
            })
          }
        );
      }
      Qe(je), u = an(
        u,
        F.editorDelta
      ), R = await ee(
        `/videos/${M.id}/incorrect-examples`
      );
    }
    return S(R), u;
  }
  async function re(j, k, v = []) {
    const u = j.state;
    if (!s && ((u == null ? void 0 : u.type) === "segment" || (u == null ? void 0 : u.type) === "segments")) {
      const V = `basic-history:${M.id}:${y.current.revision}:${j.action.sequence}:${j.direction}`, ie = await ee(`/videos/${M.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ye(V),
          expectedHistoryRevision: y.current.revision,
          actionSequence: j.action.sequence,
          direction: j.direction
        })
      });
      return t(ie.history), v.push(V), g();
    }
    const R = j.direction === "backward" ? j.action.afterState : j.action.beforeState;
    if ((u == null ? void 0 : u.type) === "composite") {
      let V = k;
      const ie = (R == null ? void 0 : R.type) === "composite" ? R.states || [] : [];
      for (const [te, je] of (u.states || []).entries()) {
        const H = ie[te];
        V = await re({
          ...j,
          state: je,
          action: {
            ...j.action,
            beforeState: j.direction === "backward" ? je : H,
            afterState: j.direction === "backward" ? H : je
          }
        }, V, v);
      }
      return V;
    }
    if ((u == null ? void 0 : u.type) === "segment" || (u == null ? void 0 : u.type) === "segments")
      return _(
        u,
        R,
        k
      );
    if ((u == null ? void 0 : u.type) === "performerSlots")
      return ne(u, k);
    if ((u == null ? void 0 : u.type) === "incorrectExamples")
      return U(u, k, j);
    if ((u == null ? void 0 : u.type) === "shots") {
      const V = uo(k.shotBoundaries || []), ie = await ee(`/videos/${M.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ye(`history-shots:${M.id}:${V}:${u.fingerprint}`),
          expectedFingerprint: V,
          boundaries: u.boundaries
        })
      });
      return { ...k, shotBoundaries: ie };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function pe(j) {
    if (h || j === p.cursorSequence) return;
    if (Y != null) {
      w("Finish the pending saves before restoring history.");
      return;
    }
    if (Bi(p, j).length === 0) return;
    const v = o({
      kind: "history",
      lockId: -1,
      exclusive: !0,
      run: (u) => ae(u.detail, j)
    });
    if (!v) {
      w("Finish the pending saves before restoring history.");
      return;
    }
    await v.done;
  }
  async function ae(j, k) {
    var u;
    const v = Bi(y.current, k);
    if (v.length !== 0) {
      E(!0), w(`Restoring ${v.length} history ${v.length === 1 ? "action" : "actions"}…`);
      try {
        let R = j;
        const V = [];
        for (const te of v)
          R = await re(
            te,
            R,
            V
          );
        const ie = s ? await ee(`/videos/${M.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: y.current.revision,
            targetSequence: k
          })
        }) : y.current;
        V.forEach(Qe), t(ie), await g(), w("History restored.");
      } catch (R) {
        R.status === 409 && ((u = R.payload) != null && u.current) && t(R.payload.current), await g(), w(R.message || "Unable to restore editor history.");
      } finally {
        E(!1);
      }
    }
  }
  function Ne(j) {
    L((k) => ({ ...k, timelineRatio: Oo(j, b) }));
  }
  function ye(j) {
    var u, R;
    const k = (u = x.current) == null ? void 0 : u.getBoundingClientRect();
    if (!k) return;
    const v = ((R = a.current) == null ? void 0 : R.offsetHeight) || 0;
    Ne(Nl(
      j.clientY,
      k.top + v,
      Math.max(0, k.height - v)
    ));
  }
  function Me(j) {
    j.currentTarget.setPointerCapture(j.pointerId), ye(j);
  }
  function q(j) {
    j.currentTarget.hasPointerCapture(j.pointerId) && ye(j);
  }
  function Q(j) {
    const k = j.shiftKey ? 0.1 : 0.05;
    let v = null;
    j.key === "ArrowUp" && (v = c.timelineRatio + k), j.key === "ArrowDown" && (v = c.timelineRatio - k);
    const u = Do(b);
    j.key === "Home" && (v = u.minimum), j.key === "End" && (v = u.maximum), v != null && (j.preventDefault(), j.stopPropagation(), Ne(v));
  }
  function ue(j) {
    const k = j === "detailWidth" ? f.focusRow : f.workspace, v = f.workspace > 0 ? bo(f.workspace, 600) : 560, u = yn(c.markerRailWidth, v), R = j === "detailWidth" ? 344 + (c.markerRailOpen ? u + 24 : 0) : 600;
    return k > 0 ? bo(k, R) : 560;
  }
  function ve(j, k) {
    L((v) => ({ ...v, [j]: yn(k, ue(j)) }));
  }
  function xe(j, k) {
    var u, R;
    const v = k === "detailWidth" ? (u = m.current) == null ? void 0 : u.getBoundingClientRect() : (R = T.current) == null ? void 0 : R.getBoundingClientRect();
    v && ve(k, k === "detailWidth" ? j.clientX - v.left : v.right - j.clientX);
  }
  function be(j, k) {
    const v = ue(j), u = yn(c[j], v);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": k,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(v),
      "aria-valuenow": Math.round(u),
      "aria-valuetext": `${Math.round(u)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (R) => {
        R.currentTarget.setPointerCapture(R.pointerId), xe(R, j);
      },
      onPointerMove: (R) => {
        R.currentTarget.hasPointerCapture(R.pointerId) && xe(R, j);
      },
      onKeyDown: (R) => {
        const V = R.shiftKey ? 40 : 16;
        let ie = null;
        R.key === "ArrowLeft" && (ie = j === "detailWidth" ? -V : V), R.key === "ArrowRight" && (ie = j === "detailWidth" ? V : -V);
        let te = ie == null ? null : u + ie;
        R.key === "Home" && (te = 240), R.key === "End" && (te = v), te != null && (R.preventDefault(), R.stopPropagation(), ve(j, te));
      },
      onDoubleClick: () => ve(j, Mt[j]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function z() {
    L((j) => ({ ...j, markerRailOpen: !j.markerRailOpen })), requestAnimationFrame(() => {
      var j;
      return (j = O.current) == null ? void 0 : j.focus({ preventScroll: !0 });
    });
  }
  function ke(j) {
    P((k) => k.includes(j) ? k.filter((v) => v !== j) : ln([...k, j]));
  }
  function se(j, k = !0, v = l) {
    const u = i().running != null, R = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (V) => N(V.detail, j, k, v)
    });
    return R ? (u && w(j === "split" ? "Shot boundary queued…" : "Shot merge queued…"), R.done.then((V) => V.value ?? null)) : (w("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function N(j, k, v, u) {
    var je;
    const R = (j == null ? void 0 : j.shotBoundaries) || [], V = Number((je = M.videoFile) == null ? void 0 : je.duration) || A, ie = uo(R), te = `shot-${k}:${M.id}:${u.toFixed(3)}:${V.toFixed(3)}:${ie}`;
    w(k === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const H = await ee(`/videos/${M.id}/shot-boundaries/${k}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Ye(te), timeSec: u })
      });
      return Qe(te), I((F) => ({ ...F, shotBoundaries: H }), M.id), v && await J(
        "shots.update",
        k === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: R,
          fingerprint: ie
        },
        {
          type: "shots",
          boundaries: H,
          fingerprint: uo(H)
        }
      ), w(k === "split" ? "Shot boundary added." : "Shots merged."), H;
    } catch (H) {
      return w(H.message || "Unable to edit shot boundaries."), null;
    }
  }
  return { applySegmentHistoryState: _, applyPerformerSlotHistoryState: ne, applyHistoryState: re, restoreHistoryTarget: pe, updateTimelineRatio: Ne, updateTimelineRatioFromPointer: ye, handleSeparatorPointerDown: Me, handleSeparatorPointerMove: q, handleSeparatorKeyDown: Q, panelWidthMaximum: ue, updatePanelWidth: ve, handlePanelSeparatorPointer: xe, panelSeparatorProps: be, toggleSegmentRail: z, toggleSegmentGroup: ke, mutateShotBoundary: se };
}
function Mu(e) {
  const { allSwimlanes: t, applyShortcutTiming: n, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, displayedSelectedSegment: d, duplicateSegment: c, editorLayout: m, editorRef: p, emptyRecyclingBin: y, lineage: h, mediaDuration: f, mergeSelectedSwimlane: b, moveToBin: x, mutateShotBoundary: I, openPublishApprovedDialog: g, playbackControlsRef: O, playbackShortcutConfig: J, saveSelectedReviewState: Y, seekRef: P, segmentGroupKeys: L, selectSegment: E, selectedSegment: S, selectedSegmentGroupForSegment: w, selectedSegmentGroupKey: C, selectedSegments: A, setCollapsedSegmentGroups: M, setIncorrectExamplesOpen: T, setQuickSearchOpen: _, setSaveMessage: ne, setSelectedSegmentGroupKey: U, setTagEditing: re, setTimelineZoom: pe, shotBoundaries: ae, slotButtonRef: Ne, splitSegment: ye, swimlanes: Me, timelineDuration: q, toggleIncorrectExample: Q, toggleSegmentGroup: ue, updateTimelineRatio: ve, videoFrameRate: xe, visibleSegments: be } = e;
  function z(N) {
    var j, k;
    (j = O.current) == null || j.pause(), (k = O.current) == null || k.seekBy(id(N, xe));
  }
  function ke(N, j) {
    if (A.length > 1 && _l(N.id))
      return;
    let k = null;
    N.id === "video.playPause" && (k = () => {
      var u;
      return (u = O.current) == null ? void 0 : u.toggle();
    }), N.id === "video.seekSmallBackward" && (k = () => {
      var u;
      return (u = O.current) == null ? void 0 : u.seekBy(-J.smallSeekTime);
    }), N.id === "video.seekSmallForward" && (k = () => {
      var u;
      return (u = O.current) == null ? void 0 : u.seekBy(J.smallSeekTime);
    }), N.id === "video.seekMediumBackward" && (k = () => {
      var u;
      return (u = O.current) == null ? void 0 : u.seekBy(-J.mediumSeekTime);
    }), N.id === "video.seekMediumForward" && (k = () => {
      var u;
      return (u = O.current) == null ? void 0 : u.seekBy(J.mediumSeekTime);
    }), N.id === "video.seekLongBackward" && (k = () => {
      var u;
      return (u = O.current) == null ? void 0 : u.seekBy(-J.longSeekTime);
    }), N.id === "video.seekLongForward" && (k = () => {
      var u;
      return (u = O.current) == null ? void 0 : u.seekBy(J.longSeekTime);
    }), N.id === "video.playSelected" && S && (k = () => {
      var u;
      (u = P.current) == null || u.call(P, S.startSec, !0), requestAnimationFrame(() => {
        var R;
        return (R = p.current) == null ? void 0 : R.focus({ preventScroll: !0 });
      });
    }), (N.id === "video.playPreviousSegment" || N.id === "video.playNextSegment") && (k = () => {
      var R;
      const u = No(
        Me,
        S == null ? void 0 : S.id,
        N.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !u || u.id === (S == null ? void 0 : S.id) || (E(u, { focusEditor: !0, seekToSegment: !1 }), (R = P.current) == null || R.call(P, u.startSec, !0));
    }), N.id.startsWith("video.seekPercent") && (k = () => {
      var R;
      const u = Number(N.id.slice(17)) / 10;
      (R = P.current) == null || R.call(P, Bl(f ?? q, u), !1);
    }), N.id === "video.jumpToSegmentStart" && S && (k = () => {
      var u;
      return (u = P.current) == null ? void 0 : u.call(P, S.startSec, !1);
    }), N.id === "video.jumpToSegmentEnd" && S && (k = () => {
      var u;
      return (u = P.current) == null ? void 0 : u.call(P, S.endSec ?? S.startSec, !1);
    }), N.id === "video.jumpToVideoStart" && (k = () => {
      var u;
      return (u = P.current) == null ? void 0 : u.call(P, 0, !1);
    }), N.id === "video.jumpToVideoEnd" && (k = () => {
      var u;
      return (u = P.current) == null ? void 0 : u.call(P, q, !1);
    }), N.id.startsWith("video.frame") && (k = () => {
      const u = N.id.includes("Small") ? "small" : N.id.includes("Medium") ? "medium" : "long", R = J[`${u}FrameStep`] * (N.id.endsWith("Backward") ? -1 : 1);
      z(R);
    }), N.id.startsWith("navigation.swimlane") && (k = () => {
      const u = N.id.slice(19).toLowerCase(), R = No(Me, S == null ? void 0 : S.id, u, s);
      R && E(R, { focusEditor: !0, seekToSegment: !1 });
    }), (N.id === "navigation.extendSwimlaneLeft" || N.id === "navigation.extendSwimlaneRight") && (k = () => {
      const u = pc(
        t,
        S == null ? void 0 : S.id,
        N.id.endsWith("Left") ? "left" : "right"
      );
      u && E(u.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: u.segmentIds
      });
    }), (N.id === "navigation.segmentGroupUp" || N.id === "navigation.segmentGroupDown") && (k = () => {
      const u = yc(
        L,
        C ?? w,
        N.id.endsWith("Up") ? -1 : 1
      );
      u && U(u);
    }), (N.id === "navigation.previousAtPlayhead" || N.id === "navigation.nextAtPlayhead") && (k = () => {
      const u = Il(be, s, N.id === "navigation.previousAtPlayhead" ? -1 : 1, S == null ? void 0 : S.id);
      u && E(u, { focusEditor: !0, seekToSegment: !1 });
    }), N.id === "navigation.nearestInCurrentSwimlane" && (k = () => {
      const u = fl(
        Me,
        S == null ? void 0 : S.id,
        s
      );
      u && E(u, { focusEditor: !0, seekToSegment: !1 });
    }), N.id.includes("Unreviewed") && (k = () => {
      const u = Kr(
        Me,
        S == null ? void 0 : S.id,
        N.id.startsWith("navigation.previous") ? -1 : 1,
        N.id.endsWith("Global")
      );
      u && E(u, { focusEditor: !j.preserveFocus, seekToSegment: !1 });
    }), (N.id === "navigation.nextTouchingPlayhead" || N.id === "navigation.previousTouchingPlayhead") && (k = () => {
      const u = gl(Me, s, N.id === "navigation.previousTouchingPlayhead" ? -1 : 1, S == null ? void 0 : S.id);
      u && E(u, { focusEditor: !0, seekToSegment: !1 });
    }), N.id === "navigation.quickSearch" && (k = () => _(!0)), (N.id === "navigation.previousShot" || N.id === "navigation.nextShot") && (k = () => {
      var R;
      const u = od(ae, s, N.id === "navigation.previousShot" ? -1 : 1);
      u && ((R = P.current) == null || R.call(P, u.startSec, !1));
    }), N.id === "shot.split" && (k = () => I("split")), N.id === "shot.merge" && (k = () => I("merge")), N.id === "marker.create" && (k = () => a()), N.id === "marker.duplicate" && (k = () => c(!1)), N.id === "marker.duplicateAtPlayhead" && (k = () => c(!0)), N.id === "marker.split" && (k = () => ye()), N.id === "marker.editTag" && (k = () => {
      if (A.length > 1 && A.some((u) => u.isDerived)) {
        ne("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if (h.data ? h.data.tagReadOnly : S != null && S.isDerived) {
        ne("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      re(!0);
    });
    const v = (d == null ? void 0 : d.id) === (S == null ? void 0 : S.id) ? d : S;
    N.id === "marker.setStart" && S && (k = () => n(s, v.endSec)), N.id === "marker.setEnd" && S && (k = () => n(v.startSec, s)), N.id === "marker.copyTiming" && S && (k = () => {
      ne(Hc(S) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), N.id === "marker.pasteTiming" && S && (k = () => {
      const u = _c();
      if (!u) {
        ne("No copied segment timing is available.");
        return;
      }
      n(u.startSec, u.endSec);
    }), N.id === "marker.mergeSelection" && (k = () => b()), N.id === "marker.moveToBin" && (k = () => x()), N.id === "marker.toggleIncorrectExample" && S && (k = () => Q()), N.id === "marker.openIncorrectExamples" && (k = () => T(!0)), N.id === "markerGroup.toggleCollapse" && C && (k = () => ue(C)), N.id === "markerGroup.toggleAll" && (k = () => M((u) => fc(u, L))), N.id === "marker.assignSlots" && (k = () => {
      var u;
      return (u = Ne.current) == null ? void 0 : u.click();
    }), N.id === "navigation.zoomIn" && (k = () => pe((u) => zr(u + 0.5))), N.id === "navigation.zoomOut" && (k = () => pe((u) => zr(u - 0.5))), N.id === "navigation.resetZoom" && (k = () => pe(1)), N.id === "navigation.centerPlayhead" && (k = () => {
      var u;
      return (u = o.current) == null ? void 0 : u.call(o);
    }), N.id === "layout.growSwimlanes" && (k = () => ve(m.timelineRatio + 0.05)), N.id === "layout.shrinkSwimlanes" && (k = () => ve(m.timelineRatio - 0.05)), N.id === "marker.confirm" && S && (k = () => Y("approved")), N.id === "system.publishApproved" && (k = () => g(j.target)), N.id === "marker.reject" && S && (k = () => Y("rejected")), N.id === "system.emptyBin" && (k = () => y()), N.id === "system.deleteRejected" && (k = () => l()), k && k();
  }
  function se(N, j) {
    const k = fr.find((v) => v.id === N);
    k && Gn(k, i) && ke(k, j);
  }
  return {
    executeShortcutById: se,
    stepVideoFrame: (N) => z(N < 0 ? -1 : 1)
  };
}
const Du = 3e4;
function Ou(e) {
  return e === !0;
}
function Pu() {
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
function Lu({
  fetchRuns: e,
  onCompletedRun: t,
  windowTarget: n,
  documentTarget: o,
  intervalMs: i = Du
}) {
  const a = Pu();
  let s = null, l = !1, d = null;
  const c = () => o.visibilityState !== "hidden";
  async function m() {
    if (!(l || !a.isActive())) {
      l = !0;
      try {
        const f = await e(a.signal);
        if (!a.isActive()) return;
        const b = (Array.isArray(f) ? f : []).filter((I) => (I == null ? void 0 : I.status) === "completed" && I.id != null).map((I) => String(I.id));
        if (s === null) {
          s = new Set(b);
          return;
        }
        const x = b.filter((I) => !s.has(I));
        if (x.length === 0) return;
        x.forEach((I) => s.add(I)), await t();
      } catch {
      } finally {
        l = !1;
      }
    }
  }
  function p() {
    clearTimeout(d), d = null, !(!a.isActive() || !c()) && (d = setTimeout(async () => {
      d = null, await m(), p();
    }, i));
  }
  function y() {
    m();
  }
  function h() {
    c() ? (m(), p()) : (clearTimeout(d), d = null);
  }
  return m(), p(), n.addEventListener("focus", y), o.addEventListener("visibilitychange", h), function() {
    a.dispose(), clearTimeout(d), d = null, n.removeEventListener("focus", y), o.removeEventListener("visibilitychange", h);
  };
}
function ju(e, t, n, o = !1, i = () => () => {
}) {
  const [a, s] = G({
    busy: !1,
    reviewState: null,
    error: ""
  }), l = ce(n);
  fe(() => {
    l.current = n;
  }, [n]);
  async function d(c) {
    const m = i("import", -1);
    if (!m) {
      s({ busy: !1, reviewState: null, error: "Wait for the current save to finish before importing Cove segments." });
      return;
    }
    s({ busy: !0, reviewState: c, error: "" });
    try {
      await ee(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: wo(), reviewState: c })
      }), await t(), s({ busy: !1, reviewState: null, error: "" });
    } catch (p) {
      s({
        busy: !1,
        reviewState: null,
        error: p.message || "Unable to import Cove segments."
      });
    } finally {
      m();
    }
  }
  return fe(() => {
    if (Ou(o))
      return Lu({
        fetchRuns: (c) => ee(`/videos/${e}/analysis-runs`, { signal: c }),
        onCompletedRun: () => l.current(),
        windowTarget: window,
        documentTarget: document
      });
  }, [e, o]), {
    importNativeSegments: d,
    nativeImportState: a
  };
}
const ar = Object.freeze([]);
function Fu(e, t) {
  var o;
  const n = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = n == null ? void 0 : n.focus) == null || o.call(n, { preventScroll: !0 });
}
function Gu({ detail: e, onDetailChange: t, onConflict: n, onReload: o, onAnalysisCompleted: i, onSlotsChanged: a, splitLayout: s, initialSegmentId: l, compatibilityMode: d = !1, profile: c, onNavigate: m }) {
  var gi, fi, pi, yi, bi;
  const p = ce(null), y = ce(/* @__PURE__ */ new Map()), [h, f] = G(0), b = ce(null);
  b.current = { onReloadProjection: o, onConflictProjection: n };
  const [{ onReload: x, onConflict: I }] = G(() => {
    const D = () => {
      y.current.clear(), f((oe) => oe + 1);
    };
    return {
      onReload: (...oe) => (D(), b.current.onReloadProjection(...oe)),
      onConflict: (...oe) => (D(), b.current.onConflictProjection(...oe))
    };
  }), [g, O] = G(null), [J, Y] = G([]), P = ce(null), L = ce(null), E = ce([]), S = ce(null), [w, C] = G(() => Ft({})), [A, M] = G(!1), [T, _] = G(Ul), [ne, U] = G(0), re = ce(null), [pe] = G(() => Rc({
    getContext: () => re.current,
    drainAfterSettle: !1
  })), ae = Md(pe.subscribe, pe.getSnapshot), Ne = Qa(ae), ye = (D, oe) => pe.acquire({ kind: D, lockId: oe }), Me = (D) => pe.enqueue(D), q = (D) => pe.stableIdentity(D), Q = ce(!1);
  fe(() => (Q.current = !0, () => {
    Q.current = !1, queueMicrotask(() => {
      Q.current || pe.dispose();
    });
  }), []);
  const ue = (D) => pe.cancel(D), ve = (D, oe) => pe.retarget(D, oe), xe = pe.getSnapshot, [be, z] = Ad(Lc, []), [ke, se] = G(""), [N, j] = G(""), [k, v] = G(""), [u, R] = G(1), [V, ie] = G(Bc), [te, je] = G(0), [H, F] = G({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [$, W] = G(Qt), me = ce(Qt), [he, Z] = G(!1), [Ke, Te] = G(!1), [Ce, Oe] = G(!1), He = ce(!1);
  He.current = Ce;
  const [gt, Ge] = G(null), [ft, ot] = G(!1), [Pe, rt] = G(null), [xt, lt] = G(null), ht = ce(null), [Ze, it] = G(!1), [B, X] = G(""), le = ce(null), ge = ce(null), de = ce(!1), [De, Ee] = G(Uc), [Xe, Le] = G(null), [tt, We] = G(!1), [Ae, $e] = G(!1), [et, Ue] = G(!1), [Be, we] = G(!1), [Gt, qe] = G(!1), [vt, At] = G(""), {
    importNativeSegments: nt,
    nativeImportState: Re
  } = ju(
    e.video.id,
    x,
    i,
    d,
    (D, oe) => pe.acquire({ kind: D, lockId: oe })
  ), [Ie, dt] = G(!1), [kt, bt] = G(null), [Ht, St] = G(d), [It, Zt] = G(0), [dn, en] = G(!1), [Kn, zn] = G(""), [br, hr] = G(null), _n = ce(null), vr = ce(null), Hn = ce(!1), [cn, xn] = G([]), [kn, Sr] = G(!1), [qn, Zr] = G(null), Wn = Fc(), Vn = ce(null), Jn = ce(null), wn = ce(null), xr = ce(l), kr = ce(null), Yn = ce(null), un = ce(null), Qn = ce(null), Bt = ce(null), Ct = ce(null), Xn = ce(null), Zn = ce(null), wr = ce(null), Nr = ce(null), Nn = ce(null), er = ce(null), Ir = ce(-1e12), eo = ce(null), tr = ce(null), [at, In] = G({ scrollTop: 0, height: 512 });
  fe(() => {
    if (!Ie || dn || !Kn) return;
    const D = requestAnimationFrame(() => {
      var oe;
      return (oe = vr.current) == null ? void 0 : oe.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(D);
  }, [Ie, dn, Kn]), fe(() => {
    if (!Hn.current || Ie || Ht) return;
    const D = requestAnimationFrame(() => {
      var oe;
      (oe = _n.current) == null || oe.focus({ preventScroll: !0 }), Hn.current = !1;
    });
    return () => cancelAnimationFrame(D);
  }, [Ie, Ht]);
  const st = e.video, wt = e.segments || ar, Cr = Je(() => JSON.stringify({
    segments: wt.map((D) => [
      D.id,
      D.itemId,
      D.nativeSegmentId,
      D.tagId,
      D.startSec,
      D.endSec,
      D.reviewState,
      D.published,
      D.sourceKey,
      D.sourceRunId,
      D.confidence,
      D.revision,
      D.updatedAt
    ]),
    performerSlots: (e.performerSlots || ar).map((D) => [
      D.segmentId,
      D.slotDefinitionId,
      D.performerId,
      D.sortOrder
    ])
  }), [wt, e.performerSlots]);
  fe(() => {
    if (!d) {
      bt(null), St(!1);
      return;
    }
    if (Ne != null) {
      St(!0);
      return;
    }
    let D = !0;
    St(!0);
    const oe = setTimeout(() => {
      ee(`/videos/${st.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((_e) => {
        D && (bt(_e), zn(""));
      }).catch((_e) => {
        D && (bt(null), zn(_e.message || "Unable to preview derived segments."));
      }).finally(() => {
        D && St(!1);
      });
    }, 150);
    return () => {
      D = !1, clearTimeout(oe);
    };
  }, [d, st.id, Cr, It, Ne]);
  const mn = () => Zt((D) => D + 1), qt = e.segmentGroups || ar, $t = e.performerSlots || ar, $r = d && e.performerSlotsAvailable !== !1, gn = Je(
    () => (e.performerCandidates || []).filter((D) => D.isVideoPerformer),
    [e.performerCandidates]
  ), Cn = e.shotBoundaries || ar, nr = Je(
    () => _a($t),
    [$t]
  ), $n = Je(
    () => wt.map((D) => {
      const oe = nr.get(D.id) || [];
      return {
        ...D,
        slots: oe,
        assignment: oe.every((_e) => _e.performerId == null) ? Nd(oe, gn) : null
      };
    }).filter((D) => D.slots.length > 0 && D.assignment != null),
    [wt, nr, gn]
  ), fn = Number((gi = st.videoFile) == null ? void 0 : gi.frameRate) > 0 ? Number(st.videoFile.frameRate) : 30;
  function Tn() {
    const D = He.current;
    Oe(!1), D && requestAnimationFrame(() => {
      var oe;
      return (oe = Ct.current) == null ? void 0 : oe.focus({ preventScroll: !0 });
    });
  }
  function to() {
    Ne == null && (er.current = null, ot(!1), se(""), requestAnimationFrame(() => {
      var D;
      return (D = Ct.current) == null ? void 0 : D.focus({ preventScroll: !0 });
    }));
  }
  function no() {
    M(!1), requestAnimationFrame(() => {
      var D, oe;
      (D = Zn.current) != null && D.isConnected ? Zn.current.focus({ preventScroll: !0 }) : (oe = Ct.current) == null || oe.focus({ preventScroll: !0 });
    });
  }
  fe(() => {
    Nn.current === g ? (Nn.current = null, Oe(!0)) : Oe(!1);
  }, [g]), fe(() => {
    var oe;
    if (!Ce) return;
    const D = (oe = Nr.current) == null ? void 0 : oe.querySelector("input");
    document.activeElement !== D && (D == null || D.focus({ preventScroll: !0 }), D == null || D.select());
  }, [Ce, g]), fe(() => {
    var oe;
    if (Ce) return;
    const D = (oe = Ct.current) == null ? void 0 : oe.ownerDocument;
    D && D.activeElement === D.body && Ct.current.focus({ preventScroll: !0 });
  }, [Ce]), fe(() => {
    var _e, ut, Nt;
    const D = hn(
      lo(
        e.segments,
        e.performerSlots || [],
        Ft({}),
        d && T,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), oe = ((_e = e.segments.find((Dn) => Dn.id === l)) == null ? void 0 : _e.id) ?? ((ut = ga(D)) == null ? void 0 : ut.id) ?? null;
    O(oe), Y(oe == null ? [] : [oe]), L.current = oe, E.current = [], Le(Kt(D, oe)), C(Ft({})), M(!1), er.current = null, ot(!1), R(1), se(""), W(Qt), me.current = Qt, Z(!1), (Nt = Ct.current) == null || Nt.focus({ preventScroll: !0 });
  }, [st.id, l]), fe(() => {
    const D = new AbortController();
    return ee(`/videos/${st.id}/incorrect-examples`, { signal: D.signal }).then(xn).catch((oe) => {
      oe.name !== "AbortError" && xn([]);
    }), () => D.abort();
  }, [st.id, c == null ? void 0 : c.effectiveMode]), fe(() => {
    const D = new AbortController();
    return ee(`/videos/${st.id}/history`, { signal: D.signal }).then((oe) => {
      const _e = oe || Qt;
      me.current = _e, W(_e);
    }).catch((oe) => {
      oe.name !== "AbortError" && se(oe.message || "Unable to load editor history.");
    }), () => D.abort();
  }, [st.id]), fe(() => {
    zc(V);
  }, [V.timelineRatio, V.markerRailOpen, V.detailWidth, V.markerRailWidth, V.swimlaneTitleWidth]), fe(() => {
    Kc(De);
  }, [De]), fe(() => {
    Kl(T);
  }, [T]), fe(() => {
    const D = Yn.current;
    if (!s || !D || typeof ResizeObserver > "u") return;
    const oe = () => {
      var Nt;
      const ut = Math.max(0, D.clientHeight - (((Nt = un.current) == null ? void 0 : Nt.offsetHeight) || 0));
      je(ut), ie((Dn) => {
        const hi = Oo(Dn.timelineRatio, ut);
        return hi === Dn.timelineRatio ? Dn : { ...Dn, timelineRatio: hi };
      });
    }, _e = new ResizeObserver(oe);
    return _e.observe(D), un.current && _e.observe(un.current), oe(), () => _e.disconnect();
  }, [s]), fe(() => {
    if (!Wn || typeof ResizeObserver > "u") return;
    const D = Bt.current, oe = Qn.current;
    if (!D || !oe) return;
    const _e = () => F({
      workspace: D.clientWidth,
      focusRow: oe.clientWidth,
      focusRowHeight: oe.clientHeight
    }), ut = new ResizeObserver(_e);
    return ut.observe(D), ut.observe(oe), _e(), () => ut.disconnect();
  }, [Wn, V.markerRailOpen]);
  const tn = Je(
    () => _o(wt, be),
    [wt, be]
  );
  Fi(() => {
    ns(be, e) !== be && z({ type: "prune", detail: e });
  }, [e, be]);
  const Jt = Je(
    () => _i(
      lo(
        tn,
        $t,
        w,
        d && T,
        qt
      ),
      cn,
      !0
    ),
    [
      tn,
      $t,
      w,
      T,
      qt,
      d,
      cn
    ]
  ), Rn = Object.fromEntries(Et.map((D) => [D, Jt.filter((oe) => oe.reviewState === D).length])), En = _i(
    lo(
      tn,
      $t,
      { ...w, reviewStates: Et },
      d && T,
      qt
    ),
    cn,
    !0
  ), K = Object.fromEntries(Et.map((D) => [D, En.filter((oe) => oe.reviewState === D).length])), Ve = [...new Set(tn.map((D) => D.sourceKey).filter(Boolean))].sort((D, oe) => _t(D).localeCompare(_t(oe))), Pt = El(
    w,
    d && T
  ), ct = Je(
    () => hn(Jt, qt, $t),
    [Jt, qt, $t]
  ), Lt = Je(
    () => gc(ct, De),
    [ct, De]
  ), ze = Dl(
    ct,
    g,
    l,
    {
      visibleLanes: Lt,
      reference: ((fi = p.current) == null ? void 0 : fi.videoId) === st.id ? p.current.reference : null
    }
  );
  fe(() => {
    const D = Fr(ct, ze == null ? void 0 : ze.id);
    D && (p.current = { videoId: st.id, reference: D });
  }, [st.id, ze == null ? void 0 : ze.id, ct]);
  const Tr = Je(() => {
    const D = Dc(be);
    return D.length === 0 ? wt : [...wt, ...D];
  }, [wt, be]), Se = ze == null ? null : Tr.find((D) => D.id === ze.id) || ze, nn = $i(Tr, $i(Jt, J).map((D) => D.id)), cs = Tc(ae, nn), us = Ln(ae), ms = Io(ae), Wo = !d && nn.length > 0 && nn.every((D) => D.nativeSegmentId != null), Vo = Jt.map((D) => D.id), gs = Vo.join("|");
  P.current = (Se == null ? void 0 : Se.id) ?? null;
  const Jo = ce(null);
  Jo.current = g;
  const Yo = nr.get(Se == null ? void 0 : Se.id) || [], fs = Uo(Yo), Qo = Je(
    () => uc(ct, J),
    [ct, J]
  ), Rr = Je(() => Ko(ct), [ct]), rr = Je(
    () => dc(Rr, De),
    [Rr, De]
  ), ps = Je(
    () => qa(
      rr.rows,
      at.scrollTop,
      at.height
    ),
    [rr, at]
  ), ys = Kr(Lt, Se == null ? void 0 : Se.id, -1, !0) != null, bs = Kr(Lt, Se == null ? void 0 : Se.id, 1, !0) != null, An = Se ? Kt(ct, Se.id) : null, ro = Ha(Rr) ? Rr.map((D) => D.key) : [], hs = ro.join("|"), Er = Math.max(
    0,
    Number((pi = st.videoFile) == null ? void 0 : pi.duration) || 0,
    ...tn.map((D) => Number(D.endSec ?? D.startSec) || 0)
  ), Xo = Number((yi = st.videoFile) == null ? void 0 : yi.duration) > 0 ? Number(st.videoFile.duration) : null;
  $.actions;
  const vs = ka();
  fe(() => {
    const D = g === Pn ? g : (Se == null ? void 0 : Se.id) ?? null;
    D !== g && O(D);
  }, [Se, g]), fe(() => {
    Y((D) => {
      const oe = jl(
        D,
        Vo,
        (Se == null ? void 0 : Se.id) ?? null
      );
      return oe.length === D.length && oe.every((_e, ut) => _e === D[ut]) ? D : oe;
    });
  }, [gs, Se == null ? void 0 : Se.id]);
  const or = e.itemMetadataAvailable ? (Se == null ? void 0 : Se.itemId) ?? null : null, Zo = or == null ? null : ((bi = e.itemMetadata) == null ? void 0 : bi[or]) || null, Yt = or == null || Zo ? null : `${h}:${or}:${Se.revision}:${Se.updatedAt}`, [oo, io] = G({ key: null, value: null, error: null });
  fe(() => {
    if (Yt == null) return;
    const D = y.current.get(Yt);
    if (D) {
      io({ key: Yt, value: D, error: null });
      return;
    }
    const oe = new AbortController(), _e = setTimeout(() => {
      ee(`/videos/${st.id}/items/${or}/metadata`, { signal: oe.signal }).then((ut) => {
        const Nt = y.current;
        Nt.size >= 500 && Nt.delete(Nt.keys().next().value), Nt.set(Yt, ut), io({ key: Yt, value: ut, error: null });
      }).catch((ut) => {
        oe.signal.aborted || io({ key: Yt, value: null, error: ut.message || "Unable to load provenance." });
      });
    }, 100);
    return () => {
      clearTimeout(_e), oe.abort();
    };
  }, [Yt, st.id]);
  const ir = Yt == null ? { loading: !1, error: null, value: Zo } : oo.key === Yt ? { loading: !1, error: oo.error, value: oo.value } : { loading: !0, error: null, value: null }, Mn = ir.value, Ss = {
    key: (Se == null ? void 0 : Se.itemId) != null ? `item:${Se.itemId}` : (Se == null ? void 0 : Se.nativeSegmentId) != null ? `native:${Se.nativeSegmentId}` : null,
    loading: ir.loading,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : ir.error,
    items: e.itemMetadataAvailable ? (Mn == null ? void 0 : Mn.provenance) || (Se == null ? void 0 : Se.fieldProvenance) || [] : []
  }, ao = (Se == null ? void 0 : Se.itemId) != null ? {
    loading: ir.loading,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : ir.error,
    data: e.lineageMetadataAvailable && (Mn == null ? void 0 : Mn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  fe(() => {
    j(ze == null ? "" : String(ze.startSec)), v((ze == null ? void 0 : ze.endSec) == null ? "" : String(ze.endSec));
  }, [ze == null ? void 0 : ze.id, ze == null ? void 0 : ze.startSec, ze == null ? void 0 : ze.endSec]), fe(() => {
    An && Ee((D) => Ja(D, An));
  }, [st.id, l, An]), fe(() => {
    Le((D) => bc(ro, D, An));
  }, [st.id, hs, An]), fe(() => {
    if (!V.markerRailOpen || (Se == null ? void 0 : Se.id) == null) return;
    const D = tr.current, oe = rr.rows.find((Nt) => Nt.kind === "segment" && Nt.segment.id === Se.id);
    if (!D || !oe) return;
    const _e = oe.top + oe.height;
    let ut = D.scrollTop;
    oe.top < D.scrollTop ? ut = oe.top : _e > D.scrollTop + D.clientHeight && (ut = Math.max(0, _e - D.clientHeight)), ut !== D.scrollTop && (D.scrollTop = ut), In({ scrollTop: ut, height: D.clientHeight });
  }, [Se == null ? void 0 : Se.id, rr, V.markerRailOpen]), fe(() => {
    const D = tr.current;
    if (!V.markerRailOpen || !D) return;
    const oe = () => In({
      scrollTop: D.scrollTop,
      height: D.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      oe();
      return;
    }
    const _e = new ResizeObserver(oe);
    return _e.observe(D), oe(), () => _e.disconnect();
  }, [V.markerRailOpen]);
  const { revealSegmentGroupForSelection: ei, replaceSegmentSelection: xs, selectSegment: ti, selectSegmentCollection: ks, selectAllVideoSegments: ws } = Tu({
    allSwimlanes: ct,
    editorRef: Ct,
    performerSlots: $t,
    seekRef: Vn,
    segmentGroups: qt,
    segments: wt,
    selectedSegmentId: g,
    selectedSegmentIds: J,
    selectionAnchorIdRef: L,
    selectionRangeBaseIdsRef: E,
    setCollapsedSegmentGroups: Ee,
    setEditorFilters: C,
    setHideDerivedSegments: _,
    setSaveMessage: se,
    setSelectedSegmentGroupKey: Le,
    setSelectedSegmentId: O,
    setSelectedSegmentIds: Y
  }), { acceptHistory: so, recordHistoryAction: Ar, mutateSegment: Ns, runSegmentMutation: Is, completeReview: Cs, createSegment: ni, splitSegment: ri, duplicateSegment: oi, saveTiming: $s, applyShortcutTiming: Ts } = jc({
    compatibilityMode: d,
    getRequestedSelectionId: () => Jo.current,
    displayedSelectedSegment: ze,
    getSaveQueueSnapshot: xe,
    currentTime: ne,
    detail: e,
    editorFilters: w,
    endInput: k,
    hideDerivedSegments: T,
    historyRef: me,
    mediaDuration: Xo,
    onConflict: I,
    onDetailChange: t,
    onReload: x,
    optimisticSegmentIdRef: Ir,
    pendingDuplicateRef: eo,
    pendingFirstSegmentStartSecRef: er,
    pendingTagEditSegmentIdRef: Nn,
    performerSlots: $t,
    enqueueSave: Me,
    pendingChanges: be,
    retargetSaveTasks: ve,
    replaceSegmentSelection: xs,
    savingSegmentId: Ne,
    segments: wt,
    selectedSegment: Se,
    selectedSegmentIdRef: P,
    selectedSegments: nn,
    selectionAnchorIdRef: L,
    selectionRangeBaseIdsRef: E,
    setCreatingSegmentId: Ge,
    setEditorFilters: C,
    setFirstSegmentTagOpen: ot,
    setHideDerivedSegments: _,
    setHistory: W,
    setHistoryOpen: Z,
    setPublishApprovedError: X,
    setSaveMessage: se,
    acquireSaveLock: ye,
    dispatchPendingChanges: z,
    setSelectedSegmentGroupKey: Le,
    setSelectedSegmentId: O,
    setSelectedSegmentIds: Y,
    setTagEditing: Oe,
    startInput: N,
    tagEditingRef: He,
    timelineDuration: Er,
    video: st
  });
  function ii(D = null) {
    var ut;
    if (!d || Ne != null || !wt.some((Nt) => !Nt.published && Nt.reviewState === "approved")) return;
    const oe = ((ut = Ct.current) == null ? void 0 : ut.ownerDocument) ?? document, _e = oe.activeElement === oe.body ? null : oe.activeElement;
    ge.current = D != null && D.isConnected && D !== oe.body ? D : _e, X(""), it(!0);
  }
  function ai() {
    Ne == null && (it(!1), X(""), requestAnimationFrame(() => {
      Fu(
        ge.current,
        Ct.current
      ), ge.current = null;
    }));
  }
  async function Rs() {
    await Cs() && ai();
  }
  const { closeMergeConfirmation: Es, mergeSelectedSwimlane: si, saveSelectedReviewState: As } = Ru({
    acceptHistory: so,
    pendingChanges: be,
    compatibilityMode: d,
    detail: e,
    detailPanelRef: S,
    getSaveQueueSnapshot: xe,
    historyRef: me,
    onConflict: I,
    onDetailChange: t,
    onReload: x,
    recordHistoryAction: Ar,
    revealSegmentGroupForSelection: ei,
    savingSegmentId: Ne,
    selectedGroups: Qo,
    selectedSegment: Se,
    selectedSegmentIdRef: P,
    selectedSegments: nn,
    selectionAnchorIdRef: L,
    selectionRangeBaseIdsRef: E,
    setMergeConfirmation: rt,
    setSaveMessage: se,
    acquireSaveLock: ye,
    dispatchPendingChanges: z,
    enqueueSave: Me,
    stableSaveIdentity: q,
    setSelectedSegmentId: O,
    setSelectedSegmentIds: Y,
    video: st
  }), Ms = (D) => {
    const oe = (D || []).map(pt);
    pe.cancel((_e) => _e.kind === "review" && Qr(_e.targets, oe));
  }, Ds = pe.settledCount();
  Fi(() => {
    pe.markCommitted(Ds), re.current = {
      detail: e,
      segments: wt,
      onConflict: I,
      onDetailChange: t,
      onReload: x,
      tagEditing: Ce,
      selectedSegmentIds: J,
      activeSegmentId: (Se == null ? void 0 : Se.id) ?? null
    };
  }), fe(() => {
    pe.poke();
  });
  const { toggleIncorrectExample: Os, removeIncorrectExample: Ps, captureTrainingExport: Ls, deleteRejectedSegments: li, autoAssignPerformers: js, previewDerivedSegments: Fs, closeMaterializeDialog: Gs, materializeDerivedSegments: Bs, saveTag: Us, moveToBin: Ks, emptyRecyclingBin: zs } = Eu({
    acceptHistory: so,
    displayedSelectedSegment: ze,
    allSwimlanes: ct,
    autoAssignCandidates: $n,
    autoAssigning: Gt,
    binEmptyingRef: de,
    canMoveSelectionToBin: Wo,
    closeTagEditing: Tn,
    compatibilityMode: d,
    creatingSegmentId: gt,
    detail: e,
    editorFilters: w,
    editorRef: Ct,
    exportingExamples: kn,
    hideDerivedSegments: T,
    incorrectExamples: cn,
    lineage: ao,
    materializeButtonRef: _n,
    materializePreview: kt,
    materializeRestoreFocusRef: Hn,
    materializing: dn,
    mutateSegment: Ns,
    onConflict: I,
    onDetailChange: t,
    onReload: x,
    performerSlots: $t,
    cancelSaveTasks: ue,
    dispatchPendingChanges: z,
    enqueueSave: Me,
    stableSaveIdentity: q,
    pendingChanges: be,
    runSegmentMutation: Is,
    recordHistoryAction: Ar,
    refreshMaterializationPreview: mn,
    removingExampleId: qn,
    revealSegmentGroupForSelection: ei,
    savingSegmentId: Ne,
    segmentGroups: qt,
    segments: wt,
    selectedSegment: Se,
    selectedSegmentIdRef: P,
    selectedSegments: nn,
    selectionAnchorIdRef: L,
    selectionRangeBaseIdsRef: E,
    setAutoAssignError: At,
    setAutoAssignOpen: we,
    setAutoAssigning: qe,
    setEditorFilters: C,
    setExportingExamples: Sr,
    setHideDerivedSegments: _,
    setIncorrectExamples: xn,
    setMaterializeError: zn,
    setMaterializeLoading: St,
    setMaterializeOpen: dt,
    setMaterializePreview: bt,
    setMaterializing: en,
    setRemovingExampleId: Zr,
    setRejectedDeletionPreview: lt,
    setSaveMessage: se,
    acquireSaveLock: ye,
    setSelectedSegmentGroupKey: Le,
    setSelectedSegmentId: O,
    setSelectedSegmentIds: Y,
    swimlanes: Lt,
    video: st
  }), { restoreHistoryTarget: _s, updateTimelineRatio: di, handleSeparatorPointerDown: Hs, handleSeparatorPointerMove: qs, handleSeparatorKeyDown: Ws, panelWidthMaximum: ci, panelSeparatorProps: Vs, toggleSegmentRail: Js, toggleSegmentGroup: ui, mutateShotBoundary: Ys } = Au({
    acceptHistory: so,
    compatibilityMode: d,
    currentTime: ne,
    detail: e,
    editorLayout: V,
    focusRowRef: Qn,
    history: $,
    historyRef: me,
    historySaving: Ke,
    horizontalLayoutSize: H,
    mediaStackHeight: te,
    mediaStackRef: Yn,
    commonActionsRef: un,
    onDetailChange: t,
    onReload: x,
    railToggleRef: Xn,
    recordHistoryAction: Ar,
    savingSegmentId: Ne,
    setCollapsedSegmentGroups: Ee,
    setEditorLayout: ie,
    setHistorySaving: Te,
    setIncorrectExamples: xn,
    setSaveMessage: se,
    acquireSaveLock: ye,
    enqueueSave: Me,
    getSaveQueueSnapshot: xe,
    shotBoundaries: Cn,
    timelineDuration: Er,
    video: st,
    workspaceRef: Bt
  }), { executeShortcutById: mi, stepVideoFrame: Qs } = Mu({
    allSwimlanes: ct,
    displayedSelectedSegment: ze,
    applyShortcutTiming: Ts,
    centerTimelineRef: kr,
    compatibilityMode: d,
    createSegment: ni,
    currentTime: ne,
    deleteRejectedSegments: li,
    duplicateSegment: oi,
    editorLayout: V,
    editorRef: Ct,
    emptyRecyclingBin: zs,
    lineage: ao,
    mediaDuration: Xo,
    mergeSelectedSwimlane: si,
    moveToBin: Ks,
    mutateShotBoundary: Ys,
    openPublishApprovedDialog: ii,
    playbackControlsRef: Jn,
    playbackShortcutConfig: vs,
    saveSelectedReviewState: As,
    seekRef: Vn,
    segmentGroupKeys: ro,
    selectSegment: ti,
    selectedSegment: Se,
    selectedSegmentGroupForSegment: An,
    selectedSegmentGroupKey: Xe,
    selectedSegments: nn,
    setCollapsedSegmentGroups: Ee,
    setIncorrectExamplesOpen: Ue,
    setQuickSearchOpen: $e,
    setSaveMessage: se,
    setSelectedSegmentGroupKey: Le,
    setTagEditing: Oe,
    setTimelineZoom: R,
    shotBoundaries: Cn,
    slotButtonRef: wr,
    splitSegment: ri,
    swimlanes: Lt,
    timelineDuration: Er,
    toggleIncorrectExample: Os,
    toggleSegmentGroup: ui,
    updateTimelineRatio: di,
    videoFrameRate: fn,
    visibleSegments: Jt
  });
  wn.current = mi;
  const Xs = Je(() => fr.map((D) => ({
    id: D.id,
    enabled: Gn(D, d),
    surface: "local",
    action: (oe) => {
      var _e;
      return (_e = wn.current) == null ? void 0 : _e.call(wn, D.id, oe);
    }
  })), [d]);
  na(Ao, Xs);
  const Zs = Do(te), el = yn(V.markerRailWidth, ci("markerRailWidth")), tl = yn(V.detailWidth, ci("detailWidth"));
  return r($u, {
    activeFilterCount: Pt,
    allSwimlanes: ct,
    approvalFacetCounts: K,
    autoAssignCandidates: $n,
    autoAssignError: vt,
    autoAssignOpen: Be,
    autoAssignPerformers: js,
    autoAssigning: Gt,
    canMoveSelectionToBin: Wo,
    captureTrainingExport: Ls,
    cancelQueuedReviewsForSegments: Ms,
    removeIncorrectExample: Ps,
    rejectedDeletionPreview: xt,
    centerTimelineRef: kr,
    closeEditorFilters: no,
    closeFirstSegmentTagDialog: to,
    closeMaterializeDialog: Gs,
    closeMergeConfirmation: Es,
    closePublishApprovedDialog: ai,
    closeTagEditing: Tn,
    collapsedSegmentGroups: De,
    commonActionsRef: un,
    compatibilityMode: d,
    configuringTag: br,
    createSegment: ni,
    currentTime: ne,
    deleteRejectedSegments: li,
    detail: e,
    detailPanelRef: S,
    detailWidth: tl,
    duplicateSegment: oi,
    editorFilters: w,
    editorLayout: V,
    editorRef: Ct,
    exportingExamples: kn,
    filtersButtonRef: Zn,
    filtersOpen: A,
    firstSegmentTagOpen: ft,
    focusRowRef: Qn,
    handleSeparatorKeyDown: Ws,
    handleSeparatorPointerDown: Hs,
    handleSeparatorPointerMove: qs,
    hideDerivedSegments: T,
    history: $,
    historyOpen: he,
    historySaving: Ke,
    hasNextUnreviewed: bs,
    hasPreviousUnreviewed: ys,
    horizontalLayoutSize: H,
    importNativeSegments: nt,
    incorrectExamples: cn,
    incorrectExamplesOpen: et,
    removingExampleId: qn,
    lineage: ao,
    markerRailWidth: el,
    materializeButtonRef: _n,
    materializeCancelButtonRef: vr,
    materializeDerivedSegments: Bs,
    materializeError: Kn,
    materializeLoading: Ht,
    materializeOpen: Ie,
    materializePreview: kt,
    materializing: dn,
    mediaStackRef: Yn,
    mergeCancelButtonRef: ht,
    mergeConfirmation: Pe,
    mergeSaving: Cc(ae, "merge"),
    mergeSelectedSwimlane: si,
    nativeImportState: Re,
    onNavigate: m,
    onDetailChange: t,
    openPublishApprovedDialog: ii,
    onReload: x,
    onSlotsChanged: a,
    panelSeparatorProps: Vs,
    pendingInitialSeekRef: xr,
    performerSlots: $t,
    performerSlotsAvailable: $r,
    playbackControlsRef: Jn,
    previewDerivedSegments: Fs,
    provenance: Ss,
    provenanceSources: Ve,
    publishApprovedCancelButtonRef: le,
    publishApprovedDrafts: Rs,
    publishApprovedError: B,
    publishApprovedOpen: Ze,
    quickSearchOpen: Ae,
    railScrollRef: tr,
    railToggleRef: Xn,
    recordHistoryAction: Ar,
    restoreHistoryTarget: _s,
    runEditorAction: mi,
    stepVideoFrame: Qs,
    saveMessage: ke,
    setSaveMessage: se,
    saveTag: Us,
    saveTiming: $s,
    savingSegmentId: Ne,
    selectionBusy: cs,
    editorHeldByOtherWork: us,
    segmentCreationPending: ms,
    acquireSaveLock: ye,
    seekRef: Vn,
    segmentGroups: qt,
    segmentRailLayout: rr,
    segments: tn,
    selectAllVideoSegments: ws,
    selectSegment: ti,
    selectSegmentCollection: ks,
    selectedGroups: Qo,
    selectedPerformerSlots: Yo,
    selectedSegment: ze,
    selectedSegmentGroupKey: Xe,
    selectedSegmentIds: J,
    selectedSegments: nn,
    selectedSlotStatus: fs,
    setAutoAssignError: At,
    setAutoAssignOpen: we,
    setConfiguringTag: hr,
    setCurrentTime: U,
    setEditorFilters: C,
    setEditorLayout: ie,
    setFiltersOpen: M,
    setHideDerivedSegments: _,
    setHistoryOpen: Z,
    setIncorrectExamplesOpen: Ue,
    setQuickSearchOpen: $e,
    setRejectedDeletionPreview: lt,
    setRailViewport: In,
    setSelectedSegmentGroupKey: Le,
    setSelectedSegmentId: O,
    setShortcutsOpen: We,
    setTimelineZoom: R,
    shotBoundaries: Cn,
    shortcutsOpen: tt,
    slotButtonRef: wr,
    splitLayout: s,
    splitSegment: ri,
    tagEditing: Ce,
    creatingSegmentId: gt,
    tagSearchRef: Nr,
    timelineDuration: Er,
    timelineRatioBounds: Zs,
    timelineZoom: u,
    toggleSegmentGroup: ui,
    toggleSegmentRail: Js,
    updateTimelineRatio: di,
    video: st,
    videoPerformers: gn,
    visibleCounts: Rn,
    visibleSegmentRailRows: ps,
    visibleSegments: Jt,
    wideLayout: Wn,
    workspaceRef: Bt
  });
}
function Bu(e = [], t = []) {
  const n = new Map((t || []).map((s) => [
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
      const c = n.get(d);
      return {
        ...l,
        tagId: d,
        tagName: l.tagName || (c == null ? void 0 : c.tagName) || `Tag ${d}`,
        allowSamePerformerInMultipleSlots: !!(c != null && c.allowSamePerformerInMultipleSlots),
        definitions: (c == null ? void 0 : c.definitions) || []
      };
    })
  })), a = [...n.values()].filter((s) => !o.has(s.tagId) && s.definitions.length > 0).map((s) => ({
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
function Uu(e = [], t = "", n = "all") {
  const o = String(t || "").trim().toLocaleLowerCase();
  return e.map((i) => ({
    ...i,
    tags: (i.tags || []).filter((a) => {
      const s = (a.definitions || []).length > 0;
      return n === "with" && !s || n === "without" && s ? !1 : o ? [
        a.tagName,
        ...(a.definitions || []).map((l) => l.label)
      ].some((l) => String(l || "").toLocaleLowerCase().includes(o)) : !0;
    })
  })).filter((i) => i.tags.length > 0);
}
function Rt(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function Ku(e = [], t = []) {
  var h;
  const n = /* @__PURE__ */ new Map();
  [...t].sort((f, b) => (f.sortOrder ?? 0) - (b.sortOrder ?? 0) || Number(f.id) - Number(b.id)).forEach((f, b) => {
    [...f.tags || []].sort((x, I) => (x.sortOrder ?? 0) - (I.sortOrder ?? 0) || Number(x.tagId) - Number(I.tagId)).forEach((x, I) => n.set(Number(x.tagId), {
      key: `group:${f.id}`,
      id: f.id,
      name: f.name,
      sortOrder: f.sortOrder ?? b,
      tagSortOrder: x.sortOrder ?? I
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(f, b) {
    const x = Number(f);
    if (!o.has(x)) {
      const I = n.get(x);
      o.set(x, {
        tagId: x,
        name: b || `Tag ${x}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (I == null ? void 0 : I.key) || "ungrouped",
        segmentGroupId: (I == null ? void 0 : I.id) ?? null,
        segmentGroupName: (I == null ? void 0 : I.name) || "Ungrouped",
        segmentGroupSortOrder: (I == null ? void 0 : I.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (I == null ? void 0 : I.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(x);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((f) => {
    const b = i(f.sourceTagId, f.sourceTagName), x = i(f.derivedTagId, f.derivedTagName);
    b.outgoingRuleCount++, x.incomingRuleCount++;
    const I = `${b.tagId}:${x.tagId}`;
    a.has(I) || a.set(I, {
      id: I,
      sourceTagId: b.tagId,
      derivedTagId: x.tagId,
      rules: [],
      edgeCount: 0
    });
    const g = a.get(I);
    g.rules.push(f), g.edgeCount += Number(f.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((f) => [f.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((f) => {
    var b, x;
    (b = d.get(f.sourceTagId)) == null || b.add(f.derivedTagId), (x = d.get(f.derivedTagId)) == null || x.add(f.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), m = [];
  for (const f of s) {
    if (c.has(f.tagId)) continue;
    const b = [f.tagId], x = [];
    for (c.add(f.tagId); b.length > 0; ) {
      const L = b.shift();
      x.push(L);
      for (const E of d.get(L) || [])
        c.has(E) || (c.add(E), b.push(E));
    }
    const I = new Set(x), g = x.map((L) => o.get(L)), O = l.filter((L) => I.has(L.sourceTagId) && I.has(L.derivedTagId)), J = O.flatMap((L) => L.rules), Y = g.filter((L) => L.outgoingRuleCount === 0).sort((L, E) => Rt(L.name, E.name)), P = Y.length > 0 ? Y : [...g].sort((L, E) => Rt(L.name, E.name));
    m.push({
      id: [...x].sort((L, E) => L - E).join(":"),
      label: P.length > 1 ? `${P[0].name} + ${P.length - 1}` : ((h = P[0]) == null ? void 0 : h.name) || "Derivation component",
      nodes: g,
      connections: O,
      rules: J,
      segmentGroupKeys: [...new Set(g.map((L) => L.segmentGroupKey))],
      materializedEdgeCount: J.reduce(
        (L, E) => L + (Number(E.edgeCount) || 0),
        0
      )
    });
  }
  m.sort((f, b) => b.rules.length - f.rules.length || Rt(f.label, b.label));
  const p = /* @__PURE__ */ new Map();
  s.forEach((f) => {
    p.has(f.segmentGroupKey) || p.set(f.segmentGroupKey, {
      key: f.segmentGroupKey,
      id: f.segmentGroupId,
      name: f.segmentGroupName,
      sortOrder: f.segmentGroupSortOrder,
      nodes: [],
      ruleIds: /* @__PURE__ */ new Set(),
      componentIds: /* @__PURE__ */ new Set()
    }), p.get(f.segmentGroupKey).nodes.push(f);
  }), m.forEach((f) => {
    f.nodes.forEach((b) => {
      var x;
      return (x = p.get(b.segmentGroupKey)) == null ? void 0 : x.componentIds.add(f.id);
    }), f.rules.forEach((b) => {
      var x, I;
      (x = p.get(o.get(Number(b.sourceTagId)).segmentGroupKey)) == null || x.ruleIds.add(b.id), (I = p.get(o.get(Number(b.derivedTagId)).segmentGroupKey)) == null || I.ruleIds.add(b.id);
    });
  });
  const y = [...p.values()].sort((f, b) => f.sortOrder - b.sortOrder || Rt(f.name, b.name)).map((f) => ({
    ...f,
    ruleCount: f.ruleIds.size,
    componentCount: f.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: m,
    segmentGroups: y
  };
}
function zu(e, {
  minimumWidth: t = 720,
  minimumHeight: n = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const m = new Map(e.nodes.map((S) => [S.tagId, /* @__PURE__ */ new Set()])), p = new Map(e.nodes.map((S) => [S.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((S) => {
    var w, C;
    (w = m.get(S.sourceTagId)) == null || w.add(S.derivedTagId), (C = p.get(S.derivedTagId)) == null || C.add(S.sourceTagId);
  });
  const y = new Map(e.nodes.map((S) => {
    var w;
    return [
      S.tagId,
      ((w = p.get(S.tagId)) == null ? void 0 : w.size) || 0
    ];
  })), h = new Map(e.nodes.map((S) => [S.tagId, 0])), f = e.nodes.filter((S) => y.get(S.tagId) === 0).sort((S, w) => Rt(S.name, w.name)).map((S) => S.tagId), b = /* @__PURE__ */ new Set();
  for (; f.length > 0; ) {
    const S = f.shift();
    if (!b.has(S)) {
      b.add(S);
      for (const w of m.get(S) || [])
        h.set(w, Math.max(h.get(w) || 0, (h.get(S) || 0) + 1)), y.set(w, y.get(w) - 1), y.get(w) === 0 && f.push(w);
    }
  }
  b.size !== e.nodes.length && e.nodes.filter((S) => !b.has(S.tagId)).sort((S, w) => Rt(S.name, w.name)).forEach((S) => h.set(S.tagId, 0));
  const x = Math.max(0, ...h.values()), I = Math.max(
    t,
    240 + x * 296
  ), g = /* @__PURE__ */ new Map();
  e.nodes.forEach((S) => {
    g.has(S.segmentGroupKey) || g.set(S.segmentGroupKey, {
      key: S.segmentGroupKey,
      id: S.segmentGroupId,
      name: S.segmentGroupName,
      sortOrder: S.segmentGroupSortOrder,
      nodes: []
    }), g.get(S.segmentGroupKey).nodes.push(S);
  });
  const O = [...g.values()].sort((S, w) => S.sortOrder - w.sortOrder || Rt(S.name, w.name));
  let J = 28;
  const Y = [], P = O.map((S) => {
    const w = /* @__PURE__ */ new Map();
    S.nodes.forEach((_) => {
      const ne = h.get(_.tagId) || 0;
      w.has(ne) || w.set(ne, []), w.get(ne).push(_);
    });
    for (const _ of w.values())
      _.sort((ne, U) => ne.segmentGroupTagSortOrder - U.segmentGroupTagSortOrder || Rt(ne.name, U.name));
    const C = Math.max(1, ...[...w.values()].map((_) => _.length)), A = C * 58 + (C - 1) * 18, M = 70 + A, T = {
      ...S,
      x: 12,
      y: J,
      width: I - 24,
      height: M
    };
    for (const [_, ne] of w.entries()) {
      const U = ne.length * 58 + Math.max(0, ne.length - 1) * 18, re = (A - U) / 2;
      ne.forEach((pe, ae) => Y.push({
        ...pe,
        rank: _,
        x: 28 + _ * 296,
        y: J + 34 + 18 + re + ae * 76,
        width: 184,
        height: 58
      }));
    }
    return J += M + 16, T;
  }), L = new Map(Y.map((S) => [S.tagId, S])), E = e.connections.map((S) => {
    const w = L.get(S.sourceTagId), C = L.get(S.derivedTagId), A = w.x + w.width, M = w.y + w.height / 2, T = C.x, _ = C.y + C.height / 2, ne = Math.max(48, (T - A) * 0.48);
    return {
      ...S,
      path: `M ${A} ${M} C ${A + ne} ${M}, ${T - ne} ${_}, ${T} ${_}`
    };
  });
  return {
    width: I,
    height: Math.max(n, J - 16 + 28),
    nodes: Y,
    connections: E,
    groups: P
  };
}
function _u(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = zu(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), m = 20, p = o, y = c.nodes.map((f) => ({
      ...f,
      x: f.x + m,
      y: f.y + p
    })), h = new Map(y.map((f) => [f.tagId, f]));
    a.push(...y), l.push(...c.groups.map((f) => ({
      ...f,
      componentId: d.id,
      x: f.x + m,
      y: f.y + p
    }))), s.push(...c.connections.map((f) => {
      const b = h.get(f.sourceTagId), x = h.get(f.derivedTagId), I = b.x + b.width, g = b.y + b.height / 2, O = x.x, J = x.y + x.height / 2, Y = Math.max(48, (O - I) * 0.48);
      return {
        ...f,
        componentId: d.id,
        path: `M ${I} ${g} C ${I + Y} ${g}, ${O - Y} ${J}, ${O} ${J}`
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
function Qi(e, t = []) {
  if (!(e != null && e.sourceTagId) || !(e != null && e.derivedTagId)) return null;
  const n = Number(e.sourceTagId), o = Number(e.derivedTagId);
  if (n === o)
    return {
      code: "LINEAGE_CYCLE",
      message: "A tag cannot derive itself because that would create a cycle."
    };
  const i = t.filter((d) => d.id !== e.ruleId);
  if (i.some((d) => Number(d.sourceTagId) === n && Number(d.derivedTagId) === o))
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
      if (l.add(d), d === n)
        return {
          code: "LINEAGE_CYCLE",
          message: "This relationship would create a derivation cycle."
        };
      for (const c of a.get(d) || []) s.push(c);
    }
  }
  return null;
}
function Hu(e, t, n) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !n && t[0] || null;
}
function qu(e) {
  const { arrowMarkerId: t, busy: n, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: m, editorRef: p, emptyDraft: y, graph: h, layout: f, listSort: b, materializationOffer: x, materializeOutgoingRules: I, materializeRule: g, message: O, normalizedQuery: J, query: Y, refreshConfiguredTag: P, revealEditor: L, rules: E, save: S, segmentGroupKey: w, selectedNode: C, selectedRule: A, selection: M, setConfiguringTag: T, setDraft: _, setListSort: ne, setMaterializationOffer: U, setQuery: re, setSegmentGroupKey: pe, setSelection: ae, setView: Ne, sortedVisibleRules: ye, sourceSlots: Me, sourceSlotsLoading: q, updateMapping: Q, updateTag: ue, view: ve, visibleComponents: xe, visibleRules: be } = e;
  function z(k) {
    const v = h.nodes.find((R) => R.tagId === Number(k.sourceTagId)), u = h.nodes.find((R) => R.tagId === Number(k.derivedTagId));
    return (v == null ? void 0 : v.segmentGroupKey) === (u == null ? void 0 : u.segmentGroupKey) ? v.segmentGroupKey : "cross-group";
  }
  function ke() {
    return r("div", { key: "editor", ref: p, className: "space-y-4 p-4" }, [
      r("div", { key: "heading", className: "flex items-center justify-between gap-2" }, [
        r("div", { key: "copy" }, [
          r(
            "h3",
            { key: "title", className: "font-semibold text-foreground" },
            d.ruleId == null ? "Add derivation rule" : "Edit derivation rule"
          ),
          r(
            "p",
            { key: "description", className: "mt-1 text-xs text-secondary" },
            "Connect a specific tag to a more general tag."
          )
        ]),
        r("button", {
          key: "close",
          type: "button",
          disabled: n,
          onClick: () => _(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      r("div", { key: "tags", className: "space-y-3" }, [
        r("div", { key: "source", className: "space-y-2" }, [
          r("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            r("span", { key: "label" }, "Source tag (specific)"),
            r(cr, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (k, v) => ue("source", k, v == null ? void 0 : v.label),
              disabled: n,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !q && Me.length === 0 ? r("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            r("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            r("button", {
              key: "configure",
              type: "button",
              disabled: n,
              onClick: (k) => T({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: k.currentTarget
              }),
              className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
            }, "Configure source tag")
          ]) : null
        ]),
        r("div", { key: "derived", className: "space-y-2" }, [
          r("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            r("span", { key: "label" }, "Derived tag (general)"),
            r(cr, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (k, v) => ue("derived", k, v == null ? void 0 : v.label),
              disabled: n,
              placeholder: "Find a derived tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.derivedTagId && !l && s.length === 0 ? r("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            r("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            r("button", {
              key: "configure",
              type: "button",
              disabled: n,
              onClick: (k) => T({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: k.currentTarget
              }),
              className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
            }, "Configure derived tag")
          ]) : null
        ])
      ]),
      c ? r("p", {
        key: "integrity",
        role: "alert",
        className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200"
      }, c.message) : null,
      r("div", { key: "mappings", className: "space-y-2" }, [
        r("div", { key: "heading", className: "flex items-center justify-between gap-2" }, [
          r("h3", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
          r("button", {
            key: "add",
            type: "button",
            disabled: n || Me.length === 0 || s.length === 0,
            onClick: () => _((k) => ({
              ...k,
              slotMappings: [...k.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
            })),
            className: o
          }, "Add mapping")
        ]),
        d.slotMappings.length === 0 ? r("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots will be copied.") : r("div", { key: "configured", className: "space-y-2" }, [
          d.slotMappingsSuggested ? r(
            "p",
            { key: "suggested", className: "text-xs text-secondary" },
            "Matching performer slots were suggested automatically."
          ) : null,
          ...d.slotMappings.map((k, v) => r("div", { key: v, className: "flex items-center gap-2" }, [
            r("select", {
              key: "source",
              value: k.sourceSlotDefinitionId,
              disabled: n,
              onChange: (u) => Q(v, "sourceSlotDefinitionId", u.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${v + 1}`
            }, [r("option", { key: "none", value: "" }, "Source slot…"), ...Me.map((u) => r("option", { key: u.id, value: u.id }, Ot(u)))]),
            r("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            r("select", {
              key: "derived",
              value: k.derivedSlotDefinitionId,
              disabled: n,
              onChange: (u) => Q(v, "derivedSlotDefinitionId", u.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${v + 1}`
            }, [r("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((u) => r("option", { key: u.id, value: u.id }, Ot(u)))]),
            r("button", {
              key: "remove",
              type: "button",
              disabled: n,
              onClick: () => _((u) => ({
                ...u,
                slotMappings: u.slotMappings.filter((R, V) => V !== v)
              })),
              className: `${o} shrink-0 text-red-300`,
              "aria-label": `Remove performer slot mapping ${v + 1}`,
              title: "Remove mapping"
            }, "🗑")
          ]))
        ])
      ]),
      r("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        r("button", {
          key: "save",
          type: "button",
          disabled: n || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((k) => !k.sourceSlotDefinitionId || !k.derivedSlotDefinitionId),
          onClick: S,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        r("button", { key: "cancel", type: "button", disabled: n, onClick: () => _(null), className: o }, "Cancel")
      ])
    ]);
  }
  function se() {
    if (C) {
      const u = be.filter((ie) => Number(ie.derivedTagId) === C.tagId), R = be.filter((ie) => Number(ie.sourceTagId) === C.tagId), V = (ie, te, je) => r("div", {
        key: ie.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        r("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          r("span", { key: "direction", className: "block text-secondary" }, te),
          r(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${ie.sourceTagName} → ${ie.derivedTagName}`
          )
        ]),
        r("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          je ? r("button", {
            key: "materialize",
            type: "button",
            disabled: n || d != null,
            onClick: () => g(ie),
            className: o
          }, "Materialize") : null,
          r("button", {
            key: "edit",
            type: "button",
            disabled: n || d != null,
            onClick: () => m(ie, !0),
            className: o
          }, "Edit rule"),
          r("button", {
            key: "delete",
            type: "button",
            disabled: n || d != null,
            onClick: () => a(ie),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return r("div", { key: "node-details", className: "space-y-4 p-4" }, [
        r("div", { key: "identity" }, [
          r("div", { key: "group", className: "text-xs font-medium text-accent" }, C.segmentGroupName),
          r("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, C.name),
          r(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${C.incomingRuleCount} incoming · ${C.outgoingRuleCount} outgoing`
          )
        ]),
        r("button", {
          key: "configure-tag",
          type: "button",
          disabled: n || d != null,
          onClick: (ie) => T({
            tagId: C.tagId,
            tagName: C.name,
            trigger: ie.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        R.length ? r("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: n || d != null,
          onClick: () => I(C, R),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${R.length})`) : null,
        R.length ? r("div", { key: "outgoing", className: "space-y-2" }, [
          r("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...R.map((ie) => V(ie, "Derives", !0))
        ]) : null,
        u.length ? r("details", {
          key: "incoming",
          className: "group rounded-md border border-border bg-card/40"
        }, [
          r("summary", {
            key: "summary",
            className: "flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-secondary hover:text-foreground"
          }, [
            r("span", { key: "title" }, "Incoming rules"),
            r(
              "span",
              { key: "count", className: "rounded-full border border-border px-2 py-0.5 font-medium normal-case tracking-normal" },
              u.length
            )
          ]),
          r(
            "div",
            { key: "rules", className: "space-y-2 border-t border-border p-2" },
            u.map((ie) => V(ie, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!A)
      return r(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const k = h.nodes.find((u) => u.tagId === Number(A.sourceTagId)), v = h.nodes.find((u) => u.tagId === Number(A.derivedTagId));
    return r("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      r("div", { key: "identity" }, [
        r("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          r("span", { key: "source" }, (k == null ? void 0 : k.segmentGroupName) || "Ungrouped"),
          (k == null ? void 0 : k.segmentGroupKey) !== (v == null ? void 0 : v.segmentGroupKey) ? r("span", { key: "derived" }, `→ ${(v == null ? void 0 : v.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        r(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${A.sourceTagName} → ${A.derivedTagName}`
        ),
        r(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${A.edgeCount} materialized lineage edge${A.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (x == null ? void 0 : x.ruleId) === A.id ? r("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
        r(
          "p",
          { key: "summary", className: "text-sm font-medium text-foreground" },
          `${x.createCount + x.linkCount} pending derivation${x.createCount + x.linkCount === 1 ? "" : "s"}`
        ),
        r(
          "p",
          { key: "details", className: "text-xs text-secondary" },
          `${x.createCount} new segments · ${x.linkCount} existing segments to link`
        ),
        r("div", { key: "actions", className: "flex gap-2" }, [
          r("button", {
            key: "materialize",
            type: "button",
            disabled: n,
            onClick: () => g(A, x),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          r("button", {
            key: "later",
            type: "button",
            disabled: n,
            onClick: () => U(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      r("div", { key: "mappings", className: "space-y-2" }, [
        r("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        A.slotMappings.length === 0 ? r("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : A.slotMappings.map((u, R) => r("div", {
          key: `${u.sourceSlotDefinitionId}:${u.derivedSlotDefinitionId}`,
          className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
        }, [
          r(
            "span",
            { key: "source", className: "truncate text-foreground", title: u.sourceSlotLabel || "Unnamed slot" },
            u.sourceSlotLabel || "Unnamed slot"
          ),
          r("span", { key: "arrow", className: "text-secondary" }, "→"),
          r(
            "span",
            { key: "derived", className: "truncate text-foreground", title: u.derivedSlotLabel || "Unnamed slot" },
            u.derivedSlotLabel || "Unnamed slot"
          )
        ]))
      ]),
      r("dl", { key: "metadata", className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-xs" }, [
        r("dt", { key: "created-label", className: "text-secondary" }, "Created"),
        r(
          "dd",
          { key: "created", className: "text-right text-foreground" },
          A.createdAt ? new Date(A.createdAt).toLocaleDateString() : "Unknown"
        ),
        r("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        r(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          A.updatedAt ? new Date(A.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      r("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        r("button", {
          key: "materialize",
          type: "button",
          disabled: n || d != null,
          onClick: () => g(A),
          className: o
        }, "Materialize pending"),
        r("button", {
          key: "edit",
          type: "button",
          disabled: n || d != null,
          onClick: () => m(A),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        r("button", {
          key: "delete",
          type: "button",
          disabled: n,
          onClick: () => a(A),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function N() {
    if (xe.length === 0)
      return r("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, J ? "No derivation relationships match your search." : "No derivation rules.");
    const k = C == null ? void 0 : C.tagId, v = /* @__PURE__ */ new Set();
    return C && (v.add(C.tagId), f.connections.forEach((u) => {
      (u.sourceTagId === C.tagId || u.derivedTagId === C.tagId) && (v.add(u.sourceTagId), v.add(u.derivedTagId));
    })), r("div", {
      className: "min-h-[26rem] overflow-auto",
      style: {
        backgroundImage: "radial-gradient(circle at center, var(--color-border) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        maxHeight: "42rem"
      }
    }, [
      r("div", { key: "direction", className: "sticky left-0 top-0 z-30 flex min-w-[42rem] items-center gap-3 border-b border-border bg-surface/95 px-4 py-2 text-xs font-medium text-secondary backdrop-blur" }, [
        r("span", { key: "specific" }, "Specific"),
        r("span", { key: "line", className: "h-px flex-1 bg-border" }),
        r("span", { key: "arrow", "aria-hidden": "true" }, "→"),
        r("span", { key: "general" }, "General")
      ]),
      r("div", {
        key: "canvas",
        className: "relative",
        style: { width: `${f.width}px`, height: `${f.height}px` },
        "aria-label": "Derivation rule graph"
      }, [
        ...f.groups.map((u) => r("div", {
          key: `group:${u.componentId}:${u.key}`,
          className: `absolute rounded-xl border ${w === u.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
          style: {
            left: `${u.x}px`,
            top: `${u.y}px`,
            width: `${u.width}px`,
            height: `${u.height}px`
          }
        }, r("div", {
          className: "absolute left-3 top-2 max-w-[16rem] truncate text-[11px] font-semibold uppercase tracking-wide text-secondary",
          title: u.name
        }, u.name))),
        r("svg", {
          key: "edges",
          className: "pointer-events-none absolute inset-0 overflow-visible",
          width: f.width,
          height: f.height,
          "aria-hidden": "true"
        }, [
          r("defs", { key: "defs" }, r("marker", {
            id: t,
            viewBox: "0 0 10 10",
            refX: "9",
            refY: "5",
            markerWidth: "7",
            markerHeight: "7",
            orient: "auto-start-reverse"
          }, r("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "context-stroke" }))),
          ...f.connections.map((u) => {
            const R = k === u.sourceTagId || k === u.derivedTagId, V = C != null, ie = R ? "var(--color-accent)" : "var(--color-secondary)";
            return r("path", {
              key: `${u.id}:visible`,
              d: u.path,
              fill: "none",
              stroke: ie,
              strokeWidth: R ? 2.5 : 1.5,
              opacity: V && !R ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...f.nodes.map((u) => {
          const R = !J || u.name.toLocaleLowerCase().includes(J), V = C != null, ie = v.has(u.tagId), te = (C == null ? void 0 : C.tagId) === u.tagId;
          return r("button", {
            key: `node:${u.tagId}`,
            type: "button",
            onClick: () => ae({ type: "node", id: u.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${te ? "border-accent bg-accent/15 ring-2 ring-accent/25" : ie ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${u.x}px`,
              top: `${u.y}px`,
              width: `${u.width}px`,
              height: `${u.height}px`,
              opacity: !R || V && !ie ? 0.62 : 1
            },
            title: `${u.name} — ${u.segmentGroupName}`,
            "aria-label": `${u.name}, ${u.incomingRuleCount} incoming and ${u.outgoingRuleCount} outgoing derivation rules`
          }, [
            r("span", { key: "name", className: "block truncate text-sm font-medium text-foreground" }, u.name),
            r("span", { key: "counts", className: "mt-1 flex items-center gap-2 text-[11px] text-secondary" }, [
              r("span", { key: "in" }, `${u.incomingRuleCount} in`),
              r("span", { key: "arrow", "aria-hidden": "true" }, "→"),
              r("span", { key: "out" }, `${u.outgoingRuleCount} out`)
            ])
          ]);
        }),
        ...f.connections.filter((u) => u.rules.length > 1).map((u) => {
          const R = f.nodes.find((ie) => ie.tagId === u.sourceTagId), V = f.nodes.find((ie) => ie.tagId === u.derivedTagId);
          return r("div", {
            key: `bundle:${u.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(R.x + R.width + V.x) / 2 - 24}px`,
              top: `${(R.y + R.height / 2 + V.y + V.height / 2) / 2 - 10}px`
            },
            "aria-label": `${u.rules.length} rules connect ${u.rules[0].sourceTagName} to ${u.rules[0].derivedTagName}`
          }, `${u.rules.length} rules`);
        })
      ])
    ]);
  }
  function j() {
    if (xe.length === 0)
      return r(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        J ? "No derivation relationships match your search." : "No derivation rules."
      );
    const k = /* @__PURE__ */ new Map();
    ye.forEach((u) => {
      const R = z(u);
      k.has(R) || k.set(R, []), k.get(R).push(u);
    });
    const v = [
      ...h.segmentGroups.map((u) => u.key),
      "cross-group"
    ].filter((u) => k.has(u));
    return r("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, v.map((u) => {
      const R = h.segmentGroups.find((te) => te.key === u), V = u === "cross-group" ? "Cross-group relationships" : (R == null ? void 0 : R.name) || "Ungrouped", ie = k.get(u);
      return r("section", { key: u, "aria-label": V }, [
        r("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          r("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, V),
          r(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${ie.length} rule${ie.length === 1 ? "" : "s"}`
          )
        ]),
        r("div", { key: "table", role: "table", "aria-label": `${V} derivation rules` }, [
          r("div", {
            key: "header",
            role: "row",
            className: "grid gap-3 border-b border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-secondary",
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            r("span", { key: "relationship", role: "columnheader" }, "Relationship"),
            r("span", { key: "mappings", role: "columnheader" }, "Slot mappings"),
            r("span", { key: "materialized", role: "columnheader", className: "text-right" }, "Materialized")
          ]),
          ...ie.map((te) => r("button", {
            key: te.id,
            type: "button",
            role: "row",
            onClick: () => ae({ type: "rule", id: te.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(A == null ? void 0 : A.id) === te.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            r(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${te.sourceTagName} → ${te.derivedTagName}` },
              `${te.sourceTagName} → ${te.derivedTagName}`
            ),
            r("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(te.slotMappings.length)),
            r("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(te.edgeCount))
          ]))
        ])
      ]);
    }));
  }
  return r("section", {
    className: "overflow-hidden rounded-xl border border-border bg-surface",
    "aria-label": "Derived segment rules"
  }, [
    r("div", { key: "heading", className: "flex flex-wrap items-start justify-between gap-3 border-b border-border p-4" }, [
      r("div", { key: "copy" }, [
        r("h2", { key: "title", className: "text-xl font-semibold text-foreground" }, "Derivation rules"),
        r(
          "p",
          { key: "description", className: "mt-1 max-w-3xl text-sm text-secondary" },
          "Map how more specific segments are materialized as more general, derived segments."
        ),
        r(
          "p",
          { key: "summary", className: "mt-2 text-xs text-secondary" },
          `${E.length} rules · ${h.nodes.length} tags`
        )
      ]),
      r("button", {
        key: "add",
        type: "button",
        disabled: n || d != null,
        onClick: () => {
          _(y()), ae(null), L();
        },
        className: "rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
      }, "Add rule")
    ]),
    r("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 border-b border-border bg-card/40 p-3" }, [
      r("label", { key: "search", className: "min-w-[13rem] flex-1 space-y-1 text-xs text-secondary" }, [
        r("span", { key: "label" }, "Search"),
        r("input", {
          key: "input",
          type: "search",
          value: Y,
          onChange: (k) => {
            re(k.target.value), ae(null);
          },
          placeholder: "Find a tag or relationship…",
          "aria-label": "Search derivation rules",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
        })
      ]),
      r("label", { key: "group", className: "min-w-[12rem] space-y-1 text-xs text-secondary" }, [
        r("span", { key: "label" }, "Segment group"),
        r("select", {
          key: "select",
          value: w,
          disabled: d != null,
          onChange: (k) => {
            pe(k.target.value), ae(null), _(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          r("option", { key: "all", value: "all" }, "All Segment groups"),
          ...h.segmentGroups.map((k) => r("option", { key: k.key, value: k.key }, k.name))
        ])
      ]),
      ve === "list" ? r("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        r("span", { key: "label" }, "Sort"),
        r("select", {
          key: "select",
          value: b,
          onChange: (k) => ne(k.target.value),
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
        }, [
          r("option", { key: "relationship", value: "relationship" }, "Relationship"),
          r("option", { key: "source", value: "source" }, "Source tag"),
          r("option", { key: "target", value: "target" }, "Derived tag"),
          r("option", { key: "materialized", value: "materialized" }, "Most materialized")
        ])
      ]) : null,
      r(
        "div",
        { key: "view", className: "ml-auto inline-flex rounded-md border border-border bg-surface p-0.5", "aria-label": "Derivation rule view" },
        [
          ["graph", "Graph"],
          ["list", "List"]
        ].map(([k, v]) => r("button", {
          key: k,
          type: "button",
          onClick: () => {
            Ne(k), k === "graph" && (M == null ? void 0 : M.type) === "rule" && ae(null);
          },
          "aria-pressed": ve === k,
          className: `rounded px-3 py-1.5 text-sm font-medium ${ve === k ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
        }, v))
      )
    ]),
    r("div", {
      key: "workspace-scroll",
      className: "overflow-x-auto"
    }, r("div", {
      key: "workspace",
      className: "grid",
      style: {
        gridTemplateColumns: "minmax(38rem, 1fr) 22rem",
        minWidth: "60rem"
      }
    }, [
      r(
        "div",
        { key: "visualization", className: "min-w-0 border-r border-border" },
        ve === "graph" ? N() : j()
      ),
      r("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        r("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? ke() : se()
      ])
    ])),
    r("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      O ? r("p", { key: "message", role: "status", className: "text-sm text-secondary" }, O) : null
    ]),
    i ? r(qo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => P(i),
      onClose: () => {
        const k = i.trigger;
        T(null), requestAnimationFrame(() => {
          k != null && k.isConnected && k.focus();
        });
      }
    }) : null
  ]);
}
function Wu({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const n = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = G([]), [a, s] = G(null), [l, d] = G([]), [c, m] = G([]), [p, y] = G(!1), [h, f] = G(!1), [b, x] = G(!1), [I, g] = G(""), [O, J] = G(""), [Y, P] = G("graph"), [L, E] = G("all"), [S, w] = G(null), [C, A] = G("relationship"), [M, T] = G(null), [_, ne] = G(null), U = ce(null), re = ce(null), pe = Pa().replace(/:/g, "");
  function ae() {
    requestAnimationFrame(() => {
      var H;
      return (H = U.current) == null ? void 0 : H.scrollIntoView({ block: "nearest" });
    });
  }
  async function Ne(H) {
    const F = await ee("/derivation-rules", H ? { signal: H } : void 0);
    i(F || []);
  }
  fe(() => {
    const H = new AbortController();
    return Ne(H.signal).catch((F) => {
      F.name !== "AbortError" && g(F.message || "Unable to load derived segment rules.");
    }), () => H.abort();
  }, []), fe(() => {
    const H = new AbortController();
    return a != null && a.sourceTagId ? (y(!0), ee(`/slot-definitions/${a.sourceTagId}`, { signal: H.signal }).then((F) => d(F.definitions || [])).catch((F) => {
      F.name !== "AbortError" && d([]);
    }).finally(() => {
      H.signal.aborted || y(!1);
    })) : (d([]), y(!1)), a != null && a.derivedTagId ? (f(!0), ee(`/slot-definitions/${a.derivedTagId}`, { signal: H.signal }).then((F) => m(F.definitions || [])).catch((F) => {
      F.name !== "AbortError" && m([]);
    }).finally(() => {
      H.signal.aborted || f(!1);
    })) : (m([]), f(!1)), () => H.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), fe(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || p || h)
      return;
    const H = `${a.sourceTagId}:${a.derivedTagId}`;
    re.current !== H && (re.current = H, s((F) => !F || Number(F.sourceTagId) !== Number(a.sourceTagId) || Number(F.derivedTagId) !== Number(a.derivedTagId) ? F : oc(F, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    p,
    h
  ]);
  function ye(H, F = !1) {
    F || w({ type: "rule", id: H.id }), re.current = null, s({
      ruleId: H.id,
      sourceTagId: H.sourceTagId,
      sourceTagName: H.sourceTagName,
      derivedTagId: H.derivedTagId,
      derivedTagName: H.derivedTagName,
      slotMappings: H.slotMappings.map(($) => ({
        sourceSlotDefinitionId: $.sourceSlotDefinitionId,
        derivedSlotDefinitionId: $.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), g(""), ae();
  }
  function Me(H, F, $ = "") {
    re.current = null, H === "source" ? (d([]), y(F != null)) : (m([]), f(F != null)), s((W) => ({
      ...W,
      [`${H}TagId`]: F == null ? null : Number(F),
      [`${H}TagName`]: $ || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function q(H) {
    (a == null ? void 0 : a.ruleId) == null && (re.current = null);
    const F = [Ne(), t == null ? void 0 : t()];
    return H.draftKind === "source" ? (y(!0), F.push(ee(`/slot-definitions/${H.tagId}`).then(($) => d($.definitions || [])).finally(() => y(!1)))) : H.draftKind === "derived" && (f(!0), F.push(ee(`/slot-definitions/${H.tagId}`).then(($) => m($.definitions || [])).finally(() => f(!1)))), Promise.all(F);
  }
  function Q(H, F, $) {
    s((W) => ({
      ...W,
      slotMappings: W.slotMappings.map((me, he) => he === H ? { ...me, [F]: $ } : me)
    }));
  }
  async function ue() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const H = Qi(a, o);
    if (H) {
      g(H.message);
      return;
    }
    if (a.slotMappings.some((F) => !F.sourceSlotDefinitionId || !F.derivedSlotDefinitionId)) {
      g("Complete or remove every performer slot mapping before saving.");
      return;
    }
    x(!0), g(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let F = null;
      if (a.ruleId != null) {
        const W = await ee(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${W.deletedSegmentCount}
Removed lineage edges: ${W.removedEdgeCount}
Shared derived segments retained: ${W.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        F = W.fingerprint;
      }
      g("Saving derived segment rule…");
      const $ = await ee("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: F
        })
      });
      if (await Ne(), w(Y === "graph" ? { type: "node", id: Number($.sourceTagId) } : { type: "rule", id: $.id }), s(null), a.ruleId == null)
        try {
          const W = await ee(
            `/derivation-rules/${$.id}/materialization/preview`,
            { method: "POST" }
          );
          T(
            W.createCount + W.linkCount > 0 ? W : null
          ), g(W.createCount + W.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          T(null), g("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        T(null), g("Derived segment rule saved. Previous materializations were removed.");
    } catch (F) {
      g(F.message || "Unable to save derived segment rule.");
    } finally {
      x(!1);
    }
  }
  async function ve(H) {
    x(!0), g("Previewing rule deletion…");
    try {
      const F = await ee(
        `/derivation-rules/${H.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${H.sourceTagName} → ${H.derivedTagName}?

Deleted segments: ${F.deletedSegmentCount}
Removed lineage edges: ${F.removedEdgeCount}
Shared derived segments retained: ${F.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const $ = `derivation-rule-delete:${H.id}:${F.fingerprint}`;
      await ee(`/derivation-rules/${H.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ye($),
          fingerprint: F.fingerprint
        })
      }), Qe($), await Ne(), (a == null ? void 0 : a.ruleId) === H.id && s(null), (S == null ? void 0 : S.type) === "rule" && S.id === H.id && w(null), (M == null ? void 0 : M.ruleId) === H.id && T(null), g(`Rule deleted with ${F.deletedSegmentCount} exclusively derived segment${F.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (F) {
      g(F.message || "Unable to delete derived segment rule.");
    } finally {
      x(!1);
    }
  }
  async function xe(H, F = null) {
    const $ = F || await ee(
      `/derivation-rules/${H.id}/materialization/preview`,
      { method: "POST" }
    );
    if ($.createCount + $.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const W = `derivation-rule-materialize:${H.id}:${$.fingerprint}`, me = await ee(`/derivation-rules/${H.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Ye(W),
        fingerprint: $.fingerprint
      })
    });
    return Qe(W), me;
  }
  async function be(H, F = null) {
    x(!0), g("Finding pending derivations…");
    try {
      const $ = await xe(H, F);
      if (T(null), await Ne(), $.createdCount + $.linkedCount === 0) {
        g("Every applicable derivation is already materialized.");
        return;
      }
      g(
        `${$.createdCount} derived segment${$.createdCount === 1 ? "" : "s"} created and ${$.linkedCount} existing segment${$.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch ($) {
      g($.message || "Unable to materialize pending derivations.");
    } finally {
      x(!1);
    }
  }
  async function z(H, F) {
    if (F.length === 0) return;
    x(!0), g(`Finding pending derivations from ${H.name}…`);
    let $ = 0, W = 0;
    try {
      for (const me of F) {
        const he = await xe(me);
        $ += he.createdCount, W += he.linkedCount;
      }
      T(null), await Ne(), g($ + W === 0 ? `Every outgoing derivation from ${H.name} is already materialized.` : `${$} derived segment${$ === 1 ? "" : "s"} created and ${W} existing segment${W === 1 ? "" : "s"} linked from ${H.name}.`);
    } catch (me) {
      await Ne().catch(() => {
      }), g(me.message || `Unable to materialize derivations from ${H.name}.`);
    } finally {
      x(!1);
    }
  }
  const ke = Qi(a, o), se = Je(
    () => Ku(o, e),
    [o, e]
  ), N = O.trim().toLocaleLowerCase(), k = se.components.filter((H) => L === "all" || H.segmentGroupKeys.includes(L)).filter((H) => !N || H.nodes.some((F) => F.name.toLocaleLowerCase().includes(N))), v = k.flatMap((H) => H.rules), u = new Set(
    k.flatMap((H) => H.nodes.map((F) => F.tagId))
  ), R = Je(
    () => _u(k),
    [k]
  ), V = Y === "list" ? Hu(
    S,
    v,
    N.length > 0
  ) : null, ie = (S == null ? void 0 : S.type) === "node" && se.nodes.find((H) => H.tagId === S.id && u.has(H.tagId)) || null, te = [...v].sort((H, F) => C === "source" ? Rt(H.sourceTagName, F.sourceTagName) || Rt(H.derivedTagName, F.derivedTagName) : C === "target" ? Rt(H.derivedTagName, F.derivedTagName) || Rt(H.sourceTagName, F.sourceTagName) : C === "materialized" ? (Number(F.edgeCount) || 0) - (Number(H.edgeCount) || 0) || Rt(H.sourceTagName, F.sourceTagName) : Rt(
    `${H.sourceTagName} ${H.derivedTagName}`,
    `${F.sourceTagName} ${F.derivedTagName}`
  ));
  return r(qu, {
    arrowMarkerId: pe,
    busy: b,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: _,
    deleteRule: ve,
    derivedSlots: c,
    derivedSlotsLoading: h,
    draft: a,
    draftIssue: ke,
    editRule: ye,
    editorRef: U,
    emptyDraft: n,
    graph: se,
    layout: R,
    listSort: C,
    materializationOffer: M,
    materializeOutgoingRules: z,
    materializeRule: be,
    message: I,
    normalizedQuery: N,
    query: O,
    refreshConfiguredTag: q,
    revealEditor: ae,
    rules: o,
    save: ue,
    segmentGroupKey: L,
    selectedNode: ie,
    selectedRule: V,
    selection: S,
    setConfiguringTag: ne,
    setDraft: s,
    setListSort: A,
    setMaterializationOffer: T,
    setQuery: J,
    setSegmentGroupKey: E,
    setSelection: w,
    setView: P,
    sortedVisibleRules: te,
    sourceSlots: l,
    sourceSlotsLoading: p,
    updateMapping: Q,
    updateTag: Me,
    view: Y,
    visibleComponents: k,
    visibleRules: v
  });
}
function Vu() {
  const [e, t] = G(ka), n = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => Di({ ...l, [a]: s }));
  }
  function i() {
    t(Di(Mo));
  }
  return r("section", { className: "space-y-3 rounded-lg border border-border bg-surface p-4", "aria-labelledby": "segment-studio-playback-shortcuts-title" }, [
    r("div", { key: "heading", className: "flex flex-wrap items-start justify-between gap-3" }, [
      r("div", { key: "copy" }, [
        r("h2", { key: "title", id: "segment-studio-playback-shortcuts-title", className: "font-semibold text-foreground" }, "Playback shortcuts"),
        r("p", { key: "description", className: "mt-1 text-xs text-secondary" }, "Configure seek intervals and frame-step sizes used by the keyboard-first editor. These settings are stored in this browser.")
      ]),
      r("button", { key: "reset", type: "button", onClick: i, className: "rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted/40" }, "Reset defaults")
    ]),
    r("div", { key: "fields", className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, n.map(([a, s, l, d, c]) => r("label", { key: a, className: "space-y-1 text-xs text-secondary" }, [
      r("span", { key: "label" }, s),
      r("input", {
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
function Ju({ active: e, segmentGroups: t, onSegmentGroupsChanged: n }) {
  const [o, i] = G([]), [a, s] = G(!1), [l, d] = G(!1), [c, m] = G(""), [p, y] = G(""), [h, f] = G("all"), [b, x] = G(() => /* @__PURE__ */ new Set()), [I, g] = G(null);
  fe(() => {
    if (!e || a) return;
    const T = new AbortController();
    return d(!0), m(""), ee("/slot-definitions", { signal: T.signal }).then((_) => {
      i(_ || []), s(!0);
    }).catch((_) => {
      _.name !== "AbortError" && m(_.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      T.signal.aborted || d(!1);
    }), () => T.abort();
  }, [e, a]);
  async function O() {
    d(!0), m("");
    try {
      const T = await ee("/slot-definitions");
      i(T || []), s(!0);
    } catch (T) {
      m(T.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function J() {
    const [T] = await Promise.all([
      ee("/slot-definitions"),
      n == null ? void 0 : n()
    ]);
    i(T || []), s(!0), m("");
  }
  function Y() {
    const T = I == null ? void 0 : I.trigger;
    g(null), requestAnimationFrame(() => {
      T != null && T.isConnected && T.focus({ preventScroll: !0 });
    });
  }
  function P(T) {
    x((_) => {
      const ne = new Set(_);
      return ne.has(T) ? ne.delete(T) : ne.add(T), ne;
    });
  }
  const L = Je(
    () => Bu(t, o),
    [t, o]
  ), E = Je(
    () => Uu(L, p, h),
    [L, p, h]
  ), S = L.flatMap((T) => T.tags), w = S.filter((T) => T.definitions.length > 0).length, C = S.length - w, A = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], M = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
  return r("section", {
    className: "space-y-4",
    "aria-label": "Performer slot overview"
  }, [
    r("div", { key: "heading", className: "rounded-lg border border-border bg-surface p-4" }, [
      r("h2", { key: "title", className: "text-lg font-semibold text-foreground" }, "Performer slots"),
      r(
        "p",
        { key: "description", className: "mt-1 max-w-3xl text-sm text-secondary" },
        "Review performer roles for every Segment tag without opening tags one at a time."
      ),
      a ? r(
        "p",
        { key: "summary", className: "mt-2 text-xs text-secondary" },
        `${S.length} tags · ${w} with slots · ${C} without slots`
      ) : null
    ]),
    r("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      r("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        r("span", { key: "label" }, "Search"),
        r("input", {
          key: "input",
          type: "search",
          value: p,
          onChange: (T) => y(T.target.value),
          "aria-label": "Search tags and performer slots",
          placeholder: "Search tags or slot labels…",
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
        })
      ]),
      r("div", { key: "coverage", className: "space-y-1" }, [
        r("span", { key: "label", className: "block text-xs text-secondary" }, "Coverage"),
        r(
          "div",
          { key: "choices", role: "group", "aria-label": "Performer slot coverage", className: "inline-flex rounded-md border border-border bg-card p-0.5" },
          A.map(([T, _]) => r("button", {
            key: T,
            type: "button",
            onClick: () => f(T),
            "aria-pressed": h === T,
            className: `rounded px-3 py-1.5 text-xs font-medium ${h === T ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, _))
        )
      ]),
      r("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        r("button", {
          key: "expand",
          type: "button",
          onClick: () => x(/* @__PURE__ */ new Set()),
          className: M
        }, "Expand all"),
        r("button", {
          key: "collapse",
          type: "button",
          onClick: () => x(new Set(L.map((T) => T.overviewKey))),
          className: M
        }, "Collapse all")
      ])
    ]),
    l && !a ? r(
      "p",
      { key: "loading", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "Loading performer slots…"
    ) : null,
    c ? r("div", { key: "error", role: "alert", className: "flex flex-wrap items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive" }, [
      r("span", { key: "message", className: "min-w-0 flex-1" }, c),
      r("button", {
        key: "retry",
        type: "button",
        disabled: l,
        onClick: O,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && E.length === 0 ? r(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? r("div", { key: "groups", className: "space-y-3" }, E.map((T) => {
      const _ = b.has(T.overviewKey), ne = T.tags.filter((U) => U.definitions.length > 0).length;
      return r("article", {
        key: T.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        r("button", {
          key: "header",
          type: "button",
          onClick: () => P(T.overviewKey),
          "aria-expanded": !_,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          r("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, _ ? "▸" : "▾"),
          r("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, T.name),
          r(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${T.tags.length} tag${T.tags.length === 1 ? "" : "s"} · ${ne} with slots`
          )
        ]),
        _ ? null : r(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          T.tags.map((U) => r("li", {
            key: U.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            r("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              r("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: U.tagName }, U.tagName),
              U.allowSamePerformerInMultipleSlots ? r(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            U.definitions.length === 0 ? r("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : r("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${U.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, U.definitions.map((re) => r("li", {
              key: re.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              r("span", { key: "label", className: "font-medium text-foreground" }, Ot(re)),
              ...(re.genderHints || []).map((pe) => r("span", {
                key: pe,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, Jr(pe)))
            ]))),
            r("button", {
              key: "edit",
              type: "button",
              onClick: (re) => g({
                tagId: U.tagId,
                tagName: U.tagName,
                trigger: re.currentTarget
              }),
              "aria-label": `Edit performer slots for ${U.tagName}`,
              className: `${M} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    I ? r(qo, {
      key: `performer-slots-configure:${I.tagId}`,
      tagId: I.tagId,
      tagName: I.tagName,
      onSaved: J,
      onClose: Y
    }) : null
  ]);
}
function Yu({ onNavigate: e, profile: t, onProfileChange: n }) {
  const [o, i] = G("general"), [a, s] = G([]), [l, d] = G(!1), [c, m] = G(""), [p, y] = G(pa), h = ld(t), f = h.map(([g]) => g);
  fe(() => {
    f.includes(o) || i(f[0] || "general");
  }, [t.effectiveMode]);
  async function b(g) {
    const O = await ee("/segment-groups", g ? { signal: g } : void 0);
    s(O || []);
  }
  fe(() => {
    const g = new AbortController();
    return b(g.signal).catch((O) => {
      O.name !== "AbortError" && m(O.message || "Unable to load tag groups.");
    }), () => g.abort();
  }, []);
  async function x(g) {
    if (g !== t.requestedMode) {
      d(!0), m("");
      try {
        const O = await ee(
          `/preferences/transition?mode=${encodeURIComponent(g)}`
        );
        let J = !1, Y = null, P = null, L = null, E = !1;
        if (t.requestedMode === "basic" && g === "full") {
          if (!window.confirm(ud(
            O.recyclingBinCount,
            O.protectedRecyclingBinCount
          )))
            return;
          E = !0, O.recyclingBinCount > 0 && (J = !0, L = O.recyclingBinFingerprint, Y = `mode-switch-empty-bin:${L}`, P = Ye(Y));
        }
        let S = !1;
        if (t.requestedMode === "full" && g === "basic") {
          if (!window.confirm(cd(
            O.extensionOwnedSegmentCount
          )))
            return;
          S = !0;
        }
        const w = await ee("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: g,
            confirmHiddenExtensionOwnedSegments: S,
            confirmBasicHistoryCleanup: E,
            emptyRecyclingBin: J,
            operationId: P,
            expectedRecyclingBinFingerprint: L
          })
        });
        Y && Qe(Y), n == null || n(wa(w)), m("Workflow mode saved.");
      } catch (O) {
        m(O.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  const I = { page: "segment-studio" };
  return r("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    r("a", { key: "back", href: "/segment-studio", onClick: (g) => os(g, e, I), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
    r("header", { key: "header", className: "space-y-2" }, [
      r("h1", { key: "title", className: "text-2xl font-semibold text-foreground" }, "Segment Studio settings"),
      r(
        "p",
        { key: "description", className: "max-w-3xl text-sm text-secondary" },
        t.effectiveMode === "full" ? "Configure the Segment Studio workflow, shortcuts, performer roles, and derivation behavior." : "Configure the Segment Studio workflow and shortcuts."
      )
    ]),
    r(
      "nav",
      { key: "settings-tabs", "aria-label": "Settings sections", className: "flex gap-1 overflow-x-auto border-b border-border" },
      h.map(([g, O]) => r("button", {
        key: g,
        type: "button",
        onClick: () => i(g),
        "aria-current": o === g ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === g ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, O))
    ),
    r(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      r(Vu)
    ),
    r("section", { key: "shortcut-bindings-panel", hidden: o !== "shortcuts", className: "space-y-2 rounded-lg border border-border bg-surface p-4" }, [
      r("h2", { key: "title", className: "font-semibold text-foreground" }, "Keyboard bindings"),
      r(
        "p",
        { key: "description", className: "text-sm text-secondary" },
        "Segment Studio bindings now use Cove's keyboard shortcut settings and conflict handling."
      ),
      r(
        "a",
        { key: "link", href: "/settings/my/keyboard-shortcuts", className: "inline-flex text-sm font-medium text-accent hover:underline" },
        "Configure Segment Studio shortcuts in Cove settings →"
      )
    ]),
    r("section", { key: "mode", hidden: o !== "general", className: "space-y-3 rounded-lg border border-border bg-surface p-4" }, [
      r("h2", { key: "title", className: "text-lg font-semibold text-foreground" }, "Workflow mode"),
      r(du, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: x,
        disabled: l || t.legacyCompatibilityRequired
      }),
      r("div", { key: "mode-guide", className: "grid gap-3 md:grid-cols-2" }, [
        r("article", { key: "basic", className: "rounded-md border border-border bg-card p-3" }, [
          r("h3", { key: "title", className: "text-sm font-semibold text-foreground" }, "Basic"),
          r(
            "p",
            { key: "description", className: "mt-1 text-xs leading-5 text-secondary" },
            "Create and edit ordinary Cove segments directly. No Segment Studio registration or review decision is required. Undo and the recycling bin provide reversible cleanup. Eligible AI examples can be collected into a protected bin entry."
          )
        ]),
        r("article", { key: "full", className: "rounded-md border border-border bg-card p-3" }, [
          r("h3", { key: "title", className: "text-sm font-semibold text-foreground" }, "Full"),
          r(
            "p",
            { key: "description", className: "mt-1 text-xs leading-5 text-secondary" },
            "Adds Segment Studio-owned drafts, review, performer slots, derivation, and shot boundaries while keeping ordinary Cove segments and shared AI feedback available."
          )
        ])
      ]),
      r(
        "p",
        { key: "boundary", className: "text-xs leading-5 text-secondary" },
        "AI feedback is available in both modes for segments with registered AI provenance. Collection preserves provenance, and downloads contain an AI Feedback ZIP for manual submission. Live segments are preserved when modes change. Collected examples also remain protected and manageable; only unprotected Basic bin entries are removed when confirmed. Switching to Full clears Basic undo history. Switching to Basic hides extension-owned segments and expanded metadata. Materialized derivations remain Segment Studio-owned and appear only in Full."
      )
    ]),
    r("section", { key: "confirmations", hidden: o !== "general", className: "space-y-3 rounded-lg border border-border bg-surface p-4" }, [
      r("h2", { key: "title", className: "text-lg font-semibold text-foreground" }, "Confirmations"),
      r("label", { key: "merge", className: "flex items-start gap-3" }, [
        r("input", {
          key: "input",
          type: "checkbox",
          checked: p,
          onChange: (g) => {
            const O = g.target.checked;
            ya(O), y(O);
          },
          className: "mt-0.5 h-4 w-4 accent-[var(--color-accent)]"
        }),
        r("span", { key: "copy", className: "space-y-0.5" }, [
          r("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Confirm segment merges"),
          r(
            "span",
            { key: "description", className: "block text-xs text-secondary" },
            "Show the merge summary before permanently replacing selected segments."
          )
        ])
      ])
    ]),
    f.includes("derivation") ? r(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      r(Wu, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => b()
      })
    ) : null,
    f.includes("performer-slots") ? r(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      r(Ju, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => b()
      })
    ) : null,
    c ? r("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function Qu({ item: e, selected: t, busy: n, onSelect: o, onRestore: i, onPurge: a }) {
  var m, p;
  const s = [...e.slots || []].sort((y, h) => y.sortOrder - h.sortOrder || String(y.slotDefinitionId).localeCompare(String(h.slotDefinitionId))), l = [...new Map(s.map((y) => [
    y.performerId,
    { id: y.performerId, name: y.performerName }
  ])).values()], d = s.map((y) => ({
    slotDefinitionId: y.slotDefinitionId,
    label: Ot(y),
    performer: { id: y.performerId, name: y.performerName }
  })), c = Ra(e);
  return r("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: Ua(t)
  }, [
    r("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((m = e.activity) == null ? void 0 : m.name) || "segment"}, ${e.reviewState}, ${Fe(e.startSec)} to ${e.endSec == null ? "end of video" : Fe(e.endSec)}` }, [
      r("div", { key: "image", className: "relative aspect-video bg-black" }, [
        r("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        r("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${Fe(e.startSec)} → end` : `${Fe(e.startSec)} – ${Fe(e.endSec)}`)
      ]),
      r("div", { key: "body", className: "flex flex-col gap-1.5 p-2.5" }, [
        r("div", { key: "segment", className: "flex min-w-0 items-center gap-1.5" }, [
          r(Sn, { key: "state", state: e.reviewState, includeLabel: !1 }),
          r("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((p = e.activity) == null ? void 0 : p.name) || "Tag segment"),
          l.length ? r(Yr, {
            key: "performers",
            performers: l,
            performerAssignments: d,
            interactive: !1
          }) : null
        ]),
        r("div", { key: "video", className: "line-clamp-1 text-xs text-secondary", title: e.videoTitle }, e.videoTitle)
      ])
    ]),
    r(
      "div",
      { key: "footer", className: "flex items-center justify-end gap-2 border-t border-border px-2.5 py-1.5 text-right" },
      e.reviewState === "rejected" && !e.published ? [
        r("button", { key: "restore", type: "button", disabled: n, onClick: () => i(e), className: "text-xs font-semibold text-accent hover:underline disabled:opacity-50" }, "Restore"),
        r("button", { key: "purge", type: "button", disabled: n, onClick: () => a(e), className: "text-xs font-semibold text-red-400 hover:underline disabled:opacity-50" }, "Delete permanently")
      ] : r("a", {
        href: c,
        className: "text-xs font-semibold text-accent hover:underline"
      }, "Edit segment")
    )
  ]);
}
function Xu({ item: e, index: t, count: n, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return r("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? r("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, r(ta, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: xd(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : r("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    r("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      r("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      r("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${n}`),
      r("button", { key: "next", type: "button", disabled: t < 0 || t >= n - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      r("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      r("a", { key: "edit", href: Ra(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Xi({ onNavigate: e, profile: t }) {
  const n = Je(() => {
    const q = ra("ext:com.midnightrider.segment-studio:segments");
    return q ? {
      ...mo,
      defaultFilter: { ...mo.defaultFilter, ...q.findFilter || {} },
      defaultObjectFilter: q.objectFilter || {}
    } : mo;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = oa(n), [l, d] = G(null), [c, m] = G(""), [p, y] = G(0), [h, f] = G({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [b, x] = G(null), [I, g] = G(null), [O, J] = G(0), [Y, P] = G(""), [L, E] = G(!0), [S, w] = G(""), C = ce(0), A = pd(i, l), M = A.slots !== void 0, T = vd(o, A), _ = h.performerSlotsAvailable !== !1, ne = Je(
    () => _ ? [...Oi, md(l, i, Dd)] : Oi,
    [l, i, _]
  ), U = JSON.stringify(T);
  fe(() => {
    const q = new AbortController();
    return m(""), ee("/browse/roles", { signal: q.signal }).then(d).catch((Q) => {
      Q.name !== "AbortError" && (Q.status === 403 ? (d([]), f((ue) => ({ ...ue, performerSlotsAvailable: !1 }))) : m(Q.message || "Unable to load performer slot roles."));
    }), () => q.abort();
  }, [p]), fe(() => {
    A !== i && !M && s(A);
  }, [A, i, M]), fe(() => {
    if (M) return;
    const q = ++C.current, Q = new AbortController();
    return E(!0), w(""), ee("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(T), signal: Q.signal }).then((ue) => {
      q === C.current && f({ ...ue, totalCount: ue.totalCount ?? ue.total ?? 0 });
    }).catch((ue) => {
      if (!(q !== C.current || ue.name === "AbortError")) {
        if (ue.status === 400 && ue.message.includes("unrestricted performer read access")) {
          f((ve) => ({ ...ve, performerSlotsAvailable: !1 })), s(Sd(A)), P("Performer slot filters were cleared because performer details are unavailable.");
          return;
        }
        w(ue.message);
      }
    }).finally(() => {
      q === C.current && E(!1);
    }), () => {
      C.current++, Q.abort();
    };
  }, [U, O, M]);
  const re = h.items.findIndex((q) => q.key === b), pe = h.items[re] || null;
  function ae(q) {
    s(q), a({ ...o, page: 1 });
  }
  function Ne() {
    const q = document.querySelector(`[data-segment-key="${b}"]`);
    x(null), requestAnimationFrame(() => q == null ? void 0 : q.focus());
  }
  async function ye(q) {
    var ve;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    g(q.key), P("");
    const Q = `browse-restore:${q.itemId}:${q.revision}`, ue = Ye(Q);
    try {
      const xe = (be = !1) => ee(`/bin/${q.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ue,
          expectedRevision: q.revision,
          discardMissingImage: be
        })
      });
      try {
        await xe(Lo(Q));
      } catch (be) {
        if (((ve = be.payload) == null ? void 0 : ve.code) !== "missing-image" || !window.confirm(`${be.message}

Continue and discard the missing image reference?`))
          throw be;
        jo(Q), await xe(!0);
      }
      Qe(Q), b === q.key && x(null), P("Segment restored to Cove."), J((be) => be + 1);
    } catch (xe) {
      P(xe.message || "Unable to restore the segment."), xe.status === 409 && J((be) => be + 1);
    } finally {
      g(null);
    }
  }
  async function Me(q) {
    g(q.key), P("");
    try {
      const Q = await ee(`/items/${q.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: q.revision })
      });
      if (!ja(Q, P) || !Bd(Q))
        return;
      const ue = `browse-dependency-delete:${q.itemId}:${Q.fingerprint}`;
      await ee(`/items/${q.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ye(ue),
          fingerprint: Q.fingerprint
        })
      }), Qe(ue), b === q.key && x(null), P(`${Q.deletedSegmentCount} segment${Q.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), J((ve) => ve + 1);
    } catch (Q) {
      P(Q.message || "Unable to permanently delete the segment."), Q.status === 409 && J((ue) => ue + 1);
    } finally {
      g(null);
    }
  }
  return r("div", { className: "w-full space-y-5" }, [
    r(Ho, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    r(ia, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: a,
      totalCount: h.totalCount,
      isLoading: L,
      error: S ? new Error(S) : null,
      onRetry: () => J((q) => q + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: ne,
      objectFilter: A,
      supportsFilterExpressions: !0,
      onObjectFilterChange: ae,
      searchPlaceholder: "Search segments..."
    }, [
      r(Xu, { key: "player", item: pe, index: re, count: h.items.length, onPrevious: () => {
        var q;
        return x((q = h.items[re - 1]) == null ? void 0 : q.key);
      }, onNext: () => {
        var q;
        return x((q = h.items[re + 1]) == null ? void 0 : q.key);
      }, onClose: Ne, onNavigate: e }),
      c ? r("div", { key: "roles-error", role: "alert", className: "flex flex-wrap items-center gap-3 rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, [
        r("span", { key: "text" }, `Performer slot roles could not be loaded: ${c}`),
        r("button", { key: "retry", type: "button", onClick: () => y((q) => q + 1), className: "font-semibold text-accent hover:underline" }, "Retry")
      ]) : null,
      Y ? r("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, Y) : null,
      !L && h.items.length === 0 ? r("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      L ? null : r("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, h.items.map((q) => r(Qu, {
        key: q.key,
        item: q,
        selected: q.key === b,
        busy: I === q.key,
        onSelect: () => x(q.key),
        onRestore: ye,
        onPurge: Me
      })))
    ])
  ]);
}
function Zu({ onNavigate: e, profile: t }) {
  const [n, o] = G([]), [i, a] = G(""), [s, l] = G(0), [d, c] = G(!0), [m, p] = G(null), [y, h] = G(""), f = ce(null);
  async function b(g) {
    const O = await ee("/bin", g ? { signal: g } : void 0);
    return o(O.items || []), a(O.fingerprint || ""), l(Number(O.totalCount) || 0), O;
  }
  fe(() => {
    const g = new AbortController();
    return c(!0), b(g.signal).catch((O) => {
      O.name !== "AbortError" && h(O.message);
    }).finally(() => {
      g.signal.aborted || c(!1);
    }), () => g.abort();
  }, []), na(Ao, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var g;
      return (g = f.current) == null ? void 0 : g.call(f);
    }
  }]);
  async function x(g) {
    var Y;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    p(g.itemId), h("");
    const O = `restore:${g.itemId}:${g.revision}`, J = Ye(O);
    try {
      const P = (L = !1) => ee(`/bin/${g.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: J, expectedRevision: g.revision, discardMissingImage: L })
      });
      try {
        await P(Lo(O));
      } catch (L) {
        if (((Y = L.payload) == null ? void 0 : Y.code) !== "missing-image" || !window.confirm(`${L.message}

Continue and discard the missing image reference?`)) throw L;
        jo(O), await P(!0);
      }
      Qe(O), await b(), lr(), h("Segment restored with a new native ID.");
    } catch (P) {
      h(P.message || "Unable to restore the segment."), P.status === 409 && await b();
    } finally {
      p(null);
    }
  }
  async function I() {
    if (m == null)
      try {
        const g = await Ga({
          items: n,
          fingerprint: i,
          totalCount: s
        }, () => {
          p(-1), h("");
        });
        if (g.status !== "emptied") return;
        await b(), lr(), h(`${g.segmentCount} segment${g.segmentCount === 1 ? "" : "s"} from ${g.sceneCount} scene${g.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (g) {
        h(g.message || "Unable to empty the recycling bin."), g.status === 409 && await b();
      } finally {
        p(null);
      }
  }
  return f.current = I, r("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    r(Ho, {
      key: "tabs",
      active: "bin",
      onNavigate: e,
      showBin: !0,
      profile: t
    }),
    r("header", { key: "header", className: "flex flex-wrap items-start justify-between gap-3" }, [
      r("div", { key: "copy", className: "space-y-2" }, [
        r("h1", { key: "title", className: "text-2xl font-semibold" }, "Recycling bin"),
        r("p", { key: "description", className: "max-w-3xl text-sm text-secondary" }, "Segments moved here from Basic mode can be restored individually. Restoring recreates the native content with a new native ID; external relationships to the old ID are not restored.")
      ]),
      r("button", {
        key: "empty",
        type: "button",
        disabled: d || m != null || s === 0,
        onClick: I,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, m === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    y ? r("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, y) : null,
    d ? r("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && n.length === 0 ? r("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...n.map((g) => r("article", { key: g.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      r("div", { key: "copy", className: "min-w-0 flex-1" }, [
        r("h2", { key: "title", className: "truncate font-semibold" }, `${g.tagName || "Tag segment"} · ${g.videoTitle || `Video ${g.videoId}`}`),
        r("p", { key: "time", className: "font-mono text-xs text-secondary" }, g.endSec == null ? Fe(g.startSec) : `${Fe(g.startSec)} – ${Fe(g.endSec)}`),
        r("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${g.sourceKey || "unknown"}`)
      ]),
      r("a", { key: "video", href: `/video/${g.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      r("button", { key: "restore", type: "button", disabled: m != null, onClick: () => x(g), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const Zi = "ext:com.midnightrider.segment-studio:videos";
async function em(e, t, n, o) {
  const i = await jd("/api/videos/find", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nu(e, t, { fullMode: n })),
    signal: o
  }), a = Array.isArray(i == null ? void 0 : i.items) ? i.items : [], s = a.length > 0 ? await ee("/videos/segment-counts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoIds: a.map((d) => d.id) }),
    signal: o
  }) : { items: [] }, l = new Map(((s == null ? void 0 : s.items) ?? []).map((d) => [d.videoId, d]));
  return { items: a.map((d) => ou(d, l.get(d.id))), totalCount: (i == null ? void 0 : i.totalCount) ?? 0 };
}
function po({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: n = "editor",
  profile: o
}) {
  const i = t || n === "review", a = Je(() => {
    var pe;
    const U = ra(Zi), re = (pe = U == null ? void 0 : U.uiOptions) == null ? void 0 : pe.displayMode;
    return U ? {
      ...Wt,
      defaultFilter: $o({ ...Wt.defaultFilter, ...U.findFilter || {} }),
      defaultObjectFilter: Co(U.objectFilter || {}, { fullMode: i }),
      defaultDisplayMode: Wt.allowedDisplayModes.includes(re) ? re : Wt.defaultDisplayMode
    } : Wt;
  }, []), { filter: s, objectFilter: l, displayMode: d, setFilter: c, setObjectFilter: m, setDisplayMode: p } = oa(a), [y, h] = G({ items: [], totalCount: 0 }), [f, b] = G(!0), [x, I] = G(""), [g, O] = G(0), [J, Y] = G(/* @__PURE__ */ new Set()), P = ce(0), L = ce(null), E = JSON.stringify(s), S = JSON.stringify(l);
  fe(() => {
    const U = Co(l, { fullMode: i });
    U !== l && m(U);
    const re = $o(s);
    re !== s && c(re);
  }, [E, S, i]), fe(() => {
    L.current = null, Y(/* @__PURE__ */ new Set());
  }, [E, S]), fe(() => {
    const U = ++P.current, re = new AbortController();
    return b(!0), I(""), em(s, l, i, re.signal).then((pe) => {
      U === P.current && h(pe);
    }).catch((pe) => {
      U === P.current && pe.name !== "AbortError" && I(pe.message || "Unable to discover videos.");
    }).finally(() => {
      U === P.current && b(!1);
    }), () => {
      P.current++, re.abort();
    };
  }, [E, S, i, g]);
  function w(U) {
    c({ ...U, page: U.page || 1 });
  }
  function C(U) {
    m(U), c({ ...s, page: 1 });
  }
  function A(U, re = !1) {
    Y((pe) => iu(
      pe,
      y.items.map((ae) => ae.videoId),
      U,
      L.current,
      re
    )), L.current = U;
  }
  function M() {
    L.current = null, Y(new Set(y.items.map((U) => U.videoId)));
  }
  function T() {
    L.current = null, Y(/* @__PURE__ */ new Set());
  }
  function _() {
    L.current = null, Y((U) => new Set(y.items.map((re) => re.videoId).filter((re) => !U.has(re))));
  }
  const ne = Je(() => ru(il), []);
  return r("div", { className: "w-full space-y-5" }, [
    r(Ho, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && n === "editor",
      profile: o
    }),
    r(ia, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      filterMode: "videos",
      savedFilterScope: Zi,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: s,
      onFilterChange: w,
      totalCount: y.totalCount,
      isLoading: f,
      error: x ? new Error(x) : null,
      onRetry: () => O((U) => U + 1),
      sortOptions: al,
      displayMode: d,
      onDisplayModeChange: p,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: ne,
      objectFilter: l,
      supportsFilterExpressions: !0,
      onObjectFilterChange: C,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: pn ? J : void 0,
      onSelectAll: pn ? M : void 0,
      onSelectNone: pn ? T : void 0,
      onInvertSelection: pn ? _ : void 0,
      // The host renders whatever extensions contribute for a video selection, so
      // Run AI here is the same action, and the same dialog, as the native videos
      // page, in Basic and Full mode alike. Selection serves only this bar, so it
      // is offered only on hosts that render it. Only the contributed actions are
      // rendered: Segment Studio's own ownership and lineage rules govern
      // deletion, so the native bulk mutations that would bypass them stay out of
      // this bar.
      selectionActions: pn && J.size > 0 ? r(Oa, { entityType: "video", selectedIds: J }) : null
    }, [
      !f && y.items.length === 0 ? r("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !f && d === "grid" ? r("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, y.items.map((U) => r(au, { key: U.videoId, item: U, onNavigate: e, showReviewStates: i, selected: J.has(U.videoId), selectionActive: J.size > 0, onSelect: pn ? A : null }))) : null,
      !f && d === "list" ? r("section", { key: "rows", className: "space-y-3" }, y.items.map((U) => r(su, { key: U.videoId, item: U, onNavigate: e, showReviewStates: i, selected: J.has(U.videoId), selectionActive: J.size > 0, onSelect: pn ? A : null }))) : null
    ])
  ]);
}
function ea({
  videoId: e,
  onNavigate: t,
  compatibilityMode: n = !1,
  profile: o
}) {
  const [i, a] = G(null), [s, l] = G(!0), [d, c] = G(""), m = ce(0), p = ce(0), y = ce(e), h = ce(0), f = ce([]), b = Gc();
  y.current = e;
  const [x] = G(() => Cl({
    beginRequest: () => ({ requestId: ++p.current, videoId: y.current, updateSequence: h.current }),
    fetchDetail: (E) => ee(I(E.videoId)),
    isCurrent: (E) => Mr(E.requestId, p.current, E.videoId, y.current),
    isSameVideo: (E) => E.videoId === y.current
  })), I = (E) => `/videos/${E}/editor`;
  async function g(E, S, w) {
    const C = await ee(I(S), w ? { signal: w.signal } : void 0);
    return Mr(E, w ? m.current : p.current, S, y.current) ? (a(C), !0) : !1;
  }
  fe(() => {
    const E = ++m.current, S = e, w = new AbortController();
    return a(null), l(!0), c(""), g(E, S, w).catch((C) => {
      Mr(E, m.current, S, y.current) && C.name !== "AbortError" && c(C.message || "Unable to load the editor.");
    }).finally(() => {
      Mr(E, m.current, S, y.current) && l(!1);
    }), () => {
      m.current++, p.current++, w.abort();
    };
  }, [e]);
  function O(E, S) {
    if (typeof E == "function") {
      const w = ++h.current;
      f.current = [...f.current.slice(-199), { sequence: w, videoId: S, update: E }];
    } else
      h.current += 1, f.current = [];
    a((w) => (w == null ? void 0 : w.video.id) !== S ? w : typeof E == "function" ? E(w) : E);
  }
  function J(E, S) {
    return f.current.filter((w) => w.sequence > S.updateSequence && w.videoId === S.videoId).reduce((w, C) => C.update(w), E);
  }
  function Y() {
    return x({
      prepare: J,
      onLoaded: (E) => {
        a(E), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: (E) => c(E.message || "Unable to reload the latest segment.")
    });
  }
  function P() {
    return x({
      prepare: J,
      onLoaded: (E) => {
        a(E), c("");
      },
      onError: (E) => c(E.message || "Unable to reload performer slots.")
    });
  }
  function L() {
    return x({
      prepare: J,
      onLoaded: (E) => {
        a(E), c("");
      },
      onError: (E) => c(E.message || "Unable to load the new AI review results.")
    });
  }
  return r("div", {
    className: `mx-auto flex w-full flex-col gap-2 ${b ? "lg:overflow-hidden" : "p-3 sm:p-4"}`,
    style: b ? {
      height: "calc(100dvh - 3.25rem)",
      margin: "-1rem -1.5rem -1.25rem",
      width: "calc(100% + 3rem)"
    } : void 0
  }, [
    d ? r("div", { key: "error", className: "rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, d) : null,
    s ? r("div", {
      key: "loading",
      role: "status",
      className: "flex min-h-[50vh] w-full items-center justify-center"
    }, [
      r(dl, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      r("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? r(Gu, {
      key: i.video.id,
      detail: i,
      onDetailChange: O,
      onConflict: Y,
      onReload: P,
      onAnalysisCompleted: L,
      onSlotsChanged: P,
      splitLayout: b,
      profile: o,
      initialSegmentId: Pi() ? -Pi() : kd(),
      compatibilityMode: n,
      onNavigate: t
    }) : null
  ]);
}
function tm(e, t, n) {
  return t === "settings" || e === "settings" || t == null && e == null && n.replace(/\/+$/, "") === "/segment-studio/settings";
}
function nm(e, t, n) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(n.replace(/\/+$/, ""));
}
function rm(e, t, n) {
  return t === "bin" || e === "bin" || t == null && e == null && n.replace(/\/+$/, "") === "/segment-studio/bin";
}
function om({
  id: e,
  slug: t,
  onNavigate: n,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = ad(o), l = tm(e, t, window.location.pathname), d = nm(e, t, window.location.pathname), c = rm(e, t, window.location.pathname), m = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (dd(m, o) === "videos" && m !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), r(po, {
      onNavigate: n,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return r(Yu, {
    onNavigate: n,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return r(Xi, { onNavigate: n, profile: o });
    const h = Number(e);
    return Number.isInteger(h) && h > 0 ? r(ea, {
      videoId: h,
      onNavigate: n,
      compatibilityMode: !0,
      profile: o
    }) : r(po, {
      onNavigate: n,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return r(Zu, { onNavigate: n, profile: o });
  const y = Number(e);
  return d ? r(Xi, { onNavigate: n, profile: o }) : Number.isInteger(y) && y > 0 ? r(ea, {
    videoId: y,
    onNavigate: n,
    compatibilityMode: s === "review",
    profile: o
  }) : r(po, {
    onNavigate: n,
    mode: s,
    profile: o
  });
}
function im({ id: e, slug: t, onNavigate: n }) {
  const [o, i] = G(null), [a, s] = G("");
  return fe(() => {
    const l = new AbortController();
    return ee("/preferences", { signal: l.signal }).then((d) => i(wa(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? r("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? r("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : r(om, {
    id: e,
    slug: t,
    onNavigate: n,
    profile: o,
    onProfileChange: i
  });
}
function am(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const n = Number(t[0]);
  return Number.isInteger(n) && n > 0 ? `/segment-studio/${n}` : null;
}
function sm(e, t) {
  const n = am(t);
  return n ? (window.location.assign(n), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const Dm = {
  components: { SegmentStudioPage: im },
  actionHandlers: { openSegmentStudio: sm }
};
export {
  Du as ANALYSIS_RUN_CHECK_INTERVAL_MS,
  Pn as CLEARED_SEGMENT_SELECTION_ID,
  Xt as SEGMENT_STUDIO_CAPABILITIES,
  Ao as SEGMENT_STUDIO_EXTENSION_ID,
  fr as SEGMENT_STUDIO_SHORTCUTS,
  El as activeEditorFilterCount,
  Wd as activeSwimlaneLabelStyle,
  Mc as addPendingChange,
  oc as applyDerivationRuleSlotSuggestions,
  an as applyFeedbackEditorDelta,
  _o as applyPendingChanges,
  Ki as applySegmentMergeDelta,
  Tc as areSegmentsBusy,
  zd as basicSegmentTimelineStyle,
  xd as browseClipEnd,
  Ra as browseEditorHref,
  vd as buildBrowseRequest,
  Ku as buildDerivationRuleGraph,
  nu as buildDiscoveryFindRequest,
  pl as buildMinuteTimelineTicks,
  Bu as buildPerformerSlotOverview,
  $d as buildSegmentQuickSearchEntries,
  dc as buildSegmentRailRows,
  cc as buildTimelineRows,
  gm as buildTimelineTicks,
  vl as calculateCenteredTimelineScroll,
  bo as calculateEditorPanelMaximum,
  yl as calculateMinuteLabelStride,
  fm as calculateMinuteTimelineWidth,
  kl as calculateSwimlaneTitleMaximum,
  Sl as calculateTimelinePlayheadPosition,
  Do as calculateTimelineRatioBounds,
  Nl as calculateTimelineRatioFromPointer,
  pm as calculateVerticalRevealOffset,
  yn as clampEditorPanelWidth,
  jr as clampSwimlaneTitleWidth,
  fa as clampTimelineRatio,
  Oo as clampTimelineRatioForHeight,
  zr as clampTimelineZoom,
  Jc as compactProvenanceSummary,
  Pc as confirmPendingChange,
  Cl as createEditorReloader,
  Jl as createQueuedReviewRequest,
  Rc as createSaveQueue,
  Pu as createSegmentAnalysisRequestScope,
  Dm as default,
  es as discardPendingChange,
  ru as discoveryCriteria,
  Gd as downloadFileNameFromContentDisposition,
  Al as dualRangeValueFromPointer,
  Ai as duplicateIdentityFromResponse,
  Xl as duplicateOperationKey,
  ba as editorVisibilityIncludingSegment,
  gc as expandedSwimlanes,
  cd as extensionOwnedSegmentsModeSwitchPrompt,
  hc as feedbackFrameTimestamps,
  Sc as feedbackResultMatchesAction,
  vc as feedbackSelectionPlan,
  Rl as filterDerivedSegments,
  lo as filterEditorSegments,
  Uu as filterPerformerSlotOverview,
  Cd as filterSegmentQuickSearch,
  Sm as filterSegmentStudioShortcuts,
  yc as findAdjacentSegmentGroupKey,
  od as findAdjacentShot,
  Wl as findEditorShortcut,
  ga as findInitialSegmentSelection,
  fl as findNearestSegmentInCurrentSwimlane,
  Gr as findNextUnprocessed,
  rd as findPublishedSelectionIdentity,
  mt as findSegmentByStableIdentity,
  Il as findSegmentFromPlayhead,
  gl as findSegmentNearPlayhead,
  pc as findSwimlaneRangeSelection,
  No as findSwimlaneSelection,
  Nd as findUniquePerformerSlotAssignment,
  Kr as findUnreviewedSelection,
  Zd as focusDialogDefaultButton,
  Jr as formatGenderHint,
  id as frameStepSeconds,
  Ea as generatePerformerSlotAssignmentRecommendations,
  bu as groupApprovedDraftsForPublishing,
  Id as groupAutoAssignCandidates,
  xc as groupIncorrectExamplesByTag,
  ku as groupMaterializationOutputs,
  hn as groupSegmentsIntoSwimlanes,
  uc as groupSelectedSwimlanes,
  Ko as groupSwimlanesBySegmentGroup,
  Dt as handleModalKey,
  Ha as hasGroupedSwimlanes,
  Bn as hasSegmentStudioCapability,
  Xa as heldTagChangeFor,
  nd as heldTagReady,
  _i as hideCollectedFeedbackSegments,
  Bi as historyActionsForTarget,
  Or as incorrectExampleHistoryState,
  _a as indexPerformerSlotsBySegment,
  wm as initialReviewFilter,
  Nc as insertSegmentProjection,
  Mr as isCurrentEditorRequest,
  Jd as isEditableTarget,
  Ln as isEditorHeldByOtherWork,
  Im as isEditorShortcutOwner,
  Cc as isKindRunning,
  Mm as isSaveQueueBusy,
  Io as isSegmentCreationPending,
  rm as isSegmentStudioBinRoute,
  nm as isSegmentStudioSegmentsRoute,
  tm as isSegmentStudioSettingsRoute,
  Br as isTemporarySegment,
  zu as layoutDerivationRuleComponent,
  _u as layoutDerivationRuleComponents,
  Ic as mergeSegmentsProjection,
  pd as migrateLegacyBrowseFilter,
  Co as migrateLegacyDiscoveryFilter,
  $o as migrateLegacyDiscoverySort,
  nc as multiSelectionActionHint,
  ln as normalizeCollapsedSegmentGroups,
  Wr as normalizeDiscoveryIds,
  Ft as normalizeEditorSegmentFilters,
  on as normalizeGender,
  Mi as normalizeReviewFilter,
  Fo as normalizeSegmentGroupColor,
  wa as normalizeSegmentStudioFeatureProfile,
  xm as normalizeSegmentStudioMode,
  xo as normalizeSegmentStudioPublicMode,
  wl as parseEditorLayout,
  $l as parseHideDerivedSegmentsPreference,
  Tl as parseMergeConfirmationPreference,
  xa as parsePlaybackShortcutConfig,
  Hl as parseShortcutBindingOverrides,
  Fn as patchPerformerSlotProjection,
  Tm as patchSegmentProjection,
  Lc as pendingChangesReducer,
  Dc as pendingInsertedSegments,
  Bl as percentageSeekTime,
  wd as performInitialSegmentSeek,
  yt as performerOptionId,
  _r as performerSlotHistoryState,
  Ot as performerSlotLabel,
  ic as performerSlotPresentation,
  $m as performerSlotStatus,
  Uo as performerSlotStatusFromSegmentSlots,
  za as performerSlotsForSegment,
  _t as provenanceSourceLabel,
  ns as prunePendingChanges,
  td as queueCreatedSegmentTagChoice,
  Aa as rankPerformerOptions,
  bc as reconcileSegmentGroupKey,
  jl as reconcileSelectedSegmentIds,
  lu as recyclingBinActionText,
  Ud as recyclingBinDeletionPrompt,
  Fa as recyclingBinDeletionSummary,
  ud as recyclingBinModeSwitchPrompt,
  km as removeQueuedReviewsForSegments,
  Rm as removeSegmentsProjection,
  Pi as requestedOwnedItemId,
  kd as requestedSegmentId,
  Dl as resolveEditorSegmentSelection,
  Yl as resolveQueuedReviewRequest,
  Zl as resolveSegmentCreationAction,
  dd as resolveSegmentStudioRoute,
  ql as resolveSegmentStudioShortcuts,
  Ya as resolveSegmentTarget,
  Hu as resolveSelectedDerivationRule,
  $i as resolveSelectedSegments,
  Cu as restoreDisabledToolbarActionFocus,
  Fu as restorePublishApprovedFocus,
  Em as restoreSegmentFieldsProjection,
  Am as restoreSegmentsProjection,
  Oc as retargetPendingChanges,
  Ja as revealCollapsedSegmentGroup,
  Un as sameSegmentIdentity,
  Qa as savingSegmentIdFrom,
  Ba as segmentBadgeStyle,
  qd as segmentGroupEdgeColor,
  Vr as segmentGroupHeaderBackground,
  Kt as segmentGroupKeyForSegment,
  Bo as segmentHistoryIdentity,
  Dr as segmentHistoryState,
  pt as segmentIdentity,
  Ua as segmentRailItemStyle,
  Nm as segmentStateStyle,
  am as segmentStudioActionTarget,
  ad as segmentStudioLegacyMode,
  Kd as segmentTimelineStyle,
  jt as segmentsHistoryState,
  Fl as selectAllVideoSegmentIds,
  yd as selectedBrowseStates,
  Wa as selectedSwimlaneMerge,
  Fr as selectionReferenceForSegment,
  os as setBackLinkNavigation,
  ts as settlePendingChange,
  ec as sharedPerformerSlotShape,
  tc as sharedTagPerformerSlotShape,
  Gn as shortcutAvailableInMode,
  Vl as shortcutBindingDisplayText,
  ym as shortcutBindingFromEvent,
  hm as shortcutBindingsOverlap,
  vm as shortcutModesOverlap,
  _l as shortcutRequiresSingleSegment,
  uo as shotBoundaryFingerprint,
  Xd as shouldAcceptCurrentTagFromEnter,
  Qd as shouldDismissPopover,
  bm as shouldExitShortcutCapture,
  Cm as shouldHandleEditorShortcut,
  Ou as shouldLoadSegmentAnalysis,
  Vi as shouldReloadAfterSegmentMutation,
  So as shouldRestoreTransitionSelection,
  Td as shouldShowQuickSearchGroups,
  md as slottedPerformerCriterion,
  Ti as splitShortcutCategoriesIntoColumns,
  Lu as startCompletedRunWatch,
  rc as suggestDerivationRuleSlotMappings,
  mr as swimlaneDisplayLabel,
  Vd as swimlaneMarkerTop,
  Hd as swimlaneStripeBackground,
  ed as tagEditorLockedBySave,
  Qr as targetsOverlap,
  xl as timelineContentStyle,
  wi as timelinePlayheadHorizontalStyle,
  _d as timelineSegmentWidth,
  bl as timelineTickAlignment,
  hl as timelineTickPosition,
  yo as timelineTimePercent,
  ou as toDiscoveryItem,
  fc as toggleAllCollapsedSegmentGroups,
  Ei as toggledSelectionReviewState,
  Vt as trapModalFocus,
  Pd as tryParseJsonResponseText,
  Ll as updateAnchoredSegmentSelection,
  iu as updateDiscoverySelection,
  Ml as updateDualRangeValues,
  Ol as updateSegmentCollectionSelection,
  Pl as updateSegmentRangeSelection,
  ha as updateSegmentSelection,
  Qi as validateDerivationRuleDraft,
  ki as validateSegmentTiming,
  Po as videoPerformerOptions,
  go as videoPerformerSlotAssignments,
  ld as visibleSegmentStudioSettingsTabs,
  sd as visibleSegmentStudioTabs,
  qa as visibleVirtualRows,
  Sd as withoutSlottedPerformers
};
