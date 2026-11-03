import Ao from "@cove/runtime/react";
import { createPortal as ll } from "@cove/runtime/react-dom";
import { extensionFetch as Do } from "@cove/runtime/api";
import * as ur from "@cove/runtime/components";
import { formatDuration as dl, EntityReferenceSelector as mr, useExtensionKeyboardBindings as cl, VideoPlayer as ia, useRegisterExtensionKeyboardActions as aa, getDefaultFilter as sa, useListUrlState as la, ListPage as da, VIDEO_CRITERIA as ul, VIDEO_SORT_OPTIONS as ml } from "@cove/runtime/components";
import { StepBack as gl, StepForward as pl, Loader2 as fl } from "@cove/runtime/lucide-react";
const Oo = "com.midnightrider.segment-studio", yl = "segment-studio-editor", ca = "segment-studio.layout.v1", Sn = "segment-studio.operations.v1", ua = "segment-studio.collapsed-segment-groups.v1", ma = "segment-studio.playback-shortcuts.v1", ga = "segment-studio.timing-clipboard.v1", pa = "segment-studio.hide-derived-segments.v1", fa = "segment-studio.merge-confirmation.v1", At = ["unreviewed", "approved", "rejected"], bl = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], wi = "(min-width: 1024px) and (min-height: 640px)", Ni = "(min-width: 1024px) and (min-height: 900px)", gr = 1e-3, Ii = 15, hl = 30, ya = 12, Ot = {
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
  const i = e.findIndex((m) => m.markers.some((f) => f.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const m = e.flatMap((f) => f.markers.map((h) => h.segment)).filter((f) => f.reviewState === "unreviewed");
    return n < 0 ? m.at(-1) ?? null : m[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((m) => m.segment.id === t);
  if (!o)
    return ((u = (n < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((f) => f.segment.reviewState === "unreviewed")) == null ? void 0 : u.segment) ?? null;
  const l = e.flatMap((m) => m.markers.map((f) => f.segment)), d = l.findIndex((m) => m.id === t);
  return (n < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((m) => m.reviewState === "unreviewed") ?? null;
}
function vl(e, t, n, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((u, m) => u.markers.filter(({ segment: f }) => {
    const h = Number(f.startSec), g = f.endSec == null ? h + hl : Number(f.endSec);
    return Number.isFinite(h) && Number.isFinite(g) && g >= h && h <= i + Ii + gr && g >= i - Ii - gr;
  }).map(({ segment: f }) => ({ segment: f, laneIndex: m }))).sort((u, m) => u.laneIndex - m.laneIndex || Math.abs(u.segment.startSec - i) - Math.abs(m.segment.startSec - i) || u.segment.id - m.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((u) => u.markers.some((m) => m.segment.id === o));
  if (s < 0) return n < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((u) => u.laneIndex !== s);
  return l.length === 0 ? n < 0 ? a.at(-1).segment : a[0].segment : n < 0 ? ((d = l.findLast((u) => u.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((u) => u.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function Sl(e, t, n) {
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
function Hr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function wm(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const n = Math.max(2, Math.floor(t));
  return Array.from({ length: n }, (o, i) => e * i / (n - 1));
}
function xl(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, n) => n * 60);
}
function Nm(e, t = 1, n = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, n) : Math.ceil(e / 60) * Math.max(1, n) * Math.max(1, t);
}
function kl(e, t, n = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(n) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function wl(e, t, n = null) {
  return e <= 0 || e >= t - 1 && (n == null || n >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Nl(e, t, n) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && n >= 100 ? { right: "0" } : { left: `${n}%` };
}
function Il(e, t, n, o, i = 160, a = 0) {
  if (!(t > 0) || !(n > o)) return 0;
  const s = Math.max(0, n - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(n - o, Math.max(0, l - o / 2));
}
function vo(e, t) {
  const n = Number(e);
  return t > 0 && Number.isFinite(n) ? Math.min(1, Math.max(0, n / t)) * 100 : 0;
}
function Cl(e, t, n = 10) {
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
function $l(e, t = ya) {
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
function So(e, t) {
  const n = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(n) ? n : 560));
}
function bn(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? Ot.detailWidth : Math.min(So(t, 0), Math.max(240, e));
}
function Gr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? Ot.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function Tl(e) {
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
function Rl(e) {
  if (!e) return { ...Ot };
  try {
    const t = JSON.parse(e), n = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof n == "number" && Number.isFinite(n) ? ha(n) : Ot.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: bn(t == null ? void 0 : t.detailWidth),
      markerRailWidth: bn(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: Gr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...Ot };
  }
}
function El(e, t, n) {
  return n > 0 ? jo((t + n - e) / n, n) : Ot.timelineRatio;
}
function Im(e, t, n, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < n + a ? e - n - a : t > o - a ? t - o + a : 0;
}
function Ml(e, t, n, o = null) {
  var d;
  const i = [...e].sort((c, u) => c.startSec - u.startSec || c.id - u.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= gr ? i[a + (n < 0 ? -1 : 1)] ?? null : n < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function Dr(e, t, n, o) {
  return e === t && n === o;
}
function Al({ beginRequest: e, fetchDetail: t, isCurrent: n, isSameVideo: o }) {
  let i = null, a = null;
  return function({ onLoaded: l, onError: d, prepare: c = null }) {
    const u = e(), m = (async () => {
      try {
        const f = await t(u);
        if (n(u)) {
          const h = c ? c(f, u) : f;
          return l(h), h;
        }
      } catch (f) {
        if (n(u))
          return d(f), null;
      }
      return o(u) && i !== m && a.videoId === u.videoId ? i : null;
    })();
    return i = m, a = u, m;
  };
}
const Ln = "__segment-studio-cleared-selection__";
function Dl(e) {
  return e === "true";
}
function Ol(e) {
  return e !== "false";
}
function va() {
  try {
    return Ol(window.localStorage.getItem(fa));
  } catch {
    return !0;
  }
}
function Sa(e) {
  try {
    window.localStorage.setItem(fa, String(!!e));
  } catch {
  }
}
function Qr(e) {
  return !e.published && e.reviewState === "approved" && !e.isDerived;
}
function Pl(e, t) {
  return t ? e.filter((n) => !n.isDerived) : e;
}
function Gt(e = {}) {
  const t = At.filter((u) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(u) : !0), n = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (u, m) => {
    const f = Number(u);
    return Number.isFinite(f) ? Math.min(1, Math.max(0, f)) : m;
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
function go(e, t, n, o = !1, i = []) {
  var c, u;
  const a = Gt(n), s = a.performerId == null ? null : new Set((t || []).filter((m) => Number(m.performerId) === a.performerId).map((m) => m.segmentId)), l = new Set((i || []).flatMap((m) => m.tags || []).map((m) => Number(m.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((u = (c = (i || []).find((m) => Number(m.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : u.map((m) => Number(m.tagId))) || []);
  return Pl(e || [], o).filter((m) => {
    if (m.reviewState != null && !a.reviewStates.includes(m.reviewState) || s && !s.has(m.id) || a.tagId != null && Number(m.tagId) !== a.tagId || d && !d.has(Number(m.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(m.tagId)) || a.sourceKey != null && m.sourceKey !== a.sourceKey) return !1;
    const f = Number(m.confidence);
    return m.confidence == null || !Number.isFinite(f) ? a.includeUnscored : f >= a.confidenceMin && f <= a.confidenceMax;
  });
}
function xa(e, t, n, o = !1, i = []) {
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
function Ll(e, t = !1) {
  const n = Gt(e);
  return +(n.reviewStates.length !== At.length) + +(n.performerId != null) + +(n.tagId != null) + +(n.segmentGroupId != null) + +(n.sourceKey != null) + +(n.confidenceMin > 0 || n.confidenceMax < 1) + +!n.includeUnscored + Number(t);
}
function jl(e, t, n) {
  const o = Number(e), i = Number(t), a = Number(n);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function Fl(e, t, n, o) {
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
function Gl(e, t, n = null, o = {}) {
  if (t === Ln) return null;
  const i = t ?? n, a = (e || []).flatMap((s) => (s.markers || []).map((l) => l.segment)).find((s) => s.id === i);
  if (a) return a;
  if (o.reference) {
    const s = o.visibleLanes ?? e, l = s.flatMap((u) => (u.markers || []).map((m) => m.segment)), d = l.find((u) => u.id === o.reference.id);
    if (d) return d;
    const c = Bl(
      e,
      s,
      l,
      o.reference,
      o.referenceLanes
    );
    return Ur(c.lanes, o.reference, { removedIds: c.removedIds });
  }
  return ba(e);
}
function Bl(e, t, n, o, i) {
  const a = { lanes: t, removedIds: [] };
  if (!i || (e || []).some((m) => m.key === o.laneKey)) return a;
  const s = new Map(i.map((m, f) => [m.key, f])), l = s.get(o.laneKey);
  if (l == null) return a;
  const d = new Set(n.map((m) => m.id)), c = (i[l].markers || []).filter(({ segment: m }) => m && !d.has(m.id)), u = t.reduce((m, f, h) => (s.get(f.key) ?? 1 / 0) < l ? h + 1 : m, 0);
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
function Ul(e, t, n) {
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
function Kl(e, t, n, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(n);
  if (s < 0 || l < 0)
    return ka(e, t, n, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: n
  };
}
function _l(e, t, n = null, o = !1) {
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
      ...Kl(m, s, t, u, !0),
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
function Hl(e) {
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
function xo(e, t) {
  return ((e == null ? void 0 : e.markers) || []).map((n) => n.segment).filter((n) => n && !t.has(n.id));
}
function po(e) {
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
function ql(e, t, n) {
  if (xo(e, n).length > 0) return t;
  const o = ((e == null ? void 0 : e.markers) || []).map((s) => s.segment).filter((s) => s && n.has(s.id));
  if (o.length <= 1) return t;
  const i = Math.min(t.startSec, ...o.map((s) => Number(s.startSec) || 0)), a = Math.max(t.endSec, ...o.map((s) => Number(s.endSec ?? s.startSec) || 0));
  return { ...t, startSec: i, endSec: a, anchor: t };
}
function Br(e, t) {
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
function Ur(e, t, n = {}) {
  const o = e || [];
  if (o.length === 0) return null;
  const i = new Set(n.removedIds || []);
  if (t == null) {
    const l = { markers: o.flatMap((c) => c.markers || []) }, d = xo(l, i);
    return d.find(po) ?? d[0] ?? null;
  }
  i.add(t.id);
  const a = o.findIndex((l) => l.key === t.laneKey);
  if (a >= 0) {
    const l = xo(o[a], i).filter(po), d = l.find((u) => Ri(u, t));
    if (d) return d;
    const c = l.filter((u) => !Ri(u, t)).at(-1);
    if (c) return c;
  }
  const s = ql(o[a], t, i);
  return Ei(o, a, s, i, po) ?? Ei(o, a, s, i, () => !0);
}
function Wl(e, t) {
  const n = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return n * o / 10;
}
function Mi(e, t) {
  const n = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => n.get(o)).filter(Boolean);
}
function Vl() {
  try {
    return Dl(window.localStorage.getItem(pa));
  } catch {
    return !1;
  }
}
function Jl(e) {
  try {
    window.localStorage.setItem(pa, String(!!e));
  } catch {
  }
}
const yr = [
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
], Yl = /* @__PURE__ */ new Set([
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
function Ql(e) {
  return Yl.has(e);
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
function Xl(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const n = new Set(yr.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => n.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(wa).filter(Boolean)]));
  } catch {
    return {};
  }
}
function Zl(e = {}) {
  const t = Xl(e);
  return yr.map((n) => ({
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
function Cm(e) {
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
function $m(e) {
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
function Tm(e, t) {
  if (!e || !t) return !1;
  const n = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = Di(e.code, t.key), a = Di(t.code, e.key);
  if (!n && !o && !i && !a) return !1;
  const s = i ? t.key : e.key, l = i ? e.code : a ? t.code : o ? e.code : e.code || t.code;
  for (const d of [!1, !0])
    for (const c of [!1, !0])
      for (const u of [!1, !0])
        for (const m of [!1, !0]) {
          const f = {
            key: s,
            code: l,
            ctrlKey: d,
            metaKey: c,
            altKey: u,
            shiftKey: m
          };
          if (ko(f, e) && ko(f, t)) return !0;
        }
  return !1;
}
function Bn(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function Rm(e, t) {
  return [!1, !0].some((n) => Bn(e, n) && Bn(t, n));
}
function ed(e, t = !1, n = {}) {
  return Zl(n).find((o) => Bn(o, t) && o.bindings.some((i) => ko(e, i))) || null;
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
function td(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Na).join(" / ") : "Unassigned";
}
function Em(e, t) {
  const n = String(t || "").trim().toLowerCase();
  return n ? e.filter((o) => [o.description, o.category, td(o)].some((i) => String(i || "").toLowerCase().includes(n))) : e;
}
function Mm(e) {
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
function nd(e, t, n) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (n == null ? void 0 : n.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function rd(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const n = e.identities.map((i) => mt(t, i)).filter(Boolean);
  return n.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: n,
    selectedSegment: mt(t, e.activeIdentity) || n[0]
  };
}
function od(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function Am(e, t) {
  return (e || []).filter((n) => !n.identities.some((o) => (t || []).some((i) => od(o, i))));
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
function id(e, t, n, o) {
  const i = n ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function ad(e, t, n = null) {
  const o = Number(n);
  if (n != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function sd(e, t, n) {
  return e != null && (n == null || t !== n);
}
function ld(e, t, n, o = null) {
  if (n === t.tagId) return null;
  const i = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: n,
    tagName: o || ((i == null ? void 0 : i.tagId) === n ? i.tagName : null)
  };
}
function dd({ tagEditing: e, selectedSegmentIds: t, activeSegmentId: n }, o) {
  return !(e && n === o && (t == null ? void 0 : t.length) === 1 && t[0] === o);
}
function wo(e, t) {
  return e === t;
}
function cd(e, t, n) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (n || []).find((i) => i.itemId === o.itemId) || null;
}
function ud(e, t, n) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return n < 0 ? o.filter((i) => i.startSec < t - gr).at(-1) || null : o.find((i) => i.startSec > t + gr) || null;
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
function Dm(e, t = null, n = !1) {
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
function md(e, t = 30) {
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
function gd(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function pd(e) {
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
function yd(e, t) {
  return e === "segments" && !Un(
    t,
    Zt.navigationSegmentInventory
  ) || e === "bin" && !Un(
    t,
    Zt.recyclingBinView
  ) ? "videos" : e;
}
function bd(e) {
  const t = Number(e), n = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (n === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = n === 1;
  return `You have ${n} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function hd(e, t = 0) {
  const n = Number(e), o = Number.isFinite(n) && n >= 0 ? Math.trunc(n) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const lr = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "video_updated_at", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, vd = [
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "video_updated_at", label: "Video Updated" },
  { value: "video_title", label: "Video Title" },
  { value: "tag_name", label: "Tag" },
  { value: "start_sec", label: "Start Time" },
  { value: "end_sec", label: "End Time" },
  { value: "duration", label: "Duration" },
  { value: "review_state", label: "Review State" },
  { value: "random", label: "Random" }
];
function Ta(e) {
  return (e == null ? void 0 : e.sort) === "default" ? { ...e, sort: lr.defaultFilter.sort } : e;
}
const Fi = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: At.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
], Kt = "slottedPerformerCriterion", br = "slotCriterion", Fn = "*", Ra = "unassignedSlotCriterion", hn = "_filterExpression";
function Sd(e, t = {}, n = []) {
  const o = n.filter((a) => a.type !== "related"), i = new Map((e || []).filter((a) => a.key !== Fn).map((a) => [a.key, a.label]));
  for (const a of xd(t)) a !== Fn && !i.has(a) && i.set(a, a);
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
        filterKey: br,
        modifiers: ["EQUALS"],
        options: [{ value: Fn, label: "Any" }, ...[...i].map(([a, s]) => ({ value: a, label: s }))]
      },
      { id: "specificPerformer", label: "Specific Performer", type: "multiId", entityType: "performers", filterKey: "performerIdsCriterion", modifiers: ["INCLUDES", "EXCLUDES"] },
      { id: "ageAtVideoDate", label: "Age (then)", type: "number", filterKey: "ageAtHostDateCriterion" },
      { id: "performerOccurrenceTags", label: "Occurrence Tags", type: "multiId", entityType: "tags", filterKey: "performerOccurrenceTagsCriterion" },
      { id: "unassignedSlot", label: "Unassigned Slot", type: "bool", filterKey: Ra }
    ],
    relatedResultLabel: "segments"
  };
}
function xd(e) {
  const t = [], n = (o) => {
    var a, s, l;
    if (!o || typeof o != "object") return;
    const i = (s = (a = o[Kt]) == null ? void 0 : a[br]) == null ? void 0 : s.value;
    typeof i == "string" && t.push(i);
    for (const d of ((l = o[hn]) == null ? void 0 : l.children) || o.children || []) n(d.filter || d.group);
  };
  return n(e), t;
}
function kd(e, t) {
  return {
    [br]: { modifier: "EQUALS", value: e },
    performerIdsCriterion: { modifier: "INCLUDES", value: t }
  };
}
function wd(e, t) {
  const n = Da(e.performersCriterion, e.performerId), o = e.slots !== void 0;
  if (!n.length && e.performersCriterion === void 0 && e.performerId === void 0 && !o || o && !t) return e;
  const i = { ...e };
  delete i.performersCriterion, delete i.performerId, delete i.slots;
  const a = Id(e.slots), s = new Map((t || []).flatMap((d) => (d.slotDefinitionIds || []).map((c) => [String(c), d.key]))), l = Object.entries(a.values).map(([d, c]) => kd(s.get(String(d)) ?? Fn, [Number(c)]));
  if (n.length && l.push({ [br]: { modifier: "EQUALS", value: Fn }, performerIdsCriterion: { modifier: "INCLUDES", value: n } }), l.length === 1 && i[Kt] === void 0) i[Kt] = l[0];
  else if (l.length) {
    const d = l.slice(0, Object.keys(a.values).length).map((m) => ({ filter: { [Kt]: m } })), c = d.length > 1 ? [{ group: { operator: "AND", relatedScope: { filterKey: Kt, matchMode: "distinct" }, children: d } }] : d;
    n.length && c.push({ filter: { [Kt]: l.at(-1) } });
    const u = [...i[hn] ? [{ group: i[hn] }] : [], ...c];
    i[hn] = u.length === 1 && u[0].group ? u[0].group : { operator: "AND", children: u };
  }
  return a.activityTagId && i.activitiesCriterion === void 0 && i.activityId === void 0 && (i.activitiesCriterion = { modifier: "INCLUDES", value: [a.activityTagId] }), i;
}
function Nd(e) {
  const t = String(e || "").split(",").filter((n) => At.includes(n));
  return t.length === 0 ? [...At] : [...new Set(t)];
}
function Id(e) {
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
function Cd(e) {
  var l, d;
  if (!e || typeof e != "object") return null;
  const { [Ra]: t, [br]: n, ...o } = e, i = typeof (n == null ? void 0 : n.value) == "string" && n.value ? n.value : Fn, a = typeof (t == null ? void 0 : t.value) == "boolean" ? t.value : null, s = o._matchAll === !0 || !!((d = (l = o.findFilter) == null ? void 0 : l.q) != null && d.trim()) || Object.keys(o.objectFilter || {}).length > 0 || o.performerIdsCriterion !== void 0 || o.ageAtHostDateCriterion !== void 0 || o.performerOccurrenceTagsCriterion !== void 0;
  return !s && a === null && !n ? null : { role: i, performers: s || a === null ? Io(o) : null, unassigned: a };
}
function Ea(e, { legacyStates: t = !1 } = {}) {
  var o, i;
  const n = At.includes((o = e.reviewStateCriterion) == null ? void 0 : o.value) ? [e.reviewStateCriterion.value] : t && e.states ? Nd(e.states) : [];
  return {
    activityTagIds: Da(e.activitiesCriterion, e.activityId),
    includeActivitySubtags: ((i = e.activitiesCriterion) == null ? void 0 : i.depth) === -1,
    reviewStates: n,
    slottedPerformer: Cd(e[Kt])
  };
}
function Ma(e) {
  if (!e || typeof e != "object" || !Array.isArray(e.children)) return null;
  const t = e.children.flatMap((n) => {
    if (n != null && n.group) {
      const o = Ma(n.group);
      return o ? [{ group: o }] : [];
    }
    return n != null && n.filter && typeof n.filter == "object" ? [{ filter: Ea(n.filter) }] : [];
  });
  return t.length ? e._semanticNone ? { operator: "NOT", children: t.length === 1 ? t : [{ group: { operator: "OR", children: t } }] } : {
    operator: ["OR", "NOT", "JUST_ONE"].includes(e.operator) ? e.operator : "AND",
    ...e.relatedScope ? { relatedScope: e.relatedScope } : {},
    ...e.distinctRelatedMatches === !0 ? { distinctRelatedMatches: !0 } : {},
    children: t
  } : null;
}
function $d(e, t) {
  const n = Ma(t[hn]), o = Ta(e).sort || lr.defaultFilter.sort;
  return {
    query: String(e.q || "").trim() || null,
    ...Ea(t, { legacyStates: !0 }),
    ...n ? { filterExpression: n } : {},
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: o,
    direction: e.direction || "desc",
    ...o === "random" && Number.isInteger(e.seed) && e.seed > 0 && e.seed <= 2147483647 ? { seed: e.seed } : {}
  };
}
function Td(e) {
  const { [Kt]: t, [hn]: n, ...o } = e, i = Aa(n);
  return i ? { ...o, [hn]: i } : o;
}
function Aa(e) {
  if (!e || typeof e != "object" || !Array.isArray(e.children)) return null;
  const t = e.children.flatMap((i) => {
    if (i != null && i.group) {
      const l = Aa(i.group);
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
function Da(e, t) {
  const n = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(n.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function Oa(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Rd(e) {
  var i;
  const t = Number(e.startSec) || 0, n = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(n)) return Math.max(t, n);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Ed(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Gi(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Md(e, t, n) {
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
function Pa(e, t, n = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((h) => String(h.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(n)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((h) => {
    var g;
    return !((g = h.genderHints) != null && g.length);
  }) && e.length === t.length && !i) {
    const h = [...e].sort((y, x) => String(y.slotDefinitionId).localeCompare(String(x.slotDefinitionId))), g = [...t].sort((y, x) => String(y.name).localeCompare(String(x.name)) || Number(yt(y)) - Number(yt(x)));
    return [{
      assignments: Object.fromEntries(h.map((y, x) => [String(y.slotDefinitionId), String(yt(g[x]))])),
      description: g.map((y) => y.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((h) => t.map((g, y) => ({ performer: g, index: y })).filter(({ performer: g }) => {
    var y;
    return !((y = h.genderHints) != null && y.length) || h.genderHints.some((x) => an(x) === an(g.gender || g.genderIdentity));
  }).map(({ index: g }) => g)), u = i ? c.filter((h) => h.length > 0).length : Ui(c, t.length);
  if (u === 0) return [];
  const m = new Map(t.map((h, g) => [String(yt(h)), g]));
  function f(h, g, y) {
    if (s.length >= a) return;
    const x = c.slice(h), N = i ? x.filter((V) => V.length > 0).length : Ui(x.map((V) => V.filter((P) => !g.has(String(yt(t[P]))))), t.length);
    if (y + N < u) return;
    if (h === e.length) {
      if (y !== u) return;
      const V = Object.fromEntries(d.map(({ slot: L, performer: $ }) => [String(L.slotDefinitionId), $ ? String(yt($)) : ""])), P = o.length === 0 ? Object.values(V).sort().join(",") : [...new Set(e.map((L) => String(L.label || "")))].map((L) => `${L}:${d.filter(({ slot: $ }) => String($.label || "") === L).map(({ performer: $ }) => $ ? String(yt($)) : "").sort().join(",")}`).join("|");
      !l.has(P) && s.length < a && (l.add(P), s.push({
        assignments: V,
        description: d.map(({ slot: L, performer: $ }) => o.length ? `${L.label}: ${($ == null ? void 0 : $.name) || "Unassigned"}` : ($ == null ? void 0 : $.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const p = e[h], E = [...d].reverse().find(({ slot: V }) => Bi(V) === Bi(p)), Q = E ? m.get(String(yt(E.performer))) : -1;
    for (const V of c[h]) {
      const P = t[V], L = yt(P);
      if (!(V < Q) && !(L == null || !i && g.has(String(L))) && (d.push({ slot: p, performer: P }), i || g.add(String(L)), f(h + 1, g, y + 1), i || g.delete(String(L)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: p, performer: null }), f(h + 1, g, y), d.pop();
  }
  return f(0, /* @__PURE__ */ new Set(), 0), s;
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
function Ad(e, t) {
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
      const m = [...new Set(e.map((f) => f.label || ""))].map((f) => `${f}:${a.filter((h) => (h.slot.label || "") === f).map((h) => h.performer.performerId).sort((h, g) => h - g).join(",")}`).join("|");
      i.has(m) || i.set(m, [...a]);
      return;
    }
    const c = e[l];
    for (const m of t)
      !o && d.has(m.performerId) || (u = c.genderHints) != null && u.length && !c.genderHints.some((f) => an(f) === an(m.gender)) || (a.push({ slot: c, performer: m }), o || d.add(m.performerId), s(l + 1, d), o || d.delete(m.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Dd(e) {
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
function Od(e, t, n = 20) {
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
function Pd(e) {
  return (e || []).flatMap((t) => t.markers.map((n) => ({
    segment: n.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function Ld(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function La(e, t, n) {
  const o = yt, i = new Set((t || []).map(o)), a = new Set((n || []).map(an));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), u = d.isVideoPerformer ?? i.has(o(d));
    if (c !== u) return u - c;
    const m = an(l.gender || l.genderIdentity), f = an(d.gender || d.genderIdentity), h = l.matchesGenderHint ?? a.has(m);
    return (d.matchesGenderHint ?? a.has(f)) - h || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
function ja() {
  return null;
}
function jd(e) {
  return typeof e == "function" || typeof e == "object" && e !== null && "$$typeof" in e;
}
function Fa(e, t) {
  const n = e[t];
  return jd(n) ? n : ja;
}
const Fd = Fa(ur, "ExtensionEntityActions"), Ga = Fa(ur, "ExtensionSelectionActions"), yn = Ga !== ja, { useEffect: he, useId: Ba, useLayoutEffect: Ki, useMemo: qe, useReducer: Gd, useRef: pe, useState: K, useSyncExternalStore: Bd } = Ao, r = Ao.createElement, Ud = ur.PERFORMER_CRITERIA ?? [], Kd = typeof ur.useDocumentTitle == "function" ? ur.useDocumentTitle : () => {
}, Ua = "/api/plugins/segment-studio";
function Je(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Sn) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const n = Co();
    return t[e] = n, window.localStorage.setItem(Sn, JSON.stringify(t)), n;
  } catch {
    return Co();
  }
}
function Ye(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Sn) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(Sn, JSON.stringify(t));
  } catch {
  }
}
function Go(e) {
  try {
    return JSON.parse(window.localStorage.getItem(Sn) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function Bo(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Sn) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(Sn, JSON.stringify(t));
  } catch {
  }
}
function _d(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function zd(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((n, o) => {
    const i = setTimeout(n, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function re(e, t, n = 0) {
  var d;
  const o = await Do(`${Ua}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = _d(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && n < 2)
    return await zd(250 * (n + 1), t == null ? void 0 : t.signal), re(e, t, n + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function Hd(e, t) {
  const n = await Do(e, t);
  if (!n.ok) {
    const o = await n.json().catch(() => null);
    throw new Error((o == null ? void 0 : o.error) || (o == null ? void 0 : o.detail) || (o == null ? void 0 : o.title) || "Unable to load Cove data.");
  }
  return n.json();
}
async function qd(e, t) {
  const n = String(e).startsWith("/api/") ? e : `${Ua}${e}`, o = await Do(n, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: Wd(
      o.headers.get("Content-Disposition")
    )
  };
}
function Wd(e, t = "segment-studio-ai-feedback.zip") {
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
function Ka(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function Vd(e) {
  const t = Number(e.selectedSegmentCount) || 0, n = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + n, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = n > 0 ? ` and ${n} dependent derived segment${n === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function _a(e, t) {
  const n = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : n.length;
  return { sceneCount: new Set(n.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function Jd(e, t) {
  const { sceneCount: n, segmentCount: o } = _a(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${n} scene${n === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function za(e, t) {
  const n = (e == null ? void 0 : e.items) || [], o = _a(n, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(Jd(n, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await re("/bin/empty", {
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
function _i({ children: e }) {
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
function Om(e, t) {
  return {
    ...(zt[e] || zt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function Ha(e) {
  return { ...(zt[e] || zt.unreviewed).badge };
}
function qa(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const Wa = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function Yd(e, t, n = "not-applicable", o = !1) {
  const i = zt[e] || zt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (n === "empty" || n === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Qd(e, t = !1) {
  const n = "rgb(20, 184, 166)";
  return {
    borderColor: n,
    backgroundColor: n,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Xd(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function Zd(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function Uo(e) {
  const t = typeof e == "string" ? e.trim() : "";
  return /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t) ? t.slice(0, 7).toLowerCase() : null;
}
function ec(e) {
  return (e == null ? void 0 : e.id) == null ? "var(--color-border)" : Uo(e.color) || "var(--color-accent)";
}
function tc(e, t, n = null) {
  const o = Uo(n);
  return e ? {
    backgroundColor: t,
    boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
  } : o ? { backgroundColor: t, boxShadow: `inset 3px 0 0 color-mix(in srgb, ${o} 55%, transparent)` } : { backgroundColor: t };
}
function Xr(e = !1, t = null) {
  return `color-mix(in srgb, ${Uo(t) || "var(--color-accent)"} ${e ? 14 : 8}%, var(--color-surface))`;
}
function nc(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function xn({ state: e, includeLabel: t = !0 }) {
  const n = zt[e] || zt.unreviewed;
  return r("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: Ha(e)
  }, t ? `${n.symbol} ${e}` : n.symbol);
}
function rc(e, t = null) {
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
function Pm(e, t) {
  var a, s, l;
  if (!t) return !1;
  const n = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (n == null ? void 0 : n.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return n === t || ((s = t.contains) == null ? void 0 : s.call(t, n)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || n === (o == null ? void 0 : o.body) && i === o.body;
}
function oc(e, t = document) {
  return !(e.defaultPrevented || rc(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function Lm(e, t = document, n = !1, o = {}) {
  return oc(e, t) ? ed(e, n, o) != null : !1;
}
function ic(e, t, n = null) {
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
function ac(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const n = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !n || n.value.trim() !== String(t || "").trim() || (s = n.getAttribute) != null && s.call(n, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function sc({ confirm: e, cancel: t, confirmReady: n }) {
  const o = n && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function Ko({ confirmRef: e, cancelRef: t, confirmReady: n }) {
  he(() => {
    const o = requestAnimationFrame(() => sc({
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
function _o(e, t = !0) {
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
function Or(e, t = !0) {
  return {
    type: "segment",
    identity: _o(e, t),
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
      identity: _o(n, t),
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
function Pr(e, t) {
  return {
    type: "incorrectExamples",
    collected: t,
    entries: (e || []).map(({ segment: n, result: o, example: i }) => ({
      exampleId: (o == null ? void 0 : o.exampleId) ?? (i == null ? void 0 : i.id) ?? null,
      originalIdentity: _o(n),
      collectedIdentity: {
        itemId: (o == null ? void 0 : o.itemId) ?? (i == null ? void 0 : i.itemId) ?? null,
        nativeSegmentId: (o == null ? void 0 : o.nativeSegmentId) ?? null,
        published: (o == null ? void 0 : o.nativeSegmentId) != null,
        revision: (o == null ? void 0 : o.revision) ?? null
      }
    }))
  };
}
function qr(e) {
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
function Va(e, t) {
  return (e || []).filter((n) => n.segmentId === t).sort((n, o) => n.sortOrder - o.sortOrder || String(n.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function Ja(e) {
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
function lc(e, t) {
  const n = (t || []).map((i) => Va(e, i.id));
  if (n.length === 0 || n.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: Lt(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return n.every((i) => o(i) === o(n[0])) ? n : null;
}
function dc(e, t) {
  return new Set((t || []).map((n) => n.tagId)).size !== 1 ? null : lc(e, t);
}
function cc({ mergeable: e, reviewable: t, tagEditable: n = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    n ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function jm(e, t) {
  return zo(Va(e, t));
}
function Lt(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function uc(e, t) {
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
    const m = [...c].sort(o), f = [...u].sort(o);
    m.forEach((h, g) => l.push({
      sourceSlotDefinitionId: h.id,
      derivedSlotDefinitionId: f[g].id
    }));
  }
  return l;
}
function mc(e, t, n) {
  if (!e || (e.slotMappings || []).length > 0)
    return e;
  const o = uc(t, n);
  return o.length === 0 ? e : { ...e, slotMappings: o };
}
function Lr(e, t, n, o) {
  var s;
  const i = (s = t == null ? void 0 : t[n]) == null ? void 0 : s[o], a = new Set((t || []).filter((l, d) => d !== n).map((l) => l[o]).filter(Boolean));
  return (e || []).filter((l) => l.id === i || !a.has(l.id));
}
function gc(e) {
  const t = Lt(e), n = Number(e == null ? void 0 : e.performerId), o = n > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${n}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(Zr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function Zr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function Wr(e) {
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
    counts: Wr(o),
    trackCount: Math.max(1, t.length)
  };
}
function pc(e) {
  const t = e.map(Lt), n = /* @__PURE__ */ new Map();
  for (const i of t) n.set(i, (n.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), n.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function fc(e, t) {
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
        const c = pc(l.slots), u = l.slots.filter((y) => !a.has(String(y.slotDefinitionId))), m = o.length === 1 ? l.slots : u, f = m.map((y) => `${c.get(String(y.slotDefinitionId))} · ${y.performerName || `Performer ${y.performerId}`}`).join(" · "), h = [...new Map(m.map((y) => [
          Number(y.performerId),
          { id: Number(y.performerId), name: y.performerName || `Performer ${y.performerId}` }
        ])).values()], g = l.slots.map((y) => ({
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
          performerLabel: f,
          performers: h,
          performerAssignments: g,
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => fc(s, a));
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
function Ya(e) {
  return (e || []).some((t) => t.id != null);
}
const yc = {
  group: 38,
  lane: 33,
  segment: 41
};
function bc(e, t = []) {
  const n = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = yc[s.kind];
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
function Qa(e, t, n, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(n)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function hc(e, t = [], n = !0) {
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
function vc(e, t) {
  const n = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => n.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: Wr(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return Ho(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: Wr(a)
    };
  });
}
function Xa(e, { nativeOnly: t = !1 } = {}) {
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
function pr(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function Sc(e) {
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
    }, o ? Sc(e.name) : "—"),
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
function Za({ assignments: e, className: t = "" }) {
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
function eo({ performers: e, performerAssignments: t, interactive: n = !0 }) {
  const o = pe(null), i = `performer-slots-${Ba()}`, [a, s] = K(null);
  function l() {
    var h;
    const c = (h = o.current) == null ? void 0 : h.getBoundingClientRect();
    if (!c) return;
    const u = Math.max(0, Math.min(256, window.innerWidth - 16)), m = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), f = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - u - 8, c.right - u)),
      top: f >= m + 8 ? c.bottom + 4 : Math.max(8, c.top - m - 4),
      width: u
    });
  }
  he(() => {
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
    a ? ll(r("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, r(Za, {
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
function xc(e, t) {
  const n = new Set(dn(t));
  return (e || []).filter((o) => !n.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function es(e, t) {
  return t ? dn(e).filter((n) => n !== t) : dn(e);
}
function kc(e, t) {
  const n = dn(t), o = new Set(dn(e));
  return n.length > 0 && n.every((i) => o.has(i)) ? [] : n;
}
function _t(e, t) {
  const n = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return n ? n.segmentGroupId == null ? "ungrouped" : `group:${n.segmentGroupId}` : null;
}
function Wi(e, t, n) {
  const o = Number(n);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), u = Number.isFinite(c) && c >= d ? c : d, m = d <= o && u >= o, f = m ? 0 : Math.min(Math.abs(o - d), Math.abs(o - u));
    return { contains: m, distance: f, duration: u - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function $o(e, t, n, o = null) {
  var u, m, f, h, g, y;
  const i = e.findIndex((x) => x.markers.some((N) => N.segment.id === t));
  if (i < 0) {
    const x = [...((u = e[0]) == null ? void 0 : u.markers) || []];
    return o != null && Number.isFinite(Number(o)) && x.sort((N, p) => Wi(N, p, o)), ((m = x[0]) == null ? void 0 : m.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((x) => x.segment.id === t);
  if (n === "left" || n === "right") {
    const x = n === "left" ? -1 : 1, N = Math.min(a.markers.length - 1, Math.max(0, s + x));
    return ((f = a.markers[N]) == null ? void 0 : f.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (n === "up" ? -1 : 1))), d = Number((h = a.markers[s]) == null ? void 0 : h.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((g = a.markers[s]) == null ? void 0 : g.segment) ?? null : ((y = [...e[l].markers].sort(c ? (x, N) => Wi(x, N, Number(o)) : (x, N) => Math.abs(x.segment.startSec - d) - Math.abs(N.segment.startSec - d) || x.segment.startSec - N.segment.startSec || x.segment.id - N.segment.id)[0]) == null ? void 0 : y.segment) ?? null;
}
function wc(e, t, n) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = $o([o], t, n);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function Nc(e, t, n) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + n))];
}
function Ic(e, t, n) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(n) ? n : e[0];
}
function Cc(e, t) {
  const n = Number(e);
  if (!Number.isFinite(n)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= n) return [Yi(n)];
  const i = o - n, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(n, o - 1e-3);
  return [...new Set(a.map((l) => Yi(Math.min(s, n + l))))];
}
function $c(e, t) {
  const n = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: n.length > 0 && n.every(i) ? "remove" : "collect",
    segments: n
  };
}
function Tc(e, t) {
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
    const f = Number(u);
    if (n.has(f) && !o.has(f)) continue;
    const h = o.get(f) ?? f;
    l.has(h) || (c[h] = m);
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
function Rc(e) {
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
async function Ec(e, t) {
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
      const c = [], u = Cc(
        d.startSec,
        d.endSec
      );
      for (const [m, f] of u.entries()) {
        Math.abs(n.currentTime - f) > 5e-4 && (n.currentTime = f, await Ji(n, "seeked")), i.drawImage(n, 0, 0, o.width, o.height);
        const h = await Mc(o), g = `example-${l + 1}-frame-${m + 1}`;
        c.push({ fieldName: g, timestampSec: f }), s.push({
          fieldName: g,
          file: new File(
            [h],
            `${g}.jpg`,
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
function Mc(e) {
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
function Fm(e, t, n) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...n } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Ac(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((n, o) => n.startSec - o.startSec || n.id - o.id)
  };
}
function Gm(e, t) {
  const n = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !n.has(o.id))
  };
}
function Bm(e, t, n) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? n.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Um(e, t) {
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
function Dc(e, t) {
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
function to(e, t) {
  return (e || []).some((n) => (t || []).some((o) => Kn(n, o)));
}
function ft(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function ts(e, t) {
  return (e || []).find((n) => Kn(t, n)) || null;
}
function ns(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Oc(e, t) {
  var n;
  return ((n = e.running) == null ? void 0 : n.kind) === t;
}
function Km(e) {
  return e.running != null || e.queued.length > 0;
}
const Pc = /* @__PURE__ */ new Set(["segment", "split", "create", "duplicate", "review", "held-tag"]);
function qo(e) {
  return e.running ? [e.running, ...e.queued] : e.queued;
}
function To(e) {
  return qo(e).some((t) => t.kind === "create" || t.kind === "duplicate");
}
function jn(e) {
  return qo(e).some((t) => !Pc.has(t.kind));
}
function Kr(e) {
  return e != null && e.itemId == null && e.nativeSegmentId == null && e.id < 0;
}
function Lc(e, t) {
  if (jn(e) || (t || []).some(Kr)) return !0;
  const n = (t || []).map(ft);
  return qo(e).some((o) => to(o.targets, n));
}
const Qi = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
function jr(e) {
  return Object.freeze({
    id: e.id,
    kind: e.kind,
    lockId: e.lockId,
    targets: e.targets,
    exclusive: e.exclusive,
    meta: e.meta
  });
}
function jc({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let n = 1, o = null, i = [], a = null, s = !1, l = 0, d = 0;
  const c = () => !t && d < l, u = /* @__PURE__ */ new Map();
  let m = Qi;
  const f = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set();
  let g = [];
  function y() {
    m = o == null && i.length === 0 && a == null ? Qi : Object.freeze({
      running: o ? jr(o) : null,
      queued: Object.freeze(i.map(jr)),
      lastFailure: a
    });
    for (const k of [...h]) k();
    if (o == null && i.length === 0) {
      const k = g;
      g = [];
      for (const D of k) D();
    }
  }
  function x(k, D) {
    f.set(k.id, D.status), k.resolve(D);
  }
  function N(k) {
    if (k.dependsOn == null) return "met";
    const D = f.get(k.dependsOn);
    return D === "fulfilled" ? "met" : D != null ? "failed" : "pending";
  }
  function p(k) {
    o = k;
    const D = { ...e(), taskId: k.id, targets: k.targets };
    D.resolveTargets = () => k.targets.map((U) => ts(D.segments, U)).filter(Boolean), y();
    let B;
    try {
      B = k.run(D);
    } catch (U) {
      B = Promise.reject(U);
    }
    Promise.resolve(B).then(
      (U) => E(k, { status: "fulfilled", value: U }),
      (U) => E(k, { status: "rejected", error: U })
    );
  }
  function E(k, D) {
    k.settled || (k.settled = !0, x(k, D), !s && (o = null, D.status === "rejected" && (a = Object.freeze({ id: k.id, kind: k.kind, error: D.error })), y(), l += 1, t && Q()));
  }
  function Q() {
    if (s || o != null || c()) return;
    let k = !1;
    for (let D = 0; D < i.length; D += 1) {
      const B = i[D], U = N(B);
      if (U === "failed") {
        i = i.filter((T) => T !== B), x(B, { status: "dropped", reason: "dependency-failed" }), k = !0, D -= 1;
        continue;
      }
      if (U !== "pending" && !(B.exclusive && D > 0) && !i.slice(0, D).some((T) => to(T.targets, B.targets)) && !(B.ready && !B.ready(e(), jr(B)))) {
        i = i.filter((T) => T !== B), p(B);
        return;
      }
    }
    k && y();
  }
  function V(k) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((q) => q.exclusive) || o != null && k.whenBusy !== "enqueue" || k.exclusive && (o != null || i.length > 0 || c())) return null;
    let B;
    const U = new Promise((q) => {
      B = q;
    }), T = {
      id: n++,
      kind: k.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: k.lockId ?? -1,
      targets: Object.freeze((k.targets || []).map(L)),
      exclusive: k.exclusive === !0,
      dependsOn: k.dependsOn ?? null,
      ready: k.ready || null,
      meta: k.meta ?? null,
      run: k.run,
      resolve: B
    };
    return i = [...i, T], y(), Q(), { id: T.id, done: U };
  }
  function P(k = {}) {
    let D = null;
    const B = V({
      ...k,
      whenBusy: "reject",
      run: () => new Promise((T) => {
        D = T;
      })
    });
    if (!B) return null;
    if (D == null)
      return S((T) => T.id === B.id), null;
    let U = !1;
    return () => {
      U || (U = !0, D(), (o == null ? void 0 : o.id) === B.id && E(o, { status: "fulfilled", value: void 0 }));
    };
  }
  function L(k) {
    return (k == null ? void 0 : k.id) == null || k.itemId != null || k.nativeSegmentId != null ? k : u.get(k.id) || k;
  }
  function $(k, D) {
    u.set(k, { ...D });
    let B = !1;
    for (const U of i)
      U.targets.some((T) => T.id === k && T.itemId == null && T.nativeSegmentId == null) && (U.targets = Object.freeze(U.targets.map((T) => T.id === k ? { ...D } : T)), B = !0);
    return B && y(), B;
  }
  function S(k) {
    const D = i.filter((B) => k(jr(B)));
    if (D.length === 0) return 0;
    i = i.filter((B) => !D.includes(B));
    for (const B of D) x(B, { status: "cancelled" });
    return y(), Q(), D.length;
  }
  return {
    enqueue: V,
    acquire: P,
    cancel: S,
    retarget: $,
    stableIdentity: L,
    // The host reads `settledCount()` while rendering and reports it here once that render commits.
    settledCount: () => l,
    markCommitted(k = l) {
      d = Math.max(d, k);
    },
    poke: () => Q(),
    subscribe(k) {
      return h.add(k), () => h.delete(k);
    },
    getSnapshot: () => m,
    whenIdle() {
      return o == null && i.length === 0 ? Promise.resolve() : new Promise((k) => g.push(k));
    },
    dispose() {
      if (s) return;
      const k = i;
      i = [], s = !0;
      for (const B of k) x(B, { status: "cancelled" });
      h.clear();
      const D = g;
      g = [];
      for (const B of D) B();
    }
  };
}
let Fc = 1;
function Mt() {
  return `pending-${Fc++}`;
}
function Gc(e) {
  return e.sort((t, n) => t.startSec - n.startSec || t.id - n.id);
}
function _r(e, t) {
  return (t || []).some((n) => Kn(n, e));
}
function Bc(e, t) {
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
function rs(e, t) {
  return t && (e || []).find((n) => {
    var o;
    return ((o = n.meta) == null ? void 0 : o.kind) === "held-tag" && !n.settled && _r(t, n.targets);
  }) || null;
}
function Uc(e) {
  return (e || []).filter((t) => t.op === "insert" && !t.settled).map((t) => t.segment);
}
function os(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function is(e, t) {
  const n = (e || []).filter((o) => !os(o, t));
  return n.length === (e || []).length ? e : n;
}
function as(e, t) {
  let n = !1;
  const o = (e || []).map((i) => i.settled || !os(i, t) ? i : (n = !0, { ...i, settled: !0, settledDetail: null }));
  return n ? o : e;
}
function Kc(e, t, n) {
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
      n = n.map((i) => _r(i, o.targets) ? { ...i, ...o.values } : i);
    else if (o.op === "remove")
      n = n.filter((i) => !_r(i, o.targets));
    else if (o.op === "merge") {
      const [i, ...a] = o.targets;
      n = n.filter((s) => !_r(s, a)).map((s) => Kn(i, s) ? { ...s, ...o.values } : s);
    }
  return Gc(n);
}
function ss(e, t) {
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
function _c(e, t, n) {
  return n ? is(e, t) : as(e, t);
}
function zc(e, t) {
  switch (t.type) {
    case "confirm":
      return _c(e, t.key, t.applied);
    case "add":
      return Bc(e, t.entry);
    case "discard":
      return is(e, t.key);
    case "settle":
      return as(e, t.key);
    case "retarget":
      return Kc(e, t.temporaryId, t.identity);
    case "prune":
      return ss(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
function Xi(e, t, n) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function Hc(e) {
  const { acquireSaveLock: t, compatibilityMode: n, getRequestedSelectionId: o, dispatchPendingChanges: i, displayedSelectedSegment: a, enqueueSave: s, getSaveQueueSnapshot: l, pendingChanges: d, retargetSaveTasks: c, currentTime: u, detail: m, editorFilters: f, endInput: h, hideDerivedSegments: g, historyRef: y, mediaDuration: x, onConflict: N, onDetailChange: p, onReload: E, optimisticSegmentIdRef: Q, pendingDuplicateRef: V, pendingFirstSegmentStartSecRef: P, pendingTagEditSegmentIdRef: L, performerSlots: $, replaceSegmentSelection: S, savingSegmentId: k, segments: D, selectedSegment: B, selectedSegmentIdRef: U, selectedSegments: T, selectionAnchorIdRef: q, selectionRangeBaseIdsRef: Y, setCreatingSegmentId: j, setEditorFilters: Z, setFirstSegmentTagOpen: ie, setHideDerivedSegments: ae, setHistory: ve, setHistoryOpen: de, setPublishApprovedError: De, setSaveMessage: be, setSelectedSegmentGroupKey: _, setSelectedSegmentId: ue, setSelectedSegmentIds: fe, setTagEditing: ke, startInput: Se, tagEditingRef: H, timelineDuration: we, video: le } = e;
  function w(v) {
    y.current = v || Xt, ve(y.current);
  }
  async function F(v, R, ne, se, J = null) {
    var Fe;
    try {
      const Re = await re(`/videos/${le.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: y.current.revision,
          kind: v,
          label: R,
          beforeState: ne,
          afterState: se,
          receiptId: J
        })
      });
      return w(Re), !0;
    } catch (Re) {
      return Re.status === 409 && ((Fe = Re.payload) != null && Fe.current) && w(Re.payload.current), be("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function A(v, R, ne = !0, se = null, J = !1, Fe = R, Re = !0) {
    if (!v || Kr(v) || jn(l())) return null;
    const [$e = v] = Wo([v], (d || []).filter((ot) => ot.op !== "insert")), Pe = Object.fromEntries(Object.entries(R).filter(([ot, Le]) => Le !== $e[ot])), ze = J ? Mt() : null, gt = o == null ? void 0 : o();
    ze && i({
      type: "add",
      entry: {
        id: ze,
        op: "patch",
        targets: [ft(v)],
        values: Fe === R ? Pe : Fe
      }
    });
    const Be = s({
      kind: "segment",
      lockId: v.id,
      targets: [ft(v)],
      whenBusy: "enqueue",
      // Save against the segment as it is when the task runs, so a save queued behind another
      // save of the same segment sends that save's revision.
      run: (ot) => {
        const [Le] = ot.resolveTargets();
        if (!Le)
          return ze && i({ type: "discard", key: ze }), be("The segment changed before its save could run."), null;
        const rt = Object.fromEntries(Object.keys(R).map((xt) => [xt, Le[xt]]));
        return I(Le, { ...rt, ...Pe }, {
          recordHistory: ne,
          historyLabel: se,
          pendingChangeId: ze,
          restoreSelectionOnFailure: Re,
          requestedSelectionId: gt
        });
      }
    });
    if (!Be)
      return ze && i({ type: "discard", key: ze }), null;
    const pt = await Be.done;
    return pt.status !== "fulfilled" ? (ze && i({ type: "discard", key: ze }), null) : pt.value ?? null;
  }
  async function I(v, R, {
    recordHistory: ne = !0,
    historyLabel: se = null,
    optimisticValues: J = null,
    pendingChangeId: Fe = null,
    restoreSelectionOnFailure: Re = !0,
    // The selection when the edit was requested, which a queued save captures before it waits.
    requestedSelectionId: $e = o == null ? void 0 : o(),
    onReload: Pe = E,
    onConflict: ze = N
  } = {}) {
    var xt;
    const gt = T.map((lt) => lt.id), Be = (B == null ? void 0 : B.id) ?? U.current, pt = ne && !n ? crypto.randomUUID() : null;
    be(ne ? "Saving directly to Cove…" : "Restoring history…");
    const ot = Fe ?? (J ? Mt() : null);
    J && !Fe && i({
      type: "add",
      entry: { id: ot, op: "patch", targets: [ft(v)], values: J }
    });
    const Le = (lt) => {
      ot && i({ type: "confirm", key: ot, applied: lt });
    }, rt = async (lt) => {
      if (lt) {
        p((ht) => sn(ht, lt), le.id), Le(!0);
        return;
      }
      Le(await Pe() != null);
    };
    try {
      if (n && v.nativeSegmentId == null && v.itemId != null) {
        const it = `draft-update:${le.id}:${v.itemId}:${v.revision}:${R.tagId}:${R.startSec}:${R.endSec ?? "open"}:${R.reviewState ?? v.reviewState}`, z = await re(`/videos/${le.id}/drafts/${v.itemId}`, {
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
        Ye(it), z.performerSlots != null && p((me) => Gn(me, v.id, z.performerSlots, z.performerSlotRevision), le.id);
        const ee = {
          ...v,
          ...z.draft,
          id: v.id,
          itemId: v.itemId
        };
        return ne && await F(
          "segment.update",
          se || "Changed segment",
          Or(v, n),
          Or(
            ee,
            n
          )
        ), Xi(v, R, n) ? await rt(z.editorDelta) : (p((me) => ({
          ...me,
          approvedSetVersion: z.approvedSetVersion || me.approvedSetVersion,
          segments: (me.segments || []).map((ye) => ye.id === v.id ? ee : ye).sort((ye, ge) => ye.startSec - ge.startSec || ye.id - ge.id)
        }), le.id), Le(!0)), be(((xt = z.draft) == null ? void 0 : xt.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), ee;
      }
      const { editorDelta: lt, ...ht } = await re(`/videos/${le.id}/segments/${v.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...R,
          expectedUpdatedAt: v.updatedAt,
          historyReceiptId: pt
        })
      }), Xe = {
        ...v,
        ...ht,
        reviewState: R.reviewState ?? v.reviewState
      };
      return Xi(v, R, n) ? await rt(lt) : (p((it) => ({
        ...it,
        segments: (it.segments || []).map((z) => z.id === v.id ? Xe : z).sort((z, ee) => z.startSec - ee.startSec || z.id - ee.id)
      }), le.id), Le(!0)), ne && await F(
        "segment.update",
        se || "Changed segment",
        Or(v, n),
        Or(
          Xe,
          n
        ),
        pt
      ), be(ne ? "Saved to Cove" : "History restored"), Xe;
    } catch (lt) {
      return ot && i({ type: "discard", key: ot }), ot && Re && (o == null || o() === $e) && (fe(gt), ue(Be), q.current = Be, Y.current = []), lt.status === 409 ? (be("Conflict — loading the latest segment…"), await ze()) : be(lt.message || "Unable to save the segment."), null;
    }
  }
  async function b() {
    if (!n) return !1;
    const v = D.filter((se) => Qr(se)).length;
    if (v === 0 || k != null) return !1;
    const R = `complete-review:${le.id}:${m.approvedSetVersion}`, ne = t("publish", -1);
    if (!ne) return !1;
    De(""), be(`Publishing ${v} Approved draft${v === 1 ? "" : "s"}…`);
    try {
      const se = await re(`/videos/${le.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(R),
          expectedApprovedSetVersion: m.approvedSetVersion
        })
      });
      Ye(R), w(Xt), de(!1);
      const J = await E(), Fe = cd(
        D,
        U.current,
        se.published
      ), Re = Fe ? mt(J == null ? void 0 : J.segments, Fe) : null;
      return Re && ue(Re.id), be(`${se.published.length} Approved draft${se.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (se) {
      const J = se.status === 409 ? "The approved drafts changed. Review the updated list and try again." : se.message || "Unable to publish the approved drafts.";
      return se.status === 409 && await N(), De(J), be(J), !1;
    } finally {
      ne();
    }
  }
  async function G(v, R, ne) {
    return v ? (p((se) => sn(se, v), le.id), sn(R, v)) : ne();
  }
  async function O(v = null, R = null) {
    const ne = l();
    if (jn(ne) || To(ne) || X()) return;
    const se = v != null ? P.current : null, J = Number.isFinite(se) ? se : u, Fe = Math.min(we, J + 20);
    if (Fe <= J) {
      be("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const Re = ad(D, B, v);
    if (Re.kind === "choose-tag") {
      P.current = J, be(""), ie(!0);
      return;
    }
    if (Re.kind === "invalid-selection") {
      be("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: $e } = Re, Pe = `create-draft:${le.id}:${$e}:${J}`, ze = n ? null : crypto.randomUUID(), gt = U.current, Be = {
      ...B || {},
      id: Q.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: $e,
      tagName: R || (B == null ? void 0 : B.tagName) || "Tag segment",
      tagSortName: $e === (B == null ? void 0 : B.tagId) && (B == null ? void 0 : B.tagSortName) || null,
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
    }, pt = Ac(m, Be), ot = _t(
      vn(pt.segments, pt.segmentGroups || [], pt.performerSlots || []),
      Be.id
    ), Le = Mt(), rt = s({
      kind: "create",
      lockId: -1,
      whenBusy: "enqueue",
      run: (ht) => lt(ht)
    });
    if (!rt) return;
    i({ type: "add", entry: { id: Le, taskId: rt.id, op: "insert", segment: Be } }), ie(!1), Re.openTagEditor && (j(Be.id), L.current = Be.id, ke(!0)), S(Be.id), _(ot), (await rt.done).status === "cancelled" && (i({ type: "discard", key: Le }), j(null), U.current === Be.id && S(gt));
    async function lt({ detail: ht, onReload: Xe }) {
      var it;
      try {
        let z, ee = null;
        if (n) {
          const ge = await re(`/videos/${le.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: Je(Pe), tagId: $e, startSec: J, endSec: Fe })
          });
          Ye(Pe), z = { itemId: (it = ge.draft) == null ? void 0 : it.itemId }, ee = ge.editorDelta ?? null, ge.performerSlots != null && !ee && p((Oe) => Gn(Oe, Be.id, ge.performerSlots, ge.performerSlotRevision), le.id);
        } else
          z = { nativeSegmentId: (await re(`/videos/${le.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: $e,
              startSec: J,
              endSec: Fe,
              historyReceiptId: ze
            })
          })).id };
        P.current = null, ie(!1);
        const me = await G(ee, ht, Xe);
        if (i({ type: "discard", key: Le }), !me) {
          p((ge) => bo(ge, Be.id), le.id), U.current === Be.id && S(gt), be(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${Re.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const ye = mt(me == null ? void 0 : me.segments, z);
        ye ? (i({ type: "retarget", temporaryId: Be.id, identity: ft(ye) }), c(Be.id, ft(ye)), Re.openTagEditor && (H.current && (L.current = ye.id), j(ye.id)), U.current === Be.id && (S(ye.id), _(_t(
          vn(me.segments || [], me.segmentGroups || [], me.performerSlots || []),
          ye.id
        ))), n || await F(
          "segment.create",
          "Created segment",
          Ft([], !1),
          Ft([ye], !1),
          ze
        )) : (ke(!1), be(`Segment created, but it could not be selected${Re.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (z) {
        throw i({ type: "discard", key: Le }), p((ee) => bo(ee, Be.id), le.id), U.current === Be.id && S(gt), v != null && ie(!0), be(z.message || "Unable to create the draft."), z;
      } finally {
        j(null);
      }
    }
  }
  function X() {
    return rs(d, B) ? (be("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function C() {
    if (T.length !== 1 || !B || Kr(B) || jn(l()) || X()) return;
    const v = (a == null ? void 0 : a.id) === B.id ? a : B, R = u;
    if (R <= v.startSec || v.endSec != null && R >= v.endSec) {
      be("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const ne = ft(B), se = {
      ...v,
      id: Q.current--,
      itemId: null,
      nativeSegmentId: null,
      startSec: R,
      endSec: v.endSec,
      revision: 0,
      updatedAt: null
    }, J = Mt(), Fe = Mt();
    i({ type: "add", entry: { id: J, op: "patch", targets: [ne], values: { endSec: R } } }), i({ type: "add", entry: { id: Fe, op: "insert", segment: se } });
    const Re = () => {
      i({ type: "discard", key: J }), i({ type: "discard", key: Fe });
    }, $e = s({
      kind: "split",
      lockId: B.id,
      targets: [ne],
      whenBusy: "enqueue",
      run: (gt) => ze(gt)
    });
    if (!$e) {
      Re();
      return;
    }
    (await $e.done).status !== "fulfilled" && Re();
    async function ze({ detail: gt, resolveTargets: Be, onReload: pt, onConflict: ot }) {
      var ht;
      const [Le] = Be();
      if (!Le || R <= Le.startSec || Le.endSec != null && R >= Le.endSec) {
        Re(), be(Le ? "The segment changed before the split could run; move the playhead inside it and split again." : "The segment changed before the split could run.");
        return;
      }
      const rt = `split-draft:${Le.itemId}:${Le.revision}:${R}`, xt = n ? null : Ft([Le], !1), lt = n ? null : crypto.randomUUID();
      try {
        let Xe, it;
        if (n && Le.nativeSegmentId == null) {
          const me = await re(`/videos/${le.id}/drafts/${Le.itemId}/split`, {
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
          const me = await re(`/videos/${le.id}/segments/${Le.id}/split`, {
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
        const z = await G(it, gt, pt), ee = mt(z == null ? void 0 : z.segments, Xe);
        if (ee ? (i({ type: "retarget", temporaryId: se.id, identity: ft(ee) }), c(se.id, ft(ee)), U.current === se.id && S(ee.id)) : U.current === se.id && S(Le.id), i({ type: "confirm", key: J, applied: z != null }), i({ type: "discard", key: Fe }), !n) {
          const me = [
            mt(z == null ? void 0 : z.segments, {
              nativeSegmentId: Le.nativeSegmentId ?? Le.id
            }),
            ee
          ].filter(Boolean);
          await F(
            "segment.split",
            "Split segment",
            xt,
            Ft(me, !1),
            lt
          );
        }
        be(n ? `Segment split; both ranges remain ${Le.reviewState}.` : "Segment split.");
      } catch (Xe) {
        Re(), U.current === se.id && S(Le.id), Xe.status === 409 ? await ot() : be(Xe.message || "Unable to split the draft.");
      }
    }
  }
  async function ce(v = !1) {
    const R = l();
    if (T.length !== 1 || !B || Kr(B) || jn(R) || To(R) || X()) return;
    const ne = v ? u : ((a == null ? void 0 : a.id) === B.id ? a : B).startSec, se = n ? null : crypto.randomUUID(), J = B, Fe = U.current, Re = (a == null ? void 0 : a.id) === J.id ? a : J, $e = Re.endSec == null ? null : Re.endSec - Re.startSec, Pe = {
      ...J,
      id: Q.current--,
      itemId: null,
      nativeSegmentId: null,
      startSec: ne,
      endSec: $e == null ? null : ne + $e,
      // Full mode creates the copy as an approved draft, even from a published segment; match it so a
      // queued review toggles as displayed and the copy waits for Publish approved like other drafts.
      reviewState: n ? "approved" : J.reviewState,
      published: n ? !1 : J.published,
      revision: 0,
      updatedAt: null
    }, ze = ($ || []).filter((rt) => rt.segmentId === J.id), gt = Mt(), Be = () => {
      i({ type: "discard", key: gt }), ze.length > 0 && p((rt) => bo(rt, Pe.id), le.id);
    }, pt = s({
      kind: "duplicate",
      lockId: -1,
      targets: [ft(J)],
      whenBusy: "enqueue",
      run: (rt) => Le(rt)
    });
    if (!pt) return;
    i({ type: "add", entry: { id: gt, taskId: pt.id, op: "insert", segment: Pe } }), ze.length > 0 && p((rt) => Gn(rt, Pe.id, ze), le.id), v || (j(Pe.id), L.current = Pe.id, ke(!0)), S(Pe.id), (await pt.done).status === "cancelled" && (Be(), j(null), U.current === Pe.id && S(Fe));
    async function Le({ detail: rt, resolveTargets: xt, onReload: lt, onConflict: ht }) {
      var z, ee;
      const [Xe] = xt(), it = Xe ? id(le.id, Xe, v, ne) : null;
      try {
        if (!Xe) throw new Error("The segment changed before the duplicate could run.");
        const me = ((z = V.current) == null ? void 0 : z.operationKey) === it ? V.current : null;
        let ye = (me == null ? void 0 : me.duplicateIdentity) ?? null, ge = null;
        if (ye == null && n) {
          const je = Xe.nativeSegmentId == null ? `/videos/${le.id}/drafts/${Xe.itemId}/duplicate` : `/videos/${le.id}/segments/${Xe.nativeSegmentId}/duplicate-draft`, tt = await re(je, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Je(it),
              ...Xe.nativeSegmentId == null ? { expectedRevision: Xe.revision } : { expectedUpdatedAt: Xe.updatedAt },
              startSec: v ? ne : null
            })
          });
          ye = Pi(!1, tt), ge = tt.editorDelta ?? null, V.current = { operationKey: it, duplicateIdentity: ye };
        } else if (ye == null) {
          const je = await re(`/videos/${le.id}/segments/${Xe.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: Xe.updatedAt,
              startSec: v ? ne : null,
              historyReceiptId: se
            })
          });
          ye = Pi(!0, je), V.current = { operationKey: it, duplicateIdentity: ye };
        }
        const Oe = await G(ge, rt, lt);
        Be();
        const Me = mt(Oe == null ? void 0 : Oe.segments, ye);
        if (!Me) {
          U.current === Pe.id && (ke(!1), S(Fe)), be(Oe ? "Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection." : "Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.");
          return;
        }
        i({ type: "retarget", temporaryId: Pe.id, identity: ft(Me) }), c(Pe.id, ft(Me));
        const Qe = xa(
          Me,
          Oe.performerSlots || [],
          f,
          g,
          Oe.segmentGroups || []
        );
        Z(Qe.filters), ae(Qe.hideDerivedSegments), !v && H.current && (L.current = Me.id), U.current === Pe.id && (S(Me.id), _(_t(
          vn(Oe.segments || [], Oe.segmentGroups || [], Oe.performerSlots || []),
          Me.id
        ))), n && Ye(it), V.current = null, be(v ? "Duplicate created at the playhead." : "Duplicate created in place."), n || await F(
          "segment.duplicate",
          "Duplicated segment",
          Ft([], !1),
          Ft([Me], !1),
          se
        );
      } catch (me) {
        throw Be(), U.current === Pe.id && (ke(!1), S(Fe)), it != null && ((ee = V.current) == null ? void 0 : ee.operationKey) === it ? be("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : me.status === 409 ? await ht() : be(me.message || "Unable to duplicate the draft."), me;
      } finally {
        j(null);
      }
    }
  }
  async function Ne() {
    if (T.length !== 1 || !B) return;
    const v = Number(Se), R = h.trim() === "" ? null : Number(h), ne = Ci(v, R, x);
    if (ne.error) {
      be(ne.error);
      return;
    }
    const se = (a == null ? void 0 : a.id) === B.id ? a : B;
    if (v === se.startSec && R === se.endSec) {
      be("Timing is unchanged.");
      return;
    }
    await A(B, { startSec: v, endSec: R, tagId: se.tagId }, !0, null, !0);
  }
  async function te(v, R) {
    if (T.length !== 1 || !B) return;
    const ne = Ci(v, R, x);
    if (ne.error) {
      be(ne.error);
      return;
    }
    const se = (a == null ? void 0 : a.id) === B.id ? a : B;
    if (v === se.startSec && R === se.endSec) {
      be("Timing is unchanged.");
      return;
    }
    await A(B, { startSec: v, endSec: R, tagId: se.tagId }, !0, null, !0);
  }
  return { acceptHistory: w, recordHistoryAction: F, mutateSegment: A, runSegmentMutation: I, completeReview: b, createSegment: O, splitSegment: C, duplicateSegment: ce, saveTiming: Ne, applyShortcutTiming: te };
}
function qc() {
  const [e, t] = K(() => typeof window < "u" && window.matchMedia(wi).matches);
  return he(() => {
    if (typeof window > "u") return;
    const n = window.matchMedia(wi), o = () => t(n.matches);
    return o(), n.addEventListener("change", o), () => n.removeEventListener("change", o);
  }, []), e;
}
function Wc() {
  const [e, t] = K(() => typeof window < "u" && window.matchMedia(Ni).matches);
  return he(() => {
    if (typeof window > "u") return;
    const n = window.matchMedia(Ni), o = () => t(n.matches);
    return o(), n.addEventListener("change", o), () => n.removeEventListener("change", o);
  }, []), e;
}
function Vc() {
  try {
    return Rl(window.localStorage.getItem(ca));
  } catch {
    return { ...Ot };
  }
}
function Jc() {
  try {
    return dn(JSON.parse(window.localStorage.getItem(ua) || "[]"));
  } catch {
    return [];
  }
}
function Yc(e) {
  try {
    window.localStorage.setItem(ua, JSON.stringify(dn(e)));
  } catch {
  }
}
function Qc(e) {
  try {
    window.localStorage.setItem(ca, JSON.stringify(e));
  } catch {
  }
}
function Xc() {
  try {
    const e = JSON.parse(window.localStorage.getItem(ga) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Zc(e) {
  try {
    return window.localStorage.setItem(ga, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function eu({ status: e }) {
  const t = Wa[e];
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
      ...Ha(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${zt[t].symbol}${e[t]}`)));
}
function tu({ videoId: e, segmentId: t, itemId: n, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: u, shortcutRef: m }) {
  const f = Fo(a), [h, g] = K(() => yo(o, f)), [y, x] = K(!1), [N, p] = K(""), E = pe(!1), Q = o.map((k) => `${k.slotDefinitionId}:${k.performerId || ""}`).join("|"), V = f.map((k) => yt(k)).join("|"), P = Pa(
    o,
    f
  );
  he(() => {
    g(yo(o, f)), p("");
  }, [t, n, Q, V]);
  async function L(k = h) {
    if (!E.current) {
      E.current = !0, x(!0), p("Saving performer slots…");
      try {
        const D = yo(o.map((T) => ({
          ...T,
          performerId: k[T.slotDefinitionId] || null
        })), f), B = o.map((T) => {
          const q = D[T.slotDefinitionId] ? Number(D[T.slotDefinitionId]) : null, Y = f.find((j) => String(yt(j)) === String(q));
          return {
            ...T,
            performerId: q,
            performerName: (Y == null ? void 0 : Y.name) || null
          };
        });
        if (s(B) === !1) {
          p("");
          return;
        }
        const U = await re(n != null ? `/videos/${e}/drafts/${n}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((T) => ({ slotDefinitionId: T.slotDefinitionId, performerId: D[T.slotDefinitionId] ? Number(D[T.slotDefinitionId]) : null }))
          })
        });
        p("Performer slots saved."), await l(U, {
          beforeState: qr([{
            segmentId: t,
            itemId: n,
            revision: i,
            slots: o
          }]),
          afterState: qr([{
            segmentId: t,
            itemId: n,
            revision: U.revision,
            slots: U.slots || []
          }])
        });
      } catch (D) {
        d && await d(o, D), D.status === 409 ? (p("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : p(D.message || "Unable to save performer slots.");
      } finally {
        E.current = !1, x(!1);
      }
    }
  }
  function $(k, D) {
    p(`Option ${D + 1} applied; save to confirm.`), g({ ...h, ...k.assignments });
  }
  async function S(k) {
    const D = { ...h, ...k.assignments };
    g(D), await L(D);
  }
  return he(() => {
    if (m)
      return m.current = (k) => E.current || !P[k] ? !1 : (S(P[k]), !0), () => {
        m.current = null;
      };
  }), r("div", { className: "space-y-2" }, [
    P.length ? r("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      r("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      r("div", { key: "options", className: "space-y-2" }, P.map((k, D) => r("button", {
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
      r("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${P.length} to apply and save`)
    ]) : null,
    r("div", { key: "slots", className: "grid gap-2" }, o.map((k) => r("label", { key: k.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      r("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Lt(k)),
      (k.genderHints || []).length ? r("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(k.genderHints || []).map(Zr).join(" · ")}`) : null,
      r("select", { key: "select", value: h[k.slotDefinitionId] || "", disabled: y, onChange: (D) => g({ ...h, [k.slotDefinitionId]: D.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        r("option", { key: "clear", value: "" }, "No performer assigned"),
        ...La(f, f, k.genderHints).map((D) => r("option", { key: yt(D), value: yt(D) }, D.name))
      ])
    ]))),
    r("div", { key: "actions", className: "flex items-center gap-3" }, [r("button", { key: "save", ref: u, type: "button", disabled: y, onClick: () => L(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), r("span", { key: "message", role: "status", className: "text-xs text-secondary" }, N)])
  ]);
}
function nu({ videoId: e, targets: t, performerCandidates: n, onSaved: o, onConflict: i, shortcutRef: a, acquireSaveLock: s = () => () => {
} }) {
  var L;
  const l = ((L = t[0]) == null ? void 0 : L.slots) || [], d = Fo(n), c = Pa(
    l,
    d
  ), u = "__mixed__", m = () => Object.fromEntries(l.map(($, S) => {
    const k = t.map((D) => {
      var B;
      return String(((B = D.slots[S]) == null ? void 0 : B.performerId) || "");
    });
    return [$.slotDefinitionId, k.every((D) => D === k[0]) ? k[0] : u];
  })), [f, h] = K(m), [g, y] = K(!1), [x, N] = K(""), p = pe(!1), E = t.map(($) => `${$.itemId ?? `native:${$.segmentId}`}:${$.revision}:${$.slots.map((S) => `${S.slotDefinitionId}:${S.performerId || ""}`).join(",")}`).join("|");
  he(() => {
    h(m());
  }, [E]);
  async function Q($ = f) {
    if (p.current) return;
    const S = s();
    if (!S) {
      N("Wait for the current save to finish before saving performer slots.");
      return;
    }
    p.current = !0, y(!0), N(`Saving performer slots for ${t.length} segments…`);
    const k = [];
    try {
      for (const D of t) {
        const B = D.slots.map((T, q) => {
          const Y = $[l[q].slotDefinitionId];
          return {
            slotDefinitionId: T.slotDefinitionId,
            performerId: Y === u ? T.performerId || null : Y ? Number(Y) : null
          };
        }), U = await re(D.itemId != null ? `/videos/${e}/drafts/${D.itemId}/slots` : `/videos/${e}/segments/${D.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: D.revision, assignments: B })
        });
        k.push({
          segmentId: D.segmentId,
          itemId: D.itemId,
          revision: U.revision,
          slots: U.slots || []
        });
      }
      N("Performer slots saved."), await o({
        beforeState: qr(t),
        afterState: qr(k)
      });
    } catch (D) {
      const B = await i();
      D.status === 409 ? N(B ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : N(D.message || (B ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      p.current = !1, y(!1), S();
    }
  }
  function V($, S) {
    N(`Option ${S + 1} applied; save to confirm.`), h({ ...f, ...$.assignments });
  }
  async function P($) {
    const S = { ...f, ...$.assignments };
    h(S), await Q(S);
  }
  return he(() => {
    if (a)
      return a.current = ($) => p.current || !c[$] ? !1 : (P(c[$]), !0), () => {
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
      r("div", { key: "options", className: "space-y-2" }, c.map(($, S) => r("button", {
        key: S,
        type: "button",
        disabled: g,
        onClick: () => V($, S),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${S + 1} to all selected segments: ${$.description}`
      }, [
        r("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, S + 1),
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
        value: f[$.slotDefinitionId] || "",
        disabled: g,
        onChange: (S) => h({ ...f, [$.slotDefinitionId]: S.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        f[$.slotDefinitionId] === u ? r("option", { key: "mixed", value: u }, "Mixed — leave unchanged") : null,
        r("option", { key: "clear", value: "" }, "No performer assigned"),
        ...La(d, d, $.genderHints).map((S) => r("option", {
          key: yt(S),
          value: yt(S)
        }, S.name))
      ])
    ]))),
    r("div", { key: "actions", className: "flex items-center gap-3" }, [
      r("button", {
        key: "save",
        type: "button",
        disabled: g,
        onClick: () => Q(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      r("span", { key: "message", role: "status", className: "text-xs text-secondary" }, x)
    ])
  ]);
}
function Ht(e, t = null) {
  const n = String(e || "").trim().toLowerCase();
  return n === "ext:segment-studio:stash-marker-studio" || n === "stash-marker-studio" || n === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : n === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : n === "segment-studio/user" || n === "user" ? "Manual" : n === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : n === "tpdb" ? "TPDB" : n ? n.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function ru(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const n = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (n.length === 0) return Ht(t);
  const o = [...new Set(n.map((i) => Ht(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function no() {
  return r("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function Fr({ name: e }) {
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
function ou({ hidden: e }) {
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
    r(no, { key: "derived" })
  ]);
}
function iu({ segment: e, provenance: t }) {
  var u;
  const [n, o] = K(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = ru(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
        const f = m.modelIdentifier || m.modelKey, h = m.value == null ? null : typeof m.value == "string" ? m.value : JSON.stringify(m.value);
        return r("div", { key: m.id || `${m.fieldKey}:${m.sourceKey}:${m.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          r(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            Ht(m.sourceKey, m.sourceDisplayName)
          ),
          m.fieldKey ? r(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${m.fieldKey}${h == null ? "" : ` · ${h}`}`
          ) : null,
          m.relation === "inherited" ? r("div", { key: "relation", className: "text-secondary" }, "Inherited origin") : null,
          f ? r(
            "div",
            { key: "model", className: "text-secondary" },
            `Model ${f}${m.modelVersion ? ` · ${m.modelVersion}` : ""}`
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
function au({
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
  const [m, f] = K([]), h = e.flatMap((N) => N.lanes.map((p) => p.key)), g = h.join("|");
  he(() => {
    const N = new Set(h);
    f((p) => p.filter((E) => N.has(E)));
  }, [g]);
  const y = Wr(t), x = !!Xa(
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
      a ? r(ln, { key: "counts", counts: y }) : null
    ]),
    r(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      cc({ mergeable: x, reviewable: a, tagEditable: s, slotsEditable: l })
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
    ...e.map((N) => r("section", {
      key: N.key,
      "data-selected-segment-group": N.key,
      className: "space-y-1.5"
    }, [
      r("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        r("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, N.name),
        r("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${N.selectedCount} selected`)
      ]),
      ...N.lanes.map((p) => {
        const E = m.includes(p.key), Q = p.markers.some(({ segment: P }) => P.id === n), V = `selected-segment-lane-${p.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return r("div", {
          key: p.key,
          "data-selected-segment-lane": p.key,
          className: `rounded-md border ${Q ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          r("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": E,
            "aria-controls": V,
            "aria-current": Q ? "true" : void 0,
            onClick: () => f((P) => E ? P.filter((L) => L !== p.key) : [...P, p.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            r("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, E ? "▾" : "▸"),
            r("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, pr(p)),
            r("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(p.selectedCount)),
            a ? r(ln, { key: "states", counts: p.counts }) : null
          ]),
          E ? r("div", {
            key: "segments",
            id: V,
            className: "space-y-1 border-t border-border p-1.5"
          }, p.markers.map(({ segment: P }) => {
            const L = P.endSec == null ? Ge(P.startSec) : `${Ge(P.startSec)} – ${Ge(P.endSec)}`;
            return r("button", {
              key: P.id,
              type: "button",
              onClick: () => i(P),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${P.id === n ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${P.tagName || "Segment"}, ${P.reviewState}, ${L}` : `${P.tagName || "Segment"}, ${L}`,
              "aria-current": P.id === n ? "true" : void 0
            }, [
              a ? r(xn, {
                key: "state",
                state: P.reviewState,
                includeLabel: !1
              }) : null,
              P.isDerived ? r(no, { key: "derived" }) : null,
              r("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, L),
              r(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                Ht(P.sourceKey)
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
}, ls = "com.midnightrider.segment-studio", su = /* @__PURE__ */ new Set(["hasSegments"]), lu = /* @__PURE__ */ new Set(["segment_count", "unreviewed_count"]), du = {
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
function dr(e, t, n) {
  return { extensionId: ls, filterId: e, modifier: t, value: n };
}
function Zi(e) {
  return typeof e == "boolean" ? e : e === "has" ? !0 : e === "none" ? !1 : null;
}
function ea(e) {
  const t = Jr(e == null ? void 0 : e.value), n = Jr(e == null ? void 0 : e.excludes), o = { INCLUDES_ALL: "includesall", EXCLUDES: "excludes", IS_NULL: "isnull", NOT_NULL: "notnull" }[e == null ? void 0 : e.modifier] ?? "includes";
  return o === "isnull" || o === "notnull" ? dr("segment-tags", o, {}) : t.length === 0 && (o === "excludes" || n.length === 0) ? null : dr("segment-tags", o, {
    ...t.length > 0 ? { value: t } : {},
    ...n.length > 0 && o !== "excludes" ? { excludes: n } : {},
    ...(e == null ? void 0 : e.depth) === -1 ? { depth: -1 } : {}
  });
}
function Ro(e = {}, { fullMode: t = !0 } = {}) {
  var x, N, p;
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
  if (!n.some((E) => Object.hasOwn(e, E))) return e;
  const o = { ...e };
  n.forEach((E) => delete o[E]);
  const i = [], a = Zi(((x = e.hasSegmentsCriterion) == null ? void 0 : x.value) ?? e.segments);
  a !== null && i.push(dr("has-segments", "equals", a));
  const s = ((N = e.reviewStateCriterion) == null ? void 0 : N.value) ?? e.reviewState;
  t && ["unreviewed", "approved", "rejected"].includes(s) && i.push(dr("review-state", "equals", s));
  const l = Zi(((p = e.shotBoundariesCriterion) == null ? void 0 : p.value) ?? e.shotBoundaries);
  t && l !== null && i.push(dr("has-shot-boundaries", "equals", l));
  const d = Number(e.segmentTagId ?? e.tagId) || null, c = e.segmentTagsCriterion ? ea(e.segmentTagsCriterion) : d ? ea({ value: [d] }) : null;
  c && i.push(c);
  const u = Jr(e.videoTagIds);
  u.length > 0 && !o.tagsCriterion && (o.tagsCriterion = { modifier: "INCLUDES", value: u });
  const m = Jr(e.performerIds);
  m.length > 0 && !o.performersCriterion && (o.performersCriterion = { modifier: "INCLUDES", value: m });
  const f = Number(e.studioId) || null;
  f && !o.studiosCriterion && (o.studiosCriterion = { modifier: "INCLUDES", value: [f] });
  const h = Array.isArray(e.extensionCriteria) ? e.extensionCriteria : [], g = new Set(h.filter((E) => (E == null ? void 0 : E.extensionId) === ls).map((E) => E.filterId)), y = [...h, ...i.filter((E) => !g.has(E.filterId))];
  return y.length > 0 ? o.extensionCriteria = y : delete o.extensionCriteria, o;
}
function Eo(e) {
  return lu.has(e == null ? void 0 : e.sort) ? { ...e, sort: Vt.defaultFilter.sort, direction: Vt.defaultFilter.direction } : e;
}
function Vr(e) {
  return Array.isArray(e) ? e.map(Vr) : !e || typeof e != "object" ? e : Object.fromEntries(Object.entries(e).map(([t, n]) => [
    t,
    t === "modifier" && typeof n == "string" ? du[n] ?? n : Vr(n)
  ]));
}
function cu(e, t, { fullMode: n = !0 } = {}) {
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
    objectFilter: Vr(l),
    ...(d = s == null ? void 0 : s.children) != null && d.length ? { filterExpression: Vr(s) } : {}
  };
}
function uu(e) {
  return e.filter((t) => !su.has(t.id));
}
function mu(e, t) {
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
function hr(e, t, n) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(n));
}
function ds(e, t, n) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(n));
}
function Jr(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((n) => Number.isInteger(n) && n > 0))];
}
function gu(e, t, n, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(n);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((u) => a.add(u));
  } else a.has(n) ? a.delete(n) : a.add(n);
  return a;
}
function cs({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? r("div", { className: "text-[11px]" }, r(_i, null, "No tag segments")) : t ? r("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, At.flatMap((n) => {
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
    r(_i, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function us({ item: e, selected: t, selectionActive: n, onSelect: o }) {
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
function pu({ item: e, onNavigate: t, showReviewStates: n = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      onClick: (l) => hr(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    r("div", { key: "media", className: "relative aspect-video bg-black" }, [
      r("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      r(us, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? r("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, dl(e.duration)) : null
    ]),
    r("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      r("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      r("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? r("span", { key: "date" }, e.date) : null,
        e.organized ? r("span", { key: "organized" }, "Organized") : null,
        e.isVr ? r("span", { key: "vr" }, "VR") : null
      ]),
      r("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, r(cs, { item: e, showReviewStates: n }))
    ])
  ]);
}
function fu({ item: e, onNavigate: t, showReviewStates: n = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return r("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    r(us, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
    r(i ? "div" : "a", {
      key: "link",
      href: i ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: i ? void 0 : (l) => hr(l, t, s),
      className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }, [
      r("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
      r("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
        r("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
        r(cs, { key: "segments", item: e, showReviewStates: n })
      ]),
      r("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function Vo({ active: e, onNavigate: t, showBin: n = !1, profile: o }) {
  const i = pd(o);
  return r("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    r("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => r("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => hr(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    r("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      n && Un(
        o,
        Zt.recyclingBinView
      ) ? r(ms, { key: "bin", onNavigate: t }) : null,
      r(gs, { key: "settings", onNavigate: t })
    ])
  ]);
}
const Mo = "segment-studio:recycling-bin-changed";
function yu(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function cr() {
  window.dispatchEvent(new CustomEvent(Mo));
}
function ms({ onNavigate: e, compact: t = !1 }) {
  const [n, o] = K(null);
  he(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const u = await re("/bin"), m = Number(u == null ? void 0 : u.totalCount);
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
  const i = yu(n);
  return r("a", {
    href: "/segment-studio/bin",
    onClick: (a) => hr(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": n == null ? "Open recycling bin" : `Open recycling bin, ${n} item${n === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [r("span", { key: "icon", "aria-hidden": "true" }, "♲"), r("span", { key: "label" }, i)]);
}
function gs({ onNavigate: e, compact: t = !1 }) {
  return r("a", {
    href: "/segment-studio/settings",
    onClick: (n) => hr(n, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [r("span", { key: "icon", "aria-hidden": "true" }, "⚙"), r("span", { key: "label" }, "Settings")]);
}
function bu({ mode: e, onModeChange: t, disabled: n = !1 }) {
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
function hu({ minimum: e, maximum: t, onChange: n }) {
  const o = pe(null), [i, a] = K("maximum"), s = (f, h) => {
    const g = Fl(e, t, f, h);
    a(g.coincidentTop), n({ minimum: g.minimum, maximum: g.maximum });
  }, l = (f, h) => {
    var y;
    const g = (y = o.current) == null ? void 0 : y.getBoundingClientRect();
    g && s(f, jl(h.clientX, g.left, g.width));
  }, d = (f, h) => {
    var g, y;
    h.preventDefault(), (y = (g = h.currentTarget).setPointerCapture) == null || y.call(g, h.pointerId), l(f, h);
  }, c = (f, h) => {
    var g, y;
    (y = (g = h.currentTarget).hasPointerCapture) != null && y.call(g, h.pointerId) && l(f, h);
  }, u = (f, h) => {
    const g = f === "minimum" ? e : t, y = f === "minimum" ? 0 : e, x = f === "minimum" ? t : 1, N = h.shiftKey ? 0.1 : 0.01;
    let p = null;
    ["ArrowLeft", "ArrowDown"].includes(h.key) && (p = g - N), ["ArrowRight", "ArrowUp"].includes(h.key) && (p = g + N), h.key === "PageDown" && (p = g - 0.1), h.key === "PageUp" && (p = g + 0.1), h.key === "Home" && (p = y), h.key === "End" && (p = x), p != null && (h.preventDefault(), s(f, Math.min(x, Math.max(y, p))));
  }, m = (f, h) => r("span", {
    key: f,
    role: "slider",
    tabIndex: 0,
    "aria-label": f === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((f === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((f === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(h * 100),
    "aria-valuetext": `${Math.round(h * 100)} percent`,
    onPointerDown: (g) => d(f, g),
    onPointerMove: (g) => c(f, g),
    onKeyDown: (g) => u(f, g),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${h * 100}%`,
      touchAction: "none",
      zIndex: e === t && i === f ? 2 : 1
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
function vu({ saving: e, error: t, onSelect: n, onClose: o }) {
  const i = pe(null);
  he(() => {
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
    r(mr, {
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
function Su({
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
  const m = Gt(e), f = [...new Map((a || []).map((p) => [
    Number(p.tagId),
    p.tagName || `Tag ${p.tagId}`
  ])).entries()].sort((p, E) => p[1].localeCompare(E[1]) || p[0] - E[0]), h = new Set((a || []).map((p) => Number(p.tagId))), g = (s || []).filter((p) => Number(p.id) === m.segmentGroupId || (p.tags || []).some((E) => h.has(Number(E.tagId)))), y = (p) => d(Gt({ ...m, ...p })), x = (p) => y({
    reviewStates: m.reviewStates.includes(p) ? m.reviewStates.filter((E) => E !== p) : [...m.reviewStates, p]
  }), N = (p) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${p ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (p) => {
      p.target === p.currentTarget && u();
    },
    onKeyDownCapture: (p) => Pt(p, { onCancel: u })
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
        r("div", { className: "flex flex-wrap gap-2" }, At.map((p) => {
          const E = m.reviewStates.includes(p), Q = zt[p];
          return r("button", {
            key: p,
            type: "button",
            onClick: () => x(p),
            "aria-pressed": E,
            className: N(E)
          }, `${Q.symbol} ${p} (${i[p] || 0})`);
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
            className: N(m.performerId == null)
          }, "All performers"),
          ...n.map((p) => {
            const E = Number(yt(p));
            return r("button", {
              key: E,
              type: "button",
              onClick: () => y({ performerId: E }),
              "aria-pressed": m.performerId === E,
              className: N(m.performerId === E)
            }, p.name);
          })
        ])
      ]) : null,
      r("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        r("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          r("span", { key: "label" }, "Tag"),
          r("select", {
            key: "select",
            value: m.tagId ?? "",
            onChange: (p) => y({
              tagId: p.target.value === "" ? null : Number(p.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            r("option", { key: "all", value: "" }, "All tags"),
            ...f.map(([p, E]) => r("option", { key: p, value: p }, E))
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
            onChange: (p) => y({
              segmentGroupId: p.target.value === "" ? null : p.target.value === "ungrouped" ? "ungrouped" : Number(p.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            r("option", { key: "all", value: "" }, "All Segment groups"),
            ...g.map((p) => r("option", { key: p.id, value: p.id }, p.name)),
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
            className: N(m.sourceKey == null)
          }, "All provenance"),
          ...o.map((p) => r("button", {
            key: p,
            type: "button",
            onClick: () => y({ sourceKey: p }),
            "aria-pressed": m.sourceKey === p,
            title: p,
            className: N(m.sourceKey === p)
          }, Ht(p)))
        ])
      ]),
      r("fieldset", { key: "confidence", className: "space-y-3" }, [
        r("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        r(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        r(hu, {
          minimum: m.confidenceMin,
          maximum: m.confidenceMax,
          onChange: ({ minimum: p, maximum: E }) => y({
            confidenceMin: p,
            confidenceMax: E
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
            onChange: (p) => y({
              includeUnscored: p.target.checked
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
          onChange: (p) => c(p.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]"
        }),
        r(ou, { key: "icon", hidden: t }),
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
const ps = "segment-studio-editor-history";
function xu({ history: e, historySaving: t, anchorRef: n, onRestore: o, onClose: i }) {
  const a = pe(null);
  return he(() => {
    const s = (d) => {
      ic(d.target, a.current, n == null ? void 0 : n.current) && i();
    }, l = (d) => {
      var m, f, h;
      if (d.key !== "Escape" || d.defaultPrevented || document.querySelector("[role='dialog'], [aria-modal='true']")) return;
      const c = document.activeElement, u = c instanceof Element && (((m = a.current) == null ? void 0 : m.contains(c)) || ((f = n == null ? void 0 : n.current) == null ? void 0 : f.contains(c)));
      d.preventDefault(), i(), u && ((h = n == null ? void 0 : n.current) == null || h.focus({ preventScroll: !0 }));
    };
    return document.addEventListener("pointerdown", s), document.addEventListener("keydown", l), () => {
      document.removeEventListener("pointerdown", s), document.removeEventListener("keydown", l);
    };
  }, [n, i]), r("div", {
    ref: a,
    id: ps,
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
function ku({ reviewMode: e, bindings: t, onClose: n }) {
  const o = yr.filter((l) => Bn(l, e)), i = Ai(o, 1)[0], a = Ai(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((u) => r("div", { key: u.id, className: "flex items-center justify-between text-sm" }, [
      r("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, u.description),
      r(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[u.id] ? t[u.id].length > 0 ? t[u.id] : ["Unassigned"] : u.bindings.map(Na)).map((m, f) => r("kbd", { key: `${u.id}:${f}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, m))
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
function wu({
  examples: e,
  exporting: t,
  removingExampleId: n,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = Rc(e), [l, d] = K([]), c = s.map((u) => u.tagName).join("|");
  return he(() => {
    const u = new Set(s.map((m) => m.tagName));
    d((m) => m.filter((f) => u.has(f)));
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
        const f = l.includes(u.tagName), h = `incorrect-example-tag-${m}`;
        return r("section", {
          key: u.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          r("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": f,
            "aria-controls": h,
            onClick: () => d((g) => f ? g.filter((y) => y !== u.tagName) : [...g, u.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: Xr(!1) }
          }, [
            r(
              "span",
              { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" },
              f ? "▾" : "▸"
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
          f ? r("div", {
            key: "examples",
            id: h,
            className: "divide-y divide-border border-t border-border"
          }, u.examples.map((g) => {
            const y = `${Ge(g.startSec)}${g.endSec == null ? "" : ` – ${Ge(g.endSec)}`}`, x = n === g.id;
            return r("div", {
              key: g.id,
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
                onClick: () => i(g),
                "aria-label": `${x ? "Restoring" : "Restore to review"} ${u.tagName} example at ${y}`,
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
function Nu({ segments: e, onSelect: t, onClose: n }) {
  const [o, i] = K(""), [a, s] = K(0), l = pe(null), d = qe(() => Od(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), u = Ld(d);
  he(() => {
    var f;
    (f = l.current) == null || f.scrollIntoView({ block: "nearest" });
  }, [c, o]);
  const m = () => {
    const f = d[c];
    f && t(f.segment || f);
  };
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-start justify-center bg-black/70 p-4 pt-[10vh]",
    onMouseDown: (f) => {
      f.target === f.currentTarget && n();
    }
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-quick-search-title",
    tabIndex: -1,
    className: "flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    onKeyDownCapture: (f) => {
      var h;
      if (f.key === "Tab")
        Jt(f);
      else if (f.key === "Escape")
        f.preventDefault(), f.stopPropagation(), n();
      else if (f.key === "ArrowDown" || f.key === "ArrowUp") {
        f.preventDefault(), f.stopPropagation();
        const g = f.key === "ArrowDown" ? 1 : -1;
        s((y) => d.length ? (y + g + d.length) % d.length : 0);
      } else f.key === "Enter" && !((h = f.nativeEvent) != null && h.isComposing) && (f.preventDefault(), f.stopPropagation(), m());
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
    r("div", {
      key: "results",
      id: "segment-studio-quick-search-results",
      role: "listbox",
      "aria-label": "Matching segments",
      className: "min-h-0 flex-1 overflow-y-auto p-2"
    }, d.length ? d.flatMap((f, h) => {
      var V;
      const g = f.segment || f, y = g.endSec == null ? Ge(g.startSec) : `${Ge(g.startSec)} – ${Ge(g.endSec)}`, x = `${Ht(g.sourceKey)}${g.confidence == null ? "" : ` · ${Math.round(g.confidence * 100)}%`}`, N = h === c, p = h > 0 ? d[h - 1].groupKey : null, E = u && f.groupKey !== p ? r("div", {
        key: `group:${f.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, f.groupName) : null, Q = r("button", {
        key: g.id,
        id: `segment-quick-search-${g.id}`,
        ref: N ? l : null,
        type: "button",
        role: "option",
        "aria-selected": N,
        onMouseEnter: () => s(h),
        onClick: () => t(g),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${N ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        u ? r("span", { key: "group", className: "sr-only" }, `${f.groupName} group`) : null,
        r(xn, { key: "review", state: g.reviewState, includeLabel: !1 }),
        r(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          g.tagName || "Tag segment"
        ),
        (V = f.performers) != null && V.length ? r(eo, {
          key: "performers",
          performers: f.performers,
          performerAssignments: f.performerAssignments
        }) : null,
        r(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          y
        ),
        r("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: x
        }, x)
      ]);
      return E ? [E, Q] : [Q];
    }) : r("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function Iu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e || []) {
    if (!Qr(n)) continue;
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
function Cu({
  drafts: e,
  processing: t,
  error: n,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = qe(() => Iu(e), [e]), [l, d] = K([]), c = s.reduce((h, g) => h + g.drafts.length, 0), u = pe(null);
  Ko({ confirmRef: u, cancelRef: o, confirmReady: !t && c > 0 });
  const m = (h) => d((g) => g.includes(h) ? g.filter((y) => y !== h) : [...g, h]), f = (h) => `segment-studio-publish-approved-${h.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
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
      ].flatMap(([h, g]) => [
        r("dt", { key: `${h}:label`, className: "text-secondary" }, h),
        r("dd", { key: `${h}:value`, className: "font-semibold text-foreground" }, String(g))
      ])),
      s.length ? r("div", { key: "groups", className: "space-y-2" }, s.map((h) => {
        const g = l.includes(h.key);
        return r("section", { key: h.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          r("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": g,
            "aria-controls": f(h),
            onClick: () => m(h.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: Xr(!1) }
          }, [
            r("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, g ? "▾" : "▸"),
            r("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, h.tagName),
            r(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${h.drafts.length} draft${h.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          g ? r("div", {
            key: "drafts",
            id: f(h),
            className: "divide-y divide-border border-t border-border"
          }, h.drafts.map((y) => {
            const x = y.endSec == null ? Ge(y.startSec) : `${Ge(y.startSec)} – ${Ge(y.endSec)}`, N = `${Ht(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`;
            return r("div", { key: y.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              r(xn, { key: "review", state: y.reviewState, includeLabel: !1 }),
              r("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, x),
              r("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: N
              }, N)
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
function $u({ candidates: e, processing: t, error: n, onConfirm: o, onClose: i }) {
  const a = Dd(e), [s, l] = K(() => /* @__PURE__ */ new Set()), [d, c] = K(() => new Set(a.map((y) => y.key))), u = a.flatMap((y) => d.has(y.key) ? y.candidates : []), m = (y) => l((x) => {
    const N = new Set(x);
    return N.has(y) ? N.delete(y) : N.add(y), N;
  }), f = (y) => c((x) => {
    const N = new Set(x);
    return N.has(y) ? N.delete(y) : N.add(y), N;
  }), h = (y) => y.assignment.map(({ slot: x, performer: N }) => `${x.label || `Slot ${x.sortOrder + 1}`}: ${N.name}`).join(", "), g = (y) => `segment-studio-auto-assign-${y.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
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
          style: { background: Xr(!1) }
        }, [
          r("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(y.key),
            disabled: t,
            onChange: () => f(y.key),
            "aria-label": `Include ${y.tagName} assignment: ${h(y)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          r("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(y.key),
            "aria-controls": g(y),
            "aria-label": `${s.has(y.key) ? "Collapse" : "Expand"} ${y.tagName} assignment: ${h(y)}`,
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
            y.assignment.map(({ slot: x, performer: N }) => {
              const p = x.label || `Slot ${x.sortOrder + 1}`;
              return r("span", {
                key: x.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${p}: ${N.name}`
              }, [
                r("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${p}: ${N.name}`
                }, `${p}: ${N.name}`),
                r(fr, {
                  key: "avatar",
                  performer: { id: N.performerId, name: N.name },
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
            "aria-label": `Auto-Assign ${y.tagName}: ${h(y)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${y.candidates.length})`)
        ]),
        s.has(y.key) ? r(
          "div",
          { key: "segments", id: g(y), className: "divide-y divide-border/70" },
          y.candidates.map((x) => {
            const N = x.endSec == null ? Ge(x.startSec) : `${Ge(x.startSec)} – ${Ge(x.endSec)}`, p = `${Ht(x.sourceKey)}${x.confidence == null ? "" : ` · ${Math.round(x.confidence * 100)}%`}`;
            return r("div", {
              key: x.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              r(xn, { key: "review", state: x.reviewState, includeLabel: !1 }),
              r(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                x.tagName || "Tag segment"
              ),
              r(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                N
              ),
              r("span", {
                key: "provenance",
                className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                title: p
              }, p)
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
function Tu({ preview: e, onConfirm: t, onClose: n }) {
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
function Ru({
  merge: e,
  processing: t,
  undoable: n = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = K(!1), d = pe(null);
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
function Eu(e) {
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
function Mu({ preview: e, loading: t, processing: n, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var m, f;
  const l = e ? e.createCount + e.linkCount : 0, d = pe(null);
  Ko({ confirmRef: d, cancelRef: i, confirmReady: !t && !n && l > 0 && !o });
  const c = ((m = e == null ? void 0 : e.outputs) == null ? void 0 : m.slice(0, 200)) || [], u = Eu(c);
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
        ].flatMap(([h, g]) => [
          r("dt", { key: `${h}:label`, className: "text-secondary" }, h),
          r("dd", { key: `${h}:value`, className: "font-semibold text-foreground" }, String(g))
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
                `${h.rootTagName} @ ${Ge(h.rootStartSec)}`
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
              h.outputs.map((g, y) => r("div", {
                key: `${g.ruleId}:${g.depth}:${y}`,
                className: "flex min-w-0 items-center gap-2 text-sm",
                style: { marginLeft: `${Math.max(0, g.depth - 1) * 1.25}rem` }
              }, [
                r("span", { key: "branch", "aria-hidden": "true", className: "shrink-0 text-secondary" }, "↳"),
                r(
                  "span",
                  { key: "tags", className: "min-w-0 flex-1 truncate text-foreground" },
                  `${g.sourceTagName} → ${g.derivedTagName}`
                ),
                r("span", { key: "depth", className: "shrink-0 text-[11px] text-secondary" }, `Level ${g.depth}`),
                r(
                  "span",
                  { key: "action", className: "shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-foreground" },
                  g.action === "create" ? "Create" : "Link existing"
                )
              ]))
            )
          ])),
          (((f = e.outputs) == null ? void 0 : f.length) || 0) > c.length ? r(
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
function Au({
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
  selectedPerformerSlots: f,
  performerSlots: h,
  detail: g,
  video: y,
  slotButtonRef: x,
  tagSearchRef: N,
  onDetailChange: p,
  setSaveMessage: E,
  acquireSaveLock: Q,
  onSlotsChanged: V,
  onRecordHistory: P,
  onCancelQueuedReview: L,
  splitSegment: $,
  duplicateSegment: S,
  provenance: k,
  lineage: D,
  onNavigateLineageItem: B,
  tagEditing: U,
  onCancelTagEditing: T,
  detailPanelRef: q,
  onReduceSelection: Y
}) {
  var fe, ke, Se;
  const j = pe(null), Z = pe(null), ie = () => {
    var H;
    (H = Z.current) == null || H.call(Z), Z.current = null;
  }, ae = pe(null), ve = pe(null), de = pe(null), De = pe(null), [be, _] = K(!1);
  he(() => {
    j.current && (j.current.scrollTop = 0), _(!1);
  }, [t == null ? void 0 : t.id]), he(() => {
    var H, we;
    be && ((we = (H = ae.current) == null ? void 0 : H.querySelector("input, select, button")) == null || we.focus({ preventScroll: !0 }));
  }, [be]);
  function ue() {
    _(!1), requestAnimationFrame(() => {
      var H;
      return (H = x.current) == null ? void 0 : H.focus({ preventScroll: !0 });
    });
  }
  if (n.length > 1) {
    const H = !n.some((w) => w.isDerived), we = e && m ? dc(h, n) : null, le = (we == null ? void 0 : we.map((w, F) => {
      var I;
      const A = n[F];
      return {
        segmentId: A.nativeSegmentId,
        itemId: A.published ? null : A.itemId,
        revision: (I = g.performerSlotRevisions) == null ? void 0 : I[A.id],
        slots: w
      };
    })) || [];
    return r(Ao.Fragment, null, [
      r(au, {
        key: "details",
        selectedGroups: o,
        selectedSegments: n,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: q,
        onReduceSelection: Y,
        reviewable: e,
        tagEditable: H,
        slotsEditable: le.length > 0 && a == null,
        onEditSlots: () => _(!0),
        slotButtonRef: x,
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
        ref: N,
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
        r(mr, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (w, F) => w == null ? T() : d(w, F == null ? void 0 : F.label),
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
      be && le.length > 0 ? r("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (w) => {
          w.target === w.currentTarget && ue();
        },
        onKeyDownCapture: (w) => {
          var A, I;
          if (!(typeof ((A = w.target) == null ? void 0 : A.closest) == "function" ? w.target.closest("input, textarea, select, [contenteditable='true']") : null) && !w.repeat && !w.ctrlKey && !w.altKey && !w.metaKey && !w.shiftKey && /^[1-9]$/.test(w.key) && ((I = De.current) != null && I.call(De, Number(w.key) - 1))) {
            w.preventDefault(), w.stopPropagation();
            return;
          }
          Pt(w, { onCancel: ue });
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
        r("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, r(nu, {
          videoId: y.id,
          targets: le,
          performerCandidates: g.performerCandidates || [],
          shortcutRef: De,
          acquireSaveLock: () => Q("slots", -1),
          onSaved: async ({ beforeState: w, afterState: F }) => {
            await P(
              "performer-slots.assign",
              `Assigned performers to ${le.length} segments`,
              w,
              F
            ), ue(), await V();
          },
          onConflict: V
        }))
      ])) : null
    ]);
  }
  return r("div", {
    ref: (H) => {
      j.current = H, q && (q.current = H);
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
        t != null && t.isDerived ? r(no, { key: "derived" }) : null,
        t && U ? r("div", {
          key: "tag-editor",
          ref: N,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (H) => {
            H.key === "Escape" && (H.preventDefault(), H.stopPropagation(), T());
          },
          onKeyDown: (H) => {
            ac(H, t.tagName) && (H.preventDefault(), H.stopPropagation(), d(t.tagId));
          }
        }, r(mr, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (H, we) => H == null ? T() : d(H, we == null ? void 0 : we.label),
          // Until lineage loads, the projection's derived flag says whether a rule sets the tag.
          disabled: sd(s ? a ?? -1 : null, t.id, l) || (D.data ? D.data.tagReadOnly === !0 : t.isDerived === !0),
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
      e && t && (u === "empty" || u === "partial") ? r("div", { key: "slots-row" }, r(eu, { status: u })) : null,
      t && m && f.length > 0 ? r("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, r(Za, {
        assignments: f.map((H) => {
          const we = gc(H);
          return {
            key: String(H.slotDefinitionId),
            label: we.label,
            performer: we.filled ? { id: Number(H.performerId), name: we.performer } : null,
            title: we.title
          };
        })
      })) : null,
      i ? r("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? r(iu, {
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
          (fe = D.data.parents) != null && fe.length ? r("div", { key: "parents" }, [
            r("span", { key: "label" }, "Parents: "),
            ...D.data.parents.map((H) => r("button", {
              key: H.nodeId,
              type: "button",
              onClick: () => B(H.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${H.ruleKey} ${H.ruleVersion}`))
          ]) : null,
          (ke = D.data.children) != null && ke.length ? r("p", { key: "children" }, `Children: ${D.data.children.length}`) : null
        ]) : r("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      r("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        r("button", { key: "apply", type: "button", disabled: s, onClick: c, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? r("button", {
          key: "slots",
          ref: x,
          type: "button",
          disabled: a != null || !m || f.length === 0,
          onClick: () => _(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: m ? f.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, f.length === 0 ? "No performer slots" : "Edit performer slots") : null,
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
    be && e && t && m && f.length > 0 ? r("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (H) => {
        H.target === H.currentTarget && ue();
      },
      onKeyDownCapture: (H) => {
        var le, w;
        if (!(typeof ((le = H.target) == null ? void 0 : le.closest) == "function" ? H.target.closest("input, textarea, select, [contenteditable='true']") : null) && !H.repeat && !H.ctrlKey && !H.altKey && !H.metaKey && !H.shiftKey && /^[1-9]$/.test(H.key) && ((w = de.current) != null && w.call(de, Number(H.key) - 1))) {
          H.preventDefault(), H.stopPropagation();
          return;
        }
        Pt(H, {
          onCancel: ue,
          onConfirm: () => {
            var F;
            return (F = ve.current) == null ? void 0 : F.click();
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
      r("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, r(tu, {
        key: `${t.id}:${g.performerSlotsRevision || g.slotRevision || ""}`,
        videoId: y.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: f,
        revision: (Se = g.performerSlotRevisions) == null ? void 0 : Se[t.id],
        performerCandidates: g.performerCandidates || [],
        confirmRef: ve,
        shortcutRef: de,
        onOptimisticSave: (H) => {
          const we = Q("slots", t.id);
          if (!we)
            return E("Wait for the current save to finish before saving performer slots."), !1;
          Z.current = we, p((le) => Gn(
            le,
            t.id,
            H
          ), y.id), E("Saving performer slots…"), ue();
        },
        onSaved: async (H, { beforeState: we, afterState: le }) => {
          p((w) => Gn(
            w,
            t.id,
            H.slots || [],
            H.revision
          ), y.id), E("Performer slots saved.");
          try {
            await P(
              "performer-slots.assign",
              "Assigned performers",
              we,
              le
            ), await V(H) || L([t]);
          } finally {
            ie();
          }
        },
        onRollback: async (H, we) => {
          L([t]), p((le) => {
            var w;
            return Gn(
              le,
              t.id,
              H,
              (w = g.performerSlotRevisions) == null ? void 0 : w[t.id]
            );
          }, y.id), E(we.message || "Unable to save performer slots.");
          try {
            we.status === 409 && await V();
          } finally {
            ie();
          }
        },
        onConflict: V
      }))
    ])) : null
  ]);
}
function Du({ segments: e, shotBoundaries: t = [], segmentGroups: n, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: u, onZoomChange: m, onSelectGroup: f, onToggleGroup: h, onSelect: g, onSelectSegments: y, onSelectAll: x, onConfigureTag: N, onSeekTime: p, centerRef: E, showReviewState: Q = !0, swimlaneTitleWidth: V, onSwimlaneTitleWidthChange: P }) {
  const L = pe(null), $ = pe(null), [S, k] = K(0), [D, B] = K({ scrollTop: 0, height: 320 }), [U, T] = K(null), q = qe(
    () => vn(e, n, o),
    [e, n, o]
  ), Y = qe(
    () => Ja(o),
    [o]
  ), j = qe(() => Ho(q), [q]), Z = qe(
    () => hc(j, i, Ya(j)),
    [j, i]
  ), ie = qe(
    () => Qa(Z.rows, Math.max(0, D.scrollTop - 24), D.height),
    [Z, D]
  ), ae = Math.max(0, Number(d) || 0), ve = Tl(S), de = Gr(V, ve), De = de / 16, be = Cl(c, ae, De), _ = xl(ae), ue = kl(ae, Math.max(1, S - De * 16), u), fe = _.filter((I, b) => b === 0 || b % ue === 0), ke = qe(() => q.map((I) => `${I.key}:${I.trackCount}:${I.markers.map(({ segment: b, track: G }) => `${b.id}:${b.startSec}:${b.endSec ?? ""}:${G}`).join(",")}`).join("|"), [q]);
  function Se() {
    const I = $.current;
    if (!I) return;
    const b = I.querySelector("[data-timeline-track]"), G = I.firstElementChild, O = b == null ? void 0 : b.getBoundingClientRect(), X = G == null ? void 0 : G.getBoundingClientRect(), C = O && X ? Math.max(0, O.left - X.left) : De * 16, ce = (X == null ? void 0 : X.width) ?? I.scrollWidth;
    I.scrollTo({
      left: Il(c, ae, ce, I.clientWidth, C, ya),
      behavior: "smooth"
    });
  }
  he(() => (E.current = Se, () => {
    E.current === Se && (E.current = null);
  })), he(() => {
    Se();
  }, [u]);
  function H() {
    const I = $.current, b = Z.rows.find((ce) => ce.kind === "lane" && ce.lane.markers.some(({ segment: Ne }) => Ne.id === s));
    if (!I || !b) return;
    const G = 24, O = b.top + G, X = O + b.height;
    let C = I.scrollTop;
    O < I.scrollTop + G ? C = Math.max(0, O - G) : X > I.scrollTop + I.clientHeight && (C = Math.max(0, X - I.clientHeight)), C !== I.scrollTop && (I.scrollTop = C), B({ scrollTop: C, height: I.clientHeight });
  }
  he(() => {
    H();
  }, [s, ke, Z]), he(() => {
    const I = $.current, b = Z.rows.find((ce) => ce.kind === "group" && ce.group.key === a);
    if (!I || !b) return;
    const G = 24, O = b.top + G, X = O + b.height;
    let C = I.scrollTop;
    O < I.scrollTop + G ? C = Math.max(0, O - G) : X > I.scrollTop + I.clientHeight && (C = Math.max(0, X - I.clientHeight)), C !== I.scrollTop && (I.scrollTop = C), B({ scrollTop: C, height: I.clientHeight });
  }, [a, Z]), he(() => {
    const I = $.current;
    if (!I || typeof ResizeObserver > "u") return;
    const b = () => {
      k(I.clientWidth), B({ scrollTop: I.scrollTop, height: I.clientHeight }), H();
    }, G = new ResizeObserver(b);
    return G.observe(I), b(), () => G.disconnect();
  }, [s, ke, Z]);
  function we(I) {
    if (!(ae > 0)) return;
    const b = I.currentTarget.getBoundingClientRect(), G = Math.min(1, Math.max(0, (I.clientX - b.left) / b.width));
    p(G * ae);
  }
  function le(I) {
    const b = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let G = null;
    Object.hasOwn(b, I.key) && (G = c + b[I.key]), I.key === "Home" && (G = 0), I.key === "End" && (G = ae), G != null && (I.preventDefault(), I.stopPropagation(), p(Math.min(ae, Math.max(0, G))));
  }
  function w(I) {
    var G;
    const b = (G = L.current) == null ? void 0 : G.getBoundingClientRect();
    b && P(Gr(I.clientX - b.left, ve));
  }
  function F(I) {
    const b = I.shiftKey ? 40 : 16;
    let G = null;
    I.key === "ArrowLeft" && (G = de - b), I.key === "ArrowRight" && (G = de + b), I.key === "Home" && (G = 160), I.key === "End" && (G = ve), G != null && (I.preventDefault(), I.stopPropagation(), P(Gr(G, ve)));
  }
  const A = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return r("section", {
    ref: L,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    r("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      r("button", {
        key: "title",
        type: "button",
        onClick: (I) => {
          (I.metaKey || I.ctrlKey) && (I.preventDefault(), x == null || x());
        },
        onKeyDown: (I) => {
          I.key !== "Enter" && I.key !== " " || (I.preventDefault(), x == null || x());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      r("button", { key: "out", type: "button", className: A, disabled: u <= 1, onClick: () => m(Hr(u - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      r("button", { key: "fit", type: "button", className: A, disabled: u === 1, onClick: () => m(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(u * 100)}%`),
      r("button", { key: "in", type: "button", className: A, disabled: u >= 8, onClick: () => m(Hr(u + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      r("button", { key: "center", type: "button", className: A, onClick: Se, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    r("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(ve),
      "aria-valuenow": Math.round(de),
      "aria-valuetext": `${Math.round(de)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (I) => {
        I.currentTarget.setPointerCapture(I.pointerId), w(I);
      },
      onPointerMove: (I) => {
        I.currentTarget.hasPointerCapture(I.pointerId) && w(I);
      },
      onKeyDown: F,
      onDoubleClick: () => P(Ot.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${de - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, r("span", { className: "h-16 w-1 rounded-full bg-border" })),
    r("div", {
      key: "scroll",
      ref: $,
      onScroll: (I) => B({
        scrollTop: I.currentTarget.scrollTop,
        height: I.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, r("div", { style: $l(u) }, [
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
          onClick: we,
          onKeyDown: le
        }, fe.map((I, b) => r("span", {
          key: I,
          className: `absolute top-0 ${wl(b, fe.length, ae > 0 ? I / ae * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Nl(b, fe.length, ae > 0 ? I / ae * 100 : 0)
        }, Ge(I))).concat(t.map((I) => {
          const b = ae > 0 ? I.startSec / ae * 100 : 0;
          return r("button", {
            key: `shot-boundary:${I.startSec}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Ge(I.startSec)} – ${Ge(I.endSec)}`,
            title: `Shot boundary · ${I.source || "manual"} · ${Ge(I.startSec)} – ${Ge(I.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${b}%`, width: "2px" },
            onClick: (G) => {
              G.stopPropagation(), p(I.startSec);
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
            ...$i(be),
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
        style: q.length > 0 ? { height: Z.height } : void 0
      }, [
        q.length > 0 ? r("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...$i(be, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        q.length === 0 ? r("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : ie.map((I) => {
          var te;
          const b = I.group, G = i.includes(b.key), O = a === b.key, X = Xr(O, b.color);
          if (I.kind === "group") return r("div", {
            key: I.key,
            "data-segment-group": b.key,
            "data-segment-group-collapsed": G ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${De}rem minmax(0,1fr)`,
              backgroundColor: X,
              top: I.top,
              height: I.height
            }
          }, [
            r("button", {
              key: "name",
              type: "button",
              onClick: (v) => {
                if (v.metaKey || v.ctrlKey) {
                  y(b.lanes.flatMap((R) => R.markers.map((ne) => ne.segment.id)));
                  return;
                }
                f(b.key), h(b.key);
              },
              "aria-expanded": !G,
              "aria-current": O ? "true" : void 0,
              "data-selected-timeline-group": O ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: ec(b),
                backgroundColor: X,
                // Headers are tinted by their own group colors, so selection needs the accent to stand out.
                // An outline leaves the box-shadow hover and focus rings free.
                ...O ? { outline: "1px solid var(--color-accent)", outlineOffset: "-1px" } : {}
              },
              title: `${G ? "Expand" : "Collapse"} ${b.name}`
            }, [
              r("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, G ? "▶" : "▼"),
              r("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, b.name)
            ]),
            r(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              G ? [
                r(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${b.lanes.length} swimlane${b.lanes.length === 1 ? "" : "s"} hidden`
                ),
                Q ? r(ln, { key: "states", counts: b.counts }) : null
              ] : null
            )
          ]);
          const C = I.lane, ce = Zd(I.laneIndex), Ne = C.markers.some(({ segment: v }) => v.id === s);
          return r("div", {
            key: I.key,
            "data-grouped-swimlane": b.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${De}rem minmax(0,1fr)`,
              top: I.top,
              height: I.height,
              backgroundColor: ce
            }
          }, [
            r("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": Ne ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: tc(Ne, ce, b.color),
              title: `${pr(C)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": pr(C),
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
                  v.stopPropagation(), N({ tagId: C.tagId, tagName: C.label, trigger: v.currentTarget });
                },
                "aria-label": `Configure ${C.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: U === C.key ? 1 : void 0 }
              }, "⚙") : null,
              r("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, C.label),
              (te = C.performers) != null && te.length ? r(eo, {
                key: "performers",
                performers: C.performers,
                performerAssignments: C.performerAssignments
              }) : null,
              Q ? r(ln, { key: "counts", counts: C.counts }) : null
            ]),
            r("div", { key: "track", className: "relative" }, C.markers.map(({ segment: v, track: R }) => {
              var gt;
              const ne = vo(v.startSec, ae), se = v.endSec == null ? v.startSec : Math.max(v.startSec, v.endSec), J = Math.max(0, vo(se, ae) - ne), Fe = l.includes(v.id), Re = v.id === s, $e = zo(Y.get(v.id)), Pe = v.endSec == null ? Ge(v.startSec) : `${Ge(v.startSec)} – ${Ge(v.endSec)}`, ze = (gt = Wa[$e]) == null ? void 0 : gt.label;
              return r("button", {
                key: v.id,
                type: "button",
                onClick: (Be) => {
                  Be.stopPropagation(), g(v, {
                    additive: Be.metaKey || Be.ctrlKey,
                    rangeSegmentIds: Be.shiftKey ? C.markers.map((pt) => pt.segment.id) : null
                  });
                },
                "aria-pressed": Fe,
                "aria-current": Re ? "true" : void 0,
                "data-selected-timeline-marker": Re ? "true" : void 0,
                "data-selected-segment-shortcut-target": Re ? "true" : void 0,
                "aria-label": Q ? `${v.tagName || "Tag segment"}${C.performerLabel ? `, ${C.performerLabel}` : ""}, ${v.reviewState}${ze ? `, ${ze}` : ""}, ${Pe}` : `${v.tagName || "Tag segment"}${C.performerLabel ? `, ${C.performerLabel}` : ""}, ${Pe}`,
                title: Q ? `${v.tagName || "Tag segment"}${C.performerLabel ? ` · ${C.performerLabel}` : ""} · ${v.reviewState}${ze ? ` · ${ze}` : ""} · ${Pe}` : `${v.tagName || "Tag segment"}${C.performerLabel ? ` · ${C.performerLabel}` : ""} · ${Pe}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...Q ? Yd(v.reviewState, Fe, $e, Re) : Qd(Fe, Re),
                  left: `${ne}%`,
                  top: `${nc(R)}rem`,
                  width: Xd(v.endSec, J),
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
  const [a, s] = K(null), [l, d] = K([]), [c, u] = K(null), [m, f] = K(""), [h, g] = K(!0), [y, x] = K(null), [N, p] = K(""), [E, Q] = K(!1), [V, P] = K(!1), L = pe(null), $ = pe(0);
  he(() => {
    const q = requestAnimationFrame(() => {
      var Y;
      return (Y = L.current) == null ? void 0 : Y.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(q);
  }, [e]), he(() => {
    const q = new AbortController();
    return g(!0), p(""), Promise.all([
      n ? re(`/slot-definitions/${e}`, { signal: q.signal }) : Promise.resolve(null),
      re("/segment-groups", { signal: q.signal })
    ]).then(([Y, j]) => {
      const Z = j.find((ie) => (ie.tags || []).some((ae) => Number(ae.tagId) === Number(e)));
      s(Y), d(j), u((Z == null ? void 0 : Z.id) ?? null), f(Z == null ? "" : String(Z.id)), Q(!1), P(!1);
    }).catch((Y) => {
      Y.name !== "AbortError" && p(Y.message || "Unable to load tag configuration.");
    }).finally(() => {
      q.signal.aborted || g(!1);
    }), () => q.abort();
  }, [n, e]);
  function S(q, Y) {
    s({
      ...a,
      definitions: a.definitions.map((j, Z) => Z === q ? { ...j, ...Y } : j)
    });
  }
  function k(q, Y) {
    const j = q + Y;
    if (j < 0 || j >= a.definitions.length) return;
    const Z = [...a.definitions];
    [Z[q], Z[j]] = [Z[j], Z[q]], s({
      ...a,
      definitions: Z.map((ie, ae) => ({ ...ie, sortOrder: ae }))
    });
  }
  function D(q) {
    const Y = a.definitions[q], j = Number(Y.assignmentCount) || 0, Z = j === 0 ? "" : ` and its ${j} assignment${j === 1 ? "" : "s"}`, ie = Y.derivationRules || [], ae = ie.length === 0 ? "" : `

Its performer slot mapping will also be removed from ${ie.length === 1 ? "this derivation rule" : `these ${ie.length} derivation rules`}:
${ie.map((ve) => `• ${ve}`).join(`
`)}`;
    window.confirm(`Delete “${Lt(Y)}”${Z}?${ae}`) && (j > 0 && Q(!0), ie.length > 0 && P(!0), s({
      ...a,
      definitions: a.definitions.filter((ve, de) => de !== q).map((ve, de) => ({ ...ve, sortOrder: de }))
    }));
  }
  async function B() {
    var Y;
    x("slots"), p("Saving performer slots…");
    let q;
    try {
      q = await re(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: E,
          confirmRemoveDerivationRuleMappings: V,
          definitions: a.definitions.map((j, Z) => {
            var ie;
            return {
              id: j.id || void 0,
              label: ((ie = j.label) == null ? void 0 : ie.trim()) || null,
              sortOrder: Z,
              genderHints: j.genderHints || []
            };
          })
        })
      }), s(q), Q(!1), P(!1);
    } catch (j) {
      j.status === 409 ? (p("Performer slots changed elsewhere; current values were reloaded."), (Y = j.payload) != null && Y.current && (s(j.payload.current), Q(!1), P(!1))) : p(j.message || "Unable to save performer slots."), x(null);
      return;
    }
    try {
      await o(), p("Performer slots saved.");
    } catch {
      p("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      x(null);
    }
  }
  async function U() {
    const q = m === "" ? null : Number(m);
    if (q !== c) {
      x("group"), p("Saving tag group…");
      try {
        await re(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: q })
        });
      } catch (Y) {
        p(Y.message || "Unable to assign the tag group."), x(null);
        return;
      }
      try {
        const [Y, j] = await Promise.allSettled([
          re("/segment-groups"),
          o()
        ]);
        if (Y.status === "fulfilled") {
          d(Y.value);
          const Z = Y.value.find((ae) => (ae.tags || []).some((ve) => Number(ve.tagId) === Number(e))), ie = (Z == null ? void 0 : Z.id) ?? null;
          u(ie), f(ie == null ? "" : String(ie));
        }
        p(
          Y.status === "fulfilled" && j.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        x(null);
      }
    }
  }
  l.find((q) => Number(q.id) === Number(c));
  const T = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (q) => {
      q.target === q.currentTarget && !y && i();
    },
    onKeyDownCapture: (q) => Pt(q, {
      onCancel: y ? void 0 : i
    })
  }, r("section", {
    ref: L,
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
            value: m,
            disabled: y != null,
            onChange: (q) => f(q.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            r("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((q) => r("option", { key: q.id, value: String(q.id) }, q.name))
          ])
        ]),
        h ? null : r("button", {
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
        h ? r("p", { key: "loading", className: "rounded-md border border-dashed border-border p-4 text-sm text-secondary" }, "Loading performer slots…") : a ? r("div", { key: "editor", className: "space-y-3" }, [
          r("label", { key: "duplicates", className: "flex items-center gap-2 text-sm" }, [
            r("input", {
              key: "input",
              type: "checkbox",
              checked: !!a.allowSamePerformerInMultipleSlots,
              disabled: y != null,
              onChange: (q) => s({ ...a, allowSamePerformerInMultipleSlots: q.target.checked })
            }),
            r("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((q, Y) => r("article", {
            key: q.id || q._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            r("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              r("span", { key: "label" }, "Slot label"),
              r("input", {
                key: "input",
                value: q.label || "",
                disabled: y != null,
                onChange: (j) => S(Y, { label: j.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            r("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              r("legend", { key: "label" }, "Gender hints"),
              r("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, bl.map((j) => r("label", { key: j, className: "inline-flex items-center gap-1" }, [
                r("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: y != null,
                  checked: (q.genderHints || []).includes(j),
                  onChange: (Z) => S(Y, {
                    genderHints: Z.target.checked ? [.../* @__PURE__ */ new Set([...q.genderHints || [], j])] : (q.genderHints || []).filter((ie) => ie !== j)
                  })
                }),
                r("span", { key: "text" }, Zr(j))
              ])))
            ]),
            r("div", { key: "actions", className: "flex items-end gap-1" }, [
              r("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${q.assignmentCount || 0} assigned`),
              r("button", { key: "up", type: "button", disabled: y != null || Y === 0, onClick: () => k(Y, -1), className: T, "aria-label": `Move ${Lt(q)} up` }, "↑"),
              r("button", { key: "down", type: "button", disabled: y != null || Y === a.definitions.length - 1, onClick: () => k(Y, 1), className: T, "aria-label": `Move ${Lt(q)} down` }, "↓"),
              r("button", { key: "delete", type: "button", disabled: y != null, onClick: () => D(Y), className: `${T} text-red-300` }, "Delete")
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
              onClick: B,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, y === "slots" ? "Saving…" : "Save performer slots")
          ])
        ]) : null
      ]) : null,
      N ? r("p", { key: "message", role: "status", className: "text-sm text-secondary" }, N) : null
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
function Ou(e, t, n) {
  if (!(e != null && e.disabled) || !n) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${n}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function Pu(e) {
  const { acquireSaveLock: t, activeFilterCount: n, allSwimlanes: o, approvalFacetCounts: i, autoAssignCandidates: a, autoAssignError: s, autoAssignOpen: l, autoAssignPerformers: d, autoAssigning: c, cancelQueuedReviewsForSegments: u, canMoveSelectionToBin: m, captureTrainingExport: f, centerTimelineRef: h, closeEditorFilters: g, closeFirstSegmentTagDialog: y, closeMaterializeDialog: x, closeMergeConfirmation: N, closePublishApprovedDialog: p, closeTagEditing: E, collapsedSegmentGroups: Q, commonActionsRef: V, compatibilityMode: P, configuringTag: L, createSegment: $, creatingSegmentId: S, currentTime: k, deleteRejectedSegments: D, detail: B, detailPanelRef: U, detailWidth: T, duplicateSegment: q, editorFilters: Y, editorLayout: j, editorRef: Z, exportingExamples: ie, filtersButtonRef: ae, filtersOpen: ve, firstSegmentTagOpen: de, focusRowRef: De, handleSeparatorKeyDown: be, handleSeparatorPointerDown: _, handleSeparatorPointerMove: ue, hasNextUnreviewed: fe, hasPreviousUnreviewed: ke, hideDerivedSegments: Se, history: H, historyOpen: we, historySaving: le, horizontalLayoutSize: w, importNativeSegments: F, incorrectExamples: A, incorrectExamplesOpen: I, lineage: b, markerRailWidth: G, materializeButtonRef: O, materializeCancelButtonRef: X, materializeDerivedSegments: C, materializeError: ce, materializeLoading: Ne, materializeOpen: te, materializePreview: v, materializing: R, mediaStackRef: ne, mergeCancelButtonRef: se, mergeConfirmation: J, mergeSaving: Fe, mergeSelectedSwimlane: Re, nativeImportState: $e, onDetailChange: Pe, onNavigate: ze, onReload: gt, onSlotsChanged: Be, openPublishApprovedDialog: pt, panelSeparatorProps: ot, pendingInitialSeekRef: Le, performerSlots: rt, performerSlotsAvailable: xt, playbackControlsRef: lt, previewDerivedSegments: ht, provenance: Xe, provenanceSources: it, publishApprovedCancelButtonRef: z, publishApprovedDrafts: ee, publishApprovedError: me, publishApprovedOpen: ye, quickSearchOpen: ge, railScrollRef: Oe, railToggleRef: Me, recordHistoryAction: Qe, rejectedDeletionPreview: je, removeIncorrectExample: tt, removingExampleId: We, restoreHistoryTarget: Ae, runEditorAction: Te, saveMessage: Ze, saveTag: Ke, saveTiming: Ue, savingSegmentId: Ie, editorHeldByOtherWork: Bt, segmentCreationPending: He, selectionBusy: vt, seekRef: Dt, segmentGroups: nt, segmentRailLayout: Ee, segments: Ce, selectAllVideoSegments: dt, selectSegment: kt, selectSegmentCollection: bt, selectedGroups: qt, selectedPerformerSlots: St, selectedSegment: Ct, selectedSegmentGroupKey: en, selectedSegmentIds: cn, selectedSegments: tn, selectedSlotStatus: _n, setAutoAssignError: zn, setAutoAssignOpen: vr, setConfiguringTag: Sr, setCurrentTime: Hn, setEditorFilters: xr, setEditorLayout: qn, setFiltersOpen: un, setHideDerivedSegments: kn, setHistoryOpen: wn, setIncorrectExamplesOpen: kr, setQuickSearchOpen: Wn, setRailViewport: ro, setRejectedDeletionPreview: Vn, setSaveMessage: Jn, setSelectedSegmentGroupKey: Yn, setSelectedSegmentId: Nn, setShortcutsOpen: wr, setTimelineZoom: Nr, shotBoundaries: Qn, shortcutsOpen: mn, slotButtonRef: Xn, splitLayout: Ut, splitSegment: $t, stepVideoFrame: Zn, tagEditing: er, tagSearchRef: Ir, timelineDuration: Cr, timelineRatioBounds: In, timelineZoom: tr, toggleSegmentGroup: $r, toggleSegmentRail: oo, updateTimelineRatio: nr, video: at, videoPerformers: Cn, visibleCounts: st, visibleSegmentRailRows: wt, visibleSegments: Tr, wideLayout: gn, workspaceRef: Wt } = e;
  Kd(at ? at.title || `Video ${at.id}` : null);
  const Tt = qe(
    () => Ce.filter((W) => Qr(W)),
    [Ce]
  ), Rr = cl(Oo), pn = Tt.length, $n = pe(null), rr = qe(() => () => wn(!1), [wn]), Tn = v ? v.createCount + v.linkCount : null, fn = tn.length > 0, Rn = tn.length === 1, io = fn && tn.every((W) => W.reviewState === "approved"), ao = fn && tn.every((W) => W.reviewState === "rejected"), nn = [
    // Segment edits queue behind saves of other segments; only saves of the selection, or work that
    // holds the whole editor, disable them.
    // A create already waiting would be repeated by a second press, so it waits for that one.
    { id: "marker.create", label: "New segment", disabled: Bt || He },
    // Retagging several segments at once holds the whole editor, so it waits for every save.
    { id: "marker.editTag", label: "Edit tag", disabled: vt || !fn || tn.length > 1 && Ie != null },
    { id: "marker.setStart", label: "Set start", disabled: vt || !Rn },
    { id: "marker.setEnd", label: "Set end", disabled: vt || !Rn },
    { id: "marker.split", label: "Split", disabled: vt || !Rn },
    ...P ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !ke, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: io ? "Unapprove" : "Approve", disabled: vt || !fn, tone: "approve" },
      { id: "marker.reject", label: ao ? "Unreject" : "Reject", disabled: vt || !fn, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !fe, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...P ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: Ie != null || !m, tone: "reject" }
    ]
  ];
  function Yt(W) {
    const Ve = cn.includes(W.id), jt = W.id === (Ct == null ? void 0 : Ct.id), ct = W.endSec == null ? Ge(W.startSec) : `${Ge(W.startSec)} – ${Ge(W.endSec)}`, Rt = `${Ht(W.sourceKey)}${W.confidence != null ? ` · ${Math.round(W.confidence * 100)}%` : ""}`;
    return r("button", {
      key: W.id,
      type: "button",
      onClick: (Et) => kt(W, { additive: Et.metaKey || Et.ctrlKey }),
      "aria-pressed": Ve,
      "aria-current": jt ? "true" : void 0,
      "data-selected-segment-shortcut-target": jt ? "true" : void 0,
      "aria-label": P ? `${W.tagName || "Tag segment"}, ${W.reviewState}${W.isDerived ? ", derived segment" : ""}, ${ct}` : `${W.tagName || "Tag segment"}${W.isDerived ? ", derived segment" : ""}, ${ct}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: qa(Ve, jt)
    }, [
      r("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        P ? r(xn, { key: "review", state: W.reviewState, includeLabel: !1 }) : null,
        W.isDerived ? r(no, { key: "derived" }) : null,
        r(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          W.tagName || "Tag segment"
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
  const En = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", Mn = [...H.actions || []].reverse().find((W) => W.sequence <= H.cursorSequence);
  return r("section", {
    ref: Z,
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
            onClick: (W) => ds(W, ze, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          r("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, r("a", {
            href: `/video/${at.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: at.title || `Video ${at.id}`
          }, at.title || `Video ${at.id}`)),
          ...Cn.map((W) => r(fr, {
            key: yt(W),
            performer: { id: yt(W), name: W.name },
            compact: !0,
            tooltip: W.name
          })),
          P ? r(ln, { key: "review-counts", counts: st }) : null
        ]),
        r("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          P ? null : r(ms, { key: "bin", onNavigate: ze, compact: !0 }),
          r(gs, { key: "settings", onNavigate: ze, compact: !0 })
        ])
      ]),
      P && B.nativeImportCount > 0 ? r("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        r(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${B.nativeImportCount} Cove segment${B.nativeImportCount === 1 ? "" : "s"} ${B.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        $e.busy ? r("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, $e.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          r("button", {
            key: "review",
            type: "button",
            onClick: () => F("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          r("button", {
            key: "approved",
            type: "button",
            onClick: () => F("approved"),
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
          at != null && at.id ? r(Fd, {
            key: "extension-actions",
            entityType: "video",
            entityId: at.id,
            pageType: yl,
            renderMode: "toolbar"
          }) : null,
          P ? r("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: Ie != null || a.length === 0,
            onClick: () => {
              zn(""), vr(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${a.length ? ` (${a.length})` : ""}`) : null,
          P ? r("button", {
            key: "materialize-derived",
            ref: O,
            type: "button",
            disabled: Ie != null || Ne || R || Tn === 0,
            onClick: ht,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, Ne ? "Analyzing…" : `Auto-Materialize${Tn != null ? ` (${Tn})` : ""}`) : null,
          P ? r("button", {
            key: "complete-review",
            type: "button",
            disabled: Ie != null || pn === 0,
            onClick: (W) => pt(W.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": ye,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${pn ? ` (${pn})` : ""}`) : null,
          r("button", {
            key: "feedback",
            type: "button",
            disabled: ie || We != null || A.length === 0,
            onClick: () => kr(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": I,
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
            r(Fr, { key: "icon", name: "filter" }),
            r("span", { key: "label" }, `Filter${n ? ` (${n})` : ""}`)
          ]),
          r("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => wr(!0),
            className: En
          }, [r(Fr, { key: "icon", name: "keyboard" }), r("span", { key: "label" }, "Shortcuts")]),
          r("button", {
            key: "history",
            ref: $n,
            type: "button",
            disabled: (P ? H.actions.length === 0 : Mn == null) || Ie != null || le,
            onClick: P ? () => wn((W) => !W) : () => Ae(
              Mn.sequence - 1
            ),
            "aria-controls": P ? ps : void 0,
            "aria-expanded": P ? we : void 0,
            className: En
          }, [
            r(Fr, { key: "icon", name: "history" }),
            r("span", { key: "label" }, P ? `History${H.actions.length ? ` (${H.actions.length})` : ""}` : Mn ? `Undo ${Mn.label}` : "Undo")
          ]),
          r("button", {
            key: "rail",
            ref: Me,
            type: "button",
            onClick: oo,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": j.markerRailOpen,
            className: En
          }, [
            r(Fr, { key: "icon", name: "list" }),
            r("span", { key: "label" }, j.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ]),
      P && we ? r(xu, {
        key: "history-popover",
        history: H,
        historySaving: le,
        anchorRef: $n,
        onRestore: Ae,
        onClose: rr
      }) : null
    ]),
    ve ? r(Su, {
      key: "editor-filters",
      filters: Y,
      hideDerivedSegments: Se,
      performers: Cn,
      provenanceSources: it,
      reviewCounts: i,
      segments: Ce,
      segmentGroups: nt,
      reviewMode: P,
      onChange: xr,
      onHideDerivedChange: kn,
      onClose: g
    }) : null,
    de ? r(vu, {
      key: "first-segment-tag-dialog",
      saving: Ie != null,
      error: Ze,
      onSelect: (W, Ve) => $(W, Ve),
      onClose: y
    }) : null,
    ge ? r(Nu, {
      key: "quick-search-dialog",
      segments: Pd(o),
      onSelect: (W) => {
        Wn(!1), kt(W, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        Wn(!1), requestAnimationFrame(() => {
          var W;
          return (W = Z.current) == null ? void 0 : W.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    l ? r($u, {
      key: "auto-assign-dialog",
      candidates: a,
      processing: c,
      error: s,
      onConfirm: d,
      onClose: () => vr(!1)
    }) : null,
    J ? r(Ru, {
      key: "merge-selection-dialog",
      merge: J,
      processing: Fe,
      undoable: !P,
      cancelButtonRef: se,
      onConfirm: (W) => Re(!0, W, J),
      onClose: N
    }) : null,
    te ? r(Mu, {
      key: "materialize-derived-dialog",
      preview: v,
      loading: Ne,
      processing: R,
      error: ce,
      cancelButtonRef: X,
      onConfirm: C,
      onClose: () => {
        R || x();
      }
    }) : null,
    r("div", {
      key: "workspace",
      ref: Wt,
      className: `${Ut ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      j.markerRailOpen ? r("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: gn ? { position: "absolute", top: 0, right: 0, width: G, height: w.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        Ce.length === 0 ? r("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : Tr.length === 0 ? r(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : r("div", {
          key: "segments",
          ref: Oe,
          onScroll: (W) => ro({
            scrollTop: W.currentTarget.scrollTop,
            height: W.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, r("div", {
          className: "relative",
          style: { height: Ee.height }
        }, wt.map((W) => {
          var jt;
          let Ve;
          if (W.kind === "group") {
            const ct = Q.includes(W.group.key), Rt = W.group.lanes.reduce((Et, et) => Et + et.markers.length, 0);
            Ve = r("button", {
              type: "button",
              onClick: () => {
                Yn(W.group.key), $r(W.group.key);
              },
              "aria-expanded": !ct,
              "aria-current": en === W.group.key ? "true" : void 0,
              "data-segment-rail-group": W.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${en === W.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              r("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, ct ? "▸" : "▾"),
              r("span", { key: "name", className: "min-w-0 flex-1 truncate", title: W.group.name }, W.group.name),
              r("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Rt),
              P && ct ? r(ln, { key: "states", counts: W.group.counts }) : null
            ]);
          } else W.kind === "lane" ? Ve = r("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: pr(W.lane),
            "aria-label": pr(W.lane)
          }, [
            r("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, W.lane.label),
            (jt = W.lane.performers) != null && jt.length ? r(eo, {
              key: "performers",
              performers: W.lane.performers,
              performerAssignments: W.lane.performerAssignments
            }) : null,
            P ? r(ln, { key: "states", counts: W.lane.counts }) : null
          ]) : Ve = Yt(W.segment);
          return r("div", {
            key: W.key,
            className: "absolute left-0 right-0",
            style: { top: W.top, height: W.height }
          }, Ve);
        })))
      ]) : null,
      r("div", { key: "review-pane", className: `${Ut ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        r("div", {
          key: "media-stack",
          ref: ne,
          className: `${Ut ? "min-h-0 flex-1" : ""} grid`,
          style: Ut ? {
            gridTemplateRows: `minmax(16rem, ${(1 - j.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${j.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          r("div", {
            key: "focus-row",
            ref: De,
            className: "grid min-h-0 gap-2",
            style: gn ? {
              gridTemplateColumns: j.markerRailOpen ? `${T}px 0.5rem minmax(0,1fr) 0.5rem ${G}px` : `${T}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            r(Au, {
              key: "tools",
              compatibilityMode: P,
              selectedSegment: Ct,
              selectedSegments: tn,
              selectedGroups: qt,
              saveMessage: Ze,
              savingSegmentId: Ie,
              selectionBusy: vt,
              creatingSegmentId: S,
              acquireSaveLock: t,
              setSaveMessage: Jn,
              saveTag: Ke,
              slotStatus: _n,
              performerSlotsAvailable: xt,
              selectedPerformerSlots: St,
              performerSlots: rt,
              detail: B,
              onDetailChange: Pe,
              onCancelQueuedReview: u,
              video: at,
              slotButtonRef: Xn,
              tagSearchRef: Ir,
              tagEditing: er,
              onCancelTagEditing: E,
              detailPanelRef: U,
              onReduceSelection: (W) => {
                kt(W), requestAnimationFrame(() => {
                  var Ve;
                  return (Ve = U.current) == null ? void 0 : Ve.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Ue,
              onSlotsChanged: Be,
              onRecordHistory: Qe,
              splitSegment: $t,
              duplicateSegment: q,
              provenance: Xe,
              lineage: b,
              onNavigateLineageItem: (W) => {
                const Ve = Ce.find((jt) => jt.itemId === W);
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
                onSeekRegister: (W) => {
                  Dt.current = W, Md(Le.current, Ce, W) && (Le.current = null);
                },
                onPlaybackControlRegister: (W) => {
                  lt.current = W;
                },
                onTimeUpdate: Hn
              }))
            ) : r("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            gn && j.markerRailOpen ? r(
              "div",
              { key: "rail-separator", ...ot("markerRailWidth", "Resize segment rail") },
              r("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            gn && j.markerRailOpen ? r("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          r("div", {
            key: "common-actions",
            ref: V,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...nn.map((W) => {
              var ct;
              const Ve = (ct = Rr[W.id]) == null ? void 0 : ct[0], jt = W.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : W.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return r("button", {
                key: W.id,
                type: "button",
                disabled: W.disabled,
                "data-action-id": W.id,
                onClick: (Rt) => {
                  const Et = Rt.currentTarget;
                  Te(W.id, { target: Et, preserveFocus: !0 }), W.focusWhenDisabled && requestAnimationFrame(() => {
                    Ou(Et, V.current, W.focusWhenDisabled);
                  });
                },
                title: Ve ? `${W.label} (${Ve})` : W.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${jt}`
              }, [
                r("span", { key: "label" }, W.label),
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
              }, r(gl, { className: "h-4 w-4", "aria-hidden": !0 })),
              r("button", {
                key: "next-frame",
                type: "button",
                disabled: !at.videoFile,
                onClick: () => Zn(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, r(pl, { className: "h-4 w-4", "aria-hidden": !0 }))
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
            "aria-valuenow": Math.round(j.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(j.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: _,
            onPointerMove: ue,
            onKeyDown: be,
            onDoubleClick: () => nr(Ot.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, r("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          r("div", { key: "timeline", className: "min-h-0", style: Ut ? void 0 : { height: "20rem" } }, r(Du, {
            segments: Tr,
            shotBoundaries: Qn,
            segmentGroups: nt,
            performerSlots: rt,
            collapsedGroupKeys: Q,
            selectedGroupKey: en,
            selectedSegmentId: Ct == null ? void 0 : Ct.id,
            selectedSegmentIds: cn,
            duration: Cr,
            currentTime: k,
            zoom: tr,
            onZoomChange: Nr,
            onSelectGroup: Yn,
            onToggleGroup: $r,
            onSelect: (W, Ve) => kt(W, Ve),
            onSelectSegments: bt,
            onSelectAll: dt,
            onConfigureTag: (W) => Sr(W),
            onSeekTime: (W) => {
              var Ve;
              return (Ve = Dt.current) == null ? void 0 : Ve.call(Dt, W, !1);
            },
            centerRef: h,
            showReviewState: P,
            swimlaneTitleWidth: j.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (W) => qn((Ve) => ({ ...Ve, swimlaneTitleWidth: W }))
          }))
        ])
      ])
    ]),
    L ? r(Jo, {
      key: `configure-tag:${L.tagId}`,
      tagId: L.tagId,
      tagName: L.tagName,
      performerSlotsEnabled: P,
      onSaved: gt,
      onClose: () => {
        const W = L.trigger;
        Sr(null), requestAnimationFrame(() => {
          var Ve;
          W != null && W.isConnected ? W.focus({ preventScroll: !0 }) : (Ve = Z.current) == null || Ve.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    ye ? r(Cu, {
      key: "publish-approved-dialog",
      drafts: Tt,
      processing: Ie === -1,
      error: me,
      cancelButtonRef: z,
      onConfirm: ee,
      onClose: p
    }) : null,
    je ? r(Tu, {
      key: "rejected-deletion-dialog",
      preview: je,
      onConfirm: () => {
        D(je), requestAnimationFrame(() => {
          var W;
          return (W = Z.current) == null ? void 0 : W.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Vn(null), requestAnimationFrame(() => {
          var W;
          return (W = Z.current) == null ? void 0 : W.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    mn ? r(ku, {
      key: "shortcuts-dialog",
      reviewMode: P,
      bindings: Rr,
      onClose: () => wr(!1)
    }) : null,
    I ? r(wu, {
      key: "incorrect-examples-dialog",
      examples: A,
      exporting: ie,
      removingExampleId: We,
      onExport: f,
      onRemove: tt,
      onClose: () => kr(!1)
    }) : null
  ]);
}
function Lu(e) {
  const { allSwimlanes: t, editorRef: n, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: u, setCollapsedSegmentGroups: m, setEditorFilters: f, setHideDerivedSegments: h, setSaveMessage: g, setSelectedSegmentGroupKey: y, setSelectedSegmentId: x, setSelectedSegmentIds: N } = e;
  function p(L) {
    const $ = _t(t, L);
    $ && m((S) => es(S, $));
  }
  function E(L) {
    x(L), N(L == null ? [] : [L]), c.current = L, u.current = [];
  }
  function Q(L, {
    focusEditor: $ = !1,
    seekToSegment: S = !1,
    additive: k = !1,
    rangeSegmentIds: D = null
  } = {}) {
    var U, T;
    const B = _l({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: u.current
    }, L.id, D, k);
    N(B.selectedSegmentIds), x(B.activeSegmentId), c.current = B.anchorSegmentId, u.current = B.rangeBaseSegmentIds, B.activeSegmentId != null && y(_t(t, B.activeSegmentId)), p(L.id), $ && ((U = n.current) == null || U.focus({ preventScroll: !0 })), S && ((T = i.current) == null || T.call(i, L.startSec, !1));
  }
  function V(L) {
    const $ = Ul(
      d,
      l,
      L
    );
    N($.selectedSegmentIds), x($.activeSegmentId), c.current = $.activeSegmentId, u.current = [], $.activeSegmentId != null && (y(_t(t, $.activeSegmentId)), p($.activeSegmentId));
  }
  function P() {
    var S;
    const L = Hl(s), $ = L.includes(l) ? l : L[0] ?? null;
    f(Gt({})), h(!1), N(L), x($), c.current = $, u.current = [], $ != null && y(_t(
      vn(s, a, o),
      $
    )), g(L.length === 0 ? "There are no segments to select." : `${L.length} segments selected. Collapsed Segment groups keep their selected segments.`), (S = n.current) == null || S.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: p, replaceSegmentSelection: E, selectSegment: Q, selectSegmentCollection: V, selectAllVideoSegments: P };
}
function ju(e) {
  const { acceptHistory: t, acquireSaveLock: n, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, pendingChanges: c, stableSaveIdentity: u, historyRef: m, onConflict: f, onDetailChange: h, onReload: g, recordHistoryAction: y, revealSegmentGroupForSelection: x, savingSegmentId: N, selectedGroups: p, selectedSegment: E, selectedSegmentIdRef: Q, selectedSegments: V, selectionAnchorIdRef: P, selectionRangeBaseIdsRef: L, setMergeConfirmation: $, setSaveMessage: S, setSelectedSegmentId: k, setSelectedSegmentIds: D, video: B } = e;
  function U() {
    $(null), requestAnimationFrame(() => {
      var j;
      return (j = a.current) == null ? void 0 : j.focus({ preventScroll: !0 });
    });
  }
  async function T(j = !1, Z = !1, ie = null) {
    if (N != null) return;
    const ae = ie || Xa(
      p,
      { nativeOnly: !o }
    );
    if (!ae) {
      S("Select at least two segments from one swimlane.");
      return;
    }
    if (!j && va()) {
      $(ae);
      return;
    }
    Z && Sa(!1);
    const ve = ae.endSec == null ? "open end" : Ge(ae.endSec);
    let de = ae.segments[0];
    const De = o ? null : Ft(ae.segments, !1), be = o ? null : crypto.randomUUID(), _ = ae.segments.map((H) => H.id), ue = Dc(i, ae.segments).segments.find((H) => H.id === de.id), fe = {
      startSec: ue.startSec,
      endSec: ue.endSec,
      sourceKey: ue.sourceKey,
      sourceRunId: ue.sourceRunId,
      confidence: ue.confidence,
      isDerived: ue.isDerived
    }, ke = n("merge", ae.segments[0].id);
    if (!ke) return;
    U();
    const Se = Mt();
    s({
      type: "add",
      entry: { id: Se, op: "merge", targets: ae.segments.map(ft), values: fe }
    }), D([de.id]), k(de.id), P.current = de.id, L.current = [];
    try {
      const H = ae.segments.slice(1);
      if (!o || de.nativeSegmentId != null) {
        const we = H.map((w) => {
          const F = `merge-native-selection:${B.id}:${de.id}:${w.id}:${de.updatedAt}:${w.updatedAt}`;
          return { key: F, operationId: Je(F), segmentId: w.id, expectedUpdatedAt: w.updatedAt };
        }), le = await re(`/videos/${B.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: de.id,
            expectedSurvivorUpdatedAt: de.updatedAt,
            consumedSegments: we.map(({ key: w, ...F }) => F),
            historyReceiptId: be
          })
        });
        de = le.survivor, h((w) => qi(w, le), B.id), s({ type: "confirm", key: Se, applied: !0 }), we.forEach(({ key: w }) => Ye(w));
      } else {
        const we = H.map((w) => {
          const F = `merge-draft-selection:${B.id}:${de.itemId}:${w.itemId}:${de.revision}:${w.revision}`;
          return { key: F, operationId: Je(F), itemId: w.itemId, expectedRevision: w.revision };
        }), le = await re(`/videos/${B.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: de.itemId,
            expectedSurvivorRevision: de.revision,
            consumedDrafts: we.map(({ key: w, ...F }) => F)
          })
        });
        de = le.survivor, h((w) => qi(w, le), B.id), s({ type: "confirm", key: Se, applied: !0 }), we.forEach(({ key: w }) => Ye(w));
      }
      D([de.id]), k(de.id), P.current = de.id, L.current = [], o ? t(Xt) : await y(
        "segments.merge",
        `Merged ${ae.segments.length} segments`,
        De,
        Ft([de], !1),
        be
      ), x(de.id), S(`${ae.segments.length} segments merged into ${Ge(ae.startSec)} – ${ve}.`);
    } catch (H) {
      s({ type: "discard", key: Se }), D(_), k((E == null ? void 0 : E.id) ?? _[0] ?? null), P.current = (E == null ? void 0 : E.id) ?? _[0] ?? null, L.current = [], H.status === 409 ? await f() : S(H.message || "Unable to merge selected segments.");
    } finally {
      ke();
    }
  }
  function q(j, Z = V, ie = E) {
    if (Z.length === 0) return Promise.resolve(null);
    const ae = nd(j, Z, ie), ve = Math.max(0, ae.identities.indexOf(ae.activeIdentity)), de = d(), De = ns(de) != null || de.queued.some((H) => to(H.targets, ae.identities.map(u))), be = Wo(Z, (c || []).filter((H) => H.op !== "insert")), _ = Oi(be, j), ue = be.filter((H) => H.reviewState !== _).map(ft), fe = ue.length > 0 ? Mt() : null;
    fe && s({
      type: "add",
      entry: { id: fe, op: "patch", targets: ue, values: { reviewState: _ } }
    });
    const ke = () => {
      fe && s({ type: "discard", key: fe });
    }, Se = l({
      kind: "review",
      lockId: ae.activeIdentity.id,
      targets: ae.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (H) => (ke(), Y(H, {
        ...ae,
        identities: H.targets,
        activeIdentity: H.targets[ve]
      }))
    });
    return Se ? (De && S(`${j === "approved" ? "Approval" : "Rejection"} queued…`), Se.done.then((H) => (H.status !== "fulfilled" && ke(), H))) : (ke(), S("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function Y({ detail: j, segments: Z, onConflict: ie, onReload: ae }, ve) {
    var le;
    const de = rd(ve, Z);
    if (!de) {
      S("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: De, selectedSegments: be, selectedSegment: _ } = de, ue = Oi(be, De), fe = be.filter((w) => w.reviewState !== ue);
    if (fe.length === 0) return;
    const ke = be.map((w) => ({
      id: w.id,
      itemId: w.itemId,
      nativeSegmentId: w.nativeSegmentId
    })), Se = ke.find((w) => w.id === (_ == null ? void 0 : _.id)) || ke[0], H = (w, F = !1) => {
      if (!(w != null && w.segments) || !F && !wo(Q.current, Se.id))
        return;
      const A = ke.map((b) => mt(w == null ? void 0 : w.segments, b)).filter(Boolean), I = mt(w == null ? void 0 : w.segments, Se) || A[0] || null;
      D(A.map((b) => b.id)), k((I == null ? void 0 : I.id) ?? null), P.current = (I == null ? void 0 : I.id) ?? null, L.current = [];
    };
    S(`Updating ${fe.length} selected segment${fe.length === 1 ? "" : "s"}…`);
    const we = Mt();
    s({
      type: "add",
      entry: { id: we, op: "patch", targets: fe.map(ft), values: { reviewState: ue } }
    });
    try {
      const w = await re(`/videos/${B.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: m.current.revision,
          reviewState: ue,
          segments: be.map((b) => b.published ? {
            nativeSegmentId: b.nativeSegmentId,
            expectedUpdatedAt: b.updatedAt
          } : {
            itemId: b.itemId,
            expectedRevision: b.revision
          })
        })
      }), F = new Map((w.items || []).map((b) => [
        b.requestedNativeSegmentId != null ? `native:${b.requestedNativeSegmentId}` : `item:${b.requestedItemId}`,
        b
      ]));
      if (ke.forEach((b) => {
        const G = F.get(b.nativeSegmentId != null ? `native:${b.nativeSegmentId}` : `item:${b.itemId}`);
        G && (b.nativeSegmentId = G.nativeSegmentId, b.itemId = G.itemId);
      }), w.history && t(w.history), ue === "rejected" && !w.editorDelta || (w.items || []).some((b) => b.requestedNativeSegmentId != null && b.nativeSegmentId !== b.requestedNativeSegmentId)) {
        const b = await ae();
        s({ type: "confirm", key: we, applied: b != null }), H(b), S(`${w.updatedCount} selected segment${w.updatedCount === 1 ? "" : "s"} ${ue === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const I = w.editorDelta ? (b) => sn(b, w.editorDelta) : (b) => ({
        ...b,
        approvedSetVersion: w.approvedSetVersion || b.approvedSetVersion,
        segments: (b.segments || []).map((G) => {
          const O = F.get(G.nativeSegmentId != null ? `native:${G.nativeSegmentId}` : `item:${G.itemId}`);
          return O ? {
            ...G,
            id: O.nativeSegmentId != null ? O.nativeSegmentId : -O.itemId,
            itemId: O.itemId,
            nativeSegmentId: O.nativeSegmentId,
            published: O.nativeSegmentId != null,
            reviewState: ue,
            revision: O.nativeSegmentId != null ? G.revision : O.revision,
            updatedAt: O.updatedAt
          } : G;
        })
      });
      h(I, B.id), s({ type: "confirm", key: we, applied: !0 }), H(I(j)), S(`${w.updatedCount} selected segment${w.updatedCount === 1 ? "" : "s"} ${ue === "approved" ? "approved" : ue === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (w) {
      s({ type: "discard", key: we }), w.status === 409 && ((le = w.payload) != null && le.currentHistory) && t(w.payload.currentHistory);
      const F = w.status === 409 ? await ie() : j;
      H(F, !0), S(w.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: U, mergeSelectedSwimlane: T, saveSelectedReviewState: q };
}
function Fu(e) {
  const { acceptHistory: t, acquireSaveLock: n, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: u, detail: m, displayedSelectedSegment: f, editorFilters: h, editorRef: g, cancelSaveTasks: y, dispatchPendingChanges: x, enqueueSave: N, stableSaveIdentity: p, exportingExamples: E, hideDerivedSegments: Q, incorrectExamples: V, lineage: P, materializeButtonRef: L, materializePreview: $, materializeRestoreFocusRef: S, materializing: k, mutateSegment: D, runSegmentMutation: B, pendingChanges: U, onConflict: T, onDetailChange: q, onReload: Y, performerSlots: j, recordHistoryAction: Z, refreshMaterializationPreview: ie, removingExampleId: ae, revealSegmentGroupForSelection: ve, savingSegmentId: de, segmentGroups: De, segments: be, selectedSegment: _, selectedSegmentIdRef: ue, selectedSegments: fe, selectionAnchorIdRef: ke, selectionRangeBaseIdsRef: Se, setAutoAssignError: H, setAutoAssignOpen: we, setAutoAssigning: le, setEditorFilters: w, setExportingExamples: F, setHideDerivedSegments: A, setIncorrectExamples: I, setMaterializeError: b, setMaterializeLoading: G, setMaterializeOpen: O, setMaterializePreview: X, setMaterializing: C, setRejectedDeletionPreview: ce, setRemovingExampleId: Ne, setSaveMessage: te, setSelectedSegmentGroupKey: v, setSelectedSegmentId: R, setSelectedSegmentIds: ne, swimlanes: se, video: J } = e;
  async function Fe() {
    var Ae, Te, Ze;
    if (fe.length === 0 || !_ || de != null) return;
    const z = $c(fe, V), ee = z.segments;
    if (ee.length === 0) return;
    const me = fe.map((Ke) => ({
      id: Ke.id,
      itemId: Ke.itemId,
      nativeSegmentId: Ke.nativeSegmentId
    })), ye = me.find((Ke) => Ke.id === _.id) || me[0], ge = [], Oe = [];
    let Me = !1, Qe = m, je = !1;
    const tt = [], We = n("feedback", ye.id);
    if (We) {
      te(z.action === "remove" ? `Removing ${ee.length} selected incorrect example${ee.length === 1 ? "" : "s"}…` : `Collecting ${ee.length} selected segment${ee.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const Ke = async (Ee, Ce) => {
          const dt = Ee.nativeSegmentId != null, kt = z.action === "remove" ? `incorrect-example-remove:${J.id}:${Ce == null ? void 0 : Ce.id}:${Ce == null ? void 0 : Ce.revision}:${Ce == null ? void 0 : Ce.representationRevision}` : `incorrect-example-collect:${J.id}:${dt ? `native:${Ee.nativeSegmentId}:${Ee.updatedAt}` : `item:${Ee.itemId}:${Ee.revision}`}`;
          if (z.action === "remove" && !Ce)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let bt;
          try {
            bt = z.action === "remove" ? await re(
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
            ) : await re(`/videos/${J.id}/incorrect-examples/collect`, {
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
          if (!Tc(z.action, bt))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return Ye(kt), bt;
        };
        for (const Ee of ee) {
          const Ce = z.action === "remove" ? V.find((dt) => dt.itemId != null && dt.itemId === Ee.itemId) : null;
          try {
            const dt = me.find((St) => St.id === Ee.id);
            let kt = mt(
              Qe == null ? void 0 : Qe.segments,
              dt
            ) || Ee, bt;
            try {
              bt = await Ke(kt, Ce);
            } catch (St) {
              if (St.status === 409 && ((Te = (Ae = St.payload) == null ? void 0 : Ae.result) == null ? void 0 : Te.code) === "OPERATION_REPLAYED")
                Qe = await re(
                  `/videos/${J.id}/editor`
                ), je = !0, tt.length = 0, Ye(St.operationKey), bt = St.payload.result;
              else {
                if (z.action !== "collect" || St.status !== 409) throw St;
                const Ct = await re(
                  `/videos/${J.id}/editor`
                );
                Qe = Ct, je = !0, tt.length = 0;
                const en = mt(
                  Ct == null ? void 0 : Ct.segments,
                  dt
                );
                if (!en) throw St;
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
          await Z(
            Ee ? "feedback.remove" : "feedback.collect",
            Ee ? `Removed ${Ce} incorrect AI example${Ce === 1 ? "" : "s"}` : `Collected ${Ce} incorrect AI example${Ce === 1 ? "" : "s"}`,
            Pr(ge, Ee),
            Pr(ge, !Ee)
          ) || (Me = !0);
        }
        ge.some(({ result: Ee }) => Ee.representation === "basicNativeBin") && cr();
        const Ue = wo(
          ue.current,
          ye.id
        ), Ie = z.action === "collect" && ge.some(({ segment: Ee }) => Ee.id === ye.id), Bt = ge.map(({ segment: Ee }) => Ee.id), He = Ie ? Ur(
          se,
          Br(o, ye.id),
          { removedIds: Bt }
        ) : null, vt = Ie ? (He == null ? void 0 : He.id) ?? null : ye.id;
        Ue && Ie && (ne(He ? [He.id] : []), R((He == null ? void 0 : He.id) ?? Ln), ke.current = (He == null ? void 0 : He.id) ?? null, Se.current = []);
        const Dt = await re(`/videos/${J.id}/incorrect-examples`);
        I(Dt);
        const nt = Qe;
        if (q(je ? nt : (Ee) => tt.reduce(sn, Ee), J.id), Ue && wo(
          ue.current,
          vt
        )) {
          let Ee, Ce;
          Ie ? (Ce = He ? mt(nt == null ? void 0 : nt.segments, {
            id: He.id,
            itemId: He.itemId,
            nativeSegmentId: He.nativeSegmentId
          }) : null, Ee = Ce ? [Ce] : []) : (Ee = me.map((dt) => mt(nt == null ? void 0 : nt.segments, dt)).filter(Boolean), Ce = mt(nt == null ? void 0 : nt.segments, ye) || Ee[0] || null), ne(Ee.map((dt) => dt.id)), R((Ce == null ? void 0 : Ce.id) ?? (Ie ? Ln : null)), ke.current = (Ce == null ? void 0 : Ce.id) ?? null, Se.current = [], v(Ce ? _t(o, Ce.id) : null), Ce && ve(Ce.id);
        }
        if (Oe.length > 0) {
          const Ee = ((Ze = Oe[0]) == null ? void 0 : Ze.message) || "Only segments with registered AI provenance can be collected.";
          ge.length === 0 ? te(Ee) : z.action === "remove" ? te(
            `Partially removed ${ge.length} of ${ee.length} selected incorrect examples. ${Ee}`
          ) : te(
            `Partially collected ${ge.length} of ${ee.length} selected segments. ${Ee}`
          );
        } else if (z.action === "remove")
          te(
            `${ge.length} incorrect example${ge.length === 1 ? "" : "s"} removed and ${ge.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const Ee = ge.filter(({ result: Ce }) => Ce.representation === "basicNativeBin").length;
          te(Ee === ge.length ? `${ge.length} incorrect AI example${ge.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ge.length} incorrect AI example${ge.length === 1 ? "" : "s"} collected and ${ge.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        Me && te("The change saved, but editor history could not be updated.");
      } catch (Ke) {
        te(Ke.message || "Unable to update the selected incorrect examples.");
      } finally {
        We();
      }
    }
  }
  async function Re(z) {
    if (!z || ae != null || E) return;
    const ee = n("feedback", -1);
    if (!ee) {
      te("Wait for the current save to finish before removing the incorrect example.");
      return;
    }
    try {
      await $e(z);
    } finally {
      ee();
    }
  }
  async function $e(z) {
    var me, ye;
    Ne(z.id);
    const ee = `incorrect-example-remove:${J.id}:${z.id}:${z.revision}:${z.representationRevision}`;
    try {
      let ge, Oe = !1;
      try {
        ge = await re(
          `/videos/${J.id}/incorrect-examples/${z.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Je(ee),
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
      Ye(ee);
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
        Me = await Z(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          Pr(tt, !0),
          Pr(tt, !1)
        );
      }
      const Qe = await re(
        `/videos/${J.id}/incorrect-examples`
      );
      I(Qe), Oe ? await Y() : q(
        (je) => sn(je, ge.editorDelta),
        J.id
      ), z.representation === "basicNativeBin" && cr(), te(Me ? Oe ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : z.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (ge) {
      ge.status === 409 && await T(), te(ge.message || "Unable to remove the incorrect example.");
    } finally {
      Ne(null);
    }
  }
  async function Pe() {
    if (E || ae != null || V.length === 0) return;
    F(!0);
    const z = `incorrect-example-export:${J.id}:${V.map((ee) => `${ee.id}:${ee.revision}:${ee.representationRevision}`).join(",")}`;
    try {
      const ee = await Ec(
        J.id,
        V
      ), me = new FormData();
      me.append("metadata", JSON.stringify({
        operationId: Je(z),
        examples: ee.captures
      }));
      for (const je of ee.files)
        me.append(je.fieldName, je.file);
      const ye = await re(
        `/videos/${J.id}/incorrect-examples/export`,
        { method: "POST", body: me }
      ), ge = await qd(ye.downloadUrl), Oe = URL.createObjectURL(ge.blob), Me = document.createElement("a");
      Me.href = Oe, Me.download = ge.fileName, Me.click(), setTimeout(() => URL.revokeObjectURL(Oe), 1e3);
      const Qe = await re(
        `/training-exports/${ye.id}/complete`,
        { method: "POST" }
      );
      Ye(z), I(await re(
        `/videos/${J.id}/incorrect-examples`
      )), te(
        `Downloaded ${ye.exampleCount} incorrect example${ye.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Qe.clearedExampleCount} from the working collection.`
      );
    } catch (ee) {
      te(ee.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      F(!1);
    }
  }
  async function ze(z = null) {
    const ee = be.filter((Te) => Te.reviewState === "rejected"), me = ee.length, ye = V.some((Te) => Te.representation === "fullItem");
    if (z == null && me === 0 && !ye) {
      te("There are no rejected segments to delete.");
      return;
    }
    if (z == null) {
      const Te = n("delete-rejected", -1);
      if (!Te) return;
      te("Preparing deletion summary…");
      try {
        const Ze = await re(`/videos/${J.id}/rejected/deletion/preview`, { method: "POST" }), Ke = Number(Ze.deletedSegmentCount) || 0, Ue = Number(Ze.deferredRejectedSegmentCount) || 0, Ie = Number(Ze.protectedIncorrectExampleCount) || 0;
        if (Ke === 0) {
          Ue > 0 ? te(
            `${Ue} feedback-protected rejected segment${Ue === 1 ? "" : "s"} kept. ${Ie} AI feedback example${Ie === 1 ? "" : "s"} must be exported before ${Ue === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : te("There are no rejected segments to delete.");
          return;
        }
        if (!Ka(Ze, te)) return;
        ce(Ze), te("");
      } catch (Ze) {
        te(Ze.message || "Unable to prepare rejected segment deletion.");
      } finally {
        Te();
      }
      return;
    }
    const ge = z, Oe = Number(ge.deferredRejectedSegmentCount) || 0, Me = ue.current, Qe = ee.map((Te) => Te.id), je = Oe === 0 && Qe.includes(Me), tt = je ? Ur(
      se,
      Br(o, Me),
      { removedIds: Qe }
    ) : null, We = n("delete-rejected", -1);
    if (!We) return;
    ce(null), te("Deleting rejected segments…");
    const Ae = Oe === 0 ? Mt() : null;
    Ae && x({
      type: "add",
      entry: { id: Ae, op: "remove", targets: ee.map(ft) }
    }), je && (ne(tt ? [tt.id] : []), R((tt == null ? void 0 : tt.id) ?? Ln), ke.current = (tt == null ? void 0 : tt.id) ?? null, Se.current = []);
    try {
      const Te = `rejected-dependency-delete:${J.id}:${ge.fingerprint}`, Ze = await re(`/videos/${J.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(Te),
          fingerprint: ge.fingerprint
        })
      });
      Ye(Te);
      const Ke = await Y();
      Ae && x({ type: "confirm", key: Ae, applied: Ke != null }), Ze.deletedSegmentCount > 0 && t(Xt);
      const Ue = Oe > 0 ? ` ${Oe} feedback-protected rejected segment${Oe === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      te(`${Ze.deletedSegmentCount} segment${Ze.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Ue}`);
    } catch (Te) {
      Ae && x({ type: "discard", key: Ae }), je && (ne(Me == null ? [] : [Me]), R(Me), ke.current = Me, Se.current = []), te(Te.message || "Unable to delete rejected segments.");
    } finally {
      We();
    }
  }
  async function gt(z = i) {
    if (a || z.length === 0) return;
    const ee = n("auto-assign", -1);
    if (!ee) {
      H("Wait for the current save to finish before assigning performers.");
      return;
    }
    try {
      await Be(z);
    } finally {
      ee();
    }
  }
  async function Be(z) {
    le(!0), H("");
    try {
      const ee = await re(`/videos/${J.id}/segments/auto-assign-performer-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeSegmentIds: z.flatMap((me) => me.nativeSegmentId == null ? [] : [me.nativeSegmentId]),
          itemIds: z.flatMap((me) => me.published || me.itemId == null ? [] : [me.itemId])
        })
      });
      we(!1), await Y(), te(`${ee.assignedSegmentCount} segment${ee.assignedSegmentCount === 1 ? "" : "s"} received ${ee.assignedSlotCount} performer-slot assignment${ee.assignedSlotCount === 1 ? "" : "s"}.`);
    } catch (ee) {
      H(ee.message || "Unable to auto-assign performers.");
    } finally {
      le(!1);
    }
  }
  async function pt() {
    O(!0), b(""), !$ && (G(!0), ie());
  }
  function ot() {
    S.current = !0, O(!1), requestAnimationFrame(() => {
      var z;
      return (z = L.current) == null ? void 0 : z.focus({ preventScroll: !0 });
    });
  }
  async function Le() {
    if (!$ || k || $.createCount + $.linkCount === 0)
      return;
    const z = n("materialize", -1);
    if (!z) {
      b("Wait for the current save to finish before materializing derived segments.");
      return;
    }
    try {
      await rt();
    } finally {
      z();
    }
  }
  async function rt() {
    C(!0), b("");
    let z;
    try {
      const ee = `materialize-derived:${J.id}:${$.fingerprint}`;
      z = await re(`/videos/${J.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(ee),
          fingerprint: $.fingerprint,
          maxDepth: 3
        })
      }), Ye(ee);
    } catch (ee) {
      ee.status === 409 && X(null), b(ee.message || "Unable to materialize derived segments."), C(!1);
      return;
    }
    X((ee) => ee && { ...ee, createCount: 0, linkCount: 0 });
    try {
      await Y(), ot(), X(null);
      const ee = z.createdCount + z.linkedCount;
      te(`${z.createdCount} derived segment${z.createdCount === 1 ? "" : "s"} created and ${z.linkedCount} existing segment${z.linkedCount === 1 ? "" : "s"} linked.`), ee === 0 && te("Every applicable derivation was already materialized.");
    } catch {
      b("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    C(!1);
  }
  async function xt(z, ee = null) {
    var Me, Qe, je, tt;
    const me = {
      tagId: z,
      ...ee ? { tagName: ee } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (fe.length > 1) {
      const We = fe.filter((Ie) => Ie.tagId !== z);
      if (We.length === 0) {
        d();
        return;
      }
      const Ae = fe.map((Ie) => ({
        id: Ie.id,
        itemId: Ie.itemId,
        nativeSegmentId: Ie.nativeSegmentId
      })), Te = fe.map((Ie) => !c || Ie.nativeSegmentId != null ? `native:${Ie.nativeSegmentId}:${Ie.updatedAt}` : `item:${Ie.itemId}:${Ie.revision}`).sort().join(","), Ze = `bulk-tag:${J.id}:${z}:${Te}`, Ke = n("tag", (_ == null ? void 0 : _.id) ?? We[0].id);
      if (!Ke) return;
      te(`Changing tag for ${We.length} selected segment${We.length === 1 ? "" : "s"}…`);
      const Ue = Mt();
      x({
        type: "add",
        entry: { id: Ue, op: "patch", targets: We.map(ft), values: me }
      }), d();
      try {
        const Ie = c ? null : crypto.randomUUID();
        await re(`/videos/${J.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Je(Ze),
            tagId: z,
            historyReceiptId: Ie,
            segments: fe.map((nt) => {
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
          fe,
          c
        ), He = await Y();
        x({ type: "confirm", key: Ue, applied: He != null });
        const vt = Ae.map((nt) => mt(He == null ? void 0 : He.segments, nt)).filter(Boolean);
        await Z(
          "segments.tag",
          `Changed tag for ${We.length} segment${We.length === 1 ? "" : "s"}`,
          Bt,
          Ft(vt, c),
          Ie
        );
        const Dt = Ae.map((nt) => mt(He == null ? void 0 : He.segments, nt)).filter(Boolean);
        ne(Dt.map((nt) => nt.id)), R(((Me = Dt.find((nt) => nt.id === (_ == null ? void 0 : _.id))) == null ? void 0 : Me.id) ?? ((Qe = Dt[0]) == null ? void 0 : Qe.id) ?? null), d(), te(`${We.length} selected segment${We.length === 1 ? "" : "s"} retagged.`);
      } catch (Ie) {
        x({ type: "discard", key: Ue });
        const Bt = Ae.map((vt) => mt(m.segments, vt)).filter(Boolean), He = mt(m.segments, {
          id: _ == null ? void 0 : _.id,
          itemId: _ == null ? void 0 : _.itemId,
          nativeSegmentId: _ == null ? void 0 : _.nativeSegmentId
        }) || Bt[0] || null;
        ne(Bt.map((vt) => vt.id)), R((He == null ? void 0 : He.id) ?? null), ke.current = (He == null ? void 0 : He.id) ?? null, Se.current = [], Ie.status === 409 && await T(), te(Ie.message || "Unable to change the selected segment tags.");
      } finally {
        Ke();
      }
      return;
    }
    if (fe.length !== 1 || !_) return;
    const ye = rs(U, _);
    if (_.id === u || ye) {
      const We = ye ? { segmentId: _.id, tagId: ye.values.tagId, tagName: ye.meta.tagName } : null, Ae = ld(We, _, z, ee);
      if (Ae && !lt(_, Ae)) {
        d();
        return;
      }
      if (ye && (y((Te) => {
        var Ze;
        return ((Ze = Te.meta) == null ? void 0 : Ze.pendingChangeId) === ye.id;
      }), x({ type: "discard", key: ye.id })), Ae) {
        const Te = xa(
          { ..._, tagId: Ae.tagId },
          j,
          h,
          Q,
          De
        );
        w(Te.filters), A(Te.hideDerivedSegments), te("Tag change queued…");
      } else ye && te("");
      d();
      return;
    }
    if (z === _.tagId) {
      d();
      return;
    }
    let ge = ((je = P.data) == null ? void 0 : je.children) ?? null;
    if (ge == null && P.loading && _.itemId != null) {
      d();
      try {
        const We = await re(`/videos/${J.id}/items/${_.itemId}/metadata`);
        ge = ((tt = We == null ? void 0 : We.lineage) == null ? void 0 : tt.children) ?? null;
      } catch {
      }
    }
    if (_.itemId != null && (ge == null ? void 0 : ge.length) > 0) {
      const We = n("lineage-tag", _.id);
      if (!We) {
        te("Wait for the current save to finish, then choose the tag again.");
        return;
      }
      te("Checking lineage impact…");
      let Ae = null;
      try {
        const Te = await re(`/items/${_.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: _.revision, tagId: z })
        }), Ze = Te.deletedItemIds.length > 0 || Te.removedEdgeIds.length > 0;
        if (Ze && !window.confirm(
          `Changing this tag removes ${Te.removedEdgeIds.length} lineage edge${Te.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${Te.deletedItemIds.length} derived segment${Te.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
        )) {
          te("Tag change canceled.");
          return;
        }
        Ae = Mt(), x({
          type: "add",
          entry: { id: Ae, op: "patch", targets: [ft(_)], values: me }
        }), d();
        const Ke = `tag-change:${_.itemId}:${_.revision}:${Te.componentFingerprint}:${z}`;
        await re(`/items/${_.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Je(Ke),
            expectedRevision: _.revision,
            componentFingerprint: Te.componentFingerprint,
            tagId: z
          })
        }), Ye(Ke);
        const Ue = await Y();
        x({ type: "confirm", key: Ae, applied: Ue != null }), d(), te(Ze ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch (Te) {
        Ae && x({ type: "discard", key: Ae }), ne([_.id]), R(_.id), ke.current = _.id, Se.current = [], Te.status === 409 ? (te("Lineage changed — loading the latest segments…"), await T()) : te(Te.message || "Unable to reconcile the lineage.");
      } finally {
        We();
      }
      return;
    }
    d();
    const Oe = (f == null ? void 0 : f.id) === _.id ? f : _;
    await D(_, {
      startSec: Oe.startSec,
      endSec: Oe.endSec,
      tagId: z
    }, !0, null, !0, me);
  }
  function lt(z, ee) {
    const me = Mt(), ye = p(ft(z));
    x({
      type: "add",
      entry: {
        id: me,
        op: "patch",
        targets: [ye],
        values: { tagId: ee.tagId, tagName: ee.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: ee.tagName }
      }
    });
    const ge = U.find((Me) => Me.op === "insert" && Me.segment.id === z.id);
    return N({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [ye],
      dependsOn: (ge == null ? void 0 : ge.taskId) ?? null,
      meta: { pendingChangeId: me },
      ready: (Me, Qe) => {
        const je = ts(Me.segments, Qe.targets[0]);
        return !je || dd(Me, je.id);
      },
      run: (Me) => ht(Me, me, ee)
    }) ? !0 : (x({ type: "discard", key: me }), te("Wait for the history restore to finish."), !1);
  }
  async function ht(z, ee, me) {
    const [ye] = z.resolveTargets();
    if (!ye) {
      x({ type: "discard", key: ee }), te(`The new segment was not retagged${me.tagName ? ` to ${me.tagName}` : ""}. Choose its tag again.`);
      return;
    }
    if (ye.tagId === me.tagId) {
      x({ type: "discard", key: ee });
      return;
    }
    await B(ye, {
      startSec: ye.startSec,
      endSec: ye.endSec,
      tagId: me.tagId
    }, {
      pendingChangeId: ee,
      restoreSelectionOnFailure: !1,
      onReload: z.onReload,
      onConflict: z.onConflict
    }) || te(`The new segment was not retagged${me.tagName ? ` to ${me.tagName}` : ""}. Choose its tag again.`);
  }
  async function Xe() {
    var Qe, je, tt, We;
    if (!l || !_ || de != null) return;
    const z = [...fe].sort((Ae, Te) => Number(Ae.nativeSegmentId ?? Ae.id) - Number(Te.nativeSegmentId ?? Te.id)), ee = new Set(z.map((Ae) => Ae.id)), me = z.map((Ae) => `${Ae.nativeSegmentId ?? Ae.id}:${Ae.updatedAt}`).join("|"), ye = n("bin", _.id);
    if (!ye) return;
    te(`Moving ${z.length} segment${z.length === 1 ? "" : "s"} to recycling bin…`);
    const ge = `bulk-move:${J.id}:${me}`, Oe = Je(ge), Me = c ? null : crypto.randomUUID();
    try {
      const Ae = (Ue = !1) => re(`/videos/${J.id}/segments/move-to-bin`, {
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
      Ye(ge), cr();
      const Ze = new Map((Te.items || []).map((Ue) => [
        Number(Ue.segmentId),
        Ue
      ]));
      await Z(
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
      const Ke = Ur(
        se,
        Br(o, _.id),
        { removedIds: [...ee] }
      );
      q((Ue) => ({
        ...Ue,
        segments: (Ue.segments || []).filter((Ie) => !ee.has(Ie.id))
      }), J.id), ne(Ke ? [Ke.id] : []), R((Ke == null ? void 0 : Ke.id) ?? Ln), ke.current = (Ke == null ? void 0 : Ke.id) ?? null, Se.current = [], Ke && (v(_t(o, Ke.id)), ve(Ke.id)), requestAnimationFrame(() => {
        var Ue;
        return (Ue = g.current) == null ? void 0 : Ue.focus({ preventScroll: !0 });
      }), te(`Moved ${z.length} segment${z.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Ae) {
      const Te = ((je = Ae.payload) == null ? void 0 : je.code) || ((We = (tt = Ae.payload) == null ? void 0 : tt.result) == null ? void 0 : We.code);
      Ae.status === 409 && Te === "CANONICAL_SEGMENT_CHANGED" ? await T() : te(Ae.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      ye();
    }
  }
  async function it() {
    if (!(c || s.current || de != null)) {
      s.current = !0, te("Checking the recycling bin…");
      try {
        const z = await re("/bin"), ee = await za(z, () => te("Emptying the recycling bin…"));
        if (ee.status === "empty") {
          te("The recycling bin is empty.");
          return;
        }
        if (ee.status === "canceled") {
          te("The recycling bin was not emptied.");
          return;
        }
        te(`${ee.segmentCount} segment${ee.segmentCount === 1 ? "" : "s"} from ${ee.sceneCount} scene${ee.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (z) {
        te(z.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: Fe, removeIncorrectExample: Re, captureTrainingExport: Pe, deleteRejectedSegments: ze, autoAssignPerformers: gt, previewDerivedSegments: pt, closeMaterializeDialog: ot, materializeDerivedSegments: Le, saveTag: xt, moveToBin: Xe, emptyRecyclingBin: it };
}
function Gu(e) {
  const { acceptHistory: t, acquireSaveLock: n, enqueueSave: o, getSaveQueueSnapshot: i, commonActionsRef: a, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: u, history: m, historyRef: f, historySaving: h, horizontalLayoutSize: g, mediaStackHeight: y, mediaStackRef: x, onDetailChange: N, onReload: p, railToggleRef: E, recordHistoryAction: Q, savingSegmentId: V, setCollapsedSegmentGroups: P, setEditorLayout: L, setHistorySaving: $, setIncorrectExamples: S, setSaveMessage: k, shotBoundaries: D, timelineDuration: B, video: U, workspaceRef: T } = e;
  async function q(F, A, I) {
    var X, C, ce, Ne;
    const b = F.type === "segment" ? [F] : F.segments || [], G = (A == null ? void 0 : A.type) === "segment" ? [A] : (A == null ? void 0 : A.segments) || [];
    let O = I;
    for (const [te, v] of b.entries()) {
      const R = G[te], ne = ((X = v.identity) == null ? void 0 : X.nativeSegmentId) != null || ((C = v.identity) == null ? void 0 : C.published) === !0, se = ((ce = R == null ? void 0 : R.identity) == null ? void 0 : ce.recycleBinItemId) ?? ((Ne = R == null ? void 0 : R.identity) == null ? void 0 : Ne.itemId);
      let J = mt(O.segments, R == null ? void 0 : R.identity) || mt(O.segments, v.identity);
      if (!J && ne && se != null && R.identity.revision != null) {
        const $e = `history-restore:${U.id}:${se}:${R.identity.revision}`;
        await re(`/bin/${se}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Je($e),
            expectedRevision: R.identity.revision
          })
        }), Ye($e), O = await p(), J = O.segments.find((Pe) => Pe.tagId === v.values.tagId && Pe.startSec === v.values.startSec && Pe.endSec === v.values.endSec);
      }
      if (!J)
        throw new Error("A segment in this history state no longer exists.");
      if ((J.nativeSegmentId != null || J.published === !0) !== ne) {
        if (ne) {
          const $e = J.recycleBinItemId ?? J.itemId ?? se;
          if ($e == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Pe = `history-restore:${U.id}:${$e}:${J.revision}:${v.values.reviewState ?? "native"}`;
          await re(`/bin/${$e}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Je(Pe),
              expectedRevision: J.revision
            })
          }), Ye(Pe);
        } else {
          const $e = `history-bin:${U.id}:${J.nativeSegmentId}:${J.updatedAt}:${v.values.reviewState}`;
          await re(`/videos/${U.id}/segments/${J.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Je($e),
              expectedUpdatedAt: J.updatedAt,
              reviewState: v.values.reviewState
            })
          }), Ye($e);
        }
        if (O = await p(), !ne)
          continue;
        if (J = mt(O.segments, v.identity) || O.segments.find(($e) => $e.tagId === v.values.tagId && $e.startSec === v.values.startSec && $e.endSec === v.values.endSec), !J)
          throw new Error("The restored segment could not be found.");
      }
      const Re = v.values;
      if (J.nativeSegmentId == null && J.itemId != null) {
        const $e = `history-draft-update:${U.id}:${J.itemId}:${J.revision}:${Re.tagId}:${Re.startSec}:${Re.endSec ?? "open"}:${Re.reviewState}`;
        await re(`/videos/${U.id}/drafts/${J.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Je($e),
            expectedRevision: J.revision,
            ...Re
          })
        }), Ye($e);
      } else
        await re(`/videos/${U.id}/segments/${J.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Re, expectedUpdatedAt: J.updatedAt })
        });
      O = await p();
    }
    return O;
  }
  async function Y(F, A) {
    var I;
    for (const b of F.targets || []) {
      const G = mt(A.segments, b.identity);
      if (!G)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const O = (I = A.performerSlotRevisions) == null ? void 0 : I[G.id];
      await re(G.published ? `/videos/${U.id}/segments/${G.nativeSegmentId}/slots` : `/videos/${U.id}/drafts/${G.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: O,
          assignments: b.assignments
        })
      }), A = await p();
    }
    return A;
  }
  async function j(F, A, I) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let b = A, G = await re(`/videos/${U.id}/incorrect-examples`);
    const O = (X) => G.find((C) => {
      var ce;
      return C.id === X.exampleId || ((ce = X.collectedIdentity) == null ? void 0 : ce.itemId) != null && C.itemId === X.collectedIdentity.itemId;
    });
    for (const [X, C] of (F.entries || []).entries()) {
      const ce = `history-feedback:${U.id}:${I.action.sequence}:${I.direction}:${X}`, Ne = O(C);
      if (F.collected && Ne) {
        Ye(ce);
        continue;
      }
      let te;
      if (F.collected) {
        const v = mt(
          b.segments,
          C.collectedIdentity
        ) || mt(
          b.segments,
          C.originalIdentity
        );
        if (!v)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const R = v.nativeSegmentId != null;
        te = await re(`/videos/${U.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Je(ce),
            nativeSegmentId: R ? v.nativeSegmentId : null,
            itemId: R ? null : v.itemId,
            expectedUpdatedAt: R ? v.updatedAt : null,
            expectedRevision: R ? null : v.revision
          })
        });
      } else {
        if (!Ne) {
          Ye(ce);
          continue;
        }
        te = await re(
          `/videos/${U.id}/incorrect-examples/${Ne.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Je(ce),
              expectedExampleRevision: Ne.revision,
              expectedRepresentationRevision: Ne.representationRevision
            })
          }
        );
      }
      Ye(ce), b = sn(
        b,
        te.editorDelta
      ), G = await re(
        `/videos/${U.id}/incorrect-examples`
      );
    }
    return S(G), b;
  }
  async function Z(F, A, I = []) {
    const b = F.state;
    if (!s && ((b == null ? void 0 : b.type) === "segment" || (b == null ? void 0 : b.type) === "segments")) {
      const O = `basic-history:${U.id}:${f.current.revision}:${F.action.sequence}:${F.direction}`, X = await re(`/videos/${U.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(O),
          expectedHistoryRevision: f.current.revision,
          actionSequence: F.action.sequence,
          direction: F.direction
        })
      });
      return t(X.history), I.push(O), p();
    }
    const G = F.direction === "backward" ? F.action.afterState : F.action.beforeState;
    if ((b == null ? void 0 : b.type) === "composite") {
      let O = A;
      const X = (G == null ? void 0 : G.type) === "composite" ? G.states || [] : [];
      for (const [C, ce] of (b.states || []).entries()) {
        const Ne = X[C];
        O = await Z({
          ...F,
          state: ce,
          action: {
            ...F.action,
            beforeState: F.direction === "backward" ? ce : Ne,
            afterState: F.direction === "backward" ? Ne : ce
          }
        }, O, I);
      }
      return O;
    }
    if ((b == null ? void 0 : b.type) === "segment" || (b == null ? void 0 : b.type) === "segments")
      return q(
        b,
        G,
        A
      );
    if ((b == null ? void 0 : b.type) === "performerSlots")
      return Y(b, A);
    if ((b == null ? void 0 : b.type) === "incorrectExamples")
      return j(b, A, F);
    if ((b == null ? void 0 : b.type) === "shots") {
      const O = fo(A.shotBoundaries || []), X = await re(`/videos/${U.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(`history-shots:${U.id}:${O}:${b.fingerprint}`),
          expectedFingerprint: O,
          boundaries: b.boundaries
        })
      });
      return { ...A, shotBoundaries: X };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function ie(F) {
    if (h || F === m.cursorSequence) return;
    if (V != null) {
      k("Finish the pending saves before restoring history.");
      return;
    }
    if (zi(m, F).length === 0) return;
    const I = o({
      kind: "history",
      lockId: -1,
      exclusive: !0,
      run: (b) => ae(b.detail, F)
    });
    if (!I) {
      k("Finish the pending saves before restoring history.");
      return;
    }
    await I.done;
  }
  async function ae(F, A) {
    var b;
    const I = zi(f.current, A);
    if (I.length !== 0) {
      $(!0), k(`Restoring ${I.length} history ${I.length === 1 ? "action" : "actions"}…`);
      try {
        let G = F;
        const O = [];
        for (const C of I)
          G = await Z(
            C,
            G,
            O
          );
        const X = s ? await re(`/videos/${U.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: f.current.revision,
            targetSequence: A
          })
        }) : f.current;
        O.forEach(Ye), t(X), await p(), k("History restored.");
      } catch (G) {
        G.status === 409 && ((b = G.payload) != null && b.current) && t(G.payload.current), await p(), k(G.message || "Unable to restore editor history.");
      } finally {
        $(!1);
      }
    }
  }
  function ve(F) {
    L((A) => ({ ...A, timelineRatio: jo(F, y) }));
  }
  function de(F) {
    var b, G;
    const A = (b = x.current) == null ? void 0 : b.getBoundingClientRect();
    if (!A) return;
    const I = ((G = a.current) == null ? void 0 : G.offsetHeight) || 0;
    ve(El(
      F.clientY,
      A.top + I,
      Math.max(0, A.height - I)
    ));
  }
  function De(F) {
    F.currentTarget.setPointerCapture(F.pointerId), de(F);
  }
  function be(F) {
    F.currentTarget.hasPointerCapture(F.pointerId) && de(F);
  }
  function _(F) {
    const A = F.shiftKey ? 0.1 : 0.05;
    let I = null;
    F.key === "ArrowUp" && (I = c.timelineRatio + A), F.key === "ArrowDown" && (I = c.timelineRatio - A);
    const b = Lo(y);
    F.key === "Home" && (I = b.minimum), F.key === "End" && (I = b.maximum), I != null && (F.preventDefault(), F.stopPropagation(), ve(I));
  }
  function ue(F) {
    const A = F === "detailWidth" ? g.focusRow : g.workspace, I = g.workspace > 0 ? So(g.workspace, 600) : 560, b = bn(c.markerRailWidth, I), G = F === "detailWidth" ? 344 + (c.markerRailOpen ? b + 24 : 0) : 600;
    return A > 0 ? So(A, G) : 560;
  }
  function fe(F, A) {
    L((I) => ({ ...I, [F]: bn(A, ue(F)) }));
  }
  function ke(F, A) {
    var b, G;
    const I = A === "detailWidth" ? (b = u.current) == null ? void 0 : b.getBoundingClientRect() : (G = T.current) == null ? void 0 : G.getBoundingClientRect();
    I && fe(A, A === "detailWidth" ? F.clientX - I.left : I.right - F.clientX);
  }
  function Se(F, A) {
    const I = ue(F), b = bn(c[F], I);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": A,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(I),
      "aria-valuenow": Math.round(b),
      "aria-valuetext": `${Math.round(b)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (G) => {
        G.currentTarget.setPointerCapture(G.pointerId), ke(G, F);
      },
      onPointerMove: (G) => {
        G.currentTarget.hasPointerCapture(G.pointerId) && ke(G, F);
      },
      onKeyDown: (G) => {
        const O = G.shiftKey ? 40 : 16;
        let X = null;
        G.key === "ArrowLeft" && (X = F === "detailWidth" ? -O : O), G.key === "ArrowRight" && (X = F === "detailWidth" ? O : -O);
        let C = X == null ? null : b + X;
        G.key === "Home" && (C = 240), G.key === "End" && (C = I), C != null && (G.preventDefault(), G.stopPropagation(), fe(F, C));
      },
      onDoubleClick: () => fe(F, Ot[F]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function H() {
    L((F) => ({ ...F, markerRailOpen: !F.markerRailOpen })), requestAnimationFrame(() => {
      var F;
      return (F = E.current) == null ? void 0 : F.focus({ preventScroll: !0 });
    });
  }
  function we(F) {
    P((A) => A.includes(F) ? A.filter((I) => I !== F) : dn([...A, F]));
  }
  function le(F, A = !0, I = l) {
    const b = i().running != null, G = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (O) => w(O.detail, F, A, I)
    });
    return G ? (b && k(F === "split" ? "Shot boundary queued…" : "Shot merge queued…"), G.done.then((O) => O.value ?? null)) : (k("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function w(F, A, I, b) {
    var ce;
    const G = (F == null ? void 0 : F.shotBoundaries) || [], O = Number((ce = U.videoFile) == null ? void 0 : ce.duration) || B, X = fo(G), C = `shot-${A}:${U.id}:${b.toFixed(3)}:${O.toFixed(3)}:${X}`;
    k(A === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const Ne = await re(`/videos/${U.id}/shot-boundaries/${A}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Je(C), timeSec: b })
      });
      return Ye(C), N((te) => ({ ...te, shotBoundaries: Ne }), U.id), I && await Q(
        "shots.update",
        A === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: G,
          fingerprint: X
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
  return { applySegmentHistoryState: q, applyPerformerSlotHistoryState: Y, applyHistoryState: Z, restoreHistoryTarget: ie, updateTimelineRatio: ve, updateTimelineRatioFromPointer: de, handleSeparatorPointerDown: De, handleSeparatorPointerMove: be, handleSeparatorKeyDown: _, panelWidthMaximum: ue, updatePanelWidth: fe, handlePanelSeparatorPointer: ke, panelSeparatorProps: Se, toggleSegmentRail: H, toggleSegmentGroup: we, mutateShotBoundary: le };
}
function Bu(e) {
  const { allSwimlanes: t, applyShortcutTiming: n, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, displayedSelectedSegment: d, duplicateSegment: c, editorLayout: u, editorRef: m, emptyRecyclingBin: f, lineage: h, mediaDuration: g, mergeSelectedSwimlane: y, moveToBin: x, mutateShotBoundary: N, openPublishApprovedDialog: p, playbackControlsRef: E, playbackShortcutConfig: Q, saveSelectedReviewState: V, seekRef: P, segmentGroupKeys: L, selectSegment: $, selectedSegment: S, selectedSegmentGroupForSegment: k, selectedSegmentGroupKey: D, selectedSegments: B, setCollapsedSegmentGroups: U, setIncorrectExamplesOpen: T, setQuickSearchOpen: q, setSaveMessage: Y, setSelectedSegmentGroupKey: j, setTagEditing: Z, setTimelineZoom: ie, shotBoundaries: ae, slotButtonRef: ve, splitSegment: de, swimlanes: De, timelineDuration: be, toggleIncorrectExample: _, toggleSegmentGroup: ue, updateTimelineRatio: fe, videoFrameRate: ke, visibleSegments: Se } = e;
  function H(w) {
    var F, A;
    (F = E.current) == null || F.pause(), (A = E.current) == null || A.seekBy(md(w, ke));
  }
  function we(w, F) {
    if (B.length > 1 && Ql(w.id))
      return;
    let A = null;
    w.id === "video.playPause" && (A = () => {
      var b;
      return (b = E.current) == null ? void 0 : b.toggle();
    }), w.id === "video.seekSmallBackward" && (A = () => {
      var b;
      return (b = E.current) == null ? void 0 : b.seekBy(-Q.smallSeekTime);
    }), w.id === "video.seekSmallForward" && (A = () => {
      var b;
      return (b = E.current) == null ? void 0 : b.seekBy(Q.smallSeekTime);
    }), w.id === "video.seekMediumBackward" && (A = () => {
      var b;
      return (b = E.current) == null ? void 0 : b.seekBy(-Q.mediumSeekTime);
    }), w.id === "video.seekMediumForward" && (A = () => {
      var b;
      return (b = E.current) == null ? void 0 : b.seekBy(Q.mediumSeekTime);
    }), w.id === "video.seekLongBackward" && (A = () => {
      var b;
      return (b = E.current) == null ? void 0 : b.seekBy(-Q.longSeekTime);
    }), w.id === "video.seekLongForward" && (A = () => {
      var b;
      return (b = E.current) == null ? void 0 : b.seekBy(Q.longSeekTime);
    }), w.id === "video.playSelected" && S && (A = () => {
      var b;
      (b = P.current) == null || b.call(P, S.startSec, !0), requestAnimationFrame(() => {
        var G;
        return (G = m.current) == null ? void 0 : G.focus({ preventScroll: !0 });
      });
    }), (w.id === "video.playPreviousSegment" || w.id === "video.playNextSegment") && (A = () => {
      var G;
      const b = $o(
        De,
        S == null ? void 0 : S.id,
        w.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !b || b.id === (S == null ? void 0 : S.id) || ($(b, { focusEditor: !0, seekToSegment: !1 }), (G = P.current) == null || G.call(P, b.startSec, !0));
    }), w.id.startsWith("video.seekPercent") && (A = () => {
      var G;
      const b = Number(w.id.slice(17)) / 10;
      (G = P.current) == null || G.call(P, Wl(g ?? be, b), !1);
    }), w.id === "video.jumpToSegmentStart" && S && (A = () => {
      var b;
      return (b = P.current) == null ? void 0 : b.call(P, S.startSec, !1);
    }), w.id === "video.jumpToSegmentEnd" && S && (A = () => {
      var b;
      return (b = P.current) == null ? void 0 : b.call(P, S.endSec ?? S.startSec, !1);
    }), w.id === "video.jumpToVideoStart" && (A = () => {
      var b;
      return (b = P.current) == null ? void 0 : b.call(P, 0, !1);
    }), w.id === "video.jumpToVideoEnd" && (A = () => {
      var b;
      return (b = P.current) == null ? void 0 : b.call(P, be, !1);
    }), w.id.startsWith("video.frame") && (A = () => {
      const b = w.id.includes("Small") ? "small" : w.id.includes("Medium") ? "medium" : "long", G = Q[`${b}FrameStep`] * (w.id.endsWith("Backward") ? -1 : 1);
      H(G);
    }), w.id.startsWith("navigation.swimlane") && (A = () => {
      const b = w.id.slice(19).toLowerCase(), G = $o(De, S == null ? void 0 : S.id, b, s);
      G && $(G, { focusEditor: !0, seekToSegment: !1 });
    }), (w.id === "navigation.extendSwimlaneLeft" || w.id === "navigation.extendSwimlaneRight") && (A = () => {
      const b = wc(
        t,
        S == null ? void 0 : S.id,
        w.id.endsWith("Left") ? "left" : "right"
      );
      b && $(b.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: b.segmentIds
      });
    }), (w.id === "navigation.segmentGroupUp" || w.id === "navigation.segmentGroupDown") && (A = () => {
      const b = Nc(
        L,
        D ?? k,
        w.id.endsWith("Up") ? -1 : 1
      );
      b && j(b);
    }), (w.id === "navigation.previousAtPlayhead" || w.id === "navigation.nextAtPlayhead") && (A = () => {
      const b = Ml(Se, s, w.id === "navigation.previousAtPlayhead" ? -1 : 1, S == null ? void 0 : S.id);
      b && $(b, { focusEditor: !0, seekToSegment: !1 });
    }), w.id === "navigation.nearestInCurrentSwimlane" && (A = () => {
      const b = Sl(
        De,
        S == null ? void 0 : S.id,
        s
      );
      b && $(b, { focusEditor: !0, seekToSegment: !1 });
    }), w.id.includes("Unreviewed") && (A = () => {
      const b = zr(
        De,
        S == null ? void 0 : S.id,
        w.id.startsWith("navigation.previous") ? -1 : 1,
        w.id.endsWith("Global")
      );
      b && $(b, { focusEditor: !F.preserveFocus, seekToSegment: !1 });
    }), (w.id === "navigation.nextTouchingPlayhead" || w.id === "navigation.previousTouchingPlayhead") && (A = () => {
      const b = vl(De, s, w.id === "navigation.previousTouchingPlayhead" ? -1 : 1, S == null ? void 0 : S.id);
      b && $(b, { focusEditor: !0, seekToSegment: !1 });
    }), w.id === "navigation.quickSearch" && (A = () => q(!0)), (w.id === "navigation.previousShot" || w.id === "navigation.nextShot") && (A = () => {
      var G;
      const b = ud(ae, s, w.id === "navigation.previousShot" ? -1 : 1);
      b && ((G = P.current) == null || G.call(P, b.startSec, !1));
    }), w.id === "shot.split" && (A = () => N("split")), w.id === "shot.merge" && (A = () => N("merge")), w.id === "marker.create" && (A = () => a()), w.id === "marker.duplicate" && (A = () => c(!1)), w.id === "marker.duplicateAtPlayhead" && (A = () => c(!0)), w.id === "marker.split" && (A = () => de()), w.id === "marker.editTag" && (A = () => {
      if (B.length > 1 && B.some((b) => b.isDerived)) {
        Y("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if (h.data ? h.data.tagReadOnly : S != null && S.isDerived) {
        Y("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      Z(!0);
    });
    const I = (d == null ? void 0 : d.id) === (S == null ? void 0 : S.id) ? d : S;
    w.id === "marker.setStart" && S && (A = () => n(s, I.endSec)), w.id === "marker.setEnd" && S && (A = () => n(I.startSec, s)), w.id === "marker.copyTiming" && S && (A = () => {
      Y(Zc(S) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), w.id === "marker.pasteTiming" && S && (A = () => {
      const b = Xc();
      if (!b) {
        Y("No copied segment timing is available.");
        return;
      }
      n(b.startSec, b.endSec);
    }), w.id === "marker.mergeSelection" && (A = () => y()), w.id === "marker.moveToBin" && (A = () => x()), w.id === "marker.toggleIncorrectExample" && S && (A = () => _()), w.id === "marker.openIncorrectExamples" && (A = () => T(!0)), w.id === "markerGroup.toggleCollapse" && D && (A = () => ue(D)), w.id === "markerGroup.toggleAll" && (A = () => U((b) => kc(b, L))), w.id === "marker.assignSlots" && (A = () => {
      var b;
      return (b = ve.current) == null ? void 0 : b.click();
    }), w.id === "navigation.zoomIn" && (A = () => ie((b) => Hr(b + 0.5))), w.id === "navigation.zoomOut" && (A = () => ie((b) => Hr(b - 0.5))), w.id === "navigation.resetZoom" && (A = () => ie(1)), w.id === "navigation.centerPlayhead" && (A = () => {
      var b;
      return (b = o.current) == null ? void 0 : b.call(o);
    }), w.id === "layout.growSwimlanes" && (A = () => fe(u.timelineRatio + 0.05)), w.id === "layout.shrinkSwimlanes" && (A = () => fe(u.timelineRatio - 0.05)), w.id === "marker.confirm" && S && (A = () => V("approved")), w.id === "system.publishApproved" && (A = () => p(F.target)), w.id === "marker.reject" && S && (A = () => V("rejected")), w.id === "system.emptyBin" && (A = () => f()), w.id === "system.deleteRejected" && (A = () => l()), A && A();
  }
  function le(w, F) {
    const A = yr.find((I) => I.id === w);
    A && Bn(A, i) && we(A, F);
  }
  return {
    executeShortcutById: le,
    stepVideoFrame: (w) => H(w < 0 ? -1 : 1)
  };
}
const Uu = 3e4;
function Ku(e) {
  return e === !0;
}
function _u() {
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
function zu({
  fetchRuns: e,
  onCompletedRun: t,
  windowTarget: n,
  documentTarget: o,
  intervalMs: i = Uu
}) {
  const a = _u();
  let s = null, l = !1, d = null;
  const c = () => o.visibilityState !== "hidden";
  async function u() {
    if (!(l || !a.isActive())) {
      l = !0;
      try {
        const g = await e(a.signal);
        if (!a.isActive()) return;
        const y = (Array.isArray(g) ? g : []).filter((N) => (N == null ? void 0 : N.status) === "completed" && N.id != null).map((N) => String(N.id));
        if (s === null) {
          s = new Set(y);
          return;
        }
        const x = y.filter((N) => !s.has(N));
        if (x.length === 0) return;
        x.forEach((N) => s.add(N)), await t();
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
  function f() {
    u();
  }
  function h() {
    c() ? (u(), m()) : (clearTimeout(d), d = null);
  }
  return u(), m(), n.addEventListener("focus", f), o.addEventListener("visibilitychange", h), function() {
    a.dispose(), clearTimeout(d), d = null, n.removeEventListener("focus", f), o.removeEventListener("visibilitychange", h);
  };
}
function Hu(e, t, n, o = !1, i = () => () => {
}) {
  const [a, s] = K({
    busy: !1,
    reviewState: null,
    error: ""
  }), l = pe(n);
  he(() => {
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
      await re(`/videos/${e}/native-segments/import`, {
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
  return he(() => {
    if (Ku(o))
      return zu({
        fetchRuns: (c) => re(`/videos/${e}/analysis-runs`, { signal: c }),
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
function qu(e, t) {
  var o;
  const n = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = n == null ? void 0 : n.focus) == null || o.call(n, { preventScroll: !0 });
}
function Wu({ detail: e, onDetailChange: t, onConflict: n, onReload: o, onAnalysisCompleted: i, onSlotsChanged: a, splitLayout: s, initialSegmentId: l, compatibilityMode: d = !1, profile: c, onNavigate: u }) {
  var bi, hi, vi, Si, xi;
  const m = pe(null), f = pe(/* @__PURE__ */ new Map()), [h, g] = K(0), y = pe(null);
  y.current = { onReloadProjection: o, onConflictProjection: n };
  const [{ onReload: x, onConflict: N }] = K(() => {
    const M = () => {
      f.current.clear(), g((oe) => oe + 1);
    };
    return {
      onReload: (...oe) => (M(), y.current.onReloadProjection(...oe)),
      onConflict: (...oe) => (M(), y.current.onConflictProjection(...oe))
    };
  }), [p, E] = K(null), [Q, V] = K([]), P = pe(null), L = pe(null), $ = pe([]), S = pe(null), [k, D] = K(() => Gt({})), [B, U] = K(!1), [T, q] = K(Vl), [Y, j] = K(0), Z = pe(null), [ie] = K(() => jc({
    getContext: () => Z.current,
    drainAfterSettle: !1
  })), ae = Bd(ie.subscribe, ie.getSnapshot), ve = ns(ae), de = (M, oe) => ie.acquire({ kind: M, lockId: oe }), De = (M) => ie.enqueue(M), be = (M) => ie.stableIdentity(M), _ = pe(!1);
  he(() => (_.current = !0, () => {
    _.current = !1, queueMicrotask(() => {
      _.current || ie.dispose();
    });
  }), []);
  const ue = (M) => ie.cancel(M), fe = (M, oe) => ie.retarget(M, oe), ke = ie.getSnapshot, [Se, H] = Gd(zc, []), [we, le] = K(""), [w, F] = K(""), [A, I] = K(""), [b, G] = K(1), [O, X] = K(Vc), [C, ce] = K(0), [Ne, te] = K({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [v, R] = K(Xt), ne = pe(Xt), [se, J] = K(!1), [Fe, Re] = K(!1), [$e, Pe] = K(!1), ze = pe(!1);
  ze.current = $e;
  const [gt, Be] = K(null), [pt, ot] = K(!1), [Le, rt] = K(null), [xt, lt] = K(null), ht = pe(null), [Xe, it] = K(!1), [z, ee] = K(""), me = pe(null), ye = pe(null), ge = pe(!1), [Oe, Me] = K(Jc), [Qe, je] = K(null), [tt, We] = K(!1), [Ae, Te] = K(!1), [Ze, Ke] = K(!1), [Ue, Ie] = K(!1), [Bt, He] = K(!1), [vt, Dt] = K(""), {
    importNativeSegments: nt,
    nativeImportState: Ee
  } = Hu(
    e.video.id,
    x,
    i,
    d,
    (M, oe) => ie.acquire({ kind: M, lockId: oe })
  ), [Ce, dt] = K(!1), [kt, bt] = K(null), [qt, St] = K(d), [Ct, en] = K(0), [cn, tn] = K(!1), [_n, zn] = K(""), [vr, Sr] = K(null), Hn = pe(null), xr = pe(null), qn = pe(!1), [un, kn] = K([]), [wn, kr] = K(!1), [Wn, ro] = K(null), Vn = qc(), Jn = pe(null), Yn = pe(null), Nn = pe(null), wr = pe(l), Nr = pe(null), Qn = pe(null), mn = pe(null), Xn = pe(null), Ut = pe(null), $t = pe(null), Zn = pe(null), er = pe(null), Ir = pe(null), Cr = pe(null), In = pe(null), tr = pe(null), $r = pe(-1e12), oo = pe(null), nr = pe(null), [at, Cn] = K({ scrollTop: 0, height: 512 });
  he(() => {
    if (!Ce || cn || !_n) return;
    const M = requestAnimationFrame(() => {
      var oe;
      return (oe = xr.current) == null ? void 0 : oe.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(M);
  }, [Ce, cn, _n]), he(() => {
    if (!qn.current || Ce || qt) return;
    const M = requestAnimationFrame(() => {
      var oe;
      (oe = Hn.current) == null || oe.focus({ preventScroll: !0 }), qn.current = !1;
    });
    return () => cancelAnimationFrame(M);
  }, [Ce, qt]);
  const st = e.video, wt = e.segments || sr, Tr = qe(() => JSON.stringify({
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
  he(() => {
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
      re(`/videos/${st.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((_e) => {
        M && (bt(_e), zn(""));
      }).catch((_e) => {
        M && (bt(null), zn(_e.message || "Unable to preview derived segments."));
      }).finally(() => {
        M && St(!1);
      });
    }, 150);
    return () => {
      M = !1, clearTimeout(oe);
    };
  }, [d, st.id, Tr, Ct, ve]);
  const gn = () => en((M) => M + 1), Wt = e.segmentGroups || sr, Tt = e.performerSlots || sr, Rr = d && e.performerSlotsAvailable !== !1, pn = qe(
    () => (e.performerCandidates || []).filter((M) => M.isVideoPerformer),
    [e.performerCandidates]
  ), $n = e.shotBoundaries || sr, rr = qe(
    () => Ja(Tt),
    [Tt]
  ), Tn = qe(
    () => wt.map((M) => {
      const oe = rr.get(M.id) || [];
      return {
        ...M,
        slots: oe,
        assignment: oe.every((_e) => _e.performerId == null) ? Ad(oe, pn) : null
      };
    }).filter((M) => M.slots.length > 0 && M.assignment != null),
    [wt, rr, pn]
  ), fn = Number((bi = st.videoFile) == null ? void 0 : bi.frameRate) > 0 ? Number(st.videoFile.frameRate) : 30;
  function Rn() {
    const M = ze.current;
    Pe(!1), M && requestAnimationFrame(() => {
      var oe;
      return (oe = $t.current) == null ? void 0 : oe.focus({ preventScroll: !0 });
    });
  }
  function io() {
    ve == null && (tr.current = null, ot(!1), le(""), requestAnimationFrame(() => {
      var M;
      return (M = $t.current) == null ? void 0 : M.focus({ preventScroll: !0 });
    }));
  }
  function ao() {
    U(!1), requestAnimationFrame(() => {
      var M, oe;
      (M = er.current) != null && M.isConnected ? er.current.focus({ preventScroll: !0 }) : (oe = $t.current) == null || oe.focus({ preventScroll: !0 });
    });
  }
  he(() => {
    In.current === p ? (In.current = null, Pe(!0)) : Pe(!1);
  }, [p]), he(() => {
    var oe;
    if (!$e) return;
    const M = (oe = Cr.current) == null ? void 0 : oe.querySelector("input");
    document.activeElement !== M && (M == null || M.focus({ preventScroll: !0 }), M == null || M.select());
  }, [$e, p]), he(() => {
    var oe;
    if ($e) return;
    const M = (oe = $t.current) == null ? void 0 : oe.ownerDocument;
    M && M.activeElement === M.body && $t.current.focus({ preventScroll: !0 });
  }, [$e]), he(() => {
    var _e, ut, Nt;
    const M = vn(
      go(
        e.segments,
        e.performerSlots || [],
        Gt({}),
        d && T,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), oe = ((_e = e.segments.find((On) => On.id === l)) == null ? void 0 : _e.id) ?? ((ut = ba(M)) == null ? void 0 : ut.id) ?? null;
    E(oe), V(oe == null ? [] : [oe]), L.current = oe, $.current = [], je(_t(M, oe)), D(Gt({})), U(!1), tr.current = null, ot(!1), G(1), le(""), R(Xt), ne.current = Xt, J(!1), (Nt = $t.current) == null || Nt.focus({ preventScroll: !0 });
  }, [st.id, l]), he(() => {
    const M = new AbortController();
    return re(`/videos/${st.id}/incorrect-examples`, { signal: M.signal }).then(kn).catch((oe) => {
      oe.name !== "AbortError" && kn([]);
    }), () => M.abort();
  }, [st.id, c == null ? void 0 : c.effectiveMode]), he(() => {
    const M = new AbortController();
    return re(`/videos/${st.id}/history`, { signal: M.signal }).then((oe) => {
      const _e = oe || Xt;
      ne.current = _e, R(_e);
    }).catch((oe) => {
      oe.name !== "AbortError" && le(oe.message || "Unable to load editor history.");
    }), () => M.abort();
  }, [st.id]), he(() => {
    Qc(O);
  }, [O.timelineRatio, O.markerRailOpen, O.detailWidth, O.markerRailWidth, O.swimlaneTitleWidth]), he(() => {
    Yc(Oe);
  }, [Oe]), he(() => {
    Jl(T);
  }, [T]), he(() => {
    const M = Qn.current;
    if (!s || !M || typeof ResizeObserver > "u") return;
    const oe = () => {
      var Nt;
      const ut = Math.max(0, M.clientHeight - (((Nt = mn.current) == null ? void 0 : Nt.offsetHeight) || 0));
      ce(ut), X((On) => {
        const ki = jo(On.timelineRatio, ut);
        return ki === On.timelineRatio ? On : { ...On, timelineRatio: ki };
      });
    }, _e = new ResizeObserver(oe);
    return _e.observe(M), mn.current && _e.observe(mn.current), oe(), () => _e.disconnect();
  }, [s]), he(() => {
    if (!Vn || typeof ResizeObserver > "u") return;
    const M = Ut.current, oe = Xn.current;
    if (!M || !oe) return;
    const _e = () => te({
      workspace: M.clientWidth,
      focusRow: oe.clientWidth,
      focusRowHeight: oe.clientHeight
    }), ut = new ResizeObserver(_e);
    return ut.observe(M), ut.observe(oe), _e(), () => ut.disconnect();
  }, [Vn, O.markerRailOpen]);
  const nn = qe(
    () => Wo(wt, Se),
    [wt, Se]
  );
  Ki(() => {
    ss(Se, e) !== Se && H({ type: "prune", detail: e });
  }, [e, Se]);
  const Yt = qe(
    () => Vi(
      go(
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
  ), En = Object.fromEntries(At.map((M) => [M, Yt.filter((oe) => oe.reviewState === M).length])), Mn = Vi(
    go(
      nn,
      Tt,
      { ...k, reviewStates: At },
      d && T,
      Wt
    ),
    un,
    !0
  ), W = Object.fromEntries(At.map((M) => [M, Mn.filter((oe) => oe.reviewState === M).length])), Ve = [...new Set(nn.map((M) => M.sourceKey).filter(Boolean))].sort((M, oe) => Ht(M).localeCompare(Ht(oe))), jt = Ll(
    k,
    d && T
  ), ct = qe(
    () => vn(Yt, Wt, Tt),
    [Yt, Wt, Tt]
  ), Rt = qe(
    () => xc(ct, Oe),
    [ct, Oe]
  ), Et = ((hi = m.current) == null ? void 0 : hi.videoId) === st.id ? m.current : null, et = Gl(
    ct,
    p,
    l,
    {
      visibleLanes: Rt,
      reference: (Et == null ? void 0 : Et.reference) ?? null,
      referenceLanes: (Et == null ? void 0 : Et.lanes) ?? null
    }
  );
  he(() => {
    const M = Br(ct, et == null ? void 0 : et.id);
    M && (m.current = { videoId: st.id, reference: M, lanes: Rt });
  }, [st.id, et == null ? void 0 : et.id, ct, Rt]);
  const Yo = qe(() => {
    const M = Uc(Se);
    return M.length === 0 ? wt : [...wt, ...M];
  }, [wt, Se]), xe = et == null ? null : Yo.find((M) => M.id === et.id) || et, rn = Mi(Yo, Mi(Yt, Q).map((M) => M.id)), ys = Lc(ae, rn), bs = jn(ae), hs = To(ae), Qo = !d && rn.length > 0 && rn.every((M) => M.nativeSegmentId != null), Xo = Yt.map((M) => M.id), vs = Xo.join("|");
  P.current = (xe == null ? void 0 : xe.id) ?? null;
  const Zo = pe(null);
  Zo.current = p;
  const ei = rr.get(xe == null ? void 0 : xe.id) || [], Ss = zo(ei), ti = qe(
    () => vc(ct, Q),
    [ct, Q]
  ), Er = qe(() => Ho(ct), [ct]), or = qe(
    () => bc(Er, Oe),
    [Er, Oe]
  ), xs = qe(
    () => Qa(
      or.rows,
      at.scrollTop,
      at.height
    ),
    [or, at]
  ), ks = zr(Rt, xe == null ? void 0 : xe.id, -1, !0) != null, ws = zr(Rt, xe == null ? void 0 : xe.id, 1, !0) != null, An = xe ? _t(ct, xe.id) : null, so = Ya(Er) ? Er.map((M) => M.key) : [], Ns = so.join("|"), Mr = Math.max(
    0,
    Number((vi = st.videoFile) == null ? void 0 : vi.duration) || 0,
    ...nn.map((M) => Number(M.endSec ?? M.startSec) || 0)
  ), ni = Number((Si = st.videoFile) == null ? void 0 : Si.duration) > 0 ? Number(st.videoFile.duration) : null;
  v.actions;
  const Is = Ca();
  he(() => {
    const M = p === Ln ? p : (xe == null ? void 0 : xe.id) ?? null;
    M !== p && E(M);
  }, [xe, p]), he(() => {
    V((M) => {
      const oe = zl(
        M,
        Xo,
        (xe == null ? void 0 : xe.id) ?? null
      );
      return oe.length === M.length && oe.every((_e, ut) => _e === M[ut]) ? M : oe;
    });
  }, [vs, xe == null ? void 0 : xe.id]);
  const ir = e.itemMetadataAvailable ? (xe == null ? void 0 : xe.itemId) ?? null : null, ri = ir == null ? null : ((xi = e.itemMetadata) == null ? void 0 : xi[ir]) || null, Qt = ir == null || ri ? null : `${h}:${ir}:${xe.revision}:${xe.updatedAt}`, [lo, co] = K({ key: null, value: null, error: null });
  he(() => {
    if (Qt == null) return;
    const M = f.current.get(Qt);
    if (M) {
      co({ key: Qt, value: M, error: null });
      return;
    }
    const oe = new AbortController(), _e = setTimeout(() => {
      re(`/videos/${st.id}/items/${ir}/metadata`, { signal: oe.signal }).then((ut) => {
        const Nt = f.current;
        Nt.size >= 500 && Nt.delete(Nt.keys().next().value), Nt.set(Qt, ut), co({ key: Qt, value: ut, error: null });
      }).catch((ut) => {
        oe.signal.aborted || co({ key: Qt, value: null, error: ut.message || "Unable to load provenance." });
      });
    }, 100);
    return () => {
      clearTimeout(_e), oe.abort();
    };
  }, [Qt, st.id]);
  const ar = Qt == null ? { loading: !1, error: null, value: ri } : lo.key === Qt ? { loading: !1, error: lo.error, value: lo.value } : { loading: !0, error: null, value: null }, Dn = ar.value, Cs = {
    key: (xe == null ? void 0 : xe.itemId) != null ? `item:${xe.itemId}` : (xe == null ? void 0 : xe.nativeSegmentId) != null ? `native:${xe.nativeSegmentId}` : null,
    loading: ar.loading,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : ar.error,
    items: e.itemMetadataAvailable ? (Dn == null ? void 0 : Dn.provenance) || (xe == null ? void 0 : xe.fieldProvenance) || [] : []
  }, uo = (xe == null ? void 0 : xe.itemId) != null ? {
    loading: ar.loading,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : ar.error,
    data: e.lineageMetadataAvailable && (Dn == null ? void 0 : Dn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  he(() => {
    F(et == null ? "" : String(et.startSec)), I((et == null ? void 0 : et.endSec) == null ? "" : String(et.endSec));
  }, [et == null ? void 0 : et.id, et == null ? void 0 : et.startSec, et == null ? void 0 : et.endSec]), he(() => {
    An && Me((M) => es(M, An));
  }, [st.id, l, An]), he(() => {
    je((M) => Ic(so, M, An));
  }, [st.id, Ns, An]), he(() => {
    if (!O.markerRailOpen || (xe == null ? void 0 : xe.id) == null) return;
    const M = nr.current, oe = or.rows.find((Nt) => Nt.kind === "segment" && Nt.segment.id === xe.id);
    if (!M || !oe) return;
    const _e = oe.top + oe.height;
    let ut = M.scrollTop;
    oe.top < M.scrollTop ? ut = oe.top : _e > M.scrollTop + M.clientHeight && (ut = Math.max(0, _e - M.clientHeight)), ut !== M.scrollTop && (M.scrollTop = ut), Cn({ scrollTop: ut, height: M.clientHeight });
  }, [xe == null ? void 0 : xe.id, or, O.markerRailOpen]), he(() => {
    const M = nr.current;
    if (!O.markerRailOpen || !M) return;
    const oe = () => Cn({
      scrollTop: M.scrollTop,
      height: M.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      oe();
      return;
    }
    const _e = new ResizeObserver(oe);
    return _e.observe(M), oe(), () => _e.disconnect();
  }, [O.markerRailOpen]);
  const { revealSegmentGroupForSelection: oi, replaceSegmentSelection: $s, selectSegment: ii, selectSegmentCollection: Ts, selectAllVideoSegments: Rs } = Lu({
    allSwimlanes: ct,
    editorRef: $t,
    performerSlots: Tt,
    seekRef: Jn,
    segmentGroups: Wt,
    segments: wt,
    selectedSegmentId: p,
    selectedSegmentIds: Q,
    selectionAnchorIdRef: L,
    selectionRangeBaseIdsRef: $,
    setCollapsedSegmentGroups: Me,
    setEditorFilters: D,
    setHideDerivedSegments: q,
    setSaveMessage: le,
    setSelectedSegmentGroupKey: je,
    setSelectedSegmentId: E,
    setSelectedSegmentIds: V
  }), { acceptHistory: mo, recordHistoryAction: Ar, mutateSegment: Es, runSegmentMutation: Ms, completeReview: As, createSegment: ai, splitSegment: si, duplicateSegment: li, saveTiming: Ds, applyShortcutTiming: Os } = Hc({
    compatibilityMode: d,
    getRequestedSelectionId: () => Zo.current,
    displayedSelectedSegment: et,
    getSaveQueueSnapshot: ke,
    currentTime: Y,
    detail: e,
    editorFilters: k,
    endInput: A,
    hideDerivedSegments: T,
    historyRef: ne,
    mediaDuration: ni,
    onConflict: N,
    onDetailChange: t,
    onReload: x,
    optimisticSegmentIdRef: $r,
    pendingDuplicateRef: oo,
    pendingFirstSegmentStartSecRef: tr,
    pendingTagEditSegmentIdRef: In,
    performerSlots: Tt,
    enqueueSave: De,
    pendingChanges: Se,
    retargetSaveTasks: fe,
    replaceSegmentSelection: $s,
    savingSegmentId: ve,
    segments: wt,
    selectedSegment: xe,
    selectedSegmentIdRef: P,
    selectedSegments: rn,
    selectionAnchorIdRef: L,
    selectionRangeBaseIdsRef: $,
    setCreatingSegmentId: Be,
    setEditorFilters: D,
    setFirstSegmentTagOpen: ot,
    setHideDerivedSegments: q,
    setHistory: R,
    setHistoryOpen: J,
    setPublishApprovedError: ee,
    setSaveMessage: le,
    acquireSaveLock: de,
    dispatchPendingChanges: H,
    setSelectedSegmentGroupKey: je,
    setSelectedSegmentId: E,
    setSelectedSegmentIds: V,
    setTagEditing: Pe,
    startInput: w,
    tagEditingRef: ze,
    timelineDuration: Mr,
    video: st
  });
  function di(M = null) {
    var ut;
    if (!d || ve != null || !wt.some((Nt) => Qr(Nt))) return;
    const oe = ((ut = $t.current) == null ? void 0 : ut.ownerDocument) ?? document, _e = oe.activeElement === oe.body ? null : oe.activeElement;
    ye.current = M != null && M.isConnected && M !== oe.body ? M : _e, ee(""), it(!0);
  }
  function ci() {
    ve == null && (it(!1), ee(""), requestAnimationFrame(() => {
      qu(
        ye.current,
        $t.current
      ), ye.current = null;
    }));
  }
  async function Ps() {
    await As() && ci();
  }
  const { closeMergeConfirmation: Ls, mergeSelectedSwimlane: ui, saveSelectedReviewState: js } = ju({
    acceptHistory: mo,
    pendingChanges: Se,
    compatibilityMode: d,
    detail: e,
    detailPanelRef: S,
    getSaveQueueSnapshot: ke,
    historyRef: ne,
    onConflict: N,
    onDetailChange: t,
    onReload: x,
    recordHistoryAction: Ar,
    revealSegmentGroupForSelection: oi,
    savingSegmentId: ve,
    selectedGroups: ti,
    selectedSegment: xe,
    selectedSegmentIdRef: P,
    selectedSegments: rn,
    selectionAnchorIdRef: L,
    selectionRangeBaseIdsRef: $,
    setMergeConfirmation: rt,
    setSaveMessage: le,
    acquireSaveLock: de,
    dispatchPendingChanges: H,
    enqueueSave: De,
    stableSaveIdentity: be,
    setSelectedSegmentId: E,
    setSelectedSegmentIds: V,
    video: st
  }), Fs = (M) => {
    const oe = (M || []).map(ft);
    ie.cancel((_e) => _e.kind === "review" && to(_e.targets, oe));
  }, Gs = ie.settledCount();
  Ki(() => {
    ie.markCommitted(Gs), Z.current = {
      detail: e,
      segments: wt,
      onConflict: N,
      onDetailChange: t,
      onReload: x,
      tagEditing: $e,
      selectedSegmentIds: Q,
      activeSegmentId: (xe == null ? void 0 : xe.id) ?? null
    };
  }), he(() => {
    ie.poke();
  });
  const { toggleIncorrectExample: Bs, removeIncorrectExample: Us, captureTrainingExport: Ks, deleteRejectedSegments: mi, autoAssignPerformers: _s, previewDerivedSegments: zs, closeMaterializeDialog: Hs, materializeDerivedSegments: qs, saveTag: Ws, moveToBin: Vs, emptyRecyclingBin: Js } = Fu({
    acceptHistory: mo,
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
    lineage: uo,
    materializeButtonRef: Hn,
    materializePreview: kt,
    materializeRestoreFocusRef: qn,
    materializing: cn,
    mutateSegment: Es,
    onConflict: N,
    onDetailChange: t,
    onReload: x,
    performerSlots: Tt,
    cancelSaveTasks: ue,
    dispatchPendingChanges: H,
    enqueueSave: De,
    stableSaveIdentity: be,
    pendingChanges: Se,
    runSegmentMutation: Ms,
    recordHistoryAction: Ar,
    refreshMaterializationPreview: gn,
    removingExampleId: Wn,
    revealSegmentGroupForSelection: oi,
    savingSegmentId: ve,
    segmentGroups: Wt,
    segments: wt,
    selectedSegment: xe,
    selectedSegmentIdRef: P,
    selectedSegments: rn,
    selectionAnchorIdRef: L,
    selectionRangeBaseIdsRef: $,
    setAutoAssignError: Dt,
    setAutoAssignOpen: Ie,
    setAutoAssigning: He,
    setEditorFilters: D,
    setExportingExamples: kr,
    setHideDerivedSegments: q,
    setIncorrectExamples: kn,
    setMaterializeError: zn,
    setMaterializeLoading: St,
    setMaterializeOpen: dt,
    setMaterializePreview: bt,
    setMaterializing: tn,
    setRemovingExampleId: ro,
    setRejectedDeletionPreview: lt,
    setSaveMessage: le,
    acquireSaveLock: de,
    setSelectedSegmentGroupKey: je,
    setSelectedSegmentId: E,
    setSelectedSegmentIds: V,
    swimlanes: Rt,
    video: st
  }), { restoreHistoryTarget: Ys, updateTimelineRatio: gi, handleSeparatorPointerDown: Qs, handleSeparatorPointerMove: Xs, handleSeparatorKeyDown: Zs, panelWidthMaximum: pi, panelSeparatorProps: el, toggleSegmentRail: tl, toggleSegmentGroup: fi, mutateShotBoundary: nl } = Gu({
    acceptHistory: mo,
    compatibilityMode: d,
    currentTime: Y,
    detail: e,
    editorLayout: O,
    focusRowRef: Xn,
    history: v,
    historyRef: ne,
    historySaving: Fe,
    horizontalLayoutSize: Ne,
    mediaStackHeight: C,
    mediaStackRef: Qn,
    commonActionsRef: mn,
    onDetailChange: t,
    onReload: x,
    railToggleRef: Zn,
    recordHistoryAction: Ar,
    savingSegmentId: ve,
    setCollapsedSegmentGroups: Me,
    setEditorLayout: X,
    setHistorySaving: Re,
    setIncorrectExamples: kn,
    setSaveMessage: le,
    acquireSaveLock: de,
    enqueueSave: De,
    getSaveQueueSnapshot: ke,
    shotBoundaries: $n,
    timelineDuration: Mr,
    video: st,
    workspaceRef: Ut
  }), { executeShortcutById: yi, stepVideoFrame: rl } = Bu({
    allSwimlanes: ct,
    displayedSelectedSegment: et,
    applyShortcutTiming: Os,
    centerTimelineRef: Nr,
    compatibilityMode: d,
    createSegment: ai,
    currentTime: Y,
    deleteRejectedSegments: mi,
    duplicateSegment: li,
    editorLayout: O,
    editorRef: $t,
    emptyRecyclingBin: Js,
    lineage: uo,
    mediaDuration: ni,
    mergeSelectedSwimlane: ui,
    moveToBin: Vs,
    mutateShotBoundary: nl,
    openPublishApprovedDialog: di,
    playbackControlsRef: Yn,
    playbackShortcutConfig: Is,
    saveSelectedReviewState: js,
    seekRef: Jn,
    segmentGroupKeys: so,
    selectSegment: ii,
    selectedSegment: xe,
    selectedSegmentGroupForSegment: An,
    selectedSegmentGroupKey: Qe,
    selectedSegments: rn,
    setCollapsedSegmentGroups: Me,
    setIncorrectExamplesOpen: Ke,
    setQuickSearchOpen: Te,
    setSaveMessage: le,
    setSelectedSegmentGroupKey: je,
    setTagEditing: Pe,
    setTimelineZoom: G,
    shotBoundaries: $n,
    slotButtonRef: Ir,
    splitSegment: si,
    swimlanes: Rt,
    timelineDuration: Mr,
    toggleIncorrectExample: Bs,
    toggleSegmentGroup: fi,
    updateTimelineRatio: gi,
    videoFrameRate: fn,
    visibleSegments: Yt
  });
  Nn.current = yi;
  const ol = qe(() => yr.map((M) => ({
    id: M.id,
    enabled: Bn(M, d),
    surface: "local",
    action: (oe) => {
      var _e;
      return (_e = Nn.current) == null ? void 0 : _e.call(Nn, M.id, oe);
    }
  })), [d]);
  aa(Oo, ol);
  const il = Lo(C), al = bn(O.markerRailWidth, pi("markerRailWidth")), sl = bn(O.detailWidth, pi("detailWidth"));
  return r(Pu, {
    activeFilterCount: jt,
    allSwimlanes: ct,
    approvalFacetCounts: W,
    autoAssignCandidates: Tn,
    autoAssignError: vt,
    autoAssignOpen: Ue,
    autoAssignPerformers: _s,
    autoAssigning: Bt,
    canMoveSelectionToBin: Qo,
    captureTrainingExport: Ks,
    cancelQueuedReviewsForSegments: Fs,
    removeIncorrectExample: Us,
    rejectedDeletionPreview: xt,
    centerTimelineRef: Nr,
    closeEditorFilters: ao,
    closeFirstSegmentTagDialog: io,
    closeMaterializeDialog: Hs,
    closeMergeConfirmation: Ls,
    closePublishApprovedDialog: ci,
    closeTagEditing: Rn,
    collapsedSegmentGroups: Oe,
    commonActionsRef: mn,
    compatibilityMode: d,
    configuringTag: vr,
    createSegment: ai,
    currentTime: Y,
    deleteRejectedSegments: mi,
    detail: e,
    detailPanelRef: S,
    detailWidth: sl,
    duplicateSegment: li,
    editorFilters: k,
    editorLayout: O,
    editorRef: $t,
    exportingExamples: wn,
    filtersButtonRef: er,
    filtersOpen: B,
    firstSegmentTagOpen: pt,
    focusRowRef: Xn,
    handleSeparatorKeyDown: Zs,
    handleSeparatorPointerDown: Qs,
    handleSeparatorPointerMove: Xs,
    hideDerivedSegments: T,
    history: v,
    historyOpen: se,
    historySaving: Fe,
    hasNextUnreviewed: ws,
    hasPreviousUnreviewed: ks,
    horizontalLayoutSize: Ne,
    importNativeSegments: nt,
    incorrectExamples: un,
    incorrectExamplesOpen: Ze,
    removingExampleId: Wn,
    lineage: uo,
    markerRailWidth: al,
    materializeButtonRef: Hn,
    materializeCancelButtonRef: xr,
    materializeDerivedSegments: qs,
    materializeError: _n,
    materializeLoading: qt,
    materializeOpen: Ce,
    materializePreview: kt,
    materializing: cn,
    mediaStackRef: Qn,
    mergeCancelButtonRef: ht,
    mergeConfirmation: Le,
    mergeSaving: Oc(ae, "merge"),
    mergeSelectedSwimlane: ui,
    nativeImportState: Ee,
    onNavigate: u,
    onDetailChange: t,
    openPublishApprovedDialog: di,
    onReload: x,
    onSlotsChanged: a,
    panelSeparatorProps: el,
    pendingInitialSeekRef: wr,
    performerSlots: Tt,
    performerSlotsAvailable: Rr,
    playbackControlsRef: Yn,
    previewDerivedSegments: zs,
    provenance: Cs,
    provenanceSources: Ve,
    publishApprovedCancelButtonRef: me,
    publishApprovedDrafts: Ps,
    publishApprovedError: z,
    publishApprovedOpen: Xe,
    quickSearchOpen: Ae,
    railScrollRef: nr,
    railToggleRef: Zn,
    recordHistoryAction: Ar,
    restoreHistoryTarget: Ys,
    runEditorAction: yi,
    stepVideoFrame: rl,
    saveMessage: we,
    setSaveMessage: le,
    saveTag: Ws,
    saveTiming: Ds,
    savingSegmentId: ve,
    selectionBusy: ys,
    editorHeldByOtherWork: bs,
    segmentCreationPending: hs,
    acquireSaveLock: de,
    seekRef: Jn,
    segmentGroups: Wt,
    segmentRailLayout: or,
    segments: nn,
    selectAllVideoSegments: Rs,
    selectSegment: ii,
    selectSegmentCollection: Ts,
    selectedGroups: ti,
    selectedPerformerSlots: ei,
    selectedSegment: et,
    selectedSegmentGroupKey: Qe,
    selectedSegmentIds: Q,
    selectedSegments: rn,
    selectedSlotStatus: Ss,
    setAutoAssignError: Dt,
    setAutoAssignOpen: Ie,
    setConfiguringTag: Sr,
    setCurrentTime: j,
    setEditorFilters: D,
    setEditorLayout: X,
    setFiltersOpen: U,
    setHideDerivedSegments: q,
    setHistoryOpen: J,
    setIncorrectExamplesOpen: Ke,
    setQuickSearchOpen: Te,
    setRejectedDeletionPreview: lt,
    setRailViewport: Cn,
    setSelectedSegmentGroupKey: je,
    setSelectedSegmentId: E,
    setShortcutsOpen: We,
    setTimelineZoom: G,
    shotBoundaries: $n,
    shortcutsOpen: tt,
    slotButtonRef: Ir,
    splitLayout: s,
    splitSegment: si,
    tagEditing: $e,
    creatingSegmentId: gt,
    tagSearchRef: Cr,
    timelineDuration: Mr,
    timelineRatioBounds: il,
    timelineZoom: b,
    toggleSegmentGroup: fi,
    toggleSegmentRail: tl,
    updateTimelineRatio: gi,
    video: st,
    videoPerformers: pn,
    visibleCounts: En,
    visibleSegmentRailRows: xs,
    visibleSegments: Yt,
    wideLayout: Vn,
    workspaceRef: Ut
  });
}
function Vu(e = [], t = []) {
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
function Ju(e = [], t = "", n = "all") {
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
function Yu(e = [], t = []) {
  var h;
  const n = /* @__PURE__ */ new Map();
  [...t].sort((g, y) => (g.sortOrder ?? 0) - (y.sortOrder ?? 0) || Number(g.id) - Number(y.id)).forEach((g, y) => {
    [...g.tags || []].sort((x, N) => (x.sortOrder ?? 0) - (N.sortOrder ?? 0) || Number(x.tagId) - Number(N.tagId)).forEach((x, N) => n.set(Number(x.tagId), {
      key: `group:${g.id}`,
      id: g.id,
      name: g.name,
      sortOrder: g.sortOrder ?? y,
      tagSortOrder: x.sortOrder ?? N
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(g, y) {
    const x = Number(g);
    if (!o.has(x)) {
      const N = n.get(x);
      o.set(x, {
        tagId: x,
        name: y || `Tag ${x}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (N == null ? void 0 : N.key) || "ungrouped",
        segmentGroupId: (N == null ? void 0 : N.id) ?? null,
        segmentGroupName: (N == null ? void 0 : N.name) || "Ungrouped",
        segmentGroupSortOrder: (N == null ? void 0 : N.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (N == null ? void 0 : N.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(x);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((g) => {
    const y = i(g.sourceTagId, g.sourceTagName), x = i(g.derivedTagId, g.derivedTagName);
    y.outgoingRuleCount++, x.incomingRuleCount++;
    const N = `${y.tagId}:${x.tagId}`;
    a.has(N) || a.set(N, {
      id: N,
      sourceTagId: y.tagId,
      derivedTagId: x.tagId,
      rules: [],
      edgeCount: 0
    });
    const p = a.get(N);
    p.rules.push(g), p.edgeCount += Number(g.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((g) => [g.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((g) => {
    var y, x;
    (y = d.get(g.sourceTagId)) == null || y.add(g.derivedTagId), (x = d.get(g.derivedTagId)) == null || x.add(g.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), u = [];
  for (const g of s) {
    if (c.has(g.tagId)) continue;
    const y = [g.tagId], x = [];
    for (c.add(g.tagId); y.length > 0; ) {
      const L = y.shift();
      x.push(L);
      for (const $ of d.get(L) || [])
        c.has($) || (c.add($), y.push($));
    }
    const N = new Set(x), p = x.map((L) => o.get(L)), E = l.filter((L) => N.has(L.sourceTagId) && N.has(L.derivedTagId)), Q = E.flatMap((L) => L.rules), V = p.filter((L) => L.outgoingRuleCount === 0).sort((L, $) => It(L.name, $.name)), P = V.length > 0 ? V : [...p].sort((L, $) => It(L.name, $.name));
    u.push({
      id: [...x].sort((L, $) => L - $).join(":"),
      label: P.length > 1 ? `${P[0].name} + ${P.length - 1}` : ((h = P[0]) == null ? void 0 : h.name) || "Derivation component",
      nodes: p,
      connections: E,
      rules: Q,
      segmentGroupKeys: [...new Set(p.map((L) => L.segmentGroupKey))],
      materializedEdgeCount: Q.reduce(
        (L, $) => L + (Number($.edgeCount) || 0),
        0
      )
    });
  }
  u.sort((g, y) => y.rules.length - g.rules.length || It(g.label, y.label));
  const m = /* @__PURE__ */ new Map();
  s.forEach((g) => {
    m.has(g.segmentGroupKey) || m.set(g.segmentGroupKey, {
      key: g.segmentGroupKey,
      id: g.segmentGroupId,
      name: g.segmentGroupName,
      sortOrder: g.segmentGroupSortOrder,
      nodes: [],
      ruleIds: /* @__PURE__ */ new Set(),
      componentIds: /* @__PURE__ */ new Set()
    }), m.get(g.segmentGroupKey).nodes.push(g);
  }), u.forEach((g) => {
    g.nodes.forEach((y) => {
      var x;
      return (x = m.get(y.segmentGroupKey)) == null ? void 0 : x.componentIds.add(g.id);
    }), g.rules.forEach((y) => {
      var x, N;
      (x = m.get(o.get(Number(y.sourceTagId)).segmentGroupKey)) == null || x.ruleIds.add(y.id), (N = m.get(o.get(Number(y.derivedTagId)).segmentGroupKey)) == null || N.ruleIds.add(y.id);
    });
  });
  const f = [...m.values()].sort((g, y) => g.sortOrder - y.sortOrder || It(g.name, y.name)).map((g) => ({
    ...g,
    ruleCount: g.ruleIds.size,
    componentCount: g.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: u,
    segmentGroups: f
  };
}
function Qu(e, {
  minimumWidth: t = 720,
  minimumHeight: n = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const u = new Map(e.nodes.map((S) => [S.tagId, /* @__PURE__ */ new Set()])), m = new Map(e.nodes.map((S) => [S.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((S) => {
    var k, D;
    (k = u.get(S.sourceTagId)) == null || k.add(S.derivedTagId), (D = m.get(S.derivedTagId)) == null || D.add(S.sourceTagId);
  });
  const f = new Map(e.nodes.map((S) => {
    var k;
    return [
      S.tagId,
      ((k = m.get(S.tagId)) == null ? void 0 : k.size) || 0
    ];
  })), h = new Map(e.nodes.map((S) => [S.tagId, 0])), g = e.nodes.filter((S) => f.get(S.tagId) === 0).sort((S, k) => It(S.name, k.name)).map((S) => S.tagId), y = /* @__PURE__ */ new Set();
  for (; g.length > 0; ) {
    const S = g.shift();
    if (!y.has(S)) {
      y.add(S);
      for (const k of u.get(S) || [])
        h.set(k, Math.max(h.get(k) || 0, (h.get(S) || 0) + 1)), f.set(k, f.get(k) - 1), f.get(k) === 0 && g.push(k);
    }
  }
  y.size !== e.nodes.length && e.nodes.filter((S) => !y.has(S.tagId)).sort((S, k) => It(S.name, k.name)).forEach((S) => h.set(S.tagId, 0));
  const x = Math.max(0, ...h.values()), N = Math.max(
    t,
    240 + x * 296
  ), p = /* @__PURE__ */ new Map();
  e.nodes.forEach((S) => {
    p.has(S.segmentGroupKey) || p.set(S.segmentGroupKey, {
      key: S.segmentGroupKey,
      id: S.segmentGroupId,
      name: S.segmentGroupName,
      sortOrder: S.segmentGroupSortOrder,
      nodes: []
    }), p.get(S.segmentGroupKey).nodes.push(S);
  });
  const E = [...p.values()].sort((S, k) => S.sortOrder - k.sortOrder || It(S.name, k.name));
  let Q = 28;
  const V = [], P = E.map((S) => {
    const k = /* @__PURE__ */ new Map();
    S.nodes.forEach((q) => {
      const Y = h.get(q.tagId) || 0;
      k.has(Y) || k.set(Y, []), k.get(Y).push(q);
    });
    for (const q of k.values())
      q.sort((Y, j) => Y.segmentGroupTagSortOrder - j.segmentGroupTagSortOrder || It(Y.name, j.name));
    const D = Math.max(1, ...[...k.values()].map((q) => q.length)), B = D * 58 + (D - 1) * 18, U = 70 + B, T = {
      ...S,
      x: 12,
      y: Q,
      width: N - 24,
      height: U
    };
    for (const [q, Y] of k.entries()) {
      const j = Y.length * 58 + Math.max(0, Y.length - 1) * 18, Z = (B - j) / 2;
      Y.forEach((ie, ae) => V.push({
        ...ie,
        rank: q,
        x: 28 + q * 296,
        y: Q + 34 + 18 + Z + ae * 76,
        width: 184,
        height: 58
      }));
    }
    return Q += U + 16, T;
  }), L = new Map(V.map((S) => [S.tagId, S])), $ = e.connections.map((S) => {
    const k = L.get(S.sourceTagId), D = L.get(S.derivedTagId), B = k.x + k.width, U = k.y + k.height / 2, T = D.x, q = D.y + D.height / 2, Y = Math.max(48, (T - B) * 0.48);
    return {
      ...S,
      path: `M ${B} ${U} C ${B + Y} ${U}, ${T - Y} ${q}, ${T} ${q}`
    };
  });
  return {
    width: N,
    height: Math.max(n, Q - 16 + 28),
    nodes: V,
    connections: $,
    groups: P
  };
}
function Xu(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Qu(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), u = 20, m = o, f = c.nodes.map((g) => ({
      ...g,
      x: g.x + u,
      y: g.y + m
    })), h = new Map(f.map((g) => [g.tagId, g]));
    a.push(...f), l.push(...c.groups.map((g) => ({
      ...g,
      componentId: d.id,
      x: g.x + u,
      y: g.y + m
    }))), s.push(...c.connections.map((g) => {
      const y = h.get(g.sourceTagId), x = h.get(g.derivedTagId), N = y.x + y.width, p = y.y + y.height / 2, E = x.x, Q = x.y + x.height / 2, V = Math.max(48, (E - N) * 0.48);
      return {
        ...g,
        componentId: d.id,
        path: `M ${N} ${p} C ${N + V} ${p}, ${E - V} ${Q}, ${E} ${Q}`
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
function Zu(e, t, n) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !n && t[0] || null;
}
function fs(e) {
  const t = e == null ? void 0 : e.saved;
  return t != null && Number(e.sourceTagId) === Number(t.sourceTagId) && Number(e.derivedTagId) === Number(t.derivedTagId);
}
function em(e, t, n, o = "") {
  const i = {
    ...e,
    [`${t}TagId`]: n == null ? null : Number(n),
    [`${t}TagName`]: o || "",
    slotMappings: []
  };
  return fs(i) ? { ...i, slotMappings: i.saved.slotMappings } : i;
}
function Yr(e) {
  return !!(e != null && e.sourceSlotMissing || e != null && e.derivedSlotMissing);
}
function tm(e = []) {
  return e.filter((t) => (t.slotMappings || []).some(Yr)).sort((t, n) => It(
    `${t.sourceTagName} ${t.derivedTagName}`,
    `${n.sourceTagName} ${n.derivedTagName}`
  ));
}
function nm(e) {
  const { arrowMarkerId: t, busy: n, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: u, editorRef: m, emptyDraft: f, graph: h, layout: g, listSort: y, materializationOffer: x, materializeOutgoingRules: N, materializeRule: p, message: E, normalizedQuery: Q, query: V, refreshConfiguredTag: P, removeMissingSlotMappings: L, revealEditor: $, rules: S, rulesWithMissingSlots: k, save: D, segmentGroupKey: B, selectedNode: U, selectedRule: T, selection: q, setConfiguringTag: Y, setDraft: j, setListSort: Z, setMaterializationOffer: ie, setQuery: ae, setSegmentGroupKey: ve, setSelection: de, setView: De, sortedVisibleRules: be, sourceSlots: _, sourceSlotsLoading: ue, updateMapping: fe, updateTag: ke, view: Se, visibleComponents: H, visibleRules: we } = e;
  function le(O) {
    const X = h.nodes.find((ce) => ce.tagId === Number(O.sourceTagId)), C = h.nodes.find((ce) => ce.tagId === Number(O.derivedTagId));
    return (X == null ? void 0 : X.segmentGroupKey) === (C == null ? void 0 : C.segmentGroupKey) ? X.segmentGroupKey : "cross-group";
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
          onClick: () => j(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      r("div", { key: "tags", className: "space-y-3" }, [
        r("div", { key: "source", className: "space-y-2" }, [
          r("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            r("span", { key: "label" }, "Source tag (specific)"),
            r(mr, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (O, X) => ke("source", O, X == null ? void 0 : X.label),
              disabled: n,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.sourceTagId && !ue && _.length === 0 ? r("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            r("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            r("button", {
              key: "configure",
              type: "button",
              disabled: n,
              onClick: (O) => Y({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: O.currentTarget
              }),
              className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
            }, "Configure source tag")
          ]) : null
        ]),
        r("div", { key: "derived", className: "space-y-2" }, [
          r("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            r("span", { key: "label" }, "Derived tag (general)"),
            r(mr, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (O, X) => ke("derived", O, X == null ? void 0 : X.label),
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
              onClick: (O) => Y({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: O.currentTarget
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
            disabled: n || d.slotMappings.some((O) => !O.sourceSlotDefinitionId || !O.derivedSlotDefinitionId) || Lr(_, d.slotMappings, -1, "sourceSlotDefinitionId").length === 0 || Lr(s, d.slotMappings, -1, "derivedSlotDefinitionId").length === 0,
            onClick: () => j((O) => ({
              ...O,
              slotMappings: [...O.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
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
          ...d.slotMappings.map((O, X) => r("div", { key: X, className: "flex items-center gap-2" }, [
            r("select", {
              key: "source",
              value: O.sourceSlotDefinitionId,
              disabled: n,
              onChange: (C) => fe(X, "sourceSlotDefinitionId", C.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${X + 1}`
            }, [r("option", { key: "none", value: "" }, "Source slot…"), ...Lr(_, d.slotMappings, X, "sourceSlotDefinitionId").map((C) => r("option", { key: C.id, value: C.id }, Lt(C)))]),
            r("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            r("select", {
              key: "derived",
              value: O.derivedSlotDefinitionId,
              disabled: n,
              onChange: (C) => fe(X, "derivedSlotDefinitionId", C.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${X + 1}`
            }, [r("option", { key: "none", value: "" }, "Derived slot…"), ...Lr(s, d.slotMappings, X, "derivedSlotDefinitionId").map((C) => r("option", { key: C.id, value: C.id }, Lt(C)))]),
            r("button", {
              key: "remove",
              type: "button",
              disabled: n,
              onClick: () => j((C) => ({
                ...C,
                slotMappings: C.slotMappings.filter((ce, Ne) => Ne !== X)
              })),
              className: `${o} shrink-0 text-red-300`,
              "aria-label": `Remove performer slot mapping ${X + 1}`,
              title: "Remove mapping"
            }, "🗑")
          ]))
        ])
      ]),
      r("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        r("button", {
          key: "save",
          type: "button",
          disabled: n || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((O) => !O.sourceSlotDefinitionId || !O.derivedSlotDefinitionId),
          onClick: D,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        r("button", { key: "cancel", type: "button", disabled: n, onClick: () => j(null), className: o }, "Cancel")
      ])
    ]);
  }
  function F(O, X, C) {
    const ce = C ? "Deleted slot" : X || "Unnamed slot";
    return r("span", { key: O, className: `truncate ${C ? "italic text-amber-300" : "text-foreground"}`, title: ce }, ce);
  }
  function A() {
    if (k.length === 0) return null;
    const O = k.length;
    return r("div", { key: "missing-slots", role: "region", "aria-label": "Deleted performer slot mappings", className: "space-y-2 border-b border-amber-500/40 bg-amber-500/10 px-4 py-3" }, [
      r("div", { key: "summary", className: "flex flex-wrap items-start justify-between gap-3" }, [
        r("div", { key: "copy", className: "max-w-3xl" }, [
          r(
            "p",
            { key: "title", className: "text-sm font-medium text-foreground" },
            `${O} derivation rule${O === 1 ? " maps" : "s map"} performer slots that no longer exist`
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
          onClick: L,
          className: o
        }, "Remove missing mappings")
      ]),
      r(
        "ul",
        { key: "rules", className: "flex flex-wrap gap-2", "aria-label": "Rules with deleted performer slots" },
        k.map((X) => r("li", { key: X.id }, r("button", {
          type: "button",
          disabled: d != null,
          onClick: () => {
            ae(""), ve("all"), De("list"), de({ type: "rule", id: X.id });
          },
          className: "rounded-full border border-amber-500/40 px-2.5 py-0.5 text-xs text-foreground hover:bg-amber-500/15 disabled:opacity-50"
        }, [
          `${X.sourceTagName} → ${X.derivedTagName}`,
          r(
            "span",
            { key: "count", className: "ml-1.5 text-secondary" },
            `· ${X.slotMappings.filter(Yr).length} missing`
          )
        ])))
      )
    ]);
  }
  function I() {
    if (U) {
      const C = we.filter((te) => Number(te.derivedTagId) === U.tagId), ce = we.filter((te) => Number(te.sourceTagId) === U.tagId), Ne = (te, v, R) => r("div", {
        key: te.id,
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
            `${te.sourceTagName} → ${te.derivedTagName}`
          )
        ]),
        r("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          R ? r("button", {
            key: "materialize",
            type: "button",
            disabled: n || d != null,
            onClick: () => p(te),
            className: o
          }, "Materialize") : null,
          r("button", {
            key: "edit",
            type: "button",
            disabled: n || d != null,
            onClick: () => u(te, !0),
            className: o
          }, "Edit rule"),
          r("button", {
            key: "delete",
            type: "button",
            disabled: n || d != null,
            onClick: () => a(te),
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
          onClick: (te) => Y({
            tagId: U.tagId,
            tagName: U.name,
            trigger: te.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        ce.length ? r("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: n || d != null,
          onClick: () => N(U, ce),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${ce.length})`) : null,
        ce.length ? r("div", { key: "outgoing", className: "space-y-2" }, [
          r("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...ce.map((te) => Ne(te, "Derives", !0))
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
            C.map((te) => Ne(te, "Derived by", !1))
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
    const O = h.nodes.find((C) => C.tagId === Number(T.sourceTagId)), X = h.nodes.find((C) => C.tagId === Number(T.derivedTagId));
    return r("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      r("div", { key: "identity" }, [
        r("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          r("span", { key: "source" }, (O == null ? void 0 : O.segmentGroupName) || "Ungrouped"),
          (O == null ? void 0 : O.segmentGroupKey) !== (X == null ? void 0 : X.segmentGroupKey) ? r("span", { key: "derived" }, `→ ${(X == null ? void 0 : X.segmentGroupName) || "Ungrouped"}`) : null
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
      (x == null ? void 0 : x.ruleId) === T.id ? r("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => p(T, x),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          r("button", {
            key: "later",
            type: "button",
            disabled: n,
            onClick: () => ie(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      r("div", { key: "mappings", className: "space-y-2" }, [
        r("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        T.slotMappings.length === 0 ? r("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : T.slotMappings.map((C, ce) => r("div", {
          key: `${C.sourceSlotDefinitionId}:${C.derivedSlotDefinitionId}`,
          className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
        }, [
          F("source", C.sourceSlotLabel, C.sourceSlotMissing),
          r("span", { key: "arrow", className: "text-secondary" }, "→"),
          F("derived", C.derivedSlotLabel, C.derivedSlotMissing)
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
          onClick: () => p(T),
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
  function b() {
    if (H.length === 0)
      return r("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, Q ? "No derivation relationships match your search." : "No derivation rules.");
    const O = U == null ? void 0 : U.tagId, X = /* @__PURE__ */ new Set();
    return U && (X.add(U.tagId), g.connections.forEach((C) => {
      (C.sourceTagId === U.tagId || C.derivedTagId === U.tagId) && (X.add(C.sourceTagId), X.add(C.derivedTagId));
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
        style: { width: `${g.width}px`, height: `${g.height}px` },
        "aria-label": "Derivation rule graph"
      }, [
        ...g.groups.map((C) => r("div", {
          key: `group:${C.componentId}:${C.key}`,
          className: `absolute rounded-xl border ${B === C.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
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
          width: g.width,
          height: g.height,
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
          ...g.connections.map((C) => {
            const ce = O === C.sourceTagId || O === C.derivedTagId, Ne = U != null, te = ce ? "var(--color-accent)" : "var(--color-secondary)";
            return r("path", {
              key: `${C.id}:visible`,
              d: C.path,
              fill: "none",
              stroke: te,
              strokeWidth: ce ? 2.5 : 1.5,
              opacity: Ne && !ce ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...g.nodes.map((C) => {
          const ce = !Q || C.name.toLocaleLowerCase().includes(Q), Ne = U != null, te = X.has(C.tagId), v = (U == null ? void 0 : U.tagId) === C.tagId;
          return r("button", {
            key: `node:${C.tagId}`,
            type: "button",
            onClick: () => de({ type: "node", id: C.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${v ? "border-accent bg-accent/15 ring-2 ring-accent/25" : te ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${C.x}px`,
              top: `${C.y}px`,
              width: `${C.width}px`,
              height: `${C.height}px`,
              opacity: !ce || Ne && !te ? 0.62 : 1
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
        ...g.connections.filter((C) => C.rules.length > 1).map((C) => {
          const ce = g.nodes.find((te) => te.tagId === C.sourceTagId), Ne = g.nodes.find((te) => te.tagId === C.derivedTagId);
          return r("div", {
            key: `bundle:${C.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(ce.x + ce.width + Ne.x) / 2 - 24}px`,
              top: `${(ce.y + ce.height / 2 + Ne.y + Ne.height / 2) / 2 - 10}px`
            },
            "aria-label": `${C.rules.length} rules connect ${C.rules[0].sourceTagName} to ${C.rules[0].derivedTagName}`
          }, `${C.rules.length} rules`);
        })
      ])
    ]);
  }
  function G() {
    if (H.length === 0)
      return r(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        Q ? "No derivation relationships match your search." : "No derivation rules."
      );
    const O = /* @__PURE__ */ new Map();
    be.forEach((C) => {
      const ce = le(C);
      O.has(ce) || O.set(ce, []), O.get(ce).push(C);
    });
    const X = [
      ...h.segmentGroups.map((C) => C.key),
      "cross-group"
    ].filter((C) => O.has(C));
    return r("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, X.map((C) => {
      const ce = h.segmentGroups.find((v) => v.key === C), Ne = C === "cross-group" ? "Cross-group relationships" : (ce == null ? void 0 : ce.name) || "Ungrouped", te = O.get(C);
      return r("section", { key: C, "aria-label": Ne }, [
        r("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          r("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, Ne),
          r(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${te.length} rule${te.length === 1 ? "" : "s"}`
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
          ...te.map((v) => r("button", {
            key: v.id,
            type: "button",
            role: "row",
            onClick: () => de({ type: "rule", id: v.id }),
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
              v.slotMappings.some(Yr) ? r("span", { key: "missing", className: "ml-1.5 text-amber-300", title: "Maps a deleted performer slot" }, "⚠") : null
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
          `${S.length} rules · ${h.nodes.length} tags`
        )
      ]),
      r("button", {
        key: "add",
        type: "button",
        disabled: n || d != null,
        onClick: () => {
          j(f()), de(null), $();
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
          value: V,
          onChange: (O) => {
            ae(O.target.value), de(null);
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
          value: B,
          disabled: d != null,
          onChange: (O) => {
            ve(O.target.value), de(null), j(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          r("option", { key: "all", value: "all" }, "All Segment groups"),
          ...h.segmentGroups.map((O) => r("option", { key: O.key, value: O.key }, O.name))
        ])
      ]),
      Se === "list" ? r("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        r("span", { key: "label" }, "Sort"),
        r("select", {
          key: "select",
          value: y,
          onChange: (O) => Z(O.target.value),
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
        ].map(([O, X]) => r("button", {
          key: O,
          type: "button",
          onClick: () => {
            De(O), O === "graph" && (q == null ? void 0 : q.type) === "rule" && de(null);
          },
          "aria-pressed": Se === O,
          className: `rounded px-3 py-1.5 text-sm font-medium ${Se === O ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
        }, X))
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
        Se === "graph" ? b() : G()
      ),
      r("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        r("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? w() : I()
      ])
    ])),
    r("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      E ? r("p", { key: "message", role: "status", className: "text-sm text-secondary" }, E) : null
    ]),
    i ? r(Jo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => P(i),
      onClose: () => {
        const O = i.trigger;
        Y(null), requestAnimationFrame(() => {
          O != null && O.isConnected && O.focus();
        });
      }
    }) : null
  ]);
}
function rm({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const n = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: []
  }), [o, i] = K([]), [a, s] = K(null), [l, d] = K([]), [c, u] = K([]), [m, f] = K(!1), [h, g] = K(!1), [y, x] = K(!1), [N, p] = K(""), [E, Q] = K(""), [V, P] = K("graph"), [L, $] = K("all"), [S, k] = K(null), [D, B] = K("relationship"), [U, T] = K(null), [q, Y] = K(null), j = pe(null), Z = pe(null), ie = Ba().replace(/:/g, "");
  function ae() {
    requestAnimationFrame(() => {
      var v;
      return (v = j.current) == null ? void 0 : v.scrollIntoView({ block: "nearest" });
    });
  }
  async function ve(v) {
    const R = await re("/derivation-rules", v ? { signal: v } : void 0);
    i(R || []);
  }
  he(() => {
    const v = new AbortController();
    return ve(v.signal).catch((R) => {
      R.name !== "AbortError" && p(R.message || "Unable to load derived segment rules.");
    }), () => v.abort();
  }, []), he(() => {
    const v = new AbortController();
    return a != null && a.sourceTagId ? (f(!0), re(`/slot-definitions/${a.sourceTagId}`, { signal: v.signal }).then((R) => d(R.definitions || [])).catch((R) => {
      R.name !== "AbortError" && d([]);
    }).finally(() => {
      v.signal.aborted || f(!1);
    })) : (d([]), f(!1)), a != null && a.derivedTagId ? (g(!0), re(`/slot-definitions/${a.derivedTagId}`, { signal: v.signal }).then((R) => u(R.definitions || [])).catch((R) => {
      R.name !== "AbortError" && u([]);
    }).finally(() => {
      v.signal.aborted || g(!1);
    })) : (u([]), g(!1)), () => v.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), he(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || fs(a) || m || h)
      return;
    const v = `${a.sourceTagId}:${a.derivedTagId}`;
    Z.current !== v && (Z.current = v, s((R) => !R || Number(R.sourceTagId) !== Number(a.sourceTagId) || Number(R.derivedTagId) !== Number(a.derivedTagId) ? R : mc(R, l, c)));
  }, [
    a == null ? void 0 : a.saved,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    m,
    h
  ]);
  function de(v, R = !1) {
    R || k({ type: "rule", id: v.id }), Z.current = null, d([]), u([]), f(!0), g(!0);
    const ne = v.slotMappings.filter((se) => !Yr(se)).map((se) => ({
      sourceSlotDefinitionId: se.sourceSlotDefinitionId,
      derivedSlotDefinitionId: se.derivedSlotDefinitionId
    }));
    s({
      ruleId: v.id,
      sourceTagId: v.sourceTagId,
      sourceTagName: v.sourceTagName,
      derivedTagId: v.derivedTagId,
      derivedTagName: v.derivedTagName,
      slotMappings: ne,
      missingSlotMappingCount: v.slotMappings.length - ne.length,
      saved: { sourceTagId: v.sourceTagId, derivedTagId: v.derivedTagId, slotMappings: ne }
    }), p(""), ae();
  }
  function De(v, R, ne = "") {
    Z.current = null, v === "source" ? (d([]), f(R != null)) : (u([]), g(R != null)), s((se) => em(se, v, R, ne));
  }
  async function be(v) {
    Z.current = null;
    const R = [ve(), t == null ? void 0 : t()];
    return v.draftKind === "source" ? (f(!0), R.push(re(`/slot-definitions/${v.tagId}`).then((ne) => d(ne.definitions || [])).finally(() => f(!1)))) : v.draftKind === "derived" && (g(!0), R.push(re(`/slot-definitions/${v.tagId}`).then((ne) => u(ne.definitions || [])).finally(() => g(!1)))), Promise.all(R);
  }
  function _(v, R, ne) {
    s((se) => ({
      ...se,
      slotMappings: se.slotMappings.map((J, Fe) => Fe === v ? { ...J, [R]: ne } : J)
    }));
  }
  async function ue() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const v = ta(a, o);
    if (v) {
      p(v.message);
      return;
    }
    if (a.slotMappings.some((R) => !R.sourceSlotDefinitionId || !R.derivedSlotDefinitionId)) {
      p("Complete or remove every performer slot mapping before saving.");
      return;
    }
    x(!0), p(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let R = null;
      if (a.ruleId != null) {
        const se = await re(
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
      p("Saving derived segment rule…");
      const ne = await re("/derivation-rules", {
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
      if (await ve(), k(V === "graph" ? { type: "node", id: Number(ne.sourceTagId) } : { type: "rule", id: ne.id }), s(null), a.ruleId == null)
        try {
          const se = await re(
            `/derivation-rules/${ne.id}/materialization/preview`,
            { method: "POST" }
          );
          T(
            se.createCount + se.linkCount > 0 ? se : null
          ), p(se.createCount + se.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          T(null), p("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        T(null), p("Derived segment rule saved. Previous materializations were removed.");
    } catch (R) {
      p(R.message || "Unable to save derived segment rule.");
    } finally {
      x(!1);
    }
  }
  async function fe() {
    x(!0), p("Removing mappings to deleted performer slots…");
    try {
      const v = await re("/derivation-rules/missing-slot-mappings/remove", { method: "POST" });
      await ve();
      const R = Number(v == null ? void 0 : v.repairedRuleCount) || 0;
      p(R === 0 ? "No derivation rule maps a deleted performer slot." : `Removed mappings to deleted performer slots from ${R} derivation rule${R === 1 ? "" : "s"}.`);
    } catch (v) {
      p(v.message || "Unable to remove mappings to deleted performer slots.");
    } finally {
      x(!1);
    }
  }
  async function ke(v) {
    x(!0), p("Previewing rule deletion…");
    try {
      const R = await re(
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
      const ne = `derivation-rule-delete:${v.id}:${R.fingerprint}`;
      await re(`/derivation-rules/${v.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(ne),
          fingerprint: R.fingerprint
        })
      }), Ye(ne), await ve(), (a == null ? void 0 : a.ruleId) === v.id && s(null), (S == null ? void 0 : S.type) === "rule" && S.id === v.id && k(null), (U == null ? void 0 : U.ruleId) === v.id && T(null), p(`Rule deleted with ${R.deletedSegmentCount} exclusively derived segment${R.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (R) {
      p(R.message || "Unable to delete derived segment rule.");
    } finally {
      x(!1);
    }
  }
  async function Se(v, R = null) {
    const ne = R || await re(
      `/derivation-rules/${v.id}/materialization/preview`,
      { method: "POST" }
    );
    if (ne.createCount + ne.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const se = `derivation-rule-materialize:${v.id}:${ne.fingerprint}`, J = await re(`/derivation-rules/${v.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Je(se),
        fingerprint: ne.fingerprint
      })
    });
    return Ye(se), J;
  }
  async function H(v, R = null) {
    x(!0), p("Finding pending derivations…");
    try {
      const ne = await Se(v, R);
      if (T(null), await ve(), ne.createdCount + ne.linkedCount === 0) {
        p("Every applicable derivation is already materialized.");
        return;
      }
      p(
        `${ne.createdCount} derived segment${ne.createdCount === 1 ? "" : "s"} created and ${ne.linkedCount} existing segment${ne.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (ne) {
      p(ne.message || "Unable to materialize pending derivations.");
    } finally {
      x(!1);
    }
  }
  async function we(v, R) {
    if (R.length === 0) return;
    x(!0), p(`Finding pending derivations from ${v.name}…`);
    let ne = 0, se = 0;
    try {
      for (const J of R) {
        const Fe = await Se(J);
        ne += Fe.createdCount, se += Fe.linkedCount;
      }
      T(null), await ve(), p(ne + se === 0 ? `Every outgoing derivation from ${v.name} is already materialized.` : `${ne} derived segment${ne === 1 ? "" : "s"} created and ${se} existing segment${se === 1 ? "" : "s"} linked from ${v.name}.`);
    } catch (J) {
      await ve().catch(() => {
      }), p(J.message || `Unable to materialize derivations from ${v.name}.`);
    } finally {
      x(!1);
    }
  }
  const le = ta(a, o), w = qe(() => tm(o), [o]), F = qe(
    () => Yu(o, e),
    [o, e]
  ), A = E.trim().toLocaleLowerCase(), b = F.components.filter((v) => L === "all" || v.segmentGroupKeys.includes(L)).filter((v) => !A || v.nodes.some((R) => R.name.toLocaleLowerCase().includes(A))), G = b.flatMap((v) => v.rules), O = new Set(
    b.flatMap((v) => v.nodes.map((R) => R.tagId))
  ), X = qe(
    () => Xu(b),
    [b]
  ), C = V === "list" ? Zu(
    S,
    G,
    A.length > 0
  ) : null, ce = (S == null ? void 0 : S.type) === "node" && F.nodes.find((v) => v.tagId === S.id && O.has(v.tagId)) || null, Ne = [...G].sort((v, R) => D === "source" ? It(v.sourceTagName, R.sourceTagName) || It(v.derivedTagName, R.derivedTagName) : D === "target" ? It(v.derivedTagName, R.derivedTagName) || It(v.sourceTagName, R.sourceTagName) : D === "materialized" ? (Number(R.edgeCount) || 0) - (Number(v.edgeCount) || 0) || It(v.sourceTagName, R.sourceTagName) : It(
    `${v.sourceTagName} ${v.derivedTagName}`,
    `${R.sourceTagName} ${R.derivedTagName}`
  ));
  return r(nm, {
    arrowMarkerId: ie,
    busy: y,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: q,
    deleteRule: ke,
    derivedSlots: c,
    derivedSlotsLoading: h,
    draft: a,
    draftIssue: le,
    editRule: de,
    editorRef: j,
    emptyDraft: n,
    graph: F,
    layout: X,
    listSort: D,
    materializationOffer: U,
    materializeOutgoingRules: we,
    materializeRule: H,
    message: N,
    normalizedQuery: A,
    query: E,
    refreshConfiguredTag: be,
    removeMissingSlotMappings: fe,
    revealEditor: ae,
    rules: o,
    rulesWithMissingSlots: w,
    save: ue,
    segmentGroupKey: L,
    selectedNode: ce,
    selectedRule: C,
    selection: S,
    setConfiguringTag: Y,
    setDraft: s,
    setListSort: B,
    setMaterializationOffer: T,
    setQuery: Q,
    setSegmentGroupKey: $,
    setSelection: k,
    setView: P,
    sortedVisibleRules: Ne,
    sourceSlots: l,
    sourceSlotsLoading: m,
    updateMapping: _,
    updateTag: De,
    view: V,
    visibleComponents: b,
    visibleRules: G
  });
}
function om() {
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
function im({ active: e, segmentGroups: t, onSegmentGroupsChanged: n }) {
  const [o, i] = K([]), [a, s] = K(!1), [l, d] = K(!1), [c, u] = K(""), [m, f] = K(""), [h, g] = K("all"), [y, x] = K(() => /* @__PURE__ */ new Set()), [N, p] = K(null);
  he(() => {
    if (!e || a) return;
    const T = new AbortController();
    return d(!0), u(""), re("/slot-definitions", { signal: T.signal }).then((q) => {
      i(q || []), s(!0);
    }).catch((q) => {
      q.name !== "AbortError" && u(q.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      T.signal.aborted || d(!1);
    }), () => T.abort();
  }, [e, a]);
  async function E() {
    d(!0), u("");
    try {
      const T = await re("/slot-definitions");
      i(T || []), s(!0);
    } catch (T) {
      u(T.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function Q() {
    const [T] = await Promise.all([
      re("/slot-definitions"),
      n == null ? void 0 : n()
    ]);
    i(T || []), s(!0), u("");
  }
  function V() {
    const T = N == null ? void 0 : N.trigger;
    p(null), requestAnimationFrame(() => {
      T != null && T.isConnected && T.focus({ preventScroll: !0 });
    });
  }
  function P(T) {
    x((q) => {
      const Y = new Set(q);
      return Y.has(T) ? Y.delete(T) : Y.add(T), Y;
    });
  }
  const L = qe(
    () => Vu(t, o),
    [t, o]
  ), $ = qe(
    () => Ju(L, m, h),
    [L, m, h]
  ), S = L.flatMap((T) => T.tags), k = S.filter((T) => T.definitions.length > 0).length, D = S.length - k, B = [
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
        `${S.length} tags · ${k} with slots · ${D} without slots`
      ) : null
    ]),
    r("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      r("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        r("span", { key: "label" }, "Search"),
        r("input", {
          key: "input",
          type: "search",
          value: m,
          onChange: (T) => f(T.target.value),
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
          B.map(([T, q]) => r("button", {
            key: T,
            type: "button",
            onClick: () => g(T),
            "aria-pressed": h === T,
            className: `rounded px-3 py-1.5 text-xs font-medium ${h === T ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, q))
        )
      ]),
      r("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        r("button", {
          key: "expand",
          type: "button",
          onClick: () => x(/* @__PURE__ */ new Set()),
          className: U
        }, "Expand all"),
        r("button", {
          key: "collapse",
          type: "button",
          onClick: () => x(new Set(L.map((T) => T.overviewKey))),
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
        onClick: E,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && $.length === 0 ? r(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? r("div", { key: "groups", className: "space-y-3" }, $.map((T) => {
      const q = y.has(T.overviewKey), Y = T.tags.filter((j) => j.definitions.length > 0).length;
      return r("article", {
        key: T.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        r("button", {
          key: "header",
          type: "button",
          onClick: () => P(T.overviewKey),
          "aria-expanded": !q,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          r("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, q ? "▸" : "▾"),
          r("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, T.name),
          r(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${T.tags.length} tag${T.tags.length === 1 ? "" : "s"} · ${Y} with slots`
          )
        ]),
        q ? null : r(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          T.tags.map((j) => r("li", {
            key: j.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            r("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              r("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: j.tagName }, j.tagName),
              j.allowSamePerformerInMultipleSlots ? r(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            j.definitions.length === 0 ? r("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : r("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${j.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, j.definitions.map((Z) => r("li", {
              key: Z.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              r("span", { key: "label", className: "font-medium text-foreground" }, Lt(Z)),
              ...(Z.genderHints || []).map((ie) => r("span", {
                key: ie,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, Zr(ie)))
            ]))),
            r("button", {
              key: "edit",
              type: "button",
              onClick: (Z) => p({
                tagId: j.tagId,
                tagName: j.tagName,
                trigger: Z.currentTarget
              }),
              "aria-label": `Edit performer slots for ${j.tagName}`,
              className: `${U} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    N ? r(Jo, {
      key: `performer-slots-configure:${N.tagId}`,
      tagId: N.tagId,
      tagName: N.tagName,
      onSaved: Q,
      onClose: V
    }) : null
  ]);
}
function am({ onNavigate: e, profile: t, onProfileChange: n }) {
  const [o, i] = K("general"), [a, s] = K([]), [l, d] = K(!1), [c, u] = K(""), [m, f] = K(va), h = fd(t), g = h.map(([p]) => p);
  he(() => {
    g.includes(o) || i(g[0] || "general");
  }, [t.effectiveMode]);
  async function y(p) {
    const E = await re("/segment-groups", p ? { signal: p } : void 0);
    s(E || []);
  }
  he(() => {
    const p = new AbortController();
    return y(p.signal).catch((E) => {
      E.name !== "AbortError" && u(E.message || "Unable to load tag groups.");
    }), () => p.abort();
  }, []);
  async function x(p) {
    if (p !== t.requestedMode) {
      d(!0), u("");
      try {
        const E = await re(
          `/preferences/transition?mode=${encodeURIComponent(p)}`
        );
        let Q = !1, V = null, P = null, L = null, $ = !1;
        if (t.requestedMode === "basic" && p === "full") {
          if (!window.confirm(hd(
            E.recyclingBinCount,
            E.protectedRecyclingBinCount
          )))
            return;
          $ = !0, E.recyclingBinCount > 0 && (Q = !0, L = E.recyclingBinFingerprint, V = `mode-switch-empty-bin:${L}`, P = Je(V));
        }
        let S = !1;
        if (t.requestedMode === "full" && p === "basic") {
          if (!window.confirm(bd(
            E.extensionOwnedSegmentCount
          )))
            return;
          S = !0;
        }
        const k = await re("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: p,
            confirmHiddenExtensionOwnedSegments: S,
            confirmBasicHistoryCleanup: $,
            emptyRecyclingBin: Q,
            operationId: P,
            expectedRecyclingBinFingerprint: L
          })
        });
        V && Ye(V), n == null || n($a(k)), u("Workflow mode saved.");
      } catch (E) {
        u(E.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  const N = { page: "segment-studio" };
  return r("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    r("a", { key: "back", href: "/segment-studio", onClick: (p) => ds(p, e, N), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      h.map(([p, E]) => r("button", {
        key: p,
        type: "button",
        onClick: () => i(p),
        "aria-current": o === p ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === p ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, E))
    ),
    r(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      r(om)
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
      r(bu, {
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
          checked: m,
          onChange: (p) => {
            const E = p.target.checked;
            Sa(E), f(E);
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
    g.includes("derivation") ? r(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      r(rm, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => y()
      })
    ) : null,
    g.includes("performer-slots") ? r(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      r(im, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => y()
      })
    ) : null,
    c ? r("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function sm({ item: e, selected: t, busy: n, onSelect: o, onRestore: i, onPurge: a }) {
  var u, m;
  const s = [...e.slots || []].sort((f, h) => f.sortOrder - h.sortOrder || String(f.slotDefinitionId).localeCompare(String(h.slotDefinitionId))), l = [...new Map(s.map((f) => [
    f.performerId,
    { id: f.performerId, name: f.performerName }
  ])).values()], d = s.map((f) => ({
    slotDefinitionId: f.slotDefinitionId,
    label: Lt(f),
    performer: { id: f.performerId, name: f.performerName }
  })), c = Oa(e);
  return r("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: qa(t)
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
          r(xn, { key: "state", state: e.reviewState, includeLabel: !1 }),
          r("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((m = e.activity) == null ? void 0 : m.name) || "Tag segment"),
          l.length ? r(eo, {
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
function lm({ item: e, index: t, count: n, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
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
      clip: { start: e.startSec, end: Rd(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : r("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    r("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      r("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      r("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${n}`),
      r("button", { key: "next", type: "button", disabled: t < 0 || t >= n - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      r("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      r("a", { key: "edit", href: Oa(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function na({ onNavigate: e, profile: t }) {
  const n = qe(() => {
    const _ = sa("ext:com.midnightrider.segment-studio:segments");
    return _ ? {
      ...lr,
      defaultFilter: { ...lr.defaultFilter, ..._.findFilter || {} },
      defaultObjectFilter: _.objectFilter || {}
    } : lr;
  }, []), o = la(n), { objectFilter: i, setFilter: a, setObjectFilter: s } = o, l = Ta(o.filter), [d, c] = K(null), [u, m] = K(""), [f, h] = K(0), [g, y] = K({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [x, N] = K(null), [p, E] = K(null), [Q, V] = K(0), [P, L] = K(""), [$, S] = K(!0), [k, D] = K(""), B = pe(0), U = wd(i, d), T = U.slots !== void 0, q = $d(l, U), Y = g.performerSlotsAvailable !== !1, j = qe(
    () => Y ? [...Fi, Sd(d, i, Ud)] : Fi,
    [d, i, Y]
  ), Z = JSON.stringify(q);
  he(() => {
    const _ = new AbortController();
    return m(""), re("/browse/roles", { signal: _.signal }).then(c).catch((ue) => {
      ue.name !== "AbortError" && (ue.status === 403 ? (c([]), y((fe) => ({ ...fe, performerSlotsAvailable: !1 }))) : m(ue.message || "Unable to load performer slot roles."));
    }), () => _.abort();
  }, [f]), he(() => {
    U !== i && !T && s(U);
  }, [U, i, T]), he(() => {
    if (T) return;
    const _ = ++B.current, ue = new AbortController();
    return S(!0), D(""), re("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q), signal: ue.signal }).then((fe) => {
      _ === B.current && y({ ...fe, totalCount: fe.totalCount ?? fe.total ?? 0 });
    }).catch((fe) => {
      if (!(_ !== B.current || fe.name === "AbortError")) {
        if (fe.status === 400 && fe.message.includes("unrestricted performer read access")) {
          y((ke) => ({ ...ke, performerSlotsAvailable: !1 })), s(Td(U)), L("Performer slot filters were cleared because performer details are unavailable.");
          return;
        }
        D(fe.message);
      }
    }).finally(() => {
      _ === B.current && S(!1);
    }), () => {
      B.current++, ue.abort();
    };
  }, [Z, Q, T]);
  const ie = g.items.findIndex((_) => _.key === x), ae = g.items[ie] || null;
  function ve(_) {
    s(_), a({ ...l, page: 1 });
  }
  function de() {
    const _ = document.querySelector(`[data-segment-key="${x}"]`);
    N(null), requestAnimationFrame(() => _ == null ? void 0 : _.focus());
  }
  async function De(_) {
    var ke;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    E(_.key), L("");
    const ue = `browse-restore:${_.itemId}:${_.revision}`, fe = Je(ue);
    try {
      const Se = (H = !1) => re(`/bin/${_.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: fe,
          expectedRevision: _.revision,
          discardMissingImage: H
        })
      });
      try {
        await Se(Go(ue));
      } catch (H) {
        if (((ke = H.payload) == null ? void 0 : ke.code) !== "missing-image" || !window.confirm(`${H.message}

Continue and discard the missing image reference?`))
          throw H;
        Bo(ue), await Se(!0);
      }
      Ye(ue), x === _.key && N(null), L("Segment restored to Cove."), V((H) => H + 1);
    } catch (Se) {
      L(Se.message || "Unable to restore the segment."), Se.status === 409 && V((H) => H + 1);
    } finally {
      E(null);
    }
  }
  async function be(_) {
    E(_.key), L("");
    try {
      const ue = await re(`/items/${_.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: _.revision })
      });
      if (!Ka(ue, L) || !Vd(ue))
        return;
      const fe = `browse-dependency-delete:${_.itemId}:${ue.fingerprint}`;
      await re(`/items/${_.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Je(fe),
          fingerprint: ue.fingerprint
        })
      }), Ye(fe), x === _.key && N(null), L(`${ue.deletedSegmentCount} segment${ue.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), V((ke) => ke + 1);
    } catch (ue) {
      L(ue.message || "Unable to permanently delete the segment."), ue.status === 409 && V((fe) => fe + 1);
    } finally {
      E(null);
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
      filter: l,
      onFilterChange: a,
      totalCount: g.totalCount,
      isLoading: $,
      error: k ? new Error(k) : null,
      onRetry: () => V((_) => _ + 1),
      sortOptions: vd,
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: j,
      objectFilter: U,
      supportsFilterExpressions: !0,
      onObjectFilterChange: ve,
      searchPlaceholder: "Search segments..."
    }, [
      r(lm, { key: "player", item: ae, index: ie, count: g.items.length, onPrevious: () => {
        var _;
        return N((_ = g.items[ie - 1]) == null ? void 0 : _.key);
      }, onNext: () => {
        var _;
        return N((_ = g.items[ie + 1]) == null ? void 0 : _.key);
      }, onClose: de, onNavigate: e }),
      u ? r("div", { key: "roles-error", role: "alert", className: "flex flex-wrap items-center gap-3 rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, [
        r("span", { key: "text" }, `Performer slot roles could not be loaded: ${u}`),
        r("button", { key: "retry", type: "button", onClick: () => h((_) => _ + 1), className: "font-semibold text-accent hover:underline" }, "Retry")
      ]) : null,
      P ? r("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, P) : null,
      !$ && g.items.length === 0 ? r("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      $ ? null : r("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, g.items.map((_) => r(sm, {
        key: _.key,
        item: _,
        selected: _.key === x,
        busy: p === _.key,
        onSelect: () => N(_.key),
        onRestore: De,
        onPurge: be
      })))
    ])
  ]);
}
function dm({ onNavigate: e, profile: t }) {
  const [n, o] = K([]), [i, a] = K(""), [s, l] = K(0), [d, c] = K(!0), [u, m] = K(null), [f, h] = K(""), g = pe(null);
  async function y(p) {
    const E = await re("/bin", p ? { signal: p } : void 0);
    return o(E.items || []), a(E.fingerprint || ""), l(Number(E.totalCount) || 0), E;
  }
  he(() => {
    const p = new AbortController();
    return c(!0), y(p.signal).catch((E) => {
      E.name !== "AbortError" && h(E.message);
    }).finally(() => {
      p.signal.aborted || c(!1);
    }), () => p.abort();
  }, []), aa(Oo, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var p;
      return (p = g.current) == null ? void 0 : p.call(g);
    }
  }]);
  async function x(p) {
    var V;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    m(p.itemId), h("");
    const E = `restore:${p.itemId}:${p.revision}`, Q = Je(E);
    try {
      const P = (L = !1) => re(`/bin/${p.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Q, expectedRevision: p.revision, discardMissingImage: L })
      });
      try {
        await P(Go(E));
      } catch (L) {
        if (((V = L.payload) == null ? void 0 : V.code) !== "missing-image" || !window.confirm(`${L.message}

Continue and discard the missing image reference?`)) throw L;
        Bo(E), await P(!0);
      }
      Ye(E), await y(), cr(), h("Segment restored with a new native ID.");
    } catch (P) {
      h(P.message || "Unable to restore the segment."), P.status === 409 && await y();
    } finally {
      m(null);
    }
  }
  async function N() {
    if (u == null)
      try {
        const p = await za({
          items: n,
          fingerprint: i,
          totalCount: s
        }, () => {
          m(-1), h("");
        });
        if (p.status !== "emptied") return;
        await y(), cr(), h(`${p.segmentCount} segment${p.segmentCount === 1 ? "" : "s"} from ${p.sceneCount} scene${p.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (p) {
        h(p.message || "Unable to empty the recycling bin."), p.status === 409 && await y();
      } finally {
        m(null);
      }
  }
  return g.current = N, r("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
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
        onClick: N,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, u === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    f ? r("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, f) : null,
    d ? r("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && n.length === 0 ? r("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...n.map((p) => r("article", { key: p.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      r("div", { key: "copy", className: "min-w-0 flex-1" }, [
        r("h2", { key: "title", className: "truncate font-semibold" }, `${p.tagName || "Tag segment"} · ${p.videoTitle || `Video ${p.videoId}`}`),
        r("p", { key: "time", className: "font-mono text-xs text-secondary" }, p.endSec == null ? Ge(p.startSec) : `${Ge(p.startSec)} – ${Ge(p.endSec)}`),
        r("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${p.sourceKey || "unknown"}`)
      ]),
      r("a", { key: "video", href: `/video/${p.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      r("button", { key: "restore", type: "button", disabled: u != null, onClick: () => x(p), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const ra = "ext:com.midnightrider.segment-studio:videos";
async function cm(e, t, n, o) {
  const i = await Hd("/api/videos/find", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cu(e, t, { fullMode: n })),
    signal: o
  }), a = Array.isArray(i == null ? void 0 : i.items) ? i.items : [], s = a.length > 0 ? await re("/videos/segment-counts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoIds: a.map((d) => d.id) }),
    signal: o
  }) : { items: [] }, l = new Map(((s == null ? void 0 : s.items) ?? []).map((d) => [d.videoId, d]));
  return { items: a.map((d) => mu(d, l.get(d.id))), totalCount: (i == null ? void 0 : i.totalCount) ?? 0 };
}
function ho({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: n = "editor",
  profile: o
}) {
  const i = t || n === "review", a = qe(() => {
    var ie;
    const j = sa(ra), Z = (ie = j == null ? void 0 : j.uiOptions) == null ? void 0 : ie.displayMode;
    return j ? {
      ...Vt,
      defaultFilter: Eo({ ...Vt.defaultFilter, ...j.findFilter || {} }),
      defaultObjectFilter: Ro(j.objectFilter || {}, { fullMode: i }),
      defaultDisplayMode: Vt.allowedDisplayModes.includes(Z) ? Z : Vt.defaultDisplayMode
    } : Vt;
  }, []), { filter: s, objectFilter: l, displayMode: d, setFilter: c, setObjectFilter: u, setDisplayMode: m } = la(a), [f, h] = K({ items: [], totalCount: 0 }), [g, y] = K(!0), [x, N] = K(""), [p, E] = K(0), [Q, V] = K(/* @__PURE__ */ new Set()), P = pe(0), L = pe(null), $ = JSON.stringify(s), S = JSON.stringify(l);
  he(() => {
    const j = Ro(l, { fullMode: i });
    j !== l && u(j);
    const Z = Eo(s);
    Z !== s && c(Z);
  }, [$, S, i]), he(() => {
    L.current = null, V(/* @__PURE__ */ new Set());
  }, [$, S]), he(() => {
    const j = ++P.current, Z = new AbortController();
    return y(!0), N(""), cm(s, l, i, Z.signal).then((ie) => {
      j === P.current && h(ie);
    }).catch((ie) => {
      j === P.current && ie.name !== "AbortError" && N(ie.message || "Unable to discover videos.");
    }).finally(() => {
      j === P.current && y(!1);
    }), () => {
      P.current++, Z.abort();
    };
  }, [$, S, i, p]);
  function k(j) {
    c({ ...j, page: j.page || 1 });
  }
  function D(j) {
    u(j), c({ ...s, page: 1 });
  }
  function B(j, Z = !1) {
    V((ie) => gu(
      ie,
      f.items.map((ae) => ae.videoId),
      j,
      L.current,
      Z
    )), L.current = j;
  }
  function U() {
    L.current = null, V(new Set(f.items.map((j) => j.videoId)));
  }
  function T() {
    L.current = null, V(/* @__PURE__ */ new Set());
  }
  function q() {
    L.current = null, V((j) => new Set(f.items.map((Z) => Z.videoId).filter((Z) => !j.has(Z))));
  }
  const Y = qe(() => uu(ul), []);
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
      totalCount: f.totalCount,
      isLoading: g,
      error: x ? new Error(x) : null,
      onRetry: () => E((j) => j + 1),
      sortOptions: ml,
      displayMode: d,
      onDisplayModeChange: m,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: Y,
      objectFilter: l,
      supportsFilterExpressions: !0,
      onObjectFilterChange: D,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: yn ? Q : void 0,
      onSelectAll: yn ? U : void 0,
      onSelectNone: yn ? T : void 0,
      onInvertSelection: yn ? q : void 0,
      // The host renders whatever extensions contribute for a video selection, so
      // Run AI here is the same action, and the same dialog, as the native videos
      // page, in Basic and Full mode alike. Selection serves only this bar, so it
      // is offered only on hosts that render it. Only the contributed actions are
      // rendered: Segment Studio's own ownership and lineage rules govern
      // deletion, so the native bulk mutations that would bypass them stay out of
      // this bar.
      selectionActions: yn && Q.size > 0 ? r(Ga, { entityType: "video", selectedIds: Q }) : null
    }, [
      !g && f.items.length === 0 ? r("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !g && d === "grid" ? r("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, f.items.map((j) => r(pu, { key: j.videoId, item: j, onNavigate: e, showReviewStates: i, selected: Q.has(j.videoId), selectionActive: Q.size > 0, onSelect: yn ? B : null }))) : null,
      !g && d === "list" ? r("section", { key: "rows", className: "space-y-3" }, f.items.map((j) => r(fu, { key: j.videoId, item: j, onNavigate: e, showReviewStates: i, selected: Q.has(j.videoId), selectionActive: Q.size > 0, onSelect: yn ? B : null }))) : null
    ])
  ]);
}
function oa({
  videoId: e,
  onNavigate: t,
  compatibilityMode: n = !1,
  profile: o
}) {
  const [i, a] = K(null), [s, l] = K(!0), [d, c] = K(""), u = pe(0), m = pe(0), f = pe(e), h = pe(0), g = pe([]), y = Wc();
  f.current = e;
  const [x] = K(() => Al({
    beginRequest: () => ({ requestId: ++m.current, videoId: f.current, updateSequence: h.current }),
    fetchDetail: ($) => re(N($.videoId)),
    isCurrent: ($) => Dr($.requestId, m.current, $.videoId, f.current),
    isSameVideo: ($) => $.videoId === f.current
  })), N = ($) => `/videos/${$}/editor`;
  async function p($, S, k) {
    const D = await re(N(S), k ? { signal: k.signal } : void 0);
    return Dr($, k ? u.current : m.current, S, f.current) ? (a(D), !0) : !1;
  }
  he(() => {
    const $ = ++u.current, S = e, k = new AbortController();
    return a(null), l(!0), c(""), p($, S, k).catch((D) => {
      Dr($, u.current, S, f.current) && D.name !== "AbortError" && c(D.message || "Unable to load the editor.");
    }).finally(() => {
      Dr($, u.current, S, f.current) && l(!1);
    }), () => {
      u.current++, m.current++, k.abort();
    };
  }, [e]);
  function E($, S) {
    if (typeof $ == "function") {
      const k = ++h.current;
      g.current = [...g.current.slice(-199), { sequence: k, videoId: S, update: $ }];
    } else
      h.current += 1, g.current = [];
    a((k) => (k == null ? void 0 : k.video.id) !== S ? k : typeof $ == "function" ? $(k) : $);
  }
  function Q($, S) {
    return g.current.filter((k) => k.sequence > S.updateSequence && k.videoId === S.videoId).reduce((k, D) => D.update(k), $);
  }
  function V() {
    return x({
      prepare: Q,
      onLoaded: ($) => {
        a($), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: ($) => c($.message || "Unable to reload the latest segment.")
    });
  }
  function P() {
    return x({
      prepare: Q,
      onLoaded: ($) => {
        a($), c("");
      },
      onError: ($) => c($.message || "Unable to reload performer slots.")
    });
  }
  function L() {
    return x({
      prepare: Q,
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
    i ? r(Wu, {
      key: i.video.id,
      detail: i,
      onDetailChange: E,
      onConflict: V,
      onReload: P,
      onAnalysisCompleted: L,
      onSlotsChanged: P,
      splitLayout: y,
      profile: o,
      initialSegmentId: Gi() ? -Gi() : Ed(),
      compatibilityMode: n,
      onNavigate: t
    }) : null
  ]);
}
function um(e, t, n) {
  return t === "settings" || e === "settings" || t == null && e == null && n.replace(/\/+$/, "") === "/segment-studio/settings";
}
function mm(e, t, n) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(n.replace(/\/+$/, ""));
}
function gm(e, t, n) {
  return t === "bin" || e === "bin" || t == null && e == null && n.replace(/\/+$/, "") === "/segment-studio/bin";
}
function pm({
  id: e,
  slug: t,
  onNavigate: n,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = gd(o), l = um(e, t, window.location.pathname), d = mm(e, t, window.location.pathname), c = gm(e, t, window.location.pathname), u = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (yd(u, o) === "videos" && u !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), r(ho, {
      onNavigate: n,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return r(am, {
    onNavigate: n,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return r(na, { onNavigate: n, profile: o });
    const h = Number(e);
    return Number.isInteger(h) && h > 0 ? r(oa, {
      videoId: h,
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
  if (c) return r(dm, { onNavigate: n, profile: o });
  const f = Number(e);
  return d ? r(na, { onNavigate: n, profile: o }) : Number.isInteger(f) && f > 0 ? r(oa, {
    videoId: f,
    onNavigate: n,
    compatibilityMode: s === "review",
    profile: o
  }) : r(ho, {
    onNavigate: n,
    mode: s,
    profile: o
  });
}
function fm({ id: e, slug: t, onNavigate: n }) {
  const [o, i] = K(null), [a, s] = K("");
  return he(() => {
    const l = new AbortController();
    return re("/preferences", { signal: l.signal }).then((d) => i($a(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? r("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? r("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : r(pm, {
    id: e,
    slug: t,
    onNavigate: n,
    profile: o,
    onProfileChange: i
  });
}
function ym(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const n = Number(t[0]);
  return Number.isInteger(n) && n > 0 ? `/segment-studio/${n}` : null;
}
function bm(e, t) {
  const n = ym(t);
  return n ? (window.location.assign(n), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const _m = {
  components: { SegmentStudioPage: fm },
  actionHandlers: { openSegmentStudio: bm }
};
export {
  Uu as ANALYSIS_RUN_CHECK_INTERVAL_MS,
  vd as BROWSE_SORT_OPTIONS,
  Ln as CLEARED_SEGMENT_SELECTION_ID,
  Zt as SEGMENT_STUDIO_CAPABILITIES,
  Oo as SEGMENT_STUDIO_EXTENSION_ID,
  yr as SEGMENT_STUDIO_SHORTCUTS,
  Ll as activeEditorFilterCount,
  tc as activeSwimlaneLabelStyle,
  Bc as addPendingChange,
  mc as applyDerivationRuleSlotSuggestions,
  sn as applyFeedbackEditorDelta,
  Wo as applyPendingChanges,
  qi as applySegmentMergeDelta,
  Lc as areSegmentsBusy,
  Lr as availableDerivationRuleSlots,
  Qd as basicSegmentTimelineStyle,
  Rd as browseClipEnd,
  Oa as browseEditorHref,
  $d as buildBrowseRequest,
  Yu as buildDerivationRuleGraph,
  cu as buildDiscoveryFindRequest,
  xl as buildMinuteTimelineTicks,
  Vu as buildPerformerSlotOverview,
  Pd as buildSegmentQuickSearchEntries,
  bc as buildSegmentRailRows,
  hc as buildTimelineRows,
  wm as buildTimelineTicks,
  Il as calculateCenteredTimelineScroll,
  So as calculateEditorPanelMaximum,
  kl as calculateMinuteLabelStride,
  Nm as calculateMinuteTimelineWidth,
  Tl as calculateSwimlaneTitleMaximum,
  Cl as calculateTimelinePlayheadPosition,
  Lo as calculateTimelineRatioBounds,
  El as calculateTimelineRatioFromPointer,
  Im as calculateVerticalRevealOffset,
  bn as clampEditorPanelWidth,
  Gr as clampSwimlaneTitleWidth,
  ha as clampTimelineRatio,
  jo as clampTimelineRatioForHeight,
  Hr as clampTimelineZoom,
  ru as compactProvenanceSummary,
  _c as confirmPendingChange,
  Al as createEditorReloader,
  nd as createQueuedReviewRequest,
  jc as createSaveQueue,
  _u as createSegmentAnalysisRequestScope,
  _m as default,
  tm as derivationRulesWithMissingSlots,
  is as discardPendingChange,
  uu as discoveryCriteria,
  Wd as downloadFileNameFromContentDisposition,
  jl as dualRangeValueFromPointer,
  Pi as duplicateIdentityFromResponse,
  id as duplicateOperationKey,
  xa as editorVisibilityIncludingSegment,
  xc as expandedSwimlanes,
  bd as extensionOwnedSegmentsModeSwitchPrompt,
  Cc as feedbackFrameTimestamps,
  Tc as feedbackResultMatchesAction,
  $c as feedbackSelectionPlan,
  Pl as filterDerivedSegments,
  go as filterEditorSegments,
  Ju as filterPerformerSlotOverview,
  Od as filterSegmentQuickSearch,
  Em as filterSegmentStudioShortcuts,
  Nc as findAdjacentSegmentGroupKey,
  ud as findAdjacentShot,
  ed as findEditorShortcut,
  ba as findInitialSegmentSelection,
  Sl as findNearestSegmentInCurrentSwimlane,
  Ur as findNextUnprocessed,
  cd as findPublishedSelectionIdentity,
  mt as findSegmentByStableIdentity,
  Ml as findSegmentFromPlayhead,
  vl as findSegmentNearPlayhead,
  wc as findSwimlaneRangeSelection,
  $o as findSwimlaneSelection,
  Ad as findUniquePerformerSlotAssignment,
  zr as findUnreviewedSelection,
  sc as focusDialogDefaultButton,
  Zr as formatGenderHint,
  md as frameStepSeconds,
  Pa as generatePerformerSlotAssignmentRecommendations,
  Iu as groupApprovedDraftsForPublishing,
  Dd as groupAutoAssignCandidates,
  Rc as groupIncorrectExamplesByTag,
  Eu as groupMaterializationOutputs,
  vn as groupSegmentsIntoSwimlanes,
  vc as groupSelectedSwimlanes,
  Ho as groupSwimlanesBySegmentGroup,
  Pt as handleModalKey,
  Ya as hasGroupedSwimlanes,
  Un as hasSegmentStudioCapability,
  rs as heldTagChangeFor,
  dd as heldTagReady,
  Vi as hideCollectedFeedbackSegments,
  zi as historyActionsForTarget,
  Pr as incorrectExampleHistoryState,
  Ja as indexPerformerSlotsBySegment,
  Dm as initialReviewFilter,
  Ac as insertSegmentProjection,
  Dr as isCurrentEditorRequest,
  rc as isEditableTarget,
  jn as isEditorHeldByOtherWork,
  Pm as isEditorShortcutOwner,
  Oc as isKindRunning,
  Yr as isMissingSlotMapping,
  Qr as isPublishableApprovedDraft,
  Km as isSaveQueueBusy,
  fs as isSavedDerivationRulePair,
  To as isSegmentCreationPending,
  gm as isSegmentStudioBinRoute,
  mm as isSegmentStudioSegmentsRoute,
  um as isSegmentStudioSettingsRoute,
  Kr as isTemporarySegment,
  Qu as layoutDerivationRuleComponent,
  Xu as layoutDerivationRuleComponents,
  Dc as mergeSegmentsProjection,
  wd as migrateLegacyBrowseFilter,
  Ta as migrateLegacyBrowseSort,
  Ro as migrateLegacyDiscoveryFilter,
  Eo as migrateLegacyDiscoverySort,
  cc as multiSelectionActionHint,
  dn as normalizeCollapsedSegmentGroups,
  Jr as normalizeDiscoveryIds,
  Gt as normalizeEditorSegmentFilters,
  an as normalizeGender,
  Li as normalizeReviewFilter,
  Uo as normalizeSegmentGroupColor,
  $a as normalizeSegmentStudioFeatureProfile,
  Mm as normalizeSegmentStudioMode,
  No as normalizeSegmentStudioPublicMode,
  Rl as parseEditorLayout,
  Dl as parseHideDerivedSegmentsPreference,
  Ol as parseMergeConfirmationPreference,
  Ia as parsePlaybackShortcutConfig,
  Xl as parseShortcutBindingOverrides,
  Gn as patchPerformerSlotProjection,
  Fm as patchSegmentProjection,
  zc as pendingChangesReducer,
  Uc as pendingInsertedSegments,
  Wl as percentageSeekTime,
  Md as performInitialSegmentSeek,
  yt as performerOptionId,
  qr as performerSlotHistoryState,
  Lt as performerSlotLabel,
  gc as performerSlotPresentation,
  jm as performerSlotStatus,
  zo as performerSlotStatusFromSegmentSlots,
  Va as performerSlotsForSegment,
  Ht as provenanceSourceLabel,
  ss as prunePendingChanges,
  ld as queueCreatedSegmentTagChoice,
  La as rankPerformerOptions,
  Ic as reconcileSegmentGroupKey,
  zl as reconcileSelectedSegmentIds,
  yu as recyclingBinActionText,
  Jd as recyclingBinDeletionPrompt,
  _a as recyclingBinDeletionSummary,
  hd as recyclingBinModeSwitchPrompt,
  Am as removeQueuedReviewsForSegments,
  Gm as removeSegmentsProjection,
  Gi as requestedOwnedItemId,
  Ed as requestedSegmentId,
  Gl as resolveEditorSegmentSelection,
  rd as resolveQueuedReviewRequest,
  ad as resolveSegmentCreationAction,
  yd as resolveSegmentStudioRoute,
  Zl as resolveSegmentStudioShortcuts,
  ts as resolveSegmentTarget,
  Zu as resolveSelectedDerivationRule,
  Mi as resolveSelectedSegments,
  Ou as restoreDisabledToolbarActionFocus,
  qu as restorePublishApprovedFocus,
  Bm as restoreSegmentFieldsProjection,
  Um as restoreSegmentsProjection,
  em as retagDerivationRuleDraft,
  Kc as retargetPendingChanges,
  es as revealCollapsedSegmentGroup,
  Kn as sameSegmentIdentity,
  ns as savingSegmentIdFrom,
  Ha as segmentBadgeStyle,
  ec as segmentGroupEdgeColor,
  Xr as segmentGroupHeaderBackground,
  _t as segmentGroupKeyForSegment,
  _o as segmentHistoryIdentity,
  Or as segmentHistoryState,
  ft as segmentIdentity,
  qa as segmentRailItemStyle,
  Om as segmentStateStyle,
  ym as segmentStudioActionTarget,
  gd as segmentStudioLegacyMode,
  Yd as segmentTimelineStyle,
  Ft as segmentsHistoryState,
  Hl as selectAllVideoSegmentIds,
  Nd as selectedBrowseStates,
  Xa as selectedSwimlaneMerge,
  Br as selectionReferenceForSegment,
  ds as setBackLinkNavigation,
  as as settlePendingChange,
  lc as sharedPerformerSlotShape,
  dc as sharedTagPerformerSlotShape,
  Bn as shortcutAvailableInMode,
  td as shortcutBindingDisplayText,
  Cm as shortcutBindingFromEvent,
  Tm as shortcutBindingsOverlap,
  Rm as shortcutModesOverlap,
  Ql as shortcutRequiresSingleSegment,
  fo as shotBoundaryFingerprint,
  ac as shouldAcceptCurrentTagFromEnter,
  ic as shouldDismissPopover,
  $m as shouldExitShortcutCapture,
  Lm as shouldHandleEditorShortcut,
  Ku as shouldLoadSegmentAnalysis,
  Xi as shouldReloadAfterSegmentMutation,
  wo as shouldRestoreTransitionSelection,
  Ld as shouldShowQuickSearchGroups,
  Sd as slottedPerformerCriterion,
  Ai as splitShortcutCategoriesIntoColumns,
  zu as startCompletedRunWatch,
  uc as suggestDerivationRuleSlotMappings,
  pr as swimlaneDisplayLabel,
  nc as swimlaneMarkerTop,
  Zd as swimlaneStripeBackground,
  sd as tagEditorLockedBySave,
  to as targetsOverlap,
  $l as timelineContentStyle,
  $i as timelinePlayheadHorizontalStyle,
  Xd as timelineSegmentWidth,
  wl as timelineTickAlignment,
  Nl as timelineTickPosition,
  vo as timelineTimePercent,
  mu as toDiscoveryItem,
  kc as toggleAllCollapsedSegmentGroups,
  Oi as toggledSelectionReviewState,
  Jt as trapModalFocus,
  _d as tryParseJsonResponseText,
  _l as updateAnchoredSegmentSelection,
  gu as updateDiscoverySelection,
  Fl as updateDualRangeValues,
  Ul as updateSegmentCollectionSelection,
  Kl as updateSegmentRangeSelection,
  ka as updateSegmentSelection,
  ta as validateDerivationRuleDraft,
  Ci as validateSegmentTiming,
  Fo as videoPerformerOptions,
  yo as videoPerformerSlotAssignments,
  fd as visibleSegmentStudioSettingsTabs,
  pd as visibleSegmentStudioTabs,
  Qa as visibleVirtualRows,
  Td as withoutSlottedPerformers
};
