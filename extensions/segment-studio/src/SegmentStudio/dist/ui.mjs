import lo from "@cove/runtime/react";
import { createPortal as Is } from "@cove/runtime/react-dom";
import { extensionFetch as co } from "@cove/runtime/api";
import * as Mi from "@cove/runtime/components";
import { formatDuration as Cs, EntityReferenceSelector as Vn, useExtensionKeyboardBindings as $s, VideoPlayer as Di, useRegisterExtensionKeyboardActions as Oi, getDefaultFilter as Pi, useListUrlState as Li, ListPage as Fi, VIDEO_CRITERIA as Ts, VIDEO_SORT_OPTIONS as Rs } from "@cove/runtime/components";
import { StepBack as As, StepForward as Es, Loader2 as Ms } from "@cove/runtime/lucide-react";
const uo = "com.midnightrider.segment-studio", Ds = "segment-studio-editor", ji = "segment-studio.layout.v1", ln = "segment-studio.operations.v1", Gi = "segment-studio.collapsed-segment-groups.v1", Bi = "segment-studio.playback-shortcuts.v1", Ui = "segment-studio.timing-clipboard.v1", Ki = "segment-studio.hide-derived-segments.v1", zi = "segment-studio.merge-confirmation.v1", Nt = ["unreviewed", "approved", "rejected"], Os = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], Wo = "(min-width: 1024px) and (min-height: 640px)", Vo = "(min-width: 1024px) and (min-height: 900px)", Jn = 1e-3, Jo = 15, Ps = 30, _i = 12, Tt = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, mo = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30
}, Yt = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function Yo(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function Hi(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? kr(e, null, 1, !0) ?? r[0] ?? null;
}
function kr(e, t, r, o = !1) {
  var m;
  const i = e.findIndex((p) => p.markers.some((y) => y.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const p = e.flatMap((y) => y.markers.map((h) => h.segment)).filter((y) => y.reviewState === "unreviewed");
    return r < 0 ? p.at(-1) ?? null : p[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((p) => p.segment.id === t);
  if (!o)
    return ((m = (r < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((y) => y.segment.reviewState === "unreviewed")) == null ? void 0 : m.segment) ?? null;
  const l = e.flatMap((p) => p.markers.map((y) => y.segment)), d = l.findIndex((p) => p.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((p) => p.reviewState === "unreviewed") ?? null;
}
function Ls(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((m, p) => m.markers.filter(({ segment: y }) => {
    const h = Number(y.startSec), g = y.endSec == null ? h + Ps : Number(y.endSec);
    return Number.isFinite(h) && Number.isFinite(g) && g >= h && h <= i + Jo + Jn && g >= i - Jo - Jn;
  }).map(({ segment: y }) => ({ segment: y, laneIndex: p }))).sort((m, p) => m.laneIndex - p.laneIndex || Math.abs(m.segment.startSec - i) - Math.abs(p.segment.startSec - i) || m.segment.id - p.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((m) => m.markers.some((p) => p.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((m) => m.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((m) => m.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((m) => m.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function Fs(e, t, r) {
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
function wr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function $u(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function js(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function Tu(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function Gs(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function Bs(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Us(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function Ks(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Yr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function zs(e, t, r = 10) {
  const o = Yr(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function Qo(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function _s(e, t = _i) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function qi(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : Tt.timelineRatio;
}
function Qr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function an(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? Tt.detailWidth : Math.min(Qr(t, 0), Math.max(240, e));
}
function hr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? Tt.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function Hs(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function go(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: Tt.timelineRatio, maximum: Tt.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function po(e, t) {
  const r = qi(e);
  if (!(t > 0)) return r;
  const o = go(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function qs(e) {
  if (!e) return { ...Tt };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? qi(r) : Tt.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: an(t == null ? void 0 : t.detailWidth),
      markerRailWidth: an(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: hr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...Tt };
  }
}
function Ws(e, t, r) {
  return r > 0 ? po((t + r - e) / r, r) : Tt.timelineRatio;
}
function Ru(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function Vs(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, m) => c.startSec - m.startSec || c.id - m.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= Jn ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function gr(e, t, r, o) {
  return e === t && r === o;
}
function Js({ beginRequest: e, fetchDetail: t, isCurrent: r, isSameVideo: o }) {
  let i = null, a = null;
  return function({ onLoaded: l, onError: d }) {
    const c = e(), m = (async () => {
      try {
        const p = await t(c);
        if (r(c))
          return l(p), p;
      } catch (p) {
        if (r(c))
          return d(p), null;
      }
      return o(c) && i !== m && a.videoId === c.videoId ? i : null;
    })();
    return i = m, a = c, m;
  };
}
const In = "__segment-studio-cleared-selection__";
function Ys(e) {
  return e === "true";
}
function Qs(e) {
  return e !== "false";
}
function Wi() {
  try {
    return Qs(window.localStorage.getItem(zi));
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
function Zs(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function Dt(e = {}) {
  const t = Nt.filter((m) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(m) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (m, p) => {
    const y = Number(m);
    return Number.isFinite(y) ? Math.min(1, Math.max(0, y)) : p;
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
function zr(e, t, r, o = !1, i = []) {
  var c, m;
  const a = Dt(r), s = a.performerId == null ? null : new Set((t || []).filter((p) => Number(p.performerId) === a.performerId).map((p) => p.segmentId)), l = new Set((i || []).flatMap((p) => p.tags || []).map((p) => Number(p.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((m = (c = (i || []).find((p) => Number(p.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : m.map((p) => Number(p.tagId))) || []);
  return Zs(e || [], o).filter((p) => {
    if (p.reviewState != null && !a.reviewStates.includes(p.reviewState) || s && !s.has(p.id) || a.tagId != null && Number(p.tagId) !== a.tagId || d && !d.has(Number(p.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(p.tagId)) || a.sourceKey != null && p.sourceKey !== a.sourceKey) return !1;
    const y = Number(p.confidence);
    return p.confidence == null || !Number.isFinite(y) ? a.includeUnscored : y >= a.confidenceMin && y <= a.confidenceMax;
  });
}
function Ji(e, t, r, o = !1, i = []) {
  var l;
  const a = Dt(r);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = Dt({
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
    filters: Dt(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function Xs(e, t = !1) {
  const r = Dt(e);
  return +(r.reviewStates.length !== Nt.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function el(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function tl(e, t, r, o) {
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
function nl(e, t, r = null, o = {}) {
  if (t === In) return null;
  const i = t ?? r, a = (e || []).flatMap((s) => (s.markers || []).map((l) => l.segment)).find((s) => s.id === i);
  if (a) return a;
  if (o.reference) {
    const s = o.visibleLanes ?? e;
    return s.flatMap((d) => (d.markers || []).map((c) => c.segment)).find((d) => d.id === o.reference.id) ?? xr(s, o.reference);
  }
  return Hi(e);
}
function Yi(e, t, r, o = !1) {
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
function rl(e, t, r) {
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
function ol(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return Yi(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function il(e, t, r = null, o = !1) {
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
    const p = o ? [.../* @__PURE__ */ new Set([...l, ...i])] : l;
    return {
      ...ol(p, s, t, m, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: p
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
    rangeBaseSegmentIds: d.selectedSegmentIds.filter((m) => m !== c)
  };
}
function al(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function sl(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function Zo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function Xo(e, t, r, o = () => !0) {
  return (e || []).map((i) => i.segment).filter((i) => i && !r.has(i.id) && o(i)).sort((i, a) => Zo(t, i) - Zo(t, a) || Math.abs(Number(i.startSec) - Number(t.startSec)) - Math.abs(Number(a.startSec) - Number(t.startSec)) || Number(i.startSec) - Number(a.startSec) || Number(i.id) - Number(a.id))[0] ?? null;
}
function Zr(e, t) {
  return ((e == null ? void 0 : e.markers) || []).map((r) => r.segment).filter((r) => r && !t.has(r.id));
}
function _r(e) {
  return e.reviewState === "unreviewed";
}
function ei(e, t) {
  const r = Number(e.startSec) || 0;
  return r !== t.startSec ? r > t.startSec : Number(e.id) > Number(t.id);
}
function ti(e, t, r, o, i) {
  if (t < 0)
    return Xo(e.flatMap((s) => s.markers || []), r, o, i);
  const a = e.map((s, l) => ({ lane: s, index: l })).filter(({ lane: s }) => Zr(s, o).some(i)).sort((s, l) => Math.abs(s.index - t) - Math.abs(l.index - t) || +(s.index < t) - +(l.index < t) || s.index - l.index);
  for (const { lane: s } of a) {
    const l = Xo(s.markers, r, o, i);
    if (l) return l;
  }
  return null;
}
function vr(e, t) {
  var a;
  const r = (e || []).find((s) => (s.markers || []).some(({ segment: l }) => l.id === t)), o = (a = r == null ? void 0 : r.markers.find((s) => s.segment.id === t)) == null ? void 0 : a.segment;
  if (!o) return null;
  const i = Number(o.startSec) || 0;
  return {
    laneKey: r.key,
    id: o.id,
    startSec: i,
    endSec: Number(o.endSec ?? i) || i
  };
}
function xr(e, t, r = {}) {
  const o = e || [];
  if (o.length === 0) return null;
  const i = new Set(r.removedIds || []);
  if (t == null) {
    const s = { markers: o.flatMap((d) => d.markers || []) }, l = Zr(s, i);
    return l.find(_r) ?? l[0] ?? null;
  }
  i.add(t.id);
  const a = o.findIndex((s) => s.key === t.laneKey);
  if (a >= 0) {
    const s = Zr(o[a], i).filter(_r), l = s.find((c) => ei(c, t));
    if (l) return l;
    const d = s.filter((c) => !ei(c, t)).at(-1);
    if (d) return d;
  }
  return ti(o, a, t, i, _r) ?? ti(o, a, t, i, () => !0);
}
function ll(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function ni(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function dl() {
  try {
    return Ys(window.localStorage.getItem(Ki));
  } catch {
    return !1;
  }
}
function cl(e) {
  try {
    window.localStorage.setItem(Ki, String(!!e));
  } catch {
  }
}
const Zn = [
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
function Qi(e) {
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
    const r = new Set(Zn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(Qi).filter(Boolean)]));
  } catch {
    return {};
  }
}
function pl(e = {}) {
  const t = gl(e);
  return Zn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function ri(e, t = 2) {
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
function Au(e) {
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
function Eu(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function Xr(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function oi(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function Mu(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = oi(e.code, t.key), a = oi(t.code, e.key);
  if (!r && !o && !i && !a) return !1;
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
          if (Xr(y, e) && Xr(y, t)) return !0;
        }
  return !1;
}
function Cn(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function Du(e, t) {
  return [!1, !0].some((r) => Cn(e, r) && Cn(t, r));
}
function fl(e, t = !1, r = {}) {
  return pl(r).find((o) => Cn(o, t) && o.bindings.some((i) => Xr(e, i))) || null;
}
function Zi(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function yl(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Zi).join(" / ") : "Unassigned";
}
function Ou(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, yl(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function Pu(e) {
  return e === "review" ? "review" : "editor";
}
function rt(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
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
  const r = e.identities.map((i) => rt(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: rt(t, e.activeIdentity) || r[0]
  };
}
function xl(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function Lu(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => xl(o, i))));
}
function ii(e, t) {
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
function Il({ tagEditing: e, selectedSegmentIds: t, activeSegmentId: r }, o) {
  return !(e && r === o && (t == null ? void 0 : t.length) === 1 && t[0] === o);
}
function eo(e, t) {
  return e === t;
}
function Cl(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function $l(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - Jn).at(-1) || null : o.find((i) => i.startSec > t + Jn) || null;
}
function Hr(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function ai(e) {
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
function Fu(e, t = null, r = !1) {
  const o = ai(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function wn(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function Xi(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: wn(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: wn(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: wn(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(wn(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(wn(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(wn(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...mo };
  }
}
function Tl(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function ea() {
  try {
    return Xi(window.localStorage.getItem(Bi));
  } catch {
    return { ...mo };
  }
}
function si(e) {
  const t = Xi(JSON.stringify(e));
  try {
    window.localStorage.setItem(Bi, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Qt = Object.freeze({
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
function to(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function ta(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? to(e.requestedMode) : "basic",
    effectiveMode: i ? to(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function $n(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function Rl(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Al(e) {
  const t = [];
  return $n(e, Qt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), $n(e, Qt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function El(e) {
  return [
    ["general", "General", Qt.settingsGeneral],
    ["shortcuts", "Shortcuts", Qt.settingsShortcuts],
    ["performer-slots", "Performer slots", Qt.settingsPerformerSlots],
    ["derivation", "Derivation", Qt.settingsDerivation]
  ].filter(([, , r]) => $n(e, r)).map(([r, o]) => [r, o]);
}
function Ml(e, t) {
  return e === "segments" && !$n(
    t,
    Qt.navigationSegmentInventory
  ) || e === "bin" && !$n(
    t,
    Qt.recyclingBinView
  ) ? "videos" : e;
}
function Dl(e) {
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
const qr = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, li = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: Nt.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function Pl(e) {
  const t = String(e || "").split(",").filter((r) => Nt.includes(r));
  return t.length === 0 ? [...Nt] : [...new Set(t)];
}
function Nn(e) {
  return na(e).values;
}
function na(e) {
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
function Wr(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function di(e, t) {
  var l;
  const r = ci(t.activitiesCriterion, t.activityId), o = ci(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = na(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: Ll(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function ci(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function Ll(e, t) {
  return Nt.includes(e == null ? void 0 : e.value) ? [e.value] : Pl(t);
}
function ra(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Fl(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function jl(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function ui(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Gl(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function ct(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function fo(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Vr(e, t) {
  const r = new Set(fo(t).map((o) => String(ct(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function en(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function mi(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(en).sort().join(",")}`;
}
function oa(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((h) => String(h.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((h) => {
    var g;
    return !((g = h.genderHints) != null && g.length);
  }) && e.length === t.length && !i) {
    const h = [...e].sort((f, k) => String(f.slotDefinitionId).localeCompare(String(k.slotDefinitionId))), g = [...t].sort((f, k) => String(f.name).localeCompare(String(k.name)) || Number(ct(f)) - Number(ct(k)));
    return [{
      assignments: Object.fromEntries(h.map((f, k) => [String(f.slotDefinitionId), String(ct(g[k]))])),
      description: g.map((f) => f.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((h) => t.map((g, f) => ({ performer: g, index: f })).filter(({ performer: g }) => {
    var f;
    return !((f = h.genderHints) != null && f.length) || h.genderHints.some((k) => en(k) === en(g.gender || g.genderIdentity));
  }).map(({ index: g }) => g)), m = i ? c.filter((h) => h.length > 0).length : gi(c, t.length);
  if (m === 0) return [];
  const p = new Map(t.map((h, g) => [String(ct(h)), g]));
  function y(h, g, f) {
    if (s.length >= a) return;
    const k = c.slice(h), C = i ? k.filter((G) => G.length > 0).length : gi(k.map((G) => G.filter((B) => !g.has(String(ct(t[B]))))), t.length);
    if (f + C < m) return;
    if (h === e.length) {
      if (f !== m) return;
      const G = Object.fromEntries(d.map(({ slot: R, performer: I }) => [String(R.slotDefinitionId), I ? String(ct(I)) : ""])), B = o.length === 0 ? Object.values(G).sort().join(",") : [...new Set(e.map((R) => String(R.label || "")))].map((R) => `${R}:${d.filter(({ slot: I }) => String(I.label || "") === R).map(({ performer: I }) => I ? String(ct(I)) : "").sort().join(",")}`).join("|");
      !l.has(B) && s.length < a && (l.add(B), s.push({
        assignments: G,
        description: d.map(({ slot: R, performer: I }) => o.length ? `${R.label}: ${(I == null ? void 0 : I.name) || "Unassigned"}` : (I == null ? void 0 : I.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const u = e[h], j = [...d].reverse().find(({ slot: G }) => mi(G) === mi(u)), W = j ? p.get(String(ct(j.performer))) : -1;
    for (const G of c[h]) {
      const B = t[G], R = ct(B);
      if (!(G < W) && !(R == null || !i && g.has(String(R))) && (d.push({ slot: u, performer: B }), i || g.add(String(R)), y(h + 1, g, f + 1), i || g.delete(String(R)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: u, performer: null }), y(h + 1, g, f), d.pop();
  }
  return y(0, /* @__PURE__ */ new Set(), 0), s;
}
function gi(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Bl(e, t) {
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
      const p = [...new Set(e.map((y) => y.label || ""))].map((y) => `${y}:${a.filter((h) => (h.slot.label || "") === y).map((h) => h.performer.performerId).sort((h, g) => h - g).join(",")}`).join("|");
      i.has(p) || i.set(p, [...a]);
      return;
    }
    const c = e[l];
    for (const p of t)
      !o && d.has(p.performerId) || (m = c.genderHints) != null && m.length && !c.genderHints.some((y) => en(y) === en(p.gender)) || (a.push({ slot: c, performer: p }), o || d.add(p.performerId), s(l + 1, d), o || d.delete(p.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Ul(e) {
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
function Kl(e, t, r = 20) {
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
function zl(e) {
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
function ia(e, t, r) {
  const o = ct, i = new Set((t || []).map(o)), a = new Set((r || []).map(en));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), m = d.isVideoPerformer ?? i.has(o(d));
    if (c !== m) return m - c;
    const p = en(l.gender || l.genderIdentity), y = en(d.gender || d.genderIdentity), h = l.matchesGenderHint ?? a.has(p);
    return (d.matchesGenderHint ?? a.has(y)) - h || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
function Hl() {
  return null;
}
function ql(e) {
  return typeof e == "function" || typeof e == "object" && e !== null && "$$typeof" in e;
}
function aa(e, t) {
  const r = e[t];
  return ql(r) ? r : Hl;
}
const Wl = aa(Mi, "ExtensionEntityActions"), Vl = aa(Mi, "ExtensionSelectionActions"), { useEffect: ge, useId: sa, useLayoutEffect: pi, useMemo: ze, useReducer: Jl, useRef: me, useState: U, useSyncExternalStore: Yl } = lo, n = lo.createElement, la = "/api/plugins/segment-studio";
function _e(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(ln) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = no();
    return t[e] = r, window.localStorage.setItem(ln, JSON.stringify(t)), r;
  } catch {
    return no();
  }
}
function He(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(ln) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(ln, JSON.stringify(t));
  } catch {
  }
}
function yo(e) {
  try {
    return JSON.parse(window.localStorage.getItem(ln) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function bo(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(ln) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(ln, JSON.stringify(t));
  } catch {
  }
}
function Ql(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function Zl(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function ee(e, t, r = 0) {
  var d;
  const o = await co(`${la}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Ql(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await Zl(250 * (r + 1), t == null ? void 0 : t.signal), ee(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function Xl(e, t) {
  const r = await co(e, t);
  if (!r.ok) {
    const o = await r.json().catch(() => null);
    throw new Error((o == null ? void 0 : o.error) || (o == null ? void 0 : o.detail) || (o == null ? void 0 : o.title) || "Unable to load Cove data.");
  }
  return r.json();
}
async function ed(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${la}${e}`, o = await co(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: td(
      o.headers.get("Content-Disposition")
    )
  };
}
function td(e, t = "segment-studio-ai-feedback.zip") {
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
function De(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function no() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function da(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function nd(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function ca(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function rd(e, t) {
  const { sceneCount: r, segmentCount: o } = ca(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function ua(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = ca(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(rd(r, o.segmentCount)))
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
function fi({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const Ut = {
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
function ju(e, t) {
  return {
    ...(Ut[e] || Ut.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function ma(e) {
  return { ...(Ut[e] || Ut.unreviewed).badge };
}
function ga(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const pa = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function od(e, t, r = "not-applicable", o = !1) {
  const i = Ut[e] || Ut.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function id(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function ad(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function sd(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function ld(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function $r(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function dd(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function dn({ state: e, includeLabel: t = !0 }) {
  const r = Ut[e] || Ut.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: ma(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function cd(e, t = null) {
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
function Gu(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function ud(e, t = document) {
  return !(e.defaultPrevented || cd(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function Bu(e, t = document, r = !1, o = {}) {
  return ud(e, t) ? fl(e, r, o) != null : !1;
}
function md(e, t, r = null) {
  return !(!t || e instanceof Element && (t.contains(e) || r != null && r.contains(e)));
}
function Rt(e, { onCancel: t, onConfirm: r } = {}) {
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
function gd(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function pd({ confirm: e, cancel: t, confirmReady: r }) {
  const o = r && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function ho({ confirmRef: e, cancelRef: t, confirmReady: r }) {
  ge(() => {
    const o = requestAnimationFrame(() => pd({
      confirm: e.current,
      cancel: t == null ? void 0 : t.current,
      confirmReady: r
    }));
    return () => cancelAnimationFrame(o);
  }, [r]);
}
function Jt(e) {
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
function yi(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? i.filter((a) => a.sequence > o && a.sequence <= r).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > r && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function vo(e, t = !0) {
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
function pr(e, t = !0) {
  return {
    type: "segment",
    identity: vo(e, t),
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
    segments: (e || []).map((r) => ({
      identity: vo(r, t),
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
function fr(e, t) {
  return {
    type: "incorrectExamples",
    collected: t,
    entries: (e || []).map(({ segment: r, result: o, example: i }) => ({
      exampleId: (o == null ? void 0 : o.exampleId) ?? (i == null ? void 0 : i.id) ?? null,
      originalIdentity: vo(r),
      collectedIdentity: {
        itemId: (o == null ? void 0 : o.itemId) ?? (i == null ? void 0 : i.itemId) ?? null,
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
function fa(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function ya(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = t.get(r.segmentId);
    o ? o.push(r) : t.set(r.segmentId, [r]);
  }
  for (const r of t.values())
    r.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function xo(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function fd(e, t) {
  const r = (t || []).map((i) => fa(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: It(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function yd(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : fd(e, t);
}
function bd({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function Uu(e, t) {
  return xo(fa(e, t));
}
function It(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function hd(e, t) {
  const r = (d) => It(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
    const c = /* @__PURE__ */ new Map();
    for (const m of d || []) {
      const p = r(m);
      c.has(p) || c.set(p, []), c.get(p).push(m);
    }
    return c;
  }, a = i(e), s = i(t), l = [];
  for (const [d, c] of a) {
    const m = s.get(d);
    if (!m || c.length !== m.length)
      continue;
    const p = [...c].sort(o), y = [...m].sort(o);
    p.forEach((h, g) => l.push({
      sourceSlotDefinitionId: h.id,
      derivedSlotDefinitionId: y[g].id
    }));
  }
  return l;
}
function vd(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = hd(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function xd(e) {
  const t = It(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(Tr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function Tr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function Ir(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function bi(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((m) => m.end <= s && m.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: Ir(o),
    trackCount: Math.max(1, t.length)
  };
}
function Sd(e) {
  const t = e.map(It), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function kd(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], m = d.length > 0 && d.every((p) => Number(p.performerId) > 0) ? d.map((p) => `${p.slotDefinitionId}:${Number(p.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: m };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [bi({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = Sd(l.slots), m = l.slots.filter((f) => !a.has(String(f.slotDefinitionId))), p = o.length === 1 ? l.slots : m, y = p.map((f) => `${c.get(String(f.slotDefinitionId))} · ${f.performerName || `Performer ${f.performerId}`}`).join(" · "), h = [...new Map(p.map((f) => [
          Number(f.performerId),
          { id: Number(f.performerId), name: f.performerName || `Performer ${f.performerId}` }
        ])).values()], g = l.slots.map((f) => ({
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
          performerAssignments: g,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(bi);
}
function sn(e, t = [], r = []) {
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
      const m = o.get(s.tagId);
      i.set(d, {
        key: d,
        tagId: s.tagId,
        label: l,
        // A segment shown with a new tag has no sort name yet; the group catalog knows it.
        tagSortName: s.tagSortName || (m == null ? void 0 : m.tagSortName) || null,
        segmentGroupId: (m == null ? void 0 : m.segmentGroupId) ?? null,
        segmentGroupName: (m == null ? void 0 : m.segmentGroupName) ?? null,
        segmentGroupSortOrder: (m == null ? void 0 : m.segmentGroupSortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (m == null ? void 0 : m.segmentGroupTagSortOrder) ?? Number.MAX_SAFE_INTEGER,
        segments: []
      });
    }
    i.get(d).segments.push(s);
  }
  const a = /* @__PURE__ */ new Map();
  for (const s of r || [])
    a.has(s.segmentId) || a.set(s.segmentId, []), a.get(s.segmentId).push(s);
  for (const s of a.values())
    s.sort((l, d) => l.sortOrder - d.sortOrder || String(l.slotDefinitionId).localeCompare(String(d.slotDefinitionId)));
  return [...i.values()].sort((s, l) => s.segmentGroupSortOrder - l.segmentGroupSortOrder || s.segmentGroupTagSortOrder - l.segmentGroupTagSortOrder || (s.tagSortName || s.label).localeCompare(l.tagSortName || l.label, void 0, {
    sensitivity: "base"
  }) || s.key.localeCompare(l.key)).flatMap((s) => kd(s, a));
}
function So(e) {
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
    for (const s of Nt)
      a.counts[s] += Number((r = o.counts) == null ? void 0 : r[s]) || 0;
  }
  return t;
}
function ba(e) {
  return (e || []).some((t) => t.id != null);
}
const wd = {
  group: 38,
  lane: 33,
  segment: 41
};
function Nd(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = wd[s.kind];
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
function ha(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function Id(e, t = [], r = !0) {
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
function Cd(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: Ir(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return So(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: Ir(a)
    };
  });
}
function va(e, { nativeOnly: t = !1 } = {}) {
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
function hi(e, t) {
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
function nn(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function Yn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function $d(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var r;
    return (r = t[0]) == null ? void 0 : r.toUpperCase();
  }).join("") || "?";
}
function Qn({ performer: e, compact: t = !1, tooltip: r = null }) {
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
    }, o ? $d(e.name) : "—"),
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
function xa({ assignments: e, className: t = "" }) {
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
      n(Qn, {
        key: `${r.key}:avatar`,
        performer: r.performer
      })
    ];
  }));
}
function Rr({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = me(null), i = `performer-slots-${sa()}`, [a, s] = U(null);
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
  ge(() => {
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
    ...e.slice(0, 3).map((c) => n(Qn, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? Is(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(xa, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : n("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => n(Qn, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function Td(e, t) {
  const r = new Set(nn(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function Sa(e, t) {
  return t ? nn(e).filter((r) => r !== t) : nn(e);
}
function Rd(e, t) {
  const r = nn(t), o = new Set(nn(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function Bt(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function vi(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), m = Number.isFinite(c) && c >= d ? c : d, p = d <= o && m >= o, y = p ? 0 : Math.min(Math.abs(o - d), Math.abs(o - m));
    return { contains: p, distance: y, duration: m - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function ro(e, t, r, o = null) {
  var m, p, y, h, g, f;
  const i = e.findIndex((k) => k.markers.some((C) => C.segment.id === t));
  if (i < 0) {
    const k = [...((m = e[0]) == null ? void 0 : m.markers) || []];
    return o != null && Number.isFinite(Number(o)) && k.sort((C, u) => vi(C, u, o)), ((p = k[0]) == null ? void 0 : p.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((k) => k.segment.id === t);
  if (r === "left" || r === "right") {
    const k = r === "left" ? -1 : 1, C = Math.min(a.markers.length - 1, Math.max(0, s + k));
    return ((y = a.markers[C]) == null ? void 0 : y.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((h = a.markers[s]) == null ? void 0 : h.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((g = a.markers[s]) == null ? void 0 : g.segment) ?? null : ((f = [...e[l].markers].sort(c ? (k, C) => vi(k, C, Number(o)) : (k, C) => Math.abs(k.segment.startSec - d) - Math.abs(C.segment.startSec - d) || k.segment.startSec - C.segment.startSec || k.segment.id - C.segment.id)[0]) == null ? void 0 : f.segment) ?? null;
}
function Ad(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = ro([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function Ed(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function Md(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function Dd(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [ki(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => ki(Math.min(s, r + l))))];
}
function Od(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function Pd(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function Hn(e, t) {
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
    const p = Number(c);
    r.has(p) && !o.has(p) || (d[o.get(p) ?? c] = m);
  }
  return {
    ...e,
    approvedSetVersion: t.approvedSetVersion || e.approvedSetVersion,
    segments: a,
    performerSlots: l,
    performerSlotRevisions: d
  };
}
function xi(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function Ld(e) {
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
async function Fd(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await Si(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], m = Dd(
        d.startSec,
        d.endSec
      );
      for (const [p, y] of m.entries()) {
        Math.abs(r.currentTime - y) > 5e-4 && (r.currentTime = y, await Si(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const h = await jd(o), g = `example-${l + 1}-frame-${p + 1}`;
        c.push({ fieldName: g, timestampSec: y }), s.push({
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
    r.pause(), r.removeAttribute("src"), r.load(), r.remove();
  }
}
function Si(e, t) {
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
function jd(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function ki(e) {
  return Math.round(e * 1e3) / 1e3;
}
function Ku(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Gd(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function zu(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function _u(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Hu(e, t) {
  const r = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...r.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Xt(e, t, r, o) {
  const i = (r || []).map((d) => ({ ...d, segmentId: t })), a = e.performerSlots || [], s = a.findIndex((d) => d.segmentId === t), l = a.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...i), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function Bd(e, t) {
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
function Tn(e, t) {
  return !e || !t ? !1 : e.itemId != null && e.itemId === t.itemId || e.nativeSegmentId != null && e.nativeSegmentId === t.nativeSegmentId ? !0 : e.id != null && e.id === t.id;
}
function ko(e, t) {
  return (e || []).some((r) => (t || []).some((o) => Tn(r, o)));
}
function $t(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function ka(e, t) {
  return (e || []).find((r) => Tn(t, r)) || null;
}
function wa(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Ud(e, t) {
  var r;
  return ((r = e.running) == null ? void 0 : r.kind) === t;
}
function qu(e) {
  return e.running != null || e.queued.length > 0;
}
const wi = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
function yr(e) {
  return Object.freeze({
    id: e.id,
    kind: e.kind,
    lockId: e.lockId,
    targets: e.targets,
    exclusive: e.exclusive,
    meta: e.meta
  });
}
function Kd({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let r = 1, o = null, i = [], a = null, s = !1, l = 0, d = 0;
  const c = () => !t && d < l, m = /* @__PURE__ */ new Map();
  let p = wi;
  const y = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set();
  let g = [];
  function f() {
    p = o == null && i.length === 0 && a == null ? wi : Object.freeze({
      running: o ? yr(o) : null,
      queued: Object.freeze(i.map(yr)),
      lastFailure: a
    });
    for (const S of [...h]) S();
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
  function u(S) {
    o = S;
    const M = { ...e(), taskId: S.id, targets: S.targets };
    M.resolveTargets = () => S.targets.map((A) => ka(M.segments, A)).filter(Boolean), f();
    let z;
    try {
      z = S.run(M);
    } catch (A) {
      z = Promise.reject(A);
    }
    Promise.resolve(z).then(
      (A) => j(S, { status: "fulfilled", value: A }),
      (A) => j(S, { status: "rejected", error: A })
    );
  }
  function j(S, M) {
    S.settled || (S.settled = !0, k(S, M), !s && (o = null, M.status === "rejected" && (a = Object.freeze({ id: S.id, kind: S.kind, error: M.error })), f(), l += 1, t && W()));
  }
  function W() {
    if (s || o != null || c()) return;
    let S = !1;
    for (let M = 0; M < i.length; M += 1) {
      const z = i[M], A = C(z);
      if (A === "failed") {
        i = i.filter((E) => E !== z), k(z, { status: "dropped", reason: "dependency-failed" }), S = !0, M -= 1;
        continue;
      }
      if (A !== "pending" && !(z.exclusive && M > 0) && !i.slice(0, M).some((E) => ko(E.targets, z.targets)) && !(z.ready && !z.ready(e(), yr(z)))) {
        i = i.filter((E) => E !== z), u(z);
        return;
      }
    }
    S && f();
  }
  function G(S) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((K) => K.exclusive) || o != null && S.whenBusy !== "enqueue" || S.exclusive && (o != null || i.length > 0 || c())) return null;
    let z;
    const A = new Promise((K) => {
      z = K;
    }), E = {
      id: r++,
      kind: S.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: S.lockId ?? -1,
      targets: Object.freeze((S.targets || []).map(R)),
      exclusive: S.exclusive === !0,
      dependsOn: S.dependsOn ?? null,
      ready: S.ready || null,
      meta: S.meta ?? null,
      run: S.run,
      resolve: z
    };
    return i = [...i, E], f(), W(), { id: E.id, done: A };
  }
  function B(S = {}) {
    let M = null;
    const z = G({
      ...S,
      whenBusy: "reject",
      run: () => new Promise((E) => {
        M = E;
      })
    });
    if (!z) return null;
    if (M == null)
      return N((E) => E.id === z.id), null;
    let A = !1;
    return () => {
      A || (A = !0, M(), (o == null ? void 0 : o.id) === z.id && j(o, { status: "fulfilled", value: void 0 }));
    };
  }
  function R(S) {
    return (S == null ? void 0 : S.id) == null || S.itemId != null || S.nativeSegmentId != null ? S : m.get(S.id) || S;
  }
  function I(S, M) {
    m.set(S, { ...M });
    let z = !1;
    for (const A of i)
      A.targets.some((E) => E.id === S && E.itemId == null && E.nativeSegmentId == null) && (A.targets = Object.freeze(A.targets.map((E) => E.id === S ? { ...M } : E)), z = !0);
    return z && f(), z;
  }
  function N(S) {
    const M = i.filter((z) => S(yr(z)));
    if (M.length === 0) return 0;
    i = i.filter((z) => !M.includes(z));
    for (const z of M) k(z, { status: "cancelled" });
    return f(), W(), M.length;
  }
  return {
    enqueue: G,
    acquire: B,
    cancel: N,
    retarget: I,
    stableIdentity: R,
    // The host reads `settledCount()` while rendering and reports it here once that render commits.
    settledCount: () => l,
    markCommitted(S = l) {
      d = Math.max(d, S);
    },
    poke: () => W(),
    subscribe(S) {
      return h.add(S), () => h.delete(S);
    },
    getSnapshot: () => p,
    whenIdle() {
      return o == null && i.length === 0 ? Promise.resolve() : new Promise((S) => g.push(S));
    },
    dispose() {
      if (s) return;
      const S = i;
      i = [], s = !0;
      for (const z of S) k(z, { status: "cancelled" });
      h.clear();
      const M = g;
      g = [];
      for (const z of M) z();
    }
  };
}
let zd = 1;
function Vt() {
  return `pending-${zd++}`;
}
function _d(e) {
  return e.sort((t, r) => t.startSec - r.startSec || t.id - r.id);
}
function Sr(e, t) {
  return (t || []).some((r) => Tn(r, e));
}
function Hd(e, t) {
  return [...e || [], {
    id: t.id ?? Vt(),
    taskId: t.taskId ?? null,
    op: t.op,
    targets: t.targets || (t.segment ? [{ id: t.segment.id }] : []),
    values: t.values || null,
    segment: t.segment || null,
    meta: t.meta || null,
    settled: !1
  }];
}
function Na(e, t) {
  return t && (e || []).find((r) => {
    var o;
    return ((o = r.meta) == null ? void 0 : o.kind) === "held-tag" && !r.settled && Sr(t, r.targets);
  }) || null;
}
function qd(e) {
  return (e || []).filter((t) => t.op === "insert" && !t.settled).map((t) => t.segment);
}
function Ia(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function Ca(e, t) {
  const r = (e || []).filter((o) => !Ia(o, t));
  return r.length === (e || []).length ? e : r;
}
function $a(e, t) {
  let r = !1;
  const o = (e || []).map((i) => i.settled || !Ia(i, t) ? i : (r = !0, { ...i, settled: !0, settledDetail: null }));
  return r ? o : e;
}
function Wd(e, t, r) {
  let o = !1;
  const i = (e || []).map((a) => a.targets.some((s) => s.id === t && s.itemId == null && s.nativeSegmentId == null) ? (o = !0, {
    ...a,
    targets: a.targets.map((s) => s.id === t ? { ...r } : s)
  }) : a);
  return o ? i : e;
}
function Vd(e, t) {
  if (!t || t.length === 0) return e;
  let r = [...e || []];
  for (const o of t)
    if (o.op === "insert")
      r.some((i) => Tn(o.segment, i)) || r.push(o.segment);
    else if (o.op === "patch")
      r = r.map((i) => Sr(i, o.targets) ? { ...i, ...o.values } : i);
    else if (o.op === "remove")
      r = r.filter((i) => !Sr(i, o.targets));
    else if (o.op === "merge") {
      const [i, ...a] = o.targets;
      r = r.filter((s) => !Sr(s, a)).map((s) => Tn(i, s) ? { ...s, ...o.values } : s);
    }
  return _d(r);
}
function Ta(e, t) {
  if (!e || e.length === 0) return e;
  const r = [
    ...(t == null ? void 0 : t.segments) || [],
    ...e.filter((a) => a.op === "insert" && !a.settled).map((a) => a.segment)
  ];
  let o = !1;
  const i = [];
  for (const a of e) {
    if (a.op !== "insert" && !a.targets.some((s) => r.some((l) => Tn(s, l)))) {
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
function Jd(e, t, r) {
  return r ? Ca(e, t) : $a(e, t);
}
function Yd(e, t) {
  switch (t.type) {
    case "confirm":
      return Jd(e, t.key, t.applied);
    case "add":
      return Hd(e, t.entry);
    case "discard":
      return Ca(e, t.key);
    case "settle":
      return $a(e, t.key);
    case "retarget":
      return Wd(e, t.temporaryId, t.identity);
    case "prune":
      return Ta(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
function Ni(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function Qd(e) {
  const { acquireSaveLock: t, compatibilityMode: r, dispatchPendingChanges: o, enqueueSave: i, pendingChanges: a, retargetSaveTasks: s, currentTime: l, detail: d, editorFilters: c, endInput: m, hideDerivedSegments: p, historyRef: y, mediaDuration: h, onConflict: g, onDetailChange: f, onReload: k, optimisticSegmentIdRef: C, pendingDuplicateRef: u, pendingFirstSegmentStartSecRef: j, pendingTagEditSegmentIdRef: W, performerSlots: G, replaceSegmentSelection: B, savingSegmentId: R, segments: I, selectedSegment: N, selectedSegmentIdRef: S, selectedSegments: M, selectionAnchorIdRef: z, selectionRangeBaseIdsRef: A, setCreatingSegmentId: E, setEditorFilters: K, setFirstSegmentTagOpen: Y, setHideDerivedSegments: _, setHistory: re, setHistoryOpen: de, setPublishApprovedError: ve, setSaveMessage: D, setSelectedSegmentGroupKey: le, setSelectedSegmentId: se, setSelectedSegmentIds: X, setTagEditing: ye, startInput: fe, tagEditingRef: Ce, timelineDuration: Pe, video: pe } = e;
  function Q(L) {
    y.current = L || Yt, re(y.current);
  }
  async function he(L, oe, w, q, F = null) {
    var Z;
    try {
      const be = await ee(`/videos/${pe.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: y.current.revision,
          kind: L,
          label: oe,
          beforeState: w,
          afterState: q,
          receiptId: F
        })
      });
      return Q(be), !0;
    } catch (be) {
      return be.status === 409 && ((Z = be.payload) != null && Z.current) && Q(be.payload.current), D("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function T(L, oe, w = !0, q = null, F = !1, Z = oe, be = !0) {
    if (!L || R != null) return null;
    const ue = t("segment", L.id);
    if (!ue) return null;
    try {
      return await J(L, oe, {
        recordHistory: w,
        historyLabel: q,
        optimisticValues: F ? Z : null,
        restoreSelectionOnFailure: be
      });
    } finally {
      ue();
    }
  }
  async function J(L, oe, {
    recordHistory: w = !0,
    historyLabel: q = null,
    optimisticValues: F = null,
    pendingChangeId: Z = null,
    restoreSelectionOnFailure: be = !0,
    onReload: ue = k,
    onConflict: $e = g
  } = {}) {
    var ht;
    const pt = M.map((Xe) => Xe.id), Be = S.current, Te = w && !r ? crypto.randomUUID() : null;
    D(w ? "Saving directly to Cove…" : "Restoring history…");
    const Ye = Z ?? (F ? Vt() : null);
    F && !Z && o({
      type: "add",
      entry: { id: Ye, op: "patch", targets: [$t(L)], values: F }
    });
    const it = (Xe) => {
      Ye && o({ type: "confirm", key: Ye, applied: Xe });
    };
    try {
      if (r && L.nativeSegmentId == null && L.itemId != null) {
        const ut = `draft-update:${pe.id}:${L.itemId}:${L.revision}:${oe.tagId}:${oe.startSec}:${oe.endSec ?? "open"}:${oe.reviewState ?? L.reviewState}`, je = await ee(`/videos/${pe.id}/drafts/${L.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(ut),
            expectedRevision: L.revision,
            startSec: oe.startSec,
            endSec: oe.endSec,
            tagId: oe.tagId,
            reviewState: oe.reviewState
          })
        });
        He(ut), je.performerSlots != null && f((qe) => Xt(qe, L.id, je.performerSlots, je.performerSlotRevision), pe.id);
        const Qe = {
          ...L,
          ...je.draft,
          id: L.id,
          itemId: L.itemId
        };
        return w && await he(
          "segment.update",
          q || "Changed segment",
          pr(L, r),
          pr(
            Qe,
            r
          )
        ), Ni(L, oe, r) ? it(await ue() != null) : (f((qe) => ({
          ...qe,
          approvedSetVersion: je.approvedSetVersion || qe.approvedSetVersion,
          segments: (qe.segments || []).map((Je) => Je.id === L.id ? Qe : Je).sort((Je, st) => Je.startSec - st.startSec || Je.id - st.id)
        }), pe.id), it(!0)), D(((ht = je.draft) == null ? void 0 : ht.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), Qe;
      }
      const Xe = await ee(`/videos/${pe.id}/segments/${L.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...oe,
          expectedUpdatedAt: L.updatedAt,
          historyReceiptId: Te
        })
      }), yt = {
        ...L,
        ...Xe,
        reviewState: oe.reviewState ?? L.reviewState
      };
      return Ni(L, oe, r) ? it(await ue() != null) : (f((ut) => ({
        ...ut,
        segments: (ut.segments || []).map((je) => je.id === L.id ? yt : je).sort((je, Qe) => je.startSec - Qe.startSec || je.id - Qe.id)
      }), pe.id), it(!0)), w && await he(
        "segment.update",
        q || "Changed segment",
        pr(L, r),
        pr(
          yt,
          r
        ),
        Te
      ), D(w ? "Saved to Cove" : "History restored"), yt;
    } catch (Xe) {
      return Ye && o({ type: "discard", key: Ye }), Ye && be && (X(pt), se(Be), z.current = Be, A.current = []), Xe.status === 409 ? (D("Conflict — loading the latest segment…"), await $e()) : D(Xe.message || "Unable to save the segment."), null;
    }
  }
  async function $() {
    if (!r) return !1;
    const L = I.filter((q) => !q.published && q.reviewState === "approved").length;
    if (L === 0 || R != null) return !1;
    const oe = `complete-review:${pe.id}:${d.approvedSetVersion}`, w = t("publish", -1);
    if (!w) return !1;
    ve(""), D(`Publishing ${L} Approved draft${L === 1 ? "" : "s"}…`);
    try {
      const q = await ee(`/videos/${pe.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(oe),
          expectedApprovedSetVersion: d.approvedSetVersion
        })
      });
      He(oe), Q(Yt), de(!1);
      const F = await k(), Z = Cl(
        I,
        S.current,
        q.published
      ), be = Z ? rt(F == null ? void 0 : F.segments, Z) : null;
      return be && se(be.id), D(`${q.published.length} Approved draft${q.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (q) {
      const F = q.status === 409 ? "The approved drafts changed. Review the updated list and try again." : q.message || "Unable to publish the approved drafts.";
      return q.status === 409 && await g(), ve(F), D(F), !1;
    } finally {
      w();
    }
  }
  async function v(L = null, oe = null) {
    if (R != null || b()) return;
    const w = L != null ? j.current : null, q = Number.isFinite(w) ? w : l, F = Math.min(Pe, q + 20);
    if (F <= q) {
      D("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const Z = kl(I, N, L);
    if (Z.kind === "choose-tag") {
      j.current = q, D(""), Y(!0);
      return;
    }
    if (Z.kind === "invalid-selection") {
      D("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: be } = Z, ue = `create-draft:${pe.id}:${be}:${q}`, $e = r ? null : crypto.randomUUID(), pt = S.current, Be = {
      ...N || {},
      id: C.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: be,
      tagName: oe || (N == null ? void 0 : N.tagName) || "Tag segment",
      tagSortName: be === (N == null ? void 0 : N.tagId) && (N == null ? void 0 : N.tagSortName) || null,
      startSec: q,
      endSec: F,
      // Full mode creates manual drafts already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, Te = Gd(d, Be), Ye = Bt(
      sn(Te.segments, Te.segmentGroups || [], Te.performerSlots || []),
      Be.id
    ), it = i({
      kind: "create",
      lockId: -1,
      run: (Xe) => ht(Xe)
    });
    if (!it) return;
    await it.done;
    async function ht({ onReload: Xe, taskId: yt }) {
      var je;
      const ut = Vt();
      o({ type: "add", entry: { id: ut, taskId: yt, op: "insert", segment: Be } }), Y(!1), Z.openTagEditor && (E(Be.id), W.current = Be.id, ye(!0)), B(Be.id), le(Ye);
      try {
        let Qe;
        if (r) {
          const st = await ee(`/videos/${pe.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: _e(ue), tagId: be, startSec: q, endSec: F })
          });
          He(ue), Qe = { itemId: (je = st.draft) == null ? void 0 : je.itemId }, st.performerSlots != null && f((Ot) => Xt(Ot, Be.id, st.performerSlots, st.performerSlotRevision), pe.id);
        } else
          Qe = { nativeSegmentId: (await ee(`/videos/${pe.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: be,
              startSec: q,
              endSec: F,
              historyReceiptId: $e
            })
          })).id };
        j.current = null, Y(!1);
        const qe = await Xe();
        if (o({ type: "discard", key: ut }), !qe) {
          f((st) => Xt(st, Be.id, []), pe.id), B(pt), D(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${Z.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const Je = rt(qe == null ? void 0 : qe.segments, Qe);
        Je ? (o({ type: "retarget", temporaryId: Be.id, identity: $t(Je) }), s(Be.id, $t(Je)), Z.openTagEditor && (Ce.current && (W.current = Je.id), E(Je.id)), B(Je.id), le(Bt(
          sn(qe.segments || [], qe.segmentGroups || [], qe.performerSlots || []),
          Je.id
        )), r || await he(
          "segment.create",
          "Created segment",
          Mt([], !1),
          Mt([Je], !1),
          $e
        )) : (ye(!1), D(`Segment created, but it could not be selected${Z.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (Qe) {
        throw o({ type: "discard", key: ut }), B(pt), L != null && Y(!0), D(Qe.message || "Unable to create the draft."), Qe;
      } finally {
        E(null);
      }
    }
  }
  function b() {
    return Na(a, N) ? (D("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function x() {
    if (M.length !== 1 || !N || R != null || b()) return;
    const L = l;
    if (L <= N.startSec || N.endSec != null && L >= N.endSec) {
      D("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const oe = `split-draft:${N.itemId}:${N.revision}:${L}`, w = r ? null : Mt([N], !1), q = r ? null : crypto.randomUUID(), F = t("split", N.id);
    if (F)
      try {
        let Z = null;
        r && N.nativeSegmentId == null ? (await ee(`/videos/${pe.id}/drafts/${N.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(oe),
            expectedRevision: N.revision,
            splitSec: L
          })
        }), He(oe)) : Z = { nativeSegmentId: (await ee(`/videos/${pe.id}/segments/${N.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: N.updatedAt,
            splitSec: L,
            historyReceiptId: q
          })
        })).id };
        const be = await k();
        if (!r) {
          const ue = [
            rt(be == null ? void 0 : be.segments, {
              nativeSegmentId: N.nativeSegmentId ?? N.id
            }),
            rt(
              be == null ? void 0 : be.segments,
              Z
            )
          ].filter(Boolean);
          await he(
            "segment.split",
            "Split segment",
            w,
            Mt(ue, !1),
            q
          );
        }
        D(r ? `Segment split; both ranges remain ${N.reviewState}.` : "Segment split.");
      } catch (Z) {
        Z.status === 409 ? await g() : D(Z.message || "Unable to split the draft.");
      } finally {
        F();
      }
  }
  async function P(L = !1) {
    if (M.length !== 1 || !N || R != null || b()) return;
    const oe = L ? l : N.startSec, w = Sl(pe.id, N, L, oe), q = r ? null : crypto.randomUUID(), F = N, Z = S.current, be = F.endSec == null ? null : F.endSec - F.startSec, ue = {
      ...F,
      id: C.current--,
      itemId: null,
      nativeSegmentId: null,
      startSec: oe,
      endSec: be == null ? null : oe + be,
      // Full mode creates the copy already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : F.reviewState,
      revision: 0,
      updatedAt: null
    }, $e = (G || []).filter((Te) => Te.segmentId === F.id), pt = i({
      kind: "duplicate",
      lockId: -1,
      targets: [$t(F)],
      run: (Te) => Be(Te)
    });
    if (!pt) return;
    await pt.done;
    async function Be({ onReload: Te, onConflict: Ye, taskId: it }) {
      var yt, ut;
      const ht = Vt();
      o({ type: "add", entry: { id: ht, taskId: it, op: "insert", segment: ue } }), $e.length > 0 && f((je) => Xt(je, ue.id, $e), pe.id), L || (E(ue.id), W.current = ue.id, ye(!0)), B(ue.id);
      const Xe = () => {
        o({ type: "discard", key: ht }), $e.length > 0 && f((je) => Xt(je, ue.id, []), pe.id);
      };
      try {
        const je = ((yt = u.current) == null ? void 0 : yt.operationKey) === w ? u.current : null;
        let Qe = (je == null ? void 0 : je.duplicateIdentity) ?? null;
        if (Qe == null && r && F.nativeSegmentId == null) {
          const Ot = await ee(`/videos/${pe.id}/drafts/${F.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(w),
              expectedRevision: F.revision,
              startSec: L ? oe : null
            })
          });
          Qe = ii(!1, Ot), u.current = { operationKey: w, duplicateIdentity: Qe };
        } else if (Qe == null) {
          const Ot = await ee(`/videos/${pe.id}/segments/${F.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: F.updatedAt,
              startSec: L ? oe : null,
              historyReceiptId: q
            })
          });
          Qe = ii(!0, Ot), u.current = { operationKey: w, duplicateIdentity: Qe };
        }
        const qe = await Te();
        Xe();
        const Je = rt(qe == null ? void 0 : qe.segments, Qe);
        if (!Je) {
          ye(!1), B(Z), D(qe ? "Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection." : "Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.");
          return;
        }
        o({ type: "retarget", temporaryId: ue.id, identity: $t(Je) }), s(ue.id, $t(Je));
        const st = Ji(
          Je,
          qe.performerSlots || [],
          c,
          p,
          qe.segmentGroups || []
        );
        K(st.filters), _(st.hideDerivedSegments), !L && Ce.current && (W.current = Je.id), B(Je.id), le(Bt(
          sn(qe.segments || [], qe.segmentGroups || [], qe.performerSlots || []),
          Je.id
        )), r && F.nativeSegmentId == null && He(w), u.current = null, D(L ? "Duplicate created at the playhead." : "Duplicate created in place."), r || await he(
          "segment.duplicate",
          "Duplicated segment",
          Mt([], !1),
          Mt([Je], !1),
          q
        );
      } catch (je) {
        throw Xe(), ye(!1), B(Z), ((ut = u.current) == null ? void 0 : ut.operationKey) === w ? D("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : je.status === 409 ? await Ye() : D(je.message || "Unable to duplicate the draft."), je;
      } finally {
        E(null);
      }
    }
  }
  async function te() {
    if (M.length !== 1 || !N) return;
    const L = Number(fe), oe = m.trim() === "" ? null : Number(m), w = Yo(L, oe, h);
    if (w.error) {
      D(w.error);
      return;
    }
    if (L === N.startSec && oe === N.endSec) {
      D("Timing is unchanged.");
      return;
    }
    await T(N, { startSec: L, endSec: oe, tagId: N.tagId }, !0, null, !0);
  }
  async function ne(L, oe) {
    if (M.length !== 1 || !N) return;
    const w = Yo(L, oe, h);
    if (w.error) {
      D(w.error);
      return;
    }
    if (L === N.startSec && oe === N.endSec) {
      D("Timing is unchanged.");
      return;
    }
    await T(N, { startSec: L, endSec: oe, tagId: N.tagId }, !0, null, !0);
  }
  return { acceptHistory: Q, recordHistoryAction: he, mutateSegment: T, runSegmentMutation: J, completeReview: $, createSegment: v, splitSegment: x, duplicateSegment: P, saveTiming: te, applyShortcutTiming: ne };
}
function Zd() {
  const [e, t] = U(() => typeof window < "u" && window.matchMedia(Wo).matches);
  return ge(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Wo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Xd() {
  const [e, t] = U(() => typeof window < "u" && window.matchMedia(Vo).matches);
  return ge(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Vo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function ec() {
  try {
    return qs(window.localStorage.getItem(ji));
  } catch {
    return { ...Tt };
  }
}
function tc() {
  try {
    return nn(JSON.parse(window.localStorage.getItem(Gi) || "[]"));
  } catch {
    return [];
  }
}
function nc(e) {
  try {
    window.localStorage.setItem(Gi, JSON.stringify(nn(e)));
  } catch {
  }
}
function rc(e) {
  try {
    window.localStorage.setItem(ji, JSON.stringify(e));
  } catch {
  }
}
function oc() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Ui) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function ic(e) {
  try {
    return window.localStorage.setItem(Ui, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function ac({ status: e }) {
  const t = pa[e];
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
function tn({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, Nt.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...ma(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${Ut[t].symbol}${e[t]}`)));
}
function sc({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: m, shortcutRef: p }) {
  const y = fo(a), [h, g] = U(() => Vr(o, y)), [f, k] = U(!1), [C, u] = U(""), j = me(!1), W = o.map((S) => `${S.slotDefinitionId}:${S.performerId || ""}`).join("|"), G = y.map((S) => ct(S)).join("|"), B = oa(
    o,
    y
  );
  ge(() => {
    g(Vr(o, y)), u("");
  }, [t, r, W, G]);
  async function R(S = h) {
    if (!j.current) {
      j.current = !0, k(!0), u("Saving performer slots…");
      try {
        const M = Vr(o.map((E) => ({
          ...E,
          performerId: S[E.slotDefinitionId] || null
        })), y), z = o.map((E) => {
          const K = M[E.slotDefinitionId] ? Number(M[E.slotDefinitionId]) : null, Y = y.find((_) => String(ct(_)) === String(K));
          return {
            ...E,
            performerId: K,
            performerName: (Y == null ? void 0 : Y.name) || null
          };
        });
        if (s(z) === !1) {
          u("");
          return;
        }
        const A = await ee(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((E) => ({ slotDefinitionId: E.slotDefinitionId, performerId: M[E.slotDefinitionId] ? Number(M[E.slotDefinitionId]) : null }))
          })
        });
        u("Performer slots saved."), await l(A, {
          beforeState: Nr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: Nr([{
            segmentId: t,
            itemId: r,
            revision: A.revision,
            slots: A.slots || []
          }])
        });
      } catch (M) {
        d && await d(o, M), M.status === 409 ? (u("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : u(M.message || "Unable to save performer slots.");
      } finally {
        j.current = !1, k(!1);
      }
    }
  }
  function I(S, M) {
    u(`Option ${M + 1} applied; save to confirm.`), g({ ...h, ...S.assignments });
  }
  async function N(S) {
    const M = { ...h, ...S.assignments };
    g(M), await R(M);
  }
  return ge(() => {
    if (p)
      return p.current = (S) => j.current || !B[S] ? !1 : (N(B[S]), !0), () => {
        p.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    B.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, B.map((S, M) => n("button", {
        key: M,
        type: "button",
        disabled: f,
        onClick: () => I(S, M),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${M + 1}: ${S.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, M + 1),
        n("span", { key: "description" }, S.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${B.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((S) => n("label", { key: S.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, It(S)),
      (S.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(S.genderHints || []).map(Tr).join(" · ")}`) : null,
      n("select", { key: "select", value: h[S.slotDefinitionId] || "", disabled: f, onChange: (M) => g({ ...h, [S.slotDefinitionId]: M.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ia(y, y, S.genderHints).map((M) => n("option", { key: ct(M), value: ct(M) }, M.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: m, type: "button", disabled: f, onClick: () => R(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, C)])
  ]);
}
function lc({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a, acquireSaveLock: s = () => () => {
} }) {
  var R;
  const l = ((R = t[0]) == null ? void 0 : R.slots) || [], d = fo(r), c = oa(
    l,
    d
  ), m = "__mixed__", p = () => Object.fromEntries(l.map((I, N) => {
    const S = t.map((M) => {
      var z;
      return String(((z = M.slots[N]) == null ? void 0 : z.performerId) || "");
    });
    return [I.slotDefinitionId, S.every((M) => M === S[0]) ? S[0] : m];
  })), [y, h] = U(p), [g, f] = U(!1), [k, C] = U(""), u = me(!1), j = t.map((I) => `${I.itemId ?? `native:${I.segmentId}`}:${I.revision}:${I.slots.map((N) => `${N.slotDefinitionId}:${N.performerId || ""}`).join(",")}`).join("|");
  ge(() => {
    h(p());
  }, [j]);
  async function W(I = y) {
    if (u.current) return;
    const N = s();
    if (!N) {
      C("Wait for the current save to finish before saving performer slots.");
      return;
    }
    u.current = !0, f(!0), C(`Saving performer slots for ${t.length} segments…`);
    const S = [];
    try {
      for (const M of t) {
        const z = M.slots.map((E, K) => {
          const Y = I[l[K].slotDefinitionId];
          return {
            slotDefinitionId: E.slotDefinitionId,
            performerId: Y === m ? E.performerId || null : Y ? Number(Y) : null
          };
        }), A = await ee(M.itemId != null ? `/videos/${e}/drafts/${M.itemId}/slots` : `/videos/${e}/segments/${M.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: M.revision, assignments: z })
        });
        S.push({
          segmentId: M.segmentId,
          itemId: M.itemId,
          revision: A.revision,
          slots: A.slots || []
        });
      }
      C("Performer slots saved."), await o({
        beforeState: Nr(t),
        afterState: Nr(S)
      });
    } catch (M) {
      const z = await i();
      M.status === 409 ? C(z ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : C(M.message || (z ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      u.current = !1, f(!1), N();
    }
  }
  function G(I, N) {
    C(`Option ${N + 1} applied; save to confirm.`), h({ ...y, ...I.assignments });
  }
  async function B(I) {
    const N = { ...y, ...I.assignments };
    h(N), await W(N);
  }
  return ge(() => {
    if (a)
      return a.current = (I) => u.current || !c[I] ? !1 : (B(c[I]), !0), () => {
        a.current = null;
      };
  }), n("div", { className: "space-y-3" }, [
    n(
      "p",
      { key: "scope", className: "text-xs text-secondary" },
      `Changes apply to all ${t.length} selected segments. Mixed values remain unchanged unless replaced.`
    ),
    c.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, c.map((I, N) => n("button", {
        key: N,
        type: "button",
        disabled: g,
        onClick: () => G(I, N),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${N + 1} to all selected segments: ${I.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, N + 1),
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
        disabled: g,
        onChange: (N) => h({ ...y, [I.slotDefinitionId]: N.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        y[I.slotDefinitionId] === m ? n("option", { key: "mixed", value: m }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ia(d, d, I.genderHints).map((N) => n("option", {
          key: ct(N),
          value: ct(N)
        }, N.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: g,
        onClick: () => W(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, k)
    ])
  ]);
}
function Kt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function dc(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return Kt(t);
  const o = [...new Set(r.map((i) => Kt(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function Ar() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function br({ name: e }) {
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
function cc({ hidden: e }) {
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
    n(Ar, { key: "derived" })
  ]);
}
function uc({ segment: e, provenance: t }) {
  var m;
  const [r, o] = U(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = dc(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
  return n("section", { "aria-label": "Segment provenance", className: "rounded-md border border-border bg-surface" }, [
    n("button", {
      key: "toggle",
      type: "button",
      onClick: () => o((p) => !p),
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
      ) : s.map((p) => {
        const y = p.modelIdentifier || p.modelKey, h = p.value == null ? null : typeof p.value == "string" ? p.value : JSON.stringify(p.value);
        return n("div", { key: p.id || `${p.fieldKey}:${p.sourceKey}:${p.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            Kt(p.sourceKey, p.sourceDisplayName)
          ),
          p.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${p.fieldKey}${h == null ? "" : ` · ${h}`}`
          ) : null,
          p.relation === "inherited" ? n("div", { key: "relation", className: "text-secondary" }, "Inherited origin") : null,
          y ? n(
            "div",
            { key: "model", className: "text-secondary" },
            `Model ${y}${p.modelVersion ? ` · ${p.modelVersion}` : ""}`
          ) : null,
          p.activityExternalRunId || p.sourceRunId ? n("div", { key: "run", className: "break-all text-secondary" }, `Run ${p.activityExternalRunId || p.sourceRunId}`) : null,
          p.confidence != null ? n(
            "div",
            { key: "confidence", className: "text-secondary" },
            `Confidence ${Math.round(p.confidence * 100)}%`
          ) : null,
          p.recordedAt || p.createdAt ? n("div", { key: "recorded", className: "text-secondary" }, `Recorded ${p.recordedAt || p.createdAt}`) : null
        ]);
      })
    ) : null
  ]);
}
function mc({
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
  const [p, y] = U([]), h = e.flatMap((C) => C.lanes.map((u) => u.key)), g = h.join("|");
  ge(() => {
    const C = new Set(h);
    y((u) => u.filter((j) => C.has(j)));
  }, [g]);
  const f = Ir(t), k = !!va(
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
        `${h.length} swimlane${h.length === 1 ? "" : "s"} · ${e.length} group${e.length === 1 ? "" : "s"}`
      ),
      a ? n(tn, { key: "counts", counts: f }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      bd({ mergeable: k, reviewable: a, tagEditable: s, slotsEditable: l })
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
    ...e.map((C) => n("section", {
      key: C.key,
      "data-selected-segment-group": C.key,
      className: "space-y-1.5"
    }, [
      n("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        n("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, C.name),
        n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${C.selectedCount} selected`)
      ]),
      ...C.lanes.map((u) => {
        const j = p.includes(u.key), W = u.markers.some(({ segment: B }) => B.id === r), G = `selected-segment-lane-${u.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: u.key,
          "data-selected-segment-lane": u.key,
          className: `rounded-md border ${W ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": j,
            "aria-controls": G,
            "aria-current": W ? "true" : void 0,
            onClick: () => y((B) => j ? B.filter((R) => R !== u.key) : [...B, u.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, j ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Yn(u)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(u.selectedCount)),
            a ? n(tn, { key: "states", counts: u.counts }) : null
          ]),
          j ? n("div", {
            key: "segments",
            id: G,
            className: "space-y-1 border-t border-border p-1.5"
          }, u.markers.map(({ segment: B }) => {
            const R = B.endSec == null ? De(B.startSec) : `${De(B.startSec)} – ${De(B.endSec)}`;
            return n("button", {
              key: B.id,
              type: "button",
              onClick: () => i(B),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${B.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${B.tagName || "Segment"}, ${B.reviewState}, ${R}` : `${B.tagName || "Segment"}, ${R}`,
              "aria-current": B.id === r ? "true" : void 0
            }, [
              a ? n(dn, {
                key: "state",
                state: B.reviewState,
                includeLabel: !1
              }) : null,
              B.isDerived ? n(Ar, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, R),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                Kt(B.sourceKey)
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
}, Ra = "com.midnightrider.segment-studio", gc = /* @__PURE__ */ new Set(["hasSegments"]), pc = /* @__PURE__ */ new Set(["segment_count", "unreviewed_count"]), fc = {
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
function qn(e, t, r) {
  return { extensionId: Ra, filterId: e, modifier: t, value: r };
}
function Ii(e) {
  return typeof e == "boolean" ? e : e === "has" ? !0 : e === "none" ? !1 : null;
}
function Ci(e) {
  const t = Cr(e == null ? void 0 : e.value), r = Cr(e == null ? void 0 : e.excludes), o = { INCLUDES_ALL: "includesall", EXCLUDES: "excludes", IS_NULL: "isnull", NOT_NULL: "notnull" }[e == null ? void 0 : e.modifier] ?? "includes";
  return o === "isnull" || o === "notnull" ? qn("segment-tags", o, {}) : t.length === 0 && (o === "excludes" || r.length === 0) ? null : qn("segment-tags", o, {
    ...t.length > 0 ? { value: t } : {},
    ...r.length > 0 && o !== "excludes" ? { excludes: r } : {},
    ...(e == null ? void 0 : e.depth) === -1 ? { depth: -1 } : {}
  });
}
function oo(e = {}, { fullMode: t = !0 } = {}) {
  var k, C, u;
  const r = [
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
  if (!r.some((j) => Object.hasOwn(e, j))) return e;
  const o = { ...e };
  r.forEach((j) => delete o[j]);
  const i = [], a = Ii(((k = e.hasSegmentsCriterion) == null ? void 0 : k.value) ?? e.segments);
  a !== null && i.push(qn("has-segments", "equals", a));
  const s = ((C = e.reviewStateCriterion) == null ? void 0 : C.value) ?? e.reviewState;
  t && ["unreviewed", "approved", "rejected"].includes(s) && i.push(qn("review-state", "equals", s));
  const l = Ii(((u = e.shotBoundariesCriterion) == null ? void 0 : u.value) ?? e.shotBoundaries);
  t && l !== null && i.push(qn("has-shot-boundaries", "equals", l));
  const d = Number(e.segmentTagId ?? e.tagId) || null, c = e.segmentTagsCriterion ? Ci(e.segmentTagsCriterion) : d ? Ci({ value: [d] }) : null;
  c && i.push(c);
  const m = Cr(e.videoTagIds);
  m.length > 0 && !o.tagsCriterion && (o.tagsCriterion = { modifier: "INCLUDES", value: m });
  const p = Cr(e.performerIds);
  p.length > 0 && !o.performersCriterion && (o.performersCriterion = { modifier: "INCLUDES", value: p });
  const y = Number(e.studioId) || null;
  y && !o.studiosCriterion && (o.studiosCriterion = { modifier: "INCLUDES", value: [y] });
  const h = Array.isArray(e.extensionCriteria) ? e.extensionCriteria : [], g = new Set(h.filter((j) => (j == null ? void 0 : j.extensionId) === Ra).map((j) => j.filterId)), f = [...h, ...i.filter((j) => !g.has(j.filterId))];
  return f.length > 0 ? o.extensionCriteria = f : delete o.extensionCriteria, o;
}
function io(e) {
  return pc.has(e == null ? void 0 : e.sort) ? { ...e, sort: Wt.defaultFilter.sort, direction: Wt.defaultFilter.direction } : e;
}
function ao(e) {
  return Array.isArray(e) ? e.map(ao) : !e || typeof e != "object" ? e : Object.fromEntries(Object.entries(e).map(([t, r]) => [
    t,
    t === "modifier" && typeof r == "string" ? fc[r] ?? r : ao(r)
  ]));
}
function yc(e, t, { fullMode: r = !0 } = {}) {
  const o = io(e), i = {
    page: o.page || 1,
    perPage: o.perPage || Wt.defaultFilter.perPage,
    sort: o.sort || Wt.defaultFilter.sort,
    direction: o.direction || Wt.defaultFilter.direction
  };
  o.q && (i.q = o.q), i.sort === "random" && Number.isInteger(o.seed) && o.seed > 0 && (i.seed = o.seed);
  const a = { ...oo(t, { fullMode: r }) };
  return delete a.includeCompilationGroups, { findFilter: i, objectFilter: ao(a) };
}
function bc(e) {
  return e.filter((t) => !gc.has(t.id));
}
function hc(e, t) {
  var o;
  const r = Array.isArray(e.files) && e.files.length > 0 ? e.files[0] : null;
  return {
    videoId: e.id,
    title: ((o = e.title) == null ? void 0 : o.trim()) || (r == null ? void 0 : r.basename) || `Video ${e.id}`,
    details: e.details ?? null,
    date: e.date ?? null,
    organized: !!e.organized,
    isVr: !!e.isVr,
    duration: Number(r == null ? void 0 : r.duration) || 0,
    updatedAt: e.updatedAt,
    segmentCount: (t == null ? void 0 : t.segmentCount) ?? 0,
    unreviewedCount: (t == null ? void 0 : t.unreviewedCount) ?? 0,
    approvedCount: (t == null ? void 0 : t.approvedCount) ?? 0,
    rejectedCount: (t == null ? void 0 : t.rejectedCount) ?? 0
  };
}
function Xn(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function Aa(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function Cr(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function vc(e, t, r, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((m) => a.add(m));
  } else a.has(r) ? a.delete(r) : a.add(r);
  return a;
}
function Ea({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(fi, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, Nt.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = Ut[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(fi, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function Ma({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
function xc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      onClick: (l) => Xn(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      n(Ma, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, Cs(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(Ea, { item: e, showReviewStates: r }))
    ])
  ]);
}
function Sc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n(Ma, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
    n(i ? "div" : "a", {
      key: "link",
      href: i ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: i ? void 0 : (l) => Xn(l, t, s),
      className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
      n("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
        n("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
        n(Ea, { key: "segments", item: e, showReviewStates: r })
      ]),
      n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function wo({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = Al(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => Xn(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && $n(
        o,
        Qt.recyclingBinView
      ) ? n(Da, { key: "bin", onNavigate: t }) : null,
      n(Oa, { key: "settings", onNavigate: t })
    ])
  ]);
}
const so = "segment-studio:recycling-bin-changed";
function kc(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function Wn() {
  window.dispatchEvent(new CustomEvent(so));
}
function Da({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = U(null);
  ge(() => {
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
    return l(), window.addEventListener(so, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(so, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = kc(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => Xn(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function Oa({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => Xn(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function wc({ mode: e, onModeChange: t, disabled: r = !1 }) {
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
function Nc({ minimum: e, maximum: t, onChange: r }) {
  const o = me(null), [i, a] = U("maximum"), s = (y, h) => {
    const g = tl(e, t, y, h);
    a(g.coincidentTop), r({ minimum: g.minimum, maximum: g.maximum });
  }, l = (y, h) => {
    var f;
    const g = (f = o.current) == null ? void 0 : f.getBoundingClientRect();
    g && s(y, el(h.clientX, g.left, g.width));
  }, d = (y, h) => {
    var g, f;
    h.preventDefault(), (f = (g = h.currentTarget).setPointerCapture) == null || f.call(g, h.pointerId), l(y, h);
  }, c = (y, h) => {
    var g, f;
    (f = (g = h.currentTarget).hasPointerCapture) != null && f.call(g, h.pointerId) && l(y, h);
  }, m = (y, h) => {
    const g = y === "minimum" ? e : t, f = y === "minimum" ? 0 : e, k = y === "minimum" ? t : 1, C = h.shiftKey ? 0.1 : 0.01;
    let u = null;
    ["ArrowLeft", "ArrowDown"].includes(h.key) && (u = g - C), ["ArrowRight", "ArrowUp"].includes(h.key) && (u = g + C), h.key === "PageDown" && (u = g - 0.1), h.key === "PageUp" && (u = g + 0.1), h.key === "Home" && (u = f), h.key === "End" && (u = k), u != null && (h.preventDefault(), s(y, Math.min(k, Math.max(f, u))));
  }, p = (y, h) => n("span", {
    key: y,
    role: "slider",
    tabIndex: 0,
    "aria-label": y === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((y === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((y === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(h * 100),
    "aria-valuetext": `${Math.round(h * 100)} percent`,
    onPointerDown: (g) => d(y, g),
    onPointerMove: (g) => c(y, g),
    onKeyDown: (g) => m(y, g),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${h * 100}%`,
      touchAction: "none",
      zIndex: e === t && i === y ? 2 : 1
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
        p("minimum", e),
        p("maximum", t)
      ])
    )
  ]);
}
function Ic({ saving: e, error: t, onSelect: r, onClose: o }) {
  const i = me(null);
  ge(() => {
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
    onKeyDownCapture: (s) => Rt(s, { onCancel: a })
  }, n("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: Jt,
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
    n(Vn, {
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
function Cc({
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
  const p = Dt(e), y = [...new Map((a || []).map((u) => [
    Number(u.tagId),
    u.tagName || `Tag ${u.tagId}`
  ])).entries()].sort((u, j) => u[1].localeCompare(j[1]) || u[0] - j[0]), h = new Set((a || []).map((u) => Number(u.tagId))), g = (s || []).filter((u) => Number(u.id) === p.segmentGroupId || (u.tags || []).some((j) => h.has(Number(j.tagId)))), f = (u) => d(Dt({ ...p, ...u })), k = (u) => f({
    reviewStates: p.reviewStates.includes(u) ? p.reviewStates.filter((j) => j !== u) : [...p.reviewStates, u]
  }), C = (u) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${u ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && m();
    },
    onKeyDownCapture: (u) => Rt(u, { onCancel: m })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: Jt,
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
        n("div", { className: "flex flex-wrap gap-2" }, Nt.map((u) => {
          const j = p.reviewStates.includes(u), W = Ut[u];
          return n("button", {
            key: u,
            type: "button",
            onClick: () => k(u),
            "aria-pressed": j,
            className: C(j)
          }, `${W.symbol} ${u} (${i[u] || 0})`);
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
            "aria-pressed": p.performerId == null,
            className: C(p.performerId == null)
          }, "All performers"),
          ...r.map((u) => {
            const j = Number(ct(u));
            return n("button", {
              key: j,
              type: "button",
              onClick: () => f({ performerId: j }),
              "aria-pressed": p.performerId === j,
              className: C(p.performerId === j)
            }, u.name);
          })
        ])
      ]) : null,
      n("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        n("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Tag"),
          n("select", {
            key: "select",
            value: p.tagId ?? "",
            onChange: (u) => f({
              tagId: u.target.value === "" ? null : Number(u.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...y.map(([u, j]) => n("option", { key: u, value: u }, j))
          ])
        ]),
        n("label", {
          key: "segment-group",
          className: "space-y-1 text-xs text-secondary"
        }, [
          n("span", { key: "label" }, "Segment group"),
          n("select", {
            key: "select",
            value: p.segmentGroupId ?? "",
            onChange: (u) => f({
              segmentGroupId: u.target.value === "" ? null : u.target.value === "ungrouped" ? "ungrouped" : Number(u.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All Segment groups"),
            ...g.map((u) => n("option", { key: u.id, value: u.id }, u.name)),
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
            "aria-pressed": p.sourceKey == null,
            className: C(p.sourceKey == null)
          }, "All provenance"),
          ...o.map((u) => n("button", {
            key: u,
            type: "button",
            onClick: () => f({ sourceKey: u }),
            "aria-pressed": p.sourceKey === u,
            title: u,
            className: C(p.sourceKey === u)
          }, Kt(u)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(Nc, {
          minimum: p.confidenceMin,
          maximum: p.confidenceMax,
          onChange: ({ minimum: u, maximum: j }) => f({
            confidenceMin: u,
            confidenceMax: j
          })
        }),
        n("label", {
          key: "unscored",
          className: "flex items-center gap-2 text-xs text-secondary"
        }, [
          n("input", {
            key: "input",
            type: "checkbox",
            checked: p.includeUnscored,
            onChange: (u) => f({
              includeUnscored: u.target.checked
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
          onChange: (u) => c(u.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]"
        }),
        n(cc, { key: "icon", hidden: t }),
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
        onClick: m,
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground"
      }, "Done")
    ])
  ]));
}
const Pa = "segment-studio-editor-history";
function $c({ history: e, historySaving: t, anchorRef: r, onRestore: o, onClose: i }) {
  const a = me(null);
  return ge(() => {
    const s = (d) => {
      md(d.target, a.current, r == null ? void 0 : r.current) && i();
    }, l = (d) => {
      var p, y, h;
      if (d.key !== "Escape" || d.defaultPrevented || document.querySelector("[role='dialog'], [aria-modal='true']")) return;
      const c = document.activeElement, m = c instanceof Element && (((p = a.current) == null ? void 0 : p.contains(c)) || ((y = r == null ? void 0 : r.current) == null ? void 0 : y.contains(c)));
      d.preventDefault(), i(), m && ((h = r == null ? void 0 : r.current) == null || h.focus({ preventScroll: !0 }));
    };
    return document.addEventListener("pointerdown", s), document.addEventListener("keydown", l), () => {
      document.removeEventListener("pointerdown", s), document.removeEventListener("keydown", l);
    };
  }, [r, i]), n("div", {
    ref: a,
    id: Pa,
    role: "group",
    "aria-label": "Editor history",
    className: "absolute right-3 top-full z-30 mt-1 w-full max-w-md rounded-md border border-border bg-surface p-2 shadow-lg"
  }, [
    n("div", { key: "heading", className: "flex items-center justify-between gap-3 px-2 py-1" }, [
      n("h2", { key: "title", className: "text-sm font-semibold text-foreground" }, "Editor history"),
      n("button", {
        key: "close",
        type: "button",
        onClick: i,
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
function Tc({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Zn.filter((l) => Cn(l, e)), i = ri(o, 1)[0], a = ri(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((m) => n("div", { key: m.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, m.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[m.id] ? t[m.id].length > 0 ? t[m.id] : ["Unassigned"] : m.bindings.map(Zi)).map((p, y) => n("kbd", { key: `${m.id}:${y}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, p))
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
      n("div", { key: "mobile", className: "space-y-6 lg:hidden" }, i.map(s)),
      n(
        "div",
        { key: "desktop", className: "hidden items-start gap-6 lg:grid lg:grid-cols-2" },
        a.map((l, d) => n("div", { key: d, className: "space-y-6" }, l.map(s)))
      )
    ])
  ]));
}
function Rc({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = Ld(e), [l, d] = U([]), c = s.map((m) => m.tagName).join("|");
  return ge(() => {
    const m = new Set(s.map((p) => p.tagName));
    d((p) => p.filter((y) => m.has(y)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (m) => Rt(m, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: Jt,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", { key: "title", id: "segment-studio-examples-title", className: "text-lg font-semibold text-foreground" }, "AI Feedback"),
      n("p", { key: "description", className: "mt-1 text-sm text-secondary" }, `${e.length} registered-AI example${e.length === 1 ? "" : "s"} in this video. Expand a tag to inspect or restore examples before export.`)
    ]),
    n("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      n("div", { key: "items", className: "space-y-3" }, e.length ? s.map((m, p) => {
        const y = l.includes(m.tagName), h = `incorrect-example-tag-${p}`;
        return n("section", {
          key: m.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": y,
            "aria-controls": h,
            onClick: () => d((g) => y ? g.filter((f) => f !== m.tagName) : [...g, m.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: $r(!1) }
          }, [
            n(
              "span",
              { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" },
              y ? "▾" : "▸"
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
          y ? n("div", {
            key: "examples",
            id: h,
            className: "divide-y divide-border border-t border-border"
          }, m.examples.map((g) => {
            const f = `${De(g.startSec)}${g.endSec == null ? "" : ` – ${De(g.endSec)}`}`, k = r === g.id;
            return n("div", {
              key: g.id,
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
                onClick: () => i(g),
                "aria-label": `${k ? "Restoring" : "Restore to review"} ${m.tagName} example at ${f}`,
                className: "rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
              }, k ? "Restoring…" : "Restore to review")
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
function Ac({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = U(""), [a, s] = U(0), l = me(null), d = ze(() => Kl(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), m = _l(d);
  ge(() => {
    var y;
    (y = l.current) == null || y.scrollIntoView({ block: "nearest" });
  }, [c, o]);
  const p = () => {
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
        Jt(y);
      else if (y.key === "Escape")
        y.preventDefault(), y.stopPropagation(), r();
      else if (y.key === "ArrowDown" || y.key === "ArrowUp") {
        y.preventDefault(), y.stopPropagation();
        const g = y.key === "ArrowDown" ? 1 : -1;
        s((f) => d.length ? (f + g + d.length) % d.length : 0);
      } else y.key === "Enter" && !((h = y.nativeEvent) != null && h.isComposing) && (y.preventDefault(), y.stopPropagation(), p());
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
          i(y.target.value), s(0);
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
      var G;
      const g = y.segment || y, f = g.endSec == null ? De(g.startSec) : `${De(g.startSec)} – ${De(g.endSec)}`, k = `${Kt(g.sourceKey)}${g.confidence == null ? "" : ` · ${Math.round(g.confidence * 100)}%`}`, C = h === c, u = h > 0 ? d[h - 1].groupKey : null, j = m && y.groupKey !== u ? n("div", {
        key: `group:${y.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, y.groupName) : null, W = n("button", {
        key: g.id,
        id: `segment-quick-search-${g.id}`,
        ref: C ? l : null,
        type: "button",
        role: "option",
        "aria-selected": C,
        onMouseEnter: () => s(h),
        onClick: () => t(g),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${C ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        m ? n("span", { key: "group", className: "sr-only" }, `${y.groupName} group`) : null,
        n(dn, { key: "review", state: g.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          g.tagName || "Tag segment"
        ),
        (G = y.performers) != null && G.length ? n(Rr, {
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
          title: k
        }, k)
      ]);
      return j ? [j, W] : [W];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function Ec(e) {
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
function Mc({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = ze(() => Ec(e), [e]), [l, d] = U([]), c = s.reduce((h, g) => h + g.drafts.length, 0), m = me(null);
  ho({ confirmRef: m, cancelRef: o, confirmReady: !t && c > 0 });
  const p = (h) => d((g) => g.includes(h) ? g.filter((f) => f !== h) : [...g, h]), y = (h) => `segment-studio-publish-approved-${h.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && !t && a();
    },
    onKeyDownCapture: (h) => Rt(h, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: Jt,
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
      ].flatMap(([h, g]) => [
        n("dt", { key: `${h}:label`, className: "text-secondary" }, h),
        n("dd", { key: `${h}:value`, className: "font-semibold text-foreground" }, String(g))
      ])),
      s.length ? n("div", { key: "groups", className: "space-y-2" }, s.map((h) => {
        const g = l.includes(h.key);
        return n("section", { key: h.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": g,
            "aria-controls": y(h),
            onClick: () => p(h.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: $r(!1) }
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, g ? "▾" : "▸"),
            n("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, h.tagName),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${h.drafts.length} draft${h.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          g ? n("div", {
            key: "drafts",
            id: y(h),
            className: "divide-y divide-border border-t border-border"
          }, h.drafts.map((f) => {
            const k = f.endSec == null ? De(f.startSec) : `${De(f.startSec)} – ${De(f.endSec)}`, C = `${Kt(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`;
            return n("div", { key: f.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(dn, { key: "review", state: f.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, k),
              n("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: C
              }, C)
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
function Dc({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = Ul(e), [s, l] = U(() => /* @__PURE__ */ new Set()), [d, c] = U(() => new Set(a.map((f) => f.key))), m = a.flatMap((f) => d.has(f.key) ? f.candidates : []), p = (f) => l((k) => {
    const C = new Set(k);
    return C.has(f) ? C.delete(f) : C.add(f), C;
  }), y = (f) => c((k) => {
    const C = new Set(k);
    return C.has(f) ? C.delete(f) : C.add(f), C;
  }), h = (f) => f.assignment.map(({ slot: k, performer: C }) => `${k.label || `Slot ${k.sortOrder + 1}`}: ${C.name}`).join(", "), g = (f) => `segment-studio-auto-assign-${f.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (f) => {
      f.target === f.currentTarget && !t && i();
    },
    onKeyDownCapture: (f) => {
      f.key === "Enter" && f.target instanceof HTMLInputElement || Rt(f, {
        onCancel: t ? void 0 : i,
        onConfirm: m.length && !t ? () => o(m) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: Jt,
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
      e.length ? n("div", { className: "space-y-3" }, a.map((f) => n("section", { key: f.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
        n("header", {
          key: "header",
          className: "flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2",
          style: { background: $r(!1) }
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
            "aria-controls": g(f),
            "aria-label": `${s.has(f.key) ? "Collapse" : "Expand"} ${f.tagName} assignment: ${h(f)}`,
            onClick: () => p(f.key),
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
            f.assignment.map(({ slot: k, performer: C }) => {
              const u = k.label || `Slot ${k.sortOrder + 1}`;
              return n("span", {
                key: k.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${u}: ${C.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${u}: ${C.name}`
                }, `${u}: ${C.name}`),
                n(Qn, {
                  key: "avatar",
                  performer: { id: C.performerId, name: C.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(tn, { key: "states", counts: f.counts }),
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
          { key: "segments", id: g(f), className: "divide-y divide-border/70" },
          f.candidates.map((k) => {
            const C = k.endSec == null ? De(k.startSec) : `${De(k.startSec)} – ${De(k.endSec)}`, u = `${Kt(k.sourceKey)}${k.confidence == null ? "" : ` · ${Math.round(k.confidence * 100)}%`}`;
            return n("div", {
              key: k.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(dn, { key: "review", state: k.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                k.tagName || "Tag segment"
              ),
              n(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                C
              ),
              n("span", {
                key: "provenance",
                className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                title: u
              }, u)
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
function Oc({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
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
    onKeyDownCapture: Jt,
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
function Pc({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = U(!1), d = me(null);
  if (ho({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : De(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && a();
    },
    onKeyDownCapture: (m) => Rt(m, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: Jt,
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
function Lc(e) {
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
function Fc({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var p, y;
  const l = e ? e.createCount + e.linkCount : 0, d = me(null);
  ho({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((p = e == null ? void 0 : e.outputs) == null ? void 0 : p.slice(0, 200)) || [], m = Lc(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && !r && s();
    },
    onKeyDownCapture: (h) => Rt(h, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: Jt,
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
        ].flatMap(([h, g]) => [
          n("dt", { key: `${h}:label`, className: "text-secondary" }, h),
          n("dd", { key: `${h}:value`, className: "font-semibold text-foreground" }, String(g))
        ])),
        e.conflictCount > 0 ? n(
          "p",
          { key: "conflicts", role: "status", className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground" },
          `${e.conflictCount} existing derivation ${e.conflictCount === 1 ? "branch was" : "branches were"} skipped because its lineage no longer matches the active rule. Resolve these through lineage maintenance.`
        ) : null,
        m.length ? n("div", { key: "outputs", className: "space-y-2" }, [
          ...m.map((h) => n("article", {
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
              h.outputs.map((g, f) => n("div", {
                key: `${g.ruleId}:${g.depth}:${f}`,
                className: "flex min-w-0 items-center gap-2 text-sm",
                style: { marginLeft: `${Math.max(0, g.depth - 1) * 1.25}rem` }
              }, [
                n("span", { key: "branch", "aria-hidden": "true", className: "shrink-0 text-secondary" }, "↳"),
                n(
                  "span",
                  { key: "tags", className: "min-w-0 flex-1 truncate text-foreground" },
                  `${g.sourceTagName} → ${g.derivedTagName}`
                ),
                n("span", { key: "depth", className: "shrink-0 text-[11px] text-secondary" }, `Level ${g.depth}`),
                n(
                  "span",
                  { key: "action", className: "shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-foreground" },
                  g.action === "create" ? "Create" : "Link existing"
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
function jc({
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
  selectedPerformerSlots: p,
  performerSlots: y,
  detail: h,
  video: g,
  slotButtonRef: f,
  tagSearchRef: k,
  onDetailChange: C,
  setSaveMessage: u,
  acquireSaveLock: j,
  onSlotsChanged: W,
  onRecordHistory: G,
  onCancelQueuedReview: B,
  splitSegment: R,
  duplicateSegment: I,
  provenance: N,
  lineage: S,
  onNavigateLineageItem: M,
  tagEditing: z,
  onCancelTagEditing: A,
  detailPanelRef: E,
  onReduceSelection: K
}) {
  var fe, Ce, Pe, pe;
  const Y = me(null), _ = me(null), re = () => {
    var Q;
    (Q = _.current) == null || Q.call(_), _.current = null;
  }, de = me(null), ve = me(null), D = me(null), le = me(null), [se, X] = U(!1);
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
    const Q = !r.some((J) => J.isDerived), he = e && m ? yd(y, r) : null, T = (he == null ? void 0 : he.map((J, $) => {
      var b;
      const v = r[$];
      return {
        segmentId: v.nativeSegmentId,
        itemId: v.published ? null : v.itemId,
        revision: (b = h.performerSlotRevisions) == null ? void 0 : b[v.id],
        slots: J
      };
    })) || [];
    return n(lo.Fragment, null, [
      n(mc, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: E,
        onReduceSelection: K,
        reviewable: e,
        tagEditable: Q,
        slotsEditable: T.length > 0 && a == null,
        onEditSlots: () => X(!0),
        slotButtonRef: f,
        saveMessage: i
      }),
      z && Q ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (J) => {
          J.target === J.currentTarget && A();
        },
        onKeyDownCapture: (J) => Rt(J, { onCancel: A })
      }, n("section", {
        ref: k,
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
        n(Vn, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (J, $) => J == null ? A() : l(J, $ == null ? void 0 : $.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: A,
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
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(lc, {
          videoId: g.id,
          targets: T,
          performerCandidates: h.performerCandidates || [],
          shortcutRef: le,
          acquireSaveLock: () => j("slots", -1),
          onSaved: async ({ beforeState: J, afterState: $ }) => {
            await G(
              "performer-slots.assign",
              `Assigned performers to ${T.length} segments`,
              J,
              $
            ), ye(), await W();
          },
          onConflict: W
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (Q) => {
      Y.current = Q, E && (E.current = Q);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(dn, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(Ar, { key: "derived" }) : null,
        t && z ? n("div", {
          key: "tag-editor",
          ref: k,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (Q) => {
            Q.key === "Escape" && (Q.preventDefault(), Q.stopPropagation(), A());
          },
          onKeyDown: (Q) => {
            gd(Q, t.tagName) && (Q.preventDefault(), Q.stopPropagation(), l(t.tagId));
          }
        }, n(Vn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (Q, he) => Q == null ? A() : l(Q, he == null ? void 0 : he.label),
          disabled: wl(a, t.id, s) || ((fe = S.data) == null ? void 0 : fe.tagReadOnly) === !0,
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
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(ac, { status: c })) : null,
      t && m && p.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(xa, {
        assignments: p.map((Q) => {
          const he = xd(Q);
          return {
            key: String(Q.slotDefinitionId),
            label: he.label,
            performer: he.filled ? { id: Number(Q.performerId), name: he.performer } : null,
            title: he.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(uc, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: N
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
              onClick: () => M(Q.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${Q.ruleKey} ${Q.ruleVersion}`))
          ]) : null,
          (Pe = S.data.children) != null && Pe.length ? n("p", { key: "children" }, `Children: ${S.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: f,
          type: "button",
          disabled: a != null || !m || p.length === 0,
          onClick: () => X(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: m ? p.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, p.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: R,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        n("button", {
          key: "duplicate",
          type: "button",
          disabled: a != null,
          onClick: () => I(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        n("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: a != null,
          onClick: () => I(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    se && e && t && m && p.length > 0 ? n("div", {
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
            var $;
            return ($ = ve.current) == null ? void 0 : $.click();
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
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(sc, {
        key: `${t.id}:${h.performerSlotsRevision || h.slotRevision || ""}`,
        videoId: g.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: p,
        revision: (pe = h.performerSlotRevisions) == null ? void 0 : pe[t.id],
        performerCandidates: h.performerCandidates || [],
        confirmRef: ve,
        shortcutRef: D,
        onOptimisticSave: (Q) => {
          const he = j("slots", t.id);
          if (!he)
            return u("Wait for the current save to finish before saving performer slots."), !1;
          _.current = he, C((T) => Xt(
            T,
            t.id,
            Q
          ), g.id), u("Saving performer slots…"), ye();
        },
        onSaved: async (Q, { beforeState: he, afterState: T }) => {
          C((J) => Xt(
            J,
            t.id,
            Q.slots || [],
            Q.revision
          ), g.id), u("Performer slots saved.");
          try {
            await G(
              "performer-slots.assign",
              "Assigned performers",
              he,
              T
            ), await W(Q) || B([t]);
          } finally {
            re();
          }
        },
        onRollback: async (Q, he) => {
          B([t]), C((T) => {
            var J;
            return Xt(
              T,
              t.id,
              Q,
              (J = h.performerSlotRevisions) == null ? void 0 : J[t.id]
            );
          }, g.id), u(he.message || "Unable to save performer slots.");
          try {
            he.status === 409 && await W();
          } finally {
            re();
          }
        },
        onConflict: W
      }))
    ])) : null
  ]);
}
function Gc({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: m, onZoomChange: p, onSelectGroup: y, onToggleGroup: h, onSelect: g, onSelectSegments: f, onSelectAll: k, onConfigureTag: C, onSeekTime: u, centerRef: j, showReviewState: W = !0, swimlaneTitleWidth: G, onSwimlaneTitleWidthChange: B }) {
  const R = me(null), I = me(null), [N, S] = U(0), [M, z] = U({ scrollTop: 0, height: 320 }), [A, E] = U(null), K = ze(
    () => sn(e, r, o),
    [e, r, o]
  ), Y = ze(
    () => ya(o),
    [o]
  ), _ = ze(() => So(K), [K]), re = ze(
    () => Id(_, i, ba(_)),
    [_, i]
  ), de = ze(
    () => ha(re.rows, Math.max(0, M.scrollTop - 24), M.height),
    [re, M]
  ), ve = Math.max(0, Number(d) || 0), D = Hs(N), le = hr(G, D), se = le / 16, X = zs(c, ve, se), ye = js(ve), fe = Gs(ve, Math.max(1, N - se * 16), m), Ce = ye.filter((b, x) => x === 0 || x % fe === 0), Pe = ze(() => K.map((b) => `${b.key}:${b.trackCount}:${b.markers.map(({ segment: x, track: P }) => `${x.id}:${x.startSec}:${x.endSec ?? ""}:${P}`).join(",")}`).join("|"), [K]);
  function pe() {
    const b = I.current;
    if (!b) return;
    const x = b.querySelector("[data-timeline-track]"), P = b.firstElementChild, te = x == null ? void 0 : x.getBoundingClientRect(), ne = P == null ? void 0 : P.getBoundingClientRect(), L = te && ne ? Math.max(0, te.left - ne.left) : se * 16, oe = (ne == null ? void 0 : ne.width) ?? b.scrollWidth;
    b.scrollTo({
      left: Ks(c, ve, oe, b.clientWidth, L, _i),
      behavior: "smooth"
    });
  }
  ge(() => (j.current = pe, () => {
    j.current === pe && (j.current = null);
  })), ge(() => {
    pe();
  }, [m]);
  function Q() {
    const b = I.current, x = re.rows.find((oe) => oe.kind === "lane" && oe.lane.markers.some(({ segment: w }) => w.id === s));
    if (!b || !x) return;
    const P = 24, te = x.top + P, ne = te + x.height;
    let L = b.scrollTop;
    te < b.scrollTop + P ? L = Math.max(0, te - P) : ne > b.scrollTop + b.clientHeight && (L = Math.max(0, ne - b.clientHeight)), L !== b.scrollTop && (b.scrollTop = L), z({ scrollTop: L, height: b.clientHeight });
  }
  ge(() => {
    Q();
  }, [s, Pe, re]), ge(() => {
    const b = I.current, x = re.rows.find((oe) => oe.kind === "group" && oe.group.key === a);
    if (!b || !x) return;
    const P = 24, te = x.top + P, ne = te + x.height;
    let L = b.scrollTop;
    te < b.scrollTop + P ? L = Math.max(0, te - P) : ne > b.scrollTop + b.clientHeight && (L = Math.max(0, ne - b.clientHeight)), L !== b.scrollTop && (b.scrollTop = L), z({ scrollTop: L, height: b.clientHeight });
  }, [a, re]), ge(() => {
    const b = I.current;
    if (!b || typeof ResizeObserver > "u") return;
    const x = () => {
      S(b.clientWidth), z({ scrollTop: b.scrollTop, height: b.clientHeight }), Q();
    }, P = new ResizeObserver(x);
    return P.observe(b), x(), () => P.disconnect();
  }, [s, Pe, re]);
  function he(b) {
    if (!(ve > 0)) return;
    const x = b.currentTarget.getBoundingClientRect(), P = Math.min(1, Math.max(0, (b.clientX - x.left) / x.width));
    u(P * ve);
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
    Object.hasOwn(x, b.key) && (P = c + x[b.key]), b.key === "Home" && (P = 0), b.key === "End" && (P = ve), P != null && (b.preventDefault(), b.stopPropagation(), u(Math.min(ve, Math.max(0, P))));
  }
  function J(b) {
    var P;
    const x = (P = R.current) == null ? void 0 : P.getBoundingClientRect();
    x && B(hr(b.clientX - x.left, D));
  }
  function $(b) {
    const x = b.shiftKey ? 40 : 16;
    let P = null;
    b.key === "ArrowLeft" && (P = le - x), b.key === "ArrowRight" && (P = le + x), b.key === "Home" && (P = 160), b.key === "End" && (P = D), P != null && (b.preventDefault(), b.stopPropagation(), B(hr(P, D)));
  }
  const v = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: R,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (b) => {
          (b.metaKey || b.ctrlKey) && (b.preventDefault(), k == null || k());
        },
        onKeyDown: (b) => {
          b.key !== "Enter" && b.key !== " " || (b.preventDefault(), k == null || k());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: v, disabled: m <= 1, onClick: () => p(wr(m - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: v, disabled: m === 1, onClick: () => p(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(m * 100)}%`),
      n("button", { key: "in", type: "button", className: v, disabled: m >= 8, onClick: () => p(wr(m + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
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
      onKeyDown: $,
      onDoubleClick: () => B(Tt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${le - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: I,
      onScroll: (b) => z({
        scrollTop: b.currentTarget.scrollTop,
        height: b.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: _s(m) }, [
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
          className: `absolute top-0 ${Bs(x, Ce.length, ve > 0 ? b / ve * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Us(x, Ce.length, ve > 0 ? b / ve * 100 : 0)
        }, De(b))).concat(t.map((b) => {
          const x = ve > 0 ? b.startSec / ve * 100 : 0;
          return n("button", {
            key: `shot-boundary:${b.startSec}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${De(b.startSec)} – ${De(b.endSec)}`,
            title: `Shot boundary · ${b.source || "manual"} · ${De(b.startSec)} – ${De(b.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${x}%`, width: "2px" },
            onClick: (P) => {
              P.stopPropagation(), u(b.startSec);
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
            ...Qo(X),
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
        style: K.length > 0 ? { height: re.height } : void 0
      }, [
        K.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...Qo(X, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        K.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : de.map((b) => {
          var q;
          const x = b.group, P = i.includes(x.key), te = a === x.key, ne = $r(te);
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
              onClick: (F) => {
                if (F.metaKey || F.ctrlKey) {
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
                W ? n(tn, { key: "states", counts: x.counts }) : null
              ] : null
            )
          ]);
          const L = b.lane, oe = sd(b.laneIndex), w = L.markers.some(({ segment: F }) => F.id === s);
          return n("div", {
            key: b.key,
            "data-grouped-swimlane": x.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${se}rem minmax(0,1fr)`,
              top: b.top,
              height: b.height,
              backgroundColor: oe
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": w ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: ld(w, oe),
              title: `${Yn(L)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Yn(L),
              onClick: (F) => {
                (F.metaKey || F.ctrlKey) && f(L.markers.map((Z) => Z.segment.id));
              },
              onMouseEnter: () => E(L.key),
              onMouseLeave: () => E((F) => F === L.key ? null : F)
            }, [
              L.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (F) => {
                  F.stopPropagation(), C({ tagId: L.tagId, tagName: L.label, trigger: F.currentTarget });
                },
                "aria-label": `Configure ${L.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: A === L.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, L.label),
              (q = L.performers) != null && q.length ? n(Rr, {
                key: "performers",
                performers: L.performers,
                performerAssignments: L.performerAssignments
              }) : null,
              W ? n(tn, { key: "counts", counts: L.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, L.markers.map(({ segment: F, track: Z }) => {
              var ht;
              const be = Yr(F.startSec, ve), ue = F.endSec == null ? F.startSec : Math.max(F.startSec, F.endSec), $e = Math.max(0, Yr(ue, ve) - be), pt = l.includes(F.id), Be = F.id === s, Te = xo(Y.get(F.id)), Ye = F.endSec == null ? De(F.startSec) : `${De(F.startSec)} – ${De(F.endSec)}`, it = (ht = pa[Te]) == null ? void 0 : ht.label;
              return n("button", {
                key: F.id,
                type: "button",
                onClick: (Xe) => {
                  Xe.stopPropagation(), g(F, {
                    additive: Xe.metaKey || Xe.ctrlKey,
                    rangeSegmentIds: Xe.shiftKey ? L.markers.map((yt) => yt.segment.id) : null
                  });
                },
                "aria-pressed": pt,
                "aria-current": Be ? "true" : void 0,
                "data-selected-timeline-marker": Be ? "true" : void 0,
                "data-selected-segment-shortcut-target": Be ? "true" : void 0,
                "aria-label": W ? `${F.tagName || "Tag segment"}${L.performerLabel ? `, ${L.performerLabel}` : ""}, ${F.reviewState}${it ? `, ${it}` : ""}, ${Ye}` : `${F.tagName || "Tag segment"}${L.performerLabel ? `, ${L.performerLabel}` : ""}, ${Ye}`,
                title: W ? `${F.tagName || "Tag segment"}${L.performerLabel ? ` · ${L.performerLabel}` : ""} · ${F.reviewState}${it ? ` · ${it}` : ""} · ${Ye}` : `${F.tagName || "Tag segment"}${L.performerLabel ? ` · ${L.performerLabel}` : ""} · ${Ye}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...W ? od(F.reviewState, pt, Te, Be) : id(pt, Be),
                  left: `${be}%`,
                  top: `${dd(Z)}rem`,
                  width: ad(F.endSec, $e),
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
function No({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = U(null), [l, d] = U([]), [c, m] = U(null), [p, y] = U(""), [h, g] = U(!0), [f, k] = U(null), [C, u] = U(""), [j, W] = U(!1), G = me(null), B = me(0);
  ge(() => {
    const A = requestAnimationFrame(() => {
      var E;
      return (E = G.current) == null ? void 0 : E.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(A);
  }, [e]), ge(() => {
    const A = new AbortController();
    return g(!0), u(""), Promise.all([
      r ? ee(`/slot-definitions/${e}`, { signal: A.signal }) : Promise.resolve(null),
      ee("/segment-groups", { signal: A.signal })
    ]).then(([E, K]) => {
      const Y = K.find((_) => (_.tags || []).some((re) => Number(re.tagId) === Number(e)));
      s(E), d(K), m((Y == null ? void 0 : Y.id) ?? null), y(Y == null ? "" : String(Y.id)), W(!1);
    }).catch((E) => {
      E.name !== "AbortError" && u(E.message || "Unable to load tag configuration.");
    }).finally(() => {
      A.signal.aborted || g(!1);
    }), () => A.abort();
  }, [r, e]);
  function R(A, E) {
    s({
      ...a,
      definitions: a.definitions.map((K, Y) => Y === A ? { ...K, ...E } : K)
    });
  }
  function I(A, E) {
    const K = A + E;
    if (K < 0 || K >= a.definitions.length) return;
    const Y = [...a.definitions];
    [Y[A], Y[K]] = [Y[K], Y[A]], s({
      ...a,
      definitions: Y.map((_, re) => ({ ..._, sortOrder: re }))
    });
  }
  function N(A) {
    const E = a.definitions[A], K = Number(E.assignmentCount) || 0, Y = K === 0 ? "" : ` and its ${K} assignment${K === 1 ? "" : "s"}`;
    window.confirm(`Delete “${It(E)}”${Y}?`) && (K > 0 && W(!0), s({
      ...a,
      definitions: a.definitions.filter((_, re) => re !== A).map((_, re) => ({ ..._, sortOrder: re }))
    }));
  }
  async function S() {
    var E;
    k("slots"), u("Saving performer slots…");
    let A;
    try {
      A = await ee(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: j,
          definitions: a.definitions.map((K, Y) => {
            var _;
            return {
              id: K.id || void 0,
              label: ((_ = K.label) == null ? void 0 : _.trim()) || null,
              sortOrder: Y,
              genderHints: K.genderHints || []
            };
          })
        })
      }), s(A), W(!1);
    } catch (K) {
      K.status === 409 ? (u("Performer slots changed elsewhere; current values were reloaded."), (E = K.payload) != null && E.current && (s(K.payload.current), W(!1))) : u(K.message || "Unable to save performer slots."), k(null);
      return;
    }
    try {
      await o(), u("Performer slots saved.");
    } catch {
      u("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      k(null);
    }
  }
  async function M() {
    const A = p === "" ? null : Number(p);
    if (A !== c) {
      k("group"), u("Saving tag group…");
      try {
        await ee(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: A })
        });
      } catch (E) {
        u(E.message || "Unable to assign the tag group."), k(null);
        return;
      }
      try {
        const [E, K] = await Promise.allSettled([
          ee("/segment-groups"),
          o()
        ]);
        if (E.status === "fulfilled") {
          d(E.value);
          const Y = E.value.find((re) => (re.tags || []).some((de) => Number(de.tagId) === Number(e))), _ = (Y == null ? void 0 : Y.id) ?? null;
          m(_), y(_ == null ? "" : String(_));
        }
        u(
          E.status === "fulfilled" && K.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        k(null);
      }
    }
  }
  l.find((A) => Number(A.id) === Number(c));
  const z = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (A) => {
      A.target === A.currentTarget && !f && i();
    },
    onKeyDownCapture: (A) => Rt(A, {
      onCancel: f ? void 0 : i
    })
  }, n("section", {
    ref: G,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: Jt,
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
            value: p,
            disabled: f != null,
            onChange: (A) => y(A.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((A) => n("option", { key: A.id, value: String(A.id) }, A.name))
          ])
        ]),
        h ? null : n("button", {
          key: "save",
          type: "button",
          disabled: f != null || (p === "" ? null : Number(p)) === c,
          onClick: M,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, f === "group" ? "Saving…" : "Save tag group")
      ]),
      r ? n("section", { key: "slots", className: "space-y-3 border-t border-border pt-5", "aria-labelledby": "inline-tag-slots-heading" }, [
        n("div", { key: "heading" }, [
          n("h3", { key: "title", id: "inline-tag-slots-heading", className: "text-sm font-semibold text-foreground" }, "Performer slots"),
          n("p", { key: "copy", className: "text-xs text-secondary" }, "Define the ordered performer roles used by this tag.")
        ]),
        h ? n("p", { key: "loading", className: "rounded-md border border-dashed border-border p-4 text-sm text-secondary" }, "Loading performer slots…") : a ? n("div", { key: "editor", className: "space-y-3" }, [
          n("label", { key: "duplicates", className: "flex items-center gap-2 text-sm" }, [
            n("input", {
              key: "input",
              type: "checkbox",
              checked: !!a.allowSamePerformerInMultipleSlots,
              disabled: f != null,
              onChange: (A) => s({ ...a, allowSamePerformerInMultipleSlots: A.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((A, E) => n("article", {
            key: A.id || A._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: A.label || "",
                disabled: f != null,
                onChange: (K) => R(E, { label: K.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Os.map((K) => n("label", { key: K, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: f != null,
                  checked: (A.genderHints || []).includes(K),
                  onChange: (Y) => R(E, {
                    genderHints: Y.target.checked ? [.../* @__PURE__ */ new Set([...A.genderHints || [], K])] : (A.genderHints || []).filter((_) => _ !== K)
                  })
                }),
                n("span", { key: "text" }, Tr(K))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${A.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: f != null || E === 0, onClick: () => I(E, -1), className: z, "aria-label": `Move ${It(A)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: f != null || E === a.definitions.length - 1, onClick: () => I(E, 1), className: z, "aria-label": `Move ${It(A)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: f != null, onClick: () => N(E), className: `${z} text-red-300` }, "Delete")
            ])
          ])),
          n("div", { key: "buttons", className: "flex items-center gap-2" }, [
            n("button", {
              key: "add",
              type: "button",
              disabled: f != null,
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
              className: z
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
      C ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, C) : null
    ]),
    n(
      "footer",
      { key: "footer", className: "flex items-center justify-end border-t border-border px-5 py-4" },
      n("button", {
        type: "button",
        disabled: f != null,
        onClick: i,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Close")
    )
  ]));
}
function Bc(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function Uc(e) {
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, approvalFacetCounts: i, autoAssignCandidates: a, autoAssignError: s, autoAssignOpen: l, autoAssignPerformers: d, autoAssigning: c, cancelQueuedReviewsForSegments: m, canMoveSelectionToBin: p, captureTrainingExport: y, centerTimelineRef: h, closeEditorFilters: g, closeFirstSegmentTagDialog: f, closeMaterializeDialog: k, closeMergeConfirmation: C, closePublishApprovedDialog: u, closeTagEditing: j, collapsedSegmentGroups: W, commonActionsRef: G, compatibilityMode: B, configuringTag: R, createSegment: I, creatingSegmentId: N, currentTime: S, deleteRejectedSegments: M, detail: z, detailPanelRef: A, detailWidth: E, duplicateSegment: K, editorFilters: Y, editorLayout: _, editorRef: re, exportingExamples: de, filtersButtonRef: ve, filtersOpen: D, firstSegmentTagOpen: le, focusRowRef: se, handleSeparatorKeyDown: X, handleSeparatorPointerDown: ye, handleSeparatorPointerMove: fe, hasNextUnreviewed: Ce, hasPreviousUnreviewed: Pe, hideDerivedSegments: pe, history: Q, historyOpen: he, historySaving: T, horizontalLayoutSize: J, importNativeSegments: $, incorrectExamples: v, incorrectExamplesOpen: b, lineage: x, markerRailWidth: P, materializeButtonRef: te, materializeCancelButtonRef: ne, materializeDerivedSegments: L, materializeError: oe, materializeLoading: w, materializeOpen: q, materializePreview: F, materializing: Z, mediaStackRef: be, mergeCancelButtonRef: ue, mergeConfirmation: $e, mergeSaving: pt, mergeSelectedSwimlane: Be, nativeImportState: Te, onDetailChange: Ye, onNavigate: it, onReload: ht, onSlotsChanged: Xe, openPublishApprovedDialog: yt, panelSeparatorProps: ut, pendingInitialSeekRef: je, performerSlots: Qe, performerSlotsAvailable: qe, playbackControlsRef: Je, previewDerivedSegments: st, provenance: Ot, provenanceSources: V, publishApprovedCancelButtonRef: ie, publishApprovedDrafts: Re, publishApprovedError: Ne, publishApprovedOpen: Se, quickSearchOpen: et, railScrollRef: Ue, railToggleRef: Ze, recordHistoryAction: Ae, rejectedDeletionPreview: Ee, removeIncorrectExample: We, removingExampleId: Me, restoreHistoryTarget: Fe, runEditorAction: tt, saveMessage: ke, saveTag: Le, saveTiming: Oe, savingSegmentId: ft, seekRef: Ve, segmentGroups: lt, segmentRailLayout: Pt, segments: at, selectAllVideoSegments: Ie, selectSegment: we, selectSegmentCollection: nt, selectedGroups: At, selectedPerformerSlots: mt, selectedSegment: vt, selectedSegmentGroupKey: bt, selectedSegmentIds: Lt, selectedSegments: zt, selectedSlotStatus: Er, setAutoAssignError: Rn, setAutoAssignOpen: An, setConfiguringTag: cn, setCurrentTime: rn, setEditorFilters: un, setEditorLayout: er, setFiltersOpen: Mr, setHideDerivedSegments: tr, setHistoryOpen: En, setIncorrectExamplesOpen: mn, setQuickSearchOpen: gn, setRailViewport: nr, setRejectedDeletionPreview: pn, setSaveMessage: Dr, setSelectedSegmentGroupKey: Mn, setSelectedSegmentId: Dn, setShortcutsOpen: Zt, setTimelineZoom: On, shotBoundaries: Pn, shortcutsOpen: xt, slotButtonRef: rr, splitLayout: Ft, splitSegment: or, stepVideoFrame: Ln, tagEditing: Fn, tagSearchRef: jn, timelineDuration: Or, timelineRatioBounds: ir, timelineZoom: Gn, toggleSegmentGroup: fn, toggleSegmentRail: Bn, updateTimelineRatio: ot, video: Ge, videoPerformers: ar, visibleCounts: Pr, visibleSegmentRailRows: _t, visibleSegments: St, wideLayout: on, workspaceRef: Un } = e, yn = ze(
    () => at.filter((H) => !H.published && H.reviewState === "approved"),
    [at]
  ), bn = $s(uo), hn = yn.length, sr = me(null), lr = ze(() => () => En(!1), [En]), Kn = F ? F.createCount + F.linkCount : null, Ht = ft != null, Et = zt.length > 0, jt = zt.length === 1, Lr = Et && zt.every((H) => H.reviewState === "approved"), Fr = Et && zt.every((H) => H.reviewState === "rejected"), jr = [
    { id: "marker.create", label: "New segment", disabled: Ht },
    { id: "marker.editTag", label: "Edit tag", disabled: Ht || !Et },
    { id: "marker.setStart", label: "Set start", disabled: Ht || !jt },
    { id: "marker.setEnd", label: "Set end", disabled: Ht || !jt },
    { id: "marker.split", label: "Split", disabled: Ht || !jt },
    ...B ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !Pe, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Lr ? "Unapprove" : "Approve", disabled: Ht || !Et, tone: "approve" },
      { id: "marker.reject", label: Fr ? "Unreject" : "Reject", disabled: Ht || !Et, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !Ce, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...B ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: Ht || !p, tone: "reject" }
    ]
  ];
  function Gr(H) {
    const xe = Lt.includes(H.id), Ct = H.id === (vt == null ? void 0 : vt.id), ce = H.endSec == null ? De(H.startSec) : `${De(H.startSec)} – ${De(H.endSec)}`, kt = `${Kt(H.sourceKey)}${H.confidence != null ? ` · ${Math.round(H.confidence * 100)}%` : ""}`;
    return n("button", {
      key: H.id,
      type: "button",
      onClick: (qt) => we(H, { additive: qt.metaKey || qt.ctrlKey }),
      "aria-pressed": xe,
      "aria-current": Ct ? "true" : void 0,
      "data-selected-segment-shortcut-target": Ct ? "true" : void 0,
      "aria-label": B ? `${H.tagName || "Tag segment"}, ${H.reviewState}${H.isDerived ? ", derived segment" : ""}, ${ce}` : `${H.tagName || "Tag segment"}${H.isDerived ? ", derived segment" : ""}, ${ce}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: ga(xe, Ct)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        B ? n(dn, { key: "review", state: H.reviewState, includeLabel: !1 }) : null,
        H.isDerived ? n(Ar, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          H.tagName || "Tag segment"
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
  const vn = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", gt = [...Q.actions || []].reverse().find((H) => H.sequence <= Q.cursorSequence);
  return n("section", {
    ref: re,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${Ft ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "relative flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (H) => Aa(H, it, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${Ge.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: Ge.title || `Video ${Ge.id}`
          }, Ge.title || `Video ${Ge.id}`)),
          ...ar.map((H) => n(Qn, {
            key: ct(H),
            performer: { id: ct(H), name: H.name },
            compact: !0,
            tooltip: H.name
          })),
          B ? n(tn, { key: "review-counts", counts: Pr }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          B ? null : n(Da, { key: "bin", onNavigate: it, compact: !0 }),
          n(Oa, { key: "settings", onNavigate: it, compact: !0 })
        ])
      ]),
      B && z.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${z.nativeImportCount} Cove segment${z.nativeImportCount === 1 ? "" : "s"} ${z.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        Te.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, Te.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => $("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => $("approved"),
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
          Ge != null && Ge.id ? n(Wl, {
            key: "extension-actions",
            entityType: "video",
            entityId: Ge.id,
            pageType: Ds,
            renderMode: "toolbar"
          }) : null,
          B ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: ft != null || a.length === 0,
            onClick: () => {
              Rn(""), An(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${a.length ? ` (${a.length})` : ""}`) : null,
          B ? n("button", {
            key: "materialize-derived",
            ref: te,
            type: "button",
            disabled: ft != null || w || Z || Kn === 0,
            onClick: st,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, w ? "Analyzing…" : `Auto-Materialize${Kn != null ? ` (${Kn})` : ""}`) : null,
          B ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: ft != null || hn === 0,
            onClick: (H) => yt(H.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": Se,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${hn ? ` (${hn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: de || Me != null || v.length === 0,
            onClick: () => mn(!0),
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
            onClick: () => Mr(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": D,
            className: `${vn} ${r ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(br, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${r ? ` (${r})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => Zt(!0),
            className: vn
          }, [n(br, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            ref: sr,
            type: "button",
            disabled: (B ? Q.actions.length === 0 : gt == null) || ft != null || T,
            onClick: B ? () => En((H) => !H) : () => Fe(
              gt.sequence - 1
            ),
            "aria-controls": B ? Pa : void 0,
            "aria-expanded": B ? he : void 0,
            className: vn
          }, [
            n(br, { key: "icon", name: "history" }),
            n("span", { key: "label" }, B ? `History${Q.actions.length ? ` (${Q.actions.length})` : ""}` : gt ? `Undo ${gt.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: Ze,
            type: "button",
            onClick: Bn,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": _.markerRailOpen,
            className: vn
          }, [
            n(br, { key: "icon", name: "list" }),
            n("span", { key: "label" }, _.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ]),
      B && he ? n($c, {
        key: "history-popover",
        history: Q,
        historySaving: T,
        anchorRef: sr,
        onRestore: Fe,
        onClose: lr
      }) : null
    ]),
    D ? n(Cc, {
      key: "editor-filters",
      filters: Y,
      hideDerivedSegments: pe,
      performers: ar,
      provenanceSources: V,
      reviewCounts: i,
      segments: at,
      segmentGroups: lt,
      reviewMode: B,
      onChange: un,
      onHideDerivedChange: tr,
      onClose: g
    }) : null,
    le ? n(Ic, {
      key: "first-segment-tag-dialog",
      saving: ft != null,
      error: ke,
      onSelect: (H, xe) => I(H, xe),
      onClose: f
    }) : null,
    et ? n(Ac, {
      key: "quick-search-dialog",
      segments: zl(o),
      onSelect: (H) => {
        gn(!1), we(H, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        gn(!1), requestAnimationFrame(() => {
          var H;
          return (H = re.current) == null ? void 0 : H.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    l ? n(Dc, {
      key: "auto-assign-dialog",
      candidates: a,
      processing: c,
      error: s,
      onConfirm: d,
      onClose: () => An(!1)
    }) : null,
    $e ? n(Pc, {
      key: "merge-selection-dialog",
      merge: $e,
      processing: pt,
      undoable: !B,
      cancelButtonRef: ue,
      onConfirm: (H) => Be(!0, H, $e),
      onClose: C
    }) : null,
    q ? n(Fc, {
      key: "materialize-derived-dialog",
      preview: F,
      loading: w,
      processing: Z,
      error: oe,
      cancelButtonRef: ne,
      onConfirm: L,
      onClose: () => {
        Z || k();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: Un,
      className: `${Ft ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      _.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: on ? { position: "absolute", top: 0, right: 0, width: P, height: J.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        at.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : St.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: Ue,
          onScroll: (H) => nr({
            scrollTop: H.currentTarget.scrollTop,
            height: H.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: Pt.height }
        }, _t.map((H) => {
          var Ct;
          let xe;
          if (H.kind === "group") {
            const ce = W.includes(H.group.key), kt = H.group.lanes.reduce((qt, dr) => qt + dr.markers.length, 0);
            xe = n("button", {
              type: "button",
              onClick: () => {
                Mn(H.group.key), fn(H.group.key);
              },
              "aria-expanded": !ce,
              "aria-current": bt === H.group.key ? "true" : void 0,
              "data-segment-rail-group": H.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${bt === H.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, ce ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: H.group.name }, H.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, kt),
              B && ce ? n(tn, { key: "states", counts: H.group.counts }) : null
            ]);
          } else H.kind === "lane" ? xe = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Yn(H.lane),
            "aria-label": Yn(H.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, H.lane.label),
            (Ct = H.lane.performers) != null && Ct.length ? n(Rr, {
              key: "performers",
              performers: H.lane.performers,
              performerAssignments: H.lane.performerAssignments
            }) : null,
            B ? n(tn, { key: "states", counts: H.lane.counts }) : null
          ]) : xe = Gr(H.segment);
          return n("div", {
            key: H.key,
            className: "absolute left-0 right-0",
            style: { top: H.top, height: H.height }
          }, xe);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${Ft ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: be,
          className: `${Ft ? "min-h-0 flex-1" : ""} grid`,
          style: Ft ? {
            gridTemplateRows: `minmax(16rem, ${(1 - _.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${_.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: se,
            className: "grid min-h-0 gap-2",
            style: on ? {
              gridTemplateColumns: _.markerRailOpen ? `${E}px 0.5rem minmax(0,1fr) 0.5rem ${P}px` : `${E}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(jc, {
              key: "tools",
              compatibilityMode: B,
              selectedSegment: vt,
              selectedSegments: zt,
              selectedGroups: At,
              saveMessage: ke,
              savingSegmentId: ft,
              creatingSegmentId: N,
              acquireSaveLock: t,
              setSaveMessage: Dr,
              saveTag: Le,
              slotStatus: Er,
              performerSlotsAvailable: qe,
              selectedPerformerSlots: mt,
              performerSlots: Qe,
              detail: z,
              onDetailChange: Ye,
              onCancelQueuedReview: m,
              video: Ge,
              slotButtonRef: rr,
              tagSearchRef: jn,
              tagEditing: Fn,
              onCancelTagEditing: j,
              detailPanelRef: A,
              onReduceSelection: (H) => {
                we(H), requestAnimationFrame(() => {
                  var xe;
                  return (xe = A.current) == null ? void 0 : xe.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Oe,
              onSlotsChanged: Xe,
              onRecordHistory: Ae,
              splitSegment: or,
              duplicateSegment: K,
              provenance: Ot,
              lineage: x,
              onNavigateLineageItem: (H) => {
                const xe = at.find((Ct) => Ct.itemId === H);
                xe && Dn(xe.id);
              }
            }),
            on ? n(
              "div",
              { key: "detail-separator", ...ut("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Ge.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Di, {
                streamUrl: `/api/stream/video/${Ge.id}`,
                posterUrl: `/api/stream/video/${Ge.id}/screenshot?v=${encodeURIComponent(Ge.updatedAt || "")}`,
                format: Ge.videoFile.format,
                audioCodec: Ge.videoFile.audioCodec,
                duration: Ge.videoFile.duration,
                videoId: Ge.id,
                trackingEnabled: !1,
                onSeekRegister: (H) => {
                  Ve.current = H, Gl(je.current, at, H) && (je.current = null);
                },
                onPlaybackControlRegister: (H) => {
                  Je.current = H;
                },
                onTimeUpdate: rn
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            on && _.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...ut("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            on && _.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: G,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...jr.map((H) => {
              var ce;
              const xe = (ce = bn[H.id]) == null ? void 0 : ce[0], Ct = H.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : H.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: H.id,
                type: "button",
                disabled: H.disabled,
                "data-action-id": H.id,
                onClick: (kt) => {
                  const qt = kt.currentTarget;
                  tt(H.id, { target: qt, preserveFocus: !0 }), H.focusWhenDisabled && requestAnimationFrame(() => {
                    Bc(qt, G.current, H.focusWhenDisabled);
                  });
                },
                title: xe ? `${H.label} (${xe})` : H.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${Ct}`
              }, [
                n("span", { key: "label" }, H.label),
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
                disabled: !Ge.videoFile,
                onClick: () => Ln(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(As, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !Ge.videoFile,
                onClick: () => Ln(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(Es, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          Ft ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(ir.minimum * 100),
            "aria-valuemax": Math.round(ir.maximum * 100),
            "aria-valuenow": Math.round(_.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(_.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: ye,
            onPointerMove: fe,
            onKeyDown: X,
            onDoubleClick: () => ot(Tt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: Ft ? void 0 : { height: "20rem" } }, n(Gc, {
            segments: St,
            shotBoundaries: Pn,
            segmentGroups: lt,
            performerSlots: Qe,
            collapsedGroupKeys: W,
            selectedGroupKey: bt,
            selectedSegmentId: vt == null ? void 0 : vt.id,
            selectedSegmentIds: Lt,
            duration: Or,
            currentTime: S,
            zoom: Gn,
            onZoomChange: On,
            onSelectGroup: Mn,
            onToggleGroup: fn,
            onSelect: (H, xe) => we(H, xe),
            onSelectSegments: nt,
            onSelectAll: Ie,
            onConfigureTag: (H) => cn(H),
            onSeekTime: (H) => {
              var xe;
              return (xe = Ve.current) == null ? void 0 : xe.call(Ve, H, !1);
            },
            centerRef: h,
            showReviewState: B,
            swimlaneTitleWidth: _.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (H) => er((xe) => ({ ...xe, swimlaneTitleWidth: H }))
          }))
        ])
      ])
    ]),
    R ? n(No, {
      key: `configure-tag:${R.tagId}`,
      tagId: R.tagId,
      tagName: R.tagName,
      performerSlotsEnabled: B,
      onSaved: ht,
      onClose: () => {
        const H = R.trigger;
        cn(null), requestAnimationFrame(() => {
          var xe;
          H != null && H.isConnected ? H.focus({ preventScroll: !0 }) : (xe = re.current) == null || xe.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Se ? n(Mc, {
      key: "publish-approved-dialog",
      drafts: yn,
      processing: ft === -1,
      error: Ne,
      cancelButtonRef: ie,
      onConfirm: Re,
      onClose: u
    }) : null,
    Ee ? n(Oc, {
      key: "rejected-deletion-dialog",
      preview: Ee,
      onConfirm: () => {
        M(Ee), requestAnimationFrame(() => {
          var H;
          return (H = re.current) == null ? void 0 : H.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        pn(null), requestAnimationFrame(() => {
          var H;
          return (H = re.current) == null ? void 0 : H.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    xt ? n(Tc, {
      key: "shortcuts-dialog",
      reviewMode: B,
      bindings: bn,
      onClose: () => Zt(!1)
    }) : null,
    b ? n(Rc, {
      key: "incorrect-examples-dialog",
      examples: v,
      exporting: de,
      removingExampleId: Me,
      onExport: y,
      onRemove: We,
      onClose: () => mn(!1)
    }) : null
  ]);
}
function Kc(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: m, setCollapsedSegmentGroups: p, setEditorFilters: y, setHideDerivedSegments: h, setSaveMessage: g, setSelectedSegmentGroupKey: f, setSelectedSegmentId: k, setSelectedSegmentIds: C } = e;
  function u(R) {
    const I = Bt(t, R);
    I && p((N) => Sa(N, I));
  }
  function j(R) {
    k(R), C(R == null ? [] : [R]), c.current = R, m.current = [];
  }
  function W(R, {
    focusEditor: I = !1,
    seekToSegment: N = !1,
    additive: S = !1,
    rangeSegmentIds: M = null
  } = {}) {
    var A, E;
    const z = il({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: m.current
    }, R.id, M, S);
    C(z.selectedSegmentIds), k(z.activeSegmentId), c.current = z.anchorSegmentId, m.current = z.rangeBaseSegmentIds, z.activeSegmentId != null && f(Bt(t, z.activeSegmentId)), u(R.id), I && ((A = r.current) == null || A.focus({ preventScroll: !0 })), N && ((E = i.current) == null || E.call(i, R.startSec, !1));
  }
  function G(R) {
    const I = rl(
      d,
      l,
      R
    );
    C(I.selectedSegmentIds), k(I.activeSegmentId), c.current = I.activeSegmentId, m.current = [], I.activeSegmentId != null && (f(Bt(t, I.activeSegmentId)), u(I.activeSegmentId));
  }
  function B() {
    var N;
    const R = sl(s), I = R.includes(l) ? l : R[0] ?? null;
    y(Dt({})), h(!1), C(R), k(I), c.current = I, m.current = [], I != null && f(Bt(
      sn(s, a, o),
      I
    )), g(R.length === 0 ? "There are no segments to select." : `${R.length} segments selected. Collapsed Segment groups keep their selected segments.`), (N = r.current) == null || N.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: u, replaceSegmentSelection: j, selectSegment: W, selectSegmentCollection: G, selectAllVideoSegments: B };
}
function zc(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, stableSaveIdentity: c, historyRef: m, onConflict: p, onDetailChange: y, onReload: h, recordHistoryAction: g, revealSegmentGroupForSelection: f, savingSegmentId: k, selectedGroups: C, selectedSegment: u, selectedSegmentIdRef: j, selectedSegments: W, selectionAnchorIdRef: G, selectionRangeBaseIdsRef: B, setMergeConfirmation: R, setSaveMessage: I, setSelectedSegmentId: N, setSelectedSegmentIds: S, video: M } = e;
  function z() {
    R(null), requestAnimationFrame(() => {
      var Y;
      return (Y = a.current) == null ? void 0 : Y.focus({ preventScroll: !0 });
    });
  }
  async function A(Y = !1, _ = !1, re = null) {
    if (k != null) return;
    const de = re || va(
      C,
      { nativeOnly: !o }
    );
    if (!de) {
      I("Select at least two segments from one swimlane.");
      return;
    }
    if (!Y && Wi()) {
      R(de);
      return;
    }
    _ && Vi(!1);
    const ve = de.endSec == null ? "open end" : De(de.endSec);
    let D = de.segments[0];
    const le = o ? null : Mt(de.segments, !1), se = o ? null : crypto.randomUUID(), X = de.segments.map((pe) => pe.id), ye = Bd(i, de.segments).segments.find((pe) => pe.id === D.id), fe = {
      startSec: ye.startSec,
      endSec: ye.endSec,
      sourceKey: ye.sourceKey,
      sourceRunId: ye.sourceRunId,
      confidence: ye.confidence,
      isDerived: ye.isDerived
    }, Ce = r("merge", de.segments[0].id);
    if (!Ce) return;
    z();
    const Pe = Vt();
    s({
      type: "add",
      entry: { id: Pe, op: "merge", targets: de.segments.map($t), values: fe }
    }), S([D.id]), N(D.id), G.current = D.id, B.current = [];
    try {
      const pe = de.segments.slice(1);
      if (!o || D.nativeSegmentId != null) {
        const Q = pe.map((T) => {
          const J = `merge-native-selection:${M.id}:${D.id}:${T.id}:${D.updatedAt}:${T.updatedAt}`;
          return { key: J, operationId: _e(J), segmentId: T.id, expectedUpdatedAt: T.updatedAt };
        }), he = await ee(`/videos/${M.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: D.id,
            expectedSurvivorUpdatedAt: D.updatedAt,
            consumedSegments: Q.map(({ key: T, ...J }) => J),
            historyReceiptId: se
          })
        });
        D = he.survivor, y((T) => hi(T, he), M.id), s({ type: "confirm", key: Pe, applied: !0 }), Q.forEach(({ key: T }) => He(T));
      } else {
        const Q = pe.map((T) => {
          const J = `merge-draft-selection:${M.id}:${D.itemId}:${T.itemId}:${D.revision}:${T.revision}`;
          return { key: J, operationId: _e(J), itemId: T.itemId, expectedRevision: T.revision };
        }), he = await ee(`/videos/${M.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: D.itemId,
            expectedSurvivorRevision: D.revision,
            consumedDrafts: Q.map(({ key: T, ...J }) => J)
          })
        });
        D = he.survivor, y((T) => hi(T, he), M.id), s({ type: "confirm", key: Pe, applied: !0 }), Q.forEach(({ key: T }) => He(T));
      }
      S([D.id]), N(D.id), G.current = D.id, B.current = [], o ? t(Yt) : await g(
        "segments.merge",
        `Merged ${de.segments.length} segments`,
        le,
        Mt([D], !1),
        se
      ), f(D.id), I(`${de.segments.length} segments merged into ${De(de.startSec)} – ${ve}.`);
    } catch (pe) {
      s({ type: "discard", key: Pe }), S(X), N((u == null ? void 0 : u.id) ?? X[0] ?? null), G.current = (u == null ? void 0 : u.id) ?? X[0] ?? null, B.current = [], pe.status === 409 ? await p() : I(pe.message || "Unable to merge selected segments.");
    } finally {
      Ce();
    }
  }
  function E(Y, _ = W, re = u) {
    if (_.length === 0) return Promise.resolve(null);
    const de = hl(Y, _, re), ve = Math.max(0, de.identities.indexOf(de.activeIdentity)), D = d(), le = wa(D) != null || D.queued.some((X) => ko(X.targets, de.identities.map(c))), se = l({
      kind: "review",
      lockId: de.activeIdentity.id,
      targets: de.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (X) => K(X, {
        ...de,
        identities: X.targets,
        activeIdentity: X.targets[ve]
      })
    });
    return se ? (le && I(`${Y === "approved" ? "Approval" : "Rejection"} queued…`), se.done) : (I("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function K({ detail: Y, segments: _, onConflict: re, onReload: de }, ve) {
    var he;
    const D = vl(ve, _);
    if (!D) {
      I("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: le, selectedSegments: se, selectedSegment: X } = D, ye = bl(se, le), fe = se.filter((T) => T.reviewState !== ye);
    if (fe.length === 0) return;
    const Ce = se.map((T) => ({
      id: T.id,
      itemId: T.itemId,
      nativeSegmentId: T.nativeSegmentId
    })), Pe = Ce.find((T) => T.id === (X == null ? void 0 : X.id)) || Ce[0], pe = (T, J = !1) => {
      if (!(T != null && T.segments) || !J && !eo(j.current, Pe.id))
        return;
      const $ = Ce.map((b) => rt(T == null ? void 0 : T.segments, b)).filter(Boolean), v = rt(T == null ? void 0 : T.segments, Pe) || $[0] || null;
      S($.map((b) => b.id)), N((v == null ? void 0 : v.id) ?? null), G.current = (v == null ? void 0 : v.id) ?? null, B.current = [];
    };
    I(`Updating ${fe.length} selected segment${fe.length === 1 ? "" : "s"}…`);
    const Q = Vt();
    s({
      type: "add",
      entry: { id: Q, op: "patch", targets: fe.map($t), values: { reviewState: ye } }
    });
    try {
      const T = await ee(`/videos/${M.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: m.current.revision,
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
      const v = T.editorDelta ? (b) => Hn(b, T.editorDelta) : (b) => ({
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
      y(v, M.id), s({ type: "confirm", key: Q, applied: !0 }), pe(v(Y)), I(`${T.updatedCount} selected segment${T.updatedCount === 1 ? "" : "s"} ${ye === "approved" ? "approved" : ye === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (T) {
      s({ type: "discard", key: Q }), T.status === 409 && ((he = T.payload) != null && he.currentHistory) && t(T.payload.currentHistory);
      const J = T.status === 409 ? await re() : Y;
      pe(J, !0), I(T.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: z, mergeSelectedSwimlane: A, saveSelectedReviewState: E };
}
function _c(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: m, detail: p, editorFilters: y, editorRef: h, cancelSaveTasks: g, dispatchPendingChanges: f, enqueueSave: k, stableSaveIdentity: C, exportingExamples: u, hideDerivedSegments: j, incorrectExamples: W, lineage: G, materializeButtonRef: B, materializePreview: R, materializeRestoreFocusRef: I, materializing: N, mutateSegment: S, runSegmentMutation: M, pendingChanges: z, onConflict: A, onDetailChange: E, onReload: K, performerSlots: Y, recordHistoryAction: _, refreshMaterializationPreview: re, removingExampleId: de, revealSegmentGroupForSelection: ve, savingSegmentId: D, segmentGroups: le, segments: se, selectedSegment: X, selectedSegmentIdRef: ye, selectedSegments: fe, selectionAnchorIdRef: Ce, selectionRangeBaseIdsRef: Pe, setAutoAssignError: pe, setAutoAssignOpen: Q, setAutoAssigning: he, setEditorFilters: T, setExportingExamples: J, setHideDerivedSegments: $, setIncorrectExamples: v, setMaterializeError: b, setMaterializeLoading: x, setMaterializeOpen: P, setMaterializePreview: te, setMaterializing: ne, setRejectedDeletionPreview: L, setRemovingExampleId: oe, setSaveMessage: w, setSelectedSegmentGroupKey: q, setSelectedSegmentId: F, setSelectedSegmentIds: Z, swimlanes: be, video: ue } = e;
  async function $e() {
    var Me, Fe, tt;
    if (fe.length === 0 || !X || D != null) return;
    const V = Od(fe, W), ie = V.segments;
    if (ie.length === 0) return;
    const Re = fe.map((ke) => ({
      id: ke.id,
      itemId: ke.itemId,
      nativeSegmentId: ke.nativeSegmentId
    })), Ne = Re.find((ke) => ke.id === X.id) || Re[0], Se = [], et = [];
    let Ue = !1, Ze = p, Ae = !1;
    const Ee = [], We = r("feedback", Ne.id);
    if (We) {
      w(V.action === "remove" ? `Removing ${ie.length} selected incorrect example${ie.length === 1 ? "" : "s"}…` : `Collecting ${ie.length} selected segment${ie.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const ke = async (Ie, we) => {
          const nt = Ie.nativeSegmentId != null, At = V.action === "remove" ? `incorrect-example-remove:${ue.id}:${we == null ? void 0 : we.id}:${we == null ? void 0 : we.revision}:${we == null ? void 0 : we.representationRevision}` : `incorrect-example-collect:${ue.id}:${nt ? `native:${Ie.nativeSegmentId}:${Ie.updatedAt}` : `item:${Ie.itemId}:${Ie.revision}`}`;
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
                  operationId: _e(At),
                  expectedExampleRevision: we.revision,
                  expectedRepresentationRevision: we.representationRevision
                })
              }
            ) : await ee(`/videos/${ue.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: _e(At),
                nativeSegmentId: nt ? Ie.nativeSegmentId : null,
                itemId: nt ? null : Ie.itemId,
                expectedUpdatedAt: nt ? Ie.updatedAt : null,
                expectedRevision: nt ? null : Ie.revision
              })
            });
          } catch (vt) {
            throw vt.operationKey = At, vt;
          }
          if (!Pd(V.action, mt))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return He(At), mt;
        };
        for (const Ie of ie) {
          const we = V.action === "remove" ? W.find((nt) => nt.itemId != null && nt.itemId === Ie.itemId) : null;
          try {
            const nt = Re.find((bt) => bt.id === Ie.id);
            let At = rt(
              Ze == null ? void 0 : Ze.segments,
              nt
            ) || Ie, mt;
            try {
              mt = await ke(At, we);
            } catch (bt) {
              if (bt.status === 409 && ((Fe = (Me = bt.payload) == null ? void 0 : Me.result) == null ? void 0 : Fe.code) === "OPERATION_REPLAYED")
                Ze = await ee(
                  `/videos/${ue.id}/editor`
                ), Ae = !0, Ee.length = 0, He(bt.operationKey), mt = bt.payload.result;
              else {
                if (V.action !== "collect" || bt.status !== 409) throw bt;
                const Lt = await ee(
                  `/videos/${ue.id}/editor`
                );
                Ze = Lt, Ae = !0, Ee.length = 0;
                const zt = rt(
                  Lt == null ? void 0 : Lt.segments,
                  nt
                );
                if (!zt) throw bt;
                At = zt, mt = await ke(At, null);
              }
            }
            nt && mt.itemId != null && (nt.itemId = mt.itemId), Ze = Hn(
              Ze,
              mt.editorDelta
            ), Ee.push(mt.editorDelta);
            const vt = { segment: Ie, result: mt, example: we };
            Se.push(vt);
          } catch (nt) {
            if (et.push(nt), ![400, 404, 409].includes(nt.status)) break;
          }
        }
        if (c && Se.length > 0) {
          const Ie = V.action === "remove", we = Se.length;
          await _(
            Ie ? "feedback.remove" : "feedback.collect",
            Ie ? `Removed ${we} incorrect AI example${we === 1 ? "" : "s"}` : `Collected ${we} incorrect AI example${we === 1 ? "" : "s"}`,
            fr(Se, Ie),
            fr(Se, !Ie)
          ) || (Ue = !0);
        }
        Se.some(({ result: Ie }) => Ie.representation === "basicNativeBin") && Wn();
        const Le = eo(
          ye.current,
          Ne.id
        ), Oe = V.action === "collect" && Se.some(({ segment: Ie }) => Ie.id === Ne.id), ft = Se.map(({ segment: Ie }) => Ie.id), Ve = Oe ? xr(
          be,
          vr(o, Ne.id),
          { removedIds: ft }
        ) : null, lt = Oe ? (Ve == null ? void 0 : Ve.id) ?? null : Ne.id;
        Le && Oe && (Z(Ve ? [Ve.id] : []), F((Ve == null ? void 0 : Ve.id) ?? In), Ce.current = (Ve == null ? void 0 : Ve.id) ?? null, Pe.current = []);
        const Pt = await ee(`/videos/${ue.id}/incorrect-examples`);
        v(Pt);
        const at = Ze;
        if (E(Ae ? at : (Ie) => Ee.reduce(Hn, Ie), ue.id), Le && eo(
          ye.current,
          lt
        )) {
          let Ie, we;
          Oe ? (we = Ve ? rt(at == null ? void 0 : at.segments, {
            id: Ve.id,
            itemId: Ve.itemId,
            nativeSegmentId: Ve.nativeSegmentId
          }) : null, Ie = we ? [we] : []) : (Ie = Re.map((nt) => rt(at == null ? void 0 : at.segments, nt)).filter(Boolean), we = rt(at == null ? void 0 : at.segments, Ne) || Ie[0] || null), Z(Ie.map((nt) => nt.id)), F((we == null ? void 0 : we.id) ?? (Oe ? In : null)), Ce.current = (we == null ? void 0 : we.id) ?? null, Pe.current = [], q(we ? Bt(o, we.id) : null), we && ve(we.id);
        }
        if (et.length > 0) {
          const Ie = ((tt = et[0]) == null ? void 0 : tt.message) || "Only segments with registered AI provenance can be collected.";
          Se.length === 0 ? w(Ie) : V.action === "remove" ? w(
            `Partially removed ${Se.length} of ${ie.length} selected incorrect examples. ${Ie}`
          ) : w(
            `Partially collected ${Se.length} of ${ie.length} selected segments. ${Ie}`
          );
        } else if (V.action === "remove")
          w(
            `${Se.length} incorrect example${Se.length === 1 ? "" : "s"} removed and ${Se.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const Ie = Se.filter(({ result: we }) => we.representation === "basicNativeBin").length;
          w(Ie === Se.length ? `${Se.length} incorrect AI example${Se.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${Se.length} incorrect AI example${Se.length === 1 ? "" : "s"} collected and ${Se.length === 1 ? "segment rejected" : "segments rejected"}.`);
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
    if (!V || de != null || u) return;
    const ie = r("feedback", -1);
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
    var Re, Ne;
    oe(V.id);
    const ie = `incorrect-example-remove:${ue.id}:${V.id}:${V.revision}:${V.representationRevision}`;
    try {
      let Se, et = !1;
      try {
        Se = await ee(
          `/videos/${ue.id}/incorrect-examples/${V.id}/remove`,
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
        if (Ae.status !== 409 || ((Ne = (Re = Ae.payload) == null ? void 0 : Re.result) == null ? void 0 : Ne.code) !== "OPERATION_REPLAYED")
          throw Ae;
        Se = Ae.payload.result, et = !0;
      }
      He(ie);
      let Ue = !0;
      if (c) {
        const Ee = [{ segment: rt(p.segments, {
          itemId: V.itemId
        }) || {
          id: V.itemId == null ? null : -V.itemId,
          itemId: V.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: V.representationRevision
        }, result: Se, example: V }];
        Ue = await _(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          fr(Ee, !0),
          fr(Ee, !1)
        );
      }
      const Ze = await ee(
        `/videos/${ue.id}/incorrect-examples`
      );
      v(Ze), et ? await K() : E(
        (Ae) => Hn(Ae, Se.editorDelta),
        ue.id
      ), V.representation === "basicNativeBin" && Wn(), w(Ue ? et ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : V.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (Se) {
      Se.status === 409 && await A(), w(Se.message || "Unable to remove the incorrect example.");
    } finally {
      oe(null);
    }
  }
  async function Te() {
    if (u || de != null || W.length === 0) return;
    J(!0);
    const V = `incorrect-example-export:${ue.id}:${W.map((ie) => `${ie.id}:${ie.revision}:${ie.representationRevision}`).join(",")}`;
    try {
      const ie = await Fd(
        ue.id,
        W
      ), Re = new FormData();
      Re.append("metadata", JSON.stringify({
        operationId: _e(V),
        examples: ie.captures
      }));
      for (const Ae of ie.files)
        Re.append(Ae.fieldName, Ae.file);
      const Ne = await ee(
        `/videos/${ue.id}/incorrect-examples/export`,
        { method: "POST", body: Re }
      ), Se = await ed(Ne.downloadUrl), et = URL.createObjectURL(Se.blob), Ue = document.createElement("a");
      Ue.href = et, Ue.download = Se.fileName, Ue.click(), setTimeout(() => URL.revokeObjectURL(et), 1e3);
      const Ze = await ee(
        `/training-exports/${Ne.id}/complete`,
        { method: "POST" }
      );
      He(V), v(await ee(
        `/videos/${ue.id}/incorrect-examples`
      )), w(
        `Downloaded ${Ne.exampleCount} incorrect example${Ne.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Ze.clearedExampleCount} from the working collection.`
      );
    } catch (ie) {
      w(ie.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      J(!1);
    }
  }
  async function Ye(V = null) {
    const ie = se.filter((Fe) => Fe.reviewState === "rejected"), Re = ie.length, Ne = W.some((Fe) => Fe.representation === "fullItem");
    if (V == null && Re === 0 && !Ne) {
      w("There are no rejected segments to delete.");
      return;
    }
    if (V == null) {
      const Fe = r("delete-rejected", -1);
      if (!Fe) return;
      w("Preparing deletion summary…");
      try {
        const tt = await ee(`/videos/${ue.id}/rejected/deletion/preview`, { method: "POST" }), ke = Number(tt.deletedSegmentCount) || 0, Le = Number(tt.deferredRejectedSegmentCount) || 0, Oe = Number(tt.protectedIncorrectExampleCount) || 0;
        if (ke === 0) {
          Le > 0 ? w(
            `${Le} feedback-protected rejected segment${Le === 1 ? "" : "s"} kept. ${Oe} AI feedback example${Oe === 1 ? "" : "s"} must be exported before ${Le === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : w("There are no rejected segments to delete.");
          return;
        }
        if (!da(tt, w)) return;
        L(tt), w("");
      } catch (tt) {
        w(tt.message || "Unable to prepare rejected segment deletion.");
      } finally {
        Fe();
      }
      return;
    }
    const Se = V, et = Number(Se.deferredRejectedSegmentCount) || 0, Ue = ye.current, Ze = ie.map((Fe) => Fe.id), Ae = et === 0 && Ze.includes(Ue), Ee = Ae ? xr(
      be,
      vr(o, Ue),
      { removedIds: Ze }
    ) : null, We = r("delete-rejected", -1);
    if (!We) return;
    L(null), w("Deleting rejected segments…");
    const Me = et === 0 ? Vt() : null;
    Me && f({
      type: "add",
      entry: { id: Me, op: "remove", targets: ie.map($t) }
    }), Ae && (Z(Ee ? [Ee.id] : []), F((Ee == null ? void 0 : Ee.id) ?? In), Ce.current = (Ee == null ? void 0 : Ee.id) ?? null, Pe.current = []);
    try {
      const Fe = `rejected-dependency-delete:${ue.id}:${Se.fingerprint}`, tt = await ee(`/videos/${ue.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(Fe),
          fingerprint: Se.fingerprint
        })
      });
      He(Fe);
      const ke = await K();
      Me && f({ type: "confirm", key: Me, applied: ke != null }), tt.deletedSegmentCount > 0 && t(Yt);
      const Le = et > 0 ? ` ${et} feedback-protected rejected segment${et === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      w(`${tt.deletedSegmentCount} segment${tt.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Le}`);
    } catch (Fe) {
      Me && f({ type: "discard", key: Me }), Ae && (Z(Ue == null ? [] : [Ue]), F(Ue), Ce.current = Ue, Pe.current = []), w(Fe.message || "Unable to delete rejected segments.");
    } finally {
      We();
    }
  }
  async function it(V = i) {
    if (a || V.length === 0) return;
    const ie = r("auto-assign", -1);
    if (!ie) {
      pe("Wait for the current save to finish before assigning performers.");
      return;
    }
    try {
      await ht(V);
    } finally {
      ie();
    }
  }
  async function ht(V) {
    he(!0), pe("");
    try {
      const ie = await ee(`/videos/${ue.id}/segments/auto-assign-performer-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeSegmentIds: V.flatMap((Re) => Re.nativeSegmentId == null ? [] : [Re.nativeSegmentId]),
          itemIds: V.flatMap((Re) => Re.published || Re.itemId == null ? [] : [Re.itemId])
        })
      });
      Q(!1), await K(), w(`${ie.assignedSegmentCount} segment${ie.assignedSegmentCount === 1 ? "" : "s"} received ${ie.assignedSlotCount} performer-slot assignment${ie.assignedSlotCount === 1 ? "" : "s"}.`);
    } catch (ie) {
      pe(ie.message || "Unable to auto-assign performers.");
    } finally {
      he(!1);
    }
  }
  async function Xe() {
    P(!0), b(""), !R && (x(!0), re());
  }
  function yt() {
    I.current = !0, P(!1), requestAnimationFrame(() => {
      var V;
      return (V = B.current) == null ? void 0 : V.focus({ preventScroll: !0 });
    });
  }
  async function ut() {
    if (!R || N || R.createCount + R.linkCount === 0)
      return;
    const V = r("materialize", -1);
    if (!V) {
      b("Wait for the current save to finish before materializing derived segments.");
      return;
    }
    try {
      await je();
    } finally {
      V();
    }
  }
  async function je() {
    ne(!0), b("");
    let V;
    try {
      const ie = `materialize-derived:${ue.id}:${R.fingerprint}`;
      V = await ee(`/videos/${ue.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(ie),
          fingerprint: R.fingerprint,
          maxDepth: 3
        })
      }), He(ie);
    } catch (ie) {
      ie.status === 409 && te(null), b(ie.message || "Unable to materialize derived segments."), ne(!1);
      return;
    }
    te((ie) => ie && { ...ie, createCount: 0, linkCount: 0 });
    try {
      await K(), yt(), te(null);
      const ie = V.createdCount + V.linkedCount;
      w(`${V.createdCount} derived segment${V.createdCount === 1 ? "" : "s"} created and ${V.linkedCount} existing segment${V.linkedCount === 1 ? "" : "s"} linked.`), ie === 0 && w("Every applicable derivation was already materialized.");
    } catch {
      b("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    ne(!1);
  }
  async function Qe(V, ie = null) {
    var Se, et, Ue, Ze;
    const Re = {
      tagId: V,
      ...ie ? { tagName: ie } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (fe.length > 1) {
      const Ae = fe.filter((ke) => ke.tagId !== V);
      if (Ae.length === 0) {
        d();
        return;
      }
      const Ee = fe.map((ke) => ({
        id: ke.id,
        itemId: ke.itemId,
        nativeSegmentId: ke.nativeSegmentId
      })), We = fe.map((ke) => !c || ke.nativeSegmentId != null ? `native:${ke.nativeSegmentId}:${ke.updatedAt}` : `item:${ke.itemId}:${ke.revision}`).sort().join(","), Me = `bulk-tag:${ue.id}:${V}:${We}`, Fe = r("tag", (X == null ? void 0 : X.id) ?? Ae[0].id);
      if (!Fe) return;
      w(`Changing tag for ${Ae.length} selected segment${Ae.length === 1 ? "" : "s"}…`);
      const tt = Vt();
      f({
        type: "add",
        entry: { id: tt, op: "patch", targets: Ae.map($t), values: Re }
      }), d();
      try {
        const ke = c ? null : crypto.randomUUID();
        await ee(`/videos/${ue.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(Me),
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
        }), He(Me);
        const Le = Mt(
          fe,
          c
        ), Oe = await K();
        f({ type: "confirm", key: tt, applied: Oe != null });
        const ft = Ee.map((lt) => rt(Oe == null ? void 0 : Oe.segments, lt)).filter(Boolean);
        await _(
          "segments.tag",
          `Changed tag for ${Ae.length} segment${Ae.length === 1 ? "" : "s"}`,
          Le,
          Mt(ft, c),
          ke
        );
        const Ve = Ee.map((lt) => rt(Oe == null ? void 0 : Oe.segments, lt)).filter(Boolean);
        Z(Ve.map((lt) => lt.id)), F(((Se = Ve.find((lt) => lt.id === (X == null ? void 0 : X.id))) == null ? void 0 : Se.id) ?? ((et = Ve[0]) == null ? void 0 : et.id) ?? null), d(), w(`${Ae.length} selected segment${Ae.length === 1 ? "" : "s"} retagged.`);
      } catch (ke) {
        f({ type: "discard", key: tt });
        const Le = Ee.map((ft) => rt(p.segments, ft)).filter(Boolean), Oe = rt(p.segments, {
          id: X == null ? void 0 : X.id,
          itemId: X == null ? void 0 : X.itemId,
          nativeSegmentId: X == null ? void 0 : X.nativeSegmentId
        }) || Le[0] || null;
        Z(Le.map((ft) => ft.id)), F((Oe == null ? void 0 : Oe.id) ?? null), Ce.current = (Oe == null ? void 0 : Oe.id) ?? null, Pe.current = [], ke.status === 409 && await A(), w(ke.message || "Unable to change the selected segment tags.");
      } finally {
        Fe();
      }
      return;
    }
    if (fe.length !== 1 || !X) return;
    const Ne = Na(z, X);
    if (X.id === m || Ne) {
      const Ae = Ne ? { segmentId: X.id, tagId: Ne.values.tagId, tagName: Ne.meta.tagName } : null, Ee = Nl(Ae, X, V, ie);
      if (Ee && !qe(X, Ee)) {
        d();
        return;
      }
      if (Ne && (g((We) => {
        var Me;
        return ((Me = We.meta) == null ? void 0 : Me.pendingChangeId) === Ne.id;
      }), f({ type: "discard", key: Ne.id })), Ee) {
        const We = Ji(
          { ...X, tagId: Ee.tagId },
          Y,
          y,
          j,
          le
        );
        T(We.filters), $(We.hideDerivedSegments), w("Tag change queued…");
      } else Ne && w("");
      d();
      return;
    }
    if (V === X.tagId) {
      d();
      return;
    }
    if (X.itemId != null && ((Ze = (Ue = G.data) == null ? void 0 : Ue.children) == null ? void 0 : Ze.length) > 0) {
      const Ae = r("lineage-tag", X.id);
      if (!Ae) return;
      w("Checking lineage impact…");
      let Ee = null;
      try {
        const We = await ee(`/items/${X.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: X.revision, tagId: V })
        }), Me = We.deletedItemIds.length > 0 || We.removedEdgeIds.length > 0;
        if (Me && !window.confirm(
          `Changing this tag removes ${We.removedEdgeIds.length} lineage edge${We.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${We.deletedItemIds.length} derived segment${We.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
        )) {
          w("Tag change canceled.");
          return;
        }
        Ee = Vt(), f({
          type: "add",
          entry: { id: Ee, op: "patch", targets: [$t(X)], values: Re }
        }), d();
        const Fe = `tag-change:${X.itemId}:${X.revision}:${We.componentFingerprint}:${V}`;
        await ee(`/items/${X.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(Fe),
            expectedRevision: X.revision,
            componentFingerprint: We.componentFingerprint,
            tagId: V
          })
        }), He(Fe);
        const tt = await K();
        f({ type: "confirm", key: Ee, applied: tt != null }), d(), w(Me ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch (We) {
        Ee && f({ type: "discard", key: Ee }), Z([X.id]), F(X.id), Ce.current = X.id, Pe.current = [], We.status === 409 ? (w("Lineage changed — loading the latest segments…"), await A()) : w(We.message || "Unable to reconcile the lineage.");
      } finally {
        Ae();
      }
      return;
    }
    d(), await S(X, {
      startSec: X.startSec,
      endSec: X.endSec,
      tagId: V
    }, !0, null, !0, Re);
  }
  function qe(V, ie) {
    const Re = Vt(), Ne = C($t(V));
    f({
      type: "add",
      entry: {
        id: Re,
        op: "patch",
        targets: [Ne],
        values: { tagId: ie.tagId, tagName: ie.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: ie.tagName }
      }
    });
    const Se = z.find((Ue) => Ue.op === "insert" && Ue.segment.id === V.id);
    return k({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [Ne],
      dependsOn: (Se == null ? void 0 : Se.taskId) ?? null,
      meta: { pendingChangeId: Re },
      ready: (Ue, Ze) => {
        const Ae = ka(Ue.segments, Ze.targets[0]);
        return !Ae || Il(Ue, Ae.id);
      },
      run: (Ue) => Je(Ue, Re, ie)
    }) ? !0 : (f({ type: "discard", key: Re }), w("Wait for the history restore to finish."), !1);
  }
  async function Je(V, ie, Re) {
    const [Ne] = V.resolveTargets();
    if (!Ne) {
      f({ type: "discard", key: ie }), w(`The new segment was not retagged${Re.tagName ? ` to ${Re.tagName}` : ""}. Choose its tag again.`);
      return;
    }
    if (Ne.tagId === Re.tagId) {
      f({ type: "discard", key: ie });
      return;
    }
    await M(Ne, {
      startSec: Ne.startSec,
      endSec: Ne.endSec,
      tagId: Re.tagId
    }, {
      pendingChangeId: ie,
      restoreSelectionOnFailure: !1,
      onReload: V.onReload,
      onConflict: V.onConflict
    }) || w(`The new segment was not retagged${Re.tagName ? ` to ${Re.tagName}` : ""}. Choose its tag again.`);
  }
  async function st() {
    var Ze, Ae, Ee, We;
    if (!l || !X || D != null) return;
    const V = [...fe].sort((Me, Fe) => Number(Me.nativeSegmentId ?? Me.id) - Number(Fe.nativeSegmentId ?? Fe.id)), ie = new Set(V.map((Me) => Me.id)), Re = V.map((Me) => `${Me.nativeSegmentId ?? Me.id}:${Me.updatedAt}`).join("|"), Ne = r("bin", X.id);
    if (!Ne) return;
    w(`Moving ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin…`);
    const Se = `bulk-move:${ue.id}:${Re}`, et = _e(Se), Ue = c ? null : crypto.randomUUID();
    try {
      const Me = (Le = !1) => ee(`/videos/${ue.id}/segments/move-to-bin`, {
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
          historyReceiptId: Ue
        })
      });
      let Fe;
      try {
        Fe = await Me(
          yo(Se)
        );
      } catch (Le) {
        if (((Ze = Le.payload) == null ? void 0 : Ze.code) !== "missing-image" || !window.confirm(`${Le.message}

Continue and discard the missing image reference?`)) throw Le;
        bo(Se), Fe = await Me(!0);
      }
      He(Se), Wn();
      const tt = new Map((Fe.items || []).map((Le) => [
        Number(Le.segmentId),
        Le
      ]));
      await _(
        "segments.moveToBin",
        `Moved ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin`,
        Mt(V, !1),
        Mt(V.map((Le) => {
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
        Ue
      );
      const ke = xr(
        be,
        vr(o, X.id),
        { removedIds: [...ie] }
      );
      E((Le) => ({
        ...Le,
        segments: (Le.segments || []).filter((Oe) => !ie.has(Oe.id))
      }), ue.id), Z(ke ? [ke.id] : []), F((ke == null ? void 0 : ke.id) ?? In), Ce.current = (ke == null ? void 0 : ke.id) ?? null, Pe.current = [], ke && (q(Bt(o, ke.id)), ve(ke.id)), requestAnimationFrame(() => {
        var Le;
        return (Le = h.current) == null ? void 0 : Le.focus({ preventScroll: !0 });
      }), w(`Moved ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Me) {
      const Fe = ((Ae = Me.payload) == null ? void 0 : Ae.code) || ((We = (Ee = Me.payload) == null ? void 0 : Ee.result) == null ? void 0 : We.code);
      Me.status === 409 && Fe === "CANONICAL_SEGMENT_CHANGED" ? await A() : w(Me.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Ne();
    }
  }
  async function Ot() {
    if (!(c || s.current || D != null)) {
      s.current = !0, w("Checking the recycling bin…");
      try {
        const V = await ee("/bin"), ie = await ua(V, () => w("Emptying the recycling bin…"));
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
  return { toggleIncorrectExample: $e, removeIncorrectExample: pt, captureTrainingExport: Te, deleteRejectedSegments: Ye, autoAssignPerformers: it, previewDerivedSegments: Xe, closeMaterializeDialog: yt, materializeDerivedSegments: ut, saveTag: Qe, moveToBin: st, emptyRecyclingBin: Ot };
}
function Hc(e) {
  const { acceptHistory: t, acquireSaveLock: r, enqueueSave: o, getSaveQueueSnapshot: i, commonActionsRef: a, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: m, history: p, historyRef: y, historySaving: h, horizontalLayoutSize: g, mediaStackHeight: f, mediaStackRef: k, onDetailChange: C, onReload: u, railToggleRef: j, recordHistoryAction: W, savingSegmentId: G, setCollapsedSegmentGroups: B, setEditorLayout: R, setHistorySaving: I, setIncorrectExamples: N, setSaveMessage: S, shotBoundaries: M, timelineDuration: z, video: A, workspaceRef: E } = e;
  async function K($, v, b) {
    var ne, L, oe, w;
    const x = $.type === "segment" ? [$] : $.segments || [], P = (v == null ? void 0 : v.type) === "segment" ? [v] : (v == null ? void 0 : v.segments) || [];
    let te = b;
    for (const [q, F] of x.entries()) {
      const Z = P[q], be = ((ne = F.identity) == null ? void 0 : ne.nativeSegmentId) != null || ((L = F.identity) == null ? void 0 : L.published) === !0, ue = ((oe = Z == null ? void 0 : Z.identity) == null ? void 0 : oe.recycleBinItemId) ?? ((w = Z == null ? void 0 : Z.identity) == null ? void 0 : w.itemId);
      let $e = rt(te.segments, Z == null ? void 0 : Z.identity) || rt(te.segments, F.identity);
      if (!$e && be && ue != null && Z.identity.revision != null) {
        const Te = `history-restore:${A.id}:${ue}:${Z.identity.revision}`;
        await ee(`/bin/${ue}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(Te),
            expectedRevision: Z.identity.revision
          })
        }), He(Te), te = await u(), $e = te.segments.find((Ye) => Ye.tagId === F.values.tagId && Ye.startSec === F.values.startSec && Ye.endSec === F.values.endSec);
      }
      if (!$e)
        throw new Error("A segment in this history state no longer exists.");
      if (($e.nativeSegmentId != null || $e.published === !0) !== be) {
        if (be) {
          const Te = $e.recycleBinItemId ?? $e.itemId ?? ue;
          if (Te == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Ye = `history-restore:${A.id}:${Te}:${$e.revision}:${F.values.reviewState ?? "native"}`;
          await ee(`/bin/${Te}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(Ye),
              expectedRevision: $e.revision
            })
          }), He(Ye);
        } else {
          const Te = `history-bin:${A.id}:${$e.nativeSegmentId}:${$e.updatedAt}:${F.values.reviewState}`;
          await ee(`/videos/${A.id}/segments/${$e.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(Te),
              expectedUpdatedAt: $e.updatedAt,
              reviewState: F.values.reviewState
            })
          }), He(Te);
        }
        if (te = await u(), !be)
          continue;
        if ($e = rt(te.segments, F.identity) || te.segments.find((Te) => Te.tagId === F.values.tagId && Te.startSec === F.values.startSec && Te.endSec === F.values.endSec), !$e)
          throw new Error("The restored segment could not be found.");
      }
      const Be = F.values;
      if ($e.nativeSegmentId == null && $e.itemId != null) {
        const Te = `history-draft-update:${A.id}:${$e.itemId}:${$e.revision}:${Be.tagId}:${Be.startSec}:${Be.endSec ?? "open"}:${Be.reviewState}`;
        await ee(`/videos/${A.id}/drafts/${$e.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(Te),
            expectedRevision: $e.revision,
            ...Be
          })
        }), He(Te);
      } else
        await ee(`/videos/${A.id}/segments/${$e.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Be, expectedUpdatedAt: $e.updatedAt })
        });
      te = await u();
    }
    return te;
  }
  async function Y($, v) {
    var b;
    for (const x of $.targets || []) {
      const P = rt(v.segments, x.identity);
      if (!P)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const te = (b = v.performerSlotRevisions) == null ? void 0 : b[P.id];
      await ee(P.published ? `/videos/${A.id}/segments/${P.nativeSegmentId}/slots` : `/videos/${A.id}/drafts/${P.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: te,
          assignments: x.assignments
        })
      }), v = await u();
    }
    return v;
  }
  async function _($, v, b) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let x = v, P = await ee(`/videos/${A.id}/incorrect-examples`);
    const te = (ne) => P.find((L) => {
      var oe;
      return L.id === ne.exampleId || ((oe = ne.collectedIdentity) == null ? void 0 : oe.itemId) != null && L.itemId === ne.collectedIdentity.itemId;
    });
    for (const [ne, L] of ($.entries || []).entries()) {
      const oe = `history-feedback:${A.id}:${b.action.sequence}:${b.direction}:${ne}`, w = te(L);
      if ($.collected && w) {
        He(oe);
        continue;
      }
      let q;
      if ($.collected) {
        const F = rt(
          x.segments,
          L.collectedIdentity
        ) || rt(
          x.segments,
          L.originalIdentity
        );
        if (!F)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const Z = F.nativeSegmentId != null;
        q = await ee(`/videos/${A.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(oe),
            nativeSegmentId: Z ? F.nativeSegmentId : null,
            itemId: Z ? null : F.itemId,
            expectedUpdatedAt: Z ? F.updatedAt : null,
            expectedRevision: Z ? null : F.revision
          })
        });
      } else {
        if (!w) {
          He(oe);
          continue;
        }
        q = await ee(
          `/videos/${A.id}/incorrect-examples/${w.id}/remove`,
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
      He(oe), x = Hn(
        x,
        q.editorDelta
      ), P = await ee(
        `/videos/${A.id}/incorrect-examples`
      );
    }
    return N(P), x;
  }
  async function re($, v, b = []) {
    const x = $.state;
    if (!s && ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")) {
      const te = `basic-history:${A.id}:${y.current.revision}:${$.action.sequence}:${$.direction}`, ne = await ee(`/videos/${A.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(te),
          expectedHistoryRevision: y.current.revision,
          actionSequence: $.action.sequence,
          direction: $.direction
        })
      });
      return t(ne.history), b.push(te), u();
    }
    const P = $.direction === "backward" ? $.action.afterState : $.action.beforeState;
    if ((x == null ? void 0 : x.type) === "composite") {
      let te = v;
      const ne = (P == null ? void 0 : P.type) === "composite" ? P.states || [] : [];
      for (const [L, oe] of (x.states || []).entries()) {
        const w = ne[L];
        te = await re({
          ...$,
          state: oe,
          action: {
            ...$.action,
            beforeState: $.direction === "backward" ? oe : w,
            afterState: $.direction === "backward" ? w : oe
          }
        }, te, b);
      }
      return te;
    }
    if ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")
      return K(
        x,
        P,
        v
      );
    if ((x == null ? void 0 : x.type) === "performerSlots")
      return Y(x, v);
    if ((x == null ? void 0 : x.type) === "incorrectExamples")
      return _(x, v, $);
    if ((x == null ? void 0 : x.type) === "shots") {
      const te = Hr(v.shotBoundaries || []), ne = await ee(`/videos/${A.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(`history-shots:${A.id}:${te}:${x.fingerprint}`),
          expectedFingerprint: te,
          boundaries: x.boundaries
        })
      });
      return { ...v, shotBoundaries: ne };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function de($) {
    if (h || $ === p.cursorSequence) return;
    if (G != null) {
      S("Finish the pending saves before restoring history.");
      return;
    }
    if (yi(p, $).length === 0) return;
    const b = o({
      kind: "history",
      lockId: -1,
      exclusive: !0,
      run: (x) => ve(x.detail, $)
    });
    if (!b) {
      S("Finish the pending saves before restoring history.");
      return;
    }
    await b.done;
  }
  async function ve($, v) {
    var x;
    const b = yi(y.current, v);
    if (b.length !== 0) {
      I(!0), S(`Restoring ${b.length} history ${b.length === 1 ? "action" : "actions"}…`);
      try {
        let P = $;
        const te = [];
        for (const L of b)
          P = await re(
            L,
            P,
            te
          );
        const ne = s ? await ee(`/videos/${A.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: y.current.revision,
            targetSequence: v
          })
        }) : y.current;
        te.forEach(He), t(ne), await u(), S("History restored.");
      } catch (P) {
        P.status === 409 && ((x = P.payload) != null && x.current) && t(P.payload.current), await u(), S(P.message || "Unable to restore editor history.");
      } finally {
        I(!1);
      }
    }
  }
  function D($) {
    R((v) => ({ ...v, timelineRatio: po($, f) }));
  }
  function le($) {
    var x, P;
    const v = (x = k.current) == null ? void 0 : x.getBoundingClientRect();
    if (!v) return;
    const b = ((P = a.current) == null ? void 0 : P.offsetHeight) || 0;
    D(Ws(
      $.clientY,
      v.top + b,
      Math.max(0, v.height - b)
    ));
  }
  function se($) {
    $.currentTarget.setPointerCapture($.pointerId), le($);
  }
  function X($) {
    $.currentTarget.hasPointerCapture($.pointerId) && le($);
  }
  function ye($) {
    const v = $.shiftKey ? 0.1 : 0.05;
    let b = null;
    $.key === "ArrowUp" && (b = c.timelineRatio + v), $.key === "ArrowDown" && (b = c.timelineRatio - v);
    const x = go(f);
    $.key === "Home" && (b = x.minimum), $.key === "End" && (b = x.maximum), b != null && ($.preventDefault(), $.stopPropagation(), D(b));
  }
  function fe($) {
    const v = $ === "detailWidth" ? g.focusRow : g.workspace, b = g.workspace > 0 ? Qr(g.workspace, 600) : 560, x = an(c.markerRailWidth, b), P = $ === "detailWidth" ? 344 + (c.markerRailOpen ? x + 24 : 0) : 600;
    return v > 0 ? Qr(v, P) : 560;
  }
  function Ce($, v) {
    R((b) => ({ ...b, [$]: an(v, fe($)) }));
  }
  function Pe($, v) {
    var x, P;
    const b = v === "detailWidth" ? (x = m.current) == null ? void 0 : x.getBoundingClientRect() : (P = E.current) == null ? void 0 : P.getBoundingClientRect();
    b && Ce(v, v === "detailWidth" ? $.clientX - b.left : b.right - $.clientX);
  }
  function pe($, v) {
    const b = fe($), x = an(c[$], b);
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
        P.currentTarget.setPointerCapture(P.pointerId), Pe(P, $);
      },
      onPointerMove: (P) => {
        P.currentTarget.hasPointerCapture(P.pointerId) && Pe(P, $);
      },
      onKeyDown: (P) => {
        const te = P.shiftKey ? 40 : 16;
        let ne = null;
        P.key === "ArrowLeft" && (ne = $ === "detailWidth" ? -te : te), P.key === "ArrowRight" && (ne = $ === "detailWidth" ? te : -te);
        let L = ne == null ? null : x + ne;
        P.key === "Home" && (L = 240), P.key === "End" && (L = b), L != null && (P.preventDefault(), P.stopPropagation(), Ce($, L));
      },
      onDoubleClick: () => Ce($, Tt[$]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function Q() {
    R(($) => ({ ...$, markerRailOpen: !$.markerRailOpen })), requestAnimationFrame(() => {
      var $;
      return ($ = j.current) == null ? void 0 : $.focus({ preventScroll: !0 });
    });
  }
  function he($) {
    B((v) => v.includes($) ? v.filter((b) => b !== $) : nn([...v, $]));
  }
  function T($, v = !0, b = l) {
    const x = i().running != null, P = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (te) => J(te.detail, $, v, b)
    });
    return P ? (x && S($ === "split" ? "Shot boundary queued…" : "Shot merge queued…"), P.done.then((te) => te.value ?? null)) : (S("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function J($, v, b, x) {
    var oe;
    const P = ($ == null ? void 0 : $.shotBoundaries) || [], te = Number((oe = A.videoFile) == null ? void 0 : oe.duration) || z, ne = Hr(P), L = `shot-${v}:${A.id}:${x.toFixed(3)}:${te.toFixed(3)}:${ne}`;
    S(v === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const w = await ee(`/videos/${A.id}/shot-boundaries/${v}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: _e(L), timeSec: x })
      });
      return He(L), C((q) => ({ ...q, shotBoundaries: w }), A.id), b && await W(
        "shots.update",
        v === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: P,
          fingerprint: ne
        },
        {
          type: "shots",
          boundaries: w,
          fingerprint: Hr(w)
        }
      ), S(v === "split" ? "Shot boundary added." : "Shots merged."), w;
    } catch (w) {
      return S(w.message || "Unable to edit shot boundaries."), null;
    }
  }
  return { applySegmentHistoryState: K, applyPerformerSlotHistoryState: Y, applyHistoryState: re, restoreHistoryTarget: de, updateTimelineRatio: D, updateTimelineRatioFromPointer: le, handleSeparatorPointerDown: se, handleSeparatorPointerMove: X, handleSeparatorKeyDown: ye, panelWidthMaximum: fe, updatePanelWidth: Ce, handlePanelSeparatorPointer: Pe, panelSeparatorProps: pe, toggleSegmentRail: Q, toggleSegmentGroup: he, mutateShotBoundary: T };
}
function qc(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: m, emptyRecyclingBin: p, lineage: y, mediaDuration: h, mergeSelectedSwimlane: g, moveToBin: f, mutateShotBoundary: k, openPublishApprovedDialog: C, playbackControlsRef: u, playbackShortcutConfig: j, saveSelectedReviewState: W, seekRef: G, segmentGroupKeys: B, selectSegment: R, selectedSegment: I, selectedSegmentGroupForSegment: N, selectedSegmentGroupKey: S, selectedSegments: M, setCollapsedSegmentGroups: z, setIncorrectExamplesOpen: A, setQuickSearchOpen: E, setSaveMessage: K, setSelectedSegmentGroupKey: Y, setTagEditing: _, setTimelineZoom: re, shotBoundaries: de, slotButtonRef: ve, splitSegment: D, swimlanes: le, timelineDuration: se, toggleIncorrectExample: X, toggleSegmentGroup: ye, updateTimelineRatio: fe, videoFrameRate: Ce, visibleSegments: Pe } = e;
  function pe(T) {
    var J, $;
    (J = u.current) == null || J.pause(), ($ = u.current) == null || $.seekBy(Tl(T, Ce));
  }
  function Q(T, J) {
    if (M.length > 1 && ml(T.id))
      return;
    let $ = null;
    T.id === "video.playPause" && ($ = () => {
      var v;
      return (v = u.current) == null ? void 0 : v.toggle();
    }), T.id === "video.seekSmallBackward" && ($ = () => {
      var v;
      return (v = u.current) == null ? void 0 : v.seekBy(-j.smallSeekTime);
    }), T.id === "video.seekSmallForward" && ($ = () => {
      var v;
      return (v = u.current) == null ? void 0 : v.seekBy(j.smallSeekTime);
    }), T.id === "video.seekMediumBackward" && ($ = () => {
      var v;
      return (v = u.current) == null ? void 0 : v.seekBy(-j.mediumSeekTime);
    }), T.id === "video.seekMediumForward" && ($ = () => {
      var v;
      return (v = u.current) == null ? void 0 : v.seekBy(j.mediumSeekTime);
    }), T.id === "video.seekLongBackward" && ($ = () => {
      var v;
      return (v = u.current) == null ? void 0 : v.seekBy(-j.longSeekTime);
    }), T.id === "video.seekLongForward" && ($ = () => {
      var v;
      return (v = u.current) == null ? void 0 : v.seekBy(j.longSeekTime);
    }), T.id === "video.playSelected" && I && ($ = () => {
      var v;
      (v = G.current) == null || v.call(G, I.startSec, !0), requestAnimationFrame(() => {
        var b;
        return (b = m.current) == null ? void 0 : b.focus({ preventScroll: !0 });
      });
    }), (T.id === "video.playPreviousSegment" || T.id === "video.playNextSegment") && ($ = () => {
      var b;
      const v = ro(
        le,
        I == null ? void 0 : I.id,
        T.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !v || v.id === (I == null ? void 0 : I.id) || (R(v, { focusEditor: !0, seekToSegment: !1 }), (b = G.current) == null || b.call(G, v.startSec, !0));
    }), T.id.startsWith("video.seekPercent") && ($ = () => {
      var b;
      const v = Number(T.id.slice(17)) / 10;
      (b = G.current) == null || b.call(G, ll(h ?? se, v), !1);
    }), T.id === "video.jumpToSegmentStart" && I && ($ = () => {
      var v;
      return (v = G.current) == null ? void 0 : v.call(G, I.startSec, !1);
    }), T.id === "video.jumpToSegmentEnd" && I && ($ = () => {
      var v;
      return (v = G.current) == null ? void 0 : v.call(G, I.endSec ?? I.startSec, !1);
    }), T.id === "video.jumpToVideoStart" && ($ = () => {
      var v;
      return (v = G.current) == null ? void 0 : v.call(G, 0, !1);
    }), T.id === "video.jumpToVideoEnd" && ($ = () => {
      var v;
      return (v = G.current) == null ? void 0 : v.call(G, se, !1);
    }), T.id.startsWith("video.frame") && ($ = () => {
      const v = T.id.includes("Small") ? "small" : T.id.includes("Medium") ? "medium" : "long", b = j[`${v}FrameStep`] * (T.id.endsWith("Backward") ? -1 : 1);
      pe(b);
    }), T.id.startsWith("navigation.swimlane") && ($ = () => {
      const v = T.id.slice(19).toLowerCase(), b = ro(le, I == null ? void 0 : I.id, v, s);
      b && R(b, { focusEditor: !0, seekToSegment: !1 });
    }), (T.id === "navigation.extendSwimlaneLeft" || T.id === "navigation.extendSwimlaneRight") && ($ = () => {
      const v = Ad(
        t,
        I == null ? void 0 : I.id,
        T.id.endsWith("Left") ? "left" : "right"
      );
      v && R(v.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: v.segmentIds
      });
    }), (T.id === "navigation.segmentGroupUp" || T.id === "navigation.segmentGroupDown") && ($ = () => {
      const v = Ed(
        B,
        S ?? N,
        T.id.endsWith("Up") ? -1 : 1
      );
      v && Y(v);
    }), (T.id === "navigation.previousAtPlayhead" || T.id === "navigation.nextAtPlayhead") && ($ = () => {
      const v = Vs(Pe, s, T.id === "navigation.previousAtPlayhead" ? -1 : 1, I == null ? void 0 : I.id);
      v && R(v, { focusEditor: !0, seekToSegment: !1 });
    }), T.id === "navigation.nearestInCurrentSwimlane" && ($ = () => {
      const v = Fs(
        le,
        I == null ? void 0 : I.id,
        s
      );
      v && R(v, { focusEditor: !0, seekToSegment: !1 });
    }), T.id.includes("Unreviewed") && ($ = () => {
      const v = kr(
        le,
        I == null ? void 0 : I.id,
        T.id.startsWith("navigation.previous") ? -1 : 1,
        T.id.endsWith("Global")
      );
      v && R(v, { focusEditor: !J.preserveFocus, seekToSegment: !1 });
    }), (T.id === "navigation.nextTouchingPlayhead" || T.id === "navigation.previousTouchingPlayhead") && ($ = () => {
      const v = Ls(le, s, T.id === "navigation.previousTouchingPlayhead" ? -1 : 1, I == null ? void 0 : I.id);
      v && R(v, { focusEditor: !0, seekToSegment: !1 });
    }), T.id === "navigation.quickSearch" && ($ = () => E(!0)), (T.id === "navigation.previousShot" || T.id === "navigation.nextShot") && ($ = () => {
      var b;
      const v = $l(de, s, T.id === "navigation.previousShot" ? -1 : 1);
      v && ((b = G.current) == null || b.call(G, v.startSec, !1));
    }), T.id === "shot.split" && ($ = () => k("split")), T.id === "shot.merge" && ($ = () => k("merge")), T.id === "marker.create" && ($ = () => a()), T.id === "marker.duplicate" && ($ = () => d(!1)), T.id === "marker.duplicateAtPlayhead" && ($ = () => d(!0)), T.id === "marker.split" && ($ = () => D()), T.id === "marker.editTag" && ($ = () => {
      var v;
      if (M.length > 1 && M.some((b) => b.isDerived)) {
        K("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((v = y.data) != null && v.tagReadOnly) {
        K("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      _(!0);
    }), T.id === "marker.setStart" && I && ($ = () => r(s, I.endSec)), T.id === "marker.setEnd" && I && ($ = () => r(I.startSec, s)), T.id === "marker.copyTiming" && I && ($ = () => {
      K(ic(I) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), T.id === "marker.pasteTiming" && I && ($ = () => {
      const v = oc();
      if (!v) {
        K("No copied segment timing is available.");
        return;
      }
      r(v.startSec, v.endSec);
    }), T.id === "marker.mergeSelection" && ($ = () => g()), T.id === "marker.moveToBin" && ($ = () => f()), T.id === "marker.toggleIncorrectExample" && I && ($ = () => X()), T.id === "marker.openIncorrectExamples" && ($ = () => A(!0)), T.id === "markerGroup.toggleCollapse" && S && ($ = () => ye(S)), T.id === "markerGroup.toggleAll" && ($ = () => z((v) => Rd(v, B))), T.id === "marker.assignSlots" && ($ = () => {
      var v;
      return (v = ve.current) == null ? void 0 : v.click();
    }), T.id === "navigation.zoomIn" && ($ = () => re((v) => wr(v + 0.5))), T.id === "navigation.zoomOut" && ($ = () => re((v) => wr(v - 0.5))), T.id === "navigation.resetZoom" && ($ = () => re(1)), T.id === "navigation.centerPlayhead" && ($ = () => {
      var v;
      return (v = o.current) == null ? void 0 : v.call(o);
    }), T.id === "layout.growSwimlanes" && ($ = () => fe(c.timelineRatio + 0.05)), T.id === "layout.shrinkSwimlanes" && ($ = () => fe(c.timelineRatio - 0.05)), T.id === "marker.confirm" && I && ($ = () => W("approved")), T.id === "system.publishApproved" && ($ = () => C(J.target)), T.id === "marker.reject" && I && ($ = () => W("rejected")), T.id === "system.emptyBin" && ($ = () => p()), T.id === "system.deleteRejected" && ($ = () => l()), $ && $();
  }
  function he(T, J) {
    const $ = Zn.find((v) => v.id === T);
    $ && Cn($, i) && Q($, J);
  }
  return {
    executeShortcutById: he,
    stepVideoFrame: (T) => pe(T < 0 ? -1 : 1)
  };
}
const Wc = 3e4;
function Vc(e) {
  return e === !0;
}
function Jc() {
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
function Yc({
  fetchRuns: e,
  onCompletedRun: t,
  windowTarget: r,
  documentTarget: o,
  intervalMs: i = Wc
}) {
  const a = Jc();
  let s = null, l = !1, d = null;
  const c = () => o.visibilityState !== "hidden";
  async function m() {
    if (!(l || !a.isActive())) {
      l = !0;
      try {
        const g = await e(a.signal);
        if (!a.isActive()) return;
        const f = (Array.isArray(g) ? g : []).filter((C) => (C == null ? void 0 : C.status) === "completed" && C.id != null).map((C) => String(C.id));
        if (s === null) {
          s = new Set(f);
          return;
        }
        const k = f.filter((C) => !s.has(C));
        if (k.length === 0) return;
        k.forEach((C) => s.add(C)), await t();
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
  return m(), p(), r.addEventListener("focus", y), o.addEventListener("visibilitychange", h), function() {
    a.dispose(), clearTimeout(d), d = null, r.removeEventListener("focus", y), o.removeEventListener("visibilitychange", h);
  };
}
function Qc(e, t, r, o = !1, i = () => () => {
}) {
  const [a, s] = U({
    busy: !1,
    reviewState: null,
    error: ""
  }), l = me(r);
  ge(() => {
    l.current = r;
  }, [r]);
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
        body: JSON.stringify({ operationId: no(), reviewState: c })
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
  return ge(() => {
    if (Vc(o))
      return Yc({
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
const _n = Object.freeze([]);
function Zc(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Xc({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onAnalysisCompleted: i, onSlotsChanged: a, splitLayout: s, initialSegmentId: l, compatibilityMode: d = !1, profile: c, onNavigate: m }) {
  var Uo, Ko, zo, _o, Ho;
  const p = me(null), [y, h] = U(null), [g, f] = U([]), k = me(null), C = me(null), u = me([]), j = me(null), [W, G] = U(() => Dt({})), [B, R] = U(!1), [I, N] = U(dl), [S, M] = U(0), z = me(null), [A] = U(() => Kd({
    getContext: () => z.current,
    drainAfterSettle: !1
  })), E = Yl(A.subscribe, A.getSnapshot), K = wa(E), Y = (O, ae) => A.acquire({ kind: O, lockId: ae }), _ = (O) => A.enqueue(O), re = (O) => A.stableIdentity(O), de = me(!1);
  ge(() => (de.current = !0, () => {
    de.current = !1, queueMicrotask(() => {
      de.current || A.dispose();
    });
  }), []);
  const ve = (O) => A.cancel(O), D = (O, ae) => A.retarget(O, ae), le = A.getSnapshot, [se, X] = Jl(Yd, []), [ye, fe] = U(""), [Ce, Pe] = U(""), [pe, Q] = U(""), [he, T] = U(1), [J, $] = U(ec), [v, b] = U(0), [x, P] = U({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [te, ne] = U(Yt), L = me(Yt), [oe, w] = U(!1), [q, F] = U(!1), [Z, be] = U(!1), ue = me(!1);
  ue.current = Z;
  const [$e, pt] = U(null), [Be, Te] = U(!1), [Ye, it] = U(null), [ht, Xe] = U(null), yt = me(null), [ut, je] = U(!1), [Qe, qe] = U(""), Je = me(null), st = me(null), Ot = me(!1), [V, ie] = U(tc), [Re, Ne] = U(null), [Se, et] = U(!1), [Ue, Ze] = U(!1), [Ae, Ee] = U(!1), [We, Me] = U(!1), [Fe, tt] = U(!1), [ke, Le] = U(""), {
    importNativeSegments: Oe,
    nativeImportState: ft
  } = Qc(
    e.video.id,
    o,
    i,
    d,
    (O, ae) => A.acquire({ kind: O, lockId: ae })
  ), [Ve, lt] = U(!1), [Pt, at] = U(null), [Ie, we] = U(d), [nt, At] = U(0), [mt, vt] = U(!1), [bt, Lt] = U(""), [zt, Er] = U(null), Rn = me(null), An = me(null), cn = me(!1), [rn, un] = U([]), [er, Mr] = U(!1), [tr, En] = U(null), mn = Zd(), gn = me(null), nr = me(null), pn = me(null), Dr = me(l), Mn = me(null), Dn = me(null), Zt = me(null), On = me(null), Pn = me(null), xt = me(null), rr = me(null), Ft = me(null), or = me(null), Ln = me(null), Fn = me(null), jn = me(null), Or = me(-1e12), ir = me(null), Gn = me(null), [fn, Bn] = U({ scrollTop: 0, height: 512 });
  ge(() => {
    if (!Ve || mt || !bt) return;
    const O = requestAnimationFrame(() => {
      var ae;
      return (ae = An.current) == null ? void 0 : ae.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(O);
  }, [Ve, mt, bt]), ge(() => {
    if (!cn.current || Ve || Ie) return;
    const O = requestAnimationFrame(() => {
      var ae;
      (ae = Rn.current) == null || ae.focus({ preventScroll: !0 }), cn.current = !1;
    });
    return () => cancelAnimationFrame(O);
  }, [Ve, Ie]);
  const ot = e.video, Ge = e.segments || _n, ar = ze(() => JSON.stringify({
    segments: Ge.map((O) => [
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
    performerSlots: (e.performerSlots || _n).map((O) => [
      O.segmentId,
      O.slotDefinitionId,
      O.performerId,
      O.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [Ge, e.performerSlots, e.itemMetadata]);
  ge(() => {
    if (!d) {
      at(null), we(!1);
      return;
    }
    if (K != null) {
      we(!0);
      return;
    }
    let O = !0;
    we(!0);
    const ae = setTimeout(() => {
      ee(`/videos/${ot.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Ke) => {
        O && (at(Ke), Lt(""));
      }).catch((Ke) => {
        O && (at(null), Lt(Ke.message || "Unable to preview derived segments."));
      }).finally(() => {
        O && we(!1);
      });
    }, 150);
    return () => {
      O = !1, clearTimeout(ae);
    };
  }, [d, ot.id, ar, nt, K]);
  const Pr = () => At((O) => O + 1), _t = e.segmentGroups || _n, St = e.performerSlots || _n, on = d && e.performerSlotsAvailable !== !1, Un = ze(
    () => (e.performerCandidates || []).filter((O) => O.isVideoPerformer),
    [e.performerCandidates]
  ), yn = e.shotBoundaries || _n, bn = ze(
    () => ya(St),
    [St]
  ), hn = ze(
    () => Ge.map((O) => {
      const ae = bn.get(O.id) || [];
      return {
        ...O,
        slots: ae,
        assignment: ae.every((Ke) => Ke.performerId == null) ? Bl(ae, Un) : null
      };
    }).filter((O) => O.slots.length > 0 && O.assignment != null),
    [Ge, bn, Un]
  ), sr = Number((Uo = ot.videoFile) == null ? void 0 : Uo.frameRate) > 0 ? Number(ot.videoFile.frameRate) : 30;
  function lr() {
    const O = ue.current;
    be(!1), O && requestAnimationFrame(() => {
      var ae;
      return (ae = xt.current) == null ? void 0 : ae.focus({ preventScroll: !0 });
    });
  }
  function Kn() {
    K == null && (jn.current = null, Te(!1), fe(""), requestAnimationFrame(() => {
      var O;
      return (O = xt.current) == null ? void 0 : O.focus({ preventScroll: !0 });
    }));
  }
  function Ht() {
    R(!1), requestAnimationFrame(() => {
      var O, ae;
      (O = Ft.current) != null && O.isConnected ? Ft.current.focus({ preventScroll: !0 }) : (ae = xt.current) == null || ae.focus({ preventScroll: !0 });
    });
  }
  ge(() => {
    Fn.current === y ? (Fn.current = null, be(!0)) : be(!1);
  }, [y]), ge(() => {
    var ae;
    if (!Z) return;
    const O = (ae = Ln.current) == null ? void 0 : ae.querySelector("input");
    document.activeElement !== O && (O == null || O.focus({ preventScroll: !0 }), O == null || O.select());
  }, [Z, y]), ge(() => {
    var ae;
    if (Z) return;
    const O = (ae = xt.current) == null ? void 0 : ae.ownerDocument;
    O && O.activeElement === O.body && xt.current.focus({ preventScroll: !0 });
  }, [Z]), ge(() => {
    var Ke, dt, Gt;
    const O = sn(
      zr(
        e.segments,
        e.performerSlots || [],
        Dt({}),
        d && I,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), ae = ((Ke = e.segments.find((kn) => kn.id === l)) == null ? void 0 : Ke.id) ?? ((dt = Hi(O)) == null ? void 0 : dt.id) ?? null;
    h(ae), f(ae == null ? [] : [ae]), C.current = ae, u.current = [], Ne(Bt(O, ae)), G(Dt({})), R(!1), jn.current = null, Te(!1), T(1), fe(""), ne(Yt), L.current = Yt, w(!1), (Gt = xt.current) == null || Gt.focus({ preventScroll: !0 });
  }, [ot.id, l]), ge(() => {
    const O = new AbortController();
    return ee(`/videos/${ot.id}/incorrect-examples`, { signal: O.signal }).then(un).catch((ae) => {
      ae.name !== "AbortError" && un([]);
    }), () => O.abort();
  }, [ot.id, c == null ? void 0 : c.effectiveMode]), ge(() => {
    const O = new AbortController();
    return ee(`/videos/${ot.id}/history`, { signal: O.signal }).then((ae) => {
      const Ke = ae || Yt;
      L.current = Ke, ne(Ke);
    }).catch((ae) => {
      ae.name !== "AbortError" && fe(ae.message || "Unable to load editor history.");
    }), () => O.abort();
  }, [ot.id]), ge(() => {
    rc(J);
  }, [J.timelineRatio, J.markerRailOpen, J.detailWidth, J.markerRailWidth, J.swimlaneTitleWidth]), ge(() => {
    nc(V);
  }, [V]), ge(() => {
    cl(I);
  }, [I]), ge(() => {
    const O = Dn.current;
    if (!s || !O || typeof ResizeObserver > "u") return;
    const ae = () => {
      var Gt;
      const dt = Math.max(0, O.clientHeight - (((Gt = Zt.current) == null ? void 0 : Gt.offsetHeight) || 0));
      b(dt), $((kn) => {
        const qo = po(kn.timelineRatio, dt);
        return qo === kn.timelineRatio ? kn : { ...kn, timelineRatio: qo };
      });
    }, Ke = new ResizeObserver(ae);
    return Ke.observe(O), Zt.current && Ke.observe(Zt.current), ae(), () => Ke.disconnect();
  }, [s]), ge(() => {
    if (!mn || typeof ResizeObserver > "u") return;
    const O = Pn.current, ae = On.current;
    if (!O || !ae) return;
    const Ke = () => P({
      workspace: O.clientWidth,
      focusRow: ae.clientWidth,
      focusRowHeight: ae.clientHeight
    }), dt = new ResizeObserver(Ke);
    return dt.observe(O), dt.observe(ae), Ke(), () => dt.disconnect();
  }, [mn, J.markerRailOpen]);
  const Et = ze(
    () => Vd(Ge, se),
    [Ge, se]
  );
  pi(() => {
    Ta(se, e) !== se && X({ type: "prune", detail: e });
  }, [e, se]);
  const jt = ze(
    () => xi(
      zr(
        Et,
        St,
        W,
        d && I,
        _t
      ),
      rn,
      !0
    ),
    [
      Et,
      St,
      W,
      I,
      _t,
      d,
      rn
    ]
  ), Lr = Object.fromEntries(Nt.map((O) => [O, jt.filter((ae) => ae.reviewState === O).length])), Fr = xi(
    zr(
      Et,
      St,
      { ...W, reviewStates: Nt },
      d && I,
      _t
    ),
    rn,
    !0
  ), jr = Object.fromEntries(Nt.map((O) => [O, Fr.filter((ae) => ae.reviewState === O).length])), Gr = [...new Set(Et.map((O) => O.sourceKey).filter(Boolean))].sort((O, ae) => Kt(O).localeCompare(Kt(ae))), vn = Xs(
    W,
    d && I
  ), gt = ze(
    () => sn(jt, _t, St),
    [jt, _t, St]
  ), H = ze(
    () => Td(gt, V),
    [gt, V]
  ), xe = nl(
    gt,
    y,
    l,
    {
      visibleLanes: H,
      reference: ((Ko = p.current) == null ? void 0 : Ko.videoId) === ot.id ? p.current.reference : null
    }
  );
  ge(() => {
    const O = vr(gt, xe == null ? void 0 : xe.id);
    O && (p.current = { videoId: ot.id, reference: O });
  }, [ot.id, xe == null ? void 0 : xe.id, gt]);
  const Ct = ze(() => {
    const O = qd(se);
    return O.length === 0 ? Ge : [...Ge, ...O];
  }, [Ge, se]), ce = xe == null ? null : Ct.find((O) => O.id === xe.id) || xe, kt = ni(Ct, ni(jt, g).map((O) => O.id)), qt = !d && kt.length > 0 && kt.every((O) => O.nativeSegmentId != null), dr = jt.map((O) => O.id), La = dr.join("|");
  k.current = (ce == null ? void 0 : ce.id) ?? null;
  const Io = bn.get(ce == null ? void 0 : ce.id) || [], Fa = xo(Io), Co = ze(
    () => Cd(gt, g),
    [gt, g]
  ), cr = ze(() => So(gt), [gt]), zn = ze(
    () => Nd(cr, V),
    [cr, V]
  ), ja = ze(
    () => ha(
      zn.rows,
      fn.scrollTop,
      fn.height
    ),
    [zn, fn]
  ), Ga = kr(H, ce == null ? void 0 : ce.id, -1, !0) != null, Ba = kr(H, ce == null ? void 0 : ce.id, 1, !0) != null, xn = ce ? Bt(gt, ce.id) : null, Br = ba(cr) ? cr.map((O) => O.key) : [], Ua = Br.join("|"), ur = Math.max(
    0,
    Number((zo = ot.videoFile) == null ? void 0 : zo.duration) || 0,
    ...Et.map((O) => Number(O.endSec ?? O.startSec) || 0)
  ), $o = Number((_o = ot.videoFile) == null ? void 0 : _o.duration) > 0 ? Number(ot.videoFile.duration) : null;
  te.actions;
  const Ka = ea();
  ge(() => {
    const O = y === In ? y : (ce == null ? void 0 : ce.id) ?? null;
    O !== y && h(O);
  }, [ce, y]), ge(() => {
    f((O) => {
      const ae = al(
        O,
        dr,
        (ce == null ? void 0 : ce.id) ?? null
      );
      return ae.length === O.length && ae.every((Ke, dt) => Ke === O[dt]) ? O : ae;
    });
  }, [La, ce == null ? void 0 : ce.id]);
  const Sn = (ce == null ? void 0 : ce.itemId) == null ? null : ((Ho = e.itemMetadata) == null ? void 0 : Ho[ce.itemId]) || null, za = {
    key: (ce == null ? void 0 : ce.itemId) != null ? `item:${ce.itemId}` : (ce == null ? void 0 : ce.nativeSegmentId) != null ? `native:${ce.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (Sn == null ? void 0 : Sn.provenance) || (ce == null ? void 0 : ce.fieldProvenance) || [] : []
  }, Ur = (ce == null ? void 0 : ce.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (Sn == null ? void 0 : Sn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  ge(() => {
    Pe(xe == null ? "" : String(xe.startSec)), Q((xe == null ? void 0 : xe.endSec) == null ? "" : String(xe.endSec));
  }, [xe == null ? void 0 : xe.id, xe == null ? void 0 : xe.startSec, xe == null ? void 0 : xe.endSec]), ge(() => {
    xn && ie((O) => Sa(O, xn));
  }, [ot.id, l, xn]), ge(() => {
    Ne((O) => Md(Br, O, xn));
  }, [ot.id, Ua, xn]), ge(() => {
    if (!J.markerRailOpen || (ce == null ? void 0 : ce.id) == null) return;
    const O = Gn.current, ae = zn.rows.find((Gt) => Gt.kind === "segment" && Gt.segment.id === ce.id);
    if (!O || !ae) return;
    const Ke = ae.top + ae.height;
    let dt = O.scrollTop;
    ae.top < O.scrollTop ? dt = ae.top : Ke > O.scrollTop + O.clientHeight && (dt = Math.max(0, Ke - O.clientHeight)), dt !== O.scrollTop && (O.scrollTop = dt), Bn({ scrollTop: dt, height: O.clientHeight });
  }, [ce == null ? void 0 : ce.id, zn, J.markerRailOpen]), ge(() => {
    const O = Gn.current;
    if (!J.markerRailOpen || !O) return;
    const ae = () => Bn({
      scrollTop: O.scrollTop,
      height: O.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      ae();
      return;
    }
    const Ke = new ResizeObserver(ae);
    return Ke.observe(O), ae(), () => Ke.disconnect();
  }, [J.markerRailOpen]);
  const { revealSegmentGroupForSelection: To, replaceSegmentSelection: _a, selectSegment: Ro, selectSegmentCollection: Ha, selectAllVideoSegments: qa } = Kc({
    allSwimlanes: gt,
    editorRef: xt,
    performerSlots: St,
    seekRef: gn,
    segmentGroups: _t,
    segments: Ge,
    selectedSegmentId: y,
    selectedSegmentIds: g,
    selectionAnchorIdRef: C,
    selectionRangeBaseIdsRef: u,
    setCollapsedSegmentGroups: ie,
    setEditorFilters: G,
    setHideDerivedSegments: N,
    setSaveMessage: fe,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: h,
    setSelectedSegmentIds: f
  }), { acceptHistory: Kr, recordHistoryAction: mr, mutateSegment: Wa, runSegmentMutation: Va, completeReview: Ja, createSegment: Ao, splitSegment: Eo, duplicateSegment: Mo, saveTiming: Ya, applyShortcutTiming: Qa } = Qd({
    compatibilityMode: d,
    currentTime: S,
    detail: e,
    editorFilters: W,
    endInput: pe,
    hideDerivedSegments: I,
    historyRef: L,
    mediaDuration: $o,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: Or,
    pendingDuplicateRef: ir,
    pendingFirstSegmentStartSecRef: jn,
    pendingTagEditSegmentIdRef: Fn,
    performerSlots: St,
    enqueueSave: _,
    pendingChanges: se,
    retargetSaveTasks: D,
    replaceSegmentSelection: _a,
    savingSegmentId: K,
    segments: Ge,
    selectedSegment: ce,
    selectedSegmentIdRef: k,
    selectedSegments: kt,
    selectionAnchorIdRef: C,
    selectionRangeBaseIdsRef: u,
    setCreatingSegmentId: pt,
    setEditorFilters: G,
    setFirstSegmentTagOpen: Te,
    setHideDerivedSegments: N,
    setHistory: ne,
    setHistoryOpen: w,
    setPublishApprovedError: qe,
    setSaveMessage: fe,
    acquireSaveLock: Y,
    dispatchPendingChanges: X,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: h,
    setSelectedSegmentIds: f,
    setTagEditing: be,
    startInput: Ce,
    tagEditingRef: ue,
    timelineDuration: ur,
    video: ot
  });
  function Do(O = null) {
    var dt;
    if (!d || K != null || !Ge.some((Gt) => !Gt.published && Gt.reviewState === "approved")) return;
    const ae = ((dt = xt.current) == null ? void 0 : dt.ownerDocument) ?? document, Ke = ae.activeElement === ae.body ? null : ae.activeElement;
    st.current = O != null && O.isConnected && O !== ae.body ? O : Ke, qe(""), je(!0);
  }
  function Oo() {
    K == null && (je(!1), qe(""), requestAnimationFrame(() => {
      Zc(
        st.current,
        xt.current
      ), st.current = null;
    }));
  }
  async function Za() {
    await Ja() && Oo();
  }
  const { closeMergeConfirmation: Xa, mergeSelectedSwimlane: Po, saveSelectedReviewState: es } = zc({
    acceptHistory: Kr,
    compatibilityMode: d,
    detail: e,
    detailPanelRef: j,
    getSaveQueueSnapshot: le,
    historyRef: L,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: mr,
    revealSegmentGroupForSelection: To,
    savingSegmentId: K,
    selectedGroups: Co,
    selectedSegment: ce,
    selectedSegmentIdRef: k,
    selectedSegments: kt,
    selectionAnchorIdRef: C,
    selectionRangeBaseIdsRef: u,
    setMergeConfirmation: it,
    setSaveMessage: fe,
    acquireSaveLock: Y,
    dispatchPendingChanges: X,
    enqueueSave: _,
    stableSaveIdentity: re,
    setSelectedSegmentId: h,
    setSelectedSegmentIds: f,
    video: ot
  }), ts = (O) => {
    const ae = (O || []).map($t);
    A.cancel((Ke) => Ke.kind === "review" && ko(Ke.targets, ae));
  }, ns = A.settledCount();
  pi(() => {
    A.markCommitted(ns), z.current = {
      detail: e,
      segments: Ge,
      onConflict: r,
      onDetailChange: t,
      onReload: o,
      tagEditing: Z,
      selectedSegmentIds: g,
      activeSegmentId: (ce == null ? void 0 : ce.id) ?? null
    };
  }), ge(() => {
    A.poke();
  });
  const { toggleIncorrectExample: rs, removeIncorrectExample: os, captureTrainingExport: is, deleteRejectedSegments: Lo, autoAssignPerformers: as, previewDerivedSegments: ss, closeMaterializeDialog: ls, materializeDerivedSegments: ds, saveTag: cs, moveToBin: us, emptyRecyclingBin: ms } = _c({
    acceptHistory: Kr,
    allSwimlanes: gt,
    autoAssignCandidates: hn,
    autoAssigning: Fe,
    binEmptyingRef: Ot,
    canMoveSelectionToBin: qt,
    closeTagEditing: lr,
    compatibilityMode: d,
    creatingSegmentId: $e,
    detail: e,
    editorFilters: W,
    editorRef: xt,
    exportingExamples: er,
    hideDerivedSegments: I,
    incorrectExamples: rn,
    lineage: Ur,
    materializeButtonRef: Rn,
    materializePreview: Pt,
    materializeRestoreFocusRef: cn,
    materializing: mt,
    mutateSegment: Wa,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: St,
    cancelSaveTasks: ve,
    dispatchPendingChanges: X,
    enqueueSave: _,
    stableSaveIdentity: re,
    pendingChanges: se,
    runSegmentMutation: Va,
    recordHistoryAction: mr,
    refreshMaterializationPreview: Pr,
    removingExampleId: tr,
    revealSegmentGroupForSelection: To,
    savingSegmentId: K,
    segmentGroups: _t,
    segments: Ge,
    selectedSegment: ce,
    selectedSegmentIdRef: k,
    selectedSegments: kt,
    selectionAnchorIdRef: C,
    selectionRangeBaseIdsRef: u,
    setAutoAssignError: Le,
    setAutoAssignOpen: Me,
    setAutoAssigning: tt,
    setEditorFilters: G,
    setExportingExamples: Mr,
    setHideDerivedSegments: N,
    setIncorrectExamples: un,
    setMaterializeError: Lt,
    setMaterializeLoading: we,
    setMaterializeOpen: lt,
    setMaterializePreview: at,
    setMaterializing: vt,
    setRemovingExampleId: En,
    setRejectedDeletionPreview: Xe,
    setSaveMessage: fe,
    acquireSaveLock: Y,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: h,
    setSelectedSegmentIds: f,
    swimlanes: H,
    video: ot
  }), { restoreHistoryTarget: gs, updateTimelineRatio: Fo, handleSeparatorPointerDown: ps, handleSeparatorPointerMove: fs, handleSeparatorKeyDown: ys, panelWidthMaximum: jo, panelSeparatorProps: bs, toggleSegmentRail: hs, toggleSegmentGroup: Go, mutateShotBoundary: vs } = Hc({
    acceptHistory: Kr,
    compatibilityMode: d,
    currentTime: S,
    detail: e,
    editorLayout: J,
    focusRowRef: On,
    history: te,
    historyRef: L,
    historySaving: q,
    horizontalLayoutSize: x,
    mediaStackHeight: v,
    mediaStackRef: Dn,
    commonActionsRef: Zt,
    onDetailChange: t,
    onReload: o,
    railToggleRef: rr,
    recordHistoryAction: mr,
    savingSegmentId: K,
    setCollapsedSegmentGroups: ie,
    setEditorLayout: $,
    setHistorySaving: F,
    setIncorrectExamples: un,
    setSaveMessage: fe,
    acquireSaveLock: Y,
    enqueueSave: _,
    getSaveQueueSnapshot: le,
    shotBoundaries: yn,
    timelineDuration: ur,
    video: ot,
    workspaceRef: Pn
  }), { executeShortcutById: Bo, stepVideoFrame: xs } = qc({
    allSwimlanes: gt,
    applyShortcutTiming: Qa,
    centerTimelineRef: Mn,
    compatibilityMode: d,
    createSegment: Ao,
    currentTime: S,
    deleteRejectedSegments: Lo,
    duplicateSegment: Mo,
    editorLayout: J,
    editorRef: xt,
    emptyRecyclingBin: ms,
    lineage: Ur,
    mediaDuration: $o,
    mergeSelectedSwimlane: Po,
    moveToBin: us,
    mutateShotBoundary: vs,
    openPublishApprovedDialog: Do,
    playbackControlsRef: nr,
    playbackShortcutConfig: Ka,
    saveSelectedReviewState: es,
    seekRef: gn,
    segmentGroupKeys: Br,
    selectSegment: Ro,
    selectedSegment: ce,
    selectedSegmentGroupForSegment: xn,
    selectedSegmentGroupKey: Re,
    selectedSegments: kt,
    setCollapsedSegmentGroups: ie,
    setIncorrectExamplesOpen: Ee,
    setQuickSearchOpen: Ze,
    setSaveMessage: fe,
    setSelectedSegmentGroupKey: Ne,
    setTagEditing: be,
    setTimelineZoom: T,
    shotBoundaries: yn,
    slotButtonRef: or,
    splitSegment: Eo,
    swimlanes: H,
    timelineDuration: ur,
    toggleIncorrectExample: rs,
    toggleSegmentGroup: Go,
    updateTimelineRatio: Fo,
    videoFrameRate: sr,
    visibleSegments: jt
  });
  pn.current = Bo;
  const Ss = ze(() => Zn.map((O) => ({
    id: O.id,
    enabled: Cn(O, d),
    surface: "local",
    action: (ae) => {
      var Ke;
      return (Ke = pn.current) == null ? void 0 : Ke.call(pn, O.id, ae);
    }
  })), [d]);
  Oi(uo, Ss);
  const ks = go(v), ws = an(J.markerRailWidth, jo("markerRailWidth")), Ns = an(J.detailWidth, jo("detailWidth"));
  return n(Uc, {
    activeFilterCount: vn,
    allSwimlanes: gt,
    approvalFacetCounts: jr,
    autoAssignCandidates: hn,
    autoAssignError: ke,
    autoAssignOpen: We,
    autoAssignPerformers: as,
    autoAssigning: Fe,
    canMoveSelectionToBin: qt,
    captureTrainingExport: is,
    cancelQueuedReviewsForSegments: ts,
    removeIncorrectExample: os,
    rejectedDeletionPreview: ht,
    centerTimelineRef: Mn,
    closeEditorFilters: Ht,
    closeFirstSegmentTagDialog: Kn,
    closeMaterializeDialog: ls,
    closeMergeConfirmation: Xa,
    closePublishApprovedDialog: Oo,
    closeTagEditing: lr,
    collapsedSegmentGroups: V,
    commonActionsRef: Zt,
    compatibilityMode: d,
    configuringTag: zt,
    createSegment: Ao,
    currentTime: S,
    deleteRejectedSegments: Lo,
    detail: e,
    detailPanelRef: j,
    detailWidth: Ns,
    duplicateSegment: Mo,
    editorFilters: W,
    editorLayout: J,
    editorRef: xt,
    exportingExamples: er,
    filtersButtonRef: Ft,
    filtersOpen: B,
    firstSegmentTagOpen: Be,
    focusRowRef: On,
    handleSeparatorKeyDown: ys,
    handleSeparatorPointerDown: ps,
    handleSeparatorPointerMove: fs,
    hideDerivedSegments: I,
    history: te,
    historyOpen: oe,
    historySaving: q,
    hasNextUnreviewed: Ba,
    hasPreviousUnreviewed: Ga,
    horizontalLayoutSize: x,
    importNativeSegments: Oe,
    incorrectExamples: rn,
    incorrectExamplesOpen: Ae,
    removingExampleId: tr,
    lineage: Ur,
    markerRailWidth: ws,
    materializeButtonRef: Rn,
    materializeCancelButtonRef: An,
    materializeDerivedSegments: ds,
    materializeError: bt,
    materializeLoading: Ie,
    materializeOpen: Ve,
    materializePreview: Pt,
    materializing: mt,
    mediaStackRef: Dn,
    mergeCancelButtonRef: yt,
    mergeConfirmation: Ye,
    mergeSaving: Ud(E, "merge"),
    mergeSelectedSwimlane: Po,
    nativeImportState: ft,
    onNavigate: m,
    onDetailChange: t,
    openPublishApprovedDialog: Do,
    onReload: o,
    onSlotsChanged: a,
    panelSeparatorProps: bs,
    pendingInitialSeekRef: Dr,
    performerSlots: St,
    performerSlotsAvailable: on,
    playbackControlsRef: nr,
    previewDerivedSegments: ss,
    provenance: za,
    provenanceSources: Gr,
    publishApprovedCancelButtonRef: Je,
    publishApprovedDrafts: Za,
    publishApprovedError: Qe,
    publishApprovedOpen: ut,
    quickSearchOpen: Ue,
    railScrollRef: Gn,
    railToggleRef: rr,
    recordHistoryAction: mr,
    restoreHistoryTarget: gs,
    runEditorAction: Bo,
    stepVideoFrame: xs,
    saveMessage: ye,
    setSaveMessage: fe,
    saveTag: cs,
    saveTiming: Ya,
    savingSegmentId: K,
    acquireSaveLock: Y,
    seekRef: gn,
    segmentGroups: _t,
    segmentRailLayout: zn,
    segments: Et,
    selectAllVideoSegments: qa,
    selectSegment: Ro,
    selectSegmentCollection: Ha,
    selectedGroups: Co,
    selectedPerformerSlots: Io,
    selectedSegment: xe,
    selectedSegmentGroupKey: Re,
    selectedSegmentIds: g,
    selectedSegments: kt,
    selectedSlotStatus: Fa,
    setAutoAssignError: Le,
    setAutoAssignOpen: Me,
    setConfiguringTag: Er,
    setCurrentTime: M,
    setEditorFilters: G,
    setEditorLayout: $,
    setFiltersOpen: R,
    setHideDerivedSegments: N,
    setHistoryOpen: w,
    setIncorrectExamplesOpen: Ee,
    setQuickSearchOpen: Ze,
    setRejectedDeletionPreview: Xe,
    setRailViewport: Bn,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: h,
    setShortcutsOpen: et,
    setTimelineZoom: T,
    shotBoundaries: yn,
    shortcutsOpen: Se,
    slotButtonRef: or,
    splitLayout: s,
    splitSegment: Eo,
    tagEditing: Z,
    creatingSegmentId: $e,
    tagSearchRef: Ln,
    timelineDuration: ur,
    timelineRatioBounds: ks,
    timelineZoom: he,
    toggleSegmentGroup: Go,
    toggleSegmentRail: hs,
    updateTimelineRatio: Fo,
    video: ot,
    videoPerformers: Un,
    visibleCounts: Lr,
    visibleSegmentRailRows: ja,
    visibleSegments: jt,
    wideLayout: mn,
    workspaceRef: Pn
  });
}
function eu(e = [], t = []) {
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
function tu(e = [], t = "", r = "all") {
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
function wt(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function nu(e = [], t = []) {
  var h;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((g, f) => (g.sortOrder ?? 0) - (f.sortOrder ?? 0) || Number(g.id) - Number(f.id)).forEach((g, f) => {
    [...g.tags || []].sort((k, C) => (k.sortOrder ?? 0) - (C.sortOrder ?? 0) || Number(k.tagId) - Number(C.tagId)).forEach((k, C) => r.set(Number(k.tagId), {
      key: `group:${g.id}`,
      id: g.id,
      name: g.name,
      sortOrder: g.sortOrder ?? f,
      tagSortOrder: k.sortOrder ?? C
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(g, f) {
    const k = Number(g);
    if (!o.has(k)) {
      const C = r.get(k);
      o.set(k, {
        tagId: k,
        name: f || `Tag ${k}`,
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
    const f = i(g.sourceTagId, g.sourceTagName), k = i(g.derivedTagId, g.derivedTagName);
    f.outgoingRuleCount++, k.incomingRuleCount++;
    const C = `${f.tagId}:${k.tagId}`;
    a.has(C) || a.set(C, {
      id: C,
      sourceTagId: f.tagId,
      derivedTagId: k.tagId,
      rules: [],
      edgeCount: 0
    });
    const u = a.get(C);
    u.rules.push(g), u.edgeCount += Number(g.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((g) => [g.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((g) => {
    var f, k;
    (f = d.get(g.sourceTagId)) == null || f.add(g.derivedTagId), (k = d.get(g.derivedTagId)) == null || k.add(g.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), m = [];
  for (const g of s) {
    if (c.has(g.tagId)) continue;
    const f = [g.tagId], k = [];
    for (c.add(g.tagId); f.length > 0; ) {
      const R = f.shift();
      k.push(R);
      for (const I of d.get(R) || [])
        c.has(I) || (c.add(I), f.push(I));
    }
    const C = new Set(k), u = k.map((R) => o.get(R)), j = l.filter((R) => C.has(R.sourceTagId) && C.has(R.derivedTagId)), W = j.flatMap((R) => R.rules), G = u.filter((R) => R.outgoingRuleCount === 0).sort((R, I) => wt(R.name, I.name)), B = G.length > 0 ? G : [...u].sort((R, I) => wt(R.name, I.name));
    m.push({
      id: [...k].sort((R, I) => R - I).join(":"),
      label: B.length > 1 ? `${B[0].name} + ${B.length - 1}` : ((h = B[0]) == null ? void 0 : h.name) || "Derivation component",
      nodes: u,
      connections: j,
      rules: W,
      segmentGroupKeys: [...new Set(u.map((R) => R.segmentGroupKey))],
      materializedEdgeCount: W.reduce(
        (R, I) => R + (Number(I.edgeCount) || 0),
        0
      )
    });
  }
  m.sort((g, f) => f.rules.length - g.rules.length || wt(g.label, f.label));
  const p = /* @__PURE__ */ new Map();
  s.forEach((g) => {
    p.has(g.segmentGroupKey) || p.set(g.segmentGroupKey, {
      key: g.segmentGroupKey,
      id: g.segmentGroupId,
      name: g.segmentGroupName,
      sortOrder: g.segmentGroupSortOrder,
      nodes: [],
      ruleIds: /* @__PURE__ */ new Set(),
      componentIds: /* @__PURE__ */ new Set()
    }), p.get(g.segmentGroupKey).nodes.push(g);
  }), m.forEach((g) => {
    g.nodes.forEach((f) => {
      var k;
      return (k = p.get(f.segmentGroupKey)) == null ? void 0 : k.componentIds.add(g.id);
    }), g.rules.forEach((f) => {
      var k, C;
      (k = p.get(o.get(Number(f.sourceTagId)).segmentGroupKey)) == null || k.ruleIds.add(f.id), (C = p.get(o.get(Number(f.derivedTagId)).segmentGroupKey)) == null || C.ruleIds.add(f.id);
    });
  });
  const y = [...p.values()].sort((g, f) => g.sortOrder - f.sortOrder || wt(g.name, f.name)).map((g) => ({
    ...g,
    ruleCount: g.ruleIds.size,
    componentCount: g.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: m,
    segmentGroups: y
  };
}
function ru(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const m = new Map(e.nodes.map((N) => [N.tagId, /* @__PURE__ */ new Set()])), p = new Map(e.nodes.map((N) => [N.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((N) => {
    var S, M;
    (S = m.get(N.sourceTagId)) == null || S.add(N.derivedTagId), (M = p.get(N.derivedTagId)) == null || M.add(N.sourceTagId);
  });
  const y = new Map(e.nodes.map((N) => {
    var S;
    return [
      N.tagId,
      ((S = p.get(N.tagId)) == null ? void 0 : S.size) || 0
    ];
  })), h = new Map(e.nodes.map((N) => [N.tagId, 0])), g = e.nodes.filter((N) => y.get(N.tagId) === 0).sort((N, S) => wt(N.name, S.name)).map((N) => N.tagId), f = /* @__PURE__ */ new Set();
  for (; g.length > 0; ) {
    const N = g.shift();
    if (!f.has(N)) {
      f.add(N);
      for (const S of m.get(N) || [])
        h.set(S, Math.max(h.get(S) || 0, (h.get(N) || 0) + 1)), y.set(S, y.get(S) - 1), y.get(S) === 0 && g.push(S);
    }
  }
  f.size !== e.nodes.length && e.nodes.filter((N) => !f.has(N.tagId)).sort((N, S) => wt(N.name, S.name)).forEach((N) => h.set(N.tagId, 0));
  const k = Math.max(0, ...h.values()), C = Math.max(
    t,
    240 + k * 296
  ), u = /* @__PURE__ */ new Map();
  e.nodes.forEach((N) => {
    u.has(N.segmentGroupKey) || u.set(N.segmentGroupKey, {
      key: N.segmentGroupKey,
      id: N.segmentGroupId,
      name: N.segmentGroupName,
      sortOrder: N.segmentGroupSortOrder,
      nodes: []
    }), u.get(N.segmentGroupKey).nodes.push(N);
  });
  const j = [...u.values()].sort((N, S) => N.sortOrder - S.sortOrder || wt(N.name, S.name));
  let W = 28;
  const G = [], B = j.map((N) => {
    const S = /* @__PURE__ */ new Map();
    N.nodes.forEach((K) => {
      const Y = h.get(K.tagId) || 0;
      S.has(Y) || S.set(Y, []), S.get(Y).push(K);
    });
    for (const K of S.values())
      K.sort((Y, _) => Y.segmentGroupTagSortOrder - _.segmentGroupTagSortOrder || wt(Y.name, _.name));
    const M = Math.max(1, ...[...S.values()].map((K) => K.length)), z = M * 58 + (M - 1) * 18, A = 70 + z, E = {
      ...N,
      x: 12,
      y: W,
      width: C - 24,
      height: A
    };
    for (const [K, Y] of S.entries()) {
      const _ = Y.length * 58 + Math.max(0, Y.length - 1) * 18, re = (z - _) / 2;
      Y.forEach((de, ve) => G.push({
        ...de,
        rank: K,
        x: 28 + K * 296,
        y: W + 34 + 18 + re + ve * 76,
        width: 184,
        height: 58
      }));
    }
    return W += A + 16, E;
  }), R = new Map(G.map((N) => [N.tagId, N])), I = e.connections.map((N) => {
    const S = R.get(N.sourceTagId), M = R.get(N.derivedTagId), z = S.x + S.width, A = S.y + S.height / 2, E = M.x, K = M.y + M.height / 2, Y = Math.max(48, (E - z) * 0.48);
    return {
      ...N,
      path: `M ${z} ${A} C ${z + Y} ${A}, ${E - Y} ${K}, ${E} ${K}`
    };
  });
  return {
    width: C,
    height: Math.max(r, W - 16 + 28),
    nodes: G,
    connections: I,
    groups: B
  };
}
function ou(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = ru(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), m = 20, p = o, y = c.nodes.map((g) => ({
      ...g,
      x: g.x + m,
      y: g.y + p
    })), h = new Map(y.map((g) => [g.tagId, g]));
    a.push(...y), l.push(...c.groups.map((g) => ({
      ...g,
      componentId: d.id,
      x: g.x + m,
      y: g.y + p
    }))), s.push(...c.connections.map((g) => {
      const f = h.get(g.sourceTagId), k = h.get(g.derivedTagId), C = f.x + f.width, u = f.y + f.height / 2, j = k.x, W = k.y + k.height / 2, G = Math.max(48, (j - C) * 0.48);
      return {
        ...g,
        componentId: d.id,
        path: `M ${C} ${u} C ${C + G} ${u}, ${j - G} ${W}, ${j} ${W}`
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
function $i(e, t = []) {
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
function iu(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function au(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: m, editorRef: p, emptyDraft: y, graph: h, layout: g, listSort: f, materializationOffer: k, materializeOutgoingRules: C, materializeRule: u, message: j, normalizedQuery: W, query: G, refreshConfiguredTag: B, revealEditor: R, rules: I, save: N, segmentGroupKey: S, selectedNode: M, selectedRule: z, selection: A, setConfiguringTag: E, setDraft: K, setListSort: Y, setMaterializationOffer: _, setQuery: re, setSegmentGroupKey: de, setSelection: ve, setView: D, sortedVisibleRules: le, sourceSlots: se, sourceSlotsLoading: X, updateMapping: ye, updateTag: fe, view: Ce, visibleComponents: Pe, visibleRules: pe } = e;
  function Q(v) {
    const b = h.nodes.find((P) => P.tagId === Number(v.sourceTagId)), x = h.nodes.find((P) => P.tagId === Number(v.derivedTagId));
    return (b == null ? void 0 : b.segmentGroupKey) === (x == null ? void 0 : x.segmentGroupKey) ? b.segmentGroupKey : "cross-group";
  }
  function he() {
    return n("div", { key: "editor", ref: p, className: "space-y-4 p-4" }, [
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
          onClick: () => K(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      n("div", { key: "tags", className: "space-y-3" }, [
        n("div", { key: "source", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Source tag (specific)"),
            n(Vn, {
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
              onClick: (v) => E({
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
            n(Vn, {
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
              onClick: (v) => E({
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
            onClick: () => K((v) => ({
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
              onClick: () => K((x) => ({
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
          onClick: N,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => K(null), className: o }, "Cancel")
      ])
    ]);
  }
  function T() {
    if (M) {
      const x = pe.filter((ne) => Number(ne.derivedTagId) === M.tagId), P = pe.filter((ne) => Number(ne.sourceTagId) === M.tagId), te = (ne, L, oe) => n("div", {
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
          oe ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => u(ne),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => m(ne, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(ne),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, M.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, M.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${M.incomingRuleCount} incoming · ${M.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (ne) => E({
            tagId: M.tagId,
            tagName: M.name,
            trigger: ne.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        P.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => C(M, P),
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
    if (!z)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const v = h.nodes.find((x) => x.tagId === Number(z.sourceTagId)), b = h.nodes.find((x) => x.tagId === Number(z.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (v == null ? void 0 : v.segmentGroupName) || "Ungrouped"),
          (v == null ? void 0 : v.segmentGroupKey) !== (b == null ? void 0 : b.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(b == null ? void 0 : b.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${z.sourceTagName} → ${z.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${z.edgeCount} materialized lineage edge${z.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (k == null ? void 0 : k.ruleId) === z.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
        n(
          "p",
          { key: "summary", className: "text-sm font-medium text-foreground" },
          `${k.createCount + k.linkCount} pending derivation${k.createCount + k.linkCount === 1 ? "" : "s"}`
        ),
        n(
          "p",
          { key: "details", className: "text-xs text-secondary" },
          `${k.createCount} new segments · ${k.linkCount} existing segments to link`
        ),
        n("div", { key: "actions", className: "flex gap-2" }, [
          n("button", {
            key: "materialize",
            type: "button",
            disabled: r,
            onClick: () => u(z, k),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => _(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        z.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : z.slotMappings.map((x, P) => n("div", {
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
          z.createdAt ? new Date(z.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          z.updatedAt ? new Date(z.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => u(z),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => m(z),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(z),
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
    const v = M == null ? void 0 : M.tagId, b = /* @__PURE__ */ new Set();
    return M && (b.add(M.tagId), g.connections.forEach((x) => {
      (x.sourceTagId === M.tagId || x.derivedTagId === M.tagId) && (b.add(x.sourceTagId), b.add(x.derivedTagId));
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
        style: { width: `${g.width}px`, height: `${g.height}px` },
        "aria-label": "Derivation rule graph"
      }, [
        ...g.groups.map((x) => n("div", {
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
          width: g.width,
          height: g.height,
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
          ...g.connections.map((x) => {
            const P = v === x.sourceTagId || v === x.derivedTagId, te = M != null, ne = P ? "var(--color-accent)" : "var(--color-secondary)";
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
        ...g.nodes.map((x) => {
          const P = !W || x.name.toLocaleLowerCase().includes(W), te = M != null, ne = b.has(x.tagId), L = (M == null ? void 0 : M.tagId) === x.tagId;
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
        ...g.connections.filter((x) => x.rules.length > 1).map((x) => {
          const P = g.nodes.find((ne) => ne.tagId === x.sourceTagId), te = g.nodes.find((ne) => ne.tagId === x.derivedTagId);
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
  function $() {
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
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(z == null ? void 0 : z.id) === L.id ? "bg-accent/10" : ""}`,
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
          K(y()), ve(null), R();
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
          value: G,
          onChange: (v) => {
            re(v.target.value), ve(null);
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
            de(v.target.value), ve(null), K(null);
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
            D(v), v === "graph" && (A == null ? void 0 : A.type) === "rule" && ve(null);
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
        Ce === "graph" ? J() : $()
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
      j ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, j) : null
    ]),
    i ? n(No, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => B(i),
      onClose: () => {
        const v = i.trigger;
        E(null), requestAnimationFrame(() => {
          v != null && v.isConnected && v.focus();
        });
      }
    }) : null
  ]);
}
function su({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = U([]), [a, s] = U(null), [l, d] = U([]), [c, m] = U([]), [p, y] = U(!1), [h, g] = U(!1), [f, k] = U(!1), [C, u] = U(""), [j, W] = U(""), [G, B] = U("graph"), [R, I] = U("all"), [N, S] = U(null), [M, z] = U("relationship"), [A, E] = U(null), [K, Y] = U(null), _ = me(null), re = me(null), de = sa().replace(/:/g, "");
  function ve() {
    requestAnimationFrame(() => {
      var w;
      return (w = _.current) == null ? void 0 : w.scrollIntoView({ block: "nearest" });
    });
  }
  async function D(w) {
    const q = await ee("/derivation-rules", w ? { signal: w } : void 0);
    i(q || []);
  }
  ge(() => {
    const w = new AbortController();
    return D(w.signal).catch((q) => {
      q.name !== "AbortError" && u(q.message || "Unable to load derived segment rules.");
    }), () => w.abort();
  }, []), ge(() => {
    const w = new AbortController();
    return a != null && a.sourceTagId ? (y(!0), ee(`/slot-definitions/${a.sourceTagId}`, { signal: w.signal }).then((q) => d(q.definitions || [])).catch((q) => {
      q.name !== "AbortError" && d([]);
    }).finally(() => {
      w.signal.aborted || y(!1);
    })) : (d([]), y(!1)), a != null && a.derivedTagId ? (g(!0), ee(`/slot-definitions/${a.derivedTagId}`, { signal: w.signal }).then((q) => m(q.definitions || [])).catch((q) => {
      q.name !== "AbortError" && m([]);
    }).finally(() => {
      w.signal.aborted || g(!1);
    })) : (m([]), g(!1)), () => w.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), ge(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || p || h)
      return;
    const w = `${a.sourceTagId}:${a.derivedTagId}`;
    re.current !== w && (re.current = w, s((q) => !q || Number(q.sourceTagId) !== Number(a.sourceTagId) || Number(q.derivedTagId) !== Number(a.derivedTagId) ? q : vd(q, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    p,
    h
  ]);
  function le(w, q = !1) {
    q || S({ type: "rule", id: w.id }), re.current = null, s({
      ruleId: w.id,
      sourceTagId: w.sourceTagId,
      sourceTagName: w.sourceTagName,
      derivedTagId: w.derivedTagId,
      derivedTagName: w.derivedTagName,
      slotMappings: w.slotMappings.map((F) => ({
        sourceSlotDefinitionId: F.sourceSlotDefinitionId,
        derivedSlotDefinitionId: F.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), u(""), ve();
  }
  function se(w, q, F = "") {
    re.current = null, w === "source" ? (d([]), y(q != null)) : (m([]), g(q != null)), s((Z) => ({
      ...Z,
      [`${w}TagId`]: q == null ? null : Number(q),
      [`${w}TagName`]: F || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function X(w) {
    (a == null ? void 0 : a.ruleId) == null && (re.current = null);
    const q = [D(), t == null ? void 0 : t()];
    return w.draftKind === "source" ? (y(!0), q.push(ee(`/slot-definitions/${w.tagId}`).then((F) => d(F.definitions || [])).finally(() => y(!1)))) : w.draftKind === "derived" && (g(!0), q.push(ee(`/slot-definitions/${w.tagId}`).then((F) => m(F.definitions || [])).finally(() => g(!1)))), Promise.all(q);
  }
  function ye(w, q, F) {
    s((Z) => ({
      ...Z,
      slotMappings: Z.slotMappings.map((be, ue) => ue === w ? { ...be, [q]: F } : be)
    }));
  }
  async function fe() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const w = $i(a, o);
    if (w) {
      u(w.message);
      return;
    }
    if (a.slotMappings.some((q) => !q.sourceSlotDefinitionId || !q.derivedSlotDefinitionId)) {
      u("Complete or remove every performer slot mapping before saving.");
      return;
    }
    k(!0), u(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let q = null;
      if (a.ruleId != null) {
        const Z = await ee(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
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
      u("Saving derived segment rule…");
      const F = await ee("/derivation-rules", {
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
      if (await D(), S(G === "graph" ? { type: "node", id: Number(F.sourceTagId) } : { type: "rule", id: F.id }), s(null), a.ruleId == null)
        try {
          const Z = await ee(
            `/derivation-rules/${F.id}/materialization/preview`,
            { method: "POST" }
          );
          E(
            Z.createCount + Z.linkCount > 0 ? Z : null
          ), u(Z.createCount + Z.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          E(null), u("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        E(null), u("Derived segment rule saved. Previous materializations were removed.");
    } catch (q) {
      u(q.message || "Unable to save derived segment rule.");
    } finally {
      k(!1);
    }
  }
  async function Ce(w) {
    k(!0), u("Previewing rule deletion…");
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
      const F = `derivation-rule-delete:${w.id}:${q.fingerprint}`;
      await ee(`/derivation-rules/${w.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(F),
          fingerprint: q.fingerprint
        })
      }), He(F), await D(), (a == null ? void 0 : a.ruleId) === w.id && s(null), (N == null ? void 0 : N.type) === "rule" && N.id === w.id && S(null), (A == null ? void 0 : A.ruleId) === w.id && E(null), u(`Rule deleted with ${q.deletedSegmentCount} exclusively derived segment${q.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (q) {
      u(q.message || "Unable to delete derived segment rule.");
    } finally {
      k(!1);
    }
  }
  async function Pe(w, q = null) {
    const F = q || await ee(
      `/derivation-rules/${w.id}/materialization/preview`,
      { method: "POST" }
    );
    if (F.createCount + F.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const Z = `derivation-rule-materialize:${w.id}:${F.fingerprint}`, be = await ee(`/derivation-rules/${w.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: _e(Z),
        fingerprint: F.fingerprint
      })
    });
    return He(Z), be;
  }
  async function pe(w, q = null) {
    k(!0), u("Finding pending derivations…");
    try {
      const F = await Pe(w, q);
      if (E(null), await D(), F.createdCount + F.linkedCount === 0) {
        u("Every applicable derivation is already materialized.");
        return;
      }
      u(
        `${F.createdCount} derived segment${F.createdCount === 1 ? "" : "s"} created and ${F.linkedCount} existing segment${F.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (F) {
      u(F.message || "Unable to materialize pending derivations.");
    } finally {
      k(!1);
    }
  }
  async function Q(w, q) {
    if (q.length === 0) return;
    k(!0), u(`Finding pending derivations from ${w.name}…`);
    let F = 0, Z = 0;
    try {
      for (const be of q) {
        const ue = await Pe(be);
        F += ue.createdCount, Z += ue.linkedCount;
      }
      E(null), await D(), u(F + Z === 0 ? `Every outgoing derivation from ${w.name} is already materialized.` : `${F} derived segment${F === 1 ? "" : "s"} created and ${Z} existing segment${Z === 1 ? "" : "s"} linked from ${w.name}.`);
    } catch (be) {
      await D().catch(() => {
      }), u(be.message || `Unable to materialize derivations from ${w.name}.`);
    } finally {
      k(!1);
    }
  }
  const he = $i(a, o), T = ze(
    () => nu(o, e),
    [o, e]
  ), J = j.trim().toLocaleLowerCase(), v = T.components.filter((w) => R === "all" || w.segmentGroupKeys.includes(R)).filter((w) => !J || w.nodes.some((q) => q.name.toLocaleLowerCase().includes(J))), b = v.flatMap((w) => w.rules), x = new Set(
    v.flatMap((w) => w.nodes.map((q) => q.tagId))
  ), P = ze(
    () => ou(v),
    [v]
  ), te = G === "list" ? iu(
    N,
    b,
    J.length > 0
  ) : null, ne = (N == null ? void 0 : N.type) === "node" && T.nodes.find((w) => w.tagId === N.id && x.has(w.tagId)) || null, L = [...b].sort((w, q) => M === "source" ? wt(w.sourceTagName, q.sourceTagName) || wt(w.derivedTagName, q.derivedTagName) : M === "target" ? wt(w.derivedTagName, q.derivedTagName) || wt(w.sourceTagName, q.sourceTagName) : M === "materialized" ? (Number(q.edgeCount) || 0) - (Number(w.edgeCount) || 0) || wt(w.sourceTagName, q.sourceTagName) : wt(
    `${w.sourceTagName} ${w.derivedTagName}`,
    `${q.sourceTagName} ${q.derivedTagName}`
  ));
  return n(au, {
    arrowMarkerId: de,
    busy: f,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: K,
    deleteRule: Ce,
    derivedSlots: c,
    derivedSlotsLoading: h,
    draft: a,
    draftIssue: he,
    editRule: le,
    editorRef: _,
    emptyDraft: r,
    graph: T,
    layout: P,
    listSort: M,
    materializationOffer: A,
    materializeOutgoingRules: Q,
    materializeRule: pe,
    message: C,
    normalizedQuery: J,
    query: j,
    refreshConfiguredTag: X,
    revealEditor: ve,
    rules: o,
    save: fe,
    segmentGroupKey: R,
    selectedNode: ne,
    selectedRule: te,
    selection: N,
    setConfiguringTag: Y,
    setDraft: s,
    setListSort: z,
    setMaterializationOffer: E,
    setQuery: W,
    setSegmentGroupKey: I,
    setSelection: S,
    setView: B,
    sortedVisibleRules: L,
    sourceSlots: l,
    sourceSlotsLoading: p,
    updateMapping: ye,
    updateTag: se,
    view: G,
    visibleComponents: v,
    visibleRules: b
  });
}
function lu() {
  const [e, t] = U(ea), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => si({ ...l, [a]: s }));
  }
  function i() {
    t(si(mo));
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
function du({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = U([]), [a, s] = U(!1), [l, d] = U(!1), [c, m] = U(""), [p, y] = U(""), [h, g] = U("all"), [f, k] = U(() => /* @__PURE__ */ new Set()), [C, u] = U(null);
  ge(() => {
    if (!e || a) return;
    const E = new AbortController();
    return d(!0), m(""), ee("/slot-definitions", { signal: E.signal }).then((K) => {
      i(K || []), s(!0);
    }).catch((K) => {
      K.name !== "AbortError" && m(K.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      E.signal.aborted || d(!1);
    }), () => E.abort();
  }, [e, a]);
  async function j() {
    d(!0), m("");
    try {
      const E = await ee("/slot-definitions");
      i(E || []), s(!0);
    } catch (E) {
      m(E.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function W() {
    const [E] = await Promise.all([
      ee("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(E || []), s(!0), m("");
  }
  function G() {
    const E = C == null ? void 0 : C.trigger;
    u(null), requestAnimationFrame(() => {
      E != null && E.isConnected && E.focus({ preventScroll: !0 });
    });
  }
  function B(E) {
    k((K) => {
      const Y = new Set(K);
      return Y.has(E) ? Y.delete(E) : Y.add(E), Y;
    });
  }
  const R = ze(
    () => eu(t, o),
    [t, o]
  ), I = ze(
    () => tu(R, p, h),
    [R, p, h]
  ), N = R.flatMap((E) => E.tags), S = N.filter((E) => E.definitions.length > 0).length, M = N.length - S, z = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], A = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${N.length} tags · ${S} with slots · ${M} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: p,
          onChange: (E) => y(E.target.value),
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
          z.map(([E, K]) => n("button", {
            key: E,
            type: "button",
            onClick: () => g(E),
            "aria-pressed": h === E,
            className: `rounded px-3 py-1.5 text-xs font-medium ${h === E ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, K))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => k(/* @__PURE__ */ new Set()),
          className: A
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => k(new Set(R.map((E) => E.overviewKey))),
          className: A
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
    a && I.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, I.map((E) => {
      const K = f.has(E.overviewKey), Y = E.tags.filter((_) => _.definitions.length > 0).length;
      return n("article", {
        key: E.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => B(E.overviewKey),
          "aria-expanded": !K,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, K ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, E.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${E.tags.length} tag${E.tags.length === 1 ? "" : "s"} · ${Y} with slots`
          )
        ]),
        K ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          E.tags.map((_) => n("li", {
            key: _.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: _.tagName }, _.tagName),
              _.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            _.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${_.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, _.definitions.map((re) => n("li", {
              key: re.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, It(re)),
              ...(re.genderHints || []).map((de) => n("span", {
                key: de,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, Tr(de)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (re) => u({
                tagId: _.tagId,
                tagName: _.tagName,
                trigger: re.currentTarget
              }),
              "aria-label": `Edit performer slots for ${_.tagName}`,
              className: `${A} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    C ? n(No, {
      key: `performer-slots-configure:${C.tagId}`,
      tagId: C.tagId,
      tagName: C.tagName,
      onSaved: W,
      onClose: G
    }) : null
  ]);
}
function cu({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = U("general"), [a, s] = U([]), [l, d] = U(!1), [c, m] = U(""), [p, y] = U(Wi), h = El(t), g = h.map(([u]) => u);
  ge(() => {
    g.includes(o) || i(g[0] || "general");
  }, [t.effectiveMode]);
  async function f(u) {
    const j = await ee("/segment-groups", u ? { signal: u } : void 0);
    s(j || []);
  }
  ge(() => {
    const u = new AbortController();
    return f(u.signal).catch((j) => {
      j.name !== "AbortError" && m(j.message || "Unable to load tag groups.");
    }), () => u.abort();
  }, []);
  async function k(u) {
    if (u !== t.requestedMode) {
      d(!0), m("");
      try {
        const j = await ee(
          `/preferences/transition?mode=${encodeURIComponent(u)}`
        );
        let W = !1, G = null, B = null, R = null, I = !1;
        if (t.requestedMode === "basic" && u === "full") {
          if (!window.confirm(Ol(
            j.recyclingBinCount,
            j.protectedRecyclingBinCount
          )))
            return;
          I = !0, j.recyclingBinCount > 0 && (W = !0, R = j.recyclingBinFingerprint, G = `mode-switch-empty-bin:${R}`, B = _e(G));
        }
        let N = !1;
        if (t.requestedMode === "full" && u === "basic") {
          if (!window.confirm(Dl(
            j.extensionOwnedSegmentCount
          )))
            return;
          N = !0;
        }
        const S = await ee("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: u,
            confirmHiddenExtensionOwnedSegments: N,
            confirmBasicHistoryCleanup: I,
            emptyRecyclingBin: W,
            operationId: B,
            expectedRecyclingBinFingerprint: R
          })
        });
        G && He(G), r == null || r(ta(S)), m("Workflow mode saved.");
      } catch (j) {
        m(j.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  const C = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (u) => Aa(u, e, C), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      h.map(([u, j]) => n("button", {
        key: u,
        type: "button",
        onClick: () => i(u),
        "aria-current": o === u ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === u ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, j))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(lu)
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
      n(wc, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: k,
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
          checked: p,
          onChange: (u) => {
            const j = u.target.checked;
            Vi(j), y(j);
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
    g.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(su, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => f()
      })
    ) : null,
    g.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(du, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => f()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function Ti({ facets: e, values: t, disabled: r, onChange: o }) {
  var i;
  return r ? n(
    "p",
    { className: "rounded-md border border-dashed border-border p-3 text-xs text-secondary" },
    "Performer slot filters are unavailable for your current access. Browse and playback remain available."
  ) : (i = e == null ? void 0 : e.slots) != null && i.length ? n("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, e.slots.map((a) => n("label", { key: a.id, className: "space-y-1 text-xs text-secondary" }, [
    n("span", { key: "label" }, It(a)),
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
function uu({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var m, p;
  const s = [...e.slots || []].sort((y, h) => y.sortOrder - h.sortOrder || String(y.slotDefinitionId).localeCompare(String(h.slotDefinitionId))), l = [...new Map(s.map((y) => [
    y.performerId,
    { id: y.performerId, name: y.performerName }
  ])).values()], d = s.map((y) => ({
    slotDefinitionId: y.slotDefinitionId,
    label: It(y),
    performer: { id: y.performerId, name: y.performerName }
  })), c = ra(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: ga(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((m = e.activity) == null ? void 0 : m.name) || "segment"}, ${e.reviewState}, ${De(e.startSec)} to ${e.endSec == null ? "end of video" : De(e.endSec)}` }, [
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
          n(dn, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((p = e.activity) == null ? void 0 : p.name) || "Tag segment"),
          l.length ? n(Rr, {
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
function mu({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(Di, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: Fl(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: ra(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Ri({ onNavigate: e, profile: t }) {
  const r = ze(() => {
    const D = Pi("ext:com.midnightrider.segment-studio:segments");
    return D ? {
      ...qr,
      defaultFilter: { ...qr.defaultFilter, ...D.findFilter || {} },
      defaultObjectFilter: D.objectFilter || {}
    } : qr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Li(r), [l, d] = U(null), [c, m] = U({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [p, y] = U(null), [h, g] = U(null), [f, k] = U(0), [C, u] = U(""), [j, W] = U(!0), [G, B] = U(""), R = me(0), I = di(o, i), N = I.activityTagId, S = Nn(i.slots), M = ze(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (D) => Object.keys(Nn(D)).length > 0,
    sanitize: (D) => Wr(N, Nn(D)),
    summarize: (D) => `${Object.keys(Nn(D)).length} assigned`,
    renderEditor: (D, le) => N ? n(Ti, {
      facets: l,
      values: Nn(D),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (se, X) => {
        const ye = { ...Nn(D) };
        X ? ye[se] = Number(X) : delete ye[se], le(Wr(N, ye));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [N, l, c.performerSlotsAvailable]), z = JSON.stringify(I);
  ge(() => {
    if (d(null), !N) return;
    const D = new AbortController();
    return ee(`/browse/activities/${N}/facets`, { signal: D.signal }).then(d).catch((le) => {
      le.status === 403 ? d({ slots: [], restricted: !0 }) : le.name !== "AbortError" && B(le.message);
    }), () => D.abort();
  }, [N]), ge(() => {
    const D = ++R.current, le = new AbortController();
    return W(!0), B(""), ee("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(I), signal: le.signal }).then((se) => {
      D === R.current && m({ ...se, totalCount: se.totalCount ?? se.total ?? 0 });
    }).catch((se) => {
      if (!(D !== R.current || se.name === "AbortError")) {
        if (se.status === 400 && se.message.includes("unrestricted performer read access")) {
          m((X) => ({ ...X, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), B("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        B(se.message);
      }
    }).finally(() => {
      D === R.current && W(!1);
    }), () => {
      R.current++, le.abort();
    };
  }, [z, f]);
  const A = c.items.findIndex((D) => D.key === p), E = c.items[A] || null;
  function K(D) {
    s(D), a({ ...o, page: 1 });
  }
  function Y(D) {
    const le = di(o, D), se = D.slots && le.activityTagId != null && le.slotAssignments.length > 0 ? D.slots : void 0;
    K({ ...D, slots: se });
  }
  function _(D, le) {
    const se = { ...S };
    le ? se[D] = Number(le) : delete se[D], K({ ...i, slots: Wr(N, se) });
  }
  function re() {
    const D = document.querySelector(`[data-segment-key="${p}"]`);
    y(null), requestAnimationFrame(() => D == null ? void 0 : D.focus());
  }
  async function de(D) {
    var X;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    g(D.key), u("");
    const le = `browse-restore:${D.itemId}:${D.revision}`, se = _e(le);
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
        await ye(yo(le));
      } catch (fe) {
        if (((X = fe.payload) == null ? void 0 : X.code) !== "missing-image" || !window.confirm(`${fe.message}

Continue and discard the missing image reference?`))
          throw fe;
        bo(le), await ye(!0);
      }
      He(le), p === D.key && y(null), u("Segment restored to Cove."), k((fe) => fe + 1);
    } catch (ye) {
      u(ye.message || "Unable to restore the segment."), ye.status === 409 && k((fe) => fe + 1);
    } finally {
      g(null);
    }
  }
  async function ve(D) {
    g(D.key), u("");
    try {
      const le = await ee(`/items/${D.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: D.revision })
      });
      if (!da(le, u) || !nd(le))
        return;
      const se = `browse-dependency-delete:${D.itemId}:${le.fingerprint}`;
      await ee(`/items/${D.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(se),
          fingerprint: le.fingerprint
        })
      }), He(se), p === D.key && y(null), u(`${le.deletedSegmentCount} segment${le.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), k((X) => X + 1);
    } catch (le) {
      u(le.message || "Unable to permanently delete the segment."), le.status === 409 && k((se) => se + 1);
    } finally {
      g(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(wo, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(Fi, {
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
      error: G ? new Error(G) : null,
      onRetry: () => k((D) => D + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? li.filter((D) => D.id !== "performers") : li,
      objectFilter: i,
      onObjectFilterChange: Y,
      customFilterSections: M,
      searchPlaceholder: "Search segments..."
    }, [
      N ? n(Ti, { key: "slots", facets: l, values: S, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: _ }) : null,
      n(mu, { key: "player", item: E, index: A, count: c.items.length, onPrevious: () => {
        var D;
        return y((D = c.items[A - 1]) == null ? void 0 : D.key);
      }, onNext: () => {
        var D;
        return y((D = c.items[A + 1]) == null ? void 0 : D.key);
      }, onClose: re, onNavigate: e }),
      C ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, C) : null,
      !j && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      j ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((D) => n(uu, {
        key: D.key,
        item: D,
        selected: D.key === p,
        busy: h === D.key,
        onSelect: () => y(D.key),
        onRestore: de,
        onPurge: ve
      })))
    ])
  ]);
}
function gu({ onNavigate: e, profile: t }) {
  const [r, o] = U([]), [i, a] = U(""), [s, l] = U(0), [d, c] = U(!0), [m, p] = U(null), [y, h] = U(""), g = me(null);
  async function f(u) {
    const j = await ee("/bin", u ? { signal: u } : void 0);
    return o(j.items || []), a(j.fingerprint || ""), l(Number(j.totalCount) || 0), j;
  }
  ge(() => {
    const u = new AbortController();
    return c(!0), f(u.signal).catch((j) => {
      j.name !== "AbortError" && h(j.message);
    }).finally(() => {
      u.signal.aborted || c(!1);
    }), () => u.abort();
  }, []), Oi(uo, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var u;
      return (u = g.current) == null ? void 0 : u.call(g);
    }
  }]);
  async function k(u) {
    var G;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    p(u.itemId), h("");
    const j = `restore:${u.itemId}:${u.revision}`, W = _e(j);
    try {
      const B = (R = !1) => ee(`/bin/${u.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: W, expectedRevision: u.revision, discardMissingImage: R })
      });
      try {
        await B(yo(j));
      } catch (R) {
        if (((G = R.payload) == null ? void 0 : G.code) !== "missing-image" || !window.confirm(`${R.message}

Continue and discard the missing image reference?`)) throw R;
        bo(j), await B(!0);
      }
      He(j), await f(), Wn(), h("Segment restored with a new native ID.");
    } catch (B) {
      h(B.message || "Unable to restore the segment."), B.status === 409 && await f();
    } finally {
      p(null);
    }
  }
  async function C() {
    if (m == null)
      try {
        const u = await ua({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          p(-1), h("");
        });
        if (u.status !== "emptied") return;
        await f(), Wn(), h(`${u.segmentCount} segment${u.segmentCount === 1 ? "" : "s"} from ${u.sceneCount} scene${u.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (u) {
        h(u.message || "Unable to empty the recycling bin."), u.status === 409 && await f();
      } finally {
        p(null);
      }
  }
  return g.current = C, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    n(wo, {
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
        onClick: C,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, m === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    y ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, y) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((u) => n("article", { key: u.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${u.tagName || "Tag segment"} · ${u.videoTitle || `Video ${u.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, u.endSec == null ? De(u.startSec) : `${De(u.startSec)} – ${De(u.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${u.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${u.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: m != null, onClick: () => k(u), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const Ai = "ext:com.midnightrider.segment-studio:videos";
async function pu(e, t, r, o) {
  const i = await Xl("/api/videos/find", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(yc(e, t, { fullMode: r })),
    signal: o
  }), a = Array.isArray(i == null ? void 0 : i.items) ? i.items : [], s = a.length > 0 ? await ee("/videos/segment-counts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoIds: a.map((d) => d.id) }),
    signal: o
  }) : { items: [] }, l = new Map(((s == null ? void 0 : s.items) ?? []).map((d) => [d.videoId, d]));
  return { items: a.map((d) => hc(d, l.get(d.id))), totalCount: (i == null ? void 0 : i.totalCount) ?? 0 };
}
function Jr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = t || r === "review", a = ze(() => {
    var de;
    const _ = Pi(Ai), re = (de = _ == null ? void 0 : _.uiOptions) == null ? void 0 : de.displayMode;
    return _ ? {
      ...Wt,
      defaultFilter: io({ ...Wt.defaultFilter, ..._.findFilter || {} }),
      defaultObjectFilter: oo(_.objectFilter || {}, { fullMode: i }),
      defaultDisplayMode: Wt.allowedDisplayModes.includes(re) ? re : Wt.defaultDisplayMode
    } : Wt;
  }, []), { filter: s, objectFilter: l, displayMode: d, setFilter: c, setObjectFilter: m, setDisplayMode: p } = Li(a), [y, h] = U({ items: [], totalCount: 0 }), [g, f] = U(!0), [k, C] = U(""), [u, j] = U(0), [W, G] = U(/* @__PURE__ */ new Set()), B = me(0), R = me(null), I = JSON.stringify(s), N = JSON.stringify(l);
  ge(() => {
    const _ = oo(l, { fullMode: i });
    _ !== l && m(_);
    const re = io(s);
    re !== s && c(re);
  }, [I, N, i]), ge(() => {
    R.current = null, G(/* @__PURE__ */ new Set());
  }, [I, N]), ge(() => {
    const _ = ++B.current, re = new AbortController();
    return f(!0), C(""), pu(s, l, i, re.signal).then((de) => {
      _ === B.current && h(de);
    }).catch((de) => {
      _ === B.current && de.name !== "AbortError" && C(de.message || "Unable to discover videos.");
    }).finally(() => {
      _ === B.current && f(!1);
    }), () => {
      B.current++, re.abort();
    };
  }, [I, N, i, u]);
  function S(_) {
    c({ ..._, page: _.page || 1 });
  }
  function M(_) {
    m(_), c({ ...s, page: 1 });
  }
  function z(_, re = !1) {
    G((de) => vc(
      de,
      y.items.map((ve) => ve.videoId),
      _,
      R.current,
      re
    )), R.current = _;
  }
  function A() {
    R.current = null, G(new Set(y.items.map((_) => _.videoId)));
  }
  function E() {
    R.current = null, G(/* @__PURE__ */ new Set());
  }
  function K() {
    R.current = null, G((_) => new Set(y.items.map((re) => re.videoId).filter((re) => !_.has(re))));
  }
  const Y = ze(() => bc(Ts), []);
  return n("div", { className: "w-full space-y-5" }, [
    n(wo, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(Fi, {
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
      onRetry: () => j((_) => _ + 1),
      sortOptions: Rs,
      displayMode: d,
      onDisplayModeChange: p,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: Y,
      objectFilter: l,
      onObjectFilterChange: M,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: i ? W : void 0,
      onSelectAll: i ? A : void 0,
      onSelectNone: i ? E : void 0,
      onInvertSelection: i ? K : void 0,
      // The host renders whatever extensions contribute for a video selection, so
      // Run AI here is the same action, and the same dialog, as the native videos
      // page. Only the contributed actions are rendered: Segment Studio's own
      // ownership and lineage rules govern deletion, so the native bulk mutations
      // that would bypass them stay out of this bar.
      selectionActions: i && W.size > 0 ? n(Vl, { entityType: "video", selectedIds: W }) : null
    }, [
      !g && y.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !g && d === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, y.items.map((_) => n(xc, { key: _.videoId, item: _, onNavigate: e, showReviewStates: i, selected: W.has(_.videoId), selectionActive: W.size > 0, onSelect: i ? z : null }))) : null,
      !g && d === "list" ? n("section", { key: "rows", className: "space-y-3" }, y.items.map((_) => n(Sc, { key: _.videoId, item: _, onNavigate: e, showReviewStates: i, selected: W.has(_.videoId), selectionActive: W.size > 0, onSelect: i ? z : null }))) : null
    ])
  ]);
}
function Ei({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = U(null), [s, l] = U(!0), [d, c] = U(""), m = me(0), p = me(0), y = me(e), h = Xd();
  y.current = e;
  const [g] = U(() => Js({
    beginRequest: () => ({ requestId: ++p.current, videoId: y.current }),
    fetchDetail: (G) => ee(f(G.videoId)),
    isCurrent: (G) => gr(G.requestId, p.current, G.videoId, y.current),
    isSameVideo: (G) => G.videoId === y.current
  })), f = (G) => `/videos/${G}/editor`;
  async function k(G, B, R) {
    const I = await ee(f(B), R ? { signal: R.signal } : void 0);
    return gr(G, R ? m.current : p.current, B, y.current) ? (a(I), !0) : !1;
  }
  ge(() => {
    const G = ++m.current, B = e, R = new AbortController();
    return a(null), l(!0), c(""), k(G, B, R).catch((I) => {
      gr(G, m.current, B, y.current) && I.name !== "AbortError" && c(I.message || "Unable to load the editor.");
    }).finally(() => {
      gr(G, m.current, B, y.current) && l(!1);
    }), () => {
      m.current++, p.current++, R.abort();
    };
  }, [e]);
  function C(G, B) {
    a((R) => (R == null ? void 0 : R.video.id) !== B ? R : typeof G == "function" ? G(R) : G);
  }
  function u() {
    return g({
      onLoaded: (G) => {
        a(G), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: (G) => c(G.message || "Unable to reload the latest segment.")
    });
  }
  function j() {
    return g({
      onLoaded: (G) => {
        a(G), c("");
      },
      onError: (G) => c(G.message || "Unable to reload performer slots.")
    });
  }
  function W() {
    return g({
      onLoaded: (G) => {
        a(G), c("");
      },
      onError: (G) => c(G.message || "Unable to load the new AI review results.")
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
      n(Ms, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(Xc, {
      key: i.video.id,
      detail: i,
      onDetailChange: C,
      onConflict: u,
      onReload: j,
      onAnalysisCompleted: W,
      onSlotsChanged: j,
      splitLayout: h,
      profile: o,
      initialSegmentId: ui() ? -ui() : jl(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function fu(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function yu(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function bu(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function hu({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = Rl(o), l = fu(e, t, window.location.pathname), d = yu(e, t, window.location.pathname), c = bu(e, t, window.location.pathname), m = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (Ml(m, o) === "videos" && m !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Jr, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(cu, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(Ri, { onNavigate: r, profile: o });
    const h = Number(e);
    return Number.isInteger(h) && h > 0 ? n(Ei, {
      videoId: h,
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
  if (c) return n(gu, { onNavigate: r, profile: o });
  const y = Number(e);
  return d ? n(Ri, { onNavigate: r, profile: o }) : Number.isInteger(y) && y > 0 ? n(Ei, {
    videoId: y,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(Jr, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function vu({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = U(null), [a, s] = U("");
  return ge(() => {
    const l = new AbortController();
    return ee("/preferences", { signal: l.signal }).then((d) => i(ta(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(hu, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function xu(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function Su(e, t) {
  const r = xu(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const Wu = {
  components: { SegmentStudioPage: vu },
  actionHandlers: { openSegmentStudio: Su }
};
export {
  Wc as ANALYSIS_RUN_CHECK_INTERVAL_MS,
  In as CLEARED_SEGMENT_SELECTION_ID,
  Qt as SEGMENT_STUDIO_CAPABILITIES,
  uo as SEGMENT_STUDIO_EXTENSION_ID,
  Zn as SEGMENT_STUDIO_SHORTCUTS,
  Xs as activeEditorFilterCount,
  Hd as addPendingChange,
  vd as applyDerivationRuleSlotSuggestions,
  Hn as applyFeedbackEditorDelta,
  Vd as applyPendingChanges,
  hi as applySegmentMergeDelta,
  id as basicSegmentTimelineStyle,
  Fl as browseClipEnd,
  ra as browseEditorHref,
  di as buildBrowseRequest,
  nu as buildDerivationRuleGraph,
  yc as buildDiscoveryFindRequest,
  js as buildMinuteTimelineTicks,
  eu as buildPerformerSlotOverview,
  zl as buildSegmentQuickSearchEntries,
  Nd as buildSegmentRailRows,
  Id as buildTimelineRows,
  $u as buildTimelineTicks,
  Ks as calculateCenteredTimelineScroll,
  Qr as calculateEditorPanelMaximum,
  Gs as calculateMinuteLabelStride,
  Tu as calculateMinuteTimelineWidth,
  Hs as calculateSwimlaneTitleMaximum,
  zs as calculateTimelinePlayheadPosition,
  go as calculateTimelineRatioBounds,
  Ws as calculateTimelineRatioFromPointer,
  Ru as calculateVerticalRevealOffset,
  an as clampEditorPanelWidth,
  hr as clampSwimlaneTitleWidth,
  qi as clampTimelineRatio,
  po as clampTimelineRatioForHeight,
  wr as clampTimelineZoom,
  dc as compactProvenanceSummary,
  Jd as confirmPendingChange,
  Js as createEditorReloader,
  hl as createQueuedReviewRequest,
  Kd as createSaveQueue,
  Jc as createSegmentAnalysisRequestScope,
  Wu as default,
  Ca as discardPendingChange,
  bc as discoveryCriteria,
  td as downloadFileNameFromContentDisposition,
  el as dualRangeValueFromPointer,
  ii as duplicateIdentityFromResponse,
  Sl as duplicateOperationKey,
  Ji as editorVisibilityIncludingSegment,
  Td as expandedSwimlanes,
  Dl as extensionOwnedSegmentsModeSwitchPrompt,
  Dd as feedbackFrameTimestamps,
  Pd as feedbackResultMatchesAction,
  Od as feedbackSelectionPlan,
  Zs as filterDerivedSegments,
  zr as filterEditorSegments,
  tu as filterPerformerSlotOverview,
  Kl as filterSegmentQuickSearch,
  Ou as filterSegmentStudioShortcuts,
  Ed as findAdjacentSegmentGroupKey,
  $l as findAdjacentShot,
  fl as findEditorShortcut,
  Hi as findInitialSegmentSelection,
  Fs as findNearestSegmentInCurrentSwimlane,
  xr as findNextUnprocessed,
  Cl as findPublishedSelectionIdentity,
  rt as findSegmentByStableIdentity,
  Vs as findSegmentFromPlayhead,
  Ls as findSegmentNearPlayhead,
  Ad as findSwimlaneRangeSelection,
  ro as findSwimlaneSelection,
  Bl as findUniquePerformerSlotAssignment,
  kr as findUnreviewedSelection,
  pd as focusDialogDefaultButton,
  Tr as formatGenderHint,
  Tl as frameStepSeconds,
  oa as generatePerformerSlotAssignmentRecommendations,
  Ec as groupApprovedDraftsForPublishing,
  Ul as groupAutoAssignCandidates,
  Ld as groupIncorrectExamplesByTag,
  Lc as groupMaterializationOutputs,
  sn as groupSegmentsIntoSwimlanes,
  Cd as groupSelectedSwimlanes,
  So as groupSwimlanesBySegmentGroup,
  Rt as handleModalKey,
  ba as hasGroupedSwimlanes,
  $n as hasSegmentStudioCapability,
  Na as heldTagChangeFor,
  Il as heldTagReady,
  xi as hideCollectedFeedbackSegments,
  yi as historyActionsForTarget,
  fr as incorrectExampleHistoryState,
  ya as indexPerformerSlotsBySegment,
  Fu as initialReviewFilter,
  Gd as insertSegmentProjection,
  gr as isCurrentEditorRequest,
  cd as isEditableTarget,
  Gu as isEditorShortcutOwner,
  Ud as isKindRunning,
  qu as isSaveQueueBusy,
  bu as isSegmentStudioBinRoute,
  yu as isSegmentStudioSegmentsRoute,
  fu as isSegmentStudioSettingsRoute,
  ru as layoutDerivationRuleComponent,
  ou as layoutDerivationRuleComponents,
  Bd as mergeSegmentsProjection,
  oo as migrateLegacyDiscoveryFilter,
  io as migrateLegacyDiscoverySort,
  bd as multiSelectionActionHint,
  nn as normalizeCollapsedSegmentGroups,
  Cr as normalizeDiscoveryIds,
  Dt as normalizeEditorSegmentFilters,
  en as normalizeGender,
  ai as normalizeReviewFilter,
  ta as normalizeSegmentStudioFeatureProfile,
  Pu as normalizeSegmentStudioMode,
  to as normalizeSegmentStudioPublicMode,
  Nn as parseBrowseSlotFilters,
  qs as parseEditorLayout,
  Ys as parseHideDerivedSegmentsPreference,
  Qs as parseMergeConfirmationPreference,
  Xi as parsePlaybackShortcutConfig,
  gl as parseShortcutBindingOverrides,
  Xt as patchPerformerSlotProjection,
  Ku as patchSegmentProjection,
  Yd as pendingChangesReducer,
  qd as pendingInsertedSegments,
  ll as percentageSeekTime,
  Gl as performInitialSegmentSeek,
  ct as performerOptionId,
  Nr as performerSlotHistoryState,
  It as performerSlotLabel,
  xd as performerSlotPresentation,
  Uu as performerSlotStatus,
  xo as performerSlotStatusFromSegmentSlots,
  fa as performerSlotsForSegment,
  Kt as provenanceSourceLabel,
  Ta as prunePendingChanges,
  Nl as queueCreatedSegmentTagChoice,
  ia as rankPerformerOptions,
  Md as reconcileSegmentGroupKey,
  al as reconcileSelectedSegmentIds,
  kc as recyclingBinActionText,
  rd as recyclingBinDeletionPrompt,
  ca as recyclingBinDeletionSummary,
  Ol as recyclingBinModeSwitchPrompt,
  Lu as removeQueuedReviewsForSegments,
  zu as removeSegmentsProjection,
  ui as requestedOwnedItemId,
  jl as requestedSegmentId,
  nl as resolveEditorSegmentSelection,
  vl as resolveQueuedReviewRequest,
  kl as resolveSegmentCreationAction,
  Ml as resolveSegmentStudioRoute,
  pl as resolveSegmentStudioShortcuts,
  ka as resolveSegmentTarget,
  iu as resolveSelectedDerivationRule,
  ni as resolveSelectedSegments,
  Bc as restoreDisabledToolbarActionFocus,
  Zc as restorePublishApprovedFocus,
  _u as restoreSegmentFieldsProjection,
  Hu as restoreSegmentsProjection,
  Wd as retargetPendingChanges,
  Sa as revealCollapsedSegmentGroup,
  Tn as sameSegmentIdentity,
  wa as savingSegmentIdFrom,
  ma as segmentBadgeStyle,
  $r as segmentGroupHeaderBackground,
  Bt as segmentGroupKeyForSegment,
  vo as segmentHistoryIdentity,
  pr as segmentHistoryState,
  $t as segmentIdentity,
  ga as segmentRailItemStyle,
  ju as segmentStateStyle,
  xu as segmentStudioActionTarget,
  Rl as segmentStudioLegacyMode,
  od as segmentTimelineStyle,
  Mt as segmentsHistoryState,
  sl as selectAllVideoSegmentIds,
  Pl as selectedBrowseStates,
  va as selectedSwimlaneMerge,
  vr as selectionReferenceForSegment,
  Aa as setBackLinkNavigation,
  $a as settlePendingChange,
  fd as sharedPerformerSlotShape,
  yd as sharedTagPerformerSlotShape,
  Cn as shortcutAvailableInMode,
  yl as shortcutBindingDisplayText,
  Au as shortcutBindingFromEvent,
  Mu as shortcutBindingsOverlap,
  Du as shortcutModesOverlap,
  ml as shortcutRequiresSingleSegment,
  Hr as shotBoundaryFingerprint,
  gd as shouldAcceptCurrentTagFromEnter,
  md as shouldDismissPopover,
  Eu as shouldExitShortcutCapture,
  Bu as shouldHandleEditorShortcut,
  Vc as shouldLoadSegmentAnalysis,
  Ni as shouldReloadAfterSegmentMutation,
  eo as shouldRestoreTransitionSelection,
  _l as shouldShowQuickSearchGroups,
  ri as splitShortcutCategoriesIntoColumns,
  Yc as startCompletedRunWatch,
  hd as suggestDerivationRuleSlotMappings,
  Yn as swimlaneDisplayLabel,
  dd as swimlaneMarkerTop,
  sd as swimlaneStripeBackground,
  wl as tagEditorLockedBySave,
  ko as targetsOverlap,
  _s as timelineContentStyle,
  Qo as timelinePlayheadHorizontalStyle,
  ad as timelineSegmentWidth,
  Bs as timelineTickAlignment,
  Us as timelineTickPosition,
  Yr as timelineTimePercent,
  hc as toDiscoveryItem,
  Rd as toggleAllCollapsedSegmentGroups,
  bl as toggledSelectionReviewState,
  Jt as trapModalFocus,
  Ql as tryParseJsonResponseText,
  il as updateAnchoredSegmentSelection,
  vc as updateDiscoverySelection,
  tl as updateDualRangeValues,
  rl as updateSegmentCollectionSelection,
  ol as updateSegmentRangeSelection,
  Yi as updateSegmentSelection,
  $i as validateDerivationRuleDraft,
  Yo as validateSegmentTiming,
  fo as videoPerformerOptions,
  Vr as videoPerformerSlotAssignments,
  El as visibleSegmentStudioSettingsTabs,
  Al as visibleSegmentStudioTabs,
  ha as visibleVirtualRows
};
