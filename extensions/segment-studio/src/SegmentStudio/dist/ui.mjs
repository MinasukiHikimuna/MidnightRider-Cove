import Yr from "@cove/runtime/react";
import { createPortal as _i } from "@cove/runtime/react-dom";
import { extensionFetch as ya } from "@cove/runtime/api";
import { formatDuration as Hi, EntityReferenceSelector as Dn, useExtensionKeyboardBindings as qi, VideoPlayer as ba, useRegisterExtensionKeyboardActions as ha, getDefaultFilter as va, useListUrlState as xa, ListPage as Sa } from "@cove/runtime/components";
import { ChevronDown as ka, Loader2 as Wi } from "@cove/runtime/lucide-react";
const Qr = "com.midnightrider.segment-studio", wa = "segment-studio.layout.v1", Ht = "segment-studio.operations.v1", Na = "segment-studio.collapsed-segment-groups.v1", Ia = "segment-studio.playback-shortcuts.v1", $a = "segment-studio.timing-clipboard.v1", Ca = "segment-studio.hide-derived-segments.v1", Ta = "segment-studio.merge-confirmation.v1", nt = ["unreviewed", "approved", "rejected"], Vi = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], Mo = "(min-width: 1024px) and (min-height: 640px)", Eo = "(min-width: 1024px) and (min-height: 900px)", On = 1e-3, Do = 15, Ji = 30, Aa = 12, it = {
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
}, At = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function Oo(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function Ra(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? lr(e, null, 1, !0) ?? r[0] ?? null;
}
function lr(e, t, r, o = !1) {
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
function Yi(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((g, m) => g.markers.filter(({ segment: u }) => {
    const p = Number(u.startSec), f = u.endSec == null ? p + Ji : Number(u.endSec);
    return Number.isFinite(p) && Number.isFinite(f) && f >= p && p <= i + Do + On && f >= i - Do - On;
  }).map(({ segment: u }) => ({ segment: u, laneIndex: m }))).sort((g, m) => g.laneIndex - m.laneIndex || Math.abs(g.segment.startSec - i) - Math.abs(m.segment.startSec - i) || g.segment.id - m.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((g) => g.markers.some((m) => m.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((g) => g.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((g) => g.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((g) => g.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function Qi(e, t, r) {
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
function dr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function yc(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function Zi(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function bc(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function Xi(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function es(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function ts(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function ns(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Gr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function rs(e, t, r = 10) {
  const o = Gr(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function Po(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function os(e, t = Aa) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function Ma(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : it.timelineRatio;
}
function Ur(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function zt(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? it.detailWidth : Math.min(Ur(t, 0), Math.max(240, e));
}
function sr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? it.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function as(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function Xr(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: it.timelineRatio, maximum: it.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function eo(e, t) {
  const r = Ma(e);
  if (!(t > 0)) return r;
  const o = Xr(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function is(e) {
  if (!e) return { ...it };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? Ma(r) : it.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: zt(t == null ? void 0 : t.detailWidth),
      markerRailWidth: zt(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: sr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...it };
  }
}
function ss(e, t, r) {
  return r > 0 ? eo((t + r - e) / r, r) : it.timelineRatio;
}
function hc(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function ls(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, g) => c.startSec - g.startSec || c.id - g.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= On ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function Kt(e, t, r, o) {
  return e === t && r === o;
}
const cr = "__segment-studio-cleared-selection__";
function ds(e) {
  return e === "true";
}
function cs(e) {
  return e !== "false";
}
function Ea() {
  try {
    return cs(window.localStorage.getItem(Ta));
  } catch {
    return !0;
  }
}
function Da(e) {
  try {
    window.localStorage.setItem(Ta, String(!!e));
  } catch {
  }
}
function us(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function ut(e = {}) {
  const t = nt.filter((g) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(g) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (g, m) => {
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
function Or(e, t, r, o = !1, i = []) {
  var c, g;
  const a = ut(r), s = a.performerId == null ? null : new Set((t || []).filter((m) => Number(m.performerId) === a.performerId).map((m) => m.segmentId)), l = new Set((i || []).flatMap((m) => m.tags || []).map((m) => Number(m.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((g = (c = (i || []).find((m) => Number(m.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : g.map((m) => Number(m.tagId))) || []);
  return us(e || [], o).filter((m) => {
    if (m.reviewState != null && !a.reviewStates.includes(m.reviewState) || s && !s.has(m.id) || a.tagId != null && Number(m.tagId) !== a.tagId || d && !d.has(Number(m.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(m.tagId)) || a.sourceKey != null && m.sourceKey !== a.sourceKey) return !1;
    const u = Number(m.confidence);
    return m.confidence == null || !Number.isFinite(u) ? a.includeUnscored : u >= a.confidenceMin && u <= a.confidenceMax;
  });
}
function ms(e, t, r, o = !1, i = []) {
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
function gs(e, t = !1) {
  const r = ut(e);
  return +(r.reviewStates.length !== nt.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function ps(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function fs(e, t, r, o) {
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
function ys(e, t, r = null) {
  return t === cr ? null : Ra(
    e,
    t ?? r
  );
}
function Oa(e, t, r, o = !1) {
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
function bs(e, t, r) {
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
function hs(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return Oa(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function vs(e, t, r = null, o = !1) {
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
      ...hs(m, s, t, g, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: m
    };
  }
  const d = Oa(i, a, t, o);
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
function xs(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function Ss(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function Lo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function Fo(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => Lo(t, o) - Lo(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function ks(e, t, r) {
  var c, g;
  const o = e || [], i = new Set(t || []), a = o.findIndex((m) => (m.markers || []).some(({ segment: u }) => u.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: m }) => m.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const m of o) {
      const u = (m.markers || []).find(({ segment: p }) => !i.has(p.id));
      if (u) return u.segment;
    }
    return null;
  }
  const l = Fo(
    o[a].markers,
    s,
    i
  );
  if (l) return l;
  const d = (g = o.map((m, u) => ({ lane: m, index: u })).filter(({ lane: m }) => (m.markers || []).some(({ segment: u }) => !i.has(u.id))).sort((m, u) => Math.abs(m.index - a) - Math.abs(u.index - a) || +(m.index < a) - +(u.index < a) || m.index - u.index)[0]) == null ? void 0 : g.lane;
  return Fo(d == null ? void 0 : d.markers, s, i);
}
function ws(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function Ns(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function Is(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function $s() {
  try {
    return ds(window.localStorage.getItem(Ca));
  } catch {
    return !1;
  }
}
function Cs(e) {
  try {
    window.localStorage.setItem(Ca, String(!!e));
  } catch {
  }
}
const jn = [
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
], Ts = /* @__PURE__ */ new Set([
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
function As(e) {
  return Ts.has(e);
}
function Pa(e) {
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
function Rs(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(jn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(Pa).filter(Boolean)]));
  } catch {
    return {};
  }
}
function Ms(e = {}) {
  const t = Rs(e);
  return jn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function jo(e, t = 2) {
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
function vc(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : Pa({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function xc(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function Kr(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function Bo(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function Sc(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = Bo(e.code, t.key), a = Bo(t.code, e.key);
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
          if (Kr(u, e) && Kr(u, t)) return !0;
        }
  return !1;
}
function un(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function kc(e, t) {
  return [!1, !0].some((r) => un(e, r) && un(t, r));
}
function Es(e, t = !1, r = {}) {
  return Ms(r).find((o) => un(o, t) && o.bindings.some((i) => Kr(e, i))) || null;
}
function La(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function Ds(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(La).join(" / ") : "Unassigned";
}
function wc(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, Ds(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function Nc(e) {
  return e === "review" ? "review" : "editor";
}
function Ue(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function Os(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function Ps(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function Ls(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => Ue(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: Ue(t, e.activeIdentity) || r[0]
  };
}
function Fs(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function js(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => Fs(o, i))));
}
function Go(e, t) {
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
function Bs(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function Gs(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function zr(e, t) {
  return e === t;
}
function Us(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function Ks(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - On).at(-1) || null : o.find((i) => i.startSec > t + On) || null;
}
function Mn(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function Uo(e) {
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
function Ic(e, t = null, r = !1) {
  const o = Uo(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function dn(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function Fa(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: dn(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: dn(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: dn(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(dn(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(dn(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(dn(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...Zr };
  }
}
function zs(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function ja() {
  try {
    return Fa(window.localStorage.getItem(Ia));
  } catch {
    return { ...Zr };
  }
}
function Ko(e) {
  const t = Fa(JSON.stringify(e));
  try {
    window.localStorage.setItem(Ia, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Rt = Object.freeze({
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
function Ba(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? _r(e.requestedMode) : "basic",
    effectiveMode: i ? _r(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function mn(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function _s(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Hs(e) {
  const t = [];
  return mn(e, Rt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), mn(e, Rt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function qs(e) {
  return [
    ["general", "General", Rt.settingsGeneral],
    ["shortcuts", "Shortcuts", Rt.settingsShortcuts],
    ["performer-slots", "Performer slots", Rt.settingsPerformerSlots],
    ["derivation", "Derivation", Rt.settingsDerivation]
  ].filter(([, , r]) => mn(e, r)).map(([r, o]) => [r, o]);
}
function Ws(e, t) {
  return e === "segments" && !mn(
    t,
    Rt.navigationSegmentInventory
  ) || e === "bin" && !mn(
    t,
    Rt.recyclingBinView
  ) ? "videos" : e;
}
function Vs(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Js(e, t = 0) {
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
}, zo = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: nt.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function Ys(e) {
  const t = String(e || "").split(",").filter((r) => nt.includes(r));
  return t.length === 0 ? [...nt] : [...new Set(t)];
}
function cn(e) {
  return Ga(e).values;
}
function Ga(e) {
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
function _o(e, t) {
  var l;
  const r = Ho(t.activitiesCriterion, t.activityId), o = Ho(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = Ga(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: Qs(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function Ho(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function Qs(e, t) {
  return nt.includes(e == null ? void 0 : e.value) ? [e.value] : Ys(t);
}
function Ua(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Zs(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Xs(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function qo(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function el(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function qe(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function to(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Fr(e, t) {
  const r = new Set(to(t).map((o) => String(qe(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function Ot(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function Wo(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(Ot).sort().join(",")}`;
}
function Ka(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((p) => String(p.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((p) => {
    var f;
    return !((f = p.genderHints) != null && f.length);
  }) && e.length === t.length && !i) {
    const p = [...e].sort((b, y) => String(b.slotDefinitionId).localeCompare(String(y.slotDefinitionId))), f = [...t].sort((b, y) => String(b.name).localeCompare(String(y.name)) || Number(qe(b)) - Number(qe(y)));
    return [{
      assignments: Object.fromEntries(p.map((b, y) => [String(b.slotDefinitionId), String(qe(f[y]))])),
      description: f.map((b) => b.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((p) => t.map((f, b) => ({ performer: f, index: b })).filter(({ performer: f }) => {
    var b;
    return !((b = p.genderHints) != null && b.length) || p.genderHints.some((y) => Ot(y) === Ot(f.gender || f.genderIdentity));
  }).map(({ index: f }) => f)), g = i ? c.filter((p) => p.length > 0).length : Vo(c, t.length);
  if (g === 0) return [];
  const m = new Map(t.map((p, f) => [String(qe(p)), f]));
  function u(p, f, b) {
    if (s.length >= a) return;
    const y = c.slice(p), w = i ? y.filter((O) => O.length > 0).length : Vo(y.map((O) => O.filter((W) => !f.has(String(qe(t[W]))))), t.length);
    if (b + w < g) return;
    if (p === e.length) {
      if (b !== g) return;
      const O = Object.fromEntries(d.map(({ slot: R, performer: I }) => [String(R.slotDefinitionId), I ? String(qe(I)) : ""])), W = o.length === 0 ? Object.values(O).sort().join(",") : [...new Set(e.map((R) => String(R.label || "")))].map((R) => `${R}:${d.filter(({ slot: I }) => String(I.label || "") === R).map(({ performer: I }) => I ? String(qe(I)) : "").sort().join(",")}`).join("|");
      !l.has(W) && s.length < a && (l.add(W), s.push({
        assignments: O,
        description: d.map(({ slot: R, performer: I }) => o.length ? `${R.label}: ${(I == null ? void 0 : I.name) || "Unassigned"}` : (I == null ? void 0 : I.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const S = e[p], N = [...d].reverse().find(({ slot: O }) => Wo(O) === Wo(S)), q = N ? m.get(String(qe(N.performer))) : -1;
    for (const O of c[p]) {
      const W = t[O], R = qe(W);
      if (!(O < q) && !(R == null || !i && f.has(String(R))) && (d.push({ slot: S, performer: W }), i || f.add(String(R)), u(p + 1, f, b + 1), i || f.delete(String(R)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: S, performer: null }), u(p + 1, f, b), d.pop();
  }
  return u(0, /* @__PURE__ */ new Set(), 0), s;
}
function Vo(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function tl(e, t) {
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
      !o && d.has(m.performerId) || (g = c.genderHints) != null && g.length && !c.genderHints.some((u) => Ot(u) === Ot(m.gender)) || (a.push({ slot: c, performer: m }), o || d.add(m.performerId), s(l + 1, d), o || d.delete(m.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function nl(e) {
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
function rl(e, t, r = 20) {
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
function ol(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function al(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function za(e, t, r) {
  const o = qe, i = new Set((t || []).map(o)), a = new Set((r || []).map(Ot));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const m = Ot(l.gender || l.genderIdentity), u = Ot(d.gender || d.genderIdentity), p = l.matchesGenderHint ?? a.has(m);
    return (d.matchesGenderHint ?? a.has(u)) - p || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: ye, useId: _a, useMemo: Be, useRef: fe, useState: L } = Yr, n = Yr.createElement, Ha = "/api/plugins/segment-studio";
function Pe(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Ht) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = Hr();
    return t[e] = r, window.localStorage.setItem(Ht, JSON.stringify(t)), r;
  } catch {
    return Hr();
  }
}
function Le(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Ht) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(Ht, JSON.stringify(t));
  } catch {
  }
}
function no(e) {
  try {
    return JSON.parse(window.localStorage.getItem(Ht) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function ro(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Ht) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(Ht, JSON.stringify(t));
  } catch {
  }
}
function il(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function sl(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function ee(e, t, r = 0) {
  var d;
  const o = await ya(`${Ha}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = il(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await sl(250 * (r + 1), t == null ? void 0 : t.signal), ee(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function ll(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${Ha}${e}`, o = await ya(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: dl(
      o.headers.get("Content-Disposition")
    )
  };
}
function dl(e, t = "segment-studio-ai-feedback.zip") {
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
function qa(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function cl(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function Wa(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function ul(e, t) {
  const { sceneCount: r, segmentCount: o } = Wa(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function Va(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = Wa(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(ul(r, o.segmentCount)))
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
function Jo({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const bt = {
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
function $c(e, t) {
  return {
    ...(bt[e] || bt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function Ja(e) {
  return { ...(bt[e] || bt.unreviewed).badge };
}
function Ya(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const Qa = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function ml(e, t, r = "not-applicable", o = !1) {
  const i = bt[e] || bt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function gl(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function pl(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function fl(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function yl(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function pr(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function bl(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function qt({ state: e, includeLabel: t = !0 }) {
  const r = bt[e] || bt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: Ja(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function hl(e, t = null) {
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
function Cc(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function vl(e, t = document) {
  return !(e.defaultPrevented || hl(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function Tc(e, t = document, r = !1, o = {}) {
  return vl(e, t) ? Es(e, r, o) != null : !1;
}
function st(e, { onCancel: t, onConfirm: r } = {}) {
  var s, l;
  if (e.key === "Enter" && (e.isComposing || (s = e.nativeEvent) != null && s.isComposing || e.keyCode === 229)) return !1;
  const o = typeof ((l = e.target) == null ? void 0 : l.closest) == "function" ? e.target.closest("button, a, select, option, textarea") : e.target, i = String((o == null ? void 0 : o.tagName) || "").toLowerCase();
  if (i === "select" || i === "option" || e.key === "Enter" && (e.repeat || ["button", "a", "textarea"].includes(i))) return !1;
  const a = e.key === "Escape" ? t : e.key === "Enter" ? r : null;
  return a ? (e.preventDefault(), e.stopPropagation(), a(), !0) : !1;
}
function xl(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
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
function Sl(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? i.filter((a) => a.sequence > o && a.sequence <= r).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > r && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function oo(e, t = !0) {
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
function rr(e, t = !0) {
  return {
    type: "segment",
    identity: oo(e, t),
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
      identity: oo(r, t),
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
function or(e, t) {
  return {
    type: "incorrectExamples",
    collected: t,
    entries: (e || []).map(({ segment: r, result: o, example: i }) => ({
      exampleId: (o == null ? void 0 : o.exampleId) ?? (i == null ? void 0 : i.id) ?? null,
      originalIdentity: oo(r),
      collectedIdentity: {
        itemId: (o == null ? void 0 : o.itemId) ?? (i == null ? void 0 : i.itemId) ?? null,
        nativeSegmentId: (o == null ? void 0 : o.nativeSegmentId) ?? null,
        published: (o == null ? void 0 : o.nativeSegmentId) != null,
        revision: (o == null ? void 0 : o.revision) ?? null
      }
    }))
  };
}
function ur(e) {
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
function Za(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function Xa(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = t.get(r.segmentId);
    o ? o.push(r) : t.set(r.segmentId, [r]);
  }
  for (const r of t.values())
    r.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function ao(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function kl(e, t) {
  const r = (t || []).map((i) => Za(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: rt(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function wl(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : kl(e, t);
}
function Nl({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function Ac(e, t) {
  return ao(Za(e, t));
}
function rt(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function Il(e, t) {
  const r = (d) => rt(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
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
function $l(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = Il(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function Cl(e) {
  const t = rt(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(fr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function fr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function mr(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function Yo(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((g) => g.end <= s && g.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: mr(o),
    trackCount: Math.max(1, t.length)
  };
}
function Tl(e) {
  const t = e.map(rt), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function Al(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], g = d.length > 0 && d.every((m) => Number(m.performerId) > 0) ? d.map((m) => `${m.slotDefinitionId}:${Number(m.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: g };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [Yo({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = Tl(l.slots), g = l.slots.filter((b) => !a.has(String(b.slotDefinitionId))), m = o.length === 1 ? l.slots : g, u = m.map((b) => `${c.get(String(b.slotDefinitionId))} · ${b.performerName || `Performer ${b.performerId}`}`).join(" · "), p = [...new Map(m.map((b) => [
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
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(Yo);
}
function _t(e, t = [], r = []) {
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => Al(s, a));
}
function io(e) {
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
const Rl = {
  group: 38,
  lane: 33,
  segment: 41
};
function Ml(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = Rl[s.kind];
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
function ei(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function El(e, t = [], r = !0) {
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
function Dl(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: mr(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return io(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: mr(a)
    };
  });
}
function ti(e, { nativeOnly: t = !1 } = {}) {
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
function Qo(e, t) {
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
function Pn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function Ol(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var r;
    return (r = t[0]) == null ? void 0 : r.toUpperCase();
  }).join("") || "?";
}
function Ln({ performer: e, compact: t = !1, tooltip: r = null }) {
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
    }, o ? Ol(e.name) : "—"),
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
function ni({ assignments: e, className: t = "" }) {
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
      n(Ln, {
        key: `${r.key}:avatar`,
        performer: r.performer
      })
    ];
  }));
}
function yr({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = fe(null), i = `performer-slots-${_a()}`, [a, s] = L(null);
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
    ...e.slice(0, 3).map((c) => n(Ln, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? _i(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(ni, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : n("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => n(Ln, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function Pl(e, t) {
  const r = new Set(Lt(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function ri(e, t) {
  return t ? Lt(e).filter((r) => r !== t) : Lt(e);
}
function Ll(e, t) {
  const r = Lt(t), o = new Set(Lt(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function yt(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function Zo(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), g = Number.isFinite(c) && c >= d ? c : d, m = d <= o && g >= o, u = m ? 0 : Math.min(Math.abs(o - d), Math.abs(o - g));
    return { contains: m, distance: u, duration: g - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function qr(e, t, r, o = null) {
  var g, m, u, p, f, b;
  const i = e.findIndex((y) => y.markers.some((w) => w.segment.id === t));
  if (i < 0) {
    const y = [...((g = e[0]) == null ? void 0 : g.markers) || []];
    return o != null && Number.isFinite(Number(o)) && y.sort((w, S) => Zo(w, S, o)), ((m = y[0]) == null ? void 0 : m.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((y) => y.segment.id === t);
  if (r === "left" || r === "right") {
    const y = r === "left" ? -1 : 1, w = Math.min(a.markers.length - 1, Math.max(0, s + y));
    return ((u = a.markers[w]) == null ? void 0 : u.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((p = a.markers[s]) == null ? void 0 : p.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((f = a.markers[s]) == null ? void 0 : f.segment) ?? null : ((b = [...e[l].markers].sort(c ? (y, w) => Zo(y, w, Number(o)) : (y, w) => Math.abs(y.segment.startSec - d) - Math.abs(w.segment.startSec - d) || y.segment.startSec - w.segment.startSec || y.segment.id - w.segment.id)[0]) == null ? void 0 : b.segment) ?? null;
}
function Fl(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = qr([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function jl(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function Bl(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function Gl(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [ta(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => ta(Math.min(s, r + l))))];
}
function Ul(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function Kl(e, t) {
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
function Xo(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function zl(e) {
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
async function _l(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await ea(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], g = Gl(
        d.startSec,
        d.endSec
      );
      for (const [m, u] of g.entries()) {
        Math.abs(r.currentTime - u) > 5e-4 && (r.currentTime = u, await ea(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const p = await Hl(o), f = `example-${l + 1}-frame-${m + 1}`;
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
function ea(e, t) {
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
function Hl(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function ta(e) {
  return Math.round(e * 1e3) / 1e3;
}
function gr(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function ql(e, t) {
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
function Fn(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function oi(e, t) {
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
function Wl(e, t) {
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
function na(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function Vl(e) {
  const { compatibilityMode: t, currentTime: r, detail: o, editorFilters: i, endInput: a, hideDerivedSegments: s, historyRef: l, mediaDuration: d, onConflict: c, onDetailChange: g, onReload: m, optimisticSegmentIdRef: u, pendingDuplicateRef: p, pendingFirstSegmentStartSecRef: f, pendingTagEditSegmentIdRef: b, replaceSegmentSelection: y, savingSegmentId: w, segments: S, selectedSegment: N, selectedSegmentIdRef: q, selectedSegments: O, selectionAnchorIdRef: W, selectionRangeBaseIdsRef: R, setEditorFilters: I, setFirstSegmentTagOpen: A, setHideDerivedSegments: P, setHistory: _, setHistoryOpen: K, setPublishApprovedError: Y, setSaveMessage: k, setSavingSegmentId: T, setSelectedSegmentGroupKey: U, setSelectedSegmentId: Z, setSelectedSegmentIds: ie, startInput: ue, timelineDuration: ge, video: F } = e;
  function X($) {
    l.current = $ || At, _(l.current);
  }
  async function ce($, le, G, v, C = null) {
    var x;
    try {
      const h = await ee(`/videos/${F.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: l.current.revision,
          kind: $,
          label: le,
          beforeState: G,
          afterState: v,
          receiptId: C
        })
      });
      return X(h), !0;
    } catch (h) {
      return h.status === 409 && ((x = h.payload) != null && x.current) && X(h.payload.current), k("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function ae($, le, G = !0, v = null, C = !1, x = le) {
    var Q;
    if (!$ || w != null) return null;
    const h = O.map((ke) => ke.id), D = q.current, ne = G && !t ? crypto.randomUUID() : null;
    T($.id), k(G ? "Saving directly to Cove…" : "Restoring history…");
    const re = C ? gr(o, [$.id], x) : null;
    re && g(re, F.id);
    try {
      if (t && $.nativeSegmentId == null && $.itemId != null) {
        const z = `draft-update:${F.id}:${$.itemId}:${$.revision}:${le.tagId}:${le.startSec}:${le.endSec ?? "open"}:${le.reviewState ?? $.reviewState}`, E = await ee(`/videos/${F.id}/drafts/${$.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Pe(z),
            expectedRevision: $.revision,
            startSec: le.startSec,
            endSec: le.endSec,
            tagId: le.tagId,
            reviewState: le.reviewState
          })
        });
        Le(z);
        const oe = {
          ...$,
          ...E.draft,
          id: $.id,
          itemId: $.itemId
        };
        return G && await ce(
          "segment.update",
          v || "Changed segment",
          rr($, t),
          rr(
            oe,
            t
          )
        ), na($, le, t) ? await m() : g({
          ...o,
          approvedSetVersion: E.approvedSetVersion || o.approvedSetVersion,
          segments: S.map((ve) => ve.id === $.id ? oe : ve).sort((ve, be) => ve.startSec - be.startSec || ve.id - be.id)
        }, F.id), k(((Q = E.draft) == null ? void 0 : Q.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), oe;
      }
      const ke = await ee(`/videos/${F.id}/segments/${$.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...le,
          expectedUpdatedAt: $.updatedAt,
          historyReceiptId: ne
        })
      }), J = {
        ...$,
        ...ke,
        reviewState: le.reviewState ?? $.reviewState
      }, te = S.map((z) => z.id === $.id ? J : z).sort((z, E) => z.startSec - E.startSec || z.id - E.id);
      return na($, le, t) ? await m() : g({ ...o, segments: te }, F.id), G && await ce(
        "segment.update",
        v || "Changed segment",
        rr($, t),
        rr(
          J,
          t
        ),
        ne
      ), k(G ? "Saved to Cove" : "History restored"), J;
    } catch (ke) {
      return C && (g((J) => Fn(
        J,
        [$],
        Object.keys(x)
      ), F.id), ie(h), Z(D), W.current = D, R.current = []), ke.status === 409 ? (k("Conflict — loading the latest segment…"), await c()) : k(ke.message || "Unable to save the segment."), null;
    } finally {
      T(null);
    }
  }
  async function xe() {
    if (!t) return !1;
    const $ = S.filter((G) => !G.published && G.reviewState === "approved").length;
    if ($ === 0 || w != null) return !1;
    const le = `complete-review:${F.id}:${o.approvedSetVersion}`;
    Y(""), T(-1), k(`Publishing ${$} Approved draft${$ === 1 ? "" : "s"}…`);
    try {
      const G = await ee(`/videos/${F.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe(le),
          expectedApprovedSetVersion: o.approvedSetVersion
        })
      });
      Le(le), X(At), K(!1);
      const v = await m(), C = Us(
        S,
        q.current,
        G.published
      ), x = C ? Ue(v == null ? void 0 : v.segments, C) : null;
      return x && Z(x.id), k(`${G.published.length} Approved draft${G.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (G) {
      const v = G.status === 409 ? "The approved drafts changed. Review the updated list and try again." : G.message || "Unable to publish the approved drafts.";
      return G.status === 409 && await c(), Y(v), k(v), !1;
    } finally {
      T(null);
    }
  }
  async function Se($ = null, le = null) {
    var J;
    if (w != null) return;
    const G = $ != null ? f.current : null, v = Number.isFinite(G) ? G : r, C = Math.min(ge, v + 20);
    if (C <= v) {
      k("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const x = Gs(S, N, $);
    if (x.kind === "choose-tag") {
      f.current = v, k(""), A(!0);
      return;
    }
    if (x.kind === "invalid-selection") {
      k("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: h } = x, D = `create-draft:${F.id}:${h}:${v}`, ne = t ? null : crypto.randomUUID(), re = q.current, Q = {
      ...N || {},
      id: u.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: h,
      tagName: le || (N == null ? void 0 : N.tagName) || "Tag segment",
      tagSortName: h === (N == null ? void 0 : N.tagId) && (N == null ? void 0 : N.tagSortName) || null,
      startSec: v,
      endSec: C,
      reviewState: "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, ke = ql(o, Q);
    T(-1), A(!1), g(ke, F.id), y(Q.id), U(yt(
      _t(ke.segments, ke.segmentGroups || [], ke.performerSlots || []),
      Q.id
    ));
    try {
      let te;
      if (t) {
        const oe = await ee(`/videos/${F.id}/drafts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationId: Pe(D), tagId: h, startSec: v, endSec: C })
        });
        Le(D), te = { itemId: (J = oe.draft) == null ? void 0 : J.itemId };
      } else
        te = { nativeSegmentId: (await ee(`/videos/${F.id}/segments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tagId: h,
            startSec: v,
            endSec: C,
            historyReceiptId: ne
          })
        })).id };
      f.current = null, A(!1);
      const z = await m();
      if (!z) {
        g((oe) => Vr(
          oe,
          [Q.id]
        ), F.id), y(re), k("Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment.");
        return;
      }
      const E = Ue(z == null ? void 0 : z.segments, te);
      E ? (t || await ce(
        "segment.create",
        "Created segment",
        ct([], !1),
        ct([E], !1),
        ne
      ), x.openTagEditor && (b.current = E.id), y(E.id), U(yt(
        _t(z.segments || [], z.segmentGroups || [], z.performerSlots || []),
        E.id
      ))) : k("Segment created, but it could not be selected.");
    } catch (te) {
      g((z) => Vr(
        z,
        [Q.id]
      ), F.id), y(re), $ != null && A(!0), k(te.message || "Unable to create the draft.");
    } finally {
      T(null);
    }
  }
  async function M() {
    if (O.length !== 1 || !N || w != null) return;
    const $ = r;
    if ($ <= N.startSec || N.endSec != null && $ >= N.endSec) {
      k("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const le = `split-draft:${N.itemId}:${N.revision}:${$}`, G = t ? null : ct([N], !1), v = t ? null : crypto.randomUUID();
    T(N.id);
    try {
      let C = null;
      t && N.nativeSegmentId == null ? (await ee(`/videos/${F.id}/drafts/${N.itemId}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe(le),
          expectedRevision: N.revision,
          splitSec: $
        })
      }), Le(le)) : C = { nativeSegmentId: (await ee(`/videos/${F.id}/segments/${N.id}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedUpdatedAt: N.updatedAt,
          splitSec: $,
          historyReceiptId: v
        })
      })).id };
      const x = await m();
      if (!t) {
        const h = [
          Ue(x == null ? void 0 : x.segments, {
            nativeSegmentId: N.nativeSegmentId ?? N.id
          }),
          Ue(
            x == null ? void 0 : x.segments,
            C
          )
        ].filter(Boolean);
        await ce(
          "segment.split",
          "Split segment",
          G,
          ct(h, !1),
          v
        );
      }
      k(t ? `Segment split; both ranges remain ${N.reviewState}.` : "Segment split.");
    } catch (C) {
      C.status === 409 ? await c() : k(C.message || "Unable to split the draft.");
    } finally {
      T(null);
    }
  }
  async function V($ = !1) {
    var C, x;
    if (O.length !== 1 || !N || w != null) return;
    const le = $ ? r : N.startSec, G = Bs(F.id, N, $, le), v = t ? null : crypto.randomUUID();
    T(N.id);
    try {
      const h = ((C = p.current) == null ? void 0 : C.operationKey) === G ? p.current : null;
      let D = (h == null ? void 0 : h.duplicateIdentity) ?? null;
      if (D == null && t && N.nativeSegmentId == null) {
        const Q = await ee(`/videos/${F.id}/drafts/${N.itemId}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Pe(G),
            expectedRevision: N.revision,
            startSec: $ ? le : null
          })
        });
        D = Go(!1, Q), p.current = { operationKey: G, duplicateIdentity: D };
      } else if (D == null) {
        const Q = await ee(`/videos/${F.id}/segments/${N.id}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: N.updatedAt,
            startSec: $ ? le : null,
            historyReceiptId: v
          })
        });
        D = Go(!0, Q), p.current = { operationKey: G, duplicateIdentity: D };
      }
      const ne = await m(), re = Ue(ne == null ? void 0 : ne.segments, D);
      if (re) {
        t || await ce(
          "segment.duplicate",
          "Duplicated segment",
          ct([], !1),
          ct([re], !1),
          v
        );
        const Q = ms(
          re,
          ne.performerSlots || [],
          i,
          s,
          ne.segmentGroups || []
        );
        I(Q.filters), P(Q.hideDerivedSegments), ie([re.id]), Z(re.id), W.current = re.id, R.current = [], U(yt(
          _t(ne.segments || [], ne.segmentGroups || [], ne.performerSlots || []),
          re.id
        )), t && N.nativeSegmentId == null && Le(G), p.current = null, k($ ? "Duplicate created at the playhead." : "Duplicate created in place.");
      } else
        k("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
    } catch (h) {
      ((x = p.current) == null ? void 0 : x.operationKey) === G ? k("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : h.status === 409 ? await c() : k(h.message || "Unable to duplicate the draft.");
    } finally {
      T(null);
    }
  }
  async function H() {
    if (O.length !== 1 || !N) return;
    const $ = Number(ue), le = a.trim() === "" ? null : Number(a), G = Oo($, le, d);
    if (G.error) {
      k(G.error);
      return;
    }
    if ($ === N.startSec && le === N.endSec) {
      k("Timing is unchanged.");
      return;
    }
    await ae(N, { startSec: $, endSec: le, tagId: N.tagId }, !0, null, !0);
  }
  async function se($, le) {
    if (O.length !== 1 || !N) return;
    const G = Oo($, le, d);
    if (G.error) {
      k(G.error);
      return;
    }
    if ($ === N.startSec && le === N.endSec) {
      k("Timing is unchanged.");
      return;
    }
    await ae(N, { startSec: $, endSec: le, tagId: N.tagId }, !0, null, !0);
  }
  return { acceptHistory: X, recordHistoryAction: ce, mutateSegment: ae, completeReview: xe, createSegment: Se, splitSegment: M, duplicateSegment: V, saveTiming: H, applyShortcutTiming: se };
}
function Jl() {
  const [e, t] = L(() => typeof window < "u" && window.matchMedia(Mo).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Mo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Yl() {
  const [e, t] = L(() => typeof window < "u" && window.matchMedia(Eo).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Eo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Ql() {
  try {
    return is(window.localStorage.getItem(wa));
  } catch {
    return { ...it };
  }
}
function Zl() {
  try {
    return Lt(JSON.parse(window.localStorage.getItem(Na) || "[]"));
  } catch {
    return [];
  }
}
function Xl(e) {
  try {
    window.localStorage.setItem(Na, JSON.stringify(Lt(e)));
  } catch {
  }
}
function ed(e) {
  try {
    window.localStorage.setItem(wa, JSON.stringify(e));
  } catch {
  }
}
function td() {
  try {
    const e = JSON.parse(window.localStorage.getItem($a) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function nd(e) {
  try {
    return window.localStorage.setItem($a, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function rd({ status: e }) {
  const t = Qa[e];
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
      ...Ja(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${bt[t].symbol}${e[t]}`)));
}
function od({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: g, shortcutRef: m }) {
  const u = to(a), [p, f] = L(() => Fr(o, u)), [b, y] = L(!1), [w, S] = L(""), N = fe(!1), q = o.map((P) => `${P.slotDefinitionId}:${P.performerId || ""}`).join("|"), O = u.map((P) => qe(P)).join("|"), W = Ka(
    o,
    u
  );
  ye(() => {
    f(Fr(o, u)), S("");
  }, [t, r, q, O]);
  async function R(P = p) {
    if (!N.current) {
      N.current = !0, y(!0), S("Saving performer slots…");
      try {
        const _ = Fr(o.map((k) => ({
          ...k,
          performerId: P[k.slotDefinitionId] || null
        })), u), K = o.map((k) => {
          const T = _[k.slotDefinitionId] ? Number(_[k.slotDefinitionId]) : null, U = u.find((Z) => String(qe(Z)) === String(T));
          return {
            ...k,
            performerId: T,
            performerName: (U == null ? void 0 : U.name) || null
          };
        });
        s(K);
        const Y = await ee(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((k) => ({ slotDefinitionId: k.slotDefinitionId, performerId: _[k.slotDefinitionId] ? Number(_[k.slotDefinitionId]) : null }))
          })
        });
        S("Performer slots saved."), await l(Y, {
          beforeState: ur([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: ur([{
            segmentId: t,
            itemId: r,
            revision: Y.revision,
            slots: Y.slots || []
          }])
        });
      } catch (_) {
        d && await d(o, _), _.status === 409 ? (S("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : S(_.message || "Unable to save performer slots.");
      } finally {
        N.current = !1, y(!1);
      }
    }
  }
  function I(P, _) {
    S(`Option ${_ + 1} applied; save to confirm.`), f({ ...p, ...P.assignments });
  }
  async function A(P) {
    const _ = { ...p, ...P.assignments };
    f(_), await R(_);
  }
  return ye(() => {
    if (m)
      return m.current = (P) => N.current || !W[P] ? !1 : (A(W[P]), !0), () => {
        m.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    W.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, W.map((P, _) => n("button", {
        key: _,
        type: "button",
        disabled: b,
        onClick: () => I(P, _),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${_ + 1}: ${P.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, _ + 1),
        n("span", { key: "description" }, P.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${W.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((P) => n("label", { key: P.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, rt(P)),
      (P.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(P.genderHints || []).map(fr).join(" · ")}`) : null,
      n("select", { key: "select", value: p[P.slotDefinitionId] || "", disabled: b, onChange: (_) => f({ ...p, [P.slotDefinitionId]: _.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...za(u, u, P.genderHints).map((_) => n("option", { key: qe(_), value: qe(_) }, _.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: g, type: "button", disabled: b, onClick: () => R(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, w)])
  ]);
}
function ad({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a }) {
  var W;
  const s = ((W = t[0]) == null ? void 0 : W.slots) || [], l = to(r), d = Ka(
    s,
    l
  ), c = "__mixed__", g = () => Object.fromEntries(s.map((R, I) => {
    const A = t.map((P) => {
      var _;
      return String(((_ = P.slots[I]) == null ? void 0 : _.performerId) || "");
    });
    return [R.slotDefinitionId, A.every((P) => P === A[0]) ? A[0] : c];
  })), [m, u] = L(g), [p, f] = L(!1), [b, y] = L(""), w = fe(!1), S = t.map((R) => `${R.itemId ?? `native:${R.segmentId}`}:${R.revision}:${R.slots.map((I) => `${I.slotDefinitionId}:${I.performerId || ""}`).join(",")}`).join("|");
  ye(() => {
    u(g());
  }, [S]);
  async function N(R = m) {
    if (w.current) return;
    w.current = !0, f(!0), y(`Saving performer slots for ${t.length} segments…`);
    const I = [];
    try {
      for (const A of t) {
        const P = A.slots.map((K, Y) => {
          const k = R[s[Y].slotDefinitionId];
          return {
            slotDefinitionId: K.slotDefinitionId,
            performerId: k === c ? K.performerId || null : k ? Number(k) : null
          };
        }), _ = await ee(A.itemId != null ? `/videos/${e}/drafts/${A.itemId}/slots` : `/videos/${e}/segments/${A.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: A.revision, assignments: P })
        });
        I.push({
          segmentId: A.segmentId,
          itemId: A.itemId,
          revision: _.revision,
          slots: _.slots || []
        });
      }
      y("Performer slots saved."), o({
        beforeState: ur(t),
        afterState: ur(I)
      });
    } catch (A) {
      const P = await i();
      A.status === 409 ? y(P ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : y(A.message || (P ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      w.current = !1, f(!1);
    }
  }
  function q(R, I) {
    y(`Option ${I + 1} applied; save to confirm.`), u({ ...m, ...R.assignments });
  }
  async function O(R) {
    const I = { ...m, ...R.assignments };
    u(I), await N(I);
  }
  return ye(() => {
    if (a)
      return a.current = (R) => w.current || !d[R] ? !1 : (O(d[R]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, d.map((R, I) => n("button", {
        key: I,
        type: "button",
        disabled: p,
        onClick: () => q(R, I),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${I + 1} to all selected segments: ${R.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, I + 1),
        n("span", { key: "description" }, R.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${d.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, s.map((R) => n("label", {
      key: R.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, rt(R)),
      n("select", {
        key: "select",
        value: m[R.slotDefinitionId] || "",
        disabled: p,
        onChange: (I) => u({ ...m, [R.slotDefinitionId]: I.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        m[R.slotDefinitionId] === c ? n("option", { key: "mixed", value: c }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...za(l, l, R.genderHints).map((I) => n("option", {
          key: qe(I),
          value: qe(I)
        }, I.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: p,
        onClick: () => N(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, b)
    ])
  ]);
}
function ht(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function id(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return ht(t);
  const o = [...new Set(r.map((i) => ht(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function br() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function ar({ name: e }) {
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
function sd({ hidden: e }) {
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
    n(br, { key: "derived" })
  ]);
}
function ld({ segment: e, provenance: t }) {
  var g;
  const [r, o] = L(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = id(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
            ht(m.sourceKey, m.sourceDisplayName)
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
function dd({
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
  const [m, u] = L([]), p = e.flatMap((w) => w.lanes.map((S) => S.key)), f = p.join("|");
  ye(() => {
    const w = new Set(p);
    u((S) => S.filter((N) => w.has(N)));
  }, [f]);
  const b = mr(t), y = !!ti(
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
      a ? n(Pt, { key: "counts", counts: b }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      Nl({ mergeable: y, reviewable: a, tagEditable: s, slotsEditable: l })
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
        const N = m.includes(S.key), q = S.markers.some(({ segment: W }) => W.id === r), O = `selected-segment-lane-${S.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: S.key,
          "data-selected-segment-lane": S.key,
          className: `rounded-md border ${q ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": N,
            "aria-controls": O,
            "aria-current": q ? "true" : void 0,
            onClick: () => u((W) => N ? W.filter((R) => R !== S.key) : [...W, S.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, N ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Pn(S)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(S.selectedCount)),
            a ? n(Pt, { key: "states", counts: S.counts }) : null
          ]),
          N ? n("div", {
            key: "segments",
            id: O,
            className: "space-y-1 border-t border-border p-1.5"
          }, S.markers.map(({ segment: W }) => {
            const R = W.endSec == null ? Me(W.startSec) : `${Me(W.startSec)} – ${Me(W.endSec)}`;
            return n("button", {
              key: W.id,
              type: "button",
              onClick: () => i(W),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${W.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${W.tagName || "Segment"}, ${W.reviewState}, ${R}` : `${W.tagName || "Segment"}, ${R}`,
              "aria-current": W.id === r ? "true" : void 0
            }, [
              a ? n(qt, {
                key: "state",
                state: W.reviewState,
                includeLabel: !1
              }) : null,
              W.isDerived ? n(br, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, R),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                ht(W.sourceKey)
              )
            ]);
          })) : null
        ]);
      })
    ]))
  ]);
}
const An = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"]
}, ra = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], oa = [
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
function Bn(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function ai(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function aa(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function ir(e, t, r, o = null) {
  const i = aa(t), a = aa(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function cd(e, t, r = null) {
  var m, u, p;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (m = t.hasSegmentsCriterion) == null ? void 0 : m.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), ir(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), ir(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), ir(o, t.performersCriterion, "performer"), ir(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = ia(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = ia(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((u = t.reviewStateCriterion) == null ? void 0 : u.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const g = (p = t.shotBoundariesCriterion) == null ? void 0 : p.value;
  return r && typeof g == "boolean" ? o.set("hasShotBoundaries", String(g)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function ia(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function ud(e, t, r, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((g) => a.add(g));
  } else a.has(r) ? a.delete(r) : a.add(r);
  return a;
}
function ii({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(Jo, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, nt.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = bt[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(Jo, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function si({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
function md({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      onClick: (l) => Bn(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      n(si, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, Hi(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(ii, { item: e, showReviewStates: r }))
    ])
  ]);
}
function gd({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n(si, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
    n(i ? "div" : "a", {
      key: "link",
      href: i ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: i ? void 0 : (l) => Bn(l, t, s),
      className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
      n("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
        n("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
        n(ii, { key: "segments", item: e, showReviewStates: r })
      ]),
      n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function so({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = Hs(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => Bn(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && mn(
        o,
        Rt.recyclingBinView
      ) ? n(li, { key: "bin", onNavigate: t }) : null,
      n(di, { key: "settings", onNavigate: t })
    ])
  ]);
}
const Jr = "segment-studio:recycling-bin-changed";
function pd(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function En() {
  window.dispatchEvent(new CustomEvent(Jr));
}
function li({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = L(null);
  ye(() => {
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
    return l(), window.addEventListener(Jr, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(Jr, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = pd(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => Bn(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function di({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => Bn(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function fd({ mode: e, onModeChange: t, disabled: r = !1 }) {
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
function yd({ minimum: e, maximum: t, onChange: r }) {
  const o = fe(null), [i, a] = L("maximum"), s = (u, p) => {
    const f = fs(e, t, u, p);
    a(f.coincidentTop), r({ minimum: f.minimum, maximum: f.maximum });
  }, l = (u, p) => {
    var b;
    const f = (b = o.current) == null ? void 0 : b.getBoundingClientRect();
    f && s(u, ps(p.clientX, f.left, f.width));
  }, d = (u, p) => {
    var f, b;
    p.preventDefault(), (b = (f = p.currentTarget).setPointerCapture) == null || b.call(f, p.pointerId), l(u, p);
  }, c = (u, p) => {
    var f, b;
    (b = (f = p.currentTarget).hasPointerCapture) != null && b.call(f, p.pointerId) && l(u, p);
  }, g = (u, p) => {
    const f = u === "minimum" ? e : t, b = u === "minimum" ? 0 : e, y = u === "minimum" ? t : 1, w = p.shiftKey ? 0.1 : 0.01;
    let S = null;
    ["ArrowLeft", "ArrowDown"].includes(p.key) && (S = f - w), ["ArrowRight", "ArrowUp"].includes(p.key) && (S = f + w), p.key === "PageDown" && (S = f - 0.1), p.key === "PageUp" && (S = f + 0.1), p.key === "Home" && (S = b), p.key === "End" && (S = y), S != null && (p.preventDefault(), s(u, Math.min(y, Math.max(b, S))));
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
function bd({ saving: e, error: t, onSelect: r, onClose: o }) {
  const i = fe(null);
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
    onKeyDownCapture: (s) => st(s, { onCancel: a })
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
    n(Dn, {
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
function hd({
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
  const m = ut(e), u = [...new Map((a || []).map((y) => [
    Number(y.tagId),
    y.tagName || `Tag ${y.tagId}`
  ])).entries()].sort((y, w) => y[1].localeCompare(w[1]) || y[0] - w[0]), p = (y) => d(ut({ ...m, ...y })), f = (y) => p({
    reviewStates: m.reviewStates.includes(y) ? m.reviewStates.filter((w) => w !== y) : [...m.reviewStates, y]
  }), b = (y) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${y ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (y) => {
      y.target === y.currentTarget && g();
    },
    onKeyDownCapture: (y) => st(y, { onCancel: g })
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
        n("div", { className: "flex flex-wrap gap-2" }, nt.map((y) => {
          const w = m.reviewStates.includes(y), S = bt[y];
          return n("button", {
            key: y,
            type: "button",
            onClick: () => f(y),
            "aria-pressed": w,
            className: b(w)
          }, `${S.symbol} ${y} (${i[y] || 0})`);
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
            const w = Number(qe(y));
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
          }, ht(y)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(yd, {
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
        n(sd, { key: "icon", hidden: t }),
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
function vd({ reviewMode: e, bindings: t, onClose: r }) {
  const o = jn.filter((l) => un(l, e)), i = jo(o, 1)[0], a = jo(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((g) => n("div", { key: g.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, g.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[g.id] ? t[g.id].length > 0 ? t[g.id] : ["Unassigned"] : g.bindings.map(La)).map((m, u) => n("kbd", { key: `${g.id}:${u}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, m))
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
    onKeyDownCapture: (l) => st(l, { onCancel: r })
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
function xd({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = zl(e), [l, d] = L([]), c = s.map((g) => g.tagName).join("|");
  return ye(() => {
    const g = new Set(s.map((m) => m.tagName));
    d((m) => m.filter((u) => g.has(u)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (g) => st(g, {
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
            style: { background: pr(!1) }
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
            const b = `${Me(f.startSec)}${f.endSec == null ? "" : ` – ${Me(f.endSec)}`}`, y = r === f.id;
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
function Sd({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = L(""), [a, s] = L(0), l = fe(null), d = Be(() => rl(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = al(d);
  ye(() => {
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
        wt(u);
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
      var O;
      const f = u.segment || u, b = f.endSec == null ? Me(f.startSec) : `${Me(f.startSec)} – ${Me(f.endSec)}`, y = `${ht(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`, w = p === c, S = p > 0 ? d[p - 1].groupKey : null, N = g && u.groupKey !== S ? n("div", {
        key: `group:${u.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, u.groupName) : null, q = n("button", {
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
        n(qt, { key: "review", state: f.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          f.tagName || "Tag segment"
        ),
        (O = u.performers) != null && O.length ? n(yr, {
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
      return N ? [N, q] : [q];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function kd(e) {
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
function wd({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = Be(() => kd(e), [e]), [l, d] = L([]), c = s.reduce((u, p) => u + p.drafts.length, 0), g = (u) => d((p) => p.includes(u) ? p.filter((f) => f !== u) : [...p, u]), m = (u) => `segment-studio-publish-approved-${u.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !t && a();
    },
    onKeyDownCapture: (u) => st(u, {
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
            style: { background: pr(!1) }
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
            const b = f.endSec == null ? Me(f.startSec) : `${Me(f.startSec)} – ${Me(f.endSec)}`, y = `${ht(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`;
            return n("div", { key: f.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(qt, { key: "review", state: f.reviewState, includeLabel: !1 }),
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
function Nd({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = nl(e), [s, l] = L(() => /* @__PURE__ */ new Set()), [d, c] = L(() => new Set(a.map((b) => b.key))), g = a.flatMap((b) => d.has(b.key) ? b.candidates : []), m = (b) => l((y) => {
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
      b.key === "Enter" && b.target instanceof HTMLInputElement || st(b, {
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
      e.length ? n("div", { className: "space-y-3" }, a.map((b) => n("section", { key: b.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
        n("header", {
          key: "header",
          className: "flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2",
          style: { background: pr(!1) }
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
              const S = y.label || `Slot ${y.sortOrder + 1}`;
              return n("span", {
                key: y.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${S}: ${w.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${S}: ${w.name}`
                }, `${S}: ${w.name}`),
                n(Ln, {
                  key: "avatar",
                  performer: { id: w.performerId, name: w.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(Pt, { key: "states", counts: b.counts }),
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
            const w = y.endSec == null ? Me(y.startSec) : `${Me(y.startSec)} – ${Me(y.endSec)}`, S = `${ht(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`;
            return n("div", {
              key: y.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(qt, { key: "review", state: y.reviewState, includeLabel: !1 }),
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
function Id({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => st(d, { onCancel: r, onConfirm: t })
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
      n("button", { key: "cancel", type: "button", autoFocus: !0, onClick: r, className: "rounded-md border border-border px-3 py-1.5 text-sm" }, "Cancel"),
      n("button", { key: "confirm", type: "button", onClick: t, className: "rounded-md border border-destructive/60 bg-destructive/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-destructive/25" }, "Delete permanently")
    ])
  ]));
}
function $d({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = L(!1);
  if (!e) return null;
  const d = e.endSec == null ? "open end" : Me(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (c) => {
      c.target === c.currentTarget && !t && a();
    },
    onKeyDownCapture: (c) => st(c, {
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
        `${Me(e.startSec)} – ${d}`
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
function Cd(e) {
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
function Td({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var g, m;
  const l = e ? e.createCount + e.linkCount : 0, d = ((g = e == null ? void 0 : e.outputs) == null ? void 0 : g.slice(0, 200)) || [], c = Cd(d);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !r && s();
    },
    onKeyDownCapture: (u) => st(u, {
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
                `${u.rootTagName} @ ${Me(u.rootStartSec)}`
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
function Ad({
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
  setSavingSegmentId: S,
  onSlotsChanged: N,
  onRecordHistory: q,
  onCancelQueuedReview: O,
  splitSegment: W,
  duplicateSegment: R,
  provenance: I,
  lineage: A,
  onNavigateLineageItem: P,
  tagEditing: _,
  onCancelTagEditing: K,
  detailPanelRef: Y,
  onReduceSelection: k
}) {
  var ce, ae, xe, Se;
  const T = fe(null), U = fe(null), Z = fe(null), ie = fe(null), ue = fe(null), [ge, F] = L(!1);
  ye(() => {
    T.current && (T.current.scrollTop = 0), F(!1);
  }, [t == null ? void 0 : t.id]), ye(() => {
    var M, V;
    ge && ((V = (M = U.current) == null ? void 0 : M.querySelector("input, select, button")) == null || V.focus({ preventScroll: !0 }));
  }, [ge]);
  function X() {
    F(!1), requestAnimationFrame(() => {
      var M;
      return (M = f.current) == null ? void 0 : M.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const M = !r.some((se) => se.isDerived), V = e && c ? wl(m, r) : null, H = (V == null ? void 0 : V.map((se, $) => {
      var G;
      const le = r[$];
      return {
        segmentId: le.nativeSegmentId,
        itemId: le.published ? null : le.itemId,
        revision: (G = u.performerSlotRevisions) == null ? void 0 : G[le.id],
        slots: se
      };
    })) || [];
    return n(Yr.Fragment, null, [
      n(dd, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: Y,
        onReduceSelection: k,
        reviewable: e,
        tagEditable: M,
        slotsEditable: H.length > 0 && a == null,
        onEditSlots: () => F(!0),
        slotButtonRef: f,
        saveMessage: i
      }),
      _ && M ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (se) => {
          se.target === se.currentTarget && K();
        },
        onKeyDownCapture: (se) => st(se, { onCancel: K })
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
        n(Dn, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (se, $) => se == null ? K() : s(se, $ == null ? void 0 : $.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: K,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      ge && H.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (se) => {
          se.target === se.currentTarget && X();
        },
        onKeyDownCapture: (se) => {
          var le, G;
          if (!(typeof ((le = se.target) == null ? void 0 : le.closest) == "function" ? se.target.closest("input, textarea, select, [contenteditable='true']") : null) && !se.repeat && !se.ctrlKey && !se.altKey && !se.metaKey && !se.shiftKey && /^[1-9]$/.test(se.key) && ((G = ue.current) != null && G.call(ue, Number(se.key) - 1))) {
            se.preventDefault(), se.stopPropagation();
            return;
          }
          st(se, { onCancel: X });
        }
      }, n("section", {
        ref: U,
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
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(ad, {
          videoId: p.id,
          targets: H,
          performerCandidates: u.performerCandidates || [],
          shortcutRef: ue,
          onSaved: async ({ beforeState: se, afterState: $ }) => {
            await q(
              "performer-slots.assign",
              `Assigned performers to ${H.length} segments`,
              se,
              $
            ), X(), N();
          },
          onConflict: N
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (M) => {
      T.current = M, Y && (Y.current = M);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(qt, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(br, { key: "derived" }) : null,
        t && _ ? n("div", {
          key: "tag-editor",
          ref: b,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (M) => {
            M.key === "Escape" && (M.preventDefault(), M.stopPropagation(), K());
          },
          onKeyDown: (M) => {
            xl(M, t.tagName) && (M.preventDefault(), M.stopPropagation(), s(t.tagId));
          }
        }, n(Dn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (M, V) => M == null ? K() : s(M, V == null ? void 0 : V.label),
          disabled: a != null || ((ce = A.data) == null ? void 0 : ce.tagReadOnly) === !0,
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
      e && t && (d === "empty" || d === "partial") ? n("div", { key: "slots-row" }, n(rd, { status: d })) : null,
      t && c && g.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(ni, {
        assignments: g.map((M) => {
          const V = Cl(M);
          return {
            key: String(M.slotDefinitionId),
            label: V.label,
            performer: V.filled ? { id: Number(M.performerId), name: V.performer } : null,
            title: V.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(ld, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: I
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
          (ae = A.data.parents) != null && ae.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...A.data.parents.map((M) => n("button", {
              key: M.nodeId,
              type: "button",
              onClick: () => P(M.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${M.ruleKey} ${M.ruleVersion}`))
          ]) : null,
          (xe = A.data.children) != null && xe.length ? n("p", { key: "children" }, `Children: ${A.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: l, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: f,
          type: "button",
          disabled: a != null || !c || g.length === 0,
          onClick: () => F(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: c ? g.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, g.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: W,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        n("button", {
          key: "duplicate",
          type: "button",
          disabled: a != null,
          onClick: () => R(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        n("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: a != null,
          onClick: () => R(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    ge && e && t && c && g.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (M) => {
        M.target === M.currentTarget && X();
      },
      onKeyDownCapture: (M) => {
        var H, se;
        if (!(typeof ((H = M.target) == null ? void 0 : H.closest) == "function" ? M.target.closest("input, textarea, select, [contenteditable='true']") : null) && !M.repeat && !M.ctrlKey && !M.altKey && !M.metaKey && !M.shiftKey && /^[1-9]$/.test(M.key) && ((se = ie.current) != null && se.call(ie, Number(M.key) - 1))) {
          M.preventDefault(), M.stopPropagation();
          return;
        }
        st(M, {
          onCancel: X,
          onConfirm: () => {
            var $;
            return ($ = Z.current) == null ? void 0 : $.click();
          }
        });
      }
    }, n("section", {
      ref: U,
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
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(od, {
        key: `${t.id}:${u.performerSlotsRevision || u.slotRevision || ""}`,
        videoId: p.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: g,
        revision: (Se = u.performerSlotRevisions) == null ? void 0 : Se[t.id],
        performerCandidates: u.performerCandidates || [],
        confirmRef: Z,
        shortcutRef: ie,
        onOptimisticSave: (M) => {
          y((V) => jr(
            V,
            t.id,
            M
          ), p.id), S(t.id), w("Saving performer slots…"), X();
        },
        onSaved: async (M, { beforeState: V, afterState: H }) => {
          y((se) => jr(
            se,
            t.id,
            M.slots || [],
            M.revision
          ), p.id), w("Performer slots saved.");
          try {
            await q(
              "performer-slots.assign",
              "Assigned performers",
              V,
              H
            ), await N(M) || O([t]);
          } finally {
            S(null);
          }
        },
        onRollback: async (M, V) => {
          O([t]), y((H) => {
            var se;
            return jr(
              H,
              t.id,
              M,
              (se = u.performerSlotRevisions) == null ? void 0 : se[t.id]
            );
          }, p.id), w(V.message || "Unable to save performer slots.");
          try {
            V.status === 409 && await N();
          } finally {
            S(null);
          }
        },
        onConflict: N
      }))
    ])) : null
  ]);
}
function Rd({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: m, onSelectGroup: u, onToggleGroup: p, onSelect: f, onSelectSegments: b, onSelectAll: y, onConfigureTag: w, onSeekTime: S, centerRef: N, showReviewState: q = !0, swimlaneTitleWidth: O, onSwimlaneTitleWidthChange: W }) {
  const R = fe(null), I = fe(null), [A, P] = L(0), [_, K] = L({ scrollTop: 0, height: 320 }), [Y, k] = L(null), T = Be(
    () => _t(e, r, o),
    [e, r, o]
  ), U = Be(
    () => Xa(o),
    [o]
  ), Z = Be(() => io(T), [T]), ie = Be(
    () => El(Z, i, r.length > 0),
    [Z, i, r.length]
  ), ue = Be(
    () => ei(ie.rows, Math.max(0, _.scrollTop - 24), _.height),
    [ie, _]
  ), ge = Math.max(0, Number(d) || 0), F = as(A), X = sr(O, F), ce = X / 16, ae = rs(c, ge, ce), xe = Zi(ge), Se = Xi(ge, Math.max(1, A - ce * 16), g), M = xe.filter((x, h) => h === 0 || h % Se === 0), V = Be(() => T.map((x) => `${x.key}:${x.trackCount}:${x.markers.map(({ segment: h, track: D }) => `${h.id}:${h.startSec}:${h.endSec ?? ""}:${D}`).join(",")}`).join("|"), [T]);
  function H() {
    const x = I.current;
    if (!x) return;
    const h = x.querySelector("[data-timeline-track]"), D = x.firstElementChild, ne = h == null ? void 0 : h.getBoundingClientRect(), re = D == null ? void 0 : D.getBoundingClientRect(), Q = ne && re ? Math.max(0, ne.left - re.left) : ce * 16, ke = (re == null ? void 0 : re.width) ?? x.scrollWidth;
    x.scrollTo({
      left: ns(c, ge, ke, x.clientWidth, Q, Aa),
      behavior: "smooth"
    });
  }
  ye(() => (N.current = H, () => {
    N.current === H && (N.current = null);
  })), ye(() => {
    H();
  }, [g]);
  function se() {
    const x = I.current, h = ie.rows.find((ke) => ke.kind === "lane" && ke.lane.markers.some(({ segment: J }) => J.id === s));
    if (!x || !h) return;
    const D = 24, ne = h.top + D, re = ne + h.height;
    let Q = x.scrollTop;
    ne < x.scrollTop + D ? Q = Math.max(0, ne - D) : re > x.scrollTop + x.clientHeight && (Q = Math.max(0, re - x.clientHeight)), Q !== x.scrollTop && (x.scrollTop = Q), K({ scrollTop: Q, height: x.clientHeight });
  }
  ye(() => {
    se();
  }, [s, V, ie]), ye(() => {
    const x = I.current, h = ie.rows.find((ke) => ke.kind === "group" && ke.group.key === a);
    if (!x || !h) return;
    const D = 24, ne = h.top + D, re = ne + h.height;
    let Q = x.scrollTop;
    ne < x.scrollTop + D ? Q = Math.max(0, ne - D) : re > x.scrollTop + x.clientHeight && (Q = Math.max(0, re - x.clientHeight)), Q !== x.scrollTop && (x.scrollTop = Q), K({ scrollTop: Q, height: x.clientHeight });
  }, [a, ie]), ye(() => {
    const x = I.current;
    if (!x || typeof ResizeObserver > "u") return;
    const h = () => {
      P(x.clientWidth), K({ scrollTop: x.scrollTop, height: x.clientHeight }), se();
    }, D = new ResizeObserver(h);
    return D.observe(x), h(), () => D.disconnect();
  }, [s, V, ie]);
  function $(x) {
    if (!(ge > 0)) return;
    const h = x.currentTarget.getBoundingClientRect(), D = Math.min(1, Math.max(0, (x.clientX - h.left) / h.width));
    S(D * ge);
  }
  function le(x) {
    const h = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let D = null;
    Object.hasOwn(h, x.key) && (D = c + h[x.key]), x.key === "Home" && (D = 0), x.key === "End" && (D = ge), D != null && (x.preventDefault(), x.stopPropagation(), S(Math.min(ge, Math.max(0, D))));
  }
  function G(x) {
    var D;
    const h = (D = R.current) == null ? void 0 : D.getBoundingClientRect();
    h && W(sr(x.clientX - h.left, F));
  }
  function v(x) {
    const h = x.shiftKey ? 40 : 16;
    let D = null;
    x.key === "ArrowLeft" && (D = X - h), x.key === "ArrowRight" && (D = X + h), x.key === "Home" && (D = 160), x.key === "End" && (D = F), D != null && (x.preventDefault(), x.stopPropagation(), W(sr(D, F)));
  }
  const C = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: R,
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
      n("button", { key: "out", type: "button", className: C, disabled: g <= 1, onClick: () => m(dr(g - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: C, disabled: g === 1, onClick: () => m(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(g * 100)}%`),
      n("button", { key: "in", type: "button", className: C, disabled: g >= 8, onClick: () => m(dr(g + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: C, onClick: H, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(F),
      "aria-valuenow": Math.round(X),
      "aria-valuetext": `${Math.round(X)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (x) => {
        x.currentTarget.setPointerCapture(x.pointerId), G(x);
      },
      onPointerMove: (x) => {
        x.currentTarget.hasPointerCapture(x.pointerId) && G(x);
      },
      onKeyDown: v,
      onDoubleClick: () => W(it.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${X - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: I,
      onScroll: (x) => K({
        scrollTop: x.currentTarget.scrollTop,
        height: x.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: os(g) }, [
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
          "aria-valuemax": ge,
          "aria-valuenow": Math.min(ge, Math.max(0, c)),
          "aria-valuetext": Me(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: $,
          onKeyDown: le
        }, M.map((x, h) => n("span", {
          key: x,
          className: `absolute top-0 ${es(h, M.length, ge > 0 ? x / ge * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: ts(h, M.length, ge > 0 ? x / ge * 100 : 0)
        }, Me(x))).concat(t.map((x) => {
          const h = ge > 0 ? x.startSec / ge * 100 : 0;
          return n("button", {
            key: `shot-boundary:${x.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Me(x.startSec)} – ${Me(x.endSec)}`,
            title: `Shot boundary · ${x.source || "manual"} · ${Me(x.startSec)} – ${Me(x.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${h}%`, width: "2px" },
            onClick: (D) => {
              D.stopPropagation(), S(x.startSec);
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
            ...Po(ae),
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
        style: T.length > 0 ? { height: ie.height } : void 0
      }, [
        T.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...Po(ae, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        T.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : ue.map((x) => {
          var te;
          const h = x.group, D = i.includes(h.key), ne = a === h.key, re = pr(ne);
          if (x.kind === "group") return n("div", {
            key: x.key,
            "data-segment-group": h.key,
            "data-segment-group-collapsed": D ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ce}rem minmax(0,1fr)`,
              backgroundColor: re,
              top: x.top,
              height: x.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (z) => {
                if (z.metaKey || z.ctrlKey) {
                  b(h.lanes.flatMap((E) => E.markers.map((oe) => oe.segment.id)));
                  return;
                }
                u(h.key), p(h.key);
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
                q ? n(Pt, { key: "states", counts: h.counts }) : null
              ] : null
            )
          ]);
          const Q = x.lane, ke = fl(x.laneIndex), J = Q.markers.some(({ segment: z }) => z.id === s);
          return n("div", {
            key: x.key,
            "data-grouped-swimlane": h.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ce}rem minmax(0,1fr)`,
              top: x.top,
              height: x.height,
              backgroundColor: ke
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": J ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: yl(J, ke),
              title: `${Pn(Q)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Pn(Q),
              onClick: (z) => {
                (z.metaKey || z.ctrlKey) && b(Q.markers.map((E) => E.segment.id));
              },
              onMouseEnter: () => k(Q.key),
              onMouseLeave: () => k((z) => z === Q.key ? null : z)
            }, [
              Q.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (z) => {
                  z.stopPropagation(), w({ tagId: Q.tagId, tagName: Q.label, trigger: z.currentTarget });
                },
                "aria-label": `Configure ${Q.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: Y === Q.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, Q.label),
              (te = Q.performers) != null && te.length ? n(yr, {
                key: "performers",
                performers: Q.performers,
                performerAssignments: Q.performerAssignments
              }) : null,
              q ? n(Pt, { key: "counts", counts: Q.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, Q.markers.map(({ segment: z, track: E }) => {
              var $e;
              const oe = Gr(z.startSec, ge), ve = z.endSec == null ? z.startSec : Math.max(z.startSec, z.endSec), be = Math.max(0, Gr(ve, ge) - oe), he = l.includes(z.id), Ae = z.id === s, we = ao(U.get(z.id)), pe = z.endSec == null ? Me(z.startSec) : `${Me(z.startSec)} – ${Me(z.endSec)}`, Ne = ($e = Qa[we]) == null ? void 0 : $e.label;
              return n("button", {
                key: z.id,
                type: "button",
                onClick: (Ce) => {
                  Ce.stopPropagation(), f(z, {
                    additive: Ce.metaKey || Ce.ctrlKey,
                    rangeSegmentIds: Ce.shiftKey ? Q.markers.map((Ee) => Ee.segment.id) : null
                  });
                },
                "aria-pressed": he,
                "aria-current": Ae ? "true" : void 0,
                "data-selected-timeline-marker": Ae ? "true" : void 0,
                "data-selected-segment-shortcut-target": Ae ? "true" : void 0,
                "aria-label": q ? `${z.tagName || "Tag segment"}${Q.performerLabel ? `, ${Q.performerLabel}` : ""}, ${z.reviewState}${Ne ? `, ${Ne}` : ""}, ${pe}` : `${z.tagName || "Tag segment"}${Q.performerLabel ? `, ${Q.performerLabel}` : ""}, ${pe}`,
                title: q ? `${z.tagName || "Tag segment"}${Q.performerLabel ? ` · ${Q.performerLabel}` : ""} · ${z.reviewState}${Ne ? ` · ${Ne}` : ""} · ${pe}` : `${z.tagName || "Tag segment"}${Q.performerLabel ? ` · ${Q.performerLabel}` : ""} · ${pe}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...q ? ml(z.reviewState, he, we, Ae) : gl(he, Ae),
                  left: `${oe}%`,
                  top: `${bl(E)}rem`,
                  width: pl(z.endSec, be),
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
function lo({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = L(null), [l, d] = L([]), [c, g] = L(null), [m, u] = L(""), [p, f] = L(!0), [b, y] = L(null), [w, S] = L(""), [N, q] = L(!1), O = fe(null), W = fe(0);
  ye(() => {
    const Y = requestAnimationFrame(() => {
      var k;
      return (k = O.current) == null ? void 0 : k.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(Y);
  }, [e]), ye(() => {
    const Y = new AbortController();
    return f(!0), S(""), Promise.all([
      r ? ee(`/slot-definitions/${e}`, { signal: Y.signal }) : Promise.resolve(null),
      ee("/segment-groups", { signal: Y.signal })
    ]).then(([k, T]) => {
      const U = T.find((Z) => (Z.tags || []).some((ie) => Number(ie.tagId) === Number(e)));
      s(k), d(T), g((U == null ? void 0 : U.id) ?? null), u(U == null ? "" : String(U.id)), q(!1);
    }).catch((k) => {
      k.name !== "AbortError" && S(k.message || "Unable to load tag configuration.");
    }).finally(() => {
      Y.signal.aborted || f(!1);
    }), () => Y.abort();
  }, [r, e]);
  function R(Y, k) {
    s({
      ...a,
      definitions: a.definitions.map((T, U) => U === Y ? { ...T, ...k } : T)
    });
  }
  function I(Y, k) {
    const T = Y + k;
    if (T < 0 || T >= a.definitions.length) return;
    const U = [...a.definitions];
    [U[Y], U[T]] = [U[T], U[Y]], s({
      ...a,
      definitions: U.map((Z, ie) => ({ ...Z, sortOrder: ie }))
    });
  }
  function A(Y) {
    const k = a.definitions[Y], T = Number(k.assignmentCount) || 0, U = T === 0 ? "" : ` and its ${T} assignment${T === 1 ? "" : "s"}`;
    window.confirm(`Delete “${rt(k)}”${U}?`) && (T > 0 && q(!0), s({
      ...a,
      definitions: a.definitions.filter((Z, ie) => ie !== Y).map((Z, ie) => ({ ...Z, sortOrder: ie }))
    }));
  }
  async function P() {
    var k;
    y("slots"), S("Saving performer slots…");
    let Y;
    try {
      Y = await ee(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: N,
          definitions: a.definitions.map((T, U) => {
            var Z;
            return {
              id: T.id || void 0,
              label: ((Z = T.label) == null ? void 0 : Z.trim()) || null,
              sortOrder: U,
              genderHints: T.genderHints || []
            };
          })
        })
      }), s(Y), q(!1);
    } catch (T) {
      T.status === 409 ? (S("Performer slots changed elsewhere; current values were reloaded."), (k = T.payload) != null && k.current && (s(T.payload.current), q(!1))) : S(T.message || "Unable to save performer slots."), y(null);
      return;
    }
    try {
      await o(), S("Performer slots saved.");
    } catch {
      S("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      y(null);
    }
  }
  async function _() {
    const Y = m === "" ? null : Number(m);
    if (Y !== c) {
      y("group"), S("Saving tag group…");
      try {
        await ee(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: Y })
        });
      } catch (k) {
        S(k.message || "Unable to assign the tag group."), y(null);
        return;
      }
      try {
        const [k, T] = await Promise.allSettled([
          ee("/segment-groups"),
          o()
        ]);
        if (k.status === "fulfilled") {
          d(k.value);
          const U = k.value.find((ie) => (ie.tags || []).some((ue) => Number(ue.tagId) === Number(e))), Z = (U == null ? void 0 : U.id) ?? null;
          g(Z), u(Z == null ? "" : String(Z));
        }
        S(
          k.status === "fulfilled" && T.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        y(null);
      }
    }
  }
  l.find((Y) => Number(Y.id) === Number(c));
  const K = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (Y) => {
      Y.target === Y.currentTarget && !b && i();
    },
    onKeyDownCapture: (Y) => st(Y, {
      onCancel: b ? void 0 : i
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
          onClick: _,
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
          ...(a.definitions || []).map((Y, k) => n("article", {
            key: Y.id || Y._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: Y.label || "",
                disabled: b != null,
                onChange: (T) => R(k, { label: T.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Vi.map((T) => n("label", { key: T, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: b != null,
                  checked: (Y.genderHints || []).includes(T),
                  onChange: (U) => R(k, {
                    genderHints: U.target.checked ? [.../* @__PURE__ */ new Set([...Y.genderHints || [], T])] : (Y.genderHints || []).filter((Z) => Z !== T)
                  })
                }),
                n("span", { key: "text" }, fr(T))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${Y.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: b != null || k === 0, onClick: () => I(k, -1), className: K, "aria-label": `Move ${rt(Y)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: b != null || k === a.definitions.length - 1, onClick: () => I(k, 1), className: K, "aria-label": `Move ${rt(Y)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: b != null, onClick: () => A(k), className: `${K} text-red-300` }, "Delete")
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
                  _clientKey: `new-${++W.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: K
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
function Md(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function Ed(e) {
  const { activeFilterCount: t, allSwimlanes: r, analysisError: o, analysisRun: i, analysisStatus: a, approvalFacetCounts: s, autoAssignCandidates: l, autoAssignError: d, autoAssignOpen: c, autoAssignPerformers: g, autoAssigning: m, cancelQueuedReviewsForSegments: u, canMoveSelectionToBin: p, captureTrainingExport: f, centerTimelineRef: b, closeEditorFilters: y, closeFirstSegmentTagDialog: w, closeMaterializeDialog: S, closeMergeConfirmation: N, closePublishApprovedDialog: q, closeTagEditing: O, collapsedSegmentGroups: W, commonActionsRef: R, compatibilityMode: I, configuringTag: A, createSegment: P, currentTime: _, deleteRejectedSegments: K, detail: Y, detailPanelRef: k, detailWidth: T, duplicateSegment: U, editorFilters: Z, editorLayout: ie, editorRef: ue, exportingExamples: ge, filtersButtonRef: F, filtersOpen: X, firstSegmentTagOpen: ce, focusRowRef: ae, handleSeparatorKeyDown: xe, handleSeparatorPointerDown: Se, handleSeparatorPointerMove: M, hasNextUnreviewed: V, hasPreviousUnreviewed: H, hideDerivedSegments: se, history: $, historyOpen: le, historySaving: G, horizontalLayoutSize: v, importNativeSegments: C, incorrectExamples: x, incorrectExamplesOpen: h, lineage: D, markerRailWidth: ne, materializeButtonRef: re, materializeCancelButtonRef: Q, materializeDerivedSegments: ke, materializeError: J, materializeLoading: te, materializeOpen: z, materializePreview: E, materializing: oe, mediaStackRef: ve, mergeCancelButtonRef: be, mergeConfirmation: he, mergeSavingRef: Ae, mergeSelectedSwimlane: we, nativeImportState: pe, onDetailChange: Ne, onNavigate: $e, onReload: Ce, onSlotsChanged: Ee, openPublishApprovedDialog: je, panelSeparatorProps: Ze, pendingInitialSeekRef: Fe, performerSlots: Ie, performerSlotsAvailable: ze, playbackControlsRef: _e, previewDerivedSegments: We, provenance: Re, provenanceSources: Te, publishApprovedCancelButtonRef: Ge, publishApprovedDrafts: lt, publishApprovedError: Xe, publishApprovedOpen: Nt, quickSearchOpen: ot, railScrollRef: Mt, railToggleRef: Wt, recordHistoryAction: hr, rejectedDeletionPreview: gn, removeIncorrectExample: Ft, removingExampleId: Gn, restoreHistoryTarget: Vt, runEditorAction: Jt, saveMessage: Yt, saveTag: jt, saveTiming: vr, savingSegmentId: vt, seekRef: It, segmentGroups: Un, segmentRailLayout: pn, segments: xt, selectAllVideoSegments: xr, selectSegment: Qt, selectSegmentCollection: fn, selectedGroups: Kn, selectedPerformerSlots: yn, selectedSegment: at, selectedSegmentGroupKey: Et, selectedSegmentIds: bn, selectedSegments: Bt, selectedSlotStatus: zn, setAutoAssignError: Sr, setAutoAssignOpen: Zt, setConfiguringTag: Xt, setCurrentTime: _n, setEditorFilters: en, setEditorLayout: kr, setFiltersOpen: Hn, setHideDerivedSegments: hn, setHistoryOpen: Dt, setIncorrectExamplesOpen: tn, setQuickSearchOpen: nn, setRailViewport: dt, setRejectedDeletionPreview: qn, setSaveMessage: vn, setSavingSegmentId: Wn, setSelectedSegmentGroupKey: xn, setSelectedSegmentId: Sn, setShortcutsOpen: rn, setTimelineZoom: wr, shotBoundaries: Nr, shortcutsOpen: Ir, slotButtonRef: kn, splitLayout: mt, splitSegment: wn, startFullAnalysis: Ke, tagEditing: Ve, tagSearchRef: $r, timelineDuration: Cr, timelineRatioBounds: gt, timelineZoom: pt, toggleSegmentGroup: Vn, toggleSegmentRail: Nn, updateTimelineRatio: In, video: Je, videoPerformers: $n, visibleCounts: Tr, visibleSegmentRailRows: Jn, visibleSegments: Yn, wideLayout: Gt, workspaceRef: $t } = e, Qn = Be(
    () => xt.filter((j) => !j.published && j.reviewState === "approved"),
    [xt]
  ), Zn = qi(Qr), Cn = Qn.length, Tn = E ? E.createCount + E.linkCount : null, St = vt != null, Ye = Bt.length > 0, de = Bt.length === 1, Ct = Ye && Bt.every((j) => j.reviewState === "approved"), Xn = Ye && Bt.every((j) => j.reviewState === "rejected"), er = [
    { id: "marker.create", label: "New segment", disabled: St },
    { id: "marker.editTag", label: "Edit tag", disabled: St || !Ye },
    { id: "marker.setStart", label: "Set start", disabled: St || !de },
    { id: "marker.setEnd", label: "Set end", disabled: St || !de },
    { id: "marker.split", label: "Split", disabled: St || !de },
    ...I ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !H, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Ct ? "Unapprove" : "Approve", disabled: St || !Ye, tone: "approve" },
      { id: "marker.reject", label: Xn ? "Unreject" : "Reject", disabled: St || !Ye, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !V, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...I ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: St || !p, tone: "reject" }
    ]
  ];
  function Ar(j) {
    const De = bn.includes(j.id), Qe = j.id === (at == null ? void 0 : at.id), et = j.endSec == null ? Me(j.startSec) : `${Me(j.startSec)} – ${Me(j.endSec)}`, kt = `${ht(j.sourceKey)}${j.confidence != null ? ` · ${Math.round(j.confidence * 100)}%` : ""}`;
    return n("button", {
      key: j.id,
      type: "button",
      onClick: (Tt) => Qt(j, { additive: Tt.metaKey || Tt.ctrlKey }),
      "aria-pressed": De,
      "aria-current": Qe ? "true" : void 0,
      "data-selected-segment-shortcut-target": Qe ? "true" : void 0,
      "aria-label": I ? `${j.tagName || "Tag segment"}, ${j.reviewState}${j.isDerived ? ", derived segment" : ""}, ${et}` : `${j.tagName || "Tag segment"}${j.isDerived ? ", derived segment" : ""}, ${et}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: Ya(De, Qe)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        I ? n(qt, { key: "review", state: j.reviewState, includeLabel: !1 }) : null,
        j.isDerived ? n(br, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          j.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, et),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: kt
        }, kt)
      ])
    ]);
  }
  const Ut = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", on = [...$.actions || []].reverse().find((j) => j.sequence <= $.cursorSequence);
  return n("section", {
    ref: ue,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${mt ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (j) => ai(j, $e, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${Je.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: Je.title || `Video ${Je.id}`
          }, Je.title || `Video ${Je.id}`)),
          ...$n.map((j) => n(Ln, {
            key: qe(j),
            performer: { id: qe(j), name: j.name },
            compact: !0,
            tooltip: j.name
          })),
          I ? n(Pt, { key: "review-counts", counts: Tr }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          I ? null : n(li, { key: "bin", onNavigate: $e, compact: !0 }),
          n(di, { key: "settings", onNavigate: $e, compact: !0 })
        ])
      ]),
      I && Y.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${Y.nativeImportCount} Cove segment${Y.nativeImportCount === 1 ? "" : "s"} ${Y.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        pe.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, pe.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => C("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => C("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        pe.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, pe.error) : null
      ]) : null,
      o && (a == null ? void 0 : a.configured) !== !1 ? n("div", {
        key: "analysis-error",
        role: "alert",
        className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300"
      }, o) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          I ? n("div", {
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
                onClick: (j) => {
                  ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && j.preventDefault();
                },
                onKeyDown: (j) => {
                  (j.key === "Enter" || j.key === " ") && ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && j.preventDefault();
                },
                className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${(a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running" ? "pointer-events-none cursor-default opacity-50" : "cursor-pointer hover:opacity-90"}`
              }, n(ka, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([j, De]) => n("button", {
                key: j,
                type: "button",
                disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                onClick: (Qe) => {
                  var et;
                  (et = Qe.currentTarget.closest("details")) == null || et.removeAttribute("open"), Ke(De);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, j)))
            ])
          ]) : null,
          I ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: vt != null || l.length === 0,
            onClick: () => {
              Sr(""), Zt(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${l.length ? ` (${l.length})` : ""}`) : null,
          I ? n("button", {
            key: "materialize-derived",
            ref: re,
            type: "button",
            disabled: vt != null || te || oe || Tn === 0,
            onClick: We,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, te ? "Analyzing…" : `Auto-Materialize${Tn != null ? ` (${Tn})` : ""}`) : null,
          I ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: vt != null || Cn === 0,
            onClick: (j) => je(j.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": Nt,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${Cn ? ` (${Cn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: ge || Gn != null || x.length === 0,
            onClick: () => tn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": h,
            "aria-label": `Open AI feedback collection, ${x.length} example${x.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${x.length ? ` (${x.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: F,
            type: "button",
            onClick: () => Hn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": X,
            className: `${Ut} ${t ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(ar, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${t ? ` (${t})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => rn(!0),
            className: Ut
          }, [n(ar, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: (I ? $.actions.length === 0 : on == null) || vt != null || G,
            onClick: I ? () => Dt((j) => !j) : () => Vt(
              on.sequence - 1
            ),
            "aria-haspopup": I ? "dialog" : void 0,
            "aria-expanded": I ? le : void 0,
            className: Ut
          }, [
            n(ar, { key: "icon", name: "history" }),
            n("span", { key: "label" }, I ? `History${$.actions.length ? ` (${$.actions.length})` : ""}` : on ? `Undo ${on.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: Wt,
            type: "button",
            onClick: Nn,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": ie.markerRailOpen,
            className: Ut
          }, [
            n(ar, { key: "icon", name: "list" }),
            n("span", { key: "label" }, ie.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    I && le ? n("section", {
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
          onClick: () => Dt(!1),
          className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
        }, "Close")
      ]),
      n("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
        ...[...$.actions].reverse().map((j) => n("button", {
          key: j.sequence,
          type: "button",
          disabled: G,
          onClick: () => Vt(j.sequence),
          "aria-current": $.cursorSequence === j.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${j.sequence > $.cursorSequence ? "text-secondary" : "text-foreground"} ${$.cursorSequence === j.sequence ? "bg-accent/15" : ""}`
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
          disabled: G,
          onClick: () => Vt($.baselineSequence),
          "aria-current": $.cursorSequence === $.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${$.cursorSequence === $.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    X ? n(hd, {
      key: "editor-filters",
      filters: Z,
      hideDerivedSegments: se,
      performers: $n,
      provenanceSources: Te,
      reviewCounts: s,
      segments: xt,
      segmentGroups: Un,
      reviewMode: I,
      onChange: en,
      onHideDerivedChange: hn,
      onClose: y
    }) : null,
    ce ? n(bd, {
      key: "first-segment-tag-dialog",
      saving: vt != null,
      error: Yt,
      onSelect: (j, De) => P(j, De),
      onClose: w
    }) : null,
    ot ? n(Sd, {
      key: "quick-search-dialog",
      segments: ol(r),
      onSelect: (j) => {
        nn(!1), Qt(j, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        nn(!1), requestAnimationFrame(() => {
          var j;
          return (j = ue.current) == null ? void 0 : j.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    c ? n(Nd, {
      key: "auto-assign-dialog",
      candidates: l,
      processing: m,
      error: d,
      onConfirm: g,
      onClose: () => Zt(!1)
    }) : null,
    he ? n($d, {
      key: "merge-selection-dialog",
      merge: he,
      processing: Ae.current,
      undoable: !I,
      cancelButtonRef: be,
      onConfirm: (j) => we(!0, j, he),
      onClose: N
    }) : null,
    z ? n(Td, {
      key: "materialize-derived-dialog",
      preview: E,
      loading: te,
      processing: oe,
      error: J,
      cancelButtonRef: Q,
      onConfirm: ke,
      onClose: () => {
        oe || S();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: $t,
      className: `${mt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      ie.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: Gt ? { position: "absolute", top: 0, right: 0, width: ne, height: v.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        xt.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : Yn.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: Mt,
          onScroll: (j) => dt({
            scrollTop: j.currentTarget.scrollTop,
            height: j.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: pn.height }
        }, Jn.map((j) => {
          var Qe;
          let De;
          if (j.kind === "group") {
            const et = W.includes(j.group.key), kt = j.group.lanes.reduce((Tt, Rr) => Tt + Rr.markers.length, 0);
            De = n("button", {
              type: "button",
              onClick: () => {
                xn(j.group.key), Vn(j.group.key);
              },
              "aria-expanded": !et,
              "aria-current": Et === j.group.key ? "true" : void 0,
              "data-segment-rail-group": j.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${Et === j.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, et ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: j.group.name }, j.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, kt),
              I && et ? n(Pt, { key: "states", counts: j.group.counts }) : null
            ]);
          } else j.kind === "lane" ? De = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Pn(j.lane),
            "aria-label": Pn(j.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, j.lane.label),
            (Qe = j.lane.performers) != null && Qe.length ? n(yr, {
              key: "performers",
              performers: j.lane.performers,
              performerAssignments: j.lane.performerAssignments
            }) : null,
            I ? n(Pt, { key: "states", counts: j.lane.counts }) : null
          ]) : De = Ar(j.segment);
          return n("div", {
            key: j.key,
            className: "absolute left-0 right-0",
            style: { top: j.top, height: j.height }
          }, De);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${mt ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: ve,
          className: `${mt ? "min-h-0 flex-1" : ""} grid`,
          style: mt ? {
            gridTemplateRows: `minmax(16rem, ${(1 - ie.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${ie.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: ae,
            className: "grid min-h-0 gap-2",
            style: Gt ? {
              gridTemplateColumns: ie.markerRailOpen ? `${T}px 0.5rem minmax(0,1fr) 0.5rem ${ne}px` : `${T}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(Ad, {
              key: "tools",
              compatibilityMode: I,
              selectedSegment: at,
              selectedSegments: Bt,
              selectedGroups: Kn,
              saveMessage: Yt,
              savingSegmentId: vt,
              setSavingSegmentId: Wn,
              setSaveMessage: vn,
              saveTag: jt,
              slotStatus: zn,
              performerSlotsAvailable: ze,
              selectedPerformerSlots: yn,
              performerSlots: Ie,
              detail: Y,
              onDetailChange: Ne,
              onCancelQueuedReview: u,
              video: Je,
              slotButtonRef: kn,
              tagSearchRef: $r,
              tagEditing: Ve,
              onCancelTagEditing: O,
              detailPanelRef: k,
              onReduceSelection: (j) => {
                Qt(j), requestAnimationFrame(() => {
                  var De;
                  return (De = k.current) == null ? void 0 : De.focus({ preventScroll: !0 });
                });
              },
              saveTiming: vr,
              onSlotsChanged: Ee,
              onRecordHistory: hr,
              splitSegment: wn,
              duplicateSegment: U,
              provenance: Re,
              lineage: D,
              onNavigateLineageItem: (j) => {
                const De = xt.find((Qe) => Qe.itemId === j);
                De && Sn(De.id);
              }
            }),
            Gt ? n(
              "div",
              { key: "detail-separator", ...Ze("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Je.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(ba, {
                streamUrl: `/api/stream/video/${Je.id}`,
                posterUrl: `/api/stream/video/${Je.id}/screenshot?v=${encodeURIComponent(Je.updatedAt || "")}`,
                format: Je.videoFile.format,
                audioCodec: Je.videoFile.audioCodec,
                duration: Je.videoFile.duration,
                videoId: Je.id,
                trackingEnabled: !1,
                onSeekRegister: (j) => {
                  It.current = j, el(Fe.current, xt, j) && (Fe.current = null);
                },
                onPlaybackControlRegister: (j) => {
                  _e.current = j;
                },
                onTimeUpdate: _n
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            Gt && ie.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...Ze("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Gt && ie.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: R,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, er.map((j) => {
            var et;
            const De = (et = Zn[j.id]) == null ? void 0 : et[0], Qe = j.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : j.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
            return n("button", {
              key: j.id,
              type: "button",
              disabled: j.disabled,
              "data-action-id": j.id,
              onClick: (kt) => {
                const Tt = kt.currentTarget;
                Jt(j.id, { target: Tt, preserveFocus: !0 }), j.focusWhenDisabled && requestAnimationFrame(() => {
                  Md(Tt, R.current, j.focusWhenDisabled);
                });
              },
              title: De ? `${j.label} (${De})` : j.label,
              className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${Qe}`
            }, [
              n("span", { key: "label" }, j.label),
              De ? n("kbd", {
                key: "shortcut",
                className: "rounded border border-border/70 bg-background/70 px-1 py-0.5 font-mono text-[10px] leading-none text-secondary"
              }, De) : null
            ]);
          })),
          mt ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(gt.minimum * 100),
            "aria-valuemax": Math.round(gt.maximum * 100),
            "aria-valuenow": Math.round(ie.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(ie.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: Se,
            onPointerMove: M,
            onKeyDown: xe,
            onDoubleClick: () => In(it.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: mt ? void 0 : { height: "20rem" } }, n(Rd, {
            segments: Yn,
            shotBoundaries: Nr,
            segmentGroups: Un,
            performerSlots: Ie,
            collapsedGroupKeys: W,
            selectedGroupKey: Et,
            selectedSegmentId: at == null ? void 0 : at.id,
            selectedSegmentIds: bn,
            duration: Cr,
            currentTime: _,
            zoom: pt,
            onZoomChange: wr,
            onSelectGroup: xn,
            onToggleGroup: Vn,
            onSelect: (j, De) => Qt(j, De),
            onSelectSegments: fn,
            onSelectAll: xr,
            onConfigureTag: (j) => Xt(j),
            onSeekTime: (j) => {
              var De;
              return (De = It.current) == null ? void 0 : De.call(It, j, !1);
            },
            centerRef: b,
            showReviewState: I,
            swimlaneTitleWidth: ie.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (j) => kr((De) => ({ ...De, swimlaneTitleWidth: j }))
          }))
        ])
      ])
    ]),
    A ? n(lo, {
      key: `configure-tag:${A.tagId}`,
      tagId: A.tagId,
      tagName: A.tagName,
      performerSlotsEnabled: I,
      onSaved: Ce,
      onClose: () => {
        const j = A.trigger;
        Xt(null), requestAnimationFrame(() => {
          var De;
          j != null && j.isConnected ? j.focus({ preventScroll: !0 }) : (De = ue.current) == null || De.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Nt ? n(wd, {
      key: "publish-approved-dialog",
      drafts: Qn,
      processing: vt === -1,
      error: Xe,
      cancelButtonRef: Ge,
      onConfirm: lt,
      onClose: q
    }) : null,
    gn ? n(Id, {
      key: "rejected-deletion-dialog",
      preview: gn,
      onConfirm: () => K(gn),
      onClose: () => {
        qn(null), requestAnimationFrame(() => {
          var j;
          return (j = ue.current) == null ? void 0 : j.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Ir ? n(vd, {
      key: "shortcuts-dialog",
      reviewMode: I,
      bindings: Zn,
      onClose: () => rn(!1)
    }) : null,
    h ? n(xd, {
      key: "incorrect-examples-dialog",
      examples: x,
      exporting: ge,
      removingExampleId: Gn,
      onExport: f,
      onRemove: Ft,
      onClose: () => tn(!1)
    }) : null
  ]);
}
function Dd(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: m, setEditorFilters: u, setHideDerivedSegments: p, setSaveMessage: f, setSelectedSegmentGroupKey: b, setSelectedSegmentId: y, setSelectedSegmentIds: w } = e;
  function S(R) {
    const I = yt(t, R);
    I && m((A) => ri(A, I));
  }
  function N(R) {
    y(R), w(R == null ? [] : [R]), c.current = R, g.current = [];
  }
  function q(R, {
    focusEditor: I = !1,
    seekToSegment: A = !1,
    additive: P = !1,
    rangeSegmentIds: _ = null
  } = {}) {
    var Y, k;
    const K = vs({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, R.id, _, P);
    w(K.selectedSegmentIds), y(K.activeSegmentId), c.current = K.anchorSegmentId, g.current = K.rangeBaseSegmentIds, K.activeSegmentId != null && b(yt(t, K.activeSegmentId)), S(R.id), I && ((Y = r.current) == null || Y.focus({ preventScroll: !0 })), A && ((k = i.current) == null || k.call(i, R.startSec, !1));
  }
  function O(R) {
    const I = bs(
      d,
      l,
      R
    );
    w(I.selectedSegmentIds), y(I.activeSegmentId), c.current = I.activeSegmentId, g.current = [], I.activeSegmentId != null && (b(yt(t, I.activeSegmentId)), S(I.activeSegmentId));
  }
  function W() {
    var A;
    const R = Ss(s), I = R.includes(l) ? l : R[0] ?? null;
    u(ut({})), p(!1), w(R), y(I), c.current = I, g.current = [], I != null && b(yt(
      _t(s, a, o),
      I
    )), f(R.length === 0 ? "There are no segments to select." : `${R.length} segments selected. Collapsed Segment groups keep their selected segments.`), (A = r.current) == null || A.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: S, replaceSegmentSelection: N, selectSegment: q, selectSegmentCollection: O, selectAllVideoSegments: W };
}
function Od(e) {
  const { acceptHistory: t, compatibilityMode: r, detail: o, detailPanelRef: i, historyRef: a, mergeSavingRef: s, onConflict: l, onDetailChange: d, onReload: c, pendingReviewStateRef: g, recordHistoryAction: m, revealSegmentGroupForSelection: u, reviewSavingRef: p, savingSegmentId: f, selectedGroups: b, selectedSegment: y, selectedSegmentIdRef: w, selectedSegments: S, selectionAnchorIdRef: N, selectionRangeBaseIdsRef: q, setMergeConfirmation: O, setSaveMessage: W, setSavingSegmentId: R, setSelectedSegmentId: I, setSelectedSegmentIds: A, video: P } = e;
  function _() {
    O(null), requestAnimationFrame(() => {
      var k;
      return (k = i.current) == null ? void 0 : k.focus({ preventScroll: !0 });
    });
  }
  async function K(k = !1, T = !1, U = null) {
    if (s.current || f != null) return;
    const Z = U || ti(
      b,
      { nativeOnly: !r }
    );
    if (!Z) {
      W("Select at least two segments from one swimlane.");
      return;
    }
    if (!k && Ea()) {
      O(Z);
      return;
    }
    T && Da(!1), _();
    const ie = Z.endSec == null ? "open end" : Me(Z.endSec);
    s.current = !0;
    let ue = Z.segments[0];
    const ge = r ? null : ct(Z.segments, !1), F = r ? null : crypto.randomUUID(), X = Z.segments.map((ae) => ae.id), ce = Wl(o, Z.segments);
    R(ue.id), d(ce, P.id), A([ue.id]), I(ue.id), N.current = ue.id, q.current = [];
    try {
      const ae = Z.segments.slice(1);
      if (!r || ue.nativeSegmentId != null) {
        const xe = ae.map((M) => {
          const V = `merge-native-selection:${P.id}:${ue.id}:${M.id}:${ue.updatedAt}:${M.updatedAt}`;
          return { key: V, operationId: Pe(V), segmentId: M.id, expectedUpdatedAt: M.updatedAt };
        }), Se = await ee(`/videos/${P.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: ue.id,
            expectedSurvivorUpdatedAt: ue.updatedAt,
            consumedSegments: xe.map(({ key: M, ...V }) => V),
            historyReceiptId: F
          })
        });
        ue = Se.survivor, d(Qo(o, Se), P.id), xe.forEach(({ key: M }) => Le(M));
      } else {
        const xe = ae.map((M) => {
          const V = `merge-draft-selection:${P.id}:${ue.itemId}:${M.itemId}:${ue.revision}:${M.revision}`;
          return { key: V, operationId: Pe(V), itemId: M.itemId, expectedRevision: M.revision };
        }), Se = await ee(`/videos/${P.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: ue.itemId,
            expectedSurvivorRevision: ue.revision,
            consumedDrafts: xe.map(({ key: M, ...V }) => V)
          })
        });
        ue = Se.survivor, d(Qo(o, Se), P.id), xe.forEach(({ key: M }) => Le(M));
      }
      A([ue.id]), I(ue.id), N.current = ue.id, q.current = [], r ? t(At) : await m(
        "segments.merge",
        `Merged ${Z.segments.length} segments`,
        ge,
        ct([ue], !1),
        F
      ), u(ue.id), W(`${Z.segments.length} segments merged into ${Me(Z.startSec)} – ${ie}.`);
    } catch (ae) {
      d((xe) => oi(
        Fn(xe, [Z.segments[0]], [
          "startSec",
          "endSec",
          "sourceKey",
          "sourceRunId",
          "confidence",
          "isDerived"
        ]),
        Z.segments.slice(1)
      ), P.id), A(X), I((y == null ? void 0 : y.id) ?? X[0] ?? null), N.current = (y == null ? void 0 : y.id) ?? X[0] ?? null, q.current = [], ae.status === 409 ? await l() : W(ae.message || "Unable to merge selected segments.");
    } finally {
      s.current = !1, R(null);
    }
  }
  async function Y(k, T = S, U = y) {
    var ce;
    if (T.length === 0 || p.current) return;
    if (f != null) {
      g.current.push(Ps(
        k,
        T,
        U
      )), W(`${k === "approved" ? "Approval" : "Rejection"} queued…`);
      return;
    }
    const Z = Os(T, k), ie = T.filter((ae) => ae.reviewState !== Z);
    if (ie.length === 0) return;
    const ue = T.map((ae) => ({
      id: ae.id,
      itemId: ae.itemId,
      nativeSegmentId: ae.nativeSegmentId
    })), ge = ue.find((ae) => ae.id === (U == null ? void 0 : U.id)) || ue[0], F = (ae, xe = !1) => {
      if (!(ae != null && ae.segments) || !xe && !zr(w.current, ge.id))
        return;
      const Se = ue.map((V) => Ue(ae == null ? void 0 : ae.segments, V)).filter(Boolean), M = Ue(ae == null ? void 0 : ae.segments, ge) || Se[0] || null;
      A(Se.map((V) => V.id)), I((M == null ? void 0 : M.id) ?? null), N.current = (M == null ? void 0 : M.id) ?? null, q.current = [];
    };
    p.current = !0, R((U == null ? void 0 : U.id) ?? ie[0].id), W(`Updating ${ie.length} selected segment${ie.length === 1 ? "" : "s"}…`);
    const X = gr(
      o,
      ie.map((ae) => ae.id),
      { reviewState: Z }
    );
    d(X, P.id);
    try {
      const ae = await ee(`/videos/${P.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: a.current.revision,
          reviewState: Z,
          segments: T.map((V) => V.published ? {
            nativeSegmentId: V.nativeSegmentId,
            expectedUpdatedAt: V.updatedAt
          } : {
            itemId: V.itemId,
            expectedRevision: V.revision
          })
        })
      }), xe = new Map((ae.items || []).map((V) => [
        V.requestedNativeSegmentId != null ? `native:${V.requestedNativeSegmentId}` : `item:${V.requestedItemId}`,
        V
      ]));
      if (ue.forEach((V) => {
        const H = xe.get(V.nativeSegmentId != null ? `native:${V.nativeSegmentId}` : `item:${V.itemId}`);
        H && (V.nativeSegmentId = H.nativeSegmentId, V.itemId = H.itemId);
      }), ae.history && t(ae.history), Z === "rejected" || (ae.items || []).some((V) => V.requestedNativeSegmentId != null && V.nativeSegmentId !== V.requestedNativeSegmentId)) {
        F(await c()), W(`${ae.updatedCount} selected segment${ae.updatedCount === 1 ? "" : "s"} ${Z === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const M = {
        ...o,
        approvedSetVersion: ae.approvedSetVersion || o.approvedSetVersion,
        segments: (o.segments || []).map((V) => {
          const H = xe.get(V.nativeSegmentId != null ? `native:${V.nativeSegmentId}` : `item:${V.itemId}`);
          return H ? {
            ...V,
            id: H.nativeSegmentId != null ? H.nativeSegmentId : -H.itemId,
            itemId: H.itemId,
            nativeSegmentId: H.nativeSegmentId,
            published: H.nativeSegmentId != null,
            reviewState: Z,
            revision: H.nativeSegmentId != null ? V.revision : H.revision,
            updatedAt: H.updatedAt
          } : V;
        })
      };
      d(M, P.id), F(M), W(`${ae.updatedCount} selected segment${ae.updatedCount === 1 ? "" : "s"} ${Z === "approved" ? "approved" : Z === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (ae) {
      d((Se) => Fn(
        Se,
        ie,
        ["reviewState"]
      ), P.id), ae.status === 409 && ((ce = ae.payload) != null && ce.currentHistory) && t(ae.payload.currentHistory);
      const xe = ae.status === 409 ? await l() : o;
      F(xe, !0), W(ae.message || "Unable to update the selected segments.");
    } finally {
      p.current = !1, R(null);
    }
  }
  return { closeMergeConfirmation: _, mergeSelectedSwimlane: K, saveSelectedReviewState: Y };
}
function Pd(e) {
  const { acceptHistory: t, allSwimlanes: r, autoAssignCandidates: o, autoAssigning: i, binEmptyingRef: a, canMoveSelectionToBin: s, closeTagEditing: l, compatibilityMode: d, detail: c, editorRef: g, exportingExamples: m, incorrectExamples: u, lineage: p, materializeButtonRef: f, materializePreview: b, materializeRestoreFocusRef: y, materializing: w, mutateSegment: S, onConflict: N, onDetailChange: q, onReload: O, recordHistoryAction: W, refreshMaterializationPreview: R, removingExampleId: I, revealSegmentGroupForSelection: A, savingSegmentId: P, segments: _, selectedSegment: K, selectedSegmentIdRef: Y, selectedSegments: k, selectionAnchorIdRef: T, selectionRangeBaseIdsRef: U, setAutoAssignError: Z, setAutoAssignOpen: ie, setAutoAssigning: ue, setExportingExamples: ge, setIncorrectExamples: F, setMaterializeError: X, setMaterializeLoading: ce, setMaterializeOpen: ae, setMaterializePreview: xe, setMaterializing: Se, setRejectedDeletionPreview: M, setRemovingExampleId: V, setSaveMessage: H, setSavingSegmentId: se, setSelectedSegmentGroupKey: $, setSelectedSegmentId: le, setSelectedSegmentIds: G, video: v } = e;
  async function C() {
    var Ne, $e, Ce;
    if (k.length === 0 || !K || P != null) return;
    const E = Ul(k, u), oe = E.segments;
    if (oe.length === 0) return;
    const ve = k.map((Ee) => ({
      id: Ee.id,
      itemId: Ee.itemId,
      nativeSegmentId: Ee.nativeSegmentId
    })), be = ve.find((Ee) => Ee.id === K.id) || ve[0], he = [], Ae = [];
    let we = !1, pe = c;
    se(be.id), H(E.action === "remove" ? `Removing ${oe.length} selected incorrect example${oe.length === 1 ? "" : "s"}…` : `Collecting ${oe.length} selected segment${oe.length === 1 ? "" : "s"} as incorrect AI feedback…`);
    try {
      const Ee = async (Re, Te) => {
        const Ge = Re.nativeSegmentId != null, lt = E.action === "remove" ? `incorrect-example-remove:${v.id}:${Te == null ? void 0 : Te.id}:${Te == null ? void 0 : Te.revision}:${Te == null ? void 0 : Te.representationRevision}` : `incorrect-example-collect:${v.id}:${Ge ? `native:${Re.nativeSegmentId}:${Re.updatedAt}` : `item:${Re.itemId}:${Re.revision}`}`;
        if (E.action === "remove" && !Te)
          throw new Error("The incorrect-example collection changed. Reload and try again.");
        let Xe;
        try {
          Xe = E.action === "remove" ? await ee(
            `/videos/${v.id}/incorrect-examples/${Te.id}/remove`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Pe(lt),
                expectedExampleRevision: Te.revision,
                expectedRepresentationRevision: Te.representationRevision
              })
            }
          ) : await ee(`/videos/${v.id}/incorrect-examples/collect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Pe(lt),
              nativeSegmentId: Ge ? Re.nativeSegmentId : null,
              itemId: Ge ? null : Re.itemId,
              expectedUpdatedAt: Ge ? Re.updatedAt : null,
              expectedRevision: Ge ? null : Re.revision
            })
          });
        } catch (Nt) {
          throw Nt.operationKey = lt, Nt;
        }
        if (!Kl(E.action, Xe))
          throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
        return Le(lt), Xe;
      };
      for (const Re of oe) {
        const Te = E.action === "remove" ? u.find((Ge) => Ge.itemId != null && Ge.itemId === Re.itemId) : null;
        try {
          const Ge = ve.find((ot) => ot.id === Re.id);
          let lt = Ue(
            pe == null ? void 0 : pe.segments,
            Ge
          ) || Re, Xe;
          try {
            Xe = await Ee(lt, Te);
          } catch (ot) {
            if (ot.status === 409 && (($e = (Ne = ot.payload) == null ? void 0 : Ne.result) == null ? void 0 : $e.code) === "OPERATION_REPLAYED")
              pe = await ee(
                `/videos/${v.id}/editor`
              ), Le(ot.operationKey), Xe = ot.payload.result;
            else {
              if (E.action !== "collect" || ot.status !== 409) throw ot;
              const Mt = await ee(
                `/videos/${v.id}/editor`
              );
              pe = Mt;
              const Wt = Ue(
                Mt == null ? void 0 : Mt.segments,
                Ge
              );
              if (!Wt) throw ot;
              lt = Wt, Xe = await Ee(lt, null);
            }
          }
          Ge && Xe.itemId != null && (Ge.itemId = Xe.itemId), pe = Wr(
            pe,
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
        await W(
          Re ? "feedback.remove" : "feedback.collect",
          Re ? `Removed ${Te} incorrect AI example${Te === 1 ? "" : "s"}` : `Collected ${Te} incorrect AI example${Te === 1 ? "" : "s"}`,
          or(he, Re),
          or(he, !Re)
        ) || (we = !0);
      }
      he.some(({ result: Re }) => Re.representation === "basicNativeBin") && En();
      const je = zr(
        Y.current,
        be.id
      ), Ze = E.action === "collect" && he.some(({ segment: Re }) => Re.id === be.id), Fe = he.map(({ segment: Re }) => Re.id), Ie = Ze ? ws(
        r,
        Fe,
        be.id
      ) : null, ze = Ze ? (Ie == null ? void 0 : Ie.id) ?? null : be.id;
      je && Ze && (G(Ie ? [Ie.id] : []), le((Ie == null ? void 0 : Ie.id) ?? cr), T.current = (Ie == null ? void 0 : Ie.id) ?? null, U.current = []);
      const _e = await ee(`/videos/${v.id}/incorrect-examples`);
      F(_e);
      const We = pe;
      if (q(We, v.id), je && zr(
        Y.current,
        ze
      )) {
        let Re, Te;
        Ze ? (Te = Ie ? Ue(We == null ? void 0 : We.segments, {
          id: Ie.id,
          itemId: Ie.itemId,
          nativeSegmentId: Ie.nativeSegmentId
        }) : null, Re = Te ? [Te] : []) : (Re = ve.map((Ge) => Ue(We == null ? void 0 : We.segments, Ge)).filter(Boolean), Te = Ue(We == null ? void 0 : We.segments, be) || Re[0] || null), G(Re.map((Ge) => Ge.id)), le((Te == null ? void 0 : Te.id) ?? (Ze ? cr : null)), T.current = (Te == null ? void 0 : Te.id) ?? null, U.current = [], $(Te ? yt(r, Te.id) : null), Te && A(Te.id);
      }
      if (Ae.length > 0) {
        const Re = ((Ce = Ae[0]) == null ? void 0 : Ce.message) || "Only segments with registered AI provenance can be collected.";
        he.length === 0 ? H(Re) : E.action === "remove" ? H(
          `Partially removed ${he.length} of ${oe.length} selected incorrect examples. ${Re}`
        ) : H(
          `Partially collected ${he.length} of ${oe.length} selected segments. ${Re}`
        );
      } else if (E.action === "remove")
        H(
          `${he.length} incorrect example${he.length === 1 ? "" : "s"} removed and ${he.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
        );
      else {
        const Re = he.filter(({ result: Te }) => Te.representation === "basicNativeBin").length;
        H(Re === he.length ? `${he.length} incorrect AI example${he.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${he.length} incorrect AI example${he.length === 1 ? "" : "s"} collected and ${he.length === 1 ? "segment rejected" : "segments rejected"}.`);
      }
      we && H("The change saved, but editor history could not be updated.");
    } catch (Ee) {
      H(Ee.message || "Unable to update the selected incorrect examples.");
    } finally {
      se(null);
    }
  }
  async function x(E) {
    var ve, be;
    if (!E || I != null || m) return;
    V(E.id);
    const oe = `incorrect-example-remove:${v.id}:${E.id}:${E.revision}:${E.representationRevision}`;
    try {
      let he, Ae = !1;
      try {
        he = await ee(
          `/videos/${v.id}/incorrect-examples/${E.id}/remove`,
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
        we = await W(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          or($e, !0),
          or($e, !1)
        );
      }
      const pe = await ee(
        `/videos/${v.id}/incorrect-examples`
      );
      F(pe), Ae ? await O() : q(
        Wr(c, he.editorDelta),
        v.id
      ), E.representation === "basicNativeBin" && En(), H(we ? Ae ? d ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : E.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (he) {
      he.status === 409 && await N(), H(he.message || "Unable to remove the incorrect example.");
    } finally {
      V(null);
    }
  }
  async function h() {
    if (m || I != null || u.length === 0) return;
    ge(!0);
    const E = `incorrect-example-export:${v.id}:${u.map((oe) => `${oe.id}:${oe.revision}:${oe.representationRevision}`).join(",")}`;
    try {
      const oe = await _l(
        v.id,
        u
      ), ve = new FormData();
      ve.append("metadata", JSON.stringify({
        operationId: Pe(E),
        examples: oe.captures
      }));
      for (const Ne of oe.files)
        ve.append(Ne.fieldName, Ne.file);
      const be = await ee(
        `/videos/${v.id}/incorrect-examples/export`,
        { method: "POST", body: ve }
      ), he = await ll(be.downloadUrl), Ae = URL.createObjectURL(he.blob), we = document.createElement("a");
      we.href = Ae, we.download = he.fileName, we.click(), setTimeout(() => URL.revokeObjectURL(Ae), 1e3);
      const pe = await ee(
        `/training-exports/${be.id}/complete`,
        { method: "POST" }
      );
      Le(E), F(await ee(
        `/videos/${v.id}/incorrect-examples`
      )), H(
        `Downloaded ${be.exampleCount} incorrect example${be.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${pe.clearedExampleCount} from the working collection.`
      );
    } catch (oe) {
      H(oe.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      ge(!1);
    }
  }
  async function D(E = null) {
    const oe = _.filter(($e) => $e.reviewState === "rejected"), ve = oe.length, be = u.some(($e) => $e.representation === "fullItem");
    if (E == null && ve === 0 && !be) {
      H("There are no rejected segments to delete.");
      return;
    }
    if (E == null) {
      se(-1), H("Preparing deletion summary…");
      try {
        const $e = await ee(`/videos/${v.id}/rejected/deletion/preview`, { method: "POST" }), Ce = Number($e.deletedSegmentCount) || 0, Ee = Number($e.deferredRejectedSegmentCount) || 0, je = Number($e.protectedIncorrectExampleCount) || 0;
        if (Ce === 0) {
          Ee > 0 ? H(
            `${Ee} feedback-protected rejected segment${Ee === 1 ? "" : "s"} kept. ${je} AI feedback example${je === 1 ? "" : "s"} must be exported before ${Ee === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : H("There are no rejected segments to delete.");
          return;
        }
        if (!qa($e, H)) return;
        M($e), H("");
      } catch ($e) {
        H($e.message || "Unable to prepare rejected segment deletion.");
      } finally {
        se(null);
      }
      return;
    }
    const he = E, Ae = Number(he.deferredRejectedSegmentCount) || 0, we = Y.current, pe = Ae === 0 ? Vr(c, oe.map(($e) => $e.id)) : c, Ne = pe.segments.find(($e) => $e.reviewState === "unreviewed") || pe.segments[0] || null;
    M(null), se(-1), H("Deleting rejected segments…"), Ae === 0 && (q(pe, v.id), G(Ne ? [Ne.id] : []), le((Ne == null ? void 0 : Ne.id) ?? null), T.current = (Ne == null ? void 0 : Ne.id) ?? null, U.current = []);
    try {
      const $e = `rejected-dependency-delete:${v.id}:${he.fingerprint}`, Ce = await ee(`/videos/${v.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe($e),
          fingerprint: he.fingerprint
        })
      });
      Le($e), await O(), Ce.deletedSegmentCount > 0 && t(At);
      const Ee = Ae > 0 ? ` ${Ae} feedback-protected rejected segment${Ae === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      H(`${Ce.deletedSegmentCount} segment${Ce.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Ee}`);
    } catch ($e) {
      Ae === 0 && q((Ce) => oi(
        Ce,
        oe
      ), v.id), G(we == null ? [] : [we]), le(we), T.current = we, U.current = [], H($e.message || "Unable to delete rejected segments.");
    } finally {
      se(null);
    }
  }
  async function ne(E = o) {
    if (!(i || E.length === 0)) {
      ue(!0), Z("");
      try {
        const oe = await ee(`/videos/${v.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: E.flatMap((ve) => ve.nativeSegmentId == null ? [] : [ve.nativeSegmentId]),
            itemIds: E.flatMap((ve) => ve.published || ve.itemId == null ? [] : [ve.itemId])
          })
        });
        ie(!1), await O(), H(`${oe.assignedSegmentCount} segment${oe.assignedSegmentCount === 1 ? "" : "s"} received ${oe.assignedSlotCount} performer-slot assignment${oe.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (oe) {
        Z(oe.message || "Unable to auto-assign performers.");
      } finally {
        ue(!1);
      }
    }
  }
  async function re() {
    ae(!0), X(""), !b && (ce(!0), R());
  }
  function Q() {
    y.current = !0, ae(!1), requestAnimationFrame(() => {
      var E;
      return (E = f.current) == null ? void 0 : E.focus({ preventScroll: !0 });
    });
  }
  async function ke() {
    if (!b || w || b.createCount + b.linkCount === 0)
      return;
    Se(!0), X("");
    let E;
    try {
      const oe = `materialize-derived:${v.id}:${b.fingerprint}`;
      E = await ee(`/videos/${v.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe(oe),
          fingerprint: b.fingerprint,
          maxDepth: 3
        })
      }), Le(oe);
    } catch (oe) {
      oe.status === 409 && xe(null), X(oe.message || "Unable to materialize derived segments."), Se(!1);
      return;
    }
    xe((oe) => oe && { ...oe, createCount: 0, linkCount: 0 });
    try {
      await O(), Q(), xe(null);
      const oe = E.createdCount + E.linkedCount;
      H(`${E.createdCount} derived segment${E.createdCount === 1 ? "" : "s"} created and ${E.linkedCount} existing segment${E.linkedCount === 1 ? "" : "s"} linked.`), oe === 0 && H("Every applicable derivation was already materialized.");
    } catch {
      X("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    Se(!1);
  }
  async function J(E, oe = null) {
    var be, he, Ae, we;
    const ve = {
      tagId: E,
      ...oe ? { tagName: oe } : {}
    };
    if (k.length > 1) {
      const pe = k.filter((je) => je.tagId !== E);
      if (pe.length === 0) {
        l();
        return;
      }
      const Ne = k.map((je) => ({
        id: je.id,
        itemId: je.itemId,
        nativeSegmentId: je.nativeSegmentId
      })), $e = k.map((je) => !d || je.nativeSegmentId != null ? `native:${je.nativeSegmentId}:${je.updatedAt}` : `item:${je.itemId}:${je.revision}`).sort().join(","), Ce = `bulk-tag:${v.id}:${E}:${$e}`;
      se((K == null ? void 0 : K.id) ?? pe[0].id), H(`Changing tag for ${pe.length} selected segment${pe.length === 1 ? "" : "s"}…`);
      const Ee = gr(
        c,
        pe.map((je) => je.id),
        ve
      );
      q(Ee, v.id), l();
      try {
        const je = d ? null : crypto.randomUUID();
        await ee(`/videos/${v.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Pe(Ce),
            tagId: E,
            historyReceiptId: je,
            segments: k.map((_e) => {
              const We = !d || _e.nativeSegmentId != null;
              return {
                nativeSegmentId: We ? _e.nativeSegmentId : null,
                itemId: We ? null : _e.itemId,
                expectedUpdatedAt: We ? _e.updatedAt : null,
                expectedRevision: We ? null : _e.revision
              };
            })
          })
        }), Le(Ce);
        const Ze = ct(
          k,
          d
        ), Fe = await O(), Ie = Ne.map((_e) => Ue(Fe == null ? void 0 : Fe.segments, _e)).filter(Boolean);
        await W(
          "segments.tag",
          `Changed tag for ${pe.length} segment${pe.length === 1 ? "" : "s"}`,
          Ze,
          ct(Ie, d),
          je
        );
        const ze = Ne.map((_e) => Ue(Fe == null ? void 0 : Fe.segments, _e)).filter(Boolean);
        G(ze.map((_e) => _e.id)), le(((be = ze.find((_e) => _e.id === (K == null ? void 0 : K.id))) == null ? void 0 : be.id) ?? ((he = ze[0]) == null ? void 0 : he.id) ?? null), l(), H(`${pe.length} selected segment${pe.length === 1 ? "" : "s"} retagged.`);
      } catch (je) {
        q((Ie) => Fn(
          Ie,
          pe,
          Object.keys(ve)
        ), v.id);
        const Ze = Ne.map((Ie) => Ue(c.segments, Ie)).filter(Boolean), Fe = Ue(c.segments, {
          id: K == null ? void 0 : K.id,
          itemId: K == null ? void 0 : K.itemId,
          nativeSegmentId: K == null ? void 0 : K.nativeSegmentId
        }) || Ze[0] || null;
        G(Ze.map((Ie) => Ie.id)), le((Fe == null ? void 0 : Fe.id) ?? null), T.current = (Fe == null ? void 0 : Fe.id) ?? null, U.current = [], je.status === 409 && await N(), H(je.message || "Unable to change the selected segment tags.");
      } finally {
        se(null);
      }
      return;
    }
    if (!(k.length !== 1 || !K)) {
      if (E === K.tagId) {
        l();
        return;
      }
      if (K.itemId != null && ((we = (Ae = p.data) == null ? void 0 : Ae.children) == null ? void 0 : we.length) > 0) {
        se(K.id), H("Checking lineage impact…");
        try {
          const pe = await ee(`/items/${K.itemId}/tag-change/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedRevision: K.revision, tagId: E })
          }), Ne = pe.deletedItemIds.length > 0 || pe.removedEdgeIds.length > 0;
          if (Ne && !window.confirm(
            `Changing this tag removes ${pe.removedEdgeIds.length} lineage edge${pe.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${pe.deletedItemIds.length} derived segment${pe.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
          )) {
            H("Tag change canceled.");
            return;
          }
          const $e = gr(
            c,
            [K.id],
            ve
          );
          q($e, v.id), l();
          const Ce = `tag-change:${K.itemId}:${K.revision}:${pe.componentFingerprint}:${E}`;
          await ee(`/items/${K.itemId}/tag-change/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Pe(Ce),
              expectedRevision: K.revision,
              componentFingerprint: pe.componentFingerprint,
              tagId: E
            })
          }), Le(Ce), await O(), l(), H(Ne ? "Tag changed and lineage reconciled." : "Tag changed.");
        } catch (pe) {
          q((Ne) => Fn(
            Ne,
            [K],
            Object.keys(ve)
          ), v.id), G([K.id]), le(K.id), T.current = K.id, U.current = [], pe.status === 409 ? (H("Lineage changed — loading the latest segments…"), await N()) : H(pe.message || "Unable to reconcile the lineage.");
        } finally {
          se(null);
        }
        return;
      }
      l(), await S(K, {
        startSec: K.startSec,
        endSec: K.endSec,
        tagId: E
      }, !0, null, !0, ve);
    }
  }
  async function te() {
    var we, pe, Ne, $e;
    if (!s || !K || P != null) return;
    const E = [...k].sort((Ce, Ee) => Number(Ce.nativeSegmentId ?? Ce.id) - Number(Ee.nativeSegmentId ?? Ee.id)), oe = new Set(E.map((Ce) => Ce.id)), ve = E.map((Ce) => `${Ce.nativeSegmentId ?? Ce.id}:${Ce.updatedAt}`).join("|");
    se(K.id), H(`Moving ${E.length} segment${E.length === 1 ? "" : "s"} to recycling bin…`);
    const be = `bulk-move:${v.id}:${ve}`, he = Pe(be), Ae = d ? null : crypto.randomUUID();
    try {
      const Ce = (Ie = !1) => ee(`/videos/${v.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: he,
          segments: E.map((ze) => ({
            segmentId: ze.nativeSegmentId ?? ze.id,
            expectedUpdatedAt: ze.updatedAt
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
      Le(be), En();
      const je = new Map((Ee.items || []).map((Ie) => [
        Number(Ie.segmentId),
        Ie
      ]));
      await W(
        "segments.moveToBin",
        `Moved ${E.length} segment${E.length === 1 ? "" : "s"} to recycling bin`,
        ct(E, !1),
        ct(E.map((Ie) => {
          const ze = je.get(
            Number(Ie.nativeSegmentId ?? Ie.id)
          );
          return {
            ...Ie,
            recycleBinItemId: (ze == null ? void 0 : ze.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (ze == null ? void 0 : ze.revision) ?? null
          };
        }), !1),
        Ae
      );
      const Ze = _.filter((Ie) => !oe.has(Ie.id)), Fe = ks(r, oe, K.id);
      q({ ...c, segments: Ze }, v.id), G(Fe ? [Fe.id] : []), le((Fe == null ? void 0 : Fe.id) ?? null), T.current = (Fe == null ? void 0 : Fe.id) ?? null, U.current = [], Fe && ($(yt(r, Fe.id)), A(Fe.id)), requestAnimationFrame(() => {
        var Ie;
        return (Ie = g.current) == null ? void 0 : Ie.focus({ preventScroll: !0 });
      }), H(`Moved ${E.length} segment${E.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Ce) {
      const Ee = ((pe = Ce.payload) == null ? void 0 : pe.code) || (($e = (Ne = Ce.payload) == null ? void 0 : Ne.result) == null ? void 0 : $e.code);
      Ce.status === 409 && Ee === "CANONICAL_SEGMENT_CHANGED" ? await N() : H(Ce.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      se(null);
    }
  }
  async function z() {
    if (!(d || a.current || P != null)) {
      a.current = !0, H("Checking the recycling bin…");
      try {
        const E = await ee("/bin"), oe = await Va(E, () => H("Emptying the recycling bin…"));
        if (oe.status === "empty") {
          H("The recycling bin is empty.");
          return;
        }
        if (oe.status === "canceled") {
          H("The recycling bin was not emptied.");
          return;
        }
        H(`${oe.segmentCount} segment${oe.segmentCount === 1 ? "" : "s"} from ${oe.sceneCount} scene${oe.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (E) {
        H(E.message || "Unable to empty the recycling bin.");
      } finally {
        a.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: C, removeIncorrectExample: x, captureTrainingExport: h, deleteRejectedSegments: D, autoAssignPerformers: ne, previewDerivedSegments: re, closeMaterializeDialog: Q, materializeDerivedSegments: ke, saveTag: J, moveToBin: te, emptyRecyclingBin: z };
}
function Ld(e) {
  const { acceptHistory: t, commonActionsRef: r, compatibilityMode: o, currentTime: i, detail: a, editorLayout: s, focusRowRef: l, history: d, historyRef: c, historySaving: g, horizontalLayoutSize: m, mediaStackHeight: u, mediaStackRef: p, onDetailChange: f, onReload: b, railToggleRef: y, recordHistoryAction: w, savingSegmentId: S, savingShot: N, savingShotRef: q, setCollapsedSegmentGroups: O, setEditorLayout: W, setHistorySaving: R, setIncorrectExamples: I, setSaveMessage: A, setSavingSegmentId: P, setSavingShot: _, shotBoundaries: K, timelineDuration: Y, video: k, workspaceRef: T } = e;
  async function U(v, C, x) {
    var re, Q, ke, J;
    const h = v.type === "segment" ? [v] : v.segments || [], D = (C == null ? void 0 : C.type) === "segment" ? [C] : (C == null ? void 0 : C.segments) || [];
    let ne = x;
    for (const [te, z] of h.entries()) {
      const E = D[te], oe = ((re = z.identity) == null ? void 0 : re.nativeSegmentId) != null || ((Q = z.identity) == null ? void 0 : Q.published) === !0, ve = ((ke = E == null ? void 0 : E.identity) == null ? void 0 : ke.recycleBinItemId) ?? ((J = E == null ? void 0 : E.identity) == null ? void 0 : J.itemId);
      let be = Ue(ne.segments, E == null ? void 0 : E.identity) || Ue(ne.segments, z.identity);
      if (!be && oe && ve != null && E.identity.revision != null) {
        const we = `history-restore:${k.id}:${ve}:${E.identity.revision}`;
        await ee(`/bin/${ve}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Pe(we),
            expectedRevision: E.identity.revision
          })
        }), Le(we), ne = await b(), be = ne.segments.find((pe) => pe.tagId === z.values.tagId && pe.startSec === z.values.startSec && pe.endSec === z.values.endSec);
      }
      if (!be)
        throw new Error("A segment in this history state no longer exists.");
      if ((be.nativeSegmentId != null || be.published === !0) !== oe) {
        if (oe) {
          const we = be.recycleBinItemId ?? be.itemId ?? ve;
          if (we == null)
            throw new Error("This recycled segment can no longer be restored.");
          const pe = `history-restore:${k.id}:${we}:${be.revision}:${z.values.reviewState ?? "native"}`;
          await ee(`/bin/${we}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Pe(pe),
              expectedRevision: be.revision
            })
          }), Le(pe);
        } else {
          const we = `history-bin:${k.id}:${be.nativeSegmentId}:${be.updatedAt}:${z.values.reviewState}`;
          await ee(`/videos/${k.id}/segments/${be.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Pe(we),
              expectedUpdatedAt: be.updatedAt,
              reviewState: z.values.reviewState
            })
          }), Le(we);
        }
        if (ne = await b(), !oe)
          continue;
        if (be = Ue(ne.segments, z.identity) || ne.segments.find((we) => we.tagId === z.values.tagId && we.startSec === z.values.startSec && we.endSec === z.values.endSec), !be)
          throw new Error("The restored segment could not be found.");
      }
      const Ae = z.values;
      if (be.nativeSegmentId == null && be.itemId != null) {
        const we = `history-draft-update:${k.id}:${be.itemId}:${be.revision}:${Ae.tagId}:${Ae.startSec}:${Ae.endSec ?? "open"}:${Ae.reviewState}`;
        await ee(`/videos/${k.id}/drafts/${be.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Pe(we),
            expectedRevision: be.revision,
            ...Ae
          })
        }), Le(we);
      } else
        await ee(`/videos/${k.id}/segments/${be.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Ae, expectedUpdatedAt: be.updatedAt })
        });
      ne = await b();
    }
    return ne;
  }
  async function Z(v, C) {
    var x;
    for (const h of v.targets || []) {
      const D = Ue(C.segments, h.identity);
      if (!D)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const ne = (x = C.performerSlotRevisions) == null ? void 0 : x[D.id];
      await ee(D.published ? `/videos/${k.id}/segments/${D.nativeSegmentId}/slots` : `/videos/${k.id}/drafts/${D.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: ne,
          assignments: h.assignments
        })
      }), C = await b();
    }
    return C;
  }
  async function ie(v, C, x) {
    if (!o)
      throw new Error("AI feedback history is only available in Full mode.");
    let h = C, D = await ee(`/videos/${k.id}/incorrect-examples`);
    const ne = (re) => D.find((Q) => {
      var ke;
      return Q.id === re.exampleId || ((ke = re.collectedIdentity) == null ? void 0 : ke.itemId) != null && Q.itemId === re.collectedIdentity.itemId;
    });
    for (const [re, Q] of (v.entries || []).entries()) {
      const ke = `history-feedback:${k.id}:${x.action.sequence}:${x.direction}:${re}`, J = ne(Q);
      if (v.collected && J) {
        Le(ke);
        continue;
      }
      let te;
      if (v.collected) {
        const z = Ue(
          h.segments,
          Q.collectedIdentity
        ) || Ue(
          h.segments,
          Q.originalIdentity
        );
        if (!z)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const E = z.nativeSegmentId != null;
        te = await ee(`/videos/${k.id}/incorrect-examples/collect`, {
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
        if (!J) {
          Le(ke);
          continue;
        }
        te = await ee(
          `/videos/${k.id}/incorrect-examples/${J.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Pe(ke),
              expectedExampleRevision: J.revision,
              expectedRepresentationRevision: J.representationRevision
            })
          }
        );
      }
      Le(ke), h = Wr(
        h,
        te.editorDelta
      ), D = await ee(
        `/videos/${k.id}/incorrect-examples`
      );
    }
    return I(D), h;
  }
  async function ue(v, C, x = []) {
    const h = v.state;
    if (!o && ((h == null ? void 0 : h.type) === "segment" || (h == null ? void 0 : h.type) === "segments")) {
      const ne = `basic-history:${k.id}:${c.current.revision}:${v.action.sequence}:${v.direction}`, re = await ee(`/videos/${k.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe(ne),
          expectedHistoryRevision: c.current.revision,
          actionSequence: v.action.sequence,
          direction: v.direction
        })
      });
      return t(re.history), x.push(ne), b();
    }
    const D = v.direction === "backward" ? v.action.afterState : v.action.beforeState;
    if ((h == null ? void 0 : h.type) === "composite") {
      let ne = C;
      const re = (D == null ? void 0 : D.type) === "composite" ? D.states || [] : [];
      for (const [Q, ke] of (h.states || []).entries()) {
        const J = re[Q];
        ne = await ue({
          ...v,
          state: ke,
          action: {
            ...v.action,
            beforeState: v.direction === "backward" ? ke : J,
            afterState: v.direction === "backward" ? J : ke
          }
        }, ne, x);
      }
      return ne;
    }
    if ((h == null ? void 0 : h.type) === "segment" || (h == null ? void 0 : h.type) === "segments")
      return U(
        h,
        D,
        C
      );
    if ((h == null ? void 0 : h.type) === "performerSlots")
      return Z(h, C);
    if ((h == null ? void 0 : h.type) === "incorrectExamples")
      return ie(h, C, v);
    if ((h == null ? void 0 : h.type) === "shots") {
      const ne = Mn(C.shotBoundaries || []), re = await ee(`/videos/${k.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe(`history-shots:${k.id}:${ne}:${h.fingerprint}`),
          expectedFingerprint: ne,
          boundaries: h.boundaries
        })
      });
      return { ...C, shotBoundaries: re };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function ge(v) {
    var x;
    if (g || S != null || N || v === d.cursorSequence)
      return;
    const C = Sl(d, v);
    if (C.length !== 0) {
      R(!0), P(-1), A(`Restoring ${C.length} history ${C.length === 1 ? "action" : "actions"}…`);
      try {
        let h = a;
        const D = [];
        for (const re of C)
          h = await ue(
            re,
            h,
            D
          );
        const ne = o ? await ee(`/videos/${k.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: c.current.revision,
            targetSequence: v
          })
        }) : c.current;
        D.forEach(Le), t(ne), await b(), A("History restored.");
      } catch (h) {
        h.status === 409 && ((x = h.payload) != null && x.current) && t(h.payload.current), await b(), A(h.message || "Unable to restore editor history.");
      } finally {
        P(null), R(!1);
      }
    }
  }
  function F(v) {
    W((C) => ({ ...C, timelineRatio: eo(v, u) }));
  }
  function X(v) {
    var h, D;
    const C = (h = p.current) == null ? void 0 : h.getBoundingClientRect();
    if (!C) return;
    const x = ((D = r.current) == null ? void 0 : D.offsetHeight) || 0;
    F(ss(
      v.clientY,
      C.top + x,
      Math.max(0, C.height - x)
    ));
  }
  function ce(v) {
    v.currentTarget.setPointerCapture(v.pointerId), X(v);
  }
  function ae(v) {
    v.currentTarget.hasPointerCapture(v.pointerId) && X(v);
  }
  function xe(v) {
    const C = v.shiftKey ? 0.1 : 0.05;
    let x = null;
    v.key === "ArrowUp" && (x = s.timelineRatio + C), v.key === "ArrowDown" && (x = s.timelineRatio - C);
    const h = Xr(u);
    v.key === "Home" && (x = h.minimum), v.key === "End" && (x = h.maximum), x != null && (v.preventDefault(), v.stopPropagation(), F(x));
  }
  function Se(v) {
    const C = v === "detailWidth" ? m.focusRow : m.workspace, x = m.workspace > 0 ? Ur(m.workspace, 600) : 560, h = zt(s.markerRailWidth, x), D = v === "detailWidth" ? 344 + (s.markerRailOpen ? h + 24 : 0) : 600;
    return C > 0 ? Ur(C, D) : 560;
  }
  function M(v, C) {
    W((x) => ({ ...x, [v]: zt(C, Se(v)) }));
  }
  function V(v, C) {
    var h, D;
    const x = C === "detailWidth" ? (h = l.current) == null ? void 0 : h.getBoundingClientRect() : (D = T.current) == null ? void 0 : D.getBoundingClientRect();
    x && M(C, C === "detailWidth" ? v.clientX - x.left : x.right - v.clientX);
  }
  function H(v, C) {
    const x = Se(v), h = zt(s[v], x);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": C,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(x),
      "aria-valuenow": Math.round(h),
      "aria-valuetext": `${Math.round(h)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (D) => {
        D.currentTarget.setPointerCapture(D.pointerId), V(D, v);
      },
      onPointerMove: (D) => {
        D.currentTarget.hasPointerCapture(D.pointerId) && V(D, v);
      },
      onKeyDown: (D) => {
        const ne = D.shiftKey ? 40 : 16;
        let re = null;
        D.key === "ArrowLeft" && (re = v === "detailWidth" ? -ne : ne), D.key === "ArrowRight" && (re = v === "detailWidth" ? ne : -ne);
        let Q = re == null ? null : h + re;
        D.key === "Home" && (Q = 240), D.key === "End" && (Q = x), Q != null && (D.preventDefault(), D.stopPropagation(), M(v, Q));
      },
      onDoubleClick: () => M(v, it[v]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function se() {
    W((v) => ({ ...v, markerRailOpen: !v.markerRailOpen })), requestAnimationFrame(() => {
      var v;
      return (v = y.current) == null ? void 0 : v.focus({ preventScroll: !0 });
    });
  }
  function $(v) {
    O((C) => C.includes(v) ? C.filter((x) => x !== v) : Lt([...C, v]));
  }
  async function le(v, C = !0, x = i) {
    var re;
    if (q.current) return null;
    const h = Number((re = k.videoFile) == null ? void 0 : re.duration) || Y, D = Mn(K), ne = `shot-${v}:${k.id}:${x.toFixed(3)}:${h.toFixed(3)}:${D}`;
    q.current = !0, _(!0), A(v === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const Q = await ee(`/videos/${k.id}/shot-boundaries/${v}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v === "split" ? { operationId: Pe(ne), timeSec: x } : { operationId: Pe(ne), timeSec: x })
      });
      return Le(ne), f((ke) => ({ ...ke, shotBoundaries: Q }), k.id), C && await w(
        "shots.update",
        v === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: K,
          fingerprint: D
        },
        {
          type: "shots",
          boundaries: Q,
          fingerprint: Mn(Q)
        }
      ), A(v === "split" ? "Shot boundary added." : "Shots merged."), Q;
    } catch (Q) {
      return A(Q.message || "Unable to edit shot boundaries."), null;
    } finally {
      q.current = !1, _(!1);
    }
  }
  async function G(v) {
    if (q.current) return null;
    const C = `shot-restore:${k.id}:${v.afterFingerprint}`;
    q.current = !0, _(!0), A("Undoing shot edit…");
    try {
      const x = await ee(`/videos/${k.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe(C),
          expectedFingerprint: v.afterFingerprint,
          boundaries: v.before
        })
      });
      return Le(C), f((h) => ({ ...h, shotBoundaries: x }), k.id), x;
    } catch (x) {
      return A(x.message || "Unable to undo the shot edit."), null;
    } finally {
      q.current = !1, _(!1);
    }
  }
  return { applySegmentHistoryState: U, applyPerformerSlotHistoryState: Z, applyHistoryState: ue, restoreHistoryTarget: ge, updateTimelineRatio: F, updateTimelineRatioFromPointer: X, handleSeparatorPointerDown: ce, handleSeparatorPointerMove: ae, handleSeparatorKeyDown: xe, panelWidthMaximum: Se, updatePanelWidth: M, handlePanelSeparatorPointer: V, panelSeparatorProps: H, toggleSegmentRail: se, toggleSegmentGroup: $, mutateShotBoundary: le, restoreShotBoundaries: G };
}
function Fd(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: m, lineage: u, mediaDuration: p, mergeSelectedSwimlane: f, moveToBin: b, mutateShotBoundary: y, openPublishApprovedDialog: w, playbackControlsRef: S, playbackShortcutConfig: N, saveSelectedReviewState: q, seekRef: O, segmentGroupKeys: W, selectSegment: R, selectedSegment: I, selectedSegmentGroupForSegment: A, selectedSegmentGroupKey: P, selectedSegments: _, setCollapsedSegmentGroups: K, setIncorrectExamplesOpen: Y, setQuickSearchOpen: k, setSaveMessage: T, setSelectedSegmentGroupKey: U, setTagEditing: Z, setTimelineZoom: ie, shotBoundaries: ue, slotButtonRef: ge, splitSegment: F, swimlanes: X, timelineDuration: ce, toggleIncorrectExample: ae, toggleSegmentGroup: xe, updateTimelineRatio: Se, videoFrameRate: M, visibleSegments: V } = e;
  function H($, le) {
    if (_.length > 1 && As($.id))
      return;
    let G = null;
    $.id === "video.playPause" && (G = () => {
      var v;
      return (v = S.current) == null ? void 0 : v.toggle();
    }), $.id === "video.seekSmallBackward" && (G = () => {
      var v;
      return (v = S.current) == null ? void 0 : v.seekBy(-N.smallSeekTime);
    }), $.id === "video.seekSmallForward" && (G = () => {
      var v;
      return (v = S.current) == null ? void 0 : v.seekBy(N.smallSeekTime);
    }), $.id === "video.seekMediumBackward" && (G = () => {
      var v;
      return (v = S.current) == null ? void 0 : v.seekBy(-N.mediumSeekTime);
    }), $.id === "video.seekMediumForward" && (G = () => {
      var v;
      return (v = S.current) == null ? void 0 : v.seekBy(N.mediumSeekTime);
    }), $.id === "video.seekLongBackward" && (G = () => {
      var v;
      return (v = S.current) == null ? void 0 : v.seekBy(-N.longSeekTime);
    }), $.id === "video.seekLongForward" && (G = () => {
      var v;
      return (v = S.current) == null ? void 0 : v.seekBy(N.longSeekTime);
    }), $.id === "video.playSelected" && I && (G = () => {
      var v;
      (v = O.current) == null || v.call(O, I.startSec, !0), requestAnimationFrame(() => {
        var C;
        return (C = g.current) == null ? void 0 : C.focus({ preventScroll: !0 });
      });
    }), ($.id === "video.playPreviousSegment" || $.id === "video.playNextSegment") && (G = () => {
      var C;
      const v = qr(
        X,
        I == null ? void 0 : I.id,
        $.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !v || v.id === (I == null ? void 0 : I.id) || (R(v, { focusEditor: !0, seekToSegment: !1 }), (C = O.current) == null || C.call(O, v.startSec, !0));
    }), $.id.startsWith("video.seekPercent") && (G = () => {
      var C;
      const v = Number($.id.slice(17)) / 10;
      (C = O.current) == null || C.call(O, Ns(p ?? ce, v), !1);
    }), $.id === "video.jumpToSegmentStart" && I && (G = () => {
      var v;
      return (v = O.current) == null ? void 0 : v.call(O, I.startSec, !1);
    }), $.id === "video.jumpToSegmentEnd" && I && (G = () => {
      var v;
      return (v = O.current) == null ? void 0 : v.call(O, I.endSec ?? I.startSec, !1);
    }), $.id === "video.jumpToVideoStart" && (G = () => {
      var v;
      return (v = O.current) == null ? void 0 : v.call(O, 0, !1);
    }), $.id === "video.jumpToVideoEnd" && (G = () => {
      var v;
      return (v = O.current) == null ? void 0 : v.call(O, ce, !1);
    }), $.id.startsWith("video.frame") && (G = () => {
      var x, h;
      const v = $.id.includes("Small") ? "small" : $.id.includes("Medium") ? "medium" : "long", C = N[`${v}FrameStep`] * ($.id.endsWith("Backward") ? -1 : 1);
      (x = S.current) == null || x.pause(), (h = S.current) == null || h.seekBy(zs(C, M));
    }), $.id.startsWith("navigation.swimlane") && (G = () => {
      const v = $.id.slice(19).toLowerCase(), C = qr(X, I == null ? void 0 : I.id, v, s);
      C && R(C, { focusEditor: !0, seekToSegment: !1 });
    }), ($.id === "navigation.extendSwimlaneLeft" || $.id === "navigation.extendSwimlaneRight") && (G = () => {
      const v = Fl(
        t,
        I == null ? void 0 : I.id,
        $.id.endsWith("Left") ? "left" : "right"
      );
      v && R(v.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: v.segmentIds
      });
    }), ($.id === "navigation.segmentGroupUp" || $.id === "navigation.segmentGroupDown") && (G = () => {
      const v = jl(
        W,
        P ?? A,
        $.id.endsWith("Up") ? -1 : 1
      );
      v && U(v);
    }), ($.id === "navigation.previousAtPlayhead" || $.id === "navigation.nextAtPlayhead") && (G = () => {
      const v = ls(V, s, $.id === "navigation.previousAtPlayhead" ? -1 : 1, I == null ? void 0 : I.id);
      v && R(v, { focusEditor: !0, seekToSegment: !1 });
    }), $.id === "navigation.nearestInCurrentSwimlane" && (G = () => {
      const v = Qi(
        X,
        I == null ? void 0 : I.id,
        s
      );
      v && R(v, { focusEditor: !0, seekToSegment: !1 });
    }), $.id.includes("Unreviewed") && (G = () => {
      const v = lr(
        X,
        I == null ? void 0 : I.id,
        $.id.startsWith("navigation.previous") ? -1 : 1,
        $.id.endsWith("Global")
      );
      v && R(v, { focusEditor: !le.preserveFocus, seekToSegment: !1 });
    }), ($.id === "navigation.nextTouchingPlayhead" || $.id === "navigation.previousTouchingPlayhead") && (G = () => {
      const v = Yi(X, s, $.id === "navigation.previousTouchingPlayhead" ? -1 : 1, I == null ? void 0 : I.id);
      v && R(v, { focusEditor: !0, seekToSegment: !1 });
    }), $.id === "navigation.quickSearch" && (G = () => k(!0)), ($.id === "navigation.previousShot" || $.id === "navigation.nextShot") && (G = () => {
      var C;
      const v = Ks(ue, s, $.id === "navigation.previousShot" ? -1 : 1);
      v && ((C = O.current) == null || C.call(O, v.startSec, !1));
    }), $.id === "shot.split" && (G = () => y("split")), $.id === "shot.merge" && (G = () => y("merge")), $.id === "marker.create" && (G = () => a()), $.id === "marker.duplicate" && (G = () => d(!1)), $.id === "marker.duplicateAtPlayhead" && (G = () => d(!0)), $.id === "marker.split" && (G = () => F()), $.id === "marker.editTag" && (G = () => {
      var v;
      if (_.length > 1 && _.some((C) => C.isDerived)) {
        T("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((v = u.data) != null && v.tagReadOnly) {
        T("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      Z(!0);
    }), $.id === "marker.setStart" && I && (G = () => r(s, I.endSec)), $.id === "marker.setEnd" && I && (G = () => r(I.startSec, s)), $.id === "marker.copyTiming" && I && (G = () => {
      T(nd(I) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), $.id === "marker.pasteTiming" && I && (G = () => {
      const v = td();
      if (!v) {
        T("No copied segment timing is available.");
        return;
      }
      r(v.startSec, v.endSec);
    }), $.id === "marker.mergeSelection" && (G = () => f()), $.id === "marker.moveToBin" && (G = () => b()), $.id === "marker.toggleIncorrectExample" && I && (G = () => ae()), $.id === "marker.openIncorrectExamples" && (G = () => Y(!0)), $.id === "markerGroup.toggleCollapse" && P && (G = () => xe(P)), $.id === "markerGroup.toggleAll" && (G = () => K((v) => Ll(v, W))), $.id === "marker.assignSlots" && (G = () => {
      var v;
      return (v = ge.current) == null ? void 0 : v.click();
    }), $.id === "navigation.zoomIn" && (G = () => ie((v) => dr(v + 0.5))), $.id === "navigation.zoomOut" && (G = () => ie((v) => dr(v - 0.5))), $.id === "navigation.resetZoom" && (G = () => ie(1)), $.id === "navigation.centerPlayhead" && (G = () => {
      var v;
      return (v = o.current) == null ? void 0 : v.call(o);
    }), $.id === "layout.growSwimlanes" && (G = () => Se(c.timelineRatio + 0.05)), $.id === "layout.shrinkSwimlanes" && (G = () => Se(c.timelineRatio - 0.05)), $.id === "marker.confirm" && I && (G = () => q("approved")), $.id === "system.publishApproved" && (G = () => w(le.target)), $.id === "marker.reject" && I && (G = () => q("rejected")), $.id === "system.emptyBin" && (G = () => m()), $.id === "system.deleteRejected" && (G = () => l()), G && G();
  }
  function se($, le) {
    const G = jn.find((v) => v.id === $);
    G && un(G, i) && H(G, le);
  }
  return { executeShortcutById: se };
}
function sa(e) {
  return e === !0;
}
function la() {
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
function jd(e, t, r = !1, o = 0, i = "") {
  const [a, s] = L(null), [l, d] = L(null), [c, g] = L(""), [m, u] = L({
    busy: !1,
    reviewState: null,
    error: ""
  }), p = fe(null);
  async function f(w) {
    u({ busy: !0, reviewState: w, error: "" });
    try {
      await ee(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Hr(), reviewState: w })
      }), await t(), u({ busy: !1, reviewState: null, error: "" });
    } catch (S) {
      u({
        busy: !1,
        reviewState: null,
        error: S.message || "Unable to import Cove segments."
      });
    }
  }
  async function b(w) {
    try {
      const S = await ee(`/videos/${e}/analysis-runs`, {
        signal: w.signal
      });
      if (!w.isActive()) return null;
      const N = (S == null ? void 0 : S[0]) || null;
      return s(N), (N == null ? void 0 : N.status) === "completed" && p.current !== N.id && (p.current = N.id, await t()), ((N == null ? void 0 : N.status) === "failed" || (N == null ? void 0 : N.status) === "cancelled") && g(N.errorMessage || "Video analysis did not complete."), N;
    } catch (S) {
      return w.isActive() && S.name !== "AbortError" && g(S.message || "Unable to load video analysis status."), null;
    }
  }
  async function y(w = null) {
    g("");
    const S = w || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), N = S.includes("omnishotcut") && o > 0;
    if (!(N && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const q = await ee(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: S,
            replaceShotBoundaries: N,
            expectedShotBoundaryFingerprint: N ? i : null
          })
        });
        s(q);
      } catch (q) {
        g(q.message || "Unable to start video analysis.");
      }
  }
  return ye(() => {
    if (!sa(r)) {
      s(null), d(null), g("");
      return;
    }
    const w = la();
    return b(w), ee("/analysis/status", { signal: w.signal }).then((S) => {
      w.isActive() && (d(S), S.configured || g(""));
    }).catch((S) => {
      w.isActive() && S.name !== "AbortError" && g(S.message || "Unable to check video analysis readiness.");
    }), w.dispose;
  }, [e, r]), ye(() => {
    if (!sa(r) || (a == null ? void 0 : a.status) !== "queued" && (a == null ? void 0 : a.status) !== "running") return;
    const w = la();
    let S = setTimeout(async function N() {
      await b(w), w.isActive() && (S = setTimeout(N, 2500));
    }, 2500);
    return () => {
      clearTimeout(S), w.dispose();
    };
  }, [a == null ? void 0 : a.id, a == null ? void 0 : a.status, r]), {
    analysisError: c,
    analysisRun: a,
    analysisStatus: l,
    importNativeSegments: f,
    nativeImportState: m,
    startFullAnalysis: y
  };
}
const Rn = Object.freeze([]);
function Bd(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Gd({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var Io, $o, Co, To, Ao;
  const [g, m] = L(null), [u, p] = L([]), f = fe(null), b = fe(null), y = fe([]), w = fe(null), [S, N] = L(() => ut({})), [q, O] = L(!1), [W, R] = L($s), [I, A] = L(0), [P, _] = L(null), [K, Y] = L(!1), [k, T] = L(""), [U, Z] = L(""), [ie, ue] = L(""), [ge, F] = L(1), [X, ce] = L(Ql), [ae, xe] = L(0), [Se, M] = L({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [V, H] = L(At), se = fe(At), [$, le] = L(!1), [G, v] = L(!1), [C, x] = L(!1), [h, D] = L(!1), ne = fe(!1), [re, Q] = L(null), [ke, J] = L(null), te = fe(null), [z, E] = L(!1), [oe, ve] = L(""), be = fe(null), he = fe(null), Ae = fe(!1), we = fe([]), pe = fe(!1), [Ne, $e] = L(Zl), [Ce, Ee] = L(null), [je, Ze] = L(!1), [Fe, Ie] = L(!1), [ze, _e] = L(!1), [We, Re] = L(!1), [Te, Ge] = L(!1), [lt, Xe] = L(""), {
    analysisError: Nt,
    analysisRun: ot,
    analysisStatus: Mt,
    importNativeSegments: Wt,
    nativeImportState: hr,
    startFullAnalysis: gn
  } = jd(
    e.video.id,
    o,
    l,
    ((Io = e.shotBoundaries) == null ? void 0 : Io.length) || 0,
    Mn(e.shotBoundaries || [])
  ), [Ft, Gn] = L(!1), [Vt, Jt] = L(null), [Yt, jt] = L(l), [vr, vt] = L(0), [It, Un] = L(!1), [pn, xt] = L(""), [xr, Qt] = L(null), fn = fe(null), Kn = fe(null), yn = fe(!1), [at, Et] = L([]), [bn, Bt] = L(!1), [zn, Sr] = L(null), Zt = Jl(), Xt = fe(null), _n = fe(null), en = fe(null), kr = fe(s), Hn = fe(null), hn = fe(null), Dt = fe(null), tn = fe(null), nn = fe(null), dt = fe(null), qn = fe(null), vn = fe(null), Wn = fe(null), xn = fe(null), Sn = fe(null), rn = fe(null), wr = fe(-1e12), Nr = fe(null), Ir = fe(!1), kn = fe(null), [mt, wn] = L({ scrollTop: 0, height: 512 });
  ye(() => {
    if (!Ft || It || !pn) return;
    const B = requestAnimationFrame(() => {
      var me;
      return (me = Kn.current) == null ? void 0 : me.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(B);
  }, [Ft, It, pn]), ye(() => {
    if (!yn.current || Ft || Yt) return;
    const B = requestAnimationFrame(() => {
      var me;
      (me = fn.current) == null || me.focus({ preventScroll: !0 }), yn.current = !1;
    });
    return () => cancelAnimationFrame(B);
  }, [Ft, Yt]);
  const Ke = e.video, Ve = e.segments || Rn, $r = Be(() => JSON.stringify({
    segments: Ve.map((B) => [
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
    performerSlots: (e.performerSlots || Rn).map((B) => [
      B.segmentId,
      B.slotDefinitionId,
      B.performerId,
      B.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [Ve, e.performerSlots, e.itemMetadata]);
  ye(() => {
    if (!l) {
      Jt(null), jt(!1);
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
        B && (Jt(Oe), xt(""));
      }).catch((Oe) => {
        B && (Jt(null), xt(Oe.message || "Unable to preview derived segments."));
      }).finally(() => {
        B && jt(!1);
      });
    }, 150);
    return () => {
      B = !1, clearTimeout(me);
    };
  }, [l, Ke.id, $r, vr, P]);
  const Cr = () => vt((B) => B + 1), gt = e.segmentGroups || Rn, pt = e.performerSlots || Rn, Vn = l && e.performerSlotsAvailable !== !1, Nn = Be(
    () => (e.performerCandidates || []).filter((B) => B.isVideoPerformer),
    [e.performerCandidates]
  ), In = e.shotBoundaries || Rn, Je = Be(
    () => Xa(pt),
    [pt]
  ), $n = Be(
    () => Ve.map((B) => {
      const me = Je.get(B.id) || [];
      return {
        ...B,
        slots: me,
        assignment: me.every((Oe) => Oe.performerId == null) ? tl(me, Nn) : null
      };
    }).filter((B) => B.slots.length > 0 && B.assignment != null),
    [Ve, Je, Nn]
  ), Tr = Number(($o = Ke.videoFile) == null ? void 0 : $o.frameRate) > 0 ? Number(Ke.videoFile.frameRate) : 30;
  function Jn() {
    x(!1), requestAnimationFrame(() => {
      var B;
      return (B = dt.current) == null ? void 0 : B.focus({ preventScroll: !0 });
    });
  }
  function Yn() {
    P == null && (rn.current = null, D(!1), T(""), requestAnimationFrame(() => {
      var B;
      return (B = dt.current) == null ? void 0 : B.focus({ preventScroll: !0 });
    }));
  }
  function Gt() {
    O(!1), requestAnimationFrame(() => {
      var B, me;
      (B = vn.current) != null && B.isConnected ? vn.current.focus({ preventScroll: !0 }) : (me = dt.current) == null || me.focus({ preventScroll: !0 });
    });
  }
  ye(() => {
    Sn.current === g ? (Sn.current = null, x(!0)) : x(!1);
  }, [g]), ye(() => {
    var me;
    if (!C) return;
    const B = (me = xn.current) == null ? void 0 : me.querySelector("input");
    B == null || B.focus({ preventScroll: !0 }), B == null || B.select();
  }, [C, g]), ye(() => {
    var Oe, He, ft;
    const B = _t(
      Or(
        e.segments,
        e.performerSlots || [],
        ut({}),
        l && W,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), me = ((Oe = e.segments.find((ln) => ln.id === s)) == null ? void 0 : Oe.id) ?? ((He = Ra(B)) == null ? void 0 : He.id) ?? null;
    m(me), p(me == null ? [] : [me]), b.current = me, y.current = [], Ee(yt(B, me)), N(ut({})), O(!1), rn.current = null, D(!1), F(1), T(""), H(At), se.current = At, le(!1), (ft = dt.current) == null || ft.focus({ preventScroll: !0 });
  }, [Ke.id, s]), ye(() => {
    const B = new AbortController();
    return ee(`/videos/${Ke.id}/incorrect-examples`, { signal: B.signal }).then(Et).catch((me) => {
      me.name !== "AbortError" && Et([]);
    }), () => B.abort();
  }, [Ke.id, d == null ? void 0 : d.effectiveMode]), ye(() => {
    const B = new AbortController();
    return ee(`/videos/${Ke.id}/history`, { signal: B.signal }).then((me) => {
      const Oe = me || At;
      se.current = Oe, H(Oe);
    }).catch((me) => {
      me.name !== "AbortError" && T(me.message || "Unable to load editor history.");
    }), () => B.abort();
  }, [Ke.id]), ye(() => {
    ed(X);
  }, [X.timelineRatio, X.markerRailOpen, X.detailWidth, X.markerRailWidth, X.swimlaneTitleWidth]), ye(() => {
    Xl(Ne);
  }, [Ne]), ye(() => {
    Cs(W);
  }, [W]), ye(() => {
    const B = hn.current;
    if (!a || !B || typeof ResizeObserver > "u") return;
    const me = () => {
      var ft;
      const He = Math.max(0, B.clientHeight - (((ft = Dt.current) == null ? void 0 : ft.offsetHeight) || 0));
      xe(He), ce((ln) => {
        const Ro = eo(ln.timelineRatio, He);
        return Ro === ln.timelineRatio ? ln : { ...ln, timelineRatio: Ro };
      });
    }, Oe = new ResizeObserver(me);
    return Oe.observe(B), Dt.current && Oe.observe(Dt.current), me(), () => Oe.disconnect();
  }, [a]), ye(() => {
    if (!Zt || typeof ResizeObserver > "u") return;
    const B = nn.current, me = tn.current;
    if (!B || !me) return;
    const Oe = () => M({
      workspace: B.clientWidth,
      focusRow: me.clientWidth,
      focusRowHeight: me.clientHeight
    }), He = new ResizeObserver(Oe);
    return He.observe(B), He.observe(me), Oe(), () => He.disconnect();
  }, [Zt, X.markerRailOpen]);
  const $t = Be(
    () => Xo(
      Or(
        Ve,
        pt,
        S,
        l && W,
        gt
      ),
      at,
      !0
    ),
    [
      Ve,
      pt,
      S,
      W,
      gt,
      l,
      at
    ]
  ), Qn = Object.fromEntries(nt.map((B) => [B, $t.filter((me) => me.reviewState === B).length])), Zn = Xo(
    Or(
      Ve,
      pt,
      { ...S, reviewStates: nt },
      l && W,
      gt
    ),
    at,
    !0
  ), Cn = Object.fromEntries(nt.map((B) => [B, Zn.filter((me) => me.reviewState === B).length])), Tn = [...new Set(Ve.map((B) => B.sourceKey).filter(Boolean))].sort((B, me) => ht(B).localeCompare(ht(me))), St = gs(
    S,
    l && W
  ), Ye = Be(
    () => _t($t, gt, pt),
    [$t, gt, pt]
  ), de = ys(
    Ye,
    g,
    s
  ), Ct = Is($t, u), Xn = !l && Ct.length > 0 && Ct.every((B) => B.nativeSegmentId != null), er = $t.map((B) => B.id), Ar = er.join("|");
  f.current = (de == null ? void 0 : de.id) ?? null;
  const Ut = Je.get(de == null ? void 0 : de.id) || [], on = ao(Ut), j = Be(
    () => Dl(Ye, u),
    [Ye, u]
  ), De = Be(() => io(Ye), [Ye]), Qe = Be(
    () => Ml(De, Ne),
    [De, Ne]
  ), et = Be(
    () => ei(
      Qe.rows,
      mt.scrollTop,
      mt.height
    ),
    [Qe, mt]
  ), kt = Be(
    () => Pl(Ye, Ne),
    [Ye, Ne]
  ), Tt = lr(kt, de == null ? void 0 : de.id, -1, !0) != null, Rr = lr(kt, de == null ? void 0 : de.id, 1, !0) != null, an = de ? yt(Ye, de.id) : null, Mr = gt.length > 0 ? De.map((B) => B.key) : [], ci = Mr.join("|"), tr = Math.max(
    0,
    Number((Co = Ke.videoFile) == null ? void 0 : Co.duration) || 0,
    ...Ve.map((B) => Number(B.endSec ?? B.startSec) || 0)
  ), co = Number((To = Ke.videoFile) == null ? void 0 : To.duration) > 0 ? Number(Ke.videoFile.duration) : null;
  V.actions;
  const ui = ja();
  ye(() => {
    const B = g === cr ? g : (de == null ? void 0 : de.id) ?? null;
    B !== g && m(B);
  }, [de, g]), ye(() => {
    p((B) => {
      const me = xs(
        B,
        er,
        (de == null ? void 0 : de.id) ?? null
      );
      return me.length === B.length && me.every((Oe, He) => Oe === B[He]) ? B : me;
    });
  }, [Ar, de == null ? void 0 : de.id]);
  const sn = (de == null ? void 0 : de.itemId) == null ? null : ((Ao = e.itemMetadata) == null ? void 0 : Ao[de.itemId]) || null, mi = {
    key: (de == null ? void 0 : de.itemId) != null ? `item:${de.itemId}` : (de == null ? void 0 : de.nativeSegmentId) != null ? `native:${de.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (sn == null ? void 0 : sn.provenance) || (de == null ? void 0 : de.fieldProvenance) || [] : []
  }, Er = (de == null ? void 0 : de.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (sn == null ? void 0 : sn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  ye(() => {
    Z(de == null ? "" : String(de.startSec)), ue((de == null ? void 0 : de.endSec) == null ? "" : String(de.endSec));
  }, [de == null ? void 0 : de.id, de == null ? void 0 : de.startSec, de == null ? void 0 : de.endSec]), ye(() => {
    an && $e((B) => ri(B, an));
  }, [Ke.id, s, an]), ye(() => {
    Ee((B) => Bl(Mr, B, an));
  }, [Ke.id, ci, an]), ye(() => {
    if (!X.markerRailOpen || (de == null ? void 0 : de.id) == null) return;
    const B = kn.current, me = Qe.rows.find((ft) => ft.kind === "segment" && ft.segment.id === de.id);
    if (!B || !me) return;
    const Oe = me.top + me.height;
    let He = B.scrollTop;
    me.top < B.scrollTop ? He = me.top : Oe > B.scrollTop + B.clientHeight && (He = Math.max(0, Oe - B.clientHeight)), He !== B.scrollTop && (B.scrollTop = He), wn({ scrollTop: He, height: B.clientHeight });
  }, [de == null ? void 0 : de.id, Qe, X.markerRailOpen]), ye(() => {
    const B = kn.current;
    if (!X.markerRailOpen || !B) return;
    const me = () => wn({
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
  const { revealSegmentGroupForSelection: uo, replaceSegmentSelection: gi, selectSegment: mo, selectSegmentCollection: pi, selectAllVideoSegments: fi } = Dd({
    allSwimlanes: Ye,
    editorRef: dt,
    performerSlots: pt,
    seekRef: Xt,
    segmentGroups: gt,
    segments: Ve,
    selectedSegmentId: g,
    selectedSegmentIds: u,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: y,
    setCollapsedSegmentGroups: $e,
    setEditorFilters: N,
    setHideDerivedSegments: R,
    setSaveMessage: T,
    setSelectedSegmentGroupKey: Ee,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: p
  }), { acceptHistory: Dr, recordHistoryAction: nr, mutateSegment: yi, completeReview: bi, createSegment: go, splitSegment: po, duplicateSegment: fo, saveTiming: hi, applyShortcutTiming: vi } = Vl({
    compatibilityMode: l,
    currentTime: I,
    detail: e,
    editorFilters: S,
    endInput: ie,
    hideDerivedSegments: W,
    historyRef: se,
    mediaDuration: co,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: wr,
    pendingDuplicateRef: Nr,
    pendingFirstSegmentStartSecRef: rn,
    pendingTagEditSegmentIdRef: Sn,
    replaceSegmentSelection: gi,
    savingSegmentId: P,
    segments: Ve,
    selectedSegment: de,
    selectedSegmentIdRef: f,
    selectedSegments: Ct,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: y,
    setEditorFilters: N,
    setFirstSegmentTagOpen: D,
    setHideDerivedSegments: R,
    setHistory: H,
    setHistoryOpen: le,
    setPublishApprovedError: ve,
    setSaveMessage: T,
    setSavingSegmentId: _,
    setSelectedSegmentGroupKey: Ee,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: p,
    startInput: U,
    timelineDuration: tr,
    video: Ke
  });
  function yo(B = null) {
    var He;
    if (!l || P != null || !Ve.some((ft) => !ft.published && ft.reviewState === "approved")) return;
    const me = ((He = dt.current) == null ? void 0 : He.ownerDocument) ?? document, Oe = me.activeElement === me.body ? null : me.activeElement;
    he.current = B != null && B.isConnected && B !== me.body ? B : Oe, ve(""), E(!0);
  }
  function bo() {
    P == null && (E(!1), ve(""), requestAnimationFrame(() => {
      Bd(
        he.current,
        dt.current
      ), he.current = null;
    }));
  }
  async function xi() {
    await bi() && bo();
  }
  const { closeMergeConfirmation: Si, mergeSelectedSwimlane: ho, saveSelectedReviewState: vo } = Od({
    acceptHistory: Dr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: w,
    historyRef: se,
    mergeSavingRef: ne,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    pendingReviewStateRef: we,
    recordHistoryAction: nr,
    revealSegmentGroupForSelection: uo,
    reviewSavingRef: Ae,
    savingSegmentId: P,
    selectedGroups: j,
    selectedSegment: de,
    selectedSegmentIdRef: f,
    selectedSegments: Ct,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: y,
    setMergeConfirmation: Q,
    setSaveMessage: T,
    setSavingSegmentId: _,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: p,
    video: Ke
  }), ki = (B) => {
    we.current = js(
      we.current,
      B
    );
  };
  ye(() => {
    if (P != null || Ae.current) return;
    let B = !1;
    for (; we.current.length > 0; ) {
      const me = we.current.shift(), Oe = Ls(me, Ve);
      if (!Oe) {
        B = !0;
        continue;
      }
      vo(
        Oe.requestedState,
        Oe.selectedSegments,
        Oe.selectedSegment
      );
      return;
    }
    B && T("The queued review could not find its segment after refreshing.");
  }, [P, Ve]);
  const { toggleIncorrectExample: wi, removeIncorrectExample: Ni, captureTrainingExport: Ii, deleteRejectedSegments: xo, autoAssignPerformers: $i, previewDerivedSegments: Ci, closeMaterializeDialog: Ti, materializeDerivedSegments: Ai, saveTag: Ri, moveToBin: Mi, emptyRecyclingBin: Ei } = Pd({
    acceptHistory: Dr,
    allSwimlanes: Ye,
    autoAssignCandidates: $n,
    autoAssigning: Te,
    binEmptyingRef: pe,
    canMoveSelectionToBin: Xn,
    closeTagEditing: Jn,
    compatibilityMode: l,
    detail: e,
    editorRef: dt,
    exportingExamples: bn,
    incorrectExamples: at,
    lineage: Er,
    materializeButtonRef: fn,
    materializePreview: Vt,
    materializeRestoreFocusRef: yn,
    materializing: It,
    mutateSegment: yi,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: nr,
    refreshMaterializationPreview: Cr,
    removingExampleId: zn,
    revealSegmentGroupForSelection: uo,
    savingSegmentId: P,
    segments: Ve,
    selectedSegment: de,
    selectedSegmentIdRef: f,
    selectedSegments: Ct,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: y,
    setAutoAssignError: Xe,
    setAutoAssignOpen: Re,
    setAutoAssigning: Ge,
    setExportingExamples: Bt,
    setIncorrectExamples: Et,
    setMaterializeError: xt,
    setMaterializeLoading: jt,
    setMaterializeOpen: Gn,
    setMaterializePreview: Jt,
    setMaterializing: Un,
    setRemovingExampleId: Sr,
    setRejectedDeletionPreview: J,
    setSaveMessage: T,
    setSavingSegmentId: _,
    setSelectedSegmentGroupKey: Ee,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: p,
    video: Ke
  }), { restoreHistoryTarget: Di, updateTimelineRatio: So, handleSeparatorPointerDown: Oi, handleSeparatorPointerMove: Pi, handleSeparatorKeyDown: Li, panelWidthMaximum: ko, panelSeparatorProps: Fi, toggleSegmentRail: ji, toggleSegmentGroup: wo, mutateShotBoundary: Bi } = Ld({
    acceptHistory: Dr,
    compatibilityMode: l,
    currentTime: I,
    detail: e,
    editorLayout: X,
    focusRowRef: tn,
    history: V,
    historyRef: se,
    historySaving: G,
    horizontalLayoutSize: Se,
    mediaStackHeight: ae,
    mediaStackRef: hn,
    commonActionsRef: Dt,
    onDetailChange: t,
    onReload: o,
    railToggleRef: qn,
    recordHistoryAction: nr,
    savingSegmentId: P,
    savingShot: K,
    savingShotRef: Ir,
    setCollapsedSegmentGroups: $e,
    setEditorLayout: ce,
    setHistorySaving: v,
    setIncorrectExamples: Et,
    setSaveMessage: T,
    setSavingSegmentId: _,
    setSavingShot: Y,
    shotBoundaries: In,
    timelineDuration: tr,
    video: Ke,
    workspaceRef: nn
  }), { executeShortcutById: No } = Fd({
    allSwimlanes: Ye,
    applyShortcutTiming: vi,
    centerTimelineRef: Hn,
    compatibilityMode: l,
    createSegment: go,
    currentTime: I,
    deleteRejectedSegments: xo,
    duplicateSegment: fo,
    editorLayout: X,
    editorRef: dt,
    emptyRecyclingBin: Ei,
    lineage: Er,
    mediaDuration: co,
    mergeSelectedSwimlane: ho,
    moveToBin: Mi,
    mutateShotBoundary: Bi,
    openPublishApprovedDialog: yo,
    playbackControlsRef: _n,
    playbackShortcutConfig: ui,
    saveSelectedReviewState: vo,
    seekRef: Xt,
    segmentGroupKeys: Mr,
    selectSegment: mo,
    selectedSegment: de,
    selectedSegmentGroupForSegment: an,
    selectedSegmentGroupKey: Ce,
    selectedSegments: Ct,
    setCollapsedSegmentGroups: $e,
    setIncorrectExamplesOpen: _e,
    setQuickSearchOpen: Ie,
    setSaveMessage: T,
    setSelectedSegmentGroupKey: Ee,
    setTagEditing: x,
    setTimelineZoom: F,
    shotBoundaries: In,
    slotButtonRef: Wn,
    splitSegment: po,
    swimlanes: kt,
    timelineDuration: tr,
    toggleIncorrectExample: wi,
    toggleSegmentGroup: wo,
    updateTimelineRatio: So,
    videoFrameRate: Tr,
    visibleSegments: $t
  });
  en.current = No;
  const Gi = Be(() => jn.map((B) => ({
    id: B.id,
    enabled: un(B, l),
    surface: "local",
    action: (me) => {
      var Oe;
      return (Oe = en.current) == null ? void 0 : Oe.call(en, B.id, me);
    }
  })), [l]);
  ha(Qr, Gi);
  const Ui = Xr(ae), Ki = zt(X.markerRailWidth, ko("markerRailWidth")), zi = zt(X.detailWidth, ko("detailWidth"));
  return n(Ed, {
    activeFilterCount: St,
    allSwimlanes: Ye,
    analysisError: Nt,
    analysisRun: ot,
    analysisStatus: Mt,
    approvalFacetCounts: Cn,
    autoAssignCandidates: $n,
    autoAssignError: lt,
    autoAssignOpen: We,
    autoAssignPerformers: $i,
    autoAssigning: Te,
    canMoveSelectionToBin: Xn,
    captureTrainingExport: Ii,
    cancelQueuedReviewsForSegments: ki,
    removeIncorrectExample: Ni,
    rejectedDeletionPreview: ke,
    centerTimelineRef: Hn,
    closeEditorFilters: Gt,
    closeFirstSegmentTagDialog: Yn,
    closeMaterializeDialog: Ti,
    closeMergeConfirmation: Si,
    closePublishApprovedDialog: bo,
    closeTagEditing: Jn,
    collapsedSegmentGroups: Ne,
    commonActionsRef: Dt,
    compatibilityMode: l,
    configuringTag: xr,
    createSegment: go,
    currentTime: I,
    deleteRejectedSegments: xo,
    detail: e,
    detailPanelRef: w,
    detailWidth: zi,
    duplicateSegment: fo,
    editorFilters: S,
    editorLayout: X,
    editorRef: dt,
    exportingExamples: bn,
    filtersButtonRef: vn,
    filtersOpen: q,
    firstSegmentTagOpen: h,
    focusRowRef: tn,
    handleSeparatorKeyDown: Li,
    handleSeparatorPointerDown: Oi,
    handleSeparatorPointerMove: Pi,
    hideDerivedSegments: W,
    history: V,
    historyOpen: $,
    historySaving: G,
    hasNextUnreviewed: Rr,
    hasPreviousUnreviewed: Tt,
    horizontalLayoutSize: Se,
    importNativeSegments: Wt,
    incorrectExamples: at,
    incorrectExamplesOpen: ze,
    removingExampleId: zn,
    lineage: Er,
    markerRailWidth: Ki,
    materializeButtonRef: fn,
    materializeCancelButtonRef: Kn,
    materializeDerivedSegments: Ai,
    materializeError: pn,
    materializeLoading: Yt,
    materializeOpen: Ft,
    materializePreview: Vt,
    materializing: It,
    mediaStackRef: hn,
    mergeCancelButtonRef: te,
    mergeConfirmation: re,
    mergeSavingRef: ne,
    mergeSelectedSwimlane: ho,
    nativeImportState: hr,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: yo,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: Fi,
    pendingInitialSeekRef: kr,
    performerSlots: pt,
    performerSlotsAvailable: Vn,
    playbackControlsRef: _n,
    previewDerivedSegments: Ci,
    provenance: mi,
    provenanceSources: Tn,
    publishApprovedCancelButtonRef: be,
    publishApprovedDrafts: xi,
    publishApprovedError: oe,
    publishApprovedOpen: z,
    quickSearchOpen: Fe,
    railScrollRef: kn,
    railToggleRef: qn,
    recordHistoryAction: nr,
    restoreHistoryTarget: Di,
    runEditorAction: No,
    saveMessage: k,
    setSaveMessage: T,
    saveTag: Ri,
    saveTiming: hi,
    savingSegmentId: P,
    setSavingSegmentId: _,
    seekRef: Xt,
    segmentGroups: gt,
    segmentRailLayout: Qe,
    segments: Ve,
    selectAllVideoSegments: fi,
    selectSegment: mo,
    selectSegmentCollection: pi,
    selectedGroups: j,
    selectedPerformerSlots: Ut,
    selectedSegment: de,
    selectedSegmentGroupKey: Ce,
    selectedSegmentIds: u,
    selectedSegments: Ct,
    selectedSlotStatus: on,
    setAutoAssignError: Xe,
    setAutoAssignOpen: Re,
    setConfiguringTag: Qt,
    setCurrentTime: A,
    setEditorFilters: N,
    setEditorLayout: ce,
    setFiltersOpen: O,
    setHideDerivedSegments: R,
    setHistoryOpen: le,
    setIncorrectExamplesOpen: _e,
    setQuickSearchOpen: Ie,
    setRejectedDeletionPreview: J,
    setRailViewport: wn,
    setSelectedSegmentGroupKey: Ee,
    setSelectedSegmentId: m,
    setShortcutsOpen: Ze,
    setTimelineZoom: F,
    shotBoundaries: In,
    shortcutsOpen: je,
    slotButtonRef: Wn,
    splitLayout: a,
    splitSegment: po,
    startFullAnalysis: gn,
    tagEditing: C,
    tagSearchRef: xn,
    timelineDuration: tr,
    timelineRatioBounds: Ui,
    timelineZoom: ge,
    toggleSegmentGroup: wo,
    toggleSegmentRail: ji,
    updateTimelineRatio: So,
    video: Ke,
    videoPerformers: Nn,
    visibleCounts: Qn,
    visibleSegmentRailRows: et,
    visibleSegments: $t,
    wideLayout: Zt,
    workspaceRef: nn
  });
}
const Ud = /* @__PURE__ */ new Set(["queued", "running"]);
async function da(e, t, r = 4) {
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
function ca(e, t) {
  return { videoId: e, error: (t == null ? void 0 : t.message) || String(t || "Unable to start Full Scan.") };
}
function Kd() {
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
async function zd(e, t, r, o) {
  const i = [...new Set(e.map(Number).filter((p) => Number.isInteger(p) && p > 0))], a = [...new Set(t)].filter((p) => ["aiTagging", "omnishotcut"].includes(p));
  if (i.length === 0 || a.length === 0)
    return { queuedIds: [], failed: [], cancelled: !1 };
  const s = a.includes("omnishotcut"), l = await da(i, async (p) => {
    try {
      const [f, b] = await Promise.all([
        r(`/videos/${p}/analysis-runs`),
        s ? r(`/videos/${p}/editor`) : null
      ]);
      if ((f || []).some((w) => Ud.has(w == null ? void 0 : w.status)))
        throw new Error("A Full Scan is already queued or running.");
      const y = (b == null ? void 0 : b.shotBoundaries) || [];
      return { videoId: p, shotBoundaries: y };
    } catch (f) {
      return ca(p, f);
    }
  }), d = l.filter((p) => !p.error), c = l.filter((p) => p.error), g = d.filter((p) => p.shotBoundaries.length > 0), m = g.reduce((p, f) => p + f.shotBoundaries.length, 0);
  if (m > 0 && !o(
    `Replace ${m} existing shot ${m === 1 ? "boundary" : "boundaries"} across ${g.length} selected ${g.length === 1 ? "video" : "videos"} when these scans succeed? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
  )) return { queuedIds: [], failed: c, cancelled: !0 };
  const u = await da(d, async ({ videoId: p, shotBoundaries: f }) => {
    const b = s && f.length > 0;
    try {
      return await r(`/videos/${p}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: a,
          replaceShotBoundaries: b,
          expectedShotBoundaryFingerprint: b ? Mn(f) : null
        })
      }), { videoId: p };
    } catch (y) {
      return ca(p, y);
    }
  });
  return {
    queuedIds: u.filter((p) => !p.error).map((p) => p.videoId),
    failed: [...c, ...u.filter((p) => p.error)],
    cancelled: !1
  };
}
function _d(e = [], t = []) {
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
function Hd(e = [], t = "", r = "all") {
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
function qd(e = [], t = []) {
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
    const S = a.get(w);
    S.rules.push(f), S.edgeCount += Number(f.edgeCount) || 0;
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
      const R = b.shift();
      y.push(R);
      for (const I of d.get(R) || [])
        c.has(I) || (c.add(I), b.push(I));
    }
    const w = new Set(y), S = y.map((R) => o.get(R)), N = l.filter((R) => w.has(R.sourceTagId) && w.has(R.derivedTagId)), q = N.flatMap((R) => R.rules), O = S.filter((R) => R.outgoingRuleCount === 0).sort((R, I) => tt(R.name, I.name)), W = O.length > 0 ? O : [...S].sort((R, I) => tt(R.name, I.name));
    g.push({
      id: [...y].sort((R, I) => R - I).join(":"),
      label: W.length > 1 ? `${W[0].name} + ${W.length - 1}` : ((p = W[0]) == null ? void 0 : p.name) || "Derivation component",
      nodes: S,
      connections: N,
      rules: q,
      segmentGroupKeys: [...new Set(S.map((R) => R.segmentGroupKey))],
      materializedEdgeCount: q.reduce(
        (R, I) => R + (Number(I.edgeCount) || 0),
        0
      )
    });
  }
  g.sort((f, b) => b.rules.length - f.rules.length || tt(f.label, b.label));
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
  const u = [...m.values()].sort((f, b) => f.sortOrder - b.sortOrder || tt(f.name, b.name)).map((f) => ({
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
function Wd(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const g = new Map(e.nodes.map((A) => [A.tagId, /* @__PURE__ */ new Set()])), m = new Map(e.nodes.map((A) => [A.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((A) => {
    var P, _;
    (P = g.get(A.sourceTagId)) == null || P.add(A.derivedTagId), (_ = m.get(A.derivedTagId)) == null || _.add(A.sourceTagId);
  });
  const u = new Map(e.nodes.map((A) => {
    var P;
    return [
      A.tagId,
      ((P = m.get(A.tagId)) == null ? void 0 : P.size) || 0
    ];
  })), p = new Map(e.nodes.map((A) => [A.tagId, 0])), f = e.nodes.filter((A) => u.get(A.tagId) === 0).sort((A, P) => tt(A.name, P.name)).map((A) => A.tagId), b = /* @__PURE__ */ new Set();
  for (; f.length > 0; ) {
    const A = f.shift();
    if (!b.has(A)) {
      b.add(A);
      for (const P of g.get(A) || [])
        p.set(P, Math.max(p.get(P) || 0, (p.get(A) || 0) + 1)), u.set(P, u.get(P) - 1), u.get(P) === 0 && f.push(P);
    }
  }
  b.size !== e.nodes.length && e.nodes.filter((A) => !b.has(A.tagId)).sort((A, P) => tt(A.name, P.name)).forEach((A) => p.set(A.tagId, 0));
  const y = Math.max(0, ...p.values()), w = Math.max(
    t,
    240 + y * 296
  ), S = /* @__PURE__ */ new Map();
  e.nodes.forEach((A) => {
    S.has(A.segmentGroupKey) || S.set(A.segmentGroupKey, {
      key: A.segmentGroupKey,
      id: A.segmentGroupId,
      name: A.segmentGroupName,
      sortOrder: A.segmentGroupSortOrder,
      nodes: []
    }), S.get(A.segmentGroupKey).nodes.push(A);
  });
  const N = [...S.values()].sort((A, P) => A.sortOrder - P.sortOrder || tt(A.name, P.name));
  let q = 28;
  const O = [], W = N.map((A) => {
    const P = /* @__PURE__ */ new Map();
    A.nodes.forEach((T) => {
      const U = p.get(T.tagId) || 0;
      P.has(U) || P.set(U, []), P.get(U).push(T);
    });
    for (const T of P.values())
      T.sort((U, Z) => U.segmentGroupTagSortOrder - Z.segmentGroupTagSortOrder || tt(U.name, Z.name));
    const _ = Math.max(1, ...[...P.values()].map((T) => T.length)), K = _ * 58 + (_ - 1) * 18, Y = 70 + K, k = {
      ...A,
      x: 12,
      y: q,
      width: w - 24,
      height: Y
    };
    for (const [T, U] of P.entries()) {
      const Z = U.length * 58 + Math.max(0, U.length - 1) * 18, ie = (K - Z) / 2;
      U.forEach((ue, ge) => O.push({
        ...ue,
        rank: T,
        x: 28 + T * 296,
        y: q + 34 + 18 + ie + ge * 76,
        width: 184,
        height: 58
      }));
    }
    return q += Y + 16, k;
  }), R = new Map(O.map((A) => [A.tagId, A])), I = e.connections.map((A) => {
    const P = R.get(A.sourceTagId), _ = R.get(A.derivedTagId), K = P.x + P.width, Y = P.y + P.height / 2, k = _.x, T = _.y + _.height / 2, U = Math.max(48, (k - K) * 0.48);
    return {
      ...A,
      path: `M ${K} ${Y} C ${K + U} ${Y}, ${k - U} ${T}, ${k} ${T}`
    };
  });
  return {
    width: w,
    height: Math.max(r, q - 16 + 28),
    nodes: O,
    connections: I,
    groups: W
  };
}
function Vd(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Wd(d, {
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
      const b = p.get(f.sourceTagId), y = p.get(f.derivedTagId), w = b.x + b.width, S = b.y + b.height / 2, N = y.x, q = y.y + y.height / 2, O = Math.max(48, (N - w) * 0.48);
      return {
        ...f,
        componentId: d.id,
        path: `M ${w} ${S} C ${w + O} ${S}, ${N - O} ${q}, ${N} ${q}`
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
function ua(e, t = []) {
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
function Jd(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function Yd(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: m, emptyDraft: u, graph: p, layout: f, listSort: b, materializationOffer: y, materializeOutgoingRules: w, materializeRule: S, message: N, normalizedQuery: q, query: O, refreshConfiguredTag: W, revealEditor: R, rules: I, save: A, segmentGroupKey: P, selectedNode: _, selectedRule: K, selection: Y, setConfiguringTag: k, setDraft: T, setListSort: U, setMaterializationOffer: Z, setQuery: ie, setSegmentGroupKey: ue, setSelection: ge, setView: F, sortedVisibleRules: X, sourceSlots: ce, sourceSlotsLoading: ae, updateMapping: xe, updateTag: Se, view: M, visibleComponents: V, visibleRules: H } = e;
  function se(C) {
    const x = p.nodes.find((D) => D.tagId === Number(C.sourceTagId)), h = p.nodes.find((D) => D.tagId === Number(C.derivedTagId));
    return (x == null ? void 0 : x.segmentGroupKey) === (h == null ? void 0 : h.segmentGroupKey) ? x.segmentGroupKey : "cross-group";
  }
  function $() {
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
          onClick: () => T(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      n("div", { key: "tags", className: "space-y-3" }, [
        n("div", { key: "source", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Source tag (specific)"),
            n(Dn, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (C, x) => Se("source", C, x == null ? void 0 : x.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !ae && ce.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (C) => k({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: C.currentTarget
              }),
              className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
            }, "Configure source tag")
          ]) : null
        ]),
        n("div", { key: "derived", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Derived tag (general)"),
            n(Dn, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (C, x) => Se("derived", C, x == null ? void 0 : x.label),
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
              onClick: (C) => k({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: C.currentTarget
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
            onClick: () => T((C) => ({
              ...C,
              slotMappings: [...C.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
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
          ...d.slotMappings.map((C, x) => n("div", { key: x, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: C.sourceSlotDefinitionId,
              disabled: r,
              onChange: (h) => xe(x, "sourceSlotDefinitionId", h.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${x + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...ce.map((h) => n("option", { key: h.id, value: h.id }, rt(h)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: C.derivedSlotDefinitionId,
              disabled: r,
              onChange: (h) => xe(x, "derivedSlotDefinitionId", h.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${x + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((h) => n("option", { key: h.id, value: h.id }, rt(h)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => T((h) => ({
                ...h,
                slotMappings: h.slotMappings.filter((D, ne) => ne !== x)
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
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((C) => !C.sourceSlotDefinitionId || !C.derivedSlotDefinitionId),
          onClick: A,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => T(null), className: o }, "Cancel")
      ])
    ]);
  }
  function le() {
    if (_) {
      const h = H.filter((re) => Number(re.derivedTagId) === _.tagId), D = H.filter((re) => Number(re.sourceTagId) === _.tagId), ne = (re, Q, ke) => n("div", {
        key: re.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, Q),
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
          onClick: (re) => k({
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
          onClick: () => w(_, D),
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
    if (!K)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const C = p.nodes.find((h) => h.tagId === Number(K.sourceTagId)), x = p.nodes.find((h) => h.tagId === Number(K.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (C == null ? void 0 : C.segmentGroupName) || "Ungrouped"),
          (C == null ? void 0 : C.segmentGroupKey) !== (x == null ? void 0 : x.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(x == null ? void 0 : x.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${K.sourceTagName} → ${K.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${K.edgeCount} materialized lineage edge${K.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (y == null ? void 0 : y.ruleId) === K.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => S(K, y),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => Z(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        K.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : K.slotMappings.map((h, D) => n("div", {
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
          K.createdAt ? new Date(K.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          K.updatedAt ? new Date(K.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => S(K),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(K),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(K),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function G() {
    if (V.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, q ? "No derivation relationships match your search." : "No derivation rules.");
    const C = _ == null ? void 0 : _.tagId, x = /* @__PURE__ */ new Set();
    return _ && (x.add(_.tagId), f.connections.forEach((h) => {
      (h.sourceTagId === _.tagId || h.derivedTagId === _.tagId) && (x.add(h.sourceTagId), x.add(h.derivedTagId));
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
        ...f.groups.map((h) => n("div", {
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
          ...f.connections.map((h) => {
            const D = C === h.sourceTagId || C === h.derivedTagId, ne = _ != null, re = D ? "var(--color-accent)" : "var(--color-secondary)";
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
        ...f.nodes.map((h) => {
          const D = !q || h.name.toLocaleLowerCase().includes(q), ne = _ != null, re = x.has(h.tagId), Q = (_ == null ? void 0 : _.tagId) === h.tagId;
          return n("button", {
            key: `node:${h.tagId}`,
            type: "button",
            onClick: () => ge({ type: "node", id: h.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${Q ? "border-accent bg-accent/15 ring-2 ring-accent/25" : re ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
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
        ...f.connections.filter((h) => h.rules.length > 1).map((h) => {
          const D = f.nodes.find((re) => re.tagId === h.sourceTagId), ne = f.nodes.find((re) => re.tagId === h.derivedTagId);
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
  function v() {
    if (V.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        q ? "No derivation relationships match your search." : "No derivation rules."
      );
    const C = /* @__PURE__ */ new Map();
    X.forEach((h) => {
      const D = se(h);
      C.has(D) || C.set(D, []), C.get(D).push(h);
    });
    const x = [
      ...p.segmentGroups.map((h) => h.key),
      "cross-group"
    ].filter((h) => C.has(h));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, x.map((h) => {
      const D = p.segmentGroups.find((Q) => Q.key === h), ne = h === "cross-group" ? "Cross-group relationships" : (D == null ? void 0 : D.name) || "Ungrouped", re = C.get(h);
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
          ...re.map((Q) => n("button", {
            key: Q.id,
            type: "button",
            role: "row",
            onClick: () => ge({ type: "rule", id: Q.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(K == null ? void 0 : K.id) === Q.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${Q.sourceTagName} → ${Q.derivedTagName}` },
              `${Q.sourceTagName} → ${Q.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(Q.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(Q.edgeCount))
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
          `${I.length} rules · ${p.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          T(u()), ge(null), R();
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
          onChange: (C) => {
            ie(C.target.value), ge(null);
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
          onChange: (C) => {
            ue(C.target.value), ge(null), T(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...p.segmentGroups.map((C) => n("option", { key: C.key, value: C.key }, C.name))
        ])
      ]),
      M === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: b,
          onChange: (C) => U(C.target.value),
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
        ].map(([C, x]) => n("button", {
          key: C,
          type: "button",
          onClick: () => {
            F(C), C === "graph" && (Y == null ? void 0 : Y.type) === "rule" && ge(null);
          },
          "aria-pressed": M === C,
          className: `rounded px-3 py-1.5 text-sm font-medium ${M === C ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
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
        M === "graph" ? G() : v()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? $() : le()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      N ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, N) : null
    ]),
    i ? n(lo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => W(i),
      onClose: () => {
        const C = i.trigger;
        k(null), requestAnimationFrame(() => {
          C != null && C.isConnected && C.focus();
        });
      }
    }) : null
  ]);
}
function Qd({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = L([]), [a, s] = L(null), [l, d] = L([]), [c, g] = L([]), [m, u] = L(!1), [p, f] = L(!1), [b, y] = L(!1), [w, S] = L(""), [N, q] = L(""), [O, W] = L("graph"), [R, I] = L("all"), [A, P] = L(null), [_, K] = L("relationship"), [Y, k] = L(null), [T, U] = L(null), Z = fe(null), ie = fe(null), ue = _a().replace(/:/g, "");
  function ge() {
    requestAnimationFrame(() => {
      var J;
      return (J = Z.current) == null ? void 0 : J.scrollIntoView({ block: "nearest" });
    });
  }
  async function F(J) {
    const te = await ee("/derivation-rules", J ? { signal: J } : void 0);
    i(te || []);
  }
  ye(() => {
    const J = new AbortController();
    return F(J.signal).catch((te) => {
      te.name !== "AbortError" && S(te.message || "Unable to load derived segment rules.");
    }), () => J.abort();
  }, []), ye(() => {
    const J = new AbortController();
    return a != null && a.sourceTagId ? (u(!0), ee(`/slot-definitions/${a.sourceTagId}`, { signal: J.signal }).then((te) => d(te.definitions || [])).catch((te) => {
      te.name !== "AbortError" && d([]);
    }).finally(() => {
      J.signal.aborted || u(!1);
    })) : (d([]), u(!1)), a != null && a.derivedTagId ? (f(!0), ee(`/slot-definitions/${a.derivedTagId}`, { signal: J.signal }).then((te) => g(te.definitions || [])).catch((te) => {
      te.name !== "AbortError" && g([]);
    }).finally(() => {
      J.signal.aborted || f(!1);
    })) : (g([]), f(!1)), () => J.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), ye(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || m || p)
      return;
    const J = `${a.sourceTagId}:${a.derivedTagId}`;
    ie.current !== J && (ie.current = J, s((te) => !te || Number(te.sourceTagId) !== Number(a.sourceTagId) || Number(te.derivedTagId) !== Number(a.derivedTagId) ? te : $l(te, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    m,
    p
  ]);
  function X(J, te = !1) {
    te || P({ type: "rule", id: J.id }), ie.current = null, s({
      ruleId: J.id,
      sourceTagId: J.sourceTagId,
      sourceTagName: J.sourceTagName,
      derivedTagId: J.derivedTagId,
      derivedTagName: J.derivedTagName,
      slotMappings: J.slotMappings.map((z) => ({
        sourceSlotDefinitionId: z.sourceSlotDefinitionId,
        derivedSlotDefinitionId: z.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), S(""), ge();
  }
  function ce(J, te, z = "") {
    ie.current = null, J === "source" ? (d([]), u(te != null)) : (g([]), f(te != null)), s((E) => ({
      ...E,
      [`${J}TagId`]: te == null ? null : Number(te),
      [`${J}TagName`]: z || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function ae(J) {
    (a == null ? void 0 : a.ruleId) == null && (ie.current = null);
    const te = [F(), t == null ? void 0 : t()];
    return J.draftKind === "source" ? (u(!0), te.push(ee(`/slot-definitions/${J.tagId}`).then((z) => d(z.definitions || [])).finally(() => u(!1)))) : J.draftKind === "derived" && (f(!0), te.push(ee(`/slot-definitions/${J.tagId}`).then((z) => g(z.definitions || [])).finally(() => f(!1)))), Promise.all(te);
  }
  function xe(J, te, z) {
    s((E) => ({
      ...E,
      slotMappings: E.slotMappings.map((oe, ve) => ve === J ? { ...oe, [te]: z } : oe)
    }));
  }
  async function Se() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const J = ua(a, o);
    if (J) {
      S(J.message);
      return;
    }
    if (a.slotMappings.some((te) => !te.sourceSlotDefinitionId || !te.derivedSlotDefinitionId)) {
      S("Complete or remove every performer slot mapping before saving.");
      return;
    }
    y(!0), S(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
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
      if (await F(), P(O === "graph" ? { type: "node", id: Number(z.sourceTagId) } : { type: "rule", id: z.id }), s(null), a.ruleId == null)
        try {
          const E = await ee(
            `/derivation-rules/${z.id}/materialization/preview`,
            { method: "POST" }
          );
          k(
            E.createCount + E.linkCount > 0 ? E : null
          ), S(E.createCount + E.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          k(null), S("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        k(null), S("Derived segment rule saved. Previous materializations were removed.");
    } catch (te) {
      S(te.message || "Unable to save derived segment rule.");
    } finally {
      y(!1);
    }
  }
  async function M(J) {
    y(!0), S("Previewing rule deletion…");
    try {
      const te = await ee(
        `/derivation-rules/${J.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${J.sourceTagName} → ${J.derivedTagName}?

Deleted segments: ${te.deletedSegmentCount}
Removed lineage edges: ${te.removedEdgeCount}
Shared derived segments retained: ${te.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const z = `derivation-rule-delete:${J.id}:${te.fingerprint}`;
      await ee(`/derivation-rules/${J.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe(z),
          fingerprint: te.fingerprint
        })
      }), Le(z), await F(), (a == null ? void 0 : a.ruleId) === J.id && s(null), (A == null ? void 0 : A.type) === "rule" && A.id === J.id && P(null), (Y == null ? void 0 : Y.ruleId) === J.id && k(null), S(`Rule deleted with ${te.deletedSegmentCount} exclusively derived segment${te.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (te) {
      S(te.message || "Unable to delete derived segment rule.");
    } finally {
      y(!1);
    }
  }
  async function V(J, te = null) {
    const z = te || await ee(
      `/derivation-rules/${J.id}/materialization/preview`,
      { method: "POST" }
    );
    if (z.createCount + z.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const E = `derivation-rule-materialize:${J.id}:${z.fingerprint}`, oe = await ee(`/derivation-rules/${J.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Pe(E),
        fingerprint: z.fingerprint
      })
    });
    return Le(E), oe;
  }
  async function H(J, te = null) {
    y(!0), S("Finding pending derivations…");
    try {
      const z = await V(J, te);
      if (k(null), await F(), z.createdCount + z.linkedCount === 0) {
        S("Every applicable derivation is already materialized.");
        return;
      }
      S(
        `${z.createdCount} derived segment${z.createdCount === 1 ? "" : "s"} created and ${z.linkedCount} existing segment${z.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (z) {
      S(z.message || "Unable to materialize pending derivations.");
    } finally {
      y(!1);
    }
  }
  async function se(J, te) {
    if (te.length === 0) return;
    y(!0), S(`Finding pending derivations from ${J.name}…`);
    let z = 0, E = 0;
    try {
      for (const oe of te) {
        const ve = await V(oe);
        z += ve.createdCount, E += ve.linkedCount;
      }
      k(null), await F(), S(z + E === 0 ? `Every outgoing derivation from ${J.name} is already materialized.` : `${z} derived segment${z === 1 ? "" : "s"} created and ${E} existing segment${E === 1 ? "" : "s"} linked from ${J.name}.`);
    } catch (oe) {
      await F().catch(() => {
      }), S(oe.message || `Unable to materialize derivations from ${J.name}.`);
    } finally {
      y(!1);
    }
  }
  const $ = ua(a, o), le = Be(
    () => qd(o, e),
    [o, e]
  ), G = N.trim().toLocaleLowerCase(), C = le.components.filter((J) => R === "all" || J.segmentGroupKeys.includes(R)).filter((J) => !G || J.nodes.some((te) => te.name.toLocaleLowerCase().includes(G))), x = C.flatMap((J) => J.rules), h = new Set(
    C.flatMap((J) => J.nodes.map((te) => te.tagId))
  ), D = Be(
    () => Vd(C),
    [C]
  ), ne = O === "list" ? Jd(
    A,
    x,
    G.length > 0
  ) : null, re = (A == null ? void 0 : A.type) === "node" && le.nodes.find((J) => J.tagId === A.id && h.has(J.tagId)) || null, Q = [...x].sort((J, te) => _ === "source" ? tt(J.sourceTagName, te.sourceTagName) || tt(J.derivedTagName, te.derivedTagName) : _ === "target" ? tt(J.derivedTagName, te.derivedTagName) || tt(J.sourceTagName, te.sourceTagName) : _ === "materialized" ? (Number(te.edgeCount) || 0) - (Number(J.edgeCount) || 0) || tt(J.sourceTagName, te.sourceTagName) : tt(
    `${J.sourceTagName} ${J.derivedTagName}`,
    `${te.sourceTagName} ${te.derivedTagName}`
  ));
  return n(Yd, {
    arrowMarkerId: ue,
    busy: b,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: T,
    deleteRule: M,
    derivedSlots: c,
    derivedSlotsLoading: p,
    draft: a,
    draftIssue: $,
    editRule: X,
    editorRef: Z,
    emptyDraft: r,
    graph: le,
    layout: D,
    listSort: _,
    materializationOffer: Y,
    materializeOutgoingRules: se,
    materializeRule: H,
    message: w,
    normalizedQuery: G,
    query: N,
    refreshConfiguredTag: ae,
    revealEditor: ge,
    rules: o,
    save: Se,
    segmentGroupKey: R,
    selectedNode: re,
    selectedRule: ne,
    selection: A,
    setConfiguringTag: U,
    setDraft: s,
    setListSort: K,
    setMaterializationOffer: k,
    setQuery: q,
    setSegmentGroupKey: I,
    setSelection: P,
    setView: W,
    sortedVisibleRules: Q,
    sourceSlots: l,
    sourceSlotsLoading: m,
    updateMapping: xe,
    updateTag: ce,
    view: O,
    visibleComponents: C,
    visibleRules: x
  });
}
function Zd() {
  const [e, t] = L(ja), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => Ko({ ...l, [a]: s }));
  }
  function i() {
    t(Ko(Zr));
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
function Xd({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = L([]), [a, s] = L(!1), [l, d] = L(!1), [c, g] = L(""), [m, u] = L(""), [p, f] = L("all"), [b, y] = L(() => /* @__PURE__ */ new Set()), [w, S] = L(null);
  ye(() => {
    if (!e || a) return;
    const k = new AbortController();
    return d(!0), g(""), ee("/slot-definitions", { signal: k.signal }).then((T) => {
      i(T || []), s(!0);
    }).catch((T) => {
      T.name !== "AbortError" && g(T.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      k.signal.aborted || d(!1);
    }), () => k.abort();
  }, [e, a]);
  async function N() {
    d(!0), g("");
    try {
      const k = await ee("/slot-definitions");
      i(k || []), s(!0);
    } catch (k) {
      g(k.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function q() {
    const [k] = await Promise.all([
      ee("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(k || []), s(!0), g("");
  }
  function O() {
    const k = w == null ? void 0 : w.trigger;
    S(null), requestAnimationFrame(() => {
      k != null && k.isConnected && k.focus({ preventScroll: !0 });
    });
  }
  function W(k) {
    y((T) => {
      const U = new Set(T);
      return U.has(k) ? U.delete(k) : U.add(k), U;
    });
  }
  const R = Be(
    () => _d(t, o),
    [t, o]
  ), I = Be(
    () => Hd(R, m, p),
    [R, m, p]
  ), A = R.flatMap((k) => k.tags), P = A.filter((k) => k.definitions.length > 0).length, _ = A.length - P, K = [
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
        `${A.length} tags · ${P} with slots · ${_} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: m,
          onChange: (k) => u(k.target.value),
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
          K.map(([k, T]) => n("button", {
            key: k,
            type: "button",
            onClick: () => f(k),
            "aria-pressed": p === k,
            className: `rounded px-3 py-1.5 text-xs font-medium ${p === k ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, T))
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
          onClick: () => y(new Set(R.map((k) => k.overviewKey))),
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
        onClick: N,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && I.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, I.map((k) => {
      const T = b.has(k.overviewKey), U = k.tags.filter((Z) => Z.definitions.length > 0).length;
      return n("article", {
        key: k.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => W(k.overviewKey),
          "aria-expanded": !T,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, T ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, k.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${k.tags.length} tag${k.tags.length === 1 ? "" : "s"} · ${U} with slots`
          )
        ]),
        T ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          k.tags.map((Z) => n("li", {
            key: Z.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: Z.tagName }, Z.tagName),
              Z.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            Z.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${Z.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, Z.definitions.map((ie) => n("li", {
              key: ie.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, rt(ie)),
              ...(ie.genderHints || []).map((ue) => n("span", {
                key: ue,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, fr(ue)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (ie) => S({
                tagId: Z.tagId,
                tagName: Z.tagName,
                trigger: ie.currentTarget
              }),
              "aria-label": `Edit performer slots for ${Z.tagName}`,
              className: `${Y} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    w ? n(lo, {
      key: `performer-slots-configure:${w.tagId}`,
      tagId: w.tagId,
      tagName: w.tagName,
      onSaved: q,
      onClose: O
    }) : null
  ]);
}
function ec({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = L("general"), [a, s] = L([]), [l, d] = L(!1), [c, g] = L(""), [m, u] = L(""), [p, f] = L(null), [b, y] = L(!0), [w, S] = L(!1), [N, q] = L(""), [O, W] = L(!0), [R, I] = L(Ea), A = qs(t), P = A.map(([T]) => T);
  ye(() => {
    P.includes(o) || i(P[0] || "general");
  }, [t.effectiveMode]);
  async function _(T) {
    const U = await ee("/segment-groups", T ? { signal: T } : void 0);
    s(U || []);
  }
  ye(() => {
    const T = new AbortController();
    return _(T.signal).catch((U) => {
      U.name !== "AbortError" && g(U.message || "Unable to load tag groups.");
    }), () => T.abort();
  }, []), ye(() => {
    if (t.effectiveMode !== "full") {
      y(!1);
      return;
    }
    const T = new AbortController();
    return q(""), y(!0), Promise.all([
      ee("/analysis/settings", { signal: T.signal }),
      ee("/analysis/status", { signal: T.signal })
    ]).then(([U, Z]) => {
      W(!0), u((U == null ? void 0 : U.baseUrl) || ""), f(Z);
    }).catch((U) => {
      if (U.name !== "AbortError") {
        if (U.status === 403) {
          W(!1), q("You do not have permission to manage the analysis service connection.");
          return;
        }
        q(U.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      T.signal.aborted || y(!1);
    }), () => T.abort();
  }, [t.effectiveMode]);
  async function K(T) {
    if (T !== t.requestedMode) {
      d(!0), g("");
      try {
        const U = await ee(
          `/preferences/transition?mode=${encodeURIComponent(T)}`
        );
        let Z = !1, ie = null, ue = null, ge = null, F = !1;
        if (t.requestedMode === "basic" && T === "full") {
          if (!window.confirm(Js(
            U.recyclingBinCount,
            U.protectedRecyclingBinCount
          )))
            return;
          F = !0, U.recyclingBinCount > 0 && (Z = !0, ge = U.recyclingBinFingerprint, ie = `mode-switch-empty-bin:${ge}`, ue = Pe(ie));
        }
        let X = !1;
        if (t.requestedMode === "full" && T === "basic") {
          if (!window.confirm(Vs(
            U.extensionOwnedSegmentCount
          )))
            return;
          X = !0;
        }
        const ce = await ee("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: T,
            confirmHiddenExtensionOwnedSegments: X,
            confirmBasicHistoryCleanup: F,
            emptyRecyclingBin: Z,
            operationId: ue,
            expectedRecyclingBinFingerprint: ge
          })
        });
        ie && Le(ie), r == null || r(Ba(ce)), g("Workflow mode saved.");
      } catch (U) {
        g(U.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function Y(T) {
    T.preventDefault(), S(!0), q("");
    try {
      const U = await ee("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: m })
      });
      u((U == null ? void 0 : U.baseUrl) || "");
      const Z = await ee("/analysis/status");
      f(Z), q(U != null && U.baseUrl ? Z != null && Z.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(Z == null ? void 0 : Z.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (U) {
      q(U.message || "Unable to save analysis service settings.");
    } finally {
      S(!1);
    }
  }
  const k = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (T) => ai(T, e, k), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      A.map(([T, U]) => n("button", {
        key: T,
        type: "button",
        onClick: () => i(T),
        "aria-current": o === T ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === T ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, U))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(Zd)
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
      n(fd, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: K,
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
          checked: R,
          onChange: (T) => {
            const U = T.target.checked;
            Da(U), I(U);
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
            onChange: (T) => u(T.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: b || w || !O,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: b || w || !O,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, w ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        N || (b ? "Loading analysis service settings…" : (p == null ? void 0 : p.configured) === !1 ? "Full Scan is not configured." : p != null && p.ready ? "Analysis service is ready." : (p == null ? void 0 : p.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    P.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(Qd, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => _()
      })
    ) : null,
    P.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(Xd, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => _()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function ma({ facets: e, values: t, disabled: r, onChange: o }) {
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
function tc({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var g, m;
  const s = [...e.slots || []].sort((u, p) => u.sortOrder - p.sortOrder || String(u.slotDefinitionId).localeCompare(String(p.slotDefinitionId))), l = [...new Map(s.map((u) => [
    u.performerId,
    { id: u.performerId, name: u.performerName }
  ])).values()], d = s.map((u) => ({
    slotDefinitionId: u.slotDefinitionId,
    label: rt(u),
    performer: { id: u.performerId, name: u.performerName }
  })), c = Ua(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: Ya(t)
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
          n(qt, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((m = e.activity) == null ? void 0 : m.name) || "Tag segment"),
          l.length ? n(yr, {
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
function nc({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(ba, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: Zs(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: Ua(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function ga({ onNavigate: e, profile: t }) {
  const r = Be(() => {
    const F = va("ext:com.midnightrider.segment-studio:segments");
    return F ? {
      ...Pr,
      defaultFilter: { ...Pr.defaultFilter, ...F.findFilter || {} },
      defaultObjectFilter: F.objectFilter || {}
    } : Pr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = xa(r), [l, d] = L(null), [c, g] = L({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [m, u] = L(null), [p, f] = L(null), [b, y] = L(0), [w, S] = L(""), [N, q] = L(!0), [O, W] = L(""), R = fe(0), I = _o(o, i), A = I.activityTagId, P = cn(i.slots), _ = Be(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (F) => Object.keys(cn(F)).length > 0,
    sanitize: (F) => Lr(A, cn(F)),
    summarize: (F) => `${Object.keys(cn(F)).length} assigned`,
    renderEditor: (F, X) => A ? n(ma, {
      facets: l,
      values: cn(F),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (ce, ae) => {
        const xe = { ...cn(F) };
        ae ? xe[ce] = Number(ae) : delete xe[ce], X(Lr(A, xe));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [A, l, c.performerSlotsAvailable]), K = JSON.stringify(I);
  ye(() => {
    if (d(null), !A) return;
    const F = new AbortController();
    return ee(`/browse/activities/${A}/facets`, { signal: F.signal }).then(d).catch((X) => {
      X.status === 403 ? d({ slots: [], restricted: !0 }) : X.name !== "AbortError" && W(X.message);
    }), () => F.abort();
  }, [A]), ye(() => {
    const F = ++R.current, X = new AbortController();
    return q(!0), W(""), ee("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(I), signal: X.signal }).then((ce) => {
      F === R.current && g({ ...ce, totalCount: ce.totalCount ?? ce.total ?? 0 });
    }).catch((ce) => {
      if (!(F !== R.current || ce.name === "AbortError")) {
        if (ce.status === 400 && ce.message.includes("unrestricted performer read access")) {
          g((ae) => ({ ...ae, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), W("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        W(ce.message);
      }
    }).finally(() => {
      F === R.current && q(!1);
    }), () => {
      R.current++, X.abort();
    };
  }, [K, b]);
  const Y = c.items.findIndex((F) => F.key === m), k = c.items[Y] || null;
  function T(F) {
    s(F), a({ ...o, page: 1 });
  }
  function U(F) {
    const X = _o(o, F), ce = F.slots && X.activityTagId != null && X.slotAssignments.length > 0 ? F.slots : void 0;
    T({ ...F, slots: ce });
  }
  function Z(F, X) {
    const ce = { ...P };
    X ? ce[F] = Number(X) : delete ce[F], T({ ...i, slots: Lr(A, ce) });
  }
  function ie() {
    const F = document.querySelector(`[data-segment-key="${m}"]`);
    u(null), requestAnimationFrame(() => F == null ? void 0 : F.focus());
  }
  async function ue(F) {
    var ae;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    f(F.key), S("");
    const X = `browse-restore:${F.itemId}:${F.revision}`, ce = Pe(X);
    try {
      const xe = (Se = !1) => ee(`/bin/${F.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ce,
          expectedRevision: F.revision,
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
      Le(X), m === F.key && u(null), S("Segment restored to Cove."), y((Se) => Se + 1);
    } catch (xe) {
      S(xe.message || "Unable to restore the segment."), xe.status === 409 && y((Se) => Se + 1);
    } finally {
      f(null);
    }
  }
  async function ge(F) {
    f(F.key), S("");
    try {
      const X = await ee(`/items/${F.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: F.revision })
      });
      if (!qa(X, S) || !cl(X))
        return;
      const ce = `browse-dependency-delete:${F.itemId}:${X.fingerprint}`;
      await ee(`/items/${F.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Pe(ce),
          fingerprint: X.fingerprint
        })
      }), Le(ce), m === F.key && u(null), S(`${X.deletedSegmentCount} segment${X.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), y((ae) => ae + 1);
    } catch (X) {
      S(X.message || "Unable to permanently delete the segment."), X.status === 409 && y((ce) => ce + 1);
    } finally {
      f(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(so, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(Sa, {
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
      error: O ? new Error(O) : null,
      onRetry: () => y((F) => F + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? zo.filter((F) => F.id !== "performers") : zo,
      objectFilter: i,
      onObjectFilterChange: U,
      customFilterSections: _,
      searchPlaceholder: "Search segments..."
    }, [
      A ? n(ma, { key: "slots", facets: l, values: P, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: Z }) : null,
      n(nc, { key: "player", item: k, index: Y, count: c.items.length, onPrevious: () => {
        var F;
        return u((F = c.items[Y - 1]) == null ? void 0 : F.key);
      }, onNext: () => {
        var F;
        return u((F = c.items[Y + 1]) == null ? void 0 : F.key);
      }, onClose: ie, onNavigate: e }),
      w ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, w) : null,
      !N && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      N ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((F) => n(tc, {
        key: F.key,
        item: F,
        selected: F.key === m,
        busy: p === F.key,
        onSelect: () => u(F.key),
        onRestore: ue,
        onPurge: ge
      })))
    ])
  ]);
}
function rc({ onNavigate: e, profile: t }) {
  const [r, o] = L([]), [i, a] = L(""), [s, l] = L(0), [d, c] = L(!0), [g, m] = L(null), [u, p] = L(""), f = fe(null);
  async function b(S) {
    const N = await ee("/bin", S ? { signal: S } : void 0);
    return o(N.items || []), a(N.fingerprint || ""), l(Number(N.totalCount) || 0), N;
  }
  ye(() => {
    const S = new AbortController();
    return c(!0), b(S.signal).catch((N) => {
      N.name !== "AbortError" && p(N.message);
    }).finally(() => {
      S.signal.aborted || c(!1);
    }), () => S.abort();
  }, []), ha(Qr, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var S;
      return (S = f.current) == null ? void 0 : S.call(f);
    }
  }]);
  async function y(S) {
    var O;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    m(S.itemId), p("");
    const N = `restore:${S.itemId}:${S.revision}`, q = Pe(N);
    try {
      const W = (R = !1) => ee(`/bin/${S.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: q, expectedRevision: S.revision, discardMissingImage: R })
      });
      try {
        await W(no(N));
      } catch (R) {
        if (((O = R.payload) == null ? void 0 : O.code) !== "missing-image" || !window.confirm(`${R.message}

Continue and discard the missing image reference?`)) throw R;
        ro(N), await W(!0);
      }
      Le(N), await b(), En(), p("Segment restored with a new native ID.");
    } catch (W) {
      p(W.message || "Unable to restore the segment."), W.status === 409 && await b();
    } finally {
      m(null);
    }
  }
  async function w() {
    if (g == null)
      try {
        const S = await Va({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          m(-1), p("");
        });
        if (S.status !== "emptied") return;
        await b(), En(), p(`${S.segmentCount} segment${S.segmentCount === 1 ? "" : "s"} from ${S.sceneCount} scene${S.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (S) {
        p(S.message || "Unable to empty the recycling bin."), S.status === 409 && await b();
      } finally {
        m(null);
      }
  }
  return f.current = w, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    n(so, {
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
    ...r.map((S) => n("article", { key: S.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${S.tagName || "Tag segment"} · ${S.videoTitle || `Video ${S.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, S.endSec == null ? Me(S.startSec) : `${Me(S.startSec)} – ${Me(S.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${S.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${S.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: g != null, onClick: () => y(S), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const pa = "ext:com.midnightrider.segment-studio:videos";
function Br({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = Be(() => {
    var H;
    const M = va(pa), V = (H = M == null ? void 0 : M.uiOptions) == null ? void 0 : H.displayMode;
    return M ? {
      ...An,
      defaultFilter: { ...An.defaultFilter, ...M.findFilter || {} },
      defaultObjectFilter: M.objectFilter || {},
      defaultDisplayMode: An.allowedDisplayModes.includes(V) ? V : An.defaultDisplayMode
    } : An;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = xa(i), [m, u] = L({ items: [], totalCount: 0 }), [p, f] = L(!0), [b, y] = L(""), [w, S] = L(0), [N, q] = L(/* @__PURE__ */ new Set()), [O, W] = L(null), [R, I] = L({ busy: !1, error: "", announcement: "" }), A = fe(0), P = fe(null), _ = fe(null);
  _.current || (_.current = Kd());
  const K = JSON.stringify(a), Y = JSON.stringify(s), k = t || r === "review";
  ye(() => {
    _.current.selectionChanged(), P.current = null, q(/* @__PURE__ */ new Set()), I((M) => ({ busy: M.busy, error: "", announcement: "" }));
  }, [K, Y]), ye(() => {
    if (!k) return;
    const M = new AbortController();
    return ee("/analysis/status", { signal: M.signal }).then(W).catch((V) => {
      V.name !== "AbortError" && W({ configured: !0, ready: !1, error: V.message || "Unable to check Full Scan readiness." });
    }), () => M.abort();
  }, [k]), ye(() => {
    const M = ++A.current, V = new AbortController();
    return f(!0), y(""), ee(`/videos?${cd(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: V.signal }).then((H) => {
      M === A.current && u(H);
    }).catch((H) => {
      M === A.current && H.name !== "AbortError" && y(H.message || "Unable to discover videos.");
    }).finally(() => {
      M === A.current && f(!1);
    }), () => {
      A.current++, V.abort();
    };
  }, [K, Y, t, r, w]);
  function T(M) {
    d({ ...M, page: M.page || 1 });
  }
  function U(M) {
    c(M), d({ ...a, page: 1 });
  }
  function Z(M, V = !1) {
    q((H) => ud(
      H,
      m.items.map((se) => se.videoId),
      M,
      P.current,
      V
    )), P.current = M;
  }
  function ie() {
    P.current = null, q(new Set(m.items.map((M) => M.videoId)));
  }
  function ue() {
    P.current = null, q(/* @__PURE__ */ new Set());
  }
  function ge() {
    P.current = null, q((M) => new Set(m.items.map((V) => V.videoId).filter((V) => !M.has(V))));
  }
  async function F(M = ["aiTagging", "omnishotcut"]) {
    const V = _.current.begin();
    if (V) {
      I({ busy: !0, error: "", announcement: "" });
      try {
        const H = await zd(
          [...N],
          M,
          ee,
          (se) => window.confirm(se)
        );
        if (H.cancelled) {
          I({ busy: !1, error: "", announcement: "" });
          return;
        }
        H.queuedIds.length > 0 && _.current.ownsCurrentSelection(V) && (H.queuedIds.includes(P.current) && (P.current = null), q((se) => {
          const $ = new Set(se);
          return H.queuedIds.forEach((le) => $.delete(le)), $;
        })), I({
          busy: !1,
          announcement: H.queuedIds.length > 0 ? `${H.queuedIds.length} ${H.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: H.failed.length > 0 ? `${H.failed.length} selected ${H.failed.length === 1 ? "video could" : "videos could"} not be queued. ${H.failed[0].error}` : ""
        });
      } catch (H) {
        I({ busy: !1, error: H.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        _.current.finish(V);
      }
    }
  }
  const X = t || r === "review" ? oa : oa.filter((M) => !["reviewState", "shotBoundaries"].includes(M.id)), ce = O === null || O.configured === !1 || O.ready === !1, ae = R.busy || ce, xe = (O == null ? void 0 : O.error) || (O === null ? "Checking Full Scan availability" : O.configured === !1 ? "Configure the analysis service before running Full Scan" : O.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), Se = R.busy ? "Queueing scans…" : O === null ? "Checking Full Scan…" : O.configured === !1 ? "Full Scan not configured" : O.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
  return n("div", { className: "w-full space-y-5" }, [
    n(so, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(Sa, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: pa,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: T,
      totalCount: m.totalCount,
      isLoading: p,
      error: b ? new Error(b) : null,
      onRetry: () => S((M) => M + 1),
      sortOptions: t || r === "review" ? [...ra, { value: "unreviewed_count", label: "Unreviewed count" }] : ra,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: X,
      objectFilter: s,
      onObjectFilterChange: U,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: k ? N : void 0,
      onSelectAll: k ? ie : void 0,
      onSelectNone: k ? ue : void 0,
      onInvertSelection: k ? ge : void 0,
      selectionActions: k ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: ae,
          onClick: () => F(),
          title: xe,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, Se),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": ae,
            title: xe,
            onClick: (M) => {
              ae && M.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${ae ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(ka, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([M, V]) => n("button", {
            key: M,
            type: "button",
            disabled: R.busy,
            onClick: (H) => {
              var se;
              (se = H.currentTarget.closest("details")) == null || se.removeAttribute("open"), F(V);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, M)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, R.announcement),
      R.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, R.error) : null,
      !p && m.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !p && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, m.items.map((M) => n(md, { key: M.videoId, item: M, onNavigate: e, showReviewStates: k, selected: N.has(M.videoId), selectionActive: N.size > 0, onSelect: k ? Z : null }))) : null,
      !p && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, m.items.map((M) => n(gd, { key: M.videoId, item: M, onNavigate: e, showReviewStates: k, selected: N.has(M.videoId), selectionActive: N.size > 0, onSelect: k ? Z : null }))) : null
    ])
  ]);
}
function fa({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = L(null), [s, l] = L(!0), [d, c] = L(""), g = fe(0), m = fe(0), u = fe(e), p = Yl();
  u.current = e;
  const f = (N) => `/videos/${N}/editor`;
  async function b(N, q, O) {
    const W = await ee(f(q), O ? { signal: O.signal } : void 0);
    return Kt(N, O ? g.current : m.current, q, u.current) ? (a(W), !0) : !1;
  }
  ye(() => {
    const N = ++g.current, q = e, O = new AbortController();
    return a(null), l(!0), c(""), b(N, q, O).catch((W) => {
      Kt(N, g.current, q, u.current) && W.name !== "AbortError" && c(W.message || "Unable to load the editor.");
    }).finally(() => {
      Kt(N, g.current, q, u.current) && l(!1);
    }), () => {
      g.current++, m.current++, O.abort();
    };
  }, [e]);
  function y(N, q) {
    a((O) => (O == null ? void 0 : O.video.id) !== q ? O : typeof N == "function" ? N(O) : N);
  }
  async function w() {
    const N = e, q = ++m.current;
    try {
      const O = await ee(f(N));
      return Kt(q, m.current, N, u.current) ? (a(O), c("A newer canonical segment was loaded. Your stale change was not applied."), O) : null;
    } catch (O) {
      return Kt(q, m.current, N, u.current) && c(O.message || "Unable to reload the latest segment."), null;
    }
  }
  async function S() {
    const N = e, q = ++m.current;
    try {
      const O = await ee(f(N));
      return Kt(q, m.current, N, u.current) ? (a(O), c(""), O) : null;
    } catch (O) {
      return Kt(q, m.current, N, u.current) && c(O.message || "Unable to reload performer slots."), null;
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
      n(Wi, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(Gd, {
      key: i.video.id,
      detail: i,
      onDetailChange: y,
      onConflict: w,
      onReload: S,
      onSlotsChanged: S,
      splitLayout: p,
      profile: o,
      initialSegmentId: qo() ? -qo() : Xs(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function oc(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function ac(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function ic(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function sc({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = _s(o), l = oc(e, t, window.location.pathname), d = ac(e, t, window.location.pathname), c = ic(e, t, window.location.pathname), g = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (Ws(g, o) === "videos" && g !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Br, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(ec, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(ga, { onNavigate: r, profile: o });
    const p = Number(e);
    return Number.isInteger(p) && p > 0 ? n(fa, {
      videoId: p,
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
  if (c) return n(rc, { onNavigate: r, profile: o });
  const u = Number(e);
  return d ? n(ga, { onNavigate: r, profile: o }) : Number.isInteger(u) && u > 0 ? n(fa, {
    videoId: u,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(Br, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function lc({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = L(null), [a, s] = L("");
  return ye(() => {
    const l = new AbortController();
    return ee("/preferences", { signal: l.signal }).then((d) => i(Ba(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(sc, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function dc(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function cc(e, t) {
  const r = dc(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const Rc = {
  components: { SegmentStudioPage: lc },
  actionHandlers: { openSegmentStudio: cc }
};
export {
  cr as CLEARED_SEGMENT_SELECTION_ID,
  ra as DISCOVERY_SORT_OPTIONS,
  Rt as SEGMENT_STUDIO_CAPABILITIES,
  Qr as SEGMENT_STUDIO_EXTENSION_ID,
  jn as SEGMENT_STUDIO_SHORTCUTS,
  gs as activeEditorFilterCount,
  $l as applyDerivationRuleSlotSuggestions,
  Wr as applyFeedbackEditorDelta,
  Qo as applySegmentMergeDelta,
  gl as basicSegmentTimelineStyle,
  Zs as browseClipEnd,
  Ua as browseEditorHref,
  _o as buildBrowseRequest,
  qd as buildDerivationRuleGraph,
  cd as buildDiscoverySearchParams,
  Zi as buildMinuteTimelineTicks,
  _d as buildPerformerSlotOverview,
  ol as buildSegmentQuickSearchEntries,
  Ml as buildSegmentRailRows,
  El as buildTimelineRows,
  yc as buildTimelineTicks,
  ns as calculateCenteredTimelineScroll,
  Ur as calculateEditorPanelMaximum,
  Xi as calculateMinuteLabelStride,
  bc as calculateMinuteTimelineWidth,
  as as calculateSwimlaneTitleMaximum,
  rs as calculateTimelinePlayheadPosition,
  Xr as calculateTimelineRatioBounds,
  ss as calculateTimelineRatioFromPointer,
  hc as calculateVerticalRevealOffset,
  zt as clampEditorPanelWidth,
  sr as clampSwimlaneTitleWidth,
  Ma as clampTimelineRatio,
  eo as clampTimelineRatioForHeight,
  dr as clampTimelineZoom,
  id as compactProvenanceSummary,
  Kd as createBulkAnalysisCoordinator,
  Ps as createQueuedReviewRequest,
  la as createSegmentAnalysisRequestScope,
  Rc as default,
  dl as downloadFileNameFromContentDisposition,
  ps as dualRangeValueFromPointer,
  Go as duplicateIdentityFromResponse,
  Bs as duplicateOperationKey,
  ms as editorVisibilityIncludingSegment,
  Pl as expandedSwimlanes,
  Vs as extensionOwnedSegmentsModeSwitchPrompt,
  Gl as feedbackFrameTimestamps,
  Kl as feedbackResultMatchesAction,
  Ul as feedbackSelectionPlan,
  us as filterDerivedSegments,
  Or as filterEditorSegments,
  Hd as filterPerformerSlotOverview,
  rl as filterSegmentQuickSearch,
  wc as filterSegmentStudioShortcuts,
  jl as findAdjacentSegmentGroupKey,
  Ks as findAdjacentShot,
  Es as findEditorShortcut,
  Ra as findInitialSegmentSelection,
  Qi as findNearestSegmentInCurrentSwimlane,
  Us as findPublishedSelectionIdentity,
  Ue as findSegmentByStableIdentity,
  ls as findSegmentFromPlayhead,
  Yi as findSegmentNearPlayhead,
  Fl as findSwimlaneRangeSelection,
  qr as findSwimlaneSelection,
  tl as findUniquePerformerSlotAssignment,
  lr as findUnreviewedSelection,
  fr as formatGenderHint,
  zs as frameStepSeconds,
  Ka as generatePerformerSlotAssignmentRecommendations,
  kd as groupApprovedDraftsForPublishing,
  nl as groupAutoAssignCandidates,
  zl as groupIncorrectExamplesByTag,
  Cd as groupMaterializationOutputs,
  _t as groupSegmentsIntoSwimlanes,
  Dl as groupSelectedSwimlanes,
  io as groupSwimlanesBySegmentGroup,
  st as handleModalKey,
  mn as hasSegmentStudioCapability,
  Xo as hideCollectedFeedbackSegments,
  Sl as historyActionsForTarget,
  or as incorrectExampleHistoryState,
  Xa as indexPerformerSlotsBySegment,
  Ic as initialReviewFilter,
  ql as insertSegmentProjection,
  Kt as isCurrentEditorRequest,
  hl as isEditableTarget,
  Cc as isEditorShortcutOwner,
  ic as isSegmentStudioBinRoute,
  ac as isSegmentStudioSegmentsRoute,
  oc as isSegmentStudioSettingsRoute,
  Wd as layoutDerivationRuleComponent,
  Vd as layoutDerivationRuleComponents,
  Wl as mergeSegmentsProjection,
  Nl as multiSelectionActionHint,
  ks as nextSegmentAfterRemoval,
  ws as nextUnreviewedAfterRemoval,
  Lt as normalizeCollapsedSegmentGroups,
  ia as normalizeDiscoveryIds,
  ut as normalizeEditorSegmentFilters,
  Ot as normalizeGender,
  Uo as normalizeReviewFilter,
  Ba as normalizeSegmentStudioFeatureProfile,
  Nc as normalizeSegmentStudioMode,
  _r as normalizeSegmentStudioPublicMode,
  cn as parseBrowseSlotFilters,
  is as parseEditorLayout,
  ds as parseHideDerivedSegmentsPreference,
  cs as parseMergeConfirmationPreference,
  Fa as parsePlaybackShortcutConfig,
  Rs as parseShortcutBindingOverrides,
  jr as patchPerformerSlotProjection,
  gr as patchSegmentProjection,
  Ns as percentageSeekTime,
  el as performInitialSegmentSeek,
  qe as performerOptionId,
  ur as performerSlotHistoryState,
  rt as performerSlotLabel,
  Cl as performerSlotPresentation,
  Ac as performerSlotStatus,
  ao as performerSlotStatusFromSegmentSlots,
  Za as performerSlotsForSegment,
  ht as provenanceSourceLabel,
  za as rankPerformerOptions,
  Bl as reconcileSegmentGroupKey,
  xs as reconcileSelectedSegmentIds,
  pd as recyclingBinActionText,
  ul as recyclingBinDeletionPrompt,
  Wa as recyclingBinDeletionSummary,
  Js as recyclingBinModeSwitchPrompt,
  js as removeQueuedReviewsForSegments,
  Vr as removeSegmentsProjection,
  qo as requestedOwnedItemId,
  Xs as requestedSegmentId,
  ys as resolveEditorSegmentSelection,
  Ls as resolveQueuedReviewRequest,
  Gs as resolveSegmentCreationAction,
  Ws as resolveSegmentStudioRoute,
  Ms as resolveSegmentStudioShortcuts,
  Jd as resolveSelectedDerivationRule,
  Is as resolveSelectedSegments,
  Md as restoreDisabledToolbarActionFocus,
  Bd as restorePublishApprovedFocus,
  Fn as restoreSegmentFieldsProjection,
  oi as restoreSegmentsProjection,
  ri as revealCollapsedSegmentGroup,
  zd as runSelectedDiscoveryAnalysis,
  Ja as segmentBadgeStyle,
  pr as segmentGroupHeaderBackground,
  yt as segmentGroupKeyForSegment,
  oo as segmentHistoryIdentity,
  rr as segmentHistoryState,
  Ya as segmentRailItemStyle,
  $c as segmentStateStyle,
  dc as segmentStudioActionTarget,
  _s as segmentStudioLegacyMode,
  ml as segmentTimelineStyle,
  ct as segmentsHistoryState,
  Ss as selectAllVideoSegmentIds,
  Ys as selectedBrowseStates,
  ti as selectedSwimlaneMerge,
  ai as setBackLinkNavigation,
  kl as sharedPerformerSlotShape,
  wl as sharedTagPerformerSlotShape,
  un as shortcutAvailableInMode,
  Ds as shortcutBindingDisplayText,
  vc as shortcutBindingFromEvent,
  Sc as shortcutBindingsOverlap,
  kc as shortcutModesOverlap,
  As as shortcutRequiresSingleSegment,
  Mn as shotBoundaryFingerprint,
  xl as shouldAcceptCurrentTagFromEnter,
  xc as shouldExitShortcutCapture,
  Tc as shouldHandleEditorShortcut,
  sa as shouldLoadSegmentAnalysis,
  na as shouldReloadAfterSegmentMutation,
  zr as shouldRestoreTransitionSelection,
  al as shouldShowQuickSearchGroups,
  jo as splitShortcutCategoriesIntoColumns,
  Il as suggestDerivationRuleSlotMappings,
  Pn as swimlaneDisplayLabel,
  bl as swimlaneMarkerTop,
  fl as swimlaneStripeBackground,
  os as timelineContentStyle,
  Po as timelinePlayheadHorizontalStyle,
  pl as timelineSegmentWidth,
  es as timelineTickAlignment,
  ts as timelineTickPosition,
  Gr as timelineTimePercent,
  Ll as toggleAllCollapsedSegmentGroups,
  Os as toggledSelectionReviewState,
  wt as trapModalFocus,
  il as tryParseJsonResponseText,
  vs as updateAnchoredSegmentSelection,
  ud as updateDiscoverySelection,
  fs as updateDualRangeValues,
  bs as updateSegmentCollectionSelection,
  hs as updateSegmentRangeSelection,
  Oa as updateSegmentSelection,
  ua as validateDerivationRuleDraft,
  Oo as validateSegmentTiming,
  to as videoPerformerOptions,
  Fr as videoPerformerSlotAssignments,
  qs as visibleSegmentStudioSettingsTabs,
  Hs as visibleSegmentStudioTabs,
  ei as visibleVirtualRows
};
