import jr from "@cove/runtime/react";
import { createPortal as Fi } from "@cove/runtime/react-dom";
import { extensionFetch as na } from "@cove/runtime/api";
import { formatDuration as ji, EntityReferenceSelector as Cn, useExtensionKeyboardBindings as Bi, VideoPlayer as ra, useRegisterExtensionKeyboardActions as oa, getDefaultFilter as aa, useListUrlState as ia, ListPage as sa } from "@cove/runtime/components";
import { ChevronDown as la, Loader2 as Gi } from "@cove/runtime/lucide-react";
const Br = "com.midnightrider.segment-studio", da = "segment-studio.layout.v1", Ft = "segment-studio.operations.v1", ca = "segment-studio.collapsed-segment-groups.v1", ua = "segment-studio.playback-shortcuts.v1", ma = "segment-studio.timing-clipboard.v1", ga = "segment-studio.hide-derived-segments.v1", pa = "segment-studio.merge-confirmation.v1", Xe = ["unreviewed", "approved", "rejected"], Ki = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], ho = "(min-width: 1024px) and (min-height: 640px)", vo = "(min-width: 1024px) and (min-height: 900px)", $n = 1e-3, xo = 15, Ui = 30, fa = 12, rt = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, Gr = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30
}, St = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function So(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function ya(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? ba(e, null, 1, !0) ?? r[0] ?? null;
}
function ba(e, t, r, o = !1) {
  var g;
  const i = e.findIndex((m) => m.markers.some((u) => u.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const m = e.flatMap((u) => u.markers.map((p) => p.segment)).filter((u) => u.reviewState === "unreviewed");
    return r < 0 ? m.at(-1) ?? null : m[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((m) => m.segment.id === t);
  if (!o)
    return ((g = (r < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((u) => u.segment.reviewState === "unreviewed")) == null ? void 0 : g.segment) ?? null;
  const l = e.flatMap((m) => m.markers.map((u) => u.segment)), d = l.findIndex((m) => m.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((m) => m.reviewState === "unreviewed") ?? null;
}
function zi(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((g, m) => g.markers.filter(({ segment: u }) => {
    const p = Number(u.startSec), f = u.endSec == null ? p + Ui : Number(u.endSec);
    return Number.isFinite(p) && Number.isFinite(f) && f >= p && p <= i + xo + $n && f >= i - xo - $n;
  }).map(({ segment: u }) => ({ segment: u, laneIndex: m }))).sort((g, m) => g.laneIndex - m.laneIndex || Math.abs(g.segment.startSec - i) - Math.abs(m.segment.startSec - i) || g.segment.id - m.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((g) => g.markers.some((m) => m.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((g) => g.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((g) => g.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((g) => g.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function _i(e, t, r) {
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
function Xn(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function lc(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function Hi(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function dc(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function qi(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function Wi(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Vi(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function Ji(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Ar(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function Yi(e, t, r = 10) {
  const o = Ar(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function ko(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function Qi(e, t = fa) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function ha(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : rt.timelineRatio;
}
function Rr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function Pt(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? rt.detailWidth : Math.min(Rr(t, 0), Math.max(240, e));
}
function Zn(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? rt.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function Zi(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function Kr(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: rt.timelineRatio, maximum: rt.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function Ur(e, t) {
  const r = ha(e);
  if (!(t > 0)) return r;
  const o = Kr(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function Xi(e) {
  if (!e) return { ...rt };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? ha(r) : rt.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: Pt(t == null ? void 0 : t.detailWidth),
      markerRailWidth: Pt(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: Zn(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...rt };
  }
}
function es(e, t, r) {
  return r > 0 ? Ur((t + r - e) / r, r) : rt.timelineRatio;
}
function cc(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function ts(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, g) => c.startSec - g.startSec || c.id - g.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= $n ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function Ot(e, t, r, o) {
  return e === t && r === o;
}
const er = "__segment-studio-cleared-selection__";
function ns(e) {
  return e === "true";
}
function rs(e) {
  return e !== "false";
}
function va() {
  try {
    return rs(window.localStorage.getItem(pa));
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
function os(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function dt(e = {}) {
  const t = Xe.filter((g) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(g) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (g, m) => {
    const u = Number(g);
    return Number.isFinite(u) ? Math.min(1, Math.max(0, u)) : m;
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
function wr(e, t, r, o = !1, i = []) {
  var c, g;
  const a = dt(r), s = a.performerId == null ? null : new Set((t || []).filter((m) => Number(m.performerId) === a.performerId).map((m) => m.segmentId)), l = new Set((i || []).flatMap((m) => m.tags || []).map((m) => Number(m.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((g = (c = (i || []).find((m) => Number(m.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : g.map((m) => Number(m.tagId))) || []);
  return os(e || [], o).filter((m) => {
    if (m.reviewState != null && !a.reviewStates.includes(m.reviewState) || s && !s.has(m.id) || a.tagId != null && Number(m.tagId) !== a.tagId || d && !d.has(Number(m.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(m.tagId)) || a.sourceKey != null && m.sourceKey !== a.sourceKey) return !1;
    const u = Number(m.confidence);
    return m.confidence == null || !Number.isFinite(u) ? a.includeUnscored : u >= a.confidenceMin && u <= a.confidenceMax;
  });
}
function as(e, t, r, o = !1, i = []) {
  var l;
  const a = dt(r);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = dt({
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
    filters: dt(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function is(e, t = !1) {
  const r = dt(e);
  return +(r.reviewStates.length !== Xe.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function ss(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function ls(e, t, r, o) {
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
function ds(e, t, r = null) {
  return t === er ? null : ya(
    e,
    t ?? r
  );
}
function Sa(e, t, r, o = !1) {
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
function cs(e, t, r) {
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
function us(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return Sa(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function ms(e, t, r = null, o = !1) {
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
    const m = o ? [.../* @__PURE__ */ new Set([...l, ...i])] : l;
    return {
      ...us(m, s, t, g, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: m
    };
  }
  const d = Sa(i, a, t, o);
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
function gs(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function ps(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function wo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function No(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => wo(t, o) - wo(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function fs(e, t, r) {
  var c, g;
  const o = e || [], i = new Set(t || []), a = o.findIndex((m) => (m.markers || []).some(({ segment: u }) => u.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: m }) => m.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const m of o) {
      const u = (m.markers || []).find(({ segment: p }) => !i.has(p.id));
      if (u) return u.segment;
    }
    return null;
  }
  const l = No(
    o[a].markers,
    s,
    i
  );
  if (l) return l;
  const d = (g = o.map((m, u) => ({ lane: m, index: u })).filter(({ lane: m }) => (m.markers || []).some(({ segment: u }) => !i.has(u.id))).sort((m, u) => Math.abs(m.index - a) - Math.abs(u.index - a) || +(m.index < a) - +(u.index < a) || m.index - u.index)[0]) == null ? void 0 : g.lane;
  return No(d == null ? void 0 : d.markers, s, i);
}
function ys(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function bs(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function hs(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function vs() {
  try {
    return ns(window.localStorage.getItem(ga));
  } catch {
    return !1;
  }
}
function xs(e) {
  try {
    window.localStorage.setItem(ga, String(!!e));
  } catch {
  }
}
const Mn = [
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
], Ss = /* @__PURE__ */ new Set([
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
function ks(e) {
  return Ss.has(e);
}
function ka(e) {
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
function ws(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Mn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(ka).filter(Boolean)]));
  } catch {
    return {};
  }
}
function Ns(e = {}) {
  const t = ws(e);
  return Mn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function Io(e, t = 2) {
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
function uc(e) {
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
function mc(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function Mr(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function Co(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function gc(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = Co(e.code, t.key), a = Co(t.code, e.key);
  if (!r && !o && !i && !a) return !1;
  const s = i ? t.key : e.key, l = i ? e.code : a ? t.code : o ? e.code : e.code || t.code;
  for (const d of [!1, !0])
    for (const c of [!1, !0])
      for (const g of [!1, !0])
        for (const m of [!1, !0]) {
          const u = {
            key: s,
            code: l,
            ctrlKey: d,
            metaKey: c,
            altKey: g,
            shiftKey: m
          };
          if (Mr(u, e) && Mr(u, t)) return !0;
        }
  return !1;
}
function Qt(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function pc(e, t) {
  return [!1, !0].some((r) => Qt(e, r) && Qt(t, r));
}
function Is(e, t = !1, r = {}) {
  return Ns(r).find((o) => Qt(o, t) && o.bindings.some((i) => Mr(e, i))) || null;
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
function Cs(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(wa).join(" / ") : "Unassigned";
}
function fc(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, Cs(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function yc(e) {
  return e === "review" ? "review" : "editor";
}
function He(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function $s(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function Ts(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function As(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => He(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: He(t, e.activeIdentity) || r[0]
  };
}
function Rs(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function Ms(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => Rs(o, i))));
}
function $o(e, t) {
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
function Es(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function Ds(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function Er(e, t) {
  return e === t;
}
function Os(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function Ps(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - $n).at(-1) || null : o.find((i) => i.startSec > t + $n) || null;
}
function Nn(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function To(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: Xe.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function bc(e, t = null, r = !1) {
  const o = To(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function Jt(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function Na(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: Jt(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: Jt(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: Jt(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(Jt(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(Jt(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(Jt(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...Gr };
  }
}
function Ls(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function Ia() {
  try {
    return Na(window.localStorage.getItem(ua));
  } catch {
    return { ...Gr };
  }
}
function Ao(e) {
  const t = Na(JSON.stringify(e));
  try {
    window.localStorage.setItem(ua, JSON.stringify(t));
  } catch {
  }
  return t;
}
const kt = Object.freeze({
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
function Dr(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function Ca(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? Dr(e.requestedMode) : "basic",
    effectiveMode: i ? Dr(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function Zt(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function Fs(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function js(e) {
  const t = [];
  return Zt(e, kt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), Zt(e, kt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function Bs(e) {
  return [
    ["general", "General", kt.settingsGeneral],
    ["shortcuts", "Shortcuts", kt.settingsShortcuts],
    ["performer-slots", "Performer slots", kt.settingsPerformerSlots],
    ["derivation", "Derivation", kt.settingsDerivation]
  ].filter(([, , r]) => Zt(e, r)).map(([r, o]) => [r, o]);
}
function Gs(e, t) {
  return e === "segments" && !Zt(
    t,
    kt.navigationSegmentInventory
  ) || e === "bin" && !Zt(
    t,
    kt.recyclingBinView
  ) ? "videos" : e;
}
function Ks(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Us(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const Nr = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, Ro = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: Xe.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function zs(e) {
  const t = String(e || "").split(",").filter((r) => Xe.includes(r));
  return t.length === 0 ? [...Xe] : [...new Set(t)];
}
function Yt(e) {
  return $a(e).values;
}
function $a(e) {
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
function Ir(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function Mo(e, t) {
  var l;
  const r = Eo(t.activitiesCriterion, t.activityId), o = Eo(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = $a(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: _s(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function Eo(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function _s(e, t) {
  return Xe.includes(e == null ? void 0 : e.value) ? [e.value] : zs(t);
}
function Ta(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Hs(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function qs(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Do(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Ws(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function Ve(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function zr(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Cr(e, t) {
  const r = new Set(zr(t).map((o) => String(Ve(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function $t(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function Oo(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map($t).sort().join(",")}`;
}
function Aa(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((p) => String(p.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((p) => {
    var f;
    return !((f = p.genderHints) != null && f.length);
  }) && e.length === t.length && !i) {
    const p = [...e].sort((b, y) => String(b.slotDefinitionId).localeCompare(String(y.slotDefinitionId))), f = [...t].sort((b, y) => String(b.name).localeCompare(String(y.name)) || Number(Ve(b)) - Number(Ve(y)));
    return [{
      assignments: Object.fromEntries(p.map((b, y) => [String(b.slotDefinitionId), String(Ve(f[y]))])),
      description: f.map((b) => b.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((p) => t.map((f, b) => ({ performer: f, index: b })).filter(({ performer: f }) => {
    var b;
    return !((b = p.genderHints) != null && b.length) || p.genderHints.some((y) => $t(y) === $t(f.gender || f.genderIdentity));
  }).map(({ index: f }) => f)), g = i ? c.filter((p) => p.length > 0).length : Po(c, t.length);
  if (g === 0) return [];
  const m = new Map(t.map((p, f) => [String(Ve(p)), f]));
  function u(p, f, b) {
    if (s.length >= a) return;
    const y = c.slice(p), w = i ? y.filter((D) => D.length > 0).length : Po(y.map((D) => D.filter((B) => !f.has(String(Ve(t[B]))))), t.length);
    if (b + w < g) return;
    if (p === e.length) {
      if (b !== g) return;
      const D = Object.fromEntries(d.map(({ slot: C, performer: R }) => [String(C.slotDefinitionId), R ? String(Ve(R)) : ""])), B = o.length === 0 ? Object.values(D).sort().join(",") : [...new Set(e.map((C) => String(C.label || "")))].map((C) => `${C}:${d.filter(({ slot: R }) => String(R.label || "") === C).map(({ performer: R }) => R ? String(Ve(R)) : "").sort().join(",")}`).join("|");
      !l.has(B) && s.length < a && (l.add(B), s.push({
        assignments: D,
        description: d.map(({ slot: C, performer: R }) => o.length ? `${C.label}: ${(R == null ? void 0 : R.name) || "Unassigned"}` : (R == null ? void 0 : R.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const v = e[p], I = [...d].reverse().find(({ slot: D }) => Oo(D) === Oo(v)), V = I ? m.get(String(Ve(I.performer))) : -1;
    for (const D of c[p]) {
      const B = t[D], C = Ve(B);
      if (!(D < V) && !(C == null || !i && f.has(String(C))) && (d.push({ slot: v, performer: B }), i || f.add(String(C)), u(p + 1, f, b + 1), i || f.delete(String(C)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: v, performer: null }), u(p + 1, f, b), d.pop();
  }
  return u(0, /* @__PURE__ */ new Set(), 0), s;
}
function Po(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Vs(e, t) {
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
      const m = [...new Set(e.map((u) => u.label || ""))].map((u) => `${u}:${a.filter((p) => (p.slot.label || "") === u).map((p) => p.performer.performerId).sort((p, f) => p - f).join(",")}`).join("|");
      i.has(m) || i.set(m, [...a]);
      return;
    }
    const c = e[l];
    for (const m of t)
      !o && d.has(m.performerId) || (g = c.genderHints) != null && g.length && !c.genderHints.some((u) => $t(u) === $t(m.gender)) || (a.push({ slot: c, performer: m }), o || d.add(m.performerId), s(l + 1, d), o || d.delete(m.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Js(e) {
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
function Ys(e, t, r = 20) {
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
function Qs(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function Zs(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function Ra(e, t, r) {
  const o = Ve, i = new Set((t || []).map(o)), a = new Set((r || []).map($t));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const m = $t(l.gender || l.genderIdentity), u = $t(d.gender || d.genderIdentity), p = l.matchesGenderHint ?? a.has(m);
    return (d.matchesGenderHint ?? a.has(u)) - p || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: fe, useId: Ma, useMemo: Ge, useRef: pe, useState: F } = jr, n = jr.createElement, Ea = "/api/plugins/segment-studio";
function Le(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Ft) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = Or();
    return t[e] = r, window.localStorage.setItem(Ft, JSON.stringify(t)), r;
  } catch {
    return Or();
  }
}
function Fe(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Ft) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(Ft, JSON.stringify(t));
  } catch {
  }
}
function _r(e) {
  try {
    return JSON.parse(window.localStorage.getItem(Ft) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function Hr(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Ft) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(Ft, JSON.stringify(t));
  } catch {
  }
}
function Xs(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function el(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function ee(e, t, r = 0) {
  var d;
  const o = await na(`${Ea}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Xs(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await el(250 * (r + 1), t == null ? void 0 : t.signal), ee(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function tl(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${Ea}${e}`, o = await na(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: nl(
      o.headers.get("Content-Disposition")
    )
  };
}
function nl(e, t = "segment-studio-ai-feedback.zip") {
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
function $e(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function Or() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function Da(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function rl(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function Oa(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function ol(e, t) {
  const { sceneCount: r, segmentCount: o } = Oa(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function Pa(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = Oa(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(ol(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await ee("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Le(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return Fe(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function Lo({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const mt = {
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
function hc(e, t) {
  return {
    ...(mt[e] || mt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function La(e) {
  return { ...(mt[e] || mt.unreviewed).badge };
}
function Fa(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const ja = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function al(e, t, r = "not-applicable", o = !1) {
  const i = mt[e] || mt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function il(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function sl(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function ll(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function dl(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function or(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function cl(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function jt({ state: e, includeLabel: t = !0 }) {
  const r = mt[e] || mt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: La(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function ul(e, t = null) {
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
function vc(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function ml(e, t = document) {
  return !(e.defaultPrevented || ul(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function xc(e, t = document, r = !1, o = {}) {
  return ml(e, t) ? Is(e, r, o) != null : !1;
}
function ot(e, { onCancel: t, onConfirm: r } = {}) {
  var s, l;
  if (e.key === "Enter" && (e.isComposing || (s = e.nativeEvent) != null && s.isComposing || e.keyCode === 229)) return !1;
  const o = typeof ((l = e.target) == null ? void 0 : l.closest) == "function" ? e.target.closest("button, a, select, option, textarea") : e.target, i = String((o == null ? void 0 : o.tagName) || "").toLowerCase();
  if (i === "select" || i === "option" || e.key === "Enter" && (e.repeat || ["button", "a", "textarea"].includes(i))) return !1;
  const a = e.key === "Escape" ? t : e.key === "Enter" ? r : null;
  return a ? (e.preventDefault(), e.stopPropagation(), a(), !0) : !1;
}
function gl(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function yt(e) {
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
function pl(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? i.filter((a) => a.sequence > o && a.sequence <= r).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > r && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function Ba(e, t = !0) {
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
function Jn(e, t = !0) {
  return {
    type: "segment",
    identity: Ba(e, t),
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
function lt(e, t = !0) {
  return {
    type: "segments",
    segments: (e || []).map((r) => ({
      identity: Ba(r, t),
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
function tr(e) {
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
function Ga(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function Ka(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = t.get(r.segmentId);
    o ? o.push(r) : t.set(r.segmentId, [r]);
  }
  for (const r of t.values())
    r.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function qr(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function fl(e, t) {
  const r = (t || []).map((i) => Ga(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: et(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function yl(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : fl(e, t);
}
function bl({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function Sc(e, t) {
  return qr(Ga(e, t));
}
function et(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function hl(e, t) {
  const r = (d) => et(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
    const c = /* @__PURE__ */ new Map();
    for (const g of d || []) {
      const m = r(g);
      c.has(m) || c.set(m, []), c.get(m).push(g);
    }
    return c;
  }, a = i(e), s = i(t), l = [];
  for (const [d, c] of a) {
    const g = s.get(d);
    if (!g || c.length !== g.length)
      continue;
    const m = [...c].sort(o), u = [...g].sort(o);
    m.forEach((p, f) => l.push({
      sourceSlotDefinitionId: p.id,
      derivedSlotDefinitionId: u[f].id
    }));
  }
  return l;
}
function vl(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = hl(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function xl(e) {
  const t = et(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(ar).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function ar(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function nr(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function Fo(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((g) => g.end <= s && g.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: nr(o),
    trackCount: Math.max(1, t.length)
  };
}
function Sl(e) {
  const t = e.map(et), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function kl(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], g = d.length > 0 && d.every((m) => Number(m.performerId) > 0) ? d.map((m) => `${m.slotDefinitionId}:${Number(m.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: g };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [Fo({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = Sl(l.slots), g = l.slots.filter((b) => !a.has(String(b.slotDefinitionId))), m = o.length === 1 ? l.slots : g, u = m.map((b) => `${c.get(String(b.slotDefinitionId))} · ${b.performerName || `Performer ${b.performerId}`}`).join(" · "), p = [...new Map(m.map((b) => [
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
          performerLabel: u,
          performers: p,
          performerAssignments: f,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(Fo);
}
function Lt(e, t = [], r = []) {
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => kl(s, a));
}
function Wr(e) {
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
    for (const s of Xe)
      a.counts[s] += Number((r = o.counts) == null ? void 0 : r[s]) || 0;
  }
  return t;
}
const wl = {
  group: 38,
  lane: 33,
  segment: 41
};
function Nl(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = wl[s.kind];
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
function Ua(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function Il(e, t = [], r = !0) {
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
function Cl(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: nr(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return Wr(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: nr(a)
    };
  });
}
function za(e, { nativeOnly: t = !1 } = {}) {
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
function jo(e, t) {
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
function At(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function Tn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function $l(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var r;
    return (r = t[0]) == null ? void 0 : r.toUpperCase();
  }).join("") || "?";
}
function An({ performer: e, compact: t = !1, tooltip: r = null }) {
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
    }, o ? $l(e.name) : "—"),
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
function _a({ assignments: e, className: t = "" }) {
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
      n(An, {
        key: `${r.key}:avatar`,
        performer: r.performer
      })
    ];
  }));
}
function ir({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = pe(null), i = `performer-slots-${Ma()}`, [a, s] = F(null);
  function l() {
    var p;
    const c = (p = o.current) == null ? void 0 : p.getBoundingClientRect();
    if (!c) return;
    const g = Math.max(0, Math.min(256, window.innerWidth - 16)), m = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), u = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - g - 8, c.right - g)),
      top: u >= m + 8 ? c.bottom + 4 : Math.max(8, c.top - m - 4),
      width: g
    });
  }
  fe(() => {
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
    ...e.slice(0, 3).map((c) => n(An, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? Fi(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(_a, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : n("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => n(An, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function Tl(e, t) {
  const r = new Set(At(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function Ha(e, t) {
  return t ? At(e).filter((r) => r !== t) : At(e);
}
function Al(e, t) {
  const r = At(t), o = new Set(At(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function ut(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function Bo(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), g = Number.isFinite(c) && c >= d ? c : d, m = d <= o && g >= o, u = m ? 0 : Math.min(Math.abs(o - d), Math.abs(o - g));
    return { contains: m, distance: u, duration: g - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function Pr(e, t, r, o = null) {
  var g, m, u, p, f, b;
  const i = e.findIndex((y) => y.markers.some((w) => w.segment.id === t));
  if (i < 0) {
    const y = [...((g = e[0]) == null ? void 0 : g.markers) || []];
    return o != null && Number.isFinite(Number(o)) && y.sort((w, v) => Bo(w, v, o)), ((m = y[0]) == null ? void 0 : m.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((y) => y.segment.id === t);
  if (r === "left" || r === "right") {
    const y = r === "left" ? -1 : 1, w = Math.min(a.markers.length - 1, Math.max(0, s + y));
    return ((u = a.markers[w]) == null ? void 0 : u.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((p = a.markers[s]) == null ? void 0 : p.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((f = a.markers[s]) == null ? void 0 : f.segment) ?? null : ((b = [...e[l].markers].sort(c ? (y, w) => Bo(y, w, Number(o)) : (y, w) => Math.abs(y.segment.startSec - d) - Math.abs(w.segment.startSec - d) || y.segment.startSec - w.segment.startSec || y.segment.id - w.segment.id)[0]) == null ? void 0 : b.segment) ?? null;
}
function Rl(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = Pr([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function Ml(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function El(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function Dl(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [zo(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => zo(Math.min(s, r + l))))];
}
function Ol(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function Pl(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function Go(e, t) {
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
    const m = Number(c);
    r.has(m) && !o.has(m) || (d[o.get(m) ?? c] = g);
  }
  return {
    ...e,
    approvedSetVersion: t.approvedSetVersion || e.approvedSetVersion,
    segments: a,
    performerSlots: l,
    performerSlotRevisions: d
  };
}
function Ko(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function Ll(e) {
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
async function Fl(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await Uo(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], g = Dl(
        d.startSec,
        d.endSec
      );
      for (const [m, u] of g.entries()) {
        Math.abs(r.currentTime - u) > 5e-4 && (r.currentTime = u, await Uo(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const p = await jl(o), f = `example-${l + 1}-frame-${m + 1}`;
        c.push({ fieldName: f, timestampSec: u }), s.push({
          fieldName: f,
          file: new File(
            [p],
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
    r.pause(), r.removeAttribute("src"), r.load(), r.remove();
  }
}
function Uo(e, t) {
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
function jl(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function zo(e) {
  return Math.round(e * 1e3) / 1e3;
}
function rr(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Bl(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function Lr(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function Rn(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function qa(e, t) {
  const r = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...r.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function $r(e, t, r, o) {
  const i = (r || []).map((d) => ({ ...d, segmentId: t })), a = e.performerSlots || [], s = a.findIndex((d) => d.segmentId === t), l = a.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...i), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function Gl(e, t) {
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
function _o(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function Kl(e) {
  const { compatibilityMode: t, currentTime: r, detail: o, editorFilters: i, endInput: a, hideDerivedSegments: s, historyRef: l, mediaDuration: d, onConflict: c, onDetailChange: g, onReload: m, optimisticSegmentIdRef: u, pendingDuplicateRef: p, pendingFirstSegmentStartSecRef: f, pendingTagEditSegmentIdRef: b, replaceSegmentSelection: y, savingSegmentId: w, segments: v, selectedSegment: I, selectedSegmentIdRef: V, selectedSegments: D, selectionAnchorIdRef: B, selectionRangeBaseIdsRef: C, setEditorFilters: R, setFirstSegmentTagOpen: E, setHideDerivedSegments: P, setHistory: z, setHistoryOpen: L, setPublishApprovedError: Y, setSaveMessage: N, setSavingSegmentId: $, setSelectedSegmentGroupKey: j, setSelectedSegmentId: Q, setSelectedSegmentIds: ie, startInput: ue, timelineDuration: ge, video: G } = e;
  function X(h) {
    l.current = h || St, z(l.current);
  }
  async function de(h, U, T, x, M = null) {
    var S;
    try {
      const k = await ee(`/videos/${G.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: l.current.revision,
          kind: h,
          label: U,
          beforeState: T,
          afterState: x,
          receiptId: M
        })
      });
      return X(k), !0;
    } catch (k) {
      return k.status === 409 && ((S = k.payload) != null && S.current) && X(k.payload.current), N("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function ne(h, U, T = !0, x = null, M = !1, S = U) {
    var oe;
    if (!h || w != null) return null;
    const k = D.map((ke) => ke.id), W = V.current, me = T && !t ? crypto.randomUUID() : null;
    $(h.id), N(T ? "Saving directly to Cove…" : "Restoring history…");
    const se = M ? rr(o, [h.id], S) : null;
    se && g(se, G.id);
    try {
      if (t && h.nativeSegmentId == null && h.itemId != null) {
        const Z = `draft-update:${G.id}:${h.itemId}:${h.revision}:${U.tagId}:${U.startSec}:${U.endSec ?? "open"}:${U.reviewState ?? h.reviewState}`, O = await ee(`/videos/${G.id}/drafts/${h.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(Z),
            expectedRevision: h.revision,
            startSec: U.startSec,
            endSec: U.endSec,
            tagId: U.tagId,
            reviewState: U.reviewState
          })
        });
        Fe(Z);
        const re = {
          ...h,
          ...O.draft,
          id: h.id,
          itemId: h.itemId
        };
        return T && await de(
          "segment.update",
          x || "Changed segment",
          Jn(h, t),
          Jn(
            re,
            t
          )
        ), _o(h, U, t) ? await m() : g({
          ...o,
          approvedSetVersion: O.approvedSetVersion || o.approvedSetVersion,
          segments: v.map((ye) => ye.id === h.id ? re : ye).sort((ye, he) => ye.startSec - he.startSec || ye.id - he.id)
        }, G.id), N(((oe = O.draft) == null ? void 0 : oe.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), re;
      }
      const ke = await ee(`/videos/${G.id}/segments/${h.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...U,
          expectedUpdatedAt: h.updatedAt,
          historyReceiptId: me
        })
      }), q = {
        ...h,
        ...ke,
        reviewState: U.reviewState ?? h.reviewState
      }, te = v.map((Z) => Z.id === h.id ? q : Z).sort((Z, O) => Z.startSec - O.startSec || Z.id - O.id);
      return _o(h, U, t) ? await m() : g({ ...o, segments: te }, G.id), T && await de(
        "segment.update",
        x || "Changed segment",
        Jn(h, t),
        Jn(
          q,
          t
        ),
        me
      ), N(T ? "Saved to Cove" : "History restored"), q;
    } catch (ke) {
      return M && (g((q) => Rn(
        q,
        [h],
        Object.keys(S)
      ), G.id), ie(k), Q(W), B.current = W, C.current = []), ke.status === 409 ? (N("Conflict — loading the latest segment…"), await c()) : N(ke.message || "Unable to save the segment."), null;
    } finally {
      $(null);
    }
  }
  async function be() {
    if (!t) return !1;
    const h = v.filter((T) => !T.published && T.reviewState === "approved").length;
    if (h === 0 || w != null) return !1;
    const U = `complete-review:${G.id}:${o.approvedSetVersion}`;
    Y(""), $(-1), N(`Publishing ${h} Approved draft${h === 1 ? "" : "s"}…`);
    try {
      const T = await ee(`/videos/${G.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(U),
          expectedApprovedSetVersion: o.approvedSetVersion
        })
      });
      Fe(U), X(St), L(!1);
      const x = await m(), M = Os(
        v,
        V.current,
        T.published
      ), S = M ? He(x == null ? void 0 : x.segments, M) : null;
      return S && Q(S.id), N(`${T.published.length} Approved draft${T.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (T) {
      const x = T.status === 409 ? "The approved drafts changed. Review the updated list and try again." : T.message || "Unable to publish the approved drafts.";
      return T.status === 409 && await c(), Y(x), N(x), !1;
    } finally {
      $(null);
    }
  }
  async function Se(h = null, U = null) {
    var q;
    if (w != null) return;
    const T = h != null ? f.current : null, x = Number.isFinite(T) ? T : r, M = Math.min(ge, x + 20);
    if (M <= x) {
      N("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const S = Ds(v, I, h);
    if (S.kind === "choose-tag") {
      f.current = x, N(""), E(!0);
      return;
    }
    if (S.kind === "invalid-selection") {
      N("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: k } = S, W = `create-draft:${G.id}:${k}:${x}`, me = t ? null : crypto.randomUUID(), se = V.current, oe = {
      ...I || {},
      id: u.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: k,
      tagName: U || (I == null ? void 0 : I.tagName) || "Tag segment",
      tagSortName: k === (I == null ? void 0 : I.tagId) && (I == null ? void 0 : I.tagSortName) || null,
      startSec: x,
      endSec: M,
      reviewState: "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, ke = Bl(o, oe);
    $(-1), E(!1), g(ke, G.id), y(oe.id), j(ut(
      Lt(ke.segments, ke.segmentGroups || [], ke.performerSlots || []),
      oe.id
    ));
    try {
      let te;
      if (t) {
        const re = await ee(`/videos/${G.id}/drafts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationId: Le(W), tagId: k, startSec: x, endSec: M })
        });
        Fe(W), te = { itemId: (q = re.draft) == null ? void 0 : q.itemId };
      } else
        te = { nativeSegmentId: (await ee(`/videos/${G.id}/segments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tagId: k,
            startSec: x,
            endSec: M,
            historyReceiptId: me
          })
        })).id };
      f.current = null, E(!1);
      const Z = await m();
      if (!Z) {
        g((re) => Lr(
          re,
          [oe.id]
        ), G.id), y(se), N("Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment.");
        return;
      }
      const O = He(Z == null ? void 0 : Z.segments, te);
      O ? (t || await de(
        "segment.create",
        "Created segment",
        lt([], !1),
        lt([O], !1),
        me
      ), S.openTagEditor && (b.current = O.id), y(O.id), j(ut(
        Lt(Z.segments || [], Z.segmentGroups || [], Z.performerSlots || []),
        O.id
      ))) : N("Segment created, but it could not be selected.");
    } catch (te) {
      g((Z) => Lr(
        Z,
        [oe.id]
      ), G.id), y(se), h != null && E(!0), N(te.message || "Unable to create the draft.");
    } finally {
      $(null);
    }
  }
  async function A() {
    if (D.length !== 1 || !I || w != null) return;
    const h = r;
    if (h <= I.startSec || I.endSec != null && h >= I.endSec) {
      N("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const U = `split-draft:${I.itemId}:${I.revision}:${h}`, T = t ? null : lt([I], !1), x = t ? null : crypto.randomUUID();
    $(I.id);
    try {
      let M = null;
      t && I.nativeSegmentId == null ? (await ee(`/videos/${G.id}/drafts/${I.itemId}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(U),
          expectedRevision: I.revision,
          splitSec: h
        })
      }), Fe(U)) : M = { nativeSegmentId: (await ee(`/videos/${G.id}/segments/${I.id}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedUpdatedAt: I.updatedAt,
          splitSec: h,
          historyReceiptId: x
        })
      })).id };
      const S = await m();
      if (!t) {
        const k = [
          He(S == null ? void 0 : S.segments, {
            nativeSegmentId: I.nativeSegmentId ?? I.id
          }),
          He(
            S == null ? void 0 : S.segments,
            M
          )
        ].filter(Boolean);
        await de(
          "segment.split",
          "Split segment",
          T,
          lt(k, !1),
          x
        );
      }
      N(t ? `Segment split; both ranges remain ${I.reviewState}.` : "Segment split.");
    } catch (M) {
      M.status === 409 ? await c() : N(M.message || "Unable to split the draft.");
    } finally {
      $(null);
    }
  }
  async function J(h = !1) {
    var M, S;
    if (D.length !== 1 || !I || w != null) return;
    const U = h ? r : I.startSec, T = Es(G.id, I, h, U), x = t ? null : crypto.randomUUID();
    $(I.id);
    try {
      const k = ((M = p.current) == null ? void 0 : M.operationKey) === T ? p.current : null;
      let W = (k == null ? void 0 : k.duplicateIdentity) ?? null;
      if (W == null && t && I.nativeSegmentId == null) {
        const oe = await ee(`/videos/${G.id}/drafts/${I.itemId}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(T),
            expectedRevision: I.revision,
            startSec: h ? U : null
          })
        });
        W = $o(!1, oe), p.current = { operationKey: T, duplicateIdentity: W };
      } else if (W == null) {
        const oe = await ee(`/videos/${G.id}/segments/${I.id}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: I.updatedAt,
            startSec: h ? U : null,
            historyReceiptId: x
          })
        });
        W = $o(!0, oe), p.current = { operationKey: T, duplicateIdentity: W };
      }
      const me = await m(), se = He(me == null ? void 0 : me.segments, W);
      if (se) {
        t || await de(
          "segment.duplicate",
          "Duplicated segment",
          lt([], !1),
          lt([se], !1),
          x
        );
        const oe = as(
          se,
          me.performerSlots || [],
          i,
          s,
          me.segmentGroups || []
        );
        R(oe.filters), P(oe.hideDerivedSegments), ie([se.id]), Q(se.id), B.current = se.id, C.current = [], j(ut(
          Lt(me.segments || [], me.segmentGroups || [], me.performerSlots || []),
          se.id
        )), t && I.nativeSegmentId == null && Fe(T), p.current = null, N(h ? "Duplicate created at the playhead." : "Duplicate created in place.");
      } else
        N("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
    } catch (k) {
      ((S = p.current) == null ? void 0 : S.operationKey) === T ? N("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : k.status === 409 ? await c() : N(k.message || "Unable to duplicate the draft.");
    } finally {
      $(null);
    }
  }
  async function _() {
    if (D.length !== 1 || !I) return;
    const h = Number(ue), U = a.trim() === "" ? null : Number(a), T = So(h, U, d);
    if (T.error) {
      N(T.error);
      return;
    }
    if (h === I.startSec && U === I.endSec) {
      N("Timing is unchanged.");
      return;
    }
    await ne(I, { startSec: h, endSec: U, tagId: I.tagId }, !0, null, !0);
  }
  async function ae(h, U) {
    if (D.length !== 1 || !I) return;
    const T = So(h, U, d);
    if (T.error) {
      N(T.error);
      return;
    }
    if (h === I.startSec && U === I.endSec) {
      N("Timing is unchanged.");
      return;
    }
    await ne(I, { startSec: h, endSec: U, tagId: I.tagId }, !0, null, !0);
  }
  return { acceptHistory: X, recordHistoryAction: de, mutateSegment: ne, completeReview: be, createSegment: Se, splitSegment: A, duplicateSegment: J, saveTiming: _, applyShortcutTiming: ae };
}
function Ul() {
  const [e, t] = F(() => typeof window < "u" && window.matchMedia(ho).matches);
  return fe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(ho), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function zl() {
  const [e, t] = F(() => typeof window < "u" && window.matchMedia(vo).matches);
  return fe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(vo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function _l() {
  try {
    return Xi(window.localStorage.getItem(da));
  } catch {
    return { ...rt };
  }
}
function Hl() {
  try {
    return At(JSON.parse(window.localStorage.getItem(ca) || "[]"));
  } catch {
    return [];
  }
}
function ql(e) {
  try {
    window.localStorage.setItem(ca, JSON.stringify(At(e)));
  } catch {
  }
}
function Wl(e) {
  try {
    window.localStorage.setItem(da, JSON.stringify(e));
  } catch {
  }
}
function Vl() {
  try {
    const e = JSON.parse(window.localStorage.getItem(ma) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Jl(e) {
  try {
    return window.localStorage.setItem(ma, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Yl({ status: e }) {
  const t = ja[e];
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
function Tt({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, Xe.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...La(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${mt[t].symbol}${e[t]}`)));
}
function Ql({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: g, shortcutRef: m }) {
  const u = zr(a), [p, f] = F(() => Cr(o, u)), [b, y] = F(!1), [w, v] = F(""), I = pe(!1), V = o.map((P) => `${P.slotDefinitionId}:${P.performerId || ""}`).join("|"), D = u.map((P) => Ve(P)).join("|"), B = Aa(
    o,
    u
  );
  fe(() => {
    f(Cr(o, u)), v("");
  }, [t, r, V, D]);
  async function C(P = p) {
    if (!I.current) {
      I.current = !0, y(!0), v("Saving performer slots…");
      try {
        const z = Cr(o.map((N) => ({
          ...N,
          performerId: P[N.slotDefinitionId] || null
        })), u), L = o.map((N) => {
          const $ = z[N.slotDefinitionId] ? Number(z[N.slotDefinitionId]) : null, j = u.find((Q) => String(Ve(Q)) === String($));
          return {
            ...N,
            performerId: $,
            performerName: (j == null ? void 0 : j.name) || null
          };
        });
        s(L);
        const Y = await ee(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((N) => ({ slotDefinitionId: N.slotDefinitionId, performerId: z[N.slotDefinitionId] ? Number(z[N.slotDefinitionId]) : null }))
          })
        });
        v("Performer slots saved."), await l(Y, {
          beforeState: tr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: tr([{
            segmentId: t,
            itemId: r,
            revision: Y.revision,
            slots: Y.slots || []
          }])
        });
      } catch (z) {
        d && await d(o, z), z.status === 409 ? (v("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : v(z.message || "Unable to save performer slots.");
      } finally {
        I.current = !1, y(!1);
      }
    }
  }
  function R(P, z) {
    v(`Option ${z + 1} applied; save to confirm.`), f({ ...p, ...P.assignments });
  }
  async function E(P) {
    const z = { ...p, ...P.assignments };
    f(z), await C(z);
  }
  return fe(() => {
    if (m)
      return m.current = (P) => I.current || !B[P] ? !1 : (E(B[P]), !0), () => {
        m.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    B.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, B.map((P, z) => n("button", {
        key: z,
        type: "button",
        disabled: b,
        onClick: () => R(P, z),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${z + 1}: ${P.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, z + 1),
        n("span", { key: "description" }, P.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${B.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((P) => n("label", { key: P.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, et(P)),
      (P.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(P.genderHints || []).map(ar).join(" · ")}`) : null,
      n("select", { key: "select", value: p[P.slotDefinitionId] || "", disabled: b, onChange: (z) => f({ ...p, [P.slotDefinitionId]: z.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Ra(u, u, P.genderHints).map((z) => n("option", { key: Ve(z), value: Ve(z) }, z.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: g, type: "button", disabled: b, onClick: () => C(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, w)])
  ]);
}
function Zl({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a }) {
  var B;
  const s = ((B = t[0]) == null ? void 0 : B.slots) || [], l = zr(r), d = Aa(
    s,
    l
  ), c = "__mixed__", g = () => Object.fromEntries(s.map((C, R) => {
    const E = t.map((P) => {
      var z;
      return String(((z = P.slots[R]) == null ? void 0 : z.performerId) || "");
    });
    return [C.slotDefinitionId, E.every((P) => P === E[0]) ? E[0] : c];
  })), [m, u] = F(g), [p, f] = F(!1), [b, y] = F(""), w = pe(!1), v = t.map((C) => `${C.itemId ?? `native:${C.segmentId}`}:${C.revision}:${C.slots.map((R) => `${R.slotDefinitionId}:${R.performerId || ""}`).join(",")}`).join("|");
  fe(() => {
    u(g());
  }, [v]);
  async function I(C = m) {
    if (w.current) return;
    w.current = !0, f(!0), y(`Saving performer slots for ${t.length} segments…`);
    const R = [];
    try {
      for (const E of t) {
        const P = E.slots.map((L, Y) => {
          const N = C[s[Y].slotDefinitionId];
          return {
            slotDefinitionId: L.slotDefinitionId,
            performerId: N === c ? L.performerId || null : N ? Number(N) : null
          };
        }), z = await ee(E.itemId != null ? `/videos/${e}/drafts/${E.itemId}/slots` : `/videos/${e}/segments/${E.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: E.revision, assignments: P })
        });
        R.push({
          segmentId: E.segmentId,
          itemId: E.itemId,
          revision: z.revision,
          slots: z.slots || []
        });
      }
      y("Performer slots saved."), o({
        beforeState: tr(t),
        afterState: tr(R)
      });
    } catch (E) {
      const P = await i();
      E.status === 409 ? y(P ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : y(E.message || (P ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      w.current = !1, f(!1);
    }
  }
  function V(C, R) {
    y(`Option ${R + 1} applied; save to confirm.`), u({ ...m, ...C.assignments });
  }
  async function D(C) {
    const R = { ...m, ...C.assignments };
    u(R), await I(R);
  }
  return fe(() => {
    if (a)
      return a.current = (C) => w.current || !d[C] ? !1 : (D(d[C]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, d.map((C, R) => n("button", {
        key: R,
        type: "button",
        disabled: p,
        onClick: () => V(C, R),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${R + 1} to all selected segments: ${C.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, R + 1),
        n("span", { key: "description" }, C.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${d.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, s.map((C) => n("label", {
      key: C.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, et(C)),
      n("select", {
        key: "select",
        value: m[C.slotDefinitionId] || "",
        disabled: p,
        onChange: (R) => u({ ...m, [C.slotDefinitionId]: R.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        m[C.slotDefinitionId] === c ? n("option", { key: "mixed", value: c }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Ra(l, l, C.genderHints).map((R) => n("option", {
          key: Ve(R),
          value: Ve(R)
        }, R.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: p,
        onClick: () => I(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, b)
    ])
  ]);
}
function gt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function Xl(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return gt(t);
  const o = [...new Set(r.map((i) => gt(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function sr() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function Yn({ name: e }) {
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
function ed({ hidden: e }) {
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
    n(sr, { key: "derived" })
  ]);
}
function td({ segment: e, provenance: t }) {
  var g;
  const [r, o] = F(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = Xl(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
  return n("section", { "aria-label": "Segment provenance", className: "rounded-md border border-border bg-surface" }, [
    n("button", {
      key: "toggle",
      type: "button",
      onClick: () => o((m) => !m),
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
      ) : s.map((m) => {
        const u = m.modelIdentifier || m.modelKey, p = m.value == null ? null : typeof m.value == "string" ? m.value : JSON.stringify(m.value);
        return n("div", { key: m.id || `${m.fieldKey}:${m.sourceKey}:${m.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            gt(m.sourceKey, m.sourceDisplayName)
          ),
          m.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${m.fieldKey}${p == null ? "" : ` · ${p}`}`
          ) : null,
          m.relation === "inherited" ? n("div", { key: "relation", className: "text-secondary" }, "Inherited origin") : null,
          u ? n(
            "div",
            { key: "model", className: "text-secondary" },
            `Model ${u}${m.modelVersion ? ` · ${m.modelVersion}` : ""}`
          ) : null,
          m.activityExternalRunId || m.sourceRunId ? n("div", { key: "run", className: "break-all text-secondary" }, `Run ${m.activityExternalRunId || m.sourceRunId}`) : null,
          m.confidence != null ? n(
            "div",
            { key: "confidence", className: "text-secondary" },
            `Confidence ${Math.round(m.confidence * 100)}%`
          ) : null,
          m.recordedAt || m.createdAt ? n("div", { key: "recorded", className: "text-secondary" }, `Recorded ${m.recordedAt || m.createdAt}`) : null
        ]);
      })
    ) : null
  ]);
}
function nd({
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
  const [m, u] = F([]), p = e.flatMap((w) => w.lanes.map((v) => v.key)), f = p.join("|");
  fe(() => {
    const w = new Set(p);
    u((v) => v.filter((I) => w.has(I)));
  }, [f]);
  const b = nr(t), y = !!za(
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
        `${p.length} swimlane${p.length === 1 ? "" : "s"} · ${e.length} group${e.length === 1 ? "" : "s"}`
      ),
      a ? n(Tt, { key: "counts", counts: b }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      bl({ mergeable: y, reviewable: a, tagEditable: s, slotsEditable: l })
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
      ...w.lanes.map((v) => {
        const I = m.includes(v.key), V = v.markers.some(({ segment: B }) => B.id === r), D = `selected-segment-lane-${v.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: v.key,
          "data-selected-segment-lane": v.key,
          className: `rounded-md border ${V ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": I,
            "aria-controls": D,
            "aria-current": V ? "true" : void 0,
            onClick: () => u((B) => I ? B.filter((C) => C !== v.key) : [...B, v.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, I ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Tn(v)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(v.selectedCount)),
            a ? n(Tt, { key: "states", counts: v.counts }) : null
          ]),
          I ? n("div", {
            key: "segments",
            id: D,
            className: "space-y-1 border-t border-border p-1.5"
          }, v.markers.map(({ segment: B }) => {
            const C = B.endSec == null ? $e(B.startSec) : `${$e(B.startSec)} – ${$e(B.endSec)}`;
            return n("button", {
              key: B.id,
              type: "button",
              onClick: () => i(B),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${B.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${B.tagName || "Segment"}, ${B.reviewState}, ${C}` : `${B.tagName || "Segment"}, ${C}`,
              "aria-current": B.id === r ? "true" : void 0
            }, [
              a ? n(jt, {
                key: "state",
                state: B.reviewState,
                includeLabel: !1
              }) : null,
              B.isDerived ? n(sr, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, C),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                gt(B.sourceKey)
              )
            ]);
          })) : null
        ]);
      })
    ]))
  ]);
}
const kn = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"]
}, Ho = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], qo = [
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
function En(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function Wa(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function Wo(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function Qn(e, t, r, o = null) {
  const i = Wo(t), a = Wo(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function rd(e, t, r = null) {
  var m, u, p;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (m = t.hasSegmentsCriterion) == null ? void 0 : m.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), Qn(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), Qn(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), Qn(o, t.performersCriterion, "performer"), Qn(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = Vo(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = Vo(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((u = t.reviewStateCriterion) == null ? void 0 : u.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const g = (p = t.shotBoundariesCriterion) == null ? void 0 : p.value;
  return r && typeof g == "boolean" ? o.set("hasShotBoundaries", String(g)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function Vo(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function od(e, t, r, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((g) => a.add(g));
  } else a.has(r) ? a.delete(r) : a.add(r);
  return a;
}
function Va({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(Lo, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, Xe.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = mt[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(Lo, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function Ja({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
function ad({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      onClick: (l) => En(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      n(Ja, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, ji(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(Va, { item: e, showReviewStates: r }))
    ])
  ]);
}
function id({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n(Ja, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
    n(i ? "div" : "a", {
      key: "link",
      href: i ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: i ? void 0 : (l) => En(l, t, s),
      className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
      n("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
        n("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
        n(Va, { key: "segments", item: e, showReviewStates: r })
      ]),
      n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function Vr({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = js(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => En(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && Zt(
        o,
        kt.recyclingBinView
      ) ? n(Ya, { key: "bin", onNavigate: t }) : null,
      n(Qa, { key: "settings", onNavigate: t })
    ])
  ]);
}
const Fr = "segment-studio:recycling-bin-changed";
function sd(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function In() {
  window.dispatchEvent(new CustomEvent(Fr));
}
function Ya({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = F(null);
  fe(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const g = await ee("/bin"), m = Number(g == null ? void 0 : g.totalCount);
        !a && c === s && o(Number.isFinite(m) && m >= 0 ? Math.trunc(m) : null);
      } catch {
        !a && c === s && o(null);
      }
    }, d = () => {
      l();
    };
    return l(), window.addEventListener(Fr, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(Fr, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = sd(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => En(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function Qa({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => En(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function ld({ mode: e, onModeChange: t, disabled: r = !1 }) {
  function o(i) {
    const a = Dr(i.target.value);
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
function dd({ minimum: e, maximum: t, onChange: r }) {
  const o = pe(null), [i, a] = F("maximum"), s = (u, p) => {
    const f = ls(e, t, u, p);
    a(f.coincidentTop), r({ minimum: f.minimum, maximum: f.maximum });
  }, l = (u, p) => {
    var b;
    const f = (b = o.current) == null ? void 0 : b.getBoundingClientRect();
    f && s(u, ss(p.clientX, f.left, f.width));
  }, d = (u, p) => {
    var f, b;
    p.preventDefault(), (b = (f = p.currentTarget).setPointerCapture) == null || b.call(f, p.pointerId), l(u, p);
  }, c = (u, p) => {
    var f, b;
    (b = (f = p.currentTarget).hasPointerCapture) != null && b.call(f, p.pointerId) && l(u, p);
  }, g = (u, p) => {
    const f = u === "minimum" ? e : t, b = u === "minimum" ? 0 : e, y = u === "minimum" ? t : 1, w = p.shiftKey ? 0.1 : 0.01;
    let v = null;
    ["ArrowLeft", "ArrowDown"].includes(p.key) && (v = f - w), ["ArrowRight", "ArrowUp"].includes(p.key) && (v = f + w), p.key === "PageDown" && (v = f - 0.1), p.key === "PageUp" && (v = f + 0.1), p.key === "Home" && (v = b), p.key === "End" && (v = y), v != null && (p.preventDefault(), s(u, Math.min(y, Math.max(b, v))));
  }, m = (u, p) => n("span", {
    key: u,
    role: "slider",
    tabIndex: 0,
    "aria-label": u === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((u === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((u === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(p * 100),
    "aria-valuetext": `${Math.round(p * 100)} percent`,
    onPointerDown: (f) => d(u, f),
    onPointerMove: (f) => c(u, f),
    onKeyDown: (f) => g(u, f),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${p * 100}%`,
      touchAction: "none",
      zIndex: e === t && i === u ? 2 : 1
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
        m("minimum", e),
        m("maximum", t)
      ])
    )
  ]);
}
function cd({ saving: e, error: t, onSelect: r, onClose: o }) {
  const i = pe(null);
  fe(() => {
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
    onKeyDownCapture: (s) => ot(s, { onCancel: a })
  }, n("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: yt,
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
    n(Cn, {
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
function ud({
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
  const m = dt(e), u = [...new Map((a || []).map((y) => [
    Number(y.tagId),
    y.tagName || `Tag ${y.tagId}`
  ])).entries()].sort((y, w) => y[1].localeCompare(w[1]) || y[0] - w[0]), p = (y) => d(dt({ ...m, ...y })), f = (y) => p({
    reviewStates: m.reviewStates.includes(y) ? m.reviewStates.filter((w) => w !== y) : [...m.reviewStates, y]
  }), b = (y) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${y ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (y) => {
      y.target === y.currentTarget && g();
    },
    onKeyDownCapture: (y) => ot(y, { onCancel: g })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: yt,
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
        n("div", { className: "flex flex-wrap gap-2" }, Xe.map((y) => {
          const w = m.reviewStates.includes(y), v = mt[y];
          return n("button", {
            key: y,
            type: "button",
            onClick: () => f(y),
            "aria-pressed": w,
            className: b(w)
          }, `${v.symbol} ${y} (${i[y] || 0})`);
        }))
      ]) : null,
      l ? n("fieldset", { key: "performer", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Performer"),
        n("p", { className: "text-xs text-secondary" }, "Any assigned slot may match the selected performer."),
        n("div", { className: "flex flex-wrap gap-2" }, [
          n("button", {
            key: "any",
            type: "button",
            onClick: () => p({ performerId: null }),
            "aria-pressed": m.performerId == null,
            className: b(m.performerId == null)
          }, "All performers"),
          ...r.map((y) => {
            const w = Number(Ve(y));
            return n("button", {
              key: w,
              type: "button",
              onClick: () => p({ performerId: w }),
              "aria-pressed": m.performerId === w,
              className: b(m.performerId === w)
            }, y.name);
          })
        ])
      ]) : null,
      n("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        n("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Tag"),
          n("select", {
            key: "select",
            value: m.tagId ?? "",
            onChange: (y) => p({
              tagId: y.target.value === "" ? null : Number(y.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...u.map(([y, w]) => n("option", { key: y, value: y }, w))
          ])
        ]),
        n("label", {
          key: "segment-group",
          className: "space-y-1 text-xs text-secondary"
        }, [
          n("span", { key: "label" }, "Segment group"),
          n("select", {
            key: "select",
            value: m.segmentGroupId ?? "",
            onChange: (y) => p({
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
            onClick: () => p({ sourceKey: null }),
            "aria-pressed": m.sourceKey == null,
            className: b(m.sourceKey == null)
          }, "All provenance"),
          ...o.map((y) => n("button", {
            key: y,
            type: "button",
            onClick: () => p({ sourceKey: y }),
            "aria-pressed": m.sourceKey === y,
            title: y,
            className: b(m.sourceKey === y)
          }, gt(y)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(dd, {
          minimum: m.confidenceMin,
          maximum: m.confidenceMax,
          onChange: ({ minimum: y, maximum: w }) => p({
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
            checked: m.includeUnscored,
            onChange: (y) => p({
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
        n(ed, { key: "icon", hidden: t }),
        n("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    n("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(dt({})), l && c(!1);
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
function md({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Mn.filter((l) => Qt(l, e)), i = Io(o, 1)[0], a = Io(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((g) => n("div", { key: g.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, g.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[g.id] ? t[g.id].length > 0 ? t[g.id] : ["Unassigned"] : g.bindings.map(wa)).map((m, u) => n("kbd", { key: `${g.id}:${u}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, m))
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
    onKeyDownCapture: (l) => ot(l, { onCancel: r })
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
function gd({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = Ll(e), [l, d] = F([]), c = s.map((g) => g.tagName).join("|");
  return fe(() => {
    const g = new Set(s.map((m) => m.tagName));
    d((m) => m.filter((u) => g.has(u)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (g) => ot(g, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: yt,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", { key: "title", id: "segment-studio-examples-title", className: "text-lg font-semibold text-foreground" }, "AI Feedback"),
      n("p", { key: "description", className: "mt-1 text-sm text-secondary" }, `${e.length} registered-AI example${e.length === 1 ? "" : "s"} in this video. Expand a tag to inspect or restore examples before export.`)
    ]),
    n("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      n("div", { key: "items", className: "space-y-3" }, e.length ? s.map((g, m) => {
        const u = l.includes(g.tagName), p = `incorrect-example-tag-${m}`;
        return n("section", {
          key: g.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": u,
            "aria-controls": p,
            onClick: () => d((f) => u ? f.filter((b) => b !== g.tagName) : [...f, g.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: or(!1) }
          }, [
            n(
              "span",
              { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" },
              u ? "▾" : "▸"
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
          u ? n("div", {
            key: "examples",
            id: p,
            className: "divide-y divide-border border-t border-border"
          }, g.examples.map((f) => {
            const b = `${$e(f.startSec)}${f.endSec == null ? "" : ` – ${$e(f.endSec)}`}`, y = r === f.id;
            return n("div", {
              key: f.id,
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
                onClick: () => i(f),
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
function pd({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = F(""), [a, s] = F(0), l = pe(null), d = Ge(() => Ys(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = Zs(d);
  fe(() => {
    var u;
    (u = l.current) == null || u.scrollIntoView({ block: "nearest" });
  }, [c, o]);
  const m = () => {
    const u = d[c];
    u && t(u.segment || u);
  };
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-start justify-center bg-black/70 p-4 pt-[10vh]",
    onMouseDown: (u) => {
      u.target === u.currentTarget && r();
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-quick-search-title",
    tabIndex: -1,
    className: "flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    onKeyDownCapture: (u) => {
      var p;
      if (u.key === "Tab")
        yt(u);
      else if (u.key === "Escape")
        u.preventDefault(), u.stopPropagation(), r();
      else if (u.key === "ArrowDown" || u.key === "ArrowUp") {
        u.preventDefault(), u.stopPropagation();
        const f = u.key === "ArrowDown" ? 1 : -1;
        s((b) => d.length ? (b + f + d.length) % d.length : 0);
      } else u.key === "Enter" && !((p = u.nativeEvent) != null && p.isComposing) && (u.preventDefault(), u.stopPropagation(), m());
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
        onChange: (u) => {
          i(u.target.value), s(0);
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
    }, d.length ? d.flatMap((u, p) => {
      var D;
      const f = u.segment || u, b = f.endSec == null ? $e(f.startSec) : `${$e(f.startSec)} – ${$e(f.endSec)}`, y = `${gt(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`, w = p === c, v = p > 0 ? d[p - 1].groupKey : null, I = g && u.groupKey !== v ? n("div", {
        key: `group:${u.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, u.groupName) : null, V = n("button", {
        key: f.id,
        id: `segment-quick-search-${f.id}`,
        ref: w ? l : null,
        type: "button",
        role: "option",
        "aria-selected": w,
        onMouseEnter: () => s(p),
        onClick: () => t(f),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${w ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        g ? n("span", { key: "group", className: "sr-only" }, `${u.groupName} group`) : null,
        n(jt, { key: "review", state: f.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          f.tagName || "Tag segment"
        ),
        (D = u.performers) != null && D.length ? n(ir, {
          key: "performers",
          performers: u.performers,
          performerAssignments: u.performerAssignments
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
      return I ? [I, V] : [V];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function fd(e) {
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
function yd({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = Ge(() => fd(e), [e]), [l, d] = F([]), c = s.reduce((u, p) => u + p.drafts.length, 0), g = (u) => d((p) => p.includes(u) ? p.filter((f) => f !== u) : [...p, u]), m = (u) => `segment-studio-publish-approved-${u.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !t && a();
    },
    onKeyDownCapture: (u) => ot(u, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: yt,
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
      ].flatMap(([u, p]) => [
        n("dt", { key: `${u}:label`, className: "text-secondary" }, u),
        n("dd", { key: `${u}:value`, className: "font-semibold text-foreground" }, String(p))
      ])),
      s.length ? n("div", { key: "groups", className: "space-y-2" }, s.map((u) => {
        const p = l.includes(u.key);
        return n("section", { key: u.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": p,
            "aria-controls": m(u),
            onClick: () => g(u.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: or(!1) }
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, p ? "▾" : "▸"),
            n("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, u.tagName),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${u.drafts.length} draft${u.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          p ? n("div", {
            key: "drafts",
            id: m(u),
            className: "divide-y divide-border border-t border-border"
          }, u.drafts.map((f) => {
            const b = f.endSec == null ? $e(f.startSec) : `${$e(f.startSec)} – ${$e(f.endSec)}`, y = `${gt(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`;
            return n("div", { key: f.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(jt, { key: "review", state: f.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, b),
              n("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: y
              }, y)
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
        autoFocus: !0,
        disabled: t,
        onClick: a,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Cancel"),
      n("button", {
        key: "confirm",
        type: "button",
        disabled: t || c === 0,
        onClick: i,
        className: "rounded-md border border-emerald-500/60 bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-emerald-500/30 disabled:opacity-50"
      }, t ? "Publishing…" : `Publish ${c} approved draft${c === 1 ? "" : "s"}`)
    ])
  ]));
}
function bd({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = Js(e), [s, l] = F(() => /* @__PURE__ */ new Set()), [d, c] = F(() => new Set(a.map((b) => b.key))), g = a.flatMap((b) => d.has(b.key) ? b.candidates : []), m = (b) => l((y) => {
    const w = new Set(y);
    return w.has(b) ? w.delete(b) : w.add(b), w;
  }), u = (b) => c((y) => {
    const w = new Set(y);
    return w.has(b) ? w.delete(b) : w.add(b), w;
  }), p = (b) => b.assignment.map(({ slot: y, performer: w }) => `${y.label || `Slot ${y.sortOrder + 1}`}: ${w.name}`).join(", "), f = (b) => `segment-studio-auto-assign-${b.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && !t && i();
    },
    onKeyDownCapture: (b) => {
      b.key === "Enter" && b.target instanceof HTMLInputElement || ot(b, {
        onCancel: t ? void 0 : i,
        onConfirm: g.length && !t ? () => o(g) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: yt,
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
          style: { background: or(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(b.key),
            disabled: t,
            onChange: () => u(b.key),
            "aria-label": `Include ${b.tagName} assignment: ${p(b)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(b.key),
            "aria-controls": f(b),
            "aria-label": `${s.has(b.key) ? "Collapse" : "Expand"} ${b.tagName} assignment: ${p(b)}`,
            onClick: () => m(b.key),
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
              const v = y.label || `Slot ${y.sortOrder + 1}`;
              return n("span", {
                key: y.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${v}: ${w.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${v}: ${w.name}`
                }, `${v}: ${w.name}`),
                n(An, {
                  key: "avatar",
                  performer: { id: w.performerId, name: w.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(Tt, { key: "states", counts: b.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(b.candidates),
            "aria-label": `Auto-Assign ${b.tagName}: ${p(b)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${b.candidates.length})`)
        ]),
        s.has(b.key) ? n(
          "div",
          { key: "segments", id: f(b), className: "divide-y divide-border/70" },
          b.candidates.map((y) => {
            const w = y.endSec == null ? $e(y.startSec) : `${$e(y.startSec)} – ${$e(y.endSec)}`, v = `${gt(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`;
            return n("div", {
              key: y.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(jt, { key: "review", state: y.reviewState, includeLabel: !1 }),
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
                title: v
              }, v)
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
function hd({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => ot(d, { onCancel: r, onConfirm: t })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: yt,
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
      n("button", { key: "cancel", type: "button", autoFocus: !0, onClick: r, className: "rounded-md border border-border px-3 py-1.5 text-sm" }, "Cancel"),
      n("button", { key: "confirm", type: "button", onClick: t, className: "rounded-md border border-destructive/60 bg-destructive/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-destructive/25" }, "Delete permanently")
    ])
  ]));
}
function vd({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = F(!1);
  if (!e) return null;
  const d = e.endSec == null ? "open end" : $e(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (c) => {
      c.target === c.currentTarget && !t && a();
    },
    onKeyDownCapture: (c) => ot(c, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: yt,
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
        `${$e(e.startSec)} – ${d}`
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
          onChange: (c) => l(c.target.checked),
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
        autoFocus: !0,
        disabled: t,
        onClick: a,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Cancel"),
      n("button", {
        key: "confirm",
        type: "button",
        disabled: t,
        onClick: () => i(s),
        className: "rounded-md border border-destructive/60 bg-destructive/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-destructive/25 disabled:opacity-50"
      }, t ? "Merging…" : "Merge segments")
    ])
  ]));
}
function xd(e) {
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
function Sd({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var g, m;
  const l = e ? e.createCount + e.linkCount : 0, d = ((g = e == null ? void 0 : e.outputs) == null ? void 0 : g.slice(0, 200)) || [], c = xd(d);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !r && s();
    },
    onKeyDownCapture: (u) => ot(u, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: yt,
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
        ].flatMap(([u, p]) => [
          n("dt", { key: `${u}:label`, className: "text-secondary" }, u),
          n("dd", { key: `${u}:value`, className: "font-semibold text-foreground" }, String(p))
        ])),
        e.conflictCount > 0 ? n(
          "p",
          { key: "conflicts", role: "status", className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground" },
          `${e.conflictCount} existing derivation ${e.conflictCount === 1 ? "branch was" : "branches were"} skipped because its lineage no longer matches the active rule. Resolve these through lineage maintenance.`
        ) : null,
        c.length ? n("div", { key: "outputs", className: "space-y-2" }, [
          ...c.map((u) => n("article", {
            key: u.key,
            className: "rounded-md border border-border bg-surface p-3"
          }, [
            n("div", { key: "root", className: "flex min-w-0 items-center gap-2" }, [
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
                `${u.rootTagName} @ ${$e(u.rootStartSec)}`
              ),
              n(
                "span",
                { key: "count", className: "shrink-0 text-xs font-medium text-secondary" },
                `${u.outputs.length} ${u.outputs.length === 1 ? "change" : "changes"}`
              )
            ]),
            n(
              "div",
              { key: "tree", className: "mt-2 space-y-1 border-l border-border pl-2" },
              u.outputs.map((p, f) => n("div", {
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
          (((m = e.outputs) == null ? void 0 : m.length) || 0) > d.length ? n(
            "p",
            { key: "more", className: "text-xs text-secondary" },
            `${e.outputs.length - d.length} additional output${e.outputs.length - d.length === 1 ? "" : "s"} omitted from this preview list.`
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
      n("button", { key: "cancel", ref: i, type: "button", autoFocus: !0, disabled: r, onClick: s, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Cancel"),
      n("button", {
        key: "confirm",
        type: "button",
        disabled: t || r || l === 0,
        onClick: a,
        className: "rounded-md border border-indigo-400/60 bg-indigo-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-indigo-500/30 disabled:opacity-50"
      }, r ? "Materializing…" : `Materialize ${l} change${l === 1 ? "" : "s"}`)
    ])
  ]));
}
function kd({
  compatibilityMode: e,
  selectedSegment: t,
  selectedSegments: r = [],
  selectedGroups: o = [],
  saveMessage: i,
  savingSegmentId: a,
  saveTag: s,
  saveTiming: l,
  slotStatus: d,
  performerSlotsAvailable: c,
  selectedPerformerSlots: g,
  performerSlots: m,
  detail: u,
  video: p,
  slotButtonRef: f,
  tagSearchRef: b,
  onDetailChange: y,
  setSaveMessage: w,
  setSavingSegmentId: v,
  onSlotsChanged: I,
  onRecordHistory: V,
  onCancelQueuedReview: D,
  splitSegment: B,
  duplicateSegment: C,
  provenance: R,
  lineage: E,
  onNavigateLineageItem: P,
  tagEditing: z,
  onCancelTagEditing: L,
  detailPanelRef: Y,
  onReduceSelection: N
}) {
  var de, ne, be, Se;
  const $ = pe(null), j = pe(null), Q = pe(null), ie = pe(null), ue = pe(null), [ge, G] = F(!1);
  fe(() => {
    $.current && ($.current.scrollTop = 0), G(!1);
  }, [t == null ? void 0 : t.id]), fe(() => {
    var A, J;
    ge && ((J = (A = j.current) == null ? void 0 : A.querySelector("input, select, button")) == null || J.focus({ preventScroll: !0 }));
  }, [ge]);
  function X() {
    G(!1), requestAnimationFrame(() => {
      var A;
      return (A = f.current) == null ? void 0 : A.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const A = !r.some((ae) => ae.isDerived), J = e && c ? yl(m, r) : null, _ = (J == null ? void 0 : J.map((ae, h) => {
      var T;
      const U = r[h];
      return {
        segmentId: U.nativeSegmentId,
        itemId: U.published ? null : U.itemId,
        revision: (T = u.performerSlotRevisions) == null ? void 0 : T[U.id],
        slots: ae
      };
    })) || [];
    return n(jr.Fragment, null, [
      n(nd, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: Y,
        onReduceSelection: N,
        reviewable: e,
        tagEditable: A,
        slotsEditable: _.length > 0 && a == null,
        onEditSlots: () => G(!0),
        slotButtonRef: f,
        saveMessage: i
      }),
      z && A ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ae) => {
          ae.target === ae.currentTarget && L();
        },
        onKeyDownCapture: (ae) => ot(ae, { onCancel: L })
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
        n(Cn, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (ae, h) => ae == null ? L() : s(ae, h == null ? void 0 : h.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: L,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      ge && _.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ae) => {
          ae.target === ae.currentTarget && X();
        },
        onKeyDownCapture: (ae) => {
          var U, T;
          if (!(typeof ((U = ae.target) == null ? void 0 : U.closest) == "function" ? ae.target.closest("input, textarea, select, [contenteditable='true']") : null) && !ae.repeat && !ae.ctrlKey && !ae.altKey && !ae.metaKey && !ae.shiftKey && /^[1-9]$/.test(ae.key) && ((T = ue.current) != null && T.call(ue, Number(ae.key) - 1))) {
            ae.preventDefault(), ae.stopPropagation();
            return;
          }
          ot(ae, { onCancel: X });
        }
      }, n("section", {
        ref: j,
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
          n("button", { key: "close", type: "button", onClick: X, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Zl, {
          videoId: p.id,
          targets: _,
          performerCandidates: u.performerCandidates || [],
          shortcutRef: ue,
          onSaved: async ({ beforeState: ae, afterState: h }) => {
            await V(
              "performer-slots.assign",
              `Assigned performers to ${_.length} segments`,
              ae,
              h
            ), X(), I();
          },
          onConflict: I
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (A) => {
      $.current = A, Y && (Y.current = A);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(jt, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(sr, { key: "derived" }) : null,
        t && z ? n("div", {
          key: "tag-editor",
          ref: b,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (A) => {
            A.key === "Escape" && (A.preventDefault(), A.stopPropagation(), L());
          },
          onKeyDown: (A) => {
            gl(A, t.tagName) && (A.preventDefault(), A.stopPropagation(), s(t.tagId));
          }
        }, n(Cn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (A, J) => A == null ? L() : s(A, J == null ? void 0 : J.label),
          disabled: a != null || ((de = E.data) == null ? void 0 : de.tagReadOnly) === !0,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? n("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : n("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? n("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        n("span", { key: "start" }, $e(t.startSec)),
        t.endSec == null ? null : n("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : n("span", { key: "end" }, $e(t.endSec))
      ]) : null,
      e && t && (d === "empty" || d === "partial") ? n("div", { key: "slots-row" }, n(Yl, { status: d })) : null,
      t && c && g.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(_a, {
        assignments: g.map((A) => {
          const J = xl(A);
          return {
            key: String(A.slotDefinitionId),
            label: J.label,
            performer: J.filled ? { id: Number(A.performerId), name: J.performer } : null,
            title: J.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(td, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: R
    }) : null,
    t ? n("div", { key: "controls", hidden: !0 }, [
      n("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        n("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        E.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : E.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, E.error) : E.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${E.data.derived ? "Derived segment" : "Root segment"} · ${E.data.componentSize} segment${E.data.componentSize === 1 ? "" : "s"} · ${E.data.integrityState}`
          ),
          (ne = E.data.parents) != null && ne.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...E.data.parents.map((A) => n("button", {
              key: A.nodeId,
              type: "button",
              onClick: () => P(A.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${A.ruleKey} ${A.ruleVersion}`))
          ]) : null,
          (be = E.data.children) != null && be.length ? n("p", { key: "children" }, `Children: ${E.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: l, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: f,
          type: "button",
          disabled: a != null || !c || g.length === 0,
          onClick: () => G(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: c ? g.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, g.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: B,
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
    ge && e && t && c && g.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (A) => {
        A.target === A.currentTarget && X();
      },
      onKeyDownCapture: (A) => {
        var _, ae;
        if (!(typeof ((_ = A.target) == null ? void 0 : _.closest) == "function" ? A.target.closest("input, textarea, select, [contenteditable='true']") : null) && !A.repeat && !A.ctrlKey && !A.altKey && !A.metaKey && !A.shiftKey && /^[1-9]$/.test(A.key) && ((ae = ie.current) != null && ae.call(ie, Number(A.key) - 1))) {
          A.preventDefault(), A.stopPropagation();
          return;
        }
        ot(A, {
          onCancel: X,
          onConfirm: () => {
            var h;
            return (h = Q.current) == null ? void 0 : h.click();
          }
        });
      }
    }, n("section", {
      ref: j,
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
        n("button", { key: "close", type: "button", onClick: X, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Ql, {
        key: `${t.id}:${u.performerSlotsRevision || u.slotRevision || ""}`,
        videoId: p.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: g,
        revision: (Se = u.performerSlotRevisions) == null ? void 0 : Se[t.id],
        performerCandidates: u.performerCandidates || [],
        confirmRef: Q,
        shortcutRef: ie,
        onOptimisticSave: (A) => {
          y((J) => $r(
            J,
            t.id,
            A
          ), p.id), v(t.id), w("Saving performer slots…"), X();
        },
        onSaved: async (A, { beforeState: J, afterState: _ }) => {
          y((ae) => $r(
            ae,
            t.id,
            A.slots || [],
            A.revision
          ), p.id), w("Performer slots saved.");
          try {
            await V(
              "performer-slots.assign",
              "Assigned performers",
              J,
              _
            ), await I(A) || D([t]);
          } finally {
            v(null);
          }
        },
        onRollback: async (A, J) => {
          D([t]), y((_) => {
            var ae;
            return $r(
              _,
              t.id,
              A,
              (ae = u.performerSlotRevisions) == null ? void 0 : ae[t.id]
            );
          }, p.id), w(J.message || "Unable to save performer slots.");
          try {
            J.status === 409 && await I();
          } finally {
            v(null);
          }
        },
        onConflict: I
      }))
    ])) : null
  ]);
}
function wd({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: m, onSelectGroup: u, onToggleGroup: p, onSelect: f, onSelectSegments: b, onSelectAll: y, onConfigureTag: w, onSeekTime: v, centerRef: I, showReviewState: V = !0, swimlaneTitleWidth: D, onSwimlaneTitleWidthChange: B }) {
  const C = pe(null), R = pe(null), [E, P] = F(0), [z, L] = F({ scrollTop: 0, height: 320 }), [Y, N] = F(null), $ = Ge(
    () => Lt(e, r, o),
    [e, r, o]
  ), j = Ge(
    () => Ka(o),
    [o]
  ), Q = Ge(() => Wr($), [$]), ie = Ge(
    () => Il(Q, i, r.length > 0),
    [Q, i, r.length]
  ), ue = Ge(
    () => Ua(ie.rows, Math.max(0, z.scrollTop - 24), z.height),
    [ie, z]
  ), ge = Math.max(0, Number(d) || 0), G = Zi(E), X = Zn(D, G), de = X / 16, ne = Yi(c, ge, de), be = Hi(ge), Se = qi(ge, Math.max(1, E - de * 16), g), A = be.filter((S, k) => k === 0 || k % Se === 0), J = Ge(() => $.map((S) => `${S.key}:${S.trackCount}:${S.markers.map(({ segment: k, track: W }) => `${k.id}:${k.startSec}:${k.endSec ?? ""}:${W}`).join(",")}`).join("|"), [$]);
  function _() {
    const S = R.current;
    if (!S) return;
    const k = S.querySelector("[data-timeline-track]"), W = S.firstElementChild, me = k == null ? void 0 : k.getBoundingClientRect(), se = W == null ? void 0 : W.getBoundingClientRect(), oe = me && se ? Math.max(0, me.left - se.left) : de * 16, ke = (se == null ? void 0 : se.width) ?? S.scrollWidth;
    S.scrollTo({
      left: Ji(c, ge, ke, S.clientWidth, oe, fa),
      behavior: "smooth"
    });
  }
  fe(() => (I.current = _, () => {
    I.current === _ && (I.current = null);
  })), fe(() => {
    _();
  }, [g]);
  function ae() {
    const S = R.current, k = ie.rows.find((ke) => ke.kind === "lane" && ke.lane.markers.some(({ segment: q }) => q.id === s));
    if (!S || !k) return;
    const W = 24, me = k.top + W, se = me + k.height;
    let oe = S.scrollTop;
    me < S.scrollTop + W ? oe = Math.max(0, me - W) : se > S.scrollTop + S.clientHeight && (oe = Math.max(0, se - S.clientHeight)), oe !== S.scrollTop && (S.scrollTop = oe), L({ scrollTop: oe, height: S.clientHeight });
  }
  fe(() => {
    ae();
  }, [s, J, ie]), fe(() => {
    const S = R.current, k = ie.rows.find((ke) => ke.kind === "group" && ke.group.key === a);
    if (!S || !k) return;
    const W = 24, me = k.top + W, se = me + k.height;
    let oe = S.scrollTop;
    me < S.scrollTop + W ? oe = Math.max(0, me - W) : se > S.scrollTop + S.clientHeight && (oe = Math.max(0, se - S.clientHeight)), oe !== S.scrollTop && (S.scrollTop = oe), L({ scrollTop: oe, height: S.clientHeight });
  }, [a, ie]), fe(() => {
    const S = R.current;
    if (!S || typeof ResizeObserver > "u") return;
    const k = () => {
      P(S.clientWidth), L({ scrollTop: S.scrollTop, height: S.clientHeight }), ae();
    }, W = new ResizeObserver(k);
    return W.observe(S), k(), () => W.disconnect();
  }, [s, J, ie]);
  function h(S) {
    if (!(ge > 0)) return;
    const k = S.currentTarget.getBoundingClientRect(), W = Math.min(1, Math.max(0, (S.clientX - k.left) / k.width));
    v(W * ge);
  }
  function U(S) {
    const k = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let W = null;
    Object.hasOwn(k, S.key) && (W = c + k[S.key]), S.key === "Home" && (W = 0), S.key === "End" && (W = ge), W != null && (S.preventDefault(), S.stopPropagation(), v(Math.min(ge, Math.max(0, W))));
  }
  function T(S) {
    var W;
    const k = (W = C.current) == null ? void 0 : W.getBoundingClientRect();
    k && B(Zn(S.clientX - k.left, G));
  }
  function x(S) {
    const k = S.shiftKey ? 40 : 16;
    let W = null;
    S.key === "ArrowLeft" && (W = X - k), S.key === "ArrowRight" && (W = X + k), S.key === "Home" && (W = 160), S.key === "End" && (W = G), W != null && (S.preventDefault(), S.stopPropagation(), B(Zn(W, G)));
  }
  const M = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: C,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (S) => {
          (S.metaKey || S.ctrlKey) && (S.preventDefault(), y == null || y());
        },
        onKeyDown: (S) => {
          S.key !== "Enter" && S.key !== " " || (S.preventDefault(), y == null || y());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: M, disabled: g <= 1, onClick: () => m(Xn(g - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: M, disabled: g === 1, onClick: () => m(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(g * 100)}%`),
      n("button", { key: "in", type: "button", className: M, disabled: g >= 8, onClick: () => m(Xn(g + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: M, onClick: _, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(G),
      "aria-valuenow": Math.round(X),
      "aria-valuetext": `${Math.round(X)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (S) => {
        S.currentTarget.setPointerCapture(S.pointerId), T(S);
      },
      onPointerMove: (S) => {
        S.currentTarget.hasPointerCapture(S.pointerId) && T(S);
      },
      onKeyDown: x,
      onDoubleClick: () => B(rt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${X - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: R,
      onScroll: (S) => L({
        scrollTop: S.currentTarget.scrollTop,
        height: S.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: Qi(g) }, [
      n("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${de}rem minmax(0,1fr)`, height: "1.5rem" } }, [
        n("div", { key: "axis-label", "data-timeline-label-gutter": "true", "aria-hidden": "true", className: "sticky left-0 z-40 border-r border-border", style: { backgroundColor: "var(--color-surface)" } }),
        n("div", {
          key: "ticks",
          role: "slider",
          tabIndex: 0,
          "data-timeline-seeker": "true",
          "data-timeline-track": "true",
          "aria-label": "Timeline seek",
          "aria-valuemin": 0,
          "aria-valuemax": ge,
          "aria-valuenow": Math.min(ge, Math.max(0, c)),
          "aria-valuetext": $e(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: h,
          onKeyDown: U
        }, A.map((S, k) => n("span", {
          key: S,
          className: `absolute top-0 ${Wi(k, A.length, ge > 0 ? S / ge * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Vi(k, A.length, ge > 0 ? S / ge * 100 : 0)
        }, $e(S))).concat(t.map((S) => {
          const k = ge > 0 ? S.startSec / ge * 100 : 0;
          return n("button", {
            key: `shot-boundary:${S.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${$e(S.startSec)} – ${$e(S.endSec)}`,
            title: `Shot boundary · ${S.source || "manual"} · ${$e(S.startSec)} – ${$e(S.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${k}%`, width: "2px" },
            onClick: (W) => {
              W.stopPropagation(), v(S.startSec);
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
            ...ko(ne),
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
        style: $.length > 0 ? { height: ie.height } : void 0
      }, [
        $.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...ko(ne, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        $.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : ue.map((S) => {
          var te;
          const k = S.group, W = i.includes(k.key), me = a === k.key, se = or(me);
          if (S.kind === "group") return n("div", {
            key: S.key,
            "data-segment-group": k.key,
            "data-segment-group-collapsed": W ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${de}rem minmax(0,1fr)`,
              backgroundColor: se,
              top: S.top,
              height: S.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (Z) => {
                if (Z.metaKey || Z.ctrlKey) {
                  b(k.lanes.flatMap((O) => O.markers.map((re) => re.segment.id)));
                  return;
                }
                u(k.key), p(k.key);
              },
              "aria-expanded": !W,
              "aria-current": me ? "true" : void 0,
              "data-selected-timeline-group": me ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: k.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: se
              },
              title: `${W ? "Expand" : "Collapse"} ${k.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, W ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, k.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              W ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${k.lanes.length} swimlane${k.lanes.length === 1 ? "" : "s"} hidden`
                ),
                V ? n(Tt, { key: "states", counts: k.counts }) : null
              ] : null
            )
          ]);
          const oe = S.lane, ke = ll(S.laneIndex), q = oe.markers.some(({ segment: Z }) => Z.id === s);
          return n("div", {
            key: S.key,
            "data-grouped-swimlane": k.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${de}rem minmax(0,1fr)`,
              top: S.top,
              height: S.height,
              backgroundColor: ke
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": q ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: dl(q, ke),
              title: `${Tn(oe)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Tn(oe),
              onClick: (Z) => {
                (Z.metaKey || Z.ctrlKey) && b(oe.markers.map((O) => O.segment.id));
              },
              onMouseEnter: () => N(oe.key),
              onMouseLeave: () => N((Z) => Z === oe.key ? null : Z)
            }, [
              oe.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (Z) => {
                  Z.stopPropagation(), w({ tagId: oe.tagId, tagName: oe.label, trigger: Z.currentTarget });
                },
                "aria-label": `Configure ${oe.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: Y === oe.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, oe.label),
              (te = oe.performers) != null && te.length ? n(ir, {
                key: "performers",
                performers: oe.performers,
                performerAssignments: oe.performerAssignments
              }) : null,
              V ? n(Tt, { key: "counts", counts: oe.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, oe.markers.map(({ segment: Z, track: O }) => {
              var Ce;
              const re = Ar(Z.startSec, ge), ye = Z.endSec == null ? Z.startSec : Math.max(Z.startSec, Z.endSec), he = Math.max(0, Ar(ye, ge) - re), ve = l.includes(Z.id), Me = Z.id === s, Ee = qr(j.get(Z.id)), Ne = Z.endSec == null ? $e(Z.startSec) : `${$e(Z.startSec)} – ${$e(Z.endSec)}`, Ie = (Ce = ja[Ee]) == null ? void 0 : Ce.label;
              return n("button", {
                key: Z.id,
                type: "button",
                onClick: (xe) => {
                  xe.stopPropagation(), f(Z, {
                    additive: xe.metaKey || xe.ctrlKey,
                    rangeSegmentIds: xe.shiftKey ? oe.markers.map((Oe) => Oe.segment.id) : null
                  });
                },
                "aria-pressed": ve,
                "aria-current": Me ? "true" : void 0,
                "data-selected-timeline-marker": Me ? "true" : void 0,
                "data-selected-segment-shortcut-target": Me ? "true" : void 0,
                "aria-label": V ? `${Z.tagName || "Tag segment"}${oe.performerLabel ? `, ${oe.performerLabel}` : ""}, ${Z.reviewState}${Ie ? `, ${Ie}` : ""}, ${Ne}` : `${Z.tagName || "Tag segment"}${oe.performerLabel ? `, ${oe.performerLabel}` : ""}, ${Ne}`,
                title: V ? `${Z.tagName || "Tag segment"}${oe.performerLabel ? ` · ${oe.performerLabel}` : ""} · ${Z.reviewState}${Ie ? ` · ${Ie}` : ""} · ${Ne}` : `${Z.tagName || "Tag segment"}${oe.performerLabel ? ` · ${oe.performerLabel}` : ""} · ${Ne}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...V ? al(Z.reviewState, ve, Ee, Me) : il(ve, Me),
                  left: `${re}%`,
                  top: `${cl(O)}rem`,
                  width: sl(Z.endSec, he),
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
function Jr({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = F(null), [l, d] = F([]), [c, g] = F(null), [m, u] = F(""), [p, f] = F(!0), [b, y] = F(null), [w, v] = F(""), [I, V] = F(!1), D = pe(null), B = pe(0);
  fe(() => {
    const Y = requestAnimationFrame(() => {
      var N;
      return (N = D.current) == null ? void 0 : N.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(Y);
  }, [e]), fe(() => {
    const Y = new AbortController();
    return f(!0), v(""), Promise.all([
      r ? ee(`/slot-definitions/${e}`, { signal: Y.signal }) : Promise.resolve(null),
      ee("/segment-groups", { signal: Y.signal })
    ]).then(([N, $]) => {
      const j = $.find((Q) => (Q.tags || []).some((ie) => Number(ie.tagId) === Number(e)));
      s(N), d($), g((j == null ? void 0 : j.id) ?? null), u(j == null ? "" : String(j.id)), V(!1);
    }).catch((N) => {
      N.name !== "AbortError" && v(N.message || "Unable to load tag configuration.");
    }).finally(() => {
      Y.signal.aborted || f(!1);
    }), () => Y.abort();
  }, [r, e]);
  function C(Y, N) {
    s({
      ...a,
      definitions: a.definitions.map(($, j) => j === Y ? { ...$, ...N } : $)
    });
  }
  function R(Y, N) {
    const $ = Y + N;
    if ($ < 0 || $ >= a.definitions.length) return;
    const j = [...a.definitions];
    [j[Y], j[$]] = [j[$], j[Y]], s({
      ...a,
      definitions: j.map((Q, ie) => ({ ...Q, sortOrder: ie }))
    });
  }
  function E(Y) {
    const N = a.definitions[Y], $ = Number(N.assignmentCount) || 0, j = $ === 0 ? "" : ` and its ${$} assignment${$ === 1 ? "" : "s"}`;
    window.confirm(`Delete “${et(N)}”${j}?`) && ($ > 0 && V(!0), s({
      ...a,
      definitions: a.definitions.filter((Q, ie) => ie !== Y).map((Q, ie) => ({ ...Q, sortOrder: ie }))
    }));
  }
  async function P() {
    var N;
    y("slots"), v("Saving performer slots…");
    let Y;
    try {
      Y = await ee(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: I,
          definitions: a.definitions.map(($, j) => {
            var Q;
            return {
              id: $.id || void 0,
              label: ((Q = $.label) == null ? void 0 : Q.trim()) || null,
              sortOrder: j,
              genderHints: $.genderHints || []
            };
          })
        })
      }), s(Y), V(!1);
    } catch ($) {
      $.status === 409 ? (v("Performer slots changed elsewhere; current values were reloaded."), (N = $.payload) != null && N.current && (s($.payload.current), V(!1))) : v($.message || "Unable to save performer slots."), y(null);
      return;
    }
    try {
      await o(), v("Performer slots saved.");
    } catch {
      v("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      y(null);
    }
  }
  async function z() {
    const Y = m === "" ? null : Number(m);
    if (Y !== c) {
      y("group"), v("Saving tag group…");
      try {
        await ee(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: Y })
        });
      } catch (N) {
        v(N.message || "Unable to assign the tag group."), y(null);
        return;
      }
      try {
        const [N, $] = await Promise.allSettled([
          ee("/segment-groups"),
          o()
        ]);
        if (N.status === "fulfilled") {
          d(N.value);
          const j = N.value.find((ie) => (ie.tags || []).some((ue) => Number(ue.tagId) === Number(e))), Q = (j == null ? void 0 : j.id) ?? null;
          g(Q), u(Q == null ? "" : String(Q));
        }
        v(
          N.status === "fulfilled" && $.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        y(null);
      }
    }
  }
  l.find((Y) => Number(Y.id) === Number(c));
  const L = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (Y) => {
      Y.target === Y.currentTarget && !b && i();
    },
    onKeyDownCapture: (Y) => ot(Y, {
      onCancel: b ? void 0 : i
    })
  }, n("section", {
    ref: D,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: yt,
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
        p ? null : n("label", { key: "choice", className: "block space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Assigned group"),
          n("select", {
            key: "select",
            value: m,
            disabled: b != null,
            onChange: (Y) => u(Y.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((Y) => n("option", { key: Y.id, value: String(Y.id) }, Y.name))
          ])
        ]),
        p ? null : n("button", {
          key: "save",
          type: "button",
          disabled: b != null || (m === "" ? null : Number(m)) === c,
          onClick: z,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, b === "group" ? "Saving…" : "Save tag group")
      ]),
      r ? n("section", { key: "slots", className: "space-y-3 border-t border-border pt-5", "aria-labelledby": "inline-tag-slots-heading" }, [
        n("div", { key: "heading" }, [
          n("h3", { key: "title", id: "inline-tag-slots-heading", className: "text-sm font-semibold text-foreground" }, "Performer slots"),
          n("p", { key: "copy", className: "text-xs text-secondary" }, "Define the ordered performer roles used by this tag.")
        ]),
        p ? n("p", { key: "loading", className: "rounded-md border border-dashed border-border p-4 text-sm text-secondary" }, "Loading performer slots…") : a ? n("div", { key: "editor", className: "space-y-3" }, [
          n("label", { key: "duplicates", className: "flex items-center gap-2 text-sm" }, [
            n("input", {
              key: "input",
              type: "checkbox",
              checked: !!a.allowSamePerformerInMultipleSlots,
              disabled: b != null,
              onChange: (Y) => s({ ...a, allowSamePerformerInMultipleSlots: Y.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((Y, N) => n("article", {
            key: Y.id || Y._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: Y.label || "",
                disabled: b != null,
                onChange: ($) => C(N, { label: $.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Ki.map(($) => n("label", { key: $, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: b != null,
                  checked: (Y.genderHints || []).includes($),
                  onChange: (j) => C(N, {
                    genderHints: j.target.checked ? [.../* @__PURE__ */ new Set([...Y.genderHints || [], $])] : (Y.genderHints || []).filter((Q) => Q !== $)
                  })
                }),
                n("span", { key: "text" }, ar($))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${Y.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: b != null || N === 0, onClick: () => R(N, -1), className: L, "aria-label": `Move ${et(Y)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: b != null || N === a.definitions.length - 1, onClick: () => R(N, 1), className: L, "aria-label": `Move ${et(Y)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: b != null, onClick: () => E(N), className: `${L} text-red-300` }, "Delete")
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
                  _clientKey: `new-${++B.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: L
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: b != null,
              onClick: P,
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
function Nd(e) {
  const { activeFilterCount: t, allSwimlanes: r, analysisError: o, analysisRun: i, analysisStatus: a, approvalFacetCounts: s, autoAssignCandidates: l, autoAssignError: d, autoAssignOpen: c, autoAssignPerformers: g, autoAssigning: m, cancelQueuedReviewsForSegments: u, captureTrainingExport: p, centerTimelineRef: f, closeEditorFilters: b, closeFirstSegmentTagDialog: y, closeMaterializeDialog: w, closeMergeConfirmation: v, closePublishApprovedDialog: I, closeTagEditing: V, collapsedSegmentGroups: D, compatibilityMode: B, configuringTag: C, createSegment: R, currentTime: E, deleteRejectedSegments: P, detail: z, detailPanelRef: L, detailWidth: Y, duplicateSegment: N, editorFilters: $, editorLayout: j, editorRef: Q, exportingExamples: ie, filtersButtonRef: ue, filtersOpen: ge, firstSegmentTagOpen: G, focusRowRef: X, handleSeparatorKeyDown: de, handleSeparatorPointerDown: ne, handleSeparatorPointerMove: be, hideDerivedSegments: Se, history: A, historyOpen: J, historySaving: _, horizontalLayoutSize: ae, importNativeSegments: h, incorrectExamples: U, incorrectExamplesOpen: T, lineage: x, markerRailWidth: M, materializeButtonRef: S, materializeCancelButtonRef: k, materializeDerivedSegments: W, materializeError: me, materializeLoading: se, materializeOpen: oe, materializePreview: ke, materializing: q, mediaStackRef: te, mergeCancelButtonRef: Z, mergeConfirmation: O, mergeSavingRef: re, mergeSelectedSwimlane: ye, nativeImportState: he, onDetailChange: ve, onNavigate: Me, onReload: Ee, onSlotsChanged: Ne, openPublishApprovedDialog: Ie, panelSeparatorProps: Ce, pendingInitialSeekRef: xe, performerSlots: Oe, performerSlotsAvailable: De, playbackControlsRef: at, previewDerivedSegments: we, provenance: Pe, provenanceSources: qe, publishApprovedCancelButtonRef: je, publishApprovedDrafts: Te, publishApprovedError: Ae, publishApprovedOpen: Ke, quickSearchOpen: it, railScrollRef: Qe, railToggleRef: Ye, recordHistoryAction: wt, rejectedDeletionPreview: Nt, removeIncorrectExample: lr, removingExampleId: Dn, restoreHistoryTarget: Xt, saveMessage: On, saveTag: Rt, saveTiming: dr, savingSegmentId: pt, seekRef: bt, segmentGroups: Bt, segmentRailLayout: Mt, segments: It, selectAllVideoSegments: cr, selectSegment: ht, selectSegmentCollection: ur, selectedGroups: en, selectedPerformerSlots: tn, selectedSegment: vt, selectedSegmentGroupKey: nn, selectedSegmentIds: Gt, selectedSegments: Pn, selectedSlotStatus: rn, setAutoAssignError: Et, setAutoAssignOpen: Kt, setConfiguringTag: on, setCurrentTime: mr, setEditorFilters: Ln, setEditorLayout: gr, setFiltersOpen: an, setHideDerivedSegments: sn, setHistoryOpen: ln, setIncorrectExamplesOpen: Dt, setQuickSearchOpen: Fn, setRailViewport: jn, setRejectedDeletionPreview: dn, setSaveMessage: cn, setSavingSegmentId: un, setSelectedSegmentGroupKey: tt, setSelectedSegmentId: Bn, setShortcutsOpen: Ut, setTimelineZoom: Gn, shotBoundaries: Kn, shortcutsOpen: mn, slotButtonRef: gn, splitLayout: xt, splitSegment: pr, startFullAnalysis: Un, tagEditing: pn, tagSearchRef: fn, timelineDuration: yn, timelineRatioBounds: _e, timelineZoom: Je, toggleSegmentGroup: zn, toggleSegmentRail: fr, updateTimelineRatio: ft, video: Ue, videoPerformers: _n, visibleCounts: bn, visibleSegmentRailRows: hn, visibleSegments: zt, wideLayout: Ct, workspaceRef: yr } = e, vn = Ge(
    () => It.filter((H) => !H.published && H.reviewState === "approved"),
    [It]
  ), br = Bi(Br), xn = vn.length, ct = ke ? ke.createCount + ke.linkCount : null;
  function hr(H) {
    const Be = Gt.includes(H.id), ze = H.id === (vt == null ? void 0 : vt.id), le = H.endSec == null ? $e(H.startSec) : `${$e(H.startSec)} – ${$e(H.endSec)}`, st = `${gt(H.sourceKey)}${H.confidence != null ? ` · ${Math.round(H.confidence * 100)}%` : ""}`;
    return n("button", {
      key: H.id,
      type: "button",
      onClick: (qt) => ht(H, { additive: qt.metaKey || qt.ctrlKey }),
      "aria-pressed": Be,
      "aria-current": ze ? "true" : void 0,
      "data-selected-segment-shortcut-target": ze ? "true" : void 0,
      "aria-label": B ? `${H.tagName || "Tag segment"}, ${H.reviewState}${H.isDerived ? ", derived segment" : ""}, ${le}` : `${H.tagName || "Tag segment"}${H.isDerived ? ", derived segment" : ""}, ${le}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: Fa(Be, ze)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        B ? n(jt, { key: "review", state: H.reviewState, includeLabel: !1 }) : null,
        H.isDerived ? n(sr, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          H.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, le),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: st
        }, st)
      ])
    ]);
  }
  const _t = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", Ht = [...A.actions || []].reverse().find((H) => H.sequence <= A.cursorSequence);
  return n("section", {
    ref: Q,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${xt ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (H) => Wa(H, Me, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${Ue.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: Ue.title || `Video ${Ue.id}`
          }, Ue.title || `Video ${Ue.id}`)),
          ..._n.map((H) => n(An, {
            key: Ve(H),
            performer: { id: Ve(H), name: H.name },
            compact: !0,
            tooltip: H.name
          })),
          B ? n(Tt, { key: "review-counts", counts: bn }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          B ? null : n(Ya, { key: "bin", onNavigate: Me, compact: !0 }),
          n(Qa, { key: "settings", onNavigate: Me, compact: !0 })
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
        he.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, he.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => h("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => h("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        he.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, he.error) : null
      ]) : null,
      o && (a == null ? void 0 : a.configured) !== !1 ? n("div", {
        key: "analysis-error",
        role: "alert",
        className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300"
      }, o) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          B ? n("div", {
            key: "full-analysis",
            className: "inline-flex items-stretch"
          }, [
            n("button", {
              key: "run",
              type: "button",
              disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
              onClick: () => Un(),
              title: (a == null ? void 0 : a.error) || "Run AI tagging and shot boundary analysis into the Full review workflow",
              className: "segment-studio-full-scan-run inline-flex items-center justify-center bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
            }, (a == null ? void 0 : a.configured) === !1 ? "Full Scan not configured" : (a == null ? void 0 : a.ready) === !1 ? "Full Scan unavailable" : (i == null ? void 0 : i.status) === "queued" ? "Full Scan queued…" : (i == null ? void 0 : i.status) === "running" ? "Full Scan running…" : "Full Scan"),
            n("details", { key: "choices", className: "relative flex" }, [
              n("summary", {
                key: "summary",
                "aria-label": "Choose Full Scan analyses",
                "aria-disabled": (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                title: "Choose analyses",
                onClick: (H) => {
                  ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && H.preventDefault();
                },
                onKeyDown: (H) => {
                  (H.key === "Enter" || H.key === " ") && ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && H.preventDefault();
                },
                className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${(a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running" ? "pointer-events-none cursor-default opacity-50" : "cursor-pointer hover:opacity-90"}`
              }, n(la, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([H, Be]) => n("button", {
                key: H,
                type: "button",
                disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                onClick: (ze) => {
                  var le;
                  (le = ze.currentTarget.closest("details")) == null || le.removeAttribute("open"), Un(Be);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, H)))
            ])
          ]) : null,
          B ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: pt != null || l.length === 0,
            onClick: () => {
              Et(""), Kt(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${l.length ? ` (${l.length})` : ""}`) : null,
          B ? n("button", {
            key: "materialize-derived",
            ref: S,
            type: "button",
            disabled: pt != null || se || q || ct === 0,
            onClick: we,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, se ? "Analyzing…" : `Auto-Materialize${ct != null ? ` (${ct})` : ""}`) : null,
          B ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: pt != null || xn === 0,
            onClick: (H) => Ie(H.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": Ke,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${xn ? ` (${xn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: ie || Dn != null || U.length === 0,
            onClick: () => Dt(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": T,
            "aria-label": `Open AI feedback collection, ${U.length} example${U.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${U.length ? ` (${U.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: ue,
            type: "button",
            onClick: () => an(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": ge,
            className: `${_t} ${t ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(Yn, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${t ? ` (${t})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => Ut(!0),
            className: _t
          }, [n(Yn, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: (B ? A.actions.length === 0 : Ht == null) || pt != null || _,
            onClick: B ? () => ln((H) => !H) : () => Xt(
              Ht.sequence - 1
            ),
            "aria-haspopup": B ? "dialog" : void 0,
            "aria-expanded": B ? J : void 0,
            className: _t
          }, [
            n(Yn, { key: "icon", name: "history" }),
            n("span", { key: "label" }, B ? `History${A.actions.length ? ` (${A.actions.length})` : ""}` : Ht ? `Undo ${Ht.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: Ye,
            type: "button",
            onClick: fr,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": j.markerRailOpen,
            className: _t
          }, [
            n(Yn, { key: "icon", name: "list" }),
            n("span", { key: "label" }, j.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    B && J ? n("section", {
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
        ...[...A.actions].reverse().map((H) => n("button", {
          key: H.sequence,
          type: "button",
          disabled: _,
          onClick: () => Xt(H.sequence),
          "aria-current": A.cursorSequence === H.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${H.sequence > A.cursorSequence ? "text-secondary" : "text-foreground"} ${A.cursorSequence === H.sequence ? "bg-accent/15" : ""}`
        }, [
          n("span", { key: "label", className: "min-w-0 flex-1 truncate" }, H.label),
          n("time", {
            key: "time",
            dateTime: H.createdAt,
            className: "shrink-0 text-[10px] text-secondary"
          }, new Date(H.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        ])),
        n("button", {
          key: "baseline",
          type: "button",
          disabled: _,
          onClick: () => Xt(A.baselineSequence),
          "aria-current": A.cursorSequence === A.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${A.cursorSequence === A.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    ge ? n(ud, {
      key: "editor-filters",
      filters: $,
      hideDerivedSegments: Se,
      performers: _n,
      provenanceSources: qe,
      reviewCounts: s,
      segments: It,
      segmentGroups: Bt,
      reviewMode: B,
      onChange: Ln,
      onHideDerivedChange: sn,
      onClose: b
    }) : null,
    G ? n(cd, {
      key: "first-segment-tag-dialog",
      saving: pt != null,
      error: On,
      onSelect: (H, Be) => R(H, Be),
      onClose: y
    }) : null,
    it ? n(pd, {
      key: "quick-search-dialog",
      segments: Qs(r),
      onSelect: (H) => {
        Fn(!1), ht(H, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        Fn(!1), requestAnimationFrame(() => {
          var H;
          return (H = Q.current) == null ? void 0 : H.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    c ? n(bd, {
      key: "auto-assign-dialog",
      candidates: l,
      processing: m,
      error: d,
      onConfirm: g,
      onClose: () => Kt(!1)
    }) : null,
    O ? n(vd, {
      key: "merge-selection-dialog",
      merge: O,
      processing: re.current,
      undoable: !B,
      cancelButtonRef: Z,
      onConfirm: (H) => ye(!0, H, O),
      onClose: v
    }) : null,
    oe ? n(Sd, {
      key: "materialize-derived-dialog",
      preview: ke,
      loading: se,
      processing: q,
      error: me,
      cancelButtonRef: k,
      onConfirm: W,
      onClose: () => {
        q || w();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: yr,
      className: `${xt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      j.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: Ct ? { position: "absolute", top: 0, right: 0, width: M, height: ae.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        It.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : zt.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: Qe,
          onScroll: (H) => jn({
            scrollTop: H.currentTarget.scrollTop,
            height: H.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: Mt.height }
        }, hn.map((H) => {
          var ze;
          let Be;
          if (H.kind === "group") {
            const le = D.includes(H.group.key), st = H.group.lanes.reduce((qt, Hn) => qt + Hn.markers.length, 0);
            Be = n("button", {
              type: "button",
              onClick: () => {
                tt(H.group.key), zn(H.group.key);
              },
              "aria-expanded": !le,
              "aria-current": nn === H.group.key ? "true" : void 0,
              "data-segment-rail-group": H.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${nn === H.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, le ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: H.group.name }, H.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, st),
              B && le ? n(Tt, { key: "states", counts: H.group.counts }) : null
            ]);
          } else H.kind === "lane" ? Be = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Tn(H.lane),
            "aria-label": Tn(H.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, H.lane.label),
            (ze = H.lane.performers) != null && ze.length ? n(ir, {
              key: "performers",
              performers: H.lane.performers,
              performerAssignments: H.lane.performerAssignments
            }) : null,
            B ? n(Tt, { key: "states", counts: H.lane.counts }) : null
          ]) : Be = hr(H.segment);
          return n("div", {
            key: H.key,
            className: "absolute left-0 right-0",
            style: { top: H.top, height: H.height }
          }, Be);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${xt ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: te,
          className: `${xt ? "min-h-0 flex-1" : ""} grid`,
          style: xt ? {
            gridTemplateRows: `minmax(16rem, ${(1 - j.timelineRatio) * 100}fr) 0.5rem minmax(14rem, ${j.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: X,
            className: "grid min-h-0 gap-2",
            style: Ct ? {
              gridTemplateColumns: j.markerRailOpen ? `${Y}px 0.5rem minmax(0,1fr) 0.5rem ${M}px` : `${Y}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(kd, {
              key: "tools",
              compatibilityMode: B,
              selectedSegment: vt,
              selectedSegments: Pn,
              selectedGroups: en,
              saveMessage: On,
              savingSegmentId: pt,
              setSavingSegmentId: un,
              setSaveMessage: cn,
              saveTag: Rt,
              slotStatus: rn,
              performerSlotsAvailable: De,
              selectedPerformerSlots: tn,
              performerSlots: Oe,
              detail: z,
              onDetailChange: ve,
              onCancelQueuedReview: u,
              video: Ue,
              slotButtonRef: gn,
              tagSearchRef: fn,
              tagEditing: pn,
              onCancelTagEditing: V,
              detailPanelRef: L,
              onReduceSelection: (H) => {
                ht(H), requestAnimationFrame(() => {
                  var Be;
                  return (Be = L.current) == null ? void 0 : Be.focus({ preventScroll: !0 });
                });
              },
              saveTiming: dr,
              onSlotsChanged: Ne,
              onRecordHistory: wt,
              splitSegment: pr,
              duplicateSegment: N,
              provenance: Pe,
              lineage: x,
              onNavigateLineageItem: (H) => {
                const Be = It.find((ze) => ze.itemId === H);
                Be && Bn(Be.id);
              }
            }),
            Ct ? n(
              "div",
              { key: "detail-separator", ...Ce("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Ue.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(ra, {
                streamUrl: `/api/stream/video/${Ue.id}`,
                posterUrl: `/api/stream/video/${Ue.id}/screenshot?v=${encodeURIComponent(Ue.updatedAt || "")}`,
                format: Ue.videoFile.format,
                audioCodec: Ue.videoFile.audioCodec,
                duration: Ue.videoFile.duration,
                videoId: Ue.id,
                trackingEnabled: !1,
                onSeekRegister: (H) => {
                  bt.current = H, Ws(xe.current, It, H) && (xe.current = null);
                },
                onPlaybackControlRegister: (H) => {
                  at.current = H;
                },
                onTimeUpdate: mr
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            Ct && j.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...Ce("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Ct && j.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          xt ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(_e.minimum * 100),
            "aria-valuemax": Math.round(_e.maximum * 100),
            "aria-valuenow": Math.round(j.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(j.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: ne,
            onPointerMove: be,
            onKeyDown: de,
            onDoubleClick: () => ft(rt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: xt ? void 0 : { height: "20rem" } }, n(wd, {
            segments: zt,
            shotBoundaries: Kn,
            segmentGroups: Bt,
            performerSlots: Oe,
            collapsedGroupKeys: D,
            selectedGroupKey: nn,
            selectedSegmentId: vt == null ? void 0 : vt.id,
            selectedSegmentIds: Gt,
            duration: yn,
            currentTime: E,
            zoom: Je,
            onZoomChange: Gn,
            onSelectGroup: tt,
            onToggleGroup: zn,
            onSelect: (H, Be) => ht(H, Be),
            onSelectSegments: ur,
            onSelectAll: cr,
            onConfigureTag: (H) => on(H),
            onSeekTime: (H) => {
              var Be;
              return (Be = bt.current) == null ? void 0 : Be.call(bt, H, !1);
            },
            centerRef: f,
            showReviewState: B,
            swimlaneTitleWidth: j.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (H) => gr((Be) => ({ ...Be, swimlaneTitleWidth: H }))
          }))
        ])
      ])
    ]),
    C ? n(Jr, {
      key: `configure-tag:${C.tagId}`,
      tagId: C.tagId,
      tagName: C.tagName,
      performerSlotsEnabled: B,
      onSaved: Ee,
      onClose: () => {
        const H = C.trigger;
        on(null), requestAnimationFrame(() => {
          var Be;
          H != null && H.isConnected ? H.focus({ preventScroll: !0 }) : (Be = Q.current) == null || Be.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Ke ? n(yd, {
      key: "publish-approved-dialog",
      drafts: vn,
      processing: pt === -1,
      error: Ae,
      cancelButtonRef: je,
      onConfirm: Te,
      onClose: I
    }) : null,
    Nt ? n(hd, {
      key: "rejected-deletion-dialog",
      preview: Nt,
      onConfirm: () => P(Nt),
      onClose: () => {
        dn(null), requestAnimationFrame(() => {
          var H;
          return (H = Q.current) == null ? void 0 : H.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    mn ? n(md, {
      key: "shortcuts-dialog",
      reviewMode: B,
      bindings: br,
      onClose: () => Ut(!1)
    }) : null,
    T ? n(gd, {
      key: "incorrect-examples-dialog",
      examples: U,
      exporting: ie,
      removingExampleId: Dn,
      onExport: p,
      onRemove: lr,
      onClose: () => Dt(!1)
    }) : null
  ]);
}
function Id(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: m, setEditorFilters: u, setHideDerivedSegments: p, setSaveMessage: f, setSelectedSegmentGroupKey: b, setSelectedSegmentId: y, setSelectedSegmentIds: w } = e;
  function v(C) {
    const R = ut(t, C);
    R && m((E) => Ha(E, R));
  }
  function I(C) {
    y(C), w(C == null ? [] : [C]), c.current = C, g.current = [];
  }
  function V(C, {
    focusEditor: R = !1,
    seekToSegment: E = !1,
    additive: P = !1,
    rangeSegmentIds: z = null
  } = {}) {
    var Y, N;
    const L = ms({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, C.id, z, P);
    w(L.selectedSegmentIds), y(L.activeSegmentId), c.current = L.anchorSegmentId, g.current = L.rangeBaseSegmentIds, L.activeSegmentId != null && b(ut(t, L.activeSegmentId)), v(C.id), R && ((Y = r.current) == null || Y.focus({ preventScroll: !0 })), E && ((N = i.current) == null || N.call(i, C.startSec, !1));
  }
  function D(C) {
    const R = cs(
      d,
      l,
      C
    );
    w(R.selectedSegmentIds), y(R.activeSegmentId), c.current = R.activeSegmentId, g.current = [], R.activeSegmentId != null && (b(ut(t, R.activeSegmentId)), v(R.activeSegmentId));
  }
  function B() {
    var E;
    const C = ps(s), R = C.includes(l) ? l : C[0] ?? null;
    u(dt({})), p(!1), w(C), y(R), c.current = R, g.current = [], R != null && b(ut(
      Lt(s, a, o),
      R
    )), f(C.length === 0 ? "There are no segments to select." : `${C.length} segments selected. Collapsed Segment groups keep their selected segments.`), (E = r.current) == null || E.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: v, replaceSegmentSelection: I, selectSegment: V, selectSegmentCollection: D, selectAllVideoSegments: B };
}
function Cd(e) {
  const { acceptHistory: t, compatibilityMode: r, detail: o, detailPanelRef: i, historyRef: a, mergeSavingRef: s, onConflict: l, onDetailChange: d, onReload: c, pendingReviewStateRef: g, recordHistoryAction: m, revealSegmentGroupForSelection: u, reviewSavingRef: p, savingSegmentId: f, selectedGroups: b, selectedSegment: y, selectedSegmentIdRef: w, selectedSegments: v, selectionAnchorIdRef: I, selectionRangeBaseIdsRef: V, setMergeConfirmation: D, setSaveMessage: B, setSavingSegmentId: C, setSelectedSegmentId: R, setSelectedSegmentIds: E, video: P } = e;
  function z() {
    D(null), requestAnimationFrame(() => {
      var N;
      return (N = i.current) == null ? void 0 : N.focus({ preventScroll: !0 });
    });
  }
  async function L(N = !1, $ = !1, j = null) {
    if (s.current || f != null) return;
    const Q = j || za(
      b,
      { nativeOnly: !r }
    );
    if (!Q) {
      B("Select at least two segments from one swimlane.");
      return;
    }
    if (!N && va()) {
      D(Q);
      return;
    }
    $ && xa(!1), z();
    const ie = Q.endSec == null ? "open end" : $e(Q.endSec);
    s.current = !0;
    let ue = Q.segments[0];
    const ge = r ? null : lt(Q.segments, !1), G = r ? null : crypto.randomUUID(), X = Q.segments.map((ne) => ne.id), de = Gl(o, Q.segments);
    C(ue.id), d(de, P.id), E([ue.id]), R(ue.id), I.current = ue.id, V.current = [];
    try {
      const ne = Q.segments.slice(1);
      if (!r || ue.nativeSegmentId != null) {
        const be = ne.map((A) => {
          const J = `merge-native-selection:${P.id}:${ue.id}:${A.id}:${ue.updatedAt}:${A.updatedAt}`;
          return { key: J, operationId: Le(J), segmentId: A.id, expectedUpdatedAt: A.updatedAt };
        }), Se = await ee(`/videos/${P.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: ue.id,
            expectedSurvivorUpdatedAt: ue.updatedAt,
            consumedSegments: be.map(({ key: A, ...J }) => J),
            historyReceiptId: G
          })
        });
        ue = Se.survivor, d(jo(o, Se), P.id), be.forEach(({ key: A }) => Fe(A));
      } else {
        const be = ne.map((A) => {
          const J = `merge-draft-selection:${P.id}:${ue.itemId}:${A.itemId}:${ue.revision}:${A.revision}`;
          return { key: J, operationId: Le(J), itemId: A.itemId, expectedRevision: A.revision };
        }), Se = await ee(`/videos/${P.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: ue.itemId,
            expectedSurvivorRevision: ue.revision,
            consumedDrafts: be.map(({ key: A, ...J }) => J)
          })
        });
        ue = Se.survivor, d(jo(o, Se), P.id), be.forEach(({ key: A }) => Fe(A));
      }
      E([ue.id]), R(ue.id), I.current = ue.id, V.current = [], r ? t(St) : await m(
        "segments.merge",
        `Merged ${Q.segments.length} segments`,
        ge,
        lt([ue], !1),
        G
      ), u(ue.id), B(`${Q.segments.length} segments merged into ${$e(Q.startSec)} – ${ie}.`);
    } catch (ne) {
      d((be) => qa(
        Rn(be, [Q.segments[0]], [
          "startSec",
          "endSec",
          "sourceKey",
          "sourceRunId",
          "confidence",
          "isDerived"
        ]),
        Q.segments.slice(1)
      ), P.id), E(X), R((y == null ? void 0 : y.id) ?? X[0] ?? null), I.current = (y == null ? void 0 : y.id) ?? X[0] ?? null, V.current = [], ne.status === 409 ? await l() : B(ne.message || "Unable to merge selected segments.");
    } finally {
      s.current = !1, C(null);
    }
  }
  async function Y(N, $ = v, j = y) {
    var de;
    if ($.length === 0 || p.current) return;
    if (f != null) {
      g.current.push(Ts(
        N,
        $,
        j
      )), B(`${N === "approved" ? "Approval" : "Rejection"} queued…`);
      return;
    }
    const Q = $s($, N), ie = $.filter((ne) => ne.reviewState !== Q);
    if (ie.length === 0) return;
    const ue = $.map((ne) => ({
      id: ne.id,
      itemId: ne.itemId,
      nativeSegmentId: ne.nativeSegmentId
    })), ge = ue.find((ne) => ne.id === (j == null ? void 0 : j.id)) || ue[0], G = (ne, be = !1) => {
      if (!(ne != null && ne.segments) || !be && !Er(w.current, ge.id))
        return;
      const Se = ue.map((J) => He(ne == null ? void 0 : ne.segments, J)).filter(Boolean), A = He(ne == null ? void 0 : ne.segments, ge) || Se[0] || null;
      E(Se.map((J) => J.id)), R((A == null ? void 0 : A.id) ?? null), I.current = (A == null ? void 0 : A.id) ?? null, V.current = [];
    };
    p.current = !0, C((j == null ? void 0 : j.id) ?? ie[0].id), B(`Updating ${ie.length} selected segment${ie.length === 1 ? "" : "s"}…`);
    const X = rr(
      o,
      ie.map((ne) => ne.id),
      { reviewState: Q }
    );
    d(X, P.id);
    try {
      const ne = await ee(`/videos/${P.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: a.current.revision,
          reviewState: Q,
          segments: $.map((J) => J.published ? {
            nativeSegmentId: J.nativeSegmentId,
            expectedUpdatedAt: J.updatedAt
          } : {
            itemId: J.itemId,
            expectedRevision: J.revision
          })
        })
      }), be = new Map((ne.items || []).map((J) => [
        J.requestedNativeSegmentId != null ? `native:${J.requestedNativeSegmentId}` : `item:${J.requestedItemId}`,
        J
      ]));
      if (ue.forEach((J) => {
        const _ = be.get(J.nativeSegmentId != null ? `native:${J.nativeSegmentId}` : `item:${J.itemId}`);
        _ && (J.nativeSegmentId = _.nativeSegmentId, J.itemId = _.itemId);
      }), ne.history && t(ne.history), Q === "rejected" || (ne.items || []).some((J) => J.requestedNativeSegmentId != null && J.nativeSegmentId !== J.requestedNativeSegmentId)) {
        G(await c()), B(`${ne.updatedCount} selected segment${ne.updatedCount === 1 ? "" : "s"} ${Q === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const A = {
        ...o,
        approvedSetVersion: ne.approvedSetVersion || o.approvedSetVersion,
        segments: (o.segments || []).map((J) => {
          const _ = be.get(J.nativeSegmentId != null ? `native:${J.nativeSegmentId}` : `item:${J.itemId}`);
          return _ ? {
            ...J,
            id: _.nativeSegmentId != null ? _.nativeSegmentId : -_.itemId,
            itemId: _.itemId,
            nativeSegmentId: _.nativeSegmentId,
            published: _.nativeSegmentId != null,
            reviewState: Q,
            revision: _.nativeSegmentId != null ? J.revision : _.revision,
            updatedAt: _.updatedAt
          } : J;
        })
      };
      d(A, P.id), G(A), B(`${ne.updatedCount} selected segment${ne.updatedCount === 1 ? "" : "s"} ${Q === "approved" ? "approved" : Q === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (ne) {
      d((Se) => Rn(
        Se,
        ie,
        ["reviewState"]
      ), P.id), ne.status === 409 && ((de = ne.payload) != null && de.currentHistory) && t(ne.payload.currentHistory);
      const be = ne.status === 409 ? await l() : o;
      G(be, !0), B(ne.message || "Unable to update the selected segments.");
    } finally {
      p.current = !1, C(null);
    }
  }
  return { closeMergeConfirmation: z, mergeSelectedSwimlane: L, saveSelectedReviewState: Y };
}
function $d(e) {
  const { acceptHistory: t, allSwimlanes: r, autoAssignCandidates: o, autoAssigning: i, binEmptyingRef: a, canMoveSelectionToBin: s, closeTagEditing: l, compatibilityMode: d, detail: c, editorRef: g, exportingExamples: m, incorrectExamples: u, lineage: p, materializeButtonRef: f, materializePreview: b, materializeRestoreFocusRef: y, materializing: w, mutateSegment: v, onConflict: I, onDetailChange: V, onReload: D, recordHistoryAction: B, refreshMaterializationPreview: C, removingExampleId: R, revealSegmentGroupForSelection: E, savingSegmentId: P, segments: z, selectedSegment: L, selectedSegmentIdRef: Y, selectedSegments: N, selectionAnchorIdRef: $, selectionRangeBaseIdsRef: j, setAutoAssignError: Q, setAutoAssignOpen: ie, setAutoAssigning: ue, setExportingExamples: ge, setIncorrectExamples: G, setMaterializeError: X, setMaterializeLoading: de, setMaterializeOpen: ne, setMaterializePreview: be, setMaterializing: Se, setRejectedDeletionPreview: A, setRemovingExampleId: J, setSaveMessage: _, setSavingSegmentId: ae, setSelectedSegmentGroupKey: h, setSelectedSegmentId: U, setSelectedSegmentIds: T, video: x } = e;
  async function M() {
    var Ne, Ie, Ce;
    if (N.length === 0 || !L || P != null) return;
    const O = Ol(N, u), re = O.segments;
    if (re.length === 0) return;
    const ye = N.map((xe) => ({
      id: xe.id,
      itemId: xe.itemId,
      nativeSegmentId: xe.nativeSegmentId
    })), he = ye.find((xe) => xe.id === L.id) || ye[0], ve = [], Me = [];
    let Ee = c;
    ae(he.id), _(O.action === "remove" ? `Removing ${re.length} selected incorrect example${re.length === 1 ? "" : "s"}…` : `Collecting ${re.length} selected segment${re.length === 1 ? "" : "s"} as incorrect AI feedback…`);
    try {
      const xe = async (Te, Ae) => {
        const Ke = Te.nativeSegmentId != null, it = O.action === "remove" ? `incorrect-example-remove:${x.id}:${Ae == null ? void 0 : Ae.id}:${Ae == null ? void 0 : Ae.revision}:${Ae == null ? void 0 : Ae.representationRevision}` : `incorrect-example-collect:${x.id}:${Ke ? `native:${Te.nativeSegmentId}:${Te.updatedAt}` : `item:${Te.itemId}:${Te.revision}`}`;
        if (O.action === "remove" && !Ae)
          throw new Error("The incorrect-example collection changed. Reload and try again.");
        let Qe;
        try {
          Qe = O.action === "remove" ? await ee(
            `/videos/${x.id}/incorrect-examples/${Ae.id}/remove`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Le(it),
                expectedExampleRevision: Ae.revision,
                expectedRepresentationRevision: Ae.representationRevision
              })
            }
          ) : await ee(`/videos/${x.id}/incorrect-examples/collect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Le(it),
              nativeSegmentId: Ke ? Te.nativeSegmentId : null,
              itemId: Ke ? null : Te.itemId,
              expectedUpdatedAt: Ke ? Te.updatedAt : null,
              expectedRevision: Ke ? null : Te.revision
            })
          });
        } catch (Ye) {
          throw Ye.operationKey = it, Ye;
        }
        if (!Pl(O.action, Qe))
          throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
        return Fe(it), Qe;
      };
      for (const Te of re) {
        const Ae = O.action === "remove" ? u.find((Ke) => Ke.itemId != null && Ke.itemId === Te.itemId) : null;
        try {
          const Ke = ye.find((Ye) => Ye.id === Te.id);
          let it = He(
            Ee == null ? void 0 : Ee.segments,
            Ke
          ) || Te, Qe;
          try {
            Qe = await xe(it, Ae);
          } catch (Ye) {
            if (Ye.status === 409 && ((Ie = (Ne = Ye.payload) == null ? void 0 : Ne.result) == null ? void 0 : Ie.code) === "OPERATION_REPLAYED")
              Ee = await ee(
                `/videos/${x.id}/editor`
              ), Fe(Ye.operationKey), Qe = Ye.payload.result;
            else {
              if (O.action !== "collect" || Ye.status !== 409) throw Ye;
              const wt = await ee(
                `/videos/${x.id}/editor`
              );
              Ee = wt;
              const Nt = He(
                wt == null ? void 0 : wt.segments,
                Ke
              );
              if (!Nt) throw Ye;
              it = Nt, Qe = await xe(it, null);
            }
          }
          Ke && Qe.itemId != null && (Ke.itemId = Qe.itemId), Ee = Go(
            Ee,
            Qe.editorDelta
          ), ve.push({ segment: Te, result: Qe });
        } catch (Ke) {
          if (Me.push(Ke), ![400, 404, 409].includes(Ke.status)) break;
        }
      }
      ve.some(({ result: Te }) => Te.representation === "basicNativeBin") && In();
      const Oe = Er(
        Y.current,
        he.id
      ), De = O.action === "collect" && ve.some(({ segment: Te }) => Te.id === he.id), at = ve.map(({ segment: Te }) => Te.id), we = De ? ys(
        r,
        at,
        he.id
      ) : null, Pe = De ? (we == null ? void 0 : we.id) ?? null : he.id;
      Oe && De && (T(we ? [we.id] : []), U((we == null ? void 0 : we.id) ?? er), $.current = (we == null ? void 0 : we.id) ?? null, j.current = []);
      const qe = await ee(`/videos/${x.id}/incorrect-examples`);
      G(qe);
      const je = Ee;
      if (V(je, x.id), Oe && Er(
        Y.current,
        Pe
      )) {
        let Te, Ae;
        De ? (Ae = we ? He(je == null ? void 0 : je.segments, {
          id: we.id,
          itemId: we.itemId,
          nativeSegmentId: we.nativeSegmentId
        }) : null, Te = Ae ? [Ae] : []) : (Te = ye.map((Ke) => He(je == null ? void 0 : je.segments, Ke)).filter(Boolean), Ae = He(je == null ? void 0 : je.segments, he) || Te[0] || null), T(Te.map((Ke) => Ke.id)), U((Ae == null ? void 0 : Ae.id) ?? (De ? er : null)), $.current = (Ae == null ? void 0 : Ae.id) ?? null, j.current = [], h(Ae ? ut(r, Ae.id) : null), Ae && E(Ae.id);
      }
      if (Me.length > 0) {
        const Te = ((Ce = Me[0]) == null ? void 0 : Ce.message) || "Only segments with registered AI provenance can be collected.";
        ve.length === 0 ? _(Te) : O.action === "remove" ? _(
          `Partially removed ${ve.length} of ${re.length} selected incorrect examples. ${Te}`
        ) : _(
          `Partially collected ${ve.length} of ${re.length} selected segments. ${Te}`
        );
      } else if (O.action === "remove")
        _(
          `${ve.length} incorrect example${ve.length === 1 ? "" : "s"} removed and ${ve.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
        );
      else {
        const Te = ve.filter(({ result: Ae }) => Ae.representation === "basicNativeBin").length;
        _(Te === ve.length ? `${ve.length} incorrect AI example${ve.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ve.length} incorrect AI example${ve.length === 1 ? "" : "s"} collected and ${ve.length === 1 ? "segment rejected" : "segments rejected"}.`);
      }
    } catch (xe) {
      _(xe.message || "Unable to update the selected incorrect examples.");
    } finally {
      ae(null);
    }
  }
  async function S(O) {
    var ye, he;
    if (!O || R != null || m) return;
    J(O.id);
    const re = `incorrect-example-remove:${x.id}:${O.id}:${O.revision}:${O.representationRevision}`;
    try {
      const ve = await ee(
        `/videos/${x.id}/incorrect-examples/${O.id}/remove`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(re),
            expectedExampleRevision: O.revision,
            expectedRepresentationRevision: O.representationRevision
          })
        }
      );
      Fe(re);
      const Me = await ee(
        `/videos/${x.id}/incorrect-examples`
      );
      G(Me), V(
        Go(c, ve.editorDelta),
        x.id
      ), O.representation === "basicNativeBin" && In(), _(O.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed.");
    } catch (ve) {
      if (ve.status === 409 && ((he = (ye = ve.payload) == null ? void 0 : ye.result) == null ? void 0 : he.code) === "OPERATION_REPLAYED") {
        Fe(re), G(await ee(
          `/videos/${x.id}/incorrect-examples`
        )), await D(), _("Incorrect example removal was already applied.");
        return;
      }
      ve.status === 409 && await I(), _(ve.message || "Unable to remove the incorrect example.");
    } finally {
      J(null);
    }
  }
  async function k() {
    if (m || R != null || u.length === 0) return;
    ge(!0);
    const O = `incorrect-example-export:${x.id}:${u.map((re) => `${re.id}:${re.revision}:${re.representationRevision}`).join(",")}`;
    try {
      const re = await Fl(
        x.id,
        u
      ), ye = new FormData();
      ye.append("metadata", JSON.stringify({
        operationId: Le(O),
        examples: re.captures
      }));
      for (const Ie of re.files)
        ye.append(Ie.fieldName, Ie.file);
      const he = await ee(
        `/videos/${x.id}/incorrect-examples/export`,
        { method: "POST", body: ye }
      ), ve = await tl(he.downloadUrl), Me = URL.createObjectURL(ve.blob), Ee = document.createElement("a");
      Ee.href = Me, Ee.download = ve.fileName, Ee.click(), setTimeout(() => URL.revokeObjectURL(Me), 1e3);
      const Ne = await ee(
        `/training-exports/${he.id}/complete`,
        { method: "POST" }
      );
      Fe(O), G(await ee(
        `/videos/${x.id}/incorrect-examples`
      )), _(
        `Downloaded ${he.exampleCount} incorrect example${he.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Ne.clearedExampleCount} from the working collection.`
      );
    } catch (re) {
      _(re.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      ge(!1);
    }
  }
  async function W(O = null) {
    const re = z.filter((Ce) => Ce.reviewState === "rejected"), ye = re.length, he = u.some((Ce) => Ce.representation === "fullItem");
    if (O == null && ye === 0 && !he) {
      _("There are no rejected segments to delete.");
      return;
    }
    if (O == null) {
      ae(-1), _("Preparing deletion summary…");
      try {
        const Ce = await ee(`/videos/${x.id}/rejected/deletion/preview`, { method: "POST" }), xe = Number(Ce.deletedSegmentCount) || 0, Oe = Number(Ce.deferredRejectedSegmentCount) || 0, De = Number(Ce.protectedIncorrectExampleCount) || 0;
        if (xe === 0) {
          Oe > 0 ? _(
            `${Oe} feedback-protected rejected segment${Oe === 1 ? "" : "s"} kept. ${De} AI feedback example${De === 1 ? "" : "s"} must be exported before ${Oe === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : _("There are no rejected segments to delete.");
          return;
        }
        if (!Da(Ce, _)) return;
        A(Ce), _("");
      } catch (Ce) {
        _(Ce.message || "Unable to prepare rejected segment deletion.");
      } finally {
        ae(null);
      }
      return;
    }
    const ve = O, Me = Number(ve.deferredRejectedSegmentCount) || 0, Ee = Y.current, Ne = Me === 0 ? Lr(c, re.map((Ce) => Ce.id)) : c, Ie = Ne.segments.find((Ce) => Ce.reviewState === "unreviewed") || Ne.segments[0] || null;
    A(null), ae(-1), _("Deleting rejected segments…"), Me === 0 && (V(Ne, x.id), T(Ie ? [Ie.id] : []), U((Ie == null ? void 0 : Ie.id) ?? null), $.current = (Ie == null ? void 0 : Ie.id) ?? null, j.current = []);
    try {
      const Ce = `rejected-dependency-delete:${x.id}:${ve.fingerprint}`, xe = await ee(`/videos/${x.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(Ce),
          fingerprint: ve.fingerprint
        })
      });
      Fe(Ce), await D(), xe.deletedSegmentCount > 0 && t(St);
      const Oe = Me > 0 ? ` ${Me} feedback-protected rejected segment${Me === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      _(`${xe.deletedSegmentCount} segment${xe.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Oe}`);
    } catch (Ce) {
      Me === 0 && V((xe) => qa(
        xe,
        re
      ), x.id), T(Ee == null ? [] : [Ee]), U(Ee), $.current = Ee, j.current = [], _(Ce.message || "Unable to delete rejected segments.");
    } finally {
      ae(null);
    }
  }
  async function me(O = o) {
    if (!(i || O.length === 0)) {
      ue(!0), Q("");
      try {
        const re = await ee(`/videos/${x.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: O.flatMap((ye) => ye.nativeSegmentId == null ? [] : [ye.nativeSegmentId]),
            itemIds: O.flatMap((ye) => ye.published || ye.itemId == null ? [] : [ye.itemId])
          })
        });
        ie(!1), await D(), _(`${re.assignedSegmentCount} segment${re.assignedSegmentCount === 1 ? "" : "s"} received ${re.assignedSlotCount} performer-slot assignment${re.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (re) {
        Q(re.message || "Unable to auto-assign performers.");
      } finally {
        ue(!1);
      }
    }
  }
  async function se() {
    ne(!0), X(""), !b && (de(!0), C());
  }
  function oe() {
    y.current = !0, ne(!1), requestAnimationFrame(() => {
      var O;
      return (O = f.current) == null ? void 0 : O.focus({ preventScroll: !0 });
    });
  }
  async function ke() {
    if (!b || w || b.createCount + b.linkCount === 0)
      return;
    Se(!0), X("");
    let O;
    try {
      const re = `materialize-derived:${x.id}:${b.fingerprint}`;
      O = await ee(`/videos/${x.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(re),
          fingerprint: b.fingerprint,
          maxDepth: 3
        })
      }), Fe(re);
    } catch (re) {
      re.status === 409 && be(null), X(re.message || "Unable to materialize derived segments."), Se(!1);
      return;
    }
    be((re) => re && { ...re, createCount: 0, linkCount: 0 });
    try {
      await D(), oe(), be(null);
      const re = O.createdCount + O.linkedCount;
      _(`${O.createdCount} derived segment${O.createdCount === 1 ? "" : "s"} created and ${O.linkedCount} existing segment${O.linkedCount === 1 ? "" : "s"} linked.`), re === 0 && _("Every applicable derivation was already materialized.");
    } catch {
      X("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    Se(!1);
  }
  async function q(O, re = null) {
    var he, ve, Me, Ee;
    const ye = {
      tagId: O,
      ...re ? { tagName: re } : {}
    };
    if (N.length > 1) {
      const Ne = N.filter((De) => De.tagId !== O);
      if (Ne.length === 0) {
        l();
        return;
      }
      const Ie = N.map((De) => ({
        id: De.id,
        itemId: De.itemId,
        nativeSegmentId: De.nativeSegmentId
      })), Ce = N.map((De) => !d || De.nativeSegmentId != null ? `native:${De.nativeSegmentId}:${De.updatedAt}` : `item:${De.itemId}:${De.revision}`).sort().join(","), xe = `bulk-tag:${x.id}:${O}:${Ce}`;
      ae((L == null ? void 0 : L.id) ?? Ne[0].id), _(`Changing tag for ${Ne.length} selected segment${Ne.length === 1 ? "" : "s"}…`);
      const Oe = rr(
        c,
        Ne.map((De) => De.id),
        ye
      );
      V(Oe, x.id), l();
      try {
        const De = d ? null : crypto.randomUUID();
        await ee(`/videos/${x.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(xe),
            tagId: O,
            historyReceiptId: De,
            segments: N.map((je) => {
              const Te = !d || je.nativeSegmentId != null;
              return {
                nativeSegmentId: Te ? je.nativeSegmentId : null,
                itemId: Te ? null : je.itemId,
                expectedUpdatedAt: Te ? je.updatedAt : null,
                expectedRevision: Te ? null : je.revision
              };
            })
          })
        }), Fe(xe);
        const at = lt(
          N,
          d
        ), we = await D(), Pe = Ie.map((je) => He(we == null ? void 0 : we.segments, je)).filter(Boolean);
        await B(
          "segments.tag",
          `Changed tag for ${Ne.length} segment${Ne.length === 1 ? "" : "s"}`,
          at,
          lt(Pe, d),
          De
        );
        const qe = Ie.map((je) => He(we == null ? void 0 : we.segments, je)).filter(Boolean);
        T(qe.map((je) => je.id)), U(((he = qe.find((je) => je.id === (L == null ? void 0 : L.id))) == null ? void 0 : he.id) ?? ((ve = qe[0]) == null ? void 0 : ve.id) ?? null), l(), _(`${Ne.length} selected segment${Ne.length === 1 ? "" : "s"} retagged.`);
      } catch (De) {
        V((Pe) => Rn(
          Pe,
          Ne,
          Object.keys(ye)
        ), x.id);
        const at = Ie.map((Pe) => He(c.segments, Pe)).filter(Boolean), we = He(c.segments, {
          id: L == null ? void 0 : L.id,
          itemId: L == null ? void 0 : L.itemId,
          nativeSegmentId: L == null ? void 0 : L.nativeSegmentId
        }) || at[0] || null;
        T(at.map((Pe) => Pe.id)), U((we == null ? void 0 : we.id) ?? null), $.current = (we == null ? void 0 : we.id) ?? null, j.current = [], De.status === 409 && await I(), _(De.message || "Unable to change the selected segment tags.");
      } finally {
        ae(null);
      }
      return;
    }
    if (!(N.length !== 1 || !L)) {
      if (O === L.tagId) {
        l();
        return;
      }
      if (L.itemId != null && ((Ee = (Me = p.data) == null ? void 0 : Me.children) == null ? void 0 : Ee.length) > 0) {
        ae(L.id), _("Checking lineage impact…");
        try {
          const Ne = await ee(`/items/${L.itemId}/tag-change/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedRevision: L.revision, tagId: O })
          }), Ie = Ne.deletedItemIds.length > 0 || Ne.removedEdgeIds.length > 0;
          if (Ie && !window.confirm(
            `Changing this tag removes ${Ne.removedEdgeIds.length} lineage edge${Ne.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${Ne.deletedItemIds.length} derived segment${Ne.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
          )) {
            _("Tag change canceled.");
            return;
          }
          const Ce = rr(
            c,
            [L.id],
            ye
          );
          V(Ce, x.id), l();
          const xe = `tag-change:${L.itemId}:${L.revision}:${Ne.componentFingerprint}:${O}`;
          await ee(`/items/${L.itemId}/tag-change/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Le(xe),
              expectedRevision: L.revision,
              componentFingerprint: Ne.componentFingerprint,
              tagId: O
            })
          }), Fe(xe), await D(), l(), _(Ie ? "Tag changed and lineage reconciled." : "Tag changed.");
        } catch (Ne) {
          V((Ie) => Rn(
            Ie,
            [L],
            Object.keys(ye)
          ), x.id), T([L.id]), U(L.id), $.current = L.id, j.current = [], Ne.status === 409 ? (_("Lineage changed — loading the latest segments…"), await I()) : _(Ne.message || "Unable to reconcile the lineage.");
        } finally {
          ae(null);
        }
        return;
      }
      l(), await v(L, {
        startSec: L.startSec,
        endSec: L.endSec,
        tagId: O
      }, !0, null, !0, ye);
    }
  }
  async function te() {
    var Ee, Ne, Ie, Ce;
    if (!s || !L || P != null) return;
    const O = [...N].sort((xe, Oe) => Number(xe.nativeSegmentId ?? xe.id) - Number(Oe.nativeSegmentId ?? Oe.id)), re = new Set(O.map((xe) => xe.id)), ye = O.map((xe) => `${xe.nativeSegmentId ?? xe.id}:${xe.updatedAt}`).join("|");
    ae(L.id), _(`Moving ${O.length} segment${O.length === 1 ? "" : "s"} to recycling bin…`);
    const he = `bulk-move:${x.id}:${ye}`, ve = Le(he), Me = d ? null : crypto.randomUUID();
    try {
      const xe = (Pe = !1) => ee(`/videos/${x.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ve,
          segments: O.map((qe) => ({
            segmentId: qe.nativeSegmentId ?? qe.id,
            expectedUpdatedAt: qe.updatedAt
          })),
          discardMissingImage: Pe,
          ...d ? { reviewState: "rejected" } : {},
          historyReceiptId: Me
        })
      });
      let Oe;
      try {
        Oe = await xe(
          _r(he)
        );
      } catch (Pe) {
        if (((Ee = Pe.payload) == null ? void 0 : Ee.code) !== "missing-image" || !window.confirm(`${Pe.message}

Continue and discard the missing image reference?`)) throw Pe;
        Hr(he), Oe = await xe(!0);
      }
      Fe(he), In();
      const De = new Map((Oe.items || []).map((Pe) => [
        Number(Pe.segmentId),
        Pe
      ]));
      await B(
        "segments.moveToBin",
        `Moved ${O.length} segment${O.length === 1 ? "" : "s"} to recycling bin`,
        lt(O, !1),
        lt(O.map((Pe) => {
          const qe = De.get(
            Number(Pe.nativeSegmentId ?? Pe.id)
          );
          return {
            ...Pe,
            recycleBinItemId: (qe == null ? void 0 : qe.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (qe == null ? void 0 : qe.revision) ?? null
          };
        }), !1),
        Me
      );
      const at = z.filter((Pe) => !re.has(Pe.id)), we = fs(r, re, L.id);
      V({ ...c, segments: at }, x.id), T(we ? [we.id] : []), U((we == null ? void 0 : we.id) ?? null), $.current = (we == null ? void 0 : we.id) ?? null, j.current = [], we && (h(ut(r, we.id)), E(we.id)), requestAnimationFrame(() => {
        var Pe;
        return (Pe = g.current) == null ? void 0 : Pe.focus({ preventScroll: !0 });
      }), _(`Moved ${O.length} segment${O.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (xe) {
      const Oe = ((Ne = xe.payload) == null ? void 0 : Ne.code) || ((Ce = (Ie = xe.payload) == null ? void 0 : Ie.result) == null ? void 0 : Ce.code);
      xe.status === 409 && Oe === "CANONICAL_SEGMENT_CHANGED" ? await I() : _(xe.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      ae(null);
    }
  }
  async function Z() {
    if (!(d || a.current || P != null)) {
      a.current = !0, _("Checking the recycling bin…");
      try {
        const O = await ee("/bin"), re = await Pa(O, () => _("Emptying the recycling bin…"));
        if (re.status === "empty") {
          _("The recycling bin is empty.");
          return;
        }
        if (re.status === "canceled") {
          _("The recycling bin was not emptied.");
          return;
        }
        _(`${re.segmentCount} segment${re.segmentCount === 1 ? "" : "s"} from ${re.sceneCount} scene${re.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (O) {
        _(O.message || "Unable to empty the recycling bin.");
      } finally {
        a.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: M, removeIncorrectExample: S, captureTrainingExport: k, deleteRejectedSegments: W, autoAssignPerformers: me, previewDerivedSegments: se, closeMaterializeDialog: oe, materializeDerivedSegments: ke, saveTag: q, moveToBin: te, emptyRecyclingBin: Z };
}
function Td(e) {
  const { acceptHistory: t, compatibilityMode: r, currentTime: o, detail: i, editorLayout: a, focusRowRef: s, history: l, historyRef: d, historySaving: c, horizontalLayoutSize: g, mediaStackHeight: m, mediaStackRef: u, onDetailChange: p, onReload: f, railToggleRef: b, recordHistoryAction: y, savingSegmentId: w, savingShot: v, savingShotRef: I, setCollapsedSegmentGroups: V, setEditorLayout: D, setHistorySaving: B, setSaveMessage: C, setSavingSegmentId: R, setSavingShot: E, shotBoundaries: P, timelineDuration: z, video: L, workspaceRef: Y } = e;
  async function N(h, U, T) {
    var k, W, me, se;
    const x = h.type === "segment" ? [h] : h.segments || [], M = (U == null ? void 0 : U.type) === "segment" ? [U] : (U == null ? void 0 : U.segments) || [];
    let S = T;
    for (const [oe, ke] of x.entries()) {
      const q = M[oe], te = ((k = ke.identity) == null ? void 0 : k.nativeSegmentId) != null || ((W = ke.identity) == null ? void 0 : W.published) === !0, Z = ((me = q == null ? void 0 : q.identity) == null ? void 0 : me.recycleBinItemId) ?? ((se = q == null ? void 0 : q.identity) == null ? void 0 : se.itemId);
      let O = He(S.segments, q == null ? void 0 : q.identity) || He(S.segments, ke.identity);
      if (!O && te && Z != null && q.identity.revision != null) {
        const he = `history-restore:${L.id}:${Z}:${q.identity.revision}`;
        await ee(`/bin/${Z}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(he),
            expectedRevision: q.identity.revision
          })
        }), Fe(he), S = await f(), O = S.segments.find((ve) => ve.tagId === ke.values.tagId && ve.startSec === ke.values.startSec && ve.endSec === ke.values.endSec);
      }
      if (!O)
        throw new Error("A segment in this history state no longer exists.");
      if ((O.nativeSegmentId != null || O.published === !0) !== te) {
        if (te) {
          const he = O.recycleBinItemId ?? O.itemId ?? Z;
          if (he == null)
            throw new Error("This recycled segment can no longer be restored.");
          const ve = `history-restore:${L.id}:${he}:${O.revision}:${ke.values.reviewState ?? "native"}`;
          await ee(`/bin/${he}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Le(ve),
              expectedRevision: O.revision
            })
          }), Fe(ve);
        } else {
          const he = `history-bin:${L.id}:${O.nativeSegmentId}:${O.updatedAt}:${ke.values.reviewState}`;
          await ee(`/videos/${L.id}/segments/${O.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Le(he),
              expectedUpdatedAt: O.updatedAt,
              reviewState: ke.values.reviewState
            })
          }), Fe(he);
        }
        if (S = await f(), !te)
          continue;
        if (O = He(S.segments, ke.identity) || S.segments.find((he) => he.tagId === ke.values.tagId && he.startSec === ke.values.startSec && he.endSec === ke.values.endSec), !O)
          throw new Error("The restored segment could not be found.");
      }
      const ye = ke.values;
      if (O.nativeSegmentId == null && O.itemId != null) {
        const he = `history-draft-update:${L.id}:${O.itemId}:${O.revision}:${ye.tagId}:${ye.startSec}:${ye.endSec ?? "open"}:${ye.reviewState}`;
        await ee(`/videos/${L.id}/drafts/${O.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(he),
            expectedRevision: O.revision,
            ...ye
          })
        }), Fe(he);
      } else
        await ee(`/videos/${L.id}/segments/${O.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...ye, expectedUpdatedAt: O.updatedAt })
        });
      S = await f();
    }
    return S;
  }
  async function $(h, U) {
    var T;
    for (const x of h.targets || []) {
      const M = He(U.segments, x.identity);
      if (!M)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const S = (T = U.performerSlotRevisions) == null ? void 0 : T[M.id];
      await ee(M.published ? `/videos/${L.id}/segments/${M.nativeSegmentId}/slots` : `/videos/${L.id}/drafts/${M.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: S,
          assignments: x.assignments
        })
      }), U = await f();
    }
    return U;
  }
  async function j(h, U, T = []) {
    const x = h.state;
    if (!r && ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")) {
      const S = `basic-history:${L.id}:${d.current.revision}:${h.action.sequence}:${h.direction}`, k = await ee(`/videos/${L.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(S),
          expectedHistoryRevision: d.current.revision,
          actionSequence: h.action.sequence,
          direction: h.direction
        })
      });
      return t(k.history), T.push(S), f();
    }
    const M = h.direction === "backward" ? h.action.afterState : h.action.beforeState;
    if ((x == null ? void 0 : x.type) === "composite") {
      let S = U;
      const k = (M == null ? void 0 : M.type) === "composite" ? M.states || [] : [];
      for (const [W, me] of (x.states || []).entries()) {
        const se = k[W];
        S = await j({
          ...h,
          state: me,
          action: {
            ...h.action,
            beforeState: h.direction === "backward" ? me : se,
            afterState: h.direction === "backward" ? se : me
          }
        }, S, T);
      }
      return S;
    }
    if ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")
      return N(
        x,
        M,
        U
      );
    if ((x == null ? void 0 : x.type) === "performerSlots")
      return $(x, U);
    if ((x == null ? void 0 : x.type) === "shots") {
      const S = Nn(U.shotBoundaries || []), k = await ee(`/videos/${L.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(`history-shots:${L.id}:${S}:${x.fingerprint}`),
          expectedFingerprint: S,
          boundaries: x.boundaries
        })
      });
      return { ...U, shotBoundaries: k };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function Q(h) {
    var T;
    if (c || w != null || v || h === l.cursorSequence)
      return;
    const U = pl(l, h);
    if (U.length !== 0) {
      B(!0), R(-1), C(`Restoring ${U.length} history ${U.length === 1 ? "action" : "actions"}…`);
      try {
        let x = i;
        const M = [];
        for (const k of U)
          x = await j(
            k,
            x,
            M
          );
        const S = r ? await ee(`/videos/${L.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: d.current.revision,
            targetSequence: h
          })
        }) : d.current;
        M.forEach(Fe), t(S), await f(), C("History restored.");
      } catch (x) {
        x.status === 409 && ((T = x.payload) != null && T.current) && t(x.payload.current), await f(), C(x.message || "Unable to restore editor history.");
      } finally {
        R(null), B(!1);
      }
    }
  }
  function ie(h) {
    D((U) => ({ ...U, timelineRatio: Ur(h, m) }));
  }
  function ue(h) {
    var T;
    const U = (T = u.current) == null ? void 0 : T.getBoundingClientRect();
    U && ie(es(h.clientY, U.top, U.height));
  }
  function ge(h) {
    h.currentTarget.setPointerCapture(h.pointerId), ue(h);
  }
  function G(h) {
    h.currentTarget.hasPointerCapture(h.pointerId) && ue(h);
  }
  function X(h) {
    const U = h.shiftKey ? 0.1 : 0.05;
    let T = null;
    h.key === "ArrowUp" && (T = a.timelineRatio + U), h.key === "ArrowDown" && (T = a.timelineRatio - U);
    const x = Kr(m);
    h.key === "Home" && (T = x.minimum), h.key === "End" && (T = x.maximum), T != null && (h.preventDefault(), h.stopPropagation(), ie(T));
  }
  function de(h) {
    const U = h === "detailWidth" ? g.focusRow : g.workspace, T = g.workspace > 0 ? Rr(g.workspace, 600) : 560, x = Pt(a.markerRailWidth, T), M = h === "detailWidth" ? 344 + (a.markerRailOpen ? x + 24 : 0) : 600;
    return U > 0 ? Rr(U, M) : 560;
  }
  function ne(h, U) {
    D((T) => ({ ...T, [h]: Pt(U, de(h)) }));
  }
  function be(h, U) {
    var x, M;
    const T = U === "detailWidth" ? (x = s.current) == null ? void 0 : x.getBoundingClientRect() : (M = Y.current) == null ? void 0 : M.getBoundingClientRect();
    T && ne(U, U === "detailWidth" ? h.clientX - T.left : T.right - h.clientX);
  }
  function Se(h, U) {
    const T = de(h), x = Pt(a[h], T);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": U,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(T),
      "aria-valuenow": Math.round(x),
      "aria-valuetext": `${Math.round(x)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (M) => {
        M.currentTarget.setPointerCapture(M.pointerId), be(M, h);
      },
      onPointerMove: (M) => {
        M.currentTarget.hasPointerCapture(M.pointerId) && be(M, h);
      },
      onKeyDown: (M) => {
        const S = M.shiftKey ? 40 : 16;
        let k = null;
        M.key === "ArrowLeft" && (k = h === "detailWidth" ? -S : S), M.key === "ArrowRight" && (k = h === "detailWidth" ? S : -S);
        let W = k == null ? null : x + k;
        M.key === "Home" && (W = 240), M.key === "End" && (W = T), W != null && (M.preventDefault(), M.stopPropagation(), ne(h, W));
      },
      onDoubleClick: () => ne(h, rt[h]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function A() {
    D((h) => ({ ...h, markerRailOpen: !h.markerRailOpen })), requestAnimationFrame(() => {
      var h;
      return (h = b.current) == null ? void 0 : h.focus({ preventScroll: !0 });
    });
  }
  function J(h) {
    V((U) => U.includes(h) ? U.filter((T) => T !== h) : At([...U, h]));
  }
  async function _(h, U = !0, T = o) {
    var k;
    if (I.current) return null;
    const x = Number((k = L.videoFile) == null ? void 0 : k.duration) || z, M = Nn(P), S = `shot-${h}:${L.id}:${T.toFixed(3)}:${x.toFixed(3)}:${M}`;
    I.current = !0, E(!0), C(h === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const W = await ee(`/videos/${L.id}/shot-boundaries/${h}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(h === "split" ? { operationId: Le(S), timeSec: T } : { operationId: Le(S), timeSec: T })
      });
      return Fe(S), p((me) => ({ ...me, shotBoundaries: W }), L.id), U && await y(
        "shots.update",
        h === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: P,
          fingerprint: M
        },
        {
          type: "shots",
          boundaries: W,
          fingerprint: Nn(W)
        }
      ), C(h === "split" ? "Shot boundary added." : "Shots merged."), W;
    } catch (W) {
      return C(W.message || "Unable to edit shot boundaries."), null;
    } finally {
      I.current = !1, E(!1);
    }
  }
  async function ae(h) {
    if (I.current) return null;
    const U = `shot-restore:${L.id}:${h.afterFingerprint}`;
    I.current = !0, E(!0), C("Undoing shot edit…");
    try {
      const T = await ee(`/videos/${L.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(U),
          expectedFingerprint: h.afterFingerprint,
          boundaries: h.before
        })
      });
      return Fe(U), p((x) => ({ ...x, shotBoundaries: T }), L.id), T;
    } catch (T) {
      return C(T.message || "Unable to undo the shot edit."), null;
    } finally {
      I.current = !1, E(!1);
    }
  }
  return { applySegmentHistoryState: N, applyPerformerSlotHistoryState: $, applyHistoryState: j, restoreHistoryTarget: Q, updateTimelineRatio: ie, updateTimelineRatioFromPointer: ue, handleSeparatorPointerDown: ge, handleSeparatorPointerMove: G, handleSeparatorKeyDown: X, panelWidthMaximum: de, updatePanelWidth: ne, handlePanelSeparatorPointer: be, panelSeparatorProps: Se, toggleSegmentRail: A, toggleSegmentGroup: J, mutateShotBoundary: _, restoreShotBoundaries: ae };
}
function Ad(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: m, lineage: u, mediaDuration: p, mergeSelectedSwimlane: f, moveToBin: b, mutateShotBoundary: y, openPublishApprovedDialog: w, playbackControlsRef: v, playbackShortcutConfig: I, saveSelectedReviewState: V, seekRef: D, segmentGroupKeys: B, selectSegment: C, selectedSegment: R, selectedSegmentGroupForSegment: E, selectedSegmentGroupKey: P, selectedSegments: z, setCollapsedSegmentGroups: L, setIncorrectExamplesOpen: Y, setQuickSearchOpen: N, setSaveMessage: $, setSelectedSegmentGroupKey: j, setTagEditing: Q, setTimelineZoom: ie, shotBoundaries: ue, slotButtonRef: ge, splitSegment: G, swimlanes: X, timelineDuration: de, toggleIncorrectExample: ne, toggleSegmentGroup: be, updateTimelineRatio: Se, videoFrameRate: A, visibleSegments: J } = e;
  function _(h, U) {
    if (z.length > 1 && ks(h.id))
      return;
    let T = null;
    h.id === "video.playPause" && (T = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.toggle();
    }), h.id === "video.seekSmallBackward" && (T = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(-I.smallSeekTime);
    }), h.id === "video.seekSmallForward" && (T = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(I.smallSeekTime);
    }), h.id === "video.seekMediumBackward" && (T = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(-I.mediumSeekTime);
    }), h.id === "video.seekMediumForward" && (T = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(I.mediumSeekTime);
    }), h.id === "video.seekLongBackward" && (T = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(-I.longSeekTime);
    }), h.id === "video.seekLongForward" && (T = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(I.longSeekTime);
    }), h.id === "video.playSelected" && R && (T = () => {
      var x;
      (x = D.current) == null || x.call(D, R.startSec, !0), requestAnimationFrame(() => {
        var M;
        return (M = g.current) == null ? void 0 : M.focus({ preventScroll: !0 });
      });
    }), (h.id === "video.playPreviousSegment" || h.id === "video.playNextSegment") && (T = () => {
      var M;
      const x = Pr(
        X,
        R == null ? void 0 : R.id,
        h.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !x || x.id === (R == null ? void 0 : R.id) || (C(x, { focusEditor: !0, seekToSegment: !1 }), (M = D.current) == null || M.call(D, x.startSec, !0));
    }), h.id.startsWith("video.seekPercent") && (T = () => {
      var M;
      const x = Number(h.id.slice(17)) / 10;
      (M = D.current) == null || M.call(D, bs(p ?? de, x), !1);
    }), h.id === "video.jumpToSegmentStart" && R && (T = () => {
      var x;
      return (x = D.current) == null ? void 0 : x.call(D, R.startSec, !1);
    }), h.id === "video.jumpToSegmentEnd" && R && (T = () => {
      var x;
      return (x = D.current) == null ? void 0 : x.call(D, R.endSec ?? R.startSec, !1);
    }), h.id === "video.jumpToVideoStart" && (T = () => {
      var x;
      return (x = D.current) == null ? void 0 : x.call(D, 0, !1);
    }), h.id === "video.jumpToVideoEnd" && (T = () => {
      var x;
      return (x = D.current) == null ? void 0 : x.call(D, de, !1);
    }), h.id.startsWith("video.frame") && (T = () => {
      var S, k;
      const x = h.id.includes("Small") ? "small" : h.id.includes("Medium") ? "medium" : "long", M = I[`${x}FrameStep`] * (h.id.endsWith("Backward") ? -1 : 1);
      (S = v.current) == null || S.pause(), (k = v.current) == null || k.seekBy(Ls(M, A));
    }), h.id.startsWith("navigation.swimlane") && (T = () => {
      const x = h.id.slice(19).toLowerCase(), M = Pr(X, R == null ? void 0 : R.id, x, s);
      M && C(M, { focusEditor: !0, seekToSegment: !1 });
    }), (h.id === "navigation.extendSwimlaneLeft" || h.id === "navigation.extendSwimlaneRight") && (T = () => {
      const x = Rl(
        t,
        R == null ? void 0 : R.id,
        h.id.endsWith("Left") ? "left" : "right"
      );
      x && C(x.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: x.segmentIds
      });
    }), (h.id === "navigation.segmentGroupUp" || h.id === "navigation.segmentGroupDown") && (T = () => {
      const x = Ml(
        B,
        P ?? E,
        h.id.endsWith("Up") ? -1 : 1
      );
      x && j(x);
    }), (h.id === "navigation.previousAtPlayhead" || h.id === "navigation.nextAtPlayhead") && (T = () => {
      const x = ts(J, s, h.id === "navigation.previousAtPlayhead" ? -1 : 1, R == null ? void 0 : R.id);
      x && C(x, { focusEditor: !0, seekToSegment: !1 });
    }), h.id === "navigation.nearestInCurrentSwimlane" && (T = () => {
      const x = _i(
        X,
        R == null ? void 0 : R.id,
        s
      );
      x && C(x, { focusEditor: !0, seekToSegment: !1 });
    }), h.id.includes("Unreviewed") && (T = () => {
      const x = ba(
        X,
        R == null ? void 0 : R.id,
        h.id.startsWith("navigation.previous") ? -1 : 1,
        h.id.endsWith("Global")
      );
      x && C(x, { focusEditor: !0, seekToSegment: !1 });
    }), (h.id === "navigation.nextTouchingPlayhead" || h.id === "navigation.previousTouchingPlayhead") && (T = () => {
      const x = zi(X, s, h.id === "navigation.previousTouchingPlayhead" ? -1 : 1, R == null ? void 0 : R.id);
      x && C(x, { focusEditor: !0, seekToSegment: !1 });
    }), h.id === "navigation.quickSearch" && (T = () => N(!0)), (h.id === "navigation.previousShot" || h.id === "navigation.nextShot") && (T = () => {
      var M;
      const x = Ps(ue, s, h.id === "navigation.previousShot" ? -1 : 1);
      x && ((M = D.current) == null || M.call(D, x.startSec, !1));
    }), h.id === "shot.split" && (T = () => y("split")), h.id === "shot.merge" && (T = () => y("merge")), h.id === "marker.create" && (T = () => a()), h.id === "marker.duplicate" && (T = () => d(!1)), h.id === "marker.duplicateAtPlayhead" && (T = () => d(!0)), h.id === "marker.split" && (T = () => G()), h.id === "marker.editTag" && (T = () => {
      var x;
      if (z.length > 1 && z.some((M) => M.isDerived)) {
        $("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((x = u.data) != null && x.tagReadOnly) {
        $("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      Q(!0);
    }), h.id === "marker.setStart" && R && (T = () => r(s, R.endSec)), h.id === "marker.setEnd" && R && (T = () => r(R.startSec, s)), h.id === "marker.copyTiming" && R && (T = () => {
      $(Jl(R) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), h.id === "marker.pasteTiming" && R && (T = () => {
      const x = Vl();
      if (!x) {
        $("No copied segment timing is available.");
        return;
      }
      r(x.startSec, x.endSec);
    }), h.id === "marker.mergeSelection" && (T = () => f()), h.id === "marker.moveToBin" && (T = () => b()), h.id === "marker.toggleIncorrectExample" && R && (T = () => ne()), h.id === "marker.openIncorrectExamples" && (T = () => Y(!0)), h.id === "markerGroup.toggleCollapse" && P && (T = () => be(P)), h.id === "markerGroup.toggleAll" && (T = () => L((x) => Al(x, B))), h.id === "marker.assignSlots" && (T = () => {
      var x;
      return (x = ge.current) == null ? void 0 : x.click();
    }), h.id === "navigation.zoomIn" && (T = () => ie((x) => Xn(x + 0.5))), h.id === "navigation.zoomOut" && (T = () => ie((x) => Xn(x - 0.5))), h.id === "navigation.resetZoom" && (T = () => ie(1)), h.id === "navigation.centerPlayhead" && (T = () => {
      var x;
      return (x = o.current) == null ? void 0 : x.call(o);
    }), h.id === "layout.growSwimlanes" && (T = () => Se(c.timelineRatio + 0.05)), h.id === "layout.shrinkSwimlanes" && (T = () => Se(c.timelineRatio - 0.05)), h.id === "marker.confirm" && R && (T = () => V("approved")), h.id === "system.publishApproved" && (T = () => w(U.target)), h.id === "marker.reject" && R && (T = () => V("rejected")), h.id === "system.emptyBin" && (T = () => m()), h.id === "system.deleteRejected" && (T = () => l()), T && T();
  }
  function ae(h, U) {
    const T = Mn.find((x) => x.id === h);
    T && Qt(T, i) && _(T, U);
  }
  return { executeShortcutById: ae };
}
function Rd(e, t, r = !1, o = 0, i = "") {
  const [a, s] = F(null), [l, d] = F(null), [c, g] = F(""), [m, u] = F({
    busy: !1,
    reviewState: null,
    error: ""
  }), p = pe(null);
  async function f(w) {
    u({ busy: !0, reviewState: w, error: "" });
    try {
      await ee(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Or(), reviewState: w })
      }), await t(), u({ busy: !1, reviewState: null, error: "" });
    } catch (v) {
      u({
        busy: !1,
        reviewState: null,
        error: v.message || "Unable to import Cove segments."
      });
    }
  }
  async function b() {
    try {
      const w = await ee(`/videos/${e}/analysis-runs`), v = (w == null ? void 0 : w[0]) || null;
      return s(v), (v == null ? void 0 : v.status) === "completed" && p.current !== v.id && (p.current = v.id, await t()), ((v == null ? void 0 : v.status) === "failed" || (v == null ? void 0 : v.status) === "cancelled") && g(v.errorMessage || "Video analysis did not complete."), v;
    } catch (w) {
      return g(w.message || "Unable to load video analysis status."), null;
    }
  }
  async function y(w = null) {
    g("");
    const v = w || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), I = v.includes("omnishotcut") && o > 0;
    if (!(I && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const V = await ee(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: v,
            replaceShotBoundaries: I,
            expectedShotBoundaryFingerprint: I ? i : null
          })
        });
        s(V);
      } catch (V) {
        g(V.message || "Unable to start video analysis.");
      }
  }
  return fe(() => {
    b(), ee("/analysis/status").then((w) => {
      d(w), w.configured || g("");
    }).catch((w) => g(w.message || "Unable to check video analysis readiness."));
  }, [e, r]), fe(() => {
    if ((a == null ? void 0 : a.status) !== "queued" && (a == null ? void 0 : a.status) !== "running") return;
    const w = setInterval(b, 2500);
    return () => clearInterval(w);
  }, [a == null ? void 0 : a.id, a == null ? void 0 : a.status]), {
    analysisError: c,
    analysisRun: a,
    analysisStatus: l,
    importNativeSegments: f,
    nativeImportState: m,
    startFullAnalysis: y
  };
}
const wn = Object.freeze([]);
function Md(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Ed({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var go, po, fo, yo, bo;
  const [g, m] = F(null), [u, p] = F([]), f = pe(null), b = pe(null), y = pe([]), w = pe(null), [v, I] = F(() => dt({})), [V, D] = F(!1), [B, C] = F(vs), [R, E] = F(0), [P, z] = F(null), [L, Y] = F(!1), [N, $] = F(""), [j, Q] = F(""), [ie, ue] = F(""), [ge, G] = F(1), [X, de] = F(_l), [ne, be] = F(0), [Se, A] = F({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [J, _] = F(St), ae = pe(St), [h, U] = F(!1), [T, x] = F(!1), [M, S] = F(!1), [k, W] = F(!1), me = pe(!1), [se, oe] = F(null), [ke, q] = F(null), te = pe(null), [Z, O] = F(!1), [re, ye] = F(""), he = pe(null), ve = pe(null), Me = pe(!1), Ee = pe([]), Ne = pe(!1), [Ie, Ce] = F(Hl), [xe, Oe] = F(null), [De, at] = F(!1), [we, Pe] = F(!1), [qe, je] = F(!1), [Te, Ae] = F(!1), [Ke, it] = F(!1), [Qe, Ye] = F(""), {
    analysisError: wt,
    analysisRun: Nt,
    analysisStatus: lr,
    importNativeSegments: Dn,
    nativeImportState: Xt,
    startFullAnalysis: On
  } = Rd(
    e.video.id,
    o,
    l,
    ((go = e.shotBoundaries) == null ? void 0 : go.length) || 0,
    Nn(e.shotBoundaries || [])
  ), [Rt, dr] = F(!1), [pt, bt] = F(null), [Bt, Mt] = F(l), [It, cr] = F(0), [ht, ur] = F(!1), [en, tn] = F(""), [vt, nn] = F(null), Gt = pe(null), Pn = pe(null), rn = pe(!1), [Et, Kt] = F([]), [on, mr] = F(!1), [Ln, gr] = F(null), an = Ul(), sn = pe(null), ln = pe(null), Dt = pe(null), Fn = pe(s), jn = pe(null), dn = pe(null), cn = pe(null), un = pe(null), tt = pe(null), Bn = pe(null), Ut = pe(null), Gn = pe(null), Kn = pe(null), mn = pe(null), gn = pe(null), xt = pe(-1e12), pr = pe(null), Un = pe(!1), pn = pe(null), [fn, yn] = F({ scrollTop: 0, height: 512 });
  fe(() => {
    if (!Rt || ht || !en) return;
    const K = requestAnimationFrame(() => {
      var ce;
      return (ce = Pn.current) == null ? void 0 : ce.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(K);
  }, [Rt, ht, en]), fe(() => {
    if (!rn.current || Rt || Bt) return;
    const K = requestAnimationFrame(() => {
      var ce;
      (ce = Gt.current) == null || ce.focus({ preventScroll: !0 }), rn.current = !1;
    });
    return () => cancelAnimationFrame(K);
  }, [Rt, Bt]);
  const _e = e.video, Je = e.segments || wn, zn = Ge(() => JSON.stringify({
    segments: Je.map((K) => [
      K.id,
      K.itemId,
      K.nativeSegmentId,
      K.tagId,
      K.startSec,
      K.endSec,
      K.reviewState,
      K.published,
      K.sourceKey,
      K.sourceRunId,
      K.confidence,
      K.revision,
      K.updatedAt
    ]),
    performerSlots: (e.performerSlots || wn).map((K) => [
      K.segmentId,
      K.slotDefinitionId,
      K.performerId,
      K.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [Je, e.performerSlots, e.itemMetadata]);
  fe(() => {
    if (!l) {
      bt(null), Mt(!1);
      return;
    }
    if (P != null) {
      Mt(!0);
      return;
    }
    let K = !0;
    Mt(!0);
    const ce = setTimeout(() => {
      ee(`/videos/${_e.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Re) => {
        K && (bt(Re), tn(""));
      }).catch((Re) => {
        K && (bt(null), tn(Re.message || "Unable to preview derived segments."));
      }).finally(() => {
        K && Mt(!1);
      });
    }, 150);
    return () => {
      K = !1, clearTimeout(ce);
    };
  }, [l, _e.id, zn, It, P]);
  const fr = () => cr((K) => K + 1), ft = e.segmentGroups || wn, Ue = e.performerSlots || wn, _n = l && e.performerSlotsAvailable !== !1, bn = Ge(
    () => (e.performerCandidates || []).filter((K) => K.isVideoPerformer),
    [e.performerCandidates]
  ), hn = e.shotBoundaries || wn, zt = Ge(
    () => Ka(Ue),
    [Ue]
  ), Ct = Ge(
    () => Je.map((K) => {
      const ce = zt.get(K.id) || [];
      return {
        ...K,
        slots: ce,
        assignment: ce.every((Re) => Re.performerId == null) ? Vs(ce, bn) : null
      };
    }).filter((K) => K.slots.length > 0 && K.assignment != null),
    [Je, zt, bn]
  ), yr = Number((po = _e.videoFile) == null ? void 0 : po.frameRate) > 0 ? Number(_e.videoFile.frameRate) : 30;
  function vn() {
    S(!1), requestAnimationFrame(() => {
      var K;
      return (K = tt.current) == null ? void 0 : K.focus({ preventScroll: !0 });
    });
  }
  function br() {
    P == null && (gn.current = null, W(!1), $(""), requestAnimationFrame(() => {
      var K;
      return (K = tt.current) == null ? void 0 : K.focus({ preventScroll: !0 });
    }));
  }
  function xn() {
    D(!1), requestAnimationFrame(() => {
      var K, ce;
      (K = Ut.current) != null && K.isConnected ? Ut.current.focus({ preventScroll: !0 }) : (ce = tt.current) == null || ce.focus({ preventScroll: !0 });
    });
  }
  fe(() => {
    mn.current === g ? (mn.current = null, S(!0)) : S(!1);
  }, [g]), fe(() => {
    var ce;
    if (!M) return;
    const K = (ce = Kn.current) == null ? void 0 : ce.querySelector("input");
    K == null || K.focus({ preventScroll: !0 }), K == null || K.select();
  }, [M, g]), fe(() => {
    var Re, We, nt;
    const K = Lt(
      wr(
        e.segments,
        e.performerSlots || [],
        dt({}),
        l && B,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), ce = ((Re = e.segments.find((Vn) => Vn.id === s)) == null ? void 0 : Re.id) ?? ((We = ya(K)) == null ? void 0 : We.id) ?? null;
    m(ce), p(ce == null ? [] : [ce]), b.current = ce, y.current = [], Oe(ut(K, ce)), I(dt({})), D(!1), gn.current = null, W(!1), G(1), $(""), _(St), ae.current = St, U(!1), (nt = tt.current) == null || nt.focus({ preventScroll: !0 });
  }, [_e.id, s]), fe(() => {
    const K = new AbortController();
    return ee(`/videos/${_e.id}/incorrect-examples`, { signal: K.signal }).then(Kt).catch((ce) => {
      ce.name !== "AbortError" && Kt([]);
    }), () => K.abort();
  }, [_e.id, d == null ? void 0 : d.effectiveMode]), fe(() => {
    const K = new AbortController();
    return ee(`/videos/${_e.id}/history`, { signal: K.signal }).then((ce) => {
      const Re = ce || St;
      ae.current = Re, _(Re);
    }).catch((ce) => {
      ce.name !== "AbortError" && $(ce.message || "Unable to load editor history.");
    }), () => K.abort();
  }, [_e.id]), fe(() => {
    Wl(X);
  }, [X.timelineRatio, X.markerRailOpen, X.detailWidth, X.markerRailWidth, X.swimlaneTitleWidth]), fe(() => {
    ql(Ie);
  }, [Ie]), fe(() => {
    xs(B);
  }, [B]), fe(() => {
    const K = dn.current;
    if (!a || !K || typeof ResizeObserver > "u") return;
    const ce = () => {
      const We = K.clientHeight;
      be(We), de((nt) => {
        const Vn = Ur(nt.timelineRatio, We);
        return Vn === nt.timelineRatio ? nt : { ...nt, timelineRatio: Vn };
      });
    }, Re = new ResizeObserver(ce);
    return Re.observe(K), ce(), () => Re.disconnect();
  }, [a]), fe(() => {
    if (!an || typeof ResizeObserver > "u") return;
    const K = un.current, ce = cn.current;
    if (!K || !ce) return;
    const Re = () => A({
      workspace: K.clientWidth,
      focusRow: ce.clientWidth,
      focusRowHeight: ce.clientHeight
    }), We = new ResizeObserver(Re);
    return We.observe(K), We.observe(ce), Re(), () => We.disconnect();
  }, [an, X.markerRailOpen]);
  const ct = Ge(
    () => Ko(
      wr(
        Je,
        Ue,
        v,
        l && B,
        ft
      ),
      Et,
      !0
    ),
    [
      Je,
      Ue,
      v,
      B,
      ft,
      l,
      Et
    ]
  ), hr = Object.fromEntries(Xe.map((K) => [K, ct.filter((ce) => ce.reviewState === K).length])), _t = Ko(
    wr(
      Je,
      Ue,
      { ...v, reviewStates: Xe },
      l && B,
      ft
    ),
    Et,
    !0
  ), Ht = Object.fromEntries(Xe.map((K) => [K, _t.filter((ce) => ce.reviewState === K).length])), H = [...new Set(Je.map((K) => K.sourceKey).filter(Boolean))].sort((K, ce) => gt(K).localeCompare(gt(ce))), Be = is(
    v,
    l && B
  ), ze = Ge(
    () => Lt(ct, ft, Ue),
    [ct, ft, Ue]
  ), le = ds(
    ze,
    g,
    s
  ), st = hs(ct, u), qt = !l && st.length > 0 && st.every((K) => K.nativeSegmentId != null), Hn = ct.map((K) => K.id), Za = Hn.join("|");
  f.current = (le == null ? void 0 : le.id) ?? null;
  const Yr = zt.get(le == null ? void 0 : le.id) || [], Xa = qr(Yr), Qr = Ge(
    () => Cl(ze, u),
    [ze, u]
  ), vr = Ge(() => Wr(ze), [ze]), Sn = Ge(
    () => Nl(vr, Ie),
    [vr, Ie]
  ), ei = Ge(
    () => Ua(
      Sn.rows,
      fn.scrollTop,
      fn.height
    ),
    [Sn, fn]
  ), ti = Ge(
    () => Tl(ze, Ie),
    [ze, Ie]
  ), Wt = le ? ut(ze, le.id) : null, xr = ft.length > 0 ? vr.map((K) => K.key) : [], ni = xr.join("|"), qn = Math.max(
    0,
    Number((fo = _e.videoFile) == null ? void 0 : fo.duration) || 0,
    ...Je.map((K) => Number(K.endSec ?? K.startSec) || 0)
  ), Zr = Number((yo = _e.videoFile) == null ? void 0 : yo.duration) > 0 ? Number(_e.videoFile.duration) : null;
  J.actions;
  const ri = Ia();
  fe(() => {
    const K = g === er ? g : (le == null ? void 0 : le.id) ?? null;
    K !== g && m(K);
  }, [le, g]), fe(() => {
    p((K) => {
      const ce = gs(
        K,
        Hn,
        (le == null ? void 0 : le.id) ?? null
      );
      return ce.length === K.length && ce.every((Re, We) => Re === K[We]) ? K : ce;
    });
  }, [Za, le == null ? void 0 : le.id]);
  const Vt = (le == null ? void 0 : le.itemId) == null ? null : ((bo = e.itemMetadata) == null ? void 0 : bo[le.itemId]) || null, oi = {
    key: (le == null ? void 0 : le.itemId) != null ? `item:${le.itemId}` : (le == null ? void 0 : le.nativeSegmentId) != null ? `native:${le.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (Vt == null ? void 0 : Vt.provenance) || (le == null ? void 0 : le.fieldProvenance) || [] : []
  }, Sr = (le == null ? void 0 : le.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (Vt == null ? void 0 : Vt.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  fe(() => {
    Q(le == null ? "" : String(le.startSec)), ue((le == null ? void 0 : le.endSec) == null ? "" : String(le.endSec));
  }, [le == null ? void 0 : le.id, le == null ? void 0 : le.startSec, le == null ? void 0 : le.endSec]), fe(() => {
    Wt && Ce((K) => Ha(K, Wt));
  }, [_e.id, s, Wt]), fe(() => {
    Oe((K) => El(xr, K, Wt));
  }, [_e.id, ni, Wt]), fe(() => {
    if (!X.markerRailOpen || (le == null ? void 0 : le.id) == null) return;
    const K = pn.current, ce = Sn.rows.find((nt) => nt.kind === "segment" && nt.segment.id === le.id);
    if (!K || !ce) return;
    const Re = ce.top + ce.height;
    let We = K.scrollTop;
    ce.top < K.scrollTop ? We = ce.top : Re > K.scrollTop + K.clientHeight && (We = Math.max(0, Re - K.clientHeight)), We !== K.scrollTop && (K.scrollTop = We), yn({ scrollTop: We, height: K.clientHeight });
  }, [le == null ? void 0 : le.id, Sn, X.markerRailOpen]), fe(() => {
    const K = pn.current;
    if (!X.markerRailOpen || !K) return;
    const ce = () => yn({
      scrollTop: K.scrollTop,
      height: K.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      ce();
      return;
    }
    const Re = new ResizeObserver(ce);
    return Re.observe(K), ce(), () => Re.disconnect();
  }, [X.markerRailOpen]);
  const { revealSegmentGroupForSelection: Xr, replaceSegmentSelection: ai, selectSegment: eo, selectSegmentCollection: ii, selectAllVideoSegments: si } = Id({
    allSwimlanes: ze,
    editorRef: tt,
    performerSlots: Ue,
    seekRef: sn,
    segmentGroups: ft,
    segments: Je,
    selectedSegmentId: g,
    selectedSegmentIds: u,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: y,
    setCollapsedSegmentGroups: Ce,
    setEditorFilters: I,
    setHideDerivedSegments: C,
    setSaveMessage: $,
    setSelectedSegmentGroupKey: Oe,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: p
  }), { acceptHistory: kr, recordHistoryAction: Wn, mutateSegment: li, completeReview: di, createSegment: to, splitSegment: no, duplicateSegment: ro, saveTiming: ci, applyShortcutTiming: ui } = Kl({
    compatibilityMode: l,
    currentTime: R,
    detail: e,
    editorFilters: v,
    endInput: ie,
    hideDerivedSegments: B,
    historyRef: ae,
    mediaDuration: Zr,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: xt,
    pendingDuplicateRef: pr,
    pendingFirstSegmentStartSecRef: gn,
    pendingTagEditSegmentIdRef: mn,
    replaceSegmentSelection: ai,
    savingSegmentId: P,
    segments: Je,
    selectedSegment: le,
    selectedSegmentIdRef: f,
    selectedSegments: st,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: y,
    setEditorFilters: I,
    setFirstSegmentTagOpen: W,
    setHideDerivedSegments: C,
    setHistory: _,
    setHistoryOpen: U,
    setPublishApprovedError: ye,
    setSaveMessage: $,
    setSavingSegmentId: z,
    setSelectedSegmentGroupKey: Oe,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: p,
    startInput: j,
    timelineDuration: qn,
    video: _e
  });
  function oo(K = null) {
    var We;
    if (!l || P != null || !Je.some((nt) => !nt.published && nt.reviewState === "approved")) return;
    const ce = ((We = tt.current) == null ? void 0 : We.ownerDocument) ?? document, Re = ce.activeElement === ce.body ? null : ce.activeElement;
    ve.current = K != null && K.isConnected && K !== ce.body ? K : Re, ye(""), O(!0);
  }
  function ao() {
    P == null && (O(!1), ye(""), requestAnimationFrame(() => {
      Md(
        ve.current,
        tt.current
      ), ve.current = null;
    }));
  }
  async function mi() {
    await di() && ao();
  }
  const { closeMergeConfirmation: gi, mergeSelectedSwimlane: io, saveSelectedReviewState: so } = Cd({
    acceptHistory: kr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: w,
    historyRef: ae,
    mergeSavingRef: me,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    pendingReviewStateRef: Ee,
    recordHistoryAction: Wn,
    revealSegmentGroupForSelection: Xr,
    reviewSavingRef: Me,
    savingSegmentId: P,
    selectedGroups: Qr,
    selectedSegment: le,
    selectedSegmentIdRef: f,
    selectedSegments: st,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: y,
    setMergeConfirmation: oe,
    setSaveMessage: $,
    setSavingSegmentId: z,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: p,
    video: _e
  }), pi = (K) => {
    Ee.current = Ms(
      Ee.current,
      K
    );
  };
  fe(() => {
    if (P != null || Me.current) return;
    let K = !1;
    for (; Ee.current.length > 0; ) {
      const ce = Ee.current.shift(), Re = As(ce, Je);
      if (!Re) {
        K = !0;
        continue;
      }
      so(
        Re.requestedState,
        Re.selectedSegments,
        Re.selectedSegment
      );
      return;
    }
    K && $("The queued review could not find its segment after refreshing.");
  }, [P, Je]);
  const { toggleIncorrectExample: fi, removeIncorrectExample: yi, captureTrainingExport: bi, deleteRejectedSegments: lo, autoAssignPerformers: hi, previewDerivedSegments: vi, closeMaterializeDialog: xi, materializeDerivedSegments: Si, saveTag: ki, moveToBin: wi, emptyRecyclingBin: Ni } = $d({
    acceptHistory: kr,
    allSwimlanes: ze,
    autoAssignCandidates: Ct,
    autoAssigning: Ke,
    binEmptyingRef: Ne,
    canMoveSelectionToBin: qt,
    closeTagEditing: vn,
    compatibilityMode: l,
    detail: e,
    editorRef: tt,
    exportingExamples: on,
    incorrectExamples: Et,
    lineage: Sr,
    materializeButtonRef: Gt,
    materializePreview: pt,
    materializeRestoreFocusRef: rn,
    materializing: ht,
    mutateSegment: li,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: Wn,
    refreshMaterializationPreview: fr,
    removingExampleId: Ln,
    revealSegmentGroupForSelection: Xr,
    savingSegmentId: P,
    segments: Je,
    selectedSegment: le,
    selectedSegmentIdRef: f,
    selectedSegments: st,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: y,
    setAutoAssignError: Ye,
    setAutoAssignOpen: Ae,
    setAutoAssigning: it,
    setExportingExamples: mr,
    setIncorrectExamples: Kt,
    setMaterializeError: tn,
    setMaterializeLoading: Mt,
    setMaterializeOpen: dr,
    setMaterializePreview: bt,
    setMaterializing: ur,
    setRemovingExampleId: gr,
    setRejectedDeletionPreview: q,
    setSaveMessage: $,
    setSavingSegmentId: z,
    setSelectedSegmentGroupKey: Oe,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: p,
    video: _e
  }), { restoreHistoryTarget: Ii, updateTimelineRatio: co, handleSeparatorPointerDown: Ci, handleSeparatorPointerMove: $i, handleSeparatorKeyDown: Ti, panelWidthMaximum: uo, panelSeparatorProps: Ai, toggleSegmentRail: Ri, toggleSegmentGroup: mo, mutateShotBoundary: Mi } = Td({
    acceptHistory: kr,
    compatibilityMode: l,
    currentTime: R,
    detail: e,
    editorLayout: X,
    focusRowRef: cn,
    history: J,
    historyRef: ae,
    historySaving: T,
    horizontalLayoutSize: Se,
    mediaStackHeight: ne,
    mediaStackRef: dn,
    onDetailChange: t,
    onReload: o,
    railToggleRef: Bn,
    recordHistoryAction: Wn,
    savingSegmentId: P,
    savingShot: L,
    savingShotRef: Un,
    setCollapsedSegmentGroups: Ce,
    setEditorLayout: de,
    setHistorySaving: x,
    setSaveMessage: $,
    setSavingSegmentId: z,
    setSavingShot: Y,
    shotBoundaries: hn,
    timelineDuration: qn,
    video: _e,
    workspaceRef: un
  }), { executeShortcutById: Ei } = Ad({
    allSwimlanes: ze,
    applyShortcutTiming: ui,
    centerTimelineRef: jn,
    compatibilityMode: l,
    createSegment: to,
    currentTime: R,
    deleteRejectedSegments: lo,
    duplicateSegment: ro,
    editorLayout: X,
    editorRef: tt,
    emptyRecyclingBin: Ni,
    lineage: Sr,
    mediaDuration: Zr,
    mergeSelectedSwimlane: io,
    moveToBin: wi,
    mutateShotBoundary: Mi,
    openPublishApprovedDialog: oo,
    playbackControlsRef: ln,
    playbackShortcutConfig: ri,
    saveSelectedReviewState: so,
    seekRef: sn,
    segmentGroupKeys: xr,
    selectSegment: eo,
    selectedSegment: le,
    selectedSegmentGroupForSegment: Wt,
    selectedSegmentGroupKey: xe,
    selectedSegments: st,
    setCollapsedSegmentGroups: Ce,
    setIncorrectExamplesOpen: je,
    setQuickSearchOpen: Pe,
    setSaveMessage: $,
    setSelectedSegmentGroupKey: Oe,
    setTagEditing: S,
    setTimelineZoom: G,
    shotBoundaries: hn,
    slotButtonRef: Gn,
    splitSegment: no,
    swimlanes: ti,
    timelineDuration: qn,
    toggleIncorrectExample: fi,
    toggleSegmentGroup: mo,
    updateTimelineRatio: co,
    videoFrameRate: yr,
    visibleSegments: ct
  });
  Dt.current = Ei;
  const Di = Ge(() => Mn.map((K) => ({
    id: K.id,
    enabled: Qt(K, l),
    surface: "local",
    action: (ce) => {
      var Re;
      return (Re = Dt.current) == null ? void 0 : Re.call(Dt, K.id, ce);
    }
  })), [l]);
  oa(Br, Di);
  const Oi = Kr(ne), Pi = Pt(X.markerRailWidth, uo("markerRailWidth")), Li = Pt(X.detailWidth, uo("detailWidth"));
  return n(Nd, {
    activeFilterCount: Be,
    allSwimlanes: ze,
    analysisError: wt,
    analysisRun: Nt,
    analysisStatus: lr,
    approvalFacetCounts: Ht,
    autoAssignCandidates: Ct,
    autoAssignError: Qe,
    autoAssignOpen: Te,
    autoAssignPerformers: hi,
    autoAssigning: Ke,
    captureTrainingExport: bi,
    cancelQueuedReviewsForSegments: pi,
    removeIncorrectExample: yi,
    rejectedDeletionPreview: ke,
    centerTimelineRef: jn,
    closeEditorFilters: xn,
    closeFirstSegmentTagDialog: br,
    closeMaterializeDialog: xi,
    closeMergeConfirmation: gi,
    closePublishApprovedDialog: ao,
    closeTagEditing: vn,
    collapsedSegmentGroups: Ie,
    compatibilityMode: l,
    configuringTag: vt,
    createSegment: to,
    currentTime: R,
    deleteRejectedSegments: lo,
    detail: e,
    detailPanelRef: w,
    detailWidth: Li,
    duplicateSegment: ro,
    editorFilters: v,
    editorLayout: X,
    editorRef: tt,
    exportingExamples: on,
    filtersButtonRef: Ut,
    filtersOpen: V,
    firstSegmentTagOpen: k,
    focusRowRef: cn,
    handleSeparatorKeyDown: Ti,
    handleSeparatorPointerDown: Ci,
    handleSeparatorPointerMove: $i,
    hideDerivedSegments: B,
    history: J,
    historyOpen: h,
    historySaving: T,
    horizontalLayoutSize: Se,
    importNativeSegments: Dn,
    incorrectExamples: Et,
    incorrectExamplesOpen: qe,
    removingExampleId: Ln,
    lineage: Sr,
    markerRailWidth: Pi,
    materializeButtonRef: Gt,
    materializeCancelButtonRef: Pn,
    materializeDerivedSegments: Si,
    materializeError: en,
    materializeLoading: Bt,
    materializeOpen: Rt,
    materializePreview: pt,
    materializing: ht,
    mediaStackRef: dn,
    mergeCancelButtonRef: te,
    mergeConfirmation: se,
    mergeSavingRef: me,
    mergeSelectedSwimlane: io,
    nativeImportState: Xt,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: oo,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: Ai,
    pendingInitialSeekRef: Fn,
    performerSlots: Ue,
    performerSlotsAvailable: _n,
    playbackControlsRef: ln,
    previewDerivedSegments: vi,
    provenance: oi,
    provenanceSources: H,
    publishApprovedCancelButtonRef: he,
    publishApprovedDrafts: mi,
    publishApprovedError: re,
    publishApprovedOpen: Z,
    quickSearchOpen: we,
    railScrollRef: pn,
    railToggleRef: Bn,
    recordHistoryAction: Wn,
    restoreHistoryTarget: Ii,
    saveMessage: N,
    setSaveMessage: $,
    saveTag: ki,
    saveTiming: ci,
    savingSegmentId: P,
    setSavingSegmentId: z,
    seekRef: sn,
    segmentGroups: ft,
    segmentRailLayout: Sn,
    segments: Je,
    selectAllVideoSegments: si,
    selectSegment: eo,
    selectSegmentCollection: ii,
    selectedGroups: Qr,
    selectedPerformerSlots: Yr,
    selectedSegment: le,
    selectedSegmentGroupKey: xe,
    selectedSegmentIds: u,
    selectedSegments: st,
    selectedSlotStatus: Xa,
    setAutoAssignError: Ye,
    setAutoAssignOpen: Ae,
    setConfiguringTag: nn,
    setCurrentTime: E,
    setEditorFilters: I,
    setEditorLayout: de,
    setFiltersOpen: D,
    setHideDerivedSegments: C,
    setHistoryOpen: U,
    setIncorrectExamplesOpen: je,
    setQuickSearchOpen: Pe,
    setRejectedDeletionPreview: q,
    setRailViewport: yn,
    setSelectedSegmentGroupKey: Oe,
    setSelectedSegmentId: m,
    setShortcutsOpen: at,
    setTimelineZoom: G,
    shotBoundaries: hn,
    shortcutsOpen: De,
    slotButtonRef: Gn,
    splitLayout: a,
    splitSegment: no,
    startFullAnalysis: On,
    tagEditing: M,
    tagSearchRef: Kn,
    timelineDuration: qn,
    timelineRatioBounds: Oi,
    timelineZoom: ge,
    toggleSegmentGroup: mo,
    toggleSegmentRail: Ri,
    updateTimelineRatio: co,
    video: _e,
    videoPerformers: bn,
    visibleCounts: hr,
    visibleSegmentRailRows: ei,
    visibleSegments: ct,
    wideLayout: an,
    workspaceRef: un
  });
}
const Dd = /* @__PURE__ */ new Set(["queued", "running"]);
async function Jo(e, t, r = 4) {
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
function Yo(e, t) {
  return { videoId: e, error: (t == null ? void 0 : t.message) || String(t || "Unable to start Full Scan.") };
}
function Od() {
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
async function Pd(e, t, r, o) {
  const i = [...new Set(e.map(Number).filter((p) => Number.isInteger(p) && p > 0))], a = [...new Set(t)].filter((p) => ["aiTagging", "omnishotcut"].includes(p));
  if (i.length === 0 || a.length === 0)
    return { queuedIds: [], failed: [], cancelled: !1 };
  const s = a.includes("omnishotcut"), l = await Jo(i, async (p) => {
    try {
      const [f, b] = await Promise.all([
        r(`/videos/${p}/analysis-runs`),
        s ? r(`/videos/${p}/editor`) : null
      ]);
      if ((f || []).some((w) => Dd.has(w == null ? void 0 : w.status)))
        throw new Error("A Full Scan is already queued or running.");
      const y = (b == null ? void 0 : b.shotBoundaries) || [];
      return { videoId: p, shotBoundaries: y };
    } catch (f) {
      return Yo(p, f);
    }
  }), d = l.filter((p) => !p.error), c = l.filter((p) => p.error), g = d.filter((p) => p.shotBoundaries.length > 0), m = g.reduce((p, f) => p + f.shotBoundaries.length, 0);
  if (m > 0 && !o(
    `Replace ${m} existing shot ${m === 1 ? "boundary" : "boundaries"} across ${g.length} selected ${g.length === 1 ? "video" : "videos"} when these scans succeed? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
  )) return { queuedIds: [], failed: c, cancelled: !0 };
  const u = await Jo(d, async ({ videoId: p, shotBoundaries: f }) => {
    const b = s && f.length > 0;
    try {
      return await r(`/videos/${p}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: a,
          replaceShotBoundaries: b,
          expectedShotBoundaryFingerprint: b ? Nn(f) : null
        })
      }), { videoId: p };
    } catch (y) {
      return Yo(p, y);
    }
  });
  return {
    queuedIds: u.filter((p) => !p.error).map((p) => p.videoId),
    failed: [...c, ...u.filter((p) => p.error)],
    cancelled: !1
  };
}
function Ld(e = [], t = []) {
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
function Fd(e = [], t = "", r = "all") {
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
function Ze(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function jd(e = [], t = []) {
  var p;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((f, b) => (f.sortOrder ?? 0) - (b.sortOrder ?? 0) || Number(f.id) - Number(b.id)).forEach((f, b) => {
    [...f.tags || []].sort((y, w) => (y.sortOrder ?? 0) - (w.sortOrder ?? 0) || Number(y.tagId) - Number(w.tagId)).forEach((y, w) => r.set(Number(y.tagId), {
      key: `group:${f.id}`,
      id: f.id,
      name: f.name,
      sortOrder: f.sortOrder ?? b,
      tagSortOrder: y.sortOrder ?? w
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(f, b) {
    const y = Number(f);
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
  e.forEach((f) => {
    const b = i(f.sourceTagId, f.sourceTagName), y = i(f.derivedTagId, f.derivedTagName);
    b.outgoingRuleCount++, y.incomingRuleCount++;
    const w = `${b.tagId}:${y.tagId}`;
    a.has(w) || a.set(w, {
      id: w,
      sourceTagId: b.tagId,
      derivedTagId: y.tagId,
      rules: [],
      edgeCount: 0
    });
    const v = a.get(w);
    v.rules.push(f), v.edgeCount += Number(f.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((f) => [f.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((f) => {
    var b, y;
    (b = d.get(f.sourceTagId)) == null || b.add(f.derivedTagId), (y = d.get(f.derivedTagId)) == null || y.add(f.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), g = [];
  for (const f of s) {
    if (c.has(f.tagId)) continue;
    const b = [f.tagId], y = [];
    for (c.add(f.tagId); b.length > 0; ) {
      const C = b.shift();
      y.push(C);
      for (const R of d.get(C) || [])
        c.has(R) || (c.add(R), b.push(R));
    }
    const w = new Set(y), v = y.map((C) => o.get(C)), I = l.filter((C) => w.has(C.sourceTagId) && w.has(C.derivedTagId)), V = I.flatMap((C) => C.rules), D = v.filter((C) => C.outgoingRuleCount === 0).sort((C, R) => Ze(C.name, R.name)), B = D.length > 0 ? D : [...v].sort((C, R) => Ze(C.name, R.name));
    g.push({
      id: [...y].sort((C, R) => C - R).join(":"),
      label: B.length > 1 ? `${B[0].name} + ${B.length - 1}` : ((p = B[0]) == null ? void 0 : p.name) || "Derivation component",
      nodes: v,
      connections: I,
      rules: V,
      segmentGroupKeys: [...new Set(v.map((C) => C.segmentGroupKey))],
      materializedEdgeCount: V.reduce(
        (C, R) => C + (Number(R.edgeCount) || 0),
        0
      )
    });
  }
  g.sort((f, b) => b.rules.length - f.rules.length || Ze(f.label, b.label));
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
  }), g.forEach((f) => {
    f.nodes.forEach((b) => {
      var y;
      return (y = m.get(b.segmentGroupKey)) == null ? void 0 : y.componentIds.add(f.id);
    }), f.rules.forEach((b) => {
      var y, w;
      (y = m.get(o.get(Number(b.sourceTagId)).segmentGroupKey)) == null || y.ruleIds.add(b.id), (w = m.get(o.get(Number(b.derivedTagId)).segmentGroupKey)) == null || w.ruleIds.add(b.id);
    });
  });
  const u = [...m.values()].sort((f, b) => f.sortOrder - b.sortOrder || Ze(f.name, b.name)).map((f) => ({
    ...f,
    ruleCount: f.ruleIds.size,
    componentCount: f.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: g,
    segmentGroups: u
  };
}
function Bd(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const g = new Map(e.nodes.map((E) => [E.tagId, /* @__PURE__ */ new Set()])), m = new Map(e.nodes.map((E) => [E.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((E) => {
    var P, z;
    (P = g.get(E.sourceTagId)) == null || P.add(E.derivedTagId), (z = m.get(E.derivedTagId)) == null || z.add(E.sourceTagId);
  });
  const u = new Map(e.nodes.map((E) => {
    var P;
    return [
      E.tagId,
      ((P = m.get(E.tagId)) == null ? void 0 : P.size) || 0
    ];
  })), p = new Map(e.nodes.map((E) => [E.tagId, 0])), f = e.nodes.filter((E) => u.get(E.tagId) === 0).sort((E, P) => Ze(E.name, P.name)).map((E) => E.tagId), b = /* @__PURE__ */ new Set();
  for (; f.length > 0; ) {
    const E = f.shift();
    if (!b.has(E)) {
      b.add(E);
      for (const P of g.get(E) || [])
        p.set(P, Math.max(p.get(P) || 0, (p.get(E) || 0) + 1)), u.set(P, u.get(P) - 1), u.get(P) === 0 && f.push(P);
    }
  }
  b.size !== e.nodes.length && e.nodes.filter((E) => !b.has(E.tagId)).sort((E, P) => Ze(E.name, P.name)).forEach((E) => p.set(E.tagId, 0));
  const y = Math.max(0, ...p.values()), w = Math.max(
    t,
    240 + y * 296
  ), v = /* @__PURE__ */ new Map();
  e.nodes.forEach((E) => {
    v.has(E.segmentGroupKey) || v.set(E.segmentGroupKey, {
      key: E.segmentGroupKey,
      id: E.segmentGroupId,
      name: E.segmentGroupName,
      sortOrder: E.segmentGroupSortOrder,
      nodes: []
    }), v.get(E.segmentGroupKey).nodes.push(E);
  });
  const I = [...v.values()].sort((E, P) => E.sortOrder - P.sortOrder || Ze(E.name, P.name));
  let V = 28;
  const D = [], B = I.map((E) => {
    const P = /* @__PURE__ */ new Map();
    E.nodes.forEach(($) => {
      const j = p.get($.tagId) || 0;
      P.has(j) || P.set(j, []), P.get(j).push($);
    });
    for (const $ of P.values())
      $.sort((j, Q) => j.segmentGroupTagSortOrder - Q.segmentGroupTagSortOrder || Ze(j.name, Q.name));
    const z = Math.max(1, ...[...P.values()].map(($) => $.length)), L = z * 58 + (z - 1) * 18, Y = 70 + L, N = {
      ...E,
      x: 12,
      y: V,
      width: w - 24,
      height: Y
    };
    for (const [$, j] of P.entries()) {
      const Q = j.length * 58 + Math.max(0, j.length - 1) * 18, ie = (L - Q) / 2;
      j.forEach((ue, ge) => D.push({
        ...ue,
        rank: $,
        x: 28 + $ * 296,
        y: V + 34 + 18 + ie + ge * 76,
        width: 184,
        height: 58
      }));
    }
    return V += Y + 16, N;
  }), C = new Map(D.map((E) => [E.tagId, E])), R = e.connections.map((E) => {
    const P = C.get(E.sourceTagId), z = C.get(E.derivedTagId), L = P.x + P.width, Y = P.y + P.height / 2, N = z.x, $ = z.y + z.height / 2, j = Math.max(48, (N - L) * 0.48);
    return {
      ...E,
      path: `M ${L} ${Y} C ${L + j} ${Y}, ${N - j} ${$}, ${N} ${$}`
    };
  });
  return {
    width: w,
    height: Math.max(r, V - 16 + 28),
    nodes: D,
    connections: R,
    groups: B
  };
}
function Gd(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Bd(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), g = 20, m = o, u = c.nodes.map((f) => ({
      ...f,
      x: f.x + g,
      y: f.y + m
    })), p = new Map(u.map((f) => [f.tagId, f]));
    a.push(...u), l.push(...c.groups.map((f) => ({
      ...f,
      componentId: d.id,
      x: f.x + g,
      y: f.y + m
    }))), s.push(...c.connections.map((f) => {
      const b = p.get(f.sourceTagId), y = p.get(f.derivedTagId), w = b.x + b.width, v = b.y + b.height / 2, I = y.x, V = y.y + y.height / 2, D = Math.max(48, (I - w) * 0.48);
      return {
        ...f,
        componentId: d.id,
        path: `M ${w} ${v} C ${w + D} ${v}, ${I - D} ${V}, ${I} ${V}`
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
function Qo(e, t = []) {
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
function Kd(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function Ud(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: m, emptyDraft: u, graph: p, layout: f, listSort: b, materializationOffer: y, materializeOutgoingRules: w, materializeRule: v, message: I, normalizedQuery: V, query: D, refreshConfiguredTag: B, revealEditor: C, rules: R, save: E, segmentGroupKey: P, selectedNode: z, selectedRule: L, selection: Y, setConfiguringTag: N, setDraft: $, setListSort: j, setMaterializationOffer: Q, setQuery: ie, setSegmentGroupKey: ue, setSelection: ge, setView: G, sortedVisibleRules: X, sourceSlots: de, sourceSlotsLoading: ne, updateMapping: be, updateTag: Se, view: A, visibleComponents: J, visibleRules: _ } = e;
  function ae(M) {
    const S = p.nodes.find((W) => W.tagId === Number(M.sourceTagId)), k = p.nodes.find((W) => W.tagId === Number(M.derivedTagId));
    return (S == null ? void 0 : S.segmentGroupKey) === (k == null ? void 0 : k.segmentGroupKey) ? S.segmentGroupKey : "cross-group";
  }
  function h() {
    return n("div", { key: "editor", ref: m, className: "space-y-4 p-4" }, [
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
          onClick: () => $(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      n("div", { key: "tags", className: "space-y-3" }, [
        n("div", { key: "source", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Source tag (specific)"),
            n(Cn, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (M, S) => Se("source", M, S == null ? void 0 : S.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !ne && de.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (M) => N({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: M.currentTarget
              }),
              className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
            }, "Configure source tag")
          ]) : null
        ]),
        n("div", { key: "derived", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Derived tag (general)"),
            n(Cn, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (M, S) => Se("derived", M, S == null ? void 0 : S.label),
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
              onClick: (M) => N({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: M.currentTarget
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
            disabled: r || de.length === 0 || s.length === 0,
            onClick: () => $((M) => ({
              ...M,
              slotMappings: [...M.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
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
          ...d.slotMappings.map((M, S) => n("div", { key: S, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: M.sourceSlotDefinitionId,
              disabled: r,
              onChange: (k) => be(S, "sourceSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${S + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...de.map((k) => n("option", { key: k.id, value: k.id }, et(k)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: M.derivedSlotDefinitionId,
              disabled: r,
              onChange: (k) => be(S, "derivedSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${S + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((k) => n("option", { key: k.id, value: k.id }, et(k)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => $((k) => ({
                ...k,
                slotMappings: k.slotMappings.filter((W, me) => me !== S)
              })),
              className: `${o} shrink-0 text-red-300`,
              "aria-label": `Remove performer slot mapping ${S + 1}`,
              title: "Remove mapping"
            }, "🗑")
          ]))
        ])
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "save",
          type: "button",
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((M) => !M.sourceSlotDefinitionId || !M.derivedSlotDefinitionId),
          onClick: E,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => $(null), className: o }, "Cancel")
      ])
    ]);
  }
  function U() {
    if (z) {
      const k = _.filter((se) => Number(se.derivedTagId) === z.tagId), W = _.filter((se) => Number(se.sourceTagId) === z.tagId), me = (se, oe, ke) => n("div", {
        key: se.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, oe),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${se.sourceTagName} → ${se.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          ke ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => v(se),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => g(se, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(se),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, z.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, z.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${z.incomingRuleCount} incoming · ${z.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (se) => N({
            tagId: z.tagId,
            tagName: z.name,
            trigger: se.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        W.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => w(z, W),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${W.length})`) : null,
        W.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...W.map((se) => me(se, "Derives", !0))
        ]) : null,
        k.length ? n("details", {
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
              k.length
            )
          ]),
          n(
            "div",
            { key: "rules", className: "space-y-2 border-t border-border p-2" },
            k.map((se) => me(se, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!L)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const M = p.nodes.find((k) => k.tagId === Number(L.sourceTagId)), S = p.nodes.find((k) => k.tagId === Number(L.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (M == null ? void 0 : M.segmentGroupName) || "Ungrouped"),
          (M == null ? void 0 : M.segmentGroupKey) !== (S == null ? void 0 : S.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(S == null ? void 0 : S.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${L.sourceTagName} → ${L.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${L.edgeCount} materialized lineage edge${L.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (y == null ? void 0 : y.ruleId) === L.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => v(L, y),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => Q(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        L.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : L.slotMappings.map((k, W) => n("div", {
          key: `${k.sourceSlotDefinitionId}:${k.derivedSlotDefinitionId}`,
          className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
        }, [
          n(
            "span",
            { key: "source", className: "truncate text-foreground", title: k.sourceSlotLabel || "Unnamed slot" },
            k.sourceSlotLabel || "Unnamed slot"
          ),
          n("span", { key: "arrow", className: "text-secondary" }, "→"),
          n(
            "span",
            { key: "derived", className: "truncate text-foreground", title: k.derivedSlotLabel || "Unnamed slot" },
            k.derivedSlotLabel || "Unnamed slot"
          )
        ]))
      ]),
      n("dl", { key: "metadata", className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-xs" }, [
        n("dt", { key: "created-label", className: "text-secondary" }, "Created"),
        n(
          "dd",
          { key: "created", className: "text-right text-foreground" },
          L.createdAt ? new Date(L.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          L.updatedAt ? new Date(L.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => v(L),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(L),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(L),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function T() {
    if (J.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, V ? "No derivation relationships match your search." : "No derivation rules.");
    const M = z == null ? void 0 : z.tagId, S = /* @__PURE__ */ new Set();
    return z && (S.add(z.tagId), f.connections.forEach((k) => {
      (k.sourceTagId === z.tagId || k.derivedTagId === z.tagId) && (S.add(k.sourceTagId), S.add(k.derivedTagId));
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
        style: { width: `${f.width}px`, height: `${f.height}px` },
        "aria-label": "Derivation rule graph"
      }, [
        ...f.groups.map((k) => n("div", {
          key: `group:${k.componentId}:${k.key}`,
          className: `absolute rounded-xl border ${P === k.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
          style: {
            left: `${k.x}px`,
            top: `${k.y}px`,
            width: `${k.width}px`,
            height: `${k.height}px`
          }
        }, n("div", {
          className: "absolute left-3 top-2 max-w-[16rem] truncate text-[11px] font-semibold uppercase tracking-wide text-secondary",
          title: k.name
        }, k.name))),
        n("svg", {
          key: "edges",
          className: "pointer-events-none absolute inset-0 overflow-visible",
          width: f.width,
          height: f.height,
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
          ...f.connections.map((k) => {
            const W = M === k.sourceTagId || M === k.derivedTagId, me = z != null, se = W ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${k.id}:visible`,
              d: k.path,
              fill: "none",
              stroke: se,
              strokeWidth: W ? 2.5 : 1.5,
              opacity: me && !W ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...f.nodes.map((k) => {
          const W = !V || k.name.toLocaleLowerCase().includes(V), me = z != null, se = S.has(k.tagId), oe = (z == null ? void 0 : z.tagId) === k.tagId;
          return n("button", {
            key: `node:${k.tagId}`,
            type: "button",
            onClick: () => ge({ type: "node", id: k.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${oe ? "border-accent bg-accent/15 ring-2 ring-accent/25" : se ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${k.x}px`,
              top: `${k.y}px`,
              width: `${k.width}px`,
              height: `${k.height}px`,
              opacity: !W || me && !se ? 0.62 : 1
            },
            title: `${k.name} — ${k.segmentGroupName}`,
            "aria-label": `${k.name}, ${k.incomingRuleCount} incoming and ${k.outgoingRuleCount} outgoing derivation rules`
          }, [
            n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground" }, k.name),
            n("span", { key: "counts", className: "mt-1 flex items-center gap-2 text-[11px] text-secondary" }, [
              n("span", { key: "in" }, `${k.incomingRuleCount} in`),
              n("span", { key: "arrow", "aria-hidden": "true" }, "→"),
              n("span", { key: "out" }, `${k.outgoingRuleCount} out`)
            ])
          ]);
        }),
        ...f.connections.filter((k) => k.rules.length > 1).map((k) => {
          const W = f.nodes.find((se) => se.tagId === k.sourceTagId), me = f.nodes.find((se) => se.tagId === k.derivedTagId);
          return n("div", {
            key: `bundle:${k.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(W.x + W.width + me.x) / 2 - 24}px`,
              top: `${(W.y + W.height / 2 + me.y + me.height / 2) / 2 - 10}px`
            },
            "aria-label": `${k.rules.length} rules connect ${k.rules[0].sourceTagName} to ${k.rules[0].derivedTagName}`
          }, `${k.rules.length} rules`);
        })
      ])
    ]);
  }
  function x() {
    if (J.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        V ? "No derivation relationships match your search." : "No derivation rules."
      );
    const M = /* @__PURE__ */ new Map();
    X.forEach((k) => {
      const W = ae(k);
      M.has(W) || M.set(W, []), M.get(W).push(k);
    });
    const S = [
      ...p.segmentGroups.map((k) => k.key),
      "cross-group"
    ].filter((k) => M.has(k));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, S.map((k) => {
      const W = p.segmentGroups.find((oe) => oe.key === k), me = k === "cross-group" ? "Cross-group relationships" : (W == null ? void 0 : W.name) || "Ungrouped", se = M.get(k);
      return n("section", { key: k, "aria-label": me }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, me),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${se.length} rule${se.length === 1 ? "" : "s"}`
          )
        ]),
        n("div", { key: "table", role: "table", "aria-label": `${me} derivation rules` }, [
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
          ...se.map((oe) => n("button", {
            key: oe.id,
            type: "button",
            role: "row",
            onClick: () => ge({ type: "rule", id: oe.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(L == null ? void 0 : L.id) === oe.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${oe.sourceTagName} → ${oe.derivedTagName}` },
              `${oe.sourceTagName} → ${oe.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(oe.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(oe.edgeCount))
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
          `${R.length} rules · ${p.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          $(u()), ge(null), C();
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
          value: D,
          onChange: (M) => {
            ie(M.target.value), ge(null);
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
          value: P,
          disabled: d != null,
          onChange: (M) => {
            ue(M.target.value), ge(null), $(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...p.segmentGroups.map((M) => n("option", { key: M.key, value: M.key }, M.name))
        ])
      ]),
      A === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: b,
          onChange: (M) => j(M.target.value),
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
        ].map(([M, S]) => n("button", {
          key: M,
          type: "button",
          onClick: () => {
            G(M), M === "graph" && (Y == null ? void 0 : Y.type) === "rule" && ge(null);
          },
          "aria-pressed": A === M,
          className: `rounded px-3 py-1.5 text-sm font-medium ${A === M ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
        }, S))
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
        A === "graph" ? T() : x()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? h() : U()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      I ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, I) : null
    ]),
    i ? n(Jr, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => B(i),
      onClose: () => {
        const M = i.trigger;
        N(null), requestAnimationFrame(() => {
          M != null && M.isConnected && M.focus();
        });
      }
    }) : null
  ]);
}
function zd({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = F([]), [a, s] = F(null), [l, d] = F([]), [c, g] = F([]), [m, u] = F(!1), [p, f] = F(!1), [b, y] = F(!1), [w, v] = F(""), [I, V] = F(""), [D, B] = F("graph"), [C, R] = F("all"), [E, P] = F(null), [z, L] = F("relationship"), [Y, N] = F(null), [$, j] = F(null), Q = pe(null), ie = pe(null), ue = Ma().replace(/:/g, "");
  function ge() {
    requestAnimationFrame(() => {
      var q;
      return (q = Q.current) == null ? void 0 : q.scrollIntoView({ block: "nearest" });
    });
  }
  async function G(q) {
    const te = await ee("/derivation-rules", q ? { signal: q } : void 0);
    i(te || []);
  }
  fe(() => {
    const q = new AbortController();
    return G(q.signal).catch((te) => {
      te.name !== "AbortError" && v(te.message || "Unable to load derived segment rules.");
    }), () => q.abort();
  }, []), fe(() => {
    const q = new AbortController();
    return a != null && a.sourceTagId ? (u(!0), ee(`/slot-definitions/${a.sourceTagId}`, { signal: q.signal }).then((te) => d(te.definitions || [])).catch((te) => {
      te.name !== "AbortError" && d([]);
    }).finally(() => {
      q.signal.aborted || u(!1);
    })) : (d([]), u(!1)), a != null && a.derivedTagId ? (f(!0), ee(`/slot-definitions/${a.derivedTagId}`, { signal: q.signal }).then((te) => g(te.definitions || [])).catch((te) => {
      te.name !== "AbortError" && g([]);
    }).finally(() => {
      q.signal.aborted || f(!1);
    })) : (g([]), f(!1)), () => q.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), fe(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || m || p)
      return;
    const q = `${a.sourceTagId}:${a.derivedTagId}`;
    ie.current !== q && (ie.current = q, s((te) => !te || Number(te.sourceTagId) !== Number(a.sourceTagId) || Number(te.derivedTagId) !== Number(a.derivedTagId) ? te : vl(te, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    m,
    p
  ]);
  function X(q, te = !1) {
    te || P({ type: "rule", id: q.id }), ie.current = null, s({
      ruleId: q.id,
      sourceTagId: q.sourceTagId,
      sourceTagName: q.sourceTagName,
      derivedTagId: q.derivedTagId,
      derivedTagName: q.derivedTagName,
      slotMappings: q.slotMappings.map((Z) => ({
        sourceSlotDefinitionId: Z.sourceSlotDefinitionId,
        derivedSlotDefinitionId: Z.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), v(""), ge();
  }
  function de(q, te, Z = "") {
    ie.current = null, q === "source" ? (d([]), u(te != null)) : (g([]), f(te != null)), s((O) => ({
      ...O,
      [`${q}TagId`]: te == null ? null : Number(te),
      [`${q}TagName`]: Z || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function ne(q) {
    (a == null ? void 0 : a.ruleId) == null && (ie.current = null);
    const te = [G(), t == null ? void 0 : t()];
    return q.draftKind === "source" ? (u(!0), te.push(ee(`/slot-definitions/${q.tagId}`).then((Z) => d(Z.definitions || [])).finally(() => u(!1)))) : q.draftKind === "derived" && (f(!0), te.push(ee(`/slot-definitions/${q.tagId}`).then((Z) => g(Z.definitions || [])).finally(() => f(!1)))), Promise.all(te);
  }
  function be(q, te, Z) {
    s((O) => ({
      ...O,
      slotMappings: O.slotMappings.map((re, ye) => ye === q ? { ...re, [te]: Z } : re)
    }));
  }
  async function Se() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const q = Qo(a, o);
    if (q) {
      v(q.message);
      return;
    }
    if (a.slotMappings.some((te) => !te.sourceSlotDefinitionId || !te.derivedSlotDefinitionId)) {
      v("Complete or remove every performer slot mapping before saving.");
      return;
    }
    y(!0), v(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let te = null;
      if (a.ruleId != null) {
        const O = await ee(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${O.deletedSegmentCount}
Removed lineage edges: ${O.removedEdgeCount}
Shared derived segments retained: ${O.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        te = O.fingerprint;
      }
      v("Saving derived segment rule…");
      const Z = await ee("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: te
        })
      });
      if (await G(), P(D === "graph" ? { type: "node", id: Number(Z.sourceTagId) } : { type: "rule", id: Z.id }), s(null), a.ruleId == null)
        try {
          const O = await ee(
            `/derivation-rules/${Z.id}/materialization/preview`,
            { method: "POST" }
          );
          N(
            O.createCount + O.linkCount > 0 ? O : null
          ), v(O.createCount + O.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          N(null), v("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        N(null), v("Derived segment rule saved. Previous materializations were removed.");
    } catch (te) {
      v(te.message || "Unable to save derived segment rule.");
    } finally {
      y(!1);
    }
  }
  async function A(q) {
    y(!0), v("Previewing rule deletion…");
    try {
      const te = await ee(
        `/derivation-rules/${q.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${q.sourceTagName} → ${q.derivedTagName}?

Deleted segments: ${te.deletedSegmentCount}
Removed lineage edges: ${te.removedEdgeCount}
Shared derived segments retained: ${te.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const Z = `derivation-rule-delete:${q.id}:${te.fingerprint}`;
      await ee(`/derivation-rules/${q.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(Z),
          fingerprint: te.fingerprint
        })
      }), Fe(Z), await G(), (a == null ? void 0 : a.ruleId) === q.id && s(null), (E == null ? void 0 : E.type) === "rule" && E.id === q.id && P(null), (Y == null ? void 0 : Y.ruleId) === q.id && N(null), v(`Rule deleted with ${te.deletedSegmentCount} exclusively derived segment${te.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (te) {
      v(te.message || "Unable to delete derived segment rule.");
    } finally {
      y(!1);
    }
  }
  async function J(q, te = null) {
    const Z = te || await ee(
      `/derivation-rules/${q.id}/materialization/preview`,
      { method: "POST" }
    );
    if (Z.createCount + Z.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const O = `derivation-rule-materialize:${q.id}:${Z.fingerprint}`, re = await ee(`/derivation-rules/${q.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Le(O),
        fingerprint: Z.fingerprint
      })
    });
    return Fe(O), re;
  }
  async function _(q, te = null) {
    y(!0), v("Finding pending derivations…");
    try {
      const Z = await J(q, te);
      if (N(null), await G(), Z.createdCount + Z.linkedCount === 0) {
        v("Every applicable derivation is already materialized.");
        return;
      }
      v(
        `${Z.createdCount} derived segment${Z.createdCount === 1 ? "" : "s"} created and ${Z.linkedCount} existing segment${Z.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (Z) {
      v(Z.message || "Unable to materialize pending derivations.");
    } finally {
      y(!1);
    }
  }
  async function ae(q, te) {
    if (te.length === 0) return;
    y(!0), v(`Finding pending derivations from ${q.name}…`);
    let Z = 0, O = 0;
    try {
      for (const re of te) {
        const ye = await J(re);
        Z += ye.createdCount, O += ye.linkedCount;
      }
      N(null), await G(), v(Z + O === 0 ? `Every outgoing derivation from ${q.name} is already materialized.` : `${Z} derived segment${Z === 1 ? "" : "s"} created and ${O} existing segment${O === 1 ? "" : "s"} linked from ${q.name}.`);
    } catch (re) {
      await G().catch(() => {
      }), v(re.message || `Unable to materialize derivations from ${q.name}.`);
    } finally {
      y(!1);
    }
  }
  const h = Qo(a, o), U = Ge(
    () => jd(o, e),
    [o, e]
  ), T = I.trim().toLocaleLowerCase(), M = U.components.filter((q) => C === "all" || q.segmentGroupKeys.includes(C)).filter((q) => !T || q.nodes.some((te) => te.name.toLocaleLowerCase().includes(T))), S = M.flatMap((q) => q.rules), k = new Set(
    M.flatMap((q) => q.nodes.map((te) => te.tagId))
  ), W = Ge(
    () => Gd(M),
    [M]
  ), me = D === "list" ? Kd(
    E,
    S,
    T.length > 0
  ) : null, se = (E == null ? void 0 : E.type) === "node" && U.nodes.find((q) => q.tagId === E.id && k.has(q.tagId)) || null, oe = [...S].sort((q, te) => z === "source" ? Ze(q.sourceTagName, te.sourceTagName) || Ze(q.derivedTagName, te.derivedTagName) : z === "target" ? Ze(q.derivedTagName, te.derivedTagName) || Ze(q.sourceTagName, te.sourceTagName) : z === "materialized" ? (Number(te.edgeCount) || 0) - (Number(q.edgeCount) || 0) || Ze(q.sourceTagName, te.sourceTagName) : Ze(
    `${q.sourceTagName} ${q.derivedTagName}`,
    `${te.sourceTagName} ${te.derivedTagName}`
  ));
  return n(Ud, {
    arrowMarkerId: ue,
    busy: b,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: $,
    deleteRule: A,
    derivedSlots: c,
    derivedSlotsLoading: p,
    draft: a,
    draftIssue: h,
    editRule: X,
    editorRef: Q,
    emptyDraft: r,
    graph: U,
    layout: W,
    listSort: z,
    materializationOffer: Y,
    materializeOutgoingRules: ae,
    materializeRule: _,
    message: w,
    normalizedQuery: T,
    query: I,
    refreshConfiguredTag: ne,
    revealEditor: ge,
    rules: o,
    save: Se,
    segmentGroupKey: C,
    selectedNode: se,
    selectedRule: me,
    selection: E,
    setConfiguringTag: j,
    setDraft: s,
    setListSort: L,
    setMaterializationOffer: N,
    setQuery: V,
    setSegmentGroupKey: R,
    setSelection: P,
    setView: B,
    sortedVisibleRules: oe,
    sourceSlots: l,
    sourceSlotsLoading: m,
    updateMapping: be,
    updateTag: de,
    view: D,
    visibleComponents: M,
    visibleRules: S
  });
}
function _d() {
  const [e, t] = F(Ia), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => Ao({ ...l, [a]: s }));
  }
  function i() {
    t(Ao(Gr));
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
function Hd({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = F([]), [a, s] = F(!1), [l, d] = F(!1), [c, g] = F(""), [m, u] = F(""), [p, f] = F("all"), [b, y] = F(() => /* @__PURE__ */ new Set()), [w, v] = F(null);
  fe(() => {
    if (!e || a) return;
    const N = new AbortController();
    return d(!0), g(""), ee("/slot-definitions", { signal: N.signal }).then(($) => {
      i($ || []), s(!0);
    }).catch(($) => {
      $.name !== "AbortError" && g($.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      N.signal.aborted || d(!1);
    }), () => N.abort();
  }, [e, a]);
  async function I() {
    d(!0), g("");
    try {
      const N = await ee("/slot-definitions");
      i(N || []), s(!0);
    } catch (N) {
      g(N.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function V() {
    const [N] = await Promise.all([
      ee("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(N || []), s(!0), g("");
  }
  function D() {
    const N = w == null ? void 0 : w.trigger;
    v(null), requestAnimationFrame(() => {
      N != null && N.isConnected && N.focus({ preventScroll: !0 });
    });
  }
  function B(N) {
    y(($) => {
      const j = new Set($);
      return j.has(N) ? j.delete(N) : j.add(N), j;
    });
  }
  const C = Ge(
    () => Ld(t, o),
    [t, o]
  ), R = Ge(
    () => Fd(C, m, p),
    [C, m, p]
  ), E = C.flatMap((N) => N.tags), P = E.filter((N) => N.definitions.length > 0).length, z = E.length - P, L = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], Y = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${E.length} tags · ${P} with slots · ${z} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: m,
          onChange: (N) => u(N.target.value),
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
          L.map(([N, $]) => n("button", {
            key: N,
            type: "button",
            onClick: () => f(N),
            "aria-pressed": p === N,
            className: `rounded px-3 py-1.5 text-xs font-medium ${p === N ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, $))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => y(/* @__PURE__ */ new Set()),
          className: Y
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => y(new Set(C.map((N) => N.overviewKey))),
          className: Y
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
    a && R.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, R.map((N) => {
      const $ = b.has(N.overviewKey), j = N.tags.filter((Q) => Q.definitions.length > 0).length;
      return n("article", {
        key: N.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => B(N.overviewKey),
          "aria-expanded": !$,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, $ ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, N.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${N.tags.length} tag${N.tags.length === 1 ? "" : "s"} · ${j} with slots`
          )
        ]),
        $ ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          N.tags.map((Q) => n("li", {
            key: Q.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: Q.tagName }, Q.tagName),
              Q.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            Q.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${Q.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, Q.definitions.map((ie) => n("li", {
              key: ie.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, et(ie)),
              ...(ie.genderHints || []).map((ue) => n("span", {
                key: ue,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, ar(ue)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (ie) => v({
                tagId: Q.tagId,
                tagName: Q.tagName,
                trigger: ie.currentTarget
              }),
              "aria-label": `Edit performer slots for ${Q.tagName}`,
              className: `${Y} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    w ? n(Jr, {
      key: `performer-slots-configure:${w.tagId}`,
      tagId: w.tagId,
      tagName: w.tagName,
      onSaved: V,
      onClose: D
    }) : null
  ]);
}
function qd({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = F("general"), [a, s] = F([]), [l, d] = F(!1), [c, g] = F(""), [m, u] = F(""), [p, f] = F(null), [b, y] = F(!0), [w, v] = F(!1), [I, V] = F(""), [D, B] = F(!0), [C, R] = F(va), E = Bs(t), P = E.map(([$]) => $);
  fe(() => {
    P.includes(o) || i(P[0] || "general");
  }, [t.effectiveMode]);
  async function z($) {
    const j = await ee("/segment-groups", $ ? { signal: $ } : void 0);
    s(j || []);
  }
  fe(() => {
    const $ = new AbortController();
    return z($.signal).catch((j) => {
      j.name !== "AbortError" && g(j.message || "Unable to load tag groups.");
    }), () => $.abort();
  }, []), fe(() => {
    if (t.effectiveMode !== "full") {
      y(!1);
      return;
    }
    const $ = new AbortController();
    return V(""), y(!0), Promise.all([
      ee("/analysis/settings", { signal: $.signal }),
      ee("/analysis/status", { signal: $.signal })
    ]).then(([j, Q]) => {
      B(!0), u((j == null ? void 0 : j.baseUrl) || ""), f(Q);
    }).catch((j) => {
      if (j.name !== "AbortError") {
        if (j.status === 403) {
          B(!1), V("You do not have permission to manage the analysis service connection.");
          return;
        }
        V(j.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      $.signal.aborted || y(!1);
    }), () => $.abort();
  }, [t.effectiveMode]);
  async function L($) {
    if ($ !== t.requestedMode) {
      d(!0), g("");
      try {
        const j = await ee(
          `/preferences/transition?mode=${encodeURIComponent($)}`
        );
        let Q = !1, ie = null, ue = null, ge = null, G = !1;
        if (t.requestedMode === "basic" && $ === "full") {
          if (!window.confirm(Us(
            j.recyclingBinCount,
            j.protectedRecyclingBinCount
          )))
            return;
          G = !0, j.recyclingBinCount > 0 && (Q = !0, ge = j.recyclingBinFingerprint, ie = `mode-switch-empty-bin:${ge}`, ue = Le(ie));
        }
        let X = !1;
        if (t.requestedMode === "full" && $ === "basic") {
          if (!window.confirm(Ks(
            j.extensionOwnedSegmentCount
          )))
            return;
          X = !0;
        }
        const de = await ee("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: $,
            confirmHiddenExtensionOwnedSegments: X,
            confirmBasicHistoryCleanup: G,
            emptyRecyclingBin: Q,
            operationId: ue,
            expectedRecyclingBinFingerprint: ge
          })
        });
        ie && Fe(ie), r == null || r(Ca(de)), g("Workflow mode saved.");
      } catch (j) {
        g(j.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function Y($) {
    $.preventDefault(), v(!0), V("");
    try {
      const j = await ee("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: m })
      });
      u((j == null ? void 0 : j.baseUrl) || "");
      const Q = await ee("/analysis/status");
      f(Q), V(j != null && j.baseUrl ? Q != null && Q.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(Q == null ? void 0 : Q.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (j) {
      V(j.message || "Unable to save analysis service settings.");
    } finally {
      v(!1);
    }
  }
  const N = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: ($) => Wa($, e, N), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      E.map(([$, j]) => n("button", {
        key: $,
        type: "button",
        onClick: () => i($),
        "aria-current": o === $ ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === $ ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, j))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(_d)
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
      n(ld, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: L,
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
          checked: C,
          onChange: ($) => {
            const j = $.target.checked;
            xa(j), R(j);
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
      n("form", { key: "form", onSubmit: Y, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
        n("label", { key: "url", className: "min-w-0 flex-1 space-y-1" }, [
          n("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Server URL"),
          n("input", {
            key: "input",
            type: "url",
            value: m,
            onChange: ($) => u($.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: b || w || !D,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: b || w || !D,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, w ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        I || (b ? "Loading analysis service settings…" : (p == null ? void 0 : p.configured) === !1 ? "Full Scan is not configured." : p != null && p.ready ? "Analysis service is ready." : (p == null ? void 0 : p.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    P.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(zd, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => z()
      })
    ) : null,
    P.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(Hd, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => z()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function Zo({ facets: e, values: t, disabled: r, onChange: o }) {
  var i;
  return r ? n(
    "p",
    { className: "rounded-md border border-dashed border-border p-3 text-xs text-secondary" },
    "Performer slot filters are unavailable for your current access. Browse and playback remain available."
  ) : (i = e == null ? void 0 : e.slots) != null && i.length ? n("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, e.slots.map((a) => n("label", { key: a.id, className: "space-y-1 text-xs text-secondary" }, [
    n("span", { key: "label" }, et(a)),
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
function Wd({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var g, m;
  const s = [...e.slots || []].sort((u, p) => u.sortOrder - p.sortOrder || String(u.slotDefinitionId).localeCompare(String(p.slotDefinitionId))), l = [...new Map(s.map((u) => [
    u.performerId,
    { id: u.performerId, name: u.performerName }
  ])).values()], d = s.map((u) => ({
    slotDefinitionId: u.slotDefinitionId,
    label: et(u),
    performer: { id: u.performerId, name: u.performerName }
  })), c = Ta(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: Fa(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((g = e.activity) == null ? void 0 : g.name) || "segment"}, ${e.reviewState}, ${$e(e.startSec)} to ${e.endSec == null ? "end of video" : $e(e.endSec)}` }, [
      n("div", { key: "image", className: "relative aspect-video bg-black" }, [
        n("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        n("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${$e(e.startSec)} → end` : `${$e(e.startSec)} – ${$e(e.endSec)}`)
      ]),
      n("div", { key: "body", className: "flex flex-col gap-1.5 p-2.5" }, [
        n("div", { key: "segment", className: "flex min-w-0 items-center gap-1.5" }, [
          n(jt, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((m = e.activity) == null ? void 0 : m.name) || "Tag segment"),
          l.length ? n(ir, {
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
function Vd({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(ra, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: Hs(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: Ta(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Xo({ onNavigate: e, profile: t }) {
  const r = Ge(() => {
    const G = aa("ext:com.midnightrider.segment-studio:segments");
    return G ? {
      ...Nr,
      defaultFilter: { ...Nr.defaultFilter, ...G.findFilter || {} },
      defaultObjectFilter: G.objectFilter || {}
    } : Nr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = ia(r), [l, d] = F(null), [c, g] = F({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [m, u] = F(null), [p, f] = F(null), [b, y] = F(0), [w, v] = F(""), [I, V] = F(!0), [D, B] = F(""), C = pe(0), R = Mo(o, i), E = R.activityTagId, P = Yt(i.slots), z = Ge(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (G) => Object.keys(Yt(G)).length > 0,
    sanitize: (G) => Ir(E, Yt(G)),
    summarize: (G) => `${Object.keys(Yt(G)).length} assigned`,
    renderEditor: (G, X) => E ? n(Zo, {
      facets: l,
      values: Yt(G),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (de, ne) => {
        const be = { ...Yt(G) };
        ne ? be[de] = Number(ne) : delete be[de], X(Ir(E, be));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [E, l, c.performerSlotsAvailable]), L = JSON.stringify(R);
  fe(() => {
    if (d(null), !E) return;
    const G = new AbortController();
    return ee(`/browse/activities/${E}/facets`, { signal: G.signal }).then(d).catch((X) => {
      X.status === 403 ? d({ slots: [], restricted: !0 }) : X.name !== "AbortError" && B(X.message);
    }), () => G.abort();
  }, [E]), fe(() => {
    const G = ++C.current, X = new AbortController();
    return V(!0), B(""), ee("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(R), signal: X.signal }).then((de) => {
      G === C.current && g({ ...de, totalCount: de.totalCount ?? de.total ?? 0 });
    }).catch((de) => {
      if (!(G !== C.current || de.name === "AbortError")) {
        if (de.status === 400 && de.message.includes("unrestricted performer read access")) {
          g((ne) => ({ ...ne, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), B("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        B(de.message);
      }
    }).finally(() => {
      G === C.current && V(!1);
    }), () => {
      C.current++, X.abort();
    };
  }, [L, b]);
  const Y = c.items.findIndex((G) => G.key === m), N = c.items[Y] || null;
  function $(G) {
    s(G), a({ ...o, page: 1 });
  }
  function j(G) {
    const X = Mo(o, G), de = G.slots && X.activityTagId != null && X.slotAssignments.length > 0 ? G.slots : void 0;
    $({ ...G, slots: de });
  }
  function Q(G, X) {
    const de = { ...P };
    X ? de[G] = Number(X) : delete de[G], $({ ...i, slots: Ir(E, de) });
  }
  function ie() {
    const G = document.querySelector(`[data-segment-key="${m}"]`);
    u(null), requestAnimationFrame(() => G == null ? void 0 : G.focus());
  }
  async function ue(G) {
    var ne;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    f(G.key), v("");
    const X = `browse-restore:${G.itemId}:${G.revision}`, de = Le(X);
    try {
      const be = (Se = !1) => ee(`/bin/${G.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: de,
          expectedRevision: G.revision,
          discardMissingImage: Se
        })
      });
      try {
        await be(_r(X));
      } catch (Se) {
        if (((ne = Se.payload) == null ? void 0 : ne.code) !== "missing-image" || !window.confirm(`${Se.message}

Continue and discard the missing image reference?`))
          throw Se;
        Hr(X), await be(!0);
      }
      Fe(X), m === G.key && u(null), v("Segment restored to Cove."), y((Se) => Se + 1);
    } catch (be) {
      v(be.message || "Unable to restore the segment."), be.status === 409 && y((Se) => Se + 1);
    } finally {
      f(null);
    }
  }
  async function ge(G) {
    f(G.key), v("");
    try {
      const X = await ee(`/items/${G.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: G.revision })
      });
      if (!Da(X, v) || !rl(X))
        return;
      const de = `browse-dependency-delete:${G.itemId}:${X.fingerprint}`;
      await ee(`/items/${G.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(de),
          fingerprint: X.fingerprint
        })
      }), Fe(de), m === G.key && u(null), v(`${X.deletedSegmentCount} segment${X.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), y((ne) => ne + 1);
    } catch (X) {
      v(X.message || "Unable to permanently delete the segment."), X.status === 409 && y((de) => de + 1);
    } finally {
      f(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(Vr, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(sa, {
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
      error: D ? new Error(D) : null,
      onRetry: () => y((G) => G + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? Ro.filter((G) => G.id !== "performers") : Ro,
      objectFilter: i,
      onObjectFilterChange: j,
      customFilterSections: z,
      searchPlaceholder: "Search segments..."
    }, [
      E ? n(Zo, { key: "slots", facets: l, values: P, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: Q }) : null,
      n(Vd, { key: "player", item: N, index: Y, count: c.items.length, onPrevious: () => {
        var G;
        return u((G = c.items[Y - 1]) == null ? void 0 : G.key);
      }, onNext: () => {
        var G;
        return u((G = c.items[Y + 1]) == null ? void 0 : G.key);
      }, onClose: ie, onNavigate: e }),
      w ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, w) : null,
      !I && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      I ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((G) => n(Wd, {
        key: G.key,
        item: G,
        selected: G.key === m,
        busy: p === G.key,
        onSelect: () => u(G.key),
        onRestore: ue,
        onPurge: ge
      })))
    ])
  ]);
}
function Jd({ onNavigate: e, profile: t }) {
  const [r, o] = F([]), [i, a] = F(""), [s, l] = F(0), [d, c] = F(!0), [g, m] = F(null), [u, p] = F(""), f = pe(null);
  async function b(v) {
    const I = await ee("/bin", v ? { signal: v } : void 0);
    return o(I.items || []), a(I.fingerprint || ""), l(Number(I.totalCount) || 0), I;
  }
  fe(() => {
    const v = new AbortController();
    return c(!0), b(v.signal).catch((I) => {
      I.name !== "AbortError" && p(I.message);
    }).finally(() => {
      v.signal.aborted || c(!1);
    }), () => v.abort();
  }, []), oa(Br, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var v;
      return (v = f.current) == null ? void 0 : v.call(f);
    }
  }]);
  async function y(v) {
    var D;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    m(v.itemId), p("");
    const I = `restore:${v.itemId}:${v.revision}`, V = Le(I);
    try {
      const B = (C = !1) => ee(`/bin/${v.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: V, expectedRevision: v.revision, discardMissingImage: C })
      });
      try {
        await B(_r(I));
      } catch (C) {
        if (((D = C.payload) == null ? void 0 : D.code) !== "missing-image" || !window.confirm(`${C.message}

Continue and discard the missing image reference?`)) throw C;
        Hr(I), await B(!0);
      }
      Fe(I), await b(), In(), p("Segment restored with a new native ID.");
    } catch (B) {
      p(B.message || "Unable to restore the segment."), B.status === 409 && await b();
    } finally {
      m(null);
    }
  }
  async function w() {
    if (g == null)
      try {
        const v = await Pa({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          m(-1), p("");
        });
        if (v.status !== "emptied") return;
        await b(), In(), p(`${v.segmentCount} segment${v.segmentCount === 1 ? "" : "s"} from ${v.sceneCount} scene${v.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (v) {
        p(v.message || "Unable to empty the recycling bin."), v.status === 409 && await b();
      } finally {
        m(null);
      }
  }
  return f.current = w, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    n(Vr, {
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
    u ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, u) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((v) => n("article", { key: v.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${v.tagName || "Tag segment"} · ${v.videoTitle || `Video ${v.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, v.endSec == null ? $e(v.startSec) : `${$e(v.startSec)} – ${$e(v.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${v.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${v.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: g != null, onClick: () => y(v), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const ea = "ext:com.midnightrider.segment-studio:videos";
function Tr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = Ge(() => {
    var _;
    const A = aa(ea), J = (_ = A == null ? void 0 : A.uiOptions) == null ? void 0 : _.displayMode;
    return A ? {
      ...kn,
      defaultFilter: { ...kn.defaultFilter, ...A.findFilter || {} },
      defaultObjectFilter: A.objectFilter || {},
      defaultDisplayMode: kn.allowedDisplayModes.includes(J) ? J : kn.defaultDisplayMode
    } : kn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = ia(i), [m, u] = F({ items: [], totalCount: 0 }), [p, f] = F(!0), [b, y] = F(""), [w, v] = F(0), [I, V] = F(/* @__PURE__ */ new Set()), [D, B] = F(null), [C, R] = F({ busy: !1, error: "", announcement: "" }), E = pe(0), P = pe(null), z = pe(null);
  z.current || (z.current = Od());
  const L = JSON.stringify(a), Y = JSON.stringify(s), N = t || r === "review";
  fe(() => {
    z.current.selectionChanged(), P.current = null, V(/* @__PURE__ */ new Set()), R((A) => ({ busy: A.busy, error: "", announcement: "" }));
  }, [L, Y]), fe(() => {
    if (!N) return;
    const A = new AbortController();
    return ee("/analysis/status", { signal: A.signal }).then(B).catch((J) => {
      J.name !== "AbortError" && B({ configured: !0, ready: !1, error: J.message || "Unable to check Full Scan readiness." });
    }), () => A.abort();
  }, [N]), fe(() => {
    const A = ++E.current, J = new AbortController();
    return f(!0), y(""), ee(`/videos?${rd(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: J.signal }).then((_) => {
      A === E.current && u(_);
    }).catch((_) => {
      A === E.current && _.name !== "AbortError" && y(_.message || "Unable to discover videos.");
    }).finally(() => {
      A === E.current && f(!1);
    }), () => {
      E.current++, J.abort();
    };
  }, [L, Y, t, r, w]);
  function $(A) {
    d({ ...A, page: A.page || 1 });
  }
  function j(A) {
    c(A), d({ ...a, page: 1 });
  }
  function Q(A, J = !1) {
    V((_) => od(
      _,
      m.items.map((ae) => ae.videoId),
      A,
      P.current,
      J
    )), P.current = A;
  }
  function ie() {
    P.current = null, V(new Set(m.items.map((A) => A.videoId)));
  }
  function ue() {
    P.current = null, V(/* @__PURE__ */ new Set());
  }
  function ge() {
    P.current = null, V((A) => new Set(m.items.map((J) => J.videoId).filter((J) => !A.has(J))));
  }
  async function G(A = ["aiTagging", "omnishotcut"]) {
    const J = z.current.begin();
    if (J) {
      R({ busy: !0, error: "", announcement: "" });
      try {
        const _ = await Pd(
          [...I],
          A,
          ee,
          (ae) => window.confirm(ae)
        );
        if (_.cancelled) {
          R({ busy: !1, error: "", announcement: "" });
          return;
        }
        _.queuedIds.length > 0 && z.current.ownsCurrentSelection(J) && (_.queuedIds.includes(P.current) && (P.current = null), V((ae) => {
          const h = new Set(ae);
          return _.queuedIds.forEach((U) => h.delete(U)), h;
        })), R({
          busy: !1,
          announcement: _.queuedIds.length > 0 ? `${_.queuedIds.length} ${_.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: _.failed.length > 0 ? `${_.failed.length} selected ${_.failed.length === 1 ? "video could" : "videos could"} not be queued. ${_.failed[0].error}` : ""
        });
      } catch (_) {
        R({ busy: !1, error: _.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        z.current.finish(J);
      }
    }
  }
  const X = t || r === "review" ? qo : qo.filter((A) => !["reviewState", "shotBoundaries"].includes(A.id)), de = D === null || D.configured === !1 || D.ready === !1, ne = C.busy || de, be = (D == null ? void 0 : D.error) || (D === null ? "Checking Full Scan availability" : D.configured === !1 ? "Configure the analysis service before running Full Scan" : D.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), Se = C.busy ? "Queueing scans…" : D === null ? "Checking Full Scan…" : D.configured === !1 ? "Full Scan not configured" : D.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
  return n("div", { className: "w-full space-y-5" }, [
    n(Vr, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(sa, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: ea,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: $,
      totalCount: m.totalCount,
      isLoading: p,
      error: b ? new Error(b) : null,
      onRetry: () => v((A) => A + 1),
      sortOptions: t || r === "review" ? [...Ho, { value: "unreviewed_count", label: "Unreviewed count" }] : Ho,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: X,
      objectFilter: s,
      onObjectFilterChange: j,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: N ? I : void 0,
      onSelectAll: N ? ie : void 0,
      onSelectNone: N ? ue : void 0,
      onInvertSelection: N ? ge : void 0,
      selectionActions: N ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: ne,
          onClick: () => G(),
          title: be,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, Se),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": ne,
            title: be,
            onClick: (A) => {
              ne && A.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${ne ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(la, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([A, J]) => n("button", {
            key: A,
            type: "button",
            disabled: C.busy,
            onClick: (_) => {
              var ae;
              (ae = _.currentTarget.closest("details")) == null || ae.removeAttribute("open"), G(J);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, A)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, C.announcement),
      C.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, C.error) : null,
      !p && m.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !p && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, m.items.map((A) => n(ad, { key: A.videoId, item: A, onNavigate: e, showReviewStates: N, selected: I.has(A.videoId), selectionActive: I.size > 0, onSelect: N ? Q : null }))) : null,
      !p && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, m.items.map((A) => n(id, { key: A.videoId, item: A, onNavigate: e, showReviewStates: N, selected: I.has(A.videoId), selectionActive: I.size > 0, onSelect: N ? Q : null }))) : null
    ])
  ]);
}
function ta({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = F(null), [s, l] = F(!0), [d, c] = F(""), g = pe(0), m = pe(0), u = pe(e), p = zl();
  u.current = e;
  const f = (I) => `/videos/${I}/editor`;
  async function b(I, V, D) {
    const B = await ee(f(V), D ? { signal: D.signal } : void 0);
    return Ot(I, D ? g.current : m.current, V, u.current) ? (a(B), !0) : !1;
  }
  fe(() => {
    const I = ++g.current, V = e, D = new AbortController();
    return a(null), l(!0), c(""), b(I, V, D).catch((B) => {
      Ot(I, g.current, V, u.current) && B.name !== "AbortError" && c(B.message || "Unable to load the editor.");
    }).finally(() => {
      Ot(I, g.current, V, u.current) && l(!1);
    }), () => {
      g.current++, m.current++, D.abort();
    };
  }, [e]);
  function y(I, V) {
    a((D) => (D == null ? void 0 : D.video.id) !== V ? D : typeof I == "function" ? I(D) : I);
  }
  async function w() {
    const I = e, V = ++m.current;
    try {
      const D = await ee(f(I));
      return Ot(V, m.current, I, u.current) ? (a(D), c("A newer canonical segment was loaded. Your stale change was not applied."), D) : null;
    } catch (D) {
      return Ot(V, m.current, I, u.current) && c(D.message || "Unable to reload the latest segment."), null;
    }
  }
  async function v() {
    const I = e, V = ++m.current;
    try {
      const D = await ee(f(I));
      return Ot(V, m.current, I, u.current) ? (a(D), c(""), D) : null;
    } catch (D) {
      return Ot(V, m.current, I, u.current) && c(D.message || "Unable to reload performer slots."), null;
    }
  }
  return n("div", {
    className: `mx-auto flex w-full flex-col gap-2 ${p ? "lg:overflow-hidden" : "p-3 sm:p-4"}`,
    style: p ? {
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
      n(Gi, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(Ed, {
      key: i.video.id,
      detail: i,
      onDetailChange: y,
      onConflict: w,
      onReload: v,
      onSlotsChanged: v,
      splitLayout: p,
      profile: o,
      initialSegmentId: Do() ? -Do() : qs(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function Yd(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function Qd(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function Zd(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function Xd({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = Fs(o), l = Yd(e, t, window.location.pathname), d = Qd(e, t, window.location.pathname), c = Zd(e, t, window.location.pathname), g = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (Gs(g, o) === "videos" && g !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Tr, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(qd, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(Xo, { onNavigate: r, profile: o });
    const p = Number(e);
    return Number.isInteger(p) && p > 0 ? n(ta, {
      videoId: p,
      onNavigate: r,
      compatibilityMode: !0,
      profile: o
    }) : n(Tr, {
      onNavigate: r,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return n(Jd, { onNavigate: r, profile: o });
  const u = Number(e);
  return d ? n(Xo, { onNavigate: r, profile: o }) : Number.isInteger(u) && u > 0 ? n(ta, {
    videoId: u,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(Tr, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function ec({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = F(null), [a, s] = F("");
  return fe(() => {
    const l = new AbortController();
    return ee("/preferences", { signal: l.signal }).then((d) => i(Ca(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(Xd, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function tc(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function nc(e, t) {
  const r = tc(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const kc = {
  components: { SegmentStudioPage: ec },
  actionHandlers: { openSegmentStudio: nc }
};
export {
  er as CLEARED_SEGMENT_SELECTION_ID,
  Ho as DISCOVERY_SORT_OPTIONS,
  kt as SEGMENT_STUDIO_CAPABILITIES,
  Br as SEGMENT_STUDIO_EXTENSION_ID,
  Mn as SEGMENT_STUDIO_SHORTCUTS,
  is as activeEditorFilterCount,
  vl as applyDerivationRuleSlotSuggestions,
  Go as applyFeedbackEditorDelta,
  jo as applySegmentMergeDelta,
  il as basicSegmentTimelineStyle,
  Hs as browseClipEnd,
  Ta as browseEditorHref,
  Mo as buildBrowseRequest,
  jd as buildDerivationRuleGraph,
  rd as buildDiscoverySearchParams,
  Hi as buildMinuteTimelineTicks,
  Ld as buildPerformerSlotOverview,
  Qs as buildSegmentQuickSearchEntries,
  Nl as buildSegmentRailRows,
  Il as buildTimelineRows,
  lc as buildTimelineTicks,
  Ji as calculateCenteredTimelineScroll,
  Rr as calculateEditorPanelMaximum,
  qi as calculateMinuteLabelStride,
  dc as calculateMinuteTimelineWidth,
  Zi as calculateSwimlaneTitleMaximum,
  Yi as calculateTimelinePlayheadPosition,
  Kr as calculateTimelineRatioBounds,
  es as calculateTimelineRatioFromPointer,
  cc as calculateVerticalRevealOffset,
  Pt as clampEditorPanelWidth,
  Zn as clampSwimlaneTitleWidth,
  ha as clampTimelineRatio,
  Ur as clampTimelineRatioForHeight,
  Xn as clampTimelineZoom,
  Xl as compactProvenanceSummary,
  Od as createBulkAnalysisCoordinator,
  Ts as createQueuedReviewRequest,
  kc as default,
  nl as downloadFileNameFromContentDisposition,
  ss as dualRangeValueFromPointer,
  $o as duplicateIdentityFromResponse,
  Es as duplicateOperationKey,
  as as editorVisibilityIncludingSegment,
  Tl as expandedSwimlanes,
  Ks as extensionOwnedSegmentsModeSwitchPrompt,
  Dl as feedbackFrameTimestamps,
  Pl as feedbackResultMatchesAction,
  Ol as feedbackSelectionPlan,
  os as filterDerivedSegments,
  wr as filterEditorSegments,
  Fd as filterPerformerSlotOverview,
  Ys as filterSegmentQuickSearch,
  fc as filterSegmentStudioShortcuts,
  Ml as findAdjacentSegmentGroupKey,
  Ps as findAdjacentShot,
  Is as findEditorShortcut,
  ya as findInitialSegmentSelection,
  _i as findNearestSegmentInCurrentSwimlane,
  Os as findPublishedSelectionIdentity,
  He as findSegmentByStableIdentity,
  ts as findSegmentFromPlayhead,
  zi as findSegmentNearPlayhead,
  Rl as findSwimlaneRangeSelection,
  Pr as findSwimlaneSelection,
  Vs as findUniquePerformerSlotAssignment,
  ba as findUnreviewedSelection,
  ar as formatGenderHint,
  Ls as frameStepSeconds,
  Aa as generatePerformerSlotAssignmentRecommendations,
  fd as groupApprovedDraftsForPublishing,
  Js as groupAutoAssignCandidates,
  Ll as groupIncorrectExamplesByTag,
  xd as groupMaterializationOutputs,
  Lt as groupSegmentsIntoSwimlanes,
  Cl as groupSelectedSwimlanes,
  Wr as groupSwimlanesBySegmentGroup,
  ot as handleModalKey,
  Zt as hasSegmentStudioCapability,
  Ko as hideCollectedFeedbackSegments,
  pl as historyActionsForTarget,
  Ka as indexPerformerSlotsBySegment,
  bc as initialReviewFilter,
  Bl as insertSegmentProjection,
  Ot as isCurrentEditorRequest,
  ul as isEditableTarget,
  vc as isEditorShortcutOwner,
  Zd as isSegmentStudioBinRoute,
  Qd as isSegmentStudioSegmentsRoute,
  Yd as isSegmentStudioSettingsRoute,
  Bd as layoutDerivationRuleComponent,
  Gd as layoutDerivationRuleComponents,
  Gl as mergeSegmentsProjection,
  bl as multiSelectionActionHint,
  fs as nextSegmentAfterRemoval,
  ys as nextUnreviewedAfterRemoval,
  At as normalizeCollapsedSegmentGroups,
  Vo as normalizeDiscoveryIds,
  dt as normalizeEditorSegmentFilters,
  $t as normalizeGender,
  To as normalizeReviewFilter,
  Ca as normalizeSegmentStudioFeatureProfile,
  yc as normalizeSegmentStudioMode,
  Dr as normalizeSegmentStudioPublicMode,
  Yt as parseBrowseSlotFilters,
  Xi as parseEditorLayout,
  ns as parseHideDerivedSegmentsPreference,
  rs as parseMergeConfirmationPreference,
  Na as parsePlaybackShortcutConfig,
  ws as parseShortcutBindingOverrides,
  $r as patchPerformerSlotProjection,
  rr as patchSegmentProjection,
  bs as percentageSeekTime,
  Ws as performInitialSegmentSeek,
  Ve as performerOptionId,
  tr as performerSlotHistoryState,
  et as performerSlotLabel,
  xl as performerSlotPresentation,
  Sc as performerSlotStatus,
  qr as performerSlotStatusFromSegmentSlots,
  Ga as performerSlotsForSegment,
  gt as provenanceSourceLabel,
  Ra as rankPerformerOptions,
  El as reconcileSegmentGroupKey,
  gs as reconcileSelectedSegmentIds,
  sd as recyclingBinActionText,
  ol as recyclingBinDeletionPrompt,
  Oa as recyclingBinDeletionSummary,
  Us as recyclingBinModeSwitchPrompt,
  Ms as removeQueuedReviewsForSegments,
  Lr as removeSegmentsProjection,
  Do as requestedOwnedItemId,
  qs as requestedSegmentId,
  ds as resolveEditorSegmentSelection,
  As as resolveQueuedReviewRequest,
  Ds as resolveSegmentCreationAction,
  Gs as resolveSegmentStudioRoute,
  Ns as resolveSegmentStudioShortcuts,
  Kd as resolveSelectedDerivationRule,
  hs as resolveSelectedSegments,
  Md as restorePublishApprovedFocus,
  Rn as restoreSegmentFieldsProjection,
  qa as restoreSegmentsProjection,
  Ha as revealCollapsedSegmentGroup,
  Pd as runSelectedDiscoveryAnalysis,
  La as segmentBadgeStyle,
  or as segmentGroupHeaderBackground,
  ut as segmentGroupKeyForSegment,
  Ba as segmentHistoryIdentity,
  Jn as segmentHistoryState,
  Fa as segmentRailItemStyle,
  hc as segmentStateStyle,
  tc as segmentStudioActionTarget,
  Fs as segmentStudioLegacyMode,
  al as segmentTimelineStyle,
  lt as segmentsHistoryState,
  ps as selectAllVideoSegmentIds,
  zs as selectedBrowseStates,
  za as selectedSwimlaneMerge,
  Wa as setBackLinkNavigation,
  fl as sharedPerformerSlotShape,
  yl as sharedTagPerformerSlotShape,
  Qt as shortcutAvailableInMode,
  Cs as shortcutBindingDisplayText,
  uc as shortcutBindingFromEvent,
  gc as shortcutBindingsOverlap,
  pc as shortcutModesOverlap,
  ks as shortcutRequiresSingleSegment,
  Nn as shotBoundaryFingerprint,
  gl as shouldAcceptCurrentTagFromEnter,
  mc as shouldExitShortcutCapture,
  xc as shouldHandleEditorShortcut,
  _o as shouldReloadAfterSegmentMutation,
  Er as shouldRestoreTransitionSelection,
  Zs as shouldShowQuickSearchGroups,
  Io as splitShortcutCategoriesIntoColumns,
  hl as suggestDerivationRuleSlotMappings,
  Tn as swimlaneDisplayLabel,
  cl as swimlaneMarkerTop,
  ll as swimlaneStripeBackground,
  Qi as timelineContentStyle,
  ko as timelinePlayheadHorizontalStyle,
  sl as timelineSegmentWidth,
  Wi as timelineTickAlignment,
  Vi as timelineTickPosition,
  Ar as timelineTimePercent,
  Al as toggleAllCollapsedSegmentGroups,
  $s as toggledSelectionReviewState,
  yt as trapModalFocus,
  Xs as tryParseJsonResponseText,
  ms as updateAnchoredSegmentSelection,
  od as updateDiscoverySelection,
  ls as updateDualRangeValues,
  cs as updateSegmentCollectionSelection,
  us as updateSegmentRangeSelection,
  Sa as updateSegmentSelection,
  Qo as validateDerivationRuleDraft,
  So as validateSegmentTiming,
  zr as videoPerformerOptions,
  Cr as videoPerformerSlotAssignments,
  Bs as visibleSegmentStudioSettingsTabs,
  js as visibleSegmentStudioTabs,
  Ua as visibleVirtualRows
};
