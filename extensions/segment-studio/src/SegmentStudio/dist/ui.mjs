import oo from "@cove/runtime/react";
import { createPortal as hs } from "@cove/runtime/react-dom";
import { extensionFetch as Aa } from "@cove/runtime/api";
import { formatDuration as vs, EntityReferenceSelector as qn, useExtensionKeyboardBindings as xs, VideoPlayer as Ra, useRegisterExtensionKeyboardActions as Ma, getDefaultFilter as Ea, useListUrlState as Da, ListPage as Oa } from "@cove/runtime/components";
import { ChevronDown as Pa, StepBack as Ss, StepForward as ks, Loader2 as ws } from "@cove/runtime/lucide-react";
const ao = "com.midnightrider.segment-studio", La = "segment-studio.layout.v1", on = "segment-studio.operations.v1", Fa = "segment-studio.collapsed-segment-groups.v1", ja = "segment-studio.playback-shortcuts.v1", Ba = "segment-studio.timing-clipboard.v1", Ga = "segment-studio.hide-derived-segments.v1", Ua = "segment-studio.merge-confirmation.v1", St = ["unreviewed", "approved", "rejected"], Ns = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], Uo = "(min-width: 1024px) and (min-height: 640px)", Ko = "(min-width: 1024px) and (min-height: 900px)", _n = 1e-3, zo = 15, Is = 30, Ka = 12, wt = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, io = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30
}, Ht = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function Ho(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function za(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? hr(e, null, 1, !0) ?? r[0] ?? null;
}
function hr(e, t, r, o = !1) {
  var g;
  const i = e.findIndex((u) => u.markers.some((f) => f.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const u = e.flatMap((f) => f.markers.map((m) => m.segment)).filter((f) => f.reviewState === "unreviewed");
    return r < 0 ? u.at(-1) ?? null : u[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((u) => u.segment.id === t);
  if (!o)
    return ((g = (r < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((f) => f.segment.reviewState === "unreviewed")) == null ? void 0 : g.segment) ?? null;
  const l = e.flatMap((u) => u.markers.map((f) => f.segment)), d = l.findIndex((u) => u.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((u) => u.reviewState === "unreviewed") ?? null;
}
function Cs(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((g, u) => g.markers.filter(({ segment: f }) => {
    const m = Number(f.startSec), p = f.endSec == null ? m + Is : Number(f.endSec);
    return Number.isFinite(m) && Number.isFinite(p) && p >= m && m <= i + zo + _n && p >= i - zo - _n;
  }).map(({ segment: f }) => ({ segment: f, laneIndex: u }))).sort((g, u) => g.laneIndex - u.laneIndex || Math.abs(g.segment.startSec - i) - Math.abs(u.segment.startSec - i) || g.segment.id - u.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((g) => g.markers.some((u) => u.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((g) => g.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((g) => g.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((g) => g.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function $s(e, t, r) {
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
function vr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function lu(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function Ts(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function du(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function As(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function Rs(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Ms(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function Es(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Jr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function Ds(e, t, r = 10) {
  const o = Jr(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function qo(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function Os(e, t = Ka) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function Ha(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : wt.timelineRatio;
}
function Yr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function tn(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? wt.detailWidth : Math.min(Yr(t, 0), Math.max(240, e));
}
function fr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? wt.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function Ps(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function so(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: wt.timelineRatio, maximum: wt.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function lo(e, t) {
  const r = Ha(e);
  if (!(t > 0)) return r;
  const o = so(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function Ls(e) {
  if (!e) return { ...wt };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? Ha(r) : wt.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: tn(t == null ? void 0 : t.detailWidth),
      markerRailWidth: tn(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: fr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...wt };
  }
}
function Fs(e, t, r) {
  return r > 0 ? lo((t + r - e) / r, r) : wt.timelineRatio;
}
function cu(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function js(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, g) => c.startSec - g.startSec || c.id - g.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= _n ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function en(e, t, r, o) {
  return e === t && r === o;
}
const xr = "__segment-studio-cleared-selection__";
function Bs(e) {
  return e === "true";
}
function Gs(e) {
  return e !== "false";
}
function qa() {
  try {
    return Gs(window.localStorage.getItem(Ua));
  } catch {
    return !0;
  }
}
function _a(e) {
  try {
    window.localStorage.setItem(Ua, String(!!e));
  } catch {
  }
}
function Us(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function Tt(e = {}) {
  const t = St.filter((g) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(g) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (g, u) => {
    const f = Number(g);
    return Number.isFinite(f) ? Math.min(1, Math.max(0, f)) : u;
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
  var c, g;
  const a = Tt(r), s = a.performerId == null ? null : new Set((t || []).filter((u) => Number(u.performerId) === a.performerId).map((u) => u.segmentId)), l = new Set((i || []).flatMap((u) => u.tags || []).map((u) => Number(u.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((g = (c = (i || []).find((u) => Number(u.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : g.map((u) => Number(u.tagId))) || []);
  return Us(e || [], o).filter((u) => {
    if (u.reviewState != null && !a.reviewStates.includes(u.reviewState) || s && !s.has(u.id) || a.tagId != null && Number(u.tagId) !== a.tagId || d && !d.has(Number(u.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(u.tagId)) || a.sourceKey != null && u.sourceKey !== a.sourceKey) return !1;
    const f = Number(u.confidence);
    return u.confidence == null || !Number.isFinite(f) ? a.includeUnscored : f >= a.confidenceMin && f <= a.confidenceMax;
  });
}
function Wa(e, t, r, o = !1, i = []) {
  var l;
  const a = Tt(r);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = Tt({
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
    filters: Tt(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function Ks(e, t = !1) {
  const r = Tt(e);
  return +(r.reviewStates.length !== St.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function zs(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function Hs(e, t, r, o) {
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
function qs(e, t, r = null) {
  return t === xr ? null : za(
    e,
    t ?? r
  );
}
function Va(e, t, r, o = !1) {
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
function _s(e, t, r) {
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
function Ws(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return Va(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function Vs(e, t, r = null, o = !1) {
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
      ...Ws(u, s, t, g, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: u
    };
  }
  const d = Va(i, a, t, o);
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
function Js(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function Ys(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function _o(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function Wo(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => _o(t, o) - _o(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function Qs(e, t, r) {
  var c, g;
  const o = e || [], i = new Set(t || []), a = o.findIndex((u) => (u.markers || []).some(({ segment: f }) => f.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: u }) => u.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const u of o) {
      const f = (u.markers || []).find(({ segment: m }) => !i.has(m.id));
      if (f) return f.segment;
    }
    return null;
  }
  const l = Wo(
    o[a].markers,
    s,
    i
  );
  if (l) return l;
  const d = (g = o.map((u, f) => ({ lane: u, index: f })).filter(({ lane: u }) => (u.markers || []).some(({ segment: f }) => !i.has(f.id))).sort((u, f) => Math.abs(u.index - a) - Math.abs(f.index - a) || +(u.index < a) - +(f.index < a) || u.index - f.index)[0]) == null ? void 0 : g.lane;
  return Wo(d == null ? void 0 : d.markers, s, i);
}
function Zs(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function Xs(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function Vo(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function el() {
  try {
    return Bs(window.localStorage.getItem(Ga));
  } catch {
    return !1;
  }
}
function tl(e) {
  try {
    window.localStorage.setItem(Ga, String(!!e));
  } catch {
  }
}
const Yn = [
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
], nl = /* @__PURE__ */ new Set([
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
function rl(e) {
  return nl.has(e);
}
function Ja(e) {
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
function ol(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Yn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(Ja).filter(Boolean)]));
  } catch {
    return {};
  }
}
function al(e = {}) {
  const t = ol(e);
  return Yn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function Jo(e, t = 2) {
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
function uu(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : Ja({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function mu(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function Qr(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function Yo(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function gu(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = Yo(e.code, t.key), a = Yo(t.code, e.key);
  if (!r && !o && !i && !a) return !1;
  const s = i ? t.key : e.key, l = i ? e.code : a ? t.code : o ? e.code : e.code || t.code;
  for (const d of [!1, !0])
    for (const c of [!1, !0])
      for (const g of [!1, !0])
        for (const u of [!1, !0]) {
          const f = {
            key: s,
            code: l,
            ctrlKey: d,
            metaKey: c,
            altKey: g,
            shiftKey: u
          };
          if (Qr(f, e) && Qr(f, t)) return !0;
        }
  return !1;
}
function An(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function pu(e, t) {
  return [!1, !0].some((r) => An(e, r) && An(t, r));
}
function il(e, t = !1, r = {}) {
  return al(r).find((o) => An(o, t) && o.bindings.some((i) => Qr(e, i))) || null;
}
function Ya(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function sl(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Ya).join(" / ") : "Unassigned";
}
function fu(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, sl(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function yu(e) {
  return e === "review" ? "review" : "editor";
}
function Je(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function ll(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function dl(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function cl(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => Je(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: Je(t, e.activeIdentity) || r[0]
  };
}
function ul(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function bu(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => ul(o, i))));
}
function Qo(e, t) {
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
function ml(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function gl(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function pl(e, t, r) {
  return e != null && (r == null || t !== r);
}
function fl(e, t, r, o = null) {
  if (r === t.tagId) return null;
  const i = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: r,
    tagName: o || ((i == null ? void 0 : i.tagId) === r ? i.tagName : null)
  };
}
function yl({ tagEditing: e, selectedSegmentIds: t, activeSegmentId: r }, o) {
  return !(e && r === o && (t == null ? void 0 : t.length) === 1 && t[0] === o);
}
function Zr(e, t) {
  return e === t;
}
function bl(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function hl(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - _n).at(-1) || null : o.find((i) => i.startSec > t + _n) || null;
}
function zn(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function Zo(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: St.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function hu(e, t = null, r = !1) {
  const o = Zo(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function $n(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function Qa(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: $n(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: $n(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: $n(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round($n(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round($n(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round($n(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...io };
  }
}
function vl(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function Za() {
  try {
    return Qa(window.localStorage.getItem(ja));
  } catch {
    return { ...io };
  }
}
function Xo(e) {
  const t = Qa(JSON.stringify(e));
  try {
    window.localStorage.setItem(ja, JSON.stringify(t));
  } catch {
  }
  return t;
}
const qt = Object.freeze({
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
function Xr(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function Xa(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? Xr(e.requestedMode) : "basic",
    effectiveMode: i ? Xr(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function Rn(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function xl(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Sl(e) {
  const t = [];
  return Rn(e, qt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), Rn(e, qt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function kl(e) {
  return [
    ["general", "General", qt.settingsGeneral],
    ["shortcuts", "Shortcuts", qt.settingsShortcuts],
    ["performer-slots", "Performer slots", qt.settingsPerformerSlots],
    ["derivation", "Derivation", qt.settingsDerivation]
  ].filter(([, , r]) => Rn(e, r)).map(([r, o]) => [r, o]);
}
function wl(e, t) {
  return e === "segments" && !Rn(
    t,
    qt.navigationSegmentInventory
  ) || e === "bin" && !Rn(
    t,
    qt.recyclingBinView
  ) ? "videos" : e;
}
function Nl(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Il(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const Hr = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, ea = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: St.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function Cl(e) {
  const t = String(e || "").split(",").filter((r) => St.includes(r));
  return t.length === 0 ? [...St] : [...new Set(t)];
}
function Tn(e) {
  return ei(e).values;
}
function ei(e) {
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
function qr(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function ta(e, t) {
  var l;
  const r = na(t.activitiesCriterion, t.activityId), o = na(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = ei(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: $l(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function na(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function $l(e, t) {
  return St.includes(e == null ? void 0 : e.value) ? [e.value] : Cl(t);
}
function ti(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Tl(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Al(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function ra(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Rl(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function at(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function co(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function _r(e, t) {
  const r = new Set(co(t).map((o) => String(at(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function Wt(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function oa(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(Wt).sort().join(",")}`;
}
function ni(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((m) => String(m.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((m) => {
    var p;
    return !((p = m.genderHints) != null && p.length);
  }) && e.length === t.length && !i) {
    const m = [...e].sort((h, y) => String(h.slotDefinitionId).localeCompare(String(y.slotDefinitionId))), p = [...t].sort((h, y) => String(h.name).localeCompare(String(y.name)) || Number(at(h)) - Number(at(y)));
    return [{
      assignments: Object.fromEntries(m.map((h, y) => [String(h.slotDefinitionId), String(at(p[y]))])),
      description: p.map((h) => h.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((m) => t.map((p, h) => ({ performer: p, index: h })).filter(({ performer: p }) => {
    var h;
    return !((h = m.genderHints) != null && h.length) || m.genderHints.some((y) => Wt(y) === Wt(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), g = i ? c.filter((m) => m.length > 0).length : aa(c, t.length);
  if (g === 0) return [];
  const u = new Map(t.map((m, p) => [String(at(m)), p]));
  function f(m, p, h) {
    if (s.length >= a) return;
    const y = c.slice(m), w = i ? y.filter((I) => I.length > 0).length : aa(y.map((I) => I.filter((M) => !p.has(String(at(t[M]))))), t.length);
    if (h + w < g) return;
    if (m === e.length) {
      if (h !== g) return;
      const I = Object.fromEntries(d.map(({ slot: N, performer: S }) => [String(N.slotDefinitionId), S ? String(at(S)) : ""])), M = o.length === 0 ? Object.values(I).sort().join(",") : [...new Set(e.map((N) => String(N.label || "")))].map((N) => `${N}:${d.filter(({ slot: S }) => String(S.label || "") === N).map(({ performer: S }) => S ? String(at(S)) : "").sort().join(",")}`).join("|");
      !l.has(M) && s.length < a && (l.add(M), s.push({
        assignments: I,
        description: d.map(({ slot: N, performer: S }) => o.length ? `${N.label}: ${(S == null ? void 0 : S.name) || "Unassigned"}` : (S == null ? void 0 : S.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const k = e[m], E = [...d].reverse().find(({ slot: I }) => oa(I) === oa(k)), Q = E ? u.get(String(at(E.performer))) : -1;
    for (const I of c[m]) {
      const M = t[I], N = at(M);
      if (!(I < Q) && !(N == null || !i && p.has(String(N))) && (d.push({ slot: k, performer: M }), i || p.add(String(N)), f(m + 1, p, h + 1), i || p.delete(String(N)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: k, performer: null }), f(m + 1, p, h), d.pop();
  }
  return f(0, /* @__PURE__ */ new Set(), 0), s;
}
function aa(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Ml(e, t) {
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
      const u = [...new Set(e.map((f) => f.label || ""))].map((f) => `${f}:${a.filter((m) => (m.slot.label || "") === f).map((m) => m.performer.performerId).sort((m, p) => m - p).join(",")}`).join("|");
      i.has(u) || i.set(u, [...a]);
      return;
    }
    const c = e[l];
    for (const u of t)
      !o && d.has(u.performerId) || (g = c.genderHints) != null && g.length && !c.genderHints.some((f) => Wt(f) === Wt(u.gender)) || (a.push({ slot: c, performer: u }), o || d.add(u.performerId), s(l + 1, d), o || d.delete(u.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function El(e) {
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
function Dl(e, t, r = 20) {
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
function Ol(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function Pl(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function ri(e, t, r) {
  const o = at, i = new Set((t || []).map(o)), a = new Set((r || []).map(Wt));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const u = Wt(l.gender || l.genderIdentity), f = Wt(d.gender || d.genderIdentity), m = l.matchesGenderHint ?? a.has(u);
    return (d.matchesGenderHint ?? a.has(f)) - m || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: ye, useId: oi, useLayoutEffect: Ll, useMemo: He, useReducer: Fl, useRef: pe, useState: L, useSyncExternalStore: jl } = oo, n = oo.createElement, ai = "/api/plugins/segment-studio";
function Fe(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(on) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = eo();
    return t[e] = r, window.localStorage.setItem(on, JSON.stringify(t)), r;
  } catch {
    return eo();
  }
}
function Ge(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(on) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(on, JSON.stringify(t));
  } catch {
  }
}
function uo(e) {
  try {
    return JSON.parse(window.localStorage.getItem(on) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function mo(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(on) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(on, JSON.stringify(t));
  } catch {
  }
}
function Bl(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function Gl(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function ee(e, t, r = 0) {
  var d;
  const o = await Aa(`${ai}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Bl(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await Gl(250 * (r + 1), t == null ? void 0 : t.signal), ee(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function Ul(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${ai}${e}`, o = await Aa(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: Kl(
      o.headers.get("Content-Disposition")
    )
  };
}
function Kl(e, t = "segment-studio-ai-feedback.zip") {
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
function Me(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function eo() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function ii(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function zl(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function si(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function Hl(e, t) {
  const { sceneCount: r, segmentCount: o } = si(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function li(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = si(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(Hl(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await ee("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Fe(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return Ge(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function ia({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const Dt = {
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
function vu(e, t) {
  return {
    ...(Dt[e] || Dt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function di(e) {
  return { ...(Dt[e] || Dt.unreviewed).badge };
}
function ci(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const ui = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function ql(e, t, r = "not-applicable", o = !1) {
  const i = Dt[e] || Dt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function _l(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Wl(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function Vl(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function Jl(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function wr(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function Yl(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function an({ state: e, includeLabel: t = !0 }) {
  const r = Dt[e] || Dt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: di(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function Ql(e, t = null) {
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
function xu(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function Zl(e, t = document) {
  return !(e.defaultPrevented || Ql(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function Su(e, t = document, r = !1, o = {}) {
  return Zl(e, t) ? il(e, r, o) != null : !1;
}
function Nt(e, { onCancel: t, onConfirm: r } = {}) {
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
function Xl(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function ed({ confirm: e, cancel: t, confirmReady: r }) {
  const o = r && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function go({ confirmRef: e, cancelRef: t, confirmReady: r }) {
  ye(() => {
    const o = requestAnimationFrame(() => ed({
      confirm: e.current,
      cancel: t == null ? void 0 : t.current,
      confirmReady: r
    }));
    return () => cancelAnimationFrame(o);
  }, [r]);
}
function Ut(e) {
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
function td(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? i.filter((a) => a.sequence > o && a.sequence <= r).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > r && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function po(e, t = !0) {
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
function cr(e, t = !0) {
  return {
    type: "segment",
    identity: po(e, t),
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
function $t(e, t = !0) {
  return {
    type: "segments",
    segments: (e || []).map((r) => ({
      identity: po(r, t),
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
function ur(e, t) {
  return {
    type: "incorrectExamples",
    collected: t,
    entries: (e || []).map(({ segment: r, result: o, example: i }) => ({
      exampleId: (o == null ? void 0 : o.exampleId) ?? (i == null ? void 0 : i.id) ?? null,
      originalIdentity: po(r),
      collectedIdentity: {
        itemId: (o == null ? void 0 : o.itemId) ?? (i == null ? void 0 : i.itemId) ?? null,
        nativeSegmentId: (o == null ? void 0 : o.nativeSegmentId) ?? null,
        published: (o == null ? void 0 : o.nativeSegmentId) != null,
        revision: (o == null ? void 0 : o.revision) ?? null
      }
    }))
  };
}
function Sr(e) {
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
function mi(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function gi(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = t.get(r.segmentId);
    o ? o.push(r) : t.set(r.segmentId, [r]);
  }
  for (const r of t.values())
    r.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function fo(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function nd(e, t) {
  const r = (t || []).map((i) => mi(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: kt(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function rd(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : nd(e, t);
}
function od({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function ku(e, t) {
  return fo(mi(e, t));
}
function kt(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function ad(e, t) {
  const r = (d) => kt(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
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
    const u = [...c].sort(o), f = [...g].sort(o);
    u.forEach((m, p) => l.push({
      sourceSlotDefinitionId: m.id,
      derivedSlotDefinitionId: f[p].id
    }));
  }
  return l;
}
function id(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = ad(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function sd(e) {
  const t = kt(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(Nr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function Nr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function kr(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function sa(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((g) => g.end <= s && g.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: kr(o),
    trackCount: Math.max(1, t.length)
  };
}
function ld(e) {
  const t = e.map(kt), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function dd(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], g = d.length > 0 && d.every((u) => Number(u.performerId) > 0) ? d.map((u) => `${u.slotDefinitionId}:${Number(u.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: g };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [sa({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = ld(l.slots), g = l.slots.filter((h) => !a.has(String(h.slotDefinitionId))), u = o.length === 1 ? l.slots : g, f = u.map((h) => `${c.get(String(h.slotDefinitionId))} · ${h.performerName || `Performer ${h.performerId}`}`).join(" · "), m = [...new Map(u.map((h) => [
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
          performerLabel: f,
          performers: m,
          performerAssignments: p,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(sa);
}
function nn(e, t = [], r = []) {
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => dd(s, a));
}
function yo(e) {
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
    for (const s of St)
      a.counts[s] += Number((r = o.counts) == null ? void 0 : r[s]) || 0;
  }
  return t;
}
const cd = {
  group: 38,
  lane: 33,
  segment: 41
};
function ud(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = cd[s.kind];
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
function pi(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function md(e, t = [], r = !0) {
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
function gd(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: kr(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return yo(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: kr(a)
    };
  });
}
function fi(e, { nativeOnly: t = !1 } = {}) {
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
function la(e, t) {
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
function Jt(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function Wn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function pd(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var r;
    return (r = t[0]) == null ? void 0 : r.toUpperCase();
  }).join("") || "?";
}
function Vn({ performer: e, compact: t = !1, tooltip: r = null }) {
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
    }, o ? pd(e.name) : "—"),
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
function yi({ assignments: e, className: t = "" }) {
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
      n(Vn, {
        key: `${r.key}:avatar`,
        performer: r.performer
      })
    ];
  }));
}
function Ir({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = pe(null), i = `performer-slots-${oi()}`, [a, s] = L(null);
  function l() {
    var m;
    const c = (m = o.current) == null ? void 0 : m.getBoundingClientRect();
    if (!c) return;
    const g = Math.max(0, Math.min(256, window.innerWidth - 16)), u = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), f = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - g - 8, c.right - g)),
      top: f >= u + 8 ? c.bottom + 4 : Math.max(8, c.top - u - 4),
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
    ...e.slice(0, 3).map((c) => n(Vn, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? hs(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(yi, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : n("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => n(Vn, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function fd(e, t) {
  const r = new Set(Jt(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function bi(e, t) {
  return t ? Jt(e).filter((r) => r !== t) : Jt(e);
}
function yd(e, t) {
  const r = Jt(t), o = new Set(Jt(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function Et(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function da(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), g = Number.isFinite(c) && c >= d ? c : d, u = d <= o && g >= o, f = u ? 0 : Math.min(Math.abs(o - d), Math.abs(o - g));
    return { contains: u, distance: f, duration: g - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function to(e, t, r, o = null) {
  var g, u, f, m, p, h;
  const i = e.findIndex((y) => y.markers.some((w) => w.segment.id === t));
  if (i < 0) {
    const y = [...((g = e[0]) == null ? void 0 : g.markers) || []];
    return o != null && Number.isFinite(Number(o)) && y.sort((w, k) => da(w, k, o)), ((u = y[0]) == null ? void 0 : u.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((y) => y.segment.id === t);
  if (r === "left" || r === "right") {
    const y = r === "left" ? -1 : 1, w = Math.min(a.markers.length - 1, Math.max(0, s + y));
    return ((f = a.markers[w]) == null ? void 0 : f.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((m = a.markers[s]) == null ? void 0 : m.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((p = a.markers[s]) == null ? void 0 : p.segment) ?? null : ((h = [...e[l].markers].sort(c ? (y, w) => da(y, w, Number(o)) : (y, w) => Math.abs(y.segment.startSec - d) - Math.abs(w.segment.startSec - d) || y.segment.startSec - w.segment.startSec || y.segment.id - w.segment.id)[0]) == null ? void 0 : h.segment) ?? null;
}
function bd(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = to([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function hd(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function vd(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function xd(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [ma(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => ma(Math.min(s, r + l))))];
}
function Sd(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function kd(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function yr(e, t) {
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
function ca(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function wd(e) {
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
async function Nd(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await ua(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], g = xd(
        d.startSec,
        d.endSec
      );
      for (const [u, f] of g.entries()) {
        Math.abs(r.currentTime - f) > 5e-4 && (r.currentTime = f, await ua(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const m = await Id(o), p = `example-${l + 1}-frame-${u + 1}`;
        c.push({ fieldName: p, timestampSec: f }), s.push({
          fieldName: p,
          file: new File(
            [m],
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
function ua(e, t) {
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
function Id(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function ma(e) {
  return Math.round(e * 1e3) / 1e3;
}
function ga(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Cd(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function $d(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function no(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function hi(e, t) {
  const r = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...r.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Wr(e, t, r, o) {
  const i = (r || []).map((d) => ({ ...d, segmentId: t })), a = e.performerSlots || [], s = a.findIndex((d) => d.segmentId === t), l = a.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...i), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function Td(e, t) {
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
function Mn(e, t) {
  return !e || !t ? !1 : e.itemId != null && e.itemId === t.itemId || e.nativeSegmentId != null && e.nativeSegmentId === t.nativeSegmentId ? !0 : e.id != null && e.id === t.id;
}
function vi(e, t) {
  return (e || []).some((r) => (t || []).some((o) => Mn(r, o)));
}
function rn(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function xi(e, t) {
  return (e || []).find((r) => Mn(t, r)) || null;
}
function Si(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Ad(e, t) {
  var r;
  return ((r = e.running) == null ? void 0 : r.kind) === t;
}
function wu(e) {
  return e.running != null || e.queued.length > 0;
}
const pa = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
function mr(e) {
  return Object.freeze({
    id: e.id,
    kind: e.kind,
    lockId: e.lockId,
    targets: e.targets,
    exclusive: e.exclusive,
    meta: e.meta
  });
}
function Rd({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let r = 1, o = null, i = [], a = null, s = !1, l = pa;
  const d = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Set();
  let g = [];
  function u() {
    l = o == null && i.length === 0 && a == null ? pa : Object.freeze({
      running: o ? mr(o) : null,
      queued: Object.freeze(i.map(mr)),
      lastFailure: a
    });
    for (const I of [...c]) I();
    if (o == null && i.length === 0) {
      const I = g;
      g = [];
      for (const M of I) M();
    }
  }
  function f(I, M) {
    d.set(I.id, M.status), I.resolve(M);
  }
  function m(I) {
    if (I.dependsOn == null) return "met";
    const M = d.get(I.dependsOn);
    return M === "fulfilled" ? "met" : M != null ? "failed" : "pending";
  }
  function p(I) {
    o = I;
    const M = { ...e(), taskId: I.id, targets: I.targets };
    M.resolveTargets = () => I.targets.map((S) => xi(M.segments, S)).filter(Boolean), u();
    let N;
    try {
      N = I.run(M);
    } catch (S) {
      N = Promise.reject(S);
    }
    Promise.resolve(N).then(
      (S) => h(I, { status: "fulfilled", value: S }),
      (S) => h(I, { status: "rejected", error: S })
    );
  }
  function h(I, M) {
    f(I, M), !s && (o = null, M.status === "rejected" && (a = Object.freeze({ id: I.id, kind: I.kind, error: M.error })), u(), t && y());
  }
  function y() {
    if (s || o != null) return;
    let I = !1;
    for (let M = 0; M < i.length; M += 1) {
      const N = i[M], S = m(N);
      if (S === "failed") {
        i = i.filter(($) => $ !== N), f(N, { status: "dropped", reason: "dependency-failed" }), I = !0, M -= 1;
        continue;
      }
      if (S !== "pending" && !(N.exclusive && M > 0) && !i.slice(0, M).some(($) => vi($.targets, N.targets)) && !(N.ready && !N.ready(e(), mr(N)))) {
        i = i.filter(($) => $ !== N), p(N);
        return;
      }
    }
    I && u();
  }
  function w(I) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((A) => A.exclusive) || o != null && I.whenBusy !== "enqueue") return null;
    let N;
    const S = new Promise((A) => {
      N = A;
    }), $ = {
      id: r++,
      kind: I.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: I.lockId ?? -1,
      targets: Object.freeze([...I.targets || []]),
      exclusive: I.exclusive === !0,
      dependsOn: I.dependsOn ?? null,
      ready: I.ready || null,
      meta: I.meta ?? null,
      run: I.run,
      resolve: N
    };
    return i = [...i, $], u(), y(), { id: $.id, done: S };
  }
  function k(I = {}) {
    let M = null;
    const N = w({
      ...I,
      whenBusy: "reject",
      run: () => new Promise(($) => {
        M = $;
      })
    });
    if (!N) return null;
    if (M == null)
      return Q(($) => $.id === N.id), null;
    let S = !1;
    return () => {
      S || (S = !0, M());
    };
  }
  function E(I, M) {
    let N = !1;
    for (const S of i)
      S.targets.some(($) => $.id === I && $.itemId == null && $.nativeSegmentId == null) && (S.targets = Object.freeze(S.targets.map(($) => $.id === I ? { ...M } : $)), N = !0);
    return N && u(), N;
  }
  function Q(I) {
    const M = i.filter((N) => I(mr(N)));
    if (M.length === 0) return 0;
    i = i.filter((N) => !M.includes(N));
    for (const N of M) f(N, { status: "cancelled" });
    return u(), y(), M.length;
  }
  return {
    enqueue: w,
    acquire: k,
    cancel: Q,
    retarget: E,
    poke: y,
    subscribe(I) {
      return c.add(I), () => c.delete(I);
    },
    getSnapshot: () => l,
    whenIdle() {
      return o == null && i.length === 0 ? Promise.resolve() : new Promise((I) => g.push(I));
    },
    dispose() {
      if (s) return;
      const I = i;
      i = [], s = !0;
      for (const N of I) f(N, { status: "cancelled" });
      c.clear();
      const M = g;
      g = [];
      for (const N of M) N();
    }
  };
}
let Md = 1;
function Jn() {
  return `pending-${Md++}`;
}
function Ed(e) {
  return e.sort((t, r) => t.startSec - r.startSec || t.id - r.id);
}
function br(e, t) {
  return (t || []).some((r) => Mn(r, e));
}
function Dd(e, t) {
  return [...e || [], {
    id: t.id ?? Jn(),
    taskId: t.taskId ?? null,
    op: t.op,
    targets: t.targets || (t.segment ? [{ id: t.segment.id }] : []),
    values: t.values || null,
    segment: t.segment || null,
    meta: t.meta || null,
    settled: !1
  }];
}
function ki(e, t) {
  return t && (e || []).find((r) => {
    var o;
    return ((o = r.meta) == null ? void 0 : o.kind) === "held-tag" && !r.settled && br(t, r.targets);
  }) || null;
}
function Od(e) {
  return (e || []).filter((t) => t.op === "insert" && !t.settled).map((t) => t.segment);
}
function wi(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function Pd(e, t) {
  const r = (e || []).filter((o) => !wi(o, t));
  return r.length === (e || []).length ? e : r;
}
function Ld(e, t) {
  let r = !1;
  const o = (e || []).map((i) => i.settled || !wi(i, t) ? i : (r = !0, { ...i, settled: !0, settledDetail: null }));
  return r ? o : e;
}
function Fd(e, t, r) {
  let o = !1;
  const i = (e || []).map((a) => a.targets.some((s) => s.id === t && s.itemId == null && s.nativeSegmentId == null) ? (o = !0, {
    ...a,
    targets: a.targets.map((s) => s.id === t ? { ...r } : s)
  }) : a);
  return o ? i : e;
}
function jd(e, t) {
  if (!t || t.length === 0) return e;
  let r = [...e || []];
  for (const o of t)
    if (o.op === "insert")
      r.some((i) => Mn(o.segment, i)) || r.push(o.segment);
    else if (o.op === "patch")
      r = r.map((i) => br(i, o.targets) ? { ...i, ...o.values } : i);
    else if (o.op === "remove")
      r = r.filter((i) => !br(i, o.targets));
    else if (o.op === "merge") {
      const [i, ...a] = o.targets;
      r = r.filter((s) => !br(s, a)).map((s) => Mn(i, s) ? { ...s, ...o.values } : s);
    }
  return Ed(r);
}
function Ni(e, t) {
  if (!e || e.length === 0) return e;
  const r = [
    ...(t == null ? void 0 : t.segments) || [],
    ...e.filter((a) => a.op === "insert" && !a.settled).map((a) => a.segment)
  ];
  let o = !1;
  const i = [];
  for (const a of e) {
    if (a.op !== "insert" && !a.targets.some((s) => r.some((l) => Mn(s, l)))) {
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
function Bd(e, t) {
  switch (t.type) {
    case "add":
      return Dd(e, t.entry);
    case "discard":
      return Pd(e, t.key);
    case "settle":
      return Ld(e, t.key);
    case "retarget":
      return Fd(e, t.temporaryId, t.identity);
    case "prune":
      return Ni(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
function fa(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function Gd(e) {
  const { acquireSaveLock: t, compatibilityMode: r, dispatchPendingChanges: o, enqueueSave: i, pendingChanges: a, retargetSaveTasks: s, currentTime: l, detail: d, editorFilters: c, endInput: g, hideDerivedSegments: u, historyRef: f, mediaDuration: m, onConflict: p, onDetailChange: h, onReload: y, optimisticSegmentIdRef: w, pendingDuplicateRef: k, pendingFirstSegmentStartSecRef: E, pendingTagEditSegmentIdRef: Q, replaceSegmentSelection: I, savingSegmentId: M, segments: N, selectedSegment: S, selectedSegmentIdRef: $, selectedSegments: A, selectionAnchorIdRef: z, selectionRangeBaseIdsRef: ie, setCreatingSegmentId: U, setEditorFilters: T, setFirstSegmentTagOpen: R, setHideDerivedSegments: q, setHistory: re, setHistoryOpen: ae, setPublishApprovedError: xe, setSaveMessage: _, setSelectedSegmentGroupKey: W, setSelectedSegmentId: de, setSelectedSegmentIds: Y, setTagEditing: fe, startInput: he, tagEditingRef: ve, timelineDuration: ne, video: me } = e;
  function ce(j) {
    f.current = j || Ht, re(f.current);
  }
  async function Z(j, G, J, B, H = null) {
    var F;
    try {
      const V = await ee(`/videos/${me.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: f.current.revision,
          kind: j,
          label: G,
          beforeState: J,
          afterState: B,
          receiptId: H
        })
      });
      return ce(V), !0;
    } catch (V) {
      return V.status === 409 && ((F = V.payload) != null && F.current) && ce(V.payload.current), _("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function te(j, G, J = !0, B = null, H = !1, F = G, V = !0) {
    if (!j || M != null) return null;
    const Te = t("segment", j.id);
    if (!Te) return null;
    try {
      return await K(j, G, {
        recordHistory: J,
        historyLabel: B,
        optimisticValues: H ? F : null,
        restoreSelectionOnFailure: V
      });
    } finally {
      Te();
    }
  }
  async function K(j, G, {
    recordHistory: J = !0,
    historyLabel: B = null,
    optimisticValues: H = null,
    pendingChangeId: F = null,
    restoreSelectionOnFailure: V = !0,
    onReload: Te = y,
    onConflict: je = p
  } = {}) {
    var dt;
    const Ie = A.map((Xe) => Xe.id), Ue = $.current, Ke = J && !r ? crypto.randomUUID() : null;
    _(J ? "Saving directly to Cove…" : "Restoring history…");
    const Oe = F ?? (H ? Jn() : null);
    H && !F && o({
      type: "add",
      entry: { id: Oe, op: "patch", targets: [rn(j)], values: H }
    });
    const Ye = () => {
      Oe && o({ type: "settle", key: Oe });
    };
    try {
      if (r && j.nativeSegmentId == null && j.itemId != null) {
        const nt = `draft-update:${me.id}:${j.itemId}:${j.revision}:${G.tagId}:${G.startSec}:${G.endSec ?? "open"}:${G.reviewState ?? j.reviewState}`, st = await ee(`/videos/${me.id}/drafts/${j.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(nt),
            expectedRevision: j.revision,
            startSec: G.startSec,
            endSec: G.endSec,
            tagId: G.tagId,
            reviewState: G.reviewState
          })
        });
        Ge(nt);
        const et = {
          ...j,
          ...st.draft,
          id: j.id,
          itemId: j.itemId
        };
        return J && await Z(
          "segment.update",
          B || "Changed segment",
          cr(j, r),
          cr(
            et,
            r
          )
        ), fa(j, G, r) ? await Te() : h((X) => ({
          ...X,
          approvedSetVersion: st.approvedSetVersion || X.approvedSetVersion,
          segments: (X.segments || []).map((oe) => oe.id === j.id ? et : oe).sort((oe, Ne) => oe.startSec - Ne.startSec || oe.id - Ne.id)
        }), me.id), Ye(), _(((dt = st.draft) == null ? void 0 : dt.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), et;
      }
      const Xe = await ee(`/videos/${me.id}/segments/${j.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...G,
          expectedUpdatedAt: j.updatedAt,
          historyReceiptId: Ke
        })
      }), ct = {
        ...j,
        ...Xe,
        reviewState: G.reviewState ?? j.reviewState
      };
      return fa(j, G, r) ? await Te() : h((nt) => ({
        ...nt,
        segments: (nt.segments || []).map((st) => st.id === j.id ? ct : st).sort((st, et) => st.startSec - et.startSec || st.id - et.id)
      }), me.id), Ye(), J && await Z(
        "segment.update",
        B || "Changed segment",
        cr(j, r),
        cr(
          ct,
          r
        ),
        Ke
      ), _(J ? "Saved to Cove" : "History restored"), ct;
    } catch (Xe) {
      return Oe && o({ type: "discard", key: Oe }), Oe && V && (Y(Ie), de(Ue), z.current = Ue, ie.current = []), Xe.status === 409 ? (_("Conflict — loading the latest segment…"), await je()) : _(Xe.message || "Unable to save the segment."), null;
    }
  }
  async function se() {
    if (!r) return !1;
    const j = N.filter((B) => !B.published && B.reviewState === "approved").length;
    if (j === 0 || M != null) return !1;
    const G = `complete-review:${me.id}:${d.approvedSetVersion}`, J = t("publish", -1);
    if (!J) return !1;
    xe(""), _(`Publishing ${j} Approved draft${j === 1 ? "" : "s"}…`);
    try {
      const B = await ee(`/videos/${me.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(G),
          expectedApprovedSetVersion: d.approvedSetVersion
        })
      });
      Ge(G), ce(Ht), ae(!1);
      const H = await y(), F = bl(
        N,
        $.current,
        B.published
      ), V = F ? Je(H == null ? void 0 : H.segments, F) : null;
      return V && de(V.id), _(`${B.published.length} Approved draft${B.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (B) {
      const H = B.status === 409 ? "The approved drafts changed. Review the updated list and try again." : B.message || "Unable to publish the approved drafts.";
      return B.status === 409 && await p(), xe(H), _(H), !1;
    } finally {
      J();
    }
  }
  async function C(j = null, G = null) {
    if (M != null || b()) return;
    const J = j != null ? E.current : null, B = Number.isFinite(J) ? J : l, H = Math.min(ne, B + 20);
    if (H <= B) {
      _("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const F = gl(N, S, j);
    if (F.kind === "choose-tag") {
      E.current = B, _(""), R(!0);
      return;
    }
    if (F.kind === "invalid-selection") {
      _("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: V } = F, Te = `create-draft:${me.id}:${V}:${B}`, je = r ? null : crypto.randomUUID(), Ie = $.current, Ue = {
      ...S || {},
      id: w.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: V,
      tagName: G || (S == null ? void 0 : S.tagName) || "Tag segment",
      tagSortName: V === (S == null ? void 0 : S.tagId) && (S == null ? void 0 : S.tagSortName) || null,
      startSec: B,
      endSec: H,
      // Full mode creates manual drafts already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, Ke = Cd(d, Ue), Oe = Et(
      nn(Ke.segments, Ke.segmentGroups || [], Ke.performerSlots || []),
      Ue.id
    ), Ye = i({
      kind: "create",
      lockId: -1,
      run: (Xe) => dt(Xe)
    });
    if (!Ye) return;
    await Ye.done;
    async function dt({ onReload: Xe, taskId: ct }) {
      var st;
      const nt = Jn();
      o({ type: "add", entry: { id: nt, taskId: ct, op: "insert", segment: Ue } }), R(!1), F.openTagEditor && (U(Ue.id), Q.current = Ue.id, fe(!0)), I(Ue.id), W(Oe);
      try {
        let et;
        if (r) {
          const Ne = await ee(`/videos/${me.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: Fe(Te), tagId: V, startSec: B, endSec: H })
          });
          Ge(Te), et = { itemId: (st = Ne.draft) == null ? void 0 : st.itemId };
        } else
          et = { nativeSegmentId: (await ee(`/videos/${me.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: V,
              startSec: B,
              endSec: H,
              historyReceiptId: je
            })
          })).id };
        E.current = null, R(!1);
        const X = await Xe();
        if (o({ type: "discard", key: nt }), !X) {
          I(Ie), _(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${F.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const oe = Je(X == null ? void 0 : X.segments, et);
        oe ? (o({ type: "retarget", temporaryId: Ue.id, identity: rn(oe) }), s(Ue.id, rn(oe)), F.openTagEditor && (ve.current && (Q.current = oe.id), U(oe.id)), I(oe.id), W(Et(
          nn(X.segments || [], X.segmentGroups || [], X.performerSlots || []),
          oe.id
        )), r || await Z(
          "segment.create",
          "Created segment",
          $t([], !1),
          $t([oe], !1),
          je
        )) : (fe(!1), _(`Segment created, but it could not be selected${F.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (et) {
        throw o({ type: "discard", key: nt }), I(Ie), j != null && R(!0), _(et.message || "Unable to create the draft."), et;
      } finally {
        U(null);
      }
    }
  }
  function b() {
    return ki(a, S) ? (_("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function x() {
    if (A.length !== 1 || !S || M != null || b()) return;
    const j = l;
    if (j <= S.startSec || S.endSec != null && j >= S.endSec) {
      _("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const G = `split-draft:${S.itemId}:${S.revision}:${j}`, J = r ? null : $t([S], !1), B = r ? null : crypto.randomUUID(), H = t("split", S.id);
    if (H)
      try {
        let F = null;
        r && S.nativeSegmentId == null ? (await ee(`/videos/${me.id}/drafts/${S.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(G),
            expectedRevision: S.revision,
            splitSec: j
          })
        }), Ge(G)) : F = { nativeSegmentId: (await ee(`/videos/${me.id}/segments/${S.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: S.updatedAt,
            splitSec: j,
            historyReceiptId: B
          })
        })).id };
        const V = await y();
        if (!r) {
          const Te = [
            Je(V == null ? void 0 : V.segments, {
              nativeSegmentId: S.nativeSegmentId ?? S.id
            }),
            Je(
              V == null ? void 0 : V.segments,
              F
            )
          ].filter(Boolean);
          await Z(
            "segment.split",
            "Split segment",
            J,
            $t(Te, !1),
            B
          );
        }
        _(r ? `Segment split; both ranges remain ${S.reviewState}.` : "Segment split.");
      } catch (F) {
        F.status === 409 ? await p() : _(F.message || "Unable to split the draft.");
      } finally {
        H();
      }
  }
  async function v(j = !1) {
    var F, V;
    if (A.length !== 1 || !S || M != null || b()) return;
    const G = j ? l : S.startSec, J = ml(me.id, S, j, G), B = r ? null : crypto.randomUUID(), H = t("duplicate", S.id);
    if (H)
      try {
        const Te = ((F = k.current) == null ? void 0 : F.operationKey) === J ? k.current : null;
        let je = (Te == null ? void 0 : Te.duplicateIdentity) ?? null;
        if (je == null && r && S.nativeSegmentId == null) {
          const Ke = await ee(`/videos/${me.id}/drafts/${S.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(J),
              expectedRevision: S.revision,
              startSec: j ? G : null
            })
          });
          je = Qo(!1, Ke), k.current = { operationKey: J, duplicateIdentity: je };
        } else if (je == null) {
          const Ke = await ee(`/videos/${me.id}/segments/${S.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: S.updatedAt,
              startSec: j ? G : null,
              historyReceiptId: B
            })
          });
          je = Qo(!0, Ke), k.current = { operationKey: J, duplicateIdentity: je };
        }
        const Ie = await y(), Ue = Je(Ie == null ? void 0 : Ie.segments, je);
        if (Ue) {
          r || await Z(
            "segment.duplicate",
            "Duplicated segment",
            $t([], !1),
            $t([Ue], !1),
            B
          );
          const Ke = Wa(
            Ue,
            Ie.performerSlots || [],
            c,
            u,
            Ie.segmentGroups || []
          );
          T(Ke.filters), q(Ke.hideDerivedSegments), Y([Ue.id]), de(Ue.id), z.current = Ue.id, ie.current = [], W(Et(
            nn(Ie.segments || [], Ie.segmentGroups || [], Ie.performerSlots || []),
            Ue.id
          )), r && S.nativeSegmentId == null && Ge(J), k.current = null, _(j ? "Duplicate created at the playhead." : "Duplicate created in place.");
        } else
          _("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
      } catch (Te) {
        ((V = k.current) == null ? void 0 : V.operationKey) === J ? _("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : Te.status === 409 ? await p() : _(Te.message || "Unable to duplicate the draft.");
      } finally {
        H();
      }
  }
  async function P() {
    if (A.length !== 1 || !S) return;
    const j = Number(he), G = g.trim() === "" ? null : Number(g), J = Ho(j, G, m);
    if (J.error) {
      _(J.error);
      return;
    }
    if (j === S.startSec && G === S.endSec) {
      _("Timing is unchanged.");
      return;
    }
    await te(S, { startSec: j, endSec: G, tagId: S.tagId }, !0, null, !0);
  }
  async function le(j, G) {
    if (A.length !== 1 || !S) return;
    const J = Ho(j, G, m);
    if (J.error) {
      _(J.error);
      return;
    }
    if (j === S.startSec && G === S.endSec) {
      _("Timing is unchanged.");
      return;
    }
    await te(S, { startSec: j, endSec: G, tagId: S.tagId }, !0, null, !0);
  }
  return { acceptHistory: ce, recordHistoryAction: Z, mutateSegment: te, runSegmentMutation: K, completeReview: se, createSegment: C, splitSegment: x, duplicateSegment: v, saveTiming: P, applyShortcutTiming: le };
}
function Ud() {
  const [e, t] = L(() => typeof window < "u" && window.matchMedia(Uo).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Uo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Kd() {
  const [e, t] = L(() => typeof window < "u" && window.matchMedia(Ko).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Ko), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function zd() {
  try {
    return Ls(window.localStorage.getItem(La));
  } catch {
    return { ...wt };
  }
}
function Hd() {
  try {
    return Jt(JSON.parse(window.localStorage.getItem(Fa) || "[]"));
  } catch {
    return [];
  }
}
function qd(e) {
  try {
    window.localStorage.setItem(Fa, JSON.stringify(Jt(e)));
  } catch {
  }
}
function _d(e) {
  try {
    window.localStorage.setItem(La, JSON.stringify(e));
  } catch {
  }
}
function Wd() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Ba) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Vd(e) {
  try {
    return window.localStorage.setItem(Ba, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Jd({ status: e }) {
  const t = ui[e];
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
function Vt({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, St.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...di(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${Dt[t].symbol}${e[t]}`)));
}
function Yd({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: g, shortcutRef: u }) {
  const f = co(a), [m, p] = L(() => _r(o, f)), [h, y] = L(!1), [w, k] = L(""), E = pe(!1), Q = o.map((A) => `${A.slotDefinitionId}:${A.performerId || ""}`).join("|"), I = f.map((A) => at(A)).join("|"), M = ni(
    o,
    f
  );
  ye(() => {
    p(_r(o, f)), k("");
  }, [t, r, Q, I]);
  async function N(A = m) {
    if (!E.current) {
      E.current = !0, y(!0), k("Saving performer slots…");
      try {
        const z = _r(o.map((T) => ({
          ...T,
          performerId: A[T.slotDefinitionId] || null
        })), f), ie = o.map((T) => {
          const R = z[T.slotDefinitionId] ? Number(z[T.slotDefinitionId]) : null, q = f.find((re) => String(at(re)) === String(R));
          return {
            ...T,
            performerId: R,
            performerName: (q == null ? void 0 : q.name) || null
          };
        });
        if (s(ie) === !1) {
          k("");
          return;
        }
        const U = await ee(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((T) => ({ slotDefinitionId: T.slotDefinitionId, performerId: z[T.slotDefinitionId] ? Number(z[T.slotDefinitionId]) : null }))
          })
        });
        k("Performer slots saved."), await l(U, {
          beforeState: Sr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: Sr([{
            segmentId: t,
            itemId: r,
            revision: U.revision,
            slots: U.slots || []
          }])
        });
      } catch (z) {
        d && await d(o, z), z.status === 409 ? (k("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : k(z.message || "Unable to save performer slots.");
      } finally {
        E.current = !1, y(!1);
      }
    }
  }
  function S(A, z) {
    k(`Option ${z + 1} applied; save to confirm.`), p({ ...m, ...A.assignments });
  }
  async function $(A) {
    const z = { ...m, ...A.assignments };
    p(z), await N(z);
  }
  return ye(() => {
    if (u)
      return u.current = (A) => E.current || !M[A] ? !1 : ($(M[A]), !0), () => {
        u.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    M.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, M.map((A, z) => n("button", {
        key: z,
        type: "button",
        disabled: h,
        onClick: () => S(A, z),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${z + 1}: ${A.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, z + 1),
        n("span", { key: "description" }, A.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${M.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((A) => n("label", { key: A.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, kt(A)),
      (A.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(A.genderHints || []).map(Nr).join(" · ")}`) : null,
      n("select", { key: "select", value: m[A.slotDefinitionId] || "", disabled: h, onChange: (z) => p({ ...m, [A.slotDefinitionId]: z.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ri(f, f, A.genderHints).map((z) => n("option", { key: at(z), value: at(z) }, z.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: g, type: "button", disabled: h, onClick: () => N(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, w)])
  ]);
}
function Qd({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a }) {
  var M;
  const s = ((M = t[0]) == null ? void 0 : M.slots) || [], l = co(r), d = ni(
    s,
    l
  ), c = "__mixed__", g = () => Object.fromEntries(s.map((N, S) => {
    const $ = t.map((A) => {
      var z;
      return String(((z = A.slots[S]) == null ? void 0 : z.performerId) || "");
    });
    return [N.slotDefinitionId, $.every((A) => A === $[0]) ? $[0] : c];
  })), [u, f] = L(g), [m, p] = L(!1), [h, y] = L(""), w = pe(!1), k = t.map((N) => `${N.itemId ?? `native:${N.segmentId}`}:${N.revision}:${N.slots.map((S) => `${S.slotDefinitionId}:${S.performerId || ""}`).join(",")}`).join("|");
  ye(() => {
    f(g());
  }, [k]);
  async function E(N = u) {
    if (w.current) return;
    w.current = !0, p(!0), y(`Saving performer slots for ${t.length} segments…`);
    const S = [];
    try {
      for (const $ of t) {
        const A = $.slots.map((ie, U) => {
          const T = N[s[U].slotDefinitionId];
          return {
            slotDefinitionId: ie.slotDefinitionId,
            performerId: T === c ? ie.performerId || null : T ? Number(T) : null
          };
        }), z = await ee($.itemId != null ? `/videos/${e}/drafts/${$.itemId}/slots` : `/videos/${e}/segments/${$.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: $.revision, assignments: A })
        });
        S.push({
          segmentId: $.segmentId,
          itemId: $.itemId,
          revision: z.revision,
          slots: z.slots || []
        });
      }
      y("Performer slots saved."), o({
        beforeState: Sr(t),
        afterState: Sr(S)
      });
    } catch ($) {
      const A = await i();
      $.status === 409 ? y(A ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : y($.message || (A ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      w.current = !1, p(!1);
    }
  }
  function Q(N, S) {
    y(`Option ${S + 1} applied; save to confirm.`), f({ ...u, ...N.assignments });
  }
  async function I(N) {
    const S = { ...u, ...N.assignments };
    f(S), await E(S);
  }
  return ye(() => {
    if (a)
      return a.current = (N) => w.current || !d[N] ? !1 : (I(d[N]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, d.map((N, S) => n("button", {
        key: S,
        type: "button",
        disabled: m,
        onClick: () => Q(N, S),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${S + 1} to all selected segments: ${N.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, S + 1),
        n("span", { key: "description" }, N.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${d.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, s.map((N) => n("label", {
      key: N.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, kt(N)),
      n("select", {
        key: "select",
        value: u[N.slotDefinitionId] || "",
        disabled: m,
        onChange: (S) => f({ ...u, [N.slotDefinitionId]: S.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        u[N.slotDefinitionId] === c ? n("option", { key: "mixed", value: c }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ri(l, l, N.genderHints).map((S) => n("option", {
          key: at(S),
          value: at(S)
        }, S.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: m,
        onClick: () => E(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, h)
    ])
  ]);
}
function Ot(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function Zd(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return Ot(t);
  const o = [...new Set(r.map((i) => Ot(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function Cr() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function gr({ name: e }) {
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
function Xd({ hidden: e }) {
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
    n(Cr, { key: "derived" })
  ]);
}
function ec({ segment: e, provenance: t }) {
  var g;
  const [r, o] = L(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = Zd(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
        const f = u.modelIdentifier || u.modelKey, m = u.value == null ? null : typeof u.value == "string" ? u.value : JSON.stringify(u.value);
        return n("div", { key: u.id || `${u.fieldKey}:${u.sourceKey}:${u.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            Ot(u.sourceKey, u.sourceDisplayName)
          ),
          u.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${u.fieldKey}${m == null ? "" : ` · ${m}`}`
          ) : null,
          u.relation === "inherited" ? n("div", { key: "relation", className: "text-secondary" }, "Inherited origin") : null,
          f ? n(
            "div",
            { key: "model", className: "text-secondary" },
            `Model ${f}${u.modelVersion ? ` · ${u.modelVersion}` : ""}`
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
function tc({
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
  const [u, f] = L([]), m = e.flatMap((w) => w.lanes.map((k) => k.key)), p = m.join("|");
  ye(() => {
    const w = new Set(m);
    f((k) => k.filter((E) => w.has(E)));
  }, [p]);
  const h = kr(t), y = !!fi(
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
      a ? n(Vt, { key: "counts", counts: h }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      od({ mergeable: y, reviewable: a, tagEditable: s, slotsEditable: l })
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
      ...w.lanes.map((k) => {
        const E = u.includes(k.key), Q = k.markers.some(({ segment: M }) => M.id === r), I = `selected-segment-lane-${k.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: k.key,
          "data-selected-segment-lane": k.key,
          className: `rounded-md border ${Q ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": E,
            "aria-controls": I,
            "aria-current": Q ? "true" : void 0,
            onClick: () => f((M) => E ? M.filter((N) => N !== k.key) : [...M, k.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, E ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Wn(k)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(k.selectedCount)),
            a ? n(Vt, { key: "states", counts: k.counts }) : null
          ]),
          E ? n("div", {
            key: "segments",
            id: I,
            className: "space-y-1 border-t border-border p-1.5"
          }, k.markers.map(({ segment: M }) => {
            const N = M.endSec == null ? Me(M.startSec) : `${Me(M.startSec)} – ${Me(M.endSec)}`;
            return n("button", {
              key: M.id,
              type: "button",
              onClick: () => i(M),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${M.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${M.tagName || "Segment"}, ${M.reviewState}, ${N}` : `${M.tagName || "Segment"}, ${N}`,
              "aria-current": M.id === r ? "true" : void 0
            }, [
              a ? n(an, {
                key: "state",
                state: M.reviewState,
                includeLabel: !1
              }) : null,
              M.isDerived ? n(Cr, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, N),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                Ot(M.sourceKey)
              )
            ]);
          })) : null
        ]);
      })
    ]))
  ]);
}
const Un = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"]
}, ya = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], ba = [
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
function Qn(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function Ii(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function ha(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function pr(e, t, r, o = null) {
  const i = ha(t), a = ha(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function nc(e, t, r = null) {
  var u, f, m;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (u = t.hasSegmentsCriterion) == null ? void 0 : u.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), pr(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), pr(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), pr(o, t.performersCriterion, "performer"), pr(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = va(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = va(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((f = t.reviewStateCriterion) == null ? void 0 : f.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const g = (m = t.shotBoundariesCriterion) == null ? void 0 : m.value;
  return r && typeof g == "boolean" ? o.set("hasShotBoundaries", String(g)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function va(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function rc(e, t, r, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((g) => a.add(g));
  } else a.has(r) ? a.delete(r) : a.add(r);
  return a;
}
function Ci({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(ia, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, St.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = Dt[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(ia, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function $i({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
function oc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      onClick: (l) => Qn(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      n($i, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, vs(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(Ci, { item: e, showReviewStates: r }))
    ])
  ]);
}
function ac({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n($i, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
    n(i ? "div" : "a", {
      key: "link",
      href: i ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: i ? void 0 : (l) => Qn(l, t, s),
      className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
      n("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
        n("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
        n(Ci, { key: "segments", item: e, showReviewStates: r })
      ]),
      n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function bo({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = Sl(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => Qn(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && Rn(
        o,
        qt.recyclingBinView
      ) ? n(Ti, { key: "bin", onNavigate: t }) : null,
      n(Ai, { key: "settings", onNavigate: t })
    ])
  ]);
}
const ro = "segment-studio:recycling-bin-changed";
function ic(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function Hn() {
  window.dispatchEvent(new CustomEvent(ro));
}
function Ti({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = L(null);
  ye(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const g = await ee("/bin"), u = Number(g == null ? void 0 : g.totalCount);
        !a && c === s && o(Number.isFinite(u) && u >= 0 ? Math.trunc(u) : null);
      } catch {
        !a && c === s && o(null);
      }
    }, d = () => {
      l();
    };
    return l(), window.addEventListener(ro, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(ro, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = ic(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => Qn(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function Ai({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => Qn(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function sc({ mode: e, onModeChange: t, disabled: r = !1 }) {
  function o(i) {
    const a = Xr(i.target.value);
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
function lc({ minimum: e, maximum: t, onChange: r }) {
  const o = pe(null), [i, a] = L("maximum"), s = (f, m) => {
    const p = Hs(e, t, f, m);
    a(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (f, m) => {
    var h;
    const p = (h = o.current) == null ? void 0 : h.getBoundingClientRect();
    p && s(f, zs(m.clientX, p.left, p.width));
  }, d = (f, m) => {
    var p, h;
    m.preventDefault(), (h = (p = m.currentTarget).setPointerCapture) == null || h.call(p, m.pointerId), l(f, m);
  }, c = (f, m) => {
    var p, h;
    (h = (p = m.currentTarget).hasPointerCapture) != null && h.call(p, m.pointerId) && l(f, m);
  }, g = (f, m) => {
    const p = f === "minimum" ? e : t, h = f === "minimum" ? 0 : e, y = f === "minimum" ? t : 1, w = m.shiftKey ? 0.1 : 0.01;
    let k = null;
    ["ArrowLeft", "ArrowDown"].includes(m.key) && (k = p - w), ["ArrowRight", "ArrowUp"].includes(m.key) && (k = p + w), m.key === "PageDown" && (k = p - 0.1), m.key === "PageUp" && (k = p + 0.1), m.key === "Home" && (k = h), m.key === "End" && (k = y), k != null && (m.preventDefault(), s(f, Math.min(y, Math.max(h, k))));
  }, u = (f, m) => n("span", {
    key: f,
    role: "slider",
    tabIndex: 0,
    "aria-label": f === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((f === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((f === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(m * 100),
    "aria-valuetext": `${Math.round(m * 100)} percent`,
    onPointerDown: (p) => d(f, p),
    onPointerMove: (p) => c(f, p),
    onKeyDown: (p) => g(f, p),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${m * 100}%`,
      touchAction: "none",
      zIndex: e === t && i === f ? 2 : 1
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
function dc({ saving: e, error: t, onSelect: r, onClose: o }) {
  const i = pe(null);
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
    onKeyDownCapture: (s) => Nt(s, { onCancel: a })
  }, n("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: Ut,
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
    n(qn, {
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
function cc({
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
  const u = Tt(e), f = [...new Map((a || []).map((y) => [
    Number(y.tagId),
    y.tagName || `Tag ${y.tagId}`
  ])).entries()].sort((y, w) => y[1].localeCompare(w[1]) || y[0] - w[0]), m = (y) => d(Tt({ ...u, ...y })), p = (y) => m({
    reviewStates: u.reviewStates.includes(y) ? u.reviewStates.filter((w) => w !== y) : [...u.reviewStates, y]
  }), h = (y) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${y ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (y) => {
      y.target === y.currentTarget && g();
    },
    onKeyDownCapture: (y) => Nt(y, { onCancel: g })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: Ut,
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
        n("div", { className: "flex flex-wrap gap-2" }, St.map((y) => {
          const w = u.reviewStates.includes(y), k = Dt[y];
          return n("button", {
            key: y,
            type: "button",
            onClick: () => p(y),
            "aria-pressed": w,
            className: h(w)
          }, `${k.symbol} ${y} (${i[y] || 0})`);
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
            className: h(u.performerId == null)
          }, "All performers"),
          ...r.map((y) => {
            const w = Number(at(y));
            return n("button", {
              key: w,
              type: "button",
              onClick: () => m({ performerId: w }),
              "aria-pressed": u.performerId === w,
              className: h(u.performerId === w)
            }, y.name);
          })
        ])
      ]) : null,
      n("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        n("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Tag"),
          n("select", {
            key: "select",
            value: u.tagId ?? "",
            onChange: (y) => m({
              tagId: y.target.value === "" ? null : Number(y.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...f.map(([y, w]) => n("option", { key: y, value: y }, w))
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
            onChange: (y) => m({
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
            onClick: () => m({ sourceKey: null }),
            "aria-pressed": u.sourceKey == null,
            className: h(u.sourceKey == null)
          }, "All provenance"),
          ...o.map((y) => n("button", {
            key: y,
            type: "button",
            onClick: () => m({ sourceKey: y }),
            "aria-pressed": u.sourceKey === y,
            title: y,
            className: h(u.sourceKey === y)
          }, Ot(y)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(lc, {
          minimum: u.confidenceMin,
          maximum: u.confidenceMax,
          onChange: ({ minimum: y, maximum: w }) => m({
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
            checked: u.includeUnscored,
            onChange: (y) => m({
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
        n(Xd, { key: "icon", hidden: t }),
        n("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    n("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(Tt({})), l && c(!1);
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
function uc({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Yn.filter((l) => An(l, e)), i = Jo(o, 1)[0], a = Jo(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((g) => n("div", { key: g.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, g.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[g.id] ? t[g.id].length > 0 ? t[g.id] : ["Unassigned"] : g.bindings.map(Ya)).map((u, f) => n("kbd", { key: `${g.id}:${f}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, u))
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
    onKeyDownCapture: (l) => Nt(l, { onCancel: r })
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
function mc({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = wd(e), [l, d] = L([]), c = s.map((g) => g.tagName).join("|");
  return ye(() => {
    const g = new Set(s.map((u) => u.tagName));
    d((u) => u.filter((f) => g.has(f)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (g) => Nt(g, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: Ut,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", { key: "title", id: "segment-studio-examples-title", className: "text-lg font-semibold text-foreground" }, "AI Feedback"),
      n("p", { key: "description", className: "mt-1 text-sm text-secondary" }, `${e.length} registered-AI example${e.length === 1 ? "" : "s"} in this video. Expand a tag to inspect or restore examples before export.`)
    ]),
    n("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      n("div", { key: "items", className: "space-y-3" }, e.length ? s.map((g, u) => {
        const f = l.includes(g.tagName), m = `incorrect-example-tag-${u}`;
        return n("section", {
          key: g.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": f,
            "aria-controls": m,
            onClick: () => d((p) => f ? p.filter((h) => h !== g.tagName) : [...p, g.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: wr(!1) }
          }, [
            n(
              "span",
              { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" },
              f ? "▾" : "▸"
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
          f ? n("div", {
            key: "examples",
            id: m,
            className: "divide-y divide-border border-t border-border"
          }, g.examples.map((p) => {
            const h = `${Me(p.startSec)}${p.endSec == null ? "" : ` – ${Me(p.endSec)}`}`, y = r === p.id;
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
                "aria-label": `${y ? "Restoring" : "Restore to review"} ${g.tagName} example at ${h}`,
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
function gc({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = L(""), [a, s] = L(0), l = pe(null), d = He(() => Dl(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = Pl(d);
  ye(() => {
    var f;
    (f = l.current) == null || f.scrollIntoView({ block: "nearest" });
  }, [c, o]);
  const u = () => {
    const f = d[c];
    f && t(f.segment || f);
  };
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-start justify-center bg-black/70 p-4 pt-[10vh]",
    onMouseDown: (f) => {
      f.target === f.currentTarget && r();
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-quick-search-title",
    tabIndex: -1,
    className: "flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    onKeyDownCapture: (f) => {
      var m;
      if (f.key === "Tab")
        Ut(f);
      else if (f.key === "Escape")
        f.preventDefault(), f.stopPropagation(), r();
      else if (f.key === "ArrowDown" || f.key === "ArrowUp") {
        f.preventDefault(), f.stopPropagation();
        const p = f.key === "ArrowDown" ? 1 : -1;
        s((h) => d.length ? (h + p + d.length) % d.length : 0);
      } else f.key === "Enter" && !((m = f.nativeEvent) != null && m.isComposing) && (f.preventDefault(), f.stopPropagation(), u());
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
    n("div", {
      key: "results",
      id: "segment-studio-quick-search-results",
      role: "listbox",
      "aria-label": "Matching segments",
      className: "min-h-0 flex-1 overflow-y-auto p-2"
    }, d.length ? d.flatMap((f, m) => {
      var I;
      const p = f.segment || f, h = p.endSec == null ? Me(p.startSec) : `${Me(p.startSec)} – ${Me(p.endSec)}`, y = `${Ot(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, w = m === c, k = m > 0 ? d[m - 1].groupKey : null, E = g && f.groupKey !== k ? n("div", {
        key: `group:${f.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, f.groupName) : null, Q = n("button", {
        key: p.id,
        id: `segment-quick-search-${p.id}`,
        ref: w ? l : null,
        type: "button",
        role: "option",
        "aria-selected": w,
        onMouseEnter: () => s(m),
        onClick: () => t(p),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${w ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        g ? n("span", { key: "group", className: "sr-only" }, `${f.groupName} group`) : null,
        n(an, { key: "review", state: p.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        (I = f.performers) != null && I.length ? n(Ir, {
          key: "performers",
          performers: f.performers,
          performerAssignments: f.performerAssignments
        }) : null,
        n(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          h
        ),
        n("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: y
        }, y)
      ]);
      return E ? [E, Q] : [Q];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function pc(e) {
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
function fc({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = He(() => pc(e), [e]), [l, d] = L([]), c = s.reduce((m, p) => m + p.drafts.length, 0), g = pe(null);
  go({ confirmRef: g, cancelRef: o, confirmReady: !t && c > 0 });
  const u = (m) => d((p) => p.includes(m) ? p.filter((h) => h !== m) : [...p, m]), f = (m) => `segment-studio-publish-approved-${m.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && a();
    },
    onKeyDownCapture: (m) => Nt(m, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: Ut,
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
      ].flatMap(([m, p]) => [
        n("dt", { key: `${m}:label`, className: "text-secondary" }, m),
        n("dd", { key: `${m}:value`, className: "font-semibold text-foreground" }, String(p))
      ])),
      s.length ? n("div", { key: "groups", className: "space-y-2" }, s.map((m) => {
        const p = l.includes(m.key);
        return n("section", { key: m.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": p,
            "aria-controls": f(m),
            onClick: () => u(m.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: wr(!1) }
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, p ? "▾" : "▸"),
            n("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, m.tagName),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${m.drafts.length} draft${m.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          p ? n("div", {
            key: "drafts",
            id: f(m),
            className: "divide-y divide-border border-t border-border"
          }, m.drafts.map((h) => {
            const y = h.endSec == null ? Me(h.startSec) : `${Me(h.startSec)} – ${Me(h.endSec)}`, w = `${Ot(h.sourceKey)}${h.confidence == null ? "" : ` · ${Math.round(h.confidence * 100)}%`}`;
            return n("div", { key: h.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(an, { key: "review", state: h.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, y),
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
function yc({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = El(e), [s, l] = L(() => /* @__PURE__ */ new Set()), [d, c] = L(() => new Set(a.map((h) => h.key))), g = a.flatMap((h) => d.has(h.key) ? h.candidates : []), u = (h) => l((y) => {
    const w = new Set(y);
    return w.has(h) ? w.delete(h) : w.add(h), w;
  }), f = (h) => c((y) => {
    const w = new Set(y);
    return w.has(h) ? w.delete(h) : w.add(h), w;
  }), m = (h) => h.assignment.map(({ slot: y, performer: w }) => `${y.label || `Slot ${y.sortOrder + 1}`}: ${w.name}`).join(", "), p = (h) => `segment-studio-auto-assign-${h.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && !t && i();
    },
    onKeyDownCapture: (h) => {
      h.key === "Enter" && h.target instanceof HTMLInputElement || Nt(h, {
        onCancel: t ? void 0 : i,
        onConfirm: g.length && !t ? () => o(g) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: Ut,
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
          style: { background: wr(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(h.key),
            disabled: t,
            onChange: () => f(h.key),
            "aria-label": `Include ${h.tagName} assignment: ${m(h)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(h.key),
            "aria-controls": p(h),
            "aria-label": `${s.has(h.key) ? "Collapse" : "Expand"} ${h.tagName} assignment: ${m(h)}`,
            onClick: () => u(h.key),
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
            h.assignment.map(({ slot: y, performer: w }) => {
              const k = y.label || `Slot ${y.sortOrder + 1}`;
              return n("span", {
                key: y.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${k}: ${w.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${k}: ${w.name}`
                }, `${k}: ${w.name}`),
                n(Vn, {
                  key: "avatar",
                  performer: { id: w.performerId, name: w.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(Vt, { key: "states", counts: h.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(h.candidates),
            "aria-label": `Auto-Assign ${h.tagName}: ${m(h)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${h.candidates.length})`)
        ]),
        s.has(h.key) ? n(
          "div",
          { key: "segments", id: p(h), className: "divide-y divide-border/70" },
          h.candidates.map((y) => {
            const w = y.endSec == null ? Me(y.startSec) : `${Me(y.startSec)} – ${Me(y.endSec)}`, k = `${Ot(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`;
            return n("div", {
              key: y.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(an, { key: "review", state: y.reviewState, includeLabel: !1 }),
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
                title: k
              }, k)
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
function bc({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => Nt(d, { onCancel: r, onConfirm: t })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: Ut,
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
function hc({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = L(!1), d = pe(null);
  if (go({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Me(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && a();
    },
    onKeyDownCapture: (g) => Nt(g, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: Ut,
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
        `${Me(e.startSec)} – ${c}`
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
function vc(e) {
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
function xc({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var u, f;
  const l = e ? e.createCount + e.linkCount : 0, d = pe(null);
  go({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((u = e == null ? void 0 : e.outputs) == null ? void 0 : u.slice(0, 200)) || [], g = vc(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !r && s();
    },
    onKeyDownCapture: (m) => Nt(m, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: Ut,
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
        ].flatMap(([m, p]) => [
          n("dt", { key: `${m}:label`, className: "text-secondary" }, m),
          n("dd", { key: `${m}:value`, className: "font-semibold text-foreground" }, String(p))
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
                `${m.rootTagName} @ ${Me(m.rootStartSec)}`
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
              m.outputs.map((p, h) => n("div", {
                key: `${p.ruleId}:${p.depth}:${h}`,
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
          (((f = e.outputs) == null ? void 0 : f.length) || 0) > c.length ? n(
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
function Sc({
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
  performerSlots: f,
  detail: m,
  video: p,
  slotButtonRef: h,
  tagSearchRef: y,
  onDetailChange: w,
  setSaveMessage: k,
  acquireSaveLock: E,
  onSlotsChanged: Q,
  onRecordHistory: I,
  onCancelQueuedReview: M,
  splitSegment: N,
  duplicateSegment: S,
  provenance: $,
  lineage: A,
  onNavigateLineageItem: z,
  tagEditing: ie,
  onCancelTagEditing: U,
  detailPanelRef: T,
  onReduceSelection: R
}) {
  var ve, ne, me, ce;
  const q = pe(null), re = pe(null), ae = () => {
    var Z;
    (Z = re.current) == null || Z.call(re), re.current = null;
  }, xe = pe(null), _ = pe(null), W = pe(null), de = pe(null), [Y, fe] = L(!1);
  ye(() => {
    q.current && (q.current.scrollTop = 0), fe(!1);
  }, [t == null ? void 0 : t.id]), ye(() => {
    var Z, te;
    Y && ((te = (Z = xe.current) == null ? void 0 : Z.querySelector("input, select, button")) == null || te.focus({ preventScroll: !0 }));
  }, [Y]);
  function he() {
    fe(!1), requestAnimationFrame(() => {
      var Z;
      return (Z = h.current) == null ? void 0 : Z.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const Z = !r.some((se) => se.isDerived), te = e && g ? rd(f, r) : null, K = (te == null ? void 0 : te.map((se, C) => {
      var x;
      const b = r[C];
      return {
        segmentId: b.nativeSegmentId,
        itemId: b.published ? null : b.itemId,
        revision: (x = m.performerSlotRevisions) == null ? void 0 : x[b.id],
        slots: se
      };
    })) || [];
    return n(oo.Fragment, null, [
      n(tc, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: T,
        onReduceSelection: R,
        reviewable: e,
        tagEditable: Z,
        slotsEditable: K.length > 0 && a == null,
        onEditSlots: () => fe(!0),
        slotButtonRef: h,
        saveMessage: i
      }),
      ie && Z ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (se) => {
          se.target === se.currentTarget && U();
        },
        onKeyDownCapture: (se) => Nt(se, { onCancel: U })
      }, n("section", {
        ref: y,
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
        n(qn, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (se, C) => se == null ? U() : l(se, C == null ? void 0 : C.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: U,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      Y && K.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (se) => {
          se.target === se.currentTarget && he();
        },
        onKeyDownCapture: (se) => {
          var b, x;
          if (!(typeof ((b = se.target) == null ? void 0 : b.closest) == "function" ? se.target.closest("input, textarea, select, [contenteditable='true']") : null) && !se.repeat && !se.ctrlKey && !se.altKey && !se.metaKey && !se.shiftKey && /^[1-9]$/.test(se.key) && ((x = de.current) != null && x.call(de, Number(se.key) - 1))) {
            se.preventDefault(), se.stopPropagation();
            return;
          }
          Nt(se, { onCancel: he });
        }
      }, n("section", {
        ref: xe,
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
          n("button", { key: "close", type: "button", onClick: he, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Qd, {
          videoId: p.id,
          targets: K,
          performerCandidates: m.performerCandidates || [],
          shortcutRef: de,
          onSaved: async ({ beforeState: se, afterState: C }) => {
            await I(
              "performer-slots.assign",
              `Assigned performers to ${K.length} segments`,
              se,
              C
            ), he(), Q();
          },
          onConflict: Q
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (Z) => {
      q.current = Z, T && (T.current = Z);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(an, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(Cr, { key: "derived" }) : null,
        t && ie ? n("div", {
          key: "tag-editor",
          ref: y,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (Z) => {
            Z.key === "Escape" && (Z.preventDefault(), Z.stopPropagation(), U());
          },
          onKeyDown: (Z) => {
            Xl(Z, t.tagName) && (Z.preventDefault(), Z.stopPropagation(), l(t.tagId));
          }
        }, n(qn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (Z, te) => Z == null ? U() : l(Z, te == null ? void 0 : te.label),
          disabled: pl(a, t.id, s) || ((ve = A.data) == null ? void 0 : ve.tagReadOnly) === !0,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? n("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : n("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? n("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        n("span", { key: "start" }, Me(t.startSec)),
        t.endSec == null ? null : n("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : n("span", { key: "end" }, Me(t.endSec))
      ]) : null,
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(Jd, { status: c })) : null,
      t && g && u.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(yi, {
        assignments: u.map((Z) => {
          const te = sd(Z);
          return {
            key: String(Z.slotDefinitionId),
            label: te.label,
            performer: te.filled ? { id: Number(Z.performerId), name: te.performer } : null,
            title: te.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(ec, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: $
    }) : null,
    t ? n("div", { key: "controls", hidden: !0 }, [
      n("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        n("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        A.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : A.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, A.error) : A.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${A.data.derived ? "Derived segment" : "Root segment"} · ${A.data.componentSize} segment${A.data.componentSize === 1 ? "" : "s"} · ${A.data.integrityState}`
          ),
          (ne = A.data.parents) != null && ne.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...A.data.parents.map((Z) => n("button", {
              key: Z.nodeId,
              type: "button",
              onClick: () => z(Z.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${Z.ruleKey} ${Z.ruleVersion}`))
          ]) : null,
          (me = A.data.children) != null && me.length ? n("p", { key: "children" }, `Children: ${A.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: h,
          type: "button",
          disabled: a != null || !g || u.length === 0,
          onClick: () => fe(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: g ? u.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, u.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: N,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        n("button", {
          key: "duplicate",
          type: "button",
          disabled: a != null,
          onClick: () => S(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        n("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: a != null,
          onClick: () => S(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    Y && e && t && g && u.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (Z) => {
        Z.target === Z.currentTarget && he();
      },
      onKeyDownCapture: (Z) => {
        var K, se;
        if (!(typeof ((K = Z.target) == null ? void 0 : K.closest) == "function" ? Z.target.closest("input, textarea, select, [contenteditable='true']") : null) && !Z.repeat && !Z.ctrlKey && !Z.altKey && !Z.metaKey && !Z.shiftKey && /^[1-9]$/.test(Z.key) && ((se = W.current) != null && se.call(W, Number(Z.key) - 1))) {
          Z.preventDefault(), Z.stopPropagation();
          return;
        }
        Nt(Z, {
          onCancel: he,
          onConfirm: () => {
            var C;
            return (C = _.current) == null ? void 0 : C.click();
          }
        });
      }
    }, n("section", {
      ref: xe,
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
        n("button", { key: "close", type: "button", onClick: he, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Yd, {
        key: `${t.id}:${m.performerSlotsRevision || m.slotRevision || ""}`,
        videoId: p.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: u,
        revision: (ce = m.performerSlotRevisions) == null ? void 0 : ce[t.id],
        performerCandidates: m.performerCandidates || [],
        confirmRef: _,
        shortcutRef: W,
        onOptimisticSave: (Z) => {
          w((K) => Wr(
            K,
            t.id,
            Z
          ), p.id);
          const te = E("slots", t.id);
          if (!te)
            return k("Wait for the current save to finish before saving performer slots."), !1;
          re.current = te, k("Saving performer slots…"), he();
        },
        onSaved: async (Z, { beforeState: te, afterState: K }) => {
          w((se) => Wr(
            se,
            t.id,
            Z.slots || [],
            Z.revision
          ), p.id), k("Performer slots saved.");
          try {
            await I(
              "performer-slots.assign",
              "Assigned performers",
              te,
              K
            ), await Q(Z) || M([t]);
          } finally {
            ae();
          }
        },
        onRollback: async (Z, te) => {
          M([t]), w((K) => {
            var se;
            return Wr(
              K,
              t.id,
              Z,
              (se = m.performerSlotRevisions) == null ? void 0 : se[t.id]
            );
          }, p.id), k(te.message || "Unable to save performer slots.");
          try {
            te.status === 409 && await Q();
          } finally {
            ae();
          }
        },
        onConflict: Q
      }))
    ])) : null
  ]);
}
function kc({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: u, onSelectGroup: f, onToggleGroup: m, onSelect: p, onSelectSegments: h, onSelectAll: y, onConfigureTag: w, onSeekTime: k, centerRef: E, showReviewState: Q = !0, swimlaneTitleWidth: I, onSwimlaneTitleWidthChange: M }) {
  const N = pe(null), S = pe(null), [$, A] = L(0), [z, ie] = L({ scrollTop: 0, height: 320 }), [U, T] = L(null), R = He(
    () => nn(e, r, o),
    [e, r, o]
  ), q = He(
    () => gi(o),
    [o]
  ), re = He(() => yo(R), [R]), ae = He(
    () => md(re, i, r.length > 0),
    [re, i, r.length]
  ), xe = He(
    () => pi(ae.rows, Math.max(0, z.scrollTop - 24), z.height),
    [ae, z]
  ), _ = Math.max(0, Number(d) || 0), W = Ps($), de = fr(I, W), Y = de / 16, fe = Ds(c, _, Y), he = Ts(_), ve = As(_, Math.max(1, $ - Y * 16), g), ne = he.filter((x, v) => v === 0 || v % ve === 0), me = He(() => R.map((x) => `${x.key}:${x.trackCount}:${x.markers.map(({ segment: v, track: P }) => `${v.id}:${v.startSec}:${v.endSec ?? ""}:${P}`).join(",")}`).join("|"), [R]);
  function ce() {
    const x = S.current;
    if (!x) return;
    const v = x.querySelector("[data-timeline-track]"), P = x.firstElementChild, le = v == null ? void 0 : v.getBoundingClientRect(), j = P == null ? void 0 : P.getBoundingClientRect(), G = le && j ? Math.max(0, le.left - j.left) : Y * 16, J = (j == null ? void 0 : j.width) ?? x.scrollWidth;
    x.scrollTo({
      left: Es(c, _, J, x.clientWidth, G, Ka),
      behavior: "smooth"
    });
  }
  ye(() => (E.current = ce, () => {
    E.current === ce && (E.current = null);
  })), ye(() => {
    ce();
  }, [g]);
  function Z() {
    const x = S.current, v = ae.rows.find((J) => J.kind === "lane" && J.lane.markers.some(({ segment: B }) => B.id === s));
    if (!x || !v) return;
    const P = 24, le = v.top + P, j = le + v.height;
    let G = x.scrollTop;
    le < x.scrollTop + P ? G = Math.max(0, le - P) : j > x.scrollTop + x.clientHeight && (G = Math.max(0, j - x.clientHeight)), G !== x.scrollTop && (x.scrollTop = G), ie({ scrollTop: G, height: x.clientHeight });
  }
  ye(() => {
    Z();
  }, [s, me, ae]), ye(() => {
    const x = S.current, v = ae.rows.find((J) => J.kind === "group" && J.group.key === a);
    if (!x || !v) return;
    const P = 24, le = v.top + P, j = le + v.height;
    let G = x.scrollTop;
    le < x.scrollTop + P ? G = Math.max(0, le - P) : j > x.scrollTop + x.clientHeight && (G = Math.max(0, j - x.clientHeight)), G !== x.scrollTop && (x.scrollTop = G), ie({ scrollTop: G, height: x.clientHeight });
  }, [a, ae]), ye(() => {
    const x = S.current;
    if (!x || typeof ResizeObserver > "u") return;
    const v = () => {
      A(x.clientWidth), ie({ scrollTop: x.scrollTop, height: x.clientHeight }), Z();
    }, P = new ResizeObserver(v);
    return P.observe(x), v(), () => P.disconnect();
  }, [s, me, ae]);
  function te(x) {
    if (!(_ > 0)) return;
    const v = x.currentTarget.getBoundingClientRect(), P = Math.min(1, Math.max(0, (x.clientX - v.left) / v.width));
    k(P * _);
  }
  function K(x) {
    const v = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let P = null;
    Object.hasOwn(v, x.key) && (P = c + v[x.key]), x.key === "Home" && (P = 0), x.key === "End" && (P = _), P != null && (x.preventDefault(), x.stopPropagation(), k(Math.min(_, Math.max(0, P))));
  }
  function se(x) {
    var P;
    const v = (P = N.current) == null ? void 0 : P.getBoundingClientRect();
    v && M(fr(x.clientX - v.left, W));
  }
  function C(x) {
    const v = x.shiftKey ? 40 : 16;
    let P = null;
    x.key === "ArrowLeft" && (P = de - v), x.key === "ArrowRight" && (P = de + v), x.key === "Home" && (P = 160), x.key === "End" && (P = W), P != null && (x.preventDefault(), x.stopPropagation(), M(fr(P, W)));
  }
  const b = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: N,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (x) => {
          (x.metaKey || x.ctrlKey) && (x.preventDefault(), y == null || y());
        },
        onKeyDown: (x) => {
          x.key !== "Enter" && x.key !== " " || (x.preventDefault(), y == null || y());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: b, disabled: g <= 1, onClick: () => u(vr(g - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: b, disabled: g === 1, onClick: () => u(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(g * 100)}%`),
      n("button", { key: "in", type: "button", className: b, disabled: g >= 8, onClick: () => u(vr(g + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: b, onClick: ce, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(W),
      "aria-valuenow": Math.round(de),
      "aria-valuetext": `${Math.round(de)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (x) => {
        x.currentTarget.setPointerCapture(x.pointerId), se(x);
      },
      onPointerMove: (x) => {
        x.currentTarget.hasPointerCapture(x.pointerId) && se(x);
      },
      onKeyDown: C,
      onDoubleClick: () => M(wt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${de - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: S,
      onScroll: (x) => ie({
        scrollTop: x.currentTarget.scrollTop,
        height: x.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: Os(g) }, [
      n("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${Y}rem minmax(0,1fr)`, height: "1.5rem" } }, [
        n("div", { key: "axis-label", "data-timeline-label-gutter": "true", "aria-hidden": "true", className: "sticky left-0 z-40 border-r border-border", style: { backgroundColor: "var(--color-surface)" } }),
        n("div", {
          key: "ticks",
          role: "slider",
          tabIndex: 0,
          "data-timeline-seeker": "true",
          "data-timeline-track": "true",
          "aria-label": "Timeline seek",
          "aria-valuemin": 0,
          "aria-valuemax": _,
          "aria-valuenow": Math.min(_, Math.max(0, c)),
          "aria-valuetext": Me(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: te,
          onKeyDown: K
        }, ne.map((x, v) => n("span", {
          key: x,
          className: `absolute top-0 ${Rs(v, ne.length, _ > 0 ? x / _ * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Ms(v, ne.length, _ > 0 ? x / _ * 100 : 0)
        }, Me(x))).concat(t.map((x) => {
          const v = _ > 0 ? x.startSec / _ * 100 : 0;
          return n("button", {
            key: `shot-boundary:${x.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Me(x.startSec)} – ${Me(x.endSec)}`,
            title: `Shot boundary · ${x.source || "manual"} · ${Me(x.startSec)} – ${Me(x.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${v}%`, width: "2px" },
            onClick: (P) => {
              P.stopPropagation(), k(x.startSec);
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
            ...qo(fe),
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
        style: R.length > 0 ? { height: ae.height } : void 0
      }, [
        R.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...qo(fe, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        R.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : xe.map((x) => {
          var H;
          const v = x.group, P = i.includes(v.key), le = a === v.key, j = wr(le);
          if (x.kind === "group") return n("div", {
            key: x.key,
            "data-segment-group": v.key,
            "data-segment-group-collapsed": P ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${Y}rem minmax(0,1fr)`,
              backgroundColor: j,
              top: x.top,
              height: x.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (F) => {
                if (F.metaKey || F.ctrlKey) {
                  h(v.lanes.flatMap((V) => V.markers.map((Te) => Te.segment.id)));
                  return;
                }
                f(v.key), m(v.key);
              },
              "aria-expanded": !P,
              "aria-current": le ? "true" : void 0,
              "data-selected-timeline-group": le ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: v.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: j
              },
              title: `${P ? "Expand" : "Collapse"} ${v.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, P ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, v.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              P ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${v.lanes.length} swimlane${v.lanes.length === 1 ? "" : "s"} hidden`
                ),
                Q ? n(Vt, { key: "states", counts: v.counts }) : null
              ] : null
            )
          ]);
          const G = x.lane, J = Vl(x.laneIndex), B = G.markers.some(({ segment: F }) => F.id === s);
          return n("div", {
            key: x.key,
            "data-grouped-swimlane": v.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${Y}rem minmax(0,1fr)`,
              top: x.top,
              height: x.height,
              backgroundColor: J
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": B ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: Jl(B, J),
              title: `${Wn(G)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Wn(G),
              onClick: (F) => {
                (F.metaKey || F.ctrlKey) && h(G.markers.map((V) => V.segment.id));
              },
              onMouseEnter: () => T(G.key),
              onMouseLeave: () => T((F) => F === G.key ? null : F)
            }, [
              G.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (F) => {
                  F.stopPropagation(), w({ tagId: G.tagId, tagName: G.label, trigger: F.currentTarget });
                },
                "aria-label": `Configure ${G.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: U === G.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, G.label),
              (H = G.performers) != null && H.length ? n(Ir, {
                key: "performers",
                performers: G.performers,
                performerAssignments: G.performerAssignments
              }) : null,
              Q ? n(Vt, { key: "counts", counts: G.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, G.markers.map(({ segment: F, track: V }) => {
              var Xe;
              const Te = Jr(F.startSec, _), je = F.endSec == null ? F.startSec : Math.max(F.startSec, F.endSec), Ie = Math.max(0, Jr(je, _) - Te), Ue = l.includes(F.id), Ke = F.id === s, Oe = fo(q.get(F.id)), Ye = F.endSec == null ? Me(F.startSec) : `${Me(F.startSec)} – ${Me(F.endSec)}`, dt = (Xe = ui[Oe]) == null ? void 0 : Xe.label;
              return n("button", {
                key: F.id,
                type: "button",
                onClick: (ct) => {
                  ct.stopPropagation(), p(F, {
                    additive: ct.metaKey || ct.ctrlKey,
                    rangeSegmentIds: ct.shiftKey ? G.markers.map((nt) => nt.segment.id) : null
                  });
                },
                "aria-pressed": Ue,
                "aria-current": Ke ? "true" : void 0,
                "data-selected-timeline-marker": Ke ? "true" : void 0,
                "data-selected-segment-shortcut-target": Ke ? "true" : void 0,
                "aria-label": Q ? `${F.tagName || "Tag segment"}${G.performerLabel ? `, ${G.performerLabel}` : ""}, ${F.reviewState}${dt ? `, ${dt}` : ""}, ${Ye}` : `${F.tagName || "Tag segment"}${G.performerLabel ? `, ${G.performerLabel}` : ""}, ${Ye}`,
                title: Q ? `${F.tagName || "Tag segment"}${G.performerLabel ? ` · ${G.performerLabel}` : ""} · ${F.reviewState}${dt ? ` · ${dt}` : ""} · ${Ye}` : `${F.tagName || "Tag segment"}${G.performerLabel ? ` · ${G.performerLabel}` : ""} · ${Ye}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...Q ? ql(F.reviewState, Ue, Oe, Ke) : _l(Ue, Ke),
                  left: `${Te}%`,
                  top: `${Yl(V)}rem`,
                  width: Wl(F.endSec, Ie),
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
function ho({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = L(null), [l, d] = L([]), [c, g] = L(null), [u, f] = L(""), [m, p] = L(!0), [h, y] = L(null), [w, k] = L(""), [E, Q] = L(!1), I = pe(null), M = pe(0);
  ye(() => {
    const U = requestAnimationFrame(() => {
      var T;
      return (T = I.current) == null ? void 0 : T.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(U);
  }, [e]), ye(() => {
    const U = new AbortController();
    return p(!0), k(""), Promise.all([
      r ? ee(`/slot-definitions/${e}`, { signal: U.signal }) : Promise.resolve(null),
      ee("/segment-groups", { signal: U.signal })
    ]).then(([T, R]) => {
      const q = R.find((re) => (re.tags || []).some((ae) => Number(ae.tagId) === Number(e)));
      s(T), d(R), g((q == null ? void 0 : q.id) ?? null), f(q == null ? "" : String(q.id)), Q(!1);
    }).catch((T) => {
      T.name !== "AbortError" && k(T.message || "Unable to load tag configuration.");
    }).finally(() => {
      U.signal.aborted || p(!1);
    }), () => U.abort();
  }, [r, e]);
  function N(U, T) {
    s({
      ...a,
      definitions: a.definitions.map((R, q) => q === U ? { ...R, ...T } : R)
    });
  }
  function S(U, T) {
    const R = U + T;
    if (R < 0 || R >= a.definitions.length) return;
    const q = [...a.definitions];
    [q[U], q[R]] = [q[R], q[U]], s({
      ...a,
      definitions: q.map((re, ae) => ({ ...re, sortOrder: ae }))
    });
  }
  function $(U) {
    const T = a.definitions[U], R = Number(T.assignmentCount) || 0, q = R === 0 ? "" : ` and its ${R} assignment${R === 1 ? "" : "s"}`;
    window.confirm(`Delete “${kt(T)}”${q}?`) && (R > 0 && Q(!0), s({
      ...a,
      definitions: a.definitions.filter((re, ae) => ae !== U).map((re, ae) => ({ ...re, sortOrder: ae }))
    }));
  }
  async function A() {
    var T;
    y("slots"), k("Saving performer slots…");
    let U;
    try {
      U = await ee(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: E,
          definitions: a.definitions.map((R, q) => {
            var re;
            return {
              id: R.id || void 0,
              label: ((re = R.label) == null ? void 0 : re.trim()) || null,
              sortOrder: q,
              genderHints: R.genderHints || []
            };
          })
        })
      }), s(U), Q(!1);
    } catch (R) {
      R.status === 409 ? (k("Performer slots changed elsewhere; current values were reloaded."), (T = R.payload) != null && T.current && (s(R.payload.current), Q(!1))) : k(R.message || "Unable to save performer slots."), y(null);
      return;
    }
    try {
      await o(), k("Performer slots saved.");
    } catch {
      k("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      y(null);
    }
  }
  async function z() {
    const U = u === "" ? null : Number(u);
    if (U !== c) {
      y("group"), k("Saving tag group…");
      try {
        await ee(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: U })
        });
      } catch (T) {
        k(T.message || "Unable to assign the tag group."), y(null);
        return;
      }
      try {
        const [T, R] = await Promise.allSettled([
          ee("/segment-groups"),
          o()
        ]);
        if (T.status === "fulfilled") {
          d(T.value);
          const q = T.value.find((ae) => (ae.tags || []).some((xe) => Number(xe.tagId) === Number(e))), re = (q == null ? void 0 : q.id) ?? null;
          g(re), f(re == null ? "" : String(re));
        }
        k(
          T.status === "fulfilled" && R.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        y(null);
      }
    }
  }
  l.find((U) => Number(U.id) === Number(c));
  const ie = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (U) => {
      U.target === U.currentTarget && !h && i();
    },
    onKeyDownCapture: (U) => Nt(U, {
      onCancel: h ? void 0 : i
    })
  }, n("section", {
    ref: I,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: Ut,
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
            disabled: h != null,
            onChange: (U) => f(U.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((U) => n("option", { key: U.id, value: String(U.id) }, U.name))
          ])
        ]),
        m ? null : n("button", {
          key: "save",
          type: "button",
          disabled: h != null || (u === "" ? null : Number(u)) === c,
          onClick: z,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, h === "group" ? "Saving…" : "Save tag group")
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
              disabled: h != null,
              onChange: (U) => s({ ...a, allowSamePerformerInMultipleSlots: U.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((U, T) => n("article", {
            key: U.id || U._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: U.label || "",
                disabled: h != null,
                onChange: (R) => N(T, { label: R.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Ns.map((R) => n("label", { key: R, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: h != null,
                  checked: (U.genderHints || []).includes(R),
                  onChange: (q) => N(T, {
                    genderHints: q.target.checked ? [.../* @__PURE__ */ new Set([...U.genderHints || [], R])] : (U.genderHints || []).filter((re) => re !== R)
                  })
                }),
                n("span", { key: "text" }, Nr(R))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${U.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: h != null || T === 0, onClick: () => S(T, -1), className: ie, "aria-label": `Move ${kt(U)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: h != null || T === a.definitions.length - 1, onClick: () => S(T, 1), className: ie, "aria-label": `Move ${kt(U)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: h != null, onClick: () => $(T), className: `${ie} text-red-300` }, "Delete")
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
                  _clientKey: `new-${++M.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: ie
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: h != null,
              onClick: A,
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
function wc(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function Nc(e) {
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, analysisError: i, analysisRun: a, analysisStatus: s, approvalFacetCounts: l, autoAssignCandidates: d, autoAssignError: c, autoAssignOpen: g, autoAssignPerformers: u, autoAssigning: f, cancelQueuedReviewsForSegments: m, canMoveSelectionToBin: p, captureTrainingExport: h, centerTimelineRef: y, closeEditorFilters: w, closeFirstSegmentTagDialog: k, closeMaterializeDialog: E, closeMergeConfirmation: Q, closePublishApprovedDialog: I, closeTagEditing: M, collapsedSegmentGroups: N, commonActionsRef: S, compatibilityMode: $, configuringTag: A, createSegment: z, creatingSegmentId: ie, currentTime: U, deleteRejectedSegments: T, detail: R, detailPanelRef: q, detailWidth: re, duplicateSegment: ae, editorFilters: xe, editorLayout: _, editorRef: W, exportingExamples: de, filtersButtonRef: Y, filtersOpen: fe, firstSegmentTagOpen: he, focusRowRef: ve, handleSeparatorKeyDown: ne, handleSeparatorPointerDown: me, handleSeparatorPointerMove: ce, hasNextUnreviewed: Z, hasPreviousUnreviewed: te, hideDerivedSegments: K, history: se, historyOpen: C, historySaving: b, horizontalLayoutSize: x, importNativeSegments: v, incorrectExamples: P, incorrectExamplesOpen: le, lineage: j, markerRailWidth: G, materializeButtonRef: J, materializeCancelButtonRef: B, materializeDerivedSegments: H, materializeError: F, materializeLoading: V, materializeOpen: Te, materializePreview: je, materializing: Ie, mediaStackRef: Ue, mergeCancelButtonRef: Ke, mergeConfirmation: Oe, mergeSaving: Ye, mergeSelectedSwimlane: dt, nativeImportState: Xe, onDetailChange: ct, onNavigate: nt, onReload: st, onSlotsChanged: et, openPublishApprovedDialog: X, panelSeparatorProps: oe, pendingInitialSeekRef: Ne, performerSlots: we, performerSlotsAvailable: be, playbackControlsRef: qe, previewDerivedSegments: Be, provenance: _e, provenanceSources: Ce, publishApprovedCancelButtonRef: Ee, publishApprovedDrafts: De, publishApprovedError: $e, publishApprovedOpen: We, quickSearchOpen: ut, railScrollRef: ke, railToggleRef: ze, recordHistoryAction: Pe, rejectedDeletionPreview: pt, removeIncorrectExample: Qe, removingExampleId: rt, restoreHistoryTarget: It, runEditorAction: bt, saveMessage: Ae, saveTag: Re, saveTiming: Ve, savingSegmentId: Ze, seekRef: it, segmentGroups: Pt, segmentRailLayout: mt, segments: ft, selectAllVideoSegments: Lt, selectSegment: sn, selectSegmentCollection: $r, selectedGroups: ln, selectedPerformerSlots: Tr, selectedSegment: At, selectedSegmentGroupKey: Yt, selectedSegmentIds: Zn, selectedSegments: Qt, selectedSlotStatus: En, setAutoAssignError: Xn, setAutoAssignOpen: dn, setConfiguringTag: _t, setCurrentTime: cn, setEditorFilters: er, setEditorLayout: Ar, setFiltersOpen: tr, setHideDerivedSegments: Rr, setHistoryOpen: un, setIncorrectExamplesOpen: mn, setQuickSearchOpen: Dn, setRailViewport: gn, setRejectedDeletionPreview: Mr, setSaveMessage: nr, setSelectedSegmentGroupKey: pn, setSelectedSegmentId: Zt, setShortcutsOpen: fn, setTimelineZoom: On, shotBoundaries: ht, shortcutsOpen: rr, slotButtonRef: Pn, splitLayout: Ft, splitSegment: or, startFullAnalysis: yn, stepVideoFrame: bn, tagEditing: Er, tagSearchRef: Dr, timelineDuration: Or, timelineRatioBounds: hn, timelineZoom: Ln, toggleSegmentGroup: vn, toggleSegmentRail: tt, updateTimelineRatio: gt, video: lt, videoPerformers: ar, visibleCounts: Rt, visibleSegmentRailRows: Ct, visibleSegments: ir, wideLayout: Kt, workspaceRef: Fn } = e, xn = He(
    () => ft.filter((D) => !D.published && D.reviewState === "approved"),
    [ft]
  ), jn = xs(ao), Bn = xn.length, Sn = je ? je.createCount + je.linkCount : null, jt = Ze != null, Xt = Qt.length > 0, Bt = Qt.length === 1, zt = Xt && Qt.every((D) => D.reviewState === "approved"), Pr = Xt && Qt.every((D) => D.reviewState === "rejected"), Lr = [
    { id: "marker.create", label: "New segment", disabled: jt },
    { id: "marker.editTag", label: "Edit tag", disabled: jt || !Xt },
    { id: "marker.setStart", label: "Set start", disabled: jt || !Bt },
    { id: "marker.setEnd", label: "Set end", disabled: jt || !Bt },
    { id: "marker.split", label: "Split", disabled: jt || !Bt },
    ...$ ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !te, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: zt ? "Unapprove" : "Approve", disabled: jt || !Xt, tone: "approve" },
      { id: "marker.reject", label: Pr ? "Unreject" : "Reject", disabled: jt || !Xt, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !Z, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...$ ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: jt || !p, tone: "reject" }
    ]
  ];
  function Fr(D) {
    const Se = Zn.includes(D.id), yt = D.id === (At == null ? void 0 : At.id), ge = D.endSec == null ? Me(D.startSec) : `${Me(D.startSec)} – ${Me(D.endSec)}`, vt = `${Ot(D.sourceKey)}${D.confidence != null ? ` · ${Math.round(D.confidence * 100)}%` : ""}`;
    return n("button", {
      key: D.id,
      type: "button",
      onClick: (Gt) => sn(D, { additive: Gt.metaKey || Gt.ctrlKey }),
      "aria-pressed": Se,
      "aria-current": yt ? "true" : void 0,
      "data-selected-segment-shortcut-target": yt ? "true" : void 0,
      "aria-label": $ ? `${D.tagName || "Tag segment"}, ${D.reviewState}${D.isDerived ? ", derived segment" : ""}, ${ge}` : `${D.tagName || "Tag segment"}${D.isDerived ? ", derived segment" : ""}, ${ge}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: ci(Se, yt)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        $ ? n(an, { key: "review", state: D.reviewState, includeLabel: !1 }) : null,
        D.isDerived ? n(Cr, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          D.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, ge),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: vt
        }, vt)
      ])
    ]);
  }
  const kn = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", wn = [...se.actions || []].reverse().find((D) => D.sequence <= se.cursorSequence);
  return n("section", {
    ref: W,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${Ft ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (D) => Ii(D, nt, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${lt.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: lt.title || `Video ${lt.id}`
          }, lt.title || `Video ${lt.id}`)),
          ...ar.map((D) => n(Vn, {
            key: at(D),
            performer: { id: at(D), name: D.name },
            compact: !0,
            tooltip: D.name
          })),
          $ ? n(Vt, { key: "review-counts", counts: Rt }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          $ ? null : n(Ti, { key: "bin", onNavigate: nt, compact: !0 }),
          n(Ai, { key: "settings", onNavigate: nt, compact: !0 })
        ])
      ]),
      $ && R.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${R.nativeImportCount} Cove segment${R.nativeImportCount === 1 ? "" : "s"} ${R.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        Xe.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, Xe.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => v("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => v("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        Xe.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, Xe.error) : null
      ]) : null,
      i && (s == null ? void 0 : s.configured) !== !1 ? n("div", {
        key: "analysis-error",
        role: "alert",
        className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300"
      }, i) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          $ ? n("div", {
            key: "full-analysis",
            className: "inline-flex items-stretch"
          }, [
            n("button", {
              key: "run",
              type: "button",
              disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
              onClick: () => yn(),
              title: (s == null ? void 0 : s.error) || "Run AI tagging and shot boundary analysis into the Full review workflow",
              className: "segment-studio-full-scan-run inline-flex items-center justify-center bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
            }, (s == null ? void 0 : s.configured) === !1 ? "Full Scan not configured" : (s == null ? void 0 : s.ready) === !1 ? "Full Scan unavailable" : (a == null ? void 0 : a.status) === "queued" ? "Full Scan queued…" : (a == null ? void 0 : a.status) === "running" ? "Full Scan running…" : "Full Scan"),
            n("details", { key: "choices", className: "relative flex" }, [
              n("summary", {
                key: "summary",
                "aria-label": "Choose Full Scan analyses",
                "aria-disabled": (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
                title: "Choose analyses",
                onClick: (D) => {
                  ((s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running") && D.preventDefault();
                },
                onKeyDown: (D) => {
                  (D.key === "Enter" || D.key === " ") && ((s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running") && D.preventDefault();
                },
                className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${(s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running" ? "pointer-events-none cursor-default opacity-50" : "cursor-pointer hover:opacity-90"}`
              }, n(Pa, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([D, Se]) => n("button", {
                key: D,
                type: "button",
                disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
                onClick: (yt) => {
                  var ge;
                  (ge = yt.currentTarget.closest("details")) == null || ge.removeAttribute("open"), yn(Se);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, D)))
            ])
          ]) : null,
          $ ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: Ze != null || d.length === 0,
            onClick: () => {
              Xn(""), dn(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${d.length ? ` (${d.length})` : ""}`) : null,
          $ ? n("button", {
            key: "materialize-derived",
            ref: J,
            type: "button",
            disabled: Ze != null || V || Ie || Sn === 0,
            onClick: Be,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, V ? "Analyzing…" : `Auto-Materialize${Sn != null ? ` (${Sn})` : ""}`) : null,
          $ ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: Ze != null || Bn === 0,
            onClick: (D) => X(D.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": We,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${Bn ? ` (${Bn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: de || rt != null || P.length === 0,
            onClick: () => mn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": le,
            "aria-label": `Open AI feedback collection, ${P.length} example${P.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${P.length ? ` (${P.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: Y,
            type: "button",
            onClick: () => tr(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": fe,
            className: `${kn} ${r ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(gr, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${r ? ` (${r})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => fn(!0),
            className: kn
          }, [n(gr, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: ($ ? se.actions.length === 0 : wn == null) || Ze != null || b,
            onClick: $ ? () => un((D) => !D) : () => It(
              wn.sequence - 1
            ),
            "aria-haspopup": $ ? "dialog" : void 0,
            "aria-expanded": $ ? C : void 0,
            className: kn
          }, [
            n(gr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, $ ? `History${se.actions.length ? ` (${se.actions.length})` : ""}` : wn ? `Undo ${wn.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: ze,
            type: "button",
            onClick: tt,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": _.markerRailOpen,
            className: kn
          }, [
            n(gr, { key: "icon", name: "list" }),
            n("span", { key: "label" }, _.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    $ && C ? n("section", {
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
          onClick: () => un(!1),
          className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
        }, "Close")
      ]),
      n("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
        ...[...se.actions].reverse().map((D) => n("button", {
          key: D.sequence,
          type: "button",
          disabled: b,
          onClick: () => It(D.sequence),
          "aria-current": se.cursorSequence === D.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${D.sequence > se.cursorSequence ? "text-secondary" : "text-foreground"} ${se.cursorSequence === D.sequence ? "bg-accent/15" : ""}`
        }, [
          n("span", { key: "label", className: "min-w-0 flex-1 truncate" }, D.label),
          n("time", {
            key: "time",
            dateTime: D.createdAt,
            className: "shrink-0 text-[10px] text-secondary"
          }, new Date(D.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        ])),
        n("button", {
          key: "baseline",
          type: "button",
          disabled: b,
          onClick: () => It(se.baselineSequence),
          "aria-current": se.cursorSequence === se.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${se.cursorSequence === se.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    fe ? n(cc, {
      key: "editor-filters",
      filters: xe,
      hideDerivedSegments: K,
      performers: ar,
      provenanceSources: Ce,
      reviewCounts: l,
      segments: ft,
      segmentGroups: Pt,
      reviewMode: $,
      onChange: er,
      onHideDerivedChange: Rr,
      onClose: w
    }) : null,
    he ? n(dc, {
      key: "first-segment-tag-dialog",
      saving: Ze != null,
      error: Ae,
      onSelect: (D, Se) => z(D, Se),
      onClose: k
    }) : null,
    ut ? n(gc, {
      key: "quick-search-dialog",
      segments: Ol(o),
      onSelect: (D) => {
        Dn(!1), sn(D, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        Dn(!1), requestAnimationFrame(() => {
          var D;
          return (D = W.current) == null ? void 0 : D.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    g ? n(yc, {
      key: "auto-assign-dialog",
      candidates: d,
      processing: f,
      error: c,
      onConfirm: u,
      onClose: () => dn(!1)
    }) : null,
    Oe ? n(hc, {
      key: "merge-selection-dialog",
      merge: Oe,
      processing: Ye,
      undoable: !$,
      cancelButtonRef: Ke,
      onConfirm: (D) => dt(!0, D, Oe),
      onClose: Q
    }) : null,
    Te ? n(xc, {
      key: "materialize-derived-dialog",
      preview: je,
      loading: V,
      processing: Ie,
      error: F,
      cancelButtonRef: B,
      onConfirm: H,
      onClose: () => {
        Ie || E();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: Fn,
      className: `${Ft ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      _.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: Kt ? { position: "absolute", top: 0, right: 0, width: G, height: x.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        ft.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : ir.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: ke,
          onScroll: (D) => gn({
            scrollTop: D.currentTarget.scrollTop,
            height: D.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: mt.height }
        }, Ct.map((D) => {
          var yt;
          let Se;
          if (D.kind === "group") {
            const ge = N.includes(D.group.key), vt = D.group.lanes.reduce((Gt, sr) => Gt + sr.markers.length, 0);
            Se = n("button", {
              type: "button",
              onClick: () => {
                pn(D.group.key), vn(D.group.key);
              },
              "aria-expanded": !ge,
              "aria-current": Yt === D.group.key ? "true" : void 0,
              "data-segment-rail-group": D.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${Yt === D.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, ge ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: D.group.name }, D.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, vt),
              $ && ge ? n(Vt, { key: "states", counts: D.group.counts }) : null
            ]);
          } else D.kind === "lane" ? Se = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Wn(D.lane),
            "aria-label": Wn(D.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, D.lane.label),
            (yt = D.lane.performers) != null && yt.length ? n(Ir, {
              key: "performers",
              performers: D.lane.performers,
              performerAssignments: D.lane.performerAssignments
            }) : null,
            $ ? n(Vt, { key: "states", counts: D.lane.counts }) : null
          ]) : Se = Fr(D.segment);
          return n("div", {
            key: D.key,
            className: "absolute left-0 right-0",
            style: { top: D.top, height: D.height }
          }, Se);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${Ft ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: Ue,
          className: `${Ft ? "min-h-0 flex-1" : ""} grid`,
          style: Ft ? {
            gridTemplateRows: `minmax(16rem, ${(1 - _.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${_.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: ve,
            className: "grid min-h-0 gap-2",
            style: Kt ? {
              gridTemplateColumns: _.markerRailOpen ? `${re}px 0.5rem minmax(0,1fr) 0.5rem ${G}px` : `${re}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(Sc, {
              key: "tools",
              compatibilityMode: $,
              selectedSegment: At,
              selectedSegments: Qt,
              selectedGroups: ln,
              saveMessage: Ae,
              savingSegmentId: Ze,
              creatingSegmentId: ie,
              acquireSaveLock: t,
              setSaveMessage: nr,
              saveTag: Re,
              slotStatus: En,
              performerSlotsAvailable: be,
              selectedPerformerSlots: Tr,
              performerSlots: we,
              detail: R,
              onDetailChange: ct,
              onCancelQueuedReview: m,
              video: lt,
              slotButtonRef: Pn,
              tagSearchRef: Dr,
              tagEditing: Er,
              onCancelTagEditing: M,
              detailPanelRef: q,
              onReduceSelection: (D) => {
                sn(D), requestAnimationFrame(() => {
                  var Se;
                  return (Se = q.current) == null ? void 0 : Se.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Ve,
              onSlotsChanged: et,
              onRecordHistory: Pe,
              splitSegment: or,
              duplicateSegment: ae,
              provenance: _e,
              lineage: j,
              onNavigateLineageItem: (D) => {
                const Se = ft.find((yt) => yt.itemId === D);
                Se && Zt(Se.id);
              }
            }),
            Kt ? n(
              "div",
              { key: "detail-separator", ...oe("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            lt.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Ra, {
                streamUrl: `/api/stream/video/${lt.id}`,
                posterUrl: `/api/stream/video/${lt.id}/screenshot?v=${encodeURIComponent(lt.updatedAt || "")}`,
                format: lt.videoFile.format,
                audioCodec: lt.videoFile.audioCodec,
                duration: lt.videoFile.duration,
                videoId: lt.id,
                trackingEnabled: !1,
                onSeekRegister: (D) => {
                  it.current = D, Rl(Ne.current, ft, D) && (Ne.current = null);
                },
                onPlaybackControlRegister: (D) => {
                  qe.current = D;
                },
                onTimeUpdate: cn
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            Kt && _.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...oe("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Kt && _.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: S,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...Lr.map((D) => {
              var ge;
              const Se = (ge = jn[D.id]) == null ? void 0 : ge[0], yt = D.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : D.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: D.id,
                type: "button",
                disabled: D.disabled,
                "data-action-id": D.id,
                onClick: (vt) => {
                  const Gt = vt.currentTarget;
                  bt(D.id, { target: Gt, preserveFocus: !0 }), D.focusWhenDisabled && requestAnimationFrame(() => {
                    wc(Gt, S.current, D.focusWhenDisabled);
                  });
                },
                title: Se ? `${D.label} (${Se})` : D.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${yt}`
              }, [
                n("span", { key: "label" }, D.label),
                Se ? n("kbd", {
                  key: "shortcut",
                  className: "rounded border border-border/70 bg-background/70 px-1 py-0.5 font-mono text-[10px] leading-none text-secondary"
                }, Se) : null
              ]);
            }),
            n("div", { key: "frame-actions", className: "ml-auto flex items-center gap-1" }, [
              n("button", {
                key: "previous-frame",
                type: "button",
                disabled: !lt.videoFile,
                onClick: () => bn(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(Ss, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !lt.videoFile,
                onClick: () => bn(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(ks, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          Ft ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(hn.minimum * 100),
            "aria-valuemax": Math.round(hn.maximum * 100),
            "aria-valuenow": Math.round(_.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(_.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: me,
            onPointerMove: ce,
            onKeyDown: ne,
            onDoubleClick: () => gt(wt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: Ft ? void 0 : { height: "20rem" } }, n(kc, {
            segments: ir,
            shotBoundaries: ht,
            segmentGroups: Pt,
            performerSlots: we,
            collapsedGroupKeys: N,
            selectedGroupKey: Yt,
            selectedSegmentId: At == null ? void 0 : At.id,
            selectedSegmentIds: Zn,
            duration: Or,
            currentTime: U,
            zoom: Ln,
            onZoomChange: On,
            onSelectGroup: pn,
            onToggleGroup: vn,
            onSelect: (D, Se) => sn(D, Se),
            onSelectSegments: $r,
            onSelectAll: Lt,
            onConfigureTag: (D) => _t(D),
            onSeekTime: (D) => {
              var Se;
              return (Se = it.current) == null ? void 0 : Se.call(it, D, !1);
            },
            centerRef: y,
            showReviewState: $,
            swimlaneTitleWidth: _.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (D) => Ar((Se) => ({ ...Se, swimlaneTitleWidth: D }))
          }))
        ])
      ])
    ]),
    A ? n(ho, {
      key: `configure-tag:${A.tagId}`,
      tagId: A.tagId,
      tagName: A.tagName,
      performerSlotsEnabled: $,
      onSaved: st,
      onClose: () => {
        const D = A.trigger;
        _t(null), requestAnimationFrame(() => {
          var Se;
          D != null && D.isConnected ? D.focus({ preventScroll: !0 }) : (Se = W.current) == null || Se.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    We ? n(fc, {
      key: "publish-approved-dialog",
      drafts: xn,
      processing: Ze === -1,
      error: $e,
      cancelButtonRef: Ee,
      onConfirm: De,
      onClose: I
    }) : null,
    pt ? n(bc, {
      key: "rejected-deletion-dialog",
      preview: pt,
      onConfirm: () => {
        T(pt), requestAnimationFrame(() => {
          var D;
          return (D = W.current) == null ? void 0 : D.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Mr(null), requestAnimationFrame(() => {
          var D;
          return (D = W.current) == null ? void 0 : D.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    rr ? n(uc, {
      key: "shortcuts-dialog",
      reviewMode: $,
      bindings: jn,
      onClose: () => fn(!1)
    }) : null,
    le ? n(mc, {
      key: "incorrect-examples-dialog",
      examples: P,
      exporting: de,
      removingExampleId: rt,
      onExport: h,
      onRemove: Qe,
      onClose: () => mn(!1)
    }) : null
  ]);
}
function Ic(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: u, setEditorFilters: f, setHideDerivedSegments: m, setSaveMessage: p, setSelectedSegmentGroupKey: h, setSelectedSegmentId: y, setSelectedSegmentIds: w } = e;
  function k(N) {
    const S = Et(t, N);
    S && u(($) => bi($, S));
  }
  function E(N) {
    y(N), w(N == null ? [] : [N]), c.current = N, g.current = [];
  }
  function Q(N, {
    focusEditor: S = !1,
    seekToSegment: $ = !1,
    additive: A = !1,
    rangeSegmentIds: z = null
  } = {}) {
    var U, T;
    const ie = Vs({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, N.id, z, A);
    w(ie.selectedSegmentIds), y(ie.activeSegmentId), c.current = ie.anchorSegmentId, g.current = ie.rangeBaseSegmentIds, ie.activeSegmentId != null && h(Et(t, ie.activeSegmentId)), k(N.id), S && ((U = r.current) == null || U.focus({ preventScroll: !0 })), $ && ((T = i.current) == null || T.call(i, N.startSec, !1));
  }
  function I(N) {
    const S = _s(
      d,
      l,
      N
    );
    w(S.selectedSegmentIds), y(S.activeSegmentId), c.current = S.activeSegmentId, g.current = [], S.activeSegmentId != null && (h(Et(t, S.activeSegmentId)), k(S.activeSegmentId));
  }
  function M() {
    var $;
    const N = Ys(s), S = N.includes(l) ? l : N[0] ?? null;
    f(Tt({})), m(!1), w(N), y(S), c.current = S, g.current = [], S != null && h(Et(
      nn(s, a, o),
      S
    )), p(N.length === 0 ? "There are no segments to select." : `${N.length} segments selected. Collapsed Segment groups keep their selected segments.`), ($ = r.current) == null || $.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: k, replaceSegmentSelection: E, selectSegment: Q, selectSegmentCollection: I, selectAllVideoSegments: M };
}
function Cc(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, historyRef: c, onConflict: g, onDetailChange: u, onReload: f, recordHistoryAction: m, revealSegmentGroupForSelection: p, savingSegmentId: h, selectedGroups: y, selectedSegment: w, selectedSegmentIdRef: k, selectedSegments: E, selectionAnchorIdRef: Q, selectionRangeBaseIdsRef: I, setMergeConfirmation: M, setSaveMessage: N, setSelectedSegmentId: S, setSelectedSegmentIds: $, video: A } = e;
  function z() {
    M(null), requestAnimationFrame(() => {
      var R;
      return (R = a.current) == null ? void 0 : R.focus({ preventScroll: !0 });
    });
  }
  async function ie(R = !1, q = !1, re = null) {
    if (h != null) return;
    const ae = re || fi(
      y,
      { nativeOnly: !o }
    );
    if (!ae) {
      N("Select at least two segments from one swimlane.");
      return;
    }
    if (!R && qa()) {
      M(ae);
      return;
    }
    q && _a(!1);
    const xe = ae.endSec == null ? "open end" : Me(ae.endSec);
    let _ = ae.segments[0];
    const W = o ? null : $t(ae.segments, !1), de = o ? null : crypto.randomUUID(), Y = ae.segments.map((ve) => ve.id), fe = Td(i, ae.segments), he = r("merge", ae.segments[0].id);
    if (he) {
      z(), u(fe, A.id), $([_.id]), S(_.id), Q.current = _.id, I.current = [];
      try {
        const ve = ae.segments.slice(1);
        if (!o || _.nativeSegmentId != null) {
          const ne = ve.map((ce) => {
            const Z = `merge-native-selection:${A.id}:${_.id}:${ce.id}:${_.updatedAt}:${ce.updatedAt}`;
            return { key: Z, operationId: Fe(Z), segmentId: ce.id, expectedUpdatedAt: ce.updatedAt };
          }), me = await ee(`/videos/${A.id}/segments/merge-selection`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              survivorSegmentId: _.id,
              expectedSurvivorUpdatedAt: _.updatedAt,
              consumedSegments: ne.map(({ key: ce, ...Z }) => Z),
              historyReceiptId: de
            })
          });
          _ = me.survivor, u((ce) => la(ce, me), A.id), ne.forEach(({ key: ce }) => Ge(ce));
        } else {
          const ne = ve.map((ce) => {
            const Z = `merge-draft-selection:${A.id}:${_.itemId}:${ce.itemId}:${_.revision}:${ce.revision}`;
            return { key: Z, operationId: Fe(Z), itemId: ce.itemId, expectedRevision: ce.revision };
          }), me = await ee(`/videos/${A.id}/drafts/merge-selection`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              survivorItemId: _.itemId,
              expectedSurvivorRevision: _.revision,
              consumedDrafts: ne.map(({ key: ce, ...Z }) => Z)
            })
          });
          _ = me.survivor, u((ce) => la(ce, me), A.id), ne.forEach(({ key: ce }) => Ge(ce));
        }
        $([_.id]), S(_.id), Q.current = _.id, I.current = [], o ? t(Ht) : await m(
          "segments.merge",
          `Merged ${ae.segments.length} segments`,
          W,
          $t([_], !1),
          de
        ), p(_.id), N(`${ae.segments.length} segments merged into ${Me(ae.startSec)} – ${xe}.`);
      } catch (ve) {
        u((ne) => hi(
          no(ne, [ae.segments[0]], [
            "startSec",
            "endSec",
            "sourceKey",
            "sourceRunId",
            "confidence",
            "isDerived"
          ]),
          ae.segments.slice(1)
        ), A.id), $(Y), S((w == null ? void 0 : w.id) ?? Y[0] ?? null), Q.current = (w == null ? void 0 : w.id) ?? Y[0] ?? null, I.current = [], ve.status === 409 ? await g() : N(ve.message || "Unable to merge selected segments.");
      } finally {
        he();
      }
    }
  }
  function U(R, q = E, re = w) {
    if (q.length === 0) return Promise.resolve(null);
    const ae = dl(R, q, re), xe = Math.max(0, ae.identities.indexOf(ae.activeIdentity)), _ = Si(d()) != null, W = l({
      kind: "review",
      lockId: ae.activeIdentity.id,
      targets: ae.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (de) => T(de, {
        ...ae,
        identities: de.targets,
        activeIdentity: de.targets[xe]
      })
    });
    return W ? (_ && N(`${R === "approved" ? "Approval" : "Rejection"} queued…`), W.done) : Promise.resolve(null);
  }
  async function T({ detail: R, segments: q, onConflict: re, onReload: ae }, xe) {
    var Z;
    const _ = cl(xe, q);
    if (!_) {
      N("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: W, selectedSegments: de, selectedSegment: Y } = _, fe = ll(de, W), he = de.filter((te) => te.reviewState !== fe);
    if (he.length === 0) return;
    const ve = de.map((te) => ({
      id: te.id,
      itemId: te.itemId,
      nativeSegmentId: te.nativeSegmentId
    })), ne = ve.find((te) => te.id === (Y == null ? void 0 : Y.id)) || ve[0], me = (te, K = !1) => {
      if (!(te != null && te.segments) || !K && !Zr(k.current, ne.id))
        return;
      const se = ve.map((b) => Je(te == null ? void 0 : te.segments, b)).filter(Boolean), C = Je(te == null ? void 0 : te.segments, ne) || se[0] || null;
      $(se.map((b) => b.id)), S((C == null ? void 0 : C.id) ?? null), Q.current = (C == null ? void 0 : C.id) ?? null, I.current = [];
    };
    N(`Updating ${he.length} selected segment${he.length === 1 ? "" : "s"}…`);
    const ce = Jn();
    s({
      type: "add",
      entry: { id: ce, op: "patch", targets: he.map(rn), values: { reviewState: fe } }
    });
    try {
      const te = await ee(`/videos/${A.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: c.current.revision,
          reviewState: fe,
          segments: de.map((b) => b.published ? {
            nativeSegmentId: b.nativeSegmentId,
            expectedUpdatedAt: b.updatedAt
          } : {
            itemId: b.itemId,
            expectedRevision: b.revision
          })
        })
      }), K = new Map((te.items || []).map((b) => [
        b.requestedNativeSegmentId != null ? `native:${b.requestedNativeSegmentId}` : `item:${b.requestedItemId}`,
        b
      ]));
      if (ve.forEach((b) => {
        const x = K.get(b.nativeSegmentId != null ? `native:${b.nativeSegmentId}` : `item:${b.itemId}`);
        x && (b.nativeSegmentId = x.nativeSegmentId, b.itemId = x.itemId);
      }), te.history && t(te.history), fe === "rejected" || (te.items || []).some((b) => b.requestedNativeSegmentId != null && b.nativeSegmentId !== b.requestedNativeSegmentId)) {
        me(await ae()), s({ type: "settle", key: ce }), N(`${te.updatedCount} selected segment${te.updatedCount === 1 ? "" : "s"} ${fe === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const C = (b) => ({
        ...b,
        approvedSetVersion: te.approvedSetVersion || b.approvedSetVersion,
        segments: (b.segments || []).map((x) => {
          const v = K.get(x.nativeSegmentId != null ? `native:${x.nativeSegmentId}` : `item:${x.itemId}`);
          return v ? {
            ...x,
            id: v.nativeSegmentId != null ? v.nativeSegmentId : -v.itemId,
            itemId: v.itemId,
            nativeSegmentId: v.nativeSegmentId,
            published: v.nativeSegmentId != null,
            reviewState: fe,
            revision: v.nativeSegmentId != null ? x.revision : v.revision,
            updatedAt: v.updatedAt
          } : x;
        })
      });
      u(C, A.id), s({ type: "settle", key: ce }), me(C(R)), N(`${te.updatedCount} selected segment${te.updatedCount === 1 ? "" : "s"} ${fe === "approved" ? "approved" : fe === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (te) {
      s({ type: "discard", key: ce }), te.status === 409 && ((Z = te.payload) != null && Z.currentHistory) && t(te.payload.currentHistory);
      const K = te.status === 409 ? await re() : R;
      me(K, !0), N(te.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: z, mergeSelectedSwimlane: ie, saveSelectedReviewState: U };
}
function $c(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: g, detail: u, editorFilters: f, editorRef: m, cancelSaveTasks: p, dispatchPendingChanges: h, enqueueSave: y, exportingExamples: w, hideDerivedSegments: k, incorrectExamples: E, lineage: Q, materializeButtonRef: I, materializePreview: M, materializeRestoreFocusRef: N, materializing: S, mutateSegment: $, runSegmentMutation: A, pendingChanges: z, onConflict: ie, onDetailChange: U, onReload: T, performerSlots: R, recordHistoryAction: q, refreshMaterializationPreview: re, removingExampleId: ae, revealSegmentGroupForSelection: xe, savingSegmentId: _, segmentGroups: W, segments: de, selectedSegment: Y, selectedSegmentIdRef: fe, selectedSegments: he, selectionAnchorIdRef: ve, selectionRangeBaseIdsRef: ne, setAutoAssignError: me, setAutoAssignOpen: ce, setAutoAssigning: Z, setEditorFilters: te, setExportingExamples: K, setHideDerivedSegments: se, setIncorrectExamples: C, setMaterializeError: b, setMaterializeLoading: x, setMaterializeOpen: v, setMaterializePreview: P, setMaterializing: le, setRejectedDeletionPreview: j, setRemovingExampleId: G, setSaveMessage: J, setSelectedSegmentGroupKey: B, setSelectedSegmentId: H, setSelectedSegmentIds: F, video: V } = e;
  async function Te() {
    var $e, We, ut;
    if (he.length === 0 || !Y || _ != null) return;
    const X = Sd(he, E), oe = X.segments;
    if (oe.length === 0) return;
    const Ne = he.map((ke) => ({
      id: ke.id,
      itemId: ke.itemId,
      nativeSegmentId: ke.nativeSegmentId
    })), we = Ne.find((ke) => ke.id === Y.id) || Ne[0], be = [], qe = [];
    let Be = !1, _e = u, Ce = !1;
    const Ee = [], De = r("feedback", we.id);
    if (De) {
      J(X.action === "remove" ? `Removing ${oe.length} selected incorrect example${oe.length === 1 ? "" : "s"}…` : `Collecting ${oe.length} selected segment${oe.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const ke = async (Ae, Re) => {
          const Ve = Ae.nativeSegmentId != null, Ze = X.action === "remove" ? `incorrect-example-remove:${V.id}:${Re == null ? void 0 : Re.id}:${Re == null ? void 0 : Re.revision}:${Re == null ? void 0 : Re.representationRevision}` : `incorrect-example-collect:${V.id}:${Ve ? `native:${Ae.nativeSegmentId}:${Ae.updatedAt}` : `item:${Ae.itemId}:${Ae.revision}`}`;
          if (X.action === "remove" && !Re)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let it;
          try {
            it = X.action === "remove" ? await ee(
              `/videos/${V.id}/incorrect-examples/${Re.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: Fe(Ze),
                  expectedExampleRevision: Re.revision,
                  expectedRepresentationRevision: Re.representationRevision
                })
              }
            ) : await ee(`/videos/${V.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Fe(Ze),
                nativeSegmentId: Ve ? Ae.nativeSegmentId : null,
                itemId: Ve ? null : Ae.itemId,
                expectedUpdatedAt: Ve ? Ae.updatedAt : null,
                expectedRevision: Ve ? null : Ae.revision
              })
            });
          } catch (Pt) {
            throw Pt.operationKey = Ze, Pt;
          }
          if (!kd(X.action, it))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return Ge(Ze), it;
        };
        for (const Ae of oe) {
          const Re = X.action === "remove" ? E.find((Ve) => Ve.itemId != null && Ve.itemId === Ae.itemId) : null;
          try {
            const Ve = Ne.find((mt) => mt.id === Ae.id);
            let Ze = Je(
              _e == null ? void 0 : _e.segments,
              Ve
            ) || Ae, it;
            try {
              it = await ke(Ze, Re);
            } catch (mt) {
              if (mt.status === 409 && ((We = ($e = mt.payload) == null ? void 0 : $e.result) == null ? void 0 : We.code) === "OPERATION_REPLAYED")
                _e = await ee(
                  `/videos/${V.id}/editor`
                ), Ce = !0, Ee.length = 0, Ge(mt.operationKey), it = mt.payload.result;
              else {
                if (X.action !== "collect" || mt.status !== 409) throw mt;
                const ft = await ee(
                  `/videos/${V.id}/editor`
                );
                _e = ft, Ce = !0, Ee.length = 0;
                const Lt = Je(
                  ft == null ? void 0 : ft.segments,
                  Ve
                );
                if (!Lt) throw mt;
                Ze = Lt, it = await ke(Ze, null);
              }
            }
            Ve && it.itemId != null && (Ve.itemId = it.itemId), _e = yr(
              _e,
              it.editorDelta
            ), Ee.push(it.editorDelta);
            const Pt = { segment: Ae, result: it, example: Re };
            be.push(Pt);
          } catch (Ve) {
            if (qe.push(Ve), ![400, 404, 409].includes(Ve.status)) break;
          }
        }
        if (c && be.length > 0) {
          const Ae = X.action === "remove", Re = be.length;
          await q(
            Ae ? "feedback.remove" : "feedback.collect",
            Ae ? `Removed ${Re} incorrect AI example${Re === 1 ? "" : "s"}` : `Collected ${Re} incorrect AI example${Re === 1 ? "" : "s"}`,
            ur(be, Ae),
            ur(be, !Ae)
          ) || (Be = !0);
        }
        be.some(({ result: Ae }) => Ae.representation === "basicNativeBin") && Hn();
        const ze = Zr(
          fe.current,
          we.id
        ), Pe = X.action === "collect" && be.some(({ segment: Ae }) => Ae.id === we.id), pt = be.map(({ segment: Ae }) => Ae.id), Qe = Pe ? Zs(
          o,
          pt,
          we.id
        ) : null, rt = Pe ? (Qe == null ? void 0 : Qe.id) ?? null : we.id;
        ze && Pe && (F(Qe ? [Qe.id] : []), H((Qe == null ? void 0 : Qe.id) ?? xr), ve.current = (Qe == null ? void 0 : Qe.id) ?? null, ne.current = []);
        const It = await ee(`/videos/${V.id}/incorrect-examples`);
        C(It);
        const bt = _e;
        if (U(Ce ? bt : (Ae) => Ee.reduce(yr, Ae), V.id), ze && Zr(
          fe.current,
          rt
        )) {
          let Ae, Re;
          Pe ? (Re = Qe ? Je(bt == null ? void 0 : bt.segments, {
            id: Qe.id,
            itemId: Qe.itemId,
            nativeSegmentId: Qe.nativeSegmentId
          }) : null, Ae = Re ? [Re] : []) : (Ae = Ne.map((Ve) => Je(bt == null ? void 0 : bt.segments, Ve)).filter(Boolean), Re = Je(bt == null ? void 0 : bt.segments, we) || Ae[0] || null), F(Ae.map((Ve) => Ve.id)), H((Re == null ? void 0 : Re.id) ?? (Pe ? xr : null)), ve.current = (Re == null ? void 0 : Re.id) ?? null, ne.current = [], B(Re ? Et(o, Re.id) : null), Re && xe(Re.id);
        }
        if (qe.length > 0) {
          const Ae = ((ut = qe[0]) == null ? void 0 : ut.message) || "Only segments with registered AI provenance can be collected.";
          be.length === 0 ? J(Ae) : X.action === "remove" ? J(
            `Partially removed ${be.length} of ${oe.length} selected incorrect examples. ${Ae}`
          ) : J(
            `Partially collected ${be.length} of ${oe.length} selected segments. ${Ae}`
          );
        } else if (X.action === "remove")
          J(
            `${be.length} incorrect example${be.length === 1 ? "" : "s"} removed and ${be.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const Ae = be.filter(({ result: Re }) => Re.representation === "basicNativeBin").length;
          J(Ae === be.length ? `${be.length} incorrect AI example${be.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${be.length} incorrect AI example${be.length === 1 ? "" : "s"} collected and ${be.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        Be && J("The change saved, but editor history could not be updated.");
      } catch (ke) {
        J(ke.message || "Unable to update the selected incorrect examples.");
      } finally {
        De();
      }
    }
  }
  async function je(X) {
    var Ne, we;
    if (!X || ae != null || w) return;
    G(X.id);
    const oe = `incorrect-example-remove:${V.id}:${X.id}:${X.revision}:${X.representationRevision}`;
    try {
      let be, qe = !1;
      try {
        be = await ee(
          `/videos/${V.id}/incorrect-examples/${X.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(oe),
              expectedExampleRevision: X.revision,
              expectedRepresentationRevision: X.representationRevision
            })
          }
        );
      } catch (Ce) {
        if (Ce.status !== 409 || ((we = (Ne = Ce.payload) == null ? void 0 : Ne.result) == null ? void 0 : we.code) !== "OPERATION_REPLAYED")
          throw Ce;
        be = Ce.payload.result, qe = !0;
      }
      Ge(oe);
      let Be = !0;
      if (c) {
        const Ee = [{ segment: Je(u.segments, {
          itemId: X.itemId
        }) || {
          id: X.itemId == null ? null : -X.itemId,
          itemId: X.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: X.representationRevision
        }, result: be, example: X }];
        Be = await q(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          ur(Ee, !0),
          ur(Ee, !1)
        );
      }
      const _e = await ee(
        `/videos/${V.id}/incorrect-examples`
      );
      C(_e), qe ? await T() : U(
        (Ce) => yr(Ce, be.editorDelta),
        V.id
      ), X.representation === "basicNativeBin" && Hn(), J(Be ? qe ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : X.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (be) {
      be.status === 409 && await ie(), J(be.message || "Unable to remove the incorrect example.");
    } finally {
      G(null);
    }
  }
  async function Ie() {
    if (w || ae != null || E.length === 0) return;
    K(!0);
    const X = `incorrect-example-export:${V.id}:${E.map((oe) => `${oe.id}:${oe.revision}:${oe.representationRevision}`).join(",")}`;
    try {
      const oe = await Nd(
        V.id,
        E
      ), Ne = new FormData();
      Ne.append("metadata", JSON.stringify({
        operationId: Fe(X),
        examples: oe.captures
      }));
      for (const Ce of oe.files)
        Ne.append(Ce.fieldName, Ce.file);
      const we = await ee(
        `/videos/${V.id}/incorrect-examples/export`,
        { method: "POST", body: Ne }
      ), be = await Ul(we.downloadUrl), qe = URL.createObjectURL(be.blob), Be = document.createElement("a");
      Be.href = qe, Be.download = be.fileName, Be.click(), setTimeout(() => URL.revokeObjectURL(qe), 1e3);
      const _e = await ee(
        `/training-exports/${we.id}/complete`,
        { method: "POST" }
      );
      Ge(X), C(await ee(
        `/videos/${V.id}/incorrect-examples`
      )), J(
        `Downloaded ${we.exampleCount} incorrect example${we.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${_e.clearedExampleCount} from the working collection.`
      );
    } catch (oe) {
      J(oe.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      K(!1);
    }
  }
  async function Ue(X = null) {
    const oe = de.filter((De) => De.reviewState === "rejected"), Ne = oe.length, we = E.some((De) => De.representation === "fullItem");
    if (X == null && Ne === 0 && !we) {
      J("There are no rejected segments to delete.");
      return;
    }
    if (X == null) {
      const De = r("delete-rejected", -1);
      if (!De) return;
      J("Preparing deletion summary…");
      try {
        const $e = await ee(`/videos/${V.id}/rejected/deletion/preview`, { method: "POST" }), We = Number($e.deletedSegmentCount) || 0, ut = Number($e.deferredRejectedSegmentCount) || 0, ke = Number($e.protectedIncorrectExampleCount) || 0;
        if (We === 0) {
          ut > 0 ? J(
            `${ut} feedback-protected rejected segment${ut === 1 ? "" : "s"} kept. ${ke} AI feedback example${ke === 1 ? "" : "s"} must be exported before ${ut === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : J("There are no rejected segments to delete.");
          return;
        }
        if (!ii($e, J)) return;
        j($e), J("");
      } catch ($e) {
        J($e.message || "Unable to prepare rejected segment deletion.");
      } finally {
        De();
      }
      return;
    }
    const be = X, qe = Number(be.deferredRejectedSegmentCount) || 0, Be = fe.current, _e = qe === 0 ? $d(u, oe.map((De) => De.id)) : u, Ce = _e.segments.find((De) => De.reviewState === "unreviewed") || _e.segments[0] || null, Ee = r("delete-rejected", -1);
    if (Ee) {
      j(null), J("Deleting rejected segments…"), qe === 0 && (U(_e, V.id), F(Ce ? [Ce.id] : []), H((Ce == null ? void 0 : Ce.id) ?? null), ve.current = (Ce == null ? void 0 : Ce.id) ?? null, ne.current = []);
      try {
        const De = `rejected-dependency-delete:${V.id}:${be.fingerprint}`, $e = await ee(`/videos/${V.id}/rejected/deletion/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(De),
            fingerprint: be.fingerprint
          })
        });
        Ge(De), await T(), $e.deletedSegmentCount > 0 && t(Ht);
        const We = qe > 0 ? ` ${qe} feedback-protected rejected segment${qe === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
        J(`${$e.deletedSegmentCount} segment${$e.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${We}`);
      } catch (De) {
        qe === 0 && U(($e) => hi(
          $e,
          oe
        ), V.id), F(Be == null ? [] : [Be]), H(Be), ve.current = Be, ne.current = [], J(De.message || "Unable to delete rejected segments.");
      } finally {
        Ee();
      }
    }
  }
  async function Ke(X = i) {
    if (!(a || X.length === 0)) {
      Z(!0), me("");
      try {
        const oe = await ee(`/videos/${V.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: X.flatMap((Ne) => Ne.nativeSegmentId == null ? [] : [Ne.nativeSegmentId]),
            itemIds: X.flatMap((Ne) => Ne.published || Ne.itemId == null ? [] : [Ne.itemId])
          })
        });
        ce(!1), await T(), J(`${oe.assignedSegmentCount} segment${oe.assignedSegmentCount === 1 ? "" : "s"} received ${oe.assignedSlotCount} performer-slot assignment${oe.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (oe) {
        me(oe.message || "Unable to auto-assign performers.");
      } finally {
        Z(!1);
      }
    }
  }
  async function Oe() {
    v(!0), b(""), !M && (x(!0), re());
  }
  function Ye() {
    N.current = !0, v(!1), requestAnimationFrame(() => {
      var X;
      return (X = I.current) == null ? void 0 : X.focus({ preventScroll: !0 });
    });
  }
  async function dt() {
    if (!M || S || M.createCount + M.linkCount === 0)
      return;
    le(!0), b("");
    let X;
    try {
      const oe = `materialize-derived:${V.id}:${M.fingerprint}`;
      X = await ee(`/videos/${V.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(oe),
          fingerprint: M.fingerprint,
          maxDepth: 3
        })
      }), Ge(oe);
    } catch (oe) {
      oe.status === 409 && P(null), b(oe.message || "Unable to materialize derived segments."), le(!1);
      return;
    }
    P((oe) => oe && { ...oe, createCount: 0, linkCount: 0 });
    try {
      await T(), Ye(), P(null);
      const oe = X.createdCount + X.linkedCount;
      J(`${X.createdCount} derived segment${X.createdCount === 1 ? "" : "s"} created and ${X.linkedCount} existing segment${X.linkedCount === 1 ? "" : "s"} linked.`), oe === 0 && J("Every applicable derivation was already materialized.");
    } catch {
      b("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    le(!1);
  }
  async function Xe(X, oe = null) {
    var be, qe, Be, _e;
    const Ne = {
      tagId: X,
      ...oe ? { tagName: oe } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (he.length > 1) {
      const Ce = he.filter((ke) => ke.tagId !== X);
      if (Ce.length === 0) {
        d();
        return;
      }
      const Ee = he.map((ke) => ({
        id: ke.id,
        itemId: ke.itemId,
        nativeSegmentId: ke.nativeSegmentId
      })), De = he.map((ke) => !c || ke.nativeSegmentId != null ? `native:${ke.nativeSegmentId}:${ke.updatedAt}` : `item:${ke.itemId}:${ke.revision}`).sort().join(","), $e = `bulk-tag:${V.id}:${X}:${De}`, We = ga(
        u,
        Ce.map((ke) => ke.id),
        Ne
      ), ut = r("tag", (Y == null ? void 0 : Y.id) ?? Ce[0].id);
      if (!ut) return;
      J(`Changing tag for ${Ce.length} selected segment${Ce.length === 1 ? "" : "s"}…`), U(We, V.id), d();
      try {
        const ke = c ? null : crypto.randomUUID();
        await ee(`/videos/${V.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe($e),
            tagId: X,
            historyReceiptId: ke,
            segments: he.map((rt) => {
              const It = !c || rt.nativeSegmentId != null;
              return {
                nativeSegmentId: It ? rt.nativeSegmentId : null,
                itemId: It ? null : rt.itemId,
                expectedUpdatedAt: It ? rt.updatedAt : null,
                expectedRevision: It ? null : rt.revision
              };
            })
          })
        }), Ge($e);
        const ze = $t(
          he,
          c
        ), Pe = await T(), pt = Ee.map((rt) => Je(Pe == null ? void 0 : Pe.segments, rt)).filter(Boolean);
        await q(
          "segments.tag",
          `Changed tag for ${Ce.length} segment${Ce.length === 1 ? "" : "s"}`,
          ze,
          $t(pt, c),
          ke
        );
        const Qe = Ee.map((rt) => Je(Pe == null ? void 0 : Pe.segments, rt)).filter(Boolean);
        F(Qe.map((rt) => rt.id)), H(((be = Qe.find((rt) => rt.id === (Y == null ? void 0 : Y.id))) == null ? void 0 : be.id) ?? ((qe = Qe[0]) == null ? void 0 : qe.id) ?? null), d(), J(`${Ce.length} selected segment${Ce.length === 1 ? "" : "s"} retagged.`);
      } catch (ke) {
        U((pt) => no(
          pt,
          Ce,
          Object.keys(Ne)
        ), V.id);
        const ze = Ee.map((pt) => Je(u.segments, pt)).filter(Boolean), Pe = Je(u.segments, {
          id: Y == null ? void 0 : Y.id,
          itemId: Y == null ? void 0 : Y.itemId,
          nativeSegmentId: Y == null ? void 0 : Y.nativeSegmentId
        }) || ze[0] || null;
        F(ze.map((pt) => pt.id)), H((Pe == null ? void 0 : Pe.id) ?? null), ve.current = (Pe == null ? void 0 : Pe.id) ?? null, ne.current = [], ke.status === 409 && await ie(), J(ke.message || "Unable to change the selected segment tags.");
      } finally {
        ut();
      }
      return;
    }
    if (he.length !== 1 || !Y) return;
    const we = ki(z, Y);
    if (Y.id === g || we) {
      const Ce = we ? { segmentId: Y.id, tagId: we.values.tagId, tagName: we.meta.tagName } : null, Ee = fl(Ce, Y, X, oe);
      if (we && (p((De) => {
        var $e;
        return (($e = De.meta) == null ? void 0 : $e.pendingChangeId) === we.id;
      }), h({ type: "discard", key: we.id })), Ee && ct(Y, Ee), Ee) {
        const De = Wa(
          { ...Y, tagId: Ee.tagId },
          R,
          f,
          k,
          W
        );
        te(De.filters), se(De.hideDerivedSegments), J("Tag change queued…");
      } else we && J("");
      d();
      return;
    }
    if (X === Y.tagId) {
      d();
      return;
    }
    if (Y.itemId != null && ((_e = (Be = Q.data) == null ? void 0 : Be.children) == null ? void 0 : _e.length) > 0) {
      const Ce = r("lineage-tag", Y.id);
      if (!Ce) return;
      J("Checking lineage impact…");
      try {
        const Ee = await ee(`/items/${Y.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: Y.revision, tagId: X })
        }), De = Ee.deletedItemIds.length > 0 || Ee.removedEdgeIds.length > 0;
        if (De && !window.confirm(
          `Changing this tag removes ${Ee.removedEdgeIds.length} lineage edge${Ee.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${Ee.deletedItemIds.length} derived segment${Ee.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
        )) {
          J("Tag change canceled.");
          return;
        }
        const $e = ga(
          u,
          [Y.id],
          Ne
        );
        U($e, V.id), d();
        const We = `tag-change:${Y.itemId}:${Y.revision}:${Ee.componentFingerprint}:${X}`;
        await ee(`/items/${Y.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(We),
            expectedRevision: Y.revision,
            componentFingerprint: Ee.componentFingerprint,
            tagId: X
          })
        }), Ge(We), await T(), d(), J(De ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch (Ee) {
        U((De) => no(
          De,
          [Y],
          Object.keys(Ne)
        ), V.id), F([Y.id]), H(Y.id), ve.current = Y.id, ne.current = [], Ee.status === 409 ? (J("Lineage changed — loading the latest segments…"), await ie()) : J(Ee.message || "Unable to reconcile the lineage.");
      } finally {
        Ce();
      }
      return;
    }
    d(), await $(Y, {
      startSec: Y.startSec,
      endSec: Y.endSec,
      tagId: X
    }, !0, null, !0, Ne);
  }
  function ct(X, oe) {
    const Ne = Jn();
    h({
      type: "add",
      entry: {
        id: Ne,
        op: "patch",
        targets: [rn(X)],
        values: { tagId: oe.tagId, tagName: oe.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: oe.tagName }
      }
    });
    const we = z.find((be) => be.op === "insert" && be.segment.id === X.id);
    y({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [rn(X)],
      dependsOn: (we == null ? void 0 : we.taskId) ?? null,
      meta: { pendingChangeId: Ne },
      ready: (be, qe) => {
        const Be = xi(be.segments, qe.targets[0]);
        return !Be || yl(be, Be.id);
      },
      run: (be) => nt(be, Ne, oe)
    });
  }
  async function nt(X, oe, Ne) {
    const [we] = X.resolveTargets();
    if (!we || we.tagId === Ne.tagId) {
      h({ type: "discard", key: oe });
      return;
    }
    await A(we, {
      startSec: we.startSec,
      endSec: we.endSec,
      tagId: Ne.tagId
    }, {
      pendingChangeId: oe,
      restoreSelectionOnFailure: !1,
      onReload: X.onReload,
      onConflict: X.onConflict
    }) || J(`The new segment was not retagged${Ne.tagName ? ` to ${Ne.tagName}` : ""}. Choose its tag again.`);
  }
  async function st() {
    var _e, Ce, Ee, De;
    if (!l || !Y || _ != null) return;
    const X = [...he].sort(($e, We) => Number($e.nativeSegmentId ?? $e.id) - Number(We.nativeSegmentId ?? We.id)), oe = new Set(X.map(($e) => $e.id)), Ne = X.map(($e) => `${$e.nativeSegmentId ?? $e.id}:${$e.updatedAt}`).join("|"), we = r("bin", Y.id);
    if (!we) return;
    J(`Moving ${X.length} segment${X.length === 1 ? "" : "s"} to recycling bin…`);
    const be = `bulk-move:${V.id}:${Ne}`, qe = Fe(be), Be = c ? null : crypto.randomUUID();
    try {
      const $e = (ze = !1) => ee(`/videos/${V.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: qe,
          segments: X.map((Pe) => ({
            segmentId: Pe.nativeSegmentId ?? Pe.id,
            expectedUpdatedAt: Pe.updatedAt
          })),
          discardMissingImage: ze,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: Be
        })
      });
      let We;
      try {
        We = await $e(
          uo(be)
        );
      } catch (ze) {
        if (((_e = ze.payload) == null ? void 0 : _e.code) !== "missing-image" || !window.confirm(`${ze.message}

Continue and discard the missing image reference?`)) throw ze;
        mo(be), We = await $e(!0);
      }
      Ge(be), Hn();
      const ut = new Map((We.items || []).map((ze) => [
        Number(ze.segmentId),
        ze
      ]));
      await q(
        "segments.moveToBin",
        `Moved ${X.length} segment${X.length === 1 ? "" : "s"} to recycling bin`,
        $t(X, !1),
        $t(X.map((ze) => {
          const Pe = ut.get(
            Number(ze.nativeSegmentId ?? ze.id)
          );
          return {
            ...ze,
            recycleBinItemId: (Pe == null ? void 0 : Pe.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (Pe == null ? void 0 : Pe.revision) ?? null
          };
        }), !1),
        Be
      );
      const ke = Qs(o, oe, Y.id);
      U((ze) => ({
        ...ze,
        segments: (ze.segments || []).filter((Pe) => !oe.has(Pe.id))
      }), V.id), F(ke ? [ke.id] : []), H((ke == null ? void 0 : ke.id) ?? null), ve.current = (ke == null ? void 0 : ke.id) ?? null, ne.current = [], ke && (B(Et(o, ke.id)), xe(ke.id)), requestAnimationFrame(() => {
        var ze;
        return (ze = m.current) == null ? void 0 : ze.focus({ preventScroll: !0 });
      }), J(`Moved ${X.length} segment${X.length === 1 ? "" : "s"} to recycling bin.`);
    } catch ($e) {
      const We = ((Ce = $e.payload) == null ? void 0 : Ce.code) || ((De = (Ee = $e.payload) == null ? void 0 : Ee.result) == null ? void 0 : De.code);
      $e.status === 409 && We === "CANONICAL_SEGMENT_CHANGED" ? await ie() : J($e.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      we();
    }
  }
  async function et() {
    if (!(c || s.current || _ != null)) {
      s.current = !0, J("Checking the recycling bin…");
      try {
        const X = await ee("/bin"), oe = await li(X, () => J("Emptying the recycling bin…"));
        if (oe.status === "empty") {
          J("The recycling bin is empty.");
          return;
        }
        if (oe.status === "canceled") {
          J("The recycling bin was not emptied.");
          return;
        }
        J(`${oe.segmentCount} segment${oe.segmentCount === 1 ? "" : "s"} from ${oe.sceneCount} scene${oe.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (X) {
        J(X.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: Te, removeIncorrectExample: je, captureTrainingExport: Ie, deleteRejectedSegments: Ue, autoAssignPerformers: Ke, previewDerivedSegments: Oe, closeMaterializeDialog: Ye, materializeDerivedSegments: dt, saveTag: Xe, moveToBin: st, emptyRecyclingBin: et };
}
function Tc(e) {
  const { acceptHistory: t, acquireSaveLock: r, commonActionsRef: o, compatibilityMode: i, currentTime: a, detail: s, editorLayout: l, focusRowRef: d, history: c, historyRef: g, historySaving: u, horizontalLayoutSize: f, mediaStackHeight: m, mediaStackRef: p, onDetailChange: h, onReload: y, railToggleRef: w, recordHistoryAction: k, savingSegmentId: E, savingShot: Q, savingShotRef: I, setCollapsedSegmentGroups: M, setEditorLayout: N, setHistorySaving: S, setIncorrectExamples: $, setSaveMessage: A, setSavingShot: z, shotBoundaries: ie, timelineDuration: U, video: T, workspaceRef: R } = e;
  async function q(C, b, x) {
    var j, G, J, B;
    const v = C.type === "segment" ? [C] : C.segments || [], P = (b == null ? void 0 : b.type) === "segment" ? [b] : (b == null ? void 0 : b.segments) || [];
    let le = x;
    for (const [H, F] of v.entries()) {
      const V = P[H], Te = ((j = F.identity) == null ? void 0 : j.nativeSegmentId) != null || ((G = F.identity) == null ? void 0 : G.published) === !0, je = ((J = V == null ? void 0 : V.identity) == null ? void 0 : J.recycleBinItemId) ?? ((B = V == null ? void 0 : V.identity) == null ? void 0 : B.itemId);
      let Ie = Je(le.segments, V == null ? void 0 : V.identity) || Je(le.segments, F.identity);
      if (!Ie && Te && je != null && V.identity.revision != null) {
        const Oe = `history-restore:${T.id}:${je}:${V.identity.revision}`;
        await ee(`/bin/${je}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(Oe),
            expectedRevision: V.identity.revision
          })
        }), Ge(Oe), le = await y(), Ie = le.segments.find((Ye) => Ye.tagId === F.values.tagId && Ye.startSec === F.values.startSec && Ye.endSec === F.values.endSec);
      }
      if (!Ie)
        throw new Error("A segment in this history state no longer exists.");
      if ((Ie.nativeSegmentId != null || Ie.published === !0) !== Te) {
        if (Te) {
          const Oe = Ie.recycleBinItemId ?? Ie.itemId ?? je;
          if (Oe == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Ye = `history-restore:${T.id}:${Oe}:${Ie.revision}:${F.values.reviewState ?? "native"}`;
          await ee(`/bin/${Oe}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(Ye),
              expectedRevision: Ie.revision
            })
          }), Ge(Ye);
        } else {
          const Oe = `history-bin:${T.id}:${Ie.nativeSegmentId}:${Ie.updatedAt}:${F.values.reviewState}`;
          await ee(`/videos/${T.id}/segments/${Ie.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(Oe),
              expectedUpdatedAt: Ie.updatedAt,
              reviewState: F.values.reviewState
            })
          }), Ge(Oe);
        }
        if (le = await y(), !Te)
          continue;
        if (Ie = Je(le.segments, F.identity) || le.segments.find((Oe) => Oe.tagId === F.values.tagId && Oe.startSec === F.values.startSec && Oe.endSec === F.values.endSec), !Ie)
          throw new Error("The restored segment could not be found.");
      }
      const Ke = F.values;
      if (Ie.nativeSegmentId == null && Ie.itemId != null) {
        const Oe = `history-draft-update:${T.id}:${Ie.itemId}:${Ie.revision}:${Ke.tagId}:${Ke.startSec}:${Ke.endSec ?? "open"}:${Ke.reviewState}`;
        await ee(`/videos/${T.id}/drafts/${Ie.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(Oe),
            expectedRevision: Ie.revision,
            ...Ke
          })
        }), Ge(Oe);
      } else
        await ee(`/videos/${T.id}/segments/${Ie.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Ke, expectedUpdatedAt: Ie.updatedAt })
        });
      le = await y();
    }
    return le;
  }
  async function re(C, b) {
    var x;
    for (const v of C.targets || []) {
      const P = Je(b.segments, v.identity);
      if (!P)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const le = (x = b.performerSlotRevisions) == null ? void 0 : x[P.id];
      await ee(P.published ? `/videos/${T.id}/segments/${P.nativeSegmentId}/slots` : `/videos/${T.id}/drafts/${P.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: le,
          assignments: v.assignments
        })
      }), b = await y();
    }
    return b;
  }
  async function ae(C, b, x) {
    if (!i)
      throw new Error("AI feedback history is only available in Full mode.");
    let v = b, P = await ee(`/videos/${T.id}/incorrect-examples`);
    const le = (j) => P.find((G) => {
      var J;
      return G.id === j.exampleId || ((J = j.collectedIdentity) == null ? void 0 : J.itemId) != null && G.itemId === j.collectedIdentity.itemId;
    });
    for (const [j, G] of (C.entries || []).entries()) {
      const J = `history-feedback:${T.id}:${x.action.sequence}:${x.direction}:${j}`, B = le(G);
      if (C.collected && B) {
        Ge(J);
        continue;
      }
      let H;
      if (C.collected) {
        const F = Je(
          v.segments,
          G.collectedIdentity
        ) || Je(
          v.segments,
          G.originalIdentity
        );
        if (!F)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const V = F.nativeSegmentId != null;
        H = await ee(`/videos/${T.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(J),
            nativeSegmentId: V ? F.nativeSegmentId : null,
            itemId: V ? null : F.itemId,
            expectedUpdatedAt: V ? F.updatedAt : null,
            expectedRevision: V ? null : F.revision
          })
        });
      } else {
        if (!B) {
          Ge(J);
          continue;
        }
        H = await ee(
          `/videos/${T.id}/incorrect-examples/${B.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(J),
              expectedExampleRevision: B.revision,
              expectedRepresentationRevision: B.representationRevision
            })
          }
        );
      }
      Ge(J), v = yr(
        v,
        H.editorDelta
      ), P = await ee(
        `/videos/${T.id}/incorrect-examples`
      );
    }
    return $(P), v;
  }
  async function xe(C, b, x = []) {
    const v = C.state;
    if (!i && ((v == null ? void 0 : v.type) === "segment" || (v == null ? void 0 : v.type) === "segments")) {
      const le = `basic-history:${T.id}:${g.current.revision}:${C.action.sequence}:${C.direction}`, j = await ee(`/videos/${T.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(le),
          expectedHistoryRevision: g.current.revision,
          actionSequence: C.action.sequence,
          direction: C.direction
        })
      });
      return t(j.history), x.push(le), y();
    }
    const P = C.direction === "backward" ? C.action.afterState : C.action.beforeState;
    if ((v == null ? void 0 : v.type) === "composite") {
      let le = b;
      const j = (P == null ? void 0 : P.type) === "composite" ? P.states || [] : [];
      for (const [G, J] of (v.states || []).entries()) {
        const B = j[G];
        le = await xe({
          ...C,
          state: J,
          action: {
            ...C.action,
            beforeState: C.direction === "backward" ? J : B,
            afterState: C.direction === "backward" ? B : J
          }
        }, le, x);
      }
      return le;
    }
    if ((v == null ? void 0 : v.type) === "segment" || (v == null ? void 0 : v.type) === "segments")
      return q(
        v,
        P,
        b
      );
    if ((v == null ? void 0 : v.type) === "performerSlots")
      return re(v, b);
    if ((v == null ? void 0 : v.type) === "incorrectExamples")
      return ae(v, b, C);
    if ((v == null ? void 0 : v.type) === "shots") {
      const le = zn(b.shotBoundaries || []), j = await ee(`/videos/${T.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(`history-shots:${T.id}:${le}:${v.fingerprint}`),
          expectedFingerprint: le,
          boundaries: v.boundaries
        })
      });
      return { ...b, shotBoundaries: j };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function _(C) {
    var v;
    if (u || E != null || Q || C === c.cursorSequence)
      return;
    const b = td(c, C);
    if (b.length === 0) return;
    const x = r("history", -1);
    if (x) {
      S(!0), A(`Restoring ${b.length} history ${b.length === 1 ? "action" : "actions"}…`);
      try {
        let P = s;
        const le = [];
        for (const G of b)
          P = await xe(
            G,
            P,
            le
          );
        const j = i ? await ee(`/videos/${T.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: g.current.revision,
            targetSequence: C
          })
        }) : g.current;
        le.forEach(Ge), t(j), await y(), A("History restored.");
      } catch (P) {
        P.status === 409 && ((v = P.payload) != null && v.current) && t(P.payload.current), await y(), A(P.message || "Unable to restore editor history.");
      } finally {
        x(), S(!1);
      }
    }
  }
  function W(C) {
    N((b) => ({ ...b, timelineRatio: lo(C, m) }));
  }
  function de(C) {
    var v, P;
    const b = (v = p.current) == null ? void 0 : v.getBoundingClientRect();
    if (!b) return;
    const x = ((P = o.current) == null ? void 0 : P.offsetHeight) || 0;
    W(Fs(
      C.clientY,
      b.top + x,
      Math.max(0, b.height - x)
    ));
  }
  function Y(C) {
    C.currentTarget.setPointerCapture(C.pointerId), de(C);
  }
  function fe(C) {
    C.currentTarget.hasPointerCapture(C.pointerId) && de(C);
  }
  function he(C) {
    const b = C.shiftKey ? 0.1 : 0.05;
    let x = null;
    C.key === "ArrowUp" && (x = l.timelineRatio + b), C.key === "ArrowDown" && (x = l.timelineRatio - b);
    const v = so(m);
    C.key === "Home" && (x = v.minimum), C.key === "End" && (x = v.maximum), x != null && (C.preventDefault(), C.stopPropagation(), W(x));
  }
  function ve(C) {
    const b = C === "detailWidth" ? f.focusRow : f.workspace, x = f.workspace > 0 ? Yr(f.workspace, 600) : 560, v = tn(l.markerRailWidth, x), P = C === "detailWidth" ? 344 + (l.markerRailOpen ? v + 24 : 0) : 600;
    return b > 0 ? Yr(b, P) : 560;
  }
  function ne(C, b) {
    N((x) => ({ ...x, [C]: tn(b, ve(C)) }));
  }
  function me(C, b) {
    var v, P;
    const x = b === "detailWidth" ? (v = d.current) == null ? void 0 : v.getBoundingClientRect() : (P = R.current) == null ? void 0 : P.getBoundingClientRect();
    x && ne(b, b === "detailWidth" ? C.clientX - x.left : x.right - C.clientX);
  }
  function ce(C, b) {
    const x = ve(C), v = tn(l[C], x);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": b,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(x),
      "aria-valuenow": Math.round(v),
      "aria-valuetext": `${Math.round(v)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (P) => {
        P.currentTarget.setPointerCapture(P.pointerId), me(P, C);
      },
      onPointerMove: (P) => {
        P.currentTarget.hasPointerCapture(P.pointerId) && me(P, C);
      },
      onKeyDown: (P) => {
        const le = P.shiftKey ? 40 : 16;
        let j = null;
        P.key === "ArrowLeft" && (j = C === "detailWidth" ? -le : le), P.key === "ArrowRight" && (j = C === "detailWidth" ? le : -le);
        let G = j == null ? null : v + j;
        P.key === "Home" && (G = 240), P.key === "End" && (G = x), G != null && (P.preventDefault(), P.stopPropagation(), ne(C, G));
      },
      onDoubleClick: () => ne(C, wt[C]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function Z() {
    N((C) => ({ ...C, markerRailOpen: !C.markerRailOpen })), requestAnimationFrame(() => {
      var C;
      return (C = w.current) == null ? void 0 : C.focus({ preventScroll: !0 });
    });
  }
  function te(C) {
    M((b) => b.includes(C) ? b.filter((x) => x !== C) : Jt([...b, C]));
  }
  async function K(C, b = !0, x = a) {
    var j;
    if (I.current) return null;
    const v = Number((j = T.videoFile) == null ? void 0 : j.duration) || U, P = zn(ie), le = `shot-${C}:${T.id}:${x.toFixed(3)}:${v.toFixed(3)}:${P}`;
    I.current = !0, z(!0), A(C === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const G = await ee(`/videos/${T.id}/shot-boundaries/${C}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(C === "split" ? { operationId: Fe(le), timeSec: x } : { operationId: Fe(le), timeSec: x })
      });
      return Ge(le), h((J) => ({ ...J, shotBoundaries: G }), T.id), b && await k(
        "shots.update",
        C === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: ie,
          fingerprint: P
        },
        {
          type: "shots",
          boundaries: G,
          fingerprint: zn(G)
        }
      ), A(C === "split" ? "Shot boundary added." : "Shots merged."), G;
    } catch (G) {
      return A(G.message || "Unable to edit shot boundaries."), null;
    } finally {
      I.current = !1, z(!1);
    }
  }
  async function se(C) {
    if (I.current) return null;
    const b = `shot-restore:${T.id}:${C.afterFingerprint}`;
    I.current = !0, z(!0), A("Undoing shot edit…");
    try {
      const x = await ee(`/videos/${T.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(b),
          expectedFingerprint: C.afterFingerprint,
          boundaries: C.before
        })
      });
      return Ge(b), h((v) => ({ ...v, shotBoundaries: x }), T.id), x;
    } catch (x) {
      return A(x.message || "Unable to undo the shot edit."), null;
    } finally {
      I.current = !1, z(!1);
    }
  }
  return { applySegmentHistoryState: q, applyPerformerSlotHistoryState: re, applyHistoryState: xe, restoreHistoryTarget: _, updateTimelineRatio: W, updateTimelineRatioFromPointer: de, handleSeparatorPointerDown: Y, handleSeparatorPointerMove: fe, handleSeparatorKeyDown: he, panelWidthMaximum: ve, updatePanelWidth: ne, handlePanelSeparatorPointer: me, panelSeparatorProps: ce, toggleSegmentRail: Z, toggleSegmentGroup: te, mutateShotBoundary: K, restoreShotBoundaries: se };
}
function Ac(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: u, lineage: f, mediaDuration: m, mergeSelectedSwimlane: p, moveToBin: h, mutateShotBoundary: y, openPublishApprovedDialog: w, playbackControlsRef: k, playbackShortcutConfig: E, saveSelectedReviewState: Q, seekRef: I, segmentGroupKeys: M, selectSegment: N, selectedSegment: S, selectedSegmentGroupForSegment: $, selectedSegmentGroupKey: A, selectedSegments: z, setCollapsedSegmentGroups: ie, setIncorrectExamplesOpen: U, setQuickSearchOpen: T, setSaveMessage: R, setSelectedSegmentGroupKey: q, setTagEditing: re, setTimelineZoom: ae, shotBoundaries: xe, slotButtonRef: _, splitSegment: W, swimlanes: de, timelineDuration: Y, toggleIncorrectExample: fe, toggleSegmentGroup: he, updateTimelineRatio: ve, videoFrameRate: ne, visibleSegments: me } = e;
  function ce(K) {
    var se, C;
    (se = k.current) == null || se.pause(), (C = k.current) == null || C.seekBy(vl(K, ne));
  }
  function Z(K, se) {
    if (z.length > 1 && rl(K.id))
      return;
    let C = null;
    K.id === "video.playPause" && (C = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.toggle();
    }), K.id === "video.seekSmallBackward" && (C = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(-E.smallSeekTime);
    }), K.id === "video.seekSmallForward" && (C = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(E.smallSeekTime);
    }), K.id === "video.seekMediumBackward" && (C = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(-E.mediumSeekTime);
    }), K.id === "video.seekMediumForward" && (C = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(E.mediumSeekTime);
    }), K.id === "video.seekLongBackward" && (C = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(-E.longSeekTime);
    }), K.id === "video.seekLongForward" && (C = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(E.longSeekTime);
    }), K.id === "video.playSelected" && S && (C = () => {
      var b;
      (b = I.current) == null || b.call(I, S.startSec, !0), requestAnimationFrame(() => {
        var x;
        return (x = g.current) == null ? void 0 : x.focus({ preventScroll: !0 });
      });
    }), (K.id === "video.playPreviousSegment" || K.id === "video.playNextSegment") && (C = () => {
      var x;
      const b = to(
        de,
        S == null ? void 0 : S.id,
        K.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !b || b.id === (S == null ? void 0 : S.id) || (N(b, { focusEditor: !0, seekToSegment: !1 }), (x = I.current) == null || x.call(I, b.startSec, !0));
    }), K.id.startsWith("video.seekPercent") && (C = () => {
      var x;
      const b = Number(K.id.slice(17)) / 10;
      (x = I.current) == null || x.call(I, Xs(m ?? Y, b), !1);
    }), K.id === "video.jumpToSegmentStart" && S && (C = () => {
      var b;
      return (b = I.current) == null ? void 0 : b.call(I, S.startSec, !1);
    }), K.id === "video.jumpToSegmentEnd" && S && (C = () => {
      var b;
      return (b = I.current) == null ? void 0 : b.call(I, S.endSec ?? S.startSec, !1);
    }), K.id === "video.jumpToVideoStart" && (C = () => {
      var b;
      return (b = I.current) == null ? void 0 : b.call(I, 0, !1);
    }), K.id === "video.jumpToVideoEnd" && (C = () => {
      var b;
      return (b = I.current) == null ? void 0 : b.call(I, Y, !1);
    }), K.id.startsWith("video.frame") && (C = () => {
      const b = K.id.includes("Small") ? "small" : K.id.includes("Medium") ? "medium" : "long", x = E[`${b}FrameStep`] * (K.id.endsWith("Backward") ? -1 : 1);
      ce(x);
    }), K.id.startsWith("navigation.swimlane") && (C = () => {
      const b = K.id.slice(19).toLowerCase(), x = to(de, S == null ? void 0 : S.id, b, s);
      x && N(x, { focusEditor: !0, seekToSegment: !1 });
    }), (K.id === "navigation.extendSwimlaneLeft" || K.id === "navigation.extendSwimlaneRight") && (C = () => {
      const b = bd(
        t,
        S == null ? void 0 : S.id,
        K.id.endsWith("Left") ? "left" : "right"
      );
      b && N(b.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: b.segmentIds
      });
    }), (K.id === "navigation.segmentGroupUp" || K.id === "navigation.segmentGroupDown") && (C = () => {
      const b = hd(
        M,
        A ?? $,
        K.id.endsWith("Up") ? -1 : 1
      );
      b && q(b);
    }), (K.id === "navigation.previousAtPlayhead" || K.id === "navigation.nextAtPlayhead") && (C = () => {
      const b = js(me, s, K.id === "navigation.previousAtPlayhead" ? -1 : 1, S == null ? void 0 : S.id);
      b && N(b, { focusEditor: !0, seekToSegment: !1 });
    }), K.id === "navigation.nearestInCurrentSwimlane" && (C = () => {
      const b = $s(
        de,
        S == null ? void 0 : S.id,
        s
      );
      b && N(b, { focusEditor: !0, seekToSegment: !1 });
    }), K.id.includes("Unreviewed") && (C = () => {
      const b = hr(
        de,
        S == null ? void 0 : S.id,
        K.id.startsWith("navigation.previous") ? -1 : 1,
        K.id.endsWith("Global")
      );
      b && N(b, { focusEditor: !se.preserveFocus, seekToSegment: !1 });
    }), (K.id === "navigation.nextTouchingPlayhead" || K.id === "navigation.previousTouchingPlayhead") && (C = () => {
      const b = Cs(de, s, K.id === "navigation.previousTouchingPlayhead" ? -1 : 1, S == null ? void 0 : S.id);
      b && N(b, { focusEditor: !0, seekToSegment: !1 });
    }), K.id === "navigation.quickSearch" && (C = () => T(!0)), (K.id === "navigation.previousShot" || K.id === "navigation.nextShot") && (C = () => {
      var x;
      const b = hl(xe, s, K.id === "navigation.previousShot" ? -1 : 1);
      b && ((x = I.current) == null || x.call(I, b.startSec, !1));
    }), K.id === "shot.split" && (C = () => y("split")), K.id === "shot.merge" && (C = () => y("merge")), K.id === "marker.create" && (C = () => a()), K.id === "marker.duplicate" && (C = () => d(!1)), K.id === "marker.duplicateAtPlayhead" && (C = () => d(!0)), K.id === "marker.split" && (C = () => W()), K.id === "marker.editTag" && (C = () => {
      var b;
      if (z.length > 1 && z.some((x) => x.isDerived)) {
        R("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((b = f.data) != null && b.tagReadOnly) {
        R("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      re(!0);
    }), K.id === "marker.setStart" && S && (C = () => r(s, S.endSec)), K.id === "marker.setEnd" && S && (C = () => r(S.startSec, s)), K.id === "marker.copyTiming" && S && (C = () => {
      R(Vd(S) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), K.id === "marker.pasteTiming" && S && (C = () => {
      const b = Wd();
      if (!b) {
        R("No copied segment timing is available.");
        return;
      }
      r(b.startSec, b.endSec);
    }), K.id === "marker.mergeSelection" && (C = () => p()), K.id === "marker.moveToBin" && (C = () => h()), K.id === "marker.toggleIncorrectExample" && S && (C = () => fe()), K.id === "marker.openIncorrectExamples" && (C = () => U(!0)), K.id === "markerGroup.toggleCollapse" && A && (C = () => he(A)), K.id === "markerGroup.toggleAll" && (C = () => ie((b) => yd(b, M))), K.id === "marker.assignSlots" && (C = () => {
      var b;
      return (b = _.current) == null ? void 0 : b.click();
    }), K.id === "navigation.zoomIn" && (C = () => ae((b) => vr(b + 0.5))), K.id === "navigation.zoomOut" && (C = () => ae((b) => vr(b - 0.5))), K.id === "navigation.resetZoom" && (C = () => ae(1)), K.id === "navigation.centerPlayhead" && (C = () => {
      var b;
      return (b = o.current) == null ? void 0 : b.call(o);
    }), K.id === "layout.growSwimlanes" && (C = () => ve(c.timelineRatio + 0.05)), K.id === "layout.shrinkSwimlanes" && (C = () => ve(c.timelineRatio - 0.05)), K.id === "marker.confirm" && S && (C = () => Q("approved")), K.id === "system.publishApproved" && (C = () => w(se.target)), K.id === "marker.reject" && S && (C = () => Q("rejected")), K.id === "system.emptyBin" && (C = () => u()), K.id === "system.deleteRejected" && (C = () => l()), C && C();
  }
  function te(K, se) {
    const C = Yn.find((b) => b.id === K);
    C && An(C, i) && Z(C, se);
  }
  return {
    executeShortcutById: te,
    stepVideoFrame: (K) => ce(K < 0 ? -1 : 1)
  };
}
function xa(e) {
  return e === !0;
}
function Sa() {
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
function Rc(e, t, r = !1, o = 0, i = "") {
  const [a, s] = L(null), [l, d] = L(null), [c, g] = L(""), [u, f] = L({
    busy: !1,
    reviewState: null,
    error: ""
  }), m = pe(null);
  async function p(w) {
    f({ busy: !0, reviewState: w, error: "" });
    try {
      await ee(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: eo(), reviewState: w })
      }), await t(), f({ busy: !1, reviewState: null, error: "" });
    } catch (k) {
      f({
        busy: !1,
        reviewState: null,
        error: k.message || "Unable to import Cove segments."
      });
    }
  }
  async function h(w) {
    try {
      const k = await ee(`/videos/${e}/analysis-runs`, {
        signal: w.signal
      });
      if (!w.isActive()) return null;
      const E = (k == null ? void 0 : k[0]) || null;
      return s(E), (E == null ? void 0 : E.status) === "completed" && m.current !== E.id && (m.current = E.id, await t()), ((E == null ? void 0 : E.status) === "failed" || (E == null ? void 0 : E.status) === "cancelled") && g(E.errorMessage || "Video analysis did not complete."), E;
    } catch (k) {
      return w.isActive() && k.name !== "AbortError" && g(k.message || "Unable to load video analysis status."), null;
    }
  }
  async function y(w = null) {
    g("");
    const k = w || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), E = k.includes("omnishotcut") && o > 0;
    if (!(E && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const Q = await ee(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: k,
            replaceShotBoundaries: E,
            expectedShotBoundaryFingerprint: E ? i : null
          })
        });
        s(Q);
      } catch (Q) {
        g(Q.message || "Unable to start video analysis.");
      }
  }
  return ye(() => {
    if (!xa(r)) {
      s(null), d(null), g("");
      return;
    }
    const w = Sa();
    return h(w), ee("/analysis/status", { signal: w.signal }).then((k) => {
      w.isActive() && (d(k), k.configured || g(""));
    }).catch((k) => {
      w.isActive() && k.name !== "AbortError" && g(k.message || "Unable to check video analysis readiness.");
    }), w.dispose;
  }, [e, r]), ye(() => {
    if (!xa(r) || (a == null ? void 0 : a.status) !== "queued" && (a == null ? void 0 : a.status) !== "running") return;
    const w = Sa();
    let k = setTimeout(async function E() {
      await h(w), w.isActive() && (k = setTimeout(E, 2500));
    }, 2500);
    return () => {
      clearTimeout(k), w.dispose();
    };
  }, [a == null ? void 0 : a.id, a == null ? void 0 : a.status, r]), {
    analysisError: c,
    analysisRun: a,
    analysisStatus: l,
    importNativeSegments: p,
    nativeImportState: u,
    startFullAnalysis: y
  };
}
const Kn = Object.freeze([]);
function Mc(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Ec({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var Po, Lo, Fo, jo, Bo;
  const [g, u] = L(null), [f, m] = L([]), p = pe(null), h = pe(null), y = pe([]), w = pe(null), [k, E] = L(() => Tt({})), [Q, I] = L(!1), [M, N] = L(el), [S, $] = L(0), A = pe(null), [z] = L(() => Rd({
    getContext: () => A.current,
    drainAfterSettle: !1
  })), ie = jl(z.subscribe, z.getSnapshot), U = Si(ie), T = (O, ue) => z.acquire({ kind: O, lockId: ue }), R = (O) => z.enqueue(O), q = (O) => z.cancel(O), re = (O, ue) => z.retarget(O, ue), ae = z.getSnapshot, [xe, _] = Fl(Bd, []), [W, de] = L(!1), [Y, fe] = L(""), [he, ve] = L(""), [ne, me] = L(""), [ce, Z] = L(1), [te, K] = L(zd), [se, C] = L(0), [b, x] = L({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [v, P] = L(Ht), le = pe(Ht), [j, G] = L(!1), [J, B] = L(!1), [H, F] = L(!1), V = pe(!1);
  V.current = H;
  const [Te, je] = L(null), [Ie, Ue] = L(!1), [Ke, Oe] = L(null), [Ye, dt] = L(null), Xe = pe(null), [ct, nt] = L(!1), [st, et] = L(""), X = pe(null), oe = pe(null), Ne = pe(!1), [we, be] = L(Hd), [qe, Be] = L(null), [_e, Ce] = L(!1), [Ee, De] = L(!1), [$e, We] = L(!1), [ut, ke] = L(!1), [ze, Pe] = L(!1), [pt, Qe] = L(""), {
    analysisError: rt,
    analysisRun: It,
    analysisStatus: bt,
    importNativeSegments: Ae,
    nativeImportState: Re,
    startFullAnalysis: Ve
  } = Rc(
    e.video.id,
    o,
    l,
    ((Po = e.shotBoundaries) == null ? void 0 : Po.length) || 0,
    zn(e.shotBoundaries || [])
  ), [Ze, it] = L(!1), [Pt, mt] = L(null), [ft, Lt] = L(l), [sn, $r] = L(0), [ln, Tr] = L(!1), [At, Yt] = L(""), [Zn, Qt] = L(null), En = pe(null), Xn = pe(null), dn = pe(!1), [_t, cn] = L([]), [er, Ar] = L(!1), [tr, Rr] = L(null), un = Ud(), mn = pe(null), Dn = pe(null), gn = pe(null), Mr = pe(s), nr = pe(null), pn = pe(null), Zt = pe(null), fn = pe(null), On = pe(null), ht = pe(null), rr = pe(null), Pn = pe(null), Ft = pe(null), or = pe(null), yn = pe(null), bn = pe(null), Er = pe(-1e12), Dr = pe(null), Or = pe(!1), hn = pe(null), [Ln, vn] = L({ scrollTop: 0, height: 512 });
  ye(() => {
    if (!Ze || ln || !At) return;
    const O = requestAnimationFrame(() => {
      var ue;
      return (ue = Xn.current) == null ? void 0 : ue.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(O);
  }, [Ze, ln, At]), ye(() => {
    if (!dn.current || Ze || ft) return;
    const O = requestAnimationFrame(() => {
      var ue;
      (ue = En.current) == null || ue.focus({ preventScroll: !0 }), dn.current = !1;
    });
    return () => cancelAnimationFrame(O);
  }, [Ze, ft]);
  const tt = e.video, gt = e.segments || Kn, lt = He(() => JSON.stringify({
    segments: gt.map((O) => [
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
    performerSlots: (e.performerSlots || Kn).map((O) => [
      O.segmentId,
      O.slotDefinitionId,
      O.performerId,
      O.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [gt, e.performerSlots, e.itemMetadata]);
  ye(() => {
    if (!l) {
      mt(null), Lt(!1);
      return;
    }
    if (U != null) {
      Lt(!0);
      return;
    }
    let O = !0;
    Lt(!0);
    const ue = setTimeout(() => {
      ee(`/videos/${tt.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Le) => {
        O && (mt(Le), Yt(""));
      }).catch((Le) => {
        O && (mt(null), Yt(Le.message || "Unable to preview derived segments."));
      }).finally(() => {
        O && Lt(!1);
      });
    }, 150);
    return () => {
      O = !1, clearTimeout(ue);
    };
  }, [l, tt.id, lt, sn, U]);
  const ar = () => $r((O) => O + 1), Rt = e.segmentGroups || Kn, Ct = e.performerSlots || Kn, ir = l && e.performerSlotsAvailable !== !1, Kt = He(
    () => (e.performerCandidates || []).filter((O) => O.isVideoPerformer),
    [e.performerCandidates]
  ), Fn = e.shotBoundaries || Kn, xn = He(
    () => gi(Ct),
    [Ct]
  ), jn = He(
    () => gt.map((O) => {
      const ue = xn.get(O.id) || [];
      return {
        ...O,
        slots: ue,
        assignment: ue.every((Le) => Le.performerId == null) ? Ml(ue, Kt) : null
      };
    }).filter((O) => O.slots.length > 0 && O.assignment != null),
    [gt, xn, Kt]
  ), Bn = Number((Lo = tt.videoFile) == null ? void 0 : Lo.frameRate) > 0 ? Number(tt.videoFile.frameRate) : 30;
  function Sn() {
    const O = V.current;
    F(!1), O && requestAnimationFrame(() => {
      var ue;
      return (ue = ht.current) == null ? void 0 : ue.focus({ preventScroll: !0 });
    });
  }
  function jt() {
    U == null && (bn.current = null, Ue(!1), fe(""), requestAnimationFrame(() => {
      var O;
      return (O = ht.current) == null ? void 0 : O.focus({ preventScroll: !0 });
    }));
  }
  function Xt() {
    I(!1), requestAnimationFrame(() => {
      var O, ue;
      (O = Pn.current) != null && O.isConnected ? Pn.current.focus({ preventScroll: !0 }) : (ue = ht.current) == null || ue.focus({ preventScroll: !0 });
    });
  }
  ye(() => {
    yn.current === g ? (yn.current = null, F(!0)) : F(!1);
  }, [g]), ye(() => {
    var ue;
    if (!H) return;
    const O = (ue = or.current) == null ? void 0 : ue.querySelector("input");
    document.activeElement !== O && (O == null || O.focus({ preventScroll: !0 }), O == null || O.select());
  }, [H, g]), ye(() => {
    var ue;
    if (H) return;
    const O = (ue = ht.current) == null ? void 0 : ue.ownerDocument;
    O && O.activeElement === O.body && ht.current.focus({ preventScroll: !0 });
  }, [H]), ye(() => {
    var Le, ot, Mt;
    const O = nn(
      zr(
        e.segments,
        e.performerSlots || [],
        Tt({}),
        l && M,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), ue = ((Le = e.segments.find((Cn) => Cn.id === s)) == null ? void 0 : Le.id) ?? ((ot = za(O)) == null ? void 0 : ot.id) ?? null;
    u(ue), m(ue == null ? [] : [ue]), h.current = ue, y.current = [], Be(Et(O, ue)), E(Tt({})), I(!1), bn.current = null, Ue(!1), Z(1), fe(""), P(Ht), le.current = Ht, G(!1), (Mt = ht.current) == null || Mt.focus({ preventScroll: !0 });
  }, [tt.id, s]), ye(() => {
    const O = new AbortController();
    return ee(`/videos/${tt.id}/incorrect-examples`, { signal: O.signal }).then(cn).catch((ue) => {
      ue.name !== "AbortError" && cn([]);
    }), () => O.abort();
  }, [tt.id, d == null ? void 0 : d.effectiveMode]), ye(() => {
    const O = new AbortController();
    return ee(`/videos/${tt.id}/history`, { signal: O.signal }).then((ue) => {
      const Le = ue || Ht;
      le.current = Le, P(Le);
    }).catch((ue) => {
      ue.name !== "AbortError" && fe(ue.message || "Unable to load editor history.");
    }), () => O.abort();
  }, [tt.id]), ye(() => {
    _d(te);
  }, [te.timelineRatio, te.markerRailOpen, te.detailWidth, te.markerRailWidth, te.swimlaneTitleWidth]), ye(() => {
    qd(we);
  }, [we]), ye(() => {
    tl(M);
  }, [M]), ye(() => {
    const O = pn.current;
    if (!a || !O || typeof ResizeObserver > "u") return;
    const ue = () => {
      var Mt;
      const ot = Math.max(0, O.clientHeight - (((Mt = Zt.current) == null ? void 0 : Mt.offsetHeight) || 0));
      C(ot), K((Cn) => {
        const Go = lo(Cn.timelineRatio, ot);
        return Go === Cn.timelineRatio ? Cn : { ...Cn, timelineRatio: Go };
      });
    }, Le = new ResizeObserver(ue);
    return Le.observe(O), Zt.current && Le.observe(Zt.current), ue(), () => Le.disconnect();
  }, [a]), ye(() => {
    if (!un || typeof ResizeObserver > "u") return;
    const O = On.current, ue = fn.current;
    if (!O || !ue) return;
    const Le = () => x({
      workspace: O.clientWidth,
      focusRow: ue.clientWidth,
      focusRowHeight: ue.clientHeight
    }), ot = new ResizeObserver(Le);
    return ot.observe(O), ot.observe(ue), Le(), () => ot.disconnect();
  }, [un, te.markerRailOpen]);
  const Bt = He(
    () => jd(gt, xe),
    [gt, xe]
  );
  Ll(() => {
    Ni(xe, e) !== xe && _({ type: "prune", detail: e });
  }, [e, xe]);
  const zt = He(
    () => ca(
      zr(
        Bt,
        Ct,
        k,
        l && M,
        Rt
      ),
      _t,
      !0
    ),
    [
      Bt,
      Ct,
      k,
      M,
      Rt,
      l,
      _t
    ]
  ), Pr = Object.fromEntries(St.map((O) => [O, zt.filter((ue) => ue.reviewState === O).length])), Lr = ca(
    zr(
      Bt,
      Ct,
      { ...k, reviewStates: St },
      l && M,
      Rt
    ),
    _t,
    !0
  ), Fr = Object.fromEntries(St.map((O) => [O, Lr.filter((ue) => ue.reviewState === O).length])), kn = [...new Set(Bt.map((O) => O.sourceKey).filter(Boolean))].sort((O, ue) => Ot(O).localeCompare(Ot(ue))), wn = Ks(
    k,
    l && M
  ), D = He(
    () => nn(zt, Rt, Ct),
    [zt, Rt, Ct]
  ), Se = qs(
    D,
    g,
    s
  ), yt = He(() => {
    const O = Od(xe);
    return O.length === 0 ? gt : [...gt, ...O];
  }, [gt, xe]), ge = Se == null ? null : yt.find((O) => O.id === Se.id) || Se, vt = Vo(yt, Vo(zt, f).map((O) => O.id)), Gt = !l && vt.length > 0 && vt.every((O) => O.nativeSegmentId != null), sr = zt.map((O) => O.id), Ri = sr.join("|");
  p.current = (ge == null ? void 0 : ge.id) ?? null;
  const vo = xn.get(ge == null ? void 0 : ge.id) || [], Mi = fo(vo), xo = He(
    () => gd(D, f),
    [D, f]
  ), jr = He(() => yo(D), [D]), Gn = He(
    () => ud(jr, we),
    [jr, we]
  ), Ei = He(
    () => pi(
      Gn.rows,
      Ln.scrollTop,
      Ln.height
    ),
    [Gn, Ln]
  ), Br = He(
    () => fd(D, we),
    [D, we]
  ), Di = hr(Br, ge == null ? void 0 : ge.id, -1, !0) != null, Oi = hr(Br, ge == null ? void 0 : ge.id, 1, !0) != null, Nn = ge ? Et(D, ge.id) : null, Gr = Rt.length > 0 ? jr.map((O) => O.key) : [], Pi = Gr.join("|"), lr = Math.max(
    0,
    Number((Fo = tt.videoFile) == null ? void 0 : Fo.duration) || 0,
    ...Bt.map((O) => Number(O.endSec ?? O.startSec) || 0)
  ), So = Number((jo = tt.videoFile) == null ? void 0 : jo.duration) > 0 ? Number(tt.videoFile.duration) : null;
  v.actions;
  const Li = Za();
  ye(() => {
    const O = g === xr ? g : (ge == null ? void 0 : ge.id) ?? null;
    O !== g && u(O);
  }, [ge, g]), ye(() => {
    m((O) => {
      const ue = Js(
        O,
        sr,
        (ge == null ? void 0 : ge.id) ?? null
      );
      return ue.length === O.length && ue.every((Le, ot) => Le === O[ot]) ? O : ue;
    });
  }, [Ri, ge == null ? void 0 : ge.id]);
  const In = (ge == null ? void 0 : ge.itemId) == null ? null : ((Bo = e.itemMetadata) == null ? void 0 : Bo[ge.itemId]) || null, Fi = {
    key: (ge == null ? void 0 : ge.itemId) != null ? `item:${ge.itemId}` : (ge == null ? void 0 : ge.nativeSegmentId) != null ? `native:${ge.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (In == null ? void 0 : In.provenance) || (ge == null ? void 0 : ge.fieldProvenance) || [] : []
  }, Ur = (ge == null ? void 0 : ge.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (In == null ? void 0 : In.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  ye(() => {
    ve(Se == null ? "" : String(Se.startSec)), me((Se == null ? void 0 : Se.endSec) == null ? "" : String(Se.endSec));
  }, [Se == null ? void 0 : Se.id, Se == null ? void 0 : Se.startSec, Se == null ? void 0 : Se.endSec]), ye(() => {
    Nn && be((O) => bi(O, Nn));
  }, [tt.id, s, Nn]), ye(() => {
    Be((O) => vd(Gr, O, Nn));
  }, [tt.id, Pi, Nn]), ye(() => {
    if (!te.markerRailOpen || (ge == null ? void 0 : ge.id) == null) return;
    const O = hn.current, ue = Gn.rows.find((Mt) => Mt.kind === "segment" && Mt.segment.id === ge.id);
    if (!O || !ue) return;
    const Le = ue.top + ue.height;
    let ot = O.scrollTop;
    ue.top < O.scrollTop ? ot = ue.top : Le > O.scrollTop + O.clientHeight && (ot = Math.max(0, Le - O.clientHeight)), ot !== O.scrollTop && (O.scrollTop = ot), vn({ scrollTop: ot, height: O.clientHeight });
  }, [ge == null ? void 0 : ge.id, Gn, te.markerRailOpen]), ye(() => {
    const O = hn.current;
    if (!te.markerRailOpen || !O) return;
    const ue = () => vn({
      scrollTop: O.scrollTop,
      height: O.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      ue();
      return;
    }
    const Le = new ResizeObserver(ue);
    return Le.observe(O), ue(), () => Le.disconnect();
  }, [te.markerRailOpen]);
  const { revealSegmentGroupForSelection: ko, replaceSegmentSelection: ji, selectSegment: wo, selectSegmentCollection: Bi, selectAllVideoSegments: Gi } = Ic({
    allSwimlanes: D,
    editorRef: ht,
    performerSlots: Ct,
    seekRef: mn,
    segmentGroups: Rt,
    segments: gt,
    selectedSegmentId: g,
    selectedSegmentIds: f,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: y,
    setCollapsedSegmentGroups: be,
    setEditorFilters: E,
    setHideDerivedSegments: N,
    setSaveMessage: fe,
    setSelectedSegmentGroupKey: Be,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m
  }), { acceptHistory: Kr, recordHistoryAction: dr, mutateSegment: Ui, runSegmentMutation: Ki, completeReview: zi, createSegment: No, splitSegment: Io, duplicateSegment: Co, saveTiming: Hi, applyShortcutTiming: qi } = Gd({
    compatibilityMode: l,
    currentTime: S,
    detail: e,
    editorFilters: k,
    endInput: ne,
    hideDerivedSegments: M,
    historyRef: le,
    mediaDuration: So,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: Er,
    pendingDuplicateRef: Dr,
    pendingFirstSegmentStartSecRef: bn,
    pendingTagEditSegmentIdRef: yn,
    enqueueSave: R,
    pendingChanges: xe,
    retargetSaveTasks: re,
    replaceSegmentSelection: ji,
    savingSegmentId: U,
    segments: gt,
    selectedSegment: ge,
    selectedSegmentIdRef: p,
    selectedSegments: vt,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: y,
    setCreatingSegmentId: je,
    setEditorFilters: E,
    setFirstSegmentTagOpen: Ue,
    setHideDerivedSegments: N,
    setHistory: P,
    setHistoryOpen: G,
    setPublishApprovedError: et,
    setSaveMessage: fe,
    acquireSaveLock: T,
    dispatchPendingChanges: _,
    setSelectedSegmentGroupKey: Be,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    setTagEditing: F,
    startInput: he,
    tagEditingRef: V,
    timelineDuration: lr,
    video: tt
  });
  function $o(O = null) {
    var ot;
    if (!l || U != null || !gt.some((Mt) => !Mt.published && Mt.reviewState === "approved")) return;
    const ue = ((ot = ht.current) == null ? void 0 : ot.ownerDocument) ?? document, Le = ue.activeElement === ue.body ? null : ue.activeElement;
    oe.current = O != null && O.isConnected && O !== ue.body ? O : Le, et(""), nt(!0);
  }
  function To() {
    U == null && (nt(!1), et(""), requestAnimationFrame(() => {
      Mc(
        oe.current,
        ht.current
      ), oe.current = null;
    }));
  }
  async function _i() {
    await zi() && To();
  }
  const { closeMergeConfirmation: Wi, mergeSelectedSwimlane: Ao, saveSelectedReviewState: Vi } = Cc({
    acceptHistory: Kr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: w,
    getSaveQueueSnapshot: ae,
    historyRef: le,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: dr,
    revealSegmentGroupForSelection: ko,
    savingSegmentId: U,
    selectedGroups: xo,
    selectedSegment: ge,
    selectedSegmentIdRef: p,
    selectedSegments: vt,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: y,
    setMergeConfirmation: Oe,
    setSaveMessage: fe,
    acquireSaveLock: T,
    dispatchPendingChanges: _,
    enqueueSave: R,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: tt
  }), Ji = (O) => {
    const ue = (O || []).map(rn);
    z.cancel((Le) => Le.kind === "review" && vi(Le.targets, ue));
  };
  A.current = {
    detail: e,
    segments: gt,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    tagEditing: H,
    selectedSegmentIds: f,
    activeSegmentId: (ge == null ? void 0 : ge.id) ?? null
  }, ye(() => {
    z.poke();
  });
  const { toggleIncorrectExample: Yi, removeIncorrectExample: Qi, captureTrainingExport: Zi, deleteRejectedSegments: Ro, autoAssignPerformers: Xi, previewDerivedSegments: es, closeMaterializeDialog: ts, materializeDerivedSegments: ns, saveTag: rs, moveToBin: os, emptyRecyclingBin: as } = $c({
    acceptHistory: Kr,
    allSwimlanes: D,
    autoAssignCandidates: jn,
    autoAssigning: ze,
    binEmptyingRef: Ne,
    canMoveSelectionToBin: Gt,
    closeTagEditing: Sn,
    compatibilityMode: l,
    creatingSegmentId: Te,
    detail: e,
    editorFilters: k,
    editorRef: ht,
    exportingExamples: er,
    hideDerivedSegments: M,
    incorrectExamples: _t,
    lineage: Ur,
    materializeButtonRef: En,
    materializePreview: Pt,
    materializeRestoreFocusRef: dn,
    materializing: ln,
    mutateSegment: Ui,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: Ct,
    cancelSaveTasks: q,
    dispatchPendingChanges: _,
    enqueueSave: R,
    pendingChanges: xe,
    runSegmentMutation: Ki,
    recordHistoryAction: dr,
    refreshMaterializationPreview: ar,
    removingExampleId: tr,
    revealSegmentGroupForSelection: ko,
    savingSegmentId: U,
    segmentGroups: Rt,
    segments: gt,
    selectedSegment: ge,
    selectedSegmentIdRef: p,
    selectedSegments: vt,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: y,
    setAutoAssignError: Qe,
    setAutoAssignOpen: ke,
    setAutoAssigning: Pe,
    setEditorFilters: E,
    setExportingExamples: Ar,
    setHideDerivedSegments: N,
    setIncorrectExamples: cn,
    setMaterializeError: Yt,
    setMaterializeLoading: Lt,
    setMaterializeOpen: it,
    setMaterializePreview: mt,
    setMaterializing: Tr,
    setRemovingExampleId: Rr,
    setRejectedDeletionPreview: dt,
    setSaveMessage: fe,
    acquireSaveLock: T,
    setSelectedSegmentGroupKey: Be,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: tt
  }), { restoreHistoryTarget: is, updateTimelineRatio: Mo, handleSeparatorPointerDown: ss, handleSeparatorPointerMove: ls, handleSeparatorKeyDown: ds, panelWidthMaximum: Eo, panelSeparatorProps: cs, toggleSegmentRail: us, toggleSegmentGroup: Do, mutateShotBoundary: ms } = Tc({
    acceptHistory: Kr,
    compatibilityMode: l,
    currentTime: S,
    detail: e,
    editorLayout: te,
    focusRowRef: fn,
    history: v,
    historyRef: le,
    historySaving: J,
    horizontalLayoutSize: b,
    mediaStackHeight: se,
    mediaStackRef: pn,
    commonActionsRef: Zt,
    onDetailChange: t,
    onReload: o,
    railToggleRef: rr,
    recordHistoryAction: dr,
    savingSegmentId: U,
    savingShot: W,
    savingShotRef: Or,
    setCollapsedSegmentGroups: be,
    setEditorLayout: K,
    setHistorySaving: B,
    setIncorrectExamples: cn,
    setSaveMessage: fe,
    acquireSaveLock: T,
    setSavingShot: de,
    shotBoundaries: Fn,
    timelineDuration: lr,
    video: tt,
    workspaceRef: On
  }), { executeShortcutById: Oo, stepVideoFrame: gs } = Ac({
    allSwimlanes: D,
    applyShortcutTiming: qi,
    centerTimelineRef: nr,
    compatibilityMode: l,
    createSegment: No,
    currentTime: S,
    deleteRejectedSegments: Ro,
    duplicateSegment: Co,
    editorLayout: te,
    editorRef: ht,
    emptyRecyclingBin: as,
    lineage: Ur,
    mediaDuration: So,
    mergeSelectedSwimlane: Ao,
    moveToBin: os,
    mutateShotBoundary: ms,
    openPublishApprovedDialog: $o,
    playbackControlsRef: Dn,
    playbackShortcutConfig: Li,
    saveSelectedReviewState: Vi,
    seekRef: mn,
    segmentGroupKeys: Gr,
    selectSegment: wo,
    selectedSegment: ge,
    selectedSegmentGroupForSegment: Nn,
    selectedSegmentGroupKey: qe,
    selectedSegments: vt,
    setCollapsedSegmentGroups: be,
    setIncorrectExamplesOpen: We,
    setQuickSearchOpen: De,
    setSaveMessage: fe,
    setSelectedSegmentGroupKey: Be,
    setTagEditing: F,
    setTimelineZoom: Z,
    shotBoundaries: Fn,
    slotButtonRef: Ft,
    splitSegment: Io,
    swimlanes: Br,
    timelineDuration: lr,
    toggleIncorrectExample: Yi,
    toggleSegmentGroup: Do,
    updateTimelineRatio: Mo,
    videoFrameRate: Bn,
    visibleSegments: zt
  });
  gn.current = Oo;
  const ps = He(() => Yn.map((O) => ({
    id: O.id,
    enabled: An(O, l),
    surface: "local",
    action: (ue) => {
      var Le;
      return (Le = gn.current) == null ? void 0 : Le.call(gn, O.id, ue);
    }
  })), [l]);
  Ma(ao, ps);
  const fs = so(se), ys = tn(te.markerRailWidth, Eo("markerRailWidth")), bs = tn(te.detailWidth, Eo("detailWidth"));
  return n(Nc, {
    activeFilterCount: wn,
    allSwimlanes: D,
    analysisError: rt,
    analysisRun: It,
    analysisStatus: bt,
    approvalFacetCounts: Fr,
    autoAssignCandidates: jn,
    autoAssignError: pt,
    autoAssignOpen: ut,
    autoAssignPerformers: Xi,
    autoAssigning: ze,
    canMoveSelectionToBin: Gt,
    captureTrainingExport: Zi,
    cancelQueuedReviewsForSegments: Ji,
    removeIncorrectExample: Qi,
    rejectedDeletionPreview: Ye,
    centerTimelineRef: nr,
    closeEditorFilters: Xt,
    closeFirstSegmentTagDialog: jt,
    closeMaterializeDialog: ts,
    closeMergeConfirmation: Wi,
    closePublishApprovedDialog: To,
    closeTagEditing: Sn,
    collapsedSegmentGroups: we,
    commonActionsRef: Zt,
    compatibilityMode: l,
    configuringTag: Zn,
    createSegment: No,
    currentTime: S,
    deleteRejectedSegments: Ro,
    detail: e,
    detailPanelRef: w,
    detailWidth: bs,
    duplicateSegment: Co,
    editorFilters: k,
    editorLayout: te,
    editorRef: ht,
    exportingExamples: er,
    filtersButtonRef: Pn,
    filtersOpen: Q,
    firstSegmentTagOpen: Ie,
    focusRowRef: fn,
    handleSeparatorKeyDown: ds,
    handleSeparatorPointerDown: ss,
    handleSeparatorPointerMove: ls,
    hideDerivedSegments: M,
    history: v,
    historyOpen: j,
    historySaving: J,
    hasNextUnreviewed: Oi,
    hasPreviousUnreviewed: Di,
    horizontalLayoutSize: b,
    importNativeSegments: Ae,
    incorrectExamples: _t,
    incorrectExamplesOpen: $e,
    removingExampleId: tr,
    lineage: Ur,
    markerRailWidth: ys,
    materializeButtonRef: En,
    materializeCancelButtonRef: Xn,
    materializeDerivedSegments: ns,
    materializeError: At,
    materializeLoading: ft,
    materializeOpen: Ze,
    materializePreview: Pt,
    materializing: ln,
    mediaStackRef: pn,
    mergeCancelButtonRef: Xe,
    mergeConfirmation: Ke,
    mergeSaving: Ad(ie, "merge"),
    mergeSelectedSwimlane: Ao,
    nativeImportState: Re,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: $o,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: cs,
    pendingInitialSeekRef: Mr,
    performerSlots: Ct,
    performerSlotsAvailable: ir,
    playbackControlsRef: Dn,
    previewDerivedSegments: es,
    provenance: Fi,
    provenanceSources: kn,
    publishApprovedCancelButtonRef: X,
    publishApprovedDrafts: _i,
    publishApprovedError: st,
    publishApprovedOpen: ct,
    quickSearchOpen: Ee,
    railScrollRef: hn,
    railToggleRef: rr,
    recordHistoryAction: dr,
    restoreHistoryTarget: is,
    runEditorAction: Oo,
    stepVideoFrame: gs,
    saveMessage: Y,
    setSaveMessage: fe,
    saveTag: rs,
    saveTiming: Hi,
    savingSegmentId: U,
    acquireSaveLock: T,
    seekRef: mn,
    segmentGroups: Rt,
    segmentRailLayout: Gn,
    segments: Bt,
    selectAllVideoSegments: Gi,
    selectSegment: wo,
    selectSegmentCollection: Bi,
    selectedGroups: xo,
    selectedPerformerSlots: vo,
    selectedSegment: Se,
    selectedSegmentGroupKey: qe,
    selectedSegmentIds: f,
    selectedSegments: vt,
    selectedSlotStatus: Mi,
    setAutoAssignError: Qe,
    setAutoAssignOpen: ke,
    setConfiguringTag: Qt,
    setCurrentTime: $,
    setEditorFilters: E,
    setEditorLayout: K,
    setFiltersOpen: I,
    setHideDerivedSegments: N,
    setHistoryOpen: G,
    setIncorrectExamplesOpen: We,
    setQuickSearchOpen: De,
    setRejectedDeletionPreview: dt,
    setRailViewport: vn,
    setSelectedSegmentGroupKey: Be,
    setSelectedSegmentId: u,
    setShortcutsOpen: Ce,
    setTimelineZoom: Z,
    shotBoundaries: Fn,
    shortcutsOpen: _e,
    slotButtonRef: Ft,
    splitLayout: a,
    splitSegment: Io,
    startFullAnalysis: Ve,
    tagEditing: H,
    creatingSegmentId: Te,
    tagSearchRef: or,
    timelineDuration: lr,
    timelineRatioBounds: fs,
    timelineZoom: ce,
    toggleSegmentGroup: Do,
    toggleSegmentRail: us,
    updateTimelineRatio: Mo,
    video: tt,
    videoPerformers: Kt,
    visibleCounts: Pr,
    visibleSegmentRailRows: Ei,
    visibleSegments: zt,
    wideLayout: un,
    workspaceRef: On
  });
}
const Dc = /* @__PURE__ */ new Set(["queued", "running"]);
async function ka(e, t, r = 4) {
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
function wa(e, t) {
  return { videoId: e, error: (t == null ? void 0 : t.message) || String(t || "Unable to start Full Scan.") };
}
function Oc() {
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
async function Pc(e, t, r, o) {
  const i = [...new Set(e.map(Number).filter((m) => Number.isInteger(m) && m > 0))], a = [...new Set(t)].filter((m) => ["aiTagging", "omnishotcut"].includes(m));
  if (i.length === 0 || a.length === 0)
    return { queuedIds: [], failed: [], cancelled: !1 };
  const s = a.includes("omnishotcut"), l = await ka(i, async (m) => {
    try {
      const [p, h] = await Promise.all([
        r(`/videos/${m}/analysis-runs`),
        s ? r(`/videos/${m}/editor`) : null
      ]);
      if ((p || []).some((w) => Dc.has(w == null ? void 0 : w.status)))
        throw new Error("A Full Scan is already queued or running.");
      const y = (h == null ? void 0 : h.shotBoundaries) || [];
      return { videoId: m, shotBoundaries: y };
    } catch (p) {
      return wa(m, p);
    }
  }), d = l.filter((m) => !m.error), c = l.filter((m) => m.error), g = d.filter((m) => m.shotBoundaries.length > 0), u = g.reduce((m, p) => m + p.shotBoundaries.length, 0);
  if (u > 0 && !o(
    `Replace ${u} existing shot ${u === 1 ? "boundary" : "boundaries"} across ${g.length} selected ${g.length === 1 ? "video" : "videos"} when these scans succeed? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
  )) return { queuedIds: [], failed: c, cancelled: !0 };
  const f = await ka(d, async ({ videoId: m, shotBoundaries: p }) => {
    const h = s && p.length > 0;
    try {
      return await r(`/videos/${m}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: a,
          replaceShotBoundaries: h,
          expectedShotBoundaryFingerprint: h ? zn(p) : null
        })
      }), { videoId: m };
    } catch (y) {
      return wa(m, y);
    }
  });
  return {
    queuedIds: f.filter((m) => !m.error).map((m) => m.videoId),
    failed: [...c, ...f.filter((m) => m.error)],
    cancelled: !1
  };
}
function Lc(e = [], t = []) {
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
function Fc(e = [], t = "", r = "all") {
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
function xt(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function jc(e = [], t = []) {
  var m;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((p, h) => (p.sortOrder ?? 0) - (h.sortOrder ?? 0) || Number(p.id) - Number(h.id)).forEach((p, h) => {
    [...p.tags || []].sort((y, w) => (y.sortOrder ?? 0) - (w.sortOrder ?? 0) || Number(y.tagId) - Number(w.tagId)).forEach((y, w) => r.set(Number(y.tagId), {
      key: `group:${p.id}`,
      id: p.id,
      name: p.name,
      sortOrder: p.sortOrder ?? h,
      tagSortOrder: y.sortOrder ?? w
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(p, h) {
    const y = Number(p);
    if (!o.has(y)) {
      const w = r.get(y);
      o.set(y, {
        tagId: y,
        name: h || `Tag ${y}`,
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
  e.forEach((p) => {
    const h = i(p.sourceTagId, p.sourceTagName), y = i(p.derivedTagId, p.derivedTagName);
    h.outgoingRuleCount++, y.incomingRuleCount++;
    const w = `${h.tagId}:${y.tagId}`;
    a.has(w) || a.set(w, {
      id: w,
      sourceTagId: h.tagId,
      derivedTagId: y.tagId,
      rules: [],
      edgeCount: 0
    });
    const k = a.get(w);
    k.rules.push(p), k.edgeCount += Number(p.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((p) => [p.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((p) => {
    var h, y;
    (h = d.get(p.sourceTagId)) == null || h.add(p.derivedTagId), (y = d.get(p.derivedTagId)) == null || y.add(p.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), g = [];
  for (const p of s) {
    if (c.has(p.tagId)) continue;
    const h = [p.tagId], y = [];
    for (c.add(p.tagId); h.length > 0; ) {
      const N = h.shift();
      y.push(N);
      for (const S of d.get(N) || [])
        c.has(S) || (c.add(S), h.push(S));
    }
    const w = new Set(y), k = y.map((N) => o.get(N)), E = l.filter((N) => w.has(N.sourceTagId) && w.has(N.derivedTagId)), Q = E.flatMap((N) => N.rules), I = k.filter((N) => N.outgoingRuleCount === 0).sort((N, S) => xt(N.name, S.name)), M = I.length > 0 ? I : [...k].sort((N, S) => xt(N.name, S.name));
    g.push({
      id: [...y].sort((N, S) => N - S).join(":"),
      label: M.length > 1 ? `${M[0].name} + ${M.length - 1}` : ((m = M[0]) == null ? void 0 : m.name) || "Derivation component",
      nodes: k,
      connections: E,
      rules: Q,
      segmentGroupKeys: [...new Set(k.map((N) => N.segmentGroupKey))],
      materializedEdgeCount: Q.reduce(
        (N, S) => N + (Number(S.edgeCount) || 0),
        0
      )
    });
  }
  g.sort((p, h) => h.rules.length - p.rules.length || xt(p.label, h.label));
  const u = /* @__PURE__ */ new Map();
  s.forEach((p) => {
    u.has(p.segmentGroupKey) || u.set(p.segmentGroupKey, {
      key: p.segmentGroupKey,
      id: p.segmentGroupId,
      name: p.segmentGroupName,
      sortOrder: p.segmentGroupSortOrder,
      nodes: [],
      ruleIds: /* @__PURE__ */ new Set(),
      componentIds: /* @__PURE__ */ new Set()
    }), u.get(p.segmentGroupKey).nodes.push(p);
  }), g.forEach((p) => {
    p.nodes.forEach((h) => {
      var y;
      return (y = u.get(h.segmentGroupKey)) == null ? void 0 : y.componentIds.add(p.id);
    }), p.rules.forEach((h) => {
      var y, w;
      (y = u.get(o.get(Number(h.sourceTagId)).segmentGroupKey)) == null || y.ruleIds.add(h.id), (w = u.get(o.get(Number(h.derivedTagId)).segmentGroupKey)) == null || w.ruleIds.add(h.id);
    });
  });
  const f = [...u.values()].sort((p, h) => p.sortOrder - h.sortOrder || xt(p.name, h.name)).map((p) => ({
    ...p,
    ruleCount: p.ruleIds.size,
    componentCount: p.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: g,
    segmentGroups: f
  };
}
function Bc(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const g = new Map(e.nodes.map(($) => [$.tagId, /* @__PURE__ */ new Set()])), u = new Map(e.nodes.map(($) => [$.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach(($) => {
    var A, z;
    (A = g.get($.sourceTagId)) == null || A.add($.derivedTagId), (z = u.get($.derivedTagId)) == null || z.add($.sourceTagId);
  });
  const f = new Map(e.nodes.map(($) => {
    var A;
    return [
      $.tagId,
      ((A = u.get($.tagId)) == null ? void 0 : A.size) || 0
    ];
  })), m = new Map(e.nodes.map(($) => [$.tagId, 0])), p = e.nodes.filter(($) => f.get($.tagId) === 0).sort(($, A) => xt($.name, A.name)).map(($) => $.tagId), h = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const $ = p.shift();
    if (!h.has($)) {
      h.add($);
      for (const A of g.get($) || [])
        m.set(A, Math.max(m.get(A) || 0, (m.get($) || 0) + 1)), f.set(A, f.get(A) - 1), f.get(A) === 0 && p.push(A);
    }
  }
  h.size !== e.nodes.length && e.nodes.filter(($) => !h.has($.tagId)).sort(($, A) => xt($.name, A.name)).forEach(($) => m.set($.tagId, 0));
  const y = Math.max(0, ...m.values()), w = Math.max(
    t,
    240 + y * 296
  ), k = /* @__PURE__ */ new Map();
  e.nodes.forEach(($) => {
    k.has($.segmentGroupKey) || k.set($.segmentGroupKey, {
      key: $.segmentGroupKey,
      id: $.segmentGroupId,
      name: $.segmentGroupName,
      sortOrder: $.segmentGroupSortOrder,
      nodes: []
    }), k.get($.segmentGroupKey).nodes.push($);
  });
  const E = [...k.values()].sort(($, A) => $.sortOrder - A.sortOrder || xt($.name, A.name));
  let Q = 28;
  const I = [], M = E.map(($) => {
    const A = /* @__PURE__ */ new Map();
    $.nodes.forEach((R) => {
      const q = m.get(R.tagId) || 0;
      A.has(q) || A.set(q, []), A.get(q).push(R);
    });
    for (const R of A.values())
      R.sort((q, re) => q.segmentGroupTagSortOrder - re.segmentGroupTagSortOrder || xt(q.name, re.name));
    const z = Math.max(1, ...[...A.values()].map((R) => R.length)), ie = z * 58 + (z - 1) * 18, U = 70 + ie, T = {
      ...$,
      x: 12,
      y: Q,
      width: w - 24,
      height: U
    };
    for (const [R, q] of A.entries()) {
      const re = q.length * 58 + Math.max(0, q.length - 1) * 18, ae = (ie - re) / 2;
      q.forEach((xe, _) => I.push({
        ...xe,
        rank: R,
        x: 28 + R * 296,
        y: Q + 34 + 18 + ae + _ * 76,
        width: 184,
        height: 58
      }));
    }
    return Q += U + 16, T;
  }), N = new Map(I.map(($) => [$.tagId, $])), S = e.connections.map(($) => {
    const A = N.get($.sourceTagId), z = N.get($.derivedTagId), ie = A.x + A.width, U = A.y + A.height / 2, T = z.x, R = z.y + z.height / 2, q = Math.max(48, (T - ie) * 0.48);
    return {
      ...$,
      path: `M ${ie} ${U} C ${ie + q} ${U}, ${T - q} ${R}, ${T} ${R}`
    };
  });
  return {
    width: w,
    height: Math.max(r, Q - 16 + 28),
    nodes: I,
    connections: S,
    groups: M
  };
}
function Gc(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Bc(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), g = 20, u = o, f = c.nodes.map((p) => ({
      ...p,
      x: p.x + g,
      y: p.y + u
    })), m = new Map(f.map((p) => [p.tagId, p]));
    a.push(...f), l.push(...c.groups.map((p) => ({
      ...p,
      componentId: d.id,
      x: p.x + g,
      y: p.y + u
    }))), s.push(...c.connections.map((p) => {
      const h = m.get(p.sourceTagId), y = m.get(p.derivedTagId), w = h.x + h.width, k = h.y + h.height / 2, E = y.x, Q = y.y + y.height / 2, I = Math.max(48, (E - w) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${w} ${k} C ${w + I} ${k}, ${E - I} ${Q}, ${E} ${Q}`
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
function Na(e, t = []) {
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
function Uc(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function Kc(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: u, emptyDraft: f, graph: m, layout: p, listSort: h, materializationOffer: y, materializeOutgoingRules: w, materializeRule: k, message: E, normalizedQuery: Q, query: I, refreshConfiguredTag: M, revealEditor: N, rules: S, save: $, segmentGroupKey: A, selectedNode: z, selectedRule: ie, selection: U, setConfiguringTag: T, setDraft: R, setListSort: q, setMaterializationOffer: re, setQuery: ae, setSegmentGroupKey: xe, setSelection: _, setView: W, sortedVisibleRules: de, sourceSlots: Y, sourceSlotsLoading: fe, updateMapping: he, updateTag: ve, view: ne, visibleComponents: me, visibleRules: ce } = e;
  function Z(b) {
    const x = m.nodes.find((P) => P.tagId === Number(b.sourceTagId)), v = m.nodes.find((P) => P.tagId === Number(b.derivedTagId));
    return (x == null ? void 0 : x.segmentGroupKey) === (v == null ? void 0 : v.segmentGroupKey) ? x.segmentGroupKey : "cross-group";
  }
  function te() {
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
          onClick: () => R(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      n("div", { key: "tags", className: "space-y-3" }, [
        n("div", { key: "source", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Source tag (specific)"),
            n(qn, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (b, x) => ve("source", b, x == null ? void 0 : x.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !fe && Y.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (b) => T({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: b.currentTarget
              }),
              className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
            }, "Configure source tag")
          ]) : null
        ]),
        n("div", { key: "derived", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Derived tag (general)"),
            n(qn, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (b, x) => ve("derived", b, x == null ? void 0 : x.label),
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
              onClick: (b) => T({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: b.currentTarget
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
            disabled: r || Y.length === 0 || s.length === 0,
            onClick: () => R((b) => ({
              ...b,
              slotMappings: [...b.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
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
          ...d.slotMappings.map((b, x) => n("div", { key: x, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: b.sourceSlotDefinitionId,
              disabled: r,
              onChange: (v) => he(x, "sourceSlotDefinitionId", v.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${x + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...Y.map((v) => n("option", { key: v.id, value: v.id }, kt(v)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: b.derivedSlotDefinitionId,
              disabled: r,
              onChange: (v) => he(x, "derivedSlotDefinitionId", v.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${x + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((v) => n("option", { key: v.id, value: v.id }, kt(v)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => R((v) => ({
                ...v,
                slotMappings: v.slotMappings.filter((P, le) => le !== x)
              })),
              className: `${o} shrink-0 text-red-300`,
              "aria-label": `Remove performer slot mapping ${x + 1}`,
              title: "Remove mapping"
            }, "🗑")
          ]))
        ])
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "save",
          type: "button",
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((b) => !b.sourceSlotDefinitionId || !b.derivedSlotDefinitionId),
          onClick: $,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => R(null), className: o }, "Cancel")
      ])
    ]);
  }
  function K() {
    if (z) {
      const v = ce.filter((j) => Number(j.derivedTagId) === z.tagId), P = ce.filter((j) => Number(j.sourceTagId) === z.tagId), le = (j, G, J) => n("div", {
        key: j.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, G),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${j.sourceTagName} → ${j.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          J ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => k(j),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => g(j, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(j),
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
          onClick: (j) => T({
            tagId: z.tagId,
            tagName: z.name,
            trigger: j.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        P.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => w(z, P),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${P.length})`) : null,
        P.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...P.map((j) => le(j, "Derives", !0))
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
            v.map((j) => le(j, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!ie)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const b = m.nodes.find((v) => v.tagId === Number(ie.sourceTagId)), x = m.nodes.find((v) => v.tagId === Number(ie.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (b == null ? void 0 : b.segmentGroupName) || "Ungrouped"),
          (b == null ? void 0 : b.segmentGroupKey) !== (x == null ? void 0 : x.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(x == null ? void 0 : x.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${ie.sourceTagName} → ${ie.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${ie.edgeCount} materialized lineage edge${ie.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (y == null ? void 0 : y.ruleId) === ie.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => k(ie, y),
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
        ie.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : ie.slotMappings.map((v, P) => n("div", {
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
          ie.createdAt ? new Date(ie.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          ie.updatedAt ? new Date(ie.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => k(ie),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(ie),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(ie),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function se() {
    if (me.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, Q ? "No derivation relationships match your search." : "No derivation rules.");
    const b = z == null ? void 0 : z.tagId, x = /* @__PURE__ */ new Set();
    return z && (x.add(z.tagId), p.connections.forEach((v) => {
      (v.sourceTagId === z.tagId || v.derivedTagId === z.tagId) && (x.add(v.sourceTagId), x.add(v.derivedTagId));
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
        ...p.groups.map((v) => n("div", {
          key: `group:${v.componentId}:${v.key}`,
          className: `absolute rounded-xl border ${A === v.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
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
          ...p.connections.map((v) => {
            const P = b === v.sourceTagId || b === v.derivedTagId, le = z != null, j = P ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${v.id}:visible`,
              d: v.path,
              fill: "none",
              stroke: j,
              strokeWidth: P ? 2.5 : 1.5,
              opacity: le && !P ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((v) => {
          const P = !Q || v.name.toLocaleLowerCase().includes(Q), le = z != null, j = x.has(v.tagId), G = (z == null ? void 0 : z.tagId) === v.tagId;
          return n("button", {
            key: `node:${v.tagId}`,
            type: "button",
            onClick: () => _({ type: "node", id: v.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${G ? "border-accent bg-accent/15 ring-2 ring-accent/25" : j ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${v.x}px`,
              top: `${v.y}px`,
              width: `${v.width}px`,
              height: `${v.height}px`,
              opacity: !P || le && !j ? 0.62 : 1
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
        ...p.connections.filter((v) => v.rules.length > 1).map((v) => {
          const P = p.nodes.find((j) => j.tagId === v.sourceTagId), le = p.nodes.find((j) => j.tagId === v.derivedTagId);
          return n("div", {
            key: `bundle:${v.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(P.x + P.width + le.x) / 2 - 24}px`,
              top: `${(P.y + P.height / 2 + le.y + le.height / 2) / 2 - 10}px`
            },
            "aria-label": `${v.rules.length} rules connect ${v.rules[0].sourceTagName} to ${v.rules[0].derivedTagName}`
          }, `${v.rules.length} rules`);
        })
      ])
    ]);
  }
  function C() {
    if (me.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        Q ? "No derivation relationships match your search." : "No derivation rules."
      );
    const b = /* @__PURE__ */ new Map();
    de.forEach((v) => {
      const P = Z(v);
      b.has(P) || b.set(P, []), b.get(P).push(v);
    });
    const x = [
      ...m.segmentGroups.map((v) => v.key),
      "cross-group"
    ].filter((v) => b.has(v));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, x.map((v) => {
      const P = m.segmentGroups.find((G) => G.key === v), le = v === "cross-group" ? "Cross-group relationships" : (P == null ? void 0 : P.name) || "Ungrouped", j = b.get(v);
      return n("section", { key: v, "aria-label": le }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, le),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${j.length} rule${j.length === 1 ? "" : "s"}`
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
          ...j.map((G) => n("button", {
            key: G.id,
            type: "button",
            role: "row",
            onClick: () => _({ type: "rule", id: G.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(ie == null ? void 0 : ie.id) === G.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${G.sourceTagName} → ${G.derivedTagName}` },
              `${G.sourceTagName} → ${G.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(G.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(G.edgeCount))
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
          `${S.length} rules · ${m.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          R(f()), _(null), N();
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
          value: I,
          onChange: (b) => {
            ae(b.target.value), _(null);
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
          value: A,
          disabled: d != null,
          onChange: (b) => {
            xe(b.target.value), _(null), R(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...m.segmentGroups.map((b) => n("option", { key: b.key, value: b.key }, b.name))
        ])
      ]),
      ne === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: h,
          onChange: (b) => q(b.target.value),
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
        ].map(([b, x]) => n("button", {
          key: b,
          type: "button",
          onClick: () => {
            W(b), b === "graph" && (U == null ? void 0 : U.type) === "rule" && _(null);
          },
          "aria-pressed": ne === b,
          className: `rounded px-3 py-1.5 text-sm font-medium ${ne === b ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
        }, x))
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
        ne === "graph" ? se() : C()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? te() : K()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      E ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, E) : null
    ]),
    i ? n(ho, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => M(i),
      onClose: () => {
        const b = i.trigger;
        T(null), requestAnimationFrame(() => {
          b != null && b.isConnected && b.focus();
        });
      }
    }) : null
  ]);
}
function zc({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = L([]), [a, s] = L(null), [l, d] = L([]), [c, g] = L([]), [u, f] = L(!1), [m, p] = L(!1), [h, y] = L(!1), [w, k] = L(""), [E, Q] = L(""), [I, M] = L("graph"), [N, S] = L("all"), [$, A] = L(null), [z, ie] = L("relationship"), [U, T] = L(null), [R, q] = L(null), re = pe(null), ae = pe(null), xe = oi().replace(/:/g, "");
  function _() {
    requestAnimationFrame(() => {
      var B;
      return (B = re.current) == null ? void 0 : B.scrollIntoView({ block: "nearest" });
    });
  }
  async function W(B) {
    const H = await ee("/derivation-rules", B ? { signal: B } : void 0);
    i(H || []);
  }
  ye(() => {
    const B = new AbortController();
    return W(B.signal).catch((H) => {
      H.name !== "AbortError" && k(H.message || "Unable to load derived segment rules.");
    }), () => B.abort();
  }, []), ye(() => {
    const B = new AbortController();
    return a != null && a.sourceTagId ? (f(!0), ee(`/slot-definitions/${a.sourceTagId}`, { signal: B.signal }).then((H) => d(H.definitions || [])).catch((H) => {
      H.name !== "AbortError" && d([]);
    }).finally(() => {
      B.signal.aborted || f(!1);
    })) : (d([]), f(!1)), a != null && a.derivedTagId ? (p(!0), ee(`/slot-definitions/${a.derivedTagId}`, { signal: B.signal }).then((H) => g(H.definitions || [])).catch((H) => {
      H.name !== "AbortError" && g([]);
    }).finally(() => {
      B.signal.aborted || p(!1);
    })) : (g([]), p(!1)), () => B.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), ye(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || u || m)
      return;
    const B = `${a.sourceTagId}:${a.derivedTagId}`;
    ae.current !== B && (ae.current = B, s((H) => !H || Number(H.sourceTagId) !== Number(a.sourceTagId) || Number(H.derivedTagId) !== Number(a.derivedTagId) ? H : id(H, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    u,
    m
  ]);
  function de(B, H = !1) {
    H || A({ type: "rule", id: B.id }), ae.current = null, s({
      ruleId: B.id,
      sourceTagId: B.sourceTagId,
      sourceTagName: B.sourceTagName,
      derivedTagId: B.derivedTagId,
      derivedTagName: B.derivedTagName,
      slotMappings: B.slotMappings.map((F) => ({
        sourceSlotDefinitionId: F.sourceSlotDefinitionId,
        derivedSlotDefinitionId: F.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), k(""), _();
  }
  function Y(B, H, F = "") {
    ae.current = null, B === "source" ? (d([]), f(H != null)) : (g([]), p(H != null)), s((V) => ({
      ...V,
      [`${B}TagId`]: H == null ? null : Number(H),
      [`${B}TagName`]: F || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function fe(B) {
    (a == null ? void 0 : a.ruleId) == null && (ae.current = null);
    const H = [W(), t == null ? void 0 : t()];
    return B.draftKind === "source" ? (f(!0), H.push(ee(`/slot-definitions/${B.tagId}`).then((F) => d(F.definitions || [])).finally(() => f(!1)))) : B.draftKind === "derived" && (p(!0), H.push(ee(`/slot-definitions/${B.tagId}`).then((F) => g(F.definitions || [])).finally(() => p(!1)))), Promise.all(H);
  }
  function he(B, H, F) {
    s((V) => ({
      ...V,
      slotMappings: V.slotMappings.map((Te, je) => je === B ? { ...Te, [H]: F } : Te)
    }));
  }
  async function ve() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const B = Na(a, o);
    if (B) {
      k(B.message);
      return;
    }
    if (a.slotMappings.some((H) => !H.sourceSlotDefinitionId || !H.derivedSlotDefinitionId)) {
      k("Complete or remove every performer slot mapping before saving.");
      return;
    }
    y(!0), k(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let H = null;
      if (a.ruleId != null) {
        const V = await ee(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${V.deletedSegmentCount}
Removed lineage edges: ${V.removedEdgeCount}
Shared derived segments retained: ${V.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        H = V.fingerprint;
      }
      k("Saving derived segment rule…");
      const F = await ee("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: H
        })
      });
      if (await W(), A(I === "graph" ? { type: "node", id: Number(F.sourceTagId) } : { type: "rule", id: F.id }), s(null), a.ruleId == null)
        try {
          const V = await ee(
            `/derivation-rules/${F.id}/materialization/preview`,
            { method: "POST" }
          );
          T(
            V.createCount + V.linkCount > 0 ? V : null
          ), k(V.createCount + V.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          T(null), k("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        T(null), k("Derived segment rule saved. Previous materializations were removed.");
    } catch (H) {
      k(H.message || "Unable to save derived segment rule.");
    } finally {
      y(!1);
    }
  }
  async function ne(B) {
    y(!0), k("Previewing rule deletion…");
    try {
      const H = await ee(
        `/derivation-rules/${B.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${B.sourceTagName} → ${B.derivedTagName}?

Deleted segments: ${H.deletedSegmentCount}
Removed lineage edges: ${H.removedEdgeCount}
Shared derived segments retained: ${H.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const F = `derivation-rule-delete:${B.id}:${H.fingerprint}`;
      await ee(`/derivation-rules/${B.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(F),
          fingerprint: H.fingerprint
        })
      }), Ge(F), await W(), (a == null ? void 0 : a.ruleId) === B.id && s(null), ($ == null ? void 0 : $.type) === "rule" && $.id === B.id && A(null), (U == null ? void 0 : U.ruleId) === B.id && T(null), k(`Rule deleted with ${H.deletedSegmentCount} exclusively derived segment${H.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (H) {
      k(H.message || "Unable to delete derived segment rule.");
    } finally {
      y(!1);
    }
  }
  async function me(B, H = null) {
    const F = H || await ee(
      `/derivation-rules/${B.id}/materialization/preview`,
      { method: "POST" }
    );
    if (F.createCount + F.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const V = `derivation-rule-materialize:${B.id}:${F.fingerprint}`, Te = await ee(`/derivation-rules/${B.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Fe(V),
        fingerprint: F.fingerprint
      })
    });
    return Ge(V), Te;
  }
  async function ce(B, H = null) {
    y(!0), k("Finding pending derivations…");
    try {
      const F = await me(B, H);
      if (T(null), await W(), F.createdCount + F.linkedCount === 0) {
        k("Every applicable derivation is already materialized.");
        return;
      }
      k(
        `${F.createdCount} derived segment${F.createdCount === 1 ? "" : "s"} created and ${F.linkedCount} existing segment${F.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (F) {
      k(F.message || "Unable to materialize pending derivations.");
    } finally {
      y(!1);
    }
  }
  async function Z(B, H) {
    if (H.length === 0) return;
    y(!0), k(`Finding pending derivations from ${B.name}…`);
    let F = 0, V = 0;
    try {
      for (const Te of H) {
        const je = await me(Te);
        F += je.createdCount, V += je.linkedCount;
      }
      T(null), await W(), k(F + V === 0 ? `Every outgoing derivation from ${B.name} is already materialized.` : `${F} derived segment${F === 1 ? "" : "s"} created and ${V} existing segment${V === 1 ? "" : "s"} linked from ${B.name}.`);
    } catch (Te) {
      await W().catch(() => {
      }), k(Te.message || `Unable to materialize derivations from ${B.name}.`);
    } finally {
      y(!1);
    }
  }
  const te = Na(a, o), K = He(
    () => jc(o, e),
    [o, e]
  ), se = E.trim().toLocaleLowerCase(), b = K.components.filter((B) => N === "all" || B.segmentGroupKeys.includes(N)).filter((B) => !se || B.nodes.some((H) => H.name.toLocaleLowerCase().includes(se))), x = b.flatMap((B) => B.rules), v = new Set(
    b.flatMap((B) => B.nodes.map((H) => H.tagId))
  ), P = He(
    () => Gc(b),
    [b]
  ), le = I === "list" ? Uc(
    $,
    x,
    se.length > 0
  ) : null, j = ($ == null ? void 0 : $.type) === "node" && K.nodes.find((B) => B.tagId === $.id && v.has(B.tagId)) || null, G = [...x].sort((B, H) => z === "source" ? xt(B.sourceTagName, H.sourceTagName) || xt(B.derivedTagName, H.derivedTagName) : z === "target" ? xt(B.derivedTagName, H.derivedTagName) || xt(B.sourceTagName, H.sourceTagName) : z === "materialized" ? (Number(H.edgeCount) || 0) - (Number(B.edgeCount) || 0) || xt(B.sourceTagName, H.sourceTagName) : xt(
    `${B.sourceTagName} ${B.derivedTagName}`,
    `${H.sourceTagName} ${H.derivedTagName}`
  ));
  return n(Kc, {
    arrowMarkerId: xe,
    busy: h,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: R,
    deleteRule: ne,
    derivedSlots: c,
    derivedSlotsLoading: m,
    draft: a,
    draftIssue: te,
    editRule: de,
    editorRef: re,
    emptyDraft: r,
    graph: K,
    layout: P,
    listSort: z,
    materializationOffer: U,
    materializeOutgoingRules: Z,
    materializeRule: ce,
    message: w,
    normalizedQuery: se,
    query: E,
    refreshConfiguredTag: fe,
    revealEditor: _,
    rules: o,
    save: ve,
    segmentGroupKey: N,
    selectedNode: j,
    selectedRule: le,
    selection: $,
    setConfiguringTag: q,
    setDraft: s,
    setListSort: ie,
    setMaterializationOffer: T,
    setQuery: Q,
    setSegmentGroupKey: S,
    setSelection: A,
    setView: M,
    sortedVisibleRules: G,
    sourceSlots: l,
    sourceSlotsLoading: u,
    updateMapping: he,
    updateTag: Y,
    view: I,
    visibleComponents: b,
    visibleRules: x
  });
}
function Hc() {
  const [e, t] = L(Za), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => Xo({ ...l, [a]: s }));
  }
  function i() {
    t(Xo(io));
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
function qc({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = L([]), [a, s] = L(!1), [l, d] = L(!1), [c, g] = L(""), [u, f] = L(""), [m, p] = L("all"), [h, y] = L(() => /* @__PURE__ */ new Set()), [w, k] = L(null);
  ye(() => {
    if (!e || a) return;
    const T = new AbortController();
    return d(!0), g(""), ee("/slot-definitions", { signal: T.signal }).then((R) => {
      i(R || []), s(!0);
    }).catch((R) => {
      R.name !== "AbortError" && g(R.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      T.signal.aborted || d(!1);
    }), () => T.abort();
  }, [e, a]);
  async function E() {
    d(!0), g("");
    try {
      const T = await ee("/slot-definitions");
      i(T || []), s(!0);
    } catch (T) {
      g(T.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function Q() {
    const [T] = await Promise.all([
      ee("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(T || []), s(!0), g("");
  }
  function I() {
    const T = w == null ? void 0 : w.trigger;
    k(null), requestAnimationFrame(() => {
      T != null && T.isConnected && T.focus({ preventScroll: !0 });
    });
  }
  function M(T) {
    y((R) => {
      const q = new Set(R);
      return q.has(T) ? q.delete(T) : q.add(T), q;
    });
  }
  const N = He(
    () => Lc(t, o),
    [t, o]
  ), S = He(
    () => Fc(N, u, m),
    [N, u, m]
  ), $ = N.flatMap((T) => T.tags), A = $.filter((T) => T.definitions.length > 0).length, z = $.length - A, ie = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], U = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${$.length} tags · ${A} with slots · ${z} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: u,
          onChange: (T) => f(T.target.value),
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
          ie.map(([T, R]) => n("button", {
            key: T,
            type: "button",
            onClick: () => p(T),
            "aria-pressed": m === T,
            className: `rounded px-3 py-1.5 text-xs font-medium ${m === T ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, R))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => y(/* @__PURE__ */ new Set()),
          className: U
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => y(new Set(N.map((T) => T.overviewKey))),
          className: U
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
        onClick: E,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && S.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, S.map((T) => {
      const R = h.has(T.overviewKey), q = T.tags.filter((re) => re.definitions.length > 0).length;
      return n("article", {
        key: T.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => M(T.overviewKey),
          "aria-expanded": !R,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, R ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, T.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${T.tags.length} tag${T.tags.length === 1 ? "" : "s"} · ${q} with slots`
          )
        ]),
        R ? null : n(
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
            }, re.definitions.map((ae) => n("li", {
              key: ae.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, kt(ae)),
              ...(ae.genderHints || []).map((xe) => n("span", {
                key: xe,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, Nr(xe)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (ae) => k({
                tagId: re.tagId,
                tagName: re.tagName,
                trigger: ae.currentTarget
              }),
              "aria-label": `Edit performer slots for ${re.tagName}`,
              className: `${U} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    w ? n(ho, {
      key: `performer-slots-configure:${w.tagId}`,
      tagId: w.tagId,
      tagName: w.tagName,
      onSaved: Q,
      onClose: I
    }) : null
  ]);
}
function _c({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = L("general"), [a, s] = L([]), [l, d] = L(!1), [c, g] = L(""), [u, f] = L(""), [m, p] = L(null), [h, y] = L(!0), [w, k] = L(!1), [E, Q] = L(""), [I, M] = L(!0), [N, S] = L(qa), $ = kl(t), A = $.map(([R]) => R);
  ye(() => {
    A.includes(o) || i(A[0] || "general");
  }, [t.effectiveMode]);
  async function z(R) {
    const q = await ee("/segment-groups", R ? { signal: R } : void 0);
    s(q || []);
  }
  ye(() => {
    const R = new AbortController();
    return z(R.signal).catch((q) => {
      q.name !== "AbortError" && g(q.message || "Unable to load tag groups.");
    }), () => R.abort();
  }, []), ye(() => {
    if (t.effectiveMode !== "full") {
      y(!1);
      return;
    }
    const R = new AbortController();
    return Q(""), y(!0), Promise.all([
      ee("/analysis/settings", { signal: R.signal }),
      ee("/analysis/status", { signal: R.signal })
    ]).then(([q, re]) => {
      M(!0), f((q == null ? void 0 : q.baseUrl) || ""), p(re);
    }).catch((q) => {
      if (q.name !== "AbortError") {
        if (q.status === 403) {
          M(!1), Q("You do not have permission to manage the analysis service connection.");
          return;
        }
        Q(q.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      R.signal.aborted || y(!1);
    }), () => R.abort();
  }, [t.effectiveMode]);
  async function ie(R) {
    if (R !== t.requestedMode) {
      d(!0), g("");
      try {
        const q = await ee(
          `/preferences/transition?mode=${encodeURIComponent(R)}`
        );
        let re = !1, ae = null, xe = null, _ = null, W = !1;
        if (t.requestedMode === "basic" && R === "full") {
          if (!window.confirm(Il(
            q.recyclingBinCount,
            q.protectedRecyclingBinCount
          )))
            return;
          W = !0, q.recyclingBinCount > 0 && (re = !0, _ = q.recyclingBinFingerprint, ae = `mode-switch-empty-bin:${_}`, xe = Fe(ae));
        }
        let de = !1;
        if (t.requestedMode === "full" && R === "basic") {
          if (!window.confirm(Nl(
            q.extensionOwnedSegmentCount
          )))
            return;
          de = !0;
        }
        const Y = await ee("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: R,
            confirmHiddenExtensionOwnedSegments: de,
            confirmBasicHistoryCleanup: W,
            emptyRecyclingBin: re,
            operationId: xe,
            expectedRecyclingBinFingerprint: _
          })
        });
        ae && Ge(ae), r == null || r(Xa(Y)), g("Workflow mode saved.");
      } catch (q) {
        g(q.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function U(R) {
    R.preventDefault(), k(!0), Q("");
    try {
      const q = await ee("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: u })
      });
      f((q == null ? void 0 : q.baseUrl) || "");
      const re = await ee("/analysis/status");
      p(re), Q(q != null && q.baseUrl ? re != null && re.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(re == null ? void 0 : re.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (q) {
      Q(q.message || "Unable to save analysis service settings.");
    } finally {
      k(!1);
    }
  }
  const T = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (R) => Ii(R, e, T), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      $.map(([R, q]) => n("button", {
        key: R,
        type: "button",
        onClick: () => i(R),
        "aria-current": o === R ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === R ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, q))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(Hc)
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
      n(sc, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: ie,
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
          checked: N,
          onChange: (R) => {
            const q = R.target.checked;
            _a(q), S(q);
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
      n("form", { key: "form", onSubmit: U, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
        n("label", { key: "url", className: "min-w-0 flex-1 space-y-1" }, [
          n("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Server URL"),
          n("input", {
            key: "input",
            type: "url",
            value: u,
            onChange: (R) => f(R.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: h || w || !I,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: h || w || !I,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, w ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        E || (h ? "Loading analysis service settings…" : (m == null ? void 0 : m.configured) === !1 ? "Full Scan is not configured." : m != null && m.ready ? "Analysis service is ready." : (m == null ? void 0 : m.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    A.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(zc, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => z()
      })
    ) : null,
    A.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(qc, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => z()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function Ia({ facets: e, values: t, disabled: r, onChange: o }) {
  var i;
  return r ? n(
    "p",
    { className: "rounded-md border border-dashed border-border p-3 text-xs text-secondary" },
    "Performer slot filters are unavailable for your current access. Browse and playback remain available."
  ) : (i = e == null ? void 0 : e.slots) != null && i.length ? n("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, e.slots.map((a) => n("label", { key: a.id, className: "space-y-1 text-xs text-secondary" }, [
    n("span", { key: "label" }, kt(a)),
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
function Wc({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var g, u;
  const s = [...e.slots || []].sort((f, m) => f.sortOrder - m.sortOrder || String(f.slotDefinitionId).localeCompare(String(m.slotDefinitionId))), l = [...new Map(s.map((f) => [
    f.performerId,
    { id: f.performerId, name: f.performerName }
  ])).values()], d = s.map((f) => ({
    slotDefinitionId: f.slotDefinitionId,
    label: kt(f),
    performer: { id: f.performerId, name: f.performerName }
  })), c = ti(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: ci(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((g = e.activity) == null ? void 0 : g.name) || "segment"}, ${e.reviewState}, ${Me(e.startSec)} to ${e.endSec == null ? "end of video" : Me(e.endSec)}` }, [
      n("div", { key: "image", className: "relative aspect-video bg-black" }, [
        n("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        n("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${Me(e.startSec)} → end` : `${Me(e.startSec)} – ${Me(e.endSec)}`)
      ]),
      n("div", { key: "body", className: "flex flex-col gap-1.5 p-2.5" }, [
        n("div", { key: "segment", className: "flex min-w-0 items-center gap-1.5" }, [
          n(an, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((u = e.activity) == null ? void 0 : u.name) || "Tag segment"),
          l.length ? n(Ir, {
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
function Vc({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(Ra, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: Tl(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: ti(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Ca({ onNavigate: e, profile: t }) {
  const r = He(() => {
    const W = Ea("ext:com.midnightrider.segment-studio:segments");
    return W ? {
      ...Hr,
      defaultFilter: { ...Hr.defaultFilter, ...W.findFilter || {} },
      defaultObjectFilter: W.objectFilter || {}
    } : Hr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Da(r), [l, d] = L(null), [c, g] = L({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [u, f] = L(null), [m, p] = L(null), [h, y] = L(0), [w, k] = L(""), [E, Q] = L(!0), [I, M] = L(""), N = pe(0), S = ta(o, i), $ = S.activityTagId, A = Tn(i.slots), z = He(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (W) => Object.keys(Tn(W)).length > 0,
    sanitize: (W) => qr($, Tn(W)),
    summarize: (W) => `${Object.keys(Tn(W)).length} assigned`,
    renderEditor: (W, de) => $ ? n(Ia, {
      facets: l,
      values: Tn(W),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (Y, fe) => {
        const he = { ...Tn(W) };
        fe ? he[Y] = Number(fe) : delete he[Y], de(qr($, he));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [$, l, c.performerSlotsAvailable]), ie = JSON.stringify(S);
  ye(() => {
    if (d(null), !$) return;
    const W = new AbortController();
    return ee(`/browse/activities/${$}/facets`, { signal: W.signal }).then(d).catch((de) => {
      de.status === 403 ? d({ slots: [], restricted: !0 }) : de.name !== "AbortError" && M(de.message);
    }), () => W.abort();
  }, [$]), ye(() => {
    const W = ++N.current, de = new AbortController();
    return Q(!0), M(""), ee("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(S), signal: de.signal }).then((Y) => {
      W === N.current && g({ ...Y, totalCount: Y.totalCount ?? Y.total ?? 0 });
    }).catch((Y) => {
      if (!(W !== N.current || Y.name === "AbortError")) {
        if (Y.status === 400 && Y.message.includes("unrestricted performer read access")) {
          g((fe) => ({ ...fe, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), M("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        M(Y.message);
      }
    }).finally(() => {
      W === N.current && Q(!1);
    }), () => {
      N.current++, de.abort();
    };
  }, [ie, h]);
  const U = c.items.findIndex((W) => W.key === u), T = c.items[U] || null;
  function R(W) {
    s(W), a({ ...o, page: 1 });
  }
  function q(W) {
    const de = ta(o, W), Y = W.slots && de.activityTagId != null && de.slotAssignments.length > 0 ? W.slots : void 0;
    R({ ...W, slots: Y });
  }
  function re(W, de) {
    const Y = { ...A };
    de ? Y[W] = Number(de) : delete Y[W], R({ ...i, slots: qr($, Y) });
  }
  function ae() {
    const W = document.querySelector(`[data-segment-key="${u}"]`);
    f(null), requestAnimationFrame(() => W == null ? void 0 : W.focus());
  }
  async function xe(W) {
    var fe;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(W.key), k("");
    const de = `browse-restore:${W.itemId}:${W.revision}`, Y = Fe(de);
    try {
      const he = (ve = !1) => ee(`/bin/${W.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Y,
          expectedRevision: W.revision,
          discardMissingImage: ve
        })
      });
      try {
        await he(uo(de));
      } catch (ve) {
        if (((fe = ve.payload) == null ? void 0 : fe.code) !== "missing-image" || !window.confirm(`${ve.message}

Continue and discard the missing image reference?`))
          throw ve;
        mo(de), await he(!0);
      }
      Ge(de), u === W.key && f(null), k("Segment restored to Cove."), y((ve) => ve + 1);
    } catch (he) {
      k(he.message || "Unable to restore the segment."), he.status === 409 && y((ve) => ve + 1);
    } finally {
      p(null);
    }
  }
  async function _(W) {
    p(W.key), k("");
    try {
      const de = await ee(`/items/${W.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: W.revision })
      });
      if (!ii(de, k) || !zl(de))
        return;
      const Y = `browse-dependency-delete:${W.itemId}:${de.fingerprint}`;
      await ee(`/items/${W.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(Y),
          fingerprint: de.fingerprint
        })
      }), Ge(Y), u === W.key && f(null), k(`${de.deletedSegmentCount} segment${de.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), y((fe) => fe + 1);
    } catch (de) {
      k(de.message || "Unable to permanently delete the segment."), de.status === 409 && y((Y) => Y + 1);
    } finally {
      p(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(bo, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(Oa, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: a,
      totalCount: c.totalCount,
      isLoading: E,
      error: I ? new Error(I) : null,
      onRetry: () => y((W) => W + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? ea.filter((W) => W.id !== "performers") : ea,
      objectFilter: i,
      onObjectFilterChange: q,
      customFilterSections: z,
      searchPlaceholder: "Search segments..."
    }, [
      $ ? n(Ia, { key: "slots", facets: l, values: A, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: re }) : null,
      n(Vc, { key: "player", item: T, index: U, count: c.items.length, onPrevious: () => {
        var W;
        return f((W = c.items[U - 1]) == null ? void 0 : W.key);
      }, onNext: () => {
        var W;
        return f((W = c.items[U + 1]) == null ? void 0 : W.key);
      }, onClose: ae, onNavigate: e }),
      w ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, w) : null,
      !E && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      E ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((W) => n(Wc, {
        key: W.key,
        item: W,
        selected: W.key === u,
        busy: m === W.key,
        onSelect: () => f(W.key),
        onRestore: xe,
        onPurge: _
      })))
    ])
  ]);
}
function Jc({ onNavigate: e, profile: t }) {
  const [r, o] = L([]), [i, a] = L(""), [s, l] = L(0), [d, c] = L(!0), [g, u] = L(null), [f, m] = L(""), p = pe(null);
  async function h(k) {
    const E = await ee("/bin", k ? { signal: k } : void 0);
    return o(E.items || []), a(E.fingerprint || ""), l(Number(E.totalCount) || 0), E;
  }
  ye(() => {
    const k = new AbortController();
    return c(!0), h(k.signal).catch((E) => {
      E.name !== "AbortError" && m(E.message);
    }).finally(() => {
      k.signal.aborted || c(!1);
    }), () => k.abort();
  }, []), Ma(ao, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var k;
      return (k = p.current) == null ? void 0 : k.call(p);
    }
  }]);
  async function y(k) {
    var I;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    u(k.itemId), m("");
    const E = `restore:${k.itemId}:${k.revision}`, Q = Fe(E);
    try {
      const M = (N = !1) => ee(`/bin/${k.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Q, expectedRevision: k.revision, discardMissingImage: N })
      });
      try {
        await M(uo(E));
      } catch (N) {
        if (((I = N.payload) == null ? void 0 : I.code) !== "missing-image" || !window.confirm(`${N.message}

Continue and discard the missing image reference?`)) throw N;
        mo(E), await M(!0);
      }
      Ge(E), await h(), Hn(), m("Segment restored with a new native ID.");
    } catch (M) {
      m(M.message || "Unable to restore the segment."), M.status === 409 && await h();
    } finally {
      u(null);
    }
  }
  async function w() {
    if (g == null)
      try {
        const k = await li({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          u(-1), m("");
        });
        if (k.status !== "emptied") return;
        await h(), Hn(), m(`${k.segmentCount} segment${k.segmentCount === 1 ? "" : "s"} from ${k.sceneCount} scene${k.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (k) {
        m(k.message || "Unable to empty the recycling bin."), k.status === 409 && await h();
      } finally {
        u(null);
      }
  }
  return p.current = w, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    n(bo, {
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
    f ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, f) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((k) => n("article", { key: k.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${k.tagName || "Tag segment"} · ${k.videoTitle || `Video ${k.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, k.endSec == null ? Me(k.startSec) : `${Me(k.startSec)} – ${Me(k.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${k.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${k.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: g != null, onClick: () => y(k), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const $a = "ext:com.midnightrider.segment-studio:videos";
function Vr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = He(() => {
    var ce;
    const ne = Ea($a), me = (ce = ne == null ? void 0 : ne.uiOptions) == null ? void 0 : ce.displayMode;
    return ne ? {
      ...Un,
      defaultFilter: { ...Un.defaultFilter, ...ne.findFilter || {} },
      defaultObjectFilter: ne.objectFilter || {},
      defaultDisplayMode: Un.allowedDisplayModes.includes(me) ? me : Un.defaultDisplayMode
    } : Un;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = Da(i), [u, f] = L({ items: [], totalCount: 0 }), [m, p] = L(!0), [h, y] = L(""), [w, k] = L(0), [E, Q] = L(/* @__PURE__ */ new Set()), [I, M] = L(null), [N, S] = L({ busy: !1, error: "", announcement: "" }), $ = pe(0), A = pe(null), z = pe(null);
  z.current || (z.current = Oc());
  const ie = JSON.stringify(a), U = JSON.stringify(s), T = t || r === "review";
  ye(() => {
    z.current.selectionChanged(), A.current = null, Q(/* @__PURE__ */ new Set()), S((ne) => ({ busy: ne.busy, error: "", announcement: "" }));
  }, [ie, U]), ye(() => {
    if (!T) return;
    const ne = new AbortController();
    return ee("/analysis/status", { signal: ne.signal }).then(M).catch((me) => {
      me.name !== "AbortError" && M({ configured: !0, ready: !1, error: me.message || "Unable to check Full Scan readiness." });
    }), () => ne.abort();
  }, [T]), ye(() => {
    const ne = ++$.current, me = new AbortController();
    return p(!0), y(""), ee(`/videos?${nc(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: me.signal }).then((ce) => {
      ne === $.current && f(ce);
    }).catch((ce) => {
      ne === $.current && ce.name !== "AbortError" && y(ce.message || "Unable to discover videos.");
    }).finally(() => {
      ne === $.current && p(!1);
    }), () => {
      $.current++, me.abort();
    };
  }, [ie, U, t, r, w]);
  function R(ne) {
    d({ ...ne, page: ne.page || 1 });
  }
  function q(ne) {
    c(ne), d({ ...a, page: 1 });
  }
  function re(ne, me = !1) {
    Q((ce) => rc(
      ce,
      u.items.map((Z) => Z.videoId),
      ne,
      A.current,
      me
    )), A.current = ne;
  }
  function ae() {
    A.current = null, Q(new Set(u.items.map((ne) => ne.videoId)));
  }
  function xe() {
    A.current = null, Q(/* @__PURE__ */ new Set());
  }
  function _() {
    A.current = null, Q((ne) => new Set(u.items.map((me) => me.videoId).filter((me) => !ne.has(me))));
  }
  async function W(ne = ["aiTagging", "omnishotcut"]) {
    const me = z.current.begin();
    if (me) {
      S({ busy: !0, error: "", announcement: "" });
      try {
        const ce = await Pc(
          [...E],
          ne,
          ee,
          (Z) => window.confirm(Z)
        );
        if (ce.cancelled) {
          S({ busy: !1, error: "", announcement: "" });
          return;
        }
        ce.queuedIds.length > 0 && z.current.ownsCurrentSelection(me) && (ce.queuedIds.includes(A.current) && (A.current = null), Q((Z) => {
          const te = new Set(Z);
          return ce.queuedIds.forEach((K) => te.delete(K)), te;
        })), S({
          busy: !1,
          announcement: ce.queuedIds.length > 0 ? `${ce.queuedIds.length} ${ce.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: ce.failed.length > 0 ? `${ce.failed.length} selected ${ce.failed.length === 1 ? "video could" : "videos could"} not be queued. ${ce.failed[0].error}` : ""
        });
      } catch (ce) {
        S({ busy: !1, error: ce.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        z.current.finish(me);
      }
    }
  }
  const de = t || r === "review" ? ba : ba.filter((ne) => !["reviewState", "shotBoundaries"].includes(ne.id)), Y = I === null || I.configured === !1 || I.ready === !1, fe = N.busy || Y, he = (I == null ? void 0 : I.error) || (I === null ? "Checking Full Scan availability" : I.configured === !1 ? "Configure the analysis service before running Full Scan" : I.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), ve = N.busy ? "Queueing scans…" : I === null ? "Checking Full Scan…" : I.configured === !1 ? "Full Scan not configured" : I.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
  return n("div", { className: "w-full space-y-5" }, [
    n(bo, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(Oa, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: $a,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: R,
      totalCount: u.totalCount,
      isLoading: m,
      error: h ? new Error(h) : null,
      onRetry: () => k((ne) => ne + 1),
      sortOptions: t || r === "review" ? [...ya, { value: "unreviewed_count", label: "Unreviewed count" }] : ya,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: de,
      objectFilter: s,
      onObjectFilterChange: q,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: T ? E : void 0,
      onSelectAll: T ? ae : void 0,
      onSelectNone: T ? xe : void 0,
      onInvertSelection: T ? _ : void 0,
      selectionActions: T ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: fe,
          onClick: () => W(),
          title: he,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, ve),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": fe,
            title: he,
            onClick: (ne) => {
              fe && ne.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${fe ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(Pa, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([ne, me]) => n("button", {
            key: ne,
            type: "button",
            disabled: N.busy,
            onClick: (ce) => {
              var Z;
              (Z = ce.currentTarget.closest("details")) == null || Z.removeAttribute("open"), W(me);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, ne)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, N.announcement),
      N.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, N.error) : null,
      !m && u.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !m && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, u.items.map((ne) => n(oc, { key: ne.videoId, item: ne, onNavigate: e, showReviewStates: T, selected: E.has(ne.videoId), selectionActive: E.size > 0, onSelect: T ? re : null }))) : null,
      !m && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, u.items.map((ne) => n(ac, { key: ne.videoId, item: ne, onNavigate: e, showReviewStates: T, selected: E.has(ne.videoId), selectionActive: E.size > 0, onSelect: T ? re : null }))) : null
    ])
  ]);
}
function Ta({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = L(null), [s, l] = L(!0), [d, c] = L(""), g = pe(0), u = pe(0), f = pe(e), m = Kd();
  f.current = e;
  const p = (E) => `/videos/${E}/editor`;
  async function h(E, Q, I) {
    const M = await ee(p(Q), I ? { signal: I.signal } : void 0);
    return en(E, I ? g.current : u.current, Q, f.current) ? (a(M), !0) : !1;
  }
  ye(() => {
    const E = ++g.current, Q = e, I = new AbortController();
    return a(null), l(!0), c(""), h(E, Q, I).catch((M) => {
      en(E, g.current, Q, f.current) && M.name !== "AbortError" && c(M.message || "Unable to load the editor.");
    }).finally(() => {
      en(E, g.current, Q, f.current) && l(!1);
    }), () => {
      g.current++, u.current++, I.abort();
    };
  }, [e]);
  function y(E, Q) {
    a((I) => (I == null ? void 0 : I.video.id) !== Q ? I : typeof E == "function" ? E(I) : E);
  }
  async function w() {
    const E = e, Q = ++u.current;
    try {
      const I = await ee(p(E));
      return en(Q, u.current, E, f.current) ? (a(I), c("A newer canonical segment was loaded. Your stale change was not applied."), I) : null;
    } catch (I) {
      return en(Q, u.current, E, f.current) && c(I.message || "Unable to reload the latest segment."), null;
    }
  }
  async function k() {
    const E = e, Q = ++u.current;
    try {
      const I = await ee(p(E));
      return en(Q, u.current, E, f.current) ? (a(I), c(""), I) : null;
    } catch (I) {
      return en(Q, u.current, E, f.current) && c(I.message || "Unable to reload performer slots."), null;
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
      n(ws, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(Ec, {
      key: i.video.id,
      detail: i,
      onDetailChange: y,
      onConflict: w,
      onReload: k,
      onSlotsChanged: k,
      splitLayout: m,
      profile: o,
      initialSegmentId: ra() ? -ra() : Al(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function Yc(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function Qc(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function Zc(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function Xc({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = xl(o), l = Yc(e, t, window.location.pathname), d = Qc(e, t, window.location.pathname), c = Zc(e, t, window.location.pathname), g = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (wl(g, o) === "videos" && g !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Vr, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(_c, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(Ca, { onNavigate: r, profile: o });
    const m = Number(e);
    return Number.isInteger(m) && m > 0 ? n(Ta, {
      videoId: m,
      onNavigate: r,
      compatibilityMode: !0,
      profile: o
    }) : n(Vr, {
      onNavigate: r,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return n(Jc, { onNavigate: r, profile: o });
  const f = Number(e);
  return d ? n(Ca, { onNavigate: r, profile: o }) : Number.isInteger(f) && f > 0 ? n(Ta, {
    videoId: f,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(Vr, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function eu({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = L(null), [a, s] = L("");
  return ye(() => {
    const l = new AbortController();
    return ee("/preferences", { signal: l.signal }).then((d) => i(Xa(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(Xc, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function tu(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function nu(e, t) {
  const r = tu(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const Nu = {
  components: { SegmentStudioPage: eu },
  actionHandlers: { openSegmentStudio: nu }
};
export {
  xr as CLEARED_SEGMENT_SELECTION_ID,
  ya as DISCOVERY_SORT_OPTIONS,
  qt as SEGMENT_STUDIO_CAPABILITIES,
  ao as SEGMENT_STUDIO_EXTENSION_ID,
  Yn as SEGMENT_STUDIO_SHORTCUTS,
  Ks as activeEditorFilterCount,
  Dd as addPendingChange,
  id as applyDerivationRuleSlotSuggestions,
  yr as applyFeedbackEditorDelta,
  jd as applyPendingChanges,
  la as applySegmentMergeDelta,
  _l as basicSegmentTimelineStyle,
  Tl as browseClipEnd,
  ti as browseEditorHref,
  ta as buildBrowseRequest,
  jc as buildDerivationRuleGraph,
  nc as buildDiscoverySearchParams,
  Ts as buildMinuteTimelineTicks,
  Lc as buildPerformerSlotOverview,
  Ol as buildSegmentQuickSearchEntries,
  ud as buildSegmentRailRows,
  md as buildTimelineRows,
  lu as buildTimelineTicks,
  Es as calculateCenteredTimelineScroll,
  Yr as calculateEditorPanelMaximum,
  As as calculateMinuteLabelStride,
  du as calculateMinuteTimelineWidth,
  Ps as calculateSwimlaneTitleMaximum,
  Ds as calculateTimelinePlayheadPosition,
  so as calculateTimelineRatioBounds,
  Fs as calculateTimelineRatioFromPointer,
  cu as calculateVerticalRevealOffset,
  tn as clampEditorPanelWidth,
  fr as clampSwimlaneTitleWidth,
  Ha as clampTimelineRatio,
  lo as clampTimelineRatioForHeight,
  vr as clampTimelineZoom,
  Zd as compactProvenanceSummary,
  Oc as createBulkAnalysisCoordinator,
  dl as createQueuedReviewRequest,
  Rd as createSaveQueue,
  Sa as createSegmentAnalysisRequestScope,
  Nu as default,
  Pd as discardPendingChange,
  Kl as downloadFileNameFromContentDisposition,
  zs as dualRangeValueFromPointer,
  Qo as duplicateIdentityFromResponse,
  ml as duplicateOperationKey,
  Wa as editorVisibilityIncludingSegment,
  fd as expandedSwimlanes,
  Nl as extensionOwnedSegmentsModeSwitchPrompt,
  xd as feedbackFrameTimestamps,
  kd as feedbackResultMatchesAction,
  Sd as feedbackSelectionPlan,
  Us as filterDerivedSegments,
  zr as filterEditorSegments,
  Fc as filterPerformerSlotOverview,
  Dl as filterSegmentQuickSearch,
  fu as filterSegmentStudioShortcuts,
  hd as findAdjacentSegmentGroupKey,
  hl as findAdjacentShot,
  il as findEditorShortcut,
  za as findInitialSegmentSelection,
  $s as findNearestSegmentInCurrentSwimlane,
  bl as findPublishedSelectionIdentity,
  Je as findSegmentByStableIdentity,
  js as findSegmentFromPlayhead,
  Cs as findSegmentNearPlayhead,
  bd as findSwimlaneRangeSelection,
  to as findSwimlaneSelection,
  Ml as findUniquePerformerSlotAssignment,
  hr as findUnreviewedSelection,
  ed as focusDialogDefaultButton,
  Nr as formatGenderHint,
  vl as frameStepSeconds,
  ni as generatePerformerSlotAssignmentRecommendations,
  pc as groupApprovedDraftsForPublishing,
  El as groupAutoAssignCandidates,
  wd as groupIncorrectExamplesByTag,
  vc as groupMaterializationOutputs,
  nn as groupSegmentsIntoSwimlanes,
  gd as groupSelectedSwimlanes,
  yo as groupSwimlanesBySegmentGroup,
  Nt as handleModalKey,
  Rn as hasSegmentStudioCapability,
  ki as heldTagChangeFor,
  yl as heldTagReady,
  ca as hideCollectedFeedbackSegments,
  td as historyActionsForTarget,
  ur as incorrectExampleHistoryState,
  gi as indexPerformerSlotsBySegment,
  hu as initialReviewFilter,
  Cd as insertSegmentProjection,
  en as isCurrentEditorRequest,
  Ql as isEditableTarget,
  xu as isEditorShortcutOwner,
  Ad as isKindRunning,
  wu as isSaveQueueBusy,
  Zc as isSegmentStudioBinRoute,
  Qc as isSegmentStudioSegmentsRoute,
  Yc as isSegmentStudioSettingsRoute,
  Bc as layoutDerivationRuleComponent,
  Gc as layoutDerivationRuleComponents,
  Td as mergeSegmentsProjection,
  od as multiSelectionActionHint,
  Qs as nextSegmentAfterRemoval,
  Zs as nextUnreviewedAfterRemoval,
  Jt as normalizeCollapsedSegmentGroups,
  va as normalizeDiscoveryIds,
  Tt as normalizeEditorSegmentFilters,
  Wt as normalizeGender,
  Zo as normalizeReviewFilter,
  Xa as normalizeSegmentStudioFeatureProfile,
  yu as normalizeSegmentStudioMode,
  Xr as normalizeSegmentStudioPublicMode,
  Tn as parseBrowseSlotFilters,
  Ls as parseEditorLayout,
  Bs as parseHideDerivedSegmentsPreference,
  Gs as parseMergeConfirmationPreference,
  Qa as parsePlaybackShortcutConfig,
  ol as parseShortcutBindingOverrides,
  Wr as patchPerformerSlotProjection,
  ga as patchSegmentProjection,
  Bd as pendingChangesReducer,
  Od as pendingInsertedSegments,
  Xs as percentageSeekTime,
  Rl as performInitialSegmentSeek,
  at as performerOptionId,
  Sr as performerSlotHistoryState,
  kt as performerSlotLabel,
  sd as performerSlotPresentation,
  ku as performerSlotStatus,
  fo as performerSlotStatusFromSegmentSlots,
  mi as performerSlotsForSegment,
  Ot as provenanceSourceLabel,
  Ni as prunePendingChanges,
  fl as queueCreatedSegmentTagChoice,
  ri as rankPerformerOptions,
  vd as reconcileSegmentGroupKey,
  Js as reconcileSelectedSegmentIds,
  ic as recyclingBinActionText,
  Hl as recyclingBinDeletionPrompt,
  si as recyclingBinDeletionSummary,
  Il as recyclingBinModeSwitchPrompt,
  bu as removeQueuedReviewsForSegments,
  $d as removeSegmentsProjection,
  ra as requestedOwnedItemId,
  Al as requestedSegmentId,
  qs as resolveEditorSegmentSelection,
  cl as resolveQueuedReviewRequest,
  gl as resolveSegmentCreationAction,
  wl as resolveSegmentStudioRoute,
  al as resolveSegmentStudioShortcuts,
  xi as resolveSegmentTarget,
  Uc as resolveSelectedDerivationRule,
  Vo as resolveSelectedSegments,
  wc as restoreDisabledToolbarActionFocus,
  Mc as restorePublishApprovedFocus,
  no as restoreSegmentFieldsProjection,
  hi as restoreSegmentsProjection,
  Fd as retargetPendingChanges,
  bi as revealCollapsedSegmentGroup,
  Pc as runSelectedDiscoveryAnalysis,
  Mn as sameSegmentIdentity,
  Si as savingSegmentIdFrom,
  di as segmentBadgeStyle,
  wr as segmentGroupHeaderBackground,
  Et as segmentGroupKeyForSegment,
  po as segmentHistoryIdentity,
  cr as segmentHistoryState,
  rn as segmentIdentity,
  ci as segmentRailItemStyle,
  vu as segmentStateStyle,
  tu as segmentStudioActionTarget,
  xl as segmentStudioLegacyMode,
  ql as segmentTimelineStyle,
  $t as segmentsHistoryState,
  Ys as selectAllVideoSegmentIds,
  Cl as selectedBrowseStates,
  fi as selectedSwimlaneMerge,
  Ii as setBackLinkNavigation,
  Ld as settlePendingChange,
  nd as sharedPerformerSlotShape,
  rd as sharedTagPerformerSlotShape,
  An as shortcutAvailableInMode,
  sl as shortcutBindingDisplayText,
  uu as shortcutBindingFromEvent,
  gu as shortcutBindingsOverlap,
  pu as shortcutModesOverlap,
  rl as shortcutRequiresSingleSegment,
  zn as shotBoundaryFingerprint,
  Xl as shouldAcceptCurrentTagFromEnter,
  mu as shouldExitShortcutCapture,
  Su as shouldHandleEditorShortcut,
  xa as shouldLoadSegmentAnalysis,
  fa as shouldReloadAfterSegmentMutation,
  Zr as shouldRestoreTransitionSelection,
  Pl as shouldShowQuickSearchGroups,
  Jo as splitShortcutCategoriesIntoColumns,
  ad as suggestDerivationRuleSlotMappings,
  Wn as swimlaneDisplayLabel,
  Yl as swimlaneMarkerTop,
  Vl as swimlaneStripeBackground,
  pl as tagEditorLockedBySave,
  vi as targetsOverlap,
  Os as timelineContentStyle,
  qo as timelinePlayheadHorizontalStyle,
  Wl as timelineSegmentWidth,
  Rs as timelineTickAlignment,
  Ms as timelineTickPosition,
  Jr as timelineTimePercent,
  yd as toggleAllCollapsedSegmentGroups,
  ll as toggledSelectionReviewState,
  Ut as trapModalFocus,
  Bl as tryParseJsonResponseText,
  Vs as updateAnchoredSegmentSelection,
  rc as updateDiscoverySelection,
  Hs as updateDualRangeValues,
  _s as updateSegmentCollectionSelection,
  Ws as updateSegmentRangeSelection,
  Va as updateSegmentSelection,
  Na as validateDerivationRuleDraft,
  Ho as validateSegmentTiming,
  co as videoPerformerOptions,
  _r as videoPerformerSlotAssignments,
  kl as visibleSegmentStudioSettingsTabs,
  Sl as visibleSegmentStudioTabs,
  pi as visibleVirtualRows
};
