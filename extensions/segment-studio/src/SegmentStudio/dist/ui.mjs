import go from "@cove/runtime/react";
import { createPortal as Rs } from "@cove/runtime/react-dom";
import { extensionFetch as po } from "@cove/runtime/api";
import * as fo from "@cove/runtime/components";
import { formatDuration as Es, EntityReferenceSelector as Qn, useExtensionKeyboardBindings as As, VideoPlayer as Di, useRegisterExtensionKeyboardActions as Oi, getDefaultFilter as Pi, useListUrlState as Li, ListPage as ji, VIDEO_CRITERIA as Ms, VIDEO_SORT_OPTIONS as Ds } from "@cove/runtime/components";
import { StepBack as Os, StepForward as Ps, Loader2 as Ls } from "@cove/runtime/lucide-react";
const yo = "com.midnightrider.segment-studio", js = "segment-studio-editor", Fi = "segment-studio.layout.v1", un = "segment-studio.operations.v1", Gi = "segment-studio.collapsed-segment-groups.v1", Bi = "segment-studio.playback-shortcuts.v1", Ui = "segment-studio.timing-clipboard.v1", Ki = "segment-studio.hide-derived-segments.v1", zi = "segment-studio.merge-confirmation.v1", Nt = ["unreviewed", "approved", "rejected"], Fs = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], Xo = "(min-width: 1024px) and (min-height: 640px)", Zo = "(min-width: 1024px) and (min-height: 900px)", Xn = 1e-3, ei = 15, Gs = 30, _i = 12, $t = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, bo = {
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
function ti(e, t, n) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(n) && n > 0;
  return e < 0 || o && e > n || t != null && (t < 0 || o && t > n) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function Hi(e, t = null) {
  const n = e.flatMap((o) => o.markers.map((i) => i.segment));
  return n.find((o) => o.id === t) ?? Cr(e, null, 1, !0) ?? n[0] ?? null;
}
function Cr(e, t, n, o = !1) {
  var u;
  const i = e.findIndex((f) => f.markers.some((y) => y.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const f = e.flatMap((y) => y.markers.map((b) => b.segment)).filter((y) => y.reviewState === "unreviewed");
    return n < 0 ? f.at(-1) ?? null : f[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((f) => f.segment.id === t);
  if (!o)
    return ((u = (n < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((y) => y.segment.reviewState === "unreviewed")) == null ? void 0 : u.segment) ?? null;
  const l = e.flatMap((f) => f.markers.map((y) => y.segment)), d = l.findIndex((f) => f.id === t);
  return (n < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((f) => f.reviewState === "unreviewed") ?? null;
}
function Bs(e, t, n, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((u, f) => u.markers.filter(({ segment: y }) => {
    const b = Number(y.startSec), g = y.endSec == null ? b + Gs : Number(y.endSec);
    return Number.isFinite(b) && Number.isFinite(g) && g >= b && b <= i + ei + Xn && g >= i - ei - Xn;
  }).map(({ segment: y }) => ({ segment: y, laneIndex: f }))).sort((u, f) => u.laneIndex - f.laneIndex || Math.abs(u.segment.startSec - i) - Math.abs(f.segment.startSec - i) || u.segment.id - f.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((u) => u.markers.some((f) => f.segment.id === o));
  if (s < 0) return n < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((u) => u.laneIndex !== s);
  return l.length === 0 ? n < 0 ? a.at(-1).segment : a[0].segment : n < 0 ? ((d = l.findLast((u) => u.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((u) => u.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function Us(e, t, n) {
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
function $r(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function Bu(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const n = Math.max(2, Math.floor(t));
  return Array.from({ length: n }, (o, i) => e * i / (n - 1));
}
function Ks(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, n) => n * 60);
}
function Uu(e, t = 1, n = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, n) : Math.ceil(e / 60) * Math.max(1, n) * Math.max(1, t);
}
function zs(e, t, n = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(n) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function _s(e, t, n = null) {
  return e <= 0 || e >= t - 1 && (n == null || n >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Hs(e, t, n) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && n >= 100 ? { right: "0" } : { left: `${n}%` };
}
function qs(e, t, n, o, i = 160, a = 0) {
  if (!(t > 0) || !(n > o)) return 0;
  const s = Math.max(0, n - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(n - o, Math.max(0, l - o / 2));
}
function eo(e, t) {
  const n = Number(e);
  return t > 0 && Number.isFinite(n) ? Math.min(1, Math.max(0, n / t)) * 100 : 0;
}
function Ws(e, t, n = 10) {
  const o = eo(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(n) || 0) * (1 - i)
  };
}
function ni(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function Vs(e, t = _i) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function qi(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : $t.timelineRatio;
}
function to(e, t) {
  const n = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(n) ? n : 560));
}
function ln(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? $t.detailWidth : Math.min(to(t, 0), Math.max(240, e));
}
function kr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? $t.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function Js(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function ho(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: $t.timelineRatio, maximum: $t.timelineRatio };
  const n = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: n, maximum: Math.max(n, o) };
}
function vo(e, t) {
  const n = qi(e);
  if (!(t > 0)) return n;
  const o = ho(t);
  return Math.min(o.maximum, Math.max(o.minimum, n));
}
function Ys(e) {
  if (!e) return { ...$t };
  try {
    const t = JSON.parse(e), n = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof n == "number" && Number.isFinite(n) ? qi(n) : $t.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: ln(t == null ? void 0 : t.detailWidth),
      markerRailWidth: ln(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: kr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...$t };
  }
}
function Qs(e, t, n) {
  return n > 0 ? vo((t + n - e) / n, n) : $t.timelineRatio;
}
function Ku(e, t, n, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < n + a ? e - n - a : t > o - a ? t - o + a : 0;
}
function Xs(e, t, n, o = null) {
  var d;
  const i = [...e].sort((c, u) => c.startSec - u.startSec || c.id - u.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= Xn ? i[a + (n < 0 ? -1 : 1)] ?? null : n < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function br(e, t, n, o) {
  return e === t && n === o;
}
function Zs({ beginRequest: e, fetchDetail: t, isCurrent: n, isSameVideo: o }) {
  let i = null, a = null;
  return function({ onLoaded: l, onError: d }) {
    const c = e(), u = (async () => {
      try {
        const f = await t(c);
        if (n(c))
          return l(f), f;
      } catch (f) {
        if (n(c))
          return d(f), null;
      }
      return o(c) && i !== u && a.videoId === c.videoId ? i : null;
    })();
    return i = u, a = c, u;
  };
}
const $n = "__segment-studio-cleared-selection__";
function el(e) {
  return e === "true";
}
function tl(e) {
  return e !== "false";
}
function Wi() {
  try {
    return tl(window.localStorage.getItem(zi));
  } catch {
    return !0;
  }
}
function Vi(e) {
  try {
    window.localStorage.setItem(zi, String(!!e));
  } catch {
  }
}
function nl(e, t) {
  return t ? e.filter((n) => !n.isDerived) : e;
}
function Dt(e = {}) {
  const t = Nt.filter((u) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(u) : !0), n = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (u, f) => {
    const y = Number(u);
    return Number.isFinite(y) ? Math.min(1, Math.max(0, y)) : f;
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
function Vr(e, t, n, o = !1, i = []) {
  var c, u;
  const a = Dt(n), s = a.performerId == null ? null : new Set((t || []).filter((f) => Number(f.performerId) === a.performerId).map((f) => f.segmentId)), l = new Set((i || []).flatMap((f) => f.tags || []).map((f) => Number(f.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((u = (c = (i || []).find((f) => Number(f.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : u.map((f) => Number(f.tagId))) || []);
  return nl(e || [], o).filter((f) => {
    if (f.reviewState != null && !a.reviewStates.includes(f.reviewState) || s && !s.has(f.id) || a.tagId != null && Number(f.tagId) !== a.tagId || d && !d.has(Number(f.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(f.tagId)) || a.sourceKey != null && f.sourceKey !== a.sourceKey) return !1;
    const y = Number(f.confidence);
    return f.confidence == null || !Number.isFinite(y) ? a.includeUnscored : y >= a.confidenceMin && y <= a.confidenceMax;
  });
}
function Ji(e, t, n, o = !1, i = []) {
  var l;
  const a = Dt(n);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = Dt({
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
    filters: Dt(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function rl(e, t = !1) {
  const n = Dt(e);
  return +(n.reviewStates.length !== Nt.length) + +(n.performerId != null) + +(n.tagId != null) + +(n.segmentGroupId != null) + +(n.sourceKey != null) + +(n.confidenceMin > 0 || n.confidenceMax < 1) + +!n.includeUnscored + Number(t);
}
function ol(e, t, n) {
  const o = Number(e), i = Number(t), a = Number(n);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function il(e, t, n, o) {
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
function al(e, t, n = null, o = {}) {
  if (t === $n) return null;
  const i = t ?? n, a = (e || []).flatMap((s) => (s.markers || []).map((l) => l.segment)).find((s) => s.id === i);
  if (a) return a;
  if (o.reference) {
    const s = o.visibleLanes ?? e;
    return s.flatMap((d) => (d.markers || []).map((c) => c.segment)).find((d) => d.id === o.reference.id) ?? Nr(s, o.reference);
  }
  return Hi(e);
}
function Yi(e, t, n, o = !1) {
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
function sl(e, t, n) {
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
function ll(e, t, n, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(n);
  if (s < 0 || l < 0)
    return Yi(e, t, n, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: n
  };
}
function dl(e, t, n = null, o = !1) {
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
    const f = o ? [.../* @__PURE__ */ new Set([...l, ...i])] : l;
    return {
      ...ll(f, s, t, u, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: f
    };
  }
  const d = Yi(i, a, t, o);
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
function cl(e, t, n) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return n != null && i.has(n) && !a.includes(n) && a.push(n), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function ul(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function tn(e, t) {
  const n = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(n, Number((e == null ? void 0 : e.endSec) ?? n) || n), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < n ? n - a : i > o ? i - o : 0;
}
function ri(e, t, n, o = () => !0) {
  const i = t.anchor ?? t;
  return (e || []).map((a) => a.segment).filter((a) => a && !n.has(a.id) && o(a)).sort((a, s) => tn(t, a) - tn(t, s) || tn(i, a) - tn(i, s) || Math.abs(Number(a.startSec) - Number(i.startSec)) - Math.abs(Number(s.startSec) - Number(i.startSec)) || Number(a.startSec) - Number(s.startSec) || Number(a.id) - Number(s.id))[0] ?? null;
}
function no(e, t) {
  return ((e == null ? void 0 : e.markers) || []).map((n) => n.segment).filter((n) => n && !t.has(n.id));
}
function Jr(e) {
  return e.reviewState === "unreviewed";
}
function oi(e, t) {
  const n = Number(e.startSec) || 0;
  return n !== t.startSec ? n > t.startSec : Number(e.id) > Number(t.id);
}
function ii(e, t, n, o, i) {
  var s;
  return t < 0 ? ri(e.flatMap((l) => l.markers || []), n, o, i) : ((s = e.map((l, d) => ({ index: d, found: ri(l.markers, n, o, i) })).filter(({ found: l }) => l).sort((l, d) => Math.abs(l.index - t) - Math.abs(d.index - t) || tn(n, l.found) - tn(n, d.found) || tn(n.anchor ?? n, l.found) - tn(n.anchor ?? n, d.found) || +(l.index < t) - +(d.index < t) || l.index - d.index)[0]) == null ? void 0 : s.found) ?? null;
}
function ml(e, t, n) {
  if (no(e, n).length > 0) return t;
  const o = ((e == null ? void 0 : e.markers) || []).map((s) => s.segment).filter((s) => s && n.has(s.id));
  if (o.length <= 1) return t;
  const i = Math.min(t.startSec, ...o.map((s) => Number(s.startSec) || 0)), a = Math.max(t.endSec, ...o.map((s) => Number(s.endSec ?? s.startSec) || 0));
  return { ...t, startSec: i, endSec: a, anchor: t };
}
function wr(e, t) {
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
function Nr(e, t, n = {}) {
  const o = e || [];
  if (o.length === 0) return null;
  const i = new Set(n.removedIds || []);
  if (t == null) {
    const l = { markers: o.flatMap((c) => c.markers || []) }, d = no(l, i);
    return d.find(Jr) ?? d[0] ?? null;
  }
  i.add(t.id);
  const a = o.findIndex((l) => l.key === t.laneKey);
  if (a >= 0) {
    const l = no(o[a], i).filter(Jr), d = l.find((u) => oi(u, t));
    if (d) return d;
    const c = l.filter((u) => !oi(u, t)).at(-1);
    if (c) return c;
  }
  const s = ml(o[a], t, i);
  return ii(o, a, s, i, Jr) ?? ii(o, a, s, i, () => !0);
}
function gl(e, t) {
  const n = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return n * o / 10;
}
function ai(e, t) {
  const n = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => n.get(o)).filter(Boolean);
}
function pl() {
  try {
    return el(window.localStorage.getItem(Ki));
  } catch {
    return !1;
  }
}
function fl(e) {
  try {
    window.localStorage.setItem(Ki, String(!!e));
  } catch {
  }
}
const tr = [
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
], yl = /* @__PURE__ */ new Set([
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
function bl(e) {
  return yl.has(e);
}
function Qi(e) {
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
function hl(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const n = new Set(tr.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => n.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(Qi).filter(Boolean)]));
  } catch {
    return {};
  }
}
function vl(e = {}) {
  const t = hl(e);
  return tr.map((n) => ({
    ...n,
    bindings: Object.hasOwn(t, n.id) ? t[n.id] : n.bindings
  }));
}
function si(e, t = 2) {
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
function zu(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : Qi({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function _u(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function ro(e, t) {
  const n = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (n !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function li(e, t) {
  const n = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(n != null && n.includes(String(t || "").toLowerCase()));
}
function Hu(e, t) {
  if (!e || !t) return !1;
  const n = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = li(e.code, t.key), a = li(t.code, e.key);
  if (!n && !o && !i && !a) return !1;
  const s = i ? t.key : e.key, l = i ? e.code : a ? t.code : o ? e.code : e.code || t.code;
  for (const d of [!1, !0])
    for (const c of [!1, !0])
      for (const u of [!1, !0])
        for (const f of [!1, !0]) {
          const y = {
            key: s,
            code: l,
            ctrlKey: d,
            metaKey: c,
            altKey: u,
            shiftKey: f
          };
          if (ro(y, e) && ro(y, t)) return !0;
        }
  return !1;
}
function Rn(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function qu(e, t) {
  return [!1, !0].some((n) => Rn(e, n) && Rn(t, n));
}
function xl(e, t = !1, n = {}) {
  return vl(n).find((o) => Rn(o, t) && o.bindings.some((i) => ro(e, i))) || null;
}
function Xi(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function Sl(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Xi).join(" / ") : "Unassigned";
}
function Wu(e, t) {
  const n = String(t || "").trim().toLowerCase();
  return n ? e.filter((o) => [o.description, o.category, Sl(o)].some((i) => String(i || "").toLowerCase().includes(n))) : e;
}
function Vu(e) {
  return e === "review" ? "review" : "editor";
}
function rt(e, { itemId: t = null, nativeSegmentId: n = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return n == null ? null : (e || []).find((o) => o.nativeSegmentId === n) || null;
}
function kl(e, t) {
  return (e || []).length > 0 && e.every((n) => n.reviewState === t) ? "unreviewed" : t;
}
function wl(e, t, n) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (n == null ? void 0 : n.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function Nl(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const n = e.identities.map((i) => rt(t, i)).filter(Boolean);
  return n.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: n,
    selectedSegment: rt(t, e.activeIdentity) || n[0]
  };
}
function Il(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function Ju(e, t) {
  return (e || []).filter((n) => !n.identities.some((o) => (t || []).some((i) => Il(o, i))));
}
function di(e, t) {
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
function Cl(e, t, n, o) {
  const i = n ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function $l(e, t, n = null) {
  const o = Number(n);
  if (n != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function Tl(e, t, n) {
  return e != null && (n == null || t !== n);
}
function Rl(e, t, n, o = null) {
  if (n === t.tagId) return null;
  const i = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: n,
    tagName: o || ((i == null ? void 0 : i.tagId) === n ? i.tagName : null)
  };
}
function El({ tagEditing: e, selectedSegmentIds: t, activeSegmentId: n }, o) {
  return !(e && n === o && (t == null ? void 0 : t.length) === 1 && t[0] === o);
}
function oo(e, t) {
  return e === t;
}
function Al(e, t, n) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (n || []).find((i) => i.itemId === o.itemId) || null;
}
function Ml(e, t, n) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return n < 0 ? o.filter((i) => i.startSec < t - Xn).at(-1) || null : o.find((i) => i.startSec > t + Xn) || null;
}
function Yr(e) {
  return [...e || []].sort((t, n) => t.startSec - n.startSec || t.id - n.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function ci(e) {
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
function Yu(e, t = null, n = !1) {
  const o = ci(n ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function Cn(e, t, n, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(n, i)) : t;
}
function Zi(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: Cn(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: Cn(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: Cn(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(Cn(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(Cn(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(Cn(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...bo };
  }
}
function Dl(e, t = 30) {
  const n = Number(t);
  return Number(e) / (Number.isFinite(n) && n > 0 ? n : 30);
}
function ea() {
  try {
    return Zi(window.localStorage.getItem(Bi));
  } catch {
    return { ...bo };
  }
}
function ui(e) {
  const t = Zi(JSON.stringify(e));
  try {
    window.localStorage.setItem(Bi, JSON.stringify(t));
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
function io(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function ta(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, n = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && n && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? io(e.requestedMode) : "basic",
    effectiveMode: i ? io(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function En(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function Ol(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Pl(e) {
  const t = [];
  return En(e, Xt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), En(e, Xt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function Ll(e) {
  return [
    ["general", "General", Xt.settingsGeneral],
    ["shortcuts", "Shortcuts", Xt.settingsShortcuts],
    ["performer-slots", "Performer slots", Xt.settingsPerformerSlots],
    ["derivation", "Derivation", Xt.settingsDerivation]
  ].filter(([, , n]) => En(e, n)).map(([n, o]) => [n, o]);
}
function jl(e, t) {
  return e === "segments" && !En(
    t,
    Xt.navigationSegmentInventory
  ) || e === "bin" && !En(
    t,
    Xt.recyclingBinView
  ) ? "videos" : e;
}
function Fl(e) {
  const t = Number(e), n = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (n === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = n === 1;
  return `You have ${n} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Gl(e, t = 0) {
  const n = Number(e), o = Number.isFinite(n) && n >= 0 ? Math.trunc(n) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const Qr = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, mi = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: Nt.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
], Bt = "slottedPerformerCriterion", nr = "slotCriterion", Tn = "*", na = "unassignedSlotCriterion", dn = "_filterExpression";
function Bl(e, t = {}, n = []) {
  const o = n.filter((a) => a.type !== "related"), i = new Map((e || []).filter((a) => a.key !== Tn).map((a) => [a.key, a.label]));
  for (const a of Ul(t)) a !== Tn && !i.has(a) && i.set(a, a);
  return {
    id: "slottedPerformer",
    label: "Slotted Performer",
    type: "related",
    entityType: "performers",
    filterKey: Bt,
    category: "related",
    supportsDistinctSiblingMatches: !0,
    relatedCriteria: () => o,
    relatedContextCriteria: [
      {
        id: "slot",
        label: "Slot",
        type: "enum",
        filterKey: nr,
        modifiers: ["EQUALS"],
        options: [{ value: Tn, label: "Any" }, ...[...i].map(([a, s]) => ({ value: a, label: s }))]
      },
      { id: "specificPerformer", label: "Specific Performer", type: "multiId", entityType: "performers", filterKey: "performerIdsCriterion", modifiers: ["INCLUDES", "EXCLUDES"] },
      { id: "ageAtVideoDate", label: "Age (then)", type: "number", filterKey: "ageAtHostDateCriterion" },
      { id: "performerOccurrenceTags", label: "Occurrence Tags", type: "multiId", entityType: "tags", filterKey: "performerOccurrenceTagsCriterion" },
      { id: "unassignedSlot", label: "Unassigned Slot", type: "bool", filterKey: na }
    ],
    relatedResultLabel: "segments"
  };
}
function Ul(e) {
  const t = [], n = (o) => {
    var a, s, l;
    if (!o || typeof o != "object") return;
    const i = (s = (a = o[Bt]) == null ? void 0 : a[nr]) == null ? void 0 : s.value;
    typeof i == "string" && t.push(i);
    for (const d of ((l = o[dn]) == null ? void 0 : l.children) || o.children || []) n(d.filter || d.group);
  };
  return n(e), t;
}
function Kl(e, t) {
  return {
    [nr]: { modifier: "EQUALS", value: e },
    performerIdsCriterion: { modifier: "INCLUDES", value: t }
  };
}
function zl(e, t) {
  const n = aa(e.performersCriterion, e.performerId), o = e.slots !== void 0;
  if (!n.length && e.performersCriterion === void 0 && e.performerId === void 0 && !o || o && !t) return e;
  const i = { ...e };
  delete i.performersCriterion, delete i.performerId, delete i.slots;
  const a = Hl(e.slots), s = new Map((t || []).flatMap((d) => (d.slotDefinitionIds || []).map((c) => [String(c), d.key]))), l = Object.entries(a.values).map(([d, c]) => Kl(s.get(String(d)) ?? Tn, [Number(c)]));
  if (n.length && l.push({ [nr]: { modifier: "EQUALS", value: Tn }, performerIdsCriterion: { modifier: "INCLUDES", value: n } }), l.length === 1 && i[Bt] === void 0) i[Bt] = l[0];
  else if (l.length) {
    const d = l.slice(0, Object.keys(a.values).length).map((f) => ({ filter: { [Bt]: f } })), c = d.length > 1 ? [{ group: { operator: "AND", relatedScope: { filterKey: Bt, matchMode: "distinct" }, children: d } }] : d;
    n.length && c.push({ filter: { [Bt]: l.at(-1) } });
    const u = [...i[dn] ? [{ group: i[dn] }] : [], ...c];
    i[dn] = u.length === 1 && u[0].group ? u[0].group : { operator: "AND", children: u };
  }
  return a.activityTagId && i.activitiesCriterion === void 0 && i.activityId === void 0 && (i.activitiesCriterion = { modifier: "INCLUDES", value: [a.activityTagId] }), i;
}
function _l(e) {
  const t = String(e || "").split(",").filter((n) => Nt.includes(n));
  return t.length === 0 ? [...Nt] : [...new Set(t)];
}
function Hl(e) {
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
function ao(e) {
  return Array.isArray(e) ? e.map(ao) : !e || typeof e != "object" ? e : Object.fromEntries(Object.entries(e).filter(([t]) => !t.startsWith("_")).map(([t, n]) => [
    t,
    t === "modifier" && typeof n == "string" && /^[A-Z_]+$/.test(n) ? n.toLowerCase().replace(/_([a-z])/g, (o, i) => i.toUpperCase()) : ao(n)
  ]));
}
function ql(e) {
  var l, d;
  if (!e || typeof e != "object") return null;
  const { [na]: t, [nr]: n, ...o } = e, i = typeof (n == null ? void 0 : n.value) == "string" && n.value ? n.value : Tn, a = typeof (t == null ? void 0 : t.value) == "boolean" ? t.value : null, s = o._matchAll === !0 || !!((d = (l = o.findFilter) == null ? void 0 : l.q) != null && d.trim()) || Object.keys(o.objectFilter || {}).length > 0 || o.performerIdsCriterion !== void 0 || o.ageAtHostDateCriterion !== void 0 || o.performerOccurrenceTagsCriterion !== void 0;
  return !s && a === null && !n ? null : { role: i, performers: s || a === null ? ao(o) : null, unassigned: a };
}
function ra(e, { legacyStates: t = !1 } = {}) {
  var o, i;
  const n = Nt.includes((o = e.reviewStateCriterion) == null ? void 0 : o.value) ? [e.reviewStateCriterion.value] : t && e.states ? _l(e.states) : [];
  return {
    activityTagIds: aa(e.activitiesCriterion, e.activityId),
    includeActivitySubtags: ((i = e.activitiesCriterion) == null ? void 0 : i.depth) === -1,
    reviewStates: n,
    slottedPerformer: ql(e[Bt])
  };
}
function oa(e) {
  if (!e || typeof e != "object" || !Array.isArray(e.children)) return null;
  const t = e.children.flatMap((n) => {
    if (n != null && n.group) {
      const o = oa(n.group);
      return o ? [{ group: o }] : [];
    }
    return n != null && n.filter && typeof n.filter == "object" ? [{ filter: ra(n.filter) }] : [];
  });
  return t.length ? e._semanticNone ? { operator: "NOT", children: t.length === 1 ? t : [{ group: { operator: "OR", children: t } }] } : {
    operator: ["OR", "NOT", "JUST_ONE"].includes(e.operator) ? e.operator : "AND",
    ...e.relatedScope ? { relatedScope: e.relatedScope } : {},
    ...e.distinctRelatedMatches === !0 ? { distinctRelatedMatches: !0 } : {},
    children: t
  } : null;
}
function Wl(e, t) {
  const n = oa(t[dn]);
  return {
    query: String(e.q || "").trim() || null,
    ...ra(t, { legacyStates: !0 }),
    ...n ? { filterExpression: n } : {},
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc"
  };
}
function Vl(e) {
  const { [Bt]: t, [dn]: n, ...o } = e, i = ia(n);
  return i ? { ...o, [dn]: i } : o;
}
function ia(e) {
  if (!e || typeof e != "object" || !Array.isArray(e.children)) return null;
  const t = e.children.flatMap((i) => {
    if (i != null && i.group) {
      const l = ia(i.group);
      return l ? [{ ...i, group: l }] : [];
    }
    if (!(i != null && i.filter) || typeof i.filter != "object") return [];
    const { [Bt]: a, ...s } = i.filter;
    return Object.keys(s).length ? [{ ...i, filter: s }] : [];
  });
  if (!t.length) return null;
  const { relatedScope: n, ...o } = e;
  return { ...o, ...n && n.filterKey !== Bt ? { relatedScope: n } : {}, children: t };
}
function aa(e, t) {
  const n = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(n.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function sa(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Jl(e) {
  var i;
  const t = Number(e.startSec) || 0, n = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(n)) return Math.max(t, n);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Yl(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function gi(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Ql(e, t, n) {
  if (typeof n != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (n(o.startSec, !1), !0) : !1;
}
function ct(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function xo(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Xr(e, t) {
  const n = new Set(xo(t).map((o) => String(ct(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && n.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function nn(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function pi(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(nn).sort().join(",")}`;
}
function la(e, t, n = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((b) => String(b.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(n)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((b) => {
    var g;
    return !((g = b.genderHints) != null && g.length);
  }) && e.length === t.length && !i) {
    const b = [...e].sort((p, k) => String(p.slotDefinitionId).localeCompare(String(k.slotDefinitionId))), g = [...t].sort((p, k) => String(p.name).localeCompare(String(k.name)) || Number(ct(p)) - Number(ct(k)));
    return [{
      assignments: Object.fromEntries(b.map((p, k) => [String(p.slotDefinitionId), String(ct(g[k]))])),
      description: g.map((p) => p.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((b) => t.map((g, p) => ({ performer: g, index: p })).filter(({ performer: g }) => {
    var p;
    return !((p = b.genderHints) != null && p.length) || b.genderHints.some((k) => nn(k) === nn(g.gender || g.genderIdentity));
  }).map(({ index: g }) => g)), u = i ? c.filter((b) => b.length > 0).length : fi(c, t.length);
  if (u === 0) return [];
  const f = new Map(t.map((b, g) => [String(ct(b)), g]));
  function y(b, g, p) {
    if (s.length >= a) return;
    const k = c.slice(b), C = i ? k.filter((j) => j.length > 0).length : fi(k.map((j) => j.filter((G) => !g.has(String(ct(t[G]))))), t.length);
    if (p + C < u) return;
    if (b === e.length) {
      if (p !== u) return;
      const j = Object.fromEntries(d.map(({ slot: E, performer: N }) => [String(E.slotDefinitionId), N ? String(ct(N)) : ""])), G = o.length === 0 ? Object.values(j).sort().join(",") : [...new Set(e.map((E) => String(E.label || "")))].map((E) => `${E}:${d.filter(({ slot: N }) => String(N.label || "") === E).map(({ performer: N }) => N ? String(ct(N)) : "").sort().join(",")}`).join("|");
      !l.has(G) && s.length < a && (l.add(G), s.push({
        assignments: j,
        description: d.map(({ slot: E, performer: N }) => o.length ? `${E.label}: ${(N == null ? void 0 : N.name) || "Unassigned"}` : (N == null ? void 0 : N.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const m = e[b], F = [...d].reverse().find(({ slot: j }) => pi(j) === pi(m)), W = F ? f.get(String(ct(F.performer))) : -1;
    for (const j of c[b]) {
      const G = t[j], E = ct(G);
      if (!(j < W) && !(E == null || !i && g.has(String(E))) && (d.push({ slot: m, performer: G }), i || g.add(String(E)), y(b + 1, g, p + 1), i || g.delete(String(E)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: m, performer: null }), y(b + 1, g, p), d.pop();
  }
  return y(0, /* @__PURE__ */ new Set(), 0), s;
}
function fi(e, t) {
  const n = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), n[s] === -1 || o(n[s], a)))
        return n[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Xl(e, t) {
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
      const f = [...new Set(e.map((y) => y.label || ""))].map((y) => `${y}:${a.filter((b) => (b.slot.label || "") === y).map((b) => b.performer.performerId).sort((b, g) => b - g).join(",")}`).join("|");
      i.has(f) || i.set(f, [...a]);
      return;
    }
    const c = e[l];
    for (const f of t)
      !o && d.has(f.performerId) || (u = c.genderHints) != null && u.length && !c.genderHints.some((y) => nn(y) === nn(f.gender)) || (a.push({ slot: c, performer: f }), o || d.add(f.performerId), s(l + 1, d), o || d.delete(f.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Zl(e) {
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
function ed(e, t, n = 20) {
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
function td(e) {
  return (e || []).flatMap((t) => t.markers.map((n) => ({
    segment: n.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function nd(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function da(e, t, n) {
  const o = ct, i = new Set((t || []).map(o)), a = new Set((n || []).map(nn));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), u = d.isVideoPerformer ?? i.has(o(d));
    if (c !== u) return u - c;
    const f = nn(l.gender || l.genderIdentity), y = nn(d.gender || d.genderIdentity), b = l.matchesGenderHint ?? a.has(f);
    return (d.matchesGenderHint ?? a.has(y)) - b || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
function rd() {
  return null;
}
function od(e) {
  return typeof e == "function" || typeof e == "object" && e !== null && "$$typeof" in e;
}
function ca(e, t) {
  const n = e[t];
  return od(n) ? n : rd;
}
const id = ca(fo, "ExtensionEntityActions"), ad = ca(fo, "ExtensionSelectionActions"), { useEffect: pe, useId: ua, useLayoutEffect: yi, useMemo: ze, useReducer: sd, useRef: ge, useState: B, useSyncExternalStore: ld } = go, r = go.createElement, dd = fo.PERFORMER_CRITERIA ?? [], ma = "/api/plugins/segment-studio";
function _e(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(un) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const n = so();
    return t[e] = n, window.localStorage.setItem(un, JSON.stringify(t)), n;
  } catch {
    return so();
  }
}
function He(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(un) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(un, JSON.stringify(t));
  } catch {
  }
}
function So(e) {
  try {
    return JSON.parse(window.localStorage.getItem(un) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function ko(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(un) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(un, JSON.stringify(t));
  } catch {
  }
}
function cd(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function ud(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((n, o) => {
    const i = setTimeout(n, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function ee(e, t, n = 0) {
  var d;
  const o = await po(`${ma}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = cd(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && n < 2)
    return await ud(250 * (n + 1), t == null ? void 0 : t.signal), ee(e, t, n + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function md(e, t) {
  const n = await po(e, t);
  if (!n.ok) {
    const o = await n.json().catch(() => null);
    throw new Error((o == null ? void 0 : o.error) || (o == null ? void 0 : o.detail) || (o == null ? void 0 : o.title) || "Unable to load Cove data.");
  }
  return n.json();
}
async function gd(e, t) {
  const n = String(e).startsWith("/api/") ? e : `${ma}${e}`, o = await po(n, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: pd(
      o.headers.get("Content-Disposition")
    )
  };
}
function pd(e, t = "segment-studio-ai-feedback.zip") {
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
function Oe(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", n = Math.abs(e), o = Math.floor(n), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((n - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function so() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function ga(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function fd(e) {
  const t = Number(e.selectedSegmentCount) || 0, n = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + n, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = n > 0 ? ` and ${n} dependent derived segment${n === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function pa(e, t) {
  const n = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : n.length;
  return { sceneCount: new Set(n.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function yd(e, t) {
  const { sceneCount: n, segmentCount: o } = pa(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${n} scene${n === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function fa(e, t) {
  const n = (e == null ? void 0 : e.items) || [], o = pa(n, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(yd(n, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await ee("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: _e(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return He(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function bi({ children: e }) {
  return r("span", {
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
function Qu(e, t) {
  return {
    ...(Kt[e] || Kt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function ya(e) {
  return { ...(Kt[e] || Kt.unreviewed).badge };
}
function ba(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const ha = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function bd(e, t, n = "not-applicable", o = !1) {
  const i = Kt[e] || Kt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (n === "empty" || n === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function hd(e, t = !1) {
  const n = "rgb(20, 184, 166)";
  return {
    borderColor: n,
    backgroundColor: n,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function vd(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function xd(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function Sd(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function Mr(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function kd(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function mn({ state: e, includeLabel: t = !0 }) {
  const n = Kt[e] || Kt.unreviewed;
  return r("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: ya(e)
  }, t ? `${n.symbol} ${e}` : n.symbol);
}
function wd(e, t = null) {
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
function Xu(e, t) {
  var a, s, l;
  if (!t) return !1;
  const n = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (n == null ? void 0 : n.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return n === t || ((s = t.contains) == null ? void 0 : s.call(t, n)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || n === (o == null ? void 0 : o.body) && i === o.body;
}
function Nd(e, t = document) {
  return !(e.defaultPrevented || wd(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function Zu(e, t = document, n = !1, o = {}) {
  return Nd(e, t) ? xl(e, n, o) != null : !1;
}
function Id(e, t, n = null) {
  return !(!t || e instanceof Element && (t.contains(e) || n != null && n.contains(e)));
}
function Tt(e, { onCancel: t, onConfirm: n } = {}) {
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
function Cd(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const n = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !n || n.value.trim() !== String(t || "").trim() || (s = n.getAttribute) != null && s.call(n, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function $d({ confirm: e, cancel: t, confirmReady: n }) {
  const o = n && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function wo({ confirmRef: e, cancelRef: t, confirmReady: n }) {
  pe(() => {
    const o = requestAnimationFrame(() => $d({
      confirm: e.current,
      cancel: t == null ? void 0 : t.current,
      confirmReady: n
    }));
    return () => cancelAnimationFrame(o);
  }, [n]);
}
function Yt(e) {
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
function hi(e, t) {
  const n = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < n ? i.filter((a) => a.sequence > o && a.sequence <= n).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > n && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function No(e, t = !0) {
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
function hr(e, t = !0) {
  return {
    type: "segment",
    identity: No(e, t),
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
function Mt(e, t = !0) {
  return {
    type: "segments",
    segments: (e || []).map((n) => ({
      identity: No(n, t),
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
function vr(e, t) {
  return {
    type: "incorrectExamples",
    collected: t,
    entries: (e || []).map(({ segment: n, result: o, example: i }) => ({
      exampleId: (o == null ? void 0 : o.exampleId) ?? (i == null ? void 0 : i.id) ?? null,
      originalIdentity: No(n),
      collectedIdentity: {
        itemId: (o == null ? void 0 : o.itemId) ?? (i == null ? void 0 : i.itemId) ?? null,
        nativeSegmentId: (o == null ? void 0 : o.nativeSegmentId) ?? null,
        published: (o == null ? void 0 : o.nativeSegmentId) != null,
        revision: (o == null ? void 0 : o.revision) ?? null
      }
    }))
  };
}
function Tr(e) {
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
function va(e, t) {
  return (e || []).filter((n) => n.segmentId === t).sort((n, o) => n.sortOrder - o.sortOrder || String(n.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function xa(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e || []) {
    const o = t.get(n.segmentId);
    o ? o.push(n) : t.set(n.segmentId, [n]);
  }
  for (const n of t.values())
    n.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function Io(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((n) => Number(n.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function Td(e, t) {
  const n = (t || []).map((i) => va(e, i.id));
  if (n.length === 0 || n.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: Rt(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return n.every((i) => o(i) === o(n[0])) ? n : null;
}
function Rd(e, t) {
  return new Set((t || []).map((n) => n.tagId)).size !== 1 ? null : Td(e, t);
}
function Ed({ mergeable: e, reviewable: t, tagEditable: n = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    n ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function em(e, t) {
  return Io(va(e, t));
}
function Rt(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function Ad(e, t) {
  const n = (d) => Rt(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
    const c = /* @__PURE__ */ new Map();
    for (const u of d || []) {
      const f = n(u);
      c.has(f) || c.set(f, []), c.get(f).push(u);
    }
    return c;
  }, a = i(e), s = i(t), l = [];
  for (const [d, c] of a) {
    const u = s.get(d);
    if (!u || c.length !== u.length)
      continue;
    const f = [...c].sort(o), y = [...u].sort(o);
    f.forEach((b, g) => l.push({
      sourceSlotDefinitionId: b.id,
      derivedSlotDefinitionId: y[g].id
    }));
  }
  return l;
}
function Md(e, t, n) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = Ad(t, n);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function Dd(e) {
  const t = Rt(e), n = Number(e == null ? void 0 : e.performerId), o = n > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${n}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(Dr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function Dr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function Rr(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const n of e)
    Object.hasOwn(t, n.reviewState) && (t[n.reviewState] += 1);
  return t;
}
function vi(e) {
  const t = [], n = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((u) => u.end <= s && u.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: n,
    counts: Rr(o),
    trackCount: Math.max(1, t.length)
  };
}
function Od(e) {
  const t = e.map(Rt), n = /* @__PURE__ */ new Map();
  for (const i of t) n.set(i, (n.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), n.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function Pd(e, t) {
  const n = e.segments.map((l) => {
    const d = t.get(l.id) || [], u = d.length > 0 && d.every((f) => Number(f.performerId) > 0) ? d.map((f) => `${f.slotDefinitionId}:${Number(f.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: u };
  }), o = [...new Set(n.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [vi({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = Od(l.slots), u = l.slots.filter((p) => !a.has(String(p.slotDefinitionId))), f = o.length === 1 ? l.slots : u, y = f.map((p) => `${c.get(String(p.slotDefinitionId))} · ${p.performerName || `Performer ${p.performerId}`}`).join(" · "), b = [...new Map(f.map((p) => [
          Number(p.performerId),
          { id: Number(p.performerId), name: p.performerName || `Performer ${p.performerId}` }
        ])).values()], g = l.slots.map((p) => ({
          slotDefinitionId: String(p.slotDefinitionId),
          label: c.get(String(p.slotDefinitionId)),
          performer: {
            id: Number(p.performerId),
            name: p.performerName || `Performer ${p.performerId}`
          }
        }));
        s.set(d, {
          ...e,
          key: `${e.key}:performers:${d}`,
          performerLabel: y,
          performers: b,
          performerAssignments: g,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(vi);
}
function cn(e, t = [], n = []) {
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => Pd(s, a));
}
function Co(e) {
  var n;
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
    for (const s of Nt)
      a.counts[s] += Number((n = o.counts) == null ? void 0 : n[s]) || 0;
  }
  return t;
}
function Sa(e) {
  return (e || []).some((t) => t.id != null);
}
const Ld = {
  group: 38,
  lane: 33,
  segment: 41
};
function jd(e, t = []) {
  const n = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = Ld[s.kind];
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
function ka(e, t, n, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(n)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function Fd(e, t = [], n = !0) {
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
function Gd(e, t) {
  const n = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => n.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: Rr(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return Co(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: Rr(a)
    };
  });
}
function wa(e, { nativeOnly: t = !1 } = {}) {
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
function xi(e, t) {
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
function on(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function Zn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function Bd(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var n;
    return (n = t[0]) == null ? void 0 : n.toUpperCase();
  }).join("") || "?";
}
function er({ performer: e, compact: t = !1, tooltip: n = null }) {
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
    }, o ? Bd(e.name) : "—"),
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
function Na({ assignments: e, className: t = "" }) {
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
      r(er, {
        key: `${n.key}:avatar`,
        performer: n.performer
      })
    ];
  }));
}
function Or({ performers: e, performerAssignments: t, interactive: n = !0 }) {
  const o = ge(null), i = `performer-slots-${ua()}`, [a, s] = B(null);
  function l() {
    var b;
    const c = (b = o.current) == null ? void 0 : b.getBoundingClientRect();
    if (!c) return;
    const u = Math.max(0, Math.min(256, window.innerWidth - 16)), f = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), y = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - u - 8, c.right - u)),
      top: y >= f + 8 ? c.bottom + 4 : Math.max(8, c.top - f - 4),
      width: u
    });
  }
  pe(() => {
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
    ...e.slice(0, 3).map((c) => r(er, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? Rs(r("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, r(Na, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : r("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => r(er, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function Ud(e, t) {
  const n = new Set(on(t));
  return (e || []).filter((o) => !n.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function Ia(e, t) {
  return t ? on(e).filter((n) => n !== t) : on(e);
}
function Kd(e, t) {
  const n = on(t), o = new Set(on(e));
  return n.length > 0 && n.every((i) => o.has(i)) ? [] : n;
}
function Ut(e, t) {
  const n = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return n ? n.segmentGroupId == null ? "ungrouped" : `group:${n.segmentGroupId}` : null;
}
function Si(e, t, n) {
  const o = Number(n);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), u = Number.isFinite(c) && c >= d ? c : d, f = d <= o && u >= o, y = f ? 0 : Math.min(Math.abs(o - d), Math.abs(o - u));
    return { contains: f, distance: y, duration: u - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function lo(e, t, n, o = null) {
  var u, f, y, b, g, p;
  const i = e.findIndex((k) => k.markers.some((C) => C.segment.id === t));
  if (i < 0) {
    const k = [...((u = e[0]) == null ? void 0 : u.markers) || []];
    return o != null && Number.isFinite(Number(o)) && k.sort((C, m) => Si(C, m, o)), ((f = k[0]) == null ? void 0 : f.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((k) => k.segment.id === t);
  if (n === "left" || n === "right") {
    const k = n === "left" ? -1 : 1, C = Math.min(a.markers.length - 1, Math.max(0, s + k));
    return ((y = a.markers[C]) == null ? void 0 : y.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (n === "up" ? -1 : 1))), d = Number((b = a.markers[s]) == null ? void 0 : b.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((g = a.markers[s]) == null ? void 0 : g.segment) ?? null : ((p = [...e[l].markers].sort(c ? (k, C) => Si(k, C, Number(o)) : (k, C) => Math.abs(k.segment.startSec - d) - Math.abs(C.segment.startSec - d) || k.segment.startSec - C.segment.startSec || k.segment.id - C.segment.id)[0]) == null ? void 0 : p.segment) ?? null;
}
function zd(e, t, n) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = lo([o], t, n);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function _d(e, t, n) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + n))];
}
function Hd(e, t, n) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(n) ? n : e[0];
}
function qd(e, t) {
  const n = Number(e);
  if (!Number.isFinite(n)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= n) return [Ni(n)];
  const i = o - n, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(n, o - 1e-3);
  return [...new Set(a.map((l) => Ni(Math.min(s, n + l))))];
}
function Wd(e, t) {
  const n = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: n.length > 0 && n.every(i) ? "remove" : "collect",
    segments: n
  };
}
function Vd(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function Vn(e, t) {
  if (!e || !t) return e;
  const n = new Set(t.removedSegmentIds || []), o = new Map(
    (t.identityChanges || []).map((c) => [c.previousId, c.currentId])
  ), i = new Map(
    [...t.upsertedSegments || [], ...t.upsertedBasicSegments || []].map((c) => [c.id, c])
  ), a = (e.segments || []).filter((c) => !n.has(c.id)).map((c) => i.has(c.id) ? { ...c, ...i.get(c.id) } : c), s = new Set(a.map((c) => c.id));
  for (const c of i.values())
    s.has(c.id) || a.push(c);
  a.sort((c, u) => Number(c.startSec) - Number(u.startSec) || String(c.key || "").localeCompare(String(u.key || "")));
  const l = (e.performerSlots || []).filter((c) => !n.has(c.segmentId) || o.has(c.segmentId)).map((c) => o.has(c.segmentId) ? { ...c, segmentId: o.get(c.segmentId) } : c), d = {};
  for (const [c, u] of Object.entries(
    e.performerSlotRevisions || {}
  )) {
    const f = Number(c);
    n.has(f) && !o.has(f) || (d[o.get(f) ?? c] = u);
  }
  return {
    ...e,
    approvedSetVersion: t.approvedSetVersion || e.approvedSetVersion,
    segments: a,
    performerSlots: l,
    performerSlotRevisions: d
  };
}
function ki(e, t, n) {
  const o = Array.isArray(e) ? e : [];
  if (!n) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function Jd(e) {
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
async function Yd(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const n = document.createElement("video");
  n.preload = "auto", n.muted = !0, n.playsInline = !0, n.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(n);
  try {
    if (n.src = `/api/stream/video/${encodeURIComponent(e)}`, await wi(n, "loadeddata"), !n.videoWidth || !n.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = n.videoWidth, o.height = n.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], u = qd(
        d.startSec,
        d.endSec
      );
      for (const [f, y] of u.entries()) {
        Math.abs(n.currentTime - y) > 5e-4 && (n.currentTime = y, await wi(n, "seeked")), i.drawImage(n, 0, 0, o.width, o.height);
        const b = await Qd(o), g = `example-${l + 1}-frame-${f + 1}`;
        c.push({ fieldName: g, timestampSec: y }), s.push({
          fieldName: g,
          file: new File(
            [b],
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
function wi(e, t) {
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
function Qd(e) {
  return new Promise((t, n) => {
    e.toBlob(
      (o) => o ? t(o) : n(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function Ni(e) {
  return Math.round(e * 1e3) / 1e3;
}
function tm(e, t, n) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...n } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Xd(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((n, o) => n.startSec - o.startSec || n.id - o.id)
  };
}
function nm(e, t) {
  const n = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !n.has(o.id))
  };
}
function rm(e, t, n) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? n.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function om(e, t) {
  const n = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...n.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function en(e, t, n, o) {
  const i = (n || []).map((d) => ({ ...d, segmentId: t })), a = e.performerSlots || [], s = a.findIndex((d) => d.segmentId === t), l = a.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...i), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function Zd(e, t) {
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
function An(e, t) {
  return !e || !t ? !1 : e.itemId != null && e.itemId === t.itemId || e.nativeSegmentId != null && e.nativeSegmentId === t.nativeSegmentId ? !0 : e.id != null && e.id === t.id;
}
function $o(e, t) {
  return (e || []).some((n) => (t || []).some((o) => An(n, o)));
}
function Ct(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function Ca(e, t) {
  return (e || []).find((n) => An(t, n)) || null;
}
function $a(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function ec(e, t) {
  var n;
  return ((n = e.running) == null ? void 0 : n.kind) === t;
}
function im(e) {
  return e.running != null || e.queued.length > 0;
}
const Ii = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
function xr(e) {
  return Object.freeze({
    id: e.id,
    kind: e.kind,
    lockId: e.lockId,
    targets: e.targets,
    exclusive: e.exclusive,
    meta: e.meta
  });
}
function tc({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let n = 1, o = null, i = [], a = null, s = !1, l = 0, d = 0;
  const c = () => !t && d < l, u = /* @__PURE__ */ new Map();
  let f = Ii;
  const y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Set();
  let g = [];
  function p() {
    f = o == null && i.length === 0 && a == null ? Ii : Object.freeze({
      running: o ? xr(o) : null,
      queued: Object.freeze(i.map(xr)),
      lastFailure: a
    });
    for (const S of [...b]) S();
    if (o == null && i.length === 0) {
      const S = g;
      g = [];
      for (const M of S) M();
    }
  }
  function k(S, M) {
    y.set(S.id, M.status), S.resolve(M);
  }
  function C(S) {
    if (S.dependsOn == null) return "met";
    const M = y.get(S.dependsOn);
    return M === "fulfilled" ? "met" : M != null ? "failed" : "pending";
  }
  function m(S) {
    o = S;
    const M = { ...e(), taskId: S.id, targets: S.targets };
    M.resolveTargets = () => S.targets.map((R) => Ca(M.segments, R)).filter(Boolean), p();
    let K;
    try {
      K = S.run(M);
    } catch (R) {
      K = Promise.reject(R);
    }
    Promise.resolve(K).then(
      (R) => F(S, { status: "fulfilled", value: R }),
      (R) => F(S, { status: "rejected", error: R })
    );
  }
  function F(S, M) {
    S.settled || (S.settled = !0, k(S, M), !s && (o = null, M.status === "rejected" && (a = Object.freeze({ id: S.id, kind: S.kind, error: M.error })), p(), l += 1, t && W()));
  }
  function W() {
    if (s || o != null || c()) return;
    let S = !1;
    for (let M = 0; M < i.length; M += 1) {
      const K = i[M], R = C(K);
      if (R === "failed") {
        i = i.filter((A) => A !== K), k(K, { status: "dropped", reason: "dependency-failed" }), S = !0, M -= 1;
        continue;
      }
      if (R !== "pending" && !(K.exclusive && M > 0) && !i.slice(0, M).some((A) => $o(A.targets, K.targets)) && !(K.ready && !K.ready(e(), xr(K)))) {
        i = i.filter((A) => A !== K), m(K);
        return;
      }
    }
    S && p();
  }
  function j(S) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((z) => z.exclusive) || o != null && S.whenBusy !== "enqueue" || S.exclusive && (o != null || i.length > 0 || c())) return null;
    let K;
    const R = new Promise((z) => {
      K = z;
    }), A = {
      id: n++,
      kind: S.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: S.lockId ?? -1,
      targets: Object.freeze((S.targets || []).map(E)),
      exclusive: S.exclusive === !0,
      dependsOn: S.dependsOn ?? null,
      ready: S.ready || null,
      meta: S.meta ?? null,
      run: S.run,
      resolve: K
    };
    return i = [...i, A], p(), W(), { id: A.id, done: R };
  }
  function G(S = {}) {
    let M = null;
    const K = j({
      ...S,
      whenBusy: "reject",
      run: () => new Promise((A) => {
        M = A;
      })
    });
    if (!K) return null;
    if (M == null)
      return I((A) => A.id === K.id), null;
    let R = !1;
    return () => {
      R || (R = !0, M(), (o == null ? void 0 : o.id) === K.id && F(o, { status: "fulfilled", value: void 0 }));
    };
  }
  function E(S) {
    return (S == null ? void 0 : S.id) == null || S.itemId != null || S.nativeSegmentId != null ? S : u.get(S.id) || S;
  }
  function N(S, M) {
    u.set(S, { ...M });
    let K = !1;
    for (const R of i)
      R.targets.some((A) => A.id === S && A.itemId == null && A.nativeSegmentId == null) && (R.targets = Object.freeze(R.targets.map((A) => A.id === S ? { ...M } : A)), K = !0);
    return K && p(), K;
  }
  function I(S) {
    const M = i.filter((K) => S(xr(K)));
    if (M.length === 0) return 0;
    i = i.filter((K) => !M.includes(K));
    for (const K of M) k(K, { status: "cancelled" });
    return p(), W(), M.length;
  }
  return {
    enqueue: j,
    acquire: G,
    cancel: I,
    retarget: N,
    stableIdentity: E,
    // The host reads `settledCount()` while rendering and reports it here once that render commits.
    settledCount: () => l,
    markCommitted(S = l) {
      d = Math.max(d, S);
    },
    poke: () => W(),
    subscribe(S) {
      return b.add(S), () => b.delete(S);
    },
    getSnapshot: () => f,
    whenIdle() {
      return o == null && i.length === 0 ? Promise.resolve() : new Promise((S) => g.push(S));
    },
    dispose() {
      if (s) return;
      const S = i;
      i = [], s = !0;
      for (const K of S) k(K, { status: "cancelled" });
      b.clear();
      const M = g;
      g = [];
      for (const K of M) K();
    }
  };
}
let nc = 1;
function Jt() {
  return `pending-${nc++}`;
}
function rc(e) {
  return e.sort((t, n) => t.startSec - n.startSec || t.id - n.id);
}
function Ir(e, t) {
  return (t || []).some((n) => An(n, e));
}
function oc(e, t) {
  return [...e || [], {
    id: t.id ?? Jt(),
    taskId: t.taskId ?? null,
    op: t.op,
    targets: t.targets || (t.segment ? [{ id: t.segment.id }] : []),
    values: t.values || null,
    segment: t.segment || null,
    meta: t.meta || null,
    settled: !1
  }];
}
function Ta(e, t) {
  return t && (e || []).find((n) => {
    var o;
    return ((o = n.meta) == null ? void 0 : o.kind) === "held-tag" && !n.settled && Ir(t, n.targets);
  }) || null;
}
function ic(e) {
  return (e || []).filter((t) => t.op === "insert" && !t.settled).map((t) => t.segment);
}
function Ra(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function Ea(e, t) {
  const n = (e || []).filter((o) => !Ra(o, t));
  return n.length === (e || []).length ? e : n;
}
function Aa(e, t) {
  let n = !1;
  const o = (e || []).map((i) => i.settled || !Ra(i, t) ? i : (n = !0, { ...i, settled: !0, settledDetail: null }));
  return n ? o : e;
}
function ac(e, t, n) {
  let o = !1;
  const i = (e || []).map((a) => a.targets.some((s) => s.id === t && s.itemId == null && s.nativeSegmentId == null) ? (o = !0, {
    ...a,
    targets: a.targets.map((s) => s.id === t ? { ...n } : s)
  }) : a);
  return o ? i : e;
}
function sc(e, t) {
  if (!t || t.length === 0) return e;
  let n = [...e || []];
  for (const o of t)
    if (o.op === "insert")
      n.some((i) => An(o.segment, i)) || n.push(o.segment);
    else if (o.op === "patch")
      n = n.map((i) => Ir(i, o.targets) ? { ...i, ...o.values } : i);
    else if (o.op === "remove")
      n = n.filter((i) => !Ir(i, o.targets));
    else if (o.op === "merge") {
      const [i, ...a] = o.targets;
      n = n.filter((s) => !Ir(s, a)).map((s) => An(i, s) ? { ...s, ...o.values } : s);
    }
  return rc(n);
}
function Ma(e, t) {
  if (!e || e.length === 0) return e;
  const n = [
    ...(t == null ? void 0 : t.segments) || [],
    ...e.filter((a) => a.op === "insert" && !a.settled).map((a) => a.segment)
  ];
  let o = !1;
  const i = [];
  for (const a of e) {
    if (a.op !== "insert" && !a.targets.some((s) => n.some((l) => An(s, l)))) {
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
function lc(e, t, n) {
  return n ? Ea(e, t) : Aa(e, t);
}
function dc(e, t) {
  switch (t.type) {
    case "confirm":
      return lc(e, t.key, t.applied);
    case "add":
      return oc(e, t.entry);
    case "discard":
      return Ea(e, t.key);
    case "settle":
      return Aa(e, t.key);
    case "retarget":
      return ac(e, t.temporaryId, t.identity);
    case "prune":
      return Ma(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
function Ci(e, t, n) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function cc(e) {
  const { acquireSaveLock: t, compatibilityMode: n, dispatchPendingChanges: o, enqueueSave: i, pendingChanges: a, retargetSaveTasks: s, currentTime: l, detail: d, editorFilters: c, endInput: u, hideDerivedSegments: f, historyRef: y, mediaDuration: b, onConflict: g, onDetailChange: p, onReload: k, optimisticSegmentIdRef: C, pendingDuplicateRef: m, pendingFirstSegmentStartSecRef: F, pendingTagEditSegmentIdRef: W, performerSlots: j, replaceSegmentSelection: G, savingSegmentId: E, segments: N, selectedSegment: I, selectedSegmentIdRef: S, selectedSegments: M, selectionAnchorIdRef: K, selectionRangeBaseIdsRef: R, setCreatingSegmentId: A, setEditorFilters: z, setFirstSegmentTagOpen: Y, setHideDerivedSegments: _, setHistory: te, setHistoryOpen: de, setPublishApprovedError: be, setSaveMessage: Z, setSelectedSegmentGroupKey: Ce, setSelectedSegmentId: xe, setSelectedSegmentIds: U, setTagEditing: se, startInput: ce, tagEditingRef: Se, timelineDuration: Ie, video: le } = e;
  function Q(P) {
    y.current = P || Qt, te(y.current);
  }
  async function ye(P, oe, w, q, L = null) {
    var X;
    try {
      const fe = await ee(`/videos/${le.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: y.current.revision,
          kind: P,
          label: oe,
          beforeState: w,
          afterState: q,
          receiptId: L
        })
      });
      return Q(fe), !0;
    } catch (fe) {
      return fe.status === 409 && ((X = fe.payload) != null && X.current) && Q(fe.payload.current), Z("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function T(P, oe, w = !0, q = null, L = !1, X = oe, fe = !0) {
    if (!P || E != null) return null;
    const me = t("segment", P.id);
    if (!me) return null;
    try {
      return await J(P, oe, {
        recordHistory: w,
        historyLabel: q,
        optimisticValues: L ? X : null,
        restoreSelectionOnFailure: fe
      });
    } finally {
      me();
    }
  }
  async function J(P, oe, {
    recordHistory: w = !0,
    historyLabel: q = null,
    optimisticValues: L = null,
    pendingChangeId: X = null,
    restoreSelectionOnFailure: fe = !0,
    onReload: me = k,
    onConflict: Te = g
  } = {}) {
    var ht;
    const pt = M.map((Ze) => Ze.id), Be = S.current, Re = w && !n ? crypto.randomUUID() : null;
    Z(w ? "Saving directly to Cove…" : "Restoring history…");
    const Ye = X ?? (L ? Jt() : null);
    L && !X && o({
      type: "add",
      entry: { id: Ye, op: "patch", targets: [Ct(P)], values: L }
    });
    const it = (Ze) => {
      Ye && o({ type: "confirm", key: Ye, applied: Ze });
    };
    try {
      if (n && P.nativeSegmentId == null && P.itemId != null) {
        const ut = `draft-update:${le.id}:${P.itemId}:${P.revision}:${oe.tagId}:${oe.startSec}:${oe.endSec ?? "open"}:${oe.reviewState ?? P.reviewState}`, Fe = await ee(`/videos/${le.id}/drafts/${P.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(ut),
            expectedRevision: P.revision,
            startSec: oe.startSec,
            endSec: oe.endSec,
            tagId: oe.tagId,
            reviewState: oe.reviewState
          })
        });
        He(ut), Fe.performerSlots != null && p((qe) => en(qe, P.id, Fe.performerSlots, Fe.performerSlotRevision), le.id);
        const Qe = {
          ...P,
          ...Fe.draft,
          id: P.id,
          itemId: P.itemId
        };
        return w && await ye(
          "segment.update",
          q || "Changed segment",
          hr(P, n),
          hr(
            Qe,
            n
          )
        ), Ci(P, oe, n) ? it(await me() != null) : (p((qe) => ({
          ...qe,
          approvedSetVersion: Fe.approvedSetVersion || qe.approvedSetVersion,
          segments: (qe.segments || []).map((Je) => Je.id === P.id ? Qe : Je).sort((Je, st) => Je.startSec - st.startSec || Je.id - st.id)
        }), le.id), it(!0)), Z(((ht = Fe.draft) == null ? void 0 : ht.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), Qe;
      }
      const Ze = await ee(`/videos/${le.id}/segments/${P.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...oe,
          expectedUpdatedAt: P.updatedAt,
          historyReceiptId: Re
        })
      }), yt = {
        ...P,
        ...Ze,
        reviewState: oe.reviewState ?? P.reviewState
      };
      return Ci(P, oe, n) ? it(await me() != null) : (p((ut) => ({
        ...ut,
        segments: (ut.segments || []).map((Fe) => Fe.id === P.id ? yt : Fe).sort((Fe, Qe) => Fe.startSec - Qe.startSec || Fe.id - Qe.id)
      }), le.id), it(!0)), w && await ye(
        "segment.update",
        q || "Changed segment",
        hr(P, n),
        hr(
          yt,
          n
        ),
        Re
      ), Z(w ? "Saved to Cove" : "History restored"), yt;
    } catch (Ze) {
      return Ye && o({ type: "discard", key: Ye }), Ye && fe && (U(pt), xe(Be), K.current = Be, R.current = []), Ze.status === 409 ? (Z("Conflict — loading the latest segment…"), await Te()) : Z(Ze.message || "Unable to save the segment."), null;
    }
  }
  async function $() {
    if (!n) return !1;
    const P = N.filter((q) => !q.published && q.reviewState === "approved").length;
    if (P === 0 || E != null) return !1;
    const oe = `complete-review:${le.id}:${d.approvedSetVersion}`, w = t("publish", -1);
    if (!w) return !1;
    be(""), Z(`Publishing ${P} Approved draft${P === 1 ? "" : "s"}…`);
    try {
      const q = await ee(`/videos/${le.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(oe),
          expectedApprovedSetVersion: d.approvedSetVersion
        })
      });
      He(oe), Q(Qt), de(!1);
      const L = await k(), X = Al(
        N,
        S.current,
        q.published
      ), fe = X ? rt(L == null ? void 0 : L.segments, X) : null;
      return fe && xe(fe.id), Z(`${q.published.length} Approved draft${q.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (q) {
      const L = q.status === 409 ? "The approved drafts changed. Review the updated list and try again." : q.message || "Unable to publish the approved drafts.";
      return q.status === 409 && await g(), be(L), Z(L), !1;
    } finally {
      w();
    }
  }
  async function v(P = null, oe = null) {
    if (E != null || h()) return;
    const w = P != null ? F.current : null, q = Number.isFinite(w) ? w : l, L = Math.min(Ie, q + 20);
    if (L <= q) {
      Z("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const X = $l(N, I, P);
    if (X.kind === "choose-tag") {
      F.current = q, Z(""), Y(!0);
      return;
    }
    if (X.kind === "invalid-selection") {
      Z("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: fe } = X, me = `create-draft:${le.id}:${fe}:${q}`, Te = n ? null : crypto.randomUUID(), pt = S.current, Be = {
      ...I || {},
      id: C.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: fe,
      tagName: oe || (I == null ? void 0 : I.tagName) || "Tag segment",
      tagSortName: fe === (I == null ? void 0 : I.tagId) && (I == null ? void 0 : I.tagSortName) || null,
      startSec: q,
      endSec: L,
      // Full mode creates manual drafts already approved; match it so a queued review toggles as displayed.
      reviewState: n ? "approved" : "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, Re = Xd(d, Be), Ye = Ut(
      cn(Re.segments, Re.segmentGroups || [], Re.performerSlots || []),
      Be.id
    ), it = i({
      kind: "create",
      lockId: -1,
      run: (Ze) => ht(Ze)
    });
    if (!it) return;
    await it.done;
    async function ht({ onReload: Ze, taskId: yt }) {
      var Fe;
      const ut = Jt();
      o({ type: "add", entry: { id: ut, taskId: yt, op: "insert", segment: Be } }), Y(!1), X.openTagEditor && (A(Be.id), W.current = Be.id, se(!0)), G(Be.id), Ce(Ye);
      try {
        let Qe;
        if (n) {
          const st = await ee(`/videos/${le.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: _e(me), tagId: fe, startSec: q, endSec: L })
          });
          He(me), Qe = { itemId: (Fe = st.draft) == null ? void 0 : Fe.itemId }, st.performerSlots != null && p((Ot) => en(Ot, Be.id, st.performerSlots, st.performerSlotRevision), le.id);
        } else
          Qe = { nativeSegmentId: (await ee(`/videos/${le.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: fe,
              startSec: q,
              endSec: L,
              historyReceiptId: Te
            })
          })).id };
        F.current = null, Y(!1);
        const qe = await Ze();
        if (o({ type: "discard", key: ut }), !qe) {
          p((st) => en(st, Be.id, []), le.id), G(pt), Z(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${X.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const Je = rt(qe == null ? void 0 : qe.segments, Qe);
        Je ? (o({ type: "retarget", temporaryId: Be.id, identity: Ct(Je) }), s(Be.id, Ct(Je)), X.openTagEditor && (Se.current && (W.current = Je.id), A(Je.id)), G(Je.id), Ce(Ut(
          cn(qe.segments || [], qe.segmentGroups || [], qe.performerSlots || []),
          Je.id
        )), n || await ye(
          "segment.create",
          "Created segment",
          Mt([], !1),
          Mt([Je], !1),
          Te
        )) : (se(!1), Z(`Segment created, but it could not be selected${X.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (Qe) {
        throw o({ type: "discard", key: ut }), G(pt), P != null && Y(!0), Z(Qe.message || "Unable to create the draft."), Qe;
      } finally {
        A(null);
      }
    }
  }
  function h() {
    return Ta(a, I) ? (Z("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function x() {
    if (M.length !== 1 || !I || E != null || h()) return;
    const P = l;
    if (P <= I.startSec || I.endSec != null && P >= I.endSec) {
      Z("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const oe = `split-draft:${I.itemId}:${I.revision}:${P}`, w = n ? null : Mt([I], !1), q = n ? null : crypto.randomUUID(), L = t("split", I.id);
    if (L)
      try {
        let X = null;
        n && I.nativeSegmentId == null ? (await ee(`/videos/${le.id}/drafts/${I.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(oe),
            expectedRevision: I.revision,
            splitSec: P
          })
        }), He(oe)) : X = { nativeSegmentId: (await ee(`/videos/${le.id}/segments/${I.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: I.updatedAt,
            splitSec: P,
            historyReceiptId: q
          })
        })).id };
        const fe = await k();
        if (!n) {
          const me = [
            rt(fe == null ? void 0 : fe.segments, {
              nativeSegmentId: I.nativeSegmentId ?? I.id
            }),
            rt(
              fe == null ? void 0 : fe.segments,
              X
            )
          ].filter(Boolean);
          await ye(
            "segment.split",
            "Split segment",
            w,
            Mt(me, !1),
            q
          );
        }
        Z(n ? `Segment split; both ranges remain ${I.reviewState}.` : "Segment split.");
      } catch (X) {
        X.status === 409 ? await g() : Z(X.message || "Unable to split the draft.");
      } finally {
        L();
      }
  }
  async function O(P = !1) {
    if (M.length !== 1 || !I || E != null || h()) return;
    const oe = P ? l : I.startSec, w = Cl(le.id, I, P, oe), q = n ? null : crypto.randomUUID(), L = I, X = S.current, fe = L.endSec == null ? null : L.endSec - L.startSec, me = {
      ...L,
      id: C.current--,
      itemId: null,
      nativeSegmentId: null,
      startSec: oe,
      endSec: fe == null ? null : oe + fe,
      // Full mode creates the copy already approved; match it so a queued review toggles as displayed.
      reviewState: n ? "approved" : L.reviewState,
      revision: 0,
      updatedAt: null
    }, Te = (j || []).filter((Re) => Re.segmentId === L.id), pt = i({
      kind: "duplicate",
      lockId: -1,
      targets: [Ct(L)],
      run: (Re) => Be(Re)
    });
    if (!pt) return;
    await pt.done;
    async function Be({ onReload: Re, onConflict: Ye, taskId: it }) {
      var yt, ut;
      const ht = Jt();
      o({ type: "add", entry: { id: ht, taskId: it, op: "insert", segment: me } }), Te.length > 0 && p((Fe) => en(Fe, me.id, Te), le.id), P || (A(me.id), W.current = me.id, se(!0)), G(me.id);
      const Ze = () => {
        o({ type: "discard", key: ht }), Te.length > 0 && p((Fe) => en(Fe, me.id, []), le.id);
      };
      try {
        const Fe = ((yt = m.current) == null ? void 0 : yt.operationKey) === w ? m.current : null;
        let Qe = (Fe == null ? void 0 : Fe.duplicateIdentity) ?? null;
        if (Qe == null && n && L.nativeSegmentId == null) {
          const Ot = await ee(`/videos/${le.id}/drafts/${L.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(w),
              expectedRevision: L.revision,
              startSec: P ? oe : null
            })
          });
          Qe = di(!1, Ot), m.current = { operationKey: w, duplicateIdentity: Qe };
        } else if (Qe == null) {
          const Ot = await ee(`/videos/${le.id}/segments/${L.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: L.updatedAt,
              startSec: P ? oe : null,
              historyReceiptId: q
            })
          });
          Qe = di(!0, Ot), m.current = { operationKey: w, duplicateIdentity: Qe };
        }
        const qe = await Re();
        Ze();
        const Je = rt(qe == null ? void 0 : qe.segments, Qe);
        if (!Je) {
          se(!1), G(X), Z(qe ? "Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection." : "Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.");
          return;
        }
        o({ type: "retarget", temporaryId: me.id, identity: Ct(Je) }), s(me.id, Ct(Je));
        const st = Ji(
          Je,
          qe.performerSlots || [],
          c,
          f,
          qe.segmentGroups || []
        );
        z(st.filters), _(st.hideDerivedSegments), !P && Se.current && (W.current = Je.id), G(Je.id), Ce(Ut(
          cn(qe.segments || [], qe.segmentGroups || [], qe.performerSlots || []),
          Je.id
        )), n && L.nativeSegmentId == null && He(w), m.current = null, Z(P ? "Duplicate created at the playhead." : "Duplicate created in place."), n || await ye(
          "segment.duplicate",
          "Duplicated segment",
          Mt([], !1),
          Mt([Je], !1),
          q
        );
      } catch (Fe) {
        throw Ze(), se(!1), G(X), ((ut = m.current) == null ? void 0 : ut.operationKey) === w ? Z("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : Fe.status === 409 ? await Ye() : Z(Fe.message || "Unable to duplicate the draft."), Fe;
      } finally {
        A(null);
      }
    }
  }
  async function ne() {
    if (M.length !== 1 || !I) return;
    const P = Number(ce), oe = u.trim() === "" ? null : Number(u), w = ti(P, oe, b);
    if (w.error) {
      Z(w.error);
      return;
    }
    if (P === I.startSec && oe === I.endSec) {
      Z("Timing is unchanged.");
      return;
    }
    await T(I, { startSec: P, endSec: oe, tagId: I.tagId }, !0, null, !0);
  }
  async function re(P, oe) {
    if (M.length !== 1 || !I) return;
    const w = ti(P, oe, b);
    if (w.error) {
      Z(w.error);
      return;
    }
    if (P === I.startSec && oe === I.endSec) {
      Z("Timing is unchanged.");
      return;
    }
    await T(I, { startSec: P, endSec: oe, tagId: I.tagId }, !0, null, !0);
  }
  return { acceptHistory: Q, recordHistoryAction: ye, mutateSegment: T, runSegmentMutation: J, completeReview: $, createSegment: v, splitSegment: x, duplicateSegment: O, saveTiming: ne, applyShortcutTiming: re };
}
function uc() {
  const [e, t] = B(() => typeof window < "u" && window.matchMedia(Xo).matches);
  return pe(() => {
    if (typeof window > "u") return;
    const n = window.matchMedia(Xo), o = () => t(n.matches);
    return o(), n.addEventListener("change", o), () => n.removeEventListener("change", o);
  }, []), e;
}
function mc() {
  const [e, t] = B(() => typeof window < "u" && window.matchMedia(Zo).matches);
  return pe(() => {
    if (typeof window > "u") return;
    const n = window.matchMedia(Zo), o = () => t(n.matches);
    return o(), n.addEventListener("change", o), () => n.removeEventListener("change", o);
  }, []), e;
}
function gc() {
  try {
    return Ys(window.localStorage.getItem(Fi));
  } catch {
    return { ...$t };
  }
}
function pc() {
  try {
    return on(JSON.parse(window.localStorage.getItem(Gi) || "[]"));
  } catch {
    return [];
  }
}
function fc(e) {
  try {
    window.localStorage.setItem(Gi, JSON.stringify(on(e)));
  } catch {
  }
}
function yc(e) {
  try {
    window.localStorage.setItem(Fi, JSON.stringify(e));
  } catch {
  }
}
function bc() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Ui) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function hc(e) {
  try {
    return window.localStorage.setItem(Ui, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function vc({ status: e }) {
  const t = ha[e];
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
function rn({ counts: e }) {
  return r("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, Nt.map((t) => r("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...ya(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${Kt[t].symbol}${e[t]}`)));
}
function xc({ videoId: e, segmentId: t, itemId: n, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: u, shortcutRef: f }) {
  const y = xo(a), [b, g] = B(() => Xr(o, y)), [p, k] = B(!1), [C, m] = B(""), F = ge(!1), W = o.map((S) => `${S.slotDefinitionId}:${S.performerId || ""}`).join("|"), j = y.map((S) => ct(S)).join("|"), G = la(
    o,
    y
  );
  pe(() => {
    g(Xr(o, y)), m("");
  }, [t, n, W, j]);
  async function E(S = b) {
    if (!F.current) {
      F.current = !0, k(!0), m("Saving performer slots…");
      try {
        const M = Xr(o.map((A) => ({
          ...A,
          performerId: S[A.slotDefinitionId] || null
        })), y), K = o.map((A) => {
          const z = M[A.slotDefinitionId] ? Number(M[A.slotDefinitionId]) : null, Y = y.find((_) => String(ct(_)) === String(z));
          return {
            ...A,
            performerId: z,
            performerName: (Y == null ? void 0 : Y.name) || null
          };
        });
        if (s(K) === !1) {
          m("");
          return;
        }
        const R = await ee(n != null ? `/videos/${e}/drafts/${n}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((A) => ({ slotDefinitionId: A.slotDefinitionId, performerId: M[A.slotDefinitionId] ? Number(M[A.slotDefinitionId]) : null }))
          })
        });
        m("Performer slots saved."), await l(R, {
          beforeState: Tr([{
            segmentId: t,
            itemId: n,
            revision: i,
            slots: o
          }]),
          afterState: Tr([{
            segmentId: t,
            itemId: n,
            revision: R.revision,
            slots: R.slots || []
          }])
        });
      } catch (M) {
        d && await d(o, M), M.status === 409 ? (m("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : m(M.message || "Unable to save performer slots.");
      } finally {
        F.current = !1, k(!1);
      }
    }
  }
  function N(S, M) {
    m(`Option ${M + 1} applied; save to confirm.`), g({ ...b, ...S.assignments });
  }
  async function I(S) {
    const M = { ...b, ...S.assignments };
    g(M), await E(M);
  }
  return pe(() => {
    if (f)
      return f.current = (S) => F.current || !G[S] ? !1 : (I(G[S]), !0), () => {
        f.current = null;
      };
  }), r("div", { className: "space-y-2" }, [
    G.length ? r("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      r("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      r("div", { key: "options", className: "space-y-2" }, G.map((S, M) => r("button", {
        key: M,
        type: "button",
        disabled: p,
        onClick: () => N(S, M),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${M + 1}: ${S.description}`
      }, [
        r("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, M + 1),
        r("span", { key: "description" }, S.description)
      ]))),
      r("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${G.length} to apply and save`)
    ]) : null,
    r("div", { key: "slots", className: "grid gap-2" }, o.map((S) => r("label", { key: S.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      r("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Rt(S)),
      (S.genderHints || []).length ? r("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(S.genderHints || []).map(Dr).join(" · ")}`) : null,
      r("select", { key: "select", value: b[S.slotDefinitionId] || "", disabled: p, onChange: (M) => g({ ...b, [S.slotDefinitionId]: M.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        r("option", { key: "clear", value: "" }, "No performer assigned"),
        ...da(y, y, S.genderHints).map((M) => r("option", { key: ct(M), value: ct(M) }, M.name))
      ])
    ]))),
    r("div", { key: "actions", className: "flex items-center gap-3" }, [r("button", { key: "save", ref: u, type: "button", disabled: p, onClick: () => E(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), r("span", { key: "message", role: "status", className: "text-xs text-secondary" }, C)])
  ]);
}
function Sc({ videoId: e, targets: t, performerCandidates: n, onSaved: o, onConflict: i, shortcutRef: a, acquireSaveLock: s = () => () => {
} }) {
  var E;
  const l = ((E = t[0]) == null ? void 0 : E.slots) || [], d = xo(n), c = la(
    l,
    d
  ), u = "__mixed__", f = () => Object.fromEntries(l.map((N, I) => {
    const S = t.map((M) => {
      var K;
      return String(((K = M.slots[I]) == null ? void 0 : K.performerId) || "");
    });
    return [N.slotDefinitionId, S.every((M) => M === S[0]) ? S[0] : u];
  })), [y, b] = B(f), [g, p] = B(!1), [k, C] = B(""), m = ge(!1), F = t.map((N) => `${N.itemId ?? `native:${N.segmentId}`}:${N.revision}:${N.slots.map((I) => `${I.slotDefinitionId}:${I.performerId || ""}`).join(",")}`).join("|");
  pe(() => {
    b(f());
  }, [F]);
  async function W(N = y) {
    if (m.current) return;
    const I = s();
    if (!I) {
      C("Wait for the current save to finish before saving performer slots.");
      return;
    }
    m.current = !0, p(!0), C(`Saving performer slots for ${t.length} segments…`);
    const S = [];
    try {
      for (const M of t) {
        const K = M.slots.map((A, z) => {
          const Y = N[l[z].slotDefinitionId];
          return {
            slotDefinitionId: A.slotDefinitionId,
            performerId: Y === u ? A.performerId || null : Y ? Number(Y) : null
          };
        }), R = await ee(M.itemId != null ? `/videos/${e}/drafts/${M.itemId}/slots` : `/videos/${e}/segments/${M.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: M.revision, assignments: K })
        });
        S.push({
          segmentId: M.segmentId,
          itemId: M.itemId,
          revision: R.revision,
          slots: R.slots || []
        });
      }
      C("Performer slots saved."), await o({
        beforeState: Tr(t),
        afterState: Tr(S)
      });
    } catch (M) {
      const K = await i();
      M.status === 409 ? C(K ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : C(M.message || (K ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      m.current = !1, p(!1), I();
    }
  }
  function j(N, I) {
    C(`Option ${I + 1} applied; save to confirm.`), b({ ...y, ...N.assignments });
  }
  async function G(N) {
    const I = { ...y, ...N.assignments };
    b(I), await W(I);
  }
  return pe(() => {
    if (a)
      return a.current = (N) => m.current || !c[N] ? !1 : (G(c[N]), !0), () => {
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
      r("div", { key: "options", className: "space-y-2" }, c.map((N, I) => r("button", {
        key: I,
        type: "button",
        disabled: g,
        onClick: () => j(N, I),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${I + 1} to all selected segments: ${N.description}`
      }, [
        r("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, I + 1),
        r("span", { key: "description" }, N.description)
      ]))),
      r("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${c.length} to apply and save across the selection`)
    ]) : null,
    r("div", { key: "slots", className: "grid gap-2" }, l.map((N) => r("label", {
      key: N.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      r("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Rt(N)),
      r("select", {
        key: "select",
        value: y[N.slotDefinitionId] || "",
        disabled: g,
        onChange: (I) => b({ ...y, [N.slotDefinitionId]: I.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        y[N.slotDefinitionId] === u ? r("option", { key: "mixed", value: u }, "Mixed — leave unchanged") : null,
        r("option", { key: "clear", value: "" }, "No performer assigned"),
        ...da(d, d, N.genderHints).map((I) => r("option", {
          key: ct(I),
          value: ct(I)
        }, I.name))
      ])
    ]))),
    r("div", { key: "actions", className: "flex items-center gap-3" }, [
      r("button", {
        key: "save",
        type: "button",
        disabled: g,
        onClick: () => W(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      r("span", { key: "message", role: "status", className: "text-xs text-secondary" }, k)
    ])
  ]);
}
function zt(e, t = null) {
  const n = String(e || "").trim().toLowerCase();
  return n === "ext:segment-studio:stash-marker-studio" || n === "stash-marker-studio" || n === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : n === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : n === "segment-studio/user" || n === "user" ? "Manual" : n === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : n === "tpdb" ? "TPDB" : n ? n.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function kc(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const n = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (n.length === 0) return zt(t);
  const o = [...new Set(n.map((i) => zt(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function Pr() {
  return r("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function Sr({ name: e }) {
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
function wc({ hidden: e }) {
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
    r(Pr, { key: "derived" })
  ]);
}
function Nc({ segment: e, provenance: t }) {
  var u;
  const [n, o] = B(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = kc(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
  return r("section", { "aria-label": "Segment provenance", className: "rounded-md border border-border bg-surface" }, [
    r("button", {
      key: "toggle",
      type: "button",
      onClick: () => o((f) => !f),
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
      ) : s.map((f) => {
        const y = f.modelIdentifier || f.modelKey, b = f.value == null ? null : typeof f.value == "string" ? f.value : JSON.stringify(f.value);
        return r("div", { key: f.id || `${f.fieldKey}:${f.sourceKey}:${f.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          r(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            zt(f.sourceKey, f.sourceDisplayName)
          ),
          f.fieldKey ? r(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${f.fieldKey}${b == null ? "" : ` · ${b}`}`
          ) : null,
          f.relation === "inherited" ? r("div", { key: "relation", className: "text-secondary" }, "Inherited origin") : null,
          y ? r(
            "div",
            { key: "model", className: "text-secondary" },
            `Model ${y}${f.modelVersion ? ` · ${f.modelVersion}` : ""}`
          ) : null,
          f.activityExternalRunId || f.sourceRunId ? r("div", { key: "run", className: "break-all text-secondary" }, `Run ${f.activityExternalRunId || f.sourceRunId}`) : null,
          f.confidence != null ? r(
            "div",
            { key: "confidence", className: "text-secondary" },
            `Confidence ${Math.round(f.confidence * 100)}%`
          ) : null,
          f.recordedAt || f.createdAt ? r("div", { key: "recorded", className: "text-secondary" }, `Recorded ${f.recordedAt || f.createdAt}`) : null
        ]);
      })
    ) : null
  ]);
}
function Ic({
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
  const [f, y] = B([]), b = e.flatMap((C) => C.lanes.map((m) => m.key)), g = b.join("|");
  pe(() => {
    const C = new Set(b);
    y((m) => m.filter((F) => C.has(F)));
  }, [g]);
  const p = Rr(t), k = !!wa(
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
      a ? r(rn, { key: "counts", counts: p }) : null
    ]),
    r(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      Ed({ mergeable: k, reviewable: a, tagEditable: s, slotsEditable: l })
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
    ...e.map((C) => r("section", {
      key: C.key,
      "data-selected-segment-group": C.key,
      className: "space-y-1.5"
    }, [
      r("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        r("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, C.name),
        r("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${C.selectedCount} selected`)
      ]),
      ...C.lanes.map((m) => {
        const F = f.includes(m.key), W = m.markers.some(({ segment: G }) => G.id === n), j = `selected-segment-lane-${m.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return r("div", {
          key: m.key,
          "data-selected-segment-lane": m.key,
          className: `rounded-md border ${W ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          r("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": F,
            "aria-controls": j,
            "aria-current": W ? "true" : void 0,
            onClick: () => y((G) => F ? G.filter((E) => E !== m.key) : [...G, m.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            r("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, F ? "▾" : "▸"),
            r("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Zn(m)),
            r("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(m.selectedCount)),
            a ? r(rn, { key: "states", counts: m.counts }) : null
          ]),
          F ? r("div", {
            key: "segments",
            id: j,
            className: "space-y-1 border-t border-border p-1.5"
          }, m.markers.map(({ segment: G }) => {
            const E = G.endSec == null ? Oe(G.startSec) : `${Oe(G.startSec)} – ${Oe(G.endSec)}`;
            return r("button", {
              key: G.id,
              type: "button",
              onClick: () => i(G),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${G.id === n ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${G.tagName || "Segment"}, ${G.reviewState}, ${E}` : `${G.tagName || "Segment"}, ${E}`,
              "aria-current": G.id === n ? "true" : void 0
            }, [
              a ? r(mn, {
                key: "state",
                state: G.reviewState,
                includeLabel: !1
              }) : null,
              G.isDerived ? r(Pr, { key: "derived" }) : null,
              r("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, E),
              r(
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
const Vt = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"]
}, Da = "com.midnightrider.segment-studio", Cc = /* @__PURE__ */ new Set(["hasSegments"]), $c = /* @__PURE__ */ new Set(["segment_count", "unreviewed_count"]), Tc = {
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
function Jn(e, t, n) {
  return { extensionId: Da, filterId: e, modifier: t, value: n };
}
function $i(e) {
  return typeof e == "boolean" ? e : e === "has" ? !0 : e === "none" ? !1 : null;
}
function Ti(e) {
  const t = Ar(e == null ? void 0 : e.value), n = Ar(e == null ? void 0 : e.excludes), o = { INCLUDES_ALL: "includesall", EXCLUDES: "excludes", IS_NULL: "isnull", NOT_NULL: "notnull" }[e == null ? void 0 : e.modifier] ?? "includes";
  return o === "isnull" || o === "notnull" ? Jn("segment-tags", o, {}) : t.length === 0 && (o === "excludes" || n.length === 0) ? null : Jn("segment-tags", o, {
    ...t.length > 0 ? { value: t } : {},
    ...n.length > 0 && o !== "excludes" ? { excludes: n } : {},
    ...(e == null ? void 0 : e.depth) === -1 ? { depth: -1 } : {}
  });
}
function co(e = {}, { fullMode: t = !0 } = {}) {
  var k, C, m;
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
  if (!n.some((F) => Object.hasOwn(e, F))) return e;
  const o = { ...e };
  n.forEach((F) => delete o[F]);
  const i = [], a = $i(((k = e.hasSegmentsCriterion) == null ? void 0 : k.value) ?? e.segments);
  a !== null && i.push(Jn("has-segments", "equals", a));
  const s = ((C = e.reviewStateCriterion) == null ? void 0 : C.value) ?? e.reviewState;
  t && ["unreviewed", "approved", "rejected"].includes(s) && i.push(Jn("review-state", "equals", s));
  const l = $i(((m = e.shotBoundariesCriterion) == null ? void 0 : m.value) ?? e.shotBoundaries);
  t && l !== null && i.push(Jn("has-shot-boundaries", "equals", l));
  const d = Number(e.segmentTagId ?? e.tagId) || null, c = e.segmentTagsCriterion ? Ti(e.segmentTagsCriterion) : d ? Ti({ value: [d] }) : null;
  c && i.push(c);
  const u = Ar(e.videoTagIds);
  u.length > 0 && !o.tagsCriterion && (o.tagsCriterion = { modifier: "INCLUDES", value: u });
  const f = Ar(e.performerIds);
  f.length > 0 && !o.performersCriterion && (o.performersCriterion = { modifier: "INCLUDES", value: f });
  const y = Number(e.studioId) || null;
  y && !o.studiosCriterion && (o.studiosCriterion = { modifier: "INCLUDES", value: [y] });
  const b = Array.isArray(e.extensionCriteria) ? e.extensionCriteria : [], g = new Set(b.filter((F) => (F == null ? void 0 : F.extensionId) === Da).map((F) => F.filterId)), p = [...b, ...i.filter((F) => !g.has(F.filterId))];
  return p.length > 0 ? o.extensionCriteria = p : delete o.extensionCriteria, o;
}
function uo(e) {
  return $c.has(e == null ? void 0 : e.sort) ? { ...e, sort: Vt.defaultFilter.sort, direction: Vt.defaultFilter.direction } : e;
}
function Er(e) {
  return Array.isArray(e) ? e.map(Er) : !e || typeof e != "object" ? e : Object.fromEntries(Object.entries(e).map(([t, n]) => [
    t,
    t === "modifier" && typeof n == "string" ? Tc[n] ?? n : Er(n)
  ]));
}
function Rc(e, t, { fullMode: n = !0 } = {}) {
  var d;
  const o = uo(e), i = {
    page: o.page || 1,
    perPage: o.perPage || Vt.defaultFilter.perPage,
    sort: o.sort || Vt.defaultFilter.sort,
    direction: o.direction || Vt.defaultFilter.direction
  };
  o.q && (i.q = o.q), i.sort === "random" && Number.isInteger(o.seed) && o.seed > 0 && (i.seed = o.seed);
  const a = { ...co(t, { fullMode: n }) };
  delete a.includeCompilationGroups;
  const { _filterExpression: s, ...l } = a;
  return {
    findFilter: i,
    objectFilter: Er(l),
    ...(d = s == null ? void 0 : s.children) != null && d.length ? { filterExpression: Er(s) } : {}
  };
}
function Ec(e) {
  return e.filter((t) => !Cc.has(t.id));
}
function Ac(e, t) {
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
function rr(e, t, n) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(n));
}
function Oa(e, t, n) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(n));
}
function Ar(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((n) => Number.isInteger(n) && n > 0))];
}
function Mc(e, t, n, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(n);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((u) => a.add(u));
  } else a.has(n) ? a.delete(n) : a.add(n);
  return a;
}
function Pa({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? r("div", { className: "text-[11px]" }, r(bi, null, "No tag segments")) : t ? r("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, Nt.flatMap((n) => {
    const o = Number(e[`${n}Count`]) || 0;
    if (o === 0) return [];
    const i = Kt[n];
    return [r("span", {
      key: n,
      title: `${o} ${n} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : r(
    "div",
    { className: "text-[11px]" },
    r(bi, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function La({ item: e, selected: t, selectionActive: n, onSelect: o }) {
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
function Dc({ item: e, onNavigate: t, showReviewStates: n = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      onClick: (l) => rr(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    r("div", { key: "media", className: "relative aspect-video bg-black" }, [
      r("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      r(La, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? r("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, Es(e.duration)) : null
    ]),
    r("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      r("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      r("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? r("span", { key: "date" }, e.date) : null,
        e.organized ? r("span", { key: "organized" }, "Organized") : null,
        e.isVr ? r("span", { key: "vr" }, "VR") : null
      ]),
      r("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, r(Pa, { item: e, showReviewStates: n }))
    ])
  ]);
}
function Oc({ item: e, onNavigate: t, showReviewStates: n = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return r("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    r(La, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
    r(i ? "div" : "a", {
      key: "link",
      href: i ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: i ? void 0 : (l) => rr(l, t, s),
      className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }, [
      r("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
      r("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
        r("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
        r(Pa, { key: "segments", item: e, showReviewStates: n })
      ]),
      r("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function To({ active: e, onNavigate: t, showBin: n = !1, profile: o }) {
  const i = Pl(o);
  return r("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    r("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => r("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => rr(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    r("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      n && En(
        o,
        Xt.recyclingBinView
      ) ? r(ja, { key: "bin", onNavigate: t }) : null,
      r(Fa, { key: "settings", onNavigate: t })
    ])
  ]);
}
const mo = "segment-studio:recycling-bin-changed";
function Pc(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function Yn() {
  window.dispatchEvent(new CustomEvent(mo));
}
function ja({ onNavigate: e, compact: t = !1 }) {
  const [n, o] = B(null);
  pe(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const u = await ee("/bin"), f = Number(u == null ? void 0 : u.totalCount);
        !a && c === s && o(Number.isFinite(f) && f >= 0 ? Math.trunc(f) : null);
      } catch {
        !a && c === s && o(null);
      }
    }, d = () => {
      l();
    };
    return l(), window.addEventListener(mo, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(mo, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = Pc(n);
  return r("a", {
    href: "/segment-studio/bin",
    onClick: (a) => rr(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": n == null ? "Open recycling bin" : `Open recycling bin, ${n} item${n === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [r("span", { key: "icon", "aria-hidden": "true" }, "♲"), r("span", { key: "label" }, i)]);
}
function Fa({ onNavigate: e, compact: t = !1 }) {
  return r("a", {
    href: "/segment-studio/settings",
    onClick: (n) => rr(n, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [r("span", { key: "icon", "aria-hidden": "true" }, "⚙"), r("span", { key: "label" }, "Settings")]);
}
function Lc({ mode: e, onModeChange: t, disabled: n = !1 }) {
  function o(i) {
    const a = io(i.target.value);
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
function jc({ minimum: e, maximum: t, onChange: n }) {
  const o = ge(null), [i, a] = B("maximum"), s = (y, b) => {
    const g = il(e, t, y, b);
    a(g.coincidentTop), n({ minimum: g.minimum, maximum: g.maximum });
  }, l = (y, b) => {
    var p;
    const g = (p = o.current) == null ? void 0 : p.getBoundingClientRect();
    g && s(y, ol(b.clientX, g.left, g.width));
  }, d = (y, b) => {
    var g, p;
    b.preventDefault(), (p = (g = b.currentTarget).setPointerCapture) == null || p.call(g, b.pointerId), l(y, b);
  }, c = (y, b) => {
    var g, p;
    (p = (g = b.currentTarget).hasPointerCapture) != null && p.call(g, b.pointerId) && l(y, b);
  }, u = (y, b) => {
    const g = y === "minimum" ? e : t, p = y === "minimum" ? 0 : e, k = y === "minimum" ? t : 1, C = b.shiftKey ? 0.1 : 0.01;
    let m = null;
    ["ArrowLeft", "ArrowDown"].includes(b.key) && (m = g - C), ["ArrowRight", "ArrowUp"].includes(b.key) && (m = g + C), b.key === "PageDown" && (m = g - 0.1), b.key === "PageUp" && (m = g + 0.1), b.key === "Home" && (m = p), b.key === "End" && (m = k), m != null && (b.preventDefault(), s(y, Math.min(k, Math.max(p, m))));
  }, f = (y, b) => r("span", {
    key: y,
    role: "slider",
    tabIndex: 0,
    "aria-label": y === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((y === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((y === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(b * 100),
    "aria-valuetext": `${Math.round(b * 100)} percent`,
    onPointerDown: (g) => d(y, g),
    onPointerMove: (g) => c(y, g),
    onKeyDown: (g) => u(y, g),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${b * 100}%`,
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
        f("minimum", e),
        f("maximum", t)
      ])
    )
  ]);
}
function Fc({ saving: e, error: t, onSelect: n, onClose: o }) {
  const i = ge(null);
  pe(() => {
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
    onKeyDownCapture: (s) => Tt(s, { onCancel: a })
  }, r("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: Yt,
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
    r(Qn, {
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
function Gc({
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
  const f = Dt(e), y = [...new Map((a || []).map((m) => [
    Number(m.tagId),
    m.tagName || `Tag ${m.tagId}`
  ])).entries()].sort((m, F) => m[1].localeCompare(F[1]) || m[0] - F[0]), b = new Set((a || []).map((m) => Number(m.tagId))), g = (s || []).filter((m) => Number(m.id) === f.segmentGroupId || (m.tags || []).some((F) => b.has(Number(F.tagId)))), p = (m) => d(Dt({ ...f, ...m })), k = (m) => p({
    reviewStates: f.reviewStates.includes(m) ? f.reviewStates.filter((F) => F !== m) : [...f.reviewStates, m]
  }), C = (m) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${m ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && u();
    },
    onKeyDownCapture: (m) => Tt(m, { onCancel: u })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: Yt,
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
        r("div", { className: "flex flex-wrap gap-2" }, Nt.map((m) => {
          const F = f.reviewStates.includes(m), W = Kt[m];
          return r("button", {
            key: m,
            type: "button",
            onClick: () => k(m),
            "aria-pressed": F,
            className: C(F)
          }, `${W.symbol} ${m} (${i[m] || 0})`);
        }))
      ]) : null,
      l ? r("fieldset", { key: "performer", className: "space-y-2" }, [
        r("legend", { className: "text-sm font-semibold text-foreground" }, "Performer"),
        r("p", { className: "text-xs text-secondary" }, "Any assigned slot may match the selected performer."),
        r("div", { className: "flex flex-wrap gap-2" }, [
          r("button", {
            key: "any",
            type: "button",
            onClick: () => p({ performerId: null }),
            "aria-pressed": f.performerId == null,
            className: C(f.performerId == null)
          }, "All performers"),
          ...n.map((m) => {
            const F = Number(ct(m));
            return r("button", {
              key: F,
              type: "button",
              onClick: () => p({ performerId: F }),
              "aria-pressed": f.performerId === F,
              className: C(f.performerId === F)
            }, m.name);
          })
        ])
      ]) : null,
      r("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        r("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          r("span", { key: "label" }, "Tag"),
          r("select", {
            key: "select",
            value: f.tagId ?? "",
            onChange: (m) => p({
              tagId: m.target.value === "" ? null : Number(m.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            r("option", { key: "all", value: "" }, "All tags"),
            ...y.map(([m, F]) => r("option", { key: m, value: m }, F))
          ])
        ]),
        r("label", {
          key: "segment-group",
          className: "space-y-1 text-xs text-secondary"
        }, [
          r("span", { key: "label" }, "Segment group"),
          r("select", {
            key: "select",
            value: f.segmentGroupId ?? "",
            onChange: (m) => p({
              segmentGroupId: m.target.value === "" ? null : m.target.value === "ungrouped" ? "ungrouped" : Number(m.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            r("option", { key: "all", value: "" }, "All Segment groups"),
            ...g.map((m) => r("option", { key: m.id, value: m.id }, m.name)),
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
            onClick: () => p({ sourceKey: null }),
            "aria-pressed": f.sourceKey == null,
            className: C(f.sourceKey == null)
          }, "All provenance"),
          ...o.map((m) => r("button", {
            key: m,
            type: "button",
            onClick: () => p({ sourceKey: m }),
            "aria-pressed": f.sourceKey === m,
            title: m,
            className: C(f.sourceKey === m)
          }, zt(m)))
        ])
      ]),
      r("fieldset", { key: "confidence", className: "space-y-3" }, [
        r("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        r(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        r(jc, {
          minimum: f.confidenceMin,
          maximum: f.confidenceMax,
          onChange: ({ minimum: m, maximum: F }) => p({
            confidenceMin: m,
            confidenceMax: F
          })
        }),
        r("label", {
          key: "unscored",
          className: "flex items-center gap-2 text-xs text-secondary"
        }, [
          r("input", {
            key: "input",
            type: "checkbox",
            checked: f.includeUnscored,
            onChange: (m) => p({
              includeUnscored: m.target.checked
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
          onChange: (m) => c(m.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]"
        }),
        r(wc, { key: "icon", hidden: t }),
        r("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    r("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      r("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(Dt({})), l && c(!1);
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
const Ga = "segment-studio-editor-history";
function Bc({ history: e, historySaving: t, anchorRef: n, onRestore: o, onClose: i }) {
  const a = ge(null);
  return pe(() => {
    const s = (d) => {
      Id(d.target, a.current, n == null ? void 0 : n.current) && i();
    }, l = (d) => {
      var f, y, b;
      if (d.key !== "Escape" || d.defaultPrevented || document.querySelector("[role='dialog'], [aria-modal='true']")) return;
      const c = document.activeElement, u = c instanceof Element && (((f = a.current) == null ? void 0 : f.contains(c)) || ((y = n == null ? void 0 : n.current) == null ? void 0 : y.contains(c)));
      d.preventDefault(), i(), u && ((b = n == null ? void 0 : n.current) == null || b.focus({ preventScroll: !0 }));
    };
    return document.addEventListener("pointerdown", s), document.addEventListener("keydown", l), () => {
      document.removeEventListener("pointerdown", s), document.removeEventListener("keydown", l);
    };
  }, [n, i]), r("div", {
    ref: a,
    id: Ga,
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
function Uc({ reviewMode: e, bindings: t, onClose: n }) {
  const o = tr.filter((l) => Rn(l, e)), i = si(o, 1)[0], a = si(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((u) => r("div", { key: u.id, className: "flex items-center justify-between text-sm" }, [
      r("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, u.description),
      r(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[u.id] ? t[u.id].length > 0 ? t[u.id] : ["Unassigned"] : u.bindings.map(Xi)).map((f, y) => r("kbd", { key: `${u.id}:${y}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, f))
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
    onKeyDownCapture: (l) => Tt(l, { onCancel: n })
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
function Kc({
  examples: e,
  exporting: t,
  removingExampleId: n,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = Jd(e), [l, d] = B([]), c = s.map((u) => u.tagName).join("|");
  return pe(() => {
    const u = new Set(s.map((f) => f.tagName));
    d((f) => f.filter((y) => u.has(y)));
  }, [c]), r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !t && n == null && a();
    },
    onKeyDownCapture: (u) => Tt(u, {
      onCancel: t || n != null ? void 0 : a
    })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: Yt,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    r("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      r("h2", { key: "title", id: "segment-studio-examples-title", className: "text-lg font-semibold text-foreground" }, "AI Feedback"),
      r("p", { key: "description", className: "mt-1 text-sm text-secondary" }, `${e.length} registered-AI example${e.length === 1 ? "" : "s"} in this video. Expand a tag to inspect or restore examples before export.`)
    ]),
    r("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      r("div", { key: "items", className: "space-y-3" }, e.length ? s.map((u, f) => {
        const y = l.includes(u.tagName), b = `incorrect-example-tag-${f}`;
        return r("section", {
          key: u.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          r("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": y,
            "aria-controls": b,
            onClick: () => d((g) => y ? g.filter((p) => p !== u.tagName) : [...g, u.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: Mr(!1) }
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
            id: b,
            className: "divide-y divide-border border-t border-border"
          }, u.examples.map((g) => {
            const p = `${Oe(g.startSec)}${g.endSec == null ? "" : ` – ${Oe(g.endSec)}`}`, k = n === g.id;
            return r("div", {
              key: g.id,
              className: "flex items-center justify-between gap-3 px-3 py-2 text-sm"
            }, [
              r(
                "span",
                { key: "time", className: "font-mono text-xs text-secondary" },
                p
              ),
              r("button", {
                key: "remove",
                type: "button",
                disabled: t || n != null,
                onClick: () => i(g),
                "aria-label": `${k ? "Restoring" : "Restore to review"} ${u.tagName} example at ${p}`,
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
function zc({ segments: e, onSelect: t, onClose: n }) {
  const [o, i] = B(""), [a, s] = B(0), l = ge(null), d = ze(() => ed(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), u = nd(d);
  pe(() => {
    var y;
    (y = l.current) == null || y.scrollIntoView({ block: "nearest" });
  }, [c, o]);
  const f = () => {
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
      var b;
      if (y.key === "Tab")
        Yt(y);
      else if (y.key === "Escape")
        y.preventDefault(), y.stopPropagation(), n();
      else if (y.key === "ArrowDown" || y.key === "ArrowUp") {
        y.preventDefault(), y.stopPropagation();
        const g = y.key === "ArrowDown" ? 1 : -1;
        s((p) => d.length ? (p + g + d.length) % d.length : 0);
      } else y.key === "Enter" && !((b = y.nativeEvent) != null && b.isComposing) && (y.preventDefault(), y.stopPropagation(), f());
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
    }, d.length ? d.flatMap((y, b) => {
      var j;
      const g = y.segment || y, p = g.endSec == null ? Oe(g.startSec) : `${Oe(g.startSec)} – ${Oe(g.endSec)}`, k = `${zt(g.sourceKey)}${g.confidence == null ? "" : ` · ${Math.round(g.confidence * 100)}%`}`, C = b === c, m = b > 0 ? d[b - 1].groupKey : null, F = u && y.groupKey !== m ? r("div", {
        key: `group:${y.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, y.groupName) : null, W = r("button", {
        key: g.id,
        id: `segment-quick-search-${g.id}`,
        ref: C ? l : null,
        type: "button",
        role: "option",
        "aria-selected": C,
        onMouseEnter: () => s(b),
        onClick: () => t(g),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${C ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        u ? r("span", { key: "group", className: "sr-only" }, `${y.groupName} group`) : null,
        r(mn, { key: "review", state: g.reviewState, includeLabel: !1 }),
        r(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          g.tagName || "Tag segment"
        ),
        (j = y.performers) != null && j.length ? r(Or, {
          key: "performers",
          performers: y.performers,
          performerAssignments: y.performerAssignments
        }) : null,
        r(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          p
        ),
        r("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: k
        }, k)
      ]);
      return F ? [F, W] : [W];
    }) : r("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function _c(e) {
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
function Hc({
  drafts: e,
  processing: t,
  error: n,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = ze(() => _c(e), [e]), [l, d] = B([]), c = s.reduce((b, g) => b + g.drafts.length, 0), u = ge(null);
  wo({ confirmRef: u, cancelRef: o, confirmReady: !t && c > 0 });
  const f = (b) => d((g) => g.includes(b) ? g.filter((p) => p !== b) : [...g, b]), y = (b) => `segment-studio-publish-approved-${b.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && !t && a();
    },
    onKeyDownCapture: (b) => Tt(b, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: Yt,
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
      ].flatMap(([b, g]) => [
        r("dt", { key: `${b}:label`, className: "text-secondary" }, b),
        r("dd", { key: `${b}:value`, className: "font-semibold text-foreground" }, String(g))
      ])),
      s.length ? r("div", { key: "groups", className: "space-y-2" }, s.map((b) => {
        const g = l.includes(b.key);
        return r("section", { key: b.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          r("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": g,
            "aria-controls": y(b),
            onClick: () => f(b.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: Mr(!1) }
          }, [
            r("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, g ? "▾" : "▸"),
            r("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, b.tagName),
            r(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${b.drafts.length} draft${b.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          g ? r("div", {
            key: "drafts",
            id: y(b),
            className: "divide-y divide-border border-t border-border"
          }, b.drafts.map((p) => {
            const k = p.endSec == null ? Oe(p.startSec) : `${Oe(p.startSec)} – ${Oe(p.endSec)}`, C = `${zt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`;
            return r("div", { key: p.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              r(mn, { key: "review", state: p.reviewState, includeLabel: !1 }),
              r("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, k),
              r("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: C
              }, C)
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
function qc({ candidates: e, processing: t, error: n, onConfirm: o, onClose: i }) {
  const a = Zl(e), [s, l] = B(() => /* @__PURE__ */ new Set()), [d, c] = B(() => new Set(a.map((p) => p.key))), u = a.flatMap((p) => d.has(p.key) ? p.candidates : []), f = (p) => l((k) => {
    const C = new Set(k);
    return C.has(p) ? C.delete(p) : C.add(p), C;
  }), y = (p) => c((k) => {
    const C = new Set(k);
    return C.has(p) ? C.delete(p) : C.add(p), C;
  }), b = (p) => p.assignment.map(({ slot: k, performer: C }) => `${k.label || `Slot ${k.sortOrder + 1}`}: ${C.name}`).join(", "), g = (p) => `segment-studio-auto-assign-${p.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (p) => {
      p.target === p.currentTarget && !t && i();
    },
    onKeyDownCapture: (p) => {
      p.key === "Enter" && p.target instanceof HTMLInputElement || Tt(p, {
        onCancel: t ? void 0 : i,
        onConfirm: u.length && !t ? () => o(u) : void 0
      });
    }
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: Yt,
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
      e.length ? r("div", { className: "space-y-3" }, a.map((p) => r("section", { key: p.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
        r("header", {
          key: "header",
          className: "flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2",
          style: { background: Mr(!1) }
        }, [
          r("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(p.key),
            disabled: t,
            onChange: () => y(p.key),
            "aria-label": `Include ${p.tagName} assignment: ${b(p)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          r("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(p.key),
            "aria-controls": g(p),
            "aria-label": `${s.has(p.key) ? "Collapse" : "Expand"} ${p.tagName} assignment: ${b(p)}`,
            onClick: () => f(p.key),
            className: "shrink-0 rounded px-1 text-sm text-secondary hover:bg-muted/50 hover:text-foreground disabled:opacity-50"
          }, s.has(p.key) ? "▾" : "▸"),
          r(
            "span",
            { key: "tag", className: "min-w-24 flex-1 truncate text-sm font-semibold text-foreground" },
            p.tagName
          ),
          r(
            "span",
            { key: "performers", className: "flex min-w-0 flex-wrap items-center gap-2" },
            p.assignment.map(({ slot: k, performer: C }) => {
              const m = k.label || `Slot ${k.sortOrder + 1}`;
              return r("span", {
                key: k.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${m}: ${C.name}`
              }, [
                r("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${m}: ${C.name}`
                }, `${m}: ${C.name}`),
                r(er, {
                  key: "avatar",
                  performer: { id: C.performerId, name: C.name },
                  compact: !0
                })
              ]);
            })
          ),
          r(rn, { key: "states", counts: p.counts }),
          r("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(p.candidates),
            "aria-label": `Auto-Assign ${p.tagName}: ${b(p)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${p.candidates.length})`)
        ]),
        s.has(p.key) ? r(
          "div",
          { key: "segments", id: g(p), className: "divide-y divide-border/70" },
          p.candidates.map((k) => {
            const C = k.endSec == null ? Oe(k.startSec) : `${Oe(k.startSec)} – ${Oe(k.endSec)}`, m = `${zt(k.sourceKey)}${k.confidence == null ? "" : ` · ${Math.round(k.confidence * 100)}%`}`;
            return r("div", {
              key: k.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              r(mn, { key: "review", state: k.reviewState, includeLabel: !1 }),
              r(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                k.tagName || "Tag segment"
              ),
              r(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                C
              ),
              r("span", {
                key: "provenance",
                className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                title: m
              }, m)
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
function Wc({ preview: e, onConfirm: t, onClose: n }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && n();
    },
    onKeyDownCapture: (d) => Tt(d, { onCancel: n, onConfirm: t })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: Yt,
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
function Vc({
  merge: e,
  processing: t,
  undoable: n = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = B(!1), d = ge(null);
  if (wo({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Oe(e.endSec);
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !t && a();
    },
    onKeyDownCapture: (u) => Tt(u, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: Yt,
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
        `${Oe(e.startSec)} – ${c}`
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
function Jc(e) {
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
function Yc({ preview: e, loading: t, processing: n, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var f, y;
  const l = e ? e.createCount + e.linkCount : 0, d = ge(null);
  wo({ confirmRef: d, cancelRef: i, confirmReady: !t && !n && l > 0 && !o });
  const c = ((f = e == null ? void 0 : e.outputs) == null ? void 0 : f.slice(0, 200)) || [], u = Jc(c);
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && !n && s();
    },
    onKeyDownCapture: (b) => Tt(b, {
      onCancel: n ? void 0 : s,
      onConfirm: e && l > 0 && !n ? a : void 0
    })
  }, r("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: Yt,
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
        ].flatMap(([b, g]) => [
          r("dt", { key: `${b}:label`, className: "text-secondary" }, b),
          r("dd", { key: `${b}:value`, className: "font-semibold text-foreground" }, String(g))
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
                `${b.rootTagName} @ ${Oe(b.rootStartSec)}`
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
              b.outputs.map((g, p) => r("div", {
                key: `${g.ruleId}:${g.depth}:${p}`,
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
function Qc({
  compatibilityMode: e,
  selectedSegment: t,
  selectedSegments: n = [],
  selectedGroups: o = [],
  saveMessage: i,
  savingSegmentId: a,
  creatingSegmentId: s = null,
  saveTag: l,
  saveTiming: d,
  slotStatus: c,
  performerSlotsAvailable: u,
  selectedPerformerSlots: f,
  performerSlots: y,
  detail: b,
  video: g,
  slotButtonRef: p,
  tagSearchRef: k,
  onDetailChange: C,
  setSaveMessage: m,
  acquireSaveLock: F,
  onSlotsChanged: W,
  onRecordHistory: j,
  onCancelQueuedReview: G,
  splitSegment: E,
  duplicateSegment: N,
  provenance: I,
  lineage: S,
  onNavigateLineageItem: M,
  tagEditing: K,
  onCancelTagEditing: R,
  detailPanelRef: A,
  onReduceSelection: z
}) {
  var ce, Se, Ie, le;
  const Y = ge(null), _ = ge(null), te = () => {
    var Q;
    (Q = _.current) == null || Q.call(_), _.current = null;
  }, de = ge(null), be = ge(null), Z = ge(null), Ce = ge(null), [xe, U] = B(!1);
  pe(() => {
    Y.current && (Y.current.scrollTop = 0), U(!1);
  }, [t == null ? void 0 : t.id]), pe(() => {
    var Q, ye;
    xe && ((ye = (Q = de.current) == null ? void 0 : Q.querySelector("input, select, button")) == null || ye.focus({ preventScroll: !0 }));
  }, [xe]);
  function se() {
    U(!1), requestAnimationFrame(() => {
      var Q;
      return (Q = p.current) == null ? void 0 : Q.focus({ preventScroll: !0 });
    });
  }
  if (n.length > 1) {
    const Q = !n.some((J) => J.isDerived), ye = e && u ? Rd(y, n) : null, T = (ye == null ? void 0 : ye.map((J, $) => {
      var h;
      const v = n[$];
      return {
        segmentId: v.nativeSegmentId,
        itemId: v.published ? null : v.itemId,
        revision: (h = b.performerSlotRevisions) == null ? void 0 : h[v.id],
        slots: J
      };
    })) || [];
    return r(go.Fragment, null, [
      r(Ic, {
        key: "details",
        selectedGroups: o,
        selectedSegments: n,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: A,
        onReduceSelection: z,
        reviewable: e,
        tagEditable: Q,
        slotsEditable: T.length > 0 && a == null,
        onEditSlots: () => U(!0),
        slotButtonRef: p,
        saveMessage: i
      }),
      K && Q ? r("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (J) => {
          J.target === J.currentTarget && R();
        },
        onKeyDownCapture: (J) => Tt(J, { onCancel: R })
      }, r("section", {
        ref: k,
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
        r(Qn, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (J, $) => J == null ? R() : l(J, $ == null ? void 0 : $.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        r("button", {
          key: "cancel",
          type: "button",
          onClick: R,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      xe && T.length > 0 ? r("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (J) => {
          J.target === J.currentTarget && se();
        },
        onKeyDownCapture: (J) => {
          var v, h;
          if (!(typeof ((v = J.target) == null ? void 0 : v.closest) == "function" ? J.target.closest("input, textarea, select, [contenteditable='true']") : null) && !J.repeat && !J.ctrlKey && !J.altKey && !J.metaKey && !J.shiftKey && /^[1-9]$/.test(J.key) && ((h = Ce.current) != null && h.call(Ce, Number(J.key) - 1))) {
            J.preventDefault(), J.stopPropagation();
            return;
          }
          Tt(J, { onCancel: se });
        }
      }, r("section", {
        ref: de,
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
          r("button", { key: "close", type: "button", onClick: se, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        r("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, r(Sc, {
          videoId: g.id,
          targets: T,
          performerCandidates: b.performerCandidates || [],
          shortcutRef: Ce,
          acquireSaveLock: () => F("slots", -1),
          onSaved: async ({ beforeState: J, afterState: $ }) => {
            await j(
              "performer-slots.assign",
              `Assigned performers to ${T.length} segments`,
              J,
              $
            ), se(), await W();
          },
          onConflict: W
        }))
      ])) : null
    ]);
  }
  return r("div", {
    ref: (Q) => {
      Y.current = Q, A && (A.current = Q);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    r("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      r("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? r(mn, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? r(Pr, { key: "derived" }) : null,
        t && K ? r("div", {
          key: "tag-editor",
          ref: k,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (Q) => {
            Q.key === "Escape" && (Q.preventDefault(), Q.stopPropagation(), R());
          },
          onKeyDown: (Q) => {
            Cd(Q, t.tagName) && (Q.preventDefault(), Q.stopPropagation(), l(t.tagId));
          }
        }, r(Qn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (Q, ye) => Q == null ? R() : l(Q, ye == null ? void 0 : ye.label),
          disabled: Tl(a, t.id, s) || ((ce = S.data) == null ? void 0 : ce.tagReadOnly) === !0,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? r("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : r("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? r("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        r("span", { key: "start" }, Oe(t.startSec)),
        t.endSec == null ? null : r("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : r("span", { key: "end" }, Oe(t.endSec))
      ]) : null,
      e && t && (c === "empty" || c === "partial") ? r("div", { key: "slots-row" }, r(vc, { status: c })) : null,
      t && u && f.length > 0 ? r("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, r(Na, {
        assignments: f.map((Q) => {
          const ye = Dd(Q);
          return {
            key: String(Q.slotDefinitionId),
            label: ye.label,
            performer: ye.filled ? { id: Number(Q.performerId), name: ye.performer } : null,
            title: ye.title
          };
        })
      })) : null,
      i ? r("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? r(Nc, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: I
    }) : null,
    t ? r("div", { key: "controls", hidden: !0 }, [
      r("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        r("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        S.loading ? r("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : S.error ? r("p", { key: "error", className: "mt-1 text-xs text-secondary" }, S.error) : S.data ? r("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          r(
            "p",
            { key: "summary" },
            `${S.data.derived ? "Derived segment" : "Root segment"} · ${S.data.componentSize} segment${S.data.componentSize === 1 ? "" : "s"} · ${S.data.integrityState}`
          ),
          (Se = S.data.parents) != null && Se.length ? r("div", { key: "parents" }, [
            r("span", { key: "label" }, "Parents: "),
            ...S.data.parents.map((Q) => r("button", {
              key: Q.nodeId,
              type: "button",
              onClick: () => M(Q.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${Q.ruleKey} ${Q.ruleVersion}`))
          ]) : null,
          (Ie = S.data.children) != null && Ie.length ? r("p", { key: "children" }, `Children: ${S.data.children.length}`) : null
        ]) : r("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      r("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        r("button", { key: "apply", type: "button", disabled: a != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? r("button", {
          key: "slots",
          ref: p,
          type: "button",
          disabled: a != null || !u || f.length === 0,
          onClick: () => U(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: u ? f.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, f.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        r("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: E,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        r("button", {
          key: "duplicate",
          type: "button",
          disabled: a != null,
          onClick: () => N(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        r("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: a != null,
          onClick: () => N(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    xe && e && t && u && f.length > 0 ? r("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (Q) => {
        Q.target === Q.currentTarget && se();
      },
      onKeyDownCapture: (Q) => {
        var T, J;
        if (!(typeof ((T = Q.target) == null ? void 0 : T.closest) == "function" ? Q.target.closest("input, textarea, select, [contenteditable='true']") : null) && !Q.repeat && !Q.ctrlKey && !Q.altKey && !Q.metaKey && !Q.shiftKey && /^[1-9]$/.test(Q.key) && ((J = Z.current) != null && J.call(Z, Number(Q.key) - 1))) {
          Q.preventDefault(), Q.stopPropagation();
          return;
        }
        Tt(Q, {
          onCancel: se,
          onConfirm: () => {
            var $;
            return ($ = be.current) == null ? void 0 : $.click();
          }
        });
      }
    }, r("section", {
      ref: de,
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
        r("button", { key: "close", type: "button", onClick: se, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      r("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, r(xc, {
        key: `${t.id}:${b.performerSlotsRevision || b.slotRevision || ""}`,
        videoId: g.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: f,
        revision: (le = b.performerSlotRevisions) == null ? void 0 : le[t.id],
        performerCandidates: b.performerCandidates || [],
        confirmRef: be,
        shortcutRef: Z,
        onOptimisticSave: (Q) => {
          const ye = F("slots", t.id);
          if (!ye)
            return m("Wait for the current save to finish before saving performer slots."), !1;
          _.current = ye, C((T) => en(
            T,
            t.id,
            Q
          ), g.id), m("Saving performer slots…"), se();
        },
        onSaved: async (Q, { beforeState: ye, afterState: T }) => {
          C((J) => en(
            J,
            t.id,
            Q.slots || [],
            Q.revision
          ), g.id), m("Performer slots saved.");
          try {
            await j(
              "performer-slots.assign",
              "Assigned performers",
              ye,
              T
            ), await W(Q) || G([t]);
          } finally {
            te();
          }
        },
        onRollback: async (Q, ye) => {
          G([t]), C((T) => {
            var J;
            return en(
              T,
              t.id,
              Q,
              (J = b.performerSlotRevisions) == null ? void 0 : J[t.id]
            );
          }, g.id), m(ye.message || "Unable to save performer slots.");
          try {
            ye.status === 409 && await W();
          } finally {
            te();
          }
        },
        onConflict: W
      }))
    ])) : null
  ]);
}
function Xc({ segments: e, shotBoundaries: t = [], segmentGroups: n, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: u, onZoomChange: f, onSelectGroup: y, onToggleGroup: b, onSelect: g, onSelectSegments: p, onSelectAll: k, onConfigureTag: C, onSeekTime: m, centerRef: F, showReviewState: W = !0, swimlaneTitleWidth: j, onSwimlaneTitleWidthChange: G }) {
  const E = ge(null), N = ge(null), [I, S] = B(0), [M, K] = B({ scrollTop: 0, height: 320 }), [R, A] = B(null), z = ze(
    () => cn(e, n, o),
    [e, n, o]
  ), Y = ze(
    () => xa(o),
    [o]
  ), _ = ze(() => Co(z), [z]), te = ze(
    () => Fd(_, i, Sa(_)),
    [_, i]
  ), de = ze(
    () => ka(te.rows, Math.max(0, M.scrollTop - 24), M.height),
    [te, M]
  ), be = Math.max(0, Number(d) || 0), Z = Js(I), Ce = kr(j, Z), xe = Ce / 16, U = Ws(c, be, xe), se = Ks(be), ce = zs(be, Math.max(1, I - xe * 16), u), Se = se.filter((h, x) => x === 0 || x % ce === 0), Ie = ze(() => z.map((h) => `${h.key}:${h.trackCount}:${h.markers.map(({ segment: x, track: O }) => `${x.id}:${x.startSec}:${x.endSec ?? ""}:${O}`).join(",")}`).join("|"), [z]);
  function le() {
    const h = N.current;
    if (!h) return;
    const x = h.querySelector("[data-timeline-track]"), O = h.firstElementChild, ne = x == null ? void 0 : x.getBoundingClientRect(), re = O == null ? void 0 : O.getBoundingClientRect(), P = ne && re ? Math.max(0, ne.left - re.left) : xe * 16, oe = (re == null ? void 0 : re.width) ?? h.scrollWidth;
    h.scrollTo({
      left: qs(c, be, oe, h.clientWidth, P, _i),
      behavior: "smooth"
    });
  }
  pe(() => (F.current = le, () => {
    F.current === le && (F.current = null);
  })), pe(() => {
    le();
  }, [u]);
  function Q() {
    const h = N.current, x = te.rows.find((oe) => oe.kind === "lane" && oe.lane.markers.some(({ segment: w }) => w.id === s));
    if (!h || !x) return;
    const O = 24, ne = x.top + O, re = ne + x.height;
    let P = h.scrollTop;
    ne < h.scrollTop + O ? P = Math.max(0, ne - O) : re > h.scrollTop + h.clientHeight && (P = Math.max(0, re - h.clientHeight)), P !== h.scrollTop && (h.scrollTop = P), K({ scrollTop: P, height: h.clientHeight });
  }
  pe(() => {
    Q();
  }, [s, Ie, te]), pe(() => {
    const h = N.current, x = te.rows.find((oe) => oe.kind === "group" && oe.group.key === a);
    if (!h || !x) return;
    const O = 24, ne = x.top + O, re = ne + x.height;
    let P = h.scrollTop;
    ne < h.scrollTop + O ? P = Math.max(0, ne - O) : re > h.scrollTop + h.clientHeight && (P = Math.max(0, re - h.clientHeight)), P !== h.scrollTop && (h.scrollTop = P), K({ scrollTop: P, height: h.clientHeight });
  }, [a, te]), pe(() => {
    const h = N.current;
    if (!h || typeof ResizeObserver > "u") return;
    const x = () => {
      S(h.clientWidth), K({ scrollTop: h.scrollTop, height: h.clientHeight }), Q();
    }, O = new ResizeObserver(x);
    return O.observe(h), x(), () => O.disconnect();
  }, [s, Ie, te]);
  function ye(h) {
    if (!(be > 0)) return;
    const x = h.currentTarget.getBoundingClientRect(), O = Math.min(1, Math.max(0, (h.clientX - x.left) / x.width));
    m(O * be);
  }
  function T(h) {
    const x = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let O = null;
    Object.hasOwn(x, h.key) && (O = c + x[h.key]), h.key === "Home" && (O = 0), h.key === "End" && (O = be), O != null && (h.preventDefault(), h.stopPropagation(), m(Math.min(be, Math.max(0, O))));
  }
  function J(h) {
    var O;
    const x = (O = E.current) == null ? void 0 : O.getBoundingClientRect();
    x && G(kr(h.clientX - x.left, Z));
  }
  function $(h) {
    const x = h.shiftKey ? 40 : 16;
    let O = null;
    h.key === "ArrowLeft" && (O = Ce - x), h.key === "ArrowRight" && (O = Ce + x), h.key === "Home" && (O = 160), h.key === "End" && (O = Z), O != null && (h.preventDefault(), h.stopPropagation(), G(kr(O, Z)));
  }
  const v = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return r("section", {
    ref: E,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    r("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      r("button", {
        key: "title",
        type: "button",
        onClick: (h) => {
          (h.metaKey || h.ctrlKey) && (h.preventDefault(), k == null || k());
        },
        onKeyDown: (h) => {
          h.key !== "Enter" && h.key !== " " || (h.preventDefault(), k == null || k());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      r("button", { key: "out", type: "button", className: v, disabled: u <= 1, onClick: () => f($r(u - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      r("button", { key: "fit", type: "button", className: v, disabled: u === 1, onClick: () => f(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(u * 100)}%`),
      r("button", { key: "in", type: "button", className: v, disabled: u >= 8, onClick: () => f($r(u + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      r("button", { key: "center", type: "button", className: v, onClick: le, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    r("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(Z),
      "aria-valuenow": Math.round(Ce),
      "aria-valuetext": `${Math.round(Ce)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (h) => {
        h.currentTarget.setPointerCapture(h.pointerId), J(h);
      },
      onPointerMove: (h) => {
        h.currentTarget.hasPointerCapture(h.pointerId) && J(h);
      },
      onKeyDown: $,
      onDoubleClick: () => G($t.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${Ce - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, r("span", { className: "h-16 w-1 rounded-full bg-border" })),
    r("div", {
      key: "scroll",
      ref: N,
      onScroll: (h) => K({
        scrollTop: h.currentTarget.scrollTop,
        height: h.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, r("div", { style: Vs(u) }, [
      r("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${xe}rem minmax(0,1fr)`, height: "1.5rem" } }, [
        r("div", { key: "axis-label", "data-timeline-label-gutter": "true", "aria-hidden": "true", className: "sticky left-0 z-40 border-r border-border", style: { backgroundColor: "var(--color-surface)" } }),
        r("div", {
          key: "ticks",
          role: "slider",
          tabIndex: 0,
          "data-timeline-seeker": "true",
          "data-timeline-track": "true",
          "aria-label": "Timeline seek",
          "aria-valuemin": 0,
          "aria-valuemax": be,
          "aria-valuenow": Math.min(be, Math.max(0, c)),
          "aria-valuetext": Oe(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: ye,
          onKeyDown: T
        }, Se.map((h, x) => r("span", {
          key: h,
          className: `absolute top-0 ${_s(x, Se.length, be > 0 ? h / be * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Hs(x, Se.length, be > 0 ? h / be * 100 : 0)
        }, Oe(h))).concat(t.map((h) => {
          const x = be > 0 ? h.startSec / be * 100 : 0;
          return r("button", {
            key: `shot-boundary:${h.startSec}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Oe(h.startSec)} – ${Oe(h.endSec)}`,
            title: `Shot boundary · ${h.source || "manual"} · ${Oe(h.startSec)} – ${Oe(h.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${x}%`, width: "2px" },
            onClick: (O) => {
              O.stopPropagation(), m(h.startSec);
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
            ...ni(U),
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
        style: z.length > 0 ? { height: te.height } : void 0
      }, [
        z.length > 0 ? r("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...ni(U, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        z.length === 0 ? r("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : de.map((h) => {
          var q;
          const x = h.group, O = i.includes(x.key), ne = a === x.key, re = Mr(ne);
          if (h.kind === "group") return r("div", {
            key: h.key,
            "data-segment-group": x.key,
            "data-segment-group-collapsed": O ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${xe}rem minmax(0,1fr)`,
              backgroundColor: re,
              top: h.top,
              height: h.height
            }
          }, [
            r("button", {
              key: "name",
              type: "button",
              onClick: (L) => {
                if (L.metaKey || L.ctrlKey) {
                  p(x.lanes.flatMap((X) => X.markers.map((fe) => fe.segment.id)));
                  return;
                }
                y(x.key), b(x.key);
              },
              "aria-expanded": !O,
              "aria-current": ne ? "true" : void 0,
              "data-selected-timeline-group": ne ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: x.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: re
              },
              title: `${O ? "Expand" : "Collapse"} ${x.name}`
            }, [
              r("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, O ? "▶" : "▼"),
              r("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, x.name)
            ]),
            r(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              O ? [
                r(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${x.lanes.length} swimlane${x.lanes.length === 1 ? "" : "s"} hidden`
                ),
                W ? r(rn, { key: "states", counts: x.counts }) : null
              ] : null
            )
          ]);
          const P = h.lane, oe = xd(h.laneIndex), w = P.markers.some(({ segment: L }) => L.id === s);
          return r("div", {
            key: h.key,
            "data-grouped-swimlane": x.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${xe}rem minmax(0,1fr)`,
              top: h.top,
              height: h.height,
              backgroundColor: oe
            }
          }, [
            r("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": w ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: Sd(w, oe),
              title: `${Zn(P)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Zn(P),
              onClick: (L) => {
                (L.metaKey || L.ctrlKey) && p(P.markers.map((X) => X.segment.id));
              },
              onMouseEnter: () => A(P.key),
              onMouseLeave: () => A((L) => L === P.key ? null : L)
            }, [
              P.tagId != null ? r("button", {
                key: "configure",
                type: "button",
                onClick: (L) => {
                  L.stopPropagation(), C({ tagId: P.tagId, tagName: P.label, trigger: L.currentTarget });
                },
                "aria-label": `Configure ${P.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: R === P.key ? 1 : void 0 }
              }, "⚙") : null,
              r("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, P.label),
              (q = P.performers) != null && q.length ? r(Or, {
                key: "performers",
                performers: P.performers,
                performerAssignments: P.performerAssignments
              }) : null,
              W ? r(rn, { key: "counts", counts: P.counts }) : null
            ]),
            r("div", { key: "track", className: "relative" }, P.markers.map(({ segment: L, track: X }) => {
              var ht;
              const fe = eo(L.startSec, be), me = L.endSec == null ? L.startSec : Math.max(L.startSec, L.endSec), Te = Math.max(0, eo(me, be) - fe), pt = l.includes(L.id), Be = L.id === s, Re = Io(Y.get(L.id)), Ye = L.endSec == null ? Oe(L.startSec) : `${Oe(L.startSec)} – ${Oe(L.endSec)}`, it = (ht = ha[Re]) == null ? void 0 : ht.label;
              return r("button", {
                key: L.id,
                type: "button",
                onClick: (Ze) => {
                  Ze.stopPropagation(), g(L, {
                    additive: Ze.metaKey || Ze.ctrlKey,
                    rangeSegmentIds: Ze.shiftKey ? P.markers.map((yt) => yt.segment.id) : null
                  });
                },
                "aria-pressed": pt,
                "aria-current": Be ? "true" : void 0,
                "data-selected-timeline-marker": Be ? "true" : void 0,
                "data-selected-segment-shortcut-target": Be ? "true" : void 0,
                "aria-label": W ? `${L.tagName || "Tag segment"}${P.performerLabel ? `, ${P.performerLabel}` : ""}, ${L.reviewState}${it ? `, ${it}` : ""}, ${Ye}` : `${L.tagName || "Tag segment"}${P.performerLabel ? `, ${P.performerLabel}` : ""}, ${Ye}`,
                title: W ? `${L.tagName || "Tag segment"}${P.performerLabel ? ` · ${P.performerLabel}` : ""} · ${L.reviewState}${it ? ` · ${it}` : ""} · ${Ye}` : `${L.tagName || "Tag segment"}${P.performerLabel ? ` · ${P.performerLabel}` : ""} · ${Ye}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...W ? bd(L.reviewState, pt, Re, Be) : hd(pt, Be),
                  left: `${fe}%`,
                  top: `${kd(X)}rem`,
                  width: vd(L.endSec, Te),
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
function Ro({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: n = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = B(null), [l, d] = B([]), [c, u] = B(null), [f, y] = B(""), [b, g] = B(!0), [p, k] = B(null), [C, m] = B(""), [F, W] = B(!1), j = ge(null), G = ge(0);
  pe(() => {
    const R = requestAnimationFrame(() => {
      var A;
      return (A = j.current) == null ? void 0 : A.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(R);
  }, [e]), pe(() => {
    const R = new AbortController();
    return g(!0), m(""), Promise.all([
      n ? ee(`/slot-definitions/${e}`, { signal: R.signal }) : Promise.resolve(null),
      ee("/segment-groups", { signal: R.signal })
    ]).then(([A, z]) => {
      const Y = z.find((_) => (_.tags || []).some((te) => Number(te.tagId) === Number(e)));
      s(A), d(z), u((Y == null ? void 0 : Y.id) ?? null), y(Y == null ? "" : String(Y.id)), W(!1);
    }).catch((A) => {
      A.name !== "AbortError" && m(A.message || "Unable to load tag configuration.");
    }).finally(() => {
      R.signal.aborted || g(!1);
    }), () => R.abort();
  }, [n, e]);
  function E(R, A) {
    s({
      ...a,
      definitions: a.definitions.map((z, Y) => Y === R ? { ...z, ...A } : z)
    });
  }
  function N(R, A) {
    const z = R + A;
    if (z < 0 || z >= a.definitions.length) return;
    const Y = [...a.definitions];
    [Y[R], Y[z]] = [Y[z], Y[R]], s({
      ...a,
      definitions: Y.map((_, te) => ({ ..._, sortOrder: te }))
    });
  }
  function I(R) {
    const A = a.definitions[R], z = Number(A.assignmentCount) || 0, Y = z === 0 ? "" : ` and its ${z} assignment${z === 1 ? "" : "s"}`;
    window.confirm(`Delete “${Rt(A)}”${Y}?`) && (z > 0 && W(!0), s({
      ...a,
      definitions: a.definitions.filter((_, te) => te !== R).map((_, te) => ({ ..._, sortOrder: te }))
    }));
  }
  async function S() {
    var A;
    k("slots"), m("Saving performer slots…");
    let R;
    try {
      R = await ee(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: F,
          definitions: a.definitions.map((z, Y) => {
            var _;
            return {
              id: z.id || void 0,
              label: ((_ = z.label) == null ? void 0 : _.trim()) || null,
              sortOrder: Y,
              genderHints: z.genderHints || []
            };
          })
        })
      }), s(R), W(!1);
    } catch (z) {
      z.status === 409 ? (m("Performer slots changed elsewhere; current values were reloaded."), (A = z.payload) != null && A.current && (s(z.payload.current), W(!1))) : m(z.message || "Unable to save performer slots."), k(null);
      return;
    }
    try {
      await o(), m("Performer slots saved.");
    } catch {
      m("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      k(null);
    }
  }
  async function M() {
    const R = f === "" ? null : Number(f);
    if (R !== c) {
      k("group"), m("Saving tag group…");
      try {
        await ee(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: R })
        });
      } catch (A) {
        m(A.message || "Unable to assign the tag group."), k(null);
        return;
      }
      try {
        const [A, z] = await Promise.allSettled([
          ee("/segment-groups"),
          o()
        ]);
        if (A.status === "fulfilled") {
          d(A.value);
          const Y = A.value.find((te) => (te.tags || []).some((de) => Number(de.tagId) === Number(e))), _ = (Y == null ? void 0 : Y.id) ?? null;
          u(_), y(_ == null ? "" : String(_));
        }
        m(
          A.status === "fulfilled" && z.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        k(null);
      }
    }
  }
  l.find((R) => Number(R.id) === Number(c));
  const K = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return r("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (R) => {
      R.target === R.currentTarget && !p && i();
    },
    onKeyDownCapture: (R) => Tt(R, {
      onCancel: p ? void 0 : i
    })
  }, r("section", {
    ref: j,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: Yt,
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
            value: f,
            disabled: p != null,
            onChange: (R) => y(R.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            r("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((R) => r("option", { key: R.id, value: String(R.id) }, R.name))
          ])
        ]),
        b ? null : r("button", {
          key: "save",
          type: "button",
          disabled: p != null || (f === "" ? null : Number(f)) === c,
          onClick: M,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, p === "group" ? "Saving…" : "Save tag group")
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
              disabled: p != null,
              onChange: (R) => s({ ...a, allowSamePerformerInMultipleSlots: R.target.checked })
            }),
            r("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((R, A) => r("article", {
            key: R.id || R._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            r("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              r("span", { key: "label" }, "Slot label"),
              r("input", {
                key: "input",
                value: R.label || "",
                disabled: p != null,
                onChange: (z) => E(A, { label: z.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            r("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              r("legend", { key: "label" }, "Gender hints"),
              r("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Fs.map((z) => r("label", { key: z, className: "inline-flex items-center gap-1" }, [
                r("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: p != null,
                  checked: (R.genderHints || []).includes(z),
                  onChange: (Y) => E(A, {
                    genderHints: Y.target.checked ? [.../* @__PURE__ */ new Set([...R.genderHints || [], z])] : (R.genderHints || []).filter((_) => _ !== z)
                  })
                }),
                r("span", { key: "text" }, Dr(z))
              ])))
            ]),
            r("div", { key: "actions", className: "flex items-end gap-1" }, [
              r("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${R.assignmentCount || 0} assigned`),
              r("button", { key: "up", type: "button", disabled: p != null || A === 0, onClick: () => N(A, -1), className: K, "aria-label": `Move ${Rt(R)} up` }, "↑"),
              r("button", { key: "down", type: "button", disabled: p != null || A === a.definitions.length - 1, onClick: () => N(A, 1), className: K, "aria-label": `Move ${Rt(R)} down` }, "↓"),
              r("button", { key: "delete", type: "button", disabled: p != null, onClick: () => I(A), className: `${K} text-red-300` }, "Delete")
            ])
          ])),
          r("div", { key: "buttons", className: "flex items-center gap-2" }, [
            r("button", {
              key: "add",
              type: "button",
              disabled: p != null,
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
              className: K
            }, "Add slot"),
            r("button", {
              key: "save",
              type: "button",
              disabled: p != null,
              onClick: S,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, p === "slots" ? "Saving…" : "Save performer slots")
          ])
        ]) : null
      ]) : null,
      C ? r("p", { key: "message", role: "status", className: "text-sm text-secondary" }, C) : null
    ]),
    r(
      "footer",
      { key: "footer", className: "flex items-center justify-end border-t border-border px-5 py-4" },
      r("button", {
        type: "button",
        disabled: p != null,
        onClick: i,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Close")
    )
  ]));
}
function Zc(e, t, n) {
  if (!(e != null && e.disabled) || !n) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${n}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function eu(e) {
  const { acquireSaveLock: t, activeFilterCount: n, allSwimlanes: o, approvalFacetCounts: i, autoAssignCandidates: a, autoAssignError: s, autoAssignOpen: l, autoAssignPerformers: d, autoAssigning: c, cancelQueuedReviewsForSegments: u, canMoveSelectionToBin: f, captureTrainingExport: y, centerTimelineRef: b, closeEditorFilters: g, closeFirstSegmentTagDialog: p, closeMaterializeDialog: k, closeMergeConfirmation: C, closePublishApprovedDialog: m, closeTagEditing: F, collapsedSegmentGroups: W, commonActionsRef: j, compatibilityMode: G, configuringTag: E, createSegment: N, creatingSegmentId: I, currentTime: S, deleteRejectedSegments: M, detail: K, detailPanelRef: R, detailWidth: A, duplicateSegment: z, editorFilters: Y, editorLayout: _, editorRef: te, exportingExamples: de, filtersButtonRef: be, filtersOpen: Z, firstSegmentTagOpen: Ce, focusRowRef: xe, handleSeparatorKeyDown: U, handleSeparatorPointerDown: se, handleSeparatorPointerMove: ce, hasNextUnreviewed: Se, hasPreviousUnreviewed: Ie, hideDerivedSegments: le, history: Q, historyOpen: ye, historySaving: T, horizontalLayoutSize: J, importNativeSegments: $, incorrectExamples: v, incorrectExamplesOpen: h, lineage: x, markerRailWidth: O, materializeButtonRef: ne, materializeCancelButtonRef: re, materializeDerivedSegments: P, materializeError: oe, materializeLoading: w, materializeOpen: q, materializePreview: L, materializing: X, mediaStackRef: fe, mergeCancelButtonRef: me, mergeConfirmation: Te, mergeSaving: pt, mergeSelectedSwimlane: Be, nativeImportState: Re, onDetailChange: Ye, onNavigate: it, onReload: ht, onSlotsChanged: Ze, openPublishApprovedDialog: yt, panelSeparatorProps: ut, pendingInitialSeekRef: Fe, performerSlots: Qe, performerSlotsAvailable: qe, playbackControlsRef: Je, previewDerivedSegments: st, provenance: Ot, provenanceSources: V, publishApprovedCancelButtonRef: ie, publishApprovedDrafts: Ee, publishApprovedError: Ne, publishApprovedOpen: ve, quickSearchOpen: et, railScrollRef: Ue, railToggleRef: Xe, recordHistoryAction: Ae, rejectedDeletionPreview: Me, removeIncorrectExample: We, removingExampleId: De, restoreHistoryTarget: je, runEditorAction: tt, saveMessage: ke, saveTag: Le, saveTiming: Pe, savingSegmentId: ft, seekRef: Ve, segmentGroups: lt, segmentRailLayout: Pt, segments: at, selectAllVideoSegments: $e, selectSegment: we, selectSegmentCollection: nt, selectedGroups: Et, selectedPerformerSlots: mt, selectedSegment: vt, selectedSegmentGroupKey: bt, selectedSegmentIds: Lt, selectedSegments: _t, selectedSlotStatus: Lr, setAutoAssignError: Mn, setAutoAssignOpen: Dn, setConfiguringTag: gn, setCurrentTime: an, setEditorFilters: pn, setEditorLayout: or, setFiltersOpen: jr, setHideDerivedSegments: ir, setHistoryOpen: On, setIncorrectExamplesOpen: fn, setQuickSearchOpen: yn, setRailViewport: ar, setRejectedDeletionPreview: bn, setSaveMessage: Fr, setSelectedSegmentGroupKey: Pn, setSelectedSegmentId: Ln, setShortcutsOpen: Zt, setTimelineZoom: jn, shotBoundaries: Fn, shortcutsOpen: xt, slotButtonRef: sr, splitLayout: jt, splitSegment: lr, stepVideoFrame: Gn, tagEditing: Bn, tagSearchRef: Un, timelineDuration: Gr, timelineRatioBounds: dr, timelineZoom: Kn, toggleSegmentGroup: hn, toggleSegmentRail: zn, updateTimelineRatio: ot, video: Ge, videoPerformers: cr, visibleCounts: Br, visibleSegmentRailRows: Ht, visibleSegments: St, wideLayout: sn, workspaceRef: _n } = e, vn = ze(
    () => at.filter((H) => !H.published && H.reviewState === "approved"),
    [at]
  ), xn = As(yo), Sn = vn.length, ur = ge(null), mr = ze(() => () => On(!1), [On]), Hn = L ? L.createCount + L.linkCount : null, qt = ft != null, At = _t.length > 0, Ft = _t.length === 1, Ur = At && _t.every((H) => H.reviewState === "approved"), Kr = At && _t.every((H) => H.reviewState === "rejected"), zr = [
    { id: "marker.create", label: "New segment", disabled: qt },
    { id: "marker.editTag", label: "Edit tag", disabled: qt || !At },
    { id: "marker.setStart", label: "Set start", disabled: qt || !Ft },
    { id: "marker.setEnd", label: "Set end", disabled: qt || !Ft },
    { id: "marker.split", label: "Split", disabled: qt || !Ft },
    ...G ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !Ie, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Ur ? "Unapprove" : "Approve", disabled: qt || !At, tone: "approve" },
      { id: "marker.reject", label: Kr ? "Unreject" : "Reject", disabled: qt || !At, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !Se, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...G ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: qt || !f, tone: "reject" }
    ]
  ];
  function _r(H) {
    const he = Lt.includes(H.id), It = H.id === (vt == null ? void 0 : vt.id), ue = H.endSec == null ? Oe(H.startSec) : `${Oe(H.startSec)} – ${Oe(H.endSec)}`, kt = `${zt(H.sourceKey)}${H.confidence != null ? ` · ${Math.round(H.confidence * 100)}%` : ""}`;
    return r("button", {
      key: H.id,
      type: "button",
      onClick: (Wt) => we(H, { additive: Wt.metaKey || Wt.ctrlKey }),
      "aria-pressed": he,
      "aria-current": It ? "true" : void 0,
      "data-selected-segment-shortcut-target": It ? "true" : void 0,
      "aria-label": G ? `${H.tagName || "Tag segment"}, ${H.reviewState}${H.isDerived ? ", derived segment" : ""}, ${ue}` : `${H.tagName || "Tag segment"}${H.isDerived ? ", derived segment" : ""}, ${ue}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: ba(he, It)
    }, [
      r("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        G ? r(mn, { key: "review", state: H.reviewState, includeLabel: !1 }) : null,
        H.isDerived ? r(Pr, { key: "derived" }) : null,
        r(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          H.tagName || "Tag segment"
        ),
        r("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, ue),
        r("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: kt
        }, kt)
      ])
    ]);
  }
  const kn = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", gt = [...Q.actions || []].reverse().find((H) => H.sequence <= Q.cursorSequence);
  return r("section", {
    ref: te,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${jt ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    r("header", { key: "header", className: "relative flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      r("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        r("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          r("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (H) => Oa(H, it, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          r("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, r("a", {
            href: `/video/${Ge.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: Ge.title || `Video ${Ge.id}`
          }, Ge.title || `Video ${Ge.id}`)),
          ...cr.map((H) => r(er, {
            key: ct(H),
            performer: { id: ct(H), name: H.name },
            compact: !0,
            tooltip: H.name
          })),
          G ? r(rn, { key: "review-counts", counts: Br }) : null
        ]),
        r("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          G ? null : r(ja, { key: "bin", onNavigate: it, compact: !0 }),
          r(Fa, { key: "settings", onNavigate: it, compact: !0 })
        ])
      ]),
      G && K.nativeImportCount > 0 ? r("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        r(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${K.nativeImportCount} Cove segment${K.nativeImportCount === 1 ? "" : "s"} ${K.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        Re.busy ? r("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, Re.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          r("button", {
            key: "review",
            type: "button",
            onClick: () => $("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          r("button", {
            key: "approved",
            type: "button",
            onClick: () => $("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        Re.error ? r("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, Re.error) : null
      ]) : null,
      r("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        r("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          // Run AI and any other contributed video action, rendered by the host
          // exactly as they are on a video's own page rather than reimplemented here.
          // The host queues the run and returns at once. In Full mode,
          // useSegmentAnalysis reloads the editor when Segment Studio's review
          // results for the run arrive.
          Ge != null && Ge.id ? r(id, {
            key: "extension-actions",
            entityType: "video",
            entityId: Ge.id,
            pageType: js,
            renderMode: "toolbar"
          }) : null,
          G ? r("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: ft != null || a.length === 0,
            onClick: () => {
              Mn(""), Dn(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${a.length ? ` (${a.length})` : ""}`) : null,
          G ? r("button", {
            key: "materialize-derived",
            ref: ne,
            type: "button",
            disabled: ft != null || w || X || Hn === 0,
            onClick: st,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, w ? "Analyzing…" : `Auto-Materialize${Hn != null ? ` (${Hn})` : ""}`) : null,
          G ? r("button", {
            key: "complete-review",
            type: "button",
            disabled: ft != null || Sn === 0,
            onClick: (H) => yt(H.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": ve,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${Sn ? ` (${Sn})` : ""}`) : null,
          r("button", {
            key: "feedback",
            type: "button",
            disabled: de || De != null || v.length === 0,
            onClick: () => fn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": h,
            "aria-label": `Open AI feedback collection, ${v.length} example${v.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${v.length ? ` (${v.length})` : ""}`)
        ]),
        r("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          r("button", {
            key: "filters",
            ref: be,
            type: "button",
            onClick: () => jr(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": Z,
            className: `${kn} ${n ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            r(Sr, { key: "icon", name: "filter" }),
            r("span", { key: "label" }, `Filter${n ? ` (${n})` : ""}`)
          ]),
          r("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => Zt(!0),
            className: kn
          }, [r(Sr, { key: "icon", name: "keyboard" }), r("span", { key: "label" }, "Shortcuts")]),
          r("button", {
            key: "history",
            ref: ur,
            type: "button",
            disabled: (G ? Q.actions.length === 0 : gt == null) || ft != null || T,
            onClick: G ? () => On((H) => !H) : () => je(
              gt.sequence - 1
            ),
            "aria-controls": G ? Ga : void 0,
            "aria-expanded": G ? ye : void 0,
            className: kn
          }, [
            r(Sr, { key: "icon", name: "history" }),
            r("span", { key: "label" }, G ? `History${Q.actions.length ? ` (${Q.actions.length})` : ""}` : gt ? `Undo ${gt.label}` : "Undo")
          ]),
          r("button", {
            key: "rail",
            ref: Xe,
            type: "button",
            onClick: zn,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": _.markerRailOpen,
            className: kn
          }, [
            r(Sr, { key: "icon", name: "list" }),
            r("span", { key: "label" }, _.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ]),
      G && ye ? r(Bc, {
        key: "history-popover",
        history: Q,
        historySaving: T,
        anchorRef: ur,
        onRestore: je,
        onClose: mr
      }) : null
    ]),
    Z ? r(Gc, {
      key: "editor-filters",
      filters: Y,
      hideDerivedSegments: le,
      performers: cr,
      provenanceSources: V,
      reviewCounts: i,
      segments: at,
      segmentGroups: lt,
      reviewMode: G,
      onChange: pn,
      onHideDerivedChange: ir,
      onClose: g
    }) : null,
    Ce ? r(Fc, {
      key: "first-segment-tag-dialog",
      saving: ft != null,
      error: ke,
      onSelect: (H, he) => N(H, he),
      onClose: p
    }) : null,
    et ? r(zc, {
      key: "quick-search-dialog",
      segments: td(o),
      onSelect: (H) => {
        yn(!1), we(H, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        yn(!1), requestAnimationFrame(() => {
          var H;
          return (H = te.current) == null ? void 0 : H.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    l ? r(qc, {
      key: "auto-assign-dialog",
      candidates: a,
      processing: c,
      error: s,
      onConfirm: d,
      onClose: () => Dn(!1)
    }) : null,
    Te ? r(Vc, {
      key: "merge-selection-dialog",
      merge: Te,
      processing: pt,
      undoable: !G,
      cancelButtonRef: me,
      onConfirm: (H) => Be(!0, H, Te),
      onClose: C
    }) : null,
    q ? r(Yc, {
      key: "materialize-derived-dialog",
      preview: L,
      loading: w,
      processing: X,
      error: oe,
      cancelButtonRef: re,
      onConfirm: P,
      onClose: () => {
        X || k();
      }
    }) : null,
    r("div", {
      key: "workspace",
      ref: _n,
      className: `${jt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      _.markerRailOpen ? r("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: sn ? { position: "absolute", top: 0, right: 0, width: O, height: J.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        at.length === 0 ? r("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : St.length === 0 ? r(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : r("div", {
          key: "segments",
          ref: Ue,
          onScroll: (H) => ar({
            scrollTop: H.currentTarget.scrollTop,
            height: H.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, r("div", {
          className: "relative",
          style: { height: Pt.height }
        }, Ht.map((H) => {
          var It;
          let he;
          if (H.kind === "group") {
            const ue = W.includes(H.group.key), kt = H.group.lanes.reduce((Wt, gr) => Wt + gr.markers.length, 0);
            he = r("button", {
              type: "button",
              onClick: () => {
                Pn(H.group.key), hn(H.group.key);
              },
              "aria-expanded": !ue,
              "aria-current": bt === H.group.key ? "true" : void 0,
              "data-segment-rail-group": H.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${bt === H.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              r("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, ue ? "▸" : "▾"),
              r("span", { key: "name", className: "min-w-0 flex-1 truncate", title: H.group.name }, H.group.name),
              r("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, kt),
              G && ue ? r(rn, { key: "states", counts: H.group.counts }) : null
            ]);
          } else H.kind === "lane" ? he = r("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Zn(H.lane),
            "aria-label": Zn(H.lane)
          }, [
            r("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, H.lane.label),
            (It = H.lane.performers) != null && It.length ? r(Or, {
              key: "performers",
              performers: H.lane.performers,
              performerAssignments: H.lane.performerAssignments
            }) : null,
            G ? r(rn, { key: "states", counts: H.lane.counts }) : null
          ]) : he = _r(H.segment);
          return r("div", {
            key: H.key,
            className: "absolute left-0 right-0",
            style: { top: H.top, height: H.height }
          }, he);
        })))
      ]) : null,
      r("div", { key: "review-pane", className: `${jt ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        r("div", {
          key: "media-stack",
          ref: fe,
          className: `${jt ? "min-h-0 flex-1" : ""} grid`,
          style: jt ? {
            gridTemplateRows: `minmax(16rem, ${(1 - _.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${_.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          r("div", {
            key: "focus-row",
            ref: xe,
            className: "grid min-h-0 gap-2",
            style: sn ? {
              gridTemplateColumns: _.markerRailOpen ? `${A}px 0.5rem minmax(0,1fr) 0.5rem ${O}px` : `${A}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            r(Qc, {
              key: "tools",
              compatibilityMode: G,
              selectedSegment: vt,
              selectedSegments: _t,
              selectedGroups: Et,
              saveMessage: ke,
              savingSegmentId: ft,
              creatingSegmentId: I,
              acquireSaveLock: t,
              setSaveMessage: Fr,
              saveTag: Le,
              slotStatus: Lr,
              performerSlotsAvailable: qe,
              selectedPerformerSlots: mt,
              performerSlots: Qe,
              detail: K,
              onDetailChange: Ye,
              onCancelQueuedReview: u,
              video: Ge,
              slotButtonRef: sr,
              tagSearchRef: Un,
              tagEditing: Bn,
              onCancelTagEditing: F,
              detailPanelRef: R,
              onReduceSelection: (H) => {
                we(H), requestAnimationFrame(() => {
                  var he;
                  return (he = R.current) == null ? void 0 : he.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Pe,
              onSlotsChanged: Ze,
              onRecordHistory: Ae,
              splitSegment: lr,
              duplicateSegment: z,
              provenance: Ot,
              lineage: x,
              onNavigateLineageItem: (H) => {
                const he = at.find((It) => It.itemId === H);
                he && Ln(he.id);
              }
            }),
            sn ? r(
              "div",
              { key: "detail-separator", ...ut("detailWidth", "Resize segment details") },
              r("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Ge.videoFile ? r(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              r("div", { className: "h-full min-h-0 w-full" }, r(Di, {
                streamUrl: `/api/stream/video/${Ge.id}`,
                posterUrl: `/api/stream/video/${Ge.id}/screenshot?v=${encodeURIComponent(Ge.updatedAt || "")}`,
                format: Ge.videoFile.format,
                audioCodec: Ge.videoFile.audioCodec,
                duration: Ge.videoFile.duration,
                videoId: Ge.id,
                trackingEnabled: !1,
                onSeekRegister: (H) => {
                  Ve.current = H, Ql(Fe.current, at, H) && (Fe.current = null);
                },
                onPlaybackControlRegister: (H) => {
                  Je.current = H;
                },
                onTimeUpdate: an
              }))
            ) : r("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            sn && _.markerRailOpen ? r(
              "div",
              { key: "rail-separator", ...ut("markerRailWidth", "Resize segment rail") },
              r("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            sn && _.markerRailOpen ? r("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          r("div", {
            key: "common-actions",
            ref: j,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...zr.map((H) => {
              var ue;
              const he = (ue = xn[H.id]) == null ? void 0 : ue[0], It = H.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : H.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return r("button", {
                key: H.id,
                type: "button",
                disabled: H.disabled,
                "data-action-id": H.id,
                onClick: (kt) => {
                  const Wt = kt.currentTarget;
                  tt(H.id, { target: Wt, preserveFocus: !0 }), H.focusWhenDisabled && requestAnimationFrame(() => {
                    Zc(Wt, j.current, H.focusWhenDisabled);
                  });
                },
                title: he ? `${H.label} (${he})` : H.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${It}`
              }, [
                r("span", { key: "label" }, H.label),
                he ? r("kbd", {
                  key: "shortcut",
                  className: "rounded border border-border/70 bg-background/70 px-1 py-0.5 font-mono text-[10px] leading-none text-secondary"
                }, he) : null
              ]);
            }),
            r("div", { key: "frame-actions", className: "ml-auto flex items-center gap-1" }, [
              r("button", {
                key: "previous-frame",
                type: "button",
                disabled: !Ge.videoFile,
                onClick: () => Gn(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, r(Os, { className: "h-4 w-4", "aria-hidden": !0 })),
              r("button", {
                key: "next-frame",
                type: "button",
                disabled: !Ge.videoFile,
                onClick: () => Gn(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, r(Ps, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          jt ? r("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(dr.minimum * 100),
            "aria-valuemax": Math.round(dr.maximum * 100),
            "aria-valuenow": Math.round(_.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(_.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: se,
            onPointerMove: ce,
            onKeyDown: U,
            onDoubleClick: () => ot($t.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, r("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          r("div", { key: "timeline", className: "min-h-0", style: jt ? void 0 : { height: "20rem" } }, r(Xc, {
            segments: St,
            shotBoundaries: Fn,
            segmentGroups: lt,
            performerSlots: Qe,
            collapsedGroupKeys: W,
            selectedGroupKey: bt,
            selectedSegmentId: vt == null ? void 0 : vt.id,
            selectedSegmentIds: Lt,
            duration: Gr,
            currentTime: S,
            zoom: Kn,
            onZoomChange: jn,
            onSelectGroup: Pn,
            onToggleGroup: hn,
            onSelect: (H, he) => we(H, he),
            onSelectSegments: nt,
            onSelectAll: $e,
            onConfigureTag: (H) => gn(H),
            onSeekTime: (H) => {
              var he;
              return (he = Ve.current) == null ? void 0 : he.call(Ve, H, !1);
            },
            centerRef: b,
            showReviewState: G,
            swimlaneTitleWidth: _.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (H) => or((he) => ({ ...he, swimlaneTitleWidth: H }))
          }))
        ])
      ])
    ]),
    E ? r(Ro, {
      key: `configure-tag:${E.tagId}`,
      tagId: E.tagId,
      tagName: E.tagName,
      performerSlotsEnabled: G,
      onSaved: ht,
      onClose: () => {
        const H = E.trigger;
        gn(null), requestAnimationFrame(() => {
          var he;
          H != null && H.isConnected ? H.focus({ preventScroll: !0 }) : (he = te.current) == null || he.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    ve ? r(Hc, {
      key: "publish-approved-dialog",
      drafts: vn,
      processing: ft === -1,
      error: Ne,
      cancelButtonRef: ie,
      onConfirm: Ee,
      onClose: m
    }) : null,
    Me ? r(Wc, {
      key: "rejected-deletion-dialog",
      preview: Me,
      onConfirm: () => {
        M(Me), requestAnimationFrame(() => {
          var H;
          return (H = te.current) == null ? void 0 : H.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        bn(null), requestAnimationFrame(() => {
          var H;
          return (H = te.current) == null ? void 0 : H.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    xt ? r(Uc, {
      key: "shortcuts-dialog",
      reviewMode: G,
      bindings: xn,
      onClose: () => Zt(!1)
    }) : null,
    h ? r(Kc, {
      key: "incorrect-examples-dialog",
      examples: v,
      exporting: de,
      removingExampleId: De,
      onExport: y,
      onRemove: We,
      onClose: () => fn(!1)
    }) : null
  ]);
}
function tu(e) {
  const { allSwimlanes: t, editorRef: n, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: u, setCollapsedSegmentGroups: f, setEditorFilters: y, setHideDerivedSegments: b, setSaveMessage: g, setSelectedSegmentGroupKey: p, setSelectedSegmentId: k, setSelectedSegmentIds: C } = e;
  function m(E) {
    const N = Ut(t, E);
    N && f((I) => Ia(I, N));
  }
  function F(E) {
    k(E), C(E == null ? [] : [E]), c.current = E, u.current = [];
  }
  function W(E, {
    focusEditor: N = !1,
    seekToSegment: I = !1,
    additive: S = !1,
    rangeSegmentIds: M = null
  } = {}) {
    var R, A;
    const K = dl({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: u.current
    }, E.id, M, S);
    C(K.selectedSegmentIds), k(K.activeSegmentId), c.current = K.anchorSegmentId, u.current = K.rangeBaseSegmentIds, K.activeSegmentId != null && p(Ut(t, K.activeSegmentId)), m(E.id), N && ((R = n.current) == null || R.focus({ preventScroll: !0 })), I && ((A = i.current) == null || A.call(i, E.startSec, !1));
  }
  function j(E) {
    const N = sl(
      d,
      l,
      E
    );
    C(N.selectedSegmentIds), k(N.activeSegmentId), c.current = N.activeSegmentId, u.current = [], N.activeSegmentId != null && (p(Ut(t, N.activeSegmentId)), m(N.activeSegmentId));
  }
  function G() {
    var I;
    const E = ul(s), N = E.includes(l) ? l : E[0] ?? null;
    y(Dt({})), b(!1), C(E), k(N), c.current = N, u.current = [], N != null && p(Ut(
      cn(s, a, o),
      N
    )), g(E.length === 0 ? "There are no segments to select." : `${E.length} segments selected. Collapsed Segment groups keep their selected segments.`), (I = n.current) == null || I.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: m, replaceSegmentSelection: F, selectSegment: W, selectSegmentCollection: j, selectAllVideoSegments: G };
}
function nu(e) {
  const { acceptHistory: t, acquireSaveLock: n, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, stableSaveIdentity: c, historyRef: u, onConflict: f, onDetailChange: y, onReload: b, recordHistoryAction: g, revealSegmentGroupForSelection: p, savingSegmentId: k, selectedGroups: C, selectedSegment: m, selectedSegmentIdRef: F, selectedSegments: W, selectionAnchorIdRef: j, selectionRangeBaseIdsRef: G, setMergeConfirmation: E, setSaveMessage: N, setSelectedSegmentId: I, setSelectedSegmentIds: S, video: M } = e;
  function K() {
    E(null), requestAnimationFrame(() => {
      var Y;
      return (Y = a.current) == null ? void 0 : Y.focus({ preventScroll: !0 });
    });
  }
  async function R(Y = !1, _ = !1, te = null) {
    if (k != null) return;
    const de = te || wa(
      C,
      { nativeOnly: !o }
    );
    if (!de) {
      N("Select at least two segments from one swimlane.");
      return;
    }
    if (!Y && Wi()) {
      E(de);
      return;
    }
    _ && Vi(!1);
    const be = de.endSec == null ? "open end" : Oe(de.endSec);
    let Z = de.segments[0];
    const Ce = o ? null : Mt(de.segments, !1), xe = o ? null : crypto.randomUUID(), U = de.segments.map((le) => le.id), se = Zd(i, de.segments).segments.find((le) => le.id === Z.id), ce = {
      startSec: se.startSec,
      endSec: se.endSec,
      sourceKey: se.sourceKey,
      sourceRunId: se.sourceRunId,
      confidence: se.confidence,
      isDerived: se.isDerived
    }, Se = n("merge", de.segments[0].id);
    if (!Se) return;
    K();
    const Ie = Jt();
    s({
      type: "add",
      entry: { id: Ie, op: "merge", targets: de.segments.map(Ct), values: ce }
    }), S([Z.id]), I(Z.id), j.current = Z.id, G.current = [];
    try {
      const le = de.segments.slice(1);
      if (!o || Z.nativeSegmentId != null) {
        const Q = le.map((T) => {
          const J = `merge-native-selection:${M.id}:${Z.id}:${T.id}:${Z.updatedAt}:${T.updatedAt}`;
          return { key: J, operationId: _e(J), segmentId: T.id, expectedUpdatedAt: T.updatedAt };
        }), ye = await ee(`/videos/${M.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: Z.id,
            expectedSurvivorUpdatedAt: Z.updatedAt,
            consumedSegments: Q.map(({ key: T, ...J }) => J),
            historyReceiptId: xe
          })
        });
        Z = ye.survivor, y((T) => xi(T, ye), M.id), s({ type: "confirm", key: Ie, applied: !0 }), Q.forEach(({ key: T }) => He(T));
      } else {
        const Q = le.map((T) => {
          const J = `merge-draft-selection:${M.id}:${Z.itemId}:${T.itemId}:${Z.revision}:${T.revision}`;
          return { key: J, operationId: _e(J), itemId: T.itemId, expectedRevision: T.revision };
        }), ye = await ee(`/videos/${M.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: Z.itemId,
            expectedSurvivorRevision: Z.revision,
            consumedDrafts: Q.map(({ key: T, ...J }) => J)
          })
        });
        Z = ye.survivor, y((T) => xi(T, ye), M.id), s({ type: "confirm", key: Ie, applied: !0 }), Q.forEach(({ key: T }) => He(T));
      }
      S([Z.id]), I(Z.id), j.current = Z.id, G.current = [], o ? t(Qt) : await g(
        "segments.merge",
        `Merged ${de.segments.length} segments`,
        Ce,
        Mt([Z], !1),
        xe
      ), p(Z.id), N(`${de.segments.length} segments merged into ${Oe(de.startSec)} – ${be}.`);
    } catch (le) {
      s({ type: "discard", key: Ie }), S(U), I((m == null ? void 0 : m.id) ?? U[0] ?? null), j.current = (m == null ? void 0 : m.id) ?? U[0] ?? null, G.current = [], le.status === 409 ? await f() : N(le.message || "Unable to merge selected segments.");
    } finally {
      Se();
    }
  }
  function A(Y, _ = W, te = m) {
    if (_.length === 0) return Promise.resolve(null);
    const de = wl(Y, _, te), be = Math.max(0, de.identities.indexOf(de.activeIdentity)), Z = d(), Ce = $a(Z) != null || Z.queued.some((U) => $o(U.targets, de.identities.map(c))), xe = l({
      kind: "review",
      lockId: de.activeIdentity.id,
      targets: de.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (U) => z(U, {
        ...de,
        identities: U.targets,
        activeIdentity: U.targets[be]
      })
    });
    return xe ? (Ce && N(`${Y === "approved" ? "Approval" : "Rejection"} queued…`), xe.done) : (N("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function z({ detail: Y, segments: _, onConflict: te, onReload: de }, be) {
    var ye;
    const Z = Nl(be, _);
    if (!Z) {
      N("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: Ce, selectedSegments: xe, selectedSegment: U } = Z, se = kl(xe, Ce), ce = xe.filter((T) => T.reviewState !== se);
    if (ce.length === 0) return;
    const Se = xe.map((T) => ({
      id: T.id,
      itemId: T.itemId,
      nativeSegmentId: T.nativeSegmentId
    })), Ie = Se.find((T) => T.id === (U == null ? void 0 : U.id)) || Se[0], le = (T, J = !1) => {
      if (!(T != null && T.segments) || !J && !oo(F.current, Ie.id))
        return;
      const $ = Se.map((h) => rt(T == null ? void 0 : T.segments, h)).filter(Boolean), v = rt(T == null ? void 0 : T.segments, Ie) || $[0] || null;
      S($.map((h) => h.id)), I((v == null ? void 0 : v.id) ?? null), j.current = (v == null ? void 0 : v.id) ?? null, G.current = [];
    };
    N(`Updating ${ce.length} selected segment${ce.length === 1 ? "" : "s"}…`);
    const Q = Jt();
    s({
      type: "add",
      entry: { id: Q, op: "patch", targets: ce.map(Ct), values: { reviewState: se } }
    });
    try {
      const T = await ee(`/videos/${M.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: u.current.revision,
          reviewState: se,
          segments: xe.map((h) => h.published ? {
            nativeSegmentId: h.nativeSegmentId,
            expectedUpdatedAt: h.updatedAt
          } : {
            itemId: h.itemId,
            expectedRevision: h.revision
          })
        })
      }), J = new Map((T.items || []).map((h) => [
        h.requestedNativeSegmentId != null ? `native:${h.requestedNativeSegmentId}` : `item:${h.requestedItemId}`,
        h
      ]));
      if (Se.forEach((h) => {
        const x = J.get(h.nativeSegmentId != null ? `native:${h.nativeSegmentId}` : `item:${h.itemId}`);
        x && (h.nativeSegmentId = x.nativeSegmentId, h.itemId = x.itemId);
      }), T.history && t(T.history), se === "rejected" && !T.editorDelta || (T.items || []).some((h) => h.requestedNativeSegmentId != null && h.nativeSegmentId !== h.requestedNativeSegmentId)) {
        const h = await de();
        s({ type: "confirm", key: Q, applied: h != null }), le(h), N(`${T.updatedCount} selected segment${T.updatedCount === 1 ? "" : "s"} ${se === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const v = T.editorDelta ? (h) => Vn(h, T.editorDelta) : (h) => ({
        ...h,
        approvedSetVersion: T.approvedSetVersion || h.approvedSetVersion,
        segments: (h.segments || []).map((x) => {
          const O = J.get(x.nativeSegmentId != null ? `native:${x.nativeSegmentId}` : `item:${x.itemId}`);
          return O ? {
            ...x,
            id: O.nativeSegmentId != null ? O.nativeSegmentId : -O.itemId,
            itemId: O.itemId,
            nativeSegmentId: O.nativeSegmentId,
            published: O.nativeSegmentId != null,
            reviewState: se,
            revision: O.nativeSegmentId != null ? x.revision : O.revision,
            updatedAt: O.updatedAt
          } : x;
        })
      });
      y(v, M.id), s({ type: "confirm", key: Q, applied: !0 }), le(v(Y)), N(`${T.updatedCount} selected segment${T.updatedCount === 1 ? "" : "s"} ${se === "approved" ? "approved" : se === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (T) {
      s({ type: "discard", key: Q }), T.status === 409 && ((ye = T.payload) != null && ye.currentHistory) && t(T.payload.currentHistory);
      const J = T.status === 409 ? await te() : Y;
      le(J, !0), N(T.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: K, mergeSelectedSwimlane: R, saveSelectedReviewState: A };
}
function ru(e) {
  const { acceptHistory: t, acquireSaveLock: n, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: u, detail: f, editorFilters: y, editorRef: b, cancelSaveTasks: g, dispatchPendingChanges: p, enqueueSave: k, stableSaveIdentity: C, exportingExamples: m, hideDerivedSegments: F, incorrectExamples: W, lineage: j, materializeButtonRef: G, materializePreview: E, materializeRestoreFocusRef: N, materializing: I, mutateSegment: S, runSegmentMutation: M, pendingChanges: K, onConflict: R, onDetailChange: A, onReload: z, performerSlots: Y, recordHistoryAction: _, refreshMaterializationPreview: te, removingExampleId: de, revealSegmentGroupForSelection: be, savingSegmentId: Z, segmentGroups: Ce, segments: xe, selectedSegment: U, selectedSegmentIdRef: se, selectedSegments: ce, selectionAnchorIdRef: Se, selectionRangeBaseIdsRef: Ie, setAutoAssignError: le, setAutoAssignOpen: Q, setAutoAssigning: ye, setEditorFilters: T, setExportingExamples: J, setHideDerivedSegments: $, setIncorrectExamples: v, setMaterializeError: h, setMaterializeLoading: x, setMaterializeOpen: O, setMaterializePreview: ne, setMaterializing: re, setRejectedDeletionPreview: P, setRemovingExampleId: oe, setSaveMessage: w, setSelectedSegmentGroupKey: q, setSelectedSegmentId: L, setSelectedSegmentIds: X, swimlanes: fe, video: me } = e;
  async function Te() {
    var De, je, tt;
    if (ce.length === 0 || !U || Z != null) return;
    const V = Wd(ce, W), ie = V.segments;
    if (ie.length === 0) return;
    const Ee = ce.map((ke) => ({
      id: ke.id,
      itemId: ke.itemId,
      nativeSegmentId: ke.nativeSegmentId
    })), Ne = Ee.find((ke) => ke.id === U.id) || Ee[0], ve = [], et = [];
    let Ue = !1, Xe = f, Ae = !1;
    const Me = [], We = n("feedback", Ne.id);
    if (We) {
      w(V.action === "remove" ? `Removing ${ie.length} selected incorrect example${ie.length === 1 ? "" : "s"}…` : `Collecting ${ie.length} selected segment${ie.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const ke = async ($e, we) => {
          const nt = $e.nativeSegmentId != null, Et = V.action === "remove" ? `incorrect-example-remove:${me.id}:${we == null ? void 0 : we.id}:${we == null ? void 0 : we.revision}:${we == null ? void 0 : we.representationRevision}` : `incorrect-example-collect:${me.id}:${nt ? `native:${$e.nativeSegmentId}:${$e.updatedAt}` : `item:${$e.itemId}:${$e.revision}`}`;
          if (V.action === "remove" && !we)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let mt;
          try {
            mt = V.action === "remove" ? await ee(
              `/videos/${me.id}/incorrect-examples/${we.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: _e(Et),
                  expectedExampleRevision: we.revision,
                  expectedRepresentationRevision: we.representationRevision
                })
              }
            ) : await ee(`/videos/${me.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: _e(Et),
                nativeSegmentId: nt ? $e.nativeSegmentId : null,
                itemId: nt ? null : $e.itemId,
                expectedUpdatedAt: nt ? $e.updatedAt : null,
                expectedRevision: nt ? null : $e.revision
              })
            });
          } catch (vt) {
            throw vt.operationKey = Et, vt;
          }
          if (!Vd(V.action, mt))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return He(Et), mt;
        };
        for (const $e of ie) {
          const we = V.action === "remove" ? W.find((nt) => nt.itemId != null && nt.itemId === $e.itemId) : null;
          try {
            const nt = Ee.find((bt) => bt.id === $e.id);
            let Et = rt(
              Xe == null ? void 0 : Xe.segments,
              nt
            ) || $e, mt;
            try {
              mt = await ke(Et, we);
            } catch (bt) {
              if (bt.status === 409 && ((je = (De = bt.payload) == null ? void 0 : De.result) == null ? void 0 : je.code) === "OPERATION_REPLAYED")
                Xe = await ee(
                  `/videos/${me.id}/editor`
                ), Ae = !0, Me.length = 0, He(bt.operationKey), mt = bt.payload.result;
              else {
                if (V.action !== "collect" || bt.status !== 409) throw bt;
                const Lt = await ee(
                  `/videos/${me.id}/editor`
                );
                Xe = Lt, Ae = !0, Me.length = 0;
                const _t = rt(
                  Lt == null ? void 0 : Lt.segments,
                  nt
                );
                if (!_t) throw bt;
                Et = _t, mt = await ke(Et, null);
              }
            }
            nt && mt.itemId != null && (nt.itemId = mt.itemId), Xe = Vn(
              Xe,
              mt.editorDelta
            ), Me.push(mt.editorDelta);
            const vt = { segment: $e, result: mt, example: we };
            ve.push(vt);
          } catch (nt) {
            if (et.push(nt), ![400, 404, 409].includes(nt.status)) break;
          }
        }
        if (c && ve.length > 0) {
          const $e = V.action === "remove", we = ve.length;
          await _(
            $e ? "feedback.remove" : "feedback.collect",
            $e ? `Removed ${we} incorrect AI example${we === 1 ? "" : "s"}` : `Collected ${we} incorrect AI example${we === 1 ? "" : "s"}`,
            vr(ve, $e),
            vr(ve, !$e)
          ) || (Ue = !0);
        }
        ve.some(({ result: $e }) => $e.representation === "basicNativeBin") && Yn();
        const Le = oo(
          se.current,
          Ne.id
        ), Pe = V.action === "collect" && ve.some(({ segment: $e }) => $e.id === Ne.id), ft = ve.map(({ segment: $e }) => $e.id), Ve = Pe ? Nr(
          fe,
          wr(o, Ne.id),
          { removedIds: ft }
        ) : null, lt = Pe ? (Ve == null ? void 0 : Ve.id) ?? null : Ne.id;
        Le && Pe && (X(Ve ? [Ve.id] : []), L((Ve == null ? void 0 : Ve.id) ?? $n), Se.current = (Ve == null ? void 0 : Ve.id) ?? null, Ie.current = []);
        const Pt = await ee(`/videos/${me.id}/incorrect-examples`);
        v(Pt);
        const at = Xe;
        if (A(Ae ? at : ($e) => Me.reduce(Vn, $e), me.id), Le && oo(
          se.current,
          lt
        )) {
          let $e, we;
          Pe ? (we = Ve ? rt(at == null ? void 0 : at.segments, {
            id: Ve.id,
            itemId: Ve.itemId,
            nativeSegmentId: Ve.nativeSegmentId
          }) : null, $e = we ? [we] : []) : ($e = Ee.map((nt) => rt(at == null ? void 0 : at.segments, nt)).filter(Boolean), we = rt(at == null ? void 0 : at.segments, Ne) || $e[0] || null), X($e.map((nt) => nt.id)), L((we == null ? void 0 : we.id) ?? (Pe ? $n : null)), Se.current = (we == null ? void 0 : we.id) ?? null, Ie.current = [], q(we ? Ut(o, we.id) : null), we && be(we.id);
        }
        if (et.length > 0) {
          const $e = ((tt = et[0]) == null ? void 0 : tt.message) || "Only segments with registered AI provenance can be collected.";
          ve.length === 0 ? w($e) : V.action === "remove" ? w(
            `Partially removed ${ve.length} of ${ie.length} selected incorrect examples. ${$e}`
          ) : w(
            `Partially collected ${ve.length} of ${ie.length} selected segments. ${$e}`
          );
        } else if (V.action === "remove")
          w(
            `${ve.length} incorrect example${ve.length === 1 ? "" : "s"} removed and ${ve.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const $e = ve.filter(({ result: we }) => we.representation === "basicNativeBin").length;
          w($e === ve.length ? `${ve.length} incorrect AI example${ve.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ve.length} incorrect AI example${ve.length === 1 ? "" : "s"} collected and ${ve.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        Ue && w("The change saved, but editor history could not be updated.");
      } catch (ke) {
        w(ke.message || "Unable to update the selected incorrect examples.");
      } finally {
        We();
      }
    }
  }
  async function pt(V) {
    if (!V || de != null || m) return;
    const ie = n("feedback", -1);
    if (!ie) {
      w("Wait for the current save to finish before removing the incorrect example.");
      return;
    }
    try {
      await Be(V);
    } finally {
      ie();
    }
  }
  async function Be(V) {
    var Ee, Ne;
    oe(V.id);
    const ie = `incorrect-example-remove:${me.id}:${V.id}:${V.revision}:${V.representationRevision}`;
    try {
      let ve, et = !1;
      try {
        ve = await ee(
          `/videos/${me.id}/incorrect-examples/${V.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(ie),
              expectedExampleRevision: V.revision,
              expectedRepresentationRevision: V.representationRevision
            })
          }
        );
      } catch (Ae) {
        if (Ae.status !== 409 || ((Ne = (Ee = Ae.payload) == null ? void 0 : Ee.result) == null ? void 0 : Ne.code) !== "OPERATION_REPLAYED")
          throw Ae;
        ve = Ae.payload.result, et = !0;
      }
      He(ie);
      let Ue = !0;
      if (c) {
        const Me = [{ segment: rt(f.segments, {
          itemId: V.itemId
        }) || {
          id: V.itemId == null ? null : -V.itemId,
          itemId: V.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: V.representationRevision
        }, result: ve, example: V }];
        Ue = await _(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          vr(Me, !0),
          vr(Me, !1)
        );
      }
      const Xe = await ee(
        `/videos/${me.id}/incorrect-examples`
      );
      v(Xe), et ? await z() : A(
        (Ae) => Vn(Ae, ve.editorDelta),
        me.id
      ), V.representation === "basicNativeBin" && Yn(), w(Ue ? et ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : V.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (ve) {
      ve.status === 409 && await R(), w(ve.message || "Unable to remove the incorrect example.");
    } finally {
      oe(null);
    }
  }
  async function Re() {
    if (m || de != null || W.length === 0) return;
    J(!0);
    const V = `incorrect-example-export:${me.id}:${W.map((ie) => `${ie.id}:${ie.revision}:${ie.representationRevision}`).join(",")}`;
    try {
      const ie = await Yd(
        me.id,
        W
      ), Ee = new FormData();
      Ee.append("metadata", JSON.stringify({
        operationId: _e(V),
        examples: ie.captures
      }));
      for (const Ae of ie.files)
        Ee.append(Ae.fieldName, Ae.file);
      const Ne = await ee(
        `/videos/${me.id}/incorrect-examples/export`,
        { method: "POST", body: Ee }
      ), ve = await gd(Ne.downloadUrl), et = URL.createObjectURL(ve.blob), Ue = document.createElement("a");
      Ue.href = et, Ue.download = ve.fileName, Ue.click(), setTimeout(() => URL.revokeObjectURL(et), 1e3);
      const Xe = await ee(
        `/training-exports/${Ne.id}/complete`,
        { method: "POST" }
      );
      He(V), v(await ee(
        `/videos/${me.id}/incorrect-examples`
      )), w(
        `Downloaded ${Ne.exampleCount} incorrect example${Ne.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Xe.clearedExampleCount} from the working collection.`
      );
    } catch (ie) {
      w(ie.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      J(!1);
    }
  }
  async function Ye(V = null) {
    const ie = xe.filter((je) => je.reviewState === "rejected"), Ee = ie.length, Ne = W.some((je) => je.representation === "fullItem");
    if (V == null && Ee === 0 && !Ne) {
      w("There are no rejected segments to delete.");
      return;
    }
    if (V == null) {
      const je = n("delete-rejected", -1);
      if (!je) return;
      w("Preparing deletion summary…");
      try {
        const tt = await ee(`/videos/${me.id}/rejected/deletion/preview`, { method: "POST" }), ke = Number(tt.deletedSegmentCount) || 0, Le = Number(tt.deferredRejectedSegmentCount) || 0, Pe = Number(tt.protectedIncorrectExampleCount) || 0;
        if (ke === 0) {
          Le > 0 ? w(
            `${Le} feedback-protected rejected segment${Le === 1 ? "" : "s"} kept. ${Pe} AI feedback example${Pe === 1 ? "" : "s"} must be exported before ${Le === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : w("There are no rejected segments to delete.");
          return;
        }
        if (!ga(tt, w)) return;
        P(tt), w("");
      } catch (tt) {
        w(tt.message || "Unable to prepare rejected segment deletion.");
      } finally {
        je();
      }
      return;
    }
    const ve = V, et = Number(ve.deferredRejectedSegmentCount) || 0, Ue = se.current, Xe = ie.map((je) => je.id), Ae = et === 0 && Xe.includes(Ue), Me = Ae ? Nr(
      fe,
      wr(o, Ue),
      { removedIds: Xe }
    ) : null, We = n("delete-rejected", -1);
    if (!We) return;
    P(null), w("Deleting rejected segments…");
    const De = et === 0 ? Jt() : null;
    De && p({
      type: "add",
      entry: { id: De, op: "remove", targets: ie.map(Ct) }
    }), Ae && (X(Me ? [Me.id] : []), L((Me == null ? void 0 : Me.id) ?? $n), Se.current = (Me == null ? void 0 : Me.id) ?? null, Ie.current = []);
    try {
      const je = `rejected-dependency-delete:${me.id}:${ve.fingerprint}`, tt = await ee(`/videos/${me.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(je),
          fingerprint: ve.fingerprint
        })
      });
      He(je);
      const ke = await z();
      De && p({ type: "confirm", key: De, applied: ke != null }), tt.deletedSegmentCount > 0 && t(Qt);
      const Le = et > 0 ? ` ${et} feedback-protected rejected segment${et === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      w(`${tt.deletedSegmentCount} segment${tt.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Le}`);
    } catch (je) {
      De && p({ type: "discard", key: De }), Ae && (X(Ue == null ? [] : [Ue]), L(Ue), Se.current = Ue, Ie.current = []), w(je.message || "Unable to delete rejected segments.");
    } finally {
      We();
    }
  }
  async function it(V = i) {
    if (a || V.length === 0) return;
    const ie = n("auto-assign", -1);
    if (!ie) {
      le("Wait for the current save to finish before assigning performers.");
      return;
    }
    try {
      await ht(V);
    } finally {
      ie();
    }
  }
  async function ht(V) {
    ye(!0), le("");
    try {
      const ie = await ee(`/videos/${me.id}/segments/auto-assign-performer-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeSegmentIds: V.flatMap((Ee) => Ee.nativeSegmentId == null ? [] : [Ee.nativeSegmentId]),
          itemIds: V.flatMap((Ee) => Ee.published || Ee.itemId == null ? [] : [Ee.itemId])
        })
      });
      Q(!1), await z(), w(`${ie.assignedSegmentCount} segment${ie.assignedSegmentCount === 1 ? "" : "s"} received ${ie.assignedSlotCount} performer-slot assignment${ie.assignedSlotCount === 1 ? "" : "s"}.`);
    } catch (ie) {
      le(ie.message || "Unable to auto-assign performers.");
    } finally {
      ye(!1);
    }
  }
  async function Ze() {
    O(!0), h(""), !E && (x(!0), te());
  }
  function yt() {
    N.current = !0, O(!1), requestAnimationFrame(() => {
      var V;
      return (V = G.current) == null ? void 0 : V.focus({ preventScroll: !0 });
    });
  }
  async function ut() {
    if (!E || I || E.createCount + E.linkCount === 0)
      return;
    const V = n("materialize", -1);
    if (!V) {
      h("Wait for the current save to finish before materializing derived segments.");
      return;
    }
    try {
      await Fe();
    } finally {
      V();
    }
  }
  async function Fe() {
    re(!0), h("");
    let V;
    try {
      const ie = `materialize-derived:${me.id}:${E.fingerprint}`;
      V = await ee(`/videos/${me.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(ie),
          fingerprint: E.fingerprint,
          maxDepth: 3
        })
      }), He(ie);
    } catch (ie) {
      ie.status === 409 && ne(null), h(ie.message || "Unable to materialize derived segments."), re(!1);
      return;
    }
    ne((ie) => ie && { ...ie, createCount: 0, linkCount: 0 });
    try {
      await z(), yt(), ne(null);
      const ie = V.createdCount + V.linkedCount;
      w(`${V.createdCount} derived segment${V.createdCount === 1 ? "" : "s"} created and ${V.linkedCount} existing segment${V.linkedCount === 1 ? "" : "s"} linked.`), ie === 0 && w("Every applicable derivation was already materialized.");
    } catch {
      h("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    re(!1);
  }
  async function Qe(V, ie = null) {
    var ve, et, Ue, Xe;
    const Ee = {
      tagId: V,
      ...ie ? { tagName: ie } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (ce.length > 1) {
      const Ae = ce.filter((ke) => ke.tagId !== V);
      if (Ae.length === 0) {
        d();
        return;
      }
      const Me = ce.map((ke) => ({
        id: ke.id,
        itemId: ke.itemId,
        nativeSegmentId: ke.nativeSegmentId
      })), We = ce.map((ke) => !c || ke.nativeSegmentId != null ? `native:${ke.nativeSegmentId}:${ke.updatedAt}` : `item:${ke.itemId}:${ke.revision}`).sort().join(","), De = `bulk-tag:${me.id}:${V}:${We}`, je = n("tag", (U == null ? void 0 : U.id) ?? Ae[0].id);
      if (!je) return;
      w(`Changing tag for ${Ae.length} selected segment${Ae.length === 1 ? "" : "s"}…`);
      const tt = Jt();
      p({
        type: "add",
        entry: { id: tt, op: "patch", targets: Ae.map(Ct), values: Ee }
      }), d();
      try {
        const ke = c ? null : crypto.randomUUID();
        await ee(`/videos/${me.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(De),
            tagId: V,
            historyReceiptId: ke,
            segments: ce.map((lt) => {
              const Pt = !c || lt.nativeSegmentId != null;
              return {
                nativeSegmentId: Pt ? lt.nativeSegmentId : null,
                itemId: Pt ? null : lt.itemId,
                expectedUpdatedAt: Pt ? lt.updatedAt : null,
                expectedRevision: Pt ? null : lt.revision
              };
            })
          })
        }), He(De);
        const Le = Mt(
          ce,
          c
        ), Pe = await z();
        p({ type: "confirm", key: tt, applied: Pe != null });
        const ft = Me.map((lt) => rt(Pe == null ? void 0 : Pe.segments, lt)).filter(Boolean);
        await _(
          "segments.tag",
          `Changed tag for ${Ae.length} segment${Ae.length === 1 ? "" : "s"}`,
          Le,
          Mt(ft, c),
          ke
        );
        const Ve = Me.map((lt) => rt(Pe == null ? void 0 : Pe.segments, lt)).filter(Boolean);
        X(Ve.map((lt) => lt.id)), L(((ve = Ve.find((lt) => lt.id === (U == null ? void 0 : U.id))) == null ? void 0 : ve.id) ?? ((et = Ve[0]) == null ? void 0 : et.id) ?? null), d(), w(`${Ae.length} selected segment${Ae.length === 1 ? "" : "s"} retagged.`);
      } catch (ke) {
        p({ type: "discard", key: tt });
        const Le = Me.map((ft) => rt(f.segments, ft)).filter(Boolean), Pe = rt(f.segments, {
          id: U == null ? void 0 : U.id,
          itemId: U == null ? void 0 : U.itemId,
          nativeSegmentId: U == null ? void 0 : U.nativeSegmentId
        }) || Le[0] || null;
        X(Le.map((ft) => ft.id)), L((Pe == null ? void 0 : Pe.id) ?? null), Se.current = (Pe == null ? void 0 : Pe.id) ?? null, Ie.current = [], ke.status === 409 && await R(), w(ke.message || "Unable to change the selected segment tags.");
      } finally {
        je();
      }
      return;
    }
    if (ce.length !== 1 || !U) return;
    const Ne = Ta(K, U);
    if (U.id === u || Ne) {
      const Ae = Ne ? { segmentId: U.id, tagId: Ne.values.tagId, tagName: Ne.meta.tagName } : null, Me = Rl(Ae, U, V, ie);
      if (Me && !qe(U, Me)) {
        d();
        return;
      }
      if (Ne && (g((We) => {
        var De;
        return ((De = We.meta) == null ? void 0 : De.pendingChangeId) === Ne.id;
      }), p({ type: "discard", key: Ne.id })), Me) {
        const We = Ji(
          { ...U, tagId: Me.tagId },
          Y,
          y,
          F,
          Ce
        );
        T(We.filters), $(We.hideDerivedSegments), w("Tag change queued…");
      } else Ne && w("");
      d();
      return;
    }
    if (V === U.tagId) {
      d();
      return;
    }
    if (U.itemId != null && ((Xe = (Ue = j.data) == null ? void 0 : Ue.children) == null ? void 0 : Xe.length) > 0) {
      const Ae = n("lineage-tag", U.id);
      if (!Ae) return;
      w("Checking lineage impact…");
      let Me = null;
      try {
        const We = await ee(`/items/${U.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: U.revision, tagId: V })
        }), De = We.deletedItemIds.length > 0 || We.removedEdgeIds.length > 0;
        if (De && !window.confirm(
          `Changing this tag removes ${We.removedEdgeIds.length} lineage edge${We.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${We.deletedItemIds.length} derived segment${We.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
        )) {
          w("Tag change canceled.");
          return;
        }
        Me = Jt(), p({
          type: "add",
          entry: { id: Me, op: "patch", targets: [Ct(U)], values: Ee }
        }), d();
        const je = `tag-change:${U.itemId}:${U.revision}:${We.componentFingerprint}:${V}`;
        await ee(`/items/${U.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(je),
            expectedRevision: U.revision,
            componentFingerprint: We.componentFingerprint,
            tagId: V
          })
        }), He(je);
        const tt = await z();
        p({ type: "confirm", key: Me, applied: tt != null }), d(), w(De ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch (We) {
        Me && p({ type: "discard", key: Me }), X([U.id]), L(U.id), Se.current = U.id, Ie.current = [], We.status === 409 ? (w("Lineage changed — loading the latest segments…"), await R()) : w(We.message || "Unable to reconcile the lineage.");
      } finally {
        Ae();
      }
      return;
    }
    d(), await S(U, {
      startSec: U.startSec,
      endSec: U.endSec,
      tagId: V
    }, !0, null, !0, Ee);
  }
  function qe(V, ie) {
    const Ee = Jt(), Ne = C(Ct(V));
    p({
      type: "add",
      entry: {
        id: Ee,
        op: "patch",
        targets: [Ne],
        values: { tagId: ie.tagId, tagName: ie.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: ie.tagName }
      }
    });
    const ve = K.find((Ue) => Ue.op === "insert" && Ue.segment.id === V.id);
    return k({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [Ne],
      dependsOn: (ve == null ? void 0 : ve.taskId) ?? null,
      meta: { pendingChangeId: Ee },
      ready: (Ue, Xe) => {
        const Ae = Ca(Ue.segments, Xe.targets[0]);
        return !Ae || El(Ue, Ae.id);
      },
      run: (Ue) => Je(Ue, Ee, ie)
    }) ? !0 : (p({ type: "discard", key: Ee }), w("Wait for the history restore to finish."), !1);
  }
  async function Je(V, ie, Ee) {
    const [Ne] = V.resolveTargets();
    if (!Ne) {
      p({ type: "discard", key: ie }), w(`The new segment was not retagged${Ee.tagName ? ` to ${Ee.tagName}` : ""}. Choose its tag again.`);
      return;
    }
    if (Ne.tagId === Ee.tagId) {
      p({ type: "discard", key: ie });
      return;
    }
    await M(Ne, {
      startSec: Ne.startSec,
      endSec: Ne.endSec,
      tagId: Ee.tagId
    }, {
      pendingChangeId: ie,
      restoreSelectionOnFailure: !1,
      onReload: V.onReload,
      onConflict: V.onConflict
    }) || w(`The new segment was not retagged${Ee.tagName ? ` to ${Ee.tagName}` : ""}. Choose its tag again.`);
  }
  async function st() {
    var Xe, Ae, Me, We;
    if (!l || !U || Z != null) return;
    const V = [...ce].sort((De, je) => Number(De.nativeSegmentId ?? De.id) - Number(je.nativeSegmentId ?? je.id)), ie = new Set(V.map((De) => De.id)), Ee = V.map((De) => `${De.nativeSegmentId ?? De.id}:${De.updatedAt}`).join("|"), Ne = n("bin", U.id);
    if (!Ne) return;
    w(`Moving ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin…`);
    const ve = `bulk-move:${me.id}:${Ee}`, et = _e(ve), Ue = c ? null : crypto.randomUUID();
    try {
      const De = (Le = !1) => ee(`/videos/${me.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: et,
          segments: V.map((Pe) => ({
            segmentId: Pe.nativeSegmentId ?? Pe.id,
            expectedUpdatedAt: Pe.updatedAt
          })),
          discardMissingImage: Le,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: Ue
        })
      });
      let je;
      try {
        je = await De(
          So(ve)
        );
      } catch (Le) {
        if (((Xe = Le.payload) == null ? void 0 : Xe.code) !== "missing-image" || !window.confirm(`${Le.message}

Continue and discard the missing image reference?`)) throw Le;
        ko(ve), je = await De(!0);
      }
      He(ve), Yn();
      const tt = new Map((je.items || []).map((Le) => [
        Number(Le.segmentId),
        Le
      ]));
      await _(
        "segments.moveToBin",
        `Moved ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin`,
        Mt(V, !1),
        Mt(V.map((Le) => {
          const Pe = tt.get(
            Number(Le.nativeSegmentId ?? Le.id)
          );
          return {
            ...Le,
            recycleBinItemId: (Pe == null ? void 0 : Pe.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (Pe == null ? void 0 : Pe.revision) ?? null
          };
        }), !1),
        Ue
      );
      const ke = Nr(
        fe,
        wr(o, U.id),
        { removedIds: [...ie] }
      );
      A((Le) => ({
        ...Le,
        segments: (Le.segments || []).filter((Pe) => !ie.has(Pe.id))
      }), me.id), X(ke ? [ke.id] : []), L((ke == null ? void 0 : ke.id) ?? $n), Se.current = (ke == null ? void 0 : ke.id) ?? null, Ie.current = [], ke && (q(Ut(o, ke.id)), be(ke.id)), requestAnimationFrame(() => {
        var Le;
        return (Le = b.current) == null ? void 0 : Le.focus({ preventScroll: !0 });
      }), w(`Moved ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (De) {
      const je = ((Ae = De.payload) == null ? void 0 : Ae.code) || ((We = (Me = De.payload) == null ? void 0 : Me.result) == null ? void 0 : We.code);
      De.status === 409 && je === "CANONICAL_SEGMENT_CHANGED" ? await R() : w(De.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Ne();
    }
  }
  async function Ot() {
    if (!(c || s.current || Z != null)) {
      s.current = !0, w("Checking the recycling bin…");
      try {
        const V = await ee("/bin"), ie = await fa(V, () => w("Emptying the recycling bin…"));
        if (ie.status === "empty") {
          w("The recycling bin is empty.");
          return;
        }
        if (ie.status === "canceled") {
          w("The recycling bin was not emptied.");
          return;
        }
        w(`${ie.segmentCount} segment${ie.segmentCount === 1 ? "" : "s"} from ${ie.sceneCount} scene${ie.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (V) {
        w(V.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: Te, removeIncorrectExample: pt, captureTrainingExport: Re, deleteRejectedSegments: Ye, autoAssignPerformers: it, previewDerivedSegments: Ze, closeMaterializeDialog: yt, materializeDerivedSegments: ut, saveTag: Qe, moveToBin: st, emptyRecyclingBin: Ot };
}
function ou(e) {
  const { acceptHistory: t, acquireSaveLock: n, enqueueSave: o, getSaveQueueSnapshot: i, commonActionsRef: a, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: u, history: f, historyRef: y, historySaving: b, horizontalLayoutSize: g, mediaStackHeight: p, mediaStackRef: k, onDetailChange: C, onReload: m, railToggleRef: F, recordHistoryAction: W, savingSegmentId: j, setCollapsedSegmentGroups: G, setEditorLayout: E, setHistorySaving: N, setIncorrectExamples: I, setSaveMessage: S, shotBoundaries: M, timelineDuration: K, video: R, workspaceRef: A } = e;
  async function z($, v, h) {
    var re, P, oe, w;
    const x = $.type === "segment" ? [$] : $.segments || [], O = (v == null ? void 0 : v.type) === "segment" ? [v] : (v == null ? void 0 : v.segments) || [];
    let ne = h;
    for (const [q, L] of x.entries()) {
      const X = O[q], fe = ((re = L.identity) == null ? void 0 : re.nativeSegmentId) != null || ((P = L.identity) == null ? void 0 : P.published) === !0, me = ((oe = X == null ? void 0 : X.identity) == null ? void 0 : oe.recycleBinItemId) ?? ((w = X == null ? void 0 : X.identity) == null ? void 0 : w.itemId);
      let Te = rt(ne.segments, X == null ? void 0 : X.identity) || rt(ne.segments, L.identity);
      if (!Te && fe && me != null && X.identity.revision != null) {
        const Re = `history-restore:${R.id}:${me}:${X.identity.revision}`;
        await ee(`/bin/${me}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(Re),
            expectedRevision: X.identity.revision
          })
        }), He(Re), ne = await m(), Te = ne.segments.find((Ye) => Ye.tagId === L.values.tagId && Ye.startSec === L.values.startSec && Ye.endSec === L.values.endSec);
      }
      if (!Te)
        throw new Error("A segment in this history state no longer exists.");
      if ((Te.nativeSegmentId != null || Te.published === !0) !== fe) {
        if (fe) {
          const Re = Te.recycleBinItemId ?? Te.itemId ?? me;
          if (Re == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Ye = `history-restore:${R.id}:${Re}:${Te.revision}:${L.values.reviewState ?? "native"}`;
          await ee(`/bin/${Re}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(Ye),
              expectedRevision: Te.revision
            })
          }), He(Ye);
        } else {
          const Re = `history-bin:${R.id}:${Te.nativeSegmentId}:${Te.updatedAt}:${L.values.reviewState}`;
          await ee(`/videos/${R.id}/segments/${Te.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(Re),
              expectedUpdatedAt: Te.updatedAt,
              reviewState: L.values.reviewState
            })
          }), He(Re);
        }
        if (ne = await m(), !fe)
          continue;
        if (Te = rt(ne.segments, L.identity) || ne.segments.find((Re) => Re.tagId === L.values.tagId && Re.startSec === L.values.startSec && Re.endSec === L.values.endSec), !Te)
          throw new Error("The restored segment could not be found.");
      }
      const Be = L.values;
      if (Te.nativeSegmentId == null && Te.itemId != null) {
        const Re = `history-draft-update:${R.id}:${Te.itemId}:${Te.revision}:${Be.tagId}:${Be.startSec}:${Be.endSec ?? "open"}:${Be.reviewState}`;
        await ee(`/videos/${R.id}/drafts/${Te.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(Re),
            expectedRevision: Te.revision,
            ...Be
          })
        }), He(Re);
      } else
        await ee(`/videos/${R.id}/segments/${Te.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Be, expectedUpdatedAt: Te.updatedAt })
        });
      ne = await m();
    }
    return ne;
  }
  async function Y($, v) {
    var h;
    for (const x of $.targets || []) {
      const O = rt(v.segments, x.identity);
      if (!O)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const ne = (h = v.performerSlotRevisions) == null ? void 0 : h[O.id];
      await ee(O.published ? `/videos/${R.id}/segments/${O.nativeSegmentId}/slots` : `/videos/${R.id}/drafts/${O.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: ne,
          assignments: x.assignments
        })
      }), v = await m();
    }
    return v;
  }
  async function _($, v, h) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let x = v, O = await ee(`/videos/${R.id}/incorrect-examples`);
    const ne = (re) => O.find((P) => {
      var oe;
      return P.id === re.exampleId || ((oe = re.collectedIdentity) == null ? void 0 : oe.itemId) != null && P.itemId === re.collectedIdentity.itemId;
    });
    for (const [re, P] of ($.entries || []).entries()) {
      const oe = `history-feedback:${R.id}:${h.action.sequence}:${h.direction}:${re}`, w = ne(P);
      if ($.collected && w) {
        He(oe);
        continue;
      }
      let q;
      if ($.collected) {
        const L = rt(
          x.segments,
          P.collectedIdentity
        ) || rt(
          x.segments,
          P.originalIdentity
        );
        if (!L)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const X = L.nativeSegmentId != null;
        q = await ee(`/videos/${R.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(oe),
            nativeSegmentId: X ? L.nativeSegmentId : null,
            itemId: X ? null : L.itemId,
            expectedUpdatedAt: X ? L.updatedAt : null,
            expectedRevision: X ? null : L.revision
          })
        });
      } else {
        if (!w) {
          He(oe);
          continue;
        }
        q = await ee(
          `/videos/${R.id}/incorrect-examples/${w.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(oe),
              expectedExampleRevision: w.revision,
              expectedRepresentationRevision: w.representationRevision
            })
          }
        );
      }
      He(oe), x = Vn(
        x,
        q.editorDelta
      ), O = await ee(
        `/videos/${R.id}/incorrect-examples`
      );
    }
    return I(O), x;
  }
  async function te($, v, h = []) {
    const x = $.state;
    if (!s && ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")) {
      const ne = `basic-history:${R.id}:${y.current.revision}:${$.action.sequence}:${$.direction}`, re = await ee(`/videos/${R.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(ne),
          expectedHistoryRevision: y.current.revision,
          actionSequence: $.action.sequence,
          direction: $.direction
        })
      });
      return t(re.history), h.push(ne), m();
    }
    const O = $.direction === "backward" ? $.action.afterState : $.action.beforeState;
    if ((x == null ? void 0 : x.type) === "composite") {
      let ne = v;
      const re = (O == null ? void 0 : O.type) === "composite" ? O.states || [] : [];
      for (const [P, oe] of (x.states || []).entries()) {
        const w = re[P];
        ne = await te({
          ...$,
          state: oe,
          action: {
            ...$.action,
            beforeState: $.direction === "backward" ? oe : w,
            afterState: $.direction === "backward" ? w : oe
          }
        }, ne, h);
      }
      return ne;
    }
    if ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")
      return z(
        x,
        O,
        v
      );
    if ((x == null ? void 0 : x.type) === "performerSlots")
      return Y(x, v);
    if ((x == null ? void 0 : x.type) === "incorrectExamples")
      return _(x, v, $);
    if ((x == null ? void 0 : x.type) === "shots") {
      const ne = Yr(v.shotBoundaries || []), re = await ee(`/videos/${R.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(`history-shots:${R.id}:${ne}:${x.fingerprint}`),
          expectedFingerprint: ne,
          boundaries: x.boundaries
        })
      });
      return { ...v, shotBoundaries: re };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function de($) {
    if (b || $ === f.cursorSequence) return;
    if (j != null) {
      S("Finish the pending saves before restoring history.");
      return;
    }
    if (hi(f, $).length === 0) return;
    const h = o({
      kind: "history",
      lockId: -1,
      exclusive: !0,
      run: (x) => be(x.detail, $)
    });
    if (!h) {
      S("Finish the pending saves before restoring history.");
      return;
    }
    await h.done;
  }
  async function be($, v) {
    var x;
    const h = hi(y.current, v);
    if (h.length !== 0) {
      N(!0), S(`Restoring ${h.length} history ${h.length === 1 ? "action" : "actions"}…`);
      try {
        let O = $;
        const ne = [];
        for (const P of h)
          O = await te(
            P,
            O,
            ne
          );
        const re = s ? await ee(`/videos/${R.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: y.current.revision,
            targetSequence: v
          })
        }) : y.current;
        ne.forEach(He), t(re), await m(), S("History restored.");
      } catch (O) {
        O.status === 409 && ((x = O.payload) != null && x.current) && t(O.payload.current), await m(), S(O.message || "Unable to restore editor history.");
      } finally {
        N(!1);
      }
    }
  }
  function Z($) {
    E((v) => ({ ...v, timelineRatio: vo($, p) }));
  }
  function Ce($) {
    var x, O;
    const v = (x = k.current) == null ? void 0 : x.getBoundingClientRect();
    if (!v) return;
    const h = ((O = a.current) == null ? void 0 : O.offsetHeight) || 0;
    Z(Qs(
      $.clientY,
      v.top + h,
      Math.max(0, v.height - h)
    ));
  }
  function xe($) {
    $.currentTarget.setPointerCapture($.pointerId), Ce($);
  }
  function U($) {
    $.currentTarget.hasPointerCapture($.pointerId) && Ce($);
  }
  function se($) {
    const v = $.shiftKey ? 0.1 : 0.05;
    let h = null;
    $.key === "ArrowUp" && (h = c.timelineRatio + v), $.key === "ArrowDown" && (h = c.timelineRatio - v);
    const x = ho(p);
    $.key === "Home" && (h = x.minimum), $.key === "End" && (h = x.maximum), h != null && ($.preventDefault(), $.stopPropagation(), Z(h));
  }
  function ce($) {
    const v = $ === "detailWidth" ? g.focusRow : g.workspace, h = g.workspace > 0 ? to(g.workspace, 600) : 560, x = ln(c.markerRailWidth, h), O = $ === "detailWidth" ? 344 + (c.markerRailOpen ? x + 24 : 0) : 600;
    return v > 0 ? to(v, O) : 560;
  }
  function Se($, v) {
    E((h) => ({ ...h, [$]: ln(v, ce($)) }));
  }
  function Ie($, v) {
    var x, O;
    const h = v === "detailWidth" ? (x = u.current) == null ? void 0 : x.getBoundingClientRect() : (O = A.current) == null ? void 0 : O.getBoundingClientRect();
    h && Se(v, v === "detailWidth" ? $.clientX - h.left : h.right - $.clientX);
  }
  function le($, v) {
    const h = ce($), x = ln(c[$], h);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": v,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(h),
      "aria-valuenow": Math.round(x),
      "aria-valuetext": `${Math.round(x)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (O) => {
        O.currentTarget.setPointerCapture(O.pointerId), Ie(O, $);
      },
      onPointerMove: (O) => {
        O.currentTarget.hasPointerCapture(O.pointerId) && Ie(O, $);
      },
      onKeyDown: (O) => {
        const ne = O.shiftKey ? 40 : 16;
        let re = null;
        O.key === "ArrowLeft" && (re = $ === "detailWidth" ? -ne : ne), O.key === "ArrowRight" && (re = $ === "detailWidth" ? ne : -ne);
        let P = re == null ? null : x + re;
        O.key === "Home" && (P = 240), O.key === "End" && (P = h), P != null && (O.preventDefault(), O.stopPropagation(), Se($, P));
      },
      onDoubleClick: () => Se($, $t[$]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function Q() {
    E(($) => ({ ...$, markerRailOpen: !$.markerRailOpen })), requestAnimationFrame(() => {
      var $;
      return ($ = F.current) == null ? void 0 : $.focus({ preventScroll: !0 });
    });
  }
  function ye($) {
    G((v) => v.includes($) ? v.filter((h) => h !== $) : on([...v, $]));
  }
  function T($, v = !0, h = l) {
    const x = i().running != null, O = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (ne) => J(ne.detail, $, v, h)
    });
    return O ? (x && S($ === "split" ? "Shot boundary queued…" : "Shot merge queued…"), O.done.then((ne) => ne.value ?? null)) : (S("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function J($, v, h, x) {
    var oe;
    const O = ($ == null ? void 0 : $.shotBoundaries) || [], ne = Number((oe = R.videoFile) == null ? void 0 : oe.duration) || K, re = Yr(O), P = `shot-${v}:${R.id}:${x.toFixed(3)}:${ne.toFixed(3)}:${re}`;
    S(v === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const w = await ee(`/videos/${R.id}/shot-boundaries/${v}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: _e(P), timeSec: x })
      });
      return He(P), C((q) => ({ ...q, shotBoundaries: w }), R.id), h && await W(
        "shots.update",
        v === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: O,
          fingerprint: re
        },
        {
          type: "shots",
          boundaries: w,
          fingerprint: Yr(w)
        }
      ), S(v === "split" ? "Shot boundary added." : "Shots merged."), w;
    } catch (w) {
      return S(w.message || "Unable to edit shot boundaries."), null;
    }
  }
  return { applySegmentHistoryState: z, applyPerformerSlotHistoryState: Y, applyHistoryState: te, restoreHistoryTarget: de, updateTimelineRatio: Z, updateTimelineRatioFromPointer: Ce, handleSeparatorPointerDown: xe, handleSeparatorPointerMove: U, handleSeparatorKeyDown: se, panelWidthMaximum: ce, updatePanelWidth: Se, handlePanelSeparatorPointer: Ie, panelSeparatorProps: le, toggleSegmentRail: Q, toggleSegmentGroup: ye, mutateShotBoundary: T };
}
function iu(e) {
  const { allSwimlanes: t, applyShortcutTiming: n, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: u, emptyRecyclingBin: f, lineage: y, mediaDuration: b, mergeSelectedSwimlane: g, moveToBin: p, mutateShotBoundary: k, openPublishApprovedDialog: C, playbackControlsRef: m, playbackShortcutConfig: F, saveSelectedReviewState: W, seekRef: j, segmentGroupKeys: G, selectSegment: E, selectedSegment: N, selectedSegmentGroupForSegment: I, selectedSegmentGroupKey: S, selectedSegments: M, setCollapsedSegmentGroups: K, setIncorrectExamplesOpen: R, setQuickSearchOpen: A, setSaveMessage: z, setSelectedSegmentGroupKey: Y, setTagEditing: _, setTimelineZoom: te, shotBoundaries: de, slotButtonRef: be, splitSegment: Z, swimlanes: Ce, timelineDuration: xe, toggleIncorrectExample: U, toggleSegmentGroup: se, updateTimelineRatio: ce, videoFrameRate: Se, visibleSegments: Ie } = e;
  function le(T) {
    var J, $;
    (J = m.current) == null || J.pause(), ($ = m.current) == null || $.seekBy(Dl(T, Se));
  }
  function Q(T, J) {
    if (M.length > 1 && bl(T.id))
      return;
    let $ = null;
    T.id === "video.playPause" && ($ = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.toggle();
    }), T.id === "video.seekSmallBackward" && ($ = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(-F.smallSeekTime);
    }), T.id === "video.seekSmallForward" && ($ = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(F.smallSeekTime);
    }), T.id === "video.seekMediumBackward" && ($ = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(-F.mediumSeekTime);
    }), T.id === "video.seekMediumForward" && ($ = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(F.mediumSeekTime);
    }), T.id === "video.seekLongBackward" && ($ = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(-F.longSeekTime);
    }), T.id === "video.seekLongForward" && ($ = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(F.longSeekTime);
    }), T.id === "video.playSelected" && N && ($ = () => {
      var v;
      (v = j.current) == null || v.call(j, N.startSec, !0), requestAnimationFrame(() => {
        var h;
        return (h = u.current) == null ? void 0 : h.focus({ preventScroll: !0 });
      });
    }), (T.id === "video.playPreviousSegment" || T.id === "video.playNextSegment") && ($ = () => {
      var h;
      const v = lo(
        Ce,
        N == null ? void 0 : N.id,
        T.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !v || v.id === (N == null ? void 0 : N.id) || (E(v, { focusEditor: !0, seekToSegment: !1 }), (h = j.current) == null || h.call(j, v.startSec, !0));
    }), T.id.startsWith("video.seekPercent") && ($ = () => {
      var h;
      const v = Number(T.id.slice(17)) / 10;
      (h = j.current) == null || h.call(j, gl(b ?? xe, v), !1);
    }), T.id === "video.jumpToSegmentStart" && N && ($ = () => {
      var v;
      return (v = j.current) == null ? void 0 : v.call(j, N.startSec, !1);
    }), T.id === "video.jumpToSegmentEnd" && N && ($ = () => {
      var v;
      return (v = j.current) == null ? void 0 : v.call(j, N.endSec ?? N.startSec, !1);
    }), T.id === "video.jumpToVideoStart" && ($ = () => {
      var v;
      return (v = j.current) == null ? void 0 : v.call(j, 0, !1);
    }), T.id === "video.jumpToVideoEnd" && ($ = () => {
      var v;
      return (v = j.current) == null ? void 0 : v.call(j, xe, !1);
    }), T.id.startsWith("video.frame") && ($ = () => {
      const v = T.id.includes("Small") ? "small" : T.id.includes("Medium") ? "medium" : "long", h = F[`${v}FrameStep`] * (T.id.endsWith("Backward") ? -1 : 1);
      le(h);
    }), T.id.startsWith("navigation.swimlane") && ($ = () => {
      const v = T.id.slice(19).toLowerCase(), h = lo(Ce, N == null ? void 0 : N.id, v, s);
      h && E(h, { focusEditor: !0, seekToSegment: !1 });
    }), (T.id === "navigation.extendSwimlaneLeft" || T.id === "navigation.extendSwimlaneRight") && ($ = () => {
      const v = zd(
        t,
        N == null ? void 0 : N.id,
        T.id.endsWith("Left") ? "left" : "right"
      );
      v && E(v.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: v.segmentIds
      });
    }), (T.id === "navigation.segmentGroupUp" || T.id === "navigation.segmentGroupDown") && ($ = () => {
      const v = _d(
        G,
        S ?? I,
        T.id.endsWith("Up") ? -1 : 1
      );
      v && Y(v);
    }), (T.id === "navigation.previousAtPlayhead" || T.id === "navigation.nextAtPlayhead") && ($ = () => {
      const v = Xs(Ie, s, T.id === "navigation.previousAtPlayhead" ? -1 : 1, N == null ? void 0 : N.id);
      v && E(v, { focusEditor: !0, seekToSegment: !1 });
    }), T.id === "navigation.nearestInCurrentSwimlane" && ($ = () => {
      const v = Us(
        Ce,
        N == null ? void 0 : N.id,
        s
      );
      v && E(v, { focusEditor: !0, seekToSegment: !1 });
    }), T.id.includes("Unreviewed") && ($ = () => {
      const v = Cr(
        Ce,
        N == null ? void 0 : N.id,
        T.id.startsWith("navigation.previous") ? -1 : 1,
        T.id.endsWith("Global")
      );
      v && E(v, { focusEditor: !J.preserveFocus, seekToSegment: !1 });
    }), (T.id === "navigation.nextTouchingPlayhead" || T.id === "navigation.previousTouchingPlayhead") && ($ = () => {
      const v = Bs(Ce, s, T.id === "navigation.previousTouchingPlayhead" ? -1 : 1, N == null ? void 0 : N.id);
      v && E(v, { focusEditor: !0, seekToSegment: !1 });
    }), T.id === "navigation.quickSearch" && ($ = () => A(!0)), (T.id === "navigation.previousShot" || T.id === "navigation.nextShot") && ($ = () => {
      var h;
      const v = Ml(de, s, T.id === "navigation.previousShot" ? -1 : 1);
      v && ((h = j.current) == null || h.call(j, v.startSec, !1));
    }), T.id === "shot.split" && ($ = () => k("split")), T.id === "shot.merge" && ($ = () => k("merge")), T.id === "marker.create" && ($ = () => a()), T.id === "marker.duplicate" && ($ = () => d(!1)), T.id === "marker.duplicateAtPlayhead" && ($ = () => d(!0)), T.id === "marker.split" && ($ = () => Z()), T.id === "marker.editTag" && ($ = () => {
      var v;
      if (M.length > 1 && M.some((h) => h.isDerived)) {
        z("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((v = y.data) != null && v.tagReadOnly) {
        z("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      _(!0);
    }), T.id === "marker.setStart" && N && ($ = () => n(s, N.endSec)), T.id === "marker.setEnd" && N && ($ = () => n(N.startSec, s)), T.id === "marker.copyTiming" && N && ($ = () => {
      z(hc(N) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), T.id === "marker.pasteTiming" && N && ($ = () => {
      const v = bc();
      if (!v) {
        z("No copied segment timing is available.");
        return;
      }
      n(v.startSec, v.endSec);
    }), T.id === "marker.mergeSelection" && ($ = () => g()), T.id === "marker.moveToBin" && ($ = () => p()), T.id === "marker.toggleIncorrectExample" && N && ($ = () => U()), T.id === "marker.openIncorrectExamples" && ($ = () => R(!0)), T.id === "markerGroup.toggleCollapse" && S && ($ = () => se(S)), T.id === "markerGroup.toggleAll" && ($ = () => K((v) => Kd(v, G))), T.id === "marker.assignSlots" && ($ = () => {
      var v;
      return (v = be.current) == null ? void 0 : v.click();
    }), T.id === "navigation.zoomIn" && ($ = () => te((v) => $r(v + 0.5))), T.id === "navigation.zoomOut" && ($ = () => te((v) => $r(v - 0.5))), T.id === "navigation.resetZoom" && ($ = () => te(1)), T.id === "navigation.centerPlayhead" && ($ = () => {
      var v;
      return (v = o.current) == null ? void 0 : v.call(o);
    }), T.id === "layout.growSwimlanes" && ($ = () => ce(c.timelineRatio + 0.05)), T.id === "layout.shrinkSwimlanes" && ($ = () => ce(c.timelineRatio - 0.05)), T.id === "marker.confirm" && N && ($ = () => W("approved")), T.id === "system.publishApproved" && ($ = () => C(J.target)), T.id === "marker.reject" && N && ($ = () => W("rejected")), T.id === "system.emptyBin" && ($ = () => f()), T.id === "system.deleteRejected" && ($ = () => l()), $ && $();
  }
  function ye(T, J) {
    const $ = tr.find((v) => v.id === T);
    $ && Rn($, i) && Q($, J);
  }
  return {
    executeShortcutById: ye,
    stepVideoFrame: (T) => le(T < 0 ? -1 : 1)
  };
}
const au = 3e4;
function su(e) {
  return e === !0;
}
function lu() {
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
function du({
  fetchRuns: e,
  onCompletedRun: t,
  windowTarget: n,
  documentTarget: o,
  intervalMs: i = au
}) {
  const a = lu();
  let s = null, l = !1, d = null;
  const c = () => o.visibilityState !== "hidden";
  async function u() {
    if (!(l || !a.isActive())) {
      l = !0;
      try {
        const g = await e(a.signal);
        if (!a.isActive()) return;
        const p = (Array.isArray(g) ? g : []).filter((C) => (C == null ? void 0 : C.status) === "completed" && C.id != null).map((C) => String(C.id));
        if (s === null) {
          s = new Set(p);
          return;
        }
        const k = p.filter((C) => !s.has(C));
        if (k.length === 0) return;
        k.forEach((C) => s.add(C)), await t();
      } catch {
      } finally {
        l = !1;
      }
    }
  }
  function f() {
    clearTimeout(d), d = null, !(!a.isActive() || !c()) && (d = setTimeout(async () => {
      d = null, await u(), f();
    }, i));
  }
  function y() {
    u();
  }
  function b() {
    c() ? (u(), f()) : (clearTimeout(d), d = null);
  }
  return u(), f(), n.addEventListener("focus", y), o.addEventListener("visibilitychange", b), function() {
    a.dispose(), clearTimeout(d), d = null, n.removeEventListener("focus", y), o.removeEventListener("visibilitychange", b);
  };
}
function cu(e, t, n, o = !1, i = () => () => {
}) {
  const [a, s] = B({
    busy: !1,
    reviewState: null,
    error: ""
  }), l = ge(n);
  pe(() => {
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
      await ee(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: so(), reviewState: c })
      }), await t(), s({ busy: !1, reviewState: null, error: "" });
    } catch (f) {
      s({
        busy: !1,
        reviewState: null,
        error: f.message || "Unable to import Cove segments."
      });
    } finally {
      u();
    }
  }
  return pe(() => {
    if (su(o))
      return du({
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
const Wn = Object.freeze([]);
function uu(e, t) {
  var o;
  const n = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = n == null ? void 0 : n.focus) == null || o.call(n, { preventScroll: !0 });
}
function mu({ detail: e, onDetailChange: t, onConflict: n, onReload: o, onAnalysisCompleted: i, onSlotsChanged: a, splitLayout: s, initialSegmentId: l, compatibilityMode: d = !1, profile: c, onNavigate: u }) {
  var qo, Wo, Vo, Jo, Yo;
  const f = ge(null), [y, b] = B(null), [g, p] = B([]), k = ge(null), C = ge(null), m = ge([]), F = ge(null), [W, j] = B(() => Dt({})), [G, E] = B(!1), [N, I] = B(pl), [S, M] = B(0), K = ge(null), [R] = B(() => tc({
    getContext: () => K.current,
    drainAfterSettle: !1
  })), A = ld(R.subscribe, R.getSnapshot), z = $a(A), Y = (D, ae) => R.acquire({ kind: D, lockId: ae }), _ = (D) => R.enqueue(D), te = (D) => R.stableIdentity(D), de = ge(!1);
  pe(() => (de.current = !0, () => {
    de.current = !1, queueMicrotask(() => {
      de.current || R.dispose();
    });
  }), []);
  const be = (D) => R.cancel(D), Z = (D, ae) => R.retarget(D, ae), Ce = R.getSnapshot, [xe, U] = sd(dc, []), [se, ce] = B(""), [Se, Ie] = B(""), [le, Q] = B(""), [ye, T] = B(1), [J, $] = B(gc), [v, h] = B(0), [x, O] = B({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [ne, re] = B(Qt), P = ge(Qt), [oe, w] = B(!1), [q, L] = B(!1), [X, fe] = B(!1), me = ge(!1);
  me.current = X;
  const [Te, pt] = B(null), [Be, Re] = B(!1), [Ye, it] = B(null), [ht, Ze] = B(null), yt = ge(null), [ut, Fe] = B(!1), [Qe, qe] = B(""), Je = ge(null), st = ge(null), Ot = ge(!1), [V, ie] = B(pc), [Ee, Ne] = B(null), [ve, et] = B(!1), [Ue, Xe] = B(!1), [Ae, Me] = B(!1), [We, De] = B(!1), [je, tt] = B(!1), [ke, Le] = B(""), {
    importNativeSegments: Pe,
    nativeImportState: ft
  } = cu(
    e.video.id,
    o,
    i,
    d,
    (D, ae) => R.acquire({ kind: D, lockId: ae })
  ), [Ve, lt] = B(!1), [Pt, at] = B(null), [$e, we] = B(d), [nt, Et] = B(0), [mt, vt] = B(!1), [bt, Lt] = B(""), [_t, Lr] = B(null), Mn = ge(null), Dn = ge(null), gn = ge(!1), [an, pn] = B([]), [or, jr] = B(!1), [ir, On] = B(null), fn = uc(), yn = ge(null), ar = ge(null), bn = ge(null), Fr = ge(l), Pn = ge(null), Ln = ge(null), Zt = ge(null), jn = ge(null), Fn = ge(null), xt = ge(null), sr = ge(null), jt = ge(null), lr = ge(null), Gn = ge(null), Bn = ge(null), Un = ge(null), Gr = ge(-1e12), dr = ge(null), Kn = ge(null), [hn, zn] = B({ scrollTop: 0, height: 512 });
  pe(() => {
    if (!Ve || mt || !bt) return;
    const D = requestAnimationFrame(() => {
      var ae;
      return (ae = Dn.current) == null ? void 0 : ae.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(D);
  }, [Ve, mt, bt]), pe(() => {
    if (!gn.current || Ve || $e) return;
    const D = requestAnimationFrame(() => {
      var ae;
      (ae = Mn.current) == null || ae.focus({ preventScroll: !0 }), gn.current = !1;
    });
    return () => cancelAnimationFrame(D);
  }, [Ve, $e]);
  const ot = e.video, Ge = e.segments || Wn, cr = ze(() => JSON.stringify({
    segments: Ge.map((D) => [
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
    performerSlots: (e.performerSlots || Wn).map((D) => [
      D.segmentId,
      D.slotDefinitionId,
      D.performerId,
      D.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [Ge, e.performerSlots, e.itemMetadata]);
  pe(() => {
    if (!d) {
      at(null), we(!1);
      return;
    }
    if (z != null) {
      we(!0);
      return;
    }
    let D = !0;
    we(!0);
    const ae = setTimeout(() => {
      ee(`/videos/${ot.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Ke) => {
        D && (at(Ke), Lt(""));
      }).catch((Ke) => {
        D && (at(null), Lt(Ke.message || "Unable to preview derived segments."));
      }).finally(() => {
        D && we(!1);
      });
    }, 150);
    return () => {
      D = !1, clearTimeout(ae);
    };
  }, [d, ot.id, cr, nt, z]);
  const Br = () => Et((D) => D + 1), Ht = e.segmentGroups || Wn, St = e.performerSlots || Wn, sn = d && e.performerSlotsAvailable !== !1, _n = ze(
    () => (e.performerCandidates || []).filter((D) => D.isVideoPerformer),
    [e.performerCandidates]
  ), vn = e.shotBoundaries || Wn, xn = ze(
    () => xa(St),
    [St]
  ), Sn = ze(
    () => Ge.map((D) => {
      const ae = xn.get(D.id) || [];
      return {
        ...D,
        slots: ae,
        assignment: ae.every((Ke) => Ke.performerId == null) ? Xl(ae, _n) : null
      };
    }).filter((D) => D.slots.length > 0 && D.assignment != null),
    [Ge, xn, _n]
  ), ur = Number((qo = ot.videoFile) == null ? void 0 : qo.frameRate) > 0 ? Number(ot.videoFile.frameRate) : 30;
  function mr() {
    const D = me.current;
    fe(!1), D && requestAnimationFrame(() => {
      var ae;
      return (ae = xt.current) == null ? void 0 : ae.focus({ preventScroll: !0 });
    });
  }
  function Hn() {
    z == null && (Un.current = null, Re(!1), ce(""), requestAnimationFrame(() => {
      var D;
      return (D = xt.current) == null ? void 0 : D.focus({ preventScroll: !0 });
    }));
  }
  function qt() {
    E(!1), requestAnimationFrame(() => {
      var D, ae;
      (D = jt.current) != null && D.isConnected ? jt.current.focus({ preventScroll: !0 }) : (ae = xt.current) == null || ae.focus({ preventScroll: !0 });
    });
  }
  pe(() => {
    Bn.current === y ? (Bn.current = null, fe(!0)) : fe(!1);
  }, [y]), pe(() => {
    var ae;
    if (!X) return;
    const D = (ae = Gn.current) == null ? void 0 : ae.querySelector("input");
    document.activeElement !== D && (D == null || D.focus({ preventScroll: !0 }), D == null || D.select());
  }, [X, y]), pe(() => {
    var ae;
    if (X) return;
    const D = (ae = xt.current) == null ? void 0 : ae.ownerDocument;
    D && D.activeElement === D.body && xt.current.focus({ preventScroll: !0 });
  }, [X]), pe(() => {
    var Ke, dt, Gt;
    const D = cn(
      Vr(
        e.segments,
        e.performerSlots || [],
        Dt({}),
        d && N,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), ae = ((Ke = e.segments.find((In) => In.id === l)) == null ? void 0 : Ke.id) ?? ((dt = Hi(D)) == null ? void 0 : dt.id) ?? null;
    b(ae), p(ae == null ? [] : [ae]), C.current = ae, m.current = [], Ne(Ut(D, ae)), j(Dt({})), E(!1), Un.current = null, Re(!1), T(1), ce(""), re(Qt), P.current = Qt, w(!1), (Gt = xt.current) == null || Gt.focus({ preventScroll: !0 });
  }, [ot.id, l]), pe(() => {
    const D = new AbortController();
    return ee(`/videos/${ot.id}/incorrect-examples`, { signal: D.signal }).then(pn).catch((ae) => {
      ae.name !== "AbortError" && pn([]);
    }), () => D.abort();
  }, [ot.id, c == null ? void 0 : c.effectiveMode]), pe(() => {
    const D = new AbortController();
    return ee(`/videos/${ot.id}/history`, { signal: D.signal }).then((ae) => {
      const Ke = ae || Qt;
      P.current = Ke, re(Ke);
    }).catch((ae) => {
      ae.name !== "AbortError" && ce(ae.message || "Unable to load editor history.");
    }), () => D.abort();
  }, [ot.id]), pe(() => {
    yc(J);
  }, [J.timelineRatio, J.markerRailOpen, J.detailWidth, J.markerRailWidth, J.swimlaneTitleWidth]), pe(() => {
    fc(V);
  }, [V]), pe(() => {
    fl(N);
  }, [N]), pe(() => {
    const D = Ln.current;
    if (!s || !D || typeof ResizeObserver > "u") return;
    const ae = () => {
      var Gt;
      const dt = Math.max(0, D.clientHeight - (((Gt = Zt.current) == null ? void 0 : Gt.offsetHeight) || 0));
      h(dt), $((In) => {
        const Qo = vo(In.timelineRatio, dt);
        return Qo === In.timelineRatio ? In : { ...In, timelineRatio: Qo };
      });
    }, Ke = new ResizeObserver(ae);
    return Ke.observe(D), Zt.current && Ke.observe(Zt.current), ae(), () => Ke.disconnect();
  }, [s]), pe(() => {
    if (!fn || typeof ResizeObserver > "u") return;
    const D = Fn.current, ae = jn.current;
    if (!D || !ae) return;
    const Ke = () => O({
      workspace: D.clientWidth,
      focusRow: ae.clientWidth,
      focusRowHeight: ae.clientHeight
    }), dt = new ResizeObserver(Ke);
    return dt.observe(D), dt.observe(ae), Ke(), () => dt.disconnect();
  }, [fn, J.markerRailOpen]);
  const At = ze(
    () => sc(Ge, xe),
    [Ge, xe]
  );
  yi(() => {
    Ma(xe, e) !== xe && U({ type: "prune", detail: e });
  }, [e, xe]);
  const Ft = ze(
    () => ki(
      Vr(
        At,
        St,
        W,
        d && N,
        Ht
      ),
      an,
      !0
    ),
    [
      At,
      St,
      W,
      N,
      Ht,
      d,
      an
    ]
  ), Ur = Object.fromEntries(Nt.map((D) => [D, Ft.filter((ae) => ae.reviewState === D).length])), Kr = ki(
    Vr(
      At,
      St,
      { ...W, reviewStates: Nt },
      d && N,
      Ht
    ),
    an,
    !0
  ), zr = Object.fromEntries(Nt.map((D) => [D, Kr.filter((ae) => ae.reviewState === D).length])), _r = [...new Set(At.map((D) => D.sourceKey).filter(Boolean))].sort((D, ae) => zt(D).localeCompare(zt(ae))), kn = rl(
    W,
    d && N
  ), gt = ze(
    () => cn(Ft, Ht, St),
    [Ft, Ht, St]
  ), H = ze(
    () => Ud(gt, V),
    [gt, V]
  ), he = al(
    gt,
    y,
    l,
    {
      visibleLanes: H,
      reference: ((Wo = f.current) == null ? void 0 : Wo.videoId) === ot.id ? f.current.reference : null
    }
  );
  pe(() => {
    const D = wr(gt, he == null ? void 0 : he.id);
    D && (f.current = { videoId: ot.id, reference: D });
  }, [ot.id, he == null ? void 0 : he.id, gt]);
  const It = ze(() => {
    const D = ic(xe);
    return D.length === 0 ? Ge : [...Ge, ...D];
  }, [Ge, xe]), ue = he == null ? null : It.find((D) => D.id === he.id) || he, kt = ai(It, ai(Ft, g).map((D) => D.id)), Wt = !d && kt.length > 0 && kt.every((D) => D.nativeSegmentId != null), gr = Ft.map((D) => D.id), Ba = gr.join("|");
  k.current = (ue == null ? void 0 : ue.id) ?? null;
  const Eo = xn.get(ue == null ? void 0 : ue.id) || [], Ua = Io(Eo), Ao = ze(
    () => Gd(gt, g),
    [gt, g]
  ), pr = ze(() => Co(gt), [gt]), qn = ze(
    () => jd(pr, V),
    [pr, V]
  ), Ka = ze(
    () => ka(
      qn.rows,
      hn.scrollTop,
      hn.height
    ),
    [qn, hn]
  ), za = Cr(H, ue == null ? void 0 : ue.id, -1, !0) != null, _a = Cr(H, ue == null ? void 0 : ue.id, 1, !0) != null, wn = ue ? Ut(gt, ue.id) : null, Hr = Sa(pr) ? pr.map((D) => D.key) : [], Ha = Hr.join("|"), fr = Math.max(
    0,
    Number((Vo = ot.videoFile) == null ? void 0 : Vo.duration) || 0,
    ...At.map((D) => Number(D.endSec ?? D.startSec) || 0)
  ), Mo = Number((Jo = ot.videoFile) == null ? void 0 : Jo.duration) > 0 ? Number(ot.videoFile.duration) : null;
  ne.actions;
  const qa = ea();
  pe(() => {
    const D = y === $n ? y : (ue == null ? void 0 : ue.id) ?? null;
    D !== y && b(D);
  }, [ue, y]), pe(() => {
    p((D) => {
      const ae = cl(
        D,
        gr,
        (ue == null ? void 0 : ue.id) ?? null
      );
      return ae.length === D.length && ae.every((Ke, dt) => Ke === D[dt]) ? D : ae;
    });
  }, [Ba, ue == null ? void 0 : ue.id]);
  const Nn = (ue == null ? void 0 : ue.itemId) == null ? null : ((Yo = e.itemMetadata) == null ? void 0 : Yo[ue.itemId]) || null, Wa = {
    key: (ue == null ? void 0 : ue.itemId) != null ? `item:${ue.itemId}` : (ue == null ? void 0 : ue.nativeSegmentId) != null ? `native:${ue.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (Nn == null ? void 0 : Nn.provenance) || (ue == null ? void 0 : ue.fieldProvenance) || [] : []
  }, qr = (ue == null ? void 0 : ue.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (Nn == null ? void 0 : Nn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  pe(() => {
    Ie(he == null ? "" : String(he.startSec)), Q((he == null ? void 0 : he.endSec) == null ? "" : String(he.endSec));
  }, [he == null ? void 0 : he.id, he == null ? void 0 : he.startSec, he == null ? void 0 : he.endSec]), pe(() => {
    wn && ie((D) => Ia(D, wn));
  }, [ot.id, l, wn]), pe(() => {
    Ne((D) => Hd(Hr, D, wn));
  }, [ot.id, Ha, wn]), pe(() => {
    if (!J.markerRailOpen || (ue == null ? void 0 : ue.id) == null) return;
    const D = Kn.current, ae = qn.rows.find((Gt) => Gt.kind === "segment" && Gt.segment.id === ue.id);
    if (!D || !ae) return;
    const Ke = ae.top + ae.height;
    let dt = D.scrollTop;
    ae.top < D.scrollTop ? dt = ae.top : Ke > D.scrollTop + D.clientHeight && (dt = Math.max(0, Ke - D.clientHeight)), dt !== D.scrollTop && (D.scrollTop = dt), zn({ scrollTop: dt, height: D.clientHeight });
  }, [ue == null ? void 0 : ue.id, qn, J.markerRailOpen]), pe(() => {
    const D = Kn.current;
    if (!J.markerRailOpen || !D) return;
    const ae = () => zn({
      scrollTop: D.scrollTop,
      height: D.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      ae();
      return;
    }
    const Ke = new ResizeObserver(ae);
    return Ke.observe(D), ae(), () => Ke.disconnect();
  }, [J.markerRailOpen]);
  const { revealSegmentGroupForSelection: Do, replaceSegmentSelection: Va, selectSegment: Oo, selectSegmentCollection: Ja, selectAllVideoSegments: Ya } = tu({
    allSwimlanes: gt,
    editorRef: xt,
    performerSlots: St,
    seekRef: yn,
    segmentGroups: Ht,
    segments: Ge,
    selectedSegmentId: y,
    selectedSegmentIds: g,
    selectionAnchorIdRef: C,
    selectionRangeBaseIdsRef: m,
    setCollapsedSegmentGroups: ie,
    setEditorFilters: j,
    setHideDerivedSegments: I,
    setSaveMessage: ce,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: b,
    setSelectedSegmentIds: p
  }), { acceptHistory: Wr, recordHistoryAction: yr, mutateSegment: Qa, runSegmentMutation: Xa, completeReview: Za, createSegment: Po, splitSegment: Lo, duplicateSegment: jo, saveTiming: es, applyShortcutTiming: ts } = cc({
    compatibilityMode: d,
    currentTime: S,
    detail: e,
    editorFilters: W,
    endInput: le,
    hideDerivedSegments: N,
    historyRef: P,
    mediaDuration: Mo,
    onConflict: n,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: Gr,
    pendingDuplicateRef: dr,
    pendingFirstSegmentStartSecRef: Un,
    pendingTagEditSegmentIdRef: Bn,
    performerSlots: St,
    enqueueSave: _,
    pendingChanges: xe,
    retargetSaveTasks: Z,
    replaceSegmentSelection: Va,
    savingSegmentId: z,
    segments: Ge,
    selectedSegment: ue,
    selectedSegmentIdRef: k,
    selectedSegments: kt,
    selectionAnchorIdRef: C,
    selectionRangeBaseIdsRef: m,
    setCreatingSegmentId: pt,
    setEditorFilters: j,
    setFirstSegmentTagOpen: Re,
    setHideDerivedSegments: I,
    setHistory: re,
    setHistoryOpen: w,
    setPublishApprovedError: qe,
    setSaveMessage: ce,
    acquireSaveLock: Y,
    dispatchPendingChanges: U,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: b,
    setSelectedSegmentIds: p,
    setTagEditing: fe,
    startInput: Se,
    tagEditingRef: me,
    timelineDuration: fr,
    video: ot
  });
  function Fo(D = null) {
    var dt;
    if (!d || z != null || !Ge.some((Gt) => !Gt.published && Gt.reviewState === "approved")) return;
    const ae = ((dt = xt.current) == null ? void 0 : dt.ownerDocument) ?? document, Ke = ae.activeElement === ae.body ? null : ae.activeElement;
    st.current = D != null && D.isConnected && D !== ae.body ? D : Ke, qe(""), Fe(!0);
  }
  function Go() {
    z == null && (Fe(!1), qe(""), requestAnimationFrame(() => {
      uu(
        st.current,
        xt.current
      ), st.current = null;
    }));
  }
  async function ns() {
    await Za() && Go();
  }
  const { closeMergeConfirmation: rs, mergeSelectedSwimlane: Bo, saveSelectedReviewState: os } = nu({
    acceptHistory: Wr,
    compatibilityMode: d,
    detail: e,
    detailPanelRef: F,
    getSaveQueueSnapshot: Ce,
    historyRef: P,
    onConflict: n,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: yr,
    revealSegmentGroupForSelection: Do,
    savingSegmentId: z,
    selectedGroups: Ao,
    selectedSegment: ue,
    selectedSegmentIdRef: k,
    selectedSegments: kt,
    selectionAnchorIdRef: C,
    selectionRangeBaseIdsRef: m,
    setMergeConfirmation: it,
    setSaveMessage: ce,
    acquireSaveLock: Y,
    dispatchPendingChanges: U,
    enqueueSave: _,
    stableSaveIdentity: te,
    setSelectedSegmentId: b,
    setSelectedSegmentIds: p,
    video: ot
  }), is = (D) => {
    const ae = (D || []).map(Ct);
    R.cancel((Ke) => Ke.kind === "review" && $o(Ke.targets, ae));
  }, as = R.settledCount();
  yi(() => {
    R.markCommitted(as), K.current = {
      detail: e,
      segments: Ge,
      onConflict: n,
      onDetailChange: t,
      onReload: o,
      tagEditing: X,
      selectedSegmentIds: g,
      activeSegmentId: (ue == null ? void 0 : ue.id) ?? null
    };
  }), pe(() => {
    R.poke();
  });
  const { toggleIncorrectExample: ss, removeIncorrectExample: ls, captureTrainingExport: ds, deleteRejectedSegments: Uo, autoAssignPerformers: cs, previewDerivedSegments: us, closeMaterializeDialog: ms, materializeDerivedSegments: gs, saveTag: ps, moveToBin: fs, emptyRecyclingBin: ys } = ru({
    acceptHistory: Wr,
    allSwimlanes: gt,
    autoAssignCandidates: Sn,
    autoAssigning: je,
    binEmptyingRef: Ot,
    canMoveSelectionToBin: Wt,
    closeTagEditing: mr,
    compatibilityMode: d,
    creatingSegmentId: Te,
    detail: e,
    editorFilters: W,
    editorRef: xt,
    exportingExamples: or,
    hideDerivedSegments: N,
    incorrectExamples: an,
    lineage: qr,
    materializeButtonRef: Mn,
    materializePreview: Pt,
    materializeRestoreFocusRef: gn,
    materializing: mt,
    mutateSegment: Qa,
    onConflict: n,
    onDetailChange: t,
    onReload: o,
    performerSlots: St,
    cancelSaveTasks: be,
    dispatchPendingChanges: U,
    enqueueSave: _,
    stableSaveIdentity: te,
    pendingChanges: xe,
    runSegmentMutation: Xa,
    recordHistoryAction: yr,
    refreshMaterializationPreview: Br,
    removingExampleId: ir,
    revealSegmentGroupForSelection: Do,
    savingSegmentId: z,
    segmentGroups: Ht,
    segments: Ge,
    selectedSegment: ue,
    selectedSegmentIdRef: k,
    selectedSegments: kt,
    selectionAnchorIdRef: C,
    selectionRangeBaseIdsRef: m,
    setAutoAssignError: Le,
    setAutoAssignOpen: De,
    setAutoAssigning: tt,
    setEditorFilters: j,
    setExportingExamples: jr,
    setHideDerivedSegments: I,
    setIncorrectExamples: pn,
    setMaterializeError: Lt,
    setMaterializeLoading: we,
    setMaterializeOpen: lt,
    setMaterializePreview: at,
    setMaterializing: vt,
    setRemovingExampleId: On,
    setRejectedDeletionPreview: Ze,
    setSaveMessage: ce,
    acquireSaveLock: Y,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: b,
    setSelectedSegmentIds: p,
    swimlanes: H,
    video: ot
  }), { restoreHistoryTarget: bs, updateTimelineRatio: Ko, handleSeparatorPointerDown: hs, handleSeparatorPointerMove: vs, handleSeparatorKeyDown: xs, panelWidthMaximum: zo, panelSeparatorProps: Ss, toggleSegmentRail: ks, toggleSegmentGroup: _o, mutateShotBoundary: ws } = ou({
    acceptHistory: Wr,
    compatibilityMode: d,
    currentTime: S,
    detail: e,
    editorLayout: J,
    focusRowRef: jn,
    history: ne,
    historyRef: P,
    historySaving: q,
    horizontalLayoutSize: x,
    mediaStackHeight: v,
    mediaStackRef: Ln,
    commonActionsRef: Zt,
    onDetailChange: t,
    onReload: o,
    railToggleRef: sr,
    recordHistoryAction: yr,
    savingSegmentId: z,
    setCollapsedSegmentGroups: ie,
    setEditorLayout: $,
    setHistorySaving: L,
    setIncorrectExamples: pn,
    setSaveMessage: ce,
    acquireSaveLock: Y,
    enqueueSave: _,
    getSaveQueueSnapshot: Ce,
    shotBoundaries: vn,
    timelineDuration: fr,
    video: ot,
    workspaceRef: Fn
  }), { executeShortcutById: Ho, stepVideoFrame: Ns } = iu({
    allSwimlanes: gt,
    applyShortcutTiming: ts,
    centerTimelineRef: Pn,
    compatibilityMode: d,
    createSegment: Po,
    currentTime: S,
    deleteRejectedSegments: Uo,
    duplicateSegment: jo,
    editorLayout: J,
    editorRef: xt,
    emptyRecyclingBin: ys,
    lineage: qr,
    mediaDuration: Mo,
    mergeSelectedSwimlane: Bo,
    moveToBin: fs,
    mutateShotBoundary: ws,
    openPublishApprovedDialog: Fo,
    playbackControlsRef: ar,
    playbackShortcutConfig: qa,
    saveSelectedReviewState: os,
    seekRef: yn,
    segmentGroupKeys: Hr,
    selectSegment: Oo,
    selectedSegment: ue,
    selectedSegmentGroupForSegment: wn,
    selectedSegmentGroupKey: Ee,
    selectedSegments: kt,
    setCollapsedSegmentGroups: ie,
    setIncorrectExamplesOpen: Me,
    setQuickSearchOpen: Xe,
    setSaveMessage: ce,
    setSelectedSegmentGroupKey: Ne,
    setTagEditing: fe,
    setTimelineZoom: T,
    shotBoundaries: vn,
    slotButtonRef: lr,
    splitSegment: Lo,
    swimlanes: H,
    timelineDuration: fr,
    toggleIncorrectExample: ss,
    toggleSegmentGroup: _o,
    updateTimelineRatio: Ko,
    videoFrameRate: ur,
    visibleSegments: Ft
  });
  bn.current = Ho;
  const Is = ze(() => tr.map((D) => ({
    id: D.id,
    enabled: Rn(D, d),
    surface: "local",
    action: (ae) => {
      var Ke;
      return (Ke = bn.current) == null ? void 0 : Ke.call(bn, D.id, ae);
    }
  })), [d]);
  Oi(yo, Is);
  const Cs = ho(v), $s = ln(J.markerRailWidth, zo("markerRailWidth")), Ts = ln(J.detailWidth, zo("detailWidth"));
  return r(eu, {
    activeFilterCount: kn,
    allSwimlanes: gt,
    approvalFacetCounts: zr,
    autoAssignCandidates: Sn,
    autoAssignError: ke,
    autoAssignOpen: We,
    autoAssignPerformers: cs,
    autoAssigning: je,
    canMoveSelectionToBin: Wt,
    captureTrainingExport: ds,
    cancelQueuedReviewsForSegments: is,
    removeIncorrectExample: ls,
    rejectedDeletionPreview: ht,
    centerTimelineRef: Pn,
    closeEditorFilters: qt,
    closeFirstSegmentTagDialog: Hn,
    closeMaterializeDialog: ms,
    closeMergeConfirmation: rs,
    closePublishApprovedDialog: Go,
    closeTagEditing: mr,
    collapsedSegmentGroups: V,
    commonActionsRef: Zt,
    compatibilityMode: d,
    configuringTag: _t,
    createSegment: Po,
    currentTime: S,
    deleteRejectedSegments: Uo,
    detail: e,
    detailPanelRef: F,
    detailWidth: Ts,
    duplicateSegment: jo,
    editorFilters: W,
    editorLayout: J,
    editorRef: xt,
    exportingExamples: or,
    filtersButtonRef: jt,
    filtersOpen: G,
    firstSegmentTagOpen: Be,
    focusRowRef: jn,
    handleSeparatorKeyDown: xs,
    handleSeparatorPointerDown: hs,
    handleSeparatorPointerMove: vs,
    hideDerivedSegments: N,
    history: ne,
    historyOpen: oe,
    historySaving: q,
    hasNextUnreviewed: _a,
    hasPreviousUnreviewed: za,
    horizontalLayoutSize: x,
    importNativeSegments: Pe,
    incorrectExamples: an,
    incorrectExamplesOpen: Ae,
    removingExampleId: ir,
    lineage: qr,
    markerRailWidth: $s,
    materializeButtonRef: Mn,
    materializeCancelButtonRef: Dn,
    materializeDerivedSegments: gs,
    materializeError: bt,
    materializeLoading: $e,
    materializeOpen: Ve,
    materializePreview: Pt,
    materializing: mt,
    mediaStackRef: Ln,
    mergeCancelButtonRef: yt,
    mergeConfirmation: Ye,
    mergeSaving: ec(A, "merge"),
    mergeSelectedSwimlane: Bo,
    nativeImportState: ft,
    onNavigate: u,
    onDetailChange: t,
    openPublishApprovedDialog: Fo,
    onReload: o,
    onSlotsChanged: a,
    panelSeparatorProps: Ss,
    pendingInitialSeekRef: Fr,
    performerSlots: St,
    performerSlotsAvailable: sn,
    playbackControlsRef: ar,
    previewDerivedSegments: us,
    provenance: Wa,
    provenanceSources: _r,
    publishApprovedCancelButtonRef: Je,
    publishApprovedDrafts: ns,
    publishApprovedError: Qe,
    publishApprovedOpen: ut,
    quickSearchOpen: Ue,
    railScrollRef: Kn,
    railToggleRef: sr,
    recordHistoryAction: yr,
    restoreHistoryTarget: bs,
    runEditorAction: Ho,
    stepVideoFrame: Ns,
    saveMessage: se,
    setSaveMessage: ce,
    saveTag: ps,
    saveTiming: es,
    savingSegmentId: z,
    acquireSaveLock: Y,
    seekRef: yn,
    segmentGroups: Ht,
    segmentRailLayout: qn,
    segments: At,
    selectAllVideoSegments: Ya,
    selectSegment: Oo,
    selectSegmentCollection: Ja,
    selectedGroups: Ao,
    selectedPerformerSlots: Eo,
    selectedSegment: he,
    selectedSegmentGroupKey: Ee,
    selectedSegmentIds: g,
    selectedSegments: kt,
    selectedSlotStatus: Ua,
    setAutoAssignError: Le,
    setAutoAssignOpen: De,
    setConfiguringTag: Lr,
    setCurrentTime: M,
    setEditorFilters: j,
    setEditorLayout: $,
    setFiltersOpen: E,
    setHideDerivedSegments: I,
    setHistoryOpen: w,
    setIncorrectExamplesOpen: Me,
    setQuickSearchOpen: Xe,
    setRejectedDeletionPreview: Ze,
    setRailViewport: zn,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: b,
    setShortcutsOpen: et,
    setTimelineZoom: T,
    shotBoundaries: vn,
    shortcutsOpen: ve,
    slotButtonRef: lr,
    splitLayout: s,
    splitSegment: Lo,
    tagEditing: X,
    creatingSegmentId: Te,
    tagSearchRef: Gn,
    timelineDuration: fr,
    timelineRatioBounds: Cs,
    timelineZoom: ye,
    toggleSegmentGroup: _o,
    toggleSegmentRail: ks,
    updateTimelineRatio: Ko,
    video: ot,
    videoPerformers: _n,
    visibleCounts: Ur,
    visibleSegmentRailRows: Ka,
    visibleSegments: Ft,
    wideLayout: fn,
    workspaceRef: Fn
  });
}
function gu(e = [], t = []) {
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
function pu(e = [], t = "", n = "all") {
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
function wt(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function fu(e = [], t = []) {
  var b;
  const n = /* @__PURE__ */ new Map();
  [...t].sort((g, p) => (g.sortOrder ?? 0) - (p.sortOrder ?? 0) || Number(g.id) - Number(p.id)).forEach((g, p) => {
    [...g.tags || []].sort((k, C) => (k.sortOrder ?? 0) - (C.sortOrder ?? 0) || Number(k.tagId) - Number(C.tagId)).forEach((k, C) => n.set(Number(k.tagId), {
      key: `group:${g.id}`,
      id: g.id,
      name: g.name,
      sortOrder: g.sortOrder ?? p,
      tagSortOrder: k.sortOrder ?? C
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(g, p) {
    const k = Number(g);
    if (!o.has(k)) {
      const C = n.get(k);
      o.set(k, {
        tagId: k,
        name: p || `Tag ${k}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (C == null ? void 0 : C.key) || "ungrouped",
        segmentGroupId: (C == null ? void 0 : C.id) ?? null,
        segmentGroupName: (C == null ? void 0 : C.name) || "Ungrouped",
        segmentGroupSortOrder: (C == null ? void 0 : C.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (C == null ? void 0 : C.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(k);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((g) => {
    const p = i(g.sourceTagId, g.sourceTagName), k = i(g.derivedTagId, g.derivedTagName);
    p.outgoingRuleCount++, k.incomingRuleCount++;
    const C = `${p.tagId}:${k.tagId}`;
    a.has(C) || a.set(C, {
      id: C,
      sourceTagId: p.tagId,
      derivedTagId: k.tagId,
      rules: [],
      edgeCount: 0
    });
    const m = a.get(C);
    m.rules.push(g), m.edgeCount += Number(g.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((g) => [g.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((g) => {
    var p, k;
    (p = d.get(g.sourceTagId)) == null || p.add(g.derivedTagId), (k = d.get(g.derivedTagId)) == null || k.add(g.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), u = [];
  for (const g of s) {
    if (c.has(g.tagId)) continue;
    const p = [g.tagId], k = [];
    for (c.add(g.tagId); p.length > 0; ) {
      const E = p.shift();
      k.push(E);
      for (const N of d.get(E) || [])
        c.has(N) || (c.add(N), p.push(N));
    }
    const C = new Set(k), m = k.map((E) => o.get(E)), F = l.filter((E) => C.has(E.sourceTagId) && C.has(E.derivedTagId)), W = F.flatMap((E) => E.rules), j = m.filter((E) => E.outgoingRuleCount === 0).sort((E, N) => wt(E.name, N.name)), G = j.length > 0 ? j : [...m].sort((E, N) => wt(E.name, N.name));
    u.push({
      id: [...k].sort((E, N) => E - N).join(":"),
      label: G.length > 1 ? `${G[0].name} + ${G.length - 1}` : ((b = G[0]) == null ? void 0 : b.name) || "Derivation component",
      nodes: m,
      connections: F,
      rules: W,
      segmentGroupKeys: [...new Set(m.map((E) => E.segmentGroupKey))],
      materializedEdgeCount: W.reduce(
        (E, N) => E + (Number(N.edgeCount) || 0),
        0
      )
    });
  }
  u.sort((g, p) => p.rules.length - g.rules.length || wt(g.label, p.label));
  const f = /* @__PURE__ */ new Map();
  s.forEach((g) => {
    f.has(g.segmentGroupKey) || f.set(g.segmentGroupKey, {
      key: g.segmentGroupKey,
      id: g.segmentGroupId,
      name: g.segmentGroupName,
      sortOrder: g.segmentGroupSortOrder,
      nodes: [],
      ruleIds: /* @__PURE__ */ new Set(),
      componentIds: /* @__PURE__ */ new Set()
    }), f.get(g.segmentGroupKey).nodes.push(g);
  }), u.forEach((g) => {
    g.nodes.forEach((p) => {
      var k;
      return (k = f.get(p.segmentGroupKey)) == null ? void 0 : k.componentIds.add(g.id);
    }), g.rules.forEach((p) => {
      var k, C;
      (k = f.get(o.get(Number(p.sourceTagId)).segmentGroupKey)) == null || k.ruleIds.add(p.id), (C = f.get(o.get(Number(p.derivedTagId)).segmentGroupKey)) == null || C.ruleIds.add(p.id);
    });
  });
  const y = [...f.values()].sort((g, p) => g.sortOrder - p.sortOrder || wt(g.name, p.name)).map((g) => ({
    ...g,
    ruleCount: g.ruleIds.size,
    componentCount: g.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: u,
    segmentGroups: y
  };
}
function yu(e, {
  minimumWidth: t = 720,
  minimumHeight: n = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const u = new Map(e.nodes.map((I) => [I.tagId, /* @__PURE__ */ new Set()])), f = new Map(e.nodes.map((I) => [I.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((I) => {
    var S, M;
    (S = u.get(I.sourceTagId)) == null || S.add(I.derivedTagId), (M = f.get(I.derivedTagId)) == null || M.add(I.sourceTagId);
  });
  const y = new Map(e.nodes.map((I) => {
    var S;
    return [
      I.tagId,
      ((S = f.get(I.tagId)) == null ? void 0 : S.size) || 0
    ];
  })), b = new Map(e.nodes.map((I) => [I.tagId, 0])), g = e.nodes.filter((I) => y.get(I.tagId) === 0).sort((I, S) => wt(I.name, S.name)).map((I) => I.tagId), p = /* @__PURE__ */ new Set();
  for (; g.length > 0; ) {
    const I = g.shift();
    if (!p.has(I)) {
      p.add(I);
      for (const S of u.get(I) || [])
        b.set(S, Math.max(b.get(S) || 0, (b.get(I) || 0) + 1)), y.set(S, y.get(S) - 1), y.get(S) === 0 && g.push(S);
    }
  }
  p.size !== e.nodes.length && e.nodes.filter((I) => !p.has(I.tagId)).sort((I, S) => wt(I.name, S.name)).forEach((I) => b.set(I.tagId, 0));
  const k = Math.max(0, ...b.values()), C = Math.max(
    t,
    240 + k * 296
  ), m = /* @__PURE__ */ new Map();
  e.nodes.forEach((I) => {
    m.has(I.segmentGroupKey) || m.set(I.segmentGroupKey, {
      key: I.segmentGroupKey,
      id: I.segmentGroupId,
      name: I.segmentGroupName,
      sortOrder: I.segmentGroupSortOrder,
      nodes: []
    }), m.get(I.segmentGroupKey).nodes.push(I);
  });
  const F = [...m.values()].sort((I, S) => I.sortOrder - S.sortOrder || wt(I.name, S.name));
  let W = 28;
  const j = [], G = F.map((I) => {
    const S = /* @__PURE__ */ new Map();
    I.nodes.forEach((z) => {
      const Y = b.get(z.tagId) || 0;
      S.has(Y) || S.set(Y, []), S.get(Y).push(z);
    });
    for (const z of S.values())
      z.sort((Y, _) => Y.segmentGroupTagSortOrder - _.segmentGroupTagSortOrder || wt(Y.name, _.name));
    const M = Math.max(1, ...[...S.values()].map((z) => z.length)), K = M * 58 + (M - 1) * 18, R = 70 + K, A = {
      ...I,
      x: 12,
      y: W,
      width: C - 24,
      height: R
    };
    for (const [z, Y] of S.entries()) {
      const _ = Y.length * 58 + Math.max(0, Y.length - 1) * 18, te = (K - _) / 2;
      Y.forEach((de, be) => j.push({
        ...de,
        rank: z,
        x: 28 + z * 296,
        y: W + 34 + 18 + te + be * 76,
        width: 184,
        height: 58
      }));
    }
    return W += R + 16, A;
  }), E = new Map(j.map((I) => [I.tagId, I])), N = e.connections.map((I) => {
    const S = E.get(I.sourceTagId), M = E.get(I.derivedTagId), K = S.x + S.width, R = S.y + S.height / 2, A = M.x, z = M.y + M.height / 2, Y = Math.max(48, (A - K) * 0.48);
    return {
      ...I,
      path: `M ${K} ${R} C ${K + Y} ${R}, ${A - Y} ${z}, ${A} ${z}`
    };
  });
  return {
    width: C,
    height: Math.max(n, W - 16 + 28),
    nodes: j,
    connections: N,
    groups: G
  };
}
function bu(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = yu(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), u = 20, f = o, y = c.nodes.map((g) => ({
      ...g,
      x: g.x + u,
      y: g.y + f
    })), b = new Map(y.map((g) => [g.tagId, g]));
    a.push(...y), l.push(...c.groups.map((g) => ({
      ...g,
      componentId: d.id,
      x: g.x + u,
      y: g.y + f
    }))), s.push(...c.connections.map((g) => {
      const p = b.get(g.sourceTagId), k = b.get(g.derivedTagId), C = p.x + p.width, m = p.y + p.height / 2, F = k.x, W = k.y + k.height / 2, j = Math.max(48, (F - C) * 0.48);
      return {
        ...g,
        componentId: d.id,
        path: `M ${C} ${m} C ${C + j} ${m}, ${F - j} ${W}, ${F} ${W}`
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
function Ri(e, t = []) {
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
function hu(e, t, n) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !n && t[0] || null;
}
function vu(e) {
  const { arrowMarkerId: t, busy: n, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: u, editorRef: f, emptyDraft: y, graph: b, layout: g, listSort: p, materializationOffer: k, materializeOutgoingRules: C, materializeRule: m, message: F, normalizedQuery: W, query: j, refreshConfiguredTag: G, revealEditor: E, rules: N, save: I, segmentGroupKey: S, selectedNode: M, selectedRule: K, selection: R, setConfiguringTag: A, setDraft: z, setListSort: Y, setMaterializationOffer: _, setQuery: te, setSegmentGroupKey: de, setSelection: be, setView: Z, sortedVisibleRules: Ce, sourceSlots: xe, sourceSlotsLoading: U, updateMapping: se, updateTag: ce, view: Se, visibleComponents: Ie, visibleRules: le } = e;
  function Q(v) {
    const h = b.nodes.find((O) => O.tagId === Number(v.sourceTagId)), x = b.nodes.find((O) => O.tagId === Number(v.derivedTagId));
    return (h == null ? void 0 : h.segmentGroupKey) === (x == null ? void 0 : x.segmentGroupKey) ? h.segmentGroupKey : "cross-group";
  }
  function ye() {
    return r("div", { key: "editor", ref: f, className: "space-y-4 p-4" }, [
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
          onClick: () => z(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      r("div", { key: "tags", className: "space-y-3" }, [
        r("div", { key: "source", className: "space-y-2" }, [
          r("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            r("span", { key: "label" }, "Source tag (specific)"),
            r(Qn, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (v, h) => ce("source", v, h == null ? void 0 : h.label),
              disabled: n,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !U && xe.length === 0 ? r("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            r("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            r("button", {
              key: "configure",
              type: "button",
              disabled: n,
              onClick: (v) => A({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: v.currentTarget
              }),
              className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
            }, "Configure source tag")
          ]) : null
        ]),
        r("div", { key: "derived", className: "space-y-2" }, [
          r("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            r("span", { key: "label" }, "Derived tag (general)"),
            r(Qn, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (v, h) => ce("derived", v, h == null ? void 0 : h.label),
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
              onClick: (v) => A({
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
            disabled: n || xe.length === 0 || s.length === 0,
            onClick: () => z((v) => ({
              ...v,
              slotMappings: [...v.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
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
          ...d.slotMappings.map((v, h) => r("div", { key: h, className: "flex items-center gap-2" }, [
            r("select", {
              key: "source",
              value: v.sourceSlotDefinitionId,
              disabled: n,
              onChange: (x) => se(h, "sourceSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${h + 1}`
            }, [r("option", { key: "none", value: "" }, "Source slot…"), ...xe.map((x) => r("option", { key: x.id, value: x.id }, Rt(x)))]),
            r("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            r("select", {
              key: "derived",
              value: v.derivedSlotDefinitionId,
              disabled: n,
              onChange: (x) => se(h, "derivedSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${h + 1}`
            }, [r("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((x) => r("option", { key: x.id, value: x.id }, Rt(x)))]),
            r("button", {
              key: "remove",
              type: "button",
              disabled: n,
              onClick: () => z((x) => ({
                ...x,
                slotMappings: x.slotMappings.filter((O, ne) => ne !== h)
              })),
              className: `${o} shrink-0 text-red-300`,
              "aria-label": `Remove performer slot mapping ${h + 1}`,
              title: "Remove mapping"
            }, "🗑")
          ]))
        ])
      ]),
      r("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        r("button", {
          key: "save",
          type: "button",
          disabled: n || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((v) => !v.sourceSlotDefinitionId || !v.derivedSlotDefinitionId),
          onClick: I,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        r("button", { key: "cancel", type: "button", disabled: n, onClick: () => z(null), className: o }, "Cancel")
      ])
    ]);
  }
  function T() {
    if (M) {
      const x = le.filter((re) => Number(re.derivedTagId) === M.tagId), O = le.filter((re) => Number(re.sourceTagId) === M.tagId), ne = (re, P, oe) => r("div", {
        key: re.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        r("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          r("span", { key: "direction", className: "block text-secondary" }, P),
          r(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${re.sourceTagName} → ${re.derivedTagName}`
          )
        ]),
        r("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          oe ? r("button", {
            key: "materialize",
            type: "button",
            disabled: n || d != null,
            onClick: () => m(re),
            className: o
          }, "Materialize") : null,
          r("button", {
            key: "edit",
            type: "button",
            disabled: n || d != null,
            onClick: () => u(re, !0),
            className: o
          }, "Edit rule"),
          r("button", {
            key: "delete",
            type: "button",
            disabled: n || d != null,
            onClick: () => a(re),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return r("div", { key: "node-details", className: "space-y-4 p-4" }, [
        r("div", { key: "identity" }, [
          r("div", { key: "group", className: "text-xs font-medium text-accent" }, M.segmentGroupName),
          r("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, M.name),
          r(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${M.incomingRuleCount} incoming · ${M.outgoingRuleCount} outgoing`
          )
        ]),
        r("button", {
          key: "configure-tag",
          type: "button",
          disabled: n || d != null,
          onClick: (re) => A({
            tagId: M.tagId,
            tagName: M.name,
            trigger: re.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        O.length ? r("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: n || d != null,
          onClick: () => C(M, O),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${O.length})`) : null,
        O.length ? r("div", { key: "outgoing", className: "space-y-2" }, [
          r("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...O.map((re) => ne(re, "Derives", !0))
        ]) : null,
        x.length ? r("details", {
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
              x.length
            )
          ]),
          r(
            "div",
            { key: "rules", className: "space-y-2 border-t border-border p-2" },
            x.map((re) => ne(re, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!K)
      return r(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const v = b.nodes.find((x) => x.tagId === Number(K.sourceTagId)), h = b.nodes.find((x) => x.tagId === Number(K.derivedTagId));
    return r("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      r("div", { key: "identity" }, [
        r("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          r("span", { key: "source" }, (v == null ? void 0 : v.segmentGroupName) || "Ungrouped"),
          (v == null ? void 0 : v.segmentGroupKey) !== (h == null ? void 0 : h.segmentGroupKey) ? r("span", { key: "derived" }, `→ ${(h == null ? void 0 : h.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        r(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${K.sourceTagName} → ${K.derivedTagName}`
        ),
        r(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${K.edgeCount} materialized lineage edge${K.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (k == null ? void 0 : k.ruleId) === K.id ? r("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => m(K, k),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          r("button", {
            key: "later",
            type: "button",
            disabled: n,
            onClick: () => _(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      r("div", { key: "mappings", className: "space-y-2" }, [
        r("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        K.slotMappings.length === 0 ? r("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : K.slotMappings.map((x, O) => r("div", {
          key: `${x.sourceSlotDefinitionId}:${x.derivedSlotDefinitionId}`,
          className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
        }, [
          r(
            "span",
            { key: "source", className: "truncate text-foreground", title: x.sourceSlotLabel || "Unnamed slot" },
            x.sourceSlotLabel || "Unnamed slot"
          ),
          r("span", { key: "arrow", className: "text-secondary" }, "→"),
          r(
            "span",
            { key: "derived", className: "truncate text-foreground", title: x.derivedSlotLabel || "Unnamed slot" },
            x.derivedSlotLabel || "Unnamed slot"
          )
        ]))
      ]),
      r("dl", { key: "metadata", className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-xs" }, [
        r("dt", { key: "created-label", className: "text-secondary" }, "Created"),
        r(
          "dd",
          { key: "created", className: "text-right text-foreground" },
          K.createdAt ? new Date(K.createdAt).toLocaleDateString() : "Unknown"
        ),
        r("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        r(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          K.updatedAt ? new Date(K.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      r("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        r("button", {
          key: "materialize",
          type: "button",
          disabled: n || d != null,
          onClick: () => m(K),
          className: o
        }, "Materialize pending"),
        r("button", {
          key: "edit",
          type: "button",
          disabled: n || d != null,
          onClick: () => u(K),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        r("button", {
          key: "delete",
          type: "button",
          disabled: n,
          onClick: () => a(K),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function J() {
    if (Ie.length === 0)
      return r("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, W ? "No derivation relationships match your search." : "No derivation rules.");
    const v = M == null ? void 0 : M.tagId, h = /* @__PURE__ */ new Set();
    return M && (h.add(M.tagId), g.connections.forEach((x) => {
      (x.sourceTagId === M.tagId || x.derivedTagId === M.tagId) && (h.add(x.sourceTagId), h.add(x.derivedTagId));
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
        ...g.groups.map((x) => r("div", {
          key: `group:${x.componentId}:${x.key}`,
          className: `absolute rounded-xl border ${S === x.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
          style: {
            left: `${x.x}px`,
            top: `${x.y}px`,
            width: `${x.width}px`,
            height: `${x.height}px`
          }
        }, r("div", {
          className: "absolute left-3 top-2 max-w-[16rem] truncate text-[11px] font-semibold uppercase tracking-wide text-secondary",
          title: x.name
        }, x.name))),
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
          ...g.connections.map((x) => {
            const O = v === x.sourceTagId || v === x.derivedTagId, ne = M != null, re = O ? "var(--color-accent)" : "var(--color-secondary)";
            return r("path", {
              key: `${x.id}:visible`,
              d: x.path,
              fill: "none",
              stroke: re,
              strokeWidth: O ? 2.5 : 1.5,
              opacity: ne && !O ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...g.nodes.map((x) => {
          const O = !W || x.name.toLocaleLowerCase().includes(W), ne = M != null, re = h.has(x.tagId), P = (M == null ? void 0 : M.tagId) === x.tagId;
          return r("button", {
            key: `node:${x.tagId}`,
            type: "button",
            onClick: () => be({ type: "node", id: x.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${P ? "border-accent bg-accent/15 ring-2 ring-accent/25" : re ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${x.x}px`,
              top: `${x.y}px`,
              width: `${x.width}px`,
              height: `${x.height}px`,
              opacity: !O || ne && !re ? 0.62 : 1
            },
            title: `${x.name} — ${x.segmentGroupName}`,
            "aria-label": `${x.name}, ${x.incomingRuleCount} incoming and ${x.outgoingRuleCount} outgoing derivation rules`
          }, [
            r("span", { key: "name", className: "block truncate text-sm font-medium text-foreground" }, x.name),
            r("span", { key: "counts", className: "mt-1 flex items-center gap-2 text-[11px] text-secondary" }, [
              r("span", { key: "in" }, `${x.incomingRuleCount} in`),
              r("span", { key: "arrow", "aria-hidden": "true" }, "→"),
              r("span", { key: "out" }, `${x.outgoingRuleCount} out`)
            ])
          ]);
        }),
        ...g.connections.filter((x) => x.rules.length > 1).map((x) => {
          const O = g.nodes.find((re) => re.tagId === x.sourceTagId), ne = g.nodes.find((re) => re.tagId === x.derivedTagId);
          return r("div", {
            key: `bundle:${x.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(O.x + O.width + ne.x) / 2 - 24}px`,
              top: `${(O.y + O.height / 2 + ne.y + ne.height / 2) / 2 - 10}px`
            },
            "aria-label": `${x.rules.length} rules connect ${x.rules[0].sourceTagName} to ${x.rules[0].derivedTagName}`
          }, `${x.rules.length} rules`);
        })
      ])
    ]);
  }
  function $() {
    if (Ie.length === 0)
      return r(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        W ? "No derivation relationships match your search." : "No derivation rules."
      );
    const v = /* @__PURE__ */ new Map();
    Ce.forEach((x) => {
      const O = Q(x);
      v.has(O) || v.set(O, []), v.get(O).push(x);
    });
    const h = [
      ...b.segmentGroups.map((x) => x.key),
      "cross-group"
    ].filter((x) => v.has(x));
    return r("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, h.map((x) => {
      const O = b.segmentGroups.find((P) => P.key === x), ne = x === "cross-group" ? "Cross-group relationships" : (O == null ? void 0 : O.name) || "Ungrouped", re = v.get(x);
      return r("section", { key: x, "aria-label": ne }, [
        r("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          r("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, ne),
          r(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${re.length} rule${re.length === 1 ? "" : "s"}`
          )
        ]),
        r("div", { key: "table", role: "table", "aria-label": `${ne} derivation rules` }, [
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
          ...re.map((P) => r("button", {
            key: P.id,
            type: "button",
            role: "row",
            onClick: () => be({ type: "rule", id: P.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(K == null ? void 0 : K.id) === P.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            r(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${P.sourceTagName} → ${P.derivedTagName}` },
              `${P.sourceTagName} → ${P.derivedTagName}`
            ),
            r("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(P.slotMappings.length)),
            r("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(P.edgeCount))
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
          `${N.length} rules · ${b.nodes.length} tags`
        )
      ]),
      r("button", {
        key: "add",
        type: "button",
        disabled: n || d != null,
        onClick: () => {
          z(y()), be(null), E();
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
          value: j,
          onChange: (v) => {
            te(v.target.value), be(null);
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
          value: S,
          disabled: d != null,
          onChange: (v) => {
            de(v.target.value), be(null), z(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          r("option", { key: "all", value: "all" }, "All Segment groups"),
          ...b.segmentGroups.map((v) => r("option", { key: v.key, value: v.key }, v.name))
        ])
      ]),
      Se === "list" ? r("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        r("span", { key: "label" }, "Sort"),
        r("select", {
          key: "select",
          value: p,
          onChange: (v) => Y(v.target.value),
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
        ].map(([v, h]) => r("button", {
          key: v,
          type: "button",
          onClick: () => {
            Z(v), v === "graph" && (R == null ? void 0 : R.type) === "rule" && be(null);
          },
          "aria-pressed": Se === v,
          className: `rounded px-3 py-1.5 text-sm font-medium ${Se === v ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
        }, h))
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
        Se === "graph" ? J() : $()
      ),
      r("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        r("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? ye() : T()
      ])
    ])),
    r("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      F ? r("p", { key: "message", role: "status", className: "text-sm text-secondary" }, F) : null
    ]),
    i ? r(Ro, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => G(i),
      onClose: () => {
        const v = i.trigger;
        A(null), requestAnimationFrame(() => {
          v != null && v.isConnected && v.focus();
        });
      }
    }) : null
  ]);
}
function xu({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const n = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = B([]), [a, s] = B(null), [l, d] = B([]), [c, u] = B([]), [f, y] = B(!1), [b, g] = B(!1), [p, k] = B(!1), [C, m] = B(""), [F, W] = B(""), [j, G] = B("graph"), [E, N] = B("all"), [I, S] = B(null), [M, K] = B("relationship"), [R, A] = B(null), [z, Y] = B(null), _ = ge(null), te = ge(null), de = ua().replace(/:/g, "");
  function be() {
    requestAnimationFrame(() => {
      var w;
      return (w = _.current) == null ? void 0 : w.scrollIntoView({ block: "nearest" });
    });
  }
  async function Z(w) {
    const q = await ee("/derivation-rules", w ? { signal: w } : void 0);
    i(q || []);
  }
  pe(() => {
    const w = new AbortController();
    return Z(w.signal).catch((q) => {
      q.name !== "AbortError" && m(q.message || "Unable to load derived segment rules.");
    }), () => w.abort();
  }, []), pe(() => {
    const w = new AbortController();
    return a != null && a.sourceTagId ? (y(!0), ee(`/slot-definitions/${a.sourceTagId}`, { signal: w.signal }).then((q) => d(q.definitions || [])).catch((q) => {
      q.name !== "AbortError" && d([]);
    }).finally(() => {
      w.signal.aborted || y(!1);
    })) : (d([]), y(!1)), a != null && a.derivedTagId ? (g(!0), ee(`/slot-definitions/${a.derivedTagId}`, { signal: w.signal }).then((q) => u(q.definitions || [])).catch((q) => {
      q.name !== "AbortError" && u([]);
    }).finally(() => {
      w.signal.aborted || g(!1);
    })) : (u([]), g(!1)), () => w.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), pe(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || f || b)
      return;
    const w = `${a.sourceTagId}:${a.derivedTagId}`;
    te.current !== w && (te.current = w, s((q) => !q || Number(q.sourceTagId) !== Number(a.sourceTagId) || Number(q.derivedTagId) !== Number(a.derivedTagId) ? q : Md(q, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    f,
    b
  ]);
  function Ce(w, q = !1) {
    q || S({ type: "rule", id: w.id }), te.current = null, s({
      ruleId: w.id,
      sourceTagId: w.sourceTagId,
      sourceTagName: w.sourceTagName,
      derivedTagId: w.derivedTagId,
      derivedTagName: w.derivedTagName,
      slotMappings: w.slotMappings.map((L) => ({
        sourceSlotDefinitionId: L.sourceSlotDefinitionId,
        derivedSlotDefinitionId: L.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), m(""), be();
  }
  function xe(w, q, L = "") {
    te.current = null, w === "source" ? (d([]), y(q != null)) : (u([]), g(q != null)), s((X) => ({
      ...X,
      [`${w}TagId`]: q == null ? null : Number(q),
      [`${w}TagName`]: L || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function U(w) {
    (a == null ? void 0 : a.ruleId) == null && (te.current = null);
    const q = [Z(), t == null ? void 0 : t()];
    return w.draftKind === "source" ? (y(!0), q.push(ee(`/slot-definitions/${w.tagId}`).then((L) => d(L.definitions || [])).finally(() => y(!1)))) : w.draftKind === "derived" && (g(!0), q.push(ee(`/slot-definitions/${w.tagId}`).then((L) => u(L.definitions || [])).finally(() => g(!1)))), Promise.all(q);
  }
  function se(w, q, L) {
    s((X) => ({
      ...X,
      slotMappings: X.slotMappings.map((fe, me) => me === w ? { ...fe, [q]: L } : fe)
    }));
  }
  async function ce() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const w = Ri(a, o);
    if (w) {
      m(w.message);
      return;
    }
    if (a.slotMappings.some((q) => !q.sourceSlotDefinitionId || !q.derivedSlotDefinitionId)) {
      m("Complete or remove every performer slot mapping before saving.");
      return;
    }
    k(!0), m(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let q = null;
      if (a.ruleId != null) {
        const X = await ee(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${X.deletedSegmentCount}
Removed lineage edges: ${X.removedEdgeCount}
Shared derived segments retained: ${X.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        q = X.fingerprint;
      }
      m("Saving derived segment rule…");
      const L = await ee("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: q
        })
      });
      if (await Z(), S(j === "graph" ? { type: "node", id: Number(L.sourceTagId) } : { type: "rule", id: L.id }), s(null), a.ruleId == null)
        try {
          const X = await ee(
            `/derivation-rules/${L.id}/materialization/preview`,
            { method: "POST" }
          );
          A(
            X.createCount + X.linkCount > 0 ? X : null
          ), m(X.createCount + X.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          A(null), m("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        A(null), m("Derived segment rule saved. Previous materializations were removed.");
    } catch (q) {
      m(q.message || "Unable to save derived segment rule.");
    } finally {
      k(!1);
    }
  }
  async function Se(w) {
    k(!0), m("Previewing rule deletion…");
    try {
      const q = await ee(
        `/derivation-rules/${w.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${w.sourceTagName} → ${w.derivedTagName}?

Deleted segments: ${q.deletedSegmentCount}
Removed lineage edges: ${q.removedEdgeCount}
Shared derived segments retained: ${q.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const L = `derivation-rule-delete:${w.id}:${q.fingerprint}`;
      await ee(`/derivation-rules/${w.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(L),
          fingerprint: q.fingerprint
        })
      }), He(L), await Z(), (a == null ? void 0 : a.ruleId) === w.id && s(null), (I == null ? void 0 : I.type) === "rule" && I.id === w.id && S(null), (R == null ? void 0 : R.ruleId) === w.id && A(null), m(`Rule deleted with ${q.deletedSegmentCount} exclusively derived segment${q.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (q) {
      m(q.message || "Unable to delete derived segment rule.");
    } finally {
      k(!1);
    }
  }
  async function Ie(w, q = null) {
    const L = q || await ee(
      `/derivation-rules/${w.id}/materialization/preview`,
      { method: "POST" }
    );
    if (L.createCount + L.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const X = `derivation-rule-materialize:${w.id}:${L.fingerprint}`, fe = await ee(`/derivation-rules/${w.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: _e(X),
        fingerprint: L.fingerprint
      })
    });
    return He(X), fe;
  }
  async function le(w, q = null) {
    k(!0), m("Finding pending derivations…");
    try {
      const L = await Ie(w, q);
      if (A(null), await Z(), L.createdCount + L.linkedCount === 0) {
        m("Every applicable derivation is already materialized.");
        return;
      }
      m(
        `${L.createdCount} derived segment${L.createdCount === 1 ? "" : "s"} created and ${L.linkedCount} existing segment${L.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (L) {
      m(L.message || "Unable to materialize pending derivations.");
    } finally {
      k(!1);
    }
  }
  async function Q(w, q) {
    if (q.length === 0) return;
    k(!0), m(`Finding pending derivations from ${w.name}…`);
    let L = 0, X = 0;
    try {
      for (const fe of q) {
        const me = await Ie(fe);
        L += me.createdCount, X += me.linkedCount;
      }
      A(null), await Z(), m(L + X === 0 ? `Every outgoing derivation from ${w.name} is already materialized.` : `${L} derived segment${L === 1 ? "" : "s"} created and ${X} existing segment${X === 1 ? "" : "s"} linked from ${w.name}.`);
    } catch (fe) {
      await Z().catch(() => {
      }), m(fe.message || `Unable to materialize derivations from ${w.name}.`);
    } finally {
      k(!1);
    }
  }
  const ye = Ri(a, o), T = ze(
    () => fu(o, e),
    [o, e]
  ), J = F.trim().toLocaleLowerCase(), v = T.components.filter((w) => E === "all" || w.segmentGroupKeys.includes(E)).filter((w) => !J || w.nodes.some((q) => q.name.toLocaleLowerCase().includes(J))), h = v.flatMap((w) => w.rules), x = new Set(
    v.flatMap((w) => w.nodes.map((q) => q.tagId))
  ), O = ze(
    () => bu(v),
    [v]
  ), ne = j === "list" ? hu(
    I,
    h,
    J.length > 0
  ) : null, re = (I == null ? void 0 : I.type) === "node" && T.nodes.find((w) => w.tagId === I.id && x.has(w.tagId)) || null, P = [...h].sort((w, q) => M === "source" ? wt(w.sourceTagName, q.sourceTagName) || wt(w.derivedTagName, q.derivedTagName) : M === "target" ? wt(w.derivedTagName, q.derivedTagName) || wt(w.sourceTagName, q.sourceTagName) : M === "materialized" ? (Number(q.edgeCount) || 0) - (Number(w.edgeCount) || 0) || wt(w.sourceTagName, q.sourceTagName) : wt(
    `${w.sourceTagName} ${w.derivedTagName}`,
    `${q.sourceTagName} ${q.derivedTagName}`
  ));
  return r(vu, {
    arrowMarkerId: de,
    busy: p,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: z,
    deleteRule: Se,
    derivedSlots: c,
    derivedSlotsLoading: b,
    draft: a,
    draftIssue: ye,
    editRule: Ce,
    editorRef: _,
    emptyDraft: n,
    graph: T,
    layout: O,
    listSort: M,
    materializationOffer: R,
    materializeOutgoingRules: Q,
    materializeRule: le,
    message: C,
    normalizedQuery: J,
    query: F,
    refreshConfiguredTag: U,
    revealEditor: be,
    rules: o,
    save: ce,
    segmentGroupKey: E,
    selectedNode: re,
    selectedRule: ne,
    selection: I,
    setConfiguringTag: Y,
    setDraft: s,
    setListSort: K,
    setMaterializationOffer: A,
    setQuery: W,
    setSegmentGroupKey: N,
    setSelection: S,
    setView: G,
    sortedVisibleRules: P,
    sourceSlots: l,
    sourceSlotsLoading: f,
    updateMapping: se,
    updateTag: xe,
    view: j,
    visibleComponents: v,
    visibleRules: h
  });
}
function Su() {
  const [e, t] = B(ea), n = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => ui({ ...l, [a]: s }));
  }
  function i() {
    t(ui(bo));
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
function ku({ active: e, segmentGroups: t, onSegmentGroupsChanged: n }) {
  const [o, i] = B([]), [a, s] = B(!1), [l, d] = B(!1), [c, u] = B(""), [f, y] = B(""), [b, g] = B("all"), [p, k] = B(() => /* @__PURE__ */ new Set()), [C, m] = B(null);
  pe(() => {
    if (!e || a) return;
    const A = new AbortController();
    return d(!0), u(""), ee("/slot-definitions", { signal: A.signal }).then((z) => {
      i(z || []), s(!0);
    }).catch((z) => {
      z.name !== "AbortError" && u(z.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      A.signal.aborted || d(!1);
    }), () => A.abort();
  }, [e, a]);
  async function F() {
    d(!0), u("");
    try {
      const A = await ee("/slot-definitions");
      i(A || []), s(!0);
    } catch (A) {
      u(A.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function W() {
    const [A] = await Promise.all([
      ee("/slot-definitions"),
      n == null ? void 0 : n()
    ]);
    i(A || []), s(!0), u("");
  }
  function j() {
    const A = C == null ? void 0 : C.trigger;
    m(null), requestAnimationFrame(() => {
      A != null && A.isConnected && A.focus({ preventScroll: !0 });
    });
  }
  function G(A) {
    k((z) => {
      const Y = new Set(z);
      return Y.has(A) ? Y.delete(A) : Y.add(A), Y;
    });
  }
  const E = ze(
    () => gu(t, o),
    [t, o]
  ), N = ze(
    () => pu(E, f, b),
    [E, f, b]
  ), I = E.flatMap((A) => A.tags), S = I.filter((A) => A.definitions.length > 0).length, M = I.length - S, K = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], R = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${I.length} tags · ${S} with slots · ${M} without slots`
      ) : null
    ]),
    r("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      r("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        r("span", { key: "label" }, "Search"),
        r("input", {
          key: "input",
          type: "search",
          value: f,
          onChange: (A) => y(A.target.value),
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
          K.map(([A, z]) => r("button", {
            key: A,
            type: "button",
            onClick: () => g(A),
            "aria-pressed": b === A,
            className: `rounded px-3 py-1.5 text-xs font-medium ${b === A ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, z))
        )
      ]),
      r("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        r("button", {
          key: "expand",
          type: "button",
          onClick: () => k(/* @__PURE__ */ new Set()),
          className: R
        }, "Expand all"),
        r("button", {
          key: "collapse",
          type: "button",
          onClick: () => k(new Set(E.map((A) => A.overviewKey))),
          className: R
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
        onClick: F,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && N.length === 0 ? r(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? r("div", { key: "groups", className: "space-y-3" }, N.map((A) => {
      const z = p.has(A.overviewKey), Y = A.tags.filter((_) => _.definitions.length > 0).length;
      return r("article", {
        key: A.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        r("button", {
          key: "header",
          type: "button",
          onClick: () => G(A.overviewKey),
          "aria-expanded": !z,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          r("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, z ? "▸" : "▾"),
          r("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, A.name),
          r(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${A.tags.length} tag${A.tags.length === 1 ? "" : "s"} · ${Y} with slots`
          )
        ]),
        z ? null : r(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          A.tags.map((_) => r("li", {
            key: _.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            r("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              r("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: _.tagName }, _.tagName),
              _.allowSamePerformerInMultipleSlots ? r(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            _.definitions.length === 0 ? r("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : r("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${_.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, _.definitions.map((te) => r("li", {
              key: te.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              r("span", { key: "label", className: "font-medium text-foreground" }, Rt(te)),
              ...(te.genderHints || []).map((de) => r("span", {
                key: de,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, Dr(de)))
            ]))),
            r("button", {
              key: "edit",
              type: "button",
              onClick: (te) => m({
                tagId: _.tagId,
                tagName: _.tagName,
                trigger: te.currentTarget
              }),
              "aria-label": `Edit performer slots for ${_.tagName}`,
              className: `${R} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    C ? r(Ro, {
      key: `performer-slots-configure:${C.tagId}`,
      tagId: C.tagId,
      tagName: C.tagName,
      onSaved: W,
      onClose: j
    }) : null
  ]);
}
function wu({ onNavigate: e, profile: t, onProfileChange: n }) {
  const [o, i] = B("general"), [a, s] = B([]), [l, d] = B(!1), [c, u] = B(""), [f, y] = B(Wi), b = Ll(t), g = b.map(([m]) => m);
  pe(() => {
    g.includes(o) || i(g[0] || "general");
  }, [t.effectiveMode]);
  async function p(m) {
    const F = await ee("/segment-groups", m ? { signal: m } : void 0);
    s(F || []);
  }
  pe(() => {
    const m = new AbortController();
    return p(m.signal).catch((F) => {
      F.name !== "AbortError" && u(F.message || "Unable to load tag groups.");
    }), () => m.abort();
  }, []);
  async function k(m) {
    if (m !== t.requestedMode) {
      d(!0), u("");
      try {
        const F = await ee(
          `/preferences/transition?mode=${encodeURIComponent(m)}`
        );
        let W = !1, j = null, G = null, E = null, N = !1;
        if (t.requestedMode === "basic" && m === "full") {
          if (!window.confirm(Gl(
            F.recyclingBinCount,
            F.protectedRecyclingBinCount
          )))
            return;
          N = !0, F.recyclingBinCount > 0 && (W = !0, E = F.recyclingBinFingerprint, j = `mode-switch-empty-bin:${E}`, G = _e(j));
        }
        let I = !1;
        if (t.requestedMode === "full" && m === "basic") {
          if (!window.confirm(Fl(
            F.extensionOwnedSegmentCount
          )))
            return;
          I = !0;
        }
        const S = await ee("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: m,
            confirmHiddenExtensionOwnedSegments: I,
            confirmBasicHistoryCleanup: N,
            emptyRecyclingBin: W,
            operationId: G,
            expectedRecyclingBinFingerprint: E
          })
        });
        j && He(j), n == null || n(ta(S)), u("Workflow mode saved.");
      } catch (F) {
        u(F.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  const C = { page: "segment-studio" };
  return r("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    r("a", { key: "back", href: "/segment-studio", onClick: (m) => Oa(m, e, C), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      b.map(([m, F]) => r("button", {
        key: m,
        type: "button",
        onClick: () => i(m),
        "aria-current": o === m ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === m ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, F))
    ),
    r(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      r(Su)
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
      r(Lc, {
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
          checked: f,
          onChange: (m) => {
            const F = m.target.checked;
            Vi(F), y(F);
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
      r(xu, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => p()
      })
    ) : null,
    g.includes("performer-slots") ? r(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      r(ku, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => p()
      })
    ) : null,
    c ? r("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function Nu({ item: e, selected: t, busy: n, onSelect: o, onRestore: i, onPurge: a }) {
  var u, f;
  const s = [...e.slots || []].sort((y, b) => y.sortOrder - b.sortOrder || String(y.slotDefinitionId).localeCompare(String(b.slotDefinitionId))), l = [...new Map(s.map((y) => [
    y.performerId,
    { id: y.performerId, name: y.performerName }
  ])).values()], d = s.map((y) => ({
    slotDefinitionId: y.slotDefinitionId,
    label: Rt(y),
    performer: { id: y.performerId, name: y.performerName }
  })), c = sa(e);
  return r("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: ba(t)
  }, [
    r("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((u = e.activity) == null ? void 0 : u.name) || "segment"}, ${e.reviewState}, ${Oe(e.startSec)} to ${e.endSec == null ? "end of video" : Oe(e.endSec)}` }, [
      r("div", { key: "image", className: "relative aspect-video bg-black" }, [
        r("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        r("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${Oe(e.startSec)} → end` : `${Oe(e.startSec)} – ${Oe(e.endSec)}`)
      ]),
      r("div", { key: "body", className: "flex flex-col gap-1.5 p-2.5" }, [
        r("div", { key: "segment", className: "flex min-w-0 items-center gap-1.5" }, [
          r(mn, { key: "state", state: e.reviewState, includeLabel: !1 }),
          r("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((f = e.activity) == null ? void 0 : f.name) || "Tag segment"),
          l.length ? r(Or, {
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
function Iu({ item: e, index: t, count: n, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return r("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? r("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, r(Di, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: Jl(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : r("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    r("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      r("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      r("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${n}`),
      r("button", { key: "next", type: "button", disabled: t < 0 || t >= n - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      r("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      r("a", { key: "edit", href: sa(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Ei({ onNavigate: e, profile: t }) {
  const n = ze(() => {
    const U = Pi("ext:com.midnightrider.segment-studio:segments");
    return U ? {
      ...Qr,
      defaultFilter: { ...Qr.defaultFilter, ...U.findFilter || {} },
      defaultObjectFilter: U.objectFilter || {}
    } : Qr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Li(n), [l, d] = B(null), [c, u] = B(""), [f, y] = B(0), [b, g] = B({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [p, k] = B(null), [C, m] = B(null), [F, W] = B(0), [j, G] = B(""), [E, N] = B(!0), [I, S] = B(""), M = ge(0), K = zl(i, l), R = K.slots !== void 0, A = Wl(o, K), z = b.performerSlotsAvailable !== !1, Y = ze(
    () => z ? [...mi, Bl(l, i, dd)] : mi,
    [l, i, z]
  ), _ = JSON.stringify(A);
  pe(() => {
    const U = new AbortController();
    return u(""), ee("/browse/roles", { signal: U.signal }).then(d).catch((se) => {
      se.name !== "AbortError" && (se.status === 403 ? (d([]), g((ce) => ({ ...ce, performerSlotsAvailable: !1 }))) : u(se.message || "Unable to load performer slot roles."));
    }), () => U.abort();
  }, [f]), pe(() => {
    K !== i && !R && s(K);
  }, [K, i, R]), pe(() => {
    if (R) return;
    const U = ++M.current, se = new AbortController();
    return N(!0), S(""), ee("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(A), signal: se.signal }).then((ce) => {
      U === M.current && g({ ...ce, totalCount: ce.totalCount ?? ce.total ?? 0 });
    }).catch((ce) => {
      if (!(U !== M.current || ce.name === "AbortError")) {
        if (ce.status === 400 && ce.message.includes("unrestricted performer read access")) {
          g((Se) => ({ ...Se, performerSlotsAvailable: !1 })), s(Vl(K)), G("Performer slot filters were cleared because performer details are unavailable.");
          return;
        }
        S(ce.message);
      }
    }).finally(() => {
      U === M.current && N(!1);
    }), () => {
      M.current++, se.abort();
    };
  }, [_, F, R]);
  const te = b.items.findIndex((U) => U.key === p), de = b.items[te] || null;
  function be(U) {
    s(U), a({ ...o, page: 1 });
  }
  function Z() {
    const U = document.querySelector(`[data-segment-key="${p}"]`);
    k(null), requestAnimationFrame(() => U == null ? void 0 : U.focus());
  }
  async function Ce(U) {
    var Se;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    m(U.key), G("");
    const se = `browse-restore:${U.itemId}:${U.revision}`, ce = _e(se);
    try {
      const Ie = (le = !1) => ee(`/bin/${U.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ce,
          expectedRevision: U.revision,
          discardMissingImage: le
        })
      });
      try {
        await Ie(So(se));
      } catch (le) {
        if (((Se = le.payload) == null ? void 0 : Se.code) !== "missing-image" || !window.confirm(`${le.message}

Continue and discard the missing image reference?`))
          throw le;
        ko(se), await Ie(!0);
      }
      He(se), p === U.key && k(null), G("Segment restored to Cove."), W((le) => le + 1);
    } catch (Ie) {
      G(Ie.message || "Unable to restore the segment."), Ie.status === 409 && W((le) => le + 1);
    } finally {
      m(null);
    }
  }
  async function xe(U) {
    m(U.key), G("");
    try {
      const se = await ee(`/items/${U.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: U.revision })
      });
      if (!ga(se, G) || !fd(se))
        return;
      const ce = `browse-dependency-delete:${U.itemId}:${se.fingerprint}`;
      await ee(`/items/${U.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(ce),
          fingerprint: se.fingerprint
        })
      }), He(ce), p === U.key && k(null), G(`${se.deletedSegmentCount} segment${se.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), W((Se) => Se + 1);
    } catch (se) {
      G(se.message || "Unable to permanently delete the segment."), se.status === 409 && W((ce) => ce + 1);
    } finally {
      m(null);
    }
  }
  return r("div", { className: "w-full space-y-5" }, [
    r(To, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    r(ji, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: a,
      totalCount: b.totalCount,
      isLoading: E,
      error: I ? new Error(I) : null,
      onRetry: () => W((U) => U + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: Y,
      objectFilter: K,
      supportsFilterExpressions: !0,
      onObjectFilterChange: be,
      searchPlaceholder: "Search segments..."
    }, [
      r(Iu, { key: "player", item: de, index: te, count: b.items.length, onPrevious: () => {
        var U;
        return k((U = b.items[te - 1]) == null ? void 0 : U.key);
      }, onNext: () => {
        var U;
        return k((U = b.items[te + 1]) == null ? void 0 : U.key);
      }, onClose: Z, onNavigate: e }),
      c ? r("div", { key: "roles-error", role: "alert", className: "flex flex-wrap items-center gap-3 rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, [
        r("span", { key: "text" }, `Performer slot roles could not be loaded: ${c}`),
        r("button", { key: "retry", type: "button", onClick: () => y((U) => U + 1), className: "font-semibold text-accent hover:underline" }, "Retry")
      ]) : null,
      j ? r("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, j) : null,
      !E && b.items.length === 0 ? r("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      E ? null : r("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, b.items.map((U) => r(Nu, {
        key: U.key,
        item: U,
        selected: U.key === p,
        busy: C === U.key,
        onSelect: () => k(U.key),
        onRestore: Ce,
        onPurge: xe
      })))
    ])
  ]);
}
function Cu({ onNavigate: e, profile: t }) {
  const [n, o] = B([]), [i, a] = B(""), [s, l] = B(0), [d, c] = B(!0), [u, f] = B(null), [y, b] = B(""), g = ge(null);
  async function p(m) {
    const F = await ee("/bin", m ? { signal: m } : void 0);
    return o(F.items || []), a(F.fingerprint || ""), l(Number(F.totalCount) || 0), F;
  }
  pe(() => {
    const m = new AbortController();
    return c(!0), p(m.signal).catch((F) => {
      F.name !== "AbortError" && b(F.message);
    }).finally(() => {
      m.signal.aborted || c(!1);
    }), () => m.abort();
  }, []), Oi(yo, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var m;
      return (m = g.current) == null ? void 0 : m.call(g);
    }
  }]);
  async function k(m) {
    var j;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    f(m.itemId), b("");
    const F = `restore:${m.itemId}:${m.revision}`, W = _e(F);
    try {
      const G = (E = !1) => ee(`/bin/${m.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: W, expectedRevision: m.revision, discardMissingImage: E })
      });
      try {
        await G(So(F));
      } catch (E) {
        if (((j = E.payload) == null ? void 0 : j.code) !== "missing-image" || !window.confirm(`${E.message}

Continue and discard the missing image reference?`)) throw E;
        ko(F), await G(!0);
      }
      He(F), await p(), Yn(), b("Segment restored with a new native ID.");
    } catch (G) {
      b(G.message || "Unable to restore the segment."), G.status === 409 && await p();
    } finally {
      f(null);
    }
  }
  async function C() {
    if (u == null)
      try {
        const m = await fa({
          items: n,
          fingerprint: i,
          totalCount: s
        }, () => {
          f(-1), b("");
        });
        if (m.status !== "emptied") return;
        await p(), Yn(), b(`${m.segmentCount} segment${m.segmentCount === 1 ? "" : "s"} from ${m.sceneCount} scene${m.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (m) {
        b(m.message || "Unable to empty the recycling bin."), m.status === 409 && await p();
      } finally {
        f(null);
      }
  }
  return g.current = C, r("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    r(To, {
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
        onClick: C,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, u === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    y ? r("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, y) : null,
    d ? r("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && n.length === 0 ? r("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...n.map((m) => r("article", { key: m.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      r("div", { key: "copy", className: "min-w-0 flex-1" }, [
        r("h2", { key: "title", className: "truncate font-semibold" }, `${m.tagName || "Tag segment"} · ${m.videoTitle || `Video ${m.videoId}`}`),
        r("p", { key: "time", className: "font-mono text-xs text-secondary" }, m.endSec == null ? Oe(m.startSec) : `${Oe(m.startSec)} – ${Oe(m.endSec)}`),
        r("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${m.sourceKey || "unknown"}`)
      ]),
      r("a", { key: "video", href: `/video/${m.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      r("button", { key: "restore", type: "button", disabled: u != null, onClick: () => k(m), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const Ai = "ext:com.midnightrider.segment-studio:videos";
async function $u(e, t, n, o) {
  const i = await md("/api/videos/find", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Rc(e, t, { fullMode: n })),
    signal: o
  }), a = Array.isArray(i == null ? void 0 : i.items) ? i.items : [], s = a.length > 0 ? await ee("/videos/segment-counts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoIds: a.map((d) => d.id) }),
    signal: o
  }) : { items: [] }, l = new Map(((s == null ? void 0 : s.items) ?? []).map((d) => [d.videoId, d]));
  return { items: a.map((d) => Ac(d, l.get(d.id))), totalCount: (i == null ? void 0 : i.totalCount) ?? 0 };
}
function Zr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: n = "editor",
  profile: o
}) {
  const i = t || n === "review", a = ze(() => {
    var de;
    const _ = Pi(Ai), te = (de = _ == null ? void 0 : _.uiOptions) == null ? void 0 : de.displayMode;
    return _ ? {
      ...Vt,
      defaultFilter: uo({ ...Vt.defaultFilter, ..._.findFilter || {} }),
      defaultObjectFilter: co(_.objectFilter || {}, { fullMode: i }),
      defaultDisplayMode: Vt.allowedDisplayModes.includes(te) ? te : Vt.defaultDisplayMode
    } : Vt;
  }, []), { filter: s, objectFilter: l, displayMode: d, setFilter: c, setObjectFilter: u, setDisplayMode: f } = Li(a), [y, b] = B({ items: [], totalCount: 0 }), [g, p] = B(!0), [k, C] = B(""), [m, F] = B(0), [W, j] = B(/* @__PURE__ */ new Set()), G = ge(0), E = ge(null), N = JSON.stringify(s), I = JSON.stringify(l);
  pe(() => {
    const _ = co(l, { fullMode: i });
    _ !== l && u(_);
    const te = uo(s);
    te !== s && c(te);
  }, [N, I, i]), pe(() => {
    E.current = null, j(/* @__PURE__ */ new Set());
  }, [N, I]), pe(() => {
    const _ = ++G.current, te = new AbortController();
    return p(!0), C(""), $u(s, l, i, te.signal).then((de) => {
      _ === G.current && b(de);
    }).catch((de) => {
      _ === G.current && de.name !== "AbortError" && C(de.message || "Unable to discover videos.");
    }).finally(() => {
      _ === G.current && p(!1);
    }), () => {
      G.current++, te.abort();
    };
  }, [N, I, i, m]);
  function S(_) {
    c({ ..._, page: _.page || 1 });
  }
  function M(_) {
    u(_), c({ ...s, page: 1 });
  }
  function K(_, te = !1) {
    j((de) => Mc(
      de,
      y.items.map((be) => be.videoId),
      _,
      E.current,
      te
    )), E.current = _;
  }
  function R() {
    E.current = null, j(new Set(y.items.map((_) => _.videoId)));
  }
  function A() {
    E.current = null, j(/* @__PURE__ */ new Set());
  }
  function z() {
    E.current = null, j((_) => new Set(y.items.map((te) => te.videoId).filter((te) => !_.has(te))));
  }
  const Y = ze(() => Ec(Ms), []);
  return r("div", { className: "w-full space-y-5" }, [
    r(To, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && n === "editor",
      profile: o
    }),
    r(ji, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      filterMode: "videos",
      savedFilterScope: Ai,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: s,
      onFilterChange: S,
      totalCount: y.totalCount,
      isLoading: g,
      error: k ? new Error(k) : null,
      onRetry: () => F((_) => _ + 1),
      sortOptions: Ds,
      displayMode: d,
      onDisplayModeChange: f,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: Y,
      objectFilter: l,
      supportsFilterExpressions: !0,
      onObjectFilterChange: M,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: i ? W : void 0,
      onSelectAll: i ? R : void 0,
      onSelectNone: i ? A : void 0,
      onInvertSelection: i ? z : void 0,
      // The host renders whatever extensions contribute for a video selection, so
      // Run AI here is the same action, and the same dialog, as the native videos
      // page. Only the contributed actions are rendered: Segment Studio's own
      // ownership and lineage rules govern deletion, so the native bulk mutations
      // that would bypass them stay out of this bar.
      selectionActions: i && W.size > 0 ? r(ad, { entityType: "video", selectedIds: W }) : null
    }, [
      !g && y.items.length === 0 ? r("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !g && d === "grid" ? r("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, y.items.map((_) => r(Dc, { key: _.videoId, item: _, onNavigate: e, showReviewStates: i, selected: W.has(_.videoId), selectionActive: W.size > 0, onSelect: i ? K : null }))) : null,
      !g && d === "list" ? r("section", { key: "rows", className: "space-y-3" }, y.items.map((_) => r(Oc, { key: _.videoId, item: _, onNavigate: e, showReviewStates: i, selected: W.has(_.videoId), selectionActive: W.size > 0, onSelect: i ? K : null }))) : null
    ])
  ]);
}
function Mi({
  videoId: e,
  onNavigate: t,
  compatibilityMode: n = !1,
  profile: o
}) {
  const [i, a] = B(null), [s, l] = B(!0), [d, c] = B(""), u = ge(0), f = ge(0), y = ge(e), b = mc();
  y.current = e;
  const [g] = B(() => Zs({
    beginRequest: () => ({ requestId: ++f.current, videoId: y.current }),
    fetchDetail: (j) => ee(p(j.videoId)),
    isCurrent: (j) => br(j.requestId, f.current, j.videoId, y.current),
    isSameVideo: (j) => j.videoId === y.current
  })), p = (j) => `/videos/${j}/editor`;
  async function k(j, G, E) {
    const N = await ee(p(G), E ? { signal: E.signal } : void 0);
    return br(j, E ? u.current : f.current, G, y.current) ? (a(N), !0) : !1;
  }
  pe(() => {
    const j = ++u.current, G = e, E = new AbortController();
    return a(null), l(!0), c(""), k(j, G, E).catch((N) => {
      br(j, u.current, G, y.current) && N.name !== "AbortError" && c(N.message || "Unable to load the editor.");
    }).finally(() => {
      br(j, u.current, G, y.current) && l(!1);
    }), () => {
      u.current++, f.current++, E.abort();
    };
  }, [e]);
  function C(j, G) {
    a((E) => (E == null ? void 0 : E.video.id) !== G ? E : typeof j == "function" ? j(E) : j);
  }
  function m() {
    return g({
      onLoaded: (j) => {
        a(j), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: (j) => c(j.message || "Unable to reload the latest segment.")
    });
  }
  function F() {
    return g({
      onLoaded: (j) => {
        a(j), c("");
      },
      onError: (j) => c(j.message || "Unable to reload performer slots.")
    });
  }
  function W() {
    return g({
      onLoaded: (j) => {
        a(j), c("");
      },
      onError: (j) => c(j.message || "Unable to load the new AI review results.")
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
      r(Ls, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      r("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? r(mu, {
      key: i.video.id,
      detail: i,
      onDetailChange: C,
      onConflict: m,
      onReload: F,
      onAnalysisCompleted: W,
      onSlotsChanged: F,
      splitLayout: b,
      profile: o,
      initialSegmentId: gi() ? -gi() : Yl(),
      compatibilityMode: n,
      onNavigate: t
    }) : null
  ]);
}
function Tu(e, t, n) {
  return t === "settings" || e === "settings" || t == null && e == null && n.replace(/\/+$/, "") === "/segment-studio/settings";
}
function Ru(e, t, n) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(n.replace(/\/+$/, ""));
}
function Eu(e, t, n) {
  return t === "bin" || e === "bin" || t == null && e == null && n.replace(/\/+$/, "") === "/segment-studio/bin";
}
function Au({
  id: e,
  slug: t,
  onNavigate: n,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = Ol(o), l = Tu(e, t, window.location.pathname), d = Ru(e, t, window.location.pathname), c = Eu(e, t, window.location.pathname), u = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (jl(u, o) === "videos" && u !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), r(Zr, {
      onNavigate: n,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return r(wu, {
    onNavigate: n,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return r(Ei, { onNavigate: n, profile: o });
    const b = Number(e);
    return Number.isInteger(b) && b > 0 ? r(Mi, {
      videoId: b,
      onNavigate: n,
      compatibilityMode: !0,
      profile: o
    }) : r(Zr, {
      onNavigate: n,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return r(Cu, { onNavigate: n, profile: o });
  const y = Number(e);
  return d ? r(Ei, { onNavigate: n, profile: o }) : Number.isInteger(y) && y > 0 ? r(Mi, {
    videoId: y,
    onNavigate: n,
    compatibilityMode: s === "review",
    profile: o
  }) : r(Zr, {
    onNavigate: n,
    mode: s,
    profile: o
  });
}
function Mu({ id: e, slug: t, onNavigate: n }) {
  const [o, i] = B(null), [a, s] = B("");
  return pe(() => {
    const l = new AbortController();
    return ee("/preferences", { signal: l.signal }).then((d) => i(ta(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? r("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? r("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : r(Au, {
    id: e,
    slug: t,
    onNavigate: n,
    profile: o,
    onProfileChange: i
  });
}
function Du(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const n = Number(t[0]);
  return Number.isInteger(n) && n > 0 ? `/segment-studio/${n}` : null;
}
function Ou(e, t) {
  const n = Du(t);
  return n ? (window.location.assign(n), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const am = {
  components: { SegmentStudioPage: Mu },
  actionHandlers: { openSegmentStudio: Ou }
};
export {
  au as ANALYSIS_RUN_CHECK_INTERVAL_MS,
  $n as CLEARED_SEGMENT_SELECTION_ID,
  Xt as SEGMENT_STUDIO_CAPABILITIES,
  yo as SEGMENT_STUDIO_EXTENSION_ID,
  tr as SEGMENT_STUDIO_SHORTCUTS,
  rl as activeEditorFilterCount,
  oc as addPendingChange,
  Md as applyDerivationRuleSlotSuggestions,
  Vn as applyFeedbackEditorDelta,
  sc as applyPendingChanges,
  xi as applySegmentMergeDelta,
  hd as basicSegmentTimelineStyle,
  Jl as browseClipEnd,
  sa as browseEditorHref,
  Wl as buildBrowseRequest,
  fu as buildDerivationRuleGraph,
  Rc as buildDiscoveryFindRequest,
  Ks as buildMinuteTimelineTicks,
  gu as buildPerformerSlotOverview,
  td as buildSegmentQuickSearchEntries,
  jd as buildSegmentRailRows,
  Fd as buildTimelineRows,
  Bu as buildTimelineTicks,
  qs as calculateCenteredTimelineScroll,
  to as calculateEditorPanelMaximum,
  zs as calculateMinuteLabelStride,
  Uu as calculateMinuteTimelineWidth,
  Js as calculateSwimlaneTitleMaximum,
  Ws as calculateTimelinePlayheadPosition,
  ho as calculateTimelineRatioBounds,
  Qs as calculateTimelineRatioFromPointer,
  Ku as calculateVerticalRevealOffset,
  ln as clampEditorPanelWidth,
  kr as clampSwimlaneTitleWidth,
  qi as clampTimelineRatio,
  vo as clampTimelineRatioForHeight,
  $r as clampTimelineZoom,
  kc as compactProvenanceSummary,
  lc as confirmPendingChange,
  Zs as createEditorReloader,
  wl as createQueuedReviewRequest,
  tc as createSaveQueue,
  lu as createSegmentAnalysisRequestScope,
  am as default,
  Ea as discardPendingChange,
  Ec as discoveryCriteria,
  pd as downloadFileNameFromContentDisposition,
  ol as dualRangeValueFromPointer,
  di as duplicateIdentityFromResponse,
  Cl as duplicateOperationKey,
  Ji as editorVisibilityIncludingSegment,
  Ud as expandedSwimlanes,
  Fl as extensionOwnedSegmentsModeSwitchPrompt,
  qd as feedbackFrameTimestamps,
  Vd as feedbackResultMatchesAction,
  Wd as feedbackSelectionPlan,
  nl as filterDerivedSegments,
  Vr as filterEditorSegments,
  pu as filterPerformerSlotOverview,
  ed as filterSegmentQuickSearch,
  Wu as filterSegmentStudioShortcuts,
  _d as findAdjacentSegmentGroupKey,
  Ml as findAdjacentShot,
  xl as findEditorShortcut,
  Hi as findInitialSegmentSelection,
  Us as findNearestSegmentInCurrentSwimlane,
  Nr as findNextUnprocessed,
  Al as findPublishedSelectionIdentity,
  rt as findSegmentByStableIdentity,
  Xs as findSegmentFromPlayhead,
  Bs as findSegmentNearPlayhead,
  zd as findSwimlaneRangeSelection,
  lo as findSwimlaneSelection,
  Xl as findUniquePerformerSlotAssignment,
  Cr as findUnreviewedSelection,
  $d as focusDialogDefaultButton,
  Dr as formatGenderHint,
  Dl as frameStepSeconds,
  la as generatePerformerSlotAssignmentRecommendations,
  _c as groupApprovedDraftsForPublishing,
  Zl as groupAutoAssignCandidates,
  Jd as groupIncorrectExamplesByTag,
  Jc as groupMaterializationOutputs,
  cn as groupSegmentsIntoSwimlanes,
  Gd as groupSelectedSwimlanes,
  Co as groupSwimlanesBySegmentGroup,
  Tt as handleModalKey,
  Sa as hasGroupedSwimlanes,
  En as hasSegmentStudioCapability,
  Ta as heldTagChangeFor,
  El as heldTagReady,
  ki as hideCollectedFeedbackSegments,
  hi as historyActionsForTarget,
  vr as incorrectExampleHistoryState,
  xa as indexPerformerSlotsBySegment,
  Yu as initialReviewFilter,
  Xd as insertSegmentProjection,
  br as isCurrentEditorRequest,
  wd as isEditableTarget,
  Xu as isEditorShortcutOwner,
  ec as isKindRunning,
  im as isSaveQueueBusy,
  Eu as isSegmentStudioBinRoute,
  Ru as isSegmentStudioSegmentsRoute,
  Tu as isSegmentStudioSettingsRoute,
  yu as layoutDerivationRuleComponent,
  bu as layoutDerivationRuleComponents,
  Zd as mergeSegmentsProjection,
  zl as migrateLegacyBrowseFilter,
  co as migrateLegacyDiscoveryFilter,
  uo as migrateLegacyDiscoverySort,
  Ed as multiSelectionActionHint,
  on as normalizeCollapsedSegmentGroups,
  Ar as normalizeDiscoveryIds,
  Dt as normalizeEditorSegmentFilters,
  nn as normalizeGender,
  ci as normalizeReviewFilter,
  ta as normalizeSegmentStudioFeatureProfile,
  Vu as normalizeSegmentStudioMode,
  io as normalizeSegmentStudioPublicMode,
  Ys as parseEditorLayout,
  el as parseHideDerivedSegmentsPreference,
  tl as parseMergeConfirmationPreference,
  Zi as parsePlaybackShortcutConfig,
  hl as parseShortcutBindingOverrides,
  en as patchPerformerSlotProjection,
  tm as patchSegmentProjection,
  dc as pendingChangesReducer,
  ic as pendingInsertedSegments,
  gl as percentageSeekTime,
  Ql as performInitialSegmentSeek,
  ct as performerOptionId,
  Tr as performerSlotHistoryState,
  Rt as performerSlotLabel,
  Dd as performerSlotPresentation,
  em as performerSlotStatus,
  Io as performerSlotStatusFromSegmentSlots,
  va as performerSlotsForSegment,
  zt as provenanceSourceLabel,
  Ma as prunePendingChanges,
  Rl as queueCreatedSegmentTagChoice,
  da as rankPerformerOptions,
  Hd as reconcileSegmentGroupKey,
  cl as reconcileSelectedSegmentIds,
  Pc as recyclingBinActionText,
  yd as recyclingBinDeletionPrompt,
  pa as recyclingBinDeletionSummary,
  Gl as recyclingBinModeSwitchPrompt,
  Ju as removeQueuedReviewsForSegments,
  nm as removeSegmentsProjection,
  gi as requestedOwnedItemId,
  Yl as requestedSegmentId,
  al as resolveEditorSegmentSelection,
  Nl as resolveQueuedReviewRequest,
  $l as resolveSegmentCreationAction,
  jl as resolveSegmentStudioRoute,
  vl as resolveSegmentStudioShortcuts,
  Ca as resolveSegmentTarget,
  hu as resolveSelectedDerivationRule,
  ai as resolveSelectedSegments,
  Zc as restoreDisabledToolbarActionFocus,
  uu as restorePublishApprovedFocus,
  rm as restoreSegmentFieldsProjection,
  om as restoreSegmentsProjection,
  ac as retargetPendingChanges,
  Ia as revealCollapsedSegmentGroup,
  An as sameSegmentIdentity,
  $a as savingSegmentIdFrom,
  ya as segmentBadgeStyle,
  Mr as segmentGroupHeaderBackground,
  Ut as segmentGroupKeyForSegment,
  No as segmentHistoryIdentity,
  hr as segmentHistoryState,
  Ct as segmentIdentity,
  ba as segmentRailItemStyle,
  Qu as segmentStateStyle,
  Du as segmentStudioActionTarget,
  Ol as segmentStudioLegacyMode,
  bd as segmentTimelineStyle,
  Mt as segmentsHistoryState,
  ul as selectAllVideoSegmentIds,
  _l as selectedBrowseStates,
  wa as selectedSwimlaneMerge,
  wr as selectionReferenceForSegment,
  Oa as setBackLinkNavigation,
  Aa as settlePendingChange,
  Td as sharedPerformerSlotShape,
  Rd as sharedTagPerformerSlotShape,
  Rn as shortcutAvailableInMode,
  Sl as shortcutBindingDisplayText,
  zu as shortcutBindingFromEvent,
  Hu as shortcutBindingsOverlap,
  qu as shortcutModesOverlap,
  bl as shortcutRequiresSingleSegment,
  Yr as shotBoundaryFingerprint,
  Cd as shouldAcceptCurrentTagFromEnter,
  Id as shouldDismissPopover,
  _u as shouldExitShortcutCapture,
  Zu as shouldHandleEditorShortcut,
  su as shouldLoadSegmentAnalysis,
  Ci as shouldReloadAfterSegmentMutation,
  oo as shouldRestoreTransitionSelection,
  nd as shouldShowQuickSearchGroups,
  Bl as slottedPerformerCriterion,
  si as splitShortcutCategoriesIntoColumns,
  du as startCompletedRunWatch,
  Ad as suggestDerivationRuleSlotMappings,
  Zn as swimlaneDisplayLabel,
  kd as swimlaneMarkerTop,
  xd as swimlaneStripeBackground,
  Tl as tagEditorLockedBySave,
  $o as targetsOverlap,
  Vs as timelineContentStyle,
  ni as timelinePlayheadHorizontalStyle,
  vd as timelineSegmentWidth,
  _s as timelineTickAlignment,
  Hs as timelineTickPosition,
  eo as timelineTimePercent,
  Ac as toDiscoveryItem,
  Kd as toggleAllCollapsedSegmentGroups,
  kl as toggledSelectionReviewState,
  Yt as trapModalFocus,
  cd as tryParseJsonResponseText,
  dl as updateAnchoredSegmentSelection,
  Mc as updateDiscoverySelection,
  il as updateDualRangeValues,
  sl as updateSegmentCollectionSelection,
  ll as updateSegmentRangeSelection,
  Yi as updateSegmentSelection,
  Ri as validateDerivationRuleDraft,
  ti as validateSegmentTiming,
  xo as videoPerformerOptions,
  Xr as videoPerformerSlotAssignments,
  Ll as visibleSegmentStudioSettingsTabs,
  Pl as visibleSegmentStudioTabs,
  ka as visibleVirtualRows,
  Vl as withoutSlottedPerformers
};
