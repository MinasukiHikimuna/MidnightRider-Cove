import to from "@cove/runtime/react";
import { createPortal as as } from "@cove/runtime/react-dom";
import { extensionFetch as Na } from "@cove/runtime/api";
import { formatDuration as is, EntityReferenceSelector as _n, useExtensionKeyboardBindings as ss, VideoPlayer as Ia, useRegisterExtensionKeyboardActions as Ca, getDefaultFilter as $a, useListUrlState as Ta, ListPage as Aa } from "@cove/runtime/components";
import { ChevronDown as Ra, StepBack as ls, StepForward as ds, Loader2 as cs } from "@cove/runtime/lucide-react";
const no = "com.midnightrider.segment-studio", Ma = "segment-studio.layout.v1", on = "segment-studio.operations.v1", Ea = "segment-studio.collapsed-segment-groups.v1", Da = "segment-studio.playback-shortcuts.v1", Oa = "segment-studio.timing-clipboard.v1", Pa = "segment-studio.hide-derived-segments.v1", La = "segment-studio.merge-confirmation.v1", pt = ["unreviewed", "approved", "rejected"], us = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], Fo = "(min-width: 1024px) and (min-height: 640px)", jo = "(min-width: 1024px) and (min-height: 900px)", qn = 1e-3, Bo = 15, ms = 30, Fa = 12, ht = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, ro = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30
}, Lt = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function Go(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function ja(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? br(e, null, 1, !0) ?? r[0] ?? null;
}
function br(e, t, r, o = !1) {
  var m;
  const i = e.findIndex((u) => u.markers.some((y) => y.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const u = e.flatMap((y) => y.markers.map((g) => g.segment)).filter((y) => y.reviewState === "unreviewed");
    return r < 0 ? u.at(-1) ?? null : u[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((u) => u.segment.id === t);
  if (!o)
    return ((m = (r < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((y) => y.segment.reviewState === "unreviewed")) == null ? void 0 : m.segment) ?? null;
  const l = e.flatMap((u) => u.markers.map((y) => y.segment)), d = l.findIndex((u) => u.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((u) => u.reviewState === "unreviewed") ?? null;
}
function gs(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((m, u) => m.markers.filter(({ segment: y }) => {
    const g = Number(y.startSec), f = y.endSec == null ? g + ms : Number(y.endSec);
    return Number.isFinite(g) && Number.isFinite(f) && f >= g && g <= i + Bo + qn && f >= i - Bo - qn;
  }).map(({ segment: y }) => ({ segment: y, laneIndex: u }))).sort((m, u) => m.laneIndex - u.laneIndex || Math.abs(m.segment.startSec - i) - Math.abs(u.segment.startSec - i) || m.segment.id - u.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((m) => m.markers.some((u) => u.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((m) => m.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((m) => m.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((m) => m.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function ps(e, t, r) {
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
function hr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function jc(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function fs(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function Bc(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function ys(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function bs(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function hs(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function vs(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function _r(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function xs(e, t, r = 10) {
  const o = _r(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function Uo(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function Ss(e, t = Fa) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function Ba(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : ht.timelineRatio;
}
function qr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function nn(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? ht.detailWidth : Math.min(qr(t, 0), Math.max(240, e));
}
function yr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? ht.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function ks(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function oo(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: ht.timelineRatio, maximum: ht.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function ao(e, t) {
  const r = Ba(e);
  if (!(t > 0)) return r;
  const o = oo(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function ws(e) {
  if (!e) return { ...ht };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? Ba(r) : ht.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: nn(t == null ? void 0 : t.detailWidth),
      markerRailWidth: nn(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: yr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...ht };
  }
}
function Ns(e, t, r) {
  return r > 0 ? ao((t + r - e) / r, r) : ht.timelineRatio;
}
function Gc(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function Is(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, m) => c.startSec - m.startSec || c.id - m.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= qn ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function tn(e, t, r, o) {
  return e === t && r === o;
}
const vr = "__segment-studio-cleared-selection__";
function Cs(e) {
  return e === "true";
}
function $s(e) {
  return e !== "false";
}
function Ga() {
  try {
    return $s(window.localStorage.getItem(La));
  } catch {
    return !0;
  }
}
function Ua(e) {
  try {
    window.localStorage.setItem(La, String(!!e));
  } catch {
  }
}
function Ts(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function wt(e = {}) {
  const t = pt.filter((m) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(m) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (m, u) => {
    const y = Number(m);
    return Number.isFinite(y) ? Math.min(1, Math.max(0, y)) : u;
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
function jr(e, t, r, o = !1, i = []) {
  var c, m;
  const a = wt(r), s = a.performerId == null ? null : new Set((t || []).filter((u) => Number(u.performerId) === a.performerId).map((u) => u.segmentId)), l = new Set((i || []).flatMap((u) => u.tags || []).map((u) => Number(u.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((m = (c = (i || []).find((u) => Number(u.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : m.map((u) => Number(u.tagId))) || []);
  return Ts(e || [], o).filter((u) => {
    if (u.reviewState != null && !a.reviewStates.includes(u.reviewState) || s && !s.has(u.id) || a.tagId != null && Number(u.tagId) !== a.tagId || d && !d.has(Number(u.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(u.tagId)) || a.sourceKey != null && u.sourceKey !== a.sourceKey) return !1;
    const y = Number(u.confidence);
    return u.confidence == null || !Number.isFinite(y) ? a.includeUnscored : y >= a.confidenceMin && y <= a.confidenceMax;
  });
}
function Ka(e, t, r, o = !1, i = []) {
  var l;
  const a = wt(r);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = wt({
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
    filters: wt(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function As(e, t = !1) {
  const r = wt(e);
  return +(r.reviewStates.length !== pt.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function Rs(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function Ms(e, t, r, o) {
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
function Es(e, t, r = null) {
  return t === vr ? null : ja(
    e,
    t ?? r
  );
}
function za(e, t, r, o = !1) {
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
function Ds(e, t, r) {
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
function Os(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return za(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function Ps(e, t, r = null, o = !1) {
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
    const u = o ? [.../* @__PURE__ */ new Set([...l, ...i])] : l;
    return {
      ...Os(u, s, t, m, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: u
    };
  }
  const d = za(i, a, t, o);
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
function Ls(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function Fs(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function Ko(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function zo(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => Ko(t, o) - Ko(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function js(e, t, r) {
  var c, m;
  const o = e || [], i = new Set(t || []), a = o.findIndex((u) => (u.markers || []).some(({ segment: y }) => y.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: u }) => u.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const u of o) {
      const y = (u.markers || []).find(({ segment: g }) => !i.has(g.id));
      if (y) return y.segment;
    }
    return null;
  }
  const l = zo(
    o[a].markers,
    s,
    i
  );
  if (l) return l;
  const d = (m = o.map((u, y) => ({ lane: u, index: y })).filter(({ lane: u }) => (u.markers || []).some(({ segment: y }) => !i.has(y.id))).sort((u, y) => Math.abs(u.index - a) - Math.abs(y.index - a) || +(u.index < a) - +(y.index < a) || u.index - y.index)[0]) == null ? void 0 : m.lane;
  return zo(d == null ? void 0 : d.markers, s, i);
}
function Bs(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function Gs(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function Ho(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function Us() {
  try {
    return Cs(window.localStorage.getItem(Pa));
  } catch {
    return !1;
  }
}
function Ks(e) {
  try {
    window.localStorage.setItem(Pa, String(!!e));
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
], zs = /* @__PURE__ */ new Set([
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
function Hs(e) {
  return zs.has(e);
}
function Ha(e) {
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
function _s(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Yn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(Ha).filter(Boolean)]));
  } catch {
    return {};
  }
}
function qs(e = {}) {
  const t = _s(e);
  return Yn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function _o(e, t = 2) {
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
function Uc(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : Ha({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function Kc(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function Wr(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function qo(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function zc(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = qo(e.code, t.key), a = qo(t.code, e.key);
  if (!r && !o && !i && !a) return !1;
  const s = i ? t.key : e.key, l = i ? e.code : a ? t.code : o ? e.code : e.code || t.code;
  for (const d of [!1, !0])
    for (const c of [!1, !0])
      for (const m of [!1, !0])
        for (const u of [!1, !0]) {
          const y = {
            key: s,
            code: l,
            ctrlKey: d,
            metaKey: c,
            altKey: m,
            shiftKey: u
          };
          if (Wr(y, e) && Wr(y, t)) return !0;
        }
  return !1;
}
function vn(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function Hc(e, t) {
  return [!1, !0].some((r) => vn(e, r) && vn(t, r));
}
function Ws(e, t = !1, r = {}) {
  return qs(r).find((o) => vn(o, t) && o.bindings.some((i) => Wr(e, i))) || null;
}
function _a(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function Vs(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(_a).join(" / ") : "Unassigned";
}
function _c(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, Vs(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function qc(e) {
  return e === "review" ? "review" : "editor";
}
function Je(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function Js(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function Ys(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function Qs(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => Je(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: Je(t, e.activeIdentity) || r[0]
  };
}
function Zs(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function Xs(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => Zs(o, i))));
}
function Wo(e, t) {
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
function el(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function tl(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function nl(e, t, r) {
  return e != null && (r == null || t !== r);
}
function rl(e, t, r, o = null) {
  if (r === t.tagId) return null;
  const i = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: r,
    tagName: o || ((i == null ? void 0 : i.tagId) === r ? i.tagName : null)
  };
}
function ol(e, t) {
  return t ? (e || []).map((r) => r.id === t.segmentId ? { ...r, tagId: t.tagId, tagName: t.tagName || "Tag segment", tagSortName: null } : r) : e;
}
function al(e, { segments: t, savingSegmentId: r, reviewSaving: o, tagEditing: i, selectedSegmentIds: a, activeSegmentId: s }) {
  if (!e) return "none";
  if (r != null || o) return "wait";
  const l = (t || []).find((c) => c.id === e.segmentId);
  return !l || l.tagId === e.tagId ? "drop" : i && s === e.segmentId && (a == null ? void 0 : a.length) === 1 && a[0] === e.segmentId ? "wait" : "apply";
}
function Vr(e, t) {
  return e === t;
}
function il(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function sl(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - qn).at(-1) || null : o.find((i) => i.startSec > t + qn) || null;
}
function zn(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function Vo(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: pt.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function Wc(e, t = null, r = !1) {
  const o = Vo(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function bn(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function qa(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: bn(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: bn(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: bn(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(bn(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(bn(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(bn(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...ro };
  }
}
function ll(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function Wa() {
  try {
    return qa(window.localStorage.getItem(Da));
  } catch {
    return { ...ro };
  }
}
function Jo(e) {
  const t = qa(JSON.stringify(e));
  try {
    window.localStorage.setItem(Da, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Ft = Object.freeze({
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
function Jr(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function Va(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? Jr(e.requestedMode) : "basic",
    effectiveMode: i ? Jr(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function xn(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function dl(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function cl(e) {
  const t = [];
  return xn(e, Ft.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), xn(e, Ft.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function ul(e) {
  return [
    ["general", "General", Ft.settingsGeneral],
    ["shortcuts", "Shortcuts", Ft.settingsShortcuts],
    ["performer-slots", "Performer slots", Ft.settingsPerformerSlots],
    ["derivation", "Derivation", Ft.settingsDerivation]
  ].filter(([, , r]) => xn(e, r)).map(([r, o]) => [r, o]);
}
function ml(e, t) {
  return e === "segments" && !xn(
    t,
    Ft.navigationSegmentInventory
  ) || e === "bin" && !xn(
    t,
    Ft.recyclingBinView
  ) ? "videos" : e;
}
function gl(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function pl(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const Br = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, Yo = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: pt.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function fl(e) {
  const t = String(e || "").split(",").filter((r) => pt.includes(r));
  return t.length === 0 ? [...pt] : [...new Set(t)];
}
function hn(e) {
  return Ja(e).values;
}
function Ja(e) {
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
function Gr(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function Qo(e, t) {
  var l;
  const r = Zo(t.activitiesCriterion, t.activityId), o = Zo(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = Ja(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: yl(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function Zo(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function yl(e, t) {
  return pt.includes(e == null ? void 0 : e.value) ? [e.value] : fl(t);
}
function Ya(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function bl(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function hl(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Xo(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function vl(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function tt(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function io(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Ur(e, t) {
  const r = new Set(io(t).map((o) => String(tt(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function Ht(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function ea(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(Ht).sort().join(",")}`;
}
function Qa(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((g) => String(g.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((g) => {
    var f;
    return !((f = g.genderHints) != null && f.length);
  }) && e.length === t.length && !i) {
    const g = [...e].sort((b, h) => String(b.slotDefinitionId).localeCompare(String(h.slotDefinitionId))), f = [...t].sort((b, h) => String(b.name).localeCompare(String(h.name)) || Number(tt(b)) - Number(tt(h)));
    return [{
      assignments: Object.fromEntries(g.map((b, h) => [String(b.slotDefinitionId), String(tt(f[h]))])),
      description: f.map((b) => b.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((g) => t.map((f, b) => ({ performer: f, index: b })).filter(({ performer: f }) => {
    var b;
    return !((b = g.genderHints) != null && b.length) || g.genderHints.some((h) => Ht(h) === Ht(f.gender || f.genderIdentity));
  }).map(({ index: f }) => f)), m = i ? c.filter((g) => g.length > 0).length : ta(c, t.length);
  if (m === 0) return [];
  const u = new Map(t.map((g, f) => [String(tt(g)), f]));
  function y(g, f, b) {
    if (s.length >= a) return;
    const h = c.slice(g), I = i ? h.filter((w) => w.length > 0).length : ta(h.map((w) => w.filter((B) => !f.has(String(tt(t[B]))))), t.length);
    if (b + I < m) return;
    if (g === e.length) {
      if (b !== m) return;
      const w = Object.fromEntries(d.map(({ slot: T, performer: N }) => [String(T.slotDefinitionId), N ? String(tt(N)) : ""])), B = o.length === 0 ? Object.values(w).sort().join(",") : [...new Set(e.map((T) => String(T.label || "")))].map((T) => `${T}:${d.filter(({ slot: N }) => String(N.label || "") === T).map(({ performer: N }) => N ? String(tt(N)) : "").sort().join(",")}`).join("|");
      !l.has(B) && s.length < a && (l.add(B), s.push({
        assignments: w,
        description: d.map(({ slot: T, performer: N }) => o.length ? `${T.label}: ${(N == null ? void 0 : N.name) || "Unassigned"}` : (N == null ? void 0 : N.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const x = e[g], C = [...d].reverse().find(({ slot: w }) => ea(w) === ea(x)), O = C ? u.get(String(tt(C.performer))) : -1;
    for (const w of c[g]) {
      const B = t[w], T = tt(B);
      if (!(w < O) && !(T == null || !i && f.has(String(T))) && (d.push({ slot: x, performer: B }), i || f.add(String(T)), y(g + 1, f, b + 1), i || f.delete(String(T)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: x, performer: null }), y(g + 1, f, b), d.pop();
  }
  return y(0, /* @__PURE__ */ new Set(), 0), s;
}
function ta(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function xl(e, t) {
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
      const u = [...new Set(e.map((y) => y.label || ""))].map((y) => `${y}:${a.filter((g) => (g.slot.label || "") === y).map((g) => g.performer.performerId).sort((g, f) => g - f).join(",")}`).join("|");
      i.has(u) || i.set(u, [...a]);
      return;
    }
    const c = e[l];
    for (const u of t)
      !o && d.has(u.performerId) || (m = c.genderHints) != null && m.length && !c.genderHints.some((y) => Ht(y) === Ht(u.gender)) || (a.push({ slot: c, performer: u }), o || d.add(u.performerId), s(l + 1, d), o || d.delete(u.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Sl(e) {
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
function kl(e, t, r = 20) {
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
function wl(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function Nl(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function Za(e, t, r) {
  const o = tt, i = new Set((t || []).map(o)), a = new Set((r || []).map(Ht));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), m = d.isVideoPerformer ?? i.has(o(d));
    if (c !== m) return m - c;
    const u = Ht(l.gender || l.genderIdentity), y = Ht(d.gender || d.genderIdentity), g = l.matchesGenderHint ?? a.has(u);
    return (d.matchesGenderHint ?? a.has(y)) - g || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: ye, useId: Xa, useMemo: _e, useRef: pe, useState: F } = to, n = to.createElement, ei = "/api/plugins/segment-studio";
function Le(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(on) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = Yr();
    return t[e] = r, window.localStorage.setItem(on, JSON.stringify(t)), r;
  } catch {
    return Yr();
  }
}
function Be(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(on) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(on, JSON.stringify(t));
  } catch {
  }
}
function so(e) {
  try {
    return JSON.parse(window.localStorage.getItem(on) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function lo(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(on) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(on, JSON.stringify(t));
  } catch {
  }
}
function Il(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function Cl(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function X(e, t, r = 0) {
  var d;
  const o = await Na(`${ei}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Il(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await Cl(250 * (r + 1), t == null ? void 0 : t.signal), X(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function $l(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${ei}${e}`, o = await Na(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: Tl(
      o.headers.get("Content-Disposition")
    )
  };
}
function Tl(e, t = "segment-studio-ai-feedback.zip") {
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
function Ce(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function Yr() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function ti(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function Al(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function ni(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function Rl(e, t) {
  const { sceneCount: r, segmentCount: o } = ni(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function ri(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = ni(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(Rl(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await X("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Le(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return Be(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function na({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const Tt = {
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
function Vc(e, t) {
  return {
    ...(Tt[e] || Tt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function oi(e) {
  return { ...(Tt[e] || Tt.unreviewed).badge };
}
function ai(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const ii = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function Ml(e, t, r = "not-applicable", o = !1) {
  const i = Tt[e] || Tt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function El(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Dl(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function Ol(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function Pl(e, t) {
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
function Ll(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function an({ state: e, includeLabel: t = !0 }) {
  const r = Tt[e] || Tt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: oi(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function Fl(e, t = null) {
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
function Jc(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function jl(e, t = document) {
  return !(e.defaultPrevented || Fl(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function Yc(e, t = document, r = !1, o = {}) {
  return jl(e, t) ? Ws(e, r, o) != null : !1;
}
function vt(e, { onCancel: t, onConfirm: r } = {}) {
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
function Bl(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function Gl({ confirm: e, cancel: t, confirmReady: r }) {
  const o = r && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function co({ confirmRef: e, cancelRef: t, confirmReady: r }) {
  ye(() => {
    const o = requestAnimationFrame(() => Gl({
      confirm: e.current,
      cancel: t == null ? void 0 : t.current,
      confirmReady: r
    }));
    return () => cancelAnimationFrame(o);
  }, [r]);
}
function Et(e) {
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
function Ul(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? i.filter((a) => a.sequence > o && a.sequence <= r).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > r && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function uo(e, t = !0) {
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
function mr(e, t = !0) {
  return {
    type: "segment",
    identity: uo(e, t),
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
function kt(e, t = !0) {
  return {
    type: "segments",
    segments: (e || []).map((r) => ({
      identity: uo(r, t),
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
function gr(e, t) {
  return {
    type: "incorrectExamples",
    collected: t,
    entries: (e || []).map(({ segment: r, result: o, example: i }) => ({
      exampleId: (o == null ? void 0 : o.exampleId) ?? (i == null ? void 0 : i.id) ?? null,
      originalIdentity: uo(r),
      collectedIdentity: {
        itemId: (o == null ? void 0 : o.itemId) ?? (i == null ? void 0 : i.itemId) ?? null,
        nativeSegmentId: (o == null ? void 0 : o.nativeSegmentId) ?? null,
        published: (o == null ? void 0 : o.nativeSegmentId) != null,
        revision: (o == null ? void 0 : o.revision) ?? null
      }
    }))
  };
}
function xr(e) {
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
function si(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function li(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = t.get(r.segmentId);
    o ? o.push(r) : t.set(r.segmentId, [r]);
  }
  for (const r of t.values())
    r.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function mo(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function Kl(e, t) {
  const r = (t || []).map((i) => si(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: ft(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function zl(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : Kl(e, t);
}
function Hl({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function Qc(e, t) {
  return mo(si(e, t));
}
function ft(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function _l(e, t) {
  const r = (d) => ft(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
    const c = /* @__PURE__ */ new Map();
    for (const m of d || []) {
      const u = r(m);
      c.has(u) || c.set(u, []), c.get(u).push(m);
    }
    return c;
  }, a = i(e), s = i(t), l = [];
  for (const [d, c] of a) {
    const m = s.get(d);
    if (!m || c.length !== m.length)
      continue;
    const u = [...c].sort(o), y = [...m].sort(o);
    u.forEach((g, f) => l.push({
      sourceSlotDefinitionId: g.id,
      derivedSlotDefinitionId: y[f].id
    }));
  }
  return l;
}
function ql(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = _l(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function Wl(e) {
  const t = ft(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(Nr).filter(Boolean);
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
function Sr(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function ra(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((m) => m.end <= s && m.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: Sr(o),
    trackCount: Math.max(1, t.length)
  };
}
function Vl(e) {
  const t = e.map(ft), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function Jl(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], m = d.length > 0 && d.every((u) => Number(u.performerId) > 0) ? d.map((u) => `${u.slotDefinitionId}:${Number(u.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: m };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [ra({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = Vl(l.slots), m = l.slots.filter((b) => !a.has(String(b.slotDefinitionId))), u = o.length === 1 ? l.slots : m, y = u.map((b) => `${c.get(String(b.slotDefinitionId))} · ${b.performerName || `Performer ${b.performerId}`}`).join(" · "), g = [...new Map(u.map((b) => [
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
          performerLabel: y,
          performers: g,
          performerAssignments: f,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(ra);
}
function rn(e, t = [], r = []) {
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => Jl(s, a));
}
function go(e) {
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
    for (const s of pt)
      a.counts[s] += Number((r = o.counts) == null ? void 0 : r[s]) || 0;
  }
  return t;
}
const Yl = {
  group: 38,
  lane: 33,
  segment: 41
};
function Ql(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = Yl[s.kind];
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
function di(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function Zl(e, t = [], r = !0) {
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
function Xl(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: Sr(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return go(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: Sr(a)
    };
  });
}
function ci(e, { nativeOnly: t = !1 } = {}) {
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
function oa(e, t) {
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
function qt(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function Wn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function ed(e) {
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
    }, o ? ed(e.name) : "—"),
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
function ui({ assignments: e, className: t = "" }) {
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
  const o = pe(null), i = `performer-slots-${Xa()}`, [a, s] = F(null);
  function l() {
    var g;
    const c = (g = o.current) == null ? void 0 : g.getBoundingClientRect();
    if (!c) return;
    const m = Math.max(0, Math.min(256, window.innerWidth - 16)), u = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), y = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - m - 8, c.right - m)),
      top: y >= u + 8 ? c.bottom + 4 : Math.max(8, c.top - u - 4),
      width: m
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
    a ? as(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(ui, {
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
function td(e, t) {
  const r = new Set(qt(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function mi(e, t) {
  return t ? qt(e).filter((r) => r !== t) : qt(e);
}
function nd(e, t) {
  const r = qt(t), o = new Set(qt(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function $t(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function aa(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), m = Number.isFinite(c) && c >= d ? c : d, u = d <= o && m >= o, y = u ? 0 : Math.min(Math.abs(o - d), Math.abs(o - m));
    return { contains: u, distance: y, duration: m - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function Qr(e, t, r, o = null) {
  var m, u, y, g, f, b;
  const i = e.findIndex((h) => h.markers.some((I) => I.segment.id === t));
  if (i < 0) {
    const h = [...((m = e[0]) == null ? void 0 : m.markers) || []];
    return o != null && Number.isFinite(Number(o)) && h.sort((I, x) => aa(I, x, o)), ((u = h[0]) == null ? void 0 : u.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((h) => h.segment.id === t);
  if (r === "left" || r === "right") {
    const h = r === "left" ? -1 : 1, I = Math.min(a.markers.length - 1, Math.max(0, s + h));
    return ((y = a.markers[I]) == null ? void 0 : y.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((g = a.markers[s]) == null ? void 0 : g.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((f = a.markers[s]) == null ? void 0 : f.segment) ?? null : ((b = [...e[l].markers].sort(c ? (h, I) => aa(h, I, Number(o)) : (h, I) => Math.abs(h.segment.startSec - d) - Math.abs(I.segment.startSec - d) || h.segment.startSec - I.segment.startSec || h.segment.id - I.segment.id)[0]) == null ? void 0 : b.segment) ?? null;
}
function rd(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = Qr([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function od(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function ad(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function id(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [la(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => la(Math.min(s, r + l))))];
}
function sd(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function ld(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function Zr(e, t) {
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
    const u = Number(c);
    r.has(u) && !o.has(u) || (d[o.get(u) ?? c] = m);
  }
  return {
    ...e,
    approvedSetVersion: t.approvedSetVersion || e.approvedSetVersion,
    segments: a,
    performerSlots: l,
    performerSlotRevisions: d
  };
}
function ia(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function dd(e) {
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
async function cd(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await sa(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], m = id(
        d.startSec,
        d.endSec
      );
      for (const [u, y] of m.entries()) {
        Math.abs(r.currentTime - y) > 5e-4 && (r.currentTime = y, await sa(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const g = await ud(o), f = `example-${l + 1}-frame-${u + 1}`;
        c.push({ fieldName: f, timestampSec: y }), s.push({
          fieldName: f,
          file: new File(
            [g],
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
function sa(e, t) {
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
function ud(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function la(e) {
  return Math.round(e * 1e3) / 1e3;
}
function kr(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function md(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function Xr(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function Jn(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function gi(e, t) {
  const r = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...r.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Kr(e, t, r, o) {
  const i = (r || []).map((d) => ({ ...d, segmentId: t })), a = e.performerSlots || [], s = a.findIndex((d) => d.segmentId === t), l = a.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...i), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function gd(e, t) {
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
function pi(e, t) {
  return !e || !t ? !1 : e.itemId != null && e.itemId === t.itemId || e.nativeSegmentId != null && e.nativeSegmentId === t.nativeSegmentId ? !0 : e.id != null && e.id === t.id;
}
function pd(e, t) {
  return (e || []).some((r) => (t || []).some((o) => pi(r, o)));
}
function Zc(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function fd(e, t) {
  return (e || []).find((r) => pi(t, r)) || null;
}
function Xc(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function eu(e, t) {
  var r;
  return ((r = e.running) == null ? void 0 : r.kind) === t;
}
function tu(e) {
  return e.running != null || e.queued.length > 0;
}
const da = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
function zr(e) {
  return Object.freeze({
    id: e.id,
    kind: e.kind,
    lockId: e.lockId,
    targets: e.targets,
    exclusive: e.exclusive
  });
}
function nu({ getContext: e = () => ({}) } = {}) {
  let t = 1, r = null, o = [], i = null, a = !1, s = da;
  const l = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
  let c = [];
  function m() {
    s = r == null && o.length === 0 && i == null ? da : Object.freeze({
      running: r ? zr(r) : null,
      queued: Object.freeze(o.map(zr)),
      lastFailure: i
    });
    for (const C of [...d]) C();
    if (r == null && o.length === 0) {
      const C = c;
      c = [];
      for (const O of C) O();
    }
  }
  function u(C, O) {
    l.set(C.id, O.status), C.resolve(O);
  }
  function y(C) {
    if (C.dependsOn == null) return "met";
    const O = l.get(C.dependsOn);
    return O === "fulfilled" ? "met" : O != null ? "failed" : "pending";
  }
  function g(C) {
    r = C;
    const O = { ...e(), taskId: C.id };
    O.resolveTargets = () => C.targets.map((B) => fd(O.segments, B)).filter(Boolean), m();
    let w;
    try {
      w = C.run(O);
    } catch (B) {
      w = Promise.reject(B);
    }
    Promise.resolve(w).then(
      (B) => f(C, { status: "fulfilled", value: B }),
      (B) => f(C, { status: "rejected", error: B })
    );
  }
  function f(C, O) {
    u(C, O), !a && (r = null, O.status === "rejected" && (i = Object.freeze({ id: C.id, kind: C.kind, error: O.error })), m(), b());
  }
  function b() {
    if (a || r != null) return;
    let C = !1;
    for (let O = 0; O < o.length; O += 1) {
      const w = o[O], B = y(w);
      if (B === "failed") {
        o = o.filter((T) => T !== w), u(w, { status: "dropped", reason: "dependency-failed" }), C = !0, O -= 1;
        continue;
      }
      if (B !== "pending" && !(w.exclusive && O > 0) && !o.slice(0, O).some((T) => pd(T.targets, w.targets)) && !(w.ready && !w.ready(e()))) {
        o = o.filter((T) => T !== w), g(w);
        return;
      }
    }
    C && m();
  }
  function h(C) {
    if (a || (r == null ? void 0 : r.exclusive) || o.some((N) => N.exclusive) || r != null && C.whenBusy !== "enqueue") return null;
    let w;
    const B = new Promise((N) => {
      w = N;
    }), T = {
      id: t++,
      kind: C.kind,
      lockId: C.lockId ?? null,
      targets: Object.freeze([...C.targets || []]),
      exclusive: C.exclusive === !0,
      dependsOn: C.dependsOn ?? null,
      ready: C.ready || null,
      run: C.run,
      resolve: w
    };
    return o = [...o, T], m(), b(), { id: T.id, done: B };
  }
  function I(C = {}) {
    let O = null;
    const w = h({
      ...C,
      whenBusy: "reject",
      run: () => new Promise((T) => {
        O = T;
      })
    });
    if (!w) return null;
    if (O == null)
      return x((T) => T.id === w.id), null;
    let B = !1;
    return () => {
      B || (B = !0, O());
    };
  }
  function x(C) {
    const O = o.filter((w) => C(zr(w)));
    if (O.length === 0) return 0;
    o = o.filter((w) => !O.includes(w));
    for (const w of O) u(w, { status: "cancelled" });
    return m(), b(), O.length;
  }
  return {
    enqueue: h,
    acquire: I,
    cancel: x,
    poke: b,
    subscribe(C) {
      return d.add(C), () => d.delete(C);
    },
    getSnapshot: () => s,
    whenIdle() {
      return r == null && o.length === 0 ? Promise.resolve() : new Promise((C) => c.push(C));
    },
    dispose() {
      if (a) return;
      const C = o;
      o = [], a = !0;
      for (const O of C) u(O, { status: "cancelled" });
      d.clear();
    }
  };
}
function ca(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function yd(e) {
  const { compatibilityMode: t, currentTime: r, detail: o, editorFilters: i, endInput: a, hideDerivedSegments: s, historyRef: l, mediaDuration: d, onConflict: c, onDetailChange: m, onReload: u, optimisticSegmentIdRef: y, pendingDuplicateRef: g, pendingFirstSegmentStartSecRef: f, pendingTagEditSegmentIdRef: b, heldCreatedSegmentTag: h, setHeldCreatedSegmentTag: I, replaceSegmentSelection: x, savingSegmentId: C, segments: O, selectedSegment: w, selectedSegmentIdRef: B, selectedSegments: T, selectionAnchorIdRef: N, selectionRangeBaseIdsRef: D, setCreatingSegmentId: M, setEditorFilters: q, setFirstSegmentTagOpen: re, setHideDerivedSegments: Y, setHistory: $, setHistoryOpen: E, setPublishApprovedError: z, setSaveMessage: G, setSavingSegmentId: W, setSelectedSegmentGroupKey: ie, setSelectedSegmentId: le, setSelectedSegmentIds: K, setTagEditing: te, startInput: de, tagEditingRef: oe, timelineDuration: be, video: me } = e;
  function Q(p) {
    l.current = p || Lt, $(l.current);
  }
  async function P(p, k, H, J, _ = null) {
    var ue;
    try {
      const R = await X(`/videos/${me.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: l.current.revision,
          kind: p,
          label: k,
          beforeState: H,
          afterState: J,
          receiptId: _
        })
      });
      return Q(R), !0;
    } catch (R) {
      return R.status === 409 && ((ue = R.payload) != null && ue.current) && Q(R.payload.current), G("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function ne(p, k, H = !0, J = null, _ = !1, ue = k, R = !0) {
    var qe;
    if (!p || C != null) return null;
    const ee = T.map((Ie) => Ie.id), V = B.current, ge = H && !t ? crypto.randomUUID() : null;
    W(p.id), G(H ? "Saving directly to Cove…" : "Restoring history…");
    const xe = _ ? kr(o, [p.id], ue) : null;
    xe && m(xe, me.id);
    try {
      if (t && p.nativeSegmentId == null && p.itemId != null) {
        const Ne = `draft-update:${me.id}:${p.itemId}:${p.revision}:${k.tagId}:${k.startSec}:${k.endSec ?? "open"}:${k.reviewState ?? p.reviewState}`, Ee = await X(`/videos/${me.id}/drafts/${p.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(Ne),
            expectedRevision: p.revision,
            startSec: k.startSec,
            endSec: k.endSec,
            tagId: k.tagId,
            reviewState: k.reviewState
          })
        });
        Be(Ne);
        const at = {
          ...p,
          ...Ee.draft,
          id: p.id,
          itemId: p.itemId
        };
        return H && await P(
          "segment.update",
          J || "Changed segment",
          mr(p, t),
          mr(
            at,
            t
          )
        ), ca(p, k, t) ? await u() : m({
          ...o,
          approvedSetVersion: Ee.approvedSetVersion || o.approvedSetVersion,
          segments: O.map((st) => st.id === p.id ? at : st).sort((st, Z) => st.startSec - Z.startSec || st.id - Z.id)
        }, me.id), G(((qe = Ee.draft) == null ? void 0 : qe.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), at;
      }
      const Ie = await X(`/videos/${me.id}/segments/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...k,
          expectedUpdatedAt: p.updatedAt,
          historyReceiptId: ge
        })
      }), We = {
        ...p,
        ...Ie,
        reviewState: k.reviewState ?? p.reviewState
      }, Fe = O.map((Ne) => Ne.id === p.id ? We : Ne).sort((Ne, Ee) => Ne.startSec - Ee.startSec || Ne.id - Ee.id);
      return ca(p, k, t) ? await u() : m({ ...o, segments: Fe }, me.id), H && await P(
        "segment.update",
        J || "Changed segment",
        mr(p, t),
        mr(
          We,
          t
        ),
        ge
      ), G(H ? "Saved to Cove" : "History restored"), We;
    } catch (Ie) {
      return _ && m((We) => Jn(
        We,
        [p],
        Object.keys(ue)
      ), me.id), _ && R && (K(ee), le(V), N.current = V, D.current = []), Ie.status === 409 ? (G("Conflict — loading the latest segment…"), await c()) : G(Ie.message || "Unable to save the segment."), null;
    } finally {
      W(null);
    }
  }
  async function ke() {
    if (!t) return !1;
    const p = O.filter((H) => !H.published && H.reviewState === "approved").length;
    if (p === 0 || C != null) return !1;
    const k = `complete-review:${me.id}:${o.approvedSetVersion}`;
    z(""), W(-1), G(`Publishing ${p} Approved draft${p === 1 ? "" : "s"}…`);
    try {
      const H = await X(`/videos/${me.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(k),
          expectedApprovedSetVersion: o.approvedSetVersion
        })
      });
      Be(k), Q(Lt), E(!1);
      const J = await u(), _ = il(
        O,
        B.current,
        H.published
      ), ue = _ ? Je(J == null ? void 0 : J.segments, _) : null;
      return ue && le(ue.id), G(`${H.published.length} Approved draft${H.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (H) {
      const J = H.status === 409 ? "The approved drafts changed. Review the updated list and try again." : H.message || "Unable to publish the approved drafts.";
      return H.status === 409 && await c(), z(J), G(J), !1;
    } finally {
      W(null);
    }
  }
  async function fe(p = null, k = null) {
    var Ie;
    if (C != null || U()) return;
    const H = p != null ? f.current : null, J = Number.isFinite(H) ? H : r, _ = Math.min(be, J + 20);
    if (_ <= J) {
      G("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const ue = tl(O, w, p);
    if (ue.kind === "choose-tag") {
      f.current = J, G(""), re(!0);
      return;
    }
    if (ue.kind === "invalid-selection") {
      G("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: R } = ue, ee = `create-draft:${me.id}:${R}:${J}`, V = t ? null : crypto.randomUUID(), ge = B.current, xe = {
      ...w || {},
      id: y.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: R,
      tagName: k || (w == null ? void 0 : w.tagName) || "Tag segment",
      tagSortName: R === (w == null ? void 0 : w.tagId) && (w == null ? void 0 : w.tagSortName) || null,
      startSec: J,
      endSec: _,
      reviewState: "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, qe = md(o, xe);
    W(-1), re(!1), m(qe, me.id), ue.openTagEditor && (M(xe.id), b.current = xe.id, te(!0)), x(xe.id), ie($t(
      rn(qe.segments, qe.segmentGroups || [], qe.performerSlots || []),
      xe.id
    ));
    try {
      let We;
      if (t) {
        const Ee = await X(`/videos/${me.id}/drafts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationId: Le(ee), tagId: R, startSec: J, endSec: _ })
        });
        Be(ee), We = { itemId: (Ie = Ee.draft) == null ? void 0 : Ie.itemId };
      } else
        We = { nativeSegmentId: (await X(`/videos/${me.id}/segments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tagId: R,
            startSec: J,
            endSec: _,
            historyReceiptId: V
          })
        })).id };
      f.current = null, re(!1);
      const Fe = await u();
      if (!Fe) {
        m((Ee) => Xr(
          Ee,
          [xe.id]
        ), me.id), x(ge), G(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${ue.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
        return;
      }
      const Ne = Je(Fe == null ? void 0 : Fe.segments, We);
      Ne ? (ue.openTagEditor && (oe.current && (b.current = Ne.id), I((Ee) => (Ee == null ? void 0 : Ee.segmentId) === xe.id ? { ...Ee, segmentId: Ne.id } : Ee), M(Ne.id)), x(Ne.id), ie($t(
        rn(Fe.segments || [], Fe.segmentGroups || [], Fe.performerSlots || []),
        Ne.id
      )), t || await P(
        "segment.create",
        "Created segment",
        kt([], !1),
        kt([Ne], !1),
        V
      )) : (te(!1), G(`Segment created, but it could not be selected${ue.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
    } catch (We) {
      m((Fe) => Xr(
        Fe,
        [xe.id]
      ), me.id), x(ge), p != null && re(!0), G(We.message || "Unable to create the draft.");
    } finally {
      I((We) => (We == null ? void 0 : We.segmentId) === xe.id ? null : We), M(null), W(null);
    }
  }
  function U() {
    return h == null || h.segmentId !== (w == null ? void 0 : w.id) ? !1 : (G("Close the tag field to save the new segment's tag first."), !0);
  }
  async function Re() {
    if (T.length !== 1 || !w || C != null || U()) return;
    const p = r;
    if (p <= w.startSec || w.endSec != null && p >= w.endSec) {
      G("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const k = `split-draft:${w.itemId}:${w.revision}:${p}`, H = t ? null : kt([w], !1), J = t ? null : crypto.randomUUID();
    W(w.id);
    try {
      let _ = null;
      t && w.nativeSegmentId == null ? (await X(`/videos/${me.id}/drafts/${w.itemId}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(k),
          expectedRevision: w.revision,
          splitSec: p
        })
      }), Be(k)) : _ = { nativeSegmentId: (await X(`/videos/${me.id}/segments/${w.id}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedUpdatedAt: w.updatedAt,
          splitSec: p,
          historyReceiptId: J
        })
      })).id };
      const ue = await u();
      if (!t) {
        const R = [
          Je(ue == null ? void 0 : ue.segments, {
            nativeSegmentId: w.nativeSegmentId ?? w.id
          }),
          Je(
            ue == null ? void 0 : ue.segments,
            _
          )
        ].filter(Boolean);
        await P(
          "segment.split",
          "Split segment",
          H,
          kt(R, !1),
          J
        );
      }
      G(t ? `Segment split; both ranges remain ${w.reviewState}.` : "Segment split.");
    } catch (_) {
      _.status === 409 ? await c() : G(_.message || "Unable to split the draft.");
    } finally {
      W(null);
    }
  }
  async function A(p = !1) {
    var _, ue;
    if (T.length !== 1 || !w || C != null || U()) return;
    const k = p ? r : w.startSec, H = el(me.id, w, p, k), J = t ? null : crypto.randomUUID();
    W(w.id);
    try {
      const R = ((_ = g.current) == null ? void 0 : _.operationKey) === H ? g.current : null;
      let ee = (R == null ? void 0 : R.duplicateIdentity) ?? null;
      if (ee == null && t && w.nativeSegmentId == null) {
        const xe = await X(`/videos/${me.id}/drafts/${w.itemId}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(H),
            expectedRevision: w.revision,
            startSec: p ? k : null
          })
        });
        ee = Wo(!1, xe), g.current = { operationKey: H, duplicateIdentity: ee };
      } else if (ee == null) {
        const xe = await X(`/videos/${me.id}/segments/${w.id}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: w.updatedAt,
            startSec: p ? k : null,
            historyReceiptId: J
          })
        });
        ee = Wo(!0, xe), g.current = { operationKey: H, duplicateIdentity: ee };
      }
      const V = await u(), ge = Je(V == null ? void 0 : V.segments, ee);
      if (ge) {
        t || await P(
          "segment.duplicate",
          "Duplicated segment",
          kt([], !1),
          kt([ge], !1),
          J
        );
        const xe = Ka(
          ge,
          V.performerSlots || [],
          i,
          s,
          V.segmentGroups || []
        );
        q(xe.filters), Y(xe.hideDerivedSegments), K([ge.id]), le(ge.id), N.current = ge.id, D.current = [], ie($t(
          rn(V.segments || [], V.segmentGroups || [], V.performerSlots || []),
          ge.id
        )), t && w.nativeSegmentId == null && Be(H), g.current = null, G(p ? "Duplicate created at the playhead." : "Duplicate created in place.");
      } else
        G("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
    } catch (R) {
      ((ue = g.current) == null ? void 0 : ue.operationKey) === H ? G("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : R.status === 409 ? await c() : G(R.message || "Unable to duplicate the draft.");
    } finally {
      W(null);
    }
  }
  async function v() {
    if (T.length !== 1 || !w) return;
    const p = Number(de), k = a.trim() === "" ? null : Number(a), H = Go(p, k, d);
    if (H.error) {
      G(H.error);
      return;
    }
    if (p === w.startSec && k === w.endSec) {
      G("Timing is unchanged.");
      return;
    }
    await ne(w, { startSec: p, endSec: k, tagId: w.tagId }, !0, null, !0);
  }
  async function S(p, k) {
    if (T.length !== 1 || !w) return;
    const H = Go(p, k, d);
    if (H.error) {
      G(H.error);
      return;
    }
    if (p === w.startSec && k === w.endSec) {
      G("Timing is unchanged.");
      return;
    }
    await ne(w, { startSec: p, endSec: k, tagId: w.tagId }, !0, null, !0);
  }
  return { acceptHistory: Q, recordHistoryAction: P, mutateSegment: ne, completeReview: ke, createSegment: fe, splitSegment: Re, duplicateSegment: A, saveTiming: v, applyShortcutTiming: S };
}
function bd() {
  const [e, t] = F(() => typeof window < "u" && window.matchMedia(Fo).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Fo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function hd() {
  const [e, t] = F(() => typeof window < "u" && window.matchMedia(jo).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(jo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function vd() {
  try {
    return ws(window.localStorage.getItem(Ma));
  } catch {
    return { ...ht };
  }
}
function xd() {
  try {
    return qt(JSON.parse(window.localStorage.getItem(Ea) || "[]"));
  } catch {
    return [];
  }
}
function Sd(e) {
  try {
    window.localStorage.setItem(Ea, JSON.stringify(qt(e)));
  } catch {
  }
}
function kd(e) {
  try {
    window.localStorage.setItem(Ma, JSON.stringify(e));
  } catch {
  }
}
function wd() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Oa) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Nd(e) {
  try {
    return window.localStorage.setItem(Oa, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Id({ status: e }) {
  const t = ii[e];
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
function _t({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, pt.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...oi(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${Tt[t].symbol}${e[t]}`)));
}
function Cd({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: m, shortcutRef: u }) {
  const y = io(a), [g, f] = F(() => Ur(o, y)), [b, h] = F(!1), [I, x] = F(""), C = pe(!1), O = o.map((M) => `${M.slotDefinitionId}:${M.performerId || ""}`).join("|"), w = y.map((M) => tt(M)).join("|"), B = Qa(
    o,
    y
  );
  ye(() => {
    f(Ur(o, y)), x("");
  }, [t, r, O, w]);
  async function T(M = g) {
    if (!C.current) {
      C.current = !0, h(!0), x("Saving performer slots…");
      try {
        const q = Ur(o.map(($) => ({
          ...$,
          performerId: M[$.slotDefinitionId] || null
        })), y), re = o.map(($) => {
          const E = q[$.slotDefinitionId] ? Number(q[$.slotDefinitionId]) : null, z = y.find((G) => String(tt(G)) === String(E));
          return {
            ...$,
            performerId: E,
            performerName: (z == null ? void 0 : z.name) || null
          };
        });
        s(re);
        const Y = await X(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map(($) => ({ slotDefinitionId: $.slotDefinitionId, performerId: q[$.slotDefinitionId] ? Number(q[$.slotDefinitionId]) : null }))
          })
        });
        x("Performer slots saved."), await l(Y, {
          beforeState: xr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: xr([{
            segmentId: t,
            itemId: r,
            revision: Y.revision,
            slots: Y.slots || []
          }])
        });
      } catch (q) {
        d && await d(o, q), q.status === 409 ? (x("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : x(q.message || "Unable to save performer slots.");
      } finally {
        C.current = !1, h(!1);
      }
    }
  }
  function N(M, q) {
    x(`Option ${q + 1} applied; save to confirm.`), f({ ...g, ...M.assignments });
  }
  async function D(M) {
    const q = { ...g, ...M.assignments };
    f(q), await T(q);
  }
  return ye(() => {
    if (u)
      return u.current = (M) => C.current || !B[M] ? !1 : (D(B[M]), !0), () => {
        u.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    B.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, B.map((M, q) => n("button", {
        key: q,
        type: "button",
        disabled: b,
        onClick: () => N(M, q),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${q + 1}: ${M.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, q + 1),
        n("span", { key: "description" }, M.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${B.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((M) => n("label", { key: M.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, ft(M)),
      (M.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(M.genderHints || []).map(Nr).join(" · ")}`) : null,
      n("select", { key: "select", value: g[M.slotDefinitionId] || "", disabled: b, onChange: (q) => f({ ...g, [M.slotDefinitionId]: q.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Za(y, y, M.genderHints).map((q) => n("option", { key: tt(q), value: tt(q) }, q.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: m, type: "button", disabled: b, onClick: () => T(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, I)])
  ]);
}
function $d({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a }) {
  var B;
  const s = ((B = t[0]) == null ? void 0 : B.slots) || [], l = io(r), d = Qa(
    s,
    l
  ), c = "__mixed__", m = () => Object.fromEntries(s.map((T, N) => {
    const D = t.map((M) => {
      var q;
      return String(((q = M.slots[N]) == null ? void 0 : q.performerId) || "");
    });
    return [T.slotDefinitionId, D.every((M) => M === D[0]) ? D[0] : c];
  })), [u, y] = F(m), [g, f] = F(!1), [b, h] = F(""), I = pe(!1), x = t.map((T) => `${T.itemId ?? `native:${T.segmentId}`}:${T.revision}:${T.slots.map((N) => `${N.slotDefinitionId}:${N.performerId || ""}`).join(",")}`).join("|");
  ye(() => {
    y(m());
  }, [x]);
  async function C(T = u) {
    if (I.current) return;
    I.current = !0, f(!0), h(`Saving performer slots for ${t.length} segments…`);
    const N = [];
    try {
      for (const D of t) {
        const M = D.slots.map((re, Y) => {
          const $ = T[s[Y].slotDefinitionId];
          return {
            slotDefinitionId: re.slotDefinitionId,
            performerId: $ === c ? re.performerId || null : $ ? Number($) : null
          };
        }), q = await X(D.itemId != null ? `/videos/${e}/drafts/${D.itemId}/slots` : `/videos/${e}/segments/${D.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: D.revision, assignments: M })
        });
        N.push({
          segmentId: D.segmentId,
          itemId: D.itemId,
          revision: q.revision,
          slots: q.slots || []
        });
      }
      h("Performer slots saved."), o({
        beforeState: xr(t),
        afterState: xr(N)
      });
    } catch (D) {
      const M = await i();
      D.status === 409 ? h(M ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : h(D.message || (M ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      I.current = !1, f(!1);
    }
  }
  function O(T, N) {
    h(`Option ${N + 1} applied; save to confirm.`), y({ ...u, ...T.assignments });
  }
  async function w(T) {
    const N = { ...u, ...T.assignments };
    y(N), await C(N);
  }
  return ye(() => {
    if (a)
      return a.current = (T) => I.current || !d[T] ? !1 : (w(d[T]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, d.map((T, N) => n("button", {
        key: N,
        type: "button",
        disabled: g,
        onClick: () => O(T, N),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${N + 1} to all selected segments: ${T.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, N + 1),
        n("span", { key: "description" }, T.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${d.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, s.map((T) => n("label", {
      key: T.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, ft(T)),
      n("select", {
        key: "select",
        value: u[T.slotDefinitionId] || "",
        disabled: g,
        onChange: (N) => y({ ...u, [T.slotDefinitionId]: N.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        u[T.slotDefinitionId] === c ? n("option", { key: "mixed", value: c }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Za(l, l, T.genderHints).map((N) => n("option", {
          key: tt(N),
          value: tt(N)
        }, N.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: g,
        onClick: () => C(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, b)
    ])
  ]);
}
function At(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function Td(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return At(t);
  const o = [...new Set(r.map((i) => At(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function Cr() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function pr({ name: e }) {
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
function Ad({ hidden: e }) {
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
function Rd({ segment: e, provenance: t }) {
  var m;
  const [r, o] = F(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = Td(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
        (m = e.sourceKey) != null && m.includes("stash-marker-studio") ? "Imported from Stash Marker Studio. Detailed run and model information was not recorded for this legacy segment." : "No detailed provenance was recorded for this segment."
      ) : s.map((u) => {
        const y = u.modelIdentifier || u.modelKey, g = u.value == null ? null : typeof u.value == "string" ? u.value : JSON.stringify(u.value);
        return n("div", { key: u.id || `${u.fieldKey}:${u.sourceKey}:${u.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            At(u.sourceKey, u.sourceDisplayName)
          ),
          u.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${u.fieldKey}${g == null ? "" : ` · ${g}`}`
          ) : null,
          u.relation === "inherited" ? n("div", { key: "relation", className: "text-secondary" }, "Inherited origin") : null,
          y ? n(
            "div",
            { key: "model", className: "text-secondary" },
            `Model ${y}${u.modelVersion ? ` · ${u.modelVersion}` : ""}`
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
function Md({
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
  const [u, y] = F([]), g = e.flatMap((I) => I.lanes.map((x) => x.key)), f = g.join("|");
  ye(() => {
    const I = new Set(g);
    y((x) => x.filter((C) => I.has(C)));
  }, [f]);
  const b = Sr(t), h = !!ci(
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
        `${g.length} swimlane${g.length === 1 ? "" : "s"} · ${e.length} group${e.length === 1 ? "" : "s"}`
      ),
      a ? n(_t, { key: "counts", counts: b }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      Hl({ mergeable: h, reviewable: a, tagEditable: s, slotsEditable: l })
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
    ...e.map((I) => n("section", {
      key: I.key,
      "data-selected-segment-group": I.key,
      className: "space-y-1.5"
    }, [
      n("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        n("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, I.name),
        n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${I.selectedCount} selected`)
      ]),
      ...I.lanes.map((x) => {
        const C = u.includes(x.key), O = x.markers.some(({ segment: B }) => B.id === r), w = `selected-segment-lane-${x.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: x.key,
          "data-selected-segment-lane": x.key,
          className: `rounded-md border ${O ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": C,
            "aria-controls": w,
            "aria-current": O ? "true" : void 0,
            onClick: () => y((B) => C ? B.filter((T) => T !== x.key) : [...B, x.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, C ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Wn(x)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(x.selectedCount)),
            a ? n(_t, { key: "states", counts: x.counts }) : null
          ]),
          C ? n("div", {
            key: "segments",
            id: w,
            className: "space-y-1 border-t border-border p-1.5"
          }, x.markers.map(({ segment: B }) => {
            const T = B.endSec == null ? Ce(B.startSec) : `${Ce(B.startSec)} – ${Ce(B.endSec)}`;
            return n("button", {
              key: B.id,
              type: "button",
              onClick: () => i(B),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${B.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${B.tagName || "Segment"}, ${B.reviewState}, ${T}` : `${B.tagName || "Segment"}, ${T}`,
              "aria-current": B.id === r ? "true" : void 0
            }, [
              a ? n(an, {
                key: "state",
                state: B.reviewState,
                includeLabel: !1
              }) : null,
              B.isDerived ? n(Cr, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, T),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                At(B.sourceKey)
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
}, ua = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], ma = [
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
function fi(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function ga(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function fr(e, t, r, o = null) {
  const i = ga(t), a = ga(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function Ed(e, t, r = null) {
  var u, y, g;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (u = t.hasSegmentsCriterion) == null ? void 0 : u.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), fr(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), fr(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), fr(o, t.performersCriterion, "performer"), fr(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = pa(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = pa(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((y = t.reviewStateCriterion) == null ? void 0 : y.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const m = (g = t.shotBoundariesCriterion) == null ? void 0 : g.value;
  return r && typeof m == "boolean" ? o.set("hasShotBoundaries", String(m)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function pa(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function Dd(e, t, r, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((m) => a.add(m));
  } else a.has(r) ? a.delete(r) : a.add(r);
  return a;
}
function yi({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(na, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, pt.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = Tt[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(na, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function bi({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
function Od({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      n(bi, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, is(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(yi, { item: e, showReviewStates: r }))
    ])
  ]);
}
function Pd({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n(bi, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
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
        n(yi, { key: "segments", item: e, showReviewStates: r })
      ]),
      n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function po({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = cl(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => Qn(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && xn(
        o,
        Ft.recyclingBinView
      ) ? n(hi, { key: "bin", onNavigate: t }) : null,
      n(vi, { key: "settings", onNavigate: t })
    ])
  ]);
}
const eo = "segment-studio:recycling-bin-changed";
function Ld(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function Hn() {
  window.dispatchEvent(new CustomEvent(eo));
}
function hi({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = F(null);
  ye(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const m = await X("/bin"), u = Number(m == null ? void 0 : m.totalCount);
        !a && c === s && o(Number.isFinite(u) && u >= 0 ? Math.trunc(u) : null);
      } catch {
        !a && c === s && o(null);
      }
    }, d = () => {
      l();
    };
    return l(), window.addEventListener(eo, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(eo, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = Ld(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => Qn(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function vi({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => Qn(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function Fd({ mode: e, onModeChange: t, disabled: r = !1 }) {
  function o(i) {
    const a = Jr(i.target.value);
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
function jd({ minimum: e, maximum: t, onChange: r }) {
  const o = pe(null), [i, a] = F("maximum"), s = (y, g) => {
    const f = Ms(e, t, y, g);
    a(f.coincidentTop), r({ minimum: f.minimum, maximum: f.maximum });
  }, l = (y, g) => {
    var b;
    const f = (b = o.current) == null ? void 0 : b.getBoundingClientRect();
    f && s(y, Rs(g.clientX, f.left, f.width));
  }, d = (y, g) => {
    var f, b;
    g.preventDefault(), (b = (f = g.currentTarget).setPointerCapture) == null || b.call(f, g.pointerId), l(y, g);
  }, c = (y, g) => {
    var f, b;
    (b = (f = g.currentTarget).hasPointerCapture) != null && b.call(f, g.pointerId) && l(y, g);
  }, m = (y, g) => {
    const f = y === "minimum" ? e : t, b = y === "minimum" ? 0 : e, h = y === "minimum" ? t : 1, I = g.shiftKey ? 0.1 : 0.01;
    let x = null;
    ["ArrowLeft", "ArrowDown"].includes(g.key) && (x = f - I), ["ArrowRight", "ArrowUp"].includes(g.key) && (x = f + I), g.key === "PageDown" && (x = f - 0.1), g.key === "PageUp" && (x = f + 0.1), g.key === "Home" && (x = b), g.key === "End" && (x = h), x != null && (g.preventDefault(), s(y, Math.min(h, Math.max(b, x))));
  }, u = (y, g) => n("span", {
    key: y,
    role: "slider",
    tabIndex: 0,
    "aria-label": y === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((y === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((y === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(g * 100),
    "aria-valuetext": `${Math.round(g * 100)} percent`,
    onPointerDown: (f) => d(y, f),
    onPointerMove: (f) => c(y, f),
    onKeyDown: (f) => m(y, f),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${g * 100}%`,
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
        u("minimum", e),
        u("maximum", t)
      ])
    )
  ]);
}
function Bd({ saving: e, error: t, onSelect: r, onClose: o }) {
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
    onKeyDownCapture: (s) => vt(s, { onCancel: a })
  }, n("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: Et,
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
    n(_n, {
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
function Gd({
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
  const u = wt(e), y = [...new Map((a || []).map((h) => [
    Number(h.tagId),
    h.tagName || `Tag ${h.tagId}`
  ])).entries()].sort((h, I) => h[1].localeCompare(I[1]) || h[0] - I[0]), g = (h) => d(wt({ ...u, ...h })), f = (h) => g({
    reviewStates: u.reviewStates.includes(h) ? u.reviewStates.filter((I) => I !== h) : [...u.reviewStates, h]
  }), b = (h) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${h ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && m();
    },
    onKeyDownCapture: (h) => vt(h, { onCancel: m })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: Et,
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
        n("div", { className: "flex flex-wrap gap-2" }, pt.map((h) => {
          const I = u.reviewStates.includes(h), x = Tt[h];
          return n("button", {
            key: h,
            type: "button",
            onClick: () => f(h),
            "aria-pressed": I,
            className: b(I)
          }, `${x.symbol} ${h} (${i[h] || 0})`);
        }))
      ]) : null,
      l ? n("fieldset", { key: "performer", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Performer"),
        n("p", { className: "text-xs text-secondary" }, "Any assigned slot may match the selected performer."),
        n("div", { className: "flex flex-wrap gap-2" }, [
          n("button", {
            key: "any",
            type: "button",
            onClick: () => g({ performerId: null }),
            "aria-pressed": u.performerId == null,
            className: b(u.performerId == null)
          }, "All performers"),
          ...r.map((h) => {
            const I = Number(tt(h));
            return n("button", {
              key: I,
              type: "button",
              onClick: () => g({ performerId: I }),
              "aria-pressed": u.performerId === I,
              className: b(u.performerId === I)
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
            onChange: (h) => g({
              tagId: h.target.value === "" ? null : Number(h.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...y.map(([h, I]) => n("option", { key: h, value: h }, I))
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
            onChange: (h) => g({
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
            onClick: () => g({ sourceKey: null }),
            "aria-pressed": u.sourceKey == null,
            className: b(u.sourceKey == null)
          }, "All provenance"),
          ...o.map((h) => n("button", {
            key: h,
            type: "button",
            onClick: () => g({ sourceKey: h }),
            "aria-pressed": u.sourceKey === h,
            title: h,
            className: b(u.sourceKey === h)
          }, At(h)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(jd, {
          minimum: u.confidenceMin,
          maximum: u.confidenceMax,
          onChange: ({ minimum: h, maximum: I }) => g({
            confidenceMin: h,
            confidenceMax: I
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
            onChange: (h) => g({
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
        n(Ad, { key: "icon", hidden: t }),
        n("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    n("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(wt({})), l && c(!1);
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
function Ud({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Yn.filter((l) => vn(l, e)), i = _o(o, 1)[0], a = _o(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((m) => n("div", { key: m.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, m.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[m.id] ? t[m.id].length > 0 ? t[m.id] : ["Unassigned"] : m.bindings.map(_a)).map((u, y) => n("kbd", { key: `${m.id}:${y}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, u))
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
    onKeyDownCapture: (l) => vt(l, { onCancel: r })
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
function Kd({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = dd(e), [l, d] = F([]), c = s.map((m) => m.tagName).join("|");
  return ye(() => {
    const m = new Set(s.map((u) => u.tagName));
    d((u) => u.filter((y) => m.has(y)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (m) => vt(m, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: Et,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", { key: "title", id: "segment-studio-examples-title", className: "text-lg font-semibold text-foreground" }, "AI Feedback"),
      n("p", { key: "description", className: "mt-1 text-sm text-secondary" }, `${e.length} registered-AI example${e.length === 1 ? "" : "s"} in this video. Expand a tag to inspect or restore examples before export.`)
    ]),
    n("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      n("div", { key: "items", className: "space-y-3" }, e.length ? s.map((m, u) => {
        const y = l.includes(m.tagName), g = `incorrect-example-tag-${u}`;
        return n("section", {
          key: m.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": y,
            "aria-controls": g,
            onClick: () => d((f) => y ? f.filter((b) => b !== m.tagName) : [...f, m.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: wr(!1) }
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
            id: g,
            className: "divide-y divide-border border-t border-border"
          }, m.examples.map((f) => {
            const b = `${Ce(f.startSec)}${f.endSec == null ? "" : ` – ${Ce(f.endSec)}`}`, h = r === f.id;
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
                "aria-label": `${h ? "Restoring" : "Restore to review"} ${m.tagName} example at ${b}`,
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
function zd({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = F(""), [a, s] = F(0), l = pe(null), d = _e(() => kl(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), m = Nl(d);
  ye(() => {
    var y;
    (y = l.current) == null || y.scrollIntoView({ block: "nearest" });
  }, [c, o]);
  const u = () => {
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
      var g;
      if (y.key === "Tab")
        Et(y);
      else if (y.key === "Escape")
        y.preventDefault(), y.stopPropagation(), r();
      else if (y.key === "ArrowDown" || y.key === "ArrowUp") {
        y.preventDefault(), y.stopPropagation();
        const f = y.key === "ArrowDown" ? 1 : -1;
        s((b) => d.length ? (b + f + d.length) % d.length : 0);
      } else y.key === "Enter" && !((g = y.nativeEvent) != null && g.isComposing) && (y.preventDefault(), y.stopPropagation(), u());
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
    }, d.length ? d.flatMap((y, g) => {
      var w;
      const f = y.segment || y, b = f.endSec == null ? Ce(f.startSec) : `${Ce(f.startSec)} – ${Ce(f.endSec)}`, h = `${At(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`, I = g === c, x = g > 0 ? d[g - 1].groupKey : null, C = m && y.groupKey !== x ? n("div", {
        key: `group:${y.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, y.groupName) : null, O = n("button", {
        key: f.id,
        id: `segment-quick-search-${f.id}`,
        ref: I ? l : null,
        type: "button",
        role: "option",
        "aria-selected": I,
        onMouseEnter: () => s(g),
        onClick: () => t(f),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${I ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        m ? n("span", { key: "group", className: "sr-only" }, `${y.groupName} group`) : null,
        n(an, { key: "review", state: f.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          f.tagName || "Tag segment"
        ),
        (w = y.performers) != null && w.length ? n(Ir, {
          key: "performers",
          performers: y.performers,
          performerAssignments: y.performerAssignments
        }) : null,
        n(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          b
        ),
        n("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: h
        }, h)
      ]);
      return C ? [C, O] : [O];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function Hd(e) {
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
function _d({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = _e(() => Hd(e), [e]), [l, d] = F([]), c = s.reduce((g, f) => g + f.drafts.length, 0), m = pe(null);
  co({ confirmRef: m, cancelRef: o, confirmReady: !t && c > 0 });
  const u = (g) => d((f) => f.includes(g) ? f.filter((b) => b !== g) : [...f, g]), y = (g) => `segment-studio-publish-approved-${g.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && a();
    },
    onKeyDownCapture: (g) => vt(g, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: Et,
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
      ].flatMap(([g, f]) => [
        n("dt", { key: `${g}:label`, className: "text-secondary" }, g),
        n("dd", { key: `${g}:value`, className: "font-semibold text-foreground" }, String(f))
      ])),
      s.length ? n("div", { key: "groups", className: "space-y-2" }, s.map((g) => {
        const f = l.includes(g.key);
        return n("section", { key: g.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": f,
            "aria-controls": y(g),
            onClick: () => u(g.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: wr(!1) }
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, f ? "▾" : "▸"),
            n("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, g.tagName),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${g.drafts.length} draft${g.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          f ? n("div", {
            key: "drafts",
            id: y(g),
            className: "divide-y divide-border border-t border-border"
          }, g.drafts.map((b) => {
            const h = b.endSec == null ? Ce(b.startSec) : `${Ce(b.startSec)} – ${Ce(b.endSec)}`, I = `${At(b.sourceKey)}${b.confidence == null ? "" : ` · ${Math.round(b.confidence * 100)}%`}`;
            return n("div", { key: b.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(an, { key: "review", state: b.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, h),
              n("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: I
              }, I)
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
function qd({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = Sl(e), [s, l] = F(() => /* @__PURE__ */ new Set()), [d, c] = F(() => new Set(a.map((b) => b.key))), m = a.flatMap((b) => d.has(b.key) ? b.candidates : []), u = (b) => l((h) => {
    const I = new Set(h);
    return I.has(b) ? I.delete(b) : I.add(b), I;
  }), y = (b) => c((h) => {
    const I = new Set(h);
    return I.has(b) ? I.delete(b) : I.add(b), I;
  }), g = (b) => b.assignment.map(({ slot: h, performer: I }) => `${h.label || `Slot ${h.sortOrder + 1}`}: ${I.name}`).join(", "), f = (b) => `segment-studio-auto-assign-${b.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && !t && i();
    },
    onKeyDownCapture: (b) => {
      b.key === "Enter" && b.target instanceof HTMLInputElement || vt(b, {
        onCancel: t ? void 0 : i,
        onConfirm: m.length && !t ? () => o(m) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: Et,
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
          style: { background: wr(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(b.key),
            disabled: t,
            onChange: () => y(b.key),
            "aria-label": `Include ${b.tagName} assignment: ${g(b)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(b.key),
            "aria-controls": f(b),
            "aria-label": `${s.has(b.key) ? "Collapse" : "Expand"} ${b.tagName} assignment: ${g(b)}`,
            onClick: () => u(b.key),
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
            b.assignment.map(({ slot: h, performer: I }) => {
              const x = h.label || `Slot ${h.sortOrder + 1}`;
              return n("span", {
                key: h.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${x}: ${I.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${x}: ${I.name}`
                }, `${x}: ${I.name}`),
                n(Vn, {
                  key: "avatar",
                  performer: { id: I.performerId, name: I.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(_t, { key: "states", counts: b.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(b.candidates),
            "aria-label": `Auto-Assign ${b.tagName}: ${g(b)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${b.candidates.length})`)
        ]),
        s.has(b.key) ? n(
          "div",
          { key: "segments", id: f(b), className: "divide-y divide-border/70" },
          b.candidates.map((h) => {
            const I = h.endSec == null ? Ce(h.startSec) : `${Ce(h.startSec)} – ${Ce(h.endSec)}`, x = `${At(h.sourceKey)}${h.confidence == null ? "" : ` · ${Math.round(h.confidence * 100)}%`}`;
            return n("div", {
              key: h.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(an, { key: "review", state: h.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                h.tagName || "Tag segment"
              ),
              n(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                I
              ),
              n("span", {
                key: "provenance",
                className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                title: x
              }, x)
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
function Wd({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => vt(d, { onCancel: r, onConfirm: t })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: Et,
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
function Vd({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = F(!1), d = pe(null);
  if (co({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Ce(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && a();
    },
    onKeyDownCapture: (m) => vt(m, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: Et,
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
        `${Ce(e.startSec)} – ${c}`
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
function Jd(e) {
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
function Yd({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var u, y;
  const l = e ? e.createCount + e.linkCount : 0, d = pe(null);
  co({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((u = e == null ? void 0 : e.outputs) == null ? void 0 : u.slice(0, 200)) || [], m = Jd(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !r && s();
    },
    onKeyDownCapture: (g) => vt(g, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: Et,
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
        ].flatMap(([g, f]) => [
          n("dt", { key: `${g}:label`, className: "text-secondary" }, g),
          n("dd", { key: `${g}:value`, className: "font-semibold text-foreground" }, String(f))
        ])),
        e.conflictCount > 0 ? n(
          "p",
          { key: "conflicts", role: "status", className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground" },
          `${e.conflictCount} existing derivation ${e.conflictCount === 1 ? "branch was" : "branches were"} skipped because its lineage no longer matches the active rule. Resolve these through lineage maintenance.`
        ) : null,
        m.length ? n("div", { key: "outputs", className: "space-y-2" }, [
          ...m.map((g) => n("article", {
            key: g.key,
            className: "rounded-md border border-border bg-surface p-3"
          }, [
            n("div", { key: "root", className: "flex min-w-0 items-center gap-2" }, [
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
                `${g.rootTagName} @ ${Ce(g.rootStartSec)}`
              ),
              n(
                "span",
                { key: "count", className: "shrink-0 text-xs font-medium text-secondary" },
                `${g.outputs.length} ${g.outputs.length === 1 ? "change" : "changes"}`
              )
            ]),
            n(
              "div",
              { key: "tree", className: "mt-2 space-y-1 border-l border-border pl-2" },
              g.outputs.map((f, b) => n("div", {
                key: `${f.ruleId}:${f.depth}:${b}`,
                className: "flex min-w-0 items-center gap-2 text-sm",
                style: { marginLeft: `${Math.max(0, f.depth - 1) * 1.25}rem` }
              }, [
                n("span", { key: "branch", "aria-hidden": "true", className: "shrink-0 text-secondary" }, "↳"),
                n(
                  "span",
                  { key: "tags", className: "min-w-0 flex-1 truncate text-foreground" },
                  `${f.sourceTagName} → ${f.derivedTagName}`
                ),
                n("span", { key: "depth", className: "shrink-0 text-[11px] text-secondary" }, `Level ${f.depth}`),
                n(
                  "span",
                  { key: "action", className: "shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-foreground" },
                  f.action === "create" ? "Create" : "Link existing"
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
function Qd({
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
  selectedPerformerSlots: u,
  performerSlots: y,
  detail: g,
  video: f,
  slotButtonRef: b,
  tagSearchRef: h,
  onDetailChange: I,
  setSaveMessage: x,
  setSavingSegmentId: C,
  onSlotsChanged: O,
  onRecordHistory: w,
  onCancelQueuedReview: B,
  splitSegment: T,
  duplicateSegment: N,
  provenance: D,
  lineage: M,
  onNavigateLineageItem: q,
  tagEditing: re,
  onCancelTagEditing: Y,
  detailPanelRef: $,
  onReduceSelection: E
}) {
  var oe, be, me, Q;
  const z = pe(null), G = pe(null), W = pe(null), ie = pe(null), le = pe(null), [K, te] = F(!1);
  ye(() => {
    z.current && (z.current.scrollTop = 0), te(!1);
  }, [t == null ? void 0 : t.id]), ye(() => {
    var P, ne;
    K && ((ne = (P = G.current) == null ? void 0 : P.querySelector("input, select, button")) == null || ne.focus({ preventScroll: !0 }));
  }, [K]);
  function de() {
    te(!1), requestAnimationFrame(() => {
      var P;
      return (P = b.current) == null ? void 0 : P.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const P = !r.some((fe) => fe.isDerived), ne = e && m ? zl(y, r) : null, ke = (ne == null ? void 0 : ne.map((fe, U) => {
      var A;
      const Re = r[U];
      return {
        segmentId: Re.nativeSegmentId,
        itemId: Re.published ? null : Re.itemId,
        revision: (A = g.performerSlotRevisions) == null ? void 0 : A[Re.id],
        slots: fe
      };
    })) || [];
    return n(to.Fragment, null, [
      n(Md, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: $,
        onReduceSelection: E,
        reviewable: e,
        tagEditable: P,
        slotsEditable: ke.length > 0 && a == null,
        onEditSlots: () => te(!0),
        slotButtonRef: b,
        saveMessage: i
      }),
      re && P ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (fe) => {
          fe.target === fe.currentTarget && Y();
        },
        onKeyDownCapture: (fe) => vt(fe, { onCancel: Y })
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
        n(_n, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (fe, U) => fe == null ? Y() : l(fe, U == null ? void 0 : U.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: Y,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      K && ke.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (fe) => {
          fe.target === fe.currentTarget && de();
        },
        onKeyDownCapture: (fe) => {
          var Re, A;
          if (!(typeof ((Re = fe.target) == null ? void 0 : Re.closest) == "function" ? fe.target.closest("input, textarea, select, [contenteditable='true']") : null) && !fe.repeat && !fe.ctrlKey && !fe.altKey && !fe.metaKey && !fe.shiftKey && /^[1-9]$/.test(fe.key) && ((A = le.current) != null && A.call(le, Number(fe.key) - 1))) {
            fe.preventDefault(), fe.stopPropagation();
            return;
          }
          vt(fe, { onCancel: de });
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
          n("button", { key: "close", type: "button", onClick: de, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n($d, {
          videoId: f.id,
          targets: ke,
          performerCandidates: g.performerCandidates || [],
          shortcutRef: le,
          onSaved: async ({ beforeState: fe, afterState: U }) => {
            await w(
              "performer-slots.assign",
              `Assigned performers to ${ke.length} segments`,
              fe,
              U
            ), de(), O();
          },
          onConflict: O
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (P) => {
      z.current = P, $ && ($.current = P);
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
        t && re ? n("div", {
          key: "tag-editor",
          ref: h,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (P) => {
            P.key === "Escape" && (P.preventDefault(), P.stopPropagation(), Y());
          },
          onKeyDown: (P) => {
            Bl(P, t.tagName) && (P.preventDefault(), P.stopPropagation(), l(t.tagId));
          }
        }, n(_n, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (P, ne) => P == null ? Y() : l(P, ne == null ? void 0 : ne.label),
          disabled: nl(a, t.id, s) || ((oe = M.data) == null ? void 0 : oe.tagReadOnly) === !0,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? n("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : n("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? n("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        n("span", { key: "start" }, Ce(t.startSec)),
        t.endSec == null ? null : n("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : n("span", { key: "end" }, Ce(t.endSec))
      ]) : null,
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(Id, { status: c })) : null,
      t && m && u.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(ui, {
        assignments: u.map((P) => {
          const ne = Wl(P);
          return {
            key: String(P.slotDefinitionId),
            label: ne.label,
            performer: ne.filled ? { id: Number(P.performerId), name: ne.performer } : null,
            title: ne.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(Rd, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: D
    }) : null,
    t ? n("div", { key: "controls", hidden: !0 }, [
      n("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        n("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        M.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : M.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, M.error) : M.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${M.data.derived ? "Derived segment" : "Root segment"} · ${M.data.componentSize} segment${M.data.componentSize === 1 ? "" : "s"} · ${M.data.integrityState}`
          ),
          (be = M.data.parents) != null && be.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...M.data.parents.map((P) => n("button", {
              key: P.nodeId,
              type: "button",
              onClick: () => q(P.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${P.ruleKey} ${P.ruleVersion}`))
          ]) : null,
          (me = M.data.children) != null && me.length ? n("p", { key: "children" }, `Children: ${M.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: b,
          type: "button",
          disabled: a != null || !m || u.length === 0,
          onClick: () => te(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: m ? u.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, u.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: T,
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
    K && e && t && m && u.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (P) => {
        P.target === P.currentTarget && de();
      },
      onKeyDownCapture: (P) => {
        var ke, fe;
        if (!(typeof ((ke = P.target) == null ? void 0 : ke.closest) == "function" ? P.target.closest("input, textarea, select, [contenteditable='true']") : null) && !P.repeat && !P.ctrlKey && !P.altKey && !P.metaKey && !P.shiftKey && /^[1-9]$/.test(P.key) && ((fe = ie.current) != null && fe.call(ie, Number(P.key) - 1))) {
          P.preventDefault(), P.stopPropagation();
          return;
        }
        vt(P, {
          onCancel: de,
          onConfirm: () => {
            var U;
            return (U = W.current) == null ? void 0 : U.click();
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
        n("button", { key: "close", type: "button", onClick: de, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Cd, {
        key: `${t.id}:${g.performerSlotsRevision || g.slotRevision || ""}`,
        videoId: f.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: u,
        revision: (Q = g.performerSlotRevisions) == null ? void 0 : Q[t.id],
        performerCandidates: g.performerCandidates || [],
        confirmRef: W,
        shortcutRef: ie,
        onOptimisticSave: (P) => {
          I((ne) => Kr(
            ne,
            t.id,
            P
          ), f.id), C(t.id), x("Saving performer slots…"), de();
        },
        onSaved: async (P, { beforeState: ne, afterState: ke }) => {
          I((fe) => Kr(
            fe,
            t.id,
            P.slots || [],
            P.revision
          ), f.id), x("Performer slots saved.");
          try {
            await w(
              "performer-slots.assign",
              "Assigned performers",
              ne,
              ke
            ), await O(P) || B([t]);
          } finally {
            C(null);
          }
        },
        onRollback: async (P, ne) => {
          B([t]), I((ke) => {
            var fe;
            return Kr(
              ke,
              t.id,
              P,
              (fe = g.performerSlotRevisions) == null ? void 0 : fe[t.id]
            );
          }, f.id), x(ne.message || "Unable to save performer slots.");
          try {
            ne.status === 409 && await O();
          } finally {
            C(null);
          }
        },
        onConflict: O
      }))
    ])) : null
  ]);
}
function Zd({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: m, onZoomChange: u, onSelectGroup: y, onToggleGroup: g, onSelect: f, onSelectSegments: b, onSelectAll: h, onConfigureTag: I, onSeekTime: x, centerRef: C, showReviewState: O = !0, swimlaneTitleWidth: w, onSwimlaneTitleWidthChange: B }) {
  const T = pe(null), N = pe(null), [D, M] = F(0), [q, re] = F({ scrollTop: 0, height: 320 }), [Y, $] = F(null), E = _e(
    () => rn(e, r, o),
    [e, r, o]
  ), z = _e(
    () => li(o),
    [o]
  ), G = _e(() => go(E), [E]), W = _e(
    () => Zl(G, i, r.length > 0),
    [G, i, r.length]
  ), ie = _e(
    () => di(W.rows, Math.max(0, q.scrollTop - 24), q.height),
    [W, q]
  ), le = Math.max(0, Number(d) || 0), K = ks(D), te = yr(w, K), de = te / 16, oe = xs(c, le, de), be = fs(le), me = ys(le, Math.max(1, D - de * 16), m), Q = be.filter((S, p) => p === 0 || p % me === 0), P = _e(() => E.map((S) => `${S.key}:${S.trackCount}:${S.markers.map(({ segment: p, track: k }) => `${p.id}:${p.startSec}:${p.endSec ?? ""}:${k}`).join(",")}`).join("|"), [E]);
  function ne() {
    const S = N.current;
    if (!S) return;
    const p = S.querySelector("[data-timeline-track]"), k = S.firstElementChild, H = p == null ? void 0 : p.getBoundingClientRect(), J = k == null ? void 0 : k.getBoundingClientRect(), _ = H && J ? Math.max(0, H.left - J.left) : de * 16, ue = (J == null ? void 0 : J.width) ?? S.scrollWidth;
    S.scrollTo({
      left: vs(c, le, ue, S.clientWidth, _, Fa),
      behavior: "smooth"
    });
  }
  ye(() => (C.current = ne, () => {
    C.current === ne && (C.current = null);
  })), ye(() => {
    ne();
  }, [m]);
  function ke() {
    const S = N.current, p = W.rows.find((ue) => ue.kind === "lane" && ue.lane.markers.some(({ segment: R }) => R.id === s));
    if (!S || !p) return;
    const k = 24, H = p.top + k, J = H + p.height;
    let _ = S.scrollTop;
    H < S.scrollTop + k ? _ = Math.max(0, H - k) : J > S.scrollTop + S.clientHeight && (_ = Math.max(0, J - S.clientHeight)), _ !== S.scrollTop && (S.scrollTop = _), re({ scrollTop: _, height: S.clientHeight });
  }
  ye(() => {
    ke();
  }, [s, P, W]), ye(() => {
    const S = N.current, p = W.rows.find((ue) => ue.kind === "group" && ue.group.key === a);
    if (!S || !p) return;
    const k = 24, H = p.top + k, J = H + p.height;
    let _ = S.scrollTop;
    H < S.scrollTop + k ? _ = Math.max(0, H - k) : J > S.scrollTop + S.clientHeight && (_ = Math.max(0, J - S.clientHeight)), _ !== S.scrollTop && (S.scrollTop = _), re({ scrollTop: _, height: S.clientHeight });
  }, [a, W]), ye(() => {
    const S = N.current;
    if (!S || typeof ResizeObserver > "u") return;
    const p = () => {
      M(S.clientWidth), re({ scrollTop: S.scrollTop, height: S.clientHeight }), ke();
    }, k = new ResizeObserver(p);
    return k.observe(S), p(), () => k.disconnect();
  }, [s, P, W]);
  function fe(S) {
    if (!(le > 0)) return;
    const p = S.currentTarget.getBoundingClientRect(), k = Math.min(1, Math.max(0, (S.clientX - p.left) / p.width));
    x(k * le);
  }
  function U(S) {
    const p = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let k = null;
    Object.hasOwn(p, S.key) && (k = c + p[S.key]), S.key === "Home" && (k = 0), S.key === "End" && (k = le), k != null && (S.preventDefault(), S.stopPropagation(), x(Math.min(le, Math.max(0, k))));
  }
  function Re(S) {
    var k;
    const p = (k = T.current) == null ? void 0 : k.getBoundingClientRect();
    p && B(yr(S.clientX - p.left, K));
  }
  function A(S) {
    const p = S.shiftKey ? 40 : 16;
    let k = null;
    S.key === "ArrowLeft" && (k = te - p), S.key === "ArrowRight" && (k = te + p), S.key === "Home" && (k = 160), S.key === "End" && (k = K), k != null && (S.preventDefault(), S.stopPropagation(), B(yr(k, K)));
  }
  const v = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
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
          (S.metaKey || S.ctrlKey) && (S.preventDefault(), h == null || h());
        },
        onKeyDown: (S) => {
          S.key !== "Enter" && S.key !== " " || (S.preventDefault(), h == null || h());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: v, disabled: m <= 1, onClick: () => u(hr(m - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: v, disabled: m === 1, onClick: () => u(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(m * 100)}%`),
      n("button", { key: "in", type: "button", className: v, disabled: m >= 8, onClick: () => u(hr(m + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: v, onClick: ne, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(K),
      "aria-valuenow": Math.round(te),
      "aria-valuetext": `${Math.round(te)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (S) => {
        S.currentTarget.setPointerCapture(S.pointerId), Re(S);
      },
      onPointerMove: (S) => {
        S.currentTarget.hasPointerCapture(S.pointerId) && Re(S);
      },
      onKeyDown: A,
      onDoubleClick: () => B(ht.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${te - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: N,
      onScroll: (S) => re({
        scrollTop: S.currentTarget.scrollTop,
        height: S.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: Ss(m) }, [
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
          "aria-valuemax": le,
          "aria-valuenow": Math.min(le, Math.max(0, c)),
          "aria-valuetext": Ce(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: fe,
          onKeyDown: U
        }, Q.map((S, p) => n("span", {
          key: S,
          className: `absolute top-0 ${bs(p, Q.length, le > 0 ? S / le * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: hs(p, Q.length, le > 0 ? S / le * 100 : 0)
        }, Ce(S))).concat(t.map((S) => {
          const p = le > 0 ? S.startSec / le * 100 : 0;
          return n("button", {
            key: `shot-boundary:${S.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Ce(S.startSec)} – ${Ce(S.endSec)}`,
            title: `Shot boundary · ${S.source || "manual"} · ${Ce(S.startSec)} – ${Ce(S.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${p}%`, width: "2px" },
            onClick: (k) => {
              k.stopPropagation(), x(S.startSec);
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
            ...Uo(oe),
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
        style: E.length > 0 ? { height: W.height } : void 0
      }, [
        E.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...Uo(oe, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        E.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : ie.map((S) => {
          var ee;
          const p = S.group, k = i.includes(p.key), H = a === p.key, J = wr(H);
          if (S.kind === "group") return n("div", {
            key: S.key,
            "data-segment-group": p.key,
            "data-segment-group-collapsed": k ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${de}rem minmax(0,1fr)`,
              backgroundColor: J,
              top: S.top,
              height: S.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (V) => {
                if (V.metaKey || V.ctrlKey) {
                  b(p.lanes.flatMap((ge) => ge.markers.map((xe) => xe.segment.id)));
                  return;
                }
                y(p.key), g(p.key);
              },
              "aria-expanded": !k,
              "aria-current": H ? "true" : void 0,
              "data-selected-timeline-group": H ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: p.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: J
              },
              title: `${k ? "Expand" : "Collapse"} ${p.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, k ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, p.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              k ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${p.lanes.length} swimlane${p.lanes.length === 1 ? "" : "s"} hidden`
                ),
                O ? n(_t, { key: "states", counts: p.counts }) : null
              ] : null
            )
          ]);
          const _ = S.lane, ue = Ol(S.laneIndex), R = _.markers.some(({ segment: V }) => V.id === s);
          return n("div", {
            key: S.key,
            "data-grouped-swimlane": p.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${de}rem minmax(0,1fr)`,
              top: S.top,
              height: S.height,
              backgroundColor: ue
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": R ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: Pl(R, ue),
              title: `${Wn(_)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Wn(_),
              onClick: (V) => {
                (V.metaKey || V.ctrlKey) && b(_.markers.map((ge) => ge.segment.id));
              },
              onMouseEnter: () => $(_.key),
              onMouseLeave: () => $((V) => V === _.key ? null : V)
            }, [
              _.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (V) => {
                  V.stopPropagation(), I({ tagId: _.tagId, tagName: _.label, trigger: V.currentTarget });
                },
                "aria-label": `Configure ${_.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: Y === _.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, _.label),
              (ee = _.performers) != null && ee.length ? n(Ir, {
                key: "performers",
                performers: _.performers,
                performerAssignments: _.performerAssignments
              }) : null,
              O ? n(_t, { key: "counts", counts: _.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, _.markers.map(({ segment: V, track: ge }) => {
              var st;
              const xe = _r(V.startSec, le), qe = V.endSec == null ? V.startSec : Math.max(V.startSec, V.endSec), Ie = Math.max(0, _r(qe, le) - xe), We = l.includes(V.id), Fe = V.id === s, Ne = mo(z.get(V.id)), Ee = V.endSec == null ? Ce(V.startSec) : `${Ce(V.startSec)} – ${Ce(V.endSec)}`, at = (st = ii[Ne]) == null ? void 0 : st.label;
              return n("button", {
                key: V.id,
                type: "button",
                onClick: (Z) => {
                  Z.stopPropagation(), f(V, {
                    additive: Z.metaKey || Z.ctrlKey,
                    rangeSegmentIds: Z.shiftKey ? _.markers.map((ce) => ce.segment.id) : null
                  });
                },
                "aria-pressed": We,
                "aria-current": Fe ? "true" : void 0,
                "data-selected-timeline-marker": Fe ? "true" : void 0,
                "data-selected-segment-shortcut-target": Fe ? "true" : void 0,
                "aria-label": O ? `${V.tagName || "Tag segment"}${_.performerLabel ? `, ${_.performerLabel}` : ""}, ${V.reviewState}${at ? `, ${at}` : ""}, ${Ee}` : `${V.tagName || "Tag segment"}${_.performerLabel ? `, ${_.performerLabel}` : ""}, ${Ee}`,
                title: O ? `${V.tagName || "Tag segment"}${_.performerLabel ? ` · ${_.performerLabel}` : ""} · ${V.reviewState}${at ? ` · ${at}` : ""} · ${Ee}` : `${V.tagName || "Tag segment"}${_.performerLabel ? ` · ${_.performerLabel}` : ""} · ${Ee}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...O ? Ml(V.reviewState, We, Ne, Fe) : El(We, Fe),
                  left: `${xe}%`,
                  top: `${Ll(ge)}rem`,
                  width: Dl(V.endSec, Ie),
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
function fo({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = F(null), [l, d] = F([]), [c, m] = F(null), [u, y] = F(""), [g, f] = F(!0), [b, h] = F(null), [I, x] = F(""), [C, O] = F(!1), w = pe(null), B = pe(0);
  ye(() => {
    const Y = requestAnimationFrame(() => {
      var $;
      return ($ = w.current) == null ? void 0 : $.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(Y);
  }, [e]), ye(() => {
    const Y = new AbortController();
    return f(!0), x(""), Promise.all([
      r ? X(`/slot-definitions/${e}`, { signal: Y.signal }) : Promise.resolve(null),
      X("/segment-groups", { signal: Y.signal })
    ]).then(([$, E]) => {
      const z = E.find((G) => (G.tags || []).some((W) => Number(W.tagId) === Number(e)));
      s($), d(E), m((z == null ? void 0 : z.id) ?? null), y(z == null ? "" : String(z.id)), O(!1);
    }).catch(($) => {
      $.name !== "AbortError" && x($.message || "Unable to load tag configuration.");
    }).finally(() => {
      Y.signal.aborted || f(!1);
    }), () => Y.abort();
  }, [r, e]);
  function T(Y, $) {
    s({
      ...a,
      definitions: a.definitions.map((E, z) => z === Y ? { ...E, ...$ } : E)
    });
  }
  function N(Y, $) {
    const E = Y + $;
    if (E < 0 || E >= a.definitions.length) return;
    const z = [...a.definitions];
    [z[Y], z[E]] = [z[E], z[Y]], s({
      ...a,
      definitions: z.map((G, W) => ({ ...G, sortOrder: W }))
    });
  }
  function D(Y) {
    const $ = a.definitions[Y], E = Number($.assignmentCount) || 0, z = E === 0 ? "" : ` and its ${E} assignment${E === 1 ? "" : "s"}`;
    window.confirm(`Delete “${ft($)}”${z}?`) && (E > 0 && O(!0), s({
      ...a,
      definitions: a.definitions.filter((G, W) => W !== Y).map((G, W) => ({ ...G, sortOrder: W }))
    }));
  }
  async function M() {
    var $;
    h("slots"), x("Saving performer slots…");
    let Y;
    try {
      Y = await X(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: C,
          definitions: a.definitions.map((E, z) => {
            var G;
            return {
              id: E.id || void 0,
              label: ((G = E.label) == null ? void 0 : G.trim()) || null,
              sortOrder: z,
              genderHints: E.genderHints || []
            };
          })
        })
      }), s(Y), O(!1);
    } catch (E) {
      E.status === 409 ? (x("Performer slots changed elsewhere; current values were reloaded."), ($ = E.payload) != null && $.current && (s(E.payload.current), O(!1))) : x(E.message || "Unable to save performer slots."), h(null);
      return;
    }
    try {
      await o(), x("Performer slots saved.");
    } catch {
      x("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      h(null);
    }
  }
  async function q() {
    const Y = u === "" ? null : Number(u);
    if (Y !== c) {
      h("group"), x("Saving tag group…");
      try {
        await X(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: Y })
        });
      } catch ($) {
        x($.message || "Unable to assign the tag group."), h(null);
        return;
      }
      try {
        const [$, E] = await Promise.allSettled([
          X("/segment-groups"),
          o()
        ]);
        if ($.status === "fulfilled") {
          d($.value);
          const z = $.value.find((W) => (W.tags || []).some((ie) => Number(ie.tagId) === Number(e))), G = (z == null ? void 0 : z.id) ?? null;
          m(G), y(G == null ? "" : String(G));
        }
        x(
          $.status === "fulfilled" && E.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        h(null);
      }
    }
  }
  l.find((Y) => Number(Y.id) === Number(c));
  const re = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (Y) => {
      Y.target === Y.currentTarget && !b && i();
    },
    onKeyDownCapture: (Y) => vt(Y, {
      onCancel: b ? void 0 : i
    })
  }, n("section", {
    ref: w,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: Et,
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
        g ? null : n("label", { key: "choice", className: "block space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Assigned group"),
          n("select", {
            key: "select",
            value: u,
            disabled: b != null,
            onChange: (Y) => y(Y.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((Y) => n("option", { key: Y.id, value: String(Y.id) }, Y.name))
          ])
        ]),
        g ? null : n("button", {
          key: "save",
          type: "button",
          disabled: b != null || (u === "" ? null : Number(u)) === c,
          onClick: q,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, b === "group" ? "Saving…" : "Save tag group")
      ]),
      r ? n("section", { key: "slots", className: "space-y-3 border-t border-border pt-5", "aria-labelledby": "inline-tag-slots-heading" }, [
        n("div", { key: "heading" }, [
          n("h3", { key: "title", id: "inline-tag-slots-heading", className: "text-sm font-semibold text-foreground" }, "Performer slots"),
          n("p", { key: "copy", className: "text-xs text-secondary" }, "Define the ordered performer roles used by this tag.")
        ]),
        g ? n("p", { key: "loading", className: "rounded-md border border-dashed border-border p-4 text-sm text-secondary" }, "Loading performer slots…") : a ? n("div", { key: "editor", className: "space-y-3" }, [
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
          ...(a.definitions || []).map((Y, $) => n("article", {
            key: Y.id || Y._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: Y.label || "",
                disabled: b != null,
                onChange: (E) => T($, { label: E.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, us.map((E) => n("label", { key: E, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: b != null,
                  checked: (Y.genderHints || []).includes(E),
                  onChange: (z) => T($, {
                    genderHints: z.target.checked ? [.../* @__PURE__ */ new Set([...Y.genderHints || [], E])] : (Y.genderHints || []).filter((G) => G !== E)
                  })
                }),
                n("span", { key: "text" }, Nr(E))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${Y.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: b != null || $ === 0, onClick: () => N($, -1), className: re, "aria-label": `Move ${ft(Y)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: b != null || $ === a.definitions.length - 1, onClick: () => N($, 1), className: re, "aria-label": `Move ${ft(Y)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: b != null, onClick: () => D($), className: `${re} text-red-300` }, "Delete")
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
              className: re
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: b != null,
              onClick: M,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, b === "slots" ? "Saving…" : "Save performer slots")
          ])
        ]) : null
      ]) : null,
      I ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, I) : null
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
function Xd(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function ec(e) {
  const { activeFilterCount: t, allSwimlanes: r, analysisError: o, analysisRun: i, analysisStatus: a, approvalFacetCounts: s, autoAssignCandidates: l, autoAssignError: d, autoAssignOpen: c, autoAssignPerformers: m, autoAssigning: u, cancelQueuedReviewsForSegments: y, canMoveSelectionToBin: g, captureTrainingExport: f, centerTimelineRef: b, closeEditorFilters: h, closeFirstSegmentTagDialog: I, closeMaterializeDialog: x, closeMergeConfirmation: C, closePublishApprovedDialog: O, closeTagEditing: w, collapsedSegmentGroups: B, commonActionsRef: T, compatibilityMode: N, configuringTag: D, createSegment: M, creatingSegmentId: q, currentTime: re, deleteRejectedSegments: Y, detail: $, detailPanelRef: E, detailWidth: z, duplicateSegment: G, editorFilters: W, editorLayout: ie, editorRef: le, exportingExamples: K, filtersButtonRef: te, filtersOpen: de, firstSegmentTagOpen: oe, focusRowRef: be, handleSeparatorKeyDown: me, handleSeparatorPointerDown: Q, handleSeparatorPointerMove: P, hasNextUnreviewed: ne, hasPreviousUnreviewed: ke, hideDerivedSegments: fe, history: U, historyOpen: Re, historySaving: A, horizontalLayoutSize: v, importNativeSegments: S, incorrectExamples: p, incorrectExamplesOpen: k, lineage: H, markerRailWidth: J, materializeButtonRef: _, materializeCancelButtonRef: ue, materializeDerivedSegments: R, materializeError: ee, materializeLoading: V, materializeOpen: ge, materializePreview: xe, materializing: qe, mediaStackRef: Ie, mergeCancelButtonRef: We, mergeConfirmation: Fe, mergeSavingRef: Ne, mergeSelectedSwimlane: Ee, nativeImportState: at, onDetailChange: st, onNavigate: Z, onReload: ce, onSlotsChanged: je, openPublishApprovedDialog: De, panelSeparatorProps: he, pendingInitialSeekRef: He, performerSlots: ze, performerSlotsAvailable: ve, playbackControlsRef: $e, previewDerivedSegments: Te, provenance: Me, provenanceSources: Ge, publishApprovedCancelButtonRef: Ue, publishApprovedDrafts: lt, publishApprovedError: Ke, publishApprovedOpen: Se, quickSearchOpen: Ze, railScrollRef: nt, railToggleRef: Xe, recordHistoryAction: Ae, rejectedDeletionPreview: we, removeIncorrectExample: Ve, removingExampleId: yt, restoreHistoryTarget: it, runEditorAction: jt, saveMessage: rt, saveTag: Bt, saveTiming: Wt, savingSegmentId: bt, seekRef: Gt, segmentGroups: Ut, segmentRailLayout: $r, segments: Kt, selectAllVideoSegments: sn, selectSegment: ln, selectSegmentCollection: Sn, selectedGroups: kn, selectedPerformerSlots: Tr, selectedSegment: Dt, selectedSegmentGroupKey: Vt, selectedSegmentIds: wn, selectedSegments: Ot, selectedSlotStatus: Jt, setAutoAssignError: dn, setAutoAssignOpen: Nn, setConfiguringTag: Zn, setCurrentTime: Xn, setEditorFilters: Ar, setEditorLayout: In, setFiltersOpen: Cn, setHideDerivedSegments: er, setHistoryOpen: Yt, setIncorrectExamplesOpen: tr, setQuickSearchOpen: $n, setRailViewport: Tn, setRejectedDeletionPreview: Qt, setSaveMessage: An, setSavingSegmentId: Rn, setSelectedSegmentGroupKey: ct, setSelectedSegmentId: nr, setShortcutsOpen: cn, setTimelineZoom: rr, shotBoundaries: or, shortcutsOpen: Mn, slotButtonRef: En, splitLayout: Pt, splitSegment: Rr, startFullAnalysis: ar, stepVideoFrame: un, tagEditing: Dn, tagSearchRef: On, timelineDuration: Qe, timelineRatioBounds: Ye, timelineZoom: Mr, toggleSegmentGroup: ir, toggleSegmentRail: Nt, updateTimelineRatio: xt, video: ot, videoPerformers: mn, visibleCounts: Pn, visibleSegmentRailRows: Ln, visibleSegments: Fn, wideLayout: Zt, workspaceRef: sr } = e, lr = _e(
    () => Kt.filter((j) => !j.published && j.reviewState === "approved"),
    [Kt]
  ), dr = ss(no), Xt = lr.length, It = xe ? xe.createCount + xe.linkCount : null, Rt = bt != null, en = Ot.length > 0, jn = Ot.length === 1, Er = en && Ot.every((j) => j.reviewState === "approved"), Dr = en && Ot.every((j) => j.reviewState === "rejected"), ut = [
    { id: "marker.create", label: "New segment", disabled: Rt },
    { id: "marker.editTag", label: "Edit tag", disabled: Rt || !en },
    { id: "marker.setStart", label: "Set start", disabled: Rt || !jn },
    { id: "marker.setEnd", label: "Set end", disabled: Rt || !jn },
    { id: "marker.split", label: "Split", disabled: Rt || !jn },
    ...N ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !ke, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Er ? "Unapprove" : "Approve", disabled: Rt || !en, tone: "approve" },
      { id: "marker.reject", label: Dr ? "Unreject" : "Reject", disabled: Rt || !en, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !ne, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...N ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: Rt || !g, tone: "reject" }
    ]
  ];
  function gn(j) {
    const Pe = wn.includes(j.id), mt = j.id === (Dt == null ? void 0 : Dt.id), dt = j.endSec == null ? Ce(j.startSec) : `${Ce(j.startSec)} – ${Ce(j.endSec)}`, zt = `${At(j.sourceKey)}${j.confidence != null ? ` · ${Math.round(j.confidence * 100)}%` : ""}`;
    return n("button", {
      key: j.id,
      type: "button",
      onClick: (Mt) => ln(j, { additive: Mt.metaKey || Mt.ctrlKey }),
      "aria-pressed": Pe,
      "aria-current": mt ? "true" : void 0,
      "data-selected-segment-shortcut-target": mt ? "true" : void 0,
      "aria-label": N ? `${j.tagName || "Tag segment"}, ${j.reviewState}${j.isDerived ? ", derived segment" : ""}, ${dt}` : `${j.tagName || "Tag segment"}${j.isDerived ? ", derived segment" : ""}, ${dt}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: ai(Pe, mt)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        N ? n(an, { key: "review", state: j.reviewState, includeLabel: !1 }) : null,
        j.isDerived ? n(Cr, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          j.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, dt),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: zt
        }, zt)
      ])
    ]);
  }
  const ae = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", St = [...U.actions || []].reverse().find((j) => j.sequence <= U.cursorSequence);
  return n("section", {
    ref: le,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${Pt ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (j) => fi(j, Z, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${ot.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: ot.title || `Video ${ot.id}`
          }, ot.title || `Video ${ot.id}`)),
          ...mn.map((j) => n(Vn, {
            key: tt(j),
            performer: { id: tt(j), name: j.name },
            compact: !0,
            tooltip: j.name
          })),
          N ? n(_t, { key: "review-counts", counts: Pn }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          N ? null : n(hi, { key: "bin", onNavigate: Z, compact: !0 }),
          n(vi, { key: "settings", onNavigate: Z, compact: !0 })
        ])
      ]),
      N && $.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${$.nativeImportCount} Cove segment${$.nativeImportCount === 1 ? "" : "s"} ${$.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        at.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, at.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => S("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => S("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        at.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, at.error) : null
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
              onClick: () => ar(),
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
              }, n(Ra, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([j, Pe]) => n("button", {
                key: j,
                type: "button",
                disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                onClick: (mt) => {
                  var dt;
                  (dt = mt.currentTarget.closest("details")) == null || dt.removeAttribute("open"), ar(Pe);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, j)))
            ])
          ]) : null,
          N ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: bt != null || l.length === 0,
            onClick: () => {
              dn(""), Nn(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${l.length ? ` (${l.length})` : ""}`) : null,
          N ? n("button", {
            key: "materialize-derived",
            ref: _,
            type: "button",
            disabled: bt != null || V || qe || It === 0,
            onClick: Te,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, V ? "Analyzing…" : `Auto-Materialize${It != null ? ` (${It})` : ""}`) : null,
          N ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: bt != null || Xt === 0,
            onClick: (j) => De(j.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": Se,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${Xt ? ` (${Xt})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: K || yt != null || p.length === 0,
            onClick: () => tr(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": k,
            "aria-label": `Open AI feedback collection, ${p.length} example${p.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${p.length ? ` (${p.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: te,
            type: "button",
            onClick: () => Cn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": de,
            className: `${ae} ${t ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(pr, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${t ? ` (${t})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => cn(!0),
            className: ae
          }, [n(pr, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: (N ? U.actions.length === 0 : St == null) || bt != null || A,
            onClick: N ? () => Yt((j) => !j) : () => it(
              St.sequence - 1
            ),
            "aria-haspopup": N ? "dialog" : void 0,
            "aria-expanded": N ? Re : void 0,
            className: ae
          }, [
            n(pr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, N ? `History${U.actions.length ? ` (${U.actions.length})` : ""}` : St ? `Undo ${St.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: Xe,
            type: "button",
            onClick: Nt,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": ie.markerRailOpen,
            className: ae
          }, [
            n(pr, { key: "icon", name: "list" }),
            n("span", { key: "label" }, ie.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    N && Re ? n("section", {
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
          onClick: () => Yt(!1),
          className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
        }, "Close")
      ]),
      n("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
        ...[...U.actions].reverse().map((j) => n("button", {
          key: j.sequence,
          type: "button",
          disabled: A,
          onClick: () => it(j.sequence),
          "aria-current": U.cursorSequence === j.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${j.sequence > U.cursorSequence ? "text-secondary" : "text-foreground"} ${U.cursorSequence === j.sequence ? "bg-accent/15" : ""}`
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
          disabled: A,
          onClick: () => it(U.baselineSequence),
          "aria-current": U.cursorSequence === U.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${U.cursorSequence === U.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    de ? n(Gd, {
      key: "editor-filters",
      filters: W,
      hideDerivedSegments: fe,
      performers: mn,
      provenanceSources: Ge,
      reviewCounts: s,
      segments: Kt,
      segmentGroups: Ut,
      reviewMode: N,
      onChange: Ar,
      onHideDerivedChange: er,
      onClose: h
    }) : null,
    oe ? n(Bd, {
      key: "first-segment-tag-dialog",
      saving: bt != null,
      error: rt,
      onSelect: (j, Pe) => M(j, Pe),
      onClose: I
    }) : null,
    Ze ? n(zd, {
      key: "quick-search-dialog",
      segments: wl(r),
      onSelect: (j) => {
        $n(!1), ln(j, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        $n(!1), requestAnimationFrame(() => {
          var j;
          return (j = le.current) == null ? void 0 : j.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    c ? n(qd, {
      key: "auto-assign-dialog",
      candidates: l,
      processing: u,
      error: d,
      onConfirm: m,
      onClose: () => Nn(!1)
    }) : null,
    Fe ? n(Vd, {
      key: "merge-selection-dialog",
      merge: Fe,
      processing: Ne.current,
      undoable: !N,
      cancelButtonRef: We,
      onConfirm: (j) => Ee(!0, j, Fe),
      onClose: C
    }) : null,
    ge ? n(Yd, {
      key: "materialize-derived-dialog",
      preview: xe,
      loading: V,
      processing: qe,
      error: ee,
      cancelButtonRef: ue,
      onConfirm: R,
      onClose: () => {
        qe || x();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: sr,
      className: `${Pt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      ie.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: Zt ? { position: "absolute", top: 0, right: 0, width: J, height: v.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        Kt.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : Fn.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: nt,
          onScroll: (j) => Tn({
            scrollTop: j.currentTarget.scrollTop,
            height: j.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: $r.height }
        }, Ln.map((j) => {
          var mt;
          let Pe;
          if (j.kind === "group") {
            const dt = B.includes(j.group.key), zt = j.group.lanes.reduce((Mt, Bn) => Mt + Bn.markers.length, 0);
            Pe = n("button", {
              type: "button",
              onClick: () => {
                ct(j.group.key), ir(j.group.key);
              },
              "aria-expanded": !dt,
              "aria-current": Vt === j.group.key ? "true" : void 0,
              "data-segment-rail-group": j.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${Vt === j.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, dt ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: j.group.name }, j.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, zt),
              N && dt ? n(_t, { key: "states", counts: j.group.counts }) : null
            ]);
          } else j.kind === "lane" ? Pe = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Wn(j.lane),
            "aria-label": Wn(j.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, j.lane.label),
            (mt = j.lane.performers) != null && mt.length ? n(Ir, {
              key: "performers",
              performers: j.lane.performers,
              performerAssignments: j.lane.performerAssignments
            }) : null,
            N ? n(_t, { key: "states", counts: j.lane.counts }) : null
          ]) : Pe = gn(j.segment);
          return n("div", {
            key: j.key,
            className: "absolute left-0 right-0",
            style: { top: j.top, height: j.height }
          }, Pe);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${Pt ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: Ie,
          className: `${Pt ? "min-h-0 flex-1" : ""} grid`,
          style: Pt ? {
            gridTemplateRows: `minmax(16rem, ${(1 - ie.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${ie.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: be,
            className: "grid min-h-0 gap-2",
            style: Zt ? {
              gridTemplateColumns: ie.markerRailOpen ? `${z}px 0.5rem minmax(0,1fr) 0.5rem ${J}px` : `${z}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(Qd, {
              key: "tools",
              compatibilityMode: N,
              selectedSegment: Dt,
              selectedSegments: Ot,
              selectedGroups: kn,
              saveMessage: rt,
              savingSegmentId: bt,
              creatingSegmentId: q,
              setSavingSegmentId: Rn,
              setSaveMessage: An,
              saveTag: Bt,
              slotStatus: Jt,
              performerSlotsAvailable: ve,
              selectedPerformerSlots: Tr,
              performerSlots: ze,
              detail: $,
              onDetailChange: st,
              onCancelQueuedReview: y,
              video: ot,
              slotButtonRef: En,
              tagSearchRef: On,
              tagEditing: Dn,
              onCancelTagEditing: w,
              detailPanelRef: E,
              onReduceSelection: (j) => {
                ln(j), requestAnimationFrame(() => {
                  var Pe;
                  return (Pe = E.current) == null ? void 0 : Pe.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Wt,
              onSlotsChanged: je,
              onRecordHistory: Ae,
              splitSegment: Rr,
              duplicateSegment: G,
              provenance: Me,
              lineage: H,
              onNavigateLineageItem: (j) => {
                const Pe = Kt.find((mt) => mt.itemId === j);
                Pe && nr(Pe.id);
              }
            }),
            Zt ? n(
              "div",
              { key: "detail-separator", ...he("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            ot.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Ia, {
                streamUrl: `/api/stream/video/${ot.id}`,
                posterUrl: `/api/stream/video/${ot.id}/screenshot?v=${encodeURIComponent(ot.updatedAt || "")}`,
                format: ot.videoFile.format,
                audioCodec: ot.videoFile.audioCodec,
                duration: ot.videoFile.duration,
                videoId: ot.id,
                trackingEnabled: !1,
                onSeekRegister: (j) => {
                  Gt.current = j, vl(He.current, Kt, j) && (He.current = null);
                },
                onPlaybackControlRegister: (j) => {
                  $e.current = j;
                },
                onTimeUpdate: Xn
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            Zt && ie.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...he("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Zt && ie.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: T,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...ut.map((j) => {
              var dt;
              const Pe = (dt = dr[j.id]) == null ? void 0 : dt[0], mt = j.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : j.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: j.id,
                type: "button",
                disabled: j.disabled,
                "data-action-id": j.id,
                onClick: (zt) => {
                  const Mt = zt.currentTarget;
                  jt(j.id, { target: Mt, preserveFocus: !0 }), j.focusWhenDisabled && requestAnimationFrame(() => {
                    Xd(Mt, T.current, j.focusWhenDisabled);
                  });
                },
                title: Pe ? `${j.label} (${Pe})` : j.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${mt}`
              }, [
                n("span", { key: "label" }, j.label),
                Pe ? n("kbd", {
                  key: "shortcut",
                  className: "rounded border border-border/70 bg-background/70 px-1 py-0.5 font-mono text-[10px] leading-none text-secondary"
                }, Pe) : null
              ]);
            }),
            n("div", { key: "frame-actions", className: "ml-auto flex items-center gap-1" }, [
              n("button", {
                key: "previous-frame",
                type: "button",
                disabled: !ot.videoFile,
                onClick: () => un(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(ls, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !ot.videoFile,
                onClick: () => un(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(ds, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          Pt ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(Ye.minimum * 100),
            "aria-valuemax": Math.round(Ye.maximum * 100),
            "aria-valuenow": Math.round(ie.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(ie.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: Q,
            onPointerMove: P,
            onKeyDown: me,
            onDoubleClick: () => xt(ht.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: Pt ? void 0 : { height: "20rem" } }, n(Zd, {
            segments: Fn,
            shotBoundaries: or,
            segmentGroups: Ut,
            performerSlots: ze,
            collapsedGroupKeys: B,
            selectedGroupKey: Vt,
            selectedSegmentId: Dt == null ? void 0 : Dt.id,
            selectedSegmentIds: wn,
            duration: Qe,
            currentTime: re,
            zoom: Mr,
            onZoomChange: rr,
            onSelectGroup: ct,
            onToggleGroup: ir,
            onSelect: (j, Pe) => ln(j, Pe),
            onSelectSegments: Sn,
            onSelectAll: sn,
            onConfigureTag: (j) => Zn(j),
            onSeekTime: (j) => {
              var Pe;
              return (Pe = Gt.current) == null ? void 0 : Pe.call(Gt, j, !1);
            },
            centerRef: b,
            showReviewState: N,
            swimlaneTitleWidth: ie.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (j) => In((Pe) => ({ ...Pe, swimlaneTitleWidth: j }))
          }))
        ])
      ])
    ]),
    D ? n(fo, {
      key: `configure-tag:${D.tagId}`,
      tagId: D.tagId,
      tagName: D.tagName,
      performerSlotsEnabled: N,
      onSaved: ce,
      onClose: () => {
        const j = D.trigger;
        Zn(null), requestAnimationFrame(() => {
          var Pe;
          j != null && j.isConnected ? j.focus({ preventScroll: !0 }) : (Pe = le.current) == null || Pe.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Se ? n(_d, {
      key: "publish-approved-dialog",
      drafts: lr,
      processing: bt === -1,
      error: Ke,
      cancelButtonRef: Ue,
      onConfirm: lt,
      onClose: O
    }) : null,
    we ? n(Wd, {
      key: "rejected-deletion-dialog",
      preview: we,
      onConfirm: () => {
        Y(we), requestAnimationFrame(() => {
          var j;
          return (j = le.current) == null ? void 0 : j.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Qt(null), requestAnimationFrame(() => {
          var j;
          return (j = le.current) == null ? void 0 : j.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Mn ? n(Ud, {
      key: "shortcuts-dialog",
      reviewMode: N,
      bindings: dr,
      onClose: () => cn(!1)
    }) : null,
    k ? n(Kd, {
      key: "incorrect-examples-dialog",
      examples: p,
      exporting: K,
      removingExampleId: yt,
      onExport: f,
      onRemove: Ve,
      onClose: () => tr(!1)
    }) : null
  ]);
}
function tc(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: m, setCollapsedSegmentGroups: u, setEditorFilters: y, setHideDerivedSegments: g, setSaveMessage: f, setSelectedSegmentGroupKey: b, setSelectedSegmentId: h, setSelectedSegmentIds: I } = e;
  function x(T) {
    const N = $t(t, T);
    N && u((D) => mi(D, N));
  }
  function C(T) {
    h(T), I(T == null ? [] : [T]), c.current = T, m.current = [];
  }
  function O(T, {
    focusEditor: N = !1,
    seekToSegment: D = !1,
    additive: M = !1,
    rangeSegmentIds: q = null
  } = {}) {
    var Y, $;
    const re = Ps({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: m.current
    }, T.id, q, M);
    I(re.selectedSegmentIds), h(re.activeSegmentId), c.current = re.anchorSegmentId, m.current = re.rangeBaseSegmentIds, re.activeSegmentId != null && b($t(t, re.activeSegmentId)), x(T.id), N && ((Y = r.current) == null || Y.focus({ preventScroll: !0 })), D && (($ = i.current) == null || $.call(i, T.startSec, !1));
  }
  function w(T) {
    const N = Ds(
      d,
      l,
      T
    );
    I(N.selectedSegmentIds), h(N.activeSegmentId), c.current = N.activeSegmentId, m.current = [], N.activeSegmentId != null && (b($t(t, N.activeSegmentId)), x(N.activeSegmentId));
  }
  function B() {
    var D;
    const T = Fs(s), N = T.includes(l) ? l : T[0] ?? null;
    y(wt({})), g(!1), I(T), h(N), c.current = N, m.current = [], N != null && b($t(
      rn(s, a, o),
      N
    )), f(T.length === 0 ? "There are no segments to select." : `${T.length} segments selected. Collapsed Segment groups keep their selected segments.`), (D = r.current) == null || D.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: x, replaceSegmentSelection: C, selectSegment: O, selectSegmentCollection: w, selectAllVideoSegments: B };
}
function nc(e) {
  const { acceptHistory: t, compatibilityMode: r, detail: o, detailPanelRef: i, historyRef: a, mergeSavingRef: s, onConflict: l, onDetailChange: d, onReload: c, pendingReviewStateRef: m, recordHistoryAction: u, revealSegmentGroupForSelection: y, reviewSavingRef: g, savingSegmentId: f, selectedGroups: b, selectedSegment: h, selectedSegmentIdRef: I, selectedSegments: x, selectionAnchorIdRef: C, selectionRangeBaseIdsRef: O, setMergeConfirmation: w, setSaveMessage: B, setSavingSegmentId: T, setSelectedSegmentId: N, setSelectedSegmentIds: D, video: M } = e;
  function q() {
    w(null), requestAnimationFrame(() => {
      var $;
      return ($ = i.current) == null ? void 0 : $.focus({ preventScroll: !0 });
    });
  }
  async function re($ = !1, E = !1, z = null) {
    if (s.current || f != null) return;
    const G = z || ci(
      b,
      { nativeOnly: !r }
    );
    if (!G) {
      B("Select at least two segments from one swimlane.");
      return;
    }
    if (!$ && Ga()) {
      w(G);
      return;
    }
    E && Ua(!1), q();
    const W = G.endSec == null ? "open end" : Ce(G.endSec);
    s.current = !0;
    let ie = G.segments[0];
    const le = r ? null : kt(G.segments, !1), K = r ? null : crypto.randomUUID(), te = G.segments.map((oe) => oe.id), de = gd(o, G.segments);
    T(ie.id), d(de, M.id), D([ie.id]), N(ie.id), C.current = ie.id, O.current = [];
    try {
      const oe = G.segments.slice(1);
      if (!r || ie.nativeSegmentId != null) {
        const be = oe.map((Q) => {
          const P = `merge-native-selection:${M.id}:${ie.id}:${Q.id}:${ie.updatedAt}:${Q.updatedAt}`;
          return { key: P, operationId: Le(P), segmentId: Q.id, expectedUpdatedAt: Q.updatedAt };
        }), me = await X(`/videos/${M.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: ie.id,
            expectedSurvivorUpdatedAt: ie.updatedAt,
            consumedSegments: be.map(({ key: Q, ...P }) => P),
            historyReceiptId: K
          })
        });
        ie = me.survivor, d(oa(o, me), M.id), be.forEach(({ key: Q }) => Be(Q));
      } else {
        const be = oe.map((Q) => {
          const P = `merge-draft-selection:${M.id}:${ie.itemId}:${Q.itemId}:${ie.revision}:${Q.revision}`;
          return { key: P, operationId: Le(P), itemId: Q.itemId, expectedRevision: Q.revision };
        }), me = await X(`/videos/${M.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: ie.itemId,
            expectedSurvivorRevision: ie.revision,
            consumedDrafts: be.map(({ key: Q, ...P }) => P)
          })
        });
        ie = me.survivor, d(oa(o, me), M.id), be.forEach(({ key: Q }) => Be(Q));
      }
      D([ie.id]), N(ie.id), C.current = ie.id, O.current = [], r ? t(Lt) : await u(
        "segments.merge",
        `Merged ${G.segments.length} segments`,
        le,
        kt([ie], !1),
        K
      ), y(ie.id), B(`${G.segments.length} segments merged into ${Ce(G.startSec)} – ${W}.`);
    } catch (oe) {
      d((be) => gi(
        Jn(be, [G.segments[0]], [
          "startSec",
          "endSec",
          "sourceKey",
          "sourceRunId",
          "confidence",
          "isDerived"
        ]),
        G.segments.slice(1)
      ), M.id), D(te), N((h == null ? void 0 : h.id) ?? te[0] ?? null), C.current = (h == null ? void 0 : h.id) ?? te[0] ?? null, O.current = [], oe.status === 409 ? await l() : B(oe.message || "Unable to merge selected segments.");
    } finally {
      s.current = !1, T(null);
    }
  }
  async function Y($, E = x, z = h) {
    var de;
    if (E.length === 0 || g.current) return;
    if (f != null) {
      m.current.push(Ys(
        $,
        E,
        z
      )), B(`${$ === "approved" ? "Approval" : "Rejection"} queued…`);
      return;
    }
    const G = Js(E, $), W = E.filter((oe) => oe.reviewState !== G);
    if (W.length === 0) return;
    const ie = E.map((oe) => ({
      id: oe.id,
      itemId: oe.itemId,
      nativeSegmentId: oe.nativeSegmentId
    })), le = ie.find((oe) => oe.id === (z == null ? void 0 : z.id)) || ie[0], K = (oe, be = !1) => {
      if (!(oe != null && oe.segments) || !be && !Vr(I.current, le.id))
        return;
      const me = ie.map((P) => Je(oe == null ? void 0 : oe.segments, P)).filter(Boolean), Q = Je(oe == null ? void 0 : oe.segments, le) || me[0] || null;
      D(me.map((P) => P.id)), N((Q == null ? void 0 : Q.id) ?? null), C.current = (Q == null ? void 0 : Q.id) ?? null, O.current = [];
    };
    g.current = !0, T((z == null ? void 0 : z.id) ?? W[0].id), B(`Updating ${W.length} selected segment${W.length === 1 ? "" : "s"}…`);
    const te = kr(
      o,
      W.map((oe) => oe.id),
      { reviewState: G }
    );
    d(te, M.id);
    try {
      const oe = await X(`/videos/${M.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: a.current.revision,
          reviewState: G,
          segments: E.map((P) => P.published ? {
            nativeSegmentId: P.nativeSegmentId,
            expectedUpdatedAt: P.updatedAt
          } : {
            itemId: P.itemId,
            expectedRevision: P.revision
          })
        })
      }), be = new Map((oe.items || []).map((P) => [
        P.requestedNativeSegmentId != null ? `native:${P.requestedNativeSegmentId}` : `item:${P.requestedItemId}`,
        P
      ]));
      if (ie.forEach((P) => {
        const ne = be.get(P.nativeSegmentId != null ? `native:${P.nativeSegmentId}` : `item:${P.itemId}`);
        ne && (P.nativeSegmentId = ne.nativeSegmentId, P.itemId = ne.itemId);
      }), oe.history && t(oe.history), G === "rejected" || (oe.items || []).some((P) => P.requestedNativeSegmentId != null && P.nativeSegmentId !== P.requestedNativeSegmentId)) {
        K(await c()), B(`${oe.updatedCount} selected segment${oe.updatedCount === 1 ? "" : "s"} ${G === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const Q = {
        ...o,
        approvedSetVersion: oe.approvedSetVersion || o.approvedSetVersion,
        segments: (o.segments || []).map((P) => {
          const ne = be.get(P.nativeSegmentId != null ? `native:${P.nativeSegmentId}` : `item:${P.itemId}`);
          return ne ? {
            ...P,
            id: ne.nativeSegmentId != null ? ne.nativeSegmentId : -ne.itemId,
            itemId: ne.itemId,
            nativeSegmentId: ne.nativeSegmentId,
            published: ne.nativeSegmentId != null,
            reviewState: G,
            revision: ne.nativeSegmentId != null ? P.revision : ne.revision,
            updatedAt: ne.updatedAt
          } : P;
        })
      };
      d(Q, M.id), K(Q), B(`${oe.updatedCount} selected segment${oe.updatedCount === 1 ? "" : "s"} ${G === "approved" ? "approved" : G === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (oe) {
      d((me) => Jn(
        me,
        W,
        ["reviewState"]
      ), M.id), oe.status === 409 && ((de = oe.payload) != null && de.currentHistory) && t(oe.payload.currentHistory);
      const be = oe.status === 409 ? await l() : o;
      K(be, !0), B(oe.message || "Unable to update the selected segments.");
    } finally {
      g.current = !1, T(null);
    }
  }
  return { closeMergeConfirmation: q, mergeSelectedSwimlane: re, saveSelectedReviewState: Y };
}
function rc(e) {
  const { acceptHistory: t, allSwimlanes: r, autoAssignCandidates: o, autoAssigning: i, binEmptyingRef: a, canMoveSelectionToBin: s, closeTagEditing: l, compatibilityMode: d, creatingSegmentId: c, detail: m, editorFilters: u, editorRef: y, exportingExamples: g, hideDerivedSegments: f, heldCreatedSegmentTag: b, incorrectExamples: h, lineage: I, materializeButtonRef: x, materializePreview: C, materializeRestoreFocusRef: O, materializing: w, mutateSegment: B, onConflict: T, onDetailChange: N, onReload: D, performerSlots: M, recordHistoryAction: q, refreshMaterializationPreview: re, removingExampleId: Y, revealSegmentGroupForSelection: $, savingSegmentId: E, segmentGroups: z, segments: G, selectedSegment: W, selectedSegmentIdRef: ie, selectedSegments: le, selectionAnchorIdRef: K, selectionRangeBaseIdsRef: te, setAutoAssignError: de, setAutoAssignOpen: oe, setAutoAssigning: be, setEditorFilters: me, setExportingExamples: Q, setHeldCreatedSegmentTag: P, setHideDerivedSegments: ne, setIncorrectExamples: ke, setMaterializeError: fe, setMaterializeLoading: U, setMaterializeOpen: Re, setMaterializePreview: A, setMaterializing: v, setRejectedDeletionPreview: S, setRemovingExampleId: p, setSaveMessage: k, setSavingSegmentId: H, setSelectedSegmentGroupKey: J, setSelectedSegmentId: _, setSelectedSegmentIds: ue, video: R } = e;
  async function ee() {
    var $e, Te, Me;
    if (le.length === 0 || !W || E != null) return;
    const Z = sd(le, h), ce = Z.segments;
    if (ce.length === 0) return;
    const je = le.map((Ge) => ({
      id: Ge.id,
      itemId: Ge.itemId,
      nativeSegmentId: Ge.nativeSegmentId
    })), De = je.find((Ge) => Ge.id === W.id) || je[0], he = [], He = [];
    let ze = !1, ve = m;
    H(De.id), k(Z.action === "remove" ? `Removing ${ce.length} selected incorrect example${ce.length === 1 ? "" : "s"}…` : `Collecting ${ce.length} selected segment${ce.length === 1 ? "" : "s"} as incorrect AI feedback…`);
    try {
      const Ge = async (Ae, we) => {
        const Ve = Ae.nativeSegmentId != null, yt = Z.action === "remove" ? `incorrect-example-remove:${R.id}:${we == null ? void 0 : we.id}:${we == null ? void 0 : we.revision}:${we == null ? void 0 : we.representationRevision}` : `incorrect-example-collect:${R.id}:${Ve ? `native:${Ae.nativeSegmentId}:${Ae.updatedAt}` : `item:${Ae.itemId}:${Ae.revision}`}`;
        if (Z.action === "remove" && !we)
          throw new Error("The incorrect-example collection changed. Reload and try again.");
        let it;
        try {
          it = Z.action === "remove" ? await X(
            `/videos/${R.id}/incorrect-examples/${we.id}/remove`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Le(yt),
                expectedExampleRevision: we.revision,
                expectedRepresentationRevision: we.representationRevision
              })
            }
          ) : await X(`/videos/${R.id}/incorrect-examples/collect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Le(yt),
              nativeSegmentId: Ve ? Ae.nativeSegmentId : null,
              itemId: Ve ? null : Ae.itemId,
              expectedUpdatedAt: Ve ? Ae.updatedAt : null,
              expectedRevision: Ve ? null : Ae.revision
            })
          });
        } catch (jt) {
          throw jt.operationKey = yt, jt;
        }
        if (!ld(Z.action, it))
          throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
        return Be(yt), it;
      };
      for (const Ae of ce) {
        const we = Z.action === "remove" ? h.find((Ve) => Ve.itemId != null && Ve.itemId === Ae.itemId) : null;
        try {
          const Ve = je.find((rt) => rt.id === Ae.id);
          let yt = Je(
            ve == null ? void 0 : ve.segments,
            Ve
          ) || Ae, it;
          try {
            it = await Ge(yt, we);
          } catch (rt) {
            if (rt.status === 409 && ((Te = ($e = rt.payload) == null ? void 0 : $e.result) == null ? void 0 : Te.code) === "OPERATION_REPLAYED")
              ve = await X(
                `/videos/${R.id}/editor`
              ), Be(rt.operationKey), it = rt.payload.result;
            else {
              if (Z.action !== "collect" || rt.status !== 409) throw rt;
              const Bt = await X(
                `/videos/${R.id}/editor`
              );
              ve = Bt;
              const Wt = Je(
                Bt == null ? void 0 : Bt.segments,
                Ve
              );
              if (!Wt) throw rt;
              yt = Wt, it = await Ge(yt, null);
            }
          }
          Ve && it.itemId != null && (Ve.itemId = it.itemId), ve = Zr(
            ve,
            it.editorDelta
          );
          const jt = { segment: Ae, result: it, example: we };
          he.push(jt);
        } catch (Ve) {
          if (He.push(Ve), ![400, 404, 409].includes(Ve.status)) break;
        }
      }
      if (d && he.length > 0) {
        const Ae = Z.action === "remove", we = he.length;
        await q(
          Ae ? "feedback.remove" : "feedback.collect",
          Ae ? `Removed ${we} incorrect AI example${we === 1 ? "" : "s"}` : `Collected ${we} incorrect AI example${we === 1 ? "" : "s"}`,
          gr(he, Ae),
          gr(he, !Ae)
        ) || (ze = !0);
      }
      he.some(({ result: Ae }) => Ae.representation === "basicNativeBin") && Hn();
      const Ue = Vr(
        ie.current,
        De.id
      ), lt = Z.action === "collect" && he.some(({ segment: Ae }) => Ae.id === De.id), Ke = he.map(({ segment: Ae }) => Ae.id), Se = lt ? Bs(
        r,
        Ke,
        De.id
      ) : null, Ze = lt ? (Se == null ? void 0 : Se.id) ?? null : De.id;
      Ue && lt && (ue(Se ? [Se.id] : []), _((Se == null ? void 0 : Se.id) ?? vr), K.current = (Se == null ? void 0 : Se.id) ?? null, te.current = []);
      const nt = await X(`/videos/${R.id}/incorrect-examples`);
      ke(nt);
      const Xe = ve;
      if (N(Xe, R.id), Ue && Vr(
        ie.current,
        Ze
      )) {
        let Ae, we;
        lt ? (we = Se ? Je(Xe == null ? void 0 : Xe.segments, {
          id: Se.id,
          itemId: Se.itemId,
          nativeSegmentId: Se.nativeSegmentId
        }) : null, Ae = we ? [we] : []) : (Ae = je.map((Ve) => Je(Xe == null ? void 0 : Xe.segments, Ve)).filter(Boolean), we = Je(Xe == null ? void 0 : Xe.segments, De) || Ae[0] || null), ue(Ae.map((Ve) => Ve.id)), _((we == null ? void 0 : we.id) ?? (lt ? vr : null)), K.current = (we == null ? void 0 : we.id) ?? null, te.current = [], J(we ? $t(r, we.id) : null), we && $(we.id);
      }
      if (He.length > 0) {
        const Ae = ((Me = He[0]) == null ? void 0 : Me.message) || "Only segments with registered AI provenance can be collected.";
        he.length === 0 ? k(Ae) : Z.action === "remove" ? k(
          `Partially removed ${he.length} of ${ce.length} selected incorrect examples. ${Ae}`
        ) : k(
          `Partially collected ${he.length} of ${ce.length} selected segments. ${Ae}`
        );
      } else if (Z.action === "remove")
        k(
          `${he.length} incorrect example${he.length === 1 ? "" : "s"} removed and ${he.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
        );
      else {
        const Ae = he.filter(({ result: we }) => we.representation === "basicNativeBin").length;
        k(Ae === he.length ? `${he.length} incorrect AI example${he.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${he.length} incorrect AI example${he.length === 1 ? "" : "s"} collected and ${he.length === 1 ? "segment rejected" : "segments rejected"}.`);
      }
      ze && k("The change saved, but editor history could not be updated.");
    } catch (Ge) {
      k(Ge.message || "Unable to update the selected incorrect examples.");
    } finally {
      H(null);
    }
  }
  async function V(Z) {
    var je, De;
    if (!Z || Y != null || g) return;
    p(Z.id);
    const ce = `incorrect-example-remove:${R.id}:${Z.id}:${Z.revision}:${Z.representationRevision}`;
    try {
      let he, He = !1;
      try {
        he = await X(
          `/videos/${R.id}/incorrect-examples/${Z.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Le(ce),
              expectedExampleRevision: Z.revision,
              expectedRepresentationRevision: Z.representationRevision
            })
          }
        );
      } catch ($e) {
        if ($e.status !== 409 || ((De = (je = $e.payload) == null ? void 0 : je.result) == null ? void 0 : De.code) !== "OPERATION_REPLAYED")
          throw $e;
        he = $e.payload.result, He = !0;
      }
      Be(ce);
      let ze = !0;
      if (d) {
        const Te = [{ segment: Je(m.segments, {
          itemId: Z.itemId
        }) || {
          id: Z.itemId == null ? null : -Z.itemId,
          itemId: Z.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: Z.representationRevision
        }, result: he, example: Z }];
        ze = await q(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          gr(Te, !0),
          gr(Te, !1)
        );
      }
      const ve = await X(
        `/videos/${R.id}/incorrect-examples`
      );
      ke(ve), He ? await D() : N(
        Zr(m, he.editorDelta),
        R.id
      ), Z.representation === "basicNativeBin" && Hn(), k(ze ? He ? d ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : Z.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (he) {
      he.status === 409 && await T(), k(he.message || "Unable to remove the incorrect example.");
    } finally {
      p(null);
    }
  }
  async function ge() {
    if (g || Y != null || h.length === 0) return;
    Q(!0);
    const Z = `incorrect-example-export:${R.id}:${h.map((ce) => `${ce.id}:${ce.revision}:${ce.representationRevision}`).join(",")}`;
    try {
      const ce = await cd(
        R.id,
        h
      ), je = new FormData();
      je.append("metadata", JSON.stringify({
        operationId: Le(Z),
        examples: ce.captures
      }));
      for (const $e of ce.files)
        je.append($e.fieldName, $e.file);
      const De = await X(
        `/videos/${R.id}/incorrect-examples/export`,
        { method: "POST", body: je }
      ), he = await $l(De.downloadUrl), He = URL.createObjectURL(he.blob), ze = document.createElement("a");
      ze.href = He, ze.download = he.fileName, ze.click(), setTimeout(() => URL.revokeObjectURL(He), 1e3);
      const ve = await X(
        `/training-exports/${De.id}/complete`,
        { method: "POST" }
      );
      Be(Z), ke(await X(
        `/videos/${R.id}/incorrect-examples`
      )), k(
        `Downloaded ${De.exampleCount} incorrect example${De.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${ve.clearedExampleCount} from the working collection.`
      );
    } catch (ce) {
      k(ce.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      Q(!1);
    }
  }
  async function xe(Z = null) {
    const ce = G.filter((Te) => Te.reviewState === "rejected"), je = ce.length, De = h.some((Te) => Te.representation === "fullItem");
    if (Z == null && je === 0 && !De) {
      k("There are no rejected segments to delete.");
      return;
    }
    if (Z == null) {
      H(-1), k("Preparing deletion summary…");
      try {
        const Te = await X(`/videos/${R.id}/rejected/deletion/preview`, { method: "POST" }), Me = Number(Te.deletedSegmentCount) || 0, Ge = Number(Te.deferredRejectedSegmentCount) || 0, Ue = Number(Te.protectedIncorrectExampleCount) || 0;
        if (Me === 0) {
          Ge > 0 ? k(
            `${Ge} feedback-protected rejected segment${Ge === 1 ? "" : "s"} kept. ${Ue} AI feedback example${Ue === 1 ? "" : "s"} must be exported before ${Ge === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : k("There are no rejected segments to delete.");
          return;
        }
        if (!ti(Te, k)) return;
        S(Te), k("");
      } catch (Te) {
        k(Te.message || "Unable to prepare rejected segment deletion.");
      } finally {
        H(null);
      }
      return;
    }
    const he = Z, He = Number(he.deferredRejectedSegmentCount) || 0, ze = ie.current, ve = He === 0 ? Xr(m, ce.map((Te) => Te.id)) : m, $e = ve.segments.find((Te) => Te.reviewState === "unreviewed") || ve.segments[0] || null;
    S(null), H(-1), k("Deleting rejected segments…"), He === 0 && (N(ve, R.id), ue($e ? [$e.id] : []), _(($e == null ? void 0 : $e.id) ?? null), K.current = ($e == null ? void 0 : $e.id) ?? null, te.current = []);
    try {
      const Te = `rejected-dependency-delete:${R.id}:${he.fingerprint}`, Me = await X(`/videos/${R.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(Te),
          fingerprint: he.fingerprint
        })
      });
      Be(Te), await D(), Me.deletedSegmentCount > 0 && t(Lt);
      const Ge = He > 0 ? ` ${He} feedback-protected rejected segment${He === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      k(`${Me.deletedSegmentCount} segment${Me.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Ge}`);
    } catch (Te) {
      He === 0 && N((Me) => gi(
        Me,
        ce
      ), R.id), ue(ze == null ? [] : [ze]), _(ze), K.current = ze, te.current = [], k(Te.message || "Unable to delete rejected segments.");
    } finally {
      H(null);
    }
  }
  async function qe(Z = o) {
    if (!(i || Z.length === 0)) {
      be(!0), de("");
      try {
        const ce = await X(`/videos/${R.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: Z.flatMap((je) => je.nativeSegmentId == null ? [] : [je.nativeSegmentId]),
            itemIds: Z.flatMap((je) => je.published || je.itemId == null ? [] : [je.itemId])
          })
        });
        oe(!1), await D(), k(`${ce.assignedSegmentCount} segment${ce.assignedSegmentCount === 1 ? "" : "s"} received ${ce.assignedSlotCount} performer-slot assignment${ce.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (ce) {
        de(ce.message || "Unable to auto-assign performers.");
      } finally {
        be(!1);
      }
    }
  }
  async function Ie() {
    Re(!0), fe(""), !C && (U(!0), re());
  }
  function We() {
    O.current = !0, Re(!1), requestAnimationFrame(() => {
      var Z;
      return (Z = x.current) == null ? void 0 : Z.focus({ preventScroll: !0 });
    });
  }
  async function Fe() {
    if (!C || w || C.createCount + C.linkCount === 0)
      return;
    v(!0), fe("");
    let Z;
    try {
      const ce = `materialize-derived:${R.id}:${C.fingerprint}`;
      Z = await X(`/videos/${R.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(ce),
          fingerprint: C.fingerprint,
          maxDepth: 3
        })
      }), Be(ce);
    } catch (ce) {
      ce.status === 409 && A(null), fe(ce.message || "Unable to materialize derived segments."), v(!1);
      return;
    }
    A((ce) => ce && { ...ce, createCount: 0, linkCount: 0 });
    try {
      await D(), We(), A(null);
      const ce = Z.createdCount + Z.linkedCount;
      k(`${Z.createdCount} derived segment${Z.createdCount === 1 ? "" : "s"} created and ${Z.linkedCount} existing segment${Z.linkedCount === 1 ? "" : "s"} linked.`), ce === 0 && k("Every applicable derivation was already materialized.");
    } catch {
      fe("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    v(!1);
  }
  async function Ne(Z, ce = null) {
    var De, he, He, ze;
    const je = {
      tagId: Z,
      ...ce ? { tagName: ce } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (le.length > 1) {
      const ve = le.filter((Ue) => Ue.tagId !== Z);
      if (ve.length === 0) {
        l();
        return;
      }
      const $e = le.map((Ue) => ({
        id: Ue.id,
        itemId: Ue.itemId,
        nativeSegmentId: Ue.nativeSegmentId
      })), Te = le.map((Ue) => !d || Ue.nativeSegmentId != null ? `native:${Ue.nativeSegmentId}:${Ue.updatedAt}` : `item:${Ue.itemId}:${Ue.revision}`).sort().join(","), Me = `bulk-tag:${R.id}:${Z}:${Te}`;
      H((W == null ? void 0 : W.id) ?? ve[0].id), k(`Changing tag for ${ve.length} selected segment${ve.length === 1 ? "" : "s"}…`);
      const Ge = kr(
        m,
        ve.map((Ue) => Ue.id),
        je
      );
      N(Ge, R.id), l();
      try {
        const Ue = d ? null : crypto.randomUUID();
        await X(`/videos/${R.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(Me),
            tagId: Z,
            historyReceiptId: Ue,
            segments: le.map((nt) => {
              const Xe = !d || nt.nativeSegmentId != null;
              return {
                nativeSegmentId: Xe ? nt.nativeSegmentId : null,
                itemId: Xe ? null : nt.itemId,
                expectedUpdatedAt: Xe ? nt.updatedAt : null,
                expectedRevision: Xe ? null : nt.revision
              };
            })
          })
        }), Be(Me);
        const lt = kt(
          le,
          d
        ), Ke = await D(), Se = $e.map((nt) => Je(Ke == null ? void 0 : Ke.segments, nt)).filter(Boolean);
        await q(
          "segments.tag",
          `Changed tag for ${ve.length} segment${ve.length === 1 ? "" : "s"}`,
          lt,
          kt(Se, d),
          Ue
        );
        const Ze = $e.map((nt) => Je(Ke == null ? void 0 : Ke.segments, nt)).filter(Boolean);
        ue(Ze.map((nt) => nt.id)), _(((De = Ze.find((nt) => nt.id === (W == null ? void 0 : W.id))) == null ? void 0 : De.id) ?? ((he = Ze[0]) == null ? void 0 : he.id) ?? null), l(), k(`${ve.length} selected segment${ve.length === 1 ? "" : "s"} retagged.`);
      } catch (Ue) {
        N((Se) => Jn(
          Se,
          ve,
          Object.keys(je)
        ), R.id);
        const lt = $e.map((Se) => Je(m.segments, Se)).filter(Boolean), Ke = Je(m.segments, {
          id: W == null ? void 0 : W.id,
          itemId: W == null ? void 0 : W.itemId,
          nativeSegmentId: W == null ? void 0 : W.nativeSegmentId
        }) || lt[0] || null;
        ue(lt.map((Se) => Se.id)), _((Ke == null ? void 0 : Ke.id) ?? null), K.current = (Ke == null ? void 0 : Ke.id) ?? null, te.current = [], Ue.status === 409 && await T(), k(Ue.message || "Unable to change the selected segment tags.");
      } finally {
        H(null);
      }
      return;
    }
    if (!(le.length !== 1 || !W)) {
      if (W.id === c || (b == null ? void 0 : b.segmentId) === W.id) {
        const ve = b != null, $e = rl(b, W, Z, ce);
        if (P($e), $e) {
          const Te = Ka(
            { ...W, tagId: $e.tagId },
            M,
            u,
            f,
            z
          );
          me(Te.filters), ne(Te.hideDerivedSegments), k("Tag change queued…");
        } else ve && k("");
        l();
        return;
      }
      if (Z === W.tagId) {
        l();
        return;
      }
      if (W.itemId != null && ((ze = (He = I.data) == null ? void 0 : He.children) == null ? void 0 : ze.length) > 0) {
        H(W.id), k("Checking lineage impact…");
        try {
          const ve = await X(`/items/${W.itemId}/tag-change/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedRevision: W.revision, tagId: Z })
          }), $e = ve.deletedItemIds.length > 0 || ve.removedEdgeIds.length > 0;
          if ($e && !window.confirm(
            `Changing this tag removes ${ve.removedEdgeIds.length} lineage edge${ve.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${ve.deletedItemIds.length} derived segment${ve.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
          )) {
            k("Tag change canceled.");
            return;
          }
          const Te = kr(
            m,
            [W.id],
            je
          );
          N(Te, R.id), l();
          const Me = `tag-change:${W.itemId}:${W.revision}:${ve.componentFingerprint}:${Z}`;
          await X(`/items/${W.itemId}/tag-change/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Le(Me),
              expectedRevision: W.revision,
              componentFingerprint: ve.componentFingerprint,
              tagId: Z
            })
          }), Be(Me), await D(), l(), k($e ? "Tag changed and lineage reconciled." : "Tag changed.");
        } catch (ve) {
          N(($e) => Jn(
            $e,
            [W],
            Object.keys(je)
          ), R.id), ue([W.id]), _(W.id), K.current = W.id, te.current = [], ve.status === 409 ? (k("Lineage changed — loading the latest segments…"), await T()) : k(ve.message || "Unable to reconcile the lineage.");
        } finally {
          H(null);
        }
        return;
      }
      l(), await B(W, {
        startSec: W.startSec,
        endSec: W.endSec,
        tagId: Z
      }, !0, null, !0, je);
    }
  }
  async function Ee(Z) {
    const ce = G.find((De) => De.id === Z.segmentId);
    if (!ce) return;
    await B(ce, {
      startSec: ce.startSec,
      endSec: ce.endSec,
      tagId: Z.tagId
    }, !0, null, !0, {
      tagId: Z.tagId,
      ...Z.tagName ? { tagName: Z.tagName } : {},
      tagSortName: null
    }, !1) || k(`The new segment was not retagged${Z.tagName ? ` to ${Z.tagName}` : ""}. Choose its tag again.`);
  }
  async function at() {
    var ze, ve, $e, Te;
    if (!s || !W || E != null) return;
    const Z = [...le].sort((Me, Ge) => Number(Me.nativeSegmentId ?? Me.id) - Number(Ge.nativeSegmentId ?? Ge.id)), ce = new Set(Z.map((Me) => Me.id)), je = Z.map((Me) => `${Me.nativeSegmentId ?? Me.id}:${Me.updatedAt}`).join("|");
    H(W.id), k(`Moving ${Z.length} segment${Z.length === 1 ? "" : "s"} to recycling bin…`);
    const De = `bulk-move:${R.id}:${je}`, he = Le(De), He = d ? null : crypto.randomUUID();
    try {
      const Me = (Se = !1) => X(`/videos/${R.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: he,
          segments: Z.map((Ze) => ({
            segmentId: Ze.nativeSegmentId ?? Ze.id,
            expectedUpdatedAt: Ze.updatedAt
          })),
          discardMissingImage: Se,
          ...d ? { reviewState: "rejected" } : {},
          historyReceiptId: He
        })
      });
      let Ge;
      try {
        Ge = await Me(
          so(De)
        );
      } catch (Se) {
        if (((ze = Se.payload) == null ? void 0 : ze.code) !== "missing-image" || !window.confirm(`${Se.message}

Continue and discard the missing image reference?`)) throw Se;
        lo(De), Ge = await Me(!0);
      }
      Be(De), Hn();
      const Ue = new Map((Ge.items || []).map((Se) => [
        Number(Se.segmentId),
        Se
      ]));
      await q(
        "segments.moveToBin",
        `Moved ${Z.length} segment${Z.length === 1 ? "" : "s"} to recycling bin`,
        kt(Z, !1),
        kt(Z.map((Se) => {
          const Ze = Ue.get(
            Number(Se.nativeSegmentId ?? Se.id)
          );
          return {
            ...Se,
            recycleBinItemId: (Ze == null ? void 0 : Ze.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (Ze == null ? void 0 : Ze.revision) ?? null
          };
        }), !1),
        He
      );
      const lt = G.filter((Se) => !ce.has(Se.id)), Ke = js(r, ce, W.id);
      N({ ...m, segments: lt }, R.id), ue(Ke ? [Ke.id] : []), _((Ke == null ? void 0 : Ke.id) ?? null), K.current = (Ke == null ? void 0 : Ke.id) ?? null, te.current = [], Ke && (J($t(r, Ke.id)), $(Ke.id)), requestAnimationFrame(() => {
        var Se;
        return (Se = y.current) == null ? void 0 : Se.focus({ preventScroll: !0 });
      }), k(`Moved ${Z.length} segment${Z.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Me) {
      const Ge = ((ve = Me.payload) == null ? void 0 : ve.code) || ((Te = ($e = Me.payload) == null ? void 0 : $e.result) == null ? void 0 : Te.code);
      Me.status === 409 && Ge === "CANONICAL_SEGMENT_CHANGED" ? await T() : k(Me.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      H(null);
    }
  }
  async function st() {
    if (!(d || a.current || E != null)) {
      a.current = !0, k("Checking the recycling bin…");
      try {
        const Z = await X("/bin"), ce = await ri(Z, () => k("Emptying the recycling bin…"));
        if (ce.status === "empty") {
          k("The recycling bin is empty.");
          return;
        }
        if (ce.status === "canceled") {
          k("The recycling bin was not emptied.");
          return;
        }
        k(`${ce.segmentCount} segment${ce.segmentCount === 1 ? "" : "s"} from ${ce.sceneCount} scene${ce.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (Z) {
        k(Z.message || "Unable to empty the recycling bin.");
      } finally {
        a.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: ee, removeIncorrectExample: V, captureTrainingExport: ge, deleteRejectedSegments: xe, autoAssignPerformers: qe, previewDerivedSegments: Ie, closeMaterializeDialog: We, materializeDerivedSegments: Fe, saveTag: Ne, applyHeldCreatedSegmentTag: Ee, moveToBin: at, emptyRecyclingBin: st };
}
function oc(e) {
  const { acceptHistory: t, commonActionsRef: r, compatibilityMode: o, currentTime: i, detail: a, editorLayout: s, focusRowRef: l, history: d, historyRef: c, historySaving: m, horizontalLayoutSize: u, mediaStackHeight: y, mediaStackRef: g, onDetailChange: f, onReload: b, railToggleRef: h, recordHistoryAction: I, savingSegmentId: x, savingShot: C, savingShotRef: O, setCollapsedSegmentGroups: w, setEditorLayout: B, setHistorySaving: T, setIncorrectExamples: N, setSaveMessage: D, setSavingSegmentId: M, setSavingShot: q, shotBoundaries: re, timelineDuration: Y, video: $, workspaceRef: E } = e;
  async function z(A, v, S) {
    var J, _, ue, R;
    const p = A.type === "segment" ? [A] : A.segments || [], k = (v == null ? void 0 : v.type) === "segment" ? [v] : (v == null ? void 0 : v.segments) || [];
    let H = S;
    for (const [ee, V] of p.entries()) {
      const ge = k[ee], xe = ((J = V.identity) == null ? void 0 : J.nativeSegmentId) != null || ((_ = V.identity) == null ? void 0 : _.published) === !0, qe = ((ue = ge == null ? void 0 : ge.identity) == null ? void 0 : ue.recycleBinItemId) ?? ((R = ge == null ? void 0 : ge.identity) == null ? void 0 : R.itemId);
      let Ie = Je(H.segments, ge == null ? void 0 : ge.identity) || Je(H.segments, V.identity);
      if (!Ie && xe && qe != null && ge.identity.revision != null) {
        const Ne = `history-restore:${$.id}:${qe}:${ge.identity.revision}`;
        await X(`/bin/${qe}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(Ne),
            expectedRevision: ge.identity.revision
          })
        }), Be(Ne), H = await b(), Ie = H.segments.find((Ee) => Ee.tagId === V.values.tagId && Ee.startSec === V.values.startSec && Ee.endSec === V.values.endSec);
      }
      if (!Ie)
        throw new Error("A segment in this history state no longer exists.");
      if ((Ie.nativeSegmentId != null || Ie.published === !0) !== xe) {
        if (xe) {
          const Ne = Ie.recycleBinItemId ?? Ie.itemId ?? qe;
          if (Ne == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Ee = `history-restore:${$.id}:${Ne}:${Ie.revision}:${V.values.reviewState ?? "native"}`;
          await X(`/bin/${Ne}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Le(Ee),
              expectedRevision: Ie.revision
            })
          }), Be(Ee);
        } else {
          const Ne = `history-bin:${$.id}:${Ie.nativeSegmentId}:${Ie.updatedAt}:${V.values.reviewState}`;
          await X(`/videos/${$.id}/segments/${Ie.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Le(Ne),
              expectedUpdatedAt: Ie.updatedAt,
              reviewState: V.values.reviewState
            })
          }), Be(Ne);
        }
        if (H = await b(), !xe)
          continue;
        if (Ie = Je(H.segments, V.identity) || H.segments.find((Ne) => Ne.tagId === V.values.tagId && Ne.startSec === V.values.startSec && Ne.endSec === V.values.endSec), !Ie)
          throw new Error("The restored segment could not be found.");
      }
      const Fe = V.values;
      if (Ie.nativeSegmentId == null && Ie.itemId != null) {
        const Ne = `history-draft-update:${$.id}:${Ie.itemId}:${Ie.revision}:${Fe.tagId}:${Fe.startSec}:${Fe.endSec ?? "open"}:${Fe.reviewState}`;
        await X(`/videos/${$.id}/drafts/${Ie.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(Ne),
            expectedRevision: Ie.revision,
            ...Fe
          })
        }), Be(Ne);
      } else
        await X(`/videos/${$.id}/segments/${Ie.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Fe, expectedUpdatedAt: Ie.updatedAt })
        });
      H = await b();
    }
    return H;
  }
  async function G(A, v) {
    var S;
    for (const p of A.targets || []) {
      const k = Je(v.segments, p.identity);
      if (!k)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const H = (S = v.performerSlotRevisions) == null ? void 0 : S[k.id];
      await X(k.published ? `/videos/${$.id}/segments/${k.nativeSegmentId}/slots` : `/videos/${$.id}/drafts/${k.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: H,
          assignments: p.assignments
        })
      }), v = await b();
    }
    return v;
  }
  async function W(A, v, S) {
    if (!o)
      throw new Error("AI feedback history is only available in Full mode.");
    let p = v, k = await X(`/videos/${$.id}/incorrect-examples`);
    const H = (J) => k.find((_) => {
      var ue;
      return _.id === J.exampleId || ((ue = J.collectedIdentity) == null ? void 0 : ue.itemId) != null && _.itemId === J.collectedIdentity.itemId;
    });
    for (const [J, _] of (A.entries || []).entries()) {
      const ue = `history-feedback:${$.id}:${S.action.sequence}:${S.direction}:${J}`, R = H(_);
      if (A.collected && R) {
        Be(ue);
        continue;
      }
      let ee;
      if (A.collected) {
        const V = Je(
          p.segments,
          _.collectedIdentity
        ) || Je(
          p.segments,
          _.originalIdentity
        );
        if (!V)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const ge = V.nativeSegmentId != null;
        ee = await X(`/videos/${$.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Le(ue),
            nativeSegmentId: ge ? V.nativeSegmentId : null,
            itemId: ge ? null : V.itemId,
            expectedUpdatedAt: ge ? V.updatedAt : null,
            expectedRevision: ge ? null : V.revision
          })
        });
      } else {
        if (!R) {
          Be(ue);
          continue;
        }
        ee = await X(
          `/videos/${$.id}/incorrect-examples/${R.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Le(ue),
              expectedExampleRevision: R.revision,
              expectedRepresentationRevision: R.representationRevision
            })
          }
        );
      }
      Be(ue), p = Zr(
        p,
        ee.editorDelta
      ), k = await X(
        `/videos/${$.id}/incorrect-examples`
      );
    }
    return N(k), p;
  }
  async function ie(A, v, S = []) {
    const p = A.state;
    if (!o && ((p == null ? void 0 : p.type) === "segment" || (p == null ? void 0 : p.type) === "segments")) {
      const H = `basic-history:${$.id}:${c.current.revision}:${A.action.sequence}:${A.direction}`, J = await X(`/videos/${$.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(H),
          expectedHistoryRevision: c.current.revision,
          actionSequence: A.action.sequence,
          direction: A.direction
        })
      });
      return t(J.history), S.push(H), b();
    }
    const k = A.direction === "backward" ? A.action.afterState : A.action.beforeState;
    if ((p == null ? void 0 : p.type) === "composite") {
      let H = v;
      const J = (k == null ? void 0 : k.type) === "composite" ? k.states || [] : [];
      for (const [_, ue] of (p.states || []).entries()) {
        const R = J[_];
        H = await ie({
          ...A,
          state: ue,
          action: {
            ...A.action,
            beforeState: A.direction === "backward" ? ue : R,
            afterState: A.direction === "backward" ? R : ue
          }
        }, H, S);
      }
      return H;
    }
    if ((p == null ? void 0 : p.type) === "segment" || (p == null ? void 0 : p.type) === "segments")
      return z(
        p,
        k,
        v
      );
    if ((p == null ? void 0 : p.type) === "performerSlots")
      return G(p, v);
    if ((p == null ? void 0 : p.type) === "incorrectExamples")
      return W(p, v, A);
    if ((p == null ? void 0 : p.type) === "shots") {
      const H = zn(v.shotBoundaries || []), J = await X(`/videos/${$.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(`history-shots:${$.id}:${H}:${p.fingerprint}`),
          expectedFingerprint: H,
          boundaries: p.boundaries
        })
      });
      return { ...v, shotBoundaries: J };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function le(A) {
    var S;
    if (m || x != null || C || A === d.cursorSequence)
      return;
    const v = Ul(d, A);
    if (v.length !== 0) {
      T(!0), M(-1), D(`Restoring ${v.length} history ${v.length === 1 ? "action" : "actions"}…`);
      try {
        let p = a;
        const k = [];
        for (const J of v)
          p = await ie(
            J,
            p,
            k
          );
        const H = o ? await X(`/videos/${$.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: c.current.revision,
            targetSequence: A
          })
        }) : c.current;
        k.forEach(Be), t(H), await b(), D("History restored.");
      } catch (p) {
        p.status === 409 && ((S = p.payload) != null && S.current) && t(p.payload.current), await b(), D(p.message || "Unable to restore editor history.");
      } finally {
        M(null), T(!1);
      }
    }
  }
  function K(A) {
    B((v) => ({ ...v, timelineRatio: ao(A, y) }));
  }
  function te(A) {
    var p, k;
    const v = (p = g.current) == null ? void 0 : p.getBoundingClientRect();
    if (!v) return;
    const S = ((k = r.current) == null ? void 0 : k.offsetHeight) || 0;
    K(Ns(
      A.clientY,
      v.top + S,
      Math.max(0, v.height - S)
    ));
  }
  function de(A) {
    A.currentTarget.setPointerCapture(A.pointerId), te(A);
  }
  function oe(A) {
    A.currentTarget.hasPointerCapture(A.pointerId) && te(A);
  }
  function be(A) {
    const v = A.shiftKey ? 0.1 : 0.05;
    let S = null;
    A.key === "ArrowUp" && (S = s.timelineRatio + v), A.key === "ArrowDown" && (S = s.timelineRatio - v);
    const p = oo(y);
    A.key === "Home" && (S = p.minimum), A.key === "End" && (S = p.maximum), S != null && (A.preventDefault(), A.stopPropagation(), K(S));
  }
  function me(A) {
    const v = A === "detailWidth" ? u.focusRow : u.workspace, S = u.workspace > 0 ? qr(u.workspace, 600) : 560, p = nn(s.markerRailWidth, S), k = A === "detailWidth" ? 344 + (s.markerRailOpen ? p + 24 : 0) : 600;
    return v > 0 ? qr(v, k) : 560;
  }
  function Q(A, v) {
    B((S) => ({ ...S, [A]: nn(v, me(A)) }));
  }
  function P(A, v) {
    var p, k;
    const S = v === "detailWidth" ? (p = l.current) == null ? void 0 : p.getBoundingClientRect() : (k = E.current) == null ? void 0 : k.getBoundingClientRect();
    S && Q(v, v === "detailWidth" ? A.clientX - S.left : S.right - A.clientX);
  }
  function ne(A, v) {
    const S = me(A), p = nn(s[A], S);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": v,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(S),
      "aria-valuenow": Math.round(p),
      "aria-valuetext": `${Math.round(p)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (k) => {
        k.currentTarget.setPointerCapture(k.pointerId), P(k, A);
      },
      onPointerMove: (k) => {
        k.currentTarget.hasPointerCapture(k.pointerId) && P(k, A);
      },
      onKeyDown: (k) => {
        const H = k.shiftKey ? 40 : 16;
        let J = null;
        k.key === "ArrowLeft" && (J = A === "detailWidth" ? -H : H), k.key === "ArrowRight" && (J = A === "detailWidth" ? H : -H);
        let _ = J == null ? null : p + J;
        k.key === "Home" && (_ = 240), k.key === "End" && (_ = S), _ != null && (k.preventDefault(), k.stopPropagation(), Q(A, _));
      },
      onDoubleClick: () => Q(A, ht[A]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function ke() {
    B((A) => ({ ...A, markerRailOpen: !A.markerRailOpen })), requestAnimationFrame(() => {
      var A;
      return (A = h.current) == null ? void 0 : A.focus({ preventScroll: !0 });
    });
  }
  function fe(A) {
    w((v) => v.includes(A) ? v.filter((S) => S !== A) : qt([...v, A]));
  }
  async function U(A, v = !0, S = i) {
    var J;
    if (O.current) return null;
    const p = Number((J = $.videoFile) == null ? void 0 : J.duration) || Y, k = zn(re), H = `shot-${A}:${$.id}:${S.toFixed(3)}:${p.toFixed(3)}:${k}`;
    O.current = !0, q(!0), D(A === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const _ = await X(`/videos/${$.id}/shot-boundaries/${A}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(A === "split" ? { operationId: Le(H), timeSec: S } : { operationId: Le(H), timeSec: S })
      });
      return Be(H), f((ue) => ({ ...ue, shotBoundaries: _ }), $.id), v && await I(
        "shots.update",
        A === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: re,
          fingerprint: k
        },
        {
          type: "shots",
          boundaries: _,
          fingerprint: zn(_)
        }
      ), D(A === "split" ? "Shot boundary added." : "Shots merged."), _;
    } catch (_) {
      return D(_.message || "Unable to edit shot boundaries."), null;
    } finally {
      O.current = !1, q(!1);
    }
  }
  async function Re(A) {
    if (O.current) return null;
    const v = `shot-restore:${$.id}:${A.afterFingerprint}`;
    O.current = !0, q(!0), D("Undoing shot edit…");
    try {
      const S = await X(`/videos/${$.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(v),
          expectedFingerprint: A.afterFingerprint,
          boundaries: A.before
        })
      });
      return Be(v), f((p) => ({ ...p, shotBoundaries: S }), $.id), S;
    } catch (S) {
      return D(S.message || "Unable to undo the shot edit."), null;
    } finally {
      O.current = !1, q(!1);
    }
  }
  return { applySegmentHistoryState: z, applyPerformerSlotHistoryState: G, applyHistoryState: ie, restoreHistoryTarget: le, updateTimelineRatio: K, updateTimelineRatioFromPointer: te, handleSeparatorPointerDown: de, handleSeparatorPointerMove: oe, handleSeparatorKeyDown: be, panelWidthMaximum: me, updatePanelWidth: Q, handlePanelSeparatorPointer: P, panelSeparatorProps: ne, toggleSegmentRail: ke, toggleSegmentGroup: fe, mutateShotBoundary: U, restoreShotBoundaries: Re };
}
function ac(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: m, emptyRecyclingBin: u, lineage: y, mediaDuration: g, mergeSelectedSwimlane: f, moveToBin: b, mutateShotBoundary: h, openPublishApprovedDialog: I, playbackControlsRef: x, playbackShortcutConfig: C, saveSelectedReviewState: O, seekRef: w, segmentGroupKeys: B, selectSegment: T, selectedSegment: N, selectedSegmentGroupForSegment: D, selectedSegmentGroupKey: M, selectedSegments: q, setCollapsedSegmentGroups: re, setIncorrectExamplesOpen: Y, setQuickSearchOpen: $, setSaveMessage: E, setSelectedSegmentGroupKey: z, setTagEditing: G, setTimelineZoom: W, shotBoundaries: ie, slotButtonRef: le, splitSegment: K, swimlanes: te, timelineDuration: de, toggleIncorrectExample: oe, toggleSegmentGroup: be, updateTimelineRatio: me, videoFrameRate: Q, visibleSegments: P } = e;
  function ne(U) {
    var Re, A;
    (Re = x.current) == null || Re.pause(), (A = x.current) == null || A.seekBy(ll(U, Q));
  }
  function ke(U, Re) {
    if (q.length > 1 && Hs(U.id))
      return;
    let A = null;
    U.id === "video.playPause" && (A = () => {
      var v;
      return (v = x.current) == null ? void 0 : v.toggle();
    }), U.id === "video.seekSmallBackward" && (A = () => {
      var v;
      return (v = x.current) == null ? void 0 : v.seekBy(-C.smallSeekTime);
    }), U.id === "video.seekSmallForward" && (A = () => {
      var v;
      return (v = x.current) == null ? void 0 : v.seekBy(C.smallSeekTime);
    }), U.id === "video.seekMediumBackward" && (A = () => {
      var v;
      return (v = x.current) == null ? void 0 : v.seekBy(-C.mediumSeekTime);
    }), U.id === "video.seekMediumForward" && (A = () => {
      var v;
      return (v = x.current) == null ? void 0 : v.seekBy(C.mediumSeekTime);
    }), U.id === "video.seekLongBackward" && (A = () => {
      var v;
      return (v = x.current) == null ? void 0 : v.seekBy(-C.longSeekTime);
    }), U.id === "video.seekLongForward" && (A = () => {
      var v;
      return (v = x.current) == null ? void 0 : v.seekBy(C.longSeekTime);
    }), U.id === "video.playSelected" && N && (A = () => {
      var v;
      (v = w.current) == null || v.call(w, N.startSec, !0), requestAnimationFrame(() => {
        var S;
        return (S = m.current) == null ? void 0 : S.focus({ preventScroll: !0 });
      });
    }), (U.id === "video.playPreviousSegment" || U.id === "video.playNextSegment") && (A = () => {
      var S;
      const v = Qr(
        te,
        N == null ? void 0 : N.id,
        U.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !v || v.id === (N == null ? void 0 : N.id) || (T(v, { focusEditor: !0, seekToSegment: !1 }), (S = w.current) == null || S.call(w, v.startSec, !0));
    }), U.id.startsWith("video.seekPercent") && (A = () => {
      var S;
      const v = Number(U.id.slice(17)) / 10;
      (S = w.current) == null || S.call(w, Gs(g ?? de, v), !1);
    }), U.id === "video.jumpToSegmentStart" && N && (A = () => {
      var v;
      return (v = w.current) == null ? void 0 : v.call(w, N.startSec, !1);
    }), U.id === "video.jumpToSegmentEnd" && N && (A = () => {
      var v;
      return (v = w.current) == null ? void 0 : v.call(w, N.endSec ?? N.startSec, !1);
    }), U.id === "video.jumpToVideoStart" && (A = () => {
      var v;
      return (v = w.current) == null ? void 0 : v.call(w, 0, !1);
    }), U.id === "video.jumpToVideoEnd" && (A = () => {
      var v;
      return (v = w.current) == null ? void 0 : v.call(w, de, !1);
    }), U.id.startsWith("video.frame") && (A = () => {
      const v = U.id.includes("Small") ? "small" : U.id.includes("Medium") ? "medium" : "long", S = C[`${v}FrameStep`] * (U.id.endsWith("Backward") ? -1 : 1);
      ne(S);
    }), U.id.startsWith("navigation.swimlane") && (A = () => {
      const v = U.id.slice(19).toLowerCase(), S = Qr(te, N == null ? void 0 : N.id, v, s);
      S && T(S, { focusEditor: !0, seekToSegment: !1 });
    }), (U.id === "navigation.extendSwimlaneLeft" || U.id === "navigation.extendSwimlaneRight") && (A = () => {
      const v = rd(
        t,
        N == null ? void 0 : N.id,
        U.id.endsWith("Left") ? "left" : "right"
      );
      v && T(v.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: v.segmentIds
      });
    }), (U.id === "navigation.segmentGroupUp" || U.id === "navigation.segmentGroupDown") && (A = () => {
      const v = od(
        B,
        M ?? D,
        U.id.endsWith("Up") ? -1 : 1
      );
      v && z(v);
    }), (U.id === "navigation.previousAtPlayhead" || U.id === "navigation.nextAtPlayhead") && (A = () => {
      const v = Is(P, s, U.id === "navigation.previousAtPlayhead" ? -1 : 1, N == null ? void 0 : N.id);
      v && T(v, { focusEditor: !0, seekToSegment: !1 });
    }), U.id === "navigation.nearestInCurrentSwimlane" && (A = () => {
      const v = ps(
        te,
        N == null ? void 0 : N.id,
        s
      );
      v && T(v, { focusEditor: !0, seekToSegment: !1 });
    }), U.id.includes("Unreviewed") && (A = () => {
      const v = br(
        te,
        N == null ? void 0 : N.id,
        U.id.startsWith("navigation.previous") ? -1 : 1,
        U.id.endsWith("Global")
      );
      v && T(v, { focusEditor: !Re.preserveFocus, seekToSegment: !1 });
    }), (U.id === "navigation.nextTouchingPlayhead" || U.id === "navigation.previousTouchingPlayhead") && (A = () => {
      const v = gs(te, s, U.id === "navigation.previousTouchingPlayhead" ? -1 : 1, N == null ? void 0 : N.id);
      v && T(v, { focusEditor: !0, seekToSegment: !1 });
    }), U.id === "navigation.quickSearch" && (A = () => $(!0)), (U.id === "navigation.previousShot" || U.id === "navigation.nextShot") && (A = () => {
      var S;
      const v = sl(ie, s, U.id === "navigation.previousShot" ? -1 : 1);
      v && ((S = w.current) == null || S.call(w, v.startSec, !1));
    }), U.id === "shot.split" && (A = () => h("split")), U.id === "shot.merge" && (A = () => h("merge")), U.id === "marker.create" && (A = () => a()), U.id === "marker.duplicate" && (A = () => d(!1)), U.id === "marker.duplicateAtPlayhead" && (A = () => d(!0)), U.id === "marker.split" && (A = () => K()), U.id === "marker.editTag" && (A = () => {
      var v;
      if (q.length > 1 && q.some((S) => S.isDerived)) {
        E("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((v = y.data) != null && v.tagReadOnly) {
        E("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      G(!0);
    }), U.id === "marker.setStart" && N && (A = () => r(s, N.endSec)), U.id === "marker.setEnd" && N && (A = () => r(N.startSec, s)), U.id === "marker.copyTiming" && N && (A = () => {
      E(Nd(N) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), U.id === "marker.pasteTiming" && N && (A = () => {
      const v = wd();
      if (!v) {
        E("No copied segment timing is available.");
        return;
      }
      r(v.startSec, v.endSec);
    }), U.id === "marker.mergeSelection" && (A = () => f()), U.id === "marker.moveToBin" && (A = () => b()), U.id === "marker.toggleIncorrectExample" && N && (A = () => oe()), U.id === "marker.openIncorrectExamples" && (A = () => Y(!0)), U.id === "markerGroup.toggleCollapse" && M && (A = () => be(M)), U.id === "markerGroup.toggleAll" && (A = () => re((v) => nd(v, B))), U.id === "marker.assignSlots" && (A = () => {
      var v;
      return (v = le.current) == null ? void 0 : v.click();
    }), U.id === "navigation.zoomIn" && (A = () => W((v) => hr(v + 0.5))), U.id === "navigation.zoomOut" && (A = () => W((v) => hr(v - 0.5))), U.id === "navigation.resetZoom" && (A = () => W(1)), U.id === "navigation.centerPlayhead" && (A = () => {
      var v;
      return (v = o.current) == null ? void 0 : v.call(o);
    }), U.id === "layout.growSwimlanes" && (A = () => me(c.timelineRatio + 0.05)), U.id === "layout.shrinkSwimlanes" && (A = () => me(c.timelineRatio - 0.05)), U.id === "marker.confirm" && N && (A = () => O("approved")), U.id === "system.publishApproved" && (A = () => I(Re.target)), U.id === "marker.reject" && N && (A = () => O("rejected")), U.id === "system.emptyBin" && (A = () => u()), U.id === "system.deleteRejected" && (A = () => l()), A && A();
  }
  function fe(U, Re) {
    const A = Yn.find((v) => v.id === U);
    A && vn(A, i) && ke(A, Re);
  }
  return {
    executeShortcutById: fe,
    stepVideoFrame: (U) => ne(U < 0 ? -1 : 1)
  };
}
function fa(e) {
  return e === !0;
}
function ya() {
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
function ic(e, t, r = !1, o = 0, i = "") {
  const [a, s] = F(null), [l, d] = F(null), [c, m] = F(""), [u, y] = F({
    busy: !1,
    reviewState: null,
    error: ""
  }), g = pe(null);
  async function f(I) {
    y({ busy: !0, reviewState: I, error: "" });
    try {
      await X(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Yr(), reviewState: I })
      }), await t(), y({ busy: !1, reviewState: null, error: "" });
    } catch (x) {
      y({
        busy: !1,
        reviewState: null,
        error: x.message || "Unable to import Cove segments."
      });
    }
  }
  async function b(I) {
    try {
      const x = await X(`/videos/${e}/analysis-runs`, {
        signal: I.signal
      });
      if (!I.isActive()) return null;
      const C = (x == null ? void 0 : x[0]) || null;
      return s(C), (C == null ? void 0 : C.status) === "completed" && g.current !== C.id && (g.current = C.id, await t()), ((C == null ? void 0 : C.status) === "failed" || (C == null ? void 0 : C.status) === "cancelled") && m(C.errorMessage || "Video analysis did not complete."), C;
    } catch (x) {
      return I.isActive() && x.name !== "AbortError" && m(x.message || "Unable to load video analysis status."), null;
    }
  }
  async function h(I = null) {
    m("");
    const x = I || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), C = x.includes("omnishotcut") && o > 0;
    if (!(C && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const O = await X(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: x,
            replaceShotBoundaries: C,
            expectedShotBoundaryFingerprint: C ? i : null
          })
        });
        s(O);
      } catch (O) {
        m(O.message || "Unable to start video analysis.");
      }
  }
  return ye(() => {
    if (!fa(r)) {
      s(null), d(null), m("");
      return;
    }
    const I = ya();
    return b(I), X("/analysis/status", { signal: I.signal }).then((x) => {
      I.isActive() && (d(x), x.configured || m(""));
    }).catch((x) => {
      I.isActive() && x.name !== "AbortError" && m(x.message || "Unable to check video analysis readiness.");
    }), I.dispose;
  }, [e, r]), ye(() => {
    if (!fa(r) || (a == null ? void 0 : a.status) !== "queued" && (a == null ? void 0 : a.status) !== "running") return;
    const I = ya();
    let x = setTimeout(async function C() {
      await b(I), I.isActive() && (x = setTimeout(C, 2500));
    }, 2500);
    return () => {
      clearTimeout(x), I.dispose();
    };
  }, [a == null ? void 0 : a.id, a == null ? void 0 : a.status, r]), {
    analysisError: c,
    analysisRun: a,
    analysisStatus: l,
    importNativeSegments: f,
    nativeImportState: u,
    startFullAnalysis: h
  };
}
const Kn = Object.freeze([]);
function sc(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function lc({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var Mo, Eo, Do, Oo, Po;
  const [m, u] = F(null), [y, g] = F([]), f = pe(null), b = pe(null), h = pe([]), I = pe(null), [x, C] = F(() => wt({})), [O, w] = F(!1), [B, T] = F(Us), [N, D] = F(0), [M, q] = F(null), [re, Y] = F(!1), [$, E] = F(""), [z, G] = F(""), [W, ie] = F(""), [le, K] = F(1), [te, de] = F(vd), [oe, be] = F(0), [me, Q] = F({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [P, ne] = F(Lt), ke = pe(Lt), [fe, U] = F(!1), [Re, A] = F(!1), [v, S] = F(!1), p = pe(!1);
  p.current = v;
  const [k, H] = F(null), [J, _] = F(null), [ue, R] = F(!1), ee = pe(!1), [V, ge] = F(null), [xe, qe] = F(null), Ie = pe(null), [We, Fe] = F(!1), [Ne, Ee] = F(""), at = pe(null), st = pe(null), Z = pe(!1), ce = pe([]), je = pe(!1), [De, he] = F(xd), [He, ze] = F(null), [ve, $e] = F(!1), [Te, Me] = F(!1), [Ge, Ue] = F(!1), [lt, Ke] = F(!1), [Se, Ze] = F(!1), [nt, Xe] = F(""), {
    analysisError: Ae,
    analysisRun: we,
    analysisStatus: Ve,
    importNativeSegments: yt,
    nativeImportState: it,
    startFullAnalysis: jt
  } = ic(
    e.video.id,
    o,
    l,
    ((Mo = e.shotBoundaries) == null ? void 0 : Mo.length) || 0,
    zn(e.shotBoundaries || [])
  ), [rt, Bt] = F(!1), [Wt, bt] = F(null), [Gt, Ut] = F(l), [$r, Kt] = F(0), [sn, ln] = F(!1), [Sn, kn] = F(""), [Tr, Dt] = F(null), Vt = pe(null), wn = pe(null), Ot = pe(!1), [Jt, dn] = F([]), [Nn, Zn] = F(!1), [Xn, Ar] = F(null), In = bd(), Cn = pe(null), er = pe(null), Yt = pe(null), tr = pe(s), $n = pe(null), Tn = pe(null), Qt = pe(null), An = pe(null), Rn = pe(null), ct = pe(null), nr = pe(null), cn = pe(null), rr = pe(null), or = pe(null), Mn = pe(null), En = pe(null), Pt = pe(-1e12), Rr = pe(null), ar = pe(!1), un = pe(null), [Dn, On] = F({ scrollTop: 0, height: 512 });
  ye(() => {
    if (!rt || sn || !Sn) return;
    const L = requestAnimationFrame(() => {
      var se;
      return (se = wn.current) == null ? void 0 : se.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(L);
  }, [rt, sn, Sn]), ye(() => {
    if (!Ot.current || rt || Gt) return;
    const L = requestAnimationFrame(() => {
      var se;
      (se = Vt.current) == null || se.focus({ preventScroll: !0 }), Ot.current = !1;
    });
    return () => cancelAnimationFrame(L);
  }, [rt, Gt]);
  const Qe = e.video, Ye = e.segments || Kn, Mr = _e(() => JSON.stringify({
    segments: Ye.map((L) => [
      L.id,
      L.itemId,
      L.nativeSegmentId,
      L.tagId,
      L.startSec,
      L.endSec,
      L.reviewState,
      L.published,
      L.sourceKey,
      L.sourceRunId,
      L.confidence,
      L.revision,
      L.updatedAt
    ]),
    performerSlots: (e.performerSlots || Kn).map((L) => [
      L.segmentId,
      L.slotDefinitionId,
      L.performerId,
      L.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [Ye, e.performerSlots, e.itemMetadata]);
  ye(() => {
    if (!l) {
      bt(null), Ut(!1);
      return;
    }
    if (M != null) {
      Ut(!0);
      return;
    }
    let L = !0;
    Ut(!0);
    const se = setTimeout(() => {
      X(`/videos/${Qe.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Oe) => {
        L && (bt(Oe), kn(""));
      }).catch((Oe) => {
        L && (bt(null), kn(Oe.message || "Unable to preview derived segments."));
      }).finally(() => {
        L && Ut(!1);
      });
    }, 150);
    return () => {
      L = !1, clearTimeout(se);
    };
  }, [l, Qe.id, Mr, $r, M]);
  const ir = () => Kt((L) => L + 1), Nt = e.segmentGroups || Kn, xt = e.performerSlots || Kn, ot = l && e.performerSlotsAvailable !== !1, mn = _e(
    () => (e.performerCandidates || []).filter((L) => L.isVideoPerformer),
    [e.performerCandidates]
  ), Pn = e.shotBoundaries || Kn, Ln = _e(
    () => li(xt),
    [xt]
  ), Fn = _e(
    () => Ye.map((L) => {
      const se = Ln.get(L.id) || [];
      return {
        ...L,
        slots: se,
        assignment: se.every((Oe) => Oe.performerId == null) ? xl(se, mn) : null
      };
    }).filter((L) => L.slots.length > 0 && L.assignment != null),
    [Ye, Ln, mn]
  ), Zt = Number((Eo = Qe.videoFile) == null ? void 0 : Eo.frameRate) > 0 ? Number(Qe.videoFile.frameRate) : 30;
  function sr() {
    const L = p.current;
    S(!1), L && requestAnimationFrame(() => {
      var se;
      return (se = ct.current) == null ? void 0 : se.focus({ preventScroll: !0 });
    });
  }
  function lr() {
    M == null && (En.current = null, R(!1), E(""), requestAnimationFrame(() => {
      var L;
      return (L = ct.current) == null ? void 0 : L.focus({ preventScroll: !0 });
    }));
  }
  function dr() {
    w(!1), requestAnimationFrame(() => {
      var L, se;
      (L = cn.current) != null && L.isConnected ? cn.current.focus({ preventScroll: !0 }) : (se = ct.current) == null || se.focus({ preventScroll: !0 });
    });
  }
  ye(() => {
    Mn.current === m ? (Mn.current = null, S(!0)) : S(!1);
  }, [m]), ye(() => {
    var se;
    if (!v) return;
    const L = (se = or.current) == null ? void 0 : se.querySelector("input");
    document.activeElement !== L && (L == null || L.focus({ preventScroll: !0 }), L == null || L.select());
  }, [v, m]), ye(() => {
    var se;
    if (v) return;
    const L = (se = ct.current) == null ? void 0 : se.ownerDocument;
    L && L.activeElement === L.body && ct.current.focus({ preventScroll: !0 });
  }, [v]), ye(() => {
    var Oe, et, Ct;
    const L = rn(
      jr(
        e.segments,
        e.performerSlots || [],
        wt({}),
        l && B,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), se = ((Oe = e.segments.find((yn) => yn.id === s)) == null ? void 0 : Oe.id) ?? ((et = ja(L)) == null ? void 0 : et.id) ?? null;
    u(se), g(se == null ? [] : [se]), b.current = se, h.current = [], ze($t(L, se)), C(wt({})), w(!1), En.current = null, R(!1), _(null), K(1), E(""), ne(Lt), ke.current = Lt, U(!1), (Ct = ct.current) == null || Ct.focus({ preventScroll: !0 });
  }, [Qe.id, s]), ye(() => {
    const L = new AbortController();
    return X(`/videos/${Qe.id}/incorrect-examples`, { signal: L.signal }).then(dn).catch((se) => {
      se.name !== "AbortError" && dn([]);
    }), () => L.abort();
  }, [Qe.id, d == null ? void 0 : d.effectiveMode]), ye(() => {
    const L = new AbortController();
    return X(`/videos/${Qe.id}/history`, { signal: L.signal }).then((se) => {
      const Oe = se || Lt;
      ke.current = Oe, ne(Oe);
    }).catch((se) => {
      se.name !== "AbortError" && E(se.message || "Unable to load editor history.");
    }), () => L.abort();
  }, [Qe.id]), ye(() => {
    kd(te);
  }, [te.timelineRatio, te.markerRailOpen, te.detailWidth, te.markerRailWidth, te.swimlaneTitleWidth]), ye(() => {
    Sd(De);
  }, [De]), ye(() => {
    Ks(B);
  }, [B]), ye(() => {
    const L = Tn.current;
    if (!a || !L || typeof ResizeObserver > "u") return;
    const se = () => {
      var Ct;
      const et = Math.max(0, L.clientHeight - (((Ct = Qt.current) == null ? void 0 : Ct.offsetHeight) || 0));
      be(et), de((yn) => {
        const Lo = ao(yn.timelineRatio, et);
        return Lo === yn.timelineRatio ? yn : { ...yn, timelineRatio: Lo };
      });
    }, Oe = new ResizeObserver(se);
    return Oe.observe(L), Qt.current && Oe.observe(Qt.current), se(), () => Oe.disconnect();
  }, [a]), ye(() => {
    if (!In || typeof ResizeObserver > "u") return;
    const L = Rn.current, se = An.current;
    if (!L || !se) return;
    const Oe = () => Q({
      workspace: L.clientWidth,
      focusRow: se.clientWidth,
      focusRowHeight: se.clientHeight
    }), et = new ResizeObserver(Oe);
    return et.observe(L), et.observe(se), Oe(), () => et.disconnect();
  }, [In, te.markerRailOpen]);
  const Xt = _e(
    () => ol(Ye, J),
    [Ye, J]
  ), It = _e(
    () => ia(
      jr(
        Xt,
        xt,
        x,
        l && B,
        Nt
      ),
      Jt,
      !0
    ),
    [
      Xt,
      xt,
      x,
      B,
      Nt,
      l,
      Jt
    ]
  ), Rt = Object.fromEntries(pt.map((L) => [L, It.filter((se) => se.reviewState === L).length])), en = ia(
    jr(
      Xt,
      xt,
      { ...x, reviewStates: pt },
      l && B,
      Nt
    ),
    Jt,
    !0
  ), jn = Object.fromEntries(pt.map((L) => [L, en.filter((se) => se.reviewState === L).length])), Er = [...new Set(Ye.map((L) => L.sourceKey).filter(Boolean))].sort((L, se) => At(L).localeCompare(At(se))), Dr = As(
    x,
    l && B
  ), ut = _e(
    () => rn(It, Nt, xt),
    [It, Nt, xt]
  ), gn = Es(
    ut,
    m,
    s
  ), ae = gn == null ? null : Ye.find((L) => L.id === gn.id) || gn, St = Ho(Ye, Ho(It, y).map((L) => L.id)), j = !l && St.length > 0 && St.every((L) => L.nativeSegmentId != null), Pe = It.map((L) => L.id), mt = Pe.join("|");
  f.current = (ae == null ? void 0 : ae.id) ?? null;
  const dt = Ln.get(ae == null ? void 0 : ae.id) || [], zt = mo(dt), Mt = _e(
    () => Xl(ut, y),
    [ut, y]
  ), Bn = _e(() => go(ut), [ut]), Gn = _e(
    () => Ql(Bn, De),
    [Bn, De]
  ), xi = _e(
    () => di(
      Gn.rows,
      Dn.scrollTop,
      Dn.height
    ),
    [Gn, Dn]
  ), Or = _e(
    () => td(ut, De),
    [ut, De]
  ), Si = br(Or, ae == null ? void 0 : ae.id, -1, !0) != null, ki = br(Or, ae == null ? void 0 : ae.id, 1, !0) != null, pn = ae ? $t(ut, ae.id) : null, Pr = Nt.length > 0 ? Bn.map((L) => L.key) : [], wi = Pr.join("|"), cr = Math.max(
    0,
    Number((Do = Qe.videoFile) == null ? void 0 : Do.duration) || 0,
    ...Ye.map((L) => Number(L.endSec ?? L.startSec) || 0)
  ), yo = Number((Oo = Qe.videoFile) == null ? void 0 : Oo.duration) > 0 ? Number(Qe.videoFile.duration) : null;
  P.actions;
  const Ni = Wa();
  ye(() => {
    const L = m === vr ? m : (ae == null ? void 0 : ae.id) ?? null;
    L !== m && u(L);
  }, [ae, m]), ye(() => {
    g((L) => {
      const se = Ls(
        L,
        Pe,
        (ae == null ? void 0 : ae.id) ?? null
      );
      return se.length === L.length && se.every((Oe, et) => Oe === L[et]) ? L : se;
    });
  }, [mt, ae == null ? void 0 : ae.id]);
  const fn = (ae == null ? void 0 : ae.itemId) == null ? null : ((Po = e.itemMetadata) == null ? void 0 : Po[ae.itemId]) || null, Ii = {
    key: (ae == null ? void 0 : ae.itemId) != null ? `item:${ae.itemId}` : (ae == null ? void 0 : ae.nativeSegmentId) != null ? `native:${ae.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (fn == null ? void 0 : fn.provenance) || (ae == null ? void 0 : ae.fieldProvenance) || [] : []
  }, Lr = (ae == null ? void 0 : ae.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (fn == null ? void 0 : fn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  ye(() => {
    G(ae == null ? "" : String(ae.startSec)), ie((ae == null ? void 0 : ae.endSec) == null ? "" : String(ae.endSec));
  }, [ae == null ? void 0 : ae.id, ae == null ? void 0 : ae.startSec, ae == null ? void 0 : ae.endSec]), ye(() => {
    pn && he((L) => mi(L, pn));
  }, [Qe.id, s, pn]), ye(() => {
    ze((L) => ad(Pr, L, pn));
  }, [Qe.id, wi, pn]), ye(() => {
    if (!te.markerRailOpen || (ae == null ? void 0 : ae.id) == null) return;
    const L = un.current, se = Gn.rows.find((Ct) => Ct.kind === "segment" && Ct.segment.id === ae.id);
    if (!L || !se) return;
    const Oe = se.top + se.height;
    let et = L.scrollTop;
    se.top < L.scrollTop ? et = se.top : Oe > L.scrollTop + L.clientHeight && (et = Math.max(0, Oe - L.clientHeight)), et !== L.scrollTop && (L.scrollTop = et), On({ scrollTop: et, height: L.clientHeight });
  }, [ae == null ? void 0 : ae.id, Gn, te.markerRailOpen]), ye(() => {
    const L = un.current;
    if (!te.markerRailOpen || !L) return;
    const se = () => On({
      scrollTop: L.scrollTop,
      height: L.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      se();
      return;
    }
    const Oe = new ResizeObserver(se);
    return Oe.observe(L), se(), () => Oe.disconnect();
  }, [te.markerRailOpen]);
  const { revealSegmentGroupForSelection: bo, replaceSegmentSelection: Ci, selectSegment: ho, selectSegmentCollection: $i, selectAllVideoSegments: Ti } = tc({
    allSwimlanes: ut,
    editorRef: ct,
    performerSlots: xt,
    seekRef: Cn,
    segmentGroups: Nt,
    segments: Ye,
    selectedSegmentId: m,
    selectedSegmentIds: y,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: h,
    setCollapsedSegmentGroups: he,
    setEditorFilters: C,
    setHideDerivedSegments: T,
    setSaveMessage: E,
    setSelectedSegmentGroupKey: ze,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: g
  }), { acceptHistory: Fr, recordHistoryAction: ur, mutateSegment: Ai, completeReview: Ri, createSegment: vo, splitSegment: xo, duplicateSegment: So, saveTiming: Mi, applyShortcutTiming: Ei } = yd({
    compatibilityMode: l,
    currentTime: N,
    detail: e,
    editorFilters: x,
    endInput: W,
    hideDerivedSegments: B,
    historyRef: ke,
    mediaDuration: yo,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: Pt,
    pendingDuplicateRef: Rr,
    pendingFirstSegmentStartSecRef: En,
    pendingTagEditSegmentIdRef: Mn,
    heldCreatedSegmentTag: J,
    setHeldCreatedSegmentTag: _,
    replaceSegmentSelection: Ci,
    savingSegmentId: M,
    segments: Ye,
    selectedSegment: ae,
    selectedSegmentIdRef: f,
    selectedSegments: St,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: h,
    setCreatingSegmentId: H,
    setEditorFilters: C,
    setFirstSegmentTagOpen: R,
    setHideDerivedSegments: T,
    setHistory: ne,
    setHistoryOpen: U,
    setPublishApprovedError: Ee,
    setSaveMessage: E,
    setSavingSegmentId: q,
    setSelectedSegmentGroupKey: ze,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: g,
    setTagEditing: S,
    startInput: z,
    tagEditingRef: p,
    timelineDuration: cr,
    video: Qe
  });
  function ko(L = null) {
    var et;
    if (!l || M != null || !Ye.some((Ct) => !Ct.published && Ct.reviewState === "approved")) return;
    const se = ((et = ct.current) == null ? void 0 : et.ownerDocument) ?? document, Oe = se.activeElement === se.body ? null : se.activeElement;
    st.current = L != null && L.isConnected && L !== se.body ? L : Oe, Ee(""), Fe(!0);
  }
  function wo() {
    M == null && (Fe(!1), Ee(""), requestAnimationFrame(() => {
      sc(
        st.current,
        ct.current
      ), st.current = null;
    }));
  }
  async function Di() {
    await Ri() && wo();
  }
  const { closeMergeConfirmation: Oi, mergeSelectedSwimlane: No, saveSelectedReviewState: Io } = nc({
    acceptHistory: Fr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: I,
    historyRef: ke,
    mergeSavingRef: ee,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    pendingReviewStateRef: ce,
    recordHistoryAction: ur,
    revealSegmentGroupForSelection: bo,
    reviewSavingRef: Z,
    savingSegmentId: M,
    selectedGroups: Mt,
    selectedSegment: ae,
    selectedSegmentIdRef: f,
    selectedSegments: St,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: h,
    setMergeConfirmation: ge,
    setSaveMessage: E,
    setSavingSegmentId: q,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: g,
    video: Qe
  }), Pi = (L) => {
    ce.current = Xs(
      ce.current,
      L
    );
  };
  ye(() => {
    if (M != null || Z.current) return;
    let L = !1;
    for (; ce.current.length > 0; ) {
      const se = ce.current.shift(), Oe = Qs(se, Ye);
      if (!Oe) {
        L = !0;
        continue;
      }
      Io(
        Oe.requestedState,
        Oe.selectedSegments,
        Oe.selectedSegment
      );
      return;
    }
    L && E("The queued review could not find its segment after refreshing.");
  }, [M, Ye]);
  const { toggleIncorrectExample: Li, removeIncorrectExample: Fi, captureTrainingExport: ji, deleteRejectedSegments: Co, autoAssignPerformers: Bi, previewDerivedSegments: Gi, closeMaterializeDialog: Ui, materializeDerivedSegments: Ki, saveTag: zi, applyHeldCreatedSegmentTag: Hi, moveToBin: _i, emptyRecyclingBin: qi } = rc({
    acceptHistory: Fr,
    allSwimlanes: ut,
    autoAssignCandidates: Fn,
    autoAssigning: Se,
    binEmptyingRef: je,
    canMoveSelectionToBin: j,
    closeTagEditing: sr,
    compatibilityMode: l,
    creatingSegmentId: k,
    detail: e,
    editorFilters: x,
    editorRef: ct,
    exportingExamples: Nn,
    hideDerivedSegments: B,
    incorrectExamples: Jt,
    lineage: Lr,
    materializeButtonRef: Vt,
    materializePreview: Wt,
    materializeRestoreFocusRef: Ot,
    materializing: sn,
    mutateSegment: Ai,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: xt,
    heldCreatedSegmentTag: J,
    setHeldCreatedSegmentTag: _,
    recordHistoryAction: ur,
    refreshMaterializationPreview: ir,
    removingExampleId: Xn,
    revealSegmentGroupForSelection: bo,
    savingSegmentId: M,
    segmentGroups: Nt,
    segments: Ye,
    selectedSegment: ae,
    selectedSegmentIdRef: f,
    selectedSegments: St,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: h,
    setAutoAssignError: Xe,
    setAutoAssignOpen: Ke,
    setAutoAssigning: Ze,
    setEditorFilters: C,
    setExportingExamples: Zn,
    setHideDerivedSegments: T,
    setIncorrectExamples: dn,
    setMaterializeError: kn,
    setMaterializeLoading: Ut,
    setMaterializeOpen: Bt,
    setMaterializePreview: bt,
    setMaterializing: ln,
    setRemovingExampleId: Ar,
    setRejectedDeletionPreview: qe,
    setSaveMessage: E,
    setSavingSegmentId: q,
    setSelectedSegmentGroupKey: ze,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: g,
    video: Qe
  });
  ye(() => {
    const L = J, se = al(L, {
      segments: Ye,
      savingSegmentId: M,
      reviewSaving: Z.current,
      tagEditing: v,
      selectedSegmentIds: y,
      activeSegmentId: ae == null ? void 0 : ae.id
    });
    se === "none" || se === "wait" || (_(null), se === "apply" && Hi(L));
  }, [J, Ye, M, ae == null ? void 0 : ae.id, y, v]);
  const { restoreHistoryTarget: Wi, updateTimelineRatio: $o, handleSeparatorPointerDown: Vi, handleSeparatorPointerMove: Ji, handleSeparatorKeyDown: Yi, panelWidthMaximum: To, panelSeparatorProps: Qi, toggleSegmentRail: Zi, toggleSegmentGroup: Ao, mutateShotBoundary: Xi } = oc({
    acceptHistory: Fr,
    compatibilityMode: l,
    currentTime: N,
    detail: e,
    editorLayout: te,
    focusRowRef: An,
    history: P,
    historyRef: ke,
    historySaving: Re,
    horizontalLayoutSize: me,
    mediaStackHeight: oe,
    mediaStackRef: Tn,
    commonActionsRef: Qt,
    onDetailChange: t,
    onReload: o,
    railToggleRef: nr,
    recordHistoryAction: ur,
    savingSegmentId: M,
    savingShot: re,
    savingShotRef: ar,
    setCollapsedSegmentGroups: he,
    setEditorLayout: de,
    setHistorySaving: A,
    setIncorrectExamples: dn,
    setSaveMessage: E,
    setSavingSegmentId: q,
    setSavingShot: Y,
    shotBoundaries: Pn,
    timelineDuration: cr,
    video: Qe,
    workspaceRef: Rn
  }), { executeShortcutById: Ro, stepVideoFrame: es } = ac({
    allSwimlanes: ut,
    applyShortcutTiming: Ei,
    centerTimelineRef: $n,
    compatibilityMode: l,
    createSegment: vo,
    currentTime: N,
    deleteRejectedSegments: Co,
    duplicateSegment: So,
    editorLayout: te,
    editorRef: ct,
    emptyRecyclingBin: qi,
    lineage: Lr,
    mediaDuration: yo,
    mergeSelectedSwimlane: No,
    moveToBin: _i,
    mutateShotBoundary: Xi,
    openPublishApprovedDialog: ko,
    playbackControlsRef: er,
    playbackShortcutConfig: Ni,
    saveSelectedReviewState: Io,
    seekRef: Cn,
    segmentGroupKeys: Pr,
    selectSegment: ho,
    selectedSegment: ae,
    selectedSegmentGroupForSegment: pn,
    selectedSegmentGroupKey: He,
    selectedSegments: St,
    setCollapsedSegmentGroups: he,
    setIncorrectExamplesOpen: Ue,
    setQuickSearchOpen: Me,
    setSaveMessage: E,
    setSelectedSegmentGroupKey: ze,
    setTagEditing: S,
    setTimelineZoom: K,
    shotBoundaries: Pn,
    slotButtonRef: rr,
    splitSegment: xo,
    swimlanes: Or,
    timelineDuration: cr,
    toggleIncorrectExample: Li,
    toggleSegmentGroup: Ao,
    updateTimelineRatio: $o,
    videoFrameRate: Zt,
    visibleSegments: It
  });
  Yt.current = Ro;
  const ts = _e(() => Yn.map((L) => ({
    id: L.id,
    enabled: vn(L, l),
    surface: "local",
    action: (se) => {
      var Oe;
      return (Oe = Yt.current) == null ? void 0 : Oe.call(Yt, L.id, se);
    }
  })), [l]);
  Ca(no, ts);
  const ns = oo(oe), rs = nn(te.markerRailWidth, To("markerRailWidth")), os = nn(te.detailWidth, To("detailWidth"));
  return n(ec, {
    activeFilterCount: Dr,
    allSwimlanes: ut,
    analysisError: Ae,
    analysisRun: we,
    analysisStatus: Ve,
    approvalFacetCounts: jn,
    autoAssignCandidates: Fn,
    autoAssignError: nt,
    autoAssignOpen: lt,
    autoAssignPerformers: Bi,
    autoAssigning: Se,
    canMoveSelectionToBin: j,
    captureTrainingExport: ji,
    cancelQueuedReviewsForSegments: Pi,
    removeIncorrectExample: Fi,
    rejectedDeletionPreview: xe,
    centerTimelineRef: $n,
    closeEditorFilters: dr,
    closeFirstSegmentTagDialog: lr,
    closeMaterializeDialog: Ui,
    closeMergeConfirmation: Oi,
    closePublishApprovedDialog: wo,
    closeTagEditing: sr,
    collapsedSegmentGroups: De,
    commonActionsRef: Qt,
    compatibilityMode: l,
    configuringTag: Tr,
    createSegment: vo,
    currentTime: N,
    deleteRejectedSegments: Co,
    detail: e,
    detailPanelRef: I,
    detailWidth: os,
    duplicateSegment: So,
    editorFilters: x,
    editorLayout: te,
    editorRef: ct,
    exportingExamples: Nn,
    filtersButtonRef: cn,
    filtersOpen: O,
    firstSegmentTagOpen: ue,
    focusRowRef: An,
    handleSeparatorKeyDown: Yi,
    handleSeparatorPointerDown: Vi,
    handleSeparatorPointerMove: Ji,
    hideDerivedSegments: B,
    history: P,
    historyOpen: fe,
    historySaving: Re,
    hasNextUnreviewed: ki,
    hasPreviousUnreviewed: Si,
    horizontalLayoutSize: me,
    importNativeSegments: yt,
    incorrectExamples: Jt,
    incorrectExamplesOpen: Ge,
    removingExampleId: Xn,
    lineage: Lr,
    markerRailWidth: rs,
    materializeButtonRef: Vt,
    materializeCancelButtonRef: wn,
    materializeDerivedSegments: Ki,
    materializeError: Sn,
    materializeLoading: Gt,
    materializeOpen: rt,
    materializePreview: Wt,
    materializing: sn,
    mediaStackRef: Tn,
    mergeCancelButtonRef: Ie,
    mergeConfirmation: V,
    mergeSavingRef: ee,
    mergeSelectedSwimlane: No,
    nativeImportState: it,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: ko,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: Qi,
    pendingInitialSeekRef: tr,
    performerSlots: xt,
    performerSlotsAvailable: ot,
    playbackControlsRef: er,
    previewDerivedSegments: Gi,
    provenance: Ii,
    provenanceSources: Er,
    publishApprovedCancelButtonRef: at,
    publishApprovedDrafts: Di,
    publishApprovedError: Ne,
    publishApprovedOpen: We,
    quickSearchOpen: Te,
    railScrollRef: un,
    railToggleRef: nr,
    recordHistoryAction: ur,
    restoreHistoryTarget: Wi,
    runEditorAction: Ro,
    stepVideoFrame: es,
    saveMessage: $,
    setSaveMessage: E,
    saveTag: zi,
    saveTiming: Mi,
    savingSegmentId: M,
    setSavingSegmentId: q,
    seekRef: Cn,
    segmentGroups: Nt,
    segmentRailLayout: Gn,
    segments: Ye,
    selectAllVideoSegments: Ti,
    selectSegment: ho,
    selectSegmentCollection: $i,
    selectedGroups: Mt,
    selectedPerformerSlots: dt,
    selectedSegment: gn,
    selectedSegmentGroupKey: He,
    selectedSegmentIds: y,
    selectedSegments: St,
    selectedSlotStatus: zt,
    setAutoAssignError: Xe,
    setAutoAssignOpen: Ke,
    setConfiguringTag: Dt,
    setCurrentTime: D,
    setEditorFilters: C,
    setEditorLayout: de,
    setFiltersOpen: w,
    setHideDerivedSegments: T,
    setHistoryOpen: U,
    setIncorrectExamplesOpen: Ue,
    setQuickSearchOpen: Me,
    setRejectedDeletionPreview: qe,
    setRailViewport: On,
    setSelectedSegmentGroupKey: ze,
    setSelectedSegmentId: u,
    setShortcutsOpen: $e,
    setTimelineZoom: K,
    shotBoundaries: Pn,
    shortcutsOpen: ve,
    slotButtonRef: rr,
    splitLayout: a,
    splitSegment: xo,
    startFullAnalysis: jt,
    tagEditing: v,
    creatingSegmentId: k,
    tagSearchRef: or,
    timelineDuration: cr,
    timelineRatioBounds: ns,
    timelineZoom: le,
    toggleSegmentGroup: Ao,
    toggleSegmentRail: Zi,
    updateTimelineRatio: $o,
    video: Qe,
    videoPerformers: mn,
    visibleCounts: Rt,
    visibleSegmentRailRows: xi,
    visibleSegments: It,
    wideLayout: In,
    workspaceRef: Rn
  });
}
const dc = /* @__PURE__ */ new Set(["queued", "running"]);
async function ba(e, t, r = 4) {
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
function ha(e, t) {
  return { videoId: e, error: (t == null ? void 0 : t.message) || String(t || "Unable to start Full Scan.") };
}
function cc() {
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
async function uc(e, t, r, o) {
  const i = [...new Set(e.map(Number).filter((g) => Number.isInteger(g) && g > 0))], a = [...new Set(t)].filter((g) => ["aiTagging", "omnishotcut"].includes(g));
  if (i.length === 0 || a.length === 0)
    return { queuedIds: [], failed: [], cancelled: !1 };
  const s = a.includes("omnishotcut"), l = await ba(i, async (g) => {
    try {
      const [f, b] = await Promise.all([
        r(`/videos/${g}/analysis-runs`),
        s ? r(`/videos/${g}/editor`) : null
      ]);
      if ((f || []).some((I) => dc.has(I == null ? void 0 : I.status)))
        throw new Error("A Full Scan is already queued or running.");
      const h = (b == null ? void 0 : b.shotBoundaries) || [];
      return { videoId: g, shotBoundaries: h };
    } catch (f) {
      return ha(g, f);
    }
  }), d = l.filter((g) => !g.error), c = l.filter((g) => g.error), m = d.filter((g) => g.shotBoundaries.length > 0), u = m.reduce((g, f) => g + f.shotBoundaries.length, 0);
  if (u > 0 && !o(
    `Replace ${u} existing shot ${u === 1 ? "boundary" : "boundaries"} across ${m.length} selected ${m.length === 1 ? "video" : "videos"} when these scans succeed? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
  )) return { queuedIds: [], failed: c, cancelled: !0 };
  const y = await ba(d, async ({ videoId: g, shotBoundaries: f }) => {
    const b = s && f.length > 0;
    try {
      return await r(`/videos/${g}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: a,
          replaceShotBoundaries: b,
          expectedShotBoundaryFingerprint: b ? zn(f) : null
        })
      }), { videoId: g };
    } catch (h) {
      return ha(g, h);
    }
  });
  return {
    queuedIds: y.filter((g) => !g.error).map((g) => g.videoId),
    failed: [...c, ...y.filter((g) => g.error)],
    cancelled: !1
  };
}
function mc(e = [], t = []) {
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
function gc(e = [], t = "", r = "all") {
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
function gt(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function pc(e = [], t = []) {
  var g;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((f, b) => (f.sortOrder ?? 0) - (b.sortOrder ?? 0) || Number(f.id) - Number(b.id)).forEach((f, b) => {
    [...f.tags || []].sort((h, I) => (h.sortOrder ?? 0) - (I.sortOrder ?? 0) || Number(h.tagId) - Number(I.tagId)).forEach((h, I) => r.set(Number(h.tagId), {
      key: `group:${f.id}`,
      id: f.id,
      name: f.name,
      sortOrder: f.sortOrder ?? b,
      tagSortOrder: h.sortOrder ?? I
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(f, b) {
    const h = Number(f);
    if (!o.has(h)) {
      const I = r.get(h);
      o.set(h, {
        tagId: h,
        name: b || `Tag ${h}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (I == null ? void 0 : I.key) || "ungrouped",
        segmentGroupId: (I == null ? void 0 : I.id) ?? null,
        segmentGroupName: (I == null ? void 0 : I.name) || "Ungrouped",
        segmentGroupSortOrder: (I == null ? void 0 : I.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (I == null ? void 0 : I.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(h);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((f) => {
    const b = i(f.sourceTagId, f.sourceTagName), h = i(f.derivedTagId, f.derivedTagName);
    b.outgoingRuleCount++, h.incomingRuleCount++;
    const I = `${b.tagId}:${h.tagId}`;
    a.has(I) || a.set(I, {
      id: I,
      sourceTagId: b.tagId,
      derivedTagId: h.tagId,
      rules: [],
      edgeCount: 0
    });
    const x = a.get(I);
    x.rules.push(f), x.edgeCount += Number(f.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((f) => [f.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((f) => {
    var b, h;
    (b = d.get(f.sourceTagId)) == null || b.add(f.derivedTagId), (h = d.get(f.derivedTagId)) == null || h.add(f.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), m = [];
  for (const f of s) {
    if (c.has(f.tagId)) continue;
    const b = [f.tagId], h = [];
    for (c.add(f.tagId); b.length > 0; ) {
      const T = b.shift();
      h.push(T);
      for (const N of d.get(T) || [])
        c.has(N) || (c.add(N), b.push(N));
    }
    const I = new Set(h), x = h.map((T) => o.get(T)), C = l.filter((T) => I.has(T.sourceTagId) && I.has(T.derivedTagId)), O = C.flatMap((T) => T.rules), w = x.filter((T) => T.outgoingRuleCount === 0).sort((T, N) => gt(T.name, N.name)), B = w.length > 0 ? w : [...x].sort((T, N) => gt(T.name, N.name));
    m.push({
      id: [...h].sort((T, N) => T - N).join(":"),
      label: B.length > 1 ? `${B[0].name} + ${B.length - 1}` : ((g = B[0]) == null ? void 0 : g.name) || "Derivation component",
      nodes: x,
      connections: C,
      rules: O,
      segmentGroupKeys: [...new Set(x.map((T) => T.segmentGroupKey))],
      materializedEdgeCount: O.reduce(
        (T, N) => T + (Number(N.edgeCount) || 0),
        0
      )
    });
  }
  m.sort((f, b) => b.rules.length - f.rules.length || gt(f.label, b.label));
  const u = /* @__PURE__ */ new Map();
  s.forEach((f) => {
    u.has(f.segmentGroupKey) || u.set(f.segmentGroupKey, {
      key: f.segmentGroupKey,
      id: f.segmentGroupId,
      name: f.segmentGroupName,
      sortOrder: f.segmentGroupSortOrder,
      nodes: [],
      ruleIds: /* @__PURE__ */ new Set(),
      componentIds: /* @__PURE__ */ new Set()
    }), u.get(f.segmentGroupKey).nodes.push(f);
  }), m.forEach((f) => {
    f.nodes.forEach((b) => {
      var h;
      return (h = u.get(b.segmentGroupKey)) == null ? void 0 : h.componentIds.add(f.id);
    }), f.rules.forEach((b) => {
      var h, I;
      (h = u.get(o.get(Number(b.sourceTagId)).segmentGroupKey)) == null || h.ruleIds.add(b.id), (I = u.get(o.get(Number(b.derivedTagId)).segmentGroupKey)) == null || I.ruleIds.add(b.id);
    });
  });
  const y = [...u.values()].sort((f, b) => f.sortOrder - b.sortOrder || gt(f.name, b.name)).map((f) => ({
    ...f,
    ruleCount: f.ruleIds.size,
    componentCount: f.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: m,
    segmentGroups: y
  };
}
function fc(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const m = new Map(e.nodes.map((D) => [D.tagId, /* @__PURE__ */ new Set()])), u = new Map(e.nodes.map((D) => [D.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((D) => {
    var M, q;
    (M = m.get(D.sourceTagId)) == null || M.add(D.derivedTagId), (q = u.get(D.derivedTagId)) == null || q.add(D.sourceTagId);
  });
  const y = new Map(e.nodes.map((D) => {
    var M;
    return [
      D.tagId,
      ((M = u.get(D.tagId)) == null ? void 0 : M.size) || 0
    ];
  })), g = new Map(e.nodes.map((D) => [D.tagId, 0])), f = e.nodes.filter((D) => y.get(D.tagId) === 0).sort((D, M) => gt(D.name, M.name)).map((D) => D.tagId), b = /* @__PURE__ */ new Set();
  for (; f.length > 0; ) {
    const D = f.shift();
    if (!b.has(D)) {
      b.add(D);
      for (const M of m.get(D) || [])
        g.set(M, Math.max(g.get(M) || 0, (g.get(D) || 0) + 1)), y.set(M, y.get(M) - 1), y.get(M) === 0 && f.push(M);
    }
  }
  b.size !== e.nodes.length && e.nodes.filter((D) => !b.has(D.tagId)).sort((D, M) => gt(D.name, M.name)).forEach((D) => g.set(D.tagId, 0));
  const h = Math.max(0, ...g.values()), I = Math.max(
    t,
    240 + h * 296
  ), x = /* @__PURE__ */ new Map();
  e.nodes.forEach((D) => {
    x.has(D.segmentGroupKey) || x.set(D.segmentGroupKey, {
      key: D.segmentGroupKey,
      id: D.segmentGroupId,
      name: D.segmentGroupName,
      sortOrder: D.segmentGroupSortOrder,
      nodes: []
    }), x.get(D.segmentGroupKey).nodes.push(D);
  });
  const C = [...x.values()].sort((D, M) => D.sortOrder - M.sortOrder || gt(D.name, M.name));
  let O = 28;
  const w = [], B = C.map((D) => {
    const M = /* @__PURE__ */ new Map();
    D.nodes.forEach((E) => {
      const z = g.get(E.tagId) || 0;
      M.has(z) || M.set(z, []), M.get(z).push(E);
    });
    for (const E of M.values())
      E.sort((z, G) => z.segmentGroupTagSortOrder - G.segmentGroupTagSortOrder || gt(z.name, G.name));
    const q = Math.max(1, ...[...M.values()].map((E) => E.length)), re = q * 58 + (q - 1) * 18, Y = 70 + re, $ = {
      ...D,
      x: 12,
      y: O,
      width: I - 24,
      height: Y
    };
    for (const [E, z] of M.entries()) {
      const G = z.length * 58 + Math.max(0, z.length - 1) * 18, W = (re - G) / 2;
      z.forEach((ie, le) => w.push({
        ...ie,
        rank: E,
        x: 28 + E * 296,
        y: O + 34 + 18 + W + le * 76,
        width: 184,
        height: 58
      }));
    }
    return O += Y + 16, $;
  }), T = new Map(w.map((D) => [D.tagId, D])), N = e.connections.map((D) => {
    const M = T.get(D.sourceTagId), q = T.get(D.derivedTagId), re = M.x + M.width, Y = M.y + M.height / 2, $ = q.x, E = q.y + q.height / 2, z = Math.max(48, ($ - re) * 0.48);
    return {
      ...D,
      path: `M ${re} ${Y} C ${re + z} ${Y}, ${$ - z} ${E}, ${$} ${E}`
    };
  });
  return {
    width: I,
    height: Math.max(r, O - 16 + 28),
    nodes: w,
    connections: N,
    groups: B
  };
}
function yc(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = fc(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), m = 20, u = o, y = c.nodes.map((f) => ({
      ...f,
      x: f.x + m,
      y: f.y + u
    })), g = new Map(y.map((f) => [f.tagId, f]));
    a.push(...y), l.push(...c.groups.map((f) => ({
      ...f,
      componentId: d.id,
      x: f.x + m,
      y: f.y + u
    }))), s.push(...c.connections.map((f) => {
      const b = g.get(f.sourceTagId), h = g.get(f.derivedTagId), I = b.x + b.width, x = b.y + b.height / 2, C = h.x, O = h.y + h.height / 2, w = Math.max(48, (C - I) * 0.48);
      return {
        ...f,
        componentId: d.id,
        path: `M ${I} ${x} C ${I + w} ${x}, ${C - w} ${O}, ${C} ${O}`
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
function va(e, t = []) {
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
function bc(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function hc(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: m, editorRef: u, emptyDraft: y, graph: g, layout: f, listSort: b, materializationOffer: h, materializeOutgoingRules: I, materializeRule: x, message: C, normalizedQuery: O, query: w, refreshConfiguredTag: B, revealEditor: T, rules: N, save: D, segmentGroupKey: M, selectedNode: q, selectedRule: re, selection: Y, setConfiguringTag: $, setDraft: E, setListSort: z, setMaterializationOffer: G, setQuery: W, setSegmentGroupKey: ie, setSelection: le, setView: K, sortedVisibleRules: te, sourceSlots: de, sourceSlotsLoading: oe, updateMapping: be, updateTag: me, view: Q, visibleComponents: P, visibleRules: ne } = e;
  function ke(v) {
    const S = g.nodes.find((k) => k.tagId === Number(v.sourceTagId)), p = g.nodes.find((k) => k.tagId === Number(v.derivedTagId));
    return (S == null ? void 0 : S.segmentGroupKey) === (p == null ? void 0 : p.segmentGroupKey) ? S.segmentGroupKey : "cross-group";
  }
  function fe() {
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
          onClick: () => E(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      n("div", { key: "tags", className: "space-y-3" }, [
        n("div", { key: "source", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Source tag (specific)"),
            n(_n, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (v, S) => me("source", v, S == null ? void 0 : S.label),
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
              onClick: (v) => $({
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
            n(_n, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (v, S) => me("derived", v, S == null ? void 0 : S.label),
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
              onClick: (v) => $({
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
            disabled: r || de.length === 0 || s.length === 0,
            onClick: () => E((v) => ({
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
          ...d.slotMappings.map((v, S) => n("div", { key: S, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: v.sourceSlotDefinitionId,
              disabled: r,
              onChange: (p) => be(S, "sourceSlotDefinitionId", p.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${S + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...de.map((p) => n("option", { key: p.id, value: p.id }, ft(p)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: v.derivedSlotDefinitionId,
              disabled: r,
              onChange: (p) => be(S, "derivedSlotDefinitionId", p.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${S + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((p) => n("option", { key: p.id, value: p.id }, ft(p)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => E((p) => ({
                ...p,
                slotMappings: p.slotMappings.filter((k, H) => H !== S)
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
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((v) => !v.sourceSlotDefinitionId || !v.derivedSlotDefinitionId),
          onClick: D,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => E(null), className: o }, "Cancel")
      ])
    ]);
  }
  function U() {
    if (q) {
      const p = ne.filter((J) => Number(J.derivedTagId) === q.tagId), k = ne.filter((J) => Number(J.sourceTagId) === q.tagId), H = (J, _, ue) => n("div", {
        key: J.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, _),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${J.sourceTagName} → ${J.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          ue ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => x(J),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => m(J, !0),
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
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, q.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, q.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${q.incomingRuleCount} incoming · ${q.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (J) => $({
            tagId: q.tagId,
            tagName: q.name,
            trigger: J.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        k.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => I(q, k),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${k.length})`) : null,
        k.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...k.map((J) => H(J, "Derives", !0))
        ]) : null,
        p.length ? n("details", {
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
              p.length
            )
          ]),
          n(
            "div",
            { key: "rules", className: "space-y-2 border-t border-border p-2" },
            p.map((J) => H(J, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!re)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const v = g.nodes.find((p) => p.tagId === Number(re.sourceTagId)), S = g.nodes.find((p) => p.tagId === Number(re.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (v == null ? void 0 : v.segmentGroupName) || "Ungrouped"),
          (v == null ? void 0 : v.segmentGroupKey) !== (S == null ? void 0 : S.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(S == null ? void 0 : S.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${re.sourceTagName} → ${re.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${re.edgeCount} materialized lineage edge${re.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (h == null ? void 0 : h.ruleId) === re.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => x(re, h),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => G(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        re.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : re.slotMappings.map((p, k) => n("div", {
          key: `${p.sourceSlotDefinitionId}:${p.derivedSlotDefinitionId}`,
          className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
        }, [
          n(
            "span",
            { key: "source", className: "truncate text-foreground", title: p.sourceSlotLabel || "Unnamed slot" },
            p.sourceSlotLabel || "Unnamed slot"
          ),
          n("span", { key: "arrow", className: "text-secondary" }, "→"),
          n(
            "span",
            { key: "derived", className: "truncate text-foreground", title: p.derivedSlotLabel || "Unnamed slot" },
            p.derivedSlotLabel || "Unnamed slot"
          )
        ]))
      ]),
      n("dl", { key: "metadata", className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-xs" }, [
        n("dt", { key: "created-label", className: "text-secondary" }, "Created"),
        n(
          "dd",
          { key: "created", className: "text-right text-foreground" },
          re.createdAt ? new Date(re.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          re.updatedAt ? new Date(re.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => x(re),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => m(re),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(re),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function Re() {
    if (P.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, O ? "No derivation relationships match your search." : "No derivation rules.");
    const v = q == null ? void 0 : q.tagId, S = /* @__PURE__ */ new Set();
    return q && (S.add(q.tagId), f.connections.forEach((p) => {
      (p.sourceTagId === q.tagId || p.derivedTagId === q.tagId) && (S.add(p.sourceTagId), S.add(p.derivedTagId));
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
        ...f.groups.map((p) => n("div", {
          key: `group:${p.componentId}:${p.key}`,
          className: `absolute rounded-xl border ${M === p.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
          style: {
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.width}px`,
            height: `${p.height}px`
          }
        }, n("div", {
          className: "absolute left-3 top-2 max-w-[16rem] truncate text-[11px] font-semibold uppercase tracking-wide text-secondary",
          title: p.name
        }, p.name))),
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
          ...f.connections.map((p) => {
            const k = v === p.sourceTagId || v === p.derivedTagId, H = q != null, J = k ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${p.id}:visible`,
              d: p.path,
              fill: "none",
              stroke: J,
              strokeWidth: k ? 2.5 : 1.5,
              opacity: H && !k ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...f.nodes.map((p) => {
          const k = !O || p.name.toLocaleLowerCase().includes(O), H = q != null, J = S.has(p.tagId), _ = (q == null ? void 0 : q.tagId) === p.tagId;
          return n("button", {
            key: `node:${p.tagId}`,
            type: "button",
            onClick: () => le({ type: "node", id: p.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${_ ? "border-accent bg-accent/15 ring-2 ring-accent/25" : J ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.width}px`,
              height: `${p.height}px`,
              opacity: !k || H && !J ? 0.62 : 1
            },
            title: `${p.name} — ${p.segmentGroupName}`,
            "aria-label": `${p.name}, ${p.incomingRuleCount} incoming and ${p.outgoingRuleCount} outgoing derivation rules`
          }, [
            n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground" }, p.name),
            n("span", { key: "counts", className: "mt-1 flex items-center gap-2 text-[11px] text-secondary" }, [
              n("span", { key: "in" }, `${p.incomingRuleCount} in`),
              n("span", { key: "arrow", "aria-hidden": "true" }, "→"),
              n("span", { key: "out" }, `${p.outgoingRuleCount} out`)
            ])
          ]);
        }),
        ...f.connections.filter((p) => p.rules.length > 1).map((p) => {
          const k = f.nodes.find((J) => J.tagId === p.sourceTagId), H = f.nodes.find((J) => J.tagId === p.derivedTagId);
          return n("div", {
            key: `bundle:${p.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(k.x + k.width + H.x) / 2 - 24}px`,
              top: `${(k.y + k.height / 2 + H.y + H.height / 2) / 2 - 10}px`
            },
            "aria-label": `${p.rules.length} rules connect ${p.rules[0].sourceTagName} to ${p.rules[0].derivedTagName}`
          }, `${p.rules.length} rules`);
        })
      ])
    ]);
  }
  function A() {
    if (P.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        O ? "No derivation relationships match your search." : "No derivation rules."
      );
    const v = /* @__PURE__ */ new Map();
    te.forEach((p) => {
      const k = ke(p);
      v.has(k) || v.set(k, []), v.get(k).push(p);
    });
    const S = [
      ...g.segmentGroups.map((p) => p.key),
      "cross-group"
    ].filter((p) => v.has(p));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, S.map((p) => {
      const k = g.segmentGroups.find((_) => _.key === p), H = p === "cross-group" ? "Cross-group relationships" : (k == null ? void 0 : k.name) || "Ungrouped", J = v.get(p);
      return n("section", { key: p, "aria-label": H }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, H),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${J.length} rule${J.length === 1 ? "" : "s"}`
          )
        ]),
        n("div", { key: "table", role: "table", "aria-label": `${H} derivation rules` }, [
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
          ...J.map((_) => n("button", {
            key: _.id,
            type: "button",
            role: "row",
            onClick: () => le({ type: "rule", id: _.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(re == null ? void 0 : re.id) === _.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${_.sourceTagName} → ${_.derivedTagName}` },
              `${_.sourceTagName} → ${_.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(_.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(_.edgeCount))
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
          `${N.length} rules · ${g.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          E(y()), le(null), T();
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
          value: w,
          onChange: (v) => {
            W(v.target.value), le(null);
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
          value: M,
          disabled: d != null,
          onChange: (v) => {
            ie(v.target.value), le(null), E(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...g.segmentGroups.map((v) => n("option", { key: v.key, value: v.key }, v.name))
        ])
      ]),
      Q === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: b,
          onChange: (v) => z(v.target.value),
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
        ].map(([v, S]) => n("button", {
          key: v,
          type: "button",
          onClick: () => {
            K(v), v === "graph" && (Y == null ? void 0 : Y.type) === "rule" && le(null);
          },
          "aria-pressed": Q === v,
          className: `rounded px-3 py-1.5 text-sm font-medium ${Q === v ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
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
        Q === "graph" ? Re() : A()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? fe() : U()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      C ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, C) : null
    ]),
    i ? n(fo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => B(i),
      onClose: () => {
        const v = i.trigger;
        $(null), requestAnimationFrame(() => {
          v != null && v.isConnected && v.focus();
        });
      }
    }) : null
  ]);
}
function vc({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = F([]), [a, s] = F(null), [l, d] = F([]), [c, m] = F([]), [u, y] = F(!1), [g, f] = F(!1), [b, h] = F(!1), [I, x] = F(""), [C, O] = F(""), [w, B] = F("graph"), [T, N] = F("all"), [D, M] = F(null), [q, re] = F("relationship"), [Y, $] = F(null), [E, z] = F(null), G = pe(null), W = pe(null), ie = Xa().replace(/:/g, "");
  function le() {
    requestAnimationFrame(() => {
      var R;
      return (R = G.current) == null ? void 0 : R.scrollIntoView({ block: "nearest" });
    });
  }
  async function K(R) {
    const ee = await X("/derivation-rules", R ? { signal: R } : void 0);
    i(ee || []);
  }
  ye(() => {
    const R = new AbortController();
    return K(R.signal).catch((ee) => {
      ee.name !== "AbortError" && x(ee.message || "Unable to load derived segment rules.");
    }), () => R.abort();
  }, []), ye(() => {
    const R = new AbortController();
    return a != null && a.sourceTagId ? (y(!0), X(`/slot-definitions/${a.sourceTagId}`, { signal: R.signal }).then((ee) => d(ee.definitions || [])).catch((ee) => {
      ee.name !== "AbortError" && d([]);
    }).finally(() => {
      R.signal.aborted || y(!1);
    })) : (d([]), y(!1)), a != null && a.derivedTagId ? (f(!0), X(`/slot-definitions/${a.derivedTagId}`, { signal: R.signal }).then((ee) => m(ee.definitions || [])).catch((ee) => {
      ee.name !== "AbortError" && m([]);
    }).finally(() => {
      R.signal.aborted || f(!1);
    })) : (m([]), f(!1)), () => R.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), ye(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || u || g)
      return;
    const R = `${a.sourceTagId}:${a.derivedTagId}`;
    W.current !== R && (W.current = R, s((ee) => !ee || Number(ee.sourceTagId) !== Number(a.sourceTagId) || Number(ee.derivedTagId) !== Number(a.derivedTagId) ? ee : ql(ee, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    u,
    g
  ]);
  function te(R, ee = !1) {
    ee || M({ type: "rule", id: R.id }), W.current = null, s({
      ruleId: R.id,
      sourceTagId: R.sourceTagId,
      sourceTagName: R.sourceTagName,
      derivedTagId: R.derivedTagId,
      derivedTagName: R.derivedTagName,
      slotMappings: R.slotMappings.map((V) => ({
        sourceSlotDefinitionId: V.sourceSlotDefinitionId,
        derivedSlotDefinitionId: V.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), x(""), le();
  }
  function de(R, ee, V = "") {
    W.current = null, R === "source" ? (d([]), y(ee != null)) : (m([]), f(ee != null)), s((ge) => ({
      ...ge,
      [`${R}TagId`]: ee == null ? null : Number(ee),
      [`${R}TagName`]: V || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function oe(R) {
    (a == null ? void 0 : a.ruleId) == null && (W.current = null);
    const ee = [K(), t == null ? void 0 : t()];
    return R.draftKind === "source" ? (y(!0), ee.push(X(`/slot-definitions/${R.tagId}`).then((V) => d(V.definitions || [])).finally(() => y(!1)))) : R.draftKind === "derived" && (f(!0), ee.push(X(`/slot-definitions/${R.tagId}`).then((V) => m(V.definitions || [])).finally(() => f(!1)))), Promise.all(ee);
  }
  function be(R, ee, V) {
    s((ge) => ({
      ...ge,
      slotMappings: ge.slotMappings.map((xe, qe) => qe === R ? { ...xe, [ee]: V } : xe)
    }));
  }
  async function me() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const R = va(a, o);
    if (R) {
      x(R.message);
      return;
    }
    if (a.slotMappings.some((ee) => !ee.sourceSlotDefinitionId || !ee.derivedSlotDefinitionId)) {
      x("Complete or remove every performer slot mapping before saving.");
      return;
    }
    h(!0), x(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let ee = null;
      if (a.ruleId != null) {
        const ge = await X(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${ge.deletedSegmentCount}
Removed lineage edges: ${ge.removedEdgeCount}
Shared derived segments retained: ${ge.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        ee = ge.fingerprint;
      }
      x("Saving derived segment rule…");
      const V = await X("/derivation-rules", {
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
      if (await K(), M(w === "graph" ? { type: "node", id: Number(V.sourceTagId) } : { type: "rule", id: V.id }), s(null), a.ruleId == null)
        try {
          const ge = await X(
            `/derivation-rules/${V.id}/materialization/preview`,
            { method: "POST" }
          );
          $(
            ge.createCount + ge.linkCount > 0 ? ge : null
          ), x(ge.createCount + ge.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          $(null), x("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        $(null), x("Derived segment rule saved. Previous materializations were removed.");
    } catch (ee) {
      x(ee.message || "Unable to save derived segment rule.");
    } finally {
      h(!1);
    }
  }
  async function Q(R) {
    h(!0), x("Previewing rule deletion…");
    try {
      const ee = await X(
        `/derivation-rules/${R.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${R.sourceTagName} → ${R.derivedTagName}?

Deleted segments: ${ee.deletedSegmentCount}
Removed lineage edges: ${ee.removedEdgeCount}
Shared derived segments retained: ${ee.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const V = `derivation-rule-delete:${R.id}:${ee.fingerprint}`;
      await X(`/derivation-rules/${R.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(V),
          fingerprint: ee.fingerprint
        })
      }), Be(V), await K(), (a == null ? void 0 : a.ruleId) === R.id && s(null), (D == null ? void 0 : D.type) === "rule" && D.id === R.id && M(null), (Y == null ? void 0 : Y.ruleId) === R.id && $(null), x(`Rule deleted with ${ee.deletedSegmentCount} exclusively derived segment${ee.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (ee) {
      x(ee.message || "Unable to delete derived segment rule.");
    } finally {
      h(!1);
    }
  }
  async function P(R, ee = null) {
    const V = ee || await X(
      `/derivation-rules/${R.id}/materialization/preview`,
      { method: "POST" }
    );
    if (V.createCount + V.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const ge = `derivation-rule-materialize:${R.id}:${V.fingerprint}`, xe = await X(`/derivation-rules/${R.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Le(ge),
        fingerprint: V.fingerprint
      })
    });
    return Be(ge), xe;
  }
  async function ne(R, ee = null) {
    h(!0), x("Finding pending derivations…");
    try {
      const V = await P(R, ee);
      if ($(null), await K(), V.createdCount + V.linkedCount === 0) {
        x("Every applicable derivation is already materialized.");
        return;
      }
      x(
        `${V.createdCount} derived segment${V.createdCount === 1 ? "" : "s"} created and ${V.linkedCount} existing segment${V.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (V) {
      x(V.message || "Unable to materialize pending derivations.");
    } finally {
      h(!1);
    }
  }
  async function ke(R, ee) {
    if (ee.length === 0) return;
    h(!0), x(`Finding pending derivations from ${R.name}…`);
    let V = 0, ge = 0;
    try {
      for (const xe of ee) {
        const qe = await P(xe);
        V += qe.createdCount, ge += qe.linkedCount;
      }
      $(null), await K(), x(V + ge === 0 ? `Every outgoing derivation from ${R.name} is already materialized.` : `${V} derived segment${V === 1 ? "" : "s"} created and ${ge} existing segment${ge === 1 ? "" : "s"} linked from ${R.name}.`);
    } catch (xe) {
      await K().catch(() => {
      }), x(xe.message || `Unable to materialize derivations from ${R.name}.`);
    } finally {
      h(!1);
    }
  }
  const fe = va(a, o), U = _e(
    () => pc(o, e),
    [o, e]
  ), Re = C.trim().toLocaleLowerCase(), v = U.components.filter((R) => T === "all" || R.segmentGroupKeys.includes(T)).filter((R) => !Re || R.nodes.some((ee) => ee.name.toLocaleLowerCase().includes(Re))), S = v.flatMap((R) => R.rules), p = new Set(
    v.flatMap((R) => R.nodes.map((ee) => ee.tagId))
  ), k = _e(
    () => yc(v),
    [v]
  ), H = w === "list" ? bc(
    D,
    S,
    Re.length > 0
  ) : null, J = (D == null ? void 0 : D.type) === "node" && U.nodes.find((R) => R.tagId === D.id && p.has(R.tagId)) || null, _ = [...S].sort((R, ee) => q === "source" ? gt(R.sourceTagName, ee.sourceTagName) || gt(R.derivedTagName, ee.derivedTagName) : q === "target" ? gt(R.derivedTagName, ee.derivedTagName) || gt(R.sourceTagName, ee.sourceTagName) : q === "materialized" ? (Number(ee.edgeCount) || 0) - (Number(R.edgeCount) || 0) || gt(R.sourceTagName, ee.sourceTagName) : gt(
    `${R.sourceTagName} ${R.derivedTagName}`,
    `${ee.sourceTagName} ${ee.derivedTagName}`
  ));
  return n(hc, {
    arrowMarkerId: ie,
    busy: b,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: E,
    deleteRule: Q,
    derivedSlots: c,
    derivedSlotsLoading: g,
    draft: a,
    draftIssue: fe,
    editRule: te,
    editorRef: G,
    emptyDraft: r,
    graph: U,
    layout: k,
    listSort: q,
    materializationOffer: Y,
    materializeOutgoingRules: ke,
    materializeRule: ne,
    message: I,
    normalizedQuery: Re,
    query: C,
    refreshConfiguredTag: oe,
    revealEditor: le,
    rules: o,
    save: me,
    segmentGroupKey: T,
    selectedNode: J,
    selectedRule: H,
    selection: D,
    setConfiguringTag: z,
    setDraft: s,
    setListSort: re,
    setMaterializationOffer: $,
    setQuery: O,
    setSegmentGroupKey: N,
    setSelection: M,
    setView: B,
    sortedVisibleRules: _,
    sourceSlots: l,
    sourceSlotsLoading: u,
    updateMapping: be,
    updateTag: de,
    view: w,
    visibleComponents: v,
    visibleRules: S
  });
}
function xc() {
  const [e, t] = F(Wa), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => Jo({ ...l, [a]: s }));
  }
  function i() {
    t(Jo(ro));
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
function Sc({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = F([]), [a, s] = F(!1), [l, d] = F(!1), [c, m] = F(""), [u, y] = F(""), [g, f] = F("all"), [b, h] = F(() => /* @__PURE__ */ new Set()), [I, x] = F(null);
  ye(() => {
    if (!e || a) return;
    const $ = new AbortController();
    return d(!0), m(""), X("/slot-definitions", { signal: $.signal }).then((E) => {
      i(E || []), s(!0);
    }).catch((E) => {
      E.name !== "AbortError" && m(E.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      $.signal.aborted || d(!1);
    }), () => $.abort();
  }, [e, a]);
  async function C() {
    d(!0), m("");
    try {
      const $ = await X("/slot-definitions");
      i($ || []), s(!0);
    } catch ($) {
      m($.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function O() {
    const [$] = await Promise.all([
      X("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i($ || []), s(!0), m("");
  }
  function w() {
    const $ = I == null ? void 0 : I.trigger;
    x(null), requestAnimationFrame(() => {
      $ != null && $.isConnected && $.focus({ preventScroll: !0 });
    });
  }
  function B($) {
    h((E) => {
      const z = new Set(E);
      return z.has($) ? z.delete($) : z.add($), z;
    });
  }
  const T = _e(
    () => mc(t, o),
    [t, o]
  ), N = _e(
    () => gc(T, u, g),
    [T, u, g]
  ), D = T.flatMap(($) => $.tags), M = D.filter(($) => $.definitions.length > 0).length, q = D.length - M, re = [
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
        `${D.length} tags · ${M} with slots · ${q} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: u,
          onChange: ($) => y($.target.value),
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
          re.map(([$, E]) => n("button", {
            key: $,
            type: "button",
            onClick: () => f($),
            "aria-pressed": g === $,
            className: `rounded px-3 py-1.5 text-xs font-medium ${g === $ ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, E))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => h(/* @__PURE__ */ new Set()),
          className: Y
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => h(new Set(T.map(($) => $.overviewKey))),
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
        onClick: C,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && N.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, N.map(($) => {
      const E = b.has($.overviewKey), z = $.tags.filter((G) => G.definitions.length > 0).length;
      return n("article", {
        key: $.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => B($.overviewKey),
          "aria-expanded": !E,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, E ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, $.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${$.tags.length} tag${$.tags.length === 1 ? "" : "s"} · ${z} with slots`
          )
        ]),
        E ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          $.tags.map((G) => n("li", {
            key: G.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: G.tagName }, G.tagName),
              G.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            G.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${G.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, G.definitions.map((W) => n("li", {
              key: W.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, ft(W)),
              ...(W.genderHints || []).map((ie) => n("span", {
                key: ie,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, Nr(ie)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (W) => x({
                tagId: G.tagId,
                tagName: G.tagName,
                trigger: W.currentTarget
              }),
              "aria-label": `Edit performer slots for ${G.tagName}`,
              className: `${Y} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    I ? n(fo, {
      key: `performer-slots-configure:${I.tagId}`,
      tagId: I.tagId,
      tagName: I.tagName,
      onSaved: O,
      onClose: w
    }) : null
  ]);
}
function kc({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = F("general"), [a, s] = F([]), [l, d] = F(!1), [c, m] = F(""), [u, y] = F(""), [g, f] = F(null), [b, h] = F(!0), [I, x] = F(!1), [C, O] = F(""), [w, B] = F(!0), [T, N] = F(Ga), D = ul(t), M = D.map(([E]) => E);
  ye(() => {
    M.includes(o) || i(M[0] || "general");
  }, [t.effectiveMode]);
  async function q(E) {
    const z = await X("/segment-groups", E ? { signal: E } : void 0);
    s(z || []);
  }
  ye(() => {
    const E = new AbortController();
    return q(E.signal).catch((z) => {
      z.name !== "AbortError" && m(z.message || "Unable to load tag groups.");
    }), () => E.abort();
  }, []), ye(() => {
    if (t.effectiveMode !== "full") {
      h(!1);
      return;
    }
    const E = new AbortController();
    return O(""), h(!0), Promise.all([
      X("/analysis/settings", { signal: E.signal }),
      X("/analysis/status", { signal: E.signal })
    ]).then(([z, G]) => {
      B(!0), y((z == null ? void 0 : z.baseUrl) || ""), f(G);
    }).catch((z) => {
      if (z.name !== "AbortError") {
        if (z.status === 403) {
          B(!1), O("You do not have permission to manage the analysis service connection.");
          return;
        }
        O(z.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      E.signal.aborted || h(!1);
    }), () => E.abort();
  }, [t.effectiveMode]);
  async function re(E) {
    if (E !== t.requestedMode) {
      d(!0), m("");
      try {
        const z = await X(
          `/preferences/transition?mode=${encodeURIComponent(E)}`
        );
        let G = !1, W = null, ie = null, le = null, K = !1;
        if (t.requestedMode === "basic" && E === "full") {
          if (!window.confirm(pl(
            z.recyclingBinCount,
            z.protectedRecyclingBinCount
          )))
            return;
          K = !0, z.recyclingBinCount > 0 && (G = !0, le = z.recyclingBinFingerprint, W = `mode-switch-empty-bin:${le}`, ie = Le(W));
        }
        let te = !1;
        if (t.requestedMode === "full" && E === "basic") {
          if (!window.confirm(gl(
            z.extensionOwnedSegmentCount
          )))
            return;
          te = !0;
        }
        const de = await X("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: E,
            confirmHiddenExtensionOwnedSegments: te,
            confirmBasicHistoryCleanup: K,
            emptyRecyclingBin: G,
            operationId: ie,
            expectedRecyclingBinFingerprint: le
          })
        });
        W && Be(W), r == null || r(Va(de)), m("Workflow mode saved.");
      } catch (z) {
        m(z.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function Y(E) {
    E.preventDefault(), x(!0), O("");
    try {
      const z = await X("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: u })
      });
      y((z == null ? void 0 : z.baseUrl) || "");
      const G = await X("/analysis/status");
      f(G), O(z != null && z.baseUrl ? G != null && G.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(G == null ? void 0 : G.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (z) {
      O(z.message || "Unable to save analysis service settings.");
    } finally {
      x(!1);
    }
  }
  const $ = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (E) => fi(E, e, $), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      D.map(([E, z]) => n("button", {
        key: E,
        type: "button",
        onClick: () => i(E),
        "aria-current": o === E ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === E ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, z))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(xc)
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
      n(Fd, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: re,
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
          onChange: (E) => {
            const z = E.target.checked;
            Ua(z), N(z);
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
            value: u,
            onChange: (E) => y(E.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: b || I || !w,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: b || I || !w,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, I ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        C || (b ? "Loading analysis service settings…" : (g == null ? void 0 : g.configured) === !1 ? "Full Scan is not configured." : g != null && g.ready ? "Analysis service is ready." : (g == null ? void 0 : g.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    M.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(vc, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => q()
      })
    ) : null,
    M.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(Sc, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => q()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function xa({ facets: e, values: t, disabled: r, onChange: o }) {
  var i;
  return r ? n(
    "p",
    { className: "rounded-md border border-dashed border-border p-3 text-xs text-secondary" },
    "Performer slot filters are unavailable for your current access. Browse and playback remain available."
  ) : (i = e == null ? void 0 : e.slots) != null && i.length ? n("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, e.slots.map((a) => n("label", { key: a.id, className: "space-y-1 text-xs text-secondary" }, [
    n("span", { key: "label" }, ft(a)),
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
function wc({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var m, u;
  const s = [...e.slots || []].sort((y, g) => y.sortOrder - g.sortOrder || String(y.slotDefinitionId).localeCompare(String(g.slotDefinitionId))), l = [...new Map(s.map((y) => [
    y.performerId,
    { id: y.performerId, name: y.performerName }
  ])).values()], d = s.map((y) => ({
    slotDefinitionId: y.slotDefinitionId,
    label: ft(y),
    performer: { id: y.performerId, name: y.performerName }
  })), c = Ya(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: ai(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((m = e.activity) == null ? void 0 : m.name) || "segment"}, ${e.reviewState}, ${Ce(e.startSec)} to ${e.endSec == null ? "end of video" : Ce(e.endSec)}` }, [
      n("div", { key: "image", className: "relative aspect-video bg-black" }, [
        n("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        n("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${Ce(e.startSec)} → end` : `${Ce(e.startSec)} – ${Ce(e.endSec)}`)
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
function Nc({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(Ia, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: bl(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: Ya(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Sa({ onNavigate: e, profile: t }) {
  const r = _e(() => {
    const K = $a("ext:com.midnightrider.segment-studio:segments");
    return K ? {
      ...Br,
      defaultFilter: { ...Br.defaultFilter, ...K.findFilter || {} },
      defaultObjectFilter: K.objectFilter || {}
    } : Br;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Ta(r), [l, d] = F(null), [c, m] = F({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [u, y] = F(null), [g, f] = F(null), [b, h] = F(0), [I, x] = F(""), [C, O] = F(!0), [w, B] = F(""), T = pe(0), N = Qo(o, i), D = N.activityTagId, M = hn(i.slots), q = _e(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (K) => Object.keys(hn(K)).length > 0,
    sanitize: (K) => Gr(D, hn(K)),
    summarize: (K) => `${Object.keys(hn(K)).length} assigned`,
    renderEditor: (K, te) => D ? n(xa, {
      facets: l,
      values: hn(K),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (de, oe) => {
        const be = { ...hn(K) };
        oe ? be[de] = Number(oe) : delete be[de], te(Gr(D, be));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [D, l, c.performerSlotsAvailable]), re = JSON.stringify(N);
  ye(() => {
    if (d(null), !D) return;
    const K = new AbortController();
    return X(`/browse/activities/${D}/facets`, { signal: K.signal }).then(d).catch((te) => {
      te.status === 403 ? d({ slots: [], restricted: !0 }) : te.name !== "AbortError" && B(te.message);
    }), () => K.abort();
  }, [D]), ye(() => {
    const K = ++T.current, te = new AbortController();
    return O(!0), B(""), X("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(N), signal: te.signal }).then((de) => {
      K === T.current && m({ ...de, totalCount: de.totalCount ?? de.total ?? 0 });
    }).catch((de) => {
      if (!(K !== T.current || de.name === "AbortError")) {
        if (de.status === 400 && de.message.includes("unrestricted performer read access")) {
          m((oe) => ({ ...oe, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), B("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        B(de.message);
      }
    }).finally(() => {
      K === T.current && O(!1);
    }), () => {
      T.current++, te.abort();
    };
  }, [re, b]);
  const Y = c.items.findIndex((K) => K.key === u), $ = c.items[Y] || null;
  function E(K) {
    s(K), a({ ...o, page: 1 });
  }
  function z(K) {
    const te = Qo(o, K), de = K.slots && te.activityTagId != null && te.slotAssignments.length > 0 ? K.slots : void 0;
    E({ ...K, slots: de });
  }
  function G(K, te) {
    const de = { ...M };
    te ? de[K] = Number(te) : delete de[K], E({ ...i, slots: Gr(D, de) });
  }
  function W() {
    const K = document.querySelector(`[data-segment-key="${u}"]`);
    y(null), requestAnimationFrame(() => K == null ? void 0 : K.focus());
  }
  async function ie(K) {
    var oe;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    f(K.key), x("");
    const te = `browse-restore:${K.itemId}:${K.revision}`, de = Le(te);
    try {
      const be = (me = !1) => X(`/bin/${K.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: de,
          expectedRevision: K.revision,
          discardMissingImage: me
        })
      });
      try {
        await be(so(te));
      } catch (me) {
        if (((oe = me.payload) == null ? void 0 : oe.code) !== "missing-image" || !window.confirm(`${me.message}

Continue and discard the missing image reference?`))
          throw me;
        lo(te), await be(!0);
      }
      Be(te), u === K.key && y(null), x("Segment restored to Cove."), h((me) => me + 1);
    } catch (be) {
      x(be.message || "Unable to restore the segment."), be.status === 409 && h((me) => me + 1);
    } finally {
      f(null);
    }
  }
  async function le(K) {
    f(K.key), x("");
    try {
      const te = await X(`/items/${K.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: K.revision })
      });
      if (!ti(te, x) || !Al(te))
        return;
      const de = `browse-dependency-delete:${K.itemId}:${te.fingerprint}`;
      await X(`/items/${K.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Le(de),
          fingerprint: te.fingerprint
        })
      }), Be(de), u === K.key && y(null), x(`${te.deletedSegmentCount} segment${te.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), h((oe) => oe + 1);
    } catch (te) {
      x(te.message || "Unable to permanently delete the segment."), te.status === 409 && h((de) => de + 1);
    } finally {
      f(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(po, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(Aa, {
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
      error: w ? new Error(w) : null,
      onRetry: () => h((K) => K + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? Yo.filter((K) => K.id !== "performers") : Yo,
      objectFilter: i,
      onObjectFilterChange: z,
      customFilterSections: q,
      searchPlaceholder: "Search segments..."
    }, [
      D ? n(xa, { key: "slots", facets: l, values: M, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: G }) : null,
      n(Nc, { key: "player", item: $, index: Y, count: c.items.length, onPrevious: () => {
        var K;
        return y((K = c.items[Y - 1]) == null ? void 0 : K.key);
      }, onNext: () => {
        var K;
        return y((K = c.items[Y + 1]) == null ? void 0 : K.key);
      }, onClose: W, onNavigate: e }),
      I ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, I) : null,
      !C && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      C ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((K) => n(wc, {
        key: K.key,
        item: K,
        selected: K.key === u,
        busy: g === K.key,
        onSelect: () => y(K.key),
        onRestore: ie,
        onPurge: le
      })))
    ])
  ]);
}
function Ic({ onNavigate: e, profile: t }) {
  const [r, o] = F([]), [i, a] = F(""), [s, l] = F(0), [d, c] = F(!0), [m, u] = F(null), [y, g] = F(""), f = pe(null);
  async function b(x) {
    const C = await X("/bin", x ? { signal: x } : void 0);
    return o(C.items || []), a(C.fingerprint || ""), l(Number(C.totalCount) || 0), C;
  }
  ye(() => {
    const x = new AbortController();
    return c(!0), b(x.signal).catch((C) => {
      C.name !== "AbortError" && g(C.message);
    }).finally(() => {
      x.signal.aborted || c(!1);
    }), () => x.abort();
  }, []), Ca(no, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var x;
      return (x = f.current) == null ? void 0 : x.call(f);
    }
  }]);
  async function h(x) {
    var w;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    u(x.itemId), g("");
    const C = `restore:${x.itemId}:${x.revision}`, O = Le(C);
    try {
      const B = (T = !1) => X(`/bin/${x.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: O, expectedRevision: x.revision, discardMissingImage: T })
      });
      try {
        await B(so(C));
      } catch (T) {
        if (((w = T.payload) == null ? void 0 : w.code) !== "missing-image" || !window.confirm(`${T.message}

Continue and discard the missing image reference?`)) throw T;
        lo(C), await B(!0);
      }
      Be(C), await b(), Hn(), g("Segment restored with a new native ID.");
    } catch (B) {
      g(B.message || "Unable to restore the segment."), B.status === 409 && await b();
    } finally {
      u(null);
    }
  }
  async function I() {
    if (m == null)
      try {
        const x = await ri({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          u(-1), g("");
        });
        if (x.status !== "emptied") return;
        await b(), Hn(), g(`${x.segmentCount} segment${x.segmentCount === 1 ? "" : "s"} from ${x.sceneCount} scene${x.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (x) {
        g(x.message || "Unable to empty the recycling bin."), x.status === 409 && await b();
      } finally {
        u(null);
      }
  }
  return f.current = I, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    n(po, {
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
        onClick: I,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, m === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    y ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, y) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((x) => n("article", { key: x.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${x.tagName || "Tag segment"} · ${x.videoTitle || `Video ${x.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, x.endSec == null ? Ce(x.startSec) : `${Ce(x.startSec)} – ${Ce(x.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${x.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${x.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: m != null, onClick: () => h(x), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const ka = "ext:com.midnightrider.segment-studio:videos";
function Hr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = _e(() => {
    var ne;
    const Q = $a(ka), P = (ne = Q == null ? void 0 : Q.uiOptions) == null ? void 0 : ne.displayMode;
    return Q ? {
      ...Un,
      defaultFilter: { ...Un.defaultFilter, ...Q.findFilter || {} },
      defaultObjectFilter: Q.objectFilter || {},
      defaultDisplayMode: Un.allowedDisplayModes.includes(P) ? P : Un.defaultDisplayMode
    } : Un;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: m } = Ta(i), [u, y] = F({ items: [], totalCount: 0 }), [g, f] = F(!0), [b, h] = F(""), [I, x] = F(0), [C, O] = F(/* @__PURE__ */ new Set()), [w, B] = F(null), [T, N] = F({ busy: !1, error: "", announcement: "" }), D = pe(0), M = pe(null), q = pe(null);
  q.current || (q.current = cc());
  const re = JSON.stringify(a), Y = JSON.stringify(s), $ = t || r === "review";
  ye(() => {
    q.current.selectionChanged(), M.current = null, O(/* @__PURE__ */ new Set()), N((Q) => ({ busy: Q.busy, error: "", announcement: "" }));
  }, [re, Y]), ye(() => {
    if (!$) return;
    const Q = new AbortController();
    return X("/analysis/status", { signal: Q.signal }).then(B).catch((P) => {
      P.name !== "AbortError" && B({ configured: !0, ready: !1, error: P.message || "Unable to check Full Scan readiness." });
    }), () => Q.abort();
  }, [$]), ye(() => {
    const Q = ++D.current, P = new AbortController();
    return f(!0), h(""), X(`/videos?${Ed(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: P.signal }).then((ne) => {
      Q === D.current && y(ne);
    }).catch((ne) => {
      Q === D.current && ne.name !== "AbortError" && h(ne.message || "Unable to discover videos.");
    }).finally(() => {
      Q === D.current && f(!1);
    }), () => {
      D.current++, P.abort();
    };
  }, [re, Y, t, r, I]);
  function E(Q) {
    d({ ...Q, page: Q.page || 1 });
  }
  function z(Q) {
    c(Q), d({ ...a, page: 1 });
  }
  function G(Q, P = !1) {
    O((ne) => Dd(
      ne,
      u.items.map((ke) => ke.videoId),
      Q,
      M.current,
      P
    )), M.current = Q;
  }
  function W() {
    M.current = null, O(new Set(u.items.map((Q) => Q.videoId)));
  }
  function ie() {
    M.current = null, O(/* @__PURE__ */ new Set());
  }
  function le() {
    M.current = null, O((Q) => new Set(u.items.map((P) => P.videoId).filter((P) => !Q.has(P))));
  }
  async function K(Q = ["aiTagging", "omnishotcut"]) {
    const P = q.current.begin();
    if (P) {
      N({ busy: !0, error: "", announcement: "" });
      try {
        const ne = await uc(
          [...C],
          Q,
          X,
          (ke) => window.confirm(ke)
        );
        if (ne.cancelled) {
          N({ busy: !1, error: "", announcement: "" });
          return;
        }
        ne.queuedIds.length > 0 && q.current.ownsCurrentSelection(P) && (ne.queuedIds.includes(M.current) && (M.current = null), O((ke) => {
          const fe = new Set(ke);
          return ne.queuedIds.forEach((U) => fe.delete(U)), fe;
        })), N({
          busy: !1,
          announcement: ne.queuedIds.length > 0 ? `${ne.queuedIds.length} ${ne.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: ne.failed.length > 0 ? `${ne.failed.length} selected ${ne.failed.length === 1 ? "video could" : "videos could"} not be queued. ${ne.failed[0].error}` : ""
        });
      } catch (ne) {
        N({ busy: !1, error: ne.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        q.current.finish(P);
      }
    }
  }
  const te = t || r === "review" ? ma : ma.filter((Q) => !["reviewState", "shotBoundaries"].includes(Q.id)), de = w === null || w.configured === !1 || w.ready === !1, oe = T.busy || de, be = (w == null ? void 0 : w.error) || (w === null ? "Checking Full Scan availability" : w.configured === !1 ? "Configure the analysis service before running Full Scan" : w.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), me = T.busy ? "Queueing scans…" : w === null ? "Checking Full Scan…" : w.configured === !1 ? "Full Scan not configured" : w.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
  return n("div", { className: "w-full space-y-5" }, [
    n(po, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(Aa, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: ka,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: E,
      totalCount: u.totalCount,
      isLoading: g,
      error: b ? new Error(b) : null,
      onRetry: () => x((Q) => Q + 1),
      sortOptions: t || r === "review" ? [...ua, { value: "unreviewed_count", label: "Unreviewed count" }] : ua,
      displayMode: l,
      onDisplayModeChange: m,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: te,
      objectFilter: s,
      onObjectFilterChange: z,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: $ ? C : void 0,
      onSelectAll: $ ? W : void 0,
      onSelectNone: $ ? ie : void 0,
      onInvertSelection: $ ? le : void 0,
      selectionActions: $ ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: oe,
          onClick: () => K(),
          title: be,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, me),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": oe,
            title: be,
            onClick: (Q) => {
              oe && Q.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${oe ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(Ra, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([Q, P]) => n("button", {
            key: Q,
            type: "button",
            disabled: T.busy,
            onClick: (ne) => {
              var ke;
              (ke = ne.currentTarget.closest("details")) == null || ke.removeAttribute("open"), K(P);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, Q)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, T.announcement),
      T.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, T.error) : null,
      !g && u.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !g && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, u.items.map((Q) => n(Od, { key: Q.videoId, item: Q, onNavigate: e, showReviewStates: $, selected: C.has(Q.videoId), selectionActive: C.size > 0, onSelect: $ ? G : null }))) : null,
      !g && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, u.items.map((Q) => n(Pd, { key: Q.videoId, item: Q, onNavigate: e, showReviewStates: $, selected: C.has(Q.videoId), selectionActive: C.size > 0, onSelect: $ ? G : null }))) : null
    ])
  ]);
}
function wa({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = F(null), [s, l] = F(!0), [d, c] = F(""), m = pe(0), u = pe(0), y = pe(e), g = hd();
  y.current = e;
  const f = (C) => `/videos/${C}/editor`;
  async function b(C, O, w) {
    const B = await X(f(O), w ? { signal: w.signal } : void 0);
    return tn(C, w ? m.current : u.current, O, y.current) ? (a(B), !0) : !1;
  }
  ye(() => {
    const C = ++m.current, O = e, w = new AbortController();
    return a(null), l(!0), c(""), b(C, O, w).catch((B) => {
      tn(C, m.current, O, y.current) && B.name !== "AbortError" && c(B.message || "Unable to load the editor.");
    }).finally(() => {
      tn(C, m.current, O, y.current) && l(!1);
    }), () => {
      m.current++, u.current++, w.abort();
    };
  }, [e]);
  function h(C, O) {
    a((w) => (w == null ? void 0 : w.video.id) !== O ? w : typeof C == "function" ? C(w) : C);
  }
  async function I() {
    const C = e, O = ++u.current;
    try {
      const w = await X(f(C));
      return tn(O, u.current, C, y.current) ? (a(w), c("A newer canonical segment was loaded. Your stale change was not applied."), w) : null;
    } catch (w) {
      return tn(O, u.current, C, y.current) && c(w.message || "Unable to reload the latest segment."), null;
    }
  }
  async function x() {
    const C = e, O = ++u.current;
    try {
      const w = await X(f(C));
      return tn(O, u.current, C, y.current) ? (a(w), c(""), w) : null;
    } catch (w) {
      return tn(O, u.current, C, y.current) && c(w.message || "Unable to reload performer slots."), null;
    }
  }
  return n("div", {
    className: `mx-auto flex w-full flex-col gap-2 ${g ? "lg:overflow-hidden" : "p-3 sm:p-4"}`,
    style: g ? {
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
      n(cs, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(lc, {
      key: i.video.id,
      detail: i,
      onDetailChange: h,
      onConflict: I,
      onReload: x,
      onSlotsChanged: x,
      splitLayout: g,
      profile: o,
      initialSegmentId: Xo() ? -Xo() : hl(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function Cc(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function $c(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function Tc(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function Ac({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = dl(o), l = Cc(e, t, window.location.pathname), d = $c(e, t, window.location.pathname), c = Tc(e, t, window.location.pathname), m = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (ml(m, o) === "videos" && m !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Hr, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(kc, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(Sa, { onNavigate: r, profile: o });
    const g = Number(e);
    return Number.isInteger(g) && g > 0 ? n(wa, {
      videoId: g,
      onNavigate: r,
      compatibilityMode: !0,
      profile: o
    }) : n(Hr, {
      onNavigate: r,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return n(Ic, { onNavigate: r, profile: o });
  const y = Number(e);
  return d ? n(Sa, { onNavigate: r, profile: o }) : Number.isInteger(y) && y > 0 ? n(wa, {
    videoId: y,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(Hr, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function Rc({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = F(null), [a, s] = F("");
  return ye(() => {
    const l = new AbortController();
    return X("/preferences", { signal: l.signal }).then((d) => i(Va(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(Ac, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function Mc(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function Ec(e, t) {
  const r = Mc(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const ru = {
  components: { SegmentStudioPage: Rc },
  actionHandlers: { openSegmentStudio: Ec }
};
export {
  vr as CLEARED_SEGMENT_SELECTION_ID,
  ua as DISCOVERY_SORT_OPTIONS,
  Ft as SEGMENT_STUDIO_CAPABILITIES,
  no as SEGMENT_STUDIO_EXTENSION_ID,
  Yn as SEGMENT_STUDIO_SHORTCUTS,
  As as activeEditorFilterCount,
  ql as applyDerivationRuleSlotSuggestions,
  Zr as applyFeedbackEditorDelta,
  oa as applySegmentMergeDelta,
  El as basicSegmentTimelineStyle,
  bl as browseClipEnd,
  Ya as browseEditorHref,
  Qo as buildBrowseRequest,
  pc as buildDerivationRuleGraph,
  Ed as buildDiscoverySearchParams,
  fs as buildMinuteTimelineTicks,
  mc as buildPerformerSlotOverview,
  wl as buildSegmentQuickSearchEntries,
  Ql as buildSegmentRailRows,
  Zl as buildTimelineRows,
  jc as buildTimelineTicks,
  vs as calculateCenteredTimelineScroll,
  qr as calculateEditorPanelMaximum,
  ys as calculateMinuteLabelStride,
  Bc as calculateMinuteTimelineWidth,
  ks as calculateSwimlaneTitleMaximum,
  xs as calculateTimelinePlayheadPosition,
  oo as calculateTimelineRatioBounds,
  Ns as calculateTimelineRatioFromPointer,
  Gc as calculateVerticalRevealOffset,
  nn as clampEditorPanelWidth,
  yr as clampSwimlaneTitleWidth,
  Ba as clampTimelineRatio,
  ao as clampTimelineRatioForHeight,
  hr as clampTimelineZoom,
  Td as compactProvenanceSummary,
  cc as createBulkAnalysisCoordinator,
  Ys as createQueuedReviewRequest,
  nu as createSaveQueue,
  ya as createSegmentAnalysisRequestScope,
  ru as default,
  ol as displayHeldSegmentTag,
  Tl as downloadFileNameFromContentDisposition,
  Rs as dualRangeValueFromPointer,
  Wo as duplicateIdentityFromResponse,
  el as duplicateOperationKey,
  Ka as editorVisibilityIncludingSegment,
  td as expandedSwimlanes,
  gl as extensionOwnedSegmentsModeSwitchPrompt,
  id as feedbackFrameTimestamps,
  ld as feedbackResultMatchesAction,
  sd as feedbackSelectionPlan,
  Ts as filterDerivedSegments,
  jr as filterEditorSegments,
  gc as filterPerformerSlotOverview,
  kl as filterSegmentQuickSearch,
  _c as filterSegmentStudioShortcuts,
  od as findAdjacentSegmentGroupKey,
  sl as findAdjacentShot,
  Ws as findEditorShortcut,
  ja as findInitialSegmentSelection,
  ps as findNearestSegmentInCurrentSwimlane,
  il as findPublishedSelectionIdentity,
  Je as findSegmentByStableIdentity,
  Is as findSegmentFromPlayhead,
  gs as findSegmentNearPlayhead,
  rd as findSwimlaneRangeSelection,
  Qr as findSwimlaneSelection,
  xl as findUniquePerformerSlotAssignment,
  br as findUnreviewedSelection,
  Gl as focusDialogDefaultButton,
  Nr as formatGenderHint,
  ll as frameStepSeconds,
  Qa as generatePerformerSlotAssignmentRecommendations,
  Hd as groupApprovedDraftsForPublishing,
  Sl as groupAutoAssignCandidates,
  dd as groupIncorrectExamplesByTag,
  Jd as groupMaterializationOutputs,
  rn as groupSegmentsIntoSwimlanes,
  Xl as groupSelectedSwimlanes,
  go as groupSwimlanesBySegmentGroup,
  vt as handleModalKey,
  xn as hasSegmentStudioCapability,
  ia as hideCollectedFeedbackSegments,
  Ul as historyActionsForTarget,
  gr as incorrectExampleHistoryState,
  li as indexPerformerSlotsBySegment,
  Wc as initialReviewFilter,
  md as insertSegmentProjection,
  tn as isCurrentEditorRequest,
  Fl as isEditableTarget,
  Jc as isEditorShortcutOwner,
  eu as isKindRunning,
  tu as isSaveQueueBusy,
  Tc as isSegmentStudioBinRoute,
  $c as isSegmentStudioSegmentsRoute,
  Cc as isSegmentStudioSettingsRoute,
  fc as layoutDerivationRuleComponent,
  yc as layoutDerivationRuleComponents,
  gd as mergeSegmentsProjection,
  Hl as multiSelectionActionHint,
  js as nextSegmentAfterRemoval,
  Bs as nextUnreviewedAfterRemoval,
  qt as normalizeCollapsedSegmentGroups,
  pa as normalizeDiscoveryIds,
  wt as normalizeEditorSegmentFilters,
  Ht as normalizeGender,
  Vo as normalizeReviewFilter,
  Va as normalizeSegmentStudioFeatureProfile,
  qc as normalizeSegmentStudioMode,
  Jr as normalizeSegmentStudioPublicMode,
  hn as parseBrowseSlotFilters,
  ws as parseEditorLayout,
  Cs as parseHideDerivedSegmentsPreference,
  $s as parseMergeConfirmationPreference,
  qa as parsePlaybackShortcutConfig,
  _s as parseShortcutBindingOverrides,
  Kr as patchPerformerSlotProjection,
  kr as patchSegmentProjection,
  Gs as percentageSeekTime,
  vl as performInitialSegmentSeek,
  tt as performerOptionId,
  xr as performerSlotHistoryState,
  ft as performerSlotLabel,
  Wl as performerSlotPresentation,
  Qc as performerSlotStatus,
  mo as performerSlotStatusFromSegmentSlots,
  si as performerSlotsForSegment,
  At as provenanceSourceLabel,
  rl as queueCreatedSegmentTagChoice,
  Za as rankPerformerOptions,
  ad as reconcileSegmentGroupKey,
  Ls as reconcileSelectedSegmentIds,
  Ld as recyclingBinActionText,
  Rl as recyclingBinDeletionPrompt,
  ni as recyclingBinDeletionSummary,
  pl as recyclingBinModeSwitchPrompt,
  Xs as removeQueuedReviewsForSegments,
  Xr as removeSegmentsProjection,
  Xo as requestedOwnedItemId,
  hl as requestedSegmentId,
  Es as resolveEditorSegmentSelection,
  al as resolveQueuedCreatedSegmentTag,
  Qs as resolveQueuedReviewRequest,
  tl as resolveSegmentCreationAction,
  ml as resolveSegmentStudioRoute,
  qs as resolveSegmentStudioShortcuts,
  fd as resolveSegmentTarget,
  bc as resolveSelectedDerivationRule,
  Ho as resolveSelectedSegments,
  Xd as restoreDisabledToolbarActionFocus,
  sc as restorePublishApprovedFocus,
  Jn as restoreSegmentFieldsProjection,
  gi as restoreSegmentsProjection,
  mi as revealCollapsedSegmentGroup,
  uc as runSelectedDiscoveryAnalysis,
  pi as sameSegmentIdentity,
  Xc as savingSegmentIdFrom,
  oi as segmentBadgeStyle,
  wr as segmentGroupHeaderBackground,
  $t as segmentGroupKeyForSegment,
  uo as segmentHistoryIdentity,
  mr as segmentHistoryState,
  Zc as segmentIdentity,
  ai as segmentRailItemStyle,
  Vc as segmentStateStyle,
  Mc as segmentStudioActionTarget,
  dl as segmentStudioLegacyMode,
  Ml as segmentTimelineStyle,
  kt as segmentsHistoryState,
  Fs as selectAllVideoSegmentIds,
  fl as selectedBrowseStates,
  ci as selectedSwimlaneMerge,
  fi as setBackLinkNavigation,
  Kl as sharedPerformerSlotShape,
  zl as sharedTagPerformerSlotShape,
  vn as shortcutAvailableInMode,
  Vs as shortcutBindingDisplayText,
  Uc as shortcutBindingFromEvent,
  zc as shortcutBindingsOverlap,
  Hc as shortcutModesOverlap,
  Hs as shortcutRequiresSingleSegment,
  zn as shotBoundaryFingerprint,
  Bl as shouldAcceptCurrentTagFromEnter,
  Kc as shouldExitShortcutCapture,
  Yc as shouldHandleEditorShortcut,
  fa as shouldLoadSegmentAnalysis,
  ca as shouldReloadAfterSegmentMutation,
  Vr as shouldRestoreTransitionSelection,
  Nl as shouldShowQuickSearchGroups,
  _o as splitShortcutCategoriesIntoColumns,
  _l as suggestDerivationRuleSlotMappings,
  Wn as swimlaneDisplayLabel,
  Ll as swimlaneMarkerTop,
  Ol as swimlaneStripeBackground,
  nl as tagEditorLockedBySave,
  pd as targetsOverlap,
  Ss as timelineContentStyle,
  Uo as timelinePlayheadHorizontalStyle,
  Dl as timelineSegmentWidth,
  bs as timelineTickAlignment,
  hs as timelineTickPosition,
  _r as timelineTimePercent,
  nd as toggleAllCollapsedSegmentGroups,
  Js as toggledSelectionReviewState,
  Et as trapModalFocus,
  Il as tryParseJsonResponseText,
  Ps as updateAnchoredSegmentSelection,
  Dd as updateDiscoverySelection,
  Ms as updateDualRangeValues,
  Ds as updateSegmentCollectionSelection,
  Os as updateSegmentRangeSelection,
  za as updateSegmentSelection,
  va as validateDerivationRuleDraft,
  Go as validateSegmentTiming,
  io as videoPerformerOptions,
  Ur as videoPerformerSlotAssignments,
  ul as visibleSegmentStudioSettingsTabs,
  cl as visibleSegmentStudioTabs,
  di as visibleVirtualRows
};
