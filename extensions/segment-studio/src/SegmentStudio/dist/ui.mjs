import Zr from "@cove/runtime/react";
import { createPortal as Yi } from "@cove/runtime/react-dom";
import { extensionFetch as xa } from "@cove/runtime/api";
import { formatDuration as Qi, EntityReferenceSelector as jn, useExtensionKeyboardBindings as Zi, VideoPlayer as Sa, useRegisterExtensionKeyboardActions as ka, getDefaultFilter as wa, useListUrlState as Na, ListPage as Ia } from "@cove/runtime/components";
import { ChevronDown as Ca, StepBack as Xi, StepForward as es, Loader2 as ts } from "@cove/runtime/lucide-react";
const Xr = "com.midnightrider.segment-studio", $a = "segment-studio.layout.v1", Wt = "segment-studio.operations.v1", Ta = "segment-studio.collapsed-segment-groups.v1", Aa = "segment-studio.playback-shortcuts.v1", Ra = "segment-studio.timing-clipboard.v1", Ma = "segment-studio.hide-derived-segments.v1", Ea = "segment-studio.merge-confirmation.v1", at = ["unreviewed", "approved", "rejected"], ns = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], Po = "(min-width: 1024px) and (min-height: 640px)", Lo = "(min-width: 1024px) and (min-height: 900px)", Bn = 1e-3, Fo = 15, rs = 30, Da = 12, lt = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, eo = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30
}, Mt = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function jo(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function Oa(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? mr(e, null, 1, !0) ?? r[0] ?? null;
}
function mr(e, t, r, o = !1) {
  var g;
  const i = e.findIndex((u) => u.markers.some((b) => b.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const u = e.flatMap((b) => b.markers.map((m) => m.segment)).filter((b) => b.reviewState === "unreviewed");
    return r < 0 ? u.at(-1) ?? null : u[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((u) => u.segment.id === t);
  if (!o)
    return ((g = (r < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((b) => b.segment.reviewState === "unreviewed")) == null ? void 0 : g.segment) ?? null;
  const l = e.flatMap((u) => u.markers.map((b) => b.segment)), d = l.findIndex((u) => u.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((u) => u.reviewState === "unreviewed") ?? null;
}
function os(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((g, u) => g.markers.filter(({ segment: b }) => {
    const m = Number(b.startSec), y = b.endSec == null ? m + rs : Number(b.endSec);
    return Number.isFinite(m) && Number.isFinite(y) && y >= m && m <= i + Fo + Bn && y >= i - Fo - Bn;
  }).map(({ segment: b }) => ({ segment: b, laneIndex: u }))).sort((g, u) => g.laneIndex - u.laneIndex || Math.abs(g.segment.startSec - i) - Math.abs(u.segment.startSec - i) || g.segment.id - u.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((g) => g.markers.some((u) => u.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((g) => g.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((g) => g.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((g) => g.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function as(e, t, r) {
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
function gr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function Cc(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function is(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function $c(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function ss(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function ls(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function ds(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function cs(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Kr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function us(e, t, r = 10) {
  const o = Kr(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function Bo(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function ms(e, t = Da) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function Pa(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : lt.timelineRatio;
}
function zr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function Ht(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? lt.detailWidth : Math.min(zr(t, 0), Math.max(240, e));
}
function ur(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? lt.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function gs(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function to(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: lt.timelineRatio, maximum: lt.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function no(e, t) {
  const r = Pa(e);
  if (!(t > 0)) return r;
  const o = to(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function ps(e) {
  if (!e) return { ...lt };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? Pa(r) : lt.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: Ht(t == null ? void 0 : t.detailWidth),
      markerRailWidth: Ht(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: ur(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...lt };
  }
}
function fs(e, t, r) {
  return r > 0 ? no((t + r - e) / r, r) : lt.timelineRatio;
}
function Tc(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function ys(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, g) => c.startSec - g.startSec || c.id - g.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= Bn ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function _t(e, t, r, o) {
  return e === t && r === o;
}
const pr = "__segment-studio-cleared-selection__";
function bs(e) {
  return e === "true";
}
function hs(e) {
  return e !== "false";
}
function La() {
  try {
    return hs(window.localStorage.getItem(Ea));
  } catch {
    return !0;
  }
}
function Fa(e) {
  try {
    window.localStorage.setItem(Ea, String(!!e));
  } catch {
  }
}
function vs(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function pt(e = {}) {
  const t = at.filter((g) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(g) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (g, u) => {
    const b = Number(g);
    return Number.isFinite(b) ? Math.min(1, Math.max(0, b)) : u;
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
function Lr(e, t, r, o = !1, i = []) {
  var c, g;
  const a = pt(r), s = a.performerId == null ? null : new Set((t || []).filter((u) => Number(u.performerId) === a.performerId).map((u) => u.segmentId)), l = new Set((i || []).flatMap((u) => u.tags || []).map((u) => Number(u.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((g = (c = (i || []).find((u) => Number(u.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : g.map((u) => Number(u.tagId))) || []);
  return vs(e || [], o).filter((u) => {
    if (u.reviewState != null && !a.reviewStates.includes(u.reviewState) || s && !s.has(u.id) || a.tagId != null && Number(u.tagId) !== a.tagId || d && !d.has(Number(u.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(u.tagId)) || a.sourceKey != null && u.sourceKey !== a.sourceKey) return !1;
    const b = Number(u.confidence);
    return u.confidence == null || !Number.isFinite(b) ? a.includeUnscored : b >= a.confidenceMin && b <= a.confidenceMax;
  });
}
function xs(e, t, r, o = !1, i = []) {
  var l;
  const a = pt(r);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = pt({
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
    filters: pt(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function Ss(e, t = !1) {
  const r = pt(e);
  return +(r.reviewStates.length !== at.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function ks(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function ws(e, t, r, o) {
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
function Ns(e, t, r = null) {
  return t === pr ? null : Oa(
    e,
    t ?? r
  );
}
function ja(e, t, r, o = !1) {
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
function Is(e, t, r) {
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
function Cs(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return ja(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function $s(e, t, r = null, o = !1) {
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
    const u = o ? [.../* @__PURE__ */ new Set([...l, ...i])] : l;
    return {
      ...Cs(u, s, t, g, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: u
    };
  }
  const d = ja(i, a, t, o);
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
function Ts(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function As(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function Go(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function Uo(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => Go(t, o) - Go(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function Rs(e, t, r) {
  var c, g;
  const o = e || [], i = new Set(t || []), a = o.findIndex((u) => (u.markers || []).some(({ segment: b }) => b.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: u }) => u.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const u of o) {
      const b = (u.markers || []).find(({ segment: m }) => !i.has(m.id));
      if (b) return b.segment;
    }
    return null;
  }
  const l = Uo(
    o[a].markers,
    s,
    i
  );
  if (l) return l;
  const d = (g = o.map((u, b) => ({ lane: u, index: b })).filter(({ lane: u }) => (u.markers || []).some(({ segment: b }) => !i.has(b.id))).sort((u, b) => Math.abs(u.index - a) - Math.abs(b.index - a) || +(u.index < a) - +(b.index < a) || u.index - b.index)[0]) == null ? void 0 : g.lane;
  return Uo(d == null ? void 0 : d.markers, s, i);
}
function Ms(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function Es(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function Ds(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function Os() {
  try {
    return bs(window.localStorage.getItem(Ma));
  } catch {
    return !1;
  }
}
function Ps(e) {
  try {
    window.localStorage.setItem(Ma, String(!!e));
  } catch {
  }
}
const zn = [
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
], Ls = /* @__PURE__ */ new Set([
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
function Fs(e) {
  return Ls.has(e);
}
function Ba(e) {
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
function js(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(zn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(Ba).filter(Boolean)]));
  } catch {
    return {};
  }
}
function Bs(e = {}) {
  const t = js(e);
  return zn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function Ko(e, t = 2) {
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
function Ac(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : Ba({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function Rc(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function _r(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function zo(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function Mc(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = zo(e.code, t.key), a = zo(t.code, e.key);
  if (!r && !o && !i && !a) return !1;
  const s = i ? t.key : e.key, l = i ? e.code : a ? t.code : o ? e.code : e.code || t.code;
  for (const d of [!1, !0])
    for (const c of [!1, !0])
      for (const g of [!1, !0])
        for (const u of [!1, !0]) {
          const b = {
            key: s,
            code: l,
            ctrlKey: d,
            metaKey: c,
            altKey: g,
            shiftKey: u
          };
          if (_r(b, e) && _r(b, t)) return !0;
        }
  return !1;
}
function mn(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function Ec(e, t) {
  return [!1, !0].some((r) => mn(e, r) && mn(t, r));
}
function Gs(e, t = !1, r = {}) {
  return Bs(r).find((o) => mn(o, t) && o.bindings.some((i) => _r(e, i))) || null;
}
function Ga(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function Us(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Ga).join(" / ") : "Unassigned";
}
function Dc(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, Us(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function Oc(e) {
  return e === "review" ? "review" : "editor";
}
function ze(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function Ks(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function zs(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function _s(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => ze(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: ze(t, e.activeIdentity) || r[0]
  };
}
function Hs(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function qs(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => Hs(o, i))));
}
function _o(e, t) {
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
function Ws(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function Vs(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function Js(e, t, r) {
  return e != null && (r == null || t !== r);
}
function Hr(e, t) {
  return e === t;
}
function Ys(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function Qs(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - Bn).at(-1) || null : o.find((i) => i.startSec > t + Bn) || null;
}
function Ln(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function Ho(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: at.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function Pc(e, t = null, r = !1) {
  const o = Ho(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function cn(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function Ua(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: cn(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: cn(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: cn(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(cn(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(cn(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(cn(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...eo };
  }
}
function Zs(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function Ka() {
  try {
    return Ua(window.localStorage.getItem(Aa));
  } catch {
    return { ...eo };
  }
}
function qo(e) {
  const t = Ua(JSON.stringify(e));
  try {
    window.localStorage.setItem(Aa, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Et = Object.freeze({
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
function qr(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function za(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? qr(e.requestedMode) : "basic",
    effectiveMode: i ? qr(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function gn(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function Xs(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function el(e) {
  const t = [];
  return gn(e, Et.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), gn(e, Et.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function tl(e) {
  return [
    ["general", "General", Et.settingsGeneral],
    ["shortcuts", "Shortcuts", Et.settingsShortcuts],
    ["performer-slots", "Performer slots", Et.settingsPerformerSlots],
    ["derivation", "Derivation", Et.settingsDerivation]
  ].filter(([, , r]) => gn(e, r)).map(([r, o]) => [r, o]);
}
function nl(e, t) {
  return e === "segments" && !gn(
    t,
    Et.navigationSegmentInventory
  ) || e === "bin" && !gn(
    t,
    Et.recyclingBinView
  ) ? "videos" : e;
}
function rl(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function ol(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const Fr = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, Wo = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: at.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function al(e) {
  const t = String(e || "").split(",").filter((r) => at.includes(r));
  return t.length === 0 ? [...at] : [...new Set(t)];
}
function un(e) {
  return _a(e).values;
}
function _a(e) {
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
function jr(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function Vo(e, t) {
  var l;
  const r = Jo(t.activitiesCriterion, t.activityId), o = Jo(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = _a(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: il(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function Jo(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function il(e, t) {
  return at.includes(e == null ? void 0 : e.value) ? [e.value] : al(t);
}
function Ha(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function sl(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function ll(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Yo(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function dl(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function Ye(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function ro(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Br(e, t) {
  const r = new Set(ro(t).map((o) => String(Ye(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function Ft(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function Qo(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(Ft).sort().join(",")}`;
}
function qa(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((m) => String(m.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((m) => {
    var y;
    return !((y = m.genderHints) != null && y.length);
  }) && e.length === t.length && !i) {
    const m = [...e].sort((x, h) => String(x.slotDefinitionId).localeCompare(String(h.slotDefinitionId))), y = [...t].sort((x, h) => String(x.name).localeCompare(String(h.name)) || Number(Ye(x)) - Number(Ye(h)));
    return [{
      assignments: Object.fromEntries(m.map((x, h) => [String(x.slotDefinitionId), String(Ye(y[h]))])),
      description: y.map((x) => x.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((m) => t.map((y, x) => ({ performer: y, index: x })).filter(({ performer: y }) => {
    var x;
    return !((x = m.genderHints) != null && x.length) || m.genderHints.some((h) => Ft(h) === Ft(y.gender || y.genderIdentity));
  }).map(({ index: y }) => y)), g = i ? c.filter((m) => m.length > 0).length : Zo(c, t.length);
  if (g === 0) return [];
  const u = new Map(t.map((m, y) => [String(Ye(m)), y]));
  function b(m, y, x) {
    if (s.length >= a) return;
    const h = c.slice(m), w = i ? h.filter((P) => P.length > 0).length : Zo(h.map((P) => P.filter((G) => !y.has(String(Ye(t[G]))))), t.length);
    if (x + w < g) return;
    if (m === e.length) {
      if (x !== g) return;
      const P = Object.fromEntries(d.map(({ slot: C, performer: N }) => [String(C.slotDefinitionId), N ? String(Ye(N)) : ""])), G = o.length === 0 ? Object.values(P).sort().join(",") : [...new Set(e.map((C) => String(C.label || "")))].map((C) => `${C}:${d.filter(({ slot: N }) => String(N.label || "") === C).map(({ performer: N }) => N ? String(Ye(N)) : "").sort().join(",")}`).join("|");
      !l.has(G) && s.length < a && (l.add(G), s.push({
        assignments: P,
        description: d.map(({ slot: C, performer: N }) => o.length ? `${C.label}: ${(N == null ? void 0 : N.name) || "Unassigned"}` : (N == null ? void 0 : N.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const S = e[m], O = [...d].reverse().find(({ slot: P }) => Qo(P) === Qo(S)), $ = O ? u.get(String(Ye(O.performer))) : -1;
    for (const P of c[m]) {
      const G = t[P], C = Ye(G);
      if (!(P < $) && !(C == null || !i && y.has(String(C))) && (d.push({ slot: S, performer: G }), i || y.add(String(C)), b(m + 1, y, x + 1), i || y.delete(String(C)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: S, performer: null }), b(m + 1, y, x), d.pop();
  }
  return b(0, /* @__PURE__ */ new Set(), 0), s;
}
function Zo(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function cl(e, t) {
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
      const u = [...new Set(e.map((b) => b.label || ""))].map((b) => `${b}:${a.filter((m) => (m.slot.label || "") === b).map((m) => m.performer.performerId).sort((m, y) => m - y).join(",")}`).join("|");
      i.has(u) || i.set(u, [...a]);
      return;
    }
    const c = e[l];
    for (const u of t)
      !o && d.has(u.performerId) || (g = c.genderHints) != null && g.length && !c.genderHints.some((b) => Ft(b) === Ft(u.gender)) || (a.push({ slot: c, performer: u }), o || d.add(u.performerId), s(l + 1, d), o || d.delete(u.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function ul(e) {
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
function ml(e, t, r = 20) {
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
function gl(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function pl(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function Wa(e, t, r) {
  const o = Ye, i = new Set((t || []).map(o)), a = new Set((r || []).map(Ft));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const u = Ft(l.gender || l.genderIdentity), b = Ft(d.gender || d.genderIdentity), m = l.matchesGenderHint ?? a.has(u);
    return (d.matchesGenderHint ?? a.has(b)) - m || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: ye, useId: Va, useMemo: Ue, useRef: ge, useState: L } = Zr, n = Zr.createElement, Ja = "/api/plugins/segment-studio";
function Fe(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Wt) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = Wr();
    return t[e] = r, window.localStorage.setItem(Wt, JSON.stringify(t)), r;
  } catch {
    return Wr();
  }
}
function Be(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Wt) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(Wt, JSON.stringify(t));
  } catch {
  }
}
function oo(e) {
  try {
    return JSON.parse(window.localStorage.getItem(Wt) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function ao(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Wt) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(Wt, JSON.stringify(t));
  } catch {
  }
}
function fl(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function yl(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function Z(e, t, r = 0) {
  var d;
  const o = await xa(`${Ja}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = fl(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await yl(250 * (r + 1), t == null ? void 0 : t.signal), Z(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function bl(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${Ja}${e}`, o = await xa(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: hl(
      o.headers.get("Content-Disposition")
    )
  };
}
function hl(e, t = "segment-studio-ai-feedback.zip") {
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
function Ae(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function Wr() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function Ya(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function vl(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function Qa(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function xl(e, t) {
  const { sceneCount: r, segmentCount: o } = Qa(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function Za(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = Qa(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(xl(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await Z("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Fe(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return Be(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function Xo({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const kt = {
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
function Lc(e, t) {
  return {
    ...(kt[e] || kt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function Xa(e) {
  return { ...(kt[e] || kt.unreviewed).badge };
}
function ei(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const ti = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function Sl(e, t, r = "not-applicable", o = !1) {
  const i = kt[e] || kt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function kl(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function wl(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function Nl(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function Il(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function hr(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function Cl(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function Vt({ state: e, includeLabel: t = !0 }) {
  const r = kt[e] || kt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: Xa(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function $l(e, t = null) {
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
function Fc(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function Tl(e, t = document) {
  return !(e.defaultPrevented || $l(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function jc(e, t = document, r = !1, o = {}) {
  return Tl(e, t) ? Gs(e, r, o) != null : !1;
}
function dt(e, { onCancel: t, onConfirm: r } = {}) {
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
function Al(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function Rl({ confirm: e, cancel: t, confirmReady: r }) {
  const o = r && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function io({ confirmRef: e, cancelRef: t, confirmReady: r }) {
  ye(() => {
    const o = requestAnimationFrame(() => Rl({
      confirm: e.current,
      cancel: t == null ? void 0 : t.current,
      confirmReady: r
    }));
    return () => cancelAnimationFrame(o);
  }, [r]);
}
function $t(e) {
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
function Ml(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? i.filter((a) => a.sequence > o && a.sequence <= r).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > r && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function so(e, t = !0) {
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
function sr(e, t = !0) {
  return {
    type: "segment",
    identity: so(e, t),
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
function gt(e, t = !0) {
  return {
    type: "segments",
    segments: (e || []).map((r) => ({
      identity: so(r, t),
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
function lr(e, t) {
  return {
    type: "incorrectExamples",
    collected: t,
    entries: (e || []).map(({ segment: r, result: o, example: i }) => ({
      exampleId: (o == null ? void 0 : o.exampleId) ?? (i == null ? void 0 : i.id) ?? null,
      originalIdentity: so(r),
      collectedIdentity: {
        itemId: (o == null ? void 0 : o.itemId) ?? (i == null ? void 0 : i.itemId) ?? null,
        nativeSegmentId: (o == null ? void 0 : o.nativeSegmentId) ?? null,
        published: (o == null ? void 0 : o.nativeSegmentId) != null,
        revision: (o == null ? void 0 : o.revision) ?? null
      }
    }))
  };
}
function fr(e) {
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
function ni(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function ri(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = t.get(r.segmentId);
    o ? o.push(r) : t.set(r.segmentId, [r]);
  }
  for (const r of t.values())
    r.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function lo(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function El(e, t) {
  const r = (t || []).map((i) => ni(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: it(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function Dl(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : El(e, t);
}
function Ol({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function Bc(e, t) {
  return lo(ni(e, t));
}
function it(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function Pl(e, t) {
  const r = (d) => it(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
    const c = /* @__PURE__ */ new Map();
    for (const g of d || []) {
      const u = r(g);
      c.has(u) || c.set(u, []), c.get(u).push(g);
    }
    return c;
  }, a = i(e), s = i(t), l = [];
  for (const [d, c] of a) {
    const g = s.get(d);
    if (!g || c.length !== g.length)
      continue;
    const u = [...c].sort(o), b = [...g].sort(o);
    u.forEach((m, y) => l.push({
      sourceSlotDefinitionId: m.id,
      derivedSlotDefinitionId: b[y].id
    }));
  }
  return l;
}
function Ll(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = Pl(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function Fl(e) {
  const t = it(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(vr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function vr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function yr(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function ea(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((g) => g.end <= s && g.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: yr(o),
    trackCount: Math.max(1, t.length)
  };
}
function jl(e) {
  const t = e.map(it), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function Bl(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], g = d.length > 0 && d.every((u) => Number(u.performerId) > 0) ? d.map((u) => `${u.slotDefinitionId}:${Number(u.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: g };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [ea({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = jl(l.slots), g = l.slots.filter((x) => !a.has(String(x.slotDefinitionId))), u = o.length === 1 ? l.slots : g, b = u.map((x) => `${c.get(String(x.slotDefinitionId))} · ${x.performerName || `Performer ${x.performerId}`}`).join(" · "), m = [...new Map(u.map((x) => [
          Number(x.performerId),
          { id: Number(x.performerId), name: x.performerName || `Performer ${x.performerId}` }
        ])).values()], y = l.slots.map((x) => ({
          slotDefinitionId: String(x.slotDefinitionId),
          label: c.get(String(x.slotDefinitionId)),
          performer: {
            id: Number(x.performerId),
            name: x.performerName || `Performer ${x.performerId}`
          }
        }));
        s.set(d, {
          ...e,
          key: `${e.key}:performers:${d}`,
          performerLabel: b,
          performers: m,
          performerAssignments: y,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(ea);
}
function qt(e, t = [], r = []) {
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => Bl(s, a));
}
function co(e) {
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
    for (const s of at)
      a.counts[s] += Number((r = o.counts) == null ? void 0 : r[s]) || 0;
  }
  return t;
}
const Gl = {
  group: 38,
  lane: 33,
  segment: 41
};
function Ul(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = Gl[s.kind];
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
function oi(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function Kl(e, t = [], r = !0) {
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
function zl(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: yr(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return co(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: yr(a)
    };
  });
}
function ai(e, { nativeOnly: t = !1 } = {}) {
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
function ta(e, t) {
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
function Bt(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function Gn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function _l(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var r;
    return (r = t[0]) == null ? void 0 : r.toUpperCase();
  }).join("") || "?";
}
function Un({ performer: e, compact: t = !1, tooltip: r = null }) {
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
    }, o ? _l(e.name) : "—"),
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
function ii({ assignments: e, className: t = "" }) {
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
      n(Un, {
        key: `${r.key}:avatar`,
        performer: r.performer
      })
    ];
  }));
}
function xr({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = ge(null), i = `performer-slots-${Va()}`, [a, s] = L(null);
  function l() {
    var m;
    const c = (m = o.current) == null ? void 0 : m.getBoundingClientRect();
    if (!c) return;
    const g = Math.max(0, Math.min(256, window.innerWidth - 16)), u = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), b = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - g - 8, c.right - g)),
      top: b >= u + 8 ? c.bottom + 4 : Math.max(8, c.top - u - 4),
      width: g
    });
  }
  ye(() => {
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
    ...e.slice(0, 3).map((c) => n(Un, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? Yi(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(ii, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : n("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => n(Un, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function Hl(e, t) {
  const r = new Set(Bt(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function si(e, t) {
  return t ? Bt(e).filter((r) => r !== t) : Bt(e);
}
function ql(e, t) {
  const r = Bt(t), o = new Set(Bt(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function St(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function na(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), g = Number.isFinite(c) && c >= d ? c : d, u = d <= o && g >= o, b = u ? 0 : Math.min(Math.abs(o - d), Math.abs(o - g));
    return { contains: u, distance: b, duration: g - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function Vr(e, t, r, o = null) {
  var g, u, b, m, y, x;
  const i = e.findIndex((h) => h.markers.some((w) => w.segment.id === t));
  if (i < 0) {
    const h = [...((g = e[0]) == null ? void 0 : g.markers) || []];
    return o != null && Number.isFinite(Number(o)) && h.sort((w, S) => na(w, S, o)), ((u = h[0]) == null ? void 0 : u.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((h) => h.segment.id === t);
  if (r === "left" || r === "right") {
    const h = r === "left" ? -1 : 1, w = Math.min(a.markers.length - 1, Math.max(0, s + h));
    return ((b = a.markers[w]) == null ? void 0 : b.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((m = a.markers[s]) == null ? void 0 : m.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((y = a.markers[s]) == null ? void 0 : y.segment) ?? null : ((x = [...e[l].markers].sort(c ? (h, w) => na(h, w, Number(o)) : (h, w) => Math.abs(h.segment.startSec - d) - Math.abs(w.segment.startSec - d) || h.segment.startSec - w.segment.startSec || h.segment.id - w.segment.id)[0]) == null ? void 0 : x.segment) ?? null;
}
function Wl(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = Vr([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function Vl(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function Jl(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function Yl(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [aa(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => aa(Math.min(s, r + l))))];
}
function Ql(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function Zl(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function Jr(e, t) {
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
    const u = Number(c);
    r.has(u) && !o.has(u) || (d[o.get(u) ?? c] = g);
  }
  return {
    ...e,
    approvedSetVersion: t.approvedSetVersion || e.approvedSetVersion,
    segments: a,
    performerSlots: l,
    performerSlotRevisions: d
  };
}
function ra(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function Xl(e) {
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
async function ed(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await oa(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], g = Yl(
        d.startSec,
        d.endSec
      );
      for (const [u, b] of g.entries()) {
        Math.abs(r.currentTime - b) > 5e-4 && (r.currentTime = b, await oa(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const m = await td(o), y = `example-${l + 1}-frame-${u + 1}`;
        c.push({ fieldName: y, timestampSec: b }), s.push({
          fieldName: y,
          file: new File(
            [m],
            `${y}.jpg`,
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
function oa(e, t) {
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
function td(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function aa(e) {
  return Math.round(e * 1e3) / 1e3;
}
function br(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function nd(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function Yr(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function Kn(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function li(e, t) {
  const r = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...r.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Gr(e, t, r, o) {
  const i = (r || []).map((d) => ({ ...d, segmentId: t })), a = e.performerSlots || [], s = a.findIndex((d) => d.segmentId === t), l = a.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...i), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function rd(e, t) {
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
function ia(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function od(e) {
  const { compatibilityMode: t, currentTime: r, detail: o, editorFilters: i, endInput: a, hideDerivedSegments: s, historyRef: l, mediaDuration: d, onConflict: c, onDetailChange: g, onReload: u, optimisticSegmentIdRef: b, pendingDuplicateRef: m, pendingFirstSegmentStartSecRef: y, pendingTagEditSegmentIdRef: x, queuedCreatedSegmentTagRef: h, replaceSegmentSelection: w, savingSegmentId: S, segments: O, selectedSegment: $, selectedSegmentIdRef: P, selectedSegments: G, selectionAnchorIdRef: C, selectionRangeBaseIdsRef: N, setCreatingSegmentId: E, setEditorFilters: R, setFirstSegmentTagOpen: K, setHideDerivedSegments: ae, setHistory: W, setHistoryOpen: k, setPublishApprovedError: T, setSaveMessage: M, setSavingSegmentId: H, setSelectedSegmentGroupKey: se, setSelectedSegmentId: le, setSelectedSegmentIds: pe, setTagEditing: _, startInput: ne, tagEditingRef: ce, timelineDuration: oe, video: ue } = e;
  function he(f) {
    l.current = f || Mt, W(l.current);
  }
  async function V(f, p, v, A, te = null) {
    var J;
    try {
      const q = await Z(`/videos/${ue.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: l.current.revision,
          kind: f,
          label: p,
          beforeState: v,
          afterState: A,
          receiptId: te
        })
      });
      return he(q), !0;
    } catch (q) {
      return q.status === 409 && ((J = q.payload) != null && J.current) && he(q.payload.current), M("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function D(f, p, v = !0, A = null, te = !1, J = p) {
    var U;
    if (!f || S != null) return null;
    const q = G.map((fe) => fe.id), ve = P.current, z = v && !t ? crypto.randomUUID() : null;
    H(f.id), M(v ? "Saving directly to Cove…" : "Restoring history…");
    const ee = te ? br(o, [f.id], J) : null;
    ee && g(ee, ue.id);
    try {
      if (t && f.nativeSegmentId == null && f.itemId != null) {
        const X = `draft-update:${ue.id}:${f.itemId}:${f.revision}:${p.tagId}:${p.startSec}:${p.endSec ?? "open"}:${p.reviewState ?? f.reviewState}`, xe = await Z(`/videos/${ue.id}/drafts/${f.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(X),
            expectedRevision: f.revision,
            startSec: p.startSec,
            endSec: p.endSec,
            tagId: p.tagId,
            reviewState: p.reviewState
          })
        });
        Be(X);
        const be = {
          ...f,
          ...xe.draft,
          id: f.id,
          itemId: f.itemId
        };
        return v && await V(
          "segment.update",
          A || "Changed segment",
          sr(f, t),
          sr(
            be,
            t
          )
        ), ia(f, p, t) ? await u() : g({
          ...o,
          approvedSetVersion: xe.approvedSetVersion || o.approvedSetVersion,
          segments: O.map((ie) => ie.id === f.id ? be : ie).sort((ie, ke) => ie.startSec - ke.startSec || ie.id - ke.id)
        }, ue.id), M(((U = xe.draft) == null ? void 0 : U.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), be;
      }
      const fe = await Z(`/videos/${ue.id}/segments/${f.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...p,
          expectedUpdatedAt: f.updatedAt,
          historyReceiptId: z
        })
      }), Ee = {
        ...f,
        ...fe,
        reviewState: p.reviewState ?? f.reviewState
      }, Q = O.map((X) => X.id === f.id ? Ee : X).sort((X, xe) => X.startSec - xe.startSec || X.id - xe.id);
      return ia(f, p, t) ? await u() : g({ ...o, segments: Q }, ue.id), v && await V(
        "segment.update",
        A || "Changed segment",
        sr(f, t),
        sr(
          Ee,
          t
        ),
        z
      ), M(v ? "Saved to Cove" : "History restored"), Ee;
    } catch (fe) {
      return te && (g((Ee) => Kn(
        Ee,
        [f],
        Object.keys(J)
      ), ue.id), pe(q), le(ve), C.current = ve, N.current = []), fe.status === 409 ? (M("Conflict — loading the latest segment…"), await c()) : M(fe.message || "Unable to save the segment."), null;
    } finally {
      H(null);
    }
  }
  async function re() {
    if (!t) return !1;
    const f = O.filter((v) => !v.published && v.reviewState === "approved").length;
    if (f === 0 || S != null) return !1;
    const p = `complete-review:${ue.id}:${o.approvedSetVersion}`;
    T(""), H(-1), M(`Publishing ${f} Approved draft${f === 1 ? "" : "s"}…`);
    try {
      const v = await Z(`/videos/${ue.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(p),
          expectedApprovedSetVersion: o.approvedSetVersion
        })
      });
      Be(p), he(Mt), k(!1);
      const A = await u(), te = Ys(
        O,
        P.current,
        v.published
      ), J = te ? ze(A == null ? void 0 : A.segments, te) : null;
      return J && le(J.id), M(`${v.published.length} Approved draft${v.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (v) {
      const A = v.status === 409 ? "The approved drafts changed. Review the updated list and try again." : v.message || "Unable to publish the approved drafts.";
      return v.status === 409 && await c(), T(A), M(A), !1;
    } finally {
      H(null);
    }
  }
  async function Ie(f = null, p = null) {
    var Ee, Q, X;
    if (S != null) return;
    const v = f != null ? y.current : null, A = Number.isFinite(v) ? v : r, te = Math.min(oe, A + 20);
    if (te <= A) {
      M("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const J = Vs(O, $, f);
    if (J.kind === "choose-tag") {
      y.current = A, M(""), K(!0);
      return;
    }
    if (J.kind === "invalid-selection") {
      M("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: q } = J, ve = `create-draft:${ue.id}:${q}:${A}`, z = t ? null : crypto.randomUUID(), ee = P.current, U = {
      ...$ || {},
      id: b.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: q,
      tagName: p || ($ == null ? void 0 : $.tagName) || "Tag segment",
      tagSortName: q === ($ == null ? void 0 : $.tagId) && ($ == null ? void 0 : $.tagSortName) || null,
      startSec: A,
      endSec: te,
      reviewState: "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, fe = nd(o, U);
    H(-1), K(!1), g(fe, ue.id), J.openTagEditor && (E(U.id), x.current = U.id, _(!0)), w(U.id), se(St(
      qt(fe.segments, fe.segmentGroups || [], fe.performerSlots || []),
      U.id
    ));
    try {
      let xe;
      if (t) {
        const ke = await Z(`/videos/${ue.id}/drafts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationId: Fe(ve), tagId: q, startSec: A, endSec: te })
        });
        Be(ve), xe = { itemId: (Ee = ke.draft) == null ? void 0 : Ee.itemId };
      } else
        xe = { nativeSegmentId: (await Z(`/videos/${ue.id}/segments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tagId: q,
            startSec: A,
            endSec: te,
            historyReceiptId: z
          })
        })).id };
      y.current = null, K(!1);
      const be = await u();
      if (!be) {
        g((ke) => Yr(
          ke,
          [U.id]
        ), ue.id), w(ee), M("Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment.");
        return;
      }
      const ie = ze(be == null ? void 0 : be.segments, xe);
      ie ? (J.openTagEditor && (ce.current && (x.current = ie.id), ((Q = h.current) == null ? void 0 : Q.segmentId) === U.id && (h.current = { ...h.current, segmentId: ie.id }), E(ie.id)), w(ie.id), se(St(
        qt(be.segments || [], be.segmentGroups || [], be.performerSlots || []),
        ie.id
      )), t || await V(
        "segment.create",
        "Created segment",
        gt([], !1),
        gt([ie], !1),
        z
      )) : (_(!1), M("Segment created, but it could not be selected."));
    } catch (xe) {
      g((be) => Yr(
        be,
        [U.id]
      ), ue.id), w(ee), f != null && K(!0), M(xe.message || "Unable to create the draft.");
    } finally {
      ((X = h.current) == null ? void 0 : X.segmentId) === U.id && (h.current = null), E(null), H(null);
    }
  }
  async function Y() {
    if (G.length !== 1 || !$ || S != null) return;
    const f = r;
    if (f <= $.startSec || $.endSec != null && f >= $.endSec) {
      M("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const p = `split-draft:${$.itemId}:${$.revision}:${f}`, v = t ? null : gt([$], !1), A = t ? null : crypto.randomUUID();
    H($.id);
    try {
      let te = null;
      t && $.nativeSegmentId == null ? (await Z(`/videos/${ue.id}/drafts/${$.itemId}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(p),
          expectedRevision: $.revision,
          splitSec: f
        })
      }), Be(p)) : te = { nativeSegmentId: (await Z(`/videos/${ue.id}/segments/${$.id}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedUpdatedAt: $.updatedAt,
          splitSec: f,
          historyReceiptId: A
        })
      })).id };
      const J = await u();
      if (!t) {
        const q = [
          ze(J == null ? void 0 : J.segments, {
            nativeSegmentId: $.nativeSegmentId ?? $.id
          }),
          ze(
            J == null ? void 0 : J.segments,
            te
          )
        ].filter(Boolean);
        await V(
          "segment.split",
          "Split segment",
          v,
          gt(q, !1),
          A
        );
      }
      M(t ? `Segment split; both ranges remain ${$.reviewState}.` : "Segment split.");
    } catch (te) {
      te.status === 409 ? await c() : M(te.message || "Unable to split the draft.");
    } finally {
      H(null);
    }
  }
  async function F(f = !1) {
    var te, J;
    if (G.length !== 1 || !$ || S != null) return;
    const p = f ? r : $.startSec, v = Ws(ue.id, $, f, p), A = t ? null : crypto.randomUUID();
    H($.id);
    try {
      const q = ((te = m.current) == null ? void 0 : te.operationKey) === v ? m.current : null;
      let ve = (q == null ? void 0 : q.duplicateIdentity) ?? null;
      if (ve == null && t && $.nativeSegmentId == null) {
        const U = await Z(`/videos/${ue.id}/drafts/${$.itemId}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(v),
            expectedRevision: $.revision,
            startSec: f ? p : null
          })
        });
        ve = _o(!1, U), m.current = { operationKey: v, duplicateIdentity: ve };
      } else if (ve == null) {
        const U = await Z(`/videos/${ue.id}/segments/${$.id}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: $.updatedAt,
            startSec: f ? p : null,
            historyReceiptId: A
          })
        });
        ve = _o(!0, U), m.current = { operationKey: v, duplicateIdentity: ve };
      }
      const z = await u(), ee = ze(z == null ? void 0 : z.segments, ve);
      if (ee) {
        t || await V(
          "segment.duplicate",
          "Duplicated segment",
          gt([], !1),
          gt([ee], !1),
          A
        );
        const U = xs(
          ee,
          z.performerSlots || [],
          i,
          s,
          z.segmentGroups || []
        );
        R(U.filters), ae(U.hideDerivedSegments), pe([ee.id]), le(ee.id), C.current = ee.id, N.current = [], se(St(
          qt(z.segments || [], z.segmentGroups || [], z.performerSlots || []),
          ee.id
        )), t && $.nativeSegmentId == null && Be(v), m.current = null, M(f ? "Duplicate created at the playhead." : "Duplicate created in place.");
      } else
        M("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
    } catch (q) {
      ((J = m.current) == null ? void 0 : J.operationKey) === v ? M("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : q.status === 409 ? await c() : M(q.message || "Unable to duplicate the draft.");
    } finally {
      H(null);
    }
  }
  async function Me() {
    if (G.length !== 1 || !$) return;
    const f = Number(ne), p = a.trim() === "" ? null : Number(a), v = jo(f, p, d);
    if (v.error) {
      M(v.error);
      return;
    }
    if (f === $.startSec && p === $.endSec) {
      M("Timing is unchanged.");
      return;
    }
    await D($, { startSec: f, endSec: p, tagId: $.tagId }, !0, null, !0);
  }
  async function I(f, p) {
    if (G.length !== 1 || !$) return;
    const v = jo(f, p, d);
    if (v.error) {
      M(v.error);
      return;
    }
    if (f === $.startSec && p === $.endSec) {
      M("Timing is unchanged.");
      return;
    }
    await D($, { startSec: f, endSec: p, tagId: $.tagId }, !0, null, !0);
  }
  return { acceptHistory: he, recordHistoryAction: V, mutateSegment: D, completeReview: re, createSegment: Ie, splitSegment: Y, duplicateSegment: F, saveTiming: Me, applyShortcutTiming: I };
}
function ad() {
  const [e, t] = L(() => typeof window < "u" && window.matchMedia(Po).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Po), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function id() {
  const [e, t] = L(() => typeof window < "u" && window.matchMedia(Lo).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Lo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function sd() {
  try {
    return ps(window.localStorage.getItem($a));
  } catch {
    return { ...lt };
  }
}
function ld() {
  try {
    return Bt(JSON.parse(window.localStorage.getItem(Ta) || "[]"));
  } catch {
    return [];
  }
}
function dd(e) {
  try {
    window.localStorage.setItem(Ta, JSON.stringify(Bt(e)));
  } catch {
  }
}
function cd(e) {
  try {
    window.localStorage.setItem($a, JSON.stringify(e));
  } catch {
  }
}
function ud() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Ra) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function md(e) {
  try {
    return window.localStorage.setItem(Ra, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function gd({ status: e }) {
  const t = ti[e];
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
function jt({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, at.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...Xa(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${kt[t].symbol}${e[t]}`)));
}
function pd({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: g, shortcutRef: u }) {
  const b = ro(a), [m, y] = L(() => Br(o, b)), [x, h] = L(!1), [w, S] = L(""), O = ge(!1), $ = o.map((R) => `${R.slotDefinitionId}:${R.performerId || ""}`).join("|"), P = b.map((R) => Ye(R)).join("|"), G = qa(
    o,
    b
  );
  ye(() => {
    y(Br(o, b)), S("");
  }, [t, r, $, P]);
  async function C(R = m) {
    if (!O.current) {
      O.current = !0, h(!0), S("Saving performer slots…");
      try {
        const K = Br(o.map((k) => ({
          ...k,
          performerId: R[k.slotDefinitionId] || null
        })), b), ae = o.map((k) => {
          const T = K[k.slotDefinitionId] ? Number(K[k.slotDefinitionId]) : null, M = b.find((H) => String(Ye(H)) === String(T));
          return {
            ...k,
            performerId: T,
            performerName: (M == null ? void 0 : M.name) || null
          };
        });
        s(ae);
        const W = await Z(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((k) => ({ slotDefinitionId: k.slotDefinitionId, performerId: K[k.slotDefinitionId] ? Number(K[k.slotDefinitionId]) : null }))
          })
        });
        S("Performer slots saved."), await l(W, {
          beforeState: fr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: fr([{
            segmentId: t,
            itemId: r,
            revision: W.revision,
            slots: W.slots || []
          }])
        });
      } catch (K) {
        d && await d(o, K), K.status === 409 ? (S("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : S(K.message || "Unable to save performer slots.");
      } finally {
        O.current = !1, h(!1);
      }
    }
  }
  function N(R, K) {
    S(`Option ${K + 1} applied; save to confirm.`), y({ ...m, ...R.assignments });
  }
  async function E(R) {
    const K = { ...m, ...R.assignments };
    y(K), await C(K);
  }
  return ye(() => {
    if (u)
      return u.current = (R) => O.current || !G[R] ? !1 : (E(G[R]), !0), () => {
        u.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    G.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, G.map((R, K) => n("button", {
        key: K,
        type: "button",
        disabled: x,
        onClick: () => N(R, K),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${K + 1}: ${R.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, K + 1),
        n("span", { key: "description" }, R.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${G.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((R) => n("label", { key: R.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, it(R)),
      (R.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(R.genderHints || []).map(vr).join(" · ")}`) : null,
      n("select", { key: "select", value: m[R.slotDefinitionId] || "", disabled: x, onChange: (K) => y({ ...m, [R.slotDefinitionId]: K.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Wa(b, b, R.genderHints).map((K) => n("option", { key: Ye(K), value: Ye(K) }, K.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: g, type: "button", disabled: x, onClick: () => C(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, w)])
  ]);
}
function fd({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a }) {
  var G;
  const s = ((G = t[0]) == null ? void 0 : G.slots) || [], l = ro(r), d = qa(
    s,
    l
  ), c = "__mixed__", g = () => Object.fromEntries(s.map((C, N) => {
    const E = t.map((R) => {
      var K;
      return String(((K = R.slots[N]) == null ? void 0 : K.performerId) || "");
    });
    return [C.slotDefinitionId, E.every((R) => R === E[0]) ? E[0] : c];
  })), [u, b] = L(g), [m, y] = L(!1), [x, h] = L(""), w = ge(!1), S = t.map((C) => `${C.itemId ?? `native:${C.segmentId}`}:${C.revision}:${C.slots.map((N) => `${N.slotDefinitionId}:${N.performerId || ""}`).join(",")}`).join("|");
  ye(() => {
    b(g());
  }, [S]);
  async function O(C = u) {
    if (w.current) return;
    w.current = !0, y(!0), h(`Saving performer slots for ${t.length} segments…`);
    const N = [];
    try {
      for (const E of t) {
        const R = E.slots.map((ae, W) => {
          const k = C[s[W].slotDefinitionId];
          return {
            slotDefinitionId: ae.slotDefinitionId,
            performerId: k === c ? ae.performerId || null : k ? Number(k) : null
          };
        }), K = await Z(E.itemId != null ? `/videos/${e}/drafts/${E.itemId}/slots` : `/videos/${e}/segments/${E.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: E.revision, assignments: R })
        });
        N.push({
          segmentId: E.segmentId,
          itemId: E.itemId,
          revision: K.revision,
          slots: K.slots || []
        });
      }
      h("Performer slots saved."), o({
        beforeState: fr(t),
        afterState: fr(N)
      });
    } catch (E) {
      const R = await i();
      E.status === 409 ? h(R ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : h(E.message || (R ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      w.current = !1, y(!1);
    }
  }
  function $(C, N) {
    h(`Option ${N + 1} applied; save to confirm.`), b({ ...u, ...C.assignments });
  }
  async function P(C) {
    const N = { ...u, ...C.assignments };
    b(N), await O(N);
  }
  return ye(() => {
    if (a)
      return a.current = (C) => w.current || !d[C] ? !1 : (P(d[C]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, d.map((C, N) => n("button", {
        key: N,
        type: "button",
        disabled: m,
        onClick: () => $(C, N),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${N + 1} to all selected segments: ${C.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, N + 1),
        n("span", { key: "description" }, C.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${d.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, s.map((C) => n("label", {
      key: C.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, it(C)),
      n("select", {
        key: "select",
        value: u[C.slotDefinitionId] || "",
        disabled: m,
        onChange: (N) => b({ ...u, [C.slotDefinitionId]: N.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        u[C.slotDefinitionId] === c ? n("option", { key: "mixed", value: c }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Wa(l, l, C.genderHints).map((N) => n("option", {
          key: Ye(N),
          value: Ye(N)
        }, N.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: m,
        onClick: () => O(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, x)
    ])
  ]);
}
function wt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function yd(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return wt(t);
  const o = [...new Set(r.map((i) => wt(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function Sr() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function dr({ name: e }) {
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
function bd({ hidden: e }) {
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
    n(Sr, { key: "derived" })
  ]);
}
function hd({ segment: e, provenance: t }) {
  var g;
  const [r, o] = L(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = yd(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
  return n("section", { "aria-label": "Segment provenance", className: "rounded-md border border-border bg-surface" }, [
    n("button", {
      key: "toggle",
      type: "button",
      onClick: () => o((u) => !u),
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
      ) : s.map((u) => {
        const b = u.modelIdentifier || u.modelKey, m = u.value == null ? null : typeof u.value == "string" ? u.value : JSON.stringify(u.value);
        return n("div", { key: u.id || `${u.fieldKey}:${u.sourceKey}:${u.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            wt(u.sourceKey, u.sourceDisplayName)
          ),
          u.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${u.fieldKey}${m == null ? "" : ` · ${m}`}`
          ) : null,
          u.relation === "inherited" ? n("div", { key: "relation", className: "text-secondary" }, "Inherited origin") : null,
          b ? n(
            "div",
            { key: "model", className: "text-secondary" },
            `Model ${b}${u.modelVersion ? ` · ${u.modelVersion}` : ""}`
          ) : null,
          u.activityExternalRunId || u.sourceRunId ? n("div", { key: "run", className: "break-all text-secondary" }, `Run ${u.activityExternalRunId || u.sourceRunId}`) : null,
          u.confidence != null ? n(
            "div",
            { key: "confidence", className: "text-secondary" },
            `Confidence ${Math.round(u.confidence * 100)}%`
          ) : null,
          u.recordedAt || u.createdAt ? n("div", { key: "recorded", className: "text-secondary" }, `Recorded ${u.recordedAt || u.createdAt}`) : null
        ]);
      })
    ) : null
  ]);
}
function vd({
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
  const [u, b] = L([]), m = e.flatMap((w) => w.lanes.map((S) => S.key)), y = m.join("|");
  ye(() => {
    const w = new Set(m);
    b((S) => S.filter((O) => w.has(O)));
  }, [y]);
  const x = yr(t), h = !!ai(
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
        `${m.length} swimlane${m.length === 1 ? "" : "s"} · ${e.length} group${e.length === 1 ? "" : "s"}`
      ),
      a ? n(jt, { key: "counts", counts: x }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      Ol({ mergeable: h, reviewable: a, tagEditable: s, slotsEditable: l })
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
      ...w.lanes.map((S) => {
        const O = u.includes(S.key), $ = S.markers.some(({ segment: G }) => G.id === r), P = `selected-segment-lane-${S.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: S.key,
          "data-selected-segment-lane": S.key,
          className: `rounded-md border ${$ ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": O,
            "aria-controls": P,
            "aria-current": $ ? "true" : void 0,
            onClick: () => b((G) => O ? G.filter((C) => C !== S.key) : [...G, S.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, O ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Gn(S)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(S.selectedCount)),
            a ? n(jt, { key: "states", counts: S.counts }) : null
          ]),
          O ? n("div", {
            key: "segments",
            id: P,
            className: "space-y-1 border-t border-border p-1.5"
          }, S.markers.map(({ segment: G }) => {
            const C = G.endSec == null ? Ae(G.startSec) : `${Ae(G.startSec)} – ${Ae(G.endSec)}`;
            return n("button", {
              key: G.id,
              type: "button",
              onClick: () => i(G),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${G.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${G.tagName || "Segment"}, ${G.reviewState}, ${C}` : `${G.tagName || "Segment"}, ${C}`,
              "aria-current": G.id === r ? "true" : void 0
            }, [
              a ? n(Vt, {
                key: "state",
                state: G.reviewState,
                includeLabel: !1
              }) : null,
              G.isDerived ? n(Sr, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, C),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                wt(G.sourceKey)
              )
            ]);
          })) : null
        ]);
      })
    ]))
  ]);
}
const On = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"]
}, sa = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], la = [
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
function _n(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function di(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function da(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function cr(e, t, r, o = null) {
  const i = da(t), a = da(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function xd(e, t, r = null) {
  var u, b, m;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (u = t.hasSegmentsCriterion) == null ? void 0 : u.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), cr(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), cr(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), cr(o, t.performersCriterion, "performer"), cr(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = ca(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = ca(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((b = t.reviewStateCriterion) == null ? void 0 : b.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const g = (m = t.shotBoundariesCriterion) == null ? void 0 : m.value;
  return r && typeof g == "boolean" ? o.set("hasShotBoundaries", String(g)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function ca(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function Sd(e, t, r, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((g) => a.add(g));
  } else a.has(r) ? a.delete(r) : a.add(r);
  return a;
}
function ci({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(Xo, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, at.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = kt[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(Xo, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function ui({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
function kd({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      onClick: (l) => _n(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      n(ui, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, Qi(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(ci, { item: e, showReviewStates: r }))
    ])
  ]);
}
function wd({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n(ui, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
    n(i ? "div" : "a", {
      key: "link",
      href: i ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: i ? void 0 : (l) => _n(l, t, s),
      className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
      n("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
        n("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
        n(ci, { key: "segments", item: e, showReviewStates: r })
      ]),
      n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function uo({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = el(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => _n(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && gn(
        o,
        Et.recyclingBinView
      ) ? n(mi, { key: "bin", onNavigate: t }) : null,
      n(gi, { key: "settings", onNavigate: t })
    ])
  ]);
}
const Qr = "segment-studio:recycling-bin-changed";
function Nd(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function Fn() {
  window.dispatchEvent(new CustomEvent(Qr));
}
function mi({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = L(null);
  ye(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const g = await Z("/bin"), u = Number(g == null ? void 0 : g.totalCount);
        !a && c === s && o(Number.isFinite(u) && u >= 0 ? Math.trunc(u) : null);
      } catch {
        !a && c === s && o(null);
      }
    }, d = () => {
      l();
    };
    return l(), window.addEventListener(Qr, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(Qr, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = Nd(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => _n(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function gi({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => _n(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function Id({ mode: e, onModeChange: t, disabled: r = !1 }) {
  function o(i) {
    const a = qr(i.target.value);
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
function Cd({ minimum: e, maximum: t, onChange: r }) {
  const o = ge(null), [i, a] = L("maximum"), s = (b, m) => {
    const y = ws(e, t, b, m);
    a(y.coincidentTop), r({ minimum: y.minimum, maximum: y.maximum });
  }, l = (b, m) => {
    var x;
    const y = (x = o.current) == null ? void 0 : x.getBoundingClientRect();
    y && s(b, ks(m.clientX, y.left, y.width));
  }, d = (b, m) => {
    var y, x;
    m.preventDefault(), (x = (y = m.currentTarget).setPointerCapture) == null || x.call(y, m.pointerId), l(b, m);
  }, c = (b, m) => {
    var y, x;
    (x = (y = m.currentTarget).hasPointerCapture) != null && x.call(y, m.pointerId) && l(b, m);
  }, g = (b, m) => {
    const y = b === "minimum" ? e : t, x = b === "minimum" ? 0 : e, h = b === "minimum" ? t : 1, w = m.shiftKey ? 0.1 : 0.01;
    let S = null;
    ["ArrowLeft", "ArrowDown"].includes(m.key) && (S = y - w), ["ArrowRight", "ArrowUp"].includes(m.key) && (S = y + w), m.key === "PageDown" && (S = y - 0.1), m.key === "PageUp" && (S = y + 0.1), m.key === "Home" && (S = x), m.key === "End" && (S = h), S != null && (m.preventDefault(), s(b, Math.min(h, Math.max(x, S))));
  }, u = (b, m) => n("span", {
    key: b,
    role: "slider",
    tabIndex: 0,
    "aria-label": b === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((b === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((b === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(m * 100),
    "aria-valuetext": `${Math.round(m * 100)} percent`,
    onPointerDown: (y) => d(b, y),
    onPointerMove: (y) => c(b, y),
    onKeyDown: (y) => g(b, y),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${m * 100}%`,
      touchAction: "none",
      zIndex: e === t && i === b ? 2 : 1
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
        u("minimum", e),
        u("maximum", t)
      ])
    )
  ]);
}
function $d({ saving: e, error: t, onSelect: r, onClose: o }) {
  const i = ge(null);
  ye(() => {
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
    onKeyDownCapture: (s) => dt(s, { onCancel: a })
  }, n("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: $t,
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
    n(jn, {
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
function Td({
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
  const u = pt(e), b = [...new Map((a || []).map((h) => [
    Number(h.tagId),
    h.tagName || `Tag ${h.tagId}`
  ])).entries()].sort((h, w) => h[1].localeCompare(w[1]) || h[0] - w[0]), m = (h) => d(pt({ ...u, ...h })), y = (h) => m({
    reviewStates: u.reviewStates.includes(h) ? u.reviewStates.filter((w) => w !== h) : [...u.reviewStates, h]
  }), x = (h) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${h ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && g();
    },
    onKeyDownCapture: (h) => dt(h, { onCancel: g })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: $t,
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
        n("div", { className: "flex flex-wrap gap-2" }, at.map((h) => {
          const w = u.reviewStates.includes(h), S = kt[h];
          return n("button", {
            key: h,
            type: "button",
            onClick: () => y(h),
            "aria-pressed": w,
            className: x(w)
          }, `${S.symbol} ${h} (${i[h] || 0})`);
        }))
      ]) : null,
      l ? n("fieldset", { key: "performer", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Performer"),
        n("p", { className: "text-xs text-secondary" }, "Any assigned slot may match the selected performer."),
        n("div", { className: "flex flex-wrap gap-2" }, [
          n("button", {
            key: "any",
            type: "button",
            onClick: () => m({ performerId: null }),
            "aria-pressed": u.performerId == null,
            className: x(u.performerId == null)
          }, "All performers"),
          ...r.map((h) => {
            const w = Number(Ye(h));
            return n("button", {
              key: w,
              type: "button",
              onClick: () => m({ performerId: w }),
              "aria-pressed": u.performerId === w,
              className: x(u.performerId === w)
            }, h.name);
          })
        ])
      ]) : null,
      n("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        n("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Tag"),
          n("select", {
            key: "select",
            value: u.tagId ?? "",
            onChange: (h) => m({
              tagId: h.target.value === "" ? null : Number(h.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...b.map(([h, w]) => n("option", { key: h, value: h }, w))
          ])
        ]),
        n("label", {
          key: "segment-group",
          className: "space-y-1 text-xs text-secondary"
        }, [
          n("span", { key: "label" }, "Segment group"),
          n("select", {
            key: "select",
            value: u.segmentGroupId ?? "",
            onChange: (h) => m({
              segmentGroupId: h.target.value === "" ? null : h.target.value === "ungrouped" ? "ungrouped" : Number(h.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All Segment groups"),
            ...(s || []).map((h) => n("option", { key: h.id, value: h.id }, h.name)),
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
            onClick: () => m({ sourceKey: null }),
            "aria-pressed": u.sourceKey == null,
            className: x(u.sourceKey == null)
          }, "All provenance"),
          ...o.map((h) => n("button", {
            key: h,
            type: "button",
            onClick: () => m({ sourceKey: h }),
            "aria-pressed": u.sourceKey === h,
            title: h,
            className: x(u.sourceKey === h)
          }, wt(h)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(Cd, {
          minimum: u.confidenceMin,
          maximum: u.confidenceMax,
          onChange: ({ minimum: h, maximum: w }) => m({
            confidenceMin: h,
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
            checked: u.includeUnscored,
            onChange: (h) => m({
              includeUnscored: h.target.checked
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
          onChange: (h) => c(h.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]"
        }),
        n(bd, { key: "icon", hidden: t }),
        n("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    n("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(pt({})), l && c(!1);
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
function Ad({ reviewMode: e, bindings: t, onClose: r }) {
  const o = zn.filter((l) => mn(l, e)), i = Ko(o, 1)[0], a = Ko(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((g) => n("div", { key: g.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, g.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[g.id] ? t[g.id].length > 0 ? t[g.id] : ["Unassigned"] : g.bindings.map(Ga)).map((u, b) => n("kbd", { key: `${g.id}:${b}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, u))
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
    onKeyDownCapture: (l) => dt(l, { onCancel: r })
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
function Rd({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = Xl(e), [l, d] = L([]), c = s.map((g) => g.tagName).join("|");
  return ye(() => {
    const g = new Set(s.map((u) => u.tagName));
    d((u) => u.filter((b) => g.has(b)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (g) => dt(g, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: $t,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", { key: "title", id: "segment-studio-examples-title", className: "text-lg font-semibold text-foreground" }, "AI Feedback"),
      n("p", { key: "description", className: "mt-1 text-sm text-secondary" }, `${e.length} registered-AI example${e.length === 1 ? "" : "s"} in this video. Expand a tag to inspect or restore examples before export.`)
    ]),
    n("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      n("div", { key: "items", className: "space-y-3" }, e.length ? s.map((g, u) => {
        const b = l.includes(g.tagName), m = `incorrect-example-tag-${u}`;
        return n("section", {
          key: g.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": b,
            "aria-controls": m,
            onClick: () => d((y) => b ? y.filter((x) => x !== g.tagName) : [...y, g.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: hr(!1) }
          }, [
            n(
              "span",
              { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" },
              b ? "▾" : "▸"
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
          b ? n("div", {
            key: "examples",
            id: m,
            className: "divide-y divide-border border-t border-border"
          }, g.examples.map((y) => {
            const x = `${Ae(y.startSec)}${y.endSec == null ? "" : ` – ${Ae(y.endSec)}`}`, h = r === y.id;
            return n("div", {
              key: y.id,
              className: "flex items-center justify-between gap-3 px-3 py-2 text-sm"
            }, [
              n(
                "span",
                { key: "time", className: "font-mono text-xs text-secondary" },
                x
              ),
              n("button", {
                key: "remove",
                type: "button",
                disabled: t || r != null,
                onClick: () => i(y),
                "aria-label": `${h ? "Restoring" : "Restore to review"} ${g.tagName} example at ${x}`,
                className: "rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
              }, h ? "Restoring…" : "Restore to review")
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
function Md({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = L(""), [a, s] = L(0), l = ge(null), d = Ue(() => ml(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = pl(d);
  ye(() => {
    var b;
    (b = l.current) == null || b.scrollIntoView({ block: "nearest" });
  }, [c, o]);
  const u = () => {
    const b = d[c];
    b && t(b.segment || b);
  };
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-start justify-center bg-black/70 p-4 pt-[10vh]",
    onMouseDown: (b) => {
      b.target === b.currentTarget && r();
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-quick-search-title",
    tabIndex: -1,
    className: "flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    onKeyDownCapture: (b) => {
      var m;
      if (b.key === "Tab")
        $t(b);
      else if (b.key === "Escape")
        b.preventDefault(), b.stopPropagation(), r();
      else if (b.key === "ArrowDown" || b.key === "ArrowUp") {
        b.preventDefault(), b.stopPropagation();
        const y = b.key === "ArrowDown" ? 1 : -1;
        s((x) => d.length ? (x + y + d.length) % d.length : 0);
      } else b.key === "Enter" && !((m = b.nativeEvent) != null && m.isComposing) && (b.preventDefault(), b.stopPropagation(), u());
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
        onChange: (b) => {
          i(b.target.value), s(0);
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
    }, d.length ? d.flatMap((b, m) => {
      var P;
      const y = b.segment || b, x = y.endSec == null ? Ae(y.startSec) : `${Ae(y.startSec)} – ${Ae(y.endSec)}`, h = `${wt(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`, w = m === c, S = m > 0 ? d[m - 1].groupKey : null, O = g && b.groupKey !== S ? n("div", {
        key: `group:${b.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, b.groupName) : null, $ = n("button", {
        key: y.id,
        id: `segment-quick-search-${y.id}`,
        ref: w ? l : null,
        type: "button",
        role: "option",
        "aria-selected": w,
        onMouseEnter: () => s(m),
        onClick: () => t(y),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${w ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        g ? n("span", { key: "group", className: "sr-only" }, `${b.groupName} group`) : null,
        n(Vt, { key: "review", state: y.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          y.tagName || "Tag segment"
        ),
        (P = b.performers) != null && P.length ? n(xr, {
          key: "performers",
          performers: b.performers,
          performerAssignments: b.performerAssignments
        }) : null,
        n(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          x
        ),
        n("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: h
        }, h)
      ]);
      return O ? [O, $] : [$];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function Ed(e) {
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
function Dd({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = Ue(() => Ed(e), [e]), [l, d] = L([]), c = s.reduce((m, y) => m + y.drafts.length, 0), g = ge(null);
  io({ confirmRef: g, cancelRef: o, confirmReady: !t && c > 0 });
  const u = (m) => d((y) => y.includes(m) ? y.filter((x) => x !== m) : [...y, m]), b = (m) => `segment-studio-publish-approved-${m.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && a();
    },
    onKeyDownCapture: (m) => dt(m, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: $t,
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
      ].flatMap(([m, y]) => [
        n("dt", { key: `${m}:label`, className: "text-secondary" }, m),
        n("dd", { key: `${m}:value`, className: "font-semibold text-foreground" }, String(y))
      ])),
      s.length ? n("div", { key: "groups", className: "space-y-2" }, s.map((m) => {
        const y = l.includes(m.key);
        return n("section", { key: m.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": y,
            "aria-controls": b(m),
            onClick: () => u(m.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: hr(!1) }
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, y ? "▾" : "▸"),
            n("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, m.tagName),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${m.drafts.length} draft${m.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          y ? n("div", {
            key: "drafts",
            id: b(m),
            className: "divide-y divide-border border-t border-border"
          }, m.drafts.map((x) => {
            const h = x.endSec == null ? Ae(x.startSec) : `${Ae(x.startSec)} – ${Ae(x.endSec)}`, w = `${wt(x.sourceKey)}${x.confidence == null ? "" : ` · ${Math.round(x.confidence * 100)}%`}`;
            return n("div", { key: x.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(Vt, { key: "review", state: x.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, h),
              n("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: w
              }, w)
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
        ref: g,
        type: "button",
        disabled: t || c === 0,
        onClick: i,
        className: "rounded-md border border-emerald-500/60 bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-emerald-500/30 disabled:opacity-50"
      }, t ? "Publishing…" : `Publish ${c} approved draft${c === 1 ? "" : "s"}`)
    ])
  ]));
}
function Od({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = ul(e), [s, l] = L(() => /* @__PURE__ */ new Set()), [d, c] = L(() => new Set(a.map((x) => x.key))), g = a.flatMap((x) => d.has(x.key) ? x.candidates : []), u = (x) => l((h) => {
    const w = new Set(h);
    return w.has(x) ? w.delete(x) : w.add(x), w;
  }), b = (x) => c((h) => {
    const w = new Set(h);
    return w.has(x) ? w.delete(x) : w.add(x), w;
  }), m = (x) => x.assignment.map(({ slot: h, performer: w }) => `${h.label || `Slot ${h.sortOrder + 1}`}: ${w.name}`).join(", "), y = (x) => `segment-studio-auto-assign-${x.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (x) => {
      x.target === x.currentTarget && !t && i();
    },
    onKeyDownCapture: (x) => {
      x.key === "Enter" && x.target instanceof HTMLInputElement || dt(x, {
        onCancel: t ? void 0 : i,
        onConfirm: g.length && !t ? () => o(g) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: $t,
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
      e.length ? n("div", { className: "space-y-3" }, a.map((x) => n("section", { key: x.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
        n("header", {
          key: "header",
          className: "flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2",
          style: { background: hr(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(x.key),
            disabled: t,
            onChange: () => b(x.key),
            "aria-label": `Include ${x.tagName} assignment: ${m(x)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(x.key),
            "aria-controls": y(x),
            "aria-label": `${s.has(x.key) ? "Collapse" : "Expand"} ${x.tagName} assignment: ${m(x)}`,
            onClick: () => u(x.key),
            className: "shrink-0 rounded px-1 text-sm text-secondary hover:bg-muted/50 hover:text-foreground disabled:opacity-50"
          }, s.has(x.key) ? "▾" : "▸"),
          n(
            "span",
            { key: "tag", className: "min-w-24 flex-1 truncate text-sm font-semibold text-foreground" },
            x.tagName
          ),
          n(
            "span",
            { key: "performers", className: "flex min-w-0 flex-wrap items-center gap-2" },
            x.assignment.map(({ slot: h, performer: w }) => {
              const S = h.label || `Slot ${h.sortOrder + 1}`;
              return n("span", {
                key: h.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${S}: ${w.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${S}: ${w.name}`
                }, `${S}: ${w.name}`),
                n(Un, {
                  key: "avatar",
                  performer: { id: w.performerId, name: w.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(jt, { key: "states", counts: x.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(x.candidates),
            "aria-label": `Auto-Assign ${x.tagName}: ${m(x)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${x.candidates.length})`)
        ]),
        s.has(x.key) ? n(
          "div",
          { key: "segments", id: y(x), className: "divide-y divide-border/70" },
          x.candidates.map((h) => {
            const w = h.endSec == null ? Ae(h.startSec) : `${Ae(h.startSec)} – ${Ae(h.endSec)}`, S = `${wt(h.sourceKey)}${h.confidence == null ? "" : ` · ${Math.round(h.confidence * 100)}%`}`;
            return n("div", {
              key: h.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(Vt, { key: "review", state: h.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                h.tagName || "Tag segment"
              ),
              n(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                w
              ),
              n("span", {
                key: "provenance",
                className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                title: S
              }, S)
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
function Pd({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => dt(d, { onCancel: r, onConfirm: t })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: $t,
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
function Ld({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = L(!1), d = ge(null);
  if (io({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Ae(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && a();
    },
    onKeyDownCapture: (g) => dt(g, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: $t,
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
        `${Ae(e.startSec)} – ${c}`
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
          onChange: (g) => l(g.target.checked),
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
function Fd(e) {
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
function jd({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var u, b;
  const l = e ? e.createCount + e.linkCount : 0, d = ge(null);
  io({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((u = e == null ? void 0 : e.outputs) == null ? void 0 : u.slice(0, 200)) || [], g = Fd(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !r && s();
    },
    onKeyDownCapture: (m) => dt(m, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: $t,
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
        ].flatMap(([m, y]) => [
          n("dt", { key: `${m}:label`, className: "text-secondary" }, m),
          n("dd", { key: `${m}:value`, className: "font-semibold text-foreground" }, String(y))
        ])),
        e.conflictCount > 0 ? n(
          "p",
          { key: "conflicts", role: "status", className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground" },
          `${e.conflictCount} existing derivation ${e.conflictCount === 1 ? "branch was" : "branches were"} skipped because its lineage no longer matches the active rule. Resolve these through lineage maintenance.`
        ) : null,
        g.length ? n("div", { key: "outputs", className: "space-y-2" }, [
          ...g.map((m) => n("article", {
            key: m.key,
            className: "rounded-md border border-border bg-surface p-3"
          }, [
            n("div", { key: "root", className: "flex min-w-0 items-center gap-2" }, [
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
                `${m.rootTagName} @ ${Ae(m.rootStartSec)}`
              ),
              n(
                "span",
                { key: "count", className: "shrink-0 text-xs font-medium text-secondary" },
                `${m.outputs.length} ${m.outputs.length === 1 ? "change" : "changes"}`
              )
            ]),
            n(
              "div",
              { key: "tree", className: "mt-2 space-y-1 border-l border-border pl-2" },
              m.outputs.map((y, x) => n("div", {
                key: `${y.ruleId}:${y.depth}:${x}`,
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
          (((b = e.outputs) == null ? void 0 : b.length) || 0) > c.length ? n(
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
function Bd({
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
  performerSlotsAvailable: g,
  selectedPerformerSlots: u,
  performerSlots: b,
  detail: m,
  video: y,
  slotButtonRef: x,
  tagSearchRef: h,
  onDetailChange: w,
  setSaveMessage: S,
  setSavingSegmentId: O,
  onSlotsChanged: $,
  onRecordHistory: P,
  onCancelQueuedReview: G,
  splitSegment: C,
  duplicateSegment: N,
  provenance: E,
  lineage: R,
  onNavigateLineageItem: K,
  tagEditing: ae,
  onCancelTagEditing: W,
  detailPanelRef: k,
  onReduceSelection: T
}) {
  var oe, ue, he, V;
  const M = ge(null), H = ge(null), se = ge(null), le = ge(null), pe = ge(null), [_, ne] = L(!1);
  ye(() => {
    M.current && (M.current.scrollTop = 0), ne(!1);
  }, [t == null ? void 0 : t.id]), ye(() => {
    var D, re;
    _ && ((re = (D = H.current) == null ? void 0 : D.querySelector("input, select, button")) == null || re.focus({ preventScroll: !0 }));
  }, [_]);
  function ce() {
    ne(!1), requestAnimationFrame(() => {
      var D;
      return (D = x.current) == null ? void 0 : D.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const D = !r.some((Y) => Y.isDerived), re = e && g ? Dl(b, r) : null, Ie = (re == null ? void 0 : re.map((Y, F) => {
      var I;
      const Me = r[F];
      return {
        segmentId: Me.nativeSegmentId,
        itemId: Me.published ? null : Me.itemId,
        revision: (I = m.performerSlotRevisions) == null ? void 0 : I[Me.id],
        slots: Y
      };
    })) || [];
    return n(Zr.Fragment, null, [
      n(vd, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: k,
        onReduceSelection: T,
        reviewable: e,
        tagEditable: D,
        slotsEditable: Ie.length > 0 && a == null,
        onEditSlots: () => ne(!0),
        slotButtonRef: x,
        saveMessage: i
      }),
      ae && D ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (Y) => {
          Y.target === Y.currentTarget && W();
        },
        onKeyDownCapture: (Y) => dt(Y, { onCancel: W })
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
        n(jn, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (Y, F) => Y == null ? W() : l(Y, F == null ? void 0 : F.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: W,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      _ && Ie.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (Y) => {
          Y.target === Y.currentTarget && ce();
        },
        onKeyDownCapture: (Y) => {
          var Me, I;
          if (!(typeof ((Me = Y.target) == null ? void 0 : Me.closest) == "function" ? Y.target.closest("input, textarea, select, [contenteditable='true']") : null) && !Y.repeat && !Y.ctrlKey && !Y.altKey && !Y.metaKey && !Y.shiftKey && /^[1-9]$/.test(Y.key) && ((I = pe.current) != null && I.call(pe, Number(Y.key) - 1))) {
            Y.preventDefault(), Y.stopPropagation();
            return;
          }
          dt(Y, { onCancel: ce });
        }
      }, n("section", {
        ref: H,
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
          n("button", { key: "close", type: "button", onClick: ce, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(fd, {
          videoId: y.id,
          targets: Ie,
          performerCandidates: m.performerCandidates || [],
          shortcutRef: pe,
          onSaved: async ({ beforeState: Y, afterState: F }) => {
            await P(
              "performer-slots.assign",
              `Assigned performers to ${Ie.length} segments`,
              Y,
              F
            ), ce(), $();
          },
          onConflict: $
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (D) => {
      M.current = D, k && (k.current = D);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(Vt, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(Sr, { key: "derived" }) : null,
        t && ae ? n("div", {
          key: "tag-editor",
          ref: h,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (D) => {
            D.key === "Escape" && (D.preventDefault(), D.stopPropagation(), W());
          },
          onKeyDown: (D) => {
            Al(D, t.tagName) && (D.preventDefault(), D.stopPropagation(), l(t.tagId));
          }
        }, n(jn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (D, re) => D == null ? W() : l(D, re == null ? void 0 : re.label),
          disabled: Js(a, t.id, s) || ((oe = R.data) == null ? void 0 : oe.tagReadOnly) === !0,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? n("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : n("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? n("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        n("span", { key: "start" }, Ae(t.startSec)),
        t.endSec == null ? null : n("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : n("span", { key: "end" }, Ae(t.endSec))
      ]) : null,
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(gd, { status: c })) : null,
      t && g && u.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(ii, {
        assignments: u.map((D) => {
          const re = Fl(D);
          return {
            key: String(D.slotDefinitionId),
            label: re.label,
            performer: re.filled ? { id: Number(D.performerId), name: re.performer } : null,
            title: re.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(hd, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: E
    }) : null,
    t ? n("div", { key: "controls", hidden: !0 }, [
      n("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        n("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        R.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : R.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, R.error) : R.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${R.data.derived ? "Derived segment" : "Root segment"} · ${R.data.componentSize} segment${R.data.componentSize === 1 ? "" : "s"} · ${R.data.integrityState}`
          ),
          (ue = R.data.parents) != null && ue.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...R.data.parents.map((D) => n("button", {
              key: D.nodeId,
              type: "button",
              onClick: () => K(D.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${D.ruleKey} ${D.ruleVersion}`))
          ]) : null,
          (he = R.data.children) != null && he.length ? n("p", { key: "children" }, `Children: ${R.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: x,
          type: "button",
          disabled: a != null || !g || u.length === 0,
          onClick: () => ne(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: g ? u.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, u.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: C,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        n("button", {
          key: "duplicate",
          type: "button",
          disabled: a != null,
          onClick: () => N(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        n("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: a != null,
          onClick: () => N(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    _ && e && t && g && u.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (D) => {
        D.target === D.currentTarget && ce();
      },
      onKeyDownCapture: (D) => {
        var Ie, Y;
        if (!(typeof ((Ie = D.target) == null ? void 0 : Ie.closest) == "function" ? D.target.closest("input, textarea, select, [contenteditable='true']") : null) && !D.repeat && !D.ctrlKey && !D.altKey && !D.metaKey && !D.shiftKey && /^[1-9]$/.test(D.key) && ((Y = le.current) != null && Y.call(le, Number(D.key) - 1))) {
          D.preventDefault(), D.stopPropagation();
          return;
        }
        dt(D, {
          onCancel: ce,
          onConfirm: () => {
            var F;
            return (F = se.current) == null ? void 0 : F.click();
          }
        });
      }
    }, n("section", {
      ref: H,
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
        n("button", { key: "close", type: "button", onClick: ce, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(pd, {
        key: `${t.id}:${m.performerSlotsRevision || m.slotRevision || ""}`,
        videoId: y.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: u,
        revision: (V = m.performerSlotRevisions) == null ? void 0 : V[t.id],
        performerCandidates: m.performerCandidates || [],
        confirmRef: se,
        shortcutRef: le,
        onOptimisticSave: (D) => {
          w((re) => Gr(
            re,
            t.id,
            D
          ), y.id), O(t.id), S("Saving performer slots…"), ce();
        },
        onSaved: async (D, { beforeState: re, afterState: Ie }) => {
          w((Y) => Gr(
            Y,
            t.id,
            D.slots || [],
            D.revision
          ), y.id), S("Performer slots saved.");
          try {
            await P(
              "performer-slots.assign",
              "Assigned performers",
              re,
              Ie
            ), await $(D) || G([t]);
          } finally {
            O(null);
          }
        },
        onRollback: async (D, re) => {
          G([t]), w((Ie) => {
            var Y;
            return Gr(
              Ie,
              t.id,
              D,
              (Y = m.performerSlotRevisions) == null ? void 0 : Y[t.id]
            );
          }, y.id), S(re.message || "Unable to save performer slots.");
          try {
            re.status === 409 && await $();
          } finally {
            O(null);
          }
        },
        onConflict: $
      }))
    ])) : null
  ]);
}
function Gd({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: u, onSelectGroup: b, onToggleGroup: m, onSelect: y, onSelectSegments: x, onSelectAll: h, onConfigureTag: w, onSeekTime: S, centerRef: O, showReviewState: $ = !0, swimlaneTitleWidth: P, onSwimlaneTitleWidthChange: G }) {
  const C = ge(null), N = ge(null), [E, R] = L(0), [K, ae] = L({ scrollTop: 0, height: 320 }), [W, k] = L(null), T = Ue(
    () => qt(e, r, o),
    [e, r, o]
  ), M = Ue(
    () => ri(o),
    [o]
  ), H = Ue(() => co(T), [T]), se = Ue(
    () => Kl(H, i, r.length > 0),
    [H, i, r.length]
  ), le = Ue(
    () => oi(se.rows, Math.max(0, K.scrollTop - 24), K.height),
    [se, K]
  ), pe = Math.max(0, Number(d) || 0), _ = gs(E), ne = ur(P, _), ce = ne / 16, oe = us(c, pe, ce), ue = is(pe), he = ss(pe, Math.max(1, E - ce * 16), g), V = ue.filter((p, v) => v === 0 || v % he === 0), D = Ue(() => T.map((p) => `${p.key}:${p.trackCount}:${p.markers.map(({ segment: v, track: A }) => `${v.id}:${v.startSec}:${v.endSec ?? ""}:${A}`).join(",")}`).join("|"), [T]);
  function re() {
    const p = N.current;
    if (!p) return;
    const v = p.querySelector("[data-timeline-track]"), A = p.firstElementChild, te = v == null ? void 0 : v.getBoundingClientRect(), J = A == null ? void 0 : A.getBoundingClientRect(), q = te && J ? Math.max(0, te.left - J.left) : ce * 16, ve = (J == null ? void 0 : J.width) ?? p.scrollWidth;
    p.scrollTo({
      left: cs(c, pe, ve, p.clientWidth, q, Da),
      behavior: "smooth"
    });
  }
  ye(() => (O.current = re, () => {
    O.current === re && (O.current = null);
  })), ye(() => {
    re();
  }, [g]);
  function Ie() {
    const p = N.current, v = se.rows.find((ve) => ve.kind === "lane" && ve.lane.markers.some(({ segment: z }) => z.id === s));
    if (!p || !v) return;
    const A = 24, te = v.top + A, J = te + v.height;
    let q = p.scrollTop;
    te < p.scrollTop + A ? q = Math.max(0, te - A) : J > p.scrollTop + p.clientHeight && (q = Math.max(0, J - p.clientHeight)), q !== p.scrollTop && (p.scrollTop = q), ae({ scrollTop: q, height: p.clientHeight });
  }
  ye(() => {
    Ie();
  }, [s, D, se]), ye(() => {
    const p = N.current, v = se.rows.find((ve) => ve.kind === "group" && ve.group.key === a);
    if (!p || !v) return;
    const A = 24, te = v.top + A, J = te + v.height;
    let q = p.scrollTop;
    te < p.scrollTop + A ? q = Math.max(0, te - A) : J > p.scrollTop + p.clientHeight && (q = Math.max(0, J - p.clientHeight)), q !== p.scrollTop && (p.scrollTop = q), ae({ scrollTop: q, height: p.clientHeight });
  }, [a, se]), ye(() => {
    const p = N.current;
    if (!p || typeof ResizeObserver > "u") return;
    const v = () => {
      R(p.clientWidth), ae({ scrollTop: p.scrollTop, height: p.clientHeight }), Ie();
    }, A = new ResizeObserver(v);
    return A.observe(p), v(), () => A.disconnect();
  }, [s, D, se]);
  function Y(p) {
    if (!(pe > 0)) return;
    const v = p.currentTarget.getBoundingClientRect(), A = Math.min(1, Math.max(0, (p.clientX - v.left) / v.width));
    S(A * pe);
  }
  function F(p) {
    const v = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let A = null;
    Object.hasOwn(v, p.key) && (A = c + v[p.key]), p.key === "Home" && (A = 0), p.key === "End" && (A = pe), A != null && (p.preventDefault(), p.stopPropagation(), S(Math.min(pe, Math.max(0, A))));
  }
  function Me(p) {
    var A;
    const v = (A = C.current) == null ? void 0 : A.getBoundingClientRect();
    v && G(ur(p.clientX - v.left, _));
  }
  function I(p) {
    const v = p.shiftKey ? 40 : 16;
    let A = null;
    p.key === "ArrowLeft" && (A = ne - v), p.key === "ArrowRight" && (A = ne + v), p.key === "Home" && (A = 160), p.key === "End" && (A = _), A != null && (p.preventDefault(), p.stopPropagation(), G(ur(A, _)));
  }
  const f = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: C,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (p) => {
          (p.metaKey || p.ctrlKey) && (p.preventDefault(), h == null || h());
        },
        onKeyDown: (p) => {
          p.key !== "Enter" && p.key !== " " || (p.preventDefault(), h == null || h());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: f, disabled: g <= 1, onClick: () => u(gr(g - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: f, disabled: g === 1, onClick: () => u(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(g * 100)}%`),
      n("button", { key: "in", type: "button", className: f, disabled: g >= 8, onClick: () => u(gr(g + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: f, onClick: re, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(_),
      "aria-valuenow": Math.round(ne),
      "aria-valuetext": `${Math.round(ne)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (p) => {
        p.currentTarget.setPointerCapture(p.pointerId), Me(p);
      },
      onPointerMove: (p) => {
        p.currentTarget.hasPointerCapture(p.pointerId) && Me(p);
      },
      onKeyDown: I,
      onDoubleClick: () => G(lt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${ne - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: N,
      onScroll: (p) => ae({
        scrollTop: p.currentTarget.scrollTop,
        height: p.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: ms(g) }, [
      n("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${ce}rem minmax(0,1fr)`, height: "1.5rem" } }, [
        n("div", { key: "axis-label", "data-timeline-label-gutter": "true", "aria-hidden": "true", className: "sticky left-0 z-40 border-r border-border", style: { backgroundColor: "var(--color-surface)" } }),
        n("div", {
          key: "ticks",
          role: "slider",
          tabIndex: 0,
          "data-timeline-seeker": "true",
          "data-timeline-track": "true",
          "aria-label": "Timeline seek",
          "aria-valuemin": 0,
          "aria-valuemax": pe,
          "aria-valuenow": Math.min(pe, Math.max(0, c)),
          "aria-valuetext": Ae(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: Y,
          onKeyDown: F
        }, V.map((p, v) => n("span", {
          key: p,
          className: `absolute top-0 ${ls(v, V.length, pe > 0 ? p / pe * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: ds(v, V.length, pe > 0 ? p / pe * 100 : 0)
        }, Ae(p))).concat(t.map((p) => {
          const v = pe > 0 ? p.startSec / pe * 100 : 0;
          return n("button", {
            key: `shot-boundary:${p.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Ae(p.startSec)} – ${Ae(p.endSec)}`,
            title: `Shot boundary · ${p.source || "manual"} · ${Ae(p.startSec)} – ${Ae(p.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${v}%`, width: "2px" },
            onClick: (A) => {
              A.stopPropagation(), S(p.startSec);
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
            ...Bo(oe),
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
        style: T.length > 0 ? { height: se.height } : void 0
      }, [
        T.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...Bo(oe, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        T.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : le.map((p) => {
          var ee;
          const v = p.group, A = i.includes(v.key), te = a === v.key, J = hr(te);
          if (p.kind === "group") return n("div", {
            key: p.key,
            "data-segment-group": v.key,
            "data-segment-group-collapsed": A ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ce}rem minmax(0,1fr)`,
              backgroundColor: J,
              top: p.top,
              height: p.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (U) => {
                if (U.metaKey || U.ctrlKey) {
                  x(v.lanes.flatMap((fe) => fe.markers.map((Ee) => Ee.segment.id)));
                  return;
                }
                b(v.key), m(v.key);
              },
              "aria-expanded": !A,
              "aria-current": te ? "true" : void 0,
              "data-selected-timeline-group": te ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: v.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: J
              },
              title: `${A ? "Expand" : "Collapse"} ${v.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, A ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, v.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              A ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${v.lanes.length} swimlane${v.lanes.length === 1 ? "" : "s"} hidden`
                ),
                $ ? n(jt, { key: "states", counts: v.counts }) : null
              ] : null
            )
          ]);
          const q = p.lane, ve = Nl(p.laneIndex), z = q.markers.some(({ segment: U }) => U.id === s);
          return n("div", {
            key: p.key,
            "data-grouped-swimlane": v.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ce}rem minmax(0,1fr)`,
              top: p.top,
              height: p.height,
              backgroundColor: ve
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": z ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: Il(z, ve),
              title: `${Gn(q)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Gn(q),
              onClick: (U) => {
                (U.metaKey || U.ctrlKey) && x(q.markers.map((fe) => fe.segment.id));
              },
              onMouseEnter: () => k(q.key),
              onMouseLeave: () => k((U) => U === q.key ? null : U)
            }, [
              q.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (U) => {
                  U.stopPropagation(), w({ tagId: q.tagId, tagName: q.label, trigger: U.currentTarget });
                },
                "aria-label": `Configure ${q.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: W === q.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, q.label),
              (ee = q.performers) != null && ee.length ? n(xr, {
                key: "performers",
                performers: q.performers,
                performerAssignments: q.performerAssignments
              }) : null,
              $ ? n(jt, { key: "counts", counts: q.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, q.markers.map(({ segment: U, track: fe }) => {
              var Se;
              const Ee = Kr(U.startSec, pe), Q = U.endSec == null ? U.startSec : Math.max(U.startSec, U.endSec), X = Math.max(0, Kr(Q, pe) - Ee), xe = l.includes(U.id), be = U.id === s, ie = lo(M.get(U.id)), ke = U.endSec == null ? Ae(U.startSec) : `${Ae(U.startSec)} – ${Ae(U.endSec)}`, Pe = (Se = ti[ie]) == null ? void 0 : Se.label;
              return n("button", {
                key: U.id,
                type: "button",
                onClick: (we) => {
                  we.stopPropagation(), y(U, {
                    additive: we.metaKey || we.ctrlKey,
                    rangeSegmentIds: we.shiftKey ? q.markers.map((Re) => Re.segment.id) : null
                  });
                },
                "aria-pressed": xe,
                "aria-current": be ? "true" : void 0,
                "data-selected-timeline-marker": be ? "true" : void 0,
                "data-selected-segment-shortcut-target": be ? "true" : void 0,
                "aria-label": $ ? `${U.tagName || "Tag segment"}${q.performerLabel ? `, ${q.performerLabel}` : ""}, ${U.reviewState}${Pe ? `, ${Pe}` : ""}, ${ke}` : `${U.tagName || "Tag segment"}${q.performerLabel ? `, ${q.performerLabel}` : ""}, ${ke}`,
                title: $ ? `${U.tagName || "Tag segment"}${q.performerLabel ? ` · ${q.performerLabel}` : ""} · ${U.reviewState}${Pe ? ` · ${Pe}` : ""} · ${ke}` : `${U.tagName || "Tag segment"}${q.performerLabel ? ` · ${q.performerLabel}` : ""} · ${ke}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...$ ? Sl(U.reviewState, xe, ie, be) : kl(xe, be),
                  left: `${Ee}%`,
                  top: `${Cl(fe)}rem`,
                  width: wl(U.endSec, X),
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
function mo({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = L(null), [l, d] = L([]), [c, g] = L(null), [u, b] = L(""), [m, y] = L(!0), [x, h] = L(null), [w, S] = L(""), [O, $] = L(!1), P = ge(null), G = ge(0);
  ye(() => {
    const W = requestAnimationFrame(() => {
      var k;
      return (k = P.current) == null ? void 0 : k.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(W);
  }, [e]), ye(() => {
    const W = new AbortController();
    return y(!0), S(""), Promise.all([
      r ? Z(`/slot-definitions/${e}`, { signal: W.signal }) : Promise.resolve(null),
      Z("/segment-groups", { signal: W.signal })
    ]).then(([k, T]) => {
      const M = T.find((H) => (H.tags || []).some((se) => Number(se.tagId) === Number(e)));
      s(k), d(T), g((M == null ? void 0 : M.id) ?? null), b(M == null ? "" : String(M.id)), $(!1);
    }).catch((k) => {
      k.name !== "AbortError" && S(k.message || "Unable to load tag configuration.");
    }).finally(() => {
      W.signal.aborted || y(!1);
    }), () => W.abort();
  }, [r, e]);
  function C(W, k) {
    s({
      ...a,
      definitions: a.definitions.map((T, M) => M === W ? { ...T, ...k } : T)
    });
  }
  function N(W, k) {
    const T = W + k;
    if (T < 0 || T >= a.definitions.length) return;
    const M = [...a.definitions];
    [M[W], M[T]] = [M[T], M[W]], s({
      ...a,
      definitions: M.map((H, se) => ({ ...H, sortOrder: se }))
    });
  }
  function E(W) {
    const k = a.definitions[W], T = Number(k.assignmentCount) || 0, M = T === 0 ? "" : ` and its ${T} assignment${T === 1 ? "" : "s"}`;
    window.confirm(`Delete “${it(k)}”${M}?`) && (T > 0 && $(!0), s({
      ...a,
      definitions: a.definitions.filter((H, se) => se !== W).map((H, se) => ({ ...H, sortOrder: se }))
    }));
  }
  async function R() {
    var k;
    h("slots"), S("Saving performer slots…");
    let W;
    try {
      W = await Z(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: O,
          definitions: a.definitions.map((T, M) => {
            var H;
            return {
              id: T.id || void 0,
              label: ((H = T.label) == null ? void 0 : H.trim()) || null,
              sortOrder: M,
              genderHints: T.genderHints || []
            };
          })
        })
      }), s(W), $(!1);
    } catch (T) {
      T.status === 409 ? (S("Performer slots changed elsewhere; current values were reloaded."), (k = T.payload) != null && k.current && (s(T.payload.current), $(!1))) : S(T.message || "Unable to save performer slots."), h(null);
      return;
    }
    try {
      await o(), S("Performer slots saved.");
    } catch {
      S("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      h(null);
    }
  }
  async function K() {
    const W = u === "" ? null : Number(u);
    if (W !== c) {
      h("group"), S("Saving tag group…");
      try {
        await Z(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: W })
        });
      } catch (k) {
        S(k.message || "Unable to assign the tag group."), h(null);
        return;
      }
      try {
        const [k, T] = await Promise.allSettled([
          Z("/segment-groups"),
          o()
        ]);
        if (k.status === "fulfilled") {
          d(k.value);
          const M = k.value.find((se) => (se.tags || []).some((le) => Number(le.tagId) === Number(e))), H = (M == null ? void 0 : M.id) ?? null;
          g(H), b(H == null ? "" : String(H));
        }
        S(
          k.status === "fulfilled" && T.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        h(null);
      }
    }
  }
  l.find((W) => Number(W.id) === Number(c));
  const ae = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (W) => {
      W.target === W.currentTarget && !x && i();
    },
    onKeyDownCapture: (W) => dt(W, {
      onCancel: x ? void 0 : i
    })
  }, n("section", {
    ref: P,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: $t,
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
        m ? null : n("label", { key: "choice", className: "block space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Assigned group"),
          n("select", {
            key: "select",
            value: u,
            disabled: x != null,
            onChange: (W) => b(W.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((W) => n("option", { key: W.id, value: String(W.id) }, W.name))
          ])
        ]),
        m ? null : n("button", {
          key: "save",
          type: "button",
          disabled: x != null || (u === "" ? null : Number(u)) === c,
          onClick: K,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, x === "group" ? "Saving…" : "Save tag group")
      ]),
      r ? n("section", { key: "slots", className: "space-y-3 border-t border-border pt-5", "aria-labelledby": "inline-tag-slots-heading" }, [
        n("div", { key: "heading" }, [
          n("h3", { key: "title", id: "inline-tag-slots-heading", className: "text-sm font-semibold text-foreground" }, "Performer slots"),
          n("p", { key: "copy", className: "text-xs text-secondary" }, "Define the ordered performer roles used by this tag.")
        ]),
        m ? n("p", { key: "loading", className: "rounded-md border border-dashed border-border p-4 text-sm text-secondary" }, "Loading performer slots…") : a ? n("div", { key: "editor", className: "space-y-3" }, [
          n("label", { key: "duplicates", className: "flex items-center gap-2 text-sm" }, [
            n("input", {
              key: "input",
              type: "checkbox",
              checked: !!a.allowSamePerformerInMultipleSlots,
              disabled: x != null,
              onChange: (W) => s({ ...a, allowSamePerformerInMultipleSlots: W.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((W, k) => n("article", {
            key: W.id || W._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: W.label || "",
                disabled: x != null,
                onChange: (T) => C(k, { label: T.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, ns.map((T) => n("label", { key: T, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: x != null,
                  checked: (W.genderHints || []).includes(T),
                  onChange: (M) => C(k, {
                    genderHints: M.target.checked ? [.../* @__PURE__ */ new Set([...W.genderHints || [], T])] : (W.genderHints || []).filter((H) => H !== T)
                  })
                }),
                n("span", { key: "text" }, vr(T))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${W.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: x != null || k === 0, onClick: () => N(k, -1), className: ae, "aria-label": `Move ${it(W)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: x != null || k === a.definitions.length - 1, onClick: () => N(k, 1), className: ae, "aria-label": `Move ${it(W)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: x != null, onClick: () => E(k), className: `${ae} text-red-300` }, "Delete")
            ])
          ])),
          n("div", { key: "buttons", className: "flex items-center gap-2" }, [
            n("button", {
              key: "add",
              type: "button",
              disabled: x != null,
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
              className: ae
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: x != null,
              onClick: R,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, x === "slots" ? "Saving…" : "Save performer slots")
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
        disabled: x != null,
        onClick: i,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Close")
    )
  ]));
}
function Ud(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function Kd(e) {
  const { activeFilterCount: t, allSwimlanes: r, analysisError: o, analysisRun: i, analysisStatus: a, approvalFacetCounts: s, autoAssignCandidates: l, autoAssignError: d, autoAssignOpen: c, autoAssignPerformers: g, autoAssigning: u, cancelQueuedReviewsForSegments: b, canMoveSelectionToBin: m, captureTrainingExport: y, centerTimelineRef: x, closeEditorFilters: h, closeFirstSegmentTagDialog: w, closeMaterializeDialog: S, closeMergeConfirmation: O, closePublishApprovedDialog: $, closeTagEditing: P, collapsedSegmentGroups: G, commonActionsRef: C, compatibilityMode: N, configuringTag: E, createSegment: R, creatingSegmentId: K, currentTime: ae, deleteRejectedSegments: W, detail: k, detailPanelRef: T, detailWidth: M, duplicateSegment: H, editorFilters: se, editorLayout: le, editorRef: pe, exportingExamples: _, filtersButtonRef: ne, filtersOpen: ce, firstSegmentTagOpen: oe, focusRowRef: ue, handleSeparatorKeyDown: he, handleSeparatorPointerDown: V, handleSeparatorPointerMove: D, hasNextUnreviewed: re, hasPreviousUnreviewed: Ie, hideDerivedSegments: Y, history: F, historyOpen: Me, historySaving: I, horizontalLayoutSize: f, importNativeSegments: p, incorrectExamples: v, incorrectExamplesOpen: A, lineage: te, markerRailWidth: J, materializeButtonRef: q, materializeCancelButtonRef: ve, materializeDerivedSegments: z, materializeError: ee, materializeLoading: U, materializeOpen: fe, materializePreview: Ee, materializing: Q, mediaStackRef: X, mergeCancelButtonRef: xe, mergeConfirmation: be, mergeSavingRef: ie, mergeSelectedSwimlane: ke, nativeImportState: Pe, onDetailChange: Se, onNavigate: we, onReload: Re, onSlotsChanged: Ce, openPublishApprovedDialog: Oe, panelSeparatorProps: je, pendingInitialSeekRef: _e, performerSlots: Ge, performerSlotsAvailable: Ne, playbackControlsRef: qe, previewDerivedSegments: We, provenance: Qe, provenanceSources: Te, publishApprovedCancelButtonRef: $e, publishApprovedDrafts: Ke, publishApprovedError: st, publishApprovedOpen: et, quickSearchOpen: Dt, railScrollRef: nt, railToggleRef: Ot, recordHistoryAction: Jt, rejectedDeletionPreview: pn, removeIncorrectExample: kr, removingExampleId: Hn, restoreHistoryTarget: fn, runEditorAction: Gt, saveMessage: qn, saveTag: Wn, saveTiming: Yt, savingSegmentId: ct, seekRef: Nt, segmentGroups: Vn, segmentRailLayout: wr, segments: ft, selectAllVideoSegments: Nr, selectSegment: Pt, selectSegmentCollection: yn, selectedGroups: Ir, selectedPerformerSlots: Cr, selectedSegment: yt, selectedSegmentGroupKey: Qt, selectedSegmentIds: Zt, selectedSegments: bt, selectedSlotStatus: Xt, setAutoAssignError: Jn, setAutoAssignOpen: Yn, setConfiguringTag: bn, setCurrentTime: $r, setEditorFilters: hn, setEditorLayout: vn, setFiltersOpen: Qn, setHideDerivedSegments: en, setHistoryOpen: Zn, setIncorrectExamplesOpen: xn, setQuickSearchOpen: tn, setRailViewport: Ut, setRejectedDeletionPreview: Sn, setSaveMessage: kn, setSavingSegmentId: ut, setSelectedSegmentGroupKey: wn, setSelectedSegmentId: Nn, setShortcutsOpen: In, setTimelineZoom: Xn, shotBoundaries: Cn, shortcutsOpen: $n, slotButtonRef: Tr, splitLayout: Tt, splitSegment: Ar, startFullAnalysis: nn, stepVideoFrame: rn, tagEditing: Tn, tagSearchRef: He, timelineDuration: Ze, timelineRatioBounds: er, timelineZoom: Rr, toggleSegmentGroup: ht, toggleSegmentRail: vt, updateTimelineRatio: Mr, video: Ve, videoPerformers: on, visibleCounts: An, visibleSegmentRailRows: tr, visibleSegments: nr, wideLayout: Lt, workspaceRef: Er } = e, rr = Ue(
    () => ft.filter((j) => !j.published && j.reviewState === "approved"),
    [ft]
  ), It = Zi(Xr), Rn = rr.length, Mn = Ee ? Ee.createCount + Ee.linkCount : null, Ct = ct != null, Kt = bt.length > 0, En = bt.length === 1, rt = Kt && bt.every((j) => j.reviewState === "approved"), de = Kt && bt.every((j) => j.reviewState === "rejected"), At = [
    { id: "marker.create", label: "New segment", disabled: Ct },
    { id: "marker.editTag", label: "Edit tag", disabled: Ct || !Kt },
    { id: "marker.setStart", label: "Set start", disabled: Ct || !En },
    { id: "marker.setEnd", label: "Set end", disabled: Ct || !En },
    { id: "marker.split", label: "Split", disabled: Ct || !En },
    ...N ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !Ie, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: rt ? "Unapprove" : "Approve", disabled: Ct || !Kt, tone: "approve" },
      { id: "marker.reject", label: de ? "Unreject" : "Reject", disabled: Ct || !Kt, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !re, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...N ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: Ct || !m, tone: "reject" }
    ]
  ];
  function or(j) {
    const Le = Zt.includes(j.id), tt = j.id === (yt == null ? void 0 : yt.id), Xe = j.endSec == null ? Ae(j.startSec) : `${Ae(j.startSec)} – ${Ae(j.endSec)}`, mt = `${wt(j.sourceKey)}${j.confidence != null ? ` · ${Math.round(j.confidence * 100)}%` : ""}`;
    return n("button", {
      key: j.id,
      type: "button",
      onClick: (Rt) => Pt(j, { additive: Rt.metaKey || Rt.ctrlKey }),
      "aria-pressed": Le,
      "aria-current": tt ? "true" : void 0,
      "data-selected-segment-shortcut-target": tt ? "true" : void 0,
      "aria-label": N ? `${j.tagName || "Tag segment"}, ${j.reviewState}${j.isDerived ? ", derived segment" : ""}, ${Xe}` : `${j.tagName || "Tag segment"}${j.isDerived ? ", derived segment" : ""}, ${Xe}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: ei(Le, tt)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        N ? n(Vt, { key: "review", state: j.reviewState, includeLabel: !1 }) : null,
        j.isDerived ? n(Sr, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          j.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, Xe),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: mt
        }, mt)
      ])
    ]);
  }
  const zt = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", an = [...F.actions || []].reverse().find((j) => j.sequence <= F.cursorSequence);
  return n("section", {
    ref: pe,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${Tt ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (j) => di(j, we, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${Ve.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: Ve.title || `Video ${Ve.id}`
          }, Ve.title || `Video ${Ve.id}`)),
          ...on.map((j) => n(Un, {
            key: Ye(j),
            performer: { id: Ye(j), name: j.name },
            compact: !0,
            tooltip: j.name
          })),
          N ? n(jt, { key: "review-counts", counts: An }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          N ? null : n(mi, { key: "bin", onNavigate: we, compact: !0 }),
          n(gi, { key: "settings", onNavigate: we, compact: !0 })
        ])
      ]),
      N && k.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${k.nativeImportCount} Cove segment${k.nativeImportCount === 1 ? "" : "s"} ${k.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        Pe.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, Pe.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => p("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => p("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        Pe.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, Pe.error) : null
      ]) : null,
      o && (a == null ? void 0 : a.configured) !== !1 ? n("div", {
        key: "analysis-error",
        role: "alert",
        className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300"
      }, o) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          N ? n("div", {
            key: "full-analysis",
            className: "inline-flex items-stretch"
          }, [
            n("button", {
              key: "run",
              type: "button",
              disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
              onClick: () => nn(),
              title: (a == null ? void 0 : a.error) || "Run AI tagging and shot boundary analysis into the Full review workflow",
              className: "segment-studio-full-scan-run inline-flex items-center justify-center bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
            }, (a == null ? void 0 : a.configured) === !1 ? "Full Scan not configured" : (a == null ? void 0 : a.ready) === !1 ? "Full Scan unavailable" : (i == null ? void 0 : i.status) === "queued" ? "Full Scan queued…" : (i == null ? void 0 : i.status) === "running" ? "Full Scan running…" : "Full Scan"),
            n("details", { key: "choices", className: "relative flex" }, [
              n("summary", {
                key: "summary",
                "aria-label": "Choose Full Scan analyses",
                "aria-disabled": (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                title: "Choose analyses",
                onClick: (j) => {
                  ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && j.preventDefault();
                },
                onKeyDown: (j) => {
                  (j.key === "Enter" || j.key === " ") && ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && j.preventDefault();
                },
                className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${(a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running" ? "pointer-events-none cursor-default opacity-50" : "cursor-pointer hover:opacity-90"}`
              }, n(Ca, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([j, Le]) => n("button", {
                key: j,
                type: "button",
                disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                onClick: (tt) => {
                  var Xe;
                  (Xe = tt.currentTarget.closest("details")) == null || Xe.removeAttribute("open"), nn(Le);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, j)))
            ])
          ]) : null,
          N ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: ct != null || l.length === 0,
            onClick: () => {
              Jn(""), Yn(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${l.length ? ` (${l.length})` : ""}`) : null,
          N ? n("button", {
            key: "materialize-derived",
            ref: q,
            type: "button",
            disabled: ct != null || U || Q || Mn === 0,
            onClick: We,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, U ? "Analyzing…" : `Auto-Materialize${Mn != null ? ` (${Mn})` : ""}`) : null,
          N ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: ct != null || Rn === 0,
            onClick: (j) => Oe(j.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": et,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${Rn ? ` (${Rn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: _ || Hn != null || v.length === 0,
            onClick: () => xn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": A,
            "aria-label": `Open AI feedback collection, ${v.length} example${v.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${v.length ? ` (${v.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: ne,
            type: "button",
            onClick: () => Qn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": ce,
            className: `${zt} ${t ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(dr, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${t ? ` (${t})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => In(!0),
            className: zt
          }, [n(dr, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: (N ? F.actions.length === 0 : an == null) || ct != null || I,
            onClick: N ? () => Zn((j) => !j) : () => fn(
              an.sequence - 1
            ),
            "aria-haspopup": N ? "dialog" : void 0,
            "aria-expanded": N ? Me : void 0,
            className: zt
          }, [
            n(dr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, N ? `History${F.actions.length ? ` (${F.actions.length})` : ""}` : an ? `Undo ${an.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: Ot,
            type: "button",
            onClick: vt,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": le.markerRailOpen,
            className: zt
          }, [
            n(dr, { key: "icon", name: "list" }),
            n("span", { key: "label" }, le.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    N && Me ? n("section", {
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
          onClick: () => Zn(!1),
          className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
        }, "Close")
      ]),
      n("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
        ...[...F.actions].reverse().map((j) => n("button", {
          key: j.sequence,
          type: "button",
          disabled: I,
          onClick: () => fn(j.sequence),
          "aria-current": F.cursorSequence === j.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${j.sequence > F.cursorSequence ? "text-secondary" : "text-foreground"} ${F.cursorSequence === j.sequence ? "bg-accent/15" : ""}`
        }, [
          n("span", { key: "label", className: "min-w-0 flex-1 truncate" }, j.label),
          n("time", {
            key: "time",
            dateTime: j.createdAt,
            className: "shrink-0 text-[10px] text-secondary"
          }, new Date(j.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        ])),
        n("button", {
          key: "baseline",
          type: "button",
          disabled: I,
          onClick: () => fn(F.baselineSequence),
          "aria-current": F.cursorSequence === F.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${F.cursorSequence === F.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    ce ? n(Td, {
      key: "editor-filters",
      filters: se,
      hideDerivedSegments: Y,
      performers: on,
      provenanceSources: Te,
      reviewCounts: s,
      segments: ft,
      segmentGroups: Vn,
      reviewMode: N,
      onChange: hn,
      onHideDerivedChange: en,
      onClose: h
    }) : null,
    oe ? n($d, {
      key: "first-segment-tag-dialog",
      saving: ct != null,
      error: qn,
      onSelect: (j, Le) => R(j, Le),
      onClose: w
    }) : null,
    Dt ? n(Md, {
      key: "quick-search-dialog",
      segments: gl(r),
      onSelect: (j) => {
        tn(!1), Pt(j, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        tn(!1), requestAnimationFrame(() => {
          var j;
          return (j = pe.current) == null ? void 0 : j.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    c ? n(Od, {
      key: "auto-assign-dialog",
      candidates: l,
      processing: u,
      error: d,
      onConfirm: g,
      onClose: () => Yn(!1)
    }) : null,
    be ? n(Ld, {
      key: "merge-selection-dialog",
      merge: be,
      processing: ie.current,
      undoable: !N,
      cancelButtonRef: xe,
      onConfirm: (j) => ke(!0, j, be),
      onClose: O
    }) : null,
    fe ? n(jd, {
      key: "materialize-derived-dialog",
      preview: Ee,
      loading: U,
      processing: Q,
      error: ee,
      cancelButtonRef: ve,
      onConfirm: z,
      onClose: () => {
        Q || S();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: Er,
      className: `${Tt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      le.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: Lt ? { position: "absolute", top: 0, right: 0, width: J, height: f.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        ft.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : nr.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: nt,
          onScroll: (j) => Ut({
            scrollTop: j.currentTarget.scrollTop,
            height: j.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: wr.height }
        }, tr.map((j) => {
          var tt;
          let Le;
          if (j.kind === "group") {
            const Xe = G.includes(j.group.key), mt = j.group.lanes.reduce((Rt, Dn) => Rt + Dn.markers.length, 0);
            Le = n("button", {
              type: "button",
              onClick: () => {
                wn(j.group.key), ht(j.group.key);
              },
              "aria-expanded": !Xe,
              "aria-current": Qt === j.group.key ? "true" : void 0,
              "data-segment-rail-group": j.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${Qt === j.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, Xe ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: j.group.name }, j.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, mt),
              N && Xe ? n(jt, { key: "states", counts: j.group.counts }) : null
            ]);
          } else j.kind === "lane" ? Le = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Gn(j.lane),
            "aria-label": Gn(j.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, j.lane.label),
            (tt = j.lane.performers) != null && tt.length ? n(xr, {
              key: "performers",
              performers: j.lane.performers,
              performerAssignments: j.lane.performerAssignments
            }) : null,
            N ? n(jt, { key: "states", counts: j.lane.counts }) : null
          ]) : Le = or(j.segment);
          return n("div", {
            key: j.key,
            className: "absolute left-0 right-0",
            style: { top: j.top, height: j.height }
          }, Le);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${Tt ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: X,
          className: `${Tt ? "min-h-0 flex-1" : ""} grid`,
          style: Tt ? {
            gridTemplateRows: `minmax(16rem, ${(1 - le.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${le.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: ue,
            className: "grid min-h-0 gap-2",
            style: Lt ? {
              gridTemplateColumns: le.markerRailOpen ? `${M}px 0.5rem minmax(0,1fr) 0.5rem ${J}px` : `${M}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(Bd, {
              key: "tools",
              compatibilityMode: N,
              selectedSegment: yt,
              selectedSegments: bt,
              selectedGroups: Ir,
              saveMessage: qn,
              savingSegmentId: ct,
              creatingSegmentId: K,
              setSavingSegmentId: ut,
              setSaveMessage: kn,
              saveTag: Wn,
              slotStatus: Xt,
              performerSlotsAvailable: Ne,
              selectedPerformerSlots: Cr,
              performerSlots: Ge,
              detail: k,
              onDetailChange: Se,
              onCancelQueuedReview: b,
              video: Ve,
              slotButtonRef: Tr,
              tagSearchRef: He,
              tagEditing: Tn,
              onCancelTagEditing: P,
              detailPanelRef: T,
              onReduceSelection: (j) => {
                Pt(j), requestAnimationFrame(() => {
                  var Le;
                  return (Le = T.current) == null ? void 0 : Le.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Yt,
              onSlotsChanged: Ce,
              onRecordHistory: Jt,
              splitSegment: Ar,
              duplicateSegment: H,
              provenance: Qe,
              lineage: te,
              onNavigateLineageItem: (j) => {
                const Le = ft.find((tt) => tt.itemId === j);
                Le && Nn(Le.id);
              }
            }),
            Lt ? n(
              "div",
              { key: "detail-separator", ...je("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Ve.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Sa, {
                streamUrl: `/api/stream/video/${Ve.id}`,
                posterUrl: `/api/stream/video/${Ve.id}/screenshot?v=${encodeURIComponent(Ve.updatedAt || "")}`,
                format: Ve.videoFile.format,
                audioCodec: Ve.videoFile.audioCodec,
                duration: Ve.videoFile.duration,
                videoId: Ve.id,
                trackingEnabled: !1,
                onSeekRegister: (j) => {
                  Nt.current = j, dl(_e.current, ft, j) && (_e.current = null);
                },
                onPlaybackControlRegister: (j) => {
                  qe.current = j;
                },
                onTimeUpdate: $r
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            Lt && le.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...je("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Lt && le.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: C,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...At.map((j) => {
              var Xe;
              const Le = (Xe = It[j.id]) == null ? void 0 : Xe[0], tt = j.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : j.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: j.id,
                type: "button",
                disabled: j.disabled,
                "data-action-id": j.id,
                onClick: (mt) => {
                  const Rt = mt.currentTarget;
                  Gt(j.id, { target: Rt, preserveFocus: !0 }), j.focusWhenDisabled && requestAnimationFrame(() => {
                    Ud(Rt, C.current, j.focusWhenDisabled);
                  });
                },
                title: Le ? `${j.label} (${Le})` : j.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${tt}`
              }, [
                n("span", { key: "label" }, j.label),
                Le ? n("kbd", {
                  key: "shortcut",
                  className: "rounded border border-border/70 bg-background/70 px-1 py-0.5 font-mono text-[10px] leading-none text-secondary"
                }, Le) : null
              ]);
            }),
            n("div", { key: "frame-actions", className: "ml-auto flex items-center gap-1" }, [
              n("button", {
                key: "previous-frame",
                type: "button",
                disabled: !Ve.videoFile,
                onClick: () => rn(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(Xi, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !Ve.videoFile,
                onClick: () => rn(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(es, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          Tt ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(er.minimum * 100),
            "aria-valuemax": Math.round(er.maximum * 100),
            "aria-valuenow": Math.round(le.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(le.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: V,
            onPointerMove: D,
            onKeyDown: he,
            onDoubleClick: () => Mr(lt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: Tt ? void 0 : { height: "20rem" } }, n(Gd, {
            segments: nr,
            shotBoundaries: Cn,
            segmentGroups: Vn,
            performerSlots: Ge,
            collapsedGroupKeys: G,
            selectedGroupKey: Qt,
            selectedSegmentId: yt == null ? void 0 : yt.id,
            selectedSegmentIds: Zt,
            duration: Ze,
            currentTime: ae,
            zoom: Rr,
            onZoomChange: Xn,
            onSelectGroup: wn,
            onToggleGroup: ht,
            onSelect: (j, Le) => Pt(j, Le),
            onSelectSegments: yn,
            onSelectAll: Nr,
            onConfigureTag: (j) => bn(j),
            onSeekTime: (j) => {
              var Le;
              return (Le = Nt.current) == null ? void 0 : Le.call(Nt, j, !1);
            },
            centerRef: x,
            showReviewState: N,
            swimlaneTitleWidth: le.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (j) => vn((Le) => ({ ...Le, swimlaneTitleWidth: j }))
          }))
        ])
      ])
    ]),
    E ? n(mo, {
      key: `configure-tag:${E.tagId}`,
      tagId: E.tagId,
      tagName: E.tagName,
      performerSlotsEnabled: N,
      onSaved: Re,
      onClose: () => {
        const j = E.trigger;
        bn(null), requestAnimationFrame(() => {
          var Le;
          j != null && j.isConnected ? j.focus({ preventScroll: !0 }) : (Le = pe.current) == null || Le.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    et ? n(Dd, {
      key: "publish-approved-dialog",
      drafts: rr,
      processing: ct === -1,
      error: st,
      cancelButtonRef: $e,
      onConfirm: Ke,
      onClose: $
    }) : null,
    pn ? n(Pd, {
      key: "rejected-deletion-dialog",
      preview: pn,
      onConfirm: () => {
        W(pn), requestAnimationFrame(() => {
          var j;
          return (j = pe.current) == null ? void 0 : j.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Sn(null), requestAnimationFrame(() => {
          var j;
          return (j = pe.current) == null ? void 0 : j.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    $n ? n(Ad, {
      key: "shortcuts-dialog",
      reviewMode: N,
      bindings: It,
      onClose: () => In(!1)
    }) : null,
    A ? n(Rd, {
      key: "incorrect-examples-dialog",
      examples: v,
      exporting: _,
      removingExampleId: Hn,
      onExport: y,
      onRemove: kr,
      onClose: () => xn(!1)
    }) : null
  ]);
}
function zd(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: u, setEditorFilters: b, setHideDerivedSegments: m, setSaveMessage: y, setSelectedSegmentGroupKey: x, setSelectedSegmentId: h, setSelectedSegmentIds: w } = e;
  function S(C) {
    const N = St(t, C);
    N && u((E) => si(E, N));
  }
  function O(C) {
    h(C), w(C == null ? [] : [C]), c.current = C, g.current = [];
  }
  function $(C, {
    focusEditor: N = !1,
    seekToSegment: E = !1,
    additive: R = !1,
    rangeSegmentIds: K = null
  } = {}) {
    var W, k;
    const ae = $s({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, C.id, K, R);
    w(ae.selectedSegmentIds), h(ae.activeSegmentId), c.current = ae.anchorSegmentId, g.current = ae.rangeBaseSegmentIds, ae.activeSegmentId != null && x(St(t, ae.activeSegmentId)), S(C.id), N && ((W = r.current) == null || W.focus({ preventScroll: !0 })), E && ((k = i.current) == null || k.call(i, C.startSec, !1));
  }
  function P(C) {
    const N = Is(
      d,
      l,
      C
    );
    w(N.selectedSegmentIds), h(N.activeSegmentId), c.current = N.activeSegmentId, g.current = [], N.activeSegmentId != null && (x(St(t, N.activeSegmentId)), S(N.activeSegmentId));
  }
  function G() {
    var E;
    const C = As(s), N = C.includes(l) ? l : C[0] ?? null;
    b(pt({})), m(!1), w(C), h(N), c.current = N, g.current = [], N != null && x(St(
      qt(s, a, o),
      N
    )), y(C.length === 0 ? "There are no segments to select." : `${C.length} segments selected. Collapsed Segment groups keep their selected segments.`), (E = r.current) == null || E.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: S, replaceSegmentSelection: O, selectSegment: $, selectSegmentCollection: P, selectAllVideoSegments: G };
}
function _d(e) {
  const { acceptHistory: t, compatibilityMode: r, detail: o, detailPanelRef: i, historyRef: a, mergeSavingRef: s, onConflict: l, onDetailChange: d, onReload: c, pendingReviewStateRef: g, recordHistoryAction: u, revealSegmentGroupForSelection: b, reviewSavingRef: m, savingSegmentId: y, selectedGroups: x, selectedSegment: h, selectedSegmentIdRef: w, selectedSegments: S, selectionAnchorIdRef: O, selectionRangeBaseIdsRef: $, setMergeConfirmation: P, setSaveMessage: G, setSavingSegmentId: C, setSelectedSegmentId: N, setSelectedSegmentIds: E, video: R } = e;
  function K() {
    P(null), requestAnimationFrame(() => {
      var k;
      return (k = i.current) == null ? void 0 : k.focus({ preventScroll: !0 });
    });
  }
  async function ae(k = !1, T = !1, M = null) {
    if (s.current || y != null) return;
    const H = M || ai(
      x,
      { nativeOnly: !r }
    );
    if (!H) {
      G("Select at least two segments from one swimlane.");
      return;
    }
    if (!k && La()) {
      P(H);
      return;
    }
    T && Fa(!1), K();
    const se = H.endSec == null ? "open end" : Ae(H.endSec);
    s.current = !0;
    let le = H.segments[0];
    const pe = r ? null : gt(H.segments, !1), _ = r ? null : crypto.randomUUID(), ne = H.segments.map((oe) => oe.id), ce = rd(o, H.segments);
    C(le.id), d(ce, R.id), E([le.id]), N(le.id), O.current = le.id, $.current = [];
    try {
      const oe = H.segments.slice(1);
      if (!r || le.nativeSegmentId != null) {
        const ue = oe.map((V) => {
          const D = `merge-native-selection:${R.id}:${le.id}:${V.id}:${le.updatedAt}:${V.updatedAt}`;
          return { key: D, operationId: Fe(D), segmentId: V.id, expectedUpdatedAt: V.updatedAt };
        }), he = await Z(`/videos/${R.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: le.id,
            expectedSurvivorUpdatedAt: le.updatedAt,
            consumedSegments: ue.map(({ key: V, ...D }) => D),
            historyReceiptId: _
          })
        });
        le = he.survivor, d(ta(o, he), R.id), ue.forEach(({ key: V }) => Be(V));
      } else {
        const ue = oe.map((V) => {
          const D = `merge-draft-selection:${R.id}:${le.itemId}:${V.itemId}:${le.revision}:${V.revision}`;
          return { key: D, operationId: Fe(D), itemId: V.itemId, expectedRevision: V.revision };
        }), he = await Z(`/videos/${R.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: le.itemId,
            expectedSurvivorRevision: le.revision,
            consumedDrafts: ue.map(({ key: V, ...D }) => D)
          })
        });
        le = he.survivor, d(ta(o, he), R.id), ue.forEach(({ key: V }) => Be(V));
      }
      E([le.id]), N(le.id), O.current = le.id, $.current = [], r ? t(Mt) : await u(
        "segments.merge",
        `Merged ${H.segments.length} segments`,
        pe,
        gt([le], !1),
        _
      ), b(le.id), G(`${H.segments.length} segments merged into ${Ae(H.startSec)} – ${se}.`);
    } catch (oe) {
      d((ue) => li(
        Kn(ue, [H.segments[0]], [
          "startSec",
          "endSec",
          "sourceKey",
          "sourceRunId",
          "confidence",
          "isDerived"
        ]),
        H.segments.slice(1)
      ), R.id), E(ne), N((h == null ? void 0 : h.id) ?? ne[0] ?? null), O.current = (h == null ? void 0 : h.id) ?? ne[0] ?? null, $.current = [], oe.status === 409 ? await l() : G(oe.message || "Unable to merge selected segments.");
    } finally {
      s.current = !1, C(null);
    }
  }
  async function W(k, T = S, M = h) {
    var ce;
    if (T.length === 0 || m.current) return;
    if (y != null) {
      g.current.push(zs(
        k,
        T,
        M
      )), G(`${k === "approved" ? "Approval" : "Rejection"} queued…`);
      return;
    }
    const H = Ks(T, k), se = T.filter((oe) => oe.reviewState !== H);
    if (se.length === 0) return;
    const le = T.map((oe) => ({
      id: oe.id,
      itemId: oe.itemId,
      nativeSegmentId: oe.nativeSegmentId
    })), pe = le.find((oe) => oe.id === (M == null ? void 0 : M.id)) || le[0], _ = (oe, ue = !1) => {
      if (!(oe != null && oe.segments) || !ue && !Hr(w.current, pe.id))
        return;
      const he = le.map((D) => ze(oe == null ? void 0 : oe.segments, D)).filter(Boolean), V = ze(oe == null ? void 0 : oe.segments, pe) || he[0] || null;
      E(he.map((D) => D.id)), N((V == null ? void 0 : V.id) ?? null), O.current = (V == null ? void 0 : V.id) ?? null, $.current = [];
    };
    m.current = !0, C((M == null ? void 0 : M.id) ?? se[0].id), G(`Updating ${se.length} selected segment${se.length === 1 ? "" : "s"}…`);
    const ne = br(
      o,
      se.map((oe) => oe.id),
      { reviewState: H }
    );
    d(ne, R.id);
    try {
      const oe = await Z(`/videos/${R.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: a.current.revision,
          reviewState: H,
          segments: T.map((D) => D.published ? {
            nativeSegmentId: D.nativeSegmentId,
            expectedUpdatedAt: D.updatedAt
          } : {
            itemId: D.itemId,
            expectedRevision: D.revision
          })
        })
      }), ue = new Map((oe.items || []).map((D) => [
        D.requestedNativeSegmentId != null ? `native:${D.requestedNativeSegmentId}` : `item:${D.requestedItemId}`,
        D
      ]));
      if (le.forEach((D) => {
        const re = ue.get(D.nativeSegmentId != null ? `native:${D.nativeSegmentId}` : `item:${D.itemId}`);
        re && (D.nativeSegmentId = re.nativeSegmentId, D.itemId = re.itemId);
      }), oe.history && t(oe.history), H === "rejected" || (oe.items || []).some((D) => D.requestedNativeSegmentId != null && D.nativeSegmentId !== D.requestedNativeSegmentId)) {
        _(await c()), G(`${oe.updatedCount} selected segment${oe.updatedCount === 1 ? "" : "s"} ${H === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const V = {
        ...o,
        approvedSetVersion: oe.approvedSetVersion || o.approvedSetVersion,
        segments: (o.segments || []).map((D) => {
          const re = ue.get(D.nativeSegmentId != null ? `native:${D.nativeSegmentId}` : `item:${D.itemId}`);
          return re ? {
            ...D,
            id: re.nativeSegmentId != null ? re.nativeSegmentId : -re.itemId,
            itemId: re.itemId,
            nativeSegmentId: re.nativeSegmentId,
            published: re.nativeSegmentId != null,
            reviewState: H,
            revision: re.nativeSegmentId != null ? D.revision : re.revision,
            updatedAt: re.updatedAt
          } : D;
        })
      };
      d(V, R.id), _(V), G(`${oe.updatedCount} selected segment${oe.updatedCount === 1 ? "" : "s"} ${H === "approved" ? "approved" : H === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (oe) {
      d((he) => Kn(
        he,
        se,
        ["reviewState"]
      ), R.id), oe.status === 409 && ((ce = oe.payload) != null && ce.currentHistory) && t(oe.payload.currentHistory);
      const ue = oe.status === 409 ? await l() : o;
      _(ue, !0), G(oe.message || "Unable to update the selected segments.");
    } finally {
      m.current = !1, C(null);
    }
  }
  return { closeMergeConfirmation: K, mergeSelectedSwimlane: ae, saveSelectedReviewState: W };
}
function Hd(e) {
  const { acceptHistory: t, allSwimlanes: r, autoAssignCandidates: o, autoAssigning: i, binEmptyingRef: a, canMoveSelectionToBin: s, closeTagEditing: l, compatibilityMode: d, creatingSegmentId: c, detail: g, editorRef: u, exportingExamples: b, incorrectExamples: m, lineage: y, materializeButtonRef: x, materializePreview: h, materializeRestoreFocusRef: w, materializing: S, mutateSegment: O, onConflict: $, onDetailChange: P, onReload: G, queuedCreatedSegmentTagRef: C, recordHistoryAction: N, refreshMaterializationPreview: E, removingExampleId: R, revealSegmentGroupForSelection: K, savingSegmentId: ae, segments: W, selectedSegment: k, selectedSegmentIdRef: T, selectedSegments: M, selectionAnchorIdRef: H, selectionRangeBaseIdsRef: se, setAutoAssignError: le, setAutoAssignOpen: pe, setAutoAssigning: _, setExportingExamples: ne, setIncorrectExamples: ce, setMaterializeError: oe, setMaterializeLoading: ue, setMaterializeOpen: he, setMaterializePreview: V, setMaterializing: D, setRejectedDeletionPreview: re, setRemovingExampleId: Ie, setSaveMessage: Y, setSavingSegmentId: F, setSelectedSegmentGroupKey: Me, setSelectedSegmentId: I, setSelectedSegmentIds: f, video: p } = e;
  async function v() {
    var we, Re, Ce;
    if (M.length === 0 || !k || ae != null) return;
    const Q = Ql(M, m), X = Q.segments;
    if (X.length === 0) return;
    const xe = M.map((Oe) => ({
      id: Oe.id,
      itemId: Oe.itemId,
      nativeSegmentId: Oe.nativeSegmentId
    })), be = xe.find((Oe) => Oe.id === k.id) || xe[0], ie = [], ke = [];
    let Pe = !1, Se = g;
    F(be.id), Y(Q.action === "remove" ? `Removing ${X.length} selected incorrect example${X.length === 1 ? "" : "s"}…` : `Collecting ${X.length} selected segment${X.length === 1 ? "" : "s"} as incorrect AI feedback…`);
    try {
      const Oe = async (Te, $e) => {
        const Ke = Te.nativeSegmentId != null, st = Q.action === "remove" ? `incorrect-example-remove:${p.id}:${$e == null ? void 0 : $e.id}:${$e == null ? void 0 : $e.revision}:${$e == null ? void 0 : $e.representationRevision}` : `incorrect-example-collect:${p.id}:${Ke ? `native:${Te.nativeSegmentId}:${Te.updatedAt}` : `item:${Te.itemId}:${Te.revision}`}`;
        if (Q.action === "remove" && !$e)
          throw new Error("The incorrect-example collection changed. Reload and try again.");
        let et;
        try {
          et = Q.action === "remove" ? await Z(
            `/videos/${p.id}/incorrect-examples/${$e.id}/remove`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Fe(st),
                expectedExampleRevision: $e.revision,
                expectedRepresentationRevision: $e.representationRevision
              })
            }
          ) : await Z(`/videos/${p.id}/incorrect-examples/collect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(st),
              nativeSegmentId: Ke ? Te.nativeSegmentId : null,
              itemId: Ke ? null : Te.itemId,
              expectedUpdatedAt: Ke ? Te.updatedAt : null,
              expectedRevision: Ke ? null : Te.revision
            })
          });
        } catch (Dt) {
          throw Dt.operationKey = st, Dt;
        }
        if (!Zl(Q.action, et))
          throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
        return Be(st), et;
      };
      for (const Te of X) {
        const $e = Q.action === "remove" ? m.find((Ke) => Ke.itemId != null && Ke.itemId === Te.itemId) : null;
        try {
          const Ke = xe.find((nt) => nt.id === Te.id);
          let st = ze(
            Se == null ? void 0 : Se.segments,
            Ke
          ) || Te, et;
          try {
            et = await Oe(st, $e);
          } catch (nt) {
            if (nt.status === 409 && ((Re = (we = nt.payload) == null ? void 0 : we.result) == null ? void 0 : Re.code) === "OPERATION_REPLAYED")
              Se = await Z(
                `/videos/${p.id}/editor`
              ), Be(nt.operationKey), et = nt.payload.result;
            else {
              if (Q.action !== "collect" || nt.status !== 409) throw nt;
              const Ot = await Z(
                `/videos/${p.id}/editor`
              );
              Se = Ot;
              const Jt = ze(
                Ot == null ? void 0 : Ot.segments,
                Ke
              );
              if (!Jt) throw nt;
              st = Jt, et = await Oe(st, null);
            }
          }
          Ke && et.itemId != null && (Ke.itemId = et.itemId), Se = Jr(
            Se,
            et.editorDelta
          );
          const Dt = { segment: Te, result: et, example: $e };
          ie.push(Dt);
        } catch (Ke) {
          if (ke.push(Ke), ![400, 404, 409].includes(Ke.status)) break;
        }
      }
      if (d && ie.length > 0) {
        const Te = Q.action === "remove", $e = ie.length;
        await N(
          Te ? "feedback.remove" : "feedback.collect",
          Te ? `Removed ${$e} incorrect AI example${$e === 1 ? "" : "s"}` : `Collected ${$e} incorrect AI example${$e === 1 ? "" : "s"}`,
          lr(ie, Te),
          lr(ie, !Te)
        ) || (Pe = !0);
      }
      ie.some(({ result: Te }) => Te.representation === "basicNativeBin") && Fn();
      const je = Hr(
        T.current,
        be.id
      ), _e = Q.action === "collect" && ie.some(({ segment: Te }) => Te.id === be.id), Ge = ie.map(({ segment: Te }) => Te.id), Ne = _e ? Ms(
        r,
        Ge,
        be.id
      ) : null, qe = _e ? (Ne == null ? void 0 : Ne.id) ?? null : be.id;
      je && _e && (f(Ne ? [Ne.id] : []), I((Ne == null ? void 0 : Ne.id) ?? pr), H.current = (Ne == null ? void 0 : Ne.id) ?? null, se.current = []);
      const We = await Z(`/videos/${p.id}/incorrect-examples`);
      ce(We);
      const Qe = Se;
      if (P(Qe, p.id), je && Hr(
        T.current,
        qe
      )) {
        let Te, $e;
        _e ? ($e = Ne ? ze(Qe == null ? void 0 : Qe.segments, {
          id: Ne.id,
          itemId: Ne.itemId,
          nativeSegmentId: Ne.nativeSegmentId
        }) : null, Te = $e ? [$e] : []) : (Te = xe.map((Ke) => ze(Qe == null ? void 0 : Qe.segments, Ke)).filter(Boolean), $e = ze(Qe == null ? void 0 : Qe.segments, be) || Te[0] || null), f(Te.map((Ke) => Ke.id)), I(($e == null ? void 0 : $e.id) ?? (_e ? pr : null)), H.current = ($e == null ? void 0 : $e.id) ?? null, se.current = [], Me($e ? St(r, $e.id) : null), $e && K($e.id);
      }
      if (ke.length > 0) {
        const Te = ((Ce = ke[0]) == null ? void 0 : Ce.message) || "Only segments with registered AI provenance can be collected.";
        ie.length === 0 ? Y(Te) : Q.action === "remove" ? Y(
          `Partially removed ${ie.length} of ${X.length} selected incorrect examples. ${Te}`
        ) : Y(
          `Partially collected ${ie.length} of ${X.length} selected segments. ${Te}`
        );
      } else if (Q.action === "remove")
        Y(
          `${ie.length} incorrect example${ie.length === 1 ? "" : "s"} removed and ${ie.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
        );
      else {
        const Te = ie.filter(({ result: $e }) => $e.representation === "basicNativeBin").length;
        Y(Te === ie.length ? `${ie.length} incorrect AI example${ie.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ie.length} incorrect AI example${ie.length === 1 ? "" : "s"} collected and ${ie.length === 1 ? "segment rejected" : "segments rejected"}.`);
      }
      Pe && Y("The change saved, but editor history could not be updated.");
    } catch (Oe) {
      Y(Oe.message || "Unable to update the selected incorrect examples.");
    } finally {
      F(null);
    }
  }
  async function A(Q) {
    var xe, be;
    if (!Q || R != null || b) return;
    Ie(Q.id);
    const X = `incorrect-example-remove:${p.id}:${Q.id}:${Q.revision}:${Q.representationRevision}`;
    try {
      let ie, ke = !1;
      try {
        ie = await Z(
          `/videos/${p.id}/incorrect-examples/${Q.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(X),
              expectedExampleRevision: Q.revision,
              expectedRepresentationRevision: Q.representationRevision
            })
          }
        );
      } catch (we) {
        if (we.status !== 409 || ((be = (xe = we.payload) == null ? void 0 : xe.result) == null ? void 0 : be.code) !== "OPERATION_REPLAYED")
          throw we;
        ie = we.payload.result, ke = !0;
      }
      Be(X);
      let Pe = !0;
      if (d) {
        const Re = [{ segment: ze(g.segments, {
          itemId: Q.itemId
        }) || {
          id: Q.itemId == null ? null : -Q.itemId,
          itemId: Q.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: Q.representationRevision
        }, result: ie, example: Q }];
        Pe = await N(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          lr(Re, !0),
          lr(Re, !1)
        );
      }
      const Se = await Z(
        `/videos/${p.id}/incorrect-examples`
      );
      ce(Se), ke ? await G() : P(
        Jr(g, ie.editorDelta),
        p.id
      ), Q.representation === "basicNativeBin" && Fn(), Y(Pe ? ke ? d ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : Q.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (ie) {
      ie.status === 409 && await $(), Y(ie.message || "Unable to remove the incorrect example.");
    } finally {
      Ie(null);
    }
  }
  async function te() {
    if (b || R != null || m.length === 0) return;
    ne(!0);
    const Q = `incorrect-example-export:${p.id}:${m.map((X) => `${X.id}:${X.revision}:${X.representationRevision}`).join(",")}`;
    try {
      const X = await ed(
        p.id,
        m
      ), xe = new FormData();
      xe.append("metadata", JSON.stringify({
        operationId: Fe(Q),
        examples: X.captures
      }));
      for (const we of X.files)
        xe.append(we.fieldName, we.file);
      const be = await Z(
        `/videos/${p.id}/incorrect-examples/export`,
        { method: "POST", body: xe }
      ), ie = await bl(be.downloadUrl), ke = URL.createObjectURL(ie.blob), Pe = document.createElement("a");
      Pe.href = ke, Pe.download = ie.fileName, Pe.click(), setTimeout(() => URL.revokeObjectURL(ke), 1e3);
      const Se = await Z(
        `/training-exports/${be.id}/complete`,
        { method: "POST" }
      );
      Be(Q), ce(await Z(
        `/videos/${p.id}/incorrect-examples`
      )), Y(
        `Downloaded ${be.exampleCount} incorrect example${be.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Se.clearedExampleCount} from the working collection.`
      );
    } catch (X) {
      Y(X.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      ne(!1);
    }
  }
  async function J(Q = null) {
    const X = W.filter((Re) => Re.reviewState === "rejected"), xe = X.length, be = m.some((Re) => Re.representation === "fullItem");
    if (Q == null && xe === 0 && !be) {
      Y("There are no rejected segments to delete.");
      return;
    }
    if (Q == null) {
      F(-1), Y("Preparing deletion summary…");
      try {
        const Re = await Z(`/videos/${p.id}/rejected/deletion/preview`, { method: "POST" }), Ce = Number(Re.deletedSegmentCount) || 0, Oe = Number(Re.deferredRejectedSegmentCount) || 0, je = Number(Re.protectedIncorrectExampleCount) || 0;
        if (Ce === 0) {
          Oe > 0 ? Y(
            `${Oe} feedback-protected rejected segment${Oe === 1 ? "" : "s"} kept. ${je} AI feedback example${je === 1 ? "" : "s"} must be exported before ${Oe === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : Y("There are no rejected segments to delete.");
          return;
        }
        if (!Ya(Re, Y)) return;
        re(Re), Y("");
      } catch (Re) {
        Y(Re.message || "Unable to prepare rejected segment deletion.");
      } finally {
        F(null);
      }
      return;
    }
    const ie = Q, ke = Number(ie.deferredRejectedSegmentCount) || 0, Pe = T.current, Se = ke === 0 ? Yr(g, X.map((Re) => Re.id)) : g, we = Se.segments.find((Re) => Re.reviewState === "unreviewed") || Se.segments[0] || null;
    re(null), F(-1), Y("Deleting rejected segments…"), ke === 0 && (P(Se, p.id), f(we ? [we.id] : []), I((we == null ? void 0 : we.id) ?? null), H.current = (we == null ? void 0 : we.id) ?? null, se.current = []);
    try {
      const Re = `rejected-dependency-delete:${p.id}:${ie.fingerprint}`, Ce = await Z(`/videos/${p.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(Re),
          fingerprint: ie.fingerprint
        })
      });
      Be(Re), await G(), Ce.deletedSegmentCount > 0 && t(Mt);
      const Oe = ke > 0 ? ` ${ke} feedback-protected rejected segment${ke === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      Y(`${Ce.deletedSegmentCount} segment${Ce.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Oe}`);
    } catch (Re) {
      ke === 0 && P((Ce) => li(
        Ce,
        X
      ), p.id), f(Pe == null ? [] : [Pe]), I(Pe), H.current = Pe, se.current = [], Y(Re.message || "Unable to delete rejected segments.");
    } finally {
      F(null);
    }
  }
  async function q(Q = o) {
    if (!(i || Q.length === 0)) {
      _(!0), le("");
      try {
        const X = await Z(`/videos/${p.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: Q.flatMap((xe) => xe.nativeSegmentId == null ? [] : [xe.nativeSegmentId]),
            itemIds: Q.flatMap((xe) => xe.published || xe.itemId == null ? [] : [xe.itemId])
          })
        });
        pe(!1), await G(), Y(`${X.assignedSegmentCount} segment${X.assignedSegmentCount === 1 ? "" : "s"} received ${X.assignedSlotCount} performer-slot assignment${X.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (X) {
        le(X.message || "Unable to auto-assign performers.");
      } finally {
        _(!1);
      }
    }
  }
  async function ve() {
    he(!0), oe(""), !h && (ue(!0), E());
  }
  function z() {
    w.current = !0, he(!1), requestAnimationFrame(() => {
      var Q;
      return (Q = x.current) == null ? void 0 : Q.focus({ preventScroll: !0 });
    });
  }
  async function ee() {
    if (!h || S || h.createCount + h.linkCount === 0)
      return;
    D(!0), oe("");
    let Q;
    try {
      const X = `materialize-derived:${p.id}:${h.fingerprint}`;
      Q = await Z(`/videos/${p.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(X),
          fingerprint: h.fingerprint,
          maxDepth: 3
        })
      }), Be(X);
    } catch (X) {
      X.status === 409 && V(null), oe(X.message || "Unable to materialize derived segments."), D(!1);
      return;
    }
    V((X) => X && { ...X, createCount: 0, linkCount: 0 });
    try {
      await G(), z(), V(null);
      const X = Q.createdCount + Q.linkedCount;
      Y(`${Q.createdCount} derived segment${Q.createdCount === 1 ? "" : "s"} created and ${Q.linkedCount} existing segment${Q.linkedCount === 1 ? "" : "s"} linked.`), X === 0 && Y("Every applicable derivation was already materialized.");
    } catch {
      oe("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    D(!1);
  }
  async function U(Q, X = null) {
    var be, ie, ke, Pe;
    const xe = {
      tagId: Q,
      ...X ? { tagName: X } : {}
    };
    if (M.length > 1) {
      const Se = M.filter((je) => je.tagId !== Q);
      if (Se.length === 0) {
        l();
        return;
      }
      const we = M.map((je) => ({
        id: je.id,
        itemId: je.itemId,
        nativeSegmentId: je.nativeSegmentId
      })), Re = M.map((je) => !d || je.nativeSegmentId != null ? `native:${je.nativeSegmentId}:${je.updatedAt}` : `item:${je.itemId}:${je.revision}`).sort().join(","), Ce = `bulk-tag:${p.id}:${Q}:${Re}`;
      F((k == null ? void 0 : k.id) ?? Se[0].id), Y(`Changing tag for ${Se.length} selected segment${Se.length === 1 ? "" : "s"}…`);
      const Oe = br(
        g,
        Se.map((je) => je.id),
        xe
      );
      P(Oe, p.id), l();
      try {
        const je = d ? null : crypto.randomUUID();
        await Z(`/videos/${p.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(Ce),
            tagId: Q,
            historyReceiptId: je,
            segments: M.map((We) => {
              const Qe = !d || We.nativeSegmentId != null;
              return {
                nativeSegmentId: Qe ? We.nativeSegmentId : null,
                itemId: Qe ? null : We.itemId,
                expectedUpdatedAt: Qe ? We.updatedAt : null,
                expectedRevision: Qe ? null : We.revision
              };
            })
          })
        }), Be(Ce);
        const _e = gt(
          M,
          d
        ), Ge = await G(), Ne = we.map((We) => ze(Ge == null ? void 0 : Ge.segments, We)).filter(Boolean);
        await N(
          "segments.tag",
          `Changed tag for ${Se.length} segment${Se.length === 1 ? "" : "s"}`,
          _e,
          gt(Ne, d),
          je
        );
        const qe = we.map((We) => ze(Ge == null ? void 0 : Ge.segments, We)).filter(Boolean);
        f(qe.map((We) => We.id)), I(((be = qe.find((We) => We.id === (k == null ? void 0 : k.id))) == null ? void 0 : be.id) ?? ((ie = qe[0]) == null ? void 0 : ie.id) ?? null), l(), Y(`${Se.length} selected segment${Se.length === 1 ? "" : "s"} retagged.`);
      } catch (je) {
        P((Ne) => Kn(
          Ne,
          Se,
          Object.keys(xe)
        ), p.id);
        const _e = we.map((Ne) => ze(g.segments, Ne)).filter(Boolean), Ge = ze(g.segments, {
          id: k == null ? void 0 : k.id,
          itemId: k == null ? void 0 : k.itemId,
          nativeSegmentId: k == null ? void 0 : k.nativeSegmentId
        }) || _e[0] || null;
        f(_e.map((Ne) => Ne.id)), I((Ge == null ? void 0 : Ge.id) ?? null), H.current = (Ge == null ? void 0 : Ge.id) ?? null, se.current = [], je.status === 409 && await $(), Y(je.message || "Unable to change the selected segment tags.");
      } finally {
        F(null);
      }
      return;
    }
    if (!(M.length !== 1 || !k)) {
      if (Q === k.tagId) {
        l();
        return;
      }
      if (k.id === c) {
        C.current = { segmentId: k.id, tagId: Q, tagName: X }, Y("Tag change queued…"), l();
        return;
      }
      if (k.itemId != null && ((Pe = (ke = y.data) == null ? void 0 : ke.children) == null ? void 0 : Pe.length) > 0) {
        F(k.id), Y("Checking lineage impact…");
        try {
          const Se = await Z(`/items/${k.itemId}/tag-change/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedRevision: k.revision, tagId: Q })
          }), we = Se.deletedItemIds.length > 0 || Se.removedEdgeIds.length > 0;
          if (we && !window.confirm(
            `Changing this tag removes ${Se.removedEdgeIds.length} lineage edge${Se.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${Se.deletedItemIds.length} derived segment${Se.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
          )) {
            Y("Tag change canceled.");
            return;
          }
          const Re = br(
            g,
            [k.id],
            xe
          );
          P(Re, p.id), l();
          const Ce = `tag-change:${k.itemId}:${k.revision}:${Se.componentFingerprint}:${Q}`;
          await Z(`/items/${k.itemId}/tag-change/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(Ce),
              expectedRevision: k.revision,
              componentFingerprint: Se.componentFingerprint,
              tagId: Q
            })
          }), Be(Ce), await G(), l(), Y(we ? "Tag changed and lineage reconciled." : "Tag changed.");
        } catch (Se) {
          P((we) => Kn(
            we,
            [k],
            Object.keys(xe)
          ), p.id), f([k.id]), I(k.id), H.current = k.id, se.current = [], Se.status === 409 ? (Y("Lineage changed — loading the latest segments…"), await $()) : Y(Se.message || "Unable to reconcile the lineage.");
        } finally {
          F(null);
        }
        return;
      }
      l(), await O(k, {
        startSec: k.startSec,
        endSec: k.endSec,
        tagId: Q
      }, !0, null, !0, xe);
    }
  }
  async function fe() {
    var Pe, Se, we, Re;
    if (!s || !k || ae != null) return;
    const Q = [...M].sort((Ce, Oe) => Number(Ce.nativeSegmentId ?? Ce.id) - Number(Oe.nativeSegmentId ?? Oe.id)), X = new Set(Q.map((Ce) => Ce.id)), xe = Q.map((Ce) => `${Ce.nativeSegmentId ?? Ce.id}:${Ce.updatedAt}`).join("|");
    F(k.id), Y(`Moving ${Q.length} segment${Q.length === 1 ? "" : "s"} to recycling bin…`);
    const be = `bulk-move:${p.id}:${xe}`, ie = Fe(be), ke = d ? null : crypto.randomUUID();
    try {
      const Ce = (Ne = !1) => Z(`/videos/${p.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ie,
          segments: Q.map((qe) => ({
            segmentId: qe.nativeSegmentId ?? qe.id,
            expectedUpdatedAt: qe.updatedAt
          })),
          discardMissingImage: Ne,
          ...d ? { reviewState: "rejected" } : {},
          historyReceiptId: ke
        })
      });
      let Oe;
      try {
        Oe = await Ce(
          oo(be)
        );
      } catch (Ne) {
        if (((Pe = Ne.payload) == null ? void 0 : Pe.code) !== "missing-image" || !window.confirm(`${Ne.message}

Continue and discard the missing image reference?`)) throw Ne;
        ao(be), Oe = await Ce(!0);
      }
      Be(be), Fn();
      const je = new Map((Oe.items || []).map((Ne) => [
        Number(Ne.segmentId),
        Ne
      ]));
      await N(
        "segments.moveToBin",
        `Moved ${Q.length} segment${Q.length === 1 ? "" : "s"} to recycling bin`,
        gt(Q, !1),
        gt(Q.map((Ne) => {
          const qe = je.get(
            Number(Ne.nativeSegmentId ?? Ne.id)
          );
          return {
            ...Ne,
            recycleBinItemId: (qe == null ? void 0 : qe.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (qe == null ? void 0 : qe.revision) ?? null
          };
        }), !1),
        ke
      );
      const _e = W.filter((Ne) => !X.has(Ne.id)), Ge = Rs(r, X, k.id);
      P({ ...g, segments: _e }, p.id), f(Ge ? [Ge.id] : []), I((Ge == null ? void 0 : Ge.id) ?? null), H.current = (Ge == null ? void 0 : Ge.id) ?? null, se.current = [], Ge && (Me(St(r, Ge.id)), K(Ge.id)), requestAnimationFrame(() => {
        var Ne;
        return (Ne = u.current) == null ? void 0 : Ne.focus({ preventScroll: !0 });
      }), Y(`Moved ${Q.length} segment${Q.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Ce) {
      const Oe = ((Se = Ce.payload) == null ? void 0 : Se.code) || ((Re = (we = Ce.payload) == null ? void 0 : we.result) == null ? void 0 : Re.code);
      Ce.status === 409 && Oe === "CANONICAL_SEGMENT_CHANGED" ? await $() : Y(Ce.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      F(null);
    }
  }
  async function Ee() {
    if (!(d || a.current || ae != null)) {
      a.current = !0, Y("Checking the recycling bin…");
      try {
        const Q = await Z("/bin"), X = await Za(Q, () => Y("Emptying the recycling bin…"));
        if (X.status === "empty") {
          Y("The recycling bin is empty.");
          return;
        }
        if (X.status === "canceled") {
          Y("The recycling bin was not emptied.");
          return;
        }
        Y(`${X.segmentCount} segment${X.segmentCount === 1 ? "" : "s"} from ${X.sceneCount} scene${X.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (Q) {
        Y(Q.message || "Unable to empty the recycling bin.");
      } finally {
        a.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: v, removeIncorrectExample: A, captureTrainingExport: te, deleteRejectedSegments: J, autoAssignPerformers: q, previewDerivedSegments: ve, closeMaterializeDialog: z, materializeDerivedSegments: ee, saveTag: U, moveToBin: fe, emptyRecyclingBin: Ee };
}
function qd(e) {
  const { acceptHistory: t, commonActionsRef: r, compatibilityMode: o, currentTime: i, detail: a, editorLayout: s, focusRowRef: l, history: d, historyRef: c, historySaving: g, horizontalLayoutSize: u, mediaStackHeight: b, mediaStackRef: m, onDetailChange: y, onReload: x, railToggleRef: h, recordHistoryAction: w, savingSegmentId: S, savingShot: O, savingShotRef: $, setCollapsedSegmentGroups: P, setEditorLayout: G, setHistorySaving: C, setIncorrectExamples: N, setSaveMessage: E, setSavingSegmentId: R, setSavingShot: K, shotBoundaries: ae, timelineDuration: W, video: k, workspaceRef: T } = e;
  async function M(I, f, p) {
    var J, q, ve, z;
    const v = I.type === "segment" ? [I] : I.segments || [], A = (f == null ? void 0 : f.type) === "segment" ? [f] : (f == null ? void 0 : f.segments) || [];
    let te = p;
    for (const [ee, U] of v.entries()) {
      const fe = A[ee], Ee = ((J = U.identity) == null ? void 0 : J.nativeSegmentId) != null || ((q = U.identity) == null ? void 0 : q.published) === !0, Q = ((ve = fe == null ? void 0 : fe.identity) == null ? void 0 : ve.recycleBinItemId) ?? ((z = fe == null ? void 0 : fe.identity) == null ? void 0 : z.itemId);
      let X = ze(te.segments, fe == null ? void 0 : fe.identity) || ze(te.segments, U.identity);
      if (!X && Ee && Q != null && fe.identity.revision != null) {
        const ie = `history-restore:${k.id}:${Q}:${fe.identity.revision}`;
        await Z(`/bin/${Q}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(ie),
            expectedRevision: fe.identity.revision
          })
        }), Be(ie), te = await x(), X = te.segments.find((ke) => ke.tagId === U.values.tagId && ke.startSec === U.values.startSec && ke.endSec === U.values.endSec);
      }
      if (!X)
        throw new Error("A segment in this history state no longer exists.");
      if ((X.nativeSegmentId != null || X.published === !0) !== Ee) {
        if (Ee) {
          const ie = X.recycleBinItemId ?? X.itemId ?? Q;
          if (ie == null)
            throw new Error("This recycled segment can no longer be restored.");
          const ke = `history-restore:${k.id}:${ie}:${X.revision}:${U.values.reviewState ?? "native"}`;
          await Z(`/bin/${ie}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(ke),
              expectedRevision: X.revision
            })
          }), Be(ke);
        } else {
          const ie = `history-bin:${k.id}:${X.nativeSegmentId}:${X.updatedAt}:${U.values.reviewState}`;
          await Z(`/videos/${k.id}/segments/${X.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(ie),
              expectedUpdatedAt: X.updatedAt,
              reviewState: U.values.reviewState
            })
          }), Be(ie);
        }
        if (te = await x(), !Ee)
          continue;
        if (X = ze(te.segments, U.identity) || te.segments.find((ie) => ie.tagId === U.values.tagId && ie.startSec === U.values.startSec && ie.endSec === U.values.endSec), !X)
          throw new Error("The restored segment could not be found.");
      }
      const be = U.values;
      if (X.nativeSegmentId == null && X.itemId != null) {
        const ie = `history-draft-update:${k.id}:${X.itemId}:${X.revision}:${be.tagId}:${be.startSec}:${be.endSec ?? "open"}:${be.reviewState}`;
        await Z(`/videos/${k.id}/drafts/${X.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(ie),
            expectedRevision: X.revision,
            ...be
          })
        }), Be(ie);
      } else
        await Z(`/videos/${k.id}/segments/${X.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...be, expectedUpdatedAt: X.updatedAt })
        });
      te = await x();
    }
    return te;
  }
  async function H(I, f) {
    var p;
    for (const v of I.targets || []) {
      const A = ze(f.segments, v.identity);
      if (!A)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const te = (p = f.performerSlotRevisions) == null ? void 0 : p[A.id];
      await Z(A.published ? `/videos/${k.id}/segments/${A.nativeSegmentId}/slots` : `/videos/${k.id}/drafts/${A.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: te,
          assignments: v.assignments
        })
      }), f = await x();
    }
    return f;
  }
  async function se(I, f, p) {
    if (!o)
      throw new Error("AI feedback history is only available in Full mode.");
    let v = f, A = await Z(`/videos/${k.id}/incorrect-examples`);
    const te = (J) => A.find((q) => {
      var ve;
      return q.id === J.exampleId || ((ve = J.collectedIdentity) == null ? void 0 : ve.itemId) != null && q.itemId === J.collectedIdentity.itemId;
    });
    for (const [J, q] of (I.entries || []).entries()) {
      const ve = `history-feedback:${k.id}:${p.action.sequence}:${p.direction}:${J}`, z = te(q);
      if (I.collected && z) {
        Be(ve);
        continue;
      }
      let ee;
      if (I.collected) {
        const U = ze(
          v.segments,
          q.collectedIdentity
        ) || ze(
          v.segments,
          q.originalIdentity
        );
        if (!U)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const fe = U.nativeSegmentId != null;
        ee = await Z(`/videos/${k.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(ve),
            nativeSegmentId: fe ? U.nativeSegmentId : null,
            itemId: fe ? null : U.itemId,
            expectedUpdatedAt: fe ? U.updatedAt : null,
            expectedRevision: fe ? null : U.revision
          })
        });
      } else {
        if (!z) {
          Be(ve);
          continue;
        }
        ee = await Z(
          `/videos/${k.id}/incorrect-examples/${z.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(ve),
              expectedExampleRevision: z.revision,
              expectedRepresentationRevision: z.representationRevision
            })
          }
        );
      }
      Be(ve), v = Jr(
        v,
        ee.editorDelta
      ), A = await Z(
        `/videos/${k.id}/incorrect-examples`
      );
    }
    return N(A), v;
  }
  async function le(I, f, p = []) {
    const v = I.state;
    if (!o && ((v == null ? void 0 : v.type) === "segment" || (v == null ? void 0 : v.type) === "segments")) {
      const te = `basic-history:${k.id}:${c.current.revision}:${I.action.sequence}:${I.direction}`, J = await Z(`/videos/${k.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(te),
          expectedHistoryRevision: c.current.revision,
          actionSequence: I.action.sequence,
          direction: I.direction
        })
      });
      return t(J.history), p.push(te), x();
    }
    const A = I.direction === "backward" ? I.action.afterState : I.action.beforeState;
    if ((v == null ? void 0 : v.type) === "composite") {
      let te = f;
      const J = (A == null ? void 0 : A.type) === "composite" ? A.states || [] : [];
      for (const [q, ve] of (v.states || []).entries()) {
        const z = J[q];
        te = await le({
          ...I,
          state: ve,
          action: {
            ...I.action,
            beforeState: I.direction === "backward" ? ve : z,
            afterState: I.direction === "backward" ? z : ve
          }
        }, te, p);
      }
      return te;
    }
    if ((v == null ? void 0 : v.type) === "segment" || (v == null ? void 0 : v.type) === "segments")
      return M(
        v,
        A,
        f
      );
    if ((v == null ? void 0 : v.type) === "performerSlots")
      return H(v, f);
    if ((v == null ? void 0 : v.type) === "incorrectExamples")
      return se(v, f, I);
    if ((v == null ? void 0 : v.type) === "shots") {
      const te = Ln(f.shotBoundaries || []), J = await Z(`/videos/${k.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(`history-shots:${k.id}:${te}:${v.fingerprint}`),
          expectedFingerprint: te,
          boundaries: v.boundaries
        })
      });
      return { ...f, shotBoundaries: J };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function pe(I) {
    var p;
    if (g || S != null || O || I === d.cursorSequence)
      return;
    const f = Ml(d, I);
    if (f.length !== 0) {
      C(!0), R(-1), E(`Restoring ${f.length} history ${f.length === 1 ? "action" : "actions"}…`);
      try {
        let v = a;
        const A = [];
        for (const J of f)
          v = await le(
            J,
            v,
            A
          );
        const te = o ? await Z(`/videos/${k.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: c.current.revision,
            targetSequence: I
          })
        }) : c.current;
        A.forEach(Be), t(te), await x(), E("History restored.");
      } catch (v) {
        v.status === 409 && ((p = v.payload) != null && p.current) && t(v.payload.current), await x(), E(v.message || "Unable to restore editor history.");
      } finally {
        R(null), C(!1);
      }
    }
  }
  function _(I) {
    G((f) => ({ ...f, timelineRatio: no(I, b) }));
  }
  function ne(I) {
    var v, A;
    const f = (v = m.current) == null ? void 0 : v.getBoundingClientRect();
    if (!f) return;
    const p = ((A = r.current) == null ? void 0 : A.offsetHeight) || 0;
    _(fs(
      I.clientY,
      f.top + p,
      Math.max(0, f.height - p)
    ));
  }
  function ce(I) {
    I.currentTarget.setPointerCapture(I.pointerId), ne(I);
  }
  function oe(I) {
    I.currentTarget.hasPointerCapture(I.pointerId) && ne(I);
  }
  function ue(I) {
    const f = I.shiftKey ? 0.1 : 0.05;
    let p = null;
    I.key === "ArrowUp" && (p = s.timelineRatio + f), I.key === "ArrowDown" && (p = s.timelineRatio - f);
    const v = to(b);
    I.key === "Home" && (p = v.minimum), I.key === "End" && (p = v.maximum), p != null && (I.preventDefault(), I.stopPropagation(), _(p));
  }
  function he(I) {
    const f = I === "detailWidth" ? u.focusRow : u.workspace, p = u.workspace > 0 ? zr(u.workspace, 600) : 560, v = Ht(s.markerRailWidth, p), A = I === "detailWidth" ? 344 + (s.markerRailOpen ? v + 24 : 0) : 600;
    return f > 0 ? zr(f, A) : 560;
  }
  function V(I, f) {
    G((p) => ({ ...p, [I]: Ht(f, he(I)) }));
  }
  function D(I, f) {
    var v, A;
    const p = f === "detailWidth" ? (v = l.current) == null ? void 0 : v.getBoundingClientRect() : (A = T.current) == null ? void 0 : A.getBoundingClientRect();
    p && V(f, f === "detailWidth" ? I.clientX - p.left : p.right - I.clientX);
  }
  function re(I, f) {
    const p = he(I), v = Ht(s[I], p);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": f,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(p),
      "aria-valuenow": Math.round(v),
      "aria-valuetext": `${Math.round(v)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (A) => {
        A.currentTarget.setPointerCapture(A.pointerId), D(A, I);
      },
      onPointerMove: (A) => {
        A.currentTarget.hasPointerCapture(A.pointerId) && D(A, I);
      },
      onKeyDown: (A) => {
        const te = A.shiftKey ? 40 : 16;
        let J = null;
        A.key === "ArrowLeft" && (J = I === "detailWidth" ? -te : te), A.key === "ArrowRight" && (J = I === "detailWidth" ? te : -te);
        let q = J == null ? null : v + J;
        A.key === "Home" && (q = 240), A.key === "End" && (q = p), q != null && (A.preventDefault(), A.stopPropagation(), V(I, q));
      },
      onDoubleClick: () => V(I, lt[I]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function Ie() {
    G((I) => ({ ...I, markerRailOpen: !I.markerRailOpen })), requestAnimationFrame(() => {
      var I;
      return (I = h.current) == null ? void 0 : I.focus({ preventScroll: !0 });
    });
  }
  function Y(I) {
    P((f) => f.includes(I) ? f.filter((p) => p !== I) : Bt([...f, I]));
  }
  async function F(I, f = !0, p = i) {
    var J;
    if ($.current) return null;
    const v = Number((J = k.videoFile) == null ? void 0 : J.duration) || W, A = Ln(ae), te = `shot-${I}:${k.id}:${p.toFixed(3)}:${v.toFixed(3)}:${A}`;
    $.current = !0, K(!0), E(I === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const q = await Z(`/videos/${k.id}/shot-boundaries/${I}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(I === "split" ? { operationId: Fe(te), timeSec: p } : { operationId: Fe(te), timeSec: p })
      });
      return Be(te), y((ve) => ({ ...ve, shotBoundaries: q }), k.id), f && await w(
        "shots.update",
        I === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: ae,
          fingerprint: A
        },
        {
          type: "shots",
          boundaries: q,
          fingerprint: Ln(q)
        }
      ), E(I === "split" ? "Shot boundary added." : "Shots merged."), q;
    } catch (q) {
      return E(q.message || "Unable to edit shot boundaries."), null;
    } finally {
      $.current = !1, K(!1);
    }
  }
  async function Me(I) {
    if ($.current) return null;
    const f = `shot-restore:${k.id}:${I.afterFingerprint}`;
    $.current = !0, K(!0), E("Undoing shot edit…");
    try {
      const p = await Z(`/videos/${k.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(f),
          expectedFingerprint: I.afterFingerprint,
          boundaries: I.before
        })
      });
      return Be(f), y((v) => ({ ...v, shotBoundaries: p }), k.id), p;
    } catch (p) {
      return E(p.message || "Unable to undo the shot edit."), null;
    } finally {
      $.current = !1, K(!1);
    }
  }
  return { applySegmentHistoryState: M, applyPerformerSlotHistoryState: H, applyHistoryState: le, restoreHistoryTarget: pe, updateTimelineRatio: _, updateTimelineRatioFromPointer: ne, handleSeparatorPointerDown: ce, handleSeparatorPointerMove: oe, handleSeparatorKeyDown: ue, panelWidthMaximum: he, updatePanelWidth: V, handlePanelSeparatorPointer: D, panelSeparatorProps: re, toggleSegmentRail: Ie, toggleSegmentGroup: Y, mutateShotBoundary: F, restoreShotBoundaries: Me };
}
function Wd(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: u, lineage: b, mediaDuration: m, mergeSelectedSwimlane: y, moveToBin: x, mutateShotBoundary: h, openPublishApprovedDialog: w, playbackControlsRef: S, playbackShortcutConfig: O, saveSelectedReviewState: $, seekRef: P, segmentGroupKeys: G, selectSegment: C, selectedSegment: N, selectedSegmentGroupForSegment: E, selectedSegmentGroupKey: R, selectedSegments: K, setCollapsedSegmentGroups: ae, setIncorrectExamplesOpen: W, setQuickSearchOpen: k, setSaveMessage: T, setSelectedSegmentGroupKey: M, setTagEditing: H, setTimelineZoom: se, shotBoundaries: le, slotButtonRef: pe, splitSegment: _, swimlanes: ne, timelineDuration: ce, toggleIncorrectExample: oe, toggleSegmentGroup: ue, updateTimelineRatio: he, videoFrameRate: V, visibleSegments: D } = e;
  function re(F) {
    var Me, I;
    (Me = S.current) == null || Me.pause(), (I = S.current) == null || I.seekBy(Zs(F, V));
  }
  function Ie(F, Me) {
    if (K.length > 1 && Fs(F.id))
      return;
    let I = null;
    F.id === "video.playPause" && (I = () => {
      var f;
      return (f = S.current) == null ? void 0 : f.toggle();
    }), F.id === "video.seekSmallBackward" && (I = () => {
      var f;
      return (f = S.current) == null ? void 0 : f.seekBy(-O.smallSeekTime);
    }), F.id === "video.seekSmallForward" && (I = () => {
      var f;
      return (f = S.current) == null ? void 0 : f.seekBy(O.smallSeekTime);
    }), F.id === "video.seekMediumBackward" && (I = () => {
      var f;
      return (f = S.current) == null ? void 0 : f.seekBy(-O.mediumSeekTime);
    }), F.id === "video.seekMediumForward" && (I = () => {
      var f;
      return (f = S.current) == null ? void 0 : f.seekBy(O.mediumSeekTime);
    }), F.id === "video.seekLongBackward" && (I = () => {
      var f;
      return (f = S.current) == null ? void 0 : f.seekBy(-O.longSeekTime);
    }), F.id === "video.seekLongForward" && (I = () => {
      var f;
      return (f = S.current) == null ? void 0 : f.seekBy(O.longSeekTime);
    }), F.id === "video.playSelected" && N && (I = () => {
      var f;
      (f = P.current) == null || f.call(P, N.startSec, !0), requestAnimationFrame(() => {
        var p;
        return (p = g.current) == null ? void 0 : p.focus({ preventScroll: !0 });
      });
    }), (F.id === "video.playPreviousSegment" || F.id === "video.playNextSegment") && (I = () => {
      var p;
      const f = Vr(
        ne,
        N == null ? void 0 : N.id,
        F.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !f || f.id === (N == null ? void 0 : N.id) || (C(f, { focusEditor: !0, seekToSegment: !1 }), (p = P.current) == null || p.call(P, f.startSec, !0));
    }), F.id.startsWith("video.seekPercent") && (I = () => {
      var p;
      const f = Number(F.id.slice(17)) / 10;
      (p = P.current) == null || p.call(P, Es(m ?? ce, f), !1);
    }), F.id === "video.jumpToSegmentStart" && N && (I = () => {
      var f;
      return (f = P.current) == null ? void 0 : f.call(P, N.startSec, !1);
    }), F.id === "video.jumpToSegmentEnd" && N && (I = () => {
      var f;
      return (f = P.current) == null ? void 0 : f.call(P, N.endSec ?? N.startSec, !1);
    }), F.id === "video.jumpToVideoStart" && (I = () => {
      var f;
      return (f = P.current) == null ? void 0 : f.call(P, 0, !1);
    }), F.id === "video.jumpToVideoEnd" && (I = () => {
      var f;
      return (f = P.current) == null ? void 0 : f.call(P, ce, !1);
    }), F.id.startsWith("video.frame") && (I = () => {
      const f = F.id.includes("Small") ? "small" : F.id.includes("Medium") ? "medium" : "long", p = O[`${f}FrameStep`] * (F.id.endsWith("Backward") ? -1 : 1);
      re(p);
    }), F.id.startsWith("navigation.swimlane") && (I = () => {
      const f = F.id.slice(19).toLowerCase(), p = Vr(ne, N == null ? void 0 : N.id, f, s);
      p && C(p, { focusEditor: !0, seekToSegment: !1 });
    }), (F.id === "navigation.extendSwimlaneLeft" || F.id === "navigation.extendSwimlaneRight") && (I = () => {
      const f = Wl(
        t,
        N == null ? void 0 : N.id,
        F.id.endsWith("Left") ? "left" : "right"
      );
      f && C(f.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: f.segmentIds
      });
    }), (F.id === "navigation.segmentGroupUp" || F.id === "navigation.segmentGroupDown") && (I = () => {
      const f = Vl(
        G,
        R ?? E,
        F.id.endsWith("Up") ? -1 : 1
      );
      f && M(f);
    }), (F.id === "navigation.previousAtPlayhead" || F.id === "navigation.nextAtPlayhead") && (I = () => {
      const f = ys(D, s, F.id === "navigation.previousAtPlayhead" ? -1 : 1, N == null ? void 0 : N.id);
      f && C(f, { focusEditor: !0, seekToSegment: !1 });
    }), F.id === "navigation.nearestInCurrentSwimlane" && (I = () => {
      const f = as(
        ne,
        N == null ? void 0 : N.id,
        s
      );
      f && C(f, { focusEditor: !0, seekToSegment: !1 });
    }), F.id.includes("Unreviewed") && (I = () => {
      const f = mr(
        ne,
        N == null ? void 0 : N.id,
        F.id.startsWith("navigation.previous") ? -1 : 1,
        F.id.endsWith("Global")
      );
      f && C(f, { focusEditor: !Me.preserveFocus, seekToSegment: !1 });
    }), (F.id === "navigation.nextTouchingPlayhead" || F.id === "navigation.previousTouchingPlayhead") && (I = () => {
      const f = os(ne, s, F.id === "navigation.previousTouchingPlayhead" ? -1 : 1, N == null ? void 0 : N.id);
      f && C(f, { focusEditor: !0, seekToSegment: !1 });
    }), F.id === "navigation.quickSearch" && (I = () => k(!0)), (F.id === "navigation.previousShot" || F.id === "navigation.nextShot") && (I = () => {
      var p;
      const f = Qs(le, s, F.id === "navigation.previousShot" ? -1 : 1);
      f && ((p = P.current) == null || p.call(P, f.startSec, !1));
    }), F.id === "shot.split" && (I = () => h("split")), F.id === "shot.merge" && (I = () => h("merge")), F.id === "marker.create" && (I = () => a()), F.id === "marker.duplicate" && (I = () => d(!1)), F.id === "marker.duplicateAtPlayhead" && (I = () => d(!0)), F.id === "marker.split" && (I = () => _()), F.id === "marker.editTag" && (I = () => {
      var f;
      if (K.length > 1 && K.some((p) => p.isDerived)) {
        T("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((f = b.data) != null && f.tagReadOnly) {
        T("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      H(!0);
    }), F.id === "marker.setStart" && N && (I = () => r(s, N.endSec)), F.id === "marker.setEnd" && N && (I = () => r(N.startSec, s)), F.id === "marker.copyTiming" && N && (I = () => {
      T(md(N) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), F.id === "marker.pasteTiming" && N && (I = () => {
      const f = ud();
      if (!f) {
        T("No copied segment timing is available.");
        return;
      }
      r(f.startSec, f.endSec);
    }), F.id === "marker.mergeSelection" && (I = () => y()), F.id === "marker.moveToBin" && (I = () => x()), F.id === "marker.toggleIncorrectExample" && N && (I = () => oe()), F.id === "marker.openIncorrectExamples" && (I = () => W(!0)), F.id === "markerGroup.toggleCollapse" && R && (I = () => ue(R)), F.id === "markerGroup.toggleAll" && (I = () => ae((f) => ql(f, G))), F.id === "marker.assignSlots" && (I = () => {
      var f;
      return (f = pe.current) == null ? void 0 : f.click();
    }), F.id === "navigation.zoomIn" && (I = () => se((f) => gr(f + 0.5))), F.id === "navigation.zoomOut" && (I = () => se((f) => gr(f - 0.5))), F.id === "navigation.resetZoom" && (I = () => se(1)), F.id === "navigation.centerPlayhead" && (I = () => {
      var f;
      return (f = o.current) == null ? void 0 : f.call(o);
    }), F.id === "layout.growSwimlanes" && (I = () => he(c.timelineRatio + 0.05)), F.id === "layout.shrinkSwimlanes" && (I = () => he(c.timelineRatio - 0.05)), F.id === "marker.confirm" && N && (I = () => $("approved")), F.id === "system.publishApproved" && (I = () => w(Me.target)), F.id === "marker.reject" && N && (I = () => $("rejected")), F.id === "system.emptyBin" && (I = () => u()), F.id === "system.deleteRejected" && (I = () => l()), I && I();
  }
  function Y(F, Me) {
    const I = zn.find((f) => f.id === F);
    I && mn(I, i) && Ie(I, Me);
  }
  return {
    executeShortcutById: Y,
    stepVideoFrame: (F) => re(F < 0 ? -1 : 1)
  };
}
function ua(e) {
  return e === !0;
}
function ma() {
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
function Vd(e, t, r = !1, o = 0, i = "") {
  const [a, s] = L(null), [l, d] = L(null), [c, g] = L(""), [u, b] = L({
    busy: !1,
    reviewState: null,
    error: ""
  }), m = ge(null);
  async function y(w) {
    b({ busy: !0, reviewState: w, error: "" });
    try {
      await Z(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Wr(), reviewState: w })
      }), await t(), b({ busy: !1, reviewState: null, error: "" });
    } catch (S) {
      b({
        busy: !1,
        reviewState: null,
        error: S.message || "Unable to import Cove segments."
      });
    }
  }
  async function x(w) {
    try {
      const S = await Z(`/videos/${e}/analysis-runs`, {
        signal: w.signal
      });
      if (!w.isActive()) return null;
      const O = (S == null ? void 0 : S[0]) || null;
      return s(O), (O == null ? void 0 : O.status) === "completed" && m.current !== O.id && (m.current = O.id, await t()), ((O == null ? void 0 : O.status) === "failed" || (O == null ? void 0 : O.status) === "cancelled") && g(O.errorMessage || "Video analysis did not complete."), O;
    } catch (S) {
      return w.isActive() && S.name !== "AbortError" && g(S.message || "Unable to load video analysis status."), null;
    }
  }
  async function h(w = null) {
    g("");
    const S = w || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), O = S.includes("omnishotcut") && o > 0;
    if (!(O && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const $ = await Z(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: S,
            replaceShotBoundaries: O,
            expectedShotBoundaryFingerprint: O ? i : null
          })
        });
        s($);
      } catch ($) {
        g($.message || "Unable to start video analysis.");
      }
  }
  return ye(() => {
    if (!ua(r)) {
      s(null), d(null), g("");
      return;
    }
    const w = ma();
    return x(w), Z("/analysis/status", { signal: w.signal }).then((S) => {
      w.isActive() && (d(S), S.configured || g(""));
    }).catch((S) => {
      w.isActive() && S.name !== "AbortError" && g(S.message || "Unable to check video analysis readiness.");
    }), w.dispose;
  }, [e, r]), ye(() => {
    if (!ua(r) || (a == null ? void 0 : a.status) !== "queued" && (a == null ? void 0 : a.status) !== "running") return;
    const w = ma();
    let S = setTimeout(async function O() {
      await x(w), w.isActive() && (S = setTimeout(O, 2500));
    }, 2500);
    return () => {
      clearTimeout(S), w.dispose();
    };
  }, [a == null ? void 0 : a.id, a == null ? void 0 : a.status, r]), {
    analysisError: c,
    analysisRun: a,
    analysisStatus: l,
    importNativeSegments: y,
    nativeImportState: u,
    startFullAnalysis: h
  };
}
const Pn = Object.freeze([]);
function Jd(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Yd({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var Ao, Ro, Mo, Eo, Do;
  const [g, u] = L(null), [b, m] = L([]), y = ge(null), x = ge(null), h = ge([]), w = ge(null), [S, O] = L(() => pt({})), [$, P] = L(!1), [G, C] = L(Os), [N, E] = L(0), [R, K] = L(null), [ae, W] = L(!1), [k, T] = L(""), [M, H] = L(""), [se, le] = L(""), [pe, _] = L(1), [ne, ce] = L(sd), [oe, ue] = L(0), [he, V] = L({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [D, re] = L(Mt), Ie = ge(Mt), [Y, F] = L(!1), [Me, I] = L(!1), [f, p] = L(!1), v = ge(!1);
  v.current = f;
  const [A, te] = L(null), J = ge(null), [q, ve] = L(!1), z = ge(!1), [ee, U] = L(null), [fe, Ee] = L(null), Q = ge(null), [X, xe] = L(!1), [be, ie] = L(""), ke = ge(null), Pe = ge(null), Se = ge(!1), we = ge([]), Re = ge(!1), [Ce, Oe] = L(ld), [je, _e] = L(null), [Ge, Ne] = L(!1), [qe, We] = L(!1), [Qe, Te] = L(!1), [$e, Ke] = L(!1), [st, et] = L(!1), [Dt, nt] = L(""), {
    analysisError: Ot,
    analysisRun: Jt,
    analysisStatus: pn,
    importNativeSegments: kr,
    nativeImportState: Hn,
    startFullAnalysis: fn
  } = Vd(
    e.video.id,
    o,
    l,
    ((Ao = e.shotBoundaries) == null ? void 0 : Ao.length) || 0,
    Ln(e.shotBoundaries || [])
  ), [Gt, qn] = L(!1), [Wn, Yt] = L(null), [ct, Nt] = L(l), [Vn, wr] = L(0), [ft, Nr] = L(!1), [Pt, yn] = L(""), [Ir, Cr] = L(null), yt = ge(null), Qt = ge(null), Zt = ge(!1), [bt, Xt] = L([]), [Jn, Yn] = L(!1), [bn, $r] = L(null), hn = ad(), vn = ge(null), Qn = ge(null), en = ge(null), Zn = ge(s), xn = ge(null), tn = ge(null), Ut = ge(null), Sn = ge(null), kn = ge(null), ut = ge(null), wn = ge(null), Nn = ge(null), In = ge(null), Xn = ge(null), Cn = ge(null), $n = ge(null), Tr = ge(-1e12), Tt = ge(null), Ar = ge(!1), nn = ge(null), [rn, Tn] = L({ scrollTop: 0, height: 512 });
  ye(() => {
    if (!Gt || ft || !Pt) return;
    const B = requestAnimationFrame(() => {
      var me;
      return (me = Qt.current) == null ? void 0 : me.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(B);
  }, [Gt, ft, Pt]), ye(() => {
    if (!Zt.current || Gt || ct) return;
    const B = requestAnimationFrame(() => {
      var me;
      (me = yt.current) == null || me.focus({ preventScroll: !0 }), Zt.current = !1;
    });
    return () => cancelAnimationFrame(B);
  }, [Gt, ct]);
  const He = e.video, Ze = e.segments || Pn, er = Ue(() => JSON.stringify({
    segments: Ze.map((B) => [
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
    performerSlots: (e.performerSlots || Pn).map((B) => [
      B.segmentId,
      B.slotDefinitionId,
      B.performerId,
      B.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [Ze, e.performerSlots, e.itemMetadata]);
  ye(() => {
    if (!l) {
      Yt(null), Nt(!1);
      return;
    }
    if (R != null) {
      Nt(!0);
      return;
    }
    let B = !0;
    Nt(!0);
    const me = setTimeout(() => {
      Z(`/videos/${He.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((De) => {
        B && (Yt(De), yn(""));
      }).catch((De) => {
        B && (Yt(null), yn(De.message || "Unable to preview derived segments."));
      }).finally(() => {
        B && Nt(!1);
      });
    }, 150);
    return () => {
      B = !1, clearTimeout(me);
    };
  }, [l, He.id, er, Vn, R]);
  const Rr = () => wr((B) => B + 1), ht = e.segmentGroups || Pn, vt = e.performerSlots || Pn, Mr = l && e.performerSlotsAvailable !== !1, Ve = Ue(
    () => (e.performerCandidates || []).filter((B) => B.isVideoPerformer),
    [e.performerCandidates]
  ), on = e.shotBoundaries || Pn, An = Ue(
    () => ri(vt),
    [vt]
  ), tr = Ue(
    () => Ze.map((B) => {
      const me = An.get(B.id) || [];
      return {
        ...B,
        slots: me,
        assignment: me.every((De) => De.performerId == null) ? cl(me, Ve) : null
      };
    }).filter((B) => B.slots.length > 0 && B.assignment != null),
    [Ze, An, Ve]
  ), nr = Number((Ro = He.videoFile) == null ? void 0 : Ro.frameRate) > 0 ? Number(He.videoFile.frameRate) : 30;
  function Lt() {
    p(!1), requestAnimationFrame(() => {
      var B;
      return (B = ut.current) == null ? void 0 : B.focus({ preventScroll: !0 });
    });
  }
  function Er() {
    R == null && ($n.current = null, ve(!1), T(""), requestAnimationFrame(() => {
      var B;
      return (B = ut.current) == null ? void 0 : B.focus({ preventScroll: !0 });
    }));
  }
  function rr() {
    P(!1), requestAnimationFrame(() => {
      var B, me;
      (B = Nn.current) != null && B.isConnected ? Nn.current.focus({ preventScroll: !0 }) : (me = ut.current) == null || me.focus({ preventScroll: !0 });
    });
  }
  ye(() => {
    Cn.current === g ? (Cn.current = null, p(!0)) : p(!1);
  }, [g]), ye(() => {
    var me;
    if (!f) return;
    const B = (me = Xn.current) == null ? void 0 : me.querySelector("input");
    document.activeElement !== B && (B == null || B.focus({ preventScroll: !0 }), B == null || B.select());
  }, [f, g]), ye(() => {
    var De, Je, xt;
    const B = qt(
      Lr(
        e.segments,
        e.performerSlots || [],
        pt({}),
        l && G,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), me = ((De = e.segments.find((dn) => dn.id === s)) == null ? void 0 : De.id) ?? ((Je = Oa(B)) == null ? void 0 : Je.id) ?? null;
    u(me), m(me == null ? [] : [me]), x.current = me, h.current = [], _e(St(B, me)), O(pt({})), P(!1), $n.current = null, ve(!1), _(1), T(""), re(Mt), Ie.current = Mt, F(!1), (xt = ut.current) == null || xt.focus({ preventScroll: !0 });
  }, [He.id, s]), ye(() => {
    const B = new AbortController();
    return Z(`/videos/${He.id}/incorrect-examples`, { signal: B.signal }).then(Xt).catch((me) => {
      me.name !== "AbortError" && Xt([]);
    }), () => B.abort();
  }, [He.id, d == null ? void 0 : d.effectiveMode]), ye(() => {
    const B = new AbortController();
    return Z(`/videos/${He.id}/history`, { signal: B.signal }).then((me) => {
      const De = me || Mt;
      Ie.current = De, re(De);
    }).catch((me) => {
      me.name !== "AbortError" && T(me.message || "Unable to load editor history.");
    }), () => B.abort();
  }, [He.id]), ye(() => {
    cd(ne);
  }, [ne.timelineRatio, ne.markerRailOpen, ne.detailWidth, ne.markerRailWidth, ne.swimlaneTitleWidth]), ye(() => {
    dd(Ce);
  }, [Ce]), ye(() => {
    Ps(G);
  }, [G]), ye(() => {
    const B = tn.current;
    if (!a || !B || typeof ResizeObserver > "u") return;
    const me = () => {
      var xt;
      const Je = Math.max(0, B.clientHeight - (((xt = Ut.current) == null ? void 0 : xt.offsetHeight) || 0));
      ue(Je), ce((dn) => {
        const Oo = no(dn.timelineRatio, Je);
        return Oo === dn.timelineRatio ? dn : { ...dn, timelineRatio: Oo };
      });
    }, De = new ResizeObserver(me);
    return De.observe(B), Ut.current && De.observe(Ut.current), me(), () => De.disconnect();
  }, [a]), ye(() => {
    if (!hn || typeof ResizeObserver > "u") return;
    const B = kn.current, me = Sn.current;
    if (!B || !me) return;
    const De = () => V({
      workspace: B.clientWidth,
      focusRow: me.clientWidth,
      focusRowHeight: me.clientHeight
    }), Je = new ResizeObserver(De);
    return Je.observe(B), Je.observe(me), De(), () => Je.disconnect();
  }, [hn, ne.markerRailOpen]);
  const It = Ue(
    () => ra(
      Lr(
        Ze,
        vt,
        S,
        l && G,
        ht
      ),
      bt,
      !0
    ),
    [
      Ze,
      vt,
      S,
      G,
      ht,
      l,
      bt
    ]
  ), Rn = Object.fromEntries(at.map((B) => [B, It.filter((me) => me.reviewState === B).length])), Mn = ra(
    Lr(
      Ze,
      vt,
      { ...S, reviewStates: at },
      l && G,
      ht
    ),
    bt,
    !0
  ), Ct = Object.fromEntries(at.map((B) => [B, Mn.filter((me) => me.reviewState === B).length])), Kt = [...new Set(Ze.map((B) => B.sourceKey).filter(Boolean))].sort((B, me) => wt(B).localeCompare(wt(me))), En = Ss(
    S,
    l && G
  ), rt = Ue(
    () => qt(It, ht, vt),
    [It, ht, vt]
  ), de = Ns(
    rt,
    g,
    s
  ), At = Ds(It, b), or = !l && At.length > 0 && At.every((B) => B.nativeSegmentId != null), zt = It.map((B) => B.id), an = zt.join("|");
  y.current = (de == null ? void 0 : de.id) ?? null;
  const j = An.get(de == null ? void 0 : de.id) || [], Le = lo(j), tt = Ue(
    () => zl(rt, b),
    [rt, b]
  ), Xe = Ue(() => co(rt), [rt]), mt = Ue(
    () => Ul(Xe, Ce),
    [Xe, Ce]
  ), Rt = Ue(
    () => oi(
      mt.rows,
      rn.scrollTop,
      rn.height
    ),
    [mt, rn]
  ), Dn = Ue(
    () => Hl(rt, Ce),
    [rt, Ce]
  ), pi = mr(Dn, de == null ? void 0 : de.id, -1, !0) != null, fi = mr(Dn, de == null ? void 0 : de.id, 1, !0) != null, sn = de ? St(rt, de.id) : null, Dr = ht.length > 0 ? Xe.map((B) => B.key) : [], yi = Dr.join("|"), ar = Math.max(
    0,
    Number((Mo = He.videoFile) == null ? void 0 : Mo.duration) || 0,
    ...Ze.map((B) => Number(B.endSec ?? B.startSec) || 0)
  ), go = Number((Eo = He.videoFile) == null ? void 0 : Eo.duration) > 0 ? Number(He.videoFile.duration) : null;
  D.actions;
  const bi = Ka();
  ye(() => {
    const B = g === pr ? g : (de == null ? void 0 : de.id) ?? null;
    B !== g && u(B);
  }, [de, g]), ye(() => {
    m((B) => {
      const me = Ts(
        B,
        zt,
        (de == null ? void 0 : de.id) ?? null
      );
      return me.length === B.length && me.every((De, Je) => De === B[Je]) ? B : me;
    });
  }, [an, de == null ? void 0 : de.id]);
  const ln = (de == null ? void 0 : de.itemId) == null ? null : ((Do = e.itemMetadata) == null ? void 0 : Do[de.itemId]) || null, hi = {
    key: (de == null ? void 0 : de.itemId) != null ? `item:${de.itemId}` : (de == null ? void 0 : de.nativeSegmentId) != null ? `native:${de.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (ln == null ? void 0 : ln.provenance) || (de == null ? void 0 : de.fieldProvenance) || [] : []
  }, Or = (de == null ? void 0 : de.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (ln == null ? void 0 : ln.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  ye(() => {
    H(de == null ? "" : String(de.startSec)), le((de == null ? void 0 : de.endSec) == null ? "" : String(de.endSec));
  }, [de == null ? void 0 : de.id, de == null ? void 0 : de.startSec, de == null ? void 0 : de.endSec]), ye(() => {
    sn && Oe((B) => si(B, sn));
  }, [He.id, s, sn]), ye(() => {
    _e((B) => Jl(Dr, B, sn));
  }, [He.id, yi, sn]), ye(() => {
    if (!ne.markerRailOpen || (de == null ? void 0 : de.id) == null) return;
    const B = nn.current, me = mt.rows.find((xt) => xt.kind === "segment" && xt.segment.id === de.id);
    if (!B || !me) return;
    const De = me.top + me.height;
    let Je = B.scrollTop;
    me.top < B.scrollTop ? Je = me.top : De > B.scrollTop + B.clientHeight && (Je = Math.max(0, De - B.clientHeight)), Je !== B.scrollTop && (B.scrollTop = Je), Tn({ scrollTop: Je, height: B.clientHeight });
  }, [de == null ? void 0 : de.id, mt, ne.markerRailOpen]), ye(() => {
    const B = nn.current;
    if (!ne.markerRailOpen || !B) return;
    const me = () => Tn({
      scrollTop: B.scrollTop,
      height: B.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      me();
      return;
    }
    const De = new ResizeObserver(me);
    return De.observe(B), me(), () => De.disconnect();
  }, [ne.markerRailOpen]);
  const { revealSegmentGroupForSelection: po, replaceSegmentSelection: vi, selectSegment: fo, selectSegmentCollection: xi, selectAllVideoSegments: Si } = zd({
    allSwimlanes: rt,
    editorRef: ut,
    performerSlots: vt,
    seekRef: vn,
    segmentGroups: ht,
    segments: Ze,
    selectedSegmentId: g,
    selectedSegmentIds: b,
    selectionAnchorIdRef: x,
    selectionRangeBaseIdsRef: h,
    setCollapsedSegmentGroups: Oe,
    setEditorFilters: O,
    setHideDerivedSegments: C,
    setSaveMessage: T,
    setSelectedSegmentGroupKey: _e,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m
  }), { acceptHistory: Pr, recordHistoryAction: ir, mutateSegment: ki, completeReview: wi, createSegment: yo, splitSegment: bo, duplicateSegment: ho, saveTiming: Ni, applyShortcutTiming: Ii } = od({
    compatibilityMode: l,
    currentTime: N,
    detail: e,
    editorFilters: S,
    endInput: se,
    hideDerivedSegments: G,
    historyRef: Ie,
    mediaDuration: go,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: Tr,
    pendingDuplicateRef: Tt,
    pendingFirstSegmentStartSecRef: $n,
    pendingTagEditSegmentIdRef: Cn,
    queuedCreatedSegmentTagRef: J,
    replaceSegmentSelection: vi,
    savingSegmentId: R,
    segments: Ze,
    selectedSegment: de,
    selectedSegmentIdRef: y,
    selectedSegments: At,
    selectionAnchorIdRef: x,
    selectionRangeBaseIdsRef: h,
    setCreatingSegmentId: te,
    setEditorFilters: O,
    setFirstSegmentTagOpen: ve,
    setHideDerivedSegments: C,
    setHistory: re,
    setHistoryOpen: F,
    setPublishApprovedError: ie,
    setSaveMessage: T,
    setSavingSegmentId: K,
    setSelectedSegmentGroupKey: _e,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    setTagEditing: p,
    startInput: M,
    tagEditingRef: v,
    timelineDuration: ar,
    video: He
  });
  function vo(B = null) {
    var Je;
    if (!l || R != null || !Ze.some((xt) => !xt.published && xt.reviewState === "approved")) return;
    const me = ((Je = ut.current) == null ? void 0 : Je.ownerDocument) ?? document, De = me.activeElement === me.body ? null : me.activeElement;
    Pe.current = B != null && B.isConnected && B !== me.body ? B : De, ie(""), xe(!0);
  }
  function xo() {
    R == null && (xe(!1), ie(""), requestAnimationFrame(() => {
      Jd(
        Pe.current,
        ut.current
      ), Pe.current = null;
    }));
  }
  async function Ci() {
    await wi() && xo();
  }
  const { closeMergeConfirmation: $i, mergeSelectedSwimlane: So, saveSelectedReviewState: ko } = _d({
    acceptHistory: Pr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: w,
    historyRef: Ie,
    mergeSavingRef: z,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    pendingReviewStateRef: we,
    recordHistoryAction: ir,
    revealSegmentGroupForSelection: po,
    reviewSavingRef: Se,
    savingSegmentId: R,
    selectedGroups: tt,
    selectedSegment: de,
    selectedSegmentIdRef: y,
    selectedSegments: At,
    selectionAnchorIdRef: x,
    selectionRangeBaseIdsRef: h,
    setMergeConfirmation: U,
    setSaveMessage: T,
    setSavingSegmentId: K,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: He
  }), Ti = (B) => {
    we.current = qs(
      we.current,
      B
    );
  };
  ye(() => {
    if (R != null || Se.current) return;
    let B = !1;
    for (; we.current.length > 0; ) {
      const me = we.current.shift(), De = _s(me, Ze);
      if (!De) {
        B = !0;
        continue;
      }
      ko(
        De.requestedState,
        De.selectedSegments,
        De.selectedSegment
      );
      return;
    }
    B && T("The queued review could not find its segment after refreshing.");
  }, [R, Ze]);
  const { toggleIncorrectExample: Ai, removeIncorrectExample: Ri, captureTrainingExport: Mi, deleteRejectedSegments: wo, autoAssignPerformers: Ei, previewDerivedSegments: Di, closeMaterializeDialog: Oi, materializeDerivedSegments: Pi, saveTag: No, moveToBin: Li, emptyRecyclingBin: Fi } = Hd({
    acceptHistory: Pr,
    allSwimlanes: rt,
    autoAssignCandidates: tr,
    autoAssigning: st,
    binEmptyingRef: Re,
    canMoveSelectionToBin: or,
    closeTagEditing: Lt,
    compatibilityMode: l,
    creatingSegmentId: A,
    detail: e,
    editorRef: ut,
    exportingExamples: Jn,
    incorrectExamples: bt,
    lineage: Or,
    materializeButtonRef: yt,
    materializePreview: Wn,
    materializeRestoreFocusRef: Zt,
    materializing: ft,
    mutateSegment: ki,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    queuedCreatedSegmentTagRef: J,
    recordHistoryAction: ir,
    refreshMaterializationPreview: Rr,
    removingExampleId: bn,
    revealSegmentGroupForSelection: po,
    savingSegmentId: R,
    segments: Ze,
    selectedSegment: de,
    selectedSegmentIdRef: y,
    selectedSegments: At,
    selectionAnchorIdRef: x,
    selectionRangeBaseIdsRef: h,
    setAutoAssignError: nt,
    setAutoAssignOpen: Ke,
    setAutoAssigning: et,
    setExportingExamples: Yn,
    setIncorrectExamples: Xt,
    setMaterializeError: yn,
    setMaterializeLoading: Nt,
    setMaterializeOpen: qn,
    setMaterializePreview: Yt,
    setMaterializing: Nr,
    setRemovingExampleId: $r,
    setRejectedDeletionPreview: Ee,
    setSaveMessage: T,
    setSavingSegmentId: K,
    setSelectedSegmentGroupKey: _e,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: He
  });
  ye(() => {
    const B = J.current;
    !B || R != null || (J.current = null, (de == null ? void 0 : de.id) === B.segmentId && No(B.tagId, B.tagName));
  }, [R, de == null ? void 0 : de.id]);
  const { restoreHistoryTarget: ji, updateTimelineRatio: Io, handleSeparatorPointerDown: Bi, handleSeparatorPointerMove: Gi, handleSeparatorKeyDown: Ui, panelWidthMaximum: Co, panelSeparatorProps: Ki, toggleSegmentRail: zi, toggleSegmentGroup: $o, mutateShotBoundary: _i } = qd({
    acceptHistory: Pr,
    compatibilityMode: l,
    currentTime: N,
    detail: e,
    editorLayout: ne,
    focusRowRef: Sn,
    history: D,
    historyRef: Ie,
    historySaving: Me,
    horizontalLayoutSize: he,
    mediaStackHeight: oe,
    mediaStackRef: tn,
    commonActionsRef: Ut,
    onDetailChange: t,
    onReload: o,
    railToggleRef: wn,
    recordHistoryAction: ir,
    savingSegmentId: R,
    savingShot: ae,
    savingShotRef: Ar,
    setCollapsedSegmentGroups: Oe,
    setEditorLayout: ce,
    setHistorySaving: I,
    setIncorrectExamples: Xt,
    setSaveMessage: T,
    setSavingSegmentId: K,
    setSavingShot: W,
    shotBoundaries: on,
    timelineDuration: ar,
    video: He,
    workspaceRef: kn
  }), { executeShortcutById: To, stepVideoFrame: Hi } = Wd({
    allSwimlanes: rt,
    applyShortcutTiming: Ii,
    centerTimelineRef: xn,
    compatibilityMode: l,
    createSegment: yo,
    currentTime: N,
    deleteRejectedSegments: wo,
    duplicateSegment: ho,
    editorLayout: ne,
    editorRef: ut,
    emptyRecyclingBin: Fi,
    lineage: Or,
    mediaDuration: go,
    mergeSelectedSwimlane: So,
    moveToBin: Li,
    mutateShotBoundary: _i,
    openPublishApprovedDialog: vo,
    playbackControlsRef: Qn,
    playbackShortcutConfig: bi,
    saveSelectedReviewState: ko,
    seekRef: vn,
    segmentGroupKeys: Dr,
    selectSegment: fo,
    selectedSegment: de,
    selectedSegmentGroupForSegment: sn,
    selectedSegmentGroupKey: je,
    selectedSegments: At,
    setCollapsedSegmentGroups: Oe,
    setIncorrectExamplesOpen: Te,
    setQuickSearchOpen: We,
    setSaveMessage: T,
    setSelectedSegmentGroupKey: _e,
    setTagEditing: p,
    setTimelineZoom: _,
    shotBoundaries: on,
    slotButtonRef: In,
    splitSegment: bo,
    swimlanes: Dn,
    timelineDuration: ar,
    toggleIncorrectExample: Ai,
    toggleSegmentGroup: $o,
    updateTimelineRatio: Io,
    videoFrameRate: nr,
    visibleSegments: It
  });
  en.current = To;
  const qi = Ue(() => zn.map((B) => ({
    id: B.id,
    enabled: mn(B, l),
    surface: "local",
    action: (me) => {
      var De;
      return (De = en.current) == null ? void 0 : De.call(en, B.id, me);
    }
  })), [l]);
  ka(Xr, qi);
  const Wi = to(oe), Vi = Ht(ne.markerRailWidth, Co("markerRailWidth")), Ji = Ht(ne.detailWidth, Co("detailWidth"));
  return n(Kd, {
    activeFilterCount: En,
    allSwimlanes: rt,
    analysisError: Ot,
    analysisRun: Jt,
    analysisStatus: pn,
    approvalFacetCounts: Ct,
    autoAssignCandidates: tr,
    autoAssignError: Dt,
    autoAssignOpen: $e,
    autoAssignPerformers: Ei,
    autoAssigning: st,
    canMoveSelectionToBin: or,
    captureTrainingExport: Mi,
    cancelQueuedReviewsForSegments: Ti,
    removeIncorrectExample: Ri,
    rejectedDeletionPreview: fe,
    centerTimelineRef: xn,
    closeEditorFilters: rr,
    closeFirstSegmentTagDialog: Er,
    closeMaterializeDialog: Oi,
    closeMergeConfirmation: $i,
    closePublishApprovedDialog: xo,
    closeTagEditing: Lt,
    collapsedSegmentGroups: Ce,
    commonActionsRef: Ut,
    compatibilityMode: l,
    configuringTag: Ir,
    createSegment: yo,
    currentTime: N,
    deleteRejectedSegments: wo,
    detail: e,
    detailPanelRef: w,
    detailWidth: Ji,
    duplicateSegment: ho,
    editorFilters: S,
    editorLayout: ne,
    editorRef: ut,
    exportingExamples: Jn,
    filtersButtonRef: Nn,
    filtersOpen: $,
    firstSegmentTagOpen: q,
    focusRowRef: Sn,
    handleSeparatorKeyDown: Ui,
    handleSeparatorPointerDown: Bi,
    handleSeparatorPointerMove: Gi,
    hideDerivedSegments: G,
    history: D,
    historyOpen: Y,
    historySaving: Me,
    hasNextUnreviewed: fi,
    hasPreviousUnreviewed: pi,
    horizontalLayoutSize: he,
    importNativeSegments: kr,
    incorrectExamples: bt,
    incorrectExamplesOpen: Qe,
    removingExampleId: bn,
    lineage: Or,
    markerRailWidth: Vi,
    materializeButtonRef: yt,
    materializeCancelButtonRef: Qt,
    materializeDerivedSegments: Pi,
    materializeError: Pt,
    materializeLoading: ct,
    materializeOpen: Gt,
    materializePreview: Wn,
    materializing: ft,
    mediaStackRef: tn,
    mergeCancelButtonRef: Q,
    mergeConfirmation: ee,
    mergeSavingRef: z,
    mergeSelectedSwimlane: So,
    nativeImportState: Hn,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: vo,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: Ki,
    pendingInitialSeekRef: Zn,
    performerSlots: vt,
    performerSlotsAvailable: Mr,
    playbackControlsRef: Qn,
    previewDerivedSegments: Di,
    provenance: hi,
    provenanceSources: Kt,
    publishApprovedCancelButtonRef: ke,
    publishApprovedDrafts: Ci,
    publishApprovedError: be,
    publishApprovedOpen: X,
    quickSearchOpen: qe,
    railScrollRef: nn,
    railToggleRef: wn,
    recordHistoryAction: ir,
    restoreHistoryTarget: ji,
    runEditorAction: To,
    stepVideoFrame: Hi,
    saveMessage: k,
    setSaveMessage: T,
    saveTag: No,
    saveTiming: Ni,
    savingSegmentId: R,
    setSavingSegmentId: K,
    seekRef: vn,
    segmentGroups: ht,
    segmentRailLayout: mt,
    segments: Ze,
    selectAllVideoSegments: Si,
    selectSegment: fo,
    selectSegmentCollection: xi,
    selectedGroups: tt,
    selectedPerformerSlots: j,
    selectedSegment: de,
    selectedSegmentGroupKey: je,
    selectedSegmentIds: b,
    selectedSegments: At,
    selectedSlotStatus: Le,
    setAutoAssignError: nt,
    setAutoAssignOpen: Ke,
    setConfiguringTag: Cr,
    setCurrentTime: E,
    setEditorFilters: O,
    setEditorLayout: ce,
    setFiltersOpen: P,
    setHideDerivedSegments: C,
    setHistoryOpen: F,
    setIncorrectExamplesOpen: Te,
    setQuickSearchOpen: We,
    setRejectedDeletionPreview: Ee,
    setRailViewport: Tn,
    setSelectedSegmentGroupKey: _e,
    setSelectedSegmentId: u,
    setShortcutsOpen: Ne,
    setTimelineZoom: _,
    shotBoundaries: on,
    shortcutsOpen: Ge,
    slotButtonRef: In,
    splitLayout: a,
    splitSegment: bo,
    startFullAnalysis: fn,
    tagEditing: f,
    creatingSegmentId: A,
    tagSearchRef: Xn,
    timelineDuration: ar,
    timelineRatioBounds: Wi,
    timelineZoom: pe,
    toggleSegmentGroup: $o,
    toggleSegmentRail: zi,
    updateTimelineRatio: Io,
    video: He,
    videoPerformers: Ve,
    visibleCounts: Rn,
    visibleSegmentRailRows: Rt,
    visibleSegments: It,
    wideLayout: hn,
    workspaceRef: kn
  });
}
const Qd = /* @__PURE__ */ new Set(["queued", "running"]);
async function ga(e, t, r = 4) {
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
function pa(e, t) {
  return { videoId: e, error: (t == null ? void 0 : t.message) || String(t || "Unable to start Full Scan.") };
}
function Zd() {
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
async function Xd(e, t, r, o) {
  const i = [...new Set(e.map(Number).filter((m) => Number.isInteger(m) && m > 0))], a = [...new Set(t)].filter((m) => ["aiTagging", "omnishotcut"].includes(m));
  if (i.length === 0 || a.length === 0)
    return { queuedIds: [], failed: [], cancelled: !1 };
  const s = a.includes("omnishotcut"), l = await ga(i, async (m) => {
    try {
      const [y, x] = await Promise.all([
        r(`/videos/${m}/analysis-runs`),
        s ? r(`/videos/${m}/editor`) : null
      ]);
      if ((y || []).some((w) => Qd.has(w == null ? void 0 : w.status)))
        throw new Error("A Full Scan is already queued or running.");
      const h = (x == null ? void 0 : x.shotBoundaries) || [];
      return { videoId: m, shotBoundaries: h };
    } catch (y) {
      return pa(m, y);
    }
  }), d = l.filter((m) => !m.error), c = l.filter((m) => m.error), g = d.filter((m) => m.shotBoundaries.length > 0), u = g.reduce((m, y) => m + y.shotBoundaries.length, 0);
  if (u > 0 && !o(
    `Replace ${u} existing shot ${u === 1 ? "boundary" : "boundaries"} across ${g.length} selected ${g.length === 1 ? "video" : "videos"} when these scans succeed? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
  )) return { queuedIds: [], failed: c, cancelled: !0 };
  const b = await ga(d, async ({ videoId: m, shotBoundaries: y }) => {
    const x = s && y.length > 0;
    try {
      return await r(`/videos/${m}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: a,
          replaceShotBoundaries: x,
          expectedShotBoundaryFingerprint: x ? Ln(y) : null
        })
      }), { videoId: m };
    } catch (h) {
      return pa(m, h);
    }
  });
  return {
    queuedIds: b.filter((m) => !m.error).map((m) => m.videoId),
    failed: [...c, ...b.filter((m) => m.error)],
    cancelled: !1
  };
}
function ec(e = [], t = []) {
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
function tc(e = [], t = "", r = "all") {
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
function ot(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function nc(e = [], t = []) {
  var m;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((y, x) => (y.sortOrder ?? 0) - (x.sortOrder ?? 0) || Number(y.id) - Number(x.id)).forEach((y, x) => {
    [...y.tags || []].sort((h, w) => (h.sortOrder ?? 0) - (w.sortOrder ?? 0) || Number(h.tagId) - Number(w.tagId)).forEach((h, w) => r.set(Number(h.tagId), {
      key: `group:${y.id}`,
      id: y.id,
      name: y.name,
      sortOrder: y.sortOrder ?? x,
      tagSortOrder: h.sortOrder ?? w
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(y, x) {
    const h = Number(y);
    if (!o.has(h)) {
      const w = r.get(h);
      o.set(h, {
        tagId: h,
        name: x || `Tag ${h}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (w == null ? void 0 : w.key) || "ungrouped",
        segmentGroupId: (w == null ? void 0 : w.id) ?? null,
        segmentGroupName: (w == null ? void 0 : w.name) || "Ungrouped",
        segmentGroupSortOrder: (w == null ? void 0 : w.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (w == null ? void 0 : w.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(h);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((y) => {
    const x = i(y.sourceTagId, y.sourceTagName), h = i(y.derivedTagId, y.derivedTagName);
    x.outgoingRuleCount++, h.incomingRuleCount++;
    const w = `${x.tagId}:${h.tagId}`;
    a.has(w) || a.set(w, {
      id: w,
      sourceTagId: x.tagId,
      derivedTagId: h.tagId,
      rules: [],
      edgeCount: 0
    });
    const S = a.get(w);
    S.rules.push(y), S.edgeCount += Number(y.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((y) => [y.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((y) => {
    var x, h;
    (x = d.get(y.sourceTagId)) == null || x.add(y.derivedTagId), (h = d.get(y.derivedTagId)) == null || h.add(y.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), g = [];
  for (const y of s) {
    if (c.has(y.tagId)) continue;
    const x = [y.tagId], h = [];
    for (c.add(y.tagId); x.length > 0; ) {
      const C = x.shift();
      h.push(C);
      for (const N of d.get(C) || [])
        c.has(N) || (c.add(N), x.push(N));
    }
    const w = new Set(h), S = h.map((C) => o.get(C)), O = l.filter((C) => w.has(C.sourceTagId) && w.has(C.derivedTagId)), $ = O.flatMap((C) => C.rules), P = S.filter((C) => C.outgoingRuleCount === 0).sort((C, N) => ot(C.name, N.name)), G = P.length > 0 ? P : [...S].sort((C, N) => ot(C.name, N.name));
    g.push({
      id: [...h].sort((C, N) => C - N).join(":"),
      label: G.length > 1 ? `${G[0].name} + ${G.length - 1}` : ((m = G[0]) == null ? void 0 : m.name) || "Derivation component",
      nodes: S,
      connections: O,
      rules: $,
      segmentGroupKeys: [...new Set(S.map((C) => C.segmentGroupKey))],
      materializedEdgeCount: $.reduce(
        (C, N) => C + (Number(N.edgeCount) || 0),
        0
      )
    });
  }
  g.sort((y, x) => x.rules.length - y.rules.length || ot(y.label, x.label));
  const u = /* @__PURE__ */ new Map();
  s.forEach((y) => {
    u.has(y.segmentGroupKey) || u.set(y.segmentGroupKey, {
      key: y.segmentGroupKey,
      id: y.segmentGroupId,
      name: y.segmentGroupName,
      sortOrder: y.segmentGroupSortOrder,
      nodes: [],
      ruleIds: /* @__PURE__ */ new Set(),
      componentIds: /* @__PURE__ */ new Set()
    }), u.get(y.segmentGroupKey).nodes.push(y);
  }), g.forEach((y) => {
    y.nodes.forEach((x) => {
      var h;
      return (h = u.get(x.segmentGroupKey)) == null ? void 0 : h.componentIds.add(y.id);
    }), y.rules.forEach((x) => {
      var h, w;
      (h = u.get(o.get(Number(x.sourceTagId)).segmentGroupKey)) == null || h.ruleIds.add(x.id), (w = u.get(o.get(Number(x.derivedTagId)).segmentGroupKey)) == null || w.ruleIds.add(x.id);
    });
  });
  const b = [...u.values()].sort((y, x) => y.sortOrder - x.sortOrder || ot(y.name, x.name)).map((y) => ({
    ...y,
    ruleCount: y.ruleIds.size,
    componentCount: y.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: g,
    segmentGroups: b
  };
}
function rc(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const g = new Map(e.nodes.map((E) => [E.tagId, /* @__PURE__ */ new Set()])), u = new Map(e.nodes.map((E) => [E.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((E) => {
    var R, K;
    (R = g.get(E.sourceTagId)) == null || R.add(E.derivedTagId), (K = u.get(E.derivedTagId)) == null || K.add(E.sourceTagId);
  });
  const b = new Map(e.nodes.map((E) => {
    var R;
    return [
      E.tagId,
      ((R = u.get(E.tagId)) == null ? void 0 : R.size) || 0
    ];
  })), m = new Map(e.nodes.map((E) => [E.tagId, 0])), y = e.nodes.filter((E) => b.get(E.tagId) === 0).sort((E, R) => ot(E.name, R.name)).map((E) => E.tagId), x = /* @__PURE__ */ new Set();
  for (; y.length > 0; ) {
    const E = y.shift();
    if (!x.has(E)) {
      x.add(E);
      for (const R of g.get(E) || [])
        m.set(R, Math.max(m.get(R) || 0, (m.get(E) || 0) + 1)), b.set(R, b.get(R) - 1), b.get(R) === 0 && y.push(R);
    }
  }
  x.size !== e.nodes.length && e.nodes.filter((E) => !x.has(E.tagId)).sort((E, R) => ot(E.name, R.name)).forEach((E) => m.set(E.tagId, 0));
  const h = Math.max(0, ...m.values()), w = Math.max(
    t,
    240 + h * 296
  ), S = /* @__PURE__ */ new Map();
  e.nodes.forEach((E) => {
    S.has(E.segmentGroupKey) || S.set(E.segmentGroupKey, {
      key: E.segmentGroupKey,
      id: E.segmentGroupId,
      name: E.segmentGroupName,
      sortOrder: E.segmentGroupSortOrder,
      nodes: []
    }), S.get(E.segmentGroupKey).nodes.push(E);
  });
  const O = [...S.values()].sort((E, R) => E.sortOrder - R.sortOrder || ot(E.name, R.name));
  let $ = 28;
  const P = [], G = O.map((E) => {
    const R = /* @__PURE__ */ new Map();
    E.nodes.forEach((T) => {
      const M = m.get(T.tagId) || 0;
      R.has(M) || R.set(M, []), R.get(M).push(T);
    });
    for (const T of R.values())
      T.sort((M, H) => M.segmentGroupTagSortOrder - H.segmentGroupTagSortOrder || ot(M.name, H.name));
    const K = Math.max(1, ...[...R.values()].map((T) => T.length)), ae = K * 58 + (K - 1) * 18, W = 70 + ae, k = {
      ...E,
      x: 12,
      y: $,
      width: w - 24,
      height: W
    };
    for (const [T, M] of R.entries()) {
      const H = M.length * 58 + Math.max(0, M.length - 1) * 18, se = (ae - H) / 2;
      M.forEach((le, pe) => P.push({
        ...le,
        rank: T,
        x: 28 + T * 296,
        y: $ + 34 + 18 + se + pe * 76,
        width: 184,
        height: 58
      }));
    }
    return $ += W + 16, k;
  }), C = new Map(P.map((E) => [E.tagId, E])), N = e.connections.map((E) => {
    const R = C.get(E.sourceTagId), K = C.get(E.derivedTagId), ae = R.x + R.width, W = R.y + R.height / 2, k = K.x, T = K.y + K.height / 2, M = Math.max(48, (k - ae) * 0.48);
    return {
      ...E,
      path: `M ${ae} ${W} C ${ae + M} ${W}, ${k - M} ${T}, ${k} ${T}`
    };
  });
  return {
    width: w,
    height: Math.max(r, $ - 16 + 28),
    nodes: P,
    connections: N,
    groups: G
  };
}
function oc(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = rc(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), g = 20, u = o, b = c.nodes.map((y) => ({
      ...y,
      x: y.x + g,
      y: y.y + u
    })), m = new Map(b.map((y) => [y.tagId, y]));
    a.push(...b), l.push(...c.groups.map((y) => ({
      ...y,
      componentId: d.id,
      x: y.x + g,
      y: y.y + u
    }))), s.push(...c.connections.map((y) => {
      const x = m.get(y.sourceTagId), h = m.get(y.derivedTagId), w = x.x + x.width, S = x.y + x.height / 2, O = h.x, $ = h.y + h.height / 2, P = Math.max(48, (O - w) * 0.48);
      return {
        ...y,
        componentId: d.id,
        path: `M ${w} ${S} C ${w + P} ${S}, ${O - P} ${$}, ${O} ${$}`
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
function fa(e, t = []) {
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
function ac(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function ic(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: u, emptyDraft: b, graph: m, layout: y, listSort: x, materializationOffer: h, materializeOutgoingRules: w, materializeRule: S, message: O, normalizedQuery: $, query: P, refreshConfiguredTag: G, revealEditor: C, rules: N, save: E, segmentGroupKey: R, selectedNode: K, selectedRule: ae, selection: W, setConfiguringTag: k, setDraft: T, setListSort: M, setMaterializationOffer: H, setQuery: se, setSegmentGroupKey: le, setSelection: pe, setView: _, sortedVisibleRules: ne, sourceSlots: ce, sourceSlotsLoading: oe, updateMapping: ue, updateTag: he, view: V, visibleComponents: D, visibleRules: re } = e;
  function Ie(f) {
    const p = m.nodes.find((A) => A.tagId === Number(f.sourceTagId)), v = m.nodes.find((A) => A.tagId === Number(f.derivedTagId));
    return (p == null ? void 0 : p.segmentGroupKey) === (v == null ? void 0 : v.segmentGroupKey) ? p.segmentGroupKey : "cross-group";
  }
  function Y() {
    return n("div", { key: "editor", ref: u, className: "space-y-4 p-4" }, [
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
          onClick: () => T(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      n("div", { key: "tags", className: "space-y-3" }, [
        n("div", { key: "source", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Source tag (specific)"),
            n(jn, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (f, p) => he("source", f, p == null ? void 0 : p.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !oe && ce.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (f) => k({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: f.currentTarget
              }),
              className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
            }, "Configure source tag")
          ]) : null
        ]),
        n("div", { key: "derived", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Derived tag (general)"),
            n(jn, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (f, p) => he("derived", f, p == null ? void 0 : p.label),
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
              onClick: (f) => k({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: f.currentTarget
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
            disabled: r || ce.length === 0 || s.length === 0,
            onClick: () => T((f) => ({
              ...f,
              slotMappings: [...f.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
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
          ...d.slotMappings.map((f, p) => n("div", { key: p, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: f.sourceSlotDefinitionId,
              disabled: r,
              onChange: (v) => ue(p, "sourceSlotDefinitionId", v.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${p + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...ce.map((v) => n("option", { key: v.id, value: v.id }, it(v)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: f.derivedSlotDefinitionId,
              disabled: r,
              onChange: (v) => ue(p, "derivedSlotDefinitionId", v.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${p + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((v) => n("option", { key: v.id, value: v.id }, it(v)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => T((v) => ({
                ...v,
                slotMappings: v.slotMappings.filter((A, te) => te !== p)
              })),
              className: `${o} shrink-0 text-red-300`,
              "aria-label": `Remove performer slot mapping ${p + 1}`,
              title: "Remove mapping"
            }, "🗑")
          ]))
        ])
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "save",
          type: "button",
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((f) => !f.sourceSlotDefinitionId || !f.derivedSlotDefinitionId),
          onClick: E,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => T(null), className: o }, "Cancel")
      ])
    ]);
  }
  function F() {
    if (K) {
      const v = re.filter((J) => Number(J.derivedTagId) === K.tagId), A = re.filter((J) => Number(J.sourceTagId) === K.tagId), te = (J, q, ve) => n("div", {
        key: J.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, q),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${J.sourceTagName} → ${J.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          ve ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => S(J),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => g(J, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(J),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, K.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, K.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${K.incomingRuleCount} incoming · ${K.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (J) => k({
            tagId: K.tagId,
            tagName: K.name,
            trigger: J.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        A.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => w(K, A),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${A.length})`) : null,
        A.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...A.map((J) => te(J, "Derives", !0))
        ]) : null,
        v.length ? n("details", {
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
              v.length
            )
          ]),
          n(
            "div",
            { key: "rules", className: "space-y-2 border-t border-border p-2" },
            v.map((J) => te(J, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!ae)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const f = m.nodes.find((v) => v.tagId === Number(ae.sourceTagId)), p = m.nodes.find((v) => v.tagId === Number(ae.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (f == null ? void 0 : f.segmentGroupName) || "Ungrouped"),
          (f == null ? void 0 : f.segmentGroupKey) !== (p == null ? void 0 : p.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(p == null ? void 0 : p.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${ae.sourceTagName} → ${ae.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${ae.edgeCount} materialized lineage edge${ae.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (h == null ? void 0 : h.ruleId) === ae.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
        n(
          "p",
          { key: "summary", className: "text-sm font-medium text-foreground" },
          `${h.createCount + h.linkCount} pending derivation${h.createCount + h.linkCount === 1 ? "" : "s"}`
        ),
        n(
          "p",
          { key: "details", className: "text-xs text-secondary" },
          `${h.createCount} new segments · ${h.linkCount} existing segments to link`
        ),
        n("div", { key: "actions", className: "flex gap-2" }, [
          n("button", {
            key: "materialize",
            type: "button",
            disabled: r,
            onClick: () => S(ae, h),
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
        ae.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : ae.slotMappings.map((v, A) => n("div", {
          key: `${v.sourceSlotDefinitionId}:${v.derivedSlotDefinitionId}`,
          className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
        }, [
          n(
            "span",
            { key: "source", className: "truncate text-foreground", title: v.sourceSlotLabel || "Unnamed slot" },
            v.sourceSlotLabel || "Unnamed slot"
          ),
          n("span", { key: "arrow", className: "text-secondary" }, "→"),
          n(
            "span",
            { key: "derived", className: "truncate text-foreground", title: v.derivedSlotLabel || "Unnamed slot" },
            v.derivedSlotLabel || "Unnamed slot"
          )
        ]))
      ]),
      n("dl", { key: "metadata", className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-xs" }, [
        n("dt", { key: "created-label", className: "text-secondary" }, "Created"),
        n(
          "dd",
          { key: "created", className: "text-right text-foreground" },
          ae.createdAt ? new Date(ae.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          ae.updatedAt ? new Date(ae.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => S(ae),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(ae),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(ae),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function Me() {
    if (D.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, $ ? "No derivation relationships match your search." : "No derivation rules.");
    const f = K == null ? void 0 : K.tagId, p = /* @__PURE__ */ new Set();
    return K && (p.add(K.tagId), y.connections.forEach((v) => {
      (v.sourceTagId === K.tagId || v.derivedTagId === K.tagId) && (p.add(v.sourceTagId), p.add(v.derivedTagId));
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
        style: { width: `${y.width}px`, height: `${y.height}px` },
        "aria-label": "Derivation rule graph"
      }, [
        ...y.groups.map((v) => n("div", {
          key: `group:${v.componentId}:${v.key}`,
          className: `absolute rounded-xl border ${R === v.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
          style: {
            left: `${v.x}px`,
            top: `${v.y}px`,
            width: `${v.width}px`,
            height: `${v.height}px`
          }
        }, n("div", {
          className: "absolute left-3 top-2 max-w-[16rem] truncate text-[11px] font-semibold uppercase tracking-wide text-secondary",
          title: v.name
        }, v.name))),
        n("svg", {
          key: "edges",
          className: "pointer-events-none absolute inset-0 overflow-visible",
          width: y.width,
          height: y.height,
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
          ...y.connections.map((v) => {
            const A = f === v.sourceTagId || f === v.derivedTagId, te = K != null, J = A ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${v.id}:visible`,
              d: v.path,
              fill: "none",
              stroke: J,
              strokeWidth: A ? 2.5 : 1.5,
              opacity: te && !A ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...y.nodes.map((v) => {
          const A = !$ || v.name.toLocaleLowerCase().includes($), te = K != null, J = p.has(v.tagId), q = (K == null ? void 0 : K.tagId) === v.tagId;
          return n("button", {
            key: `node:${v.tagId}`,
            type: "button",
            onClick: () => pe({ type: "node", id: v.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${q ? "border-accent bg-accent/15 ring-2 ring-accent/25" : J ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${v.x}px`,
              top: `${v.y}px`,
              width: `${v.width}px`,
              height: `${v.height}px`,
              opacity: !A || te && !J ? 0.62 : 1
            },
            title: `${v.name} — ${v.segmentGroupName}`,
            "aria-label": `${v.name}, ${v.incomingRuleCount} incoming and ${v.outgoingRuleCount} outgoing derivation rules`
          }, [
            n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground" }, v.name),
            n("span", { key: "counts", className: "mt-1 flex items-center gap-2 text-[11px] text-secondary" }, [
              n("span", { key: "in" }, `${v.incomingRuleCount} in`),
              n("span", { key: "arrow", "aria-hidden": "true" }, "→"),
              n("span", { key: "out" }, `${v.outgoingRuleCount} out`)
            ])
          ]);
        }),
        ...y.connections.filter((v) => v.rules.length > 1).map((v) => {
          const A = y.nodes.find((J) => J.tagId === v.sourceTagId), te = y.nodes.find((J) => J.tagId === v.derivedTagId);
          return n("div", {
            key: `bundle:${v.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(A.x + A.width + te.x) / 2 - 24}px`,
              top: `${(A.y + A.height / 2 + te.y + te.height / 2) / 2 - 10}px`
            },
            "aria-label": `${v.rules.length} rules connect ${v.rules[0].sourceTagName} to ${v.rules[0].derivedTagName}`
          }, `${v.rules.length} rules`);
        })
      ])
    ]);
  }
  function I() {
    if (D.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        $ ? "No derivation relationships match your search." : "No derivation rules."
      );
    const f = /* @__PURE__ */ new Map();
    ne.forEach((v) => {
      const A = Ie(v);
      f.has(A) || f.set(A, []), f.get(A).push(v);
    });
    const p = [
      ...m.segmentGroups.map((v) => v.key),
      "cross-group"
    ].filter((v) => f.has(v));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, p.map((v) => {
      const A = m.segmentGroups.find((q) => q.key === v), te = v === "cross-group" ? "Cross-group relationships" : (A == null ? void 0 : A.name) || "Ungrouped", J = f.get(v);
      return n("section", { key: v, "aria-label": te }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, te),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${J.length} rule${J.length === 1 ? "" : "s"}`
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
          ...J.map((q) => n("button", {
            key: q.id,
            type: "button",
            role: "row",
            onClick: () => pe({ type: "rule", id: q.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(ae == null ? void 0 : ae.id) === q.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${q.sourceTagName} → ${q.derivedTagName}` },
              `${q.sourceTagName} → ${q.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(q.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(q.edgeCount))
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
          `${N.length} rules · ${m.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          T(b()), pe(null), C();
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
          value: P,
          onChange: (f) => {
            se(f.target.value), pe(null);
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
          onChange: (f) => {
            le(f.target.value), pe(null), T(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...m.segmentGroups.map((f) => n("option", { key: f.key, value: f.key }, f.name))
        ])
      ]),
      V === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: x,
          onChange: (f) => M(f.target.value),
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
        ].map(([f, p]) => n("button", {
          key: f,
          type: "button",
          onClick: () => {
            _(f), f === "graph" && (W == null ? void 0 : W.type) === "rule" && pe(null);
          },
          "aria-pressed": V === f,
          className: `rounded px-3 py-1.5 text-sm font-medium ${V === f ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
        }, p))
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
        V === "graph" ? Me() : I()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? Y() : F()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      O ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, O) : null
    ]),
    i ? n(mo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => G(i),
      onClose: () => {
        const f = i.trigger;
        k(null), requestAnimationFrame(() => {
          f != null && f.isConnected && f.focus();
        });
      }
    }) : null
  ]);
}
function sc({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = L([]), [a, s] = L(null), [l, d] = L([]), [c, g] = L([]), [u, b] = L(!1), [m, y] = L(!1), [x, h] = L(!1), [w, S] = L(""), [O, $] = L(""), [P, G] = L("graph"), [C, N] = L("all"), [E, R] = L(null), [K, ae] = L("relationship"), [W, k] = L(null), [T, M] = L(null), H = ge(null), se = ge(null), le = Va().replace(/:/g, "");
  function pe() {
    requestAnimationFrame(() => {
      var z;
      return (z = H.current) == null ? void 0 : z.scrollIntoView({ block: "nearest" });
    });
  }
  async function _(z) {
    const ee = await Z("/derivation-rules", z ? { signal: z } : void 0);
    i(ee || []);
  }
  ye(() => {
    const z = new AbortController();
    return _(z.signal).catch((ee) => {
      ee.name !== "AbortError" && S(ee.message || "Unable to load derived segment rules.");
    }), () => z.abort();
  }, []), ye(() => {
    const z = new AbortController();
    return a != null && a.sourceTagId ? (b(!0), Z(`/slot-definitions/${a.sourceTagId}`, { signal: z.signal }).then((ee) => d(ee.definitions || [])).catch((ee) => {
      ee.name !== "AbortError" && d([]);
    }).finally(() => {
      z.signal.aborted || b(!1);
    })) : (d([]), b(!1)), a != null && a.derivedTagId ? (y(!0), Z(`/slot-definitions/${a.derivedTagId}`, { signal: z.signal }).then((ee) => g(ee.definitions || [])).catch((ee) => {
      ee.name !== "AbortError" && g([]);
    }).finally(() => {
      z.signal.aborted || y(!1);
    })) : (g([]), y(!1)), () => z.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), ye(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || u || m)
      return;
    const z = `${a.sourceTagId}:${a.derivedTagId}`;
    se.current !== z && (se.current = z, s((ee) => !ee || Number(ee.sourceTagId) !== Number(a.sourceTagId) || Number(ee.derivedTagId) !== Number(a.derivedTagId) ? ee : Ll(ee, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    u,
    m
  ]);
  function ne(z, ee = !1) {
    ee || R({ type: "rule", id: z.id }), se.current = null, s({
      ruleId: z.id,
      sourceTagId: z.sourceTagId,
      sourceTagName: z.sourceTagName,
      derivedTagId: z.derivedTagId,
      derivedTagName: z.derivedTagName,
      slotMappings: z.slotMappings.map((U) => ({
        sourceSlotDefinitionId: U.sourceSlotDefinitionId,
        derivedSlotDefinitionId: U.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), S(""), pe();
  }
  function ce(z, ee, U = "") {
    se.current = null, z === "source" ? (d([]), b(ee != null)) : (g([]), y(ee != null)), s((fe) => ({
      ...fe,
      [`${z}TagId`]: ee == null ? null : Number(ee),
      [`${z}TagName`]: U || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function oe(z) {
    (a == null ? void 0 : a.ruleId) == null && (se.current = null);
    const ee = [_(), t == null ? void 0 : t()];
    return z.draftKind === "source" ? (b(!0), ee.push(Z(`/slot-definitions/${z.tagId}`).then((U) => d(U.definitions || [])).finally(() => b(!1)))) : z.draftKind === "derived" && (y(!0), ee.push(Z(`/slot-definitions/${z.tagId}`).then((U) => g(U.definitions || [])).finally(() => y(!1)))), Promise.all(ee);
  }
  function ue(z, ee, U) {
    s((fe) => ({
      ...fe,
      slotMappings: fe.slotMappings.map((Ee, Q) => Q === z ? { ...Ee, [ee]: U } : Ee)
    }));
  }
  async function he() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const z = fa(a, o);
    if (z) {
      S(z.message);
      return;
    }
    if (a.slotMappings.some((ee) => !ee.sourceSlotDefinitionId || !ee.derivedSlotDefinitionId)) {
      S("Complete or remove every performer slot mapping before saving.");
      return;
    }
    h(!0), S(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let ee = null;
      if (a.ruleId != null) {
        const fe = await Z(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${fe.deletedSegmentCount}
Removed lineage edges: ${fe.removedEdgeCount}
Shared derived segments retained: ${fe.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        ee = fe.fingerprint;
      }
      S("Saving derived segment rule…");
      const U = await Z("/derivation-rules", {
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
      if (await _(), R(P === "graph" ? { type: "node", id: Number(U.sourceTagId) } : { type: "rule", id: U.id }), s(null), a.ruleId == null)
        try {
          const fe = await Z(
            `/derivation-rules/${U.id}/materialization/preview`,
            { method: "POST" }
          );
          k(
            fe.createCount + fe.linkCount > 0 ? fe : null
          ), S(fe.createCount + fe.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          k(null), S("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        k(null), S("Derived segment rule saved. Previous materializations were removed.");
    } catch (ee) {
      S(ee.message || "Unable to save derived segment rule.");
    } finally {
      h(!1);
    }
  }
  async function V(z) {
    h(!0), S("Previewing rule deletion…");
    try {
      const ee = await Z(
        `/derivation-rules/${z.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${z.sourceTagName} → ${z.derivedTagName}?

Deleted segments: ${ee.deletedSegmentCount}
Removed lineage edges: ${ee.removedEdgeCount}
Shared derived segments retained: ${ee.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const U = `derivation-rule-delete:${z.id}:${ee.fingerprint}`;
      await Z(`/derivation-rules/${z.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(U),
          fingerprint: ee.fingerprint
        })
      }), Be(U), await _(), (a == null ? void 0 : a.ruleId) === z.id && s(null), (E == null ? void 0 : E.type) === "rule" && E.id === z.id && R(null), (W == null ? void 0 : W.ruleId) === z.id && k(null), S(`Rule deleted with ${ee.deletedSegmentCount} exclusively derived segment${ee.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (ee) {
      S(ee.message || "Unable to delete derived segment rule.");
    } finally {
      h(!1);
    }
  }
  async function D(z, ee = null) {
    const U = ee || await Z(
      `/derivation-rules/${z.id}/materialization/preview`,
      { method: "POST" }
    );
    if (U.createCount + U.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const fe = `derivation-rule-materialize:${z.id}:${U.fingerprint}`, Ee = await Z(`/derivation-rules/${z.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Fe(fe),
        fingerprint: U.fingerprint
      })
    });
    return Be(fe), Ee;
  }
  async function re(z, ee = null) {
    h(!0), S("Finding pending derivations…");
    try {
      const U = await D(z, ee);
      if (k(null), await _(), U.createdCount + U.linkedCount === 0) {
        S("Every applicable derivation is already materialized.");
        return;
      }
      S(
        `${U.createdCount} derived segment${U.createdCount === 1 ? "" : "s"} created and ${U.linkedCount} existing segment${U.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (U) {
      S(U.message || "Unable to materialize pending derivations.");
    } finally {
      h(!1);
    }
  }
  async function Ie(z, ee) {
    if (ee.length === 0) return;
    h(!0), S(`Finding pending derivations from ${z.name}…`);
    let U = 0, fe = 0;
    try {
      for (const Ee of ee) {
        const Q = await D(Ee);
        U += Q.createdCount, fe += Q.linkedCount;
      }
      k(null), await _(), S(U + fe === 0 ? `Every outgoing derivation from ${z.name} is already materialized.` : `${U} derived segment${U === 1 ? "" : "s"} created and ${fe} existing segment${fe === 1 ? "" : "s"} linked from ${z.name}.`);
    } catch (Ee) {
      await _().catch(() => {
      }), S(Ee.message || `Unable to materialize derivations from ${z.name}.`);
    } finally {
      h(!1);
    }
  }
  const Y = fa(a, o), F = Ue(
    () => nc(o, e),
    [o, e]
  ), Me = O.trim().toLocaleLowerCase(), f = F.components.filter((z) => C === "all" || z.segmentGroupKeys.includes(C)).filter((z) => !Me || z.nodes.some((ee) => ee.name.toLocaleLowerCase().includes(Me))), p = f.flatMap((z) => z.rules), v = new Set(
    f.flatMap((z) => z.nodes.map((ee) => ee.tagId))
  ), A = Ue(
    () => oc(f),
    [f]
  ), te = P === "list" ? ac(
    E,
    p,
    Me.length > 0
  ) : null, J = (E == null ? void 0 : E.type) === "node" && F.nodes.find((z) => z.tagId === E.id && v.has(z.tagId)) || null, q = [...p].sort((z, ee) => K === "source" ? ot(z.sourceTagName, ee.sourceTagName) || ot(z.derivedTagName, ee.derivedTagName) : K === "target" ? ot(z.derivedTagName, ee.derivedTagName) || ot(z.sourceTagName, ee.sourceTagName) : K === "materialized" ? (Number(ee.edgeCount) || 0) - (Number(z.edgeCount) || 0) || ot(z.sourceTagName, ee.sourceTagName) : ot(
    `${z.sourceTagName} ${z.derivedTagName}`,
    `${ee.sourceTagName} ${ee.derivedTagName}`
  ));
  return n(ic, {
    arrowMarkerId: le,
    busy: x,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: T,
    deleteRule: V,
    derivedSlots: c,
    derivedSlotsLoading: m,
    draft: a,
    draftIssue: Y,
    editRule: ne,
    editorRef: H,
    emptyDraft: r,
    graph: F,
    layout: A,
    listSort: K,
    materializationOffer: W,
    materializeOutgoingRules: Ie,
    materializeRule: re,
    message: w,
    normalizedQuery: Me,
    query: O,
    refreshConfiguredTag: oe,
    revealEditor: pe,
    rules: o,
    save: he,
    segmentGroupKey: C,
    selectedNode: J,
    selectedRule: te,
    selection: E,
    setConfiguringTag: M,
    setDraft: s,
    setListSort: ae,
    setMaterializationOffer: k,
    setQuery: $,
    setSegmentGroupKey: N,
    setSelection: R,
    setView: G,
    sortedVisibleRules: q,
    sourceSlots: l,
    sourceSlotsLoading: u,
    updateMapping: ue,
    updateTag: ce,
    view: P,
    visibleComponents: f,
    visibleRules: p
  });
}
function lc() {
  const [e, t] = L(Ka), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => qo({ ...l, [a]: s }));
  }
  function i() {
    t(qo(eo));
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
function dc({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = L([]), [a, s] = L(!1), [l, d] = L(!1), [c, g] = L(""), [u, b] = L(""), [m, y] = L("all"), [x, h] = L(() => /* @__PURE__ */ new Set()), [w, S] = L(null);
  ye(() => {
    if (!e || a) return;
    const k = new AbortController();
    return d(!0), g(""), Z("/slot-definitions", { signal: k.signal }).then((T) => {
      i(T || []), s(!0);
    }).catch((T) => {
      T.name !== "AbortError" && g(T.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      k.signal.aborted || d(!1);
    }), () => k.abort();
  }, [e, a]);
  async function O() {
    d(!0), g("");
    try {
      const k = await Z("/slot-definitions");
      i(k || []), s(!0);
    } catch (k) {
      g(k.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function $() {
    const [k] = await Promise.all([
      Z("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(k || []), s(!0), g("");
  }
  function P() {
    const k = w == null ? void 0 : w.trigger;
    S(null), requestAnimationFrame(() => {
      k != null && k.isConnected && k.focus({ preventScroll: !0 });
    });
  }
  function G(k) {
    h((T) => {
      const M = new Set(T);
      return M.has(k) ? M.delete(k) : M.add(k), M;
    });
  }
  const C = Ue(
    () => ec(t, o),
    [t, o]
  ), N = Ue(
    () => tc(C, u, m),
    [C, u, m]
  ), E = C.flatMap((k) => k.tags), R = E.filter((k) => k.definitions.length > 0).length, K = E.length - R, ae = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], W = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${E.length} tags · ${R} with slots · ${K} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: u,
          onChange: (k) => b(k.target.value),
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
          ae.map(([k, T]) => n("button", {
            key: k,
            type: "button",
            onClick: () => y(k),
            "aria-pressed": m === k,
            className: `rounded px-3 py-1.5 text-xs font-medium ${m === k ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, T))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => h(/* @__PURE__ */ new Set()),
          className: W
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => h(new Set(C.map((k) => k.overviewKey))),
          className: W
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
        onClick: O,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && N.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, N.map((k) => {
      const T = x.has(k.overviewKey), M = k.tags.filter((H) => H.definitions.length > 0).length;
      return n("article", {
        key: k.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => G(k.overviewKey),
          "aria-expanded": !T,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, T ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, k.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${k.tags.length} tag${k.tags.length === 1 ? "" : "s"} · ${M} with slots`
          )
        ]),
        T ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          k.tags.map((H) => n("li", {
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
            }, H.definitions.map((se) => n("li", {
              key: se.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, it(se)),
              ...(se.genderHints || []).map((le) => n("span", {
                key: le,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, vr(le)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (se) => S({
                tagId: H.tagId,
                tagName: H.tagName,
                trigger: se.currentTarget
              }),
              "aria-label": `Edit performer slots for ${H.tagName}`,
              className: `${W} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    w ? n(mo, {
      key: `performer-slots-configure:${w.tagId}`,
      tagId: w.tagId,
      tagName: w.tagName,
      onSaved: $,
      onClose: P
    }) : null
  ]);
}
function cc({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = L("general"), [a, s] = L([]), [l, d] = L(!1), [c, g] = L(""), [u, b] = L(""), [m, y] = L(null), [x, h] = L(!0), [w, S] = L(!1), [O, $] = L(""), [P, G] = L(!0), [C, N] = L(La), E = tl(t), R = E.map(([T]) => T);
  ye(() => {
    R.includes(o) || i(R[0] || "general");
  }, [t.effectiveMode]);
  async function K(T) {
    const M = await Z("/segment-groups", T ? { signal: T } : void 0);
    s(M || []);
  }
  ye(() => {
    const T = new AbortController();
    return K(T.signal).catch((M) => {
      M.name !== "AbortError" && g(M.message || "Unable to load tag groups.");
    }), () => T.abort();
  }, []), ye(() => {
    if (t.effectiveMode !== "full") {
      h(!1);
      return;
    }
    const T = new AbortController();
    return $(""), h(!0), Promise.all([
      Z("/analysis/settings", { signal: T.signal }),
      Z("/analysis/status", { signal: T.signal })
    ]).then(([M, H]) => {
      G(!0), b((M == null ? void 0 : M.baseUrl) || ""), y(H);
    }).catch((M) => {
      if (M.name !== "AbortError") {
        if (M.status === 403) {
          G(!1), $("You do not have permission to manage the analysis service connection.");
          return;
        }
        $(M.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      T.signal.aborted || h(!1);
    }), () => T.abort();
  }, [t.effectiveMode]);
  async function ae(T) {
    if (T !== t.requestedMode) {
      d(!0), g("");
      try {
        const M = await Z(
          `/preferences/transition?mode=${encodeURIComponent(T)}`
        );
        let H = !1, se = null, le = null, pe = null, _ = !1;
        if (t.requestedMode === "basic" && T === "full") {
          if (!window.confirm(ol(
            M.recyclingBinCount,
            M.protectedRecyclingBinCount
          )))
            return;
          _ = !0, M.recyclingBinCount > 0 && (H = !0, pe = M.recyclingBinFingerprint, se = `mode-switch-empty-bin:${pe}`, le = Fe(se));
        }
        let ne = !1;
        if (t.requestedMode === "full" && T === "basic") {
          if (!window.confirm(rl(
            M.extensionOwnedSegmentCount
          )))
            return;
          ne = !0;
        }
        const ce = await Z("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: T,
            confirmHiddenExtensionOwnedSegments: ne,
            confirmBasicHistoryCleanup: _,
            emptyRecyclingBin: H,
            operationId: le,
            expectedRecyclingBinFingerprint: pe
          })
        });
        se && Be(se), r == null || r(za(ce)), g("Workflow mode saved.");
      } catch (M) {
        g(M.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function W(T) {
    T.preventDefault(), S(!0), $("");
    try {
      const M = await Z("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: u })
      });
      b((M == null ? void 0 : M.baseUrl) || "");
      const H = await Z("/analysis/status");
      y(H), $(M != null && M.baseUrl ? H != null && H.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(H == null ? void 0 : H.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (M) {
      $(M.message || "Unable to save analysis service settings.");
    } finally {
      S(!1);
    }
  }
  const k = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (T) => di(T, e, k), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      E.map(([T, M]) => n("button", {
        key: T,
        type: "button",
        onClick: () => i(T),
        "aria-current": o === T ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === T ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, M))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(lc)
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
      n(Id, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: ae,
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
          onChange: (T) => {
            const M = T.target.checked;
            Fa(M), N(M);
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
      n("form", { key: "form", onSubmit: W, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
        n("label", { key: "url", className: "min-w-0 flex-1 space-y-1" }, [
          n("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Server URL"),
          n("input", {
            key: "input",
            type: "url",
            value: u,
            onChange: (T) => b(T.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: x || w || !P,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: x || w || !P,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, w ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        O || (x ? "Loading analysis service settings…" : (m == null ? void 0 : m.configured) === !1 ? "Full Scan is not configured." : m != null && m.ready ? "Analysis service is ready." : (m == null ? void 0 : m.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    R.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(sc, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => K()
      })
    ) : null,
    R.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(dc, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => K()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function ya({ facets: e, values: t, disabled: r, onChange: o }) {
  var i;
  return r ? n(
    "p",
    { className: "rounded-md border border-dashed border-border p-3 text-xs text-secondary" },
    "Performer slot filters are unavailable for your current access. Browse and playback remain available."
  ) : (i = e == null ? void 0 : e.slots) != null && i.length ? n("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, e.slots.map((a) => n("label", { key: a.id, className: "space-y-1 text-xs text-secondary" }, [
    n("span", { key: "label" }, it(a)),
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
function uc({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var g, u;
  const s = [...e.slots || []].sort((b, m) => b.sortOrder - m.sortOrder || String(b.slotDefinitionId).localeCompare(String(m.slotDefinitionId))), l = [...new Map(s.map((b) => [
    b.performerId,
    { id: b.performerId, name: b.performerName }
  ])).values()], d = s.map((b) => ({
    slotDefinitionId: b.slotDefinitionId,
    label: it(b),
    performer: { id: b.performerId, name: b.performerName }
  })), c = Ha(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: ei(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((g = e.activity) == null ? void 0 : g.name) || "segment"}, ${e.reviewState}, ${Ae(e.startSec)} to ${e.endSec == null ? "end of video" : Ae(e.endSec)}` }, [
      n("div", { key: "image", className: "relative aspect-video bg-black" }, [
        n("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        n("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${Ae(e.startSec)} → end` : `${Ae(e.startSec)} – ${Ae(e.endSec)}`)
      ]),
      n("div", { key: "body", className: "flex flex-col gap-1.5 p-2.5" }, [
        n("div", { key: "segment", className: "flex min-w-0 items-center gap-1.5" }, [
          n(Vt, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((u = e.activity) == null ? void 0 : u.name) || "Tag segment"),
          l.length ? n(xr, {
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
function mc({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(Sa, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: sl(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: Ha(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function ba({ onNavigate: e, profile: t }) {
  const r = Ue(() => {
    const _ = wa("ext:com.midnightrider.segment-studio:segments");
    return _ ? {
      ...Fr,
      defaultFilter: { ...Fr.defaultFilter, ..._.findFilter || {} },
      defaultObjectFilter: _.objectFilter || {}
    } : Fr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Na(r), [l, d] = L(null), [c, g] = L({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [u, b] = L(null), [m, y] = L(null), [x, h] = L(0), [w, S] = L(""), [O, $] = L(!0), [P, G] = L(""), C = ge(0), N = Vo(o, i), E = N.activityTagId, R = un(i.slots), K = Ue(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (_) => Object.keys(un(_)).length > 0,
    sanitize: (_) => jr(E, un(_)),
    summarize: (_) => `${Object.keys(un(_)).length} assigned`,
    renderEditor: (_, ne) => E ? n(ya, {
      facets: l,
      values: un(_),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (ce, oe) => {
        const ue = { ...un(_) };
        oe ? ue[ce] = Number(oe) : delete ue[ce], ne(jr(E, ue));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [E, l, c.performerSlotsAvailable]), ae = JSON.stringify(N);
  ye(() => {
    if (d(null), !E) return;
    const _ = new AbortController();
    return Z(`/browse/activities/${E}/facets`, { signal: _.signal }).then(d).catch((ne) => {
      ne.status === 403 ? d({ slots: [], restricted: !0 }) : ne.name !== "AbortError" && G(ne.message);
    }), () => _.abort();
  }, [E]), ye(() => {
    const _ = ++C.current, ne = new AbortController();
    return $(!0), G(""), Z("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(N), signal: ne.signal }).then((ce) => {
      _ === C.current && g({ ...ce, totalCount: ce.totalCount ?? ce.total ?? 0 });
    }).catch((ce) => {
      if (!(_ !== C.current || ce.name === "AbortError")) {
        if (ce.status === 400 && ce.message.includes("unrestricted performer read access")) {
          g((oe) => ({ ...oe, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), G("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        G(ce.message);
      }
    }).finally(() => {
      _ === C.current && $(!1);
    }), () => {
      C.current++, ne.abort();
    };
  }, [ae, x]);
  const W = c.items.findIndex((_) => _.key === u), k = c.items[W] || null;
  function T(_) {
    s(_), a({ ...o, page: 1 });
  }
  function M(_) {
    const ne = Vo(o, _), ce = _.slots && ne.activityTagId != null && ne.slotAssignments.length > 0 ? _.slots : void 0;
    T({ ..._, slots: ce });
  }
  function H(_, ne) {
    const ce = { ...R };
    ne ? ce[_] = Number(ne) : delete ce[_], T({ ...i, slots: jr(E, ce) });
  }
  function se() {
    const _ = document.querySelector(`[data-segment-key="${u}"]`);
    b(null), requestAnimationFrame(() => _ == null ? void 0 : _.focus());
  }
  async function le(_) {
    var oe;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    y(_.key), S("");
    const ne = `browse-restore:${_.itemId}:${_.revision}`, ce = Fe(ne);
    try {
      const ue = (he = !1) => Z(`/bin/${_.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ce,
          expectedRevision: _.revision,
          discardMissingImage: he
        })
      });
      try {
        await ue(oo(ne));
      } catch (he) {
        if (((oe = he.payload) == null ? void 0 : oe.code) !== "missing-image" || !window.confirm(`${he.message}

Continue and discard the missing image reference?`))
          throw he;
        ao(ne), await ue(!0);
      }
      Be(ne), u === _.key && b(null), S("Segment restored to Cove."), h((he) => he + 1);
    } catch (ue) {
      S(ue.message || "Unable to restore the segment."), ue.status === 409 && h((he) => he + 1);
    } finally {
      y(null);
    }
  }
  async function pe(_) {
    y(_.key), S("");
    try {
      const ne = await Z(`/items/${_.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: _.revision })
      });
      if (!Ya(ne, S) || !vl(ne))
        return;
      const ce = `browse-dependency-delete:${_.itemId}:${ne.fingerprint}`;
      await Z(`/items/${_.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(ce),
          fingerprint: ne.fingerprint
        })
      }), Be(ce), u === _.key && b(null), S(`${ne.deletedSegmentCount} segment${ne.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), h((oe) => oe + 1);
    } catch (ne) {
      S(ne.message || "Unable to permanently delete the segment."), ne.status === 409 && h((ce) => ce + 1);
    } finally {
      y(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(uo, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(Ia, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: a,
      totalCount: c.totalCount,
      isLoading: O,
      error: P ? new Error(P) : null,
      onRetry: () => h((_) => _ + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? Wo.filter((_) => _.id !== "performers") : Wo,
      objectFilter: i,
      onObjectFilterChange: M,
      customFilterSections: K,
      searchPlaceholder: "Search segments..."
    }, [
      E ? n(ya, { key: "slots", facets: l, values: R, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: H }) : null,
      n(mc, { key: "player", item: k, index: W, count: c.items.length, onPrevious: () => {
        var _;
        return b((_ = c.items[W - 1]) == null ? void 0 : _.key);
      }, onNext: () => {
        var _;
        return b((_ = c.items[W + 1]) == null ? void 0 : _.key);
      }, onClose: se, onNavigate: e }),
      w ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, w) : null,
      !O && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      O ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((_) => n(uc, {
        key: _.key,
        item: _,
        selected: _.key === u,
        busy: m === _.key,
        onSelect: () => b(_.key),
        onRestore: le,
        onPurge: pe
      })))
    ])
  ]);
}
function gc({ onNavigate: e, profile: t }) {
  const [r, o] = L([]), [i, a] = L(""), [s, l] = L(0), [d, c] = L(!0), [g, u] = L(null), [b, m] = L(""), y = ge(null);
  async function x(S) {
    const O = await Z("/bin", S ? { signal: S } : void 0);
    return o(O.items || []), a(O.fingerprint || ""), l(Number(O.totalCount) || 0), O;
  }
  ye(() => {
    const S = new AbortController();
    return c(!0), x(S.signal).catch((O) => {
      O.name !== "AbortError" && m(O.message);
    }).finally(() => {
      S.signal.aborted || c(!1);
    }), () => S.abort();
  }, []), ka(Xr, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var S;
      return (S = y.current) == null ? void 0 : S.call(y);
    }
  }]);
  async function h(S) {
    var P;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    u(S.itemId), m("");
    const O = `restore:${S.itemId}:${S.revision}`, $ = Fe(O);
    try {
      const G = (C = !1) => Z(`/bin/${S.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: $, expectedRevision: S.revision, discardMissingImage: C })
      });
      try {
        await G(oo(O));
      } catch (C) {
        if (((P = C.payload) == null ? void 0 : P.code) !== "missing-image" || !window.confirm(`${C.message}

Continue and discard the missing image reference?`)) throw C;
        ao(O), await G(!0);
      }
      Be(O), await x(), Fn(), m("Segment restored with a new native ID.");
    } catch (G) {
      m(G.message || "Unable to restore the segment."), G.status === 409 && await x();
    } finally {
      u(null);
    }
  }
  async function w() {
    if (g == null)
      try {
        const S = await Za({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          u(-1), m("");
        });
        if (S.status !== "emptied") return;
        await x(), Fn(), m(`${S.segmentCount} segment${S.segmentCount === 1 ? "" : "s"} from ${S.sceneCount} scene${S.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (S) {
        m(S.message || "Unable to empty the recycling bin."), S.status === 409 && await x();
      } finally {
        u(null);
      }
  }
  return y.current = w, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    n(uo, {
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
    b ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, b) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((S) => n("article", { key: S.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${S.tagName || "Tag segment"} · ${S.videoTitle || `Video ${S.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, S.endSec == null ? Ae(S.startSec) : `${Ae(S.startSec)} – ${Ae(S.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${S.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${S.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: g != null, onClick: () => h(S), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const ha = "ext:com.midnightrider.segment-studio:videos";
function Ur({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = Ue(() => {
    var re;
    const V = wa(ha), D = (re = V == null ? void 0 : V.uiOptions) == null ? void 0 : re.displayMode;
    return V ? {
      ...On,
      defaultFilter: { ...On.defaultFilter, ...V.findFilter || {} },
      defaultObjectFilter: V.objectFilter || {},
      defaultDisplayMode: On.allowedDisplayModes.includes(D) ? D : On.defaultDisplayMode
    } : On;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = Na(i), [u, b] = L({ items: [], totalCount: 0 }), [m, y] = L(!0), [x, h] = L(""), [w, S] = L(0), [O, $] = L(/* @__PURE__ */ new Set()), [P, G] = L(null), [C, N] = L({ busy: !1, error: "", announcement: "" }), E = ge(0), R = ge(null), K = ge(null);
  K.current || (K.current = Zd());
  const ae = JSON.stringify(a), W = JSON.stringify(s), k = t || r === "review";
  ye(() => {
    K.current.selectionChanged(), R.current = null, $(/* @__PURE__ */ new Set()), N((V) => ({ busy: V.busy, error: "", announcement: "" }));
  }, [ae, W]), ye(() => {
    if (!k) return;
    const V = new AbortController();
    return Z("/analysis/status", { signal: V.signal }).then(G).catch((D) => {
      D.name !== "AbortError" && G({ configured: !0, ready: !1, error: D.message || "Unable to check Full Scan readiness." });
    }), () => V.abort();
  }, [k]), ye(() => {
    const V = ++E.current, D = new AbortController();
    return y(!0), h(""), Z(`/videos?${xd(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: D.signal }).then((re) => {
      V === E.current && b(re);
    }).catch((re) => {
      V === E.current && re.name !== "AbortError" && h(re.message || "Unable to discover videos.");
    }).finally(() => {
      V === E.current && y(!1);
    }), () => {
      E.current++, D.abort();
    };
  }, [ae, W, t, r, w]);
  function T(V) {
    d({ ...V, page: V.page || 1 });
  }
  function M(V) {
    c(V), d({ ...a, page: 1 });
  }
  function H(V, D = !1) {
    $((re) => Sd(
      re,
      u.items.map((Ie) => Ie.videoId),
      V,
      R.current,
      D
    )), R.current = V;
  }
  function se() {
    R.current = null, $(new Set(u.items.map((V) => V.videoId)));
  }
  function le() {
    R.current = null, $(/* @__PURE__ */ new Set());
  }
  function pe() {
    R.current = null, $((V) => new Set(u.items.map((D) => D.videoId).filter((D) => !V.has(D))));
  }
  async function _(V = ["aiTagging", "omnishotcut"]) {
    const D = K.current.begin();
    if (D) {
      N({ busy: !0, error: "", announcement: "" });
      try {
        const re = await Xd(
          [...O],
          V,
          Z,
          (Ie) => window.confirm(Ie)
        );
        if (re.cancelled) {
          N({ busy: !1, error: "", announcement: "" });
          return;
        }
        re.queuedIds.length > 0 && K.current.ownsCurrentSelection(D) && (re.queuedIds.includes(R.current) && (R.current = null), $((Ie) => {
          const Y = new Set(Ie);
          return re.queuedIds.forEach((F) => Y.delete(F)), Y;
        })), N({
          busy: !1,
          announcement: re.queuedIds.length > 0 ? `${re.queuedIds.length} ${re.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: re.failed.length > 0 ? `${re.failed.length} selected ${re.failed.length === 1 ? "video could" : "videos could"} not be queued. ${re.failed[0].error}` : ""
        });
      } catch (re) {
        N({ busy: !1, error: re.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        K.current.finish(D);
      }
    }
  }
  const ne = t || r === "review" ? la : la.filter((V) => !["reviewState", "shotBoundaries"].includes(V.id)), ce = P === null || P.configured === !1 || P.ready === !1, oe = C.busy || ce, ue = (P == null ? void 0 : P.error) || (P === null ? "Checking Full Scan availability" : P.configured === !1 ? "Configure the analysis service before running Full Scan" : P.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), he = C.busy ? "Queueing scans…" : P === null ? "Checking Full Scan…" : P.configured === !1 ? "Full Scan not configured" : P.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
  return n("div", { className: "w-full space-y-5" }, [
    n(uo, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(Ia, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: ha,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: T,
      totalCount: u.totalCount,
      isLoading: m,
      error: x ? new Error(x) : null,
      onRetry: () => S((V) => V + 1),
      sortOptions: t || r === "review" ? [...sa, { value: "unreviewed_count", label: "Unreviewed count" }] : sa,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: ne,
      objectFilter: s,
      onObjectFilterChange: M,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: k ? O : void 0,
      onSelectAll: k ? se : void 0,
      onSelectNone: k ? le : void 0,
      onInvertSelection: k ? pe : void 0,
      selectionActions: k ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: oe,
          onClick: () => _(),
          title: ue,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, he),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": oe,
            title: ue,
            onClick: (V) => {
              oe && V.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${oe ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(Ca, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([V, D]) => n("button", {
            key: V,
            type: "button",
            disabled: C.busy,
            onClick: (re) => {
              var Ie;
              (Ie = re.currentTarget.closest("details")) == null || Ie.removeAttribute("open"), _(D);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, V)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, C.announcement),
      C.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, C.error) : null,
      !m && u.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !m && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, u.items.map((V) => n(kd, { key: V.videoId, item: V, onNavigate: e, showReviewStates: k, selected: O.has(V.videoId), selectionActive: O.size > 0, onSelect: k ? H : null }))) : null,
      !m && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, u.items.map((V) => n(wd, { key: V.videoId, item: V, onNavigate: e, showReviewStates: k, selected: O.has(V.videoId), selectionActive: O.size > 0, onSelect: k ? H : null }))) : null
    ])
  ]);
}
function va({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = L(null), [s, l] = L(!0), [d, c] = L(""), g = ge(0), u = ge(0), b = ge(e), m = id();
  b.current = e;
  const y = (O) => `/videos/${O}/editor`;
  async function x(O, $, P) {
    const G = await Z(y($), P ? { signal: P.signal } : void 0);
    return _t(O, P ? g.current : u.current, $, b.current) ? (a(G), !0) : !1;
  }
  ye(() => {
    const O = ++g.current, $ = e, P = new AbortController();
    return a(null), l(!0), c(""), x(O, $, P).catch((G) => {
      _t(O, g.current, $, b.current) && G.name !== "AbortError" && c(G.message || "Unable to load the editor.");
    }).finally(() => {
      _t(O, g.current, $, b.current) && l(!1);
    }), () => {
      g.current++, u.current++, P.abort();
    };
  }, [e]);
  function h(O, $) {
    a((P) => (P == null ? void 0 : P.video.id) !== $ ? P : typeof O == "function" ? O(P) : O);
  }
  async function w() {
    const O = e, $ = ++u.current;
    try {
      const P = await Z(y(O));
      return _t($, u.current, O, b.current) ? (a(P), c("A newer canonical segment was loaded. Your stale change was not applied."), P) : null;
    } catch (P) {
      return _t($, u.current, O, b.current) && c(P.message || "Unable to reload the latest segment."), null;
    }
  }
  async function S() {
    const O = e, $ = ++u.current;
    try {
      const P = await Z(y(O));
      return _t($, u.current, O, b.current) ? (a(P), c(""), P) : null;
    } catch (P) {
      return _t($, u.current, O, b.current) && c(P.message || "Unable to reload performer slots."), null;
    }
  }
  return n("div", {
    className: `mx-auto flex w-full flex-col gap-2 ${m ? "lg:overflow-hidden" : "p-3 sm:p-4"}`,
    style: m ? {
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
      n(ts, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(Yd, {
      key: i.video.id,
      detail: i,
      onDetailChange: h,
      onConflict: w,
      onReload: S,
      onSlotsChanged: S,
      splitLayout: m,
      profile: o,
      initialSegmentId: Yo() ? -Yo() : ll(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function pc(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function fc(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function yc(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function bc({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = Xs(o), l = pc(e, t, window.location.pathname), d = fc(e, t, window.location.pathname), c = yc(e, t, window.location.pathname), g = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (nl(g, o) === "videos" && g !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Ur, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(cc, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(ba, { onNavigate: r, profile: o });
    const m = Number(e);
    return Number.isInteger(m) && m > 0 ? n(va, {
      videoId: m,
      onNavigate: r,
      compatibilityMode: !0,
      profile: o
    }) : n(Ur, {
      onNavigate: r,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return n(gc, { onNavigate: r, profile: o });
  const b = Number(e);
  return d ? n(ba, { onNavigate: r, profile: o }) : Number.isInteger(b) && b > 0 ? n(va, {
    videoId: b,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(Ur, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function hc({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = L(null), [a, s] = L("");
  return ye(() => {
    const l = new AbortController();
    return Z("/preferences", { signal: l.signal }).then((d) => i(za(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(bc, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function vc(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function xc(e, t) {
  const r = vc(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const Gc = {
  components: { SegmentStudioPage: hc },
  actionHandlers: { openSegmentStudio: xc }
};
export {
  pr as CLEARED_SEGMENT_SELECTION_ID,
  sa as DISCOVERY_SORT_OPTIONS,
  Et as SEGMENT_STUDIO_CAPABILITIES,
  Xr as SEGMENT_STUDIO_EXTENSION_ID,
  zn as SEGMENT_STUDIO_SHORTCUTS,
  Ss as activeEditorFilterCount,
  Ll as applyDerivationRuleSlotSuggestions,
  Jr as applyFeedbackEditorDelta,
  ta as applySegmentMergeDelta,
  kl as basicSegmentTimelineStyle,
  sl as browseClipEnd,
  Ha as browseEditorHref,
  Vo as buildBrowseRequest,
  nc as buildDerivationRuleGraph,
  xd as buildDiscoverySearchParams,
  is as buildMinuteTimelineTicks,
  ec as buildPerformerSlotOverview,
  gl as buildSegmentQuickSearchEntries,
  Ul as buildSegmentRailRows,
  Kl as buildTimelineRows,
  Cc as buildTimelineTicks,
  cs as calculateCenteredTimelineScroll,
  zr as calculateEditorPanelMaximum,
  ss as calculateMinuteLabelStride,
  $c as calculateMinuteTimelineWidth,
  gs as calculateSwimlaneTitleMaximum,
  us as calculateTimelinePlayheadPosition,
  to as calculateTimelineRatioBounds,
  fs as calculateTimelineRatioFromPointer,
  Tc as calculateVerticalRevealOffset,
  Ht as clampEditorPanelWidth,
  ur as clampSwimlaneTitleWidth,
  Pa as clampTimelineRatio,
  no as clampTimelineRatioForHeight,
  gr as clampTimelineZoom,
  yd as compactProvenanceSummary,
  Zd as createBulkAnalysisCoordinator,
  zs as createQueuedReviewRequest,
  ma as createSegmentAnalysisRequestScope,
  Gc as default,
  hl as downloadFileNameFromContentDisposition,
  ks as dualRangeValueFromPointer,
  _o as duplicateIdentityFromResponse,
  Ws as duplicateOperationKey,
  xs as editorVisibilityIncludingSegment,
  Hl as expandedSwimlanes,
  rl as extensionOwnedSegmentsModeSwitchPrompt,
  Yl as feedbackFrameTimestamps,
  Zl as feedbackResultMatchesAction,
  Ql as feedbackSelectionPlan,
  vs as filterDerivedSegments,
  Lr as filterEditorSegments,
  tc as filterPerformerSlotOverview,
  ml as filterSegmentQuickSearch,
  Dc as filterSegmentStudioShortcuts,
  Vl as findAdjacentSegmentGroupKey,
  Qs as findAdjacentShot,
  Gs as findEditorShortcut,
  Oa as findInitialSegmentSelection,
  as as findNearestSegmentInCurrentSwimlane,
  Ys as findPublishedSelectionIdentity,
  ze as findSegmentByStableIdentity,
  ys as findSegmentFromPlayhead,
  os as findSegmentNearPlayhead,
  Wl as findSwimlaneRangeSelection,
  Vr as findSwimlaneSelection,
  cl as findUniquePerformerSlotAssignment,
  mr as findUnreviewedSelection,
  Rl as focusDialogDefaultButton,
  vr as formatGenderHint,
  Zs as frameStepSeconds,
  qa as generatePerformerSlotAssignmentRecommendations,
  Ed as groupApprovedDraftsForPublishing,
  ul as groupAutoAssignCandidates,
  Xl as groupIncorrectExamplesByTag,
  Fd as groupMaterializationOutputs,
  qt as groupSegmentsIntoSwimlanes,
  zl as groupSelectedSwimlanes,
  co as groupSwimlanesBySegmentGroup,
  dt as handleModalKey,
  gn as hasSegmentStudioCapability,
  ra as hideCollectedFeedbackSegments,
  Ml as historyActionsForTarget,
  lr as incorrectExampleHistoryState,
  ri as indexPerformerSlotsBySegment,
  Pc as initialReviewFilter,
  nd as insertSegmentProjection,
  _t as isCurrentEditorRequest,
  $l as isEditableTarget,
  Fc as isEditorShortcutOwner,
  yc as isSegmentStudioBinRoute,
  fc as isSegmentStudioSegmentsRoute,
  pc as isSegmentStudioSettingsRoute,
  rc as layoutDerivationRuleComponent,
  oc as layoutDerivationRuleComponents,
  rd as mergeSegmentsProjection,
  Ol as multiSelectionActionHint,
  Rs as nextSegmentAfterRemoval,
  Ms as nextUnreviewedAfterRemoval,
  Bt as normalizeCollapsedSegmentGroups,
  ca as normalizeDiscoveryIds,
  pt as normalizeEditorSegmentFilters,
  Ft as normalizeGender,
  Ho as normalizeReviewFilter,
  za as normalizeSegmentStudioFeatureProfile,
  Oc as normalizeSegmentStudioMode,
  qr as normalizeSegmentStudioPublicMode,
  un as parseBrowseSlotFilters,
  ps as parseEditorLayout,
  bs as parseHideDerivedSegmentsPreference,
  hs as parseMergeConfirmationPreference,
  Ua as parsePlaybackShortcutConfig,
  js as parseShortcutBindingOverrides,
  Gr as patchPerformerSlotProjection,
  br as patchSegmentProjection,
  Es as percentageSeekTime,
  dl as performInitialSegmentSeek,
  Ye as performerOptionId,
  fr as performerSlotHistoryState,
  it as performerSlotLabel,
  Fl as performerSlotPresentation,
  Bc as performerSlotStatus,
  lo as performerSlotStatusFromSegmentSlots,
  ni as performerSlotsForSegment,
  wt as provenanceSourceLabel,
  Wa as rankPerformerOptions,
  Jl as reconcileSegmentGroupKey,
  Ts as reconcileSelectedSegmentIds,
  Nd as recyclingBinActionText,
  xl as recyclingBinDeletionPrompt,
  Qa as recyclingBinDeletionSummary,
  ol as recyclingBinModeSwitchPrompt,
  qs as removeQueuedReviewsForSegments,
  Yr as removeSegmentsProjection,
  Yo as requestedOwnedItemId,
  ll as requestedSegmentId,
  Ns as resolveEditorSegmentSelection,
  _s as resolveQueuedReviewRequest,
  Vs as resolveSegmentCreationAction,
  nl as resolveSegmentStudioRoute,
  Bs as resolveSegmentStudioShortcuts,
  ac as resolveSelectedDerivationRule,
  Ds as resolveSelectedSegments,
  Ud as restoreDisabledToolbarActionFocus,
  Jd as restorePublishApprovedFocus,
  Kn as restoreSegmentFieldsProjection,
  li as restoreSegmentsProjection,
  si as revealCollapsedSegmentGroup,
  Xd as runSelectedDiscoveryAnalysis,
  Xa as segmentBadgeStyle,
  hr as segmentGroupHeaderBackground,
  St as segmentGroupKeyForSegment,
  so as segmentHistoryIdentity,
  sr as segmentHistoryState,
  ei as segmentRailItemStyle,
  Lc as segmentStateStyle,
  vc as segmentStudioActionTarget,
  Xs as segmentStudioLegacyMode,
  Sl as segmentTimelineStyle,
  gt as segmentsHistoryState,
  As as selectAllVideoSegmentIds,
  al as selectedBrowseStates,
  ai as selectedSwimlaneMerge,
  di as setBackLinkNavigation,
  El as sharedPerformerSlotShape,
  Dl as sharedTagPerformerSlotShape,
  mn as shortcutAvailableInMode,
  Us as shortcutBindingDisplayText,
  Ac as shortcutBindingFromEvent,
  Mc as shortcutBindingsOverlap,
  Ec as shortcutModesOverlap,
  Fs as shortcutRequiresSingleSegment,
  Ln as shotBoundaryFingerprint,
  Al as shouldAcceptCurrentTagFromEnter,
  Rc as shouldExitShortcutCapture,
  jc as shouldHandleEditorShortcut,
  ua as shouldLoadSegmentAnalysis,
  ia as shouldReloadAfterSegmentMutation,
  Hr as shouldRestoreTransitionSelection,
  pl as shouldShowQuickSearchGroups,
  Ko as splitShortcutCategoriesIntoColumns,
  Pl as suggestDerivationRuleSlotMappings,
  Gn as swimlaneDisplayLabel,
  Cl as swimlaneMarkerTop,
  Nl as swimlaneStripeBackground,
  Js as tagEditorLockedBySave,
  ms as timelineContentStyle,
  Bo as timelinePlayheadHorizontalStyle,
  wl as timelineSegmentWidth,
  ls as timelineTickAlignment,
  ds as timelineTickPosition,
  Kr as timelineTimePercent,
  ql as toggleAllCollapsedSegmentGroups,
  Ks as toggledSelectionReviewState,
  $t as trapModalFocus,
  fl as tryParseJsonResponseText,
  $s as updateAnchoredSegmentSelection,
  Sd as updateDiscoverySelection,
  ws as updateDualRangeValues,
  Is as updateSegmentCollectionSelection,
  Cs as updateSegmentRangeSelection,
  ja as updateSegmentSelection,
  fa as validateDerivationRuleDraft,
  jo as validateSegmentTiming,
  ro as videoPerformerOptions,
  Br as videoPerformerSlotAssignments,
  tl as visibleSegmentStudioSettingsTabs,
  el as visibleSegmentStudioTabs,
  oi as visibleVirtualRows
};
