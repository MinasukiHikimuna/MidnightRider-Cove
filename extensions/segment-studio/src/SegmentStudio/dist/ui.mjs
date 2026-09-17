import ao from "@cove/runtime/react";
import { createPortal as xs } from "@cove/runtime/react-dom";
import { extensionFetch as Ma } from "@cove/runtime/api";
import { formatDuration as Ss, EntityReferenceSelector as Wn, useExtensionKeyboardBindings as ks, VideoPlayer as Ea, useRegisterExtensionKeyboardActions as Da, getDefaultFilter as Pa, useListUrlState as Oa, ListPage as La } from "@cove/runtime/components";
import { ChevronDown as Fa, StepBack as ws, StepForward as Ns, Loader2 as Is } from "@cove/runtime/lucide-react";
const io = "com.midnightrider.segment-studio", ja = "segment-studio.layout.v1", un = "segment-studio.operations.v1", Ba = "segment-studio.collapsed-segment-groups.v1", Ga = "segment-studio.playback-shortcuts.v1", Ua = "segment-studio.timing-clipboard.v1", Ka = "segment-studio.hide-derived-segments.v1", za = "segment-studio.merge-confirmation.v1", kt = ["unreviewed", "approved", "rejected"], Cs = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], Ko = "(min-width: 1024px) and (min-height: 640px)", zo = "(min-width: 1024px) and (min-height: 900px)", Vn = 1e-3, Ho = 15, $s = 30, Ha = 12, It = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, so = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30
}, Vt = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function qo(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function qa(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? vr(e, null, 1, !0) ?? r[0] ?? null;
}
function vr(e, t, r, o = !1) {
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
function Ts(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((g, u) => g.markers.filter(({ segment: f }) => {
    const m = Number(f.startSec), p = f.endSec == null ? m + $s : Number(f.endSec);
    return Number.isFinite(m) && Number.isFinite(p) && p >= m && m <= i + Ho + Vn && p >= i - Ho - Vn;
  }).map(({ segment: f }) => ({ segment: f, laneIndex: u }))).sort((g, u) => g.laneIndex - u.laneIndex || Math.abs(g.segment.startSec - i) - Math.abs(u.segment.startSec - i) || g.segment.id - u.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((g) => g.markers.some((u) => u.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((g) => g.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((g) => g.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((g) => g.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function As(e, t, r) {
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
function xr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function cu(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function Rs(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function uu(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function Ms(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function Es(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Ds(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function Ps(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Qr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function Os(e, t, r = 10) {
  const o = Qr(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function _o(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function Ls(e, t = Ha) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function _a(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : It.timelineRatio;
}
function Zr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function dn(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? It.detailWidth : Math.min(Zr(t, 0), Math.max(240, e));
}
function yr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? It.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function Fs(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function lo(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: It.timelineRatio, maximum: It.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function co(e, t) {
  const r = _a(e);
  if (!(t > 0)) return r;
  const o = lo(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function js(e) {
  if (!e) return { ...It };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? _a(r) : It.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: dn(t == null ? void 0 : t.detailWidth),
      markerRailWidth: dn(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: yr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...It };
  }
}
function Bs(e, t, r) {
  return r > 0 ? co((t + r - e) / r, r) : It.timelineRatio;
}
function mu(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function Gs(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, g) => c.startSec - g.startSec || c.id - g.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= Vn ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function cr(e, t, r, o) {
  return e === t && r === o;
}
function Us({ beginRequest: e, fetchDetail: t, isCurrent: r, isSameVideo: o }) {
  let i = null, a = null;
  return function({ onLoaded: l, onError: d }) {
    const c = e(), g = (async () => {
      try {
        const u = await t(c);
        if (r(c))
          return l(u), u;
      } catch (u) {
        if (r(c))
          return d(u), null;
      }
      return o(c) && i !== g && a.videoId === c.videoId ? i : null;
    })();
    return i = g, a = c, g;
  };
}
const Sr = "__segment-studio-cleared-selection__";
function Ks(e) {
  return e === "true";
}
function zs(e) {
  return e !== "false";
}
function Wa() {
  try {
    return zs(window.localStorage.getItem(za));
  } catch {
    return !0;
  }
}
function Va(e) {
  try {
    window.localStorage.setItem(za, String(!!e));
  } catch {
  }
}
function Hs(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function Et(e = {}) {
  const t = kt.filter((g) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(g) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (g, u) => {
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
function qr(e, t, r, o = !1, i = []) {
  var c, g;
  const a = Et(r), s = a.performerId == null ? null : new Set((t || []).filter((u) => Number(u.performerId) === a.performerId).map((u) => u.segmentId)), l = new Set((i || []).flatMap((u) => u.tags || []).map((u) => Number(u.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((g = (c = (i || []).find((u) => Number(u.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : g.map((u) => Number(u.tagId))) || []);
  return Hs(e || [], o).filter((u) => {
    if (u.reviewState != null && !a.reviewStates.includes(u.reviewState) || s && !s.has(u.id) || a.tagId != null && Number(u.tagId) !== a.tagId || d && !d.has(Number(u.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(u.tagId)) || a.sourceKey != null && u.sourceKey !== a.sourceKey) return !1;
    const f = Number(u.confidence);
    return u.confidence == null || !Number.isFinite(f) ? a.includeUnscored : f >= a.confidenceMin && f <= a.confidenceMax;
  });
}
function Ja(e, t, r, o = !1, i = []) {
  var l;
  const a = Et(r);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = Et({
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
    filters: Et(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function qs(e, t = !1) {
  const r = Et(e);
  return +(r.reviewStates.length !== kt.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function _s(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function Ws(e, t, r, o) {
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
function Vs(e, t, r = null) {
  return t === Sr ? null : qa(
    e,
    t ?? r
  );
}
function Ya(e, t, r, o = !1) {
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
function Js(e, t, r) {
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
function Ys(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return Ya(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function Qs(e, t, r = null, o = !1) {
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
      ...Ys(u, s, t, g, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: u
    };
  }
  const d = Ya(i, a, t, o);
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
function Zs(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function Xs(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function Wo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function Vo(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => Wo(t, o) - Wo(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function el(e, t, r) {
  var c, g;
  const o = e || [], i = new Set(t || []), a = o.findIndex((u) => (u.markers || []).some(({ segment: f }) => f.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: u }) => u.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const u of o) {
      const f = (u.markers || []).find(({ segment: m }) => !i.has(m.id));
      if (f) return f.segment;
    }
    return null;
  }
  const l = Vo(
    o[a].markers,
    s,
    i
  );
  if (l) return l;
  const d = (g = o.map((u, f) => ({ lane: u, index: f })).filter(({ lane: u }) => (u.markers || []).some(({ segment: f }) => !i.has(f.id))).sort((u, f) => Math.abs(u.index - a) - Math.abs(f.index - a) || +(u.index < a) - +(f.index < a) || u.index - f.index)[0]) == null ? void 0 : g.lane;
  return Vo(d == null ? void 0 : d.markers, s, i);
}
function tl(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function nl(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function Jo(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function rl() {
  try {
    return Ks(window.localStorage.getItem(Ka));
  } catch {
    return !1;
  }
}
function ol(e) {
  try {
    window.localStorage.setItem(Ka, String(!!e));
  } catch {
  }
}
const Qn = [
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
], al = /* @__PURE__ */ new Set([
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
function il(e) {
  return al.has(e);
}
function Qa(e) {
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
function sl(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Qn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(Qa).filter(Boolean)]));
  } catch {
    return {};
  }
}
function ll(e = {}) {
  const t = sl(e);
  return Qn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function Yo(e, t = 2) {
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
function gu(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : Qa({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function pu(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function Xr(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function Qo(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function fu(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = Qo(e.code, t.key), a = Qo(t.code, e.key);
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
          if (Xr(f, e) && Xr(f, t)) return !0;
        }
  return !1;
}
function Rn(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function yu(e, t) {
  return [!1, !0].some((r) => Rn(e, r) && Rn(t, r));
}
function dl(e, t = !1, r = {}) {
  return ll(r).find((o) => Rn(o, t) && o.bindings.some((i) => Xr(e, i))) || null;
}
function Za(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function cl(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Za).join(" / ") : "Unassigned";
}
function bu(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, cl(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function hu(e) {
  return e === "review" ? "review" : "editor";
}
function Ye(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function ul(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function ml(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function gl(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => Ye(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: Ye(t, e.activeIdentity) || r[0]
  };
}
function pl(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function vu(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => pl(o, i))));
}
function Zo(e, t) {
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
function fl(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function yl(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function bl(e, t, r) {
  return e != null && (r == null || t !== r);
}
function hl(e, t, r, o = null) {
  if (r === t.tagId) return null;
  const i = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: r,
    tagName: o || ((i == null ? void 0 : i.tagId) === r ? i.tagName : null)
  };
}
function vl({ tagEditing: e, selectedSegmentIds: t, activeSegmentId: r }, o) {
  return !(e && r === o && (t == null ? void 0 : t.length) === 1 && t[0] === o);
}
function eo(e, t) {
  return e === t;
}
function xl(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function Sl(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - Vn).at(-1) || null : o.find((i) => i.startSec > t + Vn) || null;
}
function qn(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function Xo(e) {
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
function xu(e, t = null, r = !1) {
  const o = Xo(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function Tn(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function Xa(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: Tn(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: Tn(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: Tn(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(Tn(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(Tn(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(Tn(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...so };
  }
}
function kl(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function ei() {
  try {
    return Xa(window.localStorage.getItem(Ga));
  } catch {
    return { ...so };
  }
}
function ea(e) {
  const t = Xa(JSON.stringify(e));
  try {
    window.localStorage.setItem(Ga, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Jt = Object.freeze({
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
function to(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function ti(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? to(e.requestedMode) : "basic",
    effectiveMode: i ? to(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function Mn(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function wl(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Nl(e) {
  const t = [];
  return Mn(e, Jt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), Mn(e, Jt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function Il(e) {
  return [
    ["general", "General", Jt.settingsGeneral],
    ["shortcuts", "Shortcuts", Jt.settingsShortcuts],
    ["performer-slots", "Performer slots", Jt.settingsPerformerSlots],
    ["derivation", "Derivation", Jt.settingsDerivation]
  ].filter(([, , r]) => Mn(e, r)).map(([r, o]) => [r, o]);
}
function Cl(e, t) {
  return e === "segments" && !Mn(
    t,
    Jt.navigationSegmentInventory
  ) || e === "bin" && !Mn(
    t,
    Jt.recyclingBinView
  ) ? "videos" : e;
}
function $l(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Tl(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const _r = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, ta = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: kt.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function Al(e) {
  const t = String(e || "").split(",").filter((r) => kt.includes(r));
  return t.length === 0 ? [...kt] : [...new Set(t)];
}
function An(e) {
  return ni(e).values;
}
function ni(e) {
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
function na(e, t) {
  var l;
  const r = ra(t.activitiesCriterion, t.activityId), o = ra(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = ni(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: Rl(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function ra(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function Rl(e, t) {
  return kt.includes(e == null ? void 0 : e.value) ? [e.value] : Al(t);
}
function ri(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Ml(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function El(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function oa(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Dl(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function st(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function uo(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Vr(e, t) {
  const r = new Set(uo(t).map((o) => String(st(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function Xt(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function aa(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(Xt).sort().join(",")}`;
}
function oi(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((m) => String(m.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((m) => {
    var p;
    return !((p = m.genderHints) != null && p.length);
  }) && e.length === t.length && !i) {
    const m = [...e].sort((y, h) => String(y.slotDefinitionId).localeCompare(String(h.slotDefinitionId))), p = [...t].sort((y, h) => String(y.name).localeCompare(String(h.name)) || Number(st(y)) - Number(st(h)));
    return [{
      assignments: Object.fromEntries(m.map((y, h) => [String(y.slotDefinitionId), String(st(p[h]))])),
      description: p.map((y) => y.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((m) => t.map((p, y) => ({ performer: p, index: y })).filter(({ performer: p }) => {
    var y;
    return !((y = m.genderHints) != null && y.length) || m.genderHints.some((h) => Xt(h) === Xt(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), g = i ? c.filter((m) => m.length > 0).length : ia(c, t.length);
  if (g === 0) return [];
  const u = new Map(t.map((m, p) => [String(st(m)), p]));
  function f(m, p, y) {
    if (s.length >= a) return;
    const h = c.slice(m), C = i ? h.filter((K) => K.length > 0).length : ia(h.map((K) => K.filter((W) => !p.has(String(st(t[W]))))), t.length);
    if (y + C < g) return;
    if (m === e.length) {
      if (y !== g) return;
      const K = Object.fromEntries(d.map(({ slot: O, performer: k }) => [String(O.slotDefinitionId), k ? String(st(k)) : ""])), W = o.length === 0 ? Object.values(K).sort().join(",") : [...new Set(e.map((O) => String(O.label || "")))].map((O) => `${O}:${d.filter(({ slot: k }) => String(k.label || "") === O).map(({ performer: k }) => k ? String(st(k)) : "").sort().join(",")}`).join("|");
      !l.has(W) && s.length < a && (l.add(W), s.push({
        assignments: K,
        description: d.map(({ slot: O, performer: k }) => o.length ? `${O.label}: ${(k == null ? void 0 : k.name) || "Unassigned"}` : (k == null ? void 0 : k.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const x = e[m], z = [...d].reverse().find(({ slot: K }) => aa(K) === aa(x)), j = z ? u.get(String(st(z.performer))) : -1;
    for (const K of c[m]) {
      const W = t[K], O = st(W);
      if (!(K < j) && !(O == null || !i && p.has(String(O))) && (d.push({ slot: x, performer: W }), i || p.add(String(O)), f(m + 1, p, y + 1), i || p.delete(String(O)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: x, performer: null }), f(m + 1, p, y), d.pop();
  }
  return f(0, /* @__PURE__ */ new Set(), 0), s;
}
function ia(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Pl(e, t) {
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
      !o && d.has(u.performerId) || (g = c.genderHints) != null && g.length && !c.genderHints.some((f) => Xt(f) === Xt(u.gender)) || (a.push({ slot: c, performer: u }), o || d.add(u.performerId), s(l + 1, d), o || d.delete(u.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Ol(e) {
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
function Ll(e, t, r = 20) {
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
function Fl(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function jl(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function ai(e, t, r) {
  const o = st, i = new Set((t || []).map(o)), a = new Set((r || []).map(Xt));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const u = Xt(l.gender || l.genderIdentity), f = Xt(d.gender || d.genderIdentity), m = l.matchesGenderHint ?? a.has(u);
    return (d.matchesGenderHint ?? a.has(f)) - m || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: ye, useId: ii, useLayoutEffect: sa, useMemo: He, useReducer: Bl, useRef: fe, useState: B, useSyncExternalStore: Gl } = ao, n = ao.createElement, si = "/api/plugins/segment-studio";
function Ke(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(un) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = no();
    return t[e] = r, window.localStorage.setItem(un, JSON.stringify(t)), r;
  } catch {
    return no();
  }
}
function ze(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(un) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(un, JSON.stringify(t));
  } catch {
  }
}
function mo(e) {
  try {
    return JSON.parse(window.localStorage.getItem(un) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function go(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(un) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(un, JSON.stringify(t));
  } catch {
  }
}
function Ul(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function Kl(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function Z(e, t, r = 0) {
  var d;
  const o = await Ma(`${si}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Ul(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await Kl(250 * (r + 1), t == null ? void 0 : t.signal), Z(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function zl(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${si}${e}`, o = await Ma(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: Hl(
      o.headers.get("Content-Disposition")
    )
  };
}
function Hl(e, t = "segment-studio-ai-feedback.zip") {
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
function no() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function li(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function ql(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function di(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function _l(e, t) {
  const { sceneCount: r, segmentCount: o } = di(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function ci(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = di(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(_l(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await Z("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Ke(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return ze(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function la({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const Bt = {
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
function Su(e, t) {
  return {
    ...(Bt[e] || Bt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function ui(e) {
  return { ...(Bt[e] || Bt.unreviewed).badge };
}
function mi(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const gi = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function Wl(e, t, r = "not-applicable", o = !1) {
  const i = Bt[e] || Bt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Vl(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Jl(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function Yl(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function Ql(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function Nr(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function Zl(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function mn({ state: e, includeLabel: t = !0 }) {
  const r = Bt[e] || Bt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: ui(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function Xl(e, t = null) {
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
function ku(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function ed(e, t = document) {
  return !(e.defaultPrevented || Xl(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function wu(e, t = document, r = !1, o = {}) {
  return ed(e, t) ? dl(e, r, o) != null : !1;
}
function td(e, t, r = null) {
  return !(!t || e instanceof Element && (t.contains(e) || r != null && r.contains(e)));
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
function nd(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function rd({ confirm: e, cancel: t, confirmReady: r }) {
  const o = r && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function po({ confirmRef: e, cancelRef: t, confirmReady: r }) {
  ye(() => {
    const o = requestAnimationFrame(() => rd({
      confirm: e.current,
      cancel: t == null ? void 0 : t.current,
      confirmReady: r
    }));
    return () => cancelAnimationFrame(o);
  }, [r]);
}
function _t(e) {
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
function da(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? i.filter((a) => a.sequence > o && a.sequence <= r).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > r && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function fo(e, t = !0) {
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
function ur(e, t = !0) {
  return {
    type: "segment",
    identity: fo(e, t),
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
      identity: fo(r, t),
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
function mr(e, t) {
  return {
    type: "incorrectExamples",
    collected: t,
    entries: (e || []).map(({ segment: r, result: o, example: i }) => ({
      exampleId: (o == null ? void 0 : o.exampleId) ?? (i == null ? void 0 : i.id) ?? null,
      originalIdentity: fo(r),
      collectedIdentity: {
        itemId: (o == null ? void 0 : o.itemId) ?? (i == null ? void 0 : i.itemId) ?? null,
        nativeSegmentId: (o == null ? void 0 : o.nativeSegmentId) ?? null,
        published: (o == null ? void 0 : o.nativeSegmentId) != null,
        revision: (o == null ? void 0 : o.revision) ?? null
      }
    }))
  };
}
function kr(e) {
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
function pi(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function fi(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = t.get(r.segmentId);
    o ? o.push(r) : t.set(r.segmentId, [r]);
  }
  for (const r of t.values())
    r.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function yo(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function od(e, t) {
  const r = (t || []).map((i) => pi(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: wt(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function ad(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : od(e, t);
}
function id({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function Nu(e, t) {
  return yo(pi(e, t));
}
function wt(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function sd(e, t) {
  const r = (d) => wt(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
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
function ld(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = sd(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function dd(e) {
  const t = wt(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(Ir).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function Ir(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function wr(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function ca(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((g) => g.end <= s && g.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: wr(o),
    trackCount: Math.max(1, t.length)
  };
}
function cd(e) {
  const t = e.map(wt), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function ud(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], g = d.length > 0 && d.every((u) => Number(u.performerId) > 0) ? d.map((u) => `${u.slotDefinitionId}:${Number(u.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: g };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [ca({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = cd(l.slots), g = l.slots.filter((y) => !a.has(String(y.slotDefinitionId))), u = o.length === 1 ? l.slots : g, f = u.map((y) => `${c.get(String(y.slotDefinitionId))} · ${y.performerName || `Performer ${y.performerId}`}`).join(" · "), m = [...new Map(u.map((y) => [
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
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(ca);
}
function cn(e, t = [], r = []) {
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => ud(s, a));
}
function bo(e) {
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
const md = {
  group: 38,
  lane: 33,
  segment: 41
};
function gd(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = md[s.kind];
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
function yi(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function pd(e, t = [], r = !0) {
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
function fd(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: wr(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return bo(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: wr(a)
    };
  });
}
function bi(e, { nativeOnly: t = !1 } = {}) {
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
function ua(e, t) {
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
function tn(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function Jn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function yd(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var r;
    return (r = t[0]) == null ? void 0 : r.toUpperCase();
  }).join("") || "?";
}
function Yn({ performer: e, compact: t = !1, tooltip: r = null }) {
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
    }, o ? yd(e.name) : "—"),
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
function hi({ assignments: e, className: t = "" }) {
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
      n(Yn, {
        key: `${r.key}:avatar`,
        performer: r.performer
      })
    ];
  }));
}
function Cr({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = fe(null), i = `performer-slots-${ii()}`, [a, s] = B(null);
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
    ...e.slice(0, 3).map((c) => n(Yn, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? xs(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(hi, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : n("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => n(Yn, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function bd(e, t) {
  const r = new Set(tn(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function vi(e, t) {
  return t ? tn(e).filter((r) => r !== t) : tn(e);
}
function hd(e, t) {
  const r = tn(t), o = new Set(tn(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function jt(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function ma(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), g = Number.isFinite(c) && c >= d ? c : d, u = d <= o && g >= o, f = u ? 0 : Math.min(Math.abs(o - d), Math.abs(o - g));
    return { contains: u, distance: f, duration: g - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function ro(e, t, r, o = null) {
  var g, u, f, m, p, y;
  const i = e.findIndex((h) => h.markers.some((C) => C.segment.id === t));
  if (i < 0) {
    const h = [...((g = e[0]) == null ? void 0 : g.markers) || []];
    return o != null && Number.isFinite(Number(o)) && h.sort((C, x) => ma(C, x, o)), ((u = h[0]) == null ? void 0 : u.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((h) => h.segment.id === t);
  if (r === "left" || r === "right") {
    const h = r === "left" ? -1 : 1, C = Math.min(a.markers.length - 1, Math.max(0, s + h));
    return ((f = a.markers[C]) == null ? void 0 : f.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((m = a.markers[s]) == null ? void 0 : m.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((p = a.markers[s]) == null ? void 0 : p.segment) ?? null : ((y = [...e[l].markers].sort(c ? (h, C) => ma(h, C, Number(o)) : (h, C) => Math.abs(h.segment.startSec - d) - Math.abs(C.segment.startSec - d) || h.segment.startSec - C.segment.startSec || h.segment.id - C.segment.id)[0]) == null ? void 0 : y.segment) ?? null;
}
function vd(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = ro([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function xd(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function Sd(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function kd(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [fa(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => fa(Math.min(s, r + l))))];
}
function wd(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function Nd(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function br(e, t) {
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
function ga(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function Id(e) {
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
async function Cd(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await pa(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], g = kd(
        d.startSec,
        d.endSec
      );
      for (const [u, f] of g.entries()) {
        Math.abs(r.currentTime - f) > 5e-4 && (r.currentTime = f, await pa(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const m = await $d(o), p = `example-${l + 1}-frame-${u + 1}`;
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
function pa(e, t) {
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
function $d(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function fa(e) {
  return Math.round(e * 1e3) / 1e3;
}
function Iu(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Td(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function Ad(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function Cu(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function $u(e, t) {
  const r = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...r.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Jr(e, t, r, o) {
  const i = (r || []).map((d) => ({ ...d, segmentId: t })), a = e.performerSlots || [], s = a.findIndex((d) => d.segmentId === t), l = a.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...i), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function Rd(e, t) {
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
function En(e, t) {
  return !e || !t ? !1 : e.itemId != null && e.itemId === t.itemId || e.nativeSegmentId != null && e.nativeSegmentId === t.nativeSegmentId ? !0 : e.id != null && e.id === t.id;
}
function ho(e, t) {
  return (e || []).some((r) => (t || []).some((o) => En(r, o)));
}
function qt(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function xi(e, t) {
  return (e || []).find((r) => En(t, r)) || null;
}
function Si(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Md(e, t) {
  var r;
  return ((r = e.running) == null ? void 0 : r.kind) === t;
}
function Tu(e) {
  return e.running != null || e.queued.length > 0;
}
const ya = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
function gr(e) {
  return Object.freeze({
    id: e.id,
    kind: e.kind,
    lockId: e.lockId,
    targets: e.targets,
    exclusive: e.exclusive,
    meta: e.meta
  });
}
function Ed({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let r = 1, o = null, i = [], a = null, s = !1, l = 0, d = 0;
  const c = () => !t && d < l, g = /* @__PURE__ */ new Map();
  let u = ya;
  const f = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Set();
  let p = [];
  function y() {
    u = o == null && i.length === 0 && a == null ? ya : Object.freeze({
      running: o ? gr(o) : null,
      queued: Object.freeze(i.map(gr)),
      lastFailure: a
    });
    for (const w of [...m]) w();
    if (o == null && i.length === 0) {
      const w = p;
      p = [];
      for (const T of w) T();
    }
  }
  function h(w, T) {
    f.set(w.id, T.status), w.resolve(T);
  }
  function C(w) {
    if (w.dependsOn == null) return "met";
    const T = f.get(w.dependsOn);
    return T === "fulfilled" ? "met" : T != null ? "failed" : "pending";
  }
  function x(w) {
    o = w;
    const T = { ...e(), taskId: w.id, targets: w.targets };
    T.resolveTargets = () => w.targets.map((E) => xi(T.segments, E)).filter(Boolean), y();
    let _;
    try {
      _ = w.run(T);
    } catch (E) {
      _ = Promise.reject(E);
    }
    Promise.resolve(_).then(
      (E) => z(w, { status: "fulfilled", value: E }),
      (E) => z(w, { status: "rejected", error: E })
    );
  }
  function z(w, T) {
    w.settled || (w.settled = !0, h(w, T), !s && (o = null, T.status === "rejected" && (a = Object.freeze({ id: w.id, kind: w.kind, error: T.error })), y(), l += 1, t && j()));
  }
  function j() {
    if (s || o != null || c()) return;
    let w = !1;
    for (let T = 0; T < i.length; T += 1) {
      const _ = i[T], E = C(_);
      if (E === "failed") {
        i = i.filter((R) => R !== _), h(_, { status: "dropped", reason: "dependency-failed" }), w = !0, T -= 1;
        continue;
      }
      if (E !== "pending" && !(_.exclusive && T > 0) && !i.slice(0, T).some((R) => ho(R.targets, _.targets)) && !(_.ready && !_.ready(e(), gr(_)))) {
        i = i.filter((R) => R !== _), x(_);
        return;
      }
    }
    w && y();
  }
  function K(w) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((D) => D.exclusive) || o != null && w.whenBusy !== "enqueue" || w.exclusive && (o != null || i.length > 0 || c())) return null;
    let _;
    const E = new Promise((D) => {
      _ = D;
    }), R = {
      id: r++,
      kind: w.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: w.lockId ?? -1,
      targets: Object.freeze((w.targets || []).map(O)),
      exclusive: w.exclusive === !0,
      dependsOn: w.dependsOn ?? null,
      ready: w.ready || null,
      meta: w.meta ?? null,
      run: w.run,
      resolve: _
    };
    return i = [...i, R], y(), j(), { id: R.id, done: E };
  }
  function W(w = {}) {
    let T = null;
    const _ = K({
      ...w,
      whenBusy: "reject",
      run: () => new Promise((R) => {
        T = R;
      })
    });
    if (!_) return null;
    if (T == null)
      return A((R) => R.id === _.id), null;
    let E = !1;
    return () => {
      E || (E = !0, T(), (o == null ? void 0 : o.id) === _.id && z(o, { status: "fulfilled", value: void 0 }));
    };
  }
  function O(w) {
    return (w == null ? void 0 : w.id) == null || w.itemId != null || w.nativeSegmentId != null ? w : g.get(w.id) || w;
  }
  function k(w, T) {
    g.set(w, { ...T });
    let _ = !1;
    for (const E of i)
      E.targets.some((R) => R.id === w && R.itemId == null && R.nativeSegmentId == null) && (E.targets = Object.freeze(E.targets.map((R) => R.id === w ? { ...T } : R)), _ = !0);
    return _ && y(), _;
  }
  function A(w) {
    const T = i.filter((_) => w(gr(_)));
    if (T.length === 0) return 0;
    i = i.filter((_) => !T.includes(_));
    for (const _ of T) h(_, { status: "cancelled" });
    return y(), j(), T.length;
  }
  return {
    enqueue: K,
    acquire: W,
    cancel: A,
    retarget: k,
    stableIdentity: O,
    // The host reads `settledCount()` while rendering and reports it here once that render commits.
    settledCount: () => l,
    markCommitted(w = l) {
      d = Math.max(d, w);
    },
    poke: () => j(),
    subscribe(w) {
      return m.add(w), () => m.delete(w);
    },
    getSnapshot: () => u,
    whenIdle() {
      return o == null && i.length === 0 ? Promise.resolve() : new Promise((w) => p.push(w));
    },
    dispose() {
      if (s) return;
      const w = i;
      i = [], s = !0;
      for (const _ of w) h(_, { status: "cancelled" });
      m.clear();
      const T = p;
      p = [];
      for (const _ of T) _();
    }
  };
}
let Dd = 1;
function Yt() {
  return `pending-${Dd++}`;
}
function Pd(e) {
  return e.sort((t, r) => t.startSec - r.startSec || t.id - r.id);
}
function hr(e, t) {
  return (t || []).some((r) => En(r, e));
}
function Od(e, t) {
  return [...e || [], {
    id: t.id ?? Yt(),
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
    return ((o = r.meta) == null ? void 0 : o.kind) === "held-tag" && !r.settled && hr(t, r.targets);
  }) || null;
}
function Ld(e) {
  return (e || []).filter((t) => t.op === "insert" && !t.settled).map((t) => t.segment);
}
function wi(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function Ni(e, t) {
  const r = (e || []).filter((o) => !wi(o, t));
  return r.length === (e || []).length ? e : r;
}
function Ii(e, t) {
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
      r.some((i) => En(o.segment, i)) || r.push(o.segment);
    else if (o.op === "patch")
      r = r.map((i) => hr(i, o.targets) ? { ...i, ...o.values } : i);
    else if (o.op === "remove")
      r = r.filter((i) => !hr(i, o.targets));
    else if (o.op === "merge") {
      const [i, ...a] = o.targets;
      r = r.filter((s) => !hr(s, a)).map((s) => En(i, s) ? { ...s, ...o.values } : s);
    }
  return Pd(r);
}
function Ci(e, t) {
  if (!e || e.length === 0) return e;
  const r = [
    ...(t == null ? void 0 : t.segments) || [],
    ...e.filter((a) => a.op === "insert" && !a.settled).map((a) => a.segment)
  ];
  let o = !1;
  const i = [];
  for (const a of e) {
    if (a.op !== "insert" && !a.targets.some((s) => r.some((l) => En(s, l)))) {
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
function Bd(e, t, r) {
  return r ? Ni(e, t) : Ii(e, t);
}
function Gd(e, t) {
  switch (t.type) {
    case "confirm":
      return Bd(e, t.key, t.applied);
    case "add":
      return Od(e, t.entry);
    case "discard":
      return Ni(e, t.key);
    case "settle":
      return Ii(e, t.key);
    case "retarget":
      return Fd(e, t.temporaryId, t.identity);
    case "prune":
      return Ci(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
function ba(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function Ud(e) {
  const { acquireSaveLock: t, compatibilityMode: r, dispatchPendingChanges: o, enqueueSave: i, pendingChanges: a, retargetSaveTasks: s, currentTime: l, detail: d, editorFilters: c, endInput: g, hideDerivedSegments: u, historyRef: f, mediaDuration: m, onConflict: p, onDetailChange: y, onReload: h, optimisticSegmentIdRef: C, pendingDuplicateRef: x, pendingFirstSegmentStartSecRef: z, pendingTagEditSegmentIdRef: j, replaceSegmentSelection: K, savingSegmentId: W, segments: O, selectedSegment: k, selectedSegmentIdRef: A, selectedSegments: w, selectionAnchorIdRef: T, selectionRangeBaseIdsRef: _, setCreatingSegmentId: E, setEditorFilters: R, setFirstSegmentTagOpen: D, setHideDerivedSegments: q, setHistory: te, setHistoryOpen: pe, setPublishApprovedError: be, setSaveMessage: X, setSelectedSegmentGroupKey: F, setSelectedSegmentId: ae, setSelectedSegmentIds: ce, setTagEditing: J, startInput: he, tagEditingRef: ve, timelineDuration: re, video: le } = e;
  function me(U) {
    f.current = U || Vt, te(f.current);
  }
  async function Y(U, H, ue, N, V = null) {
    var G;
    try {
      const ee = await Z(`/videos/${le.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: f.current.revision,
          kind: U,
          label: H,
          beforeState: ue,
          afterState: N,
          receiptId: V
        })
      });
      return me(ee), !0;
    } catch (ee) {
      return ee.status === 409 && ((G = ee.payload) != null && G.current) && me(ee.payload.current), X("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function de(U, H, ue = !0, N = null, V = !1, G = H, ee = !0) {
    if (!U || W != null) return null;
    const ge = t("segment", U.id);
    if (!ge) return null;
    try {
      return await M(U, H, {
        recordHistory: ue,
        historyLabel: N,
        optimisticValues: V ? G : null,
        restoreSelectionOnFailure: ee
      });
    } finally {
      ge();
    }
  }
  async function M(U, H, {
    recordHistory: ue = !0,
    historyLabel: N = null,
    optimisticValues: V = null,
    pendingChangeId: G = null,
    restoreSelectionOnFailure: ee = !0,
    onReload: ge = h,
    onConflict: Le = p
  } = {}) {
    var pt;
    const Ie = w.map((Qe) => Qe.id), Fe = A.current, Ge = ue && !r ? crypto.randomUUID() : null;
    X(ue ? "Saving directly to Cove…" : "Restoring history…");
    const Ee = G ?? (V ? Yt() : null);
    V && !G && o({
      type: "add",
      entry: { id: Ee, op: "patch", targets: [qt(U)], values: V }
    });
    const Ve = (Qe) => {
      Ee && o({ type: "confirm", key: Ee, applied: Qe });
    };
    try {
      if (r && U.nativeSegmentId == null && U.itemId != null) {
        const rt = `draft-update:${le.id}:${U.itemId}:${U.revision}:${H.tagId}:${H.startSec}:${H.endSec ?? "open"}:${H.reviewState ?? U.reviewState}`, ct = await Z(`/videos/${le.id}/drafts/${U.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ke(rt),
            expectedRevision: U.revision,
            startSec: H.startSec,
            endSec: H.endSec,
            tagId: H.tagId,
            reviewState: H.reviewState
          })
        });
        ze(rt);
        const nt = {
          ...U,
          ...ct.draft,
          id: U.id,
          itemId: U.itemId
        };
        return ue && await Y(
          "segment.update",
          N || "Changed segment",
          ur(U, r),
          ur(
            nt,
            r
          )
        ), ba(U, H, r) ? Ve(await ge() != null) : (y((gt) => ({
          ...gt,
          approvedSetVersion: ct.approvedSetVersion || gt.approvedSetVersion,
          segments: (gt.segments || []).map((et) => et.id === U.id ? nt : et).sort((et, $t) => et.startSec - $t.startSec || et.id - $t.id)
        }), le.id), Ve(!0)), X(((pt = ct.draft) == null ? void 0 : pt.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), nt;
      }
      const Qe = await Z(`/videos/${le.id}/segments/${U.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...H,
          expectedUpdatedAt: U.updatedAt,
          historyReceiptId: Ge
        })
      }), mt = {
        ...U,
        ...Qe,
        reviewState: H.reviewState ?? U.reviewState
      };
      return ba(U, H, r) ? Ve(await ge() != null) : (y((rt) => ({
        ...rt,
        segments: (rt.segments || []).map((ct) => ct.id === U.id ? mt : ct).sort((ct, nt) => ct.startSec - nt.startSec || ct.id - nt.id)
      }), le.id), Ve(!0)), ue && await Y(
        "segment.update",
        N || "Changed segment",
        ur(U, r),
        ur(
          mt,
          r
        ),
        Ge
      ), X(ue ? "Saved to Cove" : "History restored"), mt;
    } catch (Qe) {
      return Ee && o({ type: "discard", key: Ee }), Ee && ee && (ce(Ie), ae(Fe), T.current = Fe, _.current = []), Qe.status === 409 ? (X("Conflict — loading the latest segment…"), await Le()) : X(Qe.message || "Unable to save the segment."), null;
    }
  }
  async function ne() {
    if (!r) return !1;
    const U = O.filter((N) => !N.published && N.reviewState === "approved").length;
    if (U === 0 || W != null) return !1;
    const H = `complete-review:${le.id}:${d.approvedSetVersion}`, ue = t("publish", -1);
    if (!ue) return !1;
    be(""), X(`Publishing ${U} Approved draft${U === 1 ? "" : "s"}…`);
    try {
      const N = await Z(`/videos/${le.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ke(H),
          expectedApprovedSetVersion: d.approvedSetVersion
        })
      });
      ze(H), me(Vt), pe(!1);
      const V = await h(), G = xl(
        O,
        A.current,
        N.published
      ), ee = G ? Ye(V == null ? void 0 : V.segments, G) : null;
      return ee && ae(ee.id), X(`${N.published.length} Approved draft${N.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (N) {
      const V = N.status === 409 ? "The approved drafts changed. Review the updated list and try again." : N.message || "Unable to publish the approved drafts.";
      return N.status === 409 && await p(), be(V), X(V), !1;
    } finally {
      ue();
    }
  }
  async function $(U = null, H = null) {
    if (W != null || v()) return;
    const ue = U != null ? z.current : null, N = Number.isFinite(ue) ? ue : l, V = Math.min(re, N + 20);
    if (V <= N) {
      X("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const G = yl(O, k, U);
    if (G.kind === "choose-tag") {
      z.current = N, X(""), D(!0);
      return;
    }
    if (G.kind === "invalid-selection") {
      X("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: ee } = G, ge = `create-draft:${le.id}:${ee}:${N}`, Le = r ? null : crypto.randomUUID(), Ie = A.current, Fe = {
      ...k || {},
      id: C.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: ee,
      tagName: H || (k == null ? void 0 : k.tagName) || "Tag segment",
      tagSortName: ee === (k == null ? void 0 : k.tagId) && (k == null ? void 0 : k.tagSortName) || null,
      startSec: N,
      endSec: V,
      // Full mode creates manual drafts already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, Ge = Td(d, Fe), Ee = jt(
      cn(Ge.segments, Ge.segmentGroups || [], Ge.performerSlots || []),
      Fe.id
    ), Ve = i({
      kind: "create",
      lockId: -1,
      run: (Qe) => pt(Qe)
    });
    if (!Ve) return;
    await Ve.done;
    async function pt({ onReload: Qe, taskId: mt }) {
      var ct;
      const rt = Yt();
      o({ type: "add", entry: { id: rt, taskId: mt, op: "insert", segment: Fe } }), D(!1), G.openTagEditor && (E(Fe.id), j.current = Fe.id, J(!0)), K(Fe.id), F(Ee);
      try {
        let nt;
        if (r) {
          const $t = await Z(`/videos/${le.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: Ke(ge), tagId: ee, startSec: N, endSec: V })
          });
          ze(ge), nt = { itemId: (ct = $t.draft) == null ? void 0 : ct.itemId };
        } else
          nt = { nativeSegmentId: (await Z(`/videos/${le.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: ee,
              startSec: N,
              endSec: V,
              historyReceiptId: Le
            })
          })).id };
        z.current = null, D(!1);
        const gt = await Qe();
        if (o({ type: "discard", key: rt }), !gt) {
          K(Ie), X(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${G.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const et = Ye(gt == null ? void 0 : gt.segments, nt);
        et ? (o({ type: "retarget", temporaryId: Fe.id, identity: qt(et) }), s(Fe.id, qt(et)), G.openTagEditor && (ve.current && (j.current = et.id), E(et.id)), K(et.id), F(jt(
          cn(gt.segments || [], gt.segmentGroups || [], gt.performerSlots || []),
          et.id
        )), r || await Y(
          "segment.create",
          "Created segment",
          Mt([], !1),
          Mt([et], !1),
          Le
        )) : (J(!1), X(`Segment created, but it could not be selected${G.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (nt) {
        throw o({ type: "discard", key: rt }), K(Ie), U != null && D(!0), X(nt.message || "Unable to create the draft."), nt;
      } finally {
        E(null);
      }
    }
  }
  function v() {
    return ki(a, k) ? (X("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function b() {
    if (w.length !== 1 || !k || W != null || v()) return;
    const U = l;
    if (U <= k.startSec || k.endSec != null && U >= k.endSec) {
      X("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const H = `split-draft:${k.itemId}:${k.revision}:${U}`, ue = r ? null : Mt([k], !1), N = r ? null : crypto.randomUUID(), V = t("split", k.id);
    if (V)
      try {
        let G = null;
        r && k.nativeSegmentId == null ? (await Z(`/videos/${le.id}/drafts/${k.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ke(H),
            expectedRevision: k.revision,
            splitSec: U
          })
        }), ze(H)) : G = { nativeSegmentId: (await Z(`/videos/${le.id}/segments/${k.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: k.updatedAt,
            splitSec: U,
            historyReceiptId: N
          })
        })).id };
        const ee = await h();
        if (!r) {
          const ge = [
            Ye(ee == null ? void 0 : ee.segments, {
              nativeSegmentId: k.nativeSegmentId ?? k.id
            }),
            Ye(
              ee == null ? void 0 : ee.segments,
              G
            )
          ].filter(Boolean);
          await Y(
            "segment.split",
            "Split segment",
            ue,
            Mt(ge, !1),
            N
          );
        }
        X(r ? `Segment split; both ranges remain ${k.reviewState}.` : "Segment split.");
      } catch (G) {
        G.status === 409 ? await p() : X(G.message || "Unable to split the draft.");
      } finally {
        V();
      }
  }
  async function S(U = !1) {
    var G, ee;
    if (w.length !== 1 || !k || W != null || v()) return;
    const H = U ? l : k.startSec, ue = fl(le.id, k, U, H), N = r ? null : crypto.randomUUID(), V = t("duplicate", k.id);
    if (V)
      try {
        const ge = ((G = x.current) == null ? void 0 : G.operationKey) === ue ? x.current : null;
        let Le = (ge == null ? void 0 : ge.duplicateIdentity) ?? null;
        if (Le == null && r && k.nativeSegmentId == null) {
          const Ge = await Z(`/videos/${le.id}/drafts/${k.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ke(ue),
              expectedRevision: k.revision,
              startSec: U ? H : null
            })
          });
          Le = Zo(!1, Ge), x.current = { operationKey: ue, duplicateIdentity: Le };
        } else if (Le == null) {
          const Ge = await Z(`/videos/${le.id}/segments/${k.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: k.updatedAt,
              startSec: U ? H : null,
              historyReceiptId: N
            })
          });
          Le = Zo(!0, Ge), x.current = { operationKey: ue, duplicateIdentity: Le };
        }
        const Ie = await h(), Fe = Ye(Ie == null ? void 0 : Ie.segments, Le);
        if (Fe) {
          r || await Y(
            "segment.duplicate",
            "Duplicated segment",
            Mt([], !1),
            Mt([Fe], !1),
            N
          );
          const Ge = Ja(
            Fe,
            Ie.performerSlots || [],
            c,
            u,
            Ie.segmentGroups || []
          );
          R(Ge.filters), q(Ge.hideDerivedSegments), U || (j.current = Fe.id), ce([Fe.id]), ae(Fe.id), T.current = Fe.id, _.current = [], F(jt(
            cn(Ie.segments || [], Ie.segmentGroups || [], Ie.performerSlots || []),
            Fe.id
          )), r && k.nativeSegmentId == null && ze(ue), x.current = null, X(U ? "Duplicate created at the playhead." : "Duplicate created in place.");
        } else
          X("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
      } catch (ge) {
        ((ee = x.current) == null ? void 0 : ee.operationKey) === ue ? X("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : ge.status === 409 ? await p() : X(ge.message || "Unable to duplicate the draft.");
      } finally {
        V();
      }
  }
  async function P() {
    if (w.length !== 1 || !k) return;
    const U = Number(he), H = g.trim() === "" ? null : Number(g), ue = qo(U, H, m);
    if (ue.error) {
      X(ue.error);
      return;
    }
    if (U === k.startSec && H === k.endSec) {
      X("Timing is unchanged.");
      return;
    }
    await de(k, { startSec: U, endSec: H, tagId: k.tagId }, !0, null, !0);
  }
  async function oe(U, H) {
    if (w.length !== 1 || !k) return;
    const ue = qo(U, H, m);
    if (ue.error) {
      X(ue.error);
      return;
    }
    if (U === k.startSec && H === k.endSec) {
      X("Timing is unchanged.");
      return;
    }
    await de(k, { startSec: U, endSec: H, tagId: k.tagId }, !0, null, !0);
  }
  return { acceptHistory: me, recordHistoryAction: Y, mutateSegment: de, runSegmentMutation: M, completeReview: ne, createSegment: $, splitSegment: b, duplicateSegment: S, saveTiming: P, applyShortcutTiming: oe };
}
function Kd() {
  const [e, t] = B(() => typeof window < "u" && window.matchMedia(Ko).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Ko), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function zd() {
  const [e, t] = B(() => typeof window < "u" && window.matchMedia(zo).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(zo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Hd() {
  try {
    return js(window.localStorage.getItem(ja));
  } catch {
    return { ...It };
  }
}
function qd() {
  try {
    return tn(JSON.parse(window.localStorage.getItem(Ba) || "[]"));
  } catch {
    return [];
  }
}
function _d(e) {
  try {
    window.localStorage.setItem(Ba, JSON.stringify(tn(e)));
  } catch {
  }
}
function Wd(e) {
  try {
    window.localStorage.setItem(ja, JSON.stringify(e));
  } catch {
  }
}
function Vd() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Ua) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Jd(e) {
  try {
    return window.localStorage.setItem(Ua, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Yd({ status: e }) {
  const t = gi[e];
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
function en({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, kt.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...ui(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${Bt[t].symbol}${e[t]}`)));
}
function Qd({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: g, shortcutRef: u }) {
  const f = uo(a), [m, p] = B(() => Vr(o, f)), [y, h] = B(!1), [C, x] = B(""), z = fe(!1), j = o.map((w) => `${w.slotDefinitionId}:${w.performerId || ""}`).join("|"), K = f.map((w) => st(w)).join("|"), W = oi(
    o,
    f
  );
  ye(() => {
    p(Vr(o, f)), x("");
  }, [t, r, j, K]);
  async function O(w = m) {
    if (!z.current) {
      z.current = !0, h(!0), x("Saving performer slots…");
      try {
        const T = Vr(o.map((R) => ({
          ...R,
          performerId: w[R.slotDefinitionId] || null
        })), f), _ = o.map((R) => {
          const D = T[R.slotDefinitionId] ? Number(T[R.slotDefinitionId]) : null, q = f.find((te) => String(st(te)) === String(D));
          return {
            ...R,
            performerId: D,
            performerName: (q == null ? void 0 : q.name) || null
          };
        });
        if (s(_) === !1) {
          x("");
          return;
        }
        const E = await Z(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((R) => ({ slotDefinitionId: R.slotDefinitionId, performerId: T[R.slotDefinitionId] ? Number(T[R.slotDefinitionId]) : null }))
          })
        });
        x("Performer slots saved."), await l(E, {
          beforeState: kr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: kr([{
            segmentId: t,
            itemId: r,
            revision: E.revision,
            slots: E.slots || []
          }])
        });
      } catch (T) {
        d && await d(o, T), T.status === 409 ? (x("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : x(T.message || "Unable to save performer slots.");
      } finally {
        z.current = !1, h(!1);
      }
    }
  }
  function k(w, T) {
    x(`Option ${T + 1} applied; save to confirm.`), p({ ...m, ...w.assignments });
  }
  async function A(w) {
    const T = { ...m, ...w.assignments };
    p(T), await O(T);
  }
  return ye(() => {
    if (u)
      return u.current = (w) => z.current || !W[w] ? !1 : (A(W[w]), !0), () => {
        u.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    W.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, W.map((w, T) => n("button", {
        key: T,
        type: "button",
        disabled: y,
        onClick: () => k(w, T),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${T + 1}: ${w.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, T + 1),
        n("span", { key: "description" }, w.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${W.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((w) => n("label", { key: w.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, wt(w)),
      (w.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(w.genderHints || []).map(Ir).join(" · ")}`) : null,
      n("select", { key: "select", value: m[w.slotDefinitionId] || "", disabled: y, onChange: (T) => p({ ...m, [w.slotDefinitionId]: T.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ai(f, f, w.genderHints).map((T) => n("option", { key: st(T), value: st(T) }, T.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: g, type: "button", disabled: y, onClick: () => O(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, C)])
  ]);
}
function Zd({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a, acquireSaveLock: s = () => () => {
} }) {
  var O;
  const l = ((O = t[0]) == null ? void 0 : O.slots) || [], d = uo(r), c = oi(
    l,
    d
  ), g = "__mixed__", u = () => Object.fromEntries(l.map((k, A) => {
    const w = t.map((T) => {
      var _;
      return String(((_ = T.slots[A]) == null ? void 0 : _.performerId) || "");
    });
    return [k.slotDefinitionId, w.every((T) => T === w[0]) ? w[0] : g];
  })), [f, m] = B(u), [p, y] = B(!1), [h, C] = B(""), x = fe(!1), z = t.map((k) => `${k.itemId ?? `native:${k.segmentId}`}:${k.revision}:${k.slots.map((A) => `${A.slotDefinitionId}:${A.performerId || ""}`).join(",")}`).join("|");
  ye(() => {
    m(u());
  }, [z]);
  async function j(k = f) {
    if (x.current) return;
    const A = s();
    if (!A) {
      C("Wait for the current save to finish before saving performer slots.");
      return;
    }
    x.current = !0, y(!0), C(`Saving performer slots for ${t.length} segments…`);
    const w = [];
    try {
      for (const T of t) {
        const _ = T.slots.map((R, D) => {
          const q = k[l[D].slotDefinitionId];
          return {
            slotDefinitionId: R.slotDefinitionId,
            performerId: q === g ? R.performerId || null : q ? Number(q) : null
          };
        }), E = await Z(T.itemId != null ? `/videos/${e}/drafts/${T.itemId}/slots` : `/videos/${e}/segments/${T.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: T.revision, assignments: _ })
        });
        w.push({
          segmentId: T.segmentId,
          itemId: T.itemId,
          revision: E.revision,
          slots: E.slots || []
        });
      }
      C("Performer slots saved."), await o({
        beforeState: kr(t),
        afterState: kr(w)
      });
    } catch (T) {
      const _ = await i();
      T.status === 409 ? C(_ ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : C(T.message || (_ ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      x.current = !1, y(!1), A();
    }
  }
  function K(k, A) {
    C(`Option ${A + 1} applied; save to confirm.`), m({ ...f, ...k.assignments });
  }
  async function W(k) {
    const A = { ...f, ...k.assignments };
    m(A), await j(A);
  }
  return ye(() => {
    if (a)
      return a.current = (k) => x.current || !c[k] ? !1 : (W(c[k]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, c.map((k, A) => n("button", {
        key: A,
        type: "button",
        disabled: p,
        onClick: () => K(k, A),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${A + 1} to all selected segments: ${k.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, A + 1),
        n("span", { key: "description" }, k.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${c.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, l.map((k) => n("label", {
      key: k.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, wt(k)),
      n("select", {
        key: "select",
        value: f[k.slotDefinitionId] || "",
        disabled: p,
        onChange: (A) => m({ ...f, [k.slotDefinitionId]: A.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        f[k.slotDefinitionId] === g ? n("option", { key: "mixed", value: g }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ai(d, d, k.genderHints).map((A) => n("option", {
          key: st(A),
          value: st(A)
        }, A.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: p,
        onClick: () => j(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, h)
    ])
  ]);
}
function Gt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function Xd(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return Gt(t);
  const o = [...new Set(r.map((i) => Gt(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function $r() {
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
function ec({ hidden: e }) {
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
    n($r, { key: "derived" })
  ]);
}
function tc({ segment: e, provenance: t }) {
  var g;
  const [r, o] = B(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = Xd(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
            Gt(u.sourceKey, u.sourceDisplayName)
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
function nc({
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
  const [u, f] = B([]), m = e.flatMap((C) => C.lanes.map((x) => x.key)), p = m.join("|");
  ye(() => {
    const C = new Set(m);
    f((x) => x.filter((z) => C.has(z)));
  }, [p]);
  const y = wr(t), h = !!bi(
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
      a ? n(en, { key: "counts", counts: y }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      id({ mergeable: h, reviewable: a, tagEditable: s, slotsEditable: l })
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
    ...e.map((C) => n("section", {
      key: C.key,
      "data-selected-segment-group": C.key,
      className: "space-y-1.5"
    }, [
      n("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        n("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, C.name),
        n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${C.selectedCount} selected`)
      ]),
      ...C.lanes.map((x) => {
        const z = u.includes(x.key), j = x.markers.some(({ segment: W }) => W.id === r), K = `selected-segment-lane-${x.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: x.key,
          "data-selected-segment-lane": x.key,
          className: `rounded-md border ${j ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": z,
            "aria-controls": K,
            "aria-current": j ? "true" : void 0,
            onClick: () => f((W) => z ? W.filter((O) => O !== x.key) : [...W, x.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, z ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Jn(x)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(x.selectedCount)),
            a ? n(en, { key: "states", counts: x.counts }) : null
          ]),
          z ? n("div", {
            key: "segments",
            id: K,
            className: "space-y-1 border-t border-border p-1.5"
          }, x.markers.map(({ segment: W }) => {
            const O = W.endSec == null ? Ae(W.startSec) : `${Ae(W.startSec)} – ${Ae(W.endSec)}`;
            return n("button", {
              key: W.id,
              type: "button",
              onClick: () => i(W),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${W.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${W.tagName || "Segment"}, ${W.reviewState}, ${O}` : `${W.tagName || "Segment"}, ${O}`,
              "aria-current": W.id === r ? "true" : void 0
            }, [
              a ? n(mn, {
                key: "state",
                state: W.reviewState,
                includeLabel: !1
              }) : null,
              W.isDerived ? n($r, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, O),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                Gt(W.sourceKey)
              )
            ]);
          })) : null
        ]);
      })
    ]))
  ]);
}
const zn = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"]
}, ha = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], va = [
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
function Zn(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function $i(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function xa(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function fr(e, t, r, o = null) {
  const i = xa(t), a = xa(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function rc(e, t, r = null) {
  var u, f, m;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (u = t.hasSegmentsCriterion) == null ? void 0 : u.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), fr(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), fr(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), fr(o, t.performersCriterion, "performer"), fr(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = Sa(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = Sa(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((f = t.reviewStateCriterion) == null ? void 0 : f.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const g = (m = t.shotBoundariesCriterion) == null ? void 0 : m.value;
  return r && typeof g == "boolean" ? o.set("hasShotBoundaries", String(g)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function Sa(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function oc(e, t, r, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((g) => a.add(g));
  } else a.has(r) ? a.delete(r) : a.add(r);
  return a;
}
function Ti({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(la, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, kt.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = Bt[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(la, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function Ai({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
function ac({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      onClick: (l) => Zn(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      n(Ai, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, Ss(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(Ti, { item: e, showReviewStates: r }))
    ])
  ]);
}
function ic({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n(Ai, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
    n(i ? "div" : "a", {
      key: "link",
      href: i ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: i ? void 0 : (l) => Zn(l, t, s),
      className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
      n("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
        n("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
        n(Ti, { key: "segments", item: e, showReviewStates: r })
      ]),
      n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function vo({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = Nl(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => Zn(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && Mn(
        o,
        Jt.recyclingBinView
      ) ? n(Ri, { key: "bin", onNavigate: t }) : null,
      n(Mi, { key: "settings", onNavigate: t })
    ])
  ]);
}
const oo = "segment-studio:recycling-bin-changed";
function sc(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function _n() {
  window.dispatchEvent(new CustomEvent(oo));
}
function Ri({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = B(null);
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
    return l(), window.addEventListener(oo, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(oo, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = sc(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => Zn(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function Mi({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => Zn(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function lc({ mode: e, onModeChange: t, disabled: r = !1 }) {
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
function dc({ minimum: e, maximum: t, onChange: r }) {
  const o = fe(null), [i, a] = B("maximum"), s = (f, m) => {
    const p = Ws(e, t, f, m);
    a(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (f, m) => {
    var y;
    const p = (y = o.current) == null ? void 0 : y.getBoundingClientRect();
    p && s(f, _s(m.clientX, p.left, p.width));
  }, d = (f, m) => {
    var p, y;
    m.preventDefault(), (y = (p = m.currentTarget).setPointerCapture) == null || y.call(p, m.pointerId), l(f, m);
  }, c = (f, m) => {
    var p, y;
    (y = (p = m.currentTarget).hasPointerCapture) != null && y.call(p, m.pointerId) && l(f, m);
  }, g = (f, m) => {
    const p = f === "minimum" ? e : t, y = f === "minimum" ? 0 : e, h = f === "minimum" ? t : 1, C = m.shiftKey ? 0.1 : 0.01;
    let x = null;
    ["ArrowLeft", "ArrowDown"].includes(m.key) && (x = p - C), ["ArrowRight", "ArrowUp"].includes(m.key) && (x = p + C), m.key === "PageDown" && (x = p - 0.1), m.key === "PageUp" && (x = p + 0.1), m.key === "Home" && (x = y), m.key === "End" && (x = h), x != null && (m.preventDefault(), s(f, Math.min(h, Math.max(y, x))));
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
function cc({ saving: e, error: t, onSelect: r, onClose: o }) {
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
    onKeyDownCapture: (s) => Ct(s, { onCancel: a })
  }, n("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: _t,
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
    n(Wn, {
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
function uc({
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
  const u = Et(e), f = [...new Map((a || []).map((h) => [
    Number(h.tagId),
    h.tagName || `Tag ${h.tagId}`
  ])).entries()].sort((h, C) => h[1].localeCompare(C[1]) || h[0] - C[0]), m = (h) => d(Et({ ...u, ...h })), p = (h) => m({
    reviewStates: u.reviewStates.includes(h) ? u.reviewStates.filter((C) => C !== h) : [...u.reviewStates, h]
  }), y = (h) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${h ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && g();
    },
    onKeyDownCapture: (h) => Ct(h, { onCancel: g })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: _t,
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
        n("div", { className: "flex flex-wrap gap-2" }, kt.map((h) => {
          const C = u.reviewStates.includes(h), x = Bt[h];
          return n("button", {
            key: h,
            type: "button",
            onClick: () => p(h),
            "aria-pressed": C,
            className: y(C)
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
            onClick: () => m({ performerId: null }),
            "aria-pressed": u.performerId == null,
            className: y(u.performerId == null)
          }, "All performers"),
          ...r.map((h) => {
            const C = Number(st(h));
            return n("button", {
              key: C,
              type: "button",
              onClick: () => m({ performerId: C }),
              "aria-pressed": u.performerId === C,
              className: y(u.performerId === C)
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
            ...f.map(([h, C]) => n("option", { key: h, value: h }, C))
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
            className: y(u.sourceKey == null)
          }, "All provenance"),
          ...o.map((h) => n("button", {
            key: h,
            type: "button",
            onClick: () => m({ sourceKey: h }),
            "aria-pressed": u.sourceKey === h,
            title: h,
            className: y(u.sourceKey === h)
          }, Gt(h)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(dc, {
          minimum: u.confidenceMin,
          maximum: u.confidenceMax,
          onChange: ({ minimum: h, maximum: C }) => m({
            confidenceMin: h,
            confidenceMax: C
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
        n(ec, { key: "icon", hidden: t }),
        n("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    n("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(Et({})), l && c(!1);
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
const Ei = "segment-studio-editor-history";
function mc({ history: e, historySaving: t, anchorRef: r, onRestore: o, onClose: i }) {
  const a = fe(null);
  return ye(() => {
    const s = (d) => {
      td(d.target, a.current, r == null ? void 0 : r.current) && i();
    }, l = (d) => {
      var u, f, m;
      if (d.key !== "Escape" || d.defaultPrevented || document.querySelector("[role='dialog'], [aria-modal='true']")) return;
      const c = document.activeElement, g = c instanceof Element && (((u = a.current) == null ? void 0 : u.contains(c)) || ((f = r == null ? void 0 : r.current) == null ? void 0 : f.contains(c)));
      d.preventDefault(), i(), g && ((m = r == null ? void 0 : r.current) == null || m.focus({ preventScroll: !0 }));
    };
    return document.addEventListener("pointerdown", s), document.addEventListener("keydown", l), () => {
      document.removeEventListener("pointerdown", s), document.removeEventListener("keydown", l);
    };
  }, [r, i]), n("div", {
    ref: a,
    id: Ei,
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
function gc({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Qn.filter((l) => Rn(l, e)), i = Yo(o, 1)[0], a = Yo(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((g) => n("div", { key: g.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, g.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[g.id] ? t[g.id].length > 0 ? t[g.id] : ["Unassigned"] : g.bindings.map(Za)).map((u, f) => n("kbd", { key: `${g.id}:${f}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, u))
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
function pc({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = Id(e), [l, d] = B([]), c = s.map((g) => g.tagName).join("|");
  return ye(() => {
    const g = new Set(s.map((u) => u.tagName));
    d((u) => u.filter((f) => g.has(f)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (g) => Ct(g, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: _t,
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
            style: { background: Nr(!1) }
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
            const y = `${Ae(p.startSec)}${p.endSec == null ? "" : ` – ${Ae(p.endSec)}`}`, h = r === p.id;
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
                "aria-label": `${h ? "Restoring" : "Restore to review"} ${g.tagName} example at ${y}`,
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
function fc({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = B(""), [a, s] = B(0), l = fe(null), d = He(() => Ll(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = jl(d);
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
        _t(f);
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
      var K;
      const p = f.segment || f, y = p.endSec == null ? Ae(p.startSec) : `${Ae(p.startSec)} – ${Ae(p.endSec)}`, h = `${Gt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, C = m === c, x = m > 0 ? d[m - 1].groupKey : null, z = g && f.groupKey !== x ? n("div", {
        key: `group:${f.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, f.groupName) : null, j = n("button", {
        key: p.id,
        id: `segment-quick-search-${p.id}`,
        ref: C ? l : null,
        type: "button",
        role: "option",
        "aria-selected": C,
        onMouseEnter: () => s(m),
        onClick: () => t(p),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${C ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        g ? n("span", { key: "group", className: "sr-only" }, `${f.groupName} group`) : null,
        n(mn, { key: "review", state: p.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        (K = f.performers) != null && K.length ? n(Cr, {
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
          title: h
        }, h)
      ]);
      return z ? [z, j] : [j];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function yc(e) {
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
function bc({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = He(() => yc(e), [e]), [l, d] = B([]), c = s.reduce((m, p) => m + p.drafts.length, 0), g = fe(null);
  po({ confirmRef: g, cancelRef: o, confirmReady: !t && c > 0 });
  const u = (m) => d((p) => p.includes(m) ? p.filter((y) => y !== m) : [...p, m]), f = (m) => `segment-studio-publish-approved-${m.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && a();
    },
    onKeyDownCapture: (m) => Ct(m, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: _t,
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
            style: { background: Nr(!1) }
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
            const h = y.endSec == null ? Ae(y.startSec) : `${Ae(y.startSec)} – ${Ae(y.endSec)}`, C = `${Gt(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`;
            return n("div", { key: y.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(mn, { key: "review", state: y.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, h),
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
        ref: g,
        type: "button",
        disabled: t || c === 0,
        onClick: i,
        className: "rounded-md border border-emerald-500/60 bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-emerald-500/30 disabled:opacity-50"
      }, t ? "Publishing…" : `Publish ${c} approved draft${c === 1 ? "" : "s"}`)
    ])
  ]));
}
function hc({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = Ol(e), [s, l] = B(() => /* @__PURE__ */ new Set()), [d, c] = B(() => new Set(a.map((y) => y.key))), g = a.flatMap((y) => d.has(y.key) ? y.candidates : []), u = (y) => l((h) => {
    const C = new Set(h);
    return C.has(y) ? C.delete(y) : C.add(y), C;
  }), f = (y) => c((h) => {
    const C = new Set(h);
    return C.has(y) ? C.delete(y) : C.add(y), C;
  }), m = (y) => y.assignment.map(({ slot: h, performer: C }) => `${h.label || `Slot ${h.sortOrder + 1}`}: ${C.name}`).join(", "), p = (y) => `segment-studio-auto-assign-${y.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (y) => {
      y.target === y.currentTarget && !t && i();
    },
    onKeyDownCapture: (y) => {
      y.key === "Enter" && y.target instanceof HTMLInputElement || Ct(y, {
        onCancel: t ? void 0 : i,
        onConfirm: g.length && !t ? () => o(g) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: _t,
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
          style: { background: Nr(!1) }
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
            y.assignment.map(({ slot: h, performer: C }) => {
              const x = h.label || `Slot ${h.sortOrder + 1}`;
              return n("span", {
                key: h.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${x}: ${C.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${x}: ${C.name}`
                }, `${x}: ${C.name}`),
                n(Yn, {
                  key: "avatar",
                  performer: { id: C.performerId, name: C.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(en, { key: "states", counts: y.counts }),
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
          y.candidates.map((h) => {
            const C = h.endSec == null ? Ae(h.startSec) : `${Ae(h.startSec)} – ${Ae(h.endSec)}`, x = `${Gt(h.sourceKey)}${h.confidence == null ? "" : ` · ${Math.round(h.confidence * 100)}%`}`;
            return n("div", {
              key: h.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(mn, { key: "review", state: h.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                h.tagName || "Tag segment"
              ),
              n(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                C
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
        disabled: t || g.length === 0,
        onClick: () => o(g),
        className: "rounded-md border border-violet-400/60 bg-violet-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-violet-500/30 disabled:opacity-50"
      }, t ? "Assigning…" : `Auto-Assign ${g.length} Segment${g.length === 1 ? "" : "s"}`)
    ])
  ]));
}
function vc({ preview: e, onConfirm: t, onClose: r }) {
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
    onKeyDownCapture: _t,
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
function xc({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = B(!1), d = fe(null);
  if (po({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Ae(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && a();
    },
    onKeyDownCapture: (g) => Ct(g, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: _t,
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
function Sc(e) {
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
function kc({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var u, f;
  const l = e ? e.createCount + e.linkCount : 0, d = fe(null);
  po({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((u = e == null ? void 0 : e.outputs) == null ? void 0 : u.slice(0, 200)) || [], g = Sc(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !r && s();
    },
    onKeyDownCapture: (m) => Ct(m, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: _t,
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
function wc({
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
  slotButtonRef: y,
  tagSearchRef: h,
  onDetailChange: C,
  setSaveMessage: x,
  acquireSaveLock: z,
  onSlotsChanged: j,
  onRecordHistory: K,
  onCancelQueuedReview: W,
  splitSegment: O,
  duplicateSegment: k,
  provenance: A,
  lineage: w,
  onNavigateLineageItem: T,
  tagEditing: _,
  onCancelTagEditing: E,
  detailPanelRef: R,
  onReduceSelection: D
}) {
  var ve, re, le, me;
  const q = fe(null), te = fe(null), pe = () => {
    var Y;
    (Y = te.current) == null || Y.call(te), te.current = null;
  }, be = fe(null), X = fe(null), F = fe(null), ae = fe(null), [ce, J] = B(!1);
  ye(() => {
    q.current && (q.current.scrollTop = 0), J(!1);
  }, [t == null ? void 0 : t.id]), ye(() => {
    var Y, de;
    ce && ((de = (Y = be.current) == null ? void 0 : Y.querySelector("input, select, button")) == null || de.focus({ preventScroll: !0 }));
  }, [ce]);
  function he() {
    J(!1), requestAnimationFrame(() => {
      var Y;
      return (Y = y.current) == null ? void 0 : Y.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const Y = !r.some((ne) => ne.isDerived), de = e && g ? ad(f, r) : null, M = (de == null ? void 0 : de.map((ne, $) => {
      var b;
      const v = r[$];
      return {
        segmentId: v.nativeSegmentId,
        itemId: v.published ? null : v.itemId,
        revision: (b = m.performerSlotRevisions) == null ? void 0 : b[v.id],
        slots: ne
      };
    })) || [];
    return n(ao.Fragment, null, [
      n(nc, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: R,
        onReduceSelection: D,
        reviewable: e,
        tagEditable: Y,
        slotsEditable: M.length > 0 && a == null,
        onEditSlots: () => J(!0),
        slotButtonRef: y,
        saveMessage: i
      }),
      _ && Y ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ne) => {
          ne.target === ne.currentTarget && E();
        },
        onKeyDownCapture: (ne) => Ct(ne, { onCancel: E })
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
        n(Wn, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (ne, $) => ne == null ? E() : l(ne, $ == null ? void 0 : $.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: E,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      ce && M.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ne) => {
          ne.target === ne.currentTarget && he();
        },
        onKeyDownCapture: (ne) => {
          var v, b;
          if (!(typeof ((v = ne.target) == null ? void 0 : v.closest) == "function" ? ne.target.closest("input, textarea, select, [contenteditable='true']") : null) && !ne.repeat && !ne.ctrlKey && !ne.altKey && !ne.metaKey && !ne.shiftKey && /^[1-9]$/.test(ne.key) && ((b = ae.current) != null && b.call(ae, Number(ne.key) - 1))) {
            ne.preventDefault(), ne.stopPropagation();
            return;
          }
          Ct(ne, { onCancel: he });
        }
      }, n("section", {
        ref: be,
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
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Zd, {
          videoId: p.id,
          targets: M,
          performerCandidates: m.performerCandidates || [],
          shortcutRef: ae,
          acquireSaveLock: () => z("slots", -1),
          onSaved: async ({ beforeState: ne, afterState: $ }) => {
            await K(
              "performer-slots.assign",
              `Assigned performers to ${M.length} segments`,
              ne,
              $
            ), he(), await j();
          },
          onConflict: j
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (Y) => {
      q.current = Y, R && (R.current = Y);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(mn, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n($r, { key: "derived" }) : null,
        t && _ ? n("div", {
          key: "tag-editor",
          ref: h,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (Y) => {
            Y.key === "Escape" && (Y.preventDefault(), Y.stopPropagation(), E());
          },
          onKeyDown: (Y) => {
            nd(Y, t.tagName) && (Y.preventDefault(), Y.stopPropagation(), l(t.tagId));
          }
        }, n(Wn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (Y, de) => Y == null ? E() : l(Y, de == null ? void 0 : de.label),
          disabled: bl(a, t.id, s) || ((ve = w.data) == null ? void 0 : ve.tagReadOnly) === !0,
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
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(Yd, { status: c })) : null,
      t && g && u.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(hi, {
        assignments: u.map((Y) => {
          const de = dd(Y);
          return {
            key: String(Y.slotDefinitionId),
            label: de.label,
            performer: de.filled ? { id: Number(Y.performerId), name: de.performer } : null,
            title: de.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(tc, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: A
    }) : null,
    t ? n("div", { key: "controls", hidden: !0 }, [
      n("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        n("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        w.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : w.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, w.error) : w.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${w.data.derived ? "Derived segment" : "Root segment"} · ${w.data.componentSize} segment${w.data.componentSize === 1 ? "" : "s"} · ${w.data.integrityState}`
          ),
          (re = w.data.parents) != null && re.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...w.data.parents.map((Y) => n("button", {
              key: Y.nodeId,
              type: "button",
              onClick: () => T(Y.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${Y.ruleKey} ${Y.ruleVersion}`))
          ]) : null,
          (le = w.data.children) != null && le.length ? n("p", { key: "children" }, `Children: ${w.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: y,
          type: "button",
          disabled: a != null || !g || u.length === 0,
          onClick: () => J(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: g ? u.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, u.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: O,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        n("button", {
          key: "duplicate",
          type: "button",
          disabled: a != null,
          onClick: () => k(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        n("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: a != null,
          onClick: () => k(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    ce && e && t && g && u.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (Y) => {
        Y.target === Y.currentTarget && he();
      },
      onKeyDownCapture: (Y) => {
        var M, ne;
        if (!(typeof ((M = Y.target) == null ? void 0 : M.closest) == "function" ? Y.target.closest("input, textarea, select, [contenteditable='true']") : null) && !Y.repeat && !Y.ctrlKey && !Y.altKey && !Y.metaKey && !Y.shiftKey && /^[1-9]$/.test(Y.key) && ((ne = F.current) != null && ne.call(F, Number(Y.key) - 1))) {
          Y.preventDefault(), Y.stopPropagation();
          return;
        }
        Ct(Y, {
          onCancel: he,
          onConfirm: () => {
            var $;
            return ($ = X.current) == null ? void 0 : $.click();
          }
        });
      }
    }, n("section", {
      ref: be,
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
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Qd, {
        key: `${t.id}:${m.performerSlotsRevision || m.slotRevision || ""}`,
        videoId: p.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: u,
        revision: (me = m.performerSlotRevisions) == null ? void 0 : me[t.id],
        performerCandidates: m.performerCandidates || [],
        confirmRef: X,
        shortcutRef: F,
        onOptimisticSave: (Y) => {
          const de = z("slots", t.id);
          if (!de)
            return x("Wait for the current save to finish before saving performer slots."), !1;
          te.current = de, C((M) => Jr(
            M,
            t.id,
            Y
          ), p.id), x("Saving performer slots…"), he();
        },
        onSaved: async (Y, { beforeState: de, afterState: M }) => {
          C((ne) => Jr(
            ne,
            t.id,
            Y.slots || [],
            Y.revision
          ), p.id), x("Performer slots saved.");
          try {
            await K(
              "performer-slots.assign",
              "Assigned performers",
              de,
              M
            ), await j(Y) || W([t]);
          } finally {
            pe();
          }
        },
        onRollback: async (Y, de) => {
          W([t]), C((M) => {
            var ne;
            return Jr(
              M,
              t.id,
              Y,
              (ne = m.performerSlotRevisions) == null ? void 0 : ne[t.id]
            );
          }, p.id), x(de.message || "Unable to save performer slots.");
          try {
            de.status === 409 && await j();
          } finally {
            pe();
          }
        },
        onConflict: j
      }))
    ])) : null
  ]);
}
function Nc({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: u, onSelectGroup: f, onToggleGroup: m, onSelect: p, onSelectSegments: y, onSelectAll: h, onConfigureTag: C, onSeekTime: x, centerRef: z, showReviewState: j = !0, swimlaneTitleWidth: K, onSwimlaneTitleWidthChange: W }) {
  const O = fe(null), k = fe(null), [A, w] = B(0), [T, _] = B({ scrollTop: 0, height: 320 }), [E, R] = B(null), D = He(
    () => cn(e, r, o),
    [e, r, o]
  ), q = He(
    () => fi(o),
    [o]
  ), te = He(() => bo(D), [D]), pe = He(
    () => pd(te, i, r.length > 0),
    [te, i, r.length]
  ), be = He(
    () => yi(pe.rows, Math.max(0, T.scrollTop - 24), T.height),
    [pe, T]
  ), X = Math.max(0, Number(d) || 0), F = Fs(A), ae = yr(K, F), ce = ae / 16, J = Os(c, X, ce), he = Rs(X), ve = Ms(X, Math.max(1, A - ce * 16), g), re = he.filter((b, S) => S === 0 || S % ve === 0), le = He(() => D.map((b) => `${b.key}:${b.trackCount}:${b.markers.map(({ segment: S, track: P }) => `${S.id}:${S.startSec}:${S.endSec ?? ""}:${P}`).join(",")}`).join("|"), [D]);
  function me() {
    const b = k.current;
    if (!b) return;
    const S = b.querySelector("[data-timeline-track]"), P = b.firstElementChild, oe = S == null ? void 0 : S.getBoundingClientRect(), U = P == null ? void 0 : P.getBoundingClientRect(), H = oe && U ? Math.max(0, oe.left - U.left) : ce * 16, ue = (U == null ? void 0 : U.width) ?? b.scrollWidth;
    b.scrollTo({
      left: Ps(c, X, ue, b.clientWidth, H, Ha),
      behavior: "smooth"
    });
  }
  ye(() => (z.current = me, () => {
    z.current === me && (z.current = null);
  })), ye(() => {
    me();
  }, [g]);
  function Y() {
    const b = k.current, S = pe.rows.find((ue) => ue.kind === "lane" && ue.lane.markers.some(({ segment: N }) => N.id === s));
    if (!b || !S) return;
    const P = 24, oe = S.top + P, U = oe + S.height;
    let H = b.scrollTop;
    oe < b.scrollTop + P ? H = Math.max(0, oe - P) : U > b.scrollTop + b.clientHeight && (H = Math.max(0, U - b.clientHeight)), H !== b.scrollTop && (b.scrollTop = H), _({ scrollTop: H, height: b.clientHeight });
  }
  ye(() => {
    Y();
  }, [s, le, pe]), ye(() => {
    const b = k.current, S = pe.rows.find((ue) => ue.kind === "group" && ue.group.key === a);
    if (!b || !S) return;
    const P = 24, oe = S.top + P, U = oe + S.height;
    let H = b.scrollTop;
    oe < b.scrollTop + P ? H = Math.max(0, oe - P) : U > b.scrollTop + b.clientHeight && (H = Math.max(0, U - b.clientHeight)), H !== b.scrollTop && (b.scrollTop = H), _({ scrollTop: H, height: b.clientHeight });
  }, [a, pe]), ye(() => {
    const b = k.current;
    if (!b || typeof ResizeObserver > "u") return;
    const S = () => {
      w(b.clientWidth), _({ scrollTop: b.scrollTop, height: b.clientHeight }), Y();
    }, P = new ResizeObserver(S);
    return P.observe(b), S(), () => P.disconnect();
  }, [s, le, pe]);
  function de(b) {
    if (!(X > 0)) return;
    const S = b.currentTarget.getBoundingClientRect(), P = Math.min(1, Math.max(0, (b.clientX - S.left) / S.width));
    x(P * X);
  }
  function M(b) {
    const S = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let P = null;
    Object.hasOwn(S, b.key) && (P = c + S[b.key]), b.key === "Home" && (P = 0), b.key === "End" && (P = X), P != null && (b.preventDefault(), b.stopPropagation(), x(Math.min(X, Math.max(0, P))));
  }
  function ne(b) {
    var P;
    const S = (P = O.current) == null ? void 0 : P.getBoundingClientRect();
    S && W(yr(b.clientX - S.left, F));
  }
  function $(b) {
    const S = b.shiftKey ? 40 : 16;
    let P = null;
    b.key === "ArrowLeft" && (P = ae - S), b.key === "ArrowRight" && (P = ae + S), b.key === "Home" && (P = 160), b.key === "End" && (P = F), P != null && (b.preventDefault(), b.stopPropagation(), W(yr(P, F)));
  }
  const v = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: O,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (b) => {
          (b.metaKey || b.ctrlKey) && (b.preventDefault(), h == null || h());
        },
        onKeyDown: (b) => {
          b.key !== "Enter" && b.key !== " " || (b.preventDefault(), h == null || h());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: v, disabled: g <= 1, onClick: () => u(xr(g - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: v, disabled: g === 1, onClick: () => u(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(g * 100)}%`),
      n("button", { key: "in", type: "button", className: v, disabled: g >= 8, onClick: () => u(xr(g + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: v, onClick: me, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(F),
      "aria-valuenow": Math.round(ae),
      "aria-valuetext": `${Math.round(ae)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (b) => {
        b.currentTarget.setPointerCapture(b.pointerId), ne(b);
      },
      onPointerMove: (b) => {
        b.currentTarget.hasPointerCapture(b.pointerId) && ne(b);
      },
      onKeyDown: $,
      onDoubleClick: () => W(It.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${ae - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: k,
      onScroll: (b) => _({
        scrollTop: b.currentTarget.scrollTop,
        height: b.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: Ls(g) }, [
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
          "aria-valuemax": X,
          "aria-valuenow": Math.min(X, Math.max(0, c)),
          "aria-valuetext": Ae(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: de,
          onKeyDown: M
        }, re.map((b, S) => n("span", {
          key: b,
          className: `absolute top-0 ${Es(S, re.length, X > 0 ? b / X * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Ds(S, re.length, X > 0 ? b / X * 100 : 0)
        }, Ae(b))).concat(t.map((b) => {
          const S = X > 0 ? b.startSec / X * 100 : 0;
          return n("button", {
            key: `shot-boundary:${b.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Ae(b.startSec)} – ${Ae(b.endSec)}`,
            title: `Shot boundary · ${b.source || "manual"} · ${Ae(b.startSec)} – ${Ae(b.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${S}%`, width: "2px" },
            onClick: (P) => {
              P.stopPropagation(), x(b.startSec);
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
            ..._o(J),
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
        style: D.length > 0 ? { height: pe.height } : void 0
      }, [
        D.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ..._o(J, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        D.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : be.map((b) => {
          var V;
          const S = b.group, P = i.includes(S.key), oe = a === S.key, U = Nr(oe);
          if (b.kind === "group") return n("div", {
            key: b.key,
            "data-segment-group": S.key,
            "data-segment-group-collapsed": P ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ce}rem minmax(0,1fr)`,
              backgroundColor: U,
              top: b.top,
              height: b.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (G) => {
                if (G.metaKey || G.ctrlKey) {
                  y(S.lanes.flatMap((ee) => ee.markers.map((ge) => ge.segment.id)));
                  return;
                }
                f(S.key), m(S.key);
              },
              "aria-expanded": !P,
              "aria-current": oe ? "true" : void 0,
              "data-selected-timeline-group": oe ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: S.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: U
              },
              title: `${P ? "Expand" : "Collapse"} ${S.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, P ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, S.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              P ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${S.lanes.length} swimlane${S.lanes.length === 1 ? "" : "s"} hidden`
                ),
                j ? n(en, { key: "states", counts: S.counts }) : null
              ] : null
            )
          ]);
          const H = b.lane, ue = Yl(b.laneIndex), N = H.markers.some(({ segment: G }) => G.id === s);
          return n("div", {
            key: b.key,
            "data-grouped-swimlane": S.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ce}rem minmax(0,1fr)`,
              top: b.top,
              height: b.height,
              backgroundColor: ue
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": N ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: Ql(N, ue),
              title: `${Jn(H)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Jn(H),
              onClick: (G) => {
                (G.metaKey || G.ctrlKey) && y(H.markers.map((ee) => ee.segment.id));
              },
              onMouseEnter: () => R(H.key),
              onMouseLeave: () => R((G) => G === H.key ? null : G)
            }, [
              H.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (G) => {
                  G.stopPropagation(), C({ tagId: H.tagId, tagName: H.label, trigger: G.currentTarget });
                },
                "aria-label": `Configure ${H.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: E === H.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, H.label),
              (V = H.performers) != null && V.length ? n(Cr, {
                key: "performers",
                performers: H.performers,
                performerAssignments: H.performerAssignments
              }) : null,
              j ? n(en, { key: "counts", counts: H.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, H.markers.map(({ segment: G, track: ee }) => {
              var Qe;
              const ge = Qr(G.startSec, X), Le = G.endSec == null ? G.startSec : Math.max(G.startSec, G.endSec), Ie = Math.max(0, Qr(Le, X) - ge), Fe = l.includes(G.id), Ge = G.id === s, Ee = yo(q.get(G.id)), Ve = G.endSec == null ? Ae(G.startSec) : `${Ae(G.startSec)} – ${Ae(G.endSec)}`, pt = (Qe = gi[Ee]) == null ? void 0 : Qe.label;
              return n("button", {
                key: G.id,
                type: "button",
                onClick: (mt) => {
                  mt.stopPropagation(), p(G, {
                    additive: mt.metaKey || mt.ctrlKey,
                    rangeSegmentIds: mt.shiftKey ? H.markers.map((rt) => rt.segment.id) : null
                  });
                },
                "aria-pressed": Fe,
                "aria-current": Ge ? "true" : void 0,
                "data-selected-timeline-marker": Ge ? "true" : void 0,
                "data-selected-segment-shortcut-target": Ge ? "true" : void 0,
                "aria-label": j ? `${G.tagName || "Tag segment"}${H.performerLabel ? `, ${H.performerLabel}` : ""}, ${G.reviewState}${pt ? `, ${pt}` : ""}, ${Ve}` : `${G.tagName || "Tag segment"}${H.performerLabel ? `, ${H.performerLabel}` : ""}, ${Ve}`,
                title: j ? `${G.tagName || "Tag segment"}${H.performerLabel ? ` · ${H.performerLabel}` : ""} · ${G.reviewState}${pt ? ` · ${pt}` : ""} · ${Ve}` : `${G.tagName || "Tag segment"}${H.performerLabel ? ` · ${H.performerLabel}` : ""} · ${Ve}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...j ? Wl(G.reviewState, Fe, Ee, Ge) : Vl(Fe, Ge),
                  left: `${ge}%`,
                  top: `${Zl(ee)}rem`,
                  width: Jl(G.endSec, Ie),
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
function xo({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = B(null), [l, d] = B([]), [c, g] = B(null), [u, f] = B(""), [m, p] = B(!0), [y, h] = B(null), [C, x] = B(""), [z, j] = B(!1), K = fe(null), W = fe(0);
  ye(() => {
    const E = requestAnimationFrame(() => {
      var R;
      return (R = K.current) == null ? void 0 : R.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(E);
  }, [e]), ye(() => {
    const E = new AbortController();
    return p(!0), x(""), Promise.all([
      r ? Z(`/slot-definitions/${e}`, { signal: E.signal }) : Promise.resolve(null),
      Z("/segment-groups", { signal: E.signal })
    ]).then(([R, D]) => {
      const q = D.find((te) => (te.tags || []).some((pe) => Number(pe.tagId) === Number(e)));
      s(R), d(D), g((q == null ? void 0 : q.id) ?? null), f(q == null ? "" : String(q.id)), j(!1);
    }).catch((R) => {
      R.name !== "AbortError" && x(R.message || "Unable to load tag configuration.");
    }).finally(() => {
      E.signal.aborted || p(!1);
    }), () => E.abort();
  }, [r, e]);
  function O(E, R) {
    s({
      ...a,
      definitions: a.definitions.map((D, q) => q === E ? { ...D, ...R } : D)
    });
  }
  function k(E, R) {
    const D = E + R;
    if (D < 0 || D >= a.definitions.length) return;
    const q = [...a.definitions];
    [q[E], q[D]] = [q[D], q[E]], s({
      ...a,
      definitions: q.map((te, pe) => ({ ...te, sortOrder: pe }))
    });
  }
  function A(E) {
    const R = a.definitions[E], D = Number(R.assignmentCount) || 0, q = D === 0 ? "" : ` and its ${D} assignment${D === 1 ? "" : "s"}`;
    window.confirm(`Delete “${wt(R)}”${q}?`) && (D > 0 && j(!0), s({
      ...a,
      definitions: a.definitions.filter((te, pe) => pe !== E).map((te, pe) => ({ ...te, sortOrder: pe }))
    }));
  }
  async function w() {
    var R;
    h("slots"), x("Saving performer slots…");
    let E;
    try {
      E = await Z(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: z,
          definitions: a.definitions.map((D, q) => {
            var te;
            return {
              id: D.id || void 0,
              label: ((te = D.label) == null ? void 0 : te.trim()) || null,
              sortOrder: q,
              genderHints: D.genderHints || []
            };
          })
        })
      }), s(E), j(!1);
    } catch (D) {
      D.status === 409 ? (x("Performer slots changed elsewhere; current values were reloaded."), (R = D.payload) != null && R.current && (s(D.payload.current), j(!1))) : x(D.message || "Unable to save performer slots."), h(null);
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
  async function T() {
    const E = u === "" ? null : Number(u);
    if (E !== c) {
      h("group"), x("Saving tag group…");
      try {
        await Z(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: E })
        });
      } catch (R) {
        x(R.message || "Unable to assign the tag group."), h(null);
        return;
      }
      try {
        const [R, D] = await Promise.allSettled([
          Z("/segment-groups"),
          o()
        ]);
        if (R.status === "fulfilled") {
          d(R.value);
          const q = R.value.find((pe) => (pe.tags || []).some((be) => Number(be.tagId) === Number(e))), te = (q == null ? void 0 : q.id) ?? null;
          g(te), f(te == null ? "" : String(te));
        }
        x(
          R.status === "fulfilled" && D.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        h(null);
      }
    }
  }
  l.find((E) => Number(E.id) === Number(c));
  const _ = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (E) => {
      E.target === E.currentTarget && !y && i();
    },
    onKeyDownCapture: (E) => Ct(E, {
      onCancel: y ? void 0 : i
    })
  }, n("section", {
    ref: K,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: _t,
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
            onChange: (E) => f(E.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((E) => n("option", { key: E.id, value: String(E.id) }, E.name))
          ])
        ]),
        m ? null : n("button", {
          key: "save",
          type: "button",
          disabled: y != null || (u === "" ? null : Number(u)) === c,
          onClick: T,
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
              onChange: (E) => s({ ...a, allowSamePerformerInMultipleSlots: E.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((E, R) => n("article", {
            key: E.id || E._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: E.label || "",
                disabled: y != null,
                onChange: (D) => O(R, { label: D.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Cs.map((D) => n("label", { key: D, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: y != null,
                  checked: (E.genderHints || []).includes(D),
                  onChange: (q) => O(R, {
                    genderHints: q.target.checked ? [.../* @__PURE__ */ new Set([...E.genderHints || [], D])] : (E.genderHints || []).filter((te) => te !== D)
                  })
                }),
                n("span", { key: "text" }, Ir(D))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${E.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: y != null || R === 0, onClick: () => k(R, -1), className: _, "aria-label": `Move ${wt(E)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: y != null || R === a.definitions.length - 1, onClick: () => k(R, 1), className: _, "aria-label": `Move ${wt(E)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: y != null, onClick: () => A(R), className: `${_} text-red-300` }, "Delete")
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
                  _clientKey: `new-${++W.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: _
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: y != null,
              onClick: w,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, y === "slots" ? "Saving…" : "Save performer slots")
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
        disabled: y != null,
        onClick: i,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Close")
    )
  ]));
}
function Ic(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function Cc(e) {
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, analysisError: i, analysisRun: a, analysisStatus: s, approvalFacetCounts: l, autoAssignCandidates: d, autoAssignError: c, autoAssignOpen: g, autoAssignPerformers: u, autoAssigning: f, cancelQueuedReviewsForSegments: m, canMoveSelectionToBin: p, captureTrainingExport: y, centerTimelineRef: h, closeEditorFilters: C, closeFirstSegmentTagDialog: x, closeMaterializeDialog: z, closeMergeConfirmation: j, closePublishApprovedDialog: K, closeTagEditing: W, collapsedSegmentGroups: O, commonActionsRef: k, compatibilityMode: A, configuringTag: w, createSegment: T, creatingSegmentId: _, currentTime: E, deleteRejectedSegments: R, detail: D, detailPanelRef: q, detailWidth: te, duplicateSegment: pe, editorFilters: be, editorLayout: X, editorRef: F, exportingExamples: ae, filtersButtonRef: ce, filtersOpen: J, firstSegmentTagOpen: he, focusRowRef: ve, handleSeparatorKeyDown: re, handleSeparatorPointerDown: le, handleSeparatorPointerMove: me, hasNextUnreviewed: Y, hasPreviousUnreviewed: de, hideDerivedSegments: M, history: ne, historyOpen: $, historySaving: v, horizontalLayoutSize: b, importNativeSegments: S, incorrectExamples: P, incorrectExamplesOpen: oe, lineage: U, markerRailWidth: H, materializeButtonRef: ue, materializeCancelButtonRef: N, materializeDerivedSegments: V, materializeError: G, materializeLoading: ee, materializeOpen: ge, materializePreview: Le, materializing: Ie, mediaStackRef: Fe, mergeCancelButtonRef: Ge, mergeConfirmation: Ee, mergeSaving: Ve, mergeSelectedSwimlane: pt, nativeImportState: Qe, onDetailChange: mt, onNavigate: rt, onReload: ct, onSlotsChanged: nt, openPublishApprovedDialog: gt, panelSeparatorProps: et, pendingInitialSeekRef: $t, performerSlots: Tt, performerSlotsAvailable: Q, playbackControlsRef: se, previewDerivedSegments: Ne, provenance: Te, provenanceSources: xe, publishApprovedCancelButtonRef: We, publishApprovedDrafts: je, publishApprovedError: _e, publishApprovedOpen: ke, quickSearchOpen: Ue, railScrollRef: De, railToggleRef: we, recordHistoryAction: Be, rejectedDeletionPreview: ot, removeIncorrectExample: Se, removingExampleId: Pe, restoreHistoryTarget: Me, runEditorAction: Dt, saveMessage: Ze, saveTag: lt, saveTiming: Ut, savingSegmentId: Je, seekRef: Ce, segmentGroups: $e, segmentRailLayout: qe, segments: dt, selectAllVideoSegments: at, selectSegment: Pt, selectSegmentCollection: Nt, selectedGroups: Ot, selectedPerformerSlots: gn, selectedSegment: Lt, selectedSegmentGroupKey: nn, selectedSegmentIds: Xn, selectedSegments: rn, selectedSlotStatus: Dn, setAutoAssignError: er, setAutoAssignOpen: pn, setConfiguringTag: Qt, setCurrentTime: fn, setEditorFilters: tr, setEditorLayout: Tr, setFiltersOpen: nr, setHideDerivedSegments: Ar, setHistoryOpen: on, setIncorrectExamplesOpen: yn, setQuickSearchOpen: Pn, setRailViewport: bn, setRejectedDeletionPreview: Rr, setSaveMessage: rr, setSelectedSegmentGroupKey: hn, setSelectedSegmentId: an, setShortcutsOpen: vn, setTimelineZoom: On, shotBoundaries: vt, shortcutsOpen: or, slotButtonRef: Ln, splitLayout: Kt, splitSegment: ar, startFullAnalysis: xn, stepVideoFrame: Sn, tagEditing: Mr, tagSearchRef: Er, timelineDuration: Fn, timelineRatioBounds: kn, timelineZoom: jn, toggleSegmentGroup: tt, toggleSegmentRail: ft, updateTimelineRatio: Dr, video: ut, videoPerformers: At, visibleCounts: Rt, visibleSegmentRailRows: Pr, visibleSegments: wn, wideLayout: Wt, workspaceRef: Bn } = e, Gn = He(
    () => dt.filter((I) => !I.published && I.reviewState === "approved"),
    [dt]
  ), ir = ks(io), Nn = Gn.length, sr = fe(null), Or = He(() => () => on(!1), [on]), zt = Le ? Le.createCount + Le.linkCount : null, yt = Je != null, sn = rn.length > 0, Un = rn.length === 1, Lr = sn && rn.every((I) => I.reviewState === "approved"), Fr = sn && rn.every((I) => I.reviewState === "rejected"), jr = [
    { id: "marker.create", label: "New segment", disabled: yt },
    { id: "marker.editTag", label: "Edit tag", disabled: yt || !sn },
    { id: "marker.setStart", label: "Set start", disabled: yt || !Un },
    { id: "marker.setEnd", label: "Set end", disabled: yt || !Un },
    { id: "marker.split", label: "Split", disabled: yt || !Un },
    ...A ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !de, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Lr ? "Unapprove" : "Approve", disabled: yt || !sn, tone: "approve" },
      { id: "marker.reject", label: Fr ? "Unreject" : "Reject", disabled: yt || !sn, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !Y, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...A ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: yt || !p, tone: "reject" }
    ]
  ];
  function xt(I) {
    const Re = Xn.includes(I.id), ht = I.id === (Lt == null ? void 0 : Lt.id), bt = I.endSec == null ? Ae(I.startSec) : `${Ae(I.startSec)} – ${Ae(I.endSec)}`, Zt = `${Gt(I.sourceKey)}${I.confidence != null ? ` · ${Math.round(I.confidence * 100)}%` : ""}`;
    return n("button", {
      key: I.id,
      type: "button",
      onClick: (Ht) => Pt(I, { additive: Ht.metaKey || Ht.ctrlKey }),
      "aria-pressed": Re,
      "aria-current": ht ? "true" : void 0,
      "data-selected-segment-shortcut-target": ht ? "true" : void 0,
      "aria-label": A ? `${I.tagName || "Tag segment"}, ${I.reviewState}${I.isDerived ? ", derived segment" : ""}, ${bt}` : `${I.tagName || "Tag segment"}${I.isDerived ? ", derived segment" : ""}, ${bt}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: mi(Re, ht)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        A ? n(mn, { key: "review", state: I.reviewState, includeLabel: !1 }) : null,
        I.isDerived ? n($r, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          I.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, bt),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: Zt
        }, Zt)
      ])
    ]);
  }
  const Xe = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", ln = [...ne.actions || []].reverse().find((I) => I.sequence <= ne.cursorSequence);
  return n("section", {
    ref: F,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${Kt ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "relative flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (I) => $i(I, rt, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${ut.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: ut.title || `Video ${ut.id}`
          }, ut.title || `Video ${ut.id}`)),
          ...At.map((I) => n(Yn, {
            key: st(I),
            performer: { id: st(I), name: I.name },
            compact: !0,
            tooltip: I.name
          })),
          A ? n(en, { key: "review-counts", counts: Rt }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          A ? null : n(Ri, { key: "bin", onNavigate: rt, compact: !0 }),
          n(Mi, { key: "settings", onNavigate: rt, compact: !0 })
        ])
      ]),
      A && D.nativeImportCount > 0 ? n("div", {
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
          A ? n("div", {
            key: "full-analysis",
            className: "inline-flex items-stretch"
          }, [
            n("button", {
              key: "run",
              type: "button",
              disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
              onClick: () => xn(),
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
              }, n(Fa, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([I, Re]) => n("button", {
                key: I,
                type: "button",
                disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
                onClick: (ht) => {
                  var bt;
                  (bt = ht.currentTarget.closest("details")) == null || bt.removeAttribute("open"), xn(Re);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, I)))
            ])
          ]) : null,
          A ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: Je != null || d.length === 0,
            onClick: () => {
              er(""), pn(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${d.length ? ` (${d.length})` : ""}`) : null,
          A ? n("button", {
            key: "materialize-derived",
            ref: ue,
            type: "button",
            disabled: Je != null || ee || Ie || zt === 0,
            onClick: Ne,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, ee ? "Analyzing…" : `Auto-Materialize${zt != null ? ` (${zt})` : ""}`) : null,
          A ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: Je != null || Nn === 0,
            onClick: (I) => gt(I.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": ke,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${Nn ? ` (${Nn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: ae || Pe != null || P.length === 0,
            onClick: () => yn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": oe,
            "aria-label": `Open AI feedback collection, ${P.length} example${P.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${P.length ? ` (${P.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: ce,
            type: "button",
            onClick: () => nr(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": J,
            className: `${Xe} ${r ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(pr, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${r ? ` (${r})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => vn(!0),
            className: Xe
          }, [n(pr, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            ref: sr,
            type: "button",
            disabled: (A ? ne.actions.length === 0 : ln == null) || Je != null || v,
            onClick: A ? () => on((I) => !I) : () => Me(
              ln.sequence - 1
            ),
            "aria-controls": A ? Ei : void 0,
            "aria-expanded": A ? $ : void 0,
            className: Xe
          }, [
            n(pr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, A ? `History${ne.actions.length ? ` (${ne.actions.length})` : ""}` : ln ? `Undo ${ln.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: we,
            type: "button",
            onClick: ft,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": X.markerRailOpen,
            className: Xe
          }, [
            n(pr, { key: "icon", name: "list" }),
            n("span", { key: "label" }, X.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ]),
      A && $ ? n(mc, {
        key: "history-popover",
        history: ne,
        historySaving: v,
        anchorRef: sr,
        onRestore: Me,
        onClose: Or
      }) : null
    ]),
    J ? n(uc, {
      key: "editor-filters",
      filters: be,
      hideDerivedSegments: M,
      performers: At,
      provenanceSources: xe,
      reviewCounts: l,
      segments: dt,
      segmentGroups: $e,
      reviewMode: A,
      onChange: tr,
      onHideDerivedChange: Ar,
      onClose: C
    }) : null,
    he ? n(cc, {
      key: "first-segment-tag-dialog",
      saving: Je != null,
      error: Ze,
      onSelect: (I, Re) => T(I, Re),
      onClose: x
    }) : null,
    Ue ? n(fc, {
      key: "quick-search-dialog",
      segments: Fl(o),
      onSelect: (I) => {
        Pn(!1), Pt(I, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        Pn(!1), requestAnimationFrame(() => {
          var I;
          return (I = F.current) == null ? void 0 : I.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    g ? n(hc, {
      key: "auto-assign-dialog",
      candidates: d,
      processing: f,
      error: c,
      onConfirm: u,
      onClose: () => pn(!1)
    }) : null,
    Ee ? n(xc, {
      key: "merge-selection-dialog",
      merge: Ee,
      processing: Ve,
      undoable: !A,
      cancelButtonRef: Ge,
      onConfirm: (I) => pt(!0, I, Ee),
      onClose: j
    }) : null,
    ge ? n(kc, {
      key: "materialize-derived-dialog",
      preview: Le,
      loading: ee,
      processing: Ie,
      error: G,
      cancelButtonRef: N,
      onConfirm: V,
      onClose: () => {
        Ie || z();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: Bn,
      className: `${Kt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      X.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: Wt ? { position: "absolute", top: 0, right: 0, width: H, height: b.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        dt.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : wn.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: De,
          onScroll: (I) => bn({
            scrollTop: I.currentTarget.scrollTop,
            height: I.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: qe.height }
        }, Pr.map((I) => {
          var ht;
          let Re;
          if (I.kind === "group") {
            const bt = O.includes(I.group.key), Zt = I.group.lanes.reduce((Ht, Br) => Ht + Br.markers.length, 0);
            Re = n("button", {
              type: "button",
              onClick: () => {
                hn(I.group.key), tt(I.group.key);
              },
              "aria-expanded": !bt,
              "aria-current": nn === I.group.key ? "true" : void 0,
              "data-segment-rail-group": I.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${nn === I.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, bt ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: I.group.name }, I.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Zt),
              A && bt ? n(en, { key: "states", counts: I.group.counts }) : null
            ]);
          } else I.kind === "lane" ? Re = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Jn(I.lane),
            "aria-label": Jn(I.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, I.lane.label),
            (ht = I.lane.performers) != null && ht.length ? n(Cr, {
              key: "performers",
              performers: I.lane.performers,
              performerAssignments: I.lane.performerAssignments
            }) : null,
            A ? n(en, { key: "states", counts: I.lane.counts }) : null
          ]) : Re = xt(I.segment);
          return n("div", {
            key: I.key,
            className: "absolute left-0 right-0",
            style: { top: I.top, height: I.height }
          }, Re);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${Kt ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: Fe,
          className: `${Kt ? "min-h-0 flex-1" : ""} grid`,
          style: Kt ? {
            gridTemplateRows: `minmax(16rem, ${(1 - X.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${X.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: ve,
            className: "grid min-h-0 gap-2",
            style: Wt ? {
              gridTemplateColumns: X.markerRailOpen ? `${te}px 0.5rem minmax(0,1fr) 0.5rem ${H}px` : `${te}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(wc, {
              key: "tools",
              compatibilityMode: A,
              selectedSegment: Lt,
              selectedSegments: rn,
              selectedGroups: Ot,
              saveMessage: Ze,
              savingSegmentId: Je,
              creatingSegmentId: _,
              acquireSaveLock: t,
              setSaveMessage: rr,
              saveTag: lt,
              slotStatus: Dn,
              performerSlotsAvailable: Q,
              selectedPerformerSlots: gn,
              performerSlots: Tt,
              detail: D,
              onDetailChange: mt,
              onCancelQueuedReview: m,
              video: ut,
              slotButtonRef: Ln,
              tagSearchRef: Er,
              tagEditing: Mr,
              onCancelTagEditing: W,
              detailPanelRef: q,
              onReduceSelection: (I) => {
                Pt(I), requestAnimationFrame(() => {
                  var Re;
                  return (Re = q.current) == null ? void 0 : Re.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Ut,
              onSlotsChanged: nt,
              onRecordHistory: Be,
              splitSegment: ar,
              duplicateSegment: pe,
              provenance: Te,
              lineage: U,
              onNavigateLineageItem: (I) => {
                const Re = dt.find((ht) => ht.itemId === I);
                Re && an(Re.id);
              }
            }),
            Wt ? n(
              "div",
              { key: "detail-separator", ...et("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            ut.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Ea, {
                streamUrl: `/api/stream/video/${ut.id}`,
                posterUrl: `/api/stream/video/${ut.id}/screenshot?v=${encodeURIComponent(ut.updatedAt || "")}`,
                format: ut.videoFile.format,
                audioCodec: ut.videoFile.audioCodec,
                duration: ut.videoFile.duration,
                videoId: ut.id,
                trackingEnabled: !1,
                onSeekRegister: (I) => {
                  Ce.current = I, Dl($t.current, dt, I) && ($t.current = null);
                },
                onPlaybackControlRegister: (I) => {
                  se.current = I;
                },
                onTimeUpdate: fn
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            Wt && X.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...et("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Wt && X.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: k,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...jr.map((I) => {
              var bt;
              const Re = (bt = ir[I.id]) == null ? void 0 : bt[0], ht = I.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : I.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: I.id,
                type: "button",
                disabled: I.disabled,
                "data-action-id": I.id,
                onClick: (Zt) => {
                  const Ht = Zt.currentTarget;
                  Dt(I.id, { target: Ht, preserveFocus: !0 }), I.focusWhenDisabled && requestAnimationFrame(() => {
                    Ic(Ht, k.current, I.focusWhenDisabled);
                  });
                },
                title: Re ? `${I.label} (${Re})` : I.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${ht}`
              }, [
                n("span", { key: "label" }, I.label),
                Re ? n("kbd", {
                  key: "shortcut",
                  className: "rounded border border-border/70 bg-background/70 px-1 py-0.5 font-mono text-[10px] leading-none text-secondary"
                }, Re) : null
              ]);
            }),
            n("div", { key: "frame-actions", className: "ml-auto flex items-center gap-1" }, [
              n("button", {
                key: "previous-frame",
                type: "button",
                disabled: !ut.videoFile,
                onClick: () => Sn(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(ws, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !ut.videoFile,
                onClick: () => Sn(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(Ns, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          Kt ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(kn.minimum * 100),
            "aria-valuemax": Math.round(kn.maximum * 100),
            "aria-valuenow": Math.round(X.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(X.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: le,
            onPointerMove: me,
            onKeyDown: re,
            onDoubleClick: () => Dr(It.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: Kt ? void 0 : { height: "20rem" } }, n(Nc, {
            segments: wn,
            shotBoundaries: vt,
            segmentGroups: $e,
            performerSlots: Tt,
            collapsedGroupKeys: O,
            selectedGroupKey: nn,
            selectedSegmentId: Lt == null ? void 0 : Lt.id,
            selectedSegmentIds: Xn,
            duration: Fn,
            currentTime: E,
            zoom: jn,
            onZoomChange: On,
            onSelectGroup: hn,
            onToggleGroup: tt,
            onSelect: (I, Re) => Pt(I, Re),
            onSelectSegments: Nt,
            onSelectAll: at,
            onConfigureTag: (I) => Qt(I),
            onSeekTime: (I) => {
              var Re;
              return (Re = Ce.current) == null ? void 0 : Re.call(Ce, I, !1);
            },
            centerRef: h,
            showReviewState: A,
            swimlaneTitleWidth: X.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (I) => Tr((Re) => ({ ...Re, swimlaneTitleWidth: I }))
          }))
        ])
      ])
    ]),
    w ? n(xo, {
      key: `configure-tag:${w.tagId}`,
      tagId: w.tagId,
      tagName: w.tagName,
      performerSlotsEnabled: A,
      onSaved: ct,
      onClose: () => {
        const I = w.trigger;
        Qt(null), requestAnimationFrame(() => {
          var Re;
          I != null && I.isConnected ? I.focus({ preventScroll: !0 }) : (Re = F.current) == null || Re.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    ke ? n(bc, {
      key: "publish-approved-dialog",
      drafts: Gn,
      processing: Je === -1,
      error: _e,
      cancelButtonRef: We,
      onConfirm: je,
      onClose: K
    }) : null,
    ot ? n(vc, {
      key: "rejected-deletion-dialog",
      preview: ot,
      onConfirm: () => {
        R(ot), requestAnimationFrame(() => {
          var I;
          return (I = F.current) == null ? void 0 : I.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Rr(null), requestAnimationFrame(() => {
          var I;
          return (I = F.current) == null ? void 0 : I.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    or ? n(gc, {
      key: "shortcuts-dialog",
      reviewMode: A,
      bindings: ir,
      onClose: () => vn(!1)
    }) : null,
    oe ? n(pc, {
      key: "incorrect-examples-dialog",
      examples: P,
      exporting: ae,
      removingExampleId: Pe,
      onExport: y,
      onRemove: Se,
      onClose: () => yn(!1)
    }) : null
  ]);
}
function $c(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: u, setEditorFilters: f, setHideDerivedSegments: m, setSaveMessage: p, setSelectedSegmentGroupKey: y, setSelectedSegmentId: h, setSelectedSegmentIds: C } = e;
  function x(O) {
    const k = jt(t, O);
    k && u((A) => vi(A, k));
  }
  function z(O) {
    h(O), C(O == null ? [] : [O]), c.current = O, g.current = [];
  }
  function j(O, {
    focusEditor: k = !1,
    seekToSegment: A = !1,
    additive: w = !1,
    rangeSegmentIds: T = null
  } = {}) {
    var E, R;
    const _ = Qs({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, O.id, T, w);
    C(_.selectedSegmentIds), h(_.activeSegmentId), c.current = _.anchorSegmentId, g.current = _.rangeBaseSegmentIds, _.activeSegmentId != null && y(jt(t, _.activeSegmentId)), x(O.id), k && ((E = r.current) == null || E.focus({ preventScroll: !0 })), A && ((R = i.current) == null || R.call(i, O.startSec, !1));
  }
  function K(O) {
    const k = Js(
      d,
      l,
      O
    );
    C(k.selectedSegmentIds), h(k.activeSegmentId), c.current = k.activeSegmentId, g.current = [], k.activeSegmentId != null && (y(jt(t, k.activeSegmentId)), x(k.activeSegmentId));
  }
  function W() {
    var A;
    const O = Xs(s), k = O.includes(l) ? l : O[0] ?? null;
    f(Et({})), m(!1), C(O), h(k), c.current = k, g.current = [], k != null && y(jt(
      cn(s, a, o),
      k
    )), p(O.length === 0 ? "There are no segments to select." : `${O.length} segments selected. Collapsed Segment groups keep their selected segments.`), (A = r.current) == null || A.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: x, replaceSegmentSelection: z, selectSegment: j, selectSegmentCollection: K, selectAllVideoSegments: W };
}
function Tc(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, stableSaveIdentity: c, historyRef: g, onConflict: u, onDetailChange: f, onReload: m, recordHistoryAction: p, revealSegmentGroupForSelection: y, savingSegmentId: h, selectedGroups: C, selectedSegment: x, selectedSegmentIdRef: z, selectedSegments: j, selectionAnchorIdRef: K, selectionRangeBaseIdsRef: W, setMergeConfirmation: O, setSaveMessage: k, setSelectedSegmentId: A, setSelectedSegmentIds: w, video: T } = e;
  function _() {
    O(null), requestAnimationFrame(() => {
      var q;
      return (q = a.current) == null ? void 0 : q.focus({ preventScroll: !0 });
    });
  }
  async function E(q = !1, te = !1, pe = null) {
    if (h != null) return;
    const be = pe || bi(
      C,
      { nativeOnly: !o }
    );
    if (!be) {
      k("Select at least two segments from one swimlane.");
      return;
    }
    if (!q && Wa()) {
      O(be);
      return;
    }
    te && Va(!1);
    const X = be.endSec == null ? "open end" : Ae(be.endSec);
    let F = be.segments[0];
    const ae = o ? null : Mt(be.segments, !1), ce = o ? null : crypto.randomUUID(), J = be.segments.map((me) => me.id), he = Rd(i, be.segments).segments.find((me) => me.id === F.id), ve = {
      startSec: he.startSec,
      endSec: he.endSec,
      sourceKey: he.sourceKey,
      sourceRunId: he.sourceRunId,
      confidence: he.confidence,
      isDerived: he.isDerived
    }, re = r("merge", be.segments[0].id);
    if (!re) return;
    _();
    const le = Yt();
    s({
      type: "add",
      entry: { id: le, op: "merge", targets: be.segments.map(qt), values: ve }
    }), w([F.id]), A(F.id), K.current = F.id, W.current = [];
    try {
      const me = be.segments.slice(1);
      if (!o || F.nativeSegmentId != null) {
        const Y = me.map((M) => {
          const ne = `merge-native-selection:${T.id}:${F.id}:${M.id}:${F.updatedAt}:${M.updatedAt}`;
          return { key: ne, operationId: Ke(ne), segmentId: M.id, expectedUpdatedAt: M.updatedAt };
        }), de = await Z(`/videos/${T.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: F.id,
            expectedSurvivorUpdatedAt: F.updatedAt,
            consumedSegments: Y.map(({ key: M, ...ne }) => ne),
            historyReceiptId: ce
          })
        });
        F = de.survivor, f((M) => ua(M, de), T.id), s({ type: "confirm", key: le, applied: !0 }), Y.forEach(({ key: M }) => ze(M));
      } else {
        const Y = me.map((M) => {
          const ne = `merge-draft-selection:${T.id}:${F.itemId}:${M.itemId}:${F.revision}:${M.revision}`;
          return { key: ne, operationId: Ke(ne), itemId: M.itemId, expectedRevision: M.revision };
        }), de = await Z(`/videos/${T.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: F.itemId,
            expectedSurvivorRevision: F.revision,
            consumedDrafts: Y.map(({ key: M, ...ne }) => ne)
          })
        });
        F = de.survivor, f((M) => ua(M, de), T.id), s({ type: "confirm", key: le, applied: !0 }), Y.forEach(({ key: M }) => ze(M));
      }
      w([F.id]), A(F.id), K.current = F.id, W.current = [], o ? t(Vt) : await p(
        "segments.merge",
        `Merged ${be.segments.length} segments`,
        ae,
        Mt([F], !1),
        ce
      ), y(F.id), k(`${be.segments.length} segments merged into ${Ae(be.startSec)} – ${X}.`);
    } catch (me) {
      s({ type: "discard", key: le }), w(J), A((x == null ? void 0 : x.id) ?? J[0] ?? null), K.current = (x == null ? void 0 : x.id) ?? J[0] ?? null, W.current = [], me.status === 409 ? await u() : k(me.message || "Unable to merge selected segments.");
    } finally {
      re();
    }
  }
  function R(q, te = j, pe = x) {
    if (te.length === 0) return Promise.resolve(null);
    const be = ml(q, te, pe), X = Math.max(0, be.identities.indexOf(be.activeIdentity)), F = d(), ae = Si(F) != null || F.queued.some((J) => ho(J.targets, be.identities.map(c))), ce = l({
      kind: "review",
      lockId: be.activeIdentity.id,
      targets: be.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (J) => D(J, {
        ...be,
        identities: J.targets,
        activeIdentity: J.targets[X]
      })
    });
    return ce ? (ae && k(`${q === "approved" ? "Approval" : "Rejection"} queued…`), ce.done) : (k("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function D({ detail: q, segments: te, onConflict: pe, onReload: be }, X) {
    var de;
    const F = gl(X, te);
    if (!F) {
      k("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: ae, selectedSegments: ce, selectedSegment: J } = F, he = ul(ce, ae), ve = ce.filter((M) => M.reviewState !== he);
    if (ve.length === 0) return;
    const re = ce.map((M) => ({
      id: M.id,
      itemId: M.itemId,
      nativeSegmentId: M.nativeSegmentId
    })), le = re.find((M) => M.id === (J == null ? void 0 : J.id)) || re[0], me = (M, ne = !1) => {
      if (!(M != null && M.segments) || !ne && !eo(z.current, le.id))
        return;
      const $ = re.map((b) => Ye(M == null ? void 0 : M.segments, b)).filter(Boolean), v = Ye(M == null ? void 0 : M.segments, le) || $[0] || null;
      w($.map((b) => b.id)), A((v == null ? void 0 : v.id) ?? null), K.current = (v == null ? void 0 : v.id) ?? null, W.current = [];
    };
    k(`Updating ${ve.length} selected segment${ve.length === 1 ? "" : "s"}…`);
    const Y = Yt();
    s({
      type: "add",
      entry: { id: Y, op: "patch", targets: ve.map(qt), values: { reviewState: he } }
    });
    try {
      const M = await Z(`/videos/${T.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: g.current.revision,
          reviewState: he,
          segments: ce.map((b) => b.published ? {
            nativeSegmentId: b.nativeSegmentId,
            expectedUpdatedAt: b.updatedAt
          } : {
            itemId: b.itemId,
            expectedRevision: b.revision
          })
        })
      }), ne = new Map((M.items || []).map((b) => [
        b.requestedNativeSegmentId != null ? `native:${b.requestedNativeSegmentId}` : `item:${b.requestedItemId}`,
        b
      ]));
      if (re.forEach((b) => {
        const S = ne.get(b.nativeSegmentId != null ? `native:${b.nativeSegmentId}` : `item:${b.itemId}`);
        S && (b.nativeSegmentId = S.nativeSegmentId, b.itemId = S.itemId);
      }), M.history && t(M.history), he === "rejected" || (M.items || []).some((b) => b.requestedNativeSegmentId != null && b.nativeSegmentId !== b.requestedNativeSegmentId)) {
        const b = await be();
        s({ type: "confirm", key: Y, applied: b != null }), me(b), k(`${M.updatedCount} selected segment${M.updatedCount === 1 ? "" : "s"} ${he === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const v = (b) => ({
        ...b,
        approvedSetVersion: M.approvedSetVersion || b.approvedSetVersion,
        segments: (b.segments || []).map((S) => {
          const P = ne.get(S.nativeSegmentId != null ? `native:${S.nativeSegmentId}` : `item:${S.itemId}`);
          return P ? {
            ...S,
            id: P.nativeSegmentId != null ? P.nativeSegmentId : -P.itemId,
            itemId: P.itemId,
            nativeSegmentId: P.nativeSegmentId,
            published: P.nativeSegmentId != null,
            reviewState: he,
            revision: P.nativeSegmentId != null ? S.revision : P.revision,
            updatedAt: P.updatedAt
          } : S;
        })
      });
      f(v, T.id), s({ type: "confirm", key: Y, applied: !0 }), me(v(q)), k(`${M.updatedCount} selected segment${M.updatedCount === 1 ? "" : "s"} ${he === "approved" ? "approved" : he === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (M) {
      s({ type: "discard", key: Y }), M.status === 409 && ((de = M.payload) != null && de.currentHistory) && t(M.payload.currentHistory);
      const ne = M.status === 409 ? await pe() : q;
      me(ne, !0), k(M.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: _, mergeSelectedSwimlane: E, saveSelectedReviewState: R };
}
function Ac(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: g, detail: u, editorFilters: f, editorRef: m, cancelSaveTasks: p, dispatchPendingChanges: y, enqueueSave: h, stableSaveIdentity: C, exportingExamples: x, hideDerivedSegments: z, incorrectExamples: j, lineage: K, materializeButtonRef: W, materializePreview: O, materializeRestoreFocusRef: k, materializing: A, mutateSegment: w, runSegmentMutation: T, pendingChanges: _, onConflict: E, onDetailChange: R, onReload: D, performerSlots: q, recordHistoryAction: te, refreshMaterializationPreview: pe, removingExampleId: be, revealSegmentGroupForSelection: X, savingSegmentId: F, segmentGroups: ae, segments: ce, selectedSegment: J, selectedSegmentIdRef: he, selectedSegments: ve, selectionAnchorIdRef: re, selectionRangeBaseIdsRef: le, setAutoAssignError: me, setAutoAssignOpen: Y, setAutoAssigning: de, setEditorFilters: M, setExportingExamples: ne, setHideDerivedSegments: $, setIncorrectExamples: v, setMaterializeError: b, setMaterializeLoading: S, setMaterializeOpen: P, setMaterializePreview: oe, setMaterializing: U, setRejectedDeletionPreview: H, setRemovingExampleId: ue, setSaveMessage: N, setSelectedSegmentGroupKey: V, setSelectedSegmentId: G, setSelectedSegmentIds: ee, video: ge } = e;
  async function Le() {
    var we, Be, ot;
    if (ve.length === 0 || !J || F != null) return;
    const Q = wd(ve, j), se = Q.segments;
    if (se.length === 0) return;
    const Ne = ve.map((Se) => ({
      id: Se.id,
      itemId: Se.itemId,
      nativeSegmentId: Se.nativeSegmentId
    })), Te = Ne.find((Se) => Se.id === J.id) || Ne[0], xe = [], We = [];
    let je = !1, _e = u, ke = !1;
    const Ue = [], De = r("feedback", Te.id);
    if (De) {
      N(Q.action === "remove" ? `Removing ${se.length} selected incorrect example${se.length === 1 ? "" : "s"}…` : `Collecting ${se.length} selected segment${se.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const Se = async (Ce, $e) => {
          const qe = Ce.nativeSegmentId != null, dt = Q.action === "remove" ? `incorrect-example-remove:${ge.id}:${$e == null ? void 0 : $e.id}:${$e == null ? void 0 : $e.revision}:${$e == null ? void 0 : $e.representationRevision}` : `incorrect-example-collect:${ge.id}:${qe ? `native:${Ce.nativeSegmentId}:${Ce.updatedAt}` : `item:${Ce.itemId}:${Ce.revision}`}`;
          if (Q.action === "remove" && !$e)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let at;
          try {
            at = Q.action === "remove" ? await Z(
              `/videos/${ge.id}/incorrect-examples/${$e.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: Ke(dt),
                  expectedExampleRevision: $e.revision,
                  expectedRepresentationRevision: $e.representationRevision
                })
              }
            ) : await Z(`/videos/${ge.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Ke(dt),
                nativeSegmentId: qe ? Ce.nativeSegmentId : null,
                itemId: qe ? null : Ce.itemId,
                expectedUpdatedAt: qe ? Ce.updatedAt : null,
                expectedRevision: qe ? null : Ce.revision
              })
            });
          } catch (Pt) {
            throw Pt.operationKey = dt, Pt;
          }
          if (!Nd(Q.action, at))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return ze(dt), at;
        };
        for (const Ce of se) {
          const $e = Q.action === "remove" ? j.find((qe) => qe.itemId != null && qe.itemId === Ce.itemId) : null;
          try {
            const qe = Ne.find((Nt) => Nt.id === Ce.id);
            let dt = Ye(
              _e == null ? void 0 : _e.segments,
              qe
            ) || Ce, at;
            try {
              at = await Se(dt, $e);
            } catch (Nt) {
              if (Nt.status === 409 && ((Be = (we = Nt.payload) == null ? void 0 : we.result) == null ? void 0 : Be.code) === "OPERATION_REPLAYED")
                _e = await Z(
                  `/videos/${ge.id}/editor`
                ), ke = !0, Ue.length = 0, ze(Nt.operationKey), at = Nt.payload.result;
              else {
                if (Q.action !== "collect" || Nt.status !== 409) throw Nt;
                const Ot = await Z(
                  `/videos/${ge.id}/editor`
                );
                _e = Ot, ke = !0, Ue.length = 0;
                const gn = Ye(
                  Ot == null ? void 0 : Ot.segments,
                  qe
                );
                if (!gn) throw Nt;
                dt = gn, at = await Se(dt, null);
              }
            }
            qe && at.itemId != null && (qe.itemId = at.itemId), _e = br(
              _e,
              at.editorDelta
            ), Ue.push(at.editorDelta);
            const Pt = { segment: Ce, result: at, example: $e };
            xe.push(Pt);
          } catch (qe) {
            if (We.push(qe), ![400, 404, 409].includes(qe.status)) break;
          }
        }
        if (c && xe.length > 0) {
          const Ce = Q.action === "remove", $e = xe.length;
          await te(
            Ce ? "feedback.remove" : "feedback.collect",
            Ce ? `Removed ${$e} incorrect AI example${$e === 1 ? "" : "s"}` : `Collected ${$e} incorrect AI example${$e === 1 ? "" : "s"}`,
            mr(xe, Ce),
            mr(xe, !Ce)
          ) || (je = !0);
        }
        xe.some(({ result: Ce }) => Ce.representation === "basicNativeBin") && _n();
        const Pe = eo(
          he.current,
          Te.id
        ), Me = Q.action === "collect" && xe.some(({ segment: Ce }) => Ce.id === Te.id), Dt = xe.map(({ segment: Ce }) => Ce.id), Ze = Me ? tl(
          o,
          Dt,
          Te.id
        ) : null, lt = Me ? (Ze == null ? void 0 : Ze.id) ?? null : Te.id;
        Pe && Me && (ee(Ze ? [Ze.id] : []), G((Ze == null ? void 0 : Ze.id) ?? Sr), re.current = (Ze == null ? void 0 : Ze.id) ?? null, le.current = []);
        const Ut = await Z(`/videos/${ge.id}/incorrect-examples`);
        v(Ut);
        const Je = _e;
        if (R(ke ? Je : (Ce) => Ue.reduce(br, Ce), ge.id), Pe && eo(
          he.current,
          lt
        )) {
          let Ce, $e;
          Me ? ($e = Ze ? Ye(Je == null ? void 0 : Je.segments, {
            id: Ze.id,
            itemId: Ze.itemId,
            nativeSegmentId: Ze.nativeSegmentId
          }) : null, Ce = $e ? [$e] : []) : (Ce = Ne.map((qe) => Ye(Je == null ? void 0 : Je.segments, qe)).filter(Boolean), $e = Ye(Je == null ? void 0 : Je.segments, Te) || Ce[0] || null), ee(Ce.map((qe) => qe.id)), G(($e == null ? void 0 : $e.id) ?? (Me ? Sr : null)), re.current = ($e == null ? void 0 : $e.id) ?? null, le.current = [], V($e ? jt(o, $e.id) : null), $e && X($e.id);
        }
        if (We.length > 0) {
          const Ce = ((ot = We[0]) == null ? void 0 : ot.message) || "Only segments with registered AI provenance can be collected.";
          xe.length === 0 ? N(Ce) : Q.action === "remove" ? N(
            `Partially removed ${xe.length} of ${se.length} selected incorrect examples. ${Ce}`
          ) : N(
            `Partially collected ${xe.length} of ${se.length} selected segments. ${Ce}`
          );
        } else if (Q.action === "remove")
          N(
            `${xe.length} incorrect example${xe.length === 1 ? "" : "s"} removed and ${xe.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const Ce = xe.filter(({ result: $e }) => $e.representation === "basicNativeBin").length;
          N(Ce === xe.length ? `${xe.length} incorrect AI example${xe.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${xe.length} incorrect AI example${xe.length === 1 ? "" : "s"} collected and ${xe.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        je && N("The change saved, but editor history could not be updated.");
      } catch (Se) {
        N(Se.message || "Unable to update the selected incorrect examples.");
      } finally {
        De();
      }
    }
  }
  async function Ie(Q) {
    if (!Q || be != null || x) return;
    const se = r("feedback", -1);
    if (!se) {
      N("Wait for the current save to finish before removing the incorrect example.");
      return;
    }
    try {
      await Fe(Q);
    } finally {
      se();
    }
  }
  async function Fe(Q) {
    var Ne, Te;
    ue(Q.id);
    const se = `incorrect-example-remove:${ge.id}:${Q.id}:${Q.revision}:${Q.representationRevision}`;
    try {
      let xe, We = !1;
      try {
        xe = await Z(
          `/videos/${ge.id}/incorrect-examples/${Q.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ke(se),
              expectedExampleRevision: Q.revision,
              expectedRepresentationRevision: Q.representationRevision
            })
          }
        );
      } catch (ke) {
        if (ke.status !== 409 || ((Te = (Ne = ke.payload) == null ? void 0 : Ne.result) == null ? void 0 : Te.code) !== "OPERATION_REPLAYED")
          throw ke;
        xe = ke.payload.result, We = !0;
      }
      ze(se);
      let je = !0;
      if (c) {
        const Ue = [{ segment: Ye(u.segments, {
          itemId: Q.itemId
        }) || {
          id: Q.itemId == null ? null : -Q.itemId,
          itemId: Q.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: Q.representationRevision
        }, result: xe, example: Q }];
        je = await te(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          mr(Ue, !0),
          mr(Ue, !1)
        );
      }
      const _e = await Z(
        `/videos/${ge.id}/incorrect-examples`
      );
      v(_e), We ? await D() : R(
        (ke) => br(ke, xe.editorDelta),
        ge.id
      ), Q.representation === "basicNativeBin" && _n(), N(je ? We ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : Q.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (xe) {
      xe.status === 409 && await E(), N(xe.message || "Unable to remove the incorrect example.");
    } finally {
      ue(null);
    }
  }
  async function Ge() {
    if (x || be != null || j.length === 0) return;
    ne(!0);
    const Q = `incorrect-example-export:${ge.id}:${j.map((se) => `${se.id}:${se.revision}:${se.representationRevision}`).join(",")}`;
    try {
      const se = await Cd(
        ge.id,
        j
      ), Ne = new FormData();
      Ne.append("metadata", JSON.stringify({
        operationId: Ke(Q),
        examples: se.captures
      }));
      for (const ke of se.files)
        Ne.append(ke.fieldName, ke.file);
      const Te = await Z(
        `/videos/${ge.id}/incorrect-examples/export`,
        { method: "POST", body: Ne }
      ), xe = await zl(Te.downloadUrl), We = URL.createObjectURL(xe.blob), je = document.createElement("a");
      je.href = We, je.download = xe.fileName, je.click(), setTimeout(() => URL.revokeObjectURL(We), 1e3);
      const _e = await Z(
        `/training-exports/${Te.id}/complete`,
        { method: "POST" }
      );
      ze(Q), v(await Z(
        `/videos/${ge.id}/incorrect-examples`
      )), N(
        `Downloaded ${Te.exampleCount} incorrect example${Te.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${_e.clearedExampleCount} from the working collection.`
      );
    } catch (se) {
      N(se.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      ne(!1);
    }
  }
  async function Ee(Q = null) {
    const se = ce.filter((we) => we.reviewState === "rejected"), Ne = se.length, Te = j.some((we) => we.representation === "fullItem");
    if (Q == null && Ne === 0 && !Te) {
      N("There are no rejected segments to delete.");
      return;
    }
    if (Q == null) {
      const we = r("delete-rejected", -1);
      if (!we) return;
      N("Preparing deletion summary…");
      try {
        const Be = await Z(`/videos/${ge.id}/rejected/deletion/preview`, { method: "POST" }), ot = Number(Be.deletedSegmentCount) || 0, Se = Number(Be.deferredRejectedSegmentCount) || 0, Pe = Number(Be.protectedIncorrectExampleCount) || 0;
        if (ot === 0) {
          Se > 0 ? N(
            `${Se} feedback-protected rejected segment${Se === 1 ? "" : "s"} kept. ${Pe} AI feedback example${Pe === 1 ? "" : "s"} must be exported before ${Se === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : N("There are no rejected segments to delete.");
          return;
        }
        if (!li(Be, N)) return;
        H(Be), N("");
      } catch (Be) {
        N(Be.message || "Unable to prepare rejected segment deletion.");
      } finally {
        we();
      }
      return;
    }
    const xe = Q, We = Number(xe.deferredRejectedSegmentCount) || 0, je = he.current, _e = We === 0 ? Ad(u, se.map((we) => we.id)) : u, ke = _e.segments.find((we) => we.reviewState === "unreviewed") || _e.segments[0] || null, Ue = r("delete-rejected", -1);
    if (!Ue) return;
    H(null), N("Deleting rejected segments…");
    const De = We === 0 ? Yt() : null;
    De && (y({
      type: "add",
      entry: { id: De, op: "remove", targets: se.map(qt) }
    }), ee(ke ? [ke.id] : []), G((ke == null ? void 0 : ke.id) ?? null), re.current = (ke == null ? void 0 : ke.id) ?? null, le.current = []);
    try {
      const we = `rejected-dependency-delete:${ge.id}:${xe.fingerprint}`, Be = await Z(`/videos/${ge.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ke(we),
          fingerprint: xe.fingerprint
        })
      });
      ze(we);
      const ot = await D();
      De && y({ type: "confirm", key: De, applied: ot != null }), Be.deletedSegmentCount > 0 && t(Vt);
      const Se = We > 0 ? ` ${We} feedback-protected rejected segment${We === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      N(`${Be.deletedSegmentCount} segment${Be.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Se}`);
    } catch (we) {
      De && y({ type: "discard", key: De }), ee(je == null ? [] : [je]), G(je), re.current = je, le.current = [], N(we.message || "Unable to delete rejected segments.");
    } finally {
      Ue();
    }
  }
  async function Ve(Q = i) {
    if (a || Q.length === 0) return;
    const se = r("auto-assign", -1);
    if (!se) {
      me("Wait for the current save to finish before assigning performers.");
      return;
    }
    try {
      await pt(Q);
    } finally {
      se();
    }
  }
  async function pt(Q) {
    de(!0), me("");
    try {
      const se = await Z(`/videos/${ge.id}/segments/auto-assign-performer-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeSegmentIds: Q.flatMap((Ne) => Ne.nativeSegmentId == null ? [] : [Ne.nativeSegmentId]),
          itemIds: Q.flatMap((Ne) => Ne.published || Ne.itemId == null ? [] : [Ne.itemId])
        })
      });
      Y(!1), await D(), N(`${se.assignedSegmentCount} segment${se.assignedSegmentCount === 1 ? "" : "s"} received ${se.assignedSlotCount} performer-slot assignment${se.assignedSlotCount === 1 ? "" : "s"}.`);
    } catch (se) {
      me(se.message || "Unable to auto-assign performers.");
    } finally {
      de(!1);
    }
  }
  async function Qe() {
    P(!0), b(""), !O && (S(!0), pe());
  }
  function mt() {
    k.current = !0, P(!1), requestAnimationFrame(() => {
      var Q;
      return (Q = W.current) == null ? void 0 : Q.focus({ preventScroll: !0 });
    });
  }
  async function rt() {
    if (!O || A || O.createCount + O.linkCount === 0)
      return;
    const Q = r("materialize", -1);
    if (!Q) {
      b("Wait for the current save to finish before materializing derived segments.");
      return;
    }
    try {
      await ct();
    } finally {
      Q();
    }
  }
  async function ct() {
    U(!0), b("");
    let Q;
    try {
      const se = `materialize-derived:${ge.id}:${O.fingerprint}`;
      Q = await Z(`/videos/${ge.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ke(se),
          fingerprint: O.fingerprint,
          maxDepth: 3
        })
      }), ze(se);
    } catch (se) {
      se.status === 409 && oe(null), b(se.message || "Unable to materialize derived segments."), U(!1);
      return;
    }
    oe((se) => se && { ...se, createCount: 0, linkCount: 0 });
    try {
      await D(), mt(), oe(null);
      const se = Q.createdCount + Q.linkedCount;
      N(`${Q.createdCount} derived segment${Q.createdCount === 1 ? "" : "s"} created and ${Q.linkedCount} existing segment${Q.linkedCount === 1 ? "" : "s"} linked.`), se === 0 && N("Every applicable derivation was already materialized.");
    } catch {
      b("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    U(!1);
  }
  async function nt(Q, se = null) {
    var xe, We, je, _e;
    const Ne = {
      tagId: Q,
      ...se ? { tagName: se } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (ve.length > 1) {
      const ke = ve.filter((Se) => Se.tagId !== Q);
      if (ke.length === 0) {
        d();
        return;
      }
      const Ue = ve.map((Se) => ({
        id: Se.id,
        itemId: Se.itemId,
        nativeSegmentId: Se.nativeSegmentId
      })), De = ve.map((Se) => !c || Se.nativeSegmentId != null ? `native:${Se.nativeSegmentId}:${Se.updatedAt}` : `item:${Se.itemId}:${Se.revision}`).sort().join(","), we = `bulk-tag:${ge.id}:${Q}:${De}`, Be = r("tag", (J == null ? void 0 : J.id) ?? ke[0].id);
      if (!Be) return;
      N(`Changing tag for ${ke.length} selected segment${ke.length === 1 ? "" : "s"}…`);
      const ot = Yt();
      y({
        type: "add",
        entry: { id: ot, op: "patch", targets: ke.map(qt), values: Ne }
      }), d();
      try {
        const Se = c ? null : crypto.randomUUID();
        await Z(`/videos/${ge.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ke(we),
            tagId: Q,
            historyReceiptId: Se,
            segments: ve.map((lt) => {
              const Ut = !c || lt.nativeSegmentId != null;
              return {
                nativeSegmentId: Ut ? lt.nativeSegmentId : null,
                itemId: Ut ? null : lt.itemId,
                expectedUpdatedAt: Ut ? lt.updatedAt : null,
                expectedRevision: Ut ? null : lt.revision
              };
            })
          })
        }), ze(we);
        const Pe = Mt(
          ve,
          c
        ), Me = await D();
        y({ type: "confirm", key: ot, applied: Me != null });
        const Dt = Ue.map((lt) => Ye(Me == null ? void 0 : Me.segments, lt)).filter(Boolean);
        await te(
          "segments.tag",
          `Changed tag for ${ke.length} segment${ke.length === 1 ? "" : "s"}`,
          Pe,
          Mt(Dt, c),
          Se
        );
        const Ze = Ue.map((lt) => Ye(Me == null ? void 0 : Me.segments, lt)).filter(Boolean);
        ee(Ze.map((lt) => lt.id)), G(((xe = Ze.find((lt) => lt.id === (J == null ? void 0 : J.id))) == null ? void 0 : xe.id) ?? ((We = Ze[0]) == null ? void 0 : We.id) ?? null), d(), N(`${ke.length} selected segment${ke.length === 1 ? "" : "s"} retagged.`);
      } catch (Se) {
        y({ type: "discard", key: ot });
        const Pe = Ue.map((Dt) => Ye(u.segments, Dt)).filter(Boolean), Me = Ye(u.segments, {
          id: J == null ? void 0 : J.id,
          itemId: J == null ? void 0 : J.itemId,
          nativeSegmentId: J == null ? void 0 : J.nativeSegmentId
        }) || Pe[0] || null;
        ee(Pe.map((Dt) => Dt.id)), G((Me == null ? void 0 : Me.id) ?? null), re.current = (Me == null ? void 0 : Me.id) ?? null, le.current = [], Se.status === 409 && await E(), N(Se.message || "Unable to change the selected segment tags.");
      } finally {
        Be();
      }
      return;
    }
    if (ve.length !== 1 || !J) return;
    const Te = ki(_, J);
    if (J.id === g || Te) {
      const ke = Te ? { segmentId: J.id, tagId: Te.values.tagId, tagName: Te.meta.tagName } : null, Ue = hl(ke, J, Q, se);
      if (Ue && !gt(J, Ue)) {
        d();
        return;
      }
      if (Te && (p((De) => {
        var we;
        return ((we = De.meta) == null ? void 0 : we.pendingChangeId) === Te.id;
      }), y({ type: "discard", key: Te.id })), Ue) {
        const De = Ja(
          { ...J, tagId: Ue.tagId },
          q,
          f,
          z,
          ae
        );
        M(De.filters), $(De.hideDerivedSegments), N("Tag change queued…");
      } else Te && N("");
      d();
      return;
    }
    if (Q === J.tagId) {
      d();
      return;
    }
    if (J.itemId != null && ((_e = (je = K.data) == null ? void 0 : je.children) == null ? void 0 : _e.length) > 0) {
      const ke = r("lineage-tag", J.id);
      if (!ke) return;
      N("Checking lineage impact…");
      let Ue = null;
      try {
        const De = await Z(`/items/${J.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: J.revision, tagId: Q })
        }), we = De.deletedItemIds.length > 0 || De.removedEdgeIds.length > 0;
        if (we && !window.confirm(
          `Changing this tag removes ${De.removedEdgeIds.length} lineage edge${De.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${De.deletedItemIds.length} derived segment${De.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
        )) {
          N("Tag change canceled.");
          return;
        }
        Ue = Yt(), y({
          type: "add",
          entry: { id: Ue, op: "patch", targets: [qt(J)], values: Ne }
        }), d();
        const Be = `tag-change:${J.itemId}:${J.revision}:${De.componentFingerprint}:${Q}`;
        await Z(`/items/${J.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ke(Be),
            expectedRevision: J.revision,
            componentFingerprint: De.componentFingerprint,
            tagId: Q
          })
        }), ze(Be);
        const ot = await D();
        y({ type: "confirm", key: Ue, applied: ot != null }), d(), N(we ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch (De) {
        Ue && y({ type: "discard", key: Ue }), ee([J.id]), G(J.id), re.current = J.id, le.current = [], De.status === 409 ? (N("Lineage changed — loading the latest segments…"), await E()) : N(De.message || "Unable to reconcile the lineage.");
      } finally {
        ke();
      }
      return;
    }
    d(), await w(J, {
      startSec: J.startSec,
      endSec: J.endSec,
      tagId: Q
    }, !0, null, !0, Ne);
  }
  function gt(Q, se) {
    const Ne = Yt(), Te = C(qt(Q));
    y({
      type: "add",
      entry: {
        id: Ne,
        op: "patch",
        targets: [Te],
        values: { tagId: se.tagId, tagName: se.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: se.tagName }
      }
    });
    const xe = _.find((je) => je.op === "insert" && je.segment.id === Q.id);
    return h({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [Te],
      dependsOn: (xe == null ? void 0 : xe.taskId) ?? null,
      meta: { pendingChangeId: Ne },
      ready: (je, _e) => {
        const ke = xi(je.segments, _e.targets[0]);
        return !ke || vl(je, ke.id);
      },
      run: (je) => et(je, Ne, se)
    }) ? !0 : (y({ type: "discard", key: Ne }), N("Wait for the history restore to finish."), !1);
  }
  async function et(Q, se, Ne) {
    const [Te] = Q.resolveTargets();
    if (!Te) {
      y({ type: "discard", key: se }), N(`The new segment was not retagged${Ne.tagName ? ` to ${Ne.tagName}` : ""}. Choose its tag again.`);
      return;
    }
    if (Te.tagId === Ne.tagId) {
      y({ type: "discard", key: se });
      return;
    }
    await T(Te, {
      startSec: Te.startSec,
      endSec: Te.endSec,
      tagId: Ne.tagId
    }, {
      pendingChangeId: se,
      restoreSelectionOnFailure: !1,
      onReload: Q.onReload,
      onConflict: Q.onConflict
    }) || N(`The new segment was not retagged${Ne.tagName ? ` to ${Ne.tagName}` : ""}. Choose its tag again.`);
  }
  async function $t() {
    var _e, ke, Ue, De;
    if (!l || !J || F != null) return;
    const Q = [...ve].sort((we, Be) => Number(we.nativeSegmentId ?? we.id) - Number(Be.nativeSegmentId ?? Be.id)), se = new Set(Q.map((we) => we.id)), Ne = Q.map((we) => `${we.nativeSegmentId ?? we.id}:${we.updatedAt}`).join("|"), Te = r("bin", J.id);
    if (!Te) return;
    N(`Moving ${Q.length} segment${Q.length === 1 ? "" : "s"} to recycling bin…`);
    const xe = `bulk-move:${ge.id}:${Ne}`, We = Ke(xe), je = c ? null : crypto.randomUUID();
    try {
      const we = (Pe = !1) => Z(`/videos/${ge.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: We,
          segments: Q.map((Me) => ({
            segmentId: Me.nativeSegmentId ?? Me.id,
            expectedUpdatedAt: Me.updatedAt
          })),
          discardMissingImage: Pe,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: je
        })
      });
      let Be;
      try {
        Be = await we(
          mo(xe)
        );
      } catch (Pe) {
        if (((_e = Pe.payload) == null ? void 0 : _e.code) !== "missing-image" || !window.confirm(`${Pe.message}

Continue and discard the missing image reference?`)) throw Pe;
        go(xe), Be = await we(!0);
      }
      ze(xe), _n();
      const ot = new Map((Be.items || []).map((Pe) => [
        Number(Pe.segmentId),
        Pe
      ]));
      await te(
        "segments.moveToBin",
        `Moved ${Q.length} segment${Q.length === 1 ? "" : "s"} to recycling bin`,
        Mt(Q, !1),
        Mt(Q.map((Pe) => {
          const Me = ot.get(
            Number(Pe.nativeSegmentId ?? Pe.id)
          );
          return {
            ...Pe,
            recycleBinItemId: (Me == null ? void 0 : Me.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (Me == null ? void 0 : Me.revision) ?? null
          };
        }), !1),
        je
      );
      const Se = el(o, se, J.id);
      R((Pe) => ({
        ...Pe,
        segments: (Pe.segments || []).filter((Me) => !se.has(Me.id))
      }), ge.id), ee(Se ? [Se.id] : []), G((Se == null ? void 0 : Se.id) ?? null), re.current = (Se == null ? void 0 : Se.id) ?? null, le.current = [], Se && (V(jt(o, Se.id)), X(Se.id)), requestAnimationFrame(() => {
        var Pe;
        return (Pe = m.current) == null ? void 0 : Pe.focus({ preventScroll: !0 });
      }), N(`Moved ${Q.length} segment${Q.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (we) {
      const Be = ((ke = we.payload) == null ? void 0 : ke.code) || ((De = (Ue = we.payload) == null ? void 0 : Ue.result) == null ? void 0 : De.code);
      we.status === 409 && Be === "CANONICAL_SEGMENT_CHANGED" ? await E() : N(we.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Te();
    }
  }
  async function Tt() {
    if (!(c || s.current || F != null)) {
      s.current = !0, N("Checking the recycling bin…");
      try {
        const Q = await Z("/bin"), se = await ci(Q, () => N("Emptying the recycling bin…"));
        if (se.status === "empty") {
          N("The recycling bin is empty.");
          return;
        }
        if (se.status === "canceled") {
          N("The recycling bin was not emptied.");
          return;
        }
        N(`${se.segmentCount} segment${se.segmentCount === 1 ? "" : "s"} from ${se.sceneCount} scene${se.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (Q) {
        N(Q.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: Le, removeIncorrectExample: Ie, captureTrainingExport: Ge, deleteRejectedSegments: Ee, autoAssignPerformers: Ve, previewDerivedSegments: Qe, closeMaterializeDialog: mt, materializeDerivedSegments: rt, saveTag: nt, moveToBin: $t, emptyRecyclingBin: Tt };
}
function Rc(e) {
  const { acceptHistory: t, acquireSaveLock: r, enqueueSave: o, getSaveQueueSnapshot: i, commonActionsRef: a, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: g, history: u, historyRef: f, historySaving: m, horizontalLayoutSize: p, mediaStackHeight: y, mediaStackRef: h, onDetailChange: C, onReload: x, railToggleRef: z, recordHistoryAction: j, savingSegmentId: K, setCollapsedSegmentGroups: W, setEditorLayout: O, setHistorySaving: k, setIncorrectExamples: A, setSaveMessage: w, shotBoundaries: T, timelineDuration: _, video: E, workspaceRef: R } = e;
  async function D($, v, b) {
    var U, H, ue, N;
    const S = $.type === "segment" ? [$] : $.segments || [], P = (v == null ? void 0 : v.type) === "segment" ? [v] : (v == null ? void 0 : v.segments) || [];
    let oe = b;
    for (const [V, G] of S.entries()) {
      const ee = P[V], ge = ((U = G.identity) == null ? void 0 : U.nativeSegmentId) != null || ((H = G.identity) == null ? void 0 : H.published) === !0, Le = ((ue = ee == null ? void 0 : ee.identity) == null ? void 0 : ue.recycleBinItemId) ?? ((N = ee == null ? void 0 : ee.identity) == null ? void 0 : N.itemId);
      let Ie = Ye(oe.segments, ee == null ? void 0 : ee.identity) || Ye(oe.segments, G.identity);
      if (!Ie && ge && Le != null && ee.identity.revision != null) {
        const Ee = `history-restore:${E.id}:${Le}:${ee.identity.revision}`;
        await Z(`/bin/${Le}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ke(Ee),
            expectedRevision: ee.identity.revision
          })
        }), ze(Ee), oe = await x(), Ie = oe.segments.find((Ve) => Ve.tagId === G.values.tagId && Ve.startSec === G.values.startSec && Ve.endSec === G.values.endSec);
      }
      if (!Ie)
        throw new Error("A segment in this history state no longer exists.");
      if ((Ie.nativeSegmentId != null || Ie.published === !0) !== ge) {
        if (ge) {
          const Ee = Ie.recycleBinItemId ?? Ie.itemId ?? Le;
          if (Ee == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Ve = `history-restore:${E.id}:${Ee}:${Ie.revision}:${G.values.reviewState ?? "native"}`;
          await Z(`/bin/${Ee}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ke(Ve),
              expectedRevision: Ie.revision
            })
          }), ze(Ve);
        } else {
          const Ee = `history-bin:${E.id}:${Ie.nativeSegmentId}:${Ie.updatedAt}:${G.values.reviewState}`;
          await Z(`/videos/${E.id}/segments/${Ie.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ke(Ee),
              expectedUpdatedAt: Ie.updatedAt,
              reviewState: G.values.reviewState
            })
          }), ze(Ee);
        }
        if (oe = await x(), !ge)
          continue;
        if (Ie = Ye(oe.segments, G.identity) || oe.segments.find((Ee) => Ee.tagId === G.values.tagId && Ee.startSec === G.values.startSec && Ee.endSec === G.values.endSec), !Ie)
          throw new Error("The restored segment could not be found.");
      }
      const Ge = G.values;
      if (Ie.nativeSegmentId == null && Ie.itemId != null) {
        const Ee = `history-draft-update:${E.id}:${Ie.itemId}:${Ie.revision}:${Ge.tagId}:${Ge.startSec}:${Ge.endSec ?? "open"}:${Ge.reviewState}`;
        await Z(`/videos/${E.id}/drafts/${Ie.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ke(Ee),
            expectedRevision: Ie.revision,
            ...Ge
          })
        }), ze(Ee);
      } else
        await Z(`/videos/${E.id}/segments/${Ie.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Ge, expectedUpdatedAt: Ie.updatedAt })
        });
      oe = await x();
    }
    return oe;
  }
  async function q($, v) {
    var b;
    for (const S of $.targets || []) {
      const P = Ye(v.segments, S.identity);
      if (!P)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const oe = (b = v.performerSlotRevisions) == null ? void 0 : b[P.id];
      await Z(P.published ? `/videos/${E.id}/segments/${P.nativeSegmentId}/slots` : `/videos/${E.id}/drafts/${P.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: oe,
          assignments: S.assignments
        })
      }), v = await x();
    }
    return v;
  }
  async function te($, v, b) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let S = v, P = await Z(`/videos/${E.id}/incorrect-examples`);
    const oe = (U) => P.find((H) => {
      var ue;
      return H.id === U.exampleId || ((ue = U.collectedIdentity) == null ? void 0 : ue.itemId) != null && H.itemId === U.collectedIdentity.itemId;
    });
    for (const [U, H] of ($.entries || []).entries()) {
      const ue = `history-feedback:${E.id}:${b.action.sequence}:${b.direction}:${U}`, N = oe(H);
      if ($.collected && N) {
        ze(ue);
        continue;
      }
      let V;
      if ($.collected) {
        const G = Ye(
          S.segments,
          H.collectedIdentity
        ) || Ye(
          S.segments,
          H.originalIdentity
        );
        if (!G)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const ee = G.nativeSegmentId != null;
        V = await Z(`/videos/${E.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ke(ue),
            nativeSegmentId: ee ? G.nativeSegmentId : null,
            itemId: ee ? null : G.itemId,
            expectedUpdatedAt: ee ? G.updatedAt : null,
            expectedRevision: ee ? null : G.revision
          })
        });
      } else {
        if (!N) {
          ze(ue);
          continue;
        }
        V = await Z(
          `/videos/${E.id}/incorrect-examples/${N.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ke(ue),
              expectedExampleRevision: N.revision,
              expectedRepresentationRevision: N.representationRevision
            })
          }
        );
      }
      ze(ue), S = br(
        S,
        V.editorDelta
      ), P = await Z(
        `/videos/${E.id}/incorrect-examples`
      );
    }
    return A(P), S;
  }
  async function pe($, v, b = []) {
    const S = $.state;
    if (!s && ((S == null ? void 0 : S.type) === "segment" || (S == null ? void 0 : S.type) === "segments")) {
      const oe = `basic-history:${E.id}:${f.current.revision}:${$.action.sequence}:${$.direction}`, U = await Z(`/videos/${E.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ke(oe),
          expectedHistoryRevision: f.current.revision,
          actionSequence: $.action.sequence,
          direction: $.direction
        })
      });
      return t(U.history), b.push(oe), x();
    }
    const P = $.direction === "backward" ? $.action.afterState : $.action.beforeState;
    if ((S == null ? void 0 : S.type) === "composite") {
      let oe = v;
      const U = (P == null ? void 0 : P.type) === "composite" ? P.states || [] : [];
      for (const [H, ue] of (S.states || []).entries()) {
        const N = U[H];
        oe = await pe({
          ...$,
          state: ue,
          action: {
            ...$.action,
            beforeState: $.direction === "backward" ? ue : N,
            afterState: $.direction === "backward" ? N : ue
          }
        }, oe, b);
      }
      return oe;
    }
    if ((S == null ? void 0 : S.type) === "segment" || (S == null ? void 0 : S.type) === "segments")
      return D(
        S,
        P,
        v
      );
    if ((S == null ? void 0 : S.type) === "performerSlots")
      return q(S, v);
    if ((S == null ? void 0 : S.type) === "incorrectExamples")
      return te(S, v, $);
    if ((S == null ? void 0 : S.type) === "shots") {
      const oe = qn(v.shotBoundaries || []), U = await Z(`/videos/${E.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ke(`history-shots:${E.id}:${oe}:${S.fingerprint}`),
          expectedFingerprint: oe,
          boundaries: S.boundaries
        })
      });
      return { ...v, shotBoundaries: U };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function be($) {
    if (m || $ === u.cursorSequence) return;
    if (K != null) {
      w("Finish the pending saves before restoring history.");
      return;
    }
    if (da(u, $).length === 0) return;
    const b = o({
      kind: "history",
      lockId: -1,
      exclusive: !0,
      run: (S) => X(S.detail, $)
    });
    if (!b) {
      w("Finish the pending saves before restoring history.");
      return;
    }
    await b.done;
  }
  async function X($, v) {
    var S;
    const b = da(f.current, v);
    if (b.length !== 0) {
      k(!0), w(`Restoring ${b.length} history ${b.length === 1 ? "action" : "actions"}…`);
      try {
        let P = $;
        const oe = [];
        for (const H of b)
          P = await pe(
            H,
            P,
            oe
          );
        const U = s ? await Z(`/videos/${E.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: f.current.revision,
            targetSequence: v
          })
        }) : f.current;
        oe.forEach(ze), t(U), await x(), w("History restored.");
      } catch (P) {
        P.status === 409 && ((S = P.payload) != null && S.current) && t(P.payload.current), await x(), w(P.message || "Unable to restore editor history.");
      } finally {
        k(!1);
      }
    }
  }
  function F($) {
    O((v) => ({ ...v, timelineRatio: co($, y) }));
  }
  function ae($) {
    var S, P;
    const v = (S = h.current) == null ? void 0 : S.getBoundingClientRect();
    if (!v) return;
    const b = ((P = a.current) == null ? void 0 : P.offsetHeight) || 0;
    F(Bs(
      $.clientY,
      v.top + b,
      Math.max(0, v.height - b)
    ));
  }
  function ce($) {
    $.currentTarget.setPointerCapture($.pointerId), ae($);
  }
  function J($) {
    $.currentTarget.hasPointerCapture($.pointerId) && ae($);
  }
  function he($) {
    const v = $.shiftKey ? 0.1 : 0.05;
    let b = null;
    $.key === "ArrowUp" && (b = c.timelineRatio + v), $.key === "ArrowDown" && (b = c.timelineRatio - v);
    const S = lo(y);
    $.key === "Home" && (b = S.minimum), $.key === "End" && (b = S.maximum), b != null && ($.preventDefault(), $.stopPropagation(), F(b));
  }
  function ve($) {
    const v = $ === "detailWidth" ? p.focusRow : p.workspace, b = p.workspace > 0 ? Zr(p.workspace, 600) : 560, S = dn(c.markerRailWidth, b), P = $ === "detailWidth" ? 344 + (c.markerRailOpen ? S + 24 : 0) : 600;
    return v > 0 ? Zr(v, P) : 560;
  }
  function re($, v) {
    O((b) => ({ ...b, [$]: dn(v, ve($)) }));
  }
  function le($, v) {
    var S, P;
    const b = v === "detailWidth" ? (S = g.current) == null ? void 0 : S.getBoundingClientRect() : (P = R.current) == null ? void 0 : P.getBoundingClientRect();
    b && re(v, v === "detailWidth" ? $.clientX - b.left : b.right - $.clientX);
  }
  function me($, v) {
    const b = ve($), S = dn(c[$], b);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": v,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(b),
      "aria-valuenow": Math.round(S),
      "aria-valuetext": `${Math.round(S)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (P) => {
        P.currentTarget.setPointerCapture(P.pointerId), le(P, $);
      },
      onPointerMove: (P) => {
        P.currentTarget.hasPointerCapture(P.pointerId) && le(P, $);
      },
      onKeyDown: (P) => {
        const oe = P.shiftKey ? 40 : 16;
        let U = null;
        P.key === "ArrowLeft" && (U = $ === "detailWidth" ? -oe : oe), P.key === "ArrowRight" && (U = $ === "detailWidth" ? oe : -oe);
        let H = U == null ? null : S + U;
        P.key === "Home" && (H = 240), P.key === "End" && (H = b), H != null && (P.preventDefault(), P.stopPropagation(), re($, H));
      },
      onDoubleClick: () => re($, It[$]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function Y() {
    O(($) => ({ ...$, markerRailOpen: !$.markerRailOpen })), requestAnimationFrame(() => {
      var $;
      return ($ = z.current) == null ? void 0 : $.focus({ preventScroll: !0 });
    });
  }
  function de($) {
    W((v) => v.includes($) ? v.filter((b) => b !== $) : tn([...v, $]));
  }
  function M($, v = !0, b = l) {
    const S = i().running != null, P = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (oe) => ne(oe.detail, $, v, b)
    });
    return P ? (S && w($ === "split" ? "Shot boundary queued…" : "Shot merge queued…"), P.done.then((oe) => oe.value ?? null)) : (w("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function ne($, v, b, S) {
    var ue;
    const P = ($ == null ? void 0 : $.shotBoundaries) || [], oe = Number((ue = E.videoFile) == null ? void 0 : ue.duration) || _, U = qn(P), H = `shot-${v}:${E.id}:${S.toFixed(3)}:${oe.toFixed(3)}:${U}`;
    w(v === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const N = await Z(`/videos/${E.id}/shot-boundaries/${v}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Ke(H), timeSec: S })
      });
      return ze(H), C((V) => ({ ...V, shotBoundaries: N }), E.id), b && await j(
        "shots.update",
        v === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: P,
          fingerprint: U
        },
        {
          type: "shots",
          boundaries: N,
          fingerprint: qn(N)
        }
      ), w(v === "split" ? "Shot boundary added." : "Shots merged."), N;
    } catch (N) {
      return w(N.message || "Unable to edit shot boundaries."), null;
    }
  }
  return { applySegmentHistoryState: D, applyPerformerSlotHistoryState: q, applyHistoryState: pe, restoreHistoryTarget: be, updateTimelineRatio: F, updateTimelineRatioFromPointer: ae, handleSeparatorPointerDown: ce, handleSeparatorPointerMove: J, handleSeparatorKeyDown: he, panelWidthMaximum: ve, updatePanelWidth: re, handlePanelSeparatorPointer: le, panelSeparatorProps: me, toggleSegmentRail: Y, toggleSegmentGroup: de, mutateShotBoundary: M };
}
function Mc(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: u, lineage: f, mediaDuration: m, mergeSelectedSwimlane: p, moveToBin: y, mutateShotBoundary: h, openPublishApprovedDialog: C, playbackControlsRef: x, playbackShortcutConfig: z, saveSelectedReviewState: j, seekRef: K, segmentGroupKeys: W, selectSegment: O, selectedSegment: k, selectedSegmentGroupForSegment: A, selectedSegmentGroupKey: w, selectedSegments: T, setCollapsedSegmentGroups: _, setIncorrectExamplesOpen: E, setQuickSearchOpen: R, setSaveMessage: D, setSelectedSegmentGroupKey: q, setTagEditing: te, setTimelineZoom: pe, shotBoundaries: be, slotButtonRef: X, splitSegment: F, swimlanes: ae, timelineDuration: ce, toggleIncorrectExample: J, toggleSegmentGroup: he, updateTimelineRatio: ve, videoFrameRate: re, visibleSegments: le } = e;
  function me(M) {
    var ne, $;
    (ne = x.current) == null || ne.pause(), ($ = x.current) == null || $.seekBy(kl(M, re));
  }
  function Y(M, ne) {
    if (T.length > 1 && il(M.id))
      return;
    let $ = null;
    M.id === "video.playPause" && ($ = () => {
      var v;
      return (v = x.current) == null ? void 0 : v.toggle();
    }), M.id === "video.seekSmallBackward" && ($ = () => {
      var v;
      return (v = x.current) == null ? void 0 : v.seekBy(-z.smallSeekTime);
    }), M.id === "video.seekSmallForward" && ($ = () => {
      var v;
      return (v = x.current) == null ? void 0 : v.seekBy(z.smallSeekTime);
    }), M.id === "video.seekMediumBackward" && ($ = () => {
      var v;
      return (v = x.current) == null ? void 0 : v.seekBy(-z.mediumSeekTime);
    }), M.id === "video.seekMediumForward" && ($ = () => {
      var v;
      return (v = x.current) == null ? void 0 : v.seekBy(z.mediumSeekTime);
    }), M.id === "video.seekLongBackward" && ($ = () => {
      var v;
      return (v = x.current) == null ? void 0 : v.seekBy(-z.longSeekTime);
    }), M.id === "video.seekLongForward" && ($ = () => {
      var v;
      return (v = x.current) == null ? void 0 : v.seekBy(z.longSeekTime);
    }), M.id === "video.playSelected" && k && ($ = () => {
      var v;
      (v = K.current) == null || v.call(K, k.startSec, !0), requestAnimationFrame(() => {
        var b;
        return (b = g.current) == null ? void 0 : b.focus({ preventScroll: !0 });
      });
    }), (M.id === "video.playPreviousSegment" || M.id === "video.playNextSegment") && ($ = () => {
      var b;
      const v = ro(
        ae,
        k == null ? void 0 : k.id,
        M.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !v || v.id === (k == null ? void 0 : k.id) || (O(v, { focusEditor: !0, seekToSegment: !1 }), (b = K.current) == null || b.call(K, v.startSec, !0));
    }), M.id.startsWith("video.seekPercent") && ($ = () => {
      var b;
      const v = Number(M.id.slice(17)) / 10;
      (b = K.current) == null || b.call(K, nl(m ?? ce, v), !1);
    }), M.id === "video.jumpToSegmentStart" && k && ($ = () => {
      var v;
      return (v = K.current) == null ? void 0 : v.call(K, k.startSec, !1);
    }), M.id === "video.jumpToSegmentEnd" && k && ($ = () => {
      var v;
      return (v = K.current) == null ? void 0 : v.call(K, k.endSec ?? k.startSec, !1);
    }), M.id === "video.jumpToVideoStart" && ($ = () => {
      var v;
      return (v = K.current) == null ? void 0 : v.call(K, 0, !1);
    }), M.id === "video.jumpToVideoEnd" && ($ = () => {
      var v;
      return (v = K.current) == null ? void 0 : v.call(K, ce, !1);
    }), M.id.startsWith("video.frame") && ($ = () => {
      const v = M.id.includes("Small") ? "small" : M.id.includes("Medium") ? "medium" : "long", b = z[`${v}FrameStep`] * (M.id.endsWith("Backward") ? -1 : 1);
      me(b);
    }), M.id.startsWith("navigation.swimlane") && ($ = () => {
      const v = M.id.slice(19).toLowerCase(), b = ro(ae, k == null ? void 0 : k.id, v, s);
      b && O(b, { focusEditor: !0, seekToSegment: !1 });
    }), (M.id === "navigation.extendSwimlaneLeft" || M.id === "navigation.extendSwimlaneRight") && ($ = () => {
      const v = vd(
        t,
        k == null ? void 0 : k.id,
        M.id.endsWith("Left") ? "left" : "right"
      );
      v && O(v.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: v.segmentIds
      });
    }), (M.id === "navigation.segmentGroupUp" || M.id === "navigation.segmentGroupDown") && ($ = () => {
      const v = xd(
        W,
        w ?? A,
        M.id.endsWith("Up") ? -1 : 1
      );
      v && q(v);
    }), (M.id === "navigation.previousAtPlayhead" || M.id === "navigation.nextAtPlayhead") && ($ = () => {
      const v = Gs(le, s, M.id === "navigation.previousAtPlayhead" ? -1 : 1, k == null ? void 0 : k.id);
      v && O(v, { focusEditor: !0, seekToSegment: !1 });
    }), M.id === "navigation.nearestInCurrentSwimlane" && ($ = () => {
      const v = As(
        ae,
        k == null ? void 0 : k.id,
        s
      );
      v && O(v, { focusEditor: !0, seekToSegment: !1 });
    }), M.id.includes("Unreviewed") && ($ = () => {
      const v = vr(
        ae,
        k == null ? void 0 : k.id,
        M.id.startsWith("navigation.previous") ? -1 : 1,
        M.id.endsWith("Global")
      );
      v && O(v, { focusEditor: !ne.preserveFocus, seekToSegment: !1 });
    }), (M.id === "navigation.nextTouchingPlayhead" || M.id === "navigation.previousTouchingPlayhead") && ($ = () => {
      const v = Ts(ae, s, M.id === "navigation.previousTouchingPlayhead" ? -1 : 1, k == null ? void 0 : k.id);
      v && O(v, { focusEditor: !0, seekToSegment: !1 });
    }), M.id === "navigation.quickSearch" && ($ = () => R(!0)), (M.id === "navigation.previousShot" || M.id === "navigation.nextShot") && ($ = () => {
      var b;
      const v = Sl(be, s, M.id === "navigation.previousShot" ? -1 : 1);
      v && ((b = K.current) == null || b.call(K, v.startSec, !1));
    }), M.id === "shot.split" && ($ = () => h("split")), M.id === "shot.merge" && ($ = () => h("merge")), M.id === "marker.create" && ($ = () => a()), M.id === "marker.duplicate" && ($ = () => d(!1)), M.id === "marker.duplicateAtPlayhead" && ($ = () => d(!0)), M.id === "marker.split" && ($ = () => F()), M.id === "marker.editTag" && ($ = () => {
      var v;
      if (T.length > 1 && T.some((b) => b.isDerived)) {
        D("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((v = f.data) != null && v.tagReadOnly) {
        D("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      te(!0);
    }), M.id === "marker.setStart" && k && ($ = () => r(s, k.endSec)), M.id === "marker.setEnd" && k && ($ = () => r(k.startSec, s)), M.id === "marker.copyTiming" && k && ($ = () => {
      D(Jd(k) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), M.id === "marker.pasteTiming" && k && ($ = () => {
      const v = Vd();
      if (!v) {
        D("No copied segment timing is available.");
        return;
      }
      r(v.startSec, v.endSec);
    }), M.id === "marker.mergeSelection" && ($ = () => p()), M.id === "marker.moveToBin" && ($ = () => y()), M.id === "marker.toggleIncorrectExample" && k && ($ = () => J()), M.id === "marker.openIncorrectExamples" && ($ = () => E(!0)), M.id === "markerGroup.toggleCollapse" && w && ($ = () => he(w)), M.id === "markerGroup.toggleAll" && ($ = () => _((v) => hd(v, W))), M.id === "marker.assignSlots" && ($ = () => {
      var v;
      return (v = X.current) == null ? void 0 : v.click();
    }), M.id === "navigation.zoomIn" && ($ = () => pe((v) => xr(v + 0.5))), M.id === "navigation.zoomOut" && ($ = () => pe((v) => xr(v - 0.5))), M.id === "navigation.resetZoom" && ($ = () => pe(1)), M.id === "navigation.centerPlayhead" && ($ = () => {
      var v;
      return (v = o.current) == null ? void 0 : v.call(o);
    }), M.id === "layout.growSwimlanes" && ($ = () => ve(c.timelineRatio + 0.05)), M.id === "layout.shrinkSwimlanes" && ($ = () => ve(c.timelineRatio - 0.05)), M.id === "marker.confirm" && k && ($ = () => j("approved")), M.id === "system.publishApproved" && ($ = () => C(ne.target)), M.id === "marker.reject" && k && ($ = () => j("rejected")), M.id === "system.emptyBin" && ($ = () => u()), M.id === "system.deleteRejected" && ($ = () => l()), $ && $();
  }
  function de(M, ne) {
    const $ = Qn.find((v) => v.id === M);
    $ && Rn($, i) && Y($, ne);
  }
  return {
    executeShortcutById: de,
    stepVideoFrame: (M) => me(M < 0 ? -1 : 1)
  };
}
function ka(e) {
  return e === !0;
}
function wa() {
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
function Ec(e, t, r = !1, o = 0, i = "", a = () => () => {
}) {
  const [s, l] = B(null), [d, c] = B(null), [g, u] = B(""), [f, m] = B({
    busy: !1,
    reviewState: null,
    error: ""
  }), p = fe(null);
  async function y(x) {
    const z = a("import", -1);
    if (!z) {
      m({ busy: !1, reviewState: null, error: "Wait for the current save to finish before importing Cove segments." });
      return;
    }
    m({ busy: !0, reviewState: x, error: "" });
    try {
      await Z(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: no(), reviewState: x })
      }), await t(), m({ busy: !1, reviewState: null, error: "" });
    } catch (j) {
      m({
        busy: !1,
        reviewState: null,
        error: j.message || "Unable to import Cove segments."
      });
    } finally {
      z();
    }
  }
  async function h(x) {
    try {
      const z = await Z(`/videos/${e}/analysis-runs`, {
        signal: x.signal
      });
      if (!x.isActive()) return null;
      const j = (z == null ? void 0 : z[0]) || null;
      return l(j), (j == null ? void 0 : j.status) === "completed" && p.current !== j.id && (p.current = j.id, await t()), ((j == null ? void 0 : j.status) === "failed" || (j == null ? void 0 : j.status) === "cancelled") && u(j.errorMessage || "Video analysis did not complete."), j;
    } catch (z) {
      return x.isActive() && z.name !== "AbortError" && u(z.message || "Unable to load video analysis status."), null;
    }
  }
  async function C(x = null) {
    u("");
    const z = x || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), j = z.includes("omnishotcut") && o > 0;
    if (!(j && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const K = await Z(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: z,
            replaceShotBoundaries: j,
            expectedShotBoundaryFingerprint: j ? i : null
          })
        });
        l(K);
      } catch (K) {
        u(K.message || "Unable to start video analysis.");
      }
  }
  return ye(() => {
    if (!ka(r)) {
      l(null), c(null), u("");
      return;
    }
    const x = wa();
    return h(x), Z("/analysis/status", { signal: x.signal }).then((z) => {
      x.isActive() && (c(z), z.configured || u(""));
    }).catch((z) => {
      x.isActive() && z.name !== "AbortError" && u(z.message || "Unable to check video analysis readiness.");
    }), x.dispose;
  }, [e, r]), ye(() => {
    if (!ka(r) || (s == null ? void 0 : s.status) !== "queued" && (s == null ? void 0 : s.status) !== "running") return;
    const x = wa();
    let z = setTimeout(async function j() {
      await h(x), x.isActive() && (z = setTimeout(j, 2500));
    }, 2500);
    return () => {
      clearTimeout(z), x.dispose();
    };
  }, [s == null ? void 0 : s.id, s == null ? void 0 : s.status, r]), {
    analysisError: g,
    analysisRun: s,
    analysisStatus: d,
    importNativeSegments: y,
    nativeImportState: f,
    startFullAnalysis: C
  };
}
const Hn = Object.freeze([]);
function Dc(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Pc({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var Lo, Fo, jo, Bo, Go;
  const [g, u] = B(null), [f, m] = B([]), p = fe(null), y = fe(null), h = fe([]), C = fe(null), [x, z] = B(() => Et({})), [j, K] = B(!1), [W, O] = B(rl), [k, A] = B(0), w = fe(null), [T] = B(() => Ed({
    getContext: () => w.current,
    drainAfterSettle: !1
  })), _ = Gl(T.subscribe, T.getSnapshot), E = Si(_), R = (L, ie) => T.acquire({ kind: L, lockId: ie }), D = (L) => T.enqueue(L), q = (L) => T.stableIdentity(L), te = fe(!1);
  ye(() => (te.current = !0, () => {
    te.current = !1, queueMicrotask(() => {
      te.current || T.dispose();
    });
  }), []);
  const pe = (L) => T.cancel(L), be = (L, ie) => T.retarget(L, ie), X = T.getSnapshot, [F, ae] = Bl(Gd, []), [ce, J] = B(""), [he, ve] = B(""), [re, le] = B(""), [me, Y] = B(1), [de, M] = B(Hd), [ne, $] = B(0), [v, b] = B({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [S, P] = B(Vt), oe = fe(Vt), [U, H] = B(!1), [ue, N] = B(!1), [V, G] = B(!1), ee = fe(!1);
  ee.current = V;
  const [ge, Le] = B(null), [Ie, Fe] = B(!1), [Ge, Ee] = B(null), [Ve, pt] = B(null), Qe = fe(null), [mt, rt] = B(!1), [ct, nt] = B(""), gt = fe(null), et = fe(null), $t = fe(!1), [Tt, Q] = B(qd), [se, Ne] = B(null), [Te, xe] = B(!1), [We, je] = B(!1), [_e, ke] = B(!1), [Ue, De] = B(!1), [we, Be] = B(!1), [ot, Se] = B(""), {
    analysisError: Pe,
    analysisRun: Me,
    analysisStatus: Dt,
    importNativeSegments: Ze,
    nativeImportState: lt,
    startFullAnalysis: Ut
  } = Ec(
    e.video.id,
    o,
    l,
    ((Lo = e.shotBoundaries) == null ? void 0 : Lo.length) || 0,
    qn(e.shotBoundaries || []),
    (L, ie) => T.acquire({ kind: L, lockId: ie })
  ), [Je, Ce] = B(!1), [$e, qe] = B(null), [dt, at] = B(l), [Pt, Nt] = B(0), [Ot, gn] = B(!1), [Lt, nn] = B(""), [Xn, rn] = B(null), Dn = fe(null), er = fe(null), pn = fe(!1), [Qt, fn] = B([]), [tr, Tr] = B(!1), [nr, Ar] = B(null), on = Kd(), yn = fe(null), Pn = fe(null), bn = fe(null), Rr = fe(s), rr = fe(null), hn = fe(null), an = fe(null), vn = fe(null), On = fe(null), vt = fe(null), or = fe(null), Ln = fe(null), Kt = fe(null), ar = fe(null), xn = fe(null), Sn = fe(null), Mr = fe(-1e12), Er = fe(null), Fn = fe(null), [kn, jn] = B({ scrollTop: 0, height: 512 });
  ye(() => {
    if (!Je || Ot || !Lt) return;
    const L = requestAnimationFrame(() => {
      var ie;
      return (ie = er.current) == null ? void 0 : ie.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(L);
  }, [Je, Ot, Lt]), ye(() => {
    if (!pn.current || Je || dt) return;
    const L = requestAnimationFrame(() => {
      var ie;
      (ie = Dn.current) == null || ie.focus({ preventScroll: !0 }), pn.current = !1;
    });
    return () => cancelAnimationFrame(L);
  }, [Je, dt]);
  const tt = e.video, ft = e.segments || Hn, Dr = He(() => JSON.stringify({
    segments: ft.map((L) => [
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
    performerSlots: (e.performerSlots || Hn).map((L) => [
      L.segmentId,
      L.slotDefinitionId,
      L.performerId,
      L.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [ft, e.performerSlots, e.itemMetadata]);
  ye(() => {
    if (!l) {
      qe(null), at(!1);
      return;
    }
    if (E != null) {
      at(!0);
      return;
    }
    let L = !0;
    at(!0);
    const ie = setTimeout(() => {
      Z(`/videos/${tt.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Oe) => {
        L && (qe(Oe), nn(""));
      }).catch((Oe) => {
        L && (qe(null), nn(Oe.message || "Unable to preview derived segments."));
      }).finally(() => {
        L && at(!1);
      });
    }, 150);
    return () => {
      L = !1, clearTimeout(ie);
    };
  }, [l, tt.id, Dr, Pt, E]);
  const ut = () => Nt((L) => L + 1), At = e.segmentGroups || Hn, Rt = e.performerSlots || Hn, Pr = l && e.performerSlotsAvailable !== !1, wn = He(
    () => (e.performerCandidates || []).filter((L) => L.isVideoPerformer),
    [e.performerCandidates]
  ), Wt = e.shotBoundaries || Hn, Bn = He(
    () => fi(Rt),
    [Rt]
  ), Gn = He(
    () => ft.map((L) => {
      const ie = Bn.get(L.id) || [];
      return {
        ...L,
        slots: ie,
        assignment: ie.every((Oe) => Oe.performerId == null) ? Pl(ie, wn) : null
      };
    }).filter((L) => L.slots.length > 0 && L.assignment != null),
    [ft, Bn, wn]
  ), ir = Number((Fo = tt.videoFile) == null ? void 0 : Fo.frameRate) > 0 ? Number(tt.videoFile.frameRate) : 30;
  function Nn() {
    const L = ee.current;
    G(!1), L && requestAnimationFrame(() => {
      var ie;
      return (ie = vt.current) == null ? void 0 : ie.focus({ preventScroll: !0 });
    });
  }
  function sr() {
    E == null && (Sn.current = null, Fe(!1), J(""), requestAnimationFrame(() => {
      var L;
      return (L = vt.current) == null ? void 0 : L.focus({ preventScroll: !0 });
    }));
  }
  function Or() {
    K(!1), requestAnimationFrame(() => {
      var L, ie;
      (L = Ln.current) != null && L.isConnected ? Ln.current.focus({ preventScroll: !0 }) : (ie = vt.current) == null || ie.focus({ preventScroll: !0 });
    });
  }
  ye(() => {
    xn.current === g ? (xn.current = null, G(!0)) : G(!1);
  }, [g]), ye(() => {
    var ie;
    if (!V) return;
    const L = (ie = ar.current) == null ? void 0 : ie.querySelector("input");
    document.activeElement !== L && (L == null || L.focus({ preventScroll: !0 }), L == null || L.select());
  }, [V, g]), ye(() => {
    var ie;
    if (V) return;
    const L = (ie = vt.current) == null ? void 0 : ie.ownerDocument;
    L && L.activeElement === L.body && vt.current.focus({ preventScroll: !0 });
  }, [V]), ye(() => {
    var Oe, it, Ft;
    const L = cn(
      qr(
        e.segments,
        e.performerSlots || [],
        Et({}),
        l && W,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), ie = ((Oe = e.segments.find(($n) => $n.id === s)) == null ? void 0 : Oe.id) ?? ((it = qa(L)) == null ? void 0 : it.id) ?? null;
    u(ie), m(ie == null ? [] : [ie]), y.current = ie, h.current = [], Ne(jt(L, ie)), z(Et({})), K(!1), Sn.current = null, Fe(!1), Y(1), J(""), P(Vt), oe.current = Vt, H(!1), (Ft = vt.current) == null || Ft.focus({ preventScroll: !0 });
  }, [tt.id, s]), ye(() => {
    const L = new AbortController();
    return Z(`/videos/${tt.id}/incorrect-examples`, { signal: L.signal }).then(fn).catch((ie) => {
      ie.name !== "AbortError" && fn([]);
    }), () => L.abort();
  }, [tt.id, d == null ? void 0 : d.effectiveMode]), ye(() => {
    const L = new AbortController();
    return Z(`/videos/${tt.id}/history`, { signal: L.signal }).then((ie) => {
      const Oe = ie || Vt;
      oe.current = Oe, P(Oe);
    }).catch((ie) => {
      ie.name !== "AbortError" && J(ie.message || "Unable to load editor history.");
    }), () => L.abort();
  }, [tt.id]), ye(() => {
    Wd(de);
  }, [de.timelineRatio, de.markerRailOpen, de.detailWidth, de.markerRailWidth, de.swimlaneTitleWidth]), ye(() => {
    _d(Tt);
  }, [Tt]), ye(() => {
    ol(W);
  }, [W]), ye(() => {
    const L = hn.current;
    if (!a || !L || typeof ResizeObserver > "u") return;
    const ie = () => {
      var Ft;
      const it = Math.max(0, L.clientHeight - (((Ft = an.current) == null ? void 0 : Ft.offsetHeight) || 0));
      $(it), M(($n) => {
        const Uo = co($n.timelineRatio, it);
        return Uo === $n.timelineRatio ? $n : { ...$n, timelineRatio: Uo };
      });
    }, Oe = new ResizeObserver(ie);
    return Oe.observe(L), an.current && Oe.observe(an.current), ie(), () => Oe.disconnect();
  }, [a]), ye(() => {
    if (!on || typeof ResizeObserver > "u") return;
    const L = On.current, ie = vn.current;
    if (!L || !ie) return;
    const Oe = () => b({
      workspace: L.clientWidth,
      focusRow: ie.clientWidth,
      focusRowHeight: ie.clientHeight
    }), it = new ResizeObserver(Oe);
    return it.observe(L), it.observe(ie), Oe(), () => it.disconnect();
  }, [on, de.markerRailOpen]);
  const zt = He(
    () => jd(ft, F),
    [ft, F]
  );
  sa(() => {
    Ci(F, e) !== F && ae({ type: "prune", detail: e });
  }, [e, F]);
  const yt = He(
    () => ga(
      qr(
        zt,
        Rt,
        x,
        l && W,
        At
      ),
      Qt,
      !0
    ),
    [
      zt,
      Rt,
      x,
      W,
      At,
      l,
      Qt
    ]
  ), sn = Object.fromEntries(kt.map((L) => [L, yt.filter((ie) => ie.reviewState === L).length])), Un = ga(
    qr(
      zt,
      Rt,
      { ...x, reviewStates: kt },
      l && W,
      At
    ),
    Qt,
    !0
  ), Lr = Object.fromEntries(kt.map((L) => [L, Un.filter((ie) => ie.reviewState === L).length])), Fr = [...new Set(zt.map((L) => L.sourceKey).filter(Boolean))].sort((L, ie) => Gt(L).localeCompare(Gt(ie))), jr = qs(
    x,
    l && W
  ), xt = He(
    () => cn(yt, At, Rt),
    [yt, At, Rt]
  ), Xe = Vs(
    xt,
    g,
    s
  ), ln = He(() => {
    const L = Ld(F);
    return L.length === 0 ? ft : [...ft, ...L];
  }, [ft, F]), I = Xe == null ? null : ln.find((L) => L.id === Xe.id) || Xe, Re = Jo(ln, Jo(yt, f).map((L) => L.id)), ht = !l && Re.length > 0 && Re.every((L) => L.nativeSegmentId != null), bt = yt.map((L) => L.id), Zt = bt.join("|");
  p.current = (I == null ? void 0 : I.id) ?? null;
  const Ht = Bn.get(I == null ? void 0 : I.id) || [], Br = yo(Ht), So = He(
    () => fd(xt, f),
    [xt, f]
  ), Gr = He(() => bo(xt), [xt]), Kn = He(
    () => gd(Gr, Tt),
    [Gr, Tt]
  ), Di = He(
    () => yi(
      Kn.rows,
      kn.scrollTop,
      kn.height
    ),
    [Kn, kn]
  ), Ur = He(
    () => bd(xt, Tt),
    [xt, Tt]
  ), Pi = vr(Ur, I == null ? void 0 : I.id, -1, !0) != null, Oi = vr(Ur, I == null ? void 0 : I.id, 1, !0) != null, In = I ? jt(xt, I.id) : null, Kr = At.length > 0 ? Gr.map((L) => L.key) : [], Li = Kr.join("|"), lr = Math.max(
    0,
    Number((jo = tt.videoFile) == null ? void 0 : jo.duration) || 0,
    ...zt.map((L) => Number(L.endSec ?? L.startSec) || 0)
  ), ko = Number((Bo = tt.videoFile) == null ? void 0 : Bo.duration) > 0 ? Number(tt.videoFile.duration) : null;
  S.actions;
  const Fi = ei();
  ye(() => {
    const L = g === Sr ? g : (I == null ? void 0 : I.id) ?? null;
    L !== g && u(L);
  }, [I, g]), ye(() => {
    m((L) => {
      const ie = Zs(
        L,
        bt,
        (I == null ? void 0 : I.id) ?? null
      );
      return ie.length === L.length && ie.every((Oe, it) => Oe === L[it]) ? L : ie;
    });
  }, [Zt, I == null ? void 0 : I.id]);
  const Cn = (I == null ? void 0 : I.itemId) == null ? null : ((Go = e.itemMetadata) == null ? void 0 : Go[I.itemId]) || null, ji = {
    key: (I == null ? void 0 : I.itemId) != null ? `item:${I.itemId}` : (I == null ? void 0 : I.nativeSegmentId) != null ? `native:${I.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (Cn == null ? void 0 : Cn.provenance) || (I == null ? void 0 : I.fieldProvenance) || [] : []
  }, zr = (I == null ? void 0 : I.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (Cn == null ? void 0 : Cn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  ye(() => {
    ve(Xe == null ? "" : String(Xe.startSec)), le((Xe == null ? void 0 : Xe.endSec) == null ? "" : String(Xe.endSec));
  }, [Xe == null ? void 0 : Xe.id, Xe == null ? void 0 : Xe.startSec, Xe == null ? void 0 : Xe.endSec]), ye(() => {
    In && Q((L) => vi(L, In));
  }, [tt.id, s, In]), ye(() => {
    Ne((L) => Sd(Kr, L, In));
  }, [tt.id, Li, In]), ye(() => {
    if (!de.markerRailOpen || (I == null ? void 0 : I.id) == null) return;
    const L = Fn.current, ie = Kn.rows.find((Ft) => Ft.kind === "segment" && Ft.segment.id === I.id);
    if (!L || !ie) return;
    const Oe = ie.top + ie.height;
    let it = L.scrollTop;
    ie.top < L.scrollTop ? it = ie.top : Oe > L.scrollTop + L.clientHeight && (it = Math.max(0, Oe - L.clientHeight)), it !== L.scrollTop && (L.scrollTop = it), jn({ scrollTop: it, height: L.clientHeight });
  }, [I == null ? void 0 : I.id, Kn, de.markerRailOpen]), ye(() => {
    const L = Fn.current;
    if (!de.markerRailOpen || !L) return;
    const ie = () => jn({
      scrollTop: L.scrollTop,
      height: L.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      ie();
      return;
    }
    const Oe = new ResizeObserver(ie);
    return Oe.observe(L), ie(), () => Oe.disconnect();
  }, [de.markerRailOpen]);
  const { revealSegmentGroupForSelection: wo, replaceSegmentSelection: Bi, selectSegment: No, selectSegmentCollection: Gi, selectAllVideoSegments: Ui } = $c({
    allSwimlanes: xt,
    editorRef: vt,
    performerSlots: Rt,
    seekRef: yn,
    segmentGroups: At,
    segments: ft,
    selectedSegmentId: g,
    selectedSegmentIds: f,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: h,
    setCollapsedSegmentGroups: Q,
    setEditorFilters: z,
    setHideDerivedSegments: O,
    setSaveMessage: J,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m
  }), { acceptHistory: Hr, recordHistoryAction: dr, mutateSegment: Ki, runSegmentMutation: zi, completeReview: Hi, createSegment: Io, splitSegment: Co, duplicateSegment: $o, saveTiming: qi, applyShortcutTiming: _i } = Ud({
    compatibilityMode: l,
    currentTime: k,
    detail: e,
    editorFilters: x,
    endInput: re,
    hideDerivedSegments: W,
    historyRef: oe,
    mediaDuration: ko,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: Mr,
    pendingDuplicateRef: Er,
    pendingFirstSegmentStartSecRef: Sn,
    pendingTagEditSegmentIdRef: xn,
    enqueueSave: D,
    pendingChanges: F,
    retargetSaveTasks: be,
    replaceSegmentSelection: Bi,
    savingSegmentId: E,
    segments: ft,
    selectedSegment: I,
    selectedSegmentIdRef: p,
    selectedSegments: Re,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: h,
    setCreatingSegmentId: Le,
    setEditorFilters: z,
    setFirstSegmentTagOpen: Fe,
    setHideDerivedSegments: O,
    setHistory: P,
    setHistoryOpen: H,
    setPublishApprovedError: nt,
    setSaveMessage: J,
    acquireSaveLock: R,
    dispatchPendingChanges: ae,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    setTagEditing: G,
    startInput: he,
    tagEditingRef: ee,
    timelineDuration: lr,
    video: tt
  });
  function To(L = null) {
    var it;
    if (!l || E != null || !ft.some((Ft) => !Ft.published && Ft.reviewState === "approved")) return;
    const ie = ((it = vt.current) == null ? void 0 : it.ownerDocument) ?? document, Oe = ie.activeElement === ie.body ? null : ie.activeElement;
    et.current = L != null && L.isConnected && L !== ie.body ? L : Oe, nt(""), rt(!0);
  }
  function Ao() {
    E == null && (rt(!1), nt(""), requestAnimationFrame(() => {
      Dc(
        et.current,
        vt.current
      ), et.current = null;
    }));
  }
  async function Wi() {
    await Hi() && Ao();
  }
  const { closeMergeConfirmation: Vi, mergeSelectedSwimlane: Ro, saveSelectedReviewState: Ji } = Tc({
    acceptHistory: Hr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: C,
    getSaveQueueSnapshot: X,
    historyRef: oe,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: dr,
    revealSegmentGroupForSelection: wo,
    savingSegmentId: E,
    selectedGroups: So,
    selectedSegment: I,
    selectedSegmentIdRef: p,
    selectedSegments: Re,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: h,
    setMergeConfirmation: Ee,
    setSaveMessage: J,
    acquireSaveLock: R,
    dispatchPendingChanges: ae,
    enqueueSave: D,
    stableSaveIdentity: q,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: tt
  }), Yi = (L) => {
    const ie = (L || []).map(qt);
    T.cancel((Oe) => Oe.kind === "review" && ho(Oe.targets, ie));
  }, Qi = T.settledCount();
  sa(() => {
    T.markCommitted(Qi), w.current = {
      detail: e,
      segments: ft,
      onConflict: r,
      onDetailChange: t,
      onReload: o,
      tagEditing: V,
      selectedSegmentIds: f,
      activeSegmentId: (I == null ? void 0 : I.id) ?? null
    };
  }), ye(() => {
    T.poke();
  });
  const { toggleIncorrectExample: Zi, removeIncorrectExample: Xi, captureTrainingExport: es, deleteRejectedSegments: Mo, autoAssignPerformers: ts, previewDerivedSegments: ns, closeMaterializeDialog: rs, materializeDerivedSegments: os, saveTag: as, moveToBin: is, emptyRecyclingBin: ss } = Ac({
    acceptHistory: Hr,
    allSwimlanes: xt,
    autoAssignCandidates: Gn,
    autoAssigning: we,
    binEmptyingRef: $t,
    canMoveSelectionToBin: ht,
    closeTagEditing: Nn,
    compatibilityMode: l,
    creatingSegmentId: ge,
    detail: e,
    editorFilters: x,
    editorRef: vt,
    exportingExamples: tr,
    hideDerivedSegments: W,
    incorrectExamples: Qt,
    lineage: zr,
    materializeButtonRef: Dn,
    materializePreview: $e,
    materializeRestoreFocusRef: pn,
    materializing: Ot,
    mutateSegment: Ki,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: Rt,
    cancelSaveTasks: pe,
    dispatchPendingChanges: ae,
    enqueueSave: D,
    stableSaveIdentity: q,
    pendingChanges: F,
    runSegmentMutation: zi,
    recordHistoryAction: dr,
    refreshMaterializationPreview: ut,
    removingExampleId: nr,
    revealSegmentGroupForSelection: wo,
    savingSegmentId: E,
    segmentGroups: At,
    segments: ft,
    selectedSegment: I,
    selectedSegmentIdRef: p,
    selectedSegments: Re,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: h,
    setAutoAssignError: Se,
    setAutoAssignOpen: De,
    setAutoAssigning: Be,
    setEditorFilters: z,
    setExportingExamples: Tr,
    setHideDerivedSegments: O,
    setIncorrectExamples: fn,
    setMaterializeError: nn,
    setMaterializeLoading: at,
    setMaterializeOpen: Ce,
    setMaterializePreview: qe,
    setMaterializing: gn,
    setRemovingExampleId: Ar,
    setRejectedDeletionPreview: pt,
    setSaveMessage: J,
    acquireSaveLock: R,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: tt
  }), { restoreHistoryTarget: ls, updateTimelineRatio: Eo, handleSeparatorPointerDown: ds, handleSeparatorPointerMove: cs, handleSeparatorKeyDown: us, panelWidthMaximum: Do, panelSeparatorProps: ms, toggleSegmentRail: gs, toggleSegmentGroup: Po, mutateShotBoundary: ps } = Rc({
    acceptHistory: Hr,
    compatibilityMode: l,
    currentTime: k,
    detail: e,
    editorLayout: de,
    focusRowRef: vn,
    history: S,
    historyRef: oe,
    historySaving: ue,
    horizontalLayoutSize: v,
    mediaStackHeight: ne,
    mediaStackRef: hn,
    commonActionsRef: an,
    onDetailChange: t,
    onReload: o,
    railToggleRef: or,
    recordHistoryAction: dr,
    savingSegmentId: E,
    setCollapsedSegmentGroups: Q,
    setEditorLayout: M,
    setHistorySaving: N,
    setIncorrectExamples: fn,
    setSaveMessage: J,
    acquireSaveLock: R,
    enqueueSave: D,
    getSaveQueueSnapshot: X,
    shotBoundaries: Wt,
    timelineDuration: lr,
    video: tt,
    workspaceRef: On
  }), { executeShortcutById: Oo, stepVideoFrame: fs } = Mc({
    allSwimlanes: xt,
    applyShortcutTiming: _i,
    centerTimelineRef: rr,
    compatibilityMode: l,
    createSegment: Io,
    currentTime: k,
    deleteRejectedSegments: Mo,
    duplicateSegment: $o,
    editorLayout: de,
    editorRef: vt,
    emptyRecyclingBin: ss,
    lineage: zr,
    mediaDuration: ko,
    mergeSelectedSwimlane: Ro,
    moveToBin: is,
    mutateShotBoundary: ps,
    openPublishApprovedDialog: To,
    playbackControlsRef: Pn,
    playbackShortcutConfig: Fi,
    saveSelectedReviewState: Ji,
    seekRef: yn,
    segmentGroupKeys: Kr,
    selectSegment: No,
    selectedSegment: I,
    selectedSegmentGroupForSegment: In,
    selectedSegmentGroupKey: se,
    selectedSegments: Re,
    setCollapsedSegmentGroups: Q,
    setIncorrectExamplesOpen: ke,
    setQuickSearchOpen: je,
    setSaveMessage: J,
    setSelectedSegmentGroupKey: Ne,
    setTagEditing: G,
    setTimelineZoom: Y,
    shotBoundaries: Wt,
    slotButtonRef: Kt,
    splitSegment: Co,
    swimlanes: Ur,
    timelineDuration: lr,
    toggleIncorrectExample: Zi,
    toggleSegmentGroup: Po,
    updateTimelineRatio: Eo,
    videoFrameRate: ir,
    visibleSegments: yt
  });
  bn.current = Oo;
  const ys = He(() => Qn.map((L) => ({
    id: L.id,
    enabled: Rn(L, l),
    surface: "local",
    action: (ie) => {
      var Oe;
      return (Oe = bn.current) == null ? void 0 : Oe.call(bn, L.id, ie);
    }
  })), [l]);
  Da(io, ys);
  const bs = lo(ne), hs = dn(de.markerRailWidth, Do("markerRailWidth")), vs = dn(de.detailWidth, Do("detailWidth"));
  return n(Cc, {
    activeFilterCount: jr,
    allSwimlanes: xt,
    analysisError: Pe,
    analysisRun: Me,
    analysisStatus: Dt,
    approvalFacetCounts: Lr,
    autoAssignCandidates: Gn,
    autoAssignError: ot,
    autoAssignOpen: Ue,
    autoAssignPerformers: ts,
    autoAssigning: we,
    canMoveSelectionToBin: ht,
    captureTrainingExport: es,
    cancelQueuedReviewsForSegments: Yi,
    removeIncorrectExample: Xi,
    rejectedDeletionPreview: Ve,
    centerTimelineRef: rr,
    closeEditorFilters: Or,
    closeFirstSegmentTagDialog: sr,
    closeMaterializeDialog: rs,
    closeMergeConfirmation: Vi,
    closePublishApprovedDialog: Ao,
    closeTagEditing: Nn,
    collapsedSegmentGroups: Tt,
    commonActionsRef: an,
    compatibilityMode: l,
    configuringTag: Xn,
    createSegment: Io,
    currentTime: k,
    deleteRejectedSegments: Mo,
    detail: e,
    detailPanelRef: C,
    detailWidth: vs,
    duplicateSegment: $o,
    editorFilters: x,
    editorLayout: de,
    editorRef: vt,
    exportingExamples: tr,
    filtersButtonRef: Ln,
    filtersOpen: j,
    firstSegmentTagOpen: Ie,
    focusRowRef: vn,
    handleSeparatorKeyDown: us,
    handleSeparatorPointerDown: ds,
    handleSeparatorPointerMove: cs,
    hideDerivedSegments: W,
    history: S,
    historyOpen: U,
    historySaving: ue,
    hasNextUnreviewed: Oi,
    hasPreviousUnreviewed: Pi,
    horizontalLayoutSize: v,
    importNativeSegments: Ze,
    incorrectExamples: Qt,
    incorrectExamplesOpen: _e,
    removingExampleId: nr,
    lineage: zr,
    markerRailWidth: hs,
    materializeButtonRef: Dn,
    materializeCancelButtonRef: er,
    materializeDerivedSegments: os,
    materializeError: Lt,
    materializeLoading: dt,
    materializeOpen: Je,
    materializePreview: $e,
    materializing: Ot,
    mediaStackRef: hn,
    mergeCancelButtonRef: Qe,
    mergeConfirmation: Ge,
    mergeSaving: Md(_, "merge"),
    mergeSelectedSwimlane: Ro,
    nativeImportState: lt,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: To,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: ms,
    pendingInitialSeekRef: Rr,
    performerSlots: Rt,
    performerSlotsAvailable: Pr,
    playbackControlsRef: Pn,
    previewDerivedSegments: ns,
    provenance: ji,
    provenanceSources: Fr,
    publishApprovedCancelButtonRef: gt,
    publishApprovedDrafts: Wi,
    publishApprovedError: ct,
    publishApprovedOpen: mt,
    quickSearchOpen: We,
    railScrollRef: Fn,
    railToggleRef: or,
    recordHistoryAction: dr,
    restoreHistoryTarget: ls,
    runEditorAction: Oo,
    stepVideoFrame: fs,
    saveMessage: ce,
    setSaveMessage: J,
    saveTag: as,
    saveTiming: qi,
    savingSegmentId: E,
    acquireSaveLock: R,
    seekRef: yn,
    segmentGroups: At,
    segmentRailLayout: Kn,
    segments: zt,
    selectAllVideoSegments: Ui,
    selectSegment: No,
    selectSegmentCollection: Gi,
    selectedGroups: So,
    selectedPerformerSlots: Ht,
    selectedSegment: Xe,
    selectedSegmentGroupKey: se,
    selectedSegmentIds: f,
    selectedSegments: Re,
    selectedSlotStatus: Br,
    setAutoAssignError: Se,
    setAutoAssignOpen: De,
    setConfiguringTag: rn,
    setCurrentTime: A,
    setEditorFilters: z,
    setEditorLayout: M,
    setFiltersOpen: K,
    setHideDerivedSegments: O,
    setHistoryOpen: H,
    setIncorrectExamplesOpen: ke,
    setQuickSearchOpen: je,
    setRejectedDeletionPreview: pt,
    setRailViewport: jn,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: u,
    setShortcutsOpen: xe,
    setTimelineZoom: Y,
    shotBoundaries: Wt,
    shortcutsOpen: Te,
    slotButtonRef: Kt,
    splitLayout: a,
    splitSegment: Co,
    startFullAnalysis: Ut,
    tagEditing: V,
    creatingSegmentId: ge,
    tagSearchRef: ar,
    timelineDuration: lr,
    timelineRatioBounds: bs,
    timelineZoom: me,
    toggleSegmentGroup: Po,
    toggleSegmentRail: gs,
    updateTimelineRatio: Eo,
    video: tt,
    videoPerformers: wn,
    visibleCounts: sn,
    visibleSegmentRailRows: Di,
    visibleSegments: yt,
    wideLayout: on,
    workspaceRef: On
  });
}
const Oc = /* @__PURE__ */ new Set(["queued", "running"]);
async function Na(e, t, r = 4) {
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
function Ia(e, t) {
  return { videoId: e, error: (t == null ? void 0 : t.message) || String(t || "Unable to start Full Scan.") };
}
function Lc() {
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
async function Fc(e, t, r, o) {
  const i = [...new Set(e.map(Number).filter((m) => Number.isInteger(m) && m > 0))], a = [...new Set(t)].filter((m) => ["aiTagging", "omnishotcut"].includes(m));
  if (i.length === 0 || a.length === 0)
    return { queuedIds: [], failed: [], cancelled: !1 };
  const s = a.includes("omnishotcut"), l = await Na(i, async (m) => {
    try {
      const [p, y] = await Promise.all([
        r(`/videos/${m}/analysis-runs`),
        s ? r(`/videos/${m}/editor`) : null
      ]);
      if ((p || []).some((C) => Oc.has(C == null ? void 0 : C.status)))
        throw new Error("A Full Scan is already queued or running.");
      const h = (y == null ? void 0 : y.shotBoundaries) || [];
      return { videoId: m, shotBoundaries: h };
    } catch (p) {
      return Ia(m, p);
    }
  }), d = l.filter((m) => !m.error), c = l.filter((m) => m.error), g = d.filter((m) => m.shotBoundaries.length > 0), u = g.reduce((m, p) => m + p.shotBoundaries.length, 0);
  if (u > 0 && !o(
    `Replace ${u} existing shot ${u === 1 ? "boundary" : "boundaries"} across ${g.length} selected ${g.length === 1 ? "video" : "videos"} when these scans succeed? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
  )) return { queuedIds: [], failed: c, cancelled: !0 };
  const f = await Na(d, async ({ videoId: m, shotBoundaries: p }) => {
    const y = s && p.length > 0;
    try {
      return await r(`/videos/${m}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: a,
          replaceShotBoundaries: y,
          expectedShotBoundaryFingerprint: y ? qn(p) : null
        })
      }), { videoId: m };
    } catch (h) {
      return Ia(m, h);
    }
  });
  return {
    queuedIds: f.filter((m) => !m.error).map((m) => m.videoId),
    failed: [...c, ...f.filter((m) => m.error)],
    cancelled: !1
  };
}
function jc(e = [], t = []) {
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
function Bc(e = [], t = "", r = "all") {
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
function Gc(e = [], t = []) {
  var m;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((p, y) => (p.sortOrder ?? 0) - (y.sortOrder ?? 0) || Number(p.id) - Number(y.id)).forEach((p, y) => {
    [...p.tags || []].sort((h, C) => (h.sortOrder ?? 0) - (C.sortOrder ?? 0) || Number(h.tagId) - Number(C.tagId)).forEach((h, C) => r.set(Number(h.tagId), {
      key: `group:${p.id}`,
      id: p.id,
      name: p.name,
      sortOrder: p.sortOrder ?? y,
      tagSortOrder: h.sortOrder ?? C
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(p, y) {
    const h = Number(p);
    if (!o.has(h)) {
      const C = r.get(h);
      o.set(h, {
        tagId: h,
        name: y || `Tag ${h}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (C == null ? void 0 : C.key) || "ungrouped",
        segmentGroupId: (C == null ? void 0 : C.id) ?? null,
        segmentGroupName: (C == null ? void 0 : C.name) || "Ungrouped",
        segmentGroupSortOrder: (C == null ? void 0 : C.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (C == null ? void 0 : C.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(h);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((p) => {
    const y = i(p.sourceTagId, p.sourceTagName), h = i(p.derivedTagId, p.derivedTagName);
    y.outgoingRuleCount++, h.incomingRuleCount++;
    const C = `${y.tagId}:${h.tagId}`;
    a.has(C) || a.set(C, {
      id: C,
      sourceTagId: y.tagId,
      derivedTagId: h.tagId,
      rules: [],
      edgeCount: 0
    });
    const x = a.get(C);
    x.rules.push(p), x.edgeCount += Number(p.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((p) => [p.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((p) => {
    var y, h;
    (y = d.get(p.sourceTagId)) == null || y.add(p.derivedTagId), (h = d.get(p.derivedTagId)) == null || h.add(p.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), g = [];
  for (const p of s) {
    if (c.has(p.tagId)) continue;
    const y = [p.tagId], h = [];
    for (c.add(p.tagId); y.length > 0; ) {
      const O = y.shift();
      h.push(O);
      for (const k of d.get(O) || [])
        c.has(k) || (c.add(k), y.push(k));
    }
    const C = new Set(h), x = h.map((O) => o.get(O)), z = l.filter((O) => C.has(O.sourceTagId) && C.has(O.derivedTagId)), j = z.flatMap((O) => O.rules), K = x.filter((O) => O.outgoingRuleCount === 0).sort((O, k) => St(O.name, k.name)), W = K.length > 0 ? K : [...x].sort((O, k) => St(O.name, k.name));
    g.push({
      id: [...h].sort((O, k) => O - k).join(":"),
      label: W.length > 1 ? `${W[0].name} + ${W.length - 1}` : ((m = W[0]) == null ? void 0 : m.name) || "Derivation component",
      nodes: x,
      connections: z,
      rules: j,
      segmentGroupKeys: [...new Set(x.map((O) => O.segmentGroupKey))],
      materializedEdgeCount: j.reduce(
        (O, k) => O + (Number(k.edgeCount) || 0),
        0
      )
    });
  }
  g.sort((p, y) => y.rules.length - p.rules.length || St(p.label, y.label));
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
      var h;
      return (h = u.get(y.segmentGroupKey)) == null ? void 0 : h.componentIds.add(p.id);
    }), p.rules.forEach((y) => {
      var h, C;
      (h = u.get(o.get(Number(y.sourceTagId)).segmentGroupKey)) == null || h.ruleIds.add(y.id), (C = u.get(o.get(Number(y.derivedTagId)).segmentGroupKey)) == null || C.ruleIds.add(y.id);
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
    components: g,
    segmentGroups: f
  };
}
function Uc(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const g = new Map(e.nodes.map((A) => [A.tagId, /* @__PURE__ */ new Set()])), u = new Map(e.nodes.map((A) => [A.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((A) => {
    var w, T;
    (w = g.get(A.sourceTagId)) == null || w.add(A.derivedTagId), (T = u.get(A.derivedTagId)) == null || T.add(A.sourceTagId);
  });
  const f = new Map(e.nodes.map((A) => {
    var w;
    return [
      A.tagId,
      ((w = u.get(A.tagId)) == null ? void 0 : w.size) || 0
    ];
  })), m = new Map(e.nodes.map((A) => [A.tagId, 0])), p = e.nodes.filter((A) => f.get(A.tagId) === 0).sort((A, w) => St(A.name, w.name)).map((A) => A.tagId), y = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const A = p.shift();
    if (!y.has(A)) {
      y.add(A);
      for (const w of g.get(A) || [])
        m.set(w, Math.max(m.get(w) || 0, (m.get(A) || 0) + 1)), f.set(w, f.get(w) - 1), f.get(w) === 0 && p.push(w);
    }
  }
  y.size !== e.nodes.length && e.nodes.filter((A) => !y.has(A.tagId)).sort((A, w) => St(A.name, w.name)).forEach((A) => m.set(A.tagId, 0));
  const h = Math.max(0, ...m.values()), C = Math.max(
    t,
    240 + h * 296
  ), x = /* @__PURE__ */ new Map();
  e.nodes.forEach((A) => {
    x.has(A.segmentGroupKey) || x.set(A.segmentGroupKey, {
      key: A.segmentGroupKey,
      id: A.segmentGroupId,
      name: A.segmentGroupName,
      sortOrder: A.segmentGroupSortOrder,
      nodes: []
    }), x.get(A.segmentGroupKey).nodes.push(A);
  });
  const z = [...x.values()].sort((A, w) => A.sortOrder - w.sortOrder || St(A.name, w.name));
  let j = 28;
  const K = [], W = z.map((A) => {
    const w = /* @__PURE__ */ new Map();
    A.nodes.forEach((D) => {
      const q = m.get(D.tagId) || 0;
      w.has(q) || w.set(q, []), w.get(q).push(D);
    });
    for (const D of w.values())
      D.sort((q, te) => q.segmentGroupTagSortOrder - te.segmentGroupTagSortOrder || St(q.name, te.name));
    const T = Math.max(1, ...[...w.values()].map((D) => D.length)), _ = T * 58 + (T - 1) * 18, E = 70 + _, R = {
      ...A,
      x: 12,
      y: j,
      width: C - 24,
      height: E
    };
    for (const [D, q] of w.entries()) {
      const te = q.length * 58 + Math.max(0, q.length - 1) * 18, pe = (_ - te) / 2;
      q.forEach((be, X) => K.push({
        ...be,
        rank: D,
        x: 28 + D * 296,
        y: j + 34 + 18 + pe + X * 76,
        width: 184,
        height: 58
      }));
    }
    return j += E + 16, R;
  }), O = new Map(K.map((A) => [A.tagId, A])), k = e.connections.map((A) => {
    const w = O.get(A.sourceTagId), T = O.get(A.derivedTagId), _ = w.x + w.width, E = w.y + w.height / 2, R = T.x, D = T.y + T.height / 2, q = Math.max(48, (R - _) * 0.48);
    return {
      ...A,
      path: `M ${_} ${E} C ${_ + q} ${E}, ${R - q} ${D}, ${R} ${D}`
    };
  });
  return {
    width: C,
    height: Math.max(r, j - 16 + 28),
    nodes: K,
    connections: k,
    groups: W
  };
}
function Kc(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Uc(d, {
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
      const y = m.get(p.sourceTagId), h = m.get(p.derivedTagId), C = y.x + y.width, x = y.y + y.height / 2, z = h.x, j = h.y + h.height / 2, K = Math.max(48, (z - C) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${C} ${x} C ${C + K} ${x}, ${z - K} ${j}, ${z} ${j}`
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
function Ca(e, t = []) {
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
function zc(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function Hc(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: u, emptyDraft: f, graph: m, layout: p, listSort: y, materializationOffer: h, materializeOutgoingRules: C, materializeRule: x, message: z, normalizedQuery: j, query: K, refreshConfiguredTag: W, revealEditor: O, rules: k, save: A, segmentGroupKey: w, selectedNode: T, selectedRule: _, selection: E, setConfiguringTag: R, setDraft: D, setListSort: q, setMaterializationOffer: te, setQuery: pe, setSegmentGroupKey: be, setSelection: X, setView: F, sortedVisibleRules: ae, sourceSlots: ce, sourceSlotsLoading: J, updateMapping: he, updateTag: ve, view: re, visibleComponents: le, visibleRules: me } = e;
  function Y(v) {
    const b = m.nodes.find((P) => P.tagId === Number(v.sourceTagId)), S = m.nodes.find((P) => P.tagId === Number(v.derivedTagId));
    return (b == null ? void 0 : b.segmentGroupKey) === (S == null ? void 0 : S.segmentGroupKey) ? b.segmentGroupKey : "cross-group";
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
            n(Wn, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (v, b) => ve("source", v, b == null ? void 0 : b.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !J && ce.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (v) => R({
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
            n(Wn, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (v, b) => ve("derived", v, b == null ? void 0 : b.label),
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
              onClick: (v) => R({
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
            disabled: r || ce.length === 0 || s.length === 0,
            onClick: () => D((v) => ({
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
              onChange: (S) => he(b, "sourceSlotDefinitionId", S.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${b + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...ce.map((S) => n("option", { key: S.id, value: S.id }, wt(S)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: v.derivedSlotDefinitionId,
              disabled: r,
              onChange: (S) => he(b, "derivedSlotDefinitionId", S.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${b + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((S) => n("option", { key: S.id, value: S.id }, wt(S)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => D((S) => ({
                ...S,
                slotMappings: S.slotMappings.filter((P, oe) => oe !== b)
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
          onClick: A,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => D(null), className: o }, "Cancel")
      ])
    ]);
  }
  function M() {
    if (T) {
      const S = me.filter((U) => Number(U.derivedTagId) === T.tagId), P = me.filter((U) => Number(U.sourceTagId) === T.tagId), oe = (U, H, ue) => n("div", {
        key: U.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, H),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${U.sourceTagName} → ${U.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          ue ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => x(U),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => g(U, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(U),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, T.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, T.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${T.incomingRuleCount} incoming · ${T.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (U) => R({
            tagId: T.tagId,
            tagName: T.name,
            trigger: U.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        P.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => C(T, P),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${P.length})`) : null,
        P.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...P.map((U) => oe(U, "Derives", !0))
        ]) : null,
        S.length ? n("details", {
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
              S.length
            )
          ]),
          n(
            "div",
            { key: "rules", className: "space-y-2 border-t border-border p-2" },
            S.map((U) => oe(U, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!_)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const v = m.nodes.find((S) => S.tagId === Number(_.sourceTagId)), b = m.nodes.find((S) => S.tagId === Number(_.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (v == null ? void 0 : v.segmentGroupName) || "Ungrouped"),
          (v == null ? void 0 : v.segmentGroupKey) !== (b == null ? void 0 : b.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(b == null ? void 0 : b.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${_.sourceTagName} → ${_.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${_.edgeCount} materialized lineage edge${_.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (h == null ? void 0 : h.ruleId) === _.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => x(_, h),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => te(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        _.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : _.slotMappings.map((S, P) => n("div", {
          key: `${S.sourceSlotDefinitionId}:${S.derivedSlotDefinitionId}`,
          className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
        }, [
          n(
            "span",
            { key: "source", className: "truncate text-foreground", title: S.sourceSlotLabel || "Unnamed slot" },
            S.sourceSlotLabel || "Unnamed slot"
          ),
          n("span", { key: "arrow", className: "text-secondary" }, "→"),
          n(
            "span",
            { key: "derived", className: "truncate text-foreground", title: S.derivedSlotLabel || "Unnamed slot" },
            S.derivedSlotLabel || "Unnamed slot"
          )
        ]))
      ]),
      n("dl", { key: "metadata", className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-xs" }, [
        n("dt", { key: "created-label", className: "text-secondary" }, "Created"),
        n(
          "dd",
          { key: "created", className: "text-right text-foreground" },
          _.createdAt ? new Date(_.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          _.updatedAt ? new Date(_.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => x(_),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(_),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(_),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function ne() {
    if (le.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, j ? "No derivation relationships match your search." : "No derivation rules.");
    const v = T == null ? void 0 : T.tagId, b = /* @__PURE__ */ new Set();
    return T && (b.add(T.tagId), p.connections.forEach((S) => {
      (S.sourceTagId === T.tagId || S.derivedTagId === T.tagId) && (b.add(S.sourceTagId), b.add(S.derivedTagId));
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
        ...p.groups.map((S) => n("div", {
          key: `group:${S.componentId}:${S.key}`,
          className: `absolute rounded-xl border ${w === S.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
          style: {
            left: `${S.x}px`,
            top: `${S.y}px`,
            width: `${S.width}px`,
            height: `${S.height}px`
          }
        }, n("div", {
          className: "absolute left-3 top-2 max-w-[16rem] truncate text-[11px] font-semibold uppercase tracking-wide text-secondary",
          title: S.name
        }, S.name))),
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
          ...p.connections.map((S) => {
            const P = v === S.sourceTagId || v === S.derivedTagId, oe = T != null, U = P ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${S.id}:visible`,
              d: S.path,
              fill: "none",
              stroke: U,
              strokeWidth: P ? 2.5 : 1.5,
              opacity: oe && !P ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((S) => {
          const P = !j || S.name.toLocaleLowerCase().includes(j), oe = T != null, U = b.has(S.tagId), H = (T == null ? void 0 : T.tagId) === S.tagId;
          return n("button", {
            key: `node:${S.tagId}`,
            type: "button",
            onClick: () => X({ type: "node", id: S.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${H ? "border-accent bg-accent/15 ring-2 ring-accent/25" : U ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${S.x}px`,
              top: `${S.y}px`,
              width: `${S.width}px`,
              height: `${S.height}px`,
              opacity: !P || oe && !U ? 0.62 : 1
            },
            title: `${S.name} — ${S.segmentGroupName}`,
            "aria-label": `${S.name}, ${S.incomingRuleCount} incoming and ${S.outgoingRuleCount} outgoing derivation rules`
          }, [
            n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground" }, S.name),
            n("span", { key: "counts", className: "mt-1 flex items-center gap-2 text-[11px] text-secondary" }, [
              n("span", { key: "in" }, `${S.incomingRuleCount} in`),
              n("span", { key: "arrow", "aria-hidden": "true" }, "→"),
              n("span", { key: "out" }, `${S.outgoingRuleCount} out`)
            ])
          ]);
        }),
        ...p.connections.filter((S) => S.rules.length > 1).map((S) => {
          const P = p.nodes.find((U) => U.tagId === S.sourceTagId), oe = p.nodes.find((U) => U.tagId === S.derivedTagId);
          return n("div", {
            key: `bundle:${S.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(P.x + P.width + oe.x) / 2 - 24}px`,
              top: `${(P.y + P.height / 2 + oe.y + oe.height / 2) / 2 - 10}px`
            },
            "aria-label": `${S.rules.length} rules connect ${S.rules[0].sourceTagName} to ${S.rules[0].derivedTagName}`
          }, `${S.rules.length} rules`);
        })
      ])
    ]);
  }
  function $() {
    if (le.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        j ? "No derivation relationships match your search." : "No derivation rules."
      );
    const v = /* @__PURE__ */ new Map();
    ae.forEach((S) => {
      const P = Y(S);
      v.has(P) || v.set(P, []), v.get(P).push(S);
    });
    const b = [
      ...m.segmentGroups.map((S) => S.key),
      "cross-group"
    ].filter((S) => v.has(S));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, b.map((S) => {
      const P = m.segmentGroups.find((H) => H.key === S), oe = S === "cross-group" ? "Cross-group relationships" : (P == null ? void 0 : P.name) || "Ungrouped", U = v.get(S);
      return n("section", { key: S, "aria-label": oe }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, oe),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${U.length} rule${U.length === 1 ? "" : "s"}`
          )
        ]),
        n("div", { key: "table", role: "table", "aria-label": `${oe} derivation rules` }, [
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
          ...U.map((H) => n("button", {
            key: H.id,
            type: "button",
            role: "row",
            onClick: () => X({ type: "rule", id: H.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(_ == null ? void 0 : _.id) === H.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${H.sourceTagName} → ${H.derivedTagName}` },
              `${H.sourceTagName} → ${H.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(H.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(H.edgeCount))
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
          `${k.length} rules · ${m.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          D(f()), X(null), O();
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
          value: K,
          onChange: (v) => {
            pe(v.target.value), X(null);
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
          value: w,
          disabled: d != null,
          onChange: (v) => {
            be(v.target.value), X(null), D(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...m.segmentGroups.map((v) => n("option", { key: v.key, value: v.key }, v.name))
        ])
      ]),
      re === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: y,
          onChange: (v) => q(v.target.value),
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
            F(v), v === "graph" && (E == null ? void 0 : E.type) === "rule" && X(null);
          },
          "aria-pressed": re === v,
          className: `rounded px-3 py-1.5 text-sm font-medium ${re === v ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
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
        re === "graph" ? ne() : $()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? de() : M()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      z ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, z) : null
    ]),
    i ? n(xo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => W(i),
      onClose: () => {
        const v = i.trigger;
        R(null), requestAnimationFrame(() => {
          v != null && v.isConnected && v.focus();
        });
      }
    }) : null
  ]);
}
function qc({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = B([]), [a, s] = B(null), [l, d] = B([]), [c, g] = B([]), [u, f] = B(!1), [m, p] = B(!1), [y, h] = B(!1), [C, x] = B(""), [z, j] = B(""), [K, W] = B("graph"), [O, k] = B("all"), [A, w] = B(null), [T, _] = B("relationship"), [E, R] = B(null), [D, q] = B(null), te = fe(null), pe = fe(null), be = ii().replace(/:/g, "");
  function X() {
    requestAnimationFrame(() => {
      var N;
      return (N = te.current) == null ? void 0 : N.scrollIntoView({ block: "nearest" });
    });
  }
  async function F(N) {
    const V = await Z("/derivation-rules", N ? { signal: N } : void 0);
    i(V || []);
  }
  ye(() => {
    const N = new AbortController();
    return F(N.signal).catch((V) => {
      V.name !== "AbortError" && x(V.message || "Unable to load derived segment rules.");
    }), () => N.abort();
  }, []), ye(() => {
    const N = new AbortController();
    return a != null && a.sourceTagId ? (f(!0), Z(`/slot-definitions/${a.sourceTagId}`, { signal: N.signal }).then((V) => d(V.definitions || [])).catch((V) => {
      V.name !== "AbortError" && d([]);
    }).finally(() => {
      N.signal.aborted || f(!1);
    })) : (d([]), f(!1)), a != null && a.derivedTagId ? (p(!0), Z(`/slot-definitions/${a.derivedTagId}`, { signal: N.signal }).then((V) => g(V.definitions || [])).catch((V) => {
      V.name !== "AbortError" && g([]);
    }).finally(() => {
      N.signal.aborted || p(!1);
    })) : (g([]), p(!1)), () => N.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), ye(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || u || m)
      return;
    const N = `${a.sourceTagId}:${a.derivedTagId}`;
    pe.current !== N && (pe.current = N, s((V) => !V || Number(V.sourceTagId) !== Number(a.sourceTagId) || Number(V.derivedTagId) !== Number(a.derivedTagId) ? V : ld(V, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    u,
    m
  ]);
  function ae(N, V = !1) {
    V || w({ type: "rule", id: N.id }), pe.current = null, s({
      ruleId: N.id,
      sourceTagId: N.sourceTagId,
      sourceTagName: N.sourceTagName,
      derivedTagId: N.derivedTagId,
      derivedTagName: N.derivedTagName,
      slotMappings: N.slotMappings.map((G) => ({
        sourceSlotDefinitionId: G.sourceSlotDefinitionId,
        derivedSlotDefinitionId: G.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), x(""), X();
  }
  function ce(N, V, G = "") {
    pe.current = null, N === "source" ? (d([]), f(V != null)) : (g([]), p(V != null)), s((ee) => ({
      ...ee,
      [`${N}TagId`]: V == null ? null : Number(V),
      [`${N}TagName`]: G || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function J(N) {
    (a == null ? void 0 : a.ruleId) == null && (pe.current = null);
    const V = [F(), t == null ? void 0 : t()];
    return N.draftKind === "source" ? (f(!0), V.push(Z(`/slot-definitions/${N.tagId}`).then((G) => d(G.definitions || [])).finally(() => f(!1)))) : N.draftKind === "derived" && (p(!0), V.push(Z(`/slot-definitions/${N.tagId}`).then((G) => g(G.definitions || [])).finally(() => p(!1)))), Promise.all(V);
  }
  function he(N, V, G) {
    s((ee) => ({
      ...ee,
      slotMappings: ee.slotMappings.map((ge, Le) => Le === N ? { ...ge, [V]: G } : ge)
    }));
  }
  async function ve() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const N = Ca(a, o);
    if (N) {
      x(N.message);
      return;
    }
    if (a.slotMappings.some((V) => !V.sourceSlotDefinitionId || !V.derivedSlotDefinitionId)) {
      x("Complete or remove every performer slot mapping before saving.");
      return;
    }
    h(!0), x(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let V = null;
      if (a.ruleId != null) {
        const ee = await Z(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${ee.deletedSegmentCount}
Removed lineage edges: ${ee.removedEdgeCount}
Shared derived segments retained: ${ee.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        V = ee.fingerprint;
      }
      x("Saving derived segment rule…");
      const G = await Z("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: V
        })
      });
      if (await F(), w(K === "graph" ? { type: "node", id: Number(G.sourceTagId) } : { type: "rule", id: G.id }), s(null), a.ruleId == null)
        try {
          const ee = await Z(
            `/derivation-rules/${G.id}/materialization/preview`,
            { method: "POST" }
          );
          R(
            ee.createCount + ee.linkCount > 0 ? ee : null
          ), x(ee.createCount + ee.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          R(null), x("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        R(null), x("Derived segment rule saved. Previous materializations were removed.");
    } catch (V) {
      x(V.message || "Unable to save derived segment rule.");
    } finally {
      h(!1);
    }
  }
  async function re(N) {
    h(!0), x("Previewing rule deletion…");
    try {
      const V = await Z(
        `/derivation-rules/${N.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${N.sourceTagName} → ${N.derivedTagName}?

Deleted segments: ${V.deletedSegmentCount}
Removed lineage edges: ${V.removedEdgeCount}
Shared derived segments retained: ${V.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const G = `derivation-rule-delete:${N.id}:${V.fingerprint}`;
      await Z(`/derivation-rules/${N.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ke(G),
          fingerprint: V.fingerprint
        })
      }), ze(G), await F(), (a == null ? void 0 : a.ruleId) === N.id && s(null), (A == null ? void 0 : A.type) === "rule" && A.id === N.id && w(null), (E == null ? void 0 : E.ruleId) === N.id && R(null), x(`Rule deleted with ${V.deletedSegmentCount} exclusively derived segment${V.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (V) {
      x(V.message || "Unable to delete derived segment rule.");
    } finally {
      h(!1);
    }
  }
  async function le(N, V = null) {
    const G = V || await Z(
      `/derivation-rules/${N.id}/materialization/preview`,
      { method: "POST" }
    );
    if (G.createCount + G.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const ee = `derivation-rule-materialize:${N.id}:${G.fingerprint}`, ge = await Z(`/derivation-rules/${N.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Ke(ee),
        fingerprint: G.fingerprint
      })
    });
    return ze(ee), ge;
  }
  async function me(N, V = null) {
    h(!0), x("Finding pending derivations…");
    try {
      const G = await le(N, V);
      if (R(null), await F(), G.createdCount + G.linkedCount === 0) {
        x("Every applicable derivation is already materialized.");
        return;
      }
      x(
        `${G.createdCount} derived segment${G.createdCount === 1 ? "" : "s"} created and ${G.linkedCount} existing segment${G.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (G) {
      x(G.message || "Unable to materialize pending derivations.");
    } finally {
      h(!1);
    }
  }
  async function Y(N, V) {
    if (V.length === 0) return;
    h(!0), x(`Finding pending derivations from ${N.name}…`);
    let G = 0, ee = 0;
    try {
      for (const ge of V) {
        const Le = await le(ge);
        G += Le.createdCount, ee += Le.linkedCount;
      }
      R(null), await F(), x(G + ee === 0 ? `Every outgoing derivation from ${N.name} is already materialized.` : `${G} derived segment${G === 1 ? "" : "s"} created and ${ee} existing segment${ee === 1 ? "" : "s"} linked from ${N.name}.`);
    } catch (ge) {
      await F().catch(() => {
      }), x(ge.message || `Unable to materialize derivations from ${N.name}.`);
    } finally {
      h(!1);
    }
  }
  const de = Ca(a, o), M = He(
    () => Gc(o, e),
    [o, e]
  ), ne = z.trim().toLocaleLowerCase(), v = M.components.filter((N) => O === "all" || N.segmentGroupKeys.includes(O)).filter((N) => !ne || N.nodes.some((V) => V.name.toLocaleLowerCase().includes(ne))), b = v.flatMap((N) => N.rules), S = new Set(
    v.flatMap((N) => N.nodes.map((V) => V.tagId))
  ), P = He(
    () => Kc(v),
    [v]
  ), oe = K === "list" ? zc(
    A,
    b,
    ne.length > 0
  ) : null, U = (A == null ? void 0 : A.type) === "node" && M.nodes.find((N) => N.tagId === A.id && S.has(N.tagId)) || null, H = [...b].sort((N, V) => T === "source" ? St(N.sourceTagName, V.sourceTagName) || St(N.derivedTagName, V.derivedTagName) : T === "target" ? St(N.derivedTagName, V.derivedTagName) || St(N.sourceTagName, V.sourceTagName) : T === "materialized" ? (Number(V.edgeCount) || 0) - (Number(N.edgeCount) || 0) || St(N.sourceTagName, V.sourceTagName) : St(
    `${N.sourceTagName} ${N.derivedTagName}`,
    `${V.sourceTagName} ${V.derivedTagName}`
  ));
  return n(Hc, {
    arrowMarkerId: be,
    busy: y,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: D,
    deleteRule: re,
    derivedSlots: c,
    derivedSlotsLoading: m,
    draft: a,
    draftIssue: de,
    editRule: ae,
    editorRef: te,
    emptyDraft: r,
    graph: M,
    layout: P,
    listSort: T,
    materializationOffer: E,
    materializeOutgoingRules: Y,
    materializeRule: me,
    message: C,
    normalizedQuery: ne,
    query: z,
    refreshConfiguredTag: J,
    revealEditor: X,
    rules: o,
    save: ve,
    segmentGroupKey: O,
    selectedNode: U,
    selectedRule: oe,
    selection: A,
    setConfiguringTag: q,
    setDraft: s,
    setListSort: _,
    setMaterializationOffer: R,
    setQuery: j,
    setSegmentGroupKey: k,
    setSelection: w,
    setView: W,
    sortedVisibleRules: H,
    sourceSlots: l,
    sourceSlotsLoading: u,
    updateMapping: he,
    updateTag: ce,
    view: K,
    visibleComponents: v,
    visibleRules: b
  });
}
function _c() {
  const [e, t] = B(ei), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => ea({ ...l, [a]: s }));
  }
  function i() {
    t(ea(so));
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
function Wc({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = B([]), [a, s] = B(!1), [l, d] = B(!1), [c, g] = B(""), [u, f] = B(""), [m, p] = B("all"), [y, h] = B(() => /* @__PURE__ */ new Set()), [C, x] = B(null);
  ye(() => {
    if (!e || a) return;
    const R = new AbortController();
    return d(!0), g(""), Z("/slot-definitions", { signal: R.signal }).then((D) => {
      i(D || []), s(!0);
    }).catch((D) => {
      D.name !== "AbortError" && g(D.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      R.signal.aborted || d(!1);
    }), () => R.abort();
  }, [e, a]);
  async function z() {
    d(!0), g("");
    try {
      const R = await Z("/slot-definitions");
      i(R || []), s(!0);
    } catch (R) {
      g(R.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function j() {
    const [R] = await Promise.all([
      Z("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(R || []), s(!0), g("");
  }
  function K() {
    const R = C == null ? void 0 : C.trigger;
    x(null), requestAnimationFrame(() => {
      R != null && R.isConnected && R.focus({ preventScroll: !0 });
    });
  }
  function W(R) {
    h((D) => {
      const q = new Set(D);
      return q.has(R) ? q.delete(R) : q.add(R), q;
    });
  }
  const O = He(
    () => jc(t, o),
    [t, o]
  ), k = He(
    () => Bc(O, u, m),
    [O, u, m]
  ), A = O.flatMap((R) => R.tags), w = A.filter((R) => R.definitions.length > 0).length, T = A.length - w, _ = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], E = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${A.length} tags · ${w} with slots · ${T} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: u,
          onChange: (R) => f(R.target.value),
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
          _.map(([R, D]) => n("button", {
            key: R,
            type: "button",
            onClick: () => p(R),
            "aria-pressed": m === R,
            className: `rounded px-3 py-1.5 text-xs font-medium ${m === R ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, D))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => h(/* @__PURE__ */ new Set()),
          className: E
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => h(new Set(O.map((R) => R.overviewKey))),
          className: E
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
        onClick: z,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && k.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, k.map((R) => {
      const D = y.has(R.overviewKey), q = R.tags.filter((te) => te.definitions.length > 0).length;
      return n("article", {
        key: R.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => W(R.overviewKey),
          "aria-expanded": !D,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, D ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, R.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${R.tags.length} tag${R.tags.length === 1 ? "" : "s"} · ${q} with slots`
          )
        ]),
        D ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          R.tags.map((te) => n("li", {
            key: te.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: te.tagName }, te.tagName),
              te.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            te.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${te.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, te.definitions.map((pe) => n("li", {
              key: pe.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, wt(pe)),
              ...(pe.genderHints || []).map((be) => n("span", {
                key: be,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, Ir(be)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (pe) => x({
                tagId: te.tagId,
                tagName: te.tagName,
                trigger: pe.currentTarget
              }),
              "aria-label": `Edit performer slots for ${te.tagName}`,
              className: `${E} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    C ? n(xo, {
      key: `performer-slots-configure:${C.tagId}`,
      tagId: C.tagId,
      tagName: C.tagName,
      onSaved: j,
      onClose: K
    }) : null
  ]);
}
function Vc({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = B("general"), [a, s] = B([]), [l, d] = B(!1), [c, g] = B(""), [u, f] = B(""), [m, p] = B(null), [y, h] = B(!0), [C, x] = B(!1), [z, j] = B(""), [K, W] = B(!0), [O, k] = B(Wa), A = Il(t), w = A.map(([D]) => D);
  ye(() => {
    w.includes(o) || i(w[0] || "general");
  }, [t.effectiveMode]);
  async function T(D) {
    const q = await Z("/segment-groups", D ? { signal: D } : void 0);
    s(q || []);
  }
  ye(() => {
    const D = new AbortController();
    return T(D.signal).catch((q) => {
      q.name !== "AbortError" && g(q.message || "Unable to load tag groups.");
    }), () => D.abort();
  }, []), ye(() => {
    if (t.effectiveMode !== "full") {
      h(!1);
      return;
    }
    const D = new AbortController();
    return j(""), h(!0), Promise.all([
      Z("/analysis/settings", { signal: D.signal }),
      Z("/analysis/status", { signal: D.signal })
    ]).then(([q, te]) => {
      W(!0), f((q == null ? void 0 : q.baseUrl) || ""), p(te);
    }).catch((q) => {
      if (q.name !== "AbortError") {
        if (q.status === 403) {
          W(!1), j("You do not have permission to manage the analysis service connection.");
          return;
        }
        j(q.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      D.signal.aborted || h(!1);
    }), () => D.abort();
  }, [t.effectiveMode]);
  async function _(D) {
    if (D !== t.requestedMode) {
      d(!0), g("");
      try {
        const q = await Z(
          `/preferences/transition?mode=${encodeURIComponent(D)}`
        );
        let te = !1, pe = null, be = null, X = null, F = !1;
        if (t.requestedMode === "basic" && D === "full") {
          if (!window.confirm(Tl(
            q.recyclingBinCount,
            q.protectedRecyclingBinCount
          )))
            return;
          F = !0, q.recyclingBinCount > 0 && (te = !0, X = q.recyclingBinFingerprint, pe = `mode-switch-empty-bin:${X}`, be = Ke(pe));
        }
        let ae = !1;
        if (t.requestedMode === "full" && D === "basic") {
          if (!window.confirm($l(
            q.extensionOwnedSegmentCount
          )))
            return;
          ae = !0;
        }
        const ce = await Z("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: D,
            confirmHiddenExtensionOwnedSegments: ae,
            confirmBasicHistoryCleanup: F,
            emptyRecyclingBin: te,
            operationId: be,
            expectedRecyclingBinFingerprint: X
          })
        });
        pe && ze(pe), r == null || r(ti(ce)), g("Workflow mode saved.");
      } catch (q) {
        g(q.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function E(D) {
    D.preventDefault(), x(!0), j("");
    try {
      const q = await Z("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: u })
      });
      f((q == null ? void 0 : q.baseUrl) || "");
      const te = await Z("/analysis/status");
      p(te), j(q != null && q.baseUrl ? te != null && te.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(te == null ? void 0 : te.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (q) {
      j(q.message || "Unable to save analysis service settings.");
    } finally {
      x(!1);
    }
  }
  const R = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (D) => $i(D, e, R), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      A.map(([D, q]) => n("button", {
        key: D,
        type: "button",
        onClick: () => i(D),
        "aria-current": o === D ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === D ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, q))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(_c)
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
      n(lc, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: _,
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
          checked: O,
          onChange: (D) => {
            const q = D.target.checked;
            Va(q), k(q);
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
      n("form", { key: "form", onSubmit: E, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
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
            disabled: y || C || !K,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: y || C || !K,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, C ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        z || (y ? "Loading analysis service settings…" : (m == null ? void 0 : m.configured) === !1 ? "Full Scan is not configured." : m != null && m.ready ? "Analysis service is ready." : (m == null ? void 0 : m.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    w.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(qc, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => T()
      })
    ) : null,
    w.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(Wc, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => T()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function $a({ facets: e, values: t, disabled: r, onChange: o }) {
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
function Jc({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var g, u;
  const s = [...e.slots || []].sort((f, m) => f.sortOrder - m.sortOrder || String(f.slotDefinitionId).localeCompare(String(m.slotDefinitionId))), l = [...new Map(s.map((f) => [
    f.performerId,
    { id: f.performerId, name: f.performerName }
  ])).values()], d = s.map((f) => ({
    slotDefinitionId: f.slotDefinitionId,
    label: wt(f),
    performer: { id: f.performerId, name: f.performerName }
  })), c = ri(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: mi(t)
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
          n(mn, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((u = e.activity) == null ? void 0 : u.name) || "Tag segment"),
          l.length ? n(Cr, {
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
function Yc({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(Ea, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: Ml(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: ri(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Ta({ onNavigate: e, profile: t }) {
  const r = He(() => {
    const F = Pa("ext:com.midnightrider.segment-studio:segments");
    return F ? {
      ..._r,
      defaultFilter: { ..._r.defaultFilter, ...F.findFilter || {} },
      defaultObjectFilter: F.objectFilter || {}
    } : _r;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Oa(r), [l, d] = B(null), [c, g] = B({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [u, f] = B(null), [m, p] = B(null), [y, h] = B(0), [C, x] = B(""), [z, j] = B(!0), [K, W] = B(""), O = fe(0), k = na(o, i), A = k.activityTagId, w = An(i.slots), T = He(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (F) => Object.keys(An(F)).length > 0,
    sanitize: (F) => Wr(A, An(F)),
    summarize: (F) => `${Object.keys(An(F)).length} assigned`,
    renderEditor: (F, ae) => A ? n($a, {
      facets: l,
      values: An(F),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (ce, J) => {
        const he = { ...An(F) };
        J ? he[ce] = Number(J) : delete he[ce], ae(Wr(A, he));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [A, l, c.performerSlotsAvailable]), _ = JSON.stringify(k);
  ye(() => {
    if (d(null), !A) return;
    const F = new AbortController();
    return Z(`/browse/activities/${A}/facets`, { signal: F.signal }).then(d).catch((ae) => {
      ae.status === 403 ? d({ slots: [], restricted: !0 }) : ae.name !== "AbortError" && W(ae.message);
    }), () => F.abort();
  }, [A]), ye(() => {
    const F = ++O.current, ae = new AbortController();
    return j(!0), W(""), Z("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(k), signal: ae.signal }).then((ce) => {
      F === O.current && g({ ...ce, totalCount: ce.totalCount ?? ce.total ?? 0 });
    }).catch((ce) => {
      if (!(F !== O.current || ce.name === "AbortError")) {
        if (ce.status === 400 && ce.message.includes("unrestricted performer read access")) {
          g((J) => ({ ...J, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), W("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        W(ce.message);
      }
    }).finally(() => {
      F === O.current && j(!1);
    }), () => {
      O.current++, ae.abort();
    };
  }, [_, y]);
  const E = c.items.findIndex((F) => F.key === u), R = c.items[E] || null;
  function D(F) {
    s(F), a({ ...o, page: 1 });
  }
  function q(F) {
    const ae = na(o, F), ce = F.slots && ae.activityTagId != null && ae.slotAssignments.length > 0 ? F.slots : void 0;
    D({ ...F, slots: ce });
  }
  function te(F, ae) {
    const ce = { ...w };
    ae ? ce[F] = Number(ae) : delete ce[F], D({ ...i, slots: Wr(A, ce) });
  }
  function pe() {
    const F = document.querySelector(`[data-segment-key="${u}"]`);
    f(null), requestAnimationFrame(() => F == null ? void 0 : F.focus());
  }
  async function be(F) {
    var J;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(F.key), x("");
    const ae = `browse-restore:${F.itemId}:${F.revision}`, ce = Ke(ae);
    try {
      const he = (ve = !1) => Z(`/bin/${F.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ce,
          expectedRevision: F.revision,
          discardMissingImage: ve
        })
      });
      try {
        await he(mo(ae));
      } catch (ve) {
        if (((J = ve.payload) == null ? void 0 : J.code) !== "missing-image" || !window.confirm(`${ve.message}

Continue and discard the missing image reference?`))
          throw ve;
        go(ae), await he(!0);
      }
      ze(ae), u === F.key && f(null), x("Segment restored to Cove."), h((ve) => ve + 1);
    } catch (he) {
      x(he.message || "Unable to restore the segment."), he.status === 409 && h((ve) => ve + 1);
    } finally {
      p(null);
    }
  }
  async function X(F) {
    p(F.key), x("");
    try {
      const ae = await Z(`/items/${F.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: F.revision })
      });
      if (!li(ae, x) || !ql(ae))
        return;
      const ce = `browse-dependency-delete:${F.itemId}:${ae.fingerprint}`;
      await Z(`/items/${F.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ke(ce),
          fingerprint: ae.fingerprint
        })
      }), ze(ce), u === F.key && f(null), x(`${ae.deletedSegmentCount} segment${ae.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), h((J) => J + 1);
    } catch (ae) {
      x(ae.message || "Unable to permanently delete the segment."), ae.status === 409 && h((ce) => ce + 1);
    } finally {
      p(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(vo, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(La, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: a,
      totalCount: c.totalCount,
      isLoading: z,
      error: K ? new Error(K) : null,
      onRetry: () => h((F) => F + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? ta.filter((F) => F.id !== "performers") : ta,
      objectFilter: i,
      onObjectFilterChange: q,
      customFilterSections: T,
      searchPlaceholder: "Search segments..."
    }, [
      A ? n($a, { key: "slots", facets: l, values: w, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: te }) : null,
      n(Yc, { key: "player", item: R, index: E, count: c.items.length, onPrevious: () => {
        var F;
        return f((F = c.items[E - 1]) == null ? void 0 : F.key);
      }, onNext: () => {
        var F;
        return f((F = c.items[E + 1]) == null ? void 0 : F.key);
      }, onClose: pe, onNavigate: e }),
      C ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, C) : null,
      !z && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      z ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((F) => n(Jc, {
        key: F.key,
        item: F,
        selected: F.key === u,
        busy: m === F.key,
        onSelect: () => f(F.key),
        onRestore: be,
        onPurge: X
      })))
    ])
  ]);
}
function Qc({ onNavigate: e, profile: t }) {
  const [r, o] = B([]), [i, a] = B(""), [s, l] = B(0), [d, c] = B(!0), [g, u] = B(null), [f, m] = B(""), p = fe(null);
  async function y(x) {
    const z = await Z("/bin", x ? { signal: x } : void 0);
    return o(z.items || []), a(z.fingerprint || ""), l(Number(z.totalCount) || 0), z;
  }
  ye(() => {
    const x = new AbortController();
    return c(!0), y(x.signal).catch((z) => {
      z.name !== "AbortError" && m(z.message);
    }).finally(() => {
      x.signal.aborted || c(!1);
    }), () => x.abort();
  }, []), Da(io, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var x;
      return (x = p.current) == null ? void 0 : x.call(p);
    }
  }]);
  async function h(x) {
    var K;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    u(x.itemId), m("");
    const z = `restore:${x.itemId}:${x.revision}`, j = Ke(z);
    try {
      const W = (O = !1) => Z(`/bin/${x.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: j, expectedRevision: x.revision, discardMissingImage: O })
      });
      try {
        await W(mo(z));
      } catch (O) {
        if (((K = O.payload) == null ? void 0 : K.code) !== "missing-image" || !window.confirm(`${O.message}

Continue and discard the missing image reference?`)) throw O;
        go(z), await W(!0);
      }
      ze(z), await y(), _n(), m("Segment restored with a new native ID.");
    } catch (W) {
      m(W.message || "Unable to restore the segment."), W.status === 409 && await y();
    } finally {
      u(null);
    }
  }
  async function C() {
    if (g == null)
      try {
        const x = await ci({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          u(-1), m("");
        });
        if (x.status !== "emptied") return;
        await y(), _n(), m(`${x.segmentCount} segment${x.segmentCount === 1 ? "" : "s"} from ${x.sceneCount} scene${x.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (x) {
        m(x.message || "Unable to empty the recycling bin."), x.status === 409 && await y();
      } finally {
        u(null);
      }
  }
  return p.current = C, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    n(vo, {
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
        onClick: C,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, g === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    f ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, f) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((x) => n("article", { key: x.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${x.tagName || "Tag segment"} · ${x.videoTitle || `Video ${x.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, x.endSec == null ? Ae(x.startSec) : `${Ae(x.startSec)} – ${Ae(x.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${x.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${x.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: g != null, onClick: () => h(x), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const Aa = "ext:com.midnightrider.segment-studio:videos";
function Yr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = He(() => {
    var me;
    const re = Pa(Aa), le = (me = re == null ? void 0 : re.uiOptions) == null ? void 0 : me.displayMode;
    return re ? {
      ...zn,
      defaultFilter: { ...zn.defaultFilter, ...re.findFilter || {} },
      defaultObjectFilter: re.objectFilter || {},
      defaultDisplayMode: zn.allowedDisplayModes.includes(le) ? le : zn.defaultDisplayMode
    } : zn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = Oa(i), [u, f] = B({ items: [], totalCount: 0 }), [m, p] = B(!0), [y, h] = B(""), [C, x] = B(0), [z, j] = B(/* @__PURE__ */ new Set()), [K, W] = B(null), [O, k] = B({ busy: !1, error: "", announcement: "" }), A = fe(0), w = fe(null), T = fe(null);
  T.current || (T.current = Lc());
  const _ = JSON.stringify(a), E = JSON.stringify(s), R = t || r === "review";
  ye(() => {
    T.current.selectionChanged(), w.current = null, j(/* @__PURE__ */ new Set()), k((re) => ({ busy: re.busy, error: "", announcement: "" }));
  }, [_, E]), ye(() => {
    if (!R) return;
    const re = new AbortController();
    return Z("/analysis/status", { signal: re.signal }).then(W).catch((le) => {
      le.name !== "AbortError" && W({ configured: !0, ready: !1, error: le.message || "Unable to check Full Scan readiness." });
    }), () => re.abort();
  }, [R]), ye(() => {
    const re = ++A.current, le = new AbortController();
    return p(!0), h(""), Z(`/videos?${rc(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: le.signal }).then((me) => {
      re === A.current && f(me);
    }).catch((me) => {
      re === A.current && me.name !== "AbortError" && h(me.message || "Unable to discover videos.");
    }).finally(() => {
      re === A.current && p(!1);
    }), () => {
      A.current++, le.abort();
    };
  }, [_, E, t, r, C]);
  function D(re) {
    d({ ...re, page: re.page || 1 });
  }
  function q(re) {
    c(re), d({ ...a, page: 1 });
  }
  function te(re, le = !1) {
    j((me) => oc(
      me,
      u.items.map((Y) => Y.videoId),
      re,
      w.current,
      le
    )), w.current = re;
  }
  function pe() {
    w.current = null, j(new Set(u.items.map((re) => re.videoId)));
  }
  function be() {
    w.current = null, j(/* @__PURE__ */ new Set());
  }
  function X() {
    w.current = null, j((re) => new Set(u.items.map((le) => le.videoId).filter((le) => !re.has(le))));
  }
  async function F(re = ["aiTagging", "omnishotcut"]) {
    const le = T.current.begin();
    if (le) {
      k({ busy: !0, error: "", announcement: "" });
      try {
        const me = await Fc(
          [...z],
          re,
          Z,
          (Y) => window.confirm(Y)
        );
        if (me.cancelled) {
          k({ busy: !1, error: "", announcement: "" });
          return;
        }
        me.queuedIds.length > 0 && T.current.ownsCurrentSelection(le) && (me.queuedIds.includes(w.current) && (w.current = null), j((Y) => {
          const de = new Set(Y);
          return me.queuedIds.forEach((M) => de.delete(M)), de;
        })), k({
          busy: !1,
          announcement: me.queuedIds.length > 0 ? `${me.queuedIds.length} ${me.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: me.failed.length > 0 ? `${me.failed.length} selected ${me.failed.length === 1 ? "video could" : "videos could"} not be queued. ${me.failed[0].error}` : ""
        });
      } catch (me) {
        k({ busy: !1, error: me.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        T.current.finish(le);
      }
    }
  }
  const ae = t || r === "review" ? va : va.filter((re) => !["reviewState", "shotBoundaries"].includes(re.id)), ce = K === null || K.configured === !1 || K.ready === !1, J = O.busy || ce, he = (K == null ? void 0 : K.error) || (K === null ? "Checking Full Scan availability" : K.configured === !1 ? "Configure the analysis service before running Full Scan" : K.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), ve = O.busy ? "Queueing scans…" : K === null ? "Checking Full Scan…" : K.configured === !1 ? "Full Scan not configured" : K.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
  return n("div", { className: "w-full space-y-5" }, [
    n(vo, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(La, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: Aa,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: D,
      totalCount: u.totalCount,
      isLoading: m,
      error: y ? new Error(y) : null,
      onRetry: () => x((re) => re + 1),
      sortOptions: t || r === "review" ? [...ha, { value: "unreviewed_count", label: "Unreviewed count" }] : ha,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: ae,
      objectFilter: s,
      onObjectFilterChange: q,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: R ? z : void 0,
      onSelectAll: R ? pe : void 0,
      onSelectNone: R ? be : void 0,
      onInvertSelection: R ? X : void 0,
      selectionActions: R ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: J,
          onClick: () => F(),
          title: he,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, ve),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": J,
            title: he,
            onClick: (re) => {
              J && re.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${J ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(Fa, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([re, le]) => n("button", {
            key: re,
            type: "button",
            disabled: O.busy,
            onClick: (me) => {
              var Y;
              (Y = me.currentTarget.closest("details")) == null || Y.removeAttribute("open"), F(le);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, re)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, O.announcement),
      O.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, O.error) : null,
      !m && u.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !m && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, u.items.map((re) => n(ac, { key: re.videoId, item: re, onNavigate: e, showReviewStates: R, selected: z.has(re.videoId), selectionActive: z.size > 0, onSelect: R ? te : null }))) : null,
      !m && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, u.items.map((re) => n(ic, { key: re.videoId, item: re, onNavigate: e, showReviewStates: R, selected: z.has(re.videoId), selectionActive: z.size > 0, onSelect: R ? te : null }))) : null
    ])
  ]);
}
function Ra({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = B(null), [s, l] = B(!0), [d, c] = B(""), g = fe(0), u = fe(0), f = fe(e), m = zd();
  f.current = e;
  const [p] = B(() => Us({
    beginRequest: () => ({ requestId: ++u.current, videoId: f.current }),
    fetchDetail: (j) => Z(y(j.videoId)),
    isCurrent: (j) => cr(j.requestId, u.current, j.videoId, f.current),
    isSameVideo: (j) => j.videoId === f.current
  })), y = (j) => `/videos/${j}/editor`;
  async function h(j, K, W) {
    const O = await Z(y(K), W ? { signal: W.signal } : void 0);
    return cr(j, W ? g.current : u.current, K, f.current) ? (a(O), !0) : !1;
  }
  ye(() => {
    const j = ++g.current, K = e, W = new AbortController();
    return a(null), l(!0), c(""), h(j, K, W).catch((O) => {
      cr(j, g.current, K, f.current) && O.name !== "AbortError" && c(O.message || "Unable to load the editor.");
    }).finally(() => {
      cr(j, g.current, K, f.current) && l(!1);
    }), () => {
      g.current++, u.current++, W.abort();
    };
  }, [e]);
  function C(j, K) {
    a((W) => (W == null ? void 0 : W.video.id) !== K ? W : typeof j == "function" ? j(W) : j);
  }
  function x() {
    return p({
      onLoaded: (j) => {
        a(j), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: (j) => c(j.message || "Unable to reload the latest segment.")
    });
  }
  function z() {
    return p({
      onLoaded: (j) => {
        a(j), c("");
      },
      onError: (j) => c(j.message || "Unable to reload performer slots.")
    });
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
      n(Is, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(Pc, {
      key: i.video.id,
      detail: i,
      onDetailChange: C,
      onConflict: x,
      onReload: z,
      onSlotsChanged: z,
      splitLayout: m,
      profile: o,
      initialSegmentId: oa() ? -oa() : El(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function Zc(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function Xc(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function eu(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function tu({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = wl(o), l = Zc(e, t, window.location.pathname), d = Xc(e, t, window.location.pathname), c = eu(e, t, window.location.pathname), g = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (Cl(g, o) === "videos" && g !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Yr, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(Vc, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(Ta, { onNavigate: r, profile: o });
    const m = Number(e);
    return Number.isInteger(m) && m > 0 ? n(Ra, {
      videoId: m,
      onNavigate: r,
      compatibilityMode: !0,
      profile: o
    }) : n(Yr, {
      onNavigate: r,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return n(Qc, { onNavigate: r, profile: o });
  const f = Number(e);
  return d ? n(Ta, { onNavigate: r, profile: o }) : Number.isInteger(f) && f > 0 ? n(Ra, {
    videoId: f,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(Yr, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function nu({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = B(null), [a, s] = B("");
  return ye(() => {
    const l = new AbortController();
    return Z("/preferences", { signal: l.signal }).then((d) => i(ti(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(tu, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function ru(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function ou(e, t) {
  const r = ru(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const Au = {
  components: { SegmentStudioPage: nu },
  actionHandlers: { openSegmentStudio: ou }
};
export {
  Sr as CLEARED_SEGMENT_SELECTION_ID,
  ha as DISCOVERY_SORT_OPTIONS,
  Jt as SEGMENT_STUDIO_CAPABILITIES,
  io as SEGMENT_STUDIO_EXTENSION_ID,
  Qn as SEGMENT_STUDIO_SHORTCUTS,
  qs as activeEditorFilterCount,
  Od as addPendingChange,
  ld as applyDerivationRuleSlotSuggestions,
  br as applyFeedbackEditorDelta,
  jd as applyPendingChanges,
  ua as applySegmentMergeDelta,
  Vl as basicSegmentTimelineStyle,
  Ml as browseClipEnd,
  ri as browseEditorHref,
  na as buildBrowseRequest,
  Gc as buildDerivationRuleGraph,
  rc as buildDiscoverySearchParams,
  Rs as buildMinuteTimelineTicks,
  jc as buildPerformerSlotOverview,
  Fl as buildSegmentQuickSearchEntries,
  gd as buildSegmentRailRows,
  pd as buildTimelineRows,
  cu as buildTimelineTicks,
  Ps as calculateCenteredTimelineScroll,
  Zr as calculateEditorPanelMaximum,
  Ms as calculateMinuteLabelStride,
  uu as calculateMinuteTimelineWidth,
  Fs as calculateSwimlaneTitleMaximum,
  Os as calculateTimelinePlayheadPosition,
  lo as calculateTimelineRatioBounds,
  Bs as calculateTimelineRatioFromPointer,
  mu as calculateVerticalRevealOffset,
  dn as clampEditorPanelWidth,
  yr as clampSwimlaneTitleWidth,
  _a as clampTimelineRatio,
  co as clampTimelineRatioForHeight,
  xr as clampTimelineZoom,
  Xd as compactProvenanceSummary,
  Bd as confirmPendingChange,
  Lc as createBulkAnalysisCoordinator,
  Us as createEditorReloader,
  ml as createQueuedReviewRequest,
  Ed as createSaveQueue,
  wa as createSegmentAnalysisRequestScope,
  Au as default,
  Ni as discardPendingChange,
  Hl as downloadFileNameFromContentDisposition,
  _s as dualRangeValueFromPointer,
  Zo as duplicateIdentityFromResponse,
  fl as duplicateOperationKey,
  Ja as editorVisibilityIncludingSegment,
  bd as expandedSwimlanes,
  $l as extensionOwnedSegmentsModeSwitchPrompt,
  kd as feedbackFrameTimestamps,
  Nd as feedbackResultMatchesAction,
  wd as feedbackSelectionPlan,
  Hs as filterDerivedSegments,
  qr as filterEditorSegments,
  Bc as filterPerformerSlotOverview,
  Ll as filterSegmentQuickSearch,
  bu as filterSegmentStudioShortcuts,
  xd as findAdjacentSegmentGroupKey,
  Sl as findAdjacentShot,
  dl as findEditorShortcut,
  qa as findInitialSegmentSelection,
  As as findNearestSegmentInCurrentSwimlane,
  xl as findPublishedSelectionIdentity,
  Ye as findSegmentByStableIdentity,
  Gs as findSegmentFromPlayhead,
  Ts as findSegmentNearPlayhead,
  vd as findSwimlaneRangeSelection,
  ro as findSwimlaneSelection,
  Pl as findUniquePerformerSlotAssignment,
  vr as findUnreviewedSelection,
  rd as focusDialogDefaultButton,
  Ir as formatGenderHint,
  kl as frameStepSeconds,
  oi as generatePerformerSlotAssignmentRecommendations,
  yc as groupApprovedDraftsForPublishing,
  Ol as groupAutoAssignCandidates,
  Id as groupIncorrectExamplesByTag,
  Sc as groupMaterializationOutputs,
  cn as groupSegmentsIntoSwimlanes,
  fd as groupSelectedSwimlanes,
  bo as groupSwimlanesBySegmentGroup,
  Ct as handleModalKey,
  Mn as hasSegmentStudioCapability,
  ki as heldTagChangeFor,
  vl as heldTagReady,
  ga as hideCollectedFeedbackSegments,
  da as historyActionsForTarget,
  mr as incorrectExampleHistoryState,
  fi as indexPerformerSlotsBySegment,
  xu as initialReviewFilter,
  Td as insertSegmentProjection,
  cr as isCurrentEditorRequest,
  Xl as isEditableTarget,
  ku as isEditorShortcutOwner,
  Md as isKindRunning,
  Tu as isSaveQueueBusy,
  eu as isSegmentStudioBinRoute,
  Xc as isSegmentStudioSegmentsRoute,
  Zc as isSegmentStudioSettingsRoute,
  Uc as layoutDerivationRuleComponent,
  Kc as layoutDerivationRuleComponents,
  Rd as mergeSegmentsProjection,
  id as multiSelectionActionHint,
  el as nextSegmentAfterRemoval,
  tl as nextUnreviewedAfterRemoval,
  tn as normalizeCollapsedSegmentGroups,
  Sa as normalizeDiscoveryIds,
  Et as normalizeEditorSegmentFilters,
  Xt as normalizeGender,
  Xo as normalizeReviewFilter,
  ti as normalizeSegmentStudioFeatureProfile,
  hu as normalizeSegmentStudioMode,
  to as normalizeSegmentStudioPublicMode,
  An as parseBrowseSlotFilters,
  js as parseEditorLayout,
  Ks as parseHideDerivedSegmentsPreference,
  zs as parseMergeConfirmationPreference,
  Xa as parsePlaybackShortcutConfig,
  sl as parseShortcutBindingOverrides,
  Jr as patchPerformerSlotProjection,
  Iu as patchSegmentProjection,
  Gd as pendingChangesReducer,
  Ld as pendingInsertedSegments,
  nl as percentageSeekTime,
  Dl as performInitialSegmentSeek,
  st as performerOptionId,
  kr as performerSlotHistoryState,
  wt as performerSlotLabel,
  dd as performerSlotPresentation,
  Nu as performerSlotStatus,
  yo as performerSlotStatusFromSegmentSlots,
  pi as performerSlotsForSegment,
  Gt as provenanceSourceLabel,
  Ci as prunePendingChanges,
  hl as queueCreatedSegmentTagChoice,
  ai as rankPerformerOptions,
  Sd as reconcileSegmentGroupKey,
  Zs as reconcileSelectedSegmentIds,
  sc as recyclingBinActionText,
  _l as recyclingBinDeletionPrompt,
  di as recyclingBinDeletionSummary,
  Tl as recyclingBinModeSwitchPrompt,
  vu as removeQueuedReviewsForSegments,
  Ad as removeSegmentsProjection,
  oa as requestedOwnedItemId,
  El as requestedSegmentId,
  Vs as resolveEditorSegmentSelection,
  gl as resolveQueuedReviewRequest,
  yl as resolveSegmentCreationAction,
  Cl as resolveSegmentStudioRoute,
  ll as resolveSegmentStudioShortcuts,
  xi as resolveSegmentTarget,
  zc as resolveSelectedDerivationRule,
  Jo as resolveSelectedSegments,
  Ic as restoreDisabledToolbarActionFocus,
  Dc as restorePublishApprovedFocus,
  Cu as restoreSegmentFieldsProjection,
  $u as restoreSegmentsProjection,
  Fd as retargetPendingChanges,
  vi as revealCollapsedSegmentGroup,
  Fc as runSelectedDiscoveryAnalysis,
  En as sameSegmentIdentity,
  Si as savingSegmentIdFrom,
  ui as segmentBadgeStyle,
  Nr as segmentGroupHeaderBackground,
  jt as segmentGroupKeyForSegment,
  fo as segmentHistoryIdentity,
  ur as segmentHistoryState,
  qt as segmentIdentity,
  mi as segmentRailItemStyle,
  Su as segmentStateStyle,
  ru as segmentStudioActionTarget,
  wl as segmentStudioLegacyMode,
  Wl as segmentTimelineStyle,
  Mt as segmentsHistoryState,
  Xs as selectAllVideoSegmentIds,
  Al as selectedBrowseStates,
  bi as selectedSwimlaneMerge,
  $i as setBackLinkNavigation,
  Ii as settlePendingChange,
  od as sharedPerformerSlotShape,
  ad as sharedTagPerformerSlotShape,
  Rn as shortcutAvailableInMode,
  cl as shortcutBindingDisplayText,
  gu as shortcutBindingFromEvent,
  fu as shortcutBindingsOverlap,
  yu as shortcutModesOverlap,
  il as shortcutRequiresSingleSegment,
  qn as shotBoundaryFingerprint,
  nd as shouldAcceptCurrentTagFromEnter,
  td as shouldDismissPopover,
  pu as shouldExitShortcutCapture,
  wu as shouldHandleEditorShortcut,
  ka as shouldLoadSegmentAnalysis,
  ba as shouldReloadAfterSegmentMutation,
  eo as shouldRestoreTransitionSelection,
  jl as shouldShowQuickSearchGroups,
  Yo as splitShortcutCategoriesIntoColumns,
  sd as suggestDerivationRuleSlotMappings,
  Jn as swimlaneDisplayLabel,
  Zl as swimlaneMarkerTop,
  Yl as swimlaneStripeBackground,
  bl as tagEditorLockedBySave,
  ho as targetsOverlap,
  Ls as timelineContentStyle,
  _o as timelinePlayheadHorizontalStyle,
  Jl as timelineSegmentWidth,
  Es as timelineTickAlignment,
  Ds as timelineTickPosition,
  Qr as timelineTimePercent,
  hd as toggleAllCollapsedSegmentGroups,
  ul as toggledSelectionReviewState,
  _t as trapModalFocus,
  Ul as tryParseJsonResponseText,
  Qs as updateAnchoredSegmentSelection,
  oc as updateDiscoverySelection,
  Ws as updateDualRangeValues,
  Js as updateSegmentCollectionSelection,
  Ys as updateSegmentRangeSelection,
  Ya as updateSegmentSelection,
  Ca as validateDerivationRuleDraft,
  qo as validateSegmentTiming,
  uo as videoPerformerOptions,
  Vr as videoPerformerSlotAssignments,
  Il as visibleSegmentStudioSettingsTabs,
  Nl as visibleSegmentStudioTabs,
  yi as visibleVirtualRows
};
