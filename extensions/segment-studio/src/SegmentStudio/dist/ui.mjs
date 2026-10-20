import Ao from "@cove/runtime/react";
import { createPortal as al } from "@cove/runtime/react-dom";
import { extensionFetch as Mo } from "@cove/runtime/api";
import * as cr from "@cove/runtime/components";
import { formatDuration as sl, EntityReferenceSelector as ur, useExtensionKeyboardBindings as ll, VideoPlayer as oa, useRegisterExtensionKeyboardActions as ia, getDefaultFilter as aa, useListUrlState as sa, ListPage as la, VIDEO_CRITERIA as dl, VIDEO_SORT_OPTIONS as cl } from "@cove/runtime/components";
import { StepBack as ul, StepForward as ml, Loader2 as gl } from "@cove/runtime/lucide-react";
const Do = "com.midnightrider.segment-studio", fl = "segment-studio-editor", da = "segment-studio.layout.v1", Sn = "segment-studio.operations.v1", ca = "segment-studio.collapsed-segment-groups.v1", ua = "segment-studio.playback-shortcuts.v1", ma = "segment-studio.timing-clipboard.v1", ga = "segment-studio.hide-derived-segments.v1", fa = "segment-studio.merge-confirmation.v1", Mt = ["unreviewed", "approved", "rejected"], pl = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], ki = "(min-width: 1024px) and (min-height: 640px)", wi = "(min-width: 1024px) and (min-height: 900px)", mr = 1e-3, Ni = 15, yl = 30, pa = 12, Ot = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, Oo = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30
}, Xt = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function Ii(e, t, n) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(n) && n > 0;
  return e < 0 || o && e > n || t != null && (t < 0 || o && t > n) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function ya(e, t = null) {
  const n = e.flatMap((o) => o.markers.map((i) => i.segment));
  return n.find((o) => o.id === t) ?? zr(e, null, 1, !0) ?? n[0] ?? null;
}
function zr(e, t, n, o = !1) {
  var u;
  const i = e.findIndex((g) => g.markers.some((y) => y.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const g = e.flatMap((y) => y.markers.map((h) => h.segment)).filter((y) => y.reviewState === "unreviewed");
    return n < 0 ? g.at(-1) ?? null : g[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((g) => g.segment.id === t);
  if (!o)
    return ((u = (n < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((y) => y.segment.reviewState === "unreviewed")) == null ? void 0 : u.segment) ?? null;
  const l = e.flatMap((g) => g.markers.map((y) => y.segment)), d = l.findIndex((g) => g.id === t);
  return (n < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((g) => g.reviewState === "unreviewed") ?? null;
}
function bl(e, t, n, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((u, g) => u.markers.filter(({ segment: y }) => {
    const h = Number(y.startSec), p = y.endSec == null ? h + yl : Number(y.endSec);
    return Number.isFinite(h) && Number.isFinite(p) && p >= h && h <= i + Ni + mr && p >= i - Ni - mr;
  }).map(({ segment: y }) => ({ segment: y, laneIndex: g }))).sort((u, g) => u.laneIndex - g.laneIndex || Math.abs(u.segment.startSec - i) - Math.abs(g.segment.startSec - i) || u.segment.id - g.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((u) => u.markers.some((g) => g.segment.id === o));
  if (s < 0) return n < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((u) => u.laneIndex !== s);
  return l.length === 0 ? n < 0 ? a.at(-1).segment : a[0].segment : n < 0 ? ((d = l.findLast((u) => u.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((u) => u.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function hl(e, t, n) {
  var a;
  const o = Number(n);
  if (!Number.isFinite(o) || t == null) return null;
  const i = (Array.isArray(e) ? e : []).find((s) => {
    var l;
    return (l = s.markers) == null ? void 0 : l.some(({ segment: d }) => d.id === t);
  });
  return i ? ((a = i.markers.map(({ segment: s }) => {
    const l = Number(s.startSec), d = s.endSec == null ? l : Number(s.endSec), c = Number.isFinite(d) && d >= l ? d : l, u = o < l ? l - o : o > c ? o - c : 0;
    return { segment: s, distance: u, startDistance: Math.abs(l - o) };
  }).filter((s) => Number.isFinite(s.distance)).sort((s, l) => s.distance - l.distance || s.startDistance - l.startDistance || String(s.segment.id).localeCompare(String(l.segment.id)))[0]) == null ? void 0 : a.segment) ?? null : null;
}
function _r(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function vm(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const n = Math.max(2, Math.floor(t));
  return Array.from({ length: n }, (o, i) => e * i / (n - 1));
}
function vl(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, n) => n * 60);
}
function Sm(e, t = 1, n = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, n) : Math.ceil(e / 60) * Math.max(1, n) * Math.max(1, t);
}
function Sl(e, t, n = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(n) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function xl(e, t, n = null) {
  return e <= 0 || e >= t - 1 && (n == null || n >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function kl(e, t, n) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && n >= 100 ? { right: "0" } : { left: `${n}%` };
}
function wl(e, t, n, o, i = 160, a = 0) {
  if (!(t > 0) || !(n > o)) return 0;
  const s = Math.max(0, n - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(n - o, Math.max(0, l - o / 2));
}
function ho(e, t) {
  const n = Number(e);
  return t > 0 && Number.isFinite(n) ? Math.min(1, Math.max(0, n / t)) * 100 : 0;
}
function Nl(e, t, n = 10) {
  const o = ho(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(n) || 0) * (1 - i)
  };
}
function Ci(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function Il(e, t = pa) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function ba(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : Ot.timelineRatio;
}
function vo(e, t) {
  const n = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(n) ? n : 560));
}
function bn(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? Ot.detailWidth : Math.min(vo(t, 0), Math.max(240, e));
}
function Fr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? Ot.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function Cl(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function Po(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: Ot.timelineRatio, maximum: Ot.timelineRatio };
  const n = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: n, maximum: Math.max(n, o) };
}
function Lo(e, t) {
  const n = ba(e);
  if (!(t > 0)) return n;
  const o = Po(t);
  return Math.min(o.maximum, Math.max(o.minimum, n));
}
function $l(e) {
  if (!e) return { ...Ot };
  try {
    const t = JSON.parse(e), n = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof n == "number" && Number.isFinite(n) ? ba(n) : Ot.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: bn(t == null ? void 0 : t.detailWidth),
      markerRailWidth: bn(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: Fr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...Ot };
  }
}
function Tl(e, t, n) {
  return n > 0 ? Lo((t + n - e) / n, n) : Ot.timelineRatio;
}
function xm(e, t, n, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < n + a ? e - n - a : t > o - a ? t - o + a : 0;
}
function Rl(e, t, n, o = null) {
  var d;
  const i = [...e].sort((c, u) => c.startSec - u.startSec || c.id - u.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= mr ? i[a + (n < 0 ? -1 : 1)] ?? null : n < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function Mr(e, t, n, o) {
  return e === t && n === o;
}
function El({ beginRequest: e, fetchDetail: t, isCurrent: n, isSameVideo: o }) {
  let i = null, a = null;
  return function({ onLoaded: l, onError: d, prepare: c = null }) {
    const u = e(), g = (async () => {
      try {
        const y = await t(u);
        if (n(u)) {
          const h = c ? c(y, u) : y;
          return l(h), h;
        }
      } catch (y) {
        if (n(u))
          return d(y), null;
      }
      return o(u) && i !== g && a.videoId === u.videoId ? i : null;
    })();
    return i = g, a = u, g;
  };
}
const Ln = "__segment-studio-cleared-selection__";
function Al(e) {
  return e === "true";
}
function Ml(e) {
  return e !== "false";
}
function ha() {
  try {
    return Ml(window.localStorage.getItem(fa));
  } catch {
    return !0;
  }
}
function va(e) {
  try {
    window.localStorage.setItem(fa, String(!!e));
  } catch {
  }
}
function Jr(e) {
  return !e.published && e.reviewState === "approved" && !e.isDerived;
}
function Dl(e, t) {
  return t ? e.filter((n) => !n.isDerived) : e;
}
function Gt(e = {}) {
  const t = Mt.filter((u) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(u) : !0), n = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (u, g) => {
    const y = Number(u);
    return Number.isFinite(y) ? Math.min(1, Math.max(0, y)) : g;
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
function uo(e, t, n, o = !1, i = []) {
  var c, u;
  const a = Gt(n), s = a.performerId == null ? null : new Set((t || []).filter((g) => Number(g.performerId) === a.performerId).map((g) => g.segmentId)), l = new Set((i || []).flatMap((g) => g.tags || []).map((g) => Number(g.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((u = (c = (i || []).find((g) => Number(g.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : u.map((g) => Number(g.tagId))) || []);
  return Dl(e || [], o).filter((g) => {
    if (g.reviewState != null && !a.reviewStates.includes(g.reviewState) || s && !s.has(g.id) || a.tagId != null && Number(g.tagId) !== a.tagId || d && !d.has(Number(g.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(g.tagId)) || a.sourceKey != null && g.sourceKey !== a.sourceKey) return !1;
    const y = Number(g.confidence);
    return g.confidence == null || !Number.isFinite(y) ? a.includeUnscored : y >= a.confidenceMin && y <= a.confidenceMax;
  });
}
function Sa(e, t, n, o = !1, i = []) {
  var l;
  const a = Gt(n);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = Gt({
    ...a,
    reviewStates: [...a.reviewStates, e.reviewState]
  }).reviewStates), a.performerId != null && !(t || []).some((d) => d.segmentId === e.id && Number(d.performerId) === a.performerId) && (a.performerId = null), a.tagId != null && Number(e.tagId) !== a.tagId && (a.tagId = null), a.segmentGroupId != null) {
    const d = new Set((i || []).flatMap((c) => c.tags || []).map((c) => Number(c.tagId)));
    if (a.segmentGroupId === "ungrouped")
      d.has(Number(e.tagId)) && (a.segmentGroupId = null);
    else {
      const c = (i || []).find((u) => Number(u.id) === a.segmentGroupId);
      (l = c == null ? void 0 : c.tags) != null && l.some((u) => Number(u.tagId) === Number(e.tagId)) || (a.segmentGroupId = null);
    }
  }
  a.sourceKey != null && e.sourceKey !== a.sourceKey && (a.sourceKey = null);
  const s = Number(e.confidence);
  return e.confidence != null && Number.isFinite(s) && (a.confidenceMin = Math.min(a.confidenceMin, Math.floor(s * 100) / 100), a.confidenceMax = Math.max(a.confidenceMax, Math.ceil(s * 100) / 100)), (e.confidence == null || !Number.isFinite(s)) && (a.includeUnscored = !0), {
    filters: Gt(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function Ol(e, t = !1) {
  const n = Gt(e);
  return +(n.reviewStates.length !== Mt.length) + +(n.performerId != null) + +(n.tagId != null) + +(n.segmentGroupId != null) + +(n.sourceKey != null) + +(n.confidenceMin > 0 || n.confidenceMax < 1) + +!n.includeUnscored + Number(t);
}
function Pl(e, t, n) {
  const o = Number(e), i = Number(t), a = Number(n);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function Ll(e, t, n, o) {
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
function jl(e, t, n = null, o = {}) {
  if (t === Ln) return null;
  const i = t ?? n, a = (e || []).flatMap((s) => (s.markers || []).map((l) => l.segment)).find((s) => s.id === i);
  if (a) return a;
  if (o.reference) {
    const s = o.visibleLanes ?? e, l = s.flatMap((u) => (u.markers || []).map((g) => g.segment)), d = l.find((u) => u.id === o.reference.id);
    if (d) return d;
    const c = Fl(
      e,
      s,
      l,
      o.reference,
      o.referenceLanes
    );
    return Br(c.lanes, o.reference, { removedIds: c.removedIds });
  }
  return ya(e);
}
function Fl(e, t, n, o, i) {
  const a = { lanes: t, removedIds: [] };
  if (!i || (e || []).some((g) => g.key === o.laneKey)) return a;
  const s = new Map(i.map((g, y) => [g.key, y])), l = s.get(o.laneKey);
  if (l == null) return a;
  const d = new Set(n.map((g) => g.id)), c = (i[l].markers || []).filter(({ segment: g }) => g && !d.has(g.id)), u = t.reduce((g, y, h) => (s.get(y.key) ?? 1 / 0) < l ? h + 1 : g, 0);
  return {
    lanes: [
      ...t.slice(0, u),
      { key: o.laneKey, markers: c },
      ...t.slice(u)
    ],
    removedIds: c.map(({ segment: g }) => g.id)
  };
}
function xa(e, t, n, o = !1) {
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
function Gl(e, t, n) {
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
function Bl(e, t, n, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(n);
  if (s < 0 || l < 0)
    return xa(e, t, n, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: n
  };
}
function Ul(e, t, n = null, o = !1) {
  const i = (e == null ? void 0 : e.selectedSegmentIds) || [], a = (e == null ? void 0 : e.activeSegmentId) ?? null, s = (e == null ? void 0 : e.anchorSegmentId) ?? a, l = (e == null ? void 0 : e.rangeBaseSegmentIds) || [];
  if (n) {
    const u = [...new Set(n)];
    if (!u.includes(s) || !u.includes(t))
      return {
        selectedSegmentIds: [t],
        activeSegmentId: t,
        anchorSegmentId: t,
        rangeBaseSegmentIds: []
      };
    const g = o ? [.../* @__PURE__ */ new Set([...l, ...i])] : l;
    return {
      ...Bl(g, s, t, u, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: g
    };
  }
  const d = xa(i, a, t, o);
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
function Kl(e, t, n) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return n != null && i.has(n) && !a.includes(n) && a.push(n), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function zl(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function on(e, t) {
  const n = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(n, Number((e == null ? void 0 : e.endSec) ?? n) || n), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < n ? n - a : i > o ? i - o : 0;
}
function $i(e, t, n, o = () => !0) {
  const i = t.anchor ?? t;
  return (e || []).map((a) => a.segment).filter((a) => a && !n.has(a.id) && o(a)).sort((a, s) => on(t, a) - on(t, s) || on(i, a) - on(i, s) || Math.abs(Number(a.startSec) - Number(i.startSec)) - Math.abs(Number(s.startSec) - Number(i.startSec)) || Number(a.startSec) - Number(s.startSec) || Number(a.id) - Number(s.id))[0] ?? null;
}
function So(e, t) {
  return ((e == null ? void 0 : e.markers) || []).map((n) => n.segment).filter((n) => n && !t.has(n.id));
}
function mo(e) {
  return e.reviewState === "unreviewed";
}
function Ti(e, t) {
  const n = Number(e.startSec) || 0;
  return n !== t.startSec ? n > t.startSec : Number(e.id) > Number(t.id);
}
function Ri(e, t, n, o, i) {
  var s;
  return t < 0 ? $i(e.flatMap((l) => l.markers || []), n, o, i) : ((s = e.map((l, d) => ({ index: d, found: $i(l.markers, n, o, i) })).filter(({ found: l }) => l).sort((l, d) => Math.abs(l.index - t) - Math.abs(d.index - t) || on(n, l.found) - on(n, d.found) || on(n.anchor ?? n, l.found) - on(n.anchor ?? n, d.found) || +(l.index < t) - +(d.index < t) || l.index - d.index)[0]) == null ? void 0 : s.found) ?? null;
}
function _l(e, t, n) {
  if (So(e, n).length > 0) return t;
  const o = ((e == null ? void 0 : e.markers) || []).map((s) => s.segment).filter((s) => s && n.has(s.id));
  if (o.length <= 1) return t;
  const i = Math.min(t.startSec, ...o.map((s) => Number(s.startSec) || 0)), a = Math.max(t.endSec, ...o.map((s) => Number(s.endSec ?? s.startSec) || 0));
  return { ...t, startSec: i, endSec: a, anchor: t };
}
function Gr(e, t) {
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
function Br(e, t, n = {}) {
  const o = e || [];
  if (o.length === 0) return null;
  const i = new Set(n.removedIds || []);
  if (t == null) {
    const l = { markers: o.flatMap((c) => c.markers || []) }, d = So(l, i);
    return d.find(mo) ?? d[0] ?? null;
  }
  i.add(t.id);
  const a = o.findIndex((l) => l.key === t.laneKey);
  if (a >= 0) {
    const l = So(o[a], i).filter(mo), d = l.find((u) => Ti(u, t));
    if (d) return d;
    const c = l.filter((u) => !Ti(u, t)).at(-1);
    if (c) return c;
  }
  const s = _l(o[a], t, i);
  return Ri(o, a, s, i, mo) ?? Ri(o, a, s, i, () => !0);
}
function Hl(e, t) {
  const n = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return n * o / 10;
}
function Ei(e, t) {
  const n = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => n.get(o)).filter(Boolean);
}
function ql() {
  try {
    return Al(window.localStorage.getItem(ga));
  } catch {
    return !1;
  }
}
function Wl(e) {
  try {
    window.localStorage.setItem(ga, String(!!e));
  } catch {
  }
}
const pr = [
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
], Vl = /* @__PURE__ */ new Set([
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
function Jl(e) {
  return Vl.has(e);
}
function ka(e) {
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
function Yl(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const n = new Set(pr.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => n.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(ka).filter(Boolean)]));
  } catch {
    return {};
  }
}
function Ql(e = {}) {
  const t = Yl(e);
  return pr.map((n) => ({
    ...n,
    bindings: Object.hasOwn(t, n.id) ? t[n.id] : n.bindings
  }));
}
function Ai(e, t = 2) {
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
function km(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : ka({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function wm(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function xo(e, t) {
  const n = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (n !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function Mi(e, t) {
  const n = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(n != null && n.includes(String(t || "").toLowerCase()));
}
function Nm(e, t) {
  if (!e || !t) return !1;
  const n = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = Mi(e.code, t.key), a = Mi(t.code, e.key);
  if (!n && !o && !i && !a) return !1;
  const s = i ? t.key : e.key, l = i ? e.code : a ? t.code : o ? e.code : e.code || t.code;
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
          if (xo(y, e) && xo(y, t)) return !0;
        }
  return !1;
}
function Bn(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function Im(e, t) {
  return [!1, !0].some((n) => Bn(e, n) && Bn(t, n));
}
function Xl(e, t = !1, n = {}) {
  return Ql(n).find((o) => Bn(o, t) && o.bindings.some((i) => xo(e, i))) || null;
}
function wa(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function Zl(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(wa).join(" / ") : "Unassigned";
}
function Cm(e, t) {
  const n = String(t || "").trim().toLowerCase();
  return n ? e.filter((o) => [o.description, o.category, Zl(o)].some((i) => String(i || "").toLowerCase().includes(n))) : e;
}
function $m(e) {
  return e === "review" ? "review" : "editor";
}
function mt(e, { itemId: t = null, nativeSegmentId: n = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return n == null ? null : (e || []).find((o) => o.nativeSegmentId === n) || null;
}
function Di(e, t) {
  return (e || []).length > 0 && e.every((n) => n.reviewState === t) ? "unreviewed" : t;
}
function ed(e, t, n) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (n == null ? void 0 : n.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function td(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const n = e.identities.map((i) => mt(t, i)).filter(Boolean);
  return n.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: n,
    selectedSegment: mt(t, e.activeIdentity) || n[0]
  };
}
function nd(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function Tm(e, t) {
  return (e || []).filter((n) => !n.identities.some((o) => (t || []).some((i) => nd(o, i))));
}
function Oi(e, t) {
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
function rd(e, t, n, o) {
  const i = n ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function od(e, t, n = null) {
  const o = Number(n);
  if (n != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function id(e, t, n) {
  return e != null && (n == null || t !== n);
}
function ad(e, t, n, o = null) {
  if (n === t.tagId) return null;
  const i = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: n,
    tagName: o || ((i == null ? void 0 : i.tagId) === n ? i.tagName : null)
  };
}
function sd({ tagEditing: e, selectedSegmentIds: t, activeSegmentId: n }, o) {
  return !(e && n === o && (t == null ? void 0 : t.length) === 1 && t[0] === o);
}
function ko(e, t) {
  return e === t;
}
function ld(e, t, n) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (n || []).find((i) => i.itemId === o.itemId) || null;
}
function dd(e, t, n) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return n < 0 ? o.filter((i) => i.startSec < t - mr).at(-1) || null : o.find((i) => i.startSec > t + mr) || null;
}
function go(e) {
  return [...e || []].sort((t, n) => t.startSec - n.startSec || t.id - n.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function Pi(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: Mt.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function Rm(e, t = null, n = !1) {
  const o = Pi(n ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function Pn(e, t, n, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(n, i)) : t;
}
function Na(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: Pn(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: Pn(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: Pn(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(Pn(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(Pn(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(Pn(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...Oo };
  }
}
function cd(e, t = 30) {
  const n = Number(t);
  return Number(e) / (Number.isFinite(n) && n > 0 ? n : 30);
}
function Ia() {
  try {
    return Na(window.localStorage.getItem(ua));
  } catch {
    return { ...Oo };
  }
}
function Li(e) {
  const t = Na(JSON.stringify(e));
  try {
    window.localStorage.setItem(ua, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Zt = Object.freeze({
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
function wo(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function Ca(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, n = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && n && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? wo(e.requestedMode) : "basic",
    effectiveMode: i ? wo(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function Un(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function ud(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function md(e) {
  const t = [];
  return Un(e, Zt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), Un(e, Zt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function gd(e) {
  return [
    ["general", "General", Zt.settingsGeneral],
    ["shortcuts", "Shortcuts", Zt.settingsShortcuts],
    ["performer-slots", "Performer slots", Zt.settingsPerformerSlots],
    ["derivation", "Derivation", Zt.settingsDerivation]
  ].filter(([, , n]) => Un(e, n)).map(([n, o]) => [n, o]);
}
function fd(e, t) {
  return e === "segments" && !Un(
    t,
    Zt.navigationSegmentInventory
  ) || e === "bin" && !Un(
    t,
    Zt.recyclingBinView
  ) ? "videos" : e;
}
function pd(e) {
  const t = Number(e), n = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (n === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = n === 1;
  return `You have ${n} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function yd(e, t = 0) {
  const n = Number(e), o = Number.isFinite(n) && n >= 0 ? Math.trunc(n) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const fo = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, ji = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: Mt.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
], Kt = "slottedPerformerCriterion", yr = "slotCriterion", Fn = "*", $a = "unassignedSlotCriterion", hn = "_filterExpression";
function bd(e, t = {}, n = []) {
  const o = n.filter((a) => a.type !== "related"), i = new Map((e || []).filter((a) => a.key !== Fn).map((a) => [a.key, a.label]));
  for (const a of hd(t)) a !== Fn && !i.has(a) && i.set(a, a);
  return {
    id: "slottedPerformer",
    label: "Slotted Performer",
    type: "related",
    entityType: "performers",
    filterKey: Kt,
    category: "related",
    supportsDistinctSiblingMatches: !0,
    relatedCriteria: () => o,
    relatedContextCriteria: [
      {
        id: "slot",
        label: "Slot",
        type: "enum",
        filterKey: yr,
        modifiers: ["EQUALS"],
        options: [{ value: Fn, label: "Any" }, ...[...i].map(([a, s]) => ({ value: a, label: s }))]
      },
      { id: "specificPerformer", label: "Specific Performer", type: "multiId", entityType: "performers", filterKey: "performerIdsCriterion", modifiers: ["INCLUDES", "EXCLUDES"] },
      { id: "ageAtVideoDate", label: "Age (then)", type: "number", filterKey: "ageAtHostDateCriterion" },
      { id: "performerOccurrenceTags", label: "Occurrence Tags", type: "multiId", entityType: "tags", filterKey: "performerOccurrenceTagsCriterion" },
      { id: "unassignedSlot", label: "Unassigned Slot", type: "bool", filterKey: $a }
    ],
    relatedResultLabel: "segments"
  };
}
function hd(e) {
  const t = [], n = (o) => {
    var a, s, l;
    if (!o || typeof o != "object") return;
    const i = (s = (a = o[Kt]) == null ? void 0 : a[yr]) == null ? void 0 : s.value;
    typeof i == "string" && t.push(i);
    for (const d of ((l = o[hn]) == null ? void 0 : l.children) || o.children || []) n(d.filter || d.group);
  };
  return n(e), t;
}
function vd(e, t) {
  return {
    [yr]: { modifier: "EQUALS", value: e },
    performerIdsCriterion: { modifier: "INCLUDES", value: t }
  };
}
function Sd(e, t) {
  const n = Aa(e.performersCriterion, e.performerId), o = e.slots !== void 0;
  if (!n.length && e.performersCriterion === void 0 && e.performerId === void 0 && !o || o && !t) return e;
  const i = { ...e };
  delete i.performersCriterion, delete i.performerId, delete i.slots;
  const a = kd(e.slots), s = new Map((t || []).flatMap((d) => (d.slotDefinitionIds || []).map((c) => [String(c), d.key]))), l = Object.entries(a.values).map(([d, c]) => vd(s.get(String(d)) ?? Fn, [Number(c)]));
  if (n.length && l.push({ [yr]: { modifier: "EQUALS", value: Fn }, performerIdsCriterion: { modifier: "INCLUDES", value: n } }), l.length === 1 && i[Kt] === void 0) i[Kt] = l[0];
  else if (l.length) {
    const d = l.slice(0, Object.keys(a.values).length).map((g) => ({ filter: { [Kt]: g } })), c = d.length > 1 ? [{ group: { operator: "AND", relatedScope: { filterKey: Kt, matchMode: "distinct" }, children: d } }] : d;
    n.length && c.push({ filter: { [Kt]: l.at(-1) } });
    const u = [...i[hn] ? [{ group: i[hn] }] : [], ...c];
    i[hn] = u.length === 1 && u[0].group ? u[0].group : { operator: "AND", children: u };
  }
  return a.activityTagId && i.activitiesCriterion === void 0 && i.activityId === void 0 && (i.activitiesCriterion = { modifier: "INCLUDES", value: [a.activityTagId] }), i;
}
function xd(e) {
  const t = String(e || "").split(",").filter((n) => Mt.includes(n));
  return t.length === 0 ? [...Mt] : [...new Set(t)];
}
function kd(e) {
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
function No(e) {
  return Array.isArray(e) ? e.map(No) : !e || typeof e != "object" ? e : Object.fromEntries(Object.entries(e).filter(([t]) => !t.startsWith("_")).map(([t, n]) => [
    t,
    t === "modifier" && typeof n == "string" && /^[A-Z_]+$/.test(n) ? n.toLowerCase().replace(/_([a-z])/g, (o, i) => i.toUpperCase()) : No(n)
  ]));
}
function wd(e) {
  var l, d;
  if (!e || typeof e != "object") return null;
  const { [$a]: t, [yr]: n, ...o } = e, i = typeof (n == null ? void 0 : n.value) == "string" && n.value ? n.value : Fn, a = typeof (t == null ? void 0 : t.value) == "boolean" ? t.value : null, s = o._matchAll === !0 || !!((d = (l = o.findFilter) == null ? void 0 : l.q) != null && d.trim()) || Object.keys(o.objectFilter || {}).length > 0 || o.performerIdsCriterion !== void 0 || o.ageAtHostDateCriterion !== void 0 || o.performerOccurrenceTagsCriterion !== void 0;
  return !s && a === null && !n ? null : { role: i, performers: s || a === null ? No(o) : null, unassigned: a };
}
function Ta(e, { legacyStates: t = !1 } = {}) {
  var o, i;
  const n = Mt.includes((o = e.reviewStateCriterion) == null ? void 0 : o.value) ? [e.reviewStateCriterion.value] : t && e.states ? xd(e.states) : [];
  return {
    activityTagIds: Aa(e.activitiesCriterion, e.activityId),
    includeActivitySubtags: ((i = e.activitiesCriterion) == null ? void 0 : i.depth) === -1,
    reviewStates: n,
    slottedPerformer: wd(e[Kt])
  };
}
function Ra(e) {
  if (!e || typeof e != "object" || !Array.isArray(e.children)) return null;
  const t = e.children.flatMap((n) => {
    if (n != null && n.group) {
      const o = Ra(n.group);
      return o ? [{ group: o }] : [];
    }
    return n != null && n.filter && typeof n.filter == "object" ? [{ filter: Ta(n.filter) }] : [];
  });
  return t.length ? e._semanticNone ? { operator: "NOT", children: t.length === 1 ? t : [{ group: { operator: "OR", children: t } }] } : {
    operator: ["OR", "NOT", "JUST_ONE"].includes(e.operator) ? e.operator : "AND",
    ...e.relatedScope ? { relatedScope: e.relatedScope } : {},
    ...e.distinctRelatedMatches === !0 ? { distinctRelatedMatches: !0 } : {},
    children: t
  } : null;
}
function Nd(e, t) {
  const n = Ra(t[hn]);
  return {
    query: String(e.q || "").trim() || null,
    ...Ta(t, { legacyStates: !0 }),
    ...n ? { filterExpression: n } : {},
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc"
  };
}
function Id(e) {
  const { [Kt]: t, [hn]: n, ...o } = e, i = Ea(n);
  return i ? { ...o, [hn]: i } : o;
}
function Ea(e) {
  if (!e || typeof e != "object" || !Array.isArray(e.children)) return null;
  const t = e.children.flatMap((i) => {
    if (i != null && i.group) {
      const l = Ea(i.group);
      return l ? [{ ...i, group: l }] : [];
    }
    if (!(i != null && i.filter) || typeof i.filter != "object") return [];
    const { [Kt]: a, ...s } = i.filter;
    return Object.keys(s).length ? [{ ...i, filter: s }] : [];
  });
  if (!t.length) return null;
  const { relatedScope: n, ...o } = e;
  return { ...o, ...n && n.filterKey !== Kt ? { relatedScope: n } : {}, children: t };
}
function Aa(e, t) {
  const n = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(n.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function Ma(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Cd(e) {
  var i;
  const t = Number(e.startSec) || 0, n = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(n)) return Math.max(t, n);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function $d(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Fi(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Td(e, t, n) {
  if (typeof n != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (n(o.startSec, !1), !0) : !1;
}
function yt(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function jo(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function po(e, t) {
  const n = new Set(jo(t).map((o) => String(yt(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && n.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function an(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function Gi(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(an).sort().join(",")}`;
}
function Da(e, t, n = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((h) => String(h.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(n)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((h) => {
    var p;
    return !((p = h.genderHints) != null && p.length);
  }) && e.length === t.length && !i) {
    const h = [...e].sort((b, k) => String(b.slotDefinitionId).localeCompare(String(k.slotDefinitionId))), p = [...t].sort((b, k) => String(b.name).localeCompare(String(k.name)) || Number(yt(b)) - Number(yt(k)));
    return [{
      assignments: Object.fromEntries(h.map((b, k) => [String(b.slotDefinitionId), String(yt(p[k]))])),
      description: p.map((b) => b.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((h) => t.map((p, b) => ({ performer: p, index: b })).filter(({ performer: p }) => {
    var b;
    return !((b = h.genderHints) != null && b.length) || h.genderHints.some((k) => an(k) === an(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), u = i ? c.filter((h) => h.length > 0).length : Bi(c, t.length);
  if (u === 0) return [];
  const g = new Map(t.map((h, p) => [String(yt(h)), p]));
  function y(h, p, b) {
    if (s.length >= a) return;
    const k = c.slice(h), I = i ? k.filter((Y) => Y.length > 0).length : Bi(k.map((Y) => Y.filter((A) => !p.has(String(yt(t[A]))))), t.length);
    if (b + I < u) return;
    if (h === e.length) {
      if (b !== u) return;
      const Y = Object.fromEntries(d.map(({ slot: P, performer: R }) => [String(P.slotDefinitionId), R ? String(yt(R)) : ""])), A = o.length === 0 ? Object.values(Y).sort().join(",") : [...new Set(e.map((P) => String(P.label || "")))].map((P) => `${P}:${d.filter(({ slot: R }) => String(R.label || "") === P).map(({ performer: R }) => R ? String(yt(R)) : "").sort().join(",")}`).join("|");
      !l.has(A) && s.length < a && (l.add(A), s.push({
        assignments: Y,
        description: d.map(({ slot: P, performer: R }) => o.length ? `${P.label}: ${(R == null ? void 0 : R.name) || "Unassigned"}` : (R == null ? void 0 : R.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const f = e[h], D = [...d].reverse().find(({ slot: Y }) => Gi(Y) === Gi(f)), J = D ? g.get(String(yt(D.performer))) : -1;
    for (const Y of c[h]) {
      const A = t[Y], P = yt(A);
      if (!(Y < J) && !(P == null || !i && p.has(String(P))) && (d.push({ slot: f, performer: A }), i || p.add(String(P)), y(h + 1, p, b + 1), i || p.delete(String(P)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: f, performer: null }), y(h + 1, p, b), d.pop();
  }
  return y(0, /* @__PURE__ */ new Set(), 0), s;
}
function Bi(e, t) {
  const n = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), n[s] === -1 || o(n[s], a)))
        return n[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Rd(e, t) {
  if (!(e != null && e.length) || !(t != null && t.length)) return null;
  const n = e.some((l) => String(l.label || "").trim());
  if (n && e.some((l) => !String(l.label || "").trim())) return null;
  const o = e[0].allowSamePerformerInMultipleSlots === !0;
  if (!n && e.every((l) => {
    var d;
    return !((d = l.genderHints) != null && d.length);
  }) && e.length === t.length && !o) {
    const l = [...e].sort((c, u) => String(c.slotDefinitionId).localeCompare(String(u.slotDefinitionId))), d = [...t].sort((c, u) => String(c.name).localeCompare(String(u.name)) || c.performerId - u.performerId);
    return l.map((c, u) => ({ slot: c, performer: d[u] }));
  }
  const i = /* @__PURE__ */ new Map(), a = [];
  function s(l, d) {
    var u;
    if (i.size > 1) return;
    if (l === e.length) {
      const g = [...new Set(e.map((y) => y.label || ""))].map((y) => `${y}:${a.filter((h) => (h.slot.label || "") === y).map((h) => h.performer.performerId).sort((h, p) => h - p).join(",")}`).join("|");
      i.has(g) || i.set(g, [...a]);
      return;
    }
    const c = e[l];
    for (const g of t)
      !o && d.has(g.performerId) || (u = c.genderHints) != null && u.length && !c.genderHints.some((y) => an(y) === an(g.gender)) || (a.push({ slot: c, performer: g }), o || d.add(g.performerId), s(l + 1, d), o || d.delete(g.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Ed(e) {
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
function Ad(e, t, n = 20) {
  const o = String(t || "").trim().toLocaleLowerCase(), i = (a) => {
    var d;
    if (!o) return !0;
    const s = String(((d = a.segment) == null ? void 0 : d.tagName) || a.tagName || "").toLocaleLowerCase();
    if (s.includes(o)) return !0;
    let l = -1;
    for (const c of o) {
      const u = s.indexOf(c, l + 1);
      if (u < 0) return !1;
      l = u;
    }
    return !0;
  };
  return (e || []).filter(i).slice(0, Math.max(1, Number(n) || 20));
}
function Md(e) {
  return (e || []).flatMap((t) => t.markers.map((n) => ({
    segment: n.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function Dd(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function Oa(e, t, n) {
  const o = yt, i = new Set((t || []).map(o)), a = new Set((n || []).map(an));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), u = d.isVideoPerformer ?? i.has(o(d));
    if (c !== u) return u - c;
    const g = an(l.gender || l.genderIdentity), y = an(d.gender || d.genderIdentity), h = l.matchesGenderHint ?? a.has(g);
    return (d.matchesGenderHint ?? a.has(y)) - h || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
function Pa() {
  return null;
}
function Od(e) {
  return typeof e == "function" || typeof e == "object" && e !== null && "$$typeof" in e;
}
function La(e, t) {
  const n = e[t];
  return Od(n) ? n : Pa;
}
const Pd = La(cr, "ExtensionEntityActions"), ja = La(cr, "ExtensionSelectionActions"), yn = ja !== Pa, { useEffect: ye, useId: Fa, useLayoutEffect: Ui, useMemo: Ve, useReducer: Ld, useRef: ue, useState: G, useSyncExternalStore: jd } = Ao, r = Ao.createElement, Fd = cr.PERFORMER_CRITERIA ?? [], Gd = typeof cr.useDocumentTitle == "function" ? cr.useDocumentTitle : () => {
}, Ga = "/api/plugins/segment-studio";
function Je(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Sn) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const n = Io();
    return t[e] = n, window.localStorage.setItem(Sn, JSON.stringify(t)), n;
  } catch {
    return Io();
  }
}
function Ye(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Sn) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(Sn, JSON.stringify(t));
  } catch {
  }
}
function Fo(e) {
  try {
    return JSON.parse(window.localStorage.getItem(Sn) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function Go(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Sn) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(Sn, JSON.stringify(t));
  } catch {
  }
}
function Bd(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function Ud(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((n, o) => {
    const i = setTimeout(n, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function ne(e, t, n = 0) {
  var d;
  const o = await Mo(`${Ga}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Bd(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && n < 2)
    return await Ud(250 * (n + 1), t == null ? void 0 : t.signal), ne(e, t, n + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function Kd(e, t) {
  const n = await Mo(e, t);
  if (!n.ok) {
    const o = await n.json().catch(() => null);
    throw new Error((o == null ? void 0 : o.error) || (o == null ? void 0 : o.detail) || (o == null ? void 0 : o.title) || "Unable to load Cove data.");
  }
  return n.json();
}
async function zd(e, t) {
  const n = String(e).startsWith("/api/") ? e : `${Ga}${e}`, o = await Mo(n, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: _d(
      o.headers.get("Content-Disposition")
    )
  };
}
function _d(e, t = "segment-studio-ai-feedback.zip") {
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
function Io() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function Ba(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function Hd(e) {
  const t = Number(e.selectedSegmentCount) || 0, n = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + n, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = n > 0 ? ` and ${n} dependent derived segment${n === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function Ua(e, t) {
  const n = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : n.length;
  return { sceneCount: new Set(n.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function qd(e, t) {
  const { sceneCount: n, segmentCount: o } = Ua(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${n} scene${n === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function Ka(e, t) {
  const n = (e == null ? void 0 : e.items) || [], o = Ua(n, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(qd(n, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await ne("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Je(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return Ye(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function Ki({ children: e }) {
  return r("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const _t = {
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
function Em(e, t) {
  return {
    ...(_t[e] || _t.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function za(e) {
  return { ...(_t[e] || _t.unreviewed).badge };
}
function _a(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const Ha = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function Wd(e, t, n = "not-applicable", o = !1) {
  const i = _t[e] || _t.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (n === "empty" || n === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Vd(e, t = !1) {
  const n = "rgb(20, 184, 166)";
  return {
    borderColor: n,
    backgroundColor: n,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Jd(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function Yd(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function Bo(e) {
  const t = typeof e == "string" ? e.trim() : "";
  return /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t) ? t.slice(0, 7).toLowerCase() : null;
}
function Qd(e) {
  return (e == null ? void 0 : e.id) == null ? "var(--color-border)" : Bo(e.color) || "var(--color-accent)";
}
function Xd(e, t, n = null) {
  const o = Bo(n);
  return e ? {
    backgroundColor: t,
    boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
  } : o ? { backgroundColor: t, boxShadow: `inset 3px 0 0 color-mix(in srgb, ${o} 55%, transparent)` } : { backgroundColor: t };
}
function Yr(e = !1, t = null) {
  return `color-mix(in srgb, ${Bo(t) || "var(--color-accent)"} ${e ? 14 : 8}%, var(--color-surface))`;
}
function Zd(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function xn({ state: e, includeLabel: t = !0 }) {
  const n = _t[e] || _t.unreviewed;
  return r("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: za(e)
  }, t ? `${n.symbol} ${e}` : n.symbol);
}
function ec(e, t = null) {
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
function Am(e, t) {
  var a, s, l;
  if (!t) return !1;
  const n = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (n == null ? void 0 : n.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return n === t || ((s = t.contains) == null ? void 0 : s.call(t, n)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || n === (o == null ? void 0 : o.body) && i === o.body;
}
function tc(e, t = document) {
  return !(e.defaultPrevented || ec(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function Mm(e, t = document, n = !1, o = {}) {
  return tc(e, t) ? Xl(e, n, o) != null : !1;
}
function nc(e, t, n = null) {
  return !(!t || e instanceof Element && (t.contains(e) || n != null && n.contains(e)));
}
function Pt(e, { onCancel: t, onConfirm: n } = {}) {
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
function rc(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const n = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !n || n.value.trim() !== String(t || "").trim() || (s = n.getAttribute) != null && s.call(n, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function oc({ confirm: e, cancel: t, confirmReady: n }) {
  const o = n && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function Uo({ confirmRef: e, cancelRef: t, confirmReady: n }) {
  ye(() => {
    const o = requestAnimationFrame(() => oc({
      confirm: e.current,
      cancel: t == null ? void 0 : t.current,
      confirmReady: n
    }));
    return () => cancelAnimationFrame(o);
  }, [n]);
}
function Jt(e) {
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
function zi(e, t) {
  const n = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < n ? i.filter((a) => a.sequence > o && a.sequence <= n).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > n && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function Ko(e, t = !0) {
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
    identity: Ko(e, t),
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
function Ft(e, t = !0) {
  return {
    type: "segments",
    segments: (e || []).map((n) => ({
      identity: Ko(n, t),
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
      originalIdentity: Ko(n),
      collectedIdentity: {
        itemId: (o == null ? void 0 : o.itemId) ?? (i == null ? void 0 : i.itemId) ?? null,
        nativeSegmentId: (o == null ? void 0 : o.nativeSegmentId) ?? null,
        published: (o == null ? void 0 : o.nativeSegmentId) != null,
        revision: (o == null ? void 0 : o.revision) ?? null
      }
    }))
  };
}
function Hr(e) {
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
function qa(e, t) {
  return (e || []).filter((n) => n.segmentId === t).sort((n, o) => n.sortOrder - o.sortOrder || String(n.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function Wa(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e || []) {
    const o = t.get(n.segmentId);
    o ? o.push(n) : t.set(n.segmentId, [n]);
  }
  for (const n of t.values())
    n.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function zo(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((n) => Number(n.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function ic(e, t) {
  const n = (t || []).map((i) => qa(e, i.id));
  if (n.length === 0 || n.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: Lt(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return n.every((i) => o(i) === o(n[0])) ? n : null;
}
function ac(e, t) {
  return new Set((t || []).map((n) => n.tagId)).size !== 1 ? null : ic(e, t);
}
function sc({ mergeable: e, reviewable: t, tagEditable: n = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    n ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function Dm(e, t) {
  return zo(qa(e, t));
}
function Lt(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function lc(e, t) {
  const n = (d) => Lt(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
    const c = /* @__PURE__ */ new Map();
    for (const u of d || []) {
      const g = n(u);
      c.has(g) || c.set(g, []), c.get(g).push(u);
    }
    return c;
  }, a = i(e), s = i(t), l = [];
  for (const [d, c] of a) {
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
function dc(e, t, n) {
  if (!e || (e.slotMappings || []).length > 0)
    return e;
  const o = lc(t, n);
  return o.length === 0 ? e : { ...e, slotMappings: o };
}
function Pr(e, t, n, o) {
  var s;
  const i = (s = t == null ? void 0 : t[n]) == null ? void 0 : s[o], a = new Set((t || []).filter((l, d) => d !== n).map((l) => l[o]).filter(Boolean));
  return (e || []).filter((l) => l.id === i || !a.has(l.id));
}
function cc(e) {
  const t = Lt(e), n = Number(e == null ? void 0 : e.performerId), o = n > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${n}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(Qr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function Qr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function qr(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const n of e)
    Object.hasOwn(t, n.reviewState) && (t[n.reviewState] += 1);
  return t;
}
function _i(e) {
  const t = [], n = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((u) => u.end <= s && u.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: n,
    counts: qr(o),
    trackCount: Math.max(1, t.length)
  };
}
function uc(e) {
  const t = e.map(Lt), n = /* @__PURE__ */ new Map();
  for (const i of t) n.set(i, (n.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), n.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function mc(e, t) {
  const n = e.segments.map((l) => {
    const d = t.get(l.id) || [], u = d.length > 0 && d.every((g) => Number(g.performerId) > 0) ? d.map((g) => `${g.slotDefinitionId}:${Number(g.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: u };
  }), o = [...new Set(n.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [_i({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = uc(l.slots), u = l.slots.filter((b) => !a.has(String(b.slotDefinitionId))), g = o.length === 1 ? l.slots : u, y = g.map((b) => `${c.get(String(b.slotDefinitionId))} · ${b.performerName || `Performer ${b.performerId}`}`).join(" · "), h = [...new Map(g.map((b) => [
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
          performerLabel: y,
          performers: h,
          performerAssignments: p,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(_i);
}
function vn(e, t = [], n = []) {
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
      const u = o.get(s.tagId);
      i.set(d, {
        key: d,
        tagId: s.tagId,
        label: l,
        // A segment shown with a new tag has no sort name yet; the group catalog knows it.
        tagSortName: s.tagSortName || (u == null ? void 0 : u.tagSortName) || null,
        segmentGroupId: (u == null ? void 0 : u.segmentGroupId) ?? null,
        segmentGroupName: (u == null ? void 0 : u.segmentGroupName) ?? null,
        segmentGroupColor: (u == null ? void 0 : u.segmentGroupColor) ?? null,
        segmentGroupSortOrder: (u == null ? void 0 : u.segmentGroupSortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (u == null ? void 0 : u.segmentGroupTagSortOrder) ?? Number.MAX_SAFE_INTEGER,
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => mc(s, a));
}
function _o(e) {
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
    for (const s of Mt)
      a.counts[s] += Number((n = o.counts) == null ? void 0 : n[s]) || 0;
  }
  return t;
}
function Va(e) {
  return (e || []).some((t) => t.id != null);
}
const gc = {
  group: 38,
  lane: 33,
  segment: 41
};
function fc(e, t = []) {
  const n = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = gc[s.kind];
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
function Ja(e, t, n, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(n)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function pc(e, t = [], n = !0) {
  const o = new Set(t || []), i = [];
  let a = 0;
  const s = (l, d) => {
    i.push({ ...l, top: a, height: d }), a += d;
  };
  for (const l of e || [])
    if (n && s({ kind: "group", key: `header:${l.key}`, group: l }, 32), !o.has(l.key))
      for (const [d, c] of (l.lanes || []).entries()) {
        const u = Math.max(1.75, c.trackCount * 1.25 + 0.5) * 16;
        s({ kind: "lane", key: c.key, group: l, lane: c, laneIndex: d }, u);
      }
  return { rows: i, height: a };
}
function yc(e, t) {
  const n = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => n.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: qr(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return _o(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: qr(a)
    };
  });
}
function Ya(e, { nativeOnly: t = !1 } = {}) {
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
function Hi(e, t) {
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
function dn(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function gr(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function bc(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var n;
    return (n = t[0]) == null ? void 0 : n.toUpperCase();
  }).join("") || "?";
}
function fr({ performer: e, compact: t = !1, tooltip: n = null }) {
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
    }, o ? bc(e.name) : "—"),
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
function Qa({ assignments: e, className: t = "" }) {
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
      r(fr, {
        key: `${n.key}:avatar`,
        performer: n.performer
      })
    ];
  }));
}
function Xr({ performers: e, performerAssignments: t, interactive: n = !0 }) {
  const o = ue(null), i = `performer-slots-${Fa()}`, [a, s] = G(null);
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
  ye(() => {
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
    ...e.slice(0, 3).map((c) => r(fr, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? al(r("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, r(Qa, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : r("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => r(fr, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function hc(e, t) {
  const n = new Set(dn(t));
  return (e || []).filter((o) => !n.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function Xa(e, t) {
  return t ? dn(e).filter((n) => n !== t) : dn(e);
}
function vc(e, t) {
  const n = dn(t), o = new Set(dn(e));
  return n.length > 0 && n.every((i) => o.has(i)) ? [] : n;
}
function zt(e, t) {
  const n = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return n ? n.segmentGroupId == null ? "ungrouped" : `group:${n.segmentGroupId}` : null;
}
function qi(e, t, n) {
  const o = Number(n);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), u = Number.isFinite(c) && c >= d ? c : d, g = d <= o && u >= o, y = g ? 0 : Math.min(Math.abs(o - d), Math.abs(o - u));
    return { contains: g, distance: y, duration: u - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function Co(e, t, n, o = null) {
  var u, g, y, h, p, b;
  const i = e.findIndex((k) => k.markers.some((I) => I.segment.id === t));
  if (i < 0) {
    const k = [...((u = e[0]) == null ? void 0 : u.markers) || []];
    return o != null && Number.isFinite(Number(o)) && k.sort((I, f) => qi(I, f, o)), ((g = k[0]) == null ? void 0 : g.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((k) => k.segment.id === t);
  if (n === "left" || n === "right") {
    const k = n === "left" ? -1 : 1, I = Math.min(a.markers.length - 1, Math.max(0, s + k));
    return ((y = a.markers[I]) == null ? void 0 : y.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (n === "up" ? -1 : 1))), d = Number((h = a.markers[s]) == null ? void 0 : h.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((p = a.markers[s]) == null ? void 0 : p.segment) ?? null : ((b = [...e[l].markers].sort(c ? (k, I) => qi(k, I, Number(o)) : (k, I) => Math.abs(k.segment.startSec - d) - Math.abs(I.segment.startSec - d) || k.segment.startSec - I.segment.startSec || k.segment.id - I.segment.id)[0]) == null ? void 0 : b.segment) ?? null;
}
function Sc(e, t, n) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = Co([o], t, n);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function xc(e, t, n) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + n))];
}
function kc(e, t, n) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(n) ? n : e[0];
}
function wc(e, t) {
  const n = Number(e);
  if (!Number.isFinite(n)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= n) return [Ji(n)];
  const i = o - n, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(n, o - 1e-3);
  return [...new Set(a.map((l) => Ji(Math.min(s, n + l))))];
}
function Nc(e, t) {
  const n = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: n.length > 0 && n.every(i) ? "remove" : "collect",
    segments: n
  };
}
function Ic(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function sn(e, t) {
  if (!e || !t) return e;
  const n = new Set(t.removedSegmentIds || []), o = new Map(
    (t.identityChanges || []).map((u) => [u.previousId, u.currentId])
  ), i = new Map(
    [...t.upsertedSegments || [], ...t.upsertedBasicSegments || []].map((u) => [u.id, u])
  ), a = (e.segments || []).filter((u) => !n.has(u.id)).map((u) => i.has(u.id) ? { ...u, ...i.get(u.id) } : u), s = new Set(a.map((u) => u.id));
  for (const u of i.values())
    s.has(u.id) || a.push(u);
  a.sort((u, g) => Number(u.startSec) - Number(g.startSec) || String(u.key || "").localeCompare(String(g.key || "")));
  const l = t.performerSlots != null ? new Set(i.keys()) : /* @__PURE__ */ new Set(), d = (e.performerSlots || []).filter((u) => !n.has(u.segmentId) || o.has(u.segmentId)).map((u) => o.has(u.segmentId) ? { ...u, segmentId: o.get(u.segmentId) } : u).filter((u) => !l.has(u.segmentId));
  t.performerSlots != null && d.push(...t.performerSlots);
  const c = {};
  for (const [u, g] of Object.entries(
    e.performerSlotRevisions || {}
  )) {
    const y = Number(u);
    if (n.has(y) && !o.has(y)) continue;
    const h = o.get(y) ?? y;
    l.has(h) || (c[h] = g);
  }
  return t.performerSlotRevisions != null && Object.assign(c, t.performerSlotRevisions), {
    ...e,
    approvedSetVersion: t.approvedSetVersion || e.approvedSetVersion,
    segments: a,
    performerSlots: d,
    performerSlotRevisions: c
  };
}
function Wi(e, t, n) {
  const o = Array.isArray(e) ? e : [];
  if (!n) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function Cc(e) {
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
async function $c(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const n = document.createElement("video");
  n.preload = "auto", n.muted = !0, n.playsInline = !0, n.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(n);
  try {
    if (n.src = `/api/stream/video/${encodeURIComponent(e)}`, await Vi(n, "loadeddata"), !n.videoWidth || !n.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = n.videoWidth, o.height = n.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], u = wc(
        d.startSec,
        d.endSec
      );
      for (const [g, y] of u.entries()) {
        Math.abs(n.currentTime - y) > 5e-4 && (n.currentTime = y, await Vi(n, "seeked")), i.drawImage(n, 0, 0, o.width, o.height);
        const h = await Tc(o), p = `example-${l + 1}-frame-${g + 1}`;
        c.push({ fieldName: p, timestampSec: y }), s.push({
          fieldName: p,
          file: new File(
            [h],
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
    n.pause(), n.removeAttribute("src"), n.load(), n.remove();
  }
}
function Vi(e, t) {
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
function Tc(e) {
  return new Promise((t, n) => {
    e.toBlob(
      (o) => o ? t(o) : n(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function Ji(e) {
  return Math.round(e * 1e3) / 1e3;
}
function Om(e, t, n) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...n } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Rc(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((n, o) => n.startSec - o.startSec || n.id - o.id)
  };
}
function Pm(e, t) {
  const n = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !n.has(o.id))
  };
}
function Lm(e, t, n) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? n.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function jm(e, t) {
  const n = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...n.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Gn(e, t, n, o) {
  const i = (n || []).map((d) => ({ ...d, segmentId: t })), a = e.performerSlots || [], s = a.findIndex((d) => d.segmentId === t), l = a.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...i), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function yo(e, t) {
  const n = e.performerSlots || [], o = e.performerSlotRevisions || {};
  if (!n.some((s) => s.segmentId === t) && !(t in o)) return e;
  const { [t]: i, ...a } = o;
  return {
    ...e,
    performerSlots: n.filter((s) => s.segmentId !== t),
    performerSlotRevisions: a
  };
}
function Ec(e, t) {
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
function Kn(e, t) {
  return !e || !t ? !1 : e.itemId != null && e.itemId === t.itemId || e.nativeSegmentId != null && e.nativeSegmentId === t.nativeSegmentId ? !0 : e.id != null && e.id === t.id;
}
function Zr(e, t) {
  return (e || []).some((n) => (t || []).some((o) => Kn(n, o)));
}
function pt(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function Za(e, t) {
  return (e || []).find((n) => Kn(t, n)) || null;
}
function es(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Ac(e, t) {
  var n;
  return ((n = e.running) == null ? void 0 : n.kind) === t;
}
function Fm(e) {
  return e.running != null || e.queued.length > 0;
}
const Mc = /* @__PURE__ */ new Set(["segment", "split", "create", "duplicate", "review", "held-tag"]);
function Ho(e) {
  return e.running ? [e.running, ...e.queued] : e.queued;
}
function $o(e) {
  return Ho(e).some((t) => t.kind === "create" || t.kind === "duplicate");
}
function jn(e) {
  return Ho(e).some((t) => !Mc.has(t.kind));
}
function Ur(e) {
  return e != null && e.itemId == null && e.nativeSegmentId == null && e.id < 0;
}
function Dc(e, t) {
  if (jn(e) || (t || []).some(Ur)) return !0;
  const n = (t || []).map(pt);
  return Ho(e).some((o) => Zr(o.targets, n));
}
const Yi = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
function Lr(e) {
  return Object.freeze({
    id: e.id,
    kind: e.kind,
    lockId: e.lockId,
    targets: e.targets,
    exclusive: e.exclusive,
    meta: e.meta
  });
}
function Oc({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let n = 1, o = null, i = [], a = null, s = !1, l = 0, d = 0;
  const c = () => !t && d < l, u = /* @__PURE__ */ new Map();
  let g = Yi;
  const y = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set();
  let p = [];
  function b() {
    g = o == null && i.length === 0 && a == null ? Yi : Object.freeze({
      running: o ? Lr(o) : null,
      queued: Object.freeze(i.map(Lr)),
      lastFailure: a
    });
    for (const w of [...h]) w();
    if (o == null && i.length === 0) {
      const w = p;
      p = [];
      for (const C of w) C();
    }
  }
  function k(w, C) {
    y.set(w.id, C.status), w.resolve(C);
  }
  function I(w) {
    if (w.dependsOn == null) return "met";
    const C = y.get(w.dependsOn);
    return C === "fulfilled" ? "met" : C != null ? "failed" : "pending";
  }
  function f(w) {
    o = w;
    const C = { ...e(), taskId: w.id, targets: w.targets };
    C.resolveTargets = () => w.targets.map((K) => Za(C.segments, K)).filter(Boolean), b();
    let E;
    try {
      E = w.run(C);
    } catch (K) {
      E = Promise.reject(K);
    }
    Promise.resolve(E).then(
      (K) => D(w, { status: "fulfilled", value: K }),
      (K) => D(w, { status: "rejected", error: K })
    );
  }
  function D(w, C) {
    w.settled || (w.settled = !0, k(w, C), !s && (o = null, C.status === "rejected" && (a = Object.freeze({ id: w.id, kind: w.kind, error: C.error })), b(), l += 1, t && J()));
  }
  function J() {
    if (s || o != null || c()) return;
    let w = !1;
    for (let C = 0; C < i.length; C += 1) {
      const E = i[C], K = I(E);
      if (K === "failed") {
        i = i.filter((O) => O !== E), k(E, { status: "dropped", reason: "dependency-failed" }), w = !0, C -= 1;
        continue;
      }
      if (K !== "pending" && !(E.exclusive && C > 0) && !i.slice(0, C).some((O) => Zr(O.targets, E.targets)) && !(E.ready && !E.ready(e(), Lr(E)))) {
        i = i.filter((O) => O !== E), f(E);
        return;
      }
    }
    w && b();
  }
  function Y(w) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((U) => U.exclusive) || o != null && w.whenBusy !== "enqueue" || w.exclusive && (o != null || i.length > 0 || c())) return null;
    let E;
    const K = new Promise((U) => {
      E = U;
    }), O = {
      id: n++,
      kind: w.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: w.lockId ?? -1,
      targets: Object.freeze((w.targets || []).map(P)),
      exclusive: w.exclusive === !0,
      dependsOn: w.dependsOn ?? null,
      ready: w.ready || null,
      meta: w.meta ?? null,
      run: w.run,
      resolve: E
    };
    return i = [...i, O], b(), J(), { id: O.id, done: K };
  }
  function A(w = {}) {
    let C = null;
    const E = Y({
      ...w,
      whenBusy: "reject",
      run: () => new Promise((O) => {
        C = O;
      })
    });
    if (!E) return null;
    if (C == null)
      return S((O) => O.id === E.id), null;
    let K = !1;
    return () => {
      K || (K = !0, C(), (o == null ? void 0 : o.id) === E.id && D(o, { status: "fulfilled", value: void 0 }));
    };
  }
  function P(w) {
    return (w == null ? void 0 : w.id) == null || w.itemId != null || w.nativeSegmentId != null ? w : u.get(w.id) || w;
  }
  function R(w, C) {
    u.set(w, { ...C });
    let E = !1;
    for (const K of i)
      K.targets.some((O) => O.id === w && O.itemId == null && O.nativeSegmentId == null) && (K.targets = Object.freeze(K.targets.map((O) => O.id === w ? { ...C } : O)), E = !0);
    return E && b(), E;
  }
  function S(w) {
    const C = i.filter((E) => w(Lr(E)));
    if (C.length === 0) return 0;
    i = i.filter((E) => !C.includes(E));
    for (const E of C) k(E, { status: "cancelled" });
    return b(), J(), C.length;
  }
  return {
    enqueue: Y,
    acquire: A,
    cancel: S,
    retarget: R,
    stableIdentity: P,
    // The host reads `settledCount()` while rendering and reports it here once that render commits.
    settledCount: () => l,
    markCommitted(w = l) {
      d = Math.max(d, w);
    },
    poke: () => J(),
    subscribe(w) {
      return h.add(w), () => h.delete(w);
    },
    getSnapshot: () => g,
    whenIdle() {
      return o == null && i.length === 0 ? Promise.resolve() : new Promise((w) => p.push(w));
    },
    dispose() {
      if (s) return;
      const w = i;
      i = [], s = !0;
      for (const E of w) k(E, { status: "cancelled" });
      h.clear();
      const C = p;
      p = [];
      for (const E of C) E();
    }
  };
}
let Pc = 1;
function Et() {
  return `pending-${Pc++}`;
}
function Lc(e) {
  return e.sort((t, n) => t.startSec - n.startSec || t.id - n.id);
}
function Kr(e, t) {
  return (t || []).some((n) => Kn(n, e));
}
function jc(e, t) {
  return [...e || [], {
    id: t.id ?? Et(),
    taskId: t.taskId ?? null,
    op: t.op,
    targets: t.targets || (t.segment ? [{ id: t.segment.id }] : []),
    values: t.values || null,
    segment: t.segment || null,
    meta: t.meta || null,
    settled: !1
  }];
}
function ts(e, t) {
  return t && (e || []).find((n) => {
    var o;
    return ((o = n.meta) == null ? void 0 : o.kind) === "held-tag" && !n.settled && Kr(t, n.targets);
  }) || null;
}
function Fc(e) {
  return (e || []).filter((t) => t.op === "insert" && !t.settled).map((t) => t.segment);
}
function ns(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function rs(e, t) {
  const n = (e || []).filter((o) => !ns(o, t));
  return n.length === (e || []).length ? e : n;
}
function os(e, t) {
  let n = !1;
  const o = (e || []).map((i) => i.settled || !ns(i, t) ? i : (n = !0, { ...i, settled: !0, settledDetail: null }));
  return n ? o : e;
}
function Gc(e, t, n) {
  let o = !1;
  const i = (e || []).map((a) => a.targets.some((s) => s.id === t && s.itemId == null && s.nativeSegmentId == null) ? (o = !0, {
    ...a,
    targets: a.targets.map((s) => s.id === t ? { ...n } : s)
  }) : a);
  return o ? i : e;
}
function qo(e, t) {
  if (!t || t.length === 0) return e;
  let n = [...e || []];
  for (const o of t)
    if (o.op === "insert")
      n.some((i) => Kn(o.segment, i)) || n.push(o.segment);
    else if (o.op === "patch")
      n = n.map((i) => Kr(i, o.targets) ? { ...i, ...o.values } : i);
    else if (o.op === "remove")
      n = n.filter((i) => !Kr(i, o.targets));
    else if (o.op === "merge") {
      const [i, ...a] = o.targets;
      n = n.filter((s) => !Kr(s, a)).map((s) => Kn(i, s) ? { ...s, ...o.values } : s);
    }
  return Lc(n);
}
function is(e, t) {
  if (!e || e.length === 0) return e;
  const n = [
    ...(t == null ? void 0 : t.segments) || [],
    ...e.filter((a) => a.op === "insert" && !a.settled).map((a) => a.segment)
  ];
  let o = !1;
  const i = [];
  for (const a of e) {
    if (a.op !== "insert" && !a.targets.some((s) => n.some((l) => Kn(s, l)))) {
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
function Bc(e, t, n) {
  return n ? rs(e, t) : os(e, t);
}
function Uc(e, t) {
  switch (t.type) {
    case "confirm":
      return Bc(e, t.key, t.applied);
    case "add":
      return jc(e, t.entry);
    case "discard":
      return rs(e, t.key);
    case "settle":
      return os(e, t.key);
    case "retarget":
      return Gc(e, t.temporaryId, t.identity);
    case "prune":
      return is(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
function Qi(e, t, n) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function Kc(e) {
  const { acquireSaveLock: t, compatibilityMode: n, getRequestedSelectionId: o, dispatchPendingChanges: i, displayedSelectedSegment: a, enqueueSave: s, getSaveQueueSnapshot: l, pendingChanges: d, retargetSaveTasks: c, currentTime: u, detail: g, editorFilters: y, endInput: h, hideDerivedSegments: p, historyRef: b, mediaDuration: k, onConflict: I, onDetailChange: f, onReload: D, optimisticSegmentIdRef: J, pendingDuplicateRef: Y, pendingFirstSegmentStartSecRef: A, pendingTagEditSegmentIdRef: P, performerSlots: R, replaceSegmentSelection: S, savingSegmentId: w, segments: C, selectedSegment: E, selectedSegmentIdRef: K, selectedSegments: O, selectionAnchorIdRef: U, selectionRangeBaseIdsRef: Z, setCreatingSegmentId: L, setEditorFilters: Q, setFirstSegmentTagOpen: se, setHideDerivedSegments: ie, setHistory: ve, setHistoryOpen: ge, setPublishApprovedError: Me, setSaveMessage: W, setSelectedSegmentGroupKey: X, setSelectedSegmentId: me, setSelectedSegmentIds: Se, setTagEditing: ke, startInput: be, tagEditingRef: _, timelineDuration: we, video: le } = e;
  function N($) {
    b.current = $ || Xt, ve(b.current);
  }
  async function j($, q, fe, he, te = null) {
    var Ke;
    try {
      const Te = await ne(`/videos/${le.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: b.current.revision,
          kind: $,
          label: q,
          beforeState: fe,
          afterState: he,
          receiptId: te
        })
      });
      return N(Te), !0;
    } catch (Te) {
      return Te.status === 409 && ((Ke = Te.payload) != null && Ke.current) && N(Te.payload.current), W("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function x($, q, fe = !0, he = null, te = !1, Ke = q, Te = !0) {
    if (!$ || Ur($) || jn(l())) return null;
    const [Ce = $] = qo([$], (d || []).filter((ot) => ot.op !== "insert")), Oe = Object.fromEntries(Object.entries(q).filter(([ot, Pe]) => Pe !== Ce[ot])), _e = te ? Et() : null, gt = o == null ? void 0 : o();
    _e && i({
      type: "add",
      entry: {
        id: _e,
        op: "patch",
        targets: [pt($)],
        values: Ke === q ? Oe : Ke
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
          return _e && i({ type: "discard", key: _e }), W("The segment changed before its save could run."), null;
        const rt = Object.fromEntries(Object.keys(q).map((xt) => [xt, Pe[xt]]));
        return v(Pe, { ...rt, ...Oe }, {
          recordHistory: fe,
          historyLabel: he,
          pendingChangeId: _e,
          restoreSelectionOnFailure: Te,
          requestedSelectionId: gt
        });
      }
    });
    if (!Ge)
      return _e && i({ type: "discard", key: _e }), null;
    const ft = await Ge.done;
    return ft.status !== "fulfilled" ? (_e && i({ type: "discard", key: _e }), null) : ft.value ?? null;
  }
  async function v($, q, {
    recordHistory: fe = !0,
    historyLabel: he = null,
    optimisticValues: te = null,
    pendingChangeId: Ke = null,
    restoreSelectionOnFailure: Te = !0,
    // The selection when the edit was requested, which a queued save captures before it waits.
    requestedSelectionId: Ce = o == null ? void 0 : o(),
    onReload: Oe = D,
    onConflict: _e = I
  } = {}) {
    var xt;
    const gt = O.map((lt) => lt.id), Ge = (E == null ? void 0 : E.id) ?? K.current, ft = fe && !n ? crypto.randomUUID() : null;
    W(fe ? "Saving directly to Cove…" : "Restoring history…");
    const ot = Ke ?? (te ? Et() : null);
    te && !Ke && i({
      type: "add",
      entry: { id: ot, op: "patch", targets: [pt($)], values: te }
    });
    const Pe = (lt) => {
      ot && i({ type: "confirm", key: ot, applied: lt });
    }, rt = async (lt) => {
      if (lt) {
        f((ht) => sn(ht, lt), le.id), Pe(!0);
        return;
      }
      Pe(await Oe() != null);
    };
    try {
      if (n && $.nativeSegmentId == null && $.itemId != null) {
        const it = `draft-update:${le.id}:${$.itemId}:${$.revision}:${q.tagId}:${q.startSec}:${q.endSec ?? "open"}:${q.reviewState ?? $.reviewState}`, B = await ne(`/videos/${le.id}/drafts/${$.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Je(it),
            expectedRevision: $.revision,
            startSec: q.startSec,
            endSec: q.endSec,
            tagId: q.tagId,
            reviewState: q.reviewState
          })
        });
        Ye(it), B.performerSlots != null && f((de) => Gn(de, $.id, B.performerSlots, B.performerSlotRevision), le.id);
        const ee = {
          ...$,
          ...B.draft,
          id: $.id,
          itemId: $.itemId
        };
        return fe && await j(
          "segment.update",
          he || "Changed segment",
          Dr($, n),
          Dr(
            ee,
            n
          )
        ), Qi($, q, n) ? await rt(B.editorDelta) : (f((de) => ({
          ...de,
          approvedSetVersion: B.approvedSetVersion || de.approvedSetVersion,
          segments: (de.segments || []).map((pe) => pe.id === $.id ? ee : pe).sort((pe, ce) => pe.startSec - ce.startSec || pe.id - ce.id)
        }), le.id), Pe(!0)), W(((xt = B.draft) == null ? void 0 : xt.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), ee;
      }
      const { editorDelta: lt, ...ht } = await ne(`/videos/${le.id}/segments/${$.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...q,
          expectedUpdatedAt: $.updatedAt,
          historyReceiptId: ft
        })
      }), Xe = {
        ...$,
        ...ht,
        reviewState: q.reviewState ?? $.reviewState
      };
      return Qi($, q, n) ? await rt(lt) : (f((it) => ({
        ...it,
        segments: (it.segments || []).map((B) => B.id === $.id ? Xe : B).sort((B, ee) => B.startSec - ee.startSec || B.id - ee.id)
      }), le.id), Pe(!0)), fe && await j(
        "segment.update",
        he || "Changed segment",
        Dr($, n),
        Dr(
          Xe,
          n
        ),
        ft
      ), W(fe ? "Saved to Cove" : "History restored"), Xe;
    } catch (lt) {
      return ot && i({ type: "discard", key: ot }), ot && Te && (o == null || o() === Ce) && (Se(gt), me(Ge), U.current = Ge, Z.current = []), lt.status === 409 ? (W("Conflict — loading the latest segment…"), await _e()) : W(lt.message || "Unable to save the segment."), null;
    }
  }
  async function m() {
    if (!n) return !1;
    const $ = C.filter((he) => Jr(he)).length;
    if ($ === 0 || w != null) return !1;
    const q = `complete-review:${le.id}:${g.approvedSetVersion}`, fe = t("publish", -1);
    if (!fe) return !1;
    Me(""), W(`Publishing ${$} Approved draft${$ === 1 ? "" : "s"}…`);
    try {
      const he = await ne(`/videos/${le.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(q),
          expectedApprovedSetVersion: g.approvedSetVersion
        })
      });
      Ye(q), N(Xt), ge(!1);
      const te = await D(), Ke = ld(
        C,
        K.current,
        he.published
      ), Te = Ke ? mt(te == null ? void 0 : te.segments, Ke) : null;
      return Te && me(Te.id), W(`${he.published.length} Approved draft${he.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (he) {
      const te = he.status === 409 ? "The approved drafts changed. Review the updated list and try again." : he.message || "Unable to publish the approved drafts.";
      return he.status === 409 && await I(), Me(te), W(te), !1;
    } finally {
      fe();
    }
  }
  async function T($, q, fe) {
    return $ ? (f((he) => sn(he, $), le.id), sn(q, $)) : fe();
  }
  async function V($ = null, q = null) {
    const fe = l();
    if (jn(fe) || $o(fe) || ae()) return;
    const he = $ != null ? A.current : null, te = Number.isFinite(he) ? he : u, Ke = Math.min(we, te + 20);
    if (Ke <= te) {
      W("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const Te = od(C, E, $);
    if (Te.kind === "choose-tag") {
      A.current = te, W(""), se(!0);
      return;
    }
    if (Te.kind === "invalid-selection") {
      W("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: Ce } = Te, Oe = `create-draft:${le.id}:${Ce}:${te}`, _e = n ? null : crypto.randomUUID(), gt = K.current, Ge = {
      ...E || {},
      id: J.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: Ce,
      tagName: q || (E == null ? void 0 : E.tagName) || "Tag segment",
      tagSortName: Ce === (E == null ? void 0 : E.tagId) && (E == null ? void 0 : E.tagSortName) || null,
      startSec: te,
      endSec: Ke,
      // Full mode creates manual drafts already approved; match it so a queued review toggles as displayed.
      reviewState: n ? "approved" : "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, ft = Rc(g, Ge), ot = zt(
      vn(ft.segments, ft.segmentGroups || [], ft.performerSlots || []),
      Ge.id
    ), Pe = Et(), rt = s({
      kind: "create",
      lockId: -1,
      whenBusy: "enqueue",
      run: (ht) => lt(ht)
    });
    if (!rt) return;
    i({ type: "add", entry: { id: Pe, taskId: rt.id, op: "insert", segment: Ge } }), se(!1), Te.openTagEditor && (L(Ge.id), P.current = Ge.id, ke(!0)), S(Ge.id), X(ot), (await rt.done).status === "cancelled" && (i({ type: "discard", key: Pe }), L(null), K.current === Ge.id && S(gt));
    async function lt({ detail: ht, onReload: Xe }) {
      var it;
      try {
        let B, ee = null;
        if (n) {
          const ce = await ne(`/videos/${le.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: Je(Oe), tagId: Ce, startSec: te, endSec: Ke })
          });
          Ye(Oe), B = { itemId: (it = ce.draft) == null ? void 0 : it.itemId }, ee = ce.editorDelta ?? null, ce.performerSlots != null && !ee && f((De) => Gn(De, Ge.id, ce.performerSlots, ce.performerSlotRevision), le.id);
        } else
          B = { nativeSegmentId: (await ne(`/videos/${le.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: Ce,
              startSec: te,
              endSec: Ke,
              historyReceiptId: _e
            })
          })).id };
        A.current = null, se(!1);
        const de = await T(ee, ht, Xe);
        if (i({ type: "discard", key: Pe }), !de) {
          f((ce) => yo(ce, Ge.id), le.id), K.current === Ge.id && S(gt), W(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${Te.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const pe = mt(de == null ? void 0 : de.segments, B);
        pe ? (i({ type: "retarget", temporaryId: Ge.id, identity: pt(pe) }), c(Ge.id, pt(pe)), Te.openTagEditor && (_.current && (P.current = pe.id), L(pe.id)), K.current === Ge.id && (S(pe.id), X(zt(
          vn(de.segments || [], de.segmentGroups || [], de.performerSlots || []),
          pe.id
        ))), n || await j(
          "segment.create",
          "Created segment",
          Ft([], !1),
          Ft([pe], !1),
          _e
        )) : (ke(!1), W(`Segment created, but it could not be selected${Te.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (B) {
        throw i({ type: "discard", key: Pe }), f((ee) => yo(ee, Ge.id), le.id), K.current === Ge.id && S(gt), $ != null && se(!0), W(B.message || "Unable to create the draft."), B;
      } finally {
        L(null);
      }
    }
  }
  function ae() {
    return ts(d, E) ? (W("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function re() {
    if (O.length !== 1 || !E || Ur(E) || jn(l()) || ae()) return;
    const $ = (a == null ? void 0 : a.id) === E.id ? a : E, q = u;
    if (q <= $.startSec || $.endSec != null && q >= $.endSec) {
      W("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const fe = pt(E), he = {
      ...$,
      id: J.current--,
      itemId: null,
      nativeSegmentId: null,
      startSec: q,
      endSec: $.endSec,
      revision: 0,
      updatedAt: null
    }, te = Et(), Ke = Et();
    i({ type: "add", entry: { id: te, op: "patch", targets: [fe], values: { endSec: q } } }), i({ type: "add", entry: { id: Ke, op: "insert", segment: he } });
    const Te = () => {
      i({ type: "discard", key: te }), i({ type: "discard", key: Ke });
    }, Ce = s({
      kind: "split",
      lockId: E.id,
      targets: [fe],
      whenBusy: "enqueue",
      run: (gt) => _e(gt)
    });
    if (!Ce) {
      Te();
      return;
    }
    (await Ce.done).status !== "fulfilled" && Te();
    async function _e({ detail: gt, resolveTargets: Ge, onReload: ft, onConflict: ot }) {
      var ht;
      const [Pe] = Ge();
      if (!Pe || q <= Pe.startSec || Pe.endSec != null && q >= Pe.endSec) {
        Te(), W(Pe ? "The segment changed before the split could run; move the playhead inside it and split again." : "The segment changed before the split could run.");
        return;
      }
      const rt = `split-draft:${Pe.itemId}:${Pe.revision}:${q}`, xt = n ? null : Ft([Pe], !1), lt = n ? null : crypto.randomUUID();
      try {
        let Xe, it;
        if (n && Pe.nativeSegmentId == null) {
          const de = await ne(`/videos/${le.id}/drafts/${Pe.itemId}/split`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Je(rt),
              expectedRevision: Pe.revision,
              splitSec: q
            })
          });
          Ye(rt), Xe = { itemId: (ht = de.createdDraft) == null ? void 0 : ht.itemId }, it = de.editorDelta ?? null;
        } else {
          const de = await ne(`/videos/${le.id}/segments/${Pe.id}/split`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: Pe.updatedAt,
              splitSec: q,
              historyReceiptId: lt
            })
          });
          Xe = { nativeSegmentId: de.id }, it = de.editorDelta ?? null;
        }
        const B = await T(it, gt, ft), ee = mt(B == null ? void 0 : B.segments, Xe);
        if (ee ? (i({ type: "retarget", temporaryId: he.id, identity: pt(ee) }), c(he.id, pt(ee)), K.current === he.id && S(ee.id)) : K.current === he.id && S(Pe.id), i({ type: "confirm", key: te, applied: B != null }), i({ type: "discard", key: Ke }), !n) {
          const de = [
            mt(B == null ? void 0 : B.segments, {
              nativeSegmentId: Pe.nativeSegmentId ?? Pe.id
            }),
            ee
          ].filter(Boolean);
          await j(
            "segment.split",
            "Split segment",
            xt,
            Ft(de, !1),
            lt
          );
        }
        W(n ? `Segment split; both ranges remain ${Pe.reviewState}.` : "Segment split.");
      } catch (Xe) {
        Te(), K.current === he.id && S(Pe.id), Xe.status === 409 ? await ot() : W(Xe.message || "Unable to split the draft.");
      }
    }
  }
  async function je($ = !1) {
    const q = l();
    if (O.length !== 1 || !E || Ur(E) || jn(q) || $o(q) || ae()) return;
    const fe = $ ? u : ((a == null ? void 0 : a.id) === E.id ? a : E).startSec, he = n ? null : crypto.randomUUID(), te = E, Ke = K.current, Te = (a == null ? void 0 : a.id) === te.id ? a : te, Ce = Te.endSec == null ? null : Te.endSec - Te.startSec, Oe = {
      ...te,
      id: J.current--,
      itemId: null,
      nativeSegmentId: null,
      startSec: fe,
      endSec: Ce == null ? null : fe + Ce,
      // Full mode creates the copy as an approved draft, even from a published segment; match it so a
      // queued review toggles as displayed and the copy waits for Publish approved like other drafts.
      reviewState: n ? "approved" : te.reviewState,
      published: n ? !1 : te.published,
      revision: 0,
      updatedAt: null
    }, _e = (R || []).filter((rt) => rt.segmentId === te.id), gt = Et(), Ge = () => {
      i({ type: "discard", key: gt }), _e.length > 0 && f((rt) => yo(rt, Oe.id), le.id);
    }, ft = s({
      kind: "duplicate",
      lockId: -1,
      targets: [pt(te)],
      whenBusy: "enqueue",
      run: (rt) => Pe(rt)
    });
    if (!ft) return;
    i({ type: "add", entry: { id: gt, taskId: ft.id, op: "insert", segment: Oe } }), _e.length > 0 && f((rt) => Gn(rt, Oe.id, _e), le.id), $ || (L(Oe.id), P.current = Oe.id, ke(!0)), S(Oe.id), (await ft.done).status === "cancelled" && (Ge(), L(null), K.current === Oe.id && S(Ke));
    async function Pe({ detail: rt, resolveTargets: xt, onReload: lt, onConflict: ht }) {
      var B, ee;
      const [Xe] = xt(), it = Xe ? rd(le.id, Xe, $, fe) : null;
      try {
        if (!Xe) throw new Error("The segment changed before the duplicate could run.");
        const de = ((B = Y.current) == null ? void 0 : B.operationKey) === it ? Y.current : null;
        let pe = (de == null ? void 0 : de.duplicateIdentity) ?? null, ce = null;
        if (pe == null && n) {
          const Le = Xe.nativeSegmentId == null ? `/videos/${le.id}/drafts/${Xe.itemId}/duplicate` : `/videos/${le.id}/segments/${Xe.nativeSegmentId}/duplicate-draft`, tt = await ne(Le, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Je(it),
              ...Xe.nativeSegmentId == null ? { expectedRevision: Xe.revision } : { expectedUpdatedAt: Xe.updatedAt },
              startSec: $ ? fe : null
            })
          });
          pe = Oi(!1, tt), ce = tt.editorDelta ?? null, Y.current = { operationKey: it, duplicateIdentity: pe };
        } else if (pe == null) {
          const Le = await ne(`/videos/${le.id}/segments/${Xe.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: Xe.updatedAt,
              startSec: $ ? fe : null,
              historyReceiptId: he
            })
          });
          pe = Oi(!0, Le), Y.current = { operationKey: it, duplicateIdentity: pe };
        }
        const De = await T(ce, rt, lt);
        Ge();
        const Ee = mt(De == null ? void 0 : De.segments, pe);
        if (!Ee) {
          K.current === Oe.id && (ke(!1), S(Ke)), W(De ? "Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection." : "Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.");
          return;
        }
        i({ type: "retarget", temporaryId: Oe.id, identity: pt(Ee) }), c(Oe.id, pt(Ee));
        const Qe = Sa(
          Ee,
          De.performerSlots || [],
          y,
          p,
          De.segmentGroups || []
        );
        Q(Qe.filters), ie(Qe.hideDerivedSegments), !$ && _.current && (P.current = Ee.id), K.current === Oe.id && (S(Ee.id), X(zt(
          vn(De.segments || [], De.segmentGroups || [], De.performerSlots || []),
          Ee.id
        ))), n && Ye(it), Y.current = null, W($ ? "Duplicate created at the playhead." : "Duplicate created in place."), n || await j(
          "segment.duplicate",
          "Duplicated segment",
          Ft([], !1),
          Ft([Ee], !1),
          he
        );
      } catch (de) {
        throw Ge(), K.current === Oe.id && (ke(!1), S(Ke)), it != null && ((ee = Y.current) == null ? void 0 : ee.operationKey) === it ? W("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : de.status === 409 ? await ht() : W(de.message || "Unable to duplicate the draft."), de;
      } finally {
        L(null);
      }
    }
  }
  async function H() {
    if (O.length !== 1 || !E) return;
    const $ = Number(be), q = h.trim() === "" ? null : Number(h), fe = Ii($, q, k);
    if (fe.error) {
      W(fe.error);
      return;
    }
    const he = (a == null ? void 0 : a.id) === E.id ? a : E;
    if ($ === he.startSec && q === he.endSec) {
      W("Timing is unchanged.");
      return;
    }
    await x(E, { startSec: $, endSec: q, tagId: he.tagId }, !0, null, !0);
  }
  async function F($, q) {
    if (O.length !== 1 || !E) return;
    const fe = Ii($, q, k);
    if (fe.error) {
      W(fe.error);
      return;
    }
    const he = (a == null ? void 0 : a.id) === E.id ? a : E;
    if ($ === he.startSec && q === he.endSec) {
      W("Timing is unchanged.");
      return;
    }
    await x(E, { startSec: $, endSec: q, tagId: he.tagId }, !0, null, !0);
  }
  return { acceptHistory: N, recordHistoryAction: j, mutateSegment: x, runSegmentMutation: v, completeReview: m, createSegment: V, splitSegment: re, duplicateSegment: je, saveTiming: H, applyShortcutTiming: F };
}
function zc() {
  const [e, t] = G(() => typeof window < "u" && window.matchMedia(ki).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const n = window.matchMedia(ki), o = () => t(n.matches);
    return o(), n.addEventListener("change", o), () => n.removeEventListener("change", o);
  }, []), e;
}
function _c() {
  const [e, t] = G(() => typeof window < "u" && window.matchMedia(wi).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const n = window.matchMedia(wi), o = () => t(n.matches);
    return o(), n.addEventListener("change", o), () => n.removeEventListener("change", o);
  }, []), e;
}
function Hc() {
  try {
    return $l(window.localStorage.getItem(da));
  } catch {
    return { ...Ot };
  }
}
function qc() {
  try {
    return dn(JSON.parse(window.localStorage.getItem(ca) || "[]"));
  } catch {
    return [];
  }
}
function Wc(e) {
  try {
    window.localStorage.setItem(ca, JSON.stringify(dn(e)));
  } catch {
  }
}
function Vc(e) {
  try {
    window.localStorage.setItem(da, JSON.stringify(e));
  } catch {
  }
}
function Jc() {
  try {
    const e = JSON.parse(window.localStorage.getItem(ma) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Yc(e) {
  try {
    return window.localStorage.setItem(ma, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Qc({ status: e }) {
  const t = Ha[e];
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
function ln({ counts: e }) {
  return r("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, Mt.map((t) => r("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...za(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${_t[t].symbol}${e[t]}`)));
}
function Xc({ videoId: e, segmentId: t, itemId: n, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: u, shortcutRef: g }) {
  const y = jo(a), [h, p] = G(() => po(o, y)), [b, k] = G(!1), [I, f] = G(""), D = ue(!1), J = o.map((w) => `${w.slotDefinitionId}:${w.performerId || ""}`).join("|"), Y = y.map((w) => yt(w)).join("|"), A = Da(
    o,
    y
  );
  ye(() => {
    p(po(o, y)), f("");
  }, [t, n, J, Y]);
  async function P(w = h) {
    if (!D.current) {
      D.current = !0, k(!0), f("Saving performer slots…");
      try {
        const C = po(o.map((O) => ({
          ...O,
          performerId: w[O.slotDefinitionId] || null
        })), y), E = o.map((O) => {
          const U = C[O.slotDefinitionId] ? Number(C[O.slotDefinitionId]) : null, Z = y.find((L) => String(yt(L)) === String(U));
          return {
            ...O,
            performerId: U,
            performerName: (Z == null ? void 0 : Z.name) || null
          };
        });
        if (s(E) === !1) {
          f("");
          return;
        }
        const K = await ne(n != null ? `/videos/${e}/drafts/${n}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((O) => ({ slotDefinitionId: O.slotDefinitionId, performerId: C[O.slotDefinitionId] ? Number(C[O.slotDefinitionId]) : null }))
          })
        });
        f("Performer slots saved."), await l(K, {
          beforeState: Hr([{
            segmentId: t,
            itemId: n,
            revision: i,
            slots: o
          }]),
          afterState: Hr([{
            segmentId: t,
            itemId: n,
            revision: K.revision,
            slots: K.slots || []
          }])
        });
      } catch (C) {
        d && await d(o, C), C.status === 409 ? (f("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : f(C.message || "Unable to save performer slots.");
      } finally {
        D.current = !1, k(!1);
      }
    }
  }
  function R(w, C) {
    f(`Option ${C + 1} applied; save to confirm.`), p({ ...h, ...w.assignments });
  }
  async function S(w) {
    const C = { ...h, ...w.assignments };
    p(C), await P(C);
  }
  return ye(() => {
    if (g)
      return g.current = (w) => D.current || !A[w] ? !1 : (S(A[w]), !0), () => {
        g.current = null;
      };
  }), r("div", { className: "space-y-2" }, [
    A.length ? r("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      r("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      r("div", { key: "options", className: "space-y-2" }, A.map((w, C) => r("button", {
        key: C,
        type: "button",
        disabled: b,
        onClick: () => R(w, C),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${C + 1}: ${w.description}`
      }, [
        r("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, C + 1),
        r("span", { key: "description" }, w.description)
      ]))),
      r("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${A.length} to apply and save`)
    ]) : null,
    r("div", { key: "slots", className: "grid gap-2" }, o.map((w) => r("label", { key: w.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      r("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Lt(w)),
      (w.genderHints || []).length ? r("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(w.genderHints || []).map(Qr).join(" · ")}`) : null,
      r("select", { key: "select", value: h[w.slotDefinitionId] || "", disabled: b, onChange: (C) => p({ ...h, [w.slotDefinitionId]: C.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        r("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Oa(y, y, w.genderHints).map((C) => r("option", { key: yt(C), value: yt(C) }, C.name))
      ])
    ]))),
    r("div", { key: "actions", className: "flex items-center gap-3" }, [r("button", { key: "save", ref: u, type: "button", disabled: b, onClick: () => P(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), r("span", { key: "message", role: "status", className: "text-xs text-secondary" }, I)])
  ]);
}
function Zc({ videoId: e, targets: t, performerCandidates: n, onSaved: o, onConflict: i, shortcutRef: a, acquireSaveLock: s = () => () => {
} }) {
  var P;
  const l = ((P = t[0]) == null ? void 0 : P.slots) || [], d = jo(n), c = Da(
    l,
    d
  ), u = "__mixed__", g = () => Object.fromEntries(l.map((R, S) => {
    const w = t.map((C) => {
      var E;
      return String(((E = C.slots[S]) == null ? void 0 : E.performerId) || "");
    });
    return [R.slotDefinitionId, w.every((C) => C === w[0]) ? w[0] : u];
  })), [y, h] = G(g), [p, b] = G(!1), [k, I] = G(""), f = ue(!1), D = t.map((R) => `${R.itemId ?? `native:${R.segmentId}`}:${R.revision}:${R.slots.map((S) => `${S.slotDefinitionId}:${S.performerId || ""}`).join(",")}`).join("|");
  ye(() => {
    h(g());
  }, [D]);
  async function J(R = y) {
    if (f.current) return;
    const S = s();
    if (!S) {
      I("Wait for the current save to finish before saving performer slots.");
      return;
    }
    f.current = !0, b(!0), I(`Saving performer slots for ${t.length} segments…`);
    const w = [];
    try {
      for (const C of t) {
        const E = C.slots.map((O, U) => {
          const Z = R[l[U].slotDefinitionId];
          return {
            slotDefinitionId: O.slotDefinitionId,
            performerId: Z === u ? O.performerId || null : Z ? Number(Z) : null
          };
        }), K = await ne(C.itemId != null ? `/videos/${e}/drafts/${C.itemId}/slots` : `/videos/${e}/segments/${C.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: C.revision, assignments: E })
        });
        w.push({
          segmentId: C.segmentId,
          itemId: C.itemId,
          revision: K.revision,
          slots: K.slots || []
        });
      }
      I("Performer slots saved."), await o({
        beforeState: Hr(t),
        afterState: Hr(w)
      });
    } catch (C) {
      const E = await i();
      C.status === 409 ? I(E ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : I(C.message || (E ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      f.current = !1, b(!1), S();
    }
  }
  function Y(R, S) {
    I(`Option ${S + 1} applied; save to confirm.`), h({ ...y, ...R.assignments });
  }
  async function A(R) {
    const S = { ...y, ...R.assignments };
    h(S), await J(S);
  }
  return ye(() => {
    if (a)
      return a.current = (R) => f.current || !c[R] ? !1 : (A(c[R]), !0), () => {
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
      r("div", { key: "options", className: "space-y-2" }, c.map((R, S) => r("button", {
        key: S,
        type: "button",
        disabled: p,
        onClick: () => Y(R, S),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${S + 1} to all selected segments: ${R.description}`
      }, [
        r("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, S + 1),
        r("span", { key: "description" }, R.description)
      ]))),
      r("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${c.length} to apply and save across the selection`)
    ]) : null,
    r("div", { key: "slots", className: "grid gap-2" }, l.map((R) => r("label", {
      key: R.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      r("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Lt(R)),
      r("select", {
        key: "select",
        value: y[R.slotDefinitionId] || "",
        disabled: p,
        onChange: (S) => h({ ...y, [R.slotDefinitionId]: S.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        y[R.slotDefinitionId] === u ? r("option", { key: "mixed", value: u }, "Mixed — leave unchanged") : null,
        r("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Oa(d, d, R.genderHints).map((S) => r("option", {
          key: yt(S),
          value: yt(S)
        }, S.name))
      ])
    ]))),
    r("div", { key: "actions", className: "flex items-center gap-3" }, [
      r("button", {
        key: "save",
        type: "button",
        disabled: p,
        onClick: () => J(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      r("span", { key: "message", role: "status", className: "text-xs text-secondary" }, k)
    ])
  ]);
}
function Ht(e, t = null) {
  const n = String(e || "").trim().toLowerCase();
  return n === "ext:segment-studio:stash-marker-studio" || n === "stash-marker-studio" || n === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : n === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : n === "segment-studio/user" || n === "user" ? "Manual" : n === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : n === "tpdb" ? "TPDB" : n ? n.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function eu(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const n = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (n.length === 0) return Ht(t);
  const o = [...new Set(n.map((i) => Ht(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function eo() {
  return r("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function jr({ name: e }) {
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
function tu({ hidden: e }) {
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
    r(eo, { key: "derived" })
  ]);
}
function nu({ segment: e, provenance: t }) {
  var u;
  const [n, o] = G(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = eu(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
  return r("section", { "aria-label": "Segment provenance", className: "rounded-md border border-border bg-surface" }, [
    r("button", {
      key: "toggle",
      type: "button",
      onClick: () => o((g) => !g),
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
        (u = e.sourceKey) != null && u.includes("stash-marker-studio") ? "Imported from Stash Marker Studio. Detailed run and model information was not recorded for this legacy segment." : "No detailed provenance was recorded for this segment."
      ) : s.map((g) => {
        const y = g.modelIdentifier || g.modelKey, h = g.value == null ? null : typeof g.value == "string" ? g.value : JSON.stringify(g.value);
        return r("div", { key: g.id || `${g.fieldKey}:${g.sourceKey}:${g.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          r(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            Ht(g.sourceKey, g.sourceDisplayName)
          ),
          g.fieldKey ? r(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${g.fieldKey}${h == null ? "" : ` · ${h}`}`
          ) : null,
          g.relation === "inherited" ? r("div", { key: "relation", className: "text-secondary" }, "Inherited origin") : null,
          y ? r(
            "div",
            { key: "model", className: "text-secondary" },
            `Model ${y}${g.modelVersion ? ` · ${g.modelVersion}` : ""}`
          ) : null,
          g.activityExternalRunId || g.sourceRunId ? r("div", { key: "run", className: "break-all text-secondary" }, `Run ${g.activityExternalRunId || g.sourceRunId}`) : null,
          g.confidence != null ? r(
            "div",
            { key: "confidence", className: "text-secondary" },
            `Confidence ${Math.round(g.confidence * 100)}%`
          ) : null,
          g.recordedAt || g.createdAt ? r("div", { key: "recorded", className: "text-secondary" }, `Recorded ${g.recordedAt || g.createdAt}`) : null
        ]);
      })
    ) : null
  ]);
}
function ru({
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
  saveMessage: u
}) {
  const [g, y] = G([]), h = e.flatMap((I) => I.lanes.map((f) => f.key)), p = h.join("|");
  ye(() => {
    const I = new Set(h);
    y((f) => f.filter((D) => I.has(D)));
  }, [p]);
  const b = qr(t), k = !!Ya(
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
      a ? r(ln, { key: "counts", counts: b }) : null
    ]),
    r(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      sc({ mergeable: k, reviewable: a, tagEditable: s, slotsEditable: l })
    ),
    l ? r("button", {
      key: "slots",
      ref: c,
      type: "button",
      onClick: d,
      className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/40"
    }, "Edit performer slots") : null,
    u ? r("p", {
      key: "save-message",
      role: "status",
      "aria-live": "polite",
      className: "text-xs text-secondary"
    }, u) : null,
    ...e.map((I) => r("section", {
      key: I.key,
      "data-selected-segment-group": I.key,
      className: "space-y-1.5"
    }, [
      r("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        r("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, I.name),
        r("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${I.selectedCount} selected`)
      ]),
      ...I.lanes.map((f) => {
        const D = g.includes(f.key), J = f.markers.some(({ segment: A }) => A.id === n), Y = `selected-segment-lane-${f.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return r("div", {
          key: f.key,
          "data-selected-segment-lane": f.key,
          className: `rounded-md border ${J ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          r("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": D,
            "aria-controls": Y,
            "aria-current": J ? "true" : void 0,
            onClick: () => y((A) => D ? A.filter((P) => P !== f.key) : [...A, f.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            r("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, D ? "▾" : "▸"),
            r("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, gr(f)),
            r("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(f.selectedCount)),
            a ? r(ln, { key: "states", counts: f.counts }) : null
          ]),
          D ? r("div", {
            key: "segments",
            id: Y,
            className: "space-y-1 border-t border-border p-1.5"
          }, f.markers.map(({ segment: A }) => {
            const P = A.endSec == null ? Fe(A.startSec) : `${Fe(A.startSec)} – ${Fe(A.endSec)}`;
            return r("button", {
              key: A.id,
              type: "button",
              onClick: () => i(A),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${A.id === n ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${A.tagName || "Segment"}, ${A.reviewState}, ${P}` : `${A.tagName || "Segment"}, ${P}`,
              "aria-current": A.id === n ? "true" : void 0
            }, [
              a ? r(xn, {
                key: "state",
                state: A.reviewState,
                includeLabel: !1
              }) : null,
              A.isDerived ? r(eo, { key: "derived" }) : null,
              r("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, P),
              r(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                Ht(A.sourceKey)
              )
            ]);
          })) : null
        ]);
      })
    ]))
  ]);
}
const Vt = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"]
}, as = "com.midnightrider.segment-studio", ou = /* @__PURE__ */ new Set(["hasSegments"]), iu = /* @__PURE__ */ new Set(["segment_count", "unreviewed_count"]), au = {
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
function lr(e, t, n) {
  return { extensionId: as, filterId: e, modifier: t, value: n };
}
function Xi(e) {
  return typeof e == "boolean" ? e : e === "has" ? !0 : e === "none" ? !1 : null;
}
function Zi(e) {
  const t = Vr(e == null ? void 0 : e.value), n = Vr(e == null ? void 0 : e.excludes), o = { INCLUDES_ALL: "includesall", EXCLUDES: "excludes", IS_NULL: "isnull", NOT_NULL: "notnull" }[e == null ? void 0 : e.modifier] ?? "includes";
  return o === "isnull" || o === "notnull" ? lr("segment-tags", o, {}) : t.length === 0 && (o === "excludes" || n.length === 0) ? null : lr("segment-tags", o, {
    ...t.length > 0 ? { value: t } : {},
    ...n.length > 0 && o !== "excludes" ? { excludes: n } : {},
    ...(e == null ? void 0 : e.depth) === -1 ? { depth: -1 } : {}
  });
}
function To(e = {}, { fullMode: t = !0 } = {}) {
  var k, I, f;
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
  if (!n.some((D) => Object.hasOwn(e, D))) return e;
  const o = { ...e };
  n.forEach((D) => delete o[D]);
  const i = [], a = Xi(((k = e.hasSegmentsCriterion) == null ? void 0 : k.value) ?? e.segments);
  a !== null && i.push(lr("has-segments", "equals", a));
  const s = ((I = e.reviewStateCriterion) == null ? void 0 : I.value) ?? e.reviewState;
  t && ["unreviewed", "approved", "rejected"].includes(s) && i.push(lr("review-state", "equals", s));
  const l = Xi(((f = e.shotBoundariesCriterion) == null ? void 0 : f.value) ?? e.shotBoundaries);
  t && l !== null && i.push(lr("has-shot-boundaries", "equals", l));
  const d = Number(e.segmentTagId ?? e.tagId) || null, c = e.segmentTagsCriterion ? Zi(e.segmentTagsCriterion) : d ? Zi({ value: [d] }) : null;
  c && i.push(c);
  const u = Vr(e.videoTagIds);
  u.length > 0 && !o.tagsCriterion && (o.tagsCriterion = { modifier: "INCLUDES", value: u });
  const g = Vr(e.performerIds);
  g.length > 0 && !o.performersCriterion && (o.performersCriterion = { modifier: "INCLUDES", value: g });
  const y = Number(e.studioId) || null;
  y && !o.studiosCriterion && (o.studiosCriterion = { modifier: "INCLUDES", value: [y] });
  const h = Array.isArray(e.extensionCriteria) ? e.extensionCriteria : [], p = new Set(h.filter((D) => (D == null ? void 0 : D.extensionId) === as).map((D) => D.filterId)), b = [...h, ...i.filter((D) => !p.has(D.filterId))];
  return b.length > 0 ? o.extensionCriteria = b : delete o.extensionCriteria, o;
}
function Ro(e) {
  return iu.has(e == null ? void 0 : e.sort) ? { ...e, sort: Vt.defaultFilter.sort, direction: Vt.defaultFilter.direction } : e;
}
function Wr(e) {
  return Array.isArray(e) ? e.map(Wr) : !e || typeof e != "object" ? e : Object.fromEntries(Object.entries(e).map(([t, n]) => [
    t,
    t === "modifier" && typeof n == "string" ? au[n] ?? n : Wr(n)
  ]));
}
function su(e, t, { fullMode: n = !0 } = {}) {
  var d;
  const o = Ro(e), i = {
    page: o.page || 1,
    perPage: o.perPage || Vt.defaultFilter.perPage,
    sort: o.sort || Vt.defaultFilter.sort,
    direction: o.direction || Vt.defaultFilter.direction
  };
  o.q && (i.q = o.q), i.sort === "random" && Number.isInteger(o.seed) && o.seed > 0 && (i.seed = o.seed);
  const a = { ...To(t, { fullMode: n }) };
  delete a.includeCompilationGroups;
  const { _filterExpression: s, ...l } = a;
  return {
    findFilter: i,
    objectFilter: Wr(l),
    ...(d = s == null ? void 0 : s.children) != null && d.length ? { filterExpression: Wr(s) } : {}
  };
}
function lu(e) {
  return e.filter((t) => !ou.has(t.id));
}
function du(e, t) {
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
function br(e, t, n) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(n));
}
function ss(e, t, n) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(n));
}
function Vr(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((n) => Number.isInteger(n) && n > 0))];
}
function cu(e, t, n, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(n);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((u) => a.add(u));
  } else a.has(n) ? a.delete(n) : a.add(n);
  return a;
}
function ls({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? r("div", { className: "text-[11px]" }, r(Ki, null, "No tag segments")) : t ? r("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, Mt.flatMap((n) => {
    const o = Number(e[`${n}Count`]) || 0;
    if (o === 0) return [];
    const i = _t[n];
    return [r("span", {
      key: n,
      title: `${o} ${n} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : r(
    "div",
    { className: "text-[11px]" },
    r(Ki, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function ds({ item: e, selected: t, selectionActive: n, onSelect: o }) {
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
function uu({ item: e, onNavigate: t, showReviewStates: n = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      onClick: (l) => br(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    r("div", { key: "media", className: "relative aspect-video bg-black" }, [
      r("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      r(ds, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? r("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, sl(e.duration)) : null
    ]),
    r("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      r("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      r("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? r("span", { key: "date" }, e.date) : null,
        e.organized ? r("span", { key: "organized" }, "Organized") : null,
        e.isVr ? r("span", { key: "vr" }, "VR") : null
      ]),
      r("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, r(ls, { item: e, showReviewStates: n }))
    ])
  ]);
}
function mu({ item: e, onNavigate: t, showReviewStates: n = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return r("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    r(ds, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
    r(i ? "div" : "a", {
      key: "link",
      href: i ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: i ? void 0 : (l) => br(l, t, s),
      className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }, [
      r("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
      r("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
        r("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
        r(ls, { key: "segments", item: e, showReviewStates: n })
      ]),
      r("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function Wo({ active: e, onNavigate: t, showBin: n = !1, profile: o }) {
  const i = md(o);
  return r("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    r("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => r("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => br(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    r("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      n && Un(
        o,
        Zt.recyclingBinView
      ) ? r(cs, { key: "bin", onNavigate: t }) : null,
      r(us, { key: "settings", onNavigate: t })
    ])
  ]);
}
const Eo = "segment-studio:recycling-bin-changed";
function gu(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function dr() {
  window.dispatchEvent(new CustomEvent(Eo));
}
function cs({ onNavigate: e, compact: t = !1 }) {
  const [n, o] = G(null);
  ye(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const u = await ne("/bin"), g = Number(u == null ? void 0 : u.totalCount);
        !a && c === s && o(Number.isFinite(g) && g >= 0 ? Math.trunc(g) : null);
      } catch {
        !a && c === s && o(null);
      }
    }, d = () => {
      l();
    };
    return l(), window.addEventListener(Eo, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(Eo, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = gu(n);
  return r("a", {
    href: "/segment-studio/bin",
    onClick: (a) => br(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": n == null ? "Open recycling bin" : `Open recycling bin, ${n} item${n === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [r("span", { key: "icon", "aria-hidden": "true" }, "♲"), r("span", { key: "label" }, i)]);
}
function us({ onNavigate: e, compact: t = !1 }) {
  return r("a", {
    href: "/segment-studio/settings",
    onClick: (n) => br(n, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [r("span", { key: "icon", "aria-hidden": "true" }, "⚙"), r("span", { key: "label" }, "Settings")]);
}
function fu({ mode: e, onModeChange: t, disabled: n = !1 }) {
  function o(i) {
    const a = wo(i.target.value);
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
function pu({ minimum: e, maximum: t, onChange: n }) {
  const o = ue(null), [i, a] = G("maximum"), s = (y, h) => {
    const p = Ll(e, t, y, h);
    a(p.coincidentTop), n({ minimum: p.minimum, maximum: p.maximum });
  }, l = (y, h) => {
    var b;
    const p = (b = o.current) == null ? void 0 : b.getBoundingClientRect();
    p && s(y, Pl(h.clientX, p.left, p.width));
  }, d = (y, h) => {
    var p, b;
    h.preventDefault(), (b = (p = h.currentTarget).setPointerCapture) == null || b.call(p, h.pointerId), l(y, h);
  }, c = (y, h) => {
    var p, b;
    (b = (p = h.currentTarget).hasPointerCapture) != null && b.call(p, h.pointerId) && l(y, h);
  }, u = (y, h) => {
    const p = y === "minimum" ? e : t, b = y === "minimum" ? 0 : e, k = y === "minimum" ? t : 1, I = h.shiftKey ? 0.1 : 0.01;
    let f = null;
    ["ArrowLeft", "ArrowDown"].includes(h.key) && (f = p - I), ["ArrowRight", "ArrowUp"].includes(h.key) && (f = p + I), h.key === "PageDown" && (f = p - 0.1), h.key === "PageUp" && (f = p + 0.1), h.key === "Home" && (f = b), h.key === "End" && (f = k), f != null && (h.preventDefault(), s(y, Math.min(k, Math.max(b, f))));
  }, g = (y, h) => r("span", {
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
        g("minimum", e),
        g("maximum", t)
      ])
    )
  ]);
}
function yu({ saving: e, error: t, onSelect: n, onClose: o }) {
  const i = ue(null);
  ye(() => {
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
    onKeyDownCapture: (s) => Pt(s, { onCancel: a })
  }, r("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: Jt,
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
    r(ur, {
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
function bu({
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
  onClose: u
}) {
  const g = Gt(e), y = [...new Map((a || []).map((f) => [
    Number(f.tagId),
    f.tagName || `Tag ${f.tagId}`
  ])).entries()].sort((f, D) => f[1].localeCompare(D[1]) || f[0] - D[0]), h = new Set((a || []).map((f) => Number(f.tagId))), p = (s || []).filter((f) => Number(f.id) === g.segmentGroupId || (f.tags || []).some((D) => h.has(Number(D.tagId)))), b = (f) => d(Gt({ ...g, ...f })), k = (f) => b({
    reviewStates: g.reviewStates.includes(f) ? g.reviewStates.filter((D) => D !== f) : [...g.reviewStates, f]
  }), I = (f) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${f ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (f) => {
      f.target === f.currentTarget && u();
    },
    onKeyDownCapture: (f) => Pt(f, { onCancel: u })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: Jt,
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
        onClick: u,
        "aria-label": "Close editor filters",
        className: "rounded-md px-2 py-1 text-xl leading-none text-secondary hover:bg-muted/40 hover:text-foreground"
      }, "×")
    ]),
    r("div", { key: "body", className: "min-h-0 space-y-5 overflow-y-auto p-5" }, [
      l ? r("fieldset", { key: "approval", className: "space-y-2" }, [
        r("legend", { className: "text-sm font-semibold text-foreground" }, "Approval state"),
        r("div", { className: "flex flex-wrap gap-2" }, Mt.map((f) => {
          const D = g.reviewStates.includes(f), J = _t[f];
          return r("button", {
            key: f,
            type: "button",
            onClick: () => k(f),
            "aria-pressed": D,
            className: I(D)
          }, `${J.symbol} ${f} (${i[f] || 0})`);
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
            "aria-pressed": g.performerId == null,
            className: I(g.performerId == null)
          }, "All performers"),
          ...n.map((f) => {
            const D = Number(yt(f));
            return r("button", {
              key: D,
              type: "button",
              onClick: () => b({ performerId: D }),
              "aria-pressed": g.performerId === D,
              className: I(g.performerId === D)
            }, f.name);
          })
        ])
      ]) : null,
      r("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        r("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          r("span", { key: "label" }, "Tag"),
          r("select", {
            key: "select",
            value: g.tagId ?? "",
            onChange: (f) => b({
              tagId: f.target.value === "" ? null : Number(f.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            r("option", { key: "all", value: "" }, "All tags"),
            ...y.map(([f, D]) => r("option", { key: f, value: f }, D))
          ])
        ]),
        r("label", {
          key: "segment-group",
          className: "space-y-1 text-xs text-secondary"
        }, [
          r("span", { key: "label" }, "Segment group"),
          r("select", {
            key: "select",
            value: g.segmentGroupId ?? "",
            onChange: (f) => b({
              segmentGroupId: f.target.value === "" ? null : f.target.value === "ungrouped" ? "ungrouped" : Number(f.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            r("option", { key: "all", value: "" }, "All Segment groups"),
            ...p.map((f) => r("option", { key: f.id, value: f.id }, f.name)),
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
            "aria-pressed": g.sourceKey == null,
            className: I(g.sourceKey == null)
          }, "All provenance"),
          ...o.map((f) => r("button", {
            key: f,
            type: "button",
            onClick: () => b({ sourceKey: f }),
            "aria-pressed": g.sourceKey === f,
            title: f,
            className: I(g.sourceKey === f)
          }, Ht(f)))
        ])
      ]),
      r("fieldset", { key: "confidence", className: "space-y-3" }, [
        r("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        r(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        r(pu, {
          minimum: g.confidenceMin,
          maximum: g.confidenceMax,
          onChange: ({ minimum: f, maximum: D }) => b({
            confidenceMin: f,
            confidenceMax: D
          })
        }),
        r("label", {
          key: "unscored",
          className: "flex items-center gap-2 text-xs text-secondary"
        }, [
          r("input", {
            key: "input",
            type: "checkbox",
            checked: g.includeUnscored,
            onChange: (f) => b({
              includeUnscored: f.target.checked
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
          onChange: (f) => c(f.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]"
        }),
        r(tu, { key: "icon", hidden: t }),
        r("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    r("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      r("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(Gt({})), l && c(!1);
        },
        className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
      }, "Reset filters"),
      r("button", {
        key: "done",
        type: "button",
        onClick: u,
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground"
      }, "Done")
    ])
  ]));
}
const ms = "segment-studio-editor-history";
function hu({ history: e, historySaving: t, anchorRef: n, onRestore: o, onClose: i }) {
  const a = ue(null);
  return ye(() => {
    const s = (d) => {
      nc(d.target, a.current, n == null ? void 0 : n.current) && i();
    }, l = (d) => {
      var g, y, h;
      if (d.key !== "Escape" || d.defaultPrevented || document.querySelector("[role='dialog'], [aria-modal='true']")) return;
      const c = document.activeElement, u = c instanceof Element && (((g = a.current) == null ? void 0 : g.contains(c)) || ((y = n == null ? void 0 : n.current) == null ? void 0 : y.contains(c)));
      d.preventDefault(), i(), u && ((h = n == null ? void 0 : n.current) == null || h.focus({ preventScroll: !0 }));
    };
    return document.addEventListener("pointerdown", s), document.addEventListener("keydown", l), () => {
      document.removeEventListener("pointerdown", s), document.removeEventListener("keydown", l);
    };
  }, [n, i]), r("div", {
    ref: a,
    id: ms,
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
function vu({ reviewMode: e, bindings: t, onClose: n }) {
  const o = pr.filter((l) => Bn(l, e)), i = Ai(o, 1)[0], a = Ai(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((u) => r("div", { key: u.id, className: "flex items-center justify-between text-sm" }, [
      r("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, u.description),
      r(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[u.id] ? t[u.id].length > 0 ? t[u.id] : ["Unassigned"] : u.bindings.map(wa)).map((g, y) => r("kbd", { key: `${u.id}:${y}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, g))
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
    onKeyDownCapture: (l) => Pt(l, { onCancel: n })
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
function Su({
  examples: e,
  exporting: t,
  removingExampleId: n,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = Cc(e), [l, d] = G([]), c = s.map((u) => u.tagName).join("|");
  return ye(() => {
    const u = new Set(s.map((g) => g.tagName));
    d((g) => g.filter((y) => u.has(y)));
  }, [c]), r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !t && n == null && a();
    },
    onKeyDownCapture: (u) => Pt(u, {
      onCancel: t || n != null ? void 0 : a
    })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: Jt,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    r("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      r("h2", { key: "title", id: "segment-studio-examples-title", className: "text-lg font-semibold text-foreground" }, "AI Feedback"),
      r("p", { key: "description", className: "mt-1 text-sm text-secondary" }, `${e.length} registered-AI example${e.length === 1 ? "" : "s"} in this video. Expand a tag to inspect or restore examples before export.`)
    ]),
    r("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      r("div", { key: "items", className: "space-y-3" }, e.length ? s.map((u, g) => {
        const y = l.includes(u.tagName), h = `incorrect-example-tag-${g}`;
        return r("section", {
          key: u.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          r("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": y,
            "aria-controls": h,
            onClick: () => d((p) => y ? p.filter((b) => b !== u.tagName) : [...p, u.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: Yr(!1) }
          }, [
            r(
              "span",
              { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" },
              y ? "▾" : "▸"
            ),
            r(
              "span",
              { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
              u.tagName
            ),
            r(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${u.examples.length} example${u.examples.length === 1 ? "" : "s"}`
            )
          ]),
          y ? r("div", {
            key: "examples",
            id: h,
            className: "divide-y divide-border border-t border-border"
          }, u.examples.map((p) => {
            const b = `${Fe(p.startSec)}${p.endSec == null ? "" : ` – ${Fe(p.endSec)}`}`, k = n === p.id;
            return r("div", {
              key: p.id,
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
                onClick: () => i(p),
                "aria-label": `${k ? "Restoring" : "Restore to review"} ${u.tagName} example at ${b}`,
                className: "rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
              }, k ? "Restoring…" : "Restore to review")
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
function xu({ segments: e, onSelect: t, onClose: n }) {
  const [o, i] = G(""), [a, s] = G(0), l = ue(null), d = Ve(() => Ad(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), u = Dd(d);
  ye(() => {
    var y;
    (y = l.current) == null || y.scrollIntoView({ block: "nearest" });
  }, [c, o]);
  const g = () => {
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
        Jt(y);
      else if (y.key === "Escape")
        y.preventDefault(), y.stopPropagation(), n();
      else if (y.key === "ArrowDown" || y.key === "ArrowUp") {
        y.preventDefault(), y.stopPropagation();
        const p = y.key === "ArrowDown" ? 1 : -1;
        s((b) => d.length ? (b + p + d.length) % d.length : 0);
      } else y.key === "Enter" && !((h = y.nativeEvent) != null && h.isComposing) && (y.preventDefault(), y.stopPropagation(), g());
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
      const p = y.segment || y, b = p.endSec == null ? Fe(p.startSec) : `${Fe(p.startSec)} – ${Fe(p.endSec)}`, k = `${Ht(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, I = h === c, f = h > 0 ? d[h - 1].groupKey : null, D = u && y.groupKey !== f ? r("div", {
        key: `group:${y.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, y.groupName) : null, J = r("button", {
        key: p.id,
        id: `segment-quick-search-${p.id}`,
        ref: I ? l : null,
        type: "button",
        role: "option",
        "aria-selected": I,
        onMouseEnter: () => s(h),
        onClick: () => t(p),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${I ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        u ? r("span", { key: "group", className: "sr-only" }, `${y.groupName} group`) : null,
        r(xn, { key: "review", state: p.reviewState, includeLabel: !1 }),
        r(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        (Y = y.performers) != null && Y.length ? r(Xr, {
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
          title: k
        }, k)
      ]);
      return D ? [D, J] : [J];
    }) : r("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function ku(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e || []) {
    if (!Jr(n)) continue;
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
function wu({
  drafts: e,
  processing: t,
  error: n,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = Ve(() => ku(e), [e]), [l, d] = G([]), c = s.reduce((h, p) => h + p.drafts.length, 0), u = ue(null);
  Uo({ confirmRef: u, cancelRef: o, confirmReady: !t && c > 0 });
  const g = (h) => d((p) => p.includes(h) ? p.filter((b) => b !== h) : [...p, h]), y = (h) => `segment-studio-publish-approved-${h.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && !t && a();
    },
    onKeyDownCapture: (h) => Pt(h, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: Jt,
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
      ].flatMap(([h, p]) => [
        r("dt", { key: `${h}:label`, className: "text-secondary" }, h),
        r("dd", { key: `${h}:value`, className: "font-semibold text-foreground" }, String(p))
      ])),
      s.length ? r("div", { key: "groups", className: "space-y-2" }, s.map((h) => {
        const p = l.includes(h.key);
        return r("section", { key: h.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          r("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": p,
            "aria-controls": y(h),
            onClick: () => g(h.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: Yr(!1) }
          }, [
            r("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, p ? "▾" : "▸"),
            r("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, h.tagName),
            r(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${h.drafts.length} draft${h.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          p ? r("div", {
            key: "drafts",
            id: y(h),
            className: "divide-y divide-border border-t border-border"
          }, h.drafts.map((b) => {
            const k = b.endSec == null ? Fe(b.startSec) : `${Fe(b.startSec)} – ${Fe(b.endSec)}`, I = `${Ht(b.sourceKey)}${b.confidence == null ? "" : ` · ${Math.round(b.confidence * 100)}%`}`;
            return r("div", { key: b.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              r(xn, { key: "review", state: b.reviewState, includeLabel: !1 }),
              r("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, k),
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
        ref: u,
        type: "button",
        disabled: t || c === 0,
        onClick: i,
        className: "rounded-md border border-emerald-500/60 bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-emerald-500/30 disabled:opacity-50"
      }, t ? "Publishing…" : `Publish ${c} approved draft${c === 1 ? "" : "s"}`)
    ])
  ]));
}
function Nu({ candidates: e, processing: t, error: n, onConfirm: o, onClose: i }) {
  const a = Ed(e), [s, l] = G(() => /* @__PURE__ */ new Set()), [d, c] = G(() => new Set(a.map((b) => b.key))), u = a.flatMap((b) => d.has(b.key) ? b.candidates : []), g = (b) => l((k) => {
    const I = new Set(k);
    return I.has(b) ? I.delete(b) : I.add(b), I;
  }), y = (b) => c((k) => {
    const I = new Set(k);
    return I.has(b) ? I.delete(b) : I.add(b), I;
  }), h = (b) => b.assignment.map(({ slot: k, performer: I }) => `${k.label || `Slot ${k.sortOrder + 1}`}: ${I.name}`).join(", "), p = (b) => `segment-studio-auto-assign-${b.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && !t && i();
    },
    onKeyDownCapture: (b) => {
      b.key === "Enter" && b.target instanceof HTMLInputElement || Pt(b, {
        onCancel: t ? void 0 : i,
        onConfirm: u.length && !t ? () => o(u) : void 0
      });
    }
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: Jt,
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
          style: { background: Yr(!1) }
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
            "aria-controls": p(b),
            "aria-label": `${s.has(b.key) ? "Collapse" : "Expand"} ${b.tagName} assignment: ${h(b)}`,
            onClick: () => g(b.key),
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
            b.assignment.map(({ slot: k, performer: I }) => {
              const f = k.label || `Slot ${k.sortOrder + 1}`;
              return r("span", {
                key: k.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${f}: ${I.name}`
              }, [
                r("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${f}: ${I.name}`
                }, `${f}: ${I.name}`),
                r(fr, {
                  key: "avatar",
                  performer: { id: I.performerId, name: I.name },
                  compact: !0
                })
              ]);
            })
          ),
          r(ln, { key: "states", counts: b.counts }),
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
          { key: "segments", id: p(b), className: "divide-y divide-border/70" },
          b.candidates.map((k) => {
            const I = k.endSec == null ? Fe(k.startSec) : `${Fe(k.startSec)} – ${Fe(k.endSec)}`, f = `${Ht(k.sourceKey)}${k.confidence == null ? "" : ` · ${Math.round(k.confidence * 100)}%`}`;
            return r("div", {
              key: k.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              r(xn, { key: "review", state: k.reviewState, includeLabel: !1 }),
              r(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                k.tagName || "Tag segment"
              ),
              r(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                I
              ),
              r("span", {
                key: "provenance",
                className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                title: f
              }, f)
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
        disabled: t || u.length === 0,
        onClick: () => o(u),
        className: "rounded-md border border-violet-400/60 bg-violet-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-violet-500/30 disabled:opacity-50"
      }, t ? "Assigning…" : `Auto-Assign ${u.length} Segment${u.length === 1 ? "" : "s"}`)
    ])
  ]));
}
function Iu({ preview: e, onConfirm: t, onClose: n }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && n();
    },
    onKeyDownCapture: (d) => Pt(d, { onCancel: n, onConfirm: t })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: Jt,
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
function Cu({
  merge: e,
  processing: t,
  undoable: n = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = G(!1), d = ue(null);
  if (Uo({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Fe(e.endSec);
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !t && a();
    },
    onKeyDownCapture: (u) => Pt(u, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: Jt,
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
          onChange: (u) => l(u.target.checked),
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
function $u(e) {
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
function Tu({ preview: e, loading: t, processing: n, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var g, y;
  const l = e ? e.createCount + e.linkCount : 0, d = ue(null);
  Uo({ confirmRef: d, cancelRef: i, confirmReady: !t && !n && l > 0 && !o });
  const c = ((g = e == null ? void 0 : e.outputs) == null ? void 0 : g.slice(0, 200)) || [], u = $u(c);
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && !n && s();
    },
    onKeyDownCapture: (h) => Pt(h, {
      onCancel: n ? void 0 : s,
      onConfirm: e && l > 0 && !n ? a : void 0
    })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: Jt,
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
        ].flatMap(([h, p]) => [
          r("dt", { key: `${h}:label`, className: "text-secondary" }, h),
          r("dd", { key: `${h}:value`, className: "font-semibold text-foreground" }, String(p))
        ])),
        e.conflictCount > 0 ? r(
          "p",
          { key: "conflicts", role: "status", className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground" },
          `${e.conflictCount} existing derivation ${e.conflictCount === 1 ? "branch was" : "branches were"} skipped because its lineage no longer matches the active rule. Resolve these through lineage maintenance.`
        ) : null,
        u.length ? r("div", { key: "outputs", className: "space-y-2" }, [
          ...u.map((h) => r("article", {
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
              h.outputs.map((p, b) => r("div", {
                key: `${p.ruleId}:${p.depth}:${b}`,
                className: "flex min-w-0 items-center gap-2 text-sm",
                style: { marginLeft: `${Math.max(0, p.depth - 1) * 1.25}rem` }
              }, [
                r("span", { key: "branch", "aria-hidden": "true", className: "shrink-0 text-secondary" }, "↳"),
                r(
                  "span",
                  { key: "tags", className: "min-w-0 flex-1 truncate text-foreground" },
                  `${p.sourceTagName} → ${p.derivedTagName}`
                ),
                r("span", { key: "depth", className: "shrink-0 text-[11px] text-secondary" }, `Level ${p.depth}`),
                r(
                  "span",
                  { key: "action", className: "shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-foreground" },
                  p.action === "create" ? "Create" : "Link existing"
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
function Ru({
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
  slotStatus: u,
  performerSlotsAvailable: g,
  selectedPerformerSlots: y,
  performerSlots: h,
  detail: p,
  video: b,
  slotButtonRef: k,
  tagSearchRef: I,
  onDetailChange: f,
  setSaveMessage: D,
  acquireSaveLock: J,
  onSlotsChanged: Y,
  onRecordHistory: A,
  onCancelQueuedReview: P,
  splitSegment: R,
  duplicateSegment: S,
  provenance: w,
  lineage: C,
  onNavigateLineageItem: E,
  tagEditing: K,
  onCancelTagEditing: O,
  detailPanelRef: U,
  onReduceSelection: Z
}) {
  var Se, ke, be;
  const L = ue(null), Q = ue(null), se = () => {
    var _;
    (_ = Q.current) == null || _.call(Q), Q.current = null;
  }, ie = ue(null), ve = ue(null), ge = ue(null), Me = ue(null), [W, X] = G(!1);
  ye(() => {
    L.current && (L.current.scrollTop = 0), X(!1);
  }, [t == null ? void 0 : t.id]), ye(() => {
    var _, we;
    W && ((we = (_ = ie.current) == null ? void 0 : _.querySelector("input, select, button")) == null || we.focus({ preventScroll: !0 }));
  }, [W]);
  function me() {
    X(!1), requestAnimationFrame(() => {
      var _;
      return (_ = k.current) == null ? void 0 : _.focus({ preventScroll: !0 });
    });
  }
  if (n.length > 1) {
    const _ = !n.some((N) => N.isDerived), we = e && g ? ac(h, n) : null, le = (we == null ? void 0 : we.map((N, j) => {
      var v;
      const x = n[j];
      return {
        segmentId: x.nativeSegmentId,
        itemId: x.published ? null : x.itemId,
        revision: (v = p.performerSlotRevisions) == null ? void 0 : v[x.id],
        slots: N
      };
    })) || [];
    return r(Ao.Fragment, null, [
      r(ru, {
        key: "details",
        selectedGroups: o,
        selectedSegments: n,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: U,
        onReduceSelection: Z,
        reviewable: e,
        tagEditable: _,
        slotsEditable: le.length > 0 && a == null,
        onEditSlots: () => X(!0),
        slotButtonRef: k,
        saveMessage: i
      }),
      K && _ ? r("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (N) => {
          N.target === N.currentTarget && O();
        },
        onKeyDownCapture: (N) => Pt(N, { onCancel: O })
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
        r(ur, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (N, j) => N == null ? O() : d(N, j == null ? void 0 : j.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        r("button", {
          key: "cancel",
          type: "button",
          onClick: O,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      W && le.length > 0 ? r("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (N) => {
          N.target === N.currentTarget && me();
        },
        onKeyDownCapture: (N) => {
          var x, v;
          if (!(typeof ((x = N.target) == null ? void 0 : x.closest) == "function" ? N.target.closest("input, textarea, select, [contenteditable='true']") : null) && !N.repeat && !N.ctrlKey && !N.altKey && !N.metaKey && !N.shiftKey && /^[1-9]$/.test(N.key) && ((v = Me.current) != null && v.call(Me, Number(N.key) - 1))) {
            N.preventDefault(), N.stopPropagation();
            return;
          }
          Pt(N, { onCancel: me });
        }
      }, r("section", {
        ref: ie,
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
          r("button", { key: "close", type: "button", onClick: me, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        r("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, r(Zc, {
          videoId: b.id,
          targets: le,
          performerCandidates: p.performerCandidates || [],
          shortcutRef: Me,
          acquireSaveLock: () => J("slots", -1),
          onSaved: async ({ beforeState: N, afterState: j }) => {
            await A(
              "performer-slots.assign",
              `Assigned performers to ${le.length} segments`,
              N,
              j
            ), me(), await Y();
          },
          onConflict: Y
        }))
      ])) : null
    ]);
  }
  return r("div", {
    ref: (_) => {
      L.current = _, U && (U.current = _);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    r("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      r("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? r(xn, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? r(eo, { key: "derived" }) : null,
        t && K ? r("div", {
          key: "tag-editor",
          ref: I,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (_) => {
            _.key === "Escape" && (_.preventDefault(), _.stopPropagation(), O());
          },
          onKeyDown: (_) => {
            rc(_, t.tagName) && (_.preventDefault(), _.stopPropagation(), d(t.tagId));
          }
        }, r(ur, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (_, we) => _ == null ? O() : d(_, we == null ? void 0 : we.label),
          // Until lineage loads, the projection's derived flag says whether a rule sets the tag.
          disabled: id(s ? a ?? -1 : null, t.id, l) || (C.data ? C.data.tagReadOnly === !0 : t.isDerived === !0),
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
      e && t && (u === "empty" || u === "partial") ? r("div", { key: "slots-row" }, r(Qc, { status: u })) : null,
      t && g && y.length > 0 ? r("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, r(Qa, {
        assignments: y.map((_) => {
          const we = cc(_);
          return {
            key: String(_.slotDefinitionId),
            label: we.label,
            performer: we.filled ? { id: Number(_.performerId), name: we.performer } : null,
            title: we.title
          };
        })
      })) : null,
      i ? r("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? r(nu, {
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
          (Se = C.data.parents) != null && Se.length ? r("div", { key: "parents" }, [
            r("span", { key: "label" }, "Parents: "),
            ...C.data.parents.map((_) => r("button", {
              key: _.nodeId,
              type: "button",
              onClick: () => E(_.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${_.ruleKey} ${_.ruleVersion}`))
          ]) : null,
          (ke = C.data.children) != null && ke.length ? r("p", { key: "children" }, `Children: ${C.data.children.length}`) : null
        ]) : r("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      r("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        r("button", { key: "apply", type: "button", disabled: s, onClick: c, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? r("button", {
          key: "slots",
          ref: k,
          type: "button",
          disabled: a != null || !g || y.length === 0,
          onClick: () => X(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: g ? y.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, y.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        r("button", {
          key: "split",
          type: "button",
          disabled: s,
          onClick: R,
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
    W && e && t && g && y.length > 0 ? r("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (_) => {
        _.target === _.currentTarget && me();
      },
      onKeyDownCapture: (_) => {
        var le, N;
        if (!(typeof ((le = _.target) == null ? void 0 : le.closest) == "function" ? _.target.closest("input, textarea, select, [contenteditable='true']") : null) && !_.repeat && !_.ctrlKey && !_.altKey && !_.metaKey && !_.shiftKey && /^[1-9]$/.test(_.key) && ((N = ge.current) != null && N.call(ge, Number(_.key) - 1))) {
          _.preventDefault(), _.stopPropagation();
          return;
        }
        Pt(_, {
          onCancel: me,
          onConfirm: () => {
            var j;
            return (j = ve.current) == null ? void 0 : j.click();
          }
        });
      }
    }, r("section", {
      ref: ie,
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
        r("button", { key: "close", type: "button", onClick: me, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      r("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, r(Xc, {
        key: `${t.id}:${p.performerSlotsRevision || p.slotRevision || ""}`,
        videoId: b.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: y,
        revision: (be = p.performerSlotRevisions) == null ? void 0 : be[t.id],
        performerCandidates: p.performerCandidates || [],
        confirmRef: ve,
        shortcutRef: ge,
        onOptimisticSave: (_) => {
          const we = J("slots", t.id);
          if (!we)
            return D("Wait for the current save to finish before saving performer slots."), !1;
          Q.current = we, f((le) => Gn(
            le,
            t.id,
            _
          ), b.id), D("Saving performer slots…"), me();
        },
        onSaved: async (_, { beforeState: we, afterState: le }) => {
          f((N) => Gn(
            N,
            t.id,
            _.slots || [],
            _.revision
          ), b.id), D("Performer slots saved.");
          try {
            await A(
              "performer-slots.assign",
              "Assigned performers",
              we,
              le
            ), await Y(_) || P([t]);
          } finally {
            se();
          }
        },
        onRollback: async (_, we) => {
          P([t]), f((le) => {
            var N;
            return Gn(
              le,
              t.id,
              _,
              (N = p.performerSlotRevisions) == null ? void 0 : N[t.id]
            );
          }, b.id), D(we.message || "Unable to save performer slots.");
          try {
            we.status === 409 && await Y();
          } finally {
            se();
          }
        },
        onConflict: Y
      }))
    ])) : null
  ]);
}
function Eu({ segments: e, shotBoundaries: t = [], segmentGroups: n, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: u, onZoomChange: g, onSelectGroup: y, onToggleGroup: h, onSelect: p, onSelectSegments: b, onSelectAll: k, onConfigureTag: I, onSeekTime: f, centerRef: D, showReviewState: J = !0, swimlaneTitleWidth: Y, onSwimlaneTitleWidthChange: A }) {
  const P = ue(null), R = ue(null), [S, w] = G(0), [C, E] = G({ scrollTop: 0, height: 320 }), [K, O] = G(null), U = Ve(
    () => vn(e, n, o),
    [e, n, o]
  ), Z = Ve(
    () => Wa(o),
    [o]
  ), L = Ve(() => _o(U), [U]), Q = Ve(
    () => pc(L, i, Va(L)),
    [L, i]
  ), se = Ve(
    () => Ja(Q.rows, Math.max(0, C.scrollTop - 24), C.height),
    [Q, C]
  ), ie = Math.max(0, Number(d) || 0), ve = Cl(S), ge = Fr(Y, ve), Me = ge / 16, W = Nl(c, ie, Me), X = vl(ie), me = Sl(ie, Math.max(1, S - Me * 16), u), Se = X.filter((v, m) => m === 0 || m % me === 0), ke = Ve(() => U.map((v) => `${v.key}:${v.trackCount}:${v.markers.map(({ segment: m, track: T }) => `${m.id}:${m.startSec}:${m.endSec ?? ""}:${T}`).join(",")}`).join("|"), [U]);
  function be() {
    const v = R.current;
    if (!v) return;
    const m = v.querySelector("[data-timeline-track]"), T = v.firstElementChild, V = m == null ? void 0 : m.getBoundingClientRect(), ae = T == null ? void 0 : T.getBoundingClientRect(), re = V && ae ? Math.max(0, V.left - ae.left) : Me * 16, je = (ae == null ? void 0 : ae.width) ?? v.scrollWidth;
    v.scrollTo({
      left: wl(c, ie, je, v.clientWidth, re, pa),
      behavior: "smooth"
    });
  }
  ye(() => (D.current = be, () => {
    D.current === be && (D.current = null);
  })), ye(() => {
    be();
  }, [u]);
  function _() {
    const v = R.current, m = Q.rows.find((je) => je.kind === "lane" && je.lane.markers.some(({ segment: H }) => H.id === s));
    if (!v || !m) return;
    const T = 24, V = m.top + T, ae = V + m.height;
    let re = v.scrollTop;
    V < v.scrollTop + T ? re = Math.max(0, V - T) : ae > v.scrollTop + v.clientHeight && (re = Math.max(0, ae - v.clientHeight)), re !== v.scrollTop && (v.scrollTop = re), E({ scrollTop: re, height: v.clientHeight });
  }
  ye(() => {
    _();
  }, [s, ke, Q]), ye(() => {
    const v = R.current, m = Q.rows.find((je) => je.kind === "group" && je.group.key === a);
    if (!v || !m) return;
    const T = 24, V = m.top + T, ae = V + m.height;
    let re = v.scrollTop;
    V < v.scrollTop + T ? re = Math.max(0, V - T) : ae > v.scrollTop + v.clientHeight && (re = Math.max(0, ae - v.clientHeight)), re !== v.scrollTop && (v.scrollTop = re), E({ scrollTop: re, height: v.clientHeight });
  }, [a, Q]), ye(() => {
    const v = R.current;
    if (!v || typeof ResizeObserver > "u") return;
    const m = () => {
      w(v.clientWidth), E({ scrollTop: v.scrollTop, height: v.clientHeight }), _();
    }, T = new ResizeObserver(m);
    return T.observe(v), m(), () => T.disconnect();
  }, [s, ke, Q]);
  function we(v) {
    if (!(ie > 0)) return;
    const m = v.currentTarget.getBoundingClientRect(), T = Math.min(1, Math.max(0, (v.clientX - m.left) / m.width));
    f(T * ie);
  }
  function le(v) {
    const m = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let T = null;
    Object.hasOwn(m, v.key) && (T = c + m[v.key]), v.key === "Home" && (T = 0), v.key === "End" && (T = ie), T != null && (v.preventDefault(), v.stopPropagation(), f(Math.min(ie, Math.max(0, T))));
  }
  function N(v) {
    var T;
    const m = (T = P.current) == null ? void 0 : T.getBoundingClientRect();
    m && A(Fr(v.clientX - m.left, ve));
  }
  function j(v) {
    const m = v.shiftKey ? 40 : 16;
    let T = null;
    v.key === "ArrowLeft" && (T = ge - m), v.key === "ArrowRight" && (T = ge + m), v.key === "Home" && (T = 160), v.key === "End" && (T = ve), T != null && (v.preventDefault(), v.stopPropagation(), A(Fr(T, ve)));
  }
  const x = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return r("section", {
    ref: P,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    r("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      r("button", {
        key: "title",
        type: "button",
        onClick: (v) => {
          (v.metaKey || v.ctrlKey) && (v.preventDefault(), k == null || k());
        },
        onKeyDown: (v) => {
          v.key !== "Enter" && v.key !== " " || (v.preventDefault(), k == null || k());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      r("button", { key: "out", type: "button", className: x, disabled: u <= 1, onClick: () => g(_r(u - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      r("button", { key: "fit", type: "button", className: x, disabled: u === 1, onClick: () => g(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(u * 100)}%`),
      r("button", { key: "in", type: "button", className: x, disabled: u >= 8, onClick: () => g(_r(u + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      r("button", { key: "center", type: "button", className: x, onClick: be, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    r("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(ve),
      "aria-valuenow": Math.round(ge),
      "aria-valuetext": `${Math.round(ge)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (v) => {
        v.currentTarget.setPointerCapture(v.pointerId), N(v);
      },
      onPointerMove: (v) => {
        v.currentTarget.hasPointerCapture(v.pointerId) && N(v);
      },
      onKeyDown: j,
      onDoubleClick: () => A(Ot.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${ge - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, r("span", { className: "h-16 w-1 rounded-full bg-border" })),
    r("div", {
      key: "scroll",
      ref: R,
      onScroll: (v) => E({
        scrollTop: v.currentTarget.scrollTop,
        height: v.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, r("div", { style: Il(u) }, [
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
          "aria-valuemax": ie,
          "aria-valuenow": Math.min(ie, Math.max(0, c)),
          "aria-valuetext": Fe(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: we,
          onKeyDown: le
        }, Se.map((v, m) => r("span", {
          key: v,
          className: `absolute top-0 ${xl(m, Se.length, ie > 0 ? v / ie * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: kl(m, Se.length, ie > 0 ? v / ie * 100 : 0)
        }, Fe(v))).concat(t.map((v) => {
          const m = ie > 0 ? v.startSec / ie * 100 : 0;
          return r("button", {
            key: `shot-boundary:${v.startSec}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Fe(v.startSec)} – ${Fe(v.endSec)}`,
            title: `Shot boundary · ${v.source || "manual"} · ${Fe(v.startSec)} – ${Fe(v.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${m}%`, width: "2px" },
            onClick: (T) => {
              T.stopPropagation(), f(v.startSec);
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
            ...Ci(W),
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
        style: U.length > 0 ? { height: Q.height } : void 0
      }, [
        U.length > 0 ? r("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...Ci(W, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        U.length === 0 ? r("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : se.map((v) => {
          var F;
          const m = v.group, T = i.includes(m.key), V = a === m.key, ae = Yr(V, m.color);
          if (v.kind === "group") return r("div", {
            key: v.key,
            "data-segment-group": m.key,
            "data-segment-group-collapsed": T ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${Me}rem minmax(0,1fr)`,
              backgroundColor: ae,
              top: v.top,
              height: v.height
            }
          }, [
            r("button", {
              key: "name",
              type: "button",
              onClick: ($) => {
                if ($.metaKey || $.ctrlKey) {
                  b(m.lanes.flatMap((q) => q.markers.map((fe) => fe.segment.id)));
                  return;
                }
                y(m.key), h(m.key);
              },
              "aria-expanded": !T,
              "aria-current": V ? "true" : void 0,
              "data-selected-timeline-group": V ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: Qd(m),
                backgroundColor: ae,
                // Headers are tinted by their own group colors, so selection needs the accent to stand out.
                // An outline leaves the box-shadow hover and focus rings free.
                ...V ? { outline: "1px solid var(--color-accent)", outlineOffset: "-1px" } : {}
              },
              title: `${T ? "Expand" : "Collapse"} ${m.name}`
            }, [
              r("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, T ? "▶" : "▼"),
              r("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, m.name)
            ]),
            r(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              T ? [
                r(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${m.lanes.length} swimlane${m.lanes.length === 1 ? "" : "s"} hidden`
                ),
                J ? r(ln, { key: "states", counts: m.counts }) : null
              ] : null
            )
          ]);
          const re = v.lane, je = Yd(v.laneIndex), H = re.markers.some(({ segment: $ }) => $.id === s);
          return r("div", {
            key: v.key,
            "data-grouped-swimlane": m.key,
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
              style: Xd(H, je, m.color),
              title: `${gr(re)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": gr(re),
              onClick: ($) => {
                ($.metaKey || $.ctrlKey) && b(re.markers.map((q) => q.segment.id));
              },
              onMouseEnter: () => O(re.key),
              onMouseLeave: () => O(($) => $ === re.key ? null : $)
            }, [
              re.tagId != null ? r("button", {
                key: "configure",
                type: "button",
                onClick: ($) => {
                  $.stopPropagation(), I({ tagId: re.tagId, tagName: re.label, trigger: $.currentTarget });
                },
                "aria-label": `Configure ${re.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: K === re.key ? 1 : void 0 }
              }, "⚙") : null,
              r("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, re.label),
              (F = re.performers) != null && F.length ? r(Xr, {
                key: "performers",
                performers: re.performers,
                performerAssignments: re.performerAssignments
              }) : null,
              J ? r(ln, { key: "counts", counts: re.counts }) : null
            ]),
            r("div", { key: "track", className: "relative" }, re.markers.map(({ segment: $, track: q }) => {
              var gt;
              const fe = ho($.startSec, ie), he = $.endSec == null ? $.startSec : Math.max($.startSec, $.endSec), te = Math.max(0, ho(he, ie) - fe), Ke = l.includes($.id), Te = $.id === s, Ce = zo(Z.get($.id)), Oe = $.endSec == null ? Fe($.startSec) : `${Fe($.startSec)} – ${Fe($.endSec)}`, _e = (gt = Ha[Ce]) == null ? void 0 : gt.label;
              return r("button", {
                key: $.id,
                type: "button",
                onClick: (Ge) => {
                  Ge.stopPropagation(), p($, {
                    additive: Ge.metaKey || Ge.ctrlKey,
                    rangeSegmentIds: Ge.shiftKey ? re.markers.map((ft) => ft.segment.id) : null
                  });
                },
                "aria-pressed": Ke,
                "aria-current": Te ? "true" : void 0,
                "data-selected-timeline-marker": Te ? "true" : void 0,
                "data-selected-segment-shortcut-target": Te ? "true" : void 0,
                "aria-label": J ? `${$.tagName || "Tag segment"}${re.performerLabel ? `, ${re.performerLabel}` : ""}, ${$.reviewState}${_e ? `, ${_e}` : ""}, ${Oe}` : `${$.tagName || "Tag segment"}${re.performerLabel ? `, ${re.performerLabel}` : ""}, ${Oe}`,
                title: J ? `${$.tagName || "Tag segment"}${re.performerLabel ? ` · ${re.performerLabel}` : ""} · ${$.reviewState}${_e ? ` · ${_e}` : ""} · ${Oe}` : `${$.tagName || "Tag segment"}${re.performerLabel ? ` · ${re.performerLabel}` : ""} · ${Oe}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...J ? Wd($.reviewState, Ke, Ce, Te) : Vd(Ke, Te),
                  left: `${fe}%`,
                  top: `${Zd(q)}rem`,
                  width: Jd($.endSec, te),
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
function Vo({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: n = !0,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = G(null), [l, d] = G([]), [c, u] = G(null), [g, y] = G(""), [h, p] = G(!0), [b, k] = G(null), [I, f] = G(""), [D, J] = G(!1), [Y, A] = G(!1), P = ue(null), R = ue(0);
  ye(() => {
    const U = requestAnimationFrame(() => {
      var Z;
      return (Z = P.current) == null ? void 0 : Z.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(U);
  }, [e]), ye(() => {
    const U = new AbortController();
    return p(!0), f(""), Promise.all([
      n ? ne(`/slot-definitions/${e}`, { signal: U.signal }) : Promise.resolve(null),
      ne("/segment-groups", { signal: U.signal })
    ]).then(([Z, L]) => {
      const Q = L.find((se) => (se.tags || []).some((ie) => Number(ie.tagId) === Number(e)));
      s(Z), d(L), u((Q == null ? void 0 : Q.id) ?? null), y(Q == null ? "" : String(Q.id)), J(!1), A(!1);
    }).catch((Z) => {
      Z.name !== "AbortError" && f(Z.message || "Unable to load tag configuration.");
    }).finally(() => {
      U.signal.aborted || p(!1);
    }), () => U.abort();
  }, [n, e]);
  function S(U, Z) {
    s({
      ...a,
      definitions: a.definitions.map((L, Q) => Q === U ? { ...L, ...Z } : L)
    });
  }
  function w(U, Z) {
    const L = U + Z;
    if (L < 0 || L >= a.definitions.length) return;
    const Q = [...a.definitions];
    [Q[U], Q[L]] = [Q[L], Q[U]], s({
      ...a,
      definitions: Q.map((se, ie) => ({ ...se, sortOrder: ie }))
    });
  }
  function C(U) {
    const Z = a.definitions[U], L = Number(Z.assignmentCount) || 0, Q = L === 0 ? "" : ` and its ${L} assignment${L === 1 ? "" : "s"}`, se = Z.derivationRules || [], ie = se.length === 0 ? "" : `

Its performer slot mapping will also be removed from ${se.length === 1 ? "this derivation rule" : `these ${se.length} derivation rules`}:
${se.map((ve) => `• ${ve}`).join(`
`)}`;
    window.confirm(`Delete “${Lt(Z)}”${Q}?${ie}`) && (L > 0 && J(!0), se.length > 0 && A(!0), s({
      ...a,
      definitions: a.definitions.filter((ve, ge) => ge !== U).map((ve, ge) => ({ ...ve, sortOrder: ge }))
    }));
  }
  async function E() {
    var Z;
    k("slots"), f("Saving performer slots…");
    let U;
    try {
      U = await ne(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: D,
          confirmRemoveDerivationRuleMappings: Y,
          definitions: a.definitions.map((L, Q) => {
            var se;
            return {
              id: L.id || void 0,
              label: ((se = L.label) == null ? void 0 : se.trim()) || null,
              sortOrder: Q,
              genderHints: L.genderHints || []
            };
          })
        })
      }), s(U), J(!1), A(!1);
    } catch (L) {
      L.status === 409 ? (f("Performer slots changed elsewhere; current values were reloaded."), (Z = L.payload) != null && Z.current && (s(L.payload.current), J(!1), A(!1))) : f(L.message || "Unable to save performer slots."), k(null);
      return;
    }
    try {
      await o(), f("Performer slots saved.");
    } catch {
      f("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      k(null);
    }
  }
  async function K() {
    const U = g === "" ? null : Number(g);
    if (U !== c) {
      k("group"), f("Saving tag group…");
      try {
        await ne(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: U })
        });
      } catch (Z) {
        f(Z.message || "Unable to assign the tag group."), k(null);
        return;
      }
      try {
        const [Z, L] = await Promise.allSettled([
          ne("/segment-groups"),
          o()
        ]);
        if (Z.status === "fulfilled") {
          d(Z.value);
          const Q = Z.value.find((ie) => (ie.tags || []).some((ve) => Number(ve.tagId) === Number(e))), se = (Q == null ? void 0 : Q.id) ?? null;
          u(se), y(se == null ? "" : String(se));
        }
        f(
          Z.status === "fulfilled" && L.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        k(null);
      }
    }
  }
  l.find((U) => Number(U.id) === Number(c));
  const O = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (U) => {
      U.target === U.currentTarget && !b && i();
    },
    onKeyDownCapture: (U) => Pt(U, {
      onCancel: b ? void 0 : i
    })
  }, r("section", {
    ref: P,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: Jt,
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
            value: g,
            disabled: b != null,
            onChange: (U) => y(U.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            r("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((U) => r("option", { key: U.id, value: String(U.id) }, U.name))
          ])
        ]),
        h ? null : r("button", {
          key: "save",
          type: "button",
          disabled: b != null || (g === "" ? null : Number(g)) === c,
          onClick: K,
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
              onChange: (U) => s({ ...a, allowSamePerformerInMultipleSlots: U.target.checked })
            }),
            r("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((U, Z) => r("article", {
            key: U.id || U._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            r("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              r("span", { key: "label" }, "Slot label"),
              r("input", {
                key: "input",
                value: U.label || "",
                disabled: b != null,
                onChange: (L) => S(Z, { label: L.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            r("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              r("legend", { key: "label" }, "Gender hints"),
              r("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, pl.map((L) => r("label", { key: L, className: "inline-flex items-center gap-1" }, [
                r("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: b != null,
                  checked: (U.genderHints || []).includes(L),
                  onChange: (Q) => S(Z, {
                    genderHints: Q.target.checked ? [.../* @__PURE__ */ new Set([...U.genderHints || [], L])] : (U.genderHints || []).filter((se) => se !== L)
                  })
                }),
                r("span", { key: "text" }, Qr(L))
              ])))
            ]),
            r("div", { key: "actions", className: "flex items-end gap-1" }, [
              r("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${U.assignmentCount || 0} assigned`),
              r("button", { key: "up", type: "button", disabled: b != null || Z === 0, onClick: () => w(Z, -1), className: O, "aria-label": `Move ${Lt(U)} up` }, "↑"),
              r("button", { key: "down", type: "button", disabled: b != null || Z === a.definitions.length - 1, onClick: () => w(Z, 1), className: O, "aria-label": `Move ${Lt(U)} down` }, "↓"),
              r("button", { key: "delete", type: "button", disabled: b != null, onClick: () => C(Z), className: `${O} text-red-300` }, "Delete")
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
                  _clientKey: `new-${++R.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: O
            }, "Add slot"),
            r("button", {
              key: "save",
              type: "button",
              disabled: b != null,
              onClick: E,
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
function Au(e, t, n) {
  if (!(e != null && e.disabled) || !n) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${n}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function Mu(e) {
  const { acquireSaveLock: t, activeFilterCount: n, allSwimlanes: o, approvalFacetCounts: i, autoAssignCandidates: a, autoAssignError: s, autoAssignOpen: l, autoAssignPerformers: d, autoAssigning: c, cancelQueuedReviewsForSegments: u, canMoveSelectionToBin: g, captureTrainingExport: y, centerTimelineRef: h, closeEditorFilters: p, closeFirstSegmentTagDialog: b, closeMaterializeDialog: k, closeMergeConfirmation: I, closePublishApprovedDialog: f, closeTagEditing: D, collapsedSegmentGroups: J, commonActionsRef: Y, compatibilityMode: A, configuringTag: P, createSegment: R, creatingSegmentId: S, currentTime: w, deleteRejectedSegments: C, detail: E, detailPanelRef: K, detailWidth: O, duplicateSegment: U, editorFilters: Z, editorLayout: L, editorRef: Q, exportingExamples: se, filtersButtonRef: ie, filtersOpen: ve, firstSegmentTagOpen: ge, focusRowRef: Me, handleSeparatorKeyDown: W, handleSeparatorPointerDown: X, handleSeparatorPointerMove: me, hasNextUnreviewed: Se, hasPreviousUnreviewed: ke, hideDerivedSegments: be, history: _, historyOpen: we, historySaving: le, horizontalLayoutSize: N, importNativeSegments: j, incorrectExamples: x, incorrectExamplesOpen: v, lineage: m, markerRailWidth: T, materializeButtonRef: V, materializeCancelButtonRef: ae, materializeDerivedSegments: re, materializeError: je, materializeLoading: H, materializeOpen: F, materializePreview: $, materializing: q, mediaStackRef: fe, mergeCancelButtonRef: he, mergeConfirmation: te, mergeSaving: Ke, mergeSelectedSwimlane: Te, nativeImportState: Ce, onDetailChange: Oe, onNavigate: _e, onReload: gt, onSlotsChanged: Ge, openPublishApprovedDialog: ft, panelSeparatorProps: ot, pendingInitialSeekRef: Pe, performerSlots: rt, performerSlotsAvailable: xt, playbackControlsRef: lt, previewDerivedSegments: ht, provenance: Xe, provenanceSources: it, publishApprovedCancelButtonRef: B, publishApprovedDrafts: ee, publishApprovedError: de, publishApprovedOpen: pe, quickSearchOpen: ce, railScrollRef: De, railToggleRef: Ee, recordHistoryAction: Qe, rejectedDeletionPreview: Le, removeIncorrectExample: tt, removingExampleId: qe, restoreHistoryTarget: Ae, runEditorAction: $e, saveMessage: Ze, saveTag: Ue, saveTiming: Be, savingSegmentId: Ne, editorHeldByOtherWork: Bt, segmentCreationPending: He, selectionBusy: vt, seekRef: Dt, segmentGroups: nt, segmentRailLayout: Re, segments: Ie, selectAllVideoSegments: dt, selectSegment: kt, selectSegmentCollection: bt, selectedGroups: qt, selectedPerformerSlots: St, selectedSegment: It, selectedSegmentGroupKey: en, selectedSegmentIds: cn, selectedSegments: tn, selectedSlotStatus: zn, setAutoAssignError: _n, setAutoAssignOpen: hr, setConfiguringTag: vr, setCurrentTime: Hn, setEditorFilters: Sr, setEditorLayout: qn, setFiltersOpen: un, setHideDerivedSegments: kn, setHistoryOpen: wn, setIncorrectExamplesOpen: xr, setQuickSearchOpen: Wn, setRailViewport: to, setRejectedDeletionPreview: Vn, setSaveMessage: Jn, setSelectedSegmentGroupKey: Yn, setSelectedSegmentId: Nn, setShortcutsOpen: kr, setTimelineZoom: wr, shotBoundaries: Qn, shortcutsOpen: mn, slotButtonRef: Xn, splitLayout: Ut, splitSegment: Ct, stepVideoFrame: Zn, tagEditing: er, tagSearchRef: Nr, timelineDuration: Ir, timelineRatioBounds: In, timelineZoom: tr, toggleSegmentGroup: Cr, toggleSegmentRail: no, updateTimelineRatio: nr, video: at, videoPerformers: Cn, visibleCounts: st, visibleSegmentRailRows: wt, visibleSegments: $r, wideLayout: gn, workspaceRef: Wt } = e;
  Gd(at ? at.title || `Video ${at.id}` : null);
  const $t = Ve(
    () => Ie.filter((z) => Jr(z)),
    [Ie]
  ), Tr = ll(Do), fn = $t.length, $n = ue(null), rr = Ve(() => () => wn(!1), [wn]), Tn = $ ? $.createCount + $.linkCount : null, pn = tn.length > 0, Rn = tn.length === 1, ro = pn && tn.every((z) => z.reviewState === "approved"), oo = pn && tn.every((z) => z.reviewState === "rejected"), nn = [
    // Segment edits queue behind saves of other segments; only saves of the selection, or work that
    // holds the whole editor, disable them.
    // A create already waiting would be repeated by a second press, so it waits for that one.
    { id: "marker.create", label: "New segment", disabled: Bt || He },
    // Retagging several segments at once holds the whole editor, so it waits for every save.
    { id: "marker.editTag", label: "Edit tag", disabled: vt || !pn || tn.length > 1 && Ne != null },
    { id: "marker.setStart", label: "Set start", disabled: vt || !Rn },
    { id: "marker.setEnd", label: "Set end", disabled: vt || !Rn },
    { id: "marker.split", label: "Split", disabled: vt || !Rn },
    ...A ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !ke, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: ro ? "Unapprove" : "Approve", disabled: vt || !pn, tone: "approve" },
      { id: "marker.reject", label: oo ? "Unreject" : "Reject", disabled: vt || !pn, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !Se, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...A ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: Ne != null || !g, tone: "reject" }
    ]
  ];
  function Yt(z) {
    const We = cn.includes(z.id), jt = z.id === (It == null ? void 0 : It.id), ct = z.endSec == null ? Fe(z.startSec) : `${Fe(z.startSec)} – ${Fe(z.endSec)}`, Tt = `${Ht(z.sourceKey)}${z.confidence != null ? ` · ${Math.round(z.confidence * 100)}%` : ""}`;
    return r("button", {
      key: z.id,
      type: "button",
      onClick: (Rt) => kt(z, { additive: Rt.metaKey || Rt.ctrlKey }),
      "aria-pressed": We,
      "aria-current": jt ? "true" : void 0,
      "data-selected-segment-shortcut-target": jt ? "true" : void 0,
      "aria-label": A ? `${z.tagName || "Tag segment"}, ${z.reviewState}${z.isDerived ? ", derived segment" : ""}, ${ct}` : `${z.tagName || "Tag segment"}${z.isDerived ? ", derived segment" : ""}, ${ct}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: _a(We, jt)
    }, [
      r("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        A ? r(xn, { key: "review", state: z.reviewState, includeLabel: !1 }) : null,
        z.isDerived ? r(eo, { key: "derived" }) : null,
        r(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          z.tagName || "Tag segment"
        ),
        r("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, ct),
        r("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: Tt
        }, Tt)
      ])
    ]);
  }
  const En = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", An = [..._.actions || []].reverse().find((z) => z.sequence <= _.cursorSequence);
  return r("section", {
    ref: Q,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${Ut ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    r("header", { key: "header", className: "relative flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      r("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        r("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          r("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (z) => ss(z, _e, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          r("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, r("a", {
            href: `/video/${at.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: at.title || `Video ${at.id}`
          }, at.title || `Video ${at.id}`)),
          ...Cn.map((z) => r(fr, {
            key: yt(z),
            performer: { id: yt(z), name: z.name },
            compact: !0,
            tooltip: z.name
          })),
          A ? r(ln, { key: "review-counts", counts: st }) : null
        ]),
        r("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          A ? null : r(cs, { key: "bin", onNavigate: _e, compact: !0 }),
          r(us, { key: "settings", onNavigate: _e, compact: !0 })
        ])
      ]),
      A && E.nativeImportCount > 0 ? r("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        r(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${E.nativeImportCount} Cove segment${E.nativeImportCount === 1 ? "" : "s"} ${E.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
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
          at != null && at.id ? r(Pd, {
            key: "extension-actions",
            entityType: "video",
            entityId: at.id,
            pageType: fl,
            renderMode: "toolbar"
          }) : null,
          A ? r("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: Ne != null || a.length === 0,
            onClick: () => {
              _n(""), hr(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${a.length ? ` (${a.length})` : ""}`) : null,
          A ? r("button", {
            key: "materialize-derived",
            ref: V,
            type: "button",
            disabled: Ne != null || H || q || Tn === 0,
            onClick: ht,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, H ? "Analyzing…" : `Auto-Materialize${Tn != null ? ` (${Tn})` : ""}`) : null,
          A ? r("button", {
            key: "complete-review",
            type: "button",
            disabled: Ne != null || fn === 0,
            onClick: (z) => ft(z.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": pe,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${fn ? ` (${fn})` : ""}`) : null,
          r("button", {
            key: "feedback",
            type: "button",
            disabled: se || qe != null || x.length === 0,
            onClick: () => xr(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": v,
            "aria-label": `Open AI feedback collection, ${x.length} example${x.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${x.length ? ` (${x.length})` : ""}`)
        ]),
        r("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          r("button", {
            key: "filters",
            ref: ie,
            type: "button",
            onClick: () => un(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": ve,
            className: `${En} ${n ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            r(jr, { key: "icon", name: "filter" }),
            r("span", { key: "label" }, `Filter${n ? ` (${n})` : ""}`)
          ]),
          r("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => kr(!0),
            className: En
          }, [r(jr, { key: "icon", name: "keyboard" }), r("span", { key: "label" }, "Shortcuts")]),
          r("button", {
            key: "history",
            ref: $n,
            type: "button",
            disabled: (A ? _.actions.length === 0 : An == null) || Ne != null || le,
            onClick: A ? () => wn((z) => !z) : () => Ae(
              An.sequence - 1
            ),
            "aria-controls": A ? ms : void 0,
            "aria-expanded": A ? we : void 0,
            className: En
          }, [
            r(jr, { key: "icon", name: "history" }),
            r("span", { key: "label" }, A ? `History${_.actions.length ? ` (${_.actions.length})` : ""}` : An ? `Undo ${An.label}` : "Undo")
          ]),
          r("button", {
            key: "rail",
            ref: Ee,
            type: "button",
            onClick: no,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": L.markerRailOpen,
            className: En
          }, [
            r(jr, { key: "icon", name: "list" }),
            r("span", { key: "label" }, L.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ]),
      A && we ? r(hu, {
        key: "history-popover",
        history: _,
        historySaving: le,
        anchorRef: $n,
        onRestore: Ae,
        onClose: rr
      }) : null
    ]),
    ve ? r(bu, {
      key: "editor-filters",
      filters: Z,
      hideDerivedSegments: be,
      performers: Cn,
      provenanceSources: it,
      reviewCounts: i,
      segments: Ie,
      segmentGroups: nt,
      reviewMode: A,
      onChange: Sr,
      onHideDerivedChange: kn,
      onClose: p
    }) : null,
    ge ? r(yu, {
      key: "first-segment-tag-dialog",
      saving: Ne != null,
      error: Ze,
      onSelect: (z, We) => R(z, We),
      onClose: b
    }) : null,
    ce ? r(xu, {
      key: "quick-search-dialog",
      segments: Md(o),
      onSelect: (z) => {
        Wn(!1), kt(z, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        Wn(!1), requestAnimationFrame(() => {
          var z;
          return (z = Q.current) == null ? void 0 : z.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    l ? r(Nu, {
      key: "auto-assign-dialog",
      candidates: a,
      processing: c,
      error: s,
      onConfirm: d,
      onClose: () => hr(!1)
    }) : null,
    te ? r(Cu, {
      key: "merge-selection-dialog",
      merge: te,
      processing: Ke,
      undoable: !A,
      cancelButtonRef: he,
      onConfirm: (z) => Te(!0, z, te),
      onClose: I
    }) : null,
    F ? r(Tu, {
      key: "materialize-derived-dialog",
      preview: $,
      loading: H,
      processing: q,
      error: je,
      cancelButtonRef: ae,
      onConfirm: re,
      onClose: () => {
        q || k();
      }
    }) : null,
    r("div", {
      key: "workspace",
      ref: Wt,
      className: `${Ut ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      L.markerRailOpen ? r("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: gn ? { position: "absolute", top: 0, right: 0, width: T, height: N.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        Ie.length === 0 ? r("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : $r.length === 0 ? r(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : r("div", {
          key: "segments",
          ref: De,
          onScroll: (z) => to({
            scrollTop: z.currentTarget.scrollTop,
            height: z.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, r("div", {
          className: "relative",
          style: { height: Re.height }
        }, wt.map((z) => {
          var jt;
          let We;
          if (z.kind === "group") {
            const ct = J.includes(z.group.key), Tt = z.group.lanes.reduce((Rt, et) => Rt + et.markers.length, 0);
            We = r("button", {
              type: "button",
              onClick: () => {
                Yn(z.group.key), Cr(z.group.key);
              },
              "aria-expanded": !ct,
              "aria-current": en === z.group.key ? "true" : void 0,
              "data-segment-rail-group": z.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${en === z.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              r("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, ct ? "▸" : "▾"),
              r("span", { key: "name", className: "min-w-0 flex-1 truncate", title: z.group.name }, z.group.name),
              r("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Tt),
              A && ct ? r(ln, { key: "states", counts: z.group.counts }) : null
            ]);
          } else z.kind === "lane" ? We = r("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: gr(z.lane),
            "aria-label": gr(z.lane)
          }, [
            r("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, z.lane.label),
            (jt = z.lane.performers) != null && jt.length ? r(Xr, {
              key: "performers",
              performers: z.lane.performers,
              performerAssignments: z.lane.performerAssignments
            }) : null,
            A ? r(ln, { key: "states", counts: z.lane.counts }) : null
          ]) : We = Yt(z.segment);
          return r("div", {
            key: z.key,
            className: "absolute left-0 right-0",
            style: { top: z.top, height: z.height }
          }, We);
        })))
      ]) : null,
      r("div", { key: "review-pane", className: `${Ut ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        r("div", {
          key: "media-stack",
          ref: fe,
          className: `${Ut ? "min-h-0 flex-1" : ""} grid`,
          style: Ut ? {
            gridTemplateRows: `minmax(16rem, ${(1 - L.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${L.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          r("div", {
            key: "focus-row",
            ref: Me,
            className: "grid min-h-0 gap-2",
            style: gn ? {
              gridTemplateColumns: L.markerRailOpen ? `${O}px 0.5rem minmax(0,1fr) 0.5rem ${T}px` : `${O}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            r(Ru, {
              key: "tools",
              compatibilityMode: A,
              selectedSegment: It,
              selectedSegments: tn,
              selectedGroups: qt,
              saveMessage: Ze,
              savingSegmentId: Ne,
              selectionBusy: vt,
              creatingSegmentId: S,
              acquireSaveLock: t,
              setSaveMessage: Jn,
              saveTag: Ue,
              slotStatus: zn,
              performerSlotsAvailable: xt,
              selectedPerformerSlots: St,
              performerSlots: rt,
              detail: E,
              onDetailChange: Oe,
              onCancelQueuedReview: u,
              video: at,
              slotButtonRef: Xn,
              tagSearchRef: Nr,
              tagEditing: er,
              onCancelTagEditing: D,
              detailPanelRef: K,
              onReduceSelection: (z) => {
                kt(z), requestAnimationFrame(() => {
                  var We;
                  return (We = K.current) == null ? void 0 : We.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Be,
              onSlotsChanged: Ge,
              onRecordHistory: Qe,
              splitSegment: Ct,
              duplicateSegment: U,
              provenance: Xe,
              lineage: m,
              onNavigateLineageItem: (z) => {
                const We = Ie.find((jt) => jt.itemId === z);
                We && Nn(We.id);
              }
            }),
            gn ? r(
              "div",
              { key: "detail-separator", ...ot("detailWidth", "Resize segment details") },
              r("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            at.videoFile ? r(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              r("div", { className: "h-full min-h-0 w-full" }, r(oa, {
                streamUrl: `/api/stream/video/${at.id}`,
                posterUrl: `/api/stream/video/${at.id}/screenshot?v=${encodeURIComponent(at.updatedAt || "")}`,
                format: at.videoFile.format,
                audioCodec: at.videoFile.audioCodec,
                duration: at.videoFile.duration,
                videoId: at.id,
                trackingEnabled: !1,
                onSeekRegister: (z) => {
                  Dt.current = z, Td(Pe.current, Ie, z) && (Pe.current = null);
                },
                onPlaybackControlRegister: (z) => {
                  lt.current = z;
                },
                onTimeUpdate: Hn
              }))
            ) : r("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            gn && L.markerRailOpen ? r(
              "div",
              { key: "rail-separator", ...ot("markerRailWidth", "Resize segment rail") },
              r("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            gn && L.markerRailOpen ? r("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          r("div", {
            key: "common-actions",
            ref: Y,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...nn.map((z) => {
              var ct;
              const We = (ct = Tr[z.id]) == null ? void 0 : ct[0], jt = z.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : z.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return r("button", {
                key: z.id,
                type: "button",
                disabled: z.disabled,
                "data-action-id": z.id,
                onClick: (Tt) => {
                  const Rt = Tt.currentTarget;
                  $e(z.id, { target: Rt, preserveFocus: !0 }), z.focusWhenDisabled && requestAnimationFrame(() => {
                    Au(Rt, Y.current, z.focusWhenDisabled);
                  });
                },
                title: We ? `${z.label} (${We})` : z.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${jt}`
              }, [
                r("span", { key: "label" }, z.label),
                We ? r("kbd", {
                  key: "shortcut",
                  className: "rounded border border-border/70 bg-background/70 px-1 py-0.5 font-mono text-[10px] leading-none text-secondary"
                }, We) : null
              ]);
            }),
            r("div", { key: "frame-actions", className: "ml-auto flex items-center gap-1" }, [
              r("button", {
                key: "previous-frame",
                type: "button",
                disabled: !at.videoFile,
                onClick: () => Zn(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, r(ul, { className: "h-4 w-4", "aria-hidden": !0 })),
              r("button", {
                key: "next-frame",
                type: "button",
                disabled: !at.videoFile,
                onClick: () => Zn(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, r(ml, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          Ut ? r("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(In.minimum * 100),
            "aria-valuemax": Math.round(In.maximum * 100),
            "aria-valuenow": Math.round(L.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(L.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: X,
            onPointerMove: me,
            onKeyDown: W,
            onDoubleClick: () => nr(Ot.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, r("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          r("div", { key: "timeline", className: "min-h-0", style: Ut ? void 0 : { height: "20rem" } }, r(Eu, {
            segments: $r,
            shotBoundaries: Qn,
            segmentGroups: nt,
            performerSlots: rt,
            collapsedGroupKeys: J,
            selectedGroupKey: en,
            selectedSegmentId: It == null ? void 0 : It.id,
            selectedSegmentIds: cn,
            duration: Ir,
            currentTime: w,
            zoom: tr,
            onZoomChange: wr,
            onSelectGroup: Yn,
            onToggleGroup: Cr,
            onSelect: (z, We) => kt(z, We),
            onSelectSegments: bt,
            onSelectAll: dt,
            onConfigureTag: (z) => vr(z),
            onSeekTime: (z) => {
              var We;
              return (We = Dt.current) == null ? void 0 : We.call(Dt, z, !1);
            },
            centerRef: h,
            showReviewState: A,
            swimlaneTitleWidth: L.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (z) => qn((We) => ({ ...We, swimlaneTitleWidth: z }))
          }))
        ])
      ])
    ]),
    P ? r(Vo, {
      key: `configure-tag:${P.tagId}`,
      tagId: P.tagId,
      tagName: P.tagName,
      performerSlotsEnabled: A,
      onSaved: gt,
      onClose: () => {
        const z = P.trigger;
        vr(null), requestAnimationFrame(() => {
          var We;
          z != null && z.isConnected ? z.focus({ preventScroll: !0 }) : (We = Q.current) == null || We.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    pe ? r(wu, {
      key: "publish-approved-dialog",
      drafts: $t,
      processing: Ne === -1,
      error: de,
      cancelButtonRef: B,
      onConfirm: ee,
      onClose: f
    }) : null,
    Le ? r(Iu, {
      key: "rejected-deletion-dialog",
      preview: Le,
      onConfirm: () => {
        C(Le), requestAnimationFrame(() => {
          var z;
          return (z = Q.current) == null ? void 0 : z.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Vn(null), requestAnimationFrame(() => {
          var z;
          return (z = Q.current) == null ? void 0 : z.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    mn ? r(vu, {
      key: "shortcuts-dialog",
      reviewMode: A,
      bindings: Tr,
      onClose: () => kr(!1)
    }) : null,
    v ? r(Su, {
      key: "incorrect-examples-dialog",
      examples: x,
      exporting: se,
      removingExampleId: qe,
      onExport: y,
      onRemove: tt,
      onClose: () => xr(!1)
    }) : null
  ]);
}
function Du(e) {
  const { allSwimlanes: t, editorRef: n, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: u, setCollapsedSegmentGroups: g, setEditorFilters: y, setHideDerivedSegments: h, setSaveMessage: p, setSelectedSegmentGroupKey: b, setSelectedSegmentId: k, setSelectedSegmentIds: I } = e;
  function f(P) {
    const R = zt(t, P);
    R && g((S) => Xa(S, R));
  }
  function D(P) {
    k(P), I(P == null ? [] : [P]), c.current = P, u.current = [];
  }
  function J(P, {
    focusEditor: R = !1,
    seekToSegment: S = !1,
    additive: w = !1,
    rangeSegmentIds: C = null
  } = {}) {
    var K, O;
    const E = Ul({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: u.current
    }, P.id, C, w);
    I(E.selectedSegmentIds), k(E.activeSegmentId), c.current = E.anchorSegmentId, u.current = E.rangeBaseSegmentIds, E.activeSegmentId != null && b(zt(t, E.activeSegmentId)), f(P.id), R && ((K = n.current) == null || K.focus({ preventScroll: !0 })), S && ((O = i.current) == null || O.call(i, P.startSec, !1));
  }
  function Y(P) {
    const R = Gl(
      d,
      l,
      P
    );
    I(R.selectedSegmentIds), k(R.activeSegmentId), c.current = R.activeSegmentId, u.current = [], R.activeSegmentId != null && (b(zt(t, R.activeSegmentId)), f(R.activeSegmentId));
  }
  function A() {
    var S;
    const P = zl(s), R = P.includes(l) ? l : P[0] ?? null;
    y(Gt({})), h(!1), I(P), k(R), c.current = R, u.current = [], R != null && b(zt(
      vn(s, a, o),
      R
    )), p(P.length === 0 ? "There are no segments to select." : `${P.length} segments selected. Collapsed Segment groups keep their selected segments.`), (S = n.current) == null || S.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: f, replaceSegmentSelection: D, selectSegment: J, selectSegmentCollection: Y, selectAllVideoSegments: A };
}
function Ou(e) {
  const { acceptHistory: t, acquireSaveLock: n, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, pendingChanges: c, stableSaveIdentity: u, historyRef: g, onConflict: y, onDetailChange: h, onReload: p, recordHistoryAction: b, revealSegmentGroupForSelection: k, savingSegmentId: I, selectedGroups: f, selectedSegment: D, selectedSegmentIdRef: J, selectedSegments: Y, selectionAnchorIdRef: A, selectionRangeBaseIdsRef: P, setMergeConfirmation: R, setSaveMessage: S, setSelectedSegmentId: w, setSelectedSegmentIds: C, video: E } = e;
  function K() {
    R(null), requestAnimationFrame(() => {
      var L;
      return (L = a.current) == null ? void 0 : L.focus({ preventScroll: !0 });
    });
  }
  async function O(L = !1, Q = !1, se = null) {
    if (I != null) return;
    const ie = se || Ya(
      f,
      { nativeOnly: !o }
    );
    if (!ie) {
      S("Select at least two segments from one swimlane.");
      return;
    }
    if (!L && ha()) {
      R(ie);
      return;
    }
    Q && va(!1);
    const ve = ie.endSec == null ? "open end" : Fe(ie.endSec);
    let ge = ie.segments[0];
    const Me = o ? null : Ft(ie.segments, !1), W = o ? null : crypto.randomUUID(), X = ie.segments.map((_) => _.id), me = Ec(i, ie.segments).segments.find((_) => _.id === ge.id), Se = {
      startSec: me.startSec,
      endSec: me.endSec,
      sourceKey: me.sourceKey,
      sourceRunId: me.sourceRunId,
      confidence: me.confidence,
      isDerived: me.isDerived
    }, ke = n("merge", ie.segments[0].id);
    if (!ke) return;
    K();
    const be = Et();
    s({
      type: "add",
      entry: { id: be, op: "merge", targets: ie.segments.map(pt), values: Se }
    }), C([ge.id]), w(ge.id), A.current = ge.id, P.current = [];
    try {
      const _ = ie.segments.slice(1);
      if (!o || ge.nativeSegmentId != null) {
        const we = _.map((N) => {
          const j = `merge-native-selection:${E.id}:${ge.id}:${N.id}:${ge.updatedAt}:${N.updatedAt}`;
          return { key: j, operationId: Je(j), segmentId: N.id, expectedUpdatedAt: N.updatedAt };
        }), le = await ne(`/videos/${E.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: ge.id,
            expectedSurvivorUpdatedAt: ge.updatedAt,
            consumedSegments: we.map(({ key: N, ...j }) => j),
            historyReceiptId: W
          })
        });
        ge = le.survivor, h((N) => Hi(N, le), E.id), s({ type: "confirm", key: be, applied: !0 }), we.forEach(({ key: N }) => Ye(N));
      } else {
        const we = _.map((N) => {
          const j = `merge-draft-selection:${E.id}:${ge.itemId}:${N.itemId}:${ge.revision}:${N.revision}`;
          return { key: j, operationId: Je(j), itemId: N.itemId, expectedRevision: N.revision };
        }), le = await ne(`/videos/${E.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: ge.itemId,
            expectedSurvivorRevision: ge.revision,
            consumedDrafts: we.map(({ key: N, ...j }) => j)
          })
        });
        ge = le.survivor, h((N) => Hi(N, le), E.id), s({ type: "confirm", key: be, applied: !0 }), we.forEach(({ key: N }) => Ye(N));
      }
      C([ge.id]), w(ge.id), A.current = ge.id, P.current = [], o ? t(Xt) : await b(
        "segments.merge",
        `Merged ${ie.segments.length} segments`,
        Me,
        Ft([ge], !1),
        W
      ), k(ge.id), S(`${ie.segments.length} segments merged into ${Fe(ie.startSec)} – ${ve}.`);
    } catch (_) {
      s({ type: "discard", key: be }), C(X), w((D == null ? void 0 : D.id) ?? X[0] ?? null), A.current = (D == null ? void 0 : D.id) ?? X[0] ?? null, P.current = [], _.status === 409 ? await y() : S(_.message || "Unable to merge selected segments.");
    } finally {
      ke();
    }
  }
  function U(L, Q = Y, se = D) {
    if (Q.length === 0) return Promise.resolve(null);
    const ie = ed(L, Q, se), ve = Math.max(0, ie.identities.indexOf(ie.activeIdentity)), ge = d(), Me = es(ge) != null || ge.queued.some((_) => Zr(_.targets, ie.identities.map(u))), W = qo(Q, (c || []).filter((_) => _.op !== "insert")), X = Di(W, L), me = W.filter((_) => _.reviewState !== X).map(pt), Se = me.length > 0 ? Et() : null;
    Se && s({
      type: "add",
      entry: { id: Se, op: "patch", targets: me, values: { reviewState: X } }
    });
    const ke = () => {
      Se && s({ type: "discard", key: Se });
    }, be = l({
      kind: "review",
      lockId: ie.activeIdentity.id,
      targets: ie.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (_) => (ke(), Z(_, {
        ...ie,
        identities: _.targets,
        activeIdentity: _.targets[ve]
      }))
    });
    return be ? (Me && S(`${L === "approved" ? "Approval" : "Rejection"} queued…`), be.done.then((_) => (_.status !== "fulfilled" && ke(), _))) : (ke(), S("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function Z({ detail: L, segments: Q, onConflict: se, onReload: ie }, ve) {
    var le;
    const ge = td(ve, Q);
    if (!ge) {
      S("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: Me, selectedSegments: W, selectedSegment: X } = ge, me = Di(W, Me), Se = W.filter((N) => N.reviewState !== me);
    if (Se.length === 0) return;
    const ke = W.map((N) => ({
      id: N.id,
      itemId: N.itemId,
      nativeSegmentId: N.nativeSegmentId
    })), be = ke.find((N) => N.id === (X == null ? void 0 : X.id)) || ke[0], _ = (N, j = !1) => {
      if (!(N != null && N.segments) || !j && !ko(J.current, be.id))
        return;
      const x = ke.map((m) => mt(N == null ? void 0 : N.segments, m)).filter(Boolean), v = mt(N == null ? void 0 : N.segments, be) || x[0] || null;
      C(x.map((m) => m.id)), w((v == null ? void 0 : v.id) ?? null), A.current = (v == null ? void 0 : v.id) ?? null, P.current = [];
    };
    S(`Updating ${Se.length} selected segment${Se.length === 1 ? "" : "s"}…`);
    const we = Et();
    s({
      type: "add",
      entry: { id: we, op: "patch", targets: Se.map(pt), values: { reviewState: me } }
    });
    try {
      const N = await ne(`/videos/${E.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: g.current.revision,
          reviewState: me,
          segments: W.map((m) => m.published ? {
            nativeSegmentId: m.nativeSegmentId,
            expectedUpdatedAt: m.updatedAt
          } : {
            itemId: m.itemId,
            expectedRevision: m.revision
          })
        })
      }), j = new Map((N.items || []).map((m) => [
        m.requestedNativeSegmentId != null ? `native:${m.requestedNativeSegmentId}` : `item:${m.requestedItemId}`,
        m
      ]));
      if (ke.forEach((m) => {
        const T = j.get(m.nativeSegmentId != null ? `native:${m.nativeSegmentId}` : `item:${m.itemId}`);
        T && (m.nativeSegmentId = T.nativeSegmentId, m.itemId = T.itemId);
      }), N.history && t(N.history), me === "rejected" && !N.editorDelta || (N.items || []).some((m) => m.requestedNativeSegmentId != null && m.nativeSegmentId !== m.requestedNativeSegmentId)) {
        const m = await ie();
        s({ type: "confirm", key: we, applied: m != null }), _(m), S(`${N.updatedCount} selected segment${N.updatedCount === 1 ? "" : "s"} ${me === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const v = N.editorDelta ? (m) => sn(m, N.editorDelta) : (m) => ({
        ...m,
        approvedSetVersion: N.approvedSetVersion || m.approvedSetVersion,
        segments: (m.segments || []).map((T) => {
          const V = j.get(T.nativeSegmentId != null ? `native:${T.nativeSegmentId}` : `item:${T.itemId}`);
          return V ? {
            ...T,
            id: V.nativeSegmentId != null ? V.nativeSegmentId : -V.itemId,
            itemId: V.itemId,
            nativeSegmentId: V.nativeSegmentId,
            published: V.nativeSegmentId != null,
            reviewState: me,
            revision: V.nativeSegmentId != null ? T.revision : V.revision,
            updatedAt: V.updatedAt
          } : T;
        })
      });
      h(v, E.id), s({ type: "confirm", key: we, applied: !0 }), _(v(L)), S(`${N.updatedCount} selected segment${N.updatedCount === 1 ? "" : "s"} ${me === "approved" ? "approved" : me === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (N) {
      s({ type: "discard", key: we }), N.status === 409 && ((le = N.payload) != null && le.currentHistory) && t(N.payload.currentHistory);
      const j = N.status === 409 ? await se() : L;
      _(j, !0), S(N.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: K, mergeSelectedSwimlane: O, saveSelectedReviewState: U };
}
function Pu(e) {
  const { acceptHistory: t, acquireSaveLock: n, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: u, detail: g, displayedSelectedSegment: y, editorFilters: h, editorRef: p, cancelSaveTasks: b, dispatchPendingChanges: k, enqueueSave: I, stableSaveIdentity: f, exportingExamples: D, hideDerivedSegments: J, incorrectExamples: Y, lineage: A, materializeButtonRef: P, materializePreview: R, materializeRestoreFocusRef: S, materializing: w, mutateSegment: C, runSegmentMutation: E, pendingChanges: K, onConflict: O, onDetailChange: U, onReload: Z, performerSlots: L, recordHistoryAction: Q, refreshMaterializationPreview: se, removingExampleId: ie, revealSegmentGroupForSelection: ve, savingSegmentId: ge, segmentGroups: Me, segments: W, selectedSegment: X, selectedSegmentIdRef: me, selectedSegments: Se, selectionAnchorIdRef: ke, selectionRangeBaseIdsRef: be, setAutoAssignError: _, setAutoAssignOpen: we, setAutoAssigning: le, setEditorFilters: N, setExportingExamples: j, setHideDerivedSegments: x, setIncorrectExamples: v, setMaterializeError: m, setMaterializeLoading: T, setMaterializeOpen: V, setMaterializePreview: ae, setMaterializing: re, setRejectedDeletionPreview: je, setRemovingExampleId: H, setSaveMessage: F, setSelectedSegmentGroupKey: $, setSelectedSegmentId: q, setSelectedSegmentIds: fe, swimlanes: he, video: te } = e;
  async function Ke() {
    var Ae, $e, Ze;
    if (Se.length === 0 || !X || ge != null) return;
    const B = Nc(Se, Y), ee = B.segments;
    if (ee.length === 0) return;
    const de = Se.map((Ue) => ({
      id: Ue.id,
      itemId: Ue.itemId,
      nativeSegmentId: Ue.nativeSegmentId
    })), pe = de.find((Ue) => Ue.id === X.id) || de[0], ce = [], De = [];
    let Ee = !1, Qe = g, Le = !1;
    const tt = [], qe = n("feedback", pe.id);
    if (qe) {
      F(B.action === "remove" ? `Removing ${ee.length} selected incorrect example${ee.length === 1 ? "" : "s"}…` : `Collecting ${ee.length} selected segment${ee.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const Ue = async (Re, Ie) => {
          const dt = Re.nativeSegmentId != null, kt = B.action === "remove" ? `incorrect-example-remove:${te.id}:${Ie == null ? void 0 : Ie.id}:${Ie == null ? void 0 : Ie.revision}:${Ie == null ? void 0 : Ie.representationRevision}` : `incorrect-example-collect:${te.id}:${dt ? `native:${Re.nativeSegmentId}:${Re.updatedAt}` : `item:${Re.itemId}:${Re.revision}`}`;
          if (B.action === "remove" && !Ie)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let bt;
          try {
            bt = B.action === "remove" ? await ne(
              `/videos/${te.id}/incorrect-examples/${Ie.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: Je(kt),
                  expectedExampleRevision: Ie.revision,
                  expectedRepresentationRevision: Ie.representationRevision
                })
              }
            ) : await ne(`/videos/${te.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Je(kt),
                nativeSegmentId: dt ? Re.nativeSegmentId : null,
                itemId: dt ? null : Re.itemId,
                expectedUpdatedAt: dt ? Re.updatedAt : null,
                expectedRevision: dt ? null : Re.revision
              })
            });
          } catch (qt) {
            throw qt.operationKey = kt, qt;
          }
          if (!Ic(B.action, bt))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return Ye(kt), bt;
        };
        for (const Re of ee) {
          const Ie = B.action === "remove" ? Y.find((dt) => dt.itemId != null && dt.itemId === Re.itemId) : null;
          try {
            const dt = de.find((St) => St.id === Re.id);
            let kt = mt(
              Qe == null ? void 0 : Qe.segments,
              dt
            ) || Re, bt;
            try {
              bt = await Ue(kt, Ie);
            } catch (St) {
              if (St.status === 409 && (($e = (Ae = St.payload) == null ? void 0 : Ae.result) == null ? void 0 : $e.code) === "OPERATION_REPLAYED")
                Qe = await ne(
                  `/videos/${te.id}/editor`
                ), Le = !0, tt.length = 0, Ye(St.operationKey), bt = St.payload.result;
              else {
                if (B.action !== "collect" || St.status !== 409) throw St;
                const It = await ne(
                  `/videos/${te.id}/editor`
                );
                Qe = It, Le = !0, tt.length = 0;
                const en = mt(
                  It == null ? void 0 : It.segments,
                  dt
                );
                if (!en) throw St;
                kt = en, bt = await Ue(kt, null);
              }
            }
            dt && bt.itemId != null && (dt.itemId = bt.itemId), Qe = sn(
              Qe,
              bt.editorDelta
            ), tt.push(bt.editorDelta);
            const qt = { segment: Re, result: bt, example: Ie };
            ce.push(qt);
          } catch (dt) {
            if (De.push(dt), ![400, 404, 409].includes(dt.status)) break;
          }
        }
        if (c && ce.length > 0) {
          const Re = B.action === "remove", Ie = ce.length;
          await Q(
            Re ? "feedback.remove" : "feedback.collect",
            Re ? `Removed ${Ie} incorrect AI example${Ie === 1 ? "" : "s"}` : `Collected ${Ie} incorrect AI example${Ie === 1 ? "" : "s"}`,
            Or(ce, Re),
            Or(ce, !Re)
          ) || (Ee = !0);
        }
        ce.some(({ result: Re }) => Re.representation === "basicNativeBin") && dr();
        const Be = ko(
          me.current,
          pe.id
        ), Ne = B.action === "collect" && ce.some(({ segment: Re }) => Re.id === pe.id), Bt = ce.map(({ segment: Re }) => Re.id), He = Ne ? Br(
          he,
          Gr(o, pe.id),
          { removedIds: Bt }
        ) : null, vt = Ne ? (He == null ? void 0 : He.id) ?? null : pe.id;
        Be && Ne && (fe(He ? [He.id] : []), q((He == null ? void 0 : He.id) ?? Ln), ke.current = (He == null ? void 0 : He.id) ?? null, be.current = []);
        const Dt = await ne(`/videos/${te.id}/incorrect-examples`);
        v(Dt);
        const nt = Qe;
        if (U(Le ? nt : (Re) => tt.reduce(sn, Re), te.id), Be && ko(
          me.current,
          vt
        )) {
          let Re, Ie;
          Ne ? (Ie = He ? mt(nt == null ? void 0 : nt.segments, {
            id: He.id,
            itemId: He.itemId,
            nativeSegmentId: He.nativeSegmentId
          }) : null, Re = Ie ? [Ie] : []) : (Re = de.map((dt) => mt(nt == null ? void 0 : nt.segments, dt)).filter(Boolean), Ie = mt(nt == null ? void 0 : nt.segments, pe) || Re[0] || null), fe(Re.map((dt) => dt.id)), q((Ie == null ? void 0 : Ie.id) ?? (Ne ? Ln : null)), ke.current = (Ie == null ? void 0 : Ie.id) ?? null, be.current = [], $(Ie ? zt(o, Ie.id) : null), Ie && ve(Ie.id);
        }
        if (De.length > 0) {
          const Re = ((Ze = De[0]) == null ? void 0 : Ze.message) || "Only segments with registered AI provenance can be collected.";
          ce.length === 0 ? F(Re) : B.action === "remove" ? F(
            `Partially removed ${ce.length} of ${ee.length} selected incorrect examples. ${Re}`
          ) : F(
            `Partially collected ${ce.length} of ${ee.length} selected segments. ${Re}`
          );
        } else if (B.action === "remove")
          F(
            `${ce.length} incorrect example${ce.length === 1 ? "" : "s"} removed and ${ce.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const Re = ce.filter(({ result: Ie }) => Ie.representation === "basicNativeBin").length;
          F(Re === ce.length ? `${ce.length} incorrect AI example${ce.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ce.length} incorrect AI example${ce.length === 1 ? "" : "s"} collected and ${ce.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        Ee && F("The change saved, but editor history could not be updated.");
      } catch (Ue) {
        F(Ue.message || "Unable to update the selected incorrect examples.");
      } finally {
        qe();
      }
    }
  }
  async function Te(B) {
    if (!B || ie != null || D) return;
    const ee = n("feedback", -1);
    if (!ee) {
      F("Wait for the current save to finish before removing the incorrect example.");
      return;
    }
    try {
      await Ce(B);
    } finally {
      ee();
    }
  }
  async function Ce(B) {
    var de, pe;
    H(B.id);
    const ee = `incorrect-example-remove:${te.id}:${B.id}:${B.revision}:${B.representationRevision}`;
    try {
      let ce, De = !1;
      try {
        ce = await ne(
          `/videos/${te.id}/incorrect-examples/${B.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Je(ee),
              expectedExampleRevision: B.revision,
              expectedRepresentationRevision: B.representationRevision
            })
          }
        );
      } catch (Le) {
        if (Le.status !== 409 || ((pe = (de = Le.payload) == null ? void 0 : de.result) == null ? void 0 : pe.code) !== "OPERATION_REPLAYED")
          throw Le;
        ce = Le.payload.result, De = !0;
      }
      Ye(ee);
      let Ee = !0;
      if (c) {
        const tt = [{ segment: mt(g.segments, {
          itemId: B.itemId
        }) || {
          id: B.itemId == null ? null : -B.itemId,
          itemId: B.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: B.representationRevision
        }, result: ce, example: B }];
        Ee = await Q(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          Or(tt, !0),
          Or(tt, !1)
        );
      }
      const Qe = await ne(
        `/videos/${te.id}/incorrect-examples`
      );
      v(Qe), De ? await Z() : U(
        (Le) => sn(Le, ce.editorDelta),
        te.id
      ), B.representation === "basicNativeBin" && dr(), F(Ee ? De ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : B.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (ce) {
      ce.status === 409 && await O(), F(ce.message || "Unable to remove the incorrect example.");
    } finally {
      H(null);
    }
  }
  async function Oe() {
    if (D || ie != null || Y.length === 0) return;
    j(!0);
    const B = `incorrect-example-export:${te.id}:${Y.map((ee) => `${ee.id}:${ee.revision}:${ee.representationRevision}`).join(",")}`;
    try {
      const ee = await $c(
        te.id,
        Y
      ), de = new FormData();
      de.append("metadata", JSON.stringify({
        operationId: Je(B),
        examples: ee.captures
      }));
      for (const Le of ee.files)
        de.append(Le.fieldName, Le.file);
      const pe = await ne(
        `/videos/${te.id}/incorrect-examples/export`,
        { method: "POST", body: de }
      ), ce = await zd(pe.downloadUrl), De = URL.createObjectURL(ce.blob), Ee = document.createElement("a");
      Ee.href = De, Ee.download = ce.fileName, Ee.click(), setTimeout(() => URL.revokeObjectURL(De), 1e3);
      const Qe = await ne(
        `/training-exports/${pe.id}/complete`,
        { method: "POST" }
      );
      Ye(B), v(await ne(
        `/videos/${te.id}/incorrect-examples`
      )), F(
        `Downloaded ${pe.exampleCount} incorrect example${pe.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Qe.clearedExampleCount} from the working collection.`
      );
    } catch (ee) {
      F(ee.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      j(!1);
    }
  }
  async function _e(B = null) {
    const ee = W.filter(($e) => $e.reviewState === "rejected"), de = ee.length, pe = Y.some(($e) => $e.representation === "fullItem");
    if (B == null && de === 0 && !pe) {
      F("There are no rejected segments to delete.");
      return;
    }
    if (B == null) {
      const $e = n("delete-rejected", -1);
      if (!$e) return;
      F("Preparing deletion summary…");
      try {
        const Ze = await ne(`/videos/${te.id}/rejected/deletion/preview`, { method: "POST" }), Ue = Number(Ze.deletedSegmentCount) || 0, Be = Number(Ze.deferredRejectedSegmentCount) || 0, Ne = Number(Ze.protectedIncorrectExampleCount) || 0;
        if (Ue === 0) {
          Be > 0 ? F(
            `${Be} feedback-protected rejected segment${Be === 1 ? "" : "s"} kept. ${Ne} AI feedback example${Ne === 1 ? "" : "s"} must be exported before ${Be === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : F("There are no rejected segments to delete.");
          return;
        }
        if (!Ba(Ze, F)) return;
        je(Ze), F("");
      } catch (Ze) {
        F(Ze.message || "Unable to prepare rejected segment deletion.");
      } finally {
        $e();
      }
      return;
    }
    const ce = B, De = Number(ce.deferredRejectedSegmentCount) || 0, Ee = me.current, Qe = ee.map(($e) => $e.id), Le = De === 0 && Qe.includes(Ee), tt = Le ? Br(
      he,
      Gr(o, Ee),
      { removedIds: Qe }
    ) : null, qe = n("delete-rejected", -1);
    if (!qe) return;
    je(null), F("Deleting rejected segments…");
    const Ae = De === 0 ? Et() : null;
    Ae && k({
      type: "add",
      entry: { id: Ae, op: "remove", targets: ee.map(pt) }
    }), Le && (fe(tt ? [tt.id] : []), q((tt == null ? void 0 : tt.id) ?? Ln), ke.current = (tt == null ? void 0 : tt.id) ?? null, be.current = []);
    try {
      const $e = `rejected-dependency-delete:${te.id}:${ce.fingerprint}`, Ze = await ne(`/videos/${te.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je($e),
          fingerprint: ce.fingerprint
        })
      });
      Ye($e);
      const Ue = await Z();
      Ae && k({ type: "confirm", key: Ae, applied: Ue != null }), Ze.deletedSegmentCount > 0 && t(Xt);
      const Be = De > 0 ? ` ${De} feedback-protected rejected segment${De === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      F(`${Ze.deletedSegmentCount} segment${Ze.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Be}`);
    } catch ($e) {
      Ae && k({ type: "discard", key: Ae }), Le && (fe(Ee == null ? [] : [Ee]), q(Ee), ke.current = Ee, be.current = []), F($e.message || "Unable to delete rejected segments.");
    } finally {
      qe();
    }
  }
  async function gt(B = i) {
    if (a || B.length === 0) return;
    const ee = n("auto-assign", -1);
    if (!ee) {
      _("Wait for the current save to finish before assigning performers.");
      return;
    }
    try {
      await Ge(B);
    } finally {
      ee();
    }
  }
  async function Ge(B) {
    le(!0), _("");
    try {
      const ee = await ne(`/videos/${te.id}/segments/auto-assign-performer-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeSegmentIds: B.flatMap((de) => de.nativeSegmentId == null ? [] : [de.nativeSegmentId]),
          itemIds: B.flatMap((de) => de.published || de.itemId == null ? [] : [de.itemId])
        })
      });
      we(!1), await Z(), F(`${ee.assignedSegmentCount} segment${ee.assignedSegmentCount === 1 ? "" : "s"} received ${ee.assignedSlotCount} performer-slot assignment${ee.assignedSlotCount === 1 ? "" : "s"}.`);
    } catch (ee) {
      _(ee.message || "Unable to auto-assign performers.");
    } finally {
      le(!1);
    }
  }
  async function ft() {
    V(!0), m(""), !R && (T(!0), se());
  }
  function ot() {
    S.current = !0, V(!1), requestAnimationFrame(() => {
      var B;
      return (B = P.current) == null ? void 0 : B.focus({ preventScroll: !0 });
    });
  }
  async function Pe() {
    if (!R || w || R.createCount + R.linkCount === 0)
      return;
    const B = n("materialize", -1);
    if (!B) {
      m("Wait for the current save to finish before materializing derived segments.");
      return;
    }
    try {
      await rt();
    } finally {
      B();
    }
  }
  async function rt() {
    re(!0), m("");
    let B;
    try {
      const ee = `materialize-derived:${te.id}:${R.fingerprint}`;
      B = await ne(`/videos/${te.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(ee),
          fingerprint: R.fingerprint,
          maxDepth: 3
        })
      }), Ye(ee);
    } catch (ee) {
      ee.status === 409 && ae(null), m(ee.message || "Unable to materialize derived segments."), re(!1);
      return;
    }
    ae((ee) => ee && { ...ee, createCount: 0, linkCount: 0 });
    try {
      await Z(), ot(), ae(null);
      const ee = B.createdCount + B.linkedCount;
      F(`${B.createdCount} derived segment${B.createdCount === 1 ? "" : "s"} created and ${B.linkedCount} existing segment${B.linkedCount === 1 ? "" : "s"} linked.`), ee === 0 && F("Every applicable derivation was already materialized.");
    } catch {
      m("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    re(!1);
  }
  async function xt(B, ee = null) {
    var Ee, Qe, Le, tt;
    const de = {
      tagId: B,
      ...ee ? { tagName: ee } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (Se.length > 1) {
      const qe = Se.filter((Ne) => Ne.tagId !== B);
      if (qe.length === 0) {
        d();
        return;
      }
      const Ae = Se.map((Ne) => ({
        id: Ne.id,
        itemId: Ne.itemId,
        nativeSegmentId: Ne.nativeSegmentId
      })), $e = Se.map((Ne) => !c || Ne.nativeSegmentId != null ? `native:${Ne.nativeSegmentId}:${Ne.updatedAt}` : `item:${Ne.itemId}:${Ne.revision}`).sort().join(","), Ze = `bulk-tag:${te.id}:${B}:${$e}`, Ue = n("tag", (X == null ? void 0 : X.id) ?? qe[0].id);
      if (!Ue) return;
      F(`Changing tag for ${qe.length} selected segment${qe.length === 1 ? "" : "s"}…`);
      const Be = Et();
      k({
        type: "add",
        entry: { id: Be, op: "patch", targets: qe.map(pt), values: de }
      }), d();
      try {
        const Ne = c ? null : crypto.randomUUID();
        await ne(`/videos/${te.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Je(Ze),
            tagId: B,
            historyReceiptId: Ne,
            segments: Se.map((nt) => {
              const Re = !c || nt.nativeSegmentId != null;
              return {
                nativeSegmentId: Re ? nt.nativeSegmentId : null,
                itemId: Re ? null : nt.itemId,
                expectedUpdatedAt: Re ? nt.updatedAt : null,
                expectedRevision: Re ? null : nt.revision
              };
            })
          })
        }), Ye(Ze);
        const Bt = Ft(
          Se,
          c
        ), He = await Z();
        k({ type: "confirm", key: Be, applied: He != null });
        const vt = Ae.map((nt) => mt(He == null ? void 0 : He.segments, nt)).filter(Boolean);
        await Q(
          "segments.tag",
          `Changed tag for ${qe.length} segment${qe.length === 1 ? "" : "s"}`,
          Bt,
          Ft(vt, c),
          Ne
        );
        const Dt = Ae.map((nt) => mt(He == null ? void 0 : He.segments, nt)).filter(Boolean);
        fe(Dt.map((nt) => nt.id)), q(((Ee = Dt.find((nt) => nt.id === (X == null ? void 0 : X.id))) == null ? void 0 : Ee.id) ?? ((Qe = Dt[0]) == null ? void 0 : Qe.id) ?? null), d(), F(`${qe.length} selected segment${qe.length === 1 ? "" : "s"} retagged.`);
      } catch (Ne) {
        k({ type: "discard", key: Be });
        const Bt = Ae.map((vt) => mt(g.segments, vt)).filter(Boolean), He = mt(g.segments, {
          id: X == null ? void 0 : X.id,
          itemId: X == null ? void 0 : X.itemId,
          nativeSegmentId: X == null ? void 0 : X.nativeSegmentId
        }) || Bt[0] || null;
        fe(Bt.map((vt) => vt.id)), q((He == null ? void 0 : He.id) ?? null), ke.current = (He == null ? void 0 : He.id) ?? null, be.current = [], Ne.status === 409 && await O(), F(Ne.message || "Unable to change the selected segment tags.");
      } finally {
        Ue();
      }
      return;
    }
    if (Se.length !== 1 || !X) return;
    const pe = ts(K, X);
    if (X.id === u || pe) {
      const qe = pe ? { segmentId: X.id, tagId: pe.values.tagId, tagName: pe.meta.tagName } : null, Ae = ad(qe, X, B, ee);
      if (Ae && !lt(X, Ae)) {
        d();
        return;
      }
      if (pe && (b(($e) => {
        var Ze;
        return ((Ze = $e.meta) == null ? void 0 : Ze.pendingChangeId) === pe.id;
      }), k({ type: "discard", key: pe.id })), Ae) {
        const $e = Sa(
          { ...X, tagId: Ae.tagId },
          L,
          h,
          J,
          Me
        );
        N($e.filters), x($e.hideDerivedSegments), F("Tag change queued…");
      } else pe && F("");
      d();
      return;
    }
    if (B === X.tagId) {
      d();
      return;
    }
    let ce = ((Le = A.data) == null ? void 0 : Le.children) ?? null;
    if (ce == null && A.loading && X.itemId != null) {
      d();
      try {
        const qe = await ne(`/videos/${te.id}/items/${X.itemId}/metadata`);
        ce = ((tt = qe == null ? void 0 : qe.lineage) == null ? void 0 : tt.children) ?? null;
      } catch {
      }
    }
    if (X.itemId != null && (ce == null ? void 0 : ce.length) > 0) {
      const qe = n("lineage-tag", X.id);
      if (!qe) {
        F("Wait for the current save to finish, then choose the tag again.");
        return;
      }
      F("Checking lineage impact…");
      let Ae = null;
      try {
        const $e = await ne(`/items/${X.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: X.revision, tagId: B })
        }), Ze = $e.deletedItemIds.length > 0 || $e.removedEdgeIds.length > 0;
        if (Ze && !window.confirm(
          `Changing this tag removes ${$e.removedEdgeIds.length} lineage edge${$e.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${$e.deletedItemIds.length} derived segment${$e.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
        )) {
          F("Tag change canceled.");
          return;
        }
        Ae = Et(), k({
          type: "add",
          entry: { id: Ae, op: "patch", targets: [pt(X)], values: de }
        }), d();
        const Ue = `tag-change:${X.itemId}:${X.revision}:${$e.componentFingerprint}:${B}`;
        await ne(`/items/${X.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Je(Ue),
            expectedRevision: X.revision,
            componentFingerprint: $e.componentFingerprint,
            tagId: B
          })
        }), Ye(Ue);
        const Be = await Z();
        k({ type: "confirm", key: Ae, applied: Be != null }), d(), F(Ze ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch ($e) {
        Ae && k({ type: "discard", key: Ae }), fe([X.id]), q(X.id), ke.current = X.id, be.current = [], $e.status === 409 ? (F("Lineage changed — loading the latest segments…"), await O()) : F($e.message || "Unable to reconcile the lineage.");
      } finally {
        qe();
      }
      return;
    }
    d();
    const De = (y == null ? void 0 : y.id) === X.id ? y : X;
    await C(X, {
      startSec: De.startSec,
      endSec: De.endSec,
      tagId: B
    }, !0, null, !0, de);
  }
  function lt(B, ee) {
    const de = Et(), pe = f(pt(B));
    k({
      type: "add",
      entry: {
        id: de,
        op: "patch",
        targets: [pe],
        values: { tagId: ee.tagId, tagName: ee.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: ee.tagName }
      }
    });
    const ce = K.find((Ee) => Ee.op === "insert" && Ee.segment.id === B.id);
    return I({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [pe],
      dependsOn: (ce == null ? void 0 : ce.taskId) ?? null,
      meta: { pendingChangeId: de },
      ready: (Ee, Qe) => {
        const Le = Za(Ee.segments, Qe.targets[0]);
        return !Le || sd(Ee, Le.id);
      },
      run: (Ee) => ht(Ee, de, ee)
    }) ? !0 : (k({ type: "discard", key: de }), F("Wait for the history restore to finish."), !1);
  }
  async function ht(B, ee, de) {
    const [pe] = B.resolveTargets();
    if (!pe) {
      k({ type: "discard", key: ee }), F(`The new segment was not retagged${de.tagName ? ` to ${de.tagName}` : ""}. Choose its tag again.`);
      return;
    }
    if (pe.tagId === de.tagId) {
      k({ type: "discard", key: ee });
      return;
    }
    await E(pe, {
      startSec: pe.startSec,
      endSec: pe.endSec,
      tagId: de.tagId
    }, {
      pendingChangeId: ee,
      restoreSelectionOnFailure: !1,
      onReload: B.onReload,
      onConflict: B.onConflict
    }) || F(`The new segment was not retagged${de.tagName ? ` to ${de.tagName}` : ""}. Choose its tag again.`);
  }
  async function Xe() {
    var Qe, Le, tt, qe;
    if (!l || !X || ge != null) return;
    const B = [...Se].sort((Ae, $e) => Number(Ae.nativeSegmentId ?? Ae.id) - Number($e.nativeSegmentId ?? $e.id)), ee = new Set(B.map((Ae) => Ae.id)), de = B.map((Ae) => `${Ae.nativeSegmentId ?? Ae.id}:${Ae.updatedAt}`).join("|"), pe = n("bin", X.id);
    if (!pe) return;
    F(`Moving ${B.length} segment${B.length === 1 ? "" : "s"} to recycling bin…`);
    const ce = `bulk-move:${te.id}:${de}`, De = Je(ce), Ee = c ? null : crypto.randomUUID();
    try {
      const Ae = (Be = !1) => ne(`/videos/${te.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: De,
          segments: B.map((Ne) => ({
            segmentId: Ne.nativeSegmentId ?? Ne.id,
            expectedUpdatedAt: Ne.updatedAt
          })),
          discardMissingImage: Be,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: Ee
        })
      });
      let $e;
      try {
        $e = await Ae(
          Fo(ce)
        );
      } catch (Be) {
        if (((Qe = Be.payload) == null ? void 0 : Qe.code) !== "missing-image" || !window.confirm(`${Be.message}

Continue and discard the missing image reference?`)) throw Be;
        Go(ce), $e = await Ae(!0);
      }
      Ye(ce), dr();
      const Ze = new Map(($e.items || []).map((Be) => [
        Number(Be.segmentId),
        Be
      ]));
      await Q(
        "segments.moveToBin",
        `Moved ${B.length} segment${B.length === 1 ? "" : "s"} to recycling bin`,
        Ft(B, !1),
        Ft(B.map((Be) => {
          const Ne = Ze.get(
            Number(Be.nativeSegmentId ?? Be.id)
          );
          return {
            ...Be,
            recycleBinItemId: (Ne == null ? void 0 : Ne.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (Ne == null ? void 0 : Ne.revision) ?? null
          };
        }), !1),
        Ee
      );
      const Ue = Br(
        he,
        Gr(o, X.id),
        { removedIds: [...ee] }
      );
      U((Be) => ({
        ...Be,
        segments: (Be.segments || []).filter((Ne) => !ee.has(Ne.id))
      }), te.id), fe(Ue ? [Ue.id] : []), q((Ue == null ? void 0 : Ue.id) ?? Ln), ke.current = (Ue == null ? void 0 : Ue.id) ?? null, be.current = [], Ue && ($(zt(o, Ue.id)), ve(Ue.id)), requestAnimationFrame(() => {
        var Be;
        return (Be = p.current) == null ? void 0 : Be.focus({ preventScroll: !0 });
      }), F(`Moved ${B.length} segment${B.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Ae) {
      const $e = ((Le = Ae.payload) == null ? void 0 : Le.code) || ((qe = (tt = Ae.payload) == null ? void 0 : tt.result) == null ? void 0 : qe.code);
      Ae.status === 409 && $e === "CANONICAL_SEGMENT_CHANGED" ? await O() : F(Ae.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      pe();
    }
  }
  async function it() {
    if (!(c || s.current || ge != null)) {
      s.current = !0, F("Checking the recycling bin…");
      try {
        const B = await ne("/bin"), ee = await Ka(B, () => F("Emptying the recycling bin…"));
        if (ee.status === "empty") {
          F("The recycling bin is empty.");
          return;
        }
        if (ee.status === "canceled") {
          F("The recycling bin was not emptied.");
          return;
        }
        F(`${ee.segmentCount} segment${ee.segmentCount === 1 ? "" : "s"} from ${ee.sceneCount} scene${ee.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (B) {
        F(B.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: Ke, removeIncorrectExample: Te, captureTrainingExport: Oe, deleteRejectedSegments: _e, autoAssignPerformers: gt, previewDerivedSegments: ft, closeMaterializeDialog: ot, materializeDerivedSegments: Pe, saveTag: xt, moveToBin: Xe, emptyRecyclingBin: it };
}
function Lu(e) {
  const { acceptHistory: t, acquireSaveLock: n, enqueueSave: o, getSaveQueueSnapshot: i, commonActionsRef: a, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: u, history: g, historyRef: y, historySaving: h, horizontalLayoutSize: p, mediaStackHeight: b, mediaStackRef: k, onDetailChange: I, onReload: f, railToggleRef: D, recordHistoryAction: J, savingSegmentId: Y, setCollapsedSegmentGroups: A, setEditorLayout: P, setHistorySaving: R, setIncorrectExamples: S, setSaveMessage: w, shotBoundaries: C, timelineDuration: E, video: K, workspaceRef: O } = e;
  async function U(j, x, v) {
    var ae, re, je, H;
    const m = j.type === "segment" ? [j] : j.segments || [], T = (x == null ? void 0 : x.type) === "segment" ? [x] : (x == null ? void 0 : x.segments) || [];
    let V = v;
    for (const [F, $] of m.entries()) {
      const q = T[F], fe = ((ae = $.identity) == null ? void 0 : ae.nativeSegmentId) != null || ((re = $.identity) == null ? void 0 : re.published) === !0, he = ((je = q == null ? void 0 : q.identity) == null ? void 0 : je.recycleBinItemId) ?? ((H = q == null ? void 0 : q.identity) == null ? void 0 : H.itemId);
      let te = mt(V.segments, q == null ? void 0 : q.identity) || mt(V.segments, $.identity);
      if (!te && fe && he != null && q.identity.revision != null) {
        const Ce = `history-restore:${K.id}:${he}:${q.identity.revision}`;
        await ne(`/bin/${he}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Je(Ce),
            expectedRevision: q.identity.revision
          })
        }), Ye(Ce), V = await f(), te = V.segments.find((Oe) => Oe.tagId === $.values.tagId && Oe.startSec === $.values.startSec && Oe.endSec === $.values.endSec);
      }
      if (!te)
        throw new Error("A segment in this history state no longer exists.");
      if ((te.nativeSegmentId != null || te.published === !0) !== fe) {
        if (fe) {
          const Ce = te.recycleBinItemId ?? te.itemId ?? he;
          if (Ce == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Oe = `history-restore:${K.id}:${Ce}:${te.revision}:${$.values.reviewState ?? "native"}`;
          await ne(`/bin/${Ce}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Je(Oe),
              expectedRevision: te.revision
            })
          }), Ye(Oe);
        } else {
          const Ce = `history-bin:${K.id}:${te.nativeSegmentId}:${te.updatedAt}:${$.values.reviewState}`;
          await ne(`/videos/${K.id}/segments/${te.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Je(Ce),
              expectedUpdatedAt: te.updatedAt,
              reviewState: $.values.reviewState
            })
          }), Ye(Ce);
        }
        if (V = await f(), !fe)
          continue;
        if (te = mt(V.segments, $.identity) || V.segments.find((Ce) => Ce.tagId === $.values.tagId && Ce.startSec === $.values.startSec && Ce.endSec === $.values.endSec), !te)
          throw new Error("The restored segment could not be found.");
      }
      const Te = $.values;
      if (te.nativeSegmentId == null && te.itemId != null) {
        const Ce = `history-draft-update:${K.id}:${te.itemId}:${te.revision}:${Te.tagId}:${Te.startSec}:${Te.endSec ?? "open"}:${Te.reviewState}`;
        await ne(`/videos/${K.id}/drafts/${te.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Je(Ce),
            expectedRevision: te.revision,
            ...Te
          })
        }), Ye(Ce);
      } else
        await ne(`/videos/${K.id}/segments/${te.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Te, expectedUpdatedAt: te.updatedAt })
        });
      V = await f();
    }
    return V;
  }
  async function Z(j, x) {
    var v;
    for (const m of j.targets || []) {
      const T = mt(x.segments, m.identity);
      if (!T)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const V = (v = x.performerSlotRevisions) == null ? void 0 : v[T.id];
      await ne(T.published ? `/videos/${K.id}/segments/${T.nativeSegmentId}/slots` : `/videos/${K.id}/drafts/${T.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: V,
          assignments: m.assignments
        })
      }), x = await f();
    }
    return x;
  }
  async function L(j, x, v) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let m = x, T = await ne(`/videos/${K.id}/incorrect-examples`);
    const V = (ae) => T.find((re) => {
      var je;
      return re.id === ae.exampleId || ((je = ae.collectedIdentity) == null ? void 0 : je.itemId) != null && re.itemId === ae.collectedIdentity.itemId;
    });
    for (const [ae, re] of (j.entries || []).entries()) {
      const je = `history-feedback:${K.id}:${v.action.sequence}:${v.direction}:${ae}`, H = V(re);
      if (j.collected && H) {
        Ye(je);
        continue;
      }
      let F;
      if (j.collected) {
        const $ = mt(
          m.segments,
          re.collectedIdentity
        ) || mt(
          m.segments,
          re.originalIdentity
        );
        if (!$)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const q = $.nativeSegmentId != null;
        F = await ne(`/videos/${K.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Je(je),
            nativeSegmentId: q ? $.nativeSegmentId : null,
            itemId: q ? null : $.itemId,
            expectedUpdatedAt: q ? $.updatedAt : null,
            expectedRevision: q ? null : $.revision
          })
        });
      } else {
        if (!H) {
          Ye(je);
          continue;
        }
        F = await ne(
          `/videos/${K.id}/incorrect-examples/${H.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Je(je),
              expectedExampleRevision: H.revision,
              expectedRepresentationRevision: H.representationRevision
            })
          }
        );
      }
      Ye(je), m = sn(
        m,
        F.editorDelta
      ), T = await ne(
        `/videos/${K.id}/incorrect-examples`
      );
    }
    return S(T), m;
  }
  async function Q(j, x, v = []) {
    const m = j.state;
    if (!s && ((m == null ? void 0 : m.type) === "segment" || (m == null ? void 0 : m.type) === "segments")) {
      const V = `basic-history:${K.id}:${y.current.revision}:${j.action.sequence}:${j.direction}`, ae = await ne(`/videos/${K.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(V),
          expectedHistoryRevision: y.current.revision,
          actionSequence: j.action.sequence,
          direction: j.direction
        })
      });
      return t(ae.history), v.push(V), f();
    }
    const T = j.direction === "backward" ? j.action.afterState : j.action.beforeState;
    if ((m == null ? void 0 : m.type) === "composite") {
      let V = x;
      const ae = (T == null ? void 0 : T.type) === "composite" ? T.states || [] : [];
      for (const [re, je] of (m.states || []).entries()) {
        const H = ae[re];
        V = await Q({
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
    if ((m == null ? void 0 : m.type) === "segment" || (m == null ? void 0 : m.type) === "segments")
      return U(
        m,
        T,
        x
      );
    if ((m == null ? void 0 : m.type) === "performerSlots")
      return Z(m, x);
    if ((m == null ? void 0 : m.type) === "incorrectExamples")
      return L(m, x, j);
    if ((m == null ? void 0 : m.type) === "shots") {
      const V = go(x.shotBoundaries || []), ae = await ne(`/videos/${K.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(`history-shots:${K.id}:${V}:${m.fingerprint}`),
          expectedFingerprint: V,
          boundaries: m.boundaries
        })
      });
      return { ...x, shotBoundaries: ae };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function se(j) {
    if (h || j === g.cursorSequence) return;
    if (Y != null) {
      w("Finish the pending saves before restoring history.");
      return;
    }
    if (zi(g, j).length === 0) return;
    const v = o({
      kind: "history",
      lockId: -1,
      exclusive: !0,
      run: (m) => ie(m.detail, j)
    });
    if (!v) {
      w("Finish the pending saves before restoring history.");
      return;
    }
    await v.done;
  }
  async function ie(j, x) {
    var m;
    const v = zi(y.current, x);
    if (v.length !== 0) {
      R(!0), w(`Restoring ${v.length} history ${v.length === 1 ? "action" : "actions"}…`);
      try {
        let T = j;
        const V = [];
        for (const re of v)
          T = await Q(
            re,
            T,
            V
          );
        const ae = s ? await ne(`/videos/${K.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: y.current.revision,
            targetSequence: x
          })
        }) : y.current;
        V.forEach(Ye), t(ae), await f(), w("History restored.");
      } catch (T) {
        T.status === 409 && ((m = T.payload) != null && m.current) && t(T.payload.current), await f(), w(T.message || "Unable to restore editor history.");
      } finally {
        R(!1);
      }
    }
  }
  function ve(j) {
    P((x) => ({ ...x, timelineRatio: Lo(j, b) }));
  }
  function ge(j) {
    var m, T;
    const x = (m = k.current) == null ? void 0 : m.getBoundingClientRect();
    if (!x) return;
    const v = ((T = a.current) == null ? void 0 : T.offsetHeight) || 0;
    ve(Tl(
      j.clientY,
      x.top + v,
      Math.max(0, x.height - v)
    ));
  }
  function Me(j) {
    j.currentTarget.setPointerCapture(j.pointerId), ge(j);
  }
  function W(j) {
    j.currentTarget.hasPointerCapture(j.pointerId) && ge(j);
  }
  function X(j) {
    const x = j.shiftKey ? 0.1 : 0.05;
    let v = null;
    j.key === "ArrowUp" && (v = c.timelineRatio + x), j.key === "ArrowDown" && (v = c.timelineRatio - x);
    const m = Po(b);
    j.key === "Home" && (v = m.minimum), j.key === "End" && (v = m.maximum), v != null && (j.preventDefault(), j.stopPropagation(), ve(v));
  }
  function me(j) {
    const x = j === "detailWidth" ? p.focusRow : p.workspace, v = p.workspace > 0 ? vo(p.workspace, 600) : 560, m = bn(c.markerRailWidth, v), T = j === "detailWidth" ? 344 + (c.markerRailOpen ? m + 24 : 0) : 600;
    return x > 0 ? vo(x, T) : 560;
  }
  function Se(j, x) {
    P((v) => ({ ...v, [j]: bn(x, me(j)) }));
  }
  function ke(j, x) {
    var m, T;
    const v = x === "detailWidth" ? (m = u.current) == null ? void 0 : m.getBoundingClientRect() : (T = O.current) == null ? void 0 : T.getBoundingClientRect();
    v && Se(x, x === "detailWidth" ? j.clientX - v.left : v.right - j.clientX);
  }
  function be(j, x) {
    const v = me(j), m = bn(c[j], v);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": x,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(v),
      "aria-valuenow": Math.round(m),
      "aria-valuetext": `${Math.round(m)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (T) => {
        T.currentTarget.setPointerCapture(T.pointerId), ke(T, j);
      },
      onPointerMove: (T) => {
        T.currentTarget.hasPointerCapture(T.pointerId) && ke(T, j);
      },
      onKeyDown: (T) => {
        const V = T.shiftKey ? 40 : 16;
        let ae = null;
        T.key === "ArrowLeft" && (ae = j === "detailWidth" ? -V : V), T.key === "ArrowRight" && (ae = j === "detailWidth" ? V : -V);
        let re = ae == null ? null : m + ae;
        T.key === "Home" && (re = 240), T.key === "End" && (re = v), re != null && (T.preventDefault(), T.stopPropagation(), Se(j, re));
      },
      onDoubleClick: () => Se(j, Ot[j]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function _() {
    P((j) => ({ ...j, markerRailOpen: !j.markerRailOpen })), requestAnimationFrame(() => {
      var j;
      return (j = D.current) == null ? void 0 : j.focus({ preventScroll: !0 });
    });
  }
  function we(j) {
    A((x) => x.includes(j) ? x.filter((v) => v !== j) : dn([...x, j]));
  }
  function le(j, x = !0, v = l) {
    const m = i().running != null, T = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (V) => N(V.detail, j, x, v)
    });
    return T ? (m && w(j === "split" ? "Shot boundary queued…" : "Shot merge queued…"), T.done.then((V) => V.value ?? null)) : (w("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function N(j, x, v, m) {
    var je;
    const T = (j == null ? void 0 : j.shotBoundaries) || [], V = Number((je = K.videoFile) == null ? void 0 : je.duration) || E, ae = go(T), re = `shot-${x}:${K.id}:${m.toFixed(3)}:${V.toFixed(3)}:${ae}`;
    w(x === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const H = await ne(`/videos/${K.id}/shot-boundaries/${x}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Je(re), timeSec: m })
      });
      return Ye(re), I((F) => ({ ...F, shotBoundaries: H }), K.id), v && await J(
        "shots.update",
        x === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: T,
          fingerprint: ae
        },
        {
          type: "shots",
          boundaries: H,
          fingerprint: go(H)
        }
      ), w(x === "split" ? "Shot boundary added." : "Shots merged."), H;
    } catch (H) {
      return w(H.message || "Unable to edit shot boundaries."), null;
    }
  }
  return { applySegmentHistoryState: U, applyPerformerSlotHistoryState: Z, applyHistoryState: Q, restoreHistoryTarget: se, updateTimelineRatio: ve, updateTimelineRatioFromPointer: ge, handleSeparatorPointerDown: Me, handleSeparatorPointerMove: W, handleSeparatorKeyDown: X, panelWidthMaximum: me, updatePanelWidth: Se, handlePanelSeparatorPointer: ke, panelSeparatorProps: be, toggleSegmentRail: _, toggleSegmentGroup: we, mutateShotBoundary: le };
}
function ju(e) {
  const { allSwimlanes: t, applyShortcutTiming: n, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, displayedSelectedSegment: d, duplicateSegment: c, editorLayout: u, editorRef: g, emptyRecyclingBin: y, lineage: h, mediaDuration: p, mergeSelectedSwimlane: b, moveToBin: k, mutateShotBoundary: I, openPublishApprovedDialog: f, playbackControlsRef: D, playbackShortcutConfig: J, saveSelectedReviewState: Y, seekRef: A, segmentGroupKeys: P, selectSegment: R, selectedSegment: S, selectedSegmentGroupForSegment: w, selectedSegmentGroupKey: C, selectedSegments: E, setCollapsedSegmentGroups: K, setIncorrectExamplesOpen: O, setQuickSearchOpen: U, setSaveMessage: Z, setSelectedSegmentGroupKey: L, setTagEditing: Q, setTimelineZoom: se, shotBoundaries: ie, slotButtonRef: ve, splitSegment: ge, swimlanes: Me, timelineDuration: W, toggleIncorrectExample: X, toggleSegmentGroup: me, updateTimelineRatio: Se, videoFrameRate: ke, visibleSegments: be } = e;
  function _(N) {
    var j, x;
    (j = D.current) == null || j.pause(), (x = D.current) == null || x.seekBy(cd(N, ke));
  }
  function we(N, j) {
    if (E.length > 1 && Jl(N.id))
      return;
    let x = null;
    N.id === "video.playPause" && (x = () => {
      var m;
      return (m = D.current) == null ? void 0 : m.toggle();
    }), N.id === "video.seekSmallBackward" && (x = () => {
      var m;
      return (m = D.current) == null ? void 0 : m.seekBy(-J.smallSeekTime);
    }), N.id === "video.seekSmallForward" && (x = () => {
      var m;
      return (m = D.current) == null ? void 0 : m.seekBy(J.smallSeekTime);
    }), N.id === "video.seekMediumBackward" && (x = () => {
      var m;
      return (m = D.current) == null ? void 0 : m.seekBy(-J.mediumSeekTime);
    }), N.id === "video.seekMediumForward" && (x = () => {
      var m;
      return (m = D.current) == null ? void 0 : m.seekBy(J.mediumSeekTime);
    }), N.id === "video.seekLongBackward" && (x = () => {
      var m;
      return (m = D.current) == null ? void 0 : m.seekBy(-J.longSeekTime);
    }), N.id === "video.seekLongForward" && (x = () => {
      var m;
      return (m = D.current) == null ? void 0 : m.seekBy(J.longSeekTime);
    }), N.id === "video.playSelected" && S && (x = () => {
      var m;
      (m = A.current) == null || m.call(A, S.startSec, !0), requestAnimationFrame(() => {
        var T;
        return (T = g.current) == null ? void 0 : T.focus({ preventScroll: !0 });
      });
    }), (N.id === "video.playPreviousSegment" || N.id === "video.playNextSegment") && (x = () => {
      var T;
      const m = Co(
        Me,
        S == null ? void 0 : S.id,
        N.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !m || m.id === (S == null ? void 0 : S.id) || (R(m, { focusEditor: !0, seekToSegment: !1 }), (T = A.current) == null || T.call(A, m.startSec, !0));
    }), N.id.startsWith("video.seekPercent") && (x = () => {
      var T;
      const m = Number(N.id.slice(17)) / 10;
      (T = A.current) == null || T.call(A, Hl(p ?? W, m), !1);
    }), N.id === "video.jumpToSegmentStart" && S && (x = () => {
      var m;
      return (m = A.current) == null ? void 0 : m.call(A, S.startSec, !1);
    }), N.id === "video.jumpToSegmentEnd" && S && (x = () => {
      var m;
      return (m = A.current) == null ? void 0 : m.call(A, S.endSec ?? S.startSec, !1);
    }), N.id === "video.jumpToVideoStart" && (x = () => {
      var m;
      return (m = A.current) == null ? void 0 : m.call(A, 0, !1);
    }), N.id === "video.jumpToVideoEnd" && (x = () => {
      var m;
      return (m = A.current) == null ? void 0 : m.call(A, W, !1);
    }), N.id.startsWith("video.frame") && (x = () => {
      const m = N.id.includes("Small") ? "small" : N.id.includes("Medium") ? "medium" : "long", T = J[`${m}FrameStep`] * (N.id.endsWith("Backward") ? -1 : 1);
      _(T);
    }), N.id.startsWith("navigation.swimlane") && (x = () => {
      const m = N.id.slice(19).toLowerCase(), T = Co(Me, S == null ? void 0 : S.id, m, s);
      T && R(T, { focusEditor: !0, seekToSegment: !1 });
    }), (N.id === "navigation.extendSwimlaneLeft" || N.id === "navigation.extendSwimlaneRight") && (x = () => {
      const m = Sc(
        t,
        S == null ? void 0 : S.id,
        N.id.endsWith("Left") ? "left" : "right"
      );
      m && R(m.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: m.segmentIds
      });
    }), (N.id === "navigation.segmentGroupUp" || N.id === "navigation.segmentGroupDown") && (x = () => {
      const m = xc(
        P,
        C ?? w,
        N.id.endsWith("Up") ? -1 : 1
      );
      m && L(m);
    }), (N.id === "navigation.previousAtPlayhead" || N.id === "navigation.nextAtPlayhead") && (x = () => {
      const m = Rl(be, s, N.id === "navigation.previousAtPlayhead" ? -1 : 1, S == null ? void 0 : S.id);
      m && R(m, { focusEditor: !0, seekToSegment: !1 });
    }), N.id === "navigation.nearestInCurrentSwimlane" && (x = () => {
      const m = hl(
        Me,
        S == null ? void 0 : S.id,
        s
      );
      m && R(m, { focusEditor: !0, seekToSegment: !1 });
    }), N.id.includes("Unreviewed") && (x = () => {
      const m = zr(
        Me,
        S == null ? void 0 : S.id,
        N.id.startsWith("navigation.previous") ? -1 : 1,
        N.id.endsWith("Global")
      );
      m && R(m, { focusEditor: !j.preserveFocus, seekToSegment: !1 });
    }), (N.id === "navigation.nextTouchingPlayhead" || N.id === "navigation.previousTouchingPlayhead") && (x = () => {
      const m = bl(Me, s, N.id === "navigation.previousTouchingPlayhead" ? -1 : 1, S == null ? void 0 : S.id);
      m && R(m, { focusEditor: !0, seekToSegment: !1 });
    }), N.id === "navigation.quickSearch" && (x = () => U(!0)), (N.id === "navigation.previousShot" || N.id === "navigation.nextShot") && (x = () => {
      var T;
      const m = dd(ie, s, N.id === "navigation.previousShot" ? -1 : 1);
      m && ((T = A.current) == null || T.call(A, m.startSec, !1));
    }), N.id === "shot.split" && (x = () => I("split")), N.id === "shot.merge" && (x = () => I("merge")), N.id === "marker.create" && (x = () => a()), N.id === "marker.duplicate" && (x = () => c(!1)), N.id === "marker.duplicateAtPlayhead" && (x = () => c(!0)), N.id === "marker.split" && (x = () => ge()), N.id === "marker.editTag" && (x = () => {
      if (E.length > 1 && E.some((m) => m.isDerived)) {
        Z("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if (h.data ? h.data.tagReadOnly : S != null && S.isDerived) {
        Z("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      Q(!0);
    });
    const v = (d == null ? void 0 : d.id) === (S == null ? void 0 : S.id) ? d : S;
    N.id === "marker.setStart" && S && (x = () => n(s, v.endSec)), N.id === "marker.setEnd" && S && (x = () => n(v.startSec, s)), N.id === "marker.copyTiming" && S && (x = () => {
      Z(Yc(S) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), N.id === "marker.pasteTiming" && S && (x = () => {
      const m = Jc();
      if (!m) {
        Z("No copied segment timing is available.");
        return;
      }
      n(m.startSec, m.endSec);
    }), N.id === "marker.mergeSelection" && (x = () => b()), N.id === "marker.moveToBin" && (x = () => k()), N.id === "marker.toggleIncorrectExample" && S && (x = () => X()), N.id === "marker.openIncorrectExamples" && (x = () => O(!0)), N.id === "markerGroup.toggleCollapse" && C && (x = () => me(C)), N.id === "markerGroup.toggleAll" && (x = () => K((m) => vc(m, P))), N.id === "marker.assignSlots" && (x = () => {
      var m;
      return (m = ve.current) == null ? void 0 : m.click();
    }), N.id === "navigation.zoomIn" && (x = () => se((m) => _r(m + 0.5))), N.id === "navigation.zoomOut" && (x = () => se((m) => _r(m - 0.5))), N.id === "navigation.resetZoom" && (x = () => se(1)), N.id === "navigation.centerPlayhead" && (x = () => {
      var m;
      return (m = o.current) == null ? void 0 : m.call(o);
    }), N.id === "layout.growSwimlanes" && (x = () => Se(u.timelineRatio + 0.05)), N.id === "layout.shrinkSwimlanes" && (x = () => Se(u.timelineRatio - 0.05)), N.id === "marker.confirm" && S && (x = () => Y("approved")), N.id === "system.publishApproved" && (x = () => f(j.target)), N.id === "marker.reject" && S && (x = () => Y("rejected")), N.id === "system.emptyBin" && (x = () => y()), N.id === "system.deleteRejected" && (x = () => l()), x && x();
  }
  function le(N, j) {
    const x = pr.find((v) => v.id === N);
    x && Bn(x, i) && we(x, j);
  }
  return {
    executeShortcutById: le,
    stepVideoFrame: (N) => _(N < 0 ? -1 : 1)
  };
}
const Fu = 3e4;
function Gu(e) {
  return e === !0;
}
function Bu() {
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
function Uu({
  fetchRuns: e,
  onCompletedRun: t,
  windowTarget: n,
  documentTarget: o,
  intervalMs: i = Fu
}) {
  const a = Bu();
  let s = null, l = !1, d = null;
  const c = () => o.visibilityState !== "hidden";
  async function u() {
    if (!(l || !a.isActive())) {
      l = !0;
      try {
        const p = await e(a.signal);
        if (!a.isActive()) return;
        const b = (Array.isArray(p) ? p : []).filter((I) => (I == null ? void 0 : I.status) === "completed" && I.id != null).map((I) => String(I.id));
        if (s === null) {
          s = new Set(b);
          return;
        }
        const k = b.filter((I) => !s.has(I));
        if (k.length === 0) return;
        k.forEach((I) => s.add(I)), await t();
      } catch {
      } finally {
        l = !1;
      }
    }
  }
  function g() {
    clearTimeout(d), d = null, !(!a.isActive() || !c()) && (d = setTimeout(async () => {
      d = null, await u(), g();
    }, i));
  }
  function y() {
    u();
  }
  function h() {
    c() ? (u(), g()) : (clearTimeout(d), d = null);
  }
  return u(), g(), n.addEventListener("focus", y), o.addEventListener("visibilitychange", h), function() {
    a.dispose(), clearTimeout(d), d = null, n.removeEventListener("focus", y), o.removeEventListener("visibilitychange", h);
  };
}
function Ku(e, t, n, o = !1, i = () => () => {
}) {
  const [a, s] = G({
    busy: !1,
    reviewState: null,
    error: ""
  }), l = ue(n);
  ye(() => {
    l.current = n;
  }, [n]);
  async function d(c) {
    const u = i("import", -1);
    if (!u) {
      s({ busy: !1, reviewState: null, error: "Wait for the current save to finish before importing Cove segments." });
      return;
    }
    s({ busy: !0, reviewState: c, error: "" });
    try {
      await ne(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Io(), reviewState: c })
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
  return ye(() => {
    if (Gu(o))
      return Uu({
        fetchRuns: (c) => ne(`/videos/${e}/analysis-runs`, { signal: c }),
        onCompletedRun: () => l.current(),
        windowTarget: window,
        documentTarget: document
      });
  }, [e, o]), {
    importNativeSegments: d,
    nativeImportState: a
  };
}
const sr = Object.freeze([]);
function zu(e, t) {
  var o;
  const n = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = n == null ? void 0 : n.focus) == null || o.call(n, { preventScroll: !0 });
}
function _u({ detail: e, onDetailChange: t, onConflict: n, onReload: o, onAnalysisCompleted: i, onSlotsChanged: a, splitLayout: s, initialSegmentId: l, compatibilityMode: d = !1, profile: c, onNavigate: u }) {
  var yi, bi, hi, vi, Si;
  const g = ue(null), y = ue(/* @__PURE__ */ new Map()), [h, p] = G(0), b = ue(null);
  b.current = { onReloadProjection: o, onConflictProjection: n };
  const [{ onReload: k, onConflict: I }] = G(() => {
    const M = () => {
      y.current.clear(), p((oe) => oe + 1);
    };
    return {
      onReload: (...oe) => (M(), b.current.onReloadProjection(...oe)),
      onConflict: (...oe) => (M(), b.current.onConflictProjection(...oe))
    };
  }), [f, D] = G(null), [J, Y] = G([]), A = ue(null), P = ue(null), R = ue([]), S = ue(null), [w, C] = G(() => Gt({})), [E, K] = G(!1), [O, U] = G(ql), [Z, L] = G(0), Q = ue(null), [se] = G(() => Oc({
    getContext: () => Q.current,
    drainAfterSettle: !1
  })), ie = jd(se.subscribe, se.getSnapshot), ve = es(ie), ge = (M, oe) => se.acquire({ kind: M, lockId: oe }), Me = (M) => se.enqueue(M), W = (M) => se.stableIdentity(M), X = ue(!1);
  ye(() => (X.current = !0, () => {
    X.current = !1, queueMicrotask(() => {
      X.current || se.dispose();
    });
  }), []);
  const me = (M) => se.cancel(M), Se = (M, oe) => se.retarget(M, oe), ke = se.getSnapshot, [be, _] = Ld(Uc, []), [we, le] = G(""), [N, j] = G(""), [x, v] = G(""), [m, T] = G(1), [V, ae] = G(Hc), [re, je] = G(0), [H, F] = G({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [$, q] = G(Xt), fe = ue(Xt), [he, te] = G(!1), [Ke, Te] = G(!1), [Ce, Oe] = G(!1), _e = ue(!1);
  _e.current = Ce;
  const [gt, Ge] = G(null), [ft, ot] = G(!1), [Pe, rt] = G(null), [xt, lt] = G(null), ht = ue(null), [Xe, it] = G(!1), [B, ee] = G(""), de = ue(null), pe = ue(null), ce = ue(!1), [De, Ee] = G(qc), [Qe, Le] = G(null), [tt, qe] = G(!1), [Ae, $e] = G(!1), [Ze, Ue] = G(!1), [Be, Ne] = G(!1), [Bt, He] = G(!1), [vt, Dt] = G(""), {
    importNativeSegments: nt,
    nativeImportState: Re
  } = Ku(
    e.video.id,
    k,
    i,
    d,
    (M, oe) => se.acquire({ kind: M, lockId: oe })
  ), [Ie, dt] = G(!1), [kt, bt] = G(null), [qt, St] = G(d), [It, en] = G(0), [cn, tn] = G(!1), [zn, _n] = G(""), [hr, vr] = G(null), Hn = ue(null), Sr = ue(null), qn = ue(!1), [un, kn] = G([]), [wn, xr] = G(!1), [Wn, to] = G(null), Vn = zc(), Jn = ue(null), Yn = ue(null), Nn = ue(null), kr = ue(l), wr = ue(null), Qn = ue(null), mn = ue(null), Xn = ue(null), Ut = ue(null), Ct = ue(null), Zn = ue(null), er = ue(null), Nr = ue(null), Ir = ue(null), In = ue(null), tr = ue(null), Cr = ue(-1e12), no = ue(null), nr = ue(null), [at, Cn] = G({ scrollTop: 0, height: 512 });
  ye(() => {
    if (!Ie || cn || !zn) return;
    const M = requestAnimationFrame(() => {
      var oe;
      return (oe = Sr.current) == null ? void 0 : oe.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(M);
  }, [Ie, cn, zn]), ye(() => {
    if (!qn.current || Ie || qt) return;
    const M = requestAnimationFrame(() => {
      var oe;
      (oe = Hn.current) == null || oe.focus({ preventScroll: !0 }), qn.current = !1;
    });
    return () => cancelAnimationFrame(M);
  }, [Ie, qt]);
  const st = e.video, wt = e.segments || sr, $r = Ve(() => JSON.stringify({
    segments: wt.map((M) => [
      M.id,
      M.itemId,
      M.nativeSegmentId,
      M.tagId,
      M.startSec,
      M.endSec,
      M.reviewState,
      M.published,
      M.sourceKey,
      M.sourceRunId,
      M.confidence,
      M.revision,
      M.updatedAt
    ]),
    performerSlots: (e.performerSlots || sr).map((M) => [
      M.segmentId,
      M.slotDefinitionId,
      M.performerId,
      M.sortOrder
    ])
  }), [wt, e.performerSlots]);
  ye(() => {
    if (!d) {
      bt(null), St(!1);
      return;
    }
    if (ve != null) {
      St(!0);
      return;
    }
    let M = !0;
    St(!0);
    const oe = setTimeout(() => {
      ne(`/videos/${st.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((ze) => {
        M && (bt(ze), _n(""));
      }).catch((ze) => {
        M && (bt(null), _n(ze.message || "Unable to preview derived segments."));
      }).finally(() => {
        M && St(!1);
      });
    }, 150);
    return () => {
      M = !1, clearTimeout(oe);
    };
  }, [d, st.id, $r, It, ve]);
  const gn = () => en((M) => M + 1), Wt = e.segmentGroups || sr, $t = e.performerSlots || sr, Tr = d && e.performerSlotsAvailable !== !1, fn = Ve(
    () => (e.performerCandidates || []).filter((M) => M.isVideoPerformer),
    [e.performerCandidates]
  ), $n = e.shotBoundaries || sr, rr = Ve(
    () => Wa($t),
    [$t]
  ), Tn = Ve(
    () => wt.map((M) => {
      const oe = rr.get(M.id) || [];
      return {
        ...M,
        slots: oe,
        assignment: oe.every((ze) => ze.performerId == null) ? Rd(oe, fn) : null
      };
    }).filter((M) => M.slots.length > 0 && M.assignment != null),
    [wt, rr, fn]
  ), pn = Number((yi = st.videoFile) == null ? void 0 : yi.frameRate) > 0 ? Number(st.videoFile.frameRate) : 30;
  function Rn() {
    const M = _e.current;
    Oe(!1), M && requestAnimationFrame(() => {
      var oe;
      return (oe = Ct.current) == null ? void 0 : oe.focus({ preventScroll: !0 });
    });
  }
  function ro() {
    ve == null && (tr.current = null, ot(!1), le(""), requestAnimationFrame(() => {
      var M;
      return (M = Ct.current) == null ? void 0 : M.focus({ preventScroll: !0 });
    }));
  }
  function oo() {
    K(!1), requestAnimationFrame(() => {
      var M, oe;
      (M = er.current) != null && M.isConnected ? er.current.focus({ preventScroll: !0 }) : (oe = Ct.current) == null || oe.focus({ preventScroll: !0 });
    });
  }
  ye(() => {
    In.current === f ? (In.current = null, Oe(!0)) : Oe(!1);
  }, [f]), ye(() => {
    var oe;
    if (!Ce) return;
    const M = (oe = Ir.current) == null ? void 0 : oe.querySelector("input");
    document.activeElement !== M && (M == null || M.focus({ preventScroll: !0 }), M == null || M.select());
  }, [Ce, f]), ye(() => {
    var oe;
    if (Ce) return;
    const M = (oe = Ct.current) == null ? void 0 : oe.ownerDocument;
    M && M.activeElement === M.body && Ct.current.focus({ preventScroll: !0 });
  }, [Ce]), ye(() => {
    var ze, ut, Nt;
    const M = vn(
      uo(
        e.segments,
        e.performerSlots || [],
        Gt({}),
        d && O,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), oe = ((ze = e.segments.find((On) => On.id === l)) == null ? void 0 : ze.id) ?? ((ut = ya(M)) == null ? void 0 : ut.id) ?? null;
    D(oe), Y(oe == null ? [] : [oe]), P.current = oe, R.current = [], Le(zt(M, oe)), C(Gt({})), K(!1), tr.current = null, ot(!1), T(1), le(""), q(Xt), fe.current = Xt, te(!1), (Nt = Ct.current) == null || Nt.focus({ preventScroll: !0 });
  }, [st.id, l]), ye(() => {
    const M = new AbortController();
    return ne(`/videos/${st.id}/incorrect-examples`, { signal: M.signal }).then(kn).catch((oe) => {
      oe.name !== "AbortError" && kn([]);
    }), () => M.abort();
  }, [st.id, c == null ? void 0 : c.effectiveMode]), ye(() => {
    const M = new AbortController();
    return ne(`/videos/${st.id}/history`, { signal: M.signal }).then((oe) => {
      const ze = oe || Xt;
      fe.current = ze, q(ze);
    }).catch((oe) => {
      oe.name !== "AbortError" && le(oe.message || "Unable to load editor history.");
    }), () => M.abort();
  }, [st.id]), ye(() => {
    Vc(V);
  }, [V.timelineRatio, V.markerRailOpen, V.detailWidth, V.markerRailWidth, V.swimlaneTitleWidth]), ye(() => {
    Wc(De);
  }, [De]), ye(() => {
    Wl(O);
  }, [O]), ye(() => {
    const M = Qn.current;
    if (!s || !M || typeof ResizeObserver > "u") return;
    const oe = () => {
      var Nt;
      const ut = Math.max(0, M.clientHeight - (((Nt = mn.current) == null ? void 0 : Nt.offsetHeight) || 0));
      je(ut), ae((On) => {
        const xi = Lo(On.timelineRatio, ut);
        return xi === On.timelineRatio ? On : { ...On, timelineRatio: xi };
      });
    }, ze = new ResizeObserver(oe);
    return ze.observe(M), mn.current && ze.observe(mn.current), oe(), () => ze.disconnect();
  }, [s]), ye(() => {
    if (!Vn || typeof ResizeObserver > "u") return;
    const M = Ut.current, oe = Xn.current;
    if (!M || !oe) return;
    const ze = () => F({
      workspace: M.clientWidth,
      focusRow: oe.clientWidth,
      focusRowHeight: oe.clientHeight
    }), ut = new ResizeObserver(ze);
    return ut.observe(M), ut.observe(oe), ze(), () => ut.disconnect();
  }, [Vn, V.markerRailOpen]);
  const nn = Ve(
    () => qo(wt, be),
    [wt, be]
  );
  Ui(() => {
    is(be, e) !== be && _({ type: "prune", detail: e });
  }, [e, be]);
  const Yt = Ve(
    () => Wi(
      uo(
        nn,
        $t,
        w,
        d && O,
        Wt
      ),
      un,
      !0
    ),
    [
      nn,
      $t,
      w,
      O,
      Wt,
      d,
      un
    ]
  ), En = Object.fromEntries(Mt.map((M) => [M, Yt.filter((oe) => oe.reviewState === M).length])), An = Wi(
    uo(
      nn,
      $t,
      { ...w, reviewStates: Mt },
      d && O,
      Wt
    ),
    un,
    !0
  ), z = Object.fromEntries(Mt.map((M) => [M, An.filter((oe) => oe.reviewState === M).length])), We = [...new Set(nn.map((M) => M.sourceKey).filter(Boolean))].sort((M, oe) => Ht(M).localeCompare(Ht(oe))), jt = Ol(
    w,
    d && O
  ), ct = Ve(
    () => vn(Yt, Wt, $t),
    [Yt, Wt, $t]
  ), Tt = Ve(
    () => hc(ct, De),
    [ct, De]
  ), Rt = ((bi = g.current) == null ? void 0 : bi.videoId) === st.id ? g.current : null, et = jl(
    ct,
    f,
    l,
    {
      visibleLanes: Tt,
      reference: (Rt == null ? void 0 : Rt.reference) ?? null,
      referenceLanes: (Rt == null ? void 0 : Rt.lanes) ?? null
    }
  );
  ye(() => {
    const M = Gr(ct, et == null ? void 0 : et.id);
    M && (g.current = { videoId: st.id, reference: M, lanes: Tt });
  }, [st.id, et == null ? void 0 : et.id, ct, Tt]);
  const Jo = Ve(() => {
    const M = Fc(be);
    return M.length === 0 ? wt : [...wt, ...M];
  }, [wt, be]), xe = et == null ? null : Jo.find((M) => M.id === et.id) || et, rn = Ei(Jo, Ei(Yt, J).map((M) => M.id)), fs = Dc(ie, rn), ps = jn(ie), ys = $o(ie), Yo = !d && rn.length > 0 && rn.every((M) => M.nativeSegmentId != null), Qo = Yt.map((M) => M.id), bs = Qo.join("|");
  A.current = (xe == null ? void 0 : xe.id) ?? null;
  const Xo = ue(null);
  Xo.current = f;
  const Zo = rr.get(xe == null ? void 0 : xe.id) || [], hs = zo(Zo), ei = Ve(
    () => yc(ct, J),
    [ct, J]
  ), Rr = Ve(() => _o(ct), [ct]), or = Ve(
    () => fc(Rr, De),
    [Rr, De]
  ), vs = Ve(
    () => Ja(
      or.rows,
      at.scrollTop,
      at.height
    ),
    [or, at]
  ), Ss = zr(Tt, xe == null ? void 0 : xe.id, -1, !0) != null, xs = zr(Tt, xe == null ? void 0 : xe.id, 1, !0) != null, Mn = xe ? zt(ct, xe.id) : null, io = Va(Rr) ? Rr.map((M) => M.key) : [], ks = io.join("|"), Er = Math.max(
    0,
    Number((hi = st.videoFile) == null ? void 0 : hi.duration) || 0,
    ...nn.map((M) => Number(M.endSec ?? M.startSec) || 0)
  ), ti = Number((vi = st.videoFile) == null ? void 0 : vi.duration) > 0 ? Number(st.videoFile.duration) : null;
  $.actions;
  const ws = Ia();
  ye(() => {
    const M = f === Ln ? f : (xe == null ? void 0 : xe.id) ?? null;
    M !== f && D(M);
  }, [xe, f]), ye(() => {
    Y((M) => {
      const oe = Kl(
        M,
        Qo,
        (xe == null ? void 0 : xe.id) ?? null
      );
      return oe.length === M.length && oe.every((ze, ut) => ze === M[ut]) ? M : oe;
    });
  }, [bs, xe == null ? void 0 : xe.id]);
  const ir = e.itemMetadataAvailable ? (xe == null ? void 0 : xe.itemId) ?? null : null, ni = ir == null ? null : ((Si = e.itemMetadata) == null ? void 0 : Si[ir]) || null, Qt = ir == null || ni ? null : `${h}:${ir}:${xe.revision}:${xe.updatedAt}`, [ao, so] = G({ key: null, value: null, error: null });
  ye(() => {
    if (Qt == null) return;
    const M = y.current.get(Qt);
    if (M) {
      so({ key: Qt, value: M, error: null });
      return;
    }
    const oe = new AbortController(), ze = setTimeout(() => {
      ne(`/videos/${st.id}/items/${ir}/metadata`, { signal: oe.signal }).then((ut) => {
        const Nt = y.current;
        Nt.size >= 500 && Nt.delete(Nt.keys().next().value), Nt.set(Qt, ut), so({ key: Qt, value: ut, error: null });
      }).catch((ut) => {
        oe.signal.aborted || so({ key: Qt, value: null, error: ut.message || "Unable to load provenance." });
      });
    }, 100);
    return () => {
      clearTimeout(ze), oe.abort();
    };
  }, [Qt, st.id]);
  const ar = Qt == null ? { loading: !1, error: null, value: ni } : ao.key === Qt ? { loading: !1, error: ao.error, value: ao.value } : { loading: !0, error: null, value: null }, Dn = ar.value, Ns = {
    key: (xe == null ? void 0 : xe.itemId) != null ? `item:${xe.itemId}` : (xe == null ? void 0 : xe.nativeSegmentId) != null ? `native:${xe.nativeSegmentId}` : null,
    loading: ar.loading,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : ar.error,
    items: e.itemMetadataAvailable ? (Dn == null ? void 0 : Dn.provenance) || (xe == null ? void 0 : xe.fieldProvenance) || [] : []
  }, lo = (xe == null ? void 0 : xe.itemId) != null ? {
    loading: ar.loading,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : ar.error,
    data: e.lineageMetadataAvailable && (Dn == null ? void 0 : Dn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  ye(() => {
    j(et == null ? "" : String(et.startSec)), v((et == null ? void 0 : et.endSec) == null ? "" : String(et.endSec));
  }, [et == null ? void 0 : et.id, et == null ? void 0 : et.startSec, et == null ? void 0 : et.endSec]), ye(() => {
    Mn && Ee((M) => Xa(M, Mn));
  }, [st.id, l, Mn]), ye(() => {
    Le((M) => kc(io, M, Mn));
  }, [st.id, ks, Mn]), ye(() => {
    if (!V.markerRailOpen || (xe == null ? void 0 : xe.id) == null) return;
    const M = nr.current, oe = or.rows.find((Nt) => Nt.kind === "segment" && Nt.segment.id === xe.id);
    if (!M || !oe) return;
    const ze = oe.top + oe.height;
    let ut = M.scrollTop;
    oe.top < M.scrollTop ? ut = oe.top : ze > M.scrollTop + M.clientHeight && (ut = Math.max(0, ze - M.clientHeight)), ut !== M.scrollTop && (M.scrollTop = ut), Cn({ scrollTop: ut, height: M.clientHeight });
  }, [xe == null ? void 0 : xe.id, or, V.markerRailOpen]), ye(() => {
    const M = nr.current;
    if (!V.markerRailOpen || !M) return;
    const oe = () => Cn({
      scrollTop: M.scrollTop,
      height: M.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      oe();
      return;
    }
    const ze = new ResizeObserver(oe);
    return ze.observe(M), oe(), () => ze.disconnect();
  }, [V.markerRailOpen]);
  const { revealSegmentGroupForSelection: ri, replaceSegmentSelection: Is, selectSegment: oi, selectSegmentCollection: Cs, selectAllVideoSegments: $s } = Du({
    allSwimlanes: ct,
    editorRef: Ct,
    performerSlots: $t,
    seekRef: Jn,
    segmentGroups: Wt,
    segments: wt,
    selectedSegmentId: f,
    selectedSegmentIds: J,
    selectionAnchorIdRef: P,
    selectionRangeBaseIdsRef: R,
    setCollapsedSegmentGroups: Ee,
    setEditorFilters: C,
    setHideDerivedSegments: U,
    setSaveMessage: le,
    setSelectedSegmentGroupKey: Le,
    setSelectedSegmentId: D,
    setSelectedSegmentIds: Y
  }), { acceptHistory: co, recordHistoryAction: Ar, mutateSegment: Ts, runSegmentMutation: Rs, completeReview: Es, createSegment: ii, splitSegment: ai, duplicateSegment: si, saveTiming: As, applyShortcutTiming: Ms } = Kc({
    compatibilityMode: d,
    getRequestedSelectionId: () => Xo.current,
    displayedSelectedSegment: et,
    getSaveQueueSnapshot: ke,
    currentTime: Z,
    detail: e,
    editorFilters: w,
    endInput: x,
    hideDerivedSegments: O,
    historyRef: fe,
    mediaDuration: ti,
    onConflict: I,
    onDetailChange: t,
    onReload: k,
    optimisticSegmentIdRef: Cr,
    pendingDuplicateRef: no,
    pendingFirstSegmentStartSecRef: tr,
    pendingTagEditSegmentIdRef: In,
    performerSlots: $t,
    enqueueSave: Me,
    pendingChanges: be,
    retargetSaveTasks: Se,
    replaceSegmentSelection: Is,
    savingSegmentId: ve,
    segments: wt,
    selectedSegment: xe,
    selectedSegmentIdRef: A,
    selectedSegments: rn,
    selectionAnchorIdRef: P,
    selectionRangeBaseIdsRef: R,
    setCreatingSegmentId: Ge,
    setEditorFilters: C,
    setFirstSegmentTagOpen: ot,
    setHideDerivedSegments: U,
    setHistory: q,
    setHistoryOpen: te,
    setPublishApprovedError: ee,
    setSaveMessage: le,
    acquireSaveLock: ge,
    dispatchPendingChanges: _,
    setSelectedSegmentGroupKey: Le,
    setSelectedSegmentId: D,
    setSelectedSegmentIds: Y,
    setTagEditing: Oe,
    startInput: N,
    tagEditingRef: _e,
    timelineDuration: Er,
    video: st
  });
  function li(M = null) {
    var ut;
    if (!d || ve != null || !wt.some((Nt) => Jr(Nt))) return;
    const oe = ((ut = Ct.current) == null ? void 0 : ut.ownerDocument) ?? document, ze = oe.activeElement === oe.body ? null : oe.activeElement;
    pe.current = M != null && M.isConnected && M !== oe.body ? M : ze, ee(""), it(!0);
  }
  function di() {
    ve == null && (it(!1), ee(""), requestAnimationFrame(() => {
      zu(
        pe.current,
        Ct.current
      ), pe.current = null;
    }));
  }
  async function Ds() {
    await Es() && di();
  }
  const { closeMergeConfirmation: Os, mergeSelectedSwimlane: ci, saveSelectedReviewState: Ps } = Ou({
    acceptHistory: co,
    pendingChanges: be,
    compatibilityMode: d,
    detail: e,
    detailPanelRef: S,
    getSaveQueueSnapshot: ke,
    historyRef: fe,
    onConflict: I,
    onDetailChange: t,
    onReload: k,
    recordHistoryAction: Ar,
    revealSegmentGroupForSelection: ri,
    savingSegmentId: ve,
    selectedGroups: ei,
    selectedSegment: xe,
    selectedSegmentIdRef: A,
    selectedSegments: rn,
    selectionAnchorIdRef: P,
    selectionRangeBaseIdsRef: R,
    setMergeConfirmation: rt,
    setSaveMessage: le,
    acquireSaveLock: ge,
    dispatchPendingChanges: _,
    enqueueSave: Me,
    stableSaveIdentity: W,
    setSelectedSegmentId: D,
    setSelectedSegmentIds: Y,
    video: st
  }), Ls = (M) => {
    const oe = (M || []).map(pt);
    se.cancel((ze) => ze.kind === "review" && Zr(ze.targets, oe));
  }, js = se.settledCount();
  Ui(() => {
    se.markCommitted(js), Q.current = {
      detail: e,
      segments: wt,
      onConflict: I,
      onDetailChange: t,
      onReload: k,
      tagEditing: Ce,
      selectedSegmentIds: J,
      activeSegmentId: (xe == null ? void 0 : xe.id) ?? null
    };
  }), ye(() => {
    se.poke();
  });
  const { toggleIncorrectExample: Fs, removeIncorrectExample: Gs, captureTrainingExport: Bs, deleteRejectedSegments: ui, autoAssignPerformers: Us, previewDerivedSegments: Ks, closeMaterializeDialog: zs, materializeDerivedSegments: _s, saveTag: Hs, moveToBin: qs, emptyRecyclingBin: Ws } = Pu({
    acceptHistory: co,
    displayedSelectedSegment: et,
    allSwimlanes: ct,
    autoAssignCandidates: Tn,
    autoAssigning: Bt,
    binEmptyingRef: ce,
    canMoveSelectionToBin: Yo,
    closeTagEditing: Rn,
    compatibilityMode: d,
    creatingSegmentId: gt,
    detail: e,
    editorFilters: w,
    editorRef: Ct,
    exportingExamples: wn,
    hideDerivedSegments: O,
    incorrectExamples: un,
    lineage: lo,
    materializeButtonRef: Hn,
    materializePreview: kt,
    materializeRestoreFocusRef: qn,
    materializing: cn,
    mutateSegment: Ts,
    onConflict: I,
    onDetailChange: t,
    onReload: k,
    performerSlots: $t,
    cancelSaveTasks: me,
    dispatchPendingChanges: _,
    enqueueSave: Me,
    stableSaveIdentity: W,
    pendingChanges: be,
    runSegmentMutation: Rs,
    recordHistoryAction: Ar,
    refreshMaterializationPreview: gn,
    removingExampleId: Wn,
    revealSegmentGroupForSelection: ri,
    savingSegmentId: ve,
    segmentGroups: Wt,
    segments: wt,
    selectedSegment: xe,
    selectedSegmentIdRef: A,
    selectedSegments: rn,
    selectionAnchorIdRef: P,
    selectionRangeBaseIdsRef: R,
    setAutoAssignError: Dt,
    setAutoAssignOpen: Ne,
    setAutoAssigning: He,
    setEditorFilters: C,
    setExportingExamples: xr,
    setHideDerivedSegments: U,
    setIncorrectExamples: kn,
    setMaterializeError: _n,
    setMaterializeLoading: St,
    setMaterializeOpen: dt,
    setMaterializePreview: bt,
    setMaterializing: tn,
    setRemovingExampleId: to,
    setRejectedDeletionPreview: lt,
    setSaveMessage: le,
    acquireSaveLock: ge,
    setSelectedSegmentGroupKey: Le,
    setSelectedSegmentId: D,
    setSelectedSegmentIds: Y,
    swimlanes: Tt,
    video: st
  }), { restoreHistoryTarget: Vs, updateTimelineRatio: mi, handleSeparatorPointerDown: Js, handleSeparatorPointerMove: Ys, handleSeparatorKeyDown: Qs, panelWidthMaximum: gi, panelSeparatorProps: Xs, toggleSegmentRail: Zs, toggleSegmentGroup: fi, mutateShotBoundary: el } = Lu({
    acceptHistory: co,
    compatibilityMode: d,
    currentTime: Z,
    detail: e,
    editorLayout: V,
    focusRowRef: Xn,
    history: $,
    historyRef: fe,
    historySaving: Ke,
    horizontalLayoutSize: H,
    mediaStackHeight: re,
    mediaStackRef: Qn,
    commonActionsRef: mn,
    onDetailChange: t,
    onReload: k,
    railToggleRef: Zn,
    recordHistoryAction: Ar,
    savingSegmentId: ve,
    setCollapsedSegmentGroups: Ee,
    setEditorLayout: ae,
    setHistorySaving: Te,
    setIncorrectExamples: kn,
    setSaveMessage: le,
    acquireSaveLock: ge,
    enqueueSave: Me,
    getSaveQueueSnapshot: ke,
    shotBoundaries: $n,
    timelineDuration: Er,
    video: st,
    workspaceRef: Ut
  }), { executeShortcutById: pi, stepVideoFrame: tl } = ju({
    allSwimlanes: ct,
    displayedSelectedSegment: et,
    applyShortcutTiming: Ms,
    centerTimelineRef: wr,
    compatibilityMode: d,
    createSegment: ii,
    currentTime: Z,
    deleteRejectedSegments: ui,
    duplicateSegment: si,
    editorLayout: V,
    editorRef: Ct,
    emptyRecyclingBin: Ws,
    lineage: lo,
    mediaDuration: ti,
    mergeSelectedSwimlane: ci,
    moveToBin: qs,
    mutateShotBoundary: el,
    openPublishApprovedDialog: li,
    playbackControlsRef: Yn,
    playbackShortcutConfig: ws,
    saveSelectedReviewState: Ps,
    seekRef: Jn,
    segmentGroupKeys: io,
    selectSegment: oi,
    selectedSegment: xe,
    selectedSegmentGroupForSegment: Mn,
    selectedSegmentGroupKey: Qe,
    selectedSegments: rn,
    setCollapsedSegmentGroups: Ee,
    setIncorrectExamplesOpen: Ue,
    setQuickSearchOpen: $e,
    setSaveMessage: le,
    setSelectedSegmentGroupKey: Le,
    setTagEditing: Oe,
    setTimelineZoom: T,
    shotBoundaries: $n,
    slotButtonRef: Nr,
    splitSegment: ai,
    swimlanes: Tt,
    timelineDuration: Er,
    toggleIncorrectExample: Fs,
    toggleSegmentGroup: fi,
    updateTimelineRatio: mi,
    videoFrameRate: pn,
    visibleSegments: Yt
  });
  Nn.current = pi;
  const nl = Ve(() => pr.map((M) => ({
    id: M.id,
    enabled: Bn(M, d),
    surface: "local",
    action: (oe) => {
      var ze;
      return (ze = Nn.current) == null ? void 0 : ze.call(Nn, M.id, oe);
    }
  })), [d]);
  ia(Do, nl);
  const rl = Po(re), ol = bn(V.markerRailWidth, gi("markerRailWidth")), il = bn(V.detailWidth, gi("detailWidth"));
  return r(Mu, {
    activeFilterCount: jt,
    allSwimlanes: ct,
    approvalFacetCounts: z,
    autoAssignCandidates: Tn,
    autoAssignError: vt,
    autoAssignOpen: Be,
    autoAssignPerformers: Us,
    autoAssigning: Bt,
    canMoveSelectionToBin: Yo,
    captureTrainingExport: Bs,
    cancelQueuedReviewsForSegments: Ls,
    removeIncorrectExample: Gs,
    rejectedDeletionPreview: xt,
    centerTimelineRef: wr,
    closeEditorFilters: oo,
    closeFirstSegmentTagDialog: ro,
    closeMaterializeDialog: zs,
    closeMergeConfirmation: Os,
    closePublishApprovedDialog: di,
    closeTagEditing: Rn,
    collapsedSegmentGroups: De,
    commonActionsRef: mn,
    compatibilityMode: d,
    configuringTag: hr,
    createSegment: ii,
    currentTime: Z,
    deleteRejectedSegments: ui,
    detail: e,
    detailPanelRef: S,
    detailWidth: il,
    duplicateSegment: si,
    editorFilters: w,
    editorLayout: V,
    editorRef: Ct,
    exportingExamples: wn,
    filtersButtonRef: er,
    filtersOpen: E,
    firstSegmentTagOpen: ft,
    focusRowRef: Xn,
    handleSeparatorKeyDown: Qs,
    handleSeparatorPointerDown: Js,
    handleSeparatorPointerMove: Ys,
    hideDerivedSegments: O,
    history: $,
    historyOpen: he,
    historySaving: Ke,
    hasNextUnreviewed: xs,
    hasPreviousUnreviewed: Ss,
    horizontalLayoutSize: H,
    importNativeSegments: nt,
    incorrectExamples: un,
    incorrectExamplesOpen: Ze,
    removingExampleId: Wn,
    lineage: lo,
    markerRailWidth: ol,
    materializeButtonRef: Hn,
    materializeCancelButtonRef: Sr,
    materializeDerivedSegments: _s,
    materializeError: zn,
    materializeLoading: qt,
    materializeOpen: Ie,
    materializePreview: kt,
    materializing: cn,
    mediaStackRef: Qn,
    mergeCancelButtonRef: ht,
    mergeConfirmation: Pe,
    mergeSaving: Ac(ie, "merge"),
    mergeSelectedSwimlane: ci,
    nativeImportState: Re,
    onNavigate: u,
    onDetailChange: t,
    openPublishApprovedDialog: li,
    onReload: k,
    onSlotsChanged: a,
    panelSeparatorProps: Xs,
    pendingInitialSeekRef: kr,
    performerSlots: $t,
    performerSlotsAvailable: Tr,
    playbackControlsRef: Yn,
    previewDerivedSegments: Ks,
    provenance: Ns,
    provenanceSources: We,
    publishApprovedCancelButtonRef: de,
    publishApprovedDrafts: Ds,
    publishApprovedError: B,
    publishApprovedOpen: Xe,
    quickSearchOpen: Ae,
    railScrollRef: nr,
    railToggleRef: Zn,
    recordHistoryAction: Ar,
    restoreHistoryTarget: Vs,
    runEditorAction: pi,
    stepVideoFrame: tl,
    saveMessage: we,
    setSaveMessage: le,
    saveTag: Hs,
    saveTiming: As,
    savingSegmentId: ve,
    selectionBusy: fs,
    editorHeldByOtherWork: ps,
    segmentCreationPending: ys,
    acquireSaveLock: ge,
    seekRef: Jn,
    segmentGroups: Wt,
    segmentRailLayout: or,
    segments: nn,
    selectAllVideoSegments: $s,
    selectSegment: oi,
    selectSegmentCollection: Cs,
    selectedGroups: ei,
    selectedPerformerSlots: Zo,
    selectedSegment: et,
    selectedSegmentGroupKey: Qe,
    selectedSegmentIds: J,
    selectedSegments: rn,
    selectedSlotStatus: hs,
    setAutoAssignError: Dt,
    setAutoAssignOpen: Ne,
    setConfiguringTag: vr,
    setCurrentTime: L,
    setEditorFilters: C,
    setEditorLayout: ae,
    setFiltersOpen: K,
    setHideDerivedSegments: U,
    setHistoryOpen: te,
    setIncorrectExamplesOpen: Ue,
    setQuickSearchOpen: $e,
    setRejectedDeletionPreview: lt,
    setRailViewport: Cn,
    setSelectedSegmentGroupKey: Le,
    setSelectedSegmentId: D,
    setShortcutsOpen: qe,
    setTimelineZoom: T,
    shotBoundaries: $n,
    shortcutsOpen: tt,
    slotButtonRef: Nr,
    splitLayout: s,
    splitSegment: ai,
    tagEditing: Ce,
    creatingSegmentId: gt,
    tagSearchRef: Ir,
    timelineDuration: Er,
    timelineRatioBounds: rl,
    timelineZoom: m,
    toggleSegmentGroup: fi,
    toggleSegmentRail: Zs,
    updateTimelineRatio: mi,
    video: st,
    videoPerformers: fn,
    visibleCounts: En,
    visibleSegmentRailRows: vs,
    visibleSegments: Yt,
    wideLayout: Vn,
    workspaceRef: Ut
  });
}
function Hu(e = [], t = []) {
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
function qu(e = [], t = "", n = "all") {
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
function At(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function Wu(e = [], t = []) {
  var h;
  const n = /* @__PURE__ */ new Map();
  [...t].sort((p, b) => (p.sortOrder ?? 0) - (b.sortOrder ?? 0) || Number(p.id) - Number(b.id)).forEach((p, b) => {
    [...p.tags || []].sort((k, I) => (k.sortOrder ?? 0) - (I.sortOrder ?? 0) || Number(k.tagId) - Number(I.tagId)).forEach((k, I) => n.set(Number(k.tagId), {
      key: `group:${p.id}`,
      id: p.id,
      name: p.name,
      sortOrder: p.sortOrder ?? b,
      tagSortOrder: k.sortOrder ?? I
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(p, b) {
    const k = Number(p);
    if (!o.has(k)) {
      const I = n.get(k);
      o.set(k, {
        tagId: k,
        name: b || `Tag ${k}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (I == null ? void 0 : I.key) || "ungrouped",
        segmentGroupId: (I == null ? void 0 : I.id) ?? null,
        segmentGroupName: (I == null ? void 0 : I.name) || "Ungrouped",
        segmentGroupSortOrder: (I == null ? void 0 : I.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (I == null ? void 0 : I.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(k);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((p) => {
    const b = i(p.sourceTagId, p.sourceTagName), k = i(p.derivedTagId, p.derivedTagName);
    b.outgoingRuleCount++, k.incomingRuleCount++;
    const I = `${b.tagId}:${k.tagId}`;
    a.has(I) || a.set(I, {
      id: I,
      sourceTagId: b.tagId,
      derivedTagId: k.tagId,
      rules: [],
      edgeCount: 0
    });
    const f = a.get(I);
    f.rules.push(p), f.edgeCount += Number(p.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((p) => [p.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((p) => {
    var b, k;
    (b = d.get(p.sourceTagId)) == null || b.add(p.derivedTagId), (k = d.get(p.derivedTagId)) == null || k.add(p.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), u = [];
  for (const p of s) {
    if (c.has(p.tagId)) continue;
    const b = [p.tagId], k = [];
    for (c.add(p.tagId); b.length > 0; ) {
      const P = b.shift();
      k.push(P);
      for (const R of d.get(P) || [])
        c.has(R) || (c.add(R), b.push(R));
    }
    const I = new Set(k), f = k.map((P) => o.get(P)), D = l.filter((P) => I.has(P.sourceTagId) && I.has(P.derivedTagId)), J = D.flatMap((P) => P.rules), Y = f.filter((P) => P.outgoingRuleCount === 0).sort((P, R) => At(P.name, R.name)), A = Y.length > 0 ? Y : [...f].sort((P, R) => At(P.name, R.name));
    u.push({
      id: [...k].sort((P, R) => P - R).join(":"),
      label: A.length > 1 ? `${A[0].name} + ${A.length - 1}` : ((h = A[0]) == null ? void 0 : h.name) || "Derivation component",
      nodes: f,
      connections: D,
      rules: J,
      segmentGroupKeys: [...new Set(f.map((P) => P.segmentGroupKey))],
      materializedEdgeCount: J.reduce(
        (P, R) => P + (Number(R.edgeCount) || 0),
        0
      )
    });
  }
  u.sort((p, b) => b.rules.length - p.rules.length || At(p.label, b.label));
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
    p.nodes.forEach((b) => {
      var k;
      return (k = g.get(b.segmentGroupKey)) == null ? void 0 : k.componentIds.add(p.id);
    }), p.rules.forEach((b) => {
      var k, I;
      (k = g.get(o.get(Number(b.sourceTagId)).segmentGroupKey)) == null || k.ruleIds.add(b.id), (I = g.get(o.get(Number(b.derivedTagId)).segmentGroupKey)) == null || I.ruleIds.add(b.id);
    });
  });
  const y = [...g.values()].sort((p, b) => p.sortOrder - b.sortOrder || At(p.name, b.name)).map((p) => ({
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
function Vu(e, {
  minimumWidth: t = 720,
  minimumHeight: n = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const u = new Map(e.nodes.map((S) => [S.tagId, /* @__PURE__ */ new Set()])), g = new Map(e.nodes.map((S) => [S.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((S) => {
    var w, C;
    (w = u.get(S.sourceTagId)) == null || w.add(S.derivedTagId), (C = g.get(S.derivedTagId)) == null || C.add(S.sourceTagId);
  });
  const y = new Map(e.nodes.map((S) => {
    var w;
    return [
      S.tagId,
      ((w = g.get(S.tagId)) == null ? void 0 : w.size) || 0
    ];
  })), h = new Map(e.nodes.map((S) => [S.tagId, 0])), p = e.nodes.filter((S) => y.get(S.tagId) === 0).sort((S, w) => At(S.name, w.name)).map((S) => S.tagId), b = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const S = p.shift();
    if (!b.has(S)) {
      b.add(S);
      for (const w of u.get(S) || [])
        h.set(w, Math.max(h.get(w) || 0, (h.get(S) || 0) + 1)), y.set(w, y.get(w) - 1), y.get(w) === 0 && p.push(w);
    }
  }
  b.size !== e.nodes.length && e.nodes.filter((S) => !b.has(S.tagId)).sort((S, w) => At(S.name, w.name)).forEach((S) => h.set(S.tagId, 0));
  const k = Math.max(0, ...h.values()), I = Math.max(
    t,
    240 + k * 296
  ), f = /* @__PURE__ */ new Map();
  e.nodes.forEach((S) => {
    f.has(S.segmentGroupKey) || f.set(S.segmentGroupKey, {
      key: S.segmentGroupKey,
      id: S.segmentGroupId,
      name: S.segmentGroupName,
      sortOrder: S.segmentGroupSortOrder,
      nodes: []
    }), f.get(S.segmentGroupKey).nodes.push(S);
  });
  const D = [...f.values()].sort((S, w) => S.sortOrder - w.sortOrder || At(S.name, w.name));
  let J = 28;
  const Y = [], A = D.map((S) => {
    const w = /* @__PURE__ */ new Map();
    S.nodes.forEach((U) => {
      const Z = h.get(U.tagId) || 0;
      w.has(Z) || w.set(Z, []), w.get(Z).push(U);
    });
    for (const U of w.values())
      U.sort((Z, L) => Z.segmentGroupTagSortOrder - L.segmentGroupTagSortOrder || At(Z.name, L.name));
    const C = Math.max(1, ...[...w.values()].map((U) => U.length)), E = C * 58 + (C - 1) * 18, K = 70 + E, O = {
      ...S,
      x: 12,
      y: J,
      width: I - 24,
      height: K
    };
    for (const [U, Z] of w.entries()) {
      const L = Z.length * 58 + Math.max(0, Z.length - 1) * 18, Q = (E - L) / 2;
      Z.forEach((se, ie) => Y.push({
        ...se,
        rank: U,
        x: 28 + U * 296,
        y: J + 34 + 18 + Q + ie * 76,
        width: 184,
        height: 58
      }));
    }
    return J += K + 16, O;
  }), P = new Map(Y.map((S) => [S.tagId, S])), R = e.connections.map((S) => {
    const w = P.get(S.sourceTagId), C = P.get(S.derivedTagId), E = w.x + w.width, K = w.y + w.height / 2, O = C.x, U = C.y + C.height / 2, Z = Math.max(48, (O - E) * 0.48);
    return {
      ...S,
      path: `M ${E} ${K} C ${E + Z} ${K}, ${O - Z} ${U}, ${O} ${U}`
    };
  });
  return {
    width: I,
    height: Math.max(n, J - 16 + 28),
    nodes: Y,
    connections: R,
    groups: A
  };
}
function Ju(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Vu(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), u = 20, g = o, y = c.nodes.map((p) => ({
      ...p,
      x: p.x + u,
      y: p.y + g
    })), h = new Map(y.map((p) => [p.tagId, p]));
    a.push(...y), l.push(...c.groups.map((p) => ({
      ...p,
      componentId: d.id,
      x: p.x + u,
      y: p.y + g
    }))), s.push(...c.connections.map((p) => {
      const b = h.get(p.sourceTagId), k = h.get(p.derivedTagId), I = b.x + b.width, f = b.y + b.height / 2, D = k.x, J = k.y + k.height / 2, Y = Math.max(48, (D - I) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${I} ${f} C ${I + Y} ${f}, ${D - Y} ${J}, ${D} ${J}`
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
function ea(e, t = []) {
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
function Yu(e, t, n) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !n && t[0] || null;
}
function gs(e) {
  const t = e == null ? void 0 : e.saved;
  return t != null && Number(e.sourceTagId) === Number(t.sourceTagId) && Number(e.derivedTagId) === Number(t.derivedTagId);
}
function Qu(e, t, n, o = "") {
  const i = {
    ...e,
    [`${t}TagId`]: n == null ? null : Number(n),
    [`${t}TagName`]: o || "",
    slotMappings: []
  };
  return gs(i) ? { ...i, slotMappings: i.saved.slotMappings } : i;
}
function Xu(e) {
  const { arrowMarkerId: t, busy: n, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: u, editorRef: g, emptyDraft: y, graph: h, layout: p, listSort: b, materializationOffer: k, materializeOutgoingRules: I, materializeRule: f, message: D, normalizedQuery: J, query: Y, refreshConfiguredTag: A, revealEditor: P, rules: R, save: S, segmentGroupKey: w, selectedNode: C, selectedRule: E, selection: K, setConfiguringTag: O, setDraft: U, setListSort: Z, setMaterializationOffer: L, setQuery: Q, setSegmentGroupKey: se, setSelection: ie, setView: ve, sortedVisibleRules: ge, sourceSlots: Me, sourceSlotsLoading: W, updateMapping: X, updateTag: me, view: Se, visibleComponents: ke, visibleRules: be } = e;
  function _(x) {
    const v = h.nodes.find((T) => T.tagId === Number(x.sourceTagId)), m = h.nodes.find((T) => T.tagId === Number(x.derivedTagId));
    return (v == null ? void 0 : v.segmentGroupKey) === (m == null ? void 0 : m.segmentGroupKey) ? v.segmentGroupKey : "cross-group";
  }
  function we() {
    return r("div", { key: "editor", ref: g, className: "space-y-4 p-4" }, [
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
          onClick: () => U(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      r("div", { key: "tags", className: "space-y-3" }, [
        r("div", { key: "source", className: "space-y-2" }, [
          r("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            r("span", { key: "label" }, "Source tag (specific)"),
            r(ur, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (x, v) => me("source", x, v == null ? void 0 : v.label),
              disabled: n,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.sourceTagId && !W && Me.length === 0 ? r("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            r("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            r("button", {
              key: "configure",
              type: "button",
              disabled: n,
              onClick: (x) => O({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: x.currentTarget
              }),
              className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
            }, "Configure source tag")
          ]) : null
        ]),
        r("div", { key: "derived", className: "space-y-2" }, [
          r("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            r("span", { key: "label" }, "Derived tag (general)"),
            r(ur, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (x, v) => me("derived", x, v == null ? void 0 : v.label),
              disabled: n,
              placeholder: "Find a derived tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.derivedTagId && !l && s.length === 0 ? r("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            r("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            r("button", {
              key: "configure",
              type: "button",
              disabled: n,
              onClick: (x) => O({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: x.currentTarget
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
            disabled: n || d.slotMappings.some((x) => !x.sourceSlotDefinitionId || !x.derivedSlotDefinitionId) || Pr(Me, d.slotMappings, -1, "sourceSlotDefinitionId").length === 0 || Pr(s, d.slotMappings, -1, "derivedSlotDefinitionId").length === 0,
            onClick: () => U((x) => ({
              ...x,
              slotMappings: [...x.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
            })),
            className: o
          }, "Add mapping")
        ]),
        d.slotMappings.length === 0 ? r("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots will be copied.") : r("div", { key: "configured", className: "space-y-2" }, [
          ...d.slotMappings.map((x, v) => r("div", { key: v, className: "flex items-center gap-2" }, [
            r("select", {
              key: "source",
              value: x.sourceSlotDefinitionId,
              disabled: n,
              onChange: (m) => X(v, "sourceSlotDefinitionId", m.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${v + 1}`
            }, [r("option", { key: "none", value: "" }, "Source slot…"), ...Pr(Me, d.slotMappings, v, "sourceSlotDefinitionId").map((m) => r("option", { key: m.id, value: m.id }, Lt(m)))]),
            r("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            r("select", {
              key: "derived",
              value: x.derivedSlotDefinitionId,
              disabled: n,
              onChange: (m) => X(v, "derivedSlotDefinitionId", m.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${v + 1}`
            }, [r("option", { key: "none", value: "" }, "Derived slot…"), ...Pr(s, d.slotMappings, v, "derivedSlotDefinitionId").map((m) => r("option", { key: m.id, value: m.id }, Lt(m)))]),
            r("button", {
              key: "remove",
              type: "button",
              disabled: n,
              onClick: () => U((m) => ({
                ...m,
                slotMappings: m.slotMappings.filter((T, V) => V !== v)
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
          disabled: n || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((x) => !x.sourceSlotDefinitionId || !x.derivedSlotDefinitionId),
          onClick: S,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        r("button", { key: "cancel", type: "button", disabled: n, onClick: () => U(null), className: o }, "Cancel")
      ])
    ]);
  }
  function le() {
    if (C) {
      const m = be.filter((ae) => Number(ae.derivedTagId) === C.tagId), T = be.filter((ae) => Number(ae.sourceTagId) === C.tagId), V = (ae, re, je) => r("div", {
        key: ae.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        r("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          r("span", { key: "direction", className: "block text-secondary" }, re),
          r(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${ae.sourceTagName} → ${ae.derivedTagName}`
          )
        ]),
        r("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          je ? r("button", {
            key: "materialize",
            type: "button",
            disabled: n || d != null,
            onClick: () => f(ae),
            className: o
          }, "Materialize") : null,
          r("button", {
            key: "edit",
            type: "button",
            disabled: n || d != null,
            onClick: () => u(ae, !0),
            className: o
          }, "Edit rule"),
          r("button", {
            key: "delete",
            type: "button",
            disabled: n || d != null,
            onClick: () => a(ae),
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
          onClick: (ae) => O({
            tagId: C.tagId,
            tagName: C.name,
            trigger: ae.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        T.length ? r("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: n || d != null,
          onClick: () => I(C, T),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${T.length})`) : null,
        T.length ? r("div", { key: "outgoing", className: "space-y-2" }, [
          r("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...T.map((ae) => V(ae, "Derives", !0))
        ]) : null,
        m.length ? r("details", {
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
              m.length
            )
          ]),
          r(
            "div",
            { key: "rules", className: "space-y-2 border-t border-border p-2" },
            m.map((ae) => V(ae, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!E)
      return r(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const x = h.nodes.find((m) => m.tagId === Number(E.sourceTagId)), v = h.nodes.find((m) => m.tagId === Number(E.derivedTagId));
    return r("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      r("div", { key: "identity" }, [
        r("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          r("span", { key: "source" }, (x == null ? void 0 : x.segmentGroupName) || "Ungrouped"),
          (x == null ? void 0 : x.segmentGroupKey) !== (v == null ? void 0 : v.segmentGroupKey) ? r("span", { key: "derived" }, `→ ${(v == null ? void 0 : v.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        r(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${E.sourceTagName} → ${E.derivedTagName}`
        ),
        r(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${E.edgeCount} materialized lineage edge${E.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (k == null ? void 0 : k.ruleId) === E.id ? r("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
        r(
          "p",
          { key: "summary", className: "text-sm font-medium text-foreground" },
          `${k.createCount + k.linkCount} pending derivation${k.createCount + k.linkCount === 1 ? "" : "s"}`
        ),
        r(
          "p",
          { key: "details", className: "text-xs text-secondary" },
          `${k.createCount} new segments · ${k.linkCount} existing segments to link`
        ),
        r("div", { key: "actions", className: "flex gap-2" }, [
          r("button", {
            key: "materialize",
            type: "button",
            disabled: n,
            onClick: () => f(E, k),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          r("button", {
            key: "later",
            type: "button",
            disabled: n,
            onClick: () => L(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      r("div", { key: "mappings", className: "space-y-2" }, [
        r("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        E.slotMappings.length === 0 ? r("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : E.slotMappings.map((m, T) => r("div", {
          key: `${m.sourceSlotDefinitionId}:${m.derivedSlotDefinitionId}`,
          className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
        }, [
          r(
            "span",
            { key: "source", className: "truncate text-foreground", title: m.sourceSlotLabel || "Unnamed slot" },
            m.sourceSlotLabel || "Unnamed slot"
          ),
          r("span", { key: "arrow", className: "text-secondary" }, "→"),
          r(
            "span",
            { key: "derived", className: "truncate text-foreground", title: m.derivedSlotLabel || "Unnamed slot" },
            m.derivedSlotLabel || "Unnamed slot"
          )
        ]))
      ]),
      r("dl", { key: "metadata", className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-xs" }, [
        r("dt", { key: "created-label", className: "text-secondary" }, "Created"),
        r(
          "dd",
          { key: "created", className: "text-right text-foreground" },
          E.createdAt ? new Date(E.createdAt).toLocaleDateString() : "Unknown"
        ),
        r("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        r(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          E.updatedAt ? new Date(E.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      r("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        r("button", {
          key: "materialize",
          type: "button",
          disabled: n || d != null,
          onClick: () => f(E),
          className: o
        }, "Materialize pending"),
        r("button", {
          key: "edit",
          type: "button",
          disabled: n || d != null,
          onClick: () => u(E),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        r("button", {
          key: "delete",
          type: "button",
          disabled: n,
          onClick: () => a(E),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function N() {
    if (ke.length === 0)
      return r("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, J ? "No derivation relationships match your search." : "No derivation rules.");
    const x = C == null ? void 0 : C.tagId, v = /* @__PURE__ */ new Set();
    return C && (v.add(C.tagId), p.connections.forEach((m) => {
      (m.sourceTagId === C.tagId || m.derivedTagId === C.tagId) && (v.add(m.sourceTagId), v.add(m.derivedTagId));
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
        style: { width: `${p.width}px`, height: `${p.height}px` },
        "aria-label": "Derivation rule graph"
      }, [
        ...p.groups.map((m) => r("div", {
          key: `group:${m.componentId}:${m.key}`,
          className: `absolute rounded-xl border ${w === m.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
          style: {
            left: `${m.x}px`,
            top: `${m.y}px`,
            width: `${m.width}px`,
            height: `${m.height}px`
          }
        }, r("div", {
          className: "absolute left-3 top-2 max-w-[16rem] truncate text-[11px] font-semibold uppercase tracking-wide text-secondary",
          title: m.name
        }, m.name))),
        r("svg", {
          key: "edges",
          className: "pointer-events-none absolute inset-0 overflow-visible",
          width: p.width,
          height: p.height,
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
          ...p.connections.map((m) => {
            const T = x === m.sourceTagId || x === m.derivedTagId, V = C != null, ae = T ? "var(--color-accent)" : "var(--color-secondary)";
            return r("path", {
              key: `${m.id}:visible`,
              d: m.path,
              fill: "none",
              stroke: ae,
              strokeWidth: T ? 2.5 : 1.5,
              opacity: V && !T ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((m) => {
          const T = !J || m.name.toLocaleLowerCase().includes(J), V = C != null, ae = v.has(m.tagId), re = (C == null ? void 0 : C.tagId) === m.tagId;
          return r("button", {
            key: `node:${m.tagId}`,
            type: "button",
            onClick: () => ie({ type: "node", id: m.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${re ? "border-accent bg-accent/15 ring-2 ring-accent/25" : ae ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${m.x}px`,
              top: `${m.y}px`,
              width: `${m.width}px`,
              height: `${m.height}px`,
              opacity: !T || V && !ae ? 0.62 : 1
            },
            title: `${m.name} — ${m.segmentGroupName}`,
            "aria-label": `${m.name}, ${m.incomingRuleCount} incoming and ${m.outgoingRuleCount} outgoing derivation rules`
          }, [
            r("span", { key: "name", className: "block truncate text-sm font-medium text-foreground" }, m.name),
            r("span", { key: "counts", className: "mt-1 flex items-center gap-2 text-[11px] text-secondary" }, [
              r("span", { key: "in" }, `${m.incomingRuleCount} in`),
              r("span", { key: "arrow", "aria-hidden": "true" }, "→"),
              r("span", { key: "out" }, `${m.outgoingRuleCount} out`)
            ])
          ]);
        }),
        ...p.connections.filter((m) => m.rules.length > 1).map((m) => {
          const T = p.nodes.find((ae) => ae.tagId === m.sourceTagId), V = p.nodes.find((ae) => ae.tagId === m.derivedTagId);
          return r("div", {
            key: `bundle:${m.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(T.x + T.width + V.x) / 2 - 24}px`,
              top: `${(T.y + T.height / 2 + V.y + V.height / 2) / 2 - 10}px`
            },
            "aria-label": `${m.rules.length} rules connect ${m.rules[0].sourceTagName} to ${m.rules[0].derivedTagName}`
          }, `${m.rules.length} rules`);
        })
      ])
    ]);
  }
  function j() {
    if (ke.length === 0)
      return r(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        J ? "No derivation relationships match your search." : "No derivation rules."
      );
    const x = /* @__PURE__ */ new Map();
    ge.forEach((m) => {
      const T = _(m);
      x.has(T) || x.set(T, []), x.get(T).push(m);
    });
    const v = [
      ...h.segmentGroups.map((m) => m.key),
      "cross-group"
    ].filter((m) => x.has(m));
    return r("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, v.map((m) => {
      const T = h.segmentGroups.find((re) => re.key === m), V = m === "cross-group" ? "Cross-group relationships" : (T == null ? void 0 : T.name) || "Ungrouped", ae = x.get(m);
      return r("section", { key: m, "aria-label": V }, [
        r("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          r("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, V),
          r(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${ae.length} rule${ae.length === 1 ? "" : "s"}`
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
          ...ae.map((re) => r("button", {
            key: re.id,
            type: "button",
            role: "row",
            onClick: () => ie({ type: "rule", id: re.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(E == null ? void 0 : E.id) === re.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            r(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${re.sourceTagName} → ${re.derivedTagName}` },
              `${re.sourceTagName} → ${re.derivedTagName}`
            ),
            r("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(re.slotMappings.length)),
            r("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(re.edgeCount))
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
          `${R.length} rules · ${h.nodes.length} tags`
        )
      ]),
      r("button", {
        key: "add",
        type: "button",
        disabled: n || d != null,
        onClick: () => {
          U(y()), ie(null), P();
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
          onChange: (x) => {
            Q(x.target.value), ie(null);
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
          onChange: (x) => {
            se(x.target.value), ie(null), U(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          r("option", { key: "all", value: "all" }, "All Segment groups"),
          ...h.segmentGroups.map((x) => r("option", { key: x.key, value: x.key }, x.name))
        ])
      ]),
      Se === "list" ? r("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        r("span", { key: "label" }, "Sort"),
        r("select", {
          key: "select",
          value: b,
          onChange: (x) => Z(x.target.value),
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
        ].map(([x, v]) => r("button", {
          key: x,
          type: "button",
          onClick: () => {
            ve(x), x === "graph" && (K == null ? void 0 : K.type) === "rule" && ie(null);
          },
          "aria-pressed": Se === x,
          className: `rounded px-3 py-1.5 text-sm font-medium ${Se === x ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
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
        Se === "graph" ? N() : j()
      ),
      r("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        r("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? we() : le()
      ])
    ])),
    r("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      D ? r("p", { key: "message", role: "status", className: "text-sm text-secondary" }, D) : null
    ]),
    i ? r(Vo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => A(i),
      onClose: () => {
        const x = i.trigger;
        O(null), requestAnimationFrame(() => {
          x != null && x.isConnected && x.focus();
        });
      }
    }) : null
  ]);
}
function Zu({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const n = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: []
  }), [o, i] = G([]), [a, s] = G(null), [l, d] = G([]), [c, u] = G([]), [g, y] = G(!1), [h, p] = G(!1), [b, k] = G(!1), [I, f] = G(""), [D, J] = G(""), [Y, A] = G("graph"), [P, R] = G("all"), [S, w] = G(null), [C, E] = G("relationship"), [K, O] = G(null), [U, Z] = G(null), L = ue(null), Q = ue(null), se = Fa().replace(/:/g, "");
  function ie() {
    requestAnimationFrame(() => {
      var H;
      return (H = L.current) == null ? void 0 : H.scrollIntoView({ block: "nearest" });
    });
  }
  async function ve(H) {
    const F = await ne("/derivation-rules", H ? { signal: H } : void 0);
    i(F || []);
  }
  ye(() => {
    const H = new AbortController();
    return ve(H.signal).catch((F) => {
      F.name !== "AbortError" && f(F.message || "Unable to load derived segment rules.");
    }), () => H.abort();
  }, []), ye(() => {
    const H = new AbortController();
    return a != null && a.sourceTagId ? (y(!0), ne(`/slot-definitions/${a.sourceTagId}`, { signal: H.signal }).then((F) => d(F.definitions || [])).catch((F) => {
      F.name !== "AbortError" && d([]);
    }).finally(() => {
      H.signal.aborted || y(!1);
    })) : (d([]), y(!1)), a != null && a.derivedTagId ? (p(!0), ne(`/slot-definitions/${a.derivedTagId}`, { signal: H.signal }).then((F) => u(F.definitions || [])).catch((F) => {
      F.name !== "AbortError" && u([]);
    }).finally(() => {
      H.signal.aborted || p(!1);
    })) : (u([]), p(!1)), () => H.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), ye(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || gs(a) || g || h)
      return;
    const H = `${a.sourceTagId}:${a.derivedTagId}`;
    Q.current !== H && (Q.current = H, s((F) => !F || Number(F.sourceTagId) !== Number(a.sourceTagId) || Number(F.derivedTagId) !== Number(a.derivedTagId) ? F : dc(F, l, c)));
  }, [
    a == null ? void 0 : a.saved,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    g,
    h
  ]);
  function ge(H, F = !1) {
    F || w({ type: "rule", id: H.id }), Q.current = null, d([]), u([]), y(!0), p(!0);
    const $ = H.slotMappings.map((q) => ({
      sourceSlotDefinitionId: q.sourceSlotDefinitionId,
      derivedSlotDefinitionId: q.derivedSlotDefinitionId
    }));
    s({
      ruleId: H.id,
      sourceTagId: H.sourceTagId,
      sourceTagName: H.sourceTagName,
      derivedTagId: H.derivedTagId,
      derivedTagName: H.derivedTagName,
      slotMappings: $,
      saved: { sourceTagId: H.sourceTagId, derivedTagId: H.derivedTagId, slotMappings: $ }
    }), f(""), ie();
  }
  function Me(H, F, $ = "") {
    Q.current = null, H === "source" ? (d([]), y(F != null)) : (u([]), p(F != null)), s((q) => Qu(q, H, F, $));
  }
  async function W(H) {
    Q.current = null;
    const F = [ve(), t == null ? void 0 : t()];
    return H.draftKind === "source" ? (y(!0), F.push(ne(`/slot-definitions/${H.tagId}`).then(($) => d($.definitions || [])).finally(() => y(!1)))) : H.draftKind === "derived" && (p(!0), F.push(ne(`/slot-definitions/${H.tagId}`).then(($) => u($.definitions || [])).finally(() => p(!1)))), Promise.all(F);
  }
  function X(H, F, $) {
    s((q) => ({
      ...q,
      slotMappings: q.slotMappings.map((fe, he) => he === H ? { ...fe, [F]: $ } : fe)
    }));
  }
  async function me() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const H = ea(a, o);
    if (H) {
      f(H.message);
      return;
    }
    if (a.slotMappings.some((F) => !F.sourceSlotDefinitionId || !F.derivedSlotDefinitionId)) {
      f("Complete or remove every performer slot mapping before saving.");
      return;
    }
    k(!0), f(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let F = null;
      if (a.ruleId != null) {
        const q = await ne(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${q.deletedSegmentCount}
Removed lineage edges: ${q.removedEdgeCount}
Shared derived segments retained: ${q.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        F = q.fingerprint;
      }
      f("Saving derived segment rule…");
      const $ = await ne("/derivation-rules", {
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
      if (await ve(), w(Y === "graph" ? { type: "node", id: Number($.sourceTagId) } : { type: "rule", id: $.id }), s(null), a.ruleId == null)
        try {
          const q = await ne(
            `/derivation-rules/${$.id}/materialization/preview`,
            { method: "POST" }
          );
          O(
            q.createCount + q.linkCount > 0 ? q : null
          ), f(q.createCount + q.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          O(null), f("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        O(null), f("Derived segment rule saved. Previous materializations were removed.");
    } catch (F) {
      f(F.message || "Unable to save derived segment rule.");
    } finally {
      k(!1);
    }
  }
  async function Se(H) {
    k(!0), f("Previewing rule deletion…");
    try {
      const F = await ne(
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
      await ne(`/derivation-rules/${H.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je($),
          fingerprint: F.fingerprint
        })
      }), Ye($), await ve(), (a == null ? void 0 : a.ruleId) === H.id && s(null), (S == null ? void 0 : S.type) === "rule" && S.id === H.id && w(null), (K == null ? void 0 : K.ruleId) === H.id && O(null), f(`Rule deleted with ${F.deletedSegmentCount} exclusively derived segment${F.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (F) {
      f(F.message || "Unable to delete derived segment rule.");
    } finally {
      k(!1);
    }
  }
  async function ke(H, F = null) {
    const $ = F || await ne(
      `/derivation-rules/${H.id}/materialization/preview`,
      { method: "POST" }
    );
    if ($.createCount + $.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const q = `derivation-rule-materialize:${H.id}:${$.fingerprint}`, fe = await ne(`/derivation-rules/${H.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Je(q),
        fingerprint: $.fingerprint
      })
    });
    return Ye(q), fe;
  }
  async function be(H, F = null) {
    k(!0), f("Finding pending derivations…");
    try {
      const $ = await ke(H, F);
      if (O(null), await ve(), $.createdCount + $.linkedCount === 0) {
        f("Every applicable derivation is already materialized.");
        return;
      }
      f(
        `${$.createdCount} derived segment${$.createdCount === 1 ? "" : "s"} created and ${$.linkedCount} existing segment${$.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch ($) {
      f($.message || "Unable to materialize pending derivations.");
    } finally {
      k(!1);
    }
  }
  async function _(H, F) {
    if (F.length === 0) return;
    k(!0), f(`Finding pending derivations from ${H.name}…`);
    let $ = 0, q = 0;
    try {
      for (const fe of F) {
        const he = await ke(fe);
        $ += he.createdCount, q += he.linkedCount;
      }
      O(null), await ve(), f($ + q === 0 ? `Every outgoing derivation from ${H.name} is already materialized.` : `${$} derived segment${$ === 1 ? "" : "s"} created and ${q} existing segment${q === 1 ? "" : "s"} linked from ${H.name}.`);
    } catch (fe) {
      await ve().catch(() => {
      }), f(fe.message || `Unable to materialize derivations from ${H.name}.`);
    } finally {
      k(!1);
    }
  }
  const we = ea(a, o), le = Ve(
    () => Wu(o, e),
    [o, e]
  ), N = D.trim().toLocaleLowerCase(), x = le.components.filter((H) => P === "all" || H.segmentGroupKeys.includes(P)).filter((H) => !N || H.nodes.some((F) => F.name.toLocaleLowerCase().includes(N))), v = x.flatMap((H) => H.rules), m = new Set(
    x.flatMap((H) => H.nodes.map((F) => F.tagId))
  ), T = Ve(
    () => Ju(x),
    [x]
  ), V = Y === "list" ? Yu(
    S,
    v,
    N.length > 0
  ) : null, ae = (S == null ? void 0 : S.type) === "node" && le.nodes.find((H) => H.tagId === S.id && m.has(H.tagId)) || null, re = [...v].sort((H, F) => C === "source" ? At(H.sourceTagName, F.sourceTagName) || At(H.derivedTagName, F.derivedTagName) : C === "target" ? At(H.derivedTagName, F.derivedTagName) || At(H.sourceTagName, F.sourceTagName) : C === "materialized" ? (Number(F.edgeCount) || 0) - (Number(H.edgeCount) || 0) || At(H.sourceTagName, F.sourceTagName) : At(
    `${H.sourceTagName} ${H.derivedTagName}`,
    `${F.sourceTagName} ${F.derivedTagName}`
  ));
  return r(Xu, {
    arrowMarkerId: se,
    busy: b,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: U,
    deleteRule: Se,
    derivedSlots: c,
    derivedSlotsLoading: h,
    draft: a,
    draftIssue: we,
    editRule: ge,
    editorRef: L,
    emptyDraft: n,
    graph: le,
    layout: T,
    listSort: C,
    materializationOffer: K,
    materializeOutgoingRules: _,
    materializeRule: be,
    message: I,
    normalizedQuery: N,
    query: D,
    refreshConfiguredTag: W,
    revealEditor: ie,
    rules: o,
    save: me,
    segmentGroupKey: P,
    selectedNode: ae,
    selectedRule: V,
    selection: S,
    setConfiguringTag: Z,
    setDraft: s,
    setListSort: E,
    setMaterializationOffer: O,
    setQuery: J,
    setSegmentGroupKey: R,
    setSelection: w,
    setView: A,
    sortedVisibleRules: re,
    sourceSlots: l,
    sourceSlotsLoading: g,
    updateMapping: X,
    updateTag: Me,
    view: Y,
    visibleComponents: x,
    visibleRules: v
  });
}
function em() {
  const [e, t] = G(Ia), n = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => Li({ ...l, [a]: s }));
  }
  function i() {
    t(Li(Oo));
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
        onChange: (u) => o(a, u.target.value),
        className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
      })
    ])))
  ]);
}
function tm({ active: e, segmentGroups: t, onSegmentGroupsChanged: n }) {
  const [o, i] = G([]), [a, s] = G(!1), [l, d] = G(!1), [c, u] = G(""), [g, y] = G(""), [h, p] = G("all"), [b, k] = G(() => /* @__PURE__ */ new Set()), [I, f] = G(null);
  ye(() => {
    if (!e || a) return;
    const O = new AbortController();
    return d(!0), u(""), ne("/slot-definitions", { signal: O.signal }).then((U) => {
      i(U || []), s(!0);
    }).catch((U) => {
      U.name !== "AbortError" && u(U.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      O.signal.aborted || d(!1);
    }), () => O.abort();
  }, [e, a]);
  async function D() {
    d(!0), u("");
    try {
      const O = await ne("/slot-definitions");
      i(O || []), s(!0);
    } catch (O) {
      u(O.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function J() {
    const [O] = await Promise.all([
      ne("/slot-definitions"),
      n == null ? void 0 : n()
    ]);
    i(O || []), s(!0), u("");
  }
  function Y() {
    const O = I == null ? void 0 : I.trigger;
    f(null), requestAnimationFrame(() => {
      O != null && O.isConnected && O.focus({ preventScroll: !0 });
    });
  }
  function A(O) {
    k((U) => {
      const Z = new Set(U);
      return Z.has(O) ? Z.delete(O) : Z.add(O), Z;
    });
  }
  const P = Ve(
    () => Hu(t, o),
    [t, o]
  ), R = Ve(
    () => qu(P, g, h),
    [P, g, h]
  ), S = P.flatMap((O) => O.tags), w = S.filter((O) => O.definitions.length > 0).length, C = S.length - w, E = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], K = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
          value: g,
          onChange: (O) => y(O.target.value),
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
          E.map(([O, U]) => r("button", {
            key: O,
            type: "button",
            onClick: () => p(O),
            "aria-pressed": h === O,
            className: `rounded px-3 py-1.5 text-xs font-medium ${h === O ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, U))
        )
      ]),
      r("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        r("button", {
          key: "expand",
          type: "button",
          onClick: () => k(/* @__PURE__ */ new Set()),
          className: K
        }, "Expand all"),
        r("button", {
          key: "collapse",
          type: "button",
          onClick: () => k(new Set(P.map((O) => O.overviewKey))),
          className: K
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
        onClick: D,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && R.length === 0 ? r(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? r("div", { key: "groups", className: "space-y-3" }, R.map((O) => {
      const U = b.has(O.overviewKey), Z = O.tags.filter((L) => L.definitions.length > 0).length;
      return r("article", {
        key: O.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        r("button", {
          key: "header",
          type: "button",
          onClick: () => A(O.overviewKey),
          "aria-expanded": !U,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          r("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, U ? "▸" : "▾"),
          r("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, O.name),
          r(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${O.tags.length} tag${O.tags.length === 1 ? "" : "s"} · ${Z} with slots`
          )
        ]),
        U ? null : r(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          O.tags.map((L) => r("li", {
            key: L.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            r("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              r("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: L.tagName }, L.tagName),
              L.allowSamePerformerInMultipleSlots ? r(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            L.definitions.length === 0 ? r("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : r("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${L.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, L.definitions.map((Q) => r("li", {
              key: Q.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              r("span", { key: "label", className: "font-medium text-foreground" }, Lt(Q)),
              ...(Q.genderHints || []).map((se) => r("span", {
                key: se,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, Qr(se)))
            ]))),
            r("button", {
              key: "edit",
              type: "button",
              onClick: (Q) => f({
                tagId: L.tagId,
                tagName: L.tagName,
                trigger: Q.currentTarget
              }),
              "aria-label": `Edit performer slots for ${L.tagName}`,
              className: `${K} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    I ? r(Vo, {
      key: `performer-slots-configure:${I.tagId}`,
      tagId: I.tagId,
      tagName: I.tagName,
      onSaved: J,
      onClose: Y
    }) : null
  ]);
}
function nm({ onNavigate: e, profile: t, onProfileChange: n }) {
  const [o, i] = G("general"), [a, s] = G([]), [l, d] = G(!1), [c, u] = G(""), [g, y] = G(ha), h = gd(t), p = h.map(([f]) => f);
  ye(() => {
    p.includes(o) || i(p[0] || "general");
  }, [t.effectiveMode]);
  async function b(f) {
    const D = await ne("/segment-groups", f ? { signal: f } : void 0);
    s(D || []);
  }
  ye(() => {
    const f = new AbortController();
    return b(f.signal).catch((D) => {
      D.name !== "AbortError" && u(D.message || "Unable to load tag groups.");
    }), () => f.abort();
  }, []);
  async function k(f) {
    if (f !== t.requestedMode) {
      d(!0), u("");
      try {
        const D = await ne(
          `/preferences/transition?mode=${encodeURIComponent(f)}`
        );
        let J = !1, Y = null, A = null, P = null, R = !1;
        if (t.requestedMode === "basic" && f === "full") {
          if (!window.confirm(yd(
            D.recyclingBinCount,
            D.protectedRecyclingBinCount
          )))
            return;
          R = !0, D.recyclingBinCount > 0 && (J = !0, P = D.recyclingBinFingerprint, Y = `mode-switch-empty-bin:${P}`, A = Je(Y));
        }
        let S = !1;
        if (t.requestedMode === "full" && f === "basic") {
          if (!window.confirm(pd(
            D.extensionOwnedSegmentCount
          )))
            return;
          S = !0;
        }
        const w = await ne("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: f,
            confirmHiddenExtensionOwnedSegments: S,
            confirmBasicHistoryCleanup: R,
            emptyRecyclingBin: J,
            operationId: A,
            expectedRecyclingBinFingerprint: P
          })
        });
        Y && Ye(Y), n == null || n(Ca(w)), u("Workflow mode saved.");
      } catch (D) {
        u(D.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  const I = { page: "segment-studio" };
  return r("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    r("a", { key: "back", href: "/segment-studio", onClick: (f) => ss(f, e, I), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      h.map(([f, D]) => r("button", {
        key: f,
        type: "button",
        onClick: () => i(f),
        "aria-current": o === f ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === f ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, D))
    ),
    r(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      r(em)
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
      r(fu, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: k,
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
          checked: g,
          onChange: (f) => {
            const D = f.target.checked;
            va(D), y(D);
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
    p.includes("derivation") ? r(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      r(Zu, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => b()
      })
    ) : null,
    p.includes("performer-slots") ? r(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      r(tm, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => b()
      })
    ) : null,
    c ? r("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function rm({ item: e, selected: t, busy: n, onSelect: o, onRestore: i, onPurge: a }) {
  var u, g;
  const s = [...e.slots || []].sort((y, h) => y.sortOrder - h.sortOrder || String(y.slotDefinitionId).localeCompare(String(h.slotDefinitionId))), l = [...new Map(s.map((y) => [
    y.performerId,
    { id: y.performerId, name: y.performerName }
  ])).values()], d = s.map((y) => ({
    slotDefinitionId: y.slotDefinitionId,
    label: Lt(y),
    performer: { id: y.performerId, name: y.performerName }
  })), c = Ma(e);
  return r("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: _a(t)
  }, [
    r("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((u = e.activity) == null ? void 0 : u.name) || "segment"}, ${e.reviewState}, ${Fe(e.startSec)} to ${e.endSec == null ? "end of video" : Fe(e.endSec)}` }, [
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
          r(xn, { key: "state", state: e.reviewState, includeLabel: !1 }),
          r("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((g = e.activity) == null ? void 0 : g.name) || "Tag segment"),
          l.length ? r(Xr, {
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
function om({ item: e, index: t, count: n, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return r("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? r("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, r(oa, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: Cd(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : r("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    r("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      r("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      r("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${n}`),
      r("button", { key: "next", type: "button", disabled: t < 0 || t >= n - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      r("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      r("a", { key: "edit", href: Ma(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function ta({ onNavigate: e, profile: t }) {
  const n = Ve(() => {
    const W = aa("ext:com.midnightrider.segment-studio:segments");
    return W ? {
      ...fo,
      defaultFilter: { ...fo.defaultFilter, ...W.findFilter || {} },
      defaultObjectFilter: W.objectFilter || {}
    } : fo;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = sa(n), [l, d] = G(null), [c, u] = G(""), [g, y] = G(0), [h, p] = G({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [b, k] = G(null), [I, f] = G(null), [D, J] = G(0), [Y, A] = G(""), [P, R] = G(!0), [S, w] = G(""), C = ue(0), E = Sd(i, l), K = E.slots !== void 0, O = Nd(o, E), U = h.performerSlotsAvailable !== !1, Z = Ve(
    () => U ? [...ji, bd(l, i, Fd)] : ji,
    [l, i, U]
  ), L = JSON.stringify(O);
  ye(() => {
    const W = new AbortController();
    return u(""), ne("/browse/roles", { signal: W.signal }).then(d).catch((X) => {
      X.name !== "AbortError" && (X.status === 403 ? (d([]), p((me) => ({ ...me, performerSlotsAvailable: !1 }))) : u(X.message || "Unable to load performer slot roles."));
    }), () => W.abort();
  }, [g]), ye(() => {
    E !== i && !K && s(E);
  }, [E, i, K]), ye(() => {
    if (K) return;
    const W = ++C.current, X = new AbortController();
    return R(!0), w(""), ne("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(O), signal: X.signal }).then((me) => {
      W === C.current && p({ ...me, totalCount: me.totalCount ?? me.total ?? 0 });
    }).catch((me) => {
      if (!(W !== C.current || me.name === "AbortError")) {
        if (me.status === 400 && me.message.includes("unrestricted performer read access")) {
          p((Se) => ({ ...Se, performerSlotsAvailable: !1 })), s(Id(E)), A("Performer slot filters were cleared because performer details are unavailable.");
          return;
        }
        w(me.message);
      }
    }).finally(() => {
      W === C.current && R(!1);
    }), () => {
      C.current++, X.abort();
    };
  }, [L, D, K]);
  const Q = h.items.findIndex((W) => W.key === b), se = h.items[Q] || null;
  function ie(W) {
    s(W), a({ ...o, page: 1 });
  }
  function ve() {
    const W = document.querySelector(`[data-segment-key="${b}"]`);
    k(null), requestAnimationFrame(() => W == null ? void 0 : W.focus());
  }
  async function ge(W) {
    var Se;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    f(W.key), A("");
    const X = `browse-restore:${W.itemId}:${W.revision}`, me = Je(X);
    try {
      const ke = (be = !1) => ne(`/bin/${W.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: me,
          expectedRevision: W.revision,
          discardMissingImage: be
        })
      });
      try {
        await ke(Fo(X));
      } catch (be) {
        if (((Se = be.payload) == null ? void 0 : Se.code) !== "missing-image" || !window.confirm(`${be.message}

Continue and discard the missing image reference?`))
          throw be;
        Go(X), await ke(!0);
      }
      Ye(X), b === W.key && k(null), A("Segment restored to Cove."), J((be) => be + 1);
    } catch (ke) {
      A(ke.message || "Unable to restore the segment."), ke.status === 409 && J((be) => be + 1);
    } finally {
      f(null);
    }
  }
  async function Me(W) {
    f(W.key), A("");
    try {
      const X = await ne(`/items/${W.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: W.revision })
      });
      if (!Ba(X, A) || !Hd(X))
        return;
      const me = `browse-dependency-delete:${W.itemId}:${X.fingerprint}`;
      await ne(`/items/${W.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(me),
          fingerprint: X.fingerprint
        })
      }), Ye(me), b === W.key && k(null), A(`${X.deletedSegmentCount} segment${X.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), J((Se) => Se + 1);
    } catch (X) {
      A(X.message || "Unable to permanently delete the segment."), X.status === 409 && J((me) => me + 1);
    } finally {
      f(null);
    }
  }
  return r("div", { className: "w-full space-y-5" }, [
    r(Wo, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    r(la, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: a,
      totalCount: h.totalCount,
      isLoading: P,
      error: S ? new Error(S) : null,
      onRetry: () => J((W) => W + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: Z,
      objectFilter: E,
      supportsFilterExpressions: !0,
      onObjectFilterChange: ie,
      searchPlaceholder: "Search segments..."
    }, [
      r(om, { key: "player", item: se, index: Q, count: h.items.length, onPrevious: () => {
        var W;
        return k((W = h.items[Q - 1]) == null ? void 0 : W.key);
      }, onNext: () => {
        var W;
        return k((W = h.items[Q + 1]) == null ? void 0 : W.key);
      }, onClose: ve, onNavigate: e }),
      c ? r("div", { key: "roles-error", role: "alert", className: "flex flex-wrap items-center gap-3 rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, [
        r("span", { key: "text" }, `Performer slot roles could not be loaded: ${c}`),
        r("button", { key: "retry", type: "button", onClick: () => y((W) => W + 1), className: "font-semibold text-accent hover:underline" }, "Retry")
      ]) : null,
      Y ? r("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, Y) : null,
      !P && h.items.length === 0 ? r("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      P ? null : r("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, h.items.map((W) => r(rm, {
        key: W.key,
        item: W,
        selected: W.key === b,
        busy: I === W.key,
        onSelect: () => k(W.key),
        onRestore: ge,
        onPurge: Me
      })))
    ])
  ]);
}
function im({ onNavigate: e, profile: t }) {
  const [n, o] = G([]), [i, a] = G(""), [s, l] = G(0), [d, c] = G(!0), [u, g] = G(null), [y, h] = G(""), p = ue(null);
  async function b(f) {
    const D = await ne("/bin", f ? { signal: f } : void 0);
    return o(D.items || []), a(D.fingerprint || ""), l(Number(D.totalCount) || 0), D;
  }
  ye(() => {
    const f = new AbortController();
    return c(!0), b(f.signal).catch((D) => {
      D.name !== "AbortError" && h(D.message);
    }).finally(() => {
      f.signal.aborted || c(!1);
    }), () => f.abort();
  }, []), ia(Do, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var f;
      return (f = p.current) == null ? void 0 : f.call(p);
    }
  }]);
  async function k(f) {
    var Y;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    g(f.itemId), h("");
    const D = `restore:${f.itemId}:${f.revision}`, J = Je(D);
    try {
      const A = (P = !1) => ne(`/bin/${f.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: J, expectedRevision: f.revision, discardMissingImage: P })
      });
      try {
        await A(Fo(D));
      } catch (P) {
        if (((Y = P.payload) == null ? void 0 : Y.code) !== "missing-image" || !window.confirm(`${P.message}

Continue and discard the missing image reference?`)) throw P;
        Go(D), await A(!0);
      }
      Ye(D), await b(), dr(), h("Segment restored with a new native ID.");
    } catch (A) {
      h(A.message || "Unable to restore the segment."), A.status === 409 && await b();
    } finally {
      g(null);
    }
  }
  async function I() {
    if (u == null)
      try {
        const f = await Ka({
          items: n,
          fingerprint: i,
          totalCount: s
        }, () => {
          g(-1), h("");
        });
        if (f.status !== "emptied") return;
        await b(), dr(), h(`${f.segmentCount} segment${f.segmentCount === 1 ? "" : "s"} from ${f.sceneCount} scene${f.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (f) {
        h(f.message || "Unable to empty the recycling bin."), f.status === 409 && await b();
      } finally {
        g(null);
      }
  }
  return p.current = I, r("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    r(Wo, {
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
        disabled: d || u != null || s === 0,
        onClick: I,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, u === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    y ? r("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, y) : null,
    d ? r("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && n.length === 0 ? r("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...n.map((f) => r("article", { key: f.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      r("div", { key: "copy", className: "min-w-0 flex-1" }, [
        r("h2", { key: "title", className: "truncate font-semibold" }, `${f.tagName || "Tag segment"} · ${f.videoTitle || `Video ${f.videoId}`}`),
        r("p", { key: "time", className: "font-mono text-xs text-secondary" }, f.endSec == null ? Fe(f.startSec) : `${Fe(f.startSec)} – ${Fe(f.endSec)}`),
        r("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${f.sourceKey || "unknown"}`)
      ]),
      r("a", { key: "video", href: `/video/${f.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      r("button", { key: "restore", type: "button", disabled: u != null, onClick: () => k(f), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const na = "ext:com.midnightrider.segment-studio:videos";
async function am(e, t, n, o) {
  const i = await Kd("/api/videos/find", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(su(e, t, { fullMode: n })),
    signal: o
  }), a = Array.isArray(i == null ? void 0 : i.items) ? i.items : [], s = a.length > 0 ? await ne("/videos/segment-counts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoIds: a.map((d) => d.id) }),
    signal: o
  }) : { items: [] }, l = new Map(((s == null ? void 0 : s.items) ?? []).map((d) => [d.videoId, d]));
  return { items: a.map((d) => du(d, l.get(d.id))), totalCount: (i == null ? void 0 : i.totalCount) ?? 0 };
}
function bo({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: n = "editor",
  profile: o
}) {
  const i = t || n === "review", a = Ve(() => {
    var se;
    const L = aa(na), Q = (se = L == null ? void 0 : L.uiOptions) == null ? void 0 : se.displayMode;
    return L ? {
      ...Vt,
      defaultFilter: Ro({ ...Vt.defaultFilter, ...L.findFilter || {} }),
      defaultObjectFilter: To(L.objectFilter || {}, { fullMode: i }),
      defaultDisplayMode: Vt.allowedDisplayModes.includes(Q) ? Q : Vt.defaultDisplayMode
    } : Vt;
  }, []), { filter: s, objectFilter: l, displayMode: d, setFilter: c, setObjectFilter: u, setDisplayMode: g } = sa(a), [y, h] = G({ items: [], totalCount: 0 }), [p, b] = G(!0), [k, I] = G(""), [f, D] = G(0), [J, Y] = G(/* @__PURE__ */ new Set()), A = ue(0), P = ue(null), R = JSON.stringify(s), S = JSON.stringify(l);
  ye(() => {
    const L = To(l, { fullMode: i });
    L !== l && u(L);
    const Q = Ro(s);
    Q !== s && c(Q);
  }, [R, S, i]), ye(() => {
    P.current = null, Y(/* @__PURE__ */ new Set());
  }, [R, S]), ye(() => {
    const L = ++A.current, Q = new AbortController();
    return b(!0), I(""), am(s, l, i, Q.signal).then((se) => {
      L === A.current && h(se);
    }).catch((se) => {
      L === A.current && se.name !== "AbortError" && I(se.message || "Unable to discover videos.");
    }).finally(() => {
      L === A.current && b(!1);
    }), () => {
      A.current++, Q.abort();
    };
  }, [R, S, i, f]);
  function w(L) {
    c({ ...L, page: L.page || 1 });
  }
  function C(L) {
    u(L), c({ ...s, page: 1 });
  }
  function E(L, Q = !1) {
    Y((se) => cu(
      se,
      y.items.map((ie) => ie.videoId),
      L,
      P.current,
      Q
    )), P.current = L;
  }
  function K() {
    P.current = null, Y(new Set(y.items.map((L) => L.videoId)));
  }
  function O() {
    P.current = null, Y(/* @__PURE__ */ new Set());
  }
  function U() {
    P.current = null, Y((L) => new Set(y.items.map((Q) => Q.videoId).filter((Q) => !L.has(Q))));
  }
  const Z = Ve(() => lu(dl), []);
  return r("div", { className: "w-full space-y-5" }, [
    r(Wo, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && n === "editor",
      profile: o
    }),
    r(la, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      filterMode: "videos",
      savedFilterScope: na,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: s,
      onFilterChange: w,
      totalCount: y.totalCount,
      isLoading: p,
      error: k ? new Error(k) : null,
      onRetry: () => D((L) => L + 1),
      sortOptions: cl,
      displayMode: d,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: Z,
      objectFilter: l,
      supportsFilterExpressions: !0,
      onObjectFilterChange: C,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: yn ? J : void 0,
      onSelectAll: yn ? K : void 0,
      onSelectNone: yn ? O : void 0,
      onInvertSelection: yn ? U : void 0,
      // The host renders whatever extensions contribute for a video selection, so
      // Run AI here is the same action, and the same dialog, as the native videos
      // page, in Basic and Full mode alike. Selection serves only this bar, so it
      // is offered only on hosts that render it. Only the contributed actions are
      // rendered: Segment Studio's own ownership and lineage rules govern
      // deletion, so the native bulk mutations that would bypass them stay out of
      // this bar.
      selectionActions: yn && J.size > 0 ? r(ja, { entityType: "video", selectedIds: J }) : null
    }, [
      !p && y.items.length === 0 ? r("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !p && d === "grid" ? r("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, y.items.map((L) => r(uu, { key: L.videoId, item: L, onNavigate: e, showReviewStates: i, selected: J.has(L.videoId), selectionActive: J.size > 0, onSelect: yn ? E : null }))) : null,
      !p && d === "list" ? r("section", { key: "rows", className: "space-y-3" }, y.items.map((L) => r(mu, { key: L.videoId, item: L, onNavigate: e, showReviewStates: i, selected: J.has(L.videoId), selectionActive: J.size > 0, onSelect: yn ? E : null }))) : null
    ])
  ]);
}
function ra({
  videoId: e,
  onNavigate: t,
  compatibilityMode: n = !1,
  profile: o
}) {
  const [i, a] = G(null), [s, l] = G(!0), [d, c] = G(""), u = ue(0), g = ue(0), y = ue(e), h = ue(0), p = ue([]), b = _c();
  y.current = e;
  const [k] = G(() => El({
    beginRequest: () => ({ requestId: ++g.current, videoId: y.current, updateSequence: h.current }),
    fetchDetail: (R) => ne(I(R.videoId)),
    isCurrent: (R) => Mr(R.requestId, g.current, R.videoId, y.current),
    isSameVideo: (R) => R.videoId === y.current
  })), I = (R) => `/videos/${R}/editor`;
  async function f(R, S, w) {
    const C = await ne(I(S), w ? { signal: w.signal } : void 0);
    return Mr(R, w ? u.current : g.current, S, y.current) ? (a(C), !0) : !1;
  }
  ye(() => {
    const R = ++u.current, S = e, w = new AbortController();
    return a(null), l(!0), c(""), f(R, S, w).catch((C) => {
      Mr(R, u.current, S, y.current) && C.name !== "AbortError" && c(C.message || "Unable to load the editor.");
    }).finally(() => {
      Mr(R, u.current, S, y.current) && l(!1);
    }), () => {
      u.current++, g.current++, w.abort();
    };
  }, [e]);
  function D(R, S) {
    if (typeof R == "function") {
      const w = ++h.current;
      p.current = [...p.current.slice(-199), { sequence: w, videoId: S, update: R }];
    } else
      h.current += 1, p.current = [];
    a((w) => (w == null ? void 0 : w.video.id) !== S ? w : typeof R == "function" ? R(w) : R);
  }
  function J(R, S) {
    return p.current.filter((w) => w.sequence > S.updateSequence && w.videoId === S.videoId).reduce((w, C) => C.update(w), R);
  }
  function Y() {
    return k({
      prepare: J,
      onLoaded: (R) => {
        a(R), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: (R) => c(R.message || "Unable to reload the latest segment.")
    });
  }
  function A() {
    return k({
      prepare: J,
      onLoaded: (R) => {
        a(R), c("");
      },
      onError: (R) => c(R.message || "Unable to reload performer slots.")
    });
  }
  function P() {
    return k({
      prepare: J,
      onLoaded: (R) => {
        a(R), c("");
      },
      onError: (R) => c(R.message || "Unable to load the new AI review results.")
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
      r(gl, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      r("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? r(_u, {
      key: i.video.id,
      detail: i,
      onDetailChange: D,
      onConflict: Y,
      onReload: A,
      onAnalysisCompleted: P,
      onSlotsChanged: A,
      splitLayout: b,
      profile: o,
      initialSegmentId: Fi() ? -Fi() : $d(),
      compatibilityMode: n,
      onNavigate: t
    }) : null
  ]);
}
function sm(e, t, n) {
  return t === "settings" || e === "settings" || t == null && e == null && n.replace(/\/+$/, "") === "/segment-studio/settings";
}
function lm(e, t, n) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(n.replace(/\/+$/, ""));
}
function dm(e, t, n) {
  return t === "bin" || e === "bin" || t == null && e == null && n.replace(/\/+$/, "") === "/segment-studio/bin";
}
function cm({
  id: e,
  slug: t,
  onNavigate: n,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = ud(o), l = sm(e, t, window.location.pathname), d = lm(e, t, window.location.pathname), c = dm(e, t, window.location.pathname), u = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (fd(u, o) === "videos" && u !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), r(bo, {
      onNavigate: n,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return r(nm, {
    onNavigate: n,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return r(ta, { onNavigate: n, profile: o });
    const h = Number(e);
    return Number.isInteger(h) && h > 0 ? r(ra, {
      videoId: h,
      onNavigate: n,
      compatibilityMode: !0,
      profile: o
    }) : r(bo, {
      onNavigate: n,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return r(im, { onNavigate: n, profile: o });
  const y = Number(e);
  return d ? r(ta, { onNavigate: n, profile: o }) : Number.isInteger(y) && y > 0 ? r(ra, {
    videoId: y,
    onNavigate: n,
    compatibilityMode: s === "review",
    profile: o
  }) : r(bo, {
    onNavigate: n,
    mode: s,
    profile: o
  });
}
function um({ id: e, slug: t, onNavigate: n }) {
  const [o, i] = G(null), [a, s] = G("");
  return ye(() => {
    const l = new AbortController();
    return ne("/preferences", { signal: l.signal }).then((d) => i(Ca(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? r("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? r("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : r(cm, {
    id: e,
    slug: t,
    onNavigate: n,
    profile: o,
    onProfileChange: i
  });
}
function mm(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const n = Number(t[0]);
  return Number.isInteger(n) && n > 0 ? `/segment-studio/${n}` : null;
}
function gm(e, t) {
  const n = mm(t);
  return n ? (window.location.assign(n), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const Gm = {
  components: { SegmentStudioPage: um },
  actionHandlers: { openSegmentStudio: gm }
};
export {
  Fu as ANALYSIS_RUN_CHECK_INTERVAL_MS,
  Ln as CLEARED_SEGMENT_SELECTION_ID,
  Zt as SEGMENT_STUDIO_CAPABILITIES,
  Do as SEGMENT_STUDIO_EXTENSION_ID,
  pr as SEGMENT_STUDIO_SHORTCUTS,
  Ol as activeEditorFilterCount,
  Xd as activeSwimlaneLabelStyle,
  jc as addPendingChange,
  dc as applyDerivationRuleSlotSuggestions,
  sn as applyFeedbackEditorDelta,
  qo as applyPendingChanges,
  Hi as applySegmentMergeDelta,
  Dc as areSegmentsBusy,
  Pr as availableDerivationRuleSlots,
  Vd as basicSegmentTimelineStyle,
  Cd as browseClipEnd,
  Ma as browseEditorHref,
  Nd as buildBrowseRequest,
  Wu as buildDerivationRuleGraph,
  su as buildDiscoveryFindRequest,
  vl as buildMinuteTimelineTicks,
  Hu as buildPerformerSlotOverview,
  Md as buildSegmentQuickSearchEntries,
  fc as buildSegmentRailRows,
  pc as buildTimelineRows,
  vm as buildTimelineTicks,
  wl as calculateCenteredTimelineScroll,
  vo as calculateEditorPanelMaximum,
  Sl as calculateMinuteLabelStride,
  Sm as calculateMinuteTimelineWidth,
  Cl as calculateSwimlaneTitleMaximum,
  Nl as calculateTimelinePlayheadPosition,
  Po as calculateTimelineRatioBounds,
  Tl as calculateTimelineRatioFromPointer,
  xm as calculateVerticalRevealOffset,
  bn as clampEditorPanelWidth,
  Fr as clampSwimlaneTitleWidth,
  ba as clampTimelineRatio,
  Lo as clampTimelineRatioForHeight,
  _r as clampTimelineZoom,
  eu as compactProvenanceSummary,
  Bc as confirmPendingChange,
  El as createEditorReloader,
  ed as createQueuedReviewRequest,
  Oc as createSaveQueue,
  Bu as createSegmentAnalysisRequestScope,
  Gm as default,
  rs as discardPendingChange,
  lu as discoveryCriteria,
  _d as downloadFileNameFromContentDisposition,
  Pl as dualRangeValueFromPointer,
  Oi as duplicateIdentityFromResponse,
  rd as duplicateOperationKey,
  Sa as editorVisibilityIncludingSegment,
  hc as expandedSwimlanes,
  pd as extensionOwnedSegmentsModeSwitchPrompt,
  wc as feedbackFrameTimestamps,
  Ic as feedbackResultMatchesAction,
  Nc as feedbackSelectionPlan,
  Dl as filterDerivedSegments,
  uo as filterEditorSegments,
  qu as filterPerformerSlotOverview,
  Ad as filterSegmentQuickSearch,
  Cm as filterSegmentStudioShortcuts,
  xc as findAdjacentSegmentGroupKey,
  dd as findAdjacentShot,
  Xl as findEditorShortcut,
  ya as findInitialSegmentSelection,
  hl as findNearestSegmentInCurrentSwimlane,
  Br as findNextUnprocessed,
  ld as findPublishedSelectionIdentity,
  mt as findSegmentByStableIdentity,
  Rl as findSegmentFromPlayhead,
  bl as findSegmentNearPlayhead,
  Sc as findSwimlaneRangeSelection,
  Co as findSwimlaneSelection,
  Rd as findUniquePerformerSlotAssignment,
  zr as findUnreviewedSelection,
  oc as focusDialogDefaultButton,
  Qr as formatGenderHint,
  cd as frameStepSeconds,
  Da as generatePerformerSlotAssignmentRecommendations,
  ku as groupApprovedDraftsForPublishing,
  Ed as groupAutoAssignCandidates,
  Cc as groupIncorrectExamplesByTag,
  $u as groupMaterializationOutputs,
  vn as groupSegmentsIntoSwimlanes,
  yc as groupSelectedSwimlanes,
  _o as groupSwimlanesBySegmentGroup,
  Pt as handleModalKey,
  Va as hasGroupedSwimlanes,
  Un as hasSegmentStudioCapability,
  ts as heldTagChangeFor,
  sd as heldTagReady,
  Wi as hideCollectedFeedbackSegments,
  zi as historyActionsForTarget,
  Or as incorrectExampleHistoryState,
  Wa as indexPerformerSlotsBySegment,
  Rm as initialReviewFilter,
  Rc as insertSegmentProjection,
  Mr as isCurrentEditorRequest,
  ec as isEditableTarget,
  jn as isEditorHeldByOtherWork,
  Am as isEditorShortcutOwner,
  Ac as isKindRunning,
  Jr as isPublishableApprovedDraft,
  Fm as isSaveQueueBusy,
  gs as isSavedDerivationRulePair,
  $o as isSegmentCreationPending,
  dm as isSegmentStudioBinRoute,
  lm as isSegmentStudioSegmentsRoute,
  sm as isSegmentStudioSettingsRoute,
  Ur as isTemporarySegment,
  Vu as layoutDerivationRuleComponent,
  Ju as layoutDerivationRuleComponents,
  Ec as mergeSegmentsProjection,
  Sd as migrateLegacyBrowseFilter,
  To as migrateLegacyDiscoveryFilter,
  Ro as migrateLegacyDiscoverySort,
  sc as multiSelectionActionHint,
  dn as normalizeCollapsedSegmentGroups,
  Vr as normalizeDiscoveryIds,
  Gt as normalizeEditorSegmentFilters,
  an as normalizeGender,
  Pi as normalizeReviewFilter,
  Bo as normalizeSegmentGroupColor,
  Ca as normalizeSegmentStudioFeatureProfile,
  $m as normalizeSegmentStudioMode,
  wo as normalizeSegmentStudioPublicMode,
  $l as parseEditorLayout,
  Al as parseHideDerivedSegmentsPreference,
  Ml as parseMergeConfirmationPreference,
  Na as parsePlaybackShortcutConfig,
  Yl as parseShortcutBindingOverrides,
  Gn as patchPerformerSlotProjection,
  Om as patchSegmentProjection,
  Uc as pendingChangesReducer,
  Fc as pendingInsertedSegments,
  Hl as percentageSeekTime,
  Td as performInitialSegmentSeek,
  yt as performerOptionId,
  Hr as performerSlotHistoryState,
  Lt as performerSlotLabel,
  cc as performerSlotPresentation,
  Dm as performerSlotStatus,
  zo as performerSlotStatusFromSegmentSlots,
  qa as performerSlotsForSegment,
  Ht as provenanceSourceLabel,
  is as prunePendingChanges,
  ad as queueCreatedSegmentTagChoice,
  Oa as rankPerformerOptions,
  kc as reconcileSegmentGroupKey,
  Kl as reconcileSelectedSegmentIds,
  gu as recyclingBinActionText,
  qd as recyclingBinDeletionPrompt,
  Ua as recyclingBinDeletionSummary,
  yd as recyclingBinModeSwitchPrompt,
  Tm as removeQueuedReviewsForSegments,
  Pm as removeSegmentsProjection,
  Fi as requestedOwnedItemId,
  $d as requestedSegmentId,
  jl as resolveEditorSegmentSelection,
  td as resolveQueuedReviewRequest,
  od as resolveSegmentCreationAction,
  fd as resolveSegmentStudioRoute,
  Ql as resolveSegmentStudioShortcuts,
  Za as resolveSegmentTarget,
  Yu as resolveSelectedDerivationRule,
  Ei as resolveSelectedSegments,
  Au as restoreDisabledToolbarActionFocus,
  zu as restorePublishApprovedFocus,
  Lm as restoreSegmentFieldsProjection,
  jm as restoreSegmentsProjection,
  Qu as retagDerivationRuleDraft,
  Gc as retargetPendingChanges,
  Xa as revealCollapsedSegmentGroup,
  Kn as sameSegmentIdentity,
  es as savingSegmentIdFrom,
  za as segmentBadgeStyle,
  Qd as segmentGroupEdgeColor,
  Yr as segmentGroupHeaderBackground,
  zt as segmentGroupKeyForSegment,
  Ko as segmentHistoryIdentity,
  Dr as segmentHistoryState,
  pt as segmentIdentity,
  _a as segmentRailItemStyle,
  Em as segmentStateStyle,
  mm as segmentStudioActionTarget,
  ud as segmentStudioLegacyMode,
  Wd as segmentTimelineStyle,
  Ft as segmentsHistoryState,
  zl as selectAllVideoSegmentIds,
  xd as selectedBrowseStates,
  Ya as selectedSwimlaneMerge,
  Gr as selectionReferenceForSegment,
  ss as setBackLinkNavigation,
  os as settlePendingChange,
  ic as sharedPerformerSlotShape,
  ac as sharedTagPerformerSlotShape,
  Bn as shortcutAvailableInMode,
  Zl as shortcutBindingDisplayText,
  km as shortcutBindingFromEvent,
  Nm as shortcutBindingsOverlap,
  Im as shortcutModesOverlap,
  Jl as shortcutRequiresSingleSegment,
  go as shotBoundaryFingerprint,
  rc as shouldAcceptCurrentTagFromEnter,
  nc as shouldDismissPopover,
  wm as shouldExitShortcutCapture,
  Mm as shouldHandleEditorShortcut,
  Gu as shouldLoadSegmentAnalysis,
  Qi as shouldReloadAfterSegmentMutation,
  ko as shouldRestoreTransitionSelection,
  Dd as shouldShowQuickSearchGroups,
  bd as slottedPerformerCriterion,
  Ai as splitShortcutCategoriesIntoColumns,
  Uu as startCompletedRunWatch,
  lc as suggestDerivationRuleSlotMappings,
  gr as swimlaneDisplayLabel,
  Zd as swimlaneMarkerTop,
  Yd as swimlaneStripeBackground,
  id as tagEditorLockedBySave,
  Zr as targetsOverlap,
  Il as timelineContentStyle,
  Ci as timelinePlayheadHorizontalStyle,
  Jd as timelineSegmentWidth,
  xl as timelineTickAlignment,
  kl as timelineTickPosition,
  ho as timelineTimePercent,
  du as toDiscoveryItem,
  vc as toggleAllCollapsedSegmentGroups,
  Di as toggledSelectionReviewState,
  Jt as trapModalFocus,
  Bd as tryParseJsonResponseText,
  Ul as updateAnchoredSegmentSelection,
  cu as updateDiscoverySelection,
  Ll as updateDualRangeValues,
  Gl as updateSegmentCollectionSelection,
  Bl as updateSegmentRangeSelection,
  xa as updateSegmentSelection,
  ea as validateDerivationRuleDraft,
  Ii as validateSegmentTiming,
  jo as videoPerformerOptions,
  po as videoPerformerSlotAssignments,
  gd as visibleSegmentStudioSettingsTabs,
  md as visibleSegmentStudioTabs,
  Ja as visibleVirtualRows,
  Id as withoutSlottedPerformers
};
