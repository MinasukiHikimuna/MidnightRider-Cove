import Or from "@cove/runtime/react";
import { createPortal as Ai } from "@cove/runtime/react-dom";
import { extensionFetch as Yo } from "@cove/runtime/api";
import { formatDuration as Ri, EntityReferenceSelector as In, useExtensionKeyboardBindings as Ei, VideoPlayer as Zo, useRegisterExtensionKeyboardActions as Qo, getDefaultFilter as Xo, useListUrlState as ea, ListPage as ta } from "@cove/runtime/components";
import { ChevronDown as Di, Loader2 as Oi } from "@cove/runtime/lucide-react";
const Pr = "com.midnightrider.segment-studio", na = "segment-studio.layout.v1", Bt = "segment-studio.operations.v1", ra = "segment-studio.collapsed-segment-groups.v1", oa = "segment-studio.playback-shortcuts.v1", aa = "segment-studio.timing-clipboard.v1", ia = "segment-studio.hide-derived-segments.v1", sa = "segment-studio.merge-confirmation.v1", Xe = ["unreviewed", "approved", "rejected"], Pi = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], po = "(min-width: 1024px) and (min-height: 640px)", fo = "(min-width: 1024px) and (min-height: 900px)", Cn = 1e-3, yo = 15, Li = 30, la = 12, nt = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, Lr = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30
}, wt = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function bo(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function da(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? ca(e, null, 1, !0) ?? r[0] ?? null;
}
function ca(e, t, r, o = !1) {
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
function Fi(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((g, m) => g.markers.filter(({ segment: u }) => {
    const y = Number(u.startSec), p = u.endSec == null ? y + Li : Number(u.endSec);
    return Number.isFinite(y) && Number.isFinite(p) && p >= y && y <= i + yo + Cn && p >= i - yo - Cn;
  }).map(({ segment: u }) => ({ segment: u, laneIndex: m }))).sort((g, m) => g.laneIndex - m.laneIndex || Math.abs(g.segment.startSec - i) - Math.abs(m.segment.startSec - i) || g.segment.id - m.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((g) => g.markers.some((m) => m.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((g) => g.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((g) => g.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((g) => g.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function ji(e, t, r) {
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
function Zn(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function Vd(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function Bi(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function Jd(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function Gi(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function Ki(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Ui(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function zi(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Ir(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function _i(e, t, r = 10) {
  const o = Ir(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function ho(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function Hi(e, t = la) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function ua(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : nt.timelineRatio;
}
function Cr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function Ft(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? nt.detailWidth : Math.min(Cr(t, 0), Math.max(240, e));
}
function Jn(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? nt.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function qi(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function Fr(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: nt.timelineRatio, maximum: nt.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function jr(e, t) {
  const r = ua(e);
  if (!(t > 0)) return r;
  const o = Fr(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function Wi(e) {
  if (!e) return { ...nt };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? ua(r) : nt.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: Ft(t == null ? void 0 : t.detailWidth),
      markerRailWidth: Ft(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: Jn(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...nt };
  }
}
function Vi(e, t, r) {
  return r > 0 ? jr((t + r - e) / r, r) : nt.timelineRatio;
}
function Yd(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function Ji(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, g) => c.startSec - g.startSec || c.id - g.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= Cn ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function Lt(e, t, r, o) {
  return e === t && r === o;
}
const Qn = "__segment-studio-cleared-selection__";
function Yi(e) {
  return e === "true";
}
function Zi(e) {
  return e !== "false";
}
function ma() {
  try {
    return Zi(window.localStorage.getItem(sa));
  } catch {
    return !0;
  }
}
function ga(e) {
  try {
    window.localStorage.setItem(sa, String(!!e));
  } catch {
  }
}
function Qi(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function ut(e = {}) {
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
function xr(e, t, r, o = !1, i = []) {
  var c, g;
  const a = ut(r), s = a.performerId == null ? null : new Set((t || []).filter((m) => Number(m.performerId) === a.performerId).map((m) => m.segmentId)), l = new Set((i || []).flatMap((m) => m.tags || []).map((m) => Number(m.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((g = (c = (i || []).find((m) => Number(m.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : g.map((m) => Number(m.tagId))) || []);
  return Qi(e || [], o).filter((m) => {
    if (m.reviewState != null && !a.reviewStates.includes(m.reviewState) || s && !s.has(m.id) || a.tagId != null && Number(m.tagId) !== a.tagId || d && !d.has(Number(m.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(m.tagId)) || a.sourceKey != null && m.sourceKey !== a.sourceKey) return !1;
    const u = Number(m.confidence);
    return m.confidence == null || !Number.isFinite(u) ? a.includeUnscored : u >= a.confidenceMin && u <= a.confidenceMax;
  });
}
function Xi(e, t, r, o = !1, i = []) {
  var l;
  const a = ut(r);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = ut({
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
    filters: ut(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function es(e, t = !1) {
  const r = ut(e);
  return +(r.reviewStates.length !== Xe.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function ts(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function ns(e, t, r, o) {
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
function rs(e, t, r = null) {
  return t === Qn ? null : da(
    e,
    t ?? r
  );
}
function pa(e, t, r, o = !1) {
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
function os(e, t, r) {
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
function as(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return pa(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function is(e, t, r = null, o = !1) {
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
      ...as(m, s, t, g, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: m
    };
  }
  const d = pa(i, a, t, o);
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
function ss(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function ls(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function vo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function xo(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => vo(t, o) - vo(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function ds(e, t, r) {
  var c, g;
  const o = e || [], i = new Set(t || []), a = o.findIndex((m) => (m.markers || []).some(({ segment: u }) => u.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: m }) => m.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const m of o) {
      const u = (m.markers || []).find(({ segment: y }) => !i.has(y.id));
      if (u) return u.segment;
    }
    return null;
  }
  const l = xo(
    o[a].markers,
    s,
    i
  );
  if (l) return l;
  const d = (g = o.map((m, u) => ({ lane: m, index: u })).filter(({ lane: m }) => (m.markers || []).some(({ segment: u }) => !i.has(u.id))).sort((m, u) => Math.abs(m.index - a) - Math.abs(u.index - a) || +(m.index < a) - +(u.index < a) || m.index - u.index)[0]) == null ? void 0 : g.lane;
  return xo(d == null ? void 0 : d.markers, s, i);
}
function cs(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function us(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function ms(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function gs() {
  try {
    return Yi(window.localStorage.getItem(ia));
  } catch {
    return !1;
  }
}
function ps(e) {
  try {
    window.localStorage.setItem(ia, String(!!e));
  } catch {
  }
}
const An = [
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
], fs = /* @__PURE__ */ new Set([
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
function ys(e) {
  return fs.has(e);
}
function fa(e) {
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
function bs(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(An.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(fa).filter(Boolean)]));
  } catch {
    return {};
  }
}
function hs(e = {}) {
  const t = bs(e);
  return An.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function So(e, t = 2) {
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
function Zd(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : fa({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function Qd(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function $r(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function ko(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function Xd(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = ko(e.code, t.key), a = ko(t.code, e.key);
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
          if ($r(u, e) && $r(u, t)) return !0;
        }
  return !1;
}
function on(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function ec(e, t) {
  return [!1, !0].some((r) => on(e, r) && on(t, r));
}
function vs(e, t = !1, r = {}) {
  return hs(r).find((o) => on(o, t) && o.bindings.some((i) => $r(e, i))) || null;
}
function ya(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function xs(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(ya).join(" / ") : "Unassigned";
}
function tc(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, xs(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function nc(e) {
  return e === "review" ? "review" : "editor";
}
function He(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function Ss(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function wo(e, t) {
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
function ks(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function ws(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function Tr(e, t) {
  return e === t;
}
function Ns(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function Is(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - Cn).at(-1) || null : o.find((i) => i.startSec > t + Cn) || null;
}
function Yn(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function No(e) {
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
function rc(e, t = null, r = !1) {
  const o = No(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function nn(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function ba(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: nn(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: nn(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: nn(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(nn(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(nn(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(nn(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...Lr };
  }
}
function Cs(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function ha() {
  try {
    return ba(window.localStorage.getItem(oa));
  } catch {
    return { ...Lr };
  }
}
function Io(e) {
  const t = ba(JSON.stringify(e));
  try {
    window.localStorage.setItem(oa, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Nt = Object.freeze({
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
function Mr(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function va(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? Mr(e.requestedMode) : "basic",
    effectiveMode: i ? Mr(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function an(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function $s(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Ts(e) {
  const t = [];
  return an(e, Nt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), an(e, Nt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function Ms(e) {
  return [
    ["general", "General", Nt.settingsGeneral],
    ["shortcuts", "Shortcuts", Nt.settingsShortcuts],
    ["performer-slots", "Performer slots", Nt.settingsPerformerSlots],
    ["derivation", "Derivation", Nt.settingsDerivation]
  ].filter(([, , r]) => an(e, r)).map(([r, o]) => [r, o]);
}
function As(e, t) {
  return e === "segments" && !an(
    t,
    Nt.navigationSegmentInventory
  ) || e === "bin" && !an(
    t,
    Nt.recyclingBinView
  ) ? "videos" : e;
}
function Rs(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Es(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const Sr = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, Co = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: Xe.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function Ds(e) {
  const t = String(e || "").split(",").filter((r) => Xe.includes(r));
  return t.length === 0 ? [...Xe] : [...new Set(t)];
}
function rn(e) {
  return xa(e).values;
}
function xa(e) {
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
function kr(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function $o(e, t) {
  var l;
  const r = To(t.activitiesCriterion, t.activityId), o = To(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = xa(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: Os(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function To(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function Os(e, t) {
  return Xe.includes(e == null ? void 0 : e.value) ? [e.value] : Ds(t);
}
function Sa(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Ps(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Ls(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Mo(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Fs(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function qe(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function Br(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function wr(e, t) {
  const r = new Set(Br(t).map((o) => String(qe(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function $t(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function Ao(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map($t).sort().join(",")}`;
}
function ka(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((y) => String(y.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((y) => {
    var p;
    return !((p = y.genderHints) != null && p.length);
  }) && e.length === t.length && !i) {
    const y = [...e].sort((b, f) => String(b.slotDefinitionId).localeCompare(String(f.slotDefinitionId))), p = [...t].sort((b, f) => String(b.name).localeCompare(String(f.name)) || Number(qe(b)) - Number(qe(f)));
    return [{
      assignments: Object.fromEntries(y.map((b, f) => [String(b.slotDefinitionId), String(qe(p[f]))])),
      description: p.map((b) => b.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((y) => t.map((p, b) => ({ performer: p, index: b })).filter(({ performer: p }) => {
    var b;
    return !((b = y.genderHints) != null && b.length) || y.genderHints.some((f) => $t(f) === $t(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), g = i ? c.filter((y) => y.length > 0).length : Ro(c, t.length);
  if (g === 0) return [];
  const m = new Map(t.map((y, p) => [String(qe(y)), p]));
  function u(y, p, b) {
    if (s.length >= a) return;
    const f = c.slice(y), w = i ? f.filter(($) => $.length > 0).length : Ro(f.map(($) => $.filter((q) => !p.has(String(qe(t[q]))))), t.length);
    if (b + w < g) return;
    if (y === e.length) {
      if (b !== g) return;
      const $ = Object.fromEntries(d.map(({ slot: E, performer: N }) => [String(E.slotDefinitionId), N ? String(qe(N)) : ""])), q = o.length === 0 ? Object.values($).sort().join(",") : [...new Set(e.map((E) => String(E.label || "")))].map((E) => `${E}:${d.filter(({ slot: N }) => String(N.label || "") === E).map(({ performer: N }) => N ? String(qe(N)) : "").sort().join(",")}`).join("|");
      !l.has(q) && s.length < a && (l.add(q), s.push({
        assignments: $,
        description: d.map(({ slot: E, performer: N }) => o.length ? `${E.label}: ${(N == null ? void 0 : N.name) || "Unassigned"}` : (N == null ? void 0 : N.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const v = e[y], C = [...d].reverse().find(({ slot: $ }) => Ao($) === Ao(v)), H = C ? m.get(String(qe(C.performer))) : -1;
    for (const $ of c[y]) {
      const q = t[$], E = qe(q);
      if (!($ < H) && !(E == null || !i && p.has(String(E))) && (d.push({ slot: v, performer: q }), i || p.add(String(E)), u(y + 1, p, b + 1), i || p.delete(String(E)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: v, performer: null }), u(y + 1, p, b), d.pop();
  }
  return u(0, /* @__PURE__ */ new Set(), 0), s;
}
function Ro(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function js(e, t) {
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
function Bs(e) {
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
function Gs(e, t, r = 20) {
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
function Ks(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function Us(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function wa(e, t, r) {
  const o = qe, i = new Set((t || []).map(o)), a = new Set((r || []).map($t));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const m = $t(l.gender || l.genderIdentity), u = $t(d.gender || d.genderIdentity), y = l.matchesGenderHint ?? a.has(m);
    return (d.matchesGenderHint ?? a.has(u)) - y || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: fe, useId: Na, useMemo: Be, useRef: ge, useState: F } = Or, n = Or.createElement, Ia = "/api/plugins/segment-studio";
function Re(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Bt) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = Ar();
    return t[e] = r, window.localStorage.setItem(Bt, JSON.stringify(t)), r;
  } catch {
    return Ar();
  }
}
function Oe(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Bt) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(Bt, JSON.stringify(t));
  } catch {
  }
}
function Gr(e) {
  try {
    return JSON.parse(window.localStorage.getItem(Bt) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function Kr(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Bt) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(Bt, JSON.stringify(t));
  } catch {
  }
}
function zs(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function _s(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function Z(e, t, r = 0) {
  var d;
  const o = await Yo(`${Ia}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = zs(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await _s(250 * (r + 1), t == null ? void 0 : t.signal), Z(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function Hs(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${Ia}${e}`, o = await Yo(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: qs(
      o.headers.get("Content-Disposition")
    )
  };
}
function qs(e, t = "segment-studio-ai-feedback.zip") {
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
function we(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function Ar() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function Ca(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function Ws(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function $a(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function Vs(e, t) {
  const { sceneCount: r, segmentCount: o } = $a(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function Ta(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = $a(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(Vs(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await Z("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Re(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return Oe(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function Eo({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const yt = {
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
function oc(e, t) {
  return {
    ...(yt[e] || yt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function Ma(e) {
  return { ...(yt[e] || yt.unreviewed).badge };
}
function Aa(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const Ra = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function Js(e, t, r = "not-applicable", o = !1) {
  const i = yt[e] || yt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Ys(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Zs(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function Qs(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function Xs(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function nr(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function el(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function Gt({ state: e, includeLabel: t = !0 }) {
  const r = yt[e] || yt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: Ma(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function tl(e, t = null) {
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
function ac(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function nl(e, t = document) {
  return !(e.defaultPrevented || tl(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function ic(e, t = document, r = !1, o = {}) {
  return nl(e, t) ? vs(e, r, o) != null : !1;
}
function rt(e, { onCancel: t, onConfirm: r } = {}) {
  var s, l;
  if (e.key === "Enter" && (e.isComposing || (s = e.nativeEvent) != null && s.isComposing || e.keyCode === 229)) return !1;
  const o = typeof ((l = e.target) == null ? void 0 : l.closest) == "function" ? e.target.closest("button, a, select, option, textarea") : e.target, i = String((o == null ? void 0 : o.tagName) || "").toLowerCase();
  if (i === "select" || i === "option" || e.key === "Enter" && (e.repeat || ["button", "a", "textarea"].includes(i))) return !1;
  const a = e.key === "Escape" ? t : e.key === "Enter" ? r : null;
  return a ? (e.preventDefault(), e.stopPropagation(), a(), !0) : !1;
}
function rl(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function xt(e) {
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
function ol(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? i.filter((a) => a.sequence > o && a.sequence <= r).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > r && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function Ea(e, t = !0) {
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
function qn(e, t = !0) {
  return {
    type: "segment",
    identity: Ea(e, t),
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
function ct(e, t = !0) {
  return {
    type: "segments",
    segments: (e || []).map((r) => ({
      identity: Ea(r, t),
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
function Xn(e) {
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
function Da(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function Oa(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = t.get(r.segmentId);
    o ? o.push(r) : t.set(r.segmentId, [r]);
  }
  for (const r of t.values())
    r.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function Ur(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function al(e, t) {
  const r = (t || []).map((i) => Da(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: et(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function il(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : al(e, t);
}
function sl({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function sc(e, t) {
  return Ur(Da(e, t));
}
function et(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function ll(e, t) {
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
function dl(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = ll(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function cl(e) {
  const t = et(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(rr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function rr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function er(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function Do(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((g) => g.end <= s && g.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: er(o),
    trackCount: Math.max(1, t.length)
  };
}
function ul(e) {
  const t = e.map(et), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function ml(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], g = d.length > 0 && d.every((m) => Number(m.performerId) > 0) ? d.map((m) => `${m.slotDefinitionId}:${Number(m.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: g };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [Do({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = ul(l.slots), g = l.slots.filter((b) => !a.has(String(b.slotDefinitionId))), m = o.length === 1 ? l.slots : g, u = m.map((b) => `${c.get(String(b.slotDefinitionId))} · ${b.performerName || `Performer ${b.performerId}`}`).join(" · "), y = [...new Map(m.map((b) => [
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
          performerLabel: u,
          performers: y,
          performerAssignments: p,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(Do);
}
function jt(e, t = [], r = []) {
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => ml(s, a));
}
function zr(e) {
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
const gl = {
  group: 38,
  lane: 33,
  segment: 41
};
function pl(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = gl[s.kind];
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
function Pa(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function fl(e, t = [], r = !0) {
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
function yl(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: er(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return zr(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: er(a)
    };
  });
}
function La(e, { nativeOnly: t = !1 } = {}) {
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
function Oo(e, t) {
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
function Mt(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function $n(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function bl(e) {
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
    }, o ? bl(e.name) : "—"),
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
function Fa({ assignments: e, className: t = "" }) {
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
function or({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = ge(null), i = `performer-slots-${Na()}`, [a, s] = F(null);
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
    a ? Ai(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(Fa, {
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
function hl(e, t) {
  const r = new Set(Mt(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function ja(e, t) {
  return t ? Mt(e).filter((r) => r !== t) : Mt(e);
}
function vl(e, t) {
  const r = Mt(t), o = new Set(Mt(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function ft(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function Po(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), g = Number.isFinite(c) && c >= d ? c : d, m = d <= o && g >= o, u = m ? 0 : Math.min(Math.abs(o - d), Math.abs(o - g));
    return { contains: m, distance: u, duration: g - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function Rr(e, t, r, o = null) {
  var g, m, u, y, p, b;
  const i = e.findIndex((f) => f.markers.some((w) => w.segment.id === t));
  if (i < 0) {
    const f = [...((g = e[0]) == null ? void 0 : g.markers) || []];
    return o != null && Number.isFinite(Number(o)) && f.sort((w, v) => Po(w, v, o)), ((m = f[0]) == null ? void 0 : m.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((f) => f.segment.id === t);
  if (r === "left" || r === "right") {
    const f = r === "left" ? -1 : 1, w = Math.min(a.markers.length - 1, Math.max(0, s + f));
    return ((u = a.markers[w]) == null ? void 0 : u.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((y = a.markers[s]) == null ? void 0 : y.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((p = a.markers[s]) == null ? void 0 : p.segment) ?? null : ((b = [...e[l].markers].sort(c ? (f, w) => Po(f, w, Number(o)) : (f, w) => Math.abs(f.segment.startSec - d) - Math.abs(w.segment.startSec - d) || f.segment.startSec - w.segment.startSec || f.segment.id - w.segment.id)[0]) == null ? void 0 : b.segment) ?? null;
}
function xl(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = Rr([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function Sl(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function kl(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function wl(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [Bo(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => Bo(Math.min(s, r + l))))];
}
function Nl(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function Il(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function Lo(e, t) {
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
function Fo(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function Cl(e) {
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
async function $l(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await jo(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], g = wl(
        d.startSec,
        d.endSec
      );
      for (const [m, u] of g.entries()) {
        Math.abs(r.currentTime - u) > 5e-4 && (r.currentTime = u, await jo(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const y = await Tl(o), p = `example-${l + 1}-frame-${m + 1}`;
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
function jo(e, t) {
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
function Tl(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function Bo(e) {
  return Math.round(e * 1e3) / 1e3;
}
function tr(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Ml(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function Er(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function Mn(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Ba(e, t) {
  const r = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...r.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Al(e, t) {
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
function Go(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function Rl(e) {
  const { compatibilityMode: t, currentTime: r, detail: o, editorFilters: i, endInput: a, hideDerivedSegments: s, historyRef: l, mediaDuration: d, onConflict: c, onDetailChange: g, onReload: m, optimisticSegmentIdRef: u, pendingDuplicateRef: y, pendingFirstSegmentStartSecRef: p, pendingTagEditSegmentIdRef: b, replaceSegmentSelection: f, savingSegmentId: w, segments: v, selectedSegment: C, selectedSegmentIdRef: H, selectedSegments: $, selectionAnchorIdRef: q, selectionRangeBaseIdsRef: E, setEditorFilters: N, setFirstSegmentTagOpen: M, setHideDerivedSegments: j, setHistory: Y, setHistoryOpen: P, setPublishApprovedError: J, setSaveMessage: T, setSavingSegmentId: I, setSelectedSegmentGroupKey: L, setSelectedSegmentId: re, setSelectedSegmentIds: Q, startInput: Ne, timelineDuration: ue, video: A } = e;
  function X(h) {
    l.current = h || wt, Y(l.current);
  }
  async function G(h, K, R, x, D = null) {
    var S;
    try {
      const k = await Z(`/videos/${A.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: l.current.revision,
          kind: h,
          label: K,
          beforeState: R,
          afterState: x,
          receiptId: D
        })
      });
      return X(k), !0;
    } catch (k) {
      return k.status === 409 && ((S = k.payload) != null && S.current) && X(k.payload.current), T("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function ae(h, K, R = !0, x = null, D = !1, S = K) {
    var te;
    if (!h || w != null) return null;
    const k = $.map((ve) => ve.id), z = H.current, le = R && !t ? crypto.randomUUID() : null;
    I(h.id), T(R ? "Saving directly to Cove…" : "Restoring history…");
    const ie = D ? tr(o, [h.id], S) : null;
    ie && g(ie, A.id);
    try {
      if (t && h.nativeSegmentId == null && h.itemId != null) {
        const V = `draft-update:${A.id}:${h.itemId}:${h.revision}:${K.tagId}:${K.startSec}:${K.endSec ?? "open"}:${K.reviewState ?? h.reviewState}`, O = await Z(`/videos/${A.id}/drafts/${h.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(V),
            expectedRevision: h.revision,
            startSec: K.startSec,
            endSec: K.endSec,
            tagId: K.tagId,
            reviewState: K.reviewState
          })
        });
        Oe(V);
        const ne = {
          ...h,
          ...O.draft,
          id: h.id,
          itemId: h.itemId
        };
        return R && await G(
          "segment.update",
          x || "Changed segment",
          qn(h, t),
          qn(
            ne,
            t
          )
        ), Go(h, K, t) ? await m() : g({
          ...o,
          approvedSetVersion: O.approvedSetVersion || o.approvedSetVersion,
          segments: v.map((me) => me.id === h.id ? ne : me).sort((me, be) => me.startSec - be.startSec || me.id - be.id)
        }, A.id), T(((te = O.draft) == null ? void 0 : te.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), ne;
      }
      const ve = await Z(`/videos/${A.id}/segments/${h.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...K,
          expectedUpdatedAt: h.updatedAt,
          historyReceiptId: le
        })
      }), _ = {
        ...h,
        ...ve,
        reviewState: K.reviewState ?? h.reviewState
      }, ee = v.map((V) => V.id === h.id ? _ : V).sort((V, O) => V.startSec - O.startSec || V.id - O.id);
      return Go(h, K, t) ? await m() : g({ ...o, segments: ee }, A.id), R && await G(
        "segment.update",
        x || "Changed segment",
        qn(h, t),
        qn(
          _,
          t
        ),
        le
      ), T(R ? "Saved to Cove" : "History restored"), _;
    } catch (ve) {
      return D && (g((_) => Mn(
        _,
        [h],
        Object.keys(S)
      ), A.id), Q(k), re(z), q.current = z, E.current = []), ve.status === 409 ? (T("Conflict — loading the latest segment…"), await c()) : T(ve.message || "Unable to save the segment."), null;
    } finally {
      I(null);
    }
  }
  async function oe() {
    if (!t) return !1;
    const h = v.filter((R) => !R.published && R.reviewState === "approved").length;
    if (h === 0 || w != null) return !1;
    const K = `complete-review:${A.id}:${o.approvedSetVersion}`;
    J(""), I(-1), T(`Publishing ${h} Approved draft${h === 1 ? "" : "s"}…`);
    try {
      const R = await Z(`/videos/${A.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(K),
          expectedApprovedSetVersion: o.approvedSetVersion
        })
      });
      Oe(K), X(wt), P(!1);
      const x = await m(), D = Ns(
        v,
        H.current,
        R.published
      ), S = D ? He(x == null ? void 0 : x.segments, D) : null;
      return S && re(S.id), T(`${R.published.length} Approved draft${R.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (R) {
      const x = R.status === 409 ? "The approved drafts changed. Review the updated list and try again." : R.message || "Unable to publish the approved drafts.";
      return R.status === 409 && await c(), J(x), T(x), !1;
    } finally {
      I(null);
    }
  }
  async function W(h = null, K = null) {
    var _;
    if (w != null) return;
    const R = h != null ? p.current : null, x = Number.isFinite(R) ? R : r, D = Math.min(ue, x + 20);
    if (D <= x) {
      T("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const S = ws(v, C, h);
    if (S.kind === "choose-tag") {
      p.current = x, T(""), M(!0);
      return;
    }
    if (S.kind === "invalid-selection") {
      T("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: k } = S, z = `create-draft:${A.id}:${k}:${x}`, le = t ? null : crypto.randomUUID(), ie = H.current, te = {
      ...C || {},
      id: u.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: k,
      tagName: K || (C == null ? void 0 : C.tagName) || "Tag segment",
      tagSortName: k === (C == null ? void 0 : C.tagId) && (C == null ? void 0 : C.tagSortName) || null,
      startSec: x,
      endSec: D,
      reviewState: "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, ve = Ml(o, te);
    I(-1), M(!1), g(ve, A.id), f(te.id), L(ft(
      jt(ve.segments, ve.segmentGroups || [], ve.performerSlots || []),
      te.id
    ));
    try {
      let ee;
      if (t) {
        const ne = await Z(`/videos/${A.id}/drafts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationId: Re(z), tagId: k, startSec: x, endSec: D })
        });
        Oe(z), ee = { itemId: (_ = ne.draft) == null ? void 0 : _.itemId };
      } else
        ee = { nativeSegmentId: (await Z(`/videos/${A.id}/segments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tagId: k,
            startSec: x,
            endSec: D,
            historyReceiptId: le
          })
        })).id };
      p.current = null, M(!1);
      const V = await m();
      if (!V) {
        g((ne) => Er(
          ne,
          [te.id]
        ), A.id), f(ie), T("Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment.");
        return;
      }
      const O = He(V == null ? void 0 : V.segments, ee);
      O ? (t || await G(
        "segment.create",
        "Created segment",
        ct([], !1),
        ct([O], !1),
        le
      ), S.openTagEditor && (b.current = O.id), f(O.id), L(ft(
        jt(V.segments || [], V.segmentGroups || [], V.performerSlots || []),
        O.id
      ))) : T("Segment created, but it could not be selected.");
    } catch (ee) {
      g((V) => Er(
        V,
        [te.id]
      ), A.id), f(ie), h != null && M(!0), T(ee.message || "Unable to create the draft.");
    } finally {
      I(null);
    }
  }
  async function xe() {
    if ($.length !== 1 || !C || w != null) return;
    const h = r;
    if (h <= C.startSec || C.endSec != null && h >= C.endSec) {
      T("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const K = `split-draft:${C.itemId}:${C.revision}:${h}`, R = t ? null : ct([C], !1), x = t ? null : crypto.randomUUID();
    I(C.id);
    try {
      let D = null;
      t && C.nativeSegmentId == null ? (await Z(`/videos/${A.id}/drafts/${C.itemId}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(K),
          expectedRevision: C.revision,
          splitSec: h
        })
      }), Oe(K)) : D = { nativeSegmentId: (await Z(`/videos/${A.id}/segments/${C.id}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedUpdatedAt: C.updatedAt,
          splitSec: h,
          historyReceiptId: x
        })
      })).id };
      const S = await m();
      if (!t) {
        const k = [
          He(S == null ? void 0 : S.segments, {
            nativeSegmentId: C.nativeSegmentId ?? C.id
          }),
          He(
            S == null ? void 0 : S.segments,
            D
          )
        ].filter(Boolean);
        await G(
          "segment.split",
          "Split segment",
          R,
          ct(k, !1),
          x
        );
      }
      T(t ? `Segment split; both ranges remain ${C.reviewState}.` : "Segment split.");
    } catch (D) {
      D.status === 409 ? await c() : T(D.message || "Unable to split the draft.");
    } finally {
      I(null);
    }
  }
  async function Ae(h = !1) {
    var D, S;
    if ($.length !== 1 || !C || w != null) return;
    const K = h ? r : C.startSec, R = ks(A.id, C, h, K), x = t ? null : crypto.randomUUID();
    I(C.id);
    try {
      const k = ((D = y.current) == null ? void 0 : D.operationKey) === R ? y.current : null;
      let z = (k == null ? void 0 : k.duplicateIdentity) ?? null;
      if (z == null && t && C.nativeSegmentId == null) {
        const te = await Z(`/videos/${A.id}/drafts/${C.itemId}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(R),
            expectedRevision: C.revision,
            startSec: h ? K : null
          })
        });
        z = wo(!1, te), y.current = { operationKey: R, duplicateIdentity: z };
      } else if (z == null) {
        const te = await Z(`/videos/${A.id}/segments/${C.id}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: C.updatedAt,
            startSec: h ? K : null,
            historyReceiptId: x
          })
        });
        z = wo(!0, te), y.current = { operationKey: R, duplicateIdentity: z };
      }
      const le = await m(), ie = He(le == null ? void 0 : le.segments, z);
      if (ie) {
        t || await G(
          "segment.duplicate",
          "Duplicated segment",
          ct([], !1),
          ct([ie], !1),
          x
        );
        const te = Xi(
          ie,
          le.performerSlots || [],
          i,
          s,
          le.segmentGroups || []
        );
        N(te.filters), j(te.hideDerivedSegments), Q([ie.id]), re(ie.id), q.current = ie.id, E.current = [], L(ft(
          jt(le.segments || [], le.segmentGroups || [], le.performerSlots || []),
          ie.id
        )), t && C.nativeSegmentId == null && Oe(R), y.current = null, T(h ? "Duplicate created at the playhead." : "Duplicate created in place.");
      } else
        T("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
    } catch (k) {
      ((S = y.current) == null ? void 0 : S.operationKey) === R ? T("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : k.status === 409 ? await c() : T(k.message || "Unable to duplicate the draft.");
    } finally {
      I(null);
    }
  }
  async function se() {
    if ($.length !== 1 || !C) return;
    const h = Number(Ne), K = a.trim() === "" ? null : Number(a), R = bo(h, K, d);
    if (R.error) {
      T(R.error);
      return;
    }
    if (h === C.startSec && K === C.endSec) {
      T("Timing is unchanged.");
      return;
    }
    await ae(C, { startSec: h, endSec: K, tagId: C.tagId }, !0, null, !0);
  }
  async function Te(h, K) {
    if ($.length !== 1 || !C) return;
    const R = bo(h, K, d);
    if (R.error) {
      T(R.error);
      return;
    }
    if (h === C.startSec && K === C.endSec) {
      T("Timing is unchanged.");
      return;
    }
    await ae(C, { startSec: h, endSec: K, tagId: C.tagId }, !0, null, !0);
  }
  return { acceptHistory: X, recordHistoryAction: G, mutateSegment: ae, completeReview: oe, createSegment: W, splitSegment: xe, duplicateSegment: Ae, saveTiming: se, applyShortcutTiming: Te };
}
function El() {
  const [e, t] = F(() => typeof window < "u" && window.matchMedia(po).matches);
  return fe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(po), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Dl() {
  const [e, t] = F(() => typeof window < "u" && window.matchMedia(fo).matches);
  return fe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(fo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Ol() {
  try {
    return Wi(window.localStorage.getItem(na));
  } catch {
    return { ...nt };
  }
}
function Pl() {
  try {
    return Mt(JSON.parse(window.localStorage.getItem(ra) || "[]"));
  } catch {
    return [];
  }
}
function Ll(e) {
  try {
    window.localStorage.setItem(ra, JSON.stringify(Mt(e)));
  } catch {
  }
}
function Fl(e) {
  try {
    window.localStorage.setItem(na, JSON.stringify(e));
  } catch {
  }
}
function jl() {
  try {
    const e = JSON.parse(window.localStorage.getItem(aa) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Bl(e) {
  try {
    return window.localStorage.setItem(aa, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Gl({ status: e }) {
  const t = Ra[e];
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
      ...Ma(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${yt[t].symbol}${e[t]}`)));
}
function Kl({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onSaved: s, onConflict: l, confirmRef: d, shortcutRef: c }) {
  const g = Br(a), [m, u] = F(() => wr(o, g)), [y, p] = F(!1), [b, f] = F(""), w = ge(!1), v = o.map((N) => `${N.slotDefinitionId}:${N.performerId || ""}`).join("|"), C = g.map((N) => qe(N)).join("|"), H = ka(
    o,
    g
  );
  fe(() => {
    u(wr(o, g)), f("");
  }, [t, r, v, C]);
  async function $(N = m) {
    if (!w.current) {
      w.current = !0, p(!0), f("Saving performer slots…");
      try {
        const M = wr(o.map((Y) => ({
          ...Y,
          performerId: N[Y.slotDefinitionId] || null
        })), g), j = await Z(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((Y) => ({ slotDefinitionId: Y.slotDefinitionId, performerId: M[Y.slotDefinitionId] ? Number(M[Y.slotDefinitionId]) : null }))
          })
        });
        f("Performer slots saved."), s(j, {
          beforeState: Xn([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: Xn([{
            segmentId: t,
            itemId: r,
            revision: j.revision,
            slots: j.slots || []
          }])
        });
      } catch (M) {
        M.status === 409 ? (f("Slot definitions or assignments changed; current values were reloaded."), l()) : f(M.message || "Unable to save performer slots.");
      } finally {
        w.current = !1, p(!1);
      }
    }
  }
  function q(N, M) {
    f(`Option ${M + 1} applied; save to confirm.`), u({ ...m, ...N.assignments });
  }
  async function E(N) {
    const M = { ...m, ...N.assignments };
    u(M), await $(M);
  }
  return fe(() => {
    if (c)
      return c.current = (N) => w.current || !H[N] ? !1 : (E(H[N]), !0), () => {
        c.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    H.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, H.map((N, M) => n("button", {
        key: M,
        type: "button",
        disabled: y,
        onClick: () => q(N, M),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${M + 1}: ${N.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, M + 1),
        n("span", { key: "description" }, N.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${H.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((N) => n("label", { key: N.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, et(N)),
      (N.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(N.genderHints || []).map(rr).join(" · ")}`) : null,
      n("select", { key: "select", value: m[N.slotDefinitionId] || "", disabled: y, onChange: (M) => u({ ...m, [N.slotDefinitionId]: M.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...wa(g, g, N.genderHints).map((M) => n("option", { key: qe(M), value: qe(M) }, M.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: d, type: "button", disabled: y, onClick: () => $(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, b)])
  ]);
}
function Ul({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a }) {
  var q;
  const s = ((q = t[0]) == null ? void 0 : q.slots) || [], l = Br(r), d = ka(
    s,
    l
  ), c = "__mixed__", g = () => Object.fromEntries(s.map((E, N) => {
    const M = t.map((j) => {
      var Y;
      return String(((Y = j.slots[N]) == null ? void 0 : Y.performerId) || "");
    });
    return [E.slotDefinitionId, M.every((j) => j === M[0]) ? M[0] : c];
  })), [m, u] = F(g), [y, p] = F(!1), [b, f] = F(""), w = ge(!1), v = t.map((E) => `${E.itemId ?? `native:${E.segmentId}`}:${E.revision}:${E.slots.map((N) => `${N.slotDefinitionId}:${N.performerId || ""}`).join(",")}`).join("|");
  fe(() => {
    u(g());
  }, [v]);
  async function C(E = m) {
    if (w.current) return;
    w.current = !0, p(!0), f(`Saving performer slots for ${t.length} segments…`);
    const N = [];
    try {
      for (const M of t) {
        const j = M.slots.map((P, J) => {
          const T = E[s[J].slotDefinitionId];
          return {
            slotDefinitionId: P.slotDefinitionId,
            performerId: T === c ? P.performerId || null : T ? Number(T) : null
          };
        }), Y = await Z(M.itemId != null ? `/videos/${e}/drafts/${M.itemId}/slots` : `/videos/${e}/segments/${M.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: M.revision, assignments: j })
        });
        N.push({
          segmentId: M.segmentId,
          itemId: M.itemId,
          revision: Y.revision,
          slots: Y.slots || []
        });
      }
      f("Performer slots saved."), o({
        beforeState: Xn(t),
        afterState: Xn(N)
      });
    } catch (M) {
      const j = await i();
      M.status === 409 ? f(j ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : f(M.message || (j ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      w.current = !1, p(!1);
    }
  }
  function H(E, N) {
    f(`Option ${N + 1} applied; save to confirm.`), u({ ...m, ...E.assignments });
  }
  async function $(E) {
    const N = { ...m, ...E.assignments };
    u(N), await C(N);
  }
  return fe(() => {
    if (a)
      return a.current = (E) => w.current || !d[E] ? !1 : ($(d[E]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, d.map((E, N) => n("button", {
        key: N,
        type: "button",
        disabled: y,
        onClick: () => H(E, N),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${N + 1} to all selected segments: ${E.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, N + 1),
        n("span", { key: "description" }, E.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${d.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, s.map((E) => n("label", {
      key: E.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, et(E)),
      n("select", {
        key: "select",
        value: m[E.slotDefinitionId] || "",
        disabled: y,
        onChange: (N) => u({ ...m, [E.slotDefinitionId]: N.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        m[E.slotDefinitionId] === c ? n("option", { key: "mixed", value: c }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...wa(l, l, E.genderHints).map((N) => n("option", {
          key: qe(N),
          value: qe(N)
        }, N.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: y,
        onClick: () => C(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, b)
    ])
  ]);
}
function bt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function zl(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return bt(t);
  const o = [...new Set(r.map((i) => bt(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function ar() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function Wn({ name: e }) {
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
function _l({ hidden: e }) {
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
    n(ar, { key: "derived" })
  ]);
}
function Hl({ segment: e, provenance: t }) {
  var g;
  const [r, o] = F(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = zl(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
            bt(m.sourceKey, m.sourceDisplayName)
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
function ql({
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
  const [m, u] = F([]), y = e.flatMap((w) => w.lanes.map((v) => v.key)), p = y.join("|");
  fe(() => {
    const w = new Set(y);
    u((v) => v.filter((C) => w.has(C)));
  }, [p]);
  const b = er(t), f = !!La(
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
      a ? n(Tt, { key: "counts", counts: b }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      sl({ mergeable: f, reviewable: a, tagEditable: s, slotsEditable: l })
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
        const C = m.includes(v.key), H = v.markers.some(({ segment: q }) => q.id === r), $ = `selected-segment-lane-${v.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: v.key,
          "data-selected-segment-lane": v.key,
          className: `rounded-md border ${H ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": C,
            "aria-controls": $,
            "aria-current": H ? "true" : void 0,
            onClick: () => u((q) => C ? q.filter((E) => E !== v.key) : [...q, v.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, C ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, $n(v)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(v.selectedCount)),
            a ? n(Tt, { key: "states", counts: v.counts }) : null
          ]),
          C ? n("div", {
            key: "segments",
            id: $,
            className: "space-y-1 border-t border-border p-1.5"
          }, v.markers.map(({ segment: q }) => {
            const E = q.endSec == null ? we(q.startSec) : `${we(q.startSec)} – ${we(q.endSec)}`;
            return n("button", {
              key: q.id,
              type: "button",
              onClick: () => i(q),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${q.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${q.tagName || "Segment"}, ${q.reviewState}, ${E}` : `${q.tagName || "Segment"}, ${E}`,
              "aria-current": q.id === r ? "true" : void 0
            }, [
              a ? n(Gt, {
                key: "state",
                state: q.reviewState,
                includeLabel: !1
              }) : null,
              q.isDerived ? n(ar, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, E),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                bt(q.sourceKey)
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
}, Ko = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], Uo = [
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
function Rn(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function Ga(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function zo(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function Vn(e, t, r, o = null) {
  const i = zo(t), a = zo(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function Wl(e, t, r = null) {
  var m, u, y;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (m = t.hasSegmentsCriterion) == null ? void 0 : m.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), Vn(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), Vn(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), Vn(o, t.performersCriterion, "performer"), Vn(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = _o(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = _o(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((u = t.reviewStateCriterion) == null ? void 0 : u.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const g = (y = t.shotBoundariesCriterion) == null ? void 0 : y.value;
  return r && typeof g == "boolean" ? o.set("hasShotBoundaries", String(g)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function _o(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function Ka({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(Eo, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, Xe.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = yt[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(Eo, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function Vl({ item: e, onNavigate: t, showReviewStates: r = !1 }) {
  const o = { page: "segment-studio", id: e.videoId };
  return n("article", { className: "group relative flex min-h-full flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm transition-colors hover:border-accent/60" }, [
    n("a", {
      key: "link",
      href: `/segment-studio/${e.videoId}`,
      onClick: (i) => Rn(i, t, o),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, Ri(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(Ka, { item: e, showReviewStates: r }))
    ])
  ]);
}
function Jl({ item: e, onNavigate: t, showReviewStates: r = !1 }) {
  const o = { page: "segment-studio", id: e.videoId };
  return n("article", { className: "overflow-hidden rounded-md border border-border bg-card" }, n("a", {
    href: `/segment-studio/${e.videoId}`,
    onClick: (i) => Rn(i, t, o),
    className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
    "aria-label": `Open segment editor for ${e.title}`
  }, [
    n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
    n("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
      n("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
      n(Ka, { key: "segments", item: e, showReviewStates: r })
    ]),
    n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
  ]));
}
function _r({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = Ts(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => Rn(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && an(
        o,
        Nt.recyclingBinView
      ) ? n(Ua, { key: "bin", onNavigate: t }) : null,
      n(za, { key: "settings", onNavigate: t })
    ])
  ]);
}
const Dr = "segment-studio:recycling-bin-changed";
function Yl(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function Nn() {
  window.dispatchEvent(new CustomEvent(Dr));
}
function Ua({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = F(null);
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
    return l(), window.addEventListener(Dr, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(Dr, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = Yl(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => Rn(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function za({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => Rn(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function Zl({ mode: e, onModeChange: t, disabled: r = !1 }) {
  function o(i) {
    const a = Mr(i.target.value);
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
function Ql({ minimum: e, maximum: t, onChange: r }) {
  const o = ge(null), [i, a] = F("maximum"), s = (u, y) => {
    const p = ns(e, t, u, y);
    a(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (u, y) => {
    var b;
    const p = (b = o.current) == null ? void 0 : b.getBoundingClientRect();
    p && s(u, ts(y.clientX, p.left, p.width));
  }, d = (u, y) => {
    var p, b;
    y.preventDefault(), (b = (p = y.currentTarget).setPointerCapture) == null || b.call(p, y.pointerId), l(u, y);
  }, c = (u, y) => {
    var p, b;
    (b = (p = y.currentTarget).hasPointerCapture) != null && b.call(p, y.pointerId) && l(u, y);
  }, g = (u, y) => {
    const p = u === "minimum" ? e : t, b = u === "minimum" ? 0 : e, f = u === "minimum" ? t : 1, w = y.shiftKey ? 0.1 : 0.01;
    let v = null;
    ["ArrowLeft", "ArrowDown"].includes(y.key) && (v = p - w), ["ArrowRight", "ArrowUp"].includes(y.key) && (v = p + w), y.key === "PageDown" && (v = p - 0.1), y.key === "PageUp" && (v = p + 0.1), y.key === "Home" && (v = b), y.key === "End" && (v = f), v != null && (y.preventDefault(), s(u, Math.min(f, Math.max(b, v))));
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
function Xl({ saving: e, error: t, onSelect: r, onClose: o }) {
  const i = ge(null);
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
    onKeyDownCapture: (s) => rt(s, { onCancel: a })
  }, n("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: xt,
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
function ed({
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
  const m = ut(e), u = [...new Map((a || []).map((f) => [
    Number(f.tagId),
    f.tagName || `Tag ${f.tagId}`
  ])).entries()].sort((f, w) => f[1].localeCompare(w[1]) || f[0] - w[0]), y = (f) => d(ut({ ...m, ...f })), p = (f) => y({
    reviewStates: m.reviewStates.includes(f) ? m.reviewStates.filter((w) => w !== f) : [...m.reviewStates, f]
  }), b = (f) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${f ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (f) => {
      f.target === f.currentTarget && g();
    },
    onKeyDownCapture: (f) => rt(f, { onCancel: g })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: xt,
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
          const w = m.reviewStates.includes(f), v = yt[f];
          return n("button", {
            key: f,
            type: "button",
            onClick: () => p(f),
            "aria-pressed": w,
            className: b(w)
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
            className: b(m.performerId == null)
          }, "All performers"),
          ...r.map((f) => {
            const w = Number(qe(f));
            return n("button", {
              key: w,
              type: "button",
              onClick: () => y({ performerId: w }),
              "aria-pressed": m.performerId === w,
              className: b(m.performerId === w)
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
            className: b(m.sourceKey == null)
          }, "All provenance"),
          ...o.map((f) => n("button", {
            key: f,
            type: "button",
            onClick: () => y({ sourceKey: f }),
            "aria-pressed": m.sourceKey === f,
            title: f,
            className: b(m.sourceKey === f)
          }, bt(f)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(Ql, {
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
        n(_l, { key: "icon", hidden: t }),
        n("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    n("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(ut({})), l && c(!1);
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
function td({ reviewMode: e, bindings: t, onClose: r }) {
  const o = An.filter((l) => on(l, e)), i = So(o, 1)[0], a = So(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((g) => n("div", { key: g.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, g.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[g.id] ? t[g.id].length > 0 ? t[g.id] : ["Unassigned"] : g.bindings.map(ya)).map((m, u) => n("kbd", { key: `${g.id}:${u}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, m))
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
    onKeyDownCapture: (l) => rt(l, { onCancel: r })
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
function nd({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = Cl(e), [l, d] = F([]), c = s.map((g) => g.tagName).join("|");
  return fe(() => {
    const g = new Set(s.map((m) => m.tagName));
    d((m) => m.filter((u) => g.has(u)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (g) => rt(g, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: xt,
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
            onClick: () => d((p) => u ? p.filter((b) => b !== g.tagName) : [...p, g.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: nr(!1) }
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
            const b = `${we(p.startSec)}${p.endSec == null ? "" : ` – ${we(p.endSec)}`}`, f = r === p.id;
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
                "aria-label": `${f ? "Restoring" : "Restore to review"} ${g.tagName} example at ${b}`,
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
function rd({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = F(""), [a, s] = F(0), l = ge(null), d = Be(() => Gs(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = Us(d);
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
        xt(u);
      else if (u.key === "Escape")
        u.preventDefault(), u.stopPropagation(), r();
      else if (u.key === "ArrowDown" || u.key === "ArrowUp") {
        u.preventDefault(), u.stopPropagation();
        const p = u.key === "ArrowDown" ? 1 : -1;
        s((b) => d.length ? (b + p + d.length) % d.length : 0);
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
      var $;
      const p = u.segment || u, b = p.endSec == null ? we(p.startSec) : `${we(p.startSec)} – ${we(p.endSec)}`, f = `${bt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, w = y === c, v = y > 0 ? d[y - 1].groupKey : null, C = g && u.groupKey !== v ? n("div", {
        key: `group:${u.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, u.groupName) : null, H = n("button", {
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
        n(Gt, { key: "review", state: p.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        ($ = u.performers) != null && $.length ? n(or, {
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
          title: f
        }, f)
      ]);
      return C ? [C, H] : [H];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function od(e) {
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
function ad({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = Be(() => od(e), [e]), [l, d] = F([]), c = s.reduce((u, y) => u + y.drafts.length, 0), g = (u) => d((y) => y.includes(u) ? y.filter((p) => p !== u) : [...y, u]), m = (u) => `segment-studio-publish-approved-${u.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !t && a();
    },
    onKeyDownCapture: (u) => rt(u, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: xt,
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
            style: { background: nr(!1) }
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
            const b = p.endSec == null ? we(p.startSec) : `${we(p.startSec)} – ${we(p.endSec)}`, f = `${bt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`;
            return n("div", { key: p.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(Gt, { key: "review", state: p.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, b),
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
function id({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = Bs(e), [s, l] = F(() => /* @__PURE__ */ new Set()), [d, c] = F(() => new Set(a.map((b) => b.key))), g = a.flatMap((b) => d.has(b.key) ? b.candidates : []), m = (b) => l((f) => {
    const w = new Set(f);
    return w.has(b) ? w.delete(b) : w.add(b), w;
  }), u = (b) => c((f) => {
    const w = new Set(f);
    return w.has(b) ? w.delete(b) : w.add(b), w;
  }), y = (b) => b.assignment.map(({ slot: f, performer: w }) => `${f.label || `Slot ${f.sortOrder + 1}`}: ${w.name}`).join(", "), p = (b) => `segment-studio-auto-assign-${b.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && !t && i();
    },
    onKeyDownCapture: (b) => {
      b.key === "Enter" && b.target instanceof HTMLInputElement || rt(b, {
        onCancel: t ? void 0 : i,
        onConfirm: g.length && !t ? () => o(g) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: xt,
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
          style: { background: nr(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(b.key),
            disabled: t,
            onChange: () => u(b.key),
            "aria-label": `Include ${b.tagName} assignment: ${y(b)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(b.key),
            "aria-controls": p(b),
            "aria-label": `${s.has(b.key) ? "Collapse" : "Expand"} ${b.tagName} assignment: ${y(b)}`,
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
            b.assignment.map(({ slot: f, performer: w }) => {
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
          n(Tt, { key: "states", counts: b.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(b.candidates),
            "aria-label": `Auto-Assign ${b.tagName}: ${y(b)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${b.candidates.length})`)
        ]),
        s.has(b.key) ? n(
          "div",
          { key: "segments", id: p(b), className: "divide-y divide-border/70" },
          b.candidates.map((f) => {
            const w = f.endSec == null ? we(f.startSec) : `${we(f.startSec)} – ${we(f.endSec)}`, v = `${bt(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`;
            return n("div", {
              key: f.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(Gt, { key: "review", state: f.reviewState, includeLabel: !1 }),
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
function sd({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => rt(d, { onCancel: r, onConfirm: t })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: xt,
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
function ld({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = F(!1);
  if (!e) return null;
  const d = e.endSec == null ? "open end" : we(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (c) => {
      c.target === c.currentTarget && !t && a();
    },
    onKeyDownCapture: (c) => rt(c, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: xt,
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
        `${we(e.startSec)} – ${d}`
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
function dd(e) {
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
function cd({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var g, m;
  const l = e ? e.createCount + e.linkCount : 0, d = ((g = e == null ? void 0 : e.outputs) == null ? void 0 : g.slice(0, 200)) || [], c = dd(d);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !r && s();
    },
    onKeyDownCapture: (u) => rt(u, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: xt,
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
                `${u.rootTagName} @ ${we(u.rootStartSec)}`
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
function ud({
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
  tagSearchRef: b,
  onSlotsChanged: f,
  onRecordHistory: w,
  splitSegment: v,
  duplicateSegment: C,
  provenance: H,
  lineage: $,
  onNavigateLineageItem: q,
  tagEditing: E,
  onCancelTagEditing: N,
  detailPanelRef: M,
  onReduceSelection: j
}) {
  var Ne, ue, A, X;
  const Y = ge(null), P = ge(null), J = ge(null), T = ge(null), I = ge(null), [L, re] = F(!1);
  fe(() => {
    Y.current && (Y.current.scrollTop = 0), re(!1);
  }, [t == null ? void 0 : t.id]), fe(() => {
    var G, ae;
    L && ((ae = (G = P.current) == null ? void 0 : G.querySelector("input, select, button")) == null || ae.focus({ preventScroll: !0 }));
  }, [L]);
  function Q() {
    re(!1), requestAnimationFrame(() => {
      var G;
      return (G = p.current) == null ? void 0 : G.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const G = !r.some((W) => W.isDerived), ae = e && c ? il(m, r) : null, oe = (ae == null ? void 0 : ae.map((W, xe) => {
      var se;
      const Ae = r[xe];
      return {
        segmentId: Ae.nativeSegmentId,
        itemId: Ae.published ? null : Ae.itemId,
        revision: (se = u.performerSlotRevisions) == null ? void 0 : se[Ae.id],
        slots: W
      };
    })) || [];
    return n(Or.Fragment, null, [
      n(ql, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: M,
        onReduceSelection: j,
        reviewable: e,
        tagEditable: G,
        slotsEditable: oe.length > 0,
        onEditSlots: () => re(!0),
        slotButtonRef: p,
        saveMessage: i
      }),
      E && G ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (W) => {
          W.target === W.currentTarget && N();
        },
        onKeyDownCapture: (W) => rt(W, { onCancel: N })
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
        n(In, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (W, xe) => W == null ? N() : s(W, xe == null ? void 0 : xe.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: N,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      L && oe.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (W) => {
          W.target === W.currentTarget && Q();
        },
        onKeyDownCapture: (W) => {
          var Ae, se;
          if (!(typeof ((Ae = W.target) == null ? void 0 : Ae.closest) == "function" ? W.target.closest("input, textarea, select, [contenteditable='true']") : null) && !W.repeat && !W.ctrlKey && !W.altKey && !W.metaKey && !W.shiftKey && /^[1-9]$/.test(W.key) && ((se = I.current) != null && se.call(I, Number(W.key) - 1))) {
            W.preventDefault(), W.stopPropagation();
            return;
          }
          rt(W, { onCancel: Q });
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
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Ul, {
          videoId: y.id,
          targets: oe,
          performerCandidates: u.performerCandidates || [],
          shortcutRef: I,
          onSaved: async ({ beforeState: W, afterState: xe }) => {
            await w(
              "performer-slots.assign",
              `Assigned performers to ${oe.length} segments`,
              W,
              xe
            ), Q(), f();
          },
          onConflict: f
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (G) => {
      Y.current = G, M && (M.current = G);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(Gt, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(ar, { key: "derived" }) : null,
        t && E ? n("div", {
          key: "tag-editor",
          ref: b,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (G) => {
            G.key === "Escape" && (G.preventDefault(), G.stopPropagation(), N());
          },
          onKeyDown: (G) => {
            rl(G, t.tagName) && (G.preventDefault(), G.stopPropagation(), s(t.tagId));
          }
        }, n(In, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (G, ae) => G == null ? N() : s(G, ae == null ? void 0 : ae.label),
          disabled: a != null || ((Ne = $.data) == null ? void 0 : Ne.tagReadOnly) === !0,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? n("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : n("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? n("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        n("span", { key: "start" }, we(t.startSec)),
        t.endSec == null ? null : n("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : n("span", { key: "end" }, we(t.endSec))
      ]) : null,
      e && t && (d === "empty" || d === "partial") ? n("div", { key: "slots-row" }, n(Gl, { status: d })) : null,
      t && c && g.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(Fa, {
        assignments: g.map((G) => {
          const ae = cl(G);
          return {
            key: String(G.slotDefinitionId),
            label: ae.label,
            performer: ae.filled ? { id: Number(G.performerId), name: ae.performer } : null,
            title: ae.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(Hl, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: H
    }) : null,
    t ? n("div", { key: "controls", hidden: !0 }, [
      n("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        n("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        $.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : $.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, $.error) : $.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${$.data.derived ? "Derived segment" : "Root segment"} · ${$.data.componentSize} segment${$.data.componentSize === 1 ? "" : "s"} · ${$.data.integrityState}`
          ),
          (ue = $.data.parents) != null && ue.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...$.data.parents.map((G) => n("button", {
              key: G.nodeId,
              type: "button",
              onClick: () => q(G.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${G.ruleKey} ${G.ruleVersion}`))
          ]) : null,
          (A = $.data.children) != null && A.length ? n("p", { key: "children" }, `Children: ${$.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: l, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: p,
          type: "button",
          disabled: !c || g.length === 0,
          onClick: () => re(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: c ? g.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, g.length === 0 ? "No performer slots" : "Edit performer slots") : null,
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
    L && e && t && c && g.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (G) => {
        G.target === G.currentTarget && Q();
      },
      onKeyDownCapture: (G) => {
        var oe, W;
        if (!(typeof ((oe = G.target) == null ? void 0 : oe.closest) == "function" ? G.target.closest("input, textarea, select, [contenteditable='true']") : null) && !G.repeat && !G.ctrlKey && !G.altKey && !G.metaKey && !G.shiftKey && /^[1-9]$/.test(G.key) && ((W = T.current) != null && W.call(T, Number(G.key) - 1))) {
          G.preventDefault(), G.stopPropagation();
          return;
        }
        rt(G, {
          onCancel: Q,
          onConfirm: () => {
            var xe;
            return (xe = J.current) == null ? void 0 : xe.click();
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
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Kl, {
        key: `${t.id}:${u.performerSlotsRevision || u.slotRevision || ""}`,
        videoId: y.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: g,
        revision: (X = u.performerSlotRevisions) == null ? void 0 : X[t.id],
        performerCandidates: u.performerCandidates || [],
        confirmRef: J,
        shortcutRef: T,
        onSaved: async (G, { beforeState: ae, afterState: oe }) => {
          await w(
            "performer-slots.assign",
            "Assigned performers",
            ae,
            oe
          ), Q(), f(G);
        },
        onConflict: f
      }))
    ])) : null
  ]);
}
function md({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: m, onSelectGroup: u, onToggleGroup: y, onSelect: p, onSelectSegments: b, onSelectAll: f, onConfigureTag: w, onSeekTime: v, centerRef: C, showReviewState: H = !0, swimlaneTitleWidth: $, onSwimlaneTitleWidthChange: q }) {
  const E = ge(null), N = ge(null), [M, j] = F(0), [Y, P] = F({ scrollTop: 0, height: 320 }), [J, T] = F(null), I = Be(
    () => jt(e, r, o),
    [e, r, o]
  ), L = Be(
    () => Oa(o),
    [o]
  ), re = Be(() => zr(I), [I]), Q = Be(
    () => fl(re, i, r.length > 0),
    [re, i, r.length]
  ), Ne = Be(
    () => Pa(Q.rows, Math.max(0, Y.scrollTop - 24), Y.height),
    [Q, Y]
  ), ue = Math.max(0, Number(d) || 0), A = qi(M), X = Jn($, A), G = X / 16, ae = _i(c, ue, G), oe = Bi(ue), W = Gi(ue, Math.max(1, M - G * 16), g), xe = oe.filter((S, k) => k === 0 || k % W === 0), Ae = Be(() => I.map((S) => `${S.key}:${S.trackCount}:${S.markers.map(({ segment: k, track: z }) => `${k.id}:${k.startSec}:${k.endSec ?? ""}:${z}`).join(",")}`).join("|"), [I]);
  function se() {
    const S = N.current;
    if (!S) return;
    const k = S.querySelector("[data-timeline-track]"), z = S.firstElementChild, le = k == null ? void 0 : k.getBoundingClientRect(), ie = z == null ? void 0 : z.getBoundingClientRect(), te = le && ie ? Math.max(0, le.left - ie.left) : G * 16, ve = (ie == null ? void 0 : ie.width) ?? S.scrollWidth;
    S.scrollTo({
      left: zi(c, ue, ve, S.clientWidth, te, la),
      behavior: "smooth"
    });
  }
  fe(() => (C.current = se, () => {
    C.current === se && (C.current = null);
  })), fe(() => {
    se();
  }, [g]);
  function Te() {
    const S = N.current, k = Q.rows.find((ve) => ve.kind === "lane" && ve.lane.markers.some(({ segment: _ }) => _.id === s));
    if (!S || !k) return;
    const z = 24, le = k.top + z, ie = le + k.height;
    let te = S.scrollTop;
    le < S.scrollTop + z ? te = Math.max(0, le - z) : ie > S.scrollTop + S.clientHeight && (te = Math.max(0, ie - S.clientHeight)), te !== S.scrollTop && (S.scrollTop = te), P({ scrollTop: te, height: S.clientHeight });
  }
  fe(() => {
    Te();
  }, [s, Ae, Q]), fe(() => {
    const S = N.current, k = Q.rows.find((ve) => ve.kind === "group" && ve.group.key === a);
    if (!S || !k) return;
    const z = 24, le = k.top + z, ie = le + k.height;
    let te = S.scrollTop;
    le < S.scrollTop + z ? te = Math.max(0, le - z) : ie > S.scrollTop + S.clientHeight && (te = Math.max(0, ie - S.clientHeight)), te !== S.scrollTop && (S.scrollTop = te), P({ scrollTop: te, height: S.clientHeight });
  }, [a, Q]), fe(() => {
    const S = N.current;
    if (!S || typeof ResizeObserver > "u") return;
    const k = () => {
      j(S.clientWidth), P({ scrollTop: S.scrollTop, height: S.clientHeight }), Te();
    }, z = new ResizeObserver(k);
    return z.observe(S), k(), () => z.disconnect();
  }, [s, Ae, Q]);
  function h(S) {
    if (!(ue > 0)) return;
    const k = S.currentTarget.getBoundingClientRect(), z = Math.min(1, Math.max(0, (S.clientX - k.left) / k.width));
    v(z * ue);
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
    let z = null;
    Object.hasOwn(k, S.key) && (z = c + k[S.key]), S.key === "Home" && (z = 0), S.key === "End" && (z = ue), z != null && (S.preventDefault(), S.stopPropagation(), v(Math.min(ue, Math.max(0, z))));
  }
  function R(S) {
    var z;
    const k = (z = E.current) == null ? void 0 : z.getBoundingClientRect();
    k && q(Jn(S.clientX - k.left, A));
  }
  function x(S) {
    const k = S.shiftKey ? 40 : 16;
    let z = null;
    S.key === "ArrowLeft" && (z = X - k), S.key === "ArrowRight" && (z = X + k), S.key === "Home" && (z = 160), S.key === "End" && (z = A), z != null && (S.preventDefault(), S.stopPropagation(), q(Jn(z, A)));
  }
  const D = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: E,
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
      n("button", { key: "out", type: "button", className: D, disabled: g <= 1, onClick: () => m(Zn(g - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: D, disabled: g === 1, onClick: () => m(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(g * 100)}%`),
      n("button", { key: "in", type: "button", className: D, disabled: g >= 8, onClick: () => m(Zn(g + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: D, onClick: se, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(A),
      "aria-valuenow": Math.round(X),
      "aria-valuetext": `${Math.round(X)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (S) => {
        S.currentTarget.setPointerCapture(S.pointerId), R(S);
      },
      onPointerMove: (S) => {
        S.currentTarget.hasPointerCapture(S.pointerId) && R(S);
      },
      onKeyDown: x,
      onDoubleClick: () => q(nt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${X - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: N,
      onScroll: (S) => P({
        scrollTop: S.currentTarget.scrollTop,
        height: S.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: Hi(g) }, [
      n("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${G}rem minmax(0,1fr)`, height: "1.5rem" } }, [
        n("div", { key: "axis-label", "data-timeline-label-gutter": "true", "aria-hidden": "true", className: "sticky left-0 z-40 border-r border-border", style: { backgroundColor: "var(--color-surface)" } }),
        n("div", {
          key: "ticks",
          role: "slider",
          tabIndex: 0,
          "data-timeline-seeker": "true",
          "data-timeline-track": "true",
          "aria-label": "Timeline seek",
          "aria-valuemin": 0,
          "aria-valuemax": ue,
          "aria-valuenow": Math.min(ue, Math.max(0, c)),
          "aria-valuetext": we(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: h,
          onKeyDown: K
        }, xe.map((S, k) => n("span", {
          key: S,
          className: `absolute top-0 ${Ki(k, xe.length, ue > 0 ? S / ue * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Ui(k, xe.length, ue > 0 ? S / ue * 100 : 0)
        }, we(S))).concat(t.map((S) => {
          const k = ue > 0 ? S.startSec / ue * 100 : 0;
          return n("button", {
            key: `shot-boundary:${S.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${we(S.startSec)} – ${we(S.endSec)}`,
            title: `Shot boundary · ${S.source || "manual"} · ${we(S.startSec)} – ${we(S.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${k}%`, width: "2px" },
            onClick: (z) => {
              z.stopPropagation(), v(S.startSec);
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
            ...ho(ae),
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
        style: I.length > 0 ? { height: Q.height } : void 0
      }, [
        I.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...ho(ae, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        I.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : Ne.map((S) => {
          var ee;
          const k = S.group, z = i.includes(k.key), le = a === k.key, ie = nr(le);
          if (S.kind === "group") return n("div", {
            key: S.key,
            "data-segment-group": k.key,
            "data-segment-group-collapsed": z ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${G}rem minmax(0,1fr)`,
              backgroundColor: ie,
              top: S.top,
              height: S.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (V) => {
                if (V.metaKey || V.ctrlKey) {
                  b(k.lanes.flatMap((O) => O.markers.map((ne) => ne.segment.id)));
                  return;
                }
                u(k.key), y(k.key);
              },
              "aria-expanded": !z,
              "aria-current": le ? "true" : void 0,
              "data-selected-timeline-group": le ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: k.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: ie
              },
              title: `${z ? "Expand" : "Collapse"} ${k.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, z ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, k.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              z ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${k.lanes.length} swimlane${k.lanes.length === 1 ? "" : "s"} hidden`
                ),
                H ? n(Tt, { key: "states", counts: k.counts }) : null
              ] : null
            )
          ]);
          const te = S.lane, ve = Qs(S.laneIndex), _ = te.markers.some(({ segment: V }) => V.id === s);
          return n("div", {
            key: S.key,
            "data-grouped-swimlane": k.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${G}rem minmax(0,1fr)`,
              top: S.top,
              height: S.height,
              backgroundColor: ve
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": _ ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: Xs(_, ve),
              title: `${$n(te)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": $n(te),
              onClick: (V) => {
                (V.metaKey || V.ctrlKey) && b(te.markers.map((O) => O.segment.id));
              },
              onMouseEnter: () => T(te.key),
              onMouseLeave: () => T((V) => V === te.key ? null : V)
            }, [
              te.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (V) => {
                  V.stopPropagation(), w({ tagId: te.tagId, tagName: te.label, trigger: V.currentTarget });
                },
                "aria-label": `Configure ${te.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: J === te.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, te.label),
              (ee = te.performers) != null && ee.length ? n(or, {
                key: "performers",
                performers: te.performers,
                performerAssignments: te.performerAssignments
              }) : null,
              H ? n(Tt, { key: "counts", counts: te.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, te.markers.map(({ segment: V, track: O }) => {
              var Ce;
              const ne = Ir(V.startSec, ue), me = V.endSec == null ? V.startSec : Math.max(V.startSec, V.endSec), be = Math.max(0, Ir(me, ue) - ne), ye = l.includes(V.id), Ee = V.id === s, Pe = Ur(L.get(V.id)), he = V.endSec == null ? we(V.startSec) : `${we(V.startSec)} – ${we(V.endSec)}`, Ie = (Ce = Ra[Pe]) == null ? void 0 : Ce.label;
              return n("button", {
                key: V.id,
                type: "button",
                onClick: (pe) => {
                  pe.stopPropagation(), p(V, {
                    additive: pe.metaKey || pe.ctrlKey,
                    rangeSegmentIds: pe.shiftKey ? te.markers.map((Ge) => Ge.segment.id) : null
                  });
                },
                "aria-pressed": ye,
                "aria-current": Ee ? "true" : void 0,
                "data-selected-timeline-marker": Ee ? "true" : void 0,
                "data-selected-segment-shortcut-target": Ee ? "true" : void 0,
                "aria-label": H ? `${V.tagName || "Tag segment"}${te.performerLabel ? `, ${te.performerLabel}` : ""}, ${V.reviewState}${Ie ? `, ${Ie}` : ""}, ${he}` : `${V.tagName || "Tag segment"}${te.performerLabel ? `, ${te.performerLabel}` : ""}, ${he}`,
                title: H ? `${V.tagName || "Tag segment"}${te.performerLabel ? ` · ${te.performerLabel}` : ""} · ${V.reviewState}${Ie ? ` · ${Ie}` : ""} · ${he}` : `${V.tagName || "Tag segment"}${te.performerLabel ? ` · ${te.performerLabel}` : ""} · ${he}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...H ? Js(V.reviewState, ye, Pe, Ee) : Ys(ye, Ee),
                  left: `${ne}%`,
                  top: `${el(O)}rem`,
                  width: Zs(V.endSec, be),
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
function Hr({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = F(null), [l, d] = F([]), [c, g] = F(null), [m, u] = F(""), [y, p] = F(!0), [b, f] = F(null), [w, v] = F(""), [C, H] = F(!1), $ = ge(null), q = ge(0);
  fe(() => {
    const J = requestAnimationFrame(() => {
      var T;
      return (T = $.current) == null ? void 0 : T.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(J);
  }, [e]), fe(() => {
    const J = new AbortController();
    return p(!0), v(""), Promise.all([
      r ? Z(`/slot-definitions/${e}`, { signal: J.signal }) : Promise.resolve(null),
      Z("/segment-groups", { signal: J.signal })
    ]).then(([T, I]) => {
      const L = I.find((re) => (re.tags || []).some((Q) => Number(Q.tagId) === Number(e)));
      s(T), d(I), g((L == null ? void 0 : L.id) ?? null), u(L == null ? "" : String(L.id)), H(!1);
    }).catch((T) => {
      T.name !== "AbortError" && v(T.message || "Unable to load tag configuration.");
    }).finally(() => {
      J.signal.aborted || p(!1);
    }), () => J.abort();
  }, [r, e]);
  function E(J, T) {
    s({
      ...a,
      definitions: a.definitions.map((I, L) => L === J ? { ...I, ...T } : I)
    });
  }
  function N(J, T) {
    const I = J + T;
    if (I < 0 || I >= a.definitions.length) return;
    const L = [...a.definitions];
    [L[J], L[I]] = [L[I], L[J]], s({
      ...a,
      definitions: L.map((re, Q) => ({ ...re, sortOrder: Q }))
    });
  }
  function M(J) {
    const T = a.definitions[J], I = Number(T.assignmentCount) || 0, L = I === 0 ? "" : ` and its ${I} assignment${I === 1 ? "" : "s"}`;
    window.confirm(`Delete “${et(T)}”${L}?`) && (I > 0 && H(!0), s({
      ...a,
      definitions: a.definitions.filter((re, Q) => Q !== J).map((re, Q) => ({ ...re, sortOrder: Q }))
    }));
  }
  async function j() {
    var T;
    f("slots"), v("Saving performer slots…");
    let J;
    try {
      J = await Z(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: C,
          definitions: a.definitions.map((I, L) => {
            var re;
            return {
              id: I.id || void 0,
              label: ((re = I.label) == null ? void 0 : re.trim()) || null,
              sortOrder: L,
              genderHints: I.genderHints || []
            };
          })
        })
      }), s(J), H(!1);
    } catch (I) {
      I.status === 409 ? (v("Performer slots changed elsewhere; current values were reloaded."), (T = I.payload) != null && T.current && (s(I.payload.current), H(!1))) : v(I.message || "Unable to save performer slots."), f(null);
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
  async function Y() {
    const J = m === "" ? null : Number(m);
    if (J !== c) {
      f("group"), v("Saving tag group…");
      try {
        await Z(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: J })
        });
      } catch (T) {
        v(T.message || "Unable to assign the tag group."), f(null);
        return;
      }
      try {
        const [T, I] = await Promise.allSettled([
          Z("/segment-groups"),
          o()
        ]);
        if (T.status === "fulfilled") {
          d(T.value);
          const L = T.value.find((Q) => (Q.tags || []).some((Ne) => Number(Ne.tagId) === Number(e))), re = (L == null ? void 0 : L.id) ?? null;
          g(re), u(re == null ? "" : String(re));
        }
        v(
          T.status === "fulfilled" && I.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        f(null);
      }
    }
  }
  l.find((J) => Number(J.id) === Number(c));
  const P = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (J) => {
      J.target === J.currentTarget && !b && i();
    },
    onKeyDownCapture: (J) => rt(J, {
      onCancel: b ? void 0 : i
    })
  }, n("section", {
    ref: $,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: xt,
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
            disabled: b != null,
            onChange: (J) => u(J.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((J) => n("option", { key: J.id, value: String(J.id) }, J.name))
          ])
        ]),
        y ? null : n("button", {
          key: "save",
          type: "button",
          disabled: b != null || (m === "" ? null : Number(m)) === c,
          onClick: Y,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, b === "group" ? "Saving…" : "Save tag group")
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
              disabled: b != null,
              onChange: (J) => s({ ...a, allowSamePerformerInMultipleSlots: J.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((J, T) => n("article", {
            key: J.id || J._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: J.label || "",
                disabled: b != null,
                onChange: (I) => E(T, { label: I.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Pi.map((I) => n("label", { key: I, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: b != null,
                  checked: (J.genderHints || []).includes(I),
                  onChange: (L) => E(T, {
                    genderHints: L.target.checked ? [.../* @__PURE__ */ new Set([...J.genderHints || [], I])] : (J.genderHints || []).filter((re) => re !== I)
                  })
                }),
                n("span", { key: "text" }, rr(I))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${J.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: b != null || T === 0, onClick: () => N(T, -1), className: P, "aria-label": `Move ${et(J)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: b != null || T === a.definitions.length - 1, onClick: () => N(T, 1), className: P, "aria-label": `Move ${et(J)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: b != null, onClick: () => M(T), className: `${P} text-red-300` }, "Delete")
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
                  _clientKey: `new-${++q.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: P
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: b != null,
              onClick: j,
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
function gd(e) {
  const { activeFilterCount: t, allSwimlanes: r, analysisError: o, analysisRun: i, analysisStatus: a, approvalFacetCounts: s, autoAssignCandidates: l, autoAssignError: d, autoAssignOpen: c, autoAssignPerformers: g, autoAssigning: m, captureTrainingExport: u, centerTimelineRef: y, closeEditorFilters: p, closeFirstSegmentTagDialog: b, closeMaterializeDialog: f, closeMergeConfirmation: w, closePublishApprovedDialog: v, closeTagEditing: C, collapsedSegmentGroups: H, compatibilityMode: $, configuringTag: q, createSegment: E, currentTime: N, deleteRejectedSegments: M, detail: j, detailPanelRef: Y, detailWidth: P, duplicateSegment: J, editorFilters: T, editorLayout: I, editorRef: L, exportingExamples: re, filtersButtonRef: Q, filtersOpen: Ne, firstSegmentTagOpen: ue, focusRowRef: A, handleSeparatorKeyDown: X, handleSeparatorPointerDown: G, handleSeparatorPointerMove: ae, hideDerivedSegments: oe, history: W, historyOpen: xe, historySaving: Ae, horizontalLayoutSize: se, importNativeSegments: Te, incorrectExamples: h, incorrectExamplesOpen: K, lineage: R, markerRailWidth: x, materializeButtonRef: D, materializeCancelButtonRef: S, materializeDerivedSegments: k, materializeError: z, materializeLoading: le, materializeOpen: ie, materializePreview: te, materializing: ve, mediaStackRef: _, mergeCancelButtonRef: ee, mergeConfirmation: V, mergeSavingRef: O, mergeSelectedSwimlane: ne, nativeImportState: me, onNavigate: be, onReload: ye, onSlotsChanged: Ee, openPublishApprovedDialog: Pe, panelSeparatorProps: he, pendingInitialSeekRef: Ie, performerSlots: Ce, performerSlotsAvailable: pe, playbackControlsRef: Ge, previewDerivedSegments: Me, provenance: ot, provenanceSources: Se, publishApprovedCancelButtonRef: De, publishApprovedDrafts: Ue, publishApprovedError: je, publishApprovedOpen: ke, quickSearchOpen: $e, railScrollRef: Ke, railToggleRef: at, recordHistoryAction: Je, rejectedDeletionPreview: We, removeIncorrectExample: It, removingExampleId: At, restoreHistoryTarget: sn, saveMessage: En, saveTag: ir, saveTiming: Rt, savingSegmentId: St, seekRef: Et, segmentGroups: Dt, segmentRailLayout: ln, segments: mt, selectAllVideoSegments: sr, selectSegment: Kt, selectSegmentCollection: Ut, selectedGroups: lr, selectedPerformerSlots: dn, selectedSegment: gt, selectedSegmentGroupKey: cn, selectedSegmentIds: Dn, selectedSegments: un, selectedSlotStatus: On, setAutoAssignError: mn, setAutoAssignOpen: Ct, setConfiguringTag: zt, setCurrentTime: Pn, setEditorFilters: dr, setEditorLayout: Ln, setFiltersOpen: cr, setHideDerivedSegments: gn, setHistoryOpen: _t, setIncorrectExamplesOpen: pn, setQuickSearchOpen: Ot, setRailViewport: ur, setRejectedDeletionPreview: Fn, setSelectedSegmentGroupKey: Ht, setSelectedSegmentId: fn, setShortcutsOpen: qt, setTimelineZoom: it, shotBoundaries: jn, shortcutsOpen: yn, slotButtonRef: Bn, splitLayout: ht, splitSegment: bn, startFullAnalysis: Wt, tagEditing: mr, tagSearchRef: gr, timelineDuration: pr, timelineRatioBounds: Vt, timelineZoom: hn, toggleSegmentGroup: Jt, toggleSegmentRail: ze, updateTimelineRatio: Ye, video: Ze, videoPerformers: Gn, visibleCounts: vt, visibleSegmentRailRows: pt, visibleSegments: Kn, wideLayout: kt, workspaceRef: vn } = e, Yt = Be(
    () => mt.filter((U) => !U.published && U.reviewState === "approved"),
    [mt]
  ), Un = Ei(Pr), xn = Yt.length, Zt = te ? te.createCount + te.linkCount : null;
  function fr(U) {
    const Fe = Dn.includes(U.id), lt = U.id === (gt == null ? void 0 : gt.id), dt = U.endSec == null ? we(U.startSec) : `${we(U.startSec)} – ${we(U.endSec)}`, Xt = `${bt(U.sourceKey)}${U.confidence != null ? ` · ${Math.round(U.confidence * 100)}%` : ""}`;
    return n("button", {
      key: U.id,
      type: "button",
      onClick: (Ve) => Kt(U, { additive: Ve.metaKey || Ve.ctrlKey }),
      "aria-pressed": Fe,
      "aria-current": lt ? "true" : void 0,
      "data-selected-segment-shortcut-target": lt ? "true" : void 0,
      "aria-label": $ ? `${U.tagName || "Tag segment"}, ${U.reviewState}${U.isDerived ? ", derived segment" : ""}, ${dt}` : `${U.tagName || "Tag segment"}${U.isDerived ? ", derived segment" : ""}, ${dt}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: Aa(Fe, lt)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        $ ? n(Gt, { key: "review", state: U.reviewState, includeLabel: !1 }) : null,
        U.isDerived ? n(ar, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          U.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, dt),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: Xt
        }, Xt)
      ])
    ]);
  }
  const Qt = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", st = [...W.actions || []].reverse().find((U) => U.sequence <= W.cursorSequence);
  return n("section", {
    ref: L,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${ht ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (U) => Ga(U, be, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${Ze.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: Ze.title || `Video ${Ze.id}`
          }, Ze.title || `Video ${Ze.id}`)),
          ...Gn.map((U) => n(Tn, {
            key: qe(U),
            performer: { id: qe(U), name: U.name },
            compact: !0,
            tooltip: U.name
          })),
          $ ? n(Tt, { key: "review-counts", counts: vt }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          $ ? null : n(Ua, { key: "bin", onNavigate: be, compact: !0 }),
          n(za, { key: "settings", onNavigate: be, compact: !0 })
        ])
      ]),
      $ && j.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${j.nativeImportCount} Cove segment${j.nativeImportCount === 1 ? "" : "s"} ${j.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        me.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, me.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => Te("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => Te("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        me.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, me.error) : null
      ]) : null,
      o && (a == null ? void 0 : a.configured) !== !1 ? n("div", {
        key: "analysis-error",
        role: "alert",
        className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300"
      }, o) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          $ ? n("div", {
            key: "full-analysis",
            className: "inline-flex items-stretch"
          }, [
            n("button", {
              key: "run",
              type: "button",
              disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
              onClick: () => Wt(),
              title: (a == null ? void 0 : a.error) || "Run AI tagging and shot boundary analysis into the Full review workflow",
              className: "segment-studio-full-scan-run inline-flex items-center justify-center bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
            }, (a == null ? void 0 : a.configured) === !1 ? "Full Scan not configured" : (a == null ? void 0 : a.ready) === !1 ? "Full Scan unavailable" : (i == null ? void 0 : i.status) === "queued" ? "Full Scan queued…" : (i == null ? void 0 : i.status) === "running" ? "Full Scan running…" : "Full Scan"),
            n("details", { key: "choices", className: "relative flex" }, [
              n("summary", {
                key: "summary",
                "aria-label": "Choose Full Scan analyses",
                "aria-disabled": (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                title: "Choose analyses",
                onClick: (U) => {
                  ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && U.preventDefault();
                },
                onKeyDown: (U) => {
                  (U.key === "Enter" || U.key === " ") && ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && U.preventDefault();
                },
                className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${(a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running" ? "pointer-events-none cursor-default opacity-50" : "cursor-pointer hover:opacity-90"}`
              }, n(Di, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([U, Fe]) => n("button", {
                key: U,
                type: "button",
                disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                onClick: (lt) => {
                  var dt;
                  (dt = lt.currentTarget.closest("details")) == null || dt.removeAttribute("open"), Wt(Fe);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, U)))
            ])
          ]) : null,
          $ ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: St != null || l.length === 0,
            onClick: () => {
              mn(""), Ct(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${l.length ? ` (${l.length})` : ""}`) : null,
          $ ? n("button", {
            key: "materialize-derived",
            ref: D,
            type: "button",
            disabled: St != null || le || ve || Zt === 0,
            onClick: Me,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, le ? "Analyzing…" : `Auto-Materialize${Zt != null ? ` (${Zt})` : ""}`) : null,
          $ ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: St != null || xn === 0,
            onClick: (U) => Pe(U.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": ke,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${xn ? ` (${xn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: re || At != null || h.length === 0,
            onClick: () => pn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": K,
            "aria-label": `Open AI feedback collection, ${h.length} example${h.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${h.length ? ` (${h.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: Q,
            type: "button",
            onClick: () => cr(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": Ne,
            className: `${Qt} ${t ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(Wn, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${t ? ` (${t})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => qt(!0),
            className: Qt
          }, [n(Wn, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: ($ ? W.actions.length === 0 : st == null) || St != null || Ae,
            onClick: $ ? () => _t((U) => !U) : () => sn(
              st.sequence - 1
            ),
            "aria-haspopup": $ ? "dialog" : void 0,
            "aria-expanded": $ ? xe : void 0,
            className: Qt
          }, [
            n(Wn, { key: "icon", name: "history" }),
            n("span", { key: "label" }, $ ? `History${W.actions.length ? ` (${W.actions.length})` : ""}` : st ? `Undo ${st.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: at,
            type: "button",
            onClick: ze,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": I.markerRailOpen,
            className: Qt
          }, [
            n(Wn, { key: "icon", name: "list" }),
            n("span", { key: "label" }, I.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    $ && xe ? n("section", {
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
          onClick: () => _t(!1),
          className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
        }, "Close")
      ]),
      n("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
        ...[...W.actions].reverse().map((U) => n("button", {
          key: U.sequence,
          type: "button",
          disabled: Ae,
          onClick: () => sn(U.sequence),
          "aria-current": W.cursorSequence === U.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${U.sequence > W.cursorSequence ? "text-secondary" : "text-foreground"} ${W.cursorSequence === U.sequence ? "bg-accent/15" : ""}`
        }, [
          n("span", { key: "label", className: "min-w-0 flex-1 truncate" }, U.label),
          n("time", {
            key: "time",
            dateTime: U.createdAt,
            className: "shrink-0 text-[10px] text-secondary"
          }, new Date(U.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        ])),
        n("button", {
          key: "baseline",
          type: "button",
          disabled: Ae,
          onClick: () => sn(W.baselineSequence),
          "aria-current": W.cursorSequence === W.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${W.cursorSequence === W.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    Ne ? n(ed, {
      key: "editor-filters",
      filters: T,
      hideDerivedSegments: oe,
      performers: Gn,
      provenanceSources: Se,
      reviewCounts: s,
      segments: mt,
      segmentGroups: Dt,
      reviewMode: $,
      onChange: dr,
      onHideDerivedChange: gn,
      onClose: p
    }) : null,
    ue ? n(Xl, {
      key: "first-segment-tag-dialog",
      saving: St != null,
      error: En,
      onSelect: (U, Fe) => E(U, Fe),
      onClose: b
    }) : null,
    $e ? n(rd, {
      key: "quick-search-dialog",
      segments: Ks(r),
      onSelect: (U) => {
        Ot(!1), Kt(U, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        Ot(!1), requestAnimationFrame(() => {
          var U;
          return (U = L.current) == null ? void 0 : U.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    c ? n(id, {
      key: "auto-assign-dialog",
      candidates: l,
      processing: m,
      error: d,
      onConfirm: g,
      onClose: () => Ct(!1)
    }) : null,
    V ? n(ld, {
      key: "merge-selection-dialog",
      merge: V,
      processing: O.current,
      undoable: !$,
      cancelButtonRef: ee,
      onConfirm: (U) => ne(!0, U, V),
      onClose: w
    }) : null,
    ie ? n(cd, {
      key: "materialize-derived-dialog",
      preview: te,
      loading: le,
      processing: ve,
      error: z,
      cancelButtonRef: S,
      onConfirm: k,
      onClose: () => {
        ve || f();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: vn,
      className: `${ht ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      I.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: kt ? { position: "absolute", top: 0, right: 0, width: x, height: se.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        mt.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : Kn.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: Ke,
          onScroll: (U) => ur({
            scrollTop: U.currentTarget.scrollTop,
            height: U.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: ln.height }
        }, pt.map((U) => {
          var lt;
          let Fe;
          if (U.kind === "group") {
            const dt = H.includes(U.group.key), Xt = U.group.lanes.reduce((Ve, de) => Ve + de.markers.length, 0);
            Fe = n("button", {
              type: "button",
              onClick: () => {
                Ht(U.group.key), Jt(U.group.key);
              },
              "aria-expanded": !dt,
              "aria-current": cn === U.group.key ? "true" : void 0,
              "data-segment-rail-group": U.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${cn === U.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, dt ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: U.group.name }, U.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Xt),
              $ && dt ? n(Tt, { key: "states", counts: U.group.counts }) : null
            ]);
          } else U.kind === "lane" ? Fe = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: $n(U.lane),
            "aria-label": $n(U.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, U.lane.label),
            (lt = U.lane.performers) != null && lt.length ? n(or, {
              key: "performers",
              performers: U.lane.performers,
              performerAssignments: U.lane.performerAssignments
            }) : null,
            $ ? n(Tt, { key: "states", counts: U.lane.counts }) : null
          ]) : Fe = fr(U.segment);
          return n("div", {
            key: U.key,
            className: "absolute left-0 right-0",
            style: { top: U.top, height: U.height }
          }, Fe);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${ht ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: _,
          className: `${ht ? "min-h-0 flex-1" : ""} grid`,
          style: ht ? {
            gridTemplateRows: `minmax(16rem, ${(1 - I.timelineRatio) * 100}fr) 0.5rem minmax(14rem, ${I.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: A,
            className: "grid min-h-0 gap-2",
            style: kt ? {
              gridTemplateColumns: I.markerRailOpen ? `${P}px 0.5rem minmax(0,1fr) 0.5rem ${x}px` : `${P}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(ud, {
              key: "tools",
              compatibilityMode: $,
              selectedSegment: gt,
              selectedSegments: un,
              selectedGroups: lr,
              saveMessage: En,
              savingSegmentId: St,
              saveTag: ir,
              slotStatus: On,
              performerSlotsAvailable: pe,
              selectedPerformerSlots: dn,
              performerSlots: Ce,
              detail: j,
              video: Ze,
              slotButtonRef: Bn,
              tagSearchRef: gr,
              tagEditing: mr,
              onCancelTagEditing: C,
              detailPanelRef: Y,
              onReduceSelection: (U) => {
                Kt(U), requestAnimationFrame(() => {
                  var Fe;
                  return (Fe = Y.current) == null ? void 0 : Fe.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Rt,
              onSlotsChanged: Ee,
              onRecordHistory: Je,
              splitSegment: bn,
              duplicateSegment: J,
              provenance: ot,
              lineage: R,
              onNavigateLineageItem: (U) => {
                const Fe = mt.find((lt) => lt.itemId === U);
                Fe && fn(Fe.id);
              }
            }),
            kt ? n(
              "div",
              { key: "detail-separator", ...he("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Ze.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Zo, {
                streamUrl: `/api/stream/video/${Ze.id}`,
                posterUrl: `/api/stream/video/${Ze.id}/screenshot?v=${encodeURIComponent(Ze.updatedAt || "")}`,
                format: Ze.videoFile.format,
                audioCodec: Ze.videoFile.audioCodec,
                duration: Ze.videoFile.duration,
                videoId: Ze.id,
                trackingEnabled: !1,
                onSeekRegister: (U) => {
                  Et.current = U, Fs(Ie.current, mt, U) && (Ie.current = null);
                },
                onPlaybackControlRegister: (U) => {
                  Ge.current = U;
                },
                onTimeUpdate: Pn
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            kt && I.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...he("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            kt && I.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          ht ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(Vt.minimum * 100),
            "aria-valuemax": Math.round(Vt.maximum * 100),
            "aria-valuenow": Math.round(I.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(I.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: G,
            onPointerMove: ae,
            onKeyDown: X,
            onDoubleClick: () => Ye(nt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: ht ? void 0 : { height: "20rem" } }, n(md, {
            segments: Kn,
            shotBoundaries: jn,
            segmentGroups: Dt,
            performerSlots: Ce,
            collapsedGroupKeys: H,
            selectedGroupKey: cn,
            selectedSegmentId: gt == null ? void 0 : gt.id,
            selectedSegmentIds: Dn,
            duration: pr,
            currentTime: N,
            zoom: hn,
            onZoomChange: it,
            onSelectGroup: Ht,
            onToggleGroup: Jt,
            onSelect: (U, Fe) => Kt(U, Fe),
            onSelectSegments: Ut,
            onSelectAll: sr,
            onConfigureTag: (U) => zt(U),
            onSeekTime: (U) => {
              var Fe;
              return (Fe = Et.current) == null ? void 0 : Fe.call(Et, U, !1);
            },
            centerRef: y,
            showReviewState: $,
            swimlaneTitleWidth: I.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (U) => Ln((Fe) => ({ ...Fe, swimlaneTitleWidth: U }))
          }))
        ])
      ])
    ]),
    q ? n(Hr, {
      key: `configure-tag:${q.tagId}`,
      tagId: q.tagId,
      tagName: q.tagName,
      performerSlotsEnabled: $,
      onSaved: ye,
      onClose: () => {
        const U = q.trigger;
        zt(null), requestAnimationFrame(() => {
          var Fe;
          U != null && U.isConnected ? U.focus({ preventScroll: !0 }) : (Fe = L.current) == null || Fe.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    ke ? n(ad, {
      key: "publish-approved-dialog",
      drafts: Yt,
      processing: St === -1,
      error: je,
      cancelButtonRef: De,
      onConfirm: Ue,
      onClose: v
    }) : null,
    We ? n(sd, {
      key: "rejected-deletion-dialog",
      preview: We,
      onConfirm: () => M(We),
      onClose: () => {
        Fn(null), requestAnimationFrame(() => {
          var U;
          return (U = L.current) == null ? void 0 : U.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    yn ? n(td, {
      key: "shortcuts-dialog",
      reviewMode: $,
      bindings: Un,
      onClose: () => qt(!1)
    }) : null,
    K ? n(nd, {
      key: "incorrect-examples-dialog",
      examples: h,
      exporting: re,
      removingExampleId: At,
      onExport: u,
      onRemove: It,
      onClose: () => pn(!1)
    }) : null
  ]);
}
function pd(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: m, setEditorFilters: u, setHideDerivedSegments: y, setSaveMessage: p, setSelectedSegmentGroupKey: b, setSelectedSegmentId: f, setSelectedSegmentIds: w } = e;
  function v(E) {
    const N = ft(t, E);
    N && m((M) => ja(M, N));
  }
  function C(E) {
    f(E), w(E == null ? [] : [E]), c.current = E, g.current = [];
  }
  function H(E, {
    focusEditor: N = !1,
    seekToSegment: M = !1,
    additive: j = !1,
    rangeSegmentIds: Y = null
  } = {}) {
    var J, T;
    const P = is({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, E.id, Y, j);
    w(P.selectedSegmentIds), f(P.activeSegmentId), c.current = P.anchorSegmentId, g.current = P.rangeBaseSegmentIds, P.activeSegmentId != null && b(ft(t, P.activeSegmentId)), v(E.id), N && ((J = r.current) == null || J.focus({ preventScroll: !0 })), M && ((T = i.current) == null || T.call(i, E.startSec, !1));
  }
  function $(E) {
    const N = os(
      d,
      l,
      E
    );
    w(N.selectedSegmentIds), f(N.activeSegmentId), c.current = N.activeSegmentId, g.current = [], N.activeSegmentId != null && (b(ft(t, N.activeSegmentId)), v(N.activeSegmentId));
  }
  function q() {
    var M;
    const E = ls(s), N = E.includes(l) ? l : E[0] ?? null;
    u(ut({})), y(!1), w(E), f(N), c.current = N, g.current = [], N != null && b(ft(
      jt(s, a, o),
      N
    )), p(E.length === 0 ? "There are no segments to select." : `${E.length} segments selected. Collapsed Segment groups keep their selected segments.`), (M = r.current) == null || M.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: v, replaceSegmentSelection: C, selectSegment: H, selectSegmentCollection: $, selectAllVideoSegments: q };
}
function fd(e) {
  const { acceptHistory: t, compatibilityMode: r, detail: o, detailPanelRef: i, historyRef: a, mergeSavingRef: s, onConflict: l, onDetailChange: d, onReload: c, recordHistoryAction: g, revealSegmentGroupForSelection: m, reviewSavingRef: u, savingSegmentId: y, selectedGroups: p, selectedSegment: b, selectedSegmentIdRef: f, selectedSegments: w, selectionAnchorIdRef: v, selectionRangeBaseIdsRef: C, setMergeConfirmation: H, setSaveMessage: $, setSavingSegmentId: q, setSelectedSegmentId: E, setSelectedSegmentIds: N, video: M } = e;
  function j() {
    H(null), requestAnimationFrame(() => {
      var J;
      return (J = i.current) == null ? void 0 : J.focus({ preventScroll: !0 });
    });
  }
  async function Y(J = !1, T = !1, I = null) {
    if (s.current || y != null) return;
    const L = I || La(
      p,
      { nativeOnly: !r }
    );
    if (!L) {
      $("Select at least two segments from one swimlane.");
      return;
    }
    if (!J && ma()) {
      H(L);
      return;
    }
    T && ga(!1), j();
    const re = L.endSec == null ? "open end" : we(L.endSec);
    s.current = !0;
    let Q = L.segments[0];
    const Ne = r ? null : ct(L.segments, !1), ue = r ? null : crypto.randomUUID(), A = L.segments.map((G) => G.id), X = Al(o, L.segments);
    q(Q.id), d(X, M.id), N([Q.id]), E(Q.id), v.current = Q.id, C.current = [];
    try {
      const G = L.segments.slice(1);
      if (!r || Q.nativeSegmentId != null) {
        const ae = G.map((W) => {
          const xe = `merge-native-selection:${M.id}:${Q.id}:${W.id}:${Q.updatedAt}:${W.updatedAt}`;
          return { key: xe, operationId: Re(xe), segmentId: W.id, expectedUpdatedAt: W.updatedAt };
        }), oe = await Z(`/videos/${M.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: Q.id,
            expectedSurvivorUpdatedAt: Q.updatedAt,
            consumedSegments: ae.map(({ key: W, ...xe }) => xe),
            historyReceiptId: ue
          })
        });
        Q = oe.survivor, d(Oo(o, oe), M.id), ae.forEach(({ key: W }) => Oe(W));
      } else {
        const ae = G.map((W) => {
          const xe = `merge-draft-selection:${M.id}:${Q.itemId}:${W.itemId}:${Q.revision}:${W.revision}`;
          return { key: xe, operationId: Re(xe), itemId: W.itemId, expectedRevision: W.revision };
        }), oe = await Z(`/videos/${M.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: Q.itemId,
            expectedSurvivorRevision: Q.revision,
            consumedDrafts: ae.map(({ key: W, ...xe }) => xe)
          })
        });
        Q = oe.survivor, d(Oo(o, oe), M.id), ae.forEach(({ key: W }) => Oe(W));
      }
      N([Q.id]), E(Q.id), v.current = Q.id, C.current = [], r ? t(wt) : await g(
        "segments.merge",
        `Merged ${L.segments.length} segments`,
        Ne,
        ct([Q], !1),
        ue
      ), m(Q.id), $(`${L.segments.length} segments merged into ${we(L.startSec)} – ${re}.`);
    } catch (G) {
      d((ae) => Ba(
        Mn(ae, [L.segments[0]], [
          "startSec",
          "endSec",
          "sourceKey",
          "sourceRunId",
          "confidence",
          "isDerived"
        ]),
        L.segments.slice(1)
      ), M.id), N(A), E((b == null ? void 0 : b.id) ?? A[0] ?? null), v.current = (b == null ? void 0 : b.id) ?? A[0] ?? null, C.current = [], G.status === 409 ? await l() : $(G.message || "Unable to merge selected segments.");
    } finally {
      s.current = !1, q(null);
    }
  }
  async function P(J) {
    var ue;
    if (w.length === 0 || u.current || y != null) return;
    const T = Ss(w, J), I = w.filter((A) => A.reviewState !== T);
    if (I.length === 0) return;
    const L = w.map((A) => ({
      id: A.id,
      itemId: A.itemId,
      nativeSegmentId: A.nativeSegmentId
    })), re = L.find((A) => A.id === (b == null ? void 0 : b.id)) || L[0], Q = (A, X = !1) => {
      if (!(A != null && A.segments) || !X && !Tr(f.current, re.id))
        return;
      const G = L.map((oe) => He(A == null ? void 0 : A.segments, oe)).filter(Boolean), ae = He(A == null ? void 0 : A.segments, re) || G[0] || null;
      N(G.map((oe) => oe.id)), E((ae == null ? void 0 : ae.id) ?? null), v.current = (ae == null ? void 0 : ae.id) ?? null, C.current = [];
    };
    u.current = !0, q((b == null ? void 0 : b.id) ?? I[0].id), $(`Updating ${I.length} selected segment${I.length === 1 ? "" : "s"}…`);
    const Ne = tr(
      o,
      I.map((A) => A.id),
      { reviewState: T }
    );
    d(Ne, M.id);
    try {
      const A = await Z(`/videos/${M.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: a.current.revision,
          reviewState: T,
          segments: w.map((oe) => oe.published ? {
            nativeSegmentId: oe.nativeSegmentId,
            expectedUpdatedAt: oe.updatedAt
          } : {
            itemId: oe.itemId,
            expectedRevision: oe.revision
          })
        })
      }), X = new Map((A.items || []).map((oe) => [
        oe.requestedNativeSegmentId != null ? `native:${oe.requestedNativeSegmentId}` : `item:${oe.requestedItemId}`,
        oe
      ]));
      if (L.forEach((oe) => {
        const W = X.get(oe.nativeSegmentId != null ? `native:${oe.nativeSegmentId}` : `item:${oe.itemId}`);
        W && (oe.nativeSegmentId = W.nativeSegmentId, oe.itemId = W.itemId);
      }), A.history && t(A.history), T === "rejected" || (A.items || []).some((oe) => oe.requestedNativeSegmentId != null && oe.nativeSegmentId !== oe.requestedNativeSegmentId)) {
        Q(await c()), $(`${A.updatedCount} selected segment${A.updatedCount === 1 ? "" : "s"} ${T === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const ae = {
        ...o,
        approvedSetVersion: A.approvedSetVersion || o.approvedSetVersion,
        segments: (o.segments || []).map((oe) => {
          const W = X.get(oe.nativeSegmentId != null ? `native:${oe.nativeSegmentId}` : `item:${oe.itemId}`);
          return W ? {
            ...oe,
            id: W.nativeSegmentId != null ? W.nativeSegmentId : -W.itemId,
            itemId: W.itemId,
            nativeSegmentId: W.nativeSegmentId,
            published: W.nativeSegmentId != null,
            reviewState: T,
            revision: W.nativeSegmentId != null ? oe.revision : W.revision,
            updatedAt: W.updatedAt
          } : oe;
        })
      };
      d(ae, M.id), Q(ae), $(`${A.updatedCount} selected segment${A.updatedCount === 1 ? "" : "s"} ${T === "approved" ? "approved" : T === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (A) {
      d((G) => Mn(
        G,
        I,
        ["reviewState"]
      ), M.id), A.status === 409 && ((ue = A.payload) != null && ue.currentHistory) && t(A.payload.currentHistory);
      const X = A.status === 409 ? await l() : o;
      Q(X, !0), $(A.message || "Unable to update the selected segments.");
    } finally {
      u.current = !1, q(null);
    }
  }
  return { closeMergeConfirmation: j, mergeSelectedSwimlane: Y, saveSelectedReviewState: P };
}
function yd(e) {
  const { acceptHistory: t, allSwimlanes: r, autoAssignCandidates: o, autoAssigning: i, binEmptyingRef: a, canMoveSelectionToBin: s, closeTagEditing: l, compatibilityMode: d, detail: c, editorRef: g, exportingExamples: m, incorrectExamples: u, lineage: y, materializeButtonRef: p, materializePreview: b, materializeRestoreFocusRef: f, materializing: w, mutateSegment: v, onConflict: C, onDetailChange: H, onReload: $, recordHistoryAction: q, refreshMaterializationPreview: E, removingExampleId: N, revealSegmentGroupForSelection: M, savingSegmentId: j, segments: Y, selectedSegment: P, selectedSegmentIdRef: J, selectedSegments: T, selectionAnchorIdRef: I, selectionRangeBaseIdsRef: L, setAutoAssignError: re, setAutoAssignOpen: Q, setAutoAssigning: Ne, setExportingExamples: ue, setIncorrectExamples: A, setMaterializeError: X, setMaterializeLoading: G, setMaterializeOpen: ae, setMaterializePreview: oe, setMaterializing: W, setRejectedDeletionPreview: xe, setRemovingExampleId: Ae, setSaveMessage: se, setSavingSegmentId: Te, setSelectedSegmentGroupKey: h, setSelectedSegmentId: K, setSelectedSegmentIds: R, video: x } = e;
  async function D() {
    var he, Ie, Ce;
    if (T.length === 0 || !P || j != null) return;
    const O = Nl(T, u), ne = O.segments;
    if (ne.length === 0) return;
    const me = T.map((pe) => ({
      id: pe.id,
      itemId: pe.itemId,
      nativeSegmentId: pe.nativeSegmentId
    })), be = me.find((pe) => pe.id === P.id) || me[0], ye = [], Ee = [];
    let Pe = c;
    Te(be.id), se(O.action === "remove" ? `Removing ${ne.length} selected incorrect example${ne.length === 1 ? "" : "s"}…` : `Collecting ${ne.length} selected segment${ne.length === 1 ? "" : "s"} as incorrect AI feedback…`);
    try {
      const pe = async (ke, $e) => {
        const Ke = ke.nativeSegmentId != null, at = O.action === "remove" ? `incorrect-example-remove:${x.id}:${$e == null ? void 0 : $e.id}:${$e == null ? void 0 : $e.revision}:${$e == null ? void 0 : $e.representationRevision}` : `incorrect-example-collect:${x.id}:${Ke ? `native:${ke.nativeSegmentId}:${ke.updatedAt}` : `item:${ke.itemId}:${ke.revision}`}`;
        if (O.action === "remove" && !$e)
          throw new Error("The incorrect-example collection changed. Reload and try again.");
        let Je;
        try {
          Je = O.action === "remove" ? await Z(
            `/videos/${x.id}/incorrect-examples/${$e.id}/remove`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Re(at),
                expectedExampleRevision: $e.revision,
                expectedRepresentationRevision: $e.representationRevision
              })
            }
          ) : await Z(`/videos/${x.id}/incorrect-examples/collect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Re(at),
              nativeSegmentId: Ke ? ke.nativeSegmentId : null,
              itemId: Ke ? null : ke.itemId,
              expectedUpdatedAt: Ke ? ke.updatedAt : null,
              expectedRevision: Ke ? null : ke.revision
            })
          });
        } catch (We) {
          throw We.operationKey = at, We;
        }
        if (!Il(O.action, Je))
          throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
        return Oe(at), Je;
      };
      for (const ke of ne) {
        const $e = O.action === "remove" ? u.find((Ke) => Ke.itemId != null && Ke.itemId === ke.itemId) : null;
        try {
          const Ke = me.find((We) => We.id === ke.id);
          let at = He(
            Pe == null ? void 0 : Pe.segments,
            Ke
          ) || ke, Je;
          try {
            Je = await pe(at, $e);
          } catch (We) {
            if (We.status === 409 && ((Ie = (he = We.payload) == null ? void 0 : he.result) == null ? void 0 : Ie.code) === "OPERATION_REPLAYED")
              Pe = await Z(
                `/videos/${x.id}/editor`
              ), Oe(We.operationKey), Je = We.payload.result;
            else {
              if (O.action !== "collect" || We.status !== 409) throw We;
              const It = await Z(
                `/videos/${x.id}/editor`
              );
              Pe = It;
              const At = He(
                It == null ? void 0 : It.segments,
                Ke
              );
              if (!At) throw We;
              at = At, Je = await pe(at, null);
            }
          }
          Ke && Je.itemId != null && (Ke.itemId = Je.itemId), Pe = Lo(
            Pe,
            Je.editorDelta
          ), ye.push({ segment: ke, result: Je });
        } catch (Ke) {
          if (Ee.push(Ke), ![400, 404, 409].includes(Ke.status)) break;
        }
      }
      ye.some(({ result: ke }) => ke.representation === "basicNativeBin") && Nn();
      const Ge = Tr(
        J.current,
        be.id
      ), Me = O.action === "collect" && ye.some(({ segment: ke }) => ke.id === be.id), ot = ye.map(({ segment: ke }) => ke.id), Se = Me ? cs(
        r,
        ot,
        be.id
      ) : null, De = Me ? (Se == null ? void 0 : Se.id) ?? null : be.id;
      Ge && Me && (R(Se ? [Se.id] : []), K((Se == null ? void 0 : Se.id) ?? Qn), I.current = (Se == null ? void 0 : Se.id) ?? null, L.current = []);
      const Ue = await Z(`/videos/${x.id}/incorrect-examples`);
      A(Ue);
      const je = Pe;
      if (H(je, x.id), Ge && Tr(
        J.current,
        De
      )) {
        let ke, $e;
        Me ? ($e = Se ? He(je == null ? void 0 : je.segments, {
          id: Se.id,
          itemId: Se.itemId,
          nativeSegmentId: Se.nativeSegmentId
        }) : null, ke = $e ? [$e] : []) : (ke = me.map((Ke) => He(je == null ? void 0 : je.segments, Ke)).filter(Boolean), $e = He(je == null ? void 0 : je.segments, be) || ke[0] || null), R(ke.map((Ke) => Ke.id)), K(($e == null ? void 0 : $e.id) ?? (Me ? Qn : null)), I.current = ($e == null ? void 0 : $e.id) ?? null, L.current = [], h($e ? ft(r, $e.id) : null), $e && M($e.id);
      }
      if (Ee.length > 0) {
        const ke = ((Ce = Ee[0]) == null ? void 0 : Ce.message) || "Only segments with registered AI provenance can be collected.";
        ye.length === 0 ? se(ke) : O.action === "remove" ? se(
          `Partially removed ${ye.length} of ${ne.length} selected incorrect examples. ${ke}`
        ) : se(
          `Partially collected ${ye.length} of ${ne.length} selected segments. ${ke}`
        );
      } else if (O.action === "remove")
        se(
          `${ye.length} incorrect example${ye.length === 1 ? "" : "s"} removed and ${ye.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
        );
      else {
        const ke = ye.filter(({ result: $e }) => $e.representation === "basicNativeBin").length;
        se(ke === ye.length ? `${ye.length} incorrect AI example${ye.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ye.length} incorrect AI example${ye.length === 1 ? "" : "s"} collected and ${ye.length === 1 ? "segment rejected" : "segments rejected"}.`);
      }
    } catch (pe) {
      se(pe.message || "Unable to update the selected incorrect examples.");
    } finally {
      Te(null);
    }
  }
  async function S(O) {
    var me, be;
    if (!O || N != null || m) return;
    Ae(O.id);
    const ne = `incorrect-example-remove:${x.id}:${O.id}:${O.revision}:${O.representationRevision}`;
    try {
      const ye = await Z(
        `/videos/${x.id}/incorrect-examples/${O.id}/remove`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(ne),
            expectedExampleRevision: O.revision,
            expectedRepresentationRevision: O.representationRevision
          })
        }
      );
      Oe(ne);
      const Ee = await Z(
        `/videos/${x.id}/incorrect-examples`
      );
      A(Ee), H(
        Lo(c, ye.editorDelta),
        x.id
      ), O.representation === "basicNativeBin" && Nn(), se(O.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed.");
    } catch (ye) {
      if (ye.status === 409 && ((be = (me = ye.payload) == null ? void 0 : me.result) == null ? void 0 : be.code) === "OPERATION_REPLAYED") {
        Oe(ne), A(await Z(
          `/videos/${x.id}/incorrect-examples`
        )), await $(), se("Incorrect example removal was already applied.");
        return;
      }
      ye.status === 409 && await C(), se(ye.message || "Unable to remove the incorrect example.");
    } finally {
      Ae(null);
    }
  }
  async function k() {
    if (m || N != null || u.length === 0) return;
    ue(!0);
    const O = `incorrect-example-export:${x.id}:${u.map((ne) => `${ne.id}:${ne.revision}:${ne.representationRevision}`).join(",")}`;
    try {
      const ne = await $l(
        x.id,
        u
      ), me = new FormData();
      me.append("metadata", JSON.stringify({
        operationId: Re(O),
        examples: ne.captures
      }));
      for (const Ie of ne.files)
        me.append(Ie.fieldName, Ie.file);
      const be = await Z(
        `/videos/${x.id}/incorrect-examples/export`,
        { method: "POST", body: me }
      ), ye = await Hs(be.downloadUrl), Ee = URL.createObjectURL(ye.blob), Pe = document.createElement("a");
      Pe.href = Ee, Pe.download = ye.fileName, Pe.click(), setTimeout(() => URL.revokeObjectURL(Ee), 1e3);
      const he = await Z(
        `/training-exports/${be.id}/complete`,
        { method: "POST" }
      );
      Oe(O), A(await Z(
        `/videos/${x.id}/incorrect-examples`
      )), se(
        `Downloaded ${be.exampleCount} incorrect example${be.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${he.clearedExampleCount} from the working collection.`
      );
    } catch (ne) {
      se(ne.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      ue(!1);
    }
  }
  async function z(O = null) {
    const ne = Y.filter((Ce) => Ce.reviewState === "rejected"), me = ne.length, be = u.some((Ce) => Ce.representation === "fullItem");
    if (O == null && me === 0 && !be) {
      se("There are no rejected segments to delete.");
      return;
    }
    if (O == null) {
      Te(-1), se("Preparing deletion summary…");
      try {
        const Ce = await Z(`/videos/${x.id}/rejected/deletion/preview`, { method: "POST" }), pe = Number(Ce.deletedSegmentCount) || 0, Ge = Number(Ce.deferredRejectedSegmentCount) || 0, Me = Number(Ce.protectedIncorrectExampleCount) || 0;
        if (pe === 0) {
          Ge > 0 ? se(
            `${Ge} feedback-protected rejected segment${Ge === 1 ? "" : "s"} kept. ${Me} AI feedback example${Me === 1 ? "" : "s"} must be exported before ${Ge === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : se("There are no rejected segments to delete.");
          return;
        }
        if (!Ca(Ce, se)) return;
        xe(Ce), se("");
      } catch (Ce) {
        se(Ce.message || "Unable to prepare rejected segment deletion.");
      } finally {
        Te(null);
      }
      return;
    }
    const ye = O, Ee = Number(ye.deferredRejectedSegmentCount) || 0, Pe = J.current, he = Ee === 0 ? Er(c, ne.map((Ce) => Ce.id)) : c, Ie = he.segments.find((Ce) => Ce.reviewState === "unreviewed") || he.segments[0] || null;
    xe(null), Te(-1), se("Deleting rejected segments…"), Ee === 0 && (H(he, x.id), R(Ie ? [Ie.id] : []), K((Ie == null ? void 0 : Ie.id) ?? null), I.current = (Ie == null ? void 0 : Ie.id) ?? null, L.current = []);
    try {
      const Ce = `rejected-dependency-delete:${x.id}:${ye.fingerprint}`, pe = await Z(`/videos/${x.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(Ce),
          fingerprint: ye.fingerprint
        })
      });
      Oe(Ce), await $(), pe.deletedSegmentCount > 0 && t(wt);
      const Ge = Ee > 0 ? ` ${Ee} feedback-protected rejected segment${Ee === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      se(`${pe.deletedSegmentCount} segment${pe.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Ge}`);
    } catch (Ce) {
      Ee === 0 && H((pe) => Ba(
        pe,
        ne
      ), x.id), R(Pe == null ? [] : [Pe]), K(Pe), I.current = Pe, L.current = [], se(Ce.message || "Unable to delete rejected segments.");
    } finally {
      Te(null);
    }
  }
  async function le(O = o) {
    if (!(i || O.length === 0)) {
      Ne(!0), re("");
      try {
        const ne = await Z(`/videos/${x.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: O.flatMap((me) => me.nativeSegmentId == null ? [] : [me.nativeSegmentId]),
            itemIds: O.flatMap((me) => me.published || me.itemId == null ? [] : [me.itemId])
          })
        });
        Q(!1), await $(), se(`${ne.assignedSegmentCount} segment${ne.assignedSegmentCount === 1 ? "" : "s"} received ${ne.assignedSlotCount} performer-slot assignment${ne.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (ne) {
        re(ne.message || "Unable to auto-assign performers.");
      } finally {
        Ne(!1);
      }
    }
  }
  async function ie() {
    ae(!0), X(""), !b && (G(!0), E());
  }
  function te() {
    f.current = !0, ae(!1), requestAnimationFrame(() => {
      var O;
      return (O = p.current) == null ? void 0 : O.focus({ preventScroll: !0 });
    });
  }
  async function ve() {
    if (!b || w || b.createCount + b.linkCount === 0)
      return;
    W(!0), X("");
    let O;
    try {
      const ne = `materialize-derived:${x.id}:${b.fingerprint}`;
      O = await Z(`/videos/${x.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(ne),
          fingerprint: b.fingerprint,
          maxDepth: 3
        })
      }), Oe(ne);
    } catch (ne) {
      ne.status === 409 && oe(null), X(ne.message || "Unable to materialize derived segments."), W(!1);
      return;
    }
    oe((ne) => ne && { ...ne, createCount: 0, linkCount: 0 });
    try {
      await $(), te(), oe(null);
      const ne = O.createdCount + O.linkedCount;
      se(`${O.createdCount} derived segment${O.createdCount === 1 ? "" : "s"} created and ${O.linkedCount} existing segment${O.linkedCount === 1 ? "" : "s"} linked.`), ne === 0 && se("Every applicable derivation was already materialized.");
    } catch {
      X("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    W(!1);
  }
  async function _(O, ne = null) {
    var be, ye, Ee, Pe;
    const me = {
      tagId: O,
      ...ne ? { tagName: ne } : {}
    };
    if (T.length > 1) {
      const he = T.filter((Me) => Me.tagId !== O);
      if (he.length === 0) {
        l();
        return;
      }
      const Ie = T.map((Me) => ({
        id: Me.id,
        itemId: Me.itemId,
        nativeSegmentId: Me.nativeSegmentId
      })), Ce = T.map((Me) => !d || Me.nativeSegmentId != null ? `native:${Me.nativeSegmentId}:${Me.updatedAt}` : `item:${Me.itemId}:${Me.revision}`).sort().join(","), pe = `bulk-tag:${x.id}:${O}:${Ce}`;
      Te((P == null ? void 0 : P.id) ?? he[0].id), se(`Changing tag for ${he.length} selected segment${he.length === 1 ? "" : "s"}…`);
      const Ge = tr(
        c,
        he.map((Me) => Me.id),
        me
      );
      H(Ge, x.id), l();
      try {
        const Me = d ? null : crypto.randomUUID();
        await Z(`/videos/${x.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(pe),
            tagId: O,
            historyReceiptId: Me,
            segments: T.map((je) => {
              const ke = !d || je.nativeSegmentId != null;
              return {
                nativeSegmentId: ke ? je.nativeSegmentId : null,
                itemId: ke ? null : je.itemId,
                expectedUpdatedAt: ke ? je.updatedAt : null,
                expectedRevision: ke ? null : je.revision
              };
            })
          })
        }), Oe(pe);
        const ot = ct(
          T,
          d
        ), Se = await $(), De = Ie.map((je) => He(Se == null ? void 0 : Se.segments, je)).filter(Boolean);
        await q(
          "segments.tag",
          `Changed tag for ${he.length} segment${he.length === 1 ? "" : "s"}`,
          ot,
          ct(De, d),
          Me
        );
        const Ue = Ie.map((je) => He(Se == null ? void 0 : Se.segments, je)).filter(Boolean);
        R(Ue.map((je) => je.id)), K(((be = Ue.find((je) => je.id === (P == null ? void 0 : P.id))) == null ? void 0 : be.id) ?? ((ye = Ue[0]) == null ? void 0 : ye.id) ?? null), l(), se(`${he.length} selected segment${he.length === 1 ? "" : "s"} retagged.`);
      } catch (Me) {
        H((De) => Mn(
          De,
          he,
          Object.keys(me)
        ), x.id);
        const ot = Ie.map((De) => He(c.segments, De)).filter(Boolean), Se = He(c.segments, {
          id: P == null ? void 0 : P.id,
          itemId: P == null ? void 0 : P.itemId,
          nativeSegmentId: P == null ? void 0 : P.nativeSegmentId
        }) || ot[0] || null;
        R(ot.map((De) => De.id)), K((Se == null ? void 0 : Se.id) ?? null), I.current = (Se == null ? void 0 : Se.id) ?? null, L.current = [], Me.status === 409 && await C(), se(Me.message || "Unable to change the selected segment tags.");
      } finally {
        Te(null);
      }
      return;
    }
    if (!(T.length !== 1 || !P)) {
      if (O === P.tagId) {
        l();
        return;
      }
      if (P.itemId != null && ((Pe = (Ee = y.data) == null ? void 0 : Ee.children) == null ? void 0 : Pe.length) > 0) {
        Te(P.id), se("Checking lineage impact…");
        try {
          const he = await Z(`/items/${P.itemId}/tag-change/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedRevision: P.revision, tagId: O })
          }), Ie = he.deletedItemIds.length > 0 || he.removedEdgeIds.length > 0;
          if (Ie && !window.confirm(
            `Changing this tag removes ${he.removedEdgeIds.length} lineage edge${he.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${he.deletedItemIds.length} derived segment${he.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
          )) {
            se("Tag change canceled.");
            return;
          }
          const Ce = tr(
            c,
            [P.id],
            me
          );
          H(Ce, x.id), l();
          const pe = `tag-change:${P.itemId}:${P.revision}:${he.componentFingerprint}:${O}`;
          await Z(`/items/${P.itemId}/tag-change/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Re(pe),
              expectedRevision: P.revision,
              componentFingerprint: he.componentFingerprint,
              tagId: O
            })
          }), Oe(pe), await $(), l(), se(Ie ? "Tag changed and lineage reconciled." : "Tag changed.");
        } catch (he) {
          H((Ie) => Mn(
            Ie,
            [P],
            Object.keys(me)
          ), x.id), R([P.id]), K(P.id), I.current = P.id, L.current = [], he.status === 409 ? (se("Lineage changed — loading the latest segments…"), await C()) : se(he.message || "Unable to reconcile the lineage.");
        } finally {
          Te(null);
        }
        return;
      }
      l(), await v(P, {
        startSec: P.startSec,
        endSec: P.endSec,
        tagId: O
      }, !0, null, !0, me);
    }
  }
  async function ee() {
    var Pe, he, Ie, Ce;
    if (!s || !P || j != null) return;
    const O = [...T].sort((pe, Ge) => Number(pe.nativeSegmentId ?? pe.id) - Number(Ge.nativeSegmentId ?? Ge.id)), ne = new Set(O.map((pe) => pe.id)), me = O.map((pe) => `${pe.nativeSegmentId ?? pe.id}:${pe.updatedAt}`).join("|");
    Te(P.id), se(`Moving ${O.length} segment${O.length === 1 ? "" : "s"} to recycling bin…`);
    const be = `bulk-move:${x.id}:${me}`, ye = Re(be), Ee = d ? null : crypto.randomUUID();
    try {
      const pe = (De = !1) => Z(`/videos/${x.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ye,
          segments: O.map((Ue) => ({
            segmentId: Ue.nativeSegmentId ?? Ue.id,
            expectedUpdatedAt: Ue.updatedAt
          })),
          discardMissingImage: De,
          ...d ? { reviewState: "rejected" } : {},
          historyReceiptId: Ee
        })
      });
      let Ge;
      try {
        Ge = await pe(
          Gr(be)
        );
      } catch (De) {
        if (((Pe = De.payload) == null ? void 0 : Pe.code) !== "missing-image" || !window.confirm(`${De.message}

Continue and discard the missing image reference?`)) throw De;
        Kr(be), Ge = await pe(!0);
      }
      Oe(be), Nn();
      const Me = new Map((Ge.items || []).map((De) => [
        Number(De.segmentId),
        De
      ]));
      await q(
        "segments.moveToBin",
        `Moved ${O.length} segment${O.length === 1 ? "" : "s"} to recycling bin`,
        ct(O, !1),
        ct(O.map((De) => {
          const Ue = Me.get(
            Number(De.nativeSegmentId ?? De.id)
          );
          return {
            ...De,
            recycleBinItemId: (Ue == null ? void 0 : Ue.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (Ue == null ? void 0 : Ue.revision) ?? null
          };
        }), !1),
        Ee
      );
      const ot = Y.filter((De) => !ne.has(De.id)), Se = ds(r, ne, P.id);
      H({ ...c, segments: ot }, x.id), R(Se ? [Se.id] : []), K((Se == null ? void 0 : Se.id) ?? null), I.current = (Se == null ? void 0 : Se.id) ?? null, L.current = [], Se && (h(ft(r, Se.id)), M(Se.id)), requestAnimationFrame(() => {
        var De;
        return (De = g.current) == null ? void 0 : De.focus({ preventScroll: !0 });
      }), se(`Moved ${O.length} segment${O.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (pe) {
      const Ge = ((he = pe.payload) == null ? void 0 : he.code) || ((Ce = (Ie = pe.payload) == null ? void 0 : Ie.result) == null ? void 0 : Ce.code);
      pe.status === 409 && Ge === "CANONICAL_SEGMENT_CHANGED" ? await C() : se(pe.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Te(null);
    }
  }
  async function V() {
    if (!(d || a.current || j != null)) {
      a.current = !0, se("Checking the recycling bin…");
      try {
        const O = await Z("/bin"), ne = await Ta(O, () => se("Emptying the recycling bin…"));
        if (ne.status === "empty") {
          se("The recycling bin is empty.");
          return;
        }
        if (ne.status === "canceled") {
          se("The recycling bin was not emptied.");
          return;
        }
        se(`${ne.segmentCount} segment${ne.segmentCount === 1 ? "" : "s"} from ${ne.sceneCount} scene${ne.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (O) {
        se(O.message || "Unable to empty the recycling bin.");
      } finally {
        a.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: D, removeIncorrectExample: S, captureTrainingExport: k, deleteRejectedSegments: z, autoAssignPerformers: le, previewDerivedSegments: ie, closeMaterializeDialog: te, materializeDerivedSegments: ve, saveTag: _, moveToBin: ee, emptyRecyclingBin: V };
}
function bd(e) {
  const { acceptHistory: t, compatibilityMode: r, currentTime: o, detail: i, editorLayout: a, focusRowRef: s, history: l, historyRef: d, historySaving: c, horizontalLayoutSize: g, mediaStackHeight: m, mediaStackRef: u, onDetailChange: y, onReload: p, railToggleRef: b, recordHistoryAction: f, savingSegmentId: w, savingShot: v, savingShotRef: C, setCollapsedSegmentGroups: H, setEditorLayout: $, setHistorySaving: q, setSaveMessage: E, setSavingSegmentId: N, setSavingShot: M, shotBoundaries: j, timelineDuration: Y, video: P, workspaceRef: J } = e;
  async function T(h, K, R) {
    var k, z, le, ie;
    const x = h.type === "segment" ? [h] : h.segments || [], D = (K == null ? void 0 : K.type) === "segment" ? [K] : (K == null ? void 0 : K.segments) || [];
    let S = R;
    for (const [te, ve] of x.entries()) {
      const _ = D[te], ee = ((k = ve.identity) == null ? void 0 : k.nativeSegmentId) != null || ((z = ve.identity) == null ? void 0 : z.published) === !0, V = ((le = _ == null ? void 0 : _.identity) == null ? void 0 : le.recycleBinItemId) ?? ((ie = _ == null ? void 0 : _.identity) == null ? void 0 : ie.itemId);
      let O = He(S.segments, _ == null ? void 0 : _.identity) || He(S.segments, ve.identity);
      if (!O && ee && V != null && _.identity.revision != null) {
        const be = `history-restore:${P.id}:${V}:${_.identity.revision}`;
        await Z(`/bin/${V}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(be),
            expectedRevision: _.identity.revision
          })
        }), Oe(be), S = await p(), O = S.segments.find((ye) => ye.tagId === ve.values.tagId && ye.startSec === ve.values.startSec && ye.endSec === ve.values.endSec);
      }
      if (!O)
        throw new Error("A segment in this history state no longer exists.");
      if ((O.nativeSegmentId != null || O.published === !0) !== ee) {
        if (ee) {
          const be = O.recycleBinItemId ?? O.itemId ?? V;
          if (be == null)
            throw new Error("This recycled segment can no longer be restored.");
          const ye = `history-restore:${P.id}:${be}:${O.revision}:${ve.values.reviewState ?? "native"}`;
          await Z(`/bin/${be}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Re(ye),
              expectedRevision: O.revision
            })
          }), Oe(ye);
        } else {
          const be = `history-bin:${P.id}:${O.nativeSegmentId}:${O.updatedAt}:${ve.values.reviewState}`;
          await Z(`/videos/${P.id}/segments/${O.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Re(be),
              expectedUpdatedAt: O.updatedAt,
              reviewState: ve.values.reviewState
            })
          }), Oe(be);
        }
        if (S = await p(), !ee)
          continue;
        if (O = He(S.segments, ve.identity) || S.segments.find((be) => be.tagId === ve.values.tagId && be.startSec === ve.values.startSec && be.endSec === ve.values.endSec), !O)
          throw new Error("The restored segment could not be found.");
      }
      const me = ve.values;
      if (O.nativeSegmentId == null && O.itemId != null) {
        const be = `history-draft-update:${P.id}:${O.itemId}:${O.revision}:${me.tagId}:${me.startSec}:${me.endSec ?? "open"}:${me.reviewState}`;
        await Z(`/videos/${P.id}/drafts/${O.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(be),
            expectedRevision: O.revision,
            ...me
          })
        }), Oe(be);
      } else
        await Z(`/videos/${P.id}/segments/${O.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...me, expectedUpdatedAt: O.updatedAt })
        });
      S = await p();
    }
    return S;
  }
  async function I(h, K) {
    var R;
    for (const x of h.targets || []) {
      const D = He(K.segments, x.identity);
      if (!D)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const S = (R = K.performerSlotRevisions) == null ? void 0 : R[D.id];
      await Z(D.published ? `/videos/${P.id}/segments/${D.nativeSegmentId}/slots` : `/videos/${P.id}/drafts/${D.itemId}/slots`, {
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
  async function L(h, K, R = []) {
    const x = h.state;
    if (!r && ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")) {
      const S = `basic-history:${P.id}:${d.current.revision}:${h.action.sequence}:${h.direction}`, k = await Z(`/videos/${P.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(S),
          expectedHistoryRevision: d.current.revision,
          actionSequence: h.action.sequence,
          direction: h.direction
        })
      });
      return t(k.history), R.push(S), p();
    }
    const D = h.direction === "backward" ? h.action.afterState : h.action.beforeState;
    if ((x == null ? void 0 : x.type) === "composite") {
      let S = K;
      const k = (D == null ? void 0 : D.type) === "composite" ? D.states || [] : [];
      for (const [z, le] of (x.states || []).entries()) {
        const ie = k[z];
        S = await L({
          ...h,
          state: le,
          action: {
            ...h.action,
            beforeState: h.direction === "backward" ? le : ie,
            afterState: h.direction === "backward" ? ie : le
          }
        }, S, R);
      }
      return S;
    }
    if ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")
      return T(
        x,
        D,
        K
      );
    if ((x == null ? void 0 : x.type) === "performerSlots")
      return I(x, K);
    if ((x == null ? void 0 : x.type) === "shots") {
      const S = Yn(K.shotBoundaries || []), k = await Z(`/videos/${P.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(`history-shots:${P.id}:${S}:${x.fingerprint}`),
          expectedFingerprint: S,
          boundaries: x.boundaries
        })
      });
      return { ...K, shotBoundaries: k };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function re(h) {
    var R;
    if (c || w != null || v || h === l.cursorSequence)
      return;
    const K = ol(l, h);
    if (K.length !== 0) {
      q(!0), N(-1), E(`Restoring ${K.length} history ${K.length === 1 ? "action" : "actions"}…`);
      try {
        let x = i;
        const D = [];
        for (const k of K)
          x = await L(
            k,
            x,
            D
          );
        const S = r ? await Z(`/videos/${P.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: d.current.revision,
            targetSequence: h
          })
        }) : d.current;
        D.forEach(Oe), t(S), await p(), E("History restored.");
      } catch (x) {
        x.status === 409 && ((R = x.payload) != null && R.current) && t(x.payload.current), await p(), E(x.message || "Unable to restore editor history.");
      } finally {
        N(null), q(!1);
      }
    }
  }
  function Q(h) {
    $((K) => ({ ...K, timelineRatio: jr(h, m) }));
  }
  function Ne(h) {
    var R;
    const K = (R = u.current) == null ? void 0 : R.getBoundingClientRect();
    K && Q(Vi(h.clientY, K.top, K.height));
  }
  function ue(h) {
    h.currentTarget.setPointerCapture(h.pointerId), Ne(h);
  }
  function A(h) {
    h.currentTarget.hasPointerCapture(h.pointerId) && Ne(h);
  }
  function X(h) {
    const K = h.shiftKey ? 0.1 : 0.05;
    let R = null;
    h.key === "ArrowUp" && (R = a.timelineRatio + K), h.key === "ArrowDown" && (R = a.timelineRatio - K);
    const x = Fr(m);
    h.key === "Home" && (R = x.minimum), h.key === "End" && (R = x.maximum), R != null && (h.preventDefault(), h.stopPropagation(), Q(R));
  }
  function G(h) {
    const K = h === "detailWidth" ? g.focusRow : g.workspace, R = g.workspace > 0 ? Cr(g.workspace, 600) : 560, x = Ft(a.markerRailWidth, R), D = h === "detailWidth" ? 344 + (a.markerRailOpen ? x + 24 : 0) : 600;
    return K > 0 ? Cr(K, D) : 560;
  }
  function ae(h, K) {
    $((R) => ({ ...R, [h]: Ft(K, G(h)) }));
  }
  function oe(h, K) {
    var x, D;
    const R = K === "detailWidth" ? (x = s.current) == null ? void 0 : x.getBoundingClientRect() : (D = J.current) == null ? void 0 : D.getBoundingClientRect();
    R && ae(K, K === "detailWidth" ? h.clientX - R.left : R.right - h.clientX);
  }
  function W(h, K) {
    const R = G(h), x = Ft(a[h], R);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": K,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(R),
      "aria-valuenow": Math.round(x),
      "aria-valuetext": `${Math.round(x)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (D) => {
        D.currentTarget.setPointerCapture(D.pointerId), oe(D, h);
      },
      onPointerMove: (D) => {
        D.currentTarget.hasPointerCapture(D.pointerId) && oe(D, h);
      },
      onKeyDown: (D) => {
        const S = D.shiftKey ? 40 : 16;
        let k = null;
        D.key === "ArrowLeft" && (k = h === "detailWidth" ? -S : S), D.key === "ArrowRight" && (k = h === "detailWidth" ? S : -S);
        let z = k == null ? null : x + k;
        D.key === "Home" && (z = 240), D.key === "End" && (z = R), z != null && (D.preventDefault(), D.stopPropagation(), ae(h, z));
      },
      onDoubleClick: () => ae(h, nt[h]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function xe() {
    $((h) => ({ ...h, markerRailOpen: !h.markerRailOpen })), requestAnimationFrame(() => {
      var h;
      return (h = b.current) == null ? void 0 : h.focus({ preventScroll: !0 });
    });
  }
  function Ae(h) {
    H((K) => K.includes(h) ? K.filter((R) => R !== h) : Mt([...K, h]));
  }
  async function se(h, K = !0, R = o) {
    var k;
    if (C.current) return null;
    const x = Number((k = P.videoFile) == null ? void 0 : k.duration) || Y, D = Yn(j), S = `shot-${h}:${P.id}:${R.toFixed(3)}:${x.toFixed(3)}:${D}`;
    C.current = !0, M(!0), E(h === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const z = await Z(`/videos/${P.id}/shot-boundaries/${h}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(h === "split" ? { operationId: Re(S), timeSec: R } : { operationId: Re(S), timeSec: R })
      });
      return Oe(S), y((le) => ({ ...le, shotBoundaries: z }), P.id), K && await f(
        "shots.update",
        h === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: j,
          fingerprint: D
        },
        {
          type: "shots",
          boundaries: z,
          fingerprint: Yn(z)
        }
      ), E(h === "split" ? "Shot boundary added." : "Shots merged."), z;
    } catch (z) {
      return E(z.message || "Unable to edit shot boundaries."), null;
    } finally {
      C.current = !1, M(!1);
    }
  }
  async function Te(h) {
    if (C.current) return null;
    const K = `shot-restore:${P.id}:${h.afterFingerprint}`;
    C.current = !0, M(!0), E("Undoing shot edit…");
    try {
      const R = await Z(`/videos/${P.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(K),
          expectedFingerprint: h.afterFingerprint,
          boundaries: h.before
        })
      });
      return Oe(K), y((x) => ({ ...x, shotBoundaries: R }), P.id), R;
    } catch (R) {
      return E(R.message || "Unable to undo the shot edit."), null;
    } finally {
      C.current = !1, M(!1);
    }
  }
  return { applySegmentHistoryState: T, applyPerformerSlotHistoryState: I, applyHistoryState: L, restoreHistoryTarget: re, updateTimelineRatio: Q, updateTimelineRatioFromPointer: Ne, handleSeparatorPointerDown: ue, handleSeparatorPointerMove: A, handleSeparatorKeyDown: X, panelWidthMaximum: G, updatePanelWidth: ae, handlePanelSeparatorPointer: oe, panelSeparatorProps: W, toggleSegmentRail: xe, toggleSegmentGroup: Ae, mutateShotBoundary: se, restoreShotBoundaries: Te };
}
function hd(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: m, lineage: u, mediaDuration: y, mergeSelectedSwimlane: p, moveToBin: b, mutateShotBoundary: f, openPublishApprovedDialog: w, playbackControlsRef: v, playbackShortcutConfig: C, saveSelectedReviewState: H, seekRef: $, segmentGroupKeys: q, selectSegment: E, selectedSegment: N, selectedSegmentGroupForSegment: M, selectedSegmentGroupKey: j, selectedSegments: Y, setCollapsedSegmentGroups: P, setIncorrectExamplesOpen: J, setQuickSearchOpen: T, setSaveMessage: I, setSelectedSegmentGroupKey: L, setTagEditing: re, setTimelineZoom: Q, shotBoundaries: Ne, slotButtonRef: ue, splitSegment: A, swimlanes: X, timelineDuration: G, toggleIncorrectExample: ae, toggleSegmentGroup: oe, updateTimelineRatio: W, videoFrameRate: xe, visibleSegments: Ae } = e;
  function se(h, K) {
    if (Y.length > 1 && ys(h.id))
      return;
    let R = null;
    h.id === "video.playPause" && (R = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.toggle();
    }), h.id === "video.seekSmallBackward" && (R = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(-C.smallSeekTime);
    }), h.id === "video.seekSmallForward" && (R = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(C.smallSeekTime);
    }), h.id === "video.seekMediumBackward" && (R = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(-C.mediumSeekTime);
    }), h.id === "video.seekMediumForward" && (R = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(C.mediumSeekTime);
    }), h.id === "video.seekLongBackward" && (R = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(-C.longSeekTime);
    }), h.id === "video.seekLongForward" && (R = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(C.longSeekTime);
    }), h.id === "video.playSelected" && N && (R = () => {
      var x;
      (x = $.current) == null || x.call($, N.startSec, !0), requestAnimationFrame(() => {
        var D;
        return (D = g.current) == null ? void 0 : D.focus({ preventScroll: !0 });
      });
    }), (h.id === "video.playPreviousSegment" || h.id === "video.playNextSegment") && (R = () => {
      var D;
      const x = Rr(
        X,
        N == null ? void 0 : N.id,
        h.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !x || x.id === (N == null ? void 0 : N.id) || (E(x, { focusEditor: !0, seekToSegment: !1 }), (D = $.current) == null || D.call($, x.startSec, !0));
    }), h.id.startsWith("video.seekPercent") && (R = () => {
      var D;
      const x = Number(h.id.slice(17)) / 10;
      (D = $.current) == null || D.call($, us(y ?? G, x), !1);
    }), h.id === "video.jumpToSegmentStart" && N && (R = () => {
      var x;
      return (x = $.current) == null ? void 0 : x.call($, N.startSec, !1);
    }), h.id === "video.jumpToSegmentEnd" && N && (R = () => {
      var x;
      return (x = $.current) == null ? void 0 : x.call($, N.endSec ?? N.startSec, !1);
    }), h.id === "video.jumpToVideoStart" && (R = () => {
      var x;
      return (x = $.current) == null ? void 0 : x.call($, 0, !1);
    }), h.id === "video.jumpToVideoEnd" && (R = () => {
      var x;
      return (x = $.current) == null ? void 0 : x.call($, G, !1);
    }), h.id.startsWith("video.frame") && (R = () => {
      var S, k;
      const x = h.id.includes("Small") ? "small" : h.id.includes("Medium") ? "medium" : "long", D = C[`${x}FrameStep`] * (h.id.endsWith("Backward") ? -1 : 1);
      (S = v.current) == null || S.pause(), (k = v.current) == null || k.seekBy(Cs(D, xe));
    }), h.id.startsWith("navigation.swimlane") && (R = () => {
      const x = h.id.slice(19).toLowerCase(), D = Rr(X, N == null ? void 0 : N.id, x, s);
      D && E(D, { focusEditor: !0, seekToSegment: !1 });
    }), (h.id === "navigation.extendSwimlaneLeft" || h.id === "navigation.extendSwimlaneRight") && (R = () => {
      const x = xl(
        t,
        N == null ? void 0 : N.id,
        h.id.endsWith("Left") ? "left" : "right"
      );
      x && E(x.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: x.segmentIds
      });
    }), (h.id === "navigation.segmentGroupUp" || h.id === "navigation.segmentGroupDown") && (R = () => {
      const x = Sl(
        q,
        j ?? M,
        h.id.endsWith("Up") ? -1 : 1
      );
      x && L(x);
    }), (h.id === "navigation.previousAtPlayhead" || h.id === "navigation.nextAtPlayhead") && (R = () => {
      const x = Ji(Ae, s, h.id === "navigation.previousAtPlayhead" ? -1 : 1, N == null ? void 0 : N.id);
      x && E(x, { focusEditor: !0, seekToSegment: !1 });
    }), h.id === "navigation.nearestInCurrentSwimlane" && (R = () => {
      const x = ji(
        X,
        N == null ? void 0 : N.id,
        s
      );
      x && E(x, { focusEditor: !0, seekToSegment: !1 });
    }), h.id.includes("Unreviewed") && (R = () => {
      const x = ca(
        X,
        N == null ? void 0 : N.id,
        h.id.startsWith("navigation.previous") ? -1 : 1,
        h.id.endsWith("Global")
      );
      x && E(x, { focusEditor: !0, seekToSegment: !1 });
    }), (h.id === "navigation.nextTouchingPlayhead" || h.id === "navigation.previousTouchingPlayhead") && (R = () => {
      const x = Fi(X, s, h.id === "navigation.previousTouchingPlayhead" ? -1 : 1, N == null ? void 0 : N.id);
      x && E(x, { focusEditor: !0, seekToSegment: !1 });
    }), h.id === "navigation.quickSearch" && (R = () => T(!0)), (h.id === "navigation.previousShot" || h.id === "navigation.nextShot") && (R = () => {
      var D;
      const x = Is(Ne, s, h.id === "navigation.previousShot" ? -1 : 1);
      x && ((D = $.current) == null || D.call($, x.startSec, !1));
    }), h.id === "shot.split" && (R = () => f("split")), h.id === "shot.merge" && (R = () => f("merge")), h.id === "marker.create" && (R = () => a()), h.id === "marker.duplicate" && (R = () => d(!1)), h.id === "marker.duplicateAtPlayhead" && (R = () => d(!0)), h.id === "marker.split" && (R = () => A()), h.id === "marker.editTag" && (R = () => {
      var x;
      if (Y.length > 1 && Y.some((D) => D.isDerived)) {
        I("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((x = u.data) != null && x.tagReadOnly) {
        I("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      re(!0);
    }), h.id === "marker.setStart" && N && (R = () => r(s, N.endSec)), h.id === "marker.setEnd" && N && (R = () => r(N.startSec, s)), h.id === "marker.copyTiming" && N && (R = () => {
      I(Bl(N) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), h.id === "marker.pasteTiming" && N && (R = () => {
      const x = jl();
      if (!x) {
        I("No copied segment timing is available.");
        return;
      }
      r(x.startSec, x.endSec);
    }), h.id === "marker.mergeSelection" && (R = () => p()), h.id === "marker.moveToBin" && (R = () => b()), h.id === "marker.toggleIncorrectExample" && N && (R = () => ae()), h.id === "marker.openIncorrectExamples" && (R = () => J(!0)), h.id === "markerGroup.toggleCollapse" && j && (R = () => oe(j)), h.id === "markerGroup.toggleAll" && (R = () => P((x) => vl(x, q))), h.id === "marker.assignSlots" && (R = () => {
      var x;
      return (x = ue.current) == null ? void 0 : x.click();
    }), h.id === "navigation.zoomIn" && (R = () => Q((x) => Zn(x + 0.5))), h.id === "navigation.zoomOut" && (R = () => Q((x) => Zn(x - 0.5))), h.id === "navigation.resetZoom" && (R = () => Q(1)), h.id === "navigation.centerPlayhead" && (R = () => {
      var x;
      return (x = o.current) == null ? void 0 : x.call(o);
    }), h.id === "layout.growSwimlanes" && (R = () => W(c.timelineRatio + 0.05)), h.id === "layout.shrinkSwimlanes" && (R = () => W(c.timelineRatio - 0.05)), h.id === "marker.confirm" && N && (R = () => H("approved")), h.id === "system.publishApproved" && (R = () => w(K.target)), h.id === "marker.reject" && N && (R = () => H("rejected")), h.id === "system.emptyBin" && (R = () => m()), h.id === "system.deleteRejected" && (R = () => l()), R && R();
  }
  function Te(h, K) {
    const R = An.find((x) => x.id === h);
    R && on(R, i) && se(R, K);
  }
  return { executeShortcutById: Te };
}
function vd(e, t, r = !1, o = 0, i = "") {
  const [a, s] = F(null), [l, d] = F(null), [c, g] = F(""), [m, u] = F({
    busy: !1,
    reviewState: null,
    error: ""
  }), y = ge(null);
  async function p(w) {
    u({ busy: !0, reviewState: w, error: "" });
    try {
      await Z(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Ar(), reviewState: w })
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
      const w = await Z(`/videos/${e}/analysis-runs`), v = (w == null ? void 0 : w[0]) || null;
      return s(v), (v == null ? void 0 : v.status) === "completed" && y.current !== v.id && (y.current = v.id, await t()), ((v == null ? void 0 : v.status) === "failed" || (v == null ? void 0 : v.status) === "cancelled") && g(v.errorMessage || "Video analysis did not complete."), v;
    } catch (w) {
      return g(w.message || "Unable to load video analysis status."), null;
    }
  }
  async function f(w = null) {
    g("");
    const v = w || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), C = v.includes("omnishotcut") && o > 0;
    if (!(C && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const H = await Z(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: v,
            replaceShotBoundaries: C,
            expectedShotBoundaryFingerprint: C ? i : null
          })
        });
        s(H);
      } catch (H) {
        g(H.message || "Unable to start video analysis.");
      }
  }
  return fe(() => {
    b(), Z("/analysis/status").then((w) => {
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
    importNativeSegments: p,
    nativeImportState: m,
    startFullAnalysis: f
  };
}
const wn = Object.freeze([]);
function xd(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Sd({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var lo, co, uo, mo, go;
  const [g, m] = F(null), [u, y] = F([]), p = ge(null), b = ge(null), f = ge([]), w = ge(null), [v, C] = F(() => ut({})), [H, $] = F(!1), [q, E] = F(gs), [N, M] = F(0), [j, Y] = F(null), [P, J] = F(!1), [T, I] = F(""), [L, re] = F(""), [Q, Ne] = F(""), [ue, A] = F(1), [X, G] = F(Ol), [ae, oe] = F(0), [W, xe] = F({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [Ae, se] = F(wt), Te = ge(wt), [h, K] = F(!1), [R, x] = F(!1), [D, S] = F(!1), [k, z] = F(!1), le = ge(!1), [ie, te] = F(null), [ve, _] = F(null), ee = ge(null), [V, O] = F(!1), [ne, me] = F(""), be = ge(null), ye = ge(null), Ee = ge(!1), Pe = ge(!1), [he, Ie] = F(Pl), [Ce, pe] = F(null), [Ge, Me] = F(!1), [ot, Se] = F(!1), [De, Ue] = F(!1), [je, ke] = F(!1), [$e, Ke] = F(!1), [at, Je] = F(""), {
    analysisError: We,
    analysisRun: It,
    analysisStatus: At,
    importNativeSegments: sn,
    nativeImportState: En,
    startFullAnalysis: ir
  } = vd(
    e.video.id,
    o,
    l,
    ((lo = e.shotBoundaries) == null ? void 0 : lo.length) || 0,
    Yn(e.shotBoundaries || [])
  ), [Rt, St] = F(!1), [Et, Dt] = F(null), [ln, mt] = F(l), [sr, Kt] = F(0), [Ut, lr] = F(!1), [dn, gt] = F(""), [cn, Dn] = F(null), un = ge(null), On = ge(null), mn = ge(!1), [Ct, zt] = F([]), [Pn, dr] = F(!1), [Ln, cr] = F(null), gn = El(), _t = ge(null), pn = ge(null), Ot = ge(null), ur = ge(s), Fn = ge(null), Ht = ge(null), fn = ge(null), qt = ge(null), it = ge(null), jn = ge(null), yn = ge(null), Bn = ge(null), ht = ge(null), bn = ge(null), Wt = ge(null), mr = ge(-1e12), gr = ge(null), pr = ge(!1), Vt = ge(null), [hn, Jt] = F({ scrollTop: 0, height: 512 });
  fe(() => {
    if (!Rt || Ut || !dn) return;
    const B = requestAnimationFrame(() => {
      var ce;
      return (ce = On.current) == null ? void 0 : ce.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(B);
  }, [Rt, Ut, dn]), fe(() => {
    if (!mn.current || Rt || ln) return;
    const B = requestAnimationFrame(() => {
      var ce;
      (ce = un.current) == null || ce.focus({ preventScroll: !0 }), mn.current = !1;
    });
    return () => cancelAnimationFrame(B);
  }, [Rt, ln]);
  const ze = e.video, Ye = e.segments || wn, Ze = Be(() => JSON.stringify({
    segments: Ye.map((B) => [
      B.id,
      B.itemId,
      B.nativeSegmentId,
      B.tagId,
      B.startSec,
      B.endSec,
      B.reviewState,
      B.published,
      B.sourceKey,
      B.sourceRunId,
      B.confidence,
      B.revision,
      B.updatedAt
    ]),
    performerSlots: (e.performerSlots || wn).map((B) => [
      B.segmentId,
      B.slotDefinitionId,
      B.performerId,
      B.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [Ye, e.performerSlots, e.itemMetadata]);
  fe(() => {
    if (!l) {
      Dt(null), mt(!1);
      return;
    }
    let B = !0;
    mt(!0);
    const ce = setTimeout(() => {
      Z(`/videos/${ze.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Le) => {
        B && (Dt(Le), gt(""));
      }).catch((Le) => {
        B && (Dt(null), gt(Le.message || "Unable to preview derived segments."));
      }).finally(() => {
        B && mt(!1);
      });
    }, 150);
    return () => {
      B = !1, clearTimeout(ce);
    };
  }, [l, ze.id, Ze, sr]);
  const Gn = () => Kt((B) => B + 1), vt = e.segmentGroups || wn, pt = e.performerSlots || wn, Kn = l && e.performerSlotsAvailable !== !1, kt = Be(
    () => (e.performerCandidates || []).filter((B) => B.isVideoPerformer),
    [e.performerCandidates]
  ), vn = e.shotBoundaries || wn, Yt = Be(
    () => Oa(pt),
    [pt]
  ), Un = Be(
    () => Ye.map((B) => {
      const ce = Yt.get(B.id) || [];
      return {
        ...B,
        slots: ce,
        assignment: ce.every((Le) => Le.performerId == null) ? js(ce, kt) : null
      };
    }).filter((B) => B.slots.length > 0 && B.assignment != null),
    [Ye, Yt, kt]
  ), xn = Number((co = ze.videoFile) == null ? void 0 : co.frameRate) > 0 ? Number(ze.videoFile.frameRate) : 30;
  function Zt() {
    S(!1), requestAnimationFrame(() => {
      var B;
      return (B = it.current) == null ? void 0 : B.focus({ preventScroll: !0 });
    });
  }
  function fr() {
    j == null && (Wt.current = null, z(!1), I(""), requestAnimationFrame(() => {
      var B;
      return (B = it.current) == null ? void 0 : B.focus({ preventScroll: !0 });
    }));
  }
  function Qt() {
    $(!1), requestAnimationFrame(() => {
      var B, ce;
      (B = yn.current) != null && B.isConnected ? yn.current.focus({ preventScroll: !0 }) : (ce = it.current) == null || ce.focus({ preventScroll: !0 });
    });
  }
  fe(() => {
    bn.current === g ? (bn.current = null, S(!0)) : S(!1);
  }, [g]), fe(() => {
    var ce;
    if (!D) return;
    const B = (ce = ht.current) == null ? void 0 : ce.querySelector("input");
    B == null || B.focus({ preventScroll: !0 }), B == null || B.select();
  }, [D, g]), fe(() => {
    var Le, _e, tt;
    const B = jt(
      xr(
        e.segments,
        e.performerSlots || [],
        ut({}),
        l && q,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), ce = ((Le = e.segments.find((Hn) => Hn.id === s)) == null ? void 0 : Le.id) ?? ((_e = da(B)) == null ? void 0 : _e.id) ?? null;
    m(ce), y(ce == null ? [] : [ce]), b.current = ce, f.current = [], pe(ft(B, ce)), C(ut({})), $(!1), Wt.current = null, z(!1), A(1), I(""), se(wt), Te.current = wt, K(!1), (tt = it.current) == null || tt.focus({ preventScroll: !0 });
  }, [ze.id, s]), fe(() => {
    const B = new AbortController();
    return Z(`/videos/${ze.id}/incorrect-examples`, { signal: B.signal }).then(zt).catch((ce) => {
      ce.name !== "AbortError" && zt([]);
    }), () => B.abort();
  }, [ze.id, d == null ? void 0 : d.effectiveMode]), fe(() => {
    const B = new AbortController();
    return Z(`/videos/${ze.id}/history`, { signal: B.signal }).then((ce) => {
      const Le = ce || wt;
      Te.current = Le, se(Le);
    }).catch((ce) => {
      ce.name !== "AbortError" && I(ce.message || "Unable to load editor history.");
    }), () => B.abort();
  }, [ze.id]), fe(() => {
    Fl(X);
  }, [X.timelineRatio, X.markerRailOpen, X.detailWidth, X.markerRailWidth, X.swimlaneTitleWidth]), fe(() => {
    Ll(he);
  }, [he]), fe(() => {
    ps(q);
  }, [q]), fe(() => {
    const B = Ht.current;
    if (!a || !B || typeof ResizeObserver > "u") return;
    const ce = () => {
      const _e = B.clientHeight;
      oe(_e), G((tt) => {
        const Hn = jr(tt.timelineRatio, _e);
        return Hn === tt.timelineRatio ? tt : { ...tt, timelineRatio: Hn };
      });
    }, Le = new ResizeObserver(ce);
    return Le.observe(B), ce(), () => Le.disconnect();
  }, [a]), fe(() => {
    if (!gn || typeof ResizeObserver > "u") return;
    const B = qt.current, ce = fn.current;
    if (!B || !ce) return;
    const Le = () => xe({
      workspace: B.clientWidth,
      focusRow: ce.clientWidth,
      focusRowHeight: ce.clientHeight
    }), _e = new ResizeObserver(Le);
    return _e.observe(B), _e.observe(ce), Le(), () => _e.disconnect();
  }, [gn, X.markerRailOpen]);
  const st = Be(
    () => Fo(
      xr(
        Ye,
        pt,
        v,
        l && q,
        vt
      ),
      Ct,
      !0
    ),
    [
      Ye,
      pt,
      v,
      q,
      vt,
      l,
      Ct
    ]
  ), U = Object.fromEntries(Xe.map((B) => [B, st.filter((ce) => ce.reviewState === B).length])), Fe = Fo(
    xr(
      Ye,
      pt,
      { ...v, reviewStates: Xe },
      l && q,
      vt
    ),
    Ct,
    !0
  ), lt = Object.fromEntries(Xe.map((B) => [B, Fe.filter((ce) => ce.reviewState === B).length])), dt = [...new Set(Ye.map((B) => B.sourceKey).filter(Boolean))].sort((B, ce) => bt(B).localeCompare(bt(ce))), Xt = es(
    v,
    l && q
  ), Ve = Be(
    () => jt(st, vt, pt),
    [st, vt, pt]
  ), de = rs(
    Ve,
    g,
    s
  ), Pt = ms(st, u), _a = !l && Pt.length > 0 && Pt.every((B) => B.nativeSegmentId != null), qr = st.map((B) => B.id), Ha = qr.join("|");
  p.current = (de == null ? void 0 : de.id) ?? null;
  const Wr = Yt.get(de == null ? void 0 : de.id) || [], qa = Ur(Wr), Vr = Be(
    () => yl(Ve, u),
    [Ve, u]
  ), yr = Be(() => zr(Ve), [Ve]), Sn = Be(
    () => pl(yr, he),
    [yr, he]
  ), Wa = Be(
    () => Pa(
      Sn.rows,
      hn.scrollTop,
      hn.height
    ),
    [Sn, hn]
  ), Va = Be(
    () => hl(Ve, he),
    [Ve, he]
  ), en = de ? ft(Ve, de.id) : null, br = vt.length > 0 ? yr.map((B) => B.key) : [], Ja = br.join("|"), zn = Math.max(
    0,
    Number((uo = ze.videoFile) == null ? void 0 : uo.duration) || 0,
    ...Ye.map((B) => Number(B.endSec ?? B.startSec) || 0)
  ), Jr = Number((mo = ze.videoFile) == null ? void 0 : mo.duration) > 0 ? Number(ze.videoFile.duration) : null;
  Ae.actions;
  const Ya = ha();
  fe(() => {
    const B = g === Qn ? g : (de == null ? void 0 : de.id) ?? null;
    B !== g && m(B);
  }, [de, g]), fe(() => {
    y((B) => {
      const ce = ss(
        B,
        qr,
        (de == null ? void 0 : de.id) ?? null
      );
      return ce.length === B.length && ce.every((Le, _e) => Le === B[_e]) ? B : ce;
    });
  }, [Ha, de == null ? void 0 : de.id]);
  const tn = (de == null ? void 0 : de.itemId) == null ? null : ((go = e.itemMetadata) == null ? void 0 : go[de.itemId]) || null, Za = {
    key: (de == null ? void 0 : de.itemId) != null ? `item:${de.itemId}` : (de == null ? void 0 : de.nativeSegmentId) != null ? `native:${de.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (tn == null ? void 0 : tn.provenance) || (de == null ? void 0 : de.fieldProvenance) || [] : []
  }, hr = (de == null ? void 0 : de.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (tn == null ? void 0 : tn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  fe(() => {
    re(de == null ? "" : String(de.startSec)), Ne((de == null ? void 0 : de.endSec) == null ? "" : String(de.endSec));
  }, [de == null ? void 0 : de.id, de == null ? void 0 : de.startSec, de == null ? void 0 : de.endSec]), fe(() => {
    en && Ie((B) => ja(B, en));
  }, [ze.id, s, en]), fe(() => {
    pe((B) => kl(br, B, en));
  }, [ze.id, Ja, en]), fe(() => {
    if (!X.markerRailOpen || (de == null ? void 0 : de.id) == null) return;
    const B = Vt.current, ce = Sn.rows.find((tt) => tt.kind === "segment" && tt.segment.id === de.id);
    if (!B || !ce) return;
    const Le = ce.top + ce.height;
    let _e = B.scrollTop;
    ce.top < B.scrollTop ? _e = ce.top : Le > B.scrollTop + B.clientHeight && (_e = Math.max(0, Le - B.clientHeight)), _e !== B.scrollTop && (B.scrollTop = _e), Jt({ scrollTop: _e, height: B.clientHeight });
  }, [de == null ? void 0 : de.id, Sn, X.markerRailOpen]), fe(() => {
    const B = Vt.current;
    if (!X.markerRailOpen || !B) return;
    const ce = () => Jt({
      scrollTop: B.scrollTop,
      height: B.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      ce();
      return;
    }
    const Le = new ResizeObserver(ce);
    return Le.observe(B), ce(), () => Le.disconnect();
  }, [X.markerRailOpen]);
  const { revealSegmentGroupForSelection: Yr, replaceSegmentSelection: Qa, selectSegment: Zr, selectSegmentCollection: Xa, selectAllVideoSegments: ei } = pd({
    allSwimlanes: Ve,
    editorRef: it,
    performerSlots: pt,
    seekRef: _t,
    segmentGroups: vt,
    segments: Ye,
    selectedSegmentId: g,
    selectedSegmentIds: u,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: f,
    setCollapsedSegmentGroups: Ie,
    setEditorFilters: C,
    setHideDerivedSegments: E,
    setSaveMessage: I,
    setSelectedSegmentGroupKey: pe,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: y
  }), { acceptHistory: vr, recordHistoryAction: _n, mutateSegment: ti, completeReview: ni, createSegment: Qr, splitSegment: Xr, duplicateSegment: eo, saveTiming: ri, applyShortcutTiming: oi } = Rl({
    compatibilityMode: l,
    currentTime: N,
    detail: e,
    editorFilters: v,
    endInput: Q,
    hideDerivedSegments: q,
    historyRef: Te,
    mediaDuration: Jr,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: mr,
    pendingDuplicateRef: gr,
    pendingFirstSegmentStartSecRef: Wt,
    pendingTagEditSegmentIdRef: bn,
    replaceSegmentSelection: Qa,
    savingSegmentId: j,
    segments: Ye,
    selectedSegment: de,
    selectedSegmentIdRef: p,
    selectedSegments: Pt,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: f,
    setEditorFilters: C,
    setFirstSegmentTagOpen: z,
    setHideDerivedSegments: E,
    setHistory: se,
    setHistoryOpen: K,
    setPublishApprovedError: me,
    setSaveMessage: I,
    setSavingSegmentId: Y,
    setSelectedSegmentGroupKey: pe,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: y,
    startInput: L,
    timelineDuration: zn,
    video: ze
  });
  function to(B = null) {
    var _e;
    if (!l || j != null || !Ye.some((tt) => !tt.published && tt.reviewState === "approved")) return;
    const ce = ((_e = it.current) == null ? void 0 : _e.ownerDocument) ?? document, Le = ce.activeElement === ce.body ? null : ce.activeElement;
    ye.current = B != null && B.isConnected && B !== ce.body ? B : Le, me(""), O(!0);
  }
  function no() {
    j == null && (O(!1), me(""), requestAnimationFrame(() => {
      xd(
        ye.current,
        it.current
      ), ye.current = null;
    }));
  }
  async function ai() {
    await ni() && no();
  }
  const { closeMergeConfirmation: ii, mergeSelectedSwimlane: ro, saveSelectedReviewState: si } = fd({
    acceptHistory: vr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: w,
    historyRef: Te,
    mergeSavingRef: le,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: _n,
    revealSegmentGroupForSelection: Yr,
    reviewSavingRef: Ee,
    savingSegmentId: j,
    selectedGroups: Vr,
    selectedSegment: de,
    selectedSegmentIdRef: p,
    selectedSegments: Pt,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: f,
    setMergeConfirmation: te,
    setSaveMessage: I,
    setSavingSegmentId: Y,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: y,
    video: ze
  }), { toggleIncorrectExample: li, removeIncorrectExample: di, captureTrainingExport: ci, deleteRejectedSegments: oo, autoAssignPerformers: ui, previewDerivedSegments: mi, closeMaterializeDialog: gi, materializeDerivedSegments: pi, saveTag: fi, moveToBin: yi, emptyRecyclingBin: bi } = yd({
    acceptHistory: vr,
    allSwimlanes: Ve,
    autoAssignCandidates: Un,
    autoAssigning: $e,
    binEmptyingRef: Pe,
    canMoveSelectionToBin: _a,
    closeTagEditing: Zt,
    compatibilityMode: l,
    detail: e,
    editorRef: it,
    exportingExamples: Pn,
    incorrectExamples: Ct,
    lineage: hr,
    materializeButtonRef: un,
    materializePreview: Et,
    materializeRestoreFocusRef: mn,
    materializing: Ut,
    mutateSegment: ti,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: _n,
    refreshMaterializationPreview: Gn,
    removingExampleId: Ln,
    revealSegmentGroupForSelection: Yr,
    savingSegmentId: j,
    segments: Ye,
    selectedSegment: de,
    selectedSegmentIdRef: p,
    selectedSegments: Pt,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: f,
    setAutoAssignError: Je,
    setAutoAssignOpen: ke,
    setAutoAssigning: Ke,
    setExportingExamples: dr,
    setIncorrectExamples: zt,
    setMaterializeError: gt,
    setMaterializeLoading: mt,
    setMaterializeOpen: St,
    setMaterializePreview: Dt,
    setMaterializing: lr,
    setRemovingExampleId: cr,
    setRejectedDeletionPreview: _,
    setSaveMessage: I,
    setSavingSegmentId: Y,
    setSelectedSegmentGroupKey: pe,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: y,
    video: ze
  }), { restoreHistoryTarget: hi, updateTimelineRatio: ao, handleSeparatorPointerDown: vi, handleSeparatorPointerMove: xi, handleSeparatorKeyDown: Si, panelWidthMaximum: io, panelSeparatorProps: ki, toggleSegmentRail: wi, toggleSegmentGroup: so, mutateShotBoundary: Ni } = bd({
    acceptHistory: vr,
    compatibilityMode: l,
    currentTime: N,
    detail: e,
    editorLayout: X,
    focusRowRef: fn,
    history: Ae,
    historyRef: Te,
    historySaving: R,
    horizontalLayoutSize: W,
    mediaStackHeight: ae,
    mediaStackRef: Ht,
    onDetailChange: t,
    onReload: o,
    railToggleRef: jn,
    recordHistoryAction: _n,
    savingSegmentId: j,
    savingShot: P,
    savingShotRef: pr,
    setCollapsedSegmentGroups: Ie,
    setEditorLayout: G,
    setHistorySaving: x,
    setSaveMessage: I,
    setSavingSegmentId: Y,
    setSavingShot: J,
    shotBoundaries: vn,
    timelineDuration: zn,
    video: ze,
    workspaceRef: qt
  }), { executeShortcutById: Ii } = hd({
    allSwimlanes: Ve,
    applyShortcutTiming: oi,
    centerTimelineRef: Fn,
    compatibilityMode: l,
    createSegment: Qr,
    currentTime: N,
    deleteRejectedSegments: oo,
    duplicateSegment: eo,
    editorLayout: X,
    editorRef: it,
    emptyRecyclingBin: bi,
    lineage: hr,
    mediaDuration: Jr,
    mergeSelectedSwimlane: ro,
    moveToBin: yi,
    mutateShotBoundary: Ni,
    openPublishApprovedDialog: to,
    playbackControlsRef: pn,
    playbackShortcutConfig: Ya,
    saveSelectedReviewState: si,
    seekRef: _t,
    segmentGroupKeys: br,
    selectSegment: Zr,
    selectedSegment: de,
    selectedSegmentGroupForSegment: en,
    selectedSegmentGroupKey: Ce,
    selectedSegments: Pt,
    setCollapsedSegmentGroups: Ie,
    setIncorrectExamplesOpen: Ue,
    setQuickSearchOpen: Se,
    setSaveMessage: I,
    setSelectedSegmentGroupKey: pe,
    setTagEditing: S,
    setTimelineZoom: A,
    shotBoundaries: vn,
    slotButtonRef: Bn,
    splitSegment: Xr,
    swimlanes: Va,
    timelineDuration: zn,
    toggleIncorrectExample: li,
    toggleSegmentGroup: so,
    updateTimelineRatio: ao,
    videoFrameRate: xn,
    visibleSegments: st
  });
  Ot.current = Ii;
  const Ci = Be(() => An.map((B) => ({
    id: B.id,
    enabled: on(B, l),
    surface: "local",
    action: (ce) => {
      var Le;
      return (Le = Ot.current) == null ? void 0 : Le.call(Ot, B.id, ce);
    }
  })), [l]);
  Qo(Pr, Ci);
  const $i = Fr(ae), Ti = Ft(X.markerRailWidth, io("markerRailWidth")), Mi = Ft(X.detailWidth, io("detailWidth"));
  return n(gd, {
    activeFilterCount: Xt,
    allSwimlanes: Ve,
    analysisError: We,
    analysisRun: It,
    analysisStatus: At,
    approvalFacetCounts: lt,
    autoAssignCandidates: Un,
    autoAssignError: at,
    autoAssignOpen: je,
    autoAssignPerformers: ui,
    autoAssigning: $e,
    captureTrainingExport: ci,
    removeIncorrectExample: di,
    rejectedDeletionPreview: ve,
    centerTimelineRef: Fn,
    closeEditorFilters: Qt,
    closeFirstSegmentTagDialog: fr,
    closeMaterializeDialog: gi,
    closeMergeConfirmation: ii,
    closePublishApprovedDialog: no,
    closeTagEditing: Zt,
    collapsedSegmentGroups: he,
    compatibilityMode: l,
    configuringTag: cn,
    createSegment: Qr,
    currentTime: N,
    deleteRejectedSegments: oo,
    detail: e,
    detailPanelRef: w,
    detailWidth: Mi,
    duplicateSegment: eo,
    editorFilters: v,
    editorLayout: X,
    editorRef: it,
    exportingExamples: Pn,
    filtersButtonRef: yn,
    filtersOpen: H,
    firstSegmentTagOpen: k,
    focusRowRef: fn,
    handleSeparatorKeyDown: Si,
    handleSeparatorPointerDown: vi,
    handleSeparatorPointerMove: xi,
    hideDerivedSegments: q,
    history: Ae,
    historyOpen: h,
    historySaving: R,
    horizontalLayoutSize: W,
    importNativeSegments: sn,
    incorrectExamples: Ct,
    incorrectExamplesOpen: De,
    removingExampleId: Ln,
    lineage: hr,
    markerRailWidth: Ti,
    materializeButtonRef: un,
    materializeCancelButtonRef: On,
    materializeDerivedSegments: pi,
    materializeError: dn,
    materializeLoading: ln,
    materializeOpen: Rt,
    materializePreview: Et,
    materializing: Ut,
    mediaStackRef: Ht,
    mergeCancelButtonRef: ee,
    mergeConfirmation: ie,
    mergeSavingRef: le,
    mergeSelectedSwimlane: ro,
    nativeImportState: En,
    onNavigate: c,
    openPublishApprovedDialog: to,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: ki,
    pendingInitialSeekRef: ur,
    performerSlots: pt,
    performerSlotsAvailable: Kn,
    playbackControlsRef: pn,
    previewDerivedSegments: mi,
    provenance: Za,
    provenanceSources: dt,
    publishApprovedCancelButtonRef: be,
    publishApprovedDrafts: ai,
    publishApprovedError: ne,
    publishApprovedOpen: V,
    quickSearchOpen: ot,
    railScrollRef: Vt,
    railToggleRef: jn,
    recordHistoryAction: _n,
    restoreHistoryTarget: hi,
    saveMessage: T,
    saveTag: fi,
    saveTiming: ri,
    savingSegmentId: j,
    seekRef: _t,
    segmentGroups: vt,
    segmentRailLayout: Sn,
    segments: Ye,
    selectAllVideoSegments: ei,
    selectSegment: Zr,
    selectSegmentCollection: Xa,
    selectedGroups: Vr,
    selectedPerformerSlots: Wr,
    selectedSegment: de,
    selectedSegmentGroupKey: Ce,
    selectedSegmentIds: u,
    selectedSegments: Pt,
    selectedSlotStatus: qa,
    setAutoAssignError: Je,
    setAutoAssignOpen: ke,
    setConfiguringTag: Dn,
    setCurrentTime: M,
    setEditorFilters: C,
    setEditorLayout: G,
    setFiltersOpen: $,
    setHideDerivedSegments: E,
    setHistoryOpen: K,
    setIncorrectExamplesOpen: Ue,
    setQuickSearchOpen: Se,
    setRejectedDeletionPreview: _,
    setRailViewport: Jt,
    setSelectedSegmentGroupKey: pe,
    setSelectedSegmentId: m,
    setShortcutsOpen: Me,
    setTimelineZoom: A,
    shotBoundaries: vn,
    shortcutsOpen: Ge,
    slotButtonRef: Bn,
    splitLayout: a,
    splitSegment: Xr,
    startFullAnalysis: ir,
    tagEditing: D,
    tagSearchRef: ht,
    timelineDuration: zn,
    timelineRatioBounds: $i,
    timelineZoom: ue,
    toggleSegmentGroup: so,
    toggleSegmentRail: wi,
    updateTimelineRatio: ao,
    video: ze,
    videoPerformers: kt,
    visibleCounts: U,
    visibleSegmentRailRows: Wa,
    visibleSegments: st,
    wideLayout: gn,
    workspaceRef: qt
  });
}
function kd(e = [], t = []) {
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
function wd(e = [], t = "", r = "all") {
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
function Qe(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function Nd(e = [], t = []) {
  var y;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((p, b) => (p.sortOrder ?? 0) - (b.sortOrder ?? 0) || Number(p.id) - Number(b.id)).forEach((p, b) => {
    [...p.tags || []].sort((f, w) => (f.sortOrder ?? 0) - (w.sortOrder ?? 0) || Number(f.tagId) - Number(w.tagId)).forEach((f, w) => r.set(Number(f.tagId), {
      key: `group:${p.id}`,
      id: p.id,
      name: p.name,
      sortOrder: p.sortOrder ?? b,
      tagSortOrder: f.sortOrder ?? w
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(p, b) {
    const f = Number(p);
    if (!o.has(f)) {
      const w = r.get(f);
      o.set(f, {
        tagId: f,
        name: b || `Tag ${f}`,
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
    const b = i(p.sourceTagId, p.sourceTagName), f = i(p.derivedTagId, p.derivedTagName);
    b.outgoingRuleCount++, f.incomingRuleCount++;
    const w = `${b.tagId}:${f.tagId}`;
    a.has(w) || a.set(w, {
      id: w,
      sourceTagId: b.tagId,
      derivedTagId: f.tagId,
      rules: [],
      edgeCount: 0
    });
    const v = a.get(w);
    v.rules.push(p), v.edgeCount += Number(p.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((p) => [p.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((p) => {
    var b, f;
    (b = d.get(p.sourceTagId)) == null || b.add(p.derivedTagId), (f = d.get(p.derivedTagId)) == null || f.add(p.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), g = [];
  for (const p of s) {
    if (c.has(p.tagId)) continue;
    const b = [p.tagId], f = [];
    for (c.add(p.tagId); b.length > 0; ) {
      const E = b.shift();
      f.push(E);
      for (const N of d.get(E) || [])
        c.has(N) || (c.add(N), b.push(N));
    }
    const w = new Set(f), v = f.map((E) => o.get(E)), C = l.filter((E) => w.has(E.sourceTagId) && w.has(E.derivedTagId)), H = C.flatMap((E) => E.rules), $ = v.filter((E) => E.outgoingRuleCount === 0).sort((E, N) => Qe(E.name, N.name)), q = $.length > 0 ? $ : [...v].sort((E, N) => Qe(E.name, N.name));
    g.push({
      id: [...f].sort((E, N) => E - N).join(":"),
      label: q.length > 1 ? `${q[0].name} + ${q.length - 1}` : ((y = q[0]) == null ? void 0 : y.name) || "Derivation component",
      nodes: v,
      connections: C,
      rules: H,
      segmentGroupKeys: [...new Set(v.map((E) => E.segmentGroupKey))],
      materializedEdgeCount: H.reduce(
        (E, N) => E + (Number(N.edgeCount) || 0),
        0
      )
    });
  }
  g.sort((p, b) => b.rules.length - p.rules.length || Qe(p.label, b.label));
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
    p.nodes.forEach((b) => {
      var f;
      return (f = m.get(b.segmentGroupKey)) == null ? void 0 : f.componentIds.add(p.id);
    }), p.rules.forEach((b) => {
      var f, w;
      (f = m.get(o.get(Number(b.sourceTagId)).segmentGroupKey)) == null || f.ruleIds.add(b.id), (w = m.get(o.get(Number(b.derivedTagId)).segmentGroupKey)) == null || w.ruleIds.add(b.id);
    });
  });
  const u = [...m.values()].sort((p, b) => p.sortOrder - b.sortOrder || Qe(p.name, b.name)).map((p) => ({
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
function Id(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const g = new Map(e.nodes.map((M) => [M.tagId, /* @__PURE__ */ new Set()])), m = new Map(e.nodes.map((M) => [M.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((M) => {
    var j, Y;
    (j = g.get(M.sourceTagId)) == null || j.add(M.derivedTagId), (Y = m.get(M.derivedTagId)) == null || Y.add(M.sourceTagId);
  });
  const u = new Map(e.nodes.map((M) => {
    var j;
    return [
      M.tagId,
      ((j = m.get(M.tagId)) == null ? void 0 : j.size) || 0
    ];
  })), y = new Map(e.nodes.map((M) => [M.tagId, 0])), p = e.nodes.filter((M) => u.get(M.tagId) === 0).sort((M, j) => Qe(M.name, j.name)).map((M) => M.tagId), b = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const M = p.shift();
    if (!b.has(M)) {
      b.add(M);
      for (const j of g.get(M) || [])
        y.set(j, Math.max(y.get(j) || 0, (y.get(M) || 0) + 1)), u.set(j, u.get(j) - 1), u.get(j) === 0 && p.push(j);
    }
  }
  b.size !== e.nodes.length && e.nodes.filter((M) => !b.has(M.tagId)).sort((M, j) => Qe(M.name, j.name)).forEach((M) => y.set(M.tagId, 0));
  const f = Math.max(0, ...y.values()), w = Math.max(
    t,
    240 + f * 296
  ), v = /* @__PURE__ */ new Map();
  e.nodes.forEach((M) => {
    v.has(M.segmentGroupKey) || v.set(M.segmentGroupKey, {
      key: M.segmentGroupKey,
      id: M.segmentGroupId,
      name: M.segmentGroupName,
      sortOrder: M.segmentGroupSortOrder,
      nodes: []
    }), v.get(M.segmentGroupKey).nodes.push(M);
  });
  const C = [...v.values()].sort((M, j) => M.sortOrder - j.sortOrder || Qe(M.name, j.name));
  let H = 28;
  const $ = [], q = C.map((M) => {
    const j = /* @__PURE__ */ new Map();
    M.nodes.forEach((I) => {
      const L = y.get(I.tagId) || 0;
      j.has(L) || j.set(L, []), j.get(L).push(I);
    });
    for (const I of j.values())
      I.sort((L, re) => L.segmentGroupTagSortOrder - re.segmentGroupTagSortOrder || Qe(L.name, re.name));
    const Y = Math.max(1, ...[...j.values()].map((I) => I.length)), P = Y * 58 + (Y - 1) * 18, J = 70 + P, T = {
      ...M,
      x: 12,
      y: H,
      width: w - 24,
      height: J
    };
    for (const [I, L] of j.entries()) {
      const re = L.length * 58 + Math.max(0, L.length - 1) * 18, Q = (P - re) / 2;
      L.forEach((Ne, ue) => $.push({
        ...Ne,
        rank: I,
        x: 28 + I * 296,
        y: H + 34 + 18 + Q + ue * 76,
        width: 184,
        height: 58
      }));
    }
    return H += J + 16, T;
  }), E = new Map($.map((M) => [M.tagId, M])), N = e.connections.map((M) => {
    const j = E.get(M.sourceTagId), Y = E.get(M.derivedTagId), P = j.x + j.width, J = j.y + j.height / 2, T = Y.x, I = Y.y + Y.height / 2, L = Math.max(48, (T - P) * 0.48);
    return {
      ...M,
      path: `M ${P} ${J} C ${P + L} ${J}, ${T - L} ${I}, ${T} ${I}`
    };
  });
  return {
    width: w,
    height: Math.max(r, H - 16 + 28),
    nodes: $,
    connections: N,
    groups: q
  };
}
function Cd(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Id(d, {
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
      const b = y.get(p.sourceTagId), f = y.get(p.derivedTagId), w = b.x + b.width, v = b.y + b.height / 2, C = f.x, H = f.y + f.height / 2, $ = Math.max(48, (C - w) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${w} ${v} C ${w + $} ${v}, ${C - $} ${H}, ${C} ${H}`
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
function Ho(e, t = []) {
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
function $d(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function Td(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: m, emptyDraft: u, graph: y, layout: p, listSort: b, materializationOffer: f, materializeOutgoingRules: w, materializeRule: v, message: C, normalizedQuery: H, query: $, refreshConfiguredTag: q, revealEditor: E, rules: N, save: M, segmentGroupKey: j, selectedNode: Y, selectedRule: P, selection: J, setConfiguringTag: T, setDraft: I, setListSort: L, setMaterializationOffer: re, setQuery: Q, setSegmentGroupKey: Ne, setSelection: ue, setView: A, sortedVisibleRules: X, sourceSlots: G, sourceSlotsLoading: ae, updateMapping: oe, updateTag: W, view: xe, visibleComponents: Ae, visibleRules: se } = e;
  function Te(D) {
    const S = y.nodes.find((z) => z.tagId === Number(D.sourceTagId)), k = y.nodes.find((z) => z.tagId === Number(D.derivedTagId));
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
          onClick: () => I(null),
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
              onChange: (D, S) => W("source", D, S == null ? void 0 : S.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !ae && G.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (D) => T({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: D.currentTarget
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
              onChange: (D, S) => W("derived", D, S == null ? void 0 : S.label),
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
              onClick: (D) => T({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: D.currentTarget
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
            disabled: r || G.length === 0 || s.length === 0,
            onClick: () => I((D) => ({
              ...D,
              slotMappings: [...D.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
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
          ...d.slotMappings.map((D, S) => n("div", { key: S, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: D.sourceSlotDefinitionId,
              disabled: r,
              onChange: (k) => oe(S, "sourceSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${S + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...G.map((k) => n("option", { key: k.id, value: k.id }, et(k)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: D.derivedSlotDefinitionId,
              disabled: r,
              onChange: (k) => oe(S, "derivedSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${S + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((k) => n("option", { key: k.id, value: k.id }, et(k)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => I((k) => ({
                ...k,
                slotMappings: k.slotMappings.filter((z, le) => le !== S)
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
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((D) => !D.sourceSlotDefinitionId || !D.derivedSlotDefinitionId),
          onClick: M,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => I(null), className: o }, "Cancel")
      ])
    ]);
  }
  function K() {
    if (Y) {
      const k = se.filter((ie) => Number(ie.derivedTagId) === Y.tagId), z = se.filter((ie) => Number(ie.sourceTagId) === Y.tagId), le = (ie, te, ve) => n("div", {
        key: ie.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, te),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${ie.sourceTagName} → ${ie.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          ve ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => v(ie),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => g(ie, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(ie),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, Y.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, Y.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${Y.incomingRuleCount} incoming · ${Y.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (ie) => T({
            tagId: Y.tagId,
            tagName: Y.name,
            trigger: ie.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        z.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => w(Y, z),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${z.length})`) : null,
        z.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...z.map((ie) => le(ie, "Derives", !0))
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
            k.map((ie) => le(ie, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!P)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const D = y.nodes.find((k) => k.tagId === Number(P.sourceTagId)), S = y.nodes.find((k) => k.tagId === Number(P.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (D == null ? void 0 : D.segmentGroupName) || "Ungrouped"),
          (D == null ? void 0 : D.segmentGroupKey) !== (S == null ? void 0 : S.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(S == null ? void 0 : S.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${P.sourceTagName} → ${P.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${P.edgeCount} materialized lineage edge${P.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (f == null ? void 0 : f.ruleId) === P.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => v(P, f),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => re(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        P.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : P.slotMappings.map((k, z) => n("div", {
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
          P.createdAt ? new Date(P.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          P.updatedAt ? new Date(P.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => v(P),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(P),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(P),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function R() {
    if (Ae.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, H ? "No derivation relationships match your search." : "No derivation rules.");
    const D = Y == null ? void 0 : Y.tagId, S = /* @__PURE__ */ new Set();
    return Y && (S.add(Y.tagId), p.connections.forEach((k) => {
      (k.sourceTagId === Y.tagId || k.derivedTagId === Y.tagId) && (S.add(k.sourceTagId), S.add(k.derivedTagId));
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
          className: `absolute rounded-xl border ${j === k.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
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
            const z = D === k.sourceTagId || D === k.derivedTagId, le = Y != null, ie = z ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${k.id}:visible`,
              d: k.path,
              fill: "none",
              stroke: ie,
              strokeWidth: z ? 2.5 : 1.5,
              opacity: le && !z ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((k) => {
          const z = !H || k.name.toLocaleLowerCase().includes(H), le = Y != null, ie = S.has(k.tagId), te = (Y == null ? void 0 : Y.tagId) === k.tagId;
          return n("button", {
            key: `node:${k.tagId}`,
            type: "button",
            onClick: () => ue({ type: "node", id: k.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${te ? "border-accent bg-accent/15 ring-2 ring-accent/25" : ie ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${k.x}px`,
              top: `${k.y}px`,
              width: `${k.width}px`,
              height: `${k.height}px`,
              opacity: !z || le && !ie ? 0.62 : 1
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
          const z = p.nodes.find((ie) => ie.tagId === k.sourceTagId), le = p.nodes.find((ie) => ie.tagId === k.derivedTagId);
          return n("div", {
            key: `bundle:${k.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(z.x + z.width + le.x) / 2 - 24}px`,
              top: `${(z.y + z.height / 2 + le.y + le.height / 2) / 2 - 10}px`
            },
            "aria-label": `${k.rules.length} rules connect ${k.rules[0].sourceTagName} to ${k.rules[0].derivedTagName}`
          }, `${k.rules.length} rules`);
        })
      ])
    ]);
  }
  function x() {
    if (Ae.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        H ? "No derivation relationships match your search." : "No derivation rules."
      );
    const D = /* @__PURE__ */ new Map();
    X.forEach((k) => {
      const z = Te(k);
      D.has(z) || D.set(z, []), D.get(z).push(k);
    });
    const S = [
      ...y.segmentGroups.map((k) => k.key),
      "cross-group"
    ].filter((k) => D.has(k));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, S.map((k) => {
      const z = y.segmentGroups.find((te) => te.key === k), le = k === "cross-group" ? "Cross-group relationships" : (z == null ? void 0 : z.name) || "Ungrouped", ie = D.get(k);
      return n("section", { key: k, "aria-label": le }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, le),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${ie.length} rule${ie.length === 1 ? "" : "s"}`
          )
        ]),
        n("div", { key: "table", role: "table", "aria-label": `${le} derivation rules` }, [
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
          ...ie.map((te) => n("button", {
            key: te.id,
            type: "button",
            role: "row",
            onClick: () => ue({ type: "rule", id: te.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(P == null ? void 0 : P.id) === te.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${te.sourceTagName} → ${te.derivedTagName}` },
              `${te.sourceTagName} → ${te.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(te.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(te.edgeCount))
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
          `${N.length} rules · ${y.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          I(u()), ue(null), E();
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
          value: $,
          onChange: (D) => {
            Q(D.target.value), ue(null);
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
          value: j,
          disabled: d != null,
          onChange: (D) => {
            Ne(D.target.value), ue(null), I(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...y.segmentGroups.map((D) => n("option", { key: D.key, value: D.key }, D.name))
        ])
      ]),
      xe === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: b,
          onChange: (D) => L(D.target.value),
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
        ].map(([D, S]) => n("button", {
          key: D,
          type: "button",
          onClick: () => {
            A(D), D === "graph" && (J == null ? void 0 : J.type) === "rule" && ue(null);
          },
          "aria-pressed": xe === D,
          className: `rounded px-3 py-1.5 text-sm font-medium ${xe === D ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
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
        xe === "graph" ? R() : x()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? h() : K()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      C ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, C) : null
    ]),
    i ? n(Hr, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => q(i),
      onClose: () => {
        const D = i.trigger;
        T(null), requestAnimationFrame(() => {
          D != null && D.isConnected && D.focus();
        });
      }
    }) : null
  ]);
}
function Md({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = F([]), [a, s] = F(null), [l, d] = F([]), [c, g] = F([]), [m, u] = F(!1), [y, p] = F(!1), [b, f] = F(!1), [w, v] = F(""), [C, H] = F(""), [$, q] = F("graph"), [E, N] = F("all"), [M, j] = F(null), [Y, P] = F("relationship"), [J, T] = F(null), [I, L] = F(null), re = ge(null), Q = ge(null), Ne = Na().replace(/:/g, "");
  function ue() {
    requestAnimationFrame(() => {
      var _;
      return (_ = re.current) == null ? void 0 : _.scrollIntoView({ block: "nearest" });
    });
  }
  async function A(_) {
    const ee = await Z("/derivation-rules", _ ? { signal: _ } : void 0);
    i(ee || []);
  }
  fe(() => {
    const _ = new AbortController();
    return A(_.signal).catch((ee) => {
      ee.name !== "AbortError" && v(ee.message || "Unable to load derived segment rules.");
    }), () => _.abort();
  }, []), fe(() => {
    const _ = new AbortController();
    return a != null && a.sourceTagId ? (u(!0), Z(`/slot-definitions/${a.sourceTagId}`, { signal: _.signal }).then((ee) => d(ee.definitions || [])).catch((ee) => {
      ee.name !== "AbortError" && d([]);
    }).finally(() => {
      _.signal.aborted || u(!1);
    })) : (d([]), u(!1)), a != null && a.derivedTagId ? (p(!0), Z(`/slot-definitions/${a.derivedTagId}`, { signal: _.signal }).then((ee) => g(ee.definitions || [])).catch((ee) => {
      ee.name !== "AbortError" && g([]);
    }).finally(() => {
      _.signal.aborted || p(!1);
    })) : (g([]), p(!1)), () => _.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), fe(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || m || y)
      return;
    const _ = `${a.sourceTagId}:${a.derivedTagId}`;
    Q.current !== _ && (Q.current = _, s((ee) => !ee || Number(ee.sourceTagId) !== Number(a.sourceTagId) || Number(ee.derivedTagId) !== Number(a.derivedTagId) ? ee : dl(ee, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    m,
    y
  ]);
  function X(_, ee = !1) {
    ee || j({ type: "rule", id: _.id }), Q.current = null, s({
      ruleId: _.id,
      sourceTagId: _.sourceTagId,
      sourceTagName: _.sourceTagName,
      derivedTagId: _.derivedTagId,
      derivedTagName: _.derivedTagName,
      slotMappings: _.slotMappings.map((V) => ({
        sourceSlotDefinitionId: V.sourceSlotDefinitionId,
        derivedSlotDefinitionId: V.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), v(""), ue();
  }
  function G(_, ee, V = "") {
    Q.current = null, _ === "source" ? (d([]), u(ee != null)) : (g([]), p(ee != null)), s((O) => ({
      ...O,
      [`${_}TagId`]: ee == null ? null : Number(ee),
      [`${_}TagName`]: V || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function ae(_) {
    (a == null ? void 0 : a.ruleId) == null && (Q.current = null);
    const ee = [A(), t == null ? void 0 : t()];
    return _.draftKind === "source" ? (u(!0), ee.push(Z(`/slot-definitions/${_.tagId}`).then((V) => d(V.definitions || [])).finally(() => u(!1)))) : _.draftKind === "derived" && (p(!0), ee.push(Z(`/slot-definitions/${_.tagId}`).then((V) => g(V.definitions || [])).finally(() => p(!1)))), Promise.all(ee);
  }
  function oe(_, ee, V) {
    s((O) => ({
      ...O,
      slotMappings: O.slotMappings.map((ne, me) => me === _ ? { ...ne, [ee]: V } : ne)
    }));
  }
  async function W() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const _ = Ho(a, o);
    if (_) {
      v(_.message);
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
      const V = await Z("/derivation-rules", {
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
      if (await A(), j($ === "graph" ? { type: "node", id: Number(V.sourceTagId) } : { type: "rule", id: V.id }), s(null), a.ruleId == null)
        try {
          const O = await Z(
            `/derivation-rules/${V.id}/materialization/preview`,
            { method: "POST" }
          );
          T(
            O.createCount + O.linkCount > 0 ? O : null
          ), v(O.createCount + O.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          T(null), v("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        T(null), v("Derived segment rule saved. Previous materializations were removed.");
    } catch (ee) {
      v(ee.message || "Unable to save derived segment rule.");
    } finally {
      f(!1);
    }
  }
  async function xe(_) {
    f(!0), v("Previewing rule deletion…");
    try {
      const ee = await Z(
        `/derivation-rules/${_.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${_.sourceTagName} → ${_.derivedTagName}?

Deleted segments: ${ee.deletedSegmentCount}
Removed lineage edges: ${ee.removedEdgeCount}
Shared derived segments retained: ${ee.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const V = `derivation-rule-delete:${_.id}:${ee.fingerprint}`;
      await Z(`/derivation-rules/${_.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(V),
          fingerprint: ee.fingerprint
        })
      }), Oe(V), await A(), (a == null ? void 0 : a.ruleId) === _.id && s(null), (M == null ? void 0 : M.type) === "rule" && M.id === _.id && j(null), (J == null ? void 0 : J.ruleId) === _.id && T(null), v(`Rule deleted with ${ee.deletedSegmentCount} exclusively derived segment${ee.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (ee) {
      v(ee.message || "Unable to delete derived segment rule.");
    } finally {
      f(!1);
    }
  }
  async function Ae(_, ee = null) {
    const V = ee || await Z(
      `/derivation-rules/${_.id}/materialization/preview`,
      { method: "POST" }
    );
    if (V.createCount + V.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const O = `derivation-rule-materialize:${_.id}:${V.fingerprint}`, ne = await Z(`/derivation-rules/${_.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Re(O),
        fingerprint: V.fingerprint
      })
    });
    return Oe(O), ne;
  }
  async function se(_, ee = null) {
    f(!0), v("Finding pending derivations…");
    try {
      const V = await Ae(_, ee);
      if (T(null), await A(), V.createdCount + V.linkedCount === 0) {
        v("Every applicable derivation is already materialized.");
        return;
      }
      v(
        `${V.createdCount} derived segment${V.createdCount === 1 ? "" : "s"} created and ${V.linkedCount} existing segment${V.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (V) {
      v(V.message || "Unable to materialize pending derivations.");
    } finally {
      f(!1);
    }
  }
  async function Te(_, ee) {
    if (ee.length === 0) return;
    f(!0), v(`Finding pending derivations from ${_.name}…`);
    let V = 0, O = 0;
    try {
      for (const ne of ee) {
        const me = await Ae(ne);
        V += me.createdCount, O += me.linkedCount;
      }
      T(null), await A(), v(V + O === 0 ? `Every outgoing derivation from ${_.name} is already materialized.` : `${V} derived segment${V === 1 ? "" : "s"} created and ${O} existing segment${O === 1 ? "" : "s"} linked from ${_.name}.`);
    } catch (ne) {
      await A().catch(() => {
      }), v(ne.message || `Unable to materialize derivations from ${_.name}.`);
    } finally {
      f(!1);
    }
  }
  const h = Ho(a, o), K = Be(
    () => Nd(o, e),
    [o, e]
  ), R = C.trim().toLocaleLowerCase(), D = K.components.filter((_) => E === "all" || _.segmentGroupKeys.includes(E)).filter((_) => !R || _.nodes.some((ee) => ee.name.toLocaleLowerCase().includes(R))), S = D.flatMap((_) => _.rules), k = new Set(
    D.flatMap((_) => _.nodes.map((ee) => ee.tagId))
  ), z = Be(
    () => Cd(D),
    [D]
  ), le = $ === "list" ? $d(
    M,
    S,
    R.length > 0
  ) : null, ie = (M == null ? void 0 : M.type) === "node" && K.nodes.find((_) => _.tagId === M.id && k.has(_.tagId)) || null, te = [...S].sort((_, ee) => Y === "source" ? Qe(_.sourceTagName, ee.sourceTagName) || Qe(_.derivedTagName, ee.derivedTagName) : Y === "target" ? Qe(_.derivedTagName, ee.derivedTagName) || Qe(_.sourceTagName, ee.sourceTagName) : Y === "materialized" ? (Number(ee.edgeCount) || 0) - (Number(_.edgeCount) || 0) || Qe(_.sourceTagName, ee.sourceTagName) : Qe(
    `${_.sourceTagName} ${_.derivedTagName}`,
    `${ee.sourceTagName} ${ee.derivedTagName}`
  ));
  return n(Td, {
    arrowMarkerId: Ne,
    busy: b,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: I,
    deleteRule: xe,
    derivedSlots: c,
    derivedSlotsLoading: y,
    draft: a,
    draftIssue: h,
    editRule: X,
    editorRef: re,
    emptyDraft: r,
    graph: K,
    layout: z,
    listSort: Y,
    materializationOffer: J,
    materializeOutgoingRules: Te,
    materializeRule: se,
    message: w,
    normalizedQuery: R,
    query: C,
    refreshConfiguredTag: ae,
    revealEditor: ue,
    rules: o,
    save: W,
    segmentGroupKey: E,
    selectedNode: ie,
    selectedRule: le,
    selection: M,
    setConfiguringTag: L,
    setDraft: s,
    setListSort: P,
    setMaterializationOffer: T,
    setQuery: H,
    setSegmentGroupKey: N,
    setSelection: j,
    setView: q,
    sortedVisibleRules: te,
    sourceSlots: l,
    sourceSlotsLoading: m,
    updateMapping: oe,
    updateTag: G,
    view: $,
    visibleComponents: D,
    visibleRules: S
  });
}
function Ad() {
  const [e, t] = F(ha), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => Io({ ...l, [a]: s }));
  }
  function i() {
    t(Io(Lr));
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
function Rd({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = F([]), [a, s] = F(!1), [l, d] = F(!1), [c, g] = F(""), [m, u] = F(""), [y, p] = F("all"), [b, f] = F(() => /* @__PURE__ */ new Set()), [w, v] = F(null);
  fe(() => {
    if (!e || a) return;
    const T = new AbortController();
    return d(!0), g(""), Z("/slot-definitions", { signal: T.signal }).then((I) => {
      i(I || []), s(!0);
    }).catch((I) => {
      I.name !== "AbortError" && g(I.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      T.signal.aborted || d(!1);
    }), () => T.abort();
  }, [e, a]);
  async function C() {
    d(!0), g("");
    try {
      const T = await Z("/slot-definitions");
      i(T || []), s(!0);
    } catch (T) {
      g(T.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function H() {
    const [T] = await Promise.all([
      Z("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(T || []), s(!0), g("");
  }
  function $() {
    const T = w == null ? void 0 : w.trigger;
    v(null), requestAnimationFrame(() => {
      T != null && T.isConnected && T.focus({ preventScroll: !0 });
    });
  }
  function q(T) {
    f((I) => {
      const L = new Set(I);
      return L.has(T) ? L.delete(T) : L.add(T), L;
    });
  }
  const E = Be(
    () => kd(t, o),
    [t, o]
  ), N = Be(
    () => wd(E, m, y),
    [E, m, y]
  ), M = E.flatMap((T) => T.tags), j = M.filter((T) => T.definitions.length > 0).length, Y = M.length - j, P = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], J = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${M.length} tags · ${j} with slots · ${Y} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: m,
          onChange: (T) => u(T.target.value),
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
          P.map(([T, I]) => n("button", {
            key: T,
            type: "button",
            onClick: () => p(T),
            "aria-pressed": y === T,
            className: `rounded px-3 py-1.5 text-xs font-medium ${y === T ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, I))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => f(/* @__PURE__ */ new Set()),
          className: J
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => f(new Set(E.map((T) => T.overviewKey))),
          className: J
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
        onClick: C,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && N.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, N.map((T) => {
      const I = b.has(T.overviewKey), L = T.tags.filter((re) => re.definitions.length > 0).length;
      return n("article", {
        key: T.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => q(T.overviewKey),
          "aria-expanded": !I,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, I ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, T.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${T.tags.length} tag${T.tags.length === 1 ? "" : "s"} · ${L} with slots`
          )
        ]),
        I ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          T.tags.map((re) => n("li", {
            key: re.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: re.tagName }, re.tagName),
              re.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            re.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${re.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, re.definitions.map((Q) => n("li", {
              key: Q.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, et(Q)),
              ...(Q.genderHints || []).map((Ne) => n("span", {
                key: Ne,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, rr(Ne)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (Q) => v({
                tagId: re.tagId,
                tagName: re.tagName,
                trigger: Q.currentTarget
              }),
              "aria-label": `Edit performer slots for ${re.tagName}`,
              className: `${J} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    w ? n(Hr, {
      key: `performer-slots-configure:${w.tagId}`,
      tagId: w.tagId,
      tagName: w.tagName,
      onSaved: H,
      onClose: $
    }) : null
  ]);
}
function Ed({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = F("general"), [a, s] = F([]), [l, d] = F(!1), [c, g] = F(""), [m, u] = F(""), [y, p] = F(null), [b, f] = F(!0), [w, v] = F(!1), [C, H] = F(""), [$, q] = F(!0), [E, N] = F(ma), M = Ms(t), j = M.map(([I]) => I);
  fe(() => {
    j.includes(o) || i(j[0] || "general");
  }, [t.effectiveMode]);
  async function Y(I) {
    const L = await Z("/segment-groups", I ? { signal: I } : void 0);
    s(L || []);
  }
  fe(() => {
    const I = new AbortController();
    return Y(I.signal).catch((L) => {
      L.name !== "AbortError" && g(L.message || "Unable to load tag groups.");
    }), () => I.abort();
  }, []), fe(() => {
    if (t.effectiveMode !== "full") {
      f(!1);
      return;
    }
    const I = new AbortController();
    return H(""), f(!0), Promise.all([
      Z("/analysis/settings", { signal: I.signal }),
      Z("/analysis/status", { signal: I.signal })
    ]).then(([L, re]) => {
      q(!0), u((L == null ? void 0 : L.baseUrl) || ""), p(re);
    }).catch((L) => {
      if (L.name !== "AbortError") {
        if (L.status === 403) {
          q(!1), H("You do not have permission to manage the analysis service connection.");
          return;
        }
        H(L.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      I.signal.aborted || f(!1);
    }), () => I.abort();
  }, [t.effectiveMode]);
  async function P(I) {
    if (I !== t.requestedMode) {
      d(!0), g("");
      try {
        const L = await Z(
          `/preferences/transition?mode=${encodeURIComponent(I)}`
        );
        let re = !1, Q = null, Ne = null, ue = null, A = !1;
        if (t.requestedMode === "basic" && I === "full") {
          if (!window.confirm(Es(
            L.recyclingBinCount,
            L.protectedRecyclingBinCount
          )))
            return;
          A = !0, L.recyclingBinCount > 0 && (re = !0, ue = L.recyclingBinFingerprint, Q = `mode-switch-empty-bin:${ue}`, Ne = Re(Q));
        }
        let X = !1;
        if (t.requestedMode === "full" && I === "basic") {
          if (!window.confirm(Rs(
            L.extensionOwnedSegmentCount
          )))
            return;
          X = !0;
        }
        const G = await Z("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: I,
            confirmHiddenExtensionOwnedSegments: X,
            confirmBasicHistoryCleanup: A,
            emptyRecyclingBin: re,
            operationId: Ne,
            expectedRecyclingBinFingerprint: ue
          })
        });
        Q && Oe(Q), r == null || r(va(G)), g("Workflow mode saved.");
      } catch (L) {
        g(L.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function J(I) {
    I.preventDefault(), v(!0), H("");
    try {
      const L = await Z("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: m })
      });
      u((L == null ? void 0 : L.baseUrl) || "");
      const re = await Z("/analysis/status");
      p(re), H(L != null && L.baseUrl ? re != null && re.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(re == null ? void 0 : re.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (L) {
      H(L.message || "Unable to save analysis service settings.");
    } finally {
      v(!1);
    }
  }
  const T = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (I) => Ga(I, e, T), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      M.map(([I, L]) => n("button", {
        key: I,
        type: "button",
        onClick: () => i(I),
        "aria-current": o === I ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === I ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, L))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(Ad)
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
      n(Zl, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: P,
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
          checked: E,
          onChange: (I) => {
            const L = I.target.checked;
            ga(L), N(L);
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
      n("form", { key: "form", onSubmit: J, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
        n("label", { key: "url", className: "min-w-0 flex-1 space-y-1" }, [
          n("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Server URL"),
          n("input", {
            key: "input",
            type: "url",
            value: m,
            onChange: (I) => u(I.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: b || w || !$,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: b || w || !$,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, w ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        C || (b ? "Loading analysis service settings…" : (y == null ? void 0 : y.configured) === !1 ? "Full Scan is not configured." : y != null && y.ready ? "Analysis service is ready." : (y == null ? void 0 : y.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    j.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(Md, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => Y()
      })
    ) : null,
    j.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(Rd, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => Y()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function qo({ facets: e, values: t, disabled: r, onChange: o }) {
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
function Dd({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var g, m;
  const s = [...e.slots || []].sort((u, y) => u.sortOrder - y.sortOrder || String(u.slotDefinitionId).localeCompare(String(y.slotDefinitionId))), l = [...new Map(s.map((u) => [
    u.performerId,
    { id: u.performerId, name: u.performerName }
  ])).values()], d = s.map((u) => ({
    slotDefinitionId: u.slotDefinitionId,
    label: et(u),
    performer: { id: u.performerId, name: u.performerName }
  })), c = Sa(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: Aa(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((g = e.activity) == null ? void 0 : g.name) || "segment"}, ${e.reviewState}, ${we(e.startSec)} to ${e.endSec == null ? "end of video" : we(e.endSec)}` }, [
      n("div", { key: "image", className: "relative aspect-video bg-black" }, [
        n("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        n("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${we(e.startSec)} → end` : `${we(e.startSec)} – ${we(e.endSec)}`)
      ]),
      n("div", { key: "body", className: "flex flex-col gap-1.5 p-2.5" }, [
        n("div", { key: "segment", className: "flex min-w-0 items-center gap-1.5" }, [
          n(Gt, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((m = e.activity) == null ? void 0 : m.name) || "Tag segment"),
          l.length ? n(or, {
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
function Od({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(Zo, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: Ps(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: Sa(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Wo({ onNavigate: e, profile: t }) {
  const r = Be(() => {
    const A = Xo("ext:com.midnightrider.segment-studio:segments");
    return A ? {
      ...Sr,
      defaultFilter: { ...Sr.defaultFilter, ...A.findFilter || {} },
      defaultObjectFilter: A.objectFilter || {}
    } : Sr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = ea(r), [l, d] = F(null), [c, g] = F({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [m, u] = F(null), [y, p] = F(null), [b, f] = F(0), [w, v] = F(""), [C, H] = F(!0), [$, q] = F(""), E = ge(0), N = $o(o, i), M = N.activityTagId, j = rn(i.slots), Y = Be(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (A) => Object.keys(rn(A)).length > 0,
    sanitize: (A) => kr(M, rn(A)),
    summarize: (A) => `${Object.keys(rn(A)).length} assigned`,
    renderEditor: (A, X) => M ? n(qo, {
      facets: l,
      values: rn(A),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (G, ae) => {
        const oe = { ...rn(A) };
        ae ? oe[G] = Number(ae) : delete oe[G], X(kr(M, oe));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [M, l, c.performerSlotsAvailable]), P = JSON.stringify(N);
  fe(() => {
    if (d(null), !M) return;
    const A = new AbortController();
    return Z(`/browse/activities/${M}/facets`, { signal: A.signal }).then(d).catch((X) => {
      X.status === 403 ? d({ slots: [], restricted: !0 }) : X.name !== "AbortError" && q(X.message);
    }), () => A.abort();
  }, [M]), fe(() => {
    const A = ++E.current, X = new AbortController();
    return H(!0), q(""), Z("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(N), signal: X.signal }).then((G) => {
      A === E.current && g({ ...G, totalCount: G.totalCount ?? G.total ?? 0 });
    }).catch((G) => {
      if (!(A !== E.current || G.name === "AbortError")) {
        if (G.status === 400 && G.message.includes("unrestricted performer read access")) {
          g((ae) => ({ ...ae, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), q("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        q(G.message);
      }
    }).finally(() => {
      A === E.current && H(!1);
    }), () => {
      E.current++, X.abort();
    };
  }, [P, b]);
  const J = c.items.findIndex((A) => A.key === m), T = c.items[J] || null;
  function I(A) {
    s(A), a({ ...o, page: 1 });
  }
  function L(A) {
    const X = $o(o, A), G = A.slots && X.activityTagId != null && X.slotAssignments.length > 0 ? A.slots : void 0;
    I({ ...A, slots: G });
  }
  function re(A, X) {
    const G = { ...j };
    X ? G[A] = Number(X) : delete G[A], I({ ...i, slots: kr(M, G) });
  }
  function Q() {
    const A = document.querySelector(`[data-segment-key="${m}"]`);
    u(null), requestAnimationFrame(() => A == null ? void 0 : A.focus());
  }
  async function Ne(A) {
    var ae;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(A.key), v("");
    const X = `browse-restore:${A.itemId}:${A.revision}`, G = Re(X);
    try {
      const oe = (W = !1) => Z(`/bin/${A.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: G,
          expectedRevision: A.revision,
          discardMissingImage: W
        })
      });
      try {
        await oe(Gr(X));
      } catch (W) {
        if (((ae = W.payload) == null ? void 0 : ae.code) !== "missing-image" || !window.confirm(`${W.message}

Continue and discard the missing image reference?`))
          throw W;
        Kr(X), await oe(!0);
      }
      Oe(X), m === A.key && u(null), v("Segment restored to Cove."), f((W) => W + 1);
    } catch (oe) {
      v(oe.message || "Unable to restore the segment."), oe.status === 409 && f((W) => W + 1);
    } finally {
      p(null);
    }
  }
  async function ue(A) {
    p(A.key), v("");
    try {
      const X = await Z(`/items/${A.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: A.revision })
      });
      if (!Ca(X, v) || !Ws(X))
        return;
      const G = `browse-dependency-delete:${A.itemId}:${X.fingerprint}`;
      await Z(`/items/${A.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(G),
          fingerprint: X.fingerprint
        })
      }), Oe(G), m === A.key && u(null), v(`${X.deletedSegmentCount} segment${X.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), f((ae) => ae + 1);
    } catch (X) {
      v(X.message || "Unable to permanently delete the segment."), X.status === 409 && f((G) => G + 1);
    } finally {
      p(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(_r, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(ta, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: a,
      totalCount: c.totalCount,
      isLoading: C,
      error: $ ? new Error($) : null,
      onRetry: () => f((A) => A + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? Co.filter((A) => A.id !== "performers") : Co,
      objectFilter: i,
      onObjectFilterChange: L,
      customFilterSections: Y,
      searchPlaceholder: "Search segments..."
    }, [
      M ? n(qo, { key: "slots", facets: l, values: j, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: re }) : null,
      n(Od, { key: "player", item: T, index: J, count: c.items.length, onPrevious: () => {
        var A;
        return u((A = c.items[J - 1]) == null ? void 0 : A.key);
      }, onNext: () => {
        var A;
        return u((A = c.items[J + 1]) == null ? void 0 : A.key);
      }, onClose: Q, onNavigate: e }),
      w ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, w) : null,
      !C && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      C ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((A) => n(Dd, {
        key: A.key,
        item: A,
        selected: A.key === m,
        busy: y === A.key,
        onSelect: () => u(A.key),
        onRestore: Ne,
        onPurge: ue
      })))
    ])
  ]);
}
function Pd({ onNavigate: e, profile: t }) {
  const [r, o] = F([]), [i, a] = F(""), [s, l] = F(0), [d, c] = F(!0), [g, m] = F(null), [u, y] = F(""), p = ge(null);
  async function b(v) {
    const C = await Z("/bin", v ? { signal: v } : void 0);
    return o(C.items || []), a(C.fingerprint || ""), l(Number(C.totalCount) || 0), C;
  }
  fe(() => {
    const v = new AbortController();
    return c(!0), b(v.signal).catch((C) => {
      C.name !== "AbortError" && y(C.message);
    }).finally(() => {
      v.signal.aborted || c(!1);
    }), () => v.abort();
  }, []), Qo(Pr, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var v;
      return (v = p.current) == null ? void 0 : v.call(p);
    }
  }]);
  async function f(v) {
    var $;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    m(v.itemId), y("");
    const C = `restore:${v.itemId}:${v.revision}`, H = Re(C);
    try {
      const q = (E = !1) => Z(`/bin/${v.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: H, expectedRevision: v.revision, discardMissingImage: E })
      });
      try {
        await q(Gr(C));
      } catch (E) {
        if ((($ = E.payload) == null ? void 0 : $.code) !== "missing-image" || !window.confirm(`${E.message}

Continue and discard the missing image reference?`)) throw E;
        Kr(C), await q(!0);
      }
      Oe(C), await b(), Nn(), y("Segment restored with a new native ID.");
    } catch (q) {
      y(q.message || "Unable to restore the segment."), q.status === 409 && await b();
    } finally {
      m(null);
    }
  }
  async function w() {
    if (g == null)
      try {
        const v = await Ta({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          m(-1), y("");
        });
        if (v.status !== "emptied") return;
        await b(), Nn(), y(`${v.segmentCount} segment${v.segmentCount === 1 ? "" : "s"} from ${v.sceneCount} scene${v.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (v) {
        y(v.message || "Unable to empty the recycling bin."), v.status === 409 && await b();
      } finally {
        m(null);
      }
  }
  return p.current = w, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    n(_r, {
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
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, v.endSec == null ? we(v.startSec) : `${we(v.startSec)} – ${we(v.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${v.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${v.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: g != null, onClick: () => f(v), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const Vo = "ext:com.midnightrider.segment-studio:videos";
function Nr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = Be(() => {
    var P;
    const j = Xo(Vo), Y = (P = j == null ? void 0 : j.uiOptions) == null ? void 0 : P.displayMode;
    return j ? {
      ...kn,
      defaultFilter: { ...kn.defaultFilter, ...j.findFilter || {} },
      defaultObjectFilter: j.objectFilter || {},
      defaultDisplayMode: kn.allowedDisplayModes.includes(Y) ? Y : kn.defaultDisplayMode
    } : kn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = ea(i), [m, u] = F({ items: [], totalCount: 0 }), [y, p] = F(!0), [b, f] = F(""), [w, v] = F(0), C = ge(0), H = JSON.stringify(a), $ = JSON.stringify(s), q = t || r === "review";
  fe(() => {
    const j = ++C.current, Y = new AbortController();
    return p(!0), f(""), Z(`/videos?${Wl(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: Y.signal }).then((P) => {
      j === C.current && u(P);
    }).catch((P) => {
      j === C.current && P.name !== "AbortError" && f(P.message || "Unable to discover videos.");
    }).finally(() => {
      j === C.current && p(!1);
    }), () => {
      C.current++, Y.abort();
    };
  }, [H, $, t, r, w]);
  function E(j) {
    d({ ...j, page: j.page || 1 });
  }
  function N(j) {
    c(j), d({ ...a, page: 1 });
  }
  const M = t || r === "review" ? Uo : Uo.filter((j) => !["reviewState", "shotBoundaries"].includes(j.id));
  return n("div", { className: "w-full space-y-5" }, [
    n(_r, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(ta, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: Vo,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: E,
      totalCount: m.totalCount,
      isLoading: y,
      error: b ? new Error(b) : null,
      onRetry: () => v((j) => j + 1),
      sortOptions: t || r === "review" ? [...Ko, { value: "unreviewed_count", label: "Unreviewed count" }] : Ko,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: M,
      objectFilter: s,
      onObjectFilterChange: N,
      searchPlaceholder: "Search Segment Studio videos..."
    }, [
      !y && m.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !y && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, m.items.map((j) => n(Vl, { key: j.videoId, item: j, onNavigate: e, showReviewStates: q }))) : null,
      !y && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, m.items.map((j) => n(Jl, { key: j.videoId, item: j, onNavigate: e, showReviewStates: q }))) : null
    ])
  ]);
}
function Jo({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = F(null), [s, l] = F(!0), [d, c] = F(""), g = ge(0), m = ge(0), u = ge(e), y = Dl();
  u.current = e;
  const p = (C) => `/videos/${C}/editor`;
  async function b(C, H, $) {
    const q = await Z(p(H), $ ? { signal: $.signal } : void 0);
    return Lt(C, $ ? g.current : m.current, H, u.current) ? (a(q), !0) : !1;
  }
  fe(() => {
    const C = ++g.current, H = e, $ = new AbortController();
    return a(null), l(!0), c(""), b(C, H, $).catch((q) => {
      Lt(C, g.current, H, u.current) && q.name !== "AbortError" && c(q.message || "Unable to load the editor.");
    }).finally(() => {
      Lt(C, g.current, H, u.current) && l(!1);
    }), () => {
      g.current++, m.current++, $.abort();
    };
  }, [e]);
  function f(C, H) {
    a(($) => ($ == null ? void 0 : $.video.id) !== H ? $ : typeof C == "function" ? C($) : C);
  }
  async function w() {
    const C = e, H = ++m.current;
    try {
      const $ = await Z(p(C));
      return Lt(H, m.current, C, u.current) ? (a($), c("A newer canonical segment was loaded. Your stale change was not applied."), $) : null;
    } catch ($) {
      return Lt(H, m.current, C, u.current) && c($.message || "Unable to reload the latest segment."), null;
    }
  }
  async function v() {
    const C = e, H = ++m.current;
    try {
      const $ = await Z(p(C));
      return Lt(H, m.current, C, u.current) ? (a($), c(""), $) : null;
    } catch ($) {
      return Lt(H, m.current, C, u.current) && c($.message || "Unable to reload performer slots."), null;
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
      n(Oi, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(Sd, {
      key: i.video.id,
      detail: i,
      onDetailChange: f,
      onConflict: w,
      onReload: v,
      onSlotsChanged: v,
      splitLayout: y,
      profile: o,
      initialSegmentId: Mo() ? -Mo() : Ls(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function Ld(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function Fd(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function jd(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function Bd({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = $s(o), l = Ld(e, t, window.location.pathname), d = Fd(e, t, window.location.pathname), c = jd(e, t, window.location.pathname), g = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (As(g, o) === "videos" && g !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Nr, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(Ed, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(Wo, { onNavigate: r, profile: o });
    const y = Number(e);
    return Number.isInteger(y) && y > 0 ? n(Jo, {
      videoId: y,
      onNavigate: r,
      compatibilityMode: !0,
      profile: o
    }) : n(Nr, {
      onNavigate: r,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return n(Pd, { onNavigate: r, profile: o });
  const u = Number(e);
  return d ? n(Wo, { onNavigate: r, profile: o }) : Number.isInteger(u) && u > 0 ? n(Jo, {
    videoId: u,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(Nr, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function Gd({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = F(null), [a, s] = F("");
  return fe(() => {
    const l = new AbortController();
    return Z("/preferences", { signal: l.signal }).then((d) => i(va(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(Bd, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function Kd(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function Ud(e, t) {
  const r = Kd(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const lc = {
  components: { SegmentStudioPage: Gd },
  actionHandlers: { openSegmentStudio: Ud }
};
export {
  Qn as CLEARED_SEGMENT_SELECTION_ID,
  Ko as DISCOVERY_SORT_OPTIONS,
  Nt as SEGMENT_STUDIO_CAPABILITIES,
  Pr as SEGMENT_STUDIO_EXTENSION_ID,
  An as SEGMENT_STUDIO_SHORTCUTS,
  es as activeEditorFilterCount,
  dl as applyDerivationRuleSlotSuggestions,
  Lo as applyFeedbackEditorDelta,
  Oo as applySegmentMergeDelta,
  Ys as basicSegmentTimelineStyle,
  Ps as browseClipEnd,
  Sa as browseEditorHref,
  $o as buildBrowseRequest,
  Nd as buildDerivationRuleGraph,
  Wl as buildDiscoverySearchParams,
  Bi as buildMinuteTimelineTicks,
  kd as buildPerformerSlotOverview,
  Ks as buildSegmentQuickSearchEntries,
  pl as buildSegmentRailRows,
  fl as buildTimelineRows,
  Vd as buildTimelineTicks,
  zi as calculateCenteredTimelineScroll,
  Cr as calculateEditorPanelMaximum,
  Gi as calculateMinuteLabelStride,
  Jd as calculateMinuteTimelineWidth,
  qi as calculateSwimlaneTitleMaximum,
  _i as calculateTimelinePlayheadPosition,
  Fr as calculateTimelineRatioBounds,
  Vi as calculateTimelineRatioFromPointer,
  Yd as calculateVerticalRevealOffset,
  Ft as clampEditorPanelWidth,
  Jn as clampSwimlaneTitleWidth,
  ua as clampTimelineRatio,
  jr as clampTimelineRatioForHeight,
  Zn as clampTimelineZoom,
  zl as compactProvenanceSummary,
  lc as default,
  qs as downloadFileNameFromContentDisposition,
  ts as dualRangeValueFromPointer,
  wo as duplicateIdentityFromResponse,
  ks as duplicateOperationKey,
  Xi as editorVisibilityIncludingSegment,
  hl as expandedSwimlanes,
  Rs as extensionOwnedSegmentsModeSwitchPrompt,
  wl as feedbackFrameTimestamps,
  Il as feedbackResultMatchesAction,
  Nl as feedbackSelectionPlan,
  Qi as filterDerivedSegments,
  xr as filterEditorSegments,
  wd as filterPerformerSlotOverview,
  Gs as filterSegmentQuickSearch,
  tc as filterSegmentStudioShortcuts,
  Sl as findAdjacentSegmentGroupKey,
  Is as findAdjacentShot,
  vs as findEditorShortcut,
  da as findInitialSegmentSelection,
  ji as findNearestSegmentInCurrentSwimlane,
  Ns as findPublishedSelectionIdentity,
  He as findSegmentByStableIdentity,
  Ji as findSegmentFromPlayhead,
  Fi as findSegmentNearPlayhead,
  xl as findSwimlaneRangeSelection,
  Rr as findSwimlaneSelection,
  js as findUniquePerformerSlotAssignment,
  ca as findUnreviewedSelection,
  rr as formatGenderHint,
  Cs as frameStepSeconds,
  ka as generatePerformerSlotAssignmentRecommendations,
  od as groupApprovedDraftsForPublishing,
  Bs as groupAutoAssignCandidates,
  Cl as groupIncorrectExamplesByTag,
  dd as groupMaterializationOutputs,
  jt as groupSegmentsIntoSwimlanes,
  yl as groupSelectedSwimlanes,
  zr as groupSwimlanesBySegmentGroup,
  rt as handleModalKey,
  an as hasSegmentStudioCapability,
  Fo as hideCollectedFeedbackSegments,
  ol as historyActionsForTarget,
  Oa as indexPerformerSlotsBySegment,
  rc as initialReviewFilter,
  Ml as insertSegmentProjection,
  Lt as isCurrentEditorRequest,
  tl as isEditableTarget,
  ac as isEditorShortcutOwner,
  jd as isSegmentStudioBinRoute,
  Fd as isSegmentStudioSegmentsRoute,
  Ld as isSegmentStudioSettingsRoute,
  Id as layoutDerivationRuleComponent,
  Cd as layoutDerivationRuleComponents,
  Al as mergeSegmentsProjection,
  sl as multiSelectionActionHint,
  ds as nextSegmentAfterRemoval,
  cs as nextUnreviewedAfterRemoval,
  Mt as normalizeCollapsedSegmentGroups,
  _o as normalizeDiscoveryIds,
  ut as normalizeEditorSegmentFilters,
  $t as normalizeGender,
  No as normalizeReviewFilter,
  va as normalizeSegmentStudioFeatureProfile,
  nc as normalizeSegmentStudioMode,
  Mr as normalizeSegmentStudioPublicMode,
  rn as parseBrowseSlotFilters,
  Wi as parseEditorLayout,
  Yi as parseHideDerivedSegmentsPreference,
  Zi as parseMergeConfirmationPreference,
  ba as parsePlaybackShortcutConfig,
  bs as parseShortcutBindingOverrides,
  tr as patchSegmentProjection,
  us as percentageSeekTime,
  Fs as performInitialSegmentSeek,
  qe as performerOptionId,
  Xn as performerSlotHistoryState,
  et as performerSlotLabel,
  cl as performerSlotPresentation,
  sc as performerSlotStatus,
  Ur as performerSlotStatusFromSegmentSlots,
  Da as performerSlotsForSegment,
  bt as provenanceSourceLabel,
  wa as rankPerformerOptions,
  kl as reconcileSegmentGroupKey,
  ss as reconcileSelectedSegmentIds,
  Yl as recyclingBinActionText,
  Vs as recyclingBinDeletionPrompt,
  $a as recyclingBinDeletionSummary,
  Es as recyclingBinModeSwitchPrompt,
  Er as removeSegmentsProjection,
  Mo as requestedOwnedItemId,
  Ls as requestedSegmentId,
  rs as resolveEditorSegmentSelection,
  ws as resolveSegmentCreationAction,
  As as resolveSegmentStudioRoute,
  hs as resolveSegmentStudioShortcuts,
  $d as resolveSelectedDerivationRule,
  ms as resolveSelectedSegments,
  xd as restorePublishApprovedFocus,
  Mn as restoreSegmentFieldsProjection,
  Ba as restoreSegmentsProjection,
  ja as revealCollapsedSegmentGroup,
  Ma as segmentBadgeStyle,
  nr as segmentGroupHeaderBackground,
  ft as segmentGroupKeyForSegment,
  Ea as segmentHistoryIdentity,
  qn as segmentHistoryState,
  Aa as segmentRailItemStyle,
  oc as segmentStateStyle,
  Kd as segmentStudioActionTarget,
  $s as segmentStudioLegacyMode,
  Js as segmentTimelineStyle,
  ct as segmentsHistoryState,
  ls as selectAllVideoSegmentIds,
  Ds as selectedBrowseStates,
  La as selectedSwimlaneMerge,
  Ga as setBackLinkNavigation,
  al as sharedPerformerSlotShape,
  il as sharedTagPerformerSlotShape,
  on as shortcutAvailableInMode,
  xs as shortcutBindingDisplayText,
  Zd as shortcutBindingFromEvent,
  Xd as shortcutBindingsOverlap,
  ec as shortcutModesOverlap,
  ys as shortcutRequiresSingleSegment,
  Yn as shotBoundaryFingerprint,
  rl as shouldAcceptCurrentTagFromEnter,
  Qd as shouldExitShortcutCapture,
  ic as shouldHandleEditorShortcut,
  Go as shouldReloadAfterSegmentMutation,
  Tr as shouldRestoreTransitionSelection,
  Us as shouldShowQuickSearchGroups,
  So as splitShortcutCategoriesIntoColumns,
  ll as suggestDerivationRuleSlotMappings,
  $n as swimlaneDisplayLabel,
  el as swimlaneMarkerTop,
  Qs as swimlaneStripeBackground,
  Hi as timelineContentStyle,
  ho as timelinePlayheadHorizontalStyle,
  Zs as timelineSegmentWidth,
  Ki as timelineTickAlignment,
  Ui as timelineTickPosition,
  Ir as timelineTimePercent,
  vl as toggleAllCollapsedSegmentGroups,
  Ss as toggledSelectionReviewState,
  xt as trapModalFocus,
  zs as tryParseJsonResponseText,
  is as updateAnchoredSegmentSelection,
  ns as updateDualRangeValues,
  os as updateSegmentCollectionSelection,
  as as updateSegmentRangeSelection,
  pa as updateSegmentSelection,
  Ho as validateDerivationRuleDraft,
  bo as validateSegmentTiming,
  Br as videoPerformerOptions,
  wr as videoPerformerSlotAssignments,
  Ms as visibleSegmentStudioSettingsTabs,
  Ts as visibleSegmentStudioTabs,
  Pa as visibleVirtualRows
};
