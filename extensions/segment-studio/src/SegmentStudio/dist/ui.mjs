import oo from "@cove/runtime/react";
import { createPortal as Ns } from "@cove/runtime/react-dom";
import { extensionFetch as Da } from "@cove/runtime/api";
import { formatDuration as Is, EntityReferenceSelector as Wn, useExtensionKeyboardBindings as Cs, ExtensionEntityActions as $s, VideoPlayer as Oa, useRegisterExtensionKeyboardActions as Pa, getDefaultFilter as La, useListUrlState as ja, ListPage as Fa, ExtensionSelectionActions as Ts } from "@cove/runtime/components";
import { StepBack as Rs, StepForward as Ms, Loader2 as As } from "@cove/runtime/lucide-react";
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
  const i = e.findIndex((g) => g.markers.some((b) => b.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const g = e.flatMap((b) => b.markers.map((h) => h.segment)).filter((b) => b.reviewState === "unreviewed");
    return r < 0 ? g.at(-1) ?? null : g[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((g) => g.segment.id === t);
  if (!o)
    return ((u = (r < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((b) => b.segment.reviewState === "unreviewed")) == null ? void 0 : u.segment) ?? null;
  const l = e.flatMap((g) => g.markers.map((b) => b.segment)), d = l.findIndex((g) => g.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((g) => g.reviewState === "unreviewed") ?? null;
}
function Os(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((u, g) => u.markers.filter(({ segment: b }) => {
    const h = Number(b.startSec), f = b.endSec == null ? h + Ds : Number(b.endSec);
    return Number.isFinite(h) && Number.isFinite(f) && f >= h && h <= i + qo + Vn && f >= i - qo - Vn;
  }).map(({ segment: b }) => ({ segment: b, laneIndex: g }))).sort((u, g) => u.laneIndex - g.laneIndex || Math.abs(u.segment.startSec - i) - Math.abs(g.segment.startSec - i) || u.segment.id - g.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((u) => u.markers.some((g) => g.segment.id === o));
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
        const g = await t(c);
        if (r(c))
          return l(g), g;
      } catch (g) {
        if (r(c))
          return d(g), null;
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
  const t = It.filter((u) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(u) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (u, g) => {
    const b = Number(u);
    return Number.isFinite(b) ? Math.min(1, Math.max(0, b)) : g;
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
  const a = Ot(r), s = a.performerId == null ? null : new Set((t || []).filter((g) => Number(g.performerId) === a.performerId).map((g) => g.segmentId)), l = new Set((i || []).flatMap((g) => g.tags || []).map((g) => Number(g.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((u = (c = (i || []).find((g) => Number(g.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : u.map((g) => Number(g.tagId))) || []);
  return Ys(e || [], o).filter((g) => {
    if (g.reviewState != null && !a.reviewStates.includes(g.reviewState) || s && !s.has(g.id) || a.tagId != null && Number(g.tagId) !== a.tagId || d && !d.has(Number(g.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(g.tagId)) || a.sourceKey != null && g.sourceKey !== a.sourceKey) return !1;
    const b = Number(g.confidence);
    return g.confidence == null || !Number.isFinite(b) ? a.includeUnscored : b >= a.confidenceMin && b <= a.confidenceMax;
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
    const g = o ? [.../* @__PURE__ */ new Set([...l, ...i])] : l;
    return {
      ...nl(g, s, t, u, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: g
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
        for (const g of [!1, !0]) {
          const b = {
            key: s,
            code: l,
            ctrlKey: d,
            metaKey: c,
            altKey: u,
            shiftKey: g
          };
          if (Zr(b, e) && Zr(b, t)) return !0;
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
function Ml(e, t) {
  return e === "segments" && !Tn(
    t,
    Jt.navigationSegmentInventory
  ) || e === "bin" && !Tn(
    t,
    Jt.recyclingBinView
  ) ? "videos" : e;
}
function Al(e) {
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
    var f;
    return !((f = h.genderHints) != null && f.length);
  }) && e.length === t.length && !i) {
    const h = [...e].sort((p, S) => String(p.slotDefinitionId).localeCompare(String(S.slotDefinitionId))), f = [...t].sort((p, S) => String(p.name).localeCompare(String(S.name)) || Number(ct(p)) - Number(ct(S)));
    return [{
      assignments: Object.fromEntries(h.map((p, S) => [String(p.slotDefinitionId), String(ct(f[S]))])),
      description: f.map((p) => p.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((h) => t.map((f, p) => ({ performer: f, index: p })).filter(({ performer: f }) => {
    var p;
    return !((p = h.genderHints) != null && p.length) || h.genderHints.some((S) => Qt(S) === Qt(f.gender || f.genderIdentity));
  }).map(({ index: f }) => f)), u = i ? c.filter((h) => h.length > 0).length : ca(c, t.length);
  if (u === 0) return [];
  const g = new Map(t.map((h, f) => [String(ct(h)), f]));
  function b(h, f, p) {
    if (s.length >= a) return;
    const S = c.slice(h), C = i ? S.filter((q) => q.length > 0).length : ca(S.map((q) => q.filter((F) => !f.has(String(ct(t[F]))))), t.length);
    if (p + C < u) return;
    if (h === e.length) {
      if (p !== u) return;
      const q = Object.fromEntries(d.map(({ slot: M, performer: T }) => [String(M.slotDefinitionId), T ? String(ct(T)) : ""])), F = o.length === 0 ? Object.values(q).sort().join(",") : [...new Set(e.map((M) => String(M.label || "")))].map((M) => `${M}:${d.filter(({ slot: T }) => String(T.label || "") === M).map(({ performer: T }) => T ? String(ct(T)) : "").sort().join(",")}`).join("|");
      !l.has(F) && s.length < a && (l.add(F), s.push({
        assignments: q,
        description: d.map(({ slot: M, performer: T }) => o.length ? `${M.label}: ${(T == null ? void 0 : T.name) || "Unassigned"}` : (T == null ? void 0 : T.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const m = e[h], B = [...d].reverse().find(({ slot: q }) => da(q) === da(m)), U = B ? g.get(String(ct(B.performer))) : -1;
    for (const q of c[h]) {
      const F = t[q], M = ct(F);
      if (!(q < U) && !(M == null || !i && f.has(String(M))) && (d.push({ slot: m, performer: F }), i || f.add(String(M)), b(h + 1, f, p + 1), i || f.delete(String(M)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: m, performer: null }), b(h + 1, f, p), d.pop();
  }
  return b(0, /* @__PURE__ */ new Set(), 0), s;
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
      const g = [...new Set(e.map((b) => b.label || ""))].map((b) => `${b}:${a.filter((h) => (h.slot.label || "") === b).map((h) => h.performer.performerId).sort((h, f) => h - f).join(",")}`).join("|");
      i.has(g) || i.set(g, [...a]);
      return;
    }
    const c = e[l];
    for (const g of t)
      !o && d.has(g.performerId) || (u = c.genderHints) != null && u.length && !c.genderHints.some((b) => Qt(b) === Qt(g.gender)) || (a.push({ slot: c, performer: g }), o || d.add(g.performerId), s(l + 1, d), o || d.delete(g.performerId), a.pop());
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
    const g = Qt(l.gender || l.genderIdentity), b = Qt(d.gender || d.genderIdentity), h = l.matchesGenderHint ?? a.has(g);
    return (d.matchesGenderHint ?? a.has(b)) - h || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: pe, useId: si, useLayoutEffect: ua, useMemo: Ve, useReducer: Ul, useRef: ue, useState: K, useSyncExternalStore: Hl } = oo, n = oo.createElement, li = "/api/plugins/segment-studio";
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
function Mt(e, { onCancel: t, onConfirm: r } = {}) {
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
      const g = r(u);
      c.has(g) || c.set(g, []), c.get(g).push(u);
    }
    return c;
  }, a = i(e), s = i(t), l = [];
  for (const [d, c] of a) {
    const u = s.get(d);
    if (!u || c.length !== u.length)
      continue;
    const g = [...c].sort(o), b = [...u].sort(o);
    g.forEach((h, f) => l.push({
      sourceSlotDefinitionId: h.id,
      derivedSlotDefinitionId: b[f].id
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
    const d = t.get(l.id) || [], u = d.length > 0 && d.every((g) => Number(g.performerId) > 0) ? d.map((g) => `${g.slotDefinitionId}:${Number(g.performerId)}`).join("|") : null;
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
        const c = pd(l.slots), u = l.slots.filter((p) => !a.has(String(p.slotDefinitionId))), g = o.length === 1 ? l.slots : u, b = g.map((p) => `${c.get(String(p.slotDefinitionId))} · ${p.performerName || `Performer ${p.performerId}`}`).join(" · "), h = [...new Map(g.map((p) => [
          Number(p.performerId),
          { id: Number(p.performerId), name: p.performerName || `Performer ${p.performerId}` }
        ])).values()], f = l.slots.map((p) => ({
          slotDefinitionId: String(p.slotDefinitionId),
          label: c.get(String(p.slotDefinitionId)),
          performer: {
            id: Number(p.performerId),
            name: p.performerName || `Performer ${p.performerId}`
          }
        }));
        s.set(d, {
          ...e,
          key: `${e.key}:performers:${d}`,
          performerLabel: b,
          performers: h,
          performerAssignments: f,
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
  const o = ue(null), i = `performer-slots-${si()}`, [a, s] = K(null);
  function l() {
    var h;
    const c = (h = o.current) == null ? void 0 : h.getBoundingClientRect();
    if (!c) return;
    const u = Math.max(0, Math.min(256, window.innerWidth - 16)), g = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), b = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - u - 8, c.right - u)),
      top: b >= g + 8 ? c.bottom + 4 : Math.max(8, c.top - g - 4),
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
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), u = Number.isFinite(c) && c >= d ? c : d, g = d <= o && u >= o, b = g ? 0 : Math.min(Math.abs(o - d), Math.abs(o - u));
    return { contains: g, distance: b, duration: u - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function no(e, t, r, o = null) {
  var u, g, b, h, f, p;
  const i = e.findIndex((S) => S.markers.some((C) => C.segment.id === t));
  if (i < 0) {
    const S = [...((u = e[0]) == null ? void 0 : u.markers) || []];
    return o != null && Number.isFinite(Number(o)) && S.sort((C, m) => ya(C, m, o)), ((g = S[0]) == null ? void 0 : g.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((S) => S.segment.id === t);
  if (r === "left" || r === "right") {
    const S = r === "left" ? -1 : 1, C = Math.min(a.markers.length - 1, Math.max(0, s + S));
    return ((b = a.markers[C]) == null ? void 0 : b.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((h = a.markers[s]) == null ? void 0 : h.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((f = a.markers[s]) == null ? void 0 : f.segment) ?? null : ((p = [...e[l].markers].sort(c ? (S, C) => ya(S, C, Number(o)) : (S, C) => Math.abs(S.segment.startSec - d) - Math.abs(C.segment.startSec - d) || S.segment.startSec - C.segment.startSec || S.segment.id - C.segment.id)[0]) == null ? void 0 : p.segment) ?? null;
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
    const g = Number(c);
    r.has(g) && !o.has(g) || (d[o.get(g) ?? c] = u);
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
async function Md(e, t) {
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
      for (const [g, b] of u.entries()) {
        Math.abs(r.currentTime - b) > 5e-4 && (r.currentTime = b, await ha(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const h = await Ad(o), f = `example-${l + 1}-frame-${g + 1}`;
        c.push({ fieldName: f, timestampSec: b }), s.push({
          fieldName: f,
          file: new File(
            [h],
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
function Ad(e) {
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
  let g = xa;
  const b = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set();
  let f = [];
  function p() {
    g = o == null && i.length === 0 && a == null ? xa : Object.freeze({
      running: o ? gr(o) : null,
      queued: Object.freeze(i.map(gr)),
      lastFailure: a
    });
    for (const k of [...h]) k();
    if (o == null && i.length === 0) {
      const k = f;
      f = [];
      for (const A of k) A();
    }
  }
  function S(k, A) {
    b.set(k.id, A.status), k.resolve(A);
  }
  function C(k) {
    if (k.dependsOn == null) return "met";
    const A = b.get(k.dependsOn);
    return A === "fulfilled" ? "met" : A != null ? "failed" : "pending";
  }
  function m(k) {
    o = k;
    const A = { ...e(), taskId: k.id, targets: k.targets };
    A.resolveTargets = () => k.targets.map((L) => ki(A.segments, L)).filter(Boolean), p();
    let G;
    try {
      G = k.run(A);
    } catch (L) {
      G = Promise.reject(L);
    }
    Promise.resolve(G).then(
      (L) => B(k, { status: "fulfilled", value: L }),
      (L) => B(k, { status: "rejected", error: L })
    );
  }
  function B(k, A) {
    k.settled || (k.settled = !0, S(k, A), !s && (o = null, A.status === "rejected" && (a = Object.freeze({ id: k.id, kind: k.kind, error: A.error })), p(), l += 1, t && U()));
  }
  function U() {
    if (s || o != null || c()) return;
    let k = !1;
    for (let A = 0; A < i.length; A += 1) {
      const G = i[A], L = C(G);
      if (L === "failed") {
        i = i.filter((R) => R !== G), S(G, { status: "dropped", reason: "dependency-failed" }), k = !0, A -= 1;
        continue;
      }
      if (L !== "pending" && !(G.exclusive && A > 0) && !i.slice(0, A).some((R) => bo(R.targets, G.targets)) && !(G.ready && !G.ready(e(), gr(G)))) {
        i = i.filter((R) => R !== G), m(G);
        return;
      }
    }
    k && p();
  }
  function q(k) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((H) => H.exclusive) || o != null && k.whenBusy !== "enqueue" || k.exclusive && (o != null || i.length > 0 || c())) return null;
    let G;
    const L = new Promise((H) => {
      G = H;
    }), R = {
      id: r++,
      kind: k.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: k.lockId ?? -1,
      targets: Object.freeze((k.targets || []).map(M)),
      exclusive: k.exclusive === !0,
      dependsOn: k.dependsOn ?? null,
      ready: k.ready || null,
      meta: k.meta ?? null,
      run: k.run,
      resolve: G
    };
    return i = [...i, R], p(), U(), { id: R.id, done: L };
  }
  function F(k = {}) {
    let A = null;
    const G = q({
      ...k,
      whenBusy: "reject",
      run: () => new Promise((R) => {
        A = R;
      })
    });
    if (!G) return null;
    if (A == null)
      return w((R) => R.id === G.id), null;
    let L = !1;
    return () => {
      L || (L = !0, A(), (o == null ? void 0 : o.id) === G.id && B(o, { status: "fulfilled", value: void 0 }));
    };
  }
  function M(k) {
    return (k == null ? void 0 : k.id) == null || k.itemId != null || k.nativeSegmentId != null ? k : u.get(k.id) || k;
  }
  function T(k, A) {
    u.set(k, { ...A });
    let G = !1;
    for (const L of i)
      L.targets.some((R) => R.id === k && R.itemId == null && R.nativeSegmentId == null) && (L.targets = Object.freeze(L.targets.map((R) => R.id === k ? { ...A } : R)), G = !0);
    return G && p(), G;
  }
  function w(k) {
    const A = i.filter((G) => k(gr(G)));
    if (A.length === 0) return 0;
    i = i.filter((G) => !A.includes(G));
    for (const G of A) S(G, { status: "cancelled" });
    return p(), U(), A.length;
  }
  return {
    enqueue: q,
    acquire: F,
    cancel: w,
    retarget: T,
    stableIdentity: M,
    // The host reads `settledCount()` while rendering and reports it here once that render commits.
    settledCount: () => l,
    markCommitted(k = l) {
      d = Math.max(d, k);
    },
    poke: () => U(),
    subscribe(k) {
      return h.add(k), () => h.delete(k);
    },
    getSnapshot: () => g,
    whenIdle() {
      return o == null && i.length === 0 ? Promise.resolve() : new Promise((k) => f.push(k));
    },
    dispose() {
      if (s) return;
      const k = i;
      i = [], s = !0;
      for (const G of k) S(G, { status: "cancelled" });
      h.clear();
      const A = f;
      f = [];
      for (const G of A) G();
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
  const { acquireSaveLock: t, compatibilityMode: r, dispatchPendingChanges: o, enqueueSave: i, pendingChanges: a, retargetSaveTasks: s, currentTime: l, detail: d, editorFilters: c, endInput: u, hideDerivedSegments: g, historyRef: b, mediaDuration: h, onConflict: f, onDetailChange: p, onReload: S, optimisticSegmentIdRef: C, pendingDuplicateRef: m, pendingFirstSegmentStartSecRef: B, pendingTagEditSegmentIdRef: U, performerSlots: q, replaceSegmentSelection: F, savingSegmentId: M, segments: T, selectedSegment: w, selectedSegmentIdRef: k, selectedSegments: A, selectionAnchorIdRef: G, selectionRangeBaseIdsRef: L, setCreatingSegmentId: R, setEditorFilters: H, setFirstSegmentTagOpen: J, setHideDerivedSegments: _, setHistory: oe, setHistoryOpen: ce, setPublishApprovedError: be, setSaveMessage: E, setSelectedSegmentGroupKey: ae, setSelectedSegmentId: le, setSelectedSegmentIds: X, setTagEditing: de, startInput: xe, tagEditingRef: Ce, timelineDuration: Pe, video: fe } = e;
  function Y(j) {
    b.current = j || Vt, oe(b.current);
  }
  async function ye(j, re, N, W, O = null) {
    var Q;
    try {
      const he = await Z(`/videos/${fe.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: b.current.revision,
          kind: j,
          label: re,
          beforeState: N,
          afterState: W,
          receiptId: O
        })
      });
      return Y(he), !0;
    } catch (he) {
      return he.status === 409 && ((Q = he.payload) != null && Q.current) && Y(he.payload.current), E("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function I(j, re, N = !0, W = null, O = !1, Q = re, he = !0) {
    if (!j || M != null) return null;
    const me = t("segment", j.id);
    if (!me) return null;
    try {
      return await ee(j, re, {
        recordHistory: N,
        historyLabel: W,
        optimisticValues: O ? Q : null,
        restoreSelectionOnFailure: he
      });
    } finally {
      me();
    }
  }
  async function ee(j, re, {
    recordHistory: N = !0,
    historyLabel: W = null,
    optimisticValues: O = null,
    pendingChangeId: Q = null,
    restoreSelectionOnFailure: he = !0,
    onReload: me = S,
    onConflict: Te = f
  } = {}) {
    var gt;
    const mt = A.map((et) => et.id), je = k.current, Re = N && !r ? crypto.randomUUID() : null;
    E(N ? "Saving directly to Cove…" : "Restoring history…");
    const Ze = Q ?? (O ? _t() : null);
    O && !Q && o({
      type: "add",
      entry: { id: Ze, op: "patch", targets: [Tt(j)], values: O }
    });
    const it = (et) => {
      Ze && o({ type: "confirm", key: Ze, applied: et });
    };
    try {
      if (r && j.nativeSegmentId == null && j.itemId != null) {
        const st = `draft-update:${fe.id}:${j.itemId}:${j.revision}:${re.tagId}:${re.startSec}:${re.endSec ?? "open"}:${re.reviewState ?? j.reviewState}`, ze = await Z(`/videos/${fe.id}/drafts/${j.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(st),
            expectedRevision: j.revision,
            startSec: re.startSec,
            endSec: re.endSec,
            tagId: re.tagId,
            reviewState: re.reviewState
          })
        });
        qe(st), ze.performerSlots != null && p((Ye) => Yt(Ye, j.id, ze.performerSlots, ze.performerSlotRevision), fe.id);
        const Je = {
          ...j,
          ...ze.draft,
          id: j.id,
          itemId: j.itemId
        };
        return N && await ye(
          "segment.update",
          W || "Changed segment",
          ur(j, r),
          ur(
            Je,
            r
          )
        ), Sa(j, re, r) ? it(await me() != null) : (p((Ye) => ({
          ...Ye,
          approvedSetVersion: ze.approvedSetVersion || Ye.approvedSetVersion,
          segments: (Ye.segments || []).map((We) => We.id === j.id ? Je : We).sort((We, ut) => We.startSec - ut.startSec || We.id - ut.id)
        }), fe.id), it(!0)), E(((gt = ze.draft) == null ? void 0 : gt.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), Je;
      }
      const et = await Z(`/videos/${fe.id}/segments/${j.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...re,
          expectedUpdatedAt: j.updatedAt,
          historyReceiptId: Re
        })
      }), ft = {
        ...j,
        ...et,
        reviewState: re.reviewState ?? j.reviewState
      };
      return Sa(j, re, r) ? it(await me() != null) : (p((st) => ({
        ...st,
        segments: (st.segments || []).map((ze) => ze.id === j.id ? ft : ze).sort((ze, Je) => ze.startSec - Je.startSec || ze.id - Je.id)
      }), fe.id), it(!0)), N && await ye(
        "segment.update",
        W || "Changed segment",
        ur(j, r),
        ur(
          ft,
          r
        ),
        Re
      ), E(N ? "Saved to Cove" : "History restored"), ft;
    } catch (et) {
      return Ze && o({ type: "discard", key: Ze }), Ze && he && (X(mt), le(je), G.current = je, L.current = []), et.status === 409 ? (E("Conflict — loading the latest segment…"), await Te()) : E(et.message || "Unable to save the segment."), null;
    }
  }
  async function $() {
    if (!r) return !1;
    const j = T.filter((W) => !W.published && W.reviewState === "approved").length;
    if (j === 0 || M != null) return !1;
    const re = `complete-review:${fe.id}:${d.approvedSetVersion}`, N = t("publish", -1);
    if (!N) return !1;
    be(""), E(`Publishing ${j} Approved draft${j === 1 ? "" : "s"}…`);
    try {
      const W = await Z(`/videos/${fe.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(re),
          expectedApprovedSetVersion: d.approvedSetVersion
        })
      });
      qe(re), Y(Vt), ce(!1);
      const O = await S(), Q = Nl(
        T,
        k.current,
        W.published
      ), he = Q ? ot(O == null ? void 0 : O.segments, Q) : null;
      return he && le(he.id), E(`${W.published.length} Approved draft${W.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (W) {
      const O = W.status === 409 ? "The approved drafts changed. Review the updated list and try again." : W.message || "Unable to publish the approved drafts.";
      return W.status === 409 && await f(), be(O), E(O), !1;
    } finally {
      N();
    }
  }
  async function v(j = null, re = null) {
    if (M != null || y()) return;
    const N = j != null ? B.current : null, W = Number.isFinite(N) ? N : l, O = Math.min(Pe, W + 20);
    if (O <= W) {
      E("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const Q = xl(T, w, j);
    if (Q.kind === "choose-tag") {
      B.current = W, E(""), J(!0);
      return;
    }
    if (Q.kind === "invalid-selection") {
      E("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: he } = Q, me = `create-draft:${fe.id}:${he}:${W}`, Te = r ? null : crypto.randomUUID(), mt = k.current, je = {
      ...w || {},
      id: C.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: he,
      tagName: re || (w == null ? void 0 : w.tagName) || "Tag segment",
      tagSortName: he === (w == null ? void 0 : w.tagId) && (w == null ? void 0 : w.tagSortName) || null,
      startSec: W,
      endSec: O,
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
      o({ type: "add", entry: { id: st, taskId: ft, op: "insert", segment: je } }), J(!1), Q.openTagEditor && (R(je.id), U.current = je.id, de(!0)), F(je.id), ae(Ze);
      try {
        let Je;
        if (r) {
          const ut = await Z(`/videos/${fe.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: _e(me), tagId: he, startSec: W, endSec: O })
          });
          qe(me), Je = { itemId: (ze = ut.draft) == null ? void 0 : ze.itemId }, ut.performerSlots != null && p((yt) => Yt(yt, je.id, ut.performerSlots, ut.performerSlotRevision), fe.id);
        } else
          Je = { nativeSegmentId: (await Z(`/videos/${fe.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: he,
              startSec: W,
              endSec: O,
              historyReceiptId: Te
            })
          })).id };
        B.current = null, J(!1);
        const Ye = await et();
        if (o({ type: "discard", key: st }), !Ye) {
          p((ut) => Yt(ut, je.id, []), fe.id), F(mt), E(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${Q.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const We = ot(Ye == null ? void 0 : Ye.segments, Je);
        We ? (o({ type: "retarget", temporaryId: je.id, identity: Tt(We) }), s(je.id, Tt(We)), Q.openTagEditor && (Ce.current && (U.current = We.id), R(We.id)), F(We.id), ae(Ft(
          an(Ye.segments || [], Ye.segmentGroups || [], Ye.performerSlots || []),
          We.id
        )), r || await ye(
          "segment.create",
          "Created segment",
          Dt([], !1),
          Dt([We], !1),
          Te
        )) : (de(!1), E(`Segment created, but it could not be selected${Q.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (Je) {
        throw o({ type: "discard", key: st }), F(mt), j != null && J(!0), E(Je.message || "Unable to create the draft."), Je;
      } finally {
        R(null);
      }
    }
  }
  function y() {
    return Ni(a, w) ? (E("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function x() {
    if (A.length !== 1 || !w || M != null || y()) return;
    const j = l;
    if (j <= w.startSec || w.endSec != null && j >= w.endSec) {
      E("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const re = `split-draft:${w.itemId}:${w.revision}:${j}`, N = r ? null : Dt([w], !1), W = r ? null : crypto.randomUUID(), O = t("split", w.id);
    if (O)
      try {
        let Q = null;
        r && w.nativeSegmentId == null ? (await Z(`/videos/${fe.id}/drafts/${w.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(re),
            expectedRevision: w.revision,
            splitSec: j
          })
        }), qe(re)) : Q = { nativeSegmentId: (await Z(`/videos/${fe.id}/segments/${w.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: w.updatedAt,
            splitSec: j,
            historyReceiptId: W
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
          await ye(
            "segment.split",
            "Split segment",
            N,
            Dt(me, !1),
            W
          );
        }
        E(r ? `Segment split; both ranges remain ${w.reviewState}.` : "Segment split.");
      } catch (Q) {
        Q.status === 409 ? await f() : E(Q.message || "Unable to split the draft.");
      } finally {
        O();
      }
  }
  async function D(j = !1) {
    if (A.length !== 1 || !w || M != null || y()) return;
    const re = j ? l : w.startSec, N = vl(fe.id, w, j, re), W = r ? null : crypto.randomUUID(), O = w, Q = k.current, he = O.endSec == null ? null : O.endSec - O.startSec, me = {
      ...O,
      id: C.current--,
      itemId: null,
      nativeSegmentId: null,
      startSec: re,
      endSec: he == null ? null : re + he,
      // Full mode creates the copy already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : O.reviewState,
      revision: 0,
      updatedAt: null
    }, Te = (q || []).filter((Re) => Re.segmentId === O.id), mt = i({
      kind: "duplicate",
      lockId: -1,
      targets: [Tt(O)],
      run: (Re) => je(Re)
    });
    if (!mt) return;
    await mt.done;
    async function je({ onReload: Re, onConflict: Ze, taskId: it }) {
      var ft, st;
      const gt = _t();
      o({ type: "add", entry: { id: gt, taskId: it, op: "insert", segment: me } }), Te.length > 0 && p((ze) => Yt(ze, me.id, Te), fe.id), j || (R(me.id), U.current = me.id, de(!0)), F(me.id);
      const et = () => {
        o({ type: "discard", key: gt }), Te.length > 0 && p((ze) => Yt(ze, me.id, []), fe.id);
      };
      try {
        const ze = ((ft = m.current) == null ? void 0 : ft.operationKey) === N ? m.current : null;
        let Je = (ze == null ? void 0 : ze.duplicateIdentity) ?? null;
        if (Je == null && r && O.nativeSegmentId == null) {
          const yt = await Z(`/videos/${fe.id}/drafts/${O.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(N),
              expectedRevision: O.revision,
              startSec: j ? re : null
            })
          });
          Je = na(!1, yt), m.current = { operationKey: N, duplicateIdentity: Je };
        } else if (Je == null) {
          const yt = await Z(`/videos/${fe.id}/segments/${O.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: O.updatedAt,
              startSec: j ? re : null,
              historyReceiptId: W
            })
          });
          Je = na(!0, yt), m.current = { operationKey: N, duplicateIdentity: Je };
        }
        const Ye = await Re();
        et();
        const We = ot(Ye == null ? void 0 : Ye.segments, Je);
        if (!We) {
          de(!1), F(Q), E(Ye ? "Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection." : "Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.");
          return;
        }
        o({ type: "retarget", temporaryId: me.id, identity: Tt(We) }), s(me.id, Tt(We));
        const ut = Ya(
          We,
          Ye.performerSlots || [],
          c,
          g,
          Ye.segmentGroups || []
        );
        H(ut.filters), _(ut.hideDerivedSegments), !j && Ce.current && (U.current = We.id), F(We.id), ae(Ft(
          an(Ye.segments || [], Ye.segmentGroups || [], Ye.performerSlots || []),
          We.id
        )), r && O.nativeSegmentId == null && qe(N), m.current = null, E(j ? "Duplicate created at the playhead." : "Duplicate created in place."), r || await ye(
          "segment.duplicate",
          "Duplicated segment",
          Dt([], !1),
          Dt([We], !1),
          W
        );
      } catch (ze) {
        throw et(), de(!1), F(Q), ((st = m.current) == null ? void 0 : st.operationKey) === N ? E("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : ze.status === 409 ? await Ze() : E(ze.message || "Unable to duplicate the draft."), ze;
      } finally {
        R(null);
      }
    }
  }
  async function ne() {
    if (A.length !== 1 || !w) return;
    const j = Number(xe), re = u.trim() === "" ? null : Number(u), N = Wo(j, re, h);
    if (N.error) {
      E(N.error);
      return;
    }
    if (j === w.startSec && re === w.endSec) {
      E("Timing is unchanged.");
      return;
    }
    await I(w, { startSec: j, endSec: re, tagId: w.tagId }, !0, null, !0);
  }
  async function te(j, re) {
    if (A.length !== 1 || !w) return;
    const N = Wo(j, re, h);
    if (N.error) {
      E(N.error);
      return;
    }
    if (j === w.startSec && re === w.endSec) {
      E("Timing is unchanged.");
      return;
    }
    await I(w, { startSec: j, endSec: re, tagId: w.tagId }, !0, null, !0);
  }
  return { acceptHistory: Y, recordHistoryAction: ye, mutateSegment: I, runSegmentMutation: ee, completeReview: $, createSegment: v, splitSegment: x, duplicateSegment: D, saveTiming: ne, applyShortcutTiming: te };
}
function _d() {
  const [e, t] = K(() => typeof window < "u" && window.matchMedia(Ho).matches);
  return pe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Ho), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function qd() {
  const [e, t] = K(() => typeof window < "u" && window.matchMedia(_o).matches);
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
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: u, shortcutRef: g }) {
  const b = co(a), [h, f] = K(() => Wr(o, b)), [p, S] = K(!1), [C, m] = K(""), B = ue(!1), U = o.map((k) => `${k.slotDefinitionId}:${k.performerId || ""}`).join("|"), q = b.map((k) => ct(k)).join("|"), F = ai(
    o,
    b
  );
  pe(() => {
    f(Wr(o, b)), m("");
  }, [t, r, U, q]);
  async function M(k = h) {
    if (!B.current) {
      B.current = !0, S(!0), m("Saving performer slots…");
      try {
        const A = Wr(o.map((R) => ({
          ...R,
          performerId: k[R.slotDefinitionId] || null
        })), b), G = o.map((R) => {
          const H = A[R.slotDefinitionId] ? Number(A[R.slotDefinitionId]) : null, J = b.find((_) => String(ct(_)) === String(H));
          return {
            ...R,
            performerId: H,
            performerName: (J == null ? void 0 : J.name) || null
          };
        });
        if (s(G) === !1) {
          m("");
          return;
        }
        const L = await Z(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((R) => ({ slotDefinitionId: R.slotDefinitionId, performerId: A[R.slotDefinitionId] ? Number(A[R.slotDefinitionId]) : null }))
          })
        });
        m("Performer slots saved."), await l(L, {
          beforeState: wr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: wr([{
            segmentId: t,
            itemId: r,
            revision: L.revision,
            slots: L.slots || []
          }])
        });
      } catch (A) {
        d && await d(o, A), A.status === 409 ? (m("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : m(A.message || "Unable to save performer slots.");
      } finally {
        B.current = !1, S(!1);
      }
    }
  }
  function T(k, A) {
    m(`Option ${A + 1} applied; save to confirm.`), f({ ...h, ...k.assignments });
  }
  async function w(k) {
    const A = { ...h, ...k.assignments };
    f(A), await M(A);
  }
  return pe(() => {
    if (g)
      return g.current = (k) => B.current || !F[k] ? !1 : (w(F[k]), !0), () => {
        g.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    F.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, F.map((k, A) => n("button", {
        key: A,
        type: "button",
        disabled: p,
        onClick: () => T(k, A),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${A + 1}: ${k.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, A + 1),
        n("span", { key: "description" }, k.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${F.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((k) => n("label", { key: k.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Ct(k)),
      (k.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(k.genderHints || []).map(Cr).join(" · ")}`) : null,
      n("select", { key: "select", value: h[k.slotDefinitionId] || "", disabled: p, onChange: (A) => f({ ...h, [k.slotDefinitionId]: A.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ii(b, b, k.genderHints).map((A) => n("option", { key: ct(A), value: ct(A) }, A.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: u, type: "button", disabled: p, onClick: () => M(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, C)])
  ]);
}
function tc({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a, acquireSaveLock: s = () => () => {
} }) {
  var M;
  const l = ((M = t[0]) == null ? void 0 : M.slots) || [], d = co(r), c = ai(
    l,
    d
  ), u = "__mixed__", g = () => Object.fromEntries(l.map((T, w) => {
    const k = t.map((A) => {
      var G;
      return String(((G = A.slots[w]) == null ? void 0 : G.performerId) || "");
    });
    return [T.slotDefinitionId, k.every((A) => A === k[0]) ? k[0] : u];
  })), [b, h] = K(g), [f, p] = K(!1), [S, C] = K(""), m = ue(!1), B = t.map((T) => `${T.itemId ?? `native:${T.segmentId}`}:${T.revision}:${T.slots.map((w) => `${w.slotDefinitionId}:${w.performerId || ""}`).join(",")}`).join("|");
  pe(() => {
    h(g());
  }, [B]);
  async function U(T = b) {
    if (m.current) return;
    const w = s();
    if (!w) {
      C("Wait for the current save to finish before saving performer slots.");
      return;
    }
    m.current = !0, p(!0), C(`Saving performer slots for ${t.length} segments…`);
    const k = [];
    try {
      for (const A of t) {
        const G = A.slots.map((R, H) => {
          const J = T[l[H].slotDefinitionId];
          return {
            slotDefinitionId: R.slotDefinitionId,
            performerId: J === u ? R.performerId || null : J ? Number(J) : null
          };
        }), L = await Z(A.itemId != null ? `/videos/${e}/drafts/${A.itemId}/slots` : `/videos/${e}/segments/${A.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: A.revision, assignments: G })
        });
        k.push({
          segmentId: A.segmentId,
          itemId: A.itemId,
          revision: L.revision,
          slots: L.slots || []
        });
      }
      C("Performer slots saved."), await o({
        beforeState: wr(t),
        afterState: wr(k)
      });
    } catch (A) {
      const G = await i();
      A.status === 409 ? C(G ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : C(A.message || (G ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      m.current = !1, p(!1), w();
    }
  }
  function q(T, w) {
    C(`Option ${w + 1} applied; save to confirm.`), h({ ...b, ...T.assignments });
  }
  async function F(T) {
    const w = { ...b, ...T.assignments };
    h(w), await U(w);
  }
  return pe(() => {
    if (a)
      return a.current = (T) => m.current || !c[T] ? !1 : (F(c[T]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, c.map((T, w) => n("button", {
        key: w,
        type: "button",
        disabled: f,
        onClick: () => q(T, w),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${w + 1} to all selected segments: ${T.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, w + 1),
        n("span", { key: "description" }, T.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${c.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, l.map((T) => n("label", {
      key: T.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Ct(T)),
      n("select", {
        key: "select",
        value: b[T.slotDefinitionId] || "",
        disabled: f,
        onChange: (w) => h({ ...b, [T.slotDefinitionId]: w.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        b[T.slotDefinitionId] === u ? n("option", { key: "mixed", value: u }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ii(d, d, T.genderHints).map((w) => n("option", {
          key: ct(w),
          value: ct(w)
        }, w.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: f,
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
  const [r, o] = K(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = nc(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
  return n("section", { "aria-label": "Segment provenance", className: "rounded-md border border-border bg-surface" }, [
    n("button", {
      key: "toggle",
      type: "button",
      onClick: () => o((g) => !g),
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
      ) : s.map((g) => {
        const b = g.modelIdentifier || g.modelKey, h = g.value == null ? null : typeof g.value == "string" ? g.value : JSON.stringify(g.value);
        return n("div", { key: g.id || `${g.fieldKey}:${g.sourceKey}:${g.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            Gt(g.sourceKey, g.sourceDisplayName)
          ),
          g.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${g.fieldKey}${h == null ? "" : ` · ${h}`}`
          ) : null,
          g.relation === "inherited" ? n("div", { key: "relation", className: "text-secondary" }, "Inherited origin") : null,
          b ? n(
            "div",
            { key: "model", className: "text-secondary" },
            `Model ${b}${g.modelVersion ? ` · ${g.modelVersion}` : ""}`
          ) : null,
          g.activityExternalRunId || g.sourceRunId ? n("div", { key: "run", className: "break-all text-secondary" }, `Run ${g.activityExternalRunId || g.sourceRunId}`) : null,
          g.confidence != null ? n(
            "div",
            { key: "confidence", className: "text-secondary" },
            `Confidence ${Math.round(g.confidence * 100)}%`
          ) : null,
          g.recordedAt || g.createdAt ? n("div", { key: "recorded", className: "text-secondary" }, `Recorded ${g.recordedAt || g.createdAt}`) : null
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
  const [g, b] = K([]), h = e.flatMap((C) => C.lanes.map((m) => m.key)), f = h.join("|");
  pe(() => {
    const C = new Set(h);
    b((m) => m.filter((B) => C.has(B)));
  }, [f]);
  const p = Nr(t), S = !!vi(
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
      a ? n(Zt, { key: "counts", counts: p }) : null
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
    ...e.map((C) => n("section", {
      key: C.key,
      "data-selected-segment-group": C.key,
      className: "space-y-1.5"
    }, [
      n("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        n("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, C.name),
        n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${C.selectedCount} selected`)
      ]),
      ...C.lanes.map((m) => {
        const B = g.includes(m.key), U = m.markers.some(({ segment: F }) => F.id === r), q = `selected-segment-lane-${m.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: m.key,
          "data-selected-segment-lane": m.key,
          className: `rounded-md border ${U ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": B,
            "aria-controls": q,
            "aria-current": U ? "true" : void 0,
            onClick: () => b((F) => B ? F.filter((M) => M !== m.key) : [...F, m.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, B ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Jn(m)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(m.selectedCount)),
            a ? n(Zt, { key: "states", counts: m.counts }) : null
          ]),
          B ? n("div", {
            key: "segments",
            id: q,
            className: "space-y-1 border-t border-border p-1.5"
          }, m.markers.map(({ segment: F }) => {
            const M = F.endSec == null ? Ee(F.startSec) : `${Ee(F.startSec)} – ${Ee(F.endSec)}`;
            return n("button", {
              key: F.id,
              type: "button",
              onClick: () => i(F),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${F.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${F.tagName || "Segment"}, ${F.reviewState}, ${M}` : `${F.tagName || "Segment"}, ${M}`,
              "aria-current": F.id === r ? "true" : void 0
            }, [
              a ? n(ln, {
                key: "state",
                state: F.reviewState,
                includeLabel: !1
              }) : null,
              F.isDerived ? n(Tr, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, M),
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
  var g, b, h;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (g = t.hasSegmentsCriterion) == null ? void 0 : g.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), fr(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), fr(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), fr(o, t.performersCriterion, "performer"), fr(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = Ia(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = Ia(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((b = t.reviewStateCriterion) == null ? void 0 : b.value) ?? t.reviewState;
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
function Mi({ item: e, showReviewStates: t = !1 }) {
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
      n(Ai, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, Is(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(Mi, { item: e, showReviewStates: r }))
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
        n(Mi, { key: "segments", item: e, showReviewStates: r })
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
  const [r, o] = K(null);
  pe(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const u = await Z("/bin"), g = Number(u == null ? void 0 : u.totalCount);
        !a && c === s && o(Number.isFinite(g) && g >= 0 ? Math.trunc(g) : null);
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
  const o = ue(null), [i, a] = K("maximum"), s = (b, h) => {
    const f = Xs(e, t, b, h);
    a(f.coincidentTop), r({ minimum: f.minimum, maximum: f.maximum });
  }, l = (b, h) => {
    var p;
    const f = (p = o.current) == null ? void 0 : p.getBoundingClientRect();
    f && s(b, Zs(h.clientX, f.left, f.width));
  }, d = (b, h) => {
    var f, p;
    h.preventDefault(), (p = (f = h.currentTarget).setPointerCapture) == null || p.call(f, h.pointerId), l(b, h);
  }, c = (b, h) => {
    var f, p;
    (p = (f = h.currentTarget).hasPointerCapture) != null && p.call(f, h.pointerId) && l(b, h);
  }, u = (b, h) => {
    const f = b === "minimum" ? e : t, p = b === "minimum" ? 0 : e, S = b === "minimum" ? t : 1, C = h.shiftKey ? 0.1 : 0.01;
    let m = null;
    ["ArrowLeft", "ArrowDown"].includes(h.key) && (m = f - C), ["ArrowRight", "ArrowUp"].includes(h.key) && (m = f + C), h.key === "PageDown" && (m = f - 0.1), h.key === "PageUp" && (m = f + 0.1), h.key === "Home" && (m = p), h.key === "End" && (m = S), m != null && (h.preventDefault(), s(b, Math.min(S, Math.max(p, m))));
  }, g = (b, h) => n("span", {
    key: b,
    role: "slider",
    tabIndex: 0,
    "aria-label": b === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((b === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((b === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(h * 100),
    "aria-valuetext": `${Math.round(h * 100)} percent`,
    onPointerDown: (f) => d(b, f),
    onPointerMove: (f) => c(b, f),
    onKeyDown: (f) => u(b, f),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${h * 100}%`,
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
        g("minimum", e),
        g("maximum", t)
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
    onKeyDownCapture: (s) => Mt(s, { onCancel: a })
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
  const g = Ot(e), b = [...new Map((a || []).map((m) => [
    Number(m.tagId),
    m.tagName || `Tag ${m.tagId}`
  ])).entries()].sort((m, B) => m[1].localeCompare(B[1]) || m[0] - B[0]), h = new Set((a || []).map((m) => Number(m.tagId))), f = (s || []).filter((m) => Number(m.id) === g.segmentGroupId || (m.tags || []).some((B) => h.has(Number(B.tagId)))), p = (m) => d(Ot({ ...g, ...m })), S = (m) => p({
    reviewStates: g.reviewStates.includes(m) ? g.reviewStates.filter((B) => B !== m) : [...g.reviewStates, m]
  }), C = (m) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${m ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && u();
    },
    onKeyDownCapture: (m) => Mt(m, { onCancel: u })
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
        n("div", { className: "flex flex-wrap gap-2" }, It.map((m) => {
          const B = g.reviewStates.includes(m), U = Bt[m];
          return n("button", {
            key: m,
            type: "button",
            onClick: () => S(m),
            "aria-pressed": B,
            className: C(B)
          }, `${U.symbol} ${m} (${i[m] || 0})`);
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
            "aria-pressed": g.performerId == null,
            className: C(g.performerId == null)
          }, "All performers"),
          ...r.map((m) => {
            const B = Number(ct(m));
            return n("button", {
              key: B,
              type: "button",
              onClick: () => p({ performerId: B }),
              "aria-pressed": g.performerId === B,
              className: C(g.performerId === B)
            }, m.name);
          })
        ])
      ]) : null,
      n("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        n("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Tag"),
          n("select", {
            key: "select",
            value: g.tagId ?? "",
            onChange: (m) => p({
              tagId: m.target.value === "" ? null : Number(m.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...b.map(([m, B]) => n("option", { key: m, value: m }, B))
          ])
        ]),
        n("label", {
          key: "segment-group",
          className: "space-y-1 text-xs text-secondary"
        }, [
          n("span", { key: "label" }, "Segment group"),
          n("select", {
            key: "select",
            value: g.segmentGroupId ?? "",
            onChange: (m) => p({
              segmentGroupId: m.target.value === "" ? null : m.target.value === "ungrouped" ? "ungrouped" : Number(m.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All Segment groups"),
            ...f.map((m) => n("option", { key: m.id, value: m.id }, m.name)),
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
            "aria-pressed": g.sourceKey == null,
            className: C(g.sourceKey == null)
          }, "All provenance"),
          ...o.map((m) => n("button", {
            key: m,
            type: "button",
            onClick: () => p({ sourceKey: m }),
            "aria-pressed": g.sourceKey === m,
            title: m,
            className: C(g.sourceKey === m)
          }, Gt(m)))
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
          minimum: g.confidenceMin,
          maximum: g.confidenceMax,
          onChange: ({ minimum: m, maximum: B }) => p({
            confidenceMin: m,
            confidenceMax: B
          })
        }),
        n("label", {
          key: "unscored",
          className: "flex items-center gap-2 text-xs text-secondary"
        }, [
          n("input", {
            key: "input",
            type: "checkbox",
            checked: g.includeUnscored,
            onChange: (m) => p({
              includeUnscored: m.target.checked
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
          onChange: (m) => c(m.target.checked),
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
      var g, b, h;
      if (d.key !== "Escape" || d.defaultPrevented || document.querySelector("[role='dialog'], [aria-modal='true']")) return;
      const c = document.activeElement, u = c instanceof Element && (((g = a.current) == null ? void 0 : g.contains(c)) || ((b = r == null ? void 0 : r.current) == null ? void 0 : b.contains(c)));
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
        (t[u.id] ? t[u.id].length > 0 ? t[u.id] : ["Unassigned"] : u.bindings.map(Xa)).map((g, b) => n("kbd", { key: `${u.id}:${b}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, g))
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
    onKeyDownCapture: (l) => Mt(l, { onCancel: r })
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
  const s = Rd(e), [l, d] = K([]), c = s.map((u) => u.tagName).join("|");
  return pe(() => {
    const u = new Set(s.map((g) => g.tagName));
    d((g) => g.filter((b) => u.has(b)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (u) => Mt(u, {
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
      n("div", { key: "items", className: "space-y-3" }, e.length ? s.map((u, g) => {
        const b = l.includes(u.tagName), h = `incorrect-example-tag-${g}`;
        return n("section", {
          key: u.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": b,
            "aria-controls": h,
            onClick: () => d((f) => b ? f.filter((p) => p !== u.tagName) : [...f, u.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: Ir(!1) }
          }, [
            n(
              "span",
              { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" },
              b ? "▾" : "▸"
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
          b ? n("div", {
            key: "examples",
            id: h,
            className: "divide-y divide-border border-t border-border"
          }, u.examples.map((f) => {
            const p = `${Ee(f.startSec)}${f.endSec == null ? "" : ` – ${Ee(f.endSec)}`}`, S = r === f.id;
            return n("div", {
              key: f.id,
              className: "flex items-center justify-between gap-3 px-3 py-2 text-sm"
            }, [
              n(
                "span",
                { key: "time", className: "font-mono text-xs text-secondary" },
                p
              ),
              n("button", {
                key: "remove",
                type: "button",
                disabled: t || r != null,
                onClick: () => i(f),
                "aria-label": `${S ? "Restoring" : "Restore to review"} ${u.tagName} example at ${p}`,
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
  const [o, i] = K(""), [a, s] = K(0), l = ue(null), d = Ve(() => Gl(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), u = zl(d);
  pe(() => {
    var b;
    (b = l.current) == null || b.scrollIntoView({ block: "nearest" });
  }, [c, o]);
  const g = () => {
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
      var h;
      if (b.key === "Tab")
        qt(b);
      else if (b.key === "Escape")
        b.preventDefault(), b.stopPropagation(), r();
      else if (b.key === "ArrowDown" || b.key === "ArrowUp") {
        b.preventDefault(), b.stopPropagation();
        const f = b.key === "ArrowDown" ? 1 : -1;
        s((p) => d.length ? (p + f + d.length) % d.length : 0);
      } else b.key === "Enter" && !((h = b.nativeEvent) != null && h.isComposing) && (b.preventDefault(), b.stopPropagation(), g());
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
    }, d.length ? d.flatMap((b, h) => {
      var q;
      const f = b.segment || b, p = f.endSec == null ? Ee(f.startSec) : `${Ee(f.startSec)} – ${Ee(f.endSec)}`, S = `${Gt(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`, C = h === c, m = h > 0 ? d[h - 1].groupKey : null, B = u && b.groupKey !== m ? n("div", {
        key: `group:${b.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, b.groupName) : null, U = n("button", {
        key: f.id,
        id: `segment-quick-search-${f.id}`,
        ref: C ? l : null,
        type: "button",
        role: "option",
        "aria-selected": C,
        onMouseEnter: () => s(h),
        onClick: () => t(f),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${C ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        u ? n("span", { key: "group", className: "sr-only" }, `${b.groupName} group`) : null,
        n(ln, { key: "review", state: f.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          f.tagName || "Tag segment"
        ),
        (q = b.performers) != null && q.length ? n($r, {
          key: "performers",
          performers: b.performers,
          performerAssignments: b.performerAssignments
        }) : null,
        n(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          p
        ),
        n("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: S
        }, S)
      ]);
      return B ? [B, U] : [U];
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
  const s = Ve(() => vc(e), [e]), [l, d] = K([]), c = s.reduce((h, f) => h + f.drafts.length, 0), u = ue(null);
  go({ confirmRef: u, cancelRef: o, confirmReady: !t && c > 0 });
  const g = (h) => d((f) => f.includes(h) ? f.filter((p) => p !== h) : [...f, h]), b = (h) => `segment-studio-publish-approved-${h.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && !t && a();
    },
    onKeyDownCapture: (h) => Mt(h, {
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
      ].flatMap(([h, f]) => [
        n("dt", { key: `${h}:label`, className: "text-secondary" }, h),
        n("dd", { key: `${h}:value`, className: "font-semibold text-foreground" }, String(f))
      ])),
      s.length ? n("div", { key: "groups", className: "space-y-2" }, s.map((h) => {
        const f = l.includes(h.key);
        return n("section", { key: h.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": f,
            "aria-controls": b(h),
            onClick: () => g(h.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: Ir(!1) }
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, f ? "▾" : "▸"),
            n("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, h.tagName),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${h.drafts.length} draft${h.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          f ? n("div", {
            key: "drafts",
            id: b(h),
            className: "divide-y divide-border border-t border-border"
          }, h.drafts.map((p) => {
            const S = p.endSec == null ? Ee(p.startSec) : `${Ee(p.startSec)} – ${Ee(p.endSec)}`, C = `${Gt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`;
            return n("div", { key: p.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(ln, { key: "review", state: p.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, S),
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
  const a = Bl(e), [s, l] = K(() => /* @__PURE__ */ new Set()), [d, c] = K(() => new Set(a.map((p) => p.key))), u = a.flatMap((p) => d.has(p.key) ? p.candidates : []), g = (p) => l((S) => {
    const C = new Set(S);
    return C.has(p) ? C.delete(p) : C.add(p), C;
  }), b = (p) => c((S) => {
    const C = new Set(S);
    return C.has(p) ? C.delete(p) : C.add(p), C;
  }), h = (p) => p.assignment.map(({ slot: S, performer: C }) => `${S.label || `Slot ${S.sortOrder + 1}`}: ${C.name}`).join(", "), f = (p) => `segment-studio-auto-assign-${p.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (p) => {
      p.target === p.currentTarget && !t && i();
    },
    onKeyDownCapture: (p) => {
      p.key === "Enter" && p.target instanceof HTMLInputElement || Mt(p, {
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
      e.length ? n("div", { className: "space-y-3" }, a.map((p) => n("section", { key: p.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
        n("header", {
          key: "header",
          className: "flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2",
          style: { background: Ir(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(p.key),
            disabled: t,
            onChange: () => b(p.key),
            "aria-label": `Include ${p.tagName} assignment: ${h(p)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(p.key),
            "aria-controls": f(p),
            "aria-label": `${s.has(p.key) ? "Collapse" : "Expand"} ${p.tagName} assignment: ${h(p)}`,
            onClick: () => g(p.key),
            className: "shrink-0 rounded px-1 text-sm text-secondary hover:bg-muted/50 hover:text-foreground disabled:opacity-50"
          }, s.has(p.key) ? "▾" : "▸"),
          n(
            "span",
            { key: "tag", className: "min-w-24 flex-1 truncate text-sm font-semibold text-foreground" },
            p.tagName
          ),
          n(
            "span",
            { key: "performers", className: "flex min-w-0 flex-wrap items-center gap-2" },
            p.assignment.map(({ slot: S, performer: C }) => {
              const m = S.label || `Slot ${S.sortOrder + 1}`;
              return n("span", {
                key: S.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${m}: ${C.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${m}: ${C.name}`
                }, `${m}: ${C.name}`),
                n(Yn, {
                  key: "avatar",
                  performer: { id: C.performerId, name: C.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(Zt, { key: "states", counts: p.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(p.candidates),
            "aria-label": `Auto-Assign ${p.tagName}: ${h(p)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${p.candidates.length})`)
        ]),
        s.has(p.key) ? n(
          "div",
          { key: "segments", id: f(p), className: "divide-y divide-border/70" },
          p.candidates.map((S) => {
            const C = S.endSec == null ? Ee(S.startSec) : `${Ee(S.startSec)} – ${Ee(S.endSec)}`, m = `${Gt(S.sourceKey)}${S.confidence == null ? "" : ` · ${Math.round(S.confidence * 100)}%`}`;
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
                C
              ),
              n("span", {
                key: "provenance",
                className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                title: m
              }, m)
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
    onKeyDownCapture: (d) => Mt(d, { onCancel: r, onConfirm: t })
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
  const [s, l] = K(!1), d = ue(null);
  if (go({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Ee(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !t && a();
    },
    onKeyDownCapture: (u) => Mt(u, {
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
  var g, b;
  const l = e ? e.createCount + e.linkCount : 0, d = ue(null);
  go({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((g = e == null ? void 0 : e.outputs) == null ? void 0 : g.slice(0, 200)) || [], u = Nc(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && !r && s();
    },
    onKeyDownCapture: (h) => Mt(h, {
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
        ].flatMap(([h, f]) => [
          n("dt", { key: `${h}:label`, className: "text-secondary" }, h),
          n("dd", { key: `${h}:value`, className: "font-semibold text-foreground" }, String(f))
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
              h.outputs.map((f, p) => n("div", {
                key: `${f.ruleId}:${f.depth}:${p}`,
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
  selectedPerformerSlots: g,
  performerSlots: b,
  detail: h,
  video: f,
  slotButtonRef: p,
  tagSearchRef: S,
  onDetailChange: C,
  setSaveMessage: m,
  acquireSaveLock: B,
  onSlotsChanged: U,
  onRecordHistory: q,
  onCancelQueuedReview: F,
  splitSegment: M,
  duplicateSegment: T,
  provenance: w,
  lineage: k,
  onNavigateLineageItem: A,
  tagEditing: G,
  onCancelTagEditing: L,
  detailPanelRef: R,
  onReduceSelection: H
}) {
  var xe, Ce, Pe, fe;
  const J = ue(null), _ = ue(null), oe = () => {
    var Y;
    (Y = _.current) == null || Y.call(_), _.current = null;
  }, ce = ue(null), be = ue(null), E = ue(null), ae = ue(null), [le, X] = K(!1);
  pe(() => {
    J.current && (J.current.scrollTop = 0), X(!1);
  }, [t == null ? void 0 : t.id]), pe(() => {
    var Y, ye;
    le && ((ye = (Y = ce.current) == null ? void 0 : Y.querySelector("input, select, button")) == null || ye.focus({ preventScroll: !0 }));
  }, [le]);
  function de() {
    X(!1), requestAnimationFrame(() => {
      var Y;
      return (Y = p.current) == null ? void 0 : Y.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const Y = !r.some((ee) => ee.isDerived), ye = e && u ? dd(b, r) : null, I = (ye == null ? void 0 : ye.map((ee, $) => {
      var y;
      const v = r[$];
      return {
        segmentId: v.nativeSegmentId,
        itemId: v.published ? null : v.itemId,
        revision: (y = h.performerSlotRevisions) == null ? void 0 : y[v.id],
        slots: ee
      };
    })) || [];
    return n(oo.Fragment, null, [
      n(ac, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: R,
        onReduceSelection: H,
        reviewable: e,
        tagEditable: Y,
        slotsEditable: I.length > 0 && a == null,
        onEditSlots: () => X(!0),
        slotButtonRef: p,
        saveMessage: i
      }),
      G && Y ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ee) => {
          ee.target === ee.currentTarget && L();
        },
        onKeyDownCapture: (ee) => Mt(ee, { onCancel: L })
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
          onChange: (ee, $) => ee == null ? L() : l(ee, $ == null ? void 0 : $.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: L,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      le && I.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ee) => {
          ee.target === ee.currentTarget && de();
        },
        onKeyDownCapture: (ee) => {
          var v, y;
          if (!(typeof ((v = ee.target) == null ? void 0 : v.closest) == "function" ? ee.target.closest("input, textarea, select, [contenteditable='true']") : null) && !ee.repeat && !ee.ctrlKey && !ee.altKey && !ee.metaKey && !ee.shiftKey && /^[1-9]$/.test(ee.key) && ((y = ae.current) != null && y.call(ae, Number(ee.key) - 1))) {
            ee.preventDefault(), ee.stopPropagation();
            return;
          }
          Mt(ee, { onCancel: de });
        }
      }, n("section", {
        ref: ce,
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
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(tc, {
          videoId: f.id,
          targets: I,
          performerCandidates: h.performerCandidates || [],
          shortcutRef: ae,
          acquireSaveLock: () => B("slots", -1),
          onSaved: async ({ beforeState: ee, afterState: $ }) => {
            await q(
              "performer-slots.assign",
              `Assigned performers to ${I.length} segments`,
              ee,
              $
            ), de(), await U();
          },
          onConflict: U
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (Y) => {
      J.current = Y, R && (R.current = Y);
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
        t && G ? n("div", {
          key: "tag-editor",
          ref: S,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (Y) => {
            Y.key === "Escape" && (Y.preventDefault(), Y.stopPropagation(), L());
          },
          onKeyDown: (Y) => {
            id(Y, t.tagName) && (Y.preventDefault(), Y.stopPropagation(), l(t.tagId));
          }
        }, n(Wn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (Y, ye) => Y == null ? L() : l(Y, ye == null ? void 0 : ye.label),
          disabled: Sl(a, t.id, s) || ((xe = k.data) == null ? void 0 : xe.tagReadOnly) === !0,
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
      t && u && g.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(xi, {
        assignments: g.map((Y) => {
          const ye = gd(Y);
          return {
            key: String(Y.slotDefinitionId),
            label: ye.label,
            performer: ye.filled ? { id: Number(Y.performerId), name: ye.performer } : null,
            title: ye.title
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
        k.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : k.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, k.error) : k.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${k.data.derived ? "Derived segment" : "Root segment"} · ${k.data.componentSize} segment${k.data.componentSize === 1 ? "" : "s"} · ${k.data.integrityState}`
          ),
          (Ce = k.data.parents) != null && Ce.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...k.data.parents.map((Y) => n("button", {
              key: Y.nodeId,
              type: "button",
              onClick: () => A(Y.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${Y.ruleKey} ${Y.ruleVersion}`))
          ]) : null,
          (Pe = k.data.children) != null && Pe.length ? n("p", { key: "children" }, `Children: ${k.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: p,
          type: "button",
          disabled: a != null || !u || g.length === 0,
          onClick: () => X(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: u ? g.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, g.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: M,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        n("button", {
          key: "duplicate",
          type: "button",
          disabled: a != null,
          onClick: () => T(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        n("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: a != null,
          onClick: () => T(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    le && e && t && u && g.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (Y) => {
        Y.target === Y.currentTarget && de();
      },
      onKeyDownCapture: (Y) => {
        var I, ee;
        if (!(typeof ((I = Y.target) == null ? void 0 : I.closest) == "function" ? Y.target.closest("input, textarea, select, [contenteditable='true']") : null) && !Y.repeat && !Y.ctrlKey && !Y.altKey && !Y.metaKey && !Y.shiftKey && /^[1-9]$/.test(Y.key) && ((ee = E.current) != null && ee.call(E, Number(Y.key) - 1))) {
          Y.preventDefault(), Y.stopPropagation();
          return;
        }
        Mt(Y, {
          onCancel: de,
          onConfirm: () => {
            var $;
            return ($ = be.current) == null ? void 0 : $.click();
          }
        });
      }
    }, n("section", {
      ref: ce,
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
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(ec, {
        key: `${t.id}:${h.performerSlotsRevision || h.slotRevision || ""}`,
        videoId: f.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: g,
        revision: (fe = h.performerSlotRevisions) == null ? void 0 : fe[t.id],
        performerCandidates: h.performerCandidates || [],
        confirmRef: be,
        shortcutRef: E,
        onOptimisticSave: (Y) => {
          const ye = B("slots", t.id);
          if (!ye)
            return m("Wait for the current save to finish before saving performer slots."), !1;
          _.current = ye, C((I) => Yt(
            I,
            t.id,
            Y
          ), f.id), m("Saving performer slots…"), de();
        },
        onSaved: async (Y, { beforeState: ye, afterState: I }) => {
          C((ee) => Yt(
            ee,
            t.id,
            Y.slots || [],
            Y.revision
          ), f.id), m("Performer slots saved.");
          try {
            await q(
              "performer-slots.assign",
              "Assigned performers",
              ye,
              I
            ), await U(Y) || F([t]);
          } finally {
            oe();
          }
        },
        onRollback: async (Y, ye) => {
          F([t]), C((I) => {
            var ee;
            return Yt(
              I,
              t.id,
              Y,
              (ee = h.performerSlotRevisions) == null ? void 0 : ee[t.id]
            );
          }, f.id), m(ye.message || "Unable to save performer slots.");
          try {
            ye.status === 409 && await U();
          } finally {
            oe();
          }
        },
        onConflict: U
      }))
    ])) : null
  ]);
}
function $c({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: u, onZoomChange: g, onSelectGroup: b, onToggleGroup: h, onSelect: f, onSelectSegments: p, onSelectAll: S, onConfigureTag: C, onSeekTime: m, centerRef: B, showReviewState: U = !0, swimlaneTitleWidth: q, onSwimlaneTitleWidthChange: F }) {
  const M = ue(null), T = ue(null), [w, k] = K(0), [A, G] = K({ scrollTop: 0, height: 320 }), [L, R] = K(null), H = Ve(
    () => an(e, r, o),
    [e, r, o]
  ), J = Ve(
    () => yi(o),
    [o]
  ), _ = Ve(() => yo(H), [H]), oe = Ve(
    () => hd(_, i, bi(_)),
    [_, i]
  ), ce = Ve(
    () => hi(oe.rows, Math.max(0, A.scrollTop - 24), A.height),
    [oe, A]
  ), be = Math.max(0, Number(d) || 0), E = Us(w), ae = yr(q, E), le = ae / 16, X = Ks(c, be, le), de = Ls(be), xe = js(be, Math.max(1, w - le * 16), u), Ce = de.filter((y, x) => x === 0 || x % xe === 0), Pe = Ve(() => H.map((y) => `${y.key}:${y.trackCount}:${y.markers.map(({ segment: x, track: D }) => `${x.id}:${x.startSec}:${x.endSec ?? ""}:${D}`).join(",")}`).join("|"), [H]);
  function fe() {
    const y = T.current;
    if (!y) return;
    const x = y.querySelector("[data-timeline-track]"), D = y.firstElementChild, ne = x == null ? void 0 : x.getBoundingClientRect(), te = D == null ? void 0 : D.getBoundingClientRect(), j = ne && te ? Math.max(0, ne.left - te.left) : le * 16, re = (te == null ? void 0 : te.width) ?? y.scrollWidth;
    y.scrollTo({
      left: Gs(c, be, re, y.clientWidth, j, _a),
      behavior: "smooth"
    });
  }
  pe(() => (B.current = fe, () => {
    B.current === fe && (B.current = null);
  })), pe(() => {
    fe();
  }, [u]);
  function Y() {
    const y = T.current, x = oe.rows.find((re) => re.kind === "lane" && re.lane.markers.some(({ segment: N }) => N.id === s));
    if (!y || !x) return;
    const D = 24, ne = x.top + D, te = ne + x.height;
    let j = y.scrollTop;
    ne < y.scrollTop + D ? j = Math.max(0, ne - D) : te > y.scrollTop + y.clientHeight && (j = Math.max(0, te - y.clientHeight)), j !== y.scrollTop && (y.scrollTop = j), G({ scrollTop: j, height: y.clientHeight });
  }
  pe(() => {
    Y();
  }, [s, Pe, oe]), pe(() => {
    const y = T.current, x = oe.rows.find((re) => re.kind === "group" && re.group.key === a);
    if (!y || !x) return;
    const D = 24, ne = x.top + D, te = ne + x.height;
    let j = y.scrollTop;
    ne < y.scrollTop + D ? j = Math.max(0, ne - D) : te > y.scrollTop + y.clientHeight && (j = Math.max(0, te - y.clientHeight)), j !== y.scrollTop && (y.scrollTop = j), G({ scrollTop: j, height: y.clientHeight });
  }, [a, oe]), pe(() => {
    const y = T.current;
    if (!y || typeof ResizeObserver > "u") return;
    const x = () => {
      k(y.clientWidth), G({ scrollTop: y.scrollTop, height: y.clientHeight }), Y();
    }, D = new ResizeObserver(x);
    return D.observe(y), x(), () => D.disconnect();
  }, [s, Pe, oe]);
  function ye(y) {
    if (!(be > 0)) return;
    const x = y.currentTarget.getBoundingClientRect(), D = Math.min(1, Math.max(0, (y.clientX - x.left) / x.width));
    m(D * be);
  }
  function I(y) {
    const x = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let D = null;
    Object.hasOwn(x, y.key) && (D = c + x[y.key]), y.key === "Home" && (D = 0), y.key === "End" && (D = be), D != null && (y.preventDefault(), y.stopPropagation(), m(Math.min(be, Math.max(0, D))));
  }
  function ee(y) {
    var D;
    const x = (D = M.current) == null ? void 0 : D.getBoundingClientRect();
    x && F(yr(y.clientX - x.left, E));
  }
  function $(y) {
    const x = y.shiftKey ? 40 : 16;
    let D = null;
    y.key === "ArrowLeft" && (D = ae - x), y.key === "ArrowRight" && (D = ae + x), y.key === "Home" && (D = 160), y.key === "End" && (D = E), D != null && (y.preventDefault(), y.stopPropagation(), F(yr(D, E)));
  }
  const v = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: M,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (y) => {
          (y.metaKey || y.ctrlKey) && (y.preventDefault(), S == null || S());
        },
        onKeyDown: (y) => {
          y.key !== "Enter" && y.key !== " " || (y.preventDefault(), S == null || S());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: v, disabled: u <= 1, onClick: () => g(kr(u - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: v, disabled: u === 1, onClick: () => g(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(u * 100)}%`),
      n("button", { key: "in", type: "button", className: v, disabled: u >= 8, onClick: () => g(kr(u + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: v, onClick: fe, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(E),
      "aria-valuenow": Math.round(ae),
      "aria-valuetext": `${Math.round(ae)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (y) => {
        y.currentTarget.setPointerCapture(y.pointerId), ee(y);
      },
      onPointerMove: (y) => {
        y.currentTarget.hasPointerCapture(y.pointerId) && ee(y);
      },
      onKeyDown: $,
      onDoubleClick: () => F(Rt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${ae - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: T,
      onScroll: (y) => G({
        scrollTop: y.currentTarget.scrollTop,
        height: y.currentTarget.clientHeight
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
          "aria-valuemax": be,
          "aria-valuenow": Math.min(be, Math.max(0, c)),
          "aria-valuetext": Ee(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: ye,
          onKeyDown: I
        }, Ce.map((y, x) => n("span", {
          key: y,
          className: `absolute top-0 ${Fs(x, Ce.length, be > 0 ? y / be * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Bs(x, Ce.length, be > 0 ? y / be * 100 : 0)
        }, Ee(y))).concat(t.map((y) => {
          const x = be > 0 ? y.startSec / be * 100 : 0;
          return n("button", {
            key: `shot-boundary:${y.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Ee(y.startSec)} – ${Ee(y.endSec)}`,
            title: `Shot boundary · ${y.source || "manual"} · ${Ee(y.startSec)} – ${Ee(y.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${x}%`, width: "2px" },
            onClick: (D) => {
              D.stopPropagation(), m(y.startSec);
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
        style: H.length > 0 ? { height: oe.height } : void 0
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
        H.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : ce.map((y) => {
          var W;
          const x = y.group, D = i.includes(x.key), ne = a === x.key, te = Ir(ne);
          if (y.kind === "group") return n("div", {
            key: y.key,
            "data-segment-group": x.key,
            "data-segment-group-collapsed": D ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${le}rem minmax(0,1fr)`,
              backgroundColor: te,
              top: y.top,
              height: y.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (O) => {
                if (O.metaKey || O.ctrlKey) {
                  p(x.lanes.flatMap((Q) => Q.markers.map((he) => he.segment.id)));
                  return;
                }
                b(x.key), h(x.key);
              },
              "aria-expanded": !D,
              "aria-current": ne ? "true" : void 0,
              "data-selected-timeline-group": ne ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: x.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: te
              },
              title: `${D ? "Expand" : "Collapse"} ${x.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, D ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, x.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              D ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${x.lanes.length} swimlane${x.lanes.length === 1 ? "" : "s"} hidden`
                ),
                U ? n(Zt, { key: "states", counts: x.counts }) : null
              ] : null
            )
          ]);
          const j = y.lane, re = ed(y.laneIndex), N = j.markers.some(({ segment: O }) => O.id === s);
          return n("div", {
            key: y.key,
            "data-grouped-swimlane": x.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${le}rem minmax(0,1fr)`,
              top: y.top,
              height: y.height,
              backgroundColor: re
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": N ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: td(N, re),
              title: `${Jn(j)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Jn(j),
              onClick: (O) => {
                (O.metaKey || O.ctrlKey) && p(j.markers.map((Q) => Q.segment.id));
              },
              onMouseEnter: () => R(j.key),
              onMouseLeave: () => R((O) => O === j.key ? null : O)
            }, [
              j.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (O) => {
                  O.stopPropagation(), C({ tagId: j.tagId, tagName: j.label, trigger: O.currentTarget });
                },
                "aria-label": `Configure ${j.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: L === j.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, j.label),
              (W = j.performers) != null && W.length ? n($r, {
                key: "performers",
                performers: j.performers,
                performerAssignments: j.performerAssignments
              }) : null,
              U ? n(Zt, { key: "counts", counts: j.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, j.markers.map(({ segment: O, track: Q }) => {
              var gt;
              const he = Jr(O.startSec, be), me = O.endSec == null ? O.startSec : Math.max(O.startSec, O.endSec), Te = Math.max(0, Jr(me, be) - he), mt = l.includes(O.id), je = O.id === s, Re = fo(J.get(O.id)), Ze = O.endSec == null ? Ee(O.startSec) : `${Ee(O.startSec)} – ${Ee(O.endSec)}`, it = (gt = pi[Re]) == null ? void 0 : gt.label;
              return n("button", {
                key: O.id,
                type: "button",
                onClick: (et) => {
                  et.stopPropagation(), f(O, {
                    additive: et.metaKey || et.ctrlKey,
                    rangeSegmentIds: et.shiftKey ? j.markers.map((ft) => ft.segment.id) : null
                  });
                },
                "aria-pressed": mt,
                "aria-current": je ? "true" : void 0,
                "data-selected-timeline-marker": je ? "true" : void 0,
                "data-selected-segment-shortcut-target": je ? "true" : void 0,
                "aria-label": U ? `${O.tagName || "Tag segment"}${j.performerLabel ? `, ${j.performerLabel}` : ""}, ${O.reviewState}${it ? `, ${it}` : ""}, ${Ze}` : `${O.tagName || "Tag segment"}${j.performerLabel ? `, ${j.performerLabel}` : ""}, ${Ze}`,
                title: U ? `${O.tagName || "Tag segment"}${j.performerLabel ? ` · ${j.performerLabel}` : ""} · ${O.reviewState}${it ? ` · ${it}` : ""} · ${Ze}` : `${O.tagName || "Tag segment"}${j.performerLabel ? ` · ${j.performerLabel}` : ""} · ${Ze}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...U ? Ql(O.reviewState, mt, Re, je) : Zl(mt, je),
                  left: `${he}%`,
                  top: `${nd(Q)}rem`,
                  width: Xl(O.endSec, Te),
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
  const [a, s] = K(null), [l, d] = K([]), [c, u] = K(null), [g, b] = K(""), [h, f] = K(!0), [p, S] = K(null), [C, m] = K(""), [B, U] = K(!1), q = ue(null), F = ue(0);
  pe(() => {
    const L = requestAnimationFrame(() => {
      var R;
      return (R = q.current) == null ? void 0 : R.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(L);
  }, [e]), pe(() => {
    const L = new AbortController();
    return f(!0), m(""), Promise.all([
      r ? Z(`/slot-definitions/${e}`, { signal: L.signal }) : Promise.resolve(null),
      Z("/segment-groups", { signal: L.signal })
    ]).then(([R, H]) => {
      const J = H.find((_) => (_.tags || []).some((oe) => Number(oe.tagId) === Number(e)));
      s(R), d(H), u((J == null ? void 0 : J.id) ?? null), b(J == null ? "" : String(J.id)), U(!1);
    }).catch((R) => {
      R.name !== "AbortError" && m(R.message || "Unable to load tag configuration.");
    }).finally(() => {
      L.signal.aborted || f(!1);
    }), () => L.abort();
  }, [r, e]);
  function M(L, R) {
    s({
      ...a,
      definitions: a.definitions.map((H, J) => J === L ? { ...H, ...R } : H)
    });
  }
  function T(L, R) {
    const H = L + R;
    if (H < 0 || H >= a.definitions.length) return;
    const J = [...a.definitions];
    [J[L], J[H]] = [J[H], J[L]], s({
      ...a,
      definitions: J.map((_, oe) => ({ ..._, sortOrder: oe }))
    });
  }
  function w(L) {
    const R = a.definitions[L], H = Number(R.assignmentCount) || 0, J = H === 0 ? "" : ` and its ${H} assignment${H === 1 ? "" : "s"}`;
    window.confirm(`Delete “${Ct(R)}”${J}?`) && (H > 0 && U(!0), s({
      ...a,
      definitions: a.definitions.filter((_, oe) => oe !== L).map((_, oe) => ({ ..._, sortOrder: oe }))
    }));
  }
  async function k() {
    var R;
    S("slots"), m("Saving performer slots…");
    let L;
    try {
      L = await Z(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: B,
          definitions: a.definitions.map((H, J) => {
            var _;
            return {
              id: H.id || void 0,
              label: ((_ = H.label) == null ? void 0 : _.trim()) || null,
              sortOrder: J,
              genderHints: H.genderHints || []
            };
          })
        })
      }), s(L), U(!1);
    } catch (H) {
      H.status === 409 ? (m("Performer slots changed elsewhere; current values were reloaded."), (R = H.payload) != null && R.current && (s(H.payload.current), U(!1))) : m(H.message || "Unable to save performer slots."), S(null);
      return;
    }
    try {
      await o(), m("Performer slots saved.");
    } catch {
      m("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      S(null);
    }
  }
  async function A() {
    const L = g === "" ? null : Number(g);
    if (L !== c) {
      S("group"), m("Saving tag group…");
      try {
        await Z(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: L })
        });
      } catch (R) {
        m(R.message || "Unable to assign the tag group."), S(null);
        return;
      }
      try {
        const [R, H] = await Promise.allSettled([
          Z("/segment-groups"),
          o()
        ]);
        if (R.status === "fulfilled") {
          d(R.value);
          const J = R.value.find((oe) => (oe.tags || []).some((ce) => Number(ce.tagId) === Number(e))), _ = (J == null ? void 0 : J.id) ?? null;
          u(_), b(_ == null ? "" : String(_));
        }
        m(
          R.status === "fulfilled" && H.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        S(null);
      }
    }
  }
  l.find((L) => Number(L.id) === Number(c));
  const G = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (L) => {
      L.target === L.currentTarget && !p && i();
    },
    onKeyDownCapture: (L) => Mt(L, {
      onCancel: p ? void 0 : i
    })
  }, n("section", {
    ref: q,
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
            value: g,
            disabled: p != null,
            onChange: (L) => b(L.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((L) => n("option", { key: L.id, value: String(L.id) }, L.name))
          ])
        ]),
        h ? null : n("button", {
          key: "save",
          type: "button",
          disabled: p != null || (g === "" ? null : Number(g)) === c,
          onClick: A,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, p === "group" ? "Saving…" : "Save tag group")
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
              disabled: p != null,
              onChange: (L) => s({ ...a, allowSamePerformerInMultipleSlots: L.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((L, R) => n("article", {
            key: L.id || L._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: L.label || "",
                disabled: p != null,
                onChange: (H) => M(R, { label: H.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Es.map((H) => n("label", { key: H, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: p != null,
                  checked: (L.genderHints || []).includes(H),
                  onChange: (J) => M(R, {
                    genderHints: J.target.checked ? [.../* @__PURE__ */ new Set([...L.genderHints || [], H])] : (L.genderHints || []).filter((_) => _ !== H)
                  })
                }),
                n("span", { key: "text" }, Cr(H))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${L.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: p != null || R === 0, onClick: () => T(R, -1), className: G, "aria-label": `Move ${Ct(L)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: p != null || R === a.definitions.length - 1, onClick: () => T(R, 1), className: G, "aria-label": `Move ${Ct(L)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: p != null, onClick: () => w(R), className: `${G} text-red-300` }, "Delete")
            ])
          ])),
          n("div", { key: "buttons", className: "flex items-center gap-2" }, [
            n("button", {
              key: "add",
              type: "button",
              disabled: p != null,
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
              className: G
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: p != null,
              onClick: k,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, p === "slots" ? "Saving…" : "Save performer slots")
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
        disabled: p != null,
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
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, approvalFacetCounts: i, autoAssignCandidates: a, autoAssignError: s, autoAssignOpen: l, autoAssignPerformers: d, autoAssigning: c, cancelQueuedReviewsForSegments: u, canMoveSelectionToBin: g, captureTrainingExport: b, centerTimelineRef: h, closeEditorFilters: f, closeFirstSegmentTagDialog: p, closeMaterializeDialog: S, closeMergeConfirmation: C, closePublishApprovedDialog: m, closeTagEditing: B, collapsedSegmentGroups: U, commonActionsRef: q, compatibilityMode: F, configuringTag: M, createSegment: T, creatingSegmentId: w, currentTime: k, deleteRejectedSegments: A, detail: G, detailPanelRef: L, detailWidth: R, duplicateSegment: H, editorFilters: J, editorLayout: _, editorRef: oe, exportingExamples: ce, filtersButtonRef: be, filtersOpen: E, firstSegmentTagOpen: ae, focusRowRef: le, handleSeparatorKeyDown: X, handleSeparatorPointerDown: de, handleSeparatorPointerMove: xe, hasNextUnreviewed: Ce, hasPreviousUnreviewed: Pe, hideDerivedSegments: fe, history: Y, historyOpen: ye, historySaving: I, horizontalLayoutSize: ee, importNativeSegments: $, incorrectExamples: v, incorrectExamplesOpen: y, lineage: x, markerRailWidth: D, materializeButtonRef: ne, materializeCancelButtonRef: te, materializeDerivedSegments: j, materializeError: re, materializeLoading: N, materializeOpen: W, materializePreview: O, materializing: Q, mediaStackRef: he, mergeCancelButtonRef: me, mergeConfirmation: Te, mergeSaving: mt, mergeSelectedSwimlane: je, nativeImportState: Re, onDetailChange: Ze, onNavigate: it, onReload: gt, onSlotsChanged: et, openPublishApprovedDialog: ft, panelSeparatorProps: st, pendingInitialSeekRef: ze, performerSlots: Je, performerSlotsAvailable: Ye, playbackControlsRef: We, previewDerivedSegments: ut, provenance: yt, provenanceSources: V, publishApprovedCancelButtonRef: se, publishApprovedDrafts: ke, publishApprovedError: Me, publishApprovedOpen: ve, quickSearchOpen: tt, railScrollRef: Ke, railToggleRef: Xe, recordHistoryAction: Ie, rejectedDeletionPreview: De, removeIncorrectExample: He, removingExampleId: Ae, restoreHistoryTarget: Fe, runEditorAction: nt, saveMessage: Se, saveTag: Le, saveTiming: Oe, savingSegmentId: pt, seekRef: rt, segmentGroups: at, segmentRailLayout: Kt, segments: lt, selectAllVideoSegments: Ne, selectSegment: we, selectSegmentCollection: Qe, selectedGroups: At, selectedPerformerSlots: xt, selectedSegment: bt, selectedSegmentGroupKey: St, selectedSegmentIds: Pt, selectedSegments: Et, selectedSlotStatus: Rr, setAutoAssignError: Mr, setAutoAssignOpen: dn, setConfiguringTag: Mn, setCurrentTime: An, setEditorFilters: en, setEditorLayout: cn, setFiltersOpen: Xn, setHideDerivedSegments: Ar, setHistoryOpen: un, setIncorrectExamplesOpen: er, setQuickSearchOpen: mn, setRailViewport: En, setRejectedDeletionPreview: tr, setSaveMessage: gn, setSelectedSegmentGroupKey: nr, setSelectedSegmentId: rr, setShortcutsOpen: pn, setTimelineZoom: tn, shotBoundaries: Dn, shortcutsOpen: On, slotButtonRef: wt, splitLayout: zt, splitSegment: Pn, stepVideoFrame: Ln, tagEditing: or, tagSearchRef: jn, timelineDuration: Fn, timelineRatioBounds: ar, timelineZoom: Er, toggleSegmentGroup: fn, toggleSegmentRail: Bn, updateTimelineRatio: Gn, video: $e, videoPerformers: ht, visibleCounts: Dr, visibleSegmentRailRows: Or, visibleSegments: Lt, wideLayout: vt, workspaceRef: Pr } = e, yn = Ve(
    () => lt.filter((z) => !z.published && z.reviewState === "approved"),
    [lt]
  ), bn = Cs(ao), nn = yn.length, Kn = ue(null), Lr = Ve(() => () => un(!1), [un]), hn = O ? O.createCount + O.linkCount : null, Ut = pt != null, rn = Et.length > 0, Ht = Et.length === 1, Wt = rn && Et.every((z) => z.reviewState === "approved"), jr = rn && Et.every((z) => z.reviewState === "rejected"), Fr = [
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
      { id: "marker.moveToBin", label: "Move to bin", disabled: Ut || !g, tone: "reject" }
    ]
  ];
  function Br(z) {
    const Be = Pt.includes(z.id), Ge = z.id === (bt == null ? void 0 : bt.id), $t = z.endSec == null ? Ee(z.startSec) : `${Ee(z.startSec)} – ${Ee(z.endSec)}`, ge = `${Gt(z.sourceKey)}${z.confidence != null ? ` · ${Math.round(z.confidence * 100)}%` : ""}`;
    return n("button", {
      key: z.id,
      type: "button",
      onClick: (kt) => we(z, { additive: kt.metaKey || kt.ctrlKey }),
      "aria-pressed": Be,
      "aria-current": Ge ? "true" : void 0,
      "data-selected-segment-shortcut-target": Ge ? "true" : void 0,
      "aria-label": F ? `${z.tagName || "Tag segment"}, ${z.reviewState}${z.isDerived ? ", derived segment" : ""}, ${$t}` : `${z.tagName || "Tag segment"}${z.isDerived ? ", derived segment" : ""}, ${$t}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: gi(Be, Ge)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        F ? n(ln, { key: "review", state: z.reviewState, includeLabel: !1 }) : null,
        z.isDerived ? n(Tr, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          z.tagName || "Tag segment"
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
  const vn = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", xn = [...Y.actions || []].reverse().find((z) => z.sequence <= Y.cursorSequence);
  return n("section", {
    ref: oe,
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
            onClick: (z) => Ri(z, it, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${$e.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: $e.title || `Video ${$e.id}`
          }, $e.title || `Video ${$e.id}`)),
          ...ht.map((z) => n(Yn, {
            key: ct(z),
            performer: { id: ct(z), name: z.name },
            compact: !0,
            tooltip: z.name
          })),
          F ? n(Zt, { key: "review-counts", counts: Dr }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          F ? null : n(Ei, { key: "bin", onNavigate: it, compact: !0 }),
          n(Di, { key: "settings", onNavigate: it, compact: !0 })
        ])
      ]),
      F && G.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${G.nativeImportCount} Cove segment${G.nativeImportCount === 1 ? "" : "s"} ${G.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        Re.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, Re.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => $("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => $("approved"),
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
              Mr(""), dn(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${a.length ? ` (${a.length})` : ""}`) : null,
          F ? n("button", {
            key: "materialize-derived",
            ref: ne,
            type: "button",
            disabled: pt != null || N || Q || hn === 0,
            onClick: ut,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, N ? "Analyzing…" : `Auto-Materialize${hn != null ? ` (${hn})` : ""}`) : null,
          F ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: pt != null || nn === 0,
            onClick: (z) => ft(z.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": ve,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${nn ? ` (${nn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: ce || Ae != null || v.length === 0,
            onClick: () => er(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": y,
            "aria-label": `Open AI feedback collection, ${v.length} example${v.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${v.length ? ` (${v.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: be,
            type: "button",
            onClick: () => Xn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": E,
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
            disabled: (F ? Y.actions.length === 0 : xn == null) || pt != null || I,
            onClick: F ? () => un((z) => !z) : () => Fe(
              xn.sequence - 1
            ),
            "aria-controls": F ? Oi : void 0,
            "aria-expanded": F ? ye : void 0,
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
      F && ye ? n(fc, {
        key: "history-popover",
        history: Y,
        historySaving: I,
        anchorRef: Kn,
        onRestore: Fe,
        onClose: Lr
      }) : null
    ]),
    E ? n(pc, {
      key: "editor-filters",
      filters: J,
      hideDerivedSegments: fe,
      performers: ht,
      provenanceSources: V,
      reviewCounts: i,
      segments: lt,
      segmentGroups: at,
      reviewMode: F,
      onChange: en,
      onHideDerivedChange: Ar,
      onClose: f
    }) : null,
    ae ? n(gc, {
      key: "first-segment-tag-dialog",
      saving: pt != null,
      error: Se,
      onSelect: (z, Be) => T(z, Be),
      onClose: p
    }) : null,
    tt ? n(hc, {
      key: "quick-search-dialog",
      segments: Kl(o),
      onSelect: (z) => {
        mn(!1), we(z, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        mn(!1), requestAnimationFrame(() => {
          var z;
          return (z = oe.current) == null ? void 0 : z.focus({ preventScroll: !0 });
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
      onConfirm: (z) => je(!0, z, Te),
      onClose: C
    }) : null,
    W ? n(Ic, {
      key: "materialize-derived-dialog",
      preview: O,
      loading: N,
      processing: Q,
      error: re,
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
        style: vt ? { position: "absolute", top: 0, right: 0, width: D, height: ee.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        lt.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : Lt.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: Ke,
          onScroll: (z) => En({
            scrollTop: z.currentTarget.scrollTop,
            height: z.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: Kt.height }
        }, Or.map((z) => {
          var Ge;
          let Be;
          if (z.kind === "group") {
            const $t = U.includes(z.group.key), ge = z.group.lanes.reduce((kt, ir) => kt + ir.markers.length, 0);
            Be = n("button", {
              type: "button",
              onClick: () => {
                nr(z.group.key), fn(z.group.key);
              },
              "aria-expanded": !$t,
              "aria-current": St === z.group.key ? "true" : void 0,
              "data-segment-rail-group": z.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${St === z.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, $t ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: z.group.name }, z.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, ge),
              F && $t ? n(Zt, { key: "states", counts: z.group.counts }) : null
            ]);
          } else z.kind === "lane" ? Be = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Jn(z.lane),
            "aria-label": Jn(z.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, z.lane.label),
            (Ge = z.lane.performers) != null && Ge.length ? n($r, {
              key: "performers",
              performers: z.lane.performers,
              performerAssignments: z.lane.performerAssignments
            }) : null,
            F ? n(Zt, { key: "states", counts: z.lane.counts }) : null
          ]) : Be = Br(z.segment);
          return n("div", {
            key: z.key,
            className: "absolute left-0 right-0",
            style: { top: z.top, height: z.height }
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
              gridTemplateColumns: _.markerRailOpen ? `${R}px 0.5rem minmax(0,1fr) 0.5rem ${D}px` : `${R}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(Cc, {
              key: "tools",
              compatibilityMode: F,
              selectedSegment: bt,
              selectedSegments: Et,
              selectedGroups: At,
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
              detail: G,
              onDetailChange: Ze,
              onCancelQueuedReview: u,
              video: $e,
              slotButtonRef: wt,
              tagSearchRef: jn,
              tagEditing: or,
              onCancelTagEditing: B,
              detailPanelRef: L,
              onReduceSelection: (z) => {
                we(z), requestAnimationFrame(() => {
                  var Be;
                  return (Be = L.current) == null ? void 0 : Be.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Oe,
              onSlotsChanged: et,
              onRecordHistory: Ie,
              splitSegment: Pn,
              duplicateSegment: H,
              provenance: yt,
              lineage: x,
              onNavigateLineageItem: (z) => {
                const Be = lt.find((Ge) => Ge.itemId === z);
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
                onSeekRegister: (z) => {
                  rt.current = z, jl(ze.current, lt, z) && (ze.current = null);
                },
                onPlaybackControlRegister: (z) => {
                  We.current = z;
                },
                onTimeUpdate: An
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
            ref: q,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...Fr.map((z) => {
              var $t;
              const Be = ($t = bn[z.id]) == null ? void 0 : $t[0], Ge = z.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : z.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: z.id,
                type: "button",
                disabled: z.disabled,
                "data-action-id": z.id,
                onClick: (ge) => {
                  const kt = ge.currentTarget;
                  nt(z.id, { target: kt, preserveFocus: !0 }), z.focusWhenDisabled && requestAnimationFrame(() => {
                    Tc(kt, q.current, z.focusWhenDisabled);
                  });
                },
                title: Be ? `${z.label} (${Be})` : z.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${Ge}`
              }, [
                n("span", { key: "label" }, z.label),
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
              }, n(Ms, { className: "h-4 w-4", "aria-hidden": !0 }))
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
            onPointerDown: de,
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
            currentTime: k,
            zoom: Er,
            onZoomChange: tn,
            onSelectGroup: nr,
            onToggleGroup: fn,
            onSelect: (z, Be) => we(z, Be),
            onSelectSegments: Qe,
            onSelectAll: Ne,
            onConfigureTag: (z) => Mn(z),
            onSeekTime: (z) => {
              var Be;
              return (Be = rt.current) == null ? void 0 : Be.call(rt, z, !1);
            },
            centerRef: h,
            showReviewState: F,
            swimlaneTitleWidth: _.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (z) => cn((Be) => ({ ...Be, swimlaneTitleWidth: z }))
          }))
        ])
      ])
    ]),
    M ? n(vo, {
      key: `configure-tag:${M.tagId}`,
      tagId: M.tagId,
      tagName: M.tagName,
      performerSlotsEnabled: F,
      onSaved: gt,
      onClose: () => {
        const z = M.trigger;
        Mn(null), requestAnimationFrame(() => {
          var Be;
          z != null && z.isConnected ? z.focus({ preventScroll: !0 }) : (Be = oe.current) == null || Be.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    ve ? n(xc, {
      key: "publish-approved-dialog",
      drafts: yn,
      processing: pt === -1,
      error: Me,
      cancelButtonRef: se,
      onConfirm: ke,
      onClose: m
    }) : null,
    De ? n(kc, {
      key: "rejected-deletion-dialog",
      preview: De,
      onConfirm: () => {
        A(De), requestAnimationFrame(() => {
          var z;
          return (z = oe.current) == null ? void 0 : z.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        tr(null), requestAnimationFrame(() => {
          var z;
          return (z = oe.current) == null ? void 0 : z.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    On ? n(yc, {
      key: "shortcuts-dialog",
      reviewMode: F,
      bindings: bn,
      onClose: () => pn(!1)
    }) : null,
    y ? n(bc, {
      key: "incorrect-examples-dialog",
      examples: v,
      exporting: ce,
      removingExampleId: Ae,
      onExport: b,
      onRemove: He,
      onClose: () => er(!1)
    }) : null
  ]);
}
function Mc(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: u, setCollapsedSegmentGroups: g, setEditorFilters: b, setHideDerivedSegments: h, setSaveMessage: f, setSelectedSegmentGroupKey: p, setSelectedSegmentId: S, setSelectedSegmentIds: C } = e;
  function m(M) {
    const T = Ft(t, M);
    T && g((w) => Si(w, T));
  }
  function B(M) {
    S(M), C(M == null ? [] : [M]), c.current = M, u.current = [];
  }
  function U(M, {
    focusEditor: T = !1,
    seekToSegment: w = !1,
    additive: k = !1,
    rangeSegmentIds: A = null
  } = {}) {
    var L, R;
    const G = rl({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: u.current
    }, M.id, A, k);
    C(G.selectedSegmentIds), S(G.activeSegmentId), c.current = G.anchorSegmentId, u.current = G.rangeBaseSegmentIds, G.activeSegmentId != null && p(Ft(t, G.activeSegmentId)), m(M.id), T && ((L = r.current) == null || L.focus({ preventScroll: !0 })), w && ((R = i.current) == null || R.call(i, M.startSec, !1));
  }
  function q(M) {
    const T = tl(
      d,
      l,
      M
    );
    C(T.selectedSegmentIds), S(T.activeSegmentId), c.current = T.activeSegmentId, u.current = [], T.activeSegmentId != null && (p(Ft(t, T.activeSegmentId)), m(T.activeSegmentId));
  }
  function F() {
    var w;
    const M = al(s), T = M.includes(l) ? l : M[0] ?? null;
    b(Ot({})), h(!1), C(M), S(T), c.current = T, u.current = [], T != null && p(Ft(
      an(s, a, o),
      T
    )), f(M.length === 0 ? "There are no segments to select." : `${M.length} segments selected. Collapsed Segment groups keep their selected segments.`), (w = r.current) == null || w.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: m, replaceSegmentSelection: B, selectSegment: U, selectSegmentCollection: q, selectAllVideoSegments: F };
}
function Ac(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, stableSaveIdentity: c, historyRef: u, onConflict: g, onDetailChange: b, onReload: h, recordHistoryAction: f, revealSegmentGroupForSelection: p, savingSegmentId: S, selectedGroups: C, selectedSegment: m, selectedSegmentIdRef: B, selectedSegments: U, selectionAnchorIdRef: q, selectionRangeBaseIdsRef: F, setMergeConfirmation: M, setSaveMessage: T, setSelectedSegmentId: w, setSelectedSegmentIds: k, video: A } = e;
  function G() {
    M(null), requestAnimationFrame(() => {
      var J;
      return (J = a.current) == null ? void 0 : J.focus({ preventScroll: !0 });
    });
  }
  async function L(J = !1, _ = !1, oe = null) {
    if (S != null) return;
    const ce = oe || vi(
      C,
      { nativeOnly: !o }
    );
    if (!ce) {
      T("Select at least two segments from one swimlane.");
      return;
    }
    if (!J && Va()) {
      M(ce);
      return;
    }
    _ && Ja(!1);
    const be = ce.endSec == null ? "open end" : Ee(ce.endSec);
    let E = ce.segments[0];
    const ae = o ? null : Dt(ce.segments, !1), le = o ? null : crypto.randomUUID(), X = ce.segments.map((fe) => fe.id), de = Dd(i, ce.segments).segments.find((fe) => fe.id === E.id), xe = {
      startSec: de.startSec,
      endSec: de.endSec,
      sourceKey: de.sourceKey,
      sourceRunId: de.sourceRunId,
      confidence: de.confidence,
      isDerived: de.isDerived
    }, Ce = r("merge", ce.segments[0].id);
    if (!Ce) return;
    G();
    const Pe = _t();
    s({
      type: "add",
      entry: { id: Pe, op: "merge", targets: ce.segments.map(Tt), values: xe }
    }), k([E.id]), w(E.id), q.current = E.id, F.current = [];
    try {
      const fe = ce.segments.slice(1);
      if (!o || E.nativeSegmentId != null) {
        const Y = fe.map((I) => {
          const ee = `merge-native-selection:${A.id}:${E.id}:${I.id}:${E.updatedAt}:${I.updatedAt}`;
          return { key: ee, operationId: _e(ee), segmentId: I.id, expectedUpdatedAt: I.updatedAt };
        }), ye = await Z(`/videos/${A.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: E.id,
            expectedSurvivorUpdatedAt: E.updatedAt,
            consumedSegments: Y.map(({ key: I, ...ee }) => ee),
            historyReceiptId: le
          })
        });
        E = ye.survivor, b((I) => fa(I, ye), A.id), s({ type: "confirm", key: Pe, applied: !0 }), Y.forEach(({ key: I }) => qe(I));
      } else {
        const Y = fe.map((I) => {
          const ee = `merge-draft-selection:${A.id}:${E.itemId}:${I.itemId}:${E.revision}:${I.revision}`;
          return { key: ee, operationId: _e(ee), itemId: I.itemId, expectedRevision: I.revision };
        }), ye = await Z(`/videos/${A.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: E.itemId,
            expectedSurvivorRevision: E.revision,
            consumedDrafts: Y.map(({ key: I, ...ee }) => ee)
          })
        });
        E = ye.survivor, b((I) => fa(I, ye), A.id), s({ type: "confirm", key: Pe, applied: !0 }), Y.forEach(({ key: I }) => qe(I));
      }
      k([E.id]), w(E.id), q.current = E.id, F.current = [], o ? t(Vt) : await f(
        "segments.merge",
        `Merged ${ce.segments.length} segments`,
        ae,
        Dt([E], !1),
        le
      ), p(E.id), T(`${ce.segments.length} segments merged into ${Ee(ce.startSec)} – ${be}.`);
    } catch (fe) {
      s({ type: "discard", key: Pe }), k(X), w((m == null ? void 0 : m.id) ?? X[0] ?? null), q.current = (m == null ? void 0 : m.id) ?? X[0] ?? null, F.current = [], fe.status === 409 ? await g() : T(fe.message || "Unable to merge selected segments.");
    } finally {
      Ce();
    }
  }
  function R(J, _ = U, oe = m) {
    if (_.length === 0) return Promise.resolve(null);
    const ce = yl(J, _, oe), be = Math.max(0, ce.identities.indexOf(ce.activeIdentity)), E = d(), ae = wi(E) != null || E.queued.some((X) => bo(X.targets, ce.identities.map(c))), le = l({
      kind: "review",
      lockId: ce.activeIdentity.id,
      targets: ce.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (X) => H(X, {
        ...ce,
        identities: X.targets,
        activeIdentity: X.targets[be]
      })
    });
    return le ? (ae && T(`${J === "approved" ? "Approval" : "Rejection"} queued…`), le.done) : (T("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function H({ detail: J, segments: _, onConflict: oe, onReload: ce }, be) {
    var ye;
    const E = bl(be, _);
    if (!E) {
      T("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: ae, selectedSegments: le, selectedSegment: X } = E, de = fl(le, ae), xe = le.filter((I) => I.reviewState !== de);
    if (xe.length === 0) return;
    const Ce = le.map((I) => ({
      id: I.id,
      itemId: I.itemId,
      nativeSegmentId: I.nativeSegmentId
    })), Pe = Ce.find((I) => I.id === (X == null ? void 0 : X.id)) || Ce[0], fe = (I, ee = !1) => {
      if (!(I != null && I.segments) || !ee && !Xr(B.current, Pe.id))
        return;
      const $ = Ce.map((y) => ot(I == null ? void 0 : I.segments, y)).filter(Boolean), v = ot(I == null ? void 0 : I.segments, Pe) || $[0] || null;
      k($.map((y) => y.id)), w((v == null ? void 0 : v.id) ?? null), q.current = (v == null ? void 0 : v.id) ?? null, F.current = [];
    };
    T(`Updating ${xe.length} selected segment${xe.length === 1 ? "" : "s"}…`);
    const Y = _t();
    s({
      type: "add",
      entry: { id: Y, op: "patch", targets: xe.map(Tt), values: { reviewState: de } }
    });
    try {
      const I = await Z(`/videos/${A.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: u.current.revision,
          reviewState: de,
          segments: le.map((y) => y.published ? {
            nativeSegmentId: y.nativeSegmentId,
            expectedUpdatedAt: y.updatedAt
          } : {
            itemId: y.itemId,
            expectedRevision: y.revision
          })
        })
      }), ee = new Map((I.items || []).map((y) => [
        y.requestedNativeSegmentId != null ? `native:${y.requestedNativeSegmentId}` : `item:${y.requestedItemId}`,
        y
      ]));
      if (Ce.forEach((y) => {
        const x = ee.get(y.nativeSegmentId != null ? `native:${y.nativeSegmentId}` : `item:${y.itemId}`);
        x && (y.nativeSegmentId = x.nativeSegmentId, y.itemId = x.itemId);
      }), I.history && t(I.history), de === "rejected" && !I.editorDelta || (I.items || []).some((y) => y.requestedNativeSegmentId != null && y.nativeSegmentId !== y.requestedNativeSegmentId)) {
        const y = await ce();
        s({ type: "confirm", key: Y, applied: y != null }), fe(y), T(`${I.updatedCount} selected segment${I.updatedCount === 1 ? "" : "s"} ${de === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const v = I.editorDelta ? (y) => _n(y, I.editorDelta) : (y) => ({
        ...y,
        approvedSetVersion: I.approvedSetVersion || y.approvedSetVersion,
        segments: (y.segments || []).map((x) => {
          const D = ee.get(x.nativeSegmentId != null ? `native:${x.nativeSegmentId}` : `item:${x.itemId}`);
          return D ? {
            ...x,
            id: D.nativeSegmentId != null ? D.nativeSegmentId : -D.itemId,
            itemId: D.itemId,
            nativeSegmentId: D.nativeSegmentId,
            published: D.nativeSegmentId != null,
            reviewState: de,
            revision: D.nativeSegmentId != null ? x.revision : D.revision,
            updatedAt: D.updatedAt
          } : x;
        })
      });
      b(v, A.id), s({ type: "confirm", key: Y, applied: !0 }), fe(v(J)), T(`${I.updatedCount} selected segment${I.updatedCount === 1 ? "" : "s"} ${de === "approved" ? "approved" : de === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (I) {
      s({ type: "discard", key: Y }), I.status === 409 && ((ye = I.payload) != null && ye.currentHistory) && t(I.payload.currentHistory);
      const ee = I.status === 409 ? await oe() : J;
      fe(ee, !0), T(I.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: G, mergeSelectedSwimlane: L, saveSelectedReviewState: R };
}
function Ec(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: u, detail: g, editorFilters: b, editorRef: h, cancelSaveTasks: f, dispatchPendingChanges: p, enqueueSave: S, stableSaveIdentity: C, exportingExamples: m, hideDerivedSegments: B, incorrectExamples: U, lineage: q, materializeButtonRef: F, materializePreview: M, materializeRestoreFocusRef: T, materializing: w, mutateSegment: k, runSegmentMutation: A, pendingChanges: G, onConflict: L, onDetailChange: R, onReload: H, performerSlots: J, recordHistoryAction: _, refreshMaterializationPreview: oe, removingExampleId: ce, revealSegmentGroupForSelection: be, savingSegmentId: E, segmentGroups: ae, segments: le, selectedSegment: X, selectedSegmentIdRef: de, selectedSegments: xe, selectionAnchorIdRef: Ce, selectionRangeBaseIdsRef: Pe, setAutoAssignError: fe, setAutoAssignOpen: Y, setAutoAssigning: ye, setEditorFilters: I, setExportingExamples: ee, setHideDerivedSegments: $, setIncorrectExamples: v, setMaterializeError: y, setMaterializeLoading: x, setMaterializeOpen: D, setMaterializePreview: ne, setMaterializing: te, setRejectedDeletionPreview: j, setRemovingExampleId: re, setSaveMessage: N, setSelectedSegmentGroupKey: W, setSelectedSegmentId: O, setSelectedSegmentIds: Q, swimlanes: he, video: me } = e;
  async function Te() {
    var Ae, Fe, nt;
    if (xe.length === 0 || !X || E != null) return;
    const V = $d(xe, U), se = V.segments;
    if (se.length === 0) return;
    const ke = xe.map((Se) => ({
      id: Se.id,
      itemId: Se.itemId,
      nativeSegmentId: Se.nativeSegmentId
    })), Me = ke.find((Se) => Se.id === X.id) || ke[0], ve = [], tt = [];
    let Ke = !1, Xe = g, Ie = !1;
    const De = [], He = r("feedback", Me.id);
    if (He) {
      N(V.action === "remove" ? `Removing ${se.length} selected incorrect example${se.length === 1 ? "" : "s"}…` : `Collecting ${se.length} selected segment${se.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const Se = async (Ne, we) => {
          const Qe = Ne.nativeSegmentId != null, At = V.action === "remove" ? `incorrect-example-remove:${me.id}:${we == null ? void 0 : we.id}:${we == null ? void 0 : we.revision}:${we == null ? void 0 : we.representationRevision}` : `incorrect-example-collect:${me.id}:${Qe ? `native:${Ne.nativeSegmentId}:${Ne.updatedAt}` : `item:${Ne.itemId}:${Ne.revision}`}`;
          if (V.action === "remove" && !we)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let xt;
          try {
            xt = V.action === "remove" ? await Z(
              `/videos/${me.id}/incorrect-examples/${we.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: _e(At),
                  expectedExampleRevision: we.revision,
                  expectedRepresentationRevision: we.representationRevision
                })
              }
            ) : await Z(`/videos/${me.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: _e(At),
                nativeSegmentId: Qe ? Ne.nativeSegmentId : null,
                itemId: Qe ? null : Ne.itemId,
                expectedUpdatedAt: Qe ? Ne.updatedAt : null,
                expectedRevision: Qe ? null : Ne.revision
              })
            });
          } catch (bt) {
            throw bt.operationKey = At, bt;
          }
          if (!Td(V.action, xt))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return qe(At), xt;
        };
        for (const Ne of se) {
          const we = V.action === "remove" ? U.find((Qe) => Qe.itemId != null && Qe.itemId === Ne.itemId) : null;
          try {
            const Qe = ke.find((St) => St.id === Ne.id);
            let At = ot(
              Xe == null ? void 0 : Xe.segments,
              Qe
            ) || Ne, xt;
            try {
              xt = await Se(At, we);
            } catch (St) {
              if (St.status === 409 && ((Fe = (Ae = St.payload) == null ? void 0 : Ae.result) == null ? void 0 : Fe.code) === "OPERATION_REPLAYED")
                Xe = await Z(
                  `/videos/${me.id}/editor`
                ), Ie = !0, De.length = 0, qe(St.operationKey), xt = St.payload.result;
              else {
                if (V.action !== "collect" || St.status !== 409) throw St;
                const Pt = await Z(
                  `/videos/${me.id}/editor`
                );
                Xe = Pt, Ie = !0, De.length = 0;
                const Et = ot(
                  Pt == null ? void 0 : Pt.segments,
                  Qe
                );
                if (!Et) throw St;
                At = Et, xt = await Se(At, null);
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
          const Ne = V.action === "remove", we = ve.length;
          await _(
            Ne ? "feedback.remove" : "feedback.collect",
            Ne ? `Removed ${we} incorrect AI example${we === 1 ? "" : "s"}` : `Collected ${we} incorrect AI example${we === 1 ? "" : "s"}`,
            mr(ve, Ne),
            mr(ve, !Ne)
          ) || (Ke = !0);
        }
        ve.some(({ result: Ne }) => Ne.representation === "basicNativeBin") && qn();
        const Le = Xr(
          de.current,
          Me.id
        ), Oe = V.action === "collect" && ve.some(({ segment: Ne }) => Ne.id === Me.id), pt = ve.map(({ segment: Ne }) => Ne.id), rt = Oe ? hr(
          he,
          br(o, Me.id),
          { removedIds: pt }
        ) : null, at = Oe ? (rt == null ? void 0 : rt.id) ?? null : Me.id;
        Le && Oe && (Q(rt ? [rt.id] : []), O((rt == null ? void 0 : rt.id) ?? Cn), Ce.current = (rt == null ? void 0 : rt.id) ?? null, Pe.current = []);
        const Kt = await Z(`/videos/${me.id}/incorrect-examples`);
        v(Kt);
        const lt = Xe;
        if (R(Ie ? lt : (Ne) => De.reduce(_n, Ne), me.id), Le && Xr(
          de.current,
          at
        )) {
          let Ne, we;
          Oe ? (we = rt ? ot(lt == null ? void 0 : lt.segments, {
            id: rt.id,
            itemId: rt.itemId,
            nativeSegmentId: rt.nativeSegmentId
          }) : null, Ne = we ? [we] : []) : (Ne = ke.map((Qe) => ot(lt == null ? void 0 : lt.segments, Qe)).filter(Boolean), we = ot(lt == null ? void 0 : lt.segments, Me) || Ne[0] || null), Q(Ne.map((Qe) => Qe.id)), O((we == null ? void 0 : we.id) ?? (Oe ? Cn : null)), Ce.current = (we == null ? void 0 : we.id) ?? null, Pe.current = [], W(we ? Ft(o, we.id) : null), we && be(we.id);
        }
        if (tt.length > 0) {
          const Ne = ((nt = tt[0]) == null ? void 0 : nt.message) || "Only segments with registered AI provenance can be collected.";
          ve.length === 0 ? N(Ne) : V.action === "remove" ? N(
            `Partially removed ${ve.length} of ${se.length} selected incorrect examples. ${Ne}`
          ) : N(
            `Partially collected ${ve.length} of ${se.length} selected segments. ${Ne}`
          );
        } else if (V.action === "remove")
          N(
            `${ve.length} incorrect example${ve.length === 1 ? "" : "s"} removed and ${ve.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const Ne = ve.filter(({ result: we }) => we.representation === "basicNativeBin").length;
          N(Ne === ve.length ? `${ve.length} incorrect AI example${ve.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ve.length} incorrect AI example${ve.length === 1 ? "" : "s"} collected and ${ve.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        Ke && N("The change saved, but editor history could not be updated.");
      } catch (Se) {
        N(Se.message || "Unable to update the selected incorrect examples.");
      } finally {
        He();
      }
    }
  }
  async function mt(V) {
    if (!V || ce != null || m) return;
    const se = r("feedback", -1);
    if (!se) {
      N("Wait for the current save to finish before removing the incorrect example.");
      return;
    }
    try {
      await je(V);
    } finally {
      se();
    }
  }
  async function je(V) {
    var ke, Me;
    re(V.id);
    const se = `incorrect-example-remove:${me.id}:${V.id}:${V.revision}:${V.representationRevision}`;
    try {
      let ve, tt = !1;
      try {
        ve = await Z(
          `/videos/${me.id}/incorrect-examples/${V.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(se),
              expectedExampleRevision: V.revision,
              expectedRepresentationRevision: V.representationRevision
            })
          }
        );
      } catch (Ie) {
        if (Ie.status !== 409 || ((Me = (ke = Ie.payload) == null ? void 0 : ke.result) == null ? void 0 : Me.code) !== "OPERATION_REPLAYED")
          throw Ie;
        ve = Ie.payload.result, tt = !0;
      }
      qe(se);
      let Ke = !0;
      if (c) {
        const De = [{ segment: ot(g.segments, {
          itemId: V.itemId
        }) || {
          id: V.itemId == null ? null : -V.itemId,
          itemId: V.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: V.representationRevision
        }, result: ve, example: V }];
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
      v(Xe), tt ? await H() : R(
        (Ie) => _n(Ie, ve.editorDelta),
        me.id
      ), V.representation === "basicNativeBin" && qn(), N(Ke ? tt ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : V.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (ve) {
      ve.status === 409 && await L(), N(ve.message || "Unable to remove the incorrect example.");
    } finally {
      re(null);
    }
  }
  async function Re() {
    if (m || ce != null || U.length === 0) return;
    ee(!0);
    const V = `incorrect-example-export:${me.id}:${U.map((se) => `${se.id}:${se.revision}:${se.representationRevision}`).join(",")}`;
    try {
      const se = await Md(
        me.id,
        U
      ), ke = new FormData();
      ke.append("metadata", JSON.stringify({
        operationId: _e(V),
        examples: se.captures
      }));
      for (const Ie of se.files)
        ke.append(Ie.fieldName, Ie.file);
      const Me = await Z(
        `/videos/${me.id}/incorrect-examples/export`,
        { method: "POST", body: ke }
      ), ve = await Wl(Me.downloadUrl), tt = URL.createObjectURL(ve.blob), Ke = document.createElement("a");
      Ke.href = tt, Ke.download = ve.fileName, Ke.click(), setTimeout(() => URL.revokeObjectURL(tt), 1e3);
      const Xe = await Z(
        `/training-exports/${Me.id}/complete`,
        { method: "POST" }
      );
      qe(V), v(await Z(
        `/videos/${me.id}/incorrect-examples`
      )), N(
        `Downloaded ${Me.exampleCount} incorrect example${Me.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Xe.clearedExampleCount} from the working collection.`
      );
    } catch (se) {
      N(se.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      ee(!1);
    }
  }
  async function Ze(V = null) {
    const se = le.filter((Fe) => Fe.reviewState === "rejected"), ke = se.length, Me = U.some((Fe) => Fe.representation === "fullItem");
    if (V == null && ke === 0 && !Me) {
      N("There are no rejected segments to delete.");
      return;
    }
    if (V == null) {
      const Fe = r("delete-rejected", -1);
      if (!Fe) return;
      N("Preparing deletion summary…");
      try {
        const nt = await Z(`/videos/${me.id}/rejected/deletion/preview`, { method: "POST" }), Se = Number(nt.deletedSegmentCount) || 0, Le = Number(nt.deferredRejectedSegmentCount) || 0, Oe = Number(nt.protectedIncorrectExampleCount) || 0;
        if (Se === 0) {
          Le > 0 ? N(
            `${Le} feedback-protected rejected segment${Le === 1 ? "" : "s"} kept. ${Oe} AI feedback example${Oe === 1 ? "" : "s"} must be exported before ${Le === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : N("There are no rejected segments to delete.");
          return;
        }
        if (!di(nt, N)) return;
        j(nt), N("");
      } catch (nt) {
        N(nt.message || "Unable to prepare rejected segment deletion.");
      } finally {
        Fe();
      }
      return;
    }
    const ve = V, tt = Number(ve.deferredRejectedSegmentCount) || 0, Ke = de.current, Xe = se.map((Fe) => Fe.id), Ie = tt === 0 && Xe.includes(Ke), De = Ie ? hr(
      he,
      br(o, Ke),
      { removedIds: Xe }
    ) : null, He = r("delete-rejected", -1);
    if (!He) return;
    j(null), N("Deleting rejected segments…");
    const Ae = tt === 0 ? _t() : null;
    Ae && p({
      type: "add",
      entry: { id: Ae, op: "remove", targets: se.map(Tt) }
    }), Ie && (Q(De ? [De.id] : []), O((De == null ? void 0 : De.id) ?? Cn), Ce.current = (De == null ? void 0 : De.id) ?? null, Pe.current = []);
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
      Ae && p({ type: "confirm", key: Ae, applied: Se != null }), nt.deletedSegmentCount > 0 && t(Vt);
      const Le = tt > 0 ? ` ${tt} feedback-protected rejected segment${tt === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      N(`${nt.deletedSegmentCount} segment${nt.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Le}`);
    } catch (Fe) {
      Ae && p({ type: "discard", key: Ae }), Ie && (Q(Ke == null ? [] : [Ke]), O(Ke), Ce.current = Ke, Pe.current = []), N(Fe.message || "Unable to delete rejected segments.");
    } finally {
      He();
    }
  }
  async function it(V = i) {
    if (a || V.length === 0) return;
    const se = r("auto-assign", -1);
    if (!se) {
      fe("Wait for the current save to finish before assigning performers.");
      return;
    }
    try {
      await gt(V);
    } finally {
      se();
    }
  }
  async function gt(V) {
    ye(!0), fe("");
    try {
      const se = await Z(`/videos/${me.id}/segments/auto-assign-performer-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeSegmentIds: V.flatMap((ke) => ke.nativeSegmentId == null ? [] : [ke.nativeSegmentId]),
          itemIds: V.flatMap((ke) => ke.published || ke.itemId == null ? [] : [ke.itemId])
        })
      });
      Y(!1), await H(), N(`${se.assignedSegmentCount} segment${se.assignedSegmentCount === 1 ? "" : "s"} received ${se.assignedSlotCount} performer-slot assignment${se.assignedSlotCount === 1 ? "" : "s"}.`);
    } catch (se) {
      fe(se.message || "Unable to auto-assign performers.");
    } finally {
      ye(!1);
    }
  }
  async function et() {
    D(!0), y(""), !M && (x(!0), oe());
  }
  function ft() {
    T.current = !0, D(!1), requestAnimationFrame(() => {
      var V;
      return (V = F.current) == null ? void 0 : V.focus({ preventScroll: !0 });
    });
  }
  async function st() {
    if (!M || w || M.createCount + M.linkCount === 0)
      return;
    const V = r("materialize", -1);
    if (!V) {
      y("Wait for the current save to finish before materializing derived segments.");
      return;
    }
    try {
      await ze();
    } finally {
      V();
    }
  }
  async function ze() {
    te(!0), y("");
    let V;
    try {
      const se = `materialize-derived:${me.id}:${M.fingerprint}`;
      V = await Z(`/videos/${me.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(se),
          fingerprint: M.fingerprint,
          maxDepth: 3
        })
      }), qe(se);
    } catch (se) {
      se.status === 409 && ne(null), y(se.message || "Unable to materialize derived segments."), te(!1);
      return;
    }
    ne((se) => se && { ...se, createCount: 0, linkCount: 0 });
    try {
      await H(), ft(), ne(null);
      const se = V.createdCount + V.linkedCount;
      N(`${V.createdCount} derived segment${V.createdCount === 1 ? "" : "s"} created and ${V.linkedCount} existing segment${V.linkedCount === 1 ? "" : "s"} linked.`), se === 0 && N("Every applicable derivation was already materialized.");
    } catch {
      y("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    te(!1);
  }
  async function Je(V, se = null) {
    var ve, tt, Ke, Xe;
    const ke = {
      tagId: V,
      ...se ? { tagName: se } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (xe.length > 1) {
      const Ie = xe.filter((Se) => Se.tagId !== V);
      if (Ie.length === 0) {
        d();
        return;
      }
      const De = xe.map((Se) => ({
        id: Se.id,
        itemId: Se.itemId,
        nativeSegmentId: Se.nativeSegmentId
      })), He = xe.map((Se) => !c || Se.nativeSegmentId != null ? `native:${Se.nativeSegmentId}:${Se.updatedAt}` : `item:${Se.itemId}:${Se.revision}`).sort().join(","), Ae = `bulk-tag:${me.id}:${V}:${He}`, Fe = r("tag", (X == null ? void 0 : X.id) ?? Ie[0].id);
      if (!Fe) return;
      N(`Changing tag for ${Ie.length} selected segment${Ie.length === 1 ? "" : "s"}…`);
      const nt = _t();
      p({
        type: "add",
        entry: { id: nt, op: "patch", targets: Ie.map(Tt), values: ke }
      }), d();
      try {
        const Se = c ? null : crypto.randomUUID();
        await Z(`/videos/${me.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(Ae),
            tagId: V,
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
        }), qe(Ae);
        const Le = Dt(
          xe,
          c
        ), Oe = await H();
        p({ type: "confirm", key: nt, applied: Oe != null });
        const pt = De.map((at) => ot(Oe == null ? void 0 : Oe.segments, at)).filter(Boolean);
        await _(
          "segments.tag",
          `Changed tag for ${Ie.length} segment${Ie.length === 1 ? "" : "s"}`,
          Le,
          Dt(pt, c),
          Se
        );
        const rt = De.map((at) => ot(Oe == null ? void 0 : Oe.segments, at)).filter(Boolean);
        Q(rt.map((at) => at.id)), O(((ve = rt.find((at) => at.id === (X == null ? void 0 : X.id))) == null ? void 0 : ve.id) ?? ((tt = rt[0]) == null ? void 0 : tt.id) ?? null), d(), N(`${Ie.length} selected segment${Ie.length === 1 ? "" : "s"} retagged.`);
      } catch (Se) {
        p({ type: "discard", key: nt });
        const Le = De.map((pt) => ot(g.segments, pt)).filter(Boolean), Oe = ot(g.segments, {
          id: X == null ? void 0 : X.id,
          itemId: X == null ? void 0 : X.itemId,
          nativeSegmentId: X == null ? void 0 : X.nativeSegmentId
        }) || Le[0] || null;
        Q(Le.map((pt) => pt.id)), O((Oe == null ? void 0 : Oe.id) ?? null), Ce.current = (Oe == null ? void 0 : Oe.id) ?? null, Pe.current = [], Se.status === 409 && await L(), N(Se.message || "Unable to change the selected segment tags.");
      } finally {
        Fe();
      }
      return;
    }
    if (xe.length !== 1 || !X) return;
    const Me = Ni(G, X);
    if (X.id === u || Me) {
      const Ie = Me ? { segmentId: X.id, tagId: Me.values.tagId, tagName: Me.meta.tagName } : null, De = kl(Ie, X, V, se);
      if (De && !Ye(X, De)) {
        d();
        return;
      }
      if (Me && (f((He) => {
        var Ae;
        return ((Ae = He.meta) == null ? void 0 : Ae.pendingChangeId) === Me.id;
      }), p({ type: "discard", key: Me.id })), De) {
        const He = Ya(
          { ...X, tagId: De.tagId },
          J,
          b,
          B,
          ae
        );
        I(He.filters), $(He.hideDerivedSegments), N("Tag change queued…");
      } else Me && N("");
      d();
      return;
    }
    if (V === X.tagId) {
      d();
      return;
    }
    if (X.itemId != null && ((Xe = (Ke = q.data) == null ? void 0 : Ke.children) == null ? void 0 : Xe.length) > 0) {
      const Ie = r("lineage-tag", X.id);
      if (!Ie) return;
      N("Checking lineage impact…");
      let De = null;
      try {
        const He = await Z(`/items/${X.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: X.revision, tagId: V })
        }), Ae = He.deletedItemIds.length > 0 || He.removedEdgeIds.length > 0;
        if (Ae && !window.confirm(
          `Changing this tag removes ${He.removedEdgeIds.length} lineage edge${He.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${He.deletedItemIds.length} derived segment${He.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
        )) {
          N("Tag change canceled.");
          return;
        }
        De = _t(), p({
          type: "add",
          entry: { id: De, op: "patch", targets: [Tt(X)], values: ke }
        }), d();
        const Fe = `tag-change:${X.itemId}:${X.revision}:${He.componentFingerprint}:${V}`;
        await Z(`/items/${X.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(Fe),
            expectedRevision: X.revision,
            componentFingerprint: He.componentFingerprint,
            tagId: V
          })
        }), qe(Fe);
        const nt = await H();
        p({ type: "confirm", key: De, applied: nt != null }), d(), N(Ae ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch (He) {
        De && p({ type: "discard", key: De }), Q([X.id]), O(X.id), Ce.current = X.id, Pe.current = [], He.status === 409 ? (N("Lineage changed — loading the latest segments…"), await L()) : N(He.message || "Unable to reconcile the lineage.");
      } finally {
        Ie();
      }
      return;
    }
    d(), await k(X, {
      startSec: X.startSec,
      endSec: X.endSec,
      tagId: V
    }, !0, null, !0, ke);
  }
  function Ye(V, se) {
    const ke = _t(), Me = C(Tt(V));
    p({
      type: "add",
      entry: {
        id: ke,
        op: "patch",
        targets: [Me],
        values: { tagId: se.tagId, tagName: se.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: se.tagName }
      }
    });
    const ve = G.find((Ke) => Ke.op === "insert" && Ke.segment.id === V.id);
    return S({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [Me],
      dependsOn: (ve == null ? void 0 : ve.taskId) ?? null,
      meta: { pendingChangeId: ke },
      ready: (Ke, Xe) => {
        const Ie = ki(Ke.segments, Xe.targets[0]);
        return !Ie || wl(Ke, Ie.id);
      },
      run: (Ke) => We(Ke, ke, se)
    }) ? !0 : (p({ type: "discard", key: ke }), N("Wait for the history restore to finish."), !1);
  }
  async function We(V, se, ke) {
    const [Me] = V.resolveTargets();
    if (!Me) {
      p({ type: "discard", key: se }), N(`The new segment was not retagged${ke.tagName ? ` to ${ke.tagName}` : ""}. Choose its tag again.`);
      return;
    }
    if (Me.tagId === ke.tagId) {
      p({ type: "discard", key: se });
      return;
    }
    await A(Me, {
      startSec: Me.startSec,
      endSec: Me.endSec,
      tagId: ke.tagId
    }, {
      pendingChangeId: se,
      restoreSelectionOnFailure: !1,
      onReload: V.onReload,
      onConflict: V.onConflict
    }) || N(`The new segment was not retagged${ke.tagName ? ` to ${ke.tagName}` : ""}. Choose its tag again.`);
  }
  async function ut() {
    var Xe, Ie, De, He;
    if (!l || !X || E != null) return;
    const V = [...xe].sort((Ae, Fe) => Number(Ae.nativeSegmentId ?? Ae.id) - Number(Fe.nativeSegmentId ?? Fe.id)), se = new Set(V.map((Ae) => Ae.id)), ke = V.map((Ae) => `${Ae.nativeSegmentId ?? Ae.id}:${Ae.updatedAt}`).join("|"), Me = r("bin", X.id);
    if (!Me) return;
    N(`Moving ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin…`);
    const ve = `bulk-move:${me.id}:${ke}`, tt = _e(ve), Ke = c ? null : crypto.randomUUID();
    try {
      const Ae = (Le = !1) => Z(`/videos/${me.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: tt,
          segments: V.map((Oe) => ({
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
        Fe = await Ae(
          uo(ve)
        );
      } catch (Le) {
        if (((Xe = Le.payload) == null ? void 0 : Xe.code) !== "missing-image" || !window.confirm(`${Le.message}

Continue and discard the missing image reference?`)) throw Le;
        mo(ve), Fe = await Ae(!0);
      }
      qe(ve), qn();
      const nt = new Map((Fe.items || []).map((Le) => [
        Number(Le.segmentId),
        Le
      ]));
      await _(
        "segments.moveToBin",
        `Moved ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin`,
        Dt(V, !1),
        Dt(V.map((Le) => {
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
      R((Le) => ({
        ...Le,
        segments: (Le.segments || []).filter((Oe) => !se.has(Oe.id))
      }), me.id), Q(Se ? [Se.id] : []), O((Se == null ? void 0 : Se.id) ?? Cn), Ce.current = (Se == null ? void 0 : Se.id) ?? null, Pe.current = [], Se && (W(Ft(o, Se.id)), be(Se.id)), requestAnimationFrame(() => {
        var Le;
        return (Le = h.current) == null ? void 0 : Le.focus({ preventScroll: !0 });
      }), N(`Moved ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Ae) {
      const Fe = ((Ie = Ae.payload) == null ? void 0 : Ie.code) || ((He = (De = Ae.payload) == null ? void 0 : De.result) == null ? void 0 : He.code);
      Ae.status === 409 && Fe === "CANONICAL_SEGMENT_CHANGED" ? await L() : N(Ae.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Me();
    }
  }
  async function yt() {
    if (!(c || s.current || E != null)) {
      s.current = !0, N("Checking the recycling bin…");
      try {
        const V = await Z("/bin"), se = await ui(V, () => N("Emptying the recycling bin…"));
        if (se.status === "empty") {
          N("The recycling bin is empty.");
          return;
        }
        if (se.status === "canceled") {
          N("The recycling bin was not emptied.");
          return;
        }
        N(`${se.segmentCount} segment${se.segmentCount === 1 ? "" : "s"} from ${se.sceneCount} scene${se.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (V) {
        N(V.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: Te, removeIncorrectExample: mt, captureTrainingExport: Re, deleteRejectedSegments: Ze, autoAssignPerformers: it, previewDerivedSegments: et, closeMaterializeDialog: ft, materializeDerivedSegments: st, saveTag: Je, moveToBin: ut, emptyRecyclingBin: yt };
}
function Dc(e) {
  const { acceptHistory: t, acquireSaveLock: r, enqueueSave: o, getSaveQueueSnapshot: i, commonActionsRef: a, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: u, history: g, historyRef: b, historySaving: h, horizontalLayoutSize: f, mediaStackHeight: p, mediaStackRef: S, onDetailChange: C, onReload: m, railToggleRef: B, recordHistoryAction: U, savingSegmentId: q, setCollapsedSegmentGroups: F, setEditorLayout: M, setHistorySaving: T, setIncorrectExamples: w, setSaveMessage: k, shotBoundaries: A, timelineDuration: G, video: L, workspaceRef: R } = e;
  async function H($, v, y) {
    var te, j, re, N;
    const x = $.type === "segment" ? [$] : $.segments || [], D = (v == null ? void 0 : v.type) === "segment" ? [v] : (v == null ? void 0 : v.segments) || [];
    let ne = y;
    for (const [W, O] of x.entries()) {
      const Q = D[W], he = ((te = O.identity) == null ? void 0 : te.nativeSegmentId) != null || ((j = O.identity) == null ? void 0 : j.published) === !0, me = ((re = Q == null ? void 0 : Q.identity) == null ? void 0 : re.recycleBinItemId) ?? ((N = Q == null ? void 0 : Q.identity) == null ? void 0 : N.itemId);
      let Te = ot(ne.segments, Q == null ? void 0 : Q.identity) || ot(ne.segments, O.identity);
      if (!Te && he && me != null && Q.identity.revision != null) {
        const Re = `history-restore:${L.id}:${me}:${Q.identity.revision}`;
        await Z(`/bin/${me}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(Re),
            expectedRevision: Q.identity.revision
          })
        }), qe(Re), ne = await m(), Te = ne.segments.find((Ze) => Ze.tagId === O.values.tagId && Ze.startSec === O.values.startSec && Ze.endSec === O.values.endSec);
      }
      if (!Te)
        throw new Error("A segment in this history state no longer exists.");
      if ((Te.nativeSegmentId != null || Te.published === !0) !== he) {
        if (he) {
          const Re = Te.recycleBinItemId ?? Te.itemId ?? me;
          if (Re == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Ze = `history-restore:${L.id}:${Re}:${Te.revision}:${O.values.reviewState ?? "native"}`;
          await Z(`/bin/${Re}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(Ze),
              expectedRevision: Te.revision
            })
          }), qe(Ze);
        } else {
          const Re = `history-bin:${L.id}:${Te.nativeSegmentId}:${Te.updatedAt}:${O.values.reviewState}`;
          await Z(`/videos/${L.id}/segments/${Te.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(Re),
              expectedUpdatedAt: Te.updatedAt,
              reviewState: O.values.reviewState
            })
          }), qe(Re);
        }
        if (ne = await m(), !he)
          continue;
        if (Te = ot(ne.segments, O.identity) || ne.segments.find((Re) => Re.tagId === O.values.tagId && Re.startSec === O.values.startSec && Re.endSec === O.values.endSec), !Te)
          throw new Error("The restored segment could not be found.");
      }
      const je = O.values;
      if (Te.nativeSegmentId == null && Te.itemId != null) {
        const Re = `history-draft-update:${L.id}:${Te.itemId}:${Te.revision}:${je.tagId}:${je.startSec}:${je.endSec ?? "open"}:${je.reviewState}`;
        await Z(`/videos/${L.id}/drafts/${Te.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(Re),
            expectedRevision: Te.revision,
            ...je
          })
        }), qe(Re);
      } else
        await Z(`/videos/${L.id}/segments/${Te.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...je, expectedUpdatedAt: Te.updatedAt })
        });
      ne = await m();
    }
    return ne;
  }
  async function J($, v) {
    var y;
    for (const x of $.targets || []) {
      const D = ot(v.segments, x.identity);
      if (!D)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const ne = (y = v.performerSlotRevisions) == null ? void 0 : y[D.id];
      await Z(D.published ? `/videos/${L.id}/segments/${D.nativeSegmentId}/slots` : `/videos/${L.id}/drafts/${D.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: ne,
          assignments: x.assignments
        })
      }), v = await m();
    }
    return v;
  }
  async function _($, v, y) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let x = v, D = await Z(`/videos/${L.id}/incorrect-examples`);
    const ne = (te) => D.find((j) => {
      var re;
      return j.id === te.exampleId || ((re = te.collectedIdentity) == null ? void 0 : re.itemId) != null && j.itemId === te.collectedIdentity.itemId;
    });
    for (const [te, j] of ($.entries || []).entries()) {
      const re = `history-feedback:${L.id}:${y.action.sequence}:${y.direction}:${te}`, N = ne(j);
      if ($.collected && N) {
        qe(re);
        continue;
      }
      let W;
      if ($.collected) {
        const O = ot(
          x.segments,
          j.collectedIdentity
        ) || ot(
          x.segments,
          j.originalIdentity
        );
        if (!O)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const Q = O.nativeSegmentId != null;
        W = await Z(`/videos/${L.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: _e(re),
            nativeSegmentId: Q ? O.nativeSegmentId : null,
            itemId: Q ? null : O.itemId,
            expectedUpdatedAt: Q ? O.updatedAt : null,
            expectedRevision: Q ? null : O.revision
          })
        });
      } else {
        if (!N) {
          qe(re);
          continue;
        }
        W = await Z(
          `/videos/${L.id}/incorrect-examples/${N.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: _e(re),
              expectedExampleRevision: N.revision,
              expectedRepresentationRevision: N.representationRevision
            })
          }
        );
      }
      qe(re), x = _n(
        x,
        W.editorDelta
      ), D = await Z(
        `/videos/${L.id}/incorrect-examples`
      );
    }
    return w(D), x;
  }
  async function oe($, v, y = []) {
    const x = $.state;
    if (!s && ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")) {
      const ne = `basic-history:${L.id}:${b.current.revision}:${$.action.sequence}:${$.direction}`, te = await Z(`/videos/${L.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(ne),
          expectedHistoryRevision: b.current.revision,
          actionSequence: $.action.sequence,
          direction: $.direction
        })
      });
      return t(te.history), y.push(ne), m();
    }
    const D = $.direction === "backward" ? $.action.afterState : $.action.beforeState;
    if ((x == null ? void 0 : x.type) === "composite") {
      let ne = v;
      const te = (D == null ? void 0 : D.type) === "composite" ? D.states || [] : [];
      for (const [j, re] of (x.states || []).entries()) {
        const N = te[j];
        ne = await oe({
          ...$,
          state: re,
          action: {
            ...$.action,
            beforeState: $.direction === "backward" ? re : N,
            afterState: $.direction === "backward" ? N : re
          }
        }, ne, y);
      }
      return ne;
    }
    if ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")
      return H(
        x,
        D,
        v
      );
    if ((x == null ? void 0 : x.type) === "performerSlots")
      return J(x, v);
    if ((x == null ? void 0 : x.type) === "incorrectExamples")
      return _(x, v, $);
    if ((x == null ? void 0 : x.type) === "shots") {
      const ne = vr(v.shotBoundaries || []), te = await Z(`/videos/${L.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(`history-shots:${L.id}:${ne}:${x.fingerprint}`),
          expectedFingerprint: ne,
          boundaries: x.boundaries
        })
      });
      return { ...v, shotBoundaries: te };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function ce($) {
    if (h || $ === g.cursorSequence) return;
    if (q != null) {
      k("Finish the pending saves before restoring history.");
      return;
    }
    if (ga(g, $).length === 0) return;
    const y = o({
      kind: "history",
      lockId: -1,
      exclusive: !0,
      run: (x) => be(x.detail, $)
    });
    if (!y) {
      k("Finish the pending saves before restoring history.");
      return;
    }
    await y.done;
  }
  async function be($, v) {
    var x;
    const y = ga(b.current, v);
    if (y.length !== 0) {
      T(!0), k(`Restoring ${y.length} history ${y.length === 1 ? "action" : "actions"}…`);
      try {
        let D = $;
        const ne = [];
        for (const j of y)
          D = await oe(
            j,
            D,
            ne
          );
        const te = s ? await Z(`/videos/${L.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: b.current.revision,
            targetSequence: v
          })
        }) : b.current;
        ne.forEach(qe), t(te), await m(), k("History restored.");
      } catch (D) {
        D.status === 409 && ((x = D.payload) != null && x.current) && t(D.payload.current), await m(), k(D.message || "Unable to restore editor history.");
      } finally {
        T(!1);
      }
    }
  }
  function E($) {
    M((v) => ({ ...v, timelineRatio: lo($, p) }));
  }
  function ae($) {
    var x, D;
    const v = (x = S.current) == null ? void 0 : x.getBoundingClientRect();
    if (!v) return;
    const y = ((D = a.current) == null ? void 0 : D.offsetHeight) || 0;
    E(_s(
      $.clientY,
      v.top + y,
      Math.max(0, v.height - y)
    ));
  }
  function le($) {
    $.currentTarget.setPointerCapture($.pointerId), ae($);
  }
  function X($) {
    $.currentTarget.hasPointerCapture($.pointerId) && ae($);
  }
  function de($) {
    const v = $.shiftKey ? 0.1 : 0.05;
    let y = null;
    $.key === "ArrowUp" && (y = c.timelineRatio + v), $.key === "ArrowDown" && (y = c.timelineRatio - v);
    const x = so(p);
    $.key === "Home" && (y = x.minimum), $.key === "End" && (y = x.maximum), y != null && ($.preventDefault(), $.stopPropagation(), E(y));
  }
  function xe($) {
    const v = $ === "detailWidth" ? f.focusRow : f.workspace, y = f.workspace > 0 ? Yr(f.workspace, 600) : 560, x = on(c.markerRailWidth, y), D = $ === "detailWidth" ? 344 + (c.markerRailOpen ? x + 24 : 0) : 600;
    return v > 0 ? Yr(v, D) : 560;
  }
  function Ce($, v) {
    M((y) => ({ ...y, [$]: on(v, xe($)) }));
  }
  function Pe($, v) {
    var x, D;
    const y = v === "detailWidth" ? (x = u.current) == null ? void 0 : x.getBoundingClientRect() : (D = R.current) == null ? void 0 : D.getBoundingClientRect();
    y && Ce(v, v === "detailWidth" ? $.clientX - y.left : y.right - $.clientX);
  }
  function fe($, v) {
    const y = xe($), x = on(c[$], y);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": v,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(y),
      "aria-valuenow": Math.round(x),
      "aria-valuetext": `${Math.round(x)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (D) => {
        D.currentTarget.setPointerCapture(D.pointerId), Pe(D, $);
      },
      onPointerMove: (D) => {
        D.currentTarget.hasPointerCapture(D.pointerId) && Pe(D, $);
      },
      onKeyDown: (D) => {
        const ne = D.shiftKey ? 40 : 16;
        let te = null;
        D.key === "ArrowLeft" && (te = $ === "detailWidth" ? -ne : ne), D.key === "ArrowRight" && (te = $ === "detailWidth" ? ne : -ne);
        let j = te == null ? null : x + te;
        D.key === "Home" && (j = 240), D.key === "End" && (j = y), j != null && (D.preventDefault(), D.stopPropagation(), Ce($, j));
      },
      onDoubleClick: () => Ce($, Rt[$]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function Y() {
    M(($) => ({ ...$, markerRailOpen: !$.markerRailOpen })), requestAnimationFrame(() => {
      var $;
      return ($ = B.current) == null ? void 0 : $.focus({ preventScroll: !0 });
    });
  }
  function ye($) {
    F((v) => v.includes($) ? v.filter((y) => y !== $) : Xt([...v, $]));
  }
  function I($, v = !0, y = l) {
    const x = i().running != null, D = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (ne) => ee(ne.detail, $, v, y)
    });
    return D ? (x && k($ === "split" ? "Shot boundary queued…" : "Shot merge queued…"), D.done.then((ne) => ne.value ?? null)) : (k("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function ee($, v, y, x) {
    var re;
    const D = ($ == null ? void 0 : $.shotBoundaries) || [], ne = Number((re = L.videoFile) == null ? void 0 : re.duration) || G, te = vr(D), j = `shot-${v}:${L.id}:${x.toFixed(3)}:${ne.toFixed(3)}:${te}`;
    k(v === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const N = await Z(`/videos/${L.id}/shot-boundaries/${v}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: _e(j), timeSec: x })
      });
      return qe(j), C((W) => ({ ...W, shotBoundaries: N }), L.id), y && await U(
        "shots.update",
        v === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: D,
          fingerprint: te
        },
        {
          type: "shots",
          boundaries: N,
          fingerprint: vr(N)
        }
      ), k(v === "split" ? "Shot boundary added." : "Shots merged."), N;
    } catch (N) {
      return k(N.message || "Unable to edit shot boundaries."), null;
    }
  }
  return { applySegmentHistoryState: H, applyPerformerSlotHistoryState: J, applyHistoryState: oe, restoreHistoryTarget: ce, updateTimelineRatio: E, updateTimelineRatioFromPointer: ae, handleSeparatorPointerDown: le, handleSeparatorPointerMove: X, handleSeparatorKeyDown: de, panelWidthMaximum: xe, updatePanelWidth: Ce, handlePanelSeparatorPointer: Pe, panelSeparatorProps: fe, toggleSegmentRail: Y, toggleSegmentGroup: ye, mutateShotBoundary: I };
}
function Oc(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: u, emptyRecyclingBin: g, lineage: b, mediaDuration: h, mergeSelectedSwimlane: f, moveToBin: p, mutateShotBoundary: S, openPublishApprovedDialog: C, playbackControlsRef: m, playbackShortcutConfig: B, saveSelectedReviewState: U, seekRef: q, segmentGroupKeys: F, selectSegment: M, selectedSegment: T, selectedSegmentGroupForSegment: w, selectedSegmentGroupKey: k, selectedSegments: A, setCollapsedSegmentGroups: G, setIncorrectExamplesOpen: L, setQuickSearchOpen: R, setSaveMessage: H, setSelectedSegmentGroupKey: J, setTagEditing: _, setTimelineZoom: oe, shotBoundaries: ce, slotButtonRef: be, splitSegment: E, swimlanes: ae, timelineDuration: le, toggleIncorrectExample: X, toggleSegmentGroup: de, updateTimelineRatio: xe, videoFrameRate: Ce, visibleSegments: Pe } = e;
  function fe(I) {
    var ee, $;
    (ee = m.current) == null || ee.pause(), ($ = m.current) == null || $.seekBy(Cl(I, Ce));
  }
  function Y(I, ee) {
    if (A.length > 1 && cl(I.id))
      return;
    let $ = null;
    I.id === "video.playPause" && ($ = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.toggle();
    }), I.id === "video.seekSmallBackward" && ($ = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(-B.smallSeekTime);
    }), I.id === "video.seekSmallForward" && ($ = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(B.smallSeekTime);
    }), I.id === "video.seekMediumBackward" && ($ = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(-B.mediumSeekTime);
    }), I.id === "video.seekMediumForward" && ($ = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(B.mediumSeekTime);
    }), I.id === "video.seekLongBackward" && ($ = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(-B.longSeekTime);
    }), I.id === "video.seekLongForward" && ($ = () => {
      var v;
      return (v = m.current) == null ? void 0 : v.seekBy(B.longSeekTime);
    }), I.id === "video.playSelected" && T && ($ = () => {
      var v;
      (v = q.current) == null || v.call(q, T.startSec, !0), requestAnimationFrame(() => {
        var y;
        return (y = u.current) == null ? void 0 : y.focus({ preventScroll: !0 });
      });
    }), (I.id === "video.playPreviousSegment" || I.id === "video.playNextSegment") && ($ = () => {
      var y;
      const v = no(
        ae,
        T == null ? void 0 : T.id,
        I.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !v || v.id === (T == null ? void 0 : T.id) || (M(v, { focusEditor: !0, seekToSegment: !1 }), (y = q.current) == null || y.call(q, v.startSec, !0));
    }), I.id.startsWith("video.seekPercent") && ($ = () => {
      var y;
      const v = Number(I.id.slice(17)) / 10;
      (y = q.current) == null || y.call(q, il(h ?? le, v), !1);
    }), I.id === "video.jumpToSegmentStart" && T && ($ = () => {
      var v;
      return (v = q.current) == null ? void 0 : v.call(q, T.startSec, !1);
    }), I.id === "video.jumpToSegmentEnd" && T && ($ = () => {
      var v;
      return (v = q.current) == null ? void 0 : v.call(q, T.endSec ?? T.startSec, !1);
    }), I.id === "video.jumpToVideoStart" && ($ = () => {
      var v;
      return (v = q.current) == null ? void 0 : v.call(q, 0, !1);
    }), I.id === "video.jumpToVideoEnd" && ($ = () => {
      var v;
      return (v = q.current) == null ? void 0 : v.call(q, le, !1);
    }), I.id.startsWith("video.frame") && ($ = () => {
      const v = I.id.includes("Small") ? "small" : I.id.includes("Medium") ? "medium" : "long", y = B[`${v}FrameStep`] * (I.id.endsWith("Backward") ? -1 : 1);
      fe(y);
    }), I.id.startsWith("navigation.swimlane") && ($ = () => {
      const v = I.id.slice(19).toLowerCase(), y = no(ae, T == null ? void 0 : T.id, v, s);
      y && M(y, { focusEditor: !0, seekToSegment: !1 });
    }), (I.id === "navigation.extendSwimlaneLeft" || I.id === "navigation.extendSwimlaneRight") && ($ = () => {
      const v = wd(
        t,
        T == null ? void 0 : T.id,
        I.id.endsWith("Left") ? "left" : "right"
      );
      v && M(v.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: v.segmentIds
      });
    }), (I.id === "navigation.segmentGroupUp" || I.id === "navigation.segmentGroupDown") && ($ = () => {
      const v = Nd(
        F,
        k ?? w,
        I.id.endsWith("Up") ? -1 : 1
      );
      v && J(v);
    }), (I.id === "navigation.previousAtPlayhead" || I.id === "navigation.nextAtPlayhead") && ($ = () => {
      const v = qs(Pe, s, I.id === "navigation.previousAtPlayhead" ? -1 : 1, T == null ? void 0 : T.id);
      v && M(v, { focusEditor: !0, seekToSegment: !1 });
    }), I.id === "navigation.nearestInCurrentSwimlane" && ($ = () => {
      const v = Ps(
        ae,
        T == null ? void 0 : T.id,
        s
      );
      v && M(v, { focusEditor: !0, seekToSegment: !1 });
    }), I.id.includes("Unreviewed") && ($ = () => {
      const v = Sr(
        ae,
        T == null ? void 0 : T.id,
        I.id.startsWith("navigation.previous") ? -1 : 1,
        I.id.endsWith("Global")
      );
      v && M(v, { focusEditor: !ee.preserveFocus, seekToSegment: !1 });
    }), (I.id === "navigation.nextTouchingPlayhead" || I.id === "navigation.previousTouchingPlayhead") && ($ = () => {
      const v = Os(ae, s, I.id === "navigation.previousTouchingPlayhead" ? -1 : 1, T == null ? void 0 : T.id);
      v && M(v, { focusEditor: !0, seekToSegment: !1 });
    }), I.id === "navigation.quickSearch" && ($ = () => R(!0)), (I.id === "navigation.previousShot" || I.id === "navigation.nextShot") && ($ = () => {
      var y;
      const v = Il(ce, s, I.id === "navigation.previousShot" ? -1 : 1);
      v && ((y = q.current) == null || y.call(q, v.startSec, !1));
    }), I.id === "shot.split" && ($ = () => S("split")), I.id === "shot.merge" && ($ = () => S("merge")), I.id === "marker.create" && ($ = () => a()), I.id === "marker.duplicate" && ($ = () => d(!1)), I.id === "marker.duplicateAtPlayhead" && ($ = () => d(!0)), I.id === "marker.split" && ($ = () => E()), I.id === "marker.editTag" && ($ = () => {
      var v;
      if (A.length > 1 && A.some((y) => y.isDerived)) {
        H("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((v = b.data) != null && v.tagReadOnly) {
        H("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      _(!0);
    }), I.id === "marker.setStart" && T && ($ = () => r(s, T.endSec)), I.id === "marker.setEnd" && T && ($ = () => r(T.startSec, s)), I.id === "marker.copyTiming" && T && ($ = () => {
      H(Zd(T) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), I.id === "marker.pasteTiming" && T && ($ = () => {
      const v = Qd();
      if (!v) {
        H("No copied segment timing is available.");
        return;
      }
      r(v.startSec, v.endSec);
    }), I.id === "marker.mergeSelection" && ($ = () => f()), I.id === "marker.moveToBin" && ($ = () => p()), I.id === "marker.toggleIncorrectExample" && T && ($ = () => X()), I.id === "marker.openIncorrectExamples" && ($ = () => L(!0)), I.id === "markerGroup.toggleCollapse" && k && ($ = () => de(k)), I.id === "markerGroup.toggleAll" && ($ = () => G((v) => kd(v, F))), I.id === "marker.assignSlots" && ($ = () => {
      var v;
      return (v = be.current) == null ? void 0 : v.click();
    }), I.id === "navigation.zoomIn" && ($ = () => oe((v) => kr(v + 0.5))), I.id === "navigation.zoomOut" && ($ = () => oe((v) => kr(v - 0.5))), I.id === "navigation.resetZoom" && ($ = () => oe(1)), I.id === "navigation.centerPlayhead" && ($ = () => {
      var v;
      return (v = o.current) == null ? void 0 : v.call(o);
    }), I.id === "layout.growSwimlanes" && ($ = () => xe(c.timelineRatio + 0.05)), I.id === "layout.shrinkSwimlanes" && ($ = () => xe(c.timelineRatio - 0.05)), I.id === "marker.confirm" && T && ($ = () => U("approved")), I.id === "system.publishApproved" && ($ = () => C(ee.target)), I.id === "marker.reject" && T && ($ = () => U("rejected")), I.id === "system.emptyBin" && ($ = () => g()), I.id === "system.deleteRejected" && ($ = () => l()), $ && $();
  }
  function ye(I, ee) {
    const $ = Qn.find((v) => v.id === I);
    $ && $n($, i) && Y($, ee);
  }
  return {
    executeShortcutById: ye,
    stepVideoFrame: (I) => fe(I < 0 ? -1 : 1)
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
  const [s, l] = K(null), [d, c] = K(""), [u, g] = K({
    busy: !1,
    reviewState: null,
    error: ""
  }), b = ue(null);
  async function h(p) {
    const S = a("import", -1);
    if (!S) {
      g({ busy: !1, reviewState: null, error: "Wait for the current save to finish before importing Cove segments." });
      return;
    }
    g({ busy: !0, reviewState: p, error: "" });
    try {
      await Z(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: to(), reviewState: p })
      }), await t(), g({ busy: !1, reviewState: null, error: "" });
    } catch (C) {
      g({
        busy: !1,
        reviewState: null,
        error: C.message || "Unable to import Cove segments."
      });
    } finally {
      S();
    }
  }
  async function f(p) {
    try {
      const S = await Z(`/videos/${e}/analysis-runs`, {
        signal: p.signal
      });
      if (!p.isActive()) return null;
      const C = (S == null ? void 0 : S[0]) || null;
      return l(C), (C == null ? void 0 : C.status) === "completed" && b.current !== C.id && (b.current = C.id, await t()), ((C == null ? void 0 : C.status) === "failed" || (C == null ? void 0 : C.status) === "cancelled") && c(C.errorMessage || "Video analysis did not complete."), C;
    } catch (S) {
      return p.isActive() && S.name !== "AbortError" && c(S.message || "Unable to load video analysis status."), null;
    }
  }
  return pe(() => {
    if (!Ca(r)) {
      l(null), c("");
      return;
    }
    const p = $a();
    return f(p), p.dispose;
  }, [e, r]), pe(() => {
    if (!Ca(r) || (s == null ? void 0 : s.status) !== "queued" && (s == null ? void 0 : s.status) !== "running") return;
    const p = $a();
    let S = setTimeout(async function C() {
      await f(p), p.isActive() && (S = setTimeout(C, 2500));
    }, 2500);
    return () => {
      clearTimeout(S), p.dispose();
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
  const u = ue(null), [g, b] = K(null), [h, f] = K([]), p = ue(null), S = ue(null), C = ue([]), m = ue(null), [B, U] = K(() => Ot({})), [q, F] = K(!1), [M, T] = K(sl), [w, k] = K(0), A = ue(null), [G] = K(() => Pd({
    getContext: () => A.current,
    drainAfterSettle: !1
  })), L = Hl(G.subscribe, G.getSnapshot), R = wi(L), H = (P, ie) => G.acquire({ kind: P, lockId: ie }), J = (P) => G.enqueue(P), _ = (P) => G.stableIdentity(P), oe = ue(!1);
  pe(() => (oe.current = !0, () => {
    oe.current = !1, queueMicrotask(() => {
      oe.current || G.dispose();
    });
  }), []);
  const ce = (P) => G.cancel(P), be = (P, ie) => G.retarget(P, ie), E = G.getSnapshot, [ae, le] = Ul(Ud, []), [X, de] = K(""), [xe, Ce] = K(""), [Pe, fe] = K(""), [Y, ye] = K(1), [I, ee] = K(Wd), [$, v] = K(0), [y, x] = K({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [D, ne] = K(Vt), te = ue(Vt), [j, re] = K(!1), [N, W] = K(!1), [O, Q] = K(!1), he = ue(!1);
  he.current = O;
  const [me, Te] = K(null), [mt, je] = K(!1), [Re, Ze] = K(null), [it, gt] = K(null), et = ue(null), [ft, st] = K(!1), [ze, Je] = K(""), Ye = ue(null), We = ue(null), ut = ue(!1), [yt, V] = K(Vd), [se, ke] = K(null), [Me, ve] = K(!1), [tt, Ke] = K(!1), [Xe, Ie] = K(!1), [De, He] = K(!1), [Ae, Fe] = K(!1), [nt, Se] = K(""), {
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
    (P, ie) => G.acquire({ kind: P, lockId: ie })
  ), [at, Kt] = K(!1), [lt, Ne] = K(null), [we, Qe] = K(l), [At, xt] = K(0), [bt, St] = K(!1), [Pt, Et] = K(""), [Rr, Mr] = K(null), dn = ue(null), Mn = ue(null), An = ue(!1), [en, cn] = K([]), [Xn, Ar] = K(!1), [un, er] = K(null), mn = _d(), En = ue(null), tr = ue(null), gn = ue(null), nr = ue(s), rr = ue(null), pn = ue(null), tn = ue(null), Dn = ue(null), On = ue(null), wt = ue(null), zt = ue(null), Pn = ue(null), Ln = ue(null), or = ue(null), jn = ue(null), Fn = ue(null), ar = ue(-1e12), Er = ue(null), fn = ue(null), [Bn, Gn] = K({ scrollTop: 0, height: 512 });
  pe(() => {
    if (!at || bt || !Pt) return;
    const P = requestAnimationFrame(() => {
      var ie;
      return (ie = Mn.current) == null ? void 0 : ie.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(P);
  }, [at, bt, Pt]), pe(() => {
    if (!An.current || at || we) return;
    const P = requestAnimationFrame(() => {
      var ie;
      (ie = dn.current) == null || ie.focus({ preventScroll: !0 }), An.current = !1;
    });
    return () => cancelAnimationFrame(P);
  }, [at, we]);
  const $e = e.video, ht = e.segments || Hn, Dr = Ve(() => JSON.stringify({
    segments: ht.map((P) => [
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
    performerSlots: (e.performerSlots || Hn).map((P) => [
      P.segmentId,
      P.slotDefinitionId,
      P.performerId,
      P.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [ht, e.performerSlots, e.itemMetadata]);
  pe(() => {
    if (!l) {
      Ne(null), Qe(!1);
      return;
    }
    if (R != null) {
      Qe(!0);
      return;
    }
    let P = !0;
    Qe(!0);
    const ie = setTimeout(() => {
      Z(`/videos/${$e.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Ue) => {
        P && (Ne(Ue), Et(""));
      }).catch((Ue) => {
        P && (Ne(null), Et(Ue.message || "Unable to preview derived segments."));
      }).finally(() => {
        P && Qe(!1);
      });
    }, 150);
    return () => {
      P = !1, clearTimeout(ie);
    };
  }, [l, $e.id, Dr, At, R]);
  const Or = () => xt((P) => P + 1), Lt = e.segmentGroups || Hn, vt = e.performerSlots || Hn, Pr = l && e.performerSlotsAvailable !== !1, yn = Ve(
    () => (e.performerCandidates || []).filter((P) => P.isVideoPerformer),
    [e.performerCandidates]
  ), bn = e.shotBoundaries || Hn, nn = Ve(
    () => yi(vt),
    [vt]
  ), Kn = Ve(
    () => ht.map((P) => {
      const ie = nn.get(P.id) || [];
      return {
        ...P,
        slots: ie,
        assignment: ie.every((Ue) => Ue.performerId == null) ? Fl(ie, yn) : null
      };
    }).filter((P) => P.slots.length > 0 && P.assignment != null),
    [ht, nn, yn]
  ), Lr = Number((Fo = $e.videoFile) == null ? void 0 : Fo.frameRate) > 0 ? Number($e.videoFile.frameRate) : 30;
  function hn() {
    const P = he.current;
    Q(!1), P && requestAnimationFrame(() => {
      var ie;
      return (ie = wt.current) == null ? void 0 : ie.focus({ preventScroll: !0 });
    });
  }
  function Ut() {
    R == null && (Fn.current = null, je(!1), de(""), requestAnimationFrame(() => {
      var P;
      return (P = wt.current) == null ? void 0 : P.focus({ preventScroll: !0 });
    }));
  }
  function rn() {
    F(!1), requestAnimationFrame(() => {
      var P, ie;
      (P = Pn.current) != null && P.isConnected ? Pn.current.focus({ preventScroll: !0 }) : (ie = wt.current) == null || ie.focus({ preventScroll: !0 });
    });
  }
  pe(() => {
    jn.current === g ? (jn.current = null, Q(!0)) : Q(!1);
  }, [g]), pe(() => {
    var ie;
    if (!O) return;
    const P = (ie = or.current) == null ? void 0 : ie.querySelector("input");
    document.activeElement !== P && (P == null || P.focus({ preventScroll: !0 }), P == null || P.select());
  }, [O, g]), pe(() => {
    var ie;
    if (O) return;
    const P = (ie = wt.current) == null ? void 0 : ie.ownerDocument;
    P && P.activeElement === P.body && wt.current.focus({ preventScroll: !0 });
  }, [O]), pe(() => {
    var Ue, dt, jt;
    const P = an(
      Ur(
        e.segments,
        e.performerSlots || [],
        Ot({}),
        l && M,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), ie = ((Ue = e.segments.find((wn) => wn.id === s)) == null ? void 0 : Ue.id) ?? ((dt = qa(P)) == null ? void 0 : dt.id) ?? null;
    b(ie), f(ie == null ? [] : [ie]), S.current = ie, C.current = [], ke(Ft(P, ie)), U(Ot({})), F(!1), Fn.current = null, je(!1), ye(1), de(""), ne(Vt), te.current = Vt, re(!1), (jt = wt.current) == null || jt.focus({ preventScroll: !0 });
  }, [$e.id, s]), pe(() => {
    const P = new AbortController();
    return Z(`/videos/${$e.id}/incorrect-examples`, { signal: P.signal }).then(cn).catch((ie) => {
      ie.name !== "AbortError" && cn([]);
    }), () => P.abort();
  }, [$e.id, d == null ? void 0 : d.effectiveMode]), pe(() => {
    const P = new AbortController();
    return Z(`/videos/${$e.id}/history`, { signal: P.signal }).then((ie) => {
      const Ue = ie || Vt;
      te.current = Ue, ne(Ue);
    }).catch((ie) => {
      ie.name !== "AbortError" && de(ie.message || "Unable to load editor history.");
    }), () => P.abort();
  }, [$e.id]), pe(() => {
    Yd(I);
  }, [I.timelineRatio, I.markerRailOpen, I.detailWidth, I.markerRailWidth, I.swimlaneTitleWidth]), pe(() => {
    Jd(yt);
  }, [yt]), pe(() => {
    ll(M);
  }, [M]), pe(() => {
    const P = pn.current;
    if (!a || !P || typeof ResizeObserver > "u") return;
    const ie = () => {
      var jt;
      const dt = Math.max(0, P.clientHeight - (((jt = tn.current) == null ? void 0 : jt.offsetHeight) || 0));
      v(dt), ee((wn) => {
        const Uo = lo(wn.timelineRatio, dt);
        return Uo === wn.timelineRatio ? wn : { ...wn, timelineRatio: Uo };
      });
    }, Ue = new ResizeObserver(ie);
    return Ue.observe(P), tn.current && Ue.observe(tn.current), ie(), () => Ue.disconnect();
  }, [a]), pe(() => {
    if (!mn || typeof ResizeObserver > "u") return;
    const P = On.current, ie = Dn.current;
    if (!P || !ie) return;
    const Ue = () => x({
      workspace: P.clientWidth,
      focusRow: ie.clientWidth,
      focusRowHeight: ie.clientHeight
    }), dt = new ResizeObserver(Ue);
    return dt.observe(P), dt.observe(ie), Ue(), () => dt.disconnect();
  }, [mn, I.markerRailOpen]);
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
        B,
        l && M,
        Lt
      ),
      en,
      !0
    ),
    [
      Ht,
      vt,
      B,
      M,
      Lt,
      l,
      en
    ]
  ), jr = Object.fromEntries(It.map((P) => [P, Wt.filter((ie) => ie.reviewState === P).length])), Fr = ba(
    Ur(
      Ht,
      vt,
      { ...B, reviewStates: It },
      l && M,
      Lt
    ),
    en,
    !0
  ), Br = Object.fromEntries(It.map((P) => [P, Fr.filter((ie) => ie.reviewState === P).length])), vn = [...new Set(Ht.map((P) => P.sourceKey).filter(Boolean))].sort((P, ie) => Gt(P).localeCompare(Gt(ie))), xn = Qs(
    B,
    l && M
  ), z = Ve(
    () => an(Wt, Lt, vt),
    [Wt, Lt, vt]
  ), Be = Ve(
    () => Sd(z, yt),
    [z, yt]
  ), Ge = el(
    z,
    g,
    s,
    {
      visibleLanes: Be,
      reference: ((Bo = u.current) == null ? void 0 : Bo.videoId) === $e.id ? u.current.reference : null
    }
  );
  pe(() => {
    const P = br(z, Ge == null ? void 0 : Ge.id);
    P && (u.current = { videoId: $e.id, reference: P });
  }, [$e.id, Ge == null ? void 0 : Ge.id, z]);
  const $t = Ve(() => {
    const P = Bd(ae);
    return P.length === 0 ? ht : [...ht, ...P];
  }, [ht, ae]), ge = Ge == null ? null : $t.find((P) => P.id === Ge.id) || Ge, kt = Xo($t, Xo(Wt, h).map((P) => P.id)), ir = !l && kt.length > 0 && kt.every((P) => P.nativeSegmentId != null), xo = Wt.map((P) => P.id), Pi = xo.join("|");
  p.current = (ge == null ? void 0 : ge.id) ?? null;
  const So = nn.get(ge == null ? void 0 : ge.id) || [], Li = fo(So), ko = Ve(
    () => vd(z, h),
    [z, h]
  ), sr = Ve(() => yo(z), [z]), zn = Ve(
    () => bd(sr, yt),
    [sr, yt]
  ), ji = Ve(
    () => hi(
      zn.rows,
      Bn.scrollTop,
      Bn.height
    ),
    [zn, Bn]
  ), Fi = Sr(Be, ge == null ? void 0 : ge.id, -1, !0) != null, Bi = Sr(Be, ge == null ? void 0 : ge.id, 1, !0) != null, Sn = ge ? Ft(z, ge.id) : null, Gr = bi(sr) ? sr.map((P) => P.key) : [], Gi = Gr.join("|"), lr = Math.max(
    0,
    Number((Go = $e.videoFile) == null ? void 0 : Go.duration) || 0,
    ...Ht.map((P) => Number(P.endSec ?? P.startSec) || 0)
  ), wo = Number((Ko = $e.videoFile) == null ? void 0 : Ko.duration) > 0 ? Number($e.videoFile.duration) : null;
  D.actions;
  const Ki = ti();
  pe(() => {
    const P = g === Cn ? g : (ge == null ? void 0 : ge.id) ?? null;
    P !== g && b(P);
  }, [ge, g]), pe(() => {
    f((P) => {
      const ie = ol(
        P,
        xo,
        (ge == null ? void 0 : ge.id) ?? null
      );
      return ie.length === P.length && ie.every((Ue, dt) => Ue === P[dt]) ? P : ie;
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
    Sn && V((P) => Si(P, Sn));
  }, [$e.id, s, Sn]), pe(() => {
    ke((P) => Id(Gr, P, Sn));
  }, [$e.id, Gi, Sn]), pe(() => {
    if (!I.markerRailOpen || (ge == null ? void 0 : ge.id) == null) return;
    const P = fn.current, ie = zn.rows.find((jt) => jt.kind === "segment" && jt.segment.id === ge.id);
    if (!P || !ie) return;
    const Ue = ie.top + ie.height;
    let dt = P.scrollTop;
    ie.top < P.scrollTop ? dt = ie.top : Ue > P.scrollTop + P.clientHeight && (dt = Math.max(0, Ue - P.clientHeight)), dt !== P.scrollTop && (P.scrollTop = dt), Gn({ scrollTop: dt, height: P.clientHeight });
  }, [ge == null ? void 0 : ge.id, zn, I.markerRailOpen]), pe(() => {
    const P = fn.current;
    if (!I.markerRailOpen || !P) return;
    const ie = () => Gn({
      scrollTop: P.scrollTop,
      height: P.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      ie();
      return;
    }
    const Ue = new ResizeObserver(ie);
    return Ue.observe(P), ie(), () => Ue.disconnect();
  }, [I.markerRailOpen]);
  const { revealSegmentGroupForSelection: No, replaceSegmentSelection: Ui, selectSegment: Io, selectSegmentCollection: Hi, selectAllVideoSegments: _i } = Mc({
    allSwimlanes: z,
    editorRef: wt,
    performerSlots: vt,
    seekRef: En,
    segmentGroups: Lt,
    segments: ht,
    selectedSegmentId: g,
    selectedSegmentIds: h,
    selectionAnchorIdRef: S,
    selectionRangeBaseIdsRef: C,
    setCollapsedSegmentGroups: V,
    setEditorFilters: U,
    setHideDerivedSegments: T,
    setSaveMessage: de,
    setSelectedSegmentGroupKey: ke,
    setSelectedSegmentId: b,
    setSelectedSegmentIds: f
  }), { acceptHistory: zr, recordHistoryAction: dr, mutateSegment: qi, runSegmentMutation: Wi, completeReview: Vi, createSegment: Co, splitSegment: $o, duplicateSegment: To, saveTiming: Ji, applyShortcutTiming: Yi } = Hd({
    compatibilityMode: l,
    currentTime: w,
    detail: e,
    editorFilters: B,
    endInput: Pe,
    hideDerivedSegments: M,
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
    enqueueSave: J,
    pendingChanges: ae,
    retargetSaveTasks: be,
    replaceSegmentSelection: Ui,
    savingSegmentId: R,
    segments: ht,
    selectedSegment: ge,
    selectedSegmentIdRef: p,
    selectedSegments: kt,
    selectionAnchorIdRef: S,
    selectionRangeBaseIdsRef: C,
    setCreatingSegmentId: Te,
    setEditorFilters: U,
    setFirstSegmentTagOpen: je,
    setHideDerivedSegments: T,
    setHistory: ne,
    setHistoryOpen: re,
    setPublishApprovedError: Je,
    setSaveMessage: de,
    acquireSaveLock: H,
    dispatchPendingChanges: le,
    setSelectedSegmentGroupKey: ke,
    setSelectedSegmentId: b,
    setSelectedSegmentIds: f,
    setTagEditing: Q,
    startInput: xe,
    tagEditingRef: he,
    timelineDuration: lr,
    video: $e
  });
  function Ro(P = null) {
    var dt;
    if (!l || R != null || !ht.some((jt) => !jt.published && jt.reviewState === "approved")) return;
    const ie = ((dt = wt.current) == null ? void 0 : dt.ownerDocument) ?? document, Ue = ie.activeElement === ie.body ? null : ie.activeElement;
    We.current = P != null && P.isConnected && P !== ie.body ? P : Ue, Je(""), st(!0);
  }
  function Mo() {
    R == null && (st(!1), Je(""), requestAnimationFrame(() => {
      Lc(
        We.current,
        wt.current
      ), We.current = null;
    }));
  }
  async function Qi() {
    await Vi() && Mo();
  }
  const { closeMergeConfirmation: Zi, mergeSelectedSwimlane: Ao, saveSelectedReviewState: Xi } = Ac({
    acceptHistory: zr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: m,
    getSaveQueueSnapshot: E,
    historyRef: te,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: dr,
    revealSegmentGroupForSelection: No,
    savingSegmentId: R,
    selectedGroups: ko,
    selectedSegment: ge,
    selectedSegmentIdRef: p,
    selectedSegments: kt,
    selectionAnchorIdRef: S,
    selectionRangeBaseIdsRef: C,
    setMergeConfirmation: Ze,
    setSaveMessage: de,
    acquireSaveLock: H,
    dispatchPendingChanges: le,
    enqueueSave: J,
    stableSaveIdentity: _,
    setSelectedSegmentId: b,
    setSelectedSegmentIds: f,
    video: $e
  }), es = (P) => {
    const ie = (P || []).map(Tt);
    G.cancel((Ue) => Ue.kind === "review" && bo(Ue.targets, ie));
  }, ts = G.settledCount();
  ua(() => {
    G.markCommitted(ts), A.current = {
      detail: e,
      segments: ht,
      onConflict: r,
      onDetailChange: t,
      onReload: o,
      tagEditing: O,
      selectedSegmentIds: h,
      activeSegmentId: (ge == null ? void 0 : ge.id) ?? null
    };
  }), pe(() => {
    G.poke();
  });
  const { toggleIncorrectExample: ns, removeIncorrectExample: rs, captureTrainingExport: os, deleteRejectedSegments: Eo, autoAssignPerformers: as, previewDerivedSegments: is, closeMaterializeDialog: ss, materializeDerivedSegments: ls, saveTag: ds, moveToBin: cs, emptyRecyclingBin: us } = Ec({
    acceptHistory: zr,
    allSwimlanes: z,
    autoAssignCandidates: Kn,
    autoAssigning: Ae,
    binEmptyingRef: ut,
    canMoveSelectionToBin: ir,
    closeTagEditing: hn,
    compatibilityMode: l,
    creatingSegmentId: me,
    detail: e,
    editorFilters: B,
    editorRef: wt,
    exportingExamples: Xn,
    hideDerivedSegments: M,
    incorrectExamples: en,
    lineage: Kr,
    materializeButtonRef: dn,
    materializePreview: lt,
    materializeRestoreFocusRef: An,
    materializing: bt,
    mutateSegment: qi,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: vt,
    cancelSaveTasks: ce,
    dispatchPendingChanges: le,
    enqueueSave: J,
    stableSaveIdentity: _,
    pendingChanges: ae,
    runSegmentMutation: Wi,
    recordHistoryAction: dr,
    refreshMaterializationPreview: Or,
    removingExampleId: un,
    revealSegmentGroupForSelection: No,
    savingSegmentId: R,
    segmentGroups: Lt,
    segments: ht,
    selectedSegment: ge,
    selectedSegmentIdRef: p,
    selectedSegments: kt,
    selectionAnchorIdRef: S,
    selectionRangeBaseIdsRef: C,
    setAutoAssignError: Se,
    setAutoAssignOpen: He,
    setAutoAssigning: Fe,
    setEditorFilters: U,
    setExportingExamples: Ar,
    setHideDerivedSegments: T,
    setIncorrectExamples: cn,
    setMaterializeError: Et,
    setMaterializeLoading: Qe,
    setMaterializeOpen: Kt,
    setMaterializePreview: Ne,
    setMaterializing: St,
    setRemovingExampleId: er,
    setRejectedDeletionPreview: gt,
    setSaveMessage: de,
    acquireSaveLock: H,
    setSelectedSegmentGroupKey: ke,
    setSelectedSegmentId: b,
    setSelectedSegmentIds: f,
    swimlanes: Be,
    video: $e
  }), { restoreHistoryTarget: ms, updateTimelineRatio: Do, handleSeparatorPointerDown: gs, handleSeparatorPointerMove: ps, handleSeparatorKeyDown: fs, panelWidthMaximum: Oo, panelSeparatorProps: ys, toggleSegmentRail: bs, toggleSegmentGroup: Po, mutateShotBoundary: hs } = Dc({
    acceptHistory: zr,
    compatibilityMode: l,
    currentTime: w,
    detail: e,
    editorLayout: I,
    focusRowRef: Dn,
    history: D,
    historyRef: te,
    historySaving: N,
    horizontalLayoutSize: y,
    mediaStackHeight: $,
    mediaStackRef: pn,
    commonActionsRef: tn,
    onDetailChange: t,
    onReload: o,
    railToggleRef: zt,
    recordHistoryAction: dr,
    savingSegmentId: R,
    setCollapsedSegmentGroups: V,
    setEditorLayout: ee,
    setHistorySaving: W,
    setIncorrectExamples: cn,
    setSaveMessage: de,
    acquireSaveLock: H,
    enqueueSave: J,
    getSaveQueueSnapshot: E,
    shotBoundaries: bn,
    timelineDuration: lr,
    video: $e,
    workspaceRef: On
  }), { executeShortcutById: Lo, stepVideoFrame: vs } = Oc({
    allSwimlanes: z,
    applyShortcutTiming: Yi,
    centerTimelineRef: rr,
    compatibilityMode: l,
    createSegment: Co,
    currentTime: w,
    deleteRejectedSegments: Eo,
    duplicateSegment: To,
    editorLayout: I,
    editorRef: wt,
    emptyRecyclingBin: us,
    lineage: Kr,
    mediaDuration: wo,
    mergeSelectedSwimlane: Ao,
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
    setCollapsedSegmentGroups: V,
    setIncorrectExamplesOpen: Ie,
    setQuickSearchOpen: Ke,
    setSaveMessage: de,
    setSelectedSegmentGroupKey: ke,
    setTagEditing: Q,
    setTimelineZoom: ye,
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
  const xs = Ve(() => Qn.map((P) => ({
    id: P.id,
    enabled: $n(P, l),
    surface: "local",
    action: (ie) => {
      var Ue;
      return (Ue = gn.current) == null ? void 0 : Ue.call(gn, P.id, ie);
    }
  })), [l]);
  Pa(ao, xs);
  const Ss = so($), ks = on(I.markerRailWidth, Oo("markerRailWidth")), ws = on(I.detailWidth, Oo("detailWidth"));
  return n(Rc, {
    activeFilterCount: xn,
    allSwimlanes: z,
    analysisError: Le,
    analysisRun: Oe,
    approvalFacetCounts: Br,
    autoAssignCandidates: Kn,
    autoAssignError: nt,
    autoAssignOpen: De,
    autoAssignPerformers: as,
    autoAssigning: Ae,
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
    closePublishApprovedDialog: Mo,
    closeTagEditing: hn,
    collapsedSegmentGroups: yt,
    commonActionsRef: tn,
    compatibilityMode: l,
    configuringTag: Rr,
    createSegment: Co,
    currentTime: w,
    deleteRejectedSegments: Eo,
    detail: e,
    detailPanelRef: m,
    detailWidth: ws,
    duplicateSegment: To,
    editorFilters: B,
    editorLayout: I,
    editorRef: wt,
    exportingExamples: Xn,
    filtersButtonRef: Pn,
    filtersOpen: q,
    firstSegmentTagOpen: mt,
    focusRowRef: Dn,
    handleSeparatorKeyDown: fs,
    handleSeparatorPointerDown: gs,
    handleSeparatorPointerMove: ps,
    hideDerivedSegments: M,
    history: D,
    historyOpen: j,
    historySaving: N,
    hasNextUnreviewed: Bi,
    hasPreviousUnreviewed: Fi,
    horizontalLayoutSize: y,
    importNativeSegments: pt,
    incorrectExamples: en,
    incorrectExamplesOpen: Xe,
    removingExampleId: un,
    lineage: Kr,
    markerRailWidth: ks,
    materializeButtonRef: dn,
    materializeCancelButtonRef: Mn,
    materializeDerivedSegments: ls,
    materializeError: Pt,
    materializeLoading: we,
    materializeOpen: at,
    materializePreview: lt,
    materializing: bt,
    mediaStackRef: pn,
    mergeCancelButtonRef: et,
    mergeConfirmation: Re,
    mergeSaving: Od(L, "merge"),
    mergeSelectedSwimlane: Ao,
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
    setSaveMessage: de,
    saveTag: ds,
    saveTiming: Ji,
    savingSegmentId: R,
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
    setConfiguringTag: Mr,
    setCurrentTime: k,
    setEditorFilters: U,
    setEditorLayout: ee,
    setFiltersOpen: F,
    setHideDerivedSegments: T,
    setHistoryOpen: re,
    setIncorrectExamplesOpen: Ie,
    setQuickSearchOpen: Ke,
    setRejectedDeletionPreview: gt,
    setRailViewport: Gn,
    setSelectedSegmentGroupKey: ke,
    setSelectedSegmentId: b,
    setShortcutsOpen: ve,
    setTimelineZoom: ye,
    shotBoundaries: bn,
    shortcutsOpen: Me,
    slotButtonRef: Ln,
    splitLayout: a,
    splitSegment: $o,
    tagEditing: O,
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
  [...t].sort((f, p) => (f.sortOrder ?? 0) - (p.sortOrder ?? 0) || Number(f.id) - Number(p.id)).forEach((f, p) => {
    [...f.tags || []].sort((S, C) => (S.sortOrder ?? 0) - (C.sortOrder ?? 0) || Number(S.tagId) - Number(C.tagId)).forEach((S, C) => r.set(Number(S.tagId), {
      key: `group:${f.id}`,
      id: f.id,
      name: f.name,
      sortOrder: f.sortOrder ?? p,
      tagSortOrder: S.sortOrder ?? C
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(f, p) {
    const S = Number(f);
    if (!o.has(S)) {
      const C = r.get(S);
      o.set(S, {
        tagId: S,
        name: p || `Tag ${S}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (C == null ? void 0 : C.key) || "ungrouped",
        segmentGroupId: (C == null ? void 0 : C.id) ?? null,
        segmentGroupName: (C == null ? void 0 : C.name) || "Ungrouped",
        segmentGroupSortOrder: (C == null ? void 0 : C.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (C == null ? void 0 : C.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(S);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((f) => {
    const p = i(f.sourceTagId, f.sourceTagName), S = i(f.derivedTagId, f.derivedTagName);
    p.outgoingRuleCount++, S.incomingRuleCount++;
    const C = `${p.tagId}:${S.tagId}`;
    a.has(C) || a.set(C, {
      id: C,
      sourceTagId: p.tagId,
      derivedTagId: S.tagId,
      rules: [],
      edgeCount: 0
    });
    const m = a.get(C);
    m.rules.push(f), m.edgeCount += Number(f.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((f) => [f.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((f) => {
    var p, S;
    (p = d.get(f.sourceTagId)) == null || p.add(f.derivedTagId), (S = d.get(f.derivedTagId)) == null || S.add(f.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), u = [];
  for (const f of s) {
    if (c.has(f.tagId)) continue;
    const p = [f.tagId], S = [];
    for (c.add(f.tagId); p.length > 0; ) {
      const M = p.shift();
      S.push(M);
      for (const T of d.get(M) || [])
        c.has(T) || (c.add(T), p.push(T));
    }
    const C = new Set(S), m = S.map((M) => o.get(M)), B = l.filter((M) => C.has(M.sourceTagId) && C.has(M.derivedTagId)), U = B.flatMap((M) => M.rules), q = m.filter((M) => M.outgoingRuleCount === 0).sort((M, T) => Nt(M.name, T.name)), F = q.length > 0 ? q : [...m].sort((M, T) => Nt(M.name, T.name));
    u.push({
      id: [...S].sort((M, T) => M - T).join(":"),
      label: F.length > 1 ? `${F[0].name} + ${F.length - 1}` : ((h = F[0]) == null ? void 0 : h.name) || "Derivation component",
      nodes: m,
      connections: B,
      rules: U,
      segmentGroupKeys: [...new Set(m.map((M) => M.segmentGroupKey))],
      materializedEdgeCount: U.reduce(
        (M, T) => M + (Number(T.edgeCount) || 0),
        0
      )
    });
  }
  u.sort((f, p) => p.rules.length - f.rules.length || Nt(f.label, p.label));
  const g = /* @__PURE__ */ new Map();
  s.forEach((f) => {
    g.has(f.segmentGroupKey) || g.set(f.segmentGroupKey, {
      key: f.segmentGroupKey,
      id: f.segmentGroupId,
      name: f.segmentGroupName,
      sortOrder: f.segmentGroupSortOrder,
      nodes: [],
      ruleIds: /* @__PURE__ */ new Set(),
      componentIds: /* @__PURE__ */ new Set()
    }), g.get(f.segmentGroupKey).nodes.push(f);
  }), u.forEach((f) => {
    f.nodes.forEach((p) => {
      var S;
      return (S = g.get(p.segmentGroupKey)) == null ? void 0 : S.componentIds.add(f.id);
    }), f.rules.forEach((p) => {
      var S, C;
      (S = g.get(o.get(Number(p.sourceTagId)).segmentGroupKey)) == null || S.ruleIds.add(p.id), (C = g.get(o.get(Number(p.derivedTagId)).segmentGroupKey)) == null || C.ruleIds.add(p.id);
    });
  });
  const b = [...g.values()].sort((f, p) => f.sortOrder - p.sortOrder || Nt(f.name, p.name)).map((f) => ({
    ...f,
    ruleCount: f.ruleIds.size,
    componentCount: f.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: u,
    segmentGroups: b
  };
}
function Kc(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const u = new Map(e.nodes.map((w) => [w.tagId, /* @__PURE__ */ new Set()])), g = new Map(e.nodes.map((w) => [w.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((w) => {
    var k, A;
    (k = u.get(w.sourceTagId)) == null || k.add(w.derivedTagId), (A = g.get(w.derivedTagId)) == null || A.add(w.sourceTagId);
  });
  const b = new Map(e.nodes.map((w) => {
    var k;
    return [
      w.tagId,
      ((k = g.get(w.tagId)) == null ? void 0 : k.size) || 0
    ];
  })), h = new Map(e.nodes.map((w) => [w.tagId, 0])), f = e.nodes.filter((w) => b.get(w.tagId) === 0).sort((w, k) => Nt(w.name, k.name)).map((w) => w.tagId), p = /* @__PURE__ */ new Set();
  for (; f.length > 0; ) {
    const w = f.shift();
    if (!p.has(w)) {
      p.add(w);
      for (const k of u.get(w) || [])
        h.set(k, Math.max(h.get(k) || 0, (h.get(w) || 0) + 1)), b.set(k, b.get(k) - 1), b.get(k) === 0 && f.push(k);
    }
  }
  p.size !== e.nodes.length && e.nodes.filter((w) => !p.has(w.tagId)).sort((w, k) => Nt(w.name, k.name)).forEach((w) => h.set(w.tagId, 0));
  const S = Math.max(0, ...h.values()), C = Math.max(
    t,
    240 + S * 296
  ), m = /* @__PURE__ */ new Map();
  e.nodes.forEach((w) => {
    m.has(w.segmentGroupKey) || m.set(w.segmentGroupKey, {
      key: w.segmentGroupKey,
      id: w.segmentGroupId,
      name: w.segmentGroupName,
      sortOrder: w.segmentGroupSortOrder,
      nodes: []
    }), m.get(w.segmentGroupKey).nodes.push(w);
  });
  const B = [...m.values()].sort((w, k) => w.sortOrder - k.sortOrder || Nt(w.name, k.name));
  let U = 28;
  const q = [], F = B.map((w) => {
    const k = /* @__PURE__ */ new Map();
    w.nodes.forEach((H) => {
      const J = h.get(H.tagId) || 0;
      k.has(J) || k.set(J, []), k.get(J).push(H);
    });
    for (const H of k.values())
      H.sort((J, _) => J.segmentGroupTagSortOrder - _.segmentGroupTagSortOrder || Nt(J.name, _.name));
    const A = Math.max(1, ...[...k.values()].map((H) => H.length)), G = A * 58 + (A - 1) * 18, L = 70 + G, R = {
      ...w,
      x: 12,
      y: U,
      width: C - 24,
      height: L
    };
    for (const [H, J] of k.entries()) {
      const _ = J.length * 58 + Math.max(0, J.length - 1) * 18, oe = (G - _) / 2;
      J.forEach((ce, be) => q.push({
        ...ce,
        rank: H,
        x: 28 + H * 296,
        y: U + 34 + 18 + oe + be * 76,
        width: 184,
        height: 58
      }));
    }
    return U += L + 16, R;
  }), M = new Map(q.map((w) => [w.tagId, w])), T = e.connections.map((w) => {
    const k = M.get(w.sourceTagId), A = M.get(w.derivedTagId), G = k.x + k.width, L = k.y + k.height / 2, R = A.x, H = A.y + A.height / 2, J = Math.max(48, (R - G) * 0.48);
    return {
      ...w,
      path: `M ${G} ${L} C ${G + J} ${L}, ${R - J} ${H}, ${R} ${H}`
    };
  });
  return {
    width: C,
    height: Math.max(r, U - 16 + 28),
    nodes: q,
    connections: T,
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
    }), u = 20, g = o, b = c.nodes.map((f) => ({
      ...f,
      x: f.x + u,
      y: f.y + g
    })), h = new Map(b.map((f) => [f.tagId, f]));
    a.push(...b), l.push(...c.groups.map((f) => ({
      ...f,
      componentId: d.id,
      x: f.x + u,
      y: f.y + g
    }))), s.push(...c.connections.map((f) => {
      const p = h.get(f.sourceTagId), S = h.get(f.derivedTagId), C = p.x + p.width, m = p.y + p.height / 2, B = S.x, U = S.y + S.height / 2, q = Math.max(48, (B - C) * 0.48);
      return {
        ...f,
        componentId: d.id,
        path: `M ${C} ${m} C ${C + q} ${m}, ${B - q} ${U}, ${B} ${U}`
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
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: u, editorRef: g, emptyDraft: b, graph: h, layout: f, listSort: p, materializationOffer: S, materializeOutgoingRules: C, materializeRule: m, message: B, normalizedQuery: U, query: q, refreshConfiguredTag: F, revealEditor: M, rules: T, save: w, segmentGroupKey: k, selectedNode: A, selectedRule: G, selection: L, setConfiguringTag: R, setDraft: H, setListSort: J, setMaterializationOffer: _, setQuery: oe, setSegmentGroupKey: ce, setSelection: be, setView: E, sortedVisibleRules: ae, sourceSlots: le, sourceSlotsLoading: X, updateMapping: de, updateTag: xe, view: Ce, visibleComponents: Pe, visibleRules: fe } = e;
  function Y(v) {
    const y = h.nodes.find((D) => D.tagId === Number(v.sourceTagId)), x = h.nodes.find((D) => D.tagId === Number(v.derivedTagId));
    return (y == null ? void 0 : y.segmentGroupKey) === (x == null ? void 0 : x.segmentGroupKey) ? y.segmentGroupKey : "cross-group";
  }
  function ye() {
    return n("div", { key: "editor", ref: g, className: "space-y-4 p-4" }, [
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
              onChange: (v, y) => xe("source", v, y == null ? void 0 : y.label),
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
              onChange: (v, y) => xe("derived", v, y == null ? void 0 : y.label),
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
          ...d.slotMappings.map((v, y) => n("div", { key: y, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: v.sourceSlotDefinitionId,
              disabled: r,
              onChange: (x) => de(y, "sourceSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${y + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...le.map((x) => n("option", { key: x.id, value: x.id }, Ct(x)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: v.derivedSlotDefinitionId,
              disabled: r,
              onChange: (x) => de(y, "derivedSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${y + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((x) => n("option", { key: x.id, value: x.id }, Ct(x)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => H((x) => ({
                ...x,
                slotMappings: x.slotMappings.filter((D, ne) => ne !== y)
              })),
              className: `${o} shrink-0 text-red-300`,
              "aria-label": `Remove performer slot mapping ${y + 1}`,
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
  function I() {
    if (A) {
      const x = fe.filter((te) => Number(te.derivedTagId) === A.tagId), D = fe.filter((te) => Number(te.sourceTagId) === A.tagId), ne = (te, j, re) => n("div", {
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
          re ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => m(te),
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
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, A.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, A.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${A.incomingRuleCount} incoming · ${A.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (te) => R({
            tagId: A.tagId,
            tagName: A.name,
            trigger: te.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        D.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => C(A, D),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${D.length})`) : null,
        D.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...D.map((te) => ne(te, "Derives", !0))
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
            x.map((te) => ne(te, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!G)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const v = h.nodes.find((x) => x.tagId === Number(G.sourceTagId)), y = h.nodes.find((x) => x.tagId === Number(G.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (v == null ? void 0 : v.segmentGroupName) || "Ungrouped"),
          (v == null ? void 0 : v.segmentGroupKey) !== (y == null ? void 0 : y.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(y == null ? void 0 : y.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${G.sourceTagName} → ${G.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${G.edgeCount} materialized lineage edge${G.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (S == null ? void 0 : S.ruleId) === G.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => m(G, S),
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
        G.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : G.slotMappings.map((x, D) => n("div", {
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
          G.createdAt ? new Date(G.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          G.updatedAt ? new Date(G.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => m(G),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => u(G),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(G),
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
    const v = A == null ? void 0 : A.tagId, y = /* @__PURE__ */ new Set();
    return A && (y.add(A.tagId), f.connections.forEach((x) => {
      (x.sourceTagId === A.tagId || x.derivedTagId === A.tagId) && (y.add(x.sourceTagId), y.add(x.derivedTagId));
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
        ...f.groups.map((x) => n("div", {
          key: `group:${x.componentId}:${x.key}`,
          className: `absolute rounded-xl border ${k === x.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
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
          ...f.connections.map((x) => {
            const D = v === x.sourceTagId || v === x.derivedTagId, ne = A != null, te = D ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${x.id}:visible`,
              d: x.path,
              fill: "none",
              stroke: te,
              strokeWidth: D ? 2.5 : 1.5,
              opacity: ne && !D ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...f.nodes.map((x) => {
          const D = !U || x.name.toLocaleLowerCase().includes(U), ne = A != null, te = y.has(x.tagId), j = (A == null ? void 0 : A.tagId) === x.tagId;
          return n("button", {
            key: `node:${x.tagId}`,
            type: "button",
            onClick: () => be({ type: "node", id: x.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${j ? "border-accent bg-accent/15 ring-2 ring-accent/25" : te ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${x.x}px`,
              top: `${x.y}px`,
              width: `${x.width}px`,
              height: `${x.height}px`,
              opacity: !D || ne && !te ? 0.62 : 1
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
        ...f.connections.filter((x) => x.rules.length > 1).map((x) => {
          const D = f.nodes.find((te) => te.tagId === x.sourceTagId), ne = f.nodes.find((te) => te.tagId === x.derivedTagId);
          return n("div", {
            key: `bundle:${x.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(D.x + D.width + ne.x) / 2 - 24}px`,
              top: `${(D.y + D.height / 2 + ne.y + ne.height / 2) / 2 - 10}px`
            },
            "aria-label": `${x.rules.length} rules connect ${x.rules[0].sourceTagName} to ${x.rules[0].derivedTagName}`
          }, `${x.rules.length} rules`);
        })
      ])
    ]);
  }
  function $() {
    if (Pe.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        U ? "No derivation relationships match your search." : "No derivation rules."
      );
    const v = /* @__PURE__ */ new Map();
    ae.forEach((x) => {
      const D = Y(x);
      v.has(D) || v.set(D, []), v.get(D).push(x);
    });
    const y = [
      ...h.segmentGroups.map((x) => x.key),
      "cross-group"
    ].filter((x) => v.has(x));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, y.map((x) => {
      const D = h.segmentGroups.find((j) => j.key === x), ne = x === "cross-group" ? "Cross-group relationships" : (D == null ? void 0 : D.name) || "Ungrouped", te = v.get(x);
      return n("section", { key: x, "aria-label": ne }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, ne),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${te.length} rule${te.length === 1 ? "" : "s"}`
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
          ...te.map((j) => n("button", {
            key: j.id,
            type: "button",
            role: "row",
            onClick: () => be({ type: "rule", id: j.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(G == null ? void 0 : G.id) === j.id ? "bg-accent/10" : ""}`,
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
          `${T.length} rules · ${h.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          H(b()), be(null), M();
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
          value: q,
          onChange: (v) => {
            oe(v.target.value), be(null);
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
          value: k,
          disabled: d != null,
          onChange: (v) => {
            ce(v.target.value), be(null), H(null);
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
          value: p,
          onChange: (v) => J(v.target.value),
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
        ].map(([v, y]) => n("button", {
          key: v,
          type: "button",
          onClick: () => {
            E(v), v === "graph" && (L == null ? void 0 : L.type) === "rule" && be(null);
          },
          "aria-pressed": Ce === v,
          className: `rounded px-3 py-1.5 text-sm font-medium ${Ce === v ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
        }, y))
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
        Ce === "graph" ? ee() : $()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? ye() : I()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      B ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, B) : null
    ]),
    i ? n(vo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => F(i),
      onClose: () => {
        const v = i.trigger;
        R(null), requestAnimationFrame(() => {
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
  }), [o, i] = K([]), [a, s] = K(null), [l, d] = K([]), [c, u] = K([]), [g, b] = K(!1), [h, f] = K(!1), [p, S] = K(!1), [C, m] = K(""), [B, U] = K(""), [q, F] = K("graph"), [M, T] = K("all"), [w, k] = K(null), [A, G] = K("relationship"), [L, R] = K(null), [H, J] = K(null), _ = ue(null), oe = ue(null), ce = si().replace(/:/g, "");
  function be() {
    requestAnimationFrame(() => {
      var N;
      return (N = _.current) == null ? void 0 : N.scrollIntoView({ block: "nearest" });
    });
  }
  async function E(N) {
    const W = await Z("/derivation-rules", N ? { signal: N } : void 0);
    i(W || []);
  }
  pe(() => {
    const N = new AbortController();
    return E(N.signal).catch((W) => {
      W.name !== "AbortError" && m(W.message || "Unable to load derived segment rules.");
    }), () => N.abort();
  }, []), pe(() => {
    const N = new AbortController();
    return a != null && a.sourceTagId ? (b(!0), Z(`/slot-definitions/${a.sourceTagId}`, { signal: N.signal }).then((W) => d(W.definitions || [])).catch((W) => {
      W.name !== "AbortError" && d([]);
    }).finally(() => {
      N.signal.aborted || b(!1);
    })) : (d([]), b(!1)), a != null && a.derivedTagId ? (f(!0), Z(`/slot-definitions/${a.derivedTagId}`, { signal: N.signal }).then((W) => u(W.definitions || [])).catch((W) => {
      W.name !== "AbortError" && u([]);
    }).finally(() => {
      N.signal.aborted || f(!1);
    })) : (u([]), f(!1)), () => N.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), pe(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || g || h)
      return;
    const N = `${a.sourceTagId}:${a.derivedTagId}`;
    oe.current !== N && (oe.current = N, s((W) => !W || Number(W.sourceTagId) !== Number(a.sourceTagId) || Number(W.derivedTagId) !== Number(a.derivedTagId) ? W : md(W, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    g,
    h
  ]);
  function ae(N, W = !1) {
    W || k({ type: "rule", id: N.id }), oe.current = null, s({
      ruleId: N.id,
      sourceTagId: N.sourceTagId,
      sourceTagName: N.sourceTagName,
      derivedTagId: N.derivedTagId,
      derivedTagName: N.derivedTagName,
      slotMappings: N.slotMappings.map((O) => ({
        sourceSlotDefinitionId: O.sourceSlotDefinitionId,
        derivedSlotDefinitionId: O.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), m(""), be();
  }
  function le(N, W, O = "") {
    oe.current = null, N === "source" ? (d([]), b(W != null)) : (u([]), f(W != null)), s((Q) => ({
      ...Q,
      [`${N}TagId`]: W == null ? null : Number(W),
      [`${N}TagName`]: O || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function X(N) {
    (a == null ? void 0 : a.ruleId) == null && (oe.current = null);
    const W = [E(), t == null ? void 0 : t()];
    return N.draftKind === "source" ? (b(!0), W.push(Z(`/slot-definitions/${N.tagId}`).then((O) => d(O.definitions || [])).finally(() => b(!1)))) : N.draftKind === "derived" && (f(!0), W.push(Z(`/slot-definitions/${N.tagId}`).then((O) => u(O.definitions || [])).finally(() => f(!1)))), Promise.all(W);
  }
  function de(N, W, O) {
    s((Q) => ({
      ...Q,
      slotMappings: Q.slotMappings.map((he, me) => me === N ? { ...he, [W]: O } : he)
    }));
  }
  async function xe() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const N = Ta(a, o);
    if (N) {
      m(N.message);
      return;
    }
    if (a.slotMappings.some((W) => !W.sourceSlotDefinitionId || !W.derivedSlotDefinitionId)) {
      m("Complete or remove every performer slot mapping before saving.");
      return;
    }
    S(!0), m(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let W = null;
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
        W = Q.fingerprint;
      }
      m("Saving derived segment rule…");
      const O = await Z("/derivation-rules", {
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
      if (await E(), k(q === "graph" ? { type: "node", id: Number(O.sourceTagId) } : { type: "rule", id: O.id }), s(null), a.ruleId == null)
        try {
          const Q = await Z(
            `/derivation-rules/${O.id}/materialization/preview`,
            { method: "POST" }
          );
          R(
            Q.createCount + Q.linkCount > 0 ? Q : null
          ), m(Q.createCount + Q.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          R(null), m("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        R(null), m("Derived segment rule saved. Previous materializations were removed.");
    } catch (W) {
      m(W.message || "Unable to save derived segment rule.");
    } finally {
      S(!1);
    }
  }
  async function Ce(N) {
    S(!0), m("Previewing rule deletion…");
    try {
      const W = await Z(
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
      const O = `derivation-rule-delete:${N.id}:${W.fingerprint}`;
      await Z(`/derivation-rules/${N.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(O),
          fingerprint: W.fingerprint
        })
      }), qe(O), await E(), (a == null ? void 0 : a.ruleId) === N.id && s(null), (w == null ? void 0 : w.type) === "rule" && w.id === N.id && k(null), (L == null ? void 0 : L.ruleId) === N.id && R(null), m(`Rule deleted with ${W.deletedSegmentCount} exclusively derived segment${W.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (W) {
      m(W.message || "Unable to delete derived segment rule.");
    } finally {
      S(!1);
    }
  }
  async function Pe(N, W = null) {
    const O = W || await Z(
      `/derivation-rules/${N.id}/materialization/preview`,
      { method: "POST" }
    );
    if (O.createCount + O.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const Q = `derivation-rule-materialize:${N.id}:${O.fingerprint}`, he = await Z(`/derivation-rules/${N.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: _e(Q),
        fingerprint: O.fingerprint
      })
    });
    return qe(Q), he;
  }
  async function fe(N, W = null) {
    S(!0), m("Finding pending derivations…");
    try {
      const O = await Pe(N, W);
      if (R(null), await E(), O.createdCount + O.linkedCount === 0) {
        m("Every applicable derivation is already materialized.");
        return;
      }
      m(
        `${O.createdCount} derived segment${O.createdCount === 1 ? "" : "s"} created and ${O.linkedCount} existing segment${O.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (O) {
      m(O.message || "Unable to materialize pending derivations.");
    } finally {
      S(!1);
    }
  }
  async function Y(N, W) {
    if (W.length === 0) return;
    S(!0), m(`Finding pending derivations from ${N.name}…`);
    let O = 0, Q = 0;
    try {
      for (const he of W) {
        const me = await Pe(he);
        O += me.createdCount, Q += me.linkedCount;
      }
      R(null), await E(), m(O + Q === 0 ? `Every outgoing derivation from ${N.name} is already materialized.` : `${O} derived segment${O === 1 ? "" : "s"} created and ${Q} existing segment${Q === 1 ? "" : "s"} linked from ${N.name}.`);
    } catch (he) {
      await E().catch(() => {
      }), m(he.message || `Unable to materialize derivations from ${N.name}.`);
    } finally {
      S(!1);
    }
  }
  const ye = Ta(a, o), I = Ve(
    () => Gc(o, e),
    [o, e]
  ), ee = B.trim().toLocaleLowerCase(), v = I.components.filter((N) => M === "all" || N.segmentGroupKeys.includes(M)).filter((N) => !ee || N.nodes.some((W) => W.name.toLocaleLowerCase().includes(ee))), y = v.flatMap((N) => N.rules), x = new Set(
    v.flatMap((N) => N.nodes.map((W) => W.tagId))
  ), D = Ve(
    () => zc(v),
    [v]
  ), ne = q === "list" ? Uc(
    w,
    y,
    ee.length > 0
  ) : null, te = (w == null ? void 0 : w.type) === "node" && I.nodes.find((N) => N.tagId === w.id && x.has(N.tagId)) || null, j = [...y].sort((N, W) => A === "source" ? Nt(N.sourceTagName, W.sourceTagName) || Nt(N.derivedTagName, W.derivedTagName) : A === "target" ? Nt(N.derivedTagName, W.derivedTagName) || Nt(N.sourceTagName, W.sourceTagName) : A === "materialized" ? (Number(W.edgeCount) || 0) - (Number(N.edgeCount) || 0) || Nt(N.sourceTagName, W.sourceTagName) : Nt(
    `${N.sourceTagName} ${N.derivedTagName}`,
    `${W.sourceTagName} ${W.derivedTagName}`
  ));
  return n(Hc, {
    arrowMarkerId: ce,
    busy: p,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: H,
    deleteRule: Ce,
    derivedSlots: c,
    derivedSlotsLoading: h,
    draft: a,
    draftIssue: ye,
    editRule: ae,
    editorRef: _,
    emptyDraft: r,
    graph: I,
    layout: D,
    listSort: A,
    materializationOffer: L,
    materializeOutgoingRules: Y,
    materializeRule: fe,
    message: C,
    normalizedQuery: ee,
    query: B,
    refreshConfiguredTag: X,
    revealEditor: be,
    rules: o,
    save: xe,
    segmentGroupKey: M,
    selectedNode: te,
    selectedRule: ne,
    selection: w,
    setConfiguringTag: J,
    setDraft: s,
    setListSort: G,
    setMaterializationOffer: R,
    setQuery: U,
    setSegmentGroupKey: T,
    setSelection: k,
    setView: F,
    sortedVisibleRules: j,
    sourceSlots: l,
    sourceSlotsLoading: g,
    updateMapping: de,
    updateTag: le,
    view: q,
    visibleComponents: v,
    visibleRules: y
  });
}
function qc() {
  const [e, t] = K(ti), r = [
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
  const [o, i] = K([]), [a, s] = K(!1), [l, d] = K(!1), [c, u] = K(""), [g, b] = K(""), [h, f] = K("all"), [p, S] = K(() => /* @__PURE__ */ new Set()), [C, m] = K(null);
  pe(() => {
    if (!e || a) return;
    const R = new AbortController();
    return d(!0), u(""), Z("/slot-definitions", { signal: R.signal }).then((H) => {
      i(H || []), s(!0);
    }).catch((H) => {
      H.name !== "AbortError" && u(H.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      R.signal.aborted || d(!1);
    }), () => R.abort();
  }, [e, a]);
  async function B() {
    d(!0), u("");
    try {
      const R = await Z("/slot-definitions");
      i(R || []), s(!0);
    } catch (R) {
      u(R.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function U() {
    const [R] = await Promise.all([
      Z("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(R || []), s(!0), u("");
  }
  function q() {
    const R = C == null ? void 0 : C.trigger;
    m(null), requestAnimationFrame(() => {
      R != null && R.isConnected && R.focus({ preventScroll: !0 });
    });
  }
  function F(R) {
    S((H) => {
      const J = new Set(H);
      return J.has(R) ? J.delete(R) : J.add(R), J;
    });
  }
  const M = Ve(
    () => Fc(t, o),
    [t, o]
  ), T = Ve(
    () => Bc(M, g, h),
    [M, g, h]
  ), w = M.flatMap((R) => R.tags), k = w.filter((R) => R.definitions.length > 0).length, A = w.length - k, G = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], L = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${w.length} tags · ${k} with slots · ${A} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: g,
          onChange: (R) => b(R.target.value),
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
          G.map(([R, H]) => n("button", {
            key: R,
            type: "button",
            onClick: () => f(R),
            "aria-pressed": h === R,
            className: `rounded px-3 py-1.5 text-xs font-medium ${h === R ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, H))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => S(/* @__PURE__ */ new Set()),
          className: L
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => S(new Set(M.map((R) => R.overviewKey))),
          className: L
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
        onClick: B,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && T.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, T.map((R) => {
      const H = p.has(R.overviewKey), J = R.tags.filter((_) => _.definitions.length > 0).length;
      return n("article", {
        key: R.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => F(R.overviewKey),
          "aria-expanded": !H,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, H ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, R.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${R.tags.length} tag${R.tags.length === 1 ? "" : "s"} · ${J} with slots`
          )
        ]),
        H ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          R.tags.map((_) => n("li", {
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
            }, _.definitions.map((oe) => n("li", {
              key: oe.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, Ct(oe)),
              ...(oe.genderHints || []).map((ce) => n("span", {
                key: ce,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, Cr(ce)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (oe) => m({
                tagId: _.tagId,
                tagName: _.tagName,
                trigger: oe.currentTarget
              }),
              "aria-label": `Edit performer slots for ${_.tagName}`,
              className: `${L} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    C ? n(vo, {
      key: `performer-slots-configure:${C.tagId}`,
      tagId: C.tagId,
      tagName: C.tagName,
      onSaved: U,
      onClose: q
    }) : null
  ]);
}
function Vc({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = K("general"), [a, s] = K([]), [l, d] = K(!1), [c, u] = K(""), [g, b] = K(Va), h = Rl(t), f = h.map(([m]) => m);
  pe(() => {
    f.includes(o) || i(f[0] || "general");
  }, [t.effectiveMode]);
  async function p(m) {
    const B = await Z("/segment-groups", m ? { signal: m } : void 0);
    s(B || []);
  }
  pe(() => {
    const m = new AbortController();
    return p(m.signal).catch((B) => {
      B.name !== "AbortError" && u(B.message || "Unable to load tag groups.");
    }), () => m.abort();
  }, []);
  async function S(m) {
    if (m !== t.requestedMode) {
      d(!0), u("");
      try {
        const B = await Z(
          `/preferences/transition?mode=${encodeURIComponent(m)}`
        );
        let U = !1, q = null, F = null, M = null, T = !1;
        if (t.requestedMode === "basic" && m === "full") {
          if (!window.confirm(El(
            B.recyclingBinCount,
            B.protectedRecyclingBinCount
          )))
            return;
          T = !0, B.recyclingBinCount > 0 && (U = !0, M = B.recyclingBinFingerprint, q = `mode-switch-empty-bin:${M}`, F = _e(q));
        }
        let w = !1;
        if (t.requestedMode === "full" && m === "basic") {
          if (!window.confirm(Al(
            B.extensionOwnedSegmentCount
          )))
            return;
          w = !0;
        }
        const k = await Z("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: m,
            confirmHiddenExtensionOwnedSegments: w,
            confirmBasicHistoryCleanup: T,
            emptyRecyclingBin: U,
            operationId: F,
            expectedRecyclingBinFingerprint: M
          })
        });
        q && qe(q), r == null || r(ni(k)), u("Workflow mode saved.");
      } catch (B) {
        u(B.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  const C = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (m) => Ri(m, e, C), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      h.map(([m, B]) => n("button", {
        key: m,
        type: "button",
        onClick: () => i(m),
        "aria-current": o === m ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === m ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, B))
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
        onModeChange: S,
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
          checked: g,
          onChange: (m) => {
            const B = m.target.checked;
            Ja(B), b(B);
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
    f.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(_c, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => p()
      })
    ) : null,
    f.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(Wc, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => p()
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
  var u, g;
  const s = [...e.slots || []].sort((b, h) => b.sortOrder - h.sortOrder || String(b.slotDefinitionId).localeCompare(String(h.slotDefinitionId))), l = [...new Map(s.map((b) => [
    b.performerId,
    { id: b.performerId, name: b.performerName }
  ])).values()], d = s.map((b) => ({
    slotDefinitionId: b.slotDefinitionId,
    label: Ct(b),
    performer: { id: b.performerId, name: b.performerName }
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
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((g = e.activity) == null ? void 0 : g.name) || "Tag segment"),
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
function Ma({ onNavigate: e, profile: t }) {
  const r = Ve(() => {
    const E = La("ext:com.midnightrider.segment-studio:segments");
    return E ? {
      ..._r,
      defaultFilter: { ..._r.defaultFilter, ...E.findFilter || {} },
      defaultObjectFilter: E.objectFilter || {}
    } : _r;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = ja(r), [l, d] = K(null), [c, u] = K({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [g, b] = K(null), [h, f] = K(null), [p, S] = K(0), [C, m] = K(""), [B, U] = K(!0), [q, F] = K(""), M = ue(0), T = ia(o, i), w = T.activityTagId, k = In(i.slots), A = Ve(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (E) => Object.keys(In(E)).length > 0,
    sanitize: (E) => qr(w, In(E)),
    summarize: (E) => `${Object.keys(In(E)).length} assigned`,
    renderEditor: (E, ae) => w ? n(Ra, {
      facets: l,
      values: In(E),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (le, X) => {
        const de = { ...In(E) };
        X ? de[le] = Number(X) : delete de[le], ae(qr(w, de));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [w, l, c.performerSlotsAvailable]), G = JSON.stringify(T);
  pe(() => {
    if (d(null), !w) return;
    const E = new AbortController();
    return Z(`/browse/activities/${w}/facets`, { signal: E.signal }).then(d).catch((ae) => {
      ae.status === 403 ? d({ slots: [], restricted: !0 }) : ae.name !== "AbortError" && F(ae.message);
    }), () => E.abort();
  }, [w]), pe(() => {
    const E = ++M.current, ae = new AbortController();
    return U(!0), F(""), Z("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(T), signal: ae.signal }).then((le) => {
      E === M.current && u({ ...le, totalCount: le.totalCount ?? le.total ?? 0 });
    }).catch((le) => {
      if (!(E !== M.current || le.name === "AbortError")) {
        if (le.status === 400 && le.message.includes("unrestricted performer read access")) {
          u((X) => ({ ...X, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), F("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        F(le.message);
      }
    }).finally(() => {
      E === M.current && U(!1);
    }), () => {
      M.current++, ae.abort();
    };
  }, [G, p]);
  const L = c.items.findIndex((E) => E.key === g), R = c.items[L] || null;
  function H(E) {
    s(E), a({ ...o, page: 1 });
  }
  function J(E) {
    const ae = ia(o, E), le = E.slots && ae.activityTagId != null && ae.slotAssignments.length > 0 ? E.slots : void 0;
    H({ ...E, slots: le });
  }
  function _(E, ae) {
    const le = { ...k };
    ae ? le[E] = Number(ae) : delete le[E], H({ ...i, slots: qr(w, le) });
  }
  function oe() {
    const E = document.querySelector(`[data-segment-key="${g}"]`);
    b(null), requestAnimationFrame(() => E == null ? void 0 : E.focus());
  }
  async function ce(E) {
    var X;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    f(E.key), m("");
    const ae = `browse-restore:${E.itemId}:${E.revision}`, le = _e(ae);
    try {
      const de = (xe = !1) => Z(`/bin/${E.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: le,
          expectedRevision: E.revision,
          discardMissingImage: xe
        })
      });
      try {
        await de(uo(ae));
      } catch (xe) {
        if (((X = xe.payload) == null ? void 0 : X.code) !== "missing-image" || !window.confirm(`${xe.message}

Continue and discard the missing image reference?`))
          throw xe;
        mo(ae), await de(!0);
      }
      qe(ae), g === E.key && b(null), m("Segment restored to Cove."), S((xe) => xe + 1);
    } catch (de) {
      m(de.message || "Unable to restore the segment."), de.status === 409 && S((xe) => xe + 1);
    } finally {
      f(null);
    }
  }
  async function be(E) {
    f(E.key), m("");
    try {
      const ae = await Z(`/items/${E.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: E.revision })
      });
      if (!di(ae, m) || !Jl(ae))
        return;
      const le = `browse-dependency-delete:${E.itemId}:${ae.fingerprint}`;
      await Z(`/items/${E.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e(le),
          fingerprint: ae.fingerprint
        })
      }), qe(le), g === E.key && b(null), m(`${ae.deletedSegmentCount} segment${ae.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), S((X) => X + 1);
    } catch (ae) {
      m(ae.message || "Unable to permanently delete the segment."), ae.status === 409 && S((le) => le + 1);
    } finally {
      f(null);
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
      isLoading: B,
      error: q ? new Error(q) : null,
      onRetry: () => S((E) => E + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? aa.filter((E) => E.id !== "performers") : aa,
      objectFilter: i,
      onObjectFilterChange: J,
      customFilterSections: A,
      searchPlaceholder: "Search segments..."
    }, [
      w ? n(Ra, { key: "slots", facets: l, values: k, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: _ }) : null,
      n(Yc, { key: "player", item: R, index: L, count: c.items.length, onPrevious: () => {
        var E;
        return b((E = c.items[L - 1]) == null ? void 0 : E.key);
      }, onNext: () => {
        var E;
        return b((E = c.items[L + 1]) == null ? void 0 : E.key);
      }, onClose: oe, onNavigate: e }),
      C ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, C) : null,
      !B && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      B ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((E) => n(Jc, {
        key: E.key,
        item: E,
        selected: E.key === g,
        busy: h === E.key,
        onSelect: () => b(E.key),
        onRestore: ce,
        onPurge: be
      })))
    ])
  ]);
}
function Qc({ onNavigate: e, profile: t }) {
  const [r, o] = K([]), [i, a] = K(""), [s, l] = K(0), [d, c] = K(!0), [u, g] = K(null), [b, h] = K(""), f = ue(null);
  async function p(m) {
    const B = await Z("/bin", m ? { signal: m } : void 0);
    return o(B.items || []), a(B.fingerprint || ""), l(Number(B.totalCount) || 0), B;
  }
  pe(() => {
    const m = new AbortController();
    return c(!0), p(m.signal).catch((B) => {
      B.name !== "AbortError" && h(B.message);
    }).finally(() => {
      m.signal.aborted || c(!1);
    }), () => m.abort();
  }, []), Pa(ao, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var m;
      return (m = f.current) == null ? void 0 : m.call(f);
    }
  }]);
  async function S(m) {
    var q;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    g(m.itemId), h("");
    const B = `restore:${m.itemId}:${m.revision}`, U = _e(B);
    try {
      const F = (M = !1) => Z(`/bin/${m.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: U, expectedRevision: m.revision, discardMissingImage: M })
      });
      try {
        await F(uo(B));
      } catch (M) {
        if (((q = M.payload) == null ? void 0 : q.code) !== "missing-image" || !window.confirm(`${M.message}

Continue and discard the missing image reference?`)) throw M;
        mo(B), await F(!0);
      }
      qe(B), await p(), qn(), h("Segment restored with a new native ID.");
    } catch (F) {
      h(F.message || "Unable to restore the segment."), F.status === 409 && await p();
    } finally {
      g(null);
    }
  }
  async function C() {
    if (u == null)
      try {
        const m = await ui({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          g(-1), h("");
        });
        if (m.status !== "emptied") return;
        await p(), qn(), h(`${m.segmentCount} segment${m.segmentCount === 1 ? "" : "s"} from ${m.sceneCount} scene${m.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (m) {
        h(m.message || "Unable to empty the recycling bin."), m.status === 409 && await p();
      } finally {
        g(null);
      }
  }
  return f.current = C, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
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
        onClick: C,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, u === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    b ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, b) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((m) => n("article", { key: m.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${m.tagName || "Tag segment"} · ${m.videoTitle || `Video ${m.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, m.endSec == null ? Ee(m.startSec) : `${Ee(m.startSec)} – ${Ee(m.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${m.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${m.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: u != null, onClick: () => S(m), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const Aa = "ext:com.midnightrider.segment-studio:videos";
function Vr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = Ve(() => {
    var ce;
    const _ = La(Aa), oe = (ce = _ == null ? void 0 : _.uiOptions) == null ? void 0 : ce.displayMode;
    return _ ? {
      ...Un,
      defaultFilter: { ...Un.defaultFilter, ..._.findFilter || {} },
      defaultObjectFilter: _.objectFilter || {},
      defaultDisplayMode: Un.allowedDisplayModes.includes(oe) ? oe : Un.defaultDisplayMode
    } : Un;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: u } = ja(i), [g, b] = K({ items: [], totalCount: 0 }), [h, f] = K(!0), [p, S] = K(""), [C, m] = K(0), [B, U] = K(/* @__PURE__ */ new Set()), q = ue(0), F = ue(null), M = JSON.stringify(a), T = JSON.stringify(s), w = t || r === "review";
  pe(() => {
    F.current = null, U(/* @__PURE__ */ new Set());
  }, [M, T]), pe(() => {
    const _ = ++q.current, oe = new AbortController();
    return f(!0), S(""), Z(`/videos?${ic(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: oe.signal }).then((ce) => {
      _ === q.current && b(ce);
    }).catch((ce) => {
      _ === q.current && ce.name !== "AbortError" && S(ce.message || "Unable to discover videos.");
    }).finally(() => {
      _ === q.current && f(!1);
    }), () => {
      q.current++, oe.abort();
    };
  }, [M, T, t, r, C]);
  function k(_) {
    d({ ..._, page: _.page || 1 });
  }
  function A(_) {
    c(_), d({ ...a, page: 1 });
  }
  function G(_, oe = !1) {
    U((ce) => sc(
      ce,
      g.items.map((be) => be.videoId),
      _,
      F.current,
      oe
    )), F.current = _;
  }
  function L() {
    F.current = null, U(new Set(g.items.map((_) => _.videoId)));
  }
  function R() {
    F.current = null, U(/* @__PURE__ */ new Set());
  }
  function H() {
    F.current = null, U((_) => new Set(g.items.map((oe) => oe.videoId).filter((oe) => !_.has(oe))));
  }
  const J = t || r === "review" ? wa : wa.filter((_) => !["reviewState", "shotBoundaries"].includes(_.id));
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
      savedFilterScope: Aa,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: k,
      totalCount: g.totalCount,
      isLoading: h,
      error: p ? new Error(p) : null,
      onRetry: () => m((_) => _ + 1),
      sortOptions: t || r === "review" ? [...ka, { value: "unreviewed_count", label: "Unreviewed count" }] : ka,
      displayMode: l,
      onDisplayModeChange: u,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: J,
      objectFilter: s,
      onObjectFilterChange: A,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: w ? B : void 0,
      onSelectAll: w ? L : void 0,
      onSelectNone: w ? R : void 0,
      onInvertSelection: w ? H : void 0,
      // The host renders whatever extensions contribute for a video selection, so
      // Run AI here is the same action, and the same dialog, as the native videos
      // page. Only the contributed actions are rendered: Segment Studio's own
      // ownership and lineage rules govern deletion, so the native bulk mutations
      // that would bypass them stay out of this bar.
      selectionActions: w && B.size > 0 ? n(Ts, { entityType: "video", selectedIds: B }) : null
    }, [
      !h && g.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !h && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, g.items.map((_) => n(lc, { key: _.videoId, item: _, onNavigate: e, showReviewStates: w, selected: B.has(_.videoId), selectionActive: B.size > 0, onSelect: w ? G : null }))) : null,
      !h && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, g.items.map((_) => n(dc, { key: _.videoId, item: _, onNavigate: e, showReviewStates: w, selected: B.has(_.videoId), selectionActive: B.size > 0, onSelect: w ? G : null }))) : null
    ])
  ]);
}
function Ea({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = K(null), [s, l] = K(!0), [d, c] = K(""), u = ue(0), g = ue(0), b = ue(e), h = qd();
  b.current = e;
  const [f] = K(() => Ws({
    beginRequest: () => ({ requestId: ++g.current, videoId: b.current }),
    fetchDetail: (U) => Z(p(U.videoId)),
    isCurrent: (U) => cr(U.requestId, g.current, U.videoId, b.current),
    isSameVideo: (U) => U.videoId === b.current
  })), p = (U) => `/videos/${U}/editor`;
  async function S(U, q, F) {
    const M = await Z(p(q), F ? { signal: F.signal } : void 0);
    return cr(U, F ? u.current : g.current, q, b.current) ? (a(M), !0) : !1;
  }
  pe(() => {
    const U = ++u.current, q = e, F = new AbortController();
    return a(null), l(!0), c(""), S(U, q, F).catch((M) => {
      cr(U, u.current, q, b.current) && M.name !== "AbortError" && c(M.message || "Unable to load the editor.");
    }).finally(() => {
      cr(U, u.current, q, b.current) && l(!1);
    }), () => {
      u.current++, g.current++, F.abort();
    };
  }, [e]);
  function C(U, q) {
    a((F) => (F == null ? void 0 : F.video.id) !== q ? F : typeof U == "function" ? U(F) : U);
  }
  function m() {
    return f({
      onLoaded: (U) => {
        a(U), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: (U) => c(U.message || "Unable to reload the latest segment.")
    });
  }
  function B() {
    return f({
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
      n(As, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(jc, {
      key: i.video.id,
      detail: i,
      onDetailChange: C,
      onConflict: m,
      onReload: B,
      onSlotsChanged: B,
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
  if (Ml(u, o) === "videos" && u !== "videos")
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
    if (d) return n(Ma, { onNavigate: r, profile: o });
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
  const b = Number(e);
  return d ? n(Ma, { onNavigate: r, profile: o }) : Number.isInteger(b) && b > 0 ? n(Ea, {
    videoId: b,
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
  const [o, i] = K(null), [a, s] = K("");
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
const Mu = {
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
  Mu as default,
  Ci as discardPendingChange,
  Vl as downloadFileNameFromContentDisposition,
  Zs as dualRangeValueFromPointer,
  na as duplicateIdentityFromResponse,
  vl as duplicateOperationKey,
  Ya as editorVisibilityIncludingSegment,
  Sd as expandedSwimlanes,
  Al as extensionOwnedSegmentsModeSwitchPrompt,
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
  Mt as handleModalKey,
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
  Ml as resolveSegmentStudioRoute,
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
