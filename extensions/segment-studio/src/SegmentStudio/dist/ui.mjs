import oo from "@cove/runtime/react";
import { createPortal as Ns } from "@cove/runtime/react-dom";
import { extensionFetch as Da } from "@cove/runtime/api";
import { formatDuration as Is, EntityReferenceSelector as Wn, useExtensionKeyboardBindings as Cs, ExtensionEntityActions as $s, VideoPlayer as Oa, useRegisterExtensionKeyboardActions as Pa, getDefaultFilter as La, useListUrlState as ja, ListPage as Fa, ExtensionSelectionActions as Ts } from "@cove/runtime/components";
import { StepBack as Rs, StepForward as As, Loader2 as Ms } from "@cove/runtime/lucide-react";
const ao = "com.midnightrider.segment-studio", Ba = "segment-studio.layout.v1", sn = "segment-studio.operations.v1", Ga = "segment-studio.collapsed-segment-groups.v1", Ka = "segment-studio.playback-shortcuts.v1", za = "segment-studio.timing-clipboard.v1", Ua = "segment-studio.hide-derived-segments.v1", Ha = "segment-studio.merge-confirmation.v1", It = ["unreviewed", "approved", "rejected"], Es = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], Ho = "(min-width: 1024px) and (min-height: 640px)", _o = "(min-width: 1024px) and (min-height: 900px)", Vn = 1e-3, qo = 15, Ds = 30, _a = 12, Rt = {
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
}, Vt = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function Wo(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function qa(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? Sr(e, null, 1, !0) ?? r[0] ?? null;
}
function Sr(e, t, r, o = !1) {
  var u;
  const i = e.findIndex((m) => m.markers.some((y) => y.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const m = e.flatMap((y) => y.markers.map((h) => h.segment)).filter((y) => y.reviewState === "unreviewed");
    return r < 0 ? m.at(-1) ?? null : m[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((m) => m.segment.id === t);
  if (!o)
    return ((u = (r < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((y) => y.segment.reviewState === "unreviewed")) == null ? void 0 : u.segment) ?? null;
  const l = e.flatMap((m) => m.markers.map((y) => y.segment)), d = l.findIndex((m) => m.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((m) => m.reviewState === "unreviewed") ?? null;
}
function Os(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((u, m) => u.markers.filter(({ segment: y }) => {
    const h = Number(y.startSec), p = y.endSec == null ? h + Ds : Number(y.endSec);
    return Number.isFinite(h) && Number.isFinite(p) && p >= h && h <= i + qo + Vn && p >= i - qo - Vn;
  }).map(({ segment: y }) => ({ segment: y, laneIndex: m }))).sort((u, m) => u.laneIndex - m.laneIndex || Math.abs(u.segment.startSec - i) - Math.abs(m.segment.startSec - i) || u.segment.id - m.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((u) => u.markers.some((m) => m.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((u) => u.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((u) => u.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((u) => u.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function Ps(e, t, r) {
  var a;
  const o = Number(r);
  if (!Number.isFinite(o) || t == null) return null;
  const i = (Array.isArray(e) ? e : []).find((s) => {
    var l;
    return (l = s.markers) == null ? void 0 : l.some(({ segment: d }) => d.id === t);
  });
  return i ? ((a = i.markers.map(({ segment: s }) => {
    const l = Number(s.startSec), d = s.endSec == null ? l : Number(s.endSec), c = Number.isFinite(d) && d >= l ? d : l, u = o < l ? l - o : o > c ? o - c : 0;
    return { segment: s, distance: u, startDistance: Math.abs(l - o) };
  }).filter((s) => Number.isFinite(s.distance)).sort((s, l) => s.distance - l.distance || s.startDistance - l.startDistance || String(s.segment.id).localeCompare(String(l.segment.id)))[0]) == null ? void 0 : a.segment) ?? null : null;
}
function kr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function cu(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function Ls(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function uu(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function js(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function Fs(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Bs(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function Gs(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Jr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function Ks(e, t, r = 10) {
  const o = Jr(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function Vo(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function zs(e, t = _a) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function Wa(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : Rt.timelineRatio;
}
function Yr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function on(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? Rt.detailWidth : Math.min(Yr(t, 0), Math.max(240, e));
}
function yr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? Rt.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function Us(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function so(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: Rt.timelineRatio, maximum: Rt.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function lo(e, t) {
  const r = Wa(e);
  if (!(t > 0)) return r;
  const o = so(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function Hs(e) {
  if (!e) return { ...Rt };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? Wa(r) : Rt.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: on(t == null ? void 0 : t.detailWidth),
      markerRailWidth: on(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: yr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...Rt };
  }
}
function _s(e, t, r) {
  return r > 0 ? lo((t + r - e) / r, r) : Rt.timelineRatio;
}
function mu(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function qs(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, u) => c.startSec - u.startSec || c.id - u.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= Vn ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function cr(e, t, r, o) {
  return e === t && r === o;
}
function Ws({ beginRequest: e, fetchDetail: t, isCurrent: r, isSameVideo: o }) {
  let i = null, a = null;
  return function({ onLoaded: l, onError: d }) {
    const c = e(), u = (async () => {
      try {
        const m = await t(c);
        if (r(c))
          return l(m), m;
      } catch (m) {
        if (r(c))
          return d(m), null;
      }
      return o(c) && i !== u && a.videoId === c.videoId ? i : null;
    })();
    return i = u, a = c, u;
  };
}
const Cn = "__segment-studio-cleared-selection__";
function Vs(e) {
  return e === "true";
}
function Js(e) {
  return e !== "false";
}
function Va() {
  try {
    return Js(window.localStorage.getItem(Ha));
  } catch {
    return !0;
  }
}
function Ja(e) {
  try {
    window.localStorage.setItem(Ha, String(!!e));
  } catch {
  }
}
function Ys(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function Ot(e = {}) {
  const t = It.filter((u) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(u) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (u, m) => {
    const y = Number(u);
    return Number.isFinite(y) ? Math.min(1, Math.max(0, y)) : m;
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
function Ur(e, t, r, o = !1, i = []) {
  var c, u;
  const a = Ot(r), s = a.performerId == null ? null : new Set((t || []).filter((m) => Number(m.performerId) === a.performerId).map((m) => m.segmentId)), l = new Set((i || []).flatMap((m) => m.tags || []).map((m) => Number(m.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((u = (c = (i || []).find((m) => Number(m.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : u.map((m) => Number(m.tagId))) || []);
  return Ys(e || [], o).filter((m) => {
    if (m.reviewState != null && !a.reviewStates.includes(m.reviewState) || s && !s.has(m.id) || a.tagId != null && Number(m.tagId) !== a.tagId || d && !d.has(Number(m.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(m.tagId)) || a.sourceKey != null && m.sourceKey !== a.sourceKey) return !1;
    const y = Number(m.confidence);
    return m.confidence == null || !Number.isFinite(y) ? a.includeUnscored : y >= a.confidenceMin && y <= a.confidenceMax;
  });
}
function Ya(e, t, r, o = !1, i = []) {
  var l;
  const a = Ot(r);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = Ot({
    ...a,
    reviewStates: [...a.reviewStates, e.reviewState]
  }).reviewStates), a.performerId != null && !(t || []).some((d) => d.segmentId === e.id && Number(d.performerId) === a.performerId) && (a.performerId = null), a.tagId != null && Number(e.tagId) !== a.tagId && (a.tagId = null), a.segmentGroupId != null) {
    const d = new Set((i || []).flatMap((c) => c.tags || []).map((c) => Number(c.tagId)));
    if (a.segmentGroupId === "ungrouped")
      d.has(Number(e.tagId)) && (a.segmentGroupId = null);
    else {
      const c = (i || []).find((u) => Number(u.id) === a.segmentGroupId);
      (l = c == null ? void 0 : c.tags) != null && l.some((u) => Number(u.tagId) === Number(e.tagId)) || (a.segmentGroupId = null);
    }
  }
  a.sourceKey != null && e.sourceKey !== a.sourceKey && (a.sourceKey = null);
  const s = Number(e.confidence);
  return e.confidence != null && Number.isFinite(s) && (a.confidenceMin = Math.min(a.confidenceMin, Math.floor(s * 100) / 100), a.confidenceMax = Math.max(a.confidenceMax, Math.ceil(s * 100) / 100)), (e.confidence == null || !Number.isFinite(s)) && (a.includeUnscored = !0), {
    filters: Ot(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function Qs(e, t = !1) {
  const r = Ot(e);
  return +(r.reviewStates.length !== It.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function Zs(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function Xs(e, t, r, o) {
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
function el(e, t, r = null, o = {}) {
  if (t === Cn) return null;
  const i = t ?? r, a = (e || []).flatMap((s) => (s.markers || []).map((l) => l.segment)).find((s) => s.id === i);
  if (a) return a;
  if (o.reference) {
    const s = o.visibleLanes ?? e;
    return s.flatMap((d) => (d.markers || []).map((c) => c.segment)).find((d) => d.id === o.reference.id) ?? hr(s, o.reference);
  }
  return qa(e);
}
function Qa(e, t, r, o = !1) {
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
function tl(e, t, r) {
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
function nl(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return Qa(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function rl(e, t, r = null, o = !1) {
  const i = (e == null ? void 0 : e.selectedSegmentIds) || [], a = (e == null ? void 0 : e.activeSegmentId) ?? null, s = (e == null ? void 0 : e.anchorSegmentId) ?? a, l = (e == null ? void 0 : e.rangeBaseSegmentIds) || [];
  if (r) {
    const u = [...new Set(r)];
    if (!u.includes(s) || !u.includes(t))
      return {
        selectedSegmentIds: [t],
        activeSegmentId: t,
        anchorSegmentId: t,
        rangeBaseSegmentIds: []
      };
    const m = o ? [.../* @__PURE__ */ new Set([...l, ...i])] : l;
    return {
      ...nl(m, s, t, u, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: m
    };
  }
  const d = Qa(i, a, t, o);
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
    rangeBaseSegmentIds: d.selectedSegmentIds.filter((u) => u !== c)
  };
}
function ol(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function al(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function Jo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function Yo(e, t, r, o = () => !0) {
  return (e || []).map((i) => i.segment).filter((i) => i && !r.has(i.id) && o(i)).sort((i, a) => Jo(t, i) - Jo(t, a) || Math.abs(Number(i.startSec) - Number(t.startSec)) - Math.abs(Number(a.startSec) - Number(t.startSec)) || Number(i.startSec) - Number(a.startSec) || Number(i.id) - Number(a.id))[0] ?? null;
}
function Qr(e, t) {
  return ((e == null ? void 0 : e.markers) || []).map((r) => r.segment).filter((r) => r && !t.has(r.id));
}
function Hr(e) {
  return e.reviewState === "unreviewed";
}
function Qo(e, t) {
  const r = Number(e.startSec) || 0;
  return r !== t.startSec ? r > t.startSec : Number(e.id) > Number(t.id);
}
function Zo(e, t, r, o, i) {
  if (t < 0)
    return Yo(e.flatMap((s) => s.markers || []), r, o, i);
  const a = e.map((s, l) => ({ lane: s, index: l })).filter(({ lane: s }) => Qr(s, o).some(i)).sort((s, l) => Math.abs(s.index - t) - Math.abs(l.index - t) || +(s.index < t) - +(l.index < t) || s.index - l.index);
  for (const { lane: s } of a) {
    const l = Yo(s.markers, r, o, i);
    if (l) return l;
  }
  return null;
}
function br(e, t) {
  var a;
  const r = (e || []).find((s) => (s.markers || []).some(({ segment: l }) => l.id === t)), o = (a = r == null ? void 0 : r.markers.find((s) => s.segment.id === t)) == null ? void 0 : a.segment;
  if (!o) return null;
  const i = Number(o.startSec) || 0;
  return {
    laneKey: r.key,
    id: o.id,
    startSec: i,
    endSec: Number(o.endSec ?? i) || i
  };
}
function hr(e, t, r = {}) {
  const o = e || [];
  if (o.length === 0) return null;
  const i = new Set(r.removedIds || []);
  if (t == null) {
    const s = { markers: o.flatMap((d) => d.markers || []) }, l = Qr(s, i);
    return l.find(Hr) ?? l[0] ?? null;
  }
  i.add(t.id);
  const a = o.findIndex((s) => s.key === t.laneKey);
  if (a >= 0) {
    const s = Qr(o[a], i).filter(Hr), l = s.find((c) => Qo(c, t));
    if (l) return l;
    const d = s.filter((c) => !Qo(c, t)).at(-1);
    if (d) return d;
  }
  return Zo(o, a, t, i, Hr) ?? Zo(o, a, t, i, () => !0);
}
function il(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function Xo(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function sl() {
  try {
    return Vs(window.localStorage.getItem(Ua));
  } catch {
    return !1;
  }
}
function ll(e) {
  try {
    window.localStorage.setItem(Ua, String(!!e));
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
], dl = /* @__PURE__ */ new Set([
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
function cl(e) {
  return dl.has(e);
}
function Za(e) {
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
function ul(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Qn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(Za).filter(Boolean)]));
  } catch {
    return {};
  }
}
function ml(e = {}) {
  const t = ul(e);
  return Qn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function ea(e, t = 2) {
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
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : Za({
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
function Zr(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function ta(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function fu(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = ta(e.code, t.key), a = ta(t.code, e.key);
  if (!r && !o && !i && !a) return !1;
  const s = i ? t.key : e.key, l = i ? e.code : a ? t.code : o ? e.code : e.code || t.code;
  for (const d of [!1, !0])
    for (const c of [!1, !0])
      for (const u of [!1, !0])
        for (const m of [!1, !0]) {
          const y = {
            key: s,
            code: l,
            ctrlKey: d,
            metaKey: c,
            altKey: u,
            shiftKey: m
          };
          if (Zr(y, e) && Zr(y, t)) return !0;
        }
  return !1;
}
function $n(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function yu(e, t) {
  return [!1, !0].some((r) => $n(e, r) && $n(t, r));
}
function gl(e, t = !1, r = {}) {
  return ml(r).find((o) => $n(o, t) && o.bindings.some((i) => Zr(e, i))) || null;
}
function Xa(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function pl(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Xa).join(" / ") : "Unassigned";
}
function bu(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, pl(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function hu(e) {
  return e === "review" ? "review" : "editor";
}
function ot(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function fl(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function yl(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function bl(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => ot(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: ot(t, e.activeIdentity) || r[0]
  };
}
function hl(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function vu(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => hl(o, i))));
}
function na(e, t) {
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
function vl(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function xl(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function Sl(e, t, r) {
  return e != null && (r == null || t !== r);
}
function kl(e, t, r, o = null) {
  if (r === t.tagId) return null;
  const i = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: r,
    tagName: o || ((i == null ? void 0 : i.tagId) === r ? i.tagName : null)
  };
}
function wl({ tagEditing: e, selectedSegmentIds: t, activeSegmentId: r }, o) {
  return !(e && r === o && (t == null ? void 0 : t.length) === 1 && t[0] === o);
}
function Xr(e, t) {
  return e === t;
}
function Nl(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function Il(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - Vn).at(-1) || null : o.find((i) => i.startSec > t + Vn) || null;
}
function vr(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function ra(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: It.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function xu(e, t = null, r = !1) {
  const o = ra(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function Nn(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function ei(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: Nn(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: Nn(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: Nn(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(Nn(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(Nn(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(Nn(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...io };
  }
}
function Cl(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function ti() {
  try {
    return ei(window.localStorage.getItem(Ka));
  } catch {
    return { ...io };
  }
}
function oa(e) {
  const t = ei(JSON.stringify(e));
  try {
    window.localStorage.setItem(Ka, JSON.stringify(t));
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
function eo(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function ni(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? eo(e.requestedMode) : "basic",
    effectiveMode: i ? eo(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function Tn(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function $l(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Tl(e) {
  const t = [];
  return Tn(e, Jt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), Tn(e, Jt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function Rl(e) {
  return [
    ["general", "General", Jt.settingsGeneral],
    ["shortcuts", "Shortcuts", Jt.settingsShortcuts],
    ["performer-slots", "Performer slots", Jt.settingsPerformerSlots],
    ["derivation", "Derivation", Jt.settingsDerivation]
  ].filter(([, , r]) => Tn(e, r)).map(([r, o]) => [r, o]);
}
function Al(e, t) {
  return e === "segments" && !Tn(
    t,
    Jt.navigationSegmentInventory
  ) || e === "bin" && !Tn(
    t,
    Jt.recyclingBinView
  ) ? "videos" : e;
}
function Ml(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function El(e, t = 0) {
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
}, aa = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: It.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function Dl(e) {
  const t = String(e || "").split(",").filter((r) => It.includes(r));
  return t.length === 0 ? [...It] : [...new Set(t)];
}
function In(e) {
  return ri(e).values;
}
function ri(e) {
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
function ia(e, t) {
  var l;
  const r = sa(t.activitiesCriterion, t.activityId), o = sa(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = ri(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: Ol(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function sa(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function Ol(e, t) {
  return It.includes(e == null ? void 0 : e.value) ? [e.value] : Dl(t);
}
function oi(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Pl(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Ll(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function la(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function jl(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function ct(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function co(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Wr(e, t) {
  const r = new Set(co(t).map((o) => String(ct(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function Qt(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function da(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(Qt).sort().join(",")}`;
}
function ai(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((h) => String(h.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((h) => {
    var p;
    return !((p = h.genderHints) != null && p.length);
  }) && e.length === t.length && !i) {
    const h = [...e].sort((g, S) => String(g.slotDefinitionId).localeCompare(String(S.slotDefinitionId))), p = [...t].sort((g, S) => String(g.name).localeCompare(String(S.name)) || Number(ct(g)) - Number(ct(S)));
    return [{
      assignments: Object.fromEntries(h.map((g, S) => [String(g.slotDefinitionId), String(ct(p[S]))])),
      description: p.map((g) => g.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((h) => t.map((p, g) => ({ performer: p, index: g })).filter(({ performer: p }) => {
    var g;
    return !((g = h.genderHints) != null && g.length) || h.genderHints.some((S) => Qt(S) === Qt(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), u = i ? c.filter((h) => h.length > 0).length : ca(c, t.length);
  if (u === 0) return [];
  const m = new Map(t.map((h, p) => [String(ct(h)), p]));
  function y(h, p, g) {
    if (s.length >= a) return;
    const S = c.slice(h), $ = i ? S.filter((W) => W.length > 0).length : ca(S.map((W) => W.filter((F) => !p.has(String(ct(t[F]))))), t.length);
    if (g + $ < u) return;
    if (h === e.length) {
      if (g !== u) return;
      const W = Object.fromEntries(d.map(({ slot: E, performer: A }) => [String(E.slotDefinitionId), A ? String(ct(A)) : ""])), F = o.length === 0 ? Object.values(W).sort().join(",") : [...new Set(e.map((E) => String(E.label || "")))].map((E) => `${E}:${d.filter(({ slot: A }) => String(A.label || "") === E).map(({ performer: A }) => A ? String(ct(A)) : "").sort().join(",")}`).join("|");
      !l.has(F) && s.length < a && (l.add(F), s.push({
        assignments: W,
        description: d.map(({ slot: E, performer: A }) => o.length ? `${E.label}: ${(A == null ? void 0 : A.name) || "Unassigned"}` : (A == null ? void 0 : A.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const f = e[h], z = [...d].reverse().find(({ slot: W }) => da(W) === da(f)), U = z ? m.get(String(ct(z.performer))) : -1;
    for (const W of c[h]) {
      const F = t[W], E = ct(F);
      if (!(W < U) && !(E == null || !i && p.has(String(E))) && (d.push({ slot: f, performer: F }), i || p.add(String(E)), y(h + 1, p, g + 1), i || p.delete(String(E)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: f, performer: null }), y(h + 1, p, g), d.pop();
  }
  return y(0, /* @__PURE__ */ new Set(), 0), s;
}
function ca(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Fl(e, t) {
  if (!(e != null && e.length) || !(t != null && t.length)) return null;
  const r = e.some((l) => String(l.label || "").trim());
  if (r && e.some((l) => !String(l.label || "").trim())) return null;
  const o = e[0].allowSamePerformerInMultipleSlots === !0;
  if (!r && e.every((l) => {
    var d;
    return !((d = l.genderHints) != null && d.length);
  }) && e.length === t.length && !o) {
    const l = [...e].sort((c, u) => String(c.slotDefinitionId).localeCompare(String(u.slotDefinitionId))), d = [...t].sort((c, u) => String(c.name).localeCompare(String(u.name)) || c.performerId - u.performerId);
    return l.map((c, u) => ({ slot: c, performer: d[u] }));
  }
  const i = /* @__PURE__ */ new Map(), a = [];
  function s(l, d) {
    var u;
    if (i.size > 1) return;
    if (l === e.length) {
      const m = [...new Set(e.map((y) => y.label || ""))].map((y) => `${y}:${a.filter((h) => (h.slot.label || "") === y).map((h) => h.performer.performerId).sort((h, p) => h - p).join(",")}`).join("|");
      i.has(m) || i.set(m, [...a]);
      return;
    }
    const c = e[l];
    for (const m of t)
      !o && d.has(m.performerId) || (u = c.genderHints) != null && u.length && !c.genderHints.some((y) => Qt(y) === Qt(m.gender)) || (a.push({ slot: c, performer: m }), o || d.add(m.performerId), s(l + 1, d), o || d.delete(m.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Bl(e) {
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
function Gl(e, t, r = 20) {
  const o = String(t || "").trim().toLocaleLowerCase(), i = (a) => {
    var d;
    if (!o) return !0;
    const s = String(((d = a.segment) == null ? void 0 : d.tagName) || a.tagName || "").toLocaleLowerCase();
    if (s.includes(o)) return !0;
    let l = -1;
    for (const c of o) {
      const u = s.indexOf(c, l + 1);
      if (u < 0) return !1;
      l = u;
    }
    return !0;
  };
  return (e || []).filter(i).slice(0, Math.max(1, Number(r) || 20));
}
function Kl(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function zl(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function ii(e, t, r) {
  const o = ct, i = new Set((t || []).map(o)), a = new Set((r || []).map(Qt));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), u = d.isVideoPerformer ?? i.has(o(d));
    if (c !== u) return u - c;
    const m = Qt(l.gender || l.genderIdentity), y = Qt(d.gender || d.genderIdentity), h = l.matchesGenderHint ?? a.has(m);
    return (d.matchesGenderHint ?? a.has(y)) - h || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: pe, useId: si, useLayoutEffect: ua, useMemo: Ve, useReducer: Ul, useRef: ue, useState: G, useSyncExternalStore: Hl } = oo, n = oo.createElement, li = "/api/plugins/segment-studio";
function _e(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(sn) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = to();
    return t[e] = r, window.localStorage.setItem(sn, JSON.stringify(t)), r;
  } catch {
    return to();
  }
}
function qe(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(sn) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(sn, JSON.stringify(t));
  } catch {
  }
}
function uo(e) {
  try {
    return JSON.parse(window.localStorage.getItem(sn) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function mo(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(sn) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(sn, JSON.stringify(t));
  } catch {
  }
}
function _l(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function ql(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function Z(e, t, r = 0) {
  var d;
  const o = await Da(`${li}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = _l(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await ql(250 * (r + 1), t == null ? void 0 : t.signal), Z(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function Wl(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${li}${e}`, o = await Da(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: Vl(
      o.headers.get("Content-Disposition")
    )
  };
}
function Vl(e, t = "segment-studio-ai-feedback.zip") {
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
function Ee(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function to() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function di(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function Jl(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function ci(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function Yl(e, t) {
  const { sceneCount: r, segmentCount: o } = ci(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function ui(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = ci(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(Yl(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await Z("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: _e(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return qe(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function ma({ children: e }) {
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
function mi(e) {
  return { ...(Bt[e] || Bt.unreviewed).badge };
}
function gi(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const pi = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function Ql(e, t, r = "not-applicable", o = !1) {
  const i = Bt[e] || Bt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Zl(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Xl(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function ed(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function td(e, t) {
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
function nd(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function ln({ state: e, includeLabel: t = !0 }) {
  const r = Bt[e] || Bt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: mi(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function rd(e, t = null) {
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
function od(e, t = document) {
  return !(e.defaultPrevented || rd(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function wu(e, t = document, r = !1, o = {}) {
  return od(e, t) ? gl(e, r, o) != null : !1;
}
function ad(e, t, r = null) {
  return !(!t || e instanceof Element && (t.contains(e) || r != null && r.contains(e)));
}
function At(e, { onCancel: t, onConfirm: r } = {}) {
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
function id(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function sd({ confirm: e, cancel: t, confirmReady: r }) {
  const o = r && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function go({ confirmRef: e, cancelRef: t, confirmReady: r }) {
  pe(() => {
    const o = requestAnimationFrame(() => sd({
      confirm: e.current,
      cancel: t == null ? void 0 : t.current,
      confirmReady: r
    }));
    return () => cancelAnimationFrame(o);
  }, [r]);
}
function qt(e) {
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
function ga(e, t) {
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
function ur(e, t = !0) {
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
function Dt(e, t = !0) {
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
function mr(e, t) {
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
function fi(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function yi(e) {
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
function ld(e, t) {
  const r = (t || []).map((i) => fi(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: Ct(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function dd(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : ld(e, t);
}
function cd({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
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
  return fo(fi(e, t));
}
function Ct(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function ud(e, t) {
  const r = (d) => Ct(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
    const c = /* @__PURE__ */ new Map();
    for (const u of d || []) {
      const m = r(u);
      c.has(m) || c.set(m, []), c.get(m).push(u);
    }
    return c;
  }, a = i(e), s = i(t), l = [];
  for (const [d, c] of a) {
    const u = s.get(d);
    if (!u || c.length !== u.length)
      continue;
    const m = [...c].sort(o), y = [...u].sort(o);
    m.forEach((h, p) => l.push({
      sourceSlotDefinitionId: h.id,
      derivedSlotDefinitionId: y[p].id
    }));
  }
  return l;
}
function md(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = ud(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function gd(e) {
  const t = Ct(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(Cr).filter(Boolean);
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
function pa(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((u) => u.end <= s && u.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: Nr(o),
    trackCount: Math.max(1, t.length)
  };
}
function pd(e) {
  const t = e.map(Ct), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function fd(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], u = d.length > 0 && d.every((m) => Number(m.performerId) > 0) ? d.map((m) => `${m.slotDefinitionId}:${Number(m.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: u };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [pa({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = pd(l.slots), u = l.slots.filter((g) => !a.has(String(g.slotDefinitionId))), m = o.length === 1 ? l.slots : u, y = m.map((g) => `${c.get(String(g.slotDefinitionId))} · ${g.performerName || `Performer ${g.performerId}`}`).join(" · "), h = [...new Map(m.map((g) => [
          Number(g.performerId),
          { id: Number(g.performerId), name: g.performerName || `Performer ${g.performerId}` }
        ])).values()], p = l.slots.map((g) => ({
          slotDefinitionId: String(g.slotDefinitionId),
          label: c.get(String(g.slotDefinitionId)),
          performer: {
            id: Number(g.performerId),
            name: g.performerName || `Performer ${g.performerId}`
          }
        }));
        s.set(d, {
          ...e,
          key: `${e.key}:performers:${d}`,
          performerLabel: y,
          performers: h,
          performerAssignments: p,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(pa);
}
function an(e, t = [], r = []) {
  const o = /* @__PURE__ */ new Map();
  for (const [s, l] of t.entries())
    for (const d of l.tags || [])
      o.set(d.tagId, {
        segmentGroupId: l.id,
        segmentGroupName: l.name,
        segmentGroupSortOrder: s,
        segmentGroupTagSortOrder: d.sortOrder,
        tagSortName: d.tagSortName || null
      });
  const i = /* @__PURE__ */ new Map();
  for (const s of e) {
    const l = s.tagName || "Tag segment", d = s.tagId == null ? `name:${l}` : `tag:${s.tagId}`;
    if (!i.has(d)) {
      const u = o.get(s.tagId);
      i.set(d, {
        key: d,
        tagId: s.tagId,
        label: l,
        // A segment shown with a new tag has no sort name yet; the group catalog knows it.
        tagSortName: s.tagSortName || (u == null ? void 0 : u.tagSortName) || null,
        segmentGroupId: (u == null ? void 0 : u.segmentGroupId) ?? null,
        segmentGroupName: (u == null ? void 0 : u.segmentGroupName) ?? null,
        segmentGroupSortOrder: (u == null ? void 0 : u.segmentGroupSortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (u == null ? void 0 : u.segmentGroupTagSortOrder) ?? Number.MAX_SAFE_INTEGER,
        segments: []
      });
    }
    i.get(d).segments.push(s);
  }
  const a = /* @__PURE__ */ new Map();
  for (const s of r || [])
    a.has(s.segmentId) || a.set(s.segmentId, []), a.get(s.segmentId).push(s);
  for (const s of a.values())
    s.sort((l, d) => l.sortOrder - d.sortOrder || String(l.slotDefinitionId).localeCompare(String(d.slotDefinitionId)));
  return [...i.values()].sort((s, l) => s.segmentGroupSortOrder - l.segmentGroupSortOrder || s.segmentGroupTagSortOrder - l.segmentGroupTagSortOrder || (s.tagSortName || s.label).localeCompare(l.tagSortName || l.label, void 0, {
    sensitivity: "base"
  }) || s.key.localeCompare(l.key)).flatMap((s) => fd(s, a));
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
    for (const s of It)
      a.counts[s] += Number((r = o.counts) == null ? void 0 : r[s]) || 0;
  }
  return t;
}
function bi(e) {
  return (e || []).some((t) => t.id != null);
}
const yd = {
  group: 38,
  lane: 33,
  segment: 41
};
function bd(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = yd[s.kind];
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
function hi(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function hd(e, t = [], r = !0) {
  const o = new Set(t || []), i = [];
  let a = 0;
  const s = (l, d) => {
    i.push({ ...l, top: a, height: d }), a += d;
  };
  for (const l of e || [])
    if (r && s({ kind: "group", key: `header:${l.key}`, group: l }, 32), !o.has(l.key))
      for (const [d, c] of (l.lanes || []).entries()) {
        const u = Math.max(1.75, c.trackCount * 1.25 + 0.5) * 16;
        s({ kind: "lane", key: c.key, group: l, lane: c, laneIndex: d }, u);
      }
  return { rows: i, height: a };
}
function vd(e, t) {
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
function vi(e, { nativeOnly: t = !1 } = {}) {
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
function fa(e, t) {
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
function Xt(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function Jn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function xd(e) {
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
    }, o ? xd(e.name) : "—"),
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
function xi({ assignments: e, className: t = "" }) {
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
function $r({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = ue(null), i = `performer-slots-${si()}`, [a, s] = G(null);
  function l() {
    var h;
    const c = (h = o.current) == null ? void 0 : h.getBoundingClientRect();
    if (!c) return;
    const u = Math.max(0, Math.min(256, window.innerWidth - 16)), m = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), y = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - u - 8, c.right - u)),
      top: y >= m + 8 ? c.bottom + 4 : Math.max(8, c.top - m - 4),
      width: u
    });
  }
  pe(() => {
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
    a ? Ns(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(xi, {
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
function Sd(e, t) {
  const r = new Set(Xt(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function Si(e, t) {
  return t ? Xt(e).filter((r) => r !== t) : Xt(e);
}
function kd(e, t) {
  const r = Xt(t), o = new Set(Xt(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function Ft(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function ya(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), u = Number.isFinite(c) && c >= d ? c : d, m = d <= o && u >= o, y = m ? 0 : Math.min(Math.abs(o - d), Math.abs(o - u));
    return { contains: m, distance: y, duration: u - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function no(e, t, r, o = null) {
  var u, m, y, h, p, g;
  const i = e.findIndex((S) => S.markers.some(($) => $.segment.id === t));
  if (i < 0) {
    const S = [...((u = e[0]) == null ? void 0 : u.markers) || []];
    return o != null && Number.isFinite(Number(o)) && S.sort(($, f) => ya($, f, o)), ((m = S[0]) == null ? void 0 : m.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((S) => S.segment.id === t);
  if (r === "left" || r === "right") {
    const S = r === "left" ? -1 : 1, $ = Math.min(a.markers.length - 1, Math.max(0, s + S));
    return ((y = a.markers[$]) == null ? void 0 : y.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((h = a.markers[s]) == null ? void 0 : h.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((p = a.markers[s]) == null ? void 0 : p.segment) ?? null : ((g = [...e[l].markers].sort(c ? (S, $) => ya(S, $, Number(o)) : (S, $) => Math.abs(S.segment.startSec - d) - Math.abs($.segment.startSec - d) || S.segment.startSec - $.segment.startSec || S.segment.id - $.segment.id)[0]) == null ? void 0 : g.segment) ?? null;
}
function wd(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = no([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function Nd(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function Id(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function Cd(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [va(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => va(Math.min(s, r + l))))];
}
function $d(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function Td(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function _n(e, t) {
  if (!e || !t) return e;
  const r = new Set(t.removedSegmentIds || []), o = new Map(
    (t.identityChanges || []).map((c) => [c.previousId, c.currentId])
  ), i = new Map(
    [...t.upsertedSegments || [], ...t.upsertedBasicSegments || []].map((c) => [c.id, c])
  ), a = (e.segments || []).filter((c) => !r.has(c.id)).map((c) => i.has(c.id) ? { ...c, ...i.get(c.id) } : c), s = new Set(a.map((c) => c.id));
  for (const c of i.values())
    s.has(c.id) || a.push(c);
  a.sort((c, u) => Number(c.startSec) - Number(u.startSec) || String(c.key || "").localeCompare(String(u.key || "")));
  const l = (e.performerSlots || []).filter((c) => !r.has(c.segmentId) || o.has(c.segmentId)).map((c) => o.has(c.segmentId) ? { ...c, segmentId: o.get(c.segmentId) } : c), d = {};
  for (const [c, u] of Object.entries(
    e.performerSlotRevisions || {}
  )) {
    const m = Number(c);
    r.has(m) && !o.has(m) || (d[o.get(m) ?? c] = u);
  }
  return {
    ...e,
    approvedSetVersion: t.approvedSetVersion || e.approvedSetVersion,
    segments: a,
    performerSlots: l,
    performerSlotRevisions: d
  };
}
function ba(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function Rd(e) {
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
async function Ad(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await ha(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], u = Cd(
        d.startSec,
        d.endSec
      );
      for (const [m, y] of u.entries()) {
        Math.abs(r.currentTime - y) > 5e-4 && (r.currentTime = y, await ha(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const h = await Md(o), p = `example-${l + 1}-frame-${m + 1}`;
        c.push({ fieldName: p, timestampSec: y }), s.push({
          fieldName: p,
          file: new File(
            [h],
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
function ha(e, t) {
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
function Md(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function va(e) {
  return Math.round(e * 1e3) / 1e3;
}
function Iu(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Ed(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function Cu(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function $u(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Tu(e, t) {
  const r = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...r.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Yt(e, t, r, o) {
  const i = (r || []).map((d) => ({ ...d, segmentId: t })), a = e.performerSlots || [], s = a.findIndex((d) => d.segmentId === t), l = a.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...i), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function Dd(e, t) {
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
function Rn(e, t) {
  return !e || !t ? !1 : e.itemId != null && e.itemId === t.itemId || e.nativeSegmentId != null && e.nativeSegmentId === t.nativeSegmentId ? !0 : e.id != null && e.id === t.id;
}
function bo(e, t) {
  return (e || []).some((r) => (t || []).some((o) => Rn(r, o)));
}
function Tt(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function ki(e, t) {
  return (e || []).find((r) => Rn(t, r)) || null;
}
function wi(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Od(e, t) {
  var r;
  return ((r = e.running) == null ? void 0 : r.kind) === t;
}
function Ru(e) {
  return e.running != null || e.queued.length > 0;
}
const xa = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
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
function Pd({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let r = 1, o = null, i = [], a = null, s = !1, l = 0, d = 0;
  const c = () => !t && d < l, u = /* @__PURE__ */ new Map();
  let m = xa;
  const y = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set();
  let p = [];
  function g() {
    m = o == null && i.length === 0 && a == null ? xa : Object.freeze({
      running: o ? gr(o) : null,
      queued: Object.freeze(i.map(gr)),
      lastFailure: a
    });
    for (const N of [...h]) N();
    if (o == null && i.length === 0) {
      const N = p;
      p = [];
      for (const M of N) M();
    }
  }
  function S(N, M) {
    y.set(N.id, M.status), N.resolve(M);
  }
  function $(N) {
    if (N.dependsOn == null) return "met";
    const M = y.get(N.dependsOn);
    return M === "fulfilled" ? "met" : M != null ? "failed" : "pending";
  }
  function f(N) {
    o = N;
    const M = { ...e(), taskId: N.id, targets: N.targets };
    M.resolveTargets = () => N.targets.map((T) => ki(M.segments, T)).filter(Boolean), g();
    let B;
    try {
      B = N.run(M);
    } catch (T) {
      B = Promise.reject(T);
    }
    Promise.resolve(B).then(
      (T) => z(N, { status: "fulfilled", value: T }),
      (T) => z(N, { status: "rejected", error: T })
    );
  }
  function z(N, M) {
    N.settled || (N.settled = !0, S(N, M), !s && (o = null, M.status === "rejected" && (a = Object.freeze({ id: N.id, kind: N.kind, error: M.error })), g(), l += 1, t && U()));
  }
  function U() {
    if (s || o != null || c()) return;
    let N = !1;
    for (let M = 0; M < i.length; M += 1) {
      const B = i[M], T = $(B);
      if (T === "failed") {
        i = i.filter((k) => k !== B), S(B, { status: "dropped", reason: "dependency-failed" }), N = !0, M -= 1;
        continue;
      }
      if (T !== "pending" && !(B.exclusive && M > 0) && !i.slice(0, M).some((k) => bo(k.targets, B.targets)) && !(B.ready && !B.ready(e(), gr(B)))) {
        i = i.filter((k) => k !== B), f(B);
        return;
      }
    }
    N && g();
  }
  function W(N) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((H) => H.exclusive) || o != null && N.whenBusy !== "enqueue" || N.exclusive && (o != null || i.length > 0 || c())) return null;
    let B;
    const T = new Promise((H) => {
      B = H;
    }), k = {
      id: r++,
      kind: N.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: N.lockId ?? -1,
      targets: Object.freeze((N.targets || []).map(E)),
      exclusive: N.exclusive === !0,
      dependsOn: N.dependsOn ?? null,
      ready: N.ready || null,
      meta: N.meta ?? null,
      run: N.run,
      resolve: B
    };
    return i = [...i, k], g(), U(), { id: k.id, done: T };
  }
  function F(N = {}) {
    let M = null;
    const B = W({
      ...N,
      whenBusy: "reject",
      run: () => new Promise((k) => {
        M = k;
      })
    });
    if (!B) return null;
    if (M == null)
      return w((k) => k.id === B.id), null;
    let T = !1;
    return () => {
      T || (T = !0, M(), (o == null ? void 0 : o.id) === B.id && z(o, { status: "fulfilled", value: void 0 }));
    };
  }
  function E(N) {
    return (N == null ? void 0 : N.id) == null || N.itemId != null || N.nativeSegmentId != null ? N : u.get(N.id) || N;
  }
  function A(N, M) {
    u.set(N, { ...M });
    let B = !1;
    for (const T of i)
      T.targets.some((k) => k.id === N && k.itemId == null && k.nativeSegmentId == null) && (T.targets = Object.freeze(T.targets.map((k) => k.id === N ? { ...M } : k)), B = !0);
    return B && g(), B;
  }
  function w(N) {
    const M = i.filter((B) => N(gr(B)));
    if (M.length === 0) return 0;
    i = i.filter((B) => !M.includes(B));
    for (const B of M) S(B, { status: "cancelled" });
    return g(), U(), M.length;
  }
  return {
    enqueue: W,
    acquire: F,
    cancel: w,
    retarget: A,
    stableIdentity: E,
    // The host reads `settledCount()` while rendering and reports it here once that render commits.
    settledCount: () => l,
    markCommitted(N = l) {
      d = Math.max(d, N);
    },
    poke: () => U(),
    subscribe(N) {
      return h.add(N), () => h.delete(N);
    },
    getSnapshot: () => m,
    whenIdle() {
      return o == null && i.length === 0 ? Promise.resolve() : new Promise((N) => p.push(N));
    },
    dispose() {
      if (s) return;
      const N = i;
      i = [], s = !0;
      for (const B of N) S(B, { status: "cancelled" });
      h.clear();
      const M = p;
      p = [];
      for (const B of M) B();
    }
  };
}
let Ld = 1;
function _t() {
  return `pending-${Ld++}`;
}
function jd(e) {
  return e.sort((t, r) => t.startSec - r.startSec || t.id - r.id);
}
function xr(e, t) {
  return (t || []).some((r) => Rn(r, e));
}
function Fd(e, t) {
  return [...e || [], {
    id: t.id ?? _t(),
    taskId: t.taskId ?? null,
    op: t.op,
    targets: t.targets || (t.segment ? [{ id: t.segment.id }] : []),
    values: t.values || null,
    segment: t.segment || null,
    meta: t.meta || null,
    settled: !1
  }];
}
function Ni(e, t) {
  return t && (e || []).find((r) => {
    var o;
    return ((o = r.meta) == null ? void 0 : o.kind) === "held-tag" && !r.settled && xr(t, r.targets);
  }) || null;
}
function Bd(e) {
  return (e || []).filter((t) => t.op === "insert" && !t.settled).map((t) => t.segment);
}
function Ii(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function Ci(e, t) {
  const r = (e || []).filter((o) => !Ii(o, t));
  return r.length === (e || []).length ? e : r;
}
function $i(e, t) {
  let r = !1;
  const o = (e || []).map((i) => i.settled || !Ii(i, t) ? i : (r = !0, { ...i, settled: !0, settledDetail: null }));
  return r ? o : e;
}
function Gd(e, t, r) {
  let o = !1;
  const i = (e || []).map((a) => a.targets.some((s) => s.id === t && s.itemId == null && s.nativeSegmentId == null) ? (o = !0, {
    ...a,
    targets: a.targets.map((s) => s.id === t ? { ...r } : s)
  }) : a);
  return o ? i : e;
}
function Kd(e, t) {
  if (!t || t.length === 0) return e;
  let r = [...e || []];
  for (const o of t)
    if (o.op === "insert")
      r.some((i) => Rn(o.segment, i)) || r.push(o.segment);
    else if (o.op === "patch")
      r = r.map((i) => xr(i, o.targets) ? { ...i, ...o.values } : i);
    else if (o.op === "remove")
      r = r.filter((i) => !xr(i, o.targets));
    else if (o.op === "merge") {
      const [i, ...a] = o.targets;
      r = r.filter((s) => !xr(s, a)).map((s) => Rn(i, s) ? { ...s, ...o.values } : s);
    }
  return jd(r);
}
function Ti(e, t) {
  if (!e || e.length === 0) return e;
  const r = [
    ...(t == null ? void 0 : t.segments) || [],
    ...e.filter((a) => a.op === "insert" && !a.settled).map((a) => a.segment)
  ];
  let o = !1;
  const i = [];
  for (const a of e) {
    if (a.op !== "insert" && !a.targets.some((s) => r.some((l) => Rn(s, l)))) {
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
function zd(e, t, r) {
  return r ? Ci(e, t) : $i(e, t);
}
function Ud(e, t) {
  switch (t.type) {
    case "confirm":
      return zd(e, t.key, t.applied);
    case "add":
      return Fd(e, t.entry);
    case "discard":
      return Ci(e, t.key);
    case "settle":
      return $i(e, t.key);
    case "retarget":
      return Gd(e, t.temporaryId, t.identity);
    case "prune":
      return Ti(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
function Sa(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function Hd(e) {
  const { acquireSaveLock: t, compatibilityMode: r, dispatchPendingChanges: o, enqueueSave: i, pendingChanges: a, retargetSaveTasks: s, currentTime: l, detail: d, editorFilters: c, endInput: u, hideDerivedSegments: m, historyRef: y, mediaDuration: h, onConflict: p, onDetailChange: g, onReload: S, optimisticSegmentIdRef: $, pendingDuplicateRef: f, pendingFirstSegmentStartSecRef: z, pendingTagEditSegmentIdRef: U, performerSlots: W, replaceSegmentSelection: F, savingSegmentId: E, segments: A, selectedSegment: w, selectedSegmentIdRef: N, selectedSegments: M, selectionAnchorIdRef: B, selectionRangeBaseIdsRef: T, setCreatingSegmentId: k, setEditorFilters: H, setFirstSegmentTagOpen: V, setHideDerivedSegments: _, setHistory: ne, setHistoryOpen: de, setPublishApprovedError: ye, setSaveMessage: D, setSelectedSegmentGroupKey: ae, setSelectedSegmentId: le, setSelectedSegmentIds: X, setTagEditing: ce, startInput: xe, tagEditingRef: Ce, timelineDuration: Pe, video: fe } = e;
  function Y(j) {
    y.current = j || Vt, ne(y.current);
  }
  async function be(j, oe, I, q, P = null) {
    var Q;
    try {
      const he = await Z(`/videos/${fe.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: y.current.revision,
          kind: j,
          label: oe,
          beforeState: I,
          afterState: q,
          receiptId: P
        })
      });
      return Y(he), !0;
    } catch (he) {
      return he.status === 409 && ((Q = he.payload) != null && Q.current) && Y(he.payload.current), D("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function C(j, oe, I = !0, q = null, P = !1, Q = oe, he = !0) {
    if (!j || E != null) return null;
    const me = t("segment", j.id);
    if (!me) return null;
    try {
      return await ee(j, oe, {
        recordHistory: I,
        historyLabel: q,
        optimisticValues: P ? Q : null,
        restoreSelectionOnFailure: he
      });
    } finally {
      me();
    }
  }
  async function ee(j, oe, {
    recordHistory: I = !0,
    historyLabel: q = null,
    optimisticValues: P = null,
    pendingChangeId: Q = null,
    restoreSelectionOnFailure: he = !0,
    onReload: me = S,
    onConflict: Te = p
  } = {}) {
    var gt;
    const mt = M.map((et) => et.id), je = N.current, Re = I && !r ? crypto.randomUUID() : null;
    D(I ? "Saving directly to Cove…" : "Restoring history…");
    const Ze = Q ?? (P ? _t() : null);
    P && !Q && o({
      type: "add",
      entry: { id: Ze, op: "patch", targets: [Tt(j)], values: P }
    });
    const it = (et) => {
      Ze && o({ type: "confirm", key: Ze, applied: et });
    };
    try {
      if (r && j.nativeSegmentId == null && j.itemId != null) {
        const st = `draft-update:${fe.id}:${j.itemId}:${j.revision}:${oe.tagId}:${oe.startSec}:${oe.endSec ?? "open"}:${oe.reviewState ?? j.reviewState}`, ze = await Z(`/videos/${fe.id}/drafts/${j.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(st),
            expectedRevision: j.revision,
            startSec: oe.startSec,
            endSec: oe.endSec,
            tagId: oe.tagId,
            reviewState: oe.reviewState
          })
        });
        qe(st), ze.performerSlots != null && g((Ye) => Yt(Ye, j.id, ze.performerSlots, ze.performerSlotRevision), fe.id);
        const Je = {
          ...j,
          ...ze.draft,
          id: j.id,
          itemId: j.itemId
        };
        return I && await be(
          "segment.update",
          q || "Changed segment",
          ur(j, r),
          ur(
            Je,
            r
          )
        ), Sa(j, oe, r) ? it(await me() != null) : (g((Ye) => ({
          ...Ye,
          approvedSetVersion: ze.approvedSetVersion || Ye.approvedSetVersion,
          segments: (Ye.segments || []).map((We) => We.id === j.id ? Je : We).sort((We, ut) => We.startSec - ut.startSec || We.id - ut.id)
        }), fe.id), it(!0)), D(((gt = ze.draft) == null ? void 0 : gt.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), Je;
      }
      const et = await Z(`/videos/${fe.id}/segments/${j.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...oe,
          expectedUpdatedAt: j.updatedAt,
          historyReceiptId: Re
        })
      }), ft = {
        ...j,
        ...et,
        reviewState: oe.reviewState ?? j.reviewState
      };
      return Sa(j, oe, r) ? it(await me() != null) : (g((st) => ({
        ...st,
        segments: (st.segments || []).map((ze) => ze.id === j.id ? ft : ze).sort((ze, Je) => ze.startSec - Je.startSec || ze.id - Je.id)
      }), fe.id), it(!0)), I && await be(
        "segment.update",
        q || "Changed segment",
        ur(j, r),
        ur(
          ft,
          r
        ),
        Re
      ), D(I ? "Saved to Cove" : "History restored"), ft;
    } catch (et) {
      return Ze && o({ type: "discard", key: Ze }), Ze && he && (X(mt), le(je), B.current = je, T.current = []), et.status === 409 ? (D("Conflict — loading the latest segment…"), await Te()) : D(et.message || "Unable to save the segment."), null;
    }
  }
  async function R() {
    if (!r) return !1;
    const j = A.filter((q) => !q.published && q.reviewState === "approved").length;
    if (j === 0 || E != null) return !1;
    const oe = `complete-review:${fe.id}:${d.approvedSetVersion}`, I = t("publish", -1);
    if (!I) return !1;
    ye(""), D(`Publishing ${j} Approved draft${j === 1 ? "" : "s"}…`);
    try {
      const q = await Z(`/videos/${fe.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(oe),
          expectedApprovedSetVersion: d.approvedSetVersion
        })
      });
      qe(oe), Y(Vt), de(!1);
      const P = await S(), Q = Nl(
        A,
        N.current,
        q.published
      ), he = Q ? ot(P == null ? void 0 : P.segments, Q) : null;
      return he && le(he.id), D(`${q.published.length} Approved draft${q.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (q) {
      const P = q.status === 409 ? "The approved drafts changed. Review the updated list and try again." : q.message || "Unable to publish the approved drafts.";
      return q.status === 409 && await p(), ye(P), D(P), !1;
    } finally {
      I();
    }
  }
  async function v(j = null, oe = null) {
    if (E != null || b()) return;
    const I = j != null ? z.current : null, q = Number.isFinite(I) ? I : l, P = Math.min(Pe, q + 20);
    if (P <= q) {
      D("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const Q = xl(A, w, j);
    if (Q.kind === "choose-tag") {
      z.current = q, D(""), V(!0);
      return;
    }
    if (Q.kind === "invalid-selection") {
      D("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: he } = Q, me = `create-draft:${fe.id}:${he}:${q}`, Te = r ? null : crypto.randomUUID(), mt = N.current, je = {
      ...w || {},
      id: $.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: he,
      tagName: oe || (w == null ? void 0 : w.tagName) || "Tag segment",
      tagSortName: he === (w == null ? void 0 : w.tagId) && (w == null ? void 0 : w.tagSortName) || null,
      startSec: q,
      endSec: P,
      // Full mode creates manual drafts already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, Re = Ed(d, je), Ze = Ft(
      an(Re.segments, Re.segmentGroups || [], Re.performerSlots || []),
      je.id
    ), it = i({
      kind: "create",
      lockId: -1,
      run: (et) => gt(et)
    });
    if (!it) return;
    await it.done;
    async function gt({ onReload: et, taskId: ft }) {
      var ze;
      const st = _t();
      o({ type: "add", entry: { id: st, taskId: ft, op: "insert", segment: je } }), V(!1), Q.openTagEditor && (k(je.id), U.current = je.id, ce(!0)), F(je.id), ae(Ze);
      try {
        let Je;
        if (r) {
          const ut = await Z(`/videos/${fe.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: _e(me), tagId: he, startSec: q, endSec: P })
          });
          qe(me), Je = { itemId: (ze = ut.draft) == null ? void 0 : ze.itemId }, ut.performerSlots != null && g((yt) => Yt(yt, je.id, ut.performerSlots, ut.performerSlotRevision), fe.id);
        } else
          Je = { nativeSegmentId: (await Z(`/videos/${fe.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: he,
              startSec: q,
              endSec: P,
              historyReceiptId: Te
            })
          })).id };
        z.current = null, V(!1);
        const Ye = await et();
        if (o({ type: "discard", key: st }), !Ye) {
          g((ut) => Yt(ut, je.id, []), fe.id), F(mt), D(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${Q.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const We = ot(Ye == null ? void 0 : Ye.segments, Je);
        We ? (o({ type: "retarget", temporaryId: je.id, identity: Tt(We) }), s(je.id, Tt(We)), Q.openTagEditor && (Ce.current && (U.current = We.id), k(We.id)), F(We.id), ae(Ft(
          an(Ye.segments || [], Ye.segmentGroups || [], Ye.performerSlots || []),
          We.id
        )), r || await be(
          "segment.create",
          "Created segment",
          Dt([], !1),
          Dt([We], !1),
          Te
        )) : (ce(!1), D(`Segment created, but it could not be selected${Q.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (Je) {
        throw o({ type: "discard", key: st }), F(mt), j != null && V(!0), D(Je.message || "Unable to create the draft."), Je;
      } finally {
        k(null);
      }
    }
  }
  function b() {
    return Ni(a, w) ? (D("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function x() {
    if (M.length !== 1 || !w || E != null || b()) return;
    const j = l;
    if (j <= w.startSec || w.endSec != null && j >= w.endSec) {
      D("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const oe = `split-draft:${w.itemId}:${w.revision}:${j}`, I = r ? null : Dt([w], !1), q = r ? null : crypto.randomUUID(), P = t("split", w.id);
    if (P)
      try {
        let Q = null;
        r && w.nativeSegmentId == null ? (await Z(`/videos/${fe.id}/drafts/${w.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(oe),
            expectedRevision: w.revision,
            splitSec: j
          })
        }), qe(oe)) : Q = { nativeSegmentId: (await Z(`/videos/${fe.id}/segments/${w.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: w.updatedAt,
            splitSec: j,
            historyReceiptId: q
          })
        })).id };
        const he = await S();
        if (!r) {
          const me = [
            ot(he == null ? void 0 : he.segments, {
              nativeSegmentId: w.nativeSegmentId ?? w.id
            }),
            ot(
              he == null ? void 0 : he.segments,
              Q
            )
          ].filter(Boolean);
          await be(
            "segment.split",
            "Split segment",
            I,
            Dt(me, !1),
            q
          );
        }
        D(r ? `Segment split; both ranges remain ${w.reviewState}.` : "Segment split.");
      } catch (Q) {
        Q.status === 409 ? await p() : D(Q.message || "Unable to split the draft.");
      } finally {
        P();
      }
  }
  async function O(j = !1) {
    if (M.length !== 1 || !w || E != null || b()) return;
    const oe = j ? l : w.startSec, I = vl(fe.id, w, j, oe), q = r ? null : crypto.randomUUID(), P = w, Q = N.current, he = P.endSec == null ? null : P.endSec - P.startSec, me = {
      ...P,
      id: $.current--,
      itemId: null,
      nativeSegmentId: null,
      startSec: oe,
      endSec: he == null ? null : oe + he,
      // Full mode creates the copy already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : P.reviewState,
      revision: 0,
      updatedAt: null
    }, Te = (W || []).filter((Re) => Re.segmentId === P.id), mt = i({
      kind: "duplicate",
      lockId: -1,
      targets: [Tt(P)],
      run: (Re) => je(Re)
    });
    if (!mt) return;
    await mt.done;
    async function je({ onReload: Re, onConflict: Ze, taskId: it }) {
      var ft, st;
      const gt = _t();
      o({ type: "add", entry: { id: gt, taskId: it, op: "insert", segment: me } }), Te.length > 0 && g((ze) => Yt(ze, me.id, Te), fe.id), j || (k(me.id), U.current = me.id, ce(!0)), F(me.id);
      const et = () => {
        o({ type: "discard", key: gt }), Te.length > 0 && g((ze) => Yt(ze, me.id, []), fe.id);
      };
      try {
        const ze = ((ft = f.current) == null ? void 0 : ft.operationKey) === I ? f.current : null;
        let Je = (ze == null ? void 0 : ze.duplicateIdentity) ?? null;
        if (Je == null && r && P.nativeSegmentId == null) {
          const yt = await Z(`/videos/${fe.id}/drafts/${P.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(I),
              expectedRevision: P.revision,
              startSec: j ? oe : null
            })
          });
          Je = na(!1, yt), f.current = { operationKey: I, duplicateIdentity: Je };
        } else if (Je == null) {
          const yt = await Z(`/videos/${fe.id}/segments/${P.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: P.updatedAt,
              startSec: j ? oe : null,
              historyReceiptId: q
            })
          });
          Je = na(!0, yt), f.current = { operationKey: I, duplicateIdentity: Je };
        }
        const Ye = await Re();
        et();
        const We = ot(Ye == null ? void 0 : Ye.segments, Je);
        if (!We) {
          ce(!1), F(Q), D(Ye ? "Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection." : "Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.");
          return;
        }
        o({ type: "retarget", temporaryId: me.id, identity: Tt(We) }), s(me.id, Tt(We));
        const ut = Ya(
          We,
          Ye.performerSlots || [],
          c,
          m,
          Ye.segmentGroups || []
        );
        H(ut.filters), _(ut.hideDerivedSegments), !j && Ce.current && (U.current = We.id), F(We.id), ae(Ft(
          an(Ye.segments || [], Ye.segmentGroups || [], Ye.performerSlots || []),
          We.id
        )), r && P.nativeSegmentId == null && qe(I), f.current = null, D(j ? "Duplicate created at the playhead." : "Duplicate created in place."), r || await be(
          "segment.duplicate",
          "Duplicated segment",
          Dt([], !1),
          Dt([We], !1),
          q
        );
      } catch (ze) {
        throw et(), ce(!1), F(Q), ((st = f.current) == null ? void 0 : st.operationKey) === I ? D("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : ze.status === 409 ? await Ze() : D(ze.message || "Unable to duplicate the draft."), ze;
      } finally {
        k(null);
      }
    }
  }
  async function re() {
    if (M.length !== 1 || !w) return;
    const j = Number(xe), oe = u.trim() === "" ? null : Number(u), I = Wo(j, oe, h);
    if (I.error) {
      D(I.error);
      return;
    }
    if (j === w.startSec && oe === w.endSec) {
      D("Timing is unchanged.");
      return;
    }
    await C(w, { startSec: j, endSec: oe, tagId: w.tagId }, !0, null, !0);
  }
  async function te(j, oe) {
    if (M.length !== 1 || !w) return;
    const I = Wo(j, oe, h);
    if (I.error) {
      D(I.error);
      return;
    }
    if (j === w.startSec && oe === w.endSec) {
      D("Timing is unchanged.");
      return;
    }
    await C(w, { startSec: j, endSec: oe, tagId: w.tagId }, !0, null, !0);
  }
  return { acceptHistory: Y, recordHistoryAction: be, mutateSegment: C, runSegmentMutation: ee, completeReview: R, createSegment: v, splitSegment: x, duplicateSegment: O, saveTiming: re, applyShortcutTiming: te };
}
function _d() {
  const [e, t] = G(() => typeof window < "u" && window.matchMedia(Ho).matches);
  return pe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Ho), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function qd() {
  const [e, t] = G(() => typeof window < "u" && window.matchMedia(_o).matches);
  return pe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(_o), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Wd() {
  try {
    return Hs(window.localStorage.getItem(Ba));
  } catch {
    return { ...Rt };
  }
}
function Vd() {
  try {
    return Xt(JSON.parse(window.localStorage.getItem(Ga) || "[]"));
  } catch {
    return [];
  }
}
function Jd(e) {
  try {
    window.localStorage.setItem(Ga, JSON.stringify(Xt(e)));
  } catch {
  }
}
function Yd(e) {
  try {
    window.localStorage.setItem(Ba, JSON.stringify(e));
  } catch {
  }
}
function Qd() {
  try {
    const e = JSON.parse(window.localStorage.getItem(za) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Zd(e) {
  try {
    return window.localStorage.setItem(za, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Xd({ status: e }) {
  const t = pi[e];
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
function Zt({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, It.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...mi(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${Bt[t].symbol}${e[t]}`)));
}
function ec({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: u, shortcutRef: m }) {
  const y = co(a), [h, p] = G(() => Wr(o, y)), [g, S] = G(!1), [$, f] = G(""), z = ue(!1), U = o.map((N) => `${N.slotDefinitionId}:${N.performerId || ""}`).join("|"), W = y.map((N) => ct(N)).join("|"), F = ai(
    o,
    y
  );
  pe(() => {
    p(Wr(o, y)), f("");
  }, [t, r, U, W]);
  async function E(N = h) {
    if (!z.current) {
      z.current = !0, S(!0), f("Saving performer slots…");
      try {
        const M = Wr(o.map((k) => ({
          ...k,
          performerId: N[k.slotDefinitionId] || null
        })), y), B = o.map((k) => {
          const H = M[k.slotDefinitionId] ? Number(M[k.slotDefinitionId]) : null, V = y.find((_) => String(ct(_)) === String(H));
          return {
            ...k,
            performerId: H,
            performerName: (V == null ? void 0 : V.name) || null
          };
        });
        if (s(B) === !1) {
          f("");
          return;
        }
        const T = await Z(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((k) => ({ slotDefinitionId: k.slotDefinitionId, performerId: M[k.slotDefinitionId] ? Number(M[k.slotDefinitionId]) : null }))
          })
        });
        f("Performer slots saved."), await l(T, {
          beforeState: wr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: wr([{
            segmentId: t,
            itemId: r,
            revision: T.revision,
            slots: T.slots || []
          }])
        });
      } catch (M) {
        d && await d(o, M), M.status === 409 ? (f("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : f(M.message || "Unable to save performer slots.");
      } finally {
        z.current = !1, S(!1);
      }
    }
  }
  function A(N, M) {
    f(`Option ${M + 1} applied; save to confirm.`), p({ ...h, ...N.assignments });
  }
  async function w(N) {
    const M = { ...h, ...N.assignments };
    p(M), await E(M);
  }
  return pe(() => {
    if (m)
      return m.current = (N) => z.current || !F[N] ? !1 : (w(F[N]), !0), () => {
        m.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    F.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, F.map((N, M) => n("button", {
        key: M,
        type: "button",
        disabled: g,
        onClick: () => A(N, M),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${M + 1}: ${N.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, M + 1),
        n("span", { key: "description" }, N.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${F.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((N) => n("label", { key: N.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Ct(N)),
      (N.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(N.genderHints || []).map(Cr).join(" · ")}`) : null,
      n("select", { key: "select", value: h[N.slotDefinitionId] || "", disabled: g, onChange: (M) => p({ ...h, [N.slotDefinitionId]: M.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ii(y, y, N.genderHints).map((M) => n("option", { key: ct(M), value: ct(M) }, M.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: u, type: "button", disabled: g, onClick: () => E(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, $)])
  ]);
}
function tc({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a, acquireSaveLock: s = () => () => {
} }) {
  var E;
  const l = ((E = t[0]) == null ? void 0 : E.slots) || [], d = co(r), c = ai(
    l,
    d
  ), u = "__mixed__", m = () => Object.fromEntries(l.map((A, w) => {
    const N = t.map((M) => {
      var B;
      return String(((B = M.slots[w]) == null ? void 0 : B.performerId) || "");
    });
    return [A.slotDefinitionId, N.every((M) => M === N[0]) ? N[0] : u];
  })), [y, h] = G(m), [p, g] = G(!1), [S, $] = G(""), f = ue(!1), z = t.map((A) => `${A.itemId ?? `native:${A.segmentId}`}:${A.revision}:${A.slots.map((w) => `${w.slotDefinitionId}:${w.performerId || ""}`).join(",")}`).join("|");
  pe(() => {
    h(m());
  }, [z]);
  async function U(A = y) {
    if (f.current) return;
    const w = s();
    if (!w) {
      $("Wait for the current save to finish before saving performer slots.");
      return;
    }
    f.current = !0, g(!0), $(`Saving performer slots for ${t.length} segments…`);
    const N = [];
    try {
      for (const M of t) {
        const B = M.slots.map((k, H) => {
          const V = A[l[H].slotDefinitionId];
          return {
            slotDefinitionId: k.slotDefinitionId,
            performerId: V === u ? k.performerId || null : V ? Number(V) : null
          };
        }), T = await Z(M.itemId != null ? `/videos/${e}/drafts/${M.itemId}/slots` : `/videos/${e}/segments/${M.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: M.revision, assignments: B })
        });
        N.push({
          segmentId: M.segmentId,
          itemId: M.itemId,
          revision: T.revision,
          slots: T.slots || []
        });
      }
      $("Performer slots saved."), await o({
        beforeState: wr(t),
        afterState: wr(N)
      });
    } catch (M) {
      const B = await i();
      M.status === 409 ? $(B ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : $(M.message || (B ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      f.current = !1, g(!1), w();
    }
  }
  function W(A, w) {
    $(`Option ${w + 1} applied; save to confirm.`), h({ ...y, ...A.assignments });
  }
  async function F(A) {
    const w = { ...y, ...A.assignments };
    h(w), await U(w);
  }
  return pe(() => {
    if (a)
      return a.current = (A) => f.current || !c[A] ? !1 : (F(c[A]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, c.map((A, w) => n("button", {
        key: w,
        type: "button",
        disabled: p,
        onClick: () => W(A, w),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${w + 1} to all selected segments: ${A.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, w + 1),
        n("span", { key: "description" }, A.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${c.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, l.map((A) => n("label", {
      key: A.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Ct(A)),
      n("select", {
        key: "select",
        value: y[A.slotDefinitionId] || "",
        disabled: p,
        onChange: (w) => h({ ...y, [A.slotDefinitionId]: w.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        y[A.slotDefinitionId] === u ? n("option", { key: "mixed", value: u }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ii(d, d, A.genderHints).map((w) => n("option", {
          key: ct(w),
          value: ct(w)
        }, w.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: p,
        onClick: () => U(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, S)
    ])
  ]);
}
function Gt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function nc(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return Gt(t);
  const o = [...new Set(r.map((i) => Gt(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function Tr() {
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
function rc({ hidden: e }) {
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
function oc({ segment: e, provenance: t }) {
  var u;
  const [r, o] = G(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = nc(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
        (u = e.sourceKey) != null && u.includes("stash-marker-studio") ? "Imported from Stash Marker Studio. Detailed run and model information was not recorded for this legacy segment." : "No detailed provenance was recorded for this segment."
      ) : s.map((m) => {
        const y = m.modelIdentifier || m.modelKey, h = m.value == null ? null : typeof m.value == "string" ? m.value : JSON.stringify(m.value);
        return n("div", { key: m.id || `${m.fieldKey}:${m.sourceKey}:${m.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            Gt(m.sourceKey, m.sourceDisplayName)
          ),
          m.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${m.fieldKey}${h == null ? "" : ` · ${h}`}`
          ) : null,
          m.relation === "inherited" ? n("div", { key: "relation", className: "text-secondary" }, "Inherited origin") : null,
          y ? n(
            "div",
            { key: "model", className: "text-secondary" },
            `Model ${y}${m.modelVersion ? ` · ${m.modelVersion}` : ""}`
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
function ac({
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
  saveMessage: u
}) {
  const [m, y] = G([]), h = e.flatMap(($) => $.lanes.map((f) => f.key)), p = h.join("|");
  pe(() => {
    const $ = new Set(h);
    y((f) => f.filter((z) => $.has(z)));
  }, [p]);
  const g = Nr(t), S = !!vi(
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
        `${h.length} swimlane${h.length === 1 ? "" : "s"} · ${e.length} group${e.length === 1 ? "" : "s"}`
      ),
      a ? n(Zt, { key: "counts", counts: g }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      cd({ mergeable: S, reviewable: a, tagEditable: s, slotsEditable: l })
    ),
    l ? n("button", {
      key: "slots",
      ref: c,
      type: "button",
      onClick: d,
      className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/40"
    }, "Edit performer slots") : null,
    u ? n("p", {
      key: "save-message",
      role: "status",
      "aria-live": "polite",
      className: "text-xs text-secondary"
    }, u) : null,
    ...e.map(($) => n("section", {
      key: $.key,
      "data-selected-segment-group": $.key,
      className: "space-y-1.5"
    }, [
      n("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        n("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, $.name),
        n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${$.selectedCount} selected`)
      ]),
      ...$.lanes.map((f) => {
        const z = m.includes(f.key), U = f.markers.some(({ segment: F }) => F.id === r), W = `selected-segment-lane-${f.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: f.key,
          "data-selected-segment-lane": f.key,
          className: `rounded-md border ${U ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": z,
            "aria-controls": W,
            "aria-current": U ? "true" : void 0,
            onClick: () => y((F) => z ? F.filter((E) => E !== f.key) : [...F, f.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, z ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Jn(f)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(f.selectedCount)),
            a ? n(Zt, { key: "states", counts: f.counts }) : null
          ]),
          z ? n("div", {
            key: "segments",
            id: W,
            className: "space-y-1 border-t border-border p-1.5"
          }, f.markers.map(({ segment: F }) => {
            const E = F.endSec == null ? Ee(F.startSec) : `${Ee(F.startSec)} – ${Ee(F.endSec)}`;
            return n("button", {
              key: F.id,
              type: "button",
              onClick: () => i(F),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${F.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${F.tagName || "Segment"}, ${F.reviewState}, ${E}` : `${F.tagName || "Segment"}, ${E}`,
              "aria-current": F.id === r ? "true" : void 0
            }, [
              a ? n(ln, {
                key: "state",
                state: F.reviewState,
                includeLabel: !1
              }) : null,
              F.isDerived ? n(Tr, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, E),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                Gt(F.sourceKey)
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
}, ka = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], wa = [
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
function Ri(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function Na(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function fr(e, t, r, o = null) {
  const i = Na(t), a = Na(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function ic(e, t, r = null) {
  var m, y, h;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (m = t.hasSegmentsCriterion) == null ? void 0 : m.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), fr(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), fr(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), fr(o, t.performersCriterion, "performer"), fr(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = Ia(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = Ia(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((y = t.reviewStateCriterion) == null ? void 0 : y.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const u = (h = t.shotBoundariesCriterion) == null ? void 0 : h.value;
  return r && typeof u == "boolean" ? o.set("hasShotBoundaries", String(u)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function Ia(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function sc(e, t, r, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((u) => a.add(u));
  } else a.has(r) ? a.delete(r) : a.add(r);
  return a;
}
function Ai({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(ma, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, It.flatMap((r) => {
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
    n(ma, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function Mi({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
function lc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      n(Mi, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, Is(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(Ai, { item: e, showReviewStates: r }))
    ])
  ]);
}
function dc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n(Mi, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
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
        n(Ai, { key: "segments", item: e, showReviewStates: r })
      ]),
      n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function ho({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = Tl(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => Zn(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && Tn(
        o,
        Jt.recyclingBinView
      ) ? n(Ei, { key: "bin", onNavigate: t }) : null,
      n(Di, { key: "settings", onNavigate: t })
    ])
  ]);
}
const ro = "segment-studio:recycling-bin-changed";
function cc(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function qn() {
  window.dispatchEvent(new CustomEvent(ro));
}
function Ei({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = G(null);
  pe(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const u = await Z("/bin"), m = Number(u == null ? void 0 : u.totalCount);
        !a && c === s && o(Number.isFinite(m) && m >= 0 ? Math.trunc(m) : null);
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
  const i = cc(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => Zn(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function Di({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => Zn(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function uc({ mode: e, onModeChange: t, disabled: r = !1 }) {
  function o(i) {
    const a = eo(i.target.value);
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
function mc({ minimum: e, maximum: t, onChange: r }) {
  const o = ue(null), [i, a] = G("maximum"), s = (y, h) => {
    const p = Xs(e, t, y, h);
    a(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (y, h) => {
    var g;
    const p = (g = o.current) == null ? void 0 : g.getBoundingClientRect();
    p && s(y, Zs(h.clientX, p.left, p.width));
  }, d = (y, h) => {
    var p, g;
    h.preventDefault(), (g = (p = h.currentTarget).setPointerCapture) == null || g.call(p, h.pointerId), l(y, h);
  }, c = (y, h) => {
    var p, g;
    (g = (p = h.currentTarget).hasPointerCapture) != null && g.call(p, h.pointerId) && l(y, h);
  }, u = (y, h) => {
    const p = y === "minimum" ? e : t, g = y === "minimum" ? 0 : e, S = y === "minimum" ? t : 1, $ = h.shiftKey ? 0.1 : 0.01;
    let f = null;
    ["ArrowLeft", "ArrowDown"].includes(h.key) && (f = p - $), ["ArrowRight", "ArrowUp"].includes(h.key) && (f = p + $), h.key === "PageDown" && (f = p - 0.1), h.key === "PageUp" && (f = p + 0.1), h.key === "Home" && (f = g), h.key === "End" && (f = S), f != null && (h.preventDefault(), s(y, Math.min(S, Math.max(g, f))));
  }, m = (y, h) => n("span", {
    key: y,
    role: "slider",
    tabIndex: 0,
    "aria-label": y === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((y === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((y === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(h * 100),
    "aria-valuetext": `${Math.round(h * 100)} percent`,
    onPointerDown: (p) => d(y, p),
    onPointerMove: (p) => c(y, p),
    onKeyDown: (p) => u(y, p),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${h * 100}%`,
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
        m("minimum", e),
        m("maximum", t)
      ])
    )
  ]);
}
function gc({ saving: e, error: t, onSelect: r, onClose: o }) {
  const i = ue(null);
  pe(() => {
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
    onKeyDownCapture: (s) => At(s, { onCancel: a })
  }, n("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: qt,
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
function pc({
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
  onClose: u
}) {
  const m = Ot(e), y = [...new Map((a || []).map((f) => [
    Number(f.tagId),
    f.tagName || `Tag ${f.tagId}`
  ])).entries()].sort((f, z) => f[1].localeCompare(z[1]) || f[0] - z[0]), h = new Set((a || []).map((f) => Number(f.tagId))), p = (s || []).filter((f) => Number(f.id) === m.segmentGroupId || (f.tags || []).some((z) => h.has(Number(z.tagId)))), g = (f) => d(Ot({ ...m, ...f })), S = (f) => g({
    reviewStates: m.reviewStates.includes(f) ? m.reviewStates.filter((z) => z !== f) : [...m.reviewStates, f]
  }), $ = (f) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${f ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (f) => {
      f.target === f.currentTarget && u();
    },
    onKeyDownCapture: (f) => At(f, { onCancel: u })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: qt,
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
        onClick: u,
        "aria-label": "Close editor filters",
        className: "rounded-md px-2 py-1 text-xl leading-none text-secondary hover:bg-muted/40 hover:text-foreground"
      }, "×")
    ]),
    n("div", { key: "body", className: "min-h-0 space-y-5 overflow-y-auto p-5" }, [
      l ? n("fieldset", { key: "approval", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Approval state"),
        n("div", { className: "flex flex-wrap gap-2" }, It.map((f) => {
          const z = m.reviewStates.includes(f), U = Bt[f];
          return n("button", {
            key: f,
            type: "button",
            onClick: () => S(f),
            "aria-pressed": z,
            className: $(z)
          }, `${U.symbol} ${f} (${i[f] || 0})`);
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
            "aria-pressed": m.performerId == null,
            className: $(m.performerId == null)
          }, "All performers"),
          ...r.map((f) => {
            const z = Number(ct(f));
            return n("button", {
              key: z,
              type: "button",
              onClick: () => g({ performerId: z }),
              "aria-pressed": m.performerId === z,
              className: $(m.performerId === z)
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
            onChange: (f) => g({
              tagId: f.target.value === "" ? null : Number(f.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...y.map(([f, z]) => n("option", { key: f, value: f }, z))
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
            onChange: (f) => g({
              segmentGroupId: f.target.value === "" ? null : f.target.value === "ungrouped" ? "ungrouped" : Number(f.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All Segment groups"),
            ...p.map((f) => n("option", { key: f.id, value: f.id }, f.name)),
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
            "aria-pressed": m.sourceKey == null,
            className: $(m.sourceKey == null)
          }, "All provenance"),
          ...o.map((f) => n("button", {
            key: f,
            type: "button",
            onClick: () => g({ sourceKey: f }),
            "aria-pressed": m.sourceKey === f,
            title: f,
            className: $(m.sourceKey === f)
          }, Gt(f)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(mc, {
          minimum: m.confidenceMin,
          maximum: m.confidenceMax,
          onChange: ({ minimum: f, maximum: z }) => g({
            confidenceMin: f,
            confidenceMax: z
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
            onChange: (f) => g({
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
        n(rc, { key: "icon", hidden: t }),
        n("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    n("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(Ot({})), l && c(!1);
        },
        className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
      }, "Reset filters"),
      n("button", {
        key: "done",
        type: "button",
        onClick: u,
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground"
      }, "Done")
    ])
  ]));
}
const Oi = "segment-studio-editor-history";
function fc({ history: e, historySaving: t, anchorRef: r, onRestore: o, onClose: i }) {
  const a = ue(null);
  return pe(() => {
    const s = (d) => {
      ad(d.target, a.current, r == null ? void 0 : r.current) && i();
    }, l = (d) => {
      var m, y, h;
      if (d.key !== "Escape" || d.defaultPrevented || document.querySelector("[role='dialog'], [aria-modal='true']")) return;
      const c = document.activeElement, u = c instanceof Element && (((m = a.current) == null ? void 0 : m.contains(c)) || ((y = r == null ? void 0 : r.current) == null ? void 0 : y.contains(c)));
      d.preventDefault(), i(), u && ((h = r == null ? void 0 : r.current) == null || h.focus({ preventScroll: !0 }));
    };
    return document.addEventListener("pointerdown", s), document.addEventListener("keydown", l), () => {
      document.removeEventListener("pointerdown", s), document.removeEventListener("keydown", l);
    };
  }, [r, i]), n("div", {
    ref: a,
    id: Oi,
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
function yc({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Qn.filter((l) => $n(l, e)), i = ea(o, 1)[0], a = ea(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((u) => n("div", { key: u.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, u.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[u.id] ? t[u.id].length > 0 ? t[u.id] : ["Unassigned"] : u.bindings.map(Xa)).map((m, y) => n("kbd", { key: `${u.id}:${y}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, m))
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
    onKeyDownCapture: (l) => At(l, { onCancel: r })
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
function bc({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = Rd(e), [l, d] = G([]), c = s.map((u) => u.tagName).join("|");
  return pe(() => {
    const u = new Set(s.map((m) => m.tagName));
    d((m) => m.filter((y) => u.has(y)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (u) => At(u, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: qt,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", { key: "title", id: "segment-studio-examples-title", className: "text-lg font-semibold text-foreground" }, "AI Feedback"),
      n("p", { key: "description", className: "mt-1 text-sm text-secondary" }, `${e.length} registered-AI example${e.length === 1 ? "" : "s"} in this video. Expand a tag to inspect or restore examples before export.`)
    ]),
    n("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      n("div", { key: "items", className: "space-y-3" }, e.length ? s.map((u, m) => {
        const y = l.includes(u.tagName), h = `incorrect-example-tag-${m}`;
        return n("section", {
          key: u.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": y,
            "aria-controls": h,
            onClick: () => d((p) => y ? p.filter((g) => g !== u.tagName) : [...p, u.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: Ir(!1) }
          }, [
            n(
              "span",
              { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" },
              y ? "▾" : "▸"
            ),
            n(
              "span",
              { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
              u.tagName
            ),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${u.examples.length} example${u.examples.length === 1 ? "" : "s"}`
            )
          ]),
          y ? n("div", {
            key: "examples",
            id: h,
            className: "divide-y divide-border border-t border-border"
          }, u.examples.map((p) => {
            const g = `${Ee(p.startSec)}${p.endSec == null ? "" : ` – ${Ee(p.endSec)}`}`, S = r === p.id;
            return n("div", {
              key: p.id,
              className: "flex items-center justify-between gap-3 px-3 py-2 text-sm"
            }, [
              n(
                "span",
                { key: "time", className: "font-mono text-xs text-secondary" },
                g
              ),
              n("button", {
                key: "remove",
                type: "button",
                disabled: t || r != null,
                onClick: () => i(p),
                "aria-label": `${S ? "Restoring" : "Restore to review"} ${u.tagName} example at ${g}`,
                className: "rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
              }, S ? "Restoring…" : "Restore to review")
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
function hc({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = G(""), [a, s] = G(0), l = ue(null), d = Ve(() => Gl(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), u = zl(d);
  pe(() => {
    var y;
    (y = l.current) == null || y.scrollIntoView({ block: "nearest" });
  }, [c, o]);
  const m = () => {
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
      var h;
      if (y.key === "Tab")
        qt(y);
      else if (y.key === "Escape")
        y.preventDefault(), y.stopPropagation(), r();
      else if (y.key === "ArrowDown" || y.key === "ArrowUp") {
        y.preventDefault(), y.stopPropagation();
        const p = y.key === "ArrowDown" ? 1 : -1;
        s((g) => d.length ? (g + p + d.length) % d.length : 0);
      } else y.key === "Enter" && !((h = y.nativeEvent) != null && h.isComposing) && (y.preventDefault(), y.stopPropagation(), m());
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
    }, d.length ? d.flatMap((y, h) => {
      var W;
      const p = y.segment || y, g = p.endSec == null ? Ee(p.startSec) : `${Ee(p.startSec)} – ${Ee(p.endSec)}`, S = `${Gt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, $ = h === c, f = h > 0 ? d[h - 1].groupKey : null, z = u && y.groupKey !== f ? n("div", {
        key: `group:${y.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, y.groupName) : null, U = n("button", {
        key: p.id,
        id: `segment-quick-search-${p.id}`,
        ref: $ ? l : null,
        type: "button",
        role: "option",
        "aria-selected": $,
        onMouseEnter: () => s(h),
        onClick: () => t(p),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${$ ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        u ? n("span", { key: "group", className: "sr-only" }, `${y.groupName} group`) : null,
        n(ln, { key: "review", state: p.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        (W = y.performers) != null && W.length ? n($r, {
          key: "performers",
          performers: y.performers,
          performerAssignments: y.performerAssignments
        }) : null,
        n(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          g
        ),
        n("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: S
        }, S)
      ]);
      return z ? [z, U] : [U];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function vc(e) {
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
function xc({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = Ve(() => vc(e), [e]), [l, d] = G([]), c = s.reduce((h, p) => h + p.drafts.length, 0), u = ue(null);
  go({ confirmRef: u, cancelRef: o, confirmReady: !t && c > 0 });
  const m = (h) => d((p) => p.includes(h) ? p.filter((g) => g !== h) : [...p, h]), y = (h) => `segment-studio-publish-approved-${h.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && !t && a();
    },
    onKeyDownCapture: (h) => At(h, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: qt,
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
      ].flatMap(([h, p]) => [
        n("dt", { key: `${h}:label`, className: "text-secondary" }, h),
        n("dd", { key: `${h}:value`, className: "font-semibold text-foreground" }, String(p))
      ])),
      s.length ? n("div", { key: "groups", className: "space-y-2" }, s.map((h) => {
        const p = l.includes(h.key);
        return n("section", { key: h.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": p,
            "aria-controls": y(h),
            onClick: () => m(h.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: Ir(!1) }
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, p ? "▾" : "▸"),
            n("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, h.tagName),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${h.drafts.length} draft${h.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          p ? n("div", {
            key: "drafts",
            id: y(h),
            className: "divide-y divide-border border-t border-border"
          }, h.drafts.map((g) => {
            const S = g.endSec == null ? Ee(g.startSec) : `${Ee(g.startSec)} – ${Ee(g.endSec)}`, $ = `${Gt(g.sourceKey)}${g.confidence == null ? "" : ` · ${Math.round(g.confidence * 100)}%`}`;
            return n("div", { key: g.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(ln, { key: "review", state: g.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, S),
              n("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: $
              }, $)
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
        ref: u,
        type: "button",
        disabled: t || c === 0,
        onClick: i,
        className: "rounded-md border border-emerald-500/60 bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-emerald-500/30 disabled:opacity-50"
      }, t ? "Publishing…" : `Publish ${c} approved draft${c === 1 ? "" : "s"}`)
    ])
  ]));
}
function Sc({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = Bl(e), [s, l] = G(() => /* @__PURE__ */ new Set()), [d, c] = G(() => new Set(a.map((g) => g.key))), u = a.flatMap((g) => d.has(g.key) ? g.candidates : []), m = (g) => l((S) => {
    const $ = new Set(S);
    return $.has(g) ? $.delete(g) : $.add(g), $;
  }), y = (g) => c((S) => {
    const $ = new Set(S);
    return $.has(g) ? $.delete(g) : $.add(g), $;
  }), h = (g) => g.assignment.map(({ slot: S, performer: $ }) => `${S.label || `Slot ${S.sortOrder + 1}`}: ${$.name}`).join(", "), p = (g) => `segment-studio-auto-assign-${g.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && i();
    },
    onKeyDownCapture: (g) => {
      g.key === "Enter" && g.target instanceof HTMLInputElement || At(g, {
        onCancel: t ? void 0 : i,
        onConfirm: u.length && !t ? () => o(u) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: qt,
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
      e.length ? n("div", { className: "space-y-3" }, a.map((g) => n("section", { key: g.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
        n("header", {
          key: "header",
          className: "flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2",
          style: { background: Ir(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(g.key),
            disabled: t,
            onChange: () => y(g.key),
            "aria-label": `Include ${g.tagName} assignment: ${h(g)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(g.key),
            "aria-controls": p(g),
            "aria-label": `${s.has(g.key) ? "Collapse" : "Expand"} ${g.tagName} assignment: ${h(g)}`,
            onClick: () => m(g.key),
            className: "shrink-0 rounded px-1 text-sm text-secondary hover:bg-muted/50 hover:text-foreground disabled:opacity-50"
          }, s.has(g.key) ? "▾" : "▸"),
          n(
            "span",
            { key: "tag", className: "min-w-24 flex-1 truncate text-sm font-semibold text-foreground" },
            g.tagName
          ),
          n(
            "span",
            { key: "performers", className: "flex min-w-0 flex-wrap items-center gap-2" },
            g.assignment.map(({ slot: S, performer: $ }) => {
              const f = S.label || `Slot ${S.sortOrder + 1}`;
              return n("span", {
                key: S.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${f}: ${$.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${f}: ${$.name}`
                }, `${f}: ${$.name}`),
                n(Yn, {
                  key: "avatar",
                  performer: { id: $.performerId, name: $.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(Zt, { key: "states", counts: g.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(g.candidates),
            "aria-label": `Auto-Assign ${g.tagName}: ${h(g)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${g.candidates.length})`)
        ]),
        s.has(g.key) ? n(
          "div",
          { key: "segments", id: p(g), className: "divide-y divide-border/70" },
          g.candidates.map((S) => {
            const $ = S.endSec == null ? Ee(S.startSec) : `${Ee(S.startSec)} – ${Ee(S.endSec)}`, f = `${Gt(S.sourceKey)}${S.confidence == null ? "" : ` · ${Math.round(S.confidence * 100)}%`}`;
            return n("div", {
              key: S.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(ln, { key: "review", state: S.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                S.tagName || "Tag segment"
              ),
              n(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                $
              ),
              n("span", {
                key: "provenance",
                className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                title: f
              }, f)
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
        disabled: t || u.length === 0,
        onClick: () => o(u),
        className: "rounded-md border border-violet-400/60 bg-violet-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-violet-500/30 disabled:opacity-50"
      }, t ? "Assigning…" : `Auto-Assign ${u.length} Segment${u.length === 1 ? "" : "s"}`)
    ])
  ]));
}
function kc({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => At(d, { onCancel: r, onConfirm: t })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: qt,
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
function wc({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = G(!1), d = ue(null);
  if (go({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Ee(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !t && a();
    },
    onKeyDownCapture: (u) => At(u, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: qt,
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
        `${Ee(e.startSec)} – ${c}`
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
          onChange: (u) => l(u.target.checked),
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
function Nc(e) {
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
function Ic({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var m, y;
  const l = e ? e.createCount + e.linkCount : 0, d = ue(null);
  go({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((m = e == null ? void 0 : e.outputs) == null ? void 0 : m.slice(0, 200)) || [], u = Nc(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && !r && s();
    },
    onKeyDownCapture: (h) => At(h, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: qt,
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
        ].flatMap(([h, p]) => [
          n("dt", { key: `${h}:label`, className: "text-secondary" }, h),
          n("dd", { key: `${h}:value`, className: "font-semibold text-foreground" }, String(p))
        ])),
        e.conflictCount > 0 ? n(
          "p",
          { key: "conflicts", role: "status", className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground" },
          `${e.conflictCount} existing derivation ${e.conflictCount === 1 ? "branch was" : "branches were"} skipped because its lineage no longer matches the active rule. Resolve these through lineage maintenance.`
        ) : null,
        u.length ? n("div", { key: "outputs", className: "space-y-2" }, [
          ...u.map((h) => n("article", {
            key: h.key,
            className: "rounded-md border border-border bg-surface p-3"
          }, [
            n("div", { key: "root", className: "flex min-w-0 items-center gap-2" }, [
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
                `${h.rootTagName} @ ${Ee(h.rootStartSec)}`
              ),
              n(
                "span",
                { key: "count", className: "shrink-0 text-xs font-medium text-secondary" },
                `${h.outputs.length} ${h.outputs.length === 1 ? "change" : "changes"}`
              )
            ]),
            n(
              "div",
              { key: "tree", className: "mt-2 space-y-1 border-l border-border pl-2" },
              h.outputs.map((p, g) => n("div", {
                key: `${p.ruleId}:${p.depth}:${g}`,
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
function Cc({
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
  performerSlotsAvailable: u,
  selectedPerformerSlots: m,
  performerSlots: y,
  detail: h,
  video: p,
  slotButtonRef: g,
  tagSearchRef: S,
  onDetailChange: $,
  setSaveMessage: f,
  acquireSaveLock: z,
  onSlotsChanged: U,
  onRecordHistory: W,
  onCancelQueuedReview: F,
  splitSegment: E,
  duplicateSegment: A,
  provenance: w,
  lineage: N,
  onNavigateLineageItem: M,
  tagEditing: B,
  onCancelTagEditing: T,
  detailPanelRef: k,
  onReduceSelection: H
}) {
  var xe, Ce, Pe, fe;
  const V = ue(null), _ = ue(null), ne = () => {
    var Y;
    (Y = _.current) == null || Y.call(_), _.current = null;
  }, de = ue(null), ye = ue(null), D = ue(null), ae = ue(null), [le, X] = G(!1);
  pe(() => {
    V.current && (V.current.scrollTop = 0), X(!1);
  }, [t == null ? void 0 : t.id]), pe(() => {
    var Y, be;
    le && ((be = (Y = de.current) == null ? void 0 : Y.querySelector("input, select, button")) == null || be.focus({ preventScroll: !0 }));
  }, [le]);
  function ce() {
    X(!1), requestAnimationFrame(() => {
      var Y;
      return (Y = g.current) == null ? void 0 : Y.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const Y = !r.some((ee) => ee.isDerived), be = e && u ? dd(y, r) : null, C = (be == null ? void 0 : be.map((ee, R) => {
      var b;
      const v = r[R];
      return {
        segmentId: v.nativeSegmentId,
        itemId: v.published ? null : v.itemId,
        revision: (b = h.performerSlotRevisions) == null ? void 0 : b[v.id],
        slots: ee
      };
    })) || [];
    return n(oo.Fragment, null, [
      n(ac, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: k,
        onReduceSelection: H,
        reviewable: e,
        tagEditable: Y,
        slotsEditable: C.length > 0 && a == null,
        onEditSlots: () => X(!0),
        slotButtonRef: g,
        saveMessage: i
      }),
      B && Y ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ee) => {
          ee.target === ee.currentTarget && T();
        },
        onKeyDownCapture: (ee) => At(ee, { onCancel: T })
      }, n("section", {
        ref: S,
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
          onChange: (ee, R) => ee == null ? T() : l(ee, R == null ? void 0 : R.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: T,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      le && C.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ee) => {
          ee.target === ee.currentTarget && ce();
        },
        onKeyDownCapture: (ee) => {
          var v, b;
          if (!(typeof ((v = ee.target) == null ? void 0 : v.closest) == "function" ? ee.target.closest("input, textarea, select, [contenteditable='true']") : null) && !ee.repeat && !ee.ctrlKey && !ee.altKey && !ee.metaKey && !ee.shiftKey && /^[1-9]$/.test(ee.key) && ((b = ae.current) != null && b.call(ae, Number(ee.key) - 1))) {
            ee.preventDefault(), ee.stopPropagation();
            return;
          }
          At(ee, { onCancel: ce });
        }
      }, n("section", {
        ref: de,
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
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(tc, {
          videoId: p.id,
          targets: C,
          performerCandidates: h.performerCandidates || [],
          shortcutRef: ae,
          acquireSaveLock: () => z("slots", -1),
          onSaved: async ({ beforeState: ee, afterState: R }) => {
            await W(
              "performer-slots.assign",
              `Assigned performers to ${C.length} segments`,
              ee,
              R
            ), ce(), await U();
          },
          onConflict: U
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (Y) => {
      V.current = Y, k && (k.current = Y);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(ln, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(Tr, { key: "derived" }) : null,
        t && B ? n("div", {
          key: "tag-editor",
          ref: S,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (Y) => {
            Y.key === "Escape" && (Y.preventDefault(), Y.stopPropagation(), T());
          },
          onKeyDown: (Y) => {
            id(Y, t.tagName) && (Y.preventDefault(), Y.stopPropagation(), l(t.tagId));
          }
        }, n(Wn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (Y, be) => Y == null ? T() : l(Y, be == null ? void 0 : be.label),
          disabled: Sl(a, t.id, s) || ((xe = N.data) == null ? void 0 : xe.tagReadOnly) === !0,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? n("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : n("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? n("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        n("span", { key: "start" }, Ee(t.startSec)),
        t.endSec == null ? null : n("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : n("span", { key: "end" }, Ee(t.endSec))
      ]) : null,
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(Xd, { status: c })) : null,
      t && u && m.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(xi, {
        assignments: m.map((Y) => {
          const be = gd(Y);
          return {
            key: String(Y.slotDefinitionId),
            label: be.label,
            performer: be.filled ? { id: Number(Y.performerId), name: be.performer } : null,
            title: be.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(oc, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: w
    }) : null,
    t ? n("div", { key: "controls", hidden: !0 }, [
      n("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        n("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        N.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : N.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, N.error) : N.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${N.data.derived ? "Derived segment" : "Root segment"} · ${N.data.componentSize} segment${N.data.componentSize === 1 ? "" : "s"} · ${N.data.integrityState}`
          ),
          (Ce = N.data.parents) != null && Ce.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...N.data.parents.map((Y) => n("button", {
              key: Y.nodeId,
              type: "button",
              onClick: () => M(Y.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${Y.ruleKey} ${Y.ruleVersion}`))
          ]) : null,
          (Pe = N.data.children) != null && Pe.length ? n("p", { key: "children" }, `Children: ${N.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: g,
          type: "button",
          disabled: a != null || !u || m.length === 0,
          onClick: () => X(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: u ? m.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, m.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: E,
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
    le && e && t && u && m.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (Y) => {
        Y.target === Y.currentTarget && ce();
      },
      onKeyDownCapture: (Y) => {
        var C, ee;
        if (!(typeof ((C = Y.target) == null ? void 0 : C.closest) == "function" ? Y.target.closest("input, textarea, select, [contenteditable='true']") : null) && !Y.repeat && !Y.ctrlKey && !Y.altKey && !Y.metaKey && !Y.shiftKey && /^[1-9]$/.test(Y.key) && ((ee = D.current) != null && ee.call(D, Number(Y.key) - 1))) {
          Y.preventDefault(), Y.stopPropagation();
          return;
        }
        At(Y, {
          onCancel: ce,
          onConfirm: () => {
            var R;
            return (R = ye.current) == null ? void 0 : R.click();
          }
        });
      }
    }, n("section", {
      ref: de,
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
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(ec, {
        key: `${t.id}:${h.performerSlotsRevision || h.slotRevision || ""}`,
        videoId: p.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: m,
        revision: (fe = h.performerSlotRevisions) == null ? void 0 : fe[t.id],
        performerCandidates: h.performerCandidates || [],
        confirmRef: ye,
        shortcutRef: D,
        onOptimisticSave: (Y) => {
          const be = z("slots", t.id);
          if (!be)
            return f("Wait for the current save to finish before saving performer slots."), !1;
          _.current = be, $((C) => Yt(
            C,
            t.id,
            Y
          ), p.id), f("Saving performer slots…"), ce();
        },
        onSaved: async (Y, { beforeState: be, afterState: C }) => {
          $((ee) => Yt(
            ee,
            t.id,
            Y.slots || [],
            Y.revision
          ), p.id), f("Performer slots saved.");
          try {
            await W(
              "performer-slots.assign",
              "Assigned performers",
              be,
              C
            ), await U(Y) || F([t]);
          } finally {
            ne();
          }
        },
        onRollback: async (Y, be) => {
          F([t]), $((C) => {
            var ee;
            return Yt(
              C,
              t.id,
              Y,
              (ee = h.performerSlotRevisions) == null ? void 0 : ee[t.id]
            );
          }, p.id), f(be.message || "Unable to save performer slots.");
          try {
            be.status === 409 && await U();
          } finally {
            ne();
          }
        },
        onConflict: U
      }))
    ])) : null
  ]);
}
function $c({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: u, onZoomChange: m, onSelectGroup: y, onToggleGroup: h, onSelect: p, onSelectSegments: g, onSelectAll: S, onConfigureTag: $, onSeekTime: f, centerRef: z, showReviewState: U = !0, swimlaneTitleWidth: W, onSwimlaneTitleWidthChange: F }) {
  const E = ue(null), A = ue(null), [w, N] = G(0), [M, B] = G({ scrollTop: 0, height: 320 }), [T, k] = G(null), H = Ve(
    () => an(e, r, o),
    [e, r, o]
  ), V = Ve(
    () => yi(o),
    [o]
  ), _ = Ve(() => yo(H), [H]), ne = Ve(
    () => hd(_, i, bi(_)),
    [_, i]
  ), de = Ve(
    () => hi(ne.rows, Math.max(0, M.scrollTop - 24), M.height),
    [ne, M]
  ), ye = Math.max(0, Number(d) || 0), D = Us(w), ae = yr(W, D), le = ae / 16, X = Ks(c, ye, le), ce = Ls(ye), xe = js(ye, Math.max(1, w - le * 16), u), Ce = ce.filter((b, x) => x === 0 || x % xe === 0), Pe = Ve(() => H.map((b) => `${b.key}:${b.trackCount}:${b.markers.map(({ segment: x, track: O }) => `${x.id}:${x.startSec}:${x.endSec ?? ""}:${O}`).join(",")}`).join("|"), [H]);
  function fe() {
    const b = A.current;
    if (!b) return;
    const x = b.querySelector("[data-timeline-track]"), O = b.firstElementChild, re = x == null ? void 0 : x.getBoundingClientRect(), te = O == null ? void 0 : O.getBoundingClientRect(), j = re && te ? Math.max(0, re.left - te.left) : le * 16, oe = (te == null ? void 0 : te.width) ?? b.scrollWidth;
    b.scrollTo({
      left: Gs(c, ye, oe, b.clientWidth, j, _a),
      behavior: "smooth"
    });
  }
  pe(() => (z.current = fe, () => {
    z.current === fe && (z.current = null);
  })), pe(() => {
    fe();
  }, [u]);
  function Y() {
    const b = A.current, x = ne.rows.find((oe) => oe.kind === "lane" && oe.lane.markers.some(({ segment: I }) => I.id === s));
    if (!b || !x) return;
    const O = 24, re = x.top + O, te = re + x.height;
    let j = b.scrollTop;
    re < b.scrollTop + O ? j = Math.max(0, re - O) : te > b.scrollTop + b.clientHeight && (j = Math.max(0, te - b.clientHeight)), j !== b.scrollTop && (b.scrollTop = j), B({ scrollTop: j, height: b.clientHeight });
  }
  pe(() => {
    Y();
  }, [s, Pe, ne]), pe(() => {
    const b = A.current, x = ne.rows.find((oe) => oe.kind === "group" && oe.group.key === a);
    if (!b || !x) return;
    const O = 24, re = x.top + O, te = re + x.height;
    let j = b.scrollTop;
    re < b.scrollTop + O ? j = Math.max(0, re - O) : te > b.scrollTop + b.clientHeight && (j = Math.max(0, te - b.clientHeight)), j !== b.scrollTop && (b.scrollTop = j), B({ scrollTop: j, height: b.clientHeight });
  }, [a, ne]), pe(() => {
    const b = A.current;
    if (!b || typeof ResizeObserver > "u") return;
    const x = () => {
      N(b.clientWidth), B({ scrollTop: b.scrollTop, height: b.clientHeight }), Y();
    }, O = new ResizeObserver(x);
    return O.observe(b), x(), () => O.disconnect();
  }, [s, Pe, ne]);
  function be(b) {
    if (!(ye > 0)) return;
    const x = b.currentTarget.getBoundingClientRect(), O = Math.min(1, Math.max(0, (b.clientX - x.left) / x.width));
    f(O * ye);
  }
  function C(b) {
    const x = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let O = null;
    Object.hasOwn(x, b.key) && (O = c + x[b.key]), b.key === "Home" && (O = 0), b.key === "End" && (O = ye), O != null && (b.preventDefault(), b.stopPropagation(), f(Math.min(ye, Math.max(0, O))));
  }
  function ee(b) {
    var O;
    const x = (O = E.current) == null ? void 0 : O.getBoundingClientRect();
    x && F(yr(b.clientX - x.left, D));
  }
  function R(b) {
    const x = b.shiftKey ? 40 : 16;
    let O = null;
    b.key === "ArrowLeft" && (O = ae - x), b.key === "ArrowRight" && (O = ae + x), b.key === "Home" && (O = 160), b.key === "End" && (O = D), O != null && (b.preventDefault(), b.stopPropagation(), F(yr(O, D)));
  }
  const v = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: E,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (b) => {
          (b.metaKey || b.ctrlKey) && (b.preventDefault(), S == null || S());
        },
        onKeyDown: (b) => {
          b.key !== "Enter" && b.key !== " " || (b.preventDefault(), S == null || S());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: v, disabled: u <= 1, onClick: () => m(kr(u - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: v, disabled: u === 1, onClick: () => m(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(u * 100)}%`),
      n("button", { key: "in", type: "button", className: v, disabled: u >= 8, onClick: () => m(kr(u + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: v, onClick: fe, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(D),
      "aria-valuenow": Math.round(ae),
      "aria-valuetext": `${Math.round(ae)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (b) => {
        b.currentTarget.setPointerCapture(b.pointerId), ee(b);
      },
      onPointerMove: (b) => {
        b.currentTarget.hasPointerCapture(b.pointerId) && ee(b);
      },
      onKeyDown: R,
      onDoubleClick: () => F(Rt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${ae - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: A,
      onScroll: (b) => B({
        scrollTop: b.currentTarget.scrollTop,
        height: b.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: zs(u) }, [
      n("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${le}rem minmax(0,1fr)`, height: "1.5rem" } }, [
        n("div", { key: "axis-label", "data-timeline-label-gutter": "true", "aria-hidden": "true", className: "sticky left-0 z-40 border-r border-border", style: { backgroundColor: "var(--color-surface)" } }),
        n("div", {
          key: "ticks",
          role: "slider",
          tabIndex: 0,
          "data-timeline-seeker": "true",
          "data-timeline-track": "true",
          "aria-label": "Timeline seek",
          "aria-valuemin": 0,
          "aria-valuemax": ye,
          "aria-valuenow": Math.min(ye, Math.max(0, c)),
          "aria-valuetext": Ee(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: be,
          onKeyDown: C
        }, Ce.map((b, x) => n("span", {
          key: b,
          className: `absolute top-0 ${Fs(x, Ce.length, ye > 0 ? b / ye * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Bs(x, Ce.length, ye > 0 ? b / ye * 100 : 0)
        }, Ee(b))).concat(t.map((b) => {
          const x = ye > 0 ? b.startSec / ye * 100 : 0;
          return n("button", {
            key: `shot-boundary:${b.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Ee(b.startSec)} – ${Ee(b.endSec)}`,
            title: `Shot boundary · ${b.source || "manual"} · ${Ee(b.startSec)} – ${Ee(b.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${x}%`, width: "2px" },
            onClick: (O) => {
              O.stopPropagation(), f(b.startSec);
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
            ...Vo(X),
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
        style: H.length > 0 ? { height: ne.height } : void 0
      }, [
        H.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...Vo(X, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        H.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : de.map((b) => {
          var q;
          const x = b.group, O = i.includes(x.key), re = a === x.key, te = Ir(re);
          if (b.kind === "group") return n("div", {
            key: b.key,
            "data-segment-group": x.key,
            "data-segment-group-collapsed": O ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${le}rem minmax(0,1fr)`,
              backgroundColor: te,
              top: b.top,
              height: b.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (P) => {
                if (P.metaKey || P.ctrlKey) {
                  g(x.lanes.flatMap((Q) => Q.markers.map((he) => he.segment.id)));
                  return;
                }
                y(x.key), h(x.key);
              },
              "aria-expanded": !O,
              "aria-current": re ? "true" : void 0,
              "data-selected-timeline-group": re ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: x.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: te
              },
              title: `${O ? "Expand" : "Collapse"} ${x.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, O ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, x.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              O ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${x.lanes.length} swimlane${x.lanes.length === 1 ? "" : "s"} hidden`
                ),
                U ? n(Zt, { key: "states", counts: x.counts }) : null
              ] : null
            )
          ]);
          const j = b.lane, oe = ed(b.laneIndex), I = j.markers.some(({ segment: P }) => P.id === s);
          return n("div", {
            key: b.key,
            "data-grouped-swimlane": x.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${le}rem minmax(0,1fr)`,
              top: b.top,
              height: b.height,
              backgroundColor: oe
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": I ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: td(I, oe),
              title: `${Jn(j)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Jn(j),
              onClick: (P) => {
                (P.metaKey || P.ctrlKey) && g(j.markers.map((Q) => Q.segment.id));
              },
              onMouseEnter: () => k(j.key),
              onMouseLeave: () => k((P) => P === j.key ? null : P)
            }, [
              j.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (P) => {
                  P.stopPropagation(), $({ tagId: j.tagId, tagName: j.label, trigger: P.currentTarget });
                },
                "aria-label": `Configure ${j.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: T === j.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, j.label),
              (q = j.performers) != null && q.length ? n($r, {
                key: "performers",
                performers: j.performers,
                performerAssignments: j.performerAssignments
              }) : null,
              U ? n(Zt, { key: "counts", counts: j.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, j.markers.map(({ segment: P, track: Q }) => {
              var gt;
              const he = Jr(P.startSec, ye), me = P.endSec == null ? P.startSec : Math.max(P.startSec, P.endSec), Te = Math.max(0, Jr(me, ye) - he), mt = l.includes(P.id), je = P.id === s, Re = fo(V.get(P.id)), Ze = P.endSec == null ? Ee(P.startSec) : `${Ee(P.startSec)} – ${Ee(P.endSec)}`, it = (gt = pi[Re]) == null ? void 0 : gt.label;
              return n("button", {
                key: P.id,
                type: "button",
                onClick: (et) => {
                  et.stopPropagation(), p(P, {
                    additive: et.metaKey || et.ctrlKey,
                    rangeSegmentIds: et.shiftKey ? j.markers.map((ft) => ft.segment.id) : null
                  });
                },
                "aria-pressed": mt,
                "aria-current": je ? "true" : void 0,
                "data-selected-timeline-marker": je ? "true" : void 0,
                "data-selected-segment-shortcut-target": je ? "true" : void 0,
                "aria-label": U ? `${P.tagName || "Tag segment"}${j.performerLabel ? `, ${j.performerLabel}` : ""}, ${P.reviewState}${it ? `, ${it}` : ""}, ${Ze}` : `${P.tagName || "Tag segment"}${j.performerLabel ? `, ${j.performerLabel}` : ""}, ${Ze}`,
                title: U ? `${P.tagName || "Tag segment"}${j.performerLabel ? ` · ${j.performerLabel}` : ""} · ${P.reviewState}${it ? ` · ${it}` : ""} · ${Ze}` : `${P.tagName || "Tag segment"}${j.performerLabel ? ` · ${j.performerLabel}` : ""} · ${Ze}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...U ? Ql(P.reviewState, mt, Re, je) : Zl(mt, je),
                  left: `${he}%`,
                  top: `${nd(Q)}rem`,
                  width: Xl(P.endSec, Te),
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
function vo({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = G(null), [l, d] = G([]), [c, u] = G(null), [m, y] = G(""), [h, p] = G(!0), [g, S] = G(null), [$, f] = G(""), [z, U] = G(!1), W = ue(null), F = ue(0);
  pe(() => {
    const T = requestAnimationFrame(() => {
      var k;
      return (k = W.current) == null ? void 0 : k.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(T);
  }, [e]), pe(() => {
    const T = new AbortController();
    return p(!0), f(""), Promise.all([
      r ? Z(`/slot-definitions/${e}`, { signal: T.signal }) : Promise.resolve(null),
      Z("/segment-groups", { signal: T.signal })
    ]).then(([k, H]) => {
      const V = H.find((_) => (_.tags || []).some((ne) => Number(ne.tagId) === Number(e)));
      s(k), d(H), u((V == null ? void 0 : V.id) ?? null), y(V == null ? "" : String(V.id)), U(!1);
    }).catch((k) => {
      k.name !== "AbortError" && f(k.message || "Unable to load tag configuration.");
    }).finally(() => {
      T.signal.aborted || p(!1);
    }), () => T.abort();
  }, [r, e]);
  function E(T, k) {
    s({
      ...a,
      definitions: a.definitions.map((H, V) => V === T ? { ...H, ...k } : H)
    });
  }
  function A(T, k) {
    const H = T + k;
    if (H < 0 || H >= a.definitions.length) return;
    const V = [...a.definitions];
    [V[T], V[H]] = [V[H], V[T]], s({
      ...a,
      definitions: V.map((_, ne) => ({ ..._, sortOrder: ne }))
    });
  }
  function w(T) {
    const k = a.definitions[T], H = Number(k.assignmentCount) || 0, V = H === 0 ? "" : ` and its ${H} assignment${H === 1 ? "" : "s"}`;
    window.confirm(`Delete “${Ct(k)}”${V}?`) && (H > 0 && U(!0), s({
      ...a,
      definitions: a.definitions.filter((_, ne) => ne !== T).map((_, ne) => ({ ..._, sortOrder: ne }))
    }));
  }
  async function N() {
    var k;
    S("slots"), f("Saving performer slots…");
    let T;
    try {
      T = await Z(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: z,
          definitions: a.definitions.map((H, V) => {
            var _;
            return {
              id: H.id || void 0,
              label: ((_ = H.label) == null ? void 0 : _.trim()) || null,
              sortOrder: V,
              genderHints: H.genderHints || []
            };
          })
        })
      }), s(T), U(!1);
    } catch (H) {
      H.status === 409 ? (f("Performer slots changed elsewhere; current values were reloaded."), (k = H.payload) != null && k.current && (s(H.payload.current), U(!1))) : f(H.message || "Unable to save performer slots."), S(null);
      return;
    }
    try {
      await o(), f("Performer slots saved.");
    } catch {
      f("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      S(null);
    }
  }
  async function M() {
    const T = m === "" ? null : Number(m);
    if (T !== c) {
      S("group"), f("Saving tag group…");
      try {
        await Z(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: T })
        });
      } catch (k) {
        f(k.message || "Unable to assign the tag group."), S(null);
        return;
      }
      try {
        const [k, H] = await Promise.allSettled([
          Z("/segment-groups"),
          o()
        ]);
        if (k.status === "fulfilled") {
          d(k.value);
          const V = k.value.find((ne) => (ne.tags || []).some((de) => Number(de.tagId) === Number(e))), _ = (V == null ? void 0 : V.id) ?? null;
          u(_), y(_ == null ? "" : String(_));
        }
        f(
          k.status === "fulfilled" && H.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        S(null);
      }
    }
  }
  l.find((T) => Number(T.id) === Number(c));
  const B = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (T) => {
      T.target === T.currentTarget && !g && i();
    },
    onKeyDownCapture: (T) => At(T, {
      onCancel: g ? void 0 : i
    })
  }, n("section", {
    ref: W,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: qt,
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
        h ? null : n("label", { key: "choice", className: "block space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Assigned group"),
          n("select", {
            key: "select",
            value: m,
            disabled: g != null,
            onChange: (T) => y(T.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((T) => n("option", { key: T.id, value: String(T.id) }, T.name))
          ])
        ]),
        h ? null : n("button", {
          key: "save",
          type: "button",
          disabled: g != null || (m === "" ? null : Number(m)) === c,
          onClick: M,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, g === "group" ? "Saving…" : "Save tag group")
      ]),
      r ? n("section", { key: "slots", className: "space-y-3 border-t border-border pt-5", "aria-labelledby": "inline-tag-slots-heading" }, [
        n("div", { key: "heading" }, [
          n("h3", { key: "title", id: "inline-tag-slots-heading", className: "text-sm font-semibold text-foreground" }, "Performer slots"),
          n("p", { key: "copy", className: "text-xs text-secondary" }, "Define the ordered performer roles used by this tag.")
        ]),
        h ? n("p", { key: "loading", className: "rounded-md border border-dashed border-border p-4 text-sm text-secondary" }, "Loading performer slots…") : a ? n("div", { key: "editor", className: "space-y-3" }, [
          n("label", { key: "duplicates", className: "flex items-center gap-2 text-sm" }, [
            n("input", {
              key: "input",
              type: "checkbox",
              checked: !!a.allowSamePerformerInMultipleSlots,
              disabled: g != null,
              onChange: (T) => s({ ...a, allowSamePerformerInMultipleSlots: T.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((T, k) => n("article", {
            key: T.id || T._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: T.label || "",
                disabled: g != null,
                onChange: (H) => E(k, { label: H.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Es.map((H) => n("label", { key: H, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: g != null,
                  checked: (T.genderHints || []).includes(H),
                  onChange: (V) => E(k, {
                    genderHints: V.target.checked ? [.../* @__PURE__ */ new Set([...T.genderHints || [], H])] : (T.genderHints || []).filter((_) => _ !== H)
                  })
                }),
                n("span", { key: "text" }, Cr(H))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${T.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: g != null || k === 0, onClick: () => A(k, -1), className: B, "aria-label": `Move ${Ct(T)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: g != null || k === a.definitions.length - 1, onClick: () => A(k, 1), className: B, "aria-label": `Move ${Ct(T)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: g != null, onClick: () => w(k), className: `${B} text-red-300` }, "Delete")
            ])
          ])),
          n("div", { key: "buttons", className: "flex items-center gap-2" }, [
            n("button", {
              key: "add",
              type: "button",
              disabled: g != null,
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
              className: B
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: g != null,
              onClick: N,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, g === "slots" ? "Saving…" : "Save performer slots")
          ])
        ]) : null
      ]) : null,
      $ ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, $) : null
    ]),
    n(
      "footer",
      { key: "footer", className: "flex items-center justify-end border-t border-border px-5 py-4" },
      n("button", {
        type: "button",
        disabled: g != null,
        onClick: i,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Close")
    )
  ]));
}
function Tc(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function Rc(e) {
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, approvalFacetCounts: i, autoAssignCandidates: a, autoAssignError: s, autoAssignOpen: l, autoAssignPerformers: d, autoAssigning: c, cancelQueuedReviewsForSegments: u, canMoveSelectionToBin: m, captureTrainingExport: y, centerTimelineRef: h, closeEditorFilters: p, closeFirstSegmentTagDialog: g, closeMaterializeDialog: S, closeMergeConfirmation: $, closePublishApprovedDialog: f, closeTagEditing: z, collapsedSegmentGroups: U, commonActionsRef: W, compatibilityMode: F, configuringTag: E, createSegment: A, creatingSegmentId: w, currentTime: N, deleteRejectedSegments: M, detail: B, detailPanelRef: T, detailWidth: k, duplicateSegment: H, editorFilters: V, editorLayout: _, editorRef: ne, exportingExamples: de, filtersButtonRef: ye, filtersOpen: D, firstSegmentTagOpen: ae, focusRowRef: le, handleSeparatorKeyDown: X, handleSeparatorPointerDown: ce, handleSeparatorPointerMove: xe, hasNextUnreviewed: Ce, hasPreviousUnreviewed: Pe, hideDerivedSegments: fe, history: Y, historyOpen: be, historySaving: C, horizontalLayoutSize: ee, importNativeSegments: R, incorrectExamples: v, incorrectExamplesOpen: b, lineage: x, markerRailWidth: O, materializeButtonRef: re, materializeCancelButtonRef: te, materializeDerivedSegments: j, materializeError: oe, materializeLoading: I, materializeOpen: q, materializePreview: P, materializing: Q, mediaStackRef: he, mergeCancelButtonRef: me, mergeConfirmation: Te, mergeSaving: mt, mergeSelectedSwimlane: je, nativeImportState: Re, onDetailChange: Ze, onNavigate: it, onReload: gt, onSlotsChanged: et, openPublishApprovedDialog: ft, panelSeparatorProps: st, pendingInitialSeekRef: ze, performerSlots: Je, performerSlotsAvailable: Ye, playbackControlsRef: We, previewDerivedSegments: ut, provenance: yt, provenanceSources: J, publishApprovedCancelButtonRef: se, publishApprovedDrafts: ke, publishApprovedError: Ae, publishApprovedOpen: ve, quickSearchOpen: tt, railScrollRef: Ke, railToggleRef: Xe, recordHistoryAction: Ie, rejectedDeletionPreview: De, removeIncorrectExample: He, removingExampleId: Me, restoreHistoryTarget: Fe, runEditorAction: nt, saveMessage: Se, saveTag: Le, saveTiming: Oe, savingSegmentId: pt, seekRef: rt, segmentGroups: at, segmentRailLayout: Kt, segments: lt, selectAllVideoSegments: Ne, selectSegment: we, selectSegmentCollection: Qe, selectedGroups: Mt, selectedPerformerSlots: xt, selectedSegment: bt, selectedSegmentGroupKey: St, selectedSegmentIds: Pt, selectedSegments: Et, selectedSlotStatus: Rr, setAutoAssignError: Ar, setAutoAssignOpen: dn, setConfiguringTag: An, setCurrentTime: Mn, setEditorFilters: en, setEditorLayout: cn, setFiltersOpen: Xn, setHideDerivedSegments: Mr, setHistoryOpen: un, setIncorrectExamplesOpen: er, setQuickSearchOpen: mn, setRailViewport: En, setRejectedDeletionPreview: tr, setSaveMessage: gn, setSelectedSegmentGroupKey: nr, setSelectedSegmentId: rr, setShortcutsOpen: pn, setTimelineZoom: tn, shotBoundaries: Dn, shortcutsOpen: On, slotButtonRef: wt, splitLayout: zt, splitSegment: Pn, stepVideoFrame: Ln, tagEditing: or, tagSearchRef: jn, timelineDuration: Fn, timelineRatioBounds: ar, timelineZoom: Er, toggleSegmentGroup: fn, toggleSegmentRail: Bn, updateTimelineRatio: Gn, video: $e, videoPerformers: ht, visibleCounts: Dr, visibleSegmentRailRows: Or, visibleSegments: Lt, wideLayout: vt, workspaceRef: Pr } = e, yn = Ve(
    () => lt.filter((K) => !K.published && K.reviewState === "approved"),
    [lt]
  ), bn = Cs(ao), nn = yn.length, Kn = ue(null), Lr = Ve(() => () => un(!1), [un]), hn = P ? P.createCount + P.linkCount : null, Ut = pt != null, rn = Et.length > 0, Ht = Et.length === 1, Wt = rn && Et.every((K) => K.reviewState === "approved"), jr = rn && Et.every((K) => K.reviewState === "rejected"), Fr = [
    { id: "marker.create", label: "New segment", disabled: Ut },
    { id: "marker.editTag", label: "Edit tag", disabled: Ut || !rn },
    { id: "marker.setStart", label: "Set start", disabled: Ut || !Ht },
    { id: "marker.setEnd", label: "Set end", disabled: Ut || !Ht },
    { id: "marker.split", label: "Split", disabled: Ut || !Ht },
    ...F ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !Pe, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Wt ? "Unapprove" : "Approve", disabled: Ut || !rn, tone: "approve" },
      { id: "marker.reject", label: jr ? "Unreject" : "Reject", disabled: Ut || !rn, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !Ce, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...F ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: Ut || !m, tone: "reject" }
    ]
  ];
  function Br(K) {
    const Be = Pt.includes(K.id), Ge = K.id === (bt == null ? void 0 : bt.id), $t = K.endSec == null ? Ee(K.startSec) : `${Ee(K.startSec)} – ${Ee(K.endSec)}`, ge = `${Gt(K.sourceKey)}${K.confidence != null ? ` · ${Math.round(K.confidence * 100)}%` : ""}`;
    return n("button", {
      key: K.id,
      type: "button",
      onClick: (kt) => we(K, { additive: kt.metaKey || kt.ctrlKey }),
      "aria-pressed": Be,
      "aria-current": Ge ? "true" : void 0,
      "data-selected-segment-shortcut-target": Ge ? "true" : void 0,
      "aria-label": F ? `${K.tagName || "Tag segment"}, ${K.reviewState}${K.isDerived ? ", derived segment" : ""}, ${$t}` : `${K.tagName || "Tag segment"}${K.isDerived ? ", derived segment" : ""}, ${$t}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: gi(Be, Ge)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        F ? n(ln, { key: "review", state: K.reviewState, includeLabel: !1 }) : null,
        K.isDerived ? n(Tr, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          K.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, $t),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: ge
        }, ge)
      ])
    ]);
  }
  const vn = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", xn = [...Y.actions || []].reverse().find((K) => K.sequence <= Y.cursorSequence);
  return n("section", {
    ref: ne,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${zt ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "relative flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (K) => Ri(K, it, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${$e.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: $e.title || `Video ${$e.id}`
          }, $e.title || `Video ${$e.id}`)),
          ...ht.map((K) => n(Yn, {
            key: ct(K),
            performer: { id: ct(K), name: K.name },
            compact: !0,
            tooltip: K.name
          })),
          F ? n(Zt, { key: "review-counts", counts: Dr }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          F ? null : n(Ei, { key: "bin", onNavigate: it, compact: !0 }),
          n(Di, { key: "settings", onNavigate: it, compact: !0 })
        ])
      ]),
      F && B.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${B.nativeImportCount} Cove segment${B.nativeImportCount === 1 ? "" : "s"} ${B.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        Re.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, Re.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => R("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => R("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        Re.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, Re.error) : null
      ]) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          // Run AI and any other contributed video action, rendered by the host
          // exactly as they are on a video's own page rather than reimplemented here.
          $e != null && $e.id ? n($s, {
            key: "extension-actions",
            entityType: "video",
            entityId: $e.id,
            renderMode: "toolbar",
            onInvoked: gt
          }) : null,
          F ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: pt != null || a.length === 0,
            onClick: () => {
              Ar(""), dn(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${a.length ? ` (${a.length})` : ""}`) : null,
          F ? n("button", {
            key: "materialize-derived",
            ref: re,
            type: "button",
            disabled: pt != null || I || Q || hn === 0,
            onClick: ut,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, I ? "Analyzing…" : `Auto-Materialize${hn != null ? ` (${hn})` : ""}`) : null,
          F ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: pt != null || nn === 0,
            onClick: (K) => ft(K.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": ve,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${nn ? ` (${nn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: de || Me != null || v.length === 0,
            onClick: () => er(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": b,
            "aria-label": `Open AI feedback collection, ${v.length} example${v.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${v.length ? ` (${v.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: ye,
            type: "button",
            onClick: () => Xn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": D,
            className: `${vn} ${r ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(pr, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${r ? ` (${r})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => pn(!0),
            className: vn
          }, [n(pr, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            ref: Kn,
            type: "button",
            disabled: (F ? Y.actions.length === 0 : xn == null) || pt != null || C,
            onClick: F ? () => un((K) => !K) : () => Fe(
              xn.sequence - 1
            ),
            "aria-controls": F ? Oi : void 0,
            "aria-expanded": F ? be : void 0,
            className: vn
          }, [
            n(pr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, F ? `History${Y.actions.length ? ` (${Y.actions.length})` : ""}` : xn ? `Undo ${xn.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: Xe,
            type: "button",
            onClick: Bn,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": _.markerRailOpen,
            className: vn
          }, [
            n(pr, { key: "icon", name: "list" }),
            n("span", { key: "label" }, _.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ]),
      F && be ? n(fc, {
        key: "history-popover",
        history: Y,
        historySaving: C,
        anchorRef: Kn,
        onRestore: Fe,
        onClose: Lr
      }) : null
    ]),
    D ? n(pc, {
      key: "editor-filters",
      filters: V,
      hideDerivedSegments: fe,
      performers: ht,
      provenanceSources: J,
      reviewCounts: i,
      segments: lt,
      segmentGroups: at,
      reviewMode: F,
      onChange: en,
      onHideDerivedChange: Mr,
      onClose: p
    }) : null,
    ae ? n(gc, {
      key: "first-segment-tag-dialog",
      saving: pt != null,
      error: Se,
      onSelect: (K, Be) => A(K, Be),
      onClose: g
    }) : null,
    tt ? n(hc, {
      key: "quick-search-dialog",
      segments: Kl(o),
      onSelect: (K) => {
        mn(!1), we(K, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        mn(!1), requestAnimationFrame(() => {
          var K;
          return (K = ne.current) == null ? void 0 : K.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    l ? n(Sc, {
      key: "auto-assign-dialog",
      candidates: a,
      processing: c,
      error: s,
      onConfirm: d,
      onClose: () => dn(!1)
    }) : null,
    Te ? n(wc, {
      key: "merge-selection-dialog",
      merge: Te,
      processing: mt,
      undoable: !F,
      cancelButtonRef: me,
      onConfirm: (K) => je(!0, K, Te),
      onClose: $
    }) : null,
    q ? n(Ic, {
      key: "materialize-derived-dialog",
      preview: P,
      loading: I,
      processing: Q,
      error: oe,
      cancelButtonRef: te,
      onConfirm: j,
      onClose: () => {
        Q || S();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: Pr,
      className: `${zt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      _.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: vt ? { position: "absolute", top: 0, right: 0, width: O, height: ee.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        lt.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : Lt.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: Ke,
          onScroll: (K) => En({
            scrollTop: K.currentTarget.scrollTop,
            height: K.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: Kt.height }
        }, Or.map((K) => {
          var Ge;
          let Be;
          if (K.kind === "group") {
            const $t = U.includes(K.group.key), ge = K.group.lanes.reduce((kt, ir) => kt + ir.markers.length, 0);
            Be = n("button", {
              type: "button",
              onClick: () => {
                nr(K.group.key), fn(K.group.key);
              },
              "aria-expanded": !$t,
              "aria-current": St === K.group.key ? "true" : void 0,
              "data-segment-rail-group": K.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${St === K.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, $t ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: K.group.name }, K.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, ge),
              F && $t ? n(Zt, { key: "states", counts: K.group.counts }) : null
            ]);
          } else K.kind === "lane" ? Be = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Jn(K.lane),
            "aria-label": Jn(K.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, K.lane.label),
            (Ge = K.lane.performers) != null && Ge.length ? n($r, {
              key: "performers",
              performers: K.lane.performers,
              performerAssignments: K.lane.performerAssignments
            }) : null,
            F ? n(Zt, { key: "states", counts: K.lane.counts }) : null
          ]) : Be = Br(K.segment);
          return n("div", {
            key: K.key,
            className: "absolute left-0 right-0",
            style: { top: K.top, height: K.height }
          }, Be);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${zt ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: he,
          className: `${zt ? "min-h-0 flex-1" : ""} grid`,
          style: zt ? {
            gridTemplateRows: `minmax(16rem, ${(1 - _.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${_.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: le,
            className: "grid min-h-0 gap-2",
            style: vt ? {
              gridTemplateColumns: _.markerRailOpen ? `${k}px 0.5rem minmax(0,1fr) 0.5rem ${O}px` : `${k}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(Cc, {
              key: "tools",
              compatibilityMode: F,
              selectedSegment: bt,
              selectedSegments: Et,
              selectedGroups: Mt,
              saveMessage: Se,
              savingSegmentId: pt,
              creatingSegmentId: w,
              acquireSaveLock: t,
              setSaveMessage: gn,
              saveTag: Le,
              slotStatus: Rr,
              performerSlotsAvailable: Ye,
              selectedPerformerSlots: xt,
              performerSlots: Je,
              detail: B,
              onDetailChange: Ze,
              onCancelQueuedReview: u,
              video: $e,
              slotButtonRef: wt,
              tagSearchRef: jn,
              tagEditing: or,
              onCancelTagEditing: z,
              detailPanelRef: T,
              onReduceSelection: (K) => {
                we(K), requestAnimationFrame(() => {
                  var Be;
                  return (Be = T.current) == null ? void 0 : Be.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Oe,
              onSlotsChanged: et,
              onRecordHistory: Ie,
              splitSegment: Pn,
              duplicateSegment: H,
              provenance: yt,
              lineage: x,
              onNavigateLineageItem: (K) => {
                const Be = lt.find((Ge) => Ge.itemId === K);
                Be && rr(Be.id);
              }
            }),
            vt ? n(
              "div",
              { key: "detail-separator", ...st("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            $e.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Oa, {
                streamUrl: `/api/stream/video/${$e.id}`,
                posterUrl: `/api/stream/video/${$e.id}/screenshot?v=${encodeURIComponent($e.updatedAt || "")}`,
                format: $e.videoFile.format,
                audioCodec: $e.videoFile.audioCodec,
                duration: $e.videoFile.duration,
                videoId: $e.id,
                trackingEnabled: !1,
                onSeekRegister: (K) => {
                  rt.current = K, jl(ze.current, lt, K) && (ze.current = null);
                },
                onPlaybackControlRegister: (K) => {
                  We.current = K;
                },
                onTimeUpdate: Mn
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            vt && _.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...st("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            vt && _.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: W,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...Fr.map((K) => {
              var $t;
              const Be = ($t = bn[K.id]) == null ? void 0 : $t[0], Ge = K.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : K.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: K.id,
                type: "button",
                disabled: K.disabled,
                "data-action-id": K.id,
                onClick: (ge) => {
                  const kt = ge.currentTarget;
                  nt(K.id, { target: kt, preserveFocus: !0 }), K.focusWhenDisabled && requestAnimationFrame(() => {
                    Tc(kt, W.current, K.focusWhenDisabled);
                  });
                },
                title: Be ? `${K.label} (${Be})` : K.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${Ge}`
              }, [
                n("span", { key: "label" }, K.label),
                Be ? n("kbd", {
                  key: "shortcut",
                  className: "rounded border border-border/70 bg-background/70 px-1 py-0.5 font-mono text-[10px] leading-none text-secondary"
                }, Be) : null
              ]);
            }),
            n("div", { key: "frame-actions", className: "ml-auto flex items-center gap-1" }, [
              n("button", {
                key: "previous-frame",
                type: "button",
                disabled: !$e.videoFile,
                onClick: () => Ln(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(Rs, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !$e.videoFile,
                onClick: () => Ln(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(As, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          zt ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(ar.minimum * 100),
            "aria-valuemax": Math.round(ar.maximum * 100),
            "aria-valuenow": Math.round(_.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(_.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: ce,
            onPointerMove: xe,
            onKeyDown: X,
            onDoubleClick: () => Gn(Rt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: zt ? void 0 : { height: "20rem" } }, n($c, {
            segments: Lt,
            shotBoundaries: Dn,
            segmentGroups: at,
            performerSlots: Je,
            collapsedGroupKeys: U,
            selectedGroupKey: St,
            selectedSegmentId: bt == null ? void 0 : bt.id,
            selectedSegmentIds: Pt,
            duration: Fn,
            currentTime: N,
            zoom: Er,
            onZoomChange: tn,
            onSelectGroup: nr,
            onToggleGroup: fn,
            onSelect: (K, Be) => we(K, Be),
            onSelectSegments: Qe,
            onSelectAll: Ne,
            onConfigureTag: (K) => An(K),
            onSeekTime: (K) => {
              var Be;
              return (Be = rt.current) == null ? void 0 : Be.call(rt, K, !1);
            },
            centerRef: h,
            showReviewState: F,
            swimlaneTitleWidth: _.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (K) => cn((Be) => ({ ...Be, swimlaneTitleWidth: K }))
          }))
        ])
      ])
    ]),
    E ? n(vo, {
      key: `configure-tag:${E.tagId}`,
      tagId: E.tagId,
      tagName: E.tagName,
      performerSlotsEnabled: F,
      onSaved: gt,
      onClose: () => {
        const K = E.trigger;
        An(null), requestAnimationFrame(() => {
          var Be;
          K != null && K.isConnected ? K.focus({ preventScroll: !0 }) : (Be = ne.current) == null || Be.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    ve ? n(xc, {
      key: "publish-approved-dialog",
      drafts: yn,
      processing: pt === -1,
      error: Ae,
      cancelButtonRef: se,
      onConfirm: ke,
      onClose: f
    }) : null,
    De ? n(kc, {
      key: "rejected-deletion-dialog",
      preview: De,
      onConfirm: () => {
        M(De), requestAnimationFrame(() => {
          var K;
          return (K = ne.current) == null ? void 0 : K.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        tr(null), requestAnimationFrame(() => {
          var K;
          return (K = ne.current) == null ? void 0 : K.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    On ? n(yc, {
      key: "shortcuts-dialog",
      reviewMode: F,
      bindings: bn,
      onClose: () => pn(!1)
    }) : null,
    b ? n(bc, {
      key: "incorrect-examples-dialog",
      examples: v,
      exporting: de,
      removingExampleId: Me,
      onExport: y,
      onRemove: He,
      onClose: () => er(!1)
    }) : null
  ]);
}
function Ac(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: u, setCollapsedSegmentGroups: m, setEditorFilters: y, setHideDerivedSegments: h, setSaveMessage: p, setSelectedSegmentGroupKey: g, setSelectedSegmentId: S, setSelectedSegmentIds: $ } = e;
  function f(E) {
    const A = Ft(t, E);
    A && m((w) => Si(w, A));
  }
  function z(E) {
    S(E), $(E == null ? [] : [E]), c.current = E, u.current = [];
  }
  function U(E, {
    focusEditor: A = !1,
    seekToSegment: w = !1,
    additive: N = !1,
    rangeSegmentIds: M = null
  } = {}) {
    var T, k;
    const B = rl({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: u.current
    }, E.id, M, N);
    $(B.selectedSegmentIds), S(B.activeSegmentId), c.current = B.anchorSegmentId, u.current = B.rangeBaseSegmentIds, B.activeSegmentId != null && g(Ft(t, B.activeSegmentId)), f(E.id), A && ((T = r.current) == null || T.focus({ preventScroll: !0 })), w && ((k = i.current) == null || k.call(i, E.startSec, !1));
  }
  function W(E) {
    const A = tl(
      d,
      l,
      E
    );
    $(A.selectedSegmentIds), S(A.activeSegmentId), c.current = A.activeSegmentId, u.current = [], A.activeSegmentId != null && (g(Ft(t, A.activeSegmentId)), f(A.activeSegmentId));
  }
  function F() {
    var w;
    const E = al(s), A = E.includes(l) ? l : E[0] ?? null;
    y(Ot({})), h(!1), $(E), S(A), c.current = A, u.current = [], A != null && g(Ft(
      an(s, a, o),
      A
    )), p(E.length === 0 ? "There are no segments to select." : `${E.length} segments selected. Collapsed Segment groups keep their selected segments.`), (w = r.current) == null || w.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: f, replaceSegmentSelection: z, selectSegment: U, selectSegmentCollection: W, selectAllVideoSegments: F };
}
function Mc(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, stableSaveIdentity: c, historyRef: u, onConflict: m, onDetailChange: y, onReload: h, recordHistoryAction: p, revealSegmentGroupForSelection: g, savingSegmentId: S, selectedGroups: $, selectedSegment: f, selectedSegmentIdRef: z, selectedSegments: U, selectionAnchorIdRef: W, selectionRangeBaseIdsRef: F, setMergeConfirmation: E, setSaveMessage: A, setSelectedSegmentId: w, setSelectedSegmentIds: N, video: M } = e;
  function B() {
    E(null), requestAnimationFrame(() => {
      var V;
      return (V = a.current) == null ? void 0 : V.focus({ preventScroll: !0 });
    });
  }
  async function T(V = !1, _ = !1, ne = null) {
    if (S != null) return;
    const de = ne || vi(
      $,
      { nativeOnly: !o }
    );
    if (!de) {
      A("Select at least two segments from one swimlane.");
      return;
    }
    if (!V && Va()) {
      E(de);
      return;
    }
    _ && Ja(!1);
    const ye = de.endSec == null ? "open end" : Ee(de.endSec);
    let D = de.segments[0];
    const ae = o ? null : Dt(de.segments, !1), le = o ? null : crypto.randomUUID(), X = de.segments.map((fe) => fe.id), ce = Dd(i, de.segments).segments.find((fe) => fe.id === D.id), xe = {
      startSec: ce.startSec,
      endSec: ce.endSec,
      sourceKey: ce.sourceKey,
      sourceRunId: ce.sourceRunId,
      confidence: ce.confidence,
      isDerived: ce.isDerived
    }, Ce = r("merge", de.segments[0].id);
    if (!Ce) return;
    B();
    const Pe = _t();
    s({
      type: "add",
      entry: { id: Pe, op: "merge", targets: de.segments.map(Tt), values: xe }
    }), N([D.id]), w(D.id), W.current = D.id, F.current = [];
    try {
      const fe = de.segments.slice(1);
      if (!o || D.nativeSegmentId != null) {
        const Y = fe.map((C) => {
          const ee = `merge-native-selection:${M.id}:${D.id}:${C.id}:${D.updatedAt}:${C.updatedAt}`;
          return { key: ee, operationId: _e(ee), segmentId: C.id, expectedUpdatedAt: C.updatedAt };
        }), be = await Z(`/videos/${M.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: D.id,
            expectedSurvivorUpdatedAt: D.updatedAt,
            consumedSegments: Y.map(({ key: C, ...ee }) => ee),
            historyReceiptId: le
          })
        });
        D = be.survivor, y((C) => fa(C, be), M.id), s({ type: "confirm", key: Pe, applied: !0 }), Y.forEach(({ key: C }) => qe(C));
      } else {
        const Y = fe.map((C) => {
          const ee = `merge-draft-selection:${M.id}:${D.itemId}:${C.itemId}:${D.revision}:${C.revision}`;
          return { key: ee, operationId: _e(ee), itemId: C.itemId, expectedRevision: C.revision };
        }), be = await Z(`/videos/${M.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: D.itemId,
            expectedSurvivorRevision: D.revision,
            consumedDrafts: Y.map(({ key: C, ...ee }) => ee)
          })
        });
        D = be.survivor, y((C) => fa(C, be), M.id), s({ type: "confirm", key: Pe, applied: !0 }), Y.forEach(({ key: C }) => qe(C));
      }
      N([D.id]), w(D.id), W.current = D.id, F.current = [], o ? t(Vt) : await p(
        "segments.merge",
        `Merged ${de.segments.length} segments`,
        ae,
        Dt([D], !1),
        le
      ), g(D.id), A(`${de.segments.length} segments merged into ${Ee(de.startSec)} – ${ye}.`);
    } catch (fe) {
      s({ type: "discard", key: Pe }), N(X), w((f == null ? void 0 : f.id) ?? X[0] ?? null), W.current = (f == null ? void 0 : f.id) ?? X[0] ?? null, F.current = [], fe.status === 409 ? await m() : A(fe.message || "Unable to merge selected segments.");
    } finally {
      Ce();
    }
  }
  function k(V, _ = U, ne = f) {
    if (_.length === 0) return Promise.resolve(null);
    const de = yl(V, _, ne), ye = Math.max(0, de.identities.indexOf(de.activeIdentity)), D = d(), ae = wi(D) != null || D.queued.some((X) => bo(X.targets, de.identities.map(c))), le = l({
      kind: "review",
      lockId: de.activeIdentity.id,
      targets: de.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (X) => H(X, {
        ...de,
        identities: X.targets,
        activeIdentity: X.targets[ye]
      })
    });
    return le ? (ae && A(`${V === "approved" ? "Approval" : "Rejection"} queued…`), le.done) : (A("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function H({ detail: V, segments: _, onConflict: ne, onReload: de }, ye) {
    var be;
    const D = bl(ye, _);
    if (!D) {
      A("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: ae, selectedSegments: le, selectedSegment: X } = D, ce = fl(le, ae), xe = le.filter((C) => C.reviewState !== ce);
    if (xe.length === 0) return;
    const Ce = le.map((C) => ({
      id: C.id,
      itemId: C.itemId,
      nativeSegmentId: C.nativeSegmentId
    })), Pe = Ce.find((C) => C.id === (X == null ? void 0 : X.id)) || Ce[0], fe = (C, ee = !1) => {
      if (!(C != null && C.segments) || !ee && !Xr(z.current, Pe.id))
        return;
      const R = Ce.map((b) => ot(C == null ? void 0 : C.segments, b)).filter(Boolean), v = ot(C == null ? void 0 : C.segments, Pe) || R[0] || null;
      N(R.map((b) => b.id)), w((v == null ? void 0 : v.id) ?? null), W.current = (v == null ? void 0 : v.id) ?? null, F.current = [];
    };
    A(`Updating ${xe.length} selected segment${xe.length === 1 ? "" : "s"}…`);
    const Y = _t();
    s({
      type: "add",
      entry: { id: Y, op: "patch", targets: xe.map(Tt), values: { reviewState: ce } }
    });
    try {
      const C = await Z(`/videos/${M.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: u.current.revision,
          reviewState: ce,
          segments: le.map((b) => b.published ? {
            nativeSegmentId: b.nativeSegmentId,
            expectedUpdatedAt: b.updatedAt
          } : {
            itemId: b.itemId,
            expectedRevision: b.revision
          })
        })
      }), ee = new Map((C.items || []).map((b) => [
        b.requestedNativeSegmentId != null ? `native:${b.requestedNativeSegmentId}` : `item:${b.requestedItemId}`,
        b
      ]));
      if (Ce.forEach((b) => {
        const x = ee.get(b.nativeSegmentId != null ? `native:${b.nativeSegmentId}` : `item:${b.itemId}`);
        x && (b.nativeSegmentId = x.nativeSegmentId, b.itemId = x.itemId);
      }), C.history && t(C.history), ce === "rejected" && !C.editorDelta || (C.items || []).some((b) => b.requestedNativeSegmentId != null && b.nativeSegmentId !== b.requestedNativeSegmentId)) {
        const b = await de();
        s({ type: "confirm", key: Y, applied: b != null }), fe(b), A(`${C.updatedCount} selected segment${C.updatedCount === 1 ? "" : "s"} ${ce === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const v = C.editorDelta ? (b) => _n(b, C.editorDelta) : (b) => ({
        ...b,
        approvedSetVersion: C.approvedSetVersion || b.approvedSetVersion,
        segments: (b.segments || []).map((x) => {
          const O = ee.get(x.nativeSegmentId != null ? `native:${x.nativeSegmentId}` : `item:${x.itemId}`);
          return O ? {
            ...x,
            id: O.nativeSegmentId != null ? O.nativeSegmentId : -O.itemId,
            itemId: O.itemId,
            nativeSegmentId: O.nativeSegmentId,
            published: O.nativeSegmentId != null,
            reviewState: ce,
            revision: O.nativeSegmentId != null ? x.revision : O.revision,
            updatedAt: O.updatedAt
          } : x;
        })
      });
      y(v, M.id), s({ type: "confirm", key: Y, applied: !0 }), fe(v(V)), A(`${C.updatedCount} selected segment${C.updatedCount === 1 ? "" : "s"} ${ce === "approved" ? "approved" : ce === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (C) {
      s({ type: "discard", key: Y }), C.status === 409 && ((be = C.payload) != null && be.currentHistory) && t(C.payload.currentHistory);
      const ee = C.status === 409 ? await ne() : V;
      fe(ee, !0), A(C.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: B, mergeSelectedSwimlane: T, saveSelectedReviewState: k };
}
function Ec(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: u, detail: m, editorFilters: y, editorRef: h, cancelSaveTasks: p, dispatchPendingChanges: g, enqueueSave: S, stableSaveIdentity: $, exportingExamples: f, hideDerivedSegments: z, incorrectExamples: U, lineage: W, materializeButtonRef: F, materializePreview: E, materializeRestoreFocusRef: A, materializing: w, mutateSegment: N, runSegmentMutation: M, pendingChanges: B, onConflict: T, onDetailChange: k, onReload: H, performerSlots: V, recordHistoryAction: _, refreshMaterializationPreview: ne, removingExampleId: de, revealSegmentGroupForSelection: ye, savingSegmentId: D, segmentGroups: ae, segments: le, selectedSegment: X, selectedSegmentIdRef: ce, selectedSegments: xe, selectionAnchorIdRef: Ce, selectionRangeBaseIdsRef: Pe, setAutoAssignError: fe, setAutoAssignOpen: Y, setAutoAssigning: be, setEditorFilters: C, setExportingExamples: ee, setHideDerivedSegments: R, setIncorrectExamples: v, setMaterializeError: b, setMaterializeLoading: x, setMaterializeOpen: O, setMaterializePreview: re, setMaterializing: te, setRejectedDeletionPreview: j, setRemovingExampleId: oe, setSaveMessage: I, setSelectedSegmentGroupKey: q, setSelectedSegmentId: P, setSelectedSegmentIds: Q, swimlanes: he, video: me } = e;
  async function Te() {
    var Me, Fe, nt;
    if (xe.length === 0 || !X || D != null) return;
    const J = $d(xe, U), se = J.segments;
    if (se.length === 0) return;
    const ke = xe.map((Se) => ({
      id: Se.id,
      itemId: Se.itemId,
      nativeSegmentId: Se.nativeSegmentId
    })), Ae = ke.find((Se) => Se.id === X.id) || ke[0], ve = [], tt = [];
    let Ke = !1, Xe = m, Ie = !1;
    const De = [], He = r("feedback", Ae.id);
    if (He) {
      I(J.action === "remove" ? `Removing ${se.length} selected incorrect example${se.length === 1 ? "" : "s"}…` : `Collecting ${se.length} selected segment${se.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const Se = async (Ne, we) => {
          const Qe = Ne.nativeSegmentId != null, Mt = J.action === "remove" ? `incorrect-example-remove:${me.id}:${we == null ? void 0 : we.id}:${we == null ? void 0 : we.revision}:${we == null ? void 0 : we.representationRevision}` : `incorrect-example-collect:${me.id}:${Qe ? `native:${Ne.nativeSegmentId}:${Ne.updatedAt}` : `item:${Ne.itemId}:${Ne.revision}`}`;
          if (J.action === "remove" && !we)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let xt;
          try {
            xt = J.action === "remove" ? await Z(
              `/videos/${me.id}/incorrect-examples/${we.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: _e(Mt),
                  expectedExampleRevision: we.revision,
                  expectedRepresentationRevision: we.representationRevision
                })
              }
            ) : await Z(`/videos/${me.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: _e(Mt),
                nativeSegmentId: Qe ? Ne.nativeSegmentId : null,
                itemId: Qe ? null : Ne.itemId,
                expectedUpdatedAt: Qe ? Ne.updatedAt : null,
                expectedRevision: Qe ? null : Ne.revision
              })
            });
          } catch (bt) {
            throw bt.operationKey = Mt, bt;
          }
          if (!Td(J.action, xt))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return qe(Mt), xt;
        };
        for (const Ne of se) {
          const we = J.action === "remove" ? U.find((Qe) => Qe.itemId != null && Qe.itemId === Ne.itemId) : null;
          try {
            const Qe = ke.find((St) => St.id === Ne.id);
            let Mt = ot(
              Xe == null ? void 0 : Xe.segments,
              Qe
            ) || Ne, xt;
            try {
              xt = await Se(Mt, we);
            } catch (St) {
              if (St.status === 409 && ((Fe = (Me = St.payload) == null ? void 0 : Me.result) == null ? void 0 : Fe.code) === "OPERATION_REPLAYED")
                Xe = await Z(
                  `/videos/${me.id}/editor`
                ), Ie = !0, De.length = 0, qe(St.operationKey), xt = St.payload.result;
              else {
                if (J.action !== "collect" || St.status !== 409) throw St;
                const Pt = await Z(
                  `/videos/${me.id}/editor`
                );
                Xe = Pt, Ie = !0, De.length = 0;
                const Et = ot(
                  Pt == null ? void 0 : Pt.segments,
                  Qe
                );
                if (!Et) throw St;
                Mt = Et, xt = await Se(Mt, null);
              }
            }
            Qe && xt.itemId != null && (Qe.itemId = xt.itemId), Xe = _n(
              Xe,
              xt.editorDelta
            ), De.push(xt.editorDelta);
            const bt = { segment: Ne, result: xt, example: we };
            ve.push(bt);
          } catch (Qe) {
            if (tt.push(Qe), ![400, 404, 409].includes(Qe.status)) break;
          }
        }
        if (c && ve.length > 0) {
          const Ne = J.action === "remove", we = ve.length;
          await _(
            Ne ? "feedback.remove" : "feedback.collect",
            Ne ? `Removed ${we} incorrect AI example${we === 1 ? "" : "s"}` : `Collected ${we} incorrect AI example${we === 1 ? "" : "s"}`,
            mr(ve, Ne),
            mr(ve, !Ne)
          ) || (Ke = !0);
        }
        ve.some(({ result: Ne }) => Ne.representation === "basicNativeBin") && qn();
        const Le = Xr(
          ce.current,
          Ae.id
        ), Oe = J.action === "collect" && ve.some(({ segment: Ne }) => Ne.id === Ae.id), pt = ve.map(({ segment: Ne }) => Ne.id), rt = Oe ? hr(
          he,
          br(o, Ae.id),
          { removedIds: pt }
        ) : null, at = Oe ? (rt == null ? void 0 : rt.id) ?? null : Ae.id;
        Le && Oe && (Q(rt ? [rt.id] : []), P((rt == null ? void 0 : rt.id) ?? Cn), Ce.current = (rt == null ? void 0 : rt.id) ?? null, Pe.current = []);
        const Kt = await Z(`/videos/${me.id}/incorrect-examples`);
        v(Kt);
        const lt = Xe;
        if (k(Ie ? lt : (Ne) => De.reduce(_n, Ne), me.id), Le && Xr(
          ce.current,
          at
        )) {
          let Ne, we;
          Oe ? (we = rt ? ot(lt == null ? void 0 : lt.segments, {
            id: rt.id,
            itemId: rt.itemId,
            nativeSegmentId: rt.nativeSegmentId
          }) : null, Ne = we ? [we] : []) : (Ne = ke.map((Qe) => ot(lt == null ? void 0 : lt.segments, Qe)).filter(Boolean), we = ot(lt == null ? void 0 : lt.segments, Ae) || Ne[0] || null), Q(Ne.map((Qe) => Qe.id)), P((we == null ? void 0 : we.id) ?? (Oe ? Cn : null)), Ce.current = (we == null ? void 0 : we.id) ?? null, Pe.current = [], q(we ? Ft(o, we.id) : null), we && ye(we.id);
        }
        if (tt.length > 0) {
          const Ne = ((nt = tt[0]) == null ? void 0 : nt.message) || "Only segments with registered AI provenance can be collected.";
          ve.length === 0 ? I(Ne) : J.action === "remove" ? I(
            `Partially removed ${ve.length} of ${se.length} selected incorrect examples. ${Ne}`
          ) : I(
            `Partially collected ${ve.length} of ${se.length} selected segments. ${Ne}`
          );
        } else if (J.action === "remove")
          I(
            `${ve.length} incorrect example${ve.length === 1 ? "" : "s"} removed and ${ve.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const Ne = ve.filter(({ result: we }) => we.representation === "basicNativeBin").length;
          I(Ne === ve.length ? `${ve.length} incorrect AI example${ve.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ve.length} incorrect AI example${ve.length === 1 ? "" : "s"} collected and ${ve.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        Ke && I("The change saved, but editor history could not be updated.");
      } catch (Se) {
        I(Se.message || "Unable to update the selected incorrect examples.");
      } finally {
        He();
      }
    }
  }
  async function mt(J) {
    if (!J || de != null || f) return;
    const se = r("feedback", -1);
    if (!se) {
      I("Wait for the current save to finish before removing the incorrect example.");
      return;
    }
    try {
      await je(J);
    } finally {
      se();
    }
  }
  async function je(J) {
    var ke, Ae;
    oe(J.id);
    const se = `incorrect-example-remove:${me.id}:${J.id}:${J.revision}:${J.representationRevision}`;
    try {
      let ve, tt = !1;
      try {
        ve = await Z(
          `/videos/${me.id}/incorrect-examples/${J.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(se),
              expectedExampleRevision: J.revision,
              expectedRepresentationRevision: J.representationRevision
            })
          }
        );
      } catch (Ie) {
        if (Ie.status !== 409 || ((Ae = (ke = Ie.payload) == null ? void 0 : ke.result) == null ? void 0 : Ae.code) !== "OPERATION_REPLAYED")
          throw Ie;
        ve = Ie.payload.result, tt = !0;
      }
      qe(se);
      let Ke = !0;
      if (c) {
        const De = [{ segment: ot(m.segments, {
          itemId: J.itemId
        }) || {
          id: J.itemId == null ? null : -J.itemId,
          itemId: J.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: J.representationRevision
        }, result: ve, example: J }];
        Ke = await _(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          mr(De, !0),
          mr(De, !1)
        );
      }
      const Xe = await Z(
        `/videos/${me.id}/incorrect-examples`
      );
      v(Xe), tt ? await H() : k(
        (Ie) => _n(Ie, ve.editorDelta),
        me.id
      ), J.representation === "basicNativeBin" && qn(), I(Ke ? tt ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : J.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (ve) {
      ve.status === 409 && await T(), I(ve.message || "Unable to remove the incorrect example.");
    } finally {
      oe(null);
    }
  }
  async function Re() {
    if (f || de != null || U.length === 0) return;
    ee(!0);
    const J = `incorrect-example-export:${me.id}:${U.map((se) => `${se.id}:${se.revision}:${se.representationRevision}`).join(",")}`;
    try {
      const se = await Ad(
        me.id,
        U
      ), ke = new FormData();
      ke.append("metadata", JSON.stringify({
        operationId: _e(J),
        examples: se.captures
      }));
      for (const Ie of se.files)
        ke.append(Ie.fieldName, Ie.file);
      const Ae = await Z(
        `/videos/${me.id}/incorrect-examples/export`,
        { method: "POST", body: ke }
      ), ve = await Wl(Ae.downloadUrl), tt = URL.createObjectURL(ve.blob), Ke = document.createElement("a");
      Ke.href = tt, Ke.download = ve.fileName, Ke.click(), setTimeout(() => URL.revokeObjectURL(tt), 1e3);
      const Xe = await Z(
        `/training-exports/${Ae.id}/complete`,
        { method: "POST" }
      );
      qe(J), v(await Z(
        `/videos/${me.id}/incorrect-examples`
      )), I(
        `Downloaded ${Ae.exampleCount} incorrect example${Ae.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Xe.clearedExampleCount} from the working collection.`
      );
    } catch (se) {
      I(se.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      ee(!1);
    }
  }
  async function Ze(J = null) {
    const se = le.filter((Fe) => Fe.reviewState === "rejected"), ke = se.length, Ae = U.some((Fe) => Fe.representation === "fullItem");
    if (J == null && ke === 0 && !Ae) {
      I("There are no rejected segments to delete.");
      return;
    }
    if (J == null) {
      const Fe = r("delete-rejected", -1);
      if (!Fe) return;
      I("Preparing deletion summary…");
      try {
        const nt = await Z(`/videos/${me.id}/rejected/deletion/preview`, { method: "POST" }), Se = Number(nt.deletedSegmentCount) || 0, Le = Number(nt.deferredRejectedSegmentCount) || 0, Oe = Number(nt.protectedIncorrectExampleCount) || 0;
        if (Se === 0) {
          Le > 0 ? I(
            `${Le} feedback-protected rejected segment${Le === 1 ? "" : "s"} kept. ${Oe} AI feedback example${Oe === 1 ? "" : "s"} must be exported before ${Le === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : I("There are no rejected segments to delete.");
          return;
        }
        if (!di(nt, I)) return;
        j(nt), I("");
      } catch (nt) {
        I(nt.message || "Unable to prepare rejected segment deletion.");
      } finally {
        Fe();
      }
      return;
    }
    const ve = J, tt = Number(ve.deferredRejectedSegmentCount) || 0, Ke = ce.current, Xe = se.map((Fe) => Fe.id), Ie = tt === 0 && Xe.includes(Ke), De = Ie ? hr(
      he,
      br(o, Ke),
      { removedIds: Xe }
    ) : null, He = r("delete-rejected", -1);
    if (!He) return;
    j(null), I("Deleting rejected segments…");
    const Me = tt === 0 ? _t() : null;
    Me && g({
      type: "add",
      entry: { id: Me, op: "remove", targets: se.map(Tt) }
    }), Ie && (Q(De ? [De.id] : []), P((De == null ? void 0 : De.id) ?? Cn), Ce.current = (De == null ? void 0 : De.id) ?? null, Pe.current = []);
    try {
      const Fe = `rejected-dependency-delete:${me.id}:${ve.fingerprint}`, nt = await Z(`/videos/${me.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(Fe),
          fingerprint: ve.fingerprint
        })
      });
      qe(Fe);
      const Se = await H();
      Me && g({ type: "confirm", key: Me, applied: Se != null }), nt.deletedSegmentCount > 0 && t(Vt);
      const Le = tt > 0 ? ` ${tt} feedback-protected rejected segment${tt === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      I(`${nt.deletedSegmentCount} segment${nt.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Le}`);
    } catch (Fe) {
      Me && g({ type: "discard", key: Me }), Ie && (Q(Ke == null ? [] : [Ke]), P(Ke), Ce.current = Ke, Pe.current = []), I(Fe.message || "Unable to delete rejected segments.");
    } finally {
      He();
    }
  }
  async function it(J = i) {
    if (a || J.length === 0) return;
    const se = r("auto-assign", -1);
    if (!se) {
      fe("Wait for the current save to finish before assigning performers.");
      return;
    }
    try {
      await gt(J);
    } finally {
      se();
    }
  }
  async function gt(J) {
    be(!0), fe("");
    try {
      const se = await Z(`/videos/${me.id}/segments/auto-assign-performer-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeSegmentIds: J.flatMap((ke) => ke.nativeSegmentId == null ? [] : [ke.nativeSegmentId]),
          itemIds: J.flatMap((ke) => ke.published || ke.itemId == null ? [] : [ke.itemId])
        })
      });
      Y(!1), await H(), I(`${se.assignedSegmentCount} segment${se.assignedSegmentCount === 1 ? "" : "s"} received ${se.assignedSlotCount} performer-slot assignment${se.assignedSlotCount === 1 ? "" : "s"}.`);
    } catch (se) {
      fe(se.message || "Unable to auto-assign performers.");
    } finally {
      be(!1);
    }
  }
  async function et() {
    O(!0), b(""), !E && (x(!0), ne());
  }
  function ft() {
    A.current = !0, O(!1), requestAnimationFrame(() => {
      var J;
      return (J = F.current) == null ? void 0 : J.focus({ preventScroll: !0 });
    });
  }
  async function st() {
    if (!E || w || E.createCount + E.linkCount === 0)
      return;
    const J = r("materialize", -1);
    if (!J) {
      b("Wait for the current save to finish before materializing derived segments.");
      return;
    }
    try {
      await ze();
    } finally {
      J();
    }
  }
  async function ze() {
    te(!0), b("");
    let J;
    try {
      const se = `materialize-derived:${me.id}:${E.fingerprint}`;
      J = await Z(`/videos/${me.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(se),
          fingerprint: E.fingerprint,
          maxDepth: 3
        })
      }), qe(se);
    } catch (se) {
      se.status === 409 && re(null), b(se.message || "Unable to materialize derived segments."), te(!1);
      return;
    }
    re((se) => se && { ...se, createCount: 0, linkCount: 0 });
    try {
      await H(), ft(), re(null);
      const se = J.createdCount + J.linkedCount;
      I(`${J.createdCount} derived segment${J.createdCount === 1 ? "" : "s"} created and ${J.linkedCount} existing segment${J.linkedCount === 1 ? "" : "s"} linked.`), se === 0 && I("Every applicable derivation was already materialized.");
    } catch {
      b("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    te(!1);
  }
  async function Je(J, se = null) {
    var ve, tt, Ke, Xe;
    const ke = {
      tagId: J,
      ...se ? { tagName: se } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (xe.length > 1) {
      const Ie = xe.filter((Se) => Se.tagId !== J);
      if (Ie.length === 0) {
        d();
        return;
      }
      const De = xe.map((Se) => ({
        id: Se.id,
        itemId: Se.itemId,
        nativeSegmentId: Se.nativeSegmentId
      })), He = xe.map((Se) => !c || Se.nativeSegmentId != null ? `native:${Se.nativeSegmentId}:${Se.updatedAt}` : `item:${Se.itemId}:${Se.revision}`).sort().join(","), Me = `bulk-tag:${me.id}:${J}:${He}`, Fe = r("tag", (X == null ? void 0 : X.id) ?? Ie[0].id);
      if (!Fe) return;
      I(`Changing tag for ${Ie.length} selected segment${Ie.length === 1 ? "" : "s"}…`);
      const nt = _t();
      g({
        type: "add",
        entry: { id: nt, op: "patch", targets: Ie.map(Tt), values: ke }
      }), d();
      try {
        const Se = c ? null : crypto.randomUUID();
        await Z(`/videos/${me.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(Me),
            tagId: J,
            historyReceiptId: Se,
            segments: xe.map((at) => {
              const Kt = !c || at.nativeSegmentId != null;
              return {
                nativeSegmentId: Kt ? at.nativeSegmentId : null,
                itemId: Kt ? null : at.itemId,
                expectedUpdatedAt: Kt ? at.updatedAt : null,
                expectedRevision: Kt ? null : at.revision
              };
            })
          })
        }), qe(Me);
        const Le = Dt(
          xe,
          c
        ), Oe = await H();
        g({ type: "confirm", key: nt, applied: Oe != null });
        const pt = De.map((at) => ot(Oe == null ? void 0 : Oe.segments, at)).filter(Boolean);
        await _(
          "segments.tag",
          `Changed tag for ${Ie.length} segment${Ie.length === 1 ? "" : "s"}`,
          Le,
          Dt(pt, c),
          Se
        );
        const rt = De.map((at) => ot(Oe == null ? void 0 : Oe.segments, at)).filter(Boolean);
        Q(rt.map((at) => at.id)), P(((ve = rt.find((at) => at.id === (X == null ? void 0 : X.id))) == null ? void 0 : ve.id) ?? ((tt = rt[0]) == null ? void 0 : tt.id) ?? null), d(), I(`${Ie.length} selected segment${Ie.length === 1 ? "" : "s"} retagged.`);
      } catch (Se) {
        g({ type: "discard", key: nt });
        const Le = De.map((pt) => ot(m.segments, pt)).filter(Boolean), Oe = ot(m.segments, {
          id: X == null ? void 0 : X.id,
          itemId: X == null ? void 0 : X.itemId,
          nativeSegmentId: X == null ? void 0 : X.nativeSegmentId
        }) || Le[0] || null;
        Q(Le.map((pt) => pt.id)), P((Oe == null ? void 0 : Oe.id) ?? null), Ce.current = (Oe == null ? void 0 : Oe.id) ?? null, Pe.current = [], Se.status === 409 && await T(), I(Se.message || "Unable to change the selected segment tags.");
      } finally {
        Fe();
      }
      return;
    }
    if (xe.length !== 1 || !X) return;
    const Ae = Ni(B, X);
    if (X.id === u || Ae) {
      const Ie = Ae ? { segmentId: X.id, tagId: Ae.values.tagId, tagName: Ae.meta.tagName } : null, De = kl(Ie, X, J, se);
      if (De && !Ye(X, De)) {
        d();
        return;
      }
      if (Ae && (p((He) => {
        var Me;
        return ((Me = He.meta) == null ? void 0 : Me.pendingChangeId) === Ae.id;
      }), g({ type: "discard", key: Ae.id })), De) {
        const He = Ya(
          { ...X, tagId: De.tagId },
          V,
          y,
          z,
          ae
        );
        C(He.filters), R(He.hideDerivedSegments), I("Tag change queued…");
      } else Ae && I("");
      d();
      return;
    }
    if (J === X.tagId) {
      d();
      return;
    }
    if (X.itemId != null && ((Xe = (Ke = W.data) == null ? void 0 : Ke.children) == null ? void 0 : Xe.length) > 0) {
      const Ie = r("lineage-tag", X.id);
      if (!Ie) return;
      I("Checking lineage impact…");
      let De = null;
      try {
        const He = await Z(`/items/${X.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: X.revision, tagId: J })
        }), Me = He.deletedItemIds.length > 0 || He.removedEdgeIds.length > 0;
        if (Me && !window.confirm(
          `Changing this tag removes ${He.removedEdgeIds.length} lineage edge${He.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${He.deletedItemIds.length} derived segment${He.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
        )) {
          I("Tag change canceled.");
          return;
        }
        De = _t(), g({
          type: "add",
          entry: { id: De, op: "patch", targets: [Tt(X)], values: ke }
        }), d();
        const Fe = `tag-change:${X.itemId}:${X.revision}:${He.componentFingerprint}:${J}`;
        await Z(`/items/${X.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(Fe),
            expectedRevision: X.revision,
            componentFingerprint: He.componentFingerprint,
            tagId: J
          })
        }), qe(Fe);
        const nt = await H();
        g({ type: "confirm", key: De, applied: nt != null }), d(), I(Me ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch (He) {
        De && g({ type: "discard", key: De }), Q([X.id]), P(X.id), Ce.current = X.id, Pe.current = [], He.status === 409 ? (I("Lineage changed — loading the latest segments…"), await T()) : I(He.message || "Unable to reconcile the lineage.");
      } finally {
        Ie();
      }
      return;
    }
    d(), await N(X, {
      startSec: X.startSec,
      endSec: X.endSec,
      tagId: J
    }, !0, null, !0, ke);
  }
  function Ye(J, se) {
    const ke = _t(), Ae = $(Tt(J));
    g({
      type: "add",
      entry: {
        id: ke,
        op: "patch",
        targets: [Ae],
        values: { tagId: se.tagId, tagName: se.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: se.tagName }
      }
    });
    const ve = B.find((Ke) => Ke.op === "insert" && Ke.segment.id === J.id);
    return S({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [Ae],
      dependsOn: (ve == null ? void 0 : ve.taskId) ?? null,
      meta: { pendingChangeId: ke },
      ready: (Ke, Xe) => {
        const Ie = ki(Ke.segments, Xe.targets[0]);
        return !Ie || wl(Ke, Ie.id);
      },
      run: (Ke) => We(Ke, ke, se)
    }) ? !0 : (g({ type: "discard", key: ke }), I("Wait for the history restore to finish."), !1);
  }
  async function We(J, se, ke) {
    const [Ae] = J.resolveTargets();
    if (!Ae) {
      g({ type: "discard", key: se }), I(`The new segment was not retagged${ke.tagName ? ` to ${ke.tagName}` : ""}. Choose its tag again.`);
      return;
    }
    if (Ae.tagId === ke.tagId) {
      g({ type: "discard", key: se });
      return;
    }
    await M(Ae, {
      startSec: Ae.startSec,
      endSec: Ae.endSec,
      tagId: ke.tagId
    }, {
      pendingChangeId: se,
      restoreSelectionOnFailure: !1,
      onReload: J.onReload,
      onConflict: J.onConflict
    }) || I(`The new segment was not retagged${ke.tagName ? ` to ${ke.tagName}` : ""}. Choose its tag again.`);
  }
  async function ut() {
    var Xe, Ie, De, He;
    if (!l || !X || D != null) return;
    const J = [...xe].sort((Me, Fe) => Number(Me.nativeSegmentId ?? Me.id) - Number(Fe.nativeSegmentId ?? Fe.id)), se = new Set(J.map((Me) => Me.id)), ke = J.map((Me) => `${Me.nativeSegmentId ?? Me.id}:${Me.updatedAt}`).join("|"), Ae = r("bin", X.id);
    if (!Ae) return;
    I(`Moving ${J.length} segment${J.length === 1 ? "" : "s"} to recycling bin…`);
    const ve = `bulk-move:${me.id}:${ke}`, tt = _e(ve), Ke = c ? null : crypto.randomUUID();
    try {
      const Me = (Le = !1) => Z(`/videos/${me.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: tt,
          segments: J.map((Oe) => ({
            segmentId: Oe.nativeSegmentId ?? Oe.id,
            expectedUpdatedAt: Oe.updatedAt
          })),
          discardMissingImage: Le,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: Ke
        })
      });
      let Fe;
      try {
        Fe = await Me(
          uo(ve)
        );
      } catch (Le) {
        if (((Xe = Le.payload) == null ? void 0 : Xe.code) !== "missing-image" || !window.confirm(`${Le.message}

Continue and discard the missing image reference?`)) throw Le;
        mo(ve), Fe = await Me(!0);
      }
      qe(ve), qn();
      const nt = new Map((Fe.items || []).map((Le) => [
        Number(Le.segmentId),
        Le
      ]));
      await _(
        "segments.moveToBin",
        `Moved ${J.length} segment${J.length === 1 ? "" : "s"} to recycling bin`,
        Dt(J, !1),
        Dt(J.map((Le) => {
          const Oe = nt.get(
            Number(Le.nativeSegmentId ?? Le.id)
          );
          return {
            ...Le,
            recycleBinItemId: (Oe == null ? void 0 : Oe.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (Oe == null ? void 0 : Oe.revision) ?? null
          };
        }), !1),
        Ke
      );
      const Se = hr(
        he,
        br(o, X.id),
        { removedIds: [...se] }
      );
      k((Le) => ({
        ...Le,
        segments: (Le.segments || []).filter((Oe) => !se.has(Oe.id))
      }), me.id), Q(Se ? [Se.id] : []), P((Se == null ? void 0 : Se.id) ?? Cn), Ce.current = (Se == null ? void 0 : Se.id) ?? null, Pe.current = [], Se && (q(Ft(o, Se.id)), ye(Se.id)), requestAnimationFrame(() => {
        var Le;
        return (Le = h.current) == null ? void 0 : Le.focus({ preventScroll: !0 });
      }), I(`Moved ${J.length} segment${J.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Me) {
      const Fe = ((Ie = Me.payload) == null ? void 0 : Ie.code) || ((He = (De = Me.payload) == null ? void 0 : De.result) == null ? void 0 : He.code);
      Me.status === 409 && Fe === "CANONICAL_SEGMENT_CHANGED" ? await T() : I(Me.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Ae();
    }
  }
  async function yt() {
    if (!(c || s.current || D != null)) {
      s.current = !0, I("Checking the recycling bin…");
      try {
        const J = await Z("/bin"), se = await ui(J, () => I("Emptying the recycling bin…"));
        if (se.status === "empty") {
          I("The recycling bin is empty.");
          return;
        }
        if (se.status === "canceled") {
          I("The recycling bin was not emptied.");
          return;
        }
        I(`${se.segmentCount} segment${se.segmentCount === 1 ? "" : "s"} from ${se.sceneCount} scene${se.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (J) {
        I(J.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: Te, removeIncorrectExample: mt, captureTrainingExport: Re, deleteRejectedSegments: Ze, autoAssignPerformers: it, previewDerivedSegments: et, closeMaterializeDialog: ft, materializeDerivedSegments: st, saveTag: Je, moveToBin: ut, emptyRecyclingBin: yt };
}
function Dc(e) {
  const { acceptHistory: t, acquireSaveLock: r, enqueueSave: o, getSaveQueueSnapshot: i, commonActionsRef: a, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: u, history: m, historyRef: y, historySaving: h, horizontalLayoutSize: p, mediaStackHeight: g, mediaStackRef: S, onDetailChange: $, onReload: f, railToggleRef: z, recordHistoryAction: U, savingSegmentId: W, setCollapsedSegmentGroups: F, setEditorLayout: E, setHistorySaving: A, setIncorrectExamples: w, setSaveMessage: N, shotBoundaries: M, timelineDuration: B, video: T, workspaceRef: k } = e;
  async function H(R, v, b) {
    var te, j, oe, I;
    const x = R.type === "segment" ? [R] : R.segments || [], O = (v == null ? void 0 : v.type) === "segment" ? [v] : (v == null ? void 0 : v.segments) || [];
    let re = b;
    for (const [q, P] of x.entries()) {
      const Q = O[q], he = ((te = P.identity) == null ? void 0 : te.nativeSegmentId) != null || ((j = P.identity) == null ? void 0 : j.published) === !0, me = ((oe = Q == null ? void 0 : Q.identity) == null ? void 0 : oe.recycleBinItemId) ?? ((I = Q == null ? void 0 : Q.identity) == null ? void 0 : I.itemId);
      let Te = ot(re.segments, Q == null ? void 0 : Q.identity) || ot(re.segments, P.identity);
      if (!Te && he && me != null && Q.identity.revision != null) {
        const Re = `history-restore:${T.id}:${me}:${Q.identity.revision}`;
        await Z(`/bin/${me}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(Re),
            expectedRevision: Q.identity.revision
          })
        }), qe(Re), re = await f(), Te = re.segments.find((Ze) => Ze.tagId === P.values.tagId && Ze.startSec === P.values.startSec && Ze.endSec === P.values.endSec);
      }
      if (!Te)
        throw new Error("A segment in this history state no longer exists.");
      if ((Te.nativeSegmentId != null || Te.published === !0) !== he) {
        if (he) {
          const Re = Te.recycleBinItemId ?? Te.itemId ?? me;
          if (Re == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Ze = `history-restore:${T.id}:${Re}:${Te.revision}:${P.values.reviewState ?? "native"}`;
          await Z(`/bin/${Re}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(Ze),
              expectedRevision: Te.revision
            })
          }), qe(Ze);
        } else {
          const Re = `history-bin:${T.id}:${Te.nativeSegmentId}:${Te.updatedAt}:${P.values.reviewState}`;
          await Z(`/videos/${T.id}/segments/${Te.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(Re),
              expectedUpdatedAt: Te.updatedAt,
              reviewState: P.values.reviewState
            })
          }), qe(Re);
        }
        if (re = await f(), !he)
          continue;
        if (Te = ot(re.segments, P.identity) || re.segments.find((Re) => Re.tagId === P.values.tagId && Re.startSec === P.values.startSec && Re.endSec === P.values.endSec), !Te)
          throw new Error("The restored segment could not be found.");
      }
      const je = P.values;
      if (Te.nativeSegmentId == null && Te.itemId != null) {
        const Re = `history-draft-update:${T.id}:${Te.itemId}:${Te.revision}:${je.tagId}:${je.startSec}:${je.endSec ?? "open"}:${je.reviewState}`;
        await Z(`/videos/${T.id}/drafts/${Te.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(Re),
            expectedRevision: Te.revision,
            ...je
          })
        }), qe(Re);
      } else
        await Z(`/videos/${T.id}/segments/${Te.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...je, expectedUpdatedAt: Te.updatedAt })
        });
      re = await f();
    }
    return re;
  }
  async function V(R, v) {
    var b;
    for (const x of R.targets || []) {
      const O = ot(v.segments, x.identity);
      if (!O)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const re = (b = v.performerSlotRevisions) == null ? void 0 : b[O.id];
      await Z(O.published ? `/videos/${T.id}/segments/${O.nativeSegmentId}/slots` : `/videos/${T.id}/drafts/${O.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: re,
          assignments: x.assignments
        })
      }), v = await f();
    }
    return v;
  }
  async function _(R, v, b) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let x = v, O = await Z(`/videos/${T.id}/incorrect-examples`);
    const re = (te) => O.find((j) => {
      var oe;
      return j.id === te.exampleId || ((oe = te.collectedIdentity) == null ? void 0 : oe.itemId) != null && j.itemId === te.collectedIdentity.itemId;
    });
    for (const [te, j] of (R.entries || []).entries()) {
      const oe = `history-feedback:${T.id}:${b.action.sequence}:${b.direction}:${te}`, I = re(j);
      if (R.collected && I) {
        qe(oe);
        continue;
      }
      let q;
      if (R.collected) {
        const P = ot(
          x.segments,
          j.collectedIdentity
        ) || ot(
          x.segments,
          j.originalIdentity
        );
        if (!P)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const Q = P.nativeSegmentId != null;
        q = await Z(`/videos/${T.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(oe),
            nativeSegmentId: Q ? P.nativeSegmentId : null,
            itemId: Q ? null : P.itemId,
            expectedUpdatedAt: Q ? P.updatedAt : null,
            expectedRevision: Q ? null : P.revision
          })
        });
      } else {
        if (!I) {
          qe(oe);
          continue;
        }
        q = await Z(
          `/videos/${T.id}/incorrect-examples/${I.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(oe),
              expectedExampleRevision: I.revision,
              expectedRepresentationRevision: I.representationRevision
            })
          }
        );
      }
      qe(oe), x = _n(
        x,
        q.editorDelta
      ), O = await Z(
        `/videos/${T.id}/incorrect-examples`
      );
    }
    return w(O), x;
  }
  async function ne(R, v, b = []) {
    const x = R.state;
    if (!s && ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")) {
      const re = `basic-history:${T.id}:${y.current.revision}:${R.action.sequence}:${R.direction}`, te = await Z(`/videos/${T.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(re),
          expectedHistoryRevision: y.current.revision,
          actionSequence: R.action.sequence,
          direction: R.direction
        })
      });
      return t(te.history), b.push(re), f();
    }
    const O = R.direction === "backward" ? R.action.afterState : R.action.beforeState;
    if ((x == null ? void 0 : x.type) === "composite") {
      let re = v;
      const te = (O == null ? void 0 : O.type) === "composite" ? O.states || [] : [];
      for (const [j, oe] of (x.states || []).entries()) {
        const I = te[j];
        re = await ne({
          ...R,
          state: oe,
          action: {
            ...R.action,
            beforeState: R.direction === "backward" ? oe : I,
            afterState: R.direction === "backward" ? I : oe
          }
        }, re, b);
      }
      return re;
    }
    if ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")
      return H(
        x,
        O,
        v
      );
    if ((x == null ? void 0 : x.type) === "performerSlots")
      return V(x, v);
    if ((x == null ? void 0 : x.type) === "incorrectExamples")
      return _(x, v, R);
    if ((x == null ? void 0 : x.type) === "shots") {
      const re = vr(v.shotBoundaries || []), te = await Z(`/videos/${T.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(`history-shots:${T.id}:${re}:${x.fingerprint}`),
          expectedFingerprint: re,
          boundaries: x.boundaries
        })
      });
      return { ...v, shotBoundaries: te };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function de(R) {
    if (h || R === m.cursorSequence) return;
    if (W != null) {
      N("Finish the pending saves before restoring history.");
      return;
    }
    if (ga(m, R).length === 0) return;
    const b = o({
      kind: "history",
      lockId: -1,
      exclusive: !0,
      run: (x) => ye(x.detail, R)
    });
    if (!b) {
      N("Finish the pending saves before restoring history.");
      return;
    }
    await b.done;
  }
  async function ye(R, v) {
    var x;
    const b = ga(y.current, v);
    if (b.length !== 0) {
      A(!0), N(`Restoring ${b.length} history ${b.length === 1 ? "action" : "actions"}…`);
      try {
        let O = R;
        const re = [];
        for (const j of b)
          O = await ne(
            j,
            O,
            re
          );
        const te = s ? await Z(`/videos/${T.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: y.current.revision,
            targetSequence: v
          })
        }) : y.current;
        re.forEach(qe), t(te), await f(), N("History restored.");
      } catch (O) {
        O.status === 409 && ((x = O.payload) != null && x.current) && t(O.payload.current), await f(), N(O.message || "Unable to restore editor history.");
      } finally {
        A(!1);
      }
    }
  }
  function D(R) {
    E((v) => ({ ...v, timelineRatio: lo(R, g) }));
  }
  function ae(R) {
    var x, O;
    const v = (x = S.current) == null ? void 0 : x.getBoundingClientRect();
    if (!v) return;
    const b = ((O = a.current) == null ? void 0 : O.offsetHeight) || 0;
    D(_s(
      R.clientY,
      v.top + b,
      Math.max(0, v.height - b)
    ));
  }
  function le(R) {
    R.currentTarget.setPointerCapture(R.pointerId), ae(R);
  }
  function X(R) {
    R.currentTarget.hasPointerCapture(R.pointerId) && ae(R);
  }
  function ce(R) {
    const v = R.shiftKey ? 0.1 : 0.05;
    let b = null;
    R.key === "ArrowUp" && (b = c.timelineRatio + v), R.key === "ArrowDown" && (b = c.timelineRatio - v);
    const x = so(g);
    R.key === "Home" && (b = x.minimum), R.key === "End" && (b = x.maximum), b != null && (R.preventDefault(), R.stopPropagation(), D(b));
  }
  function xe(R) {
    const v = R === "detailWidth" ? p.focusRow : p.workspace, b = p.workspace > 0 ? Yr(p.workspace, 600) : 560, x = on(c.markerRailWidth, b), O = R === "detailWidth" ? 344 + (c.markerRailOpen ? x + 24 : 0) : 600;
    return v > 0 ? Yr(v, O) : 560;
  }
  function Ce(R, v) {
    E((b) => ({ ...b, [R]: on(v, xe(R)) }));
  }
  function Pe(R, v) {
    var x, O;
    const b = v === "detailWidth" ? (x = u.current) == null ? void 0 : x.getBoundingClientRect() : (O = k.current) == null ? void 0 : O.getBoundingClientRect();
    b && Ce(v, v === "detailWidth" ? R.clientX - b.left : b.right - R.clientX);
  }
  function fe(R, v) {
    const b = xe(R), x = on(c[R], b);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": v,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(b),
      "aria-valuenow": Math.round(x),
      "aria-valuetext": `${Math.round(x)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (O) => {
        O.currentTarget.setPointerCapture(O.pointerId), Pe(O, R);
      },
      onPointerMove: (O) => {
        O.currentTarget.hasPointerCapture(O.pointerId) && Pe(O, R);
      },
      onKeyDown: (O) => {
        const re = O.shiftKey ? 40 : 16;
        let te = null;
        O.key === "ArrowLeft" && (te = R === "detailWidth" ? -re : re), O.key === "ArrowRight" && (te = R === "detailWidth" ? re : -re);
        let j = te == null ? null : x + te;
        O.key === "Home" && (j = 240), O.key === "End" && (j = b), j != null && (O.preventDefault(), O.stopPropagation(), Ce(R, j));
      },
      onDoubleClick: () => Ce(R, Rt[R]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function Y() {
    E((R) => ({ ...R, markerRailOpen: !R.markerRailOpen })), requestAnimationFrame(() => {
      var R;
      return (R = z.current) == null ? void 0 : R.focus({ preventScroll: !0 });
    });
  }
  function be(R) {
    F((v) => v.includes(R) ? v.filter((b) => b !== R) : Xt([...v, R]));
  }
  function C(R, v = !0, b = l) {
    const x = i().running != null, O = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (re) => ee(re.detail, R, v, b)
    });
    return O ? (x && N(R === "split" ? "Shot boundary queued…" : "Shot merge queued…"), O.done.then((re) => re.value ?? null)) : (N("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function ee(R, v, b, x) {
    var oe;
    const O = (R == null ? void 0 : R.shotBoundaries) || [], re = Number((oe = T.videoFile) == null ? void 0 : oe.duration) || B, te = vr(O), j = `shot-${v}:${T.id}:${x.toFixed(3)}:${re.toFixed(3)}:${te}`;
    N(v === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const I = await Z(`/videos/${T.id}/shot-boundaries/${v}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: _e(j), timeSec: x })
      });
      return qe(j), $((q) => ({ ...q, shotBoundaries: I }), T.id), b && await U(
        "shots.update",
        v === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: O,
          fingerprint: te
        },
        {
          type: "shots",
          boundaries: I,
          fingerprint: vr(I)
        }
      ), N(v === "split" ? "Shot boundary added." : "Shots merged."), I;
    } catch (I) {
      return N(I.message || "Unable to edit shot boundaries."), null;
    }
  }
  return { applySegmentHistoryState: H, applyPerformerSlotHistoryState: V, applyHistoryState: ne, restoreHistoryTarget: de, updateTimelineRatio: D, updateTimelineRatioFromPointer: ae, handleSeparatorPointerDown: le, handleSeparatorPointerMove: X, handleSeparatorKeyDown: ce, panelWidthMaximum: xe, updatePanelWidth: Ce, handlePanelSeparatorPointer: Pe, panelSeparatorProps: fe, toggleSegmentRail: Y, toggleSegmentGroup: be, mutateShotBoundary: C };
}
function Oc(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: u, emptyRecyclingBin: m, lineage: y, mediaDuration: h, mergeSelectedSwimlane: p, moveToBin: g, mutateShotBoundary: S, openPublishApprovedDialog: $, playbackControlsRef: f, playbackShortcutConfig: z, saveSelectedReviewState: U, seekRef: W, segmentGroupKeys: F, selectSegment: E, selectedSegment: A, selectedSegmentGroupForSegment: w, selectedSegmentGroupKey: N, selectedSegments: M, setCollapsedSegmentGroups: B, setIncorrectExamplesOpen: T, setQuickSearchOpen: k, setSaveMessage: H, setSelectedSegmentGroupKey: V, setTagEditing: _, setTimelineZoom: ne, shotBoundaries: de, slotButtonRef: ye, splitSegment: D, swimlanes: ae, timelineDuration: le, toggleIncorrectExample: X, toggleSegmentGroup: ce, updateTimelineRatio: xe, videoFrameRate: Ce, visibleSegments: Pe } = e;
  function fe(C) {
    var ee, R;
    (ee = f.current) == null || ee.pause(), (R = f.current) == null || R.seekBy(Cl(C, Ce));
  }
  function Y(C, ee) {
    if (M.length > 1 && cl(C.id))
      return;
    let R = null;
    C.id === "video.playPause" && (R = () => {
      var v;
      return (v = f.current) == null ? void 0 : v.toggle();
    }), C.id === "video.seekSmallBackward" && (R = () => {
      var v;
      return (v = f.current) == null ? void 0 : v.seekBy(-z.smallSeekTime);
    }), C.id === "video.seekSmallForward" && (R = () => {
      var v;
      return (v = f.current) == null ? void 0 : v.seekBy(z.smallSeekTime);
    }), C.id === "video.seekMediumBackward" && (R = () => {
      var v;
      return (v = f.current) == null ? void 0 : v.seekBy(-z.mediumSeekTime);
    }), C.id === "video.seekMediumForward" && (R = () => {
      var v;
      return (v = f.current) == null ? void 0 : v.seekBy(z.mediumSeekTime);
    }), C.id === "video.seekLongBackward" && (R = () => {
      var v;
      return (v = f.current) == null ? void 0 : v.seekBy(-z.longSeekTime);
    }), C.id === "video.seekLongForward" && (R = () => {
      var v;
      return (v = f.current) == null ? void 0 : v.seekBy(z.longSeekTime);
    }), C.id === "video.playSelected" && A && (R = () => {
      var v;
      (v = W.current) == null || v.call(W, A.startSec, !0), requestAnimationFrame(() => {
        var b;
        return (b = u.current) == null ? void 0 : b.focus({ preventScroll: !0 });
      });
    }), (C.id === "video.playPreviousSegment" || C.id === "video.playNextSegment") && (R = () => {
      var b;
      const v = no(
        ae,
        A == null ? void 0 : A.id,
        C.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !v || v.id === (A == null ? void 0 : A.id) || (E(v, { focusEditor: !0, seekToSegment: !1 }), (b = W.current) == null || b.call(W, v.startSec, !0));
    }), C.id.startsWith("video.seekPercent") && (R = () => {
      var b;
      const v = Number(C.id.slice(17)) / 10;
      (b = W.current) == null || b.call(W, il(h ?? le, v), !1);
    }), C.id === "video.jumpToSegmentStart" && A && (R = () => {
      var v;
      return (v = W.current) == null ? void 0 : v.call(W, A.startSec, !1);
    }), C.id === "video.jumpToSegmentEnd" && A && (R = () => {
      var v;
      return (v = W.current) == null ? void 0 : v.call(W, A.endSec ?? A.startSec, !1);
    }), C.id === "video.jumpToVideoStart" && (R = () => {
      var v;
      return (v = W.current) == null ? void 0 : v.call(W, 0, !1);
    }), C.id === "video.jumpToVideoEnd" && (R = () => {
      var v;
      return (v = W.current) == null ? void 0 : v.call(W, le, !1);
    }), C.id.startsWith("video.frame") && (R = () => {
      const v = C.id.includes("Small") ? "small" : C.id.includes("Medium") ? "medium" : "long", b = z[`${v}FrameStep`] * (C.id.endsWith("Backward") ? -1 : 1);
      fe(b);
    }), C.id.startsWith("navigation.swimlane") && (R = () => {
      const v = C.id.slice(19).toLowerCase(), b = no(ae, A == null ? void 0 : A.id, v, s);
      b && E(b, { focusEditor: !0, seekToSegment: !1 });
    }), (C.id === "navigation.extendSwimlaneLeft" || C.id === "navigation.extendSwimlaneRight") && (R = () => {
      const v = wd(
        t,
        A == null ? void 0 : A.id,
        C.id.endsWith("Left") ? "left" : "right"
      );
      v && E(v.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: v.segmentIds
      });
    }), (C.id === "navigation.segmentGroupUp" || C.id === "navigation.segmentGroupDown") && (R = () => {
      const v = Nd(
        F,
        N ?? w,
        C.id.endsWith("Up") ? -1 : 1
      );
      v && V(v);
    }), (C.id === "navigation.previousAtPlayhead" || C.id === "navigation.nextAtPlayhead") && (R = () => {
      const v = qs(Pe, s, C.id === "navigation.previousAtPlayhead" ? -1 : 1, A == null ? void 0 : A.id);
      v && E(v, { focusEditor: !0, seekToSegment: !1 });
    }), C.id === "navigation.nearestInCurrentSwimlane" && (R = () => {
      const v = Ps(
        ae,
        A == null ? void 0 : A.id,
        s
      );
      v && E(v, { focusEditor: !0, seekToSegment: !1 });
    }), C.id.includes("Unreviewed") && (R = () => {
      const v = Sr(
        ae,
        A == null ? void 0 : A.id,
        C.id.startsWith("navigation.previous") ? -1 : 1,
        C.id.endsWith("Global")
      );
      v && E(v, { focusEditor: !ee.preserveFocus, seekToSegment: !1 });
    }), (C.id === "navigation.nextTouchingPlayhead" || C.id === "navigation.previousTouchingPlayhead") && (R = () => {
      const v = Os(ae, s, C.id === "navigation.previousTouchingPlayhead" ? -1 : 1, A == null ? void 0 : A.id);
      v && E(v, { focusEditor: !0, seekToSegment: !1 });
    }), C.id === "navigation.quickSearch" && (R = () => k(!0)), (C.id === "navigation.previousShot" || C.id === "navigation.nextShot") && (R = () => {
      var b;
      const v = Il(de, s, C.id === "navigation.previousShot" ? -1 : 1);
      v && ((b = W.current) == null || b.call(W, v.startSec, !1));
    }), C.id === "shot.split" && (R = () => S("split")), C.id === "shot.merge" && (R = () => S("merge")), C.id === "marker.create" && (R = () => a()), C.id === "marker.duplicate" && (R = () => d(!1)), C.id === "marker.duplicateAtPlayhead" && (R = () => d(!0)), C.id === "marker.split" && (R = () => D()), C.id === "marker.editTag" && (R = () => {
      var v;
      if (M.length > 1 && M.some((b) => b.isDerived)) {
        H("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((v = y.data) != null && v.tagReadOnly) {
        H("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      _(!0);
    }), C.id === "marker.setStart" && A && (R = () => r(s, A.endSec)), C.id === "marker.setEnd" && A && (R = () => r(A.startSec, s)), C.id === "marker.copyTiming" && A && (R = () => {
      H(Zd(A) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), C.id === "marker.pasteTiming" && A && (R = () => {
      const v = Qd();
      if (!v) {
        H("No copied segment timing is available.");
        return;
      }
      r(v.startSec, v.endSec);
    }), C.id === "marker.mergeSelection" && (R = () => p()), C.id === "marker.moveToBin" && (R = () => g()), C.id === "marker.toggleIncorrectExample" && A && (R = () => X()), C.id === "marker.openIncorrectExamples" && (R = () => T(!0)), C.id === "markerGroup.toggleCollapse" && N && (R = () => ce(N)), C.id === "markerGroup.toggleAll" && (R = () => B((v) => kd(v, F))), C.id === "marker.assignSlots" && (R = () => {
      var v;
      return (v = ye.current) == null ? void 0 : v.click();
    }), C.id === "navigation.zoomIn" && (R = () => ne((v) => kr(v + 0.5))), C.id === "navigation.zoomOut" && (R = () => ne((v) => kr(v - 0.5))), C.id === "navigation.resetZoom" && (R = () => ne(1)), C.id === "navigation.centerPlayhead" && (R = () => {
      var v;
      return (v = o.current) == null ? void 0 : v.call(o);
    }), C.id === "layout.growSwimlanes" && (R = () => xe(c.timelineRatio + 0.05)), C.id === "layout.shrinkSwimlanes" && (R = () => xe(c.timelineRatio - 0.05)), C.id === "marker.confirm" && A && (R = () => U("approved")), C.id === "system.publishApproved" && (R = () => $(ee.target)), C.id === "marker.reject" && A && (R = () => U("rejected")), C.id === "system.emptyBin" && (R = () => m()), C.id === "system.deleteRejected" && (R = () => l()), R && R();
  }
  function be(C, ee) {
    const R = Qn.find((v) => v.id === C);
    R && $n(R, i) && Y(R, ee);
  }
  return {
    executeShortcutById: be,
    stepVideoFrame: (C) => fe(C < 0 ? -1 : 1)
  };
}
function Ca(e) {
  return e === !0;
}
function $a() {
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
function Pc(e, t, r = !1, o = 0, i = "", a = () => () => {
}) {
  const [s, l] = G(null), [d, c] = G(""), [u, m] = G({
    busy: !1,
    reviewState: null,
    error: ""
  }), y = ue(null);
  async function h(g) {
    const S = a("import", -1);
    if (!S) {
      m({ busy: !1, reviewState: null, error: "Wait for the current save to finish before importing Cove segments." });
      return;
    }
    m({ busy: !0, reviewState: g, error: "" });
    try {
      await Z(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: to(), reviewState: g })
      }), await t(), m({ busy: !1, reviewState: null, error: "" });
    } catch ($) {
      m({
        busy: !1,
        reviewState: null,
        error: $.message || "Unable to import Cove segments."
      });
    } finally {
      S();
    }
  }
  async function p(g) {
    try {
      const S = await Z(`/videos/${e}/analysis-runs`, {
        signal: g.signal
      });
      if (!g.isActive()) return null;
      const $ = (S == null ? void 0 : S[0]) || null;
      return l($), ($ == null ? void 0 : $.status) === "completed" && y.current !== $.id && (y.current = $.id, await t()), (($ == null ? void 0 : $.status) === "failed" || ($ == null ? void 0 : $.status) === "cancelled") && c($.errorMessage || "Video analysis did not complete."), $;
    } catch (S) {
      return g.isActive() && S.name !== "AbortError" && c(S.message || "Unable to load video analysis status."), null;
    }
  }
  return pe(() => {
    if (!Ca(r)) {
      l(null), c("");
      return;
    }
    const g = $a();
    return p(g), g.dispose;
  }, [e, r]), pe(() => {
    if (!Ca(r) || (s == null ? void 0 : s.status) !== "queued" && (s == null ? void 0 : s.status) !== "running") return;
    const g = $a();
    let S = setTimeout(async function $() {
      await p(g), g.isActive() && (S = setTimeout($, 2500));
    }, 2500);
    return () => {
      clearTimeout(S), g.dispose();
    };
  }, [s == null ? void 0 : s.id, s == null ? void 0 : s.status, r]), {
    analysisError: d,
    analysisRun: s,
    importNativeSegments: h,
    nativeImportState: u
  };
}
const Hn = Object.freeze([]);
function Lc(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function jc({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var jo, Fo, Bo, Go, Ko, zo;
  const u = ue(null), [m, y] = G(null), [h, p] = G([]), g = ue(null), S = ue(null), $ = ue([]), f = ue(null), [z, U] = G(() => Ot({})), [W, F] = G(!1), [E, A] = G(sl), [w, N] = G(0), M = ue(null), [B] = G(() => Pd({
    getContext: () => M.current,
    drainAfterSettle: !1
  })), T = Hl(B.subscribe, B.getSnapshot), k = wi(T), H = (L, ie) => B.acquire({ kind: L, lockId: ie }), V = (L) => B.enqueue(L), _ = (L) => B.stableIdentity(L), ne = ue(!1);
  pe(() => (ne.current = !0, () => {
    ne.current = !1, queueMicrotask(() => {
      ne.current || B.dispose();
    });
  }), []);
  const de = (L) => B.cancel(L), ye = (L, ie) => B.retarget(L, ie), D = B.getSnapshot, [ae, le] = Ul(Ud, []), [X, ce] = G(""), [xe, Ce] = G(""), [Pe, fe] = G(""), [Y, be] = G(1), [C, ee] = G(Wd), [R, v] = G(0), [b, x] = G({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [O, re] = G(Vt), te = ue(Vt), [j, oe] = G(!1), [I, q] = G(!1), [P, Q] = G(!1), he = ue(!1);
  he.current = P;
  const [me, Te] = G(null), [mt, je] = G(!1), [Re, Ze] = G(null), [it, gt] = G(null), et = ue(null), [ft, st] = G(!1), [ze, Je] = G(""), Ye = ue(null), We = ue(null), ut = ue(!1), [yt, J] = G(Vd), [se, ke] = G(null), [Ae, ve] = G(!1), [tt, Ke] = G(!1), [Xe, Ie] = G(!1), [De, He] = G(!1), [Me, Fe] = G(!1), [nt, Se] = G(""), {
    analysisError: Le,
    analysisRun: Oe,
    importNativeSegments: pt,
    nativeImportState: rt
  } = Pc(
    e.video.id,
    o,
    l,
    ((jo = e.shotBoundaries) == null ? void 0 : jo.length) || 0,
    vr(e.shotBoundaries || []),
    (L, ie) => B.acquire({ kind: L, lockId: ie })
  ), [at, Kt] = G(!1), [lt, Ne] = G(null), [we, Qe] = G(l), [Mt, xt] = G(0), [bt, St] = G(!1), [Pt, Et] = G(""), [Rr, Ar] = G(null), dn = ue(null), An = ue(null), Mn = ue(!1), [en, cn] = G([]), [Xn, Mr] = G(!1), [un, er] = G(null), mn = _d(), En = ue(null), tr = ue(null), gn = ue(null), nr = ue(s), rr = ue(null), pn = ue(null), tn = ue(null), Dn = ue(null), On = ue(null), wt = ue(null), zt = ue(null), Pn = ue(null), Ln = ue(null), or = ue(null), jn = ue(null), Fn = ue(null), ar = ue(-1e12), Er = ue(null), fn = ue(null), [Bn, Gn] = G({ scrollTop: 0, height: 512 });
  pe(() => {
    if (!at || bt || !Pt) return;
    const L = requestAnimationFrame(() => {
      var ie;
      return (ie = An.current) == null ? void 0 : ie.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(L);
  }, [at, bt, Pt]), pe(() => {
    if (!Mn.current || at || we) return;
    const L = requestAnimationFrame(() => {
      var ie;
      (ie = dn.current) == null || ie.focus({ preventScroll: !0 }), Mn.current = !1;
    });
    return () => cancelAnimationFrame(L);
  }, [at, we]);
  const $e = e.video, ht = e.segments || Hn, Dr = Ve(() => JSON.stringify({
    segments: ht.map((L) => [
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
  }), [ht, e.performerSlots, e.itemMetadata]);
  pe(() => {
    if (!l) {
      Ne(null), Qe(!1);
      return;
    }
    if (k != null) {
      Qe(!0);
      return;
    }
    let L = !0;
    Qe(!0);
    const ie = setTimeout(() => {
      Z(`/videos/${$e.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Ue) => {
        L && (Ne(Ue), Et(""));
      }).catch((Ue) => {
        L && (Ne(null), Et(Ue.message || "Unable to preview derived segments."));
      }).finally(() => {
        L && Qe(!1);
      });
    }, 150);
    return () => {
      L = !1, clearTimeout(ie);
    };
  }, [l, $e.id, Dr, Mt, k]);
  const Or = () => xt((L) => L + 1), Lt = e.segmentGroups || Hn, vt = e.performerSlots || Hn, Pr = l && e.performerSlotsAvailable !== !1, yn = Ve(
    () => (e.performerCandidates || []).filter((L) => L.isVideoPerformer),
    [e.performerCandidates]
  ), bn = e.shotBoundaries || Hn, nn = Ve(
    () => yi(vt),
    [vt]
  ), Kn = Ve(
    () => ht.map((L) => {
      const ie = nn.get(L.id) || [];
      return {
        ...L,
        slots: ie,
        assignment: ie.every((Ue) => Ue.performerId == null) ? Fl(ie, yn) : null
      };
    }).filter((L) => L.slots.length > 0 && L.assignment != null),
    [ht, nn, yn]
  ), Lr = Number((Fo = $e.videoFile) == null ? void 0 : Fo.frameRate) > 0 ? Number($e.videoFile.frameRate) : 30;
  function hn() {
    const L = he.current;
    Q(!1), L && requestAnimationFrame(() => {
      var ie;
      return (ie = wt.current) == null ? void 0 : ie.focus({ preventScroll: !0 });
    });
  }
  function Ut() {
    k == null && (Fn.current = null, je(!1), ce(""), requestAnimationFrame(() => {
      var L;
      return (L = wt.current) == null ? void 0 : L.focus({ preventScroll: !0 });
    }));
  }
  function rn() {
    F(!1), requestAnimationFrame(() => {
      var L, ie;
      (L = Pn.current) != null && L.isConnected ? Pn.current.focus({ preventScroll: !0 }) : (ie = wt.current) == null || ie.focus({ preventScroll: !0 });
    });
  }
  pe(() => {
    jn.current === m ? (jn.current = null, Q(!0)) : Q(!1);
  }, [m]), pe(() => {
    var ie;
    if (!P) return;
    const L = (ie = or.current) == null ? void 0 : ie.querySelector("input");
    document.activeElement !== L && (L == null || L.focus({ preventScroll: !0 }), L == null || L.select());
  }, [P, m]), pe(() => {
    var ie;
    if (P) return;
    const L = (ie = wt.current) == null ? void 0 : ie.ownerDocument;
    L && L.activeElement === L.body && wt.current.focus({ preventScroll: !0 });
  }, [P]), pe(() => {
    var Ue, dt, jt;
    const L = an(
      Ur(
        e.segments,
        e.performerSlots || [],
        Ot({}),
        l && E,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), ie = ((Ue = e.segments.find((wn) => wn.id === s)) == null ? void 0 : Ue.id) ?? ((dt = qa(L)) == null ? void 0 : dt.id) ?? null;
    y(ie), p(ie == null ? [] : [ie]), S.current = ie, $.current = [], ke(Ft(L, ie)), U(Ot({})), F(!1), Fn.current = null, je(!1), be(1), ce(""), re(Vt), te.current = Vt, oe(!1), (jt = wt.current) == null || jt.focus({ preventScroll: !0 });
  }, [$e.id, s]), pe(() => {
    const L = new AbortController();
    return Z(`/videos/${$e.id}/incorrect-examples`, { signal: L.signal }).then(cn).catch((ie) => {
      ie.name !== "AbortError" && cn([]);
    }), () => L.abort();
  }, [$e.id, d == null ? void 0 : d.effectiveMode]), pe(() => {
    const L = new AbortController();
    return Z(`/videos/${$e.id}/history`, { signal: L.signal }).then((ie) => {
      const Ue = ie || Vt;
      te.current = Ue, re(Ue);
    }).catch((ie) => {
      ie.name !== "AbortError" && ce(ie.message || "Unable to load editor history.");
    }), () => L.abort();
  }, [$e.id]), pe(() => {
    Yd(C);
  }, [C.timelineRatio, C.markerRailOpen, C.detailWidth, C.markerRailWidth, C.swimlaneTitleWidth]), pe(() => {
    Jd(yt);
  }, [yt]), pe(() => {
    ll(E);
  }, [E]), pe(() => {
    const L = pn.current;
    if (!a || !L || typeof ResizeObserver > "u") return;
    const ie = () => {
      var jt;
      const dt = Math.max(0, L.clientHeight - (((jt = tn.current) == null ? void 0 : jt.offsetHeight) || 0));
      v(dt), ee((wn) => {
        const Uo = lo(wn.timelineRatio, dt);
        return Uo === wn.timelineRatio ? wn : { ...wn, timelineRatio: Uo };
      });
    }, Ue = new ResizeObserver(ie);
    return Ue.observe(L), tn.current && Ue.observe(tn.current), ie(), () => Ue.disconnect();
  }, [a]), pe(() => {
    if (!mn || typeof ResizeObserver > "u") return;
    const L = On.current, ie = Dn.current;
    if (!L || !ie) return;
    const Ue = () => x({
      workspace: L.clientWidth,
      focusRow: ie.clientWidth,
      focusRowHeight: ie.clientHeight
    }), dt = new ResizeObserver(Ue);
    return dt.observe(L), dt.observe(ie), Ue(), () => dt.disconnect();
  }, [mn, C.markerRailOpen]);
  const Ht = Ve(
    () => Kd(ht, ae),
    [ht, ae]
  );
  ua(() => {
    Ti(ae, e) !== ae && le({ type: "prune", detail: e });
  }, [e, ae]);
  const Wt = Ve(
    () => ba(
      Ur(
        Ht,
        vt,
        z,
        l && E,
        Lt
      ),
      en,
      !0
    ),
    [
      Ht,
      vt,
      z,
      E,
      Lt,
      l,
      en
    ]
  ), jr = Object.fromEntries(It.map((L) => [L, Wt.filter((ie) => ie.reviewState === L).length])), Fr = ba(
    Ur(
      Ht,
      vt,
      { ...z, reviewStates: It },
      l && E,
      Lt
    ),
    en,
    !0
  ), Br = Object.fromEntries(It.map((L) => [L, Fr.filter((ie) => ie.reviewState === L).length])), vn = [...new Set(Ht.map((L) => L.sourceKey).filter(Boolean))].sort((L, ie) => Gt(L).localeCompare(Gt(ie))), xn = Qs(
    z,
    l && E
  ), K = Ve(
    () => an(Wt, Lt, vt),
    [Wt, Lt, vt]
  ), Be = Ve(
    () => Sd(K, yt),
    [K, yt]
  ), Ge = el(
    K,
    m,
    s,
    {
      visibleLanes: Be,
      reference: ((Bo = u.current) == null ? void 0 : Bo.videoId) === $e.id ? u.current.reference : null
    }
  );
  pe(() => {
    const L = br(K, Ge == null ? void 0 : Ge.id);
    L && (u.current = { videoId: $e.id, reference: L });
  }, [$e.id, Ge == null ? void 0 : Ge.id, K]);
  const $t = Ve(() => {
    const L = Bd(ae);
    return L.length === 0 ? ht : [...ht, ...L];
  }, [ht, ae]), ge = Ge == null ? null : $t.find((L) => L.id === Ge.id) || Ge, kt = Xo($t, Xo(Wt, h).map((L) => L.id)), ir = !l && kt.length > 0 && kt.every((L) => L.nativeSegmentId != null), xo = Wt.map((L) => L.id), Pi = xo.join("|");
  g.current = (ge == null ? void 0 : ge.id) ?? null;
  const So = nn.get(ge == null ? void 0 : ge.id) || [], Li = fo(So), ko = Ve(
    () => vd(K, h),
    [K, h]
  ), sr = Ve(() => yo(K), [K]), zn = Ve(
    () => bd(sr, yt),
    [sr, yt]
  ), ji = Ve(
    () => hi(
      zn.rows,
      Bn.scrollTop,
      Bn.height
    ),
    [zn, Bn]
  ), Fi = Sr(Be, ge == null ? void 0 : ge.id, -1, !0) != null, Bi = Sr(Be, ge == null ? void 0 : ge.id, 1, !0) != null, Sn = ge ? Ft(K, ge.id) : null, Gr = bi(sr) ? sr.map((L) => L.key) : [], Gi = Gr.join("|"), lr = Math.max(
    0,
    Number((Go = $e.videoFile) == null ? void 0 : Go.duration) || 0,
    ...Ht.map((L) => Number(L.endSec ?? L.startSec) || 0)
  ), wo = Number((Ko = $e.videoFile) == null ? void 0 : Ko.duration) > 0 ? Number($e.videoFile.duration) : null;
  O.actions;
  const Ki = ti();
  pe(() => {
    const L = m === Cn ? m : (ge == null ? void 0 : ge.id) ?? null;
    L !== m && y(L);
  }, [ge, m]), pe(() => {
    p((L) => {
      const ie = ol(
        L,
        xo,
        (ge == null ? void 0 : ge.id) ?? null
      );
      return ie.length === L.length && ie.every((Ue, dt) => Ue === L[dt]) ? L : ie;
    });
  }, [Pi, ge == null ? void 0 : ge.id]);
  const kn = (ge == null ? void 0 : ge.itemId) == null ? null : ((zo = e.itemMetadata) == null ? void 0 : zo[ge.itemId]) || null, zi = {
    key: (ge == null ? void 0 : ge.itemId) != null ? `item:${ge.itemId}` : (ge == null ? void 0 : ge.nativeSegmentId) != null ? `native:${ge.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (kn == null ? void 0 : kn.provenance) || (ge == null ? void 0 : ge.fieldProvenance) || [] : []
  }, Kr = (ge == null ? void 0 : ge.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (kn == null ? void 0 : kn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  pe(() => {
    Ce(Ge == null ? "" : String(Ge.startSec)), fe((Ge == null ? void 0 : Ge.endSec) == null ? "" : String(Ge.endSec));
  }, [Ge == null ? void 0 : Ge.id, Ge == null ? void 0 : Ge.startSec, Ge == null ? void 0 : Ge.endSec]), pe(() => {
    Sn && J((L) => Si(L, Sn));
  }, [$e.id, s, Sn]), pe(() => {
    ke((L) => Id(Gr, L, Sn));
  }, [$e.id, Gi, Sn]), pe(() => {
    if (!C.markerRailOpen || (ge == null ? void 0 : ge.id) == null) return;
    const L = fn.current, ie = zn.rows.find((jt) => jt.kind === "segment" && jt.segment.id === ge.id);
    if (!L || !ie) return;
    const Ue = ie.top + ie.height;
    let dt = L.scrollTop;
    ie.top < L.scrollTop ? dt = ie.top : Ue > L.scrollTop + L.clientHeight && (dt = Math.max(0, Ue - L.clientHeight)), dt !== L.scrollTop && (L.scrollTop = dt), Gn({ scrollTop: dt, height: L.clientHeight });
  }, [ge == null ? void 0 : ge.id, zn, C.markerRailOpen]), pe(() => {
    const L = fn.current;
    if (!C.markerRailOpen || !L) return;
    const ie = () => Gn({
      scrollTop: L.scrollTop,
      height: L.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      ie();
      return;
    }
    const Ue = new ResizeObserver(ie);
    return Ue.observe(L), ie(), () => Ue.disconnect();
  }, [C.markerRailOpen]);
  const { revealSegmentGroupForSelection: No, replaceSegmentSelection: Ui, selectSegment: Io, selectSegmentCollection: Hi, selectAllVideoSegments: _i } = Ac({
    allSwimlanes: K,
    editorRef: wt,
    performerSlots: vt,
    seekRef: En,
    segmentGroups: Lt,
    segments: ht,
    selectedSegmentId: m,
    selectedSegmentIds: h,
    selectionAnchorIdRef: S,
    selectionRangeBaseIdsRef: $,
    setCollapsedSegmentGroups: J,
    setEditorFilters: U,
    setHideDerivedSegments: A,
    setSaveMessage: ce,
    setSelectedSegmentGroupKey: ke,
    setSelectedSegmentId: y,
    setSelectedSegmentIds: p
  }), { acceptHistory: zr, recordHistoryAction: dr, mutateSegment: qi, runSegmentMutation: Wi, completeReview: Vi, createSegment: Co, splitSegment: $o, duplicateSegment: To, saveTiming: Ji, applyShortcutTiming: Yi } = Hd({
    compatibilityMode: l,
    currentTime: w,
    detail: e,
    editorFilters: z,
    endInput: Pe,
    hideDerivedSegments: E,
    historyRef: te,
    mediaDuration: wo,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: ar,
    pendingDuplicateRef: Er,
    pendingFirstSegmentStartSecRef: Fn,
    pendingTagEditSegmentIdRef: jn,
    performerSlots: vt,
    enqueueSave: V,
    pendingChanges: ae,
    retargetSaveTasks: ye,
    replaceSegmentSelection: Ui,
    savingSegmentId: k,
    segments: ht,
    selectedSegment: ge,
    selectedSegmentIdRef: g,
    selectedSegments: kt,
    selectionAnchorIdRef: S,
    selectionRangeBaseIdsRef: $,
    setCreatingSegmentId: Te,
    setEditorFilters: U,
    setFirstSegmentTagOpen: je,
    setHideDerivedSegments: A,
    setHistory: re,
    setHistoryOpen: oe,
    setPublishApprovedError: Je,
    setSaveMessage: ce,
    acquireSaveLock: H,
    dispatchPendingChanges: le,
    setSelectedSegmentGroupKey: ke,
    setSelectedSegmentId: y,
    setSelectedSegmentIds: p,
    setTagEditing: Q,
    startInput: xe,
    tagEditingRef: he,
    timelineDuration: lr,
    video: $e
  });
  function Ro(L = null) {
    var dt;
    if (!l || k != null || !ht.some((jt) => !jt.published && jt.reviewState === "approved")) return;
    const ie = ((dt = wt.current) == null ? void 0 : dt.ownerDocument) ?? document, Ue = ie.activeElement === ie.body ? null : ie.activeElement;
    We.current = L != null && L.isConnected && L !== ie.body ? L : Ue, Je(""), st(!0);
  }
  function Ao() {
    k == null && (st(!1), Je(""), requestAnimationFrame(() => {
      Lc(
        We.current,
        wt.current
      ), We.current = null;
    }));
  }
  async function Qi() {
    await Vi() && Ao();
  }
  const { closeMergeConfirmation: Zi, mergeSelectedSwimlane: Mo, saveSelectedReviewState: Xi } = Mc({
    acceptHistory: zr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: f,
    getSaveQueueSnapshot: D,
    historyRef: te,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: dr,
    revealSegmentGroupForSelection: No,
    savingSegmentId: k,
    selectedGroups: ko,
    selectedSegment: ge,
    selectedSegmentIdRef: g,
    selectedSegments: kt,
    selectionAnchorIdRef: S,
    selectionRangeBaseIdsRef: $,
    setMergeConfirmation: Ze,
    setSaveMessage: ce,
    acquireSaveLock: H,
    dispatchPendingChanges: le,
    enqueueSave: V,
    stableSaveIdentity: _,
    setSelectedSegmentId: y,
    setSelectedSegmentIds: p,
    video: $e
  }), es = (L) => {
    const ie = (L || []).map(Tt);
    B.cancel((Ue) => Ue.kind === "review" && bo(Ue.targets, ie));
  }, ts = B.settledCount();
  ua(() => {
    B.markCommitted(ts), M.current = {
      detail: e,
      segments: ht,
      onConflict: r,
      onDetailChange: t,
      onReload: o,
      tagEditing: P,
      selectedSegmentIds: h,
      activeSegmentId: (ge == null ? void 0 : ge.id) ?? null
    };
  }), pe(() => {
    B.poke();
  });
  const { toggleIncorrectExample: ns, removeIncorrectExample: rs, captureTrainingExport: os, deleteRejectedSegments: Eo, autoAssignPerformers: as, previewDerivedSegments: is, closeMaterializeDialog: ss, materializeDerivedSegments: ls, saveTag: ds, moveToBin: cs, emptyRecyclingBin: us } = Ec({
    acceptHistory: zr,
    allSwimlanes: K,
    autoAssignCandidates: Kn,
    autoAssigning: Me,
    binEmptyingRef: ut,
    canMoveSelectionToBin: ir,
    closeTagEditing: hn,
    compatibilityMode: l,
    creatingSegmentId: me,
    detail: e,
    editorFilters: z,
    editorRef: wt,
    exportingExamples: Xn,
    hideDerivedSegments: E,
    incorrectExamples: en,
    lineage: Kr,
    materializeButtonRef: dn,
    materializePreview: lt,
    materializeRestoreFocusRef: Mn,
    materializing: bt,
    mutateSegment: qi,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: vt,
    cancelSaveTasks: de,
    dispatchPendingChanges: le,
    enqueueSave: V,
    stableSaveIdentity: _,
    pendingChanges: ae,
    runSegmentMutation: Wi,
    recordHistoryAction: dr,
    refreshMaterializationPreview: Or,
    removingExampleId: un,
    revealSegmentGroupForSelection: No,
    savingSegmentId: k,
    segmentGroups: Lt,
    segments: ht,
    selectedSegment: ge,
    selectedSegmentIdRef: g,
    selectedSegments: kt,
    selectionAnchorIdRef: S,
    selectionRangeBaseIdsRef: $,
    setAutoAssignError: Se,
    setAutoAssignOpen: He,
    setAutoAssigning: Fe,
    setEditorFilters: U,
    setExportingExamples: Mr,
    setHideDerivedSegments: A,
    setIncorrectExamples: cn,
    setMaterializeError: Et,
    setMaterializeLoading: Qe,
    setMaterializeOpen: Kt,
    setMaterializePreview: Ne,
    setMaterializing: St,
    setRemovingExampleId: er,
    setRejectedDeletionPreview: gt,
    setSaveMessage: ce,
    acquireSaveLock: H,
    setSelectedSegmentGroupKey: ke,
    setSelectedSegmentId: y,
    setSelectedSegmentIds: p,
    swimlanes: Be,
    video: $e
  }), { restoreHistoryTarget: ms, updateTimelineRatio: Do, handleSeparatorPointerDown: gs, handleSeparatorPointerMove: ps, handleSeparatorKeyDown: fs, panelWidthMaximum: Oo, panelSeparatorProps: ys, toggleSegmentRail: bs, toggleSegmentGroup: Po, mutateShotBoundary: hs } = Dc({
    acceptHistory: zr,
    compatibilityMode: l,
    currentTime: w,
    detail: e,
    editorLayout: C,
    focusRowRef: Dn,
    history: O,
    historyRef: te,
    historySaving: I,
    horizontalLayoutSize: b,
    mediaStackHeight: R,
    mediaStackRef: pn,
    commonActionsRef: tn,
    onDetailChange: t,
    onReload: o,
    railToggleRef: zt,
    recordHistoryAction: dr,
    savingSegmentId: k,
    setCollapsedSegmentGroups: J,
    setEditorLayout: ee,
    setHistorySaving: q,
    setIncorrectExamples: cn,
    setSaveMessage: ce,
    acquireSaveLock: H,
    enqueueSave: V,
    getSaveQueueSnapshot: D,
    shotBoundaries: bn,
    timelineDuration: lr,
    video: $e,
    workspaceRef: On
  }), { executeShortcutById: Lo, stepVideoFrame: vs } = Oc({
    allSwimlanes: K,
    applyShortcutTiming: Yi,
    centerTimelineRef: rr,
    compatibilityMode: l,
    createSegment: Co,
    currentTime: w,
    deleteRejectedSegments: Eo,
    duplicateSegment: To,
    editorLayout: C,
    editorRef: wt,
    emptyRecyclingBin: us,
    lineage: Kr,
    mediaDuration: wo,
    mergeSelectedSwimlane: Mo,
    moveToBin: cs,
    mutateShotBoundary: hs,
    openPublishApprovedDialog: Ro,
    playbackControlsRef: tr,
    playbackShortcutConfig: Ki,
    saveSelectedReviewState: Xi,
    seekRef: En,
    segmentGroupKeys: Gr,
    selectSegment: Io,
    selectedSegment: ge,
    selectedSegmentGroupForSegment: Sn,
    selectedSegmentGroupKey: se,
    selectedSegments: kt,
    setCollapsedSegmentGroups: J,
    setIncorrectExamplesOpen: Ie,
    setQuickSearchOpen: Ke,
    setSaveMessage: ce,
    setSelectedSegmentGroupKey: ke,
    setTagEditing: Q,
    setTimelineZoom: be,
    shotBoundaries: bn,
    slotButtonRef: Ln,
    splitSegment: $o,
    swimlanes: Be,
    timelineDuration: lr,
    toggleIncorrectExample: ns,
    toggleSegmentGroup: Po,
    updateTimelineRatio: Do,
    videoFrameRate: Lr,
    visibleSegments: Wt
  });
  gn.current = Lo;
  const xs = Ve(() => Qn.map((L) => ({
    id: L.id,
    enabled: $n(L, l),
    surface: "local",
    action: (ie) => {
      var Ue;
      return (Ue = gn.current) == null ? void 0 : Ue.call(gn, L.id, ie);
    }
  })), [l]);
  Pa(ao, xs);
  const Ss = so(R), ks = on(C.markerRailWidth, Oo("markerRailWidth")), ws = on(C.detailWidth, Oo("detailWidth"));
  return n(Rc, {
    activeFilterCount: xn,
    allSwimlanes: K,
    analysisError: Le,
    analysisRun: Oe,
    approvalFacetCounts: Br,
    autoAssignCandidates: Kn,
    autoAssignError: nt,
    autoAssignOpen: De,
    autoAssignPerformers: as,
    autoAssigning: Me,
    canMoveSelectionToBin: ir,
    captureTrainingExport: os,
    cancelQueuedReviewsForSegments: es,
    removeIncorrectExample: rs,
    rejectedDeletionPreview: it,
    centerTimelineRef: rr,
    closeEditorFilters: rn,
    closeFirstSegmentTagDialog: Ut,
    closeMaterializeDialog: ss,
    closeMergeConfirmation: Zi,
    closePublishApprovedDialog: Ao,
    closeTagEditing: hn,
    collapsedSegmentGroups: yt,
    commonActionsRef: tn,
    compatibilityMode: l,
    configuringTag: Rr,
    createSegment: Co,
    currentTime: w,
    deleteRejectedSegments: Eo,
    detail: e,
    detailPanelRef: f,
    detailWidth: ws,
    duplicateSegment: To,
    editorFilters: z,
    editorLayout: C,
    editorRef: wt,
    exportingExamples: Xn,
    filtersButtonRef: Pn,
    filtersOpen: W,
    firstSegmentTagOpen: mt,
    focusRowRef: Dn,
    handleSeparatorKeyDown: fs,
    handleSeparatorPointerDown: gs,
    handleSeparatorPointerMove: ps,
    hideDerivedSegments: E,
    history: O,
    historyOpen: j,
    historySaving: I,
    hasNextUnreviewed: Bi,
    hasPreviousUnreviewed: Fi,
    horizontalLayoutSize: b,
    importNativeSegments: pt,
    incorrectExamples: en,
    incorrectExamplesOpen: Xe,
    removingExampleId: un,
    lineage: Kr,
    markerRailWidth: ks,
    materializeButtonRef: dn,
    materializeCancelButtonRef: An,
    materializeDerivedSegments: ls,
    materializeError: Pt,
    materializeLoading: we,
    materializeOpen: at,
    materializePreview: lt,
    materializing: bt,
    mediaStackRef: pn,
    mergeCancelButtonRef: et,
    mergeConfirmation: Re,
    mergeSaving: Od(T, "merge"),
    mergeSelectedSwimlane: Mo,
    nativeImportState: rt,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: Ro,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: ys,
    pendingInitialSeekRef: nr,
    performerSlots: vt,
    performerSlotsAvailable: Pr,
    playbackControlsRef: tr,
    previewDerivedSegments: is,
    provenance: zi,
    provenanceSources: vn,
    publishApprovedCancelButtonRef: Ye,
    publishApprovedDrafts: Qi,
    publishApprovedError: ze,
    publishApprovedOpen: ft,
    quickSearchOpen: tt,
    railScrollRef: fn,
    railToggleRef: zt,
    recordHistoryAction: dr,
    restoreHistoryTarget: ms,
    runEditorAction: Lo,
    stepVideoFrame: vs,
    saveMessage: X,
    setSaveMessage: ce,
    saveTag: ds,
    saveTiming: Ji,
    savingSegmentId: k,
    acquireSaveLock: H,
    seekRef: En,
    segmentGroups: Lt,
    segmentRailLayout: zn,
    segments: Ht,
    selectAllVideoSegments: _i,
    selectSegment: Io,
    selectSegmentCollection: Hi,
    selectedGroups: ko,
    selectedPerformerSlots: So,
    selectedSegment: Ge,
    selectedSegmentGroupKey: se,
    selectedSegmentIds: h,
    selectedSegments: kt,
    selectedSlotStatus: Li,
    setAutoAssignError: Se,
    setAutoAssignOpen: He,
    setConfiguringTag: Ar,
    setCurrentTime: N,
    setEditorFilters: U,
    setEditorLayout: ee,
    setFiltersOpen: F,
    setHideDerivedSegments: A,
    setHistoryOpen: oe,
    setIncorrectExamplesOpen: Ie,
    setQuickSearchOpen: Ke,
    setRejectedDeletionPreview: gt,
    setRailViewport: Gn,
    setSelectedSegmentGroupKey: ke,
    setSelectedSegmentId: y,
    setShortcutsOpen: ve,
    setTimelineZoom: be,
    shotBoundaries: bn,
    shortcutsOpen: Ae,
    slotButtonRef: Ln,
    splitLayout: a,
    splitSegment: $o,
    tagEditing: P,
    creatingSegmentId: me,
    tagSearchRef: or,
    timelineDuration: lr,
    timelineRatioBounds: Ss,
    timelineZoom: Y,
    toggleSegmentGroup: Po,
    toggleSegmentRail: bs,
    updateTimelineRatio: Do,
    video: $e,
    videoPerformers: yn,
    visibleCounts: jr,
    visibleSegmentRailRows: ji,
    visibleSegments: Wt,
    wideLayout: mn,
    workspaceRef: On
  });
}
function Fc(e = [], t = []) {
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
function Nt(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function Gc(e = [], t = []) {
  var h;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((p, g) => (p.sortOrder ?? 0) - (g.sortOrder ?? 0) || Number(p.id) - Number(g.id)).forEach((p, g) => {
    [...p.tags || []].sort((S, $) => (S.sortOrder ?? 0) - ($.sortOrder ?? 0) || Number(S.tagId) - Number($.tagId)).forEach((S, $) => r.set(Number(S.tagId), {
      key: `group:${p.id}`,
      id: p.id,
      name: p.name,
      sortOrder: p.sortOrder ?? g,
      tagSortOrder: S.sortOrder ?? $
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(p, g) {
    const S = Number(p);
    if (!o.has(S)) {
      const $ = r.get(S);
      o.set(S, {
        tagId: S,
        name: g || `Tag ${S}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: ($ == null ? void 0 : $.key) || "ungrouped",
        segmentGroupId: ($ == null ? void 0 : $.id) ?? null,
        segmentGroupName: ($ == null ? void 0 : $.name) || "Ungrouped",
        segmentGroupSortOrder: ($ == null ? void 0 : $.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: ($ == null ? void 0 : $.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(S);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((p) => {
    const g = i(p.sourceTagId, p.sourceTagName), S = i(p.derivedTagId, p.derivedTagName);
    g.outgoingRuleCount++, S.incomingRuleCount++;
    const $ = `${g.tagId}:${S.tagId}`;
    a.has($) || a.set($, {
      id: $,
      sourceTagId: g.tagId,
      derivedTagId: S.tagId,
      rules: [],
      edgeCount: 0
    });
    const f = a.get($);
    f.rules.push(p), f.edgeCount += Number(p.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((p) => [p.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((p) => {
    var g, S;
    (g = d.get(p.sourceTagId)) == null || g.add(p.derivedTagId), (S = d.get(p.derivedTagId)) == null || S.add(p.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), u = [];
  for (const p of s) {
    if (c.has(p.tagId)) continue;
    const g = [p.tagId], S = [];
    for (c.add(p.tagId); g.length > 0; ) {
      const E = g.shift();
      S.push(E);
      for (const A of d.get(E) || [])
        c.has(A) || (c.add(A), g.push(A));
    }
    const $ = new Set(S), f = S.map((E) => o.get(E)), z = l.filter((E) => $.has(E.sourceTagId) && $.has(E.derivedTagId)), U = z.flatMap((E) => E.rules), W = f.filter((E) => E.outgoingRuleCount === 0).sort((E, A) => Nt(E.name, A.name)), F = W.length > 0 ? W : [...f].sort((E, A) => Nt(E.name, A.name));
    u.push({
      id: [...S].sort((E, A) => E - A).join(":"),
      label: F.length > 1 ? `${F[0].name} + ${F.length - 1}` : ((h = F[0]) == null ? void 0 : h.name) || "Derivation component",
      nodes: f,
      connections: z,
      rules: U,
      segmentGroupKeys: [...new Set(f.map((E) => E.segmentGroupKey))],
      materializedEdgeCount: U.reduce(
        (E, A) => E + (Number(A.edgeCount) || 0),
        0
      )
    });
  }
  u.sort((p, g) => g.rules.length - p.rules.length || Nt(p.label, g.label));
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
  }), u.forEach((p) => {
    p.nodes.forEach((g) => {
      var S;
      return (S = m.get(g.segmentGroupKey)) == null ? void 0 : S.componentIds.add(p.id);
    }), p.rules.forEach((g) => {
      var S, $;
      (S = m.get(o.get(Number(g.sourceTagId)).segmentGroupKey)) == null || S.ruleIds.add(g.id), ($ = m.get(o.get(Number(g.derivedTagId)).segmentGroupKey)) == null || $.ruleIds.add(g.id);
    });
  });
  const y = [...m.values()].sort((p, g) => p.sortOrder - g.sortOrder || Nt(p.name, g.name)).map((p) => ({
    ...p,
    ruleCount: p.ruleIds.size,
    componentCount: p.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: u,
    segmentGroups: y
  };
}
function Kc(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const u = new Map(e.nodes.map((w) => [w.tagId, /* @__PURE__ */ new Set()])), m = new Map(e.nodes.map((w) => [w.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((w) => {
    var N, M;
    (N = u.get(w.sourceTagId)) == null || N.add(w.derivedTagId), (M = m.get(w.derivedTagId)) == null || M.add(w.sourceTagId);
  });
  const y = new Map(e.nodes.map((w) => {
    var N;
    return [
      w.tagId,
      ((N = m.get(w.tagId)) == null ? void 0 : N.size) || 0
    ];
  })), h = new Map(e.nodes.map((w) => [w.tagId, 0])), p = e.nodes.filter((w) => y.get(w.tagId) === 0).sort((w, N) => Nt(w.name, N.name)).map((w) => w.tagId), g = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const w = p.shift();
    if (!g.has(w)) {
      g.add(w);
      for (const N of u.get(w) || [])
        h.set(N, Math.max(h.get(N) || 0, (h.get(w) || 0) + 1)), y.set(N, y.get(N) - 1), y.get(N) === 0 && p.push(N);
    }
  }
  g.size !== e.nodes.length && e.nodes.filter((w) => !g.has(w.tagId)).sort((w, N) => Nt(w.name, N.name)).forEach((w) => h.set(w.tagId, 0));
  const S = Math.max(0, ...h.values()), $ = Math.max(
    t,
    240 + S * 296
  ), f = /* @__PURE__ */ new Map();
  e.nodes.forEach((w) => {
    f.has(w.segmentGroupKey) || f.set(w.segmentGroupKey, {
      key: w.segmentGroupKey,
      id: w.segmentGroupId,
      name: w.segmentGroupName,
      sortOrder: w.segmentGroupSortOrder,
      nodes: []
    }), f.get(w.segmentGroupKey).nodes.push(w);
  });
  const z = [...f.values()].sort((w, N) => w.sortOrder - N.sortOrder || Nt(w.name, N.name));
  let U = 28;
  const W = [], F = z.map((w) => {
    const N = /* @__PURE__ */ new Map();
    w.nodes.forEach((H) => {
      const V = h.get(H.tagId) || 0;
      N.has(V) || N.set(V, []), N.get(V).push(H);
    });
    for (const H of N.values())
      H.sort((V, _) => V.segmentGroupTagSortOrder - _.segmentGroupTagSortOrder || Nt(V.name, _.name));
    const M = Math.max(1, ...[...N.values()].map((H) => H.length)), B = M * 58 + (M - 1) * 18, T = 70 + B, k = {
      ...w,
      x: 12,
      y: U,
      width: $ - 24,
      height: T
    };
    for (const [H, V] of N.entries()) {
      const _ = V.length * 58 + Math.max(0, V.length - 1) * 18, ne = (B - _) / 2;
      V.forEach((de, ye) => W.push({
        ...de,
        rank: H,
        x: 28 + H * 296,
        y: U + 34 + 18 + ne + ye * 76,
        width: 184,
        height: 58
      }));
    }
    return U += T + 16, k;
  }), E = new Map(W.map((w) => [w.tagId, w])), A = e.connections.map((w) => {
    const N = E.get(w.sourceTagId), M = E.get(w.derivedTagId), B = N.x + N.width, T = N.y + N.height / 2, k = M.x, H = M.y + M.height / 2, V = Math.max(48, (k - B) * 0.48);
    return {
      ...w,
      path: `M ${B} ${T} C ${B + V} ${T}, ${k - V} ${H}, ${k} ${H}`
    };
  });
  return {
    width: $,
    height: Math.max(r, U - 16 + 28),
    nodes: W,
    connections: A,
    groups: F
  };
}
function zc(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Kc(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), u = 20, m = o, y = c.nodes.map((p) => ({
      ...p,
      x: p.x + u,
      y: p.y + m
    })), h = new Map(y.map((p) => [p.tagId, p]));
    a.push(...y), l.push(...c.groups.map((p) => ({
      ...p,
      componentId: d.id,
      x: p.x + u,
      y: p.y + m
    }))), s.push(...c.connections.map((p) => {
      const g = h.get(p.sourceTagId), S = h.get(p.derivedTagId), $ = g.x + g.width, f = g.y + g.height / 2, z = S.x, U = S.y + S.height / 2, W = Math.max(48, (z - $) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${$} ${f} C ${$ + W} ${f}, ${z - W} ${U}, ${z} ${U}`
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
function Ta(e, t = []) {
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
function Hc(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: u, editorRef: m, emptyDraft: y, graph: h, layout: p, listSort: g, materializationOffer: S, materializeOutgoingRules: $, materializeRule: f, message: z, normalizedQuery: U, query: W, refreshConfiguredTag: F, revealEditor: E, rules: A, save: w, segmentGroupKey: N, selectedNode: M, selectedRule: B, selection: T, setConfiguringTag: k, setDraft: H, setListSort: V, setMaterializationOffer: _, setQuery: ne, setSegmentGroupKey: de, setSelection: ye, setView: D, sortedVisibleRules: ae, sourceSlots: le, sourceSlotsLoading: X, updateMapping: ce, updateTag: xe, view: Ce, visibleComponents: Pe, visibleRules: fe } = e;
  function Y(v) {
    const b = h.nodes.find((O) => O.tagId === Number(v.sourceTagId)), x = h.nodes.find((O) => O.tagId === Number(v.derivedTagId));
    return (b == null ? void 0 : b.segmentGroupKey) === (x == null ? void 0 : x.segmentGroupKey) ? b.segmentGroupKey : "cross-group";
  }
  function be() {
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
          onClick: () => H(null),
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
              onChange: (v, b) => xe("source", v, b == null ? void 0 : b.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !X && le.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (v) => k({
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
              onChange: (v, b) => xe("derived", v, b == null ? void 0 : b.label),
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
              onClick: (v) => k({
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
            disabled: r || le.length === 0 || s.length === 0,
            onClick: () => H((v) => ({
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
              onChange: (x) => ce(b, "sourceSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${b + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...le.map((x) => n("option", { key: x.id, value: x.id }, Ct(x)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: v.derivedSlotDefinitionId,
              disabled: r,
              onChange: (x) => ce(b, "derivedSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${b + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((x) => n("option", { key: x.id, value: x.id }, Ct(x)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => H((x) => ({
                ...x,
                slotMappings: x.slotMappings.filter((O, re) => re !== b)
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
          onClick: w,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => H(null), className: o }, "Cancel")
      ])
    ]);
  }
  function C() {
    if (M) {
      const x = fe.filter((te) => Number(te.derivedTagId) === M.tagId), O = fe.filter((te) => Number(te.sourceTagId) === M.tagId), re = (te, j, oe) => n("div", {
        key: te.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, j),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${te.sourceTagName} → ${te.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          oe ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => f(te),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => u(te, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(te),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, M.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, M.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${M.incomingRuleCount} incoming · ${M.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (te) => k({
            tagId: M.tagId,
            tagName: M.name,
            trigger: te.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        O.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => $(M, O),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${O.length})`) : null,
        O.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...O.map((te) => re(te, "Derives", !0))
        ]) : null,
        x.length ? n("details", {
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
              x.length
            )
          ]),
          n(
            "div",
            { key: "rules", className: "space-y-2 border-t border-border p-2" },
            x.map((te) => re(te, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!B)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const v = h.nodes.find((x) => x.tagId === Number(B.sourceTagId)), b = h.nodes.find((x) => x.tagId === Number(B.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (v == null ? void 0 : v.segmentGroupName) || "Ungrouped"),
          (v == null ? void 0 : v.segmentGroupKey) !== (b == null ? void 0 : b.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(b == null ? void 0 : b.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${B.sourceTagName} → ${B.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${B.edgeCount} materialized lineage edge${B.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (S == null ? void 0 : S.ruleId) === B.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
        n(
          "p",
          { key: "summary", className: "text-sm font-medium text-foreground" },
          `${S.createCount + S.linkCount} pending derivation${S.createCount + S.linkCount === 1 ? "" : "s"}`
        ),
        n(
          "p",
          { key: "details", className: "text-xs text-secondary" },
          `${S.createCount} new segments · ${S.linkCount} existing segments to link`
        ),
        n("div", { key: "actions", className: "flex gap-2" }, [
          n("button", {
            key: "materialize",
            type: "button",
            disabled: r,
            onClick: () => f(B, S),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => _(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        B.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : B.slotMappings.map((x, O) => n("div", {
          key: `${x.sourceSlotDefinitionId}:${x.derivedSlotDefinitionId}`,
          className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
        }, [
          n(
            "span",
            { key: "source", className: "truncate text-foreground", title: x.sourceSlotLabel || "Unnamed slot" },
            x.sourceSlotLabel || "Unnamed slot"
          ),
          n("span", { key: "arrow", className: "text-secondary" }, "→"),
          n(
            "span",
            { key: "derived", className: "truncate text-foreground", title: x.derivedSlotLabel || "Unnamed slot" },
            x.derivedSlotLabel || "Unnamed slot"
          )
        ]))
      ]),
      n("dl", { key: "metadata", className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-xs" }, [
        n("dt", { key: "created-label", className: "text-secondary" }, "Created"),
        n(
          "dd",
          { key: "created", className: "text-right text-foreground" },
          B.createdAt ? new Date(B.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          B.updatedAt ? new Date(B.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => f(B),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => u(B),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(B),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function ee() {
    if (Pe.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, U ? "No derivation relationships match your search." : "No derivation rules.");
    const v = M == null ? void 0 : M.tagId, b = /* @__PURE__ */ new Set();
    return M && (b.add(M.tagId), p.connections.forEach((x) => {
      (x.sourceTagId === M.tagId || x.derivedTagId === M.tagId) && (b.add(x.sourceTagId), b.add(x.derivedTagId));
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
        ...p.groups.map((x) => n("div", {
          key: `group:${x.componentId}:${x.key}`,
          className: `absolute rounded-xl border ${N === x.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
          style: {
            left: `${x.x}px`,
            top: `${x.y}px`,
            width: `${x.width}px`,
            height: `${x.height}px`
          }
        }, n("div", {
          className: "absolute left-3 top-2 max-w-[16rem] truncate text-[11px] font-semibold uppercase tracking-wide text-secondary",
          title: x.name
        }, x.name))),
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
          ...p.connections.map((x) => {
            const O = v === x.sourceTagId || v === x.derivedTagId, re = M != null, te = O ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${x.id}:visible`,
              d: x.path,
              fill: "none",
              stroke: te,
              strokeWidth: O ? 2.5 : 1.5,
              opacity: re && !O ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((x) => {
          const O = !U || x.name.toLocaleLowerCase().includes(U), re = M != null, te = b.has(x.tagId), j = (M == null ? void 0 : M.tagId) === x.tagId;
          return n("button", {
            key: `node:${x.tagId}`,
            type: "button",
            onClick: () => ye({ type: "node", id: x.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${j ? "border-accent bg-accent/15 ring-2 ring-accent/25" : te ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${x.x}px`,
              top: `${x.y}px`,
              width: `${x.width}px`,
              height: `${x.height}px`,
              opacity: !O || re && !te ? 0.62 : 1
            },
            title: `${x.name} — ${x.segmentGroupName}`,
            "aria-label": `${x.name}, ${x.incomingRuleCount} incoming and ${x.outgoingRuleCount} outgoing derivation rules`
          }, [
            n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground" }, x.name),
            n("span", { key: "counts", className: "mt-1 flex items-center gap-2 text-[11px] text-secondary" }, [
              n("span", { key: "in" }, `${x.incomingRuleCount} in`),
              n("span", { key: "arrow", "aria-hidden": "true" }, "→"),
              n("span", { key: "out" }, `${x.outgoingRuleCount} out`)
            ])
          ]);
        }),
        ...p.connections.filter((x) => x.rules.length > 1).map((x) => {
          const O = p.nodes.find((te) => te.tagId === x.sourceTagId), re = p.nodes.find((te) => te.tagId === x.derivedTagId);
          return n("div", {
            key: `bundle:${x.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(O.x + O.width + re.x) / 2 - 24}px`,
              top: `${(O.y + O.height / 2 + re.y + re.height / 2) / 2 - 10}px`
            },
            "aria-label": `${x.rules.length} rules connect ${x.rules[0].sourceTagName} to ${x.rules[0].derivedTagName}`
          }, `${x.rules.length} rules`);
        })
      ])
    ]);
  }
  function R() {
    if (Pe.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        U ? "No derivation relationships match your search." : "No derivation rules."
      );
    const v = /* @__PURE__ */ new Map();
    ae.forEach((x) => {
      const O = Y(x);
      v.has(O) || v.set(O, []), v.get(O).push(x);
    });
    const b = [
      ...h.segmentGroups.map((x) => x.key),
      "cross-group"
    ].filter((x) => v.has(x));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, b.map((x) => {
      const O = h.segmentGroups.find((j) => j.key === x), re = x === "cross-group" ? "Cross-group relationships" : (O == null ? void 0 : O.name) || "Ungrouped", te = v.get(x);
      return n("section", { key: x, "aria-label": re }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, re),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${te.length} rule${te.length === 1 ? "" : "s"}`
          )
        ]),
        n("div", { key: "table", role: "table", "aria-label": `${re} derivation rules` }, [
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
          ...te.map((j) => n("button", {
            key: j.id,
            type: "button",
            role: "row",
            onClick: () => ye({ type: "rule", id: j.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(B == null ? void 0 : B.id) === j.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${j.sourceTagName} → ${j.derivedTagName}` },
              `${j.sourceTagName} → ${j.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(j.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(j.edgeCount))
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
          `${A.length} rules · ${h.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          H(y()), ye(null), E();
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
          value: W,
          onChange: (v) => {
            ne(v.target.value), ye(null);
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
          value: N,
          disabled: d != null,
          onChange: (v) => {
            de(v.target.value), ye(null), H(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...h.segmentGroups.map((v) => n("option", { key: v.key, value: v.key }, v.name))
        ])
      ]),
      Ce === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: g,
          onChange: (v) => V(v.target.value),
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
            D(v), v === "graph" && (T == null ? void 0 : T.type) === "rule" && ye(null);
          },
          "aria-pressed": Ce === v,
          className: `rounded px-3 py-1.5 text-sm font-medium ${Ce === v ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
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
        Ce === "graph" ? ee() : R()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? be() : C()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      z ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, z) : null
    ]),
    i ? n(vo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => F(i),
      onClose: () => {
        const v = i.trigger;
        k(null), requestAnimationFrame(() => {
          v != null && v.isConnected && v.focus();
        });
      }
    }) : null
  ]);
}
function _c({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = G([]), [a, s] = G(null), [l, d] = G([]), [c, u] = G([]), [m, y] = G(!1), [h, p] = G(!1), [g, S] = G(!1), [$, f] = G(""), [z, U] = G(""), [W, F] = G("graph"), [E, A] = G("all"), [w, N] = G(null), [M, B] = G("relationship"), [T, k] = G(null), [H, V] = G(null), _ = ue(null), ne = ue(null), de = si().replace(/:/g, "");
  function ye() {
    requestAnimationFrame(() => {
      var I;
      return (I = _.current) == null ? void 0 : I.scrollIntoView({ block: "nearest" });
    });
  }
  async function D(I) {
    const q = await Z("/derivation-rules", I ? { signal: I } : void 0);
    i(q || []);
  }
  pe(() => {
    const I = new AbortController();
    return D(I.signal).catch((q) => {
      q.name !== "AbortError" && f(q.message || "Unable to load derived segment rules.");
    }), () => I.abort();
  }, []), pe(() => {
    const I = new AbortController();
    return a != null && a.sourceTagId ? (y(!0), Z(`/slot-definitions/${a.sourceTagId}`, { signal: I.signal }).then((q) => d(q.definitions || [])).catch((q) => {
      q.name !== "AbortError" && d([]);
    }).finally(() => {
      I.signal.aborted || y(!1);
    })) : (d([]), y(!1)), a != null && a.derivedTagId ? (p(!0), Z(`/slot-definitions/${a.derivedTagId}`, { signal: I.signal }).then((q) => u(q.definitions || [])).catch((q) => {
      q.name !== "AbortError" && u([]);
    }).finally(() => {
      I.signal.aborted || p(!1);
    })) : (u([]), p(!1)), () => I.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), pe(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || m || h)
      return;
    const I = `${a.sourceTagId}:${a.derivedTagId}`;
    ne.current !== I && (ne.current = I, s((q) => !q || Number(q.sourceTagId) !== Number(a.sourceTagId) || Number(q.derivedTagId) !== Number(a.derivedTagId) ? q : md(q, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    m,
    h
  ]);
  function ae(I, q = !1) {
    q || N({ type: "rule", id: I.id }), ne.current = null, s({
      ruleId: I.id,
      sourceTagId: I.sourceTagId,
      sourceTagName: I.sourceTagName,
      derivedTagId: I.derivedTagId,
      derivedTagName: I.derivedTagName,
      slotMappings: I.slotMappings.map((P) => ({
        sourceSlotDefinitionId: P.sourceSlotDefinitionId,
        derivedSlotDefinitionId: P.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), f(""), ye();
  }
  function le(I, q, P = "") {
    ne.current = null, I === "source" ? (d([]), y(q != null)) : (u([]), p(q != null)), s((Q) => ({
      ...Q,
      [`${I}TagId`]: q == null ? null : Number(q),
      [`${I}TagName`]: P || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function X(I) {
    (a == null ? void 0 : a.ruleId) == null && (ne.current = null);
    const q = [D(), t == null ? void 0 : t()];
    return I.draftKind === "source" ? (y(!0), q.push(Z(`/slot-definitions/${I.tagId}`).then((P) => d(P.definitions || [])).finally(() => y(!1)))) : I.draftKind === "derived" && (p(!0), q.push(Z(`/slot-definitions/${I.tagId}`).then((P) => u(P.definitions || [])).finally(() => p(!1)))), Promise.all(q);
  }
  function ce(I, q, P) {
    s((Q) => ({
      ...Q,
      slotMappings: Q.slotMappings.map((he, me) => me === I ? { ...he, [q]: P } : he)
    }));
  }
  async function xe() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const I = Ta(a, o);
    if (I) {
      f(I.message);
      return;
    }
    if (a.slotMappings.some((q) => !q.sourceSlotDefinitionId || !q.derivedSlotDefinitionId)) {
      f("Complete or remove every performer slot mapping before saving.");
      return;
    }
    S(!0), f(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let q = null;
      if (a.ruleId != null) {
        const Q = await Z(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${Q.deletedSegmentCount}
Removed lineage edges: ${Q.removedEdgeCount}
Shared derived segments retained: ${Q.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        q = Q.fingerprint;
      }
      f("Saving derived segment rule…");
      const P = await Z("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: q
        })
      });
      if (await D(), N(W === "graph" ? { type: "node", id: Number(P.sourceTagId) } : { type: "rule", id: P.id }), s(null), a.ruleId == null)
        try {
          const Q = await Z(
            `/derivation-rules/${P.id}/materialization/preview`,
            { method: "POST" }
          );
          k(
            Q.createCount + Q.linkCount > 0 ? Q : null
          ), f(Q.createCount + Q.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          k(null), f("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        k(null), f("Derived segment rule saved. Previous materializations were removed.");
    } catch (q) {
      f(q.message || "Unable to save derived segment rule.");
    } finally {
      S(!1);
    }
  }
  async function Ce(I) {
    S(!0), f("Previewing rule deletion…");
    try {
      const q = await Z(
        `/derivation-rules/${I.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${I.sourceTagName} → ${I.derivedTagName}?

Deleted segments: ${q.deletedSegmentCount}
Removed lineage edges: ${q.removedEdgeCount}
Shared derived segments retained: ${q.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const P = `derivation-rule-delete:${I.id}:${q.fingerprint}`;
      await Z(`/derivation-rules/${I.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(P),
          fingerprint: q.fingerprint
        })
      }), qe(P), await D(), (a == null ? void 0 : a.ruleId) === I.id && s(null), (w == null ? void 0 : w.type) === "rule" && w.id === I.id && N(null), (T == null ? void 0 : T.ruleId) === I.id && k(null), f(`Rule deleted with ${q.deletedSegmentCount} exclusively derived segment${q.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (q) {
      f(q.message || "Unable to delete derived segment rule.");
    } finally {
      S(!1);
    }
  }
  async function Pe(I, q = null) {
    const P = q || await Z(
      `/derivation-rules/${I.id}/materialization/preview`,
      { method: "POST" }
    );
    if (P.createCount + P.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const Q = `derivation-rule-materialize:${I.id}:${P.fingerprint}`, he = await Z(`/derivation-rules/${I.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: _e(Q),
        fingerprint: P.fingerprint
      })
    });
    return qe(Q), he;
  }
  async function fe(I, q = null) {
    S(!0), f("Finding pending derivations…");
    try {
      const P = await Pe(I, q);
      if (k(null), await D(), P.createdCount + P.linkedCount === 0) {
        f("Every applicable derivation is already materialized.");
        return;
      }
      f(
        `${P.createdCount} derived segment${P.createdCount === 1 ? "" : "s"} created and ${P.linkedCount} existing segment${P.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (P) {
      f(P.message || "Unable to materialize pending derivations.");
    } finally {
      S(!1);
    }
  }
  async function Y(I, q) {
    if (q.length === 0) return;
    S(!0), f(`Finding pending derivations from ${I.name}…`);
    let P = 0, Q = 0;
    try {
      for (const he of q) {
        const me = await Pe(he);
        P += me.createdCount, Q += me.linkedCount;
      }
      k(null), await D(), f(P + Q === 0 ? `Every outgoing derivation from ${I.name} is already materialized.` : `${P} derived segment${P === 1 ? "" : "s"} created and ${Q} existing segment${Q === 1 ? "" : "s"} linked from ${I.name}.`);
    } catch (he) {
      await D().catch(() => {
      }), f(he.message || `Unable to materialize derivations from ${I.name}.`);
    } finally {
      S(!1);
    }
  }
  const be = Ta(a, o), C = Ve(
    () => Gc(o, e),
    [o, e]
  ), ee = z.trim().toLocaleLowerCase(), v = C.components.filter((I) => E === "all" || I.segmentGroupKeys.includes(E)).filter((I) => !ee || I.nodes.some((q) => q.name.toLocaleLowerCase().includes(ee))), b = v.flatMap((I) => I.rules), x = new Set(
    v.flatMap((I) => I.nodes.map((q) => q.tagId))
  ), O = Ve(
    () => zc(v),
    [v]
  ), re = W === "list" ? Uc(
    w,
    b,
    ee.length > 0
  ) : null, te = (w == null ? void 0 : w.type) === "node" && C.nodes.find((I) => I.tagId === w.id && x.has(I.tagId)) || null, j = [...b].sort((I, q) => M === "source" ? Nt(I.sourceTagName, q.sourceTagName) || Nt(I.derivedTagName, q.derivedTagName) : M === "target" ? Nt(I.derivedTagName, q.derivedTagName) || Nt(I.sourceTagName, q.sourceTagName) : M === "materialized" ? (Number(q.edgeCount) || 0) - (Number(I.edgeCount) || 0) || Nt(I.sourceTagName, q.sourceTagName) : Nt(
    `${I.sourceTagName} ${I.derivedTagName}`,
    `${q.sourceTagName} ${q.derivedTagName}`
  ));
  return n(Hc, {
    arrowMarkerId: de,
    busy: g,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: H,
    deleteRule: Ce,
    derivedSlots: c,
    derivedSlotsLoading: h,
    draft: a,
    draftIssue: be,
    editRule: ae,
    editorRef: _,
    emptyDraft: r,
    graph: C,
    layout: O,
    listSort: M,
    materializationOffer: T,
    materializeOutgoingRules: Y,
    materializeRule: fe,
    message: $,
    normalizedQuery: ee,
    query: z,
    refreshConfiguredTag: X,
    revealEditor: ye,
    rules: o,
    save: xe,
    segmentGroupKey: E,
    selectedNode: te,
    selectedRule: re,
    selection: w,
    setConfiguringTag: V,
    setDraft: s,
    setListSort: B,
    setMaterializationOffer: k,
    setQuery: U,
    setSegmentGroupKey: A,
    setSelection: N,
    setView: F,
    sortedVisibleRules: j,
    sourceSlots: l,
    sourceSlotsLoading: m,
    updateMapping: ce,
    updateTag: le,
    view: W,
    visibleComponents: v,
    visibleRules: b
  });
}
function qc() {
  const [e, t] = G(ti), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => oa({ ...l, [a]: s }));
  }
  function i() {
    t(oa(io));
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
        onChange: (u) => o(a, u.target.value),
        className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
      })
    ])))
  ]);
}
function Wc({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = G([]), [a, s] = G(!1), [l, d] = G(!1), [c, u] = G(""), [m, y] = G(""), [h, p] = G("all"), [g, S] = G(() => /* @__PURE__ */ new Set()), [$, f] = G(null);
  pe(() => {
    if (!e || a) return;
    const k = new AbortController();
    return d(!0), u(""), Z("/slot-definitions", { signal: k.signal }).then((H) => {
      i(H || []), s(!0);
    }).catch((H) => {
      H.name !== "AbortError" && u(H.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      k.signal.aborted || d(!1);
    }), () => k.abort();
  }, [e, a]);
  async function z() {
    d(!0), u("");
    try {
      const k = await Z("/slot-definitions");
      i(k || []), s(!0);
    } catch (k) {
      u(k.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function U() {
    const [k] = await Promise.all([
      Z("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(k || []), s(!0), u("");
  }
  function W() {
    const k = $ == null ? void 0 : $.trigger;
    f(null), requestAnimationFrame(() => {
      k != null && k.isConnected && k.focus({ preventScroll: !0 });
    });
  }
  function F(k) {
    S((H) => {
      const V = new Set(H);
      return V.has(k) ? V.delete(k) : V.add(k), V;
    });
  }
  const E = Ve(
    () => Fc(t, o),
    [t, o]
  ), A = Ve(
    () => Bc(E, m, h),
    [E, m, h]
  ), w = E.flatMap((k) => k.tags), N = w.filter((k) => k.definitions.length > 0).length, M = w.length - N, B = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], T = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${w.length} tags · ${N} with slots · ${M} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: m,
          onChange: (k) => y(k.target.value),
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
          B.map(([k, H]) => n("button", {
            key: k,
            type: "button",
            onClick: () => p(k),
            "aria-pressed": h === k,
            className: `rounded px-3 py-1.5 text-xs font-medium ${h === k ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, H))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => S(/* @__PURE__ */ new Set()),
          className: T
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => S(new Set(E.map((k) => k.overviewKey))),
          className: T
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
    a && A.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, A.map((k) => {
      const H = g.has(k.overviewKey), V = k.tags.filter((_) => _.definitions.length > 0).length;
      return n("article", {
        key: k.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => F(k.overviewKey),
          "aria-expanded": !H,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, H ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, k.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${k.tags.length} tag${k.tags.length === 1 ? "" : "s"} · ${V} with slots`
          )
        ]),
        H ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          k.tags.map((_) => n("li", {
            key: _.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: _.tagName }, _.tagName),
              _.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            _.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${_.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, _.definitions.map((ne) => n("li", {
              key: ne.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, Ct(ne)),
              ...(ne.genderHints || []).map((de) => n("span", {
                key: de,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, Cr(de)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (ne) => f({
                tagId: _.tagId,
                tagName: _.tagName,
                trigger: ne.currentTarget
              }),
              "aria-label": `Edit performer slots for ${_.tagName}`,
              className: `${T} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    $ ? n(vo, {
      key: `performer-slots-configure:${$.tagId}`,
      tagId: $.tagId,
      tagName: $.tagName,
      onSaved: U,
      onClose: W
    }) : null
  ]);
}
function Vc({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = G("general"), [a, s] = G([]), [l, d] = G(!1), [c, u] = G(""), [m, y] = G("full"), [h, p] = G(!0), [g, S] = G(!1), [$, f] = G(""), [z, U] = G(!0), [W, F] = G(Va), E = Rl(t), A = E.map(([T]) => T);
  pe(() => {
    A.includes(o) || i(A[0] || "general");
  }, [t.effectiveMode]);
  async function w(T) {
    const k = await Z("/segment-groups", T ? { signal: T } : void 0);
    s(k || []);
  }
  pe(() => {
    const T = new AbortController();
    return w(T.signal).catch((k) => {
      k.name !== "AbortError" && u(k.message || "Unable to load tag groups.");
    }), () => T.abort();
  }, []), pe(() => {
    if (t.effectiveMode !== "full") {
      p(!1);
      return;
    }
    const T = new AbortController();
    return f(""), p(!0), Z("/ai-tagging/settings", { signal: T.signal }).then((k) => {
      U(!0), y((k == null ? void 0 : k.mode) || "full");
    }).catch((k) => {
      if (k.name !== "AbortError") {
        if (k.status === 403) {
          U(!1), f("You do not have permission to change how AI results are applied.");
          return;
        }
        f(k.message || "Unable to load AI tagging settings.");
      }
    }).finally(() => {
      T.signal.aborted || p(!1);
    }), () => T.abort();
  }, [t.effectiveMode]);
  async function N(T) {
    if (T !== t.requestedMode) {
      d(!0), u("");
      try {
        const k = await Z(
          `/preferences/transition?mode=${encodeURIComponent(T)}`
        );
        let H = !1, V = null, _ = null, ne = null, de = !1;
        if (t.requestedMode === "basic" && T === "full") {
          if (!window.confirm(El(
            k.recyclingBinCount,
            k.protectedRecyclingBinCount
          )))
            return;
          de = !0, k.recyclingBinCount > 0 && (H = !0, ne = k.recyclingBinFingerprint, V = `mode-switch-empty-bin:${ne}`, _ = _e(V));
        }
        let ye = !1;
        if (t.requestedMode === "full" && T === "basic") {
          if (!window.confirm(Ml(
            k.extensionOwnedSegmentCount
          )))
            return;
          ye = !0;
        }
        const D = await Z("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: T,
            confirmHiddenExtensionOwnedSegments: ye,
            confirmBasicHistoryCleanup: de,
            emptyRecyclingBin: H,
            operationId: _,
            expectedRecyclingBinFingerprint: ne
          })
        });
        V && qe(V), r == null || r(ni(D)), u("Workflow mode saved.");
      } catch (k) {
        u(k.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function M(T) {
    T.preventDefault(), S(!0), f("");
    try {
      const k = await Z("/ai-tagging/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: m })
      });
      y((k == null ? void 0 : k.mode) || "full"), f((k == null ? void 0 : k.mode) === "basic" ? "AI tags will be applied to the library directly." : "AI tags will be queued for review.");
    } catch (k) {
      f(k.message || "Unable to save AI tagging settings.");
    } finally {
      S(!1);
    }
  }
  const B = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (T) => Ri(T, e, B), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      E.map(([T, k]) => n("button", {
        key: T,
        type: "button",
        onClick: () => i(T),
        "aria-current": o === T ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === T ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, k))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(qc)
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
      n(uc, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: N,
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
          checked: W,
          onChange: (T) => {
            const k = T.target.checked;
            Ja(k), F(k);
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
        n("h2", { key: "title", className: "text-lg font-semibold text-foreground" }, "AI tagging"),
        n(
          "p",
          { key: "description", className: "mt-1 text-sm text-secondary" },
          "Choose what happens to tags produced by a native AI analysis run."
        )
      ]),
      n("form", { key: "form", onSubmit: M, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
        n("label", { key: "mode", className: "min-w-0 flex-1 space-y-1" }, [
          n("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Apply results"),
          n("select", {
            key: "input",
            value: m,
            onChange: (T) => y(T.target.value),
            disabled: h || g || !z,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "full", value: "full" }, "Queue for review"),
            n("option", { key: "basic", value: "basic" }, "Apply to the library directly")
          ])
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: h || g || !z,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, g ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        $ || (h ? "Loading AI tagging settings…" : m === "basic" ? "AI tags are applied to the library directly." : "AI tags are queued for review.")
      )
    ]) : null,
    A.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(_c, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => w()
      })
    ) : null,
    A.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(Wc, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => w()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function Ra({ facets: e, values: t, disabled: r, onChange: o }) {
  var i;
  return r ? n(
    "p",
    { className: "rounded-md border border-dashed border-border p-3 text-xs text-secondary" },
    "Performer slot filters are unavailable for your current access. Browse and playback remain available."
  ) : (i = e == null ? void 0 : e.slots) != null && i.length ? n("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, e.slots.map((a) => n("label", { key: a.id, className: "space-y-1 text-xs text-secondary" }, [
    n("span", { key: "label" }, Ct(a)),
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
  var u, m;
  const s = [...e.slots || []].sort((y, h) => y.sortOrder - h.sortOrder || String(y.slotDefinitionId).localeCompare(String(h.slotDefinitionId))), l = [...new Map(s.map((y) => [
    y.performerId,
    { id: y.performerId, name: y.performerName }
  ])).values()], d = s.map((y) => ({
    slotDefinitionId: y.slotDefinitionId,
    label: Ct(y),
    performer: { id: y.performerId, name: y.performerName }
  })), c = oi(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: gi(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((u = e.activity) == null ? void 0 : u.name) || "segment"}, ${e.reviewState}, ${Ee(e.startSec)} to ${e.endSec == null ? "end of video" : Ee(e.endSec)}` }, [
      n("div", { key: "image", className: "relative aspect-video bg-black" }, [
        n("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        n("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${Ee(e.startSec)} → end` : `${Ee(e.startSec)} – ${Ee(e.endSec)}`)
      ]),
      n("div", { key: "body", className: "flex flex-col gap-1.5 p-2.5" }, [
        n("div", { key: "segment", className: "flex min-w-0 items-center gap-1.5" }, [
          n(ln, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((m = e.activity) == null ? void 0 : m.name) || "Tag segment"),
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
function Yc({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(Oa, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: Pl(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: oi(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Aa({ onNavigate: e, profile: t }) {
  const r = Ve(() => {
    const D = La("ext:com.midnightrider.segment-studio:segments");
    return D ? {
      ..._r,
      defaultFilter: { ..._r.defaultFilter, ...D.findFilter || {} },
      defaultObjectFilter: D.objectFilter || {}
    } : _r;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = ja(r), [l, d] = G(null), [c, u] = G({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [m, y] = G(null), [h, p] = G(null), [g, S] = G(0), [$, f] = G(""), [z, U] = G(!0), [W, F] = G(""), E = ue(0), A = ia(o, i), w = A.activityTagId, N = In(i.slots), M = Ve(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (D) => Object.keys(In(D)).length > 0,
    sanitize: (D) => qr(w, In(D)),
    summarize: (D) => `${Object.keys(In(D)).length} assigned`,
    renderEditor: (D, ae) => w ? n(Ra, {
      facets: l,
      values: In(D),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (le, X) => {
        const ce = { ...In(D) };
        X ? ce[le] = Number(X) : delete ce[le], ae(qr(w, ce));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [w, l, c.performerSlotsAvailable]), B = JSON.stringify(A);
  pe(() => {
    if (d(null), !w) return;
    const D = new AbortController();
    return Z(`/browse/activities/${w}/facets`, { signal: D.signal }).then(d).catch((ae) => {
      ae.status === 403 ? d({ slots: [], restricted: !0 }) : ae.name !== "AbortError" && F(ae.message);
    }), () => D.abort();
  }, [w]), pe(() => {
    const D = ++E.current, ae = new AbortController();
    return U(!0), F(""), Z("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(A), signal: ae.signal }).then((le) => {
      D === E.current && u({ ...le, totalCount: le.totalCount ?? le.total ?? 0 });
    }).catch((le) => {
      if (!(D !== E.current || le.name === "AbortError")) {
        if (le.status === 400 && le.message.includes("unrestricted performer read access")) {
          u((X) => ({ ...X, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), F("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        F(le.message);
      }
    }).finally(() => {
      D === E.current && U(!1);
    }), () => {
      E.current++, ae.abort();
    };
  }, [B, g]);
  const T = c.items.findIndex((D) => D.key === m), k = c.items[T] || null;
  function H(D) {
    s(D), a({ ...o, page: 1 });
  }
  function V(D) {
    const ae = ia(o, D), le = D.slots && ae.activityTagId != null && ae.slotAssignments.length > 0 ? D.slots : void 0;
    H({ ...D, slots: le });
  }
  function _(D, ae) {
    const le = { ...N };
    ae ? le[D] = Number(ae) : delete le[D], H({ ...i, slots: qr(w, le) });
  }
  function ne() {
    const D = document.querySelector(`[data-segment-key="${m}"]`);
    y(null), requestAnimationFrame(() => D == null ? void 0 : D.focus());
  }
  async function de(D) {
    var X;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(D.key), f("");
    const ae = `browse-restore:${D.itemId}:${D.revision}`, le = _e(ae);
    try {
      const ce = (xe = !1) => Z(`/bin/${D.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: le,
          expectedRevision: D.revision,
          discardMissingImage: xe
        })
      });
      try {
        await ce(uo(ae));
      } catch (xe) {
        if (((X = xe.payload) == null ? void 0 : X.code) !== "missing-image" || !window.confirm(`${xe.message}

Continue and discard the missing image reference?`))
          throw xe;
        mo(ae), await ce(!0);
      }
      qe(ae), m === D.key && y(null), f("Segment restored to Cove."), S((xe) => xe + 1);
    } catch (ce) {
      f(ce.message || "Unable to restore the segment."), ce.status === 409 && S((xe) => xe + 1);
    } finally {
      p(null);
    }
  }
  async function ye(D) {
    p(D.key), f("");
    try {
      const ae = await Z(`/items/${D.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: D.revision })
      });
      if (!di(ae, f) || !Jl(ae))
        return;
      const le = `browse-dependency-delete:${D.itemId}:${ae.fingerprint}`;
      await Z(`/items/${D.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(le),
          fingerprint: ae.fingerprint
        })
      }), qe(le), m === D.key && y(null), f(`${ae.deletedSegmentCount} segment${ae.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), S((X) => X + 1);
    } catch (ae) {
      f(ae.message || "Unable to permanently delete the segment."), ae.status === 409 && S((le) => le + 1);
    } finally {
      p(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(ho, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(Fa, {
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
      error: W ? new Error(W) : null,
      onRetry: () => S((D) => D + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? aa.filter((D) => D.id !== "performers") : aa,
      objectFilter: i,
      onObjectFilterChange: V,
      customFilterSections: M,
      searchPlaceholder: "Search segments..."
    }, [
      w ? n(Ra, { key: "slots", facets: l, values: N, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: _ }) : null,
      n(Yc, { key: "player", item: k, index: T, count: c.items.length, onPrevious: () => {
        var D;
        return y((D = c.items[T - 1]) == null ? void 0 : D.key);
      }, onNext: () => {
        var D;
        return y((D = c.items[T + 1]) == null ? void 0 : D.key);
      }, onClose: ne, onNavigate: e }),
      $ ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, $) : null,
      !z && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      z ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((D) => n(Jc, {
        key: D.key,
        item: D,
        selected: D.key === m,
        busy: h === D.key,
        onSelect: () => y(D.key),
        onRestore: de,
        onPurge: ye
      })))
    ])
  ]);
}
function Qc({ onNavigate: e, profile: t }) {
  const [r, o] = G([]), [i, a] = G(""), [s, l] = G(0), [d, c] = G(!0), [u, m] = G(null), [y, h] = G(""), p = ue(null);
  async function g(f) {
    const z = await Z("/bin", f ? { signal: f } : void 0);
    return o(z.items || []), a(z.fingerprint || ""), l(Number(z.totalCount) || 0), z;
  }
  pe(() => {
    const f = new AbortController();
    return c(!0), g(f.signal).catch((z) => {
      z.name !== "AbortError" && h(z.message);
    }).finally(() => {
      f.signal.aborted || c(!1);
    }), () => f.abort();
  }, []), Pa(ao, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var f;
      return (f = p.current) == null ? void 0 : f.call(p);
    }
  }]);
  async function S(f) {
    var W;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    m(f.itemId), h("");
    const z = `restore:${f.itemId}:${f.revision}`, U = _e(z);
    try {
      const F = (E = !1) => Z(`/bin/${f.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: U, expectedRevision: f.revision, discardMissingImage: E })
      });
      try {
        await F(uo(z));
      } catch (E) {
        if (((W = E.payload) == null ? void 0 : W.code) !== "missing-image" || !window.confirm(`${E.message}

Continue and discard the missing image reference?`)) throw E;
        mo(z), await F(!0);
      }
      qe(z), await g(), qn(), h("Segment restored with a new native ID.");
    } catch (F) {
      h(F.message || "Unable to restore the segment."), F.status === 409 && await g();
    } finally {
      m(null);
    }
  }
  async function $() {
    if (u == null)
      try {
        const f = await ui({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          m(-1), h("");
        });
        if (f.status !== "emptied") return;
        await g(), qn(), h(`${f.segmentCount} segment${f.segmentCount === 1 ? "" : "s"} from ${f.sceneCount} scene${f.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (f) {
        h(f.message || "Unable to empty the recycling bin."), f.status === 409 && await g();
      } finally {
        m(null);
      }
  }
  return p.current = $, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    n(ho, {
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
        disabled: d || u != null || s === 0,
        onClick: $,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, u === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    y ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, y) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((f) => n("article", { key: f.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${f.tagName || "Tag segment"} · ${f.videoTitle || `Video ${f.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, f.endSec == null ? Ee(f.startSec) : `${Ee(f.startSec)} – ${Ee(f.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${f.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${f.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: u != null, onClick: () => S(f), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const Ma = "ext:com.midnightrider.segment-studio:videos";
function Vr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = Ve(() => {
    var de;
    const _ = La(Ma), ne = (de = _ == null ? void 0 : _.uiOptions) == null ? void 0 : de.displayMode;
    return _ ? {
      ...Un,
      defaultFilter: { ...Un.defaultFilter, ..._.findFilter || {} },
      defaultObjectFilter: _.objectFilter || {},
      defaultDisplayMode: Un.allowedDisplayModes.includes(ne) ? ne : Un.defaultDisplayMode
    } : Un;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: u } = ja(i), [m, y] = G({ items: [], totalCount: 0 }), [h, p] = G(!0), [g, S] = G(""), [$, f] = G(0), [z, U] = G(/* @__PURE__ */ new Set()), W = ue(0), F = ue(null), E = JSON.stringify(a), A = JSON.stringify(s), w = t || r === "review";
  pe(() => {
    F.current = null, U(/* @__PURE__ */ new Set());
  }, [E, A]), pe(() => {
    const _ = ++W.current, ne = new AbortController();
    return p(!0), S(""), Z(`/videos?${ic(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: ne.signal }).then((de) => {
      _ === W.current && y(de);
    }).catch((de) => {
      _ === W.current && de.name !== "AbortError" && S(de.message || "Unable to discover videos.");
    }).finally(() => {
      _ === W.current && p(!1);
    }), () => {
      W.current++, ne.abort();
    };
  }, [E, A, t, r, $]);
  function N(_) {
    d({ ..._, page: _.page || 1 });
  }
  function M(_) {
    c(_), d({ ...a, page: 1 });
  }
  function B(_, ne = !1) {
    U((de) => sc(
      de,
      m.items.map((ye) => ye.videoId),
      _,
      F.current,
      ne
    )), F.current = _;
  }
  function T() {
    F.current = null, U(new Set(m.items.map((_) => _.videoId)));
  }
  function k() {
    F.current = null, U(/* @__PURE__ */ new Set());
  }
  function H() {
    F.current = null, U((_) => new Set(m.items.map((ne) => ne.videoId).filter((ne) => !_.has(ne))));
  }
  const V = t || r === "review" ? wa : wa.filter((_) => !["reviewState", "shotBoundaries"].includes(_.id));
  return n("div", { className: "w-full space-y-5" }, [
    n(ho, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(Fa, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: Ma,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: N,
      totalCount: m.totalCount,
      isLoading: h,
      error: g ? new Error(g) : null,
      onRetry: () => f((_) => _ + 1),
      sortOptions: t || r === "review" ? [...ka, { value: "unreviewed_count", label: "Unreviewed count" }] : ka,
      displayMode: l,
      onDisplayModeChange: u,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: V,
      objectFilter: s,
      onObjectFilterChange: M,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: w ? z : void 0,
      onSelectAll: w ? T : void 0,
      onSelectNone: w ? k : void 0,
      onInvertSelection: w ? H : void 0,
      // The host renders whatever extensions contribute for a video selection, so
      // Run AI here is the same action, and the same dialog, as the native videos
      // page. Only the contributed actions are rendered: Segment Studio's own
      // ownership and lineage rules govern deletion, so the native bulk mutations
      // that would bypass them stay out of this bar.
      selectionActions: w && z.size > 0 ? n(Ts, { entityType: "video", selectedIds: z }) : null
    }, [
      !h && m.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !h && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, m.items.map((_) => n(lc, { key: _.videoId, item: _, onNavigate: e, showReviewStates: w, selected: z.has(_.videoId), selectionActive: z.size > 0, onSelect: w ? B : null }))) : null,
      !h && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, m.items.map((_) => n(dc, { key: _.videoId, item: _, onNavigate: e, showReviewStates: w, selected: z.has(_.videoId), selectionActive: z.size > 0, onSelect: w ? B : null }))) : null
    ])
  ]);
}
function Ea({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = G(null), [s, l] = G(!0), [d, c] = G(""), u = ue(0), m = ue(0), y = ue(e), h = qd();
  y.current = e;
  const [p] = G(() => Ws({
    beginRequest: () => ({ requestId: ++m.current, videoId: y.current }),
    fetchDetail: (U) => Z(g(U.videoId)),
    isCurrent: (U) => cr(U.requestId, m.current, U.videoId, y.current),
    isSameVideo: (U) => U.videoId === y.current
  })), g = (U) => `/videos/${U}/editor`;
  async function S(U, W, F) {
    const E = await Z(g(W), F ? { signal: F.signal } : void 0);
    return cr(U, F ? u.current : m.current, W, y.current) ? (a(E), !0) : !1;
  }
  pe(() => {
    const U = ++u.current, W = e, F = new AbortController();
    return a(null), l(!0), c(""), S(U, W, F).catch((E) => {
      cr(U, u.current, W, y.current) && E.name !== "AbortError" && c(E.message || "Unable to load the editor.");
    }).finally(() => {
      cr(U, u.current, W, y.current) && l(!1);
    }), () => {
      u.current++, m.current++, F.abort();
    };
  }, [e]);
  function $(U, W) {
    a((F) => (F == null ? void 0 : F.video.id) !== W ? F : typeof U == "function" ? U(F) : U);
  }
  function f() {
    return p({
      onLoaded: (U) => {
        a(U), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: (U) => c(U.message || "Unable to reload the latest segment.")
    });
  }
  function z() {
    return p({
      onLoaded: (U) => {
        a(U), c("");
      },
      onError: (U) => c(U.message || "Unable to reload performer slots.")
    });
  }
  return n("div", {
    className: `mx-auto flex w-full flex-col gap-2 ${h ? "lg:overflow-hidden" : "p-3 sm:p-4"}`,
    style: h ? {
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
      n(Ms, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(jc, {
      key: i.video.id,
      detail: i,
      onDetailChange: $,
      onConflict: f,
      onReload: z,
      onSlotsChanged: z,
      splitLayout: h,
      profile: o,
      initialSegmentId: la() ? -la() : Ll(),
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
  const a = o.legacyCompatibilityRequired, s = $l(o), l = Zc(e, t, window.location.pathname), d = Xc(e, t, window.location.pathname), c = eu(e, t, window.location.pathname), u = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (Al(u, o) === "videos" && u !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Vr, {
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
    if (d) return n(Aa, { onNavigate: r, profile: o });
    const h = Number(e);
    return Number.isInteger(h) && h > 0 ? n(Ea, {
      videoId: h,
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
  if (c) return n(Qc, { onNavigate: r, profile: o });
  const y = Number(e);
  return d ? n(Aa, { onNavigate: r, profile: o }) : Number.isInteger(y) && y > 0 ? n(Ea, {
    videoId: y,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(Vr, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function nu({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = G(null), [a, s] = G("");
  return pe(() => {
    const l = new AbortController();
    return Z("/preferences", { signal: l.signal }).then((d) => i(ni(d))).catch((d) => {
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
  Cn as CLEARED_SEGMENT_SELECTION_ID,
  ka as DISCOVERY_SORT_OPTIONS,
  Jt as SEGMENT_STUDIO_CAPABILITIES,
  ao as SEGMENT_STUDIO_EXTENSION_ID,
  Qn as SEGMENT_STUDIO_SHORTCUTS,
  Qs as activeEditorFilterCount,
  Fd as addPendingChange,
  md as applyDerivationRuleSlotSuggestions,
  _n as applyFeedbackEditorDelta,
  Kd as applyPendingChanges,
  fa as applySegmentMergeDelta,
  Zl as basicSegmentTimelineStyle,
  Pl as browseClipEnd,
  oi as browseEditorHref,
  ia as buildBrowseRequest,
  Gc as buildDerivationRuleGraph,
  ic as buildDiscoverySearchParams,
  Ls as buildMinuteTimelineTicks,
  Fc as buildPerformerSlotOverview,
  Kl as buildSegmentQuickSearchEntries,
  bd as buildSegmentRailRows,
  hd as buildTimelineRows,
  cu as buildTimelineTicks,
  Gs as calculateCenteredTimelineScroll,
  Yr as calculateEditorPanelMaximum,
  js as calculateMinuteLabelStride,
  uu as calculateMinuteTimelineWidth,
  Us as calculateSwimlaneTitleMaximum,
  Ks as calculateTimelinePlayheadPosition,
  so as calculateTimelineRatioBounds,
  _s as calculateTimelineRatioFromPointer,
  mu as calculateVerticalRevealOffset,
  on as clampEditorPanelWidth,
  yr as clampSwimlaneTitleWidth,
  Wa as clampTimelineRatio,
  lo as clampTimelineRatioForHeight,
  kr as clampTimelineZoom,
  nc as compactProvenanceSummary,
  zd as confirmPendingChange,
  Ws as createEditorReloader,
  yl as createQueuedReviewRequest,
  Pd as createSaveQueue,
  $a as createSegmentAnalysisRequestScope,
  Au as default,
  Ci as discardPendingChange,
  Vl as downloadFileNameFromContentDisposition,
  Zs as dualRangeValueFromPointer,
  na as duplicateIdentityFromResponse,
  vl as duplicateOperationKey,
  Ya as editorVisibilityIncludingSegment,
  Sd as expandedSwimlanes,
  Ml as extensionOwnedSegmentsModeSwitchPrompt,
  Cd as feedbackFrameTimestamps,
  Td as feedbackResultMatchesAction,
  $d as feedbackSelectionPlan,
  Ys as filterDerivedSegments,
  Ur as filterEditorSegments,
  Bc as filterPerformerSlotOverview,
  Gl as filterSegmentQuickSearch,
  bu as filterSegmentStudioShortcuts,
  Nd as findAdjacentSegmentGroupKey,
  Il as findAdjacentShot,
  gl as findEditorShortcut,
  qa as findInitialSegmentSelection,
  Ps as findNearestSegmentInCurrentSwimlane,
  hr as findNextUnprocessed,
  Nl as findPublishedSelectionIdentity,
  ot as findSegmentByStableIdentity,
  qs as findSegmentFromPlayhead,
  Os as findSegmentNearPlayhead,
  wd as findSwimlaneRangeSelection,
  no as findSwimlaneSelection,
  Fl as findUniquePerformerSlotAssignment,
  Sr as findUnreviewedSelection,
  sd as focusDialogDefaultButton,
  Cr as formatGenderHint,
  Cl as frameStepSeconds,
  ai as generatePerformerSlotAssignmentRecommendations,
  vc as groupApprovedDraftsForPublishing,
  Bl as groupAutoAssignCandidates,
  Rd as groupIncorrectExamplesByTag,
  Nc as groupMaterializationOutputs,
  an as groupSegmentsIntoSwimlanes,
  vd as groupSelectedSwimlanes,
  yo as groupSwimlanesBySegmentGroup,
  At as handleModalKey,
  bi as hasGroupedSwimlanes,
  Tn as hasSegmentStudioCapability,
  Ni as heldTagChangeFor,
  wl as heldTagReady,
  ba as hideCollectedFeedbackSegments,
  ga as historyActionsForTarget,
  mr as incorrectExampleHistoryState,
  yi as indexPerformerSlotsBySegment,
  xu as initialReviewFilter,
  Ed as insertSegmentProjection,
  cr as isCurrentEditorRequest,
  rd as isEditableTarget,
  ku as isEditorShortcutOwner,
  Od as isKindRunning,
  Ru as isSaveQueueBusy,
  eu as isSegmentStudioBinRoute,
  Xc as isSegmentStudioSegmentsRoute,
  Zc as isSegmentStudioSettingsRoute,
  Kc as layoutDerivationRuleComponent,
  zc as layoutDerivationRuleComponents,
  Dd as mergeSegmentsProjection,
  cd as multiSelectionActionHint,
  Xt as normalizeCollapsedSegmentGroups,
  Ia as normalizeDiscoveryIds,
  Ot as normalizeEditorSegmentFilters,
  Qt as normalizeGender,
  ra as normalizeReviewFilter,
  ni as normalizeSegmentStudioFeatureProfile,
  hu as normalizeSegmentStudioMode,
  eo as normalizeSegmentStudioPublicMode,
  In as parseBrowseSlotFilters,
  Hs as parseEditorLayout,
  Vs as parseHideDerivedSegmentsPreference,
  Js as parseMergeConfirmationPreference,
  ei as parsePlaybackShortcutConfig,
  ul as parseShortcutBindingOverrides,
  Yt as patchPerformerSlotProjection,
  Iu as patchSegmentProjection,
  Ud as pendingChangesReducer,
  Bd as pendingInsertedSegments,
  il as percentageSeekTime,
  jl as performInitialSegmentSeek,
  ct as performerOptionId,
  wr as performerSlotHistoryState,
  Ct as performerSlotLabel,
  gd as performerSlotPresentation,
  Nu as performerSlotStatus,
  fo as performerSlotStatusFromSegmentSlots,
  fi as performerSlotsForSegment,
  Gt as provenanceSourceLabel,
  Ti as prunePendingChanges,
  kl as queueCreatedSegmentTagChoice,
  ii as rankPerformerOptions,
  Id as reconcileSegmentGroupKey,
  ol as reconcileSelectedSegmentIds,
  cc as recyclingBinActionText,
  Yl as recyclingBinDeletionPrompt,
  ci as recyclingBinDeletionSummary,
  El as recyclingBinModeSwitchPrompt,
  vu as removeQueuedReviewsForSegments,
  Cu as removeSegmentsProjection,
  la as requestedOwnedItemId,
  Ll as requestedSegmentId,
  el as resolveEditorSegmentSelection,
  bl as resolveQueuedReviewRequest,
  xl as resolveSegmentCreationAction,
  Al as resolveSegmentStudioRoute,
  ml as resolveSegmentStudioShortcuts,
  ki as resolveSegmentTarget,
  Uc as resolveSelectedDerivationRule,
  Xo as resolveSelectedSegments,
  Tc as restoreDisabledToolbarActionFocus,
  Lc as restorePublishApprovedFocus,
  $u as restoreSegmentFieldsProjection,
  Tu as restoreSegmentsProjection,
  Gd as retargetPendingChanges,
  Si as revealCollapsedSegmentGroup,
  Rn as sameSegmentIdentity,
  wi as savingSegmentIdFrom,
  mi as segmentBadgeStyle,
  Ir as segmentGroupHeaderBackground,
  Ft as segmentGroupKeyForSegment,
  po as segmentHistoryIdentity,
  ur as segmentHistoryState,
  Tt as segmentIdentity,
  gi as segmentRailItemStyle,
  Su as segmentStateStyle,
  ru as segmentStudioActionTarget,
  $l as segmentStudioLegacyMode,
  Ql as segmentTimelineStyle,
  Dt as segmentsHistoryState,
  al as selectAllVideoSegmentIds,
  Dl as selectedBrowseStates,
  vi as selectedSwimlaneMerge,
  br as selectionReferenceForSegment,
  Ri as setBackLinkNavigation,
  $i as settlePendingChange,
  ld as sharedPerformerSlotShape,
  dd as sharedTagPerformerSlotShape,
  $n as shortcutAvailableInMode,
  pl as shortcutBindingDisplayText,
  gu as shortcutBindingFromEvent,
  fu as shortcutBindingsOverlap,
  yu as shortcutModesOverlap,
  cl as shortcutRequiresSingleSegment,
  vr as shotBoundaryFingerprint,
  id as shouldAcceptCurrentTagFromEnter,
  ad as shouldDismissPopover,
  pu as shouldExitShortcutCapture,
  wu as shouldHandleEditorShortcut,
  Ca as shouldLoadSegmentAnalysis,
  Sa as shouldReloadAfterSegmentMutation,
  Xr as shouldRestoreTransitionSelection,
  zl as shouldShowQuickSearchGroups,
  ea as splitShortcutCategoriesIntoColumns,
  ud as suggestDerivationRuleSlotMappings,
  Jn as swimlaneDisplayLabel,
  nd as swimlaneMarkerTop,
  ed as swimlaneStripeBackground,
  Sl as tagEditorLockedBySave,
  bo as targetsOverlap,
  zs as timelineContentStyle,
  Vo as timelinePlayheadHorizontalStyle,
  Xl as timelineSegmentWidth,
  Fs as timelineTickAlignment,
  Bs as timelineTickPosition,
  Jr as timelineTimePercent,
  kd as toggleAllCollapsedSegmentGroups,
  fl as toggledSelectionReviewState,
  qt as trapModalFocus,
  _l as tryParseJsonResponseText,
  rl as updateAnchoredSegmentSelection,
  sc as updateDiscoverySelection,
  Xs as updateDualRangeValues,
  tl as updateSegmentCollectionSelection,
  nl as updateSegmentRangeSelection,
  Qa as updateSegmentSelection,
  Ta as validateDerivationRuleDraft,
  Wo as validateSegmentTiming,
  co as videoPerformerOptions,
  Wr as videoPerformerSlotAssignments,
  Rl as visibleSegmentStudioSettingsTabs,
  Tl as visibleSegmentStudioTabs,
  hi as visibleVirtualRows
};
