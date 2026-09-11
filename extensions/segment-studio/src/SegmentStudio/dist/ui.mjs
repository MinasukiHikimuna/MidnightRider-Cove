import jr from "@cove/runtime/react";
import { createPortal as Di } from "@cove/runtime/react-dom";
import { extensionFetch as ea } from "@cove/runtime/api";
import { formatDuration as Oi, EntityReferenceSelector as In, useExtensionKeyboardBindings as Pi, VideoPlayer as ta, useRegisterExtensionKeyboardActions as na, getDefaultFilter as ra, useListUrlState as oa, ListPage as aa } from "@cove/runtime/components";
import { ChevronDown as Li, Loader2 as Fi } from "@cove/runtime/lucide-react";
const Br = "com.midnightrider.segment-studio", ia = "segment-studio.layout.v1", Ft = "segment-studio.operations.v1", sa = "segment-studio.collapsed-segment-groups.v1", la = "segment-studio.playback-shortcuts.v1", da = "segment-studio.timing-clipboard.v1", ca = "segment-studio.hide-derived-segments.v1", ua = "segment-studio.merge-confirmation.v1", Xe = ["unreviewed", "approved", "rejected"], ji = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], ho = "(min-width: 1024px) and (min-height: 640px)", vo = "(min-width: 1024px) and (min-height: 900px)", Cn = 1e-3, xo = 15, Bi = 30, ma = 12, rt = {
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
function ga(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? pa(e, null, 1, !0) ?? r[0] ?? null;
}
function pa(e, t, r, o = !1) {
  var g;
  const i = e.findIndex((m) => m.markers.some((u) => u.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const m = e.flatMap((u) => u.markers.map((y) => y.segment)).filter((u) => u.reviewState === "unreviewed");
    return r < 0 ? m.at(-1) ?? null : m[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((m) => m.segment.id === t);
  if (!o)
    return ((g = (r < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((u) => u.segment.reviewState === "unreviewed")) == null ? void 0 : g.segment) ?? null;
  const l = e.flatMap((m) => m.markers.map((u) => u.segment)), d = l.findIndex((m) => m.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((m) => m.reviewState === "unreviewed") ?? null;
}
function Gi(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((g, m) => g.markers.filter(({ segment: u }) => {
    const y = Number(u.startSec), p = u.endSec == null ? y + Bi : Number(u.endSec);
    return Number.isFinite(y) && Number.isFinite(p) && p >= y && y <= i + xo + Cn && p >= i - xo - Cn;
  }).map(({ segment: u }) => ({ segment: u, laneIndex: m }))).sort((g, m) => g.laneIndex - m.laneIndex || Math.abs(g.segment.startSec - i) - Math.abs(m.segment.startSec - i) || g.segment.id - m.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((g) => g.markers.some((m) => m.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((g) => g.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((g) => g.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((g) => g.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function Ki(e, t, r) {
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
function tc(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function Ui(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function nc(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function zi(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function _i(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Hi(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function qi(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Rr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function Wi(e, t, r = 10) {
  const o = Rr(e, t), i = o / 100;
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
function Vi(e, t = ma) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function fa(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : rt.timelineRatio;
}
function Mr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function Pt(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? rt.detailWidth : Math.min(Mr(t, 0), Math.max(240, e));
}
function Qn(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? rt.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function Ji(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function Kr(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: rt.timelineRatio, maximum: rt.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function Ur(e, t) {
  const r = fa(e);
  if (!(t > 0)) return r;
  const o = Kr(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function Yi(e) {
  if (!e) return { ...rt };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? fa(r) : rt.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: Pt(t == null ? void 0 : t.detailWidth),
      markerRailWidth: Pt(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: Qn(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...rt };
  }
}
function Qi(e, t, r) {
  return r > 0 ? Ur((t + r - e) / r, r) : rt.timelineRatio;
}
function rc(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function Zi(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, g) => c.startSec - g.startSec || c.id - g.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= Cn ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function Ot(e, t, r, o) {
  return e === t && r === o;
}
const er = "__segment-studio-cleared-selection__";
function Xi(e) {
  return e === "true";
}
function es(e) {
  return e !== "false";
}
function ya() {
  try {
    return es(window.localStorage.getItem(ua));
  } catch {
    return !0;
  }
}
function ba(e) {
  try {
    window.localStorage.setItem(ua, String(!!e));
  } catch {
  }
}
function ts(e, t) {
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
  return ts(e || [], o).filter((m) => {
    if (m.reviewState != null && !a.reviewStates.includes(m.reviewState) || s && !s.has(m.id) || a.tagId != null && Number(m.tagId) !== a.tagId || d && !d.has(Number(m.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(m.tagId)) || a.sourceKey != null && m.sourceKey !== a.sourceKey) return !1;
    const u = Number(m.confidence);
    return m.confidence == null || !Number.isFinite(u) ? a.includeUnscored : u >= a.confidenceMin && u <= a.confidenceMax;
  });
}
function ns(e, t, r, o = !1, i = []) {
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
function rs(e, t = !1) {
  const r = dt(e);
  return +(r.reviewStates.length !== Xe.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function os(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function as(e, t, r, o) {
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
function is(e, t, r = null) {
  return t === er ? null : ga(
    e,
    t ?? r
  );
}
function ha(e, t, r, o = !1) {
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
function ss(e, t, r) {
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
function ls(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return ha(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function ds(e, t, r = null, o = !1) {
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
      ...ls(m, s, t, g, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: m
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
    rangeBaseSegmentIds: d.selectedSegmentIds.filter((g) => g !== c)
  };
}
function cs(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function us(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function wo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function No(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => wo(t, o) - wo(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function ms(e, t, r) {
  var c, g;
  const o = e || [], i = new Set(t || []), a = o.findIndex((m) => (m.markers || []).some(({ segment: u }) => u.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: m }) => m.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const m of o) {
      const u = (m.markers || []).find(({ segment: y }) => !i.has(y.id));
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
function gs(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function ps(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function fs(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function ys() {
  try {
    return Xi(window.localStorage.getItem(ca));
  } catch {
    return !1;
  }
}
function bs(e) {
  try {
    window.localStorage.setItem(ca, String(!!e));
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
], hs = /* @__PURE__ */ new Set([
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
function vs(e) {
  return hs.has(e);
}
function va(e) {
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
function xs(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Mn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(va).filter(Boolean)]));
  } catch {
    return {};
  }
}
function Ss(e = {}) {
  const t = xs(e);
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
function oc(e) {
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
function ac(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function Ar(e, t) {
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
function ic(e, t) {
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
          if (Ar(u, e) && Ar(u, t)) return !0;
        }
  return !1;
}
function Qt(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function sc(e, t) {
  return [!1, !0].some((r) => Qt(e, r) && Qt(t, r));
}
function ks(e, t = !1, r = {}) {
  return Ss(r).find((o) => Qt(o, t) && o.bindings.some((i) => Ar(e, i))) || null;
}
function xa(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function ws(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(xa).join(" / ") : "Unassigned";
}
function lc(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, ws(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function dc(e) {
  return e === "review" ? "review" : "editor";
}
function He(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function Ns(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function Is(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function Cs(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => He(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: He(t, e.activeIdentity) || r[0]
  };
}
function $s(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function Ts(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => $s(o, i))));
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
function Rs(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function Ms(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function Er(e, t) {
  return e === t;
}
function As(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function Es(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - Cn).at(-1) || null : o.find((i) => i.startSec > t + Cn) || null;
}
function Zn(e) {
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
function cc(e, t = null, r = !1) {
  const o = To(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function Jt(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function Sa(e) {
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
function Ds(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function ka() {
  try {
    return Sa(window.localStorage.getItem(la));
  } catch {
    return { ...Gr };
  }
}
function Ro(e) {
  const t = Sa(JSON.stringify(e));
  try {
    window.localStorage.setItem(la, JSON.stringify(t));
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
function wa(e) {
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
function Os(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Ps(e) {
  const t = [];
  return Zt(e, kt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), Zt(e, kt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function Ls(e) {
  return [
    ["general", "General", kt.settingsGeneral],
    ["shortcuts", "Shortcuts", kt.settingsShortcuts],
    ["performer-slots", "Performer slots", kt.settingsPerformerSlots],
    ["derivation", "Derivation", kt.settingsDerivation]
  ].filter(([, , r]) => Zt(e, r)).map(([r, o]) => [r, o]);
}
function Fs(e, t) {
  return e === "segments" && !Zt(
    t,
    kt.navigationSegmentInventory
  ) || e === "bin" && !Zt(
    t,
    kt.recyclingBinView
  ) ? "videos" : e;
}
function js(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Bs(e, t = 0) {
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
}, Mo = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: Xe.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function Gs(e) {
  const t = String(e || "").split(",").filter((r) => Xe.includes(r));
  return t.length === 0 ? [...Xe] : [...new Set(t)];
}
function Yt(e) {
  return Na(e).values;
}
function Na(e) {
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
function Ao(e, t) {
  var l;
  const r = Eo(t.activitiesCriterion, t.activityId), o = Eo(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = Na(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: Ks(t.reviewStateCriterion, t.states),
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
function Ks(e, t) {
  return Xe.includes(e == null ? void 0 : e.value) ? [e.value] : Gs(t);
}
function Ia(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Us(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function zs(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Do(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function _s(e, t, r) {
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
function Ca(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((y) => String(y.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((y) => {
    var p;
    return !((p = y.genderHints) != null && p.length);
  }) && e.length === t.length && !i) {
    const y = [...e].sort((h, f) => String(h.slotDefinitionId).localeCompare(String(f.slotDefinitionId))), p = [...t].sort((h, f) => String(h.name).localeCompare(String(f.name)) || Number(Ve(h)) - Number(Ve(f)));
    return [{
      assignments: Object.fromEntries(y.map((h, f) => [String(h.slotDefinitionId), String(Ve(p[f]))])),
      description: p.map((h) => h.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((y) => t.map((p, h) => ({ performer: p, index: h })).filter(({ performer: p }) => {
    var h;
    return !((h = y.genderHints) != null && h.length) || y.genderHints.some((f) => $t(f) === $t(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), g = i ? c.filter((y) => y.length > 0).length : Po(c, t.length);
  if (g === 0) return [];
  const m = new Map(t.map((y, p) => [String(Ve(y)), p]));
  function u(y, p, h) {
    if (s.length >= a) return;
    const f = c.slice(y), w = i ? f.filter((j) => j.length > 0).length : Po(f.map((j) => j.filter((F) => !p.has(String(Ve(t[F]))))), t.length);
    if (h + w < g) return;
    if (y === e.length) {
      if (h !== g) return;
      const j = Object.fromEntries(d.map(({ slot: T, performer: M }) => [String(T.slotDefinitionId), M ? String(Ve(M)) : ""])), F = o.length === 0 ? Object.values(j).sort().join(",") : [...new Set(e.map((T) => String(T.label || "")))].map((T) => `${T}:${d.filter(({ slot: M }) => String(M.label || "") === T).map(({ performer: M }) => M ? String(Ve(M)) : "").sort().join(",")}`).join("|");
      !l.has(F) && s.length < a && (l.add(F), s.push({
        assignments: j,
        description: d.map(({ slot: T, performer: M }) => o.length ? `${T.label}: ${(M == null ? void 0 : M.name) || "Unassigned"}` : (M == null ? void 0 : M.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const v = e[y], N = [...d].reverse().find(({ slot: j }) => Oo(j) === Oo(v)), W = N ? m.get(String(Ve(N.performer))) : -1;
    for (const j of c[y]) {
      const F = t[j], T = Ve(F);
      if (!(j < W) && !(T == null || !i && p.has(String(T))) && (d.push({ slot: v, performer: F }), i || p.add(String(T)), u(y + 1, p, h + 1), i || p.delete(String(T)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: v, performer: null }), u(y + 1, p, h), d.pop();
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
function Hs(e, t) {
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
      const m = [...new Set(e.map((u) => u.label || ""))].map((u) => `${u}:${a.filter((y) => (y.slot.label || "") === u).map((y) => y.performer.performerId).sort((y, p) => y - p).join(",")}`).join("|");
      i.has(m) || i.set(m, [...a]);
      return;
    }
    const c = e[l];
    for (const m of t)
      !o && d.has(m.performerId) || (g = c.genderHints) != null && g.length && !c.genderHints.some((u) => $t(u) === $t(m.gender)) || (a.push({ slot: c, performer: m }), o || d.add(m.performerId), s(l + 1, d), o || d.delete(m.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function qs(e) {
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
function Ws(e, t, r = 20) {
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
function Vs(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function Js(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function $a(e, t, r) {
  const o = Ve, i = new Set((t || []).map(o)), a = new Set((r || []).map($t));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const m = $t(l.gender || l.genderIdentity), u = $t(d.gender || d.genderIdentity), y = l.matchesGenderHint ?? a.has(m);
    return (d.matchesGenderHint ?? a.has(u)) - y || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: fe, useId: Ta, useMemo: Ge, useRef: pe, useState: L } = jr, n = jr.createElement, Ra = "/api/plugins/segment-studio";
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
function Ys(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function Qs(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function Z(e, t, r = 0) {
  var d;
  const o = await ea(`${Ra}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Ys(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await Qs(250 * (r + 1), t == null ? void 0 : t.signal), Z(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function Zs(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${Ra}${e}`, o = await ea(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: Xs(
      o.headers.get("Content-Disposition")
    )
  };
}
function Xs(e, t = "segment-studio-ai-feedback.zip") {
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
function Ma(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function el(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function Aa(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function tl(e, t) {
  const { sceneCount: r, segmentCount: o } = Aa(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function Ea(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = Aa(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(tl(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await Z("/bin/empty", {
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
function uc(e, t) {
  return {
    ...(mt[e] || mt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function Da(e) {
  return { ...(mt[e] || mt.unreviewed).badge };
}
function Oa(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const Pa = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function nl(e, t, r = "not-applicable", o = !1) {
  const i = mt[e] || mt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function rl(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function ol(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function al(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function il(e, t) {
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
function sl(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function jt({ state: e, includeLabel: t = !0 }) {
  const r = mt[e] || mt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: Da(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function ll(e, t = null) {
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
function mc(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function dl(e, t = document) {
  return !(e.defaultPrevented || ll(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function gc(e, t = document, r = !1, o = {}) {
  return dl(e, t) ? ks(e, r, o) != null : !1;
}
function ot(e, { onCancel: t, onConfirm: r } = {}) {
  var s, l;
  if (e.key === "Enter" && (e.isComposing || (s = e.nativeEvent) != null && s.isComposing || e.keyCode === 229)) return !1;
  const o = typeof ((l = e.target) == null ? void 0 : l.closest) == "function" ? e.target.closest("button, a, select, option, textarea") : e.target, i = String((o == null ? void 0 : o.tagName) || "").toLowerCase();
  if (i === "select" || i === "option" || e.key === "Enter" && (e.repeat || ["button", "a", "textarea"].includes(i))) return !1;
  const a = e.key === "Escape" ? t : e.key === "Enter" ? r : null;
  return a ? (e.preventDefault(), e.stopPropagation(), a(), !0) : !1;
}
function cl(e, t) {
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
function ul(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? i.filter((a) => a.sequence > o && a.sequence <= r).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > r && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function La(e, t = !0) {
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
function Vn(e, t = !0) {
  return {
    type: "segment",
    identity: La(e, t),
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
      identity: La(r, t),
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
function Fa(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function ja(e) {
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
function ml(e, t) {
  const r = (t || []).map((i) => Fa(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: et(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function gl(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : ml(e, t);
}
function pl({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function pc(e, t) {
  return qr(Fa(e, t));
}
function et(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function fl(e, t) {
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
    m.forEach((y, p) => l.push({
      sourceSlotDefinitionId: y.id,
      derivedSlotDefinitionId: u[p].id
    }));
  }
  return l;
}
function yl(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = fl(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function bl(e) {
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
function hl(e) {
  const t = e.map(et), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function vl(e, t) {
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
        const c = hl(l.slots), g = l.slots.filter((h) => !a.has(String(h.slotDefinitionId))), m = o.length === 1 ? l.slots : g, u = m.map((h) => `${c.get(String(h.slotDefinitionId))} · ${h.performerName || `Performer ${h.performerId}`}`).join(" · "), y = [...new Map(m.map((h) => [
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
          performerLabel: u,
          performers: y,
          performerAssignments: p,
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => vl(s, a));
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
const xl = {
  group: 38,
  lane: 33,
  segment: 41
};
function Sl(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = xl[s.kind];
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
function Ba(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function kl(e, t = [], r = !0) {
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
function wl(e, t) {
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
function Ga(e, { nativeOnly: t = !1 } = {}) {
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
function Rt(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function $n(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function Nl(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var r;
    return (r = t[0]) == null ? void 0 : r.toUpperCase();
  }).join("") || "?";
}
function Tn({ performer: e, compact: t = !1, tooltip: r = null }) {
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
    }, o ? Nl(e.name) : "—"),
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
function Ka({ assignments: e, className: t = "" }) {
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
      n(Tn, {
        key: `${r.key}:avatar`,
        performer: r.performer
      })
    ];
  }));
}
function ir({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = pe(null), i = `performer-slots-${Ta()}`, [a, s] = L(null);
  function l() {
    var y;
    const c = (y = o.current) == null ? void 0 : y.getBoundingClientRect();
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
    ...e.slice(0, 3).map((c) => n(Tn, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? Di(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(Ka, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : n("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => n(Tn, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function Il(e, t) {
  const r = new Set(Rt(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function Ua(e, t) {
  return t ? Rt(e).filter((r) => r !== t) : Rt(e);
}
function Cl(e, t) {
  const r = Rt(t), o = new Set(Rt(e));
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
  var g, m, u, y, p, h;
  const i = e.findIndex((f) => f.markers.some((w) => w.segment.id === t));
  if (i < 0) {
    const f = [...((g = e[0]) == null ? void 0 : g.markers) || []];
    return o != null && Number.isFinite(Number(o)) && f.sort((w, v) => Bo(w, v, o)), ((m = f[0]) == null ? void 0 : m.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((f) => f.segment.id === t);
  if (r === "left" || r === "right") {
    const f = r === "left" ? -1 : 1, w = Math.min(a.markers.length - 1, Math.max(0, s + f));
    return ((u = a.markers[w]) == null ? void 0 : u.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((y = a.markers[s]) == null ? void 0 : y.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((p = a.markers[s]) == null ? void 0 : p.segment) ?? null : ((h = [...e[l].markers].sort(c ? (f, w) => Bo(f, w, Number(o)) : (f, w) => Math.abs(f.segment.startSec - d) - Math.abs(w.segment.startSec - d) || f.segment.startSec - w.segment.startSec || f.segment.id - w.segment.id)[0]) == null ? void 0 : h.segment) ?? null;
}
function $l(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = Pr([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function Tl(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function Rl(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function Ml(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [zo(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => zo(Math.min(s, r + l))))];
}
function Al(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function El(e, t) {
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
function Dl(e) {
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
async function Ol(e, t) {
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
      const c = [], g = Ml(
        d.startSec,
        d.endSec
      );
      for (const [m, u] of g.entries()) {
        Math.abs(r.currentTime - u) > 5e-4 && (r.currentTime = u, await Uo(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const y = await Pl(o), p = `example-${l + 1}-frame-${m + 1}`;
        c.push({ fieldName: p, timestampSec: u }), s.push({
          fieldName: p,
          file: new File(
            [y],
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
function Pl(e) {
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
function Ll(e, t) {
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
function za(e, t) {
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
function Fl(e, t) {
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
function jl(e) {
  const { compatibilityMode: t, currentTime: r, detail: o, editorFilters: i, endInput: a, hideDerivedSegments: s, historyRef: l, mediaDuration: d, onConflict: c, onDetailChange: g, onReload: m, optimisticSegmentIdRef: u, pendingDuplicateRef: y, pendingFirstSegmentStartSecRef: p, pendingTagEditSegmentIdRef: h, replaceSegmentSelection: f, savingSegmentId: w, segments: v, selectedSegment: N, selectedSegmentIdRef: W, selectedSegments: j, selectionAnchorIdRef: F, selectionRangeBaseIdsRef: T, setEditorFilters: M, setFirstSegmentTagOpen: E, setHideDerivedSegments: R, setHistory: U, setHistoryOpen: D, setPublishApprovedError: V, setSaveMessage: I, setSavingSegmentId: $, setSelectedSegmentGroupKey: P, setSelectedSegmentId: J, setSelectedSegmentIds: se, startInput: me, timelineDuration: ge, video: B } = e;
  function Q(b) {
    l.current = b || St, U(l.current);
  }
  async function de(b, K, C, x, A = null) {
    var S;
    try {
      const k = await Z(`/videos/${B.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: l.current.revision,
          kind: b,
          label: K,
          beforeState: C,
          afterState: x,
          receiptId: A
        })
      });
      return Q(k), !0;
    } catch (k) {
      return k.status === 409 && ((S = k.payload) != null && S.current) && Q(k.payload.current), I("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function oe(b, K, C = !0, x = null, A = !1, S = K) {
    var re;
    if (!b || w != null) return null;
    const k = j.map((Se) => Se.id), q = W.current, ue = C && !t ? crypto.randomUUID() : null;
    $(b.id), I(C ? "Saving directly to Cove…" : "Restoring history…");
    const ae = A ? rr(o, [b.id], S) : null;
    ae && g(ae, B.id);
    try {
      if (t && b.nativeSegmentId == null && b.itemId != null) {
        const Y = `draft-update:${B.id}:${b.itemId}:${b.revision}:${K.tagId}:${K.startSec}:${K.endSec ?? "open"}:${K.reviewState ?? b.reviewState}`, O = await Z(`/videos/${B.id}/drafts/${b.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(Y),
            expectedRevision: b.revision,
            startSec: K.startSec,
            endSec: K.endSec,
            tagId: K.tagId,
            reviewState: K.reviewState
          })
        });
        Fe(Y);
        const ne = {
          ...b,
          ...O.draft,
          id: b.id,
          itemId: b.itemId
        };
        return C && await de(
          "segment.update",
          x || "Changed segment",
          Vn(b, t),
          Vn(
            ne,
            t
          )
        ), _o(b, K, t) ? await m() : g({
          ...o,
          approvedSetVersion: O.approvedSetVersion || o.approvedSetVersion,
          segments: v.map((ye) => ye.id === b.id ? ne : ye).sort((ye, be) => ye.startSec - be.startSec || ye.id - be.id)
        }, B.id), I(((re = O.draft) == null ? void 0 : re.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), ne;
      }
      const Se = await Z(`/videos/${B.id}/segments/${b.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...K,
          expectedUpdatedAt: b.updatedAt,
          historyReceiptId: ue
        })
      }), H = {
        ...b,
        ...Se,
        reviewState: K.reviewState ?? b.reviewState
      }, ee = v.map((Y) => Y.id === b.id ? H : Y).sort((Y, O) => Y.startSec - O.startSec || Y.id - O.id);
      return _o(b, K, t) ? await m() : g({ ...o, segments: ee }, B.id), C && await de(
        "segment.update",
        x || "Changed segment",
        Vn(b, t),
        Vn(
          H,
          t
        ),
        ue
      ), I(C ? "Saved to Cove" : "History restored"), H;
    } catch (Se) {
      return A && (g((H) => Rn(
        H,
        [b],
        Object.keys(S)
      ), B.id), se(k), J(q), F.current = q, T.current = []), Se.status === 409 ? (I("Conflict — loading the latest segment…"), await c()) : I(Se.message || "Unable to save the segment."), null;
    } finally {
      $(null);
    }
  }
  async function xe() {
    if (!t) return !1;
    const b = v.filter((C) => !C.published && C.reviewState === "approved").length;
    if (b === 0 || w != null) return !1;
    const K = `complete-review:${B.id}:${o.approvedSetVersion}`;
    V(""), $(-1), I(`Publishing ${b} Approved draft${b === 1 ? "" : "s"}…`);
    try {
      const C = await Z(`/videos/${B.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(K),
          expectedApprovedSetVersion: o.approvedSetVersion
        })
      });
      Fe(K), Q(St), D(!1);
      const x = await m(), A = As(
        v,
        W.current,
        C.published
      ), S = A ? He(x == null ? void 0 : x.segments, A) : null;
      return S && J(S.id), I(`${C.published.length} Approved draft${C.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (C) {
      const x = C.status === 409 ? "The approved drafts changed. Review the updated list and try again." : C.message || "Unable to publish the approved drafts.";
      return C.status === 409 && await c(), V(x), I(x), !1;
    } finally {
      $(null);
    }
  }
  async function ke(b = null, K = null) {
    var H;
    if (w != null) return;
    const C = b != null ? p.current : null, x = Number.isFinite(C) ? C : r, A = Math.min(ge, x + 20);
    if (A <= x) {
      I("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const S = Ms(v, N, b);
    if (S.kind === "choose-tag") {
      p.current = x, I(""), E(!0);
      return;
    }
    if (S.kind === "invalid-selection") {
      I("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: k } = S, q = `create-draft:${B.id}:${k}:${x}`, ue = t ? null : crypto.randomUUID(), ae = W.current, re = {
      ...N || {},
      id: u.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: k,
      tagName: K || (N == null ? void 0 : N.tagName) || "Tag segment",
      tagSortName: k === (N == null ? void 0 : N.tagId) && (N == null ? void 0 : N.tagSortName) || null,
      startSec: x,
      endSec: A,
      reviewState: "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, Se = Ll(o, re);
    $(-1), E(!1), g(Se, B.id), f(re.id), P(ut(
      Lt(Se.segments, Se.segmentGroups || [], Se.performerSlots || []),
      re.id
    ));
    try {
      let ee;
      if (t) {
        const ne = await Z(`/videos/${B.id}/drafts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationId: Le(q), tagId: k, startSec: x, endSec: A })
        });
        Fe(q), ee = { itemId: (H = ne.draft) == null ? void 0 : H.itemId };
      } else
        ee = { nativeSegmentId: (await Z(`/videos/${B.id}/segments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tagId: k,
            startSec: x,
            endSec: A,
            historyReceiptId: ue
          })
        })).id };
      p.current = null, E(!1);
      const Y = await m();
      if (!Y) {
        g((ne) => Lr(
          ne,
          [re.id]
        ), B.id), f(ae), I("Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment.");
        return;
      }
      const O = He(Y == null ? void 0 : Y.segments, ee);
      O ? (t || await de(
        "segment.create",
        "Created segment",
        lt([], !1),
        lt([O], !1),
        ue
      ), S.openTagEditor && (h.current = O.id), f(O.id), P(ut(
        Lt(Y.segments || [], Y.segmentGroups || [], Y.performerSlots || []),
        O.id
      ))) : I("Segment created, but it could not be selected.");
    } catch (ee) {
      g((Y) => Lr(
        Y,
        [re.id]
      ), B.id), f(ae), b != null && E(!0), I(ee.message || "Unable to create the draft.");
    } finally {
      $(null);
    }
  }
  async function z() {
    if (j.length !== 1 || !N || w != null) return;
    const b = r;
    if (b <= N.startSec || N.endSec != null && b >= N.endSec) {
      I("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const K = `split-draft:${N.itemId}:${N.revision}:${b}`, C = t ? null : lt([N], !1), x = t ? null : crypto.randomUUID();
    $(N.id);
    try {
      let A = null;
      t && N.nativeSegmentId == null ? (await Z(`/videos/${B.id}/drafts/${N.itemId}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(K),
          expectedRevision: N.revision,
          splitSec: b
        })
      }), Fe(K)) : A = { nativeSegmentId: (await Z(`/videos/${B.id}/segments/${N.id}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedUpdatedAt: N.updatedAt,
          splitSec: b,
          historyReceiptId: x
        })
      })).id };
      const S = await m();
      if (!t) {
        const k = [
          He(S == null ? void 0 : S.segments, {
            nativeSegmentId: N.nativeSegmentId ?? N.id
          }),
          He(
            S == null ? void 0 : S.segments,
            A
          )
        ].filter(Boolean);
        await de(
          "segment.split",
          "Split segment",
          C,
          lt(k, !1),
          x
        );
      }
      I(t ? `Segment split; both ranges remain ${N.reviewState}.` : "Segment split.");
    } catch (A) {
      A.status === 409 ? await c() : I(A.message || "Unable to split the draft.");
    } finally {
      $(null);
    }
  }
  async function te(b = !1) {
    var A, S;
    if (j.length !== 1 || !N || w != null) return;
    const K = b ? r : N.startSec, C = Rs(B.id, N, b, K), x = t ? null : crypto.randomUUID();
    $(N.id);
    try {
      const k = ((A = y.current) == null ? void 0 : A.operationKey) === C ? y.current : null;
      let q = (k == null ? void 0 : k.duplicateIdentity) ?? null;
      if (q == null && t && N.nativeSegmentId == null) {
        const re = await Z(`/videos/${B.id}/drafts/${N.itemId}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(C),
            expectedRevision: N.revision,
            startSec: b ? K : null
          })
        });
        q = $o(!1, re), y.current = { operationKey: C, duplicateIdentity: q };
      } else if (q == null) {
        const re = await Z(`/videos/${B.id}/segments/${N.id}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: N.updatedAt,
            startSec: b ? K : null,
            historyReceiptId: x
          })
        });
        q = $o(!0, re), y.current = { operationKey: C, duplicateIdentity: q };
      }
      const ue = await m(), ae = He(ue == null ? void 0 : ue.segments, q);
      if (ae) {
        t || await de(
          "segment.duplicate",
          "Duplicated segment",
          lt([], !1),
          lt([ae], !1),
          x
        );
        const re = ns(
          ae,
          ue.performerSlots || [],
          i,
          s,
          ue.segmentGroups || []
        );
        M(re.filters), R(re.hideDerivedSegments), se([ae.id]), J(ae.id), F.current = ae.id, T.current = [], P(ut(
          Lt(ue.segments || [], ue.segmentGroups || [], ue.performerSlots || []),
          ae.id
        )), t && N.nativeSegmentId == null && Fe(C), y.current = null, I(b ? "Duplicate created at the playhead." : "Duplicate created in place.");
      } else
        I("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
    } catch (k) {
      ((S = y.current) == null ? void 0 : S.operationKey) === C ? I("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : k.status === 409 ? await c() : I(k.message || "Unable to duplicate the draft.");
    } finally {
      $(null);
    }
  }
  async function X() {
    if (j.length !== 1 || !N) return;
    const b = Number(me), K = a.trim() === "" ? null : Number(a), C = So(b, K, d);
    if (C.error) {
      I(C.error);
      return;
    }
    if (b === N.startSec && K === N.endSec) {
      I("Timing is unchanged.");
      return;
    }
    await oe(N, { startSec: b, endSec: K, tagId: N.tagId }, !0, null, !0);
  }
  async function le(b, K) {
    if (j.length !== 1 || !N) return;
    const C = So(b, K, d);
    if (C.error) {
      I(C.error);
      return;
    }
    if (b === N.startSec && K === N.endSec) {
      I("Timing is unchanged.");
      return;
    }
    await oe(N, { startSec: b, endSec: K, tagId: N.tagId }, !0, null, !0);
  }
  return { acceptHistory: Q, recordHistoryAction: de, mutateSegment: oe, completeReview: xe, createSegment: ke, splitSegment: z, duplicateSegment: te, saveTiming: X, applyShortcutTiming: le };
}
function Bl() {
  const [e, t] = L(() => typeof window < "u" && window.matchMedia(ho).matches);
  return fe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(ho), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Gl() {
  const [e, t] = L(() => typeof window < "u" && window.matchMedia(vo).matches);
  return fe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(vo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Kl() {
  try {
    return Yi(window.localStorage.getItem(ia));
  } catch {
    return { ...rt };
  }
}
function Ul() {
  try {
    return Rt(JSON.parse(window.localStorage.getItem(sa) || "[]"));
  } catch {
    return [];
  }
}
function zl(e) {
  try {
    window.localStorage.setItem(sa, JSON.stringify(Rt(e)));
  } catch {
  }
}
function _l(e) {
  try {
    window.localStorage.setItem(ia, JSON.stringify(e));
  } catch {
  }
}
function Hl() {
  try {
    const e = JSON.parse(window.localStorage.getItem(da) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function ql(e) {
  try {
    return window.localStorage.setItem(da, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Wl({ status: e }) {
  const t = Pa[e];
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
      ...Da(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${mt[t].symbol}${e[t]}`)));
}
function Vl({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: g, shortcutRef: m }) {
  const u = zr(a), [y, p] = L(() => Cr(o, u)), [h, f] = L(!1), [w, v] = L(""), N = pe(!1), W = o.map((R) => `${R.slotDefinitionId}:${R.performerId || ""}`).join("|"), j = u.map((R) => Ve(R)).join("|"), F = Ca(
    o,
    u
  );
  fe(() => {
    p(Cr(o, u)), v("");
  }, [t, r, W, j]);
  async function T(R = y) {
    if (!N.current) {
      N.current = !0, f(!0), v("Saving performer slots…");
      try {
        const U = Cr(o.map((I) => ({
          ...I,
          performerId: R[I.slotDefinitionId] || null
        })), u), D = o.map((I) => {
          const $ = U[I.slotDefinitionId] ? Number(U[I.slotDefinitionId]) : null, P = u.find((J) => String(Ve(J)) === String($));
          return {
            ...I,
            performerId: $,
            performerName: (P == null ? void 0 : P.name) || null
          };
        });
        s(D);
        const V = await Z(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((I) => ({ slotDefinitionId: I.slotDefinitionId, performerId: U[I.slotDefinitionId] ? Number(U[I.slotDefinitionId]) : null }))
          })
        });
        v("Performer slots saved."), await l(V, {
          beforeState: tr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: tr([{
            segmentId: t,
            itemId: r,
            revision: V.revision,
            slots: V.slots || []
          }])
        });
      } catch (U) {
        d && await d(o, U), U.status === 409 ? (v("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : v(U.message || "Unable to save performer slots.");
      } finally {
        N.current = !1, f(!1);
      }
    }
  }
  function M(R, U) {
    v(`Option ${U + 1} applied; save to confirm.`), p({ ...y, ...R.assignments });
  }
  async function E(R) {
    const U = { ...y, ...R.assignments };
    p(U), await T(U);
  }
  return fe(() => {
    if (m)
      return m.current = (R) => N.current || !F[R] ? !1 : (E(F[R]), !0), () => {
        m.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    F.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, F.map((R, U) => n("button", {
        key: U,
        type: "button",
        disabled: h,
        onClick: () => M(R, U),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${U + 1}: ${R.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, U + 1),
        n("span", { key: "description" }, R.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${F.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((R) => n("label", { key: R.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, et(R)),
      (R.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(R.genderHints || []).map(ar).join(" · ")}`) : null,
      n("select", { key: "select", value: y[R.slotDefinitionId] || "", disabled: h, onChange: (U) => p({ ...y, [R.slotDefinitionId]: U.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...$a(u, u, R.genderHints).map((U) => n("option", { key: Ve(U), value: Ve(U) }, U.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: g, type: "button", disabled: h, onClick: () => T(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, w)])
  ]);
}
function Jl({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a }) {
  var F;
  const s = ((F = t[0]) == null ? void 0 : F.slots) || [], l = zr(r), d = Ca(
    s,
    l
  ), c = "__mixed__", g = () => Object.fromEntries(s.map((T, M) => {
    const E = t.map((R) => {
      var U;
      return String(((U = R.slots[M]) == null ? void 0 : U.performerId) || "");
    });
    return [T.slotDefinitionId, E.every((R) => R === E[0]) ? E[0] : c];
  })), [m, u] = L(g), [y, p] = L(!1), [h, f] = L(""), w = pe(!1), v = t.map((T) => `${T.itemId ?? `native:${T.segmentId}`}:${T.revision}:${T.slots.map((M) => `${M.slotDefinitionId}:${M.performerId || ""}`).join(",")}`).join("|");
  fe(() => {
    u(g());
  }, [v]);
  async function N(T = m) {
    if (w.current) return;
    w.current = !0, p(!0), f(`Saving performer slots for ${t.length} segments…`);
    const M = [];
    try {
      for (const E of t) {
        const R = E.slots.map((D, V) => {
          const I = T[s[V].slotDefinitionId];
          return {
            slotDefinitionId: D.slotDefinitionId,
            performerId: I === c ? D.performerId || null : I ? Number(I) : null
          };
        }), U = await Z(E.itemId != null ? `/videos/${e}/drafts/${E.itemId}/slots` : `/videos/${e}/segments/${E.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: E.revision, assignments: R })
        });
        M.push({
          segmentId: E.segmentId,
          itemId: E.itemId,
          revision: U.revision,
          slots: U.slots || []
        });
      }
      f("Performer slots saved."), o({
        beforeState: tr(t),
        afterState: tr(M)
      });
    } catch (E) {
      const R = await i();
      E.status === 409 ? f(R ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : f(E.message || (R ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      w.current = !1, p(!1);
    }
  }
  function W(T, M) {
    f(`Option ${M + 1} applied; save to confirm.`), u({ ...m, ...T.assignments });
  }
  async function j(T) {
    const M = { ...m, ...T.assignments };
    u(M), await N(M);
  }
  return fe(() => {
    if (a)
      return a.current = (T) => w.current || !d[T] ? !1 : (j(d[T]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, d.map((T, M) => n("button", {
        key: M,
        type: "button",
        disabled: y,
        onClick: () => W(T, M),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${M + 1} to all selected segments: ${T.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, M + 1),
        n("span", { key: "description" }, T.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${d.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, s.map((T) => n("label", {
      key: T.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, et(T)),
      n("select", {
        key: "select",
        value: m[T.slotDefinitionId] || "",
        disabled: y,
        onChange: (M) => u({ ...m, [T.slotDefinitionId]: M.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        m[T.slotDefinitionId] === c ? n("option", { key: "mixed", value: c }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...$a(l, l, T.genderHints).map((M) => n("option", {
          key: Ve(M),
          value: Ve(M)
        }, M.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: y,
        onClick: () => N(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, h)
    ])
  ]);
}
function gt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function Yl(e, t) {
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
function Jn({ name: e }) {
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
function Ql({ hidden: e }) {
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
function Zl({ segment: e, provenance: t }) {
  var g;
  const [r, o] = L(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = Yl(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
        const u = m.modelIdentifier || m.modelKey, y = m.value == null ? null : typeof m.value == "string" ? m.value : JSON.stringify(m.value);
        return n("div", { key: m.id || `${m.fieldKey}:${m.sourceKey}:${m.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            gt(m.sourceKey, m.sourceDisplayName)
          ),
          m.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${m.fieldKey}${y == null ? "" : ` · ${y}`}`
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
function Xl({
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
  const [m, u] = L([]), y = e.flatMap((w) => w.lanes.map((v) => v.key)), p = y.join("|");
  fe(() => {
    const w = new Set(y);
    u((v) => v.filter((N) => w.has(N)));
  }, [p]);
  const h = nr(t), f = !!Ga(
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
        `${y.length} swimlane${y.length === 1 ? "" : "s"} · ${e.length} group${e.length === 1 ? "" : "s"}`
      ),
      a ? n(Tt, { key: "counts", counts: h }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      pl({ mergeable: f, reviewable: a, tagEditable: s, slotsEditable: l })
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
        const N = m.includes(v.key), W = v.markers.some(({ segment: F }) => F.id === r), j = `selected-segment-lane-${v.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: v.key,
          "data-selected-segment-lane": v.key,
          className: `rounded-md border ${W ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": N,
            "aria-controls": j,
            "aria-current": W ? "true" : void 0,
            onClick: () => u((F) => N ? F.filter((T) => T !== v.key) : [...F, v.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, N ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, $n(v)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(v.selectedCount)),
            a ? n(Tt, { key: "states", counts: v.counts }) : null
          ]),
          N ? n("div", {
            key: "segments",
            id: j,
            className: "space-y-1 border-t border-border p-1.5"
          }, v.markers.map(({ segment: F }) => {
            const T = F.endSec == null ? $e(F.startSec) : `${$e(F.startSec)} – ${$e(F.endSec)}`;
            return n("button", {
              key: F.id,
              type: "button",
              onClick: () => i(F),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${F.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${F.tagName || "Segment"}, ${F.reviewState}, ${T}` : `${F.tagName || "Segment"}, ${T}`,
              "aria-current": F.id === r ? "true" : void 0
            }, [
              a ? n(jt, {
                key: "state",
                state: F.reviewState,
                includeLabel: !1
              }) : null,
              F.isDerived ? n(sr, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, T),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                gt(F.sourceKey)
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
function An(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function _a(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function Wo(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function Yn(e, t, r, o = null) {
  const i = Wo(t), a = Wo(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function ed(e, t, r = null) {
  var m, u, y;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (m = t.hasSegmentsCriterion) == null ? void 0 : m.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), Yn(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), Yn(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), Yn(o, t.performersCriterion, "performer"), Yn(o, t.studiosCriterion, "studio", "includeSubstudios");
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
  const g = (y = t.shotBoundariesCriterion) == null ? void 0 : y.value;
  return r && typeof g == "boolean" ? o.set("hasShotBoundaries", String(g)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function Vo(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function Ha({ item: e, showReviewStates: t = !1 }) {
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
function td({ item: e, onNavigate: t, showReviewStates: r = !1 }) {
  const o = { page: "segment-studio", id: e.videoId };
  return n("article", { className: "group relative flex min-h-full flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm transition-colors hover:border-accent/60" }, [
    n("a", {
      key: "link",
      href: `/segment-studio/${e.videoId}`,
      onClick: (i) => An(i, t, o),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, Oi(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(Ha, { item: e, showReviewStates: r }))
    ])
  ]);
}
function nd({ item: e, onNavigate: t, showReviewStates: r = !1 }) {
  const o = { page: "segment-studio", id: e.videoId };
  return n("article", { className: "overflow-hidden rounded-md border border-border bg-card" }, n("a", {
    href: `/segment-studio/${e.videoId}`,
    onClick: (i) => An(i, t, o),
    className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
    "aria-label": `Open segment editor for ${e.title}`
  }, [
    n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
    n("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
      n("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
      n(Ha, { key: "segments", item: e, showReviewStates: r })
    ]),
    n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
  ]));
}
function Vr({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = Ps(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => An(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && Zt(
        o,
        kt.recyclingBinView
      ) ? n(qa, { key: "bin", onNavigate: t }) : null,
      n(Wa, { key: "settings", onNavigate: t })
    ])
  ]);
}
const Fr = "segment-studio:recycling-bin-changed";
function rd(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function Nn() {
  window.dispatchEvent(new CustomEvent(Fr));
}
function qa({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = L(null);
  fe(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const g = await Z("/bin"), m = Number(g == null ? void 0 : g.totalCount);
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
  const i = rd(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => An(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function Wa({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => An(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function od({ mode: e, onModeChange: t, disabled: r = !1 }) {
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
function ad({ minimum: e, maximum: t, onChange: r }) {
  const o = pe(null), [i, a] = L("maximum"), s = (u, y) => {
    const p = as(e, t, u, y);
    a(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (u, y) => {
    var h;
    const p = (h = o.current) == null ? void 0 : h.getBoundingClientRect();
    p && s(u, os(y.clientX, p.left, p.width));
  }, d = (u, y) => {
    var p, h;
    y.preventDefault(), (h = (p = y.currentTarget).setPointerCapture) == null || h.call(p, y.pointerId), l(u, y);
  }, c = (u, y) => {
    var p, h;
    (h = (p = y.currentTarget).hasPointerCapture) != null && h.call(p, y.pointerId) && l(u, y);
  }, g = (u, y) => {
    const p = u === "minimum" ? e : t, h = u === "minimum" ? 0 : e, f = u === "minimum" ? t : 1, w = y.shiftKey ? 0.1 : 0.01;
    let v = null;
    ["ArrowLeft", "ArrowDown"].includes(y.key) && (v = p - w), ["ArrowRight", "ArrowUp"].includes(y.key) && (v = p + w), y.key === "PageDown" && (v = p - 0.1), y.key === "PageUp" && (v = p + 0.1), y.key === "Home" && (v = h), y.key === "End" && (v = f), v != null && (y.preventDefault(), s(u, Math.min(f, Math.max(h, v))));
  }, m = (u, y) => n("span", {
    key: u,
    role: "slider",
    tabIndex: 0,
    "aria-label": u === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((u === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((u === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(y * 100),
    "aria-valuetext": `${Math.round(y * 100)} percent`,
    onPointerDown: (p) => d(u, p),
    onPointerMove: (p) => c(u, p),
    onKeyDown: (p) => g(u, p),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${y * 100}%`,
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
function id({ saving: e, error: t, onSelect: r, onClose: o }) {
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
    n(In, {
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
function sd({
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
  const m = dt(e), u = [...new Map((a || []).map((f) => [
    Number(f.tagId),
    f.tagName || `Tag ${f.tagId}`
  ])).entries()].sort((f, w) => f[1].localeCompare(w[1]) || f[0] - w[0]), y = (f) => d(dt({ ...m, ...f })), p = (f) => y({
    reviewStates: m.reviewStates.includes(f) ? m.reviewStates.filter((w) => w !== f) : [...m.reviewStates, f]
  }), h = (f) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${f ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (f) => {
      f.target === f.currentTarget && g();
    },
    onKeyDownCapture: (f) => ot(f, { onCancel: g })
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
        n("div", { className: "flex flex-wrap gap-2" }, Xe.map((f) => {
          const w = m.reviewStates.includes(f), v = mt[f];
          return n("button", {
            key: f,
            type: "button",
            onClick: () => p(f),
            "aria-pressed": w,
            className: h(w)
          }, `${v.symbol} ${f} (${i[f] || 0})`);
        }))
      ]) : null,
      l ? n("fieldset", { key: "performer", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Performer"),
        n("p", { className: "text-xs text-secondary" }, "Any assigned slot may match the selected performer."),
        n("div", { className: "flex flex-wrap gap-2" }, [
          n("button", {
            key: "any",
            type: "button",
            onClick: () => y({ performerId: null }),
            "aria-pressed": m.performerId == null,
            className: h(m.performerId == null)
          }, "All performers"),
          ...r.map((f) => {
            const w = Number(Ve(f));
            return n("button", {
              key: w,
              type: "button",
              onClick: () => y({ performerId: w }),
              "aria-pressed": m.performerId === w,
              className: h(m.performerId === w)
            }, f.name);
          })
        ])
      ]) : null,
      n("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        n("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Tag"),
          n("select", {
            key: "select",
            value: m.tagId ?? "",
            onChange: (f) => y({
              tagId: f.target.value === "" ? null : Number(f.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...u.map(([f, w]) => n("option", { key: f, value: f }, w))
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
            onChange: (f) => y({
              segmentGroupId: f.target.value === "" ? null : f.target.value === "ungrouped" ? "ungrouped" : Number(f.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All Segment groups"),
            ...(s || []).map((f) => n("option", { key: f.id, value: f.id }, f.name)),
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
            onClick: () => y({ sourceKey: null }),
            "aria-pressed": m.sourceKey == null,
            className: h(m.sourceKey == null)
          }, "All provenance"),
          ...o.map((f) => n("button", {
            key: f,
            type: "button",
            onClick: () => y({ sourceKey: f }),
            "aria-pressed": m.sourceKey === f,
            title: f,
            className: h(m.sourceKey === f)
          }, gt(f)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(ad, {
          minimum: m.confidenceMin,
          maximum: m.confidenceMax,
          onChange: ({ minimum: f, maximum: w }) => y({
            confidenceMin: f,
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
            onChange: (f) => y({
              includeUnscored: f.target.checked
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
          onChange: (f) => c(f.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]"
        }),
        n(Ql, { key: "icon", hidden: t }),
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
function ld({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Mn.filter((l) => Qt(l, e)), i = Io(o, 1)[0], a = Io(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((g) => n("div", { key: g.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, g.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[g.id] ? t[g.id].length > 0 ? t[g.id] : ["Unassigned"] : g.bindings.map(xa)).map((m, u) => n("kbd", { key: `${g.id}:${u}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, m))
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
function dd({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = Dl(e), [l, d] = L([]), c = s.map((g) => g.tagName).join("|");
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
        const u = l.includes(g.tagName), y = `incorrect-example-tag-${m}`;
        return n("section", {
          key: g.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": u,
            "aria-controls": y,
            onClick: () => d((p) => u ? p.filter((h) => h !== g.tagName) : [...p, g.tagName]),
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
            id: y,
            className: "divide-y divide-border border-t border-border"
          }, g.examples.map((p) => {
            const h = `${$e(p.startSec)}${p.endSec == null ? "" : ` – ${$e(p.endSec)}`}`, f = r === p.id;
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
                "aria-label": `${f ? "Restoring" : "Restore to review"} ${g.tagName} example at ${h}`,
                className: "rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
              }, f ? "Restoring…" : "Restore to review")
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
function cd({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = L(""), [a, s] = L(0), l = pe(null), d = Ge(() => Ws(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = Js(d);
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
      var y;
      if (u.key === "Tab")
        yt(u);
      else if (u.key === "Escape")
        u.preventDefault(), u.stopPropagation(), r();
      else if (u.key === "ArrowDown" || u.key === "ArrowUp") {
        u.preventDefault(), u.stopPropagation();
        const p = u.key === "ArrowDown" ? 1 : -1;
        s((h) => d.length ? (h + p + d.length) % d.length : 0);
      } else u.key === "Enter" && !((y = u.nativeEvent) != null && y.isComposing) && (u.preventDefault(), u.stopPropagation(), m());
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
    }, d.length ? d.flatMap((u, y) => {
      var j;
      const p = u.segment || u, h = p.endSec == null ? $e(p.startSec) : `${$e(p.startSec)} – ${$e(p.endSec)}`, f = `${gt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, w = y === c, v = y > 0 ? d[y - 1].groupKey : null, N = g && u.groupKey !== v ? n("div", {
        key: `group:${u.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, u.groupName) : null, W = n("button", {
        key: p.id,
        id: `segment-quick-search-${p.id}`,
        ref: w ? l : null,
        type: "button",
        role: "option",
        "aria-selected": w,
        onMouseEnter: () => s(y),
        onClick: () => t(p),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${w ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        g ? n("span", { key: "group", className: "sr-only" }, `${u.groupName} group`) : null,
        n(jt, { key: "review", state: p.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        (j = u.performers) != null && j.length ? n(ir, {
          key: "performers",
          performers: u.performers,
          performerAssignments: u.performerAssignments
        }) : null,
        n(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          h
        ),
        n("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: f
        }, f)
      ]);
      return N ? [N, W] : [W];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function ud(e) {
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
function md({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = Ge(() => ud(e), [e]), [l, d] = L([]), c = s.reduce((u, y) => u + y.drafts.length, 0), g = (u) => d((y) => y.includes(u) ? y.filter((p) => p !== u) : [...y, u]), m = (u) => `segment-studio-publish-approved-${u.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
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
      ].flatMap(([u, y]) => [
        n("dt", { key: `${u}:label`, className: "text-secondary" }, u),
        n("dd", { key: `${u}:value`, className: "font-semibold text-foreground" }, String(y))
      ])),
      s.length ? n("div", { key: "groups", className: "space-y-2" }, s.map((u) => {
        const y = l.includes(u.key);
        return n("section", { key: u.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": y,
            "aria-controls": m(u),
            onClick: () => g(u.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: or(!1) }
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, y ? "▾" : "▸"),
            n("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, u.tagName),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${u.drafts.length} draft${u.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          y ? n("div", {
            key: "drafts",
            id: m(u),
            className: "divide-y divide-border border-t border-border"
          }, u.drafts.map((p) => {
            const h = p.endSec == null ? $e(p.startSec) : `${$e(p.startSec)} – ${$e(p.endSec)}`, f = `${gt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`;
            return n("div", { key: p.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(jt, { key: "review", state: p.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, h),
              n("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: f
              }, f)
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
function gd({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = qs(e), [s, l] = L(() => /* @__PURE__ */ new Set()), [d, c] = L(() => new Set(a.map((h) => h.key))), g = a.flatMap((h) => d.has(h.key) ? h.candidates : []), m = (h) => l((f) => {
    const w = new Set(f);
    return w.has(h) ? w.delete(h) : w.add(h), w;
  }), u = (h) => c((f) => {
    const w = new Set(f);
    return w.has(h) ? w.delete(h) : w.add(h), w;
  }), y = (h) => h.assignment.map(({ slot: f, performer: w }) => `${f.label || `Slot ${f.sortOrder + 1}`}: ${w.name}`).join(", "), p = (h) => `segment-studio-auto-assign-${h.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && !t && i();
    },
    onKeyDownCapture: (h) => {
      h.key === "Enter" && h.target instanceof HTMLInputElement || ot(h, {
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
      e.length ? n("div", { className: "space-y-3" }, a.map((h) => n("section", { key: h.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
        n("header", {
          key: "header",
          className: "flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2",
          style: { background: or(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(h.key),
            disabled: t,
            onChange: () => u(h.key),
            "aria-label": `Include ${h.tagName} assignment: ${y(h)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(h.key),
            "aria-controls": p(h),
            "aria-label": `${s.has(h.key) ? "Collapse" : "Expand"} ${h.tagName} assignment: ${y(h)}`,
            onClick: () => m(h.key),
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
            h.assignment.map(({ slot: f, performer: w }) => {
              const v = f.label || `Slot ${f.sortOrder + 1}`;
              return n("span", {
                key: f.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${v}: ${w.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${v}: ${w.name}`
                }, `${v}: ${w.name}`),
                n(Tn, {
                  key: "avatar",
                  performer: { id: w.performerId, name: w.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(Tt, { key: "states", counts: h.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(h.candidates),
            "aria-label": `Auto-Assign ${h.tagName}: ${y(h)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${h.candidates.length})`)
        ]),
        s.has(h.key) ? n(
          "div",
          { key: "segments", id: p(h), className: "divide-y divide-border/70" },
          h.candidates.map((f) => {
            const w = f.endSec == null ? $e(f.startSec) : `${$e(f.startSec)} – ${$e(f.endSec)}`, v = `${gt(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`;
            return n("div", {
              key: f.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(jt, { key: "review", state: f.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                f.tagName || "Tag segment"
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
function pd({ preview: e, onConfirm: t, onClose: r }) {
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
function fd({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = L(!1);
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
function yd(e) {
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
function bd({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var g, m;
  const l = e ? e.createCount + e.linkCount : 0, d = ((g = e == null ? void 0 : e.outputs) == null ? void 0 : g.slice(0, 200)) || [], c = yd(d);
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
        ].flatMap(([u, y]) => [
          n("dt", { key: `${u}:label`, className: "text-secondary" }, u),
          n("dd", { key: `${u}:value`, className: "font-semibold text-foreground" }, String(y))
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
              u.outputs.map((y, p) => n("div", {
                key: `${y.ruleId}:${y.depth}:${p}`,
                className: "flex min-w-0 items-center gap-2 text-sm",
                style: { marginLeft: `${Math.max(0, y.depth - 1) * 1.25}rem` }
              }, [
                n("span", { key: "branch", "aria-hidden": "true", className: "shrink-0 text-secondary" }, "↳"),
                n(
                  "span",
                  { key: "tags", className: "min-w-0 flex-1 truncate text-foreground" },
                  `${y.sourceTagName} → ${y.derivedTagName}`
                ),
                n("span", { key: "depth", className: "shrink-0 text-[11px] text-secondary" }, `Level ${y.depth}`),
                n(
                  "span",
                  { key: "action", className: "shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-foreground" },
                  y.action === "create" ? "Create" : "Link existing"
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
function hd({
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
  video: y,
  slotButtonRef: p,
  tagSearchRef: h,
  onDetailChange: f,
  setSaveMessage: w,
  setSavingSegmentId: v,
  onSlotsChanged: N,
  onRecordHistory: W,
  onCancelQueuedReview: j,
  splitSegment: F,
  duplicateSegment: T,
  provenance: M,
  lineage: E,
  onNavigateLineageItem: R,
  tagEditing: U,
  onCancelTagEditing: D,
  detailPanelRef: V,
  onReduceSelection: I
}) {
  var de, oe, xe, ke;
  const $ = pe(null), P = pe(null), J = pe(null), se = pe(null), me = pe(null), [ge, B] = L(!1);
  fe(() => {
    $.current && ($.current.scrollTop = 0), B(!1);
  }, [t == null ? void 0 : t.id]), fe(() => {
    var z, te;
    ge && ((te = (z = P.current) == null ? void 0 : z.querySelector("input, select, button")) == null || te.focus({ preventScroll: !0 }));
  }, [ge]);
  function Q() {
    B(!1), requestAnimationFrame(() => {
      var z;
      return (z = p.current) == null ? void 0 : z.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const z = !r.some((le) => le.isDerived), te = e && c ? gl(m, r) : null, X = (te == null ? void 0 : te.map((le, b) => {
      var C;
      const K = r[b];
      return {
        segmentId: K.nativeSegmentId,
        itemId: K.published ? null : K.itemId,
        revision: (C = u.performerSlotRevisions) == null ? void 0 : C[K.id],
        slots: le
      };
    })) || [];
    return n(jr.Fragment, null, [
      n(Xl, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: V,
        onReduceSelection: I,
        reviewable: e,
        tagEditable: z,
        slotsEditable: X.length > 0 && a == null,
        onEditSlots: () => B(!0),
        slotButtonRef: p,
        saveMessage: i
      }),
      U && z ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (le) => {
          le.target === le.currentTarget && D();
        },
        onKeyDownCapture: (le) => ot(le, { onCancel: D })
      }, n("section", {
        ref: h,
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
        n(In, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (le, b) => le == null ? D() : s(le, b == null ? void 0 : b.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: D,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      ge && X.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (le) => {
          le.target === le.currentTarget && Q();
        },
        onKeyDownCapture: (le) => {
          var K, C;
          if (!(typeof ((K = le.target) == null ? void 0 : K.closest) == "function" ? le.target.closest("input, textarea, select, [contenteditable='true']") : null) && !le.repeat && !le.ctrlKey && !le.altKey && !le.metaKey && !le.shiftKey && /^[1-9]$/.test(le.key) && ((C = me.current) != null && C.call(me, Number(le.key) - 1))) {
            le.preventDefault(), le.stopPropagation();
            return;
          }
          ot(le, { onCancel: Q });
        }
      }, n("section", {
        ref: P,
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
          n("button", { key: "close", type: "button", onClick: Q, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Jl, {
          videoId: y.id,
          targets: X,
          performerCandidates: u.performerCandidates || [],
          shortcutRef: me,
          onSaved: async ({ beforeState: le, afterState: b }) => {
            await W(
              "performer-slots.assign",
              `Assigned performers to ${X.length} segments`,
              le,
              b
            ), Q(), N();
          },
          onConflict: N
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (z) => {
      $.current = z, V && (V.current = z);
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
        t && U ? n("div", {
          key: "tag-editor",
          ref: h,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (z) => {
            z.key === "Escape" && (z.preventDefault(), z.stopPropagation(), D());
          },
          onKeyDown: (z) => {
            cl(z, t.tagName) && (z.preventDefault(), z.stopPropagation(), s(t.tagId));
          }
        }, n(In, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (z, te) => z == null ? D() : s(z, te == null ? void 0 : te.label),
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
      e && t && (d === "empty" || d === "partial") ? n("div", { key: "slots-row" }, n(Wl, { status: d })) : null,
      t && c && g.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(Ka, {
        assignments: g.map((z) => {
          const te = bl(z);
          return {
            key: String(z.slotDefinitionId),
            label: te.label,
            performer: te.filled ? { id: Number(z.performerId), name: te.performer } : null,
            title: te.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(Zl, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: M
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
          (oe = E.data.parents) != null && oe.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...E.data.parents.map((z) => n("button", {
              key: z.nodeId,
              type: "button",
              onClick: () => R(z.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${z.ruleKey} ${z.ruleVersion}`))
          ]) : null,
          (xe = E.data.children) != null && xe.length ? n("p", { key: "children" }, `Children: ${E.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: l, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: p,
          type: "button",
          disabled: a != null || !c || g.length === 0,
          onClick: () => B(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: c ? g.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, g.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: F,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        n("button", {
          key: "duplicate",
          type: "button",
          disabled: a != null,
          onClick: () => T(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        n("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: a != null,
          onClick: () => T(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    ge && e && t && c && g.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (z) => {
        z.target === z.currentTarget && Q();
      },
      onKeyDownCapture: (z) => {
        var X, le;
        if (!(typeof ((X = z.target) == null ? void 0 : X.closest) == "function" ? z.target.closest("input, textarea, select, [contenteditable='true']") : null) && !z.repeat && !z.ctrlKey && !z.altKey && !z.metaKey && !z.shiftKey && /^[1-9]$/.test(z.key) && ((le = se.current) != null && le.call(se, Number(z.key) - 1))) {
          z.preventDefault(), z.stopPropagation();
          return;
        }
        ot(z, {
          onCancel: Q,
          onConfirm: () => {
            var b;
            return (b = J.current) == null ? void 0 : b.click();
          }
        });
      }
    }, n("section", {
      ref: P,
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
        n("button", { key: "close", type: "button", onClick: Q, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Vl, {
        key: `${t.id}:${u.performerSlotsRevision || u.slotRevision || ""}`,
        videoId: y.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: g,
        revision: (ke = u.performerSlotRevisions) == null ? void 0 : ke[t.id],
        performerCandidates: u.performerCandidates || [],
        confirmRef: J,
        shortcutRef: se,
        onOptimisticSave: (z) => {
          f((te) => $r(
            te,
            t.id,
            z
          ), y.id), v(t.id), w("Saving performer slots…"), Q();
        },
        onSaved: async (z, { beforeState: te, afterState: X }) => {
          f((le) => $r(
            le,
            t.id,
            z.slots || [],
            z.revision
          ), y.id), w("Performer slots saved.");
          try {
            await W(
              "performer-slots.assign",
              "Assigned performers",
              te,
              X
            ), await N(z) || j([t]);
          } finally {
            v(null);
          }
        },
        onRollback: async (z, te) => {
          j([t]), f((X) => {
            var le;
            return $r(
              X,
              t.id,
              z,
              (le = u.performerSlotRevisions) == null ? void 0 : le[t.id]
            );
          }, y.id), w(te.message || "Unable to save performer slots.");
          try {
            te.status === 409 && await N();
          } finally {
            v(null);
          }
        },
        onConflict: N
      }))
    ])) : null
  ]);
}
function vd({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: m, onSelectGroup: u, onToggleGroup: y, onSelect: p, onSelectSegments: h, onSelectAll: f, onConfigureTag: w, onSeekTime: v, centerRef: N, showReviewState: W = !0, swimlaneTitleWidth: j, onSwimlaneTitleWidthChange: F }) {
  const T = pe(null), M = pe(null), [E, R] = L(0), [U, D] = L({ scrollTop: 0, height: 320 }), [V, I] = L(null), $ = Ge(
    () => Lt(e, r, o),
    [e, r, o]
  ), P = Ge(
    () => ja(o),
    [o]
  ), J = Ge(() => Wr($), [$]), se = Ge(
    () => kl(J, i, r.length > 0),
    [J, i, r.length]
  ), me = Ge(
    () => Ba(se.rows, Math.max(0, U.scrollTop - 24), U.height),
    [se, U]
  ), ge = Math.max(0, Number(d) || 0), B = Ji(E), Q = Qn(j, B), de = Q / 16, oe = Wi(c, ge, de), xe = Ui(ge), ke = zi(ge, Math.max(1, E - de * 16), g), z = xe.filter((S, k) => k === 0 || k % ke === 0), te = Ge(() => $.map((S) => `${S.key}:${S.trackCount}:${S.markers.map(({ segment: k, track: q }) => `${k.id}:${k.startSec}:${k.endSec ?? ""}:${q}`).join(",")}`).join("|"), [$]);
  function X() {
    const S = M.current;
    if (!S) return;
    const k = S.querySelector("[data-timeline-track]"), q = S.firstElementChild, ue = k == null ? void 0 : k.getBoundingClientRect(), ae = q == null ? void 0 : q.getBoundingClientRect(), re = ue && ae ? Math.max(0, ue.left - ae.left) : de * 16, Se = (ae == null ? void 0 : ae.width) ?? S.scrollWidth;
    S.scrollTo({
      left: qi(c, ge, Se, S.clientWidth, re, ma),
      behavior: "smooth"
    });
  }
  fe(() => (N.current = X, () => {
    N.current === X && (N.current = null);
  })), fe(() => {
    X();
  }, [g]);
  function le() {
    const S = M.current, k = se.rows.find((Se) => Se.kind === "lane" && Se.lane.markers.some(({ segment: H }) => H.id === s));
    if (!S || !k) return;
    const q = 24, ue = k.top + q, ae = ue + k.height;
    let re = S.scrollTop;
    ue < S.scrollTop + q ? re = Math.max(0, ue - q) : ae > S.scrollTop + S.clientHeight && (re = Math.max(0, ae - S.clientHeight)), re !== S.scrollTop && (S.scrollTop = re), D({ scrollTop: re, height: S.clientHeight });
  }
  fe(() => {
    le();
  }, [s, te, se]), fe(() => {
    const S = M.current, k = se.rows.find((Se) => Se.kind === "group" && Se.group.key === a);
    if (!S || !k) return;
    const q = 24, ue = k.top + q, ae = ue + k.height;
    let re = S.scrollTop;
    ue < S.scrollTop + q ? re = Math.max(0, ue - q) : ae > S.scrollTop + S.clientHeight && (re = Math.max(0, ae - S.clientHeight)), re !== S.scrollTop && (S.scrollTop = re), D({ scrollTop: re, height: S.clientHeight });
  }, [a, se]), fe(() => {
    const S = M.current;
    if (!S || typeof ResizeObserver > "u") return;
    const k = () => {
      R(S.clientWidth), D({ scrollTop: S.scrollTop, height: S.clientHeight }), le();
    }, q = new ResizeObserver(k);
    return q.observe(S), k(), () => q.disconnect();
  }, [s, te, se]);
  function b(S) {
    if (!(ge > 0)) return;
    const k = S.currentTarget.getBoundingClientRect(), q = Math.min(1, Math.max(0, (S.clientX - k.left) / k.width));
    v(q * ge);
  }
  function K(S) {
    const k = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let q = null;
    Object.hasOwn(k, S.key) && (q = c + k[S.key]), S.key === "Home" && (q = 0), S.key === "End" && (q = ge), q != null && (S.preventDefault(), S.stopPropagation(), v(Math.min(ge, Math.max(0, q))));
  }
  function C(S) {
    var q;
    const k = (q = T.current) == null ? void 0 : q.getBoundingClientRect();
    k && F(Qn(S.clientX - k.left, B));
  }
  function x(S) {
    const k = S.shiftKey ? 40 : 16;
    let q = null;
    S.key === "ArrowLeft" && (q = Q - k), S.key === "ArrowRight" && (q = Q + k), S.key === "Home" && (q = 160), S.key === "End" && (q = B), q != null && (S.preventDefault(), S.stopPropagation(), F(Qn(q, B)));
  }
  const A = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: T,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (S) => {
          (S.metaKey || S.ctrlKey) && (S.preventDefault(), f == null || f());
        },
        onKeyDown: (S) => {
          S.key !== "Enter" && S.key !== " " || (S.preventDefault(), f == null || f());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: A, disabled: g <= 1, onClick: () => m(Xn(g - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: A, disabled: g === 1, onClick: () => m(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(g * 100)}%`),
      n("button", { key: "in", type: "button", className: A, disabled: g >= 8, onClick: () => m(Xn(g + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: A, onClick: X, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(B),
      "aria-valuenow": Math.round(Q),
      "aria-valuetext": `${Math.round(Q)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (S) => {
        S.currentTarget.setPointerCapture(S.pointerId), C(S);
      },
      onPointerMove: (S) => {
        S.currentTarget.hasPointerCapture(S.pointerId) && C(S);
      },
      onKeyDown: x,
      onDoubleClick: () => F(rt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${Q - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: M,
      onScroll: (S) => D({
        scrollTop: S.currentTarget.scrollTop,
        height: S.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: Vi(g) }, [
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
          onClick: b,
          onKeyDown: K
        }, z.map((S, k) => n("span", {
          key: S,
          className: `absolute top-0 ${_i(k, z.length, ge > 0 ? S / ge * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Hi(k, z.length, ge > 0 ? S / ge * 100 : 0)
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
            onClick: (q) => {
              q.stopPropagation(), v(S.startSec);
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
            ...ko(oe),
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
        style: $.length > 0 ? { height: se.height } : void 0
      }, [
        $.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...ko(oe, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        $.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : me.map((S) => {
          var ee;
          const k = S.group, q = i.includes(k.key), ue = a === k.key, ae = or(ue);
          if (S.kind === "group") return n("div", {
            key: S.key,
            "data-segment-group": k.key,
            "data-segment-group-collapsed": q ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${de}rem minmax(0,1fr)`,
              backgroundColor: ae,
              top: S.top,
              height: S.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (Y) => {
                if (Y.metaKey || Y.ctrlKey) {
                  h(k.lanes.flatMap((O) => O.markers.map((ne) => ne.segment.id)));
                  return;
                }
                u(k.key), y(k.key);
              },
              "aria-expanded": !q,
              "aria-current": ue ? "true" : void 0,
              "data-selected-timeline-group": ue ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: k.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: ae
              },
              title: `${q ? "Expand" : "Collapse"} ${k.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, q ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, k.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              q ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${k.lanes.length} swimlane${k.lanes.length === 1 ? "" : "s"} hidden`
                ),
                W ? n(Tt, { key: "states", counts: k.counts }) : null
              ] : null
            )
          ]);
          const re = S.lane, Se = al(S.laneIndex), H = re.markers.some(({ segment: Y }) => Y.id === s);
          return n("div", {
            key: S.key,
            "data-grouped-swimlane": k.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${de}rem minmax(0,1fr)`,
              top: S.top,
              height: S.height,
              backgroundColor: Se
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": H ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: il(H, Se),
              title: `${$n(re)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": $n(re),
              onClick: (Y) => {
                (Y.metaKey || Y.ctrlKey) && h(re.markers.map((O) => O.segment.id));
              },
              onMouseEnter: () => I(re.key),
              onMouseLeave: () => I((Y) => Y === re.key ? null : Y)
            }, [
              re.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (Y) => {
                  Y.stopPropagation(), w({ tagId: re.tagId, tagName: re.label, trigger: Y.currentTarget });
                },
                "aria-label": `Configure ${re.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: V === re.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, re.label),
              (ee = re.performers) != null && ee.length ? n(ir, {
                key: "performers",
                performers: re.performers,
                performerAssignments: re.performerAssignments
              }) : null,
              W ? n(Tt, { key: "counts", counts: re.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, re.markers.map(({ segment: Y, track: O }) => {
              var Ce;
              const ne = Rr(Y.startSec, ge), ye = Y.endSec == null ? Y.startSec : Math.max(Y.startSec, Y.endSec), be = Math.max(0, Rr(ye, ge) - ne), he = l.includes(Y.id), Ae = Y.id === s, Ee = qr(P.get(Y.id)), Ne = Y.endSec == null ? $e(Y.startSec) : `${$e(Y.startSec)} – ${$e(Y.endSec)}`, Ie = (Ce = Pa[Ee]) == null ? void 0 : Ce.label;
              return n("button", {
                key: Y.id,
                type: "button",
                onClick: (ve) => {
                  ve.stopPropagation(), p(Y, {
                    additive: ve.metaKey || ve.ctrlKey,
                    rangeSegmentIds: ve.shiftKey ? re.markers.map((Oe) => Oe.segment.id) : null
                  });
                },
                "aria-pressed": he,
                "aria-current": Ae ? "true" : void 0,
                "data-selected-timeline-marker": Ae ? "true" : void 0,
                "data-selected-segment-shortcut-target": Ae ? "true" : void 0,
                "aria-label": W ? `${Y.tagName || "Tag segment"}${re.performerLabel ? `, ${re.performerLabel}` : ""}, ${Y.reviewState}${Ie ? `, ${Ie}` : ""}, ${Ne}` : `${Y.tagName || "Tag segment"}${re.performerLabel ? `, ${re.performerLabel}` : ""}, ${Ne}`,
                title: W ? `${Y.tagName || "Tag segment"}${re.performerLabel ? ` · ${re.performerLabel}` : ""} · ${Y.reviewState}${Ie ? ` · ${Ie}` : ""} · ${Ne}` : `${Y.tagName || "Tag segment"}${re.performerLabel ? ` · ${re.performerLabel}` : ""} · ${Ne}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...W ? nl(Y.reviewState, he, Ee, Ae) : rl(he, Ae),
                  left: `${ne}%`,
                  top: `${sl(O)}rem`,
                  width: ol(Y.endSec, be),
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
  const [a, s] = L(null), [l, d] = L([]), [c, g] = L(null), [m, u] = L(""), [y, p] = L(!0), [h, f] = L(null), [w, v] = L(""), [N, W] = L(!1), j = pe(null), F = pe(0);
  fe(() => {
    const V = requestAnimationFrame(() => {
      var I;
      return (I = j.current) == null ? void 0 : I.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(V);
  }, [e]), fe(() => {
    const V = new AbortController();
    return p(!0), v(""), Promise.all([
      r ? Z(`/slot-definitions/${e}`, { signal: V.signal }) : Promise.resolve(null),
      Z("/segment-groups", { signal: V.signal })
    ]).then(([I, $]) => {
      const P = $.find((J) => (J.tags || []).some((se) => Number(se.tagId) === Number(e)));
      s(I), d($), g((P == null ? void 0 : P.id) ?? null), u(P == null ? "" : String(P.id)), W(!1);
    }).catch((I) => {
      I.name !== "AbortError" && v(I.message || "Unable to load tag configuration.");
    }).finally(() => {
      V.signal.aborted || p(!1);
    }), () => V.abort();
  }, [r, e]);
  function T(V, I) {
    s({
      ...a,
      definitions: a.definitions.map(($, P) => P === V ? { ...$, ...I } : $)
    });
  }
  function M(V, I) {
    const $ = V + I;
    if ($ < 0 || $ >= a.definitions.length) return;
    const P = [...a.definitions];
    [P[V], P[$]] = [P[$], P[V]], s({
      ...a,
      definitions: P.map((J, se) => ({ ...J, sortOrder: se }))
    });
  }
  function E(V) {
    const I = a.definitions[V], $ = Number(I.assignmentCount) || 0, P = $ === 0 ? "" : ` and its ${$} assignment${$ === 1 ? "" : "s"}`;
    window.confirm(`Delete “${et(I)}”${P}?`) && ($ > 0 && W(!0), s({
      ...a,
      definitions: a.definitions.filter((J, se) => se !== V).map((J, se) => ({ ...J, sortOrder: se }))
    }));
  }
  async function R() {
    var I;
    f("slots"), v("Saving performer slots…");
    let V;
    try {
      V = await Z(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: N,
          definitions: a.definitions.map(($, P) => {
            var J;
            return {
              id: $.id || void 0,
              label: ((J = $.label) == null ? void 0 : J.trim()) || null,
              sortOrder: P,
              genderHints: $.genderHints || []
            };
          })
        })
      }), s(V), W(!1);
    } catch ($) {
      $.status === 409 ? (v("Performer slots changed elsewhere; current values were reloaded."), (I = $.payload) != null && I.current && (s($.payload.current), W(!1))) : v($.message || "Unable to save performer slots."), f(null);
      return;
    }
    try {
      await o(), v("Performer slots saved.");
    } catch {
      v("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      f(null);
    }
  }
  async function U() {
    const V = m === "" ? null : Number(m);
    if (V !== c) {
      f("group"), v("Saving tag group…");
      try {
        await Z(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: V })
        });
      } catch (I) {
        v(I.message || "Unable to assign the tag group."), f(null);
        return;
      }
      try {
        const [I, $] = await Promise.allSettled([
          Z("/segment-groups"),
          o()
        ]);
        if (I.status === "fulfilled") {
          d(I.value);
          const P = I.value.find((se) => (se.tags || []).some((me) => Number(me.tagId) === Number(e))), J = (P == null ? void 0 : P.id) ?? null;
          g(J), u(J == null ? "" : String(J));
        }
        v(
          I.status === "fulfilled" && $.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        f(null);
      }
    }
  }
  l.find((V) => Number(V.id) === Number(c));
  const D = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (V) => {
      V.target === V.currentTarget && !h && i();
    },
    onKeyDownCapture: (V) => ot(V, {
      onCancel: h ? void 0 : i
    })
  }, n("section", {
    ref: j,
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
        y ? null : n("label", { key: "choice", className: "block space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Assigned group"),
          n("select", {
            key: "select",
            value: m,
            disabled: h != null,
            onChange: (V) => u(V.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((V) => n("option", { key: V.id, value: String(V.id) }, V.name))
          ])
        ]),
        y ? null : n("button", {
          key: "save",
          type: "button",
          disabled: h != null || (m === "" ? null : Number(m)) === c,
          onClick: U,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, h === "group" ? "Saving…" : "Save tag group")
      ]),
      r ? n("section", { key: "slots", className: "space-y-3 border-t border-border pt-5", "aria-labelledby": "inline-tag-slots-heading" }, [
        n("div", { key: "heading" }, [
          n("h3", { key: "title", id: "inline-tag-slots-heading", className: "text-sm font-semibold text-foreground" }, "Performer slots"),
          n("p", { key: "copy", className: "text-xs text-secondary" }, "Define the ordered performer roles used by this tag.")
        ]),
        y ? n("p", { key: "loading", className: "rounded-md border border-dashed border-border p-4 text-sm text-secondary" }, "Loading performer slots…") : a ? n("div", { key: "editor", className: "space-y-3" }, [
          n("label", { key: "duplicates", className: "flex items-center gap-2 text-sm" }, [
            n("input", {
              key: "input",
              type: "checkbox",
              checked: !!a.allowSamePerformerInMultipleSlots,
              disabled: h != null,
              onChange: (V) => s({ ...a, allowSamePerformerInMultipleSlots: V.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((V, I) => n("article", {
            key: V.id || V._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: V.label || "",
                disabled: h != null,
                onChange: ($) => T(I, { label: $.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, ji.map(($) => n("label", { key: $, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: h != null,
                  checked: (V.genderHints || []).includes($),
                  onChange: (P) => T(I, {
                    genderHints: P.target.checked ? [.../* @__PURE__ */ new Set([...V.genderHints || [], $])] : (V.genderHints || []).filter((J) => J !== $)
                  })
                }),
                n("span", { key: "text" }, ar($))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${V.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: h != null || I === 0, onClick: () => M(I, -1), className: D, "aria-label": `Move ${et(V)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: h != null || I === a.definitions.length - 1, onClick: () => M(I, 1), className: D, "aria-label": `Move ${et(V)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: h != null, onClick: () => E(I), className: `${D} text-red-300` }, "Delete")
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
                  _clientKey: `new-${++F.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: D
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: h != null,
              onClick: R,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, h === "slots" ? "Saving…" : "Save performer slots")
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
        disabled: h != null,
        onClick: i,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Close")
    )
  ]));
}
function xd(e) {
  const { activeFilterCount: t, allSwimlanes: r, analysisError: o, analysisRun: i, analysisStatus: a, approvalFacetCounts: s, autoAssignCandidates: l, autoAssignError: d, autoAssignOpen: c, autoAssignPerformers: g, autoAssigning: m, cancelQueuedReviewsForSegments: u, captureTrainingExport: y, centerTimelineRef: p, closeEditorFilters: h, closeFirstSegmentTagDialog: f, closeMaterializeDialog: w, closeMergeConfirmation: v, closePublishApprovedDialog: N, closeTagEditing: W, collapsedSegmentGroups: j, compatibilityMode: F, configuringTag: T, createSegment: M, currentTime: E, deleteRejectedSegments: R, detail: U, detailPanelRef: D, detailWidth: V, duplicateSegment: I, editorFilters: $, editorLayout: P, editorRef: J, exportingExamples: se, filtersButtonRef: me, filtersOpen: ge, firstSegmentTagOpen: B, focusRowRef: Q, handleSeparatorKeyDown: de, handleSeparatorPointerDown: oe, handleSeparatorPointerMove: xe, hideDerivedSegments: ke, history: z, historyOpen: te, historySaving: X, horizontalLayoutSize: le, importNativeSegments: b, incorrectExamples: K, incorrectExamplesOpen: C, lineage: x, markerRailWidth: A, materializeButtonRef: S, materializeCancelButtonRef: k, materializeDerivedSegments: q, materializeError: ue, materializeLoading: ae, materializeOpen: re, materializePreview: Se, materializing: H, mediaStackRef: ee, mergeCancelButtonRef: Y, mergeConfirmation: O, mergeSavingRef: ne, mergeSelectedSwimlane: ye, nativeImportState: be, onDetailChange: he, onNavigate: Ae, onReload: Ee, onSlotsChanged: Ne, openPublishApprovedDialog: Ie, panelSeparatorProps: Ce, pendingInitialSeekRef: ve, performerSlots: Oe, performerSlotsAvailable: De, playbackControlsRef: at, previewDerivedSegments: we, provenance: Pe, provenanceSources: qe, publishApprovedCancelButtonRef: je, publishApprovedDrafts: Te, publishApprovedError: Re, publishApprovedOpen: Ke, quickSearchOpen: it, railScrollRef: Qe, railToggleRef: Ye, recordHistoryAction: wt, rejectedDeletionPreview: Nt, removeIncorrectExample: lr, removingExampleId: En, restoreHistoryTarget: Xt, saveMessage: Dn, saveTag: Mt, saveTiming: dr, savingSegmentId: pt, seekRef: bt, segmentGroups: Bt, segmentRailLayout: At, segments: It, selectAllVideoSegments: cr, selectSegment: ht, selectSegmentCollection: ur, selectedGroups: en, selectedPerformerSlots: tn, selectedSegment: vt, selectedSegmentGroupKey: nn, selectedSegmentIds: Gt, selectedSegments: On, selectedSlotStatus: rn, setAutoAssignError: Et, setAutoAssignOpen: Kt, setConfiguringTag: on, setCurrentTime: mr, setEditorFilters: Pn, setEditorLayout: gr, setFiltersOpen: an, setHideDerivedSegments: sn, setHistoryOpen: ln, setIncorrectExamplesOpen: Dt, setQuickSearchOpen: Ln, setRailViewport: Fn, setRejectedDeletionPreview: dn, setSaveMessage: cn, setSavingSegmentId: un, setSelectedSegmentGroupKey: tt, setSelectedSegmentId: jn, setShortcutsOpen: Ut, setTimelineZoom: Bn, shotBoundaries: Gn, shortcutsOpen: mn, slotButtonRef: gn, splitLayout: xt, splitSegment: pr, startFullAnalysis: Kn, tagEditing: pn, tagSearchRef: fn, timelineDuration: yn, timelineRatioBounds: _e, timelineZoom: Je, toggleSegmentGroup: Un, toggleSegmentRail: fr, updateTimelineRatio: ft, video: Ue, videoPerformers: zn, visibleCounts: bn, visibleSegmentRailRows: hn, visibleSegments: zt, wideLayout: Ct, workspaceRef: yr } = e, vn = Ge(
    () => It.filter((_) => !_.published && _.reviewState === "approved"),
    [It]
  ), br = Pi(Br), xn = vn.length, ct = Se ? Se.createCount + Se.linkCount : null;
  function hr(_) {
    const Be = Gt.includes(_.id), ze = _.id === (vt == null ? void 0 : vt.id), ie = _.endSec == null ? $e(_.startSec) : `${$e(_.startSec)} – ${$e(_.endSec)}`, st = `${gt(_.sourceKey)}${_.confidence != null ? ` · ${Math.round(_.confidence * 100)}%` : ""}`;
    return n("button", {
      key: _.id,
      type: "button",
      onClick: (qt) => ht(_, { additive: qt.metaKey || qt.ctrlKey }),
      "aria-pressed": Be,
      "aria-current": ze ? "true" : void 0,
      "data-selected-segment-shortcut-target": ze ? "true" : void 0,
      "aria-label": F ? `${_.tagName || "Tag segment"}, ${_.reviewState}${_.isDerived ? ", derived segment" : ""}, ${ie}` : `${_.tagName || "Tag segment"}${_.isDerived ? ", derived segment" : ""}, ${ie}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: Oa(Be, ze)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        F ? n(jt, { key: "review", state: _.reviewState, includeLabel: !1 }) : null,
        _.isDerived ? n(sr, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          _.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, ie),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: st
        }, st)
      ])
    ]);
  }
  const _t = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", Ht = [...z.actions || []].reverse().find((_) => _.sequence <= z.cursorSequence);
  return n("section", {
    ref: J,
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
            onClick: (_) => _a(_, Ae, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${Ue.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: Ue.title || `Video ${Ue.id}`
          }, Ue.title || `Video ${Ue.id}`)),
          ...zn.map((_) => n(Tn, {
            key: Ve(_),
            performer: { id: Ve(_), name: _.name },
            compact: !0,
            tooltip: _.name
          })),
          F ? n(Tt, { key: "review-counts", counts: bn }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          F ? null : n(qa, { key: "bin", onNavigate: Ae, compact: !0 }),
          n(Wa, { key: "settings", onNavigate: Ae, compact: !0 })
        ])
      ]),
      F && U.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${U.nativeImportCount} Cove segment${U.nativeImportCount === 1 ? "" : "s"} ${U.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        be.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, be.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => b("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => b("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        be.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, be.error) : null
      ]) : null,
      o && (a == null ? void 0 : a.configured) !== !1 ? n("div", {
        key: "analysis-error",
        role: "alert",
        className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300"
      }, o) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          F ? n("div", {
            key: "full-analysis",
            className: "inline-flex items-stretch"
          }, [
            n("button", {
              key: "run",
              type: "button",
              disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
              onClick: () => Kn(),
              title: (a == null ? void 0 : a.error) || "Run AI tagging and shot boundary analysis into the Full review workflow",
              className: "segment-studio-full-scan-run inline-flex items-center justify-center bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
            }, (a == null ? void 0 : a.configured) === !1 ? "Full Scan not configured" : (a == null ? void 0 : a.ready) === !1 ? "Full Scan unavailable" : (i == null ? void 0 : i.status) === "queued" ? "Full Scan queued…" : (i == null ? void 0 : i.status) === "running" ? "Full Scan running…" : "Full Scan"),
            n("details", { key: "choices", className: "relative flex" }, [
              n("summary", {
                key: "summary",
                "aria-label": "Choose Full Scan analyses",
                "aria-disabled": (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                title: "Choose analyses",
                onClick: (_) => {
                  ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && _.preventDefault();
                },
                onKeyDown: (_) => {
                  (_.key === "Enter" || _.key === " ") && ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && _.preventDefault();
                },
                className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${(a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running" ? "pointer-events-none cursor-default opacity-50" : "cursor-pointer hover:opacity-90"}`
              }, n(Li, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([_, Be]) => n("button", {
                key: _,
                type: "button",
                disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                onClick: (ze) => {
                  var ie;
                  (ie = ze.currentTarget.closest("details")) == null || ie.removeAttribute("open"), Kn(Be);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, _)))
            ])
          ]) : null,
          F ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: pt != null || l.length === 0,
            onClick: () => {
              Et(""), Kt(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${l.length ? ` (${l.length})` : ""}`) : null,
          F ? n("button", {
            key: "materialize-derived",
            ref: S,
            type: "button",
            disabled: pt != null || ae || H || ct === 0,
            onClick: we,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, ae ? "Analyzing…" : `Auto-Materialize${ct != null ? ` (${ct})` : ""}`) : null,
          F ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: pt != null || xn === 0,
            onClick: (_) => Ie(_.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": Ke,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${xn ? ` (${xn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: se || En != null || K.length === 0,
            onClick: () => Dt(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": C,
            "aria-label": `Open AI feedback collection, ${K.length} example${K.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${K.length ? ` (${K.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: me,
            type: "button",
            onClick: () => an(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": ge,
            className: `${_t} ${t ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(Jn, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${t ? ` (${t})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => Ut(!0),
            className: _t
          }, [n(Jn, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: (F ? z.actions.length === 0 : Ht == null) || pt != null || X,
            onClick: F ? () => ln((_) => !_) : () => Xt(
              Ht.sequence - 1
            ),
            "aria-haspopup": F ? "dialog" : void 0,
            "aria-expanded": F ? te : void 0,
            className: _t
          }, [
            n(Jn, { key: "icon", name: "history" }),
            n("span", { key: "label" }, F ? `History${z.actions.length ? ` (${z.actions.length})` : ""}` : Ht ? `Undo ${Ht.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: Ye,
            type: "button",
            onClick: fr,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": P.markerRailOpen,
            className: _t
          }, [
            n(Jn, { key: "icon", name: "list" }),
            n("span", { key: "label" }, P.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    F && te ? n("section", {
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
        ...[...z.actions].reverse().map((_) => n("button", {
          key: _.sequence,
          type: "button",
          disabled: X,
          onClick: () => Xt(_.sequence),
          "aria-current": z.cursorSequence === _.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${_.sequence > z.cursorSequence ? "text-secondary" : "text-foreground"} ${z.cursorSequence === _.sequence ? "bg-accent/15" : ""}`
        }, [
          n("span", { key: "label", className: "min-w-0 flex-1 truncate" }, _.label),
          n("time", {
            key: "time",
            dateTime: _.createdAt,
            className: "shrink-0 text-[10px] text-secondary"
          }, new Date(_.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        ])),
        n("button", {
          key: "baseline",
          type: "button",
          disabled: X,
          onClick: () => Xt(z.baselineSequence),
          "aria-current": z.cursorSequence === z.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${z.cursorSequence === z.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    ge ? n(sd, {
      key: "editor-filters",
      filters: $,
      hideDerivedSegments: ke,
      performers: zn,
      provenanceSources: qe,
      reviewCounts: s,
      segments: It,
      segmentGroups: Bt,
      reviewMode: F,
      onChange: Pn,
      onHideDerivedChange: sn,
      onClose: h
    }) : null,
    B ? n(id, {
      key: "first-segment-tag-dialog",
      saving: pt != null,
      error: Dn,
      onSelect: (_, Be) => M(_, Be),
      onClose: f
    }) : null,
    it ? n(cd, {
      key: "quick-search-dialog",
      segments: Vs(r),
      onSelect: (_) => {
        Ln(!1), ht(_, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        Ln(!1), requestAnimationFrame(() => {
          var _;
          return (_ = J.current) == null ? void 0 : _.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    c ? n(gd, {
      key: "auto-assign-dialog",
      candidates: l,
      processing: m,
      error: d,
      onConfirm: g,
      onClose: () => Kt(!1)
    }) : null,
    O ? n(fd, {
      key: "merge-selection-dialog",
      merge: O,
      processing: ne.current,
      undoable: !F,
      cancelButtonRef: Y,
      onConfirm: (_) => ye(!0, _, O),
      onClose: v
    }) : null,
    re ? n(bd, {
      key: "materialize-derived-dialog",
      preview: Se,
      loading: ae,
      processing: H,
      error: ue,
      cancelButtonRef: k,
      onConfirm: q,
      onClose: () => {
        H || w();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: yr,
      className: `${xt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      P.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: Ct ? { position: "absolute", top: 0, right: 0, width: A, height: le.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        It.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : zt.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: Qe,
          onScroll: (_) => Fn({
            scrollTop: _.currentTarget.scrollTop,
            height: _.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: At.height }
        }, hn.map((_) => {
          var ze;
          let Be;
          if (_.kind === "group") {
            const ie = j.includes(_.group.key), st = _.group.lanes.reduce((qt, _n) => qt + _n.markers.length, 0);
            Be = n("button", {
              type: "button",
              onClick: () => {
                tt(_.group.key), Un(_.group.key);
              },
              "aria-expanded": !ie,
              "aria-current": nn === _.group.key ? "true" : void 0,
              "data-segment-rail-group": _.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${nn === _.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, ie ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: _.group.name }, _.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, st),
              F && ie ? n(Tt, { key: "states", counts: _.group.counts }) : null
            ]);
          } else _.kind === "lane" ? Be = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: $n(_.lane),
            "aria-label": $n(_.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, _.lane.label),
            (ze = _.lane.performers) != null && ze.length ? n(ir, {
              key: "performers",
              performers: _.lane.performers,
              performerAssignments: _.lane.performerAssignments
            }) : null,
            F ? n(Tt, { key: "states", counts: _.lane.counts }) : null
          ]) : Be = hr(_.segment);
          return n("div", {
            key: _.key,
            className: "absolute left-0 right-0",
            style: { top: _.top, height: _.height }
          }, Be);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${xt ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: ee,
          className: `${xt ? "min-h-0 flex-1" : ""} grid`,
          style: xt ? {
            gridTemplateRows: `minmax(16rem, ${(1 - P.timelineRatio) * 100}fr) 0.5rem minmax(14rem, ${P.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: Q,
            className: "grid min-h-0 gap-2",
            style: Ct ? {
              gridTemplateColumns: P.markerRailOpen ? `${V}px 0.5rem minmax(0,1fr) 0.5rem ${A}px` : `${V}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(hd, {
              key: "tools",
              compatibilityMode: F,
              selectedSegment: vt,
              selectedSegments: On,
              selectedGroups: en,
              saveMessage: Dn,
              savingSegmentId: pt,
              setSavingSegmentId: un,
              setSaveMessage: cn,
              saveTag: Mt,
              slotStatus: rn,
              performerSlotsAvailable: De,
              selectedPerformerSlots: tn,
              performerSlots: Oe,
              detail: U,
              onDetailChange: he,
              onCancelQueuedReview: u,
              video: Ue,
              slotButtonRef: gn,
              tagSearchRef: fn,
              tagEditing: pn,
              onCancelTagEditing: W,
              detailPanelRef: D,
              onReduceSelection: (_) => {
                ht(_), requestAnimationFrame(() => {
                  var Be;
                  return (Be = D.current) == null ? void 0 : Be.focus({ preventScroll: !0 });
                });
              },
              saveTiming: dr,
              onSlotsChanged: Ne,
              onRecordHistory: wt,
              splitSegment: pr,
              duplicateSegment: I,
              provenance: Pe,
              lineage: x,
              onNavigateLineageItem: (_) => {
                const Be = It.find((ze) => ze.itemId === _);
                Be && jn(Be.id);
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
              n("div", { className: "h-full min-h-0 w-full" }, n(ta, {
                streamUrl: `/api/stream/video/${Ue.id}`,
                posterUrl: `/api/stream/video/${Ue.id}/screenshot?v=${encodeURIComponent(Ue.updatedAt || "")}`,
                format: Ue.videoFile.format,
                audioCodec: Ue.videoFile.audioCodec,
                duration: Ue.videoFile.duration,
                videoId: Ue.id,
                trackingEnabled: !1,
                onSeekRegister: (_) => {
                  bt.current = _, _s(ve.current, It, _) && (ve.current = null);
                },
                onPlaybackControlRegister: (_) => {
                  at.current = _;
                },
                onTimeUpdate: mr
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            Ct && P.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...Ce("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Ct && P.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          xt ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(_e.minimum * 100),
            "aria-valuemax": Math.round(_e.maximum * 100),
            "aria-valuenow": Math.round(P.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(P.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: oe,
            onPointerMove: xe,
            onKeyDown: de,
            onDoubleClick: () => ft(rt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: xt ? void 0 : { height: "20rem" } }, n(vd, {
            segments: zt,
            shotBoundaries: Gn,
            segmentGroups: Bt,
            performerSlots: Oe,
            collapsedGroupKeys: j,
            selectedGroupKey: nn,
            selectedSegmentId: vt == null ? void 0 : vt.id,
            selectedSegmentIds: Gt,
            duration: yn,
            currentTime: E,
            zoom: Je,
            onZoomChange: Bn,
            onSelectGroup: tt,
            onToggleGroup: Un,
            onSelect: (_, Be) => ht(_, Be),
            onSelectSegments: ur,
            onSelectAll: cr,
            onConfigureTag: (_) => on(_),
            onSeekTime: (_) => {
              var Be;
              return (Be = bt.current) == null ? void 0 : Be.call(bt, _, !1);
            },
            centerRef: p,
            showReviewState: F,
            swimlaneTitleWidth: P.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (_) => gr((Be) => ({ ...Be, swimlaneTitleWidth: _ }))
          }))
        ])
      ])
    ]),
    T ? n(Jr, {
      key: `configure-tag:${T.tagId}`,
      tagId: T.tagId,
      tagName: T.tagName,
      performerSlotsEnabled: F,
      onSaved: Ee,
      onClose: () => {
        const _ = T.trigger;
        on(null), requestAnimationFrame(() => {
          var Be;
          _ != null && _.isConnected ? _.focus({ preventScroll: !0 }) : (Be = J.current) == null || Be.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Ke ? n(md, {
      key: "publish-approved-dialog",
      drafts: vn,
      processing: pt === -1,
      error: Re,
      cancelButtonRef: je,
      onConfirm: Te,
      onClose: N
    }) : null,
    Nt ? n(pd, {
      key: "rejected-deletion-dialog",
      preview: Nt,
      onConfirm: () => R(Nt),
      onClose: () => {
        dn(null), requestAnimationFrame(() => {
          var _;
          return (_ = J.current) == null ? void 0 : _.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    mn ? n(ld, {
      key: "shortcuts-dialog",
      reviewMode: F,
      bindings: br,
      onClose: () => Ut(!1)
    }) : null,
    C ? n(dd, {
      key: "incorrect-examples-dialog",
      examples: K,
      exporting: se,
      removingExampleId: En,
      onExport: y,
      onRemove: lr,
      onClose: () => Dt(!1)
    }) : null
  ]);
}
function Sd(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: m, setEditorFilters: u, setHideDerivedSegments: y, setSaveMessage: p, setSelectedSegmentGroupKey: h, setSelectedSegmentId: f, setSelectedSegmentIds: w } = e;
  function v(T) {
    const M = ut(t, T);
    M && m((E) => Ua(E, M));
  }
  function N(T) {
    f(T), w(T == null ? [] : [T]), c.current = T, g.current = [];
  }
  function W(T, {
    focusEditor: M = !1,
    seekToSegment: E = !1,
    additive: R = !1,
    rangeSegmentIds: U = null
  } = {}) {
    var V, I;
    const D = ds({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, T.id, U, R);
    w(D.selectedSegmentIds), f(D.activeSegmentId), c.current = D.anchorSegmentId, g.current = D.rangeBaseSegmentIds, D.activeSegmentId != null && h(ut(t, D.activeSegmentId)), v(T.id), M && ((V = r.current) == null || V.focus({ preventScroll: !0 })), E && ((I = i.current) == null || I.call(i, T.startSec, !1));
  }
  function j(T) {
    const M = ss(
      d,
      l,
      T
    );
    w(M.selectedSegmentIds), f(M.activeSegmentId), c.current = M.activeSegmentId, g.current = [], M.activeSegmentId != null && (h(ut(t, M.activeSegmentId)), v(M.activeSegmentId));
  }
  function F() {
    var E;
    const T = us(s), M = T.includes(l) ? l : T[0] ?? null;
    u(dt({})), y(!1), w(T), f(M), c.current = M, g.current = [], M != null && h(ut(
      Lt(s, a, o),
      M
    )), p(T.length === 0 ? "There are no segments to select." : `${T.length} segments selected. Collapsed Segment groups keep their selected segments.`), (E = r.current) == null || E.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: v, replaceSegmentSelection: N, selectSegment: W, selectSegmentCollection: j, selectAllVideoSegments: F };
}
function kd(e) {
  const { acceptHistory: t, compatibilityMode: r, detail: o, detailPanelRef: i, historyRef: a, mergeSavingRef: s, onConflict: l, onDetailChange: d, onReload: c, pendingReviewStateRef: g, recordHistoryAction: m, revealSegmentGroupForSelection: u, reviewSavingRef: y, savingSegmentId: p, selectedGroups: h, selectedSegment: f, selectedSegmentIdRef: w, selectedSegments: v, selectionAnchorIdRef: N, selectionRangeBaseIdsRef: W, setMergeConfirmation: j, setSaveMessage: F, setSavingSegmentId: T, setSelectedSegmentId: M, setSelectedSegmentIds: E, video: R } = e;
  function U() {
    j(null), requestAnimationFrame(() => {
      var I;
      return (I = i.current) == null ? void 0 : I.focus({ preventScroll: !0 });
    });
  }
  async function D(I = !1, $ = !1, P = null) {
    if (s.current || p != null) return;
    const J = P || Ga(
      h,
      { nativeOnly: !r }
    );
    if (!J) {
      F("Select at least two segments from one swimlane.");
      return;
    }
    if (!I && ya()) {
      j(J);
      return;
    }
    $ && ba(!1), U();
    const se = J.endSec == null ? "open end" : $e(J.endSec);
    s.current = !0;
    let me = J.segments[0];
    const ge = r ? null : lt(J.segments, !1), B = r ? null : crypto.randomUUID(), Q = J.segments.map((oe) => oe.id), de = Fl(o, J.segments);
    T(me.id), d(de, R.id), E([me.id]), M(me.id), N.current = me.id, W.current = [];
    try {
      const oe = J.segments.slice(1);
      if (!r || me.nativeSegmentId != null) {
        const xe = oe.map((z) => {
          const te = `merge-native-selection:${R.id}:${me.id}:${z.id}:${me.updatedAt}:${z.updatedAt}`;
          return { key: te, operationId: Le(te), segmentId: z.id, expectedUpdatedAt: z.updatedAt };
        }), ke = await Z(`/videos/${R.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: me.id,
            expectedSurvivorUpdatedAt: me.updatedAt,
            consumedSegments: xe.map(({ key: z, ...te }) => te),
            historyReceiptId: B
          })
        });
        me = ke.survivor, d(jo(o, ke), R.id), xe.forEach(({ key: z }) => Fe(z));
      } else {
        const xe = oe.map((z) => {
          const te = `merge-draft-selection:${R.id}:${me.itemId}:${z.itemId}:${me.revision}:${z.revision}`;
          return { key: te, operationId: Le(te), itemId: z.itemId, expectedRevision: z.revision };
        }), ke = await Z(`/videos/${R.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: me.itemId,
            expectedSurvivorRevision: me.revision,
            consumedDrafts: xe.map(({ key: z, ...te }) => te)
          })
        });
        me = ke.survivor, d(jo(o, ke), R.id), xe.forEach(({ key: z }) => Fe(z));
      }
      E([me.id]), M(me.id), N.current = me.id, W.current = [], r ? t(St) : await m(
        "segments.merge",
        `Merged ${J.segments.length} segments`,
        ge,
        lt([me], !1),
        B
      ), u(me.id), F(`${J.segments.length} segments merged into ${$e(J.startSec)} – ${se}.`);
    } catch (oe) {
      d((xe) => za(
        Rn(xe, [J.segments[0]], [
          "startSec",
          "endSec",
          "sourceKey",
          "sourceRunId",
          "confidence",
          "isDerived"
        ]),
        J.segments.slice(1)
      ), R.id), E(Q), M((f == null ? void 0 : f.id) ?? Q[0] ?? null), N.current = (f == null ? void 0 : f.id) ?? Q[0] ?? null, W.current = [], oe.status === 409 ? await l() : F(oe.message || "Unable to merge selected segments.");
    } finally {
      s.current = !1, T(null);
    }
  }
  async function V(I, $ = v, P = f) {
    var de;
    if ($.length === 0 || y.current) return;
    if (p != null) {
      g.current.push(Is(
        I,
        $,
        P
      )), F(`${I === "approved" ? "Approval" : "Rejection"} queued…`);
      return;
    }
    const J = Ns($, I), se = $.filter((oe) => oe.reviewState !== J);
    if (se.length === 0) return;
    const me = $.map((oe) => ({
      id: oe.id,
      itemId: oe.itemId,
      nativeSegmentId: oe.nativeSegmentId
    })), ge = me.find((oe) => oe.id === (P == null ? void 0 : P.id)) || me[0], B = (oe, xe = !1) => {
      if (!(oe != null && oe.segments) || !xe && !Er(w.current, ge.id))
        return;
      const ke = me.map((te) => He(oe == null ? void 0 : oe.segments, te)).filter(Boolean), z = He(oe == null ? void 0 : oe.segments, ge) || ke[0] || null;
      E(ke.map((te) => te.id)), M((z == null ? void 0 : z.id) ?? null), N.current = (z == null ? void 0 : z.id) ?? null, W.current = [];
    };
    y.current = !0, T((P == null ? void 0 : P.id) ?? se[0].id), F(`Updating ${se.length} selected segment${se.length === 1 ? "" : "s"}…`);
    const Q = rr(
      o,
      se.map((oe) => oe.id),
      { reviewState: J }
    );
    d(Q, R.id);
    try {
      const oe = await Z(`/videos/${R.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: a.current.revision,
          reviewState: J,
          segments: $.map((te) => te.published ? {
            nativeSegmentId: te.nativeSegmentId,
            expectedUpdatedAt: te.updatedAt
          } : {
            itemId: te.itemId,
            expectedRevision: te.revision
          })
        })
      }), xe = new Map((oe.items || []).map((te) => [
        te.requestedNativeSegmentId != null ? `native:${te.requestedNativeSegmentId}` : `item:${te.requestedItemId}`,
        te
      ]));
      if (me.forEach((te) => {
        const X = xe.get(te.nativeSegmentId != null ? `native:${te.nativeSegmentId}` : `item:${te.itemId}`);
        X && (te.nativeSegmentId = X.nativeSegmentId, te.itemId = X.itemId);
      }), oe.history && t(oe.history), J === "rejected" || (oe.items || []).some((te) => te.requestedNativeSegmentId != null && te.nativeSegmentId !== te.requestedNativeSegmentId)) {
        B(await c()), F(`${oe.updatedCount} selected segment${oe.updatedCount === 1 ? "" : "s"} ${J === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const z = {
        ...o,
        approvedSetVersion: oe.approvedSetVersion || o.approvedSetVersion,
        segments: (o.segments || []).map((te) => {
          const X = xe.get(te.nativeSegmentId != null ? `native:${te.nativeSegmentId}` : `item:${te.itemId}`);
          return X ? {
            ...te,
            id: X.nativeSegmentId != null ? X.nativeSegmentId : -X.itemId,
            itemId: X.itemId,
            nativeSegmentId: X.nativeSegmentId,
            published: X.nativeSegmentId != null,
            reviewState: J,
            revision: X.nativeSegmentId != null ? te.revision : X.revision,
            updatedAt: X.updatedAt
          } : te;
        })
      };
      d(z, R.id), B(z), F(`${oe.updatedCount} selected segment${oe.updatedCount === 1 ? "" : "s"} ${J === "approved" ? "approved" : J === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (oe) {
      d((ke) => Rn(
        ke,
        se,
        ["reviewState"]
      ), R.id), oe.status === 409 && ((de = oe.payload) != null && de.currentHistory) && t(oe.payload.currentHistory);
      const xe = oe.status === 409 ? await l() : o;
      B(xe, !0), F(oe.message || "Unable to update the selected segments.");
    } finally {
      y.current = !1, T(null);
    }
  }
  return { closeMergeConfirmation: U, mergeSelectedSwimlane: D, saveSelectedReviewState: V };
}
function wd(e) {
  const { acceptHistory: t, allSwimlanes: r, autoAssignCandidates: o, autoAssigning: i, binEmptyingRef: a, canMoveSelectionToBin: s, closeTagEditing: l, compatibilityMode: d, detail: c, editorRef: g, exportingExamples: m, incorrectExamples: u, lineage: y, materializeButtonRef: p, materializePreview: h, materializeRestoreFocusRef: f, materializing: w, mutateSegment: v, onConflict: N, onDetailChange: W, onReload: j, recordHistoryAction: F, refreshMaterializationPreview: T, removingExampleId: M, revealSegmentGroupForSelection: E, savingSegmentId: R, segments: U, selectedSegment: D, selectedSegmentIdRef: V, selectedSegments: I, selectionAnchorIdRef: $, selectionRangeBaseIdsRef: P, setAutoAssignError: J, setAutoAssignOpen: se, setAutoAssigning: me, setExportingExamples: ge, setIncorrectExamples: B, setMaterializeError: Q, setMaterializeLoading: de, setMaterializeOpen: oe, setMaterializePreview: xe, setMaterializing: ke, setRejectedDeletionPreview: z, setRemovingExampleId: te, setSaveMessage: X, setSavingSegmentId: le, setSelectedSegmentGroupKey: b, setSelectedSegmentId: K, setSelectedSegmentIds: C, video: x } = e;
  async function A() {
    var Ne, Ie, Ce;
    if (I.length === 0 || !D || R != null) return;
    const O = Al(I, u), ne = O.segments;
    if (ne.length === 0) return;
    const ye = I.map((ve) => ({
      id: ve.id,
      itemId: ve.itemId,
      nativeSegmentId: ve.nativeSegmentId
    })), be = ye.find((ve) => ve.id === D.id) || ye[0], he = [], Ae = [];
    let Ee = c;
    le(be.id), X(O.action === "remove" ? `Removing ${ne.length} selected incorrect example${ne.length === 1 ? "" : "s"}…` : `Collecting ${ne.length} selected segment${ne.length === 1 ? "" : "s"} as incorrect AI feedback…`);
    try {
      const ve = async (Te, Re) => {
        const Ke = Te.nativeSegmentId != null, it = O.action === "remove" ? `incorrect-example-remove:${x.id}:${Re == null ? void 0 : Re.id}:${Re == null ? void 0 : Re.revision}:${Re == null ? void 0 : Re.representationRevision}` : `incorrect-example-collect:${x.id}:${Ke ? `native:${Te.nativeSegmentId}:${Te.updatedAt}` : `item:${Te.itemId}:${Te.revision}`}`;
        if (O.action === "remove" && !Re)
          throw new Error("The incorrect-example collection changed. Reload and try again.");
        let Qe;
        try {
          Qe = O.action === "remove" ? await Z(
            `/videos/${x.id}/incorrect-examples/${Re.id}/remove`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Le(it),
                expectedExampleRevision: Re.revision,
                expectedRepresentationRevision: Re.representationRevision
              })
            }
          ) : await Z(`/videos/${x.id}/incorrect-examples/collect`, {
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
        if (!El(O.action, Qe))
          throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
        return Fe(it), Qe;
      };
      for (const Te of ne) {
        const Re = O.action === "remove" ? u.find((Ke) => Ke.itemId != null && Ke.itemId === Te.itemId) : null;
        try {
          const Ke = ye.find((Ye) => Ye.id === Te.id);
          let it = He(
            Ee == null ? void 0 : Ee.segments,
            Ke
          ) || Te, Qe;
          try {
            Qe = await ve(it, Re);
          } catch (Ye) {
            if (Ye.status === 409 && ((Ie = (Ne = Ye.payload) == null ? void 0 : Ne.result) == null ? void 0 : Ie.code) === "OPERATION_REPLAYED")
              Ee = await Z(
                `/videos/${x.id}/editor`
              ), Fe(Ye.operationKey), Qe = Ye.payload.result;
            else {
              if (O.action !== "collect" || Ye.status !== 409) throw Ye;
              const wt = await Z(
                `/videos/${x.id}/editor`
              );
              Ee = wt;
              const Nt = He(
                wt == null ? void 0 : wt.segments,
                Ke
              );
              if (!Nt) throw Ye;
              it = Nt, Qe = await ve(it, null);
            }
          }
          Ke && Qe.itemId != null && (Ke.itemId = Qe.itemId), Ee = Go(
            Ee,
            Qe.editorDelta
          ), he.push({ segment: Te, result: Qe });
        } catch (Ke) {
          if (Ae.push(Ke), ![400, 404, 409].includes(Ke.status)) break;
        }
      }
      he.some(({ result: Te }) => Te.representation === "basicNativeBin") && Nn();
      const Oe = Er(
        V.current,
        be.id
      ), De = O.action === "collect" && he.some(({ segment: Te }) => Te.id === be.id), at = he.map(({ segment: Te }) => Te.id), we = De ? gs(
        r,
        at,
        be.id
      ) : null, Pe = De ? (we == null ? void 0 : we.id) ?? null : be.id;
      Oe && De && (C(we ? [we.id] : []), K((we == null ? void 0 : we.id) ?? er), $.current = (we == null ? void 0 : we.id) ?? null, P.current = []);
      const qe = await Z(`/videos/${x.id}/incorrect-examples`);
      B(qe);
      const je = Ee;
      if (W(je, x.id), Oe && Er(
        V.current,
        Pe
      )) {
        let Te, Re;
        De ? (Re = we ? He(je == null ? void 0 : je.segments, {
          id: we.id,
          itemId: we.itemId,
          nativeSegmentId: we.nativeSegmentId
        }) : null, Te = Re ? [Re] : []) : (Te = ye.map((Ke) => He(je == null ? void 0 : je.segments, Ke)).filter(Boolean), Re = He(je == null ? void 0 : je.segments, be) || Te[0] || null), C(Te.map((Ke) => Ke.id)), K((Re == null ? void 0 : Re.id) ?? (De ? er : null)), $.current = (Re == null ? void 0 : Re.id) ?? null, P.current = [], b(Re ? ut(r, Re.id) : null), Re && E(Re.id);
      }
      if (Ae.length > 0) {
        const Te = ((Ce = Ae[0]) == null ? void 0 : Ce.message) || "Only segments with registered AI provenance can be collected.";
        he.length === 0 ? X(Te) : O.action === "remove" ? X(
          `Partially removed ${he.length} of ${ne.length} selected incorrect examples. ${Te}`
        ) : X(
          `Partially collected ${he.length} of ${ne.length} selected segments. ${Te}`
        );
      } else if (O.action === "remove")
        X(
          `${he.length} incorrect example${he.length === 1 ? "" : "s"} removed and ${he.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
        );
      else {
        const Te = he.filter(({ result: Re }) => Re.representation === "basicNativeBin").length;
        X(Te === he.length ? `${he.length} incorrect AI example${he.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${he.length} incorrect AI example${he.length === 1 ? "" : "s"} collected and ${he.length === 1 ? "segment rejected" : "segments rejected"}.`);
      }
    } catch (ve) {
      X(ve.message || "Unable to update the selected incorrect examples.");
    } finally {
      le(null);
    }
  }
  async function S(O) {
    var ye, be;
    if (!O || M != null || m) return;
    te(O.id);
    const ne = `incorrect-example-remove:${x.id}:${O.id}:${O.revision}:${O.representationRevision}`;
    try {
      const he = await Z(
        `/videos/${x.id}/incorrect-examples/${O.id}/remove`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(ne),
            expectedExampleRevision: O.revision,
            expectedRepresentationRevision: O.representationRevision
          })
        }
      );
      Fe(ne);
      const Ae = await Z(
        `/videos/${x.id}/incorrect-examples`
      );
      B(Ae), W(
        Go(c, he.editorDelta),
        x.id
      ), O.representation === "basicNativeBin" && Nn(), X(O.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed.");
    } catch (he) {
      if (he.status === 409 && ((be = (ye = he.payload) == null ? void 0 : ye.result) == null ? void 0 : be.code) === "OPERATION_REPLAYED") {
        Fe(ne), B(await Z(
          `/videos/${x.id}/incorrect-examples`
        )), await j(), X("Incorrect example removal was already applied.");
        return;
      }
      he.status === 409 && await N(), X(he.message || "Unable to remove the incorrect example.");
    } finally {
      te(null);
    }
  }
  async function k() {
    if (m || M != null || u.length === 0) return;
    ge(!0);
    const O = `incorrect-example-export:${x.id}:${u.map((ne) => `${ne.id}:${ne.revision}:${ne.representationRevision}`).join(",")}`;
    try {
      const ne = await Ol(
        x.id,
        u
      ), ye = new FormData();
      ye.append("metadata", JSON.stringify({
        operationId: Le(O),
        examples: ne.captures
      }));
      for (const Ie of ne.files)
        ye.append(Ie.fieldName, Ie.file);
      const be = await Z(
        `/videos/${x.id}/incorrect-examples/export`,
        { method: "POST", body: ye }
      ), he = await Zs(be.downloadUrl), Ae = URL.createObjectURL(he.blob), Ee = document.createElement("a");
      Ee.href = Ae, Ee.download = he.fileName, Ee.click(), setTimeout(() => URL.revokeObjectURL(Ae), 1e3);
      const Ne = await Z(
        `/training-exports/${be.id}/complete`,
        { method: "POST" }
      );
      Fe(O), B(await Z(
        `/videos/${x.id}/incorrect-examples`
      )), X(
        `Downloaded ${be.exampleCount} incorrect example${be.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Ne.clearedExampleCount} from the working collection.`
      );
    } catch (ne) {
      X(ne.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      ge(!1);
    }
  }
  async function q(O = null) {
    const ne = U.filter((Ce) => Ce.reviewState === "rejected"), ye = ne.length, be = u.some((Ce) => Ce.representation === "fullItem");
    if (O == null && ye === 0 && !be) {
      X("There are no rejected segments to delete.");
      return;
    }
    if (O == null) {
      le(-1), X("Preparing deletion summary…");
      try {
        const Ce = await Z(`/videos/${x.id}/rejected/deletion/preview`, { method: "POST" }), ve = Number(Ce.deletedSegmentCount) || 0, Oe = Number(Ce.deferredRejectedSegmentCount) || 0, De = Number(Ce.protectedIncorrectExampleCount) || 0;
        if (ve === 0) {
          Oe > 0 ? X(
            `${Oe} feedback-protected rejected segment${Oe === 1 ? "" : "s"} kept. ${De} AI feedback example${De === 1 ? "" : "s"} must be exported before ${Oe === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : X("There are no rejected segments to delete.");
          return;
        }
        if (!Ma(Ce, X)) return;
        z(Ce), X("");
      } catch (Ce) {
        X(Ce.message || "Unable to prepare rejected segment deletion.");
      } finally {
        le(null);
      }
      return;
    }
    const he = O, Ae = Number(he.deferredRejectedSegmentCount) || 0, Ee = V.current, Ne = Ae === 0 ? Lr(c, ne.map((Ce) => Ce.id)) : c, Ie = Ne.segments.find((Ce) => Ce.reviewState === "unreviewed") || Ne.segments[0] || null;
    z(null), le(-1), X("Deleting rejected segments…"), Ae === 0 && (W(Ne, x.id), C(Ie ? [Ie.id] : []), K((Ie == null ? void 0 : Ie.id) ?? null), $.current = (Ie == null ? void 0 : Ie.id) ?? null, P.current = []);
    try {
      const Ce = `rejected-dependency-delete:${x.id}:${he.fingerprint}`, ve = await Z(`/videos/${x.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(Ce),
          fingerprint: he.fingerprint
        })
      });
      Fe(Ce), await j(), ve.deletedSegmentCount > 0 && t(St);
      const Oe = Ae > 0 ? ` ${Ae} feedback-protected rejected segment${Ae === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      X(`${ve.deletedSegmentCount} segment${ve.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Oe}`);
    } catch (Ce) {
      Ae === 0 && W((ve) => za(
        ve,
        ne
      ), x.id), C(Ee == null ? [] : [Ee]), K(Ee), $.current = Ee, P.current = [], X(Ce.message || "Unable to delete rejected segments.");
    } finally {
      le(null);
    }
  }
  async function ue(O = o) {
    if (!(i || O.length === 0)) {
      me(!0), J("");
      try {
        const ne = await Z(`/videos/${x.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: O.flatMap((ye) => ye.nativeSegmentId == null ? [] : [ye.nativeSegmentId]),
            itemIds: O.flatMap((ye) => ye.published || ye.itemId == null ? [] : [ye.itemId])
          })
        });
        se(!1), await j(), X(`${ne.assignedSegmentCount} segment${ne.assignedSegmentCount === 1 ? "" : "s"} received ${ne.assignedSlotCount} performer-slot assignment${ne.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (ne) {
        J(ne.message || "Unable to auto-assign performers.");
      } finally {
        me(!1);
      }
    }
  }
  async function ae() {
    oe(!0), Q(""), !h && (de(!0), T());
  }
  function re() {
    f.current = !0, oe(!1), requestAnimationFrame(() => {
      var O;
      return (O = p.current) == null ? void 0 : O.focus({ preventScroll: !0 });
    });
  }
  async function Se() {
    if (!h || w || h.createCount + h.linkCount === 0)
      return;
    ke(!0), Q("");
    let O;
    try {
      const ne = `materialize-derived:${x.id}:${h.fingerprint}`;
      O = await Z(`/videos/${x.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(ne),
          fingerprint: h.fingerprint,
          maxDepth: 3
        })
      }), Fe(ne);
    } catch (ne) {
      ne.status === 409 && xe(null), Q(ne.message || "Unable to materialize derived segments."), ke(!1);
      return;
    }
    xe((ne) => ne && { ...ne, createCount: 0, linkCount: 0 });
    try {
      await j(), re(), xe(null);
      const ne = O.createdCount + O.linkedCount;
      X(`${O.createdCount} derived segment${O.createdCount === 1 ? "" : "s"} created and ${O.linkedCount} existing segment${O.linkedCount === 1 ? "" : "s"} linked.`), ne === 0 && X("Every applicable derivation was already materialized.");
    } catch {
      Q("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    ke(!1);
  }
  async function H(O, ne = null) {
    var be, he, Ae, Ee;
    const ye = {
      tagId: O,
      ...ne ? { tagName: ne } : {}
    };
    if (I.length > 1) {
      const Ne = I.filter((De) => De.tagId !== O);
      if (Ne.length === 0) {
        l();
        return;
      }
      const Ie = I.map((De) => ({
        id: De.id,
        itemId: De.itemId,
        nativeSegmentId: De.nativeSegmentId
      })), Ce = I.map((De) => !d || De.nativeSegmentId != null ? `native:${De.nativeSegmentId}:${De.updatedAt}` : `item:${De.itemId}:${De.revision}`).sort().join(","), ve = `bulk-tag:${x.id}:${O}:${Ce}`;
      le((D == null ? void 0 : D.id) ?? Ne[0].id), X(`Changing tag for ${Ne.length} selected segment${Ne.length === 1 ? "" : "s"}…`);
      const Oe = rr(
        c,
        Ne.map((De) => De.id),
        ye
      );
      W(Oe, x.id), l();
      try {
        const De = d ? null : crypto.randomUUID();
        await Z(`/videos/${x.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(ve),
            tagId: O,
            historyReceiptId: De,
            segments: I.map((je) => {
              const Te = !d || je.nativeSegmentId != null;
              return {
                nativeSegmentId: Te ? je.nativeSegmentId : null,
                itemId: Te ? null : je.itemId,
                expectedUpdatedAt: Te ? je.updatedAt : null,
                expectedRevision: Te ? null : je.revision
              };
            })
          })
        }), Fe(ve);
        const at = lt(
          I,
          d
        ), we = await j(), Pe = Ie.map((je) => He(we == null ? void 0 : we.segments, je)).filter(Boolean);
        await F(
          "segments.tag",
          `Changed tag for ${Ne.length} segment${Ne.length === 1 ? "" : "s"}`,
          at,
          lt(Pe, d),
          De
        );
        const qe = Ie.map((je) => He(we == null ? void 0 : we.segments, je)).filter(Boolean);
        C(qe.map((je) => je.id)), K(((be = qe.find((je) => je.id === (D == null ? void 0 : D.id))) == null ? void 0 : be.id) ?? ((he = qe[0]) == null ? void 0 : he.id) ?? null), l(), X(`${Ne.length} selected segment${Ne.length === 1 ? "" : "s"} retagged.`);
      } catch (De) {
        W((Pe) => Rn(
          Pe,
          Ne,
          Object.keys(ye)
        ), x.id);
        const at = Ie.map((Pe) => He(c.segments, Pe)).filter(Boolean), we = He(c.segments, {
          id: D == null ? void 0 : D.id,
          itemId: D == null ? void 0 : D.itemId,
          nativeSegmentId: D == null ? void 0 : D.nativeSegmentId
        }) || at[0] || null;
        C(at.map((Pe) => Pe.id)), K((we == null ? void 0 : we.id) ?? null), $.current = (we == null ? void 0 : we.id) ?? null, P.current = [], De.status === 409 && await N(), X(De.message || "Unable to change the selected segment tags.");
      } finally {
        le(null);
      }
      return;
    }
    if (!(I.length !== 1 || !D)) {
      if (O === D.tagId) {
        l();
        return;
      }
      if (D.itemId != null && ((Ee = (Ae = y.data) == null ? void 0 : Ae.children) == null ? void 0 : Ee.length) > 0) {
        le(D.id), X("Checking lineage impact…");
        try {
          const Ne = await Z(`/items/${D.itemId}/tag-change/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedRevision: D.revision, tagId: O })
          }), Ie = Ne.deletedItemIds.length > 0 || Ne.removedEdgeIds.length > 0;
          if (Ie && !window.confirm(
            `Changing this tag removes ${Ne.removedEdgeIds.length} lineage edge${Ne.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${Ne.deletedItemIds.length} derived segment${Ne.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
          )) {
            X("Tag change canceled.");
            return;
          }
          const Ce = rr(
            c,
            [D.id],
            ye
          );
          W(Ce, x.id), l();
          const ve = `tag-change:${D.itemId}:${D.revision}:${Ne.componentFingerprint}:${O}`;
          await Z(`/items/${D.itemId}/tag-change/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Le(ve),
              expectedRevision: D.revision,
              componentFingerprint: Ne.componentFingerprint,
              tagId: O
            })
          }), Fe(ve), await j(), l(), X(Ie ? "Tag changed and lineage reconciled." : "Tag changed.");
        } catch (Ne) {
          W((Ie) => Rn(
            Ie,
            [D],
            Object.keys(ye)
          ), x.id), C([D.id]), K(D.id), $.current = D.id, P.current = [], Ne.status === 409 ? (X("Lineage changed — loading the latest segments…"), await N()) : X(Ne.message || "Unable to reconcile the lineage.");
        } finally {
          le(null);
        }
        return;
      }
      l(), await v(D, {
        startSec: D.startSec,
        endSec: D.endSec,
        tagId: O
      }, !0, null, !0, ye);
    }
  }
  async function ee() {
    var Ee, Ne, Ie, Ce;
    if (!s || !D || R != null) return;
    const O = [...I].sort((ve, Oe) => Number(ve.nativeSegmentId ?? ve.id) - Number(Oe.nativeSegmentId ?? Oe.id)), ne = new Set(O.map((ve) => ve.id)), ye = O.map((ve) => `${ve.nativeSegmentId ?? ve.id}:${ve.updatedAt}`).join("|");
    le(D.id), X(`Moving ${O.length} segment${O.length === 1 ? "" : "s"} to recycling bin…`);
    const be = `bulk-move:${x.id}:${ye}`, he = Le(be), Ae = d ? null : crypto.randomUUID();
    try {
      const ve = (Pe = !1) => Z(`/videos/${x.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: he,
          segments: O.map((qe) => ({
            segmentId: qe.nativeSegmentId ?? qe.id,
            expectedUpdatedAt: qe.updatedAt
          })),
          discardMissingImage: Pe,
          ...d ? { reviewState: "rejected" } : {},
          historyReceiptId: Ae
        })
      });
      let Oe;
      try {
        Oe = await ve(
          _r(be)
        );
      } catch (Pe) {
        if (((Ee = Pe.payload) == null ? void 0 : Ee.code) !== "missing-image" || !window.confirm(`${Pe.message}

Continue and discard the missing image reference?`)) throw Pe;
        Hr(be), Oe = await ve(!0);
      }
      Fe(be), Nn();
      const De = new Map((Oe.items || []).map((Pe) => [
        Number(Pe.segmentId),
        Pe
      ]));
      await F(
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
        Ae
      );
      const at = U.filter((Pe) => !ne.has(Pe.id)), we = ms(r, ne, D.id);
      W({ ...c, segments: at }, x.id), C(we ? [we.id] : []), K((we == null ? void 0 : we.id) ?? null), $.current = (we == null ? void 0 : we.id) ?? null, P.current = [], we && (b(ut(r, we.id)), E(we.id)), requestAnimationFrame(() => {
        var Pe;
        return (Pe = g.current) == null ? void 0 : Pe.focus({ preventScroll: !0 });
      }), X(`Moved ${O.length} segment${O.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (ve) {
      const Oe = ((Ne = ve.payload) == null ? void 0 : Ne.code) || ((Ce = (Ie = ve.payload) == null ? void 0 : Ie.result) == null ? void 0 : Ce.code);
      ve.status === 409 && Oe === "CANONICAL_SEGMENT_CHANGED" ? await N() : X(ve.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      le(null);
    }
  }
  async function Y() {
    if (!(d || a.current || R != null)) {
      a.current = !0, X("Checking the recycling bin…");
      try {
        const O = await Z("/bin"), ne = await Ea(O, () => X("Emptying the recycling bin…"));
        if (ne.status === "empty") {
          X("The recycling bin is empty.");
          return;
        }
        if (ne.status === "canceled") {
          X("The recycling bin was not emptied.");
          return;
        }
        X(`${ne.segmentCount} segment${ne.segmentCount === 1 ? "" : "s"} from ${ne.sceneCount} scene${ne.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (O) {
        X(O.message || "Unable to empty the recycling bin.");
      } finally {
        a.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: A, removeIncorrectExample: S, captureTrainingExport: k, deleteRejectedSegments: q, autoAssignPerformers: ue, previewDerivedSegments: ae, closeMaterializeDialog: re, materializeDerivedSegments: Se, saveTag: H, moveToBin: ee, emptyRecyclingBin: Y };
}
function Nd(e) {
  const { acceptHistory: t, compatibilityMode: r, currentTime: o, detail: i, editorLayout: a, focusRowRef: s, history: l, historyRef: d, historySaving: c, horizontalLayoutSize: g, mediaStackHeight: m, mediaStackRef: u, onDetailChange: y, onReload: p, railToggleRef: h, recordHistoryAction: f, savingSegmentId: w, savingShot: v, savingShotRef: N, setCollapsedSegmentGroups: W, setEditorLayout: j, setHistorySaving: F, setSaveMessage: T, setSavingSegmentId: M, setSavingShot: E, shotBoundaries: R, timelineDuration: U, video: D, workspaceRef: V } = e;
  async function I(b, K, C) {
    var k, q, ue, ae;
    const x = b.type === "segment" ? [b] : b.segments || [], A = (K == null ? void 0 : K.type) === "segment" ? [K] : (K == null ? void 0 : K.segments) || [];
    let S = C;
    for (const [re, Se] of x.entries()) {
      const H = A[re], ee = ((k = Se.identity) == null ? void 0 : k.nativeSegmentId) != null || ((q = Se.identity) == null ? void 0 : q.published) === !0, Y = ((ue = H == null ? void 0 : H.identity) == null ? void 0 : ue.recycleBinItemId) ?? ((ae = H == null ? void 0 : H.identity) == null ? void 0 : ae.itemId);
      let O = He(S.segments, H == null ? void 0 : H.identity) || He(S.segments, Se.identity);
      if (!O && ee && Y != null && H.identity.revision != null) {
        const be = `history-restore:${D.id}:${Y}:${H.identity.revision}`;
        await Z(`/bin/${Y}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(be),
            expectedRevision: H.identity.revision
          })
        }), Fe(be), S = await p(), O = S.segments.find((he) => he.tagId === Se.values.tagId && he.startSec === Se.values.startSec && he.endSec === Se.values.endSec);
      }
      if (!O)
        throw new Error("A segment in this history state no longer exists.");
      if ((O.nativeSegmentId != null || O.published === !0) !== ee) {
        if (ee) {
          const be = O.recycleBinItemId ?? O.itemId ?? Y;
          if (be == null)
            throw new Error("This recycled segment can no longer be restored.");
          const he = `history-restore:${D.id}:${be}:${O.revision}:${Se.values.reviewState ?? "native"}`;
          await Z(`/bin/${be}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Le(he),
              expectedRevision: O.revision
            })
          }), Fe(he);
        } else {
          const be = `history-bin:${D.id}:${O.nativeSegmentId}:${O.updatedAt}:${Se.values.reviewState}`;
          await Z(`/videos/${D.id}/segments/${O.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Le(be),
              expectedUpdatedAt: O.updatedAt,
              reviewState: Se.values.reviewState
            })
          }), Fe(be);
        }
        if (S = await p(), !ee)
          continue;
        if (O = He(S.segments, Se.identity) || S.segments.find((be) => be.tagId === Se.values.tagId && be.startSec === Se.values.startSec && be.endSec === Se.values.endSec), !O)
          throw new Error("The restored segment could not be found.");
      }
      const ye = Se.values;
      if (O.nativeSegmentId == null && O.itemId != null) {
        const be = `history-draft-update:${D.id}:${O.itemId}:${O.revision}:${ye.tagId}:${ye.startSec}:${ye.endSec ?? "open"}:${ye.reviewState}`;
        await Z(`/videos/${D.id}/drafts/${O.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(be),
            expectedRevision: O.revision,
            ...ye
          })
        }), Fe(be);
      } else
        await Z(`/videos/${D.id}/segments/${O.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...ye, expectedUpdatedAt: O.updatedAt })
        });
      S = await p();
    }
    return S;
  }
  async function $(b, K) {
    var C;
    for (const x of b.targets || []) {
      const A = He(K.segments, x.identity);
      if (!A)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const S = (C = K.performerSlotRevisions) == null ? void 0 : C[A.id];
      await Z(A.published ? `/videos/${D.id}/segments/${A.nativeSegmentId}/slots` : `/videos/${D.id}/drafts/${A.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: S,
          assignments: x.assignments
        })
      }), K = await p();
    }
    return K;
  }
  async function P(b, K, C = []) {
    const x = b.state;
    if (!r && ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")) {
      const S = `basic-history:${D.id}:${d.current.revision}:${b.action.sequence}:${b.direction}`, k = await Z(`/videos/${D.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(S),
          expectedHistoryRevision: d.current.revision,
          actionSequence: b.action.sequence,
          direction: b.direction
        })
      });
      return t(k.history), C.push(S), p();
    }
    const A = b.direction === "backward" ? b.action.afterState : b.action.beforeState;
    if ((x == null ? void 0 : x.type) === "composite") {
      let S = K;
      const k = (A == null ? void 0 : A.type) === "composite" ? A.states || [] : [];
      for (const [q, ue] of (x.states || []).entries()) {
        const ae = k[q];
        S = await P({
          ...b,
          state: ue,
          action: {
            ...b.action,
            beforeState: b.direction === "backward" ? ue : ae,
            afterState: b.direction === "backward" ? ae : ue
          }
        }, S, C);
      }
      return S;
    }
    if ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")
      return I(
        x,
        A,
        K
      );
    if ((x == null ? void 0 : x.type) === "performerSlots")
      return $(x, K);
    if ((x == null ? void 0 : x.type) === "shots") {
      const S = Zn(K.shotBoundaries || []), k = await Z(`/videos/${D.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(`history-shots:${D.id}:${S}:${x.fingerprint}`),
          expectedFingerprint: S,
          boundaries: x.boundaries
        })
      });
      return { ...K, shotBoundaries: k };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function J(b) {
    var C;
    if (c || w != null || v || b === l.cursorSequence)
      return;
    const K = ul(l, b);
    if (K.length !== 0) {
      F(!0), M(-1), T(`Restoring ${K.length} history ${K.length === 1 ? "action" : "actions"}…`);
      try {
        let x = i;
        const A = [];
        for (const k of K)
          x = await P(
            k,
            x,
            A
          );
        const S = r ? await Z(`/videos/${D.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: d.current.revision,
            targetSequence: b
          })
        }) : d.current;
        A.forEach(Fe), t(S), await p(), T("History restored.");
      } catch (x) {
        x.status === 409 && ((C = x.payload) != null && C.current) && t(x.payload.current), await p(), T(x.message || "Unable to restore editor history.");
      } finally {
        M(null), F(!1);
      }
    }
  }
  function se(b) {
    j((K) => ({ ...K, timelineRatio: Ur(b, m) }));
  }
  function me(b) {
    var C;
    const K = (C = u.current) == null ? void 0 : C.getBoundingClientRect();
    K && se(Qi(b.clientY, K.top, K.height));
  }
  function ge(b) {
    b.currentTarget.setPointerCapture(b.pointerId), me(b);
  }
  function B(b) {
    b.currentTarget.hasPointerCapture(b.pointerId) && me(b);
  }
  function Q(b) {
    const K = b.shiftKey ? 0.1 : 0.05;
    let C = null;
    b.key === "ArrowUp" && (C = a.timelineRatio + K), b.key === "ArrowDown" && (C = a.timelineRatio - K);
    const x = Kr(m);
    b.key === "Home" && (C = x.minimum), b.key === "End" && (C = x.maximum), C != null && (b.preventDefault(), b.stopPropagation(), se(C));
  }
  function de(b) {
    const K = b === "detailWidth" ? g.focusRow : g.workspace, C = g.workspace > 0 ? Mr(g.workspace, 600) : 560, x = Pt(a.markerRailWidth, C), A = b === "detailWidth" ? 344 + (a.markerRailOpen ? x + 24 : 0) : 600;
    return K > 0 ? Mr(K, A) : 560;
  }
  function oe(b, K) {
    j((C) => ({ ...C, [b]: Pt(K, de(b)) }));
  }
  function xe(b, K) {
    var x, A;
    const C = K === "detailWidth" ? (x = s.current) == null ? void 0 : x.getBoundingClientRect() : (A = V.current) == null ? void 0 : A.getBoundingClientRect();
    C && oe(K, K === "detailWidth" ? b.clientX - C.left : C.right - b.clientX);
  }
  function ke(b, K) {
    const C = de(b), x = Pt(a[b], C);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": K,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(C),
      "aria-valuenow": Math.round(x),
      "aria-valuetext": `${Math.round(x)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (A) => {
        A.currentTarget.setPointerCapture(A.pointerId), xe(A, b);
      },
      onPointerMove: (A) => {
        A.currentTarget.hasPointerCapture(A.pointerId) && xe(A, b);
      },
      onKeyDown: (A) => {
        const S = A.shiftKey ? 40 : 16;
        let k = null;
        A.key === "ArrowLeft" && (k = b === "detailWidth" ? -S : S), A.key === "ArrowRight" && (k = b === "detailWidth" ? S : -S);
        let q = k == null ? null : x + k;
        A.key === "Home" && (q = 240), A.key === "End" && (q = C), q != null && (A.preventDefault(), A.stopPropagation(), oe(b, q));
      },
      onDoubleClick: () => oe(b, rt[b]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function z() {
    j((b) => ({ ...b, markerRailOpen: !b.markerRailOpen })), requestAnimationFrame(() => {
      var b;
      return (b = h.current) == null ? void 0 : b.focus({ preventScroll: !0 });
    });
  }
  function te(b) {
    W((K) => K.includes(b) ? K.filter((C) => C !== b) : Rt([...K, b]));
  }
  async function X(b, K = !0, C = o) {
    var k;
    if (N.current) return null;
    const x = Number((k = D.videoFile) == null ? void 0 : k.duration) || U, A = Zn(R), S = `shot-${b}:${D.id}:${C.toFixed(3)}:${x.toFixed(3)}:${A}`;
    N.current = !0, E(!0), T(b === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const q = await Z(`/videos/${D.id}/shot-boundaries/${b}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b === "split" ? { operationId: Le(S), timeSec: C } : { operationId: Le(S), timeSec: C })
      });
      return Fe(S), y((ue) => ({ ...ue, shotBoundaries: q }), D.id), K && await f(
        "shots.update",
        b === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: R,
          fingerprint: A
        },
        {
          type: "shots",
          boundaries: q,
          fingerprint: Zn(q)
        }
      ), T(b === "split" ? "Shot boundary added." : "Shots merged."), q;
    } catch (q) {
      return T(q.message || "Unable to edit shot boundaries."), null;
    } finally {
      N.current = !1, E(!1);
    }
  }
  async function le(b) {
    if (N.current) return null;
    const K = `shot-restore:${D.id}:${b.afterFingerprint}`;
    N.current = !0, E(!0), T("Undoing shot edit…");
    try {
      const C = await Z(`/videos/${D.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(K),
          expectedFingerprint: b.afterFingerprint,
          boundaries: b.before
        })
      });
      return Fe(K), y((x) => ({ ...x, shotBoundaries: C }), D.id), C;
    } catch (C) {
      return T(C.message || "Unable to undo the shot edit."), null;
    } finally {
      N.current = !1, E(!1);
    }
  }
  return { applySegmentHistoryState: I, applyPerformerSlotHistoryState: $, applyHistoryState: P, restoreHistoryTarget: J, updateTimelineRatio: se, updateTimelineRatioFromPointer: me, handleSeparatorPointerDown: ge, handleSeparatorPointerMove: B, handleSeparatorKeyDown: Q, panelWidthMaximum: de, updatePanelWidth: oe, handlePanelSeparatorPointer: xe, panelSeparatorProps: ke, toggleSegmentRail: z, toggleSegmentGroup: te, mutateShotBoundary: X, restoreShotBoundaries: le };
}
function Id(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: m, lineage: u, mediaDuration: y, mergeSelectedSwimlane: p, moveToBin: h, mutateShotBoundary: f, openPublishApprovedDialog: w, playbackControlsRef: v, playbackShortcutConfig: N, saveSelectedReviewState: W, seekRef: j, segmentGroupKeys: F, selectSegment: T, selectedSegment: M, selectedSegmentGroupForSegment: E, selectedSegmentGroupKey: R, selectedSegments: U, setCollapsedSegmentGroups: D, setIncorrectExamplesOpen: V, setQuickSearchOpen: I, setSaveMessage: $, setSelectedSegmentGroupKey: P, setTagEditing: J, setTimelineZoom: se, shotBoundaries: me, slotButtonRef: ge, splitSegment: B, swimlanes: Q, timelineDuration: de, toggleIncorrectExample: oe, toggleSegmentGroup: xe, updateTimelineRatio: ke, videoFrameRate: z, visibleSegments: te } = e;
  function X(b, K) {
    if (U.length > 1 && vs(b.id))
      return;
    let C = null;
    b.id === "video.playPause" && (C = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.toggle();
    }), b.id === "video.seekSmallBackward" && (C = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(-N.smallSeekTime);
    }), b.id === "video.seekSmallForward" && (C = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(N.smallSeekTime);
    }), b.id === "video.seekMediumBackward" && (C = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(-N.mediumSeekTime);
    }), b.id === "video.seekMediumForward" && (C = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(N.mediumSeekTime);
    }), b.id === "video.seekLongBackward" && (C = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(-N.longSeekTime);
    }), b.id === "video.seekLongForward" && (C = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(N.longSeekTime);
    }), b.id === "video.playSelected" && M && (C = () => {
      var x;
      (x = j.current) == null || x.call(j, M.startSec, !0), requestAnimationFrame(() => {
        var A;
        return (A = g.current) == null ? void 0 : A.focus({ preventScroll: !0 });
      });
    }), (b.id === "video.playPreviousSegment" || b.id === "video.playNextSegment") && (C = () => {
      var A;
      const x = Pr(
        Q,
        M == null ? void 0 : M.id,
        b.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !x || x.id === (M == null ? void 0 : M.id) || (T(x, { focusEditor: !0, seekToSegment: !1 }), (A = j.current) == null || A.call(j, x.startSec, !0));
    }), b.id.startsWith("video.seekPercent") && (C = () => {
      var A;
      const x = Number(b.id.slice(17)) / 10;
      (A = j.current) == null || A.call(j, ps(y ?? de, x), !1);
    }), b.id === "video.jumpToSegmentStart" && M && (C = () => {
      var x;
      return (x = j.current) == null ? void 0 : x.call(j, M.startSec, !1);
    }), b.id === "video.jumpToSegmentEnd" && M && (C = () => {
      var x;
      return (x = j.current) == null ? void 0 : x.call(j, M.endSec ?? M.startSec, !1);
    }), b.id === "video.jumpToVideoStart" && (C = () => {
      var x;
      return (x = j.current) == null ? void 0 : x.call(j, 0, !1);
    }), b.id === "video.jumpToVideoEnd" && (C = () => {
      var x;
      return (x = j.current) == null ? void 0 : x.call(j, de, !1);
    }), b.id.startsWith("video.frame") && (C = () => {
      var S, k;
      const x = b.id.includes("Small") ? "small" : b.id.includes("Medium") ? "medium" : "long", A = N[`${x}FrameStep`] * (b.id.endsWith("Backward") ? -1 : 1);
      (S = v.current) == null || S.pause(), (k = v.current) == null || k.seekBy(Ds(A, z));
    }), b.id.startsWith("navigation.swimlane") && (C = () => {
      const x = b.id.slice(19).toLowerCase(), A = Pr(Q, M == null ? void 0 : M.id, x, s);
      A && T(A, { focusEditor: !0, seekToSegment: !1 });
    }), (b.id === "navigation.extendSwimlaneLeft" || b.id === "navigation.extendSwimlaneRight") && (C = () => {
      const x = $l(
        t,
        M == null ? void 0 : M.id,
        b.id.endsWith("Left") ? "left" : "right"
      );
      x && T(x.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: x.segmentIds
      });
    }), (b.id === "navigation.segmentGroupUp" || b.id === "navigation.segmentGroupDown") && (C = () => {
      const x = Tl(
        F,
        R ?? E,
        b.id.endsWith("Up") ? -1 : 1
      );
      x && P(x);
    }), (b.id === "navigation.previousAtPlayhead" || b.id === "navigation.nextAtPlayhead") && (C = () => {
      const x = Zi(te, s, b.id === "navigation.previousAtPlayhead" ? -1 : 1, M == null ? void 0 : M.id);
      x && T(x, { focusEditor: !0, seekToSegment: !1 });
    }), b.id === "navigation.nearestInCurrentSwimlane" && (C = () => {
      const x = Ki(
        Q,
        M == null ? void 0 : M.id,
        s
      );
      x && T(x, { focusEditor: !0, seekToSegment: !1 });
    }), b.id.includes("Unreviewed") && (C = () => {
      const x = pa(
        Q,
        M == null ? void 0 : M.id,
        b.id.startsWith("navigation.previous") ? -1 : 1,
        b.id.endsWith("Global")
      );
      x && T(x, { focusEditor: !0, seekToSegment: !1 });
    }), (b.id === "navigation.nextTouchingPlayhead" || b.id === "navigation.previousTouchingPlayhead") && (C = () => {
      const x = Gi(Q, s, b.id === "navigation.previousTouchingPlayhead" ? -1 : 1, M == null ? void 0 : M.id);
      x && T(x, { focusEditor: !0, seekToSegment: !1 });
    }), b.id === "navigation.quickSearch" && (C = () => I(!0)), (b.id === "navigation.previousShot" || b.id === "navigation.nextShot") && (C = () => {
      var A;
      const x = Es(me, s, b.id === "navigation.previousShot" ? -1 : 1);
      x && ((A = j.current) == null || A.call(j, x.startSec, !1));
    }), b.id === "shot.split" && (C = () => f("split")), b.id === "shot.merge" && (C = () => f("merge")), b.id === "marker.create" && (C = () => a()), b.id === "marker.duplicate" && (C = () => d(!1)), b.id === "marker.duplicateAtPlayhead" && (C = () => d(!0)), b.id === "marker.split" && (C = () => B()), b.id === "marker.editTag" && (C = () => {
      var x;
      if (U.length > 1 && U.some((A) => A.isDerived)) {
        $("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((x = u.data) != null && x.tagReadOnly) {
        $("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      J(!0);
    }), b.id === "marker.setStart" && M && (C = () => r(s, M.endSec)), b.id === "marker.setEnd" && M && (C = () => r(M.startSec, s)), b.id === "marker.copyTiming" && M && (C = () => {
      $(ql(M) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), b.id === "marker.pasteTiming" && M && (C = () => {
      const x = Hl();
      if (!x) {
        $("No copied segment timing is available.");
        return;
      }
      r(x.startSec, x.endSec);
    }), b.id === "marker.mergeSelection" && (C = () => p()), b.id === "marker.moveToBin" && (C = () => h()), b.id === "marker.toggleIncorrectExample" && M && (C = () => oe()), b.id === "marker.openIncorrectExamples" && (C = () => V(!0)), b.id === "markerGroup.toggleCollapse" && R && (C = () => xe(R)), b.id === "markerGroup.toggleAll" && (C = () => D((x) => Cl(x, F))), b.id === "marker.assignSlots" && (C = () => {
      var x;
      return (x = ge.current) == null ? void 0 : x.click();
    }), b.id === "navigation.zoomIn" && (C = () => se((x) => Xn(x + 0.5))), b.id === "navigation.zoomOut" && (C = () => se((x) => Xn(x - 0.5))), b.id === "navigation.resetZoom" && (C = () => se(1)), b.id === "navigation.centerPlayhead" && (C = () => {
      var x;
      return (x = o.current) == null ? void 0 : x.call(o);
    }), b.id === "layout.growSwimlanes" && (C = () => ke(c.timelineRatio + 0.05)), b.id === "layout.shrinkSwimlanes" && (C = () => ke(c.timelineRatio - 0.05)), b.id === "marker.confirm" && M && (C = () => W("approved")), b.id === "system.publishApproved" && (C = () => w(K.target)), b.id === "marker.reject" && M && (C = () => W("rejected")), b.id === "system.emptyBin" && (C = () => m()), b.id === "system.deleteRejected" && (C = () => l()), C && C();
  }
  function le(b, K) {
    const C = Mn.find((x) => x.id === b);
    C && Qt(C, i) && X(C, K);
  }
  return { executeShortcutById: le };
}
function Cd(e, t, r = !1, o = 0, i = "") {
  const [a, s] = L(null), [l, d] = L(null), [c, g] = L(""), [m, u] = L({
    busy: !1,
    reviewState: null,
    error: ""
  }), y = pe(null);
  async function p(w) {
    u({ busy: !0, reviewState: w, error: "" });
    try {
      await Z(`/videos/${e}/native-segments/import`, {
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
  async function h() {
    try {
      const w = await Z(`/videos/${e}/analysis-runs`), v = (w == null ? void 0 : w[0]) || null;
      return s(v), (v == null ? void 0 : v.status) === "completed" && y.current !== v.id && (y.current = v.id, await t()), ((v == null ? void 0 : v.status) === "failed" || (v == null ? void 0 : v.status) === "cancelled") && g(v.errorMessage || "Video analysis did not complete."), v;
    } catch (w) {
      return g(w.message || "Unable to load video analysis status."), null;
    }
  }
  async function f(w = null) {
    g("");
    const v = w || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), N = v.includes("omnishotcut") && o > 0;
    if (!(N && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const W = await Z(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: v,
            replaceShotBoundaries: N,
            expectedShotBoundaryFingerprint: N ? i : null
          })
        });
        s(W);
      } catch (W) {
        g(W.message || "Unable to start video analysis.");
      }
  }
  return fe(() => {
    h(), Z("/analysis/status").then((w) => {
      d(w), w.configured || g("");
    }).catch((w) => g(w.message || "Unable to check video analysis readiness."));
  }, [e, r]), fe(() => {
    if ((a == null ? void 0 : a.status) !== "queued" && (a == null ? void 0 : a.status) !== "running") return;
    const w = setInterval(h, 2500);
    return () => clearInterval(w);
  }, [a == null ? void 0 : a.id, a == null ? void 0 : a.status]), {
    analysisError: c,
    analysisRun: a,
    analysisStatus: l,
    importNativeSegments: p,
    nativeImportState: m,
    startFullAnalysis: f
  };
}
const wn = Object.freeze([]);
function $d(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Td({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var go, po, fo, yo, bo;
  const [g, m] = L(null), [u, y] = L([]), p = pe(null), h = pe(null), f = pe([]), w = pe(null), [v, N] = L(() => dt({})), [W, j] = L(!1), [F, T] = L(ys), [M, E] = L(0), [R, U] = L(null), [D, V] = L(!1), [I, $] = L(""), [P, J] = L(""), [se, me] = L(""), [ge, B] = L(1), [Q, de] = L(Kl), [oe, xe] = L(0), [ke, z] = L({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [te, X] = L(St), le = pe(St), [b, K] = L(!1), [C, x] = L(!1), [A, S] = L(!1), [k, q] = L(!1), ue = pe(!1), [ae, re] = L(null), [Se, H] = L(null), ee = pe(null), [Y, O] = L(!1), [ne, ye] = L(""), be = pe(null), he = pe(null), Ae = pe(!1), Ee = pe([]), Ne = pe(!1), [Ie, Ce] = L(Ul), [ve, Oe] = L(null), [De, at] = L(!1), [we, Pe] = L(!1), [qe, je] = L(!1), [Te, Re] = L(!1), [Ke, it] = L(!1), [Qe, Ye] = L(""), {
    analysisError: wt,
    analysisRun: Nt,
    analysisStatus: lr,
    importNativeSegments: En,
    nativeImportState: Xt,
    startFullAnalysis: Dn
  } = Cd(
    e.video.id,
    o,
    l,
    ((go = e.shotBoundaries) == null ? void 0 : go.length) || 0,
    Zn(e.shotBoundaries || [])
  ), [Mt, dr] = L(!1), [pt, bt] = L(null), [Bt, At] = L(l), [It, cr] = L(0), [ht, ur] = L(!1), [en, tn] = L(""), [vt, nn] = L(null), Gt = pe(null), On = pe(null), rn = pe(!1), [Et, Kt] = L([]), [on, mr] = L(!1), [Pn, gr] = L(null), an = Bl(), sn = pe(null), ln = pe(null), Dt = pe(null), Ln = pe(s), Fn = pe(null), dn = pe(null), cn = pe(null), un = pe(null), tt = pe(null), jn = pe(null), Ut = pe(null), Bn = pe(null), Gn = pe(null), mn = pe(null), gn = pe(null), xt = pe(-1e12), pr = pe(null), Kn = pe(!1), pn = pe(null), [fn, yn] = L({ scrollTop: 0, height: 512 });
  fe(() => {
    if (!Mt || ht || !en) return;
    const G = requestAnimationFrame(() => {
      var ce;
      return (ce = On.current) == null ? void 0 : ce.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(G);
  }, [Mt, ht, en]), fe(() => {
    if (!rn.current || Mt || Bt) return;
    const G = requestAnimationFrame(() => {
      var ce;
      (ce = Gt.current) == null || ce.focus({ preventScroll: !0 }), rn.current = !1;
    });
    return () => cancelAnimationFrame(G);
  }, [Mt, Bt]);
  const _e = e.video, Je = e.segments || wn, Un = Ge(() => JSON.stringify({
    segments: Je.map((G) => [
      G.id,
      G.itemId,
      G.nativeSegmentId,
      G.tagId,
      G.startSec,
      G.endSec,
      G.reviewState,
      G.published,
      G.sourceKey,
      G.sourceRunId,
      G.confidence,
      G.revision,
      G.updatedAt
    ]),
    performerSlots: (e.performerSlots || wn).map((G) => [
      G.segmentId,
      G.slotDefinitionId,
      G.performerId,
      G.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [Je, e.performerSlots, e.itemMetadata]);
  fe(() => {
    if (!l) {
      bt(null), At(!1);
      return;
    }
    if (R != null) {
      At(!0);
      return;
    }
    let G = !0;
    At(!0);
    const ce = setTimeout(() => {
      Z(`/videos/${_e.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Me) => {
        G && (bt(Me), tn(""));
      }).catch((Me) => {
        G && (bt(null), tn(Me.message || "Unable to preview derived segments."));
      }).finally(() => {
        G && At(!1);
      });
    }, 150);
    return () => {
      G = !1, clearTimeout(ce);
    };
  }, [l, _e.id, Un, It, R]);
  const fr = () => cr((G) => G + 1), ft = e.segmentGroups || wn, Ue = e.performerSlots || wn, zn = l && e.performerSlotsAvailable !== !1, bn = Ge(
    () => (e.performerCandidates || []).filter((G) => G.isVideoPerformer),
    [e.performerCandidates]
  ), hn = e.shotBoundaries || wn, zt = Ge(
    () => ja(Ue),
    [Ue]
  ), Ct = Ge(
    () => Je.map((G) => {
      const ce = zt.get(G.id) || [];
      return {
        ...G,
        slots: ce,
        assignment: ce.every((Me) => Me.performerId == null) ? Hs(ce, bn) : null
      };
    }).filter((G) => G.slots.length > 0 && G.assignment != null),
    [Je, zt, bn]
  ), yr = Number((po = _e.videoFile) == null ? void 0 : po.frameRate) > 0 ? Number(_e.videoFile.frameRate) : 30;
  function vn() {
    S(!1), requestAnimationFrame(() => {
      var G;
      return (G = tt.current) == null ? void 0 : G.focus({ preventScroll: !0 });
    });
  }
  function br() {
    R == null && (gn.current = null, q(!1), $(""), requestAnimationFrame(() => {
      var G;
      return (G = tt.current) == null ? void 0 : G.focus({ preventScroll: !0 });
    }));
  }
  function xn() {
    j(!1), requestAnimationFrame(() => {
      var G, ce;
      (G = Ut.current) != null && G.isConnected ? Ut.current.focus({ preventScroll: !0 }) : (ce = tt.current) == null || ce.focus({ preventScroll: !0 });
    });
  }
  fe(() => {
    mn.current === g ? (mn.current = null, S(!0)) : S(!1);
  }, [g]), fe(() => {
    var ce;
    if (!A) return;
    const G = (ce = Gn.current) == null ? void 0 : ce.querySelector("input");
    G == null || G.focus({ preventScroll: !0 }), G == null || G.select();
  }, [A, g]), fe(() => {
    var Me, We, nt;
    const G = Lt(
      wr(
        e.segments,
        e.performerSlots || [],
        dt({}),
        l && F,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), ce = ((Me = e.segments.find((Wn) => Wn.id === s)) == null ? void 0 : Me.id) ?? ((We = ga(G)) == null ? void 0 : We.id) ?? null;
    m(ce), y(ce == null ? [] : [ce]), h.current = ce, f.current = [], Oe(ut(G, ce)), N(dt({})), j(!1), gn.current = null, q(!1), B(1), $(""), X(St), le.current = St, K(!1), (nt = tt.current) == null || nt.focus({ preventScroll: !0 });
  }, [_e.id, s]), fe(() => {
    const G = new AbortController();
    return Z(`/videos/${_e.id}/incorrect-examples`, { signal: G.signal }).then(Kt).catch((ce) => {
      ce.name !== "AbortError" && Kt([]);
    }), () => G.abort();
  }, [_e.id, d == null ? void 0 : d.effectiveMode]), fe(() => {
    const G = new AbortController();
    return Z(`/videos/${_e.id}/history`, { signal: G.signal }).then((ce) => {
      const Me = ce || St;
      le.current = Me, X(Me);
    }).catch((ce) => {
      ce.name !== "AbortError" && $(ce.message || "Unable to load editor history.");
    }), () => G.abort();
  }, [_e.id]), fe(() => {
    _l(Q);
  }, [Q.timelineRatio, Q.markerRailOpen, Q.detailWidth, Q.markerRailWidth, Q.swimlaneTitleWidth]), fe(() => {
    zl(Ie);
  }, [Ie]), fe(() => {
    bs(F);
  }, [F]), fe(() => {
    const G = dn.current;
    if (!a || !G || typeof ResizeObserver > "u") return;
    const ce = () => {
      const We = G.clientHeight;
      xe(We), de((nt) => {
        const Wn = Ur(nt.timelineRatio, We);
        return Wn === nt.timelineRatio ? nt : { ...nt, timelineRatio: Wn };
      });
    }, Me = new ResizeObserver(ce);
    return Me.observe(G), ce(), () => Me.disconnect();
  }, [a]), fe(() => {
    if (!an || typeof ResizeObserver > "u") return;
    const G = un.current, ce = cn.current;
    if (!G || !ce) return;
    const Me = () => z({
      workspace: G.clientWidth,
      focusRow: ce.clientWidth,
      focusRowHeight: ce.clientHeight
    }), We = new ResizeObserver(Me);
    return We.observe(G), We.observe(ce), Me(), () => We.disconnect();
  }, [an, Q.markerRailOpen]);
  const ct = Ge(
    () => Ko(
      wr(
        Je,
        Ue,
        v,
        l && F,
        ft
      ),
      Et,
      !0
    ),
    [
      Je,
      Ue,
      v,
      F,
      ft,
      l,
      Et
    ]
  ), hr = Object.fromEntries(Xe.map((G) => [G, ct.filter((ce) => ce.reviewState === G).length])), _t = Ko(
    wr(
      Je,
      Ue,
      { ...v, reviewStates: Xe },
      l && F,
      ft
    ),
    Et,
    !0
  ), Ht = Object.fromEntries(Xe.map((G) => [G, _t.filter((ce) => ce.reviewState === G).length])), _ = [...new Set(Je.map((G) => G.sourceKey).filter(Boolean))].sort((G, ce) => gt(G).localeCompare(gt(ce))), Be = rs(
    v,
    l && F
  ), ze = Ge(
    () => Lt(ct, ft, Ue),
    [ct, ft, Ue]
  ), ie = is(
    ze,
    g,
    s
  ), st = fs(ct, u), qt = !l && st.length > 0 && st.every((G) => G.nativeSegmentId != null), _n = ct.map((G) => G.id), Va = _n.join("|");
  p.current = (ie == null ? void 0 : ie.id) ?? null;
  const Yr = zt.get(ie == null ? void 0 : ie.id) || [], Ja = qr(Yr), Qr = Ge(
    () => wl(ze, u),
    [ze, u]
  ), vr = Ge(() => Wr(ze), [ze]), Sn = Ge(
    () => Sl(vr, Ie),
    [vr, Ie]
  ), Ya = Ge(
    () => Ba(
      Sn.rows,
      fn.scrollTop,
      fn.height
    ),
    [Sn, fn]
  ), Qa = Ge(
    () => Il(ze, Ie),
    [ze, Ie]
  ), Wt = ie ? ut(ze, ie.id) : null, xr = ft.length > 0 ? vr.map((G) => G.key) : [], Za = xr.join("|"), Hn = Math.max(
    0,
    Number((fo = _e.videoFile) == null ? void 0 : fo.duration) || 0,
    ...Je.map((G) => Number(G.endSec ?? G.startSec) || 0)
  ), Zr = Number((yo = _e.videoFile) == null ? void 0 : yo.duration) > 0 ? Number(_e.videoFile.duration) : null;
  te.actions;
  const Xa = ka();
  fe(() => {
    const G = g === er ? g : (ie == null ? void 0 : ie.id) ?? null;
    G !== g && m(G);
  }, [ie, g]), fe(() => {
    y((G) => {
      const ce = cs(
        G,
        _n,
        (ie == null ? void 0 : ie.id) ?? null
      );
      return ce.length === G.length && ce.every((Me, We) => Me === G[We]) ? G : ce;
    });
  }, [Va, ie == null ? void 0 : ie.id]);
  const Vt = (ie == null ? void 0 : ie.itemId) == null ? null : ((bo = e.itemMetadata) == null ? void 0 : bo[ie.itemId]) || null, ei = {
    key: (ie == null ? void 0 : ie.itemId) != null ? `item:${ie.itemId}` : (ie == null ? void 0 : ie.nativeSegmentId) != null ? `native:${ie.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (Vt == null ? void 0 : Vt.provenance) || (ie == null ? void 0 : ie.fieldProvenance) || [] : []
  }, Sr = (ie == null ? void 0 : ie.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (Vt == null ? void 0 : Vt.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  fe(() => {
    J(ie == null ? "" : String(ie.startSec)), me((ie == null ? void 0 : ie.endSec) == null ? "" : String(ie.endSec));
  }, [ie == null ? void 0 : ie.id, ie == null ? void 0 : ie.startSec, ie == null ? void 0 : ie.endSec]), fe(() => {
    Wt && Ce((G) => Ua(G, Wt));
  }, [_e.id, s, Wt]), fe(() => {
    Oe((G) => Rl(xr, G, Wt));
  }, [_e.id, Za, Wt]), fe(() => {
    if (!Q.markerRailOpen || (ie == null ? void 0 : ie.id) == null) return;
    const G = pn.current, ce = Sn.rows.find((nt) => nt.kind === "segment" && nt.segment.id === ie.id);
    if (!G || !ce) return;
    const Me = ce.top + ce.height;
    let We = G.scrollTop;
    ce.top < G.scrollTop ? We = ce.top : Me > G.scrollTop + G.clientHeight && (We = Math.max(0, Me - G.clientHeight)), We !== G.scrollTop && (G.scrollTop = We), yn({ scrollTop: We, height: G.clientHeight });
  }, [ie == null ? void 0 : ie.id, Sn, Q.markerRailOpen]), fe(() => {
    const G = pn.current;
    if (!Q.markerRailOpen || !G) return;
    const ce = () => yn({
      scrollTop: G.scrollTop,
      height: G.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      ce();
      return;
    }
    const Me = new ResizeObserver(ce);
    return Me.observe(G), ce(), () => Me.disconnect();
  }, [Q.markerRailOpen]);
  const { revealSegmentGroupForSelection: Xr, replaceSegmentSelection: ti, selectSegment: eo, selectSegmentCollection: ni, selectAllVideoSegments: ri } = Sd({
    allSwimlanes: ze,
    editorRef: tt,
    performerSlots: Ue,
    seekRef: sn,
    segmentGroups: ft,
    segments: Je,
    selectedSegmentId: g,
    selectedSegmentIds: u,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: f,
    setCollapsedSegmentGroups: Ce,
    setEditorFilters: N,
    setHideDerivedSegments: T,
    setSaveMessage: $,
    setSelectedSegmentGroupKey: Oe,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: y
  }), { acceptHistory: kr, recordHistoryAction: qn, mutateSegment: oi, completeReview: ai, createSegment: to, splitSegment: no, duplicateSegment: ro, saveTiming: ii, applyShortcutTiming: si } = jl({
    compatibilityMode: l,
    currentTime: M,
    detail: e,
    editorFilters: v,
    endInput: se,
    hideDerivedSegments: F,
    historyRef: le,
    mediaDuration: Zr,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: xt,
    pendingDuplicateRef: pr,
    pendingFirstSegmentStartSecRef: gn,
    pendingTagEditSegmentIdRef: mn,
    replaceSegmentSelection: ti,
    savingSegmentId: R,
    segments: Je,
    selectedSegment: ie,
    selectedSegmentIdRef: p,
    selectedSegments: st,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: f,
    setEditorFilters: N,
    setFirstSegmentTagOpen: q,
    setHideDerivedSegments: T,
    setHistory: X,
    setHistoryOpen: K,
    setPublishApprovedError: ye,
    setSaveMessage: $,
    setSavingSegmentId: U,
    setSelectedSegmentGroupKey: Oe,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: y,
    startInput: P,
    timelineDuration: Hn,
    video: _e
  });
  function oo(G = null) {
    var We;
    if (!l || R != null || !Je.some((nt) => !nt.published && nt.reviewState === "approved")) return;
    const ce = ((We = tt.current) == null ? void 0 : We.ownerDocument) ?? document, Me = ce.activeElement === ce.body ? null : ce.activeElement;
    he.current = G != null && G.isConnected && G !== ce.body ? G : Me, ye(""), O(!0);
  }
  function ao() {
    R == null && (O(!1), ye(""), requestAnimationFrame(() => {
      $d(
        he.current,
        tt.current
      ), he.current = null;
    }));
  }
  async function li() {
    await ai() && ao();
  }
  const { closeMergeConfirmation: di, mergeSelectedSwimlane: io, saveSelectedReviewState: so } = kd({
    acceptHistory: kr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: w,
    historyRef: le,
    mergeSavingRef: ue,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    pendingReviewStateRef: Ee,
    recordHistoryAction: qn,
    revealSegmentGroupForSelection: Xr,
    reviewSavingRef: Ae,
    savingSegmentId: R,
    selectedGroups: Qr,
    selectedSegment: ie,
    selectedSegmentIdRef: p,
    selectedSegments: st,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: f,
    setMergeConfirmation: re,
    setSaveMessage: $,
    setSavingSegmentId: U,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: y,
    video: _e
  }), ci = (G) => {
    Ee.current = Ts(
      Ee.current,
      G
    );
  };
  fe(() => {
    if (R != null || Ae.current) return;
    let G = !1;
    for (; Ee.current.length > 0; ) {
      const ce = Ee.current.shift(), Me = Cs(ce, Je);
      if (!Me) {
        G = !0;
        continue;
      }
      so(
        Me.requestedState,
        Me.selectedSegments,
        Me.selectedSegment
      );
      return;
    }
    G && $("The queued review could not find its segment after refreshing.");
  }, [R, Je]);
  const { toggleIncorrectExample: ui, removeIncorrectExample: mi, captureTrainingExport: gi, deleteRejectedSegments: lo, autoAssignPerformers: pi, previewDerivedSegments: fi, closeMaterializeDialog: yi, materializeDerivedSegments: bi, saveTag: hi, moveToBin: vi, emptyRecyclingBin: xi } = wd({
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
    mutateSegment: oi,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: qn,
    refreshMaterializationPreview: fr,
    removingExampleId: Pn,
    revealSegmentGroupForSelection: Xr,
    savingSegmentId: R,
    segments: Je,
    selectedSegment: ie,
    selectedSegmentIdRef: p,
    selectedSegments: st,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: f,
    setAutoAssignError: Ye,
    setAutoAssignOpen: Re,
    setAutoAssigning: it,
    setExportingExamples: mr,
    setIncorrectExamples: Kt,
    setMaterializeError: tn,
    setMaterializeLoading: At,
    setMaterializeOpen: dr,
    setMaterializePreview: bt,
    setMaterializing: ur,
    setRemovingExampleId: gr,
    setRejectedDeletionPreview: H,
    setSaveMessage: $,
    setSavingSegmentId: U,
    setSelectedSegmentGroupKey: Oe,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: y,
    video: _e
  }), { restoreHistoryTarget: Si, updateTimelineRatio: co, handleSeparatorPointerDown: ki, handleSeparatorPointerMove: wi, handleSeparatorKeyDown: Ni, panelWidthMaximum: uo, panelSeparatorProps: Ii, toggleSegmentRail: Ci, toggleSegmentGroup: mo, mutateShotBoundary: $i } = Nd({
    acceptHistory: kr,
    compatibilityMode: l,
    currentTime: M,
    detail: e,
    editorLayout: Q,
    focusRowRef: cn,
    history: te,
    historyRef: le,
    historySaving: C,
    horizontalLayoutSize: ke,
    mediaStackHeight: oe,
    mediaStackRef: dn,
    onDetailChange: t,
    onReload: o,
    railToggleRef: jn,
    recordHistoryAction: qn,
    savingSegmentId: R,
    savingShot: D,
    savingShotRef: Kn,
    setCollapsedSegmentGroups: Ce,
    setEditorLayout: de,
    setHistorySaving: x,
    setSaveMessage: $,
    setSavingSegmentId: U,
    setSavingShot: V,
    shotBoundaries: hn,
    timelineDuration: Hn,
    video: _e,
    workspaceRef: un
  }), { executeShortcutById: Ti } = Id({
    allSwimlanes: ze,
    applyShortcutTiming: si,
    centerTimelineRef: Fn,
    compatibilityMode: l,
    createSegment: to,
    currentTime: M,
    deleteRejectedSegments: lo,
    duplicateSegment: ro,
    editorLayout: Q,
    editorRef: tt,
    emptyRecyclingBin: xi,
    lineage: Sr,
    mediaDuration: Zr,
    mergeSelectedSwimlane: io,
    moveToBin: vi,
    mutateShotBoundary: $i,
    openPublishApprovedDialog: oo,
    playbackControlsRef: ln,
    playbackShortcutConfig: Xa,
    saveSelectedReviewState: so,
    seekRef: sn,
    segmentGroupKeys: xr,
    selectSegment: eo,
    selectedSegment: ie,
    selectedSegmentGroupForSegment: Wt,
    selectedSegmentGroupKey: ve,
    selectedSegments: st,
    setCollapsedSegmentGroups: Ce,
    setIncorrectExamplesOpen: je,
    setQuickSearchOpen: Pe,
    setSaveMessage: $,
    setSelectedSegmentGroupKey: Oe,
    setTagEditing: S,
    setTimelineZoom: B,
    shotBoundaries: hn,
    slotButtonRef: Bn,
    splitSegment: no,
    swimlanes: Qa,
    timelineDuration: Hn,
    toggleIncorrectExample: ui,
    toggleSegmentGroup: mo,
    updateTimelineRatio: co,
    videoFrameRate: yr,
    visibleSegments: ct
  });
  Dt.current = Ti;
  const Ri = Ge(() => Mn.map((G) => ({
    id: G.id,
    enabled: Qt(G, l),
    surface: "local",
    action: (ce) => {
      var Me;
      return (Me = Dt.current) == null ? void 0 : Me.call(Dt, G.id, ce);
    }
  })), [l]);
  na(Br, Ri);
  const Mi = Kr(oe), Ai = Pt(Q.markerRailWidth, uo("markerRailWidth")), Ei = Pt(Q.detailWidth, uo("detailWidth"));
  return n(xd, {
    activeFilterCount: Be,
    allSwimlanes: ze,
    analysisError: wt,
    analysisRun: Nt,
    analysisStatus: lr,
    approvalFacetCounts: Ht,
    autoAssignCandidates: Ct,
    autoAssignError: Qe,
    autoAssignOpen: Te,
    autoAssignPerformers: pi,
    autoAssigning: Ke,
    captureTrainingExport: gi,
    cancelQueuedReviewsForSegments: ci,
    removeIncorrectExample: mi,
    rejectedDeletionPreview: Se,
    centerTimelineRef: Fn,
    closeEditorFilters: xn,
    closeFirstSegmentTagDialog: br,
    closeMaterializeDialog: yi,
    closeMergeConfirmation: di,
    closePublishApprovedDialog: ao,
    closeTagEditing: vn,
    collapsedSegmentGroups: Ie,
    compatibilityMode: l,
    configuringTag: vt,
    createSegment: to,
    currentTime: M,
    deleteRejectedSegments: lo,
    detail: e,
    detailPanelRef: w,
    detailWidth: Ei,
    duplicateSegment: ro,
    editorFilters: v,
    editorLayout: Q,
    editorRef: tt,
    exportingExamples: on,
    filtersButtonRef: Ut,
    filtersOpen: W,
    firstSegmentTagOpen: k,
    focusRowRef: cn,
    handleSeparatorKeyDown: Ni,
    handleSeparatorPointerDown: ki,
    handleSeparatorPointerMove: wi,
    hideDerivedSegments: F,
    history: te,
    historyOpen: b,
    historySaving: C,
    horizontalLayoutSize: ke,
    importNativeSegments: En,
    incorrectExamples: Et,
    incorrectExamplesOpen: qe,
    removingExampleId: Pn,
    lineage: Sr,
    markerRailWidth: Ai,
    materializeButtonRef: Gt,
    materializeCancelButtonRef: On,
    materializeDerivedSegments: bi,
    materializeError: en,
    materializeLoading: Bt,
    materializeOpen: Mt,
    materializePreview: pt,
    materializing: ht,
    mediaStackRef: dn,
    mergeCancelButtonRef: ee,
    mergeConfirmation: ae,
    mergeSavingRef: ue,
    mergeSelectedSwimlane: io,
    nativeImportState: Xt,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: oo,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: Ii,
    pendingInitialSeekRef: Ln,
    performerSlots: Ue,
    performerSlotsAvailable: zn,
    playbackControlsRef: ln,
    previewDerivedSegments: fi,
    provenance: ei,
    provenanceSources: _,
    publishApprovedCancelButtonRef: be,
    publishApprovedDrafts: li,
    publishApprovedError: ne,
    publishApprovedOpen: Y,
    quickSearchOpen: we,
    railScrollRef: pn,
    railToggleRef: jn,
    recordHistoryAction: qn,
    restoreHistoryTarget: Si,
    saveMessage: I,
    setSaveMessage: $,
    saveTag: hi,
    saveTiming: ii,
    savingSegmentId: R,
    setSavingSegmentId: U,
    seekRef: sn,
    segmentGroups: ft,
    segmentRailLayout: Sn,
    segments: Je,
    selectAllVideoSegments: ri,
    selectSegment: eo,
    selectSegmentCollection: ni,
    selectedGroups: Qr,
    selectedPerformerSlots: Yr,
    selectedSegment: ie,
    selectedSegmentGroupKey: ve,
    selectedSegmentIds: u,
    selectedSegments: st,
    selectedSlotStatus: Ja,
    setAutoAssignError: Ye,
    setAutoAssignOpen: Re,
    setConfiguringTag: nn,
    setCurrentTime: E,
    setEditorFilters: N,
    setEditorLayout: de,
    setFiltersOpen: j,
    setHideDerivedSegments: T,
    setHistoryOpen: K,
    setIncorrectExamplesOpen: je,
    setQuickSearchOpen: Pe,
    setRejectedDeletionPreview: H,
    setRailViewport: yn,
    setSelectedSegmentGroupKey: Oe,
    setSelectedSegmentId: m,
    setShortcutsOpen: at,
    setTimelineZoom: B,
    shotBoundaries: hn,
    shortcutsOpen: De,
    slotButtonRef: Bn,
    splitLayout: a,
    splitSegment: no,
    startFullAnalysis: Dn,
    tagEditing: A,
    tagSearchRef: Gn,
    timelineDuration: Hn,
    timelineRatioBounds: Mi,
    timelineZoom: ge,
    toggleSegmentGroup: mo,
    toggleSegmentRail: Ci,
    updateTimelineRatio: co,
    video: _e,
    videoPerformers: bn,
    visibleCounts: hr,
    visibleSegmentRailRows: Ya,
    visibleSegments: ct,
    wideLayout: an,
    workspaceRef: un
  });
}
function Rd(e = [], t = []) {
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
function Md(e = [], t = "", r = "all") {
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
function Ad(e = [], t = []) {
  var y;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((p, h) => (p.sortOrder ?? 0) - (h.sortOrder ?? 0) || Number(p.id) - Number(h.id)).forEach((p, h) => {
    [...p.tags || []].sort((f, w) => (f.sortOrder ?? 0) - (w.sortOrder ?? 0) || Number(f.tagId) - Number(w.tagId)).forEach((f, w) => r.set(Number(f.tagId), {
      key: `group:${p.id}`,
      id: p.id,
      name: p.name,
      sortOrder: p.sortOrder ?? h,
      tagSortOrder: f.sortOrder ?? w
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(p, h) {
    const f = Number(p);
    if (!o.has(f)) {
      const w = r.get(f);
      o.set(f, {
        tagId: f,
        name: h || `Tag ${f}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (w == null ? void 0 : w.key) || "ungrouped",
        segmentGroupId: (w == null ? void 0 : w.id) ?? null,
        segmentGroupName: (w == null ? void 0 : w.name) || "Ungrouped",
        segmentGroupSortOrder: (w == null ? void 0 : w.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (w == null ? void 0 : w.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(f);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((p) => {
    const h = i(p.sourceTagId, p.sourceTagName), f = i(p.derivedTagId, p.derivedTagName);
    h.outgoingRuleCount++, f.incomingRuleCount++;
    const w = `${h.tagId}:${f.tagId}`;
    a.has(w) || a.set(w, {
      id: w,
      sourceTagId: h.tagId,
      derivedTagId: f.tagId,
      rules: [],
      edgeCount: 0
    });
    const v = a.get(w);
    v.rules.push(p), v.edgeCount += Number(p.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((p) => [p.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((p) => {
    var h, f;
    (h = d.get(p.sourceTagId)) == null || h.add(p.derivedTagId), (f = d.get(p.derivedTagId)) == null || f.add(p.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), g = [];
  for (const p of s) {
    if (c.has(p.tagId)) continue;
    const h = [p.tagId], f = [];
    for (c.add(p.tagId); h.length > 0; ) {
      const T = h.shift();
      f.push(T);
      for (const M of d.get(T) || [])
        c.has(M) || (c.add(M), h.push(M));
    }
    const w = new Set(f), v = f.map((T) => o.get(T)), N = l.filter((T) => w.has(T.sourceTagId) && w.has(T.derivedTagId)), W = N.flatMap((T) => T.rules), j = v.filter((T) => T.outgoingRuleCount === 0).sort((T, M) => Ze(T.name, M.name)), F = j.length > 0 ? j : [...v].sort((T, M) => Ze(T.name, M.name));
    g.push({
      id: [...f].sort((T, M) => T - M).join(":"),
      label: F.length > 1 ? `${F[0].name} + ${F.length - 1}` : ((y = F[0]) == null ? void 0 : y.name) || "Derivation component",
      nodes: v,
      connections: N,
      rules: W,
      segmentGroupKeys: [...new Set(v.map((T) => T.segmentGroupKey))],
      materializedEdgeCount: W.reduce(
        (T, M) => T + (Number(M.edgeCount) || 0),
        0
      )
    });
  }
  g.sort((p, h) => h.rules.length - p.rules.length || Ze(p.label, h.label));
  const m = /* @__PURE__ */ new Map();
  s.forEach((p) => {
    m.has(p.segmentGroupKey) || m.set(p.segmentGroupKey, {
      key: p.segmentGroupKey,
      id: p.segmentGroupId,
      name: p.segmentGroupName,
      sortOrder: p.segmentGroupSortOrder,
      nodes: [],
      ruleIds: /* @__PURE__ */ new Set(),
      componentIds: /* @__PURE__ */ new Set()
    }), m.get(p.segmentGroupKey).nodes.push(p);
  }), g.forEach((p) => {
    p.nodes.forEach((h) => {
      var f;
      return (f = m.get(h.segmentGroupKey)) == null ? void 0 : f.componentIds.add(p.id);
    }), p.rules.forEach((h) => {
      var f, w;
      (f = m.get(o.get(Number(h.sourceTagId)).segmentGroupKey)) == null || f.ruleIds.add(h.id), (w = m.get(o.get(Number(h.derivedTagId)).segmentGroupKey)) == null || w.ruleIds.add(h.id);
    });
  });
  const u = [...m.values()].sort((p, h) => p.sortOrder - h.sortOrder || Ze(p.name, h.name)).map((p) => ({
    ...p,
    ruleCount: p.ruleIds.size,
    componentCount: p.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: g,
    segmentGroups: u
  };
}
function Ed(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const g = new Map(e.nodes.map((E) => [E.tagId, /* @__PURE__ */ new Set()])), m = new Map(e.nodes.map((E) => [E.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((E) => {
    var R, U;
    (R = g.get(E.sourceTagId)) == null || R.add(E.derivedTagId), (U = m.get(E.derivedTagId)) == null || U.add(E.sourceTagId);
  });
  const u = new Map(e.nodes.map((E) => {
    var R;
    return [
      E.tagId,
      ((R = m.get(E.tagId)) == null ? void 0 : R.size) || 0
    ];
  })), y = new Map(e.nodes.map((E) => [E.tagId, 0])), p = e.nodes.filter((E) => u.get(E.tagId) === 0).sort((E, R) => Ze(E.name, R.name)).map((E) => E.tagId), h = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const E = p.shift();
    if (!h.has(E)) {
      h.add(E);
      for (const R of g.get(E) || [])
        y.set(R, Math.max(y.get(R) || 0, (y.get(E) || 0) + 1)), u.set(R, u.get(R) - 1), u.get(R) === 0 && p.push(R);
    }
  }
  h.size !== e.nodes.length && e.nodes.filter((E) => !h.has(E.tagId)).sort((E, R) => Ze(E.name, R.name)).forEach((E) => y.set(E.tagId, 0));
  const f = Math.max(0, ...y.values()), w = Math.max(
    t,
    240 + f * 296
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
  const N = [...v.values()].sort((E, R) => E.sortOrder - R.sortOrder || Ze(E.name, R.name));
  let W = 28;
  const j = [], F = N.map((E) => {
    const R = /* @__PURE__ */ new Map();
    E.nodes.forEach(($) => {
      const P = y.get($.tagId) || 0;
      R.has(P) || R.set(P, []), R.get(P).push($);
    });
    for (const $ of R.values())
      $.sort((P, J) => P.segmentGroupTagSortOrder - J.segmentGroupTagSortOrder || Ze(P.name, J.name));
    const U = Math.max(1, ...[...R.values()].map(($) => $.length)), D = U * 58 + (U - 1) * 18, V = 70 + D, I = {
      ...E,
      x: 12,
      y: W,
      width: w - 24,
      height: V
    };
    for (const [$, P] of R.entries()) {
      const J = P.length * 58 + Math.max(0, P.length - 1) * 18, se = (D - J) / 2;
      P.forEach((me, ge) => j.push({
        ...me,
        rank: $,
        x: 28 + $ * 296,
        y: W + 34 + 18 + se + ge * 76,
        width: 184,
        height: 58
      }));
    }
    return W += V + 16, I;
  }), T = new Map(j.map((E) => [E.tagId, E])), M = e.connections.map((E) => {
    const R = T.get(E.sourceTagId), U = T.get(E.derivedTagId), D = R.x + R.width, V = R.y + R.height / 2, I = U.x, $ = U.y + U.height / 2, P = Math.max(48, (I - D) * 0.48);
    return {
      ...E,
      path: `M ${D} ${V} C ${D + P} ${V}, ${I - P} ${$}, ${I} ${$}`
    };
  });
  return {
    width: w,
    height: Math.max(r, W - 16 + 28),
    nodes: j,
    connections: M,
    groups: F
  };
}
function Dd(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Ed(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), g = 20, m = o, u = c.nodes.map((p) => ({
      ...p,
      x: p.x + g,
      y: p.y + m
    })), y = new Map(u.map((p) => [p.tagId, p]));
    a.push(...u), l.push(...c.groups.map((p) => ({
      ...p,
      componentId: d.id,
      x: p.x + g,
      y: p.y + m
    }))), s.push(...c.connections.map((p) => {
      const h = y.get(p.sourceTagId), f = y.get(p.derivedTagId), w = h.x + h.width, v = h.y + h.height / 2, N = f.x, W = f.y + f.height / 2, j = Math.max(48, (N - w) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${w} ${v} C ${w + j} ${v}, ${N - j} ${W}, ${N} ${W}`
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
function Jo(e, t = []) {
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
function Od(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function Pd(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: m, emptyDraft: u, graph: y, layout: p, listSort: h, materializationOffer: f, materializeOutgoingRules: w, materializeRule: v, message: N, normalizedQuery: W, query: j, refreshConfiguredTag: F, revealEditor: T, rules: M, save: E, segmentGroupKey: R, selectedNode: U, selectedRule: D, selection: V, setConfiguringTag: I, setDraft: $, setListSort: P, setMaterializationOffer: J, setQuery: se, setSegmentGroupKey: me, setSelection: ge, setView: B, sortedVisibleRules: Q, sourceSlots: de, sourceSlotsLoading: oe, updateMapping: xe, updateTag: ke, view: z, visibleComponents: te, visibleRules: X } = e;
  function le(A) {
    const S = y.nodes.find((q) => q.tagId === Number(A.sourceTagId)), k = y.nodes.find((q) => q.tagId === Number(A.derivedTagId));
    return (S == null ? void 0 : S.segmentGroupKey) === (k == null ? void 0 : k.segmentGroupKey) ? S.segmentGroupKey : "cross-group";
  }
  function b() {
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
            n(In, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (A, S) => ke("source", A, S == null ? void 0 : S.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !oe && de.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (A) => I({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: A.currentTarget
              }),
              className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
            }, "Configure source tag")
          ]) : null
        ]),
        n("div", { key: "derived", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Derived tag (general)"),
            n(In, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (A, S) => ke("derived", A, S == null ? void 0 : S.label),
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
              onClick: (A) => I({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: A.currentTarget
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
            onClick: () => $((A) => ({
              ...A,
              slotMappings: [...A.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
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
          ...d.slotMappings.map((A, S) => n("div", { key: S, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: A.sourceSlotDefinitionId,
              disabled: r,
              onChange: (k) => xe(S, "sourceSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${S + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...de.map((k) => n("option", { key: k.id, value: k.id }, et(k)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: A.derivedSlotDefinitionId,
              disabled: r,
              onChange: (k) => xe(S, "derivedSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${S + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((k) => n("option", { key: k.id, value: k.id }, et(k)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => $((k) => ({
                ...k,
                slotMappings: k.slotMappings.filter((q, ue) => ue !== S)
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
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((A) => !A.sourceSlotDefinitionId || !A.derivedSlotDefinitionId),
          onClick: E,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => $(null), className: o }, "Cancel")
      ])
    ]);
  }
  function K() {
    if (U) {
      const k = X.filter((ae) => Number(ae.derivedTagId) === U.tagId), q = X.filter((ae) => Number(ae.sourceTagId) === U.tagId), ue = (ae, re, Se) => n("div", {
        key: ae.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, re),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${ae.sourceTagName} → ${ae.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          Se ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => v(ae),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => g(ae, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(ae),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, U.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, U.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${U.incomingRuleCount} incoming · ${U.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (ae) => I({
            tagId: U.tagId,
            tagName: U.name,
            trigger: ae.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        q.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => w(U, q),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${q.length})`) : null,
        q.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...q.map((ae) => ue(ae, "Derives", !0))
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
            k.map((ae) => ue(ae, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!D)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const A = y.nodes.find((k) => k.tagId === Number(D.sourceTagId)), S = y.nodes.find((k) => k.tagId === Number(D.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (A == null ? void 0 : A.segmentGroupName) || "Ungrouped"),
          (A == null ? void 0 : A.segmentGroupKey) !== (S == null ? void 0 : S.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(S == null ? void 0 : S.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${D.sourceTagName} → ${D.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${D.edgeCount} materialized lineage edge${D.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (f == null ? void 0 : f.ruleId) === D.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
        n(
          "p",
          { key: "summary", className: "text-sm font-medium text-foreground" },
          `${f.createCount + f.linkCount} pending derivation${f.createCount + f.linkCount === 1 ? "" : "s"}`
        ),
        n(
          "p",
          { key: "details", className: "text-xs text-secondary" },
          `${f.createCount} new segments · ${f.linkCount} existing segments to link`
        ),
        n("div", { key: "actions", className: "flex gap-2" }, [
          n("button", {
            key: "materialize",
            type: "button",
            disabled: r,
            onClick: () => v(D, f),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => J(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        D.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : D.slotMappings.map((k, q) => n("div", {
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
          D.createdAt ? new Date(D.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          D.updatedAt ? new Date(D.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => v(D),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(D),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(D),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function C() {
    if (te.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, W ? "No derivation relationships match your search." : "No derivation rules.");
    const A = U == null ? void 0 : U.tagId, S = /* @__PURE__ */ new Set();
    return U && (S.add(U.tagId), p.connections.forEach((k) => {
      (k.sourceTagId === U.tagId || k.derivedTagId === U.tagId) && (S.add(k.sourceTagId), S.add(k.derivedTagId));
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
        ...p.groups.map((k) => n("div", {
          key: `group:${k.componentId}:${k.key}`,
          className: `absolute rounded-xl border ${R === k.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
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
          ...p.connections.map((k) => {
            const q = A === k.sourceTagId || A === k.derivedTagId, ue = U != null, ae = q ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${k.id}:visible`,
              d: k.path,
              fill: "none",
              stroke: ae,
              strokeWidth: q ? 2.5 : 1.5,
              opacity: ue && !q ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((k) => {
          const q = !W || k.name.toLocaleLowerCase().includes(W), ue = U != null, ae = S.has(k.tagId), re = (U == null ? void 0 : U.tagId) === k.tagId;
          return n("button", {
            key: `node:${k.tagId}`,
            type: "button",
            onClick: () => ge({ type: "node", id: k.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${re ? "border-accent bg-accent/15 ring-2 ring-accent/25" : ae ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${k.x}px`,
              top: `${k.y}px`,
              width: `${k.width}px`,
              height: `${k.height}px`,
              opacity: !q || ue && !ae ? 0.62 : 1
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
        ...p.connections.filter((k) => k.rules.length > 1).map((k) => {
          const q = p.nodes.find((ae) => ae.tagId === k.sourceTagId), ue = p.nodes.find((ae) => ae.tagId === k.derivedTagId);
          return n("div", {
            key: `bundle:${k.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(q.x + q.width + ue.x) / 2 - 24}px`,
              top: `${(q.y + q.height / 2 + ue.y + ue.height / 2) / 2 - 10}px`
            },
            "aria-label": `${k.rules.length} rules connect ${k.rules[0].sourceTagName} to ${k.rules[0].derivedTagName}`
          }, `${k.rules.length} rules`);
        })
      ])
    ]);
  }
  function x() {
    if (te.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        W ? "No derivation relationships match your search." : "No derivation rules."
      );
    const A = /* @__PURE__ */ new Map();
    Q.forEach((k) => {
      const q = le(k);
      A.has(q) || A.set(q, []), A.get(q).push(k);
    });
    const S = [
      ...y.segmentGroups.map((k) => k.key),
      "cross-group"
    ].filter((k) => A.has(k));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, S.map((k) => {
      const q = y.segmentGroups.find((re) => re.key === k), ue = k === "cross-group" ? "Cross-group relationships" : (q == null ? void 0 : q.name) || "Ungrouped", ae = A.get(k);
      return n("section", { key: k, "aria-label": ue }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, ue),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${ae.length} rule${ae.length === 1 ? "" : "s"}`
          )
        ]),
        n("div", { key: "table", role: "table", "aria-label": `${ue} derivation rules` }, [
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
          ...ae.map((re) => n("button", {
            key: re.id,
            type: "button",
            role: "row",
            onClick: () => ge({ type: "rule", id: re.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(D == null ? void 0 : D.id) === re.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${re.sourceTagName} → ${re.derivedTagName}` },
              `${re.sourceTagName} → ${re.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(re.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(re.edgeCount))
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
          `${M.length} rules · ${y.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          $(u()), ge(null), T();
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
          value: j,
          onChange: (A) => {
            se(A.target.value), ge(null);
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
          value: R,
          disabled: d != null,
          onChange: (A) => {
            me(A.target.value), ge(null), $(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...y.segmentGroups.map((A) => n("option", { key: A.key, value: A.key }, A.name))
        ])
      ]),
      z === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: h,
          onChange: (A) => P(A.target.value),
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
        ].map(([A, S]) => n("button", {
          key: A,
          type: "button",
          onClick: () => {
            B(A), A === "graph" && (V == null ? void 0 : V.type) === "rule" && ge(null);
          },
          "aria-pressed": z === A,
          className: `rounded px-3 py-1.5 text-sm font-medium ${z === A ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
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
        z === "graph" ? C() : x()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? b() : K()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      N ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, N) : null
    ]),
    i ? n(Jr, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => F(i),
      onClose: () => {
        const A = i.trigger;
        I(null), requestAnimationFrame(() => {
          A != null && A.isConnected && A.focus();
        });
      }
    }) : null
  ]);
}
function Ld({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = L([]), [a, s] = L(null), [l, d] = L([]), [c, g] = L([]), [m, u] = L(!1), [y, p] = L(!1), [h, f] = L(!1), [w, v] = L(""), [N, W] = L(""), [j, F] = L("graph"), [T, M] = L("all"), [E, R] = L(null), [U, D] = L("relationship"), [V, I] = L(null), [$, P] = L(null), J = pe(null), se = pe(null), me = Ta().replace(/:/g, "");
  function ge() {
    requestAnimationFrame(() => {
      var H;
      return (H = J.current) == null ? void 0 : H.scrollIntoView({ block: "nearest" });
    });
  }
  async function B(H) {
    const ee = await Z("/derivation-rules", H ? { signal: H } : void 0);
    i(ee || []);
  }
  fe(() => {
    const H = new AbortController();
    return B(H.signal).catch((ee) => {
      ee.name !== "AbortError" && v(ee.message || "Unable to load derived segment rules.");
    }), () => H.abort();
  }, []), fe(() => {
    const H = new AbortController();
    return a != null && a.sourceTagId ? (u(!0), Z(`/slot-definitions/${a.sourceTagId}`, { signal: H.signal }).then((ee) => d(ee.definitions || [])).catch((ee) => {
      ee.name !== "AbortError" && d([]);
    }).finally(() => {
      H.signal.aborted || u(!1);
    })) : (d([]), u(!1)), a != null && a.derivedTagId ? (p(!0), Z(`/slot-definitions/${a.derivedTagId}`, { signal: H.signal }).then((ee) => g(ee.definitions || [])).catch((ee) => {
      ee.name !== "AbortError" && g([]);
    }).finally(() => {
      H.signal.aborted || p(!1);
    })) : (g([]), p(!1)), () => H.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), fe(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || m || y)
      return;
    const H = `${a.sourceTagId}:${a.derivedTagId}`;
    se.current !== H && (se.current = H, s((ee) => !ee || Number(ee.sourceTagId) !== Number(a.sourceTagId) || Number(ee.derivedTagId) !== Number(a.derivedTagId) ? ee : yl(ee, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    m,
    y
  ]);
  function Q(H, ee = !1) {
    ee || R({ type: "rule", id: H.id }), se.current = null, s({
      ruleId: H.id,
      sourceTagId: H.sourceTagId,
      sourceTagName: H.sourceTagName,
      derivedTagId: H.derivedTagId,
      derivedTagName: H.derivedTagName,
      slotMappings: H.slotMappings.map((Y) => ({
        sourceSlotDefinitionId: Y.sourceSlotDefinitionId,
        derivedSlotDefinitionId: Y.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), v(""), ge();
  }
  function de(H, ee, Y = "") {
    se.current = null, H === "source" ? (d([]), u(ee != null)) : (g([]), p(ee != null)), s((O) => ({
      ...O,
      [`${H}TagId`]: ee == null ? null : Number(ee),
      [`${H}TagName`]: Y || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function oe(H) {
    (a == null ? void 0 : a.ruleId) == null && (se.current = null);
    const ee = [B(), t == null ? void 0 : t()];
    return H.draftKind === "source" ? (u(!0), ee.push(Z(`/slot-definitions/${H.tagId}`).then((Y) => d(Y.definitions || [])).finally(() => u(!1)))) : H.draftKind === "derived" && (p(!0), ee.push(Z(`/slot-definitions/${H.tagId}`).then((Y) => g(Y.definitions || [])).finally(() => p(!1)))), Promise.all(ee);
  }
  function xe(H, ee, Y) {
    s((O) => ({
      ...O,
      slotMappings: O.slotMappings.map((ne, ye) => ye === H ? { ...ne, [ee]: Y } : ne)
    }));
  }
  async function ke() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const H = Jo(a, o);
    if (H) {
      v(H.message);
      return;
    }
    if (a.slotMappings.some((ee) => !ee.sourceSlotDefinitionId || !ee.derivedSlotDefinitionId)) {
      v("Complete or remove every performer slot mapping before saving.");
      return;
    }
    f(!0), v(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let ee = null;
      if (a.ruleId != null) {
        const O = await Z(
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
        ee = O.fingerprint;
      }
      v("Saving derived segment rule…");
      const Y = await Z("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: ee
        })
      });
      if (await B(), R(j === "graph" ? { type: "node", id: Number(Y.sourceTagId) } : { type: "rule", id: Y.id }), s(null), a.ruleId == null)
        try {
          const O = await Z(
            `/derivation-rules/${Y.id}/materialization/preview`,
            { method: "POST" }
          );
          I(
            O.createCount + O.linkCount > 0 ? O : null
          ), v(O.createCount + O.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          I(null), v("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        I(null), v("Derived segment rule saved. Previous materializations were removed.");
    } catch (ee) {
      v(ee.message || "Unable to save derived segment rule.");
    } finally {
      f(!1);
    }
  }
  async function z(H) {
    f(!0), v("Previewing rule deletion…");
    try {
      const ee = await Z(
        `/derivation-rules/${H.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${H.sourceTagName} → ${H.derivedTagName}?

Deleted segments: ${ee.deletedSegmentCount}
Removed lineage edges: ${ee.removedEdgeCount}
Shared derived segments retained: ${ee.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const Y = `derivation-rule-delete:${H.id}:${ee.fingerprint}`;
      await Z(`/derivation-rules/${H.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(Y),
          fingerprint: ee.fingerprint
        })
      }), Fe(Y), await B(), (a == null ? void 0 : a.ruleId) === H.id && s(null), (E == null ? void 0 : E.type) === "rule" && E.id === H.id && R(null), (V == null ? void 0 : V.ruleId) === H.id && I(null), v(`Rule deleted with ${ee.deletedSegmentCount} exclusively derived segment${ee.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (ee) {
      v(ee.message || "Unable to delete derived segment rule.");
    } finally {
      f(!1);
    }
  }
  async function te(H, ee = null) {
    const Y = ee || await Z(
      `/derivation-rules/${H.id}/materialization/preview`,
      { method: "POST" }
    );
    if (Y.createCount + Y.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const O = `derivation-rule-materialize:${H.id}:${Y.fingerprint}`, ne = await Z(`/derivation-rules/${H.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Le(O),
        fingerprint: Y.fingerprint
      })
    });
    return Fe(O), ne;
  }
  async function X(H, ee = null) {
    f(!0), v("Finding pending derivations…");
    try {
      const Y = await te(H, ee);
      if (I(null), await B(), Y.createdCount + Y.linkedCount === 0) {
        v("Every applicable derivation is already materialized.");
        return;
      }
      v(
        `${Y.createdCount} derived segment${Y.createdCount === 1 ? "" : "s"} created and ${Y.linkedCount} existing segment${Y.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (Y) {
      v(Y.message || "Unable to materialize pending derivations.");
    } finally {
      f(!1);
    }
  }
  async function le(H, ee) {
    if (ee.length === 0) return;
    f(!0), v(`Finding pending derivations from ${H.name}…`);
    let Y = 0, O = 0;
    try {
      for (const ne of ee) {
        const ye = await te(ne);
        Y += ye.createdCount, O += ye.linkedCount;
      }
      I(null), await B(), v(Y + O === 0 ? `Every outgoing derivation from ${H.name} is already materialized.` : `${Y} derived segment${Y === 1 ? "" : "s"} created and ${O} existing segment${O === 1 ? "" : "s"} linked from ${H.name}.`);
    } catch (ne) {
      await B().catch(() => {
      }), v(ne.message || `Unable to materialize derivations from ${H.name}.`);
    } finally {
      f(!1);
    }
  }
  const b = Jo(a, o), K = Ge(
    () => Ad(o, e),
    [o, e]
  ), C = N.trim().toLocaleLowerCase(), A = K.components.filter((H) => T === "all" || H.segmentGroupKeys.includes(T)).filter((H) => !C || H.nodes.some((ee) => ee.name.toLocaleLowerCase().includes(C))), S = A.flatMap((H) => H.rules), k = new Set(
    A.flatMap((H) => H.nodes.map((ee) => ee.tagId))
  ), q = Ge(
    () => Dd(A),
    [A]
  ), ue = j === "list" ? Od(
    E,
    S,
    C.length > 0
  ) : null, ae = (E == null ? void 0 : E.type) === "node" && K.nodes.find((H) => H.tagId === E.id && k.has(H.tagId)) || null, re = [...S].sort((H, ee) => U === "source" ? Ze(H.sourceTagName, ee.sourceTagName) || Ze(H.derivedTagName, ee.derivedTagName) : U === "target" ? Ze(H.derivedTagName, ee.derivedTagName) || Ze(H.sourceTagName, ee.sourceTagName) : U === "materialized" ? (Number(ee.edgeCount) || 0) - (Number(H.edgeCount) || 0) || Ze(H.sourceTagName, ee.sourceTagName) : Ze(
    `${H.sourceTagName} ${H.derivedTagName}`,
    `${ee.sourceTagName} ${ee.derivedTagName}`
  ));
  return n(Pd, {
    arrowMarkerId: me,
    busy: h,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: $,
    deleteRule: z,
    derivedSlots: c,
    derivedSlotsLoading: y,
    draft: a,
    draftIssue: b,
    editRule: Q,
    editorRef: J,
    emptyDraft: r,
    graph: K,
    layout: q,
    listSort: U,
    materializationOffer: V,
    materializeOutgoingRules: le,
    materializeRule: X,
    message: w,
    normalizedQuery: C,
    query: N,
    refreshConfiguredTag: oe,
    revealEditor: ge,
    rules: o,
    save: ke,
    segmentGroupKey: T,
    selectedNode: ae,
    selectedRule: ue,
    selection: E,
    setConfiguringTag: P,
    setDraft: s,
    setListSort: D,
    setMaterializationOffer: I,
    setQuery: W,
    setSegmentGroupKey: M,
    setSelection: R,
    setView: F,
    sortedVisibleRules: re,
    sourceSlots: l,
    sourceSlotsLoading: m,
    updateMapping: xe,
    updateTag: de,
    view: j,
    visibleComponents: A,
    visibleRules: S
  });
}
function Fd() {
  const [e, t] = L(ka), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => Ro({ ...l, [a]: s }));
  }
  function i() {
    t(Ro(Gr));
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
function jd({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = L([]), [a, s] = L(!1), [l, d] = L(!1), [c, g] = L(""), [m, u] = L(""), [y, p] = L("all"), [h, f] = L(() => /* @__PURE__ */ new Set()), [w, v] = L(null);
  fe(() => {
    if (!e || a) return;
    const I = new AbortController();
    return d(!0), g(""), Z("/slot-definitions", { signal: I.signal }).then(($) => {
      i($ || []), s(!0);
    }).catch(($) => {
      $.name !== "AbortError" && g($.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      I.signal.aborted || d(!1);
    }), () => I.abort();
  }, [e, a]);
  async function N() {
    d(!0), g("");
    try {
      const I = await Z("/slot-definitions");
      i(I || []), s(!0);
    } catch (I) {
      g(I.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function W() {
    const [I] = await Promise.all([
      Z("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(I || []), s(!0), g("");
  }
  function j() {
    const I = w == null ? void 0 : w.trigger;
    v(null), requestAnimationFrame(() => {
      I != null && I.isConnected && I.focus({ preventScroll: !0 });
    });
  }
  function F(I) {
    f(($) => {
      const P = new Set($);
      return P.has(I) ? P.delete(I) : P.add(I), P;
    });
  }
  const T = Ge(
    () => Rd(t, o),
    [t, o]
  ), M = Ge(
    () => Md(T, m, y),
    [T, m, y]
  ), E = T.flatMap((I) => I.tags), R = E.filter((I) => I.definitions.length > 0).length, U = E.length - R, D = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], V = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${E.length} tags · ${R} with slots · ${U} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: m,
          onChange: (I) => u(I.target.value),
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
          D.map(([I, $]) => n("button", {
            key: I,
            type: "button",
            onClick: () => p(I),
            "aria-pressed": y === I,
            className: `rounded px-3 py-1.5 text-xs font-medium ${y === I ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, $))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => f(/* @__PURE__ */ new Set()),
          className: V
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => f(new Set(T.map((I) => I.overviewKey))),
          className: V
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
        onClick: N,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && M.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, M.map((I) => {
      const $ = h.has(I.overviewKey), P = I.tags.filter((J) => J.definitions.length > 0).length;
      return n("article", {
        key: I.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => F(I.overviewKey),
          "aria-expanded": !$,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, $ ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, I.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${I.tags.length} tag${I.tags.length === 1 ? "" : "s"} · ${P} with slots`
          )
        ]),
        $ ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          I.tags.map((J) => n("li", {
            key: J.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: J.tagName }, J.tagName),
              J.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            J.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${J.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, J.definitions.map((se) => n("li", {
              key: se.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, et(se)),
              ...(se.genderHints || []).map((me) => n("span", {
                key: me,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, ar(me)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (se) => v({
                tagId: J.tagId,
                tagName: J.tagName,
                trigger: se.currentTarget
              }),
              "aria-label": `Edit performer slots for ${J.tagName}`,
              className: `${V} self-start`,
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
      onSaved: W,
      onClose: j
    }) : null
  ]);
}
function Bd({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = L("general"), [a, s] = L([]), [l, d] = L(!1), [c, g] = L(""), [m, u] = L(""), [y, p] = L(null), [h, f] = L(!0), [w, v] = L(!1), [N, W] = L(""), [j, F] = L(!0), [T, M] = L(ya), E = Ls(t), R = E.map(([$]) => $);
  fe(() => {
    R.includes(o) || i(R[0] || "general");
  }, [t.effectiveMode]);
  async function U($) {
    const P = await Z("/segment-groups", $ ? { signal: $ } : void 0);
    s(P || []);
  }
  fe(() => {
    const $ = new AbortController();
    return U($.signal).catch((P) => {
      P.name !== "AbortError" && g(P.message || "Unable to load tag groups.");
    }), () => $.abort();
  }, []), fe(() => {
    if (t.effectiveMode !== "full") {
      f(!1);
      return;
    }
    const $ = new AbortController();
    return W(""), f(!0), Promise.all([
      Z("/analysis/settings", { signal: $.signal }),
      Z("/analysis/status", { signal: $.signal })
    ]).then(([P, J]) => {
      F(!0), u((P == null ? void 0 : P.baseUrl) || ""), p(J);
    }).catch((P) => {
      if (P.name !== "AbortError") {
        if (P.status === 403) {
          F(!1), W("You do not have permission to manage the analysis service connection.");
          return;
        }
        W(P.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      $.signal.aborted || f(!1);
    }), () => $.abort();
  }, [t.effectiveMode]);
  async function D($) {
    if ($ !== t.requestedMode) {
      d(!0), g("");
      try {
        const P = await Z(
          `/preferences/transition?mode=${encodeURIComponent($)}`
        );
        let J = !1, se = null, me = null, ge = null, B = !1;
        if (t.requestedMode === "basic" && $ === "full") {
          if (!window.confirm(Bs(
            P.recyclingBinCount,
            P.protectedRecyclingBinCount
          )))
            return;
          B = !0, P.recyclingBinCount > 0 && (J = !0, ge = P.recyclingBinFingerprint, se = `mode-switch-empty-bin:${ge}`, me = Le(se));
        }
        let Q = !1;
        if (t.requestedMode === "full" && $ === "basic") {
          if (!window.confirm(js(
            P.extensionOwnedSegmentCount
          )))
            return;
          Q = !0;
        }
        const de = await Z("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: $,
            confirmHiddenExtensionOwnedSegments: Q,
            confirmBasicHistoryCleanup: B,
            emptyRecyclingBin: J,
            operationId: me,
            expectedRecyclingBinFingerprint: ge
          })
        });
        se && Fe(se), r == null || r(wa(de)), g("Workflow mode saved.");
      } catch (P) {
        g(P.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function V($) {
    $.preventDefault(), v(!0), W("");
    try {
      const P = await Z("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: m })
      });
      u((P == null ? void 0 : P.baseUrl) || "");
      const J = await Z("/analysis/status");
      p(J), W(P != null && P.baseUrl ? J != null && J.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(J == null ? void 0 : J.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (P) {
      W(P.message || "Unable to save analysis service settings.");
    } finally {
      v(!1);
    }
  }
  const I = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: ($) => _a($, e, I), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      E.map(([$, P]) => n("button", {
        key: $,
        type: "button",
        onClick: () => i($),
        "aria-current": o === $ ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === $ ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, P))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(Fd)
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
      n(od, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: D,
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
          checked: T,
          onChange: ($) => {
            const P = $.target.checked;
            ba(P), M(P);
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
      n("form", { key: "form", onSubmit: V, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
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
            disabled: h || w || !j,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: h || w || !j,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, w ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        N || (h ? "Loading analysis service settings…" : (y == null ? void 0 : y.configured) === !1 ? "Full Scan is not configured." : y != null && y.ready ? "Analysis service is ready." : (y == null ? void 0 : y.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    R.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(Ld, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => U()
      })
    ) : null,
    R.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(jd, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => U()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function Yo({ facets: e, values: t, disabled: r, onChange: o }) {
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
function Gd({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var g, m;
  const s = [...e.slots || []].sort((u, y) => u.sortOrder - y.sortOrder || String(u.slotDefinitionId).localeCompare(String(y.slotDefinitionId))), l = [...new Map(s.map((u) => [
    u.performerId,
    { id: u.performerId, name: u.performerName }
  ])).values()], d = s.map((u) => ({
    slotDefinitionId: u.slotDefinitionId,
    label: et(u),
    performer: { id: u.performerId, name: u.performerName }
  })), c = Ia(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: Oa(t)
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
function Kd({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(ta, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: Us(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: Ia(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Qo({ onNavigate: e, profile: t }) {
  const r = Ge(() => {
    const B = ra("ext:com.midnightrider.segment-studio:segments");
    return B ? {
      ...Nr,
      defaultFilter: { ...Nr.defaultFilter, ...B.findFilter || {} },
      defaultObjectFilter: B.objectFilter || {}
    } : Nr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = oa(r), [l, d] = L(null), [c, g] = L({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [m, u] = L(null), [y, p] = L(null), [h, f] = L(0), [w, v] = L(""), [N, W] = L(!0), [j, F] = L(""), T = pe(0), M = Ao(o, i), E = M.activityTagId, R = Yt(i.slots), U = Ge(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (B) => Object.keys(Yt(B)).length > 0,
    sanitize: (B) => Ir(E, Yt(B)),
    summarize: (B) => `${Object.keys(Yt(B)).length} assigned`,
    renderEditor: (B, Q) => E ? n(Yo, {
      facets: l,
      values: Yt(B),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (de, oe) => {
        const xe = { ...Yt(B) };
        oe ? xe[de] = Number(oe) : delete xe[de], Q(Ir(E, xe));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [E, l, c.performerSlotsAvailable]), D = JSON.stringify(M);
  fe(() => {
    if (d(null), !E) return;
    const B = new AbortController();
    return Z(`/browse/activities/${E}/facets`, { signal: B.signal }).then(d).catch((Q) => {
      Q.status === 403 ? d({ slots: [], restricted: !0 }) : Q.name !== "AbortError" && F(Q.message);
    }), () => B.abort();
  }, [E]), fe(() => {
    const B = ++T.current, Q = new AbortController();
    return W(!0), F(""), Z("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(M), signal: Q.signal }).then((de) => {
      B === T.current && g({ ...de, totalCount: de.totalCount ?? de.total ?? 0 });
    }).catch((de) => {
      if (!(B !== T.current || de.name === "AbortError")) {
        if (de.status === 400 && de.message.includes("unrestricted performer read access")) {
          g((oe) => ({ ...oe, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), F("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        F(de.message);
      }
    }).finally(() => {
      B === T.current && W(!1);
    }), () => {
      T.current++, Q.abort();
    };
  }, [D, h]);
  const V = c.items.findIndex((B) => B.key === m), I = c.items[V] || null;
  function $(B) {
    s(B), a({ ...o, page: 1 });
  }
  function P(B) {
    const Q = Ao(o, B), de = B.slots && Q.activityTagId != null && Q.slotAssignments.length > 0 ? B.slots : void 0;
    $({ ...B, slots: de });
  }
  function J(B, Q) {
    const de = { ...R };
    Q ? de[B] = Number(Q) : delete de[B], $({ ...i, slots: Ir(E, de) });
  }
  function se() {
    const B = document.querySelector(`[data-segment-key="${m}"]`);
    u(null), requestAnimationFrame(() => B == null ? void 0 : B.focus());
  }
  async function me(B) {
    var oe;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(B.key), v("");
    const Q = `browse-restore:${B.itemId}:${B.revision}`, de = Le(Q);
    try {
      const xe = (ke = !1) => Z(`/bin/${B.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: de,
          expectedRevision: B.revision,
          discardMissingImage: ke
        })
      });
      try {
        await xe(_r(Q));
      } catch (ke) {
        if (((oe = ke.payload) == null ? void 0 : oe.code) !== "missing-image" || !window.confirm(`${ke.message}

Continue and discard the missing image reference?`))
          throw ke;
        Hr(Q), await xe(!0);
      }
      Fe(Q), m === B.key && u(null), v("Segment restored to Cove."), f((ke) => ke + 1);
    } catch (xe) {
      v(xe.message || "Unable to restore the segment."), xe.status === 409 && f((ke) => ke + 1);
    } finally {
      p(null);
    }
  }
  async function ge(B) {
    p(B.key), v("");
    try {
      const Q = await Z(`/items/${B.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: B.revision })
      });
      if (!Ma(Q, v) || !el(Q))
        return;
      const de = `browse-dependency-delete:${B.itemId}:${Q.fingerprint}`;
      await Z(`/items/${B.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(de),
          fingerprint: Q.fingerprint
        })
      }), Fe(de), m === B.key && u(null), v(`${Q.deletedSegmentCount} segment${Q.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), f((oe) => oe + 1);
    } catch (Q) {
      v(Q.message || "Unable to permanently delete the segment."), Q.status === 409 && f((de) => de + 1);
    } finally {
      p(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(Vr, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(aa, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: a,
      totalCount: c.totalCount,
      isLoading: N,
      error: j ? new Error(j) : null,
      onRetry: () => f((B) => B + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? Mo.filter((B) => B.id !== "performers") : Mo,
      objectFilter: i,
      onObjectFilterChange: P,
      customFilterSections: U,
      searchPlaceholder: "Search segments..."
    }, [
      E ? n(Yo, { key: "slots", facets: l, values: R, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: J }) : null,
      n(Kd, { key: "player", item: I, index: V, count: c.items.length, onPrevious: () => {
        var B;
        return u((B = c.items[V - 1]) == null ? void 0 : B.key);
      }, onNext: () => {
        var B;
        return u((B = c.items[V + 1]) == null ? void 0 : B.key);
      }, onClose: se, onNavigate: e }),
      w ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, w) : null,
      !N && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      N ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((B) => n(Gd, {
        key: B.key,
        item: B,
        selected: B.key === m,
        busy: y === B.key,
        onSelect: () => u(B.key),
        onRestore: me,
        onPurge: ge
      })))
    ])
  ]);
}
function Ud({ onNavigate: e, profile: t }) {
  const [r, o] = L([]), [i, a] = L(""), [s, l] = L(0), [d, c] = L(!0), [g, m] = L(null), [u, y] = L(""), p = pe(null);
  async function h(v) {
    const N = await Z("/bin", v ? { signal: v } : void 0);
    return o(N.items || []), a(N.fingerprint || ""), l(Number(N.totalCount) || 0), N;
  }
  fe(() => {
    const v = new AbortController();
    return c(!0), h(v.signal).catch((N) => {
      N.name !== "AbortError" && y(N.message);
    }).finally(() => {
      v.signal.aborted || c(!1);
    }), () => v.abort();
  }, []), na(Br, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var v;
      return (v = p.current) == null ? void 0 : v.call(p);
    }
  }]);
  async function f(v) {
    var j;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    m(v.itemId), y("");
    const N = `restore:${v.itemId}:${v.revision}`, W = Le(N);
    try {
      const F = (T = !1) => Z(`/bin/${v.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: W, expectedRevision: v.revision, discardMissingImage: T })
      });
      try {
        await F(_r(N));
      } catch (T) {
        if (((j = T.payload) == null ? void 0 : j.code) !== "missing-image" || !window.confirm(`${T.message}

Continue and discard the missing image reference?`)) throw T;
        Hr(N), await F(!0);
      }
      Fe(N), await h(), Nn(), y("Segment restored with a new native ID.");
    } catch (F) {
      y(F.message || "Unable to restore the segment."), F.status === 409 && await h();
    } finally {
      m(null);
    }
  }
  async function w() {
    if (g == null)
      try {
        const v = await Ea({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          m(-1), y("");
        });
        if (v.status !== "emptied") return;
        await h(), Nn(), y(`${v.segmentCount} segment${v.segmentCount === 1 ? "" : "s"} from ${v.sceneCount} scene${v.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (v) {
        y(v.message || "Unable to empty the recycling bin."), v.status === 409 && await h();
      } finally {
        m(null);
      }
  }
  return p.current = w, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
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
      n("button", { key: "restore", type: "button", disabled: g != null, onClick: () => f(v), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const Zo = "ext:com.midnightrider.segment-studio:videos";
function Tr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = Ge(() => {
    var D;
    const R = ra(Zo), U = (D = R == null ? void 0 : R.uiOptions) == null ? void 0 : D.displayMode;
    return R ? {
      ...kn,
      defaultFilter: { ...kn.defaultFilter, ...R.findFilter || {} },
      defaultObjectFilter: R.objectFilter || {},
      defaultDisplayMode: kn.allowedDisplayModes.includes(U) ? U : kn.defaultDisplayMode
    } : kn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = oa(i), [m, u] = L({ items: [], totalCount: 0 }), [y, p] = L(!0), [h, f] = L(""), [w, v] = L(0), N = pe(0), W = JSON.stringify(a), j = JSON.stringify(s), F = t || r === "review";
  fe(() => {
    const R = ++N.current, U = new AbortController();
    return p(!0), f(""), Z(`/videos?${ed(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: U.signal }).then((D) => {
      R === N.current && u(D);
    }).catch((D) => {
      R === N.current && D.name !== "AbortError" && f(D.message || "Unable to discover videos.");
    }).finally(() => {
      R === N.current && p(!1);
    }), () => {
      N.current++, U.abort();
    };
  }, [W, j, t, r, w]);
  function T(R) {
    d({ ...R, page: R.page || 1 });
  }
  function M(R) {
    c(R), d({ ...a, page: 1 });
  }
  const E = t || r === "review" ? qo : qo.filter((R) => !["reviewState", "shotBoundaries"].includes(R.id));
  return n("div", { className: "w-full space-y-5" }, [
    n(Vr, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(aa, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: Zo,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: T,
      totalCount: m.totalCount,
      isLoading: y,
      error: h ? new Error(h) : null,
      onRetry: () => v((R) => R + 1),
      sortOptions: t || r === "review" ? [...Ho, { value: "unreviewed_count", label: "Unreviewed count" }] : Ho,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: E,
      objectFilter: s,
      onObjectFilterChange: M,
      searchPlaceholder: "Search Segment Studio videos..."
    }, [
      !y && m.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !y && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, m.items.map((R) => n(td, { key: R.videoId, item: R, onNavigate: e, showReviewStates: F }))) : null,
      !y && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, m.items.map((R) => n(nd, { key: R.videoId, item: R, onNavigate: e, showReviewStates: F }))) : null
    ])
  ]);
}
function Xo({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = L(null), [s, l] = L(!0), [d, c] = L(""), g = pe(0), m = pe(0), u = pe(e), y = Gl();
  u.current = e;
  const p = (N) => `/videos/${N}/editor`;
  async function h(N, W, j) {
    const F = await Z(p(W), j ? { signal: j.signal } : void 0);
    return Ot(N, j ? g.current : m.current, W, u.current) ? (a(F), !0) : !1;
  }
  fe(() => {
    const N = ++g.current, W = e, j = new AbortController();
    return a(null), l(!0), c(""), h(N, W, j).catch((F) => {
      Ot(N, g.current, W, u.current) && F.name !== "AbortError" && c(F.message || "Unable to load the editor.");
    }).finally(() => {
      Ot(N, g.current, W, u.current) && l(!1);
    }), () => {
      g.current++, m.current++, j.abort();
    };
  }, [e]);
  function f(N, W) {
    a((j) => (j == null ? void 0 : j.video.id) !== W ? j : typeof N == "function" ? N(j) : N);
  }
  async function w() {
    const N = e, W = ++m.current;
    try {
      const j = await Z(p(N));
      return Ot(W, m.current, N, u.current) ? (a(j), c("A newer canonical segment was loaded. Your stale change was not applied."), j) : null;
    } catch (j) {
      return Ot(W, m.current, N, u.current) && c(j.message || "Unable to reload the latest segment."), null;
    }
  }
  async function v() {
    const N = e, W = ++m.current;
    try {
      const j = await Z(p(N));
      return Ot(W, m.current, N, u.current) ? (a(j), c(""), j) : null;
    } catch (j) {
      return Ot(W, m.current, N, u.current) && c(j.message || "Unable to reload performer slots."), null;
    }
  }
  return n("div", {
    className: `mx-auto flex w-full flex-col gap-2 ${y ? "lg:overflow-hidden" : "p-3 sm:p-4"}`,
    style: y ? {
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
      n(Fi, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(Td, {
      key: i.video.id,
      detail: i,
      onDetailChange: f,
      onConflict: w,
      onReload: v,
      onSlotsChanged: v,
      splitLayout: y,
      profile: o,
      initialSegmentId: Do() ? -Do() : zs(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function zd(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function _d(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function Hd(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function qd({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = Os(o), l = zd(e, t, window.location.pathname), d = _d(e, t, window.location.pathname), c = Hd(e, t, window.location.pathname), g = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (Fs(g, o) === "videos" && g !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Tr, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(Bd, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(Qo, { onNavigate: r, profile: o });
    const y = Number(e);
    return Number.isInteger(y) && y > 0 ? n(Xo, {
      videoId: y,
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
  if (c) return n(Ud, { onNavigate: r, profile: o });
  const u = Number(e);
  return d ? n(Qo, { onNavigate: r, profile: o }) : Number.isInteger(u) && u > 0 ? n(Xo, {
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
function Wd({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = L(null), [a, s] = L("");
  return fe(() => {
    const l = new AbortController();
    return Z("/preferences", { signal: l.signal }).then((d) => i(wa(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(qd, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function Vd(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function Jd(e, t) {
  const r = Vd(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const fc = {
  components: { SegmentStudioPage: Wd },
  actionHandlers: { openSegmentStudio: Jd }
};
export {
  er as CLEARED_SEGMENT_SELECTION_ID,
  Ho as DISCOVERY_SORT_OPTIONS,
  kt as SEGMENT_STUDIO_CAPABILITIES,
  Br as SEGMENT_STUDIO_EXTENSION_ID,
  Mn as SEGMENT_STUDIO_SHORTCUTS,
  rs as activeEditorFilterCount,
  yl as applyDerivationRuleSlotSuggestions,
  Go as applyFeedbackEditorDelta,
  jo as applySegmentMergeDelta,
  rl as basicSegmentTimelineStyle,
  Us as browseClipEnd,
  Ia as browseEditorHref,
  Ao as buildBrowseRequest,
  Ad as buildDerivationRuleGraph,
  ed as buildDiscoverySearchParams,
  Ui as buildMinuteTimelineTicks,
  Rd as buildPerformerSlotOverview,
  Vs as buildSegmentQuickSearchEntries,
  Sl as buildSegmentRailRows,
  kl as buildTimelineRows,
  tc as buildTimelineTicks,
  qi as calculateCenteredTimelineScroll,
  Mr as calculateEditorPanelMaximum,
  zi as calculateMinuteLabelStride,
  nc as calculateMinuteTimelineWidth,
  Ji as calculateSwimlaneTitleMaximum,
  Wi as calculateTimelinePlayheadPosition,
  Kr as calculateTimelineRatioBounds,
  Qi as calculateTimelineRatioFromPointer,
  rc as calculateVerticalRevealOffset,
  Pt as clampEditorPanelWidth,
  Qn as clampSwimlaneTitleWidth,
  fa as clampTimelineRatio,
  Ur as clampTimelineRatioForHeight,
  Xn as clampTimelineZoom,
  Yl as compactProvenanceSummary,
  Is as createQueuedReviewRequest,
  fc as default,
  Xs as downloadFileNameFromContentDisposition,
  os as dualRangeValueFromPointer,
  $o as duplicateIdentityFromResponse,
  Rs as duplicateOperationKey,
  ns as editorVisibilityIncludingSegment,
  Il as expandedSwimlanes,
  js as extensionOwnedSegmentsModeSwitchPrompt,
  Ml as feedbackFrameTimestamps,
  El as feedbackResultMatchesAction,
  Al as feedbackSelectionPlan,
  ts as filterDerivedSegments,
  wr as filterEditorSegments,
  Md as filterPerformerSlotOverview,
  Ws as filterSegmentQuickSearch,
  lc as filterSegmentStudioShortcuts,
  Tl as findAdjacentSegmentGroupKey,
  Es as findAdjacentShot,
  ks as findEditorShortcut,
  ga as findInitialSegmentSelection,
  Ki as findNearestSegmentInCurrentSwimlane,
  As as findPublishedSelectionIdentity,
  He as findSegmentByStableIdentity,
  Zi as findSegmentFromPlayhead,
  Gi as findSegmentNearPlayhead,
  $l as findSwimlaneRangeSelection,
  Pr as findSwimlaneSelection,
  Hs as findUniquePerformerSlotAssignment,
  pa as findUnreviewedSelection,
  ar as formatGenderHint,
  Ds as frameStepSeconds,
  Ca as generatePerformerSlotAssignmentRecommendations,
  ud as groupApprovedDraftsForPublishing,
  qs as groupAutoAssignCandidates,
  Dl as groupIncorrectExamplesByTag,
  yd as groupMaterializationOutputs,
  Lt as groupSegmentsIntoSwimlanes,
  wl as groupSelectedSwimlanes,
  Wr as groupSwimlanesBySegmentGroup,
  ot as handleModalKey,
  Zt as hasSegmentStudioCapability,
  Ko as hideCollectedFeedbackSegments,
  ul as historyActionsForTarget,
  ja as indexPerformerSlotsBySegment,
  cc as initialReviewFilter,
  Ll as insertSegmentProjection,
  Ot as isCurrentEditorRequest,
  ll as isEditableTarget,
  mc as isEditorShortcutOwner,
  Hd as isSegmentStudioBinRoute,
  _d as isSegmentStudioSegmentsRoute,
  zd as isSegmentStudioSettingsRoute,
  Ed as layoutDerivationRuleComponent,
  Dd as layoutDerivationRuleComponents,
  Fl as mergeSegmentsProjection,
  pl as multiSelectionActionHint,
  ms as nextSegmentAfterRemoval,
  gs as nextUnreviewedAfterRemoval,
  Rt as normalizeCollapsedSegmentGroups,
  Vo as normalizeDiscoveryIds,
  dt as normalizeEditorSegmentFilters,
  $t as normalizeGender,
  To as normalizeReviewFilter,
  wa as normalizeSegmentStudioFeatureProfile,
  dc as normalizeSegmentStudioMode,
  Dr as normalizeSegmentStudioPublicMode,
  Yt as parseBrowseSlotFilters,
  Yi as parseEditorLayout,
  Xi as parseHideDerivedSegmentsPreference,
  es as parseMergeConfirmationPreference,
  Sa as parsePlaybackShortcutConfig,
  xs as parseShortcutBindingOverrides,
  $r as patchPerformerSlotProjection,
  rr as patchSegmentProjection,
  ps as percentageSeekTime,
  _s as performInitialSegmentSeek,
  Ve as performerOptionId,
  tr as performerSlotHistoryState,
  et as performerSlotLabel,
  bl as performerSlotPresentation,
  pc as performerSlotStatus,
  qr as performerSlotStatusFromSegmentSlots,
  Fa as performerSlotsForSegment,
  gt as provenanceSourceLabel,
  $a as rankPerformerOptions,
  Rl as reconcileSegmentGroupKey,
  cs as reconcileSelectedSegmentIds,
  rd as recyclingBinActionText,
  tl as recyclingBinDeletionPrompt,
  Aa as recyclingBinDeletionSummary,
  Bs as recyclingBinModeSwitchPrompt,
  Ts as removeQueuedReviewsForSegments,
  Lr as removeSegmentsProjection,
  Do as requestedOwnedItemId,
  zs as requestedSegmentId,
  is as resolveEditorSegmentSelection,
  Cs as resolveQueuedReviewRequest,
  Ms as resolveSegmentCreationAction,
  Fs as resolveSegmentStudioRoute,
  Ss as resolveSegmentStudioShortcuts,
  Od as resolveSelectedDerivationRule,
  fs as resolveSelectedSegments,
  $d as restorePublishApprovedFocus,
  Rn as restoreSegmentFieldsProjection,
  za as restoreSegmentsProjection,
  Ua as revealCollapsedSegmentGroup,
  Da as segmentBadgeStyle,
  or as segmentGroupHeaderBackground,
  ut as segmentGroupKeyForSegment,
  La as segmentHistoryIdentity,
  Vn as segmentHistoryState,
  Oa as segmentRailItemStyle,
  uc as segmentStateStyle,
  Vd as segmentStudioActionTarget,
  Os as segmentStudioLegacyMode,
  nl as segmentTimelineStyle,
  lt as segmentsHistoryState,
  us as selectAllVideoSegmentIds,
  Gs as selectedBrowseStates,
  Ga as selectedSwimlaneMerge,
  _a as setBackLinkNavigation,
  ml as sharedPerformerSlotShape,
  gl as sharedTagPerformerSlotShape,
  Qt as shortcutAvailableInMode,
  ws as shortcutBindingDisplayText,
  oc as shortcutBindingFromEvent,
  ic as shortcutBindingsOverlap,
  sc as shortcutModesOverlap,
  vs as shortcutRequiresSingleSegment,
  Zn as shotBoundaryFingerprint,
  cl as shouldAcceptCurrentTagFromEnter,
  ac as shouldExitShortcutCapture,
  gc as shouldHandleEditorShortcut,
  _o as shouldReloadAfterSegmentMutation,
  Er as shouldRestoreTransitionSelection,
  Js as shouldShowQuickSearchGroups,
  Io as splitShortcutCategoriesIntoColumns,
  fl as suggestDerivationRuleSlotMappings,
  $n as swimlaneDisplayLabel,
  sl as swimlaneMarkerTop,
  al as swimlaneStripeBackground,
  Vi as timelineContentStyle,
  ko as timelinePlayheadHorizontalStyle,
  ol as timelineSegmentWidth,
  _i as timelineTickAlignment,
  Hi as timelineTickPosition,
  Rr as timelineTimePercent,
  Cl as toggleAllCollapsedSegmentGroups,
  Ns as toggledSelectionReviewState,
  yt as trapModalFocus,
  Ys as tryParseJsonResponseText,
  ds as updateAnchoredSegmentSelection,
  as as updateDualRangeValues,
  ss as updateSegmentCollectionSelection,
  ls as updateSegmentRangeSelection,
  ha as updateSegmentSelection,
  Jo as validateDerivationRuleDraft,
  So as validateSegmentTiming,
  zr as videoPerformerOptions,
  Cr as videoPerformerSlotAssignments,
  Ls as visibleSegmentStudioSettingsTabs,
  Ps as visibleSegmentStudioTabs,
  Ba as visibleVirtualRows
};
