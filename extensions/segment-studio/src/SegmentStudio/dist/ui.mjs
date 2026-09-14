import ro from "@cove/runtime/react";
import { createPortal as hs } from "@cove/runtime/react-dom";
import { extensionFetch as Ra } from "@cove/runtime/api";
import { formatDuration as vs, EntityReferenceSelector as _n, useExtensionKeyboardBindings as xs, VideoPlayer as Ma, useRegisterExtensionKeyboardActions as Ea, getDefaultFilter as Da, useListUrlState as Pa, ListPage as Oa } from "@cove/runtime/components";
import { ChevronDown as La, StepBack as Ss, StepForward as ks, Loader2 as ws } from "@cove/runtime/lucide-react";
const oo = "com.midnightrider.segment-studio", Fa = "segment-studio.layout.v1", ln = "segment-studio.operations.v1", ja = "segment-studio.collapsed-segment-groups.v1", Ba = "segment-studio.playback-shortcuts.v1", Ga = "segment-studio.timing-clipboard.v1", Ua = "segment-studio.hide-derived-segments.v1", Ka = "segment-studio.merge-confirmation.v1", xt = ["unreviewed", "approved", "rejected"], Ns = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], Uo = "(min-width: 1024px) and (min-height: 640px)", Ko = "(min-width: 1024px) and (min-height: 900px)", Wn = 1e-3, zo = 15, Is = 30, za = 12, wt = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, ao = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30
}, Jt = {
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
  return r.find((o) => o.id === t) ?? br(e, null, 1, !0) ?? r[0] ?? null;
}
function br(e, t, r, o = !1) {
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
    return Number.isFinite(m) && Number.isFinite(p) && p >= m && m <= i + zo + Wn && p >= i - zo - Wn;
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
function hr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function iu(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function Ts(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function su(e, t = 1, r = 48) {
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
function Ho(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function Ps(e, t = za) {
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
function an(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? wt.detailWidth : Math.min(Yr(t, 0), Math.max(240, e));
}
function pr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? wt.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function Os(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function io(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: wt.timelineRatio, maximum: wt.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function so(e, t) {
  const r = Ha(e);
  if (!(t > 0)) return r;
  const o = io(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function Ls(e) {
  if (!e) return { ...wt };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? Ha(r) : wt.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: an(t == null ? void 0 : t.detailWidth),
      markerRailWidth: an(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: pr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...wt };
  }
}
function Fs(e, t, r) {
  return r > 0 ? so((t + r - e) / r, r) : wt.timelineRatio;
}
function lu(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function js(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, g) => c.startSec - g.startSec || c.id - g.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= Wn ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function lr(e, t, r, o) {
  return e === t && r === o;
}
function Bs({ beginRequest: e, fetchDetail: t, isCurrent: r, isSameVideo: o }) {
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
const vr = "__segment-studio-cleared-selection__";
function Gs(e) {
  return e === "true";
}
function Us(e) {
  return e !== "false";
}
function _a() {
  try {
    return Us(window.localStorage.getItem(Ka));
  } catch {
    return !0;
  }
}
function Wa(e) {
  try {
    window.localStorage.setItem(Ka, String(!!e));
  } catch {
  }
}
function Ks(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function Mt(e = {}) {
  const t = xt.filter((g) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(g) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (g, u) => {
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
  const a = Mt(r), s = a.performerId == null ? null : new Set((t || []).filter((u) => Number(u.performerId) === a.performerId).map((u) => u.segmentId)), l = new Set((i || []).flatMap((u) => u.tags || []).map((u) => Number(u.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((g = (c = (i || []).find((u) => Number(u.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : g.map((u) => Number(u.tagId))) || []);
  return Ks(e || [], o).filter((u) => {
    if (u.reviewState != null && !a.reviewStates.includes(u.reviewState) || s && !s.has(u.id) || a.tagId != null && Number(u.tagId) !== a.tagId || d && !d.has(Number(u.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(u.tagId)) || a.sourceKey != null && u.sourceKey !== a.sourceKey) return !1;
    const f = Number(u.confidence);
    return u.confidence == null || !Number.isFinite(f) ? a.includeUnscored : f >= a.confidenceMin && f <= a.confidenceMax;
  });
}
function Va(e, t, r, o = !1, i = []) {
  var l;
  const a = Mt(r);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = Mt({
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
    filters: Mt(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function zs(e, t = !1) {
  const r = Mt(e);
  return +(r.reviewStates.length !== xt.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function qs(e, t, r) {
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
function _s(e, t, r = null) {
  return t === vr ? null : qa(
    e,
    t ?? r
  );
}
function Ja(e, t, r, o = !1) {
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
function Ws(e, t, r) {
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
function Vs(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return Ja(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function Js(e, t, r = null, o = !1) {
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
      ...Vs(u, s, t, g, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: u
    };
  }
  const d = Ja(i, a, t, o);
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
function Ys(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function Qs(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function _o(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function Wo(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => _o(t, o) - _o(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function Zs(e, t, r) {
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
function Xs(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function el(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function Vo(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function tl() {
  try {
    return Gs(window.localStorage.getItem(Ua));
  } catch {
    return !1;
  }
}
function nl(e) {
  try {
    window.localStorage.setItem(Ua, String(!!e));
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
], rl = /* @__PURE__ */ new Set([
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
function ol(e) {
  return rl.has(e);
}
function Ya(e) {
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
function al(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Yn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(Ya).filter(Boolean)]));
  } catch {
    return {};
  }
}
function il(e = {}) {
  const t = al(e);
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
function du(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : Ya({
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
function Yo(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function uu(e, t) {
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
function mu(e, t) {
  return [!1, !0].some((r) => An(e, r) && An(t, r));
}
function sl(e, t = !1, r = {}) {
  return il(r).find((o) => An(o, t) && o.bindings.some((i) => Qr(e, i))) || null;
}
function Qa(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function ll(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Qa).join(" / ") : "Unassigned";
}
function gu(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, ll(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function pu(e) {
  return e === "review" ? "review" : "editor";
}
function Qe(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function dl(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function cl(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function ul(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => Qe(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: Qe(t, e.activeIdentity) || r[0]
  };
}
function ml(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function fu(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => ml(o, i))));
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
function gl(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function pl(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function fl(e, t, r) {
  return e != null && (r == null || t !== r);
}
function yl(e, t, r, o = null) {
  if (r === t.tagId) return null;
  const i = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: r,
    tagName: o || ((i == null ? void 0 : i.tagId) === r ? i.tagName : null)
  };
}
function bl({ tagEditing: e, selectedSegmentIds: t, activeSegmentId: r }, o) {
  return !(e && r === o && (t == null ? void 0 : t.length) === 1 && t[0] === o);
}
function Zr(e, t) {
  return e === t;
}
function hl(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function vl(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - Wn).at(-1) || null : o.find((i) => i.startSec > t + Wn) || null;
}
function qn(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function Zo(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: xt.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function yu(e, t = null, r = !1) {
  const o = Zo(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function $n(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function Za(e) {
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
    return { ...ao };
  }
}
function xl(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function Xa() {
  try {
    return Za(window.localStorage.getItem(Ba));
  } catch {
    return { ...ao };
  }
}
function Xo(e) {
  const t = Za(JSON.stringify(e));
  try {
    window.localStorage.setItem(Ba, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Yt = Object.freeze({
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
function ei(e) {
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
function Sl(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function kl(e) {
  const t = [];
  return Rn(e, Yt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), Rn(e, Yt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function wl(e) {
  return [
    ["general", "General", Yt.settingsGeneral],
    ["shortcuts", "Shortcuts", Yt.settingsShortcuts],
    ["performer-slots", "Performer slots", Yt.settingsPerformerSlots],
    ["derivation", "Derivation", Yt.settingsDerivation]
  ].filter(([, , r]) => Rn(e, r)).map(([r, o]) => [r, o]);
}
function Nl(e, t) {
  return e === "segments" && !Rn(
    t,
    Yt.navigationSegmentInventory
  ) || e === "bin" && !Rn(
    t,
    Yt.recyclingBinView
  ) ? "videos" : e;
}
function Il(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Cl(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const qr = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, ea = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: xt.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function $l(e) {
  const t = String(e || "").split(",").filter((r) => xt.includes(r));
  return t.length === 0 ? [...xt] : [...new Set(t)];
}
function Tn(e) {
  return ti(e).values;
}
function ti(e) {
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
function Hr(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function ta(e, t) {
  var l;
  const r = na(t.activitiesCriterion, t.activityId), o = na(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = ti(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: Tl(t.reviewStateCriterion, t.states),
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
function Tl(e, t) {
  return xt.includes(e == null ? void 0 : e.value) ? [e.value] : $l(t);
}
function ni(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Al(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Rl(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function ra(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Ml(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function lt(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function lo(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function _r(e, t) {
  const r = new Set(lo(t).map((o) => String(lt(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function Xt(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function oa(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(Xt).sort().join(",")}`;
}
function ri(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((m) => String(m.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((m) => {
    var p;
    return !((p = m.genderHints) != null && p.length);
  }) && e.length === t.length && !i) {
    const m = [...e].sort((b, v) => String(b.slotDefinitionId).localeCompare(String(v.slotDefinitionId))), p = [...t].sort((b, v) => String(b.name).localeCompare(String(v.name)) || Number(lt(b)) - Number(lt(v)));
    return [{
      assignments: Object.fromEntries(m.map((b, v) => [String(b.slotDefinitionId), String(lt(p[v]))])),
      description: p.map((b) => b.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((m) => t.map((p, b) => ({ performer: p, index: b })).filter(({ performer: p }) => {
    var b;
    return !((b = m.genderHints) != null && b.length) || m.genderHints.some((v) => Xt(v) === Xt(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), g = i ? c.filter((m) => m.length > 0).length : aa(c, t.length);
  if (g === 0) return [];
  const u = new Map(t.map((m, p) => [String(lt(m)), p]));
  function f(m, p, b) {
    if (s.length >= a) return;
    const v = c.slice(m), I = i ? v.filter((U) => U.length > 0).length : aa(v.map((U) => U.filter((_) => !p.has(String(lt(t[_]))))), t.length);
    if (b + I < g) return;
    if (m === e.length) {
      if (b !== g) return;
      const U = Object.fromEntries(d.map(({ slot: A, performer: y }) => [String(A.slotDefinitionId), y ? String(lt(y)) : ""])), _ = o.length === 0 ? Object.values(U).sort().join(",") : [...new Set(e.map((A) => String(A.label || "")))].map((A) => `${A}:${d.filter(({ slot: y }) => String(y.label || "") === A).map(({ performer: y }) => y ? String(lt(y)) : "").sort().join(",")}`).join("|");
      !l.has(_) && s.length < a && (l.add(_), s.push({
        assignments: U,
        description: d.map(({ slot: A, performer: y }) => o.length ? `${A.label}: ${(y == null ? void 0 : y.name) || "Unassigned"}` : (y == null ? void 0 : y.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const x = e[m], q = [...d].reverse().find(({ slot: U }) => oa(U) === oa(x)), L = q ? u.get(String(lt(q.performer))) : -1;
    for (const U of c[m]) {
      const _ = t[U], A = lt(_);
      if (!(U < L) && !(A == null || !i && p.has(String(A))) && (d.push({ slot: x, performer: _ }), i || p.add(String(A)), f(m + 1, p, b + 1), i || p.delete(String(A)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: x, performer: null }), f(m + 1, p, b), d.pop();
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
function El(e, t) {
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
function Dl(e) {
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
function Pl(e, t, r = 20) {
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
function Ll(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function oi(e, t, r) {
  const o = lt, i = new Set((t || []).map(o)), a = new Set((r || []).map(Xt));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const u = Xt(l.gender || l.genderIdentity), f = Xt(d.gender || d.genderIdentity), m = l.matchesGenderHint ?? a.has(u);
    return (d.matchesGenderHint ?? a.has(f)) - m || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: be, useId: ai, useLayoutEffect: ia, useMemo: He, useReducer: Fl, useRef: ye, useState: F, useSyncExternalStore: jl } = ro, n = ro.createElement, ii = "/api/plugins/segment-studio";
function ze(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(ln) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = eo();
    return t[e] = r, window.localStorage.setItem(ln, JSON.stringify(t)), r;
  } catch {
    return eo();
  }
}
function qe(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(ln) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(ln, JSON.stringify(t));
  } catch {
  }
}
function co(e) {
  try {
    return JSON.parse(window.localStorage.getItem(ln) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function uo(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(ln) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(ln, JSON.stringify(t));
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
  const o = await Ra(`${ii}${e}`, t);
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
  const r = String(e).startsWith("/api/") ? e : `${ii}${e}`, o = await Ra(r, t);
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
function Re(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function eo() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function si(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function zl(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function li(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function ql(e, t) {
  const { sceneCount: r, segmentCount: o } = li(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function di(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = li(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(ql(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await ee("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: ze(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return qe(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function sa({ children: e }) {
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
function bu(e, t) {
  return {
    ...(Bt[e] || Bt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function ci(e) {
  return { ...(Bt[e] || Bt.unreviewed).badge };
}
function ui(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const mi = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function Hl(e, t, r = "not-applicable", o = !1) {
  const i = Bt[e] || Bt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
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
function kr(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function Yl(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function dn({ state: e, includeLabel: t = !0 }) {
  const r = Bt[e] || Bt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: ci(e)
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
function hu(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function Zl(e, t = document) {
  return !(e.defaultPrevented || Ql(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function vu(e, t = document, r = !1, o = {}) {
  return Zl(e, t) ? sl(e, r, o) != null : !1;
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
function mo({ confirmRef: e, cancelRef: t, confirmReady: r }) {
  be(() => {
    const o = requestAnimationFrame(() => ed({
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
function la(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? i.filter((a) => a.sequence > o && a.sequence <= r).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > r && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function go(e, t = !0) {
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
function dr(e, t = !0) {
  return {
    type: "segment",
    identity: go(e, t),
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
function Rt(e, t = !0) {
  return {
    type: "segments",
    segments: (e || []).map((r) => ({
      identity: go(r, t),
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
function cr(e, t) {
  return {
    type: "incorrectExamples",
    collected: t,
    entries: (e || []).map(({ segment: r, result: o, example: i }) => ({
      exampleId: (o == null ? void 0 : o.exampleId) ?? (i == null ? void 0 : i.id) ?? null,
      originalIdentity: go(r),
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
function gi(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function pi(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = t.get(r.segmentId);
    o ? o.push(r) : t.set(r.segmentId, [r]);
  }
  for (const r of t.values())
    r.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function po(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function td(e, t) {
  const r = (t || []).map((i) => gi(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: St(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function nd(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : td(e, t);
}
function rd({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
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
  return po(gi(e, t));
}
function St(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function od(e, t) {
  const r = (d) => St(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
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
function ad(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = od(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function id(e) {
  const t = St(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(wr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function wr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function Sr(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function da(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((g) => g.end <= s && g.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: Sr(o),
    trackCount: Math.max(1, t.length)
  };
}
function sd(e) {
  const t = e.map(St), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function ld(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], g = d.length > 0 && d.every((u) => Number(u.performerId) > 0) ? d.map((u) => `${u.slotDefinitionId}:${Number(u.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: g };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [da({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = sd(l.slots), g = l.slots.filter((b) => !a.has(String(b.slotDefinitionId))), u = o.length === 1 ? l.slots : g, f = u.map((b) => `${c.get(String(b.slotDefinitionId))} · ${b.performerName || `Performer ${b.performerId}`}`).join(" · "), m = [...new Map(u.map((b) => [
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
          performerLabel: f,
          performers: m,
          performerAssignments: p,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(da);
}
function sn(e, t = [], r = []) {
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => ld(s, a));
}
function fo(e) {
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
    for (const s of xt)
      a.counts[s] += Number((r = o.counts) == null ? void 0 : r[s]) || 0;
  }
  return t;
}
const dd = {
  group: 38,
  lane: 33,
  segment: 41
};
function cd(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = dd[s.kind];
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
function fi(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function ud(e, t = [], r = !0) {
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
function md(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: Sr(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return fo(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: Sr(a)
    };
  });
}
function yi(e, { nativeOnly: t = !1 } = {}) {
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
function ca(e, t) {
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
function Vn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function gd(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var r;
    return (r = t[0]) == null ? void 0 : r.toUpperCase();
  }).join("") || "?";
}
function Jn({ performer: e, compact: t = !1, tooltip: r = null }) {
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
    }, o ? gd(e.name) : "—"),
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
function bi({ assignments: e, className: t = "" }) {
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
      n(Jn, {
        key: `${r.key}:avatar`,
        performer: r.performer
      })
    ];
  }));
}
function Nr({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = ye(null), i = `performer-slots-${ai()}`, [a, s] = F(null);
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
  be(() => {
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
    ...e.slice(0, 3).map((c) => n(Jn, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? hs(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(bi, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : n("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => n(Jn, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function pd(e, t) {
  const r = new Set(tn(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function hi(e, t) {
  return t ? tn(e).filter((r) => r !== t) : tn(e);
}
function fd(e, t) {
  const r = tn(t), o = new Set(tn(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function jt(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function ua(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), g = Number.isFinite(c) && c >= d ? c : d, u = d <= o && g >= o, f = u ? 0 : Math.min(Math.abs(o - d), Math.abs(o - g));
    return { contains: u, distance: f, duration: g - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function to(e, t, r, o = null) {
  var g, u, f, m, p, b;
  const i = e.findIndex((v) => v.markers.some((I) => I.segment.id === t));
  if (i < 0) {
    const v = [...((g = e[0]) == null ? void 0 : g.markers) || []];
    return o != null && Number.isFinite(Number(o)) && v.sort((I, x) => ua(I, x, o)), ((u = v[0]) == null ? void 0 : u.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((v) => v.segment.id === t);
  if (r === "left" || r === "right") {
    const v = r === "left" ? -1 : 1, I = Math.min(a.markers.length - 1, Math.max(0, s + v));
    return ((f = a.markers[I]) == null ? void 0 : f.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((m = a.markers[s]) == null ? void 0 : m.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((p = a.markers[s]) == null ? void 0 : p.segment) ?? null : ((b = [...e[l].markers].sort(c ? (v, I) => ua(v, I, Number(o)) : (v, I) => Math.abs(v.segment.startSec - d) - Math.abs(I.segment.startSec - d) || v.segment.startSec - I.segment.startSec || v.segment.id - I.segment.id)[0]) == null ? void 0 : b.segment) ?? null;
}
function yd(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = to([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function bd(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function hd(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function vd(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [pa(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => pa(Math.min(s, r + l))))];
}
function xd(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function Sd(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function fr(e, t) {
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
function ma(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function kd(e) {
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
async function wd(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await ga(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], g = vd(
        d.startSec,
        d.endSec
      );
      for (const [u, f] of g.entries()) {
        Math.abs(r.currentTime - f) > 5e-4 && (r.currentTime = f, await ga(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const m = await Nd(o), p = `example-${l + 1}-frame-${u + 1}`;
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
function ga(e, t) {
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
function Nd(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function pa(e) {
  return Math.round(e * 1e3) / 1e3;
}
function Su(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Id(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function Cd(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function ku(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function wu(e, t) {
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
function $d(e, t) {
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
function yo(e, t) {
  return (e || []).some((r) => (t || []).some((o) => Mn(r, o)));
}
function Ht(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function vi(e, t) {
  return (e || []).find((r) => Mn(t, r)) || null;
}
function xi(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Td(e, t) {
  var r;
  return ((r = e.running) == null ? void 0 : r.kind) === t;
}
function Nu(e) {
  return e.running != null || e.queued.length > 0;
}
const fa = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
function ur(e) {
  return Object.freeze({
    id: e.id,
    kind: e.kind,
    lockId: e.lockId,
    targets: e.targets,
    exclusive: e.exclusive,
    meta: e.meta
  });
}
function Ad({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let r = 1, o = null, i = [], a = null, s = !1, l = !1;
  const d = /* @__PURE__ */ new Map();
  let c = fa;
  const g = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  let f = [];
  function m() {
    c = o == null && i.length === 0 && a == null ? fa : Object.freeze({
      running: o ? ur(o) : null,
      queued: Object.freeze(i.map(ur)),
      lastFailure: a
    });
    for (const y of [...u]) y();
    if (o == null && i.length === 0) {
      const y = f;
      f = [];
      for (const w of y) w();
    }
  }
  function p(y, w) {
    g.set(y.id, w.status), y.resolve(w);
  }
  function b(y) {
    if (y.dependsOn == null) return "met";
    const w = g.get(y.dependsOn);
    return w === "fulfilled" ? "met" : w != null ? "failed" : "pending";
  }
  function v(y) {
    o = y;
    const w = { ...e(), taskId: y.id, targets: y.targets };
    w.resolveTargets = () => y.targets.map((D) => vi(w.segments, D)).filter(Boolean), m();
    let C;
    try {
      C = y.run(w);
    } catch (D) {
      C = Promise.reject(D);
    }
    Promise.resolve(C).then(
      (D) => I(y, { status: "fulfilled", value: D }),
      (D) => I(y, { status: "rejected", error: D })
    );
  }
  function I(y, w) {
    y.settled || (y.settled = !0, p(y, w), !s && (o = null, w.status === "rejected" && (a = Object.freeze({ id: y.id, kind: y.kind, error: w.error })), m(), t ? x() : l = !0));
  }
  function x() {
    if (s || o != null || l) return;
    let y = !1;
    for (let w = 0; w < i.length; w += 1) {
      const C = i[w], D = b(C);
      if (D === "failed") {
        i = i.filter((Q) => Q !== C), p(C, { status: "dropped", reason: "dependency-failed" }), y = !0, w -= 1;
        continue;
      }
      if (D !== "pending" && !(C.exclusive && w > 0) && !i.slice(0, w).some((Q) => yo(Q.targets, C.targets)) && !(C.ready && !C.ready(e(), ur(C)))) {
        i = i.filter((Q) => Q !== C), v(C);
        return;
      }
    }
    y && m();
  }
  function q(y) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((P) => P.exclusive) || o != null && y.whenBusy !== "enqueue" || y.exclusive && (o != null || i.length > 0 || l)) return null;
    let C;
    const D = new Promise((P) => {
      C = P;
    }), Q = {
      id: r++,
      kind: y.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: y.lockId ?? -1,
      targets: Object.freeze((y.targets || []).map(U)),
      exclusive: y.exclusive === !0,
      dependsOn: y.dependsOn ?? null,
      ready: y.ready || null,
      meta: y.meta ?? null,
      run: y.run,
      resolve: C
    };
    return i = [...i, Q], m(), x(), { id: Q.id, done: D };
  }
  function L(y = {}) {
    let w = null;
    const C = q({
      ...y,
      whenBusy: "reject",
      run: () => new Promise((Q) => {
        w = Q;
      })
    });
    if (!C) return null;
    if (w == null)
      return A((Q) => Q.id === C.id), null;
    let D = !1;
    return () => {
      D || (D = !0, w(), (o == null ? void 0 : o.id) === C.id && I(o, { status: "fulfilled", value: void 0 }));
    };
  }
  function U(y) {
    return (y == null ? void 0 : y.id) == null || y.itemId != null || y.nativeSegmentId != null ? y : d.get(y.id) || y;
  }
  function _(y, w) {
    d.set(y, { ...w });
    let C = !1;
    for (const D of i)
      D.targets.some((Q) => Q.id === y && Q.itemId == null && Q.nativeSegmentId == null) && (D.targets = Object.freeze(D.targets.map((Q) => Q.id === y ? { ...w } : Q)), C = !0);
    return C && m(), C;
  }
  function A(y) {
    const w = i.filter((C) => y(ur(C)));
    if (w.length === 0) return 0;
    i = i.filter((C) => !w.includes(C));
    for (const C of w) p(C, { status: "cancelled" });
    return m(), x(), w.length;
  }
  return {
    enqueue: q,
    acquire: L,
    cancel: A,
    retarget: _,
    stableIdentity: U,
    poke() {
      l = !1, x();
    },
    subscribe(y) {
      return u.add(y), () => u.delete(y);
    },
    getSnapshot: () => c,
    whenIdle() {
      return o == null && i.length === 0 ? Promise.resolve() : new Promise((y) => f.push(y));
    },
    dispose() {
      if (s) return;
      const y = i;
      i = [], s = !0;
      for (const C of y) p(C, { status: "cancelled" });
      u.clear();
      const w = f;
      f = [];
      for (const C of w) C();
    }
  };
}
let Rd = 1;
function Qt() {
  return `pending-${Rd++}`;
}
function Md(e) {
  return e.sort((t, r) => t.startSec - r.startSec || t.id - r.id);
}
function yr(e, t) {
  return (t || []).some((r) => Mn(r, e));
}
function Ed(e, t) {
  return [...e || [], {
    id: t.id ?? Qt(),
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
    return ((o = r.meta) == null ? void 0 : o.kind) === "held-tag" && !r.settled && yr(t, r.targets);
  }) || null;
}
function Dd(e) {
  return (e || []).filter((t) => t.op === "insert" && !t.settled).map((t) => t.segment);
}
function ki(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function wi(e, t) {
  const r = (e || []).filter((o) => !ki(o, t));
  return r.length === (e || []).length ? e : r;
}
function Ni(e, t) {
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
function Od(e, t) {
  if (!t || t.length === 0) return e;
  let r = [...e || []];
  for (const o of t)
    if (o.op === "insert")
      r.some((i) => Mn(o.segment, i)) || r.push(o.segment);
    else if (o.op === "patch")
      r = r.map((i) => yr(i, o.targets) ? { ...i, ...o.values } : i);
    else if (o.op === "remove")
      r = r.filter((i) => !yr(i, o.targets));
    else if (o.op === "merge") {
      const [i, ...a] = o.targets;
      r = r.filter((s) => !yr(s, a)).map((s) => Mn(i, s) ? { ...s, ...o.values } : s);
    }
  return Md(r);
}
function Ii(e, t) {
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
function Ld(e, t, r) {
  return r ? wi(e, t) : Ni(e, t);
}
function Fd(e, t) {
  switch (t.type) {
    case "confirm":
      return Ld(e, t.key, t.applied);
    case "add":
      return Ed(e, t.entry);
    case "discard":
      return wi(e, t.key);
    case "settle":
      return Ni(e, t.key);
    case "retarget":
      return Pd(e, t.temporaryId, t.identity);
    case "prune":
      return Ii(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
function ya(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function jd(e) {
  const { acquireSaveLock: t, compatibilityMode: r, dispatchPendingChanges: o, enqueueSave: i, pendingChanges: a, retargetSaveTasks: s, currentTime: l, detail: d, editorFilters: c, endInput: g, hideDerivedSegments: u, historyRef: f, mediaDuration: m, onConflict: p, onDetailChange: b, onReload: v, optimisticSegmentIdRef: I, pendingDuplicateRef: x, pendingFirstSegmentStartSecRef: q, pendingTagEditSegmentIdRef: L, replaceSegmentSelection: U, savingSegmentId: _, segments: A, selectedSegment: y, selectedSegmentIdRef: w, selectedSegments: C, selectionAnchorIdRef: D, selectionRangeBaseIdsRef: Q, setCreatingSegmentId: P, setEditorFilters: M, setFirstSegmentTagOpen: T, setHideDerivedSegments: H, setHistory: ne, setHistoryOpen: oe, setPublishApprovedError: Te, setSaveMessage: V, setSelectedSegmentGroupKey: K, setSelectedSegmentId: ie, setSelectedSegmentIds: ue, setTagEditing: Y, startInput: ke, tagEditingRef: he, timelineDuration: re, video: le } = e;
  function fe(B) {
    f.current = B || Jt, ne(f.current);
  }
  async function Z(B, z, me, N, W = null) {
    var j;
    try {
      const te = await ee(`/videos/${le.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: f.current.revision,
          kind: B,
          label: z,
          beforeState: me,
          afterState: N,
          receiptId: W
        })
      });
      return fe(te), !0;
    } catch (te) {
      return te.status === 409 && ((j = te.payload) != null && j.current) && fe(te.payload.current), V("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function J(B, z, me = !0, N = null, W = !1, j = z, te = !0) {
    if (!B || _ != null) return null;
    const ge = t("segment", B.id);
    if (!ge) return null;
    try {
      return await G(B, z, {
        recordHistory: me,
        historyLabel: N,
        optimisticValues: W ? j : null,
        restoreSelectionOnFailure: te
      });
    } finally {
      ge();
    }
  }
  async function G(B, z, {
    recordHistory: me = !0,
    historyLabel: N = null,
    optimisticValues: W = null,
    pendingChangeId: j = null,
    restoreSelectionOnFailure: te = !0,
    onReload: ge = v,
    onConflict: Fe = p
  } = {}) {
    var yt;
    const Ie = C.map((Ze) => Ze.id), Ge = w.current, Ue = me && !r ? crypto.randomUUID() : null;
    V(me ? "Saving directly to Cove…" : "Restoring history…");
    const Ee = j ?? (W ? Qt() : null);
    W && !j && o({
      type: "add",
      entry: { id: Ee, op: "patch", targets: [Ht(B)], values: W }
    });
    const Je = (Ze) => {
      Ee && o({ type: "confirm", key: Ee, applied: Ze });
    };
    try {
      if (r && B.nativeSegmentId == null && B.itemId != null) {
        const ot = `draft-update:${le.id}:${B.itemId}:${B.revision}:${z.tagId}:${z.startSec}:${z.endSec ?? "open"}:${z.reviewState ?? B.reviewState}`, ut = await ee(`/videos/${le.id}/drafts/${B.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: ze(ot),
            expectedRevision: B.revision,
            startSec: z.startSec,
            endSec: z.endSec,
            tagId: z.tagId,
            reviewState: z.reviewState
          })
        });
        qe(ot);
        const nt = {
          ...B,
          ...ut.draft,
          id: B.id,
          itemId: B.itemId
        };
        return me && await Z(
          "segment.update",
          N || "Changed segment",
          dr(B, r),
          dr(
            nt,
            r
          )
        ), ya(B, z, r) ? Je(await ge() != null) : (b((pt) => ({
          ...pt,
          approvedSetVersion: ut.approvedSetVersion || pt.approvedSetVersion,
          segments: (pt.segments || []).map((et) => et.id === B.id ? nt : et).sort((et, It) => et.startSec - It.startSec || et.id - It.id)
        }), le.id), Je(!0)), V(((yt = ut.draft) == null ? void 0 : yt.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), nt;
      }
      const Ze = await ee(`/videos/${le.id}/segments/${B.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...z,
          expectedUpdatedAt: B.updatedAt,
          historyReceiptId: Ue
        })
      }), gt = {
        ...B,
        ...Ze,
        reviewState: z.reviewState ?? B.reviewState
      };
      return ya(B, z, r) ? Je(await ge() != null) : (b((ot) => ({
        ...ot,
        segments: (ot.segments || []).map((ut) => ut.id === B.id ? gt : ut).sort((ut, nt) => ut.startSec - nt.startSec || ut.id - nt.id)
      }), le.id), Je(!0)), me && await Z(
        "segment.update",
        N || "Changed segment",
        dr(B, r),
        dr(
          gt,
          r
        ),
        Ue
      ), V(me ? "Saved to Cove" : "History restored"), gt;
    } catch (Ze) {
      return Ee && o({ type: "discard", key: Ee }), Ee && te && (ue(Ie), ie(Ge), D.current = Ge, Q.current = []), Ze.status === 409 ? (V("Conflict — loading the latest segment…"), await Fe()) : V(Ze.message || "Unable to save the segment."), null;
    }
  }
  async function se() {
    if (!r) return !1;
    const B = A.filter((N) => !N.published && N.reviewState === "approved").length;
    if (B === 0 || _ != null) return !1;
    const z = `complete-review:${le.id}:${d.approvedSetVersion}`, me = t("publish", -1);
    if (!me) return !1;
    Te(""), V(`Publishing ${B} Approved draft${B === 1 ? "" : "s"}…`);
    try {
      const N = await ee(`/videos/${le.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ze(z),
          expectedApprovedSetVersion: d.approvedSetVersion
        })
      });
      qe(z), fe(Jt), oe(!1);
      const W = await v(), j = hl(
        A,
        w.current,
        N.published
      ), te = j ? Qe(W == null ? void 0 : W.segments, j) : null;
      return te && ie(te.id), V(`${N.published.length} Approved draft${N.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (N) {
      const W = N.status === 409 ? "The approved drafts changed. Review the updated list and try again." : N.message || "Unable to publish the approved drafts.";
      return N.status === 409 && await p(), Te(W), V(W), !1;
    } finally {
      me();
    }
  }
  async function $(B = null, z = null) {
    if (_ != null || h()) return;
    const me = B != null ? q.current : null, N = Number.isFinite(me) ? me : l, W = Math.min(re, N + 20);
    if (W <= N) {
      V("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const j = pl(A, y, B);
    if (j.kind === "choose-tag") {
      q.current = N, V(""), T(!0);
      return;
    }
    if (j.kind === "invalid-selection") {
      V("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: te } = j, ge = `create-draft:${le.id}:${te}:${N}`, Fe = r ? null : crypto.randomUUID(), Ie = w.current, Ge = {
      ...y || {},
      id: I.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: te,
      tagName: z || (y == null ? void 0 : y.tagName) || "Tag segment",
      tagSortName: te === (y == null ? void 0 : y.tagId) && (y == null ? void 0 : y.tagSortName) || null,
      startSec: N,
      endSec: W,
      // Full mode creates manual drafts already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, Ue = Id(d, Ge), Ee = jt(
      sn(Ue.segments, Ue.segmentGroups || [], Ue.performerSlots || []),
      Ge.id
    ), Je = i({
      kind: "create",
      lockId: -1,
      run: (Ze) => yt(Ze)
    });
    if (!Je) return;
    await Je.done;
    async function yt({ onReload: Ze, taskId: gt }) {
      var ut;
      const ot = Qt();
      o({ type: "add", entry: { id: ot, taskId: gt, op: "insert", segment: Ge } }), T(!1), j.openTagEditor && (P(Ge.id), L.current = Ge.id, Y(!0)), U(Ge.id), K(Ee);
      try {
        let nt;
        if (r) {
          const It = await ee(`/videos/${le.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: ze(ge), tagId: te, startSec: N, endSec: W })
          });
          qe(ge), nt = { itemId: (ut = It.draft) == null ? void 0 : ut.itemId };
        } else
          nt = { nativeSegmentId: (await ee(`/videos/${le.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: te,
              startSec: N,
              endSec: W,
              historyReceiptId: Fe
            })
          })).id };
        q.current = null, T(!1);
        const pt = await Ze();
        if (o({ type: "discard", key: ot }), !pt) {
          U(Ie), V(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${j.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const et = Qe(pt == null ? void 0 : pt.segments, nt);
        et ? (o({ type: "retarget", temporaryId: Ge.id, identity: Ht(et) }), s(Ge.id, Ht(et)), j.openTagEditor && (he.current && (L.current = et.id), P(et.id)), U(et.id), K(jt(
          sn(pt.segments || [], pt.segmentGroups || [], pt.performerSlots || []),
          et.id
        )), r || await Z(
          "segment.create",
          "Created segment",
          Rt([], !1),
          Rt([et], !1),
          Fe
        )) : (Y(!1), V(`Segment created, but it could not be selected${j.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (nt) {
        throw o({ type: "discard", key: ot }), U(Ie), B != null && T(!0), V(nt.message || "Unable to create the draft."), nt;
      } finally {
        P(null);
      }
    }
  }
  function h() {
    return Si(a, y) ? (V("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function S() {
    if (C.length !== 1 || !y || _ != null || h()) return;
    const B = l;
    if (B <= y.startSec || y.endSec != null && B >= y.endSec) {
      V("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const z = `split-draft:${y.itemId}:${y.revision}:${B}`, me = r ? null : Rt([y], !1), N = r ? null : crypto.randomUUID(), W = t("split", y.id);
    if (W)
      try {
        let j = null;
        r && y.nativeSegmentId == null ? (await ee(`/videos/${le.id}/drafts/${y.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: ze(z),
            expectedRevision: y.revision,
            splitSec: B
          })
        }), qe(z)) : j = { nativeSegmentId: (await ee(`/videos/${le.id}/segments/${y.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: y.updatedAt,
            splitSec: B,
            historyReceiptId: N
          })
        })).id };
        const te = await v();
        if (!r) {
          const ge = [
            Qe(te == null ? void 0 : te.segments, {
              nativeSegmentId: y.nativeSegmentId ?? y.id
            }),
            Qe(
              te == null ? void 0 : te.segments,
              j
            )
          ].filter(Boolean);
          await Z(
            "segment.split",
            "Split segment",
            me,
            Rt(ge, !1),
            N
          );
        }
        V(r ? `Segment split; both ranges remain ${y.reviewState}.` : "Segment split.");
      } catch (j) {
        j.status === 409 ? await p() : V(j.message || "Unable to split the draft.");
      } finally {
        W();
      }
  }
  async function k(B = !1) {
    var j, te;
    if (C.length !== 1 || !y || _ != null || h()) return;
    const z = B ? l : y.startSec, me = gl(le.id, y, B, z), N = r ? null : crypto.randomUUID(), W = t("duplicate", y.id);
    if (W)
      try {
        const ge = ((j = x.current) == null ? void 0 : j.operationKey) === me ? x.current : null;
        let Fe = (ge == null ? void 0 : ge.duplicateIdentity) ?? null;
        if (Fe == null && r && y.nativeSegmentId == null) {
          const Ue = await ee(`/videos/${le.id}/drafts/${y.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: ze(me),
              expectedRevision: y.revision,
              startSec: B ? z : null
            })
          });
          Fe = Qo(!1, Ue), x.current = { operationKey: me, duplicateIdentity: Fe };
        } else if (Fe == null) {
          const Ue = await ee(`/videos/${le.id}/segments/${y.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: y.updatedAt,
              startSec: B ? z : null,
              historyReceiptId: N
            })
          });
          Fe = Qo(!0, Ue), x.current = { operationKey: me, duplicateIdentity: Fe };
        }
        const Ie = await v(), Ge = Qe(Ie == null ? void 0 : Ie.segments, Fe);
        if (Ge) {
          r || await Z(
            "segment.duplicate",
            "Duplicated segment",
            Rt([], !1),
            Rt([Ge], !1),
            N
          );
          const Ue = Va(
            Ge,
            Ie.performerSlots || [],
            c,
            u,
            Ie.segmentGroups || []
          );
          M(Ue.filters), H(Ue.hideDerivedSegments), ue([Ge.id]), ie(Ge.id), D.current = Ge.id, Q.current = [], K(jt(
            sn(Ie.segments || [], Ie.segmentGroups || [], Ie.performerSlots || []),
            Ge.id
          )), r && y.nativeSegmentId == null && qe(me), x.current = null, V(B ? "Duplicate created at the playhead." : "Duplicate created in place.");
        } else
          V("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
      } catch (ge) {
        ((te = x.current) == null ? void 0 : te.operationKey) === me ? V("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : ge.status === 409 ? await p() : V(ge.message || "Unable to duplicate the draft.");
      } finally {
        W();
      }
  }
  async function O() {
    if (C.length !== 1 || !y) return;
    const B = Number(ke), z = g.trim() === "" ? null : Number(g), me = qo(B, z, m);
    if (me.error) {
      V(me.error);
      return;
    }
    if (B === y.startSec && z === y.endSec) {
      V("Timing is unchanged.");
      return;
    }
    await J(y, { startSec: B, endSec: z, tagId: y.tagId }, !0, null, !0);
  }
  async function ae(B, z) {
    if (C.length !== 1 || !y) return;
    const me = qo(B, z, m);
    if (me.error) {
      V(me.error);
      return;
    }
    if (B === y.startSec && z === y.endSec) {
      V("Timing is unchanged.");
      return;
    }
    await J(y, { startSec: B, endSec: z, tagId: y.tagId }, !0, null, !0);
  }
  return { acceptHistory: fe, recordHistoryAction: Z, mutateSegment: J, runSegmentMutation: G, completeReview: se, createSegment: $, splitSegment: S, duplicateSegment: k, saveTiming: O, applyShortcutTiming: ae };
}
function Bd() {
  const [e, t] = F(() => typeof window < "u" && window.matchMedia(Uo).matches);
  return be(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Uo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Gd() {
  const [e, t] = F(() => typeof window < "u" && window.matchMedia(Ko).matches);
  return be(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Ko), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Ud() {
  try {
    return Ls(window.localStorage.getItem(Fa));
  } catch {
    return { ...wt };
  }
}
function Kd() {
  try {
    return tn(JSON.parse(window.localStorage.getItem(ja) || "[]"));
  } catch {
    return [];
  }
}
function zd(e) {
  try {
    window.localStorage.setItem(ja, JSON.stringify(tn(e)));
  } catch {
  }
}
function qd(e) {
  try {
    window.localStorage.setItem(Fa, JSON.stringify(e));
  } catch {
  }
}
function Hd() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Ga) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function _d(e) {
  try {
    return window.localStorage.setItem(Ga, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Wd({ status: e }) {
  const t = mi[e];
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
  }, xt.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...ci(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${Bt[t].symbol}${e[t]}`)));
}
function Vd({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: g, shortcutRef: u }) {
  const f = lo(a), [m, p] = F(() => _r(o, f)), [b, v] = F(!1), [I, x] = F(""), q = ye(!1), L = o.map((C) => `${C.slotDefinitionId}:${C.performerId || ""}`).join("|"), U = f.map((C) => lt(C)).join("|"), _ = ri(
    o,
    f
  );
  be(() => {
    p(_r(o, f)), x("");
  }, [t, r, L, U]);
  async function A(C = m) {
    if (!q.current) {
      q.current = !0, v(!0), x("Saving performer slots…");
      try {
        const D = _r(o.map((M) => ({
          ...M,
          performerId: C[M.slotDefinitionId] || null
        })), f), Q = o.map((M) => {
          const T = D[M.slotDefinitionId] ? Number(D[M.slotDefinitionId]) : null, H = f.find((ne) => String(lt(ne)) === String(T));
          return {
            ...M,
            performerId: T,
            performerName: (H == null ? void 0 : H.name) || null
          };
        });
        if (s(Q) === !1) {
          x("");
          return;
        }
        const P = await ee(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((M) => ({ slotDefinitionId: M.slotDefinitionId, performerId: D[M.slotDefinitionId] ? Number(D[M.slotDefinitionId]) : null }))
          })
        });
        x("Performer slots saved."), await l(P, {
          beforeState: xr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: xr([{
            segmentId: t,
            itemId: r,
            revision: P.revision,
            slots: P.slots || []
          }])
        });
      } catch (D) {
        d && await d(o, D), D.status === 409 ? (x("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : x(D.message || "Unable to save performer slots.");
      } finally {
        q.current = !1, v(!1);
      }
    }
  }
  function y(C, D) {
    x(`Option ${D + 1} applied; save to confirm.`), p({ ...m, ...C.assignments });
  }
  async function w(C) {
    const D = { ...m, ...C.assignments };
    p(D), await A(D);
  }
  return be(() => {
    if (u)
      return u.current = (C) => q.current || !_[C] ? !1 : (w(_[C]), !0), () => {
        u.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    _.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, _.map((C, D) => n("button", {
        key: D,
        type: "button",
        disabled: b,
        onClick: () => y(C, D),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${D + 1}: ${C.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, D + 1),
        n("span", { key: "description" }, C.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${_.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((C) => n("label", { key: C.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, St(C)),
      (C.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(C.genderHints || []).map(wr).join(" · ")}`) : null,
      n("select", { key: "select", value: m[C.slotDefinitionId] || "", disabled: b, onChange: (D) => p({ ...m, [C.slotDefinitionId]: D.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...oi(f, f, C.genderHints).map((D) => n("option", { key: lt(D), value: lt(D) }, D.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: g, type: "button", disabled: b, onClick: () => A(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, I)])
  ]);
}
function Jd({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a, acquireSaveLock: s = () => () => {
} }) {
  var A;
  const l = ((A = t[0]) == null ? void 0 : A.slots) || [], d = lo(r), c = ri(
    l,
    d
  ), g = "__mixed__", u = () => Object.fromEntries(l.map((y, w) => {
    const C = t.map((D) => {
      var Q;
      return String(((Q = D.slots[w]) == null ? void 0 : Q.performerId) || "");
    });
    return [y.slotDefinitionId, C.every((D) => D === C[0]) ? C[0] : g];
  })), [f, m] = F(u), [p, b] = F(!1), [v, I] = F(""), x = ye(!1), q = t.map((y) => `${y.itemId ?? `native:${y.segmentId}`}:${y.revision}:${y.slots.map((w) => `${w.slotDefinitionId}:${w.performerId || ""}`).join(",")}`).join("|");
  be(() => {
    m(u());
  }, [q]);
  async function L(y = f) {
    if (x.current) return;
    const w = s();
    if (!w) {
      I("Wait for the current save to finish before saving performer slots.");
      return;
    }
    x.current = !0, b(!0), I(`Saving performer slots for ${t.length} segments…`);
    const C = [];
    try {
      for (const D of t) {
        const Q = D.slots.map((M, T) => {
          const H = y[l[T].slotDefinitionId];
          return {
            slotDefinitionId: M.slotDefinitionId,
            performerId: H === g ? M.performerId || null : H ? Number(H) : null
          };
        }), P = await ee(D.itemId != null ? `/videos/${e}/drafts/${D.itemId}/slots` : `/videos/${e}/segments/${D.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: D.revision, assignments: Q })
        });
        C.push({
          segmentId: D.segmentId,
          itemId: D.itemId,
          revision: P.revision,
          slots: P.slots || []
        });
      }
      I("Performer slots saved."), await o({
        beforeState: xr(t),
        afterState: xr(C)
      });
    } catch (D) {
      const Q = await i();
      D.status === 409 ? I(Q ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : I(D.message || (Q ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      x.current = !1, b(!1), w();
    }
  }
  function U(y, w) {
    I(`Option ${w + 1} applied; save to confirm.`), m({ ...f, ...y.assignments });
  }
  async function _(y) {
    const w = { ...f, ...y.assignments };
    m(w), await L(w);
  }
  return be(() => {
    if (a)
      return a.current = (y) => x.current || !c[y] ? !1 : (_(c[y]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, c.map((y, w) => n("button", {
        key: w,
        type: "button",
        disabled: p,
        onClick: () => U(y, w),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${w + 1} to all selected segments: ${y.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, w + 1),
        n("span", { key: "description" }, y.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${c.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, l.map((y) => n("label", {
      key: y.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, St(y)),
      n("select", {
        key: "select",
        value: f[y.slotDefinitionId] || "",
        disabled: p,
        onChange: (w) => m({ ...f, [y.slotDefinitionId]: w.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        f[y.slotDefinitionId] === g ? n("option", { key: "mixed", value: g }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...oi(d, d, y.genderHints).map((w) => n("option", {
          key: lt(w),
          value: lt(w)
        }, w.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: p,
        onClick: () => L(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, v)
    ])
  ]);
}
function Gt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function Yd(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return Gt(t);
  const o = [...new Set(r.map((i) => Gt(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function Ir() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function mr({ name: e }) {
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
    n(Ir, { key: "derived" })
  ]);
}
function Zd({ segment: e, provenance: t }) {
  var g;
  const [r, o] = F(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = Yd(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
  saveMessage: g
}) {
  const [u, f] = F([]), m = e.flatMap((I) => I.lanes.map((x) => x.key)), p = m.join("|");
  be(() => {
    const I = new Set(m);
    f((x) => x.filter((q) => I.has(q)));
  }, [p]);
  const b = Sr(t), v = !!yi(
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
      a ? n(en, { key: "counts", counts: b }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      rd({ mergeable: v, reviewable: a, tagEditable: s, slotsEditable: l })
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
        const q = u.includes(x.key), L = x.markers.some(({ segment: _ }) => _.id === r), U = `selected-segment-lane-${x.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: x.key,
          "data-selected-segment-lane": x.key,
          className: `rounded-md border ${L ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": q,
            "aria-controls": U,
            "aria-current": L ? "true" : void 0,
            onClick: () => f((_) => q ? _.filter((A) => A !== x.key) : [..._, x.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, q ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Vn(x)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(x.selectedCount)),
            a ? n(en, { key: "states", counts: x.counts }) : null
          ]),
          q ? n("div", {
            key: "segments",
            id: U,
            className: "space-y-1 border-t border-border p-1.5"
          }, x.markers.map(({ segment: _ }) => {
            const A = _.endSec == null ? Re(_.startSec) : `${Re(_.startSec)} – ${Re(_.endSec)}`;
            return n("button", {
              key: _.id,
              type: "button",
              onClick: () => i(_),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${_.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${_.tagName || "Segment"}, ${_.reviewState}, ${A}` : `${_.tagName || "Segment"}, ${A}`,
              "aria-current": _.id === r ? "true" : void 0
            }, [
              a ? n(dn, {
                key: "state",
                state: _.reviewState,
                includeLabel: !1
              }) : null,
              _.isDerived ? n(Ir, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, A),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                Gt(_.sourceKey)
              )
            ]);
          })) : null
        ]);
      })
    ]))
  ]);
}
const Kn = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"]
}, ba = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], ha = [
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
function Ci(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function va(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function gr(e, t, r, o = null) {
  const i = va(t), a = va(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function ec(e, t, r = null) {
  var u, f, m;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (u = t.hasSegmentsCriterion) == null ? void 0 : u.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), gr(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), gr(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), gr(o, t.performersCriterion, "performer"), gr(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = xa(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = xa(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((f = t.reviewStateCriterion) == null ? void 0 : f.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const g = (m = t.shotBoundariesCriterion) == null ? void 0 : m.value;
  return r && typeof g == "boolean" ? o.set("hasShotBoundaries", String(g)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function xa(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function tc(e, t, r, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((g) => a.add(g));
  } else a.has(r) ? a.delete(r) : a.add(r);
  return a;
}
function $i({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(sa, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, xt.flatMap((r) => {
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
    n(sa, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function Ti({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
      n(Ti, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, vs(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n($i, { item: e, showReviewStates: r }))
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
    n(Ti, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
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
        n($i, { key: "segments", item: e, showReviewStates: r })
      ]),
      n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function bo({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = kl(o);
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
        Yt.recyclingBinView
      ) ? n(Ai, { key: "bin", onNavigate: t }) : null,
      n(Ri, { key: "settings", onNavigate: t })
    ])
  ]);
}
const no = "segment-studio:recycling-bin-changed";
function oc(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function Hn() {
  window.dispatchEvent(new CustomEvent(no));
}
function Ai({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = F(null);
  be(() => {
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
    return l(), window.addEventListener(no, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(no, d), window.removeEventListener("focus", d);
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
function Ri({ onNavigate: e, compact: t = !1 }) {
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
  const o = ye(null), [i, a] = F("maximum"), s = (f, m) => {
    const p = Hs(e, t, f, m);
    a(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (f, m) => {
    var b;
    const p = (b = o.current) == null ? void 0 : b.getBoundingClientRect();
    p && s(f, qs(m.clientX, p.left, p.width));
  }, d = (f, m) => {
    var p, b;
    m.preventDefault(), (b = (p = m.currentTarget).setPointerCapture) == null || b.call(p, m.pointerId), l(f, m);
  }, c = (f, m) => {
    var p, b;
    (b = (p = m.currentTarget).hasPointerCapture) != null && b.call(p, m.pointerId) && l(f, m);
  }, g = (f, m) => {
    const p = f === "minimum" ? e : t, b = f === "minimum" ? 0 : e, v = f === "minimum" ? t : 1, I = m.shiftKey ? 0.1 : 0.01;
    let x = null;
    ["ArrowLeft", "ArrowDown"].includes(m.key) && (x = p - I), ["ArrowRight", "ArrowUp"].includes(m.key) && (x = p + I), m.key === "PageDown" && (x = p - 0.1), m.key === "PageUp" && (x = p + 0.1), m.key === "Home" && (x = b), m.key === "End" && (x = v), x != null && (m.preventDefault(), s(f, Math.min(v, Math.max(b, x))));
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
function sc({ saving: e, error: t, onSelect: r, onClose: o }) {
  const i = ye(null);
  be(() => {
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
  onClose: g
}) {
  const u = Mt(e), f = [...new Map((a || []).map((v) => [
    Number(v.tagId),
    v.tagName || `Tag ${v.tagId}`
  ])).entries()].sort((v, I) => v[1].localeCompare(I[1]) || v[0] - I[0]), m = (v) => d(Mt({ ...u, ...v })), p = (v) => m({
    reviewStates: u.reviewStates.includes(v) ? u.reviewStates.filter((I) => I !== v) : [...u.reviewStates, v]
  }), b = (v) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${v ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (v) => {
      v.target === v.currentTarget && g();
    },
    onKeyDownCapture: (v) => Nt(v, { onCancel: g })
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
        n("div", { className: "flex flex-wrap gap-2" }, xt.map((v) => {
          const I = u.reviewStates.includes(v), x = Bt[v];
          return n("button", {
            key: v,
            type: "button",
            onClick: () => p(v),
            "aria-pressed": I,
            className: b(I)
          }, `${x.symbol} ${v} (${i[v] || 0})`);
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
            className: b(u.performerId == null)
          }, "All performers"),
          ...r.map((v) => {
            const I = Number(lt(v));
            return n("button", {
              key: I,
              type: "button",
              onClick: () => m({ performerId: I }),
              "aria-pressed": u.performerId === I,
              className: b(u.performerId === I)
            }, v.name);
          })
        ])
      ]) : null,
      n("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        n("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Tag"),
          n("select", {
            key: "select",
            value: u.tagId ?? "",
            onChange: (v) => m({
              tagId: v.target.value === "" ? null : Number(v.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...f.map(([v, I]) => n("option", { key: v, value: v }, I))
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
            onChange: (v) => m({
              segmentGroupId: v.target.value === "" ? null : v.target.value === "ungrouped" ? "ungrouped" : Number(v.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All Segment groups"),
            ...(s || []).map((v) => n("option", { key: v.id, value: v.id }, v.name)),
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
            className: b(u.sourceKey == null)
          }, "All provenance"),
          ...o.map((v) => n("button", {
            key: v,
            type: "button",
            onClick: () => m({ sourceKey: v }),
            "aria-pressed": u.sourceKey === v,
            title: v,
            className: b(u.sourceKey === v)
          }, Gt(v)))
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
          onChange: ({ minimum: v, maximum: I }) => m({
            confidenceMin: v,
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
            onChange: (v) => m({
              includeUnscored: v.target.checked
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
          onChange: (v) => c(v.target.checked),
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
          d(Mt({})), l && c(!1);
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
function dc({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Yn.filter((l) => An(l, e)), i = Jo(o, 1)[0], a = Jo(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((g) => n("div", { key: g.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, g.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[g.id] ? t[g.id].length > 0 ? t[g.id] : ["Unassigned"] : g.bindings.map(Qa)).map((u, f) => n("kbd", { key: `${g.id}:${f}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, u))
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
function cc({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = kd(e), [l, d] = F([]), c = s.map((g) => g.tagName).join("|");
  return be(() => {
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
            onClick: () => d((p) => f ? p.filter((b) => b !== g.tagName) : [...p, g.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: kr(!1) }
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
            const b = `${Re(p.startSec)}${p.endSec == null ? "" : ` – ${Re(p.endSec)}`}`, v = r === p.id;
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
                "aria-label": `${v ? "Restoring" : "Restore to review"} ${g.tagName} example at ${b}`,
                className: "rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
              }, v ? "Restoring…" : "Restore to review")
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
  const [o, i] = F(""), [a, s] = F(0), l = ye(null), d = He(() => Pl(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = Ll(d);
  be(() => {
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
        s((b) => d.length ? (b + p + d.length) % d.length : 0);
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
      var U;
      const p = f.segment || f, b = p.endSec == null ? Re(p.startSec) : `${Re(p.startSec)} – ${Re(p.endSec)}`, v = `${Gt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, I = m === c, x = m > 0 ? d[m - 1].groupKey : null, q = g && f.groupKey !== x ? n("div", {
        key: `group:${f.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, f.groupName) : null, L = n("button", {
        key: p.id,
        id: `segment-quick-search-${p.id}`,
        ref: I ? l : null,
        type: "button",
        role: "option",
        "aria-selected": I,
        onMouseEnter: () => s(m),
        onClick: () => t(p),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${I ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        g ? n("span", { key: "group", className: "sr-only" }, `${f.groupName} group`) : null,
        n(dn, { key: "review", state: p.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        (U = f.performers) != null && U.length ? n(Nr, {
          key: "performers",
          performers: f.performers,
          performerAssignments: f.performerAssignments
        }) : null,
        n(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          b
        ),
        n("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: v
        }, v)
      ]);
      return q ? [q, L] : [L];
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
  const s = He(() => mc(e), [e]), [l, d] = F([]), c = s.reduce((m, p) => m + p.drafts.length, 0), g = ye(null);
  mo({ confirmRef: g, cancelRef: o, confirmReady: !t && c > 0 });
  const u = (m) => d((p) => p.includes(m) ? p.filter((b) => b !== m) : [...p, m]), f = (m) => `segment-studio-publish-approved-${m.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
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
            style: { background: kr(!1) }
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
          }, m.drafts.map((b) => {
            const v = b.endSec == null ? Re(b.startSec) : `${Re(b.startSec)} – ${Re(b.endSec)}`, I = `${Gt(b.sourceKey)}${b.confidence == null ? "" : ` · ${Math.round(b.confidence * 100)}%`}`;
            return n("div", { key: b.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(dn, { key: "review", state: b.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, v),
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
        ref: g,
        type: "button",
        disabled: t || c === 0,
        onClick: i,
        className: "rounded-md border border-emerald-500/60 bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-emerald-500/30 disabled:opacity-50"
      }, t ? "Publishing…" : `Publish ${c} approved draft${c === 1 ? "" : "s"}`)
    ])
  ]));
}
function pc({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = Dl(e), [s, l] = F(() => /* @__PURE__ */ new Set()), [d, c] = F(() => new Set(a.map((b) => b.key))), g = a.flatMap((b) => d.has(b.key) ? b.candidates : []), u = (b) => l((v) => {
    const I = new Set(v);
    return I.has(b) ? I.delete(b) : I.add(b), I;
  }), f = (b) => c((v) => {
    const I = new Set(v);
    return I.has(b) ? I.delete(b) : I.add(b), I;
  }), m = (b) => b.assignment.map(({ slot: v, performer: I }) => `${v.label || `Slot ${v.sortOrder + 1}`}: ${I.name}`).join(", "), p = (b) => `segment-studio-auto-assign-${b.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && !t && i();
    },
    onKeyDownCapture: (b) => {
      b.key === "Enter" && b.target instanceof HTMLInputElement || Nt(b, {
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
      e.length ? n("div", { className: "space-y-3" }, a.map((b) => n("section", { key: b.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
        n("header", {
          key: "header",
          className: "flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2",
          style: { background: kr(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(b.key),
            disabled: t,
            onChange: () => f(b.key),
            "aria-label": `Include ${b.tagName} assignment: ${m(b)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(b.key),
            "aria-controls": p(b),
            "aria-label": `${s.has(b.key) ? "Collapse" : "Expand"} ${b.tagName} assignment: ${m(b)}`,
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
            b.assignment.map(({ slot: v, performer: I }) => {
              const x = v.label || `Slot ${v.sortOrder + 1}`;
              return n("span", {
                key: v.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${x}: ${I.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${x}: ${I.name}`
                }, `${x}: ${I.name}`),
                n(Jn, {
                  key: "avatar",
                  performer: { id: I.performerId, name: I.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(en, { key: "states", counts: b.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(b.candidates),
            "aria-label": `Auto-Assign ${b.tagName}: ${m(b)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${b.candidates.length})`)
        ]),
        s.has(b.key) ? n(
          "div",
          { key: "segments", id: p(b), className: "divide-y divide-border/70" },
          b.candidates.map((v) => {
            const I = v.endSec == null ? Re(v.startSec) : `${Re(v.startSec)} – ${Re(v.endSec)}`, x = `${Gt(v.sourceKey)}${v.confidence == null ? "" : ` · ${Math.round(v.confidence * 100)}%`}`;
            return n("div", {
              key: v.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(dn, { key: "review", state: v.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                v.tagName || "Tag segment"
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
        disabled: t || g.length === 0,
        onClick: () => o(g),
        className: "rounded-md border border-violet-400/60 bg-violet-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-violet-500/30 disabled:opacity-50"
      }, t ? "Assigning…" : `Auto-Assign ${g.length} Segment${g.length === 1 ? "" : "s"}`)
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
    onKeyDownCapture: (d) => Nt(d, { onCancel: r, onConfirm: t })
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
function yc({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = F(!1), d = ye(null);
  if (mo({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Re(e.endSec);
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
  const l = e ? e.createCount + e.linkCount : 0, d = ye(null);
  mo({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((u = e == null ? void 0 : e.outputs) == null ? void 0 : u.slice(0, 200)) || [], g = bc(c);
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
                `${m.rootTagName} @ ${Re(m.rootStartSec)}`
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
              m.outputs.map((p, b) => n("div", {
                key: `${p.ruleId}:${p.depth}:${b}`,
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
  performerSlotsAvailable: g,
  selectedPerformerSlots: u,
  performerSlots: f,
  detail: m,
  video: p,
  slotButtonRef: b,
  tagSearchRef: v,
  onDetailChange: I,
  setSaveMessage: x,
  acquireSaveLock: q,
  onSlotsChanged: L,
  onRecordHistory: U,
  onCancelQueuedReview: _,
  splitSegment: A,
  duplicateSegment: y,
  provenance: w,
  lineage: C,
  onNavigateLineageItem: D,
  tagEditing: Q,
  onCancelTagEditing: P,
  detailPanelRef: M,
  onReduceSelection: T
}) {
  var he, re, le, fe;
  const H = ye(null), ne = ye(null), oe = () => {
    var Z;
    (Z = ne.current) == null || Z.call(ne), ne.current = null;
  }, Te = ye(null), V = ye(null), K = ye(null), ie = ye(null), [ue, Y] = F(!1);
  be(() => {
    H.current && (H.current.scrollTop = 0), Y(!1);
  }, [t == null ? void 0 : t.id]), be(() => {
    var Z, J;
    ue && ((J = (Z = Te.current) == null ? void 0 : Z.querySelector("input, select, button")) == null || J.focus({ preventScroll: !0 }));
  }, [ue]);
  function ke() {
    Y(!1), requestAnimationFrame(() => {
      var Z;
      return (Z = b.current) == null ? void 0 : Z.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const Z = !r.some((se) => se.isDerived), J = e && g ? nd(f, r) : null, G = (J == null ? void 0 : J.map((se, $) => {
      var S;
      const h = r[$];
      return {
        segmentId: h.nativeSegmentId,
        itemId: h.published ? null : h.itemId,
        revision: (S = m.performerSlotRevisions) == null ? void 0 : S[h.id],
        slots: se
      };
    })) || [];
    return n(ro.Fragment, null, [
      n(Xd, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: M,
        onReduceSelection: T,
        reviewable: e,
        tagEditable: Z,
        slotsEditable: G.length > 0 && a == null,
        onEditSlots: () => Y(!0),
        slotButtonRef: b,
        saveMessage: i
      }),
      Q && Z ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (se) => {
          se.target === se.currentTarget && P();
        },
        onKeyDownCapture: (se) => Nt(se, { onCancel: P })
      }, n("section", {
        ref: v,
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
          onChange: (se, $) => se == null ? P() : l(se, $ == null ? void 0 : $.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: P,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      ue && G.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (se) => {
          se.target === se.currentTarget && ke();
        },
        onKeyDownCapture: (se) => {
          var h, S;
          if (!(typeof ((h = se.target) == null ? void 0 : h.closest) == "function" ? se.target.closest("input, textarea, select, [contenteditable='true']") : null) && !se.repeat && !se.ctrlKey && !se.altKey && !se.metaKey && !se.shiftKey && /^[1-9]$/.test(se.key) && ((S = ie.current) != null && S.call(ie, Number(se.key) - 1))) {
            se.preventDefault(), se.stopPropagation();
            return;
          }
          Nt(se, { onCancel: ke });
        }
      }, n("section", {
        ref: Te,
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
          n("button", { key: "close", type: "button", onClick: ke, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Jd, {
          videoId: p.id,
          targets: G,
          performerCandidates: m.performerCandidates || [],
          shortcutRef: ie,
          acquireSaveLock: () => q("slots", -1),
          onSaved: async ({ beforeState: se, afterState: $ }) => {
            await U(
              "performer-slots.assign",
              `Assigned performers to ${G.length} segments`,
              se,
              $
            ), ke(), await L();
          },
          onConflict: L
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (Z) => {
      H.current = Z, M && (M.current = Z);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(dn, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(Ir, { key: "derived" }) : null,
        t && Q ? n("div", {
          key: "tag-editor",
          ref: v,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (Z) => {
            Z.key === "Escape" && (Z.preventDefault(), Z.stopPropagation(), P());
          },
          onKeyDown: (Z) => {
            Xl(Z, t.tagName) && (Z.preventDefault(), Z.stopPropagation(), l(t.tagId));
          }
        }, n(_n, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (Z, J) => Z == null ? P() : l(Z, J == null ? void 0 : J.label),
          disabled: fl(a, t.id, s) || ((he = C.data) == null ? void 0 : he.tagReadOnly) === !0,
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
      t && g && u.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(bi, {
        assignments: u.map((Z) => {
          const J = id(Z);
          return {
            key: String(Z.slotDefinitionId),
            label: J.label,
            performer: J.filled ? { id: Number(Z.performerId), name: J.performer } : null,
            title: J.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(Zd, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: w
    }) : null,
    t ? n("div", { key: "controls", hidden: !0 }, [
      n("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        n("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        C.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : C.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, C.error) : C.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${C.data.derived ? "Derived segment" : "Root segment"} · ${C.data.componentSize} segment${C.data.componentSize === 1 ? "" : "s"} · ${C.data.integrityState}`
          ),
          (re = C.data.parents) != null && re.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...C.data.parents.map((Z) => n("button", {
              key: Z.nodeId,
              type: "button",
              onClick: () => D(Z.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${Z.ruleKey} ${Z.ruleVersion}`))
          ]) : null,
          (le = C.data.children) != null && le.length ? n("p", { key: "children" }, `Children: ${C.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: b,
          type: "button",
          disabled: a != null || !g || u.length === 0,
          onClick: () => Y(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: g ? u.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, u.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: A,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        n("button", {
          key: "duplicate",
          type: "button",
          disabled: a != null,
          onClick: () => y(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        n("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: a != null,
          onClick: () => y(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    ue && e && t && g && u.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (Z) => {
        Z.target === Z.currentTarget && ke();
      },
      onKeyDownCapture: (Z) => {
        var G, se;
        if (!(typeof ((G = Z.target) == null ? void 0 : G.closest) == "function" ? Z.target.closest("input, textarea, select, [contenteditable='true']") : null) && !Z.repeat && !Z.ctrlKey && !Z.altKey && !Z.metaKey && !Z.shiftKey && /^[1-9]$/.test(Z.key) && ((se = K.current) != null && se.call(K, Number(Z.key) - 1))) {
          Z.preventDefault(), Z.stopPropagation();
          return;
        }
        Nt(Z, {
          onCancel: ke,
          onConfirm: () => {
            var $;
            return ($ = V.current) == null ? void 0 : $.click();
          }
        });
      }
    }, n("section", {
      ref: Te,
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
        n("button", { key: "close", type: "button", onClick: ke, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Vd, {
        key: `${t.id}:${m.performerSlotsRevision || m.slotRevision || ""}`,
        videoId: p.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: u,
        revision: (fe = m.performerSlotRevisions) == null ? void 0 : fe[t.id],
        performerCandidates: m.performerCandidates || [],
        confirmRef: V,
        shortcutRef: K,
        onOptimisticSave: (Z) => {
          const J = q("slots", t.id);
          if (!J)
            return x("Wait for the current save to finish before saving performer slots."), !1;
          ne.current = J, I((G) => Wr(
            G,
            t.id,
            Z
          ), p.id), x("Saving performer slots…"), ke();
        },
        onSaved: async (Z, { beforeState: J, afterState: G }) => {
          I((se) => Wr(
            se,
            t.id,
            Z.slots || [],
            Z.revision
          ), p.id), x("Performer slots saved.");
          try {
            await U(
              "performer-slots.assign",
              "Assigned performers",
              J,
              G
            ), await L(Z) || _([t]);
          } finally {
            oe();
          }
        },
        onRollback: async (Z, J) => {
          _([t]), I((G) => {
            var se;
            return Wr(
              G,
              t.id,
              Z,
              (se = m.performerSlotRevisions) == null ? void 0 : se[t.id]
            );
          }, p.id), x(J.message || "Unable to save performer slots.");
          try {
            J.status === 409 && await L();
          } finally {
            oe();
          }
        },
        onConflict: L
      }))
    ])) : null
  ]);
}
function xc({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: u, onSelectGroup: f, onToggleGroup: m, onSelect: p, onSelectSegments: b, onSelectAll: v, onConfigureTag: I, onSeekTime: x, centerRef: q, showReviewState: L = !0, swimlaneTitleWidth: U, onSwimlaneTitleWidthChange: _ }) {
  const A = ye(null), y = ye(null), [w, C] = F(0), [D, Q] = F({ scrollTop: 0, height: 320 }), [P, M] = F(null), T = He(
    () => sn(e, r, o),
    [e, r, o]
  ), H = He(
    () => pi(o),
    [o]
  ), ne = He(() => fo(T), [T]), oe = He(
    () => ud(ne, i, r.length > 0),
    [ne, i, r.length]
  ), Te = He(
    () => fi(oe.rows, Math.max(0, D.scrollTop - 24), D.height),
    [oe, D]
  ), V = Math.max(0, Number(d) || 0), K = Os(w), ie = pr(U, K), ue = ie / 16, Y = Ds(c, V, ue), ke = Ts(V), he = As(V, Math.max(1, w - ue * 16), g), re = ke.filter((S, k) => k === 0 || k % he === 0), le = He(() => T.map((S) => `${S.key}:${S.trackCount}:${S.markers.map(({ segment: k, track: O }) => `${k.id}:${k.startSec}:${k.endSec ?? ""}:${O}`).join(",")}`).join("|"), [T]);
  function fe() {
    const S = y.current;
    if (!S) return;
    const k = S.querySelector("[data-timeline-track]"), O = S.firstElementChild, ae = k == null ? void 0 : k.getBoundingClientRect(), B = O == null ? void 0 : O.getBoundingClientRect(), z = ae && B ? Math.max(0, ae.left - B.left) : ue * 16, me = (B == null ? void 0 : B.width) ?? S.scrollWidth;
    S.scrollTo({
      left: Es(c, V, me, S.clientWidth, z, za),
      behavior: "smooth"
    });
  }
  be(() => (q.current = fe, () => {
    q.current === fe && (q.current = null);
  })), be(() => {
    fe();
  }, [g]);
  function Z() {
    const S = y.current, k = oe.rows.find((me) => me.kind === "lane" && me.lane.markers.some(({ segment: N }) => N.id === s));
    if (!S || !k) return;
    const O = 24, ae = k.top + O, B = ae + k.height;
    let z = S.scrollTop;
    ae < S.scrollTop + O ? z = Math.max(0, ae - O) : B > S.scrollTop + S.clientHeight && (z = Math.max(0, B - S.clientHeight)), z !== S.scrollTop && (S.scrollTop = z), Q({ scrollTop: z, height: S.clientHeight });
  }
  be(() => {
    Z();
  }, [s, le, oe]), be(() => {
    const S = y.current, k = oe.rows.find((me) => me.kind === "group" && me.group.key === a);
    if (!S || !k) return;
    const O = 24, ae = k.top + O, B = ae + k.height;
    let z = S.scrollTop;
    ae < S.scrollTop + O ? z = Math.max(0, ae - O) : B > S.scrollTop + S.clientHeight && (z = Math.max(0, B - S.clientHeight)), z !== S.scrollTop && (S.scrollTop = z), Q({ scrollTop: z, height: S.clientHeight });
  }, [a, oe]), be(() => {
    const S = y.current;
    if (!S || typeof ResizeObserver > "u") return;
    const k = () => {
      C(S.clientWidth), Q({ scrollTop: S.scrollTop, height: S.clientHeight }), Z();
    }, O = new ResizeObserver(k);
    return O.observe(S), k(), () => O.disconnect();
  }, [s, le, oe]);
  function J(S) {
    if (!(V > 0)) return;
    const k = S.currentTarget.getBoundingClientRect(), O = Math.min(1, Math.max(0, (S.clientX - k.left) / k.width));
    x(O * V);
  }
  function G(S) {
    const k = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let O = null;
    Object.hasOwn(k, S.key) && (O = c + k[S.key]), S.key === "Home" && (O = 0), S.key === "End" && (O = V), O != null && (S.preventDefault(), S.stopPropagation(), x(Math.min(V, Math.max(0, O))));
  }
  function se(S) {
    var O;
    const k = (O = A.current) == null ? void 0 : O.getBoundingClientRect();
    k && _(pr(S.clientX - k.left, K));
  }
  function $(S) {
    const k = S.shiftKey ? 40 : 16;
    let O = null;
    S.key === "ArrowLeft" && (O = ie - k), S.key === "ArrowRight" && (O = ie + k), S.key === "Home" && (O = 160), S.key === "End" && (O = K), O != null && (S.preventDefault(), S.stopPropagation(), _(pr(O, K)));
  }
  const h = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: A,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (S) => {
          (S.metaKey || S.ctrlKey) && (S.preventDefault(), v == null || v());
        },
        onKeyDown: (S) => {
          S.key !== "Enter" && S.key !== " " || (S.preventDefault(), v == null || v());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: h, disabled: g <= 1, onClick: () => u(hr(g - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: h, disabled: g === 1, onClick: () => u(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(g * 100)}%`),
      n("button", { key: "in", type: "button", className: h, disabled: g >= 8, onClick: () => u(hr(g + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: h, onClick: fe, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(K),
      "aria-valuenow": Math.round(ie),
      "aria-valuetext": `${Math.round(ie)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (S) => {
        S.currentTarget.setPointerCapture(S.pointerId), se(S);
      },
      onPointerMove: (S) => {
        S.currentTarget.hasPointerCapture(S.pointerId) && se(S);
      },
      onKeyDown: $,
      onDoubleClick: () => _(wt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${ie - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: y,
      onScroll: (S) => Q({
        scrollTop: S.currentTarget.scrollTop,
        height: S.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: Ps(g) }, [
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
          "aria-valuemax": V,
          "aria-valuenow": Math.min(V, Math.max(0, c)),
          "aria-valuetext": Re(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: J,
          onKeyDown: G
        }, re.map((S, k) => n("span", {
          key: S,
          className: `absolute top-0 ${Rs(k, re.length, V > 0 ? S / V * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Ms(k, re.length, V > 0 ? S / V * 100 : 0)
        }, Re(S))).concat(t.map((S) => {
          const k = V > 0 ? S.startSec / V * 100 : 0;
          return n("button", {
            key: `shot-boundary:${S.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Re(S.startSec)} – ${Re(S.endSec)}`,
            title: `Shot boundary · ${S.source || "manual"} · ${Re(S.startSec)} – ${Re(S.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${k}%`, width: "2px" },
            onClick: (O) => {
              O.stopPropagation(), x(S.startSec);
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
            ...Ho(Y),
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
        style: T.length > 0 ? { height: oe.height } : void 0
      }, [
        T.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...Ho(Y, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        T.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : Te.map((S) => {
          var W;
          const k = S.group, O = i.includes(k.key), ae = a === k.key, B = kr(ae);
          if (S.kind === "group") return n("div", {
            key: S.key,
            "data-segment-group": k.key,
            "data-segment-group-collapsed": O ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ue}rem minmax(0,1fr)`,
              backgroundColor: B,
              top: S.top,
              height: S.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (j) => {
                if (j.metaKey || j.ctrlKey) {
                  b(k.lanes.flatMap((te) => te.markers.map((ge) => ge.segment.id)));
                  return;
                }
                f(k.key), m(k.key);
              },
              "aria-expanded": !O,
              "aria-current": ae ? "true" : void 0,
              "data-selected-timeline-group": ae ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: k.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: B
              },
              title: `${O ? "Expand" : "Collapse"} ${k.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, O ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, k.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              O ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${k.lanes.length} swimlane${k.lanes.length === 1 ? "" : "s"} hidden`
                ),
                L ? n(en, { key: "states", counts: k.counts }) : null
              ] : null
            )
          ]);
          const z = S.lane, me = Vl(S.laneIndex), N = z.markers.some(({ segment: j }) => j.id === s);
          return n("div", {
            key: S.key,
            "data-grouped-swimlane": k.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ue}rem minmax(0,1fr)`,
              top: S.top,
              height: S.height,
              backgroundColor: me
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": N ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: Jl(N, me),
              title: `${Vn(z)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Vn(z),
              onClick: (j) => {
                (j.metaKey || j.ctrlKey) && b(z.markers.map((te) => te.segment.id));
              },
              onMouseEnter: () => M(z.key),
              onMouseLeave: () => M((j) => j === z.key ? null : j)
            }, [
              z.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (j) => {
                  j.stopPropagation(), I({ tagId: z.tagId, tagName: z.label, trigger: j.currentTarget });
                },
                "aria-label": `Configure ${z.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: P === z.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, z.label),
              (W = z.performers) != null && W.length ? n(Nr, {
                key: "performers",
                performers: z.performers,
                performerAssignments: z.performerAssignments
              }) : null,
              L ? n(en, { key: "counts", counts: z.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, z.markers.map(({ segment: j, track: te }) => {
              var Ze;
              const ge = Jr(j.startSec, V), Fe = j.endSec == null ? j.startSec : Math.max(j.startSec, j.endSec), Ie = Math.max(0, Jr(Fe, V) - ge), Ge = l.includes(j.id), Ue = j.id === s, Ee = po(H.get(j.id)), Je = j.endSec == null ? Re(j.startSec) : `${Re(j.startSec)} – ${Re(j.endSec)}`, yt = (Ze = mi[Ee]) == null ? void 0 : Ze.label;
              return n("button", {
                key: j.id,
                type: "button",
                onClick: (gt) => {
                  gt.stopPropagation(), p(j, {
                    additive: gt.metaKey || gt.ctrlKey,
                    rangeSegmentIds: gt.shiftKey ? z.markers.map((ot) => ot.segment.id) : null
                  });
                },
                "aria-pressed": Ge,
                "aria-current": Ue ? "true" : void 0,
                "data-selected-timeline-marker": Ue ? "true" : void 0,
                "data-selected-segment-shortcut-target": Ue ? "true" : void 0,
                "aria-label": L ? `${j.tagName || "Tag segment"}${z.performerLabel ? `, ${z.performerLabel}` : ""}, ${j.reviewState}${yt ? `, ${yt}` : ""}, ${Je}` : `${j.tagName || "Tag segment"}${z.performerLabel ? `, ${z.performerLabel}` : ""}, ${Je}`,
                title: L ? `${j.tagName || "Tag segment"}${z.performerLabel ? ` · ${z.performerLabel}` : ""} · ${j.reviewState}${yt ? ` · ${yt}` : ""} · ${Je}` : `${j.tagName || "Tag segment"}${z.performerLabel ? ` · ${z.performerLabel}` : ""} · ${Je}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...L ? Hl(j.reviewState, Ge, Ee, Ue) : _l(Ge, Ue),
                  left: `${ge}%`,
                  top: `${Yl(te)}rem`,
                  width: Wl(j.endSec, Ie),
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
  const [a, s] = F(null), [l, d] = F([]), [c, g] = F(null), [u, f] = F(""), [m, p] = F(!0), [b, v] = F(null), [I, x] = F(""), [q, L] = F(!1), U = ye(null), _ = ye(0);
  be(() => {
    const P = requestAnimationFrame(() => {
      var M;
      return (M = U.current) == null ? void 0 : M.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(P);
  }, [e]), be(() => {
    const P = new AbortController();
    return p(!0), x(""), Promise.all([
      r ? ee(`/slot-definitions/${e}`, { signal: P.signal }) : Promise.resolve(null),
      ee("/segment-groups", { signal: P.signal })
    ]).then(([M, T]) => {
      const H = T.find((ne) => (ne.tags || []).some((oe) => Number(oe.tagId) === Number(e)));
      s(M), d(T), g((H == null ? void 0 : H.id) ?? null), f(H == null ? "" : String(H.id)), L(!1);
    }).catch((M) => {
      M.name !== "AbortError" && x(M.message || "Unable to load tag configuration.");
    }).finally(() => {
      P.signal.aborted || p(!1);
    }), () => P.abort();
  }, [r, e]);
  function A(P, M) {
    s({
      ...a,
      definitions: a.definitions.map((T, H) => H === P ? { ...T, ...M } : T)
    });
  }
  function y(P, M) {
    const T = P + M;
    if (T < 0 || T >= a.definitions.length) return;
    const H = [...a.definitions];
    [H[P], H[T]] = [H[T], H[P]], s({
      ...a,
      definitions: H.map((ne, oe) => ({ ...ne, sortOrder: oe }))
    });
  }
  function w(P) {
    const M = a.definitions[P], T = Number(M.assignmentCount) || 0, H = T === 0 ? "" : ` and its ${T} assignment${T === 1 ? "" : "s"}`;
    window.confirm(`Delete “${St(M)}”${H}?`) && (T > 0 && L(!0), s({
      ...a,
      definitions: a.definitions.filter((ne, oe) => oe !== P).map((ne, oe) => ({ ...ne, sortOrder: oe }))
    }));
  }
  async function C() {
    var M;
    v("slots"), x("Saving performer slots…");
    let P;
    try {
      P = await ee(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: q,
          definitions: a.definitions.map((T, H) => {
            var ne;
            return {
              id: T.id || void 0,
              label: ((ne = T.label) == null ? void 0 : ne.trim()) || null,
              sortOrder: H,
              genderHints: T.genderHints || []
            };
          })
        })
      }), s(P), L(!1);
    } catch (T) {
      T.status === 409 ? (x("Performer slots changed elsewhere; current values were reloaded."), (M = T.payload) != null && M.current && (s(T.payload.current), L(!1))) : x(T.message || "Unable to save performer slots."), v(null);
      return;
    }
    try {
      await o(), x("Performer slots saved.");
    } catch {
      x("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      v(null);
    }
  }
  async function D() {
    const P = u === "" ? null : Number(u);
    if (P !== c) {
      v("group"), x("Saving tag group…");
      try {
        await ee(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: P })
        });
      } catch (M) {
        x(M.message || "Unable to assign the tag group."), v(null);
        return;
      }
      try {
        const [M, T] = await Promise.allSettled([
          ee("/segment-groups"),
          o()
        ]);
        if (M.status === "fulfilled") {
          d(M.value);
          const H = M.value.find((oe) => (oe.tags || []).some((Te) => Number(Te.tagId) === Number(e))), ne = (H == null ? void 0 : H.id) ?? null;
          g(ne), f(ne == null ? "" : String(ne));
        }
        x(
          M.status === "fulfilled" && T.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        v(null);
      }
    }
  }
  l.find((P) => Number(P.id) === Number(c));
  const Q = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (P) => {
      P.target === P.currentTarget && !b && i();
    },
    onKeyDownCapture: (P) => Nt(P, {
      onCancel: b ? void 0 : i
    })
  }, n("section", {
    ref: U,
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
            disabled: b != null,
            onChange: (P) => f(P.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((P) => n("option", { key: P.id, value: String(P.id) }, P.name))
          ])
        ]),
        m ? null : n("button", {
          key: "save",
          type: "button",
          disabled: b != null || (u === "" ? null : Number(u)) === c,
          onClick: D,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, b === "group" ? "Saving…" : "Save tag group")
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
              disabled: b != null,
              onChange: (P) => s({ ...a, allowSamePerformerInMultipleSlots: P.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((P, M) => n("article", {
            key: P.id || P._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: P.label || "",
                disabled: b != null,
                onChange: (T) => A(M, { label: T.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Ns.map((T) => n("label", { key: T, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: b != null,
                  checked: (P.genderHints || []).includes(T),
                  onChange: (H) => A(M, {
                    genderHints: H.target.checked ? [.../* @__PURE__ */ new Set([...P.genderHints || [], T])] : (P.genderHints || []).filter((ne) => ne !== T)
                  })
                }),
                n("span", { key: "text" }, wr(T))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${P.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: b != null || M === 0, onClick: () => y(M, -1), className: Q, "aria-label": `Move ${St(P)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: b != null || M === a.definitions.length - 1, onClick: () => y(M, 1), className: Q, "aria-label": `Move ${St(P)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: b != null, onClick: () => w(M), className: `${Q} text-red-300` }, "Delete")
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
                  _clientKey: `new-${++_.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: Q
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: b != null,
              onClick: C,
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
function Sc(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function kc(e) {
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, analysisError: i, analysisRun: a, analysisStatus: s, approvalFacetCounts: l, autoAssignCandidates: d, autoAssignError: c, autoAssignOpen: g, autoAssignPerformers: u, autoAssigning: f, cancelQueuedReviewsForSegments: m, canMoveSelectionToBin: p, captureTrainingExport: b, centerTimelineRef: v, closeEditorFilters: I, closeFirstSegmentTagDialog: x, closeMaterializeDialog: q, closeMergeConfirmation: L, closePublishApprovedDialog: U, closeTagEditing: _, collapsedSegmentGroups: A, commonActionsRef: y, compatibilityMode: w, configuringTag: C, createSegment: D, creatingSegmentId: Q, currentTime: P, deleteRejectedSegments: M, detail: T, detailPanelRef: H, detailWidth: ne, duplicateSegment: oe, editorFilters: Te, editorLayout: V, editorRef: K, exportingExamples: ie, filtersButtonRef: ue, filtersOpen: Y, firstSegmentTagOpen: ke, focusRowRef: he, handleSeparatorKeyDown: re, handleSeparatorPointerDown: le, handleSeparatorPointerMove: fe, hasNextUnreviewed: Z, hasPreviousUnreviewed: J, hideDerivedSegments: G, history: se, historyOpen: $, historySaving: h, horizontalLayoutSize: S, importNativeSegments: k, incorrectExamples: O, incorrectExamplesOpen: ae, lineage: B, markerRailWidth: z, materializeButtonRef: me, materializeCancelButtonRef: N, materializeDerivedSegments: W, materializeError: j, materializeLoading: te, materializeOpen: ge, materializePreview: Fe, materializing: Ie, mediaStackRef: Ge, mergeCancelButtonRef: Ue, mergeConfirmation: Ee, mergeSaving: Je, mergeSelectedSwimlane: yt, nativeImportState: Ze, onDetailChange: gt, onNavigate: ot, onReload: ut, onSlotsChanged: nt, openPublishApprovedDialog: pt, panelSeparatorProps: et, pendingInitialSeekRef: It, performerSlots: Ct, performerSlotsAvailable: X, playbackControlsRef: ce, previewDerivedSegments: Ne, provenance: Ae, provenanceSources: ve, publishApprovedCancelButtonRef: Ve, publishApprovedDrafts: je, publishApprovedError: We, publishApprovedOpen: Se, quickSearchOpen: Ke, railScrollRef: De, railToggleRef: we, recordHistoryAction: Be, rejectedDeletionPreview: at, removeIncorrectExample: xe, removingExampleId: Oe, restoreHistoryTarget: Me, runEditorAction: Et, saveMessage: Xe, saveTag: dt, saveTiming: Ut, savingSegmentId: Ye, seekRef: Ce, segmentGroups: $e, segmentRailLayout: _e, segments: ct, selectAllVideoSegments: it, selectSegment: Dt, selectSegmentCollection: kt, selectedGroups: Pt, selectedPerformerSlots: cn, selectedSegment: Ot, selectedSegmentGroupKey: nn, selectedSegmentIds: Zn, selectedSegments: rn, selectedSlotStatus: En, setAutoAssignError: Xn, setAutoAssignOpen: un, setConfiguringTag: Zt, setCurrentTime: mn, setEditorFilters: er, setEditorLayout: Cr, setFiltersOpen: tr, setHideDerivedSegments: $r, setHistoryOpen: gn, setIncorrectExamplesOpen: pn, setQuickSearchOpen: Dn, setRailViewport: fn, setRejectedDeletionPreview: Tr, setSaveMessage: nr, setSelectedSegmentGroupKey: yn, setSelectedSegmentId: on, setShortcutsOpen: bn, setTimelineZoom: Pn, shotBoundaries: ht, shortcutsOpen: rr, slotButtonRef: On, splitLayout: Kt, splitSegment: or, startFullAnalysis: hn, stepVideoFrame: vn, tagEditing: Ar, tagSearchRef: Rr, timelineDuration: Ln, timelineRatioBounds: xn, timelineZoom: Fn, toggleSegmentGroup: tt, toggleSegmentRail: bt, updateTimelineRatio: Mr, video: mt, videoPerformers: $t, visibleCounts: Tt, visibleSegmentRailRows: Er, visibleSegments: Sn, wideLayout: Wt, workspaceRef: jn } = e, Bn = He(
    () => ct.filter((R) => !R.published && R.reviewState === "approved"),
    [ct]
  ), ar = xs(oo), kn = Bn.length, Gn = Fe ? Fe.createCount + Fe.linkCount : null, zt = Ye != null, At = rn.length > 0, Lt = rn.length === 1, Dr = At && rn.every((R) => R.reviewState === "approved"), Pr = At && rn.every((R) => R.reviewState === "rejected"), Or = [
    { id: "marker.create", label: "New segment", disabled: zt },
    { id: "marker.editTag", label: "Edit tag", disabled: zt || !At },
    { id: "marker.setStart", label: "Set start", disabled: zt || !Lt },
    { id: "marker.setEnd", label: "Set end", disabled: zt || !Lt },
    { id: "marker.split", label: "Split", disabled: zt || !Lt },
    ...w ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !J, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Dr ? "Unapprove" : "Approve", disabled: zt || !At, tone: "approve" },
      { id: "marker.reject", label: Pr ? "Unreject" : "Reject", disabled: zt || !At, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !Z, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...w ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: zt || !p, tone: "reject" }
    ]
  ];
  function Lr(R) {
    const Pe = Zn.includes(R.id), pe = R.id === (Ot == null ? void 0 : Ot.id), rt = R.endSec == null ? Re(R.startSec) : `${Re(R.startSec)} – ${Re(R.endSec)}`, Vt = `${Gt(R.sourceKey)}${R.confidence != null ? ` · ${Math.round(R.confidence * 100)}%` : ""}`;
    return n("button", {
      key: R.id,
      type: "button",
      onClick: (qt) => Dt(R, { additive: qt.metaKey || qt.ctrlKey }),
      "aria-pressed": Pe,
      "aria-current": pe ? "true" : void 0,
      "data-selected-segment-shortcut-target": pe ? "true" : void 0,
      "aria-label": w ? `${R.tagName || "Tag segment"}, ${R.reviewState}${R.isDerived ? ", derived segment" : ""}, ${rt}` : `${R.tagName || "Tag segment"}${R.isDerived ? ", derived segment" : ""}, ${rt}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: ui(Pe, pe)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        w ? n(dn, { key: "review", state: R.reviewState, includeLabel: !1 }) : null,
        R.isDerived ? n(Ir, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          R.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, rt),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: Vt
        }, Vt)
      ])
    ]);
  }
  const wn = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", ft = [...se.actions || []].reverse().find((R) => R.sequence <= se.cursorSequence);
  return n("section", {
    ref: K,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${Kt ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (R) => Ci(R, ot, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${mt.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: mt.title || `Video ${mt.id}`
          }, mt.title || `Video ${mt.id}`)),
          ...$t.map((R) => n(Jn, {
            key: lt(R),
            performer: { id: lt(R), name: R.name },
            compact: !0,
            tooltip: R.name
          })),
          w ? n(en, { key: "review-counts", counts: Tt }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          w ? null : n(Ai, { key: "bin", onNavigate: ot, compact: !0 }),
          n(Ri, { key: "settings", onNavigate: ot, compact: !0 })
        ])
      ]),
      w && T.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${T.nativeImportCount} Cove segment${T.nativeImportCount === 1 ? "" : "s"} ${T.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        Ze.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, Ze.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
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
        Ze.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, Ze.error) : null
      ]) : null,
      i && (s == null ? void 0 : s.configured) !== !1 ? n("div", {
        key: "analysis-error",
        role: "alert",
        className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300"
      }, i) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          w ? n("div", {
            key: "full-analysis",
            className: "inline-flex items-stretch"
          }, [
            n("button", {
              key: "run",
              type: "button",
              disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
              onClick: () => hn(),
              title: (s == null ? void 0 : s.error) || "Run AI tagging and shot boundary analysis into the Full review workflow",
              className: "segment-studio-full-scan-run inline-flex items-center justify-center bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
            }, (s == null ? void 0 : s.configured) === !1 ? "Full Scan not configured" : (s == null ? void 0 : s.ready) === !1 ? "Full Scan unavailable" : (a == null ? void 0 : a.status) === "queued" ? "Full Scan queued…" : (a == null ? void 0 : a.status) === "running" ? "Full Scan running…" : "Full Scan"),
            n("details", { key: "choices", className: "relative flex" }, [
              n("summary", {
                key: "summary",
                "aria-label": "Choose Full Scan analyses",
                "aria-disabled": (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
                title: "Choose analyses",
                onClick: (R) => {
                  ((s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running") && R.preventDefault();
                },
                onKeyDown: (R) => {
                  (R.key === "Enter" || R.key === " ") && ((s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running") && R.preventDefault();
                },
                className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${(s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running" ? "pointer-events-none cursor-default opacity-50" : "cursor-pointer hover:opacity-90"}`
              }, n(La, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([R, Pe]) => n("button", {
                key: R,
                type: "button",
                disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
                onClick: (pe) => {
                  var rt;
                  (rt = pe.currentTarget.closest("details")) == null || rt.removeAttribute("open"), hn(Pe);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, R)))
            ])
          ]) : null,
          w ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: Ye != null || d.length === 0,
            onClick: () => {
              Xn(""), un(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${d.length ? ` (${d.length})` : ""}`) : null,
          w ? n("button", {
            key: "materialize-derived",
            ref: me,
            type: "button",
            disabled: Ye != null || te || Ie || Gn === 0,
            onClick: Ne,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, te ? "Analyzing…" : `Auto-Materialize${Gn != null ? ` (${Gn})` : ""}`) : null,
          w ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: Ye != null || kn === 0,
            onClick: (R) => pt(R.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": Se,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${kn ? ` (${kn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: ie || Oe != null || O.length === 0,
            onClick: () => pn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": ae,
            "aria-label": `Open AI feedback collection, ${O.length} example${O.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${O.length ? ` (${O.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: ue,
            type: "button",
            onClick: () => tr(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": Y,
            className: `${wn} ${r ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(mr, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${r ? ` (${r})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => bn(!0),
            className: wn
          }, [n(mr, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: (w ? se.actions.length === 0 : ft == null) || Ye != null || h,
            onClick: w ? () => gn((R) => !R) : () => Me(
              ft.sequence - 1
            ),
            "aria-haspopup": w ? "dialog" : void 0,
            "aria-expanded": w ? $ : void 0,
            className: wn
          }, [
            n(mr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, w ? `History${se.actions.length ? ` (${se.actions.length})` : ""}` : ft ? `Undo ${ft.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: we,
            type: "button",
            onClick: bt,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": V.markerRailOpen,
            className: wn
          }, [
            n(mr, { key: "icon", name: "list" }),
            n("span", { key: "label" }, V.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    w && $ ? n("section", {
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
          onClick: () => gn(!1),
          className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
        }, "Close")
      ]),
      n("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
        ...[...se.actions].reverse().map((R) => n("button", {
          key: R.sequence,
          type: "button",
          disabled: h,
          onClick: () => Me(R.sequence),
          "aria-current": se.cursorSequence === R.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${R.sequence > se.cursorSequence ? "text-secondary" : "text-foreground"} ${se.cursorSequence === R.sequence ? "bg-accent/15" : ""}`
        }, [
          n("span", { key: "label", className: "min-w-0 flex-1 truncate" }, R.label),
          n("time", {
            key: "time",
            dateTime: R.createdAt,
            className: "shrink-0 text-[10px] text-secondary"
          }, new Date(R.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        ])),
        n("button", {
          key: "baseline",
          type: "button",
          disabled: h,
          onClick: () => Me(se.baselineSequence),
          "aria-current": se.cursorSequence === se.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${se.cursorSequence === se.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    Y ? n(lc, {
      key: "editor-filters",
      filters: Te,
      hideDerivedSegments: G,
      performers: $t,
      provenanceSources: ve,
      reviewCounts: l,
      segments: ct,
      segmentGroups: $e,
      reviewMode: w,
      onChange: er,
      onHideDerivedChange: $r,
      onClose: I
    }) : null,
    ke ? n(sc, {
      key: "first-segment-tag-dialog",
      saving: Ye != null,
      error: Xe,
      onSelect: (R, Pe) => D(R, Pe),
      onClose: x
    }) : null,
    Ke ? n(uc, {
      key: "quick-search-dialog",
      segments: Ol(o),
      onSelect: (R) => {
        Dn(!1), Dt(R, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        Dn(!1), requestAnimationFrame(() => {
          var R;
          return (R = K.current) == null ? void 0 : R.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    g ? n(pc, {
      key: "auto-assign-dialog",
      candidates: d,
      processing: f,
      error: c,
      onConfirm: u,
      onClose: () => un(!1)
    }) : null,
    Ee ? n(yc, {
      key: "merge-selection-dialog",
      merge: Ee,
      processing: Je,
      undoable: !w,
      cancelButtonRef: Ue,
      onConfirm: (R) => yt(!0, R, Ee),
      onClose: L
    }) : null,
    ge ? n(hc, {
      key: "materialize-derived-dialog",
      preview: Fe,
      loading: te,
      processing: Ie,
      error: j,
      cancelButtonRef: N,
      onConfirm: W,
      onClose: () => {
        Ie || q();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: jn,
      className: `${Kt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      V.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: Wt ? { position: "absolute", top: 0, right: 0, width: z, height: S.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        ct.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : Sn.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: De,
          onScroll: (R) => fn({
            scrollTop: R.currentTarget.scrollTop,
            height: R.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: _e.height }
        }, Er.map((R) => {
          var pe;
          let Pe;
          if (R.kind === "group") {
            const rt = A.includes(R.group.key), Vt = R.group.lanes.reduce((qt, Fr) => qt + Fr.markers.length, 0);
            Pe = n("button", {
              type: "button",
              onClick: () => {
                yn(R.group.key), tt(R.group.key);
              },
              "aria-expanded": !rt,
              "aria-current": nn === R.group.key ? "true" : void 0,
              "data-segment-rail-group": R.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${nn === R.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, rt ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: R.group.name }, R.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Vt),
              w && rt ? n(en, { key: "states", counts: R.group.counts }) : null
            ]);
          } else R.kind === "lane" ? Pe = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Vn(R.lane),
            "aria-label": Vn(R.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, R.lane.label),
            (pe = R.lane.performers) != null && pe.length ? n(Nr, {
              key: "performers",
              performers: R.lane.performers,
              performerAssignments: R.lane.performerAssignments
            }) : null,
            w ? n(en, { key: "states", counts: R.lane.counts }) : null
          ]) : Pe = Lr(R.segment);
          return n("div", {
            key: R.key,
            className: "absolute left-0 right-0",
            style: { top: R.top, height: R.height }
          }, Pe);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${Kt ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: Ge,
          className: `${Kt ? "min-h-0 flex-1" : ""} grid`,
          style: Kt ? {
            gridTemplateRows: `minmax(16rem, ${(1 - V.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${V.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: he,
            className: "grid min-h-0 gap-2",
            style: Wt ? {
              gridTemplateColumns: V.markerRailOpen ? `${ne}px 0.5rem minmax(0,1fr) 0.5rem ${z}px` : `${ne}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(vc, {
              key: "tools",
              compatibilityMode: w,
              selectedSegment: Ot,
              selectedSegments: rn,
              selectedGroups: Pt,
              saveMessage: Xe,
              savingSegmentId: Ye,
              creatingSegmentId: Q,
              acquireSaveLock: t,
              setSaveMessage: nr,
              saveTag: dt,
              slotStatus: En,
              performerSlotsAvailable: X,
              selectedPerformerSlots: cn,
              performerSlots: Ct,
              detail: T,
              onDetailChange: gt,
              onCancelQueuedReview: m,
              video: mt,
              slotButtonRef: On,
              tagSearchRef: Rr,
              tagEditing: Ar,
              onCancelTagEditing: _,
              detailPanelRef: H,
              onReduceSelection: (R) => {
                Dt(R), requestAnimationFrame(() => {
                  var Pe;
                  return (Pe = H.current) == null ? void 0 : Pe.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Ut,
              onSlotsChanged: nt,
              onRecordHistory: Be,
              splitSegment: or,
              duplicateSegment: oe,
              provenance: Ae,
              lineage: B,
              onNavigateLineageItem: (R) => {
                const Pe = ct.find((pe) => pe.itemId === R);
                Pe && on(Pe.id);
              }
            }),
            Wt ? n(
              "div",
              { key: "detail-separator", ...et("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            mt.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Ma, {
                streamUrl: `/api/stream/video/${mt.id}`,
                posterUrl: `/api/stream/video/${mt.id}/screenshot?v=${encodeURIComponent(mt.updatedAt || "")}`,
                format: mt.videoFile.format,
                audioCodec: mt.videoFile.audioCodec,
                duration: mt.videoFile.duration,
                videoId: mt.id,
                trackingEnabled: !1,
                onSeekRegister: (R) => {
                  Ce.current = R, Ml(It.current, ct, R) && (It.current = null);
                },
                onPlaybackControlRegister: (R) => {
                  ce.current = R;
                },
                onTimeUpdate: mn
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            Wt && V.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...et("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Wt && V.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: y,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...Or.map((R) => {
              var rt;
              const Pe = (rt = ar[R.id]) == null ? void 0 : rt[0], pe = R.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : R.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: R.id,
                type: "button",
                disabled: R.disabled,
                "data-action-id": R.id,
                onClick: (Vt) => {
                  const qt = Vt.currentTarget;
                  Et(R.id, { target: qt, preserveFocus: !0 }), R.focusWhenDisabled && requestAnimationFrame(() => {
                    Sc(qt, y.current, R.focusWhenDisabled);
                  });
                },
                title: Pe ? `${R.label} (${Pe})` : R.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${pe}`
              }, [
                n("span", { key: "label" }, R.label),
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
                disabled: !mt.videoFile,
                onClick: () => vn(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(Ss, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !mt.videoFile,
                onClick: () => vn(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(ks, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          Kt ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(xn.minimum * 100),
            "aria-valuemax": Math.round(xn.maximum * 100),
            "aria-valuenow": Math.round(V.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(V.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: le,
            onPointerMove: fe,
            onKeyDown: re,
            onDoubleClick: () => Mr(wt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: Kt ? void 0 : { height: "20rem" } }, n(xc, {
            segments: Sn,
            shotBoundaries: ht,
            segmentGroups: $e,
            performerSlots: Ct,
            collapsedGroupKeys: A,
            selectedGroupKey: nn,
            selectedSegmentId: Ot == null ? void 0 : Ot.id,
            selectedSegmentIds: Zn,
            duration: Ln,
            currentTime: P,
            zoom: Fn,
            onZoomChange: Pn,
            onSelectGroup: yn,
            onToggleGroup: tt,
            onSelect: (R, Pe) => Dt(R, Pe),
            onSelectSegments: kt,
            onSelectAll: it,
            onConfigureTag: (R) => Zt(R),
            onSeekTime: (R) => {
              var Pe;
              return (Pe = Ce.current) == null ? void 0 : Pe.call(Ce, R, !1);
            },
            centerRef: v,
            showReviewState: w,
            swimlaneTitleWidth: V.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (R) => Cr((Pe) => ({ ...Pe, swimlaneTitleWidth: R }))
          }))
        ])
      ])
    ]),
    C ? n(ho, {
      key: `configure-tag:${C.tagId}`,
      tagId: C.tagId,
      tagName: C.tagName,
      performerSlotsEnabled: w,
      onSaved: ut,
      onClose: () => {
        const R = C.trigger;
        Zt(null), requestAnimationFrame(() => {
          var Pe;
          R != null && R.isConnected ? R.focus({ preventScroll: !0 }) : (Pe = K.current) == null || Pe.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Se ? n(gc, {
      key: "publish-approved-dialog",
      drafts: Bn,
      processing: Ye === -1,
      error: We,
      cancelButtonRef: Ve,
      onConfirm: je,
      onClose: U
    }) : null,
    at ? n(fc, {
      key: "rejected-deletion-dialog",
      preview: at,
      onConfirm: () => {
        M(at), requestAnimationFrame(() => {
          var R;
          return (R = K.current) == null ? void 0 : R.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Tr(null), requestAnimationFrame(() => {
          var R;
          return (R = K.current) == null ? void 0 : R.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    rr ? n(dc, {
      key: "shortcuts-dialog",
      reviewMode: w,
      bindings: ar,
      onClose: () => bn(!1)
    }) : null,
    ae ? n(cc, {
      key: "incorrect-examples-dialog",
      examples: O,
      exporting: ie,
      removingExampleId: Oe,
      onExport: b,
      onRemove: xe,
      onClose: () => pn(!1)
    }) : null
  ]);
}
function wc(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: u, setEditorFilters: f, setHideDerivedSegments: m, setSaveMessage: p, setSelectedSegmentGroupKey: b, setSelectedSegmentId: v, setSelectedSegmentIds: I } = e;
  function x(A) {
    const y = jt(t, A);
    y && u((w) => hi(w, y));
  }
  function q(A) {
    v(A), I(A == null ? [] : [A]), c.current = A, g.current = [];
  }
  function L(A, {
    focusEditor: y = !1,
    seekToSegment: w = !1,
    additive: C = !1,
    rangeSegmentIds: D = null
  } = {}) {
    var P, M;
    const Q = Js({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, A.id, D, C);
    I(Q.selectedSegmentIds), v(Q.activeSegmentId), c.current = Q.anchorSegmentId, g.current = Q.rangeBaseSegmentIds, Q.activeSegmentId != null && b(jt(t, Q.activeSegmentId)), x(A.id), y && ((P = r.current) == null || P.focus({ preventScroll: !0 })), w && ((M = i.current) == null || M.call(i, A.startSec, !1));
  }
  function U(A) {
    const y = Ws(
      d,
      l,
      A
    );
    I(y.selectedSegmentIds), v(y.activeSegmentId), c.current = y.activeSegmentId, g.current = [], y.activeSegmentId != null && (b(jt(t, y.activeSegmentId)), x(y.activeSegmentId));
  }
  function _() {
    var w;
    const A = Qs(s), y = A.includes(l) ? l : A[0] ?? null;
    f(Mt({})), m(!1), I(A), v(y), c.current = y, g.current = [], y != null && b(jt(
      sn(s, a, o),
      y
    )), p(A.length === 0 ? "There are no segments to select." : `${A.length} segments selected. Collapsed Segment groups keep their selected segments.`), (w = r.current) == null || w.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: x, replaceSegmentSelection: q, selectSegment: L, selectSegmentCollection: U, selectAllVideoSegments: _ };
}
function Nc(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, historyRef: c, onConflict: g, onDetailChange: u, onReload: f, recordHistoryAction: m, revealSegmentGroupForSelection: p, savingSegmentId: b, selectedGroups: v, selectedSegment: I, selectedSegmentIdRef: x, selectedSegments: q, selectionAnchorIdRef: L, selectionRangeBaseIdsRef: U, setMergeConfirmation: _, setSaveMessage: A, setSelectedSegmentId: y, setSelectedSegmentIds: w, video: C } = e;
  function D() {
    _(null), requestAnimationFrame(() => {
      var T;
      return (T = a.current) == null ? void 0 : T.focus({ preventScroll: !0 });
    });
  }
  async function Q(T = !1, H = !1, ne = null) {
    if (b != null) return;
    const oe = ne || yi(
      v,
      { nativeOnly: !o }
    );
    if (!oe) {
      A("Select at least two segments from one swimlane.");
      return;
    }
    if (!T && _a()) {
      _(oe);
      return;
    }
    H && Wa(!1);
    const Te = oe.endSec == null ? "open end" : Re(oe.endSec);
    let V = oe.segments[0];
    const K = o ? null : Rt(oe.segments, !1), ie = o ? null : crypto.randomUUID(), ue = oe.segments.map((le) => le.id), Y = $d(i, oe.segments).segments.find((le) => le.id === V.id), ke = {
      startSec: Y.startSec,
      endSec: Y.endSec,
      sourceKey: Y.sourceKey,
      sourceRunId: Y.sourceRunId,
      confidence: Y.confidence,
      isDerived: Y.isDerived
    }, he = r("merge", oe.segments[0].id);
    if (!he) return;
    D();
    const re = Qt();
    s({
      type: "add",
      entry: { id: re, op: "merge", targets: oe.segments.map(Ht), values: ke }
    }), w([V.id]), y(V.id), L.current = V.id, U.current = [];
    try {
      const le = oe.segments.slice(1);
      if (!o || V.nativeSegmentId != null) {
        const fe = le.map((J) => {
          const G = `merge-native-selection:${C.id}:${V.id}:${J.id}:${V.updatedAt}:${J.updatedAt}`;
          return { key: G, operationId: ze(G), segmentId: J.id, expectedUpdatedAt: J.updatedAt };
        }), Z = await ee(`/videos/${C.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: V.id,
            expectedSurvivorUpdatedAt: V.updatedAt,
            consumedSegments: fe.map(({ key: J, ...G }) => G),
            historyReceiptId: ie
          })
        });
        V = Z.survivor, u((J) => ca(J, Z), C.id), s({ type: "confirm", key: re, applied: !0 }), fe.forEach(({ key: J }) => qe(J));
      } else {
        const fe = le.map((J) => {
          const G = `merge-draft-selection:${C.id}:${V.itemId}:${J.itemId}:${V.revision}:${J.revision}`;
          return { key: G, operationId: ze(G), itemId: J.itemId, expectedRevision: J.revision };
        }), Z = await ee(`/videos/${C.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: V.itemId,
            expectedSurvivorRevision: V.revision,
            consumedDrafts: fe.map(({ key: J, ...G }) => G)
          })
        });
        V = Z.survivor, u((J) => ca(J, Z), C.id), s({ type: "confirm", key: re, applied: !0 }), fe.forEach(({ key: J }) => qe(J));
      }
      w([V.id]), y(V.id), L.current = V.id, U.current = [], o ? t(Jt) : await m(
        "segments.merge",
        `Merged ${oe.segments.length} segments`,
        K,
        Rt([V], !1),
        ie
      ), p(V.id), A(`${oe.segments.length} segments merged into ${Re(oe.startSec)} – ${Te}.`);
    } catch (le) {
      s({ type: "discard", key: re }), w(ue), y((I == null ? void 0 : I.id) ?? ue[0] ?? null), L.current = (I == null ? void 0 : I.id) ?? ue[0] ?? null, U.current = [], le.status === 409 ? await g() : A(le.message || "Unable to merge selected segments.");
    } finally {
      he();
    }
  }
  function P(T, H = q, ne = I) {
    if (H.length === 0) return Promise.resolve(null);
    const oe = cl(T, H, ne), Te = Math.max(0, oe.identities.indexOf(oe.activeIdentity)), V = d(), K = xi(V) != null || V.queued.some((ue) => yo(ue.targets, oe.identities)), ie = l({
      kind: "review",
      lockId: oe.activeIdentity.id,
      targets: oe.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (ue) => M(ue, {
        ...oe,
        identities: ue.targets,
        activeIdentity: ue.targets[Te]
      })
    });
    return ie ? (K && A(`${T === "approved" ? "Approval" : "Rejection"} queued…`), ie.done) : (A("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function M({ detail: T, segments: H, onConflict: ne, onReload: oe }, Te) {
    var Z;
    const V = ul(Te, H);
    if (!V) {
      A("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: K, selectedSegments: ie, selectedSegment: ue } = V, Y = dl(ie, K), ke = ie.filter((J) => J.reviewState !== Y);
    if (ke.length === 0) return;
    const he = ie.map((J) => ({
      id: J.id,
      itemId: J.itemId,
      nativeSegmentId: J.nativeSegmentId
    })), re = he.find((J) => J.id === (ue == null ? void 0 : ue.id)) || he[0], le = (J, G = !1) => {
      if (!(J != null && J.segments) || !G && !Zr(x.current, re.id))
        return;
      const se = he.map((h) => Qe(J == null ? void 0 : J.segments, h)).filter(Boolean), $ = Qe(J == null ? void 0 : J.segments, re) || se[0] || null;
      w(se.map((h) => h.id)), y(($ == null ? void 0 : $.id) ?? null), L.current = ($ == null ? void 0 : $.id) ?? null, U.current = [];
    };
    A(`Updating ${ke.length} selected segment${ke.length === 1 ? "" : "s"}…`);
    const fe = Qt();
    s({
      type: "add",
      entry: { id: fe, op: "patch", targets: ke.map(Ht), values: { reviewState: Y } }
    });
    try {
      const J = await ee(`/videos/${C.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: c.current.revision,
          reviewState: Y,
          segments: ie.map((h) => h.published ? {
            nativeSegmentId: h.nativeSegmentId,
            expectedUpdatedAt: h.updatedAt
          } : {
            itemId: h.itemId,
            expectedRevision: h.revision
          })
        })
      }), G = new Map((J.items || []).map((h) => [
        h.requestedNativeSegmentId != null ? `native:${h.requestedNativeSegmentId}` : `item:${h.requestedItemId}`,
        h
      ]));
      if (he.forEach((h) => {
        const S = G.get(h.nativeSegmentId != null ? `native:${h.nativeSegmentId}` : `item:${h.itemId}`);
        S && (h.nativeSegmentId = S.nativeSegmentId, h.itemId = S.itemId);
      }), J.history && t(J.history), Y === "rejected" || (J.items || []).some((h) => h.requestedNativeSegmentId != null && h.nativeSegmentId !== h.requestedNativeSegmentId)) {
        const h = await oe();
        s({ type: "confirm", key: fe, applied: h != null }), le(h), A(`${J.updatedCount} selected segment${J.updatedCount === 1 ? "" : "s"} ${Y === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const $ = (h) => ({
        ...h,
        approvedSetVersion: J.approvedSetVersion || h.approvedSetVersion,
        segments: (h.segments || []).map((S) => {
          const k = G.get(S.nativeSegmentId != null ? `native:${S.nativeSegmentId}` : `item:${S.itemId}`);
          return k ? {
            ...S,
            id: k.nativeSegmentId != null ? k.nativeSegmentId : -k.itemId,
            itemId: k.itemId,
            nativeSegmentId: k.nativeSegmentId,
            published: k.nativeSegmentId != null,
            reviewState: Y,
            revision: k.nativeSegmentId != null ? S.revision : k.revision,
            updatedAt: k.updatedAt
          } : S;
        })
      });
      u($, C.id), s({ type: "confirm", key: fe, applied: !0 }), le($(T)), A(`${J.updatedCount} selected segment${J.updatedCount === 1 ? "" : "s"} ${Y === "approved" ? "approved" : Y === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (J) {
      s({ type: "discard", key: fe }), J.status === 409 && ((Z = J.payload) != null && Z.currentHistory) && t(J.payload.currentHistory);
      const G = J.status === 409 ? await ne() : T;
      le(G, !0), A(J.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: D, mergeSelectedSwimlane: Q, saveSelectedReviewState: P };
}
function Ic(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: g, detail: u, editorFilters: f, editorRef: m, cancelSaveTasks: p, dispatchPendingChanges: b, enqueueSave: v, stableSaveIdentity: I, exportingExamples: x, hideDerivedSegments: q, incorrectExamples: L, lineage: U, materializeButtonRef: _, materializePreview: A, materializeRestoreFocusRef: y, materializing: w, mutateSegment: C, runSegmentMutation: D, pendingChanges: Q, onConflict: P, onDetailChange: M, onReload: T, performerSlots: H, recordHistoryAction: ne, refreshMaterializationPreview: oe, removingExampleId: Te, revealSegmentGroupForSelection: V, savingSegmentId: K, segmentGroups: ie, segments: ue, selectedSegment: Y, selectedSegmentIdRef: ke, selectedSegments: he, selectionAnchorIdRef: re, selectionRangeBaseIdsRef: le, setAutoAssignError: fe, setAutoAssignOpen: Z, setAutoAssigning: J, setEditorFilters: G, setExportingExamples: se, setHideDerivedSegments: $, setIncorrectExamples: h, setMaterializeError: S, setMaterializeLoading: k, setMaterializeOpen: O, setMaterializePreview: ae, setMaterializing: B, setRejectedDeletionPreview: z, setRemovingExampleId: me, setSaveMessage: N, setSelectedSegmentGroupKey: W, setSelectedSegmentId: j, setSelectedSegmentIds: te, video: ge } = e;
  async function Fe() {
    var we, Be, at;
    if (he.length === 0 || !Y || K != null) return;
    const X = xd(he, L), ce = X.segments;
    if (ce.length === 0) return;
    const Ne = he.map((xe) => ({
      id: xe.id,
      itemId: xe.itemId,
      nativeSegmentId: xe.nativeSegmentId
    })), Ae = Ne.find((xe) => xe.id === Y.id) || Ne[0], ve = [], Ve = [];
    let je = !1, We = u, Se = !1;
    const Ke = [], De = r("feedback", Ae.id);
    if (De) {
      N(X.action === "remove" ? `Removing ${ce.length} selected incorrect example${ce.length === 1 ? "" : "s"}…` : `Collecting ${ce.length} selected segment${ce.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const xe = async (Ce, $e) => {
          const _e = Ce.nativeSegmentId != null, ct = X.action === "remove" ? `incorrect-example-remove:${ge.id}:${$e == null ? void 0 : $e.id}:${$e == null ? void 0 : $e.revision}:${$e == null ? void 0 : $e.representationRevision}` : `incorrect-example-collect:${ge.id}:${_e ? `native:${Ce.nativeSegmentId}:${Ce.updatedAt}` : `item:${Ce.itemId}:${Ce.revision}`}`;
          if (X.action === "remove" && !$e)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let it;
          try {
            it = X.action === "remove" ? await ee(
              `/videos/${ge.id}/incorrect-examples/${$e.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: ze(ct),
                  expectedExampleRevision: $e.revision,
                  expectedRepresentationRevision: $e.representationRevision
                })
              }
            ) : await ee(`/videos/${ge.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: ze(ct),
                nativeSegmentId: _e ? Ce.nativeSegmentId : null,
                itemId: _e ? null : Ce.itemId,
                expectedUpdatedAt: _e ? Ce.updatedAt : null,
                expectedRevision: _e ? null : Ce.revision
              })
            });
          } catch (Dt) {
            throw Dt.operationKey = ct, Dt;
          }
          if (!Sd(X.action, it))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return qe(ct), it;
        };
        for (const Ce of ce) {
          const $e = X.action === "remove" ? L.find((_e) => _e.itemId != null && _e.itemId === Ce.itemId) : null;
          try {
            const _e = Ne.find((kt) => kt.id === Ce.id);
            let ct = Qe(
              We == null ? void 0 : We.segments,
              _e
            ) || Ce, it;
            try {
              it = await xe(ct, $e);
            } catch (kt) {
              if (kt.status === 409 && ((Be = (we = kt.payload) == null ? void 0 : we.result) == null ? void 0 : Be.code) === "OPERATION_REPLAYED")
                We = await ee(
                  `/videos/${ge.id}/editor`
                ), Se = !0, Ke.length = 0, qe(kt.operationKey), it = kt.payload.result;
              else {
                if (X.action !== "collect" || kt.status !== 409) throw kt;
                const Pt = await ee(
                  `/videos/${ge.id}/editor`
                );
                We = Pt, Se = !0, Ke.length = 0;
                const cn = Qe(
                  Pt == null ? void 0 : Pt.segments,
                  _e
                );
                if (!cn) throw kt;
                ct = cn, it = await xe(ct, null);
              }
            }
            _e && it.itemId != null && (_e.itemId = it.itemId), We = fr(
              We,
              it.editorDelta
            ), Ke.push(it.editorDelta);
            const Dt = { segment: Ce, result: it, example: $e };
            ve.push(Dt);
          } catch (_e) {
            if (Ve.push(_e), ![400, 404, 409].includes(_e.status)) break;
          }
        }
        if (c && ve.length > 0) {
          const Ce = X.action === "remove", $e = ve.length;
          await ne(
            Ce ? "feedback.remove" : "feedback.collect",
            Ce ? `Removed ${$e} incorrect AI example${$e === 1 ? "" : "s"}` : `Collected ${$e} incorrect AI example${$e === 1 ? "" : "s"}`,
            cr(ve, Ce),
            cr(ve, !Ce)
          ) || (je = !0);
        }
        ve.some(({ result: Ce }) => Ce.representation === "basicNativeBin") && Hn();
        const Oe = Zr(
          ke.current,
          Ae.id
        ), Me = X.action === "collect" && ve.some(({ segment: Ce }) => Ce.id === Ae.id), Et = ve.map(({ segment: Ce }) => Ce.id), Xe = Me ? Xs(
          o,
          Et,
          Ae.id
        ) : null, dt = Me ? (Xe == null ? void 0 : Xe.id) ?? null : Ae.id;
        Oe && Me && (te(Xe ? [Xe.id] : []), j((Xe == null ? void 0 : Xe.id) ?? vr), re.current = (Xe == null ? void 0 : Xe.id) ?? null, le.current = []);
        const Ut = await ee(`/videos/${ge.id}/incorrect-examples`);
        h(Ut);
        const Ye = We;
        if (M(Se ? Ye : (Ce) => Ke.reduce(fr, Ce), ge.id), Oe && Zr(
          ke.current,
          dt
        )) {
          let Ce, $e;
          Me ? ($e = Xe ? Qe(Ye == null ? void 0 : Ye.segments, {
            id: Xe.id,
            itemId: Xe.itemId,
            nativeSegmentId: Xe.nativeSegmentId
          }) : null, Ce = $e ? [$e] : []) : (Ce = Ne.map((_e) => Qe(Ye == null ? void 0 : Ye.segments, _e)).filter(Boolean), $e = Qe(Ye == null ? void 0 : Ye.segments, Ae) || Ce[0] || null), te(Ce.map((_e) => _e.id)), j(($e == null ? void 0 : $e.id) ?? (Me ? vr : null)), re.current = ($e == null ? void 0 : $e.id) ?? null, le.current = [], W($e ? jt(o, $e.id) : null), $e && V($e.id);
        }
        if (Ve.length > 0) {
          const Ce = ((at = Ve[0]) == null ? void 0 : at.message) || "Only segments with registered AI provenance can be collected.";
          ve.length === 0 ? N(Ce) : X.action === "remove" ? N(
            `Partially removed ${ve.length} of ${ce.length} selected incorrect examples. ${Ce}`
          ) : N(
            `Partially collected ${ve.length} of ${ce.length} selected segments. ${Ce}`
          );
        } else if (X.action === "remove")
          N(
            `${ve.length} incorrect example${ve.length === 1 ? "" : "s"} removed and ${ve.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const Ce = ve.filter(({ result: $e }) => $e.representation === "basicNativeBin").length;
          N(Ce === ve.length ? `${ve.length} incorrect AI example${ve.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ve.length} incorrect AI example${ve.length === 1 ? "" : "s"} collected and ${ve.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        je && N("The change saved, but editor history could not be updated.");
      } catch (xe) {
        N(xe.message || "Unable to update the selected incorrect examples.");
      } finally {
        De();
      }
    }
  }
  async function Ie(X) {
    if (!X || Te != null || x) return;
    const ce = r("feedback", -1);
    if (!ce) {
      N("Wait for the current save to finish before removing the incorrect example.");
      return;
    }
    try {
      await Ge(X);
    } finally {
      ce();
    }
  }
  async function Ge(X) {
    var Ne, Ae;
    me(X.id);
    const ce = `incorrect-example-remove:${ge.id}:${X.id}:${X.revision}:${X.representationRevision}`;
    try {
      let ve, Ve = !1;
      try {
        ve = await ee(
          `/videos/${ge.id}/incorrect-examples/${X.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: ze(ce),
              expectedExampleRevision: X.revision,
              expectedRepresentationRevision: X.representationRevision
            })
          }
        );
      } catch (Se) {
        if (Se.status !== 409 || ((Ae = (Ne = Se.payload) == null ? void 0 : Ne.result) == null ? void 0 : Ae.code) !== "OPERATION_REPLAYED")
          throw Se;
        ve = Se.payload.result, Ve = !0;
      }
      qe(ce);
      let je = !0;
      if (c) {
        const Ke = [{ segment: Qe(u.segments, {
          itemId: X.itemId
        }) || {
          id: X.itemId == null ? null : -X.itemId,
          itemId: X.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: X.representationRevision
        }, result: ve, example: X }];
        je = await ne(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          cr(Ke, !0),
          cr(Ke, !1)
        );
      }
      const We = await ee(
        `/videos/${ge.id}/incorrect-examples`
      );
      h(We), Ve ? await T() : M(
        (Se) => fr(Se, ve.editorDelta),
        ge.id
      ), X.representation === "basicNativeBin" && Hn(), N(je ? Ve ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : X.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (ve) {
      ve.status === 409 && await P(), N(ve.message || "Unable to remove the incorrect example.");
    } finally {
      me(null);
    }
  }
  async function Ue() {
    if (x || Te != null || L.length === 0) return;
    se(!0);
    const X = `incorrect-example-export:${ge.id}:${L.map((ce) => `${ce.id}:${ce.revision}:${ce.representationRevision}`).join(",")}`;
    try {
      const ce = await wd(
        ge.id,
        L
      ), Ne = new FormData();
      Ne.append("metadata", JSON.stringify({
        operationId: ze(X),
        examples: ce.captures
      }));
      for (const Se of ce.files)
        Ne.append(Se.fieldName, Se.file);
      const Ae = await ee(
        `/videos/${ge.id}/incorrect-examples/export`,
        { method: "POST", body: Ne }
      ), ve = await Ul(Ae.downloadUrl), Ve = URL.createObjectURL(ve.blob), je = document.createElement("a");
      je.href = Ve, je.download = ve.fileName, je.click(), setTimeout(() => URL.revokeObjectURL(Ve), 1e3);
      const We = await ee(
        `/training-exports/${Ae.id}/complete`,
        { method: "POST" }
      );
      qe(X), h(await ee(
        `/videos/${ge.id}/incorrect-examples`
      )), N(
        `Downloaded ${Ae.exampleCount} incorrect example${Ae.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${We.clearedExampleCount} from the working collection.`
      );
    } catch (ce) {
      N(ce.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      se(!1);
    }
  }
  async function Ee(X = null) {
    const ce = ue.filter((we) => we.reviewState === "rejected"), Ne = ce.length, Ae = L.some((we) => we.representation === "fullItem");
    if (X == null && Ne === 0 && !Ae) {
      N("There are no rejected segments to delete.");
      return;
    }
    if (X == null) {
      const we = r("delete-rejected", -1);
      if (!we) return;
      N("Preparing deletion summary…");
      try {
        const Be = await ee(`/videos/${ge.id}/rejected/deletion/preview`, { method: "POST" }), at = Number(Be.deletedSegmentCount) || 0, xe = Number(Be.deferredRejectedSegmentCount) || 0, Oe = Number(Be.protectedIncorrectExampleCount) || 0;
        if (at === 0) {
          xe > 0 ? N(
            `${xe} feedback-protected rejected segment${xe === 1 ? "" : "s"} kept. ${Oe} AI feedback example${Oe === 1 ? "" : "s"} must be exported before ${xe === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : N("There are no rejected segments to delete.");
          return;
        }
        if (!si(Be, N)) return;
        z(Be), N("");
      } catch (Be) {
        N(Be.message || "Unable to prepare rejected segment deletion.");
      } finally {
        we();
      }
      return;
    }
    const ve = X, Ve = Number(ve.deferredRejectedSegmentCount) || 0, je = ke.current, We = Ve === 0 ? Cd(u, ce.map((we) => we.id)) : u, Se = We.segments.find((we) => we.reviewState === "unreviewed") || We.segments[0] || null, Ke = r("delete-rejected", -1);
    if (!Ke) return;
    z(null), N("Deleting rejected segments…");
    const De = Ve === 0 ? Qt() : null;
    De && (b({
      type: "add",
      entry: { id: De, op: "remove", targets: ce.map(Ht) }
    }), te(Se ? [Se.id] : []), j((Se == null ? void 0 : Se.id) ?? null), re.current = (Se == null ? void 0 : Se.id) ?? null, le.current = []);
    try {
      const we = `rejected-dependency-delete:${ge.id}:${ve.fingerprint}`, Be = await ee(`/videos/${ge.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ze(we),
          fingerprint: ve.fingerprint
        })
      });
      qe(we);
      const at = await T();
      De && b({ type: "confirm", key: De, applied: at != null }), Be.deletedSegmentCount > 0 && t(Jt);
      const xe = Ve > 0 ? ` ${Ve} feedback-protected rejected segment${Ve === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      N(`${Be.deletedSegmentCount} segment${Be.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${xe}`);
    } catch (we) {
      De && b({ type: "discard", key: De }), te(je == null ? [] : [je]), j(je), re.current = je, le.current = [], N(we.message || "Unable to delete rejected segments.");
    } finally {
      Ke();
    }
  }
  async function Je(X = i) {
    if (a || X.length === 0) return;
    const ce = r("auto-assign", -1);
    if (!ce) {
      fe("Wait for the current save to finish before assigning performers.");
      return;
    }
    try {
      await yt(X);
    } finally {
      ce();
    }
  }
  async function yt(X) {
    J(!0), fe("");
    try {
      const ce = await ee(`/videos/${ge.id}/segments/auto-assign-performer-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeSegmentIds: X.flatMap((Ne) => Ne.nativeSegmentId == null ? [] : [Ne.nativeSegmentId]),
          itemIds: X.flatMap((Ne) => Ne.published || Ne.itemId == null ? [] : [Ne.itemId])
        })
      });
      Z(!1), await T(), N(`${ce.assignedSegmentCount} segment${ce.assignedSegmentCount === 1 ? "" : "s"} received ${ce.assignedSlotCount} performer-slot assignment${ce.assignedSlotCount === 1 ? "" : "s"}.`);
    } catch (ce) {
      fe(ce.message || "Unable to auto-assign performers.");
    } finally {
      J(!1);
    }
  }
  async function Ze() {
    O(!0), S(""), !A && (k(!0), oe());
  }
  function gt() {
    y.current = !0, O(!1), requestAnimationFrame(() => {
      var X;
      return (X = _.current) == null ? void 0 : X.focus({ preventScroll: !0 });
    });
  }
  async function ot() {
    if (!A || w || A.createCount + A.linkCount === 0)
      return;
    const X = r("materialize", -1);
    if (!X) {
      S("Wait for the current save to finish before materializing derived segments.");
      return;
    }
    try {
      await ut();
    } finally {
      X();
    }
  }
  async function ut() {
    B(!0), S("");
    let X;
    try {
      const ce = `materialize-derived:${ge.id}:${A.fingerprint}`;
      X = await ee(`/videos/${ge.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ze(ce),
          fingerprint: A.fingerprint,
          maxDepth: 3
        })
      }), qe(ce);
    } catch (ce) {
      ce.status === 409 && ae(null), S(ce.message || "Unable to materialize derived segments."), B(!1);
      return;
    }
    ae((ce) => ce && { ...ce, createCount: 0, linkCount: 0 });
    try {
      await T(), gt(), ae(null);
      const ce = X.createdCount + X.linkedCount;
      N(`${X.createdCount} derived segment${X.createdCount === 1 ? "" : "s"} created and ${X.linkedCount} existing segment${X.linkedCount === 1 ? "" : "s"} linked.`), ce === 0 && N("Every applicable derivation was already materialized.");
    } catch {
      S("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    B(!1);
  }
  async function nt(X, ce = null) {
    var ve, Ve, je, We;
    const Ne = {
      tagId: X,
      ...ce ? { tagName: ce } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (he.length > 1) {
      const Se = he.filter((xe) => xe.tagId !== X);
      if (Se.length === 0) {
        d();
        return;
      }
      const Ke = he.map((xe) => ({
        id: xe.id,
        itemId: xe.itemId,
        nativeSegmentId: xe.nativeSegmentId
      })), De = he.map((xe) => !c || xe.nativeSegmentId != null ? `native:${xe.nativeSegmentId}:${xe.updatedAt}` : `item:${xe.itemId}:${xe.revision}`).sort().join(","), we = `bulk-tag:${ge.id}:${X}:${De}`, Be = r("tag", (Y == null ? void 0 : Y.id) ?? Se[0].id);
      if (!Be) return;
      N(`Changing tag for ${Se.length} selected segment${Se.length === 1 ? "" : "s"}…`);
      const at = Qt();
      b({
        type: "add",
        entry: { id: at, op: "patch", targets: Se.map(Ht), values: Ne }
      }), d();
      try {
        const xe = c ? null : crypto.randomUUID();
        await ee(`/videos/${ge.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: ze(we),
            tagId: X,
            historyReceiptId: xe,
            segments: he.map((dt) => {
              const Ut = !c || dt.nativeSegmentId != null;
              return {
                nativeSegmentId: Ut ? dt.nativeSegmentId : null,
                itemId: Ut ? null : dt.itemId,
                expectedUpdatedAt: Ut ? dt.updatedAt : null,
                expectedRevision: Ut ? null : dt.revision
              };
            })
          })
        }), qe(we);
        const Oe = Rt(
          he,
          c
        ), Me = await T();
        b({ type: "confirm", key: at, applied: Me != null });
        const Et = Ke.map((dt) => Qe(Me == null ? void 0 : Me.segments, dt)).filter(Boolean);
        await ne(
          "segments.tag",
          `Changed tag for ${Se.length} segment${Se.length === 1 ? "" : "s"}`,
          Oe,
          Rt(Et, c),
          xe
        );
        const Xe = Ke.map((dt) => Qe(Me == null ? void 0 : Me.segments, dt)).filter(Boolean);
        te(Xe.map((dt) => dt.id)), j(((ve = Xe.find((dt) => dt.id === (Y == null ? void 0 : Y.id))) == null ? void 0 : ve.id) ?? ((Ve = Xe[0]) == null ? void 0 : Ve.id) ?? null), d(), N(`${Se.length} selected segment${Se.length === 1 ? "" : "s"} retagged.`);
      } catch (xe) {
        b({ type: "discard", key: at });
        const Oe = Ke.map((Et) => Qe(u.segments, Et)).filter(Boolean), Me = Qe(u.segments, {
          id: Y == null ? void 0 : Y.id,
          itemId: Y == null ? void 0 : Y.itemId,
          nativeSegmentId: Y == null ? void 0 : Y.nativeSegmentId
        }) || Oe[0] || null;
        te(Oe.map((Et) => Et.id)), j((Me == null ? void 0 : Me.id) ?? null), re.current = (Me == null ? void 0 : Me.id) ?? null, le.current = [], xe.status === 409 && await P(), N(xe.message || "Unable to change the selected segment tags.");
      } finally {
        Be();
      }
      return;
    }
    if (he.length !== 1 || !Y) return;
    const Ae = Si(Q, Y);
    if (Y.id === g || Ae) {
      const Se = Ae ? { segmentId: Y.id, tagId: Ae.values.tagId, tagName: Ae.meta.tagName } : null, Ke = yl(Se, Y, X, ce);
      if (Ke && !pt(Y, Ke)) {
        d();
        return;
      }
      if (Ae && (p((De) => {
        var we;
        return ((we = De.meta) == null ? void 0 : we.pendingChangeId) === Ae.id;
      }), b({ type: "discard", key: Ae.id })), Ke) {
        const De = Va(
          { ...Y, tagId: Ke.tagId },
          H,
          f,
          q,
          ie
        );
        G(De.filters), $(De.hideDerivedSegments), N("Tag change queued…");
      } else Ae && N("");
      d();
      return;
    }
    if (X === Y.tagId) {
      d();
      return;
    }
    if (Y.itemId != null && ((We = (je = U.data) == null ? void 0 : je.children) == null ? void 0 : We.length) > 0) {
      const Se = r("lineage-tag", Y.id);
      if (!Se) return;
      N("Checking lineage impact…");
      let Ke = null;
      try {
        const De = await ee(`/items/${Y.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: Y.revision, tagId: X })
        }), we = De.deletedItemIds.length > 0 || De.removedEdgeIds.length > 0;
        if (we && !window.confirm(
          `Changing this tag removes ${De.removedEdgeIds.length} lineage edge${De.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${De.deletedItemIds.length} derived segment${De.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
        )) {
          N("Tag change canceled.");
          return;
        }
        Ke = Qt(), b({
          type: "add",
          entry: { id: Ke, op: "patch", targets: [Ht(Y)], values: Ne }
        }), d();
        const Be = `tag-change:${Y.itemId}:${Y.revision}:${De.componentFingerprint}:${X}`;
        await ee(`/items/${Y.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: ze(Be),
            expectedRevision: Y.revision,
            componentFingerprint: De.componentFingerprint,
            tagId: X
          })
        }), qe(Be);
        const at = await T();
        b({ type: "confirm", key: Ke, applied: at != null }), d(), N(we ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch (De) {
        Ke && b({ type: "discard", key: Ke }), te([Y.id]), j(Y.id), re.current = Y.id, le.current = [], De.status === 409 ? (N("Lineage changed — loading the latest segments…"), await P()) : N(De.message || "Unable to reconcile the lineage.");
      } finally {
        Se();
      }
      return;
    }
    d(), await C(Y, {
      startSec: Y.startSec,
      endSec: Y.endSec,
      tagId: X
    }, !0, null, !0, Ne);
  }
  function pt(X, ce) {
    const Ne = Qt(), Ae = I(Ht(X));
    b({
      type: "add",
      entry: {
        id: Ne,
        op: "patch",
        targets: [Ae],
        values: { tagId: ce.tagId, tagName: ce.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: ce.tagName }
      }
    });
    const ve = Q.find((je) => je.op === "insert" && je.segment.id === X.id);
    return v({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [Ae],
      dependsOn: (ve == null ? void 0 : ve.taskId) ?? null,
      meta: { pendingChangeId: Ne },
      ready: (je, We) => {
        const Se = vi(je.segments, We.targets[0]);
        return !Se || bl(je, Se.id);
      },
      run: (je) => et(je, Ne, ce)
    }) ? !0 : (b({ type: "discard", key: Ne }), N("Wait for the history restore to finish."), !1);
  }
  async function et(X, ce, Ne) {
    const [Ae] = X.resolveTargets();
    if (!Ae) {
      b({ type: "discard", key: ce }), N(`The new segment was not retagged${Ne.tagName ? ` to ${Ne.tagName}` : ""}. Choose its tag again.`);
      return;
    }
    if (Ae.tagId === Ne.tagId) {
      b({ type: "discard", key: ce });
      return;
    }
    await D(Ae, {
      startSec: Ae.startSec,
      endSec: Ae.endSec,
      tagId: Ne.tagId
    }, {
      pendingChangeId: ce,
      restoreSelectionOnFailure: !1,
      onReload: X.onReload,
      onConflict: X.onConflict
    }) || N(`The new segment was not retagged${Ne.tagName ? ` to ${Ne.tagName}` : ""}. Choose its tag again.`);
  }
  async function It() {
    var We, Se, Ke, De;
    if (!l || !Y || K != null) return;
    const X = [...he].sort((we, Be) => Number(we.nativeSegmentId ?? we.id) - Number(Be.nativeSegmentId ?? Be.id)), ce = new Set(X.map((we) => we.id)), Ne = X.map((we) => `${we.nativeSegmentId ?? we.id}:${we.updatedAt}`).join("|"), Ae = r("bin", Y.id);
    if (!Ae) return;
    N(`Moving ${X.length} segment${X.length === 1 ? "" : "s"} to recycling bin…`);
    const ve = `bulk-move:${ge.id}:${Ne}`, Ve = ze(ve), je = c ? null : crypto.randomUUID();
    try {
      const we = (Oe = !1) => ee(`/videos/${ge.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ve,
          segments: X.map((Me) => ({
            segmentId: Me.nativeSegmentId ?? Me.id,
            expectedUpdatedAt: Me.updatedAt
          })),
          discardMissingImage: Oe,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: je
        })
      });
      let Be;
      try {
        Be = await we(
          co(ve)
        );
      } catch (Oe) {
        if (((We = Oe.payload) == null ? void 0 : We.code) !== "missing-image" || !window.confirm(`${Oe.message}

Continue and discard the missing image reference?`)) throw Oe;
        uo(ve), Be = await we(!0);
      }
      qe(ve), Hn();
      const at = new Map((Be.items || []).map((Oe) => [
        Number(Oe.segmentId),
        Oe
      ]));
      await ne(
        "segments.moveToBin",
        `Moved ${X.length} segment${X.length === 1 ? "" : "s"} to recycling bin`,
        Rt(X, !1),
        Rt(X.map((Oe) => {
          const Me = at.get(
            Number(Oe.nativeSegmentId ?? Oe.id)
          );
          return {
            ...Oe,
            recycleBinItemId: (Me == null ? void 0 : Me.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (Me == null ? void 0 : Me.revision) ?? null
          };
        }), !1),
        je
      );
      const xe = Zs(o, ce, Y.id);
      M((Oe) => ({
        ...Oe,
        segments: (Oe.segments || []).filter((Me) => !ce.has(Me.id))
      }), ge.id), te(xe ? [xe.id] : []), j((xe == null ? void 0 : xe.id) ?? null), re.current = (xe == null ? void 0 : xe.id) ?? null, le.current = [], xe && (W(jt(o, xe.id)), V(xe.id)), requestAnimationFrame(() => {
        var Oe;
        return (Oe = m.current) == null ? void 0 : Oe.focus({ preventScroll: !0 });
      }), N(`Moved ${X.length} segment${X.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (we) {
      const Be = ((Se = we.payload) == null ? void 0 : Se.code) || ((De = (Ke = we.payload) == null ? void 0 : Ke.result) == null ? void 0 : De.code);
      we.status === 409 && Be === "CANONICAL_SEGMENT_CHANGED" ? await P() : N(we.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Ae();
    }
  }
  async function Ct() {
    if (!(c || s.current || K != null)) {
      s.current = !0, N("Checking the recycling bin…");
      try {
        const X = await ee("/bin"), ce = await di(X, () => N("Emptying the recycling bin…"));
        if (ce.status === "empty") {
          N("The recycling bin is empty.");
          return;
        }
        if (ce.status === "canceled") {
          N("The recycling bin was not emptied.");
          return;
        }
        N(`${ce.segmentCount} segment${ce.segmentCount === 1 ? "" : "s"} from ${ce.sceneCount} scene${ce.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (X) {
        N(X.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: Fe, removeIncorrectExample: Ie, captureTrainingExport: Ue, deleteRejectedSegments: Ee, autoAssignPerformers: Je, previewDerivedSegments: Ze, closeMaterializeDialog: gt, materializeDerivedSegments: ot, saveTag: nt, moveToBin: It, emptyRecyclingBin: Ct };
}
function Cc(e) {
  const { acceptHistory: t, acquireSaveLock: r, enqueueSave: o, getSaveQueueSnapshot: i, commonActionsRef: a, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: g, history: u, historyRef: f, historySaving: m, horizontalLayoutSize: p, mediaStackHeight: b, mediaStackRef: v, onDetailChange: I, onReload: x, railToggleRef: q, recordHistoryAction: L, savingSegmentId: U, setCollapsedSegmentGroups: _, setEditorLayout: A, setHistorySaving: y, setIncorrectExamples: w, setSaveMessage: C, shotBoundaries: D, timelineDuration: Q, video: P, workspaceRef: M } = e;
  async function T($, h, S) {
    var B, z, me, N;
    const k = $.type === "segment" ? [$] : $.segments || [], O = (h == null ? void 0 : h.type) === "segment" ? [h] : (h == null ? void 0 : h.segments) || [];
    let ae = S;
    for (const [W, j] of k.entries()) {
      const te = O[W], ge = ((B = j.identity) == null ? void 0 : B.nativeSegmentId) != null || ((z = j.identity) == null ? void 0 : z.published) === !0, Fe = ((me = te == null ? void 0 : te.identity) == null ? void 0 : me.recycleBinItemId) ?? ((N = te == null ? void 0 : te.identity) == null ? void 0 : N.itemId);
      let Ie = Qe(ae.segments, te == null ? void 0 : te.identity) || Qe(ae.segments, j.identity);
      if (!Ie && ge && Fe != null && te.identity.revision != null) {
        const Ee = `history-restore:${P.id}:${Fe}:${te.identity.revision}`;
        await ee(`/bin/${Fe}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: ze(Ee),
            expectedRevision: te.identity.revision
          })
        }), qe(Ee), ae = await x(), Ie = ae.segments.find((Je) => Je.tagId === j.values.tagId && Je.startSec === j.values.startSec && Je.endSec === j.values.endSec);
      }
      if (!Ie)
        throw new Error("A segment in this history state no longer exists.");
      if ((Ie.nativeSegmentId != null || Ie.published === !0) !== ge) {
        if (ge) {
          const Ee = Ie.recycleBinItemId ?? Ie.itemId ?? Fe;
          if (Ee == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Je = `history-restore:${P.id}:${Ee}:${Ie.revision}:${j.values.reviewState ?? "native"}`;
          await ee(`/bin/${Ee}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: ze(Je),
              expectedRevision: Ie.revision
            })
          }), qe(Je);
        } else {
          const Ee = `history-bin:${P.id}:${Ie.nativeSegmentId}:${Ie.updatedAt}:${j.values.reviewState}`;
          await ee(`/videos/${P.id}/segments/${Ie.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: ze(Ee),
              expectedUpdatedAt: Ie.updatedAt,
              reviewState: j.values.reviewState
            })
          }), qe(Ee);
        }
        if (ae = await x(), !ge)
          continue;
        if (Ie = Qe(ae.segments, j.identity) || ae.segments.find((Ee) => Ee.tagId === j.values.tagId && Ee.startSec === j.values.startSec && Ee.endSec === j.values.endSec), !Ie)
          throw new Error("The restored segment could not be found.");
      }
      const Ue = j.values;
      if (Ie.nativeSegmentId == null && Ie.itemId != null) {
        const Ee = `history-draft-update:${P.id}:${Ie.itemId}:${Ie.revision}:${Ue.tagId}:${Ue.startSec}:${Ue.endSec ?? "open"}:${Ue.reviewState}`;
        await ee(`/videos/${P.id}/drafts/${Ie.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: ze(Ee),
            expectedRevision: Ie.revision,
            ...Ue
          })
        }), qe(Ee);
      } else
        await ee(`/videos/${P.id}/segments/${Ie.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Ue, expectedUpdatedAt: Ie.updatedAt })
        });
      ae = await x();
    }
    return ae;
  }
  async function H($, h) {
    var S;
    for (const k of $.targets || []) {
      const O = Qe(h.segments, k.identity);
      if (!O)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const ae = (S = h.performerSlotRevisions) == null ? void 0 : S[O.id];
      await ee(O.published ? `/videos/${P.id}/segments/${O.nativeSegmentId}/slots` : `/videos/${P.id}/drafts/${O.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: ae,
          assignments: k.assignments
        })
      }), h = await x();
    }
    return h;
  }
  async function ne($, h, S) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let k = h, O = await ee(`/videos/${P.id}/incorrect-examples`);
    const ae = (B) => O.find((z) => {
      var me;
      return z.id === B.exampleId || ((me = B.collectedIdentity) == null ? void 0 : me.itemId) != null && z.itemId === B.collectedIdentity.itemId;
    });
    for (const [B, z] of ($.entries || []).entries()) {
      const me = `history-feedback:${P.id}:${S.action.sequence}:${S.direction}:${B}`, N = ae(z);
      if ($.collected && N) {
        qe(me);
        continue;
      }
      let W;
      if ($.collected) {
        const j = Qe(
          k.segments,
          z.collectedIdentity
        ) || Qe(
          k.segments,
          z.originalIdentity
        );
        if (!j)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const te = j.nativeSegmentId != null;
        W = await ee(`/videos/${P.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: ze(me),
            nativeSegmentId: te ? j.nativeSegmentId : null,
            itemId: te ? null : j.itemId,
            expectedUpdatedAt: te ? j.updatedAt : null,
            expectedRevision: te ? null : j.revision
          })
        });
      } else {
        if (!N) {
          qe(me);
          continue;
        }
        W = await ee(
          `/videos/${P.id}/incorrect-examples/${N.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: ze(me),
              expectedExampleRevision: N.revision,
              expectedRepresentationRevision: N.representationRevision
            })
          }
        );
      }
      qe(me), k = fr(
        k,
        W.editorDelta
      ), O = await ee(
        `/videos/${P.id}/incorrect-examples`
      );
    }
    return w(O), k;
  }
  async function oe($, h, S = []) {
    const k = $.state;
    if (!s && ((k == null ? void 0 : k.type) === "segment" || (k == null ? void 0 : k.type) === "segments")) {
      const ae = `basic-history:${P.id}:${f.current.revision}:${$.action.sequence}:${$.direction}`, B = await ee(`/videos/${P.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ze(ae),
          expectedHistoryRevision: f.current.revision,
          actionSequence: $.action.sequence,
          direction: $.direction
        })
      });
      return t(B.history), S.push(ae), x();
    }
    const O = $.direction === "backward" ? $.action.afterState : $.action.beforeState;
    if ((k == null ? void 0 : k.type) === "composite") {
      let ae = h;
      const B = (O == null ? void 0 : O.type) === "composite" ? O.states || [] : [];
      for (const [z, me] of (k.states || []).entries()) {
        const N = B[z];
        ae = await oe({
          ...$,
          state: me,
          action: {
            ...$.action,
            beforeState: $.direction === "backward" ? me : N,
            afterState: $.direction === "backward" ? N : me
          }
        }, ae, S);
      }
      return ae;
    }
    if ((k == null ? void 0 : k.type) === "segment" || (k == null ? void 0 : k.type) === "segments")
      return T(
        k,
        O,
        h
      );
    if ((k == null ? void 0 : k.type) === "performerSlots")
      return H(k, h);
    if ((k == null ? void 0 : k.type) === "incorrectExamples")
      return ne(k, h, $);
    if ((k == null ? void 0 : k.type) === "shots") {
      const ae = qn(h.shotBoundaries || []), B = await ee(`/videos/${P.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ze(`history-shots:${P.id}:${ae}:${k.fingerprint}`),
          expectedFingerprint: ae,
          boundaries: k.boundaries
        })
      });
      return { ...h, shotBoundaries: B };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function Te($) {
    if (m || U != null || $ === u.cursorSequence || la(u, $).length === 0) return;
    const S = o({
      kind: "history",
      lockId: -1,
      exclusive: !0,
      run: (k) => V(k.detail, $)
    });
    if (!S) {
      C("Finish the pending saves before restoring history.");
      return;
    }
    await S.done;
  }
  async function V($, h) {
    var k;
    const S = la(f.current, h);
    if (S.length !== 0) {
      y(!0), C(`Restoring ${S.length} history ${S.length === 1 ? "action" : "actions"}…`);
      try {
        let O = $;
        const ae = [];
        for (const z of S)
          O = await oe(
            z,
            O,
            ae
          );
        const B = s ? await ee(`/videos/${P.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: f.current.revision,
            targetSequence: h
          })
        }) : f.current;
        ae.forEach(qe), t(B), await x(), C("History restored.");
      } catch (O) {
        O.status === 409 && ((k = O.payload) != null && k.current) && t(O.payload.current), await x(), C(O.message || "Unable to restore editor history.");
      } finally {
        y(!1);
      }
    }
  }
  function K($) {
    A((h) => ({ ...h, timelineRatio: so($, b) }));
  }
  function ie($) {
    var k, O;
    const h = (k = v.current) == null ? void 0 : k.getBoundingClientRect();
    if (!h) return;
    const S = ((O = a.current) == null ? void 0 : O.offsetHeight) || 0;
    K(Fs(
      $.clientY,
      h.top + S,
      Math.max(0, h.height - S)
    ));
  }
  function ue($) {
    $.currentTarget.setPointerCapture($.pointerId), ie($);
  }
  function Y($) {
    $.currentTarget.hasPointerCapture($.pointerId) && ie($);
  }
  function ke($) {
    const h = $.shiftKey ? 0.1 : 0.05;
    let S = null;
    $.key === "ArrowUp" && (S = c.timelineRatio + h), $.key === "ArrowDown" && (S = c.timelineRatio - h);
    const k = io(b);
    $.key === "Home" && (S = k.minimum), $.key === "End" && (S = k.maximum), S != null && ($.preventDefault(), $.stopPropagation(), K(S));
  }
  function he($) {
    const h = $ === "detailWidth" ? p.focusRow : p.workspace, S = p.workspace > 0 ? Yr(p.workspace, 600) : 560, k = an(c.markerRailWidth, S), O = $ === "detailWidth" ? 344 + (c.markerRailOpen ? k + 24 : 0) : 600;
    return h > 0 ? Yr(h, O) : 560;
  }
  function re($, h) {
    A((S) => ({ ...S, [$]: an(h, he($)) }));
  }
  function le($, h) {
    var k, O;
    const S = h === "detailWidth" ? (k = g.current) == null ? void 0 : k.getBoundingClientRect() : (O = M.current) == null ? void 0 : O.getBoundingClientRect();
    S && re(h, h === "detailWidth" ? $.clientX - S.left : S.right - $.clientX);
  }
  function fe($, h) {
    const S = he($), k = an(c[$], S);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": h,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(S),
      "aria-valuenow": Math.round(k),
      "aria-valuetext": `${Math.round(k)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (O) => {
        O.currentTarget.setPointerCapture(O.pointerId), le(O, $);
      },
      onPointerMove: (O) => {
        O.currentTarget.hasPointerCapture(O.pointerId) && le(O, $);
      },
      onKeyDown: (O) => {
        const ae = O.shiftKey ? 40 : 16;
        let B = null;
        O.key === "ArrowLeft" && (B = $ === "detailWidth" ? -ae : ae), O.key === "ArrowRight" && (B = $ === "detailWidth" ? ae : -ae);
        let z = B == null ? null : k + B;
        O.key === "Home" && (z = 240), O.key === "End" && (z = S), z != null && (O.preventDefault(), O.stopPropagation(), re($, z));
      },
      onDoubleClick: () => re($, wt[$]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function Z() {
    A(($) => ({ ...$, markerRailOpen: !$.markerRailOpen })), requestAnimationFrame(() => {
      var $;
      return ($ = q.current) == null ? void 0 : $.focus({ preventScroll: !0 });
    });
  }
  function J($) {
    _((h) => h.includes($) ? h.filter((S) => S !== $) : tn([...h, $]));
  }
  function G($, h = !0, S = l) {
    const k = i().running != null, O = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (ae) => se(ae.detail, $, h, S)
    });
    return O ? (k && C($ === "split" ? "Shot boundary queued…" : "Shot merge queued…"), O.done.then((ae) => ae.value ?? null)) : (C("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function se($, h, S, k) {
    var me;
    const O = ($ == null ? void 0 : $.shotBoundaries) || [], ae = Number((me = P.videoFile) == null ? void 0 : me.duration) || Q, B = qn(O), z = `shot-${h}:${P.id}:${k.toFixed(3)}:${ae.toFixed(3)}:${B}`;
    C(h === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const N = await ee(`/videos/${P.id}/shot-boundaries/${h}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: ze(z), timeSec: k })
      });
      return qe(z), I((W) => ({ ...W, shotBoundaries: N }), P.id), S && await L(
        "shots.update",
        h === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: O,
          fingerprint: B
        },
        {
          type: "shots",
          boundaries: N,
          fingerprint: qn(N)
        }
      ), C(h === "split" ? "Shot boundary added." : "Shots merged."), N;
    } catch (N) {
      return C(N.message || "Unable to edit shot boundaries."), null;
    }
  }
  return { applySegmentHistoryState: T, applyPerformerSlotHistoryState: H, applyHistoryState: oe, restoreHistoryTarget: Te, updateTimelineRatio: K, updateTimelineRatioFromPointer: ie, handleSeparatorPointerDown: ue, handleSeparatorPointerMove: Y, handleSeparatorKeyDown: ke, panelWidthMaximum: he, updatePanelWidth: re, handlePanelSeparatorPointer: le, panelSeparatorProps: fe, toggleSegmentRail: Z, toggleSegmentGroup: J, mutateShotBoundary: G };
}
function $c(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: u, lineage: f, mediaDuration: m, mergeSelectedSwimlane: p, moveToBin: b, mutateShotBoundary: v, openPublishApprovedDialog: I, playbackControlsRef: x, playbackShortcutConfig: q, saveSelectedReviewState: L, seekRef: U, segmentGroupKeys: _, selectSegment: A, selectedSegment: y, selectedSegmentGroupForSegment: w, selectedSegmentGroupKey: C, selectedSegments: D, setCollapsedSegmentGroups: Q, setIncorrectExamplesOpen: P, setQuickSearchOpen: M, setSaveMessage: T, setSelectedSegmentGroupKey: H, setTagEditing: ne, setTimelineZoom: oe, shotBoundaries: Te, slotButtonRef: V, splitSegment: K, swimlanes: ie, timelineDuration: ue, toggleIncorrectExample: Y, toggleSegmentGroup: ke, updateTimelineRatio: he, videoFrameRate: re, visibleSegments: le } = e;
  function fe(G) {
    var se, $;
    (se = x.current) == null || se.pause(), ($ = x.current) == null || $.seekBy(xl(G, re));
  }
  function Z(G, se) {
    if (D.length > 1 && ol(G.id))
      return;
    let $ = null;
    G.id === "video.playPause" && ($ = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.toggle();
    }), G.id === "video.seekSmallBackward" && ($ = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(-q.smallSeekTime);
    }), G.id === "video.seekSmallForward" && ($ = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(q.smallSeekTime);
    }), G.id === "video.seekMediumBackward" && ($ = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(-q.mediumSeekTime);
    }), G.id === "video.seekMediumForward" && ($ = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(q.mediumSeekTime);
    }), G.id === "video.seekLongBackward" && ($ = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(-q.longSeekTime);
    }), G.id === "video.seekLongForward" && ($ = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(q.longSeekTime);
    }), G.id === "video.playSelected" && y && ($ = () => {
      var h;
      (h = U.current) == null || h.call(U, y.startSec, !0), requestAnimationFrame(() => {
        var S;
        return (S = g.current) == null ? void 0 : S.focus({ preventScroll: !0 });
      });
    }), (G.id === "video.playPreviousSegment" || G.id === "video.playNextSegment") && ($ = () => {
      var S;
      const h = to(
        ie,
        y == null ? void 0 : y.id,
        G.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !h || h.id === (y == null ? void 0 : y.id) || (A(h, { focusEditor: !0, seekToSegment: !1 }), (S = U.current) == null || S.call(U, h.startSec, !0));
    }), G.id.startsWith("video.seekPercent") && ($ = () => {
      var S;
      const h = Number(G.id.slice(17)) / 10;
      (S = U.current) == null || S.call(U, el(m ?? ue, h), !1);
    }), G.id === "video.jumpToSegmentStart" && y && ($ = () => {
      var h;
      return (h = U.current) == null ? void 0 : h.call(U, y.startSec, !1);
    }), G.id === "video.jumpToSegmentEnd" && y && ($ = () => {
      var h;
      return (h = U.current) == null ? void 0 : h.call(U, y.endSec ?? y.startSec, !1);
    }), G.id === "video.jumpToVideoStart" && ($ = () => {
      var h;
      return (h = U.current) == null ? void 0 : h.call(U, 0, !1);
    }), G.id === "video.jumpToVideoEnd" && ($ = () => {
      var h;
      return (h = U.current) == null ? void 0 : h.call(U, ue, !1);
    }), G.id.startsWith("video.frame") && ($ = () => {
      const h = G.id.includes("Small") ? "small" : G.id.includes("Medium") ? "medium" : "long", S = q[`${h}FrameStep`] * (G.id.endsWith("Backward") ? -1 : 1);
      fe(S);
    }), G.id.startsWith("navigation.swimlane") && ($ = () => {
      const h = G.id.slice(19).toLowerCase(), S = to(ie, y == null ? void 0 : y.id, h, s);
      S && A(S, { focusEditor: !0, seekToSegment: !1 });
    }), (G.id === "navigation.extendSwimlaneLeft" || G.id === "navigation.extendSwimlaneRight") && ($ = () => {
      const h = yd(
        t,
        y == null ? void 0 : y.id,
        G.id.endsWith("Left") ? "left" : "right"
      );
      h && A(h.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: h.segmentIds
      });
    }), (G.id === "navigation.segmentGroupUp" || G.id === "navigation.segmentGroupDown") && ($ = () => {
      const h = bd(
        _,
        C ?? w,
        G.id.endsWith("Up") ? -1 : 1
      );
      h && H(h);
    }), (G.id === "navigation.previousAtPlayhead" || G.id === "navigation.nextAtPlayhead") && ($ = () => {
      const h = js(le, s, G.id === "navigation.previousAtPlayhead" ? -1 : 1, y == null ? void 0 : y.id);
      h && A(h, { focusEditor: !0, seekToSegment: !1 });
    }), G.id === "navigation.nearestInCurrentSwimlane" && ($ = () => {
      const h = $s(
        ie,
        y == null ? void 0 : y.id,
        s
      );
      h && A(h, { focusEditor: !0, seekToSegment: !1 });
    }), G.id.includes("Unreviewed") && ($ = () => {
      const h = br(
        ie,
        y == null ? void 0 : y.id,
        G.id.startsWith("navigation.previous") ? -1 : 1,
        G.id.endsWith("Global")
      );
      h && A(h, { focusEditor: !se.preserveFocus, seekToSegment: !1 });
    }), (G.id === "navigation.nextTouchingPlayhead" || G.id === "navigation.previousTouchingPlayhead") && ($ = () => {
      const h = Cs(ie, s, G.id === "navigation.previousTouchingPlayhead" ? -1 : 1, y == null ? void 0 : y.id);
      h && A(h, { focusEditor: !0, seekToSegment: !1 });
    }), G.id === "navigation.quickSearch" && ($ = () => M(!0)), (G.id === "navigation.previousShot" || G.id === "navigation.nextShot") && ($ = () => {
      var S;
      const h = vl(Te, s, G.id === "navigation.previousShot" ? -1 : 1);
      h && ((S = U.current) == null || S.call(U, h.startSec, !1));
    }), G.id === "shot.split" && ($ = () => v("split")), G.id === "shot.merge" && ($ = () => v("merge")), G.id === "marker.create" && ($ = () => a()), G.id === "marker.duplicate" && ($ = () => d(!1)), G.id === "marker.duplicateAtPlayhead" && ($ = () => d(!0)), G.id === "marker.split" && ($ = () => K()), G.id === "marker.editTag" && ($ = () => {
      var h;
      if (D.length > 1 && D.some((S) => S.isDerived)) {
        T("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((h = f.data) != null && h.tagReadOnly) {
        T("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      ne(!0);
    }), G.id === "marker.setStart" && y && ($ = () => r(s, y.endSec)), G.id === "marker.setEnd" && y && ($ = () => r(y.startSec, s)), G.id === "marker.copyTiming" && y && ($ = () => {
      T(_d(y) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), G.id === "marker.pasteTiming" && y && ($ = () => {
      const h = Hd();
      if (!h) {
        T("No copied segment timing is available.");
        return;
      }
      r(h.startSec, h.endSec);
    }), G.id === "marker.mergeSelection" && ($ = () => p()), G.id === "marker.moveToBin" && ($ = () => b()), G.id === "marker.toggleIncorrectExample" && y && ($ = () => Y()), G.id === "marker.openIncorrectExamples" && ($ = () => P(!0)), G.id === "markerGroup.toggleCollapse" && C && ($ = () => ke(C)), G.id === "markerGroup.toggleAll" && ($ = () => Q((h) => fd(h, _))), G.id === "marker.assignSlots" && ($ = () => {
      var h;
      return (h = V.current) == null ? void 0 : h.click();
    }), G.id === "navigation.zoomIn" && ($ = () => oe((h) => hr(h + 0.5))), G.id === "navigation.zoomOut" && ($ = () => oe((h) => hr(h - 0.5))), G.id === "navigation.resetZoom" && ($ = () => oe(1)), G.id === "navigation.centerPlayhead" && ($ = () => {
      var h;
      return (h = o.current) == null ? void 0 : h.call(o);
    }), G.id === "layout.growSwimlanes" && ($ = () => he(c.timelineRatio + 0.05)), G.id === "layout.shrinkSwimlanes" && ($ = () => he(c.timelineRatio - 0.05)), G.id === "marker.confirm" && y && ($ = () => L("approved")), G.id === "system.publishApproved" && ($ = () => I(se.target)), G.id === "marker.reject" && y && ($ = () => L("rejected")), G.id === "system.emptyBin" && ($ = () => u()), G.id === "system.deleteRejected" && ($ = () => l()), $ && $();
  }
  function J(G, se) {
    const $ = Yn.find((h) => h.id === G);
    $ && An($, i) && Z($, se);
  }
  return {
    executeShortcutById: J,
    stepVideoFrame: (G) => fe(G < 0 ? -1 : 1)
  };
}
function Sa(e) {
  return e === !0;
}
function ka() {
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
function Tc(e, t, r = !1, o = 0, i = "", a = () => () => {
}) {
  const [s, l] = F(null), [d, c] = F(null), [g, u] = F(""), [f, m] = F({
    busy: !1,
    reviewState: null,
    error: ""
  }), p = ye(null);
  async function b(x) {
    const q = a("import", -1);
    if (!q) {
      m({ busy: !1, reviewState: null, error: "Wait for the current save to finish before importing Cove segments." });
      return;
    }
    m({ busy: !0, reviewState: x, error: "" });
    try {
      await ee(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: eo(), reviewState: x })
      }), await t(), m({ busy: !1, reviewState: null, error: "" });
    } catch (L) {
      m({
        busy: !1,
        reviewState: null,
        error: L.message || "Unable to import Cove segments."
      });
    } finally {
      q();
    }
  }
  async function v(x) {
    try {
      const q = await ee(`/videos/${e}/analysis-runs`, {
        signal: x.signal
      });
      if (!x.isActive()) return null;
      const L = (q == null ? void 0 : q[0]) || null;
      return l(L), (L == null ? void 0 : L.status) === "completed" && p.current !== L.id && (p.current = L.id, await t()), ((L == null ? void 0 : L.status) === "failed" || (L == null ? void 0 : L.status) === "cancelled") && u(L.errorMessage || "Video analysis did not complete."), L;
    } catch (q) {
      return x.isActive() && q.name !== "AbortError" && u(q.message || "Unable to load video analysis status."), null;
    }
  }
  async function I(x = null) {
    u("");
    const q = x || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), L = q.includes("omnishotcut") && o > 0;
    if (!(L && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const U = await ee(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: q,
            replaceShotBoundaries: L,
            expectedShotBoundaryFingerprint: L ? i : null
          })
        });
        l(U);
      } catch (U) {
        u(U.message || "Unable to start video analysis.");
      }
  }
  return be(() => {
    if (!Sa(r)) {
      l(null), c(null), u("");
      return;
    }
    const x = ka();
    return v(x), ee("/analysis/status", { signal: x.signal }).then((q) => {
      x.isActive() && (c(q), q.configured || u(""));
    }).catch((q) => {
      x.isActive() && q.name !== "AbortError" && u(q.message || "Unable to check video analysis readiness.");
    }), x.dispose;
  }, [e, r]), be(() => {
    if (!Sa(r) || (s == null ? void 0 : s.status) !== "queued" && (s == null ? void 0 : s.status) !== "running") return;
    const x = ka();
    let q = setTimeout(async function L() {
      await v(x), x.isActive() && (q = setTimeout(L, 2500));
    }, 2500);
    return () => {
      clearTimeout(q), x.dispose();
    };
  }, [s == null ? void 0 : s.id, s == null ? void 0 : s.status, r]), {
    analysisError: g,
    analysisRun: s,
    analysisStatus: d,
    importNativeSegments: b,
    nativeImportState: f,
    startFullAnalysis: I
  };
}
const zn = Object.freeze([]);
function Ac(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Rc({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var Oo, Lo, Fo, jo, Bo;
  const [g, u] = F(null), [f, m] = F([]), p = ye(null), b = ye(null), v = ye([]), I = ye(null), [x, q] = F(() => Mt({})), [L, U] = F(!1), [_, A] = F(tl), [y, w] = F(0), C = ye(null), [D] = F(() => Ad({
    getContext: () => C.current,
    drainAfterSettle: !1
  })), Q = jl(D.subscribe, D.getSnapshot), P = xi(Q), M = (E, de) => D.acquire({ kind: E, lockId: de }), T = (E) => D.enqueue(E), H = (E) => D.stableIdentity(E), ne = ye(!1);
  be(() => (ne.current = !0, () => {
    ne.current = !1, queueMicrotask(() => {
      ne.current || D.dispose();
    });
  }), []);
  const oe = (E) => D.cancel(E), Te = (E, de) => D.retarget(E, de), V = D.getSnapshot, [K, ie] = Fl(Fd, []), [ue, Y] = F(""), [ke, he] = F(""), [re, le] = F(""), [fe, Z] = F(1), [J, G] = F(Ud), [se, $] = F(0), [h, S] = F({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [k, O] = F(Jt), ae = ye(Jt), [B, z] = F(!1), [me, N] = F(!1), [W, j] = F(!1), te = ye(!1);
  te.current = W;
  const [ge, Fe] = F(null), [Ie, Ge] = F(!1), [Ue, Ee] = F(null), [Je, yt] = F(null), Ze = ye(null), [gt, ot] = F(!1), [ut, nt] = F(""), pt = ye(null), et = ye(null), It = ye(!1), [Ct, X] = F(Kd), [ce, Ne] = F(null), [Ae, ve] = F(!1), [Ve, je] = F(!1), [We, Se] = F(!1), [Ke, De] = F(!1), [we, Be] = F(!1), [at, xe] = F(""), {
    analysisError: Oe,
    analysisRun: Me,
    analysisStatus: Et,
    importNativeSegments: Xe,
    nativeImportState: dt,
    startFullAnalysis: Ut
  } = Tc(
    e.video.id,
    o,
    l,
    ((Oo = e.shotBoundaries) == null ? void 0 : Oo.length) || 0,
    qn(e.shotBoundaries || []),
    (E, de) => D.acquire({ kind: E, lockId: de })
  ), [Ye, Ce] = F(!1), [$e, _e] = F(null), [ct, it] = F(l), [Dt, kt] = F(0), [Pt, cn] = F(!1), [Ot, nn] = F(""), [Zn, rn] = F(null), En = ye(null), Xn = ye(null), un = ye(!1), [Zt, mn] = F([]), [er, Cr] = F(!1), [tr, $r] = F(null), gn = Bd(), pn = ye(null), Dn = ye(null), fn = ye(null), Tr = ye(s), nr = ye(null), yn = ye(null), on = ye(null), bn = ye(null), Pn = ye(null), ht = ye(null), rr = ye(null), On = ye(null), Kt = ye(null), or = ye(null), hn = ye(null), vn = ye(null), Ar = ye(-1e12), Rr = ye(null), Ln = ye(null), [xn, Fn] = F({ scrollTop: 0, height: 512 });
  be(() => {
    if (!Ye || Pt || !Ot) return;
    const E = requestAnimationFrame(() => {
      var de;
      return (de = Xn.current) == null ? void 0 : de.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(E);
  }, [Ye, Pt, Ot]), be(() => {
    if (!un.current || Ye || ct) return;
    const E = requestAnimationFrame(() => {
      var de;
      (de = En.current) == null || de.focus({ preventScroll: !0 }), un.current = !1;
    });
    return () => cancelAnimationFrame(E);
  }, [Ye, ct]);
  const tt = e.video, bt = e.segments || zn, Mr = He(() => JSON.stringify({
    segments: bt.map((E) => [
      E.id,
      E.itemId,
      E.nativeSegmentId,
      E.tagId,
      E.startSec,
      E.endSec,
      E.reviewState,
      E.published,
      E.sourceKey,
      E.sourceRunId,
      E.confidence,
      E.revision,
      E.updatedAt
    ]),
    performerSlots: (e.performerSlots || zn).map((E) => [
      E.segmentId,
      E.slotDefinitionId,
      E.performerId,
      E.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [bt, e.performerSlots, e.itemMetadata]);
  be(() => {
    if (!l) {
      _e(null), it(!1);
      return;
    }
    if (P != null) {
      it(!0);
      return;
    }
    let E = !0;
    it(!0);
    const de = setTimeout(() => {
      ee(`/videos/${tt.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Le) => {
        E && (_e(Le), nn(""));
      }).catch((Le) => {
        E && (_e(null), nn(Le.message || "Unable to preview derived segments."));
      }).finally(() => {
        E && it(!1);
      });
    }, 150);
    return () => {
      E = !1, clearTimeout(de);
    };
  }, [l, tt.id, Mr, Dt, P]);
  const mt = () => kt((E) => E + 1), $t = e.segmentGroups || zn, Tt = e.performerSlots || zn, Er = l && e.performerSlotsAvailable !== !1, Sn = He(
    () => (e.performerCandidates || []).filter((E) => E.isVideoPerformer),
    [e.performerCandidates]
  ), Wt = e.shotBoundaries || zn, jn = He(
    () => pi(Tt),
    [Tt]
  ), Bn = He(
    () => bt.map((E) => {
      const de = jn.get(E.id) || [];
      return {
        ...E,
        slots: de,
        assignment: de.every((Le) => Le.performerId == null) ? El(de, Sn) : null
      };
    }).filter((E) => E.slots.length > 0 && E.assignment != null),
    [bt, jn, Sn]
  ), ar = Number((Lo = tt.videoFile) == null ? void 0 : Lo.frameRate) > 0 ? Number(tt.videoFile.frameRate) : 30;
  function kn() {
    const E = te.current;
    j(!1), E && requestAnimationFrame(() => {
      var de;
      return (de = ht.current) == null ? void 0 : de.focus({ preventScroll: !0 });
    });
  }
  function Gn() {
    P == null && (vn.current = null, Ge(!1), Y(""), requestAnimationFrame(() => {
      var E;
      return (E = ht.current) == null ? void 0 : E.focus({ preventScroll: !0 });
    }));
  }
  function zt() {
    U(!1), requestAnimationFrame(() => {
      var E, de;
      (E = On.current) != null && E.isConnected ? On.current.focus({ preventScroll: !0 }) : (de = ht.current) == null || de.focus({ preventScroll: !0 });
    });
  }
  be(() => {
    hn.current === g ? (hn.current = null, j(!0)) : j(!1);
  }, [g]), be(() => {
    var de;
    if (!W) return;
    const E = (de = or.current) == null ? void 0 : de.querySelector("input");
    document.activeElement !== E && (E == null || E.focus({ preventScroll: !0 }), E == null || E.select());
  }, [W, g]), be(() => {
    var de;
    if (W) return;
    const E = (de = ht.current) == null ? void 0 : de.ownerDocument;
    E && E.activeElement === E.body && ht.current.focus({ preventScroll: !0 });
  }, [W]), be(() => {
    var Le, st, Ft;
    const E = sn(
      zr(
        e.segments,
        e.performerSlots || [],
        Mt({}),
        l && _,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), de = ((Le = e.segments.find((Cn) => Cn.id === s)) == null ? void 0 : Le.id) ?? ((st = qa(E)) == null ? void 0 : st.id) ?? null;
    u(de), m(de == null ? [] : [de]), b.current = de, v.current = [], Ne(jt(E, de)), q(Mt({})), U(!1), vn.current = null, Ge(!1), Z(1), Y(""), O(Jt), ae.current = Jt, z(!1), (Ft = ht.current) == null || Ft.focus({ preventScroll: !0 });
  }, [tt.id, s]), be(() => {
    const E = new AbortController();
    return ee(`/videos/${tt.id}/incorrect-examples`, { signal: E.signal }).then(mn).catch((de) => {
      de.name !== "AbortError" && mn([]);
    }), () => E.abort();
  }, [tt.id, d == null ? void 0 : d.effectiveMode]), be(() => {
    const E = new AbortController();
    return ee(`/videos/${tt.id}/history`, { signal: E.signal }).then((de) => {
      const Le = de || Jt;
      ae.current = Le, O(Le);
    }).catch((de) => {
      de.name !== "AbortError" && Y(de.message || "Unable to load editor history.");
    }), () => E.abort();
  }, [tt.id]), be(() => {
    qd(J);
  }, [J.timelineRatio, J.markerRailOpen, J.detailWidth, J.markerRailWidth, J.swimlaneTitleWidth]), be(() => {
    zd(Ct);
  }, [Ct]), be(() => {
    nl(_);
  }, [_]), be(() => {
    const E = yn.current;
    if (!a || !E || typeof ResizeObserver > "u") return;
    const de = () => {
      var Ft;
      const st = Math.max(0, E.clientHeight - (((Ft = on.current) == null ? void 0 : Ft.offsetHeight) || 0));
      $(st), G((Cn) => {
        const Go = so(Cn.timelineRatio, st);
        return Go === Cn.timelineRatio ? Cn : { ...Cn, timelineRatio: Go };
      });
    }, Le = new ResizeObserver(de);
    return Le.observe(E), on.current && Le.observe(on.current), de(), () => Le.disconnect();
  }, [a]), be(() => {
    if (!gn || typeof ResizeObserver > "u") return;
    const E = Pn.current, de = bn.current;
    if (!E || !de) return;
    const Le = () => S({
      workspace: E.clientWidth,
      focusRow: de.clientWidth,
      focusRowHeight: de.clientHeight
    }), st = new ResizeObserver(Le);
    return st.observe(E), st.observe(de), Le(), () => st.disconnect();
  }, [gn, J.markerRailOpen]);
  const At = He(
    () => Od(bt, K),
    [bt, K]
  );
  ia(() => {
    Ii(K, e) !== K && ie({ type: "prune", detail: e });
  }, [e, K]);
  const Lt = He(
    () => ma(
      zr(
        At,
        Tt,
        x,
        l && _,
        $t
      ),
      Zt,
      !0
    ),
    [
      At,
      Tt,
      x,
      _,
      $t,
      l,
      Zt
    ]
  ), Dr = Object.fromEntries(xt.map((E) => [E, Lt.filter((de) => de.reviewState === E).length])), Pr = ma(
    zr(
      At,
      Tt,
      { ...x, reviewStates: xt },
      l && _,
      $t
    ),
    Zt,
    !0
  ), Or = Object.fromEntries(xt.map((E) => [E, Pr.filter((de) => de.reviewState === E).length])), Lr = [...new Set(At.map((E) => E.sourceKey).filter(Boolean))].sort((E, de) => Gt(E).localeCompare(Gt(de))), wn = zs(
    x,
    l && _
  ), ft = He(
    () => sn(Lt, $t, Tt),
    [Lt, $t, Tt]
  ), R = _s(
    ft,
    g,
    s
  ), Pe = He(() => {
    const E = Dd(K);
    return E.length === 0 ? bt : [...bt, ...E];
  }, [bt, K]), pe = R == null ? null : Pe.find((E) => E.id === R.id) || R, rt = Vo(Pe, Vo(Lt, f).map((E) => E.id)), Vt = !l && rt.length > 0 && rt.every((E) => E.nativeSegmentId != null), qt = Lt.map((E) => E.id), Fr = qt.join("|");
  p.current = (pe == null ? void 0 : pe.id) ?? null;
  const vo = jn.get(pe == null ? void 0 : pe.id) || [], Mi = po(vo), xo = He(
    () => md(ft, f),
    [ft, f]
  ), jr = He(() => fo(ft), [ft]), Un = He(
    () => cd(jr, Ct),
    [jr, Ct]
  ), Ei = He(
    () => fi(
      Un.rows,
      xn.scrollTop,
      xn.height
    ),
    [Un, xn]
  ), Br = He(
    () => pd(ft, Ct),
    [ft, Ct]
  ), Di = br(Br, pe == null ? void 0 : pe.id, -1, !0) != null, Pi = br(Br, pe == null ? void 0 : pe.id, 1, !0) != null, Nn = pe ? jt(ft, pe.id) : null, Gr = $t.length > 0 ? jr.map((E) => E.key) : [], Oi = Gr.join("|"), ir = Math.max(
    0,
    Number((Fo = tt.videoFile) == null ? void 0 : Fo.duration) || 0,
    ...At.map((E) => Number(E.endSec ?? E.startSec) || 0)
  ), So = Number((jo = tt.videoFile) == null ? void 0 : jo.duration) > 0 ? Number(tt.videoFile.duration) : null;
  k.actions;
  const Li = Xa();
  be(() => {
    const E = g === vr ? g : (pe == null ? void 0 : pe.id) ?? null;
    E !== g && u(E);
  }, [pe, g]), be(() => {
    m((E) => {
      const de = Ys(
        E,
        qt,
        (pe == null ? void 0 : pe.id) ?? null
      );
      return de.length === E.length && de.every((Le, st) => Le === E[st]) ? E : de;
    });
  }, [Fr, pe == null ? void 0 : pe.id]);
  const In = (pe == null ? void 0 : pe.itemId) == null ? null : ((Bo = e.itemMetadata) == null ? void 0 : Bo[pe.itemId]) || null, Fi = {
    key: (pe == null ? void 0 : pe.itemId) != null ? `item:${pe.itemId}` : (pe == null ? void 0 : pe.nativeSegmentId) != null ? `native:${pe.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (In == null ? void 0 : In.provenance) || (pe == null ? void 0 : pe.fieldProvenance) || [] : []
  }, Ur = (pe == null ? void 0 : pe.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (In == null ? void 0 : In.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  be(() => {
    he(R == null ? "" : String(R.startSec)), le((R == null ? void 0 : R.endSec) == null ? "" : String(R.endSec));
  }, [R == null ? void 0 : R.id, R == null ? void 0 : R.startSec, R == null ? void 0 : R.endSec]), be(() => {
    Nn && X((E) => hi(E, Nn));
  }, [tt.id, s, Nn]), be(() => {
    Ne((E) => hd(Gr, E, Nn));
  }, [tt.id, Oi, Nn]), be(() => {
    if (!J.markerRailOpen || (pe == null ? void 0 : pe.id) == null) return;
    const E = Ln.current, de = Un.rows.find((Ft) => Ft.kind === "segment" && Ft.segment.id === pe.id);
    if (!E || !de) return;
    const Le = de.top + de.height;
    let st = E.scrollTop;
    de.top < E.scrollTop ? st = de.top : Le > E.scrollTop + E.clientHeight && (st = Math.max(0, Le - E.clientHeight)), st !== E.scrollTop && (E.scrollTop = st), Fn({ scrollTop: st, height: E.clientHeight });
  }, [pe == null ? void 0 : pe.id, Un, J.markerRailOpen]), be(() => {
    const E = Ln.current;
    if (!J.markerRailOpen || !E) return;
    const de = () => Fn({
      scrollTop: E.scrollTop,
      height: E.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      de();
      return;
    }
    const Le = new ResizeObserver(de);
    return Le.observe(E), de(), () => Le.disconnect();
  }, [J.markerRailOpen]);
  const { revealSegmentGroupForSelection: ko, replaceSegmentSelection: ji, selectSegment: wo, selectSegmentCollection: Bi, selectAllVideoSegments: Gi } = wc({
    allSwimlanes: ft,
    editorRef: ht,
    performerSlots: Tt,
    seekRef: pn,
    segmentGroups: $t,
    segments: bt,
    selectedSegmentId: g,
    selectedSegmentIds: f,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: v,
    setCollapsedSegmentGroups: X,
    setEditorFilters: q,
    setHideDerivedSegments: A,
    setSaveMessage: Y,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m
  }), { acceptHistory: Kr, recordHistoryAction: sr, mutateSegment: Ui, runSegmentMutation: Ki, completeReview: zi, createSegment: No, splitSegment: Io, duplicateSegment: Co, saveTiming: qi, applyShortcutTiming: Hi } = jd({
    compatibilityMode: l,
    currentTime: y,
    detail: e,
    editorFilters: x,
    endInput: re,
    hideDerivedSegments: _,
    historyRef: ae,
    mediaDuration: So,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: Ar,
    pendingDuplicateRef: Rr,
    pendingFirstSegmentStartSecRef: vn,
    pendingTagEditSegmentIdRef: hn,
    enqueueSave: T,
    pendingChanges: K,
    retargetSaveTasks: Te,
    replaceSegmentSelection: ji,
    savingSegmentId: P,
    segments: bt,
    selectedSegment: pe,
    selectedSegmentIdRef: p,
    selectedSegments: rt,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: v,
    setCreatingSegmentId: Fe,
    setEditorFilters: q,
    setFirstSegmentTagOpen: Ge,
    setHideDerivedSegments: A,
    setHistory: O,
    setHistoryOpen: z,
    setPublishApprovedError: nt,
    setSaveMessage: Y,
    acquireSaveLock: M,
    dispatchPendingChanges: ie,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    setTagEditing: j,
    startInput: ke,
    tagEditingRef: te,
    timelineDuration: ir,
    video: tt
  });
  function $o(E = null) {
    var st;
    if (!l || P != null || !bt.some((Ft) => !Ft.published && Ft.reviewState === "approved")) return;
    const de = ((st = ht.current) == null ? void 0 : st.ownerDocument) ?? document, Le = de.activeElement === de.body ? null : de.activeElement;
    et.current = E != null && E.isConnected && E !== de.body ? E : Le, nt(""), ot(!0);
  }
  function To() {
    P == null && (ot(!1), nt(""), requestAnimationFrame(() => {
      Ac(
        et.current,
        ht.current
      ), et.current = null;
    }));
  }
  async function _i() {
    await zi() && To();
  }
  const { closeMergeConfirmation: Wi, mergeSelectedSwimlane: Ao, saveSelectedReviewState: Vi } = Nc({
    acceptHistory: Kr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: I,
    getSaveQueueSnapshot: V,
    historyRef: ae,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: sr,
    revealSegmentGroupForSelection: ko,
    savingSegmentId: P,
    selectedGroups: xo,
    selectedSegment: pe,
    selectedSegmentIdRef: p,
    selectedSegments: rt,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: v,
    setMergeConfirmation: Ee,
    setSaveMessage: Y,
    acquireSaveLock: M,
    dispatchPendingChanges: ie,
    enqueueSave: T,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: tt
  }), Ji = (E) => {
    const de = (E || []).map(Ht);
    D.cancel((Le) => Le.kind === "review" && yo(Le.targets, de));
  };
  ia(() => {
    C.current = {
      detail: e,
      segments: bt,
      onConflict: r,
      onDetailChange: t,
      onReload: o,
      tagEditing: W,
      selectedSegmentIds: f,
      activeSegmentId: (pe == null ? void 0 : pe.id) ?? null
    };
  }), be(() => {
    D.poke();
  });
  const { toggleIncorrectExample: Yi, removeIncorrectExample: Qi, captureTrainingExport: Zi, deleteRejectedSegments: Ro, autoAssignPerformers: Xi, previewDerivedSegments: es, closeMaterializeDialog: ts, materializeDerivedSegments: ns, saveTag: rs, moveToBin: os, emptyRecyclingBin: as } = Ic({
    acceptHistory: Kr,
    allSwimlanes: ft,
    autoAssignCandidates: Bn,
    autoAssigning: we,
    binEmptyingRef: It,
    canMoveSelectionToBin: Vt,
    closeTagEditing: kn,
    compatibilityMode: l,
    creatingSegmentId: ge,
    detail: e,
    editorFilters: x,
    editorRef: ht,
    exportingExamples: er,
    hideDerivedSegments: _,
    incorrectExamples: Zt,
    lineage: Ur,
    materializeButtonRef: En,
    materializePreview: $e,
    materializeRestoreFocusRef: un,
    materializing: Pt,
    mutateSegment: Ui,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: Tt,
    cancelSaveTasks: oe,
    dispatchPendingChanges: ie,
    enqueueSave: T,
    stableSaveIdentity: H,
    pendingChanges: K,
    runSegmentMutation: Ki,
    recordHistoryAction: sr,
    refreshMaterializationPreview: mt,
    removingExampleId: tr,
    revealSegmentGroupForSelection: ko,
    savingSegmentId: P,
    segmentGroups: $t,
    segments: bt,
    selectedSegment: pe,
    selectedSegmentIdRef: p,
    selectedSegments: rt,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: v,
    setAutoAssignError: xe,
    setAutoAssignOpen: De,
    setAutoAssigning: Be,
    setEditorFilters: q,
    setExportingExamples: Cr,
    setHideDerivedSegments: A,
    setIncorrectExamples: mn,
    setMaterializeError: nn,
    setMaterializeLoading: it,
    setMaterializeOpen: Ce,
    setMaterializePreview: _e,
    setMaterializing: cn,
    setRemovingExampleId: $r,
    setRejectedDeletionPreview: yt,
    setSaveMessage: Y,
    acquireSaveLock: M,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: tt
  }), { restoreHistoryTarget: is, updateTimelineRatio: Mo, handleSeparatorPointerDown: ss, handleSeparatorPointerMove: ls, handleSeparatorKeyDown: ds, panelWidthMaximum: Eo, panelSeparatorProps: cs, toggleSegmentRail: us, toggleSegmentGroup: Do, mutateShotBoundary: ms } = Cc({
    acceptHistory: Kr,
    compatibilityMode: l,
    currentTime: y,
    detail: e,
    editorLayout: J,
    focusRowRef: bn,
    history: k,
    historyRef: ae,
    historySaving: me,
    horizontalLayoutSize: h,
    mediaStackHeight: se,
    mediaStackRef: yn,
    commonActionsRef: on,
    onDetailChange: t,
    onReload: o,
    railToggleRef: rr,
    recordHistoryAction: sr,
    savingSegmentId: P,
    setCollapsedSegmentGroups: X,
    setEditorLayout: G,
    setHistorySaving: N,
    setIncorrectExamples: mn,
    setSaveMessage: Y,
    acquireSaveLock: M,
    enqueueSave: T,
    getSaveQueueSnapshot: V,
    shotBoundaries: Wt,
    timelineDuration: ir,
    video: tt,
    workspaceRef: Pn
  }), { executeShortcutById: Po, stepVideoFrame: gs } = $c({
    allSwimlanes: ft,
    applyShortcutTiming: Hi,
    centerTimelineRef: nr,
    compatibilityMode: l,
    createSegment: No,
    currentTime: y,
    deleteRejectedSegments: Ro,
    duplicateSegment: Co,
    editorLayout: J,
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
    seekRef: pn,
    segmentGroupKeys: Gr,
    selectSegment: wo,
    selectedSegment: pe,
    selectedSegmentGroupForSegment: Nn,
    selectedSegmentGroupKey: ce,
    selectedSegments: rt,
    setCollapsedSegmentGroups: X,
    setIncorrectExamplesOpen: Se,
    setQuickSearchOpen: je,
    setSaveMessage: Y,
    setSelectedSegmentGroupKey: Ne,
    setTagEditing: j,
    setTimelineZoom: Z,
    shotBoundaries: Wt,
    slotButtonRef: Kt,
    splitSegment: Io,
    swimlanes: Br,
    timelineDuration: ir,
    toggleIncorrectExample: Yi,
    toggleSegmentGroup: Do,
    updateTimelineRatio: Mo,
    videoFrameRate: ar,
    visibleSegments: Lt
  });
  fn.current = Po;
  const ps = He(() => Yn.map((E) => ({
    id: E.id,
    enabled: An(E, l),
    surface: "local",
    action: (de) => {
      var Le;
      return (Le = fn.current) == null ? void 0 : Le.call(fn, E.id, de);
    }
  })), [l]);
  Ea(oo, ps);
  const fs = io(se), ys = an(J.markerRailWidth, Eo("markerRailWidth")), bs = an(J.detailWidth, Eo("detailWidth"));
  return n(kc, {
    activeFilterCount: wn,
    allSwimlanes: ft,
    analysisError: Oe,
    analysisRun: Me,
    analysisStatus: Et,
    approvalFacetCounts: Or,
    autoAssignCandidates: Bn,
    autoAssignError: at,
    autoAssignOpen: Ke,
    autoAssignPerformers: Xi,
    autoAssigning: we,
    canMoveSelectionToBin: Vt,
    captureTrainingExport: Zi,
    cancelQueuedReviewsForSegments: Ji,
    removeIncorrectExample: Qi,
    rejectedDeletionPreview: Je,
    centerTimelineRef: nr,
    closeEditorFilters: zt,
    closeFirstSegmentTagDialog: Gn,
    closeMaterializeDialog: ts,
    closeMergeConfirmation: Wi,
    closePublishApprovedDialog: To,
    closeTagEditing: kn,
    collapsedSegmentGroups: Ct,
    commonActionsRef: on,
    compatibilityMode: l,
    configuringTag: Zn,
    createSegment: No,
    currentTime: y,
    deleteRejectedSegments: Ro,
    detail: e,
    detailPanelRef: I,
    detailWidth: bs,
    duplicateSegment: Co,
    editorFilters: x,
    editorLayout: J,
    editorRef: ht,
    exportingExamples: er,
    filtersButtonRef: On,
    filtersOpen: L,
    firstSegmentTagOpen: Ie,
    focusRowRef: bn,
    handleSeparatorKeyDown: ds,
    handleSeparatorPointerDown: ss,
    handleSeparatorPointerMove: ls,
    hideDerivedSegments: _,
    history: k,
    historyOpen: B,
    historySaving: me,
    hasNextUnreviewed: Pi,
    hasPreviousUnreviewed: Di,
    horizontalLayoutSize: h,
    importNativeSegments: Xe,
    incorrectExamples: Zt,
    incorrectExamplesOpen: We,
    removingExampleId: tr,
    lineage: Ur,
    markerRailWidth: ys,
    materializeButtonRef: En,
    materializeCancelButtonRef: Xn,
    materializeDerivedSegments: ns,
    materializeError: Ot,
    materializeLoading: ct,
    materializeOpen: Ye,
    materializePreview: $e,
    materializing: Pt,
    mediaStackRef: yn,
    mergeCancelButtonRef: Ze,
    mergeConfirmation: Ue,
    mergeSaving: Td(Q, "merge"),
    mergeSelectedSwimlane: Ao,
    nativeImportState: dt,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: $o,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: cs,
    pendingInitialSeekRef: Tr,
    performerSlots: Tt,
    performerSlotsAvailable: Er,
    playbackControlsRef: Dn,
    previewDerivedSegments: es,
    provenance: Fi,
    provenanceSources: Lr,
    publishApprovedCancelButtonRef: pt,
    publishApprovedDrafts: _i,
    publishApprovedError: ut,
    publishApprovedOpen: gt,
    quickSearchOpen: Ve,
    railScrollRef: Ln,
    railToggleRef: rr,
    recordHistoryAction: sr,
    restoreHistoryTarget: is,
    runEditorAction: Po,
    stepVideoFrame: gs,
    saveMessage: ue,
    setSaveMessage: Y,
    saveTag: rs,
    saveTiming: qi,
    savingSegmentId: P,
    acquireSaveLock: M,
    seekRef: pn,
    segmentGroups: $t,
    segmentRailLayout: Un,
    segments: At,
    selectAllVideoSegments: Gi,
    selectSegment: wo,
    selectSegmentCollection: Bi,
    selectedGroups: xo,
    selectedPerformerSlots: vo,
    selectedSegment: R,
    selectedSegmentGroupKey: ce,
    selectedSegmentIds: f,
    selectedSegments: rt,
    selectedSlotStatus: Mi,
    setAutoAssignError: xe,
    setAutoAssignOpen: De,
    setConfiguringTag: rn,
    setCurrentTime: w,
    setEditorFilters: q,
    setEditorLayout: G,
    setFiltersOpen: U,
    setHideDerivedSegments: A,
    setHistoryOpen: z,
    setIncorrectExamplesOpen: Se,
    setQuickSearchOpen: je,
    setRejectedDeletionPreview: yt,
    setRailViewport: Fn,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: u,
    setShortcutsOpen: ve,
    setTimelineZoom: Z,
    shotBoundaries: Wt,
    shortcutsOpen: Ae,
    slotButtonRef: Kt,
    splitLayout: a,
    splitSegment: Io,
    startFullAnalysis: Ut,
    tagEditing: W,
    creatingSegmentId: ge,
    tagSearchRef: or,
    timelineDuration: ir,
    timelineRatioBounds: fs,
    timelineZoom: fe,
    toggleSegmentGroup: Do,
    toggleSegmentRail: us,
    updateTimelineRatio: Mo,
    video: tt,
    videoPerformers: Sn,
    visibleCounts: Dr,
    visibleSegmentRailRows: Ei,
    visibleSegments: Lt,
    wideLayout: gn,
    workspaceRef: Pn
  });
}
const Mc = /* @__PURE__ */ new Set(["queued", "running"]);
async function wa(e, t, r = 4) {
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
function Na(e, t) {
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
  const i = [...new Set(e.map(Number).filter((m) => Number.isInteger(m) && m > 0))], a = [...new Set(t)].filter((m) => ["aiTagging", "omnishotcut"].includes(m));
  if (i.length === 0 || a.length === 0)
    return { queuedIds: [], failed: [], cancelled: !1 };
  const s = a.includes("omnishotcut"), l = await wa(i, async (m) => {
    try {
      const [p, b] = await Promise.all([
        r(`/videos/${m}/analysis-runs`),
        s ? r(`/videos/${m}/editor`) : null
      ]);
      if ((p || []).some((I) => Mc.has(I == null ? void 0 : I.status)))
        throw new Error("A Full Scan is already queued or running.");
      const v = (b == null ? void 0 : b.shotBoundaries) || [];
      return { videoId: m, shotBoundaries: v };
    } catch (p) {
      return Na(m, p);
    }
  }), d = l.filter((m) => !m.error), c = l.filter((m) => m.error), g = d.filter((m) => m.shotBoundaries.length > 0), u = g.reduce((m, p) => m + p.shotBoundaries.length, 0);
  if (u > 0 && !o(
    `Replace ${u} existing shot ${u === 1 ? "boundary" : "boundaries"} across ${g.length} selected ${g.length === 1 ? "video" : "videos"} when these scans succeed? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
  )) return { queuedIds: [], failed: c, cancelled: !0 };
  const f = await wa(d, async ({ videoId: m, shotBoundaries: p }) => {
    const b = s && p.length > 0;
    try {
      return await r(`/videos/${m}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: a,
          replaceShotBoundaries: b,
          expectedShotBoundaryFingerprint: b ? qn(p) : null
        })
      }), { videoId: m };
    } catch (v) {
      return Na(m, v);
    }
  });
  return {
    queuedIds: f.filter((m) => !m.error).map((m) => m.videoId),
    failed: [...c, ...f.filter((m) => m.error)],
    cancelled: !1
  };
}
function Pc(e = [], t = []) {
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
function Oc(e = [], t = "", r = "all") {
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
function vt(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function Lc(e = [], t = []) {
  var m;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((p, b) => (p.sortOrder ?? 0) - (b.sortOrder ?? 0) || Number(p.id) - Number(b.id)).forEach((p, b) => {
    [...p.tags || []].sort((v, I) => (v.sortOrder ?? 0) - (I.sortOrder ?? 0) || Number(v.tagId) - Number(I.tagId)).forEach((v, I) => r.set(Number(v.tagId), {
      key: `group:${p.id}`,
      id: p.id,
      name: p.name,
      sortOrder: p.sortOrder ?? b,
      tagSortOrder: v.sortOrder ?? I
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(p, b) {
    const v = Number(p);
    if (!o.has(v)) {
      const I = r.get(v);
      o.set(v, {
        tagId: v,
        name: b || `Tag ${v}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (I == null ? void 0 : I.key) || "ungrouped",
        segmentGroupId: (I == null ? void 0 : I.id) ?? null,
        segmentGroupName: (I == null ? void 0 : I.name) || "Ungrouped",
        segmentGroupSortOrder: (I == null ? void 0 : I.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (I == null ? void 0 : I.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(v);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((p) => {
    const b = i(p.sourceTagId, p.sourceTagName), v = i(p.derivedTagId, p.derivedTagName);
    b.outgoingRuleCount++, v.incomingRuleCount++;
    const I = `${b.tagId}:${v.tagId}`;
    a.has(I) || a.set(I, {
      id: I,
      sourceTagId: b.tagId,
      derivedTagId: v.tagId,
      rules: [],
      edgeCount: 0
    });
    const x = a.get(I);
    x.rules.push(p), x.edgeCount += Number(p.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((p) => [p.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((p) => {
    var b, v;
    (b = d.get(p.sourceTagId)) == null || b.add(p.derivedTagId), (v = d.get(p.derivedTagId)) == null || v.add(p.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), g = [];
  for (const p of s) {
    if (c.has(p.tagId)) continue;
    const b = [p.tagId], v = [];
    for (c.add(p.tagId); b.length > 0; ) {
      const A = b.shift();
      v.push(A);
      for (const y of d.get(A) || [])
        c.has(y) || (c.add(y), b.push(y));
    }
    const I = new Set(v), x = v.map((A) => o.get(A)), q = l.filter((A) => I.has(A.sourceTagId) && I.has(A.derivedTagId)), L = q.flatMap((A) => A.rules), U = x.filter((A) => A.outgoingRuleCount === 0).sort((A, y) => vt(A.name, y.name)), _ = U.length > 0 ? U : [...x].sort((A, y) => vt(A.name, y.name));
    g.push({
      id: [...v].sort((A, y) => A - y).join(":"),
      label: _.length > 1 ? `${_[0].name} + ${_.length - 1}` : ((m = _[0]) == null ? void 0 : m.name) || "Derivation component",
      nodes: x,
      connections: q,
      rules: L,
      segmentGroupKeys: [...new Set(x.map((A) => A.segmentGroupKey))],
      materializedEdgeCount: L.reduce(
        (A, y) => A + (Number(y.edgeCount) || 0),
        0
      )
    });
  }
  g.sort((p, b) => b.rules.length - p.rules.length || vt(p.label, b.label));
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
    p.nodes.forEach((b) => {
      var v;
      return (v = u.get(b.segmentGroupKey)) == null ? void 0 : v.componentIds.add(p.id);
    }), p.rules.forEach((b) => {
      var v, I;
      (v = u.get(o.get(Number(b.sourceTagId)).segmentGroupKey)) == null || v.ruleIds.add(b.id), (I = u.get(o.get(Number(b.derivedTagId)).segmentGroupKey)) == null || I.ruleIds.add(b.id);
    });
  });
  const f = [...u.values()].sort((p, b) => p.sortOrder - b.sortOrder || vt(p.name, b.name)).map((p) => ({
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
function Fc(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const g = new Map(e.nodes.map((w) => [w.tagId, /* @__PURE__ */ new Set()])), u = new Map(e.nodes.map((w) => [w.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((w) => {
    var C, D;
    (C = g.get(w.sourceTagId)) == null || C.add(w.derivedTagId), (D = u.get(w.derivedTagId)) == null || D.add(w.sourceTagId);
  });
  const f = new Map(e.nodes.map((w) => {
    var C;
    return [
      w.tagId,
      ((C = u.get(w.tagId)) == null ? void 0 : C.size) || 0
    ];
  })), m = new Map(e.nodes.map((w) => [w.tagId, 0])), p = e.nodes.filter((w) => f.get(w.tagId) === 0).sort((w, C) => vt(w.name, C.name)).map((w) => w.tagId), b = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const w = p.shift();
    if (!b.has(w)) {
      b.add(w);
      for (const C of g.get(w) || [])
        m.set(C, Math.max(m.get(C) || 0, (m.get(w) || 0) + 1)), f.set(C, f.get(C) - 1), f.get(C) === 0 && p.push(C);
    }
  }
  b.size !== e.nodes.length && e.nodes.filter((w) => !b.has(w.tagId)).sort((w, C) => vt(w.name, C.name)).forEach((w) => m.set(w.tagId, 0));
  const v = Math.max(0, ...m.values()), I = Math.max(
    t,
    240 + v * 296
  ), x = /* @__PURE__ */ new Map();
  e.nodes.forEach((w) => {
    x.has(w.segmentGroupKey) || x.set(w.segmentGroupKey, {
      key: w.segmentGroupKey,
      id: w.segmentGroupId,
      name: w.segmentGroupName,
      sortOrder: w.segmentGroupSortOrder,
      nodes: []
    }), x.get(w.segmentGroupKey).nodes.push(w);
  });
  const q = [...x.values()].sort((w, C) => w.sortOrder - C.sortOrder || vt(w.name, C.name));
  let L = 28;
  const U = [], _ = q.map((w) => {
    const C = /* @__PURE__ */ new Map();
    w.nodes.forEach((T) => {
      const H = m.get(T.tagId) || 0;
      C.has(H) || C.set(H, []), C.get(H).push(T);
    });
    for (const T of C.values())
      T.sort((H, ne) => H.segmentGroupTagSortOrder - ne.segmentGroupTagSortOrder || vt(H.name, ne.name));
    const D = Math.max(1, ...[...C.values()].map((T) => T.length)), Q = D * 58 + (D - 1) * 18, P = 70 + Q, M = {
      ...w,
      x: 12,
      y: L,
      width: I - 24,
      height: P
    };
    for (const [T, H] of C.entries()) {
      const ne = H.length * 58 + Math.max(0, H.length - 1) * 18, oe = (Q - ne) / 2;
      H.forEach((Te, V) => U.push({
        ...Te,
        rank: T,
        x: 28 + T * 296,
        y: L + 34 + 18 + oe + V * 76,
        width: 184,
        height: 58
      }));
    }
    return L += P + 16, M;
  }), A = new Map(U.map((w) => [w.tagId, w])), y = e.connections.map((w) => {
    const C = A.get(w.sourceTagId), D = A.get(w.derivedTagId), Q = C.x + C.width, P = C.y + C.height / 2, M = D.x, T = D.y + D.height / 2, H = Math.max(48, (M - Q) * 0.48);
    return {
      ...w,
      path: `M ${Q} ${P} C ${Q + H} ${P}, ${M - H} ${T}, ${M} ${T}`
    };
  });
  return {
    width: I,
    height: Math.max(r, L - 16 + 28),
    nodes: U,
    connections: y,
    groups: _
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
      const b = m.get(p.sourceTagId), v = m.get(p.derivedTagId), I = b.x + b.width, x = b.y + b.height / 2, q = v.x, L = v.y + v.height / 2, U = Math.max(48, (q - I) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${I} ${x} C ${I + U} ${x}, ${q - U} ${L}, ${q} ${L}`
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
function Ia(e, t = []) {
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
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: u, emptyDraft: f, graph: m, layout: p, listSort: b, materializationOffer: v, materializeOutgoingRules: I, materializeRule: x, message: q, normalizedQuery: L, query: U, refreshConfiguredTag: _, revealEditor: A, rules: y, save: w, segmentGroupKey: C, selectedNode: D, selectedRule: Q, selection: P, setConfiguringTag: M, setDraft: T, setListSort: H, setMaterializationOffer: ne, setQuery: oe, setSegmentGroupKey: Te, setSelection: V, setView: K, sortedVisibleRules: ie, sourceSlots: ue, sourceSlotsLoading: Y, updateMapping: ke, updateTag: he, view: re, visibleComponents: le, visibleRules: fe } = e;
  function Z(h) {
    const S = m.nodes.find((O) => O.tagId === Number(h.sourceTagId)), k = m.nodes.find((O) => O.tagId === Number(h.derivedTagId));
    return (S == null ? void 0 : S.segmentGroupKey) === (k == null ? void 0 : k.segmentGroupKey) ? S.segmentGroupKey : "cross-group";
  }
  function J() {
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
            n(_n, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (h, S) => he("source", h, S == null ? void 0 : S.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !Y && ue.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (h) => M({
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
            n(_n, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (h, S) => he("derived", h, S == null ? void 0 : S.label),
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
              onClick: (h) => M({
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
            disabled: r || ue.length === 0 || s.length === 0,
            onClick: () => T((h) => ({
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
          ...d.slotMappings.map((h, S) => n("div", { key: S, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: h.sourceSlotDefinitionId,
              disabled: r,
              onChange: (k) => ke(S, "sourceSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${S + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...ue.map((k) => n("option", { key: k.id, value: k.id }, St(k)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: h.derivedSlotDefinitionId,
              disabled: r,
              onChange: (k) => ke(S, "derivedSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${S + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((k) => n("option", { key: k.id, value: k.id }, St(k)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => T((k) => ({
                ...k,
                slotMappings: k.slotMappings.filter((O, ae) => ae !== S)
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
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((h) => !h.sourceSlotDefinitionId || !h.derivedSlotDefinitionId),
          onClick: w,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => T(null), className: o }, "Cancel")
      ])
    ]);
  }
  function G() {
    if (D) {
      const k = fe.filter((B) => Number(B.derivedTagId) === D.tagId), O = fe.filter((B) => Number(B.sourceTagId) === D.tagId), ae = (B, z, me) => n("div", {
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
          me ? n("button", {
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
            onClick: () => g(B, !0),
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
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, D.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, D.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${D.incomingRuleCount} incoming · ${D.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (B) => M({
            tagId: D.tagId,
            tagName: D.name,
            trigger: B.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        O.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => I(D, O),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${O.length})`) : null,
        O.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...O.map((B) => ae(B, "Derives", !0))
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
            k.map((B) => ae(B, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!Q)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const h = m.nodes.find((k) => k.tagId === Number(Q.sourceTagId)), S = m.nodes.find((k) => k.tagId === Number(Q.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (h == null ? void 0 : h.segmentGroupName) || "Ungrouped"),
          (h == null ? void 0 : h.segmentGroupKey) !== (S == null ? void 0 : S.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(S == null ? void 0 : S.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${Q.sourceTagName} → ${Q.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${Q.edgeCount} materialized lineage edge${Q.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (v == null ? void 0 : v.ruleId) === Q.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
        n(
          "p",
          { key: "summary", className: "text-sm font-medium text-foreground" },
          `${v.createCount + v.linkCount} pending derivation${v.createCount + v.linkCount === 1 ? "" : "s"}`
        ),
        n(
          "p",
          { key: "details", className: "text-xs text-secondary" },
          `${v.createCount} new segments · ${v.linkCount} existing segments to link`
        ),
        n("div", { key: "actions", className: "flex gap-2" }, [
          n("button", {
            key: "materialize",
            type: "button",
            disabled: r,
            onClick: () => x(Q, v),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => ne(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        Q.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : Q.slotMappings.map((k, O) => n("div", {
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
          Q.createdAt ? new Date(Q.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          Q.updatedAt ? new Date(Q.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => x(Q),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(Q),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(Q),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function se() {
    if (le.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, L ? "No derivation relationships match your search." : "No derivation rules.");
    const h = D == null ? void 0 : D.tagId, S = /* @__PURE__ */ new Set();
    return D && (S.add(D.tagId), p.connections.forEach((k) => {
      (k.sourceTagId === D.tagId || k.derivedTagId === D.tagId) && (S.add(k.sourceTagId), S.add(k.derivedTagId));
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
          className: `absolute rounded-xl border ${C === k.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
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
            const O = h === k.sourceTagId || h === k.derivedTagId, ae = D != null, B = O ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${k.id}:visible`,
              d: k.path,
              fill: "none",
              stroke: B,
              strokeWidth: O ? 2.5 : 1.5,
              opacity: ae && !O ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((k) => {
          const O = !L || k.name.toLocaleLowerCase().includes(L), ae = D != null, B = S.has(k.tagId), z = (D == null ? void 0 : D.tagId) === k.tagId;
          return n("button", {
            key: `node:${k.tagId}`,
            type: "button",
            onClick: () => V({ type: "node", id: k.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${z ? "border-accent bg-accent/15 ring-2 ring-accent/25" : B ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${k.x}px`,
              top: `${k.y}px`,
              width: `${k.width}px`,
              height: `${k.height}px`,
              opacity: !O || ae && !B ? 0.62 : 1
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
          const O = p.nodes.find((B) => B.tagId === k.sourceTagId), ae = p.nodes.find((B) => B.tagId === k.derivedTagId);
          return n("div", {
            key: `bundle:${k.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(O.x + O.width + ae.x) / 2 - 24}px`,
              top: `${(O.y + O.height / 2 + ae.y + ae.height / 2) / 2 - 10}px`
            },
            "aria-label": `${k.rules.length} rules connect ${k.rules[0].sourceTagName} to ${k.rules[0].derivedTagName}`
          }, `${k.rules.length} rules`);
        })
      ])
    ]);
  }
  function $() {
    if (le.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        L ? "No derivation relationships match your search." : "No derivation rules."
      );
    const h = /* @__PURE__ */ new Map();
    ie.forEach((k) => {
      const O = Z(k);
      h.has(O) || h.set(O, []), h.get(O).push(k);
    });
    const S = [
      ...m.segmentGroups.map((k) => k.key),
      "cross-group"
    ].filter((k) => h.has(k));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, S.map((k) => {
      const O = m.segmentGroups.find((z) => z.key === k), ae = k === "cross-group" ? "Cross-group relationships" : (O == null ? void 0 : O.name) || "Ungrouped", B = h.get(k);
      return n("section", { key: k, "aria-label": ae }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, ae),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${B.length} rule${B.length === 1 ? "" : "s"}`
          )
        ]),
        n("div", { key: "table", role: "table", "aria-label": `${ae} derivation rules` }, [
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
            onClick: () => V({ type: "rule", id: z.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(Q == null ? void 0 : Q.id) === z.id ? "bg-accent/10" : ""}`,
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
          `${y.length} rules · ${m.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          T(f()), V(null), A();
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
          value: U,
          onChange: (h) => {
            oe(h.target.value), V(null);
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
          value: C,
          disabled: d != null,
          onChange: (h) => {
            Te(h.target.value), V(null), T(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...m.segmentGroups.map((h) => n("option", { key: h.key, value: h.key }, h.name))
        ])
      ]),
      re === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: b,
          onChange: (h) => H(h.target.value),
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
        ].map(([h, S]) => n("button", {
          key: h,
          type: "button",
          onClick: () => {
            K(h), h === "graph" && (P == null ? void 0 : P.type) === "rule" && V(null);
          },
          "aria-pressed": re === h,
          className: `rounded px-3 py-1.5 text-sm font-medium ${re === h ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
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
        re === "graph" ? se() : $()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? J() : G()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      q ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, q) : null
    ]),
    i ? n(ho, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => _(i),
      onClose: () => {
        const h = i.trigger;
        M(null), requestAnimationFrame(() => {
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
  }), [o, i] = F([]), [a, s] = F(null), [l, d] = F([]), [c, g] = F([]), [u, f] = F(!1), [m, p] = F(!1), [b, v] = F(!1), [I, x] = F(""), [q, L] = F(""), [U, _] = F("graph"), [A, y] = F("all"), [w, C] = F(null), [D, Q] = F("relationship"), [P, M] = F(null), [T, H] = F(null), ne = ye(null), oe = ye(null), Te = ai().replace(/:/g, "");
  function V() {
    requestAnimationFrame(() => {
      var N;
      return (N = ne.current) == null ? void 0 : N.scrollIntoView({ block: "nearest" });
    });
  }
  async function K(N) {
    const W = await ee("/derivation-rules", N ? { signal: N } : void 0);
    i(W || []);
  }
  be(() => {
    const N = new AbortController();
    return K(N.signal).catch((W) => {
      W.name !== "AbortError" && x(W.message || "Unable to load derived segment rules.");
    }), () => N.abort();
  }, []), be(() => {
    const N = new AbortController();
    return a != null && a.sourceTagId ? (f(!0), ee(`/slot-definitions/${a.sourceTagId}`, { signal: N.signal }).then((W) => d(W.definitions || [])).catch((W) => {
      W.name !== "AbortError" && d([]);
    }).finally(() => {
      N.signal.aborted || f(!1);
    })) : (d([]), f(!1)), a != null && a.derivedTagId ? (p(!0), ee(`/slot-definitions/${a.derivedTagId}`, { signal: N.signal }).then((W) => g(W.definitions || [])).catch((W) => {
      W.name !== "AbortError" && g([]);
    }).finally(() => {
      N.signal.aborted || p(!1);
    })) : (g([]), p(!1)), () => N.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), be(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || u || m)
      return;
    const N = `${a.sourceTagId}:${a.derivedTagId}`;
    oe.current !== N && (oe.current = N, s((W) => !W || Number(W.sourceTagId) !== Number(a.sourceTagId) || Number(W.derivedTagId) !== Number(a.derivedTagId) ? W : ad(W, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    u,
    m
  ]);
  function ie(N, W = !1) {
    W || C({ type: "rule", id: N.id }), oe.current = null, s({
      ruleId: N.id,
      sourceTagId: N.sourceTagId,
      sourceTagName: N.sourceTagName,
      derivedTagId: N.derivedTagId,
      derivedTagName: N.derivedTagName,
      slotMappings: N.slotMappings.map((j) => ({
        sourceSlotDefinitionId: j.sourceSlotDefinitionId,
        derivedSlotDefinitionId: j.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), x(""), V();
  }
  function ue(N, W, j = "") {
    oe.current = null, N === "source" ? (d([]), f(W != null)) : (g([]), p(W != null)), s((te) => ({
      ...te,
      [`${N}TagId`]: W == null ? null : Number(W),
      [`${N}TagName`]: j || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function Y(N) {
    (a == null ? void 0 : a.ruleId) == null && (oe.current = null);
    const W = [K(), t == null ? void 0 : t()];
    return N.draftKind === "source" ? (f(!0), W.push(ee(`/slot-definitions/${N.tagId}`).then((j) => d(j.definitions || [])).finally(() => f(!1)))) : N.draftKind === "derived" && (p(!0), W.push(ee(`/slot-definitions/${N.tagId}`).then((j) => g(j.definitions || [])).finally(() => p(!1)))), Promise.all(W);
  }
  function ke(N, W, j) {
    s((te) => ({
      ...te,
      slotMappings: te.slotMappings.map((ge, Fe) => Fe === N ? { ...ge, [W]: j } : ge)
    }));
  }
  async function he() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const N = Ia(a, o);
    if (N) {
      x(N.message);
      return;
    }
    if (a.slotMappings.some((W) => !W.sourceSlotDefinitionId || !W.derivedSlotDefinitionId)) {
      x("Complete or remove every performer slot mapping before saving.");
      return;
    }
    v(!0), x(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let W = null;
      if (a.ruleId != null) {
        const te = await ee(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${te.deletedSegmentCount}
Removed lineage edges: ${te.removedEdgeCount}
Shared derived segments retained: ${te.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        W = te.fingerprint;
      }
      x("Saving derived segment rule…");
      const j = await ee("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: W
        })
      });
      if (await K(), C(U === "graph" ? { type: "node", id: Number(j.sourceTagId) } : { type: "rule", id: j.id }), s(null), a.ruleId == null)
        try {
          const te = await ee(
            `/derivation-rules/${j.id}/materialization/preview`,
            { method: "POST" }
          );
          M(
            te.createCount + te.linkCount > 0 ? te : null
          ), x(te.createCount + te.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          M(null), x("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        M(null), x("Derived segment rule saved. Previous materializations were removed.");
    } catch (W) {
      x(W.message || "Unable to save derived segment rule.");
    } finally {
      v(!1);
    }
  }
  async function re(N) {
    v(!0), x("Previewing rule deletion…");
    try {
      const W = await ee(
        `/derivation-rules/${N.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${N.sourceTagName} → ${N.derivedTagName}?

Deleted segments: ${W.deletedSegmentCount}
Removed lineage edges: ${W.removedEdgeCount}
Shared derived segments retained: ${W.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const j = `derivation-rule-delete:${N.id}:${W.fingerprint}`;
      await ee(`/derivation-rules/${N.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ze(j),
          fingerprint: W.fingerprint
        })
      }), qe(j), await K(), (a == null ? void 0 : a.ruleId) === N.id && s(null), (w == null ? void 0 : w.type) === "rule" && w.id === N.id && C(null), (P == null ? void 0 : P.ruleId) === N.id && M(null), x(`Rule deleted with ${W.deletedSegmentCount} exclusively derived segment${W.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (W) {
      x(W.message || "Unable to delete derived segment rule.");
    } finally {
      v(!1);
    }
  }
  async function le(N, W = null) {
    const j = W || await ee(
      `/derivation-rules/${N.id}/materialization/preview`,
      { method: "POST" }
    );
    if (j.createCount + j.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const te = `derivation-rule-materialize:${N.id}:${j.fingerprint}`, ge = await ee(`/derivation-rules/${N.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: ze(te),
        fingerprint: j.fingerprint
      })
    });
    return qe(te), ge;
  }
  async function fe(N, W = null) {
    v(!0), x("Finding pending derivations…");
    try {
      const j = await le(N, W);
      if (M(null), await K(), j.createdCount + j.linkedCount === 0) {
        x("Every applicable derivation is already materialized.");
        return;
      }
      x(
        `${j.createdCount} derived segment${j.createdCount === 1 ? "" : "s"} created and ${j.linkedCount} existing segment${j.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (j) {
      x(j.message || "Unable to materialize pending derivations.");
    } finally {
      v(!1);
    }
  }
  async function Z(N, W) {
    if (W.length === 0) return;
    v(!0), x(`Finding pending derivations from ${N.name}…`);
    let j = 0, te = 0;
    try {
      for (const ge of W) {
        const Fe = await le(ge);
        j += Fe.createdCount, te += Fe.linkedCount;
      }
      M(null), await K(), x(j + te === 0 ? `Every outgoing derivation from ${N.name} is already materialized.` : `${j} derived segment${j === 1 ? "" : "s"} created and ${te} existing segment${te === 1 ? "" : "s"} linked from ${N.name}.`);
    } catch (ge) {
      await K().catch(() => {
      }), x(ge.message || `Unable to materialize derivations from ${N.name}.`);
    } finally {
      v(!1);
    }
  }
  const J = Ia(a, o), G = He(
    () => Lc(o, e),
    [o, e]
  ), se = q.trim().toLocaleLowerCase(), h = G.components.filter((N) => A === "all" || N.segmentGroupKeys.includes(A)).filter((N) => !se || N.nodes.some((W) => W.name.toLocaleLowerCase().includes(se))), S = h.flatMap((N) => N.rules), k = new Set(
    h.flatMap((N) => N.nodes.map((W) => W.tagId))
  ), O = He(
    () => jc(h),
    [h]
  ), ae = U === "list" ? Bc(
    w,
    S,
    se.length > 0
  ) : null, B = (w == null ? void 0 : w.type) === "node" && G.nodes.find((N) => N.tagId === w.id && k.has(N.tagId)) || null, z = [...S].sort((N, W) => D === "source" ? vt(N.sourceTagName, W.sourceTagName) || vt(N.derivedTagName, W.derivedTagName) : D === "target" ? vt(N.derivedTagName, W.derivedTagName) || vt(N.sourceTagName, W.sourceTagName) : D === "materialized" ? (Number(W.edgeCount) || 0) - (Number(N.edgeCount) || 0) || vt(N.sourceTagName, W.sourceTagName) : vt(
    `${N.sourceTagName} ${N.derivedTagName}`,
    `${W.sourceTagName} ${W.derivedTagName}`
  ));
  return n(Gc, {
    arrowMarkerId: Te,
    busy: b,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: T,
    deleteRule: re,
    derivedSlots: c,
    derivedSlotsLoading: m,
    draft: a,
    draftIssue: J,
    editRule: ie,
    editorRef: ne,
    emptyDraft: r,
    graph: G,
    layout: O,
    listSort: D,
    materializationOffer: P,
    materializeOutgoingRules: Z,
    materializeRule: fe,
    message: I,
    normalizedQuery: se,
    query: q,
    refreshConfiguredTag: Y,
    revealEditor: V,
    rules: o,
    save: he,
    segmentGroupKey: A,
    selectedNode: B,
    selectedRule: ae,
    selection: w,
    setConfiguringTag: H,
    setDraft: s,
    setListSort: Q,
    setMaterializationOffer: M,
    setQuery: L,
    setSegmentGroupKey: y,
    setSelection: C,
    setView: _,
    sortedVisibleRules: z,
    sourceSlots: l,
    sourceSlotsLoading: u,
    updateMapping: ke,
    updateTag: ue,
    view: U,
    visibleComponents: h,
    visibleRules: S
  });
}
function Kc() {
  const [e, t] = F(Xa), r = [
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
    t(Xo(ao));
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
function zc({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = F([]), [a, s] = F(!1), [l, d] = F(!1), [c, g] = F(""), [u, f] = F(""), [m, p] = F("all"), [b, v] = F(() => /* @__PURE__ */ new Set()), [I, x] = F(null);
  be(() => {
    if (!e || a) return;
    const M = new AbortController();
    return d(!0), g(""), ee("/slot-definitions", { signal: M.signal }).then((T) => {
      i(T || []), s(!0);
    }).catch((T) => {
      T.name !== "AbortError" && g(T.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      M.signal.aborted || d(!1);
    }), () => M.abort();
  }, [e, a]);
  async function q() {
    d(!0), g("");
    try {
      const M = await ee("/slot-definitions");
      i(M || []), s(!0);
    } catch (M) {
      g(M.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function L() {
    const [M] = await Promise.all([
      ee("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(M || []), s(!0), g("");
  }
  function U() {
    const M = I == null ? void 0 : I.trigger;
    x(null), requestAnimationFrame(() => {
      M != null && M.isConnected && M.focus({ preventScroll: !0 });
    });
  }
  function _(M) {
    v((T) => {
      const H = new Set(T);
      return H.has(M) ? H.delete(M) : H.add(M), H;
    });
  }
  const A = He(
    () => Pc(t, o),
    [t, o]
  ), y = He(
    () => Oc(A, u, m),
    [A, u, m]
  ), w = A.flatMap((M) => M.tags), C = w.filter((M) => M.definitions.length > 0).length, D = w.length - C, Q = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], P = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${w.length} tags · ${C} with slots · ${D} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: u,
          onChange: (M) => f(M.target.value),
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
          Q.map(([M, T]) => n("button", {
            key: M,
            type: "button",
            onClick: () => p(M),
            "aria-pressed": m === M,
            className: `rounded px-3 py-1.5 text-xs font-medium ${m === M ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, T))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => v(/* @__PURE__ */ new Set()),
          className: P
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => v(new Set(A.map((M) => M.overviewKey))),
          className: P
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
        onClick: q,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && y.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, y.map((M) => {
      const T = b.has(M.overviewKey), H = M.tags.filter((ne) => ne.definitions.length > 0).length;
      return n("article", {
        key: M.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => _(M.overviewKey),
          "aria-expanded": !T,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, T ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, M.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${M.tags.length} tag${M.tags.length === 1 ? "" : "s"} · ${H} with slots`
          )
        ]),
        T ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          M.tags.map((ne) => n("li", {
            key: ne.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: ne.tagName }, ne.tagName),
              ne.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            ne.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${ne.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, ne.definitions.map((oe) => n("li", {
              key: oe.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, St(oe)),
              ...(oe.genderHints || []).map((Te) => n("span", {
                key: Te,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, wr(Te)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (oe) => x({
                tagId: ne.tagId,
                tagName: ne.tagName,
                trigger: oe.currentTarget
              }),
              "aria-label": `Edit performer slots for ${ne.tagName}`,
              className: `${P} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    I ? n(ho, {
      key: `performer-slots-configure:${I.tagId}`,
      tagId: I.tagId,
      tagName: I.tagName,
      onSaved: L,
      onClose: U
    }) : null
  ]);
}
function qc({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = F("general"), [a, s] = F([]), [l, d] = F(!1), [c, g] = F(""), [u, f] = F(""), [m, p] = F(null), [b, v] = F(!0), [I, x] = F(!1), [q, L] = F(""), [U, _] = F(!0), [A, y] = F(_a), w = wl(t), C = w.map(([T]) => T);
  be(() => {
    C.includes(o) || i(C[0] || "general");
  }, [t.effectiveMode]);
  async function D(T) {
    const H = await ee("/segment-groups", T ? { signal: T } : void 0);
    s(H || []);
  }
  be(() => {
    const T = new AbortController();
    return D(T.signal).catch((H) => {
      H.name !== "AbortError" && g(H.message || "Unable to load tag groups.");
    }), () => T.abort();
  }, []), be(() => {
    if (t.effectiveMode !== "full") {
      v(!1);
      return;
    }
    const T = new AbortController();
    return L(""), v(!0), Promise.all([
      ee("/analysis/settings", { signal: T.signal }),
      ee("/analysis/status", { signal: T.signal })
    ]).then(([H, ne]) => {
      _(!0), f((H == null ? void 0 : H.baseUrl) || ""), p(ne);
    }).catch((H) => {
      if (H.name !== "AbortError") {
        if (H.status === 403) {
          _(!1), L("You do not have permission to manage the analysis service connection.");
          return;
        }
        L(H.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      T.signal.aborted || v(!1);
    }), () => T.abort();
  }, [t.effectiveMode]);
  async function Q(T) {
    if (T !== t.requestedMode) {
      d(!0), g("");
      try {
        const H = await ee(
          `/preferences/transition?mode=${encodeURIComponent(T)}`
        );
        let ne = !1, oe = null, Te = null, V = null, K = !1;
        if (t.requestedMode === "basic" && T === "full") {
          if (!window.confirm(Cl(
            H.recyclingBinCount,
            H.protectedRecyclingBinCount
          )))
            return;
          K = !0, H.recyclingBinCount > 0 && (ne = !0, V = H.recyclingBinFingerprint, oe = `mode-switch-empty-bin:${V}`, Te = ze(oe));
        }
        let ie = !1;
        if (t.requestedMode === "full" && T === "basic") {
          if (!window.confirm(Il(
            H.extensionOwnedSegmentCount
          )))
            return;
          ie = !0;
        }
        const ue = await ee("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: T,
            confirmHiddenExtensionOwnedSegments: ie,
            confirmBasicHistoryCleanup: K,
            emptyRecyclingBin: ne,
            operationId: Te,
            expectedRecyclingBinFingerprint: V
          })
        });
        oe && qe(oe), r == null || r(ei(ue)), g("Workflow mode saved.");
      } catch (H) {
        g(H.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function P(T) {
    T.preventDefault(), x(!0), L("");
    try {
      const H = await ee("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: u })
      });
      f((H == null ? void 0 : H.baseUrl) || "");
      const ne = await ee("/analysis/status");
      p(ne), L(H != null && H.baseUrl ? ne != null && ne.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(ne == null ? void 0 : ne.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (H) {
      L(H.message || "Unable to save analysis service settings.");
    } finally {
      x(!1);
    }
  }
  const M = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (T) => Ci(T, e, M), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      w.map(([T, H]) => n("button", {
        key: T,
        type: "button",
        onClick: () => i(T),
        "aria-current": o === T ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === T ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, H))
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
        onModeChange: Q,
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
          onChange: (T) => {
            const H = T.target.checked;
            Wa(H), y(H);
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
      n("form", { key: "form", onSubmit: P, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
        n("label", { key: "url", className: "min-w-0 flex-1 space-y-1" }, [
          n("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Server URL"),
          n("input", {
            key: "input",
            type: "url",
            value: u,
            onChange: (T) => f(T.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: b || I || !U,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: b || I || !U,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, I ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        q || (b ? "Loading analysis service settings…" : (m == null ? void 0 : m.configured) === !1 ? "Full Scan is not configured." : m != null && m.ready ? "Analysis service is ready." : (m == null ? void 0 : m.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    C.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(Uc, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => D()
      })
    ) : null,
    C.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(zc, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => D()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function Ca({ facets: e, values: t, disabled: r, onChange: o }) {
  var i;
  return r ? n(
    "p",
    { className: "rounded-md border border-dashed border-border p-3 text-xs text-secondary" },
    "Performer slot filters are unavailable for your current access. Browse and playback remain available."
  ) : (i = e == null ? void 0 : e.slots) != null && i.length ? n("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, e.slots.map((a) => n("label", { key: a.id, className: "space-y-1 text-xs text-secondary" }, [
    n("span", { key: "label" }, St(a)),
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
function Hc({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var g, u;
  const s = [...e.slots || []].sort((f, m) => f.sortOrder - m.sortOrder || String(f.slotDefinitionId).localeCompare(String(m.slotDefinitionId))), l = [...new Map(s.map((f) => [
    f.performerId,
    { id: f.performerId, name: f.performerName }
  ])).values()], d = s.map((f) => ({
    slotDefinitionId: f.slotDefinitionId,
    label: St(f),
    performer: { id: f.performerId, name: f.performerName }
  })), c = ni(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: ui(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((g = e.activity) == null ? void 0 : g.name) || "segment"}, ${e.reviewState}, ${Re(e.startSec)} to ${e.endSec == null ? "end of video" : Re(e.endSec)}` }, [
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
          n(dn, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((u = e.activity) == null ? void 0 : u.name) || "Tag segment"),
          l.length ? n(Nr, {
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
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(Ma, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: Al(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: ni(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function $a({ onNavigate: e, profile: t }) {
  const r = He(() => {
    const K = Da("ext:com.midnightrider.segment-studio:segments");
    return K ? {
      ...qr,
      defaultFilter: { ...qr.defaultFilter, ...K.findFilter || {} },
      defaultObjectFilter: K.objectFilter || {}
    } : qr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Pa(r), [l, d] = F(null), [c, g] = F({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [u, f] = F(null), [m, p] = F(null), [b, v] = F(0), [I, x] = F(""), [q, L] = F(!0), [U, _] = F(""), A = ye(0), y = ta(o, i), w = y.activityTagId, C = Tn(i.slots), D = He(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (K) => Object.keys(Tn(K)).length > 0,
    sanitize: (K) => Hr(w, Tn(K)),
    summarize: (K) => `${Object.keys(Tn(K)).length} assigned`,
    renderEditor: (K, ie) => w ? n(Ca, {
      facets: l,
      values: Tn(K),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (ue, Y) => {
        const ke = { ...Tn(K) };
        Y ? ke[ue] = Number(Y) : delete ke[ue], ie(Hr(w, ke));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [w, l, c.performerSlotsAvailable]), Q = JSON.stringify(y);
  be(() => {
    if (d(null), !w) return;
    const K = new AbortController();
    return ee(`/browse/activities/${w}/facets`, { signal: K.signal }).then(d).catch((ie) => {
      ie.status === 403 ? d({ slots: [], restricted: !0 }) : ie.name !== "AbortError" && _(ie.message);
    }), () => K.abort();
  }, [w]), be(() => {
    const K = ++A.current, ie = new AbortController();
    return L(!0), _(""), ee("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(y), signal: ie.signal }).then((ue) => {
      K === A.current && g({ ...ue, totalCount: ue.totalCount ?? ue.total ?? 0 });
    }).catch((ue) => {
      if (!(K !== A.current || ue.name === "AbortError")) {
        if (ue.status === 400 && ue.message.includes("unrestricted performer read access")) {
          g((Y) => ({ ...Y, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), _("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        _(ue.message);
      }
    }).finally(() => {
      K === A.current && L(!1);
    }), () => {
      A.current++, ie.abort();
    };
  }, [Q, b]);
  const P = c.items.findIndex((K) => K.key === u), M = c.items[P] || null;
  function T(K) {
    s(K), a({ ...o, page: 1 });
  }
  function H(K) {
    const ie = ta(o, K), ue = K.slots && ie.activityTagId != null && ie.slotAssignments.length > 0 ? K.slots : void 0;
    T({ ...K, slots: ue });
  }
  function ne(K, ie) {
    const ue = { ...C };
    ie ? ue[K] = Number(ie) : delete ue[K], T({ ...i, slots: Hr(w, ue) });
  }
  function oe() {
    const K = document.querySelector(`[data-segment-key="${u}"]`);
    f(null), requestAnimationFrame(() => K == null ? void 0 : K.focus());
  }
  async function Te(K) {
    var Y;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(K.key), x("");
    const ie = `browse-restore:${K.itemId}:${K.revision}`, ue = ze(ie);
    try {
      const ke = (he = !1) => ee(`/bin/${K.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ue,
          expectedRevision: K.revision,
          discardMissingImage: he
        })
      });
      try {
        await ke(co(ie));
      } catch (he) {
        if (((Y = he.payload) == null ? void 0 : Y.code) !== "missing-image" || !window.confirm(`${he.message}

Continue and discard the missing image reference?`))
          throw he;
        uo(ie), await ke(!0);
      }
      qe(ie), u === K.key && f(null), x("Segment restored to Cove."), v((he) => he + 1);
    } catch (ke) {
      x(ke.message || "Unable to restore the segment."), ke.status === 409 && v((he) => he + 1);
    } finally {
      p(null);
    }
  }
  async function V(K) {
    p(K.key), x("");
    try {
      const ie = await ee(`/items/${K.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: K.revision })
      });
      if (!si(ie, x) || !zl(ie))
        return;
      const ue = `browse-dependency-delete:${K.itemId}:${ie.fingerprint}`;
      await ee(`/items/${K.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ze(ue),
          fingerprint: ie.fingerprint
        })
      }), qe(ue), u === K.key && f(null), x(`${ie.deletedSegmentCount} segment${ie.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), v((Y) => Y + 1);
    } catch (ie) {
      x(ie.message || "Unable to permanently delete the segment."), ie.status === 409 && v((ue) => ue + 1);
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
      isLoading: q,
      error: U ? new Error(U) : null,
      onRetry: () => v((K) => K + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? ea.filter((K) => K.id !== "performers") : ea,
      objectFilter: i,
      onObjectFilterChange: H,
      customFilterSections: D,
      searchPlaceholder: "Search segments..."
    }, [
      w ? n(Ca, { key: "slots", facets: l, values: C, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: ne }) : null,
      n(_c, { key: "player", item: M, index: P, count: c.items.length, onPrevious: () => {
        var K;
        return f((K = c.items[P - 1]) == null ? void 0 : K.key);
      }, onNext: () => {
        var K;
        return f((K = c.items[P + 1]) == null ? void 0 : K.key);
      }, onClose: oe, onNavigate: e }),
      I ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, I) : null,
      !q && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      q ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((K) => n(Hc, {
        key: K.key,
        item: K,
        selected: K.key === u,
        busy: m === K.key,
        onSelect: () => f(K.key),
        onRestore: Te,
        onPurge: V
      })))
    ])
  ]);
}
function Wc({ onNavigate: e, profile: t }) {
  const [r, o] = F([]), [i, a] = F(""), [s, l] = F(0), [d, c] = F(!0), [g, u] = F(null), [f, m] = F(""), p = ye(null);
  async function b(x) {
    const q = await ee("/bin", x ? { signal: x } : void 0);
    return o(q.items || []), a(q.fingerprint || ""), l(Number(q.totalCount) || 0), q;
  }
  be(() => {
    const x = new AbortController();
    return c(!0), b(x.signal).catch((q) => {
      q.name !== "AbortError" && m(q.message);
    }).finally(() => {
      x.signal.aborted || c(!1);
    }), () => x.abort();
  }, []), Ea(oo, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var x;
      return (x = p.current) == null ? void 0 : x.call(p);
    }
  }]);
  async function v(x) {
    var U;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    u(x.itemId), m("");
    const q = `restore:${x.itemId}:${x.revision}`, L = ze(q);
    try {
      const _ = (A = !1) => ee(`/bin/${x.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: L, expectedRevision: x.revision, discardMissingImage: A })
      });
      try {
        await _(co(q));
      } catch (A) {
        if (((U = A.payload) == null ? void 0 : U.code) !== "missing-image" || !window.confirm(`${A.message}

Continue and discard the missing image reference?`)) throw A;
        uo(q), await _(!0);
      }
      qe(q), await b(), Hn(), m("Segment restored with a new native ID.");
    } catch (_) {
      m(_.message || "Unable to restore the segment."), _.status === 409 && await b();
    } finally {
      u(null);
    }
  }
  async function I() {
    if (g == null)
      try {
        const x = await di({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          u(-1), m("");
        });
        if (x.status !== "emptied") return;
        await b(), Hn(), m(`${x.segmentCount} segment${x.segmentCount === 1 ? "" : "s"} from ${x.sceneCount} scene${x.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (x) {
        m(x.message || "Unable to empty the recycling bin."), x.status === 409 && await b();
      } finally {
        u(null);
      }
  }
  return p.current = I, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
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
        onClick: I,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, g === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
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
      n("button", { key: "restore", type: "button", disabled: g != null, onClick: () => v(x), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const Ta = "ext:com.midnightrider.segment-studio:videos";
function Vr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = He(() => {
    var fe;
    const re = Da(Ta), le = (fe = re == null ? void 0 : re.uiOptions) == null ? void 0 : fe.displayMode;
    return re ? {
      ...Kn,
      defaultFilter: { ...Kn.defaultFilter, ...re.findFilter || {} },
      defaultObjectFilter: re.objectFilter || {},
      defaultDisplayMode: Kn.allowedDisplayModes.includes(le) ? le : Kn.defaultDisplayMode
    } : Kn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = Pa(i), [u, f] = F({ items: [], totalCount: 0 }), [m, p] = F(!0), [b, v] = F(""), [I, x] = F(0), [q, L] = F(/* @__PURE__ */ new Set()), [U, _] = F(null), [A, y] = F({ busy: !1, error: "", announcement: "" }), w = ye(0), C = ye(null), D = ye(null);
  D.current || (D.current = Ec());
  const Q = JSON.stringify(a), P = JSON.stringify(s), M = t || r === "review";
  be(() => {
    D.current.selectionChanged(), C.current = null, L(/* @__PURE__ */ new Set()), y((re) => ({ busy: re.busy, error: "", announcement: "" }));
  }, [Q, P]), be(() => {
    if (!M) return;
    const re = new AbortController();
    return ee("/analysis/status", { signal: re.signal }).then(_).catch((le) => {
      le.name !== "AbortError" && _({ configured: !0, ready: !1, error: le.message || "Unable to check Full Scan readiness." });
    }), () => re.abort();
  }, [M]), be(() => {
    const re = ++w.current, le = new AbortController();
    return p(!0), v(""), ee(`/videos?${ec(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: le.signal }).then((fe) => {
      re === w.current && f(fe);
    }).catch((fe) => {
      re === w.current && fe.name !== "AbortError" && v(fe.message || "Unable to discover videos.");
    }).finally(() => {
      re === w.current && p(!1);
    }), () => {
      w.current++, le.abort();
    };
  }, [Q, P, t, r, I]);
  function T(re) {
    d({ ...re, page: re.page || 1 });
  }
  function H(re) {
    c(re), d({ ...a, page: 1 });
  }
  function ne(re, le = !1) {
    L((fe) => tc(
      fe,
      u.items.map((Z) => Z.videoId),
      re,
      C.current,
      le
    )), C.current = re;
  }
  function oe() {
    C.current = null, L(new Set(u.items.map((re) => re.videoId)));
  }
  function Te() {
    C.current = null, L(/* @__PURE__ */ new Set());
  }
  function V() {
    C.current = null, L((re) => new Set(u.items.map((le) => le.videoId).filter((le) => !re.has(le))));
  }
  async function K(re = ["aiTagging", "omnishotcut"]) {
    const le = D.current.begin();
    if (le) {
      y({ busy: !0, error: "", announcement: "" });
      try {
        const fe = await Dc(
          [...q],
          re,
          ee,
          (Z) => window.confirm(Z)
        );
        if (fe.cancelled) {
          y({ busy: !1, error: "", announcement: "" });
          return;
        }
        fe.queuedIds.length > 0 && D.current.ownsCurrentSelection(le) && (fe.queuedIds.includes(C.current) && (C.current = null), L((Z) => {
          const J = new Set(Z);
          return fe.queuedIds.forEach((G) => J.delete(G)), J;
        })), y({
          busy: !1,
          announcement: fe.queuedIds.length > 0 ? `${fe.queuedIds.length} ${fe.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: fe.failed.length > 0 ? `${fe.failed.length} selected ${fe.failed.length === 1 ? "video could" : "videos could"} not be queued. ${fe.failed[0].error}` : ""
        });
      } catch (fe) {
        y({ busy: !1, error: fe.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        D.current.finish(le);
      }
    }
  }
  const ie = t || r === "review" ? ha : ha.filter((re) => !["reviewState", "shotBoundaries"].includes(re.id)), ue = U === null || U.configured === !1 || U.ready === !1, Y = A.busy || ue, ke = (U == null ? void 0 : U.error) || (U === null ? "Checking Full Scan availability" : U.configured === !1 ? "Configure the analysis service before running Full Scan" : U.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), he = A.busy ? "Queueing scans…" : U === null ? "Checking Full Scan…" : U.configured === !1 ? "Full Scan not configured" : U.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
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
      savedFilterScope: Ta,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: T,
      totalCount: u.totalCount,
      isLoading: m,
      error: b ? new Error(b) : null,
      onRetry: () => x((re) => re + 1),
      sortOptions: t || r === "review" ? [...ba, { value: "unreviewed_count", label: "Unreviewed count" }] : ba,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: ie,
      objectFilter: s,
      onObjectFilterChange: H,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: M ? q : void 0,
      onSelectAll: M ? oe : void 0,
      onSelectNone: M ? Te : void 0,
      onInvertSelection: M ? V : void 0,
      selectionActions: M ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: Y,
          onClick: () => K(),
          title: ke,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, he),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": Y,
            title: ke,
            onClick: (re) => {
              Y && re.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${Y ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(La, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([re, le]) => n("button", {
            key: re,
            type: "button",
            disabled: A.busy,
            onClick: (fe) => {
              var Z;
              (Z = fe.currentTarget.closest("details")) == null || Z.removeAttribute("open"), K(le);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, re)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, A.announcement),
      A.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, A.error) : null,
      !m && u.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !m && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, u.items.map((re) => n(nc, { key: re.videoId, item: re, onNavigate: e, showReviewStates: M, selected: q.has(re.videoId), selectionActive: q.size > 0, onSelect: M ? ne : null }))) : null,
      !m && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, u.items.map((re) => n(rc, { key: re.videoId, item: re, onNavigate: e, showReviewStates: M, selected: q.has(re.videoId), selectionActive: q.size > 0, onSelect: M ? ne : null }))) : null
    ])
  ]);
}
function Aa({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = F(null), [s, l] = F(!0), [d, c] = F(""), g = ye(0), u = ye(0), f = ye(e), m = Gd();
  f.current = e;
  const [p] = F(() => Bs({
    beginRequest: () => ({ requestId: ++u.current, videoId: f.current }),
    fetchDetail: (L) => ee(b(L.videoId)),
    isCurrent: (L) => lr(L.requestId, u.current, L.videoId, f.current),
    isSameVideo: (L) => L.videoId === f.current
  })), b = (L) => `/videos/${L}/editor`;
  async function v(L, U, _) {
    const A = await ee(b(U), _ ? { signal: _.signal } : void 0);
    return lr(L, _ ? g.current : u.current, U, f.current) ? (a(A), !0) : !1;
  }
  be(() => {
    const L = ++g.current, U = e, _ = new AbortController();
    return a(null), l(!0), c(""), v(L, U, _).catch((A) => {
      lr(L, g.current, U, f.current) && A.name !== "AbortError" && c(A.message || "Unable to load the editor.");
    }).finally(() => {
      lr(L, g.current, U, f.current) && l(!1);
    }), () => {
      g.current++, u.current++, _.abort();
    };
  }, [e]);
  function I(L, U) {
    a((_) => (_ == null ? void 0 : _.video.id) !== U ? _ : typeof L == "function" ? L(_) : L);
  }
  function x() {
    return p({
      onLoaded: (L) => {
        a(L), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: (L) => c(L.message || "Unable to reload the latest segment.")
    });
  }
  function q() {
    return p({
      onLoaded: (L) => {
        a(L), c("");
      },
      onError: (L) => c(L.message || "Unable to reload performer slots.")
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
      n(ws, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(Rc, {
      key: i.video.id,
      detail: i,
      onDetailChange: I,
      onConflict: x,
      onReload: q,
      onSlotsChanged: q,
      splitLayout: m,
      profile: o,
      initialSegmentId: ra() ? -ra() : Rl(),
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
  const a = o.legacyCompatibilityRequired, s = Sl(o), l = Vc(e, t, window.location.pathname), d = Jc(e, t, window.location.pathname), c = Yc(e, t, window.location.pathname), g = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (Nl(g, o) === "videos" && g !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Vr, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(qc, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n($a, { onNavigate: r, profile: o });
    const m = Number(e);
    return Number.isInteger(m) && m > 0 ? n(Aa, {
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
  if (c) return n(Wc, { onNavigate: r, profile: o });
  const f = Number(e);
  return d ? n($a, { onNavigate: r, profile: o }) : Number.isInteger(f) && f > 0 ? n(Aa, {
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
  const [o, i] = F(null), [a, s] = F("");
  return be(() => {
    const l = new AbortController();
    return ee("/preferences", { signal: l.signal }).then((d) => i(ei(d))).catch((d) => {
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
const Iu = {
  components: { SegmentStudioPage: Zc },
  actionHandlers: { openSegmentStudio: eu }
};
export {
  vr as CLEARED_SEGMENT_SELECTION_ID,
  ba as DISCOVERY_SORT_OPTIONS,
  Yt as SEGMENT_STUDIO_CAPABILITIES,
  oo as SEGMENT_STUDIO_EXTENSION_ID,
  Yn as SEGMENT_STUDIO_SHORTCUTS,
  zs as activeEditorFilterCount,
  Ed as addPendingChange,
  ad as applyDerivationRuleSlotSuggestions,
  fr as applyFeedbackEditorDelta,
  Od as applyPendingChanges,
  ca as applySegmentMergeDelta,
  _l as basicSegmentTimelineStyle,
  Al as browseClipEnd,
  ni as browseEditorHref,
  ta as buildBrowseRequest,
  Lc as buildDerivationRuleGraph,
  ec as buildDiscoverySearchParams,
  Ts as buildMinuteTimelineTicks,
  Pc as buildPerformerSlotOverview,
  Ol as buildSegmentQuickSearchEntries,
  cd as buildSegmentRailRows,
  ud as buildTimelineRows,
  iu as buildTimelineTicks,
  Es as calculateCenteredTimelineScroll,
  Yr as calculateEditorPanelMaximum,
  As as calculateMinuteLabelStride,
  su as calculateMinuteTimelineWidth,
  Os as calculateSwimlaneTitleMaximum,
  Ds as calculateTimelinePlayheadPosition,
  io as calculateTimelineRatioBounds,
  Fs as calculateTimelineRatioFromPointer,
  lu as calculateVerticalRevealOffset,
  an as clampEditorPanelWidth,
  pr as clampSwimlaneTitleWidth,
  Ha as clampTimelineRatio,
  so as clampTimelineRatioForHeight,
  hr as clampTimelineZoom,
  Yd as compactProvenanceSummary,
  Ld as confirmPendingChange,
  Ec as createBulkAnalysisCoordinator,
  Bs as createEditorReloader,
  cl as createQueuedReviewRequest,
  Ad as createSaveQueue,
  ka as createSegmentAnalysisRequestScope,
  Iu as default,
  wi as discardPendingChange,
  Kl as downloadFileNameFromContentDisposition,
  qs as dualRangeValueFromPointer,
  Qo as duplicateIdentityFromResponse,
  gl as duplicateOperationKey,
  Va as editorVisibilityIncludingSegment,
  pd as expandedSwimlanes,
  Il as extensionOwnedSegmentsModeSwitchPrompt,
  vd as feedbackFrameTimestamps,
  Sd as feedbackResultMatchesAction,
  xd as feedbackSelectionPlan,
  Ks as filterDerivedSegments,
  zr as filterEditorSegments,
  Oc as filterPerformerSlotOverview,
  Pl as filterSegmentQuickSearch,
  gu as filterSegmentStudioShortcuts,
  bd as findAdjacentSegmentGroupKey,
  vl as findAdjacentShot,
  sl as findEditorShortcut,
  qa as findInitialSegmentSelection,
  $s as findNearestSegmentInCurrentSwimlane,
  hl as findPublishedSelectionIdentity,
  Qe as findSegmentByStableIdentity,
  js as findSegmentFromPlayhead,
  Cs as findSegmentNearPlayhead,
  yd as findSwimlaneRangeSelection,
  to as findSwimlaneSelection,
  El as findUniquePerformerSlotAssignment,
  br as findUnreviewedSelection,
  ed as focusDialogDefaultButton,
  wr as formatGenderHint,
  xl as frameStepSeconds,
  ri as generatePerformerSlotAssignmentRecommendations,
  mc as groupApprovedDraftsForPublishing,
  Dl as groupAutoAssignCandidates,
  kd as groupIncorrectExamplesByTag,
  bc as groupMaterializationOutputs,
  sn as groupSegmentsIntoSwimlanes,
  md as groupSelectedSwimlanes,
  fo as groupSwimlanesBySegmentGroup,
  Nt as handleModalKey,
  Rn as hasSegmentStudioCapability,
  Si as heldTagChangeFor,
  bl as heldTagReady,
  ma as hideCollectedFeedbackSegments,
  la as historyActionsForTarget,
  cr as incorrectExampleHistoryState,
  pi as indexPerformerSlotsBySegment,
  yu as initialReviewFilter,
  Id as insertSegmentProjection,
  lr as isCurrentEditorRequest,
  Ql as isEditableTarget,
  hu as isEditorShortcutOwner,
  Td as isKindRunning,
  Nu as isSaveQueueBusy,
  Yc as isSegmentStudioBinRoute,
  Jc as isSegmentStudioSegmentsRoute,
  Vc as isSegmentStudioSettingsRoute,
  Fc as layoutDerivationRuleComponent,
  jc as layoutDerivationRuleComponents,
  $d as mergeSegmentsProjection,
  rd as multiSelectionActionHint,
  Zs as nextSegmentAfterRemoval,
  Xs as nextUnreviewedAfterRemoval,
  tn as normalizeCollapsedSegmentGroups,
  xa as normalizeDiscoveryIds,
  Mt as normalizeEditorSegmentFilters,
  Xt as normalizeGender,
  Zo as normalizeReviewFilter,
  ei as normalizeSegmentStudioFeatureProfile,
  pu as normalizeSegmentStudioMode,
  Xr as normalizeSegmentStudioPublicMode,
  Tn as parseBrowseSlotFilters,
  Ls as parseEditorLayout,
  Gs as parseHideDerivedSegmentsPreference,
  Us as parseMergeConfirmationPreference,
  Za as parsePlaybackShortcutConfig,
  al as parseShortcutBindingOverrides,
  Wr as patchPerformerSlotProjection,
  Su as patchSegmentProjection,
  Fd as pendingChangesReducer,
  Dd as pendingInsertedSegments,
  el as percentageSeekTime,
  Ml as performInitialSegmentSeek,
  lt as performerOptionId,
  xr as performerSlotHistoryState,
  St as performerSlotLabel,
  id as performerSlotPresentation,
  xu as performerSlotStatus,
  po as performerSlotStatusFromSegmentSlots,
  gi as performerSlotsForSegment,
  Gt as provenanceSourceLabel,
  Ii as prunePendingChanges,
  yl as queueCreatedSegmentTagChoice,
  oi as rankPerformerOptions,
  hd as reconcileSegmentGroupKey,
  Ys as reconcileSelectedSegmentIds,
  oc as recyclingBinActionText,
  ql as recyclingBinDeletionPrompt,
  li as recyclingBinDeletionSummary,
  Cl as recyclingBinModeSwitchPrompt,
  fu as removeQueuedReviewsForSegments,
  Cd as removeSegmentsProjection,
  ra as requestedOwnedItemId,
  Rl as requestedSegmentId,
  _s as resolveEditorSegmentSelection,
  ul as resolveQueuedReviewRequest,
  pl as resolveSegmentCreationAction,
  Nl as resolveSegmentStudioRoute,
  il as resolveSegmentStudioShortcuts,
  vi as resolveSegmentTarget,
  Bc as resolveSelectedDerivationRule,
  Vo as resolveSelectedSegments,
  Sc as restoreDisabledToolbarActionFocus,
  Ac as restorePublishApprovedFocus,
  ku as restoreSegmentFieldsProjection,
  wu as restoreSegmentsProjection,
  Pd as retargetPendingChanges,
  hi as revealCollapsedSegmentGroup,
  Dc as runSelectedDiscoveryAnalysis,
  Mn as sameSegmentIdentity,
  xi as savingSegmentIdFrom,
  ci as segmentBadgeStyle,
  kr as segmentGroupHeaderBackground,
  jt as segmentGroupKeyForSegment,
  go as segmentHistoryIdentity,
  dr as segmentHistoryState,
  Ht as segmentIdentity,
  ui as segmentRailItemStyle,
  bu as segmentStateStyle,
  Xc as segmentStudioActionTarget,
  Sl as segmentStudioLegacyMode,
  Hl as segmentTimelineStyle,
  Rt as segmentsHistoryState,
  Qs as selectAllVideoSegmentIds,
  $l as selectedBrowseStates,
  yi as selectedSwimlaneMerge,
  Ci as setBackLinkNavigation,
  Ni as settlePendingChange,
  td as sharedPerformerSlotShape,
  nd as sharedTagPerformerSlotShape,
  An as shortcutAvailableInMode,
  ll as shortcutBindingDisplayText,
  du as shortcutBindingFromEvent,
  uu as shortcutBindingsOverlap,
  mu as shortcutModesOverlap,
  ol as shortcutRequiresSingleSegment,
  qn as shotBoundaryFingerprint,
  Xl as shouldAcceptCurrentTagFromEnter,
  cu as shouldExitShortcutCapture,
  vu as shouldHandleEditorShortcut,
  Sa as shouldLoadSegmentAnalysis,
  ya as shouldReloadAfterSegmentMutation,
  Zr as shouldRestoreTransitionSelection,
  Ll as shouldShowQuickSearchGroups,
  Jo as splitShortcutCategoriesIntoColumns,
  od as suggestDerivationRuleSlotMappings,
  Vn as swimlaneDisplayLabel,
  Yl as swimlaneMarkerTop,
  Vl as swimlaneStripeBackground,
  fl as tagEditorLockedBySave,
  yo as targetsOverlap,
  Ps as timelineContentStyle,
  Ho as timelinePlayheadHorizontalStyle,
  Wl as timelineSegmentWidth,
  Rs as timelineTickAlignment,
  Ms as timelineTickPosition,
  Jr as timelineTimePercent,
  fd as toggleAllCollapsedSegmentGroups,
  dl as toggledSelectionReviewState,
  _t as trapModalFocus,
  Bl as tryParseJsonResponseText,
  Js as updateAnchoredSegmentSelection,
  tc as updateDiscoverySelection,
  Hs as updateDualRangeValues,
  Ws as updateSegmentCollectionSelection,
  Vs as updateSegmentRangeSelection,
  Ja as updateSegmentSelection,
  Ia as validateDerivationRuleDraft,
  qo as validateSegmentTiming,
  lo as videoPerformerOptions,
  _r as videoPerformerSlotAssignments,
  wl as visibleSegmentStudioSettingsTabs,
  kl as visibleSegmentStudioTabs,
  fi as visibleVirtualRows
};
