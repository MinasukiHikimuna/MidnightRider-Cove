import Yr from "@cove/runtime/react";
import { createPortal as qi } from "@cove/runtime/react-dom";
import { extensionFetch as ba } from "@cove/runtime/api";
import { formatDuration as Wi, EntityReferenceSelector as Mn, useExtensionKeyboardBindings as Vi, VideoPlayer as ha, useRegisterExtensionKeyboardActions as va, getDefaultFilter as xa, useListUrlState as Sa, ListPage as ka } from "@cove/runtime/components";
import { ChevronDown as wa, StepBack as Ji, StepForward as Yi, Loader2 as Qi } from "@cove/runtime/lucide-react";
const Qr = "com.midnightrider.segment-studio", Na = "segment-studio.layout.v1", _t = "segment-studio.operations.v1", Ia = "segment-studio.collapsed-segment-groups.v1", $a = "segment-studio.playback-shortcuts.v1", Ca = "segment-studio.timing-clipboard.v1", Ta = "segment-studio.hide-derived-segments.v1", Aa = "segment-studio.merge-confirmation.v1", nt = ["unreviewed", "approved", "rejected"], Zi = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], Eo = "(min-width: 1024px) and (min-height: 640px)", Do = "(min-width: 1024px) and (min-height: 900px)", En = 1e-3, Oo = 15, Xi = 30, Ra = 12, st = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, Zr = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30
}, Ct = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function Po(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function Ma(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? sr(e, null, 1, !0) ?? r[0] ?? null;
}
function sr(e, t, r, o = !1) {
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
function es(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((g, u) => g.markers.filter(({ segment: f }) => {
    const m = Number(f.startSec), p = f.endSec == null ? m + Xi : Number(f.endSec);
    return Number.isFinite(m) && Number.isFinite(p) && p >= m && m <= i + Oo + En && p >= i - Oo - En;
  }).map(({ segment: f }) => ({ segment: f, laneIndex: u }))).sort((g, u) => g.laneIndex - u.laneIndex || Math.abs(g.segment.startSec - i) - Math.abs(u.segment.startSec - i) || g.segment.id - u.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((g) => g.markers.some((u) => u.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((g) => g.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((g) => g.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((g) => g.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function ts(e, t, r) {
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
function lr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function Sc(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function ns(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function kc(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function rs(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function os(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function as(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function is(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Gr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function ss(e, t, r = 10) {
  const o = Gr(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function Lo(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function ls(e, t = Ra) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function Ea(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : st.timelineRatio;
}
function Ur(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function Kt(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? st.detailWidth : Math.min(Ur(t, 0), Math.max(240, e));
}
function ir(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? st.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function ds(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function Xr(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: st.timelineRatio, maximum: st.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function eo(e, t) {
  const r = Ea(e);
  if (!(t > 0)) return r;
  const o = Xr(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function cs(e) {
  if (!e) return { ...st };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? Ea(r) : st.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: Kt(t == null ? void 0 : t.detailWidth),
      markerRailWidth: Kt(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: ir(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...st };
  }
}
function us(e, t, r) {
  return r > 0 ? eo((t + r - e) / r, r) : st.timelineRatio;
}
function wc(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function ms(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, g) => c.startSec - g.startSec || c.id - g.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= En ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function Ut(e, t, r, o) {
  return e === t && r === o;
}
const dr = "__segment-studio-cleared-selection__";
function gs(e) {
  return e === "true";
}
function ps(e) {
  return e !== "false";
}
function Da() {
  try {
    return ps(window.localStorage.getItem(Aa));
  } catch {
    return !0;
  }
}
function Oa(e) {
  try {
    window.localStorage.setItem(Aa, String(!!e));
  } catch {
  }
}
function fs(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function gt(e = {}) {
  const t = nt.filter((g) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(g) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (g, u) => {
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
function Or(e, t, r, o = !1, i = []) {
  var c, g;
  const a = gt(r), s = a.performerId == null ? null : new Set((t || []).filter((u) => Number(u.performerId) === a.performerId).map((u) => u.segmentId)), l = new Set((i || []).flatMap((u) => u.tags || []).map((u) => Number(u.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((g = (c = (i || []).find((u) => Number(u.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : g.map((u) => Number(u.tagId))) || []);
  return fs(e || [], o).filter((u) => {
    if (u.reviewState != null && !a.reviewStates.includes(u.reviewState) || s && !s.has(u.id) || a.tagId != null && Number(u.tagId) !== a.tagId || d && !d.has(Number(u.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(u.tagId)) || a.sourceKey != null && u.sourceKey !== a.sourceKey) return !1;
    const f = Number(u.confidence);
    return u.confidence == null || !Number.isFinite(f) ? a.includeUnscored : f >= a.confidenceMin && f <= a.confidenceMax;
  });
}
function ys(e, t, r, o = !1, i = []) {
  var l;
  const a = gt(r);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = gt({
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
    filters: gt(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function bs(e, t = !1) {
  const r = gt(e);
  return +(r.reviewStates.length !== nt.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function hs(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function vs(e, t, r, o) {
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
function xs(e, t, r = null) {
  return t === dr ? null : Ma(
    e,
    t ?? r
  );
}
function Pa(e, t, r, o = !1) {
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
function Ss(e, t, r) {
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
function ks(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return Pa(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function ws(e, t, r = null, o = !1) {
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
      ...ks(u, s, t, g, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: u
    };
  }
  const d = Pa(i, a, t, o);
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
function Ns(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function Is(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function Fo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function jo(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => Fo(t, o) - Fo(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function $s(e, t, r) {
  var c, g;
  const o = e || [], i = new Set(t || []), a = o.findIndex((u) => (u.markers || []).some(({ segment: f }) => f.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: u }) => u.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const u of o) {
      const f = (u.markers || []).find(({ segment: m }) => !i.has(m.id));
      if (f) return f.segment;
    }
    return null;
  }
  const l = jo(
    o[a].markers,
    s,
    i
  );
  if (l) return l;
  const d = (g = o.map((u, f) => ({ lane: u, index: f })).filter(({ lane: u }) => (u.markers || []).some(({ segment: f }) => !i.has(f.id))).sort((u, f) => Math.abs(u.index - a) - Math.abs(f.index - a) || +(u.index < a) - +(f.index < a) || u.index - f.index)[0]) == null ? void 0 : g.lane;
  return jo(d == null ? void 0 : d.markers, s, i);
}
function Cs(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function Ts(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function As(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function Rs() {
  try {
    return gs(window.localStorage.getItem(Ta));
  } catch {
    return !1;
  }
}
function Ms(e) {
  try {
    window.localStorage.setItem(Ta, String(!!e));
  } catch {
  }
}
const Ln = [
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
], Es = /* @__PURE__ */ new Set([
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
function Ds(e) {
  return Es.has(e);
}
function La(e) {
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
function Os(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Ln.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(La).filter(Boolean)]));
  } catch {
    return {};
  }
}
function Ps(e = {}) {
  const t = Os(e);
  return Ln.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function Bo(e, t = 2) {
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
function Nc(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : La({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function Ic(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function Kr(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function Go(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function $c(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = Go(e.code, t.key), a = Go(t.code, e.key);
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
          if (Kr(f, e) && Kr(f, t)) return !0;
        }
  return !1;
}
function cn(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function Cc(e, t) {
  return [!1, !0].some((r) => cn(e, r) && cn(t, r));
}
function Ls(e, t = !1, r = {}) {
  return Ps(r).find((o) => cn(o, t) && o.bindings.some((i) => Kr(e, i))) || null;
}
function Fa(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function Fs(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Fa).join(" / ") : "Unassigned";
}
function Tc(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, Fs(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function Ac(e) {
  return e === "review" ? "review" : "editor";
}
function Ue(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function js(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function Bs(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function Gs(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => Ue(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: Ue(t, e.activeIdentity) || r[0]
  };
}
function Us(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function Ks(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => Us(o, i))));
}
function Uo(e, t) {
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
function zs(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function _s(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function zr(e, t) {
  return e === t;
}
function Hs(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function qs(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - En).at(-1) || null : o.find((i) => i.startSec > t + En) || null;
}
function An(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function Ko(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: nt.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function Rc(e, t = null, r = !1) {
  const o = Ko(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function ln(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function ja(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: ln(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: ln(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: ln(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(ln(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(ln(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(ln(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...Zr };
  }
}
function Ws(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function Ba() {
  try {
    return ja(window.localStorage.getItem($a));
  } catch {
    return { ...Zr };
  }
}
function zo(e) {
  const t = ja(JSON.stringify(e));
  try {
    window.localStorage.setItem($a, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Tt = Object.freeze({
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
function _r(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function Ga(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? _r(e.requestedMode) : "basic",
    effectiveMode: i ? _r(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function un(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function Vs(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Js(e) {
  const t = [];
  return un(e, Tt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), un(e, Tt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function Ys(e) {
  return [
    ["general", "General", Tt.settingsGeneral],
    ["shortcuts", "Shortcuts", Tt.settingsShortcuts],
    ["performer-slots", "Performer slots", Tt.settingsPerformerSlots],
    ["derivation", "Derivation", Tt.settingsDerivation]
  ].filter(([, , r]) => un(e, r)).map(([r, o]) => [r, o]);
}
function Qs(e, t) {
  return e === "segments" && !un(
    t,
    Tt.navigationSegmentInventory
  ) || e === "bin" && !un(
    t,
    Tt.recyclingBinView
  ) ? "videos" : e;
}
function Zs(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Xs(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const Pr = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, _o = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: nt.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function el(e) {
  const t = String(e || "").split(",").filter((r) => nt.includes(r));
  return t.length === 0 ? [...nt] : [...new Set(t)];
}
function dn(e) {
  return Ua(e).values;
}
function Ua(e) {
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
function Lr(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function Ho(e, t) {
  var l;
  const r = qo(t.activitiesCriterion, t.activityId), o = qo(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = Ua(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: tl(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function qo(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function tl(e, t) {
  return nt.includes(e == null ? void 0 : e.value) ? [e.value] : el(t);
}
function Ka(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function nl(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function rl(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Wo(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function ol(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function We(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function to(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Fr(e, t) {
  const r = new Set(to(t).map((o) => String(We(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function Ot(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function Vo(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(Ot).sort().join(",")}`;
}
function za(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((m) => String(m.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((m) => {
    var p;
    return !((p = m.genderHints) != null && p.length);
  }) && e.length === t.length && !i) {
    const m = [...e].sort((y, b) => String(y.slotDefinitionId).localeCompare(String(b.slotDefinitionId))), p = [...t].sort((y, b) => String(y.name).localeCompare(String(b.name)) || Number(We(y)) - Number(We(b)));
    return [{
      assignments: Object.fromEntries(m.map((y, b) => [String(y.slotDefinitionId), String(We(p[b]))])),
      description: p.map((y) => y.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((m) => t.map((p, y) => ({ performer: p, index: y })).filter(({ performer: p }) => {
    var y;
    return !((y = m.genderHints) != null && y.length) || m.genderHints.some((b) => Ot(b) === Ot(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), g = i ? c.filter((m) => m.length > 0).length : Jo(c, t.length);
  if (g === 0) return [];
  const u = new Map(t.map((m, p) => [String(We(m)), p]));
  function f(m, p, y) {
    if (s.length >= a) return;
    const b = c.slice(m), N = i ? b.filter((O) => O.length > 0).length : Jo(b.map((O) => O.filter((q) => !p.has(String(We(t[q]))))), t.length);
    if (y + N < g) return;
    if (m === e.length) {
      if (y !== g) return;
      const O = Object.fromEntries(d.map(({ slot: A, performer: $ }) => [String(A.slotDefinitionId), $ ? String(We($)) : ""])), q = o.length === 0 ? Object.values(O).sort().join(",") : [...new Set(e.map((A) => String(A.label || "")))].map((A) => `${A}:${d.filter(({ slot: $ }) => String($.label || "") === A).map(({ performer: $ }) => $ ? String(We($)) : "").sort().join(",")}`).join("|");
      !l.has(q) && s.length < a && (l.add(q), s.push({
        assignments: O,
        description: d.map(({ slot: A, performer: $ }) => o.length ? `${A.label}: ${($ == null ? void 0 : $.name) || "Unassigned"}` : ($ == null ? void 0 : $.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const S = e[m], I = [...d].reverse().find(({ slot: O }) => Vo(O) === Vo(S)), H = I ? u.get(String(We(I.performer))) : -1;
    for (const O of c[m]) {
      const q = t[O], A = We(q);
      if (!(O < H) && !(A == null || !i && p.has(String(A))) && (d.push({ slot: S, performer: q }), i || p.add(String(A)), f(m + 1, p, y + 1), i || p.delete(String(A)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: S, performer: null }), f(m + 1, p, y), d.pop();
  }
  return f(0, /* @__PURE__ */ new Set(), 0), s;
}
function Jo(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function al(e, t) {
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
      !o && d.has(u.performerId) || (g = c.genderHints) != null && g.length && !c.genderHints.some((f) => Ot(f) === Ot(u.gender)) || (a.push({ slot: c, performer: u }), o || d.add(u.performerId), s(l + 1, d), o || d.delete(u.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function il(e) {
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
function sl(e, t, r = 20) {
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
function ll(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function dl(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function _a(e, t, r) {
  const o = We, i = new Set((t || []).map(o)), a = new Set((r || []).map(Ot));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const u = Ot(l.gender || l.genderIdentity), f = Ot(d.gender || d.genderIdentity), m = l.matchesGenderHint ?? a.has(u);
    return (d.matchesGenderHint ?? a.has(f)) - m || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: ye, useId: Ha, useMemo: Be, useRef: ge, useState: L } = Yr, n = Yr.createElement, qa = "/api/plugins/segment-studio";
function Pe(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(_t) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = Hr();
    return t[e] = r, window.localStorage.setItem(_t, JSON.stringify(t)), r;
  } catch {
    return Hr();
  }
}
function Le(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(_t) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(_t, JSON.stringify(t));
  } catch {
  }
}
function no(e) {
  try {
    return JSON.parse(window.localStorage.getItem(_t) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function ro(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(_t) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(_t, JSON.stringify(t));
  } catch {
  }
}
function cl(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function ul(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function ee(e, t, r = 0) {
  var d;
  const o = await ba(`${qa}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = cl(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await ul(250 * (r + 1), t == null ? void 0 : t.signal), ee(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function ml(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${qa}${e}`, o = await ba(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: gl(
      o.headers.get("Content-Disposition")
    )
  };
}
function gl(e, t = "segment-studio-ai-feedback.zip") {
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
function Hr() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function Wa(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function pl(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function Va(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function fl(e, t) {
  const { sceneCount: r, segmentCount: o } = Va(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function Ja(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = Va(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(fl(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await ee("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Pe(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return Le(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function Yo({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const ht = {
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
function Mc(e, t) {
  return {
    ...(ht[e] || ht.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function Ya(e) {
  return { ...(ht[e] || ht.unreviewed).badge };
}
function Qa(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const Za = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function yl(e, t, r = "not-applicable", o = !1) {
  const i = ht[e] || ht.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function bl(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function hl(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function vl(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function xl(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function gr(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function Sl(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function Ht({ state: e, includeLabel: t = !0 }) {
  const r = ht[e] || ht.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: Ya(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function kl(e, t = null) {
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
function Ec(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function wl(e, t = document) {
  return !(e.defaultPrevented || kl(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function Dc(e, t = document, r = !1, o = {}) {
  return wl(e, t) ? Ls(e, r, o) != null : !1;
}
function lt(e, { onCancel: t, onConfirm: r } = {}) {
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
function Nl(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function Il({ confirm: e, cancel: t, confirmReady: r }) {
  const o = r && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function oo({ confirmRef: e, cancelRef: t, confirmReady: r }) {
  ye(() => {
    const o = requestAnimationFrame(() => Il({
      confirm: e.current,
      cancel: t == null ? void 0 : t.current,
      confirmReady: r
    }));
    return () => cancelAnimationFrame(o);
  }, [r]);
}
function wt(e) {
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
function $l(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? i.filter((a) => a.sequence > o && a.sequence <= r).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > r && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function ao(e, t = !0) {
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
function nr(e, t = !0) {
  return {
    type: "segment",
    identity: ao(e, t),
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
function mt(e, t = !0) {
  return {
    type: "segments",
    segments: (e || []).map((r) => ({
      identity: ao(r, t),
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
function rr(e, t) {
  return {
    type: "incorrectExamples",
    collected: t,
    entries: (e || []).map(({ segment: r, result: o, example: i }) => ({
      exampleId: (o == null ? void 0 : o.exampleId) ?? (i == null ? void 0 : i.id) ?? null,
      originalIdentity: ao(r),
      collectedIdentity: {
        itemId: (o == null ? void 0 : o.itemId) ?? (i == null ? void 0 : i.itemId) ?? null,
        nativeSegmentId: (o == null ? void 0 : o.nativeSegmentId) ?? null,
        published: (o == null ? void 0 : o.nativeSegmentId) != null,
        revision: (o == null ? void 0 : o.revision) ?? null
      }
    }))
  };
}
function cr(e) {
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
function Xa(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function ei(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = t.get(r.segmentId);
    o ? o.push(r) : t.set(r.segmentId, [r]);
  }
  for (const r of t.values())
    r.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function io(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function Cl(e, t) {
  const r = (t || []).map((i) => Xa(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: rt(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function Tl(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : Cl(e, t);
}
function Al({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function Oc(e, t) {
  return io(Xa(e, t));
}
function rt(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function Rl(e, t) {
  const r = (d) => rt(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
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
function Ml(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = Rl(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function El(e) {
  const t = rt(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(pr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function pr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function ur(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function Qo(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((g) => g.end <= s && g.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: ur(o),
    trackCount: Math.max(1, t.length)
  };
}
function Dl(e) {
  const t = e.map(rt), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function Ol(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], g = d.length > 0 && d.every((u) => Number(u.performerId) > 0) ? d.map((u) => `${u.slotDefinitionId}:${Number(u.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: g };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [Qo({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = Dl(l.slots), g = l.slots.filter((y) => !a.has(String(y.slotDefinitionId))), u = o.length === 1 ? l.slots : g, f = u.map((y) => `${c.get(String(y.slotDefinitionId))} · ${y.performerName || `Performer ${y.performerId}`}`).join(" · "), m = [...new Map(u.map((y) => [
          Number(y.performerId),
          { id: Number(y.performerId), name: y.performerName || `Performer ${y.performerId}` }
        ])).values()], p = l.slots.map((y) => ({
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
          performers: m,
          performerAssignments: p,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(Qo);
}
function zt(e, t = [], r = []) {
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => Ol(s, a));
}
function so(e) {
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
    for (const s of nt)
      a.counts[s] += Number((r = o.counts) == null ? void 0 : r[s]) || 0;
  }
  return t;
}
const Pl = {
  group: 38,
  lane: 33,
  segment: 41
};
function Ll(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = Pl[s.kind];
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
function ti(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function Fl(e, t = [], r = !0) {
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
function jl(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: ur(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return so(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: ur(a)
    };
  });
}
function ni(e, { nativeOnly: t = !1 } = {}) {
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
function Zo(e, t) {
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
function Lt(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function Dn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function Bl(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var r;
    return (r = t[0]) == null ? void 0 : r.toUpperCase();
  }).join("") || "?";
}
function On({ performer: e, compact: t = !1, tooltip: r = null }) {
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
    }, o ? Bl(e.name) : "—"),
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
function ri({ assignments: e, className: t = "" }) {
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
      n(On, {
        key: `${r.key}:avatar`,
        performer: r.performer
      })
    ];
  }));
}
function fr({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = ge(null), i = `performer-slots-${Ha()}`, [a, s] = L(null);
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
    ...e.slice(0, 3).map((c) => n(On, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? qi(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(ri, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : n("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => n(On, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function Gl(e, t) {
  const r = new Set(Lt(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function oi(e, t) {
  return t ? Lt(e).filter((r) => r !== t) : Lt(e);
}
function Ul(e, t) {
  const r = Lt(t), o = new Set(Lt(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function bt(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function Xo(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), g = Number.isFinite(c) && c >= d ? c : d, u = d <= o && g >= o, f = u ? 0 : Math.min(Math.abs(o - d), Math.abs(o - g));
    return { contains: u, distance: f, duration: g - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function qr(e, t, r, o = null) {
  var g, u, f, m, p, y;
  const i = e.findIndex((b) => b.markers.some((N) => N.segment.id === t));
  if (i < 0) {
    const b = [...((g = e[0]) == null ? void 0 : g.markers) || []];
    return o != null && Number.isFinite(Number(o)) && b.sort((N, S) => Xo(N, S, o)), ((u = b[0]) == null ? void 0 : u.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((b) => b.segment.id === t);
  if (r === "left" || r === "right") {
    const b = r === "left" ? -1 : 1, N = Math.min(a.markers.length - 1, Math.max(0, s + b));
    return ((f = a.markers[N]) == null ? void 0 : f.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((m = a.markers[s]) == null ? void 0 : m.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((p = a.markers[s]) == null ? void 0 : p.segment) ?? null : ((y = [...e[l].markers].sort(c ? (b, N) => Xo(b, N, Number(o)) : (b, N) => Math.abs(b.segment.startSec - d) - Math.abs(N.segment.startSec - d) || b.segment.startSec - N.segment.startSec || b.segment.id - N.segment.id)[0]) == null ? void 0 : y.segment) ?? null;
}
function Kl(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = qr([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function zl(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function _l(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function Hl(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [na(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => na(Math.min(s, r + l))))];
}
function ql(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function Wl(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function Wr(e, t) {
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
function ea(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function Vl(e) {
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
async function Jl(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await ta(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], g = Hl(
        d.startSec,
        d.endSec
      );
      for (const [u, f] of g.entries()) {
        Math.abs(r.currentTime - f) > 5e-4 && (r.currentTime = f, await ta(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const m = await Yl(o), p = `example-${l + 1}-frame-${u + 1}`;
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
function ta(e, t) {
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
function Yl(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function na(e) {
  return Math.round(e * 1e3) / 1e3;
}
function mr(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Ql(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function Vr(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function Pn(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function ai(e, t) {
  const r = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...r.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function jr(e, t, r, o) {
  const i = (r || []).map((d) => ({ ...d, segmentId: t })), a = e.performerSlots || [], s = a.findIndex((d) => d.segmentId === t), l = a.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...i), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function Zl(e, t) {
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
function ra(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function Xl(e) {
  const { compatibilityMode: t, currentTime: r, detail: o, editorFilters: i, endInput: a, hideDerivedSegments: s, historyRef: l, mediaDuration: d, onConflict: c, onDetailChange: g, onReload: u, optimisticSegmentIdRef: f, pendingDuplicateRef: m, pendingFirstSegmentStartSecRef: p, pendingTagEditSegmentIdRef: y, replaceSegmentSelection: b, savingSegmentId: N, segments: S, selectedSegment: I, selectedSegmentIdRef: H, selectedSegments: O, selectionAnchorIdRef: q, selectionRangeBaseIdsRef: A, setEditorFilters: $, setFirstSegmentTagOpen: T, setHideDerivedSegments: P, setHistory: _, setHistoryOpen: U, setPublishApprovedError: J, setSaveMessage: w, setSavingSegmentId: C, setSelectedSegmentGroupKey: G, setSelectedSegmentId: Q, setSelectedSegmentIds: ie, startInput: ce, timelineDuration: pe, video: j } = e;
  function X(Z) {
    l.current = Z || Ct, _(l.current);
  }
  async function ue(Z, M, le, k, x = null) {
    var v;
    try {
      const h = await ee(`/videos/${j.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: l.current.revision,
          kind: Z,
          label: M,
          beforeState: le,
          afterState: k,
          receiptId: x
        })
      });
      return X(h), !0;
    } catch (h) {
      return h.status === 409 && ((v = h.payload) != null && v.current) && X(h.payload.current), w("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function ae(Z, M, le = !0, k = null, x = !1, v = M) {
    var Y;
    if (!Z || N != null) return null;
    const h = O.map((ke) => ke.id), D = H.current, ne = le && !t ? crypto.randomUUID() : null;
    C(Z.id), w(le ? "Saving directly to Cove…" : "Restoring history…");
    const re = x ? mr(o, [Z.id], v) : null;
    re && g(re, j.id);
    try {
      if (t && Z.nativeSegmentId == null && Z.itemId != null) {
        const z = `draft-update:${j.id}:${Z.itemId}:${Z.revision}:${M.tagId}:${M.startSec}:${M.endSec ?? "open"}:${M.reviewState ?? Z.reviewState}`, E = await ee(`/videos/${j.id}/drafts/${Z.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Pe(z),
            expectedRevision: Z.revision,
            startSec: M.startSec,
            endSec: M.endSec,
            tagId: M.tagId,
            reviewState: M.reviewState
          })
        });
        Le(z);
        const oe = {
          ...Z,
          ...E.draft,
          id: Z.id,
          itemId: Z.itemId
        };
        return le && await ue(
          "segment.update",
          k || "Changed segment",
          nr(Z, t),
          nr(
            oe,
            t
          )
        ), ra(Z, M, t) ? await u() : g({
          ...o,
          approvedSetVersion: E.approvedSetVersion || o.approvedSetVersion,
          segments: S.map((ve) => ve.id === Z.id ? oe : ve).sort((ve, be) => ve.startSec - be.startSec || ve.id - be.id)
        }, j.id), w(((Y = E.draft) == null ? void 0 : Y.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), oe;
      }
      const ke = await ee(`/videos/${j.id}/segments/${Z.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...M,
          expectedUpdatedAt: Z.updatedAt,
          historyReceiptId: ne
        })
      }), V = {
        ...Z,
        ...ke,
        reviewState: M.reviewState ?? Z.reviewState
      }, te = S.map((z) => z.id === Z.id ? V : z).sort((z, E) => z.startSec - E.startSec || z.id - E.id);
      return ra(Z, M, t) ? await u() : g({ ...o, segments: te }, j.id), le && await ue(
        "segment.update",
        k || "Changed segment",
        nr(Z, t),
        nr(
          V,
          t
        ),
        ne
      ), w(le ? "Saved to Cove" : "History restored"), V;
    } catch (ke) {
      return x && (g((V) => Pn(
        V,
        [Z],
        Object.keys(v)
      ), j.id), ie(h), Q(D), q.current = D, A.current = []), ke.status === 409 ? (w("Conflict — loading the latest segment…"), await c()) : w(ke.message || "Unable to save the segment."), null;
    } finally {
      C(null);
    }
  }
  async function xe() {
    if (!t) return !1;
    const Z = S.filter((le) => !le.published && le.reviewState === "approved").length;
    if (Z === 0 || N != null) return !1;
    const M = `complete-review:${j.id}:${o.approvedSetVersion}`;
    J(""), C(-1), w(`Publishing ${Z} Approved draft${Z === 1 ? "" : "s"}…`);
    try {
      const le = await ee(`/videos/${j.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe(M),
          expectedApprovedSetVersion: o.approvedSetVersion
        })
      });
      Le(M), X(Ct), U(!1);
      const k = await u(), x = Hs(
        S,
        H.current,
        le.published
      ), v = x ? Ue(k == null ? void 0 : k.segments, x) : null;
      return v && Q(v.id), w(`${le.published.length} Approved draft${le.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (le) {
      const k = le.status === 409 ? "The approved drafts changed. Review the updated list and try again." : le.message || "Unable to publish the approved drafts.";
      return le.status === 409 && await c(), J(k), w(k), !1;
    } finally {
      C(null);
    }
  }
  async function Se(Z = null, M = null) {
    var V;
    if (N != null) return;
    const le = Z != null ? p.current : null, k = Number.isFinite(le) ? le : r, x = Math.min(pe, k + 20);
    if (x <= k) {
      w("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const v = _s(S, I, Z);
    if (v.kind === "choose-tag") {
      p.current = k, w(""), T(!0);
      return;
    }
    if (v.kind === "invalid-selection") {
      w("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: h } = v, D = `create-draft:${j.id}:${h}:${k}`, ne = t ? null : crypto.randomUUID(), re = H.current, Y = {
      ...I || {},
      id: f.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: h,
      tagName: M || (I == null ? void 0 : I.tagName) || "Tag segment",
      tagSortName: h === (I == null ? void 0 : I.tagId) && (I == null ? void 0 : I.tagSortName) || null,
      startSec: k,
      endSec: x,
      reviewState: "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, ke = Ql(o, Y);
    C(-1), T(!1), g(ke, j.id), b(Y.id), G(bt(
      zt(ke.segments, ke.segmentGroups || [], ke.performerSlots || []),
      Y.id
    ));
    try {
      let te;
      if (t) {
        const oe = await ee(`/videos/${j.id}/drafts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationId: Pe(D), tagId: h, startSec: k, endSec: x })
        });
        Le(D), te = { itemId: (V = oe.draft) == null ? void 0 : V.itemId };
      } else
        te = { nativeSegmentId: (await ee(`/videos/${j.id}/segments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tagId: h,
            startSec: k,
            endSec: x,
            historyReceiptId: ne
          })
        })).id };
      p.current = null, T(!1);
      const z = await u();
      if (!z) {
        g((oe) => Vr(
          oe,
          [Y.id]
        ), j.id), b(re), w("Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment.");
        return;
      }
      const E = Ue(z == null ? void 0 : z.segments, te);
      E ? (t || await ue(
        "segment.create",
        "Created segment",
        mt([], !1),
        mt([E], !1),
        ne
      ), v.openTagEditor && (y.current = E.id), b(E.id), G(bt(
        zt(z.segments || [], z.segmentGroups || [], z.performerSlots || []),
        E.id
      ))) : w("Segment created, but it could not be selected.");
    } catch (te) {
      g((z) => Vr(
        z,
        [Y.id]
      ), j.id), b(re), Z != null && T(!0), w(te.message || "Unable to create the draft.");
    } finally {
      C(null);
    }
  }
  async function R() {
    if (O.length !== 1 || !I || N != null) return;
    const Z = r;
    if (Z <= I.startSec || I.endSec != null && Z >= I.endSec) {
      w("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const M = `split-draft:${I.itemId}:${I.revision}:${Z}`, le = t ? null : mt([I], !1), k = t ? null : crypto.randomUUID();
    C(I.id);
    try {
      let x = null;
      t && I.nativeSegmentId == null ? (await ee(`/videos/${j.id}/drafts/${I.itemId}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe(M),
          expectedRevision: I.revision,
          splitSec: Z
        })
      }), Le(M)) : x = { nativeSegmentId: (await ee(`/videos/${j.id}/segments/${I.id}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedUpdatedAt: I.updatedAt,
          splitSec: Z,
          historyReceiptId: k
        })
      })).id };
      const v = await u();
      if (!t) {
        const h = [
          Ue(v == null ? void 0 : v.segments, {
            nativeSegmentId: I.nativeSegmentId ?? I.id
          }),
          Ue(
            v == null ? void 0 : v.segments,
            x
          )
        ].filter(Boolean);
        await ue(
          "segment.split",
          "Split segment",
          le,
          mt(h, !1),
          k
        );
      }
      w(t ? `Segment split; both ranges remain ${I.reviewState}.` : "Segment split.");
    } catch (x) {
      x.status === 409 ? await c() : w(x.message || "Unable to split the draft.");
    } finally {
      C(null);
    }
  }
  async function W(Z = !1) {
    var x, v;
    if (O.length !== 1 || !I || N != null) return;
    const M = Z ? r : I.startSec, le = zs(j.id, I, Z, M), k = t ? null : crypto.randomUUID();
    C(I.id);
    try {
      const h = ((x = m.current) == null ? void 0 : x.operationKey) === le ? m.current : null;
      let D = (h == null ? void 0 : h.duplicateIdentity) ?? null;
      if (D == null && t && I.nativeSegmentId == null) {
        const Y = await ee(`/videos/${j.id}/drafts/${I.itemId}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Pe(le),
            expectedRevision: I.revision,
            startSec: Z ? M : null
          })
        });
        D = Uo(!1, Y), m.current = { operationKey: le, duplicateIdentity: D };
      } else if (D == null) {
        const Y = await ee(`/videos/${j.id}/segments/${I.id}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: I.updatedAt,
            startSec: Z ? M : null,
            historyReceiptId: k
          })
        });
        D = Uo(!0, Y), m.current = { operationKey: le, duplicateIdentity: D };
      }
      const ne = await u(), re = Ue(ne == null ? void 0 : ne.segments, D);
      if (re) {
        t || await ue(
          "segment.duplicate",
          "Duplicated segment",
          mt([], !1),
          mt([re], !1),
          k
        );
        const Y = ys(
          re,
          ne.performerSlots || [],
          i,
          s,
          ne.segmentGroups || []
        );
        $(Y.filters), P(Y.hideDerivedSegments), ie([re.id]), Q(re.id), q.current = re.id, A.current = [], G(bt(
          zt(ne.segments || [], ne.segmentGroups || [], ne.performerSlots || []),
          re.id
        )), t && I.nativeSegmentId == null && Le(le), m.current = null, w(Z ? "Duplicate created at the playhead." : "Duplicate created in place.");
      } else
        w("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
    } catch (h) {
      ((v = m.current) == null ? void 0 : v.operationKey) === le ? w("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : h.status === 409 ? await c() : w(h.message || "Unable to duplicate the draft.");
    } finally {
      C(null);
    }
  }
  async function K() {
    if (O.length !== 1 || !I) return;
    const Z = Number(ce), M = a.trim() === "" ? null : Number(a), le = Po(Z, M, d);
    if (le.error) {
      w(le.error);
      return;
    }
    if (Z === I.startSec && M === I.endSec) {
      w("Timing is unchanged.");
      return;
    }
    await ae(I, { startSec: Z, endSec: M, tagId: I.tagId }, !0, null, !0);
  }
  async function se(Z, M) {
    if (O.length !== 1 || !I) return;
    const le = Po(Z, M, d);
    if (le.error) {
      w(le.error);
      return;
    }
    if (Z === I.startSec && M === I.endSec) {
      w("Timing is unchanged.");
      return;
    }
    await ae(I, { startSec: Z, endSec: M, tagId: I.tagId }, !0, null, !0);
  }
  return { acceptHistory: X, recordHistoryAction: ue, mutateSegment: ae, completeReview: xe, createSegment: Se, splitSegment: R, duplicateSegment: W, saveTiming: K, applyShortcutTiming: se };
}
function ed() {
  const [e, t] = L(() => typeof window < "u" && window.matchMedia(Eo).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Eo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function td() {
  const [e, t] = L(() => typeof window < "u" && window.matchMedia(Do).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Do), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function nd() {
  try {
    return cs(window.localStorage.getItem(Na));
  } catch {
    return { ...st };
  }
}
function rd() {
  try {
    return Lt(JSON.parse(window.localStorage.getItem(Ia) || "[]"));
  } catch {
    return [];
  }
}
function od(e) {
  try {
    window.localStorage.setItem(Ia, JSON.stringify(Lt(e)));
  } catch {
  }
}
function ad(e) {
  try {
    window.localStorage.setItem(Na, JSON.stringify(e));
  } catch {
  }
}
function id() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Ca) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function sd(e) {
  try {
    return window.localStorage.setItem(Ca, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function ld({ status: e }) {
  const t = Za[e];
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
function Pt({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, nt.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...Ya(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${ht[t].symbol}${e[t]}`)));
}
function dd({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: g, shortcutRef: u }) {
  const f = to(a), [m, p] = L(() => Fr(o, f)), [y, b] = L(!1), [N, S] = L(""), I = ge(!1), H = o.map((P) => `${P.slotDefinitionId}:${P.performerId || ""}`).join("|"), O = f.map((P) => We(P)).join("|"), q = za(
    o,
    f
  );
  ye(() => {
    p(Fr(o, f)), S("");
  }, [t, r, H, O]);
  async function A(P = m) {
    if (!I.current) {
      I.current = !0, b(!0), S("Saving performer slots…");
      try {
        const _ = Fr(o.map((w) => ({
          ...w,
          performerId: P[w.slotDefinitionId] || null
        })), f), U = o.map((w) => {
          const C = _[w.slotDefinitionId] ? Number(_[w.slotDefinitionId]) : null, G = f.find((Q) => String(We(Q)) === String(C));
          return {
            ...w,
            performerId: C,
            performerName: (G == null ? void 0 : G.name) || null
          };
        });
        s(U);
        const J = await ee(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((w) => ({ slotDefinitionId: w.slotDefinitionId, performerId: _[w.slotDefinitionId] ? Number(_[w.slotDefinitionId]) : null }))
          })
        });
        S("Performer slots saved."), await l(J, {
          beforeState: cr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: cr([{
            segmentId: t,
            itemId: r,
            revision: J.revision,
            slots: J.slots || []
          }])
        });
      } catch (_) {
        d && await d(o, _), _.status === 409 ? (S("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : S(_.message || "Unable to save performer slots.");
      } finally {
        I.current = !1, b(!1);
      }
    }
  }
  function $(P, _) {
    S(`Option ${_ + 1} applied; save to confirm.`), p({ ...m, ...P.assignments });
  }
  async function T(P) {
    const _ = { ...m, ...P.assignments };
    p(_), await A(_);
  }
  return ye(() => {
    if (u)
      return u.current = (P) => I.current || !q[P] ? !1 : (T(q[P]), !0), () => {
        u.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    q.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, q.map((P, _) => n("button", {
        key: _,
        type: "button",
        disabled: y,
        onClick: () => $(P, _),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${_ + 1}: ${P.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, _ + 1),
        n("span", { key: "description" }, P.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${q.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((P) => n("label", { key: P.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, rt(P)),
      (P.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(P.genderHints || []).map(pr).join(" · ")}`) : null,
      n("select", { key: "select", value: m[P.slotDefinitionId] || "", disabled: y, onChange: (_) => p({ ...m, [P.slotDefinitionId]: _.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ..._a(f, f, P.genderHints).map((_) => n("option", { key: We(_), value: We(_) }, _.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: g, type: "button", disabled: y, onClick: () => A(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, N)])
  ]);
}
function cd({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a }) {
  var q;
  const s = ((q = t[0]) == null ? void 0 : q.slots) || [], l = to(r), d = za(
    s,
    l
  ), c = "__mixed__", g = () => Object.fromEntries(s.map((A, $) => {
    const T = t.map((P) => {
      var _;
      return String(((_ = P.slots[$]) == null ? void 0 : _.performerId) || "");
    });
    return [A.slotDefinitionId, T.every((P) => P === T[0]) ? T[0] : c];
  })), [u, f] = L(g), [m, p] = L(!1), [y, b] = L(""), N = ge(!1), S = t.map((A) => `${A.itemId ?? `native:${A.segmentId}`}:${A.revision}:${A.slots.map(($) => `${$.slotDefinitionId}:${$.performerId || ""}`).join(",")}`).join("|");
  ye(() => {
    f(g());
  }, [S]);
  async function I(A = u) {
    if (N.current) return;
    N.current = !0, p(!0), b(`Saving performer slots for ${t.length} segments…`);
    const $ = [];
    try {
      for (const T of t) {
        const P = T.slots.map((U, J) => {
          const w = A[s[J].slotDefinitionId];
          return {
            slotDefinitionId: U.slotDefinitionId,
            performerId: w === c ? U.performerId || null : w ? Number(w) : null
          };
        }), _ = await ee(T.itemId != null ? `/videos/${e}/drafts/${T.itemId}/slots` : `/videos/${e}/segments/${T.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: T.revision, assignments: P })
        });
        $.push({
          segmentId: T.segmentId,
          itemId: T.itemId,
          revision: _.revision,
          slots: _.slots || []
        });
      }
      b("Performer slots saved."), o({
        beforeState: cr(t),
        afterState: cr($)
      });
    } catch (T) {
      const P = await i();
      T.status === 409 ? b(P ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : b(T.message || (P ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      N.current = !1, p(!1);
    }
  }
  function H(A, $) {
    b(`Option ${$ + 1} applied; save to confirm.`), f({ ...u, ...A.assignments });
  }
  async function O(A) {
    const $ = { ...u, ...A.assignments };
    f($), await I($);
  }
  return ye(() => {
    if (a)
      return a.current = (A) => N.current || !d[A] ? !1 : (O(d[A]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, d.map((A, $) => n("button", {
        key: $,
        type: "button",
        disabled: m,
        onClick: () => H(A, $),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${$ + 1} to all selected segments: ${A.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, $ + 1),
        n("span", { key: "description" }, A.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${d.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, s.map((A) => n("label", {
      key: A.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, rt(A)),
      n("select", {
        key: "select",
        value: u[A.slotDefinitionId] || "",
        disabled: m,
        onChange: ($) => f({ ...u, [A.slotDefinitionId]: $.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        u[A.slotDefinitionId] === c ? n("option", { key: "mixed", value: c }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ..._a(l, l, A.genderHints).map(($) => n("option", {
          key: We($),
          value: We($)
        }, $.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: m,
        onClick: () => I(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, y)
    ])
  ]);
}
function vt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function ud(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return vt(t);
  const o = [...new Set(r.map((i) => vt(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function yr() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function or({ name: e }) {
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
function md({ hidden: e }) {
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
    n(yr, { key: "derived" })
  ]);
}
function gd({ segment: e, provenance: t }) {
  var g;
  const [r, o] = L(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = ud(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
            vt(u.sourceKey, u.sourceDisplayName)
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
function pd({
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
  const [u, f] = L([]), m = e.flatMap((N) => N.lanes.map((S) => S.key)), p = m.join("|");
  ye(() => {
    const N = new Set(m);
    f((S) => S.filter((I) => N.has(I)));
  }, [p]);
  const y = ur(t), b = !!ni(
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
      a ? n(Pt, { key: "counts", counts: y }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      Al({ mergeable: b, reviewable: a, tagEditable: s, slotsEditable: l })
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
    ...e.map((N) => n("section", {
      key: N.key,
      "data-selected-segment-group": N.key,
      className: "space-y-1.5"
    }, [
      n("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        n("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, N.name),
        n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${N.selectedCount} selected`)
      ]),
      ...N.lanes.map((S) => {
        const I = u.includes(S.key), H = S.markers.some(({ segment: q }) => q.id === r), O = `selected-segment-lane-${S.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: S.key,
          "data-selected-segment-lane": S.key,
          className: `rounded-md border ${H ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": I,
            "aria-controls": O,
            "aria-current": H ? "true" : void 0,
            onClick: () => f((q) => I ? q.filter((A) => A !== S.key) : [...q, S.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, I ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Dn(S)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(S.selectedCount)),
            a ? n(Pt, { key: "states", counts: S.counts }) : null
          ]),
          I ? n("div", {
            key: "segments",
            id: O,
            className: "space-y-1 border-t border-border p-1.5"
          }, S.markers.map(({ segment: q }) => {
            const A = q.endSec == null ? Me(q.startSec) : `${Me(q.startSec)} – ${Me(q.endSec)}`;
            return n("button", {
              key: q.id,
              type: "button",
              onClick: () => i(q),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${q.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${q.tagName || "Segment"}, ${q.reviewState}, ${A}` : `${q.tagName || "Segment"}, ${A}`,
              "aria-current": q.id === r ? "true" : void 0
            }, [
              a ? n(Ht, {
                key: "state",
                state: q.reviewState,
                includeLabel: !1
              }) : null,
              q.isDerived ? n(yr, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, A),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                vt(q.sourceKey)
              )
            ]);
          })) : null
        ]);
      })
    ]))
  ]);
}
const Cn = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"]
}, oa = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], aa = [
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
function Fn(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function ii(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function ia(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function ar(e, t, r, o = null) {
  const i = ia(t), a = ia(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function fd(e, t, r = null) {
  var u, f, m;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (u = t.hasSegmentsCriterion) == null ? void 0 : u.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), ar(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), ar(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), ar(o, t.performersCriterion, "performer"), ar(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = sa(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = sa(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((f = t.reviewStateCriterion) == null ? void 0 : f.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const g = (m = t.shotBoundariesCriterion) == null ? void 0 : m.value;
  return r && typeof g == "boolean" ? o.set("hasShotBoundaries", String(g)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function sa(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function yd(e, t, r, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((g) => a.add(g));
  } else a.has(r) ? a.delete(r) : a.add(r);
  return a;
}
function si({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(Yo, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, nt.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = ht[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(Yo, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function li({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
function bd({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      onClick: (l) => Fn(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      n(li, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, Wi(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(si, { item: e, showReviewStates: r }))
    ])
  ]);
}
function hd({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n(li, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
    n(i ? "div" : "a", {
      key: "link",
      href: i ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: i ? void 0 : (l) => Fn(l, t, s),
      className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
      n("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
        n("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
        n(si, { key: "segments", item: e, showReviewStates: r })
      ]),
      n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function lo({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = Js(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => Fn(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && un(
        o,
        Tt.recyclingBinView
      ) ? n(di, { key: "bin", onNavigate: t }) : null,
      n(ci, { key: "settings", onNavigate: t })
    ])
  ]);
}
const Jr = "segment-studio:recycling-bin-changed";
function vd(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function Rn() {
  window.dispatchEvent(new CustomEvent(Jr));
}
function di({ onNavigate: e, compact: t = !1 }) {
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
    return l(), window.addEventListener(Jr, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(Jr, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = vd(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => Fn(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function ci({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => Fn(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function xd({ mode: e, onModeChange: t, disabled: r = !1 }) {
  function o(i) {
    const a = _r(i.target.value);
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
function Sd({ minimum: e, maximum: t, onChange: r }) {
  const o = ge(null), [i, a] = L("maximum"), s = (f, m) => {
    const p = vs(e, t, f, m);
    a(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (f, m) => {
    var y;
    const p = (y = o.current) == null ? void 0 : y.getBoundingClientRect();
    p && s(f, hs(m.clientX, p.left, p.width));
  }, d = (f, m) => {
    var p, y;
    m.preventDefault(), (y = (p = m.currentTarget).setPointerCapture) == null || y.call(p, m.pointerId), l(f, m);
  }, c = (f, m) => {
    var p, y;
    (y = (p = m.currentTarget).hasPointerCapture) != null && y.call(p, m.pointerId) && l(f, m);
  }, g = (f, m) => {
    const p = f === "minimum" ? e : t, y = f === "minimum" ? 0 : e, b = f === "minimum" ? t : 1, N = m.shiftKey ? 0.1 : 0.01;
    let S = null;
    ["ArrowLeft", "ArrowDown"].includes(m.key) && (S = p - N), ["ArrowRight", "ArrowUp"].includes(m.key) && (S = p + N), m.key === "PageDown" && (S = p - 0.1), m.key === "PageUp" && (S = p + 0.1), m.key === "Home" && (S = y), m.key === "End" && (S = b), S != null && (m.preventDefault(), s(f, Math.min(b, Math.max(y, S))));
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
function kd({ saving: e, error: t, onSelect: r, onClose: o }) {
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
    onKeyDownCapture: (s) => lt(s, { onCancel: a })
  }, n("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: wt,
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
    n(Mn, {
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
function wd({
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
  const u = gt(e), f = [...new Map((a || []).map((b) => [
    Number(b.tagId),
    b.tagName || `Tag ${b.tagId}`
  ])).entries()].sort((b, N) => b[1].localeCompare(N[1]) || b[0] - N[0]), m = (b) => d(gt({ ...u, ...b })), p = (b) => m({
    reviewStates: u.reviewStates.includes(b) ? u.reviewStates.filter((N) => N !== b) : [...u.reviewStates, b]
  }), y = (b) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${b ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && g();
    },
    onKeyDownCapture: (b) => lt(b, { onCancel: g })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: wt,
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
        n("div", { className: "flex flex-wrap gap-2" }, nt.map((b) => {
          const N = u.reviewStates.includes(b), S = ht[b];
          return n("button", {
            key: b,
            type: "button",
            onClick: () => p(b),
            "aria-pressed": N,
            className: y(N)
          }, `${S.symbol} ${b} (${i[b] || 0})`);
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
            className: y(u.performerId == null)
          }, "All performers"),
          ...r.map((b) => {
            const N = Number(We(b));
            return n("button", {
              key: N,
              type: "button",
              onClick: () => m({ performerId: N }),
              "aria-pressed": u.performerId === N,
              className: y(u.performerId === N)
            }, b.name);
          })
        ])
      ]) : null,
      n("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        n("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Tag"),
          n("select", {
            key: "select",
            value: u.tagId ?? "",
            onChange: (b) => m({
              tagId: b.target.value === "" ? null : Number(b.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...f.map(([b, N]) => n("option", { key: b, value: b }, N))
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
            onChange: (b) => m({
              segmentGroupId: b.target.value === "" ? null : b.target.value === "ungrouped" ? "ungrouped" : Number(b.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All Segment groups"),
            ...(s || []).map((b) => n("option", { key: b.id, value: b.id }, b.name)),
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
            className: y(u.sourceKey == null)
          }, "All provenance"),
          ...o.map((b) => n("button", {
            key: b,
            type: "button",
            onClick: () => m({ sourceKey: b }),
            "aria-pressed": u.sourceKey === b,
            title: b,
            className: y(u.sourceKey === b)
          }, vt(b)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(Sd, {
          minimum: u.confidenceMin,
          maximum: u.confidenceMax,
          onChange: ({ minimum: b, maximum: N }) => m({
            confidenceMin: b,
            confidenceMax: N
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
            onChange: (b) => m({
              includeUnscored: b.target.checked
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
          onChange: (b) => c(b.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]"
        }),
        n(md, { key: "icon", hidden: t }),
        n("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    n("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(gt({})), l && c(!1);
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
function Nd({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Ln.filter((l) => cn(l, e)), i = Bo(o, 1)[0], a = Bo(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((g) => n("div", { key: g.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, g.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[g.id] ? t[g.id].length > 0 ? t[g.id] : ["Unassigned"] : g.bindings.map(Fa)).map((u, f) => n("kbd", { key: `${g.id}:${f}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, u))
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
    onKeyDownCapture: (l) => lt(l, { onCancel: r })
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
function Id({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = Vl(e), [l, d] = L([]), c = s.map((g) => g.tagName).join("|");
  return ye(() => {
    const g = new Set(s.map((u) => u.tagName));
    d((u) => u.filter((f) => g.has(f)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (g) => lt(g, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: wt,
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
            onClick: () => d((p) => f ? p.filter((y) => y !== g.tagName) : [...p, g.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: gr(!1) }
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
            const y = `${Me(p.startSec)}${p.endSec == null ? "" : ` – ${Me(p.endSec)}`}`, b = r === p.id;
            return n("div", {
              key: p.id,
              className: "flex items-center justify-between gap-3 px-3 py-2 text-sm"
            }, [
              n(
                "span",
                { key: "time", className: "font-mono text-xs text-secondary" },
                y
              ),
              n("button", {
                key: "remove",
                type: "button",
                disabled: t || r != null,
                onClick: () => i(p),
                "aria-label": `${b ? "Restoring" : "Restore to review"} ${g.tagName} example at ${y}`,
                className: "rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
              }, b ? "Restoring…" : "Restore to review")
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
function $d({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = L(""), [a, s] = L(0), l = ge(null), d = Be(() => sl(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = dl(d);
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
        wt(f);
      else if (f.key === "Escape")
        f.preventDefault(), f.stopPropagation(), r();
      else if (f.key === "ArrowDown" || f.key === "ArrowUp") {
        f.preventDefault(), f.stopPropagation();
        const p = f.key === "ArrowDown" ? 1 : -1;
        s((y) => d.length ? (y + p + d.length) % d.length : 0);
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
      var O;
      const p = f.segment || f, y = p.endSec == null ? Me(p.startSec) : `${Me(p.startSec)} – ${Me(p.endSec)}`, b = `${vt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, N = m === c, S = m > 0 ? d[m - 1].groupKey : null, I = g && f.groupKey !== S ? n("div", {
        key: `group:${f.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, f.groupName) : null, H = n("button", {
        key: p.id,
        id: `segment-quick-search-${p.id}`,
        ref: N ? l : null,
        type: "button",
        role: "option",
        "aria-selected": N,
        onMouseEnter: () => s(m),
        onClick: () => t(p),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${N ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        g ? n("span", { key: "group", className: "sr-only" }, `${f.groupName} group`) : null,
        n(Ht, { key: "review", state: p.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        (O = f.performers) != null && O.length ? n(fr, {
          key: "performers",
          performers: f.performers,
          performerAssignments: f.performerAssignments
        }) : null,
        n(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          y
        ),
        n("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: b
        }, b)
      ]);
      return I ? [I, H] : [H];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function Cd(e) {
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
function Td({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = Be(() => Cd(e), [e]), [l, d] = L([]), c = s.reduce((m, p) => m + p.drafts.length, 0), g = ge(null);
  oo({ confirmRef: g, cancelRef: o, confirmReady: !t && c > 0 });
  const u = (m) => d((p) => p.includes(m) ? p.filter((y) => y !== m) : [...p, m]), f = (m) => `segment-studio-publish-approved-${m.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && a();
    },
    onKeyDownCapture: (m) => lt(m, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: wt,
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
            style: { background: gr(!1) }
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
          }, m.drafts.map((y) => {
            const b = y.endSec == null ? Me(y.startSec) : `${Me(y.startSec)} – ${Me(y.endSec)}`, N = `${vt(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`;
            return n("div", { key: y.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(Ht, { key: "review", state: y.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, b),
              n("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: N
              }, N)
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
function Ad({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = il(e), [s, l] = L(() => /* @__PURE__ */ new Set()), [d, c] = L(() => new Set(a.map((y) => y.key))), g = a.flatMap((y) => d.has(y.key) ? y.candidates : []), u = (y) => l((b) => {
    const N = new Set(b);
    return N.has(y) ? N.delete(y) : N.add(y), N;
  }), f = (y) => c((b) => {
    const N = new Set(b);
    return N.has(y) ? N.delete(y) : N.add(y), N;
  }), m = (y) => y.assignment.map(({ slot: b, performer: N }) => `${b.label || `Slot ${b.sortOrder + 1}`}: ${N.name}`).join(", "), p = (y) => `segment-studio-auto-assign-${y.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (y) => {
      y.target === y.currentTarget && !t && i();
    },
    onKeyDownCapture: (y) => {
      y.key === "Enter" && y.target instanceof HTMLInputElement || lt(y, {
        onCancel: t ? void 0 : i,
        onConfirm: g.length && !t ? () => o(g) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: wt,
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
      e.length ? n("div", { className: "space-y-3" }, a.map((y) => n("section", { key: y.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
        n("header", {
          key: "header",
          className: "flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2",
          style: { background: gr(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(y.key),
            disabled: t,
            onChange: () => f(y.key),
            "aria-label": `Include ${y.tagName} assignment: ${m(y)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(y.key),
            "aria-controls": p(y),
            "aria-label": `${s.has(y.key) ? "Collapse" : "Expand"} ${y.tagName} assignment: ${m(y)}`,
            onClick: () => u(y.key),
            className: "shrink-0 rounded px-1 text-sm text-secondary hover:bg-muted/50 hover:text-foreground disabled:opacity-50"
          }, s.has(y.key) ? "▾" : "▸"),
          n(
            "span",
            { key: "tag", className: "min-w-24 flex-1 truncate text-sm font-semibold text-foreground" },
            y.tagName
          ),
          n(
            "span",
            { key: "performers", className: "flex min-w-0 flex-wrap items-center gap-2" },
            y.assignment.map(({ slot: b, performer: N }) => {
              const S = b.label || `Slot ${b.sortOrder + 1}`;
              return n("span", {
                key: b.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${S}: ${N.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${S}: ${N.name}`
                }, `${S}: ${N.name}`),
                n(On, {
                  key: "avatar",
                  performer: { id: N.performerId, name: N.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(Pt, { key: "states", counts: y.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(y.candidates),
            "aria-label": `Auto-Assign ${y.tagName}: ${m(y)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${y.candidates.length})`)
        ]),
        s.has(y.key) ? n(
          "div",
          { key: "segments", id: p(y), className: "divide-y divide-border/70" },
          y.candidates.map((b) => {
            const N = b.endSec == null ? Me(b.startSec) : `${Me(b.startSec)} – ${Me(b.endSec)}`, S = `${vt(b.sourceKey)}${b.confidence == null ? "" : ` · ${Math.round(b.confidence * 100)}%`}`;
            return n("div", {
              key: b.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(Ht, { key: "review", state: b.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                b.tagName || "Tag segment"
              ),
              n(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                N
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
function Rd({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => lt(d, { onCancel: r, onConfirm: t })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: wt,
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
function Md({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = L(!1), d = ge(null);
  if (oo({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Me(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && a();
    },
    onKeyDownCapture: (g) => lt(g, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: wt,
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
function Ed(e) {
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
function Dd({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var u, f;
  const l = e ? e.createCount + e.linkCount : 0, d = ge(null);
  oo({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((u = e == null ? void 0 : e.outputs) == null ? void 0 : u.slice(0, 200)) || [], g = Ed(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !r && s();
    },
    onKeyDownCapture: (m) => lt(m, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: wt,
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
              m.outputs.map((p, y) => n("div", {
                key: `${p.ruleId}:${p.depth}:${y}`,
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
function Od({
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
  performerSlots: u,
  detail: f,
  video: m,
  slotButtonRef: p,
  tagSearchRef: y,
  onDetailChange: b,
  setSaveMessage: N,
  setSavingSegmentId: S,
  onSlotsChanged: I,
  onRecordHistory: H,
  onCancelQueuedReview: O,
  splitSegment: q,
  duplicateSegment: A,
  provenance: $,
  lineage: T,
  onNavigateLineageItem: P,
  tagEditing: _,
  onCancelTagEditing: U,
  detailPanelRef: J,
  onReduceSelection: w
}) {
  var ue, ae, xe, Se;
  const C = ge(null), G = ge(null), Q = ge(null), ie = ge(null), ce = ge(null), [pe, j] = L(!1);
  ye(() => {
    C.current && (C.current.scrollTop = 0), j(!1);
  }, [t == null ? void 0 : t.id]), ye(() => {
    var R, W;
    pe && ((W = (R = G.current) == null ? void 0 : R.querySelector("input, select, button")) == null || W.focus({ preventScroll: !0 }));
  }, [pe]);
  function X() {
    j(!1), requestAnimationFrame(() => {
      var R;
      return (R = p.current) == null ? void 0 : R.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const R = !r.some((se) => se.isDerived), W = e && c ? Tl(u, r) : null, K = (W == null ? void 0 : W.map((se, Z) => {
      var le;
      const M = r[Z];
      return {
        segmentId: M.nativeSegmentId,
        itemId: M.published ? null : M.itemId,
        revision: (le = f.performerSlotRevisions) == null ? void 0 : le[M.id],
        slots: se
      };
    })) || [];
    return n(Yr.Fragment, null, [
      n(pd, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: J,
        onReduceSelection: w,
        reviewable: e,
        tagEditable: R,
        slotsEditable: K.length > 0 && a == null,
        onEditSlots: () => j(!0),
        slotButtonRef: p,
        saveMessage: i
      }),
      _ && R ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (se) => {
          se.target === se.currentTarget && U();
        },
        onKeyDownCapture: (se) => lt(se, { onCancel: U })
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
        n(Mn, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (se, Z) => se == null ? U() : s(se, Z == null ? void 0 : Z.label),
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
      pe && K.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (se) => {
          se.target === se.currentTarget && X();
        },
        onKeyDownCapture: (se) => {
          var M, le;
          if (!(typeof ((M = se.target) == null ? void 0 : M.closest) == "function" ? se.target.closest("input, textarea, select, [contenteditable='true']") : null) && !se.repeat && !se.ctrlKey && !se.altKey && !se.metaKey && !se.shiftKey && /^[1-9]$/.test(se.key) && ((le = ce.current) != null && le.call(ce, Number(se.key) - 1))) {
            se.preventDefault(), se.stopPropagation();
            return;
          }
          lt(se, { onCancel: X });
        }
      }, n("section", {
        ref: G,
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
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(cd, {
          videoId: m.id,
          targets: K,
          performerCandidates: f.performerCandidates || [],
          shortcutRef: ce,
          onSaved: async ({ beforeState: se, afterState: Z }) => {
            await H(
              "performer-slots.assign",
              `Assigned performers to ${K.length} segments`,
              se,
              Z
            ), X(), I();
          },
          onConflict: I
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (R) => {
      C.current = R, J && (J.current = R);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(Ht, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(yr, { key: "derived" }) : null,
        t && _ ? n("div", {
          key: "tag-editor",
          ref: y,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (R) => {
            R.key === "Escape" && (R.preventDefault(), R.stopPropagation(), U());
          },
          onKeyDown: (R) => {
            Nl(R, t.tagName) && (R.preventDefault(), R.stopPropagation(), s(t.tagId));
          }
        }, n(Mn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (R, W) => R == null ? U() : s(R, W == null ? void 0 : W.label),
          disabled: a != null || ((ue = T.data) == null ? void 0 : ue.tagReadOnly) === !0,
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
      e && t && (d === "empty" || d === "partial") ? n("div", { key: "slots-row" }, n(ld, { status: d })) : null,
      t && c && g.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(ri, {
        assignments: g.map((R) => {
          const W = El(R);
          return {
            key: String(R.slotDefinitionId),
            label: W.label,
            performer: W.filled ? { id: Number(R.performerId), name: W.performer } : null,
            title: W.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(gd, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: $
    }) : null,
    t ? n("div", { key: "controls", hidden: !0 }, [
      n("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        n("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        T.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : T.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, T.error) : T.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${T.data.derived ? "Derived segment" : "Root segment"} · ${T.data.componentSize} segment${T.data.componentSize === 1 ? "" : "s"} · ${T.data.integrityState}`
          ),
          (ae = T.data.parents) != null && ae.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...T.data.parents.map((R) => n("button", {
              key: R.nodeId,
              type: "button",
              onClick: () => P(R.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${R.ruleKey} ${R.ruleVersion}`))
          ]) : null,
          (xe = T.data.children) != null && xe.length ? n("p", { key: "children" }, `Children: ${T.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: l, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: p,
          type: "button",
          disabled: a != null || !c || g.length === 0,
          onClick: () => j(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: c ? g.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, g.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: q,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        n("button", {
          key: "duplicate",
          type: "button",
          disabled: a != null,
          onClick: () => A(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        n("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: a != null,
          onClick: () => A(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    pe && e && t && c && g.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (R) => {
        R.target === R.currentTarget && X();
      },
      onKeyDownCapture: (R) => {
        var K, se;
        if (!(typeof ((K = R.target) == null ? void 0 : K.closest) == "function" ? R.target.closest("input, textarea, select, [contenteditable='true']") : null) && !R.repeat && !R.ctrlKey && !R.altKey && !R.metaKey && !R.shiftKey && /^[1-9]$/.test(R.key) && ((se = ie.current) != null && se.call(ie, Number(R.key) - 1))) {
          R.preventDefault(), R.stopPropagation();
          return;
        }
        lt(R, {
          onCancel: X,
          onConfirm: () => {
            var Z;
            return (Z = Q.current) == null ? void 0 : Z.click();
          }
        });
      }
    }, n("section", {
      ref: G,
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
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(dd, {
        key: `${t.id}:${f.performerSlotsRevision || f.slotRevision || ""}`,
        videoId: m.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: g,
        revision: (Se = f.performerSlotRevisions) == null ? void 0 : Se[t.id],
        performerCandidates: f.performerCandidates || [],
        confirmRef: Q,
        shortcutRef: ie,
        onOptimisticSave: (R) => {
          b((W) => jr(
            W,
            t.id,
            R
          ), m.id), S(t.id), N("Saving performer slots…"), X();
        },
        onSaved: async (R, { beforeState: W, afterState: K }) => {
          b((se) => jr(
            se,
            t.id,
            R.slots || [],
            R.revision
          ), m.id), N("Performer slots saved.");
          try {
            await H(
              "performer-slots.assign",
              "Assigned performers",
              W,
              K
            ), await I(R) || O([t]);
          } finally {
            S(null);
          }
        },
        onRollback: async (R, W) => {
          O([t]), b((K) => {
            var se;
            return jr(
              K,
              t.id,
              R,
              (se = f.performerSlotRevisions) == null ? void 0 : se[t.id]
            );
          }, m.id), N(W.message || "Unable to save performer slots.");
          try {
            W.status === 409 && await I();
          } finally {
            S(null);
          }
        },
        onConflict: I
      }))
    ])) : null
  ]);
}
function Pd({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: u, onSelectGroup: f, onToggleGroup: m, onSelect: p, onSelectSegments: y, onSelectAll: b, onConfigureTag: N, onSeekTime: S, centerRef: I, showReviewState: H = !0, swimlaneTitleWidth: O, onSwimlaneTitleWidthChange: q }) {
  const A = ge(null), $ = ge(null), [T, P] = L(0), [_, U] = L({ scrollTop: 0, height: 320 }), [J, w] = L(null), C = Be(
    () => zt(e, r, o),
    [e, r, o]
  ), G = Be(
    () => ei(o),
    [o]
  ), Q = Be(() => so(C), [C]), ie = Be(
    () => Fl(Q, i, r.length > 0),
    [Q, i, r.length]
  ), ce = Be(
    () => ti(ie.rows, Math.max(0, _.scrollTop - 24), _.height),
    [ie, _]
  ), pe = Math.max(0, Number(d) || 0), j = ds(T), X = ir(O, j), ue = X / 16, ae = ss(c, pe, ue), xe = ns(pe), Se = rs(pe, Math.max(1, T - ue * 16), g), R = xe.filter((v, h) => h === 0 || h % Se === 0), W = Be(() => C.map((v) => `${v.key}:${v.trackCount}:${v.markers.map(({ segment: h, track: D }) => `${h.id}:${h.startSec}:${h.endSec ?? ""}:${D}`).join(",")}`).join("|"), [C]);
  function K() {
    const v = $.current;
    if (!v) return;
    const h = v.querySelector("[data-timeline-track]"), D = v.firstElementChild, ne = h == null ? void 0 : h.getBoundingClientRect(), re = D == null ? void 0 : D.getBoundingClientRect(), Y = ne && re ? Math.max(0, ne.left - re.left) : ue * 16, ke = (re == null ? void 0 : re.width) ?? v.scrollWidth;
    v.scrollTo({
      left: is(c, pe, ke, v.clientWidth, Y, Ra),
      behavior: "smooth"
    });
  }
  ye(() => (I.current = K, () => {
    I.current === K && (I.current = null);
  })), ye(() => {
    K();
  }, [g]);
  function se() {
    const v = $.current, h = ie.rows.find((ke) => ke.kind === "lane" && ke.lane.markers.some(({ segment: V }) => V.id === s));
    if (!v || !h) return;
    const D = 24, ne = h.top + D, re = ne + h.height;
    let Y = v.scrollTop;
    ne < v.scrollTop + D ? Y = Math.max(0, ne - D) : re > v.scrollTop + v.clientHeight && (Y = Math.max(0, re - v.clientHeight)), Y !== v.scrollTop && (v.scrollTop = Y), U({ scrollTop: Y, height: v.clientHeight });
  }
  ye(() => {
    se();
  }, [s, W, ie]), ye(() => {
    const v = $.current, h = ie.rows.find((ke) => ke.kind === "group" && ke.group.key === a);
    if (!v || !h) return;
    const D = 24, ne = h.top + D, re = ne + h.height;
    let Y = v.scrollTop;
    ne < v.scrollTop + D ? Y = Math.max(0, ne - D) : re > v.scrollTop + v.clientHeight && (Y = Math.max(0, re - v.clientHeight)), Y !== v.scrollTop && (v.scrollTop = Y), U({ scrollTop: Y, height: v.clientHeight });
  }, [a, ie]), ye(() => {
    const v = $.current;
    if (!v || typeof ResizeObserver > "u") return;
    const h = () => {
      P(v.clientWidth), U({ scrollTop: v.scrollTop, height: v.clientHeight }), se();
    }, D = new ResizeObserver(h);
    return D.observe(v), h(), () => D.disconnect();
  }, [s, W, ie]);
  function Z(v) {
    if (!(pe > 0)) return;
    const h = v.currentTarget.getBoundingClientRect(), D = Math.min(1, Math.max(0, (v.clientX - h.left) / h.width));
    S(D * pe);
  }
  function M(v) {
    const h = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let D = null;
    Object.hasOwn(h, v.key) && (D = c + h[v.key]), v.key === "Home" && (D = 0), v.key === "End" && (D = pe), D != null && (v.preventDefault(), v.stopPropagation(), S(Math.min(pe, Math.max(0, D))));
  }
  function le(v) {
    var D;
    const h = (D = A.current) == null ? void 0 : D.getBoundingClientRect();
    h && q(ir(v.clientX - h.left, j));
  }
  function k(v) {
    const h = v.shiftKey ? 40 : 16;
    let D = null;
    v.key === "ArrowLeft" && (D = X - h), v.key === "ArrowRight" && (D = X + h), v.key === "Home" && (D = 160), v.key === "End" && (D = j), D != null && (v.preventDefault(), v.stopPropagation(), q(ir(D, j)));
  }
  const x = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: A,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (v) => {
          (v.metaKey || v.ctrlKey) && (v.preventDefault(), b == null || b());
        },
        onKeyDown: (v) => {
          v.key !== "Enter" && v.key !== " " || (v.preventDefault(), b == null || b());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: x, disabled: g <= 1, onClick: () => u(lr(g - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: x, disabled: g === 1, onClick: () => u(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(g * 100)}%`),
      n("button", { key: "in", type: "button", className: x, disabled: g >= 8, onClick: () => u(lr(g + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: x, onClick: K, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(j),
      "aria-valuenow": Math.round(X),
      "aria-valuetext": `${Math.round(X)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (v) => {
        v.currentTarget.setPointerCapture(v.pointerId), le(v);
      },
      onPointerMove: (v) => {
        v.currentTarget.hasPointerCapture(v.pointerId) && le(v);
      },
      onKeyDown: k,
      onDoubleClick: () => q(st.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${X - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: $,
      onScroll: (v) => U({
        scrollTop: v.currentTarget.scrollTop,
        height: v.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: ls(g) }, [
      n("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${ue}rem minmax(0,1fr)`, height: "1.5rem" } }, [
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
          "aria-valuetext": Me(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: Z,
          onKeyDown: M
        }, R.map((v, h) => n("span", {
          key: v,
          className: `absolute top-0 ${os(h, R.length, pe > 0 ? v / pe * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: as(h, R.length, pe > 0 ? v / pe * 100 : 0)
        }, Me(v))).concat(t.map((v) => {
          const h = pe > 0 ? v.startSec / pe * 100 : 0;
          return n("button", {
            key: `shot-boundary:${v.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Me(v.startSec)} – ${Me(v.endSec)}`,
            title: `Shot boundary · ${v.source || "manual"} · ${Me(v.startSec)} – ${Me(v.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${h}%`, width: "2px" },
            onClick: (D) => {
              D.stopPropagation(), S(v.startSec);
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
            ...Lo(ae),
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
        style: C.length > 0 ? { height: ie.height } : void 0
      }, [
        C.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...Lo(ae, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        C.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : ce.map((v) => {
          var te;
          const h = v.group, D = i.includes(h.key), ne = a === h.key, re = gr(ne);
          if (v.kind === "group") return n("div", {
            key: v.key,
            "data-segment-group": h.key,
            "data-segment-group-collapsed": D ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ue}rem minmax(0,1fr)`,
              backgroundColor: re,
              top: v.top,
              height: v.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (z) => {
                if (z.metaKey || z.ctrlKey) {
                  y(h.lanes.flatMap((E) => E.markers.map((oe) => oe.segment.id)));
                  return;
                }
                f(h.key), m(h.key);
              },
              "aria-expanded": !D,
              "aria-current": ne ? "true" : void 0,
              "data-selected-timeline-group": ne ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: h.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: re
              },
              title: `${D ? "Expand" : "Collapse"} ${h.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, D ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, h.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              D ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${h.lanes.length} swimlane${h.lanes.length === 1 ? "" : "s"} hidden`
                ),
                H ? n(Pt, { key: "states", counts: h.counts }) : null
              ] : null
            )
          ]);
          const Y = v.lane, ke = vl(v.laneIndex), V = Y.markers.some(({ segment: z }) => z.id === s);
          return n("div", {
            key: v.key,
            "data-grouped-swimlane": h.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ue}rem minmax(0,1fr)`,
              top: v.top,
              height: v.height,
              backgroundColor: ke
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": V ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: xl(V, ke),
              title: `${Dn(Y)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Dn(Y),
              onClick: (z) => {
                (z.metaKey || z.ctrlKey) && y(Y.markers.map((E) => E.segment.id));
              },
              onMouseEnter: () => w(Y.key),
              onMouseLeave: () => w((z) => z === Y.key ? null : z)
            }, [
              Y.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (z) => {
                  z.stopPropagation(), N({ tagId: Y.tagId, tagName: Y.label, trigger: z.currentTarget });
                },
                "aria-label": `Configure ${Y.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: J === Y.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, Y.label),
              (te = Y.performers) != null && te.length ? n(fr, {
                key: "performers",
                performers: Y.performers,
                performerAssignments: Y.performerAssignments
              }) : null,
              H ? n(Pt, { key: "counts", counts: Y.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, Y.markers.map(({ segment: z, track: E }) => {
              var $e;
              const oe = Gr(z.startSec, pe), ve = z.endSec == null ? z.startSec : Math.max(z.startSec, z.endSec), be = Math.max(0, Gr(ve, pe) - oe), he = l.includes(z.id), Ae = z.id === s, we = io(G.get(z.id)), fe = z.endSec == null ? Me(z.startSec) : `${Me(z.startSec)} – ${Me(z.endSec)}`, Ne = ($e = Za[we]) == null ? void 0 : $e.label;
              return n("button", {
                key: z.id,
                type: "button",
                onClick: (Ce) => {
                  Ce.stopPropagation(), p(z, {
                    additive: Ce.metaKey || Ce.ctrlKey,
                    rangeSegmentIds: Ce.shiftKey ? Y.markers.map((Ee) => Ee.segment.id) : null
                  });
                },
                "aria-pressed": he,
                "aria-current": Ae ? "true" : void 0,
                "data-selected-timeline-marker": Ae ? "true" : void 0,
                "data-selected-segment-shortcut-target": Ae ? "true" : void 0,
                "aria-label": H ? `${z.tagName || "Tag segment"}${Y.performerLabel ? `, ${Y.performerLabel}` : ""}, ${z.reviewState}${Ne ? `, ${Ne}` : ""}, ${fe}` : `${z.tagName || "Tag segment"}${Y.performerLabel ? `, ${Y.performerLabel}` : ""}, ${fe}`,
                title: H ? `${z.tagName || "Tag segment"}${Y.performerLabel ? ` · ${Y.performerLabel}` : ""} · ${z.reviewState}${Ne ? ` · ${Ne}` : ""} · ${fe}` : `${z.tagName || "Tag segment"}${Y.performerLabel ? ` · ${Y.performerLabel}` : ""} · ${fe}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...H ? yl(z.reviewState, he, we, Ae) : bl(he, Ae),
                  left: `${oe}%`,
                  top: `${Sl(E)}rem`,
                  width: hl(z.endSec, be),
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
function co({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = L(null), [l, d] = L([]), [c, g] = L(null), [u, f] = L(""), [m, p] = L(!0), [y, b] = L(null), [N, S] = L(""), [I, H] = L(!1), O = ge(null), q = ge(0);
  ye(() => {
    const J = requestAnimationFrame(() => {
      var w;
      return (w = O.current) == null ? void 0 : w.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(J);
  }, [e]), ye(() => {
    const J = new AbortController();
    return p(!0), S(""), Promise.all([
      r ? ee(`/slot-definitions/${e}`, { signal: J.signal }) : Promise.resolve(null),
      ee("/segment-groups", { signal: J.signal })
    ]).then(([w, C]) => {
      const G = C.find((Q) => (Q.tags || []).some((ie) => Number(ie.tagId) === Number(e)));
      s(w), d(C), g((G == null ? void 0 : G.id) ?? null), f(G == null ? "" : String(G.id)), H(!1);
    }).catch((w) => {
      w.name !== "AbortError" && S(w.message || "Unable to load tag configuration.");
    }).finally(() => {
      J.signal.aborted || p(!1);
    }), () => J.abort();
  }, [r, e]);
  function A(J, w) {
    s({
      ...a,
      definitions: a.definitions.map((C, G) => G === J ? { ...C, ...w } : C)
    });
  }
  function $(J, w) {
    const C = J + w;
    if (C < 0 || C >= a.definitions.length) return;
    const G = [...a.definitions];
    [G[J], G[C]] = [G[C], G[J]], s({
      ...a,
      definitions: G.map((Q, ie) => ({ ...Q, sortOrder: ie }))
    });
  }
  function T(J) {
    const w = a.definitions[J], C = Number(w.assignmentCount) || 0, G = C === 0 ? "" : ` and its ${C} assignment${C === 1 ? "" : "s"}`;
    window.confirm(`Delete “${rt(w)}”${G}?`) && (C > 0 && H(!0), s({
      ...a,
      definitions: a.definitions.filter((Q, ie) => ie !== J).map((Q, ie) => ({ ...Q, sortOrder: ie }))
    }));
  }
  async function P() {
    var w;
    b("slots"), S("Saving performer slots…");
    let J;
    try {
      J = await ee(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: I,
          definitions: a.definitions.map((C, G) => {
            var Q;
            return {
              id: C.id || void 0,
              label: ((Q = C.label) == null ? void 0 : Q.trim()) || null,
              sortOrder: G,
              genderHints: C.genderHints || []
            };
          })
        })
      }), s(J), H(!1);
    } catch (C) {
      C.status === 409 ? (S("Performer slots changed elsewhere; current values were reloaded."), (w = C.payload) != null && w.current && (s(C.payload.current), H(!1))) : S(C.message || "Unable to save performer slots."), b(null);
      return;
    }
    try {
      await o(), S("Performer slots saved.");
    } catch {
      S("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      b(null);
    }
  }
  async function _() {
    const J = u === "" ? null : Number(u);
    if (J !== c) {
      b("group"), S("Saving tag group…");
      try {
        await ee(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: J })
        });
      } catch (w) {
        S(w.message || "Unable to assign the tag group."), b(null);
        return;
      }
      try {
        const [w, C] = await Promise.allSettled([
          ee("/segment-groups"),
          o()
        ]);
        if (w.status === "fulfilled") {
          d(w.value);
          const G = w.value.find((ie) => (ie.tags || []).some((ce) => Number(ce.tagId) === Number(e))), Q = (G == null ? void 0 : G.id) ?? null;
          g(Q), f(Q == null ? "" : String(Q));
        }
        S(
          w.status === "fulfilled" && C.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        b(null);
      }
    }
  }
  l.find((J) => Number(J.id) === Number(c));
  const U = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (J) => {
      J.target === J.currentTarget && !y && i();
    },
    onKeyDownCapture: (J) => lt(J, {
      onCancel: y ? void 0 : i
    })
  }, n("section", {
    ref: O,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: wt,
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
            disabled: y != null,
            onChange: (J) => f(J.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((J) => n("option", { key: J.id, value: String(J.id) }, J.name))
          ])
        ]),
        m ? null : n("button", {
          key: "save",
          type: "button",
          disabled: y != null || (u === "" ? null : Number(u)) === c,
          onClick: _,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, y === "group" ? "Saving…" : "Save tag group")
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
              disabled: y != null,
              onChange: (J) => s({ ...a, allowSamePerformerInMultipleSlots: J.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((J, w) => n("article", {
            key: J.id || J._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: J.label || "",
                disabled: y != null,
                onChange: (C) => A(w, { label: C.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Zi.map((C) => n("label", { key: C, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: y != null,
                  checked: (J.genderHints || []).includes(C),
                  onChange: (G) => A(w, {
                    genderHints: G.target.checked ? [.../* @__PURE__ */ new Set([...J.genderHints || [], C])] : (J.genderHints || []).filter((Q) => Q !== C)
                  })
                }),
                n("span", { key: "text" }, pr(C))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${J.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: y != null || w === 0, onClick: () => $(w, -1), className: U, "aria-label": `Move ${rt(J)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: y != null || w === a.definitions.length - 1, onClick: () => $(w, 1), className: U, "aria-label": `Move ${rt(J)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: y != null, onClick: () => T(w), className: `${U} text-red-300` }, "Delete")
            ])
          ])),
          n("div", { key: "buttons", className: "flex items-center gap-2" }, [
            n("button", {
              key: "add",
              type: "button",
              disabled: y != null,
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
              className: U
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: y != null,
              onClick: P,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, y === "slots" ? "Saving…" : "Save performer slots")
          ])
        ]) : null
      ]) : null,
      N ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, N) : null
    ]),
    n(
      "footer",
      { key: "footer", className: "flex items-center justify-end border-t border-border px-5 py-4" },
      n("button", {
        type: "button",
        disabled: y != null,
        onClick: i,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Close")
    )
  ]));
}
function Ld(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function Fd(e) {
  const { activeFilterCount: t, allSwimlanes: r, analysisError: o, analysisRun: i, analysisStatus: a, approvalFacetCounts: s, autoAssignCandidates: l, autoAssignError: d, autoAssignOpen: c, autoAssignPerformers: g, autoAssigning: u, cancelQueuedReviewsForSegments: f, canMoveSelectionToBin: m, captureTrainingExport: p, centerTimelineRef: y, closeEditorFilters: b, closeFirstSegmentTagDialog: N, closeMaterializeDialog: S, closeMergeConfirmation: I, closePublishApprovedDialog: H, closeTagEditing: O, collapsedSegmentGroups: q, commonActionsRef: A, compatibilityMode: $, configuringTag: T, createSegment: P, currentTime: _, deleteRejectedSegments: U, detail: J, detailPanelRef: w, detailWidth: C, duplicateSegment: G, editorFilters: Q, editorLayout: ie, editorRef: ce, exportingExamples: pe, filtersButtonRef: j, filtersOpen: X, firstSegmentTagOpen: ue, focusRowRef: ae, handleSeparatorKeyDown: xe, handleSeparatorPointerDown: Se, handleSeparatorPointerMove: R, hasNextUnreviewed: W, hasPreviousUnreviewed: K, hideDerivedSegments: se, history: Z, historyOpen: M, historySaving: le, horizontalLayoutSize: k, importNativeSegments: x, incorrectExamples: v, incorrectExamplesOpen: h, lineage: D, markerRailWidth: ne, materializeButtonRef: re, materializeCancelButtonRef: Y, materializeDerivedSegments: ke, materializeError: V, materializeLoading: te, materializeOpen: z, materializePreview: E, materializing: oe, mediaStackRef: ve, mergeCancelButtonRef: be, mergeConfirmation: he, mergeSavingRef: Ae, mergeSelectedSwimlane: we, nativeImportState: fe, onDetailChange: Ne, onNavigate: $e, onReload: Ce, onSlotsChanged: Ee, openPublishApprovedDialog: je, panelSeparatorProps: Qe, pendingInitialSeekRef: Fe, performerSlots: Ie, performerSlotsAvailable: _e, playbackControlsRef: He, previewDerivedSegments: Ve, provenance: Re, provenanceSources: Te, publishApprovedCancelButtonRef: Ge, publishApprovedDrafts: dt, publishApprovedError: Xe, publishApprovedOpen: Nt, quickSearchOpen: ot, railScrollRef: At, railToggleRef: qt, recordHistoryAction: br, rejectedDeletionPreview: mn, removeIncorrectExample: Ft, removingExampleId: jn, restoreHistoryTarget: Wt, runEditorAction: Vt, saveMessage: Jt, saveTag: jt, saveTiming: hr, savingSegmentId: xt, seekRef: It, segmentGroups: Bn, segmentRailLayout: gn, segments: St, selectAllVideoSegments: vr, selectSegment: Yt, selectSegmentCollection: pn, selectedGroups: Gn, selectedPerformerSlots: fn, selectedSegment: at, selectedSegmentGroupKey: Rt, selectedSegmentIds: yn, selectedSegments: Bt, selectedSlotStatus: Un, setAutoAssignError: xr, setAutoAssignOpen: Qt, setConfiguringTag: Zt, setCurrentTime: Kn, setEditorFilters: Xt, setEditorLayout: Sr, setFiltersOpen: zn, setHideDerivedSegments: bn, setHistoryOpen: Mt, setIncorrectExamplesOpen: en, setQuickSearchOpen: tn, setRailViewport: ct, setRejectedDeletionPreview: _n, setSaveMessage: hn, setSavingSegmentId: Hn, setSelectedSegmentGroupKey: vn, setSelectedSegmentId: xn, setShortcutsOpen: nn, setTimelineZoom: kr, shotBoundaries: wr, shortcutsOpen: Nr, slotButtonRef: Sn, splitLayout: pt, splitSegment: kn, startFullAnalysis: Ke, stepVideoFrame: Je, tagEditing: Ir, tagSearchRef: $r, timelineDuration: kt, timelineRatioBounds: ut, timelineZoom: Cr, toggleSegmentGroup: rn, toggleSegmentRail: wn, updateTimelineRatio: Nn, video: Ye, videoPerformers: qn, visibleCounts: Wn, visibleSegmentRailRows: Tr, visibleSegments: Vn, wideLayout: it, workspaceRef: Ar } = e, Jn = Be(
    () => St.filter((F) => !F.published && F.reviewState === "approved"),
    [St]
  ), Yn = Vi(Qr), In = Jn.length, $n = E ? E.createCount + E.linkCount : null, ze = xt != null, de = Bt.length > 0, ft = Bt.length === 1, Qn = de && Bt.every((F) => F.reviewState === "approved"), Zn = de && Bt.every((F) => F.reviewState === "rejected"), Rr = [
    { id: "marker.create", label: "New segment", disabled: ze },
    { id: "marker.editTag", label: "Edit tag", disabled: ze || !de },
    { id: "marker.setStart", label: "Set start", disabled: ze || !ft },
    { id: "marker.setEnd", label: "Set end", disabled: ze || !ft },
    { id: "marker.split", label: "Split", disabled: ze || !ft },
    ...$ ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !K, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Qn ? "Unapprove" : "Approve", disabled: ze || !de, tone: "approve" },
      { id: "marker.reject", label: Zn ? "Unreject" : "Reject", disabled: ze || !de, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !W, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...$ ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: ze || !m, tone: "reject" }
    ]
  ];
  function Xn(F) {
    const De = yn.includes(F.id), et = F.id === (at == null ? void 0 : at.id), Ze = F.endSec == null ? Me(F.startSec) : `${Me(F.startSec)} – ${Me(F.endSec)}`, Et = `${vt(F.sourceKey)}${F.confidence != null ? ` · ${Math.round(F.confidence * 100)}%` : ""}`;
    return n("button", {
      key: F.id,
      type: "button",
      onClick: ($t) => Yt(F, { additive: $t.metaKey || $t.ctrlKey }),
      "aria-pressed": De,
      "aria-current": et ? "true" : void 0,
      "data-selected-segment-shortcut-target": et ? "true" : void 0,
      "aria-label": $ ? `${F.tagName || "Tag segment"}, ${F.reviewState}${F.isDerived ? ", derived segment" : ""}, ${Ze}` : `${F.tagName || "Tag segment"}${F.isDerived ? ", derived segment" : ""}, ${Ze}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: Qa(De, et)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        $ ? n(Ht, { key: "review", state: F.reviewState, includeLabel: !1 }) : null,
        F.isDerived ? n(yr, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          F.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, Ze),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: Et
        }, Et)
      ])
    ]);
  }
  const on = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", Gt = [...Z.actions || []].reverse().find((F) => F.sequence <= Z.cursorSequence);
  return n("section", {
    ref: ce,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${pt ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (F) => ii(F, $e, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${Ye.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: Ye.title || `Video ${Ye.id}`
          }, Ye.title || `Video ${Ye.id}`)),
          ...qn.map((F) => n(On, {
            key: We(F),
            performer: { id: We(F), name: F.name },
            compact: !0,
            tooltip: F.name
          })),
          $ ? n(Pt, { key: "review-counts", counts: Wn }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          $ ? null : n(di, { key: "bin", onNavigate: $e, compact: !0 }),
          n(ci, { key: "settings", onNavigate: $e, compact: !0 })
        ])
      ]),
      $ && J.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${J.nativeImportCount} Cove segment${J.nativeImportCount === 1 ? "" : "s"} ${J.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        fe.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, fe.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => x("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => x("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        fe.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, fe.error) : null
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
              onClick: () => Ke(),
              title: (a == null ? void 0 : a.error) || "Run AI tagging and shot boundary analysis into the Full review workflow",
              className: "segment-studio-full-scan-run inline-flex items-center justify-center bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
            }, (a == null ? void 0 : a.configured) === !1 ? "Full Scan not configured" : (a == null ? void 0 : a.ready) === !1 ? "Full Scan unavailable" : (i == null ? void 0 : i.status) === "queued" ? "Full Scan queued…" : (i == null ? void 0 : i.status) === "running" ? "Full Scan running…" : "Full Scan"),
            n("details", { key: "choices", className: "relative flex" }, [
              n("summary", {
                key: "summary",
                "aria-label": "Choose Full Scan analyses",
                "aria-disabled": (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                title: "Choose analyses",
                onClick: (F) => {
                  ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && F.preventDefault();
                },
                onKeyDown: (F) => {
                  (F.key === "Enter" || F.key === " ") && ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && F.preventDefault();
                },
                className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${(a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running" ? "pointer-events-none cursor-default opacity-50" : "cursor-pointer hover:opacity-90"}`
              }, n(wa, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([F, De]) => n("button", {
                key: F,
                type: "button",
                disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                onClick: (et) => {
                  var Ze;
                  (Ze = et.currentTarget.closest("details")) == null || Ze.removeAttribute("open"), Ke(De);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, F)))
            ])
          ]) : null,
          $ ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: xt != null || l.length === 0,
            onClick: () => {
              xr(""), Qt(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${l.length ? ` (${l.length})` : ""}`) : null,
          $ ? n("button", {
            key: "materialize-derived",
            ref: re,
            type: "button",
            disabled: xt != null || te || oe || $n === 0,
            onClick: Ve,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, te ? "Analyzing…" : `Auto-Materialize${$n != null ? ` (${$n})` : ""}`) : null,
          $ ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: xt != null || In === 0,
            onClick: (F) => je(F.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": Nt,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${In ? ` (${In})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: pe || jn != null || v.length === 0,
            onClick: () => en(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": h,
            "aria-label": `Open AI feedback collection, ${v.length} example${v.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${v.length ? ` (${v.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: j,
            type: "button",
            onClick: () => zn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": X,
            className: `${on} ${t ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(or, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${t ? ` (${t})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => nn(!0),
            className: on
          }, [n(or, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: ($ ? Z.actions.length === 0 : Gt == null) || xt != null || le,
            onClick: $ ? () => Mt((F) => !F) : () => Wt(
              Gt.sequence - 1
            ),
            "aria-haspopup": $ ? "dialog" : void 0,
            "aria-expanded": $ ? M : void 0,
            className: on
          }, [
            n(or, { key: "icon", name: "history" }),
            n("span", { key: "label" }, $ ? `History${Z.actions.length ? ` (${Z.actions.length})` : ""}` : Gt ? `Undo ${Gt.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: qt,
            type: "button",
            onClick: wn,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": ie.markerRailOpen,
            className: on
          }, [
            n(or, { key: "icon", name: "list" }),
            n("span", { key: "label" }, ie.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    $ && M ? n("section", {
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
          onClick: () => Mt(!1),
          className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
        }, "Close")
      ]),
      n("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
        ...[...Z.actions].reverse().map((F) => n("button", {
          key: F.sequence,
          type: "button",
          disabled: le,
          onClick: () => Wt(F.sequence),
          "aria-current": Z.cursorSequence === F.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${F.sequence > Z.cursorSequence ? "text-secondary" : "text-foreground"} ${Z.cursorSequence === F.sequence ? "bg-accent/15" : ""}`
        }, [
          n("span", { key: "label", className: "min-w-0 flex-1 truncate" }, F.label),
          n("time", {
            key: "time",
            dateTime: F.createdAt,
            className: "shrink-0 text-[10px] text-secondary"
          }, new Date(F.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        ])),
        n("button", {
          key: "baseline",
          type: "button",
          disabled: le,
          onClick: () => Wt(Z.baselineSequence),
          "aria-current": Z.cursorSequence === Z.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${Z.cursorSequence === Z.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    X ? n(wd, {
      key: "editor-filters",
      filters: Q,
      hideDerivedSegments: se,
      performers: qn,
      provenanceSources: Te,
      reviewCounts: s,
      segments: St,
      segmentGroups: Bn,
      reviewMode: $,
      onChange: Xt,
      onHideDerivedChange: bn,
      onClose: b
    }) : null,
    ue ? n(kd, {
      key: "first-segment-tag-dialog",
      saving: xt != null,
      error: Jt,
      onSelect: (F, De) => P(F, De),
      onClose: N
    }) : null,
    ot ? n($d, {
      key: "quick-search-dialog",
      segments: ll(r),
      onSelect: (F) => {
        tn(!1), Yt(F, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        tn(!1), requestAnimationFrame(() => {
          var F;
          return (F = ce.current) == null ? void 0 : F.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    c ? n(Ad, {
      key: "auto-assign-dialog",
      candidates: l,
      processing: u,
      error: d,
      onConfirm: g,
      onClose: () => Qt(!1)
    }) : null,
    he ? n(Md, {
      key: "merge-selection-dialog",
      merge: he,
      processing: Ae.current,
      undoable: !$,
      cancelButtonRef: be,
      onConfirm: (F) => we(!0, F, he),
      onClose: I
    }) : null,
    z ? n(Dd, {
      key: "materialize-derived-dialog",
      preview: E,
      loading: te,
      processing: oe,
      error: V,
      cancelButtonRef: Y,
      onConfirm: ke,
      onClose: () => {
        oe || S();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: Ar,
      className: `${pt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      ie.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: it ? { position: "absolute", top: 0, right: 0, width: ne, height: k.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        St.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : Vn.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: At,
          onScroll: (F) => ct({
            scrollTop: F.currentTarget.scrollTop,
            height: F.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: gn.height }
        }, Tr.map((F) => {
          var et;
          let De;
          if (F.kind === "group") {
            const Ze = q.includes(F.group.key), Et = F.group.lanes.reduce(($t, Dt) => $t + Dt.markers.length, 0);
            De = n("button", {
              type: "button",
              onClick: () => {
                vn(F.group.key), rn(F.group.key);
              },
              "aria-expanded": !Ze,
              "aria-current": Rt === F.group.key ? "true" : void 0,
              "data-segment-rail-group": F.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${Rt === F.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, Ze ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: F.group.name }, F.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Et),
              $ && Ze ? n(Pt, { key: "states", counts: F.group.counts }) : null
            ]);
          } else F.kind === "lane" ? De = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Dn(F.lane),
            "aria-label": Dn(F.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, F.lane.label),
            (et = F.lane.performers) != null && et.length ? n(fr, {
              key: "performers",
              performers: F.lane.performers,
              performerAssignments: F.lane.performerAssignments
            }) : null,
            $ ? n(Pt, { key: "states", counts: F.lane.counts }) : null
          ]) : De = Xn(F.segment);
          return n("div", {
            key: F.key,
            className: "absolute left-0 right-0",
            style: { top: F.top, height: F.height }
          }, De);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${pt ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: ve,
          className: `${pt ? "min-h-0 flex-1" : ""} grid`,
          style: pt ? {
            gridTemplateRows: `minmax(16rem, ${(1 - ie.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${ie.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: ae,
            className: "grid min-h-0 gap-2",
            style: it ? {
              gridTemplateColumns: ie.markerRailOpen ? `${C}px 0.5rem minmax(0,1fr) 0.5rem ${ne}px` : `${C}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(Od, {
              key: "tools",
              compatibilityMode: $,
              selectedSegment: at,
              selectedSegments: Bt,
              selectedGroups: Gn,
              saveMessage: Jt,
              savingSegmentId: xt,
              setSavingSegmentId: Hn,
              setSaveMessage: hn,
              saveTag: jt,
              slotStatus: Un,
              performerSlotsAvailable: _e,
              selectedPerformerSlots: fn,
              performerSlots: Ie,
              detail: J,
              onDetailChange: Ne,
              onCancelQueuedReview: f,
              video: Ye,
              slotButtonRef: Sn,
              tagSearchRef: $r,
              tagEditing: Ir,
              onCancelTagEditing: O,
              detailPanelRef: w,
              onReduceSelection: (F) => {
                Yt(F), requestAnimationFrame(() => {
                  var De;
                  return (De = w.current) == null ? void 0 : De.focus({ preventScroll: !0 });
                });
              },
              saveTiming: hr,
              onSlotsChanged: Ee,
              onRecordHistory: br,
              splitSegment: kn,
              duplicateSegment: G,
              provenance: Re,
              lineage: D,
              onNavigateLineageItem: (F) => {
                const De = St.find((et) => et.itemId === F);
                De && xn(De.id);
              }
            }),
            it ? n(
              "div",
              { key: "detail-separator", ...Qe("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Ye.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(ha, {
                streamUrl: `/api/stream/video/${Ye.id}`,
                posterUrl: `/api/stream/video/${Ye.id}/screenshot?v=${encodeURIComponent(Ye.updatedAt || "")}`,
                format: Ye.videoFile.format,
                audioCodec: Ye.videoFile.audioCodec,
                duration: Ye.videoFile.duration,
                videoId: Ye.id,
                trackingEnabled: !1,
                onSeekRegister: (F) => {
                  It.current = F, ol(Fe.current, St, F) && (Fe.current = null);
                },
                onPlaybackControlRegister: (F) => {
                  He.current = F;
                },
                onTimeUpdate: Kn
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            it && ie.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...Qe("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            it && ie.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: A,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...Rr.map((F) => {
              var Ze;
              const De = (Ze = Yn[F.id]) == null ? void 0 : Ze[0], et = F.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : F.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: F.id,
                type: "button",
                disabled: F.disabled,
                "data-action-id": F.id,
                onClick: (Et) => {
                  const $t = Et.currentTarget;
                  Vt(F.id, { target: $t, preserveFocus: !0 }), F.focusWhenDisabled && requestAnimationFrame(() => {
                    Ld($t, A.current, F.focusWhenDisabled);
                  });
                },
                title: De ? `${F.label} (${De})` : F.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${et}`
              }, [
                n("span", { key: "label" }, F.label),
                De ? n("kbd", {
                  key: "shortcut",
                  className: "rounded border border-border/70 bg-background/70 px-1 py-0.5 font-mono text-[10px] leading-none text-secondary"
                }, De) : null
              ]);
            }),
            n("div", { key: "frame-actions", className: "ml-auto flex items-center gap-1" }, [
              n("button", {
                key: "previous-frame",
                type: "button",
                disabled: !Ye.videoFile,
                onClick: () => Je(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(Ji, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !Ye.videoFile,
                onClick: () => Je(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(Yi, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          pt ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(ut.minimum * 100),
            "aria-valuemax": Math.round(ut.maximum * 100),
            "aria-valuenow": Math.round(ie.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(ie.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: Se,
            onPointerMove: R,
            onKeyDown: xe,
            onDoubleClick: () => Nn(st.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: pt ? void 0 : { height: "20rem" } }, n(Pd, {
            segments: Vn,
            shotBoundaries: wr,
            segmentGroups: Bn,
            performerSlots: Ie,
            collapsedGroupKeys: q,
            selectedGroupKey: Rt,
            selectedSegmentId: at == null ? void 0 : at.id,
            selectedSegmentIds: yn,
            duration: kt,
            currentTime: _,
            zoom: Cr,
            onZoomChange: kr,
            onSelectGroup: vn,
            onToggleGroup: rn,
            onSelect: (F, De) => Yt(F, De),
            onSelectSegments: pn,
            onSelectAll: vr,
            onConfigureTag: (F) => Zt(F),
            onSeekTime: (F) => {
              var De;
              return (De = It.current) == null ? void 0 : De.call(It, F, !1);
            },
            centerRef: y,
            showReviewState: $,
            swimlaneTitleWidth: ie.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (F) => Sr((De) => ({ ...De, swimlaneTitleWidth: F }))
          }))
        ])
      ])
    ]),
    T ? n(co, {
      key: `configure-tag:${T.tagId}`,
      tagId: T.tagId,
      tagName: T.tagName,
      performerSlotsEnabled: $,
      onSaved: Ce,
      onClose: () => {
        const F = T.trigger;
        Zt(null), requestAnimationFrame(() => {
          var De;
          F != null && F.isConnected ? F.focus({ preventScroll: !0 }) : (De = ce.current) == null || De.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Nt ? n(Td, {
      key: "publish-approved-dialog",
      drafts: Jn,
      processing: xt === -1,
      error: Xe,
      cancelButtonRef: Ge,
      onConfirm: dt,
      onClose: H
    }) : null,
    mn ? n(Rd, {
      key: "rejected-deletion-dialog",
      preview: mn,
      onConfirm: () => {
        U(mn), requestAnimationFrame(() => {
          var F;
          return (F = ce.current) == null ? void 0 : F.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        _n(null), requestAnimationFrame(() => {
          var F;
          return (F = ce.current) == null ? void 0 : F.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Nr ? n(Nd, {
      key: "shortcuts-dialog",
      reviewMode: $,
      bindings: Yn,
      onClose: () => nn(!1)
    }) : null,
    h ? n(Id, {
      key: "incorrect-examples-dialog",
      examples: v,
      exporting: pe,
      removingExampleId: jn,
      onExport: p,
      onRemove: Ft,
      onClose: () => en(!1)
    }) : null
  ]);
}
function jd(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: u, setEditorFilters: f, setHideDerivedSegments: m, setSaveMessage: p, setSelectedSegmentGroupKey: y, setSelectedSegmentId: b, setSelectedSegmentIds: N } = e;
  function S(A) {
    const $ = bt(t, A);
    $ && u((T) => oi(T, $));
  }
  function I(A) {
    b(A), N(A == null ? [] : [A]), c.current = A, g.current = [];
  }
  function H(A, {
    focusEditor: $ = !1,
    seekToSegment: T = !1,
    additive: P = !1,
    rangeSegmentIds: _ = null
  } = {}) {
    var J, w;
    const U = ws({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, A.id, _, P);
    N(U.selectedSegmentIds), b(U.activeSegmentId), c.current = U.anchorSegmentId, g.current = U.rangeBaseSegmentIds, U.activeSegmentId != null && y(bt(t, U.activeSegmentId)), S(A.id), $ && ((J = r.current) == null || J.focus({ preventScroll: !0 })), T && ((w = i.current) == null || w.call(i, A.startSec, !1));
  }
  function O(A) {
    const $ = Ss(
      d,
      l,
      A
    );
    N($.selectedSegmentIds), b($.activeSegmentId), c.current = $.activeSegmentId, g.current = [], $.activeSegmentId != null && (y(bt(t, $.activeSegmentId)), S($.activeSegmentId));
  }
  function q() {
    var T;
    const A = Is(s), $ = A.includes(l) ? l : A[0] ?? null;
    f(gt({})), m(!1), N(A), b($), c.current = $, g.current = [], $ != null && y(bt(
      zt(s, a, o),
      $
    )), p(A.length === 0 ? "There are no segments to select." : `${A.length} segments selected. Collapsed Segment groups keep their selected segments.`), (T = r.current) == null || T.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: S, replaceSegmentSelection: I, selectSegment: H, selectSegmentCollection: O, selectAllVideoSegments: q };
}
function Bd(e) {
  const { acceptHistory: t, compatibilityMode: r, detail: o, detailPanelRef: i, historyRef: a, mergeSavingRef: s, onConflict: l, onDetailChange: d, onReload: c, pendingReviewStateRef: g, recordHistoryAction: u, revealSegmentGroupForSelection: f, reviewSavingRef: m, savingSegmentId: p, selectedGroups: y, selectedSegment: b, selectedSegmentIdRef: N, selectedSegments: S, selectionAnchorIdRef: I, selectionRangeBaseIdsRef: H, setMergeConfirmation: O, setSaveMessage: q, setSavingSegmentId: A, setSelectedSegmentId: $, setSelectedSegmentIds: T, video: P } = e;
  function _() {
    O(null), requestAnimationFrame(() => {
      var w;
      return (w = i.current) == null ? void 0 : w.focus({ preventScroll: !0 });
    });
  }
  async function U(w = !1, C = !1, G = null) {
    if (s.current || p != null) return;
    const Q = G || ni(
      y,
      { nativeOnly: !r }
    );
    if (!Q) {
      q("Select at least two segments from one swimlane.");
      return;
    }
    if (!w && Da()) {
      O(Q);
      return;
    }
    C && Oa(!1), _();
    const ie = Q.endSec == null ? "open end" : Me(Q.endSec);
    s.current = !0;
    let ce = Q.segments[0];
    const pe = r ? null : mt(Q.segments, !1), j = r ? null : crypto.randomUUID(), X = Q.segments.map((ae) => ae.id), ue = Zl(o, Q.segments);
    A(ce.id), d(ue, P.id), T([ce.id]), $(ce.id), I.current = ce.id, H.current = [];
    try {
      const ae = Q.segments.slice(1);
      if (!r || ce.nativeSegmentId != null) {
        const xe = ae.map((R) => {
          const W = `merge-native-selection:${P.id}:${ce.id}:${R.id}:${ce.updatedAt}:${R.updatedAt}`;
          return { key: W, operationId: Pe(W), segmentId: R.id, expectedUpdatedAt: R.updatedAt };
        }), Se = await ee(`/videos/${P.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: ce.id,
            expectedSurvivorUpdatedAt: ce.updatedAt,
            consumedSegments: xe.map(({ key: R, ...W }) => W),
            historyReceiptId: j
          })
        });
        ce = Se.survivor, d(Zo(o, Se), P.id), xe.forEach(({ key: R }) => Le(R));
      } else {
        const xe = ae.map((R) => {
          const W = `merge-draft-selection:${P.id}:${ce.itemId}:${R.itemId}:${ce.revision}:${R.revision}`;
          return { key: W, operationId: Pe(W), itemId: R.itemId, expectedRevision: R.revision };
        }), Se = await ee(`/videos/${P.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: ce.itemId,
            expectedSurvivorRevision: ce.revision,
            consumedDrafts: xe.map(({ key: R, ...W }) => W)
          })
        });
        ce = Se.survivor, d(Zo(o, Se), P.id), xe.forEach(({ key: R }) => Le(R));
      }
      T([ce.id]), $(ce.id), I.current = ce.id, H.current = [], r ? t(Ct) : await u(
        "segments.merge",
        `Merged ${Q.segments.length} segments`,
        pe,
        mt([ce], !1),
        j
      ), f(ce.id), q(`${Q.segments.length} segments merged into ${Me(Q.startSec)} – ${ie}.`);
    } catch (ae) {
      d((xe) => ai(
        Pn(xe, [Q.segments[0]], [
          "startSec",
          "endSec",
          "sourceKey",
          "sourceRunId",
          "confidence",
          "isDerived"
        ]),
        Q.segments.slice(1)
      ), P.id), T(X), $((b == null ? void 0 : b.id) ?? X[0] ?? null), I.current = (b == null ? void 0 : b.id) ?? X[0] ?? null, H.current = [], ae.status === 409 ? await l() : q(ae.message || "Unable to merge selected segments.");
    } finally {
      s.current = !1, A(null);
    }
  }
  async function J(w, C = S, G = b) {
    var ue;
    if (C.length === 0 || m.current) return;
    if (p != null) {
      g.current.push(Bs(
        w,
        C,
        G
      )), q(`${w === "approved" ? "Approval" : "Rejection"} queued…`);
      return;
    }
    const Q = js(C, w), ie = C.filter((ae) => ae.reviewState !== Q);
    if (ie.length === 0) return;
    const ce = C.map((ae) => ({
      id: ae.id,
      itemId: ae.itemId,
      nativeSegmentId: ae.nativeSegmentId
    })), pe = ce.find((ae) => ae.id === (G == null ? void 0 : G.id)) || ce[0], j = (ae, xe = !1) => {
      if (!(ae != null && ae.segments) || !xe && !zr(N.current, pe.id))
        return;
      const Se = ce.map((W) => Ue(ae == null ? void 0 : ae.segments, W)).filter(Boolean), R = Ue(ae == null ? void 0 : ae.segments, pe) || Se[0] || null;
      T(Se.map((W) => W.id)), $((R == null ? void 0 : R.id) ?? null), I.current = (R == null ? void 0 : R.id) ?? null, H.current = [];
    };
    m.current = !0, A((G == null ? void 0 : G.id) ?? ie[0].id), q(`Updating ${ie.length} selected segment${ie.length === 1 ? "" : "s"}…`);
    const X = mr(
      o,
      ie.map((ae) => ae.id),
      { reviewState: Q }
    );
    d(X, P.id);
    try {
      const ae = await ee(`/videos/${P.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: a.current.revision,
          reviewState: Q,
          segments: C.map((W) => W.published ? {
            nativeSegmentId: W.nativeSegmentId,
            expectedUpdatedAt: W.updatedAt
          } : {
            itemId: W.itemId,
            expectedRevision: W.revision
          })
        })
      }), xe = new Map((ae.items || []).map((W) => [
        W.requestedNativeSegmentId != null ? `native:${W.requestedNativeSegmentId}` : `item:${W.requestedItemId}`,
        W
      ]));
      if (ce.forEach((W) => {
        const K = xe.get(W.nativeSegmentId != null ? `native:${W.nativeSegmentId}` : `item:${W.itemId}`);
        K && (W.nativeSegmentId = K.nativeSegmentId, W.itemId = K.itemId);
      }), ae.history && t(ae.history), Q === "rejected" || (ae.items || []).some((W) => W.requestedNativeSegmentId != null && W.nativeSegmentId !== W.requestedNativeSegmentId)) {
        j(await c()), q(`${ae.updatedCount} selected segment${ae.updatedCount === 1 ? "" : "s"} ${Q === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const R = {
        ...o,
        approvedSetVersion: ae.approvedSetVersion || o.approvedSetVersion,
        segments: (o.segments || []).map((W) => {
          const K = xe.get(W.nativeSegmentId != null ? `native:${W.nativeSegmentId}` : `item:${W.itemId}`);
          return K ? {
            ...W,
            id: K.nativeSegmentId != null ? K.nativeSegmentId : -K.itemId,
            itemId: K.itemId,
            nativeSegmentId: K.nativeSegmentId,
            published: K.nativeSegmentId != null,
            reviewState: Q,
            revision: K.nativeSegmentId != null ? W.revision : K.revision,
            updatedAt: K.updatedAt
          } : W;
        })
      };
      d(R, P.id), j(R), q(`${ae.updatedCount} selected segment${ae.updatedCount === 1 ? "" : "s"} ${Q === "approved" ? "approved" : Q === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (ae) {
      d((Se) => Pn(
        Se,
        ie,
        ["reviewState"]
      ), P.id), ae.status === 409 && ((ue = ae.payload) != null && ue.currentHistory) && t(ae.payload.currentHistory);
      const xe = ae.status === 409 ? await l() : o;
      j(xe, !0), q(ae.message || "Unable to update the selected segments.");
    } finally {
      m.current = !1, A(null);
    }
  }
  return { closeMergeConfirmation: _, mergeSelectedSwimlane: U, saveSelectedReviewState: J };
}
function Gd(e) {
  const { acceptHistory: t, allSwimlanes: r, autoAssignCandidates: o, autoAssigning: i, binEmptyingRef: a, canMoveSelectionToBin: s, closeTagEditing: l, compatibilityMode: d, detail: c, editorRef: g, exportingExamples: u, incorrectExamples: f, lineage: m, materializeButtonRef: p, materializePreview: y, materializeRestoreFocusRef: b, materializing: N, mutateSegment: S, onConflict: I, onDetailChange: H, onReload: O, recordHistoryAction: q, refreshMaterializationPreview: A, removingExampleId: $, revealSegmentGroupForSelection: T, savingSegmentId: P, segments: _, selectedSegment: U, selectedSegmentIdRef: J, selectedSegments: w, selectionAnchorIdRef: C, selectionRangeBaseIdsRef: G, setAutoAssignError: Q, setAutoAssignOpen: ie, setAutoAssigning: ce, setExportingExamples: pe, setIncorrectExamples: j, setMaterializeError: X, setMaterializeLoading: ue, setMaterializeOpen: ae, setMaterializePreview: xe, setMaterializing: Se, setRejectedDeletionPreview: R, setRemovingExampleId: W, setSaveMessage: K, setSavingSegmentId: se, setSelectedSegmentGroupKey: Z, setSelectedSegmentId: M, setSelectedSegmentIds: le, video: k } = e;
  async function x() {
    var Ne, $e, Ce;
    if (w.length === 0 || !U || P != null) return;
    const E = ql(w, f), oe = E.segments;
    if (oe.length === 0) return;
    const ve = w.map((Ee) => ({
      id: Ee.id,
      itemId: Ee.itemId,
      nativeSegmentId: Ee.nativeSegmentId
    })), be = ve.find((Ee) => Ee.id === U.id) || ve[0], he = [], Ae = [];
    let we = !1, fe = c;
    se(be.id), K(E.action === "remove" ? `Removing ${oe.length} selected incorrect example${oe.length === 1 ? "" : "s"}…` : `Collecting ${oe.length} selected segment${oe.length === 1 ? "" : "s"} as incorrect AI feedback…`);
    try {
      const Ee = async (Re, Te) => {
        const Ge = Re.nativeSegmentId != null, dt = E.action === "remove" ? `incorrect-example-remove:${k.id}:${Te == null ? void 0 : Te.id}:${Te == null ? void 0 : Te.revision}:${Te == null ? void 0 : Te.representationRevision}` : `incorrect-example-collect:${k.id}:${Ge ? `native:${Re.nativeSegmentId}:${Re.updatedAt}` : `item:${Re.itemId}:${Re.revision}`}`;
        if (E.action === "remove" && !Te)
          throw new Error("The incorrect-example collection changed. Reload and try again.");
        let Xe;
        try {
          Xe = E.action === "remove" ? await ee(
            `/videos/${k.id}/incorrect-examples/${Te.id}/remove`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Pe(dt),
                expectedExampleRevision: Te.revision,
                expectedRepresentationRevision: Te.representationRevision
              })
            }
          ) : await ee(`/videos/${k.id}/incorrect-examples/collect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Pe(dt),
              nativeSegmentId: Ge ? Re.nativeSegmentId : null,
              itemId: Ge ? null : Re.itemId,
              expectedUpdatedAt: Ge ? Re.updatedAt : null,
              expectedRevision: Ge ? null : Re.revision
            })
          });
        } catch (Nt) {
          throw Nt.operationKey = dt, Nt;
        }
        if (!Wl(E.action, Xe))
          throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
        return Le(dt), Xe;
      };
      for (const Re of oe) {
        const Te = E.action === "remove" ? f.find((Ge) => Ge.itemId != null && Ge.itemId === Re.itemId) : null;
        try {
          const Ge = ve.find((ot) => ot.id === Re.id);
          let dt = Ue(
            fe == null ? void 0 : fe.segments,
            Ge
          ) || Re, Xe;
          try {
            Xe = await Ee(dt, Te);
          } catch (ot) {
            if (ot.status === 409 && (($e = (Ne = ot.payload) == null ? void 0 : Ne.result) == null ? void 0 : $e.code) === "OPERATION_REPLAYED")
              fe = await ee(
                `/videos/${k.id}/editor`
              ), Le(ot.operationKey), Xe = ot.payload.result;
            else {
              if (E.action !== "collect" || ot.status !== 409) throw ot;
              const At = await ee(
                `/videos/${k.id}/editor`
              );
              fe = At;
              const qt = Ue(
                At == null ? void 0 : At.segments,
                Ge
              );
              if (!qt) throw ot;
              dt = qt, Xe = await Ee(dt, null);
            }
          }
          Ge && Xe.itemId != null && (Ge.itemId = Xe.itemId), fe = Wr(
            fe,
            Xe.editorDelta
          );
          const Nt = { segment: Re, result: Xe, example: Te };
          he.push(Nt);
        } catch (Ge) {
          if (Ae.push(Ge), ![400, 404, 409].includes(Ge.status)) break;
        }
      }
      if (d && he.length > 0) {
        const Re = E.action === "remove", Te = he.length;
        await q(
          Re ? "feedback.remove" : "feedback.collect",
          Re ? `Removed ${Te} incorrect AI example${Te === 1 ? "" : "s"}` : `Collected ${Te} incorrect AI example${Te === 1 ? "" : "s"}`,
          rr(he, Re),
          rr(he, !Re)
        ) || (we = !0);
      }
      he.some(({ result: Re }) => Re.representation === "basicNativeBin") && Rn();
      const je = zr(
        J.current,
        be.id
      ), Qe = E.action === "collect" && he.some(({ segment: Re }) => Re.id === be.id), Fe = he.map(({ segment: Re }) => Re.id), Ie = Qe ? Cs(
        r,
        Fe,
        be.id
      ) : null, _e = Qe ? (Ie == null ? void 0 : Ie.id) ?? null : be.id;
      je && Qe && (le(Ie ? [Ie.id] : []), M((Ie == null ? void 0 : Ie.id) ?? dr), C.current = (Ie == null ? void 0 : Ie.id) ?? null, G.current = []);
      const He = await ee(`/videos/${k.id}/incorrect-examples`);
      j(He);
      const Ve = fe;
      if (H(Ve, k.id), je && zr(
        J.current,
        _e
      )) {
        let Re, Te;
        Qe ? (Te = Ie ? Ue(Ve == null ? void 0 : Ve.segments, {
          id: Ie.id,
          itemId: Ie.itemId,
          nativeSegmentId: Ie.nativeSegmentId
        }) : null, Re = Te ? [Te] : []) : (Re = ve.map((Ge) => Ue(Ve == null ? void 0 : Ve.segments, Ge)).filter(Boolean), Te = Ue(Ve == null ? void 0 : Ve.segments, be) || Re[0] || null), le(Re.map((Ge) => Ge.id)), M((Te == null ? void 0 : Te.id) ?? (Qe ? dr : null)), C.current = (Te == null ? void 0 : Te.id) ?? null, G.current = [], Z(Te ? bt(r, Te.id) : null), Te && T(Te.id);
      }
      if (Ae.length > 0) {
        const Re = ((Ce = Ae[0]) == null ? void 0 : Ce.message) || "Only segments with registered AI provenance can be collected.";
        he.length === 0 ? K(Re) : E.action === "remove" ? K(
          `Partially removed ${he.length} of ${oe.length} selected incorrect examples. ${Re}`
        ) : K(
          `Partially collected ${he.length} of ${oe.length} selected segments. ${Re}`
        );
      } else if (E.action === "remove")
        K(
          `${he.length} incorrect example${he.length === 1 ? "" : "s"} removed and ${he.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
        );
      else {
        const Re = he.filter(({ result: Te }) => Te.representation === "basicNativeBin").length;
        K(Re === he.length ? `${he.length} incorrect AI example${he.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${he.length} incorrect AI example${he.length === 1 ? "" : "s"} collected and ${he.length === 1 ? "segment rejected" : "segments rejected"}.`);
      }
      we && K("The change saved, but editor history could not be updated.");
    } catch (Ee) {
      K(Ee.message || "Unable to update the selected incorrect examples.");
    } finally {
      se(null);
    }
  }
  async function v(E) {
    var ve, be;
    if (!E || $ != null || u) return;
    W(E.id);
    const oe = `incorrect-example-remove:${k.id}:${E.id}:${E.revision}:${E.representationRevision}`;
    try {
      let he, Ae = !1;
      try {
        he = await ee(
          `/videos/${k.id}/incorrect-examples/${E.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Pe(oe),
              expectedExampleRevision: E.revision,
              expectedRepresentationRevision: E.representationRevision
            })
          }
        );
      } catch (Ne) {
        if (Ne.status !== 409 || ((be = (ve = Ne.payload) == null ? void 0 : ve.result) == null ? void 0 : be.code) !== "OPERATION_REPLAYED")
          throw Ne;
        he = Ne.payload.result, Ae = !0;
      }
      Le(oe);
      let we = !0;
      if (d) {
        const $e = [{ segment: Ue(c.segments, {
          itemId: E.itemId
        }) || {
          id: E.itemId == null ? null : -E.itemId,
          itemId: E.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: E.representationRevision
        }, result: he, example: E }];
        we = await q(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          rr($e, !0),
          rr($e, !1)
        );
      }
      const fe = await ee(
        `/videos/${k.id}/incorrect-examples`
      );
      j(fe), Ae ? await O() : H(
        Wr(c, he.editorDelta),
        k.id
      ), E.representation === "basicNativeBin" && Rn(), K(we ? Ae ? d ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : E.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (he) {
      he.status === 409 && await I(), K(he.message || "Unable to remove the incorrect example.");
    } finally {
      W(null);
    }
  }
  async function h() {
    if (u || $ != null || f.length === 0) return;
    pe(!0);
    const E = `incorrect-example-export:${k.id}:${f.map((oe) => `${oe.id}:${oe.revision}:${oe.representationRevision}`).join(",")}`;
    try {
      const oe = await Jl(
        k.id,
        f
      ), ve = new FormData();
      ve.append("metadata", JSON.stringify({
        operationId: Pe(E),
        examples: oe.captures
      }));
      for (const Ne of oe.files)
        ve.append(Ne.fieldName, Ne.file);
      const be = await ee(
        `/videos/${k.id}/incorrect-examples/export`,
        { method: "POST", body: ve }
      ), he = await ml(be.downloadUrl), Ae = URL.createObjectURL(he.blob), we = document.createElement("a");
      we.href = Ae, we.download = he.fileName, we.click(), setTimeout(() => URL.revokeObjectURL(Ae), 1e3);
      const fe = await ee(
        `/training-exports/${be.id}/complete`,
        { method: "POST" }
      );
      Le(E), j(await ee(
        `/videos/${k.id}/incorrect-examples`
      )), K(
        `Downloaded ${be.exampleCount} incorrect example${be.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${fe.clearedExampleCount} from the working collection.`
      );
    } catch (oe) {
      K(oe.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      pe(!1);
    }
  }
  async function D(E = null) {
    const oe = _.filter(($e) => $e.reviewState === "rejected"), ve = oe.length, be = f.some(($e) => $e.representation === "fullItem");
    if (E == null && ve === 0 && !be) {
      K("There are no rejected segments to delete.");
      return;
    }
    if (E == null) {
      se(-1), K("Preparing deletion summary…");
      try {
        const $e = await ee(`/videos/${k.id}/rejected/deletion/preview`, { method: "POST" }), Ce = Number($e.deletedSegmentCount) || 0, Ee = Number($e.deferredRejectedSegmentCount) || 0, je = Number($e.protectedIncorrectExampleCount) || 0;
        if (Ce === 0) {
          Ee > 0 ? K(
            `${Ee} feedback-protected rejected segment${Ee === 1 ? "" : "s"} kept. ${je} AI feedback example${je === 1 ? "" : "s"} must be exported before ${Ee === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : K("There are no rejected segments to delete.");
          return;
        }
        if (!Wa($e, K)) return;
        R($e), K("");
      } catch ($e) {
        K($e.message || "Unable to prepare rejected segment deletion.");
      } finally {
        se(null);
      }
      return;
    }
    const he = E, Ae = Number(he.deferredRejectedSegmentCount) || 0, we = J.current, fe = Ae === 0 ? Vr(c, oe.map(($e) => $e.id)) : c, Ne = fe.segments.find(($e) => $e.reviewState === "unreviewed") || fe.segments[0] || null;
    R(null), se(-1), K("Deleting rejected segments…"), Ae === 0 && (H(fe, k.id), le(Ne ? [Ne.id] : []), M((Ne == null ? void 0 : Ne.id) ?? null), C.current = (Ne == null ? void 0 : Ne.id) ?? null, G.current = []);
    try {
      const $e = `rejected-dependency-delete:${k.id}:${he.fingerprint}`, Ce = await ee(`/videos/${k.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe($e),
          fingerprint: he.fingerprint
        })
      });
      Le($e), await O(), Ce.deletedSegmentCount > 0 && t(Ct);
      const Ee = Ae > 0 ? ` ${Ae} feedback-protected rejected segment${Ae === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      K(`${Ce.deletedSegmentCount} segment${Ce.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Ee}`);
    } catch ($e) {
      Ae === 0 && H((Ce) => ai(
        Ce,
        oe
      ), k.id), le(we == null ? [] : [we]), M(we), C.current = we, G.current = [], K($e.message || "Unable to delete rejected segments.");
    } finally {
      se(null);
    }
  }
  async function ne(E = o) {
    if (!(i || E.length === 0)) {
      ce(!0), Q("");
      try {
        const oe = await ee(`/videos/${k.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: E.flatMap((ve) => ve.nativeSegmentId == null ? [] : [ve.nativeSegmentId]),
            itemIds: E.flatMap((ve) => ve.published || ve.itemId == null ? [] : [ve.itemId])
          })
        });
        ie(!1), await O(), K(`${oe.assignedSegmentCount} segment${oe.assignedSegmentCount === 1 ? "" : "s"} received ${oe.assignedSlotCount} performer-slot assignment${oe.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (oe) {
        Q(oe.message || "Unable to auto-assign performers.");
      } finally {
        ce(!1);
      }
    }
  }
  async function re() {
    ae(!0), X(""), !y && (ue(!0), A());
  }
  function Y() {
    b.current = !0, ae(!1), requestAnimationFrame(() => {
      var E;
      return (E = p.current) == null ? void 0 : E.focus({ preventScroll: !0 });
    });
  }
  async function ke() {
    if (!y || N || y.createCount + y.linkCount === 0)
      return;
    Se(!0), X("");
    let E;
    try {
      const oe = `materialize-derived:${k.id}:${y.fingerprint}`;
      E = await ee(`/videos/${k.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe(oe),
          fingerprint: y.fingerprint,
          maxDepth: 3
        })
      }), Le(oe);
    } catch (oe) {
      oe.status === 409 && xe(null), X(oe.message || "Unable to materialize derived segments."), Se(!1);
      return;
    }
    xe((oe) => oe && { ...oe, createCount: 0, linkCount: 0 });
    try {
      await O(), Y(), xe(null);
      const oe = E.createdCount + E.linkedCount;
      K(`${E.createdCount} derived segment${E.createdCount === 1 ? "" : "s"} created and ${E.linkedCount} existing segment${E.linkedCount === 1 ? "" : "s"} linked.`), oe === 0 && K("Every applicable derivation was already materialized.");
    } catch {
      X("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    Se(!1);
  }
  async function V(E, oe = null) {
    var be, he, Ae, we;
    const ve = {
      tagId: E,
      ...oe ? { tagName: oe } : {}
    };
    if (w.length > 1) {
      const fe = w.filter((je) => je.tagId !== E);
      if (fe.length === 0) {
        l();
        return;
      }
      const Ne = w.map((je) => ({
        id: je.id,
        itemId: je.itemId,
        nativeSegmentId: je.nativeSegmentId
      })), $e = w.map((je) => !d || je.nativeSegmentId != null ? `native:${je.nativeSegmentId}:${je.updatedAt}` : `item:${je.itemId}:${je.revision}`).sort().join(","), Ce = `bulk-tag:${k.id}:${E}:${$e}`;
      se((U == null ? void 0 : U.id) ?? fe[0].id), K(`Changing tag for ${fe.length} selected segment${fe.length === 1 ? "" : "s"}…`);
      const Ee = mr(
        c,
        fe.map((je) => je.id),
        ve
      );
      H(Ee, k.id), l();
      try {
        const je = d ? null : crypto.randomUUID();
        await ee(`/videos/${k.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Pe(Ce),
            tagId: E,
            historyReceiptId: je,
            segments: w.map((He) => {
              const Ve = !d || He.nativeSegmentId != null;
              return {
                nativeSegmentId: Ve ? He.nativeSegmentId : null,
                itemId: Ve ? null : He.itemId,
                expectedUpdatedAt: Ve ? He.updatedAt : null,
                expectedRevision: Ve ? null : He.revision
              };
            })
          })
        }), Le(Ce);
        const Qe = mt(
          w,
          d
        ), Fe = await O(), Ie = Ne.map((He) => Ue(Fe == null ? void 0 : Fe.segments, He)).filter(Boolean);
        await q(
          "segments.tag",
          `Changed tag for ${fe.length} segment${fe.length === 1 ? "" : "s"}`,
          Qe,
          mt(Ie, d),
          je
        );
        const _e = Ne.map((He) => Ue(Fe == null ? void 0 : Fe.segments, He)).filter(Boolean);
        le(_e.map((He) => He.id)), M(((be = _e.find((He) => He.id === (U == null ? void 0 : U.id))) == null ? void 0 : be.id) ?? ((he = _e[0]) == null ? void 0 : he.id) ?? null), l(), K(`${fe.length} selected segment${fe.length === 1 ? "" : "s"} retagged.`);
      } catch (je) {
        H((Ie) => Pn(
          Ie,
          fe,
          Object.keys(ve)
        ), k.id);
        const Qe = Ne.map((Ie) => Ue(c.segments, Ie)).filter(Boolean), Fe = Ue(c.segments, {
          id: U == null ? void 0 : U.id,
          itemId: U == null ? void 0 : U.itemId,
          nativeSegmentId: U == null ? void 0 : U.nativeSegmentId
        }) || Qe[0] || null;
        le(Qe.map((Ie) => Ie.id)), M((Fe == null ? void 0 : Fe.id) ?? null), C.current = (Fe == null ? void 0 : Fe.id) ?? null, G.current = [], je.status === 409 && await I(), K(je.message || "Unable to change the selected segment tags.");
      } finally {
        se(null);
      }
      return;
    }
    if (!(w.length !== 1 || !U)) {
      if (E === U.tagId) {
        l();
        return;
      }
      if (U.itemId != null && ((we = (Ae = m.data) == null ? void 0 : Ae.children) == null ? void 0 : we.length) > 0) {
        se(U.id), K("Checking lineage impact…");
        try {
          const fe = await ee(`/items/${U.itemId}/tag-change/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedRevision: U.revision, tagId: E })
          }), Ne = fe.deletedItemIds.length > 0 || fe.removedEdgeIds.length > 0;
          if (Ne && !window.confirm(
            `Changing this tag removes ${fe.removedEdgeIds.length} lineage edge${fe.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${fe.deletedItemIds.length} derived segment${fe.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
          )) {
            K("Tag change canceled.");
            return;
          }
          const $e = mr(
            c,
            [U.id],
            ve
          );
          H($e, k.id), l();
          const Ce = `tag-change:${U.itemId}:${U.revision}:${fe.componentFingerprint}:${E}`;
          await ee(`/items/${U.itemId}/tag-change/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Pe(Ce),
              expectedRevision: U.revision,
              componentFingerprint: fe.componentFingerprint,
              tagId: E
            })
          }), Le(Ce), await O(), l(), K(Ne ? "Tag changed and lineage reconciled." : "Tag changed.");
        } catch (fe) {
          H((Ne) => Pn(
            Ne,
            [U],
            Object.keys(ve)
          ), k.id), le([U.id]), M(U.id), C.current = U.id, G.current = [], fe.status === 409 ? (K("Lineage changed — loading the latest segments…"), await I()) : K(fe.message || "Unable to reconcile the lineage.");
        } finally {
          se(null);
        }
        return;
      }
      l(), await S(U, {
        startSec: U.startSec,
        endSec: U.endSec,
        tagId: E
      }, !0, null, !0, ve);
    }
  }
  async function te() {
    var we, fe, Ne, $e;
    if (!s || !U || P != null) return;
    const E = [...w].sort((Ce, Ee) => Number(Ce.nativeSegmentId ?? Ce.id) - Number(Ee.nativeSegmentId ?? Ee.id)), oe = new Set(E.map((Ce) => Ce.id)), ve = E.map((Ce) => `${Ce.nativeSegmentId ?? Ce.id}:${Ce.updatedAt}`).join("|");
    se(U.id), K(`Moving ${E.length} segment${E.length === 1 ? "" : "s"} to recycling bin…`);
    const be = `bulk-move:${k.id}:${ve}`, he = Pe(be), Ae = d ? null : crypto.randomUUID();
    try {
      const Ce = (Ie = !1) => ee(`/videos/${k.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: he,
          segments: E.map((_e) => ({
            segmentId: _e.nativeSegmentId ?? _e.id,
            expectedUpdatedAt: _e.updatedAt
          })),
          discardMissingImage: Ie,
          ...d ? { reviewState: "rejected" } : {},
          historyReceiptId: Ae
        })
      });
      let Ee;
      try {
        Ee = await Ce(
          no(be)
        );
      } catch (Ie) {
        if (((we = Ie.payload) == null ? void 0 : we.code) !== "missing-image" || !window.confirm(`${Ie.message}

Continue and discard the missing image reference?`)) throw Ie;
        ro(be), Ee = await Ce(!0);
      }
      Le(be), Rn();
      const je = new Map((Ee.items || []).map((Ie) => [
        Number(Ie.segmentId),
        Ie
      ]));
      await q(
        "segments.moveToBin",
        `Moved ${E.length} segment${E.length === 1 ? "" : "s"} to recycling bin`,
        mt(E, !1),
        mt(E.map((Ie) => {
          const _e = je.get(
            Number(Ie.nativeSegmentId ?? Ie.id)
          );
          return {
            ...Ie,
            recycleBinItemId: (_e == null ? void 0 : _e.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (_e == null ? void 0 : _e.revision) ?? null
          };
        }), !1),
        Ae
      );
      const Qe = _.filter((Ie) => !oe.has(Ie.id)), Fe = $s(r, oe, U.id);
      H({ ...c, segments: Qe }, k.id), le(Fe ? [Fe.id] : []), M((Fe == null ? void 0 : Fe.id) ?? null), C.current = (Fe == null ? void 0 : Fe.id) ?? null, G.current = [], Fe && (Z(bt(r, Fe.id)), T(Fe.id)), requestAnimationFrame(() => {
        var Ie;
        return (Ie = g.current) == null ? void 0 : Ie.focus({ preventScroll: !0 });
      }), K(`Moved ${E.length} segment${E.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Ce) {
      const Ee = ((fe = Ce.payload) == null ? void 0 : fe.code) || (($e = (Ne = Ce.payload) == null ? void 0 : Ne.result) == null ? void 0 : $e.code);
      Ce.status === 409 && Ee === "CANONICAL_SEGMENT_CHANGED" ? await I() : K(Ce.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      se(null);
    }
  }
  async function z() {
    if (!(d || a.current || P != null)) {
      a.current = !0, K("Checking the recycling bin…");
      try {
        const E = await ee("/bin"), oe = await Ja(E, () => K("Emptying the recycling bin…"));
        if (oe.status === "empty") {
          K("The recycling bin is empty.");
          return;
        }
        if (oe.status === "canceled") {
          K("The recycling bin was not emptied.");
          return;
        }
        K(`${oe.segmentCount} segment${oe.segmentCount === 1 ? "" : "s"} from ${oe.sceneCount} scene${oe.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (E) {
        K(E.message || "Unable to empty the recycling bin.");
      } finally {
        a.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: x, removeIncorrectExample: v, captureTrainingExport: h, deleteRejectedSegments: D, autoAssignPerformers: ne, previewDerivedSegments: re, closeMaterializeDialog: Y, materializeDerivedSegments: ke, saveTag: V, moveToBin: te, emptyRecyclingBin: z };
}
function Ud(e) {
  const { acceptHistory: t, commonActionsRef: r, compatibilityMode: o, currentTime: i, detail: a, editorLayout: s, focusRowRef: l, history: d, historyRef: c, historySaving: g, horizontalLayoutSize: u, mediaStackHeight: f, mediaStackRef: m, onDetailChange: p, onReload: y, railToggleRef: b, recordHistoryAction: N, savingSegmentId: S, savingShot: I, savingShotRef: H, setCollapsedSegmentGroups: O, setEditorLayout: q, setHistorySaving: A, setIncorrectExamples: $, setSaveMessage: T, setSavingSegmentId: P, setSavingShot: _, shotBoundaries: U, timelineDuration: J, video: w, workspaceRef: C } = e;
  async function G(k, x, v) {
    var re, Y, ke, V;
    const h = k.type === "segment" ? [k] : k.segments || [], D = (x == null ? void 0 : x.type) === "segment" ? [x] : (x == null ? void 0 : x.segments) || [];
    let ne = v;
    for (const [te, z] of h.entries()) {
      const E = D[te], oe = ((re = z.identity) == null ? void 0 : re.nativeSegmentId) != null || ((Y = z.identity) == null ? void 0 : Y.published) === !0, ve = ((ke = E == null ? void 0 : E.identity) == null ? void 0 : ke.recycleBinItemId) ?? ((V = E == null ? void 0 : E.identity) == null ? void 0 : V.itemId);
      let be = Ue(ne.segments, E == null ? void 0 : E.identity) || Ue(ne.segments, z.identity);
      if (!be && oe && ve != null && E.identity.revision != null) {
        const we = `history-restore:${w.id}:${ve}:${E.identity.revision}`;
        await ee(`/bin/${ve}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Pe(we),
            expectedRevision: E.identity.revision
          })
        }), Le(we), ne = await y(), be = ne.segments.find((fe) => fe.tagId === z.values.tagId && fe.startSec === z.values.startSec && fe.endSec === z.values.endSec);
      }
      if (!be)
        throw new Error("A segment in this history state no longer exists.");
      if ((be.nativeSegmentId != null || be.published === !0) !== oe) {
        if (oe) {
          const we = be.recycleBinItemId ?? be.itemId ?? ve;
          if (we == null)
            throw new Error("This recycled segment can no longer be restored.");
          const fe = `history-restore:${w.id}:${we}:${be.revision}:${z.values.reviewState ?? "native"}`;
          await ee(`/bin/${we}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Pe(fe),
              expectedRevision: be.revision
            })
          }), Le(fe);
        } else {
          const we = `history-bin:${w.id}:${be.nativeSegmentId}:${be.updatedAt}:${z.values.reviewState}`;
          await ee(`/videos/${w.id}/segments/${be.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Pe(we),
              expectedUpdatedAt: be.updatedAt,
              reviewState: z.values.reviewState
            })
          }), Le(we);
        }
        if (ne = await y(), !oe)
          continue;
        if (be = Ue(ne.segments, z.identity) || ne.segments.find((we) => we.tagId === z.values.tagId && we.startSec === z.values.startSec && we.endSec === z.values.endSec), !be)
          throw new Error("The restored segment could not be found.");
      }
      const Ae = z.values;
      if (be.nativeSegmentId == null && be.itemId != null) {
        const we = `history-draft-update:${w.id}:${be.itemId}:${be.revision}:${Ae.tagId}:${Ae.startSec}:${Ae.endSec ?? "open"}:${Ae.reviewState}`;
        await ee(`/videos/${w.id}/drafts/${be.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Pe(we),
            expectedRevision: be.revision,
            ...Ae
          })
        }), Le(we);
      } else
        await ee(`/videos/${w.id}/segments/${be.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Ae, expectedUpdatedAt: be.updatedAt })
        });
      ne = await y();
    }
    return ne;
  }
  async function Q(k, x) {
    var v;
    for (const h of k.targets || []) {
      const D = Ue(x.segments, h.identity);
      if (!D)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const ne = (v = x.performerSlotRevisions) == null ? void 0 : v[D.id];
      await ee(D.published ? `/videos/${w.id}/segments/${D.nativeSegmentId}/slots` : `/videos/${w.id}/drafts/${D.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: ne,
          assignments: h.assignments
        })
      }), x = await y();
    }
    return x;
  }
  async function ie(k, x, v) {
    if (!o)
      throw new Error("AI feedback history is only available in Full mode.");
    let h = x, D = await ee(`/videos/${w.id}/incorrect-examples`);
    const ne = (re) => D.find((Y) => {
      var ke;
      return Y.id === re.exampleId || ((ke = re.collectedIdentity) == null ? void 0 : ke.itemId) != null && Y.itemId === re.collectedIdentity.itemId;
    });
    for (const [re, Y] of (k.entries || []).entries()) {
      const ke = `history-feedback:${w.id}:${v.action.sequence}:${v.direction}:${re}`, V = ne(Y);
      if (k.collected && V) {
        Le(ke);
        continue;
      }
      let te;
      if (k.collected) {
        const z = Ue(
          h.segments,
          Y.collectedIdentity
        ) || Ue(
          h.segments,
          Y.originalIdentity
        );
        if (!z)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const E = z.nativeSegmentId != null;
        te = await ee(`/videos/${w.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Pe(ke),
            nativeSegmentId: E ? z.nativeSegmentId : null,
            itemId: E ? null : z.itemId,
            expectedUpdatedAt: E ? z.updatedAt : null,
            expectedRevision: E ? null : z.revision
          })
        });
      } else {
        if (!V) {
          Le(ke);
          continue;
        }
        te = await ee(
          `/videos/${w.id}/incorrect-examples/${V.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Pe(ke),
              expectedExampleRevision: V.revision,
              expectedRepresentationRevision: V.representationRevision
            })
          }
        );
      }
      Le(ke), h = Wr(
        h,
        te.editorDelta
      ), D = await ee(
        `/videos/${w.id}/incorrect-examples`
      );
    }
    return $(D), h;
  }
  async function ce(k, x, v = []) {
    const h = k.state;
    if (!o && ((h == null ? void 0 : h.type) === "segment" || (h == null ? void 0 : h.type) === "segments")) {
      const ne = `basic-history:${w.id}:${c.current.revision}:${k.action.sequence}:${k.direction}`, re = await ee(`/videos/${w.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe(ne),
          expectedHistoryRevision: c.current.revision,
          actionSequence: k.action.sequence,
          direction: k.direction
        })
      });
      return t(re.history), v.push(ne), y();
    }
    const D = k.direction === "backward" ? k.action.afterState : k.action.beforeState;
    if ((h == null ? void 0 : h.type) === "composite") {
      let ne = x;
      const re = (D == null ? void 0 : D.type) === "composite" ? D.states || [] : [];
      for (const [Y, ke] of (h.states || []).entries()) {
        const V = re[Y];
        ne = await ce({
          ...k,
          state: ke,
          action: {
            ...k.action,
            beforeState: k.direction === "backward" ? ke : V,
            afterState: k.direction === "backward" ? V : ke
          }
        }, ne, v);
      }
      return ne;
    }
    if ((h == null ? void 0 : h.type) === "segment" || (h == null ? void 0 : h.type) === "segments")
      return G(
        h,
        D,
        x
      );
    if ((h == null ? void 0 : h.type) === "performerSlots")
      return Q(h, x);
    if ((h == null ? void 0 : h.type) === "incorrectExamples")
      return ie(h, x, k);
    if ((h == null ? void 0 : h.type) === "shots") {
      const ne = An(x.shotBoundaries || []), re = await ee(`/videos/${w.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe(`history-shots:${w.id}:${ne}:${h.fingerprint}`),
          expectedFingerprint: ne,
          boundaries: h.boundaries
        })
      });
      return { ...x, shotBoundaries: re };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function pe(k) {
    var v;
    if (g || S != null || I || k === d.cursorSequence)
      return;
    const x = $l(d, k);
    if (x.length !== 0) {
      A(!0), P(-1), T(`Restoring ${x.length} history ${x.length === 1 ? "action" : "actions"}…`);
      try {
        let h = a;
        const D = [];
        for (const re of x)
          h = await ce(
            re,
            h,
            D
          );
        const ne = o ? await ee(`/videos/${w.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: c.current.revision,
            targetSequence: k
          })
        }) : c.current;
        D.forEach(Le), t(ne), await y(), T("History restored.");
      } catch (h) {
        h.status === 409 && ((v = h.payload) != null && v.current) && t(h.payload.current), await y(), T(h.message || "Unable to restore editor history.");
      } finally {
        P(null), A(!1);
      }
    }
  }
  function j(k) {
    q((x) => ({ ...x, timelineRatio: eo(k, f) }));
  }
  function X(k) {
    var h, D;
    const x = (h = m.current) == null ? void 0 : h.getBoundingClientRect();
    if (!x) return;
    const v = ((D = r.current) == null ? void 0 : D.offsetHeight) || 0;
    j(us(
      k.clientY,
      x.top + v,
      Math.max(0, x.height - v)
    ));
  }
  function ue(k) {
    k.currentTarget.setPointerCapture(k.pointerId), X(k);
  }
  function ae(k) {
    k.currentTarget.hasPointerCapture(k.pointerId) && X(k);
  }
  function xe(k) {
    const x = k.shiftKey ? 0.1 : 0.05;
    let v = null;
    k.key === "ArrowUp" && (v = s.timelineRatio + x), k.key === "ArrowDown" && (v = s.timelineRatio - x);
    const h = Xr(f);
    k.key === "Home" && (v = h.minimum), k.key === "End" && (v = h.maximum), v != null && (k.preventDefault(), k.stopPropagation(), j(v));
  }
  function Se(k) {
    const x = k === "detailWidth" ? u.focusRow : u.workspace, v = u.workspace > 0 ? Ur(u.workspace, 600) : 560, h = Kt(s.markerRailWidth, v), D = k === "detailWidth" ? 344 + (s.markerRailOpen ? h + 24 : 0) : 600;
    return x > 0 ? Ur(x, D) : 560;
  }
  function R(k, x) {
    q((v) => ({ ...v, [k]: Kt(x, Se(k)) }));
  }
  function W(k, x) {
    var h, D;
    const v = x === "detailWidth" ? (h = l.current) == null ? void 0 : h.getBoundingClientRect() : (D = C.current) == null ? void 0 : D.getBoundingClientRect();
    v && R(x, x === "detailWidth" ? k.clientX - v.left : v.right - k.clientX);
  }
  function K(k, x) {
    const v = Se(k), h = Kt(s[k], v);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": x,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(v),
      "aria-valuenow": Math.round(h),
      "aria-valuetext": `${Math.round(h)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (D) => {
        D.currentTarget.setPointerCapture(D.pointerId), W(D, k);
      },
      onPointerMove: (D) => {
        D.currentTarget.hasPointerCapture(D.pointerId) && W(D, k);
      },
      onKeyDown: (D) => {
        const ne = D.shiftKey ? 40 : 16;
        let re = null;
        D.key === "ArrowLeft" && (re = k === "detailWidth" ? -ne : ne), D.key === "ArrowRight" && (re = k === "detailWidth" ? ne : -ne);
        let Y = re == null ? null : h + re;
        D.key === "Home" && (Y = 240), D.key === "End" && (Y = v), Y != null && (D.preventDefault(), D.stopPropagation(), R(k, Y));
      },
      onDoubleClick: () => R(k, st[k]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function se() {
    q((k) => ({ ...k, markerRailOpen: !k.markerRailOpen })), requestAnimationFrame(() => {
      var k;
      return (k = b.current) == null ? void 0 : k.focus({ preventScroll: !0 });
    });
  }
  function Z(k) {
    O((x) => x.includes(k) ? x.filter((v) => v !== k) : Lt([...x, k]));
  }
  async function M(k, x = !0, v = i) {
    var re;
    if (H.current) return null;
    const h = Number((re = w.videoFile) == null ? void 0 : re.duration) || J, D = An(U), ne = `shot-${k}:${w.id}:${v.toFixed(3)}:${h.toFixed(3)}:${D}`;
    H.current = !0, _(!0), T(k === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const Y = await ee(`/videos/${w.id}/shot-boundaries/${k}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(k === "split" ? { operationId: Pe(ne), timeSec: v } : { operationId: Pe(ne), timeSec: v })
      });
      return Le(ne), p((ke) => ({ ...ke, shotBoundaries: Y }), w.id), x && await N(
        "shots.update",
        k === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: U,
          fingerprint: D
        },
        {
          type: "shots",
          boundaries: Y,
          fingerprint: An(Y)
        }
      ), T(k === "split" ? "Shot boundary added." : "Shots merged."), Y;
    } catch (Y) {
      return T(Y.message || "Unable to edit shot boundaries."), null;
    } finally {
      H.current = !1, _(!1);
    }
  }
  async function le(k) {
    if (H.current) return null;
    const x = `shot-restore:${w.id}:${k.afterFingerprint}`;
    H.current = !0, _(!0), T("Undoing shot edit…");
    try {
      const v = await ee(`/videos/${w.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe(x),
          expectedFingerprint: k.afterFingerprint,
          boundaries: k.before
        })
      });
      return Le(x), p((h) => ({ ...h, shotBoundaries: v }), w.id), v;
    } catch (v) {
      return T(v.message || "Unable to undo the shot edit."), null;
    } finally {
      H.current = !1, _(!1);
    }
  }
  return { applySegmentHistoryState: G, applyPerformerSlotHistoryState: Q, applyHistoryState: ce, restoreHistoryTarget: pe, updateTimelineRatio: j, updateTimelineRatioFromPointer: X, handleSeparatorPointerDown: ue, handleSeparatorPointerMove: ae, handleSeparatorKeyDown: xe, panelWidthMaximum: Se, updatePanelWidth: R, handlePanelSeparatorPointer: W, panelSeparatorProps: K, toggleSegmentRail: se, toggleSegmentGroup: Z, mutateShotBoundary: M, restoreShotBoundaries: le };
}
function Kd(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: u, lineage: f, mediaDuration: m, mergeSelectedSwimlane: p, moveToBin: y, mutateShotBoundary: b, openPublishApprovedDialog: N, playbackControlsRef: S, playbackShortcutConfig: I, saveSelectedReviewState: H, seekRef: O, segmentGroupKeys: q, selectSegment: A, selectedSegment: $, selectedSegmentGroupForSegment: T, selectedSegmentGroupKey: P, selectedSegments: _, setCollapsedSegmentGroups: U, setIncorrectExamplesOpen: J, setQuickSearchOpen: w, setSaveMessage: C, setSelectedSegmentGroupKey: G, setTagEditing: Q, setTimelineZoom: ie, shotBoundaries: ce, slotButtonRef: pe, splitSegment: j, swimlanes: X, timelineDuration: ue, toggleIncorrectExample: ae, toggleSegmentGroup: xe, updateTimelineRatio: Se, videoFrameRate: R, visibleSegments: W } = e;
  function K(M) {
    var le, k;
    (le = S.current) == null || le.pause(), (k = S.current) == null || k.seekBy(Ws(M, R));
  }
  function se(M, le) {
    if (_.length > 1 && Ds(M.id))
      return;
    let k = null;
    M.id === "video.playPause" && (k = () => {
      var x;
      return (x = S.current) == null ? void 0 : x.toggle();
    }), M.id === "video.seekSmallBackward" && (k = () => {
      var x;
      return (x = S.current) == null ? void 0 : x.seekBy(-I.smallSeekTime);
    }), M.id === "video.seekSmallForward" && (k = () => {
      var x;
      return (x = S.current) == null ? void 0 : x.seekBy(I.smallSeekTime);
    }), M.id === "video.seekMediumBackward" && (k = () => {
      var x;
      return (x = S.current) == null ? void 0 : x.seekBy(-I.mediumSeekTime);
    }), M.id === "video.seekMediumForward" && (k = () => {
      var x;
      return (x = S.current) == null ? void 0 : x.seekBy(I.mediumSeekTime);
    }), M.id === "video.seekLongBackward" && (k = () => {
      var x;
      return (x = S.current) == null ? void 0 : x.seekBy(-I.longSeekTime);
    }), M.id === "video.seekLongForward" && (k = () => {
      var x;
      return (x = S.current) == null ? void 0 : x.seekBy(I.longSeekTime);
    }), M.id === "video.playSelected" && $ && (k = () => {
      var x;
      (x = O.current) == null || x.call(O, $.startSec, !0), requestAnimationFrame(() => {
        var v;
        return (v = g.current) == null ? void 0 : v.focus({ preventScroll: !0 });
      });
    }), (M.id === "video.playPreviousSegment" || M.id === "video.playNextSegment") && (k = () => {
      var v;
      const x = qr(
        X,
        $ == null ? void 0 : $.id,
        M.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !x || x.id === ($ == null ? void 0 : $.id) || (A(x, { focusEditor: !0, seekToSegment: !1 }), (v = O.current) == null || v.call(O, x.startSec, !0));
    }), M.id.startsWith("video.seekPercent") && (k = () => {
      var v;
      const x = Number(M.id.slice(17)) / 10;
      (v = O.current) == null || v.call(O, Ts(m ?? ue, x), !1);
    }), M.id === "video.jumpToSegmentStart" && $ && (k = () => {
      var x;
      return (x = O.current) == null ? void 0 : x.call(O, $.startSec, !1);
    }), M.id === "video.jumpToSegmentEnd" && $ && (k = () => {
      var x;
      return (x = O.current) == null ? void 0 : x.call(O, $.endSec ?? $.startSec, !1);
    }), M.id === "video.jumpToVideoStart" && (k = () => {
      var x;
      return (x = O.current) == null ? void 0 : x.call(O, 0, !1);
    }), M.id === "video.jumpToVideoEnd" && (k = () => {
      var x;
      return (x = O.current) == null ? void 0 : x.call(O, ue, !1);
    }), M.id.startsWith("video.frame") && (k = () => {
      const x = M.id.includes("Small") ? "small" : M.id.includes("Medium") ? "medium" : "long", v = I[`${x}FrameStep`] * (M.id.endsWith("Backward") ? -1 : 1);
      K(v);
    }), M.id.startsWith("navigation.swimlane") && (k = () => {
      const x = M.id.slice(19).toLowerCase(), v = qr(X, $ == null ? void 0 : $.id, x, s);
      v && A(v, { focusEditor: !0, seekToSegment: !1 });
    }), (M.id === "navigation.extendSwimlaneLeft" || M.id === "navigation.extendSwimlaneRight") && (k = () => {
      const x = Kl(
        t,
        $ == null ? void 0 : $.id,
        M.id.endsWith("Left") ? "left" : "right"
      );
      x && A(x.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: x.segmentIds
      });
    }), (M.id === "navigation.segmentGroupUp" || M.id === "navigation.segmentGroupDown") && (k = () => {
      const x = zl(
        q,
        P ?? T,
        M.id.endsWith("Up") ? -1 : 1
      );
      x && G(x);
    }), (M.id === "navigation.previousAtPlayhead" || M.id === "navigation.nextAtPlayhead") && (k = () => {
      const x = ms(W, s, M.id === "navigation.previousAtPlayhead" ? -1 : 1, $ == null ? void 0 : $.id);
      x && A(x, { focusEditor: !0, seekToSegment: !1 });
    }), M.id === "navigation.nearestInCurrentSwimlane" && (k = () => {
      const x = ts(
        X,
        $ == null ? void 0 : $.id,
        s
      );
      x && A(x, { focusEditor: !0, seekToSegment: !1 });
    }), M.id.includes("Unreviewed") && (k = () => {
      const x = sr(
        X,
        $ == null ? void 0 : $.id,
        M.id.startsWith("navigation.previous") ? -1 : 1,
        M.id.endsWith("Global")
      );
      x && A(x, { focusEditor: !le.preserveFocus, seekToSegment: !1 });
    }), (M.id === "navigation.nextTouchingPlayhead" || M.id === "navigation.previousTouchingPlayhead") && (k = () => {
      const x = es(X, s, M.id === "navigation.previousTouchingPlayhead" ? -1 : 1, $ == null ? void 0 : $.id);
      x && A(x, { focusEditor: !0, seekToSegment: !1 });
    }), M.id === "navigation.quickSearch" && (k = () => w(!0)), (M.id === "navigation.previousShot" || M.id === "navigation.nextShot") && (k = () => {
      var v;
      const x = qs(ce, s, M.id === "navigation.previousShot" ? -1 : 1);
      x && ((v = O.current) == null || v.call(O, x.startSec, !1));
    }), M.id === "shot.split" && (k = () => b("split")), M.id === "shot.merge" && (k = () => b("merge")), M.id === "marker.create" && (k = () => a()), M.id === "marker.duplicate" && (k = () => d(!1)), M.id === "marker.duplicateAtPlayhead" && (k = () => d(!0)), M.id === "marker.split" && (k = () => j()), M.id === "marker.editTag" && (k = () => {
      var x;
      if (_.length > 1 && _.some((v) => v.isDerived)) {
        C("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((x = f.data) != null && x.tagReadOnly) {
        C("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      Q(!0);
    }), M.id === "marker.setStart" && $ && (k = () => r(s, $.endSec)), M.id === "marker.setEnd" && $ && (k = () => r($.startSec, s)), M.id === "marker.copyTiming" && $ && (k = () => {
      C(sd($) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), M.id === "marker.pasteTiming" && $ && (k = () => {
      const x = id();
      if (!x) {
        C("No copied segment timing is available.");
        return;
      }
      r(x.startSec, x.endSec);
    }), M.id === "marker.mergeSelection" && (k = () => p()), M.id === "marker.moveToBin" && (k = () => y()), M.id === "marker.toggleIncorrectExample" && $ && (k = () => ae()), M.id === "marker.openIncorrectExamples" && (k = () => J(!0)), M.id === "markerGroup.toggleCollapse" && P && (k = () => xe(P)), M.id === "markerGroup.toggleAll" && (k = () => U((x) => Ul(x, q))), M.id === "marker.assignSlots" && (k = () => {
      var x;
      return (x = pe.current) == null ? void 0 : x.click();
    }), M.id === "navigation.zoomIn" && (k = () => ie((x) => lr(x + 0.5))), M.id === "navigation.zoomOut" && (k = () => ie((x) => lr(x - 0.5))), M.id === "navigation.resetZoom" && (k = () => ie(1)), M.id === "navigation.centerPlayhead" && (k = () => {
      var x;
      return (x = o.current) == null ? void 0 : x.call(o);
    }), M.id === "layout.growSwimlanes" && (k = () => Se(c.timelineRatio + 0.05)), M.id === "layout.shrinkSwimlanes" && (k = () => Se(c.timelineRatio - 0.05)), M.id === "marker.confirm" && $ && (k = () => H("approved")), M.id === "system.publishApproved" && (k = () => N(le.target)), M.id === "marker.reject" && $ && (k = () => H("rejected")), M.id === "system.emptyBin" && (k = () => u()), M.id === "system.deleteRejected" && (k = () => l()), k && k();
  }
  function Z(M, le) {
    const k = Ln.find((x) => x.id === M);
    k && cn(k, i) && se(k, le);
  }
  return {
    executeShortcutById: Z,
    stepVideoFrame: (M) => K(M < 0 ? -1 : 1)
  };
}
function la(e) {
  return e === !0;
}
function da() {
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
function zd(e, t, r = !1, o = 0, i = "") {
  const [a, s] = L(null), [l, d] = L(null), [c, g] = L(""), [u, f] = L({
    busy: !1,
    reviewState: null,
    error: ""
  }), m = ge(null);
  async function p(N) {
    f({ busy: !0, reviewState: N, error: "" });
    try {
      await ee(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Hr(), reviewState: N })
      }), await t(), f({ busy: !1, reviewState: null, error: "" });
    } catch (S) {
      f({
        busy: !1,
        reviewState: null,
        error: S.message || "Unable to import Cove segments."
      });
    }
  }
  async function y(N) {
    try {
      const S = await ee(`/videos/${e}/analysis-runs`, {
        signal: N.signal
      });
      if (!N.isActive()) return null;
      const I = (S == null ? void 0 : S[0]) || null;
      return s(I), (I == null ? void 0 : I.status) === "completed" && m.current !== I.id && (m.current = I.id, await t()), ((I == null ? void 0 : I.status) === "failed" || (I == null ? void 0 : I.status) === "cancelled") && g(I.errorMessage || "Video analysis did not complete."), I;
    } catch (S) {
      return N.isActive() && S.name !== "AbortError" && g(S.message || "Unable to load video analysis status."), null;
    }
  }
  async function b(N = null) {
    g("");
    const S = N || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), I = S.includes("omnishotcut") && o > 0;
    if (!(I && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const H = await ee(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: S,
            replaceShotBoundaries: I,
            expectedShotBoundaryFingerprint: I ? i : null
          })
        });
        s(H);
      } catch (H) {
        g(H.message || "Unable to start video analysis.");
      }
  }
  return ye(() => {
    if (!la(r)) {
      s(null), d(null), g("");
      return;
    }
    const N = da();
    return y(N), ee("/analysis/status", { signal: N.signal }).then((S) => {
      N.isActive() && (d(S), S.configured || g(""));
    }).catch((S) => {
      N.isActive() && S.name !== "AbortError" && g(S.message || "Unable to check video analysis readiness.");
    }), N.dispose;
  }, [e, r]), ye(() => {
    if (!la(r) || (a == null ? void 0 : a.status) !== "queued" && (a == null ? void 0 : a.status) !== "running") return;
    const N = da();
    let S = setTimeout(async function I() {
      await y(N), N.isActive() && (S = setTimeout(I, 2500));
    }, 2500);
    return () => {
      clearTimeout(S), N.dispose();
    };
  }, [a == null ? void 0 : a.id, a == null ? void 0 : a.status, r]), {
    analysisError: c,
    analysisRun: a,
    analysisStatus: l,
    importNativeSegments: p,
    nativeImportState: u,
    startFullAnalysis: b
  };
}
const Tn = Object.freeze([]);
function _d(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Hd({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var $o, Co, To, Ao, Ro;
  const [g, u] = L(null), [f, m] = L([]), p = ge(null), y = ge(null), b = ge([]), N = ge(null), [S, I] = L(() => gt({})), [H, O] = L(!1), [q, A] = L(Rs), [$, T] = L(0), [P, _] = L(null), [U, J] = L(!1), [w, C] = L(""), [G, Q] = L(""), [ie, ce] = L(""), [pe, j] = L(1), [X, ue] = L(nd), [ae, xe] = L(0), [Se, R] = L({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [W, K] = L(Ct), se = ge(Ct), [Z, M] = L(!1), [le, k] = L(!1), [x, v] = L(!1), [h, D] = L(!1), ne = ge(!1), [re, Y] = L(null), [ke, V] = L(null), te = ge(null), [z, E] = L(!1), [oe, ve] = L(""), be = ge(null), he = ge(null), Ae = ge(!1), we = ge([]), fe = ge(!1), [Ne, $e] = L(rd), [Ce, Ee] = L(null), [je, Qe] = L(!1), [Fe, Ie] = L(!1), [_e, He] = L(!1), [Ve, Re] = L(!1), [Te, Ge] = L(!1), [dt, Xe] = L(""), {
    analysisError: Nt,
    analysisRun: ot,
    analysisStatus: At,
    importNativeSegments: qt,
    nativeImportState: br,
    startFullAnalysis: mn
  } = zd(
    e.video.id,
    o,
    l,
    (($o = e.shotBoundaries) == null ? void 0 : $o.length) || 0,
    An(e.shotBoundaries || [])
  ), [Ft, jn] = L(!1), [Wt, Vt] = L(null), [Jt, jt] = L(l), [hr, xt] = L(0), [It, Bn] = L(!1), [gn, St] = L(""), [vr, Yt] = L(null), pn = ge(null), Gn = ge(null), fn = ge(!1), [at, Rt] = L([]), [yn, Bt] = L(!1), [Un, xr] = L(null), Qt = ed(), Zt = ge(null), Kn = ge(null), Xt = ge(null), Sr = ge(s), zn = ge(null), bn = ge(null), Mt = ge(null), en = ge(null), tn = ge(null), ct = ge(null), _n = ge(null), hn = ge(null), Hn = ge(null), vn = ge(null), xn = ge(null), nn = ge(null), kr = ge(-1e12), wr = ge(null), Nr = ge(!1), Sn = ge(null), [pt, kn] = L({ scrollTop: 0, height: 512 });
  ye(() => {
    if (!Ft || It || !gn) return;
    const B = requestAnimationFrame(() => {
      var me;
      return (me = Gn.current) == null ? void 0 : me.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(B);
  }, [Ft, It, gn]), ye(() => {
    if (!fn.current || Ft || Jt) return;
    const B = requestAnimationFrame(() => {
      var me;
      (me = pn.current) == null || me.focus({ preventScroll: !0 }), fn.current = !1;
    });
    return () => cancelAnimationFrame(B);
  }, [Ft, Jt]);
  const Ke = e.video, Je = e.segments || Tn, Ir = Be(() => JSON.stringify({
    segments: Je.map((B) => [
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
    performerSlots: (e.performerSlots || Tn).map((B) => [
      B.segmentId,
      B.slotDefinitionId,
      B.performerId,
      B.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [Je, e.performerSlots, e.itemMetadata]);
  ye(() => {
    if (!l) {
      Vt(null), jt(!1);
      return;
    }
    if (P != null) {
      jt(!0);
      return;
    }
    let B = !0;
    jt(!0);
    const me = setTimeout(() => {
      ee(`/videos/${Ke.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Oe) => {
        B && (Vt(Oe), St(""));
      }).catch((Oe) => {
        B && (Vt(null), St(Oe.message || "Unable to preview derived segments."));
      }).finally(() => {
        B && jt(!1);
      });
    }, 150);
    return () => {
      B = !1, clearTimeout(me);
    };
  }, [l, Ke.id, Ir, hr, P]);
  const $r = () => xt((B) => B + 1), kt = e.segmentGroups || Tn, ut = e.performerSlots || Tn, Cr = l && e.performerSlotsAvailable !== !1, rn = Be(
    () => (e.performerCandidates || []).filter((B) => B.isVideoPerformer),
    [e.performerCandidates]
  ), wn = e.shotBoundaries || Tn, Nn = Be(
    () => ei(ut),
    [ut]
  ), Ye = Be(
    () => Je.map((B) => {
      const me = Nn.get(B.id) || [];
      return {
        ...B,
        slots: me,
        assignment: me.every((Oe) => Oe.performerId == null) ? al(me, rn) : null
      };
    }).filter((B) => B.slots.length > 0 && B.assignment != null),
    [Je, Nn, rn]
  ), qn = Number((Co = Ke.videoFile) == null ? void 0 : Co.frameRate) > 0 ? Number(Ke.videoFile.frameRate) : 30;
  function Wn() {
    v(!1), requestAnimationFrame(() => {
      var B;
      return (B = ct.current) == null ? void 0 : B.focus({ preventScroll: !0 });
    });
  }
  function Tr() {
    P == null && (nn.current = null, D(!1), C(""), requestAnimationFrame(() => {
      var B;
      return (B = ct.current) == null ? void 0 : B.focus({ preventScroll: !0 });
    }));
  }
  function Vn() {
    O(!1), requestAnimationFrame(() => {
      var B, me;
      (B = hn.current) != null && B.isConnected ? hn.current.focus({ preventScroll: !0 }) : (me = ct.current) == null || me.focus({ preventScroll: !0 });
    });
  }
  ye(() => {
    xn.current === g ? (xn.current = null, v(!0)) : v(!1);
  }, [g]), ye(() => {
    var me;
    if (!x) return;
    const B = (me = vn.current) == null ? void 0 : me.querySelector("input");
    B == null || B.focus({ preventScroll: !0 }), B == null || B.select();
  }, [x, g]), ye(() => {
    var Oe, qe, yt;
    const B = zt(
      Or(
        e.segments,
        e.performerSlots || [],
        gt({}),
        l && q,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), me = ((Oe = e.segments.find((sn) => sn.id === s)) == null ? void 0 : Oe.id) ?? ((qe = Ma(B)) == null ? void 0 : qe.id) ?? null;
    u(me), m(me == null ? [] : [me]), y.current = me, b.current = [], Ee(bt(B, me)), I(gt({})), O(!1), nn.current = null, D(!1), j(1), C(""), K(Ct), se.current = Ct, M(!1), (yt = ct.current) == null || yt.focus({ preventScroll: !0 });
  }, [Ke.id, s]), ye(() => {
    const B = new AbortController();
    return ee(`/videos/${Ke.id}/incorrect-examples`, { signal: B.signal }).then(Rt).catch((me) => {
      me.name !== "AbortError" && Rt([]);
    }), () => B.abort();
  }, [Ke.id, d == null ? void 0 : d.effectiveMode]), ye(() => {
    const B = new AbortController();
    return ee(`/videos/${Ke.id}/history`, { signal: B.signal }).then((me) => {
      const Oe = me || Ct;
      se.current = Oe, K(Oe);
    }).catch((me) => {
      me.name !== "AbortError" && C(me.message || "Unable to load editor history.");
    }), () => B.abort();
  }, [Ke.id]), ye(() => {
    ad(X);
  }, [X.timelineRatio, X.markerRailOpen, X.detailWidth, X.markerRailWidth, X.swimlaneTitleWidth]), ye(() => {
    od(Ne);
  }, [Ne]), ye(() => {
    Ms(q);
  }, [q]), ye(() => {
    const B = bn.current;
    if (!a || !B || typeof ResizeObserver > "u") return;
    const me = () => {
      var yt;
      const qe = Math.max(0, B.clientHeight - (((yt = Mt.current) == null ? void 0 : yt.offsetHeight) || 0));
      xe(qe), ue((sn) => {
        const Mo = eo(sn.timelineRatio, qe);
        return Mo === sn.timelineRatio ? sn : { ...sn, timelineRatio: Mo };
      });
    }, Oe = new ResizeObserver(me);
    return Oe.observe(B), Mt.current && Oe.observe(Mt.current), me(), () => Oe.disconnect();
  }, [a]), ye(() => {
    if (!Qt || typeof ResizeObserver > "u") return;
    const B = tn.current, me = en.current;
    if (!B || !me) return;
    const Oe = () => R({
      workspace: B.clientWidth,
      focusRow: me.clientWidth,
      focusRowHeight: me.clientHeight
    }), qe = new ResizeObserver(Oe);
    return qe.observe(B), qe.observe(me), Oe(), () => qe.disconnect();
  }, [Qt, X.markerRailOpen]);
  const it = Be(
    () => ea(
      Or(
        Je,
        ut,
        S,
        l && q,
        kt
      ),
      at,
      !0
    ),
    [
      Je,
      ut,
      S,
      q,
      kt,
      l,
      at
    ]
  ), Ar = Object.fromEntries(nt.map((B) => [B, it.filter((me) => me.reviewState === B).length])), Jn = ea(
    Or(
      Je,
      ut,
      { ...S, reviewStates: nt },
      l && q,
      kt
    ),
    at,
    !0
  ), Yn = Object.fromEntries(nt.map((B) => [B, Jn.filter((me) => me.reviewState === B).length])), In = [...new Set(Je.map((B) => B.sourceKey).filter(Boolean))].sort((B, me) => vt(B).localeCompare(vt(me))), $n = bs(
    S,
    l && q
  ), ze = Be(
    () => zt(it, kt, ut),
    [it, kt, ut]
  ), de = xs(
    ze,
    g,
    s
  ), ft = As(it, f), Qn = !l && ft.length > 0 && ft.every((B) => B.nativeSegmentId != null), Zn = it.map((B) => B.id), Rr = Zn.join("|");
  p.current = (de == null ? void 0 : de.id) ?? null;
  const Xn = Nn.get(de == null ? void 0 : de.id) || [], on = io(Xn), Gt = Be(
    () => jl(ze, f),
    [ze, f]
  ), F = Be(() => so(ze), [ze]), De = Be(
    () => Ll(F, Ne),
    [F, Ne]
  ), et = Be(
    () => ti(
      De.rows,
      pt.scrollTop,
      pt.height
    ),
    [De, pt]
  ), Ze = Be(
    () => Gl(ze, Ne),
    [ze, Ne]
  ), Et = sr(Ze, de == null ? void 0 : de.id, -1, !0) != null, $t = sr(Ze, de == null ? void 0 : de.id, 1, !0) != null, Dt = de ? bt(ze, de.id) : null, Mr = kt.length > 0 ? F.map((B) => B.key) : [], ui = Mr.join("|"), er = Math.max(
    0,
    Number((To = Ke.videoFile) == null ? void 0 : To.duration) || 0,
    ...Je.map((B) => Number(B.endSec ?? B.startSec) || 0)
  ), uo = Number((Ao = Ke.videoFile) == null ? void 0 : Ao.duration) > 0 ? Number(Ke.videoFile.duration) : null;
  W.actions;
  const mi = Ba();
  ye(() => {
    const B = g === dr ? g : (de == null ? void 0 : de.id) ?? null;
    B !== g && u(B);
  }, [de, g]), ye(() => {
    m((B) => {
      const me = Ns(
        B,
        Zn,
        (de == null ? void 0 : de.id) ?? null
      );
      return me.length === B.length && me.every((Oe, qe) => Oe === B[qe]) ? B : me;
    });
  }, [Rr, de == null ? void 0 : de.id]);
  const an = (de == null ? void 0 : de.itemId) == null ? null : ((Ro = e.itemMetadata) == null ? void 0 : Ro[de.itemId]) || null, gi = {
    key: (de == null ? void 0 : de.itemId) != null ? `item:${de.itemId}` : (de == null ? void 0 : de.nativeSegmentId) != null ? `native:${de.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (an == null ? void 0 : an.provenance) || (de == null ? void 0 : de.fieldProvenance) || [] : []
  }, Er = (de == null ? void 0 : de.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (an == null ? void 0 : an.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  ye(() => {
    Q(de == null ? "" : String(de.startSec)), ce((de == null ? void 0 : de.endSec) == null ? "" : String(de.endSec));
  }, [de == null ? void 0 : de.id, de == null ? void 0 : de.startSec, de == null ? void 0 : de.endSec]), ye(() => {
    Dt && $e((B) => oi(B, Dt));
  }, [Ke.id, s, Dt]), ye(() => {
    Ee((B) => _l(Mr, B, Dt));
  }, [Ke.id, ui, Dt]), ye(() => {
    if (!X.markerRailOpen || (de == null ? void 0 : de.id) == null) return;
    const B = Sn.current, me = De.rows.find((yt) => yt.kind === "segment" && yt.segment.id === de.id);
    if (!B || !me) return;
    const Oe = me.top + me.height;
    let qe = B.scrollTop;
    me.top < B.scrollTop ? qe = me.top : Oe > B.scrollTop + B.clientHeight && (qe = Math.max(0, Oe - B.clientHeight)), qe !== B.scrollTop && (B.scrollTop = qe), kn({ scrollTop: qe, height: B.clientHeight });
  }, [de == null ? void 0 : de.id, De, X.markerRailOpen]), ye(() => {
    const B = Sn.current;
    if (!X.markerRailOpen || !B) return;
    const me = () => kn({
      scrollTop: B.scrollTop,
      height: B.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      me();
      return;
    }
    const Oe = new ResizeObserver(me);
    return Oe.observe(B), me(), () => Oe.disconnect();
  }, [X.markerRailOpen]);
  const { revealSegmentGroupForSelection: mo, replaceSegmentSelection: pi, selectSegment: go, selectSegmentCollection: fi, selectAllVideoSegments: yi } = jd({
    allSwimlanes: ze,
    editorRef: ct,
    performerSlots: ut,
    seekRef: Zt,
    segmentGroups: kt,
    segments: Je,
    selectedSegmentId: g,
    selectedSegmentIds: f,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: b,
    setCollapsedSegmentGroups: $e,
    setEditorFilters: I,
    setHideDerivedSegments: A,
    setSaveMessage: C,
    setSelectedSegmentGroupKey: Ee,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m
  }), { acceptHistory: Dr, recordHistoryAction: tr, mutateSegment: bi, completeReview: hi, createSegment: po, splitSegment: fo, duplicateSegment: yo, saveTiming: vi, applyShortcutTiming: xi } = Xl({
    compatibilityMode: l,
    currentTime: $,
    detail: e,
    editorFilters: S,
    endInput: ie,
    hideDerivedSegments: q,
    historyRef: se,
    mediaDuration: uo,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: kr,
    pendingDuplicateRef: wr,
    pendingFirstSegmentStartSecRef: nn,
    pendingTagEditSegmentIdRef: xn,
    replaceSegmentSelection: pi,
    savingSegmentId: P,
    segments: Je,
    selectedSegment: de,
    selectedSegmentIdRef: p,
    selectedSegments: ft,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: b,
    setEditorFilters: I,
    setFirstSegmentTagOpen: D,
    setHideDerivedSegments: A,
    setHistory: K,
    setHistoryOpen: M,
    setPublishApprovedError: ve,
    setSaveMessage: C,
    setSavingSegmentId: _,
    setSelectedSegmentGroupKey: Ee,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    startInput: G,
    timelineDuration: er,
    video: Ke
  });
  function bo(B = null) {
    var qe;
    if (!l || P != null || !Je.some((yt) => !yt.published && yt.reviewState === "approved")) return;
    const me = ((qe = ct.current) == null ? void 0 : qe.ownerDocument) ?? document, Oe = me.activeElement === me.body ? null : me.activeElement;
    he.current = B != null && B.isConnected && B !== me.body ? B : Oe, ve(""), E(!0);
  }
  function ho() {
    P == null && (E(!1), ve(""), requestAnimationFrame(() => {
      _d(
        he.current,
        ct.current
      ), he.current = null;
    }));
  }
  async function Si() {
    await hi() && ho();
  }
  const { closeMergeConfirmation: ki, mergeSelectedSwimlane: vo, saveSelectedReviewState: xo } = Bd({
    acceptHistory: Dr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: N,
    historyRef: se,
    mergeSavingRef: ne,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    pendingReviewStateRef: we,
    recordHistoryAction: tr,
    revealSegmentGroupForSelection: mo,
    reviewSavingRef: Ae,
    savingSegmentId: P,
    selectedGroups: Gt,
    selectedSegment: de,
    selectedSegmentIdRef: p,
    selectedSegments: ft,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: b,
    setMergeConfirmation: Y,
    setSaveMessage: C,
    setSavingSegmentId: _,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: Ke
  }), wi = (B) => {
    we.current = Ks(
      we.current,
      B
    );
  };
  ye(() => {
    if (P != null || Ae.current) return;
    let B = !1;
    for (; we.current.length > 0; ) {
      const me = we.current.shift(), Oe = Gs(me, Je);
      if (!Oe) {
        B = !0;
        continue;
      }
      xo(
        Oe.requestedState,
        Oe.selectedSegments,
        Oe.selectedSegment
      );
      return;
    }
    B && C("The queued review could not find its segment after refreshing.");
  }, [P, Je]);
  const { toggleIncorrectExample: Ni, removeIncorrectExample: Ii, captureTrainingExport: $i, deleteRejectedSegments: So, autoAssignPerformers: Ci, previewDerivedSegments: Ti, closeMaterializeDialog: Ai, materializeDerivedSegments: Ri, saveTag: Mi, moveToBin: Ei, emptyRecyclingBin: Di } = Gd({
    acceptHistory: Dr,
    allSwimlanes: ze,
    autoAssignCandidates: Ye,
    autoAssigning: Te,
    binEmptyingRef: fe,
    canMoveSelectionToBin: Qn,
    closeTagEditing: Wn,
    compatibilityMode: l,
    detail: e,
    editorRef: ct,
    exportingExamples: yn,
    incorrectExamples: at,
    lineage: Er,
    materializeButtonRef: pn,
    materializePreview: Wt,
    materializeRestoreFocusRef: fn,
    materializing: It,
    mutateSegment: bi,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: tr,
    refreshMaterializationPreview: $r,
    removingExampleId: Un,
    revealSegmentGroupForSelection: mo,
    savingSegmentId: P,
    segments: Je,
    selectedSegment: de,
    selectedSegmentIdRef: p,
    selectedSegments: ft,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: b,
    setAutoAssignError: Xe,
    setAutoAssignOpen: Re,
    setAutoAssigning: Ge,
    setExportingExamples: Bt,
    setIncorrectExamples: Rt,
    setMaterializeError: St,
    setMaterializeLoading: jt,
    setMaterializeOpen: jn,
    setMaterializePreview: Vt,
    setMaterializing: Bn,
    setRemovingExampleId: xr,
    setRejectedDeletionPreview: V,
    setSaveMessage: C,
    setSavingSegmentId: _,
    setSelectedSegmentGroupKey: Ee,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: Ke
  }), { restoreHistoryTarget: Oi, updateTimelineRatio: ko, handleSeparatorPointerDown: Pi, handleSeparatorPointerMove: Li, handleSeparatorKeyDown: Fi, panelWidthMaximum: wo, panelSeparatorProps: ji, toggleSegmentRail: Bi, toggleSegmentGroup: No, mutateShotBoundary: Gi } = Ud({
    acceptHistory: Dr,
    compatibilityMode: l,
    currentTime: $,
    detail: e,
    editorLayout: X,
    focusRowRef: en,
    history: W,
    historyRef: se,
    historySaving: le,
    horizontalLayoutSize: Se,
    mediaStackHeight: ae,
    mediaStackRef: bn,
    commonActionsRef: Mt,
    onDetailChange: t,
    onReload: o,
    railToggleRef: _n,
    recordHistoryAction: tr,
    savingSegmentId: P,
    savingShot: U,
    savingShotRef: Nr,
    setCollapsedSegmentGroups: $e,
    setEditorLayout: ue,
    setHistorySaving: k,
    setIncorrectExamples: Rt,
    setSaveMessage: C,
    setSavingSegmentId: _,
    setSavingShot: J,
    shotBoundaries: wn,
    timelineDuration: er,
    video: Ke,
    workspaceRef: tn
  }), { executeShortcutById: Io, stepVideoFrame: Ui } = Kd({
    allSwimlanes: ze,
    applyShortcutTiming: xi,
    centerTimelineRef: zn,
    compatibilityMode: l,
    createSegment: po,
    currentTime: $,
    deleteRejectedSegments: So,
    duplicateSegment: yo,
    editorLayout: X,
    editorRef: ct,
    emptyRecyclingBin: Di,
    lineage: Er,
    mediaDuration: uo,
    mergeSelectedSwimlane: vo,
    moveToBin: Ei,
    mutateShotBoundary: Gi,
    openPublishApprovedDialog: bo,
    playbackControlsRef: Kn,
    playbackShortcutConfig: mi,
    saveSelectedReviewState: xo,
    seekRef: Zt,
    segmentGroupKeys: Mr,
    selectSegment: go,
    selectedSegment: de,
    selectedSegmentGroupForSegment: Dt,
    selectedSegmentGroupKey: Ce,
    selectedSegments: ft,
    setCollapsedSegmentGroups: $e,
    setIncorrectExamplesOpen: He,
    setQuickSearchOpen: Ie,
    setSaveMessage: C,
    setSelectedSegmentGroupKey: Ee,
    setTagEditing: v,
    setTimelineZoom: j,
    shotBoundaries: wn,
    slotButtonRef: Hn,
    splitSegment: fo,
    swimlanes: Ze,
    timelineDuration: er,
    toggleIncorrectExample: Ni,
    toggleSegmentGroup: No,
    updateTimelineRatio: ko,
    videoFrameRate: qn,
    visibleSegments: it
  });
  Xt.current = Io;
  const Ki = Be(() => Ln.map((B) => ({
    id: B.id,
    enabled: cn(B, l),
    surface: "local",
    action: (me) => {
      var Oe;
      return (Oe = Xt.current) == null ? void 0 : Oe.call(Xt, B.id, me);
    }
  })), [l]);
  va(Qr, Ki);
  const zi = Xr(ae), _i = Kt(X.markerRailWidth, wo("markerRailWidth")), Hi = Kt(X.detailWidth, wo("detailWidth"));
  return n(Fd, {
    activeFilterCount: $n,
    allSwimlanes: ze,
    analysisError: Nt,
    analysisRun: ot,
    analysisStatus: At,
    approvalFacetCounts: Yn,
    autoAssignCandidates: Ye,
    autoAssignError: dt,
    autoAssignOpen: Ve,
    autoAssignPerformers: Ci,
    autoAssigning: Te,
    canMoveSelectionToBin: Qn,
    captureTrainingExport: $i,
    cancelQueuedReviewsForSegments: wi,
    removeIncorrectExample: Ii,
    rejectedDeletionPreview: ke,
    centerTimelineRef: zn,
    closeEditorFilters: Vn,
    closeFirstSegmentTagDialog: Tr,
    closeMaterializeDialog: Ai,
    closeMergeConfirmation: ki,
    closePublishApprovedDialog: ho,
    closeTagEditing: Wn,
    collapsedSegmentGroups: Ne,
    commonActionsRef: Mt,
    compatibilityMode: l,
    configuringTag: vr,
    createSegment: po,
    currentTime: $,
    deleteRejectedSegments: So,
    detail: e,
    detailPanelRef: N,
    detailWidth: Hi,
    duplicateSegment: yo,
    editorFilters: S,
    editorLayout: X,
    editorRef: ct,
    exportingExamples: yn,
    filtersButtonRef: hn,
    filtersOpen: H,
    firstSegmentTagOpen: h,
    focusRowRef: en,
    handleSeparatorKeyDown: Fi,
    handleSeparatorPointerDown: Pi,
    handleSeparatorPointerMove: Li,
    hideDerivedSegments: q,
    history: W,
    historyOpen: Z,
    historySaving: le,
    hasNextUnreviewed: $t,
    hasPreviousUnreviewed: Et,
    horizontalLayoutSize: Se,
    importNativeSegments: qt,
    incorrectExamples: at,
    incorrectExamplesOpen: _e,
    removingExampleId: Un,
    lineage: Er,
    markerRailWidth: _i,
    materializeButtonRef: pn,
    materializeCancelButtonRef: Gn,
    materializeDerivedSegments: Ri,
    materializeError: gn,
    materializeLoading: Jt,
    materializeOpen: Ft,
    materializePreview: Wt,
    materializing: It,
    mediaStackRef: bn,
    mergeCancelButtonRef: te,
    mergeConfirmation: re,
    mergeSavingRef: ne,
    mergeSelectedSwimlane: vo,
    nativeImportState: br,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: bo,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: ji,
    pendingInitialSeekRef: Sr,
    performerSlots: ut,
    performerSlotsAvailable: Cr,
    playbackControlsRef: Kn,
    previewDerivedSegments: Ti,
    provenance: gi,
    provenanceSources: In,
    publishApprovedCancelButtonRef: be,
    publishApprovedDrafts: Si,
    publishApprovedError: oe,
    publishApprovedOpen: z,
    quickSearchOpen: Fe,
    railScrollRef: Sn,
    railToggleRef: _n,
    recordHistoryAction: tr,
    restoreHistoryTarget: Oi,
    runEditorAction: Io,
    stepVideoFrame: Ui,
    saveMessage: w,
    setSaveMessage: C,
    saveTag: Mi,
    saveTiming: vi,
    savingSegmentId: P,
    setSavingSegmentId: _,
    seekRef: Zt,
    segmentGroups: kt,
    segmentRailLayout: De,
    segments: Je,
    selectAllVideoSegments: yi,
    selectSegment: go,
    selectSegmentCollection: fi,
    selectedGroups: Gt,
    selectedPerformerSlots: Xn,
    selectedSegment: de,
    selectedSegmentGroupKey: Ce,
    selectedSegmentIds: f,
    selectedSegments: ft,
    selectedSlotStatus: on,
    setAutoAssignError: Xe,
    setAutoAssignOpen: Re,
    setConfiguringTag: Yt,
    setCurrentTime: T,
    setEditorFilters: I,
    setEditorLayout: ue,
    setFiltersOpen: O,
    setHideDerivedSegments: A,
    setHistoryOpen: M,
    setIncorrectExamplesOpen: He,
    setQuickSearchOpen: Ie,
    setRejectedDeletionPreview: V,
    setRailViewport: kn,
    setSelectedSegmentGroupKey: Ee,
    setSelectedSegmentId: u,
    setShortcutsOpen: Qe,
    setTimelineZoom: j,
    shotBoundaries: wn,
    shortcutsOpen: je,
    slotButtonRef: Hn,
    splitLayout: a,
    splitSegment: fo,
    startFullAnalysis: mn,
    tagEditing: x,
    tagSearchRef: vn,
    timelineDuration: er,
    timelineRatioBounds: zi,
    timelineZoom: pe,
    toggleSegmentGroup: No,
    toggleSegmentRail: Bi,
    updateTimelineRatio: ko,
    video: Ke,
    videoPerformers: rn,
    visibleCounts: Ar,
    visibleSegmentRailRows: et,
    visibleSegments: it,
    wideLayout: Qt,
    workspaceRef: tn
  });
}
const qd = /* @__PURE__ */ new Set(["queued", "running"]);
async function ca(e, t, r = 4) {
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
function ua(e, t) {
  return { videoId: e, error: (t == null ? void 0 : t.message) || String(t || "Unable to start Full Scan.") };
}
function Wd() {
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
async function Vd(e, t, r, o) {
  const i = [...new Set(e.map(Number).filter((m) => Number.isInteger(m) && m > 0))], a = [...new Set(t)].filter((m) => ["aiTagging", "omnishotcut"].includes(m));
  if (i.length === 0 || a.length === 0)
    return { queuedIds: [], failed: [], cancelled: !1 };
  const s = a.includes("omnishotcut"), l = await ca(i, async (m) => {
    try {
      const [p, y] = await Promise.all([
        r(`/videos/${m}/analysis-runs`),
        s ? r(`/videos/${m}/editor`) : null
      ]);
      if ((p || []).some((N) => qd.has(N == null ? void 0 : N.status)))
        throw new Error("A Full Scan is already queued or running.");
      const b = (y == null ? void 0 : y.shotBoundaries) || [];
      return { videoId: m, shotBoundaries: b };
    } catch (p) {
      return ua(m, p);
    }
  }), d = l.filter((m) => !m.error), c = l.filter((m) => m.error), g = d.filter((m) => m.shotBoundaries.length > 0), u = g.reduce((m, p) => m + p.shotBoundaries.length, 0);
  if (u > 0 && !o(
    `Replace ${u} existing shot ${u === 1 ? "boundary" : "boundaries"} across ${g.length} selected ${g.length === 1 ? "video" : "videos"} when these scans succeed? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
  )) return { queuedIds: [], failed: c, cancelled: !0 };
  const f = await ca(d, async ({ videoId: m, shotBoundaries: p }) => {
    const y = s && p.length > 0;
    try {
      return await r(`/videos/${m}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: a,
          replaceShotBoundaries: y,
          expectedShotBoundaryFingerprint: y ? An(p) : null
        })
      }), { videoId: m };
    } catch (b) {
      return ua(m, b);
    }
  });
  return {
    queuedIds: f.filter((m) => !m.error).map((m) => m.videoId),
    failed: [...c, ...f.filter((m) => m.error)],
    cancelled: !1
  };
}
function Jd(e = [], t = []) {
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
function Yd(e = [], t = "", r = "all") {
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
function tt(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function Qd(e = [], t = []) {
  var m;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((p, y) => (p.sortOrder ?? 0) - (y.sortOrder ?? 0) || Number(p.id) - Number(y.id)).forEach((p, y) => {
    [...p.tags || []].sort((b, N) => (b.sortOrder ?? 0) - (N.sortOrder ?? 0) || Number(b.tagId) - Number(N.tagId)).forEach((b, N) => r.set(Number(b.tagId), {
      key: `group:${p.id}`,
      id: p.id,
      name: p.name,
      sortOrder: p.sortOrder ?? y,
      tagSortOrder: b.sortOrder ?? N
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(p, y) {
    const b = Number(p);
    if (!o.has(b)) {
      const N = r.get(b);
      o.set(b, {
        tagId: b,
        name: y || `Tag ${b}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (N == null ? void 0 : N.key) || "ungrouped",
        segmentGroupId: (N == null ? void 0 : N.id) ?? null,
        segmentGroupName: (N == null ? void 0 : N.name) || "Ungrouped",
        segmentGroupSortOrder: (N == null ? void 0 : N.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (N == null ? void 0 : N.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(b);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((p) => {
    const y = i(p.sourceTagId, p.sourceTagName), b = i(p.derivedTagId, p.derivedTagName);
    y.outgoingRuleCount++, b.incomingRuleCount++;
    const N = `${y.tagId}:${b.tagId}`;
    a.has(N) || a.set(N, {
      id: N,
      sourceTagId: y.tagId,
      derivedTagId: b.tagId,
      rules: [],
      edgeCount: 0
    });
    const S = a.get(N);
    S.rules.push(p), S.edgeCount += Number(p.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((p) => [p.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((p) => {
    var y, b;
    (y = d.get(p.sourceTagId)) == null || y.add(p.derivedTagId), (b = d.get(p.derivedTagId)) == null || b.add(p.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), g = [];
  for (const p of s) {
    if (c.has(p.tagId)) continue;
    const y = [p.tagId], b = [];
    for (c.add(p.tagId); y.length > 0; ) {
      const A = y.shift();
      b.push(A);
      for (const $ of d.get(A) || [])
        c.has($) || (c.add($), y.push($));
    }
    const N = new Set(b), S = b.map((A) => o.get(A)), I = l.filter((A) => N.has(A.sourceTagId) && N.has(A.derivedTagId)), H = I.flatMap((A) => A.rules), O = S.filter((A) => A.outgoingRuleCount === 0).sort((A, $) => tt(A.name, $.name)), q = O.length > 0 ? O : [...S].sort((A, $) => tt(A.name, $.name));
    g.push({
      id: [...b].sort((A, $) => A - $).join(":"),
      label: q.length > 1 ? `${q[0].name} + ${q.length - 1}` : ((m = q[0]) == null ? void 0 : m.name) || "Derivation component",
      nodes: S,
      connections: I,
      rules: H,
      segmentGroupKeys: [...new Set(S.map((A) => A.segmentGroupKey))],
      materializedEdgeCount: H.reduce(
        (A, $) => A + (Number($.edgeCount) || 0),
        0
      )
    });
  }
  g.sort((p, y) => y.rules.length - p.rules.length || tt(p.label, y.label));
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
    p.nodes.forEach((y) => {
      var b;
      return (b = u.get(y.segmentGroupKey)) == null ? void 0 : b.componentIds.add(p.id);
    }), p.rules.forEach((y) => {
      var b, N;
      (b = u.get(o.get(Number(y.sourceTagId)).segmentGroupKey)) == null || b.ruleIds.add(y.id), (N = u.get(o.get(Number(y.derivedTagId)).segmentGroupKey)) == null || N.ruleIds.add(y.id);
    });
  });
  const f = [...u.values()].sort((p, y) => p.sortOrder - y.sortOrder || tt(p.name, y.name)).map((p) => ({
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
function Zd(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const g = new Map(e.nodes.map((T) => [T.tagId, /* @__PURE__ */ new Set()])), u = new Map(e.nodes.map((T) => [T.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((T) => {
    var P, _;
    (P = g.get(T.sourceTagId)) == null || P.add(T.derivedTagId), (_ = u.get(T.derivedTagId)) == null || _.add(T.sourceTagId);
  });
  const f = new Map(e.nodes.map((T) => {
    var P;
    return [
      T.tagId,
      ((P = u.get(T.tagId)) == null ? void 0 : P.size) || 0
    ];
  })), m = new Map(e.nodes.map((T) => [T.tagId, 0])), p = e.nodes.filter((T) => f.get(T.tagId) === 0).sort((T, P) => tt(T.name, P.name)).map((T) => T.tagId), y = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const T = p.shift();
    if (!y.has(T)) {
      y.add(T);
      for (const P of g.get(T) || [])
        m.set(P, Math.max(m.get(P) || 0, (m.get(T) || 0) + 1)), f.set(P, f.get(P) - 1), f.get(P) === 0 && p.push(P);
    }
  }
  y.size !== e.nodes.length && e.nodes.filter((T) => !y.has(T.tagId)).sort((T, P) => tt(T.name, P.name)).forEach((T) => m.set(T.tagId, 0));
  const b = Math.max(0, ...m.values()), N = Math.max(
    t,
    240 + b * 296
  ), S = /* @__PURE__ */ new Map();
  e.nodes.forEach((T) => {
    S.has(T.segmentGroupKey) || S.set(T.segmentGroupKey, {
      key: T.segmentGroupKey,
      id: T.segmentGroupId,
      name: T.segmentGroupName,
      sortOrder: T.segmentGroupSortOrder,
      nodes: []
    }), S.get(T.segmentGroupKey).nodes.push(T);
  });
  const I = [...S.values()].sort((T, P) => T.sortOrder - P.sortOrder || tt(T.name, P.name));
  let H = 28;
  const O = [], q = I.map((T) => {
    const P = /* @__PURE__ */ new Map();
    T.nodes.forEach((C) => {
      const G = m.get(C.tagId) || 0;
      P.has(G) || P.set(G, []), P.get(G).push(C);
    });
    for (const C of P.values())
      C.sort((G, Q) => G.segmentGroupTagSortOrder - Q.segmentGroupTagSortOrder || tt(G.name, Q.name));
    const _ = Math.max(1, ...[...P.values()].map((C) => C.length)), U = _ * 58 + (_ - 1) * 18, J = 70 + U, w = {
      ...T,
      x: 12,
      y: H,
      width: N - 24,
      height: J
    };
    for (const [C, G] of P.entries()) {
      const Q = G.length * 58 + Math.max(0, G.length - 1) * 18, ie = (U - Q) / 2;
      G.forEach((ce, pe) => O.push({
        ...ce,
        rank: C,
        x: 28 + C * 296,
        y: H + 34 + 18 + ie + pe * 76,
        width: 184,
        height: 58
      }));
    }
    return H += J + 16, w;
  }), A = new Map(O.map((T) => [T.tagId, T])), $ = e.connections.map((T) => {
    const P = A.get(T.sourceTagId), _ = A.get(T.derivedTagId), U = P.x + P.width, J = P.y + P.height / 2, w = _.x, C = _.y + _.height / 2, G = Math.max(48, (w - U) * 0.48);
    return {
      ...T,
      path: `M ${U} ${J} C ${U + G} ${J}, ${w - G} ${C}, ${w} ${C}`
    };
  });
  return {
    width: N,
    height: Math.max(r, H - 16 + 28),
    nodes: O,
    connections: $,
    groups: q
  };
}
function Xd(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Zd(d, {
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
      const y = m.get(p.sourceTagId), b = m.get(p.derivedTagId), N = y.x + y.width, S = y.y + y.height / 2, I = b.x, H = b.y + b.height / 2, O = Math.max(48, (I - N) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${N} ${S} C ${N + O} ${S}, ${I - O} ${H}, ${I} ${H}`
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
function ma(e, t = []) {
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
function ec(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function tc(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: u, emptyDraft: f, graph: m, layout: p, listSort: y, materializationOffer: b, materializeOutgoingRules: N, materializeRule: S, message: I, normalizedQuery: H, query: O, refreshConfiguredTag: q, revealEditor: A, rules: $, save: T, segmentGroupKey: P, selectedNode: _, selectedRule: U, selection: J, setConfiguringTag: w, setDraft: C, setListSort: G, setMaterializationOffer: Q, setQuery: ie, setSegmentGroupKey: ce, setSelection: pe, setView: j, sortedVisibleRules: X, sourceSlots: ue, sourceSlotsLoading: ae, updateMapping: xe, updateTag: Se, view: R, visibleComponents: W, visibleRules: K } = e;
  function se(x) {
    const v = m.nodes.find((D) => D.tagId === Number(x.sourceTagId)), h = m.nodes.find((D) => D.tagId === Number(x.derivedTagId));
    return (v == null ? void 0 : v.segmentGroupKey) === (h == null ? void 0 : h.segmentGroupKey) ? v.segmentGroupKey : "cross-group";
  }
  function Z() {
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
          onClick: () => C(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      n("div", { key: "tags", className: "space-y-3" }, [
        n("div", { key: "source", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Source tag (specific)"),
            n(Mn, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (x, v) => Se("source", x, v == null ? void 0 : v.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !ae && ue.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (x) => w({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: x.currentTarget
              }),
              className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
            }, "Configure source tag")
          ]) : null
        ]),
        n("div", { key: "derived", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Derived tag (general)"),
            n(Mn, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (x, v) => Se("derived", x, v == null ? void 0 : v.label),
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
              onClick: (x) => w({
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
            disabled: r || ue.length === 0 || s.length === 0,
            onClick: () => C((x) => ({
              ...x,
              slotMappings: [...x.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
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
          ...d.slotMappings.map((x, v) => n("div", { key: v, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: x.sourceSlotDefinitionId,
              disabled: r,
              onChange: (h) => xe(v, "sourceSlotDefinitionId", h.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${v + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...ue.map((h) => n("option", { key: h.id, value: h.id }, rt(h)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: x.derivedSlotDefinitionId,
              disabled: r,
              onChange: (h) => xe(v, "derivedSlotDefinitionId", h.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${v + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((h) => n("option", { key: h.id, value: h.id }, rt(h)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => C((h) => ({
                ...h,
                slotMappings: h.slotMappings.filter((D, ne) => ne !== v)
              })),
              className: `${o} shrink-0 text-red-300`,
              "aria-label": `Remove performer slot mapping ${v + 1}`,
              title: "Remove mapping"
            }, "🗑")
          ]))
        ])
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "save",
          type: "button",
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((x) => !x.sourceSlotDefinitionId || !x.derivedSlotDefinitionId),
          onClick: T,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => C(null), className: o }, "Cancel")
      ])
    ]);
  }
  function M() {
    if (_) {
      const h = K.filter((re) => Number(re.derivedTagId) === _.tagId), D = K.filter((re) => Number(re.sourceTagId) === _.tagId), ne = (re, Y, ke) => n("div", {
        key: re.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, Y),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${re.sourceTagName} → ${re.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          ke ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => S(re),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => g(re, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(re),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, _.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, _.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${_.incomingRuleCount} incoming · ${_.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (re) => w({
            tagId: _.tagId,
            tagName: _.name,
            trigger: re.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        D.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => N(_, D),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${D.length})`) : null,
        D.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...D.map((re) => ne(re, "Derives", !0))
        ]) : null,
        h.length ? n("details", {
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
              h.length
            )
          ]),
          n(
            "div",
            { key: "rules", className: "space-y-2 border-t border-border p-2" },
            h.map((re) => ne(re, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!U)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const x = m.nodes.find((h) => h.tagId === Number(U.sourceTagId)), v = m.nodes.find((h) => h.tagId === Number(U.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (x == null ? void 0 : x.segmentGroupName) || "Ungrouped"),
          (x == null ? void 0 : x.segmentGroupKey) !== (v == null ? void 0 : v.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(v == null ? void 0 : v.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${U.sourceTagName} → ${U.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${U.edgeCount} materialized lineage edge${U.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (b == null ? void 0 : b.ruleId) === U.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
        n(
          "p",
          { key: "summary", className: "text-sm font-medium text-foreground" },
          `${b.createCount + b.linkCount} pending derivation${b.createCount + b.linkCount === 1 ? "" : "s"}`
        ),
        n(
          "p",
          { key: "details", className: "text-xs text-secondary" },
          `${b.createCount} new segments · ${b.linkCount} existing segments to link`
        ),
        n("div", { key: "actions", className: "flex gap-2" }, [
          n("button", {
            key: "materialize",
            type: "button",
            disabled: r,
            onClick: () => S(U, b),
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
        U.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : U.slotMappings.map((h, D) => n("div", {
          key: `${h.sourceSlotDefinitionId}:${h.derivedSlotDefinitionId}`,
          className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
        }, [
          n(
            "span",
            { key: "source", className: "truncate text-foreground", title: h.sourceSlotLabel || "Unnamed slot" },
            h.sourceSlotLabel || "Unnamed slot"
          ),
          n("span", { key: "arrow", className: "text-secondary" }, "→"),
          n(
            "span",
            { key: "derived", className: "truncate text-foreground", title: h.derivedSlotLabel || "Unnamed slot" },
            h.derivedSlotLabel || "Unnamed slot"
          )
        ]))
      ]),
      n("dl", { key: "metadata", className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-xs" }, [
        n("dt", { key: "created-label", className: "text-secondary" }, "Created"),
        n(
          "dd",
          { key: "created", className: "text-right text-foreground" },
          U.createdAt ? new Date(U.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          U.updatedAt ? new Date(U.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => S(U),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(U),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(U),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function le() {
    if (W.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, H ? "No derivation relationships match your search." : "No derivation rules.");
    const x = _ == null ? void 0 : _.tagId, v = /* @__PURE__ */ new Set();
    return _ && (v.add(_.tagId), p.connections.forEach((h) => {
      (h.sourceTagId === _.tagId || h.derivedTagId === _.tagId) && (v.add(h.sourceTagId), v.add(h.derivedTagId));
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
        ...p.groups.map((h) => n("div", {
          key: `group:${h.componentId}:${h.key}`,
          className: `absolute rounded-xl border ${P === h.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
          style: {
            left: `${h.x}px`,
            top: `${h.y}px`,
            width: `${h.width}px`,
            height: `${h.height}px`
          }
        }, n("div", {
          className: "absolute left-3 top-2 max-w-[16rem] truncate text-[11px] font-semibold uppercase tracking-wide text-secondary",
          title: h.name
        }, h.name))),
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
          ...p.connections.map((h) => {
            const D = x === h.sourceTagId || x === h.derivedTagId, ne = _ != null, re = D ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${h.id}:visible`,
              d: h.path,
              fill: "none",
              stroke: re,
              strokeWidth: D ? 2.5 : 1.5,
              opacity: ne && !D ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((h) => {
          const D = !H || h.name.toLocaleLowerCase().includes(H), ne = _ != null, re = v.has(h.tagId), Y = (_ == null ? void 0 : _.tagId) === h.tagId;
          return n("button", {
            key: `node:${h.tagId}`,
            type: "button",
            onClick: () => pe({ type: "node", id: h.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${Y ? "border-accent bg-accent/15 ring-2 ring-accent/25" : re ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${h.x}px`,
              top: `${h.y}px`,
              width: `${h.width}px`,
              height: `${h.height}px`,
              opacity: !D || ne && !re ? 0.62 : 1
            },
            title: `${h.name} — ${h.segmentGroupName}`,
            "aria-label": `${h.name}, ${h.incomingRuleCount} incoming and ${h.outgoingRuleCount} outgoing derivation rules`
          }, [
            n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground" }, h.name),
            n("span", { key: "counts", className: "mt-1 flex items-center gap-2 text-[11px] text-secondary" }, [
              n("span", { key: "in" }, `${h.incomingRuleCount} in`),
              n("span", { key: "arrow", "aria-hidden": "true" }, "→"),
              n("span", { key: "out" }, `${h.outgoingRuleCount} out`)
            ])
          ]);
        }),
        ...p.connections.filter((h) => h.rules.length > 1).map((h) => {
          const D = p.nodes.find((re) => re.tagId === h.sourceTagId), ne = p.nodes.find((re) => re.tagId === h.derivedTagId);
          return n("div", {
            key: `bundle:${h.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(D.x + D.width + ne.x) / 2 - 24}px`,
              top: `${(D.y + D.height / 2 + ne.y + ne.height / 2) / 2 - 10}px`
            },
            "aria-label": `${h.rules.length} rules connect ${h.rules[0].sourceTagName} to ${h.rules[0].derivedTagName}`
          }, `${h.rules.length} rules`);
        })
      ])
    ]);
  }
  function k() {
    if (W.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        H ? "No derivation relationships match your search." : "No derivation rules."
      );
    const x = /* @__PURE__ */ new Map();
    X.forEach((h) => {
      const D = se(h);
      x.has(D) || x.set(D, []), x.get(D).push(h);
    });
    const v = [
      ...m.segmentGroups.map((h) => h.key),
      "cross-group"
    ].filter((h) => x.has(h));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, v.map((h) => {
      const D = m.segmentGroups.find((Y) => Y.key === h), ne = h === "cross-group" ? "Cross-group relationships" : (D == null ? void 0 : D.name) || "Ungrouped", re = x.get(h);
      return n("section", { key: h, "aria-label": ne }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, ne),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${re.length} rule${re.length === 1 ? "" : "s"}`
          )
        ]),
        n("div", { key: "table", role: "table", "aria-label": `${ne} derivation rules` }, [
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
          ...re.map((Y) => n("button", {
            key: Y.id,
            type: "button",
            role: "row",
            onClick: () => pe({ type: "rule", id: Y.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(U == null ? void 0 : U.id) === Y.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${Y.sourceTagName} → ${Y.derivedTagName}` },
              `${Y.sourceTagName} → ${Y.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(Y.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(Y.edgeCount))
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
          `${$.length} rules · ${m.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          C(f()), pe(null), A();
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
          value: O,
          onChange: (x) => {
            ie(x.target.value), pe(null);
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
          onChange: (x) => {
            ce(x.target.value), pe(null), C(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...m.segmentGroups.map((x) => n("option", { key: x.key, value: x.key }, x.name))
        ])
      ]),
      R === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: y,
          onChange: (x) => G(x.target.value),
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
        ].map(([x, v]) => n("button", {
          key: x,
          type: "button",
          onClick: () => {
            j(x), x === "graph" && (J == null ? void 0 : J.type) === "rule" && pe(null);
          },
          "aria-pressed": R === x,
          className: `rounded px-3 py-1.5 text-sm font-medium ${R === x ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
        }, v))
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
        R === "graph" ? le() : k()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? Z() : M()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      I ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, I) : null
    ]),
    i ? n(co, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => q(i),
      onClose: () => {
        const x = i.trigger;
        w(null), requestAnimationFrame(() => {
          x != null && x.isConnected && x.focus();
        });
      }
    }) : null
  ]);
}
function nc({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = L([]), [a, s] = L(null), [l, d] = L([]), [c, g] = L([]), [u, f] = L(!1), [m, p] = L(!1), [y, b] = L(!1), [N, S] = L(""), [I, H] = L(""), [O, q] = L("graph"), [A, $] = L("all"), [T, P] = L(null), [_, U] = L("relationship"), [J, w] = L(null), [C, G] = L(null), Q = ge(null), ie = ge(null), ce = Ha().replace(/:/g, "");
  function pe() {
    requestAnimationFrame(() => {
      var V;
      return (V = Q.current) == null ? void 0 : V.scrollIntoView({ block: "nearest" });
    });
  }
  async function j(V) {
    const te = await ee("/derivation-rules", V ? { signal: V } : void 0);
    i(te || []);
  }
  ye(() => {
    const V = new AbortController();
    return j(V.signal).catch((te) => {
      te.name !== "AbortError" && S(te.message || "Unable to load derived segment rules.");
    }), () => V.abort();
  }, []), ye(() => {
    const V = new AbortController();
    return a != null && a.sourceTagId ? (f(!0), ee(`/slot-definitions/${a.sourceTagId}`, { signal: V.signal }).then((te) => d(te.definitions || [])).catch((te) => {
      te.name !== "AbortError" && d([]);
    }).finally(() => {
      V.signal.aborted || f(!1);
    })) : (d([]), f(!1)), a != null && a.derivedTagId ? (p(!0), ee(`/slot-definitions/${a.derivedTagId}`, { signal: V.signal }).then((te) => g(te.definitions || [])).catch((te) => {
      te.name !== "AbortError" && g([]);
    }).finally(() => {
      V.signal.aborted || p(!1);
    })) : (g([]), p(!1)), () => V.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), ye(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || u || m)
      return;
    const V = `${a.sourceTagId}:${a.derivedTagId}`;
    ie.current !== V && (ie.current = V, s((te) => !te || Number(te.sourceTagId) !== Number(a.sourceTagId) || Number(te.derivedTagId) !== Number(a.derivedTagId) ? te : Ml(te, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    u,
    m
  ]);
  function X(V, te = !1) {
    te || P({ type: "rule", id: V.id }), ie.current = null, s({
      ruleId: V.id,
      sourceTagId: V.sourceTagId,
      sourceTagName: V.sourceTagName,
      derivedTagId: V.derivedTagId,
      derivedTagName: V.derivedTagName,
      slotMappings: V.slotMappings.map((z) => ({
        sourceSlotDefinitionId: z.sourceSlotDefinitionId,
        derivedSlotDefinitionId: z.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), S(""), pe();
  }
  function ue(V, te, z = "") {
    ie.current = null, V === "source" ? (d([]), f(te != null)) : (g([]), p(te != null)), s((E) => ({
      ...E,
      [`${V}TagId`]: te == null ? null : Number(te),
      [`${V}TagName`]: z || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function ae(V) {
    (a == null ? void 0 : a.ruleId) == null && (ie.current = null);
    const te = [j(), t == null ? void 0 : t()];
    return V.draftKind === "source" ? (f(!0), te.push(ee(`/slot-definitions/${V.tagId}`).then((z) => d(z.definitions || [])).finally(() => f(!1)))) : V.draftKind === "derived" && (p(!0), te.push(ee(`/slot-definitions/${V.tagId}`).then((z) => g(z.definitions || [])).finally(() => p(!1)))), Promise.all(te);
  }
  function xe(V, te, z) {
    s((E) => ({
      ...E,
      slotMappings: E.slotMappings.map((oe, ve) => ve === V ? { ...oe, [te]: z } : oe)
    }));
  }
  async function Se() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const V = ma(a, o);
    if (V) {
      S(V.message);
      return;
    }
    if (a.slotMappings.some((te) => !te.sourceSlotDefinitionId || !te.derivedSlotDefinitionId)) {
      S("Complete or remove every performer slot mapping before saving.");
      return;
    }
    b(!0), S(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let te = null;
      if (a.ruleId != null) {
        const E = await ee(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${E.deletedSegmentCount}
Removed lineage edges: ${E.removedEdgeCount}
Shared derived segments retained: ${E.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        te = E.fingerprint;
      }
      S("Saving derived segment rule…");
      const z = await ee("/derivation-rules", {
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
      if (await j(), P(O === "graph" ? { type: "node", id: Number(z.sourceTagId) } : { type: "rule", id: z.id }), s(null), a.ruleId == null)
        try {
          const E = await ee(
            `/derivation-rules/${z.id}/materialization/preview`,
            { method: "POST" }
          );
          w(
            E.createCount + E.linkCount > 0 ? E : null
          ), S(E.createCount + E.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          w(null), S("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        w(null), S("Derived segment rule saved. Previous materializations were removed.");
    } catch (te) {
      S(te.message || "Unable to save derived segment rule.");
    } finally {
      b(!1);
    }
  }
  async function R(V) {
    b(!0), S("Previewing rule deletion…");
    try {
      const te = await ee(
        `/derivation-rules/${V.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${V.sourceTagName} → ${V.derivedTagName}?

Deleted segments: ${te.deletedSegmentCount}
Removed lineage edges: ${te.removedEdgeCount}
Shared derived segments retained: ${te.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const z = `derivation-rule-delete:${V.id}:${te.fingerprint}`;
      await ee(`/derivation-rules/${V.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe(z),
          fingerprint: te.fingerprint
        })
      }), Le(z), await j(), (a == null ? void 0 : a.ruleId) === V.id && s(null), (T == null ? void 0 : T.type) === "rule" && T.id === V.id && P(null), (J == null ? void 0 : J.ruleId) === V.id && w(null), S(`Rule deleted with ${te.deletedSegmentCount} exclusively derived segment${te.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (te) {
      S(te.message || "Unable to delete derived segment rule.");
    } finally {
      b(!1);
    }
  }
  async function W(V, te = null) {
    const z = te || await ee(
      `/derivation-rules/${V.id}/materialization/preview`,
      { method: "POST" }
    );
    if (z.createCount + z.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const E = `derivation-rule-materialize:${V.id}:${z.fingerprint}`, oe = await ee(`/derivation-rules/${V.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Pe(E),
        fingerprint: z.fingerprint
      })
    });
    return Le(E), oe;
  }
  async function K(V, te = null) {
    b(!0), S("Finding pending derivations…");
    try {
      const z = await W(V, te);
      if (w(null), await j(), z.createdCount + z.linkedCount === 0) {
        S("Every applicable derivation is already materialized.");
        return;
      }
      S(
        `${z.createdCount} derived segment${z.createdCount === 1 ? "" : "s"} created and ${z.linkedCount} existing segment${z.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (z) {
      S(z.message || "Unable to materialize pending derivations.");
    } finally {
      b(!1);
    }
  }
  async function se(V, te) {
    if (te.length === 0) return;
    b(!0), S(`Finding pending derivations from ${V.name}…`);
    let z = 0, E = 0;
    try {
      for (const oe of te) {
        const ve = await W(oe);
        z += ve.createdCount, E += ve.linkedCount;
      }
      w(null), await j(), S(z + E === 0 ? `Every outgoing derivation from ${V.name} is already materialized.` : `${z} derived segment${z === 1 ? "" : "s"} created and ${E} existing segment${E === 1 ? "" : "s"} linked from ${V.name}.`);
    } catch (oe) {
      await j().catch(() => {
      }), S(oe.message || `Unable to materialize derivations from ${V.name}.`);
    } finally {
      b(!1);
    }
  }
  const Z = ma(a, o), M = Be(
    () => Qd(o, e),
    [o, e]
  ), le = I.trim().toLocaleLowerCase(), x = M.components.filter((V) => A === "all" || V.segmentGroupKeys.includes(A)).filter((V) => !le || V.nodes.some((te) => te.name.toLocaleLowerCase().includes(le))), v = x.flatMap((V) => V.rules), h = new Set(
    x.flatMap((V) => V.nodes.map((te) => te.tagId))
  ), D = Be(
    () => Xd(x),
    [x]
  ), ne = O === "list" ? ec(
    T,
    v,
    le.length > 0
  ) : null, re = (T == null ? void 0 : T.type) === "node" && M.nodes.find((V) => V.tagId === T.id && h.has(V.tagId)) || null, Y = [...v].sort((V, te) => _ === "source" ? tt(V.sourceTagName, te.sourceTagName) || tt(V.derivedTagName, te.derivedTagName) : _ === "target" ? tt(V.derivedTagName, te.derivedTagName) || tt(V.sourceTagName, te.sourceTagName) : _ === "materialized" ? (Number(te.edgeCount) || 0) - (Number(V.edgeCount) || 0) || tt(V.sourceTagName, te.sourceTagName) : tt(
    `${V.sourceTagName} ${V.derivedTagName}`,
    `${te.sourceTagName} ${te.derivedTagName}`
  ));
  return n(tc, {
    arrowMarkerId: ce,
    busy: y,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: C,
    deleteRule: R,
    derivedSlots: c,
    derivedSlotsLoading: m,
    draft: a,
    draftIssue: Z,
    editRule: X,
    editorRef: Q,
    emptyDraft: r,
    graph: M,
    layout: D,
    listSort: _,
    materializationOffer: J,
    materializeOutgoingRules: se,
    materializeRule: K,
    message: N,
    normalizedQuery: le,
    query: I,
    refreshConfiguredTag: ae,
    revealEditor: pe,
    rules: o,
    save: Se,
    segmentGroupKey: A,
    selectedNode: re,
    selectedRule: ne,
    selection: T,
    setConfiguringTag: G,
    setDraft: s,
    setListSort: U,
    setMaterializationOffer: w,
    setQuery: H,
    setSegmentGroupKey: $,
    setSelection: P,
    setView: q,
    sortedVisibleRules: Y,
    sourceSlots: l,
    sourceSlotsLoading: u,
    updateMapping: xe,
    updateTag: ue,
    view: O,
    visibleComponents: x,
    visibleRules: v
  });
}
function rc() {
  const [e, t] = L(Ba), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => zo({ ...l, [a]: s }));
  }
  function i() {
    t(zo(Zr));
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
function oc({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = L([]), [a, s] = L(!1), [l, d] = L(!1), [c, g] = L(""), [u, f] = L(""), [m, p] = L("all"), [y, b] = L(() => /* @__PURE__ */ new Set()), [N, S] = L(null);
  ye(() => {
    if (!e || a) return;
    const w = new AbortController();
    return d(!0), g(""), ee("/slot-definitions", { signal: w.signal }).then((C) => {
      i(C || []), s(!0);
    }).catch((C) => {
      C.name !== "AbortError" && g(C.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      w.signal.aborted || d(!1);
    }), () => w.abort();
  }, [e, a]);
  async function I() {
    d(!0), g("");
    try {
      const w = await ee("/slot-definitions");
      i(w || []), s(!0);
    } catch (w) {
      g(w.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function H() {
    const [w] = await Promise.all([
      ee("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(w || []), s(!0), g("");
  }
  function O() {
    const w = N == null ? void 0 : N.trigger;
    S(null), requestAnimationFrame(() => {
      w != null && w.isConnected && w.focus({ preventScroll: !0 });
    });
  }
  function q(w) {
    b((C) => {
      const G = new Set(C);
      return G.has(w) ? G.delete(w) : G.add(w), G;
    });
  }
  const A = Be(
    () => Jd(t, o),
    [t, o]
  ), $ = Be(
    () => Yd(A, u, m),
    [A, u, m]
  ), T = A.flatMap((w) => w.tags), P = T.filter((w) => w.definitions.length > 0).length, _ = T.length - P, U = [
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
        `${T.length} tags · ${P} with slots · ${_} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: u,
          onChange: (w) => f(w.target.value),
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
          U.map(([w, C]) => n("button", {
            key: w,
            type: "button",
            onClick: () => p(w),
            "aria-pressed": m === w,
            className: `rounded px-3 py-1.5 text-xs font-medium ${m === w ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, C))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => b(/* @__PURE__ */ new Set()),
          className: J
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => b(new Set(A.map((w) => w.overviewKey))),
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
        onClick: I,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && $.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, $.map((w) => {
      const C = y.has(w.overviewKey), G = w.tags.filter((Q) => Q.definitions.length > 0).length;
      return n("article", {
        key: w.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => q(w.overviewKey),
          "aria-expanded": !C,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, C ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, w.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${w.tags.length} tag${w.tags.length === 1 ? "" : "s"} · ${G} with slots`
          )
        ]),
        C ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          w.tags.map((Q) => n("li", {
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
              n("span", { key: "label", className: "font-medium text-foreground" }, rt(ie)),
              ...(ie.genderHints || []).map((ce) => n("span", {
                key: ce,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, pr(ce)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (ie) => S({
                tagId: Q.tagId,
                tagName: Q.tagName,
                trigger: ie.currentTarget
              }),
              "aria-label": `Edit performer slots for ${Q.tagName}`,
              className: `${J} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    N ? n(co, {
      key: `performer-slots-configure:${N.tagId}`,
      tagId: N.tagId,
      tagName: N.tagName,
      onSaved: H,
      onClose: O
    }) : null
  ]);
}
function ac({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = L("general"), [a, s] = L([]), [l, d] = L(!1), [c, g] = L(""), [u, f] = L(""), [m, p] = L(null), [y, b] = L(!0), [N, S] = L(!1), [I, H] = L(""), [O, q] = L(!0), [A, $] = L(Da), T = Ys(t), P = T.map(([C]) => C);
  ye(() => {
    P.includes(o) || i(P[0] || "general");
  }, [t.effectiveMode]);
  async function _(C) {
    const G = await ee("/segment-groups", C ? { signal: C } : void 0);
    s(G || []);
  }
  ye(() => {
    const C = new AbortController();
    return _(C.signal).catch((G) => {
      G.name !== "AbortError" && g(G.message || "Unable to load tag groups.");
    }), () => C.abort();
  }, []), ye(() => {
    if (t.effectiveMode !== "full") {
      b(!1);
      return;
    }
    const C = new AbortController();
    return H(""), b(!0), Promise.all([
      ee("/analysis/settings", { signal: C.signal }),
      ee("/analysis/status", { signal: C.signal })
    ]).then(([G, Q]) => {
      q(!0), f((G == null ? void 0 : G.baseUrl) || ""), p(Q);
    }).catch((G) => {
      if (G.name !== "AbortError") {
        if (G.status === 403) {
          q(!1), H("You do not have permission to manage the analysis service connection.");
          return;
        }
        H(G.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      C.signal.aborted || b(!1);
    }), () => C.abort();
  }, [t.effectiveMode]);
  async function U(C) {
    if (C !== t.requestedMode) {
      d(!0), g("");
      try {
        const G = await ee(
          `/preferences/transition?mode=${encodeURIComponent(C)}`
        );
        let Q = !1, ie = null, ce = null, pe = null, j = !1;
        if (t.requestedMode === "basic" && C === "full") {
          if (!window.confirm(Xs(
            G.recyclingBinCount,
            G.protectedRecyclingBinCount
          )))
            return;
          j = !0, G.recyclingBinCount > 0 && (Q = !0, pe = G.recyclingBinFingerprint, ie = `mode-switch-empty-bin:${pe}`, ce = Pe(ie));
        }
        let X = !1;
        if (t.requestedMode === "full" && C === "basic") {
          if (!window.confirm(Zs(
            G.extensionOwnedSegmentCount
          )))
            return;
          X = !0;
        }
        const ue = await ee("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: C,
            confirmHiddenExtensionOwnedSegments: X,
            confirmBasicHistoryCleanup: j,
            emptyRecyclingBin: Q,
            operationId: ce,
            expectedRecyclingBinFingerprint: pe
          })
        });
        ie && Le(ie), r == null || r(Ga(ue)), g("Workflow mode saved.");
      } catch (G) {
        g(G.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function J(C) {
    C.preventDefault(), S(!0), H("");
    try {
      const G = await ee("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: u })
      });
      f((G == null ? void 0 : G.baseUrl) || "");
      const Q = await ee("/analysis/status");
      p(Q), H(G != null && G.baseUrl ? Q != null && Q.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(Q == null ? void 0 : Q.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (G) {
      H(G.message || "Unable to save analysis service settings.");
    } finally {
      S(!1);
    }
  }
  const w = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (C) => ii(C, e, w), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      T.map(([C, G]) => n("button", {
        key: C,
        type: "button",
        onClick: () => i(C),
        "aria-current": o === C ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === C ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, G))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(rc)
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
      n(xd, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: U,
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
          checked: A,
          onChange: (C) => {
            const G = C.target.checked;
            Oa(G), $(G);
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
            value: u,
            onChange: (C) => f(C.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: y || N || !O,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: y || N || !O,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, N ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        I || (y ? "Loading analysis service settings…" : (m == null ? void 0 : m.configured) === !1 ? "Full Scan is not configured." : m != null && m.ready ? "Analysis service is ready." : (m == null ? void 0 : m.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    P.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(nc, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => _()
      })
    ) : null,
    P.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(oc, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => _()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function ga({ facets: e, values: t, disabled: r, onChange: o }) {
  var i;
  return r ? n(
    "p",
    { className: "rounded-md border border-dashed border-border p-3 text-xs text-secondary" },
    "Performer slot filters are unavailable for your current access. Browse and playback remain available."
  ) : (i = e == null ? void 0 : e.slots) != null && i.length ? n("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, e.slots.map((a) => n("label", { key: a.id, className: "space-y-1 text-xs text-secondary" }, [
    n("span", { key: "label" }, rt(a)),
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
function ic({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var g, u;
  const s = [...e.slots || []].sort((f, m) => f.sortOrder - m.sortOrder || String(f.slotDefinitionId).localeCompare(String(m.slotDefinitionId))), l = [...new Map(s.map((f) => [
    f.performerId,
    { id: f.performerId, name: f.performerName }
  ])).values()], d = s.map((f) => ({
    slotDefinitionId: f.slotDefinitionId,
    label: rt(f),
    performer: { id: f.performerId, name: f.performerName }
  })), c = Ka(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: Qa(t)
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
          n(Ht, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((u = e.activity) == null ? void 0 : u.name) || "Tag segment"),
          l.length ? n(fr, {
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
function sc({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(ha, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: nl(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: Ka(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function pa({ onNavigate: e, profile: t }) {
  const r = Be(() => {
    const j = xa("ext:com.midnightrider.segment-studio:segments");
    return j ? {
      ...Pr,
      defaultFilter: { ...Pr.defaultFilter, ...j.findFilter || {} },
      defaultObjectFilter: j.objectFilter || {}
    } : Pr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Sa(r), [l, d] = L(null), [c, g] = L({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [u, f] = L(null), [m, p] = L(null), [y, b] = L(0), [N, S] = L(""), [I, H] = L(!0), [O, q] = L(""), A = ge(0), $ = Ho(o, i), T = $.activityTagId, P = dn(i.slots), _ = Be(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (j) => Object.keys(dn(j)).length > 0,
    sanitize: (j) => Lr(T, dn(j)),
    summarize: (j) => `${Object.keys(dn(j)).length} assigned`,
    renderEditor: (j, X) => T ? n(ga, {
      facets: l,
      values: dn(j),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (ue, ae) => {
        const xe = { ...dn(j) };
        ae ? xe[ue] = Number(ae) : delete xe[ue], X(Lr(T, xe));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [T, l, c.performerSlotsAvailable]), U = JSON.stringify($);
  ye(() => {
    if (d(null), !T) return;
    const j = new AbortController();
    return ee(`/browse/activities/${T}/facets`, { signal: j.signal }).then(d).catch((X) => {
      X.status === 403 ? d({ slots: [], restricted: !0 }) : X.name !== "AbortError" && q(X.message);
    }), () => j.abort();
  }, [T]), ye(() => {
    const j = ++A.current, X = new AbortController();
    return H(!0), q(""), ee("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify($), signal: X.signal }).then((ue) => {
      j === A.current && g({ ...ue, totalCount: ue.totalCount ?? ue.total ?? 0 });
    }).catch((ue) => {
      if (!(j !== A.current || ue.name === "AbortError")) {
        if (ue.status === 400 && ue.message.includes("unrestricted performer read access")) {
          g((ae) => ({ ...ae, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), q("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        q(ue.message);
      }
    }).finally(() => {
      j === A.current && H(!1);
    }), () => {
      A.current++, X.abort();
    };
  }, [U, y]);
  const J = c.items.findIndex((j) => j.key === u), w = c.items[J] || null;
  function C(j) {
    s(j), a({ ...o, page: 1 });
  }
  function G(j) {
    const X = Ho(o, j), ue = j.slots && X.activityTagId != null && X.slotAssignments.length > 0 ? j.slots : void 0;
    C({ ...j, slots: ue });
  }
  function Q(j, X) {
    const ue = { ...P };
    X ? ue[j] = Number(X) : delete ue[j], C({ ...i, slots: Lr(T, ue) });
  }
  function ie() {
    const j = document.querySelector(`[data-segment-key="${u}"]`);
    f(null), requestAnimationFrame(() => j == null ? void 0 : j.focus());
  }
  async function ce(j) {
    var ae;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(j.key), S("");
    const X = `browse-restore:${j.itemId}:${j.revision}`, ue = Pe(X);
    try {
      const xe = (Se = !1) => ee(`/bin/${j.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ue,
          expectedRevision: j.revision,
          discardMissingImage: Se
        })
      });
      try {
        await xe(no(X));
      } catch (Se) {
        if (((ae = Se.payload) == null ? void 0 : ae.code) !== "missing-image" || !window.confirm(`${Se.message}

Continue and discard the missing image reference?`))
          throw Se;
        ro(X), await xe(!0);
      }
      Le(X), u === j.key && f(null), S("Segment restored to Cove."), b((Se) => Se + 1);
    } catch (xe) {
      S(xe.message || "Unable to restore the segment."), xe.status === 409 && b((Se) => Se + 1);
    } finally {
      p(null);
    }
  }
  async function pe(j) {
    p(j.key), S("");
    try {
      const X = await ee(`/items/${j.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: j.revision })
      });
      if (!Wa(X, S) || !pl(X))
        return;
      const ue = `browse-dependency-delete:${j.itemId}:${X.fingerprint}`;
      await ee(`/items/${j.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe(ue),
          fingerprint: X.fingerprint
        })
      }), Le(ue), u === j.key && f(null), S(`${X.deletedSegmentCount} segment${X.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), b((ae) => ae + 1);
    } catch (X) {
      S(X.message || "Unable to permanently delete the segment."), X.status === 409 && b((ue) => ue + 1);
    } finally {
      p(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(lo, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(ka, {
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
      error: O ? new Error(O) : null,
      onRetry: () => b((j) => j + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? _o.filter((j) => j.id !== "performers") : _o,
      objectFilter: i,
      onObjectFilterChange: G,
      customFilterSections: _,
      searchPlaceholder: "Search segments..."
    }, [
      T ? n(ga, { key: "slots", facets: l, values: P, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: Q }) : null,
      n(sc, { key: "player", item: w, index: J, count: c.items.length, onPrevious: () => {
        var j;
        return f((j = c.items[J - 1]) == null ? void 0 : j.key);
      }, onNext: () => {
        var j;
        return f((j = c.items[J + 1]) == null ? void 0 : j.key);
      }, onClose: ie, onNavigate: e }),
      N ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, N) : null,
      !I && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      I ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((j) => n(ic, {
        key: j.key,
        item: j,
        selected: j.key === u,
        busy: m === j.key,
        onSelect: () => f(j.key),
        onRestore: ce,
        onPurge: pe
      })))
    ])
  ]);
}
function lc({ onNavigate: e, profile: t }) {
  const [r, o] = L([]), [i, a] = L(""), [s, l] = L(0), [d, c] = L(!0), [g, u] = L(null), [f, m] = L(""), p = ge(null);
  async function y(S) {
    const I = await ee("/bin", S ? { signal: S } : void 0);
    return o(I.items || []), a(I.fingerprint || ""), l(Number(I.totalCount) || 0), I;
  }
  ye(() => {
    const S = new AbortController();
    return c(!0), y(S.signal).catch((I) => {
      I.name !== "AbortError" && m(I.message);
    }).finally(() => {
      S.signal.aborted || c(!1);
    }), () => S.abort();
  }, []), va(Qr, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var S;
      return (S = p.current) == null ? void 0 : S.call(p);
    }
  }]);
  async function b(S) {
    var O;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    u(S.itemId), m("");
    const I = `restore:${S.itemId}:${S.revision}`, H = Pe(I);
    try {
      const q = (A = !1) => ee(`/bin/${S.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: H, expectedRevision: S.revision, discardMissingImage: A })
      });
      try {
        await q(no(I));
      } catch (A) {
        if (((O = A.payload) == null ? void 0 : O.code) !== "missing-image" || !window.confirm(`${A.message}

Continue and discard the missing image reference?`)) throw A;
        ro(I), await q(!0);
      }
      Le(I), await y(), Rn(), m("Segment restored with a new native ID.");
    } catch (q) {
      m(q.message || "Unable to restore the segment."), q.status === 409 && await y();
    } finally {
      u(null);
    }
  }
  async function N() {
    if (g == null)
      try {
        const S = await Ja({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          u(-1), m("");
        });
        if (S.status !== "emptied") return;
        await y(), Rn(), m(`${S.segmentCount} segment${S.segmentCount === 1 ? "" : "s"} from ${S.sceneCount} scene${S.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (S) {
        m(S.message || "Unable to empty the recycling bin."), S.status === 409 && await y();
      } finally {
        u(null);
      }
  }
  return p.current = N, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    n(lo, {
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
        onClick: N,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, g === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    f ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, f) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((S) => n("article", { key: S.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${S.tagName || "Tag segment"} · ${S.videoTitle || `Video ${S.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, S.endSec == null ? Me(S.startSec) : `${Me(S.startSec)} – ${Me(S.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${S.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${S.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: g != null, onClick: () => b(S), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const fa = "ext:com.midnightrider.segment-studio:videos";
function Br({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = Be(() => {
    var K;
    const R = xa(fa), W = (K = R == null ? void 0 : R.uiOptions) == null ? void 0 : K.displayMode;
    return R ? {
      ...Cn,
      defaultFilter: { ...Cn.defaultFilter, ...R.findFilter || {} },
      defaultObjectFilter: R.objectFilter || {},
      defaultDisplayMode: Cn.allowedDisplayModes.includes(W) ? W : Cn.defaultDisplayMode
    } : Cn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = Sa(i), [u, f] = L({ items: [], totalCount: 0 }), [m, p] = L(!0), [y, b] = L(""), [N, S] = L(0), [I, H] = L(/* @__PURE__ */ new Set()), [O, q] = L(null), [A, $] = L({ busy: !1, error: "", announcement: "" }), T = ge(0), P = ge(null), _ = ge(null);
  _.current || (_.current = Wd());
  const U = JSON.stringify(a), J = JSON.stringify(s), w = t || r === "review";
  ye(() => {
    _.current.selectionChanged(), P.current = null, H(/* @__PURE__ */ new Set()), $((R) => ({ busy: R.busy, error: "", announcement: "" }));
  }, [U, J]), ye(() => {
    if (!w) return;
    const R = new AbortController();
    return ee("/analysis/status", { signal: R.signal }).then(q).catch((W) => {
      W.name !== "AbortError" && q({ configured: !0, ready: !1, error: W.message || "Unable to check Full Scan readiness." });
    }), () => R.abort();
  }, [w]), ye(() => {
    const R = ++T.current, W = new AbortController();
    return p(!0), b(""), ee(`/videos?${fd(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: W.signal }).then((K) => {
      R === T.current && f(K);
    }).catch((K) => {
      R === T.current && K.name !== "AbortError" && b(K.message || "Unable to discover videos.");
    }).finally(() => {
      R === T.current && p(!1);
    }), () => {
      T.current++, W.abort();
    };
  }, [U, J, t, r, N]);
  function C(R) {
    d({ ...R, page: R.page || 1 });
  }
  function G(R) {
    c(R), d({ ...a, page: 1 });
  }
  function Q(R, W = !1) {
    H((K) => yd(
      K,
      u.items.map((se) => se.videoId),
      R,
      P.current,
      W
    )), P.current = R;
  }
  function ie() {
    P.current = null, H(new Set(u.items.map((R) => R.videoId)));
  }
  function ce() {
    P.current = null, H(/* @__PURE__ */ new Set());
  }
  function pe() {
    P.current = null, H((R) => new Set(u.items.map((W) => W.videoId).filter((W) => !R.has(W))));
  }
  async function j(R = ["aiTagging", "omnishotcut"]) {
    const W = _.current.begin();
    if (W) {
      $({ busy: !0, error: "", announcement: "" });
      try {
        const K = await Vd(
          [...I],
          R,
          ee,
          (se) => window.confirm(se)
        );
        if (K.cancelled) {
          $({ busy: !1, error: "", announcement: "" });
          return;
        }
        K.queuedIds.length > 0 && _.current.ownsCurrentSelection(W) && (K.queuedIds.includes(P.current) && (P.current = null), H((se) => {
          const Z = new Set(se);
          return K.queuedIds.forEach((M) => Z.delete(M)), Z;
        })), $({
          busy: !1,
          announcement: K.queuedIds.length > 0 ? `${K.queuedIds.length} ${K.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: K.failed.length > 0 ? `${K.failed.length} selected ${K.failed.length === 1 ? "video could" : "videos could"} not be queued. ${K.failed[0].error}` : ""
        });
      } catch (K) {
        $({ busy: !1, error: K.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        _.current.finish(W);
      }
    }
  }
  const X = t || r === "review" ? aa : aa.filter((R) => !["reviewState", "shotBoundaries"].includes(R.id)), ue = O === null || O.configured === !1 || O.ready === !1, ae = A.busy || ue, xe = (O == null ? void 0 : O.error) || (O === null ? "Checking Full Scan availability" : O.configured === !1 ? "Configure the analysis service before running Full Scan" : O.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), Se = A.busy ? "Queueing scans…" : O === null ? "Checking Full Scan…" : O.configured === !1 ? "Full Scan not configured" : O.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
  return n("div", { className: "w-full space-y-5" }, [
    n(lo, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(ka, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: fa,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: C,
      totalCount: u.totalCount,
      isLoading: m,
      error: y ? new Error(y) : null,
      onRetry: () => S((R) => R + 1),
      sortOptions: t || r === "review" ? [...oa, { value: "unreviewed_count", label: "Unreviewed count" }] : oa,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: X,
      objectFilter: s,
      onObjectFilterChange: G,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: w ? I : void 0,
      onSelectAll: w ? ie : void 0,
      onSelectNone: w ? ce : void 0,
      onInvertSelection: w ? pe : void 0,
      selectionActions: w ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: ae,
          onClick: () => j(),
          title: xe,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, Se),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": ae,
            title: xe,
            onClick: (R) => {
              ae && R.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${ae ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(wa, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([R, W]) => n("button", {
            key: R,
            type: "button",
            disabled: A.busy,
            onClick: (K) => {
              var se;
              (se = K.currentTarget.closest("details")) == null || se.removeAttribute("open"), j(W);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, R)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, A.announcement),
      A.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, A.error) : null,
      !m && u.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !m && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, u.items.map((R) => n(bd, { key: R.videoId, item: R, onNavigate: e, showReviewStates: w, selected: I.has(R.videoId), selectionActive: I.size > 0, onSelect: w ? Q : null }))) : null,
      !m && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, u.items.map((R) => n(hd, { key: R.videoId, item: R, onNavigate: e, showReviewStates: w, selected: I.has(R.videoId), selectionActive: I.size > 0, onSelect: w ? Q : null }))) : null
    ])
  ]);
}
function ya({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = L(null), [s, l] = L(!0), [d, c] = L(""), g = ge(0), u = ge(0), f = ge(e), m = td();
  f.current = e;
  const p = (I) => `/videos/${I}/editor`;
  async function y(I, H, O) {
    const q = await ee(p(H), O ? { signal: O.signal } : void 0);
    return Ut(I, O ? g.current : u.current, H, f.current) ? (a(q), !0) : !1;
  }
  ye(() => {
    const I = ++g.current, H = e, O = new AbortController();
    return a(null), l(!0), c(""), y(I, H, O).catch((q) => {
      Ut(I, g.current, H, f.current) && q.name !== "AbortError" && c(q.message || "Unable to load the editor.");
    }).finally(() => {
      Ut(I, g.current, H, f.current) && l(!1);
    }), () => {
      g.current++, u.current++, O.abort();
    };
  }, [e]);
  function b(I, H) {
    a((O) => (O == null ? void 0 : O.video.id) !== H ? O : typeof I == "function" ? I(O) : I);
  }
  async function N() {
    const I = e, H = ++u.current;
    try {
      const O = await ee(p(I));
      return Ut(H, u.current, I, f.current) ? (a(O), c("A newer canonical segment was loaded. Your stale change was not applied."), O) : null;
    } catch (O) {
      return Ut(H, u.current, I, f.current) && c(O.message || "Unable to reload the latest segment."), null;
    }
  }
  async function S() {
    const I = e, H = ++u.current;
    try {
      const O = await ee(p(I));
      return Ut(H, u.current, I, f.current) ? (a(O), c(""), O) : null;
    } catch (O) {
      return Ut(H, u.current, I, f.current) && c(O.message || "Unable to reload performer slots."), null;
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
      n(Qi, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(Hd, {
      key: i.video.id,
      detail: i,
      onDetailChange: b,
      onConflict: N,
      onReload: S,
      onSlotsChanged: S,
      splitLayout: m,
      profile: o,
      initialSegmentId: Wo() ? -Wo() : rl(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function dc(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function cc(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function uc(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function mc({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = Vs(o), l = dc(e, t, window.location.pathname), d = cc(e, t, window.location.pathname), c = uc(e, t, window.location.pathname), g = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (Qs(g, o) === "videos" && g !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Br, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(ac, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(pa, { onNavigate: r, profile: o });
    const m = Number(e);
    return Number.isInteger(m) && m > 0 ? n(ya, {
      videoId: m,
      onNavigate: r,
      compatibilityMode: !0,
      profile: o
    }) : n(Br, {
      onNavigate: r,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return n(lc, { onNavigate: r, profile: o });
  const f = Number(e);
  return d ? n(pa, { onNavigate: r, profile: o }) : Number.isInteger(f) && f > 0 ? n(ya, {
    videoId: f,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(Br, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function gc({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = L(null), [a, s] = L("");
  return ye(() => {
    const l = new AbortController();
    return ee("/preferences", { signal: l.signal }).then((d) => i(Ga(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(mc, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function pc(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function fc(e, t) {
  const r = pc(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const Pc = {
  components: { SegmentStudioPage: gc },
  actionHandlers: { openSegmentStudio: fc }
};
export {
  dr as CLEARED_SEGMENT_SELECTION_ID,
  oa as DISCOVERY_SORT_OPTIONS,
  Tt as SEGMENT_STUDIO_CAPABILITIES,
  Qr as SEGMENT_STUDIO_EXTENSION_ID,
  Ln as SEGMENT_STUDIO_SHORTCUTS,
  bs as activeEditorFilterCount,
  Ml as applyDerivationRuleSlotSuggestions,
  Wr as applyFeedbackEditorDelta,
  Zo as applySegmentMergeDelta,
  bl as basicSegmentTimelineStyle,
  nl as browseClipEnd,
  Ka as browseEditorHref,
  Ho as buildBrowseRequest,
  Qd as buildDerivationRuleGraph,
  fd as buildDiscoverySearchParams,
  ns as buildMinuteTimelineTicks,
  Jd as buildPerformerSlotOverview,
  ll as buildSegmentQuickSearchEntries,
  Ll as buildSegmentRailRows,
  Fl as buildTimelineRows,
  Sc as buildTimelineTicks,
  is as calculateCenteredTimelineScroll,
  Ur as calculateEditorPanelMaximum,
  rs as calculateMinuteLabelStride,
  kc as calculateMinuteTimelineWidth,
  ds as calculateSwimlaneTitleMaximum,
  ss as calculateTimelinePlayheadPosition,
  Xr as calculateTimelineRatioBounds,
  us as calculateTimelineRatioFromPointer,
  wc as calculateVerticalRevealOffset,
  Kt as clampEditorPanelWidth,
  ir as clampSwimlaneTitleWidth,
  Ea as clampTimelineRatio,
  eo as clampTimelineRatioForHeight,
  lr as clampTimelineZoom,
  ud as compactProvenanceSummary,
  Wd as createBulkAnalysisCoordinator,
  Bs as createQueuedReviewRequest,
  da as createSegmentAnalysisRequestScope,
  Pc as default,
  gl as downloadFileNameFromContentDisposition,
  hs as dualRangeValueFromPointer,
  Uo as duplicateIdentityFromResponse,
  zs as duplicateOperationKey,
  ys as editorVisibilityIncludingSegment,
  Gl as expandedSwimlanes,
  Zs as extensionOwnedSegmentsModeSwitchPrompt,
  Hl as feedbackFrameTimestamps,
  Wl as feedbackResultMatchesAction,
  ql as feedbackSelectionPlan,
  fs as filterDerivedSegments,
  Or as filterEditorSegments,
  Yd as filterPerformerSlotOverview,
  sl as filterSegmentQuickSearch,
  Tc as filterSegmentStudioShortcuts,
  zl as findAdjacentSegmentGroupKey,
  qs as findAdjacentShot,
  Ls as findEditorShortcut,
  Ma as findInitialSegmentSelection,
  ts as findNearestSegmentInCurrentSwimlane,
  Hs as findPublishedSelectionIdentity,
  Ue as findSegmentByStableIdentity,
  ms as findSegmentFromPlayhead,
  es as findSegmentNearPlayhead,
  Kl as findSwimlaneRangeSelection,
  qr as findSwimlaneSelection,
  al as findUniquePerformerSlotAssignment,
  sr as findUnreviewedSelection,
  Il as focusDialogDefaultButton,
  pr as formatGenderHint,
  Ws as frameStepSeconds,
  za as generatePerformerSlotAssignmentRecommendations,
  Cd as groupApprovedDraftsForPublishing,
  il as groupAutoAssignCandidates,
  Vl as groupIncorrectExamplesByTag,
  Ed as groupMaterializationOutputs,
  zt as groupSegmentsIntoSwimlanes,
  jl as groupSelectedSwimlanes,
  so as groupSwimlanesBySegmentGroup,
  lt as handleModalKey,
  un as hasSegmentStudioCapability,
  ea as hideCollectedFeedbackSegments,
  $l as historyActionsForTarget,
  rr as incorrectExampleHistoryState,
  ei as indexPerformerSlotsBySegment,
  Rc as initialReviewFilter,
  Ql as insertSegmentProjection,
  Ut as isCurrentEditorRequest,
  kl as isEditableTarget,
  Ec as isEditorShortcutOwner,
  uc as isSegmentStudioBinRoute,
  cc as isSegmentStudioSegmentsRoute,
  dc as isSegmentStudioSettingsRoute,
  Zd as layoutDerivationRuleComponent,
  Xd as layoutDerivationRuleComponents,
  Zl as mergeSegmentsProjection,
  Al as multiSelectionActionHint,
  $s as nextSegmentAfterRemoval,
  Cs as nextUnreviewedAfterRemoval,
  Lt as normalizeCollapsedSegmentGroups,
  sa as normalizeDiscoveryIds,
  gt as normalizeEditorSegmentFilters,
  Ot as normalizeGender,
  Ko as normalizeReviewFilter,
  Ga as normalizeSegmentStudioFeatureProfile,
  Ac as normalizeSegmentStudioMode,
  _r as normalizeSegmentStudioPublicMode,
  dn as parseBrowseSlotFilters,
  cs as parseEditorLayout,
  gs as parseHideDerivedSegmentsPreference,
  ps as parseMergeConfirmationPreference,
  ja as parsePlaybackShortcutConfig,
  Os as parseShortcutBindingOverrides,
  jr as patchPerformerSlotProjection,
  mr as patchSegmentProjection,
  Ts as percentageSeekTime,
  ol as performInitialSegmentSeek,
  We as performerOptionId,
  cr as performerSlotHistoryState,
  rt as performerSlotLabel,
  El as performerSlotPresentation,
  Oc as performerSlotStatus,
  io as performerSlotStatusFromSegmentSlots,
  Xa as performerSlotsForSegment,
  vt as provenanceSourceLabel,
  _a as rankPerformerOptions,
  _l as reconcileSegmentGroupKey,
  Ns as reconcileSelectedSegmentIds,
  vd as recyclingBinActionText,
  fl as recyclingBinDeletionPrompt,
  Va as recyclingBinDeletionSummary,
  Xs as recyclingBinModeSwitchPrompt,
  Ks as removeQueuedReviewsForSegments,
  Vr as removeSegmentsProjection,
  Wo as requestedOwnedItemId,
  rl as requestedSegmentId,
  xs as resolveEditorSegmentSelection,
  Gs as resolveQueuedReviewRequest,
  _s as resolveSegmentCreationAction,
  Qs as resolveSegmentStudioRoute,
  Ps as resolveSegmentStudioShortcuts,
  ec as resolveSelectedDerivationRule,
  As as resolveSelectedSegments,
  Ld as restoreDisabledToolbarActionFocus,
  _d as restorePublishApprovedFocus,
  Pn as restoreSegmentFieldsProjection,
  ai as restoreSegmentsProjection,
  oi as revealCollapsedSegmentGroup,
  Vd as runSelectedDiscoveryAnalysis,
  Ya as segmentBadgeStyle,
  gr as segmentGroupHeaderBackground,
  bt as segmentGroupKeyForSegment,
  ao as segmentHistoryIdentity,
  nr as segmentHistoryState,
  Qa as segmentRailItemStyle,
  Mc as segmentStateStyle,
  pc as segmentStudioActionTarget,
  Vs as segmentStudioLegacyMode,
  yl as segmentTimelineStyle,
  mt as segmentsHistoryState,
  Is as selectAllVideoSegmentIds,
  el as selectedBrowseStates,
  ni as selectedSwimlaneMerge,
  ii as setBackLinkNavigation,
  Cl as sharedPerformerSlotShape,
  Tl as sharedTagPerformerSlotShape,
  cn as shortcutAvailableInMode,
  Fs as shortcutBindingDisplayText,
  Nc as shortcutBindingFromEvent,
  $c as shortcutBindingsOverlap,
  Cc as shortcutModesOverlap,
  Ds as shortcutRequiresSingleSegment,
  An as shotBoundaryFingerprint,
  Nl as shouldAcceptCurrentTagFromEnter,
  Ic as shouldExitShortcutCapture,
  Dc as shouldHandleEditorShortcut,
  la as shouldLoadSegmentAnalysis,
  ra as shouldReloadAfterSegmentMutation,
  zr as shouldRestoreTransitionSelection,
  dl as shouldShowQuickSearchGroups,
  Bo as splitShortcutCategoriesIntoColumns,
  Rl as suggestDerivationRuleSlotMappings,
  Dn as swimlaneDisplayLabel,
  Sl as swimlaneMarkerTop,
  vl as swimlaneStripeBackground,
  ls as timelineContentStyle,
  Lo as timelinePlayheadHorizontalStyle,
  hl as timelineSegmentWidth,
  os as timelineTickAlignment,
  as as timelineTickPosition,
  Gr as timelineTimePercent,
  Ul as toggleAllCollapsedSegmentGroups,
  js as toggledSelectionReviewState,
  wt as trapModalFocus,
  cl as tryParseJsonResponseText,
  ws as updateAnchoredSegmentSelection,
  yd as updateDiscoverySelection,
  vs as updateDualRangeValues,
  Ss as updateSegmentCollectionSelection,
  ks as updateSegmentRangeSelection,
  Pa as updateSegmentSelection,
  ma as validateDerivationRuleDraft,
  Po as validateSegmentTiming,
  to as videoPerformerOptions,
  Fr as videoPerformerSlotAssignments,
  Ys as visibleSegmentStudioSettingsTabs,
  Js as visibleSegmentStudioTabs,
  ti as visibleVirtualRows
};
