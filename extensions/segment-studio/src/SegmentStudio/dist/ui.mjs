import Ao from "@cove/runtime/react";
import { createPortal as sl } from "@cove/runtime/react-dom";
import { extensionFetch as Do } from "@cove/runtime/api";
import * as cr from "@cove/runtime/components";
import { formatDuration as ll, EntityReferenceSelector as ur, useExtensionKeyboardBindings as dl, VideoPlayer as ia, useRegisterExtensionKeyboardActions as aa, getDefaultFilter as sa, useListUrlState as la, ListPage as da, VIDEO_CRITERIA as cl, VIDEO_SORT_OPTIONS as ul } from "@cove/runtime/components";
import { StepBack as ml, StepForward as gl, Loader2 as fl } from "@cove/runtime/lucide-react";
const Oo = "com.midnightrider.segment-studio", pl = "segment-studio-editor", ca = "segment-studio.layout.v1", xn = "segment-studio.operations.v1", ua = "segment-studio.collapsed-segment-groups.v1", ma = "segment-studio.playback-shortcuts.v1", ga = "segment-studio.timing-clipboard.v1", fa = "segment-studio.hide-derived-segments.v1", pa = "segment-studio.merge-confirmation.v1", At = ["unreviewed", "approved", "rejected"], yl = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], wi = "(min-width: 1024px) and (min-height: 640px)", Ni = "(min-width: 1024px) and (min-height: 900px)", mr = 1e-3, Ii = 15, bl = 30, ya = 12, Ot = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, Po = {
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
function Ci(e, t, n) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(n) && n > 0;
  return e < 0 || o && e > n || t != null && (t < 0 || o && t > n) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function ba(e, t = null) {
  const n = e.flatMap((o) => o.markers.map((i) => i.segment));
  return n.find((o) => o.id === t) ?? zr(e, null, 1, !0) ?? n[0] ?? null;
}
function zr(e, t, n, o = !1) {
  var u;
  const i = e.findIndex((m) => m.markers.some((p) => p.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const m = e.flatMap((p) => p.markers.map((b) => b.segment)).filter((p) => p.reviewState === "unreviewed");
    return n < 0 ? m.at(-1) ?? null : m[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((m) => m.segment.id === t);
  if (!o)
    return ((u = (n < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((p) => p.segment.reviewState === "unreviewed")) == null ? void 0 : u.segment) ?? null;
  const l = e.flatMap((m) => m.markers.map((p) => p.segment)), d = l.findIndex((m) => m.id === t);
  return (n < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((m) => m.reviewState === "unreviewed") ?? null;
}
function hl(e, t, n, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((u, m) => u.markers.filter(({ segment: p }) => {
    const b = Number(p.startSec), f = p.endSec == null ? b + bl : Number(p.endSec);
    return Number.isFinite(b) && Number.isFinite(f) && f >= b && b <= i + Ii + mr && f >= i - Ii - mr;
  }).map(({ segment: p }) => ({ segment: p, laneIndex: m }))).sort((u, m) => u.laneIndex - m.laneIndex || Math.abs(u.segment.startSec - i) - Math.abs(m.segment.startSec - i) || u.segment.id - m.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((u) => u.markers.some((m) => m.segment.id === o));
  if (s < 0) return n < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((u) => u.laneIndex !== s);
  return l.length === 0 ? n < 0 ? a.at(-1).segment : a[0].segment : n < 0 ? ((d = l.findLast((u) => u.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((u) => u.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function vl(e, t, n) {
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
function Sm(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const n = Math.max(2, Math.floor(t));
  return Array.from({ length: n }, (o, i) => e * i / (n - 1));
}
function xl(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, n) => n * 60);
}
function km(e, t = 1, n = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, n) : Math.ceil(e / 60) * Math.max(1, n) * Math.max(1, t);
}
function Sl(e, t, n = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(n) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function kl(e, t, n = null) {
  return e <= 0 || e >= t - 1 && (n == null || n >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function wl(e, t, n) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && n >= 100 ? { right: "0" } : { left: `${n}%` };
}
function Nl(e, t, n, o, i = 160, a = 0) {
  if (!(t > 0) || !(n > o)) return 0;
  const s = Math.max(0, n - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(n - o, Math.max(0, l - o / 2));
}
function vo(e, t) {
  const n = Number(e);
  return t > 0 && Number.isFinite(n) ? Math.min(1, Math.max(0, n / t)) * 100 : 0;
}
function Il(e, t, n = 10) {
  const o = vo(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(n) || 0) * (1 - i)
  };
}
function $i(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function Cl(e, t = ya) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function ha(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : Ot.timelineRatio;
}
function xo(e, t) {
  const n = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(n) ? n : 560));
}
function bn(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? Ot.detailWidth : Math.min(xo(t, 0), Math.max(240, e));
}
function Fr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? Ot.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function $l(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function Lo(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: Ot.timelineRatio, maximum: Ot.timelineRatio };
  const n = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: n, maximum: Math.max(n, o) };
}
function jo(e, t) {
  const n = ha(e);
  if (!(t > 0)) return n;
  const o = Lo(t);
  return Math.min(o.maximum, Math.max(o.minimum, n));
}
function Tl(e) {
  if (!e) return { ...Ot };
  try {
    const t = JSON.parse(e), n = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof n == "number" && Number.isFinite(n) ? ha(n) : Ot.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: bn(t == null ? void 0 : t.detailWidth),
      markerRailWidth: bn(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: Fr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...Ot };
  }
}
function Rl(e, t, n) {
  return n > 0 ? jo((t + n - e) / n, n) : Ot.timelineRatio;
}
function wm(e, t, n, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < n + a ? e - n - a : t > o - a ? t - o + a : 0;
}
function El(e, t, n, o = null) {
  var d;
  const i = [...e].sort((c, u) => c.startSec - u.startSec || c.id - u.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= mr ? i[a + (n < 0 ? -1 : 1)] ?? null : n < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function Ar(e, t, n, o) {
  return e === t && n === o;
}
function Ml({ beginRequest: e, fetchDetail: t, isCurrent: n, isSameVideo: o }) {
  let i = null, a = null;
  return function({ onLoaded: l, onError: d, prepare: c = null }) {
    const u = e(), m = (async () => {
      try {
        const p = await t(u);
        if (n(u)) {
          const b = c ? c(p, u) : p;
          return l(b), b;
        }
      } catch (p) {
        if (n(u))
          return d(p), null;
      }
      return o(u) && i !== m && a.videoId === u.videoId ? i : null;
    })();
    return i = m, a = u, m;
  };
}
const Ln = "__segment-studio-cleared-selection__";
function Al(e) {
  return e === "true";
}
function Dl(e) {
  return e !== "false";
}
function va() {
  try {
    return Dl(window.localStorage.getItem(pa));
  } catch {
    return !0;
  }
}
function xa(e) {
  try {
    window.localStorage.setItem(pa, String(!!e));
  } catch {
  }
}
function Yr(e) {
  return !e.published && e.reviewState === "approved" && !e.isDerived;
}
function Ol(e, t) {
  return t ? e.filter((n) => !n.isDerived) : e;
}
function Gt(e = {}) {
  const t = At.filter((u) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(u) : !0), n = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (u, m) => {
    const p = Number(u);
    return Number.isFinite(p) ? Math.min(1, Math.max(0, p)) : m;
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
function mo(e, t, n, o = !1, i = []) {
  var c, u;
  const a = Gt(n), s = a.performerId == null ? null : new Set((t || []).filter((m) => Number(m.performerId) === a.performerId).map((m) => m.segmentId)), l = new Set((i || []).flatMap((m) => m.tags || []).map((m) => Number(m.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((u = (c = (i || []).find((m) => Number(m.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : u.map((m) => Number(m.tagId))) || []);
  return Ol(e || [], o).filter((m) => {
    if (m.reviewState != null && !a.reviewStates.includes(m.reviewState) || s && !s.has(m.id) || a.tagId != null && Number(m.tagId) !== a.tagId || d && !d.has(Number(m.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(m.tagId)) || a.sourceKey != null && m.sourceKey !== a.sourceKey) return !1;
    const p = Number(m.confidence);
    return m.confidence == null || !Number.isFinite(p) ? a.includeUnscored : p >= a.confidenceMin && p <= a.confidenceMax;
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
function Pl(e, t = !1) {
  const n = Gt(e);
  return +(n.reviewStates.length !== At.length) + +(n.performerId != null) + +(n.tagId != null) + +(n.segmentGroupId != null) + +(n.sourceKey != null) + +(n.confidenceMin > 0 || n.confidenceMax < 1) + +!n.includeUnscored + Number(t);
}
function Ll(e, t, n) {
  const o = Number(e), i = Number(t), a = Number(n);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function jl(e, t, n, o) {
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
function Fl(e, t, n = null, o = {}) {
  if (t === Ln) return null;
  const i = t ?? n, a = (e || []).flatMap((s) => (s.markers || []).map((l) => l.segment)).find((s) => s.id === i);
  if (a) return a;
  if (o.reference) {
    const s = o.visibleLanes ?? e, l = s.flatMap((u) => (u.markers || []).map((m) => m.segment)), d = l.find((u) => u.id === o.reference.id);
    if (d) return d;
    const c = Gl(
      e,
      s,
      l,
      o.reference,
      o.referenceLanes
    );
    return Br(c.lanes, o.reference, { removedIds: c.removedIds });
  }
  return ba(e);
}
function Gl(e, t, n, o, i) {
  const a = { lanes: t, removedIds: [] };
  if (!i || (e || []).some((m) => m.key === o.laneKey)) return a;
  const s = new Map(i.map((m, p) => [m.key, p])), l = s.get(o.laneKey);
  if (l == null) return a;
  const d = new Set(n.map((m) => m.id)), c = (i[l].markers || []).filter(({ segment: m }) => m && !d.has(m.id)), u = t.reduce((m, p, b) => (s.get(p.key) ?? 1 / 0) < l ? b + 1 : m, 0);
  return {
    lanes: [
      ...t.slice(0, u),
      { key: o.laneKey, markers: c },
      ...t.slice(u)
    ],
    removedIds: c.map(({ segment: m }) => m.id)
  };
}
function ka(e, t, n, o = !1) {
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
function Bl(e, t, n) {
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
function Ul(e, t, n, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(n);
  if (s < 0 || l < 0)
    return ka(e, t, n, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: n
  };
}
function Kl(e, t, n = null, o = !1) {
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
    const m = o ? [.../* @__PURE__ */ new Set([...l, ...i])] : l;
    return {
      ...Ul(m, s, t, u, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: m
    };
  }
  const d = ka(i, a, t, o);
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
function zl(e, t, n) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return n != null && i.has(n) && !a.includes(n) && a.push(n), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function _l(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function on(e, t) {
  const n = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(n, Number((e == null ? void 0 : e.endSec) ?? n) || n), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < n ? n - a : i > o ? i - o : 0;
}
function Ti(e, t, n, o = () => !0) {
  const i = t.anchor ?? t;
  return (e || []).map((a) => a.segment).filter((a) => a && !n.has(a.id) && o(a)).sort((a, s) => on(t, a) - on(t, s) || on(i, a) - on(i, s) || Math.abs(Number(a.startSec) - Number(i.startSec)) - Math.abs(Number(s.startSec) - Number(i.startSec)) || Number(a.startSec) - Number(s.startSec) || Number(a.id) - Number(s.id))[0] ?? null;
}
function So(e, t) {
  return ((e == null ? void 0 : e.markers) || []).map((n) => n.segment).filter((n) => n && !t.has(n.id));
}
function go(e) {
  return e.reviewState === "unreviewed";
}
function Ri(e, t) {
  const n = Number(e.startSec) || 0;
  return n !== t.startSec ? n > t.startSec : Number(e.id) > Number(t.id);
}
function Ei(e, t, n, o, i) {
  var s;
  return t < 0 ? Ti(e.flatMap((l) => l.markers || []), n, o, i) : ((s = e.map((l, d) => ({ index: d, found: Ti(l.markers, n, o, i) })).filter(({ found: l }) => l).sort((l, d) => Math.abs(l.index - t) - Math.abs(d.index - t) || on(n, l.found) - on(n, d.found) || on(n.anchor ?? n, l.found) - on(n.anchor ?? n, d.found) || +(l.index < t) - +(d.index < t) || l.index - d.index)[0]) == null ? void 0 : s.found) ?? null;
}
function Hl(e, t, n) {
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
    return d.find(go) ?? d[0] ?? null;
  }
  i.add(t.id);
  const a = o.findIndex((l) => l.key === t.laneKey);
  if (a >= 0) {
    const l = So(o[a], i).filter(go), d = l.find((u) => Ri(u, t));
    if (d) return d;
    const c = l.filter((u) => !Ri(u, t)).at(-1);
    if (c) return c;
  }
  const s = Hl(o[a], t, i);
  return Ei(o, a, s, i, go) ?? Ei(o, a, s, i, () => !0);
}
function ql(e, t) {
  const n = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return n * o / 10;
}
function Mi(e, t) {
  const n = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => n.get(o)).filter(Boolean);
}
function Wl() {
  try {
    return Al(window.localStorage.getItem(fa));
  } catch {
    return !1;
  }
}
function Vl(e) {
  try {
    window.localStorage.setItem(fa, String(!!e));
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
], Jl = /* @__PURE__ */ new Set([
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
function Yl(e) {
  return Jl.has(e);
}
function wa(e) {
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
function Ql(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const n = new Set(pr.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => n.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(wa).filter(Boolean)]));
  } catch {
    return {};
  }
}
function Xl(e = {}) {
  const t = Ql(e);
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
function Nm(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : wa({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function Im(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function ko(e, t) {
  const n = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (n !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function Di(e, t) {
  const n = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(n != null && n.includes(String(t || "").toLowerCase()));
}
function Cm(e, t) {
  if (!e || !t) return !1;
  const n = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = Di(e.code, t.key), a = Di(t.code, e.key);
  if (!n && !o && !i && !a) return !1;
  const s = i ? t.key : e.key, l = i ? e.code : a ? t.code : o ? e.code : e.code || t.code;
  for (const d of [!1, !0])
    for (const c of [!1, !0])
      for (const u of [!1, !0])
        for (const m of [!1, !0]) {
          const p = {
            key: s,
            code: l,
            ctrlKey: d,
            metaKey: c,
            altKey: u,
            shiftKey: m
          };
          if (ko(p, e) && ko(p, t)) return !0;
        }
  return !1;
}
function Bn(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function $m(e, t) {
  return [!1, !0].some((n) => Bn(e, n) && Bn(t, n));
}
function Zl(e, t = !1, n = {}) {
  return Xl(n).find((o) => Bn(o, t) && o.bindings.some((i) => ko(e, i))) || null;
}
function Na(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function ed(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Na).join(" / ") : "Unassigned";
}
function Tm(e, t) {
  const n = String(t || "").trim().toLowerCase();
  return n ? e.filter((o) => [o.description, o.category, ed(o)].some((i) => String(i || "").toLowerCase().includes(n))) : e;
}
function Rm(e) {
  return e === "review" ? "review" : "editor";
}
function mt(e, { itemId: t = null, nativeSegmentId: n = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return n == null ? null : (e || []).find((o) => o.nativeSegmentId === n) || null;
}
function Oi(e, t) {
  return (e || []).length > 0 && e.every((n) => n.reviewState === t) ? "unreviewed" : t;
}
function td(e, t, n) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (n == null ? void 0 : n.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function nd(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const n = e.identities.map((i) => mt(t, i)).filter(Boolean);
  return n.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: n,
    selectedSegment: mt(t, e.activeIdentity) || n[0]
  };
}
function rd(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function Em(e, t) {
  return (e || []).filter((n) => !n.identities.some((o) => (t || []).some((i) => rd(o, i))));
}
function Pi(e, t) {
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
function od(e, t, n, o) {
  const i = n ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function id(e, t, n = null) {
  const o = Number(n);
  if (n != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function ad(e, t, n) {
  return e != null && (n == null || t !== n);
}
function sd(e, t, n, o = null) {
  if (n === t.tagId) return null;
  const i = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: n,
    tagName: o || ((i == null ? void 0 : i.tagId) === n ? i.tagName : null)
  };
}
function ld({ tagEditing: e, selectedSegmentIds: t, activeSegmentId: n }, o) {
  return !(e && n === o && (t == null ? void 0 : t.length) === 1 && t[0] === o);
}
function wo(e, t) {
  return e === t;
}
function dd(e, t, n) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (n || []).find((i) => i.itemId === o.itemId) || null;
}
function cd(e, t, n) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return n < 0 ? o.filter((i) => i.startSec < t - mr).at(-1) || null : o.find((i) => i.startSec > t + mr) || null;
}
function fo(e) {
  return [...e || []].sort((t, n) => t.startSec - n.startSec || t.id - n.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function Li(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: At.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function Mm(e, t = null, n = !1) {
  const o = Li(n ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function Pn(e, t, n, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(n, i)) : t;
}
function Ia(e) {
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
    return { ...Po };
  }
}
function ud(e, t = 30) {
  const n = Number(t);
  return Number(e) / (Number.isFinite(n) && n > 0 ? n : 30);
}
function Ca() {
  try {
    return Ia(window.localStorage.getItem(ma));
  } catch {
    return { ...Po };
  }
}
function ji(e) {
  const t = Ia(JSON.stringify(e));
  try {
    window.localStorage.setItem(ma, JSON.stringify(t));
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
function No(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function $a(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, n = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && n && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? No(e.requestedMode) : "basic",
    effectiveMode: i ? No(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function Un(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function md(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function gd(e) {
  const t = [];
  return Un(e, Zt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), Un(e, Zt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function fd(e) {
  return [
    ["general", "General", Zt.settingsGeneral],
    ["shortcuts", "Shortcuts", Zt.settingsShortcuts],
    ["performer-slots", "Performer slots", Zt.settingsPerformerSlots],
    ["derivation", "Derivation", Zt.settingsDerivation]
  ].filter(([, , n]) => Un(e, n)).map(([n, o]) => [n, o]);
}
function pd(e, t) {
  return e === "segments" && !Un(
    t,
    Zt.navigationSegmentInventory
  ) || e === "bin" && !Un(
    t,
    Zt.recyclingBinView
  ) ? "videos" : e;
}
function yd(e) {
  const t = Number(e), n = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (n === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = n === 1;
  return `You have ${n} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function bd(e, t = 0) {
  const n = Number(e), o = Number.isFinite(n) && n >= 0 ? Math.trunc(n) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const po = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, Fi = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: At.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
], Kt = "slottedPerformerCriterion", yr = "slotCriterion", Fn = "*", Ta = "unassignedSlotCriterion", hn = "_filterExpression";
function hd(e, t = {}, n = []) {
  const o = n.filter((a) => a.type !== "related"), i = new Map((e || []).filter((a) => a.key !== Fn).map((a) => [a.key, a.label]));
  for (const a of vd(t)) a !== Fn && !i.has(a) && i.set(a, a);
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
      { id: "unassignedSlot", label: "Unassigned Slot", type: "bool", filterKey: Ta }
    ],
    relatedResultLabel: "segments"
  };
}
function vd(e) {
  const t = [], n = (o) => {
    var a, s, l;
    if (!o || typeof o != "object") return;
    const i = (s = (a = o[Kt]) == null ? void 0 : a[yr]) == null ? void 0 : s.value;
    typeof i == "string" && t.push(i);
    for (const d of ((l = o[hn]) == null ? void 0 : l.children) || o.children || []) n(d.filter || d.group);
  };
  return n(e), t;
}
function xd(e, t) {
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
  const a = wd(e.slots), s = new Map((t || []).flatMap((d) => (d.slotDefinitionIds || []).map((c) => [String(c), d.key]))), l = Object.entries(a.values).map(([d, c]) => xd(s.get(String(d)) ?? Fn, [Number(c)]));
  if (n.length && l.push({ [yr]: { modifier: "EQUALS", value: Fn }, performerIdsCriterion: { modifier: "INCLUDES", value: n } }), l.length === 1 && i[Kt] === void 0) i[Kt] = l[0];
  else if (l.length) {
    const d = l.slice(0, Object.keys(a.values).length).map((m) => ({ filter: { [Kt]: m } })), c = d.length > 1 ? [{ group: { operator: "AND", relatedScope: { filterKey: Kt, matchMode: "distinct" }, children: d } }] : d;
    n.length && c.push({ filter: { [Kt]: l.at(-1) } });
    const u = [...i[hn] ? [{ group: i[hn] }] : [], ...c];
    i[hn] = u.length === 1 && u[0].group ? u[0].group : { operator: "AND", children: u };
  }
  return a.activityTagId && i.activitiesCriterion === void 0 && i.activityId === void 0 && (i.activitiesCriterion = { modifier: "INCLUDES", value: [a.activityTagId] }), i;
}
function kd(e) {
  const t = String(e || "").split(",").filter((n) => At.includes(n));
  return t.length === 0 ? [...At] : [...new Set(t)];
}
function wd(e) {
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
function Io(e) {
  return Array.isArray(e) ? e.map(Io) : !e || typeof e != "object" ? e : Object.fromEntries(Object.entries(e).filter(([t]) => !t.startsWith("_")).map(([t, n]) => [
    t,
    t === "modifier" && typeof n == "string" && /^[A-Z_]+$/.test(n) ? n.toLowerCase().replace(/_([a-z])/g, (o, i) => i.toUpperCase()) : Io(n)
  ]));
}
function Nd(e) {
  var l, d;
  if (!e || typeof e != "object") return null;
  const { [Ta]: t, [yr]: n, ...o } = e, i = typeof (n == null ? void 0 : n.value) == "string" && n.value ? n.value : Fn, a = typeof (t == null ? void 0 : t.value) == "boolean" ? t.value : null, s = o._matchAll === !0 || !!((d = (l = o.findFilter) == null ? void 0 : l.q) != null && d.trim()) || Object.keys(o.objectFilter || {}).length > 0 || o.performerIdsCriterion !== void 0 || o.ageAtHostDateCriterion !== void 0 || o.performerOccurrenceTagsCriterion !== void 0;
  return !s && a === null && !n ? null : { role: i, performers: s || a === null ? Io(o) : null, unassigned: a };
}
function Ra(e, { legacyStates: t = !1 } = {}) {
  var o, i;
  const n = At.includes((o = e.reviewStateCriterion) == null ? void 0 : o.value) ? [e.reviewStateCriterion.value] : t && e.states ? kd(e.states) : [];
  return {
    activityTagIds: Aa(e.activitiesCriterion, e.activityId),
    includeActivitySubtags: ((i = e.activitiesCriterion) == null ? void 0 : i.depth) === -1,
    reviewStates: n,
    slottedPerformer: Nd(e[Kt])
  };
}
function Ea(e) {
  if (!e || typeof e != "object" || !Array.isArray(e.children)) return null;
  const t = e.children.flatMap((n) => {
    if (n != null && n.group) {
      const o = Ea(n.group);
      return o ? [{ group: o }] : [];
    }
    return n != null && n.filter && typeof n.filter == "object" ? [{ filter: Ra(n.filter) }] : [];
  });
  return t.length ? e._semanticNone ? { operator: "NOT", children: t.length === 1 ? t : [{ group: { operator: "OR", children: t } }] } : {
    operator: ["OR", "NOT", "JUST_ONE"].includes(e.operator) ? e.operator : "AND",
    ...e.relatedScope ? { relatedScope: e.relatedScope } : {},
    ...e.distinctRelatedMatches === !0 ? { distinctRelatedMatches: !0 } : {},
    children: t
  } : null;
}
function Id(e, t) {
  const n = Ea(t[hn]);
  return {
    query: String(e.q || "").trim() || null,
    ...Ra(t, { legacyStates: !0 }),
    ...n ? { filterExpression: n } : {},
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc"
  };
}
function Cd(e) {
  const { [Kt]: t, [hn]: n, ...o } = e, i = Ma(n);
  return i ? { ...o, [hn]: i } : o;
}
function Ma(e) {
  if (!e || typeof e != "object" || !Array.isArray(e.children)) return null;
  const t = e.children.flatMap((i) => {
    if (i != null && i.group) {
      const l = Ma(i.group);
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
function Da(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function $d(e) {
  var i;
  const t = Number(e.startSec) || 0, n = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(n)) return Math.max(t, n);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Td(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Gi(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Rd(e, t, n) {
  if (typeof n != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (n(o.startSec, !1), !0) : !1;
}
function yt(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function Fo(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function yo(e, t) {
  const n = new Set(Fo(t).map((o) => String(yt(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && n.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function an(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function Bi(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(an).sort().join(",")}`;
}
function Oa(e, t, n = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((b) => String(b.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(n)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((b) => {
    var f;
    return !((f = b.genderHints) != null && f.length);
  }) && e.length === t.length && !i) {
    const b = [...e].sort((y, S) => String(y.slotDefinitionId).localeCompare(String(S.slotDefinitionId))), f = [...t].sort((y, S) => String(y.name).localeCompare(String(S.name)) || Number(yt(y)) - Number(yt(S)));
    return [{
      assignments: Object.fromEntries(b.map((y, S) => [String(y.slotDefinitionId), String(yt(f[S]))])),
      description: f.map((y) => y.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((b) => t.map((f, y) => ({ performer: f, index: y })).filter(({ performer: f }) => {
    var y;
    return !((y = b.genderHints) != null && y.length) || b.genderHints.some((S) => an(S) === an(f.gender || f.genderIdentity));
  }).map(({ index: f }) => f)), u = i ? c.filter((b) => b.length > 0).length : Ui(c, t.length);
  if (u === 0) return [];
  const m = new Map(t.map((b, f) => [String(yt(b)), f]));
  function p(b, f, y) {
    if (s.length >= a) return;
    const S = c.slice(b), I = i ? S.filter((Q) => Q.length > 0).length : Ui(S.map((Q) => Q.filter((E) => !f.has(String(yt(t[E]))))), t.length);
    if (y + I < u) return;
    if (b === e.length) {
      if (y !== u) return;
      const Q = Object.fromEntries(d.map(({ slot: j, performer: $ }) => [String(j.slotDefinitionId), $ ? String(yt($)) : ""])), E = o.length === 0 ? Object.values(Q).sort().join(",") : [...new Set(e.map((j) => String(j.label || "")))].map((j) => `${j}:${d.filter(({ slot: $ }) => String($.label || "") === j).map(({ performer: $ }) => $ ? String(yt($)) : "").sort().join(",")}`).join("|");
      !l.has(E) && s.length < a && (l.add(E), s.push({
        assignments: Q,
        description: d.map(({ slot: j, performer: $ }) => o.length ? `${j.label}: ${($ == null ? void 0 : $.name) || "Unassigned"}` : ($ == null ? void 0 : $.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const g = e[b], O = [...d].reverse().find(({ slot: Q }) => Bi(Q) === Bi(g)), V = O ? m.get(String(yt(O.performer))) : -1;
    for (const Q of c[b]) {
      const E = t[Q], j = yt(E);
      if (!(Q < V) && !(j == null || !i && f.has(String(j))) && (d.push({ slot: g, performer: E }), i || f.add(String(j)), p(b + 1, f, y + 1), i || f.delete(String(j)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: g, performer: null }), p(b + 1, f, y), d.pop();
  }
  return p(0, /* @__PURE__ */ new Set(), 0), s;
}
function Ui(e, t) {
  const n = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), n[s] === -1 || o(n[s], a)))
        return n[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Ed(e, t) {
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
      const m = [...new Set(e.map((p) => p.label || ""))].map((p) => `${p}:${a.filter((b) => (b.slot.label || "") === p).map((b) => b.performer.performerId).sort((b, f) => b - f).join(",")}`).join("|");
      i.has(m) || i.set(m, [...a]);
      return;
    }
    const c = e[l];
    for (const m of t)
      !o && d.has(m.performerId) || (u = c.genderHints) != null && u.length && !c.genderHints.some((p) => an(p) === an(m.gender)) || (a.push({ slot: c, performer: m }), o || d.add(m.performerId), s(l + 1, d), o || d.delete(m.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Md(e) {
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
function Dd(e) {
  return (e || []).flatMap((t) => t.markers.map((n) => ({
    segment: n.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function Od(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function Pa(e, t, n) {
  const o = yt, i = new Set((t || []).map(o)), a = new Set((n || []).map(an));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), u = d.isVideoPerformer ?? i.has(o(d));
    if (c !== u) return u - c;
    const m = an(l.gender || l.genderIdentity), p = an(d.gender || d.genderIdentity), b = l.matchesGenderHint ?? a.has(m);
    return (d.matchesGenderHint ?? a.has(p)) - b || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
function La() {
  return null;
}
function Pd(e) {
  return typeof e == "function" || typeof e == "object" && e !== null && "$$typeof" in e;
}
function ja(e, t) {
  const n = e[t];
  return Pd(n) ? n : La;
}
const Ld = ja(cr, "ExtensionEntityActions"), Fa = ja(cr, "ExtensionSelectionActions"), yn = Fa !== La, { useEffect: be, useId: Ga, useLayoutEffect: Ki, useMemo: qe, useReducer: jd, useRef: fe, useState: K, useSyncExternalStore: Fd } = Ao, r = Ao.createElement, Gd = cr.PERFORMER_CRITERIA ?? [], Bd = typeof cr.useDocumentTitle == "function" ? cr.useDocumentTitle : () => {
}, Ba = "/api/plugins/segment-studio";
function Je(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(xn) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const n = Co();
    return t[e] = n, window.localStorage.setItem(xn, JSON.stringify(t)), n;
  } catch {
    return Co();
  }
}
function Ye(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(xn) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(xn, JSON.stringify(t));
  } catch {
  }
}
function Go(e) {
  try {
    return JSON.parse(window.localStorage.getItem(xn) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function Bo(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(xn) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(xn, JSON.stringify(t));
  } catch {
  }
}
function Ud(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function Kd(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((n, o) => {
    const i = setTimeout(n, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function oe(e, t, n = 0) {
  var d;
  const o = await Do(`${Ba}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Ud(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && n < 2)
    return await Kd(250 * (n + 1), t == null ? void 0 : t.signal), oe(e, t, n + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function zd(e, t) {
  const n = await Do(e, t);
  if (!n.ok) {
    const o = await n.json().catch(() => null);
    throw new Error((o == null ? void 0 : o.error) || (o == null ? void 0 : o.detail) || (o == null ? void 0 : o.title) || "Unable to load Cove data.");
  }
  return n.json();
}
async function _d(e, t) {
  const n = String(e).startsWith("/api/") ? e : `${Ba}${e}`, o = await Do(n, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: Hd(
      o.headers.get("Content-Disposition")
    )
  };
}
function Hd(e, t = "segment-studio-ai-feedback.zip") {
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
function Ge(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", n = Math.abs(e), o = Math.floor(n), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((n - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function Co() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function Ua(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function qd(e) {
  const t = Number(e.selectedSegmentCount) || 0, n = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + n, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = n > 0 ? ` and ${n} dependent derived segment${n === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function Ka(e, t) {
  const n = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : n.length;
  return { sceneCount: new Set(n.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function Wd(e, t) {
  const { sceneCount: n, segmentCount: o } = Ka(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${n} scene${n === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function za(e, t) {
  const n = (e == null ? void 0 : e.items) || [], o = Ka(n, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(Wd(n, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await oe("/bin/empty", {
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
function zi({ children: e }) {
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
function Am(e, t) {
  return {
    ...(_t[e] || _t.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function _a(e) {
  return { ...(_t[e] || _t.unreviewed).badge };
}
function Ha(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const qa = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function Vd(e, t, n = "not-applicable", o = !1) {
  const i = _t[e] || _t.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (n === "empty" || n === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Jd(e, t = !1) {
  const n = "rgb(20, 184, 166)";
  return {
    borderColor: n,
    backgroundColor: n,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Yd(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function Qd(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function Uo(e) {
  const t = typeof e == "string" ? e.trim() : "";
  return /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t) ? t.slice(0, 7).toLowerCase() : null;
}
function Xd(e) {
  return (e == null ? void 0 : e.id) == null ? "var(--color-border)" : Uo(e.color) || "var(--color-accent)";
}
function Zd(e, t, n = null) {
  const o = Uo(n);
  return e ? {
    backgroundColor: t,
    boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
  } : o ? { backgroundColor: t, boxShadow: `inset 3px 0 0 color-mix(in srgb, ${o} 55%, transparent)` } : { backgroundColor: t };
}
function Qr(e = !1, t = null) {
  return `color-mix(in srgb, ${Uo(t) || "var(--color-accent)"} ${e ? 14 : 8}%, var(--color-surface))`;
}
function ec(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function Sn({ state: e, includeLabel: t = !0 }) {
  const n = _t[e] || _t.unreviewed;
  return r("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: _a(e)
  }, t ? `${n.symbol} ${e}` : n.symbol);
}
function tc(e, t = null) {
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
function Dm(e, t) {
  var a, s, l;
  if (!t) return !1;
  const n = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (n == null ? void 0 : n.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return n === t || ((s = t.contains) == null ? void 0 : s.call(t, n)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || n === (o == null ? void 0 : o.body) && i === o.body;
}
function nc(e, t = document) {
  return !(e.defaultPrevented || tc(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function Om(e, t = document, n = !1, o = {}) {
  return nc(e, t) ? Zl(e, n, o) != null : !1;
}
function rc(e, t, n = null) {
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
function oc(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const n = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !n || n.value.trim() !== String(t || "").trim() || (s = n.getAttribute) != null && s.call(n, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function ic({ confirm: e, cancel: t, confirmReady: n }) {
  const o = n && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function Ko({ confirmRef: e, cancelRef: t, confirmReady: n }) {
  be(() => {
    const o = requestAnimationFrame(() => ic({
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
function _i(e, t) {
  const n = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < n ? i.filter((a) => a.sequence > o && a.sequence <= n).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > n && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function zo(e, t = !0) {
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
    identity: zo(e, t),
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
      identity: zo(n, t),
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
      originalIdentity: zo(n),
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
function Wa(e, t) {
  return (e || []).filter((n) => n.segmentId === t).sort((n, o) => n.sortOrder - o.sortOrder || String(n.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function Va(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e || []) {
    const o = t.get(n.segmentId);
    o ? o.push(n) : t.set(n.segmentId, [n]);
  }
  for (const n of t.values())
    n.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function _o(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((n) => Number(n.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function ac(e, t) {
  const n = (t || []).map((i) => Wa(e, i.id));
  if (n.length === 0 || n.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: Lt(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return n.every((i) => o(i) === o(n[0])) ? n : null;
}
function sc(e, t) {
  return new Set((t || []).map((n) => n.tagId)).size !== 1 ? null : ac(e, t);
}
function lc({ mergeable: e, reviewable: t, tagEditable: n = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    n ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function Pm(e, t) {
  return _o(Wa(e, t));
}
function Lt(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function dc(e, t) {
  const n = (d) => Lt(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
    const c = /* @__PURE__ */ new Map();
    for (const u of d || []) {
      const m = n(u);
      c.has(m) || c.set(m, []), c.get(m).push(u);
    }
    return c;
  }, a = i(e), s = i(t), l = [];
  for (const [d, c] of a) {
    const u = s.get(d);
    if (!u || c.length !== u.length)
      continue;
    const m = [...c].sort(o), p = [...u].sort(o);
    m.forEach((b, f) => l.push({
      sourceSlotDefinitionId: b.id,
      derivedSlotDefinitionId: p[f].id
    }));
  }
  return l;
}
function cc(e, t, n) {
  if (!e || (e.slotMappings || []).length > 0)
    return e;
  const o = dc(t, n);
  return o.length === 0 ? e : { ...e, slotMappings: o };
}
function Pr(e, t, n, o) {
  var s;
  const i = (s = t == null ? void 0 : t[n]) == null ? void 0 : s[o], a = new Set((t || []).filter((l, d) => d !== n).map((l) => l[o]).filter(Boolean));
  return (e || []).filter((l) => l.id === i || !a.has(l.id));
}
function uc(e) {
  const t = Lt(e), n = Number(e == null ? void 0 : e.performerId), o = n > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${n}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(Xr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function Xr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function qr(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const n of e)
    Object.hasOwn(t, n.reviewState) && (t[n.reviewState] += 1);
  return t;
}
function Hi(e) {
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
function mc(e) {
  const t = e.map(Lt), n = /* @__PURE__ */ new Map();
  for (const i of t) n.set(i, (n.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), n.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function gc(e, t) {
  const n = e.segments.map((l) => {
    const d = t.get(l.id) || [], u = d.length > 0 && d.every((m) => Number(m.performerId) > 0) ? d.map((m) => `${m.slotDefinitionId}:${Number(m.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: u };
  }), o = [...new Set(n.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [Hi({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = mc(l.slots), u = l.slots.filter((y) => !a.has(String(y.slotDefinitionId))), m = o.length === 1 ? l.slots : u, p = m.map((y) => `${c.get(String(y.slotDefinitionId))} · ${y.performerName || `Performer ${y.performerId}`}`).join(" · "), b = [...new Map(m.map((y) => [
          Number(y.performerId),
          { id: Number(y.performerId), name: y.performerName || `Performer ${y.performerId}` }
        ])).values()], f = l.slots.map((y) => ({
          slotDefinitionId: String(y.slotDefinitionId),
          label: c.get(String(y.slotDefinitionId)),
          performer: {
            id: Number(y.performerId),
            name: y.performerName || `Performer ${y.performerId}`
          }
        }));
        s.set(d, {
          ...e,
          key: `${e.key}:performers:${d}`,
          performerLabel: p,
          performers: b,
          performerAssignments: f,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(Hi);
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => gc(s, a));
}
function Ho(e) {
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
    for (const s of At)
      a.counts[s] += Number((n = o.counts) == null ? void 0 : n[s]) || 0;
  }
  return t;
}
function Ja(e) {
  return (e || []).some((t) => t.id != null);
}
const fc = {
  group: 38,
  lane: 33,
  segment: 41
};
function pc(e, t = []) {
  const n = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = fc[s.kind];
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
function Ya(e, t, n, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(n)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function yc(e, t = [], n = !0) {
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
function bc(e, t) {
  const n = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => n.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: qr(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return Ho(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: qr(a)
    };
  });
}
function Qa(e, { nativeOnly: t = !1 } = {}) {
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
function qi(e, t) {
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
function hc(e) {
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
    }, o ? hc(e.name) : "—"),
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
function Xa({ assignments: e, className: t = "" }) {
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
function Zr({ performers: e, performerAssignments: t, interactive: n = !0 }) {
  const o = fe(null), i = `performer-slots-${Ga()}`, [a, s] = K(null);
  function l() {
    var b;
    const c = (b = o.current) == null ? void 0 : b.getBoundingClientRect();
    if (!c) return;
    const u = Math.max(0, Math.min(256, window.innerWidth - 16)), m = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), p = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - u - 8, c.right - u)),
      top: p >= m + 8 ? c.bottom + 4 : Math.max(8, c.top - m - 4),
      width: u
    });
  }
  be(() => {
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
    a ? sl(r("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, r(Xa, {
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
function vc(e, t) {
  const n = new Set(dn(t));
  return (e || []).filter((o) => !n.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function Za(e, t) {
  return t ? dn(e).filter((n) => n !== t) : dn(e);
}
function xc(e, t) {
  const n = dn(t), o = new Set(dn(e));
  return n.length > 0 && n.every((i) => o.has(i)) ? [] : n;
}
function zt(e, t) {
  const n = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return n ? n.segmentGroupId == null ? "ungrouped" : `group:${n.segmentGroupId}` : null;
}
function Wi(e, t, n) {
  const o = Number(n);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), u = Number.isFinite(c) && c >= d ? c : d, m = d <= o && u >= o, p = m ? 0 : Math.min(Math.abs(o - d), Math.abs(o - u));
    return { contains: m, distance: p, duration: u - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function $o(e, t, n, o = null) {
  var u, m, p, b, f, y;
  const i = e.findIndex((S) => S.markers.some((I) => I.segment.id === t));
  if (i < 0) {
    const S = [...((u = e[0]) == null ? void 0 : u.markers) || []];
    return o != null && Number.isFinite(Number(o)) && S.sort((I, g) => Wi(I, g, o)), ((m = S[0]) == null ? void 0 : m.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((S) => S.segment.id === t);
  if (n === "left" || n === "right") {
    const S = n === "left" ? -1 : 1, I = Math.min(a.markers.length - 1, Math.max(0, s + S));
    return ((p = a.markers[I]) == null ? void 0 : p.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (n === "up" ? -1 : 1))), d = Number((b = a.markers[s]) == null ? void 0 : b.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((f = a.markers[s]) == null ? void 0 : f.segment) ?? null : ((y = [...e[l].markers].sort(c ? (S, I) => Wi(S, I, Number(o)) : (S, I) => Math.abs(S.segment.startSec - d) - Math.abs(I.segment.startSec - d) || S.segment.startSec - I.segment.startSec || S.segment.id - I.segment.id)[0]) == null ? void 0 : y.segment) ?? null;
}
function Sc(e, t, n) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = $o([o], t, n);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function kc(e, t, n) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + n))];
}
function wc(e, t, n) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(n) ? n : e[0];
}
function Nc(e, t) {
  const n = Number(e);
  if (!Number.isFinite(n)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= n) return [Yi(n)];
  const i = o - n, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(n, o - 1e-3);
  return [...new Set(a.map((l) => Yi(Math.min(s, n + l))))];
}
function Ic(e, t) {
  const n = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: n.length > 0 && n.every(i) ? "remove" : "collect",
    segments: n
  };
}
function Cc(e, t) {
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
  a.sort((u, m) => Number(u.startSec) - Number(m.startSec) || String(u.key || "").localeCompare(String(m.key || "")));
  const l = t.performerSlots != null ? new Set(i.keys()) : /* @__PURE__ */ new Set(), d = (e.performerSlots || []).filter((u) => !n.has(u.segmentId) || o.has(u.segmentId)).map((u) => o.has(u.segmentId) ? { ...u, segmentId: o.get(u.segmentId) } : u).filter((u) => !l.has(u.segmentId));
  t.performerSlots != null && d.push(...t.performerSlots);
  const c = {};
  for (const [u, m] of Object.entries(
    e.performerSlotRevisions || {}
  )) {
    const p = Number(u);
    if (n.has(p) && !o.has(p)) continue;
    const b = o.get(p) ?? p;
    l.has(b) || (c[b] = m);
  }
  return t.performerSlotRevisions != null && Object.assign(c, t.performerSlotRevisions), {
    ...e,
    approvedSetVersion: t.approvedSetVersion || e.approvedSetVersion,
    segments: a,
    performerSlots: d,
    performerSlotRevisions: c
  };
}
function Vi(e, t, n) {
  const o = Array.isArray(e) ? e : [];
  if (!n) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function $c(e) {
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
async function Tc(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const n = document.createElement("video");
  n.preload = "auto", n.muted = !0, n.playsInline = !0, n.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(n);
  try {
    if (n.src = `/api/stream/video/${encodeURIComponent(e)}`, await Ji(n, "loadeddata"), !n.videoWidth || !n.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = n.videoWidth, o.height = n.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], u = Nc(
        d.startSec,
        d.endSec
      );
      for (const [m, p] of u.entries()) {
        Math.abs(n.currentTime - p) > 5e-4 && (n.currentTime = p, await Ji(n, "seeked")), i.drawImage(n, 0, 0, o.width, o.height);
        const b = await Rc(o), f = `example-${l + 1}-frame-${m + 1}`;
        c.push({ fieldName: f, timestampSec: p }), s.push({
          fieldName: f,
          file: new File(
            [b],
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
function Ji(e, t) {
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
function Rc(e) {
  return new Promise((t, n) => {
    e.toBlob(
      (o) => o ? t(o) : n(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function Yi(e) {
  return Math.round(e * 1e3) / 1e3;
}
function Lm(e, t, n) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...n } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Ec(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((n, o) => n.startSec - o.startSec || n.id - o.id)
  };
}
function jm(e, t) {
  const n = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !n.has(o.id))
  };
}
function Fm(e, t, n) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? n.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Gm(e, t) {
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
function bo(e, t) {
  const n = e.performerSlots || [], o = e.performerSlotRevisions || {};
  if (!n.some((s) => s.segmentId === t) && !(t in o)) return e;
  const { [t]: i, ...a } = o;
  return {
    ...e,
    performerSlots: n.filter((s) => s.segmentId !== t),
    performerSlotRevisions: a
  };
}
function Mc(e, t) {
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
function eo(e, t) {
  return (e || []).some((n) => (t || []).some((o) => Kn(n, o)));
}
function pt(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function es(e, t) {
  return (e || []).find((n) => Kn(t, n)) || null;
}
function ts(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Ac(e, t) {
  var n;
  return ((n = e.running) == null ? void 0 : n.kind) === t;
}
function Bm(e) {
  return e.running != null || e.queued.length > 0;
}
const Dc = /* @__PURE__ */ new Set(["segment", "split", "create", "duplicate", "review", "held-tag"]);
function qo(e) {
  return e.running ? [e.running, ...e.queued] : e.queued;
}
function To(e) {
  return qo(e).some((t) => t.kind === "create" || t.kind === "duplicate");
}
function jn(e) {
  return qo(e).some((t) => !Dc.has(t.kind));
}
function Ur(e) {
  return e != null && e.itemId == null && e.nativeSegmentId == null && e.id < 0;
}
function Oc(e, t) {
  if (jn(e) || (t || []).some(Ur)) return !0;
  const n = (t || []).map(pt);
  return qo(e).some((o) => eo(o.targets, n));
}
const Qi = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
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
function Pc({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let n = 1, o = null, i = [], a = null, s = !1, l = 0, d = 0;
  const c = () => !t && d < l, u = /* @__PURE__ */ new Map();
  let m = Qi;
  const p = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Set();
  let f = [];
  function y() {
    m = o == null && i.length === 0 && a == null ? Qi : Object.freeze({
      running: o ? Lr(o) : null,
      queued: Object.freeze(i.map(Lr)),
      lastFailure: a
    });
    for (const k of [...b]) k();
    if (o == null && i.length === 0) {
      const k = f;
      f = [];
      for (const D of k) D();
    }
  }
  function S(k, D) {
    p.set(k.id, D.status), k.resolve(D);
  }
  function I(k) {
    if (k.dependsOn == null) return "met";
    const D = p.get(k.dependsOn);
    return D === "fulfilled" ? "met" : D != null ? "failed" : "pending";
  }
  function g(k) {
    o = k;
    const D = { ...e(), taskId: k.id, targets: k.targets };
    D.resolveTargets = () => k.targets.map((U) => es(D.segments, U)).filter(Boolean), y();
    let F;
    try {
      F = k.run(D);
    } catch (U) {
      F = Promise.reject(U);
    }
    Promise.resolve(F).then(
      (U) => O(k, { status: "fulfilled", value: U }),
      (U) => O(k, { status: "rejected", error: U })
    );
  }
  function O(k, D) {
    k.settled || (k.settled = !0, S(k, D), !s && (o = null, D.status === "rejected" && (a = Object.freeze({ id: k.id, kind: k.kind, error: D.error })), y(), l += 1, t && V()));
  }
  function V() {
    if (s || o != null || c()) return;
    let k = !1;
    for (let D = 0; D < i.length; D += 1) {
      const F = i[D], U = I(F);
      if (U === "failed") {
        i = i.filter((T) => T !== F), S(F, { status: "dropped", reason: "dependency-failed" }), k = !0, D -= 1;
        continue;
      }
      if (U !== "pending" && !(F.exclusive && D > 0) && !i.slice(0, D).some((T) => eo(T.targets, F.targets)) && !(F.ready && !F.ready(e(), Lr(F)))) {
        i = i.filter((T) => T !== F), g(F);
        return;
      }
    }
    k && y();
  }
  function Q(k) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((_) => _.exclusive) || o != null && k.whenBusy !== "enqueue" || k.exclusive && (o != null || i.length > 0 || c())) return null;
    let F;
    const U = new Promise((_) => {
      F = _;
    }), T = {
      id: n++,
      kind: k.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: k.lockId ?? -1,
      targets: Object.freeze((k.targets || []).map(j)),
      exclusive: k.exclusive === !0,
      dependsOn: k.dependsOn ?? null,
      ready: k.ready || null,
      meta: k.meta ?? null,
      run: k.run,
      resolve: F
    };
    return i = [...i, T], y(), V(), { id: T.id, done: U };
  }
  function E(k = {}) {
    let D = null;
    const F = Q({
      ...k,
      whenBusy: "reject",
      run: () => new Promise((T) => {
        D = T;
      })
    });
    if (!F) return null;
    if (D == null)
      return x((T) => T.id === F.id), null;
    let U = !1;
    return () => {
      U || (U = !0, D(), (o == null ? void 0 : o.id) === F.id && O(o, { status: "fulfilled", value: void 0 }));
    };
  }
  function j(k) {
    return (k == null ? void 0 : k.id) == null || k.itemId != null || k.nativeSegmentId != null ? k : u.get(k.id) || k;
  }
  function $(k, D) {
    u.set(k, { ...D });
    let F = !1;
    for (const U of i)
      U.targets.some((T) => T.id === k && T.itemId == null && T.nativeSegmentId == null) && (U.targets = Object.freeze(U.targets.map((T) => T.id === k ? { ...D } : T)), F = !0);
    return F && y(), F;
  }
  function x(k) {
    const D = i.filter((F) => k(Lr(F)));
    if (D.length === 0) return 0;
    i = i.filter((F) => !D.includes(F));
    for (const F of D) S(F, { status: "cancelled" });
    return y(), V(), D.length;
  }
  return {
    enqueue: Q,
    acquire: E,
    cancel: x,
    retarget: $,
    stableIdentity: j,
    // The host reads `settledCount()` while rendering and reports it here once that render commits.
    settledCount: () => l,
    markCommitted(k = l) {
      d = Math.max(d, k);
    },
    poke: () => V(),
    subscribe(k) {
      return b.add(k), () => b.delete(k);
    },
    getSnapshot: () => m,
    whenIdle() {
      return o == null && i.length === 0 ? Promise.resolve() : new Promise((k) => f.push(k));
    },
    dispose() {
      if (s) return;
      const k = i;
      i = [], s = !0;
      for (const F of k) S(F, { status: "cancelled" });
      b.clear();
      const D = f;
      f = [];
      for (const F of D) F();
    }
  };
}
let Lc = 1;
function Mt() {
  return `pending-${Lc++}`;
}
function jc(e) {
  return e.sort((t, n) => t.startSec - n.startSec || t.id - n.id);
}
function Kr(e, t) {
  return (t || []).some((n) => Kn(n, e));
}
function Fc(e, t) {
  return [...e || [], {
    id: t.id ?? Mt(),
    taskId: t.taskId ?? null,
    op: t.op,
    targets: t.targets || (t.segment ? [{ id: t.segment.id }] : []),
    values: t.values || null,
    segment: t.segment || null,
    meta: t.meta || null,
    settled: !1
  }];
}
function ns(e, t) {
  return t && (e || []).find((n) => {
    var o;
    return ((o = n.meta) == null ? void 0 : o.kind) === "held-tag" && !n.settled && Kr(t, n.targets);
  }) || null;
}
function Gc(e) {
  return (e || []).filter((t) => t.op === "insert" && !t.settled).map((t) => t.segment);
}
function rs(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function os(e, t) {
  const n = (e || []).filter((o) => !rs(o, t));
  return n.length === (e || []).length ? e : n;
}
function is(e, t) {
  let n = !1;
  const o = (e || []).map((i) => i.settled || !rs(i, t) ? i : (n = !0, { ...i, settled: !0, settledDetail: null }));
  return n ? o : e;
}
function Bc(e, t, n) {
  let o = !1;
  const i = (e || []).map((a) => a.targets.some((s) => s.id === t && s.itemId == null && s.nativeSegmentId == null) ? (o = !0, {
    ...a,
    targets: a.targets.map((s) => s.id === t ? { ...n } : s)
  }) : a);
  return o ? i : e;
}
function Wo(e, t) {
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
  return jc(n);
}
function as(e, t) {
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
function Uc(e, t, n) {
  return n ? os(e, t) : is(e, t);
}
function Kc(e, t) {
  switch (t.type) {
    case "confirm":
      return Uc(e, t.key, t.applied);
    case "add":
      return Fc(e, t.entry);
    case "discard":
      return os(e, t.key);
    case "settle":
      return is(e, t.key);
    case "retarget":
      return Bc(e, t.temporaryId, t.identity);
    case "prune":
      return as(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
function Xi(e, t, n) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function zc(e) {
  const { acquireSaveLock: t, compatibilityMode: n, getRequestedSelectionId: o, dispatchPendingChanges: i, displayedSelectedSegment: a, enqueueSave: s, getSaveQueueSnapshot: l, pendingChanges: d, retargetSaveTasks: c, currentTime: u, detail: m, editorFilters: p, endInput: b, hideDerivedSegments: f, historyRef: y, mediaDuration: S, onConflict: I, onDetailChange: g, onReload: O, optimisticSegmentIdRef: V, pendingDuplicateRef: Q, pendingFirstSegmentStartSecRef: E, pendingTagEditSegmentIdRef: j, performerSlots: $, replaceSegmentSelection: x, savingSegmentId: k, segments: D, selectedSegment: F, selectedSegmentIdRef: U, selectedSegments: T, selectionAnchorIdRef: _, selectionRangeBaseIdsRef: Z, setCreatingSegmentId: L, setEditorFilters: X, setFirstSegmentTagOpen: le, setHideDerivedSegments: ae, setHistory: ve, setHistoryOpen: ce, setPublishApprovedError: De, setSaveMessage: W, setSelectedSegmentGroupKey: Y, setSelectedSegmentId: pe, setSelectedSegmentIds: Se, setTagEditing: we, startInput: he, tagEditingRef: H, timelineDuration: ke, video: de } = e;
  function w(v) {
    y.current = v || Xt, ve(y.current);
  }
  async function G(v, R, re, se, J = null) {
    var Fe;
    try {
      const Re = await oe(`/videos/${de.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: y.current.revision,
          kind: v,
          label: R,
          beforeState: re,
          afterState: se,
          receiptId: J
        })
      });
      return w(Re), !0;
    } catch (Re) {
      return Re.status === 409 && ((Fe = Re.payload) != null && Fe.current) && w(Re.payload.current), W("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function A(v, R, re = !0, se = null, J = !1, Fe = R, Re = !0) {
    if (!v || Ur(v) || jn(l())) return null;
    const [$e = v] = Wo([v], (d || []).filter((ot) => ot.op !== "insert")), Pe = Object.fromEntries(Object.entries(R).filter(([ot, Le]) => Le !== $e[ot])), _e = J ? Mt() : null, gt = o == null ? void 0 : o();
    _e && i({
      type: "add",
      entry: {
        id: _e,
        op: "patch",
        targets: [pt(v)],
        values: Fe === R ? Pe : Fe
      }
    });
    const Be = s({
      kind: "segment",
      lockId: v.id,
      targets: [pt(v)],
      whenBusy: "enqueue",
      // Save against the segment as it is when the task runs, so a save queued behind another
      // save of the same segment sends that save's revision.
      run: (ot) => {
        const [Le] = ot.resolveTargets();
        if (!Le)
          return _e && i({ type: "discard", key: _e }), W("The segment changed before its save could run."), null;
        const rt = Object.fromEntries(Object.keys(R).map((St) => [St, Le[St]]));
        return N(Le, { ...rt, ...Pe }, {
          recordHistory: re,
          historyLabel: se,
          pendingChangeId: _e,
          restoreSelectionOnFailure: Re,
          requestedSelectionId: gt
        });
      }
    });
    if (!Be)
      return _e && i({ type: "discard", key: _e }), null;
    const ft = await Be.done;
    return ft.status !== "fulfilled" ? (_e && i({ type: "discard", key: _e }), null) : ft.value ?? null;
  }
  async function N(v, R, {
    recordHistory: re = !0,
    historyLabel: se = null,
    optimisticValues: J = null,
    pendingChangeId: Fe = null,
    restoreSelectionOnFailure: Re = !0,
    // The selection when the edit was requested, which a queued save captures before it waits.
    requestedSelectionId: $e = o == null ? void 0 : o(),
    onReload: Pe = O,
    onConflict: _e = I
  } = {}) {
    var St;
    const gt = T.map((lt) => lt.id), Be = (F == null ? void 0 : F.id) ?? U.current, ft = re && !n ? crypto.randomUUID() : null;
    W(re ? "Saving directly to Cove…" : "Restoring history…");
    const ot = Fe ?? (J ? Mt() : null);
    J && !Fe && i({
      type: "add",
      entry: { id: ot, op: "patch", targets: [pt(v)], values: J }
    });
    const Le = (lt) => {
      ot && i({ type: "confirm", key: ot, applied: lt });
    }, rt = async (lt) => {
      if (lt) {
        g((ht) => sn(ht, lt), de.id), Le(!0);
        return;
      }
      Le(await Pe() != null);
    };
    try {
      if (n && v.nativeSegmentId == null && v.itemId != null) {
        const it = `draft-update:${de.id}:${v.itemId}:${v.revision}:${R.tagId}:${R.startSec}:${R.endSec ?? "open"}:${R.reviewState ?? v.reviewState}`, z = await oe(`/videos/${de.id}/drafts/${v.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Je(it),
            expectedRevision: v.revision,
            startSec: R.startSec,
            endSec: R.endSec,
            tagId: R.tagId,
            reviewState: R.reviewState
          })
        });
        Ye(it), z.performerSlots != null && g((me) => Gn(me, v.id, z.performerSlots, z.performerSlotRevision), de.id);
        const te = {
          ...v,
          ...z.draft,
          id: v.id,
          itemId: v.itemId
        };
        return re && await G(
          "segment.update",
          se || "Changed segment",
          Dr(v, n),
          Dr(
            te,
            n
          )
        ), Xi(v, R, n) ? await rt(z.editorDelta) : (g((me) => ({
          ...me,
          approvedSetVersion: z.approvedSetVersion || me.approvedSetVersion,
          segments: (me.segments || []).map((ye) => ye.id === v.id ? te : ye).sort((ye, ge) => ye.startSec - ge.startSec || ye.id - ge.id)
        }), de.id), Le(!0)), W(((St = z.draft) == null ? void 0 : St.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), te;
      }
      const { editorDelta: lt, ...ht } = await oe(`/videos/${de.id}/segments/${v.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...R,
          expectedUpdatedAt: v.updatedAt,
          historyReceiptId: ft
        })
      }), Xe = {
        ...v,
        ...ht,
        reviewState: R.reviewState ?? v.reviewState
      };
      return Xi(v, R, n) ? await rt(lt) : (g((it) => ({
        ...it,
        segments: (it.segments || []).map((z) => z.id === v.id ? Xe : z).sort((z, te) => z.startSec - te.startSec || z.id - te.id)
      }), de.id), Le(!0)), re && await G(
        "segment.update",
        se || "Changed segment",
        Dr(v, n),
        Dr(
          Xe,
          n
        ),
        ft
      ), W(re ? "Saved to Cove" : "History restored"), Xe;
    } catch (lt) {
      return ot && i({ type: "discard", key: ot }), ot && Re && (o == null || o() === $e) && (Se(gt), pe(Be), _.current = Be, Z.current = []), lt.status === 409 ? (W("Conflict — loading the latest segment…"), await _e()) : W(lt.message || "Unable to save the segment."), null;
    }
  }
  async function h() {
    if (!n) return !1;
    const v = D.filter((se) => Yr(se)).length;
    if (v === 0 || k != null) return !1;
    const R = `complete-review:${de.id}:${m.approvedSetVersion}`, re = t("publish", -1);
    if (!re) return !1;
    De(""), W(`Publishing ${v} Approved draft${v === 1 ? "" : "s"}…`);
    try {
      const se = await oe(`/videos/${de.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(R),
          expectedApprovedSetVersion: m.approvedSetVersion
        })
      });
      Ye(R), w(Xt), ce(!1);
      const J = await O(), Fe = dd(
        D,
        U.current,
        se.published
      ), Re = Fe ? mt(J == null ? void 0 : J.segments, Fe) : null;
      return Re && pe(Re.id), W(`${se.published.length} Approved draft${se.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (se) {
      const J = se.status === 409 ? "The approved drafts changed. Review the updated list and try again." : se.message || "Unable to publish the approved drafts.";
      return se.status === 409 && await I(), De(J), W(J), !1;
    } finally {
      re();
    }
  }
  async function B(v, R, re) {
    return v ? (g((se) => sn(se, v), de.id), sn(R, v)) : re();
  }
  async function P(v = null, R = null) {
    const re = l();
    if (jn(re) || To(re) || ee()) return;
    const se = v != null ? E.current : null, J = Number.isFinite(se) ? se : u, Fe = Math.min(ke, J + 20);
    if (Fe <= J) {
      W("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const Re = id(D, F, v);
    if (Re.kind === "choose-tag") {
      E.current = J, W(""), le(!0);
      return;
    }
    if (Re.kind === "invalid-selection") {
      W("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: $e } = Re, Pe = `create-draft:${de.id}:${$e}:${J}`, _e = n ? null : crypto.randomUUID(), gt = U.current, Be = {
      ...F || {},
      id: V.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: $e,
      tagName: R || (F == null ? void 0 : F.tagName) || "Tag segment",
      tagSortName: $e === (F == null ? void 0 : F.tagId) && (F == null ? void 0 : F.tagSortName) || null,
      startSec: J,
      endSec: Fe,
      // Full mode creates manual drafts already approved; match it so a queued review toggles as displayed.
      reviewState: n ? "approved" : "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, ft = Ec(m, Be), ot = zt(
      vn(ft.segments, ft.segmentGroups || [], ft.performerSlots || []),
      Be.id
    ), Le = Mt(), rt = s({
      kind: "create",
      lockId: -1,
      whenBusy: "enqueue",
      run: (ht) => lt(ht)
    });
    if (!rt) return;
    i({ type: "add", entry: { id: Le, taskId: rt.id, op: "insert", segment: Be } }), le(!1), Re.openTagEditor && (L(Be.id), j.current = Be.id, we(!0)), x(Be.id), Y(ot), (await rt.done).status === "cancelled" && (i({ type: "discard", key: Le }), L(null), U.current === Be.id && x(gt));
    async function lt({ detail: ht, onReload: Xe }) {
      var it;
      try {
        let z, te = null;
        if (n) {
          const ge = await oe(`/videos/${de.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: Je(Pe), tagId: $e, startSec: J, endSec: Fe })
          });
          Ye(Pe), z = { itemId: (it = ge.draft) == null ? void 0 : it.itemId }, te = ge.editorDelta ?? null, ge.performerSlots != null && !te && g((Oe) => Gn(Oe, Be.id, ge.performerSlots, ge.performerSlotRevision), de.id);
        } else
          z = { nativeSegmentId: (await oe(`/videos/${de.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: $e,
              startSec: J,
              endSec: Fe,
              historyReceiptId: _e
            })
          })).id };
        E.current = null, le(!1);
        const me = await B(te, ht, Xe);
        if (i({ type: "discard", key: Le }), !me) {
          g((ge) => bo(ge, Be.id), de.id), U.current === Be.id && x(gt), W(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${Re.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const ye = mt(me == null ? void 0 : me.segments, z);
        ye ? (i({ type: "retarget", temporaryId: Be.id, identity: pt(ye) }), c(Be.id, pt(ye)), Re.openTagEditor && (H.current && (j.current = ye.id), L(ye.id)), U.current === Be.id && (x(ye.id), Y(zt(
          vn(me.segments || [], me.segmentGroups || [], me.performerSlots || []),
          ye.id
        ))), n || await G(
          "segment.create",
          "Created segment",
          Ft([], !1),
          Ft([ye], !1),
          _e
        )) : (we(!1), W(`Segment created, but it could not be selected${Re.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (z) {
        throw i({ type: "discard", key: Le }), g((te) => bo(te, Be.id), de.id), U.current === Be.id && x(gt), v != null && le(!0), W(z.message || "Unable to create the draft."), z;
      } finally {
        L(null);
      }
    }
  }
  function ee() {
    return ns(d, F) ? (W("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function C() {
    if (T.length !== 1 || !F || Ur(F) || jn(l()) || ee()) return;
    const v = (a == null ? void 0 : a.id) === F.id ? a : F, R = u;
    if (R <= v.startSec || v.endSec != null && R >= v.endSec) {
      W("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const re = pt(F), se = {
      ...v,
      id: V.current--,
      itemId: null,
      nativeSegmentId: null,
      startSec: R,
      endSec: v.endSec,
      revision: 0,
      updatedAt: null
    }, J = Mt(), Fe = Mt();
    i({ type: "add", entry: { id: J, op: "patch", targets: [re], values: { endSec: R } } }), i({ type: "add", entry: { id: Fe, op: "insert", segment: se } });
    const Re = () => {
      i({ type: "discard", key: J }), i({ type: "discard", key: Fe });
    }, $e = s({
      kind: "split",
      lockId: F.id,
      targets: [re],
      whenBusy: "enqueue",
      run: (gt) => _e(gt)
    });
    if (!$e) {
      Re();
      return;
    }
    (await $e.done).status !== "fulfilled" && Re();
    async function _e({ detail: gt, resolveTargets: Be, onReload: ft, onConflict: ot }) {
      var ht;
      const [Le] = Be();
      if (!Le || R <= Le.startSec || Le.endSec != null && R >= Le.endSec) {
        Re(), W(Le ? "The segment changed before the split could run; move the playhead inside it and split again." : "The segment changed before the split could run.");
        return;
      }
      const rt = `split-draft:${Le.itemId}:${Le.revision}:${R}`, St = n ? null : Ft([Le], !1), lt = n ? null : crypto.randomUUID();
      try {
        let Xe, it;
        if (n && Le.nativeSegmentId == null) {
          const me = await oe(`/videos/${de.id}/drafts/${Le.itemId}/split`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Je(rt),
              expectedRevision: Le.revision,
              splitSec: R
            })
          });
          Ye(rt), Xe = { itemId: (ht = me.createdDraft) == null ? void 0 : ht.itemId }, it = me.editorDelta ?? null;
        } else {
          const me = await oe(`/videos/${de.id}/segments/${Le.id}/split`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: Le.updatedAt,
              splitSec: R,
              historyReceiptId: lt
            })
          });
          Xe = { nativeSegmentId: me.id }, it = me.editorDelta ?? null;
        }
        const z = await B(it, gt, ft), te = mt(z == null ? void 0 : z.segments, Xe);
        if (te ? (i({ type: "retarget", temporaryId: se.id, identity: pt(te) }), c(se.id, pt(te)), U.current === se.id && x(te.id)) : U.current === se.id && x(Le.id), i({ type: "confirm", key: J, applied: z != null }), i({ type: "discard", key: Fe }), !n) {
          const me = [
            mt(z == null ? void 0 : z.segments, {
              nativeSegmentId: Le.nativeSegmentId ?? Le.id
            }),
            te
          ].filter(Boolean);
          await G(
            "segment.split",
            "Split segment",
            St,
            Ft(me, !1),
            lt
          );
        }
        W(n ? `Segment split; both ranges remain ${Le.reviewState}.` : "Segment split.");
      } catch (Xe) {
        Re(), U.current === se.id && x(Le.id), Xe.status === 409 ? await ot() : W(Xe.message || "Unable to split the draft.");
      }
    }
  }
  async function ue(v = !1) {
    const R = l();
    if (T.length !== 1 || !F || Ur(F) || jn(R) || To(R) || ee()) return;
    const re = v ? u : ((a == null ? void 0 : a.id) === F.id ? a : F).startSec, se = n ? null : crypto.randomUUID(), J = F, Fe = U.current, Re = (a == null ? void 0 : a.id) === J.id ? a : J, $e = Re.endSec == null ? null : Re.endSec - Re.startSec, Pe = {
      ...J,
      id: V.current--,
      itemId: null,
      nativeSegmentId: null,
      startSec: re,
      endSec: $e == null ? null : re + $e,
      // Full mode creates the copy as an approved draft, even from a published segment; match it so a
      // queued review toggles as displayed and the copy waits for Publish approved like other drafts.
      reviewState: n ? "approved" : J.reviewState,
      published: n ? !1 : J.published,
      revision: 0,
      updatedAt: null
    }, _e = ($ || []).filter((rt) => rt.segmentId === J.id), gt = Mt(), Be = () => {
      i({ type: "discard", key: gt }), _e.length > 0 && g((rt) => bo(rt, Pe.id), de.id);
    }, ft = s({
      kind: "duplicate",
      lockId: -1,
      targets: [pt(J)],
      whenBusy: "enqueue",
      run: (rt) => Le(rt)
    });
    if (!ft) return;
    i({ type: "add", entry: { id: gt, taskId: ft.id, op: "insert", segment: Pe } }), _e.length > 0 && g((rt) => Gn(rt, Pe.id, _e), de.id), v || (L(Pe.id), j.current = Pe.id, we(!0)), x(Pe.id), (await ft.done).status === "cancelled" && (Be(), L(null), U.current === Pe.id && x(Fe));
    async function Le({ detail: rt, resolveTargets: St, onReload: lt, onConflict: ht }) {
      var z, te;
      const [Xe] = St(), it = Xe ? od(de.id, Xe, v, re) : null;
      try {
        if (!Xe) throw new Error("The segment changed before the duplicate could run.");
        const me = ((z = Q.current) == null ? void 0 : z.operationKey) === it ? Q.current : null;
        let ye = (me == null ? void 0 : me.duplicateIdentity) ?? null, ge = null;
        if (ye == null && n) {
          const je = Xe.nativeSegmentId == null ? `/videos/${de.id}/drafts/${Xe.itemId}/duplicate` : `/videos/${de.id}/segments/${Xe.nativeSegmentId}/duplicate-draft`, tt = await oe(je, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Je(it),
              ...Xe.nativeSegmentId == null ? { expectedRevision: Xe.revision } : { expectedUpdatedAt: Xe.updatedAt },
              startSec: v ? re : null
            })
          });
          ye = Pi(!1, tt), ge = tt.editorDelta ?? null, Q.current = { operationKey: it, duplicateIdentity: ye };
        } else if (ye == null) {
          const je = await oe(`/videos/${de.id}/segments/${Xe.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: Xe.updatedAt,
              startSec: v ? re : null,
              historyReceiptId: se
            })
          });
          ye = Pi(!0, je), Q.current = { operationKey: it, duplicateIdentity: ye };
        }
        const Oe = await B(ge, rt, lt);
        Be();
        const Me = mt(Oe == null ? void 0 : Oe.segments, ye);
        if (!Me) {
          U.current === Pe.id && (we(!1), x(Fe)), W(Oe ? "Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection." : "Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.");
          return;
        }
        i({ type: "retarget", temporaryId: Pe.id, identity: pt(Me) }), c(Pe.id, pt(Me));
        const Qe = Sa(
          Me,
          Oe.performerSlots || [],
          p,
          f,
          Oe.segmentGroups || []
        );
        X(Qe.filters), ae(Qe.hideDerivedSegments), !v && H.current && (j.current = Me.id), U.current === Pe.id && (x(Me.id), Y(zt(
          vn(Oe.segments || [], Oe.segmentGroups || [], Oe.performerSlots || []),
          Me.id
        ))), n && Ye(it), Q.current = null, W(v ? "Duplicate created at the playhead." : "Duplicate created in place."), n || await G(
          "segment.duplicate",
          "Duplicated segment",
          Ft([], !1),
          Ft([Me], !1),
          se
        );
      } catch (me) {
        throw Be(), U.current === Pe.id && (we(!1), x(Fe)), it != null && ((te = Q.current) == null ? void 0 : te.operationKey) === it ? W("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : me.status === 409 ? await ht() : W(me.message || "Unable to duplicate the draft."), me;
      } finally {
        L(null);
      }
    }
  }
  async function Ne() {
    if (T.length !== 1 || !F) return;
    const v = Number(he), R = b.trim() === "" ? null : Number(b), re = Ci(v, R, S);
    if (re.error) {
      W(re.error);
      return;
    }
    const se = (a == null ? void 0 : a.id) === F.id ? a : F;
    if (v === se.startSec && R === se.endSec) {
      W("Timing is unchanged.");
      return;
    }
    await A(F, { startSec: v, endSec: R, tagId: se.tagId }, !0, null, !0);
  }
  async function ne(v, R) {
    if (T.length !== 1 || !F) return;
    const re = Ci(v, R, S);
    if (re.error) {
      W(re.error);
      return;
    }
    const se = (a == null ? void 0 : a.id) === F.id ? a : F;
    if (v === se.startSec && R === se.endSec) {
      W("Timing is unchanged.");
      return;
    }
    await A(F, { startSec: v, endSec: R, tagId: se.tagId }, !0, null, !0);
  }
  return { acceptHistory: w, recordHistoryAction: G, mutateSegment: A, runSegmentMutation: N, completeReview: h, createSegment: P, splitSegment: C, duplicateSegment: ue, saveTiming: Ne, applyShortcutTiming: ne };
}
function _c() {
  const [e, t] = K(() => typeof window < "u" && window.matchMedia(wi).matches);
  return be(() => {
    if (typeof window > "u") return;
    const n = window.matchMedia(wi), o = () => t(n.matches);
    return o(), n.addEventListener("change", o), () => n.removeEventListener("change", o);
  }, []), e;
}
function Hc() {
  const [e, t] = K(() => typeof window < "u" && window.matchMedia(Ni).matches);
  return be(() => {
    if (typeof window > "u") return;
    const n = window.matchMedia(Ni), o = () => t(n.matches);
    return o(), n.addEventListener("change", o), () => n.removeEventListener("change", o);
  }, []), e;
}
function qc() {
  try {
    return Tl(window.localStorage.getItem(ca));
  } catch {
    return { ...Ot };
  }
}
function Wc() {
  try {
    return dn(JSON.parse(window.localStorage.getItem(ua) || "[]"));
  } catch {
    return [];
  }
}
function Vc(e) {
  try {
    window.localStorage.setItem(ua, JSON.stringify(dn(e)));
  } catch {
  }
}
function Jc(e) {
  try {
    window.localStorage.setItem(ca, JSON.stringify(e));
  } catch {
  }
}
function Yc() {
  try {
    const e = JSON.parse(window.localStorage.getItem(ga) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Qc(e) {
  try {
    return window.localStorage.setItem(ga, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Xc({ status: e }) {
  const t = qa[e];
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
  }, At.map((t) => r("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ..._a(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${_t[t].symbol}${e[t]}`)));
}
function Zc({ videoId: e, segmentId: t, itemId: n, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: u, shortcutRef: m }) {
  const p = Fo(a), [b, f] = K(() => yo(o, p)), [y, S] = K(!1), [I, g] = K(""), O = fe(!1), V = o.map((k) => `${k.slotDefinitionId}:${k.performerId || ""}`).join("|"), Q = p.map((k) => yt(k)).join("|"), E = Oa(
    o,
    p
  );
  be(() => {
    f(yo(o, p)), g("");
  }, [t, n, V, Q]);
  async function j(k = b) {
    if (!O.current) {
      O.current = !0, S(!0), g("Saving performer slots…");
      try {
        const D = yo(o.map((T) => ({
          ...T,
          performerId: k[T.slotDefinitionId] || null
        })), p), F = o.map((T) => {
          const _ = D[T.slotDefinitionId] ? Number(D[T.slotDefinitionId]) : null, Z = p.find((L) => String(yt(L)) === String(_));
          return {
            ...T,
            performerId: _,
            performerName: (Z == null ? void 0 : Z.name) || null
          };
        });
        if (s(F) === !1) {
          g("");
          return;
        }
        const U = await oe(n != null ? `/videos/${e}/drafts/${n}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((T) => ({ slotDefinitionId: T.slotDefinitionId, performerId: D[T.slotDefinitionId] ? Number(D[T.slotDefinitionId]) : null }))
          })
        });
        g("Performer slots saved."), await l(U, {
          beforeState: Hr([{
            segmentId: t,
            itemId: n,
            revision: i,
            slots: o
          }]),
          afterState: Hr([{
            segmentId: t,
            itemId: n,
            revision: U.revision,
            slots: U.slots || []
          }])
        });
      } catch (D) {
        d && await d(o, D), D.status === 409 ? (g("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : g(D.message || "Unable to save performer slots.");
      } finally {
        O.current = !1, S(!1);
      }
    }
  }
  function $(k, D) {
    g(`Option ${D + 1} applied; save to confirm.`), f({ ...b, ...k.assignments });
  }
  async function x(k) {
    const D = { ...b, ...k.assignments };
    f(D), await j(D);
  }
  return be(() => {
    if (m)
      return m.current = (k) => O.current || !E[k] ? !1 : (x(E[k]), !0), () => {
        m.current = null;
      };
  }), r("div", { className: "space-y-2" }, [
    E.length ? r("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      r("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      r("div", { key: "options", className: "space-y-2" }, E.map((k, D) => r("button", {
        key: D,
        type: "button",
        disabled: y,
        onClick: () => $(k, D),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${D + 1}: ${k.description}`
      }, [
        r("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, D + 1),
        r("span", { key: "description" }, k.description)
      ]))),
      r("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${E.length} to apply and save`)
    ]) : null,
    r("div", { key: "slots", className: "grid gap-2" }, o.map((k) => r("label", { key: k.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      r("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Lt(k)),
      (k.genderHints || []).length ? r("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(k.genderHints || []).map(Xr).join(" · ")}`) : null,
      r("select", { key: "select", value: b[k.slotDefinitionId] || "", disabled: y, onChange: (D) => f({ ...b, [k.slotDefinitionId]: D.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        r("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Pa(p, p, k.genderHints).map((D) => r("option", { key: yt(D), value: yt(D) }, D.name))
      ])
    ]))),
    r("div", { key: "actions", className: "flex items-center gap-3" }, [r("button", { key: "save", ref: u, type: "button", disabled: y, onClick: () => j(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), r("span", { key: "message", role: "status", className: "text-xs text-secondary" }, I)])
  ]);
}
function eu({ videoId: e, targets: t, performerCandidates: n, onSaved: o, onConflict: i, shortcutRef: a, acquireSaveLock: s = () => () => {
} }) {
  var j;
  const l = ((j = t[0]) == null ? void 0 : j.slots) || [], d = Fo(n), c = Oa(
    l,
    d
  ), u = "__mixed__", m = () => Object.fromEntries(l.map(($, x) => {
    const k = t.map((D) => {
      var F;
      return String(((F = D.slots[x]) == null ? void 0 : F.performerId) || "");
    });
    return [$.slotDefinitionId, k.every((D) => D === k[0]) ? k[0] : u];
  })), [p, b] = K(m), [f, y] = K(!1), [S, I] = K(""), g = fe(!1), O = t.map(($) => `${$.itemId ?? `native:${$.segmentId}`}:${$.revision}:${$.slots.map((x) => `${x.slotDefinitionId}:${x.performerId || ""}`).join(",")}`).join("|");
  be(() => {
    b(m());
  }, [O]);
  async function V($ = p) {
    if (g.current) return;
    const x = s();
    if (!x) {
      I("Wait for the current save to finish before saving performer slots.");
      return;
    }
    g.current = !0, y(!0), I(`Saving performer slots for ${t.length} segments…`);
    const k = [];
    try {
      for (const D of t) {
        const F = D.slots.map((T, _) => {
          const Z = $[l[_].slotDefinitionId];
          return {
            slotDefinitionId: T.slotDefinitionId,
            performerId: Z === u ? T.performerId || null : Z ? Number(Z) : null
          };
        }), U = await oe(D.itemId != null ? `/videos/${e}/drafts/${D.itemId}/slots` : `/videos/${e}/segments/${D.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: D.revision, assignments: F })
        });
        k.push({
          segmentId: D.segmentId,
          itemId: D.itemId,
          revision: U.revision,
          slots: U.slots || []
        });
      }
      I("Performer slots saved."), await o({
        beforeState: Hr(t),
        afterState: Hr(k)
      });
    } catch (D) {
      const F = await i();
      D.status === 409 ? I(F ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : I(D.message || (F ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      g.current = !1, y(!1), x();
    }
  }
  function Q($, x) {
    I(`Option ${x + 1} applied; save to confirm.`), b({ ...p, ...$.assignments });
  }
  async function E($) {
    const x = { ...p, ...$.assignments };
    b(x), await V(x);
  }
  return be(() => {
    if (a)
      return a.current = ($) => g.current || !c[$] ? !1 : (E(c[$]), !0), () => {
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
      r("div", { key: "options", className: "space-y-2" }, c.map(($, x) => r("button", {
        key: x,
        type: "button",
        disabled: f,
        onClick: () => Q($, x),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${x + 1} to all selected segments: ${$.description}`
      }, [
        r("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, x + 1),
        r("span", { key: "description" }, $.description)
      ]))),
      r("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${c.length} to apply and save across the selection`)
    ]) : null,
    r("div", { key: "slots", className: "grid gap-2" }, l.map(($) => r("label", {
      key: $.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      r("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Lt($)),
      r("select", {
        key: "select",
        value: p[$.slotDefinitionId] || "",
        disabled: f,
        onChange: (x) => b({ ...p, [$.slotDefinitionId]: x.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        p[$.slotDefinitionId] === u ? r("option", { key: "mixed", value: u }, "Mixed — leave unchanged") : null,
        r("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Pa(d, d, $.genderHints).map((x) => r("option", {
          key: yt(x),
          value: yt(x)
        }, x.name))
      ])
    ]))),
    r("div", { key: "actions", className: "flex items-center gap-3" }, [
      r("button", {
        key: "save",
        type: "button",
        disabled: f,
        onClick: () => V(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      r("span", { key: "message", role: "status", className: "text-xs text-secondary" }, S)
    ])
  ]);
}
function Ht(e, t = null) {
  const n = String(e || "").trim().toLowerCase();
  return n === "ext:segment-studio:stash-marker-studio" || n === "stash-marker-studio" || n === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : n === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : n === "segment-studio/user" || n === "user" ? "Manual" : n === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : n === "tpdb" ? "TPDB" : n ? n.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function tu(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const n = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (n.length === 0) return Ht(t);
  const o = [...new Set(n.map((i) => Ht(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function to() {
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
function nu({ hidden: e }) {
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
    r(to, { key: "derived" })
  ]);
}
function ru({ segment: e, provenance: t }) {
  var u;
  const [n, o] = K(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = tu(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
  return r("section", { "aria-label": "Segment provenance", className: "rounded-md border border-border bg-surface" }, [
    r("button", {
      key: "toggle",
      type: "button",
      onClick: () => o((m) => !m),
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
      ) : s.map((m) => {
        const p = m.modelIdentifier || m.modelKey, b = m.value == null ? null : typeof m.value == "string" ? m.value : JSON.stringify(m.value);
        return r("div", { key: m.id || `${m.fieldKey}:${m.sourceKey}:${m.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          r(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            Ht(m.sourceKey, m.sourceDisplayName)
          ),
          m.fieldKey ? r(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${m.fieldKey}${b == null ? "" : ` · ${b}`}`
          ) : null,
          m.relation === "inherited" ? r("div", { key: "relation", className: "text-secondary" }, "Inherited origin") : null,
          p ? r(
            "div",
            { key: "model", className: "text-secondary" },
            `Model ${p}${m.modelVersion ? ` · ${m.modelVersion}` : ""}`
          ) : null,
          m.activityExternalRunId || m.sourceRunId ? r("div", { key: "run", className: "break-all text-secondary" }, `Run ${m.activityExternalRunId || m.sourceRunId}`) : null,
          m.confidence != null ? r(
            "div",
            { key: "confidence", className: "text-secondary" },
            `Confidence ${Math.round(m.confidence * 100)}%`
          ) : null,
          m.recordedAt || m.createdAt ? r("div", { key: "recorded", className: "text-secondary" }, `Recorded ${m.recordedAt || m.createdAt}`) : null
        ]);
      })
    ) : null
  ]);
}
function ou({
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
  const [m, p] = K([]), b = e.flatMap((I) => I.lanes.map((g) => g.key)), f = b.join("|");
  be(() => {
    const I = new Set(b);
    p((g) => g.filter((O) => I.has(O)));
  }, [f]);
  const y = qr(t), S = !!Qa(
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
        `${b.length} swimlane${b.length === 1 ? "" : "s"} · ${e.length} group${e.length === 1 ? "" : "s"}`
      ),
      a ? r(ln, { key: "counts", counts: y }) : null
    ]),
    r(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      lc({ mergeable: S, reviewable: a, tagEditable: s, slotsEditable: l })
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
      ...I.lanes.map((g) => {
        const O = m.includes(g.key), V = g.markers.some(({ segment: E }) => E.id === n), Q = `selected-segment-lane-${g.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return r("div", {
          key: g.key,
          "data-selected-segment-lane": g.key,
          className: `rounded-md border ${V ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          r("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": O,
            "aria-controls": Q,
            "aria-current": V ? "true" : void 0,
            onClick: () => p((E) => O ? E.filter((j) => j !== g.key) : [...E, g.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            r("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, O ? "▾" : "▸"),
            r("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, gr(g)),
            r("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(g.selectedCount)),
            a ? r(ln, { key: "states", counts: g.counts }) : null
          ]),
          O ? r("div", {
            key: "segments",
            id: Q,
            className: "space-y-1 border-t border-border p-1.5"
          }, g.markers.map(({ segment: E }) => {
            const j = E.endSec == null ? Ge(E.startSec) : `${Ge(E.startSec)} – ${Ge(E.endSec)}`;
            return r("button", {
              key: E.id,
              type: "button",
              onClick: () => i(E),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${E.id === n ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${E.tagName || "Segment"}, ${E.reviewState}, ${j}` : `${E.tagName || "Segment"}, ${j}`,
              "aria-current": E.id === n ? "true" : void 0
            }, [
              a ? r(Sn, {
                key: "state",
                state: E.reviewState,
                includeLabel: !1
              }) : null,
              E.isDerived ? r(to, { key: "derived" }) : null,
              r("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, j),
              r(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                Ht(E.sourceKey)
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
}, ss = "com.midnightrider.segment-studio", iu = /* @__PURE__ */ new Set(["hasSegments"]), au = /* @__PURE__ */ new Set(["segment_count", "unreviewed_count"]), su = {
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
  return { extensionId: ss, filterId: e, modifier: t, value: n };
}
function Zi(e) {
  return typeof e == "boolean" ? e : e === "has" ? !0 : e === "none" ? !1 : null;
}
function ea(e) {
  const t = Vr(e == null ? void 0 : e.value), n = Vr(e == null ? void 0 : e.excludes), o = { INCLUDES_ALL: "includesall", EXCLUDES: "excludes", IS_NULL: "isnull", NOT_NULL: "notnull" }[e == null ? void 0 : e.modifier] ?? "includes";
  return o === "isnull" || o === "notnull" ? lr("segment-tags", o, {}) : t.length === 0 && (o === "excludes" || n.length === 0) ? null : lr("segment-tags", o, {
    ...t.length > 0 ? { value: t } : {},
    ...n.length > 0 && o !== "excludes" ? { excludes: n } : {},
    ...(e == null ? void 0 : e.depth) === -1 ? { depth: -1 } : {}
  });
}
function Ro(e = {}, { fullMode: t = !0 } = {}) {
  var S, I, g;
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
  const i = [], a = Zi(((S = e.hasSegmentsCriterion) == null ? void 0 : S.value) ?? e.segments);
  a !== null && i.push(lr("has-segments", "equals", a));
  const s = ((I = e.reviewStateCriterion) == null ? void 0 : I.value) ?? e.reviewState;
  t && ["unreviewed", "approved", "rejected"].includes(s) && i.push(lr("review-state", "equals", s));
  const l = Zi(((g = e.shotBoundariesCriterion) == null ? void 0 : g.value) ?? e.shotBoundaries);
  t && l !== null && i.push(lr("has-shot-boundaries", "equals", l));
  const d = Number(e.segmentTagId ?? e.tagId) || null, c = e.segmentTagsCriterion ? ea(e.segmentTagsCriterion) : d ? ea({ value: [d] }) : null;
  c && i.push(c);
  const u = Vr(e.videoTagIds);
  u.length > 0 && !o.tagsCriterion && (o.tagsCriterion = { modifier: "INCLUDES", value: u });
  const m = Vr(e.performerIds);
  m.length > 0 && !o.performersCriterion && (o.performersCriterion = { modifier: "INCLUDES", value: m });
  const p = Number(e.studioId) || null;
  p && !o.studiosCriterion && (o.studiosCriterion = { modifier: "INCLUDES", value: [p] });
  const b = Array.isArray(e.extensionCriteria) ? e.extensionCriteria : [], f = new Set(b.filter((O) => (O == null ? void 0 : O.extensionId) === ss).map((O) => O.filterId)), y = [...b, ...i.filter((O) => !f.has(O.filterId))];
  return y.length > 0 ? o.extensionCriteria = y : delete o.extensionCriteria, o;
}
function Eo(e) {
  return au.has(e == null ? void 0 : e.sort) ? { ...e, sort: Vt.defaultFilter.sort, direction: Vt.defaultFilter.direction } : e;
}
function Wr(e) {
  return Array.isArray(e) ? e.map(Wr) : !e || typeof e != "object" ? e : Object.fromEntries(Object.entries(e).map(([t, n]) => [
    t,
    t === "modifier" && typeof n == "string" ? su[n] ?? n : Wr(n)
  ]));
}
function lu(e, t, { fullMode: n = !0 } = {}) {
  var d;
  const o = Eo(e), i = {
    page: o.page || 1,
    perPage: o.perPage || Vt.defaultFilter.perPage,
    sort: o.sort || Vt.defaultFilter.sort,
    direction: o.direction || Vt.defaultFilter.direction
  };
  o.q && (i.q = o.q), i.sort === "random" && Number.isInteger(o.seed) && o.seed > 0 && (i.seed = o.seed);
  const a = { ...Ro(t, { fullMode: n }) };
  delete a.includeCompilationGroups;
  const { _filterExpression: s, ...l } = a;
  return {
    findFilter: i,
    objectFilter: Wr(l),
    ...(d = s == null ? void 0 : s.children) != null && d.length ? { filterExpression: Wr(s) } : {}
  };
}
function du(e) {
  return e.filter((t) => !iu.has(t.id));
}
function cu(e, t) {
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
function ls(e, t, n) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(n));
}
function Vr(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((n) => Number.isInteger(n) && n > 0))];
}
function uu(e, t, n, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(n);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((u) => a.add(u));
  } else a.has(n) ? a.delete(n) : a.add(n);
  return a;
}
function ds({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? r("div", { className: "text-[11px]" }, r(zi, null, "No tag segments")) : t ? r("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, At.flatMap((n) => {
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
    r(zi, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function cs({ item: e, selected: t, selectionActive: n, onSelect: o }) {
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
function mu({ item: e, onNavigate: t, showReviewStates: n = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      r(cs, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? r("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, ll(e.duration)) : null
    ]),
    r("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      r("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      r("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? r("span", { key: "date" }, e.date) : null,
        e.organized ? r("span", { key: "organized" }, "Organized") : null,
        e.isVr ? r("span", { key: "vr" }, "VR") : null
      ]),
      r("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, r(ds, { item: e, showReviewStates: n }))
    ])
  ]);
}
function gu({ item: e, onNavigate: t, showReviewStates: n = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return r("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    r(cs, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
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
        r(ds, { key: "segments", item: e, showReviewStates: n })
      ]),
      r("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function Vo({ active: e, onNavigate: t, showBin: n = !1, profile: o }) {
  const i = gd(o);
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
      ) ? r(us, { key: "bin", onNavigate: t }) : null,
      r(ms, { key: "settings", onNavigate: t })
    ])
  ]);
}
const Mo = "segment-studio:recycling-bin-changed";
function fu(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function dr() {
  window.dispatchEvent(new CustomEvent(Mo));
}
function us({ onNavigate: e, compact: t = !1 }) {
  const [n, o] = K(null);
  be(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const u = await oe("/bin"), m = Number(u == null ? void 0 : u.totalCount);
        !a && c === s && o(Number.isFinite(m) && m >= 0 ? Math.trunc(m) : null);
      } catch {
        !a && c === s && o(null);
      }
    }, d = () => {
      l();
    };
    return l(), window.addEventListener(Mo, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(Mo, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = fu(n);
  return r("a", {
    href: "/segment-studio/bin",
    onClick: (a) => br(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": n == null ? "Open recycling bin" : `Open recycling bin, ${n} item${n === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [r("span", { key: "icon", "aria-hidden": "true" }, "♲"), r("span", { key: "label" }, i)]);
}
function ms({ onNavigate: e, compact: t = !1 }) {
  return r("a", {
    href: "/segment-studio/settings",
    onClick: (n) => br(n, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [r("span", { key: "icon", "aria-hidden": "true" }, "⚙"), r("span", { key: "label" }, "Settings")]);
}
function pu({ mode: e, onModeChange: t, disabled: n = !1 }) {
  function o(i) {
    const a = No(i.target.value);
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
function yu({ minimum: e, maximum: t, onChange: n }) {
  const o = fe(null), [i, a] = K("maximum"), s = (p, b) => {
    const f = jl(e, t, p, b);
    a(f.coincidentTop), n({ minimum: f.minimum, maximum: f.maximum });
  }, l = (p, b) => {
    var y;
    const f = (y = o.current) == null ? void 0 : y.getBoundingClientRect();
    f && s(p, Ll(b.clientX, f.left, f.width));
  }, d = (p, b) => {
    var f, y;
    b.preventDefault(), (y = (f = b.currentTarget).setPointerCapture) == null || y.call(f, b.pointerId), l(p, b);
  }, c = (p, b) => {
    var f, y;
    (y = (f = b.currentTarget).hasPointerCapture) != null && y.call(f, b.pointerId) && l(p, b);
  }, u = (p, b) => {
    const f = p === "minimum" ? e : t, y = p === "minimum" ? 0 : e, S = p === "minimum" ? t : 1, I = b.shiftKey ? 0.1 : 0.01;
    let g = null;
    ["ArrowLeft", "ArrowDown"].includes(b.key) && (g = f - I), ["ArrowRight", "ArrowUp"].includes(b.key) && (g = f + I), b.key === "PageDown" && (g = f - 0.1), b.key === "PageUp" && (g = f + 0.1), b.key === "Home" && (g = y), b.key === "End" && (g = S), g != null && (b.preventDefault(), s(p, Math.min(S, Math.max(y, g))));
  }, m = (p, b) => r("span", {
    key: p,
    role: "slider",
    tabIndex: 0,
    "aria-label": p === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((p === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((p === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(b * 100),
    "aria-valuetext": `${Math.round(b * 100)} percent`,
    onPointerDown: (f) => d(p, f),
    onPointerMove: (f) => c(p, f),
    onKeyDown: (f) => u(p, f),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${b * 100}%`,
      touchAction: "none",
      zIndex: e === t && i === p ? 2 : 1
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
        m("minimum", e),
        m("maximum", t)
      ])
    )
  ]);
}
function bu({ saving: e, error: t, onSelect: n, onClose: o }) {
  const i = fe(null);
  be(() => {
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
function hu({
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
  const m = Gt(e), p = [...new Map((a || []).map((g) => [
    Number(g.tagId),
    g.tagName || `Tag ${g.tagId}`
  ])).entries()].sort((g, O) => g[1].localeCompare(O[1]) || g[0] - O[0]), b = new Set((a || []).map((g) => Number(g.tagId))), f = (s || []).filter((g) => Number(g.id) === m.segmentGroupId || (g.tags || []).some((O) => b.has(Number(O.tagId)))), y = (g) => d(Gt({ ...m, ...g })), S = (g) => y({
    reviewStates: m.reviewStates.includes(g) ? m.reviewStates.filter((O) => O !== g) : [...m.reviewStates, g]
  }), I = (g) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${g ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && u();
    },
    onKeyDownCapture: (g) => Pt(g, { onCancel: u })
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
        r("div", { className: "flex flex-wrap gap-2" }, At.map((g) => {
          const O = m.reviewStates.includes(g), V = _t[g];
          return r("button", {
            key: g,
            type: "button",
            onClick: () => S(g),
            "aria-pressed": O,
            className: I(O)
          }, `${V.symbol} ${g} (${i[g] || 0})`);
        }))
      ]) : null,
      l ? r("fieldset", { key: "performer", className: "space-y-2" }, [
        r("legend", { className: "text-sm font-semibold text-foreground" }, "Performer"),
        r("p", { className: "text-xs text-secondary" }, "Any assigned slot may match the selected performer."),
        r("div", { className: "flex flex-wrap gap-2" }, [
          r("button", {
            key: "any",
            type: "button",
            onClick: () => y({ performerId: null }),
            "aria-pressed": m.performerId == null,
            className: I(m.performerId == null)
          }, "All performers"),
          ...n.map((g) => {
            const O = Number(yt(g));
            return r("button", {
              key: O,
              type: "button",
              onClick: () => y({ performerId: O }),
              "aria-pressed": m.performerId === O,
              className: I(m.performerId === O)
            }, g.name);
          })
        ])
      ]) : null,
      r("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        r("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          r("span", { key: "label" }, "Tag"),
          r("select", {
            key: "select",
            value: m.tagId ?? "",
            onChange: (g) => y({
              tagId: g.target.value === "" ? null : Number(g.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            r("option", { key: "all", value: "" }, "All tags"),
            ...p.map(([g, O]) => r("option", { key: g, value: g }, O))
          ])
        ]),
        r("label", {
          key: "segment-group",
          className: "space-y-1 text-xs text-secondary"
        }, [
          r("span", { key: "label" }, "Segment group"),
          r("select", {
            key: "select",
            value: m.segmentGroupId ?? "",
            onChange: (g) => y({
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
            onClick: () => y({ sourceKey: null }),
            "aria-pressed": m.sourceKey == null,
            className: I(m.sourceKey == null)
          }, "All provenance"),
          ...o.map((g) => r("button", {
            key: g,
            type: "button",
            onClick: () => y({ sourceKey: g }),
            "aria-pressed": m.sourceKey === g,
            title: g,
            className: I(m.sourceKey === g)
          }, Ht(g)))
        ])
      ]),
      r("fieldset", { key: "confidence", className: "space-y-3" }, [
        r("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        r(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        r(yu, {
          minimum: m.confidenceMin,
          maximum: m.confidenceMax,
          onChange: ({ minimum: g, maximum: O }) => y({
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
            checked: m.includeUnscored,
            onChange: (g) => y({
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
        r(nu, { key: "icon", hidden: t }),
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
const gs = "segment-studio-editor-history";
function vu({ history: e, historySaving: t, anchorRef: n, onRestore: o, onClose: i }) {
  const a = fe(null);
  return be(() => {
    const s = (d) => {
      rc(d.target, a.current, n == null ? void 0 : n.current) && i();
    }, l = (d) => {
      var m, p, b;
      if (d.key !== "Escape" || d.defaultPrevented || document.querySelector("[role='dialog'], [aria-modal='true']")) return;
      const c = document.activeElement, u = c instanceof Element && (((m = a.current) == null ? void 0 : m.contains(c)) || ((p = n == null ? void 0 : n.current) == null ? void 0 : p.contains(c)));
      d.preventDefault(), i(), u && ((b = n == null ? void 0 : n.current) == null || b.focus({ preventScroll: !0 }));
    };
    return document.addEventListener("pointerdown", s), document.addEventListener("keydown", l), () => {
      document.removeEventListener("pointerdown", s), document.removeEventListener("keydown", l);
    };
  }, [n, i]), r("div", {
    ref: a,
    id: gs,
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
function xu({ reviewMode: e, bindings: t, onClose: n }) {
  const o = pr.filter((l) => Bn(l, e)), i = Ai(o, 1)[0], a = Ai(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((u) => r("div", { key: u.id, className: "flex items-center justify-between text-sm" }, [
      r("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, u.description),
      r(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[u.id] ? t[u.id].length > 0 ? t[u.id] : ["Unassigned"] : u.bindings.map(Na)).map((m, p) => r("kbd", { key: `${u.id}:${p}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, m))
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
  const s = $c(e), [l, d] = K([]), c = s.map((u) => u.tagName).join("|");
  return be(() => {
    const u = new Set(s.map((m) => m.tagName));
    d((m) => m.filter((p) => u.has(p)));
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
      r("div", { key: "items", className: "space-y-3" }, e.length ? s.map((u, m) => {
        const p = l.includes(u.tagName), b = `incorrect-example-tag-${m}`;
        return r("section", {
          key: u.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          r("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": p,
            "aria-controls": b,
            onClick: () => d((f) => p ? f.filter((y) => y !== u.tagName) : [...f, u.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: Qr(!1) }
          }, [
            r(
              "span",
              { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" },
              p ? "▾" : "▸"
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
          p ? r("div", {
            key: "examples",
            id: b,
            className: "divide-y divide-border border-t border-border"
          }, u.examples.map((f) => {
            const y = `${Ge(f.startSec)}${f.endSec == null ? "" : ` – ${Ge(f.endSec)}`}`, S = n === f.id;
            return r("div", {
              key: f.id,
              className: "flex items-center justify-between gap-3 px-3 py-2 text-sm"
            }, [
              r(
                "span",
                { key: "time", className: "font-mono text-xs text-secondary" },
                y
              ),
              r("button", {
                key: "remove",
                type: "button",
                disabled: t || n != null,
                onClick: () => i(f),
                "aria-label": `${S ? "Restoring" : "Restore to review"} ${u.tagName} example at ${y}`,
                className: "rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
              }, S ? "Restoring…" : "Restore to review")
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
function ku({ segments: e, onSelect: t, onClose: n }) {
  const [o, i] = K(""), [a, s] = K(0), l = fe(null), d = qe(() => Ad(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), u = Od(d);
  be(() => {
    var p;
    (p = l.current) == null || p.scrollIntoView({ block: "nearest" });
  }, [c, o]);
  const m = () => {
    const p = d[c];
    p && t(p.segment || p);
  };
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-start justify-center bg-black/70 p-4 pt-[10vh]",
    onMouseDown: (p) => {
      p.target === p.currentTarget && n();
    }
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-quick-search-title",
    tabIndex: -1,
    className: "flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    onKeyDownCapture: (p) => {
      var b;
      if (p.key === "Tab")
        Jt(p);
      else if (p.key === "Escape")
        p.preventDefault(), p.stopPropagation(), n();
      else if (p.key === "ArrowDown" || p.key === "ArrowUp") {
        p.preventDefault(), p.stopPropagation();
        const f = p.key === "ArrowDown" ? 1 : -1;
        s((y) => d.length ? (y + f + d.length) % d.length : 0);
      } else p.key === "Enter" && !((b = p.nativeEvent) != null && b.isComposing) && (p.preventDefault(), p.stopPropagation(), m());
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
        onChange: (p) => {
          i(p.target.value), s(0);
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
    }, d.length ? d.flatMap((p, b) => {
      var Q;
      const f = p.segment || p, y = f.endSec == null ? Ge(f.startSec) : `${Ge(f.startSec)} – ${Ge(f.endSec)}`, S = `${Ht(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`, I = b === c, g = b > 0 ? d[b - 1].groupKey : null, O = u && p.groupKey !== g ? r("div", {
        key: `group:${p.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, p.groupName) : null, V = r("button", {
        key: f.id,
        id: `segment-quick-search-${f.id}`,
        ref: I ? l : null,
        type: "button",
        role: "option",
        "aria-selected": I,
        onMouseEnter: () => s(b),
        onClick: () => t(f),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${I ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        u ? r("span", { key: "group", className: "sr-only" }, `${p.groupName} group`) : null,
        r(Sn, { key: "review", state: f.reviewState, includeLabel: !1 }),
        r(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          f.tagName || "Tag segment"
        ),
        (Q = p.performers) != null && Q.length ? r(Zr, {
          key: "performers",
          performers: p.performers,
          performerAssignments: p.performerAssignments
        }) : null,
        r(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          y
        ),
        r("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: S
        }, S)
      ]);
      return O ? [O, V] : [V];
    }) : r("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function wu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e || []) {
    if (!Yr(n)) continue;
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
function Nu({
  drafts: e,
  processing: t,
  error: n,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = qe(() => wu(e), [e]), [l, d] = K([]), c = s.reduce((b, f) => b + f.drafts.length, 0), u = fe(null);
  Ko({ confirmRef: u, cancelRef: o, confirmReady: !t && c > 0 });
  const m = (b) => d((f) => f.includes(b) ? f.filter((y) => y !== b) : [...f, b]), p = (b) => `segment-studio-publish-approved-${b.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && !t && a();
    },
    onKeyDownCapture: (b) => Pt(b, {
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
      ].flatMap(([b, f]) => [
        r("dt", { key: `${b}:label`, className: "text-secondary" }, b),
        r("dd", { key: `${b}:value`, className: "font-semibold text-foreground" }, String(f))
      ])),
      s.length ? r("div", { key: "groups", className: "space-y-2" }, s.map((b) => {
        const f = l.includes(b.key);
        return r("section", { key: b.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          r("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": f,
            "aria-controls": p(b),
            onClick: () => m(b.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: Qr(!1) }
          }, [
            r("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, f ? "▾" : "▸"),
            r("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, b.tagName),
            r(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${b.drafts.length} draft${b.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          f ? r("div", {
            key: "drafts",
            id: p(b),
            className: "divide-y divide-border border-t border-border"
          }, b.drafts.map((y) => {
            const S = y.endSec == null ? Ge(y.startSec) : `${Ge(y.startSec)} – ${Ge(y.endSec)}`, I = `${Ht(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`;
            return r("div", { key: y.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              r(Sn, { key: "review", state: y.reviewState, includeLabel: !1 }),
              r("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, S),
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
function Iu({ candidates: e, processing: t, error: n, onConfirm: o, onClose: i }) {
  const a = Md(e), [s, l] = K(() => /* @__PURE__ */ new Set()), [d, c] = K(() => new Set(a.map((y) => y.key))), u = a.flatMap((y) => d.has(y.key) ? y.candidates : []), m = (y) => l((S) => {
    const I = new Set(S);
    return I.has(y) ? I.delete(y) : I.add(y), I;
  }), p = (y) => c((S) => {
    const I = new Set(S);
    return I.has(y) ? I.delete(y) : I.add(y), I;
  }), b = (y) => y.assignment.map(({ slot: S, performer: I }) => `${S.label || `Slot ${S.sortOrder + 1}`}: ${I.name}`).join(", "), f = (y) => `segment-studio-auto-assign-${y.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (y) => {
      y.target === y.currentTarget && !t && i();
    },
    onKeyDownCapture: (y) => {
      y.key === "Enter" && y.target instanceof HTMLInputElement || Pt(y, {
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
      e.length ? r("div", { className: "space-y-3" }, a.map((y) => r("section", { key: y.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
        r("header", {
          key: "header",
          className: "flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2",
          style: { background: Qr(!1) }
        }, [
          r("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(y.key),
            disabled: t,
            onChange: () => p(y.key),
            "aria-label": `Include ${y.tagName} assignment: ${b(y)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          r("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(y.key),
            "aria-controls": f(y),
            "aria-label": `${s.has(y.key) ? "Collapse" : "Expand"} ${y.tagName} assignment: ${b(y)}`,
            onClick: () => m(y.key),
            className: "shrink-0 rounded px-1 text-sm text-secondary hover:bg-muted/50 hover:text-foreground disabled:opacity-50"
          }, s.has(y.key) ? "▾" : "▸"),
          r(
            "span",
            { key: "tag", className: "min-w-24 flex-1 truncate text-sm font-semibold text-foreground" },
            y.tagName
          ),
          r(
            "span",
            { key: "performers", className: "flex min-w-0 flex-wrap items-center gap-2" },
            y.assignment.map(({ slot: S, performer: I }) => {
              const g = S.label || `Slot ${S.sortOrder + 1}`;
              return r("span", {
                key: S.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${g}: ${I.name}`
              }, [
                r("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${g}: ${I.name}`
                }, `${g}: ${I.name}`),
                r(fr, {
                  key: "avatar",
                  performer: { id: I.performerId, name: I.name },
                  compact: !0
                })
              ]);
            })
          ),
          r(ln, { key: "states", counts: y.counts }),
          r("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(y.candidates),
            "aria-label": `Auto-Assign ${y.tagName}: ${b(y)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${y.candidates.length})`)
        ]),
        s.has(y.key) ? r(
          "div",
          { key: "segments", id: f(y), className: "divide-y divide-border/70" },
          y.candidates.map((S) => {
            const I = S.endSec == null ? Ge(S.startSec) : `${Ge(S.startSec)} – ${Ge(S.endSec)}`, g = `${Ht(S.sourceKey)}${S.confidence == null ? "" : ` · ${Math.round(S.confidence * 100)}%`}`;
            return r("div", {
              key: S.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              r(Sn, { key: "review", state: S.reviewState, includeLabel: !1 }),
              r(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                S.tagName || "Tag segment"
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
        disabled: t || u.length === 0,
        onClick: () => o(u),
        className: "rounded-md border border-violet-400/60 bg-violet-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-violet-500/30 disabled:opacity-50"
      }, t ? "Assigning…" : `Auto-Assign ${u.length} Segment${u.length === 1 ? "" : "s"}`)
    ])
  ]));
}
function Cu({ preview: e, onConfirm: t, onClose: n }) {
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
function $u({
  merge: e,
  processing: t,
  undoable: n = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = K(!1), d = fe(null);
  if (Ko({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Ge(e.endSec);
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
        `${Ge(e.startSec)} – ${c}`
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
function Tu(e) {
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
function Ru({ preview: e, loading: t, processing: n, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var m, p;
  const l = e ? e.createCount + e.linkCount : 0, d = fe(null);
  Ko({ confirmRef: d, cancelRef: i, confirmReady: !t && !n && l > 0 && !o });
  const c = ((m = e == null ? void 0 : e.outputs) == null ? void 0 : m.slice(0, 200)) || [], u = Tu(c);
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && !n && s();
    },
    onKeyDownCapture: (b) => Pt(b, {
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
        ].flatMap(([b, f]) => [
          r("dt", { key: `${b}:label`, className: "text-secondary" }, b),
          r("dd", { key: `${b}:value`, className: "font-semibold text-foreground" }, String(f))
        ])),
        e.conflictCount > 0 ? r(
          "p",
          { key: "conflicts", role: "status", className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground" },
          `${e.conflictCount} existing derivation ${e.conflictCount === 1 ? "branch was" : "branches were"} skipped because its lineage no longer matches the active rule. Resolve these through lineage maintenance.`
        ) : null,
        u.length ? r("div", { key: "outputs", className: "space-y-2" }, [
          ...u.map((b) => r("article", {
            key: b.key,
            className: "rounded-md border border-border bg-surface p-3"
          }, [
            r("div", { key: "root", className: "flex min-w-0 items-center gap-2" }, [
              r(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
                `${b.rootTagName} @ ${Ge(b.rootStartSec)}`
              ),
              r(
                "span",
                { key: "count", className: "shrink-0 text-xs font-medium text-secondary" },
                `${b.outputs.length} ${b.outputs.length === 1 ? "change" : "changes"}`
              )
            ]),
            r(
              "div",
              { key: "tree", className: "mt-2 space-y-1 border-l border-border pl-2" },
              b.outputs.map((f, y) => r("div", {
                key: `${f.ruleId}:${f.depth}:${y}`,
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
          (((p = e.outputs) == null ? void 0 : p.length) || 0) > c.length ? r(
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
function Eu({
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
  performerSlotsAvailable: m,
  selectedPerformerSlots: p,
  performerSlots: b,
  detail: f,
  video: y,
  slotButtonRef: S,
  tagSearchRef: I,
  onDetailChange: g,
  setSaveMessage: O,
  acquireSaveLock: V,
  onSlotsChanged: Q,
  onRecordHistory: E,
  onCancelQueuedReview: j,
  splitSegment: $,
  duplicateSegment: x,
  provenance: k,
  lineage: D,
  onNavigateLineageItem: F,
  tagEditing: U,
  onCancelTagEditing: T,
  detailPanelRef: _,
  onReduceSelection: Z
}) {
  var Se, we, he;
  const L = fe(null), X = fe(null), le = () => {
    var H;
    (H = X.current) == null || H.call(X), X.current = null;
  }, ae = fe(null), ve = fe(null), ce = fe(null), De = fe(null), [W, Y] = K(!1);
  be(() => {
    L.current && (L.current.scrollTop = 0), Y(!1);
  }, [t == null ? void 0 : t.id]), be(() => {
    var H, ke;
    W && ((ke = (H = ae.current) == null ? void 0 : H.querySelector("input, select, button")) == null || ke.focus({ preventScroll: !0 }));
  }, [W]);
  function pe() {
    Y(!1), requestAnimationFrame(() => {
      var H;
      return (H = S.current) == null ? void 0 : H.focus({ preventScroll: !0 });
    });
  }
  if (n.length > 1) {
    const H = !n.some((w) => w.isDerived), ke = e && m ? sc(b, n) : null, de = (ke == null ? void 0 : ke.map((w, G) => {
      var N;
      const A = n[G];
      return {
        segmentId: A.nativeSegmentId,
        itemId: A.published ? null : A.itemId,
        revision: (N = f.performerSlotRevisions) == null ? void 0 : N[A.id],
        slots: w
      };
    })) || [];
    return r(Ao.Fragment, null, [
      r(ou, {
        key: "details",
        selectedGroups: o,
        selectedSegments: n,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: _,
        onReduceSelection: Z,
        reviewable: e,
        tagEditable: H,
        slotsEditable: de.length > 0 && a == null,
        onEditSlots: () => Y(!0),
        slotButtonRef: S,
        saveMessage: i
      }),
      U && H ? r("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (w) => {
          w.target === w.currentTarget && T();
        },
        onKeyDownCapture: (w) => Pt(w, { onCancel: T })
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
          onChange: (w, G) => w == null ? T() : d(w, G == null ? void 0 : G.label),
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
      W && de.length > 0 ? r("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (w) => {
          w.target === w.currentTarget && pe();
        },
        onKeyDownCapture: (w) => {
          var A, N;
          if (!(typeof ((A = w.target) == null ? void 0 : A.closest) == "function" ? w.target.closest("input, textarea, select, [contenteditable='true']") : null) && !w.repeat && !w.ctrlKey && !w.altKey && !w.metaKey && !w.shiftKey && /^[1-9]$/.test(w.key) && ((N = De.current) != null && N.call(De, Number(w.key) - 1))) {
            w.preventDefault(), w.stopPropagation();
            return;
          }
          Pt(w, { onCancel: pe });
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
          r("button", { key: "close", type: "button", onClick: pe, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        r("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, r(eu, {
          videoId: y.id,
          targets: de,
          performerCandidates: f.performerCandidates || [],
          shortcutRef: De,
          acquireSaveLock: () => V("slots", -1),
          onSaved: async ({ beforeState: w, afterState: G }) => {
            await E(
              "performer-slots.assign",
              `Assigned performers to ${de.length} segments`,
              w,
              G
            ), pe(), await Q();
          },
          onConflict: Q
        }))
      ])) : null
    ]);
  }
  return r("div", {
    ref: (H) => {
      L.current = H, _ && (_.current = H);
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
        t != null && t.isDerived ? r(to, { key: "derived" }) : null,
        t && U ? r("div", {
          key: "tag-editor",
          ref: I,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (H) => {
            H.key === "Escape" && (H.preventDefault(), H.stopPropagation(), T());
          },
          onKeyDown: (H) => {
            oc(H, t.tagName) && (H.preventDefault(), H.stopPropagation(), d(t.tagId));
          }
        }, r(ur, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (H, ke) => H == null ? T() : d(H, ke == null ? void 0 : ke.label),
          // Until lineage loads, the projection's derived flag says whether a rule sets the tag.
          disabled: ad(s ? a ?? -1 : null, t.id, l) || (D.data ? D.data.tagReadOnly === !0 : t.isDerived === !0),
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? r("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : r("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? r("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        r("span", { key: "start" }, Ge(t.startSec)),
        t.endSec == null ? null : r("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : r("span", { key: "end" }, Ge(t.endSec))
      ]) : null,
      e && t && (u === "empty" || u === "partial") ? r("div", { key: "slots-row" }, r(Xc, { status: u })) : null,
      t && m && p.length > 0 ? r("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, r(Xa, {
        assignments: p.map((H) => {
          const ke = uc(H);
          return {
            key: String(H.slotDefinitionId),
            label: ke.label,
            performer: ke.filled ? { id: Number(H.performerId), name: ke.performer } : null,
            title: ke.title
          };
        })
      })) : null,
      i ? r("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? r(ru, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: k
    }) : null,
    t ? r("div", { key: "controls", hidden: !0 }, [
      r("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        r("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        D.loading ? r("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : D.error ? r("p", { key: "error", className: "mt-1 text-xs text-secondary" }, D.error) : D.data ? r("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          r(
            "p",
            { key: "summary" },
            `${D.data.derived ? "Derived segment" : "Root segment"} · ${D.data.componentSize} segment${D.data.componentSize === 1 ? "" : "s"} · ${D.data.integrityState}`
          ),
          (Se = D.data.parents) != null && Se.length ? r("div", { key: "parents" }, [
            r("span", { key: "label" }, "Parents: "),
            ...D.data.parents.map((H) => r("button", {
              key: H.nodeId,
              type: "button",
              onClick: () => F(H.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${H.ruleKey} ${H.ruleVersion}`))
          ]) : null,
          (we = D.data.children) != null && we.length ? r("p", { key: "children" }, `Children: ${D.data.children.length}`) : null
        ]) : r("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      r("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        r("button", { key: "apply", type: "button", disabled: s, onClick: c, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? r("button", {
          key: "slots",
          ref: S,
          type: "button",
          disabled: a != null || !m || p.length === 0,
          onClick: () => Y(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: m ? p.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, p.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        r("button", {
          key: "split",
          type: "button",
          disabled: s,
          onClick: $,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        r("button", {
          key: "duplicate",
          type: "button",
          disabled: s,
          onClick: () => x(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        r("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: s,
          onClick: () => x(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    W && e && t && m && p.length > 0 ? r("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (H) => {
        H.target === H.currentTarget && pe();
      },
      onKeyDownCapture: (H) => {
        var de, w;
        if (!(typeof ((de = H.target) == null ? void 0 : de.closest) == "function" ? H.target.closest("input, textarea, select, [contenteditable='true']") : null) && !H.repeat && !H.ctrlKey && !H.altKey && !H.metaKey && !H.shiftKey && /^[1-9]$/.test(H.key) && ((w = ce.current) != null && w.call(ce, Number(H.key) - 1))) {
          H.preventDefault(), H.stopPropagation();
          return;
        }
        Pt(H, {
          onCancel: pe,
          onConfirm: () => {
            var G;
            return (G = ve.current) == null ? void 0 : G.click();
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
        r("button", { key: "close", type: "button", onClick: pe, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      r("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, r(Zc, {
        key: `${t.id}:${f.performerSlotsRevision || f.slotRevision || ""}`,
        videoId: y.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: p,
        revision: (he = f.performerSlotRevisions) == null ? void 0 : he[t.id],
        performerCandidates: f.performerCandidates || [],
        confirmRef: ve,
        shortcutRef: ce,
        onOptimisticSave: (H) => {
          const ke = V("slots", t.id);
          if (!ke)
            return O("Wait for the current save to finish before saving performer slots."), !1;
          X.current = ke, g((de) => Gn(
            de,
            t.id,
            H
          ), y.id), O("Saving performer slots…"), pe();
        },
        onSaved: async (H, { beforeState: ke, afterState: de }) => {
          g((w) => Gn(
            w,
            t.id,
            H.slots || [],
            H.revision
          ), y.id), O("Performer slots saved.");
          try {
            await E(
              "performer-slots.assign",
              "Assigned performers",
              ke,
              de
            ), await Q(H) || j([t]);
          } finally {
            le();
          }
        },
        onRollback: async (H, ke) => {
          j([t]), g((de) => {
            var w;
            return Gn(
              de,
              t.id,
              H,
              (w = f.performerSlotRevisions) == null ? void 0 : w[t.id]
            );
          }, y.id), O(ke.message || "Unable to save performer slots.");
          try {
            ke.status === 409 && await Q();
          } finally {
            le();
          }
        },
        onConflict: Q
      }))
    ])) : null
  ]);
}
function Mu({ segments: e, shotBoundaries: t = [], segmentGroups: n, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: u, onZoomChange: m, onSelectGroup: p, onToggleGroup: b, onSelect: f, onSelectSegments: y, onSelectAll: S, onConfigureTag: I, onSeekTime: g, centerRef: O, showReviewState: V = !0, swimlaneTitleWidth: Q, onSwimlaneTitleWidthChange: E }) {
  const j = fe(null), $ = fe(null), [x, k] = K(0), [D, F] = K({ scrollTop: 0, height: 320 }), [U, T] = K(null), _ = qe(
    () => vn(e, n, o),
    [e, n, o]
  ), Z = qe(
    () => Va(o),
    [o]
  ), L = qe(() => Ho(_), [_]), X = qe(
    () => yc(L, i, Ja(L)),
    [L, i]
  ), le = qe(
    () => Ya(X.rows, Math.max(0, D.scrollTop - 24), D.height),
    [X, D]
  ), ae = Math.max(0, Number(d) || 0), ve = $l(x), ce = Fr(Q, ve), De = ce / 16, W = Il(c, ae, De), Y = xl(ae), pe = Sl(ae, Math.max(1, x - De * 16), u), Se = Y.filter((N, h) => h === 0 || h % pe === 0), we = qe(() => _.map((N) => `${N.key}:${N.trackCount}:${N.markers.map(({ segment: h, track: B }) => `${h.id}:${h.startSec}:${h.endSec ?? ""}:${B}`).join(",")}`).join("|"), [_]);
  function he() {
    const N = $.current;
    if (!N) return;
    const h = N.querySelector("[data-timeline-track]"), B = N.firstElementChild, P = h == null ? void 0 : h.getBoundingClientRect(), ee = B == null ? void 0 : B.getBoundingClientRect(), C = P && ee ? Math.max(0, P.left - ee.left) : De * 16, ue = (ee == null ? void 0 : ee.width) ?? N.scrollWidth;
    N.scrollTo({
      left: Nl(c, ae, ue, N.clientWidth, C, ya),
      behavior: "smooth"
    });
  }
  be(() => (O.current = he, () => {
    O.current === he && (O.current = null);
  })), be(() => {
    he();
  }, [u]);
  function H() {
    const N = $.current, h = X.rows.find((ue) => ue.kind === "lane" && ue.lane.markers.some(({ segment: Ne }) => Ne.id === s));
    if (!N || !h) return;
    const B = 24, P = h.top + B, ee = P + h.height;
    let C = N.scrollTop;
    P < N.scrollTop + B ? C = Math.max(0, P - B) : ee > N.scrollTop + N.clientHeight && (C = Math.max(0, ee - N.clientHeight)), C !== N.scrollTop && (N.scrollTop = C), F({ scrollTop: C, height: N.clientHeight });
  }
  be(() => {
    H();
  }, [s, we, X]), be(() => {
    const N = $.current, h = X.rows.find((ue) => ue.kind === "group" && ue.group.key === a);
    if (!N || !h) return;
    const B = 24, P = h.top + B, ee = P + h.height;
    let C = N.scrollTop;
    P < N.scrollTop + B ? C = Math.max(0, P - B) : ee > N.scrollTop + N.clientHeight && (C = Math.max(0, ee - N.clientHeight)), C !== N.scrollTop && (N.scrollTop = C), F({ scrollTop: C, height: N.clientHeight });
  }, [a, X]), be(() => {
    const N = $.current;
    if (!N || typeof ResizeObserver > "u") return;
    const h = () => {
      k(N.clientWidth), F({ scrollTop: N.scrollTop, height: N.clientHeight }), H();
    }, B = new ResizeObserver(h);
    return B.observe(N), h(), () => B.disconnect();
  }, [s, we, X]);
  function ke(N) {
    if (!(ae > 0)) return;
    const h = N.currentTarget.getBoundingClientRect(), B = Math.min(1, Math.max(0, (N.clientX - h.left) / h.width));
    g(B * ae);
  }
  function de(N) {
    const h = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let B = null;
    Object.hasOwn(h, N.key) && (B = c + h[N.key]), N.key === "Home" && (B = 0), N.key === "End" && (B = ae), B != null && (N.preventDefault(), N.stopPropagation(), g(Math.min(ae, Math.max(0, B))));
  }
  function w(N) {
    var B;
    const h = (B = j.current) == null ? void 0 : B.getBoundingClientRect();
    h && E(Fr(N.clientX - h.left, ve));
  }
  function G(N) {
    const h = N.shiftKey ? 40 : 16;
    let B = null;
    N.key === "ArrowLeft" && (B = ce - h), N.key === "ArrowRight" && (B = ce + h), N.key === "Home" && (B = 160), N.key === "End" && (B = ve), B != null && (N.preventDefault(), N.stopPropagation(), E(Fr(B, ve)));
  }
  const A = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return r("section", {
    ref: j,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    r("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      r("button", {
        key: "title",
        type: "button",
        onClick: (N) => {
          (N.metaKey || N.ctrlKey) && (N.preventDefault(), S == null || S());
        },
        onKeyDown: (N) => {
          N.key !== "Enter" && N.key !== " " || (N.preventDefault(), S == null || S());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      r("button", { key: "out", type: "button", className: A, disabled: u <= 1, onClick: () => m(_r(u - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      r("button", { key: "fit", type: "button", className: A, disabled: u === 1, onClick: () => m(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(u * 100)}%`),
      r("button", { key: "in", type: "button", className: A, disabled: u >= 8, onClick: () => m(_r(u + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      r("button", { key: "center", type: "button", className: A, onClick: he, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    r("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(ve),
      "aria-valuenow": Math.round(ce),
      "aria-valuetext": `${Math.round(ce)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (N) => {
        N.currentTarget.setPointerCapture(N.pointerId), w(N);
      },
      onPointerMove: (N) => {
        N.currentTarget.hasPointerCapture(N.pointerId) && w(N);
      },
      onKeyDown: G,
      onDoubleClick: () => E(Ot.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${ce - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, r("span", { className: "h-16 w-1 rounded-full bg-border" })),
    r("div", {
      key: "scroll",
      ref: $,
      onScroll: (N) => F({
        scrollTop: N.currentTarget.scrollTop,
        height: N.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, r("div", { style: Cl(u) }, [
      r("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${De}rem minmax(0,1fr)`, height: "1.5rem" } }, [
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
          "aria-valuetext": Ge(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: ke,
          onKeyDown: de
        }, Se.map((N, h) => r("span", {
          key: N,
          className: `absolute top-0 ${kl(h, Se.length, ae > 0 ? N / ae * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: wl(h, Se.length, ae > 0 ? N / ae * 100 : 0)
        }, Ge(N))).concat(t.map((N) => {
          const h = ae > 0 ? N.startSec / ae * 100 : 0;
          return r("button", {
            key: `shot-boundary:${N.startSec}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Ge(N.startSec)} – ${Ge(N.endSec)}`,
            title: `Shot boundary · ${N.source || "manual"} · ${Ge(N.startSec)} – ${Ge(N.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${h}%`, width: "2px" },
            onClick: (B) => {
              B.stopPropagation(), g(N.startSec);
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
            ...$i(W),
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
        style: _.length > 0 ? { height: X.height } : void 0
      }, [
        _.length > 0 ? r("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...$i(W, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        _.length === 0 ? r("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : le.map((N) => {
          var ne;
          const h = N.group, B = i.includes(h.key), P = a === h.key, ee = Qr(P, h.color);
          if (N.kind === "group") return r("div", {
            key: N.key,
            "data-segment-group": h.key,
            "data-segment-group-collapsed": B ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${De}rem minmax(0,1fr)`,
              backgroundColor: ee,
              top: N.top,
              height: N.height
            }
          }, [
            r("button", {
              key: "name",
              type: "button",
              onClick: (v) => {
                if (v.metaKey || v.ctrlKey) {
                  y(h.lanes.flatMap((R) => R.markers.map((re) => re.segment.id)));
                  return;
                }
                p(h.key), b(h.key);
              },
              "aria-expanded": !B,
              "aria-current": P ? "true" : void 0,
              "data-selected-timeline-group": P ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: Xd(h),
                backgroundColor: ee,
                // Headers are tinted by their own group colors, so selection needs the accent to stand out.
                // An outline leaves the box-shadow hover and focus rings free.
                ...P ? { outline: "1px solid var(--color-accent)", outlineOffset: "-1px" } : {}
              },
              title: `${B ? "Expand" : "Collapse"} ${h.name}`
            }, [
              r("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, B ? "▶" : "▼"),
              r("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, h.name)
            ]),
            r(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              B ? [
                r(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${h.lanes.length} swimlane${h.lanes.length === 1 ? "" : "s"} hidden`
                ),
                V ? r(ln, { key: "states", counts: h.counts }) : null
              ] : null
            )
          ]);
          const C = N.lane, ue = Qd(N.laneIndex), Ne = C.markers.some(({ segment: v }) => v.id === s);
          return r("div", {
            key: N.key,
            "data-grouped-swimlane": h.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${De}rem minmax(0,1fr)`,
              top: N.top,
              height: N.height,
              backgroundColor: ue
            }
          }, [
            r("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": Ne ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: Zd(Ne, ue, h.color),
              title: `${gr(C)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": gr(C),
              onClick: (v) => {
                (v.metaKey || v.ctrlKey) && y(C.markers.map((R) => R.segment.id));
              },
              onMouseEnter: () => T(C.key),
              onMouseLeave: () => T((v) => v === C.key ? null : v)
            }, [
              C.tagId != null ? r("button", {
                key: "configure",
                type: "button",
                onClick: (v) => {
                  v.stopPropagation(), I({ tagId: C.tagId, tagName: C.label, trigger: v.currentTarget });
                },
                "aria-label": `Configure ${C.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: U === C.key ? 1 : void 0 }
              }, "⚙") : null,
              r("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, C.label),
              (ne = C.performers) != null && ne.length ? r(Zr, {
                key: "performers",
                performers: C.performers,
                performerAssignments: C.performerAssignments
              }) : null,
              V ? r(ln, { key: "counts", counts: C.counts }) : null
            ]),
            r("div", { key: "track", className: "relative" }, C.markers.map(({ segment: v, track: R }) => {
              var gt;
              const re = vo(v.startSec, ae), se = v.endSec == null ? v.startSec : Math.max(v.startSec, v.endSec), J = Math.max(0, vo(se, ae) - re), Fe = l.includes(v.id), Re = v.id === s, $e = _o(Z.get(v.id)), Pe = v.endSec == null ? Ge(v.startSec) : `${Ge(v.startSec)} – ${Ge(v.endSec)}`, _e = (gt = qa[$e]) == null ? void 0 : gt.label;
              return r("button", {
                key: v.id,
                type: "button",
                onClick: (Be) => {
                  Be.stopPropagation(), f(v, {
                    additive: Be.metaKey || Be.ctrlKey,
                    rangeSegmentIds: Be.shiftKey ? C.markers.map((ft) => ft.segment.id) : null
                  });
                },
                "aria-pressed": Fe,
                "aria-current": Re ? "true" : void 0,
                "data-selected-timeline-marker": Re ? "true" : void 0,
                "data-selected-segment-shortcut-target": Re ? "true" : void 0,
                "aria-label": V ? `${v.tagName || "Tag segment"}${C.performerLabel ? `, ${C.performerLabel}` : ""}, ${v.reviewState}${_e ? `, ${_e}` : ""}, ${Pe}` : `${v.tagName || "Tag segment"}${C.performerLabel ? `, ${C.performerLabel}` : ""}, ${Pe}`,
                title: V ? `${v.tagName || "Tag segment"}${C.performerLabel ? ` · ${C.performerLabel}` : ""} · ${v.reviewState}${_e ? ` · ${_e}` : ""} · ${Pe}` : `${v.tagName || "Tag segment"}${C.performerLabel ? ` · ${C.performerLabel}` : ""} · ${Pe}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...V ? Vd(v.reviewState, Fe, $e, Re) : Jd(Fe, Re),
                  left: `${re}%`,
                  top: `${ec(R)}rem`,
                  width: Yd(v.endSec, J),
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
function Jo({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: n = !0,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = K(null), [l, d] = K([]), [c, u] = K(null), [m, p] = K(""), [b, f] = K(!0), [y, S] = K(null), [I, g] = K(""), [O, V] = K(!1), [Q, E] = K(!1), j = fe(null), $ = fe(0);
  be(() => {
    const _ = requestAnimationFrame(() => {
      var Z;
      return (Z = j.current) == null ? void 0 : Z.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(_);
  }, [e]), be(() => {
    const _ = new AbortController();
    return f(!0), g(""), Promise.all([
      n ? oe(`/slot-definitions/${e}`, { signal: _.signal }) : Promise.resolve(null),
      oe("/segment-groups", { signal: _.signal })
    ]).then(([Z, L]) => {
      const X = L.find((le) => (le.tags || []).some((ae) => Number(ae.tagId) === Number(e)));
      s(Z), d(L), u((X == null ? void 0 : X.id) ?? null), p(X == null ? "" : String(X.id)), V(!1), E(!1);
    }).catch((Z) => {
      Z.name !== "AbortError" && g(Z.message || "Unable to load tag configuration.");
    }).finally(() => {
      _.signal.aborted || f(!1);
    }), () => _.abort();
  }, [n, e]);
  function x(_, Z) {
    s({
      ...a,
      definitions: a.definitions.map((L, X) => X === _ ? { ...L, ...Z } : L)
    });
  }
  function k(_, Z) {
    const L = _ + Z;
    if (L < 0 || L >= a.definitions.length) return;
    const X = [...a.definitions];
    [X[_], X[L]] = [X[L], X[_]], s({
      ...a,
      definitions: X.map((le, ae) => ({ ...le, sortOrder: ae }))
    });
  }
  function D(_) {
    const Z = a.definitions[_], L = Number(Z.assignmentCount) || 0, X = L === 0 ? "" : ` and its ${L} assignment${L === 1 ? "" : "s"}`, le = Z.derivationRules || [], ae = le.length === 0 ? "" : `

Its performer slot mapping will also be removed from ${le.length === 1 ? "this derivation rule" : `these ${le.length} derivation rules`}:
${le.map((ve) => `• ${ve}`).join(`
`)}`;
    window.confirm(`Delete “${Lt(Z)}”${X}?${ae}`) && (L > 0 && V(!0), le.length > 0 && E(!0), s({
      ...a,
      definitions: a.definitions.filter((ve, ce) => ce !== _).map((ve, ce) => ({ ...ve, sortOrder: ce }))
    }));
  }
  async function F() {
    var Z;
    S("slots"), g("Saving performer slots…");
    let _;
    try {
      _ = await oe(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: O,
          confirmRemoveDerivationRuleMappings: Q,
          definitions: a.definitions.map((L, X) => {
            var le;
            return {
              id: L.id || void 0,
              label: ((le = L.label) == null ? void 0 : le.trim()) || null,
              sortOrder: X,
              genderHints: L.genderHints || []
            };
          })
        })
      }), s(_), V(!1), E(!1);
    } catch (L) {
      L.status === 409 ? (g("Performer slots changed elsewhere; current values were reloaded."), (Z = L.payload) != null && Z.current && (s(L.payload.current), V(!1), E(!1))) : g(L.message || "Unable to save performer slots."), S(null);
      return;
    }
    try {
      await o(), g("Performer slots saved.");
    } catch {
      g("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      S(null);
    }
  }
  async function U() {
    const _ = m === "" ? null : Number(m);
    if (_ !== c) {
      S("group"), g("Saving tag group…");
      try {
        await oe(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: _ })
        });
      } catch (Z) {
        g(Z.message || "Unable to assign the tag group."), S(null);
        return;
      }
      try {
        const [Z, L] = await Promise.allSettled([
          oe("/segment-groups"),
          o()
        ]);
        if (Z.status === "fulfilled") {
          d(Z.value);
          const X = Z.value.find((ae) => (ae.tags || []).some((ve) => Number(ve.tagId) === Number(e))), le = (X == null ? void 0 : X.id) ?? null;
          u(le), p(le == null ? "" : String(le));
        }
        g(
          Z.status === "fulfilled" && L.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        S(null);
      }
    }
  }
  l.find((_) => Number(_.id) === Number(c));
  const T = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (_) => {
      _.target === _.currentTarget && !y && i();
    },
    onKeyDownCapture: (_) => Pt(_, {
      onCancel: y ? void 0 : i
    })
  }, r("section", {
    ref: j,
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
        b ? null : r("label", { key: "choice", className: "block space-y-1 text-xs text-secondary" }, [
          r("span", { key: "label" }, "Assigned group"),
          r("select", {
            key: "select",
            value: m,
            disabled: y != null,
            onChange: (_) => p(_.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            r("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((_) => r("option", { key: _.id, value: String(_.id) }, _.name))
          ])
        ]),
        b ? null : r("button", {
          key: "save",
          type: "button",
          disabled: y != null || (m === "" ? null : Number(m)) === c,
          onClick: U,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, y === "group" ? "Saving…" : "Save tag group")
      ]),
      n ? r("section", { key: "slots", className: "space-y-3 border-t border-border pt-5", "aria-labelledby": "inline-tag-slots-heading" }, [
        r("div", { key: "heading" }, [
          r("h3", { key: "title", id: "inline-tag-slots-heading", className: "text-sm font-semibold text-foreground" }, "Performer slots"),
          r("p", { key: "copy", className: "text-xs text-secondary" }, "Define the ordered performer roles used by this tag.")
        ]),
        b ? r("p", { key: "loading", className: "rounded-md border border-dashed border-border p-4 text-sm text-secondary" }, "Loading performer slots…") : a ? r("div", { key: "editor", className: "space-y-3" }, [
          r("label", { key: "duplicates", className: "flex items-center gap-2 text-sm" }, [
            r("input", {
              key: "input",
              type: "checkbox",
              checked: !!a.allowSamePerformerInMultipleSlots,
              disabled: y != null,
              onChange: (_) => s({ ...a, allowSamePerformerInMultipleSlots: _.target.checked })
            }),
            r("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((_, Z) => r("article", {
            key: _.id || _._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            r("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              r("span", { key: "label" }, "Slot label"),
              r("input", {
                key: "input",
                value: _.label || "",
                disabled: y != null,
                onChange: (L) => x(Z, { label: L.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            r("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              r("legend", { key: "label" }, "Gender hints"),
              r("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, yl.map((L) => r("label", { key: L, className: "inline-flex items-center gap-1" }, [
                r("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: y != null,
                  checked: (_.genderHints || []).includes(L),
                  onChange: (X) => x(Z, {
                    genderHints: X.target.checked ? [.../* @__PURE__ */ new Set([..._.genderHints || [], L])] : (_.genderHints || []).filter((le) => le !== L)
                  })
                }),
                r("span", { key: "text" }, Xr(L))
              ])))
            ]),
            r("div", { key: "actions", className: "flex items-end gap-1" }, [
              r("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${_.assignmentCount || 0} assigned`),
              r("button", { key: "up", type: "button", disabled: y != null || Z === 0, onClick: () => k(Z, -1), className: T, "aria-label": `Move ${Lt(_)} up` }, "↑"),
              r("button", { key: "down", type: "button", disabled: y != null || Z === a.definitions.length - 1, onClick: () => k(Z, 1), className: T, "aria-label": `Move ${Lt(_)} down` }, "↓"),
              r("button", { key: "delete", type: "button", disabled: y != null, onClick: () => D(Z), className: `${T} text-red-300` }, "Delete")
            ])
          ])),
          r("div", { key: "buttons", className: "flex items-center gap-2" }, [
            r("button", {
              key: "add",
              type: "button",
              disabled: y != null,
              onClick: () => s({
                ...a,
                definitions: [...a.definitions, {
                  _clientKey: `new-${++$.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: T
            }, "Add slot"),
            r("button", {
              key: "save",
              type: "button",
              disabled: y != null,
              onClick: F,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, y === "slots" ? "Saving…" : "Save performer slots")
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
        disabled: y != null,
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
function Du(e) {
  const { acquireSaveLock: t, activeFilterCount: n, allSwimlanes: o, approvalFacetCounts: i, autoAssignCandidates: a, autoAssignError: s, autoAssignOpen: l, autoAssignPerformers: d, autoAssigning: c, cancelQueuedReviewsForSegments: u, canMoveSelectionToBin: m, captureTrainingExport: p, centerTimelineRef: b, closeEditorFilters: f, closeFirstSegmentTagDialog: y, closeMaterializeDialog: S, closeMergeConfirmation: I, closePublishApprovedDialog: g, closeTagEditing: O, collapsedSegmentGroups: V, commonActionsRef: Q, compatibilityMode: E, configuringTag: j, createSegment: $, creatingSegmentId: x, currentTime: k, deleteRejectedSegments: D, detail: F, detailPanelRef: U, detailWidth: T, duplicateSegment: _, editorFilters: Z, editorLayout: L, editorRef: X, exportingExamples: le, filtersButtonRef: ae, filtersOpen: ve, firstSegmentTagOpen: ce, focusRowRef: De, handleSeparatorKeyDown: W, handleSeparatorPointerDown: Y, handleSeparatorPointerMove: pe, hasNextUnreviewed: Se, hasPreviousUnreviewed: we, hideDerivedSegments: he, history: H, historyOpen: ke, historySaving: de, horizontalLayoutSize: w, importNativeSegments: G, incorrectExamples: A, incorrectExamplesOpen: N, lineage: h, markerRailWidth: B, materializeButtonRef: P, materializeCancelButtonRef: ee, materializeDerivedSegments: C, materializeError: ue, materializeLoading: Ne, materializeOpen: ne, materializePreview: v, materializing: R, mediaStackRef: re, mergeCancelButtonRef: se, mergeConfirmation: J, mergeSaving: Fe, mergeSelectedSwimlane: Re, nativeImportState: $e, onDetailChange: Pe, onNavigate: _e, onReload: gt, onSlotsChanged: Be, openPublishApprovedDialog: ft, panelSeparatorProps: ot, pendingInitialSeekRef: Le, performerSlots: rt, performerSlotsAvailable: St, playbackControlsRef: lt, previewDerivedSegments: ht, provenance: Xe, provenanceSources: it, publishApprovedCancelButtonRef: z, publishApprovedDrafts: te, publishApprovedError: me, publishApprovedOpen: ye, quickSearchOpen: ge, railScrollRef: Oe, railToggleRef: Me, recordHistoryAction: Qe, rejectedDeletionPreview: je, removeIncorrectExample: tt, removingExampleId: We, restoreHistoryTarget: Ae, runEditorAction: Te, saveMessage: Ze, saveTag: Ke, saveTiming: Ue, savingSegmentId: Ie, editorHeldByOtherWork: Bt, segmentCreationPending: He, selectionBusy: vt, seekRef: Dt, segmentGroups: nt, segmentRailLayout: Ee, segments: Ce, selectAllVideoSegments: dt, selectSegment: kt, selectSegmentCollection: bt, selectedGroups: qt, selectedPerformerSlots: xt, selectedSegment: Ct, selectedSegmentGroupKey: en, selectedSegmentIds: cn, selectedSegments: tn, selectedSlotStatus: zn, setAutoAssignError: _n, setAutoAssignOpen: hr, setConfiguringTag: vr, setCurrentTime: Hn, setEditorFilters: xr, setEditorLayout: qn, setFiltersOpen: un, setHideDerivedSegments: kn, setHistoryOpen: wn, setIncorrectExamplesOpen: Sr, setQuickSearchOpen: Wn, setRailViewport: no, setRejectedDeletionPreview: Vn, setSaveMessage: Jn, setSelectedSegmentGroupKey: Yn, setSelectedSegmentId: Nn, setShortcutsOpen: kr, setTimelineZoom: wr, shotBoundaries: Qn, shortcutsOpen: mn, slotButtonRef: Xn, splitLayout: Ut, splitSegment: $t, stepVideoFrame: Zn, tagEditing: er, tagSearchRef: Nr, timelineDuration: Ir, timelineRatioBounds: In, timelineZoom: tr, toggleSegmentGroup: Cr, toggleSegmentRail: ro, updateTimelineRatio: nr, video: at, videoPerformers: Cn, visibleCounts: st, visibleSegmentRailRows: wt, visibleSegments: $r, wideLayout: gn, workspaceRef: Wt } = e;
  Bd(at ? at.title || `Video ${at.id}` : null);
  const Tt = qe(
    () => Ce.filter((q) => Yr(q)),
    [Ce]
  ), Tr = dl(Oo), fn = Tt.length, $n = fe(null), rr = qe(() => () => wn(!1), [wn]), Tn = v ? v.createCount + v.linkCount : null, pn = tn.length > 0, Rn = tn.length === 1, oo = pn && tn.every((q) => q.reviewState === "approved"), io = pn && tn.every((q) => q.reviewState === "rejected"), nn = [
    // Segment edits queue behind saves of other segments; only saves of the selection, or work that
    // holds the whole editor, disable them.
    // A create already waiting would be repeated by a second press, so it waits for that one.
    { id: "marker.create", label: "New segment", disabled: Bt || He },
    // Retagging several segments at once holds the whole editor, so it waits for every save.
    { id: "marker.editTag", label: "Edit tag", disabled: vt || !pn || tn.length > 1 && Ie != null },
    { id: "marker.setStart", label: "Set start", disabled: vt || !Rn },
    { id: "marker.setEnd", label: "Set end", disabled: vt || !Rn },
    { id: "marker.split", label: "Split", disabled: vt || !Rn },
    ...E ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !we, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: oo ? "Unapprove" : "Approve", disabled: vt || !pn, tone: "approve" },
      { id: "marker.reject", label: io ? "Unreject" : "Reject", disabled: vt || !pn, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !Se, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...E ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: Ie != null || !m, tone: "reject" }
    ]
  ];
  function Yt(q) {
    const Ve = cn.includes(q.id), jt = q.id === (Ct == null ? void 0 : Ct.id), ct = q.endSec == null ? Ge(q.startSec) : `${Ge(q.startSec)} – ${Ge(q.endSec)}`, Rt = `${Ht(q.sourceKey)}${q.confidence != null ? ` · ${Math.round(q.confidence * 100)}%` : ""}`;
    return r("button", {
      key: q.id,
      type: "button",
      onClick: (Et) => kt(q, { additive: Et.metaKey || Et.ctrlKey }),
      "aria-pressed": Ve,
      "aria-current": jt ? "true" : void 0,
      "data-selected-segment-shortcut-target": jt ? "true" : void 0,
      "aria-label": E ? `${q.tagName || "Tag segment"}, ${q.reviewState}${q.isDerived ? ", derived segment" : ""}, ${ct}` : `${q.tagName || "Tag segment"}${q.isDerived ? ", derived segment" : ""}, ${ct}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: Ha(Ve, jt)
    }, [
      r("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        E ? r(Sn, { key: "review", state: q.reviewState, includeLabel: !1 }) : null,
        q.isDerived ? r(to, { key: "derived" }) : null,
        r(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          q.tagName || "Tag segment"
        ),
        r("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, ct),
        r("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: Rt
        }, Rt)
      ])
    ]);
  }
  const En = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", Mn = [...H.actions || []].reverse().find((q) => q.sequence <= H.cursorSequence);
  return r("section", {
    ref: X,
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
            onClick: (q) => ls(q, _e, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          r("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, r("a", {
            href: `/video/${at.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: at.title || `Video ${at.id}`
          }, at.title || `Video ${at.id}`)),
          ...Cn.map((q) => r(fr, {
            key: yt(q),
            performer: { id: yt(q), name: q.name },
            compact: !0,
            tooltip: q.name
          })),
          E ? r(ln, { key: "review-counts", counts: st }) : null
        ]),
        r("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          E ? null : r(us, { key: "bin", onNavigate: _e, compact: !0 }),
          r(ms, { key: "settings", onNavigate: _e, compact: !0 })
        ])
      ]),
      E && F.nativeImportCount > 0 ? r("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        r(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${F.nativeImportCount} Cove segment${F.nativeImportCount === 1 ? "" : "s"} ${F.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        $e.busy ? r("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, $e.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          r("button", {
            key: "review",
            type: "button",
            onClick: () => G("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          r("button", {
            key: "approved",
            type: "button",
            onClick: () => G("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        $e.error ? r("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, $e.error) : null
      ]) : null,
      r("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        r("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          // Run AI and any other contributed video action, rendered by the host
          // exactly as they are on a video's own page rather than reimplemented here.
          // The host queues the run and returns at once. In Full mode,
          // useSegmentAnalysis reloads the editor when Segment Studio's review
          // results for the run arrive.
          at != null && at.id ? r(Ld, {
            key: "extension-actions",
            entityType: "video",
            entityId: at.id,
            pageType: pl,
            renderMode: "toolbar"
          }) : null,
          E ? r("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: Ie != null || a.length === 0,
            onClick: () => {
              _n(""), hr(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${a.length ? ` (${a.length})` : ""}`) : null,
          E ? r("button", {
            key: "materialize-derived",
            ref: P,
            type: "button",
            disabled: Ie != null || Ne || R || Tn === 0,
            onClick: ht,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, Ne ? "Analyzing…" : `Auto-Materialize${Tn != null ? ` (${Tn})` : ""}`) : null,
          E ? r("button", {
            key: "complete-review",
            type: "button",
            disabled: Ie != null || fn === 0,
            onClick: (q) => ft(q.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": ye,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${fn ? ` (${fn})` : ""}`) : null,
          r("button", {
            key: "feedback",
            type: "button",
            disabled: le || We != null || A.length === 0,
            onClick: () => Sr(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": N,
            "aria-label": `Open AI feedback collection, ${A.length} example${A.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${A.length ? ` (${A.length})` : ""}`)
        ]),
        r("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          r("button", {
            key: "filters",
            ref: ae,
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
            disabled: (E ? H.actions.length === 0 : Mn == null) || Ie != null || de,
            onClick: E ? () => wn((q) => !q) : () => Ae(
              Mn.sequence - 1
            ),
            "aria-controls": E ? gs : void 0,
            "aria-expanded": E ? ke : void 0,
            className: En
          }, [
            r(jr, { key: "icon", name: "history" }),
            r("span", { key: "label" }, E ? `History${H.actions.length ? ` (${H.actions.length})` : ""}` : Mn ? `Undo ${Mn.label}` : "Undo")
          ]),
          r("button", {
            key: "rail",
            ref: Me,
            type: "button",
            onClick: ro,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": L.markerRailOpen,
            className: En
          }, [
            r(jr, { key: "icon", name: "list" }),
            r("span", { key: "label" }, L.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ]),
      E && ke ? r(vu, {
        key: "history-popover",
        history: H,
        historySaving: de,
        anchorRef: $n,
        onRestore: Ae,
        onClose: rr
      }) : null
    ]),
    ve ? r(hu, {
      key: "editor-filters",
      filters: Z,
      hideDerivedSegments: he,
      performers: Cn,
      provenanceSources: it,
      reviewCounts: i,
      segments: Ce,
      segmentGroups: nt,
      reviewMode: E,
      onChange: xr,
      onHideDerivedChange: kn,
      onClose: f
    }) : null,
    ce ? r(bu, {
      key: "first-segment-tag-dialog",
      saving: Ie != null,
      error: Ze,
      onSelect: (q, Ve) => $(q, Ve),
      onClose: y
    }) : null,
    ge ? r(ku, {
      key: "quick-search-dialog",
      segments: Dd(o),
      onSelect: (q) => {
        Wn(!1), kt(q, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        Wn(!1), requestAnimationFrame(() => {
          var q;
          return (q = X.current) == null ? void 0 : q.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    l ? r(Iu, {
      key: "auto-assign-dialog",
      candidates: a,
      processing: c,
      error: s,
      onConfirm: d,
      onClose: () => hr(!1)
    }) : null,
    J ? r($u, {
      key: "merge-selection-dialog",
      merge: J,
      processing: Fe,
      undoable: !E,
      cancelButtonRef: se,
      onConfirm: (q) => Re(!0, q, J),
      onClose: I
    }) : null,
    ne ? r(Ru, {
      key: "materialize-derived-dialog",
      preview: v,
      loading: Ne,
      processing: R,
      error: ue,
      cancelButtonRef: ee,
      onConfirm: C,
      onClose: () => {
        R || S();
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
        style: gn ? { position: "absolute", top: 0, right: 0, width: B, height: w.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        Ce.length === 0 ? r("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : $r.length === 0 ? r(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : r("div", {
          key: "segments",
          ref: Oe,
          onScroll: (q) => no({
            scrollTop: q.currentTarget.scrollTop,
            height: q.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, r("div", {
          className: "relative",
          style: { height: Ee.height }
        }, wt.map((q) => {
          var jt;
          let Ve;
          if (q.kind === "group") {
            const ct = V.includes(q.group.key), Rt = q.group.lanes.reduce((Et, et) => Et + et.markers.length, 0);
            Ve = r("button", {
              type: "button",
              onClick: () => {
                Yn(q.group.key), Cr(q.group.key);
              },
              "aria-expanded": !ct,
              "aria-current": en === q.group.key ? "true" : void 0,
              "data-segment-rail-group": q.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${en === q.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              r("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, ct ? "▸" : "▾"),
              r("span", { key: "name", className: "min-w-0 flex-1 truncate", title: q.group.name }, q.group.name),
              r("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Rt),
              E && ct ? r(ln, { key: "states", counts: q.group.counts }) : null
            ]);
          } else q.kind === "lane" ? Ve = r("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: gr(q.lane),
            "aria-label": gr(q.lane)
          }, [
            r("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, q.lane.label),
            (jt = q.lane.performers) != null && jt.length ? r(Zr, {
              key: "performers",
              performers: q.lane.performers,
              performerAssignments: q.lane.performerAssignments
            }) : null,
            E ? r(ln, { key: "states", counts: q.lane.counts }) : null
          ]) : Ve = Yt(q.segment);
          return r("div", {
            key: q.key,
            className: "absolute left-0 right-0",
            style: { top: q.top, height: q.height }
          }, Ve);
        })))
      ]) : null,
      r("div", { key: "review-pane", className: `${Ut ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        r("div", {
          key: "media-stack",
          ref: re,
          className: `${Ut ? "min-h-0 flex-1" : ""} grid`,
          style: Ut ? {
            gridTemplateRows: `minmax(16rem, ${(1 - L.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${L.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          r("div", {
            key: "focus-row",
            ref: De,
            className: "grid min-h-0 gap-2",
            style: gn ? {
              gridTemplateColumns: L.markerRailOpen ? `${T}px 0.5rem minmax(0,1fr) 0.5rem ${B}px` : `${T}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            r(Eu, {
              key: "tools",
              compatibilityMode: E,
              selectedSegment: Ct,
              selectedSegments: tn,
              selectedGroups: qt,
              saveMessage: Ze,
              savingSegmentId: Ie,
              selectionBusy: vt,
              creatingSegmentId: x,
              acquireSaveLock: t,
              setSaveMessage: Jn,
              saveTag: Ke,
              slotStatus: zn,
              performerSlotsAvailable: St,
              selectedPerformerSlots: xt,
              performerSlots: rt,
              detail: F,
              onDetailChange: Pe,
              onCancelQueuedReview: u,
              video: at,
              slotButtonRef: Xn,
              tagSearchRef: Nr,
              tagEditing: er,
              onCancelTagEditing: O,
              detailPanelRef: U,
              onReduceSelection: (q) => {
                kt(q), requestAnimationFrame(() => {
                  var Ve;
                  return (Ve = U.current) == null ? void 0 : Ve.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Ue,
              onSlotsChanged: Be,
              onRecordHistory: Qe,
              splitSegment: $t,
              duplicateSegment: _,
              provenance: Xe,
              lineage: h,
              onNavigateLineageItem: (q) => {
                const Ve = Ce.find((jt) => jt.itemId === q);
                Ve && Nn(Ve.id);
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
              r("div", { className: "h-full min-h-0 w-full" }, r(ia, {
                streamUrl: `/api/stream/video/${at.id}`,
                posterUrl: `/api/stream/video/${at.id}/screenshot?v=${encodeURIComponent(at.updatedAt || "")}`,
                format: at.videoFile.format,
                audioCodec: at.videoFile.audioCodec,
                duration: at.videoFile.duration,
                videoId: at.id,
                trackingEnabled: !1,
                onSeekRegister: (q) => {
                  Dt.current = q, Rd(Le.current, Ce, q) && (Le.current = null);
                },
                onPlaybackControlRegister: (q) => {
                  lt.current = q;
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
            ref: Q,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...nn.map((q) => {
              var ct;
              const Ve = (ct = Tr[q.id]) == null ? void 0 : ct[0], jt = q.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : q.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return r("button", {
                key: q.id,
                type: "button",
                disabled: q.disabled,
                "data-action-id": q.id,
                onClick: (Rt) => {
                  const Et = Rt.currentTarget;
                  Te(q.id, { target: Et, preserveFocus: !0 }), q.focusWhenDisabled && requestAnimationFrame(() => {
                    Au(Et, Q.current, q.focusWhenDisabled);
                  });
                },
                title: Ve ? `${q.label} (${Ve})` : q.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${jt}`
              }, [
                r("span", { key: "label" }, q.label),
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
                onClick: () => Zn(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, r(ml, { className: "h-4 w-4", "aria-hidden": !0 })),
              r("button", {
                key: "next-frame",
                type: "button",
                disabled: !at.videoFile,
                onClick: () => Zn(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, r(gl, { className: "h-4 w-4", "aria-hidden": !0 }))
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
            onPointerDown: Y,
            onPointerMove: pe,
            onKeyDown: W,
            onDoubleClick: () => nr(Ot.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, r("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          r("div", { key: "timeline", className: "min-h-0", style: Ut ? void 0 : { height: "20rem" } }, r(Mu, {
            segments: $r,
            shotBoundaries: Qn,
            segmentGroups: nt,
            performerSlots: rt,
            collapsedGroupKeys: V,
            selectedGroupKey: en,
            selectedSegmentId: Ct == null ? void 0 : Ct.id,
            selectedSegmentIds: cn,
            duration: Ir,
            currentTime: k,
            zoom: tr,
            onZoomChange: wr,
            onSelectGroup: Yn,
            onToggleGroup: Cr,
            onSelect: (q, Ve) => kt(q, Ve),
            onSelectSegments: bt,
            onSelectAll: dt,
            onConfigureTag: (q) => vr(q),
            onSeekTime: (q) => {
              var Ve;
              return (Ve = Dt.current) == null ? void 0 : Ve.call(Dt, q, !1);
            },
            centerRef: b,
            showReviewState: E,
            swimlaneTitleWidth: L.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (q) => qn((Ve) => ({ ...Ve, swimlaneTitleWidth: q }))
          }))
        ])
      ])
    ]),
    j ? r(Jo, {
      key: `configure-tag:${j.tagId}`,
      tagId: j.tagId,
      tagName: j.tagName,
      performerSlotsEnabled: E,
      onSaved: gt,
      onClose: () => {
        const q = j.trigger;
        vr(null), requestAnimationFrame(() => {
          var Ve;
          q != null && q.isConnected ? q.focus({ preventScroll: !0 }) : (Ve = X.current) == null || Ve.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    ye ? r(Nu, {
      key: "publish-approved-dialog",
      drafts: Tt,
      processing: Ie === -1,
      error: me,
      cancelButtonRef: z,
      onConfirm: te,
      onClose: g
    }) : null,
    je ? r(Cu, {
      key: "rejected-deletion-dialog",
      preview: je,
      onConfirm: () => {
        D(je), requestAnimationFrame(() => {
          var q;
          return (q = X.current) == null ? void 0 : q.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Vn(null), requestAnimationFrame(() => {
          var q;
          return (q = X.current) == null ? void 0 : q.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    mn ? r(xu, {
      key: "shortcuts-dialog",
      reviewMode: E,
      bindings: Tr,
      onClose: () => kr(!1)
    }) : null,
    N ? r(Su, {
      key: "incorrect-examples-dialog",
      examples: A,
      exporting: le,
      removingExampleId: We,
      onExport: p,
      onRemove: tt,
      onClose: () => Sr(!1)
    }) : null
  ]);
}
function Ou(e) {
  const { allSwimlanes: t, editorRef: n, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: u, setCollapsedSegmentGroups: m, setEditorFilters: p, setHideDerivedSegments: b, setSaveMessage: f, setSelectedSegmentGroupKey: y, setSelectedSegmentId: S, setSelectedSegmentIds: I } = e;
  function g(j) {
    const $ = zt(t, j);
    $ && m((x) => Za(x, $));
  }
  function O(j) {
    S(j), I(j == null ? [] : [j]), c.current = j, u.current = [];
  }
  function V(j, {
    focusEditor: $ = !1,
    seekToSegment: x = !1,
    additive: k = !1,
    rangeSegmentIds: D = null
  } = {}) {
    var U, T;
    const F = Kl({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: u.current
    }, j.id, D, k);
    I(F.selectedSegmentIds), S(F.activeSegmentId), c.current = F.anchorSegmentId, u.current = F.rangeBaseSegmentIds, F.activeSegmentId != null && y(zt(t, F.activeSegmentId)), g(j.id), $ && ((U = n.current) == null || U.focus({ preventScroll: !0 })), x && ((T = i.current) == null || T.call(i, j.startSec, !1));
  }
  function Q(j) {
    const $ = Bl(
      d,
      l,
      j
    );
    I($.selectedSegmentIds), S($.activeSegmentId), c.current = $.activeSegmentId, u.current = [], $.activeSegmentId != null && (y(zt(t, $.activeSegmentId)), g($.activeSegmentId));
  }
  function E() {
    var x;
    const j = _l(s), $ = j.includes(l) ? l : j[0] ?? null;
    p(Gt({})), b(!1), I(j), S($), c.current = $, u.current = [], $ != null && y(zt(
      vn(s, a, o),
      $
    )), f(j.length === 0 ? "There are no segments to select." : `${j.length} segments selected. Collapsed Segment groups keep their selected segments.`), (x = n.current) == null || x.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: g, replaceSegmentSelection: O, selectSegment: V, selectSegmentCollection: Q, selectAllVideoSegments: E };
}
function Pu(e) {
  const { acceptHistory: t, acquireSaveLock: n, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, pendingChanges: c, stableSaveIdentity: u, historyRef: m, onConflict: p, onDetailChange: b, onReload: f, recordHistoryAction: y, revealSegmentGroupForSelection: S, savingSegmentId: I, selectedGroups: g, selectedSegment: O, selectedSegmentIdRef: V, selectedSegments: Q, selectionAnchorIdRef: E, selectionRangeBaseIdsRef: j, setMergeConfirmation: $, setSaveMessage: x, setSelectedSegmentId: k, setSelectedSegmentIds: D, video: F } = e;
  function U() {
    $(null), requestAnimationFrame(() => {
      var L;
      return (L = a.current) == null ? void 0 : L.focus({ preventScroll: !0 });
    });
  }
  async function T(L = !1, X = !1, le = null) {
    if (I != null) return;
    const ae = le || Qa(
      g,
      { nativeOnly: !o }
    );
    if (!ae) {
      x("Select at least two segments from one swimlane.");
      return;
    }
    if (!L && va()) {
      $(ae);
      return;
    }
    X && xa(!1);
    const ve = ae.endSec == null ? "open end" : Ge(ae.endSec);
    let ce = ae.segments[0];
    const De = o ? null : Ft(ae.segments, !1), W = o ? null : crypto.randomUUID(), Y = ae.segments.map((H) => H.id), pe = Mc(i, ae.segments).segments.find((H) => H.id === ce.id), Se = {
      startSec: pe.startSec,
      endSec: pe.endSec,
      sourceKey: pe.sourceKey,
      sourceRunId: pe.sourceRunId,
      confidence: pe.confidence,
      isDerived: pe.isDerived
    }, we = n("merge", ae.segments[0].id);
    if (!we) return;
    U();
    const he = Mt();
    s({
      type: "add",
      entry: { id: he, op: "merge", targets: ae.segments.map(pt), values: Se }
    }), D([ce.id]), k(ce.id), E.current = ce.id, j.current = [];
    try {
      const H = ae.segments.slice(1);
      if (!o || ce.nativeSegmentId != null) {
        const ke = H.map((w) => {
          const G = `merge-native-selection:${F.id}:${ce.id}:${w.id}:${ce.updatedAt}:${w.updatedAt}`;
          return { key: G, operationId: Je(G), segmentId: w.id, expectedUpdatedAt: w.updatedAt };
        }), de = await oe(`/videos/${F.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: ce.id,
            expectedSurvivorUpdatedAt: ce.updatedAt,
            consumedSegments: ke.map(({ key: w, ...G }) => G),
            historyReceiptId: W
          })
        });
        ce = de.survivor, b((w) => qi(w, de), F.id), s({ type: "confirm", key: he, applied: !0 }), ke.forEach(({ key: w }) => Ye(w));
      } else {
        const ke = H.map((w) => {
          const G = `merge-draft-selection:${F.id}:${ce.itemId}:${w.itemId}:${ce.revision}:${w.revision}`;
          return { key: G, operationId: Je(G), itemId: w.itemId, expectedRevision: w.revision };
        }), de = await oe(`/videos/${F.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: ce.itemId,
            expectedSurvivorRevision: ce.revision,
            consumedDrafts: ke.map(({ key: w, ...G }) => G)
          })
        });
        ce = de.survivor, b((w) => qi(w, de), F.id), s({ type: "confirm", key: he, applied: !0 }), ke.forEach(({ key: w }) => Ye(w));
      }
      D([ce.id]), k(ce.id), E.current = ce.id, j.current = [], o ? t(Xt) : await y(
        "segments.merge",
        `Merged ${ae.segments.length} segments`,
        De,
        Ft([ce], !1),
        W
      ), S(ce.id), x(`${ae.segments.length} segments merged into ${Ge(ae.startSec)} – ${ve}.`);
    } catch (H) {
      s({ type: "discard", key: he }), D(Y), k((O == null ? void 0 : O.id) ?? Y[0] ?? null), E.current = (O == null ? void 0 : O.id) ?? Y[0] ?? null, j.current = [], H.status === 409 ? await p() : x(H.message || "Unable to merge selected segments.");
    } finally {
      we();
    }
  }
  function _(L, X = Q, le = O) {
    if (X.length === 0) return Promise.resolve(null);
    const ae = td(L, X, le), ve = Math.max(0, ae.identities.indexOf(ae.activeIdentity)), ce = d(), De = ts(ce) != null || ce.queued.some((H) => eo(H.targets, ae.identities.map(u))), W = Wo(X, (c || []).filter((H) => H.op !== "insert")), Y = Oi(W, L), pe = W.filter((H) => H.reviewState !== Y).map(pt), Se = pe.length > 0 ? Mt() : null;
    Se && s({
      type: "add",
      entry: { id: Se, op: "patch", targets: pe, values: { reviewState: Y } }
    });
    const we = () => {
      Se && s({ type: "discard", key: Se });
    }, he = l({
      kind: "review",
      lockId: ae.activeIdentity.id,
      targets: ae.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (H) => (we(), Z(H, {
        ...ae,
        identities: H.targets,
        activeIdentity: H.targets[ve]
      }))
    });
    return he ? (De && x(`${L === "approved" ? "Approval" : "Rejection"} queued…`), he.done.then((H) => (H.status !== "fulfilled" && we(), H))) : (we(), x("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function Z({ detail: L, segments: X, onConflict: le, onReload: ae }, ve) {
    var de;
    const ce = nd(ve, X);
    if (!ce) {
      x("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: De, selectedSegments: W, selectedSegment: Y } = ce, pe = Oi(W, De), Se = W.filter((w) => w.reviewState !== pe);
    if (Se.length === 0) return;
    const we = W.map((w) => ({
      id: w.id,
      itemId: w.itemId,
      nativeSegmentId: w.nativeSegmentId
    })), he = we.find((w) => w.id === (Y == null ? void 0 : Y.id)) || we[0], H = (w, G = !1) => {
      if (!(w != null && w.segments) || !G && !wo(V.current, he.id))
        return;
      const A = we.map((h) => mt(w == null ? void 0 : w.segments, h)).filter(Boolean), N = mt(w == null ? void 0 : w.segments, he) || A[0] || null;
      D(A.map((h) => h.id)), k((N == null ? void 0 : N.id) ?? null), E.current = (N == null ? void 0 : N.id) ?? null, j.current = [];
    };
    x(`Updating ${Se.length} selected segment${Se.length === 1 ? "" : "s"}…`);
    const ke = Mt();
    s({
      type: "add",
      entry: { id: ke, op: "patch", targets: Se.map(pt), values: { reviewState: pe } }
    });
    try {
      const w = await oe(`/videos/${F.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: m.current.revision,
          reviewState: pe,
          segments: W.map((h) => h.published ? {
            nativeSegmentId: h.nativeSegmentId,
            expectedUpdatedAt: h.updatedAt
          } : {
            itemId: h.itemId,
            expectedRevision: h.revision
          })
        })
      }), G = new Map((w.items || []).map((h) => [
        h.requestedNativeSegmentId != null ? `native:${h.requestedNativeSegmentId}` : `item:${h.requestedItemId}`,
        h
      ]));
      if (we.forEach((h) => {
        const B = G.get(h.nativeSegmentId != null ? `native:${h.nativeSegmentId}` : `item:${h.itemId}`);
        B && (h.nativeSegmentId = B.nativeSegmentId, h.itemId = B.itemId);
      }), w.history && t(w.history), pe === "rejected" && !w.editorDelta || (w.items || []).some((h) => h.requestedNativeSegmentId != null && h.nativeSegmentId !== h.requestedNativeSegmentId)) {
        const h = await ae();
        s({ type: "confirm", key: ke, applied: h != null }), H(h), x(`${w.updatedCount} selected segment${w.updatedCount === 1 ? "" : "s"} ${pe === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const N = w.editorDelta ? (h) => sn(h, w.editorDelta) : (h) => ({
        ...h,
        approvedSetVersion: w.approvedSetVersion || h.approvedSetVersion,
        segments: (h.segments || []).map((B) => {
          const P = G.get(B.nativeSegmentId != null ? `native:${B.nativeSegmentId}` : `item:${B.itemId}`);
          return P ? {
            ...B,
            id: P.nativeSegmentId != null ? P.nativeSegmentId : -P.itemId,
            itemId: P.itemId,
            nativeSegmentId: P.nativeSegmentId,
            published: P.nativeSegmentId != null,
            reviewState: pe,
            revision: P.nativeSegmentId != null ? B.revision : P.revision,
            updatedAt: P.updatedAt
          } : B;
        })
      });
      b(N, F.id), s({ type: "confirm", key: ke, applied: !0 }), H(N(L)), x(`${w.updatedCount} selected segment${w.updatedCount === 1 ? "" : "s"} ${pe === "approved" ? "approved" : pe === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (w) {
      s({ type: "discard", key: ke }), w.status === 409 && ((de = w.payload) != null && de.currentHistory) && t(w.payload.currentHistory);
      const G = w.status === 409 ? await le() : L;
      H(G, !0), x(w.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: U, mergeSelectedSwimlane: T, saveSelectedReviewState: _ };
}
function Lu(e) {
  const { acceptHistory: t, acquireSaveLock: n, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: u, detail: m, displayedSelectedSegment: p, editorFilters: b, editorRef: f, cancelSaveTasks: y, dispatchPendingChanges: S, enqueueSave: I, stableSaveIdentity: g, exportingExamples: O, hideDerivedSegments: V, incorrectExamples: Q, lineage: E, materializeButtonRef: j, materializePreview: $, materializeRestoreFocusRef: x, materializing: k, mutateSegment: D, runSegmentMutation: F, pendingChanges: U, onConflict: T, onDetailChange: _, onReload: Z, performerSlots: L, recordHistoryAction: X, refreshMaterializationPreview: le, removingExampleId: ae, revealSegmentGroupForSelection: ve, savingSegmentId: ce, segmentGroups: De, segments: W, selectedSegment: Y, selectedSegmentIdRef: pe, selectedSegments: Se, selectionAnchorIdRef: we, selectionRangeBaseIdsRef: he, setAutoAssignError: H, setAutoAssignOpen: ke, setAutoAssigning: de, setEditorFilters: w, setExportingExamples: G, setHideDerivedSegments: A, setIncorrectExamples: N, setMaterializeError: h, setMaterializeLoading: B, setMaterializeOpen: P, setMaterializePreview: ee, setMaterializing: C, setRejectedDeletionPreview: ue, setRemovingExampleId: Ne, setSaveMessage: ne, setSelectedSegmentGroupKey: v, setSelectedSegmentId: R, setSelectedSegmentIds: re, swimlanes: se, video: J } = e;
  async function Fe() {
    var Ae, Te, Ze;
    if (Se.length === 0 || !Y || ce != null) return;
    const z = Ic(Se, Q), te = z.segments;
    if (te.length === 0) return;
    const me = Se.map((Ke) => ({
      id: Ke.id,
      itemId: Ke.itemId,
      nativeSegmentId: Ke.nativeSegmentId
    })), ye = me.find((Ke) => Ke.id === Y.id) || me[0], ge = [], Oe = [];
    let Me = !1, Qe = m, je = !1;
    const tt = [], We = n("feedback", ye.id);
    if (We) {
      ne(z.action === "remove" ? `Removing ${te.length} selected incorrect example${te.length === 1 ? "" : "s"}…` : `Collecting ${te.length} selected segment${te.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const Ke = async (Ee, Ce) => {
          const dt = Ee.nativeSegmentId != null, kt = z.action === "remove" ? `incorrect-example-remove:${J.id}:${Ce == null ? void 0 : Ce.id}:${Ce == null ? void 0 : Ce.revision}:${Ce == null ? void 0 : Ce.representationRevision}` : `incorrect-example-collect:${J.id}:${dt ? `native:${Ee.nativeSegmentId}:${Ee.updatedAt}` : `item:${Ee.itemId}:${Ee.revision}`}`;
          if (z.action === "remove" && !Ce)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let bt;
          try {
            bt = z.action === "remove" ? await oe(
              `/videos/${J.id}/incorrect-examples/${Ce.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: Je(kt),
                  expectedExampleRevision: Ce.revision,
                  expectedRepresentationRevision: Ce.representationRevision
                })
              }
            ) : await oe(`/videos/${J.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Je(kt),
                nativeSegmentId: dt ? Ee.nativeSegmentId : null,
                itemId: dt ? null : Ee.itemId,
                expectedUpdatedAt: dt ? Ee.updatedAt : null,
                expectedRevision: dt ? null : Ee.revision
              })
            });
          } catch (qt) {
            throw qt.operationKey = kt, qt;
          }
          if (!Cc(z.action, bt))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return Ye(kt), bt;
        };
        for (const Ee of te) {
          const Ce = z.action === "remove" ? Q.find((dt) => dt.itemId != null && dt.itemId === Ee.itemId) : null;
          try {
            const dt = me.find((xt) => xt.id === Ee.id);
            let kt = mt(
              Qe == null ? void 0 : Qe.segments,
              dt
            ) || Ee, bt;
            try {
              bt = await Ke(kt, Ce);
            } catch (xt) {
              if (xt.status === 409 && ((Te = (Ae = xt.payload) == null ? void 0 : Ae.result) == null ? void 0 : Te.code) === "OPERATION_REPLAYED")
                Qe = await oe(
                  `/videos/${J.id}/editor`
                ), je = !0, tt.length = 0, Ye(xt.operationKey), bt = xt.payload.result;
              else {
                if (z.action !== "collect" || xt.status !== 409) throw xt;
                const Ct = await oe(
                  `/videos/${J.id}/editor`
                );
                Qe = Ct, je = !0, tt.length = 0;
                const en = mt(
                  Ct == null ? void 0 : Ct.segments,
                  dt
                );
                if (!en) throw xt;
                kt = en, bt = await Ke(kt, null);
              }
            }
            dt && bt.itemId != null && (dt.itemId = bt.itemId), Qe = sn(
              Qe,
              bt.editorDelta
            ), tt.push(bt.editorDelta);
            const qt = { segment: Ee, result: bt, example: Ce };
            ge.push(qt);
          } catch (dt) {
            if (Oe.push(dt), ![400, 404, 409].includes(dt.status)) break;
          }
        }
        if (c && ge.length > 0) {
          const Ee = z.action === "remove", Ce = ge.length;
          await X(
            Ee ? "feedback.remove" : "feedback.collect",
            Ee ? `Removed ${Ce} incorrect AI example${Ce === 1 ? "" : "s"}` : `Collected ${Ce} incorrect AI example${Ce === 1 ? "" : "s"}`,
            Or(ge, Ee),
            Or(ge, !Ee)
          ) || (Me = !0);
        }
        ge.some(({ result: Ee }) => Ee.representation === "basicNativeBin") && dr();
        const Ue = wo(
          pe.current,
          ye.id
        ), Ie = z.action === "collect" && ge.some(({ segment: Ee }) => Ee.id === ye.id), Bt = ge.map(({ segment: Ee }) => Ee.id), He = Ie ? Br(
          se,
          Gr(o, ye.id),
          { removedIds: Bt }
        ) : null, vt = Ie ? (He == null ? void 0 : He.id) ?? null : ye.id;
        Ue && Ie && (re(He ? [He.id] : []), R((He == null ? void 0 : He.id) ?? Ln), we.current = (He == null ? void 0 : He.id) ?? null, he.current = []);
        const Dt = await oe(`/videos/${J.id}/incorrect-examples`);
        N(Dt);
        const nt = Qe;
        if (_(je ? nt : (Ee) => tt.reduce(sn, Ee), J.id), Ue && wo(
          pe.current,
          vt
        )) {
          let Ee, Ce;
          Ie ? (Ce = He ? mt(nt == null ? void 0 : nt.segments, {
            id: He.id,
            itemId: He.itemId,
            nativeSegmentId: He.nativeSegmentId
          }) : null, Ee = Ce ? [Ce] : []) : (Ee = me.map((dt) => mt(nt == null ? void 0 : nt.segments, dt)).filter(Boolean), Ce = mt(nt == null ? void 0 : nt.segments, ye) || Ee[0] || null), re(Ee.map((dt) => dt.id)), R((Ce == null ? void 0 : Ce.id) ?? (Ie ? Ln : null)), we.current = (Ce == null ? void 0 : Ce.id) ?? null, he.current = [], v(Ce ? zt(o, Ce.id) : null), Ce && ve(Ce.id);
        }
        if (Oe.length > 0) {
          const Ee = ((Ze = Oe[0]) == null ? void 0 : Ze.message) || "Only segments with registered AI provenance can be collected.";
          ge.length === 0 ? ne(Ee) : z.action === "remove" ? ne(
            `Partially removed ${ge.length} of ${te.length} selected incorrect examples. ${Ee}`
          ) : ne(
            `Partially collected ${ge.length} of ${te.length} selected segments. ${Ee}`
          );
        } else if (z.action === "remove")
          ne(
            `${ge.length} incorrect example${ge.length === 1 ? "" : "s"} removed and ${ge.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const Ee = ge.filter(({ result: Ce }) => Ce.representation === "basicNativeBin").length;
          ne(Ee === ge.length ? `${ge.length} incorrect AI example${ge.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ge.length} incorrect AI example${ge.length === 1 ? "" : "s"} collected and ${ge.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        Me && ne("The change saved, but editor history could not be updated.");
      } catch (Ke) {
        ne(Ke.message || "Unable to update the selected incorrect examples.");
      } finally {
        We();
      }
    }
  }
  async function Re(z) {
    if (!z || ae != null || O) return;
    const te = n("feedback", -1);
    if (!te) {
      ne("Wait for the current save to finish before removing the incorrect example.");
      return;
    }
    try {
      await $e(z);
    } finally {
      te();
    }
  }
  async function $e(z) {
    var me, ye;
    Ne(z.id);
    const te = `incorrect-example-remove:${J.id}:${z.id}:${z.revision}:${z.representationRevision}`;
    try {
      let ge, Oe = !1;
      try {
        ge = await oe(
          `/videos/${J.id}/incorrect-examples/${z.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Je(te),
              expectedExampleRevision: z.revision,
              expectedRepresentationRevision: z.representationRevision
            })
          }
        );
      } catch (je) {
        if (je.status !== 409 || ((ye = (me = je.payload) == null ? void 0 : me.result) == null ? void 0 : ye.code) !== "OPERATION_REPLAYED")
          throw je;
        ge = je.payload.result, Oe = !0;
      }
      Ye(te);
      let Me = !0;
      if (c) {
        const tt = [{ segment: mt(m.segments, {
          itemId: z.itemId
        }) || {
          id: z.itemId == null ? null : -z.itemId,
          itemId: z.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: z.representationRevision
        }, result: ge, example: z }];
        Me = await X(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          Or(tt, !0),
          Or(tt, !1)
        );
      }
      const Qe = await oe(
        `/videos/${J.id}/incorrect-examples`
      );
      N(Qe), Oe ? await Z() : _(
        (je) => sn(je, ge.editorDelta),
        J.id
      ), z.representation === "basicNativeBin" && dr(), ne(Me ? Oe ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : z.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (ge) {
      ge.status === 409 && await T(), ne(ge.message || "Unable to remove the incorrect example.");
    } finally {
      Ne(null);
    }
  }
  async function Pe() {
    if (O || ae != null || Q.length === 0) return;
    G(!0);
    const z = `incorrect-example-export:${J.id}:${Q.map((te) => `${te.id}:${te.revision}:${te.representationRevision}`).join(",")}`;
    try {
      const te = await Tc(
        J.id,
        Q
      ), me = new FormData();
      me.append("metadata", JSON.stringify({
        operationId: Je(z),
        examples: te.captures
      }));
      for (const je of te.files)
        me.append(je.fieldName, je.file);
      const ye = await oe(
        `/videos/${J.id}/incorrect-examples/export`,
        { method: "POST", body: me }
      ), ge = await _d(ye.downloadUrl), Oe = URL.createObjectURL(ge.blob), Me = document.createElement("a");
      Me.href = Oe, Me.download = ge.fileName, Me.click(), setTimeout(() => URL.revokeObjectURL(Oe), 1e3);
      const Qe = await oe(
        `/training-exports/${ye.id}/complete`,
        { method: "POST" }
      );
      Ye(z), N(await oe(
        `/videos/${J.id}/incorrect-examples`
      )), ne(
        `Downloaded ${ye.exampleCount} incorrect example${ye.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Qe.clearedExampleCount} from the working collection.`
      );
    } catch (te) {
      ne(te.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      G(!1);
    }
  }
  async function _e(z = null) {
    const te = W.filter((Te) => Te.reviewState === "rejected"), me = te.length, ye = Q.some((Te) => Te.representation === "fullItem");
    if (z == null && me === 0 && !ye) {
      ne("There are no rejected segments to delete.");
      return;
    }
    if (z == null) {
      const Te = n("delete-rejected", -1);
      if (!Te) return;
      ne("Preparing deletion summary…");
      try {
        const Ze = await oe(`/videos/${J.id}/rejected/deletion/preview`, { method: "POST" }), Ke = Number(Ze.deletedSegmentCount) || 0, Ue = Number(Ze.deferredRejectedSegmentCount) || 0, Ie = Number(Ze.protectedIncorrectExampleCount) || 0;
        if (Ke === 0) {
          Ue > 0 ? ne(
            `${Ue} feedback-protected rejected segment${Ue === 1 ? "" : "s"} kept. ${Ie} AI feedback example${Ie === 1 ? "" : "s"} must be exported before ${Ue === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : ne("There are no rejected segments to delete.");
          return;
        }
        if (!Ua(Ze, ne)) return;
        ue(Ze), ne("");
      } catch (Ze) {
        ne(Ze.message || "Unable to prepare rejected segment deletion.");
      } finally {
        Te();
      }
      return;
    }
    const ge = z, Oe = Number(ge.deferredRejectedSegmentCount) || 0, Me = pe.current, Qe = te.map((Te) => Te.id), je = Oe === 0 && Qe.includes(Me), tt = je ? Br(
      se,
      Gr(o, Me),
      { removedIds: Qe }
    ) : null, We = n("delete-rejected", -1);
    if (!We) return;
    ue(null), ne("Deleting rejected segments…");
    const Ae = Oe === 0 ? Mt() : null;
    Ae && S({
      type: "add",
      entry: { id: Ae, op: "remove", targets: te.map(pt) }
    }), je && (re(tt ? [tt.id] : []), R((tt == null ? void 0 : tt.id) ?? Ln), we.current = (tt == null ? void 0 : tt.id) ?? null, he.current = []);
    try {
      const Te = `rejected-dependency-delete:${J.id}:${ge.fingerprint}`, Ze = await oe(`/videos/${J.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(Te),
          fingerprint: ge.fingerprint
        })
      });
      Ye(Te);
      const Ke = await Z();
      Ae && S({ type: "confirm", key: Ae, applied: Ke != null }), Ze.deletedSegmentCount > 0 && t(Xt);
      const Ue = Oe > 0 ? ` ${Oe} feedback-protected rejected segment${Oe === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      ne(`${Ze.deletedSegmentCount} segment${Ze.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Ue}`);
    } catch (Te) {
      Ae && S({ type: "discard", key: Ae }), je && (re(Me == null ? [] : [Me]), R(Me), we.current = Me, he.current = []), ne(Te.message || "Unable to delete rejected segments.");
    } finally {
      We();
    }
  }
  async function gt(z = i) {
    if (a || z.length === 0) return;
    const te = n("auto-assign", -1);
    if (!te) {
      H("Wait for the current save to finish before assigning performers.");
      return;
    }
    try {
      await Be(z);
    } finally {
      te();
    }
  }
  async function Be(z) {
    de(!0), H("");
    try {
      const te = await oe(`/videos/${J.id}/segments/auto-assign-performer-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeSegmentIds: z.flatMap((me) => me.nativeSegmentId == null ? [] : [me.nativeSegmentId]),
          itemIds: z.flatMap((me) => me.published || me.itemId == null ? [] : [me.itemId])
        })
      });
      ke(!1), await Z(), ne(`${te.assignedSegmentCount} segment${te.assignedSegmentCount === 1 ? "" : "s"} received ${te.assignedSlotCount} performer-slot assignment${te.assignedSlotCount === 1 ? "" : "s"}.`);
    } catch (te) {
      H(te.message || "Unable to auto-assign performers.");
    } finally {
      de(!1);
    }
  }
  async function ft() {
    P(!0), h(""), !$ && (B(!0), le());
  }
  function ot() {
    x.current = !0, P(!1), requestAnimationFrame(() => {
      var z;
      return (z = j.current) == null ? void 0 : z.focus({ preventScroll: !0 });
    });
  }
  async function Le() {
    if (!$ || k || $.createCount + $.linkCount === 0)
      return;
    const z = n("materialize", -1);
    if (!z) {
      h("Wait for the current save to finish before materializing derived segments.");
      return;
    }
    try {
      await rt();
    } finally {
      z();
    }
  }
  async function rt() {
    C(!0), h("");
    let z;
    try {
      const te = `materialize-derived:${J.id}:${$.fingerprint}`;
      z = await oe(`/videos/${J.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(te),
          fingerprint: $.fingerprint,
          maxDepth: 3
        })
      }), Ye(te);
    } catch (te) {
      te.status === 409 && ee(null), h(te.message || "Unable to materialize derived segments."), C(!1);
      return;
    }
    ee((te) => te && { ...te, createCount: 0, linkCount: 0 });
    try {
      await Z(), ot(), ee(null);
      const te = z.createdCount + z.linkedCount;
      ne(`${z.createdCount} derived segment${z.createdCount === 1 ? "" : "s"} created and ${z.linkedCount} existing segment${z.linkedCount === 1 ? "" : "s"} linked.`), te === 0 && ne("Every applicable derivation was already materialized.");
    } catch {
      h("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    C(!1);
  }
  async function St(z, te = null) {
    var Me, Qe, je, tt;
    const me = {
      tagId: z,
      ...te ? { tagName: te } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (Se.length > 1) {
      const We = Se.filter((Ie) => Ie.tagId !== z);
      if (We.length === 0) {
        d();
        return;
      }
      const Ae = Se.map((Ie) => ({
        id: Ie.id,
        itemId: Ie.itemId,
        nativeSegmentId: Ie.nativeSegmentId
      })), Te = Se.map((Ie) => !c || Ie.nativeSegmentId != null ? `native:${Ie.nativeSegmentId}:${Ie.updatedAt}` : `item:${Ie.itemId}:${Ie.revision}`).sort().join(","), Ze = `bulk-tag:${J.id}:${z}:${Te}`, Ke = n("tag", (Y == null ? void 0 : Y.id) ?? We[0].id);
      if (!Ke) return;
      ne(`Changing tag for ${We.length} selected segment${We.length === 1 ? "" : "s"}…`);
      const Ue = Mt();
      S({
        type: "add",
        entry: { id: Ue, op: "patch", targets: We.map(pt), values: me }
      }), d();
      try {
        const Ie = c ? null : crypto.randomUUID();
        await oe(`/videos/${J.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Je(Ze),
            tagId: z,
            historyReceiptId: Ie,
            segments: Se.map((nt) => {
              const Ee = !c || nt.nativeSegmentId != null;
              return {
                nativeSegmentId: Ee ? nt.nativeSegmentId : null,
                itemId: Ee ? null : nt.itemId,
                expectedUpdatedAt: Ee ? nt.updatedAt : null,
                expectedRevision: Ee ? null : nt.revision
              };
            })
          })
        }), Ye(Ze);
        const Bt = Ft(
          Se,
          c
        ), He = await Z();
        S({ type: "confirm", key: Ue, applied: He != null });
        const vt = Ae.map((nt) => mt(He == null ? void 0 : He.segments, nt)).filter(Boolean);
        await X(
          "segments.tag",
          `Changed tag for ${We.length} segment${We.length === 1 ? "" : "s"}`,
          Bt,
          Ft(vt, c),
          Ie
        );
        const Dt = Ae.map((nt) => mt(He == null ? void 0 : He.segments, nt)).filter(Boolean);
        re(Dt.map((nt) => nt.id)), R(((Me = Dt.find((nt) => nt.id === (Y == null ? void 0 : Y.id))) == null ? void 0 : Me.id) ?? ((Qe = Dt[0]) == null ? void 0 : Qe.id) ?? null), d(), ne(`${We.length} selected segment${We.length === 1 ? "" : "s"} retagged.`);
      } catch (Ie) {
        S({ type: "discard", key: Ue });
        const Bt = Ae.map((vt) => mt(m.segments, vt)).filter(Boolean), He = mt(m.segments, {
          id: Y == null ? void 0 : Y.id,
          itemId: Y == null ? void 0 : Y.itemId,
          nativeSegmentId: Y == null ? void 0 : Y.nativeSegmentId
        }) || Bt[0] || null;
        re(Bt.map((vt) => vt.id)), R((He == null ? void 0 : He.id) ?? null), we.current = (He == null ? void 0 : He.id) ?? null, he.current = [], Ie.status === 409 && await T(), ne(Ie.message || "Unable to change the selected segment tags.");
      } finally {
        Ke();
      }
      return;
    }
    if (Se.length !== 1 || !Y) return;
    const ye = ns(U, Y);
    if (Y.id === u || ye) {
      const We = ye ? { segmentId: Y.id, tagId: ye.values.tagId, tagName: ye.meta.tagName } : null, Ae = sd(We, Y, z, te);
      if (Ae && !lt(Y, Ae)) {
        d();
        return;
      }
      if (ye && (y((Te) => {
        var Ze;
        return ((Ze = Te.meta) == null ? void 0 : Ze.pendingChangeId) === ye.id;
      }), S({ type: "discard", key: ye.id })), Ae) {
        const Te = Sa(
          { ...Y, tagId: Ae.tagId },
          L,
          b,
          V,
          De
        );
        w(Te.filters), A(Te.hideDerivedSegments), ne("Tag change queued…");
      } else ye && ne("");
      d();
      return;
    }
    if (z === Y.tagId) {
      d();
      return;
    }
    let ge = ((je = E.data) == null ? void 0 : je.children) ?? null;
    if (ge == null && E.loading && Y.itemId != null) {
      d();
      try {
        const We = await oe(`/videos/${J.id}/items/${Y.itemId}/metadata`);
        ge = ((tt = We == null ? void 0 : We.lineage) == null ? void 0 : tt.children) ?? null;
      } catch {
      }
    }
    if (Y.itemId != null && (ge == null ? void 0 : ge.length) > 0) {
      const We = n("lineage-tag", Y.id);
      if (!We) {
        ne("Wait for the current save to finish, then choose the tag again.");
        return;
      }
      ne("Checking lineage impact…");
      let Ae = null;
      try {
        const Te = await oe(`/items/${Y.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: Y.revision, tagId: z })
        }), Ze = Te.deletedItemIds.length > 0 || Te.removedEdgeIds.length > 0;
        if (Ze && !window.confirm(
          `Changing this tag removes ${Te.removedEdgeIds.length} lineage edge${Te.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${Te.deletedItemIds.length} derived segment${Te.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
        )) {
          ne("Tag change canceled.");
          return;
        }
        Ae = Mt(), S({
          type: "add",
          entry: { id: Ae, op: "patch", targets: [pt(Y)], values: me }
        }), d();
        const Ke = `tag-change:${Y.itemId}:${Y.revision}:${Te.componentFingerprint}:${z}`;
        await oe(`/items/${Y.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Je(Ke),
            expectedRevision: Y.revision,
            componentFingerprint: Te.componentFingerprint,
            tagId: z
          })
        }), Ye(Ke);
        const Ue = await Z();
        S({ type: "confirm", key: Ae, applied: Ue != null }), d(), ne(Ze ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch (Te) {
        Ae && S({ type: "discard", key: Ae }), re([Y.id]), R(Y.id), we.current = Y.id, he.current = [], Te.status === 409 ? (ne("Lineage changed — loading the latest segments…"), await T()) : ne(Te.message || "Unable to reconcile the lineage.");
      } finally {
        We();
      }
      return;
    }
    d();
    const Oe = (p == null ? void 0 : p.id) === Y.id ? p : Y;
    await D(Y, {
      startSec: Oe.startSec,
      endSec: Oe.endSec,
      tagId: z
    }, !0, null, !0, me);
  }
  function lt(z, te) {
    const me = Mt(), ye = g(pt(z));
    S({
      type: "add",
      entry: {
        id: me,
        op: "patch",
        targets: [ye],
        values: { tagId: te.tagId, tagName: te.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: te.tagName }
      }
    });
    const ge = U.find((Me) => Me.op === "insert" && Me.segment.id === z.id);
    return I({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [ye],
      dependsOn: (ge == null ? void 0 : ge.taskId) ?? null,
      meta: { pendingChangeId: me },
      ready: (Me, Qe) => {
        const je = es(Me.segments, Qe.targets[0]);
        return !je || ld(Me, je.id);
      },
      run: (Me) => ht(Me, me, te)
    }) ? !0 : (S({ type: "discard", key: me }), ne("Wait for the history restore to finish."), !1);
  }
  async function ht(z, te, me) {
    const [ye] = z.resolveTargets();
    if (!ye) {
      S({ type: "discard", key: te }), ne(`The new segment was not retagged${me.tagName ? ` to ${me.tagName}` : ""}. Choose its tag again.`);
      return;
    }
    if (ye.tagId === me.tagId) {
      S({ type: "discard", key: te });
      return;
    }
    await F(ye, {
      startSec: ye.startSec,
      endSec: ye.endSec,
      tagId: me.tagId
    }, {
      pendingChangeId: te,
      restoreSelectionOnFailure: !1,
      onReload: z.onReload,
      onConflict: z.onConflict
    }) || ne(`The new segment was not retagged${me.tagName ? ` to ${me.tagName}` : ""}. Choose its tag again.`);
  }
  async function Xe() {
    var Qe, je, tt, We;
    if (!l || !Y || ce != null) return;
    const z = [...Se].sort((Ae, Te) => Number(Ae.nativeSegmentId ?? Ae.id) - Number(Te.nativeSegmentId ?? Te.id)), te = new Set(z.map((Ae) => Ae.id)), me = z.map((Ae) => `${Ae.nativeSegmentId ?? Ae.id}:${Ae.updatedAt}`).join("|"), ye = n("bin", Y.id);
    if (!ye) return;
    ne(`Moving ${z.length} segment${z.length === 1 ? "" : "s"} to recycling bin…`);
    const ge = `bulk-move:${J.id}:${me}`, Oe = Je(ge), Me = c ? null : crypto.randomUUID();
    try {
      const Ae = (Ue = !1) => oe(`/videos/${J.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Oe,
          segments: z.map((Ie) => ({
            segmentId: Ie.nativeSegmentId ?? Ie.id,
            expectedUpdatedAt: Ie.updatedAt
          })),
          discardMissingImage: Ue,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: Me
        })
      });
      let Te;
      try {
        Te = await Ae(
          Go(ge)
        );
      } catch (Ue) {
        if (((Qe = Ue.payload) == null ? void 0 : Qe.code) !== "missing-image" || !window.confirm(`${Ue.message}

Continue and discard the missing image reference?`)) throw Ue;
        Bo(ge), Te = await Ae(!0);
      }
      Ye(ge), dr();
      const Ze = new Map((Te.items || []).map((Ue) => [
        Number(Ue.segmentId),
        Ue
      ]));
      await X(
        "segments.moveToBin",
        `Moved ${z.length} segment${z.length === 1 ? "" : "s"} to recycling bin`,
        Ft(z, !1),
        Ft(z.map((Ue) => {
          const Ie = Ze.get(
            Number(Ue.nativeSegmentId ?? Ue.id)
          );
          return {
            ...Ue,
            recycleBinItemId: (Ie == null ? void 0 : Ie.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (Ie == null ? void 0 : Ie.revision) ?? null
          };
        }), !1),
        Me
      );
      const Ke = Br(
        se,
        Gr(o, Y.id),
        { removedIds: [...te] }
      );
      _((Ue) => ({
        ...Ue,
        segments: (Ue.segments || []).filter((Ie) => !te.has(Ie.id))
      }), J.id), re(Ke ? [Ke.id] : []), R((Ke == null ? void 0 : Ke.id) ?? Ln), we.current = (Ke == null ? void 0 : Ke.id) ?? null, he.current = [], Ke && (v(zt(o, Ke.id)), ve(Ke.id)), requestAnimationFrame(() => {
        var Ue;
        return (Ue = f.current) == null ? void 0 : Ue.focus({ preventScroll: !0 });
      }), ne(`Moved ${z.length} segment${z.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Ae) {
      const Te = ((je = Ae.payload) == null ? void 0 : je.code) || ((We = (tt = Ae.payload) == null ? void 0 : tt.result) == null ? void 0 : We.code);
      Ae.status === 409 && Te === "CANONICAL_SEGMENT_CHANGED" ? await T() : ne(Ae.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      ye();
    }
  }
  async function it() {
    if (!(c || s.current || ce != null)) {
      s.current = !0, ne("Checking the recycling bin…");
      try {
        const z = await oe("/bin"), te = await za(z, () => ne("Emptying the recycling bin…"));
        if (te.status === "empty") {
          ne("The recycling bin is empty.");
          return;
        }
        if (te.status === "canceled") {
          ne("The recycling bin was not emptied.");
          return;
        }
        ne(`${te.segmentCount} segment${te.segmentCount === 1 ? "" : "s"} from ${te.sceneCount} scene${te.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (z) {
        ne(z.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: Fe, removeIncorrectExample: Re, captureTrainingExport: Pe, deleteRejectedSegments: _e, autoAssignPerformers: gt, previewDerivedSegments: ft, closeMaterializeDialog: ot, materializeDerivedSegments: Le, saveTag: St, moveToBin: Xe, emptyRecyclingBin: it };
}
function ju(e) {
  const { acceptHistory: t, acquireSaveLock: n, enqueueSave: o, getSaveQueueSnapshot: i, commonActionsRef: a, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: u, history: m, historyRef: p, historySaving: b, horizontalLayoutSize: f, mediaStackHeight: y, mediaStackRef: S, onDetailChange: I, onReload: g, railToggleRef: O, recordHistoryAction: V, savingSegmentId: Q, setCollapsedSegmentGroups: E, setEditorLayout: j, setHistorySaving: $, setIncorrectExamples: x, setSaveMessage: k, shotBoundaries: D, timelineDuration: F, video: U, workspaceRef: T } = e;
  async function _(G, A, N) {
    var ee, C, ue, Ne;
    const h = G.type === "segment" ? [G] : G.segments || [], B = (A == null ? void 0 : A.type) === "segment" ? [A] : (A == null ? void 0 : A.segments) || [];
    let P = N;
    for (const [ne, v] of h.entries()) {
      const R = B[ne], re = ((ee = v.identity) == null ? void 0 : ee.nativeSegmentId) != null || ((C = v.identity) == null ? void 0 : C.published) === !0, se = ((ue = R == null ? void 0 : R.identity) == null ? void 0 : ue.recycleBinItemId) ?? ((Ne = R == null ? void 0 : R.identity) == null ? void 0 : Ne.itemId);
      let J = mt(P.segments, R == null ? void 0 : R.identity) || mt(P.segments, v.identity);
      if (!J && re && se != null && R.identity.revision != null) {
        const $e = `history-restore:${U.id}:${se}:${R.identity.revision}`;
        await oe(`/bin/${se}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Je($e),
            expectedRevision: R.identity.revision
          })
        }), Ye($e), P = await g(), J = P.segments.find((Pe) => Pe.tagId === v.values.tagId && Pe.startSec === v.values.startSec && Pe.endSec === v.values.endSec);
      }
      if (!J)
        throw new Error("A segment in this history state no longer exists.");
      if ((J.nativeSegmentId != null || J.published === !0) !== re) {
        if (re) {
          const $e = J.recycleBinItemId ?? J.itemId ?? se;
          if ($e == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Pe = `history-restore:${U.id}:${$e}:${J.revision}:${v.values.reviewState ?? "native"}`;
          await oe(`/bin/${$e}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Je(Pe),
              expectedRevision: J.revision
            })
          }), Ye(Pe);
        } else {
          const $e = `history-bin:${U.id}:${J.nativeSegmentId}:${J.updatedAt}:${v.values.reviewState}`;
          await oe(`/videos/${U.id}/segments/${J.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Je($e),
              expectedUpdatedAt: J.updatedAt,
              reviewState: v.values.reviewState
            })
          }), Ye($e);
        }
        if (P = await g(), !re)
          continue;
        if (J = mt(P.segments, v.identity) || P.segments.find(($e) => $e.tagId === v.values.tagId && $e.startSec === v.values.startSec && $e.endSec === v.values.endSec), !J)
          throw new Error("The restored segment could not be found.");
      }
      const Re = v.values;
      if (J.nativeSegmentId == null && J.itemId != null) {
        const $e = `history-draft-update:${U.id}:${J.itemId}:${J.revision}:${Re.tagId}:${Re.startSec}:${Re.endSec ?? "open"}:${Re.reviewState}`;
        await oe(`/videos/${U.id}/drafts/${J.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Je($e),
            expectedRevision: J.revision,
            ...Re
          })
        }), Ye($e);
      } else
        await oe(`/videos/${U.id}/segments/${J.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Re, expectedUpdatedAt: J.updatedAt })
        });
      P = await g();
    }
    return P;
  }
  async function Z(G, A) {
    var N;
    for (const h of G.targets || []) {
      const B = mt(A.segments, h.identity);
      if (!B)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const P = (N = A.performerSlotRevisions) == null ? void 0 : N[B.id];
      await oe(B.published ? `/videos/${U.id}/segments/${B.nativeSegmentId}/slots` : `/videos/${U.id}/drafts/${B.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: P,
          assignments: h.assignments
        })
      }), A = await g();
    }
    return A;
  }
  async function L(G, A, N) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let h = A, B = await oe(`/videos/${U.id}/incorrect-examples`);
    const P = (ee) => B.find((C) => {
      var ue;
      return C.id === ee.exampleId || ((ue = ee.collectedIdentity) == null ? void 0 : ue.itemId) != null && C.itemId === ee.collectedIdentity.itemId;
    });
    for (const [ee, C] of (G.entries || []).entries()) {
      const ue = `history-feedback:${U.id}:${N.action.sequence}:${N.direction}:${ee}`, Ne = P(C);
      if (G.collected && Ne) {
        Ye(ue);
        continue;
      }
      let ne;
      if (G.collected) {
        const v = mt(
          h.segments,
          C.collectedIdentity
        ) || mt(
          h.segments,
          C.originalIdentity
        );
        if (!v)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const R = v.nativeSegmentId != null;
        ne = await oe(`/videos/${U.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Je(ue),
            nativeSegmentId: R ? v.nativeSegmentId : null,
            itemId: R ? null : v.itemId,
            expectedUpdatedAt: R ? v.updatedAt : null,
            expectedRevision: R ? null : v.revision
          })
        });
      } else {
        if (!Ne) {
          Ye(ue);
          continue;
        }
        ne = await oe(
          `/videos/${U.id}/incorrect-examples/${Ne.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Je(ue),
              expectedExampleRevision: Ne.revision,
              expectedRepresentationRevision: Ne.representationRevision
            })
          }
        );
      }
      Ye(ue), h = sn(
        h,
        ne.editorDelta
      ), B = await oe(
        `/videos/${U.id}/incorrect-examples`
      );
    }
    return x(B), h;
  }
  async function X(G, A, N = []) {
    const h = G.state;
    if (!s && ((h == null ? void 0 : h.type) === "segment" || (h == null ? void 0 : h.type) === "segments")) {
      const P = `basic-history:${U.id}:${p.current.revision}:${G.action.sequence}:${G.direction}`, ee = await oe(`/videos/${U.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(P),
          expectedHistoryRevision: p.current.revision,
          actionSequence: G.action.sequence,
          direction: G.direction
        })
      });
      return t(ee.history), N.push(P), g();
    }
    const B = G.direction === "backward" ? G.action.afterState : G.action.beforeState;
    if ((h == null ? void 0 : h.type) === "composite") {
      let P = A;
      const ee = (B == null ? void 0 : B.type) === "composite" ? B.states || [] : [];
      for (const [C, ue] of (h.states || []).entries()) {
        const Ne = ee[C];
        P = await X({
          ...G,
          state: ue,
          action: {
            ...G.action,
            beforeState: G.direction === "backward" ? ue : Ne,
            afterState: G.direction === "backward" ? Ne : ue
          }
        }, P, N);
      }
      return P;
    }
    if ((h == null ? void 0 : h.type) === "segment" || (h == null ? void 0 : h.type) === "segments")
      return _(
        h,
        B,
        A
      );
    if ((h == null ? void 0 : h.type) === "performerSlots")
      return Z(h, A);
    if ((h == null ? void 0 : h.type) === "incorrectExamples")
      return L(h, A, G);
    if ((h == null ? void 0 : h.type) === "shots") {
      const P = fo(A.shotBoundaries || []), ee = await oe(`/videos/${U.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(`history-shots:${U.id}:${P}:${h.fingerprint}`),
          expectedFingerprint: P,
          boundaries: h.boundaries
        })
      });
      return { ...A, shotBoundaries: ee };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function le(G) {
    if (b || G === m.cursorSequence) return;
    if (Q != null) {
      k("Finish the pending saves before restoring history.");
      return;
    }
    if (_i(m, G).length === 0) return;
    const N = o({
      kind: "history",
      lockId: -1,
      exclusive: !0,
      run: (h) => ae(h.detail, G)
    });
    if (!N) {
      k("Finish the pending saves before restoring history.");
      return;
    }
    await N.done;
  }
  async function ae(G, A) {
    var h;
    const N = _i(p.current, A);
    if (N.length !== 0) {
      $(!0), k(`Restoring ${N.length} history ${N.length === 1 ? "action" : "actions"}…`);
      try {
        let B = G;
        const P = [];
        for (const C of N)
          B = await X(
            C,
            B,
            P
          );
        const ee = s ? await oe(`/videos/${U.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: p.current.revision,
            targetSequence: A
          })
        }) : p.current;
        P.forEach(Ye), t(ee), await g(), k("History restored.");
      } catch (B) {
        B.status === 409 && ((h = B.payload) != null && h.current) && t(B.payload.current), await g(), k(B.message || "Unable to restore editor history.");
      } finally {
        $(!1);
      }
    }
  }
  function ve(G) {
    j((A) => ({ ...A, timelineRatio: jo(G, y) }));
  }
  function ce(G) {
    var h, B;
    const A = (h = S.current) == null ? void 0 : h.getBoundingClientRect();
    if (!A) return;
    const N = ((B = a.current) == null ? void 0 : B.offsetHeight) || 0;
    ve(Rl(
      G.clientY,
      A.top + N,
      Math.max(0, A.height - N)
    ));
  }
  function De(G) {
    G.currentTarget.setPointerCapture(G.pointerId), ce(G);
  }
  function W(G) {
    G.currentTarget.hasPointerCapture(G.pointerId) && ce(G);
  }
  function Y(G) {
    const A = G.shiftKey ? 0.1 : 0.05;
    let N = null;
    G.key === "ArrowUp" && (N = c.timelineRatio + A), G.key === "ArrowDown" && (N = c.timelineRatio - A);
    const h = Lo(y);
    G.key === "Home" && (N = h.minimum), G.key === "End" && (N = h.maximum), N != null && (G.preventDefault(), G.stopPropagation(), ve(N));
  }
  function pe(G) {
    const A = G === "detailWidth" ? f.focusRow : f.workspace, N = f.workspace > 0 ? xo(f.workspace, 600) : 560, h = bn(c.markerRailWidth, N), B = G === "detailWidth" ? 344 + (c.markerRailOpen ? h + 24 : 0) : 600;
    return A > 0 ? xo(A, B) : 560;
  }
  function Se(G, A) {
    j((N) => ({ ...N, [G]: bn(A, pe(G)) }));
  }
  function we(G, A) {
    var h, B;
    const N = A === "detailWidth" ? (h = u.current) == null ? void 0 : h.getBoundingClientRect() : (B = T.current) == null ? void 0 : B.getBoundingClientRect();
    N && Se(A, A === "detailWidth" ? G.clientX - N.left : N.right - G.clientX);
  }
  function he(G, A) {
    const N = pe(G), h = bn(c[G], N);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": A,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(N),
      "aria-valuenow": Math.round(h),
      "aria-valuetext": `${Math.round(h)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (B) => {
        B.currentTarget.setPointerCapture(B.pointerId), we(B, G);
      },
      onPointerMove: (B) => {
        B.currentTarget.hasPointerCapture(B.pointerId) && we(B, G);
      },
      onKeyDown: (B) => {
        const P = B.shiftKey ? 40 : 16;
        let ee = null;
        B.key === "ArrowLeft" && (ee = G === "detailWidth" ? -P : P), B.key === "ArrowRight" && (ee = G === "detailWidth" ? P : -P);
        let C = ee == null ? null : h + ee;
        B.key === "Home" && (C = 240), B.key === "End" && (C = N), C != null && (B.preventDefault(), B.stopPropagation(), Se(G, C));
      },
      onDoubleClick: () => Se(G, Ot[G]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function H() {
    j((G) => ({ ...G, markerRailOpen: !G.markerRailOpen })), requestAnimationFrame(() => {
      var G;
      return (G = O.current) == null ? void 0 : G.focus({ preventScroll: !0 });
    });
  }
  function ke(G) {
    E((A) => A.includes(G) ? A.filter((N) => N !== G) : dn([...A, G]));
  }
  function de(G, A = !0, N = l) {
    const h = i().running != null, B = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (P) => w(P.detail, G, A, N)
    });
    return B ? (h && k(G === "split" ? "Shot boundary queued…" : "Shot merge queued…"), B.done.then((P) => P.value ?? null)) : (k("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function w(G, A, N, h) {
    var ue;
    const B = (G == null ? void 0 : G.shotBoundaries) || [], P = Number((ue = U.videoFile) == null ? void 0 : ue.duration) || F, ee = fo(B), C = `shot-${A}:${U.id}:${h.toFixed(3)}:${P.toFixed(3)}:${ee}`;
    k(A === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const Ne = await oe(`/videos/${U.id}/shot-boundaries/${A}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Je(C), timeSec: h })
      });
      return Ye(C), I((ne) => ({ ...ne, shotBoundaries: Ne }), U.id), N && await V(
        "shots.update",
        A === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: B,
          fingerprint: ee
        },
        {
          type: "shots",
          boundaries: Ne,
          fingerprint: fo(Ne)
        }
      ), k(A === "split" ? "Shot boundary added." : "Shots merged."), Ne;
    } catch (Ne) {
      return k(Ne.message || "Unable to edit shot boundaries."), null;
    }
  }
  return { applySegmentHistoryState: _, applyPerformerSlotHistoryState: Z, applyHistoryState: X, restoreHistoryTarget: le, updateTimelineRatio: ve, updateTimelineRatioFromPointer: ce, handleSeparatorPointerDown: De, handleSeparatorPointerMove: W, handleSeparatorKeyDown: Y, panelWidthMaximum: pe, updatePanelWidth: Se, handlePanelSeparatorPointer: we, panelSeparatorProps: he, toggleSegmentRail: H, toggleSegmentGroup: ke, mutateShotBoundary: de };
}
function Fu(e) {
  const { allSwimlanes: t, applyShortcutTiming: n, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, displayedSelectedSegment: d, duplicateSegment: c, editorLayout: u, editorRef: m, emptyRecyclingBin: p, lineage: b, mediaDuration: f, mergeSelectedSwimlane: y, moveToBin: S, mutateShotBoundary: I, openPublishApprovedDialog: g, playbackControlsRef: O, playbackShortcutConfig: V, saveSelectedReviewState: Q, seekRef: E, segmentGroupKeys: j, selectSegment: $, selectedSegment: x, selectedSegmentGroupForSegment: k, selectedSegmentGroupKey: D, selectedSegments: F, setCollapsedSegmentGroups: U, setIncorrectExamplesOpen: T, setQuickSearchOpen: _, setSaveMessage: Z, setSelectedSegmentGroupKey: L, setTagEditing: X, setTimelineZoom: le, shotBoundaries: ae, slotButtonRef: ve, splitSegment: ce, swimlanes: De, timelineDuration: W, toggleIncorrectExample: Y, toggleSegmentGroup: pe, updateTimelineRatio: Se, videoFrameRate: we, visibleSegments: he } = e;
  function H(w) {
    var G, A;
    (G = O.current) == null || G.pause(), (A = O.current) == null || A.seekBy(ud(w, we));
  }
  function ke(w, G) {
    if (F.length > 1 && Yl(w.id))
      return;
    let A = null;
    w.id === "video.playPause" && (A = () => {
      var h;
      return (h = O.current) == null ? void 0 : h.toggle();
    }), w.id === "video.seekSmallBackward" && (A = () => {
      var h;
      return (h = O.current) == null ? void 0 : h.seekBy(-V.smallSeekTime);
    }), w.id === "video.seekSmallForward" && (A = () => {
      var h;
      return (h = O.current) == null ? void 0 : h.seekBy(V.smallSeekTime);
    }), w.id === "video.seekMediumBackward" && (A = () => {
      var h;
      return (h = O.current) == null ? void 0 : h.seekBy(-V.mediumSeekTime);
    }), w.id === "video.seekMediumForward" && (A = () => {
      var h;
      return (h = O.current) == null ? void 0 : h.seekBy(V.mediumSeekTime);
    }), w.id === "video.seekLongBackward" && (A = () => {
      var h;
      return (h = O.current) == null ? void 0 : h.seekBy(-V.longSeekTime);
    }), w.id === "video.seekLongForward" && (A = () => {
      var h;
      return (h = O.current) == null ? void 0 : h.seekBy(V.longSeekTime);
    }), w.id === "video.playSelected" && x && (A = () => {
      var h;
      (h = E.current) == null || h.call(E, x.startSec, !0), requestAnimationFrame(() => {
        var B;
        return (B = m.current) == null ? void 0 : B.focus({ preventScroll: !0 });
      });
    }), (w.id === "video.playPreviousSegment" || w.id === "video.playNextSegment") && (A = () => {
      var B;
      const h = $o(
        De,
        x == null ? void 0 : x.id,
        w.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !h || h.id === (x == null ? void 0 : x.id) || ($(h, { focusEditor: !0, seekToSegment: !1 }), (B = E.current) == null || B.call(E, h.startSec, !0));
    }), w.id.startsWith("video.seekPercent") && (A = () => {
      var B;
      const h = Number(w.id.slice(17)) / 10;
      (B = E.current) == null || B.call(E, ql(f ?? W, h), !1);
    }), w.id === "video.jumpToSegmentStart" && x && (A = () => {
      var h;
      return (h = E.current) == null ? void 0 : h.call(E, x.startSec, !1);
    }), w.id === "video.jumpToSegmentEnd" && x && (A = () => {
      var h;
      return (h = E.current) == null ? void 0 : h.call(E, x.endSec ?? x.startSec, !1);
    }), w.id === "video.jumpToVideoStart" && (A = () => {
      var h;
      return (h = E.current) == null ? void 0 : h.call(E, 0, !1);
    }), w.id === "video.jumpToVideoEnd" && (A = () => {
      var h;
      return (h = E.current) == null ? void 0 : h.call(E, W, !1);
    }), w.id.startsWith("video.frame") && (A = () => {
      const h = w.id.includes("Small") ? "small" : w.id.includes("Medium") ? "medium" : "long", B = V[`${h}FrameStep`] * (w.id.endsWith("Backward") ? -1 : 1);
      H(B);
    }), w.id.startsWith("navigation.swimlane") && (A = () => {
      const h = w.id.slice(19).toLowerCase(), B = $o(De, x == null ? void 0 : x.id, h, s);
      B && $(B, { focusEditor: !0, seekToSegment: !1 });
    }), (w.id === "navigation.extendSwimlaneLeft" || w.id === "navigation.extendSwimlaneRight") && (A = () => {
      const h = Sc(
        t,
        x == null ? void 0 : x.id,
        w.id.endsWith("Left") ? "left" : "right"
      );
      h && $(h.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: h.segmentIds
      });
    }), (w.id === "navigation.segmentGroupUp" || w.id === "navigation.segmentGroupDown") && (A = () => {
      const h = kc(
        j,
        D ?? k,
        w.id.endsWith("Up") ? -1 : 1
      );
      h && L(h);
    }), (w.id === "navigation.previousAtPlayhead" || w.id === "navigation.nextAtPlayhead") && (A = () => {
      const h = El(he, s, w.id === "navigation.previousAtPlayhead" ? -1 : 1, x == null ? void 0 : x.id);
      h && $(h, { focusEditor: !0, seekToSegment: !1 });
    }), w.id === "navigation.nearestInCurrentSwimlane" && (A = () => {
      const h = vl(
        De,
        x == null ? void 0 : x.id,
        s
      );
      h && $(h, { focusEditor: !0, seekToSegment: !1 });
    }), w.id.includes("Unreviewed") && (A = () => {
      const h = zr(
        De,
        x == null ? void 0 : x.id,
        w.id.startsWith("navigation.previous") ? -1 : 1,
        w.id.endsWith("Global")
      );
      h && $(h, { focusEditor: !G.preserveFocus, seekToSegment: !1 });
    }), (w.id === "navigation.nextTouchingPlayhead" || w.id === "navigation.previousTouchingPlayhead") && (A = () => {
      const h = hl(De, s, w.id === "navigation.previousTouchingPlayhead" ? -1 : 1, x == null ? void 0 : x.id);
      h && $(h, { focusEditor: !0, seekToSegment: !1 });
    }), w.id === "navigation.quickSearch" && (A = () => _(!0)), (w.id === "navigation.previousShot" || w.id === "navigation.nextShot") && (A = () => {
      var B;
      const h = cd(ae, s, w.id === "navigation.previousShot" ? -1 : 1);
      h && ((B = E.current) == null || B.call(E, h.startSec, !1));
    }), w.id === "shot.split" && (A = () => I("split")), w.id === "shot.merge" && (A = () => I("merge")), w.id === "marker.create" && (A = () => a()), w.id === "marker.duplicate" && (A = () => c(!1)), w.id === "marker.duplicateAtPlayhead" && (A = () => c(!0)), w.id === "marker.split" && (A = () => ce()), w.id === "marker.editTag" && (A = () => {
      if (F.length > 1 && F.some((h) => h.isDerived)) {
        Z("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if (b.data ? b.data.tagReadOnly : x != null && x.isDerived) {
        Z("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      X(!0);
    });
    const N = (d == null ? void 0 : d.id) === (x == null ? void 0 : x.id) ? d : x;
    w.id === "marker.setStart" && x && (A = () => n(s, N.endSec)), w.id === "marker.setEnd" && x && (A = () => n(N.startSec, s)), w.id === "marker.copyTiming" && x && (A = () => {
      Z(Qc(x) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), w.id === "marker.pasteTiming" && x && (A = () => {
      const h = Yc();
      if (!h) {
        Z("No copied segment timing is available.");
        return;
      }
      n(h.startSec, h.endSec);
    }), w.id === "marker.mergeSelection" && (A = () => y()), w.id === "marker.moveToBin" && (A = () => S()), w.id === "marker.toggleIncorrectExample" && x && (A = () => Y()), w.id === "marker.openIncorrectExamples" && (A = () => T(!0)), w.id === "markerGroup.toggleCollapse" && D && (A = () => pe(D)), w.id === "markerGroup.toggleAll" && (A = () => U((h) => xc(h, j))), w.id === "marker.assignSlots" && (A = () => {
      var h;
      return (h = ve.current) == null ? void 0 : h.click();
    }), w.id === "navigation.zoomIn" && (A = () => le((h) => _r(h + 0.5))), w.id === "navigation.zoomOut" && (A = () => le((h) => _r(h - 0.5))), w.id === "navigation.resetZoom" && (A = () => le(1)), w.id === "navigation.centerPlayhead" && (A = () => {
      var h;
      return (h = o.current) == null ? void 0 : h.call(o);
    }), w.id === "layout.growSwimlanes" && (A = () => Se(u.timelineRatio + 0.05)), w.id === "layout.shrinkSwimlanes" && (A = () => Se(u.timelineRatio - 0.05)), w.id === "marker.confirm" && x && (A = () => Q("approved")), w.id === "system.publishApproved" && (A = () => g(G.target)), w.id === "marker.reject" && x && (A = () => Q("rejected")), w.id === "system.emptyBin" && (A = () => p()), w.id === "system.deleteRejected" && (A = () => l()), A && A();
  }
  function de(w, G) {
    const A = pr.find((N) => N.id === w);
    A && Bn(A, i) && ke(A, G);
  }
  return {
    executeShortcutById: de,
    stepVideoFrame: (w) => H(w < 0 ? -1 : 1)
  };
}
const Gu = 3e4;
function Bu(e) {
  return e === !0;
}
function Uu() {
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
function Ku({
  fetchRuns: e,
  onCompletedRun: t,
  windowTarget: n,
  documentTarget: o,
  intervalMs: i = Gu
}) {
  const a = Uu();
  let s = null, l = !1, d = null;
  const c = () => o.visibilityState !== "hidden";
  async function u() {
    if (!(l || !a.isActive())) {
      l = !0;
      try {
        const f = await e(a.signal);
        if (!a.isActive()) return;
        const y = (Array.isArray(f) ? f : []).filter((I) => (I == null ? void 0 : I.status) === "completed" && I.id != null).map((I) => String(I.id));
        if (s === null) {
          s = new Set(y);
          return;
        }
        const S = y.filter((I) => !s.has(I));
        if (S.length === 0) return;
        S.forEach((I) => s.add(I)), await t();
      } catch {
      } finally {
        l = !1;
      }
    }
  }
  function m() {
    clearTimeout(d), d = null, !(!a.isActive() || !c()) && (d = setTimeout(async () => {
      d = null, await u(), m();
    }, i));
  }
  function p() {
    u();
  }
  function b() {
    c() ? (u(), m()) : (clearTimeout(d), d = null);
  }
  return u(), m(), n.addEventListener("focus", p), o.addEventListener("visibilitychange", b), function() {
    a.dispose(), clearTimeout(d), d = null, n.removeEventListener("focus", p), o.removeEventListener("visibilitychange", b);
  };
}
function zu(e, t, n, o = !1, i = () => () => {
}) {
  const [a, s] = K({
    busy: !1,
    reviewState: null,
    error: ""
  }), l = fe(n);
  be(() => {
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
      await oe(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Co(), reviewState: c })
      }), await t(), s({ busy: !1, reviewState: null, error: "" });
    } catch (m) {
      s({
        busy: !1,
        reviewState: null,
        error: m.message || "Unable to import Cove segments."
      });
    } finally {
      u();
    }
  }
  return be(() => {
    if (Bu(o))
      return Ku({
        fetchRuns: (c) => oe(`/videos/${e}/analysis-runs`, { signal: c }),
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
function _u(e, t) {
  var o;
  const n = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = n == null ? void 0 : n.focus) == null || o.call(n, { preventScroll: !0 });
}
function Hu({ detail: e, onDetailChange: t, onConflict: n, onReload: o, onAnalysisCompleted: i, onSlotsChanged: a, splitLayout: s, initialSegmentId: l, compatibilityMode: d = !1, profile: c, onNavigate: u }) {
  var bi, hi, vi, xi, Si;
  const m = fe(null), p = fe(/* @__PURE__ */ new Map()), [b, f] = K(0), y = fe(null);
  y.current = { onReloadProjection: o, onConflictProjection: n };
  const [{ onReload: S, onConflict: I }] = K(() => {
    const M = () => {
      p.current.clear(), f((ie) => ie + 1);
    };
    return {
      onReload: (...ie) => (M(), y.current.onReloadProjection(...ie)),
      onConflict: (...ie) => (M(), y.current.onConflictProjection(...ie))
    };
  }), [g, O] = K(null), [V, Q] = K([]), E = fe(null), j = fe(null), $ = fe([]), x = fe(null), [k, D] = K(() => Gt({})), [F, U] = K(!1), [T, _] = K(Wl), [Z, L] = K(0), X = fe(null), [le] = K(() => Pc({
    getContext: () => X.current,
    drainAfterSettle: !1
  })), ae = Fd(le.subscribe, le.getSnapshot), ve = ts(ae), ce = (M, ie) => le.acquire({ kind: M, lockId: ie }), De = (M) => le.enqueue(M), W = (M) => le.stableIdentity(M), Y = fe(!1);
  be(() => (Y.current = !0, () => {
    Y.current = !1, queueMicrotask(() => {
      Y.current || le.dispose();
    });
  }), []);
  const pe = (M) => le.cancel(M), Se = (M, ie) => le.retarget(M, ie), we = le.getSnapshot, [he, H] = jd(Kc, []), [ke, de] = K(""), [w, G] = K(""), [A, N] = K(""), [h, B] = K(1), [P, ee] = K(qc), [C, ue] = K(0), [Ne, ne] = K({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [v, R] = K(Xt), re = fe(Xt), [se, J] = K(!1), [Fe, Re] = K(!1), [$e, Pe] = K(!1), _e = fe(!1);
  _e.current = $e;
  const [gt, Be] = K(null), [ft, ot] = K(!1), [Le, rt] = K(null), [St, lt] = K(null), ht = fe(null), [Xe, it] = K(!1), [z, te] = K(""), me = fe(null), ye = fe(null), ge = fe(!1), [Oe, Me] = K(Wc), [Qe, je] = K(null), [tt, We] = K(!1), [Ae, Te] = K(!1), [Ze, Ke] = K(!1), [Ue, Ie] = K(!1), [Bt, He] = K(!1), [vt, Dt] = K(""), {
    importNativeSegments: nt,
    nativeImportState: Ee
  } = zu(
    e.video.id,
    S,
    i,
    d,
    (M, ie) => le.acquire({ kind: M, lockId: ie })
  ), [Ce, dt] = K(!1), [kt, bt] = K(null), [qt, xt] = K(d), [Ct, en] = K(0), [cn, tn] = K(!1), [zn, _n] = K(""), [hr, vr] = K(null), Hn = fe(null), xr = fe(null), qn = fe(!1), [un, kn] = K([]), [wn, Sr] = K(!1), [Wn, no] = K(null), Vn = _c(), Jn = fe(null), Yn = fe(null), Nn = fe(null), kr = fe(l), wr = fe(null), Qn = fe(null), mn = fe(null), Xn = fe(null), Ut = fe(null), $t = fe(null), Zn = fe(null), er = fe(null), Nr = fe(null), Ir = fe(null), In = fe(null), tr = fe(null), Cr = fe(-1e12), ro = fe(null), nr = fe(null), [at, Cn] = K({ scrollTop: 0, height: 512 });
  be(() => {
    if (!Ce || cn || !zn) return;
    const M = requestAnimationFrame(() => {
      var ie;
      return (ie = xr.current) == null ? void 0 : ie.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(M);
  }, [Ce, cn, zn]), be(() => {
    if (!qn.current || Ce || qt) return;
    const M = requestAnimationFrame(() => {
      var ie;
      (ie = Hn.current) == null || ie.focus({ preventScroll: !0 }), qn.current = !1;
    });
    return () => cancelAnimationFrame(M);
  }, [Ce, qt]);
  const st = e.video, wt = e.segments || sr, $r = qe(() => JSON.stringify({
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
  be(() => {
    if (!d) {
      bt(null), xt(!1);
      return;
    }
    if (ve != null) {
      xt(!0);
      return;
    }
    let M = !0;
    xt(!0);
    const ie = setTimeout(() => {
      oe(`/videos/${st.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((ze) => {
        M && (bt(ze), _n(""));
      }).catch((ze) => {
        M && (bt(null), _n(ze.message || "Unable to preview derived segments."));
      }).finally(() => {
        M && xt(!1);
      });
    }, 150);
    return () => {
      M = !1, clearTimeout(ie);
    };
  }, [d, st.id, $r, Ct, ve]);
  const gn = () => en((M) => M + 1), Wt = e.segmentGroups || sr, Tt = e.performerSlots || sr, Tr = d && e.performerSlotsAvailable !== !1, fn = qe(
    () => (e.performerCandidates || []).filter((M) => M.isVideoPerformer),
    [e.performerCandidates]
  ), $n = e.shotBoundaries || sr, rr = qe(
    () => Va(Tt),
    [Tt]
  ), Tn = qe(
    () => wt.map((M) => {
      const ie = rr.get(M.id) || [];
      return {
        ...M,
        slots: ie,
        assignment: ie.every((ze) => ze.performerId == null) ? Ed(ie, fn) : null
      };
    }).filter((M) => M.slots.length > 0 && M.assignment != null),
    [wt, rr, fn]
  ), pn = Number((bi = st.videoFile) == null ? void 0 : bi.frameRate) > 0 ? Number(st.videoFile.frameRate) : 30;
  function Rn() {
    const M = _e.current;
    Pe(!1), M && requestAnimationFrame(() => {
      var ie;
      return (ie = $t.current) == null ? void 0 : ie.focus({ preventScroll: !0 });
    });
  }
  function oo() {
    ve == null && (tr.current = null, ot(!1), de(""), requestAnimationFrame(() => {
      var M;
      return (M = $t.current) == null ? void 0 : M.focus({ preventScroll: !0 });
    }));
  }
  function io() {
    U(!1), requestAnimationFrame(() => {
      var M, ie;
      (M = er.current) != null && M.isConnected ? er.current.focus({ preventScroll: !0 }) : (ie = $t.current) == null || ie.focus({ preventScroll: !0 });
    });
  }
  be(() => {
    In.current === g ? (In.current = null, Pe(!0)) : Pe(!1);
  }, [g]), be(() => {
    var ie;
    if (!$e) return;
    const M = (ie = Ir.current) == null ? void 0 : ie.querySelector("input");
    document.activeElement !== M && (M == null || M.focus({ preventScroll: !0 }), M == null || M.select());
  }, [$e, g]), be(() => {
    var ie;
    if ($e) return;
    const M = (ie = $t.current) == null ? void 0 : ie.ownerDocument;
    M && M.activeElement === M.body && $t.current.focus({ preventScroll: !0 });
  }, [$e]), be(() => {
    var ze, ut, Nt;
    const M = vn(
      mo(
        e.segments,
        e.performerSlots || [],
        Gt({}),
        d && T,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), ie = ((ze = e.segments.find((On) => On.id === l)) == null ? void 0 : ze.id) ?? ((ut = ba(M)) == null ? void 0 : ut.id) ?? null;
    O(ie), Q(ie == null ? [] : [ie]), j.current = ie, $.current = [], je(zt(M, ie)), D(Gt({})), U(!1), tr.current = null, ot(!1), B(1), de(""), R(Xt), re.current = Xt, J(!1), (Nt = $t.current) == null || Nt.focus({ preventScroll: !0 });
  }, [st.id, l]), be(() => {
    const M = new AbortController();
    return oe(`/videos/${st.id}/incorrect-examples`, { signal: M.signal }).then(kn).catch((ie) => {
      ie.name !== "AbortError" && kn([]);
    }), () => M.abort();
  }, [st.id, c == null ? void 0 : c.effectiveMode]), be(() => {
    const M = new AbortController();
    return oe(`/videos/${st.id}/history`, { signal: M.signal }).then((ie) => {
      const ze = ie || Xt;
      re.current = ze, R(ze);
    }).catch((ie) => {
      ie.name !== "AbortError" && de(ie.message || "Unable to load editor history.");
    }), () => M.abort();
  }, [st.id]), be(() => {
    Jc(P);
  }, [P.timelineRatio, P.markerRailOpen, P.detailWidth, P.markerRailWidth, P.swimlaneTitleWidth]), be(() => {
    Vc(Oe);
  }, [Oe]), be(() => {
    Vl(T);
  }, [T]), be(() => {
    const M = Qn.current;
    if (!s || !M || typeof ResizeObserver > "u") return;
    const ie = () => {
      var Nt;
      const ut = Math.max(0, M.clientHeight - (((Nt = mn.current) == null ? void 0 : Nt.offsetHeight) || 0));
      ue(ut), ee((On) => {
        const ki = jo(On.timelineRatio, ut);
        return ki === On.timelineRatio ? On : { ...On, timelineRatio: ki };
      });
    }, ze = new ResizeObserver(ie);
    return ze.observe(M), mn.current && ze.observe(mn.current), ie(), () => ze.disconnect();
  }, [s]), be(() => {
    if (!Vn || typeof ResizeObserver > "u") return;
    const M = Ut.current, ie = Xn.current;
    if (!M || !ie) return;
    const ze = () => ne({
      workspace: M.clientWidth,
      focusRow: ie.clientWidth,
      focusRowHeight: ie.clientHeight
    }), ut = new ResizeObserver(ze);
    return ut.observe(M), ut.observe(ie), ze(), () => ut.disconnect();
  }, [Vn, P.markerRailOpen]);
  const nn = qe(
    () => Wo(wt, he),
    [wt, he]
  );
  Ki(() => {
    as(he, e) !== he && H({ type: "prune", detail: e });
  }, [e, he]);
  const Yt = qe(
    () => Vi(
      mo(
        nn,
        Tt,
        k,
        d && T,
        Wt
      ),
      un,
      !0
    ),
    [
      nn,
      Tt,
      k,
      T,
      Wt,
      d,
      un
    ]
  ), En = Object.fromEntries(At.map((M) => [M, Yt.filter((ie) => ie.reviewState === M).length])), Mn = Vi(
    mo(
      nn,
      Tt,
      { ...k, reviewStates: At },
      d && T,
      Wt
    ),
    un,
    !0
  ), q = Object.fromEntries(At.map((M) => [M, Mn.filter((ie) => ie.reviewState === M).length])), Ve = [...new Set(nn.map((M) => M.sourceKey).filter(Boolean))].sort((M, ie) => Ht(M).localeCompare(Ht(ie))), jt = Pl(
    k,
    d && T
  ), ct = qe(
    () => vn(Yt, Wt, Tt),
    [Yt, Wt, Tt]
  ), Rt = qe(
    () => vc(ct, Oe),
    [ct, Oe]
  ), Et = ((hi = m.current) == null ? void 0 : hi.videoId) === st.id ? m.current : null, et = Fl(
    ct,
    g,
    l,
    {
      visibleLanes: Rt,
      reference: (Et == null ? void 0 : Et.reference) ?? null,
      referenceLanes: (Et == null ? void 0 : Et.lanes) ?? null
    }
  );
  be(() => {
    const M = Gr(ct, et == null ? void 0 : et.id);
    M && (m.current = { videoId: st.id, reference: M, lanes: Rt });
  }, [st.id, et == null ? void 0 : et.id, ct, Rt]);
  const Yo = qe(() => {
    const M = Gc(he);
    return M.length === 0 ? wt : [...wt, ...M];
  }, [wt, he]), xe = et == null ? null : Yo.find((M) => M.id === et.id) || et, rn = Mi(Yo, Mi(Yt, V).map((M) => M.id)), ps = Oc(ae, rn), ys = jn(ae), bs = To(ae), Qo = !d && rn.length > 0 && rn.every((M) => M.nativeSegmentId != null), Xo = Yt.map((M) => M.id), hs = Xo.join("|");
  E.current = (xe == null ? void 0 : xe.id) ?? null;
  const Zo = fe(null);
  Zo.current = g;
  const ei = rr.get(xe == null ? void 0 : xe.id) || [], vs = _o(ei), ti = qe(
    () => bc(ct, V),
    [ct, V]
  ), Rr = qe(() => Ho(ct), [ct]), or = qe(
    () => pc(Rr, Oe),
    [Rr, Oe]
  ), xs = qe(
    () => Ya(
      or.rows,
      at.scrollTop,
      at.height
    ),
    [or, at]
  ), Ss = zr(Rt, xe == null ? void 0 : xe.id, -1, !0) != null, ks = zr(Rt, xe == null ? void 0 : xe.id, 1, !0) != null, An = xe ? zt(ct, xe.id) : null, ao = Ja(Rr) ? Rr.map((M) => M.key) : [], ws = ao.join("|"), Er = Math.max(
    0,
    Number((vi = st.videoFile) == null ? void 0 : vi.duration) || 0,
    ...nn.map((M) => Number(M.endSec ?? M.startSec) || 0)
  ), ni = Number((xi = st.videoFile) == null ? void 0 : xi.duration) > 0 ? Number(st.videoFile.duration) : null;
  v.actions;
  const Ns = Ca();
  be(() => {
    const M = g === Ln ? g : (xe == null ? void 0 : xe.id) ?? null;
    M !== g && O(M);
  }, [xe, g]), be(() => {
    Q((M) => {
      const ie = zl(
        M,
        Xo,
        (xe == null ? void 0 : xe.id) ?? null
      );
      return ie.length === M.length && ie.every((ze, ut) => ze === M[ut]) ? M : ie;
    });
  }, [hs, xe == null ? void 0 : xe.id]);
  const ir = e.itemMetadataAvailable ? (xe == null ? void 0 : xe.itemId) ?? null : null, ri = ir == null ? null : ((Si = e.itemMetadata) == null ? void 0 : Si[ir]) || null, Qt = ir == null || ri ? null : `${b}:${ir}:${xe.revision}:${xe.updatedAt}`, [so, lo] = K({ key: null, value: null, error: null });
  be(() => {
    if (Qt == null) return;
    const M = p.current.get(Qt);
    if (M) {
      lo({ key: Qt, value: M, error: null });
      return;
    }
    const ie = new AbortController(), ze = setTimeout(() => {
      oe(`/videos/${st.id}/items/${ir}/metadata`, { signal: ie.signal }).then((ut) => {
        const Nt = p.current;
        Nt.size >= 500 && Nt.delete(Nt.keys().next().value), Nt.set(Qt, ut), lo({ key: Qt, value: ut, error: null });
      }).catch((ut) => {
        ie.signal.aborted || lo({ key: Qt, value: null, error: ut.message || "Unable to load provenance." });
      });
    }, 100);
    return () => {
      clearTimeout(ze), ie.abort();
    };
  }, [Qt, st.id]);
  const ar = Qt == null ? { loading: !1, error: null, value: ri } : so.key === Qt ? { loading: !1, error: so.error, value: so.value } : { loading: !0, error: null, value: null }, Dn = ar.value, Is = {
    key: (xe == null ? void 0 : xe.itemId) != null ? `item:${xe.itemId}` : (xe == null ? void 0 : xe.nativeSegmentId) != null ? `native:${xe.nativeSegmentId}` : null,
    loading: ar.loading,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : ar.error,
    items: e.itemMetadataAvailable ? (Dn == null ? void 0 : Dn.provenance) || (xe == null ? void 0 : xe.fieldProvenance) || [] : []
  }, co = (xe == null ? void 0 : xe.itemId) != null ? {
    loading: ar.loading,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : ar.error,
    data: e.lineageMetadataAvailable && (Dn == null ? void 0 : Dn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  be(() => {
    G(et == null ? "" : String(et.startSec)), N((et == null ? void 0 : et.endSec) == null ? "" : String(et.endSec));
  }, [et == null ? void 0 : et.id, et == null ? void 0 : et.startSec, et == null ? void 0 : et.endSec]), be(() => {
    An && Me((M) => Za(M, An));
  }, [st.id, l, An]), be(() => {
    je((M) => wc(ao, M, An));
  }, [st.id, ws, An]), be(() => {
    if (!P.markerRailOpen || (xe == null ? void 0 : xe.id) == null) return;
    const M = nr.current, ie = or.rows.find((Nt) => Nt.kind === "segment" && Nt.segment.id === xe.id);
    if (!M || !ie) return;
    const ze = ie.top + ie.height;
    let ut = M.scrollTop;
    ie.top < M.scrollTop ? ut = ie.top : ze > M.scrollTop + M.clientHeight && (ut = Math.max(0, ze - M.clientHeight)), ut !== M.scrollTop && (M.scrollTop = ut), Cn({ scrollTop: ut, height: M.clientHeight });
  }, [xe == null ? void 0 : xe.id, or, P.markerRailOpen]), be(() => {
    const M = nr.current;
    if (!P.markerRailOpen || !M) return;
    const ie = () => Cn({
      scrollTop: M.scrollTop,
      height: M.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      ie();
      return;
    }
    const ze = new ResizeObserver(ie);
    return ze.observe(M), ie(), () => ze.disconnect();
  }, [P.markerRailOpen]);
  const { revealSegmentGroupForSelection: oi, replaceSegmentSelection: Cs, selectSegment: ii, selectSegmentCollection: $s, selectAllVideoSegments: Ts } = Ou({
    allSwimlanes: ct,
    editorRef: $t,
    performerSlots: Tt,
    seekRef: Jn,
    segmentGroups: Wt,
    segments: wt,
    selectedSegmentId: g,
    selectedSegmentIds: V,
    selectionAnchorIdRef: j,
    selectionRangeBaseIdsRef: $,
    setCollapsedSegmentGroups: Me,
    setEditorFilters: D,
    setHideDerivedSegments: _,
    setSaveMessage: de,
    setSelectedSegmentGroupKey: je,
    setSelectedSegmentId: O,
    setSelectedSegmentIds: Q
  }), { acceptHistory: uo, recordHistoryAction: Mr, mutateSegment: Rs, runSegmentMutation: Es, completeReview: Ms, createSegment: ai, splitSegment: si, duplicateSegment: li, saveTiming: As, applyShortcutTiming: Ds } = zc({
    compatibilityMode: d,
    getRequestedSelectionId: () => Zo.current,
    displayedSelectedSegment: et,
    getSaveQueueSnapshot: we,
    currentTime: Z,
    detail: e,
    editorFilters: k,
    endInput: A,
    hideDerivedSegments: T,
    historyRef: re,
    mediaDuration: ni,
    onConflict: I,
    onDetailChange: t,
    onReload: S,
    optimisticSegmentIdRef: Cr,
    pendingDuplicateRef: ro,
    pendingFirstSegmentStartSecRef: tr,
    pendingTagEditSegmentIdRef: In,
    performerSlots: Tt,
    enqueueSave: De,
    pendingChanges: he,
    retargetSaveTasks: Se,
    replaceSegmentSelection: Cs,
    savingSegmentId: ve,
    segments: wt,
    selectedSegment: xe,
    selectedSegmentIdRef: E,
    selectedSegments: rn,
    selectionAnchorIdRef: j,
    selectionRangeBaseIdsRef: $,
    setCreatingSegmentId: Be,
    setEditorFilters: D,
    setFirstSegmentTagOpen: ot,
    setHideDerivedSegments: _,
    setHistory: R,
    setHistoryOpen: J,
    setPublishApprovedError: te,
    setSaveMessage: de,
    acquireSaveLock: ce,
    dispatchPendingChanges: H,
    setSelectedSegmentGroupKey: je,
    setSelectedSegmentId: O,
    setSelectedSegmentIds: Q,
    setTagEditing: Pe,
    startInput: w,
    tagEditingRef: _e,
    timelineDuration: Er,
    video: st
  });
  function di(M = null) {
    var ut;
    if (!d || ve != null || !wt.some((Nt) => Yr(Nt))) return;
    const ie = ((ut = $t.current) == null ? void 0 : ut.ownerDocument) ?? document, ze = ie.activeElement === ie.body ? null : ie.activeElement;
    ye.current = M != null && M.isConnected && M !== ie.body ? M : ze, te(""), it(!0);
  }
  function ci() {
    ve == null && (it(!1), te(""), requestAnimationFrame(() => {
      _u(
        ye.current,
        $t.current
      ), ye.current = null;
    }));
  }
  async function Os() {
    await Ms() && ci();
  }
  const { closeMergeConfirmation: Ps, mergeSelectedSwimlane: ui, saveSelectedReviewState: Ls } = Pu({
    acceptHistory: uo,
    pendingChanges: he,
    compatibilityMode: d,
    detail: e,
    detailPanelRef: x,
    getSaveQueueSnapshot: we,
    historyRef: re,
    onConflict: I,
    onDetailChange: t,
    onReload: S,
    recordHistoryAction: Mr,
    revealSegmentGroupForSelection: oi,
    savingSegmentId: ve,
    selectedGroups: ti,
    selectedSegment: xe,
    selectedSegmentIdRef: E,
    selectedSegments: rn,
    selectionAnchorIdRef: j,
    selectionRangeBaseIdsRef: $,
    setMergeConfirmation: rt,
    setSaveMessage: de,
    acquireSaveLock: ce,
    dispatchPendingChanges: H,
    enqueueSave: De,
    stableSaveIdentity: W,
    setSelectedSegmentId: O,
    setSelectedSegmentIds: Q,
    video: st
  }), js = (M) => {
    const ie = (M || []).map(pt);
    le.cancel((ze) => ze.kind === "review" && eo(ze.targets, ie));
  }, Fs = le.settledCount();
  Ki(() => {
    le.markCommitted(Fs), X.current = {
      detail: e,
      segments: wt,
      onConflict: I,
      onDetailChange: t,
      onReload: S,
      tagEditing: $e,
      selectedSegmentIds: V,
      activeSegmentId: (xe == null ? void 0 : xe.id) ?? null
    };
  }), be(() => {
    le.poke();
  });
  const { toggleIncorrectExample: Gs, removeIncorrectExample: Bs, captureTrainingExport: Us, deleteRejectedSegments: mi, autoAssignPerformers: Ks, previewDerivedSegments: zs, closeMaterializeDialog: _s, materializeDerivedSegments: Hs, saveTag: qs, moveToBin: Ws, emptyRecyclingBin: Vs } = Lu({
    acceptHistory: uo,
    displayedSelectedSegment: et,
    allSwimlanes: ct,
    autoAssignCandidates: Tn,
    autoAssigning: Bt,
    binEmptyingRef: ge,
    canMoveSelectionToBin: Qo,
    closeTagEditing: Rn,
    compatibilityMode: d,
    creatingSegmentId: gt,
    detail: e,
    editorFilters: k,
    editorRef: $t,
    exportingExamples: wn,
    hideDerivedSegments: T,
    incorrectExamples: un,
    lineage: co,
    materializeButtonRef: Hn,
    materializePreview: kt,
    materializeRestoreFocusRef: qn,
    materializing: cn,
    mutateSegment: Rs,
    onConflict: I,
    onDetailChange: t,
    onReload: S,
    performerSlots: Tt,
    cancelSaveTasks: pe,
    dispatchPendingChanges: H,
    enqueueSave: De,
    stableSaveIdentity: W,
    pendingChanges: he,
    runSegmentMutation: Es,
    recordHistoryAction: Mr,
    refreshMaterializationPreview: gn,
    removingExampleId: Wn,
    revealSegmentGroupForSelection: oi,
    savingSegmentId: ve,
    segmentGroups: Wt,
    segments: wt,
    selectedSegment: xe,
    selectedSegmentIdRef: E,
    selectedSegments: rn,
    selectionAnchorIdRef: j,
    selectionRangeBaseIdsRef: $,
    setAutoAssignError: Dt,
    setAutoAssignOpen: Ie,
    setAutoAssigning: He,
    setEditorFilters: D,
    setExportingExamples: Sr,
    setHideDerivedSegments: _,
    setIncorrectExamples: kn,
    setMaterializeError: _n,
    setMaterializeLoading: xt,
    setMaterializeOpen: dt,
    setMaterializePreview: bt,
    setMaterializing: tn,
    setRemovingExampleId: no,
    setRejectedDeletionPreview: lt,
    setSaveMessage: de,
    acquireSaveLock: ce,
    setSelectedSegmentGroupKey: je,
    setSelectedSegmentId: O,
    setSelectedSegmentIds: Q,
    swimlanes: Rt,
    video: st
  }), { restoreHistoryTarget: Js, updateTimelineRatio: gi, handleSeparatorPointerDown: Ys, handleSeparatorPointerMove: Qs, handleSeparatorKeyDown: Xs, panelWidthMaximum: fi, panelSeparatorProps: Zs, toggleSegmentRail: el, toggleSegmentGroup: pi, mutateShotBoundary: tl } = ju({
    acceptHistory: uo,
    compatibilityMode: d,
    currentTime: Z,
    detail: e,
    editorLayout: P,
    focusRowRef: Xn,
    history: v,
    historyRef: re,
    historySaving: Fe,
    horizontalLayoutSize: Ne,
    mediaStackHeight: C,
    mediaStackRef: Qn,
    commonActionsRef: mn,
    onDetailChange: t,
    onReload: S,
    railToggleRef: Zn,
    recordHistoryAction: Mr,
    savingSegmentId: ve,
    setCollapsedSegmentGroups: Me,
    setEditorLayout: ee,
    setHistorySaving: Re,
    setIncorrectExamples: kn,
    setSaveMessage: de,
    acquireSaveLock: ce,
    enqueueSave: De,
    getSaveQueueSnapshot: we,
    shotBoundaries: $n,
    timelineDuration: Er,
    video: st,
    workspaceRef: Ut
  }), { executeShortcutById: yi, stepVideoFrame: nl } = Fu({
    allSwimlanes: ct,
    displayedSelectedSegment: et,
    applyShortcutTiming: Ds,
    centerTimelineRef: wr,
    compatibilityMode: d,
    createSegment: ai,
    currentTime: Z,
    deleteRejectedSegments: mi,
    duplicateSegment: li,
    editorLayout: P,
    editorRef: $t,
    emptyRecyclingBin: Vs,
    lineage: co,
    mediaDuration: ni,
    mergeSelectedSwimlane: ui,
    moveToBin: Ws,
    mutateShotBoundary: tl,
    openPublishApprovedDialog: di,
    playbackControlsRef: Yn,
    playbackShortcutConfig: Ns,
    saveSelectedReviewState: Ls,
    seekRef: Jn,
    segmentGroupKeys: ao,
    selectSegment: ii,
    selectedSegment: xe,
    selectedSegmentGroupForSegment: An,
    selectedSegmentGroupKey: Qe,
    selectedSegments: rn,
    setCollapsedSegmentGroups: Me,
    setIncorrectExamplesOpen: Ke,
    setQuickSearchOpen: Te,
    setSaveMessage: de,
    setSelectedSegmentGroupKey: je,
    setTagEditing: Pe,
    setTimelineZoom: B,
    shotBoundaries: $n,
    slotButtonRef: Nr,
    splitSegment: si,
    swimlanes: Rt,
    timelineDuration: Er,
    toggleIncorrectExample: Gs,
    toggleSegmentGroup: pi,
    updateTimelineRatio: gi,
    videoFrameRate: pn,
    visibleSegments: Yt
  });
  Nn.current = yi;
  const rl = qe(() => pr.map((M) => ({
    id: M.id,
    enabled: Bn(M, d),
    surface: "local",
    action: (ie) => {
      var ze;
      return (ze = Nn.current) == null ? void 0 : ze.call(Nn, M.id, ie);
    }
  })), [d]);
  aa(Oo, rl);
  const ol = Lo(C), il = bn(P.markerRailWidth, fi("markerRailWidth")), al = bn(P.detailWidth, fi("detailWidth"));
  return r(Du, {
    activeFilterCount: jt,
    allSwimlanes: ct,
    approvalFacetCounts: q,
    autoAssignCandidates: Tn,
    autoAssignError: vt,
    autoAssignOpen: Ue,
    autoAssignPerformers: Ks,
    autoAssigning: Bt,
    canMoveSelectionToBin: Qo,
    captureTrainingExport: Us,
    cancelQueuedReviewsForSegments: js,
    removeIncorrectExample: Bs,
    rejectedDeletionPreview: St,
    centerTimelineRef: wr,
    closeEditorFilters: io,
    closeFirstSegmentTagDialog: oo,
    closeMaterializeDialog: _s,
    closeMergeConfirmation: Ps,
    closePublishApprovedDialog: ci,
    closeTagEditing: Rn,
    collapsedSegmentGroups: Oe,
    commonActionsRef: mn,
    compatibilityMode: d,
    configuringTag: hr,
    createSegment: ai,
    currentTime: Z,
    deleteRejectedSegments: mi,
    detail: e,
    detailPanelRef: x,
    detailWidth: al,
    duplicateSegment: li,
    editorFilters: k,
    editorLayout: P,
    editorRef: $t,
    exportingExamples: wn,
    filtersButtonRef: er,
    filtersOpen: F,
    firstSegmentTagOpen: ft,
    focusRowRef: Xn,
    handleSeparatorKeyDown: Xs,
    handleSeparatorPointerDown: Ys,
    handleSeparatorPointerMove: Qs,
    hideDerivedSegments: T,
    history: v,
    historyOpen: se,
    historySaving: Fe,
    hasNextUnreviewed: ks,
    hasPreviousUnreviewed: Ss,
    horizontalLayoutSize: Ne,
    importNativeSegments: nt,
    incorrectExamples: un,
    incorrectExamplesOpen: Ze,
    removingExampleId: Wn,
    lineage: co,
    markerRailWidth: il,
    materializeButtonRef: Hn,
    materializeCancelButtonRef: xr,
    materializeDerivedSegments: Hs,
    materializeError: zn,
    materializeLoading: qt,
    materializeOpen: Ce,
    materializePreview: kt,
    materializing: cn,
    mediaStackRef: Qn,
    mergeCancelButtonRef: ht,
    mergeConfirmation: Le,
    mergeSaving: Ac(ae, "merge"),
    mergeSelectedSwimlane: ui,
    nativeImportState: Ee,
    onNavigate: u,
    onDetailChange: t,
    openPublishApprovedDialog: di,
    onReload: S,
    onSlotsChanged: a,
    panelSeparatorProps: Zs,
    pendingInitialSeekRef: kr,
    performerSlots: Tt,
    performerSlotsAvailable: Tr,
    playbackControlsRef: Yn,
    previewDerivedSegments: zs,
    provenance: Is,
    provenanceSources: Ve,
    publishApprovedCancelButtonRef: me,
    publishApprovedDrafts: Os,
    publishApprovedError: z,
    publishApprovedOpen: Xe,
    quickSearchOpen: Ae,
    railScrollRef: nr,
    railToggleRef: Zn,
    recordHistoryAction: Mr,
    restoreHistoryTarget: Js,
    runEditorAction: yi,
    stepVideoFrame: nl,
    saveMessage: ke,
    setSaveMessage: de,
    saveTag: qs,
    saveTiming: As,
    savingSegmentId: ve,
    selectionBusy: ps,
    editorHeldByOtherWork: ys,
    segmentCreationPending: bs,
    acquireSaveLock: ce,
    seekRef: Jn,
    segmentGroups: Wt,
    segmentRailLayout: or,
    segments: nn,
    selectAllVideoSegments: Ts,
    selectSegment: ii,
    selectSegmentCollection: $s,
    selectedGroups: ti,
    selectedPerformerSlots: ei,
    selectedSegment: et,
    selectedSegmentGroupKey: Qe,
    selectedSegmentIds: V,
    selectedSegments: rn,
    selectedSlotStatus: vs,
    setAutoAssignError: Dt,
    setAutoAssignOpen: Ie,
    setConfiguringTag: vr,
    setCurrentTime: L,
    setEditorFilters: D,
    setEditorLayout: ee,
    setFiltersOpen: U,
    setHideDerivedSegments: _,
    setHistoryOpen: J,
    setIncorrectExamplesOpen: Ke,
    setQuickSearchOpen: Te,
    setRejectedDeletionPreview: lt,
    setRailViewport: Cn,
    setSelectedSegmentGroupKey: je,
    setSelectedSegmentId: O,
    setShortcutsOpen: We,
    setTimelineZoom: B,
    shotBoundaries: $n,
    shortcutsOpen: tt,
    slotButtonRef: Nr,
    splitLayout: s,
    splitSegment: si,
    tagEditing: $e,
    creatingSegmentId: gt,
    tagSearchRef: Ir,
    timelineDuration: Er,
    timelineRatioBounds: ol,
    timelineZoom: h,
    toggleSegmentGroup: pi,
    toggleSegmentRail: el,
    updateTimelineRatio: gi,
    video: st,
    videoPerformers: fn,
    visibleCounts: En,
    visibleSegmentRailRows: xs,
    visibleSegments: Yt,
    wideLayout: Vn,
    workspaceRef: Ut
  });
}
function qu(e = [], t = []) {
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
function Wu(e = [], t = "", n = "all") {
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
function It(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function Vu(e = [], t = []) {
  var b;
  const n = /* @__PURE__ */ new Map();
  [...t].sort((f, y) => (f.sortOrder ?? 0) - (y.sortOrder ?? 0) || Number(f.id) - Number(y.id)).forEach((f, y) => {
    [...f.tags || []].sort((S, I) => (S.sortOrder ?? 0) - (I.sortOrder ?? 0) || Number(S.tagId) - Number(I.tagId)).forEach((S, I) => n.set(Number(S.tagId), {
      key: `group:${f.id}`,
      id: f.id,
      name: f.name,
      sortOrder: f.sortOrder ?? y,
      tagSortOrder: S.sortOrder ?? I
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(f, y) {
    const S = Number(f);
    if (!o.has(S)) {
      const I = n.get(S);
      o.set(S, {
        tagId: S,
        name: y || `Tag ${S}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (I == null ? void 0 : I.key) || "ungrouped",
        segmentGroupId: (I == null ? void 0 : I.id) ?? null,
        segmentGroupName: (I == null ? void 0 : I.name) || "Ungrouped",
        segmentGroupSortOrder: (I == null ? void 0 : I.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (I == null ? void 0 : I.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(S);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((f) => {
    const y = i(f.sourceTagId, f.sourceTagName), S = i(f.derivedTagId, f.derivedTagName);
    y.outgoingRuleCount++, S.incomingRuleCount++;
    const I = `${y.tagId}:${S.tagId}`;
    a.has(I) || a.set(I, {
      id: I,
      sourceTagId: y.tagId,
      derivedTagId: S.tagId,
      rules: [],
      edgeCount: 0
    });
    const g = a.get(I);
    g.rules.push(f), g.edgeCount += Number(f.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((f) => [f.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((f) => {
    var y, S;
    (y = d.get(f.sourceTagId)) == null || y.add(f.derivedTagId), (S = d.get(f.derivedTagId)) == null || S.add(f.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), u = [];
  for (const f of s) {
    if (c.has(f.tagId)) continue;
    const y = [f.tagId], S = [];
    for (c.add(f.tagId); y.length > 0; ) {
      const j = y.shift();
      S.push(j);
      for (const $ of d.get(j) || [])
        c.has($) || (c.add($), y.push($));
    }
    const I = new Set(S), g = S.map((j) => o.get(j)), O = l.filter((j) => I.has(j.sourceTagId) && I.has(j.derivedTagId)), V = O.flatMap((j) => j.rules), Q = g.filter((j) => j.outgoingRuleCount === 0).sort((j, $) => It(j.name, $.name)), E = Q.length > 0 ? Q : [...g].sort((j, $) => It(j.name, $.name));
    u.push({
      id: [...S].sort((j, $) => j - $).join(":"),
      label: E.length > 1 ? `${E[0].name} + ${E.length - 1}` : ((b = E[0]) == null ? void 0 : b.name) || "Derivation component",
      nodes: g,
      connections: O,
      rules: V,
      segmentGroupKeys: [...new Set(g.map((j) => j.segmentGroupKey))],
      materializedEdgeCount: V.reduce(
        (j, $) => j + (Number($.edgeCount) || 0),
        0
      )
    });
  }
  u.sort((f, y) => y.rules.length - f.rules.length || It(f.label, y.label));
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
  }), u.forEach((f) => {
    f.nodes.forEach((y) => {
      var S;
      return (S = m.get(y.segmentGroupKey)) == null ? void 0 : S.componentIds.add(f.id);
    }), f.rules.forEach((y) => {
      var S, I;
      (S = m.get(o.get(Number(y.sourceTagId)).segmentGroupKey)) == null || S.ruleIds.add(y.id), (I = m.get(o.get(Number(y.derivedTagId)).segmentGroupKey)) == null || I.ruleIds.add(y.id);
    });
  });
  const p = [...m.values()].sort((f, y) => f.sortOrder - y.sortOrder || It(f.name, y.name)).map((f) => ({
    ...f,
    ruleCount: f.ruleIds.size,
    componentCount: f.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: u,
    segmentGroups: p
  };
}
function Ju(e, {
  minimumWidth: t = 720,
  minimumHeight: n = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const u = new Map(e.nodes.map((x) => [x.tagId, /* @__PURE__ */ new Set()])), m = new Map(e.nodes.map((x) => [x.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((x) => {
    var k, D;
    (k = u.get(x.sourceTagId)) == null || k.add(x.derivedTagId), (D = m.get(x.derivedTagId)) == null || D.add(x.sourceTagId);
  });
  const p = new Map(e.nodes.map((x) => {
    var k;
    return [
      x.tagId,
      ((k = m.get(x.tagId)) == null ? void 0 : k.size) || 0
    ];
  })), b = new Map(e.nodes.map((x) => [x.tagId, 0])), f = e.nodes.filter((x) => p.get(x.tagId) === 0).sort((x, k) => It(x.name, k.name)).map((x) => x.tagId), y = /* @__PURE__ */ new Set();
  for (; f.length > 0; ) {
    const x = f.shift();
    if (!y.has(x)) {
      y.add(x);
      for (const k of u.get(x) || [])
        b.set(k, Math.max(b.get(k) || 0, (b.get(x) || 0) + 1)), p.set(k, p.get(k) - 1), p.get(k) === 0 && f.push(k);
    }
  }
  y.size !== e.nodes.length && e.nodes.filter((x) => !y.has(x.tagId)).sort((x, k) => It(x.name, k.name)).forEach((x) => b.set(x.tagId, 0));
  const S = Math.max(0, ...b.values()), I = Math.max(
    t,
    240 + S * 296
  ), g = /* @__PURE__ */ new Map();
  e.nodes.forEach((x) => {
    g.has(x.segmentGroupKey) || g.set(x.segmentGroupKey, {
      key: x.segmentGroupKey,
      id: x.segmentGroupId,
      name: x.segmentGroupName,
      sortOrder: x.segmentGroupSortOrder,
      nodes: []
    }), g.get(x.segmentGroupKey).nodes.push(x);
  });
  const O = [...g.values()].sort((x, k) => x.sortOrder - k.sortOrder || It(x.name, k.name));
  let V = 28;
  const Q = [], E = O.map((x) => {
    const k = /* @__PURE__ */ new Map();
    x.nodes.forEach((_) => {
      const Z = b.get(_.tagId) || 0;
      k.has(Z) || k.set(Z, []), k.get(Z).push(_);
    });
    for (const _ of k.values())
      _.sort((Z, L) => Z.segmentGroupTagSortOrder - L.segmentGroupTagSortOrder || It(Z.name, L.name));
    const D = Math.max(1, ...[...k.values()].map((_) => _.length)), F = D * 58 + (D - 1) * 18, U = 70 + F, T = {
      ...x,
      x: 12,
      y: V,
      width: I - 24,
      height: U
    };
    for (const [_, Z] of k.entries()) {
      const L = Z.length * 58 + Math.max(0, Z.length - 1) * 18, X = (F - L) / 2;
      Z.forEach((le, ae) => Q.push({
        ...le,
        rank: _,
        x: 28 + _ * 296,
        y: V + 34 + 18 + X + ae * 76,
        width: 184,
        height: 58
      }));
    }
    return V += U + 16, T;
  }), j = new Map(Q.map((x) => [x.tagId, x])), $ = e.connections.map((x) => {
    const k = j.get(x.sourceTagId), D = j.get(x.derivedTagId), F = k.x + k.width, U = k.y + k.height / 2, T = D.x, _ = D.y + D.height / 2, Z = Math.max(48, (T - F) * 0.48);
    return {
      ...x,
      path: `M ${F} ${U} C ${F + Z} ${U}, ${T - Z} ${_}, ${T} ${_}`
    };
  });
  return {
    width: I,
    height: Math.max(n, V - 16 + 28),
    nodes: Q,
    connections: $,
    groups: E
  };
}
function Yu(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Ju(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), u = 20, m = o, p = c.nodes.map((f) => ({
      ...f,
      x: f.x + u,
      y: f.y + m
    })), b = new Map(p.map((f) => [f.tagId, f]));
    a.push(...p), l.push(...c.groups.map((f) => ({
      ...f,
      componentId: d.id,
      x: f.x + u,
      y: f.y + m
    }))), s.push(...c.connections.map((f) => {
      const y = b.get(f.sourceTagId), S = b.get(f.derivedTagId), I = y.x + y.width, g = y.y + y.height / 2, O = S.x, V = S.y + S.height / 2, Q = Math.max(48, (O - I) * 0.48);
      return {
        ...f,
        componentId: d.id,
        path: `M ${I} ${g} C ${I + Q} ${g}, ${O - Q} ${V}, ${O} ${V}`
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
function Qu(e, t, n) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !n && t[0] || null;
}
function fs(e) {
  const t = e == null ? void 0 : e.saved;
  return t != null && Number(e.sourceTagId) === Number(t.sourceTagId) && Number(e.derivedTagId) === Number(t.derivedTagId);
}
function Xu(e, t, n, o = "") {
  const i = {
    ...e,
    [`${t}TagId`]: n == null ? null : Number(n),
    [`${t}TagName`]: o || "",
    slotMappings: []
  };
  return fs(i) ? { ...i, slotMappings: i.saved.slotMappings } : i;
}
function Jr(e) {
  return !!(e != null && e.sourceSlotMissing || e != null && e.derivedSlotMissing);
}
function Zu(e = []) {
  return e.filter((t) => (t.slotMappings || []).some(Jr)).sort((t, n) => It(
    `${t.sourceTagName} ${t.derivedTagName}`,
    `${n.sourceTagName} ${n.derivedTagName}`
  ));
}
function em(e) {
  const { arrowMarkerId: t, busy: n, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: u, editorRef: m, emptyDraft: p, graph: b, layout: f, listSort: y, materializationOffer: S, materializeOutgoingRules: I, materializeRule: g, message: O, normalizedQuery: V, query: Q, refreshConfiguredTag: E, removeMissingSlotMappings: j, revealEditor: $, rules: x, rulesWithMissingSlots: k, save: D, segmentGroupKey: F, selectedNode: U, selectedRule: T, selection: _, setConfiguringTag: Z, setDraft: L, setListSort: X, setMaterializationOffer: le, setQuery: ae, setSegmentGroupKey: ve, setSelection: ce, setView: De, sortedVisibleRules: W, sourceSlots: Y, sourceSlotsLoading: pe, updateMapping: Se, updateTag: we, view: he, visibleComponents: H, visibleRules: ke } = e;
  function de(P) {
    const ee = b.nodes.find((ue) => ue.tagId === Number(P.sourceTagId)), C = b.nodes.find((ue) => ue.tagId === Number(P.derivedTagId));
    return (ee == null ? void 0 : ee.segmentGroupKey) === (C == null ? void 0 : C.segmentGroupKey) ? ee.segmentGroupKey : "cross-group";
  }
  function w() {
    return r("div", { key: "editor", ref: m, className: "space-y-4 p-4" }, [
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
          onClick: () => L(null),
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
              onChange: (P, ee) => we("source", P, ee == null ? void 0 : ee.label),
              disabled: n,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.sourceTagId && !pe && Y.length === 0 ? r("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            r("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            r("button", {
              key: "configure",
              type: "button",
              disabled: n,
              onClick: (P) => Z({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: P.currentTarget
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
              onChange: (P, ee) => we("derived", P, ee == null ? void 0 : ee.label),
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
              onClick: (P) => Z({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: P.currentTarget
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
            disabled: n || d.slotMappings.some((P) => !P.sourceSlotDefinitionId || !P.derivedSlotDefinitionId) || Pr(Y, d.slotMappings, -1, "sourceSlotDefinitionId").length === 0 || Pr(s, d.slotMappings, -1, "derivedSlotDefinitionId").length === 0,
            onClick: () => L((P) => ({
              ...P,
              slotMappings: [...P.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
            })),
            className: o
          }, "Add mapping")
        ]),
        d.missingSlotMappingCount > 0 ? r(
          "p",
          { key: "missing", className: "text-xs text-amber-300" },
          `${d.missingSlotMappingCount} mapping${d.missingSlotMappingCount === 1 ? "" : "s"} to deleted performer slots ${d.missingSlotMappingCount === 1 ? "was" : "were"} left out. Saving removes them along with this rule's materializations; to keep those, cancel and use Remove missing mappings above.`
        ) : null,
        d.slotMappings.length === 0 ? r("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots will be copied.") : r("div", { key: "configured", className: "space-y-2" }, [
          ...d.slotMappings.map((P, ee) => r("div", { key: ee, className: "flex items-center gap-2" }, [
            r("select", {
              key: "source",
              value: P.sourceSlotDefinitionId,
              disabled: n,
              onChange: (C) => Se(ee, "sourceSlotDefinitionId", C.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${ee + 1}`
            }, [r("option", { key: "none", value: "" }, "Source slot…"), ...Pr(Y, d.slotMappings, ee, "sourceSlotDefinitionId").map((C) => r("option", { key: C.id, value: C.id }, Lt(C)))]),
            r("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            r("select", {
              key: "derived",
              value: P.derivedSlotDefinitionId,
              disabled: n,
              onChange: (C) => Se(ee, "derivedSlotDefinitionId", C.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${ee + 1}`
            }, [r("option", { key: "none", value: "" }, "Derived slot…"), ...Pr(s, d.slotMappings, ee, "derivedSlotDefinitionId").map((C) => r("option", { key: C.id, value: C.id }, Lt(C)))]),
            r("button", {
              key: "remove",
              type: "button",
              disabled: n,
              onClick: () => L((C) => ({
                ...C,
                slotMappings: C.slotMappings.filter((ue, Ne) => Ne !== ee)
              })),
              className: `${o} shrink-0 text-red-300`,
              "aria-label": `Remove performer slot mapping ${ee + 1}`,
              title: "Remove mapping"
            }, "🗑")
          ]))
        ])
      ]),
      r("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        r("button", {
          key: "save",
          type: "button",
          disabled: n || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((P) => !P.sourceSlotDefinitionId || !P.derivedSlotDefinitionId),
          onClick: D,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        r("button", { key: "cancel", type: "button", disabled: n, onClick: () => L(null), className: o }, "Cancel")
      ])
    ]);
  }
  function G(P, ee, C) {
    const ue = C ? "Deleted slot" : ee || "Unnamed slot";
    return r("span", { key: P, className: `truncate ${C ? "italic text-amber-300" : "text-foreground"}`, title: ue }, ue);
  }
  function A() {
    if (k.length === 0) return null;
    const P = k.length;
    return r("div", { key: "missing-slots", role: "region", "aria-label": "Deleted performer slot mappings", className: "space-y-2 border-b border-amber-500/40 bg-amber-500/10 px-4 py-3" }, [
      r("div", { key: "summary", className: "flex flex-wrap items-start justify-between gap-3" }, [
        r("div", { key: "copy", className: "max-w-3xl" }, [
          r(
            "p",
            { key: "title", className: "text-sm font-medium text-foreground" },
            `${P} derivation rule${P === 1 ? " maps" : "s map"} performer slots that no longer exist`
          ),
          r(
            "p",
            { key: "details", className: "mt-1 text-xs text-secondary" },
            "Those mappings copy no performers, and a rule whose derived slot is gone cannot materialize. Removing them keeps each rule's other mappings and its existing materializations."
          )
        ]),
        r("button", {
          key: "remove",
          type: "button",
          disabled: n || d != null,
          onClick: j,
          className: o
        }, "Remove missing mappings")
      ]),
      r(
        "ul",
        { key: "rules", className: "flex flex-wrap gap-2", "aria-label": "Rules with deleted performer slots" },
        k.map((ee) => r("li", { key: ee.id }, r("button", {
          type: "button",
          disabled: d != null,
          onClick: () => {
            ae(""), ve("all"), De("list"), ce({ type: "rule", id: ee.id });
          },
          className: "rounded-full border border-amber-500/40 px-2.5 py-0.5 text-xs text-foreground hover:bg-amber-500/15 disabled:opacity-50"
        }, [
          `${ee.sourceTagName} → ${ee.derivedTagName}`,
          r(
            "span",
            { key: "count", className: "ml-1.5 text-secondary" },
            `· ${ee.slotMappings.filter(Jr).length} missing`
          )
        ])))
      )
    ]);
  }
  function N() {
    if (U) {
      const C = ke.filter((ne) => Number(ne.derivedTagId) === U.tagId), ue = ke.filter((ne) => Number(ne.sourceTagId) === U.tagId), Ne = (ne, v, R) => r("div", {
        key: ne.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        r("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          r("span", { key: "direction", className: "block text-secondary" }, v),
          r(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${ne.sourceTagName} → ${ne.derivedTagName}`
          )
        ]),
        r("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          R ? r("button", {
            key: "materialize",
            type: "button",
            disabled: n || d != null,
            onClick: () => g(ne),
            className: o
          }, "Materialize") : null,
          r("button", {
            key: "edit",
            type: "button",
            disabled: n || d != null,
            onClick: () => u(ne, !0),
            className: o
          }, "Edit rule"),
          r("button", {
            key: "delete",
            type: "button",
            disabled: n || d != null,
            onClick: () => a(ne),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return r("div", { key: "node-details", className: "space-y-4 p-4" }, [
        r("div", { key: "identity" }, [
          r("div", { key: "group", className: "text-xs font-medium text-accent" }, U.segmentGroupName),
          r("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, U.name),
          r(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${U.incomingRuleCount} incoming · ${U.outgoingRuleCount} outgoing`
          )
        ]),
        r("button", {
          key: "configure-tag",
          type: "button",
          disabled: n || d != null,
          onClick: (ne) => Z({
            tagId: U.tagId,
            tagName: U.name,
            trigger: ne.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        ue.length ? r("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: n || d != null,
          onClick: () => I(U, ue),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${ue.length})`) : null,
        ue.length ? r("div", { key: "outgoing", className: "space-y-2" }, [
          r("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...ue.map((ne) => Ne(ne, "Derives", !0))
        ]) : null,
        C.length ? r("details", {
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
              C.length
            )
          ]),
          r(
            "div",
            { key: "rules", className: "space-y-2 border-t border-border p-2" },
            C.map((ne) => Ne(ne, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!T)
      return r(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const P = b.nodes.find((C) => C.tagId === Number(T.sourceTagId)), ee = b.nodes.find((C) => C.tagId === Number(T.derivedTagId));
    return r("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      r("div", { key: "identity" }, [
        r("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          r("span", { key: "source" }, (P == null ? void 0 : P.segmentGroupName) || "Ungrouped"),
          (P == null ? void 0 : P.segmentGroupKey) !== (ee == null ? void 0 : ee.segmentGroupKey) ? r("span", { key: "derived" }, `→ ${(ee == null ? void 0 : ee.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        r(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${T.sourceTagName} → ${T.derivedTagName}`
        ),
        r(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${T.edgeCount} materialized lineage edge${T.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (S == null ? void 0 : S.ruleId) === T.id ? r("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
        r(
          "p",
          { key: "summary", className: "text-sm font-medium text-foreground" },
          `${S.createCount + S.linkCount} pending derivation${S.createCount + S.linkCount === 1 ? "" : "s"}`
        ),
        r(
          "p",
          { key: "details", className: "text-xs text-secondary" },
          `${S.createCount} new segments · ${S.linkCount} existing segments to link`
        ),
        r("div", { key: "actions", className: "flex gap-2" }, [
          r("button", {
            key: "materialize",
            type: "button",
            disabled: n,
            onClick: () => g(T, S),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          r("button", {
            key: "later",
            type: "button",
            disabled: n,
            onClick: () => le(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      r("div", { key: "mappings", className: "space-y-2" }, [
        r("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        T.slotMappings.length === 0 ? r("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : T.slotMappings.map((C, ue) => r("div", {
          key: `${C.sourceSlotDefinitionId}:${C.derivedSlotDefinitionId}`,
          className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
        }, [
          G("source", C.sourceSlotLabel, C.sourceSlotMissing),
          r("span", { key: "arrow", className: "text-secondary" }, "→"),
          G("derived", C.derivedSlotLabel, C.derivedSlotMissing)
        ]))
      ]),
      r("dl", { key: "metadata", className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-xs" }, [
        r("dt", { key: "created-label", className: "text-secondary" }, "Created"),
        r(
          "dd",
          { key: "created", className: "text-right text-foreground" },
          T.createdAt ? new Date(T.createdAt).toLocaleDateString() : "Unknown"
        ),
        r("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        r(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          T.updatedAt ? new Date(T.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      r("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        r("button", {
          key: "materialize",
          type: "button",
          disabled: n || d != null,
          onClick: () => g(T),
          className: o
        }, "Materialize pending"),
        r("button", {
          key: "edit",
          type: "button",
          disabled: n || d != null,
          onClick: () => u(T),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        r("button", {
          key: "delete",
          type: "button",
          disabled: n,
          onClick: () => a(T),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function h() {
    if (H.length === 0)
      return r("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, V ? "No derivation relationships match your search." : "No derivation rules.");
    const P = U == null ? void 0 : U.tagId, ee = /* @__PURE__ */ new Set();
    return U && (ee.add(U.tagId), f.connections.forEach((C) => {
      (C.sourceTagId === U.tagId || C.derivedTagId === U.tagId) && (ee.add(C.sourceTagId), ee.add(C.derivedTagId));
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
        ...f.groups.map((C) => r("div", {
          key: `group:${C.componentId}:${C.key}`,
          className: `absolute rounded-xl border ${F === C.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
          style: {
            left: `${C.x}px`,
            top: `${C.y}px`,
            width: `${C.width}px`,
            height: `${C.height}px`
          }
        }, r("div", {
          className: "absolute left-3 top-2 max-w-[16rem] truncate text-[11px] font-semibold uppercase tracking-wide text-secondary",
          title: C.name
        }, C.name))),
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
          ...f.connections.map((C) => {
            const ue = P === C.sourceTagId || P === C.derivedTagId, Ne = U != null, ne = ue ? "var(--color-accent)" : "var(--color-secondary)";
            return r("path", {
              key: `${C.id}:visible`,
              d: C.path,
              fill: "none",
              stroke: ne,
              strokeWidth: ue ? 2.5 : 1.5,
              opacity: Ne && !ue ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...f.nodes.map((C) => {
          const ue = !V || C.name.toLocaleLowerCase().includes(V), Ne = U != null, ne = ee.has(C.tagId), v = (U == null ? void 0 : U.tagId) === C.tagId;
          return r("button", {
            key: `node:${C.tagId}`,
            type: "button",
            onClick: () => ce({ type: "node", id: C.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${v ? "border-accent bg-accent/15 ring-2 ring-accent/25" : ne ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${C.x}px`,
              top: `${C.y}px`,
              width: `${C.width}px`,
              height: `${C.height}px`,
              opacity: !ue || Ne && !ne ? 0.62 : 1
            },
            title: `${C.name} — ${C.segmentGroupName}`,
            "aria-label": `${C.name}, ${C.incomingRuleCount} incoming and ${C.outgoingRuleCount} outgoing derivation rules`
          }, [
            r("span", { key: "name", className: "block truncate text-sm font-medium text-foreground" }, C.name),
            r("span", { key: "counts", className: "mt-1 flex items-center gap-2 text-[11px] text-secondary" }, [
              r("span", { key: "in" }, `${C.incomingRuleCount} in`),
              r("span", { key: "arrow", "aria-hidden": "true" }, "→"),
              r("span", { key: "out" }, `${C.outgoingRuleCount} out`)
            ])
          ]);
        }),
        ...f.connections.filter((C) => C.rules.length > 1).map((C) => {
          const ue = f.nodes.find((ne) => ne.tagId === C.sourceTagId), Ne = f.nodes.find((ne) => ne.tagId === C.derivedTagId);
          return r("div", {
            key: `bundle:${C.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(ue.x + ue.width + Ne.x) / 2 - 24}px`,
              top: `${(ue.y + ue.height / 2 + Ne.y + Ne.height / 2) / 2 - 10}px`
            },
            "aria-label": `${C.rules.length} rules connect ${C.rules[0].sourceTagName} to ${C.rules[0].derivedTagName}`
          }, `${C.rules.length} rules`);
        })
      ])
    ]);
  }
  function B() {
    if (H.length === 0)
      return r(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        V ? "No derivation relationships match your search." : "No derivation rules."
      );
    const P = /* @__PURE__ */ new Map();
    W.forEach((C) => {
      const ue = de(C);
      P.has(ue) || P.set(ue, []), P.get(ue).push(C);
    });
    const ee = [
      ...b.segmentGroups.map((C) => C.key),
      "cross-group"
    ].filter((C) => P.has(C));
    return r("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, ee.map((C) => {
      const ue = b.segmentGroups.find((v) => v.key === C), Ne = C === "cross-group" ? "Cross-group relationships" : (ue == null ? void 0 : ue.name) || "Ungrouped", ne = P.get(C);
      return r("section", { key: C, "aria-label": Ne }, [
        r("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          r("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, Ne),
          r(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${ne.length} rule${ne.length === 1 ? "" : "s"}`
          )
        ]),
        r("div", { key: "table", role: "table", "aria-label": `${Ne} derivation rules` }, [
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
          ...ne.map((v) => r("button", {
            key: v.id,
            type: "button",
            role: "row",
            onClick: () => ce({ type: "rule", id: v.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(T == null ? void 0 : T.id) === v.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            r(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${v.sourceTagName} → ${v.derivedTagName}` },
              `${v.sourceTagName} → ${v.derivedTagName}`
            ),
            r("span", { key: "mappings", role: "cell", className: "text-secondary" }, [
              String(v.slotMappings.length),
              v.slotMappings.some(Jr) ? r("span", { key: "missing", className: "ml-1.5 text-amber-300", title: "Maps a deleted performer slot" }, "⚠") : null
            ]),
            r("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(v.edgeCount))
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
          `${x.length} rules · ${b.nodes.length} tags`
        )
      ]),
      r("button", {
        key: "add",
        type: "button",
        disabled: n || d != null,
        onClick: () => {
          L(p()), ce(null), $();
        },
        className: "rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
      }, "Add rule")
    ]),
    A(),
    r("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 border-b border-border bg-card/40 p-3" }, [
      r("label", { key: "search", className: "min-w-[13rem] flex-1 space-y-1 text-xs text-secondary" }, [
        r("span", { key: "label" }, "Search"),
        r("input", {
          key: "input",
          type: "search",
          value: Q,
          onChange: (P) => {
            ae(P.target.value), ce(null);
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
          value: F,
          disabled: d != null,
          onChange: (P) => {
            ve(P.target.value), ce(null), L(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          r("option", { key: "all", value: "all" }, "All Segment groups"),
          ...b.segmentGroups.map((P) => r("option", { key: P.key, value: P.key }, P.name))
        ])
      ]),
      he === "list" ? r("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        r("span", { key: "label" }, "Sort"),
        r("select", {
          key: "select",
          value: y,
          onChange: (P) => X(P.target.value),
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
        ].map(([P, ee]) => r("button", {
          key: P,
          type: "button",
          onClick: () => {
            De(P), P === "graph" && (_ == null ? void 0 : _.type) === "rule" && ce(null);
          },
          "aria-pressed": he === P,
          className: `rounded px-3 py-1.5 text-sm font-medium ${he === P ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
        }, ee))
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
        he === "graph" ? h() : B()
      ),
      r("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        r("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? w() : N()
      ])
    ])),
    r("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      O ? r("p", { key: "message", role: "status", className: "text-sm text-secondary" }, O) : null
    ]),
    i ? r(Jo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => E(i),
      onClose: () => {
        const P = i.trigger;
        Z(null), requestAnimationFrame(() => {
          P != null && P.isConnected && P.focus();
        });
      }
    }) : null
  ]);
}
function tm({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const n = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: []
  }), [o, i] = K([]), [a, s] = K(null), [l, d] = K([]), [c, u] = K([]), [m, p] = K(!1), [b, f] = K(!1), [y, S] = K(!1), [I, g] = K(""), [O, V] = K(""), [Q, E] = K("graph"), [j, $] = K("all"), [x, k] = K(null), [D, F] = K("relationship"), [U, T] = K(null), [_, Z] = K(null), L = fe(null), X = fe(null), le = Ga().replace(/:/g, "");
  function ae() {
    requestAnimationFrame(() => {
      var v;
      return (v = L.current) == null ? void 0 : v.scrollIntoView({ block: "nearest" });
    });
  }
  async function ve(v) {
    const R = await oe("/derivation-rules", v ? { signal: v } : void 0);
    i(R || []);
  }
  be(() => {
    const v = new AbortController();
    return ve(v.signal).catch((R) => {
      R.name !== "AbortError" && g(R.message || "Unable to load derived segment rules.");
    }), () => v.abort();
  }, []), be(() => {
    const v = new AbortController();
    return a != null && a.sourceTagId ? (p(!0), oe(`/slot-definitions/${a.sourceTagId}`, { signal: v.signal }).then((R) => d(R.definitions || [])).catch((R) => {
      R.name !== "AbortError" && d([]);
    }).finally(() => {
      v.signal.aborted || p(!1);
    })) : (d([]), p(!1)), a != null && a.derivedTagId ? (f(!0), oe(`/slot-definitions/${a.derivedTagId}`, { signal: v.signal }).then((R) => u(R.definitions || [])).catch((R) => {
      R.name !== "AbortError" && u([]);
    }).finally(() => {
      v.signal.aborted || f(!1);
    })) : (u([]), f(!1)), () => v.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), be(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || fs(a) || m || b)
      return;
    const v = `${a.sourceTagId}:${a.derivedTagId}`;
    X.current !== v && (X.current = v, s((R) => !R || Number(R.sourceTagId) !== Number(a.sourceTagId) || Number(R.derivedTagId) !== Number(a.derivedTagId) ? R : cc(R, l, c)));
  }, [
    a == null ? void 0 : a.saved,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    m,
    b
  ]);
  function ce(v, R = !1) {
    R || k({ type: "rule", id: v.id }), X.current = null, d([]), u([]), p(!0), f(!0);
    const re = v.slotMappings.filter((se) => !Jr(se)).map((se) => ({
      sourceSlotDefinitionId: se.sourceSlotDefinitionId,
      derivedSlotDefinitionId: se.derivedSlotDefinitionId
    }));
    s({
      ruleId: v.id,
      sourceTagId: v.sourceTagId,
      sourceTagName: v.sourceTagName,
      derivedTagId: v.derivedTagId,
      derivedTagName: v.derivedTagName,
      slotMappings: re,
      missingSlotMappingCount: v.slotMappings.length - re.length,
      saved: { sourceTagId: v.sourceTagId, derivedTagId: v.derivedTagId, slotMappings: re }
    }), g(""), ae();
  }
  function De(v, R, re = "") {
    X.current = null, v === "source" ? (d([]), p(R != null)) : (u([]), f(R != null)), s((se) => Xu(se, v, R, re));
  }
  async function W(v) {
    X.current = null;
    const R = [ve(), t == null ? void 0 : t()];
    return v.draftKind === "source" ? (p(!0), R.push(oe(`/slot-definitions/${v.tagId}`).then((re) => d(re.definitions || [])).finally(() => p(!1)))) : v.draftKind === "derived" && (f(!0), R.push(oe(`/slot-definitions/${v.tagId}`).then((re) => u(re.definitions || [])).finally(() => f(!1)))), Promise.all(R);
  }
  function Y(v, R, re) {
    s((se) => ({
      ...se,
      slotMappings: se.slotMappings.map((J, Fe) => Fe === v ? { ...J, [R]: re } : J)
    }));
  }
  async function pe() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const v = ta(a, o);
    if (v) {
      g(v.message);
      return;
    }
    if (a.slotMappings.some((R) => !R.sourceSlotDefinitionId || !R.derivedSlotDefinitionId)) {
      g("Complete or remove every performer slot mapping before saving.");
      return;
    }
    S(!0), g(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let R = null;
      if (a.ruleId != null) {
        const se = await oe(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${se.deletedSegmentCount}
Removed lineage edges: ${se.removedEdgeCount}
Shared derived segments retained: ${se.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        R = se.fingerprint;
      }
      g("Saving derived segment rule…");
      const re = await oe("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: R
        })
      });
      if (await ve(), k(Q === "graph" ? { type: "node", id: Number(re.sourceTagId) } : { type: "rule", id: re.id }), s(null), a.ruleId == null)
        try {
          const se = await oe(
            `/derivation-rules/${re.id}/materialization/preview`,
            { method: "POST" }
          );
          T(
            se.createCount + se.linkCount > 0 ? se : null
          ), g(se.createCount + se.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          T(null), g("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        T(null), g("Derived segment rule saved. Previous materializations were removed.");
    } catch (R) {
      g(R.message || "Unable to save derived segment rule.");
    } finally {
      S(!1);
    }
  }
  async function Se() {
    S(!0), g("Removing mappings to deleted performer slots…");
    try {
      const v = await oe("/derivation-rules/missing-slot-mappings/remove", { method: "POST" });
      await ve();
      const R = Number(v == null ? void 0 : v.repairedRuleCount) || 0;
      g(R === 0 ? "No derivation rule maps a deleted performer slot." : `Removed mappings to deleted performer slots from ${R} derivation rule${R === 1 ? "" : "s"}.`);
    } catch (v) {
      g(v.message || "Unable to remove mappings to deleted performer slots.");
    } finally {
      S(!1);
    }
  }
  async function we(v) {
    S(!0), g("Previewing rule deletion…");
    try {
      const R = await oe(
        `/derivation-rules/${v.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${v.sourceTagName} → ${v.derivedTagName}?

Deleted segments: ${R.deletedSegmentCount}
Removed lineage edges: ${R.removedEdgeCount}
Shared derived segments retained: ${R.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const re = `derivation-rule-delete:${v.id}:${R.fingerprint}`;
      await oe(`/derivation-rules/${v.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(re),
          fingerprint: R.fingerprint
        })
      }), Ye(re), await ve(), (a == null ? void 0 : a.ruleId) === v.id && s(null), (x == null ? void 0 : x.type) === "rule" && x.id === v.id && k(null), (U == null ? void 0 : U.ruleId) === v.id && T(null), g(`Rule deleted with ${R.deletedSegmentCount} exclusively derived segment${R.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (R) {
      g(R.message || "Unable to delete derived segment rule.");
    } finally {
      S(!1);
    }
  }
  async function he(v, R = null) {
    const re = R || await oe(
      `/derivation-rules/${v.id}/materialization/preview`,
      { method: "POST" }
    );
    if (re.createCount + re.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const se = `derivation-rule-materialize:${v.id}:${re.fingerprint}`, J = await oe(`/derivation-rules/${v.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Je(se),
        fingerprint: re.fingerprint
      })
    });
    return Ye(se), J;
  }
  async function H(v, R = null) {
    S(!0), g("Finding pending derivations…");
    try {
      const re = await he(v, R);
      if (T(null), await ve(), re.createdCount + re.linkedCount === 0) {
        g("Every applicable derivation is already materialized.");
        return;
      }
      g(
        `${re.createdCount} derived segment${re.createdCount === 1 ? "" : "s"} created and ${re.linkedCount} existing segment${re.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (re) {
      g(re.message || "Unable to materialize pending derivations.");
    } finally {
      S(!1);
    }
  }
  async function ke(v, R) {
    if (R.length === 0) return;
    S(!0), g(`Finding pending derivations from ${v.name}…`);
    let re = 0, se = 0;
    try {
      for (const J of R) {
        const Fe = await he(J);
        re += Fe.createdCount, se += Fe.linkedCount;
      }
      T(null), await ve(), g(re + se === 0 ? `Every outgoing derivation from ${v.name} is already materialized.` : `${re} derived segment${re === 1 ? "" : "s"} created and ${se} existing segment${se === 1 ? "" : "s"} linked from ${v.name}.`);
    } catch (J) {
      await ve().catch(() => {
      }), g(J.message || `Unable to materialize derivations from ${v.name}.`);
    } finally {
      S(!1);
    }
  }
  const de = ta(a, o), w = qe(() => Zu(o), [o]), G = qe(
    () => Vu(o, e),
    [o, e]
  ), A = O.trim().toLocaleLowerCase(), h = G.components.filter((v) => j === "all" || v.segmentGroupKeys.includes(j)).filter((v) => !A || v.nodes.some((R) => R.name.toLocaleLowerCase().includes(A))), B = h.flatMap((v) => v.rules), P = new Set(
    h.flatMap((v) => v.nodes.map((R) => R.tagId))
  ), ee = qe(
    () => Yu(h),
    [h]
  ), C = Q === "list" ? Qu(
    x,
    B,
    A.length > 0
  ) : null, ue = (x == null ? void 0 : x.type) === "node" && G.nodes.find((v) => v.tagId === x.id && P.has(v.tagId)) || null, Ne = [...B].sort((v, R) => D === "source" ? It(v.sourceTagName, R.sourceTagName) || It(v.derivedTagName, R.derivedTagName) : D === "target" ? It(v.derivedTagName, R.derivedTagName) || It(v.sourceTagName, R.sourceTagName) : D === "materialized" ? (Number(R.edgeCount) || 0) - (Number(v.edgeCount) || 0) || It(v.sourceTagName, R.sourceTagName) : It(
    `${v.sourceTagName} ${v.derivedTagName}`,
    `${R.sourceTagName} ${R.derivedTagName}`
  ));
  return r(em, {
    arrowMarkerId: le,
    busy: y,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: _,
    deleteRule: we,
    derivedSlots: c,
    derivedSlotsLoading: b,
    draft: a,
    draftIssue: de,
    editRule: ce,
    editorRef: L,
    emptyDraft: n,
    graph: G,
    layout: ee,
    listSort: D,
    materializationOffer: U,
    materializeOutgoingRules: ke,
    materializeRule: H,
    message: I,
    normalizedQuery: A,
    query: O,
    refreshConfiguredTag: W,
    removeMissingSlotMappings: Se,
    revealEditor: ae,
    rules: o,
    rulesWithMissingSlots: w,
    save: pe,
    segmentGroupKey: j,
    selectedNode: ue,
    selectedRule: C,
    selection: x,
    setConfiguringTag: Z,
    setDraft: s,
    setListSort: F,
    setMaterializationOffer: T,
    setQuery: V,
    setSegmentGroupKey: $,
    setSelection: k,
    setView: E,
    sortedVisibleRules: Ne,
    sourceSlots: l,
    sourceSlotsLoading: m,
    updateMapping: Y,
    updateTag: De,
    view: Q,
    visibleComponents: h,
    visibleRules: B
  });
}
function nm() {
  const [e, t] = K(Ca), n = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => ji({ ...l, [a]: s }));
  }
  function i() {
    t(ji(Po));
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
function rm({ active: e, segmentGroups: t, onSegmentGroupsChanged: n }) {
  const [o, i] = K([]), [a, s] = K(!1), [l, d] = K(!1), [c, u] = K(""), [m, p] = K(""), [b, f] = K("all"), [y, S] = K(() => /* @__PURE__ */ new Set()), [I, g] = K(null);
  be(() => {
    if (!e || a) return;
    const T = new AbortController();
    return d(!0), u(""), oe("/slot-definitions", { signal: T.signal }).then((_) => {
      i(_ || []), s(!0);
    }).catch((_) => {
      _.name !== "AbortError" && u(_.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      T.signal.aborted || d(!1);
    }), () => T.abort();
  }, [e, a]);
  async function O() {
    d(!0), u("");
    try {
      const T = await oe("/slot-definitions");
      i(T || []), s(!0);
    } catch (T) {
      u(T.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function V() {
    const [T] = await Promise.all([
      oe("/slot-definitions"),
      n == null ? void 0 : n()
    ]);
    i(T || []), s(!0), u("");
  }
  function Q() {
    const T = I == null ? void 0 : I.trigger;
    g(null), requestAnimationFrame(() => {
      T != null && T.isConnected && T.focus({ preventScroll: !0 });
    });
  }
  function E(T) {
    S((_) => {
      const Z = new Set(_);
      return Z.has(T) ? Z.delete(T) : Z.add(T), Z;
    });
  }
  const j = qe(
    () => qu(t, o),
    [t, o]
  ), $ = qe(
    () => Wu(j, m, b),
    [j, m, b]
  ), x = j.flatMap((T) => T.tags), k = x.filter((T) => T.definitions.length > 0).length, D = x.length - k, F = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], U = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${x.length} tags · ${k} with slots · ${D} without slots`
      ) : null
    ]),
    r("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      r("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        r("span", { key: "label" }, "Search"),
        r("input", {
          key: "input",
          type: "search",
          value: m,
          onChange: (T) => p(T.target.value),
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
          F.map(([T, _]) => r("button", {
            key: T,
            type: "button",
            onClick: () => f(T),
            "aria-pressed": b === T,
            className: `rounded px-3 py-1.5 text-xs font-medium ${b === T ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, _))
        )
      ]),
      r("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        r("button", {
          key: "expand",
          type: "button",
          onClick: () => S(/* @__PURE__ */ new Set()),
          className: U
        }, "Expand all"),
        r("button", {
          key: "collapse",
          type: "button",
          onClick: () => S(new Set(j.map((T) => T.overviewKey))),
          className: U
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
    a && $.length === 0 ? r(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? r("div", { key: "groups", className: "space-y-3" }, $.map((T) => {
      const _ = y.has(T.overviewKey), Z = T.tags.filter((L) => L.definitions.length > 0).length;
      return r("article", {
        key: T.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        r("button", {
          key: "header",
          type: "button",
          onClick: () => E(T.overviewKey),
          "aria-expanded": !_,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          r("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, _ ? "▸" : "▾"),
          r("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, T.name),
          r(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${T.tags.length} tag${T.tags.length === 1 ? "" : "s"} · ${Z} with slots`
          )
        ]),
        _ ? null : r(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          T.tags.map((L) => r("li", {
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
            }, L.definitions.map((X) => r("li", {
              key: X.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              r("span", { key: "label", className: "font-medium text-foreground" }, Lt(X)),
              ...(X.genderHints || []).map((le) => r("span", {
                key: le,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, Xr(le)))
            ]))),
            r("button", {
              key: "edit",
              type: "button",
              onClick: (X) => g({
                tagId: L.tagId,
                tagName: L.tagName,
                trigger: X.currentTarget
              }),
              "aria-label": `Edit performer slots for ${L.tagName}`,
              className: `${U} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    I ? r(Jo, {
      key: `performer-slots-configure:${I.tagId}`,
      tagId: I.tagId,
      tagName: I.tagName,
      onSaved: V,
      onClose: Q
    }) : null
  ]);
}
function om({ onNavigate: e, profile: t, onProfileChange: n }) {
  const [o, i] = K("general"), [a, s] = K([]), [l, d] = K(!1), [c, u] = K(""), [m, p] = K(va), b = fd(t), f = b.map(([g]) => g);
  be(() => {
    f.includes(o) || i(f[0] || "general");
  }, [t.effectiveMode]);
  async function y(g) {
    const O = await oe("/segment-groups", g ? { signal: g } : void 0);
    s(O || []);
  }
  be(() => {
    const g = new AbortController();
    return y(g.signal).catch((O) => {
      O.name !== "AbortError" && u(O.message || "Unable to load tag groups.");
    }), () => g.abort();
  }, []);
  async function S(g) {
    if (g !== t.requestedMode) {
      d(!0), u("");
      try {
        const O = await oe(
          `/preferences/transition?mode=${encodeURIComponent(g)}`
        );
        let V = !1, Q = null, E = null, j = null, $ = !1;
        if (t.requestedMode === "basic" && g === "full") {
          if (!window.confirm(bd(
            O.recyclingBinCount,
            O.protectedRecyclingBinCount
          )))
            return;
          $ = !0, O.recyclingBinCount > 0 && (V = !0, j = O.recyclingBinFingerprint, Q = `mode-switch-empty-bin:${j}`, E = Je(Q));
        }
        let x = !1;
        if (t.requestedMode === "full" && g === "basic") {
          if (!window.confirm(yd(
            O.extensionOwnedSegmentCount
          )))
            return;
          x = !0;
        }
        const k = await oe("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: g,
            confirmHiddenExtensionOwnedSegments: x,
            confirmBasicHistoryCleanup: $,
            emptyRecyclingBin: V,
            operationId: E,
            expectedRecyclingBinFingerprint: j
          })
        });
        Q && Ye(Q), n == null || n($a(k)), u("Workflow mode saved.");
      } catch (O) {
        u(O.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  const I = { page: "segment-studio" };
  return r("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    r("a", { key: "back", href: "/segment-studio", onClick: (g) => ls(g, e, I), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      b.map(([g, O]) => r("button", {
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
      r(nm)
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
      r(pu, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: S,
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
          checked: m,
          onChange: (g) => {
            const O = g.target.checked;
            xa(O), p(O);
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
      r(tm, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => y()
      })
    ) : null,
    f.includes("performer-slots") ? r(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      r(rm, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => y()
      })
    ) : null,
    c ? r("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function im({ item: e, selected: t, busy: n, onSelect: o, onRestore: i, onPurge: a }) {
  var u, m;
  const s = [...e.slots || []].sort((p, b) => p.sortOrder - b.sortOrder || String(p.slotDefinitionId).localeCompare(String(b.slotDefinitionId))), l = [...new Map(s.map((p) => [
    p.performerId,
    { id: p.performerId, name: p.performerName }
  ])).values()], d = s.map((p) => ({
    slotDefinitionId: p.slotDefinitionId,
    label: Lt(p),
    performer: { id: p.performerId, name: p.performerName }
  })), c = Da(e);
  return r("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: Ha(t)
  }, [
    r("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((u = e.activity) == null ? void 0 : u.name) || "segment"}, ${e.reviewState}, ${Ge(e.startSec)} to ${e.endSec == null ? "end of video" : Ge(e.endSec)}` }, [
      r("div", { key: "image", className: "relative aspect-video bg-black" }, [
        r("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        r("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${Ge(e.startSec)} → end` : `${Ge(e.startSec)} – ${Ge(e.endSec)}`)
      ]),
      r("div", { key: "body", className: "flex flex-col gap-1.5 p-2.5" }, [
        r("div", { key: "segment", className: "flex min-w-0 items-center gap-1.5" }, [
          r(Sn, { key: "state", state: e.reviewState, includeLabel: !1 }),
          r("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((m = e.activity) == null ? void 0 : m.name) || "Tag segment"),
          l.length ? r(Zr, {
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
function am({ item: e, index: t, count: n, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return r("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? r("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, r(ia, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: $d(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : r("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    r("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      r("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      r("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${n}`),
      r("button", { key: "next", type: "button", disabled: t < 0 || t >= n - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      r("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      r("a", { key: "edit", href: Da(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function na({ onNavigate: e, profile: t }) {
  const n = qe(() => {
    const W = sa("ext:com.midnightrider.segment-studio:segments");
    return W ? {
      ...po,
      defaultFilter: { ...po.defaultFilter, ...W.findFilter || {} },
      defaultObjectFilter: W.objectFilter || {}
    } : po;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = la(n), [l, d] = K(null), [c, u] = K(""), [m, p] = K(0), [b, f] = K({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [y, S] = K(null), [I, g] = K(null), [O, V] = K(0), [Q, E] = K(""), [j, $] = K(!0), [x, k] = K(""), D = fe(0), F = Sd(i, l), U = F.slots !== void 0, T = Id(o, F), _ = b.performerSlotsAvailable !== !1, Z = qe(
    () => _ ? [...Fi, hd(l, i, Gd)] : Fi,
    [l, i, _]
  ), L = JSON.stringify(T);
  be(() => {
    const W = new AbortController();
    return u(""), oe("/browse/roles", { signal: W.signal }).then(d).catch((Y) => {
      Y.name !== "AbortError" && (Y.status === 403 ? (d([]), f((pe) => ({ ...pe, performerSlotsAvailable: !1 }))) : u(Y.message || "Unable to load performer slot roles."));
    }), () => W.abort();
  }, [m]), be(() => {
    F !== i && !U && s(F);
  }, [F, i, U]), be(() => {
    if (U) return;
    const W = ++D.current, Y = new AbortController();
    return $(!0), k(""), oe("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(T), signal: Y.signal }).then((pe) => {
      W === D.current && f({ ...pe, totalCount: pe.totalCount ?? pe.total ?? 0 });
    }).catch((pe) => {
      if (!(W !== D.current || pe.name === "AbortError")) {
        if (pe.status === 400 && pe.message.includes("unrestricted performer read access")) {
          f((Se) => ({ ...Se, performerSlotsAvailable: !1 })), s(Cd(F)), E("Performer slot filters were cleared because performer details are unavailable.");
          return;
        }
        k(pe.message);
      }
    }).finally(() => {
      W === D.current && $(!1);
    }), () => {
      D.current++, Y.abort();
    };
  }, [L, O, U]);
  const X = b.items.findIndex((W) => W.key === y), le = b.items[X] || null;
  function ae(W) {
    s(W), a({ ...o, page: 1 });
  }
  function ve() {
    const W = document.querySelector(`[data-segment-key="${y}"]`);
    S(null), requestAnimationFrame(() => W == null ? void 0 : W.focus());
  }
  async function ce(W) {
    var Se;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    g(W.key), E("");
    const Y = `browse-restore:${W.itemId}:${W.revision}`, pe = Je(Y);
    try {
      const we = (he = !1) => oe(`/bin/${W.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: pe,
          expectedRevision: W.revision,
          discardMissingImage: he
        })
      });
      try {
        await we(Go(Y));
      } catch (he) {
        if (((Se = he.payload) == null ? void 0 : Se.code) !== "missing-image" || !window.confirm(`${he.message}

Continue and discard the missing image reference?`))
          throw he;
        Bo(Y), await we(!0);
      }
      Ye(Y), y === W.key && S(null), E("Segment restored to Cove."), V((he) => he + 1);
    } catch (we) {
      E(we.message || "Unable to restore the segment."), we.status === 409 && V((he) => he + 1);
    } finally {
      g(null);
    }
  }
  async function De(W) {
    g(W.key), E("");
    try {
      const Y = await oe(`/items/${W.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: W.revision })
      });
      if (!Ua(Y, E) || !qd(Y))
        return;
      const pe = `browse-dependency-delete:${W.itemId}:${Y.fingerprint}`;
      await oe(`/items/${W.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(pe),
          fingerprint: Y.fingerprint
        })
      }), Ye(pe), y === W.key && S(null), E(`${Y.deletedSegmentCount} segment${Y.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), V((Se) => Se + 1);
    } catch (Y) {
      E(Y.message || "Unable to permanently delete the segment."), Y.status === 409 && V((pe) => pe + 1);
    } finally {
      g(null);
    }
  }
  return r("div", { className: "w-full space-y-5" }, [
    r(Vo, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    r(da, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: a,
      totalCount: b.totalCount,
      isLoading: j,
      error: x ? new Error(x) : null,
      onRetry: () => V((W) => W + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: Z,
      objectFilter: F,
      supportsFilterExpressions: !0,
      onObjectFilterChange: ae,
      searchPlaceholder: "Search segments..."
    }, [
      r(am, { key: "player", item: le, index: X, count: b.items.length, onPrevious: () => {
        var W;
        return S((W = b.items[X - 1]) == null ? void 0 : W.key);
      }, onNext: () => {
        var W;
        return S((W = b.items[X + 1]) == null ? void 0 : W.key);
      }, onClose: ve, onNavigate: e }),
      c ? r("div", { key: "roles-error", role: "alert", className: "flex flex-wrap items-center gap-3 rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, [
        r("span", { key: "text" }, `Performer slot roles could not be loaded: ${c}`),
        r("button", { key: "retry", type: "button", onClick: () => p((W) => W + 1), className: "font-semibold text-accent hover:underline" }, "Retry")
      ]) : null,
      Q ? r("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, Q) : null,
      !j && b.items.length === 0 ? r("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      j ? null : r("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, b.items.map((W) => r(im, {
        key: W.key,
        item: W,
        selected: W.key === y,
        busy: I === W.key,
        onSelect: () => S(W.key),
        onRestore: ce,
        onPurge: De
      })))
    ])
  ]);
}
function sm({ onNavigate: e, profile: t }) {
  const [n, o] = K([]), [i, a] = K(""), [s, l] = K(0), [d, c] = K(!0), [u, m] = K(null), [p, b] = K(""), f = fe(null);
  async function y(g) {
    const O = await oe("/bin", g ? { signal: g } : void 0);
    return o(O.items || []), a(O.fingerprint || ""), l(Number(O.totalCount) || 0), O;
  }
  be(() => {
    const g = new AbortController();
    return c(!0), y(g.signal).catch((O) => {
      O.name !== "AbortError" && b(O.message);
    }).finally(() => {
      g.signal.aborted || c(!1);
    }), () => g.abort();
  }, []), aa(Oo, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var g;
      return (g = f.current) == null ? void 0 : g.call(f);
    }
  }]);
  async function S(g) {
    var Q;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    m(g.itemId), b("");
    const O = `restore:${g.itemId}:${g.revision}`, V = Je(O);
    try {
      const E = (j = !1) => oe(`/bin/${g.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: V, expectedRevision: g.revision, discardMissingImage: j })
      });
      try {
        await E(Go(O));
      } catch (j) {
        if (((Q = j.payload) == null ? void 0 : Q.code) !== "missing-image" || !window.confirm(`${j.message}

Continue and discard the missing image reference?`)) throw j;
        Bo(O), await E(!0);
      }
      Ye(O), await y(), dr(), b("Segment restored with a new native ID.");
    } catch (E) {
      b(E.message || "Unable to restore the segment."), E.status === 409 && await y();
    } finally {
      m(null);
    }
  }
  async function I() {
    if (u == null)
      try {
        const g = await za({
          items: n,
          fingerprint: i,
          totalCount: s
        }, () => {
          m(-1), b("");
        });
        if (g.status !== "emptied") return;
        await y(), dr(), b(`${g.segmentCount} segment${g.segmentCount === 1 ? "" : "s"} from ${g.sceneCount} scene${g.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (g) {
        b(g.message || "Unable to empty the recycling bin."), g.status === 409 && await y();
      } finally {
        m(null);
      }
  }
  return f.current = I, r("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    r(Vo, {
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
    p ? r("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, p) : null,
    d ? r("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && n.length === 0 ? r("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...n.map((g) => r("article", { key: g.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      r("div", { key: "copy", className: "min-w-0 flex-1" }, [
        r("h2", { key: "title", className: "truncate font-semibold" }, `${g.tagName || "Tag segment"} · ${g.videoTitle || `Video ${g.videoId}`}`),
        r("p", { key: "time", className: "font-mono text-xs text-secondary" }, g.endSec == null ? Ge(g.startSec) : `${Ge(g.startSec)} – ${Ge(g.endSec)}`),
        r("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${g.sourceKey || "unknown"}`)
      ]),
      r("a", { key: "video", href: `/video/${g.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      r("button", { key: "restore", type: "button", disabled: u != null, onClick: () => S(g), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const ra = "ext:com.midnightrider.segment-studio:videos";
async function lm(e, t, n, o) {
  const i = await zd("/api/videos/find", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lu(e, t, { fullMode: n })),
    signal: o
  }), a = Array.isArray(i == null ? void 0 : i.items) ? i.items : [], s = a.length > 0 ? await oe("/videos/segment-counts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoIds: a.map((d) => d.id) }),
    signal: o
  }) : { items: [] }, l = new Map(((s == null ? void 0 : s.items) ?? []).map((d) => [d.videoId, d]));
  return { items: a.map((d) => cu(d, l.get(d.id))), totalCount: (i == null ? void 0 : i.totalCount) ?? 0 };
}
function ho({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: n = "editor",
  profile: o
}) {
  const i = t || n === "review", a = qe(() => {
    var le;
    const L = sa(ra), X = (le = L == null ? void 0 : L.uiOptions) == null ? void 0 : le.displayMode;
    return L ? {
      ...Vt,
      defaultFilter: Eo({ ...Vt.defaultFilter, ...L.findFilter || {} }),
      defaultObjectFilter: Ro(L.objectFilter || {}, { fullMode: i }),
      defaultDisplayMode: Vt.allowedDisplayModes.includes(X) ? X : Vt.defaultDisplayMode
    } : Vt;
  }, []), { filter: s, objectFilter: l, displayMode: d, setFilter: c, setObjectFilter: u, setDisplayMode: m } = la(a), [p, b] = K({ items: [], totalCount: 0 }), [f, y] = K(!0), [S, I] = K(""), [g, O] = K(0), [V, Q] = K(/* @__PURE__ */ new Set()), E = fe(0), j = fe(null), $ = JSON.stringify(s), x = JSON.stringify(l);
  be(() => {
    const L = Ro(l, { fullMode: i });
    L !== l && u(L);
    const X = Eo(s);
    X !== s && c(X);
  }, [$, x, i]), be(() => {
    j.current = null, Q(/* @__PURE__ */ new Set());
  }, [$, x]), be(() => {
    const L = ++E.current, X = new AbortController();
    return y(!0), I(""), lm(s, l, i, X.signal).then((le) => {
      L === E.current && b(le);
    }).catch((le) => {
      L === E.current && le.name !== "AbortError" && I(le.message || "Unable to discover videos.");
    }).finally(() => {
      L === E.current && y(!1);
    }), () => {
      E.current++, X.abort();
    };
  }, [$, x, i, g]);
  function k(L) {
    c({ ...L, page: L.page || 1 });
  }
  function D(L) {
    u(L), c({ ...s, page: 1 });
  }
  function F(L, X = !1) {
    Q((le) => uu(
      le,
      p.items.map((ae) => ae.videoId),
      L,
      j.current,
      X
    )), j.current = L;
  }
  function U() {
    j.current = null, Q(new Set(p.items.map((L) => L.videoId)));
  }
  function T() {
    j.current = null, Q(/* @__PURE__ */ new Set());
  }
  function _() {
    j.current = null, Q((L) => new Set(p.items.map((X) => X.videoId).filter((X) => !L.has(X))));
  }
  const Z = qe(() => du(cl), []);
  return r("div", { className: "w-full space-y-5" }, [
    r(Vo, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && n === "editor",
      profile: o
    }),
    r(da, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      filterMode: "videos",
      savedFilterScope: ra,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: s,
      onFilterChange: k,
      totalCount: p.totalCount,
      isLoading: f,
      error: S ? new Error(S) : null,
      onRetry: () => O((L) => L + 1),
      sortOptions: ul,
      displayMode: d,
      onDisplayModeChange: m,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: Z,
      objectFilter: l,
      supportsFilterExpressions: !0,
      onObjectFilterChange: D,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: yn ? V : void 0,
      onSelectAll: yn ? U : void 0,
      onSelectNone: yn ? T : void 0,
      onInvertSelection: yn ? _ : void 0,
      // The host renders whatever extensions contribute for a video selection, so
      // Run AI here is the same action, and the same dialog, as the native videos
      // page, in Basic and Full mode alike. Selection serves only this bar, so it
      // is offered only on hosts that render it. Only the contributed actions are
      // rendered: Segment Studio's own ownership and lineage rules govern
      // deletion, so the native bulk mutations that would bypass them stay out of
      // this bar.
      selectionActions: yn && V.size > 0 ? r(Fa, { entityType: "video", selectedIds: V }) : null
    }, [
      !f && p.items.length === 0 ? r("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !f && d === "grid" ? r("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, p.items.map((L) => r(mu, { key: L.videoId, item: L, onNavigate: e, showReviewStates: i, selected: V.has(L.videoId), selectionActive: V.size > 0, onSelect: yn ? F : null }))) : null,
      !f && d === "list" ? r("section", { key: "rows", className: "space-y-3" }, p.items.map((L) => r(gu, { key: L.videoId, item: L, onNavigate: e, showReviewStates: i, selected: V.has(L.videoId), selectionActive: V.size > 0, onSelect: yn ? F : null }))) : null
    ])
  ]);
}
function oa({
  videoId: e,
  onNavigate: t,
  compatibilityMode: n = !1,
  profile: o
}) {
  const [i, a] = K(null), [s, l] = K(!0), [d, c] = K(""), u = fe(0), m = fe(0), p = fe(e), b = fe(0), f = fe([]), y = Hc();
  p.current = e;
  const [S] = K(() => Ml({
    beginRequest: () => ({ requestId: ++m.current, videoId: p.current, updateSequence: b.current }),
    fetchDetail: ($) => oe(I($.videoId)),
    isCurrent: ($) => Ar($.requestId, m.current, $.videoId, p.current),
    isSameVideo: ($) => $.videoId === p.current
  })), I = ($) => `/videos/${$}/editor`;
  async function g($, x, k) {
    const D = await oe(I(x), k ? { signal: k.signal } : void 0);
    return Ar($, k ? u.current : m.current, x, p.current) ? (a(D), !0) : !1;
  }
  be(() => {
    const $ = ++u.current, x = e, k = new AbortController();
    return a(null), l(!0), c(""), g($, x, k).catch((D) => {
      Ar($, u.current, x, p.current) && D.name !== "AbortError" && c(D.message || "Unable to load the editor.");
    }).finally(() => {
      Ar($, u.current, x, p.current) && l(!1);
    }), () => {
      u.current++, m.current++, k.abort();
    };
  }, [e]);
  function O($, x) {
    if (typeof $ == "function") {
      const k = ++b.current;
      f.current = [...f.current.slice(-199), { sequence: k, videoId: x, update: $ }];
    } else
      b.current += 1, f.current = [];
    a((k) => (k == null ? void 0 : k.video.id) !== x ? k : typeof $ == "function" ? $(k) : $);
  }
  function V($, x) {
    return f.current.filter((k) => k.sequence > x.updateSequence && k.videoId === x.videoId).reduce((k, D) => D.update(k), $);
  }
  function Q() {
    return S({
      prepare: V,
      onLoaded: ($) => {
        a($), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: ($) => c($.message || "Unable to reload the latest segment.")
    });
  }
  function E() {
    return S({
      prepare: V,
      onLoaded: ($) => {
        a($), c("");
      },
      onError: ($) => c($.message || "Unable to reload performer slots.")
    });
  }
  function j() {
    return S({
      prepare: V,
      onLoaded: ($) => {
        a($), c("");
      },
      onError: ($) => c($.message || "Unable to load the new AI review results.")
    });
  }
  return r("div", {
    className: `mx-auto flex w-full flex-col gap-2 ${y ? "lg:overflow-hidden" : "p-3 sm:p-4"}`,
    style: y ? {
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
      r(fl, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      r("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? r(Hu, {
      key: i.video.id,
      detail: i,
      onDetailChange: O,
      onConflict: Q,
      onReload: E,
      onAnalysisCompleted: j,
      onSlotsChanged: E,
      splitLayout: y,
      profile: o,
      initialSegmentId: Gi() ? -Gi() : Td(),
      compatibilityMode: n,
      onNavigate: t
    }) : null
  ]);
}
function dm(e, t, n) {
  return t === "settings" || e === "settings" || t == null && e == null && n.replace(/\/+$/, "") === "/segment-studio/settings";
}
function cm(e, t, n) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(n.replace(/\/+$/, ""));
}
function um(e, t, n) {
  return t === "bin" || e === "bin" || t == null && e == null && n.replace(/\/+$/, "") === "/segment-studio/bin";
}
function mm({
  id: e,
  slug: t,
  onNavigate: n,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = md(o), l = dm(e, t, window.location.pathname), d = cm(e, t, window.location.pathname), c = um(e, t, window.location.pathname), u = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (pd(u, o) === "videos" && u !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), r(ho, {
      onNavigate: n,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return r(om, {
    onNavigate: n,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return r(na, { onNavigate: n, profile: o });
    const b = Number(e);
    return Number.isInteger(b) && b > 0 ? r(oa, {
      videoId: b,
      onNavigate: n,
      compatibilityMode: !0,
      profile: o
    }) : r(ho, {
      onNavigate: n,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return r(sm, { onNavigate: n, profile: o });
  const p = Number(e);
  return d ? r(na, { onNavigate: n, profile: o }) : Number.isInteger(p) && p > 0 ? r(oa, {
    videoId: p,
    onNavigate: n,
    compatibilityMode: s === "review",
    profile: o
  }) : r(ho, {
    onNavigate: n,
    mode: s,
    profile: o
  });
}
function gm({ id: e, slug: t, onNavigate: n }) {
  const [o, i] = K(null), [a, s] = K("");
  return be(() => {
    const l = new AbortController();
    return oe("/preferences", { signal: l.signal }).then((d) => i($a(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? r("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? r("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : r(mm, {
    id: e,
    slug: t,
    onNavigate: n,
    profile: o,
    onProfileChange: i
  });
}
function fm(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const n = Number(t[0]);
  return Number.isInteger(n) && n > 0 ? `/segment-studio/${n}` : null;
}
function pm(e, t) {
  const n = fm(t);
  return n ? (window.location.assign(n), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const Um = {
  components: { SegmentStudioPage: gm },
  actionHandlers: { openSegmentStudio: pm }
};
export {
  Gu as ANALYSIS_RUN_CHECK_INTERVAL_MS,
  Ln as CLEARED_SEGMENT_SELECTION_ID,
  Zt as SEGMENT_STUDIO_CAPABILITIES,
  Oo as SEGMENT_STUDIO_EXTENSION_ID,
  pr as SEGMENT_STUDIO_SHORTCUTS,
  Pl as activeEditorFilterCount,
  Zd as activeSwimlaneLabelStyle,
  Fc as addPendingChange,
  cc as applyDerivationRuleSlotSuggestions,
  sn as applyFeedbackEditorDelta,
  Wo as applyPendingChanges,
  qi as applySegmentMergeDelta,
  Oc as areSegmentsBusy,
  Pr as availableDerivationRuleSlots,
  Jd as basicSegmentTimelineStyle,
  $d as browseClipEnd,
  Da as browseEditorHref,
  Id as buildBrowseRequest,
  Vu as buildDerivationRuleGraph,
  lu as buildDiscoveryFindRequest,
  xl as buildMinuteTimelineTicks,
  qu as buildPerformerSlotOverview,
  Dd as buildSegmentQuickSearchEntries,
  pc as buildSegmentRailRows,
  yc as buildTimelineRows,
  Sm as buildTimelineTicks,
  Nl as calculateCenteredTimelineScroll,
  xo as calculateEditorPanelMaximum,
  Sl as calculateMinuteLabelStride,
  km as calculateMinuteTimelineWidth,
  $l as calculateSwimlaneTitleMaximum,
  Il as calculateTimelinePlayheadPosition,
  Lo as calculateTimelineRatioBounds,
  Rl as calculateTimelineRatioFromPointer,
  wm as calculateVerticalRevealOffset,
  bn as clampEditorPanelWidth,
  Fr as clampSwimlaneTitleWidth,
  ha as clampTimelineRatio,
  jo as clampTimelineRatioForHeight,
  _r as clampTimelineZoom,
  tu as compactProvenanceSummary,
  Uc as confirmPendingChange,
  Ml as createEditorReloader,
  td as createQueuedReviewRequest,
  Pc as createSaveQueue,
  Uu as createSegmentAnalysisRequestScope,
  Um as default,
  Zu as derivationRulesWithMissingSlots,
  os as discardPendingChange,
  du as discoveryCriteria,
  Hd as downloadFileNameFromContentDisposition,
  Ll as dualRangeValueFromPointer,
  Pi as duplicateIdentityFromResponse,
  od as duplicateOperationKey,
  Sa as editorVisibilityIncludingSegment,
  vc as expandedSwimlanes,
  yd as extensionOwnedSegmentsModeSwitchPrompt,
  Nc as feedbackFrameTimestamps,
  Cc as feedbackResultMatchesAction,
  Ic as feedbackSelectionPlan,
  Ol as filterDerivedSegments,
  mo as filterEditorSegments,
  Wu as filterPerformerSlotOverview,
  Ad as filterSegmentQuickSearch,
  Tm as filterSegmentStudioShortcuts,
  kc as findAdjacentSegmentGroupKey,
  cd as findAdjacentShot,
  Zl as findEditorShortcut,
  ba as findInitialSegmentSelection,
  vl as findNearestSegmentInCurrentSwimlane,
  Br as findNextUnprocessed,
  dd as findPublishedSelectionIdentity,
  mt as findSegmentByStableIdentity,
  El as findSegmentFromPlayhead,
  hl as findSegmentNearPlayhead,
  Sc as findSwimlaneRangeSelection,
  $o as findSwimlaneSelection,
  Ed as findUniquePerformerSlotAssignment,
  zr as findUnreviewedSelection,
  ic as focusDialogDefaultButton,
  Xr as formatGenderHint,
  ud as frameStepSeconds,
  Oa as generatePerformerSlotAssignmentRecommendations,
  wu as groupApprovedDraftsForPublishing,
  Md as groupAutoAssignCandidates,
  $c as groupIncorrectExamplesByTag,
  Tu as groupMaterializationOutputs,
  vn as groupSegmentsIntoSwimlanes,
  bc as groupSelectedSwimlanes,
  Ho as groupSwimlanesBySegmentGroup,
  Pt as handleModalKey,
  Ja as hasGroupedSwimlanes,
  Un as hasSegmentStudioCapability,
  ns as heldTagChangeFor,
  ld as heldTagReady,
  Vi as hideCollectedFeedbackSegments,
  _i as historyActionsForTarget,
  Or as incorrectExampleHistoryState,
  Va as indexPerformerSlotsBySegment,
  Mm as initialReviewFilter,
  Ec as insertSegmentProjection,
  Ar as isCurrentEditorRequest,
  tc as isEditableTarget,
  jn as isEditorHeldByOtherWork,
  Dm as isEditorShortcutOwner,
  Ac as isKindRunning,
  Jr as isMissingSlotMapping,
  Yr as isPublishableApprovedDraft,
  Bm as isSaveQueueBusy,
  fs as isSavedDerivationRulePair,
  To as isSegmentCreationPending,
  um as isSegmentStudioBinRoute,
  cm as isSegmentStudioSegmentsRoute,
  dm as isSegmentStudioSettingsRoute,
  Ur as isTemporarySegment,
  Ju as layoutDerivationRuleComponent,
  Yu as layoutDerivationRuleComponents,
  Mc as mergeSegmentsProjection,
  Sd as migrateLegacyBrowseFilter,
  Ro as migrateLegacyDiscoveryFilter,
  Eo as migrateLegacyDiscoverySort,
  lc as multiSelectionActionHint,
  dn as normalizeCollapsedSegmentGroups,
  Vr as normalizeDiscoveryIds,
  Gt as normalizeEditorSegmentFilters,
  an as normalizeGender,
  Li as normalizeReviewFilter,
  Uo as normalizeSegmentGroupColor,
  $a as normalizeSegmentStudioFeatureProfile,
  Rm as normalizeSegmentStudioMode,
  No as normalizeSegmentStudioPublicMode,
  Tl as parseEditorLayout,
  Al as parseHideDerivedSegmentsPreference,
  Dl as parseMergeConfirmationPreference,
  Ia as parsePlaybackShortcutConfig,
  Ql as parseShortcutBindingOverrides,
  Gn as patchPerformerSlotProjection,
  Lm as patchSegmentProjection,
  Kc as pendingChangesReducer,
  Gc as pendingInsertedSegments,
  ql as percentageSeekTime,
  Rd as performInitialSegmentSeek,
  yt as performerOptionId,
  Hr as performerSlotHistoryState,
  Lt as performerSlotLabel,
  uc as performerSlotPresentation,
  Pm as performerSlotStatus,
  _o as performerSlotStatusFromSegmentSlots,
  Wa as performerSlotsForSegment,
  Ht as provenanceSourceLabel,
  as as prunePendingChanges,
  sd as queueCreatedSegmentTagChoice,
  Pa as rankPerformerOptions,
  wc as reconcileSegmentGroupKey,
  zl as reconcileSelectedSegmentIds,
  fu as recyclingBinActionText,
  Wd as recyclingBinDeletionPrompt,
  Ka as recyclingBinDeletionSummary,
  bd as recyclingBinModeSwitchPrompt,
  Em as removeQueuedReviewsForSegments,
  jm as removeSegmentsProjection,
  Gi as requestedOwnedItemId,
  Td as requestedSegmentId,
  Fl as resolveEditorSegmentSelection,
  nd as resolveQueuedReviewRequest,
  id as resolveSegmentCreationAction,
  pd as resolveSegmentStudioRoute,
  Xl as resolveSegmentStudioShortcuts,
  es as resolveSegmentTarget,
  Qu as resolveSelectedDerivationRule,
  Mi as resolveSelectedSegments,
  Au as restoreDisabledToolbarActionFocus,
  _u as restorePublishApprovedFocus,
  Fm as restoreSegmentFieldsProjection,
  Gm as restoreSegmentsProjection,
  Xu as retagDerivationRuleDraft,
  Bc as retargetPendingChanges,
  Za as revealCollapsedSegmentGroup,
  Kn as sameSegmentIdentity,
  ts as savingSegmentIdFrom,
  _a as segmentBadgeStyle,
  Xd as segmentGroupEdgeColor,
  Qr as segmentGroupHeaderBackground,
  zt as segmentGroupKeyForSegment,
  zo as segmentHistoryIdentity,
  Dr as segmentHistoryState,
  pt as segmentIdentity,
  Ha as segmentRailItemStyle,
  Am as segmentStateStyle,
  fm as segmentStudioActionTarget,
  md as segmentStudioLegacyMode,
  Vd as segmentTimelineStyle,
  Ft as segmentsHistoryState,
  _l as selectAllVideoSegmentIds,
  kd as selectedBrowseStates,
  Qa as selectedSwimlaneMerge,
  Gr as selectionReferenceForSegment,
  ls as setBackLinkNavigation,
  is as settlePendingChange,
  ac as sharedPerformerSlotShape,
  sc as sharedTagPerformerSlotShape,
  Bn as shortcutAvailableInMode,
  ed as shortcutBindingDisplayText,
  Nm as shortcutBindingFromEvent,
  Cm as shortcutBindingsOverlap,
  $m as shortcutModesOverlap,
  Yl as shortcutRequiresSingleSegment,
  fo as shotBoundaryFingerprint,
  oc as shouldAcceptCurrentTagFromEnter,
  rc as shouldDismissPopover,
  Im as shouldExitShortcutCapture,
  Om as shouldHandleEditorShortcut,
  Bu as shouldLoadSegmentAnalysis,
  Xi as shouldReloadAfterSegmentMutation,
  wo as shouldRestoreTransitionSelection,
  Od as shouldShowQuickSearchGroups,
  hd as slottedPerformerCriterion,
  Ai as splitShortcutCategoriesIntoColumns,
  Ku as startCompletedRunWatch,
  dc as suggestDerivationRuleSlotMappings,
  gr as swimlaneDisplayLabel,
  ec as swimlaneMarkerTop,
  Qd as swimlaneStripeBackground,
  ad as tagEditorLockedBySave,
  eo as targetsOverlap,
  Cl as timelineContentStyle,
  $i as timelinePlayheadHorizontalStyle,
  Yd as timelineSegmentWidth,
  kl as timelineTickAlignment,
  wl as timelineTickPosition,
  vo as timelineTimePercent,
  cu as toDiscoveryItem,
  xc as toggleAllCollapsedSegmentGroups,
  Oi as toggledSelectionReviewState,
  Jt as trapModalFocus,
  Ud as tryParseJsonResponseText,
  Kl as updateAnchoredSegmentSelection,
  uu as updateDiscoverySelection,
  jl as updateDualRangeValues,
  Bl as updateSegmentCollectionSelection,
  Ul as updateSegmentRangeSelection,
  ka as updateSegmentSelection,
  ta as validateDerivationRuleDraft,
  Ci as validateSegmentTiming,
  Fo as videoPerformerOptions,
  yo as videoPerformerSlotAssignments,
  fd as visibleSegmentStudioSettingsTabs,
  gd as visibleSegmentStudioTabs,
  Ya as visibleVirtualRows,
  Cd as withoutSlottedPerformers
};
