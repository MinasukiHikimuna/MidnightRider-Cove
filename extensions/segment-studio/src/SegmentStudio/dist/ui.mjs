import oo from "@cove/runtime/react";
import { createPortal as fs } from "@cove/runtime/react-dom";
import { extensionFetch as Ta } from "@cove/runtime/api";
import { formatDuration as ys, EntityReferenceSelector as qn, useExtensionKeyboardBindings as bs, VideoPlayer as Aa, useRegisterExtensionKeyboardActions as Ra, getDefaultFilter as Ma, useListUrlState as Ea, ListPage as Da } from "@cove/runtime/components";
import { ChevronDown as Oa, StepBack as hs, StepForward as vs, Loader2 as xs } from "@cove/runtime/lucide-react";
const ao = "com.midnightrider.segment-studio", Pa = "segment-studio.layout.v1", an = "segment-studio.operations.v1", La = "segment-studio.collapsed-segment-groups.v1", Fa = "segment-studio.playback-shortcuts.v1", ja = "segment-studio.timing-clipboard.v1", Ba = "segment-studio.hide-derived-segments.v1", Ga = "segment-studio.merge-confirmation.v1", kt = ["unreviewed", "approved", "rejected"], Ss = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], Go = "(min-width: 1024px) and (min-height: 640px)", Uo = "(min-width: 1024px) and (min-height: 900px)", _n = 1e-3, Ko = 15, ks = 30, Ua = 12, It = {
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
}, Kt = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function zo(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function Ka(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? xr(e, null, 1, !0) ?? r[0] ?? null;
}
function xr(e, t, r, o = !1) {
  var m;
  const i = e.findIndex((u) => u.markers.some((f) => f.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const u = e.flatMap((f) => f.markers.map((g) => g.segment)).filter((f) => f.reviewState === "unreviewed");
    return r < 0 ? u.at(-1) ?? null : u[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((u) => u.segment.id === t);
  if (!o)
    return ((m = (r < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((f) => f.segment.reviewState === "unreviewed")) == null ? void 0 : m.segment) ?? null;
  const l = e.flatMap((u) => u.markers.map((f) => f.segment)), d = l.findIndex((u) => u.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((u) => u.reviewState === "unreviewed") ?? null;
}
function ws(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((m, u) => m.markers.filter(({ segment: f }) => {
    const g = Number(f.startSec), p = f.endSec == null ? g + ks : Number(f.endSec);
    return Number.isFinite(g) && Number.isFinite(p) && p >= g && g <= i + Ko + _n && p >= i - Ko - _n;
  }).map(({ segment: f }) => ({ segment: f, laneIndex: u }))).sort((m, u) => m.laneIndex - u.laneIndex || Math.abs(m.segment.startSec - i) - Math.abs(u.segment.startSec - i) || m.segment.id - u.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((m) => m.markers.some((u) => u.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((m) => m.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((m) => m.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((m) => m.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function Ns(e, t, r) {
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
function Sr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function iu(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function Is(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function su(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function Cs(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function $s(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Ts(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function As(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Jr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function Rs(e, t, r = 10) {
  const o = Jr(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function Ho(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function Ms(e, t = Ua) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function za(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : It.timelineRatio;
}
function Yr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function nn(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? It.detailWidth : Math.min(Yr(t, 0), Math.max(240, e));
}
function br(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? It.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function Es(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function so(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: It.timelineRatio, maximum: It.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function lo(e, t) {
  const r = za(e);
  if (!(t > 0)) return r;
  const o = so(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function Ds(e) {
  if (!e) return { ...It };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? za(r) : It.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: nn(t == null ? void 0 : t.detailWidth),
      markerRailWidth: nn(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: br(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...It };
  }
}
function Os(e, t, r) {
  return r > 0 ? lo((t + r - e) / r, r) : It.timelineRatio;
}
function lu(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function Ps(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, m) => c.startSec - m.startSec || c.id - m.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= _n ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function ur(e, t, r, o) {
  return e === t && r === o;
}
function Ls({ beginRequest: e, fetchDetail: t, isCurrent: r, isSameVideo: o }) {
  let i = null;
  return function({ onLoaded: s, onError: l }) {
    const d = e(), c = (async () => {
      try {
        const m = await t(d);
        if (r(d))
          return s(m), m;
      } catch (m) {
        if (r(d))
          return l(m), null;
      }
      return o(d) && i !== c ? i : null;
    })();
    return i = c, c;
  };
}
const kr = "__segment-studio-cleared-selection__";
function Fs(e) {
  return e === "true";
}
function js(e) {
  return e !== "false";
}
function Ha() {
  try {
    return js(window.localStorage.getItem(Ga));
  } catch {
    return !0;
  }
}
function qa(e) {
  try {
    window.localStorage.setItem(Ga, String(!!e));
  } catch {
  }
}
function Bs(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function At(e = {}) {
  const t = kt.filter((m) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(m) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (m, u) => {
    const f = Number(m);
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
  var c, m;
  const a = At(r), s = a.performerId == null ? null : new Set((t || []).filter((u) => Number(u.performerId) === a.performerId).map((u) => u.segmentId)), l = new Set((i || []).flatMap((u) => u.tags || []).map((u) => Number(u.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((m = (c = (i || []).find((u) => Number(u.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : m.map((u) => Number(u.tagId))) || []);
  return Bs(e || [], o).filter((u) => {
    if (u.reviewState != null && !a.reviewStates.includes(u.reviewState) || s && !s.has(u.id) || a.tagId != null && Number(u.tagId) !== a.tagId || d && !d.has(Number(u.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(u.tagId)) || a.sourceKey != null && u.sourceKey !== a.sourceKey) return !1;
    const f = Number(u.confidence);
    return u.confidence == null || !Number.isFinite(f) ? a.includeUnscored : f >= a.confidenceMin && f <= a.confidenceMax;
  });
}
function _a(e, t, r, o = !1, i = []) {
  var l;
  const a = At(r);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = At({
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
    filters: At(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function Gs(e, t = !1) {
  const r = At(e);
  return +(r.reviewStates.length !== kt.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function Us(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function Ks(e, t, r, o) {
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
function zs(e, t, r = null) {
  return t === kr ? null : Ka(
    e,
    t ?? r
  );
}
function Wa(e, t, r, o = !1) {
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
function Hs(e, t, r) {
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
function qs(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return Wa(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function _s(e, t, r = null, o = !1) {
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
      ...qs(u, s, t, m, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: u
    };
  }
  const d = Wa(i, a, t, o);
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
function Ws(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function Vs(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function qo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function _o(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => qo(t, o) - qo(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function Js(e, t, r) {
  var c, m;
  const o = e || [], i = new Set(t || []), a = o.findIndex((u) => (u.markers || []).some(({ segment: f }) => f.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: u }) => u.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const u of o) {
      const f = (u.markers || []).find(({ segment: g }) => !i.has(g.id));
      if (f) return f.segment;
    }
    return null;
  }
  const l = _o(
    o[a].markers,
    s,
    i
  );
  if (l) return l;
  const d = (m = o.map((u, f) => ({ lane: u, index: f })).filter(({ lane: u }) => (u.markers || []).some(({ segment: f }) => !i.has(f.id))).sort((u, f) => Math.abs(u.index - a) - Math.abs(f.index - a) || +(u.index < a) - +(f.index < a) || u.index - f.index)[0]) == null ? void 0 : m.lane;
  return _o(d == null ? void 0 : d.markers, s, i);
}
function Ys(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function Qs(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function Wo(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function Zs() {
  try {
    return Fs(window.localStorage.getItem(Ba));
  } catch {
    return !1;
  }
}
function Xs(e) {
  try {
    window.localStorage.setItem(Ba, String(!!e));
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
], el = /* @__PURE__ */ new Set([
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
function tl(e) {
  return el.has(e);
}
function Va(e) {
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
function nl(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Yn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(Va).filter(Boolean)]));
  } catch {
    return {};
  }
}
function rl(e = {}) {
  const t = nl(e);
  return Yn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function Vo(e, t = 2) {
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
function du(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : Va({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function cu(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function Qr(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function Jo(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function uu(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = Jo(e.code, t.key), a = Jo(t.code, e.key);
  if (!r && !o && !i && !a) return !1;
  const s = i ? t.key : e.key, l = i ? e.code : a ? t.code : o ? e.code : e.code || t.code;
  for (const d of [!1, !0])
    for (const c of [!1, !0])
      for (const m of [!1, !0])
        for (const u of [!1, !0]) {
          const f = {
            key: s,
            code: l,
            ctrlKey: d,
            metaKey: c,
            altKey: m,
            shiftKey: u
          };
          if (Qr(f, e) && Qr(f, t)) return !0;
        }
  return !1;
}
function bn(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function mu(e, t) {
  return [!1, !0].some((r) => bn(e, r) && bn(t, r));
}
function ol(e, t = !1, r = {}) {
  return rl(r).find((o) => bn(o, t) && o.bindings.some((i) => Qr(e, i))) || null;
}
function Ja(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function al(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Ja).join(" / ") : "Unassigned";
}
function gu(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, al(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function pu(e) {
  return e === "review" ? "review" : "editor";
}
function Ve(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function il(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function sl(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function ll(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => Ve(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: Ve(t, e.activeIdentity) || r[0]
  };
}
function dl(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function fu(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => dl(o, i))));
}
function Yo(e, t) {
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
function cl(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function ul(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function ml(e, t, r) {
  return e != null && (r == null || t !== r);
}
function gl(e, t, r, o = null) {
  if (r === t.tagId) return null;
  const i = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: r,
    tagName: o || ((i == null ? void 0 : i.tagId) === r ? i.tagName : null)
  };
}
function pl({ tagEditing: e, selectedSegmentIds: t, activeSegmentId: r }, o) {
  return !(e && r === o && (t == null ? void 0 : t.length) === 1 && t[0] === o);
}
function Zr(e, t) {
  return e === t;
}
function fl(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function yl(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - _n).at(-1) || null : o.find((i) => i.startSec > t + _n) || null;
}
function zn(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function Qo(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: kt.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function yu(e, t = null, r = !1) {
  const o = Qo(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function fn(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function Ya(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: fn(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: fn(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: fn(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(fn(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(fn(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(fn(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...io };
  }
}
function bl(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function Qa() {
  try {
    return Ya(window.localStorage.getItem(Fa));
  } catch {
    return { ...io };
  }
}
function Zo(e) {
  const t = Ya(JSON.stringify(e));
  try {
    window.localStorage.setItem(Fa, JSON.stringify(t));
  } catch {
  }
  return t;
}
const zt = Object.freeze({
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
function Za(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? Xr(e.requestedMode) : "basic",
    effectiveMode: i ? Xr(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function hn(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function hl(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function vl(e) {
  const t = [];
  return hn(e, zt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), hn(e, zt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function xl(e) {
  return [
    ["general", "General", zt.settingsGeneral],
    ["shortcuts", "Shortcuts", zt.settingsShortcuts],
    ["performer-slots", "Performer slots", zt.settingsPerformerSlots],
    ["derivation", "Derivation", zt.settingsDerivation]
  ].filter(([, , r]) => hn(e, r)).map(([r, o]) => [r, o]);
}
function Sl(e, t) {
  return e === "segments" && !hn(
    t,
    zt.navigationSegmentInventory
  ) || e === "bin" && !hn(
    t,
    zt.recyclingBinView
  ) ? "videos" : e;
}
function kl(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function wl(e, t = 0) {
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
}, Xo = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: kt.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function Nl(e) {
  const t = String(e || "").split(",").filter((r) => kt.includes(r));
  return t.length === 0 ? [...kt] : [...new Set(t)];
}
function yn(e) {
  return Xa(e).values;
}
function Xa(e) {
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
function ea(e, t) {
  var l;
  const r = ta(t.activitiesCriterion, t.activityId), o = ta(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = Xa(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: Il(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function ta(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function Il(e, t) {
  return kt.includes(e == null ? void 0 : e.value) ? [e.value] : Nl(t);
}
function ei(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Cl(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function $l(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function na(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Tl(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function it(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function co(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function _r(e, t) {
  const r = new Set(co(t).map((o) => String(it(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function Wt(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function ra(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(Wt).sort().join(",")}`;
}
function ti(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((g) => String(g.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((g) => {
    var p;
    return !((p = g.genderHints) != null && p.length);
  }) && e.length === t.length && !i) {
    const g = [...e].sort((y, b) => String(y.slotDefinitionId).localeCompare(String(b.slotDefinitionId))), p = [...t].sort((y, b) => String(y.name).localeCompare(String(b.name)) || Number(it(y)) - Number(it(b)));
    return [{
      assignments: Object.fromEntries(g.map((y, b) => [String(y.slotDefinitionId), String(it(p[b]))])),
      description: p.map((y) => y.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((g) => t.map((p, y) => ({ performer: p, index: y })).filter(({ performer: p }) => {
    var y;
    return !((y = g.genderHints) != null && y.length) || g.genderHints.some((b) => Wt(b) === Wt(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), m = i ? c.filter((g) => g.length > 0).length : oa(c, t.length);
  if (m === 0) return [];
  const u = new Map(t.map((g, p) => [String(it(g)), p]));
  function f(g, p, y) {
    if (s.length >= a) return;
    const b = c.slice(g), N = i ? b.filter(($) => $.length > 0).length : oa(b.map(($) => $.filter((A) => !p.has(String(it(t[A]))))), t.length);
    if (y + N < m) return;
    if (g === e.length) {
      if (y !== m) return;
      const $ = Object.fromEntries(d.map(({ slot: w, performer: S }) => [String(w.slotDefinitionId), S ? String(it(S)) : ""])), A = o.length === 0 ? Object.values($).sort().join(",") : [...new Set(e.map((w) => String(w.label || "")))].map((w) => `${w}:${d.filter(({ slot: S }) => String(S.label || "") === w).map(({ performer: S }) => S ? String(it(S)) : "").sort().join(",")}`).join("|");
      !l.has(A) && s.length < a && (l.add(A), s.push({
        assignments: $,
        description: d.map(({ slot: w, performer: S }) => o.length ? `${w.label}: ${(S == null ? void 0 : S.name) || "Unassigned"}` : (S == null ? void 0 : S.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const x = e[g], U = [...d].reverse().find(({ slot: $ }) => ra($) === ra(x)), H = U ? u.get(String(it(U.performer))) : -1;
    for (const $ of c[g]) {
      const A = t[$], w = it(A);
      if (!($ < H) && !(w == null || !i && p.has(String(w))) && (d.push({ slot: x, performer: A }), i || p.add(String(w)), f(g + 1, p, y + 1), i || p.delete(String(w)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: x, performer: null }), f(g + 1, p, y), d.pop();
  }
  return f(0, /* @__PURE__ */ new Set(), 0), s;
}
function oa(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Al(e, t) {
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
      const u = [...new Set(e.map((f) => f.label || ""))].map((f) => `${f}:${a.filter((g) => (g.slot.label || "") === f).map((g) => g.performer.performerId).sort((g, p) => g - p).join(",")}`).join("|");
      i.has(u) || i.set(u, [...a]);
      return;
    }
    const c = e[l];
    for (const u of t)
      !o && d.has(u.performerId) || (m = c.genderHints) != null && m.length && !c.genderHints.some((f) => Wt(f) === Wt(u.gender)) || (a.push({ slot: c, performer: u }), o || d.add(u.performerId), s(l + 1, d), o || d.delete(u.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Rl(e) {
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
function Ml(e, t, r = 20) {
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
function El(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function Dl(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function ni(e, t, r) {
  const o = it, i = new Set((t || []).map(o)), a = new Set((r || []).map(Wt));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), m = d.isVideoPerformer ?? i.has(o(d));
    if (c !== m) return m - c;
    const u = Wt(l.gender || l.genderIdentity), f = Wt(d.gender || d.genderIdentity), g = l.matchesGenderHint ?? a.has(u);
    return (d.matchesGenderHint ?? a.has(f)) - g || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: fe, useId: ri, useLayoutEffect: Ol, useMemo: Ge, useReducer: Pl, useRef: pe, useState: L, useSyncExternalStore: Ll } = oo, n = oo.createElement, oi = "/api/plugins/segment-studio";
function Fe(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(an) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = eo();
    return t[e] = r, window.localStorage.setItem(an, JSON.stringify(t)), r;
  } catch {
    return eo();
  }
}
function je(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(an) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(an, JSON.stringify(t));
  } catch {
  }
}
function uo(e) {
  try {
    return JSON.parse(window.localStorage.getItem(an) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function mo(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(an) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(an, JSON.stringify(t));
  } catch {
  }
}
function Fl(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function jl(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function te(e, t, r = 0) {
  var d;
  const o = await Ta(`${oi}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Fl(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await jl(250 * (r + 1), t == null ? void 0 : t.signal), te(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function Bl(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${oi}${e}`, o = await Ta(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: Gl(
      o.headers.get("Content-Disposition")
    )
  };
}
function Gl(e, t = "segment-studio-ai-feedback.zip") {
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
function Re(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function eo() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function ai(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function Ul(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function ii(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function Kl(e, t) {
  const { sceneCount: r, segmentCount: o } = ii(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function si(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = ii(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(Kl(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await te("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Fe(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return je(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function aa({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const Pt = {
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
function bu(e, t) {
  return {
    ...(Pt[e] || Pt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function li(e) {
  return { ...(Pt[e] || Pt.unreviewed).badge };
}
function di(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const ci = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function zl(e, t, r = "not-applicable", o = !1) {
  const i = Pt[e] || Pt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Hl(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function ql(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function _l(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function Wl(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function Ir(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function Vl(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function sn({ state: e, includeLabel: t = !0 }) {
  const r = Pt[e] || Pt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: li(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function Jl(e, t = null) {
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
function hu(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function Yl(e, t = document) {
  return !(e.defaultPrevented || Jl(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function vu(e, t = document, r = !1, o = {}) {
  return Yl(e, t) ? ol(e, r, o) != null : !1;
}
function Ct(e, { onCancel: t, onConfirm: r } = {}) {
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
function Ql(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function Zl({ confirm: e, cancel: t, confirmReady: r }) {
  const o = r && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function go({ confirmRef: e, cancelRef: t, confirmReady: r }) {
  fe(() => {
    const o = requestAnimationFrame(() => Zl({
      confirm: e.current,
      cancel: t == null ? void 0 : t.current,
      confirmReady: r
    }));
    return () => cancelAnimationFrame(o);
  }, [r]);
}
function Bt(e) {
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
function Xl(e, t) {
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
function mr(e, t = !0) {
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
function Tt(e, t = !0) {
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
function gr(e, t) {
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
function wr(e) {
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
function ui(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function mi(e) {
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
function ed(e, t) {
  const r = (t || []).map((i) => ui(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: wt(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function td(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : ed(e, t);
}
function nd({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function xu(e, t) {
  return fo(ui(e, t));
}
function wt(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function rd(e, t) {
  const r = (d) => wt(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
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
    const u = [...c].sort(o), f = [...m].sort(o);
    u.forEach((g, p) => l.push({
      sourceSlotDefinitionId: g.id,
      derivedSlotDefinitionId: f[p].id
    }));
  }
  return l;
}
function od(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = rd(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function ad(e) {
  const t = wt(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(Cr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function Cr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function Nr(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function ia(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((m) => m.end <= s && m.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: Nr(o),
    trackCount: Math.max(1, t.length)
  };
}
function id(e) {
  const t = e.map(wt), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function sd(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], m = d.length > 0 && d.every((u) => Number(u.performerId) > 0) ? d.map((u) => `${u.slotDefinitionId}:${Number(u.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: m };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [ia({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = id(l.slots), m = l.slots.filter((y) => !a.has(String(y.slotDefinitionId))), u = o.length === 1 ? l.slots : m, f = u.map((y) => `${c.get(String(y.slotDefinitionId))} · ${y.performerName || `Performer ${y.performerId}`}`).join(" · "), g = [...new Map(u.map((y) => [
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
          performers: g,
          performerAssignments: p,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(ia);
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => sd(s, a));
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
    for (const s of kt)
      a.counts[s] += Number((r = o.counts) == null ? void 0 : r[s]) || 0;
  }
  return t;
}
const ld = {
  group: 38,
  lane: 33,
  segment: 41
};
function dd(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = ld[s.kind];
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
function gi(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function cd(e, t = [], r = !0) {
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
function ud(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: Nr(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return yo(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: Nr(a)
    };
  });
}
function pi(e, { nativeOnly: t = !1 } = {}) {
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
function sa(e, t) {
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
function md(e) {
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
    }, o ? md(e.name) : "—"),
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
function fi({ assignments: e, className: t = "" }) {
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
function $r({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = pe(null), i = `performer-slots-${ri()}`, [a, s] = L(null);
  function l() {
    var g;
    const c = (g = o.current) == null ? void 0 : g.getBoundingClientRect();
    if (!c) return;
    const m = Math.max(0, Math.min(256, window.innerWidth - 16)), u = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), f = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - m - 8, c.right - m)),
      top: f >= u + 8 ? c.bottom + 4 : Math.max(8, c.top - u - 4),
      width: m
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
    ...e.slice(0, 3).map((c) => n(Vn, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? fs(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(fi, {
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
function gd(e, t) {
  const r = new Set(Jt(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function yi(e, t) {
  return t ? Jt(e).filter((r) => r !== t) : Jt(e);
}
function pd(e, t) {
  const r = Jt(t), o = new Set(Jt(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function Ot(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function la(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), m = Number.isFinite(c) && c >= d ? c : d, u = d <= o && m >= o, f = u ? 0 : Math.min(Math.abs(o - d), Math.abs(o - m));
    return { contains: u, distance: f, duration: m - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function to(e, t, r, o = null) {
  var m, u, f, g, p, y;
  const i = e.findIndex((b) => b.markers.some((N) => N.segment.id === t));
  if (i < 0) {
    const b = [...((m = e[0]) == null ? void 0 : m.markers) || []];
    return o != null && Number.isFinite(Number(o)) && b.sort((N, x) => la(N, x, o)), ((u = b[0]) == null ? void 0 : u.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((b) => b.segment.id === t);
  if (r === "left" || r === "right") {
    const b = r === "left" ? -1 : 1, N = Math.min(a.markers.length - 1, Math.max(0, s + b));
    return ((f = a.markers[N]) == null ? void 0 : f.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((g = a.markers[s]) == null ? void 0 : g.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((p = a.markers[s]) == null ? void 0 : p.segment) ?? null : ((y = [...e[l].markers].sort(c ? (b, N) => la(b, N, Number(o)) : (b, N) => Math.abs(b.segment.startSec - d) - Math.abs(N.segment.startSec - d) || b.segment.startSec - N.segment.startSec || b.segment.id - N.segment.id)[0]) == null ? void 0 : y.segment) ?? null;
}
function fd(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = to([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function yd(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function bd(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function hd(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [ua(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => ua(Math.min(s, r + l))))];
}
function vd(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function xd(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function hr(e, t) {
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
function da(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function Sd(e) {
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
async function kd(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await ca(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], m = hd(
        d.startSec,
        d.endSec
      );
      for (const [u, f] of m.entries()) {
        Math.abs(r.currentTime - f) > 5e-4 && (r.currentTime = f, await ca(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const g = await wd(o), p = `example-${l + 1}-frame-${u + 1}`;
        c.push({ fieldName: p, timestampSec: f }), s.push({
          fieldName: p,
          file: new File(
            [g],
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
function ca(e, t) {
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
function wd(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function ua(e) {
  return Math.round(e * 1e3) / 1e3;
}
function ma(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Nd(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function Id(e, t) {
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
function bi(e, t) {
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
function Cd(e, t) {
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
function vn(e, t) {
  return !e || !t ? !1 : e.itemId != null && e.itemId === t.itemId || e.nativeSegmentId != null && e.nativeSegmentId === t.nativeSegmentId ? !0 : e.id != null && e.id === t.id;
}
function hi(e, t) {
  return (e || []).some((r) => (t || []).some((o) => vn(r, o)));
}
function on(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function vi(e, t) {
  return (e || []).find((r) => vn(t, r)) || null;
}
function xi(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function $d(e, t) {
  var r;
  return ((r = e.running) == null ? void 0 : r.kind) === t;
}
function Su(e) {
  return e.running != null || e.queued.length > 0;
}
const ga = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
function pr(e) {
  return Object.freeze({
    id: e.id,
    kind: e.kind,
    lockId: e.lockId,
    targets: e.targets,
    exclusive: e.exclusive,
    meta: e.meta
  });
}
function Td({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let r = 1, o = null, i = [], a = null, s = !1, l = ga;
  const d = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Set();
  let m = [];
  function u() {
    l = o == null && i.length === 0 && a == null ? ga : Object.freeze({
      running: o ? pr(o) : null,
      queued: Object.freeze(i.map(pr)),
      lastFailure: a
    });
    for (const $ of [...c]) $();
    if (o == null && i.length === 0) {
      const $ = m;
      m = [];
      for (const A of $) A();
    }
  }
  function f($, A) {
    d.set($.id, A.status), $.resolve(A);
  }
  function g($) {
    if ($.dependsOn == null) return "met";
    const A = d.get($.dependsOn);
    return A === "fulfilled" ? "met" : A != null ? "failed" : "pending";
  }
  function p($) {
    o = $;
    const A = { ...e(), taskId: $.id, targets: $.targets };
    A.resolveTargets = () => $.targets.map((S) => vi(A.segments, S)).filter(Boolean), u();
    let w;
    try {
      w = $.run(A);
    } catch (S) {
      w = Promise.reject(S);
    }
    Promise.resolve(w).then(
      (S) => y($, { status: "fulfilled", value: S }),
      (S) => y($, { status: "rejected", error: S })
    );
  }
  function y($, A) {
    f($, A), !s && (o = null, A.status === "rejected" && (a = Object.freeze({ id: $.id, kind: $.kind, error: A.error })), u(), t && b());
  }
  function b() {
    if (s || o != null) return;
    let $ = !1;
    for (let A = 0; A < i.length; A += 1) {
      const w = i[A], S = g(w);
      if (S === "failed") {
        i = i.filter((C) => C !== w), f(w, { status: "dropped", reason: "dependency-failed" }), $ = !0, A -= 1;
        continue;
      }
      if (S !== "pending" && !(w.exclusive && A > 0) && !i.slice(0, A).some((C) => hi(C.targets, w.targets)) && !(w.ready && !w.ready(e(), pr(w)))) {
        i = i.filter((C) => C !== w), p(w);
        return;
      }
    }
    $ && u();
  }
  function N($) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((M) => M.exclusive) || o != null && $.whenBusy !== "enqueue") return null;
    let w;
    const S = new Promise((M) => {
      w = M;
    }), C = {
      id: r++,
      kind: $.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: $.lockId ?? -1,
      targets: Object.freeze([...$.targets || []]),
      exclusive: $.exclusive === !0,
      dependsOn: $.dependsOn ?? null,
      ready: $.ready || null,
      meta: $.meta ?? null,
      run: $.run,
      resolve: w
    };
    return i = [...i, C], u(), b(), { id: C.id, done: S };
  }
  function x($ = {}) {
    let A = null;
    const w = N({
      ...$,
      whenBusy: "reject",
      run: () => new Promise((C) => {
        A = C;
      })
    });
    if (!w) return null;
    if (A == null)
      return H((C) => C.id === w.id), null;
    let S = !1;
    return () => {
      S || (S = !0, A());
    };
  }
  function U($, A) {
    let w = !1;
    for (const S of i)
      S.targets.some((C) => C.id === $ && C.itemId == null && C.nativeSegmentId == null) && (S.targets = Object.freeze(S.targets.map((C) => C.id === $ ? { ...A } : C)), w = !0);
    return w && u(), w;
  }
  function H($) {
    const A = i.filter((w) => $(pr(w)));
    if (A.length === 0) return 0;
    i = i.filter((w) => !A.includes(w));
    for (const w of A) f(w, { status: "cancelled" });
    return u(), b(), A.length;
  }
  return {
    enqueue: N,
    acquire: x,
    cancel: H,
    retarget: U,
    poke: b,
    subscribe($) {
      return c.add($), () => c.delete($);
    },
    getSnapshot: () => l,
    whenIdle() {
      return o == null && i.length === 0 ? Promise.resolve() : new Promise(($) => m.push($));
    },
    dispose() {
      if (s) return;
      const $ = i;
      i = [], s = !0;
      for (const w of $) f(w, { status: "cancelled" });
      c.clear();
      const A = m;
      m = [];
      for (const w of A) w();
    }
  };
}
let Ad = 1;
function Jn() {
  return `pending-${Ad++}`;
}
function Rd(e) {
  return e.sort((t, r) => t.startSec - r.startSec || t.id - r.id);
}
function vr(e, t) {
  return (t || []).some((r) => vn(r, e));
}
function Md(e, t) {
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
function Si(e, t) {
  return t && (e || []).find((r) => {
    var o;
    return ((o = r.meta) == null ? void 0 : o.kind) === "held-tag" && !r.settled && vr(t, r.targets);
  }) || null;
}
function Ed(e) {
  return (e || []).filter((t) => t.op === "insert" && !t.settled).map((t) => t.segment);
}
function ki(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function Dd(e, t) {
  const r = (e || []).filter((o) => !ki(o, t));
  return r.length === (e || []).length ? e : r;
}
function Od(e, t) {
  let r = !1;
  const o = (e || []).map((i) => i.settled || !ki(i, t) ? i : (r = !0, { ...i, settled: !0, settledDetail: null }));
  return r ? o : e;
}
function Pd(e, t, r) {
  let o = !1;
  const i = (e || []).map((a) => a.targets.some((s) => s.id === t && s.itemId == null && s.nativeSegmentId == null) ? (o = !0, {
    ...a,
    targets: a.targets.map((s) => s.id === t ? { ...r } : s)
  }) : a);
  return o ? i : e;
}
function Ld(e, t) {
  if (!t || t.length === 0) return e;
  let r = [...e || []];
  for (const o of t)
    if (o.op === "insert")
      r.some((i) => vn(o.segment, i)) || r.push(o.segment);
    else if (o.op === "patch")
      r = r.map((i) => vr(i, o.targets) ? { ...i, ...o.values } : i);
    else if (o.op === "remove")
      r = r.filter((i) => !vr(i, o.targets));
    else if (o.op === "merge") {
      const [i, ...a] = o.targets;
      r = r.filter((s) => !vr(s, a)).map((s) => vn(i, s) ? { ...s, ...o.values } : s);
    }
  return Rd(r);
}
function wi(e, t) {
  if (!e || e.length === 0) return e;
  const r = [
    ...(t == null ? void 0 : t.segments) || [],
    ...e.filter((a) => a.op === "insert" && !a.settled).map((a) => a.segment)
  ];
  let o = !1;
  const i = [];
  for (const a of e) {
    if (a.op !== "insert" && !a.targets.some((s) => r.some((l) => vn(s, l)))) {
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
function Fd(e, t) {
  switch (t.type) {
    case "add":
      return Md(e, t.entry);
    case "discard":
      return Dd(e, t.key);
    case "settle":
      return Od(e, t.key);
    case "retarget":
      return Pd(e, t.temporaryId, t.identity);
    case "prune":
      return wi(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
function pa(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function jd(e) {
  const { acquireSaveLock: t, compatibilityMode: r, dispatchPendingChanges: o, enqueueSave: i, pendingChanges: a, retargetSaveTasks: s, currentTime: l, detail: d, editorFilters: c, endInput: m, hideDerivedSegments: u, historyRef: f, mediaDuration: g, onConflict: p, onDetailChange: y, onReload: b, optimisticSegmentIdRef: N, pendingDuplicateRef: x, pendingFirstSegmentStartSecRef: U, pendingTagEditSegmentIdRef: H, replaceSegmentSelection: $, savingSegmentId: A, segments: w, selectedSegment: S, selectedSegmentIdRef: C, selectedSegments: M, selectionAnchorIdRef: J, selectionRangeBaseIdsRef: le, setCreatingSegmentId: O, setEditorFilters: E, setFirstSegmentTagOpen: D, setHideDerivedSegments: _, setHistory: se, setHistoryOpen: ie, setPublishApprovedError: xe, setSaveMessage: W, setSelectedSegmentGroupKey: Y, setSelectedSegmentId: ae, setSelectedSegmentIds: Q, setTagEditing: ve, startInput: ye, tagEditingRef: be, timelineDuration: re, video: ue } = e;
  function ne(B) {
    f.current = B || Kt, se(f.current);
  }
  async function Z(B, z, V, F, j = null) {
    var G;
    try {
      const X = await te(`/videos/${ue.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: f.current.revision,
          kind: B,
          label: z,
          beforeState: V,
          afterState: F,
          receiptId: j
        })
      });
      return ne(X), !0;
    } catch (X) {
      return X.status === 409 && ((G = X.payload) != null && G.current) && ne(X.payload.current), W("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function de(B, z, V = !0, F = null, j = !1, G = z, X = !0) {
    if (!B || A != null) return null;
    const $e = t("segment", B.id);
    if (!$e) return null;
    try {
      return await q(B, z, {
        recordHistory: V,
        historyLabel: F,
        optimisticValues: j ? G : null,
        restoreSelectionOnFailure: X
      });
    } finally {
      $e();
    }
  }
  async function q(B, z, {
    recordHistory: V = !0,
    historyLabel: F = null,
    optimisticValues: j = null,
    pendingChangeId: G = null,
    restoreSelectionOnFailure: X = !0,
    onReload: $e = b,
    onConflict: he = p
  } = {}) {
    var ft;
    const Je = M.map((Qe) => Qe.id), Pe = C.current, Ae = V && !r ? crypto.randomUUID() : null;
    W(V ? "Saving directly to Cove…" : "Restoring history…");
    const Ke = G ?? (j ? Jn() : null);
    j && !G && o({
      type: "add",
      entry: { id: Ke, op: "patch", targets: [on(B)], values: j }
    });
    const lt = () => {
      Ke && o({ type: "settle", key: Ke });
    };
    try {
      if (r && B.nativeSegmentId == null && B.itemId != null) {
        const tt = `draft-update:${ue.id}:${B.itemId}:${B.revision}:${z.tagId}:${z.startSec}:${z.endSec ?? "open"}:${z.reviewState ?? B.reviewState}`, st = await te(`/videos/${ue.id}/drafts/${B.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(tt),
            expectedRevision: B.revision,
            startSec: z.startSec,
            endSec: z.endSec,
            tagId: z.tagId,
            reviewState: z.reviewState
          })
        });
        je(tt);
        const nt = {
          ...B,
          ...st.draft,
          id: B.id,
          itemId: B.itemId
        };
        return V && await Z(
          "segment.update",
          F || "Changed segment",
          mr(B, r),
          mr(
            nt,
            r
          )
        ), pa(B, z, r) ? await $e() : y((ee) => ({
          ...ee,
          approvedSetVersion: st.approvedSetVersion || ee.approvedSetVersion,
          segments: (ee.segments || []).map((oe) => oe.id === B.id ? nt : oe).sort((oe, Se) => oe.startSec - Se.startSec || oe.id - Se.id)
        }), ue.id), lt(), W(((ft = st.draft) == null ? void 0 : ft.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), nt;
      }
      const Qe = await te(`/videos/${ue.id}/segments/${B.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...z,
          expectedUpdatedAt: B.updatedAt,
          historyReceiptId: Ae
        })
      }), ut = {
        ...B,
        ...Qe,
        reviewState: z.reviewState ?? B.reviewState
      };
      return pa(B, z, r) ? await $e() : y((tt) => ({
        ...tt,
        segments: (tt.segments || []).map((st) => st.id === B.id ? ut : st).sort((st, nt) => st.startSec - nt.startSec || st.id - nt.id)
      }), ue.id), lt(), V && await Z(
        "segment.update",
        F || "Changed segment",
        mr(B, r),
        mr(
          ut,
          r
        ),
        Ae
      ), W(V ? "Saved to Cove" : "History restored"), ut;
    } catch (Qe) {
      return Ke && o({ type: "discard", key: Ke }), Ke && X && (Q(Je), ae(Pe), J.current = Pe, le.current = []), Qe.status === 409 ? (W("Conflict — loading the latest segment…"), await he()) : W(Qe.message || "Unable to save the segment."), null;
    }
  }
  async function T() {
    if (!r) return !1;
    const B = w.filter((F) => !F.published && F.reviewState === "approved").length;
    if (B === 0 || A != null) return !1;
    const z = `complete-review:${ue.id}:${d.approvedSetVersion}`, V = t("publish", -1);
    if (!V) return !1;
    xe(""), W(`Publishing ${B} Approved draft${B === 1 ? "" : "s"}…`);
    try {
      const F = await te(`/videos/${ue.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(z),
          expectedApprovedSetVersion: d.approvedSetVersion
        })
      });
      je(z), ne(Kt), ie(!1);
      const j = await b(), G = fl(
        w,
        C.current,
        F.published
      ), X = G ? Ve(j == null ? void 0 : j.segments, G) : null;
      return X && ae(X.id), W(`${F.published.length} Approved draft${F.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (F) {
      const j = F.status === 409 ? "The approved drafts changed. Review the updated list and try again." : F.message || "Unable to publish the approved drafts.";
      return F.status === 409 && await p(), xe(j), W(j), !1;
    } finally {
      V();
    }
  }
  async function R(B = null, z = null) {
    if (A != null || h()) return;
    const V = B != null ? U.current : null, F = Number.isFinite(V) ? V : l, j = Math.min(re, F + 20);
    if (j <= F) {
      W("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const G = ul(w, S, B);
    if (G.kind === "choose-tag") {
      U.current = F, W(""), D(!0);
      return;
    }
    if (G.kind === "invalid-selection") {
      W("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: X } = G, $e = `create-draft:${ue.id}:${X}:${F}`, he = r ? null : crypto.randomUUID(), Je = C.current, Pe = {
      ...S || {},
      id: N.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: X,
      tagName: z || (S == null ? void 0 : S.tagName) || "Tag segment",
      tagSortName: X === (S == null ? void 0 : S.tagId) && (S == null ? void 0 : S.tagSortName) || null,
      startSec: F,
      endSec: j,
      // Full mode creates manual drafts already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, Ae = Nd(d, Pe), Ke = Ot(
      rn(Ae.segments, Ae.segmentGroups || [], Ae.performerSlots || []),
      Pe.id
    ), lt = i({
      kind: "create",
      lockId: -1,
      run: (Qe) => ft(Qe)
    });
    if (!lt) return;
    await lt.done;
    async function ft({ onReload: Qe, taskId: ut }) {
      var st;
      const tt = Jn();
      o({ type: "add", entry: { id: tt, taskId: ut, op: "insert", segment: Pe } }), D(!1), G.openTagEditor && (O(Pe.id), H.current = Pe.id, ve(!0)), $(Pe.id), Y(Ke);
      try {
        let nt;
        if (r) {
          const Se = await te(`/videos/${ue.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: Fe($e), tagId: X, startSec: F, endSec: j })
          });
          je($e), nt = { itemId: (st = Se.draft) == null ? void 0 : st.itemId };
        } else
          nt = { nativeSegmentId: (await te(`/videos/${ue.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: X,
              startSec: F,
              endSec: j,
              historyReceiptId: he
            })
          })).id };
        U.current = null, D(!1);
        const ee = await Qe();
        if (o({ type: "discard", key: tt }), !ee) {
          $(Je), W(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${G.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const oe = Ve(ee == null ? void 0 : ee.segments, nt);
        oe ? (o({ type: "retarget", temporaryId: Pe.id, identity: on(oe) }), s(Pe.id, on(oe)), G.openTagEditor && (be.current && (H.current = oe.id), O(oe.id)), $(oe.id), Y(Ot(
          rn(ee.segments || [], ee.segmentGroups || [], ee.performerSlots || []),
          oe.id
        )), r || await Z(
          "segment.create",
          "Created segment",
          Tt([], !1),
          Tt([oe], !1),
          he
        )) : (ve(!1), W(`Segment created, but it could not be selected${G.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (nt) {
        throw o({ type: "discard", key: tt }), $(Je), B != null && D(!0), W(nt.message || "Unable to create the draft."), nt;
      } finally {
        O(null);
      }
    }
  }
  function h() {
    return Si(a, S) ? (W("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function v() {
    if (M.length !== 1 || !S || A != null || h()) return;
    const B = l;
    if (B <= S.startSec || S.endSec != null && B >= S.endSec) {
      W("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const z = `split-draft:${S.itemId}:${S.revision}:${B}`, V = r ? null : Tt([S], !1), F = r ? null : crypto.randomUUID(), j = t("split", S.id);
    if (j)
      try {
        let G = null;
        r && S.nativeSegmentId == null ? (await te(`/videos/${ue.id}/drafts/${S.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(z),
            expectedRevision: S.revision,
            splitSec: B
          })
        }), je(z)) : G = { nativeSegmentId: (await te(`/videos/${ue.id}/segments/${S.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: S.updatedAt,
            splitSec: B,
            historyReceiptId: F
          })
        })).id };
        const X = await b();
        if (!r) {
          const $e = [
            Ve(X == null ? void 0 : X.segments, {
              nativeSegmentId: S.nativeSegmentId ?? S.id
            }),
            Ve(
              X == null ? void 0 : X.segments,
              G
            )
          ].filter(Boolean);
          await Z(
            "segment.split",
            "Split segment",
            V,
            Tt($e, !1),
            F
          );
        }
        W(r ? `Segment split; both ranges remain ${S.reviewState}.` : "Segment split.");
      } catch (G) {
        G.status === 409 ? await p() : W(G.message || "Unable to split the draft.");
      } finally {
        j();
      }
  }
  async function k(B = !1) {
    var G, X;
    if (M.length !== 1 || !S || A != null || h()) return;
    const z = B ? l : S.startSec, V = cl(ue.id, S, B, z), F = r ? null : crypto.randomUUID(), j = t("duplicate", S.id);
    if (j)
      try {
        const $e = ((G = x.current) == null ? void 0 : G.operationKey) === V ? x.current : null;
        let he = ($e == null ? void 0 : $e.duplicateIdentity) ?? null;
        if (he == null && r && S.nativeSegmentId == null) {
          const Ae = await te(`/videos/${ue.id}/drafts/${S.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(V),
              expectedRevision: S.revision,
              startSec: B ? z : null
            })
          });
          he = Yo(!1, Ae), x.current = { operationKey: V, duplicateIdentity: he };
        } else if (he == null) {
          const Ae = await te(`/videos/${ue.id}/segments/${S.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: S.updatedAt,
              startSec: B ? z : null,
              historyReceiptId: F
            })
          });
          he = Yo(!0, Ae), x.current = { operationKey: V, duplicateIdentity: he };
        }
        const Je = await b(), Pe = Ve(Je == null ? void 0 : Je.segments, he);
        if (Pe) {
          r || await Z(
            "segment.duplicate",
            "Duplicated segment",
            Tt([], !1),
            Tt([Pe], !1),
            F
          );
          const Ae = _a(
            Pe,
            Je.performerSlots || [],
            c,
            u,
            Je.segmentGroups || []
          );
          E(Ae.filters), _(Ae.hideDerivedSegments), Q([Pe.id]), ae(Pe.id), J.current = Pe.id, le.current = [], Y(Ot(
            rn(Je.segments || [], Je.segmentGroups || [], Je.performerSlots || []),
            Pe.id
          )), r && S.nativeSegmentId == null && je(V), x.current = null, W(B ? "Duplicate created at the playhead." : "Duplicate created in place.");
        } else
          W("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
      } catch ($e) {
        ((X = x.current) == null ? void 0 : X.operationKey) === V ? W("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : $e.status === 409 ? await p() : W($e.message || "Unable to duplicate the draft.");
      } finally {
        j();
      }
  }
  async function K() {
    if (M.length !== 1 || !S) return;
    const B = Number(ye), z = m.trim() === "" ? null : Number(m), V = zo(B, z, g);
    if (V.error) {
      W(V.error);
      return;
    }
    if (B === S.startSec && z === S.endSec) {
      W("Timing is unchanged.");
      return;
    }
    await de(S, { startSec: B, endSec: z, tagId: S.tagId }, !0, null, !0);
  }
  async function me(B, z) {
    if (M.length !== 1 || !S) return;
    const V = zo(B, z, g);
    if (V.error) {
      W(V.error);
      return;
    }
    if (B === S.startSec && z === S.endSec) {
      W("Timing is unchanged.");
      return;
    }
    await de(S, { startSec: B, endSec: z, tagId: S.tagId }, !0, null, !0);
  }
  return { acceptHistory: ne, recordHistoryAction: Z, mutateSegment: de, runSegmentMutation: q, completeReview: T, createSegment: R, splitSegment: v, duplicateSegment: k, saveTiming: K, applyShortcutTiming: me };
}
function Bd() {
  const [e, t] = L(() => typeof window < "u" && window.matchMedia(Go).matches);
  return fe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Go), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Gd() {
  const [e, t] = L(() => typeof window < "u" && window.matchMedia(Uo).matches);
  return fe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Uo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Ud() {
  try {
    return Ds(window.localStorage.getItem(Pa));
  } catch {
    return { ...It };
  }
}
function Kd() {
  try {
    return Jt(JSON.parse(window.localStorage.getItem(La) || "[]"));
  } catch {
    return [];
  }
}
function zd(e) {
  try {
    window.localStorage.setItem(La, JSON.stringify(Jt(e)));
  } catch {
  }
}
function Hd(e) {
  try {
    window.localStorage.setItem(Pa, JSON.stringify(e));
  } catch {
  }
}
function qd() {
  try {
    const e = JSON.parse(window.localStorage.getItem(ja) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function _d(e) {
  try {
    return window.localStorage.setItem(ja, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Wd({ status: e }) {
  const t = ci[e];
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
  }, kt.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...li(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${Pt[t].symbol}${e[t]}`)));
}
function Vd({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: m, shortcutRef: u }) {
  const f = co(a), [g, p] = L(() => _r(o, f)), [y, b] = L(!1), [N, x] = L(""), U = pe(!1), H = o.map((M) => `${M.slotDefinitionId}:${M.performerId || ""}`).join("|"), $ = f.map((M) => it(M)).join("|"), A = ti(
    o,
    f
  );
  fe(() => {
    p(_r(o, f)), x("");
  }, [t, r, H, $]);
  async function w(M = g) {
    if (!U.current) {
      U.current = !0, b(!0), x("Saving performer slots…");
      try {
        const J = _r(o.map((E) => ({
          ...E,
          performerId: M[E.slotDefinitionId] || null
        })), f), le = o.map((E) => {
          const D = J[E.slotDefinitionId] ? Number(J[E.slotDefinitionId]) : null, _ = f.find((se) => String(it(se)) === String(D));
          return {
            ...E,
            performerId: D,
            performerName: (_ == null ? void 0 : _.name) || null
          };
        });
        if (s(le) === !1) {
          x("");
          return;
        }
        const O = await te(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((E) => ({ slotDefinitionId: E.slotDefinitionId, performerId: J[E.slotDefinitionId] ? Number(J[E.slotDefinitionId]) : null }))
          })
        });
        x("Performer slots saved."), await l(O, {
          beforeState: wr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: wr([{
            segmentId: t,
            itemId: r,
            revision: O.revision,
            slots: O.slots || []
          }])
        });
      } catch (J) {
        d && await d(o, J), J.status === 409 ? (x("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : x(J.message || "Unable to save performer slots.");
      } finally {
        U.current = !1, b(!1);
      }
    }
  }
  function S(M, J) {
    x(`Option ${J + 1} applied; save to confirm.`), p({ ...g, ...M.assignments });
  }
  async function C(M) {
    const J = { ...g, ...M.assignments };
    p(J), await w(J);
  }
  return fe(() => {
    if (u)
      return u.current = (M) => U.current || !A[M] ? !1 : (C(A[M]), !0), () => {
        u.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    A.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, A.map((M, J) => n("button", {
        key: J,
        type: "button",
        disabled: y,
        onClick: () => S(M, J),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${J + 1}: ${M.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, J + 1),
        n("span", { key: "description" }, M.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${A.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((M) => n("label", { key: M.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, wt(M)),
      (M.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(M.genderHints || []).map(Cr).join(" · ")}`) : null,
      n("select", { key: "select", value: g[M.slotDefinitionId] || "", disabled: y, onChange: (J) => p({ ...g, [M.slotDefinitionId]: J.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ni(f, f, M.genderHints).map((J) => n("option", { key: it(J), value: it(J) }, J.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: m, type: "button", disabled: y, onClick: () => w(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, N)])
  ]);
}
function Jd({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a }) {
  var A;
  const s = ((A = t[0]) == null ? void 0 : A.slots) || [], l = co(r), d = ti(
    s,
    l
  ), c = "__mixed__", m = () => Object.fromEntries(s.map((w, S) => {
    const C = t.map((M) => {
      var J;
      return String(((J = M.slots[S]) == null ? void 0 : J.performerId) || "");
    });
    return [w.slotDefinitionId, C.every((M) => M === C[0]) ? C[0] : c];
  })), [u, f] = L(m), [g, p] = L(!1), [y, b] = L(""), N = pe(!1), x = t.map((w) => `${w.itemId ?? `native:${w.segmentId}`}:${w.revision}:${w.slots.map((S) => `${S.slotDefinitionId}:${S.performerId || ""}`).join(",")}`).join("|");
  fe(() => {
    f(m());
  }, [x]);
  async function U(w = u) {
    if (N.current) return;
    N.current = !0, p(!0), b(`Saving performer slots for ${t.length} segments…`);
    const S = [];
    try {
      for (const C of t) {
        const M = C.slots.map((le, O) => {
          const E = w[s[O].slotDefinitionId];
          return {
            slotDefinitionId: le.slotDefinitionId,
            performerId: E === c ? le.performerId || null : E ? Number(E) : null
          };
        }), J = await te(C.itemId != null ? `/videos/${e}/drafts/${C.itemId}/slots` : `/videos/${e}/segments/${C.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: C.revision, assignments: M })
        });
        S.push({
          segmentId: C.segmentId,
          itemId: C.itemId,
          revision: J.revision,
          slots: J.slots || []
        });
      }
      b("Performer slots saved."), o({
        beforeState: wr(t),
        afterState: wr(S)
      });
    } catch (C) {
      const M = await i();
      C.status === 409 ? b(M ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : b(C.message || (M ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      N.current = !1, p(!1);
    }
  }
  function H(w, S) {
    b(`Option ${S + 1} applied; save to confirm.`), f({ ...u, ...w.assignments });
  }
  async function $(w) {
    const S = { ...u, ...w.assignments };
    f(S), await U(S);
  }
  return fe(() => {
    if (a)
      return a.current = (w) => N.current || !d[w] ? !1 : ($(d[w]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, d.map((w, S) => n("button", {
        key: S,
        type: "button",
        disabled: g,
        onClick: () => H(w, S),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${S + 1} to all selected segments: ${w.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, S + 1),
        n("span", { key: "description" }, w.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${d.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, s.map((w) => n("label", {
      key: w.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, wt(w)),
      n("select", {
        key: "select",
        value: u[w.slotDefinitionId] || "",
        disabled: g,
        onChange: (S) => f({ ...u, [w.slotDefinitionId]: S.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        u[w.slotDefinitionId] === c ? n("option", { key: "mixed", value: c }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ni(l, l, w.genderHints).map((S) => n("option", {
          key: it(S),
          value: it(S)
        }, S.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: g,
        onClick: () => U(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, y)
    ])
  ]);
}
function Lt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function Yd(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return Lt(t);
  const o = [...new Set(r.map((i) => Lt(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function Tr() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function fr({ name: e }) {
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
function Qd({ hidden: e }) {
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
    n(Tr, { key: "derived" })
  ]);
}
function Zd({ segment: e, provenance: t }) {
  var m;
  const [r, o] = L(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = Yd(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
        const f = u.modelIdentifier || u.modelKey, g = u.value == null ? null : typeof u.value == "string" ? u.value : JSON.stringify(u.value);
        return n("div", { key: u.id || `${u.fieldKey}:${u.sourceKey}:${u.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            Lt(u.sourceKey, u.sourceDisplayName)
          ),
          u.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${u.fieldKey}${g == null ? "" : ` · ${g}`}`
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
function Xd({
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
  const [u, f] = L([]), g = e.flatMap((N) => N.lanes.map((x) => x.key)), p = g.join("|");
  fe(() => {
    const N = new Set(g);
    f((x) => x.filter((U) => N.has(U)));
  }, [p]);
  const y = Nr(t), b = !!pi(
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
      a ? n(Vt, { key: "counts", counts: y }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      nd({ mergeable: b, reviewable: a, tagEditable: s, slotsEditable: l })
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
    ...e.map((N) => n("section", {
      key: N.key,
      "data-selected-segment-group": N.key,
      className: "space-y-1.5"
    }, [
      n("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        n("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, N.name),
        n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${N.selectedCount} selected`)
      ]),
      ...N.lanes.map((x) => {
        const U = u.includes(x.key), H = x.markers.some(({ segment: A }) => A.id === r), $ = `selected-segment-lane-${x.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: x.key,
          "data-selected-segment-lane": x.key,
          className: `rounded-md border ${H ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": U,
            "aria-controls": $,
            "aria-current": H ? "true" : void 0,
            onClick: () => f((A) => U ? A.filter((w) => w !== x.key) : [...A, x.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, U ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Wn(x)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(x.selectedCount)),
            a ? n(Vt, { key: "states", counts: x.counts }) : null
          ]),
          U ? n("div", {
            key: "segments",
            id: $,
            className: "space-y-1 border-t border-border p-1.5"
          }, x.markers.map(({ segment: A }) => {
            const w = A.endSec == null ? Re(A.startSec) : `${Re(A.startSec)} – ${Re(A.endSec)}`;
            return n("button", {
              key: A.id,
              type: "button",
              onClick: () => i(A),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${A.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${A.tagName || "Segment"}, ${A.reviewState}, ${w}` : `${A.tagName || "Segment"}, ${w}`,
              "aria-current": A.id === r ? "true" : void 0
            }, [
              a ? n(sn, {
                key: "state",
                state: A.reviewState,
                includeLabel: !1
              }) : null,
              A.isDerived ? n(Tr, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, w),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                Lt(A.sourceKey)
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
}, fa = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], ya = [
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
function Ni(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function ba(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function yr(e, t, r, o = null) {
  const i = ba(t), a = ba(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function ec(e, t, r = null) {
  var u, f, g;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (u = t.hasSegmentsCriterion) == null ? void 0 : u.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), yr(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), yr(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), yr(o, t.performersCriterion, "performer"), yr(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = ha(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = ha(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((f = t.reviewStateCriterion) == null ? void 0 : f.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const m = (g = t.shotBoundariesCriterion) == null ? void 0 : g.value;
  return r && typeof m == "boolean" ? o.set("hasShotBoundaries", String(m)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function ha(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function tc(e, t, r, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((m) => a.add(m));
  } else a.has(r) ? a.delete(r) : a.add(r);
  return a;
}
function Ii({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(aa, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, kt.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = Pt[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(aa, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function Ci({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
function nc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      n(Ci, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, ys(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(Ii, { item: e, showReviewStates: r }))
    ])
  ]);
}
function rc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n(Ci, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
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
        n(Ii, { key: "segments", item: e, showReviewStates: r })
      ]),
      n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function bo({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = vl(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => Qn(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && hn(
        o,
        zt.recyclingBinView
      ) ? n($i, { key: "bin", onNavigate: t }) : null,
      n(Ti, { key: "settings", onNavigate: t })
    ])
  ]);
}
const ro = "segment-studio:recycling-bin-changed";
function oc(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function Hn() {
  window.dispatchEvent(new CustomEvent(ro));
}
function $i({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = L(null);
  fe(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const m = await te("/bin"), u = Number(m == null ? void 0 : m.totalCount);
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
  const i = oc(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => Qn(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function Ti({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => Qn(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function ac({ mode: e, onModeChange: t, disabled: r = !1 }) {
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
function ic({ minimum: e, maximum: t, onChange: r }) {
  const o = pe(null), [i, a] = L("maximum"), s = (f, g) => {
    const p = Ks(e, t, f, g);
    a(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (f, g) => {
    var y;
    const p = (y = o.current) == null ? void 0 : y.getBoundingClientRect();
    p && s(f, Us(g.clientX, p.left, p.width));
  }, d = (f, g) => {
    var p, y;
    g.preventDefault(), (y = (p = g.currentTarget).setPointerCapture) == null || y.call(p, g.pointerId), l(f, g);
  }, c = (f, g) => {
    var p, y;
    (y = (p = g.currentTarget).hasPointerCapture) != null && y.call(p, g.pointerId) && l(f, g);
  }, m = (f, g) => {
    const p = f === "minimum" ? e : t, y = f === "minimum" ? 0 : e, b = f === "minimum" ? t : 1, N = g.shiftKey ? 0.1 : 0.01;
    let x = null;
    ["ArrowLeft", "ArrowDown"].includes(g.key) && (x = p - N), ["ArrowRight", "ArrowUp"].includes(g.key) && (x = p + N), g.key === "PageDown" && (x = p - 0.1), g.key === "PageUp" && (x = p + 0.1), g.key === "Home" && (x = y), g.key === "End" && (x = b), x != null && (g.preventDefault(), s(f, Math.min(b, Math.max(y, x))));
  }, u = (f, g) => n("span", {
    key: f,
    role: "slider",
    tabIndex: 0,
    "aria-label": f === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((f === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((f === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(g * 100),
    "aria-valuetext": `${Math.round(g * 100)} percent`,
    onPointerDown: (p) => d(f, p),
    onPointerMove: (p) => c(f, p),
    onKeyDown: (p) => m(f, p),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${g * 100}%`,
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
function sc({ saving: e, error: t, onSelect: r, onClose: o }) {
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
    onKeyDownCapture: (s) => Ct(s, { onCancel: a })
  }, n("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: Bt,
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
function lc({
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
  const u = At(e), f = [...new Map((a || []).map((b) => [
    Number(b.tagId),
    b.tagName || `Tag ${b.tagId}`
  ])).entries()].sort((b, N) => b[1].localeCompare(N[1]) || b[0] - N[0]), g = (b) => d(At({ ...u, ...b })), p = (b) => g({
    reviewStates: u.reviewStates.includes(b) ? u.reviewStates.filter((N) => N !== b) : [...u.reviewStates, b]
  }), y = (b) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${b ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && m();
    },
    onKeyDownCapture: (b) => Ct(b, { onCancel: m })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: Bt,
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
        n("div", { className: "flex flex-wrap gap-2" }, kt.map((b) => {
          const N = u.reviewStates.includes(b), x = Pt[b];
          return n("button", {
            key: b,
            type: "button",
            onClick: () => p(b),
            "aria-pressed": N,
            className: y(N)
          }, `${x.symbol} ${b} (${i[b] || 0})`);
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
            className: y(u.performerId == null)
          }, "All performers"),
          ...r.map((b) => {
            const N = Number(it(b));
            return n("button", {
              key: N,
              type: "button",
              onClick: () => g({ performerId: N }),
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
            onChange: (b) => g({
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
            onChange: (b) => g({
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
            onClick: () => g({ sourceKey: null }),
            "aria-pressed": u.sourceKey == null,
            className: y(u.sourceKey == null)
          }, "All provenance"),
          ...o.map((b) => n("button", {
            key: b,
            type: "button",
            onClick: () => g({ sourceKey: b }),
            "aria-pressed": u.sourceKey === b,
            title: b,
            className: y(u.sourceKey === b)
          }, Lt(b)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(ic, {
          minimum: u.confidenceMin,
          maximum: u.confidenceMax,
          onChange: ({ minimum: b, maximum: N }) => g({
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
            onChange: (b) => g({
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
        n(Qd, { key: "icon", hidden: t }),
        n("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    n("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(At({})), l && c(!1);
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
function dc({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Yn.filter((l) => bn(l, e)), i = Vo(o, 1)[0], a = Vo(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((m) => n("div", { key: m.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, m.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[m.id] ? t[m.id].length > 0 ? t[m.id] : ["Unassigned"] : m.bindings.map(Ja)).map((u, f) => n("kbd", { key: `${m.id}:${f}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, u))
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
    onKeyDownCapture: (l) => Ct(l, { onCancel: r })
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
function cc({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = Sd(e), [l, d] = L([]), c = s.map((m) => m.tagName).join("|");
  return fe(() => {
    const m = new Set(s.map((u) => u.tagName));
    d((u) => u.filter((f) => m.has(f)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (m) => Ct(m, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: Bt,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", { key: "title", id: "segment-studio-examples-title", className: "text-lg font-semibold text-foreground" }, "AI Feedback"),
      n("p", { key: "description", className: "mt-1 text-sm text-secondary" }, `${e.length} registered-AI example${e.length === 1 ? "" : "s"} in this video. Expand a tag to inspect or restore examples before export.`)
    ]),
    n("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      n("div", { key: "items", className: "space-y-3" }, e.length ? s.map((m, u) => {
        const f = l.includes(m.tagName), g = `incorrect-example-tag-${u}`;
        return n("section", {
          key: m.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": f,
            "aria-controls": g,
            onClick: () => d((p) => f ? p.filter((y) => y !== m.tagName) : [...p, m.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: Ir(!1) }
          }, [
            n(
              "span",
              { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" },
              f ? "▾" : "▸"
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
          f ? n("div", {
            key: "examples",
            id: g,
            className: "divide-y divide-border border-t border-border"
          }, m.examples.map((p) => {
            const y = `${Re(p.startSec)}${p.endSec == null ? "" : ` – ${Re(p.endSec)}`}`, b = r === p.id;
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
                "aria-label": `${b ? "Restoring" : "Restore to review"} ${m.tagName} example at ${y}`,
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
function uc({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = L(""), [a, s] = L(0), l = pe(null), d = Ge(() => Ml(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), m = Dl(d);
  fe(() => {
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
      var g;
      if (f.key === "Tab")
        Bt(f);
      else if (f.key === "Escape")
        f.preventDefault(), f.stopPropagation(), r();
      else if (f.key === "ArrowDown" || f.key === "ArrowUp") {
        f.preventDefault(), f.stopPropagation();
        const p = f.key === "ArrowDown" ? 1 : -1;
        s((y) => d.length ? (y + p + d.length) % d.length : 0);
      } else f.key === "Enter" && !((g = f.nativeEvent) != null && g.isComposing) && (f.preventDefault(), f.stopPropagation(), u());
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
    }, d.length ? d.flatMap((f, g) => {
      var $;
      const p = f.segment || f, y = p.endSec == null ? Re(p.startSec) : `${Re(p.startSec)} – ${Re(p.endSec)}`, b = `${Lt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, N = g === c, x = g > 0 ? d[g - 1].groupKey : null, U = m && f.groupKey !== x ? n("div", {
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
        onMouseEnter: () => s(g),
        onClick: () => t(p),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${N ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        m ? n("span", { key: "group", className: "sr-only" }, `${f.groupName} group`) : null,
        n(sn, { key: "review", state: p.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        ($ = f.performers) != null && $.length ? n($r, {
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
      return U ? [U, H] : [H];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function mc(e) {
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
function gc({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = Ge(() => mc(e), [e]), [l, d] = L([]), c = s.reduce((g, p) => g + p.drafts.length, 0), m = pe(null);
  go({ confirmRef: m, cancelRef: o, confirmReady: !t && c > 0 });
  const u = (g) => d((p) => p.includes(g) ? p.filter((y) => y !== g) : [...p, g]), f = (g) => `segment-studio-publish-approved-${g.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && a();
    },
    onKeyDownCapture: (g) => Ct(g, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: Bt,
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
      ].flatMap(([g, p]) => [
        n("dt", { key: `${g}:label`, className: "text-secondary" }, g),
        n("dd", { key: `${g}:value`, className: "font-semibold text-foreground" }, String(p))
      ])),
      s.length ? n("div", { key: "groups", className: "space-y-2" }, s.map((g) => {
        const p = l.includes(g.key);
        return n("section", { key: g.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": p,
            "aria-controls": f(g),
            onClick: () => u(g.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: Ir(!1) }
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, p ? "▾" : "▸"),
            n("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, g.tagName),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${g.drafts.length} draft${g.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          p ? n("div", {
            key: "drafts",
            id: f(g),
            className: "divide-y divide-border border-t border-border"
          }, g.drafts.map((y) => {
            const b = y.endSec == null ? Re(y.startSec) : `${Re(y.startSec)} – ${Re(y.endSec)}`, N = `${Lt(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`;
            return n("div", { key: y.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(sn, { key: "review", state: y.reviewState, includeLabel: !1 }),
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
        ref: m,
        type: "button",
        disabled: t || c === 0,
        onClick: i,
        className: "rounded-md border border-emerald-500/60 bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-emerald-500/30 disabled:opacity-50"
      }, t ? "Publishing…" : `Publish ${c} approved draft${c === 1 ? "" : "s"}`)
    ])
  ]));
}
function pc({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = Rl(e), [s, l] = L(() => /* @__PURE__ */ new Set()), [d, c] = L(() => new Set(a.map((y) => y.key))), m = a.flatMap((y) => d.has(y.key) ? y.candidates : []), u = (y) => l((b) => {
    const N = new Set(b);
    return N.has(y) ? N.delete(y) : N.add(y), N;
  }), f = (y) => c((b) => {
    const N = new Set(b);
    return N.has(y) ? N.delete(y) : N.add(y), N;
  }), g = (y) => y.assignment.map(({ slot: b, performer: N }) => `${b.label || `Slot ${b.sortOrder + 1}`}: ${N.name}`).join(", "), p = (y) => `segment-studio-auto-assign-${y.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (y) => {
      y.target === y.currentTarget && !t && i();
    },
    onKeyDownCapture: (y) => {
      y.key === "Enter" && y.target instanceof HTMLInputElement || Ct(y, {
        onCancel: t ? void 0 : i,
        onConfirm: m.length && !t ? () => o(m) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: Bt,
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
          style: { background: Ir(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(y.key),
            disabled: t,
            onChange: () => f(y.key),
            "aria-label": `Include ${y.tagName} assignment: ${g(y)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(y.key),
            "aria-controls": p(y),
            "aria-label": `${s.has(y.key) ? "Collapse" : "Expand"} ${y.tagName} assignment: ${g(y)}`,
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
              const x = b.label || `Slot ${b.sortOrder + 1}`;
              return n("span", {
                key: b.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${x}: ${N.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${x}: ${N.name}`
                }, `${x}: ${N.name}`),
                n(Vn, {
                  key: "avatar",
                  performer: { id: N.performerId, name: N.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(Vt, { key: "states", counts: y.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(y.candidates),
            "aria-label": `Auto-Assign ${y.tagName}: ${g(y)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${y.candidates.length})`)
        ]),
        s.has(y.key) ? n(
          "div",
          { key: "segments", id: p(y), className: "divide-y divide-border/70" },
          y.candidates.map((b) => {
            const N = b.endSec == null ? Re(b.startSec) : `${Re(b.startSec)} – ${Re(b.endSec)}`, x = `${Lt(b.sourceKey)}${b.confidence == null ? "" : ` · ${Math.round(b.confidence * 100)}%`}`;
            return n("div", {
              key: b.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(sn, { key: "review", state: b.reviewState, includeLabel: !1 }),
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
function fc({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => Ct(d, { onCancel: r, onConfirm: t })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: Bt,
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
function yc({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = L(!1), d = pe(null);
  if (go({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Re(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && a();
    },
    onKeyDownCapture: (m) => Ct(m, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: Bt,
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
        `${Re(e.startSec)} – ${c}`
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
function bc(e) {
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
function hc({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var u, f;
  const l = e ? e.createCount + e.linkCount : 0, d = pe(null);
  go({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((u = e == null ? void 0 : e.outputs) == null ? void 0 : u.slice(0, 200)) || [], m = bc(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !r && s();
    },
    onKeyDownCapture: (g) => Ct(g, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: Bt,
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
        ].flatMap(([g, p]) => [
          n("dt", { key: `${g}:label`, className: "text-secondary" }, g),
          n("dd", { key: `${g}:value`, className: "font-semibold text-foreground" }, String(p))
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
                `${g.rootTagName} @ ${Re(g.rootStartSec)}`
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
              g.outputs.map((p, y) => n("div", {
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
function vc({
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
  performerSlots: f,
  detail: g,
  video: p,
  slotButtonRef: y,
  tagSearchRef: b,
  onDetailChange: N,
  setSaveMessage: x,
  acquireSaveLock: U,
  onSlotsChanged: H,
  onRecordHistory: $,
  onCancelQueuedReview: A,
  splitSegment: w,
  duplicateSegment: S,
  provenance: C,
  lineage: M,
  onNavigateLineageItem: J,
  tagEditing: le,
  onCancelTagEditing: O,
  detailPanelRef: E,
  onReduceSelection: D
}) {
  var be, re, ue, ne;
  const _ = pe(null), se = pe(null), ie = () => {
    var Z;
    (Z = se.current) == null || Z.call(se), se.current = null;
  }, xe = pe(null), W = pe(null), Y = pe(null), ae = pe(null), [Q, ve] = L(!1);
  fe(() => {
    _.current && (_.current.scrollTop = 0), ve(!1);
  }, [t == null ? void 0 : t.id]), fe(() => {
    var Z, de;
    Q && ((de = (Z = xe.current) == null ? void 0 : Z.querySelector("input, select, button")) == null || de.focus({ preventScroll: !0 }));
  }, [Q]);
  function ye() {
    ve(!1), requestAnimationFrame(() => {
      var Z;
      return (Z = y.current) == null ? void 0 : Z.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const Z = !r.some((T) => T.isDerived), de = e && m ? td(f, r) : null, q = (de == null ? void 0 : de.map((T, R) => {
      var v;
      const h = r[R];
      return {
        segmentId: h.nativeSegmentId,
        itemId: h.published ? null : h.itemId,
        revision: (v = g.performerSlotRevisions) == null ? void 0 : v[h.id],
        slots: T
      };
    })) || [];
    return n(oo.Fragment, null, [
      n(Xd, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: E,
        onReduceSelection: D,
        reviewable: e,
        tagEditable: Z,
        slotsEditable: q.length > 0 && a == null,
        onEditSlots: () => ve(!0),
        slotButtonRef: y,
        saveMessage: i
      }),
      le && Z ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (T) => {
          T.target === T.currentTarget && O();
        },
        onKeyDownCapture: (T) => Ct(T, { onCancel: O })
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
        n(qn, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (T, R) => T == null ? O() : l(T, R == null ? void 0 : R.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: O,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      Q && q.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (T) => {
          T.target === T.currentTarget && ye();
        },
        onKeyDownCapture: (T) => {
          var h, v;
          if (!(typeof ((h = T.target) == null ? void 0 : h.closest) == "function" ? T.target.closest("input, textarea, select, [contenteditable='true']") : null) && !T.repeat && !T.ctrlKey && !T.altKey && !T.metaKey && !T.shiftKey && /^[1-9]$/.test(T.key) && ((v = ae.current) != null && v.call(ae, Number(T.key) - 1))) {
            T.preventDefault(), T.stopPropagation();
            return;
          }
          Ct(T, { onCancel: ye });
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
          n("button", { key: "close", type: "button", onClick: ye, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Jd, {
          videoId: p.id,
          targets: q,
          performerCandidates: g.performerCandidates || [],
          shortcutRef: ae,
          onSaved: async ({ beforeState: T, afterState: R }) => {
            await $(
              "performer-slots.assign",
              `Assigned performers to ${q.length} segments`,
              T,
              R
            ), ye(), H();
          },
          onConflict: H
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (Z) => {
      _.current = Z, E && (E.current = Z);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(sn, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(Tr, { key: "derived" }) : null,
        t && le ? n("div", {
          key: "tag-editor",
          ref: b,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (Z) => {
            Z.key === "Escape" && (Z.preventDefault(), Z.stopPropagation(), O());
          },
          onKeyDown: (Z) => {
            Ql(Z, t.tagName) && (Z.preventDefault(), Z.stopPropagation(), l(t.tagId));
          }
        }, n(qn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (Z, de) => Z == null ? O() : l(Z, de == null ? void 0 : de.label),
          disabled: ml(a, t.id, s) || ((be = M.data) == null ? void 0 : be.tagReadOnly) === !0,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? n("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : n("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? n("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        n("span", { key: "start" }, Re(t.startSec)),
        t.endSec == null ? null : n("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : n("span", { key: "end" }, Re(t.endSec))
      ]) : null,
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(Wd, { status: c })) : null,
      t && m && u.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(fi, {
        assignments: u.map((Z) => {
          const de = ad(Z);
          return {
            key: String(Z.slotDefinitionId),
            label: de.label,
            performer: de.filled ? { id: Number(Z.performerId), name: de.performer } : null,
            title: de.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(Zd, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: C
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
          (re = M.data.parents) != null && re.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...M.data.parents.map((Z) => n("button", {
              key: Z.nodeId,
              type: "button",
              onClick: () => J(Z.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${Z.ruleKey} ${Z.ruleVersion}`))
          ]) : null,
          (ue = M.data.children) != null && ue.length ? n("p", { key: "children" }, `Children: ${M.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: y,
          type: "button",
          disabled: a != null || !m || u.length === 0,
          onClick: () => ve(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: m ? u.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, u.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: w,
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
    Q && e && t && m && u.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (Z) => {
        Z.target === Z.currentTarget && ye();
      },
      onKeyDownCapture: (Z) => {
        var q, T;
        if (!(typeof ((q = Z.target) == null ? void 0 : q.closest) == "function" ? Z.target.closest("input, textarea, select, [contenteditable='true']") : null) && !Z.repeat && !Z.ctrlKey && !Z.altKey && !Z.metaKey && !Z.shiftKey && /^[1-9]$/.test(Z.key) && ((T = Y.current) != null && T.call(Y, Number(Z.key) - 1))) {
          Z.preventDefault(), Z.stopPropagation();
          return;
        }
        Ct(Z, {
          onCancel: ye,
          onConfirm: () => {
            var R;
            return (R = W.current) == null ? void 0 : R.click();
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
        n("button", { key: "close", type: "button", onClick: ye, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Vd, {
        key: `${t.id}:${g.performerSlotsRevision || g.slotRevision || ""}`,
        videoId: p.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: u,
        revision: (ne = g.performerSlotRevisions) == null ? void 0 : ne[t.id],
        performerCandidates: g.performerCandidates || [],
        confirmRef: W,
        shortcutRef: Y,
        onOptimisticSave: (Z) => {
          N((q) => Wr(
            q,
            t.id,
            Z
          ), p.id);
          const de = U("slots", t.id);
          if (!de)
            return x("Wait for the current save to finish before saving performer slots."), !1;
          se.current = de, x("Saving performer slots…"), ye();
        },
        onSaved: async (Z, { beforeState: de, afterState: q }) => {
          N((T) => Wr(
            T,
            t.id,
            Z.slots || [],
            Z.revision
          ), p.id), x("Performer slots saved.");
          try {
            await $(
              "performer-slots.assign",
              "Assigned performers",
              de,
              q
            ), await H(Z) || A([t]);
          } finally {
            ie();
          }
        },
        onRollback: async (Z, de) => {
          A([t]), N((q) => {
            var T;
            return Wr(
              q,
              t.id,
              Z,
              (T = g.performerSlotRevisions) == null ? void 0 : T[t.id]
            );
          }, p.id), x(de.message || "Unable to save performer slots.");
          try {
            de.status === 409 && await H();
          } finally {
            ie();
          }
        },
        onConflict: H
      }))
    ])) : null
  ]);
}
function xc({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: m, onZoomChange: u, onSelectGroup: f, onToggleGroup: g, onSelect: p, onSelectSegments: y, onSelectAll: b, onConfigureTag: N, onSeekTime: x, centerRef: U, showReviewState: H = !0, swimlaneTitleWidth: $, onSwimlaneTitleWidthChange: A }) {
  const w = pe(null), S = pe(null), [C, M] = L(0), [J, le] = L({ scrollTop: 0, height: 320 }), [O, E] = L(null), D = Ge(
    () => rn(e, r, o),
    [e, r, o]
  ), _ = Ge(
    () => mi(o),
    [o]
  ), se = Ge(() => yo(D), [D]), ie = Ge(
    () => cd(se, i, r.length > 0),
    [se, i, r.length]
  ), xe = Ge(
    () => gi(ie.rows, Math.max(0, J.scrollTop - 24), J.height),
    [ie, J]
  ), W = Math.max(0, Number(d) || 0), Y = Es(C), ae = br($, Y), Q = ae / 16, ve = Rs(c, W, Q), ye = Is(W), be = Cs(W, Math.max(1, C - Q * 16), m), re = ye.filter((v, k) => k === 0 || k % be === 0), ue = Ge(() => D.map((v) => `${v.key}:${v.trackCount}:${v.markers.map(({ segment: k, track: K }) => `${k.id}:${k.startSec}:${k.endSec ?? ""}:${K}`).join(",")}`).join("|"), [D]);
  function ne() {
    const v = S.current;
    if (!v) return;
    const k = v.querySelector("[data-timeline-track]"), K = v.firstElementChild, me = k == null ? void 0 : k.getBoundingClientRect(), B = K == null ? void 0 : K.getBoundingClientRect(), z = me && B ? Math.max(0, me.left - B.left) : Q * 16, V = (B == null ? void 0 : B.width) ?? v.scrollWidth;
    v.scrollTo({
      left: As(c, W, V, v.clientWidth, z, Ua),
      behavior: "smooth"
    });
  }
  fe(() => (U.current = ne, () => {
    U.current === ne && (U.current = null);
  })), fe(() => {
    ne();
  }, [m]);
  function Z() {
    const v = S.current, k = ie.rows.find((V) => V.kind === "lane" && V.lane.markers.some(({ segment: F }) => F.id === s));
    if (!v || !k) return;
    const K = 24, me = k.top + K, B = me + k.height;
    let z = v.scrollTop;
    me < v.scrollTop + K ? z = Math.max(0, me - K) : B > v.scrollTop + v.clientHeight && (z = Math.max(0, B - v.clientHeight)), z !== v.scrollTop && (v.scrollTop = z), le({ scrollTop: z, height: v.clientHeight });
  }
  fe(() => {
    Z();
  }, [s, ue, ie]), fe(() => {
    const v = S.current, k = ie.rows.find((V) => V.kind === "group" && V.group.key === a);
    if (!v || !k) return;
    const K = 24, me = k.top + K, B = me + k.height;
    let z = v.scrollTop;
    me < v.scrollTop + K ? z = Math.max(0, me - K) : B > v.scrollTop + v.clientHeight && (z = Math.max(0, B - v.clientHeight)), z !== v.scrollTop && (v.scrollTop = z), le({ scrollTop: z, height: v.clientHeight });
  }, [a, ie]), fe(() => {
    const v = S.current;
    if (!v || typeof ResizeObserver > "u") return;
    const k = () => {
      M(v.clientWidth), le({ scrollTop: v.scrollTop, height: v.clientHeight }), Z();
    }, K = new ResizeObserver(k);
    return K.observe(v), k(), () => K.disconnect();
  }, [s, ue, ie]);
  function de(v) {
    if (!(W > 0)) return;
    const k = v.currentTarget.getBoundingClientRect(), K = Math.min(1, Math.max(0, (v.clientX - k.left) / k.width));
    x(K * W);
  }
  function q(v) {
    const k = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let K = null;
    Object.hasOwn(k, v.key) && (K = c + k[v.key]), v.key === "Home" && (K = 0), v.key === "End" && (K = W), K != null && (v.preventDefault(), v.stopPropagation(), x(Math.min(W, Math.max(0, K))));
  }
  function T(v) {
    var K;
    const k = (K = w.current) == null ? void 0 : K.getBoundingClientRect();
    k && A(br(v.clientX - k.left, Y));
  }
  function R(v) {
    const k = v.shiftKey ? 40 : 16;
    let K = null;
    v.key === "ArrowLeft" && (K = ae - k), v.key === "ArrowRight" && (K = ae + k), v.key === "Home" && (K = 160), v.key === "End" && (K = Y), K != null && (v.preventDefault(), v.stopPropagation(), A(br(K, Y)));
  }
  const h = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: w,
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
      n("button", { key: "out", type: "button", className: h, disabled: m <= 1, onClick: () => u(Sr(m - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: h, disabled: m === 1, onClick: () => u(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(m * 100)}%`),
      n("button", { key: "in", type: "button", className: h, disabled: m >= 8, onClick: () => u(Sr(m + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: h, onClick: ne, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(Y),
      "aria-valuenow": Math.round(ae),
      "aria-valuetext": `${Math.round(ae)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (v) => {
        v.currentTarget.setPointerCapture(v.pointerId), T(v);
      },
      onPointerMove: (v) => {
        v.currentTarget.hasPointerCapture(v.pointerId) && T(v);
      },
      onKeyDown: R,
      onDoubleClick: () => A(It.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${ae - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: S,
      onScroll: (v) => le({
        scrollTop: v.currentTarget.scrollTop,
        height: v.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: Ms(m) }, [
      n("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${Q}rem minmax(0,1fr)`, height: "1.5rem" } }, [
        n("div", { key: "axis-label", "data-timeline-label-gutter": "true", "aria-hidden": "true", className: "sticky left-0 z-40 border-r border-border", style: { backgroundColor: "var(--color-surface)" } }),
        n("div", {
          key: "ticks",
          role: "slider",
          tabIndex: 0,
          "data-timeline-seeker": "true",
          "data-timeline-track": "true",
          "aria-label": "Timeline seek",
          "aria-valuemin": 0,
          "aria-valuemax": W,
          "aria-valuenow": Math.min(W, Math.max(0, c)),
          "aria-valuetext": Re(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: de,
          onKeyDown: q
        }, re.map((v, k) => n("span", {
          key: v,
          className: `absolute top-0 ${$s(k, re.length, W > 0 ? v / W * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Ts(k, re.length, W > 0 ? v / W * 100 : 0)
        }, Re(v))).concat(t.map((v) => {
          const k = W > 0 ? v.startSec / W * 100 : 0;
          return n("button", {
            key: `shot-boundary:${v.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Re(v.startSec)} – ${Re(v.endSec)}`,
            title: `Shot boundary · ${v.source || "manual"} · ${Re(v.startSec)} – ${Re(v.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${k}%`, width: "2px" },
            onClick: (K) => {
              K.stopPropagation(), x(v.startSec);
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
            ...Ho(ve),
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
        style: D.length > 0 ? { height: ie.height } : void 0
      }, [
        D.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...Ho(ve, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        D.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : xe.map((v) => {
          var j;
          const k = v.group, K = i.includes(k.key), me = a === k.key, B = Ir(me);
          if (v.kind === "group") return n("div", {
            key: v.key,
            "data-segment-group": k.key,
            "data-segment-group-collapsed": K ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${Q}rem minmax(0,1fr)`,
              backgroundColor: B,
              top: v.top,
              height: v.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (G) => {
                if (G.metaKey || G.ctrlKey) {
                  y(k.lanes.flatMap((X) => X.markers.map(($e) => $e.segment.id)));
                  return;
                }
                f(k.key), g(k.key);
              },
              "aria-expanded": !K,
              "aria-current": me ? "true" : void 0,
              "data-selected-timeline-group": me ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: k.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: B
              },
              title: `${K ? "Expand" : "Collapse"} ${k.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, K ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, k.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              K ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${k.lanes.length} swimlane${k.lanes.length === 1 ? "" : "s"} hidden`
                ),
                H ? n(Vt, { key: "states", counts: k.counts }) : null
              ] : null
            )
          ]);
          const z = v.lane, V = _l(v.laneIndex), F = z.markers.some(({ segment: G }) => G.id === s);
          return n("div", {
            key: v.key,
            "data-grouped-swimlane": k.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${Q}rem minmax(0,1fr)`,
              top: v.top,
              height: v.height,
              backgroundColor: V
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": F ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: Wl(F, V),
              title: `${Wn(z)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Wn(z),
              onClick: (G) => {
                (G.metaKey || G.ctrlKey) && y(z.markers.map((X) => X.segment.id));
              },
              onMouseEnter: () => E(z.key),
              onMouseLeave: () => E((G) => G === z.key ? null : G)
            }, [
              z.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (G) => {
                  G.stopPropagation(), N({ tagId: z.tagId, tagName: z.label, trigger: G.currentTarget });
                },
                "aria-label": `Configure ${z.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: O === z.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, z.label),
              (j = z.performers) != null && j.length ? n($r, {
                key: "performers",
                performers: z.performers,
                performerAssignments: z.performerAssignments
              }) : null,
              H ? n(Vt, { key: "counts", counts: z.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, z.markers.map(({ segment: G, track: X }) => {
              var Qe;
              const $e = Jr(G.startSec, W), he = G.endSec == null ? G.startSec : Math.max(G.startSec, G.endSec), Je = Math.max(0, Jr(he, W) - $e), Pe = l.includes(G.id), Ae = G.id === s, Ke = fo(_.get(G.id)), lt = G.endSec == null ? Re(G.startSec) : `${Re(G.startSec)} – ${Re(G.endSec)}`, ft = (Qe = ci[Ke]) == null ? void 0 : Qe.label;
              return n("button", {
                key: G.id,
                type: "button",
                onClick: (ut) => {
                  ut.stopPropagation(), p(G, {
                    additive: ut.metaKey || ut.ctrlKey,
                    rangeSegmentIds: ut.shiftKey ? z.markers.map((tt) => tt.segment.id) : null
                  });
                },
                "aria-pressed": Pe,
                "aria-current": Ae ? "true" : void 0,
                "data-selected-timeline-marker": Ae ? "true" : void 0,
                "data-selected-segment-shortcut-target": Ae ? "true" : void 0,
                "aria-label": H ? `${G.tagName || "Tag segment"}${z.performerLabel ? `, ${z.performerLabel}` : ""}, ${G.reviewState}${ft ? `, ${ft}` : ""}, ${lt}` : `${G.tagName || "Tag segment"}${z.performerLabel ? `, ${z.performerLabel}` : ""}, ${lt}`,
                title: H ? `${G.tagName || "Tag segment"}${z.performerLabel ? ` · ${z.performerLabel}` : ""} · ${G.reviewState}${ft ? ` · ${ft}` : ""} · ${lt}` : `${G.tagName || "Tag segment"}${z.performerLabel ? ` · ${z.performerLabel}` : ""} · ${lt}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...H ? zl(G.reviewState, Pe, Ke, Ae) : Hl(Pe, Ae),
                  left: `${$e}%`,
                  top: `${Vl(X)}rem`,
                  width: ql(G.endSec, Je),
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
  const [a, s] = L(null), [l, d] = L([]), [c, m] = L(null), [u, f] = L(""), [g, p] = L(!0), [y, b] = L(null), [N, x] = L(""), [U, H] = L(!1), $ = pe(null), A = pe(0);
  fe(() => {
    const O = requestAnimationFrame(() => {
      var E;
      return (E = $.current) == null ? void 0 : E.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(O);
  }, [e]), fe(() => {
    const O = new AbortController();
    return p(!0), x(""), Promise.all([
      r ? te(`/slot-definitions/${e}`, { signal: O.signal }) : Promise.resolve(null),
      te("/segment-groups", { signal: O.signal })
    ]).then(([E, D]) => {
      const _ = D.find((se) => (se.tags || []).some((ie) => Number(ie.tagId) === Number(e)));
      s(E), d(D), m((_ == null ? void 0 : _.id) ?? null), f(_ == null ? "" : String(_.id)), H(!1);
    }).catch((E) => {
      E.name !== "AbortError" && x(E.message || "Unable to load tag configuration.");
    }).finally(() => {
      O.signal.aborted || p(!1);
    }), () => O.abort();
  }, [r, e]);
  function w(O, E) {
    s({
      ...a,
      definitions: a.definitions.map((D, _) => _ === O ? { ...D, ...E } : D)
    });
  }
  function S(O, E) {
    const D = O + E;
    if (D < 0 || D >= a.definitions.length) return;
    const _ = [...a.definitions];
    [_[O], _[D]] = [_[D], _[O]], s({
      ...a,
      definitions: _.map((se, ie) => ({ ...se, sortOrder: ie }))
    });
  }
  function C(O) {
    const E = a.definitions[O], D = Number(E.assignmentCount) || 0, _ = D === 0 ? "" : ` and its ${D} assignment${D === 1 ? "" : "s"}`;
    window.confirm(`Delete “${wt(E)}”${_}?`) && (D > 0 && H(!0), s({
      ...a,
      definitions: a.definitions.filter((se, ie) => ie !== O).map((se, ie) => ({ ...se, sortOrder: ie }))
    }));
  }
  async function M() {
    var E;
    b("slots"), x("Saving performer slots…");
    let O;
    try {
      O = await te(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: U,
          definitions: a.definitions.map((D, _) => {
            var se;
            return {
              id: D.id || void 0,
              label: ((se = D.label) == null ? void 0 : se.trim()) || null,
              sortOrder: _,
              genderHints: D.genderHints || []
            };
          })
        })
      }), s(O), H(!1);
    } catch (D) {
      D.status === 409 ? (x("Performer slots changed elsewhere; current values were reloaded."), (E = D.payload) != null && E.current && (s(D.payload.current), H(!1))) : x(D.message || "Unable to save performer slots."), b(null);
      return;
    }
    try {
      await o(), x("Performer slots saved.");
    } catch {
      x("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      b(null);
    }
  }
  async function J() {
    const O = u === "" ? null : Number(u);
    if (O !== c) {
      b("group"), x("Saving tag group…");
      try {
        await te(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: O })
        });
      } catch (E) {
        x(E.message || "Unable to assign the tag group."), b(null);
        return;
      }
      try {
        const [E, D] = await Promise.allSettled([
          te("/segment-groups"),
          o()
        ]);
        if (E.status === "fulfilled") {
          d(E.value);
          const _ = E.value.find((ie) => (ie.tags || []).some((xe) => Number(xe.tagId) === Number(e))), se = (_ == null ? void 0 : _.id) ?? null;
          m(se), f(se == null ? "" : String(se));
        }
        x(
          E.status === "fulfilled" && D.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        b(null);
      }
    }
  }
  l.find((O) => Number(O.id) === Number(c));
  const le = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (O) => {
      O.target === O.currentTarget && !y && i();
    },
    onKeyDownCapture: (O) => Ct(O, {
      onCancel: y ? void 0 : i
    })
  }, n("section", {
    ref: $,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: Bt,
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
            disabled: y != null,
            onChange: (O) => f(O.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((O) => n("option", { key: O.id, value: String(O.id) }, O.name))
          ])
        ]),
        g ? null : n("button", {
          key: "save",
          type: "button",
          disabled: y != null || (u === "" ? null : Number(u)) === c,
          onClick: J,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, y === "group" ? "Saving…" : "Save tag group")
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
              disabled: y != null,
              onChange: (O) => s({ ...a, allowSamePerformerInMultipleSlots: O.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((O, E) => n("article", {
            key: O.id || O._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: O.label || "",
                disabled: y != null,
                onChange: (D) => w(E, { label: D.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Ss.map((D) => n("label", { key: D, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: y != null,
                  checked: (O.genderHints || []).includes(D),
                  onChange: (_) => w(E, {
                    genderHints: _.target.checked ? [.../* @__PURE__ */ new Set([...O.genderHints || [], D])] : (O.genderHints || []).filter((se) => se !== D)
                  })
                }),
                n("span", { key: "text" }, Cr(D))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${O.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: y != null || E === 0, onClick: () => S(E, -1), className: le, "aria-label": `Move ${wt(O)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: y != null || E === a.definitions.length - 1, onClick: () => S(E, 1), className: le, "aria-label": `Move ${wt(O)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: y != null, onClick: () => C(E), className: `${le} text-red-300` }, "Delete")
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
                  _clientKey: `new-${++A.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: le
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: y != null,
              onClick: M,
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
function Sc(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function kc(e) {
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, analysisError: i, analysisRun: a, analysisStatus: s, approvalFacetCounts: l, autoAssignCandidates: d, autoAssignError: c, autoAssignOpen: m, autoAssignPerformers: u, autoAssigning: f, cancelQueuedReviewsForSegments: g, canMoveSelectionToBin: p, captureTrainingExport: y, centerTimelineRef: b, closeEditorFilters: N, closeFirstSegmentTagDialog: x, closeMaterializeDialog: U, closeMergeConfirmation: H, closePublishApprovedDialog: $, closeTagEditing: A, collapsedSegmentGroups: w, commonActionsRef: S, compatibilityMode: C, configuringTag: M, createSegment: J, creatingSegmentId: le, currentTime: O, deleteRejectedSegments: E, detail: D, detailPanelRef: _, detailWidth: se, duplicateSegment: ie, editorFilters: xe, editorLayout: W, editorRef: Y, exportingExamples: ae, filtersButtonRef: Q, filtersOpen: ve, firstSegmentTagOpen: ye, focusRowRef: be, handleSeparatorKeyDown: re, handleSeparatorPointerDown: ue, handleSeparatorPointerMove: ne, hasNextUnreviewed: Z, hasPreviousUnreviewed: de, hideDerivedSegments: q, history: T, historyOpen: R, historySaving: h, horizontalLayoutSize: v, importNativeSegments: k, incorrectExamples: K, incorrectExamplesOpen: me, lineage: B, markerRailWidth: z, materializeButtonRef: V, materializeCancelButtonRef: F, materializeDerivedSegments: j, materializeError: G, materializeLoading: X, materializeOpen: $e, materializePreview: he, materializing: Je, mediaStackRef: Pe, mergeCancelButtonRef: Ae, mergeConfirmation: Ke, mergeSaving: lt, mergeSelectedSwimlane: ft, nativeImportState: Qe, onDetailChange: ut, onNavigate: tt, onReload: st, onSlotsChanged: nt, openPublishApprovedDialog: ee, panelSeparatorProps: oe, pendingInitialSeekRef: Se, performerSlots: Ce, performerSlotsAvailable: ge, playbackControlsRef: Ue, previewDerivedSegments: ze, provenance: qe, provenanceSources: we, publishApprovedCancelButtonRef: Ee, publishApprovedDrafts: De, publishApprovedError: Ie, publishApprovedOpen: _e, quickSearchOpen: dt, railScrollRef: ke, railToggleRef: Be, recordHistoryAction: Oe, rejectedDeletionPreview: yt, removeIncorrectExample: Ze, removingExampleId: rt, restoreHistoryTarget: $t, runEditorAction: vt, saveMessage: Te, saveTag: Ne, saveTiming: We, savingSegmentId: ot, seekRef: Xe, segmentGroups: Rt, segmentRailLayout: ct, segments: Nt, selectAllVideoSegments: ln, selectSegment: Gt, selectSegmentCollection: Ar, selectedGroups: xn, selectedPerformerSlots: Sn, selectedSegment: Ut, selectedSegmentGroupKey: kn, selectedSegmentIds: dn, selectedSegments: Ht, selectedSlotStatus: wn, setAutoAssignError: Yt, setAutoAssignOpen: Qt, setConfiguringTag: Nn, setCurrentTime: Rr, setEditorFilters: Zn, setEditorLayout: Mr, setFiltersOpen: In, setHideDerivedSegments: Cn, setHistoryOpen: $n, setIncorrectExamplesOpen: Zt, setQuickSearchOpen: Xn, setRailViewport: er, setRejectedDeletionPreview: Tn, setSaveMessage: Xt, setSelectedSegmentGroupKey: cn, setSelectedSegmentId: An, setShortcutsOpen: bt, setTimelineZoom: tr, shotBoundaries: Rn, shortcutsOpen: nr, slotButtonRef: rr, splitLayout: Mt, splitSegment: Mn, startFullAnalysis: or, stepVideoFrame: ar, tagEditing: En, tagSearchRef: Dn, timelineDuration: On, timelineRatioBounds: et, timelineZoom: mt, toggleSegmentGroup: ir, toggleSegmentRail: Er, updateTimelineRatio: Et, video: He, videoPerformers: sr, visibleCounts: Pn, visibleSegmentRailRows: Ln, visibleSegments: un, wideLayout: qt, workspaceRef: Dr } = e, Fn = Ge(
    () => Nt.filter((I) => !I.published && I.reviewState === "approved"),
    [Nt]
  ), lr = bs(ao), jn = Fn.length, Ft = he ? he.createCount + he.linkCount : null, gt = ot != null, en = Ht.length > 0, Bn = Ht.length === 1, Or = en && Ht.every((I) => I.reviewState === "approved"), Pr = en && Ht.every((I) => I.reviewState === "rejected"), Lr = [
    { id: "marker.create", label: "New segment", disabled: gt },
    { id: "marker.editTag", label: "Edit tag", disabled: gt || !en },
    { id: "marker.setStart", label: "Set start", disabled: gt || !Bn },
    { id: "marker.setEnd", label: "Set end", disabled: gt || !Bn },
    { id: "marker.split", label: "Split", disabled: gt || !Bn },
    ...C ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !de, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Or ? "Unapprove" : "Approve", disabled: gt || !en, tone: "approve" },
      { id: "marker.reject", label: Pr ? "Unreject" : "Reject", disabled: gt || !en, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !Z, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...C ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: gt || !p, tone: "reject" }
    ]
  ];
  function xt(I) {
    const Me = dn.includes(I.id), ht = I.id === (Ut == null ? void 0 : Ut.id), pt = I.endSec == null ? Re(I.startSec) : `${Re(I.startSec)} – ${Re(I.endSec)}`, _t = `${Lt(I.sourceKey)}${I.confidence != null ? ` · ${Math.round(I.confidence * 100)}%` : ""}`;
    return n("button", {
      key: I.id,
      type: "button",
      onClick: (jt) => Gt(I, { additive: jt.metaKey || jt.ctrlKey }),
      "aria-pressed": Me,
      "aria-current": ht ? "true" : void 0,
      "data-selected-segment-shortcut-target": ht ? "true" : void 0,
      "aria-label": C ? `${I.tagName || "Tag segment"}, ${I.reviewState}${I.isDerived ? ", derived segment" : ""}, ${pt}` : `${I.tagName || "Tag segment"}${I.isDerived ? ", derived segment" : ""}, ${pt}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: di(Me, ht)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        C ? n(sn, { key: "review", state: I.reviewState, includeLabel: !1 }) : null,
        I.isDerived ? n(Tr, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          I.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, pt),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: _t
        }, _t)
      ])
    ]);
  }
  const Ye = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", tn = [...T.actions || []].reverse().find((I) => I.sequence <= T.cursorSequence);
  return n("section", {
    ref: Y,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${Mt ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (I) => Ni(I, tt, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${He.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: He.title || `Video ${He.id}`
          }, He.title || `Video ${He.id}`)),
          ...sr.map((I) => n(Vn, {
            key: it(I),
            performer: { id: it(I), name: I.name },
            compact: !0,
            tooltip: I.name
          })),
          C ? n(Vt, { key: "review-counts", counts: Pn }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          C ? null : n($i, { key: "bin", onNavigate: tt, compact: !0 }),
          n(Ti, { key: "settings", onNavigate: tt, compact: !0 })
        ])
      ]),
      C && D.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${D.nativeImportCount} Cove segment${D.nativeImportCount === 1 ? "" : "s"} ${D.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        Qe.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, Qe.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => k("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => k("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        Qe.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, Qe.error) : null
      ]) : null,
      i && (s == null ? void 0 : s.configured) !== !1 ? n("div", {
        key: "analysis-error",
        role: "alert",
        className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300"
      }, i) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          C ? n("div", {
            key: "full-analysis",
            className: "inline-flex items-stretch"
          }, [
            n("button", {
              key: "run",
              type: "button",
              disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
              onClick: () => or(),
              title: (s == null ? void 0 : s.error) || "Run AI tagging and shot boundary analysis into the Full review workflow",
              className: "segment-studio-full-scan-run inline-flex items-center justify-center bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
            }, (s == null ? void 0 : s.configured) === !1 ? "Full Scan not configured" : (s == null ? void 0 : s.ready) === !1 ? "Full Scan unavailable" : (a == null ? void 0 : a.status) === "queued" ? "Full Scan queued…" : (a == null ? void 0 : a.status) === "running" ? "Full Scan running…" : "Full Scan"),
            n("details", { key: "choices", className: "relative flex" }, [
              n("summary", {
                key: "summary",
                "aria-label": "Choose Full Scan analyses",
                "aria-disabled": (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
                title: "Choose analyses",
                onClick: (I) => {
                  ((s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running") && I.preventDefault();
                },
                onKeyDown: (I) => {
                  (I.key === "Enter" || I.key === " ") && ((s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running") && I.preventDefault();
                },
                className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${(s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running" ? "pointer-events-none cursor-default opacity-50" : "cursor-pointer hover:opacity-90"}`
              }, n(Oa, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([I, Me]) => n("button", {
                key: I,
                type: "button",
                disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
                onClick: (ht) => {
                  var pt;
                  (pt = ht.currentTarget.closest("details")) == null || pt.removeAttribute("open"), or(Me);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, I)))
            ])
          ]) : null,
          C ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: ot != null || d.length === 0,
            onClick: () => {
              Yt(""), Qt(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${d.length ? ` (${d.length})` : ""}`) : null,
          C ? n("button", {
            key: "materialize-derived",
            ref: V,
            type: "button",
            disabled: ot != null || X || Je || Ft === 0,
            onClick: ze,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, X ? "Analyzing…" : `Auto-Materialize${Ft != null ? ` (${Ft})` : ""}`) : null,
          C ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: ot != null || jn === 0,
            onClick: (I) => ee(I.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": _e,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${jn ? ` (${jn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: ae || rt != null || K.length === 0,
            onClick: () => Zt(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": me,
            "aria-label": `Open AI feedback collection, ${K.length} example${K.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${K.length ? ` (${K.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: Q,
            type: "button",
            onClick: () => In(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": ve,
            className: `${Ye} ${r ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(fr, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${r ? ` (${r})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => bt(!0),
            className: Ye
          }, [n(fr, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: (C ? T.actions.length === 0 : tn == null) || ot != null || h,
            onClick: C ? () => $n((I) => !I) : () => $t(
              tn.sequence - 1
            ),
            "aria-haspopup": C ? "dialog" : void 0,
            "aria-expanded": C ? R : void 0,
            className: Ye
          }, [
            n(fr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, C ? `History${T.actions.length ? ` (${T.actions.length})` : ""}` : tn ? `Undo ${tn.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: Be,
            type: "button",
            onClick: Er,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": W.markerRailOpen,
            className: Ye
          }, [
            n(fr, { key: "icon", name: "list" }),
            n("span", { key: "label" }, W.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    C && R ? n("section", {
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
          onClick: () => $n(!1),
          className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
        }, "Close")
      ]),
      n("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
        ...[...T.actions].reverse().map((I) => n("button", {
          key: I.sequence,
          type: "button",
          disabled: h,
          onClick: () => $t(I.sequence),
          "aria-current": T.cursorSequence === I.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${I.sequence > T.cursorSequence ? "text-secondary" : "text-foreground"} ${T.cursorSequence === I.sequence ? "bg-accent/15" : ""}`
        }, [
          n("span", { key: "label", className: "min-w-0 flex-1 truncate" }, I.label),
          n("time", {
            key: "time",
            dateTime: I.createdAt,
            className: "shrink-0 text-[10px] text-secondary"
          }, new Date(I.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        ])),
        n("button", {
          key: "baseline",
          type: "button",
          disabled: h,
          onClick: () => $t(T.baselineSequence),
          "aria-current": T.cursorSequence === T.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${T.cursorSequence === T.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    ve ? n(lc, {
      key: "editor-filters",
      filters: xe,
      hideDerivedSegments: q,
      performers: sr,
      provenanceSources: we,
      reviewCounts: l,
      segments: Nt,
      segmentGroups: Rt,
      reviewMode: C,
      onChange: Zn,
      onHideDerivedChange: Cn,
      onClose: N
    }) : null,
    ye ? n(sc, {
      key: "first-segment-tag-dialog",
      saving: ot != null,
      error: Te,
      onSelect: (I, Me) => J(I, Me),
      onClose: x
    }) : null,
    dt ? n(uc, {
      key: "quick-search-dialog",
      segments: El(o),
      onSelect: (I) => {
        Xn(!1), Gt(I, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        Xn(!1), requestAnimationFrame(() => {
          var I;
          return (I = Y.current) == null ? void 0 : I.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    m ? n(pc, {
      key: "auto-assign-dialog",
      candidates: d,
      processing: f,
      error: c,
      onConfirm: u,
      onClose: () => Qt(!1)
    }) : null,
    Ke ? n(yc, {
      key: "merge-selection-dialog",
      merge: Ke,
      processing: lt,
      undoable: !C,
      cancelButtonRef: Ae,
      onConfirm: (I) => ft(!0, I, Ke),
      onClose: H
    }) : null,
    $e ? n(hc, {
      key: "materialize-derived-dialog",
      preview: he,
      loading: X,
      processing: Je,
      error: G,
      cancelButtonRef: F,
      onConfirm: j,
      onClose: () => {
        Je || U();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: Dr,
      className: `${Mt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      W.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: qt ? { position: "absolute", top: 0, right: 0, width: z, height: v.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        Nt.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : un.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: ke,
          onScroll: (I) => er({
            scrollTop: I.currentTarget.scrollTop,
            height: I.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: ct.height }
        }, Ln.map((I) => {
          var ht;
          let Me;
          if (I.kind === "group") {
            const pt = w.includes(I.group.key), _t = I.group.lanes.reduce((jt, Fr) => jt + Fr.markers.length, 0);
            Me = n("button", {
              type: "button",
              onClick: () => {
                cn(I.group.key), ir(I.group.key);
              },
              "aria-expanded": !pt,
              "aria-current": kn === I.group.key ? "true" : void 0,
              "data-segment-rail-group": I.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${kn === I.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, pt ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: I.group.name }, I.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, _t),
              C && pt ? n(Vt, { key: "states", counts: I.group.counts }) : null
            ]);
          } else I.kind === "lane" ? Me = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Wn(I.lane),
            "aria-label": Wn(I.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, I.lane.label),
            (ht = I.lane.performers) != null && ht.length ? n($r, {
              key: "performers",
              performers: I.lane.performers,
              performerAssignments: I.lane.performerAssignments
            }) : null,
            C ? n(Vt, { key: "states", counts: I.lane.counts }) : null
          ]) : Me = xt(I.segment);
          return n("div", {
            key: I.key,
            className: "absolute left-0 right-0",
            style: { top: I.top, height: I.height }
          }, Me);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${Mt ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: Pe,
          className: `${Mt ? "min-h-0 flex-1" : ""} grid`,
          style: Mt ? {
            gridTemplateRows: `minmax(16rem, ${(1 - W.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${W.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: be,
            className: "grid min-h-0 gap-2",
            style: qt ? {
              gridTemplateColumns: W.markerRailOpen ? `${se}px 0.5rem minmax(0,1fr) 0.5rem ${z}px` : `${se}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(vc, {
              key: "tools",
              compatibilityMode: C,
              selectedSegment: Ut,
              selectedSegments: Ht,
              selectedGroups: xn,
              saveMessage: Te,
              savingSegmentId: ot,
              creatingSegmentId: le,
              acquireSaveLock: t,
              setSaveMessage: Xt,
              saveTag: Ne,
              slotStatus: wn,
              performerSlotsAvailable: ge,
              selectedPerformerSlots: Sn,
              performerSlots: Ce,
              detail: D,
              onDetailChange: ut,
              onCancelQueuedReview: g,
              video: He,
              slotButtonRef: rr,
              tagSearchRef: Dn,
              tagEditing: En,
              onCancelTagEditing: A,
              detailPanelRef: _,
              onReduceSelection: (I) => {
                Gt(I), requestAnimationFrame(() => {
                  var Me;
                  return (Me = _.current) == null ? void 0 : Me.focus({ preventScroll: !0 });
                });
              },
              saveTiming: We,
              onSlotsChanged: nt,
              onRecordHistory: Oe,
              splitSegment: Mn,
              duplicateSegment: ie,
              provenance: qe,
              lineage: B,
              onNavigateLineageItem: (I) => {
                const Me = Nt.find((ht) => ht.itemId === I);
                Me && An(Me.id);
              }
            }),
            qt ? n(
              "div",
              { key: "detail-separator", ...oe("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            He.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Aa, {
                streamUrl: `/api/stream/video/${He.id}`,
                posterUrl: `/api/stream/video/${He.id}/screenshot?v=${encodeURIComponent(He.updatedAt || "")}`,
                format: He.videoFile.format,
                audioCodec: He.videoFile.audioCodec,
                duration: He.videoFile.duration,
                videoId: He.id,
                trackingEnabled: !1,
                onSeekRegister: (I) => {
                  Xe.current = I, Tl(Se.current, Nt, I) && (Se.current = null);
                },
                onPlaybackControlRegister: (I) => {
                  Ue.current = I;
                },
                onTimeUpdate: Rr
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            qt && W.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...oe("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            qt && W.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: S,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...Lr.map((I) => {
              var pt;
              const Me = (pt = lr[I.id]) == null ? void 0 : pt[0], ht = I.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : I.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: I.id,
                type: "button",
                disabled: I.disabled,
                "data-action-id": I.id,
                onClick: (_t) => {
                  const jt = _t.currentTarget;
                  vt(I.id, { target: jt, preserveFocus: !0 }), I.focusWhenDisabled && requestAnimationFrame(() => {
                    Sc(jt, S.current, I.focusWhenDisabled);
                  });
                },
                title: Me ? `${I.label} (${Me})` : I.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${ht}`
              }, [
                n("span", { key: "label" }, I.label),
                Me ? n("kbd", {
                  key: "shortcut",
                  className: "rounded border border-border/70 bg-background/70 px-1 py-0.5 font-mono text-[10px] leading-none text-secondary"
                }, Me) : null
              ]);
            }),
            n("div", { key: "frame-actions", className: "ml-auto flex items-center gap-1" }, [
              n("button", {
                key: "previous-frame",
                type: "button",
                disabled: !He.videoFile,
                onClick: () => ar(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(hs, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !He.videoFile,
                onClick: () => ar(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(vs, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          Mt ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(et.minimum * 100),
            "aria-valuemax": Math.round(et.maximum * 100),
            "aria-valuenow": Math.round(W.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(W.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: ue,
            onPointerMove: ne,
            onKeyDown: re,
            onDoubleClick: () => Et(It.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: Mt ? void 0 : { height: "20rem" } }, n(xc, {
            segments: un,
            shotBoundaries: Rn,
            segmentGroups: Rt,
            performerSlots: Ce,
            collapsedGroupKeys: w,
            selectedGroupKey: kn,
            selectedSegmentId: Ut == null ? void 0 : Ut.id,
            selectedSegmentIds: dn,
            duration: On,
            currentTime: O,
            zoom: mt,
            onZoomChange: tr,
            onSelectGroup: cn,
            onToggleGroup: ir,
            onSelect: (I, Me) => Gt(I, Me),
            onSelectSegments: Ar,
            onSelectAll: ln,
            onConfigureTag: (I) => Nn(I),
            onSeekTime: (I) => {
              var Me;
              return (Me = Xe.current) == null ? void 0 : Me.call(Xe, I, !1);
            },
            centerRef: b,
            showReviewState: C,
            swimlaneTitleWidth: W.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (I) => Mr((Me) => ({ ...Me, swimlaneTitleWidth: I }))
          }))
        ])
      ])
    ]),
    M ? n(ho, {
      key: `configure-tag:${M.tagId}`,
      tagId: M.tagId,
      tagName: M.tagName,
      performerSlotsEnabled: C,
      onSaved: st,
      onClose: () => {
        const I = M.trigger;
        Nn(null), requestAnimationFrame(() => {
          var Me;
          I != null && I.isConnected ? I.focus({ preventScroll: !0 }) : (Me = Y.current) == null || Me.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    _e ? n(gc, {
      key: "publish-approved-dialog",
      drafts: Fn,
      processing: ot === -1,
      error: Ie,
      cancelButtonRef: Ee,
      onConfirm: De,
      onClose: $
    }) : null,
    yt ? n(fc, {
      key: "rejected-deletion-dialog",
      preview: yt,
      onConfirm: () => {
        E(yt), requestAnimationFrame(() => {
          var I;
          return (I = Y.current) == null ? void 0 : I.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Tn(null), requestAnimationFrame(() => {
          var I;
          return (I = Y.current) == null ? void 0 : I.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    nr ? n(dc, {
      key: "shortcuts-dialog",
      reviewMode: C,
      bindings: lr,
      onClose: () => bt(!1)
    }) : null,
    me ? n(cc, {
      key: "incorrect-examples-dialog",
      examples: K,
      exporting: ae,
      removingExampleId: rt,
      onExport: y,
      onRemove: Ze,
      onClose: () => Zt(!1)
    }) : null
  ]);
}
function wc(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: m, setCollapsedSegmentGroups: u, setEditorFilters: f, setHideDerivedSegments: g, setSaveMessage: p, setSelectedSegmentGroupKey: y, setSelectedSegmentId: b, setSelectedSegmentIds: N } = e;
  function x(w) {
    const S = Ot(t, w);
    S && u((C) => yi(C, S));
  }
  function U(w) {
    b(w), N(w == null ? [] : [w]), c.current = w, m.current = [];
  }
  function H(w, {
    focusEditor: S = !1,
    seekToSegment: C = !1,
    additive: M = !1,
    rangeSegmentIds: J = null
  } = {}) {
    var O, E;
    const le = _s({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: m.current
    }, w.id, J, M);
    N(le.selectedSegmentIds), b(le.activeSegmentId), c.current = le.anchorSegmentId, m.current = le.rangeBaseSegmentIds, le.activeSegmentId != null && y(Ot(t, le.activeSegmentId)), x(w.id), S && ((O = r.current) == null || O.focus({ preventScroll: !0 })), C && ((E = i.current) == null || E.call(i, w.startSec, !1));
  }
  function $(w) {
    const S = Hs(
      d,
      l,
      w
    );
    N(S.selectedSegmentIds), b(S.activeSegmentId), c.current = S.activeSegmentId, m.current = [], S.activeSegmentId != null && (y(Ot(t, S.activeSegmentId)), x(S.activeSegmentId));
  }
  function A() {
    var C;
    const w = Vs(s), S = w.includes(l) ? l : w[0] ?? null;
    f(At({})), g(!1), N(w), b(S), c.current = S, m.current = [], S != null && y(Ot(
      rn(s, a, o),
      S
    )), p(w.length === 0 ? "There are no segments to select." : `${w.length} segments selected. Collapsed Segment groups keep their selected segments.`), (C = r.current) == null || C.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: x, replaceSegmentSelection: U, selectSegment: H, selectSegmentCollection: $, selectAllVideoSegments: A };
}
function Nc(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, historyRef: c, onConflict: m, onDetailChange: u, onReload: f, recordHistoryAction: g, revealSegmentGroupForSelection: p, savingSegmentId: y, selectedGroups: b, selectedSegment: N, selectedSegmentIdRef: x, selectedSegments: U, selectionAnchorIdRef: H, selectionRangeBaseIdsRef: $, setMergeConfirmation: A, setSaveMessage: w, setSelectedSegmentId: S, setSelectedSegmentIds: C, video: M } = e;
  function J() {
    A(null), requestAnimationFrame(() => {
      var D;
      return (D = a.current) == null ? void 0 : D.focus({ preventScroll: !0 });
    });
  }
  async function le(D = !1, _ = !1, se = null) {
    if (y != null) return;
    const ie = se || pi(
      b,
      { nativeOnly: !o }
    );
    if (!ie) {
      w("Select at least two segments from one swimlane.");
      return;
    }
    if (!D && Ha()) {
      A(ie);
      return;
    }
    _ && qa(!1);
    const xe = ie.endSec == null ? "open end" : Re(ie.endSec);
    let W = ie.segments[0];
    const Y = o ? null : Tt(ie.segments, !1), ae = o ? null : crypto.randomUUID(), Q = ie.segments.map((be) => be.id), ve = Cd(i, ie.segments), ye = r("merge", ie.segments[0].id);
    if (ye) {
      J(), u(ve, M.id), C([W.id]), S(W.id), H.current = W.id, $.current = [];
      try {
        const be = ie.segments.slice(1);
        if (!o || W.nativeSegmentId != null) {
          const re = be.map((ne) => {
            const Z = `merge-native-selection:${M.id}:${W.id}:${ne.id}:${W.updatedAt}:${ne.updatedAt}`;
            return { key: Z, operationId: Fe(Z), segmentId: ne.id, expectedUpdatedAt: ne.updatedAt };
          }), ue = await te(`/videos/${M.id}/segments/merge-selection`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              survivorSegmentId: W.id,
              expectedSurvivorUpdatedAt: W.updatedAt,
              consumedSegments: re.map(({ key: ne, ...Z }) => Z),
              historyReceiptId: ae
            })
          });
          W = ue.survivor, u((ne) => sa(ne, ue), M.id), re.forEach(({ key: ne }) => je(ne));
        } else {
          const re = be.map((ne) => {
            const Z = `merge-draft-selection:${M.id}:${W.itemId}:${ne.itemId}:${W.revision}:${ne.revision}`;
            return { key: Z, operationId: Fe(Z), itemId: ne.itemId, expectedRevision: ne.revision };
          }), ue = await te(`/videos/${M.id}/drafts/merge-selection`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              survivorItemId: W.itemId,
              expectedSurvivorRevision: W.revision,
              consumedDrafts: re.map(({ key: ne, ...Z }) => Z)
            })
          });
          W = ue.survivor, u((ne) => sa(ne, ue), M.id), re.forEach(({ key: ne }) => je(ne));
        }
        C([W.id]), S(W.id), H.current = W.id, $.current = [], o ? t(Kt) : await g(
          "segments.merge",
          `Merged ${ie.segments.length} segments`,
          Y,
          Tt([W], !1),
          ae
        ), p(W.id), w(`${ie.segments.length} segments merged into ${Re(ie.startSec)} – ${xe}.`);
      } catch (be) {
        u((re) => bi(
          no(re, [ie.segments[0]], [
            "startSec",
            "endSec",
            "sourceKey",
            "sourceRunId",
            "confidence",
            "isDerived"
          ]),
          ie.segments.slice(1)
        ), M.id), C(Q), S((N == null ? void 0 : N.id) ?? Q[0] ?? null), H.current = (N == null ? void 0 : N.id) ?? Q[0] ?? null, $.current = [], be.status === 409 ? await m() : w(be.message || "Unable to merge selected segments.");
      } finally {
        ye();
      }
    }
  }
  function O(D, _ = U, se = N) {
    if (_.length === 0) return Promise.resolve(null);
    const ie = sl(D, _, se), xe = Math.max(0, ie.identities.indexOf(ie.activeIdentity)), W = xi(d()) != null, Y = l({
      kind: "review",
      lockId: ie.activeIdentity.id,
      targets: ie.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (ae) => E(ae, {
        ...ie,
        identities: ae.targets,
        activeIdentity: ae.targets[xe]
      })
    });
    return Y ? (W && w(`${D === "approved" ? "Approval" : "Rejection"} queued…`), Y.done) : Promise.resolve(null);
  }
  async function E({ detail: D, segments: _, onConflict: se, onReload: ie }, xe) {
    var Z;
    const W = ll(xe, _);
    if (!W) {
      w("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: Y, selectedSegments: ae, selectedSegment: Q } = W, ve = il(ae, Y), ye = ae.filter((de) => de.reviewState !== ve);
    if (ye.length === 0) return;
    const be = ae.map((de) => ({
      id: de.id,
      itemId: de.itemId,
      nativeSegmentId: de.nativeSegmentId
    })), re = be.find((de) => de.id === (Q == null ? void 0 : Q.id)) || be[0], ue = (de, q = !1) => {
      if (!(de != null && de.segments) || !q && !Zr(x.current, re.id))
        return;
      const T = be.map((h) => Ve(de == null ? void 0 : de.segments, h)).filter(Boolean), R = Ve(de == null ? void 0 : de.segments, re) || T[0] || null;
      C(T.map((h) => h.id)), S((R == null ? void 0 : R.id) ?? null), H.current = (R == null ? void 0 : R.id) ?? null, $.current = [];
    };
    w(`Updating ${ye.length} selected segment${ye.length === 1 ? "" : "s"}…`);
    const ne = Jn();
    s({
      type: "add",
      entry: { id: ne, op: "patch", targets: ye.map(on), values: { reviewState: ve } }
    });
    try {
      const de = await te(`/videos/${M.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: c.current.revision,
          reviewState: ve,
          segments: ae.map((h) => h.published ? {
            nativeSegmentId: h.nativeSegmentId,
            expectedUpdatedAt: h.updatedAt
          } : {
            itemId: h.itemId,
            expectedRevision: h.revision
          })
        })
      }), q = new Map((de.items || []).map((h) => [
        h.requestedNativeSegmentId != null ? `native:${h.requestedNativeSegmentId}` : `item:${h.requestedItemId}`,
        h
      ]));
      if (be.forEach((h) => {
        const v = q.get(h.nativeSegmentId != null ? `native:${h.nativeSegmentId}` : `item:${h.itemId}`);
        v && (h.nativeSegmentId = v.nativeSegmentId, h.itemId = v.itemId);
      }), de.history && t(de.history), ve === "rejected" || (de.items || []).some((h) => h.requestedNativeSegmentId != null && h.nativeSegmentId !== h.requestedNativeSegmentId)) {
        ue(await ie()), s({ type: "settle", key: ne }), w(`${de.updatedCount} selected segment${de.updatedCount === 1 ? "" : "s"} ${ve === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const R = (h) => ({
        ...h,
        approvedSetVersion: de.approvedSetVersion || h.approvedSetVersion,
        segments: (h.segments || []).map((v) => {
          const k = q.get(v.nativeSegmentId != null ? `native:${v.nativeSegmentId}` : `item:${v.itemId}`);
          return k ? {
            ...v,
            id: k.nativeSegmentId != null ? k.nativeSegmentId : -k.itemId,
            itemId: k.itemId,
            nativeSegmentId: k.nativeSegmentId,
            published: k.nativeSegmentId != null,
            reviewState: ve,
            revision: k.nativeSegmentId != null ? v.revision : k.revision,
            updatedAt: k.updatedAt
          } : v;
        })
      });
      u(R, M.id), s({ type: "settle", key: ne }), ue(R(D)), w(`${de.updatedCount} selected segment${de.updatedCount === 1 ? "" : "s"} ${ve === "approved" ? "approved" : ve === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (de) {
      s({ type: "discard", key: ne }), de.status === 409 && ((Z = de.payload) != null && Z.currentHistory) && t(de.payload.currentHistory);
      const q = de.status === 409 ? await se() : D;
      ue(q, !0), w(de.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: J, mergeSelectedSwimlane: le, saveSelectedReviewState: O };
}
function Ic(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: m, detail: u, editorFilters: f, editorRef: g, cancelSaveTasks: p, dispatchPendingChanges: y, enqueueSave: b, exportingExamples: N, hideDerivedSegments: x, incorrectExamples: U, lineage: H, materializeButtonRef: $, materializePreview: A, materializeRestoreFocusRef: w, materializing: S, mutateSegment: C, runSegmentMutation: M, pendingChanges: J, onConflict: le, onDetailChange: O, onReload: E, performerSlots: D, recordHistoryAction: _, refreshMaterializationPreview: se, removingExampleId: ie, revealSegmentGroupForSelection: xe, savingSegmentId: W, segmentGroups: Y, segments: ae, selectedSegment: Q, selectedSegmentIdRef: ve, selectedSegments: ye, selectionAnchorIdRef: be, selectionRangeBaseIdsRef: re, setAutoAssignError: ue, setAutoAssignOpen: ne, setAutoAssigning: Z, setEditorFilters: de, setExportingExamples: q, setHideDerivedSegments: T, setIncorrectExamples: R, setMaterializeError: h, setMaterializeLoading: v, setMaterializeOpen: k, setMaterializePreview: K, setMaterializing: me, setRejectedDeletionPreview: B, setRemovingExampleId: z, setSaveMessage: V, setSelectedSegmentGroupKey: F, setSelectedSegmentId: j, setSelectedSegmentIds: G, video: X } = e;
  async function $e() {
    var Ie, _e, dt;
    if (ye.length === 0 || !Q || W != null) return;
    const ee = vd(ye, U), oe = ee.segments;
    if (oe.length === 0) return;
    const Se = ye.map((ke) => ({
      id: ke.id,
      itemId: ke.itemId,
      nativeSegmentId: ke.nativeSegmentId
    })), Ce = Se.find((ke) => ke.id === Q.id) || Se[0], ge = [], Ue = [];
    let ze = !1, qe = u, we = !1;
    const Ee = [], De = r("feedback", Ce.id);
    if (De) {
      V(ee.action === "remove" ? `Removing ${oe.length} selected incorrect example${oe.length === 1 ? "" : "s"}…` : `Collecting ${oe.length} selected segment${oe.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const ke = async (Te, Ne) => {
          const We = Te.nativeSegmentId != null, ot = ee.action === "remove" ? `incorrect-example-remove:${X.id}:${Ne == null ? void 0 : Ne.id}:${Ne == null ? void 0 : Ne.revision}:${Ne == null ? void 0 : Ne.representationRevision}` : `incorrect-example-collect:${X.id}:${We ? `native:${Te.nativeSegmentId}:${Te.updatedAt}` : `item:${Te.itemId}:${Te.revision}`}`;
          if (ee.action === "remove" && !Ne)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let Xe;
          try {
            Xe = ee.action === "remove" ? await te(
              `/videos/${X.id}/incorrect-examples/${Ne.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: Fe(ot),
                  expectedExampleRevision: Ne.revision,
                  expectedRepresentationRevision: Ne.representationRevision
                })
              }
            ) : await te(`/videos/${X.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Fe(ot),
                nativeSegmentId: We ? Te.nativeSegmentId : null,
                itemId: We ? null : Te.itemId,
                expectedUpdatedAt: We ? Te.updatedAt : null,
                expectedRevision: We ? null : Te.revision
              })
            });
          } catch (Rt) {
            throw Rt.operationKey = ot, Rt;
          }
          if (!xd(ee.action, Xe))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return je(ot), Xe;
        };
        for (const Te of oe) {
          const Ne = ee.action === "remove" ? U.find((We) => We.itemId != null && We.itemId === Te.itemId) : null;
          try {
            const We = Se.find((ct) => ct.id === Te.id);
            let ot = Ve(
              qe == null ? void 0 : qe.segments,
              We
            ) || Te, Xe;
            try {
              Xe = await ke(ot, Ne);
            } catch (ct) {
              if (ct.status === 409 && ((_e = (Ie = ct.payload) == null ? void 0 : Ie.result) == null ? void 0 : _e.code) === "OPERATION_REPLAYED")
                qe = await te(
                  `/videos/${X.id}/editor`
                ), we = !0, Ee.length = 0, je(ct.operationKey), Xe = ct.payload.result;
              else {
                if (ee.action !== "collect" || ct.status !== 409) throw ct;
                const Nt = await te(
                  `/videos/${X.id}/editor`
                );
                qe = Nt, we = !0, Ee.length = 0;
                const ln = Ve(
                  Nt == null ? void 0 : Nt.segments,
                  We
                );
                if (!ln) throw ct;
                ot = ln, Xe = await ke(ot, null);
              }
            }
            We && Xe.itemId != null && (We.itemId = Xe.itemId), qe = hr(
              qe,
              Xe.editorDelta
            ), Ee.push(Xe.editorDelta);
            const Rt = { segment: Te, result: Xe, example: Ne };
            ge.push(Rt);
          } catch (We) {
            if (Ue.push(We), ![400, 404, 409].includes(We.status)) break;
          }
        }
        if (c && ge.length > 0) {
          const Te = ee.action === "remove", Ne = ge.length;
          await _(
            Te ? "feedback.remove" : "feedback.collect",
            Te ? `Removed ${Ne} incorrect AI example${Ne === 1 ? "" : "s"}` : `Collected ${Ne} incorrect AI example${Ne === 1 ? "" : "s"}`,
            gr(ge, Te),
            gr(ge, !Te)
          ) || (ze = !0);
        }
        ge.some(({ result: Te }) => Te.representation === "basicNativeBin") && Hn();
        const Be = Zr(
          ve.current,
          Ce.id
        ), Oe = ee.action === "collect" && ge.some(({ segment: Te }) => Te.id === Ce.id), yt = ge.map(({ segment: Te }) => Te.id), Ze = Oe ? Ys(
          o,
          yt,
          Ce.id
        ) : null, rt = Oe ? (Ze == null ? void 0 : Ze.id) ?? null : Ce.id;
        Be && Oe && (G(Ze ? [Ze.id] : []), j((Ze == null ? void 0 : Ze.id) ?? kr), be.current = (Ze == null ? void 0 : Ze.id) ?? null, re.current = []);
        const $t = await te(`/videos/${X.id}/incorrect-examples`);
        R($t);
        const vt = qe;
        if (O(we ? vt : (Te) => Ee.reduce(hr, Te), X.id), Be && Zr(
          ve.current,
          rt
        )) {
          let Te, Ne;
          Oe ? (Ne = Ze ? Ve(vt == null ? void 0 : vt.segments, {
            id: Ze.id,
            itemId: Ze.itemId,
            nativeSegmentId: Ze.nativeSegmentId
          }) : null, Te = Ne ? [Ne] : []) : (Te = Se.map((We) => Ve(vt == null ? void 0 : vt.segments, We)).filter(Boolean), Ne = Ve(vt == null ? void 0 : vt.segments, Ce) || Te[0] || null), G(Te.map((We) => We.id)), j((Ne == null ? void 0 : Ne.id) ?? (Oe ? kr : null)), be.current = (Ne == null ? void 0 : Ne.id) ?? null, re.current = [], F(Ne ? Ot(o, Ne.id) : null), Ne && xe(Ne.id);
        }
        if (Ue.length > 0) {
          const Te = ((dt = Ue[0]) == null ? void 0 : dt.message) || "Only segments with registered AI provenance can be collected.";
          ge.length === 0 ? V(Te) : ee.action === "remove" ? V(
            `Partially removed ${ge.length} of ${oe.length} selected incorrect examples. ${Te}`
          ) : V(
            `Partially collected ${ge.length} of ${oe.length} selected segments. ${Te}`
          );
        } else if (ee.action === "remove")
          V(
            `${ge.length} incorrect example${ge.length === 1 ? "" : "s"} removed and ${ge.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const Te = ge.filter(({ result: Ne }) => Ne.representation === "basicNativeBin").length;
          V(Te === ge.length ? `${ge.length} incorrect AI example${ge.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ge.length} incorrect AI example${ge.length === 1 ? "" : "s"} collected and ${ge.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        ze && V("The change saved, but editor history could not be updated.");
      } catch (ke) {
        V(ke.message || "Unable to update the selected incorrect examples.");
      } finally {
        De();
      }
    }
  }
  async function he(ee) {
    var Se, Ce;
    if (!ee || ie != null || N) return;
    z(ee.id);
    const oe = `incorrect-example-remove:${X.id}:${ee.id}:${ee.revision}:${ee.representationRevision}`;
    try {
      let ge, Ue = !1;
      try {
        ge = await te(
          `/videos/${X.id}/incorrect-examples/${ee.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(oe),
              expectedExampleRevision: ee.revision,
              expectedRepresentationRevision: ee.representationRevision
            })
          }
        );
      } catch (we) {
        if (we.status !== 409 || ((Ce = (Se = we.payload) == null ? void 0 : Se.result) == null ? void 0 : Ce.code) !== "OPERATION_REPLAYED")
          throw we;
        ge = we.payload.result, Ue = !0;
      }
      je(oe);
      let ze = !0;
      if (c) {
        const Ee = [{ segment: Ve(u.segments, {
          itemId: ee.itemId
        }) || {
          id: ee.itemId == null ? null : -ee.itemId,
          itemId: ee.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: ee.representationRevision
        }, result: ge, example: ee }];
        ze = await _(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          gr(Ee, !0),
          gr(Ee, !1)
        );
      }
      const qe = await te(
        `/videos/${X.id}/incorrect-examples`
      );
      R(qe), Ue ? await E() : O(
        (we) => hr(we, ge.editorDelta),
        X.id
      ), ee.representation === "basicNativeBin" && Hn(), V(ze ? Ue ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : ee.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (ge) {
      ge.status === 409 && await le(), V(ge.message || "Unable to remove the incorrect example.");
    } finally {
      z(null);
    }
  }
  async function Je() {
    if (N || ie != null || U.length === 0) return;
    q(!0);
    const ee = `incorrect-example-export:${X.id}:${U.map((oe) => `${oe.id}:${oe.revision}:${oe.representationRevision}`).join(",")}`;
    try {
      const oe = await kd(
        X.id,
        U
      ), Se = new FormData();
      Se.append("metadata", JSON.stringify({
        operationId: Fe(ee),
        examples: oe.captures
      }));
      for (const we of oe.files)
        Se.append(we.fieldName, we.file);
      const Ce = await te(
        `/videos/${X.id}/incorrect-examples/export`,
        { method: "POST", body: Se }
      ), ge = await Bl(Ce.downloadUrl), Ue = URL.createObjectURL(ge.blob), ze = document.createElement("a");
      ze.href = Ue, ze.download = ge.fileName, ze.click(), setTimeout(() => URL.revokeObjectURL(Ue), 1e3);
      const qe = await te(
        `/training-exports/${Ce.id}/complete`,
        { method: "POST" }
      );
      je(ee), R(await te(
        `/videos/${X.id}/incorrect-examples`
      )), V(
        `Downloaded ${Ce.exampleCount} incorrect example${Ce.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${qe.clearedExampleCount} from the working collection.`
      );
    } catch (oe) {
      V(oe.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      q(!1);
    }
  }
  async function Pe(ee = null) {
    const oe = ae.filter((De) => De.reviewState === "rejected"), Se = oe.length, Ce = U.some((De) => De.representation === "fullItem");
    if (ee == null && Se === 0 && !Ce) {
      V("There are no rejected segments to delete.");
      return;
    }
    if (ee == null) {
      const De = r("delete-rejected", -1);
      if (!De) return;
      V("Preparing deletion summary…");
      try {
        const Ie = await te(`/videos/${X.id}/rejected/deletion/preview`, { method: "POST" }), _e = Number(Ie.deletedSegmentCount) || 0, dt = Number(Ie.deferredRejectedSegmentCount) || 0, ke = Number(Ie.protectedIncorrectExampleCount) || 0;
        if (_e === 0) {
          dt > 0 ? V(
            `${dt} feedback-protected rejected segment${dt === 1 ? "" : "s"} kept. ${ke} AI feedback example${ke === 1 ? "" : "s"} must be exported before ${dt === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : V("There are no rejected segments to delete.");
          return;
        }
        if (!ai(Ie, V)) return;
        B(Ie), V("");
      } catch (Ie) {
        V(Ie.message || "Unable to prepare rejected segment deletion.");
      } finally {
        De();
      }
      return;
    }
    const ge = ee, Ue = Number(ge.deferredRejectedSegmentCount) || 0, ze = ve.current, qe = Ue === 0 ? Id(u, oe.map((De) => De.id)) : u, we = qe.segments.find((De) => De.reviewState === "unreviewed") || qe.segments[0] || null, Ee = r("delete-rejected", -1);
    if (Ee) {
      B(null), V("Deleting rejected segments…"), Ue === 0 && (O(qe, X.id), G(we ? [we.id] : []), j((we == null ? void 0 : we.id) ?? null), be.current = (we == null ? void 0 : we.id) ?? null, re.current = []);
      try {
        const De = `rejected-dependency-delete:${X.id}:${ge.fingerprint}`, Ie = await te(`/videos/${X.id}/rejected/deletion/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(De),
            fingerprint: ge.fingerprint
          })
        });
        je(De), await E(), Ie.deletedSegmentCount > 0 && t(Kt);
        const _e = Ue > 0 ? ` ${Ue} feedback-protected rejected segment${Ue === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
        V(`${Ie.deletedSegmentCount} segment${Ie.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${_e}`);
      } catch (De) {
        Ue === 0 && O((Ie) => bi(
          Ie,
          oe
        ), X.id), G(ze == null ? [] : [ze]), j(ze), be.current = ze, re.current = [], V(De.message || "Unable to delete rejected segments.");
      } finally {
        Ee();
      }
    }
  }
  async function Ae(ee = i) {
    if (!(a || ee.length === 0)) {
      Z(!0), ue("");
      try {
        const oe = await te(`/videos/${X.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: ee.flatMap((Se) => Se.nativeSegmentId == null ? [] : [Se.nativeSegmentId]),
            itemIds: ee.flatMap((Se) => Se.published || Se.itemId == null ? [] : [Se.itemId])
          })
        });
        ne(!1), await E(), V(`${oe.assignedSegmentCount} segment${oe.assignedSegmentCount === 1 ? "" : "s"} received ${oe.assignedSlotCount} performer-slot assignment${oe.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (oe) {
        ue(oe.message || "Unable to auto-assign performers.");
      } finally {
        Z(!1);
      }
    }
  }
  async function Ke() {
    k(!0), h(""), !A && (v(!0), se());
  }
  function lt() {
    w.current = !0, k(!1), requestAnimationFrame(() => {
      var ee;
      return (ee = $.current) == null ? void 0 : ee.focus({ preventScroll: !0 });
    });
  }
  async function ft() {
    if (!A || S || A.createCount + A.linkCount === 0)
      return;
    me(!0), h("");
    let ee;
    try {
      const oe = `materialize-derived:${X.id}:${A.fingerprint}`;
      ee = await te(`/videos/${X.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(oe),
          fingerprint: A.fingerprint,
          maxDepth: 3
        })
      }), je(oe);
    } catch (oe) {
      oe.status === 409 && K(null), h(oe.message || "Unable to materialize derived segments."), me(!1);
      return;
    }
    K((oe) => oe && { ...oe, createCount: 0, linkCount: 0 });
    try {
      await E(), lt(), K(null);
      const oe = ee.createdCount + ee.linkedCount;
      V(`${ee.createdCount} derived segment${ee.createdCount === 1 ? "" : "s"} created and ${ee.linkedCount} existing segment${ee.linkedCount === 1 ? "" : "s"} linked.`), oe === 0 && V("Every applicable derivation was already materialized.");
    } catch {
      h("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    me(!1);
  }
  async function Qe(ee, oe = null) {
    var ge, Ue, ze, qe;
    const Se = {
      tagId: ee,
      ...oe ? { tagName: oe } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (ye.length > 1) {
      const we = ye.filter((ke) => ke.tagId !== ee);
      if (we.length === 0) {
        d();
        return;
      }
      const Ee = ye.map((ke) => ({
        id: ke.id,
        itemId: ke.itemId,
        nativeSegmentId: ke.nativeSegmentId
      })), De = ye.map((ke) => !c || ke.nativeSegmentId != null ? `native:${ke.nativeSegmentId}:${ke.updatedAt}` : `item:${ke.itemId}:${ke.revision}`).sort().join(","), Ie = `bulk-tag:${X.id}:${ee}:${De}`, _e = ma(
        u,
        we.map((ke) => ke.id),
        Se
      ), dt = r("tag", (Q == null ? void 0 : Q.id) ?? we[0].id);
      if (!dt) return;
      V(`Changing tag for ${we.length} selected segment${we.length === 1 ? "" : "s"}…`), O(_e, X.id), d();
      try {
        const ke = c ? null : crypto.randomUUID();
        await te(`/videos/${X.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(Ie),
            tagId: ee,
            historyReceiptId: ke,
            segments: ye.map((rt) => {
              const $t = !c || rt.nativeSegmentId != null;
              return {
                nativeSegmentId: $t ? rt.nativeSegmentId : null,
                itemId: $t ? null : rt.itemId,
                expectedUpdatedAt: $t ? rt.updatedAt : null,
                expectedRevision: $t ? null : rt.revision
              };
            })
          })
        }), je(Ie);
        const Be = Tt(
          ye,
          c
        ), Oe = await E(), yt = Ee.map((rt) => Ve(Oe == null ? void 0 : Oe.segments, rt)).filter(Boolean);
        await _(
          "segments.tag",
          `Changed tag for ${we.length} segment${we.length === 1 ? "" : "s"}`,
          Be,
          Tt(yt, c),
          ke
        );
        const Ze = Ee.map((rt) => Ve(Oe == null ? void 0 : Oe.segments, rt)).filter(Boolean);
        G(Ze.map((rt) => rt.id)), j(((ge = Ze.find((rt) => rt.id === (Q == null ? void 0 : Q.id))) == null ? void 0 : ge.id) ?? ((Ue = Ze[0]) == null ? void 0 : Ue.id) ?? null), d(), V(`${we.length} selected segment${we.length === 1 ? "" : "s"} retagged.`);
      } catch (ke) {
        O((yt) => no(
          yt,
          we,
          Object.keys(Se)
        ), X.id);
        const Be = Ee.map((yt) => Ve(u.segments, yt)).filter(Boolean), Oe = Ve(u.segments, {
          id: Q == null ? void 0 : Q.id,
          itemId: Q == null ? void 0 : Q.itemId,
          nativeSegmentId: Q == null ? void 0 : Q.nativeSegmentId
        }) || Be[0] || null;
        G(Be.map((yt) => yt.id)), j((Oe == null ? void 0 : Oe.id) ?? null), be.current = (Oe == null ? void 0 : Oe.id) ?? null, re.current = [], ke.status === 409 && await le(), V(ke.message || "Unable to change the selected segment tags.");
      } finally {
        dt();
      }
      return;
    }
    if (ye.length !== 1 || !Q) return;
    const Ce = Si(J, Q);
    if (Q.id === m || Ce) {
      const we = Ce ? { segmentId: Q.id, tagId: Ce.values.tagId, tagName: Ce.meta.tagName } : null, Ee = gl(we, Q, ee, oe);
      if (Ce && (p((De) => {
        var Ie;
        return ((Ie = De.meta) == null ? void 0 : Ie.pendingChangeId) === Ce.id;
      }), y({ type: "discard", key: Ce.id })), Ee && ut(Q, Ee), Ee) {
        const De = _a(
          { ...Q, tagId: Ee.tagId },
          D,
          f,
          x,
          Y
        );
        de(De.filters), T(De.hideDerivedSegments), V("Tag change queued…");
      } else Ce && V("");
      d();
      return;
    }
    if (ee === Q.tagId) {
      d();
      return;
    }
    if (Q.itemId != null && ((qe = (ze = H.data) == null ? void 0 : ze.children) == null ? void 0 : qe.length) > 0) {
      const we = r("lineage-tag", Q.id);
      if (!we) return;
      V("Checking lineage impact…");
      try {
        const Ee = await te(`/items/${Q.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: Q.revision, tagId: ee })
        }), De = Ee.deletedItemIds.length > 0 || Ee.removedEdgeIds.length > 0;
        if (De && !window.confirm(
          `Changing this tag removes ${Ee.removedEdgeIds.length} lineage edge${Ee.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${Ee.deletedItemIds.length} derived segment${Ee.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
        )) {
          V("Tag change canceled.");
          return;
        }
        const Ie = ma(
          u,
          [Q.id],
          Se
        );
        O(Ie, X.id), d();
        const _e = `tag-change:${Q.itemId}:${Q.revision}:${Ee.componentFingerprint}:${ee}`;
        await te(`/items/${Q.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(_e),
            expectedRevision: Q.revision,
            componentFingerprint: Ee.componentFingerprint,
            tagId: ee
          })
        }), je(_e), await E(), d(), V(De ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch (Ee) {
        O((De) => no(
          De,
          [Q],
          Object.keys(Se)
        ), X.id), G([Q.id]), j(Q.id), be.current = Q.id, re.current = [], Ee.status === 409 ? (V("Lineage changed — loading the latest segments…"), await le()) : V(Ee.message || "Unable to reconcile the lineage.");
      } finally {
        we();
      }
      return;
    }
    d(), await C(Q, {
      startSec: Q.startSec,
      endSec: Q.endSec,
      tagId: ee
    }, !0, null, !0, Se);
  }
  function ut(ee, oe) {
    const Se = Jn();
    y({
      type: "add",
      entry: {
        id: Se,
        op: "patch",
        targets: [on(ee)],
        values: { tagId: oe.tagId, tagName: oe.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: oe.tagName }
      }
    });
    const Ce = J.find((ge) => ge.op === "insert" && ge.segment.id === ee.id);
    b({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [on(ee)],
      dependsOn: (Ce == null ? void 0 : Ce.taskId) ?? null,
      meta: { pendingChangeId: Se },
      ready: (ge, Ue) => {
        const ze = vi(ge.segments, Ue.targets[0]);
        return !ze || pl(ge, ze.id);
      },
      run: (ge) => tt(ge, Se, oe)
    });
  }
  async function tt(ee, oe, Se) {
    const [Ce] = ee.resolveTargets();
    if (!Ce || Ce.tagId === Se.tagId) {
      y({ type: "discard", key: oe });
      return;
    }
    await M(Ce, {
      startSec: Ce.startSec,
      endSec: Ce.endSec,
      tagId: Se.tagId
    }, {
      pendingChangeId: oe,
      restoreSelectionOnFailure: !1,
      onReload: ee.onReload,
      onConflict: ee.onConflict
    }) || V(`The new segment was not retagged${Se.tagName ? ` to ${Se.tagName}` : ""}. Choose its tag again.`);
  }
  async function st() {
    var qe, we, Ee, De;
    if (!l || !Q || W != null) return;
    const ee = [...ye].sort((Ie, _e) => Number(Ie.nativeSegmentId ?? Ie.id) - Number(_e.nativeSegmentId ?? _e.id)), oe = new Set(ee.map((Ie) => Ie.id)), Se = ee.map((Ie) => `${Ie.nativeSegmentId ?? Ie.id}:${Ie.updatedAt}`).join("|"), Ce = r("bin", Q.id);
    if (!Ce) return;
    V(`Moving ${ee.length} segment${ee.length === 1 ? "" : "s"} to recycling bin…`);
    const ge = `bulk-move:${X.id}:${Se}`, Ue = Fe(ge), ze = c ? null : crypto.randomUUID();
    try {
      const Ie = (Be = !1) => te(`/videos/${X.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ue,
          segments: ee.map((Oe) => ({
            segmentId: Oe.nativeSegmentId ?? Oe.id,
            expectedUpdatedAt: Oe.updatedAt
          })),
          discardMissingImage: Be,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: ze
        })
      });
      let _e;
      try {
        _e = await Ie(
          uo(ge)
        );
      } catch (Be) {
        if (((qe = Be.payload) == null ? void 0 : qe.code) !== "missing-image" || !window.confirm(`${Be.message}

Continue and discard the missing image reference?`)) throw Be;
        mo(ge), _e = await Ie(!0);
      }
      je(ge), Hn();
      const dt = new Map((_e.items || []).map((Be) => [
        Number(Be.segmentId),
        Be
      ]));
      await _(
        "segments.moveToBin",
        `Moved ${ee.length} segment${ee.length === 1 ? "" : "s"} to recycling bin`,
        Tt(ee, !1),
        Tt(ee.map((Be) => {
          const Oe = dt.get(
            Number(Be.nativeSegmentId ?? Be.id)
          );
          return {
            ...Be,
            recycleBinItemId: (Oe == null ? void 0 : Oe.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (Oe == null ? void 0 : Oe.revision) ?? null
          };
        }), !1),
        ze
      );
      const ke = Js(o, oe, Q.id);
      O((Be) => ({
        ...Be,
        segments: (Be.segments || []).filter((Oe) => !oe.has(Oe.id))
      }), X.id), G(ke ? [ke.id] : []), j((ke == null ? void 0 : ke.id) ?? null), be.current = (ke == null ? void 0 : ke.id) ?? null, re.current = [], ke && (F(Ot(o, ke.id)), xe(ke.id)), requestAnimationFrame(() => {
        var Be;
        return (Be = g.current) == null ? void 0 : Be.focus({ preventScroll: !0 });
      }), V(`Moved ${ee.length} segment${ee.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Ie) {
      const _e = ((we = Ie.payload) == null ? void 0 : we.code) || ((De = (Ee = Ie.payload) == null ? void 0 : Ee.result) == null ? void 0 : De.code);
      Ie.status === 409 && _e === "CANONICAL_SEGMENT_CHANGED" ? await le() : V(Ie.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Ce();
    }
  }
  async function nt() {
    if (!(c || s.current || W != null)) {
      s.current = !0, V("Checking the recycling bin…");
      try {
        const ee = await te("/bin"), oe = await si(ee, () => V("Emptying the recycling bin…"));
        if (oe.status === "empty") {
          V("The recycling bin is empty.");
          return;
        }
        if (oe.status === "canceled") {
          V("The recycling bin was not emptied.");
          return;
        }
        V(`${oe.segmentCount} segment${oe.segmentCount === 1 ? "" : "s"} from ${oe.sceneCount} scene${oe.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (ee) {
        V(ee.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: $e, removeIncorrectExample: he, captureTrainingExport: Je, deleteRejectedSegments: Pe, autoAssignPerformers: Ae, previewDerivedSegments: Ke, closeMaterializeDialog: lt, materializeDerivedSegments: ft, saveTag: Qe, moveToBin: st, emptyRecyclingBin: nt };
}
function Cc(e) {
  const { acceptHistory: t, acquireSaveLock: r, enqueueSave: o, getSaveQueueSnapshot: i, commonActionsRef: a, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: m, history: u, historyRef: f, historySaving: g, horizontalLayoutSize: p, mediaStackHeight: y, mediaStackRef: b, onDetailChange: N, onReload: x, railToggleRef: U, recordHistoryAction: H, savingSegmentId: $, setCollapsedSegmentGroups: A, setEditorLayout: w, setHistorySaving: S, setIncorrectExamples: C, setSaveMessage: M, shotBoundaries: J, timelineDuration: le, video: O, workspaceRef: E } = e;
  async function D(T, R, h) {
    var me, B, z, V;
    const v = T.type === "segment" ? [T] : T.segments || [], k = (R == null ? void 0 : R.type) === "segment" ? [R] : (R == null ? void 0 : R.segments) || [];
    let K = h;
    for (const [F, j] of v.entries()) {
      const G = k[F], X = ((me = j.identity) == null ? void 0 : me.nativeSegmentId) != null || ((B = j.identity) == null ? void 0 : B.published) === !0, $e = ((z = G == null ? void 0 : G.identity) == null ? void 0 : z.recycleBinItemId) ?? ((V = G == null ? void 0 : G.identity) == null ? void 0 : V.itemId);
      let he = Ve(K.segments, G == null ? void 0 : G.identity) || Ve(K.segments, j.identity);
      if (!he && X && $e != null && G.identity.revision != null) {
        const Ae = `history-restore:${O.id}:${$e}:${G.identity.revision}`;
        await te(`/bin/${$e}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(Ae),
            expectedRevision: G.identity.revision
          })
        }), je(Ae), K = await x(), he = K.segments.find((Ke) => Ke.tagId === j.values.tagId && Ke.startSec === j.values.startSec && Ke.endSec === j.values.endSec);
      }
      if (!he)
        throw new Error("A segment in this history state no longer exists.");
      if ((he.nativeSegmentId != null || he.published === !0) !== X) {
        if (X) {
          const Ae = he.recycleBinItemId ?? he.itemId ?? $e;
          if (Ae == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Ke = `history-restore:${O.id}:${Ae}:${he.revision}:${j.values.reviewState ?? "native"}`;
          await te(`/bin/${Ae}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(Ke),
              expectedRevision: he.revision
            })
          }), je(Ke);
        } else {
          const Ae = `history-bin:${O.id}:${he.nativeSegmentId}:${he.updatedAt}:${j.values.reviewState}`;
          await te(`/videos/${O.id}/segments/${he.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(Ae),
              expectedUpdatedAt: he.updatedAt,
              reviewState: j.values.reviewState
            })
          }), je(Ae);
        }
        if (K = await x(), !X)
          continue;
        if (he = Ve(K.segments, j.identity) || K.segments.find((Ae) => Ae.tagId === j.values.tagId && Ae.startSec === j.values.startSec && Ae.endSec === j.values.endSec), !he)
          throw new Error("The restored segment could not be found.");
      }
      const Pe = j.values;
      if (he.nativeSegmentId == null && he.itemId != null) {
        const Ae = `history-draft-update:${O.id}:${he.itemId}:${he.revision}:${Pe.tagId}:${Pe.startSec}:${Pe.endSec ?? "open"}:${Pe.reviewState}`;
        await te(`/videos/${O.id}/drafts/${he.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(Ae),
            expectedRevision: he.revision,
            ...Pe
          })
        }), je(Ae);
      } else
        await te(`/videos/${O.id}/segments/${he.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Pe, expectedUpdatedAt: he.updatedAt })
        });
      K = await x();
    }
    return K;
  }
  async function _(T, R) {
    var h;
    for (const v of T.targets || []) {
      const k = Ve(R.segments, v.identity);
      if (!k)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const K = (h = R.performerSlotRevisions) == null ? void 0 : h[k.id];
      await te(k.published ? `/videos/${O.id}/segments/${k.nativeSegmentId}/slots` : `/videos/${O.id}/drafts/${k.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: K,
          assignments: v.assignments
        })
      }), R = await x();
    }
    return R;
  }
  async function se(T, R, h) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let v = R, k = await te(`/videos/${O.id}/incorrect-examples`);
    const K = (me) => k.find((B) => {
      var z;
      return B.id === me.exampleId || ((z = me.collectedIdentity) == null ? void 0 : z.itemId) != null && B.itemId === me.collectedIdentity.itemId;
    });
    for (const [me, B] of (T.entries || []).entries()) {
      const z = `history-feedback:${O.id}:${h.action.sequence}:${h.direction}:${me}`, V = K(B);
      if (T.collected && V) {
        je(z);
        continue;
      }
      let F;
      if (T.collected) {
        const j = Ve(
          v.segments,
          B.collectedIdentity
        ) || Ve(
          v.segments,
          B.originalIdentity
        );
        if (!j)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const G = j.nativeSegmentId != null;
        F = await te(`/videos/${O.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(z),
            nativeSegmentId: G ? j.nativeSegmentId : null,
            itemId: G ? null : j.itemId,
            expectedUpdatedAt: G ? j.updatedAt : null,
            expectedRevision: G ? null : j.revision
          })
        });
      } else {
        if (!V) {
          je(z);
          continue;
        }
        F = await te(
          `/videos/${O.id}/incorrect-examples/${V.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(z),
              expectedExampleRevision: V.revision,
              expectedRepresentationRevision: V.representationRevision
            })
          }
        );
      }
      je(z), v = hr(
        v,
        F.editorDelta
      ), k = await te(
        `/videos/${O.id}/incorrect-examples`
      );
    }
    return C(k), v;
  }
  async function ie(T, R, h = []) {
    const v = T.state;
    if (!s && ((v == null ? void 0 : v.type) === "segment" || (v == null ? void 0 : v.type) === "segments")) {
      const K = `basic-history:${O.id}:${f.current.revision}:${T.action.sequence}:${T.direction}`, me = await te(`/videos/${O.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(K),
          expectedHistoryRevision: f.current.revision,
          actionSequence: T.action.sequence,
          direction: T.direction
        })
      });
      return t(me.history), h.push(K), x();
    }
    const k = T.direction === "backward" ? T.action.afterState : T.action.beforeState;
    if ((v == null ? void 0 : v.type) === "composite") {
      let K = R;
      const me = (k == null ? void 0 : k.type) === "composite" ? k.states || [] : [];
      for (const [B, z] of (v.states || []).entries()) {
        const V = me[B];
        K = await ie({
          ...T,
          state: z,
          action: {
            ...T.action,
            beforeState: T.direction === "backward" ? z : V,
            afterState: T.direction === "backward" ? V : z
          }
        }, K, h);
      }
      return K;
    }
    if ((v == null ? void 0 : v.type) === "segment" || (v == null ? void 0 : v.type) === "segments")
      return D(
        v,
        k,
        R
      );
    if ((v == null ? void 0 : v.type) === "performerSlots")
      return _(v, R);
    if ((v == null ? void 0 : v.type) === "incorrectExamples")
      return se(v, R, T);
    if ((v == null ? void 0 : v.type) === "shots") {
      const K = zn(R.shotBoundaries || []), me = await te(`/videos/${O.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(`history-shots:${O.id}:${K}:${v.fingerprint}`),
          expectedFingerprint: K,
          boundaries: v.boundaries
        })
      });
      return { ...R, shotBoundaries: me };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function xe(T) {
    var v;
    if (g || $ != null || T === u.cursorSequence)
      return;
    const R = Xl(u, T);
    if (R.length === 0) return;
    const h = r("history", -1);
    if (h) {
      S(!0), M(`Restoring ${R.length} history ${R.length === 1 ? "action" : "actions"}…`);
      try {
        let k = d;
        const K = [];
        for (const B of R)
          k = await ie(
            B,
            k,
            K
          );
        const me = s ? await te(`/videos/${O.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: f.current.revision,
            targetSequence: T
          })
        }) : f.current;
        K.forEach(je), t(me), await x(), M("History restored.");
      } catch (k) {
        k.status === 409 && ((v = k.payload) != null && v.current) && t(k.payload.current), await x(), M(k.message || "Unable to restore editor history.");
      } finally {
        h(), S(!1);
      }
    }
  }
  function W(T) {
    w((R) => ({ ...R, timelineRatio: lo(T, y) }));
  }
  function Y(T) {
    var v, k;
    const R = (v = b.current) == null ? void 0 : v.getBoundingClientRect();
    if (!R) return;
    const h = ((k = a.current) == null ? void 0 : k.offsetHeight) || 0;
    W(Os(
      T.clientY,
      R.top + h,
      Math.max(0, R.height - h)
    ));
  }
  function ae(T) {
    T.currentTarget.setPointerCapture(T.pointerId), Y(T);
  }
  function Q(T) {
    T.currentTarget.hasPointerCapture(T.pointerId) && Y(T);
  }
  function ve(T) {
    const R = T.shiftKey ? 0.1 : 0.05;
    let h = null;
    T.key === "ArrowUp" && (h = c.timelineRatio + R), T.key === "ArrowDown" && (h = c.timelineRatio - R);
    const v = so(y);
    T.key === "Home" && (h = v.minimum), T.key === "End" && (h = v.maximum), h != null && (T.preventDefault(), T.stopPropagation(), W(h));
  }
  function ye(T) {
    const R = T === "detailWidth" ? p.focusRow : p.workspace, h = p.workspace > 0 ? Yr(p.workspace, 600) : 560, v = nn(c.markerRailWidth, h), k = T === "detailWidth" ? 344 + (c.markerRailOpen ? v + 24 : 0) : 600;
    return R > 0 ? Yr(R, k) : 560;
  }
  function be(T, R) {
    w((h) => ({ ...h, [T]: nn(R, ye(T)) }));
  }
  function re(T, R) {
    var v, k;
    const h = R === "detailWidth" ? (v = m.current) == null ? void 0 : v.getBoundingClientRect() : (k = E.current) == null ? void 0 : k.getBoundingClientRect();
    h && be(R, R === "detailWidth" ? T.clientX - h.left : h.right - T.clientX);
  }
  function ue(T, R) {
    const h = ye(T), v = nn(c[T], h);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": R,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(h),
      "aria-valuenow": Math.round(v),
      "aria-valuetext": `${Math.round(v)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (k) => {
        k.currentTarget.setPointerCapture(k.pointerId), re(k, T);
      },
      onPointerMove: (k) => {
        k.currentTarget.hasPointerCapture(k.pointerId) && re(k, T);
      },
      onKeyDown: (k) => {
        const K = k.shiftKey ? 40 : 16;
        let me = null;
        k.key === "ArrowLeft" && (me = T === "detailWidth" ? -K : K), k.key === "ArrowRight" && (me = T === "detailWidth" ? K : -K);
        let B = me == null ? null : v + me;
        k.key === "Home" && (B = 240), k.key === "End" && (B = h), B != null && (k.preventDefault(), k.stopPropagation(), be(T, B));
      },
      onDoubleClick: () => be(T, It[T]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function ne() {
    w((T) => ({ ...T, markerRailOpen: !T.markerRailOpen })), requestAnimationFrame(() => {
      var T;
      return (T = U.current) == null ? void 0 : T.focus({ preventScroll: !0 });
    });
  }
  function Z(T) {
    A((R) => R.includes(T) ? R.filter((h) => h !== T) : Jt([...R, T]));
  }
  function de(T, R = !0, h = l) {
    const v = i().running != null, k = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (K) => q(K.detail, T, R, h)
    });
    return k ? (v && M(T === "split" ? "Shot boundary queued…" : "Shot merge queued…"), k.done.then((K) => K.value ?? null)) : Promise.resolve(null);
  }
  async function q(T, R, h, v) {
    var z;
    const k = (T == null ? void 0 : T.shotBoundaries) || [], K = Number((z = O.videoFile) == null ? void 0 : z.duration) || le, me = zn(k), B = `shot-${R}:${O.id}:${v.toFixed(3)}:${K.toFixed(3)}:${me}`;
    M(R === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const V = await te(`/videos/${O.id}/shot-boundaries/${R}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Fe(B), timeSec: v })
      });
      return je(B), N((F) => ({ ...F, shotBoundaries: V }), O.id), h && await H(
        "shots.update",
        R === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: k,
          fingerprint: me
        },
        {
          type: "shots",
          boundaries: V,
          fingerprint: zn(V)
        }
      ), M(R === "split" ? "Shot boundary added." : "Shots merged."), V;
    } catch (V) {
      return M(V.message || "Unable to edit shot boundaries."), null;
    }
  }
  return { applySegmentHistoryState: D, applyPerformerSlotHistoryState: _, applyHistoryState: ie, restoreHistoryTarget: xe, updateTimelineRatio: W, updateTimelineRatioFromPointer: Y, handleSeparatorPointerDown: ae, handleSeparatorPointerMove: Q, handleSeparatorKeyDown: ve, panelWidthMaximum: ye, updatePanelWidth: be, handlePanelSeparatorPointer: re, panelSeparatorProps: ue, toggleSegmentRail: ne, toggleSegmentGroup: Z, mutateShotBoundary: de };
}
function $c(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: m, emptyRecyclingBin: u, lineage: f, mediaDuration: g, mergeSelectedSwimlane: p, moveToBin: y, mutateShotBoundary: b, openPublishApprovedDialog: N, playbackControlsRef: x, playbackShortcutConfig: U, saveSelectedReviewState: H, seekRef: $, segmentGroupKeys: A, selectSegment: w, selectedSegment: S, selectedSegmentGroupForSegment: C, selectedSegmentGroupKey: M, selectedSegments: J, setCollapsedSegmentGroups: le, setIncorrectExamplesOpen: O, setQuickSearchOpen: E, setSaveMessage: D, setSelectedSegmentGroupKey: _, setTagEditing: se, setTimelineZoom: ie, shotBoundaries: xe, slotButtonRef: W, splitSegment: Y, swimlanes: ae, timelineDuration: Q, toggleIncorrectExample: ve, toggleSegmentGroup: ye, updateTimelineRatio: be, videoFrameRate: re, visibleSegments: ue } = e;
  function ne(q) {
    var T, R;
    (T = x.current) == null || T.pause(), (R = x.current) == null || R.seekBy(bl(q, re));
  }
  function Z(q, T) {
    if (J.length > 1 && tl(q.id))
      return;
    let R = null;
    q.id === "video.playPause" && (R = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.toggle();
    }), q.id === "video.seekSmallBackward" && (R = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(-U.smallSeekTime);
    }), q.id === "video.seekSmallForward" && (R = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(U.smallSeekTime);
    }), q.id === "video.seekMediumBackward" && (R = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(-U.mediumSeekTime);
    }), q.id === "video.seekMediumForward" && (R = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(U.mediumSeekTime);
    }), q.id === "video.seekLongBackward" && (R = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(-U.longSeekTime);
    }), q.id === "video.seekLongForward" && (R = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(U.longSeekTime);
    }), q.id === "video.playSelected" && S && (R = () => {
      var h;
      (h = $.current) == null || h.call($, S.startSec, !0), requestAnimationFrame(() => {
        var v;
        return (v = m.current) == null ? void 0 : v.focus({ preventScroll: !0 });
      });
    }), (q.id === "video.playPreviousSegment" || q.id === "video.playNextSegment") && (R = () => {
      var v;
      const h = to(
        ae,
        S == null ? void 0 : S.id,
        q.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !h || h.id === (S == null ? void 0 : S.id) || (w(h, { focusEditor: !0, seekToSegment: !1 }), (v = $.current) == null || v.call($, h.startSec, !0));
    }), q.id.startsWith("video.seekPercent") && (R = () => {
      var v;
      const h = Number(q.id.slice(17)) / 10;
      (v = $.current) == null || v.call($, Qs(g ?? Q, h), !1);
    }), q.id === "video.jumpToSegmentStart" && S && (R = () => {
      var h;
      return (h = $.current) == null ? void 0 : h.call($, S.startSec, !1);
    }), q.id === "video.jumpToSegmentEnd" && S && (R = () => {
      var h;
      return (h = $.current) == null ? void 0 : h.call($, S.endSec ?? S.startSec, !1);
    }), q.id === "video.jumpToVideoStart" && (R = () => {
      var h;
      return (h = $.current) == null ? void 0 : h.call($, 0, !1);
    }), q.id === "video.jumpToVideoEnd" && (R = () => {
      var h;
      return (h = $.current) == null ? void 0 : h.call($, Q, !1);
    }), q.id.startsWith("video.frame") && (R = () => {
      const h = q.id.includes("Small") ? "small" : q.id.includes("Medium") ? "medium" : "long", v = U[`${h}FrameStep`] * (q.id.endsWith("Backward") ? -1 : 1);
      ne(v);
    }), q.id.startsWith("navigation.swimlane") && (R = () => {
      const h = q.id.slice(19).toLowerCase(), v = to(ae, S == null ? void 0 : S.id, h, s);
      v && w(v, { focusEditor: !0, seekToSegment: !1 });
    }), (q.id === "navigation.extendSwimlaneLeft" || q.id === "navigation.extendSwimlaneRight") && (R = () => {
      const h = fd(
        t,
        S == null ? void 0 : S.id,
        q.id.endsWith("Left") ? "left" : "right"
      );
      h && w(h.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: h.segmentIds
      });
    }), (q.id === "navigation.segmentGroupUp" || q.id === "navigation.segmentGroupDown") && (R = () => {
      const h = yd(
        A,
        M ?? C,
        q.id.endsWith("Up") ? -1 : 1
      );
      h && _(h);
    }), (q.id === "navigation.previousAtPlayhead" || q.id === "navigation.nextAtPlayhead") && (R = () => {
      const h = Ps(ue, s, q.id === "navigation.previousAtPlayhead" ? -1 : 1, S == null ? void 0 : S.id);
      h && w(h, { focusEditor: !0, seekToSegment: !1 });
    }), q.id === "navigation.nearestInCurrentSwimlane" && (R = () => {
      const h = Ns(
        ae,
        S == null ? void 0 : S.id,
        s
      );
      h && w(h, { focusEditor: !0, seekToSegment: !1 });
    }), q.id.includes("Unreviewed") && (R = () => {
      const h = xr(
        ae,
        S == null ? void 0 : S.id,
        q.id.startsWith("navigation.previous") ? -1 : 1,
        q.id.endsWith("Global")
      );
      h && w(h, { focusEditor: !T.preserveFocus, seekToSegment: !1 });
    }), (q.id === "navigation.nextTouchingPlayhead" || q.id === "navigation.previousTouchingPlayhead") && (R = () => {
      const h = ws(ae, s, q.id === "navigation.previousTouchingPlayhead" ? -1 : 1, S == null ? void 0 : S.id);
      h && w(h, { focusEditor: !0, seekToSegment: !1 });
    }), q.id === "navigation.quickSearch" && (R = () => E(!0)), (q.id === "navigation.previousShot" || q.id === "navigation.nextShot") && (R = () => {
      var v;
      const h = yl(xe, s, q.id === "navigation.previousShot" ? -1 : 1);
      h && ((v = $.current) == null || v.call($, h.startSec, !1));
    }), q.id === "shot.split" && (R = () => b("split")), q.id === "shot.merge" && (R = () => b("merge")), q.id === "marker.create" && (R = () => a()), q.id === "marker.duplicate" && (R = () => d(!1)), q.id === "marker.duplicateAtPlayhead" && (R = () => d(!0)), q.id === "marker.split" && (R = () => Y()), q.id === "marker.editTag" && (R = () => {
      var h;
      if (J.length > 1 && J.some((v) => v.isDerived)) {
        D("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((h = f.data) != null && h.tagReadOnly) {
        D("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      se(!0);
    }), q.id === "marker.setStart" && S && (R = () => r(s, S.endSec)), q.id === "marker.setEnd" && S && (R = () => r(S.startSec, s)), q.id === "marker.copyTiming" && S && (R = () => {
      D(_d(S) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), q.id === "marker.pasteTiming" && S && (R = () => {
      const h = qd();
      if (!h) {
        D("No copied segment timing is available.");
        return;
      }
      r(h.startSec, h.endSec);
    }), q.id === "marker.mergeSelection" && (R = () => p()), q.id === "marker.moveToBin" && (R = () => y()), q.id === "marker.toggleIncorrectExample" && S && (R = () => ve()), q.id === "marker.openIncorrectExamples" && (R = () => O(!0)), q.id === "markerGroup.toggleCollapse" && M && (R = () => ye(M)), q.id === "markerGroup.toggleAll" && (R = () => le((h) => pd(h, A))), q.id === "marker.assignSlots" && (R = () => {
      var h;
      return (h = W.current) == null ? void 0 : h.click();
    }), q.id === "navigation.zoomIn" && (R = () => ie((h) => Sr(h + 0.5))), q.id === "navigation.zoomOut" && (R = () => ie((h) => Sr(h - 0.5))), q.id === "navigation.resetZoom" && (R = () => ie(1)), q.id === "navigation.centerPlayhead" && (R = () => {
      var h;
      return (h = o.current) == null ? void 0 : h.call(o);
    }), q.id === "layout.growSwimlanes" && (R = () => be(c.timelineRatio + 0.05)), q.id === "layout.shrinkSwimlanes" && (R = () => be(c.timelineRatio - 0.05)), q.id === "marker.confirm" && S && (R = () => H("approved")), q.id === "system.publishApproved" && (R = () => N(T.target)), q.id === "marker.reject" && S && (R = () => H("rejected")), q.id === "system.emptyBin" && (R = () => u()), q.id === "system.deleteRejected" && (R = () => l()), R && R();
  }
  function de(q, T) {
    const R = Yn.find((h) => h.id === q);
    R && bn(R, i) && Z(R, T);
  }
  return {
    executeShortcutById: de,
    stepVideoFrame: (q) => ne(q < 0 ? -1 : 1)
  };
}
function va(e) {
  return e === !0;
}
function xa() {
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
function Tc(e, t, r = !1, o = 0, i = "") {
  const [a, s] = L(null), [l, d] = L(null), [c, m] = L(""), [u, f] = L({
    busy: !1,
    reviewState: null,
    error: ""
  }), g = pe(null);
  async function p(N) {
    f({ busy: !0, reviewState: N, error: "" });
    try {
      await te(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: eo(), reviewState: N })
      }), await t(), f({ busy: !1, reviewState: null, error: "" });
    } catch (x) {
      f({
        busy: !1,
        reviewState: null,
        error: x.message || "Unable to import Cove segments."
      });
    }
  }
  async function y(N) {
    try {
      const x = await te(`/videos/${e}/analysis-runs`, {
        signal: N.signal
      });
      if (!N.isActive()) return null;
      const U = (x == null ? void 0 : x[0]) || null;
      return s(U), (U == null ? void 0 : U.status) === "completed" && g.current !== U.id && (g.current = U.id, await t()), ((U == null ? void 0 : U.status) === "failed" || (U == null ? void 0 : U.status) === "cancelled") && m(U.errorMessage || "Video analysis did not complete."), U;
    } catch (x) {
      return N.isActive() && x.name !== "AbortError" && m(x.message || "Unable to load video analysis status."), null;
    }
  }
  async function b(N = null) {
    m("");
    const x = N || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), U = x.includes("omnishotcut") && o > 0;
    if (!(U && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const H = await te(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: x,
            replaceShotBoundaries: U,
            expectedShotBoundaryFingerprint: U ? i : null
          })
        });
        s(H);
      } catch (H) {
        m(H.message || "Unable to start video analysis.");
      }
  }
  return fe(() => {
    if (!va(r)) {
      s(null), d(null), m("");
      return;
    }
    const N = xa();
    return y(N), te("/analysis/status", { signal: N.signal }).then((x) => {
      N.isActive() && (d(x), x.configured || m(""));
    }).catch((x) => {
      N.isActive() && x.name !== "AbortError" && m(x.message || "Unable to check video analysis readiness.");
    }), N.dispose;
  }, [e, r]), fe(() => {
    if (!va(r) || (a == null ? void 0 : a.status) !== "queued" && (a == null ? void 0 : a.status) !== "running") return;
    const N = xa();
    let x = setTimeout(async function U() {
      await y(N), N.isActive() && (x = setTimeout(U, 2500));
    }, 2500);
    return () => {
      clearTimeout(x), N.dispose();
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
const Kn = Object.freeze([]);
function Ac(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Rc({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var Oo, Po, Lo, Fo, jo;
  const [m, u] = L(null), [f, g] = L([]), p = pe(null), y = pe(null), b = pe([]), N = pe(null), [x, U] = L(() => At({})), [H, $] = L(!1), [A, w] = L(Zs), [S, C] = L(0), M = pe(null), [J] = L(() => Td({
    getContext: () => M.current,
    drainAfterSettle: !1
  })), le = Ll(J.subscribe, J.getSnapshot), O = xi(le), E = (P, ce) => J.acquire({ kind: P, lockId: ce }), D = (P) => J.enqueue(P), _ = (P) => J.cancel(P), se = (P, ce) => J.retarget(P, ce), ie = J.getSnapshot, [xe, W] = Pl(Fd, []), [Y, ae] = L(""), [Q, ve] = L(""), [ye, be] = L(""), [re, ue] = L(1), [ne, Z] = L(Ud), [de, q] = L(0), [T, R] = L({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [h, v] = L(Kt), k = pe(Kt), [K, me] = L(!1), [B, z] = L(!1), [V, F] = L(!1), j = pe(!1);
  j.current = V;
  const [G, X] = L(null), [$e, he] = L(!1), [Je, Pe] = L(null), [Ae, Ke] = L(null), lt = pe(null), [ft, Qe] = L(!1), [ut, tt] = L(""), st = pe(null), nt = pe(null), ee = pe(!1), [oe, Se] = L(Kd), [Ce, ge] = L(null), [Ue, ze] = L(!1), [qe, we] = L(!1), [Ee, De] = L(!1), [Ie, _e] = L(!1), [dt, ke] = L(!1), [Be, Oe] = L(""), {
    analysisError: yt,
    analysisRun: Ze,
    analysisStatus: rt,
    importNativeSegments: $t,
    nativeImportState: vt,
    startFullAnalysis: Te
  } = Tc(
    e.video.id,
    o,
    l,
    ((Oo = e.shotBoundaries) == null ? void 0 : Oo.length) || 0,
    zn(e.shotBoundaries || [])
  ), [Ne, We] = L(!1), [ot, Xe] = L(null), [Rt, ct] = L(l), [Nt, ln] = L(0), [Gt, Ar] = L(!1), [xn, Sn] = L(""), [Ut, kn] = L(null), dn = pe(null), Ht = pe(null), wn = pe(!1), [Yt, Qt] = L([]), [Nn, Rr] = L(!1), [Zn, Mr] = L(null), In = Bd(), Cn = pe(null), $n = pe(null), Zt = pe(null), Xn = pe(s), er = pe(null), Tn = pe(null), Xt = pe(null), cn = pe(null), An = pe(null), bt = pe(null), tr = pe(null), Rn = pe(null), nr = pe(null), rr = pe(null), Mt = pe(null), Mn = pe(null), or = pe(-1e12), ar = pe(null), En = pe(null), [Dn, On] = L({ scrollTop: 0, height: 512 });
  fe(() => {
    if (!Ne || Gt || !xn) return;
    const P = requestAnimationFrame(() => {
      var ce;
      return (ce = Ht.current) == null ? void 0 : ce.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(P);
  }, [Ne, Gt, xn]), fe(() => {
    if (!wn.current || Ne || Rt) return;
    const P = requestAnimationFrame(() => {
      var ce;
      (ce = dn.current) == null || ce.focus({ preventScroll: !0 }), wn.current = !1;
    });
    return () => cancelAnimationFrame(P);
  }, [Ne, Rt]);
  const et = e.video, mt = e.segments || Kn, ir = Ge(() => JSON.stringify({
    segments: mt.map((P) => [
      P.id,
      P.itemId,
      P.nativeSegmentId,
      P.tagId,
      P.startSec,
      P.endSec,
      P.reviewState,
      P.published,
      P.sourceKey,
      P.sourceRunId,
      P.confidence,
      P.revision,
      P.updatedAt
    ]),
    performerSlots: (e.performerSlots || Kn).map((P) => [
      P.segmentId,
      P.slotDefinitionId,
      P.performerId,
      P.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [mt, e.performerSlots, e.itemMetadata]);
  fe(() => {
    if (!l) {
      Xe(null), ct(!1);
      return;
    }
    if (O != null) {
      ct(!0);
      return;
    }
    let P = !0;
    ct(!0);
    const ce = setTimeout(() => {
      te(`/videos/${et.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Le) => {
        P && (Xe(Le), Sn(""));
      }).catch((Le) => {
        P && (Xe(null), Sn(Le.message || "Unable to preview derived segments."));
      }).finally(() => {
        P && ct(!1);
      });
    }, 150);
    return () => {
      P = !1, clearTimeout(ce);
    };
  }, [l, et.id, ir, Nt, O]);
  const Er = () => ln((P) => P + 1), Et = e.segmentGroups || Kn, He = e.performerSlots || Kn, sr = l && e.performerSlotsAvailable !== !1, Pn = Ge(
    () => (e.performerCandidates || []).filter((P) => P.isVideoPerformer),
    [e.performerCandidates]
  ), Ln = e.shotBoundaries || Kn, un = Ge(
    () => mi(He),
    [He]
  ), qt = Ge(
    () => mt.map((P) => {
      const ce = un.get(P.id) || [];
      return {
        ...P,
        slots: ce,
        assignment: ce.every((Le) => Le.performerId == null) ? Al(ce, Pn) : null
      };
    }).filter((P) => P.slots.length > 0 && P.assignment != null),
    [mt, un, Pn]
  ), Dr = Number((Po = et.videoFile) == null ? void 0 : Po.frameRate) > 0 ? Number(et.videoFile.frameRate) : 30;
  function Fn() {
    const P = j.current;
    F(!1), P && requestAnimationFrame(() => {
      var ce;
      return (ce = bt.current) == null ? void 0 : ce.focus({ preventScroll: !0 });
    });
  }
  function lr() {
    O == null && (Mn.current = null, he(!1), ae(""), requestAnimationFrame(() => {
      var P;
      return (P = bt.current) == null ? void 0 : P.focus({ preventScroll: !0 });
    }));
  }
  function jn() {
    $(!1), requestAnimationFrame(() => {
      var P, ce;
      (P = Rn.current) != null && P.isConnected ? Rn.current.focus({ preventScroll: !0 }) : (ce = bt.current) == null || ce.focus({ preventScroll: !0 });
    });
  }
  fe(() => {
    Mt.current === m ? (Mt.current = null, F(!0)) : F(!1);
  }, [m]), fe(() => {
    var ce;
    if (!V) return;
    const P = (ce = rr.current) == null ? void 0 : ce.querySelector("input");
    document.activeElement !== P && (P == null || P.focus({ preventScroll: !0 }), P == null || P.select());
  }, [V, m]), fe(() => {
    var ce;
    if (V) return;
    const P = (ce = bt.current) == null ? void 0 : ce.ownerDocument;
    P && P.activeElement === P.body && bt.current.focus({ preventScroll: !0 });
  }, [V]), fe(() => {
    var Le, at, Dt;
    const P = rn(
      zr(
        e.segments,
        e.performerSlots || [],
        At({}),
        l && A,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), ce = ((Le = e.segments.find((pn) => pn.id === s)) == null ? void 0 : Le.id) ?? ((at = Ka(P)) == null ? void 0 : at.id) ?? null;
    u(ce), g(ce == null ? [] : [ce]), y.current = ce, b.current = [], ge(Ot(P, ce)), U(At({})), $(!1), Mn.current = null, he(!1), ue(1), ae(""), v(Kt), k.current = Kt, me(!1), (Dt = bt.current) == null || Dt.focus({ preventScroll: !0 });
  }, [et.id, s]), fe(() => {
    const P = new AbortController();
    return te(`/videos/${et.id}/incorrect-examples`, { signal: P.signal }).then(Qt).catch((ce) => {
      ce.name !== "AbortError" && Qt([]);
    }), () => P.abort();
  }, [et.id, d == null ? void 0 : d.effectiveMode]), fe(() => {
    const P = new AbortController();
    return te(`/videos/${et.id}/history`, { signal: P.signal }).then((ce) => {
      const Le = ce || Kt;
      k.current = Le, v(Le);
    }).catch((ce) => {
      ce.name !== "AbortError" && ae(ce.message || "Unable to load editor history.");
    }), () => P.abort();
  }, [et.id]), fe(() => {
    Hd(ne);
  }, [ne.timelineRatio, ne.markerRailOpen, ne.detailWidth, ne.markerRailWidth, ne.swimlaneTitleWidth]), fe(() => {
    zd(oe);
  }, [oe]), fe(() => {
    Xs(A);
  }, [A]), fe(() => {
    const P = Tn.current;
    if (!a || !P || typeof ResizeObserver > "u") return;
    const ce = () => {
      var Dt;
      const at = Math.max(0, P.clientHeight - (((Dt = Xt.current) == null ? void 0 : Dt.offsetHeight) || 0));
      q(at), Z((pn) => {
        const Bo = lo(pn.timelineRatio, at);
        return Bo === pn.timelineRatio ? pn : { ...pn, timelineRatio: Bo };
      });
    }, Le = new ResizeObserver(ce);
    return Le.observe(P), Xt.current && Le.observe(Xt.current), ce(), () => Le.disconnect();
  }, [a]), fe(() => {
    if (!In || typeof ResizeObserver > "u") return;
    const P = An.current, ce = cn.current;
    if (!P || !ce) return;
    const Le = () => R({
      workspace: P.clientWidth,
      focusRow: ce.clientWidth,
      focusRowHeight: ce.clientHeight
    }), at = new ResizeObserver(Le);
    return at.observe(P), at.observe(ce), Le(), () => at.disconnect();
  }, [In, ne.markerRailOpen]);
  const Ft = Ge(
    () => Ld(mt, xe),
    [mt, xe]
  );
  Ol(() => {
    wi(xe, e) !== xe && W({ type: "prune", detail: e });
  }, [e, xe]);
  const gt = Ge(
    () => da(
      zr(
        Ft,
        He,
        x,
        l && A,
        Et
      ),
      Yt,
      !0
    ),
    [
      Ft,
      He,
      x,
      A,
      Et,
      l,
      Yt
    ]
  ), en = Object.fromEntries(kt.map((P) => [P, gt.filter((ce) => ce.reviewState === P).length])), Bn = da(
    zr(
      Ft,
      He,
      { ...x, reviewStates: kt },
      l && A,
      Et
    ),
    Yt,
    !0
  ), Or = Object.fromEntries(kt.map((P) => [P, Bn.filter((ce) => ce.reviewState === P).length])), Pr = [...new Set(Ft.map((P) => P.sourceKey).filter(Boolean))].sort((P, ce) => Lt(P).localeCompare(Lt(ce))), Lr = Gs(
    x,
    l && A
  ), xt = Ge(
    () => rn(gt, Et, He),
    [gt, Et, He]
  ), Ye = zs(
    xt,
    m,
    s
  ), tn = Ge(() => {
    const P = Ed(xe);
    return P.length === 0 ? mt : [...mt, ...P];
  }, [mt, xe]), I = Ye == null ? null : tn.find((P) => P.id === Ye.id) || Ye, Me = Wo(tn, Wo(gt, f).map((P) => P.id)), ht = !l && Me.length > 0 && Me.every((P) => P.nativeSegmentId != null), pt = gt.map((P) => P.id), _t = pt.join("|");
  p.current = (I == null ? void 0 : I.id) ?? null;
  const jt = un.get(I == null ? void 0 : I.id) || [], Fr = fo(jt), vo = Ge(
    () => ud(xt, f),
    [xt, f]
  ), jr = Ge(() => yo(xt), [xt]), Gn = Ge(
    () => dd(jr, oe),
    [jr, oe]
  ), Ai = Ge(
    () => gi(
      Gn.rows,
      Dn.scrollTop,
      Dn.height
    ),
    [Gn, Dn]
  ), Br = Ge(
    () => gd(xt, oe),
    [xt, oe]
  ), Ri = xr(Br, I == null ? void 0 : I.id, -1, !0) != null, Mi = xr(Br, I == null ? void 0 : I.id, 1, !0) != null, mn = I ? Ot(xt, I.id) : null, Gr = Et.length > 0 ? jr.map((P) => P.key) : [], Ei = Gr.join("|"), dr = Math.max(
    0,
    Number((Lo = et.videoFile) == null ? void 0 : Lo.duration) || 0,
    ...Ft.map((P) => Number(P.endSec ?? P.startSec) || 0)
  ), xo = Number((Fo = et.videoFile) == null ? void 0 : Fo.duration) > 0 ? Number(et.videoFile.duration) : null;
  h.actions;
  const Di = Qa();
  fe(() => {
    const P = m === kr ? m : (I == null ? void 0 : I.id) ?? null;
    P !== m && u(P);
  }, [I, m]), fe(() => {
    g((P) => {
      const ce = Ws(
        P,
        pt,
        (I == null ? void 0 : I.id) ?? null
      );
      return ce.length === P.length && ce.every((Le, at) => Le === P[at]) ? P : ce;
    });
  }, [_t, I == null ? void 0 : I.id]);
  const gn = (I == null ? void 0 : I.itemId) == null ? null : ((jo = e.itemMetadata) == null ? void 0 : jo[I.itemId]) || null, Oi = {
    key: (I == null ? void 0 : I.itemId) != null ? `item:${I.itemId}` : (I == null ? void 0 : I.nativeSegmentId) != null ? `native:${I.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (gn == null ? void 0 : gn.provenance) || (I == null ? void 0 : I.fieldProvenance) || [] : []
  }, Ur = (I == null ? void 0 : I.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (gn == null ? void 0 : gn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  fe(() => {
    ve(Ye == null ? "" : String(Ye.startSec)), be((Ye == null ? void 0 : Ye.endSec) == null ? "" : String(Ye.endSec));
  }, [Ye == null ? void 0 : Ye.id, Ye == null ? void 0 : Ye.startSec, Ye == null ? void 0 : Ye.endSec]), fe(() => {
    mn && Se((P) => yi(P, mn));
  }, [et.id, s, mn]), fe(() => {
    ge((P) => bd(Gr, P, mn));
  }, [et.id, Ei, mn]), fe(() => {
    if (!ne.markerRailOpen || (I == null ? void 0 : I.id) == null) return;
    const P = En.current, ce = Gn.rows.find((Dt) => Dt.kind === "segment" && Dt.segment.id === I.id);
    if (!P || !ce) return;
    const Le = ce.top + ce.height;
    let at = P.scrollTop;
    ce.top < P.scrollTop ? at = ce.top : Le > P.scrollTop + P.clientHeight && (at = Math.max(0, Le - P.clientHeight)), at !== P.scrollTop && (P.scrollTop = at), On({ scrollTop: at, height: P.clientHeight });
  }, [I == null ? void 0 : I.id, Gn, ne.markerRailOpen]), fe(() => {
    const P = En.current;
    if (!ne.markerRailOpen || !P) return;
    const ce = () => On({
      scrollTop: P.scrollTop,
      height: P.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      ce();
      return;
    }
    const Le = new ResizeObserver(ce);
    return Le.observe(P), ce(), () => Le.disconnect();
  }, [ne.markerRailOpen]);
  const { revealSegmentGroupForSelection: So, replaceSegmentSelection: Pi, selectSegment: ko, selectSegmentCollection: Li, selectAllVideoSegments: Fi } = wc({
    allSwimlanes: xt,
    editorRef: bt,
    performerSlots: He,
    seekRef: Cn,
    segmentGroups: Et,
    segments: mt,
    selectedSegmentId: m,
    selectedSegmentIds: f,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: b,
    setCollapsedSegmentGroups: Se,
    setEditorFilters: U,
    setHideDerivedSegments: w,
    setSaveMessage: ae,
    setSelectedSegmentGroupKey: ge,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: g
  }), { acceptHistory: Kr, recordHistoryAction: cr, mutateSegment: ji, runSegmentMutation: Bi, completeReview: Gi, createSegment: wo, splitSegment: No, duplicateSegment: Io, saveTiming: Ui, applyShortcutTiming: Ki } = jd({
    compatibilityMode: l,
    currentTime: S,
    detail: e,
    editorFilters: x,
    endInput: ye,
    hideDerivedSegments: A,
    historyRef: k,
    mediaDuration: xo,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: or,
    pendingDuplicateRef: ar,
    pendingFirstSegmentStartSecRef: Mn,
    pendingTagEditSegmentIdRef: Mt,
    enqueueSave: D,
    pendingChanges: xe,
    retargetSaveTasks: se,
    replaceSegmentSelection: Pi,
    savingSegmentId: O,
    segments: mt,
    selectedSegment: I,
    selectedSegmentIdRef: p,
    selectedSegments: Me,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: b,
    setCreatingSegmentId: X,
    setEditorFilters: U,
    setFirstSegmentTagOpen: he,
    setHideDerivedSegments: w,
    setHistory: v,
    setHistoryOpen: me,
    setPublishApprovedError: tt,
    setSaveMessage: ae,
    acquireSaveLock: E,
    dispatchPendingChanges: W,
    setSelectedSegmentGroupKey: ge,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: g,
    setTagEditing: F,
    startInput: Q,
    tagEditingRef: j,
    timelineDuration: dr,
    video: et
  });
  function Co(P = null) {
    var at;
    if (!l || O != null || !mt.some((Dt) => !Dt.published && Dt.reviewState === "approved")) return;
    const ce = ((at = bt.current) == null ? void 0 : at.ownerDocument) ?? document, Le = ce.activeElement === ce.body ? null : ce.activeElement;
    nt.current = P != null && P.isConnected && P !== ce.body ? P : Le, tt(""), Qe(!0);
  }
  function $o() {
    O == null && (Qe(!1), tt(""), requestAnimationFrame(() => {
      Ac(
        nt.current,
        bt.current
      ), nt.current = null;
    }));
  }
  async function zi() {
    await Gi() && $o();
  }
  const { closeMergeConfirmation: Hi, mergeSelectedSwimlane: To, saveSelectedReviewState: qi } = Nc({
    acceptHistory: Kr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: N,
    getSaveQueueSnapshot: ie,
    historyRef: k,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: cr,
    revealSegmentGroupForSelection: So,
    savingSegmentId: O,
    selectedGroups: vo,
    selectedSegment: I,
    selectedSegmentIdRef: p,
    selectedSegments: Me,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: b,
    setMergeConfirmation: Pe,
    setSaveMessage: ae,
    acquireSaveLock: E,
    dispatchPendingChanges: W,
    enqueueSave: D,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: g,
    video: et
  }), _i = (P) => {
    const ce = (P || []).map(on);
    J.cancel((Le) => Le.kind === "review" && hi(Le.targets, ce));
  };
  M.current = {
    detail: e,
    segments: mt,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    tagEditing: V,
    selectedSegmentIds: f,
    activeSegmentId: (I == null ? void 0 : I.id) ?? null
  }, fe(() => {
    J.poke();
  });
  const { toggleIncorrectExample: Wi, removeIncorrectExample: Vi, captureTrainingExport: Ji, deleteRejectedSegments: Ao, autoAssignPerformers: Yi, previewDerivedSegments: Qi, closeMaterializeDialog: Zi, materializeDerivedSegments: Xi, saveTag: es, moveToBin: ts, emptyRecyclingBin: ns } = Ic({
    acceptHistory: Kr,
    allSwimlanes: xt,
    autoAssignCandidates: qt,
    autoAssigning: dt,
    binEmptyingRef: ee,
    canMoveSelectionToBin: ht,
    closeTagEditing: Fn,
    compatibilityMode: l,
    creatingSegmentId: G,
    detail: e,
    editorFilters: x,
    editorRef: bt,
    exportingExamples: Nn,
    hideDerivedSegments: A,
    incorrectExamples: Yt,
    lineage: Ur,
    materializeButtonRef: dn,
    materializePreview: ot,
    materializeRestoreFocusRef: wn,
    materializing: Gt,
    mutateSegment: ji,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: He,
    cancelSaveTasks: _,
    dispatchPendingChanges: W,
    enqueueSave: D,
    pendingChanges: xe,
    runSegmentMutation: Bi,
    recordHistoryAction: cr,
    refreshMaterializationPreview: Er,
    removingExampleId: Zn,
    revealSegmentGroupForSelection: So,
    savingSegmentId: O,
    segmentGroups: Et,
    segments: mt,
    selectedSegment: I,
    selectedSegmentIdRef: p,
    selectedSegments: Me,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: b,
    setAutoAssignError: Oe,
    setAutoAssignOpen: _e,
    setAutoAssigning: ke,
    setEditorFilters: U,
    setExportingExamples: Rr,
    setHideDerivedSegments: w,
    setIncorrectExamples: Qt,
    setMaterializeError: Sn,
    setMaterializeLoading: ct,
    setMaterializeOpen: We,
    setMaterializePreview: Xe,
    setMaterializing: Ar,
    setRemovingExampleId: Mr,
    setRejectedDeletionPreview: Ke,
    setSaveMessage: ae,
    acquireSaveLock: E,
    setSelectedSegmentGroupKey: ge,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: g,
    video: et
  }), { restoreHistoryTarget: rs, updateTimelineRatio: Ro, handleSeparatorPointerDown: os, handleSeparatorPointerMove: as, handleSeparatorKeyDown: is, panelWidthMaximum: Mo, panelSeparatorProps: ss, toggleSegmentRail: ls, toggleSegmentGroup: Eo, mutateShotBoundary: ds } = Cc({
    acceptHistory: Kr,
    compatibilityMode: l,
    currentTime: S,
    detail: e,
    editorLayout: ne,
    focusRowRef: cn,
    history: h,
    historyRef: k,
    historySaving: B,
    horizontalLayoutSize: T,
    mediaStackHeight: de,
    mediaStackRef: Tn,
    commonActionsRef: Xt,
    onDetailChange: t,
    onReload: o,
    railToggleRef: tr,
    recordHistoryAction: cr,
    savingSegmentId: O,
    setCollapsedSegmentGroups: Se,
    setEditorLayout: Z,
    setHistorySaving: z,
    setIncorrectExamples: Qt,
    setSaveMessage: ae,
    acquireSaveLock: E,
    enqueueSave: D,
    getSaveQueueSnapshot: ie,
    shotBoundaries: Ln,
    timelineDuration: dr,
    video: et,
    workspaceRef: An
  }), { executeShortcutById: Do, stepVideoFrame: cs } = $c({
    allSwimlanes: xt,
    applyShortcutTiming: Ki,
    centerTimelineRef: er,
    compatibilityMode: l,
    createSegment: wo,
    currentTime: S,
    deleteRejectedSegments: Ao,
    duplicateSegment: Io,
    editorLayout: ne,
    editorRef: bt,
    emptyRecyclingBin: ns,
    lineage: Ur,
    mediaDuration: xo,
    mergeSelectedSwimlane: To,
    moveToBin: ts,
    mutateShotBoundary: ds,
    openPublishApprovedDialog: Co,
    playbackControlsRef: $n,
    playbackShortcutConfig: Di,
    saveSelectedReviewState: qi,
    seekRef: Cn,
    segmentGroupKeys: Gr,
    selectSegment: ko,
    selectedSegment: I,
    selectedSegmentGroupForSegment: mn,
    selectedSegmentGroupKey: Ce,
    selectedSegments: Me,
    setCollapsedSegmentGroups: Se,
    setIncorrectExamplesOpen: De,
    setQuickSearchOpen: we,
    setSaveMessage: ae,
    setSelectedSegmentGroupKey: ge,
    setTagEditing: F,
    setTimelineZoom: ue,
    shotBoundaries: Ln,
    slotButtonRef: nr,
    splitSegment: No,
    swimlanes: Br,
    timelineDuration: dr,
    toggleIncorrectExample: Wi,
    toggleSegmentGroup: Eo,
    updateTimelineRatio: Ro,
    videoFrameRate: Dr,
    visibleSegments: gt
  });
  Zt.current = Do;
  const us = Ge(() => Yn.map((P) => ({
    id: P.id,
    enabled: bn(P, l),
    surface: "local",
    action: (ce) => {
      var Le;
      return (Le = Zt.current) == null ? void 0 : Le.call(Zt, P.id, ce);
    }
  })), [l]);
  Ra(ao, us);
  const ms = so(de), gs = nn(ne.markerRailWidth, Mo("markerRailWidth")), ps = nn(ne.detailWidth, Mo("detailWidth"));
  return n(kc, {
    activeFilterCount: Lr,
    allSwimlanes: xt,
    analysisError: yt,
    analysisRun: Ze,
    analysisStatus: rt,
    approvalFacetCounts: Or,
    autoAssignCandidates: qt,
    autoAssignError: Be,
    autoAssignOpen: Ie,
    autoAssignPerformers: Yi,
    autoAssigning: dt,
    canMoveSelectionToBin: ht,
    captureTrainingExport: Ji,
    cancelQueuedReviewsForSegments: _i,
    removeIncorrectExample: Vi,
    rejectedDeletionPreview: Ae,
    centerTimelineRef: er,
    closeEditorFilters: jn,
    closeFirstSegmentTagDialog: lr,
    closeMaterializeDialog: Zi,
    closeMergeConfirmation: Hi,
    closePublishApprovedDialog: $o,
    closeTagEditing: Fn,
    collapsedSegmentGroups: oe,
    commonActionsRef: Xt,
    compatibilityMode: l,
    configuringTag: Ut,
    createSegment: wo,
    currentTime: S,
    deleteRejectedSegments: Ao,
    detail: e,
    detailPanelRef: N,
    detailWidth: ps,
    duplicateSegment: Io,
    editorFilters: x,
    editorLayout: ne,
    editorRef: bt,
    exportingExamples: Nn,
    filtersButtonRef: Rn,
    filtersOpen: H,
    firstSegmentTagOpen: $e,
    focusRowRef: cn,
    handleSeparatorKeyDown: is,
    handleSeparatorPointerDown: os,
    handleSeparatorPointerMove: as,
    hideDerivedSegments: A,
    history: h,
    historyOpen: K,
    historySaving: B,
    hasNextUnreviewed: Mi,
    hasPreviousUnreviewed: Ri,
    horizontalLayoutSize: T,
    importNativeSegments: $t,
    incorrectExamples: Yt,
    incorrectExamplesOpen: Ee,
    removingExampleId: Zn,
    lineage: Ur,
    markerRailWidth: gs,
    materializeButtonRef: dn,
    materializeCancelButtonRef: Ht,
    materializeDerivedSegments: Xi,
    materializeError: xn,
    materializeLoading: Rt,
    materializeOpen: Ne,
    materializePreview: ot,
    materializing: Gt,
    mediaStackRef: Tn,
    mergeCancelButtonRef: lt,
    mergeConfirmation: Je,
    mergeSaving: $d(le, "merge"),
    mergeSelectedSwimlane: To,
    nativeImportState: vt,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: Co,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: ss,
    pendingInitialSeekRef: Xn,
    performerSlots: He,
    performerSlotsAvailable: sr,
    playbackControlsRef: $n,
    previewDerivedSegments: Qi,
    provenance: Oi,
    provenanceSources: Pr,
    publishApprovedCancelButtonRef: st,
    publishApprovedDrafts: zi,
    publishApprovedError: ut,
    publishApprovedOpen: ft,
    quickSearchOpen: qe,
    railScrollRef: En,
    railToggleRef: tr,
    recordHistoryAction: cr,
    restoreHistoryTarget: rs,
    runEditorAction: Do,
    stepVideoFrame: cs,
    saveMessage: Y,
    setSaveMessage: ae,
    saveTag: es,
    saveTiming: Ui,
    savingSegmentId: O,
    acquireSaveLock: E,
    seekRef: Cn,
    segmentGroups: Et,
    segmentRailLayout: Gn,
    segments: Ft,
    selectAllVideoSegments: Fi,
    selectSegment: ko,
    selectSegmentCollection: Li,
    selectedGroups: vo,
    selectedPerformerSlots: jt,
    selectedSegment: Ye,
    selectedSegmentGroupKey: Ce,
    selectedSegmentIds: f,
    selectedSegments: Me,
    selectedSlotStatus: Fr,
    setAutoAssignError: Oe,
    setAutoAssignOpen: _e,
    setConfiguringTag: kn,
    setCurrentTime: C,
    setEditorFilters: U,
    setEditorLayout: Z,
    setFiltersOpen: $,
    setHideDerivedSegments: w,
    setHistoryOpen: me,
    setIncorrectExamplesOpen: De,
    setQuickSearchOpen: we,
    setRejectedDeletionPreview: Ke,
    setRailViewport: On,
    setSelectedSegmentGroupKey: ge,
    setSelectedSegmentId: u,
    setShortcutsOpen: ze,
    setTimelineZoom: ue,
    shotBoundaries: Ln,
    shortcutsOpen: Ue,
    slotButtonRef: nr,
    splitLayout: a,
    splitSegment: No,
    startFullAnalysis: Te,
    tagEditing: V,
    creatingSegmentId: G,
    tagSearchRef: rr,
    timelineDuration: dr,
    timelineRatioBounds: ms,
    timelineZoom: re,
    toggleSegmentGroup: Eo,
    toggleSegmentRail: ls,
    updateTimelineRatio: Ro,
    video: et,
    videoPerformers: Pn,
    visibleCounts: en,
    visibleSegmentRailRows: Ai,
    visibleSegments: gt,
    wideLayout: In,
    workspaceRef: An
  });
}
const Mc = /* @__PURE__ */ new Set(["queued", "running"]);
async function Sa(e, t, r = 4) {
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
function ka(e, t) {
  return { videoId: e, error: (t == null ? void 0 : t.message) || String(t || "Unable to start Full Scan.") };
}
function Ec() {
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
async function Dc(e, t, r, o) {
  const i = [...new Set(e.map(Number).filter((g) => Number.isInteger(g) && g > 0))], a = [...new Set(t)].filter((g) => ["aiTagging", "omnishotcut"].includes(g));
  if (i.length === 0 || a.length === 0)
    return { queuedIds: [], failed: [], cancelled: !1 };
  const s = a.includes("omnishotcut"), l = await Sa(i, async (g) => {
    try {
      const [p, y] = await Promise.all([
        r(`/videos/${g}/analysis-runs`),
        s ? r(`/videos/${g}/editor`) : null
      ]);
      if ((p || []).some((N) => Mc.has(N == null ? void 0 : N.status)))
        throw new Error("A Full Scan is already queued or running.");
      const b = (y == null ? void 0 : y.shotBoundaries) || [];
      return { videoId: g, shotBoundaries: b };
    } catch (p) {
      return ka(g, p);
    }
  }), d = l.filter((g) => !g.error), c = l.filter((g) => g.error), m = d.filter((g) => g.shotBoundaries.length > 0), u = m.reduce((g, p) => g + p.shotBoundaries.length, 0);
  if (u > 0 && !o(
    `Replace ${u} existing shot ${u === 1 ? "boundary" : "boundaries"} across ${m.length} selected ${m.length === 1 ? "video" : "videos"} when these scans succeed? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
  )) return { queuedIds: [], failed: c, cancelled: !0 };
  const f = await Sa(d, async ({ videoId: g, shotBoundaries: p }) => {
    const y = s && p.length > 0;
    try {
      return await r(`/videos/${g}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: a,
          replaceShotBoundaries: y,
          expectedShotBoundaryFingerprint: y ? zn(p) : null
        })
      }), { videoId: g };
    } catch (b) {
      return ka(g, b);
    }
  });
  return {
    queuedIds: f.filter((g) => !g.error).map((g) => g.videoId),
    failed: [...c, ...f.filter((g) => g.error)],
    cancelled: !1
  };
}
function Oc(e = [], t = []) {
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
function Pc(e = [], t = "", r = "all") {
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
function St(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function Lc(e = [], t = []) {
  var g;
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
    const x = a.get(N);
    x.rules.push(p), x.edgeCount += Number(p.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((p) => [p.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((p) => {
    var y, b;
    (y = d.get(p.sourceTagId)) == null || y.add(p.derivedTagId), (b = d.get(p.derivedTagId)) == null || b.add(p.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), m = [];
  for (const p of s) {
    if (c.has(p.tagId)) continue;
    const y = [p.tagId], b = [];
    for (c.add(p.tagId); y.length > 0; ) {
      const w = y.shift();
      b.push(w);
      for (const S of d.get(w) || [])
        c.has(S) || (c.add(S), y.push(S));
    }
    const N = new Set(b), x = b.map((w) => o.get(w)), U = l.filter((w) => N.has(w.sourceTagId) && N.has(w.derivedTagId)), H = U.flatMap((w) => w.rules), $ = x.filter((w) => w.outgoingRuleCount === 0).sort((w, S) => St(w.name, S.name)), A = $.length > 0 ? $ : [...x].sort((w, S) => St(w.name, S.name));
    m.push({
      id: [...b].sort((w, S) => w - S).join(":"),
      label: A.length > 1 ? `${A[0].name} + ${A.length - 1}` : ((g = A[0]) == null ? void 0 : g.name) || "Derivation component",
      nodes: x,
      connections: U,
      rules: H,
      segmentGroupKeys: [...new Set(x.map((w) => w.segmentGroupKey))],
      materializedEdgeCount: H.reduce(
        (w, S) => w + (Number(S.edgeCount) || 0),
        0
      )
    });
  }
  m.sort((p, y) => y.rules.length - p.rules.length || St(p.label, y.label));
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
  }), m.forEach((p) => {
    p.nodes.forEach((y) => {
      var b;
      return (b = u.get(y.segmentGroupKey)) == null ? void 0 : b.componentIds.add(p.id);
    }), p.rules.forEach((y) => {
      var b, N;
      (b = u.get(o.get(Number(y.sourceTagId)).segmentGroupKey)) == null || b.ruleIds.add(y.id), (N = u.get(o.get(Number(y.derivedTagId)).segmentGroupKey)) == null || N.ruleIds.add(y.id);
    });
  });
  const f = [...u.values()].sort((p, y) => p.sortOrder - y.sortOrder || St(p.name, y.name)).map((p) => ({
    ...p,
    ruleCount: p.ruleIds.size,
    componentCount: p.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: m,
    segmentGroups: f
  };
}
function Fc(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const m = new Map(e.nodes.map((C) => [C.tagId, /* @__PURE__ */ new Set()])), u = new Map(e.nodes.map((C) => [C.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((C) => {
    var M, J;
    (M = m.get(C.sourceTagId)) == null || M.add(C.derivedTagId), (J = u.get(C.derivedTagId)) == null || J.add(C.sourceTagId);
  });
  const f = new Map(e.nodes.map((C) => {
    var M;
    return [
      C.tagId,
      ((M = u.get(C.tagId)) == null ? void 0 : M.size) || 0
    ];
  })), g = new Map(e.nodes.map((C) => [C.tagId, 0])), p = e.nodes.filter((C) => f.get(C.tagId) === 0).sort((C, M) => St(C.name, M.name)).map((C) => C.tagId), y = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const C = p.shift();
    if (!y.has(C)) {
      y.add(C);
      for (const M of m.get(C) || [])
        g.set(M, Math.max(g.get(M) || 0, (g.get(C) || 0) + 1)), f.set(M, f.get(M) - 1), f.get(M) === 0 && p.push(M);
    }
  }
  y.size !== e.nodes.length && e.nodes.filter((C) => !y.has(C.tagId)).sort((C, M) => St(C.name, M.name)).forEach((C) => g.set(C.tagId, 0));
  const b = Math.max(0, ...g.values()), N = Math.max(
    t,
    240 + b * 296
  ), x = /* @__PURE__ */ new Map();
  e.nodes.forEach((C) => {
    x.has(C.segmentGroupKey) || x.set(C.segmentGroupKey, {
      key: C.segmentGroupKey,
      id: C.segmentGroupId,
      name: C.segmentGroupName,
      sortOrder: C.segmentGroupSortOrder,
      nodes: []
    }), x.get(C.segmentGroupKey).nodes.push(C);
  });
  const U = [...x.values()].sort((C, M) => C.sortOrder - M.sortOrder || St(C.name, M.name));
  let H = 28;
  const $ = [], A = U.map((C) => {
    const M = /* @__PURE__ */ new Map();
    C.nodes.forEach((D) => {
      const _ = g.get(D.tagId) || 0;
      M.has(_) || M.set(_, []), M.get(_).push(D);
    });
    for (const D of M.values())
      D.sort((_, se) => _.segmentGroupTagSortOrder - se.segmentGroupTagSortOrder || St(_.name, se.name));
    const J = Math.max(1, ...[...M.values()].map((D) => D.length)), le = J * 58 + (J - 1) * 18, O = 70 + le, E = {
      ...C,
      x: 12,
      y: H,
      width: N - 24,
      height: O
    };
    for (const [D, _] of M.entries()) {
      const se = _.length * 58 + Math.max(0, _.length - 1) * 18, ie = (le - se) / 2;
      _.forEach((xe, W) => $.push({
        ...xe,
        rank: D,
        x: 28 + D * 296,
        y: H + 34 + 18 + ie + W * 76,
        width: 184,
        height: 58
      }));
    }
    return H += O + 16, E;
  }), w = new Map($.map((C) => [C.tagId, C])), S = e.connections.map((C) => {
    const M = w.get(C.sourceTagId), J = w.get(C.derivedTagId), le = M.x + M.width, O = M.y + M.height / 2, E = J.x, D = J.y + J.height / 2, _ = Math.max(48, (E - le) * 0.48);
    return {
      ...C,
      path: `M ${le} ${O} C ${le + _} ${O}, ${E - _} ${D}, ${E} ${D}`
    };
  });
  return {
    width: N,
    height: Math.max(r, H - 16 + 28),
    nodes: $,
    connections: S,
    groups: A
  };
}
function jc(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Fc(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), m = 20, u = o, f = c.nodes.map((p) => ({
      ...p,
      x: p.x + m,
      y: p.y + u
    })), g = new Map(f.map((p) => [p.tagId, p]));
    a.push(...f), l.push(...c.groups.map((p) => ({
      ...p,
      componentId: d.id,
      x: p.x + m,
      y: p.y + u
    }))), s.push(...c.connections.map((p) => {
      const y = g.get(p.sourceTagId), b = g.get(p.derivedTagId), N = y.x + y.width, x = y.y + y.height / 2, U = b.x, H = b.y + b.height / 2, $ = Math.max(48, (U - N) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${N} ${x} C ${N + $} ${x}, ${U - $} ${H}, ${U} ${H}`
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
function wa(e, t = []) {
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
function Bc(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function Gc(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: m, editorRef: u, emptyDraft: f, graph: g, layout: p, listSort: y, materializationOffer: b, materializeOutgoingRules: N, materializeRule: x, message: U, normalizedQuery: H, query: $, refreshConfiguredTag: A, revealEditor: w, rules: S, save: C, segmentGroupKey: M, selectedNode: J, selectedRule: le, selection: O, setConfiguringTag: E, setDraft: D, setListSort: _, setMaterializationOffer: se, setQuery: ie, setSegmentGroupKey: xe, setSelection: W, setView: Y, sortedVisibleRules: ae, sourceSlots: Q, sourceSlotsLoading: ve, updateMapping: ye, updateTag: be, view: re, visibleComponents: ue, visibleRules: ne } = e;
  function Z(h) {
    const v = g.nodes.find((K) => K.tagId === Number(h.sourceTagId)), k = g.nodes.find((K) => K.tagId === Number(h.derivedTagId));
    return (v == null ? void 0 : v.segmentGroupKey) === (k == null ? void 0 : k.segmentGroupKey) ? v.segmentGroupKey : "cross-group";
  }
  function de() {
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
          onClick: () => D(null),
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
              onChange: (h, v) => be("source", h, v == null ? void 0 : v.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !ve && Q.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (h) => E({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: h.currentTarget
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
              onChange: (h, v) => be("derived", h, v == null ? void 0 : v.label),
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
              onClick: (h) => E({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: h.currentTarget
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
            disabled: r || Q.length === 0 || s.length === 0,
            onClick: () => D((h) => ({
              ...h,
              slotMappings: [...h.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
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
          ...d.slotMappings.map((h, v) => n("div", { key: v, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: h.sourceSlotDefinitionId,
              disabled: r,
              onChange: (k) => ye(v, "sourceSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${v + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...Q.map((k) => n("option", { key: k.id, value: k.id }, wt(k)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: h.derivedSlotDefinitionId,
              disabled: r,
              onChange: (k) => ye(v, "derivedSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${v + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((k) => n("option", { key: k.id, value: k.id }, wt(k)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => D((k) => ({
                ...k,
                slotMappings: k.slotMappings.filter((K, me) => me !== v)
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
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((h) => !h.sourceSlotDefinitionId || !h.derivedSlotDefinitionId),
          onClick: C,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => D(null), className: o }, "Cancel")
      ])
    ]);
  }
  function q() {
    if (J) {
      const k = ne.filter((B) => Number(B.derivedTagId) === J.tagId), K = ne.filter((B) => Number(B.sourceTagId) === J.tagId), me = (B, z, V) => n("div", {
        key: B.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, z),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${B.sourceTagName} → ${B.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          V ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => x(B),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => m(B, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(B),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, J.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, J.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${J.incomingRuleCount} incoming · ${J.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (B) => E({
            tagId: J.tagId,
            tagName: J.name,
            trigger: B.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        K.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => N(J, K),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${K.length})`) : null,
        K.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...K.map((B) => me(B, "Derives", !0))
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
            k.map((B) => me(B, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!le)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const h = g.nodes.find((k) => k.tagId === Number(le.sourceTagId)), v = g.nodes.find((k) => k.tagId === Number(le.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (h == null ? void 0 : h.segmentGroupName) || "Ungrouped"),
          (h == null ? void 0 : h.segmentGroupKey) !== (v == null ? void 0 : v.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(v == null ? void 0 : v.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${le.sourceTagName} → ${le.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${le.edgeCount} materialized lineage edge${le.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (b == null ? void 0 : b.ruleId) === le.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => x(le, b),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => se(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        le.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : le.slotMappings.map((k, K) => n("div", {
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
          le.createdAt ? new Date(le.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          le.updatedAt ? new Date(le.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => x(le),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => m(le),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(le),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function T() {
    if (ue.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, H ? "No derivation relationships match your search." : "No derivation rules.");
    const h = J == null ? void 0 : J.tagId, v = /* @__PURE__ */ new Set();
    return J && (v.add(J.tagId), p.connections.forEach((k) => {
      (k.sourceTagId === J.tagId || k.derivedTagId === J.tagId) && (v.add(k.sourceTagId), v.add(k.derivedTagId));
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
          className: `absolute rounded-xl border ${M === k.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
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
            const K = h === k.sourceTagId || h === k.derivedTagId, me = J != null, B = K ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${k.id}:visible`,
              d: k.path,
              fill: "none",
              stroke: B,
              strokeWidth: K ? 2.5 : 1.5,
              opacity: me && !K ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((k) => {
          const K = !H || k.name.toLocaleLowerCase().includes(H), me = J != null, B = v.has(k.tagId), z = (J == null ? void 0 : J.tagId) === k.tagId;
          return n("button", {
            key: `node:${k.tagId}`,
            type: "button",
            onClick: () => W({ type: "node", id: k.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${z ? "border-accent bg-accent/15 ring-2 ring-accent/25" : B ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${k.x}px`,
              top: `${k.y}px`,
              width: `${k.width}px`,
              height: `${k.height}px`,
              opacity: !K || me && !B ? 0.62 : 1
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
          const K = p.nodes.find((B) => B.tagId === k.sourceTagId), me = p.nodes.find((B) => B.tagId === k.derivedTagId);
          return n("div", {
            key: `bundle:${k.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(K.x + K.width + me.x) / 2 - 24}px`,
              top: `${(K.y + K.height / 2 + me.y + me.height / 2) / 2 - 10}px`
            },
            "aria-label": `${k.rules.length} rules connect ${k.rules[0].sourceTagName} to ${k.rules[0].derivedTagName}`
          }, `${k.rules.length} rules`);
        })
      ])
    ]);
  }
  function R() {
    if (ue.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        H ? "No derivation relationships match your search." : "No derivation rules."
      );
    const h = /* @__PURE__ */ new Map();
    ae.forEach((k) => {
      const K = Z(k);
      h.has(K) || h.set(K, []), h.get(K).push(k);
    });
    const v = [
      ...g.segmentGroups.map((k) => k.key),
      "cross-group"
    ].filter((k) => h.has(k));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, v.map((k) => {
      const K = g.segmentGroups.find((z) => z.key === k), me = k === "cross-group" ? "Cross-group relationships" : (K == null ? void 0 : K.name) || "Ungrouped", B = h.get(k);
      return n("section", { key: k, "aria-label": me }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, me),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${B.length} rule${B.length === 1 ? "" : "s"}`
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
          ...B.map((z) => n("button", {
            key: z.id,
            type: "button",
            role: "row",
            onClick: () => W({ type: "rule", id: z.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(le == null ? void 0 : le.id) === z.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${z.sourceTagName} → ${z.derivedTagName}` },
              `${z.sourceTagName} → ${z.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(z.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(z.edgeCount))
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
          `${S.length} rules · ${g.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          D(f()), W(null), w();
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
          onChange: (h) => {
            ie(h.target.value), W(null);
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
          onChange: (h) => {
            xe(h.target.value), W(null), D(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...g.segmentGroups.map((h) => n("option", { key: h.key, value: h.key }, h.name))
        ])
      ]),
      re === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: y,
          onChange: (h) => _(h.target.value),
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
        ].map(([h, v]) => n("button", {
          key: h,
          type: "button",
          onClick: () => {
            Y(h), h === "graph" && (O == null ? void 0 : O.type) === "rule" && W(null);
          },
          "aria-pressed": re === h,
          className: `rounded px-3 py-1.5 text-sm font-medium ${re === h ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
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
        re === "graph" ? T() : R()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? de() : q()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      U ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, U) : null
    ]),
    i ? n(ho, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => A(i),
      onClose: () => {
        const h = i.trigger;
        E(null), requestAnimationFrame(() => {
          h != null && h.isConnected && h.focus();
        });
      }
    }) : null
  ]);
}
function Uc({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = L([]), [a, s] = L(null), [l, d] = L([]), [c, m] = L([]), [u, f] = L(!1), [g, p] = L(!1), [y, b] = L(!1), [N, x] = L(""), [U, H] = L(""), [$, A] = L("graph"), [w, S] = L("all"), [C, M] = L(null), [J, le] = L("relationship"), [O, E] = L(null), [D, _] = L(null), se = pe(null), ie = pe(null), xe = ri().replace(/:/g, "");
  function W() {
    requestAnimationFrame(() => {
      var F;
      return (F = se.current) == null ? void 0 : F.scrollIntoView({ block: "nearest" });
    });
  }
  async function Y(F) {
    const j = await te("/derivation-rules", F ? { signal: F } : void 0);
    i(j || []);
  }
  fe(() => {
    const F = new AbortController();
    return Y(F.signal).catch((j) => {
      j.name !== "AbortError" && x(j.message || "Unable to load derived segment rules.");
    }), () => F.abort();
  }, []), fe(() => {
    const F = new AbortController();
    return a != null && a.sourceTagId ? (f(!0), te(`/slot-definitions/${a.sourceTagId}`, { signal: F.signal }).then((j) => d(j.definitions || [])).catch((j) => {
      j.name !== "AbortError" && d([]);
    }).finally(() => {
      F.signal.aborted || f(!1);
    })) : (d([]), f(!1)), a != null && a.derivedTagId ? (p(!0), te(`/slot-definitions/${a.derivedTagId}`, { signal: F.signal }).then((j) => m(j.definitions || [])).catch((j) => {
      j.name !== "AbortError" && m([]);
    }).finally(() => {
      F.signal.aborted || p(!1);
    })) : (m([]), p(!1)), () => F.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), fe(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || u || g)
      return;
    const F = `${a.sourceTagId}:${a.derivedTagId}`;
    ie.current !== F && (ie.current = F, s((j) => !j || Number(j.sourceTagId) !== Number(a.sourceTagId) || Number(j.derivedTagId) !== Number(a.derivedTagId) ? j : od(j, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    u,
    g
  ]);
  function ae(F, j = !1) {
    j || M({ type: "rule", id: F.id }), ie.current = null, s({
      ruleId: F.id,
      sourceTagId: F.sourceTagId,
      sourceTagName: F.sourceTagName,
      derivedTagId: F.derivedTagId,
      derivedTagName: F.derivedTagName,
      slotMappings: F.slotMappings.map((G) => ({
        sourceSlotDefinitionId: G.sourceSlotDefinitionId,
        derivedSlotDefinitionId: G.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), x(""), W();
  }
  function Q(F, j, G = "") {
    ie.current = null, F === "source" ? (d([]), f(j != null)) : (m([]), p(j != null)), s((X) => ({
      ...X,
      [`${F}TagId`]: j == null ? null : Number(j),
      [`${F}TagName`]: G || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function ve(F) {
    (a == null ? void 0 : a.ruleId) == null && (ie.current = null);
    const j = [Y(), t == null ? void 0 : t()];
    return F.draftKind === "source" ? (f(!0), j.push(te(`/slot-definitions/${F.tagId}`).then((G) => d(G.definitions || [])).finally(() => f(!1)))) : F.draftKind === "derived" && (p(!0), j.push(te(`/slot-definitions/${F.tagId}`).then((G) => m(G.definitions || [])).finally(() => p(!1)))), Promise.all(j);
  }
  function ye(F, j, G) {
    s((X) => ({
      ...X,
      slotMappings: X.slotMappings.map(($e, he) => he === F ? { ...$e, [j]: G } : $e)
    }));
  }
  async function be() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const F = wa(a, o);
    if (F) {
      x(F.message);
      return;
    }
    if (a.slotMappings.some((j) => !j.sourceSlotDefinitionId || !j.derivedSlotDefinitionId)) {
      x("Complete or remove every performer slot mapping before saving.");
      return;
    }
    b(!0), x(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let j = null;
      if (a.ruleId != null) {
        const X = await te(
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
        j = X.fingerprint;
      }
      x("Saving derived segment rule…");
      const G = await te("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: j
        })
      });
      if (await Y(), M($ === "graph" ? { type: "node", id: Number(G.sourceTagId) } : { type: "rule", id: G.id }), s(null), a.ruleId == null)
        try {
          const X = await te(
            `/derivation-rules/${G.id}/materialization/preview`,
            { method: "POST" }
          );
          E(
            X.createCount + X.linkCount > 0 ? X : null
          ), x(X.createCount + X.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          E(null), x("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        E(null), x("Derived segment rule saved. Previous materializations were removed.");
    } catch (j) {
      x(j.message || "Unable to save derived segment rule.");
    } finally {
      b(!1);
    }
  }
  async function re(F) {
    b(!0), x("Previewing rule deletion…");
    try {
      const j = await te(
        `/derivation-rules/${F.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${F.sourceTagName} → ${F.derivedTagName}?

Deleted segments: ${j.deletedSegmentCount}
Removed lineage edges: ${j.removedEdgeCount}
Shared derived segments retained: ${j.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const G = `derivation-rule-delete:${F.id}:${j.fingerprint}`;
      await te(`/derivation-rules/${F.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(G),
          fingerprint: j.fingerprint
        })
      }), je(G), await Y(), (a == null ? void 0 : a.ruleId) === F.id && s(null), (C == null ? void 0 : C.type) === "rule" && C.id === F.id && M(null), (O == null ? void 0 : O.ruleId) === F.id && E(null), x(`Rule deleted with ${j.deletedSegmentCount} exclusively derived segment${j.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (j) {
      x(j.message || "Unable to delete derived segment rule.");
    } finally {
      b(!1);
    }
  }
  async function ue(F, j = null) {
    const G = j || await te(
      `/derivation-rules/${F.id}/materialization/preview`,
      { method: "POST" }
    );
    if (G.createCount + G.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const X = `derivation-rule-materialize:${F.id}:${G.fingerprint}`, $e = await te(`/derivation-rules/${F.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Fe(X),
        fingerprint: G.fingerprint
      })
    });
    return je(X), $e;
  }
  async function ne(F, j = null) {
    b(!0), x("Finding pending derivations…");
    try {
      const G = await ue(F, j);
      if (E(null), await Y(), G.createdCount + G.linkedCount === 0) {
        x("Every applicable derivation is already materialized.");
        return;
      }
      x(
        `${G.createdCount} derived segment${G.createdCount === 1 ? "" : "s"} created and ${G.linkedCount} existing segment${G.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (G) {
      x(G.message || "Unable to materialize pending derivations.");
    } finally {
      b(!1);
    }
  }
  async function Z(F, j) {
    if (j.length === 0) return;
    b(!0), x(`Finding pending derivations from ${F.name}…`);
    let G = 0, X = 0;
    try {
      for (const $e of j) {
        const he = await ue($e);
        G += he.createdCount, X += he.linkedCount;
      }
      E(null), await Y(), x(G + X === 0 ? `Every outgoing derivation from ${F.name} is already materialized.` : `${G} derived segment${G === 1 ? "" : "s"} created and ${X} existing segment${X === 1 ? "" : "s"} linked from ${F.name}.`);
    } catch ($e) {
      await Y().catch(() => {
      }), x($e.message || `Unable to materialize derivations from ${F.name}.`);
    } finally {
      b(!1);
    }
  }
  const de = wa(a, o), q = Ge(
    () => Lc(o, e),
    [o, e]
  ), T = U.trim().toLocaleLowerCase(), h = q.components.filter((F) => w === "all" || F.segmentGroupKeys.includes(w)).filter((F) => !T || F.nodes.some((j) => j.name.toLocaleLowerCase().includes(T))), v = h.flatMap((F) => F.rules), k = new Set(
    h.flatMap((F) => F.nodes.map((j) => j.tagId))
  ), K = Ge(
    () => jc(h),
    [h]
  ), me = $ === "list" ? Bc(
    C,
    v,
    T.length > 0
  ) : null, B = (C == null ? void 0 : C.type) === "node" && q.nodes.find((F) => F.tagId === C.id && k.has(F.tagId)) || null, z = [...v].sort((F, j) => J === "source" ? St(F.sourceTagName, j.sourceTagName) || St(F.derivedTagName, j.derivedTagName) : J === "target" ? St(F.derivedTagName, j.derivedTagName) || St(F.sourceTagName, j.sourceTagName) : J === "materialized" ? (Number(j.edgeCount) || 0) - (Number(F.edgeCount) || 0) || St(F.sourceTagName, j.sourceTagName) : St(
    `${F.sourceTagName} ${F.derivedTagName}`,
    `${j.sourceTagName} ${j.derivedTagName}`
  ));
  return n(Gc, {
    arrowMarkerId: xe,
    busy: y,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: D,
    deleteRule: re,
    derivedSlots: c,
    derivedSlotsLoading: g,
    draft: a,
    draftIssue: de,
    editRule: ae,
    editorRef: se,
    emptyDraft: r,
    graph: q,
    layout: K,
    listSort: J,
    materializationOffer: O,
    materializeOutgoingRules: Z,
    materializeRule: ne,
    message: N,
    normalizedQuery: T,
    query: U,
    refreshConfiguredTag: ve,
    revealEditor: W,
    rules: o,
    save: be,
    segmentGroupKey: w,
    selectedNode: B,
    selectedRule: me,
    selection: C,
    setConfiguringTag: _,
    setDraft: s,
    setListSort: le,
    setMaterializationOffer: E,
    setQuery: H,
    setSegmentGroupKey: S,
    setSelection: M,
    setView: A,
    sortedVisibleRules: z,
    sourceSlots: l,
    sourceSlotsLoading: u,
    updateMapping: ye,
    updateTag: Q,
    view: $,
    visibleComponents: h,
    visibleRules: v
  });
}
function Kc() {
  const [e, t] = L(Qa), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => Zo({ ...l, [a]: s }));
  }
  function i() {
    t(Zo(io));
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
function zc({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = L([]), [a, s] = L(!1), [l, d] = L(!1), [c, m] = L(""), [u, f] = L(""), [g, p] = L("all"), [y, b] = L(() => /* @__PURE__ */ new Set()), [N, x] = L(null);
  fe(() => {
    if (!e || a) return;
    const E = new AbortController();
    return d(!0), m(""), te("/slot-definitions", { signal: E.signal }).then((D) => {
      i(D || []), s(!0);
    }).catch((D) => {
      D.name !== "AbortError" && m(D.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      E.signal.aborted || d(!1);
    }), () => E.abort();
  }, [e, a]);
  async function U() {
    d(!0), m("");
    try {
      const E = await te("/slot-definitions");
      i(E || []), s(!0);
    } catch (E) {
      m(E.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function H() {
    const [E] = await Promise.all([
      te("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(E || []), s(!0), m("");
  }
  function $() {
    const E = N == null ? void 0 : N.trigger;
    x(null), requestAnimationFrame(() => {
      E != null && E.isConnected && E.focus({ preventScroll: !0 });
    });
  }
  function A(E) {
    b((D) => {
      const _ = new Set(D);
      return _.has(E) ? _.delete(E) : _.add(E), _;
    });
  }
  const w = Ge(
    () => Oc(t, o),
    [t, o]
  ), S = Ge(
    () => Pc(w, u, g),
    [w, u, g]
  ), C = w.flatMap((E) => E.tags), M = C.filter((E) => E.definitions.length > 0).length, J = C.length - M, le = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], O = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${C.length} tags · ${M} with slots · ${J} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: u,
          onChange: (E) => f(E.target.value),
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
          le.map(([E, D]) => n("button", {
            key: E,
            type: "button",
            onClick: () => p(E),
            "aria-pressed": g === E,
            className: `rounded px-3 py-1.5 text-xs font-medium ${g === E ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, D))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => b(/* @__PURE__ */ new Set()),
          className: O
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => b(new Set(w.map((E) => E.overviewKey))),
          className: O
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
        onClick: U,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && S.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, S.map((E) => {
      const D = y.has(E.overviewKey), _ = E.tags.filter((se) => se.definitions.length > 0).length;
      return n("article", {
        key: E.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => A(E.overviewKey),
          "aria-expanded": !D,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, D ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, E.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${E.tags.length} tag${E.tags.length === 1 ? "" : "s"} · ${_} with slots`
          )
        ]),
        D ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          E.tags.map((se) => n("li", {
            key: se.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: se.tagName }, se.tagName),
              se.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            se.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${se.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, se.definitions.map((ie) => n("li", {
              key: ie.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, wt(ie)),
              ...(ie.genderHints || []).map((xe) => n("span", {
                key: xe,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, Cr(xe)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (ie) => x({
                tagId: se.tagId,
                tagName: se.tagName,
                trigger: ie.currentTarget
              }),
              "aria-label": `Edit performer slots for ${se.tagName}`,
              className: `${O} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    N ? n(ho, {
      key: `performer-slots-configure:${N.tagId}`,
      tagId: N.tagId,
      tagName: N.tagName,
      onSaved: H,
      onClose: $
    }) : null
  ]);
}
function Hc({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = L("general"), [a, s] = L([]), [l, d] = L(!1), [c, m] = L(""), [u, f] = L(""), [g, p] = L(null), [y, b] = L(!0), [N, x] = L(!1), [U, H] = L(""), [$, A] = L(!0), [w, S] = L(Ha), C = xl(t), M = C.map(([D]) => D);
  fe(() => {
    M.includes(o) || i(M[0] || "general");
  }, [t.effectiveMode]);
  async function J(D) {
    const _ = await te("/segment-groups", D ? { signal: D } : void 0);
    s(_ || []);
  }
  fe(() => {
    const D = new AbortController();
    return J(D.signal).catch((_) => {
      _.name !== "AbortError" && m(_.message || "Unable to load tag groups.");
    }), () => D.abort();
  }, []), fe(() => {
    if (t.effectiveMode !== "full") {
      b(!1);
      return;
    }
    const D = new AbortController();
    return H(""), b(!0), Promise.all([
      te("/analysis/settings", { signal: D.signal }),
      te("/analysis/status", { signal: D.signal })
    ]).then(([_, se]) => {
      A(!0), f((_ == null ? void 0 : _.baseUrl) || ""), p(se);
    }).catch((_) => {
      if (_.name !== "AbortError") {
        if (_.status === 403) {
          A(!1), H("You do not have permission to manage the analysis service connection.");
          return;
        }
        H(_.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      D.signal.aborted || b(!1);
    }), () => D.abort();
  }, [t.effectiveMode]);
  async function le(D) {
    if (D !== t.requestedMode) {
      d(!0), m("");
      try {
        const _ = await te(
          `/preferences/transition?mode=${encodeURIComponent(D)}`
        );
        let se = !1, ie = null, xe = null, W = null, Y = !1;
        if (t.requestedMode === "basic" && D === "full") {
          if (!window.confirm(wl(
            _.recyclingBinCount,
            _.protectedRecyclingBinCount
          )))
            return;
          Y = !0, _.recyclingBinCount > 0 && (se = !0, W = _.recyclingBinFingerprint, ie = `mode-switch-empty-bin:${W}`, xe = Fe(ie));
        }
        let ae = !1;
        if (t.requestedMode === "full" && D === "basic") {
          if (!window.confirm(kl(
            _.extensionOwnedSegmentCount
          )))
            return;
          ae = !0;
        }
        const Q = await te("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: D,
            confirmHiddenExtensionOwnedSegments: ae,
            confirmBasicHistoryCleanup: Y,
            emptyRecyclingBin: se,
            operationId: xe,
            expectedRecyclingBinFingerprint: W
          })
        });
        ie && je(ie), r == null || r(Za(Q)), m("Workflow mode saved.");
      } catch (_) {
        m(_.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function O(D) {
    D.preventDefault(), x(!0), H("");
    try {
      const _ = await te("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: u })
      });
      f((_ == null ? void 0 : _.baseUrl) || "");
      const se = await te("/analysis/status");
      p(se), H(_ != null && _.baseUrl ? se != null && se.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(se == null ? void 0 : se.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (_) {
      H(_.message || "Unable to save analysis service settings.");
    } finally {
      x(!1);
    }
  }
  const E = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (D) => Ni(D, e, E), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      C.map(([D, _]) => n("button", {
        key: D,
        type: "button",
        onClick: () => i(D),
        "aria-current": o === D ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === D ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, _))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(Kc)
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
      n(ac, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: le,
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
          checked: w,
          onChange: (D) => {
            const _ = D.target.checked;
            qa(_), S(_);
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
      n("form", { key: "form", onSubmit: O, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
        n("label", { key: "url", className: "min-w-0 flex-1 space-y-1" }, [
          n("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Server URL"),
          n("input", {
            key: "input",
            type: "url",
            value: u,
            onChange: (D) => f(D.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: y || N || !$,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: y || N || !$,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, N ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        U || (y ? "Loading analysis service settings…" : (g == null ? void 0 : g.configured) === !1 ? "Full Scan is not configured." : g != null && g.ready ? "Analysis service is ready." : (g == null ? void 0 : g.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    M.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(Uc, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => J()
      })
    ) : null,
    M.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(zc, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => J()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function Na({ facets: e, values: t, disabled: r, onChange: o }) {
  var i;
  return r ? n(
    "p",
    { className: "rounded-md border border-dashed border-border p-3 text-xs text-secondary" },
    "Performer slot filters are unavailable for your current access. Browse and playback remain available."
  ) : (i = e == null ? void 0 : e.slots) != null && i.length ? n("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, e.slots.map((a) => n("label", { key: a.id, className: "space-y-1 text-xs text-secondary" }, [
    n("span", { key: "label" }, wt(a)),
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
function qc({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var m, u;
  const s = [...e.slots || []].sort((f, g) => f.sortOrder - g.sortOrder || String(f.slotDefinitionId).localeCompare(String(g.slotDefinitionId))), l = [...new Map(s.map((f) => [
    f.performerId,
    { id: f.performerId, name: f.performerName }
  ])).values()], d = s.map((f) => ({
    slotDefinitionId: f.slotDefinitionId,
    label: wt(f),
    performer: { id: f.performerId, name: f.performerName }
  })), c = ei(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: di(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((m = e.activity) == null ? void 0 : m.name) || "segment"}, ${e.reviewState}, ${Re(e.startSec)} to ${e.endSec == null ? "end of video" : Re(e.endSec)}` }, [
      n("div", { key: "image", className: "relative aspect-video bg-black" }, [
        n("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        n("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${Re(e.startSec)} → end` : `${Re(e.startSec)} – ${Re(e.endSec)}`)
      ]),
      n("div", { key: "body", className: "flex flex-col gap-1.5 p-2.5" }, [
        n("div", { key: "segment", className: "flex min-w-0 items-center gap-1.5" }, [
          n(sn, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((u = e.activity) == null ? void 0 : u.name) || "Tag segment"),
          l.length ? n($r, {
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
function _c({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(Aa, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: Cl(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: ei(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Ia({ onNavigate: e, profile: t }) {
  const r = Ge(() => {
    const Y = Ma("ext:com.midnightrider.segment-studio:segments");
    return Y ? {
      ...Hr,
      defaultFilter: { ...Hr.defaultFilter, ...Y.findFilter || {} },
      defaultObjectFilter: Y.objectFilter || {}
    } : Hr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Ea(r), [l, d] = L(null), [c, m] = L({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [u, f] = L(null), [g, p] = L(null), [y, b] = L(0), [N, x] = L(""), [U, H] = L(!0), [$, A] = L(""), w = pe(0), S = ea(o, i), C = S.activityTagId, M = yn(i.slots), J = Ge(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (Y) => Object.keys(yn(Y)).length > 0,
    sanitize: (Y) => qr(C, yn(Y)),
    summarize: (Y) => `${Object.keys(yn(Y)).length} assigned`,
    renderEditor: (Y, ae) => C ? n(Na, {
      facets: l,
      values: yn(Y),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (Q, ve) => {
        const ye = { ...yn(Y) };
        ve ? ye[Q] = Number(ve) : delete ye[Q], ae(qr(C, ye));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [C, l, c.performerSlotsAvailable]), le = JSON.stringify(S);
  fe(() => {
    if (d(null), !C) return;
    const Y = new AbortController();
    return te(`/browse/activities/${C}/facets`, { signal: Y.signal }).then(d).catch((ae) => {
      ae.status === 403 ? d({ slots: [], restricted: !0 }) : ae.name !== "AbortError" && A(ae.message);
    }), () => Y.abort();
  }, [C]), fe(() => {
    const Y = ++w.current, ae = new AbortController();
    return H(!0), A(""), te("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(S), signal: ae.signal }).then((Q) => {
      Y === w.current && m({ ...Q, totalCount: Q.totalCount ?? Q.total ?? 0 });
    }).catch((Q) => {
      if (!(Y !== w.current || Q.name === "AbortError")) {
        if (Q.status === 400 && Q.message.includes("unrestricted performer read access")) {
          m((ve) => ({ ...ve, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), A("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        A(Q.message);
      }
    }).finally(() => {
      Y === w.current && H(!1);
    }), () => {
      w.current++, ae.abort();
    };
  }, [le, y]);
  const O = c.items.findIndex((Y) => Y.key === u), E = c.items[O] || null;
  function D(Y) {
    s(Y), a({ ...o, page: 1 });
  }
  function _(Y) {
    const ae = ea(o, Y), Q = Y.slots && ae.activityTagId != null && ae.slotAssignments.length > 0 ? Y.slots : void 0;
    D({ ...Y, slots: Q });
  }
  function se(Y, ae) {
    const Q = { ...M };
    ae ? Q[Y] = Number(ae) : delete Q[Y], D({ ...i, slots: qr(C, Q) });
  }
  function ie() {
    const Y = document.querySelector(`[data-segment-key="${u}"]`);
    f(null), requestAnimationFrame(() => Y == null ? void 0 : Y.focus());
  }
  async function xe(Y) {
    var ve;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(Y.key), x("");
    const ae = `browse-restore:${Y.itemId}:${Y.revision}`, Q = Fe(ae);
    try {
      const ye = (be = !1) => te(`/bin/${Y.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Q,
          expectedRevision: Y.revision,
          discardMissingImage: be
        })
      });
      try {
        await ye(uo(ae));
      } catch (be) {
        if (((ve = be.payload) == null ? void 0 : ve.code) !== "missing-image" || !window.confirm(`${be.message}

Continue and discard the missing image reference?`))
          throw be;
        mo(ae), await ye(!0);
      }
      je(ae), u === Y.key && f(null), x("Segment restored to Cove."), b((be) => be + 1);
    } catch (ye) {
      x(ye.message || "Unable to restore the segment."), ye.status === 409 && b((be) => be + 1);
    } finally {
      p(null);
    }
  }
  async function W(Y) {
    p(Y.key), x("");
    try {
      const ae = await te(`/items/${Y.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: Y.revision })
      });
      if (!ai(ae, x) || !Ul(ae))
        return;
      const Q = `browse-dependency-delete:${Y.itemId}:${ae.fingerprint}`;
      await te(`/items/${Y.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(Q),
          fingerprint: ae.fingerprint
        })
      }), je(Q), u === Y.key && f(null), x(`${ae.deletedSegmentCount} segment${ae.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), b((ve) => ve + 1);
    } catch (ae) {
      x(ae.message || "Unable to permanently delete the segment."), ae.status === 409 && b((Q) => Q + 1);
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
    n(Da, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: a,
      totalCount: c.totalCount,
      isLoading: U,
      error: $ ? new Error($) : null,
      onRetry: () => b((Y) => Y + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? Xo.filter((Y) => Y.id !== "performers") : Xo,
      objectFilter: i,
      onObjectFilterChange: _,
      customFilterSections: J,
      searchPlaceholder: "Search segments..."
    }, [
      C ? n(Na, { key: "slots", facets: l, values: M, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: se }) : null,
      n(_c, { key: "player", item: E, index: O, count: c.items.length, onPrevious: () => {
        var Y;
        return f((Y = c.items[O - 1]) == null ? void 0 : Y.key);
      }, onNext: () => {
        var Y;
        return f((Y = c.items[O + 1]) == null ? void 0 : Y.key);
      }, onClose: ie, onNavigate: e }),
      N ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, N) : null,
      !U && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      U ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((Y) => n(qc, {
        key: Y.key,
        item: Y,
        selected: Y.key === u,
        busy: g === Y.key,
        onSelect: () => f(Y.key),
        onRestore: xe,
        onPurge: W
      })))
    ])
  ]);
}
function Wc({ onNavigate: e, profile: t }) {
  const [r, o] = L([]), [i, a] = L(""), [s, l] = L(0), [d, c] = L(!0), [m, u] = L(null), [f, g] = L(""), p = pe(null);
  async function y(x) {
    const U = await te("/bin", x ? { signal: x } : void 0);
    return o(U.items || []), a(U.fingerprint || ""), l(Number(U.totalCount) || 0), U;
  }
  fe(() => {
    const x = new AbortController();
    return c(!0), y(x.signal).catch((U) => {
      U.name !== "AbortError" && g(U.message);
    }).finally(() => {
      x.signal.aborted || c(!1);
    }), () => x.abort();
  }, []), Ra(ao, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var x;
      return (x = p.current) == null ? void 0 : x.call(p);
    }
  }]);
  async function b(x) {
    var $;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    u(x.itemId), g("");
    const U = `restore:${x.itemId}:${x.revision}`, H = Fe(U);
    try {
      const A = (w = !1) => te(`/bin/${x.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: H, expectedRevision: x.revision, discardMissingImage: w })
      });
      try {
        await A(uo(U));
      } catch (w) {
        if ((($ = w.payload) == null ? void 0 : $.code) !== "missing-image" || !window.confirm(`${w.message}

Continue and discard the missing image reference?`)) throw w;
        mo(U), await A(!0);
      }
      je(U), await y(), Hn(), g("Segment restored with a new native ID.");
    } catch (A) {
      g(A.message || "Unable to restore the segment."), A.status === 409 && await y();
    } finally {
      u(null);
    }
  }
  async function N() {
    if (m == null)
      try {
        const x = await si({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          u(-1), g("");
        });
        if (x.status !== "emptied") return;
        await y(), Hn(), g(`${x.segmentCount} segment${x.segmentCount === 1 ? "" : "s"} from ${x.sceneCount} scene${x.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (x) {
        g(x.message || "Unable to empty the recycling bin."), x.status === 409 && await y();
      } finally {
        u(null);
      }
  }
  return p.current = N, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
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
        disabled: d || m != null || s === 0,
        onClick: N,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, m === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    f ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, f) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((x) => n("article", { key: x.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${x.tagName || "Tag segment"} · ${x.videoTitle || `Video ${x.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, x.endSec == null ? Re(x.startSec) : `${Re(x.startSec)} – ${Re(x.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${x.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${x.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: m != null, onClick: () => b(x), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const Ca = "ext:com.midnightrider.segment-studio:videos";
function Vr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = Ge(() => {
    var ne;
    const re = Ma(Ca), ue = (ne = re == null ? void 0 : re.uiOptions) == null ? void 0 : ne.displayMode;
    return re ? {
      ...Un,
      defaultFilter: { ...Un.defaultFilter, ...re.findFilter || {} },
      defaultObjectFilter: re.objectFilter || {},
      defaultDisplayMode: Un.allowedDisplayModes.includes(ue) ? ue : Un.defaultDisplayMode
    } : Un;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: m } = Ea(i), [u, f] = L({ items: [], totalCount: 0 }), [g, p] = L(!0), [y, b] = L(""), [N, x] = L(0), [U, H] = L(/* @__PURE__ */ new Set()), [$, A] = L(null), [w, S] = L({ busy: !1, error: "", announcement: "" }), C = pe(0), M = pe(null), J = pe(null);
  J.current || (J.current = Ec());
  const le = JSON.stringify(a), O = JSON.stringify(s), E = t || r === "review";
  fe(() => {
    J.current.selectionChanged(), M.current = null, H(/* @__PURE__ */ new Set()), S((re) => ({ busy: re.busy, error: "", announcement: "" }));
  }, [le, O]), fe(() => {
    if (!E) return;
    const re = new AbortController();
    return te("/analysis/status", { signal: re.signal }).then(A).catch((ue) => {
      ue.name !== "AbortError" && A({ configured: !0, ready: !1, error: ue.message || "Unable to check Full Scan readiness." });
    }), () => re.abort();
  }, [E]), fe(() => {
    const re = ++C.current, ue = new AbortController();
    return p(!0), b(""), te(`/videos?${ec(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: ue.signal }).then((ne) => {
      re === C.current && f(ne);
    }).catch((ne) => {
      re === C.current && ne.name !== "AbortError" && b(ne.message || "Unable to discover videos.");
    }).finally(() => {
      re === C.current && p(!1);
    }), () => {
      C.current++, ue.abort();
    };
  }, [le, O, t, r, N]);
  function D(re) {
    d({ ...re, page: re.page || 1 });
  }
  function _(re) {
    c(re), d({ ...a, page: 1 });
  }
  function se(re, ue = !1) {
    H((ne) => tc(
      ne,
      u.items.map((Z) => Z.videoId),
      re,
      M.current,
      ue
    )), M.current = re;
  }
  function ie() {
    M.current = null, H(new Set(u.items.map((re) => re.videoId)));
  }
  function xe() {
    M.current = null, H(/* @__PURE__ */ new Set());
  }
  function W() {
    M.current = null, H((re) => new Set(u.items.map((ue) => ue.videoId).filter((ue) => !re.has(ue))));
  }
  async function Y(re = ["aiTagging", "omnishotcut"]) {
    const ue = J.current.begin();
    if (ue) {
      S({ busy: !0, error: "", announcement: "" });
      try {
        const ne = await Dc(
          [...U],
          re,
          te,
          (Z) => window.confirm(Z)
        );
        if (ne.cancelled) {
          S({ busy: !1, error: "", announcement: "" });
          return;
        }
        ne.queuedIds.length > 0 && J.current.ownsCurrentSelection(ue) && (ne.queuedIds.includes(M.current) && (M.current = null), H((Z) => {
          const de = new Set(Z);
          return ne.queuedIds.forEach((q) => de.delete(q)), de;
        })), S({
          busy: !1,
          announcement: ne.queuedIds.length > 0 ? `${ne.queuedIds.length} ${ne.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: ne.failed.length > 0 ? `${ne.failed.length} selected ${ne.failed.length === 1 ? "video could" : "videos could"} not be queued. ${ne.failed[0].error}` : ""
        });
      } catch (ne) {
        S({ busy: !1, error: ne.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        J.current.finish(ue);
      }
    }
  }
  const ae = t || r === "review" ? ya : ya.filter((re) => !["reviewState", "shotBoundaries"].includes(re.id)), Q = $ === null || $.configured === !1 || $.ready === !1, ve = w.busy || Q, ye = ($ == null ? void 0 : $.error) || ($ === null ? "Checking Full Scan availability" : $.configured === !1 ? "Configure the analysis service before running Full Scan" : $.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), be = w.busy ? "Queueing scans…" : $ === null ? "Checking Full Scan…" : $.configured === !1 ? "Full Scan not configured" : $.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
  return n("div", { className: "w-full space-y-5" }, [
    n(bo, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(Da, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: Ca,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: D,
      totalCount: u.totalCount,
      isLoading: g,
      error: y ? new Error(y) : null,
      onRetry: () => x((re) => re + 1),
      sortOptions: t || r === "review" ? [...fa, { value: "unreviewed_count", label: "Unreviewed count" }] : fa,
      displayMode: l,
      onDisplayModeChange: m,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: ae,
      objectFilter: s,
      onObjectFilterChange: _,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: E ? U : void 0,
      onSelectAll: E ? ie : void 0,
      onSelectNone: E ? xe : void 0,
      onInvertSelection: E ? W : void 0,
      selectionActions: E ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: ve,
          onClick: () => Y(),
          title: ye,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, be),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": ve,
            title: ye,
            onClick: (re) => {
              ve && re.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${ve ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(Oa, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([re, ue]) => n("button", {
            key: re,
            type: "button",
            disabled: w.busy,
            onClick: (ne) => {
              var Z;
              (Z = ne.currentTarget.closest("details")) == null || Z.removeAttribute("open"), Y(ue);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, re)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, w.announcement),
      w.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, w.error) : null,
      !g && u.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !g && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, u.items.map((re) => n(nc, { key: re.videoId, item: re, onNavigate: e, showReviewStates: E, selected: U.has(re.videoId), selectionActive: U.size > 0, onSelect: E ? se : null }))) : null,
      !g && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, u.items.map((re) => n(rc, { key: re.videoId, item: re, onNavigate: e, showReviewStates: E, selected: U.has(re.videoId), selectionActive: U.size > 0, onSelect: E ? se : null }))) : null
    ])
  ]);
}
function $a({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = L(null), [s, l] = L(!0), [d, c] = L(""), m = pe(0), u = pe(0), f = pe(e), g = Gd();
  f.current = e;
  const [p] = L(() => Ls({
    beginRequest: () => ({ requestId: ++u.current, videoId: f.current }),
    fetchDetail: (H) => te(y(H.videoId)),
    isCurrent: (H) => ur(H.requestId, u.current, H.videoId, f.current),
    isSameVideo: (H) => H.videoId === f.current
  })), y = (H) => `/videos/${H}/editor`;
  async function b(H, $, A) {
    const w = await te(y($), A ? { signal: A.signal } : void 0);
    return ur(H, A ? m.current : u.current, $, f.current) ? (a(w), !0) : !1;
  }
  fe(() => {
    const H = ++m.current, $ = e, A = new AbortController();
    return a(null), l(!0), c(""), b(H, $, A).catch((w) => {
      ur(H, m.current, $, f.current) && w.name !== "AbortError" && c(w.message || "Unable to load the editor.");
    }).finally(() => {
      ur(H, m.current, $, f.current) && l(!1);
    }), () => {
      m.current++, u.current++, A.abort();
    };
  }, [e]);
  function N(H, $) {
    a((A) => (A == null ? void 0 : A.video.id) !== $ ? A : typeof H == "function" ? H(A) : H);
  }
  function x() {
    return p({
      onLoaded: (H) => {
        a(H), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: (H) => c(H.message || "Unable to reload the latest segment.")
    });
  }
  function U() {
    return p({
      onLoaded: (H) => {
        a(H), c("");
      },
      onError: (H) => c(H.message || "Unable to reload performer slots.")
    });
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
      n(xs, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(Rc, {
      key: i.video.id,
      detail: i,
      onDetailChange: N,
      onConflict: x,
      onReload: U,
      onSlotsChanged: U,
      splitLayout: g,
      profile: o,
      initialSegmentId: na() ? -na() : $l(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function Vc(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function Jc(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function Yc(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function Qc({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = hl(o), l = Vc(e, t, window.location.pathname), d = Jc(e, t, window.location.pathname), c = Yc(e, t, window.location.pathname), m = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (Sl(m, o) === "videos" && m !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Vr, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(Hc, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(Ia, { onNavigate: r, profile: o });
    const g = Number(e);
    return Number.isInteger(g) && g > 0 ? n($a, {
      videoId: g,
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
  if (c) return n(Wc, { onNavigate: r, profile: o });
  const f = Number(e);
  return d ? n(Ia, { onNavigate: r, profile: o }) : Number.isInteger(f) && f > 0 ? n($a, {
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
function Zc({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = L(null), [a, s] = L("");
  return fe(() => {
    const l = new AbortController();
    return te("/preferences", { signal: l.signal }).then((d) => i(Za(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(Qc, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function Xc(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function eu(e, t) {
  const r = Xc(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const ku = {
  components: { SegmentStudioPage: Zc },
  actionHandlers: { openSegmentStudio: eu }
};
export {
  kr as CLEARED_SEGMENT_SELECTION_ID,
  fa as DISCOVERY_SORT_OPTIONS,
  zt as SEGMENT_STUDIO_CAPABILITIES,
  ao as SEGMENT_STUDIO_EXTENSION_ID,
  Yn as SEGMENT_STUDIO_SHORTCUTS,
  Gs as activeEditorFilterCount,
  Md as addPendingChange,
  od as applyDerivationRuleSlotSuggestions,
  hr as applyFeedbackEditorDelta,
  Ld as applyPendingChanges,
  sa as applySegmentMergeDelta,
  Hl as basicSegmentTimelineStyle,
  Cl as browseClipEnd,
  ei as browseEditorHref,
  ea as buildBrowseRequest,
  Lc as buildDerivationRuleGraph,
  ec as buildDiscoverySearchParams,
  Is as buildMinuteTimelineTicks,
  Oc as buildPerformerSlotOverview,
  El as buildSegmentQuickSearchEntries,
  dd as buildSegmentRailRows,
  cd as buildTimelineRows,
  iu as buildTimelineTicks,
  As as calculateCenteredTimelineScroll,
  Yr as calculateEditorPanelMaximum,
  Cs as calculateMinuteLabelStride,
  su as calculateMinuteTimelineWidth,
  Es as calculateSwimlaneTitleMaximum,
  Rs as calculateTimelinePlayheadPosition,
  so as calculateTimelineRatioBounds,
  Os as calculateTimelineRatioFromPointer,
  lu as calculateVerticalRevealOffset,
  nn as clampEditorPanelWidth,
  br as clampSwimlaneTitleWidth,
  za as clampTimelineRatio,
  lo as clampTimelineRatioForHeight,
  Sr as clampTimelineZoom,
  Yd as compactProvenanceSummary,
  Ec as createBulkAnalysisCoordinator,
  Ls as createEditorReloader,
  sl as createQueuedReviewRequest,
  Td as createSaveQueue,
  xa as createSegmentAnalysisRequestScope,
  ku as default,
  Dd as discardPendingChange,
  Gl as downloadFileNameFromContentDisposition,
  Us as dualRangeValueFromPointer,
  Yo as duplicateIdentityFromResponse,
  cl as duplicateOperationKey,
  _a as editorVisibilityIncludingSegment,
  gd as expandedSwimlanes,
  kl as extensionOwnedSegmentsModeSwitchPrompt,
  hd as feedbackFrameTimestamps,
  xd as feedbackResultMatchesAction,
  vd as feedbackSelectionPlan,
  Bs as filterDerivedSegments,
  zr as filterEditorSegments,
  Pc as filterPerformerSlotOverview,
  Ml as filterSegmentQuickSearch,
  gu as filterSegmentStudioShortcuts,
  yd as findAdjacentSegmentGroupKey,
  yl as findAdjacentShot,
  ol as findEditorShortcut,
  Ka as findInitialSegmentSelection,
  Ns as findNearestSegmentInCurrentSwimlane,
  fl as findPublishedSelectionIdentity,
  Ve as findSegmentByStableIdentity,
  Ps as findSegmentFromPlayhead,
  ws as findSegmentNearPlayhead,
  fd as findSwimlaneRangeSelection,
  to as findSwimlaneSelection,
  Al as findUniquePerformerSlotAssignment,
  xr as findUnreviewedSelection,
  Zl as focusDialogDefaultButton,
  Cr as formatGenderHint,
  bl as frameStepSeconds,
  ti as generatePerformerSlotAssignmentRecommendations,
  mc as groupApprovedDraftsForPublishing,
  Rl as groupAutoAssignCandidates,
  Sd as groupIncorrectExamplesByTag,
  bc as groupMaterializationOutputs,
  rn as groupSegmentsIntoSwimlanes,
  ud as groupSelectedSwimlanes,
  yo as groupSwimlanesBySegmentGroup,
  Ct as handleModalKey,
  hn as hasSegmentStudioCapability,
  Si as heldTagChangeFor,
  pl as heldTagReady,
  da as hideCollectedFeedbackSegments,
  Xl as historyActionsForTarget,
  gr as incorrectExampleHistoryState,
  mi as indexPerformerSlotsBySegment,
  yu as initialReviewFilter,
  Nd as insertSegmentProjection,
  ur as isCurrentEditorRequest,
  Jl as isEditableTarget,
  hu as isEditorShortcutOwner,
  $d as isKindRunning,
  Su as isSaveQueueBusy,
  Yc as isSegmentStudioBinRoute,
  Jc as isSegmentStudioSegmentsRoute,
  Vc as isSegmentStudioSettingsRoute,
  Fc as layoutDerivationRuleComponent,
  jc as layoutDerivationRuleComponents,
  Cd as mergeSegmentsProjection,
  nd as multiSelectionActionHint,
  Js as nextSegmentAfterRemoval,
  Ys as nextUnreviewedAfterRemoval,
  Jt as normalizeCollapsedSegmentGroups,
  ha as normalizeDiscoveryIds,
  At as normalizeEditorSegmentFilters,
  Wt as normalizeGender,
  Qo as normalizeReviewFilter,
  Za as normalizeSegmentStudioFeatureProfile,
  pu as normalizeSegmentStudioMode,
  Xr as normalizeSegmentStudioPublicMode,
  yn as parseBrowseSlotFilters,
  Ds as parseEditorLayout,
  Fs as parseHideDerivedSegmentsPreference,
  js as parseMergeConfirmationPreference,
  Ya as parsePlaybackShortcutConfig,
  nl as parseShortcutBindingOverrides,
  Wr as patchPerformerSlotProjection,
  ma as patchSegmentProjection,
  Fd as pendingChangesReducer,
  Ed as pendingInsertedSegments,
  Qs as percentageSeekTime,
  Tl as performInitialSegmentSeek,
  it as performerOptionId,
  wr as performerSlotHistoryState,
  wt as performerSlotLabel,
  ad as performerSlotPresentation,
  xu as performerSlotStatus,
  fo as performerSlotStatusFromSegmentSlots,
  ui as performerSlotsForSegment,
  Lt as provenanceSourceLabel,
  wi as prunePendingChanges,
  gl as queueCreatedSegmentTagChoice,
  ni as rankPerformerOptions,
  bd as reconcileSegmentGroupKey,
  Ws as reconcileSelectedSegmentIds,
  oc as recyclingBinActionText,
  Kl as recyclingBinDeletionPrompt,
  ii as recyclingBinDeletionSummary,
  wl as recyclingBinModeSwitchPrompt,
  fu as removeQueuedReviewsForSegments,
  Id as removeSegmentsProjection,
  na as requestedOwnedItemId,
  $l as requestedSegmentId,
  zs as resolveEditorSegmentSelection,
  ll as resolveQueuedReviewRequest,
  ul as resolveSegmentCreationAction,
  Sl as resolveSegmentStudioRoute,
  rl as resolveSegmentStudioShortcuts,
  vi as resolveSegmentTarget,
  Bc as resolveSelectedDerivationRule,
  Wo as resolveSelectedSegments,
  Sc as restoreDisabledToolbarActionFocus,
  Ac as restorePublishApprovedFocus,
  no as restoreSegmentFieldsProjection,
  bi as restoreSegmentsProjection,
  Pd as retargetPendingChanges,
  yi as revealCollapsedSegmentGroup,
  Dc as runSelectedDiscoveryAnalysis,
  vn as sameSegmentIdentity,
  xi as savingSegmentIdFrom,
  li as segmentBadgeStyle,
  Ir as segmentGroupHeaderBackground,
  Ot as segmentGroupKeyForSegment,
  po as segmentHistoryIdentity,
  mr as segmentHistoryState,
  on as segmentIdentity,
  di as segmentRailItemStyle,
  bu as segmentStateStyle,
  Xc as segmentStudioActionTarget,
  hl as segmentStudioLegacyMode,
  zl as segmentTimelineStyle,
  Tt as segmentsHistoryState,
  Vs as selectAllVideoSegmentIds,
  Nl as selectedBrowseStates,
  pi as selectedSwimlaneMerge,
  Ni as setBackLinkNavigation,
  Od as settlePendingChange,
  ed as sharedPerformerSlotShape,
  td as sharedTagPerformerSlotShape,
  bn as shortcutAvailableInMode,
  al as shortcutBindingDisplayText,
  du as shortcutBindingFromEvent,
  uu as shortcutBindingsOverlap,
  mu as shortcutModesOverlap,
  tl as shortcutRequiresSingleSegment,
  zn as shotBoundaryFingerprint,
  Ql as shouldAcceptCurrentTagFromEnter,
  cu as shouldExitShortcutCapture,
  vu as shouldHandleEditorShortcut,
  va as shouldLoadSegmentAnalysis,
  pa as shouldReloadAfterSegmentMutation,
  Zr as shouldRestoreTransitionSelection,
  Dl as shouldShowQuickSearchGroups,
  Vo as splitShortcutCategoriesIntoColumns,
  rd as suggestDerivationRuleSlotMappings,
  Wn as swimlaneDisplayLabel,
  Vl as swimlaneMarkerTop,
  _l as swimlaneStripeBackground,
  ml as tagEditorLockedBySave,
  hi as targetsOverlap,
  Ms as timelineContentStyle,
  Ho as timelinePlayheadHorizontalStyle,
  ql as timelineSegmentWidth,
  $s as timelineTickAlignment,
  Ts as timelineTickPosition,
  Jr as timelineTimePercent,
  pd as toggleAllCollapsedSegmentGroups,
  il as toggledSelectionReviewState,
  Bt as trapModalFocus,
  Fl as tryParseJsonResponseText,
  _s as updateAnchoredSegmentSelection,
  tc as updateDiscoverySelection,
  Ks as updateDualRangeValues,
  Hs as updateSegmentCollectionSelection,
  qs as updateSegmentRangeSelection,
  Wa as updateSegmentSelection,
  wa as validateDerivationRuleDraft,
  zo as validateSegmentTiming,
  co as videoPerformerOptions,
  _r as videoPerformerSlotAssignments,
  xl as visibleSegmentStudioSettingsTabs,
  vl as visibleSegmentStudioTabs,
  gi as visibleVirtualRows
};
