import lo from "@cove/runtime/react";
import { createPortal as As } from "@cove/runtime/react-dom";
import { extensionFetch as ja } from "@cove/runtime/api";
import { formatDuration as Rs, EntityReferenceSelector as Zn, useExtensionKeyboardBindings as Ms, VideoPlayer as Ba, useRegisterExtensionKeyboardActions as Ga, getDefaultFilter as Ua, useListUrlState as Ka, ListPage as za } from "@cove/runtime/components";
import { ChevronDown as Ha, StepBack as Es, StepForward as Ds, Loader2 as Os } from "@cove/runtime/lucide-react";
const co = "com.midnightrider.segment-studio", qa = "segment-studio.layout.v1", cn = "segment-studio.operations.v1", _a = "segment-studio.collapsed-segment-groups.v1", Wa = "segment-studio.playback-shortcuts.v1", Va = "segment-studio.timing-clipboard.v1", Ja = "segment-studio.hide-derived-segments.v1", Ya = "segment-studio.merge-confirmation.v1", It = ["unreviewed", "approved", "rejected"], Ps = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], Wo = "(min-width: 1024px) and (min-height: 640px)", Vo = "(min-width: 1024px) and (min-height: 900px)", Xn = 1e-3, Jo = 15, Ls = 30, Qa = 12, Mt = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, uo = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30
}, Yt = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function Yo(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function Za(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? Ir(e, null, 1, !0) ?? r[0] ?? null;
}
function Ir(e, t, r, o = !1) {
  var m;
  const i = e.findIndex((u) => u.markers.some((b) => b.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const u = e.flatMap((b) => b.markers.map((g) => g.segment)).filter((b) => b.reviewState === "unreviewed");
    return r < 0 ? u.at(-1) ?? null : u[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((u) => u.segment.id === t);
  if (!o)
    return ((m = (r < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((b) => b.segment.reviewState === "unreviewed")) == null ? void 0 : m.segment) ?? null;
  const l = e.flatMap((u) => u.markers.map((b) => b.segment)), d = l.findIndex((u) => u.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((u) => u.reviewState === "unreviewed") ?? null;
}
function Fs(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((m, u) => m.markers.filter(({ segment: b }) => {
    const g = Number(b.startSec), f = b.endSec == null ? g + Ls : Number(b.endSec);
    return Number.isFinite(g) && Number.isFinite(f) && f >= g && g <= i + Jo + Xn && f >= i - Jo - Xn;
  }).map(({ segment: b }) => ({ segment: b, laneIndex: u }))).sort((m, u) => m.laneIndex - u.laneIndex || Math.abs(m.segment.startSec - i) - Math.abs(u.segment.startSec - i) || m.segment.id - u.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((m) => m.markers.some((u) => u.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((m) => m.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((m) => m.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((m) => m.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function js(e, t, r) {
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
function Cr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function yu(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function Bs(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function bu(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function Gs(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function Us(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Ks(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function zs(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Xr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function Hs(e, t, r = 10) {
  const o = Xr(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function Qo(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function qs(e, t = Qa) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function Xa(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : Mt.timelineRatio;
}
function eo(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function ln(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? Mt.detailWidth : Math.min(eo(t, 0), Math.max(240, e));
}
function xr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? Mt.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function _s(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function mo(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: Mt.timelineRatio, maximum: Mt.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function go(e, t) {
  const r = Xa(e);
  if (!(t > 0)) return r;
  const o = mo(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function Ws(e) {
  if (!e) return { ...Mt };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? Xa(r) : Mt.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: ln(t == null ? void 0 : t.detailWidth),
      markerRailWidth: ln(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: xr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...Mt };
  }
}
function Vs(e, t, r) {
  return r > 0 ? go((t + r - e) / r, r) : Mt.timelineRatio;
}
function hu(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function Js(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, m) => c.startSec - m.startSec || c.id - m.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= Xn ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function pr(e, t, r, o) {
  return e === t && r === o;
}
function Ys({ beginRequest: e, fetchDetail: t, isCurrent: r, isSameVideo: o }) {
  let i = null, a = null;
  return function({ onLoaded: l, onError: d }) {
    const c = e(), m = (async () => {
      try {
        const u = await t(c);
        if (r(c))
          return l(u), u;
      } catch (u) {
        if (r(c))
          return d(u), null;
      }
      return o(c) && i !== m && a.videoId === c.videoId ? i : null;
    })();
    return i = m, a = c, m;
  };
}
const $n = "__segment-studio-cleared-selection__";
function Qs(e) {
  return e === "true";
}
function Zs(e) {
  return e !== "false";
}
function ei() {
  try {
    return Zs(window.localStorage.getItem(Ya));
  } catch {
    return !0;
  }
}
function ti(e) {
  try {
    window.localStorage.setItem(Ya, String(!!e));
  } catch {
  }
}
function Xs(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function Lt(e = {}) {
  const t = It.filter((m) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(m) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (m, u) => {
    const b = Number(m);
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
function Wr(e, t, r, o = !1, i = []) {
  var c, m;
  const a = Lt(r), s = a.performerId == null ? null : new Set((t || []).filter((u) => Number(u.performerId) === a.performerId).map((u) => u.segmentId)), l = new Set((i || []).flatMap((u) => u.tags || []).map((u) => Number(u.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((m = (c = (i || []).find((u) => Number(u.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : m.map((u) => Number(u.tagId))) || []);
  return Xs(e || [], o).filter((u) => {
    if (u.reviewState != null && !a.reviewStates.includes(u.reviewState) || s && !s.has(u.id) || a.tagId != null && Number(u.tagId) !== a.tagId || d && !d.has(Number(u.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(u.tagId)) || a.sourceKey != null && u.sourceKey !== a.sourceKey) return !1;
    const b = Number(u.confidence);
    return u.confidence == null || !Number.isFinite(b) ? a.includeUnscored : b >= a.confidenceMin && b <= a.confidenceMax;
  });
}
function ni(e, t, r, o = !1, i = []) {
  var l;
  const a = Lt(r);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = Lt({
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
    filters: Lt(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function el(e, t = !1) {
  const r = Lt(e);
  return +(r.reviewStates.length !== It.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function tl(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function nl(e, t, r, o) {
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
function rl(e, t, r = null, o = {}) {
  if (t === $n) return null;
  const i = t ?? r, a = (e || []).flatMap((s) => (s.markers || []).map((l) => l.segment)).find((s) => s.id === i);
  if (a) return a;
  if (o.reference) {
    const s = o.visibleLanes ?? e;
    return s.flatMap((d) => (d.markers || []).map((c) => c.segment)).find((d) => d.id === o.reference.id) ?? kr(s, o.reference);
  }
  return Za(e);
}
function ri(e, t, r, o = !1) {
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
function ol(e, t, r) {
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
function al(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return ri(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function il(e, t, r = null, o = !1) {
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
      ...al(u, s, t, m, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: u
    };
  }
  const d = ri(i, a, t, o);
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
function sl(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function ll(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function Zo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function Xo(e, t, r, o = () => !0) {
  return (e || []).map((i) => i.segment).filter((i) => i && !r.has(i.id) && o(i)).sort((i, a) => Zo(t, i) - Zo(t, a) || Math.abs(Number(i.startSec) - Number(t.startSec)) - Math.abs(Number(a.startSec) - Number(t.startSec)) || Number(i.startSec) - Number(a.startSec) || Number(i.id) - Number(a.id))[0] ?? null;
}
function to(e, t) {
  return ((e == null ? void 0 : e.markers) || []).map((r) => r.segment).filter((r) => r && !t.has(r.id));
}
function Vr(e) {
  return e.reviewState === "unreviewed";
}
function ea(e, t) {
  const r = Number(e.startSec) || 0;
  return r !== t.startSec ? r > t.startSec : Number(e.id) > Number(t.id);
}
function ta(e, t, r, o, i) {
  if (t < 0)
    return Xo(e.flatMap((s) => s.markers || []), r, o, i);
  const a = e.map((s, l) => ({ lane: s, index: l })).filter(({ lane: s }) => to(s, o).some(i)).sort((s, l) => Math.abs(s.index - t) - Math.abs(l.index - t) || +(s.index < t) - +(l.index < t) || s.index - l.index);
  for (const { lane: s } of a) {
    const l = Xo(s.markers, r, o, i);
    if (l) return l;
  }
  return null;
}
function Sr(e, t) {
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
function kr(e, t, r = {}) {
  const o = e || [];
  if (o.length === 0) return null;
  const i = new Set(r.removedIds || []);
  if (t == null) {
    const s = { markers: o.flatMap((d) => d.markers || []) }, l = to(s, i);
    return l.find(Vr) ?? l[0] ?? null;
  }
  i.add(t.id);
  const a = o.findIndex((s) => s.key === t.laneKey);
  if (a >= 0) {
    const s = to(o[a], i).filter(Vr), l = s.find((c) => ea(c, t));
    if (l) return l;
    const d = s.filter((c) => !ea(c, t)).at(-1);
    if (d) return d;
  }
  return ta(o, a, t, i, Vr) ?? ta(o, a, t, i, () => !0);
}
function dl(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function na(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function cl() {
  try {
    return Qs(window.localStorage.getItem(Ja));
  } catch {
    return !1;
  }
}
function ul(e) {
  try {
    window.localStorage.setItem(Ja, String(!!e));
  } catch {
  }
}
const nr = [
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
], ml = /* @__PURE__ */ new Set([
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
function gl(e) {
  return ml.has(e);
}
function oi(e) {
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
function pl(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(nr.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(oi).filter(Boolean)]));
  } catch {
    return {};
  }
}
function fl(e = {}) {
  const t = pl(e);
  return nr.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function ra(e, t = 2) {
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
function vu(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : oi({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function xu(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function no(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function oa(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function Su(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = oa(e.code, t.key), a = oa(t.code, e.key);
  if (!r && !o && !i && !a) return !1;
  const s = i ? t.key : e.key, l = i ? e.code : a ? t.code : o ? e.code : e.code || t.code;
  for (const d of [!1, !0])
    for (const c of [!1, !0])
      for (const m of [!1, !0])
        for (const u of [!1, !0]) {
          const b = {
            key: s,
            code: l,
            ctrlKey: d,
            metaKey: c,
            altKey: m,
            shiftKey: u
          };
          if (no(b, e) && no(b, t)) return !0;
        }
  return !1;
}
function Tn(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function ku(e, t) {
  return [!1, !0].some((r) => Tn(e, r) && Tn(t, r));
}
function yl(e, t = !1, r = {}) {
  return fl(r).find((o) => Tn(o, t) && o.bindings.some((i) => no(e, i))) || null;
}
function ai(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function bl(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(ai).join(" / ") : "Unassigned";
}
function wu(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, bl(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function Nu(e) {
  return e === "review" ? "review" : "editor";
}
function tt(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function hl(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function vl(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function xl(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => tt(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: tt(t, e.activeIdentity) || r[0]
  };
}
function Sl(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function Iu(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => Sl(o, i))));
}
function aa(e, t) {
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
function kl(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function wl(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function Nl(e, t, r) {
  return e != null && (r == null || t !== r);
}
function Il(e, t, r, o = null) {
  if (r === t.tagId) return null;
  const i = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: r,
    tagName: o || ((i == null ? void 0 : i.tagId) === r ? i.tagName : null)
  };
}
function Cl({ tagEditing: e, selectedSegmentIds: t, activeSegmentId: r }, o) {
  return !(e && r === o && (t == null ? void 0 : t.length) === 1 && t[0] === o);
}
function ro(e, t) {
  return e === t;
}
function $l(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function Tl(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - Xn).at(-1) || null : o.find((i) => i.startSec > t + Xn) || null;
}
function Yn(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function ia(e) {
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
function Cu(e, t = null, r = !1) {
  const o = ia(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function In(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function ii(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: In(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: In(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: In(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(In(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(In(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(In(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...uo };
  }
}
function Al(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function si() {
  try {
    return ii(window.localStorage.getItem(Wa));
  } catch {
    return { ...uo };
  }
}
function sa(e) {
  const t = ii(JSON.stringify(e));
  try {
    window.localStorage.setItem(Wa, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Qt = Object.freeze({
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
function oo(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function li(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? oo(e.requestedMode) : "basic",
    effectiveMode: i ? oo(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function An(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function Rl(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Ml(e) {
  const t = [];
  return An(e, Qt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), An(e, Qt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function El(e) {
  return [
    ["general", "General", Qt.settingsGeneral],
    ["shortcuts", "Shortcuts", Qt.settingsShortcuts],
    ["performer-slots", "Performer slots", Qt.settingsPerformerSlots],
    ["derivation", "Derivation", Qt.settingsDerivation]
  ].filter(([, , r]) => An(e, r)).map(([r, o]) => [r, o]);
}
function Dl(e, t) {
  return e === "segments" && !An(
    t,
    Qt.navigationSegmentInventory
  ) || e === "bin" && !An(
    t,
    Qt.recyclingBinView
  ) ? "videos" : e;
}
function Ol(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Pl(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const Jr = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, la = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: It.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function Ll(e) {
  const t = String(e || "").split(",").filter((r) => It.includes(r));
  return t.length === 0 ? [...It] : [...new Set(t)];
}
function Cn(e) {
  return di(e).values;
}
function di(e) {
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
function Yr(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function da(e, t) {
  var l;
  const r = ca(t.activitiesCriterion, t.activityId), o = ca(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = di(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: Fl(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function ca(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function Fl(e, t) {
  return It.includes(e == null ? void 0 : e.value) ? [e.value] : Ll(t);
}
function ci(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function jl(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Bl(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function ua(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Gl(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function ut(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function po(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Qr(e, t) {
  const r = new Set(po(t).map((o) => String(ut(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function tn(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function ma(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(tn).sort().join(",")}`;
}
function ui(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((g) => String(g.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((g) => {
    var f;
    return !((f = g.genderHints) != null && f.length);
  }) && e.length === t.length && !i) {
    const g = [...e].sort((y, w) => String(y.slotDefinitionId).localeCompare(String(w.slotDefinitionId))), f = [...t].sort((y, w) => String(y.name).localeCompare(String(w.name)) || Number(ut(y)) - Number(ut(w)));
    return [{
      assignments: Object.fromEntries(g.map((y, w) => [String(y.slotDefinitionId), String(ut(f[w]))])),
      description: f.map((y) => y.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((g) => t.map((f, y) => ({ performer: f, index: y })).filter(({ performer: f }) => {
    var y;
    return !((y = g.genderHints) != null && y.length) || g.genderHints.some((w) => tn(w) === tn(f.gender || f.genderIdentity));
  }).map(({ index: f }) => f)), m = i ? c.filter((g) => g.length > 0).length : ga(c, t.length);
  if (m === 0) return [];
  const u = new Map(t.map((g, f) => [String(ut(g)), f]));
  function b(g, f, y) {
    if (s.length >= a) return;
    const w = c.slice(g), A = i ? w.filter((q) => q.length > 0).length : ga(w.map((q) => q.filter((W) => !f.has(String(ut(t[W]))))), t.length);
    if (y + A < m) return;
    if (g === e.length) {
      if (y !== m) return;
      const q = Object.fromEntries(d.map(({ slot: E, performer: T }) => [String(E.slotDefinitionId), T ? String(ut(T)) : ""])), W = o.length === 0 ? Object.values(q).sort().join(",") : [...new Set(e.map((E) => String(E.label || "")))].map((E) => `${E}:${d.filter(({ slot: T }) => String(T.label || "") === E).map(({ performer: T }) => T ? String(ut(T)) : "").sort().join(",")}`).join("|");
      !l.has(W) && s.length < a && (l.add(W), s.push({
        assignments: q,
        description: d.map(({ slot: E, performer: T }) => o.length ? `${E.label}: ${(T == null ? void 0 : T.name) || "Unassigned"}` : (T == null ? void 0 : T.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const p = e[g], G = [...d].reverse().find(({ slot: q }) => ma(q) === ma(p)), P = G ? u.get(String(ut(G.performer))) : -1;
    for (const q of c[g]) {
      const W = t[q], E = ut(W);
      if (!(q < P) && !(E == null || !i && f.has(String(E))) && (d.push({ slot: p, performer: W }), i || f.add(String(E)), b(g + 1, f, y + 1), i || f.delete(String(E)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: p, performer: null }), b(g + 1, f, y), d.pop();
  }
  return b(0, /* @__PURE__ */ new Set(), 0), s;
}
function ga(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Ul(e, t) {
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
      const u = [...new Set(e.map((b) => b.label || ""))].map((b) => `${b}:${a.filter((g) => (g.slot.label || "") === b).map((g) => g.performer.performerId).sort((g, f) => g - f).join(",")}`).join("|");
      i.has(u) || i.set(u, [...a]);
      return;
    }
    const c = e[l];
    for (const u of t)
      !o && d.has(u.performerId) || (m = c.genderHints) != null && m.length && !c.genderHints.some((b) => tn(b) === tn(u.gender)) || (a.push({ slot: c, performer: u }), o || d.add(u.performerId), s(l + 1, d), o || d.delete(u.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Kl(e) {
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
function zl(e, t, r = 20) {
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
function Hl(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function ql(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function mi(e, t, r) {
  const o = ut, i = new Set((t || []).map(o)), a = new Set((r || []).map(tn));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), m = d.isVideoPerformer ?? i.has(o(d));
    if (c !== m) return m - c;
    const u = tn(l.gender || l.genderIdentity), b = tn(d.gender || d.genderIdentity), g = l.matchesGenderHint ?? a.has(u);
    return (d.matchesGenderHint ?? a.has(b)) - g || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: ye, useId: gi, useLayoutEffect: pa, useMemo: We, useReducer: _l, useRef: fe, useState: K, useSyncExternalStore: Wl } = lo, n = lo.createElement, pi = "/api/plugins/segment-studio";
function qe(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(cn) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = ao();
    return t[e] = r, window.localStorage.setItem(cn, JSON.stringify(t)), r;
  } catch {
    return ao();
  }
}
function _e(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(cn) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(cn, JSON.stringify(t));
  } catch {
  }
}
function fo(e) {
  try {
    return JSON.parse(window.localStorage.getItem(cn) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function yo(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(cn) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(cn, JSON.stringify(t));
  } catch {
  }
}
function Vl(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function Jl(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function Y(e, t, r = 0) {
  var d;
  const o = await ja(`${pi}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Vl(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await Jl(250 * (r + 1), t == null ? void 0 : t.signal), Y(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function Yl(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${pi}${e}`, o = await ja(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: Ql(
      o.headers.get("Content-Disposition")
    )
  };
}
function Ql(e, t = "segment-studio-ai-feedback.zip") {
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
function ao() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function fi(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function Zl(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function yi(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function Xl(e, t) {
  const { sceneCount: r, segmentCount: o } = yi(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function bi(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = yi(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(Xl(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await Y("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: qe(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return _e(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function fa({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const Ut = {
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
function $u(e, t) {
  return {
    ...(Ut[e] || Ut.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function hi(e) {
  return { ...(Ut[e] || Ut.unreviewed).badge };
}
function vi(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const xi = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function ed(e, t, r = "not-applicable", o = !1) {
  const i = Ut[e] || Ut.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function td(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function nd(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function rd(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function od(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function Ar(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function ad(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function un({ state: e, includeLabel: t = !0 }) {
  const r = Ut[e] || Ut.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: hi(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function id(e, t = null) {
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
function Tu(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function sd(e, t = document) {
  return !(e.defaultPrevented || id(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function Au(e, t = document, r = !1, o = {}) {
  return sd(e, t) ? yl(e, r, o) != null : !1;
}
function ld(e, t, r = null) {
  return !(!t || e instanceof Element && (t.contains(e) || r != null && r.contains(e)));
}
function Et(e, { onCancel: t, onConfirm: r } = {}) {
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
function dd(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function cd({ confirm: e, cancel: t, confirmReady: r }) {
  const o = r && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function bo({ confirmRef: e, cancelRef: t, confirmReady: r }) {
  ye(() => {
    const o = requestAnimationFrame(() => cd({
      confirm: e.current,
      cancel: t == null ? void 0 : t.current,
      confirmReady: r
    }));
    return () => cancelAnimationFrame(o);
  }, [r]);
}
function Wt(e) {
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
function ya(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? i.filter((a) => a.sequence > o && a.sequence <= r).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > r && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function ho(e, t = !0) {
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
function fr(e, t = !0) {
  return {
    type: "segment",
    identity: ho(e, t),
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
function Pt(e, t = !0) {
  return {
    type: "segments",
    segments: (e || []).map((r) => ({
      identity: ho(r, t),
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
function yr(e, t) {
  return {
    type: "incorrectExamples",
    collected: t,
    entries: (e || []).map(({ segment: r, result: o, example: i }) => ({
      exampleId: (o == null ? void 0 : o.exampleId) ?? (i == null ? void 0 : i.id) ?? null,
      originalIdentity: ho(r),
      collectedIdentity: {
        itemId: (o == null ? void 0 : o.itemId) ?? (i == null ? void 0 : i.itemId) ?? null,
        nativeSegmentId: (o == null ? void 0 : o.nativeSegmentId) ?? null,
        published: (o == null ? void 0 : o.nativeSegmentId) != null,
        revision: (o == null ? void 0 : o.revision) ?? null
      }
    }))
  };
}
function $r(e) {
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
function Si(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function ki(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = t.get(r.segmentId);
    o ? o.push(r) : t.set(r.segmentId, [r]);
  }
  for (const r of t.values())
    r.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function vo(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function ud(e, t) {
  const r = (t || []).map((i) => Si(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: Ct(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function md(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : ud(e, t);
}
function gd({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function Ru(e, t) {
  return vo(Si(e, t));
}
function Ct(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function pd(e, t) {
  const r = (d) => Ct(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
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
    const u = [...c].sort(o), b = [...m].sort(o);
    u.forEach((g, f) => l.push({
      sourceSlotDefinitionId: g.id,
      derivedSlotDefinitionId: b[f].id
    }));
  }
  return l;
}
function fd(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = pd(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function yd(e) {
  const t = Ct(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(Rr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function Rr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function Tr(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function ba(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((m) => m.end <= s && m.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: Tr(o),
    trackCount: Math.max(1, t.length)
  };
}
function bd(e) {
  const t = e.map(Ct), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function hd(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], m = d.length > 0 && d.every((u) => Number(u.performerId) > 0) ? d.map((u) => `${u.slotDefinitionId}:${Number(u.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: m };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [ba({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = bd(l.slots), m = l.slots.filter((y) => !a.has(String(y.slotDefinitionId))), u = o.length === 1 ? l.slots : m, b = u.map((y) => `${c.get(String(y.slotDefinitionId))} · ${y.performerName || `Performer ${y.performerId}`}`).join(" · "), g = [...new Map(u.map((y) => [
          Number(y.performerId),
          { id: Number(y.performerId), name: y.performerName || `Performer ${y.performerId}` }
        ])).values()], f = l.slots.map((y) => ({
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
          performerLabel: b,
          performers: g,
          performerAssignments: f,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(ba);
}
function dn(e, t = [], r = []) {
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
      const m = o.get(s.tagId);
      i.set(d, {
        key: d,
        tagId: s.tagId,
        label: l,
        // A segment shown with a new tag has no sort name yet; the group catalog knows it.
        tagSortName: s.tagSortName || (m == null ? void 0 : m.tagSortName) || null,
        segmentGroupId: (m == null ? void 0 : m.segmentGroupId) ?? null,
        segmentGroupName: (m == null ? void 0 : m.segmentGroupName) ?? null,
        segmentGroupSortOrder: (m == null ? void 0 : m.segmentGroupSortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (m == null ? void 0 : m.segmentGroupTagSortOrder) ?? Number.MAX_SAFE_INTEGER,
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => hd(s, a));
}
function xo(e) {
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
function wi(e) {
  return (e || []).some((t) => t.id != null);
}
const vd = {
  group: 38,
  lane: 33,
  segment: 41
};
function xd(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = vd[s.kind];
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
function Ni(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function Sd(e, t = [], r = !0) {
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
function kd(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: Tr(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return xo(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: Tr(a)
    };
  });
}
function Ii(e, { nativeOnly: t = !1 } = {}) {
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
function ha(e, t) {
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
function rn(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function er(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function wd(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var r;
    return (r = t[0]) == null ? void 0 : r.toUpperCase();
  }).join("") || "?";
}
function tr({ performer: e, compact: t = !1, tooltip: r = null }) {
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
    }, o ? wd(e.name) : "—"),
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
function Ci({ assignments: e, className: t = "" }) {
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
      n(tr, {
        key: `${r.key}:avatar`,
        performer: r.performer
      })
    ];
  }));
}
function Mr({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = fe(null), i = `performer-slots-${gi()}`, [a, s] = K(null);
  function l() {
    var g;
    const c = (g = o.current) == null ? void 0 : g.getBoundingClientRect();
    if (!c) return;
    const m = Math.max(0, Math.min(256, window.innerWidth - 16)), u = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), b = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - m - 8, c.right - m)),
      top: b >= u + 8 ? c.bottom + 4 : Math.max(8, c.top - u - 4),
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
    ...e.slice(0, 3).map((c) => n(tr, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? As(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(Ci, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : n("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => n(tr, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function Nd(e, t) {
  const r = new Set(rn(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function $i(e, t) {
  return t ? rn(e).filter((r) => r !== t) : rn(e);
}
function Id(e, t) {
  const r = rn(t), o = new Set(rn(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function Gt(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function va(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), m = Number.isFinite(c) && c >= d ? c : d, u = d <= o && m >= o, b = u ? 0 : Math.min(Math.abs(o - d), Math.abs(o - m));
    return { contains: u, distance: b, duration: m - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function io(e, t, r, o = null) {
  var m, u, b, g, f, y;
  const i = e.findIndex((w) => w.markers.some((A) => A.segment.id === t));
  if (i < 0) {
    const w = [...((m = e[0]) == null ? void 0 : m.markers) || []];
    return o != null && Number.isFinite(Number(o)) && w.sort((A, p) => va(A, p, o)), ((u = w[0]) == null ? void 0 : u.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((w) => w.segment.id === t);
  if (r === "left" || r === "right") {
    const w = r === "left" ? -1 : 1, A = Math.min(a.markers.length - 1, Math.max(0, s + w));
    return ((b = a.markers[A]) == null ? void 0 : b.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((g = a.markers[s]) == null ? void 0 : g.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((f = a.markers[s]) == null ? void 0 : f.segment) ?? null : ((y = [...e[l].markers].sort(c ? (w, A) => va(w, A, Number(o)) : (w, A) => Math.abs(w.segment.startSec - d) - Math.abs(A.segment.startSec - d) || w.segment.startSec - A.segment.startSec || w.segment.id - A.segment.id)[0]) == null ? void 0 : y.segment) ?? null;
}
function Cd(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = io([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function $d(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function Td(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function Ad(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [ka(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => ka(Math.min(s, r + l))))];
}
function Rd(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function Md(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function wr(e, t) {
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
function xa(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function Ed(e) {
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
async function Dd(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await Sa(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], m = Ad(
        d.startSec,
        d.endSec
      );
      for (const [u, b] of m.entries()) {
        Math.abs(r.currentTime - b) > 5e-4 && (r.currentTime = b, await Sa(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const g = await Od(o), f = `example-${l + 1}-frame-${u + 1}`;
        c.push({ fieldName: f, timestampSec: b }), s.push({
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
function Sa(e, t) {
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
function Od(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function ka(e) {
  return Math.round(e * 1e3) / 1e3;
}
function Mu(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Pd(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function Eu(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function Du(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Ou(e, t) {
  const r = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...r.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function en(e, t, r, o) {
  const i = (r || []).map((d) => ({ ...d, segmentId: t })), a = e.performerSlots || [], s = a.findIndex((d) => d.segmentId === t), l = a.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...i), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function Ld(e, t) {
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
function So(e, t) {
  return (e || []).some((r) => (t || []).some((o) => Rn(r, o)));
}
function Rt(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function Ti(e, t) {
  return (e || []).find((r) => Rn(t, r)) || null;
}
function Ai(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Fd(e, t) {
  var r;
  return ((r = e.running) == null ? void 0 : r.kind) === t;
}
function Pu(e) {
  return e.running != null || e.queued.length > 0;
}
const wa = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
function br(e) {
  return Object.freeze({
    id: e.id,
    kind: e.kind,
    lockId: e.lockId,
    targets: e.targets,
    exclusive: e.exclusive,
    meta: e.meta
  });
}
function jd({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let r = 1, o = null, i = [], a = null, s = !1, l = 0, d = 0;
  const c = () => !t && d < l, m = /* @__PURE__ */ new Map();
  let u = wa;
  const b = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Set();
  let f = [];
  function y() {
    u = o == null && i.length === 0 && a == null ? wa : Object.freeze({
      running: o ? br(o) : null,
      queued: Object.freeze(i.map(br)),
      lastFailure: a
    });
    for (const k of [...g]) k();
    if (o == null && i.length === 0) {
      const k = f;
      f = [];
      for (const R of k) R();
    }
  }
  function w(k, R) {
    b.set(k.id, R.status), k.resolve(R);
  }
  function A(k) {
    if (k.dependsOn == null) return "met";
    const R = b.get(k.dependsOn);
    return R === "fulfilled" ? "met" : R != null ? "failed" : "pending";
  }
  function p(k) {
    o = k;
    const R = { ...e(), taskId: k.id, targets: k.targets };
    R.resolveTargets = () => k.targets.map((L) => Ti(R.segments, L)).filter(Boolean), y();
    let z;
    try {
      z = k.run(R);
    } catch (L) {
      z = Promise.reject(L);
    }
    Promise.resolve(z).then(
      (L) => G(k, { status: "fulfilled", value: L }),
      (L) => G(k, { status: "rejected", error: L })
    );
  }
  function G(k, R) {
    k.settled || (k.settled = !0, w(k, R), !s && (o = null, R.status === "rejected" && (a = Object.freeze({ id: k.id, kind: k.kind, error: R.error })), y(), l += 1, t && P()));
  }
  function P() {
    if (s || o != null || c()) return;
    let k = !1;
    for (let R = 0; R < i.length; R += 1) {
      const z = i[R], L = A(z);
      if (L === "failed") {
        i = i.filter((C) => C !== z), w(z, { status: "dropped", reason: "dependency-failed" }), k = !0, R -= 1;
        continue;
      }
      if (L !== "pending" && !(z.exclusive && R > 0) && !i.slice(0, R).some((C) => So(C.targets, z.targets)) && !(z.ready && !z.ready(e(), br(z)))) {
        i = i.filter((C) => C !== z), p(z);
        return;
      }
    }
    k && y();
  }
  function q(k) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((O) => O.exclusive) || o != null && k.whenBusy !== "enqueue" || k.exclusive && (o != null || i.length > 0 || c())) return null;
    let z;
    const L = new Promise((O) => {
      z = O;
    }), C = {
      id: r++,
      kind: k.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: k.lockId ?? -1,
      targets: Object.freeze((k.targets || []).map(E)),
      exclusive: k.exclusive === !0,
      dependsOn: k.dependsOn ?? null,
      ready: k.ready || null,
      meta: k.meta ?? null,
      run: k.run,
      resolve: z
    };
    return i = [...i, C], y(), P(), { id: C.id, done: L };
  }
  function W(k = {}) {
    let R = null;
    const z = q({
      ...k,
      whenBusy: "reject",
      run: () => new Promise((C) => {
        R = C;
      })
    });
    if (!z) return null;
    if (R == null)
      return S((C) => C.id === z.id), null;
    let L = !1;
    return () => {
      L || (L = !0, R(), (o == null ? void 0 : o.id) === z.id && G(o, { status: "fulfilled", value: void 0 }));
    };
  }
  function E(k) {
    return (k == null ? void 0 : k.id) == null || k.itemId != null || k.nativeSegmentId != null ? k : m.get(k.id) || k;
  }
  function T(k, R) {
    m.set(k, { ...R });
    let z = !1;
    for (const L of i)
      L.targets.some((C) => C.id === k && C.itemId == null && C.nativeSegmentId == null) && (L.targets = Object.freeze(L.targets.map((C) => C.id === k ? { ...R } : C)), z = !0);
    return z && y(), z;
  }
  function S(k) {
    const R = i.filter((z) => k(br(z)));
    if (R.length === 0) return 0;
    i = i.filter((z) => !R.includes(z));
    for (const z of R) w(z, { status: "cancelled" });
    return y(), P(), R.length;
  }
  return {
    enqueue: q,
    acquire: W,
    cancel: S,
    retarget: T,
    stableIdentity: E,
    // The host reads `settledCount()` while rendering and reports it here once that render commits.
    settledCount: () => l,
    markCommitted(k = l) {
      d = Math.max(d, k);
    },
    poke: () => P(),
    subscribe(k) {
      return g.add(k), () => g.delete(k);
    },
    getSnapshot: () => u,
    whenIdle() {
      return o == null && i.length === 0 ? Promise.resolve() : new Promise((k) => f.push(k));
    },
    dispose() {
      if (s) return;
      const k = i;
      i = [], s = !0;
      for (const z of k) w(z, { status: "cancelled" });
      g.clear();
      const R = f;
      f = [];
      for (const z of R) z();
    }
  };
}
let Bd = 1;
function _t() {
  return `pending-${Bd++}`;
}
function Gd(e) {
  return e.sort((t, r) => t.startSec - r.startSec || t.id - r.id);
}
function Nr(e, t) {
  return (t || []).some((r) => Rn(r, e));
}
function Ud(e, t) {
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
function Ri(e, t) {
  return t && (e || []).find((r) => {
    var o;
    return ((o = r.meta) == null ? void 0 : o.kind) === "held-tag" && !r.settled && Nr(t, r.targets);
  }) || null;
}
function Kd(e) {
  return (e || []).filter((t) => t.op === "insert" && !t.settled).map((t) => t.segment);
}
function Mi(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function Ei(e, t) {
  const r = (e || []).filter((o) => !Mi(o, t));
  return r.length === (e || []).length ? e : r;
}
function Di(e, t) {
  let r = !1;
  const o = (e || []).map((i) => i.settled || !Mi(i, t) ? i : (r = !0, { ...i, settled: !0, settledDetail: null }));
  return r ? o : e;
}
function zd(e, t, r) {
  let o = !1;
  const i = (e || []).map((a) => a.targets.some((s) => s.id === t && s.itemId == null && s.nativeSegmentId == null) ? (o = !0, {
    ...a,
    targets: a.targets.map((s) => s.id === t ? { ...r } : s)
  }) : a);
  return o ? i : e;
}
function Hd(e, t) {
  if (!t || t.length === 0) return e;
  let r = [...e || []];
  for (const o of t)
    if (o.op === "insert")
      r.some((i) => Rn(o.segment, i)) || r.push(o.segment);
    else if (o.op === "patch")
      r = r.map((i) => Nr(i, o.targets) ? { ...i, ...o.values } : i);
    else if (o.op === "remove")
      r = r.filter((i) => !Nr(i, o.targets));
    else if (o.op === "merge") {
      const [i, ...a] = o.targets;
      r = r.filter((s) => !Nr(s, a)).map((s) => Rn(i, s) ? { ...s, ...o.values } : s);
    }
  return Gd(r);
}
function Oi(e, t) {
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
function qd(e, t, r) {
  return r ? Ei(e, t) : Di(e, t);
}
function _d(e, t) {
  switch (t.type) {
    case "confirm":
      return qd(e, t.key, t.applied);
    case "add":
      return Ud(e, t.entry);
    case "discard":
      return Ei(e, t.key);
    case "settle":
      return Di(e, t.key);
    case "retarget":
      return zd(e, t.temporaryId, t.identity);
    case "prune":
      return Oi(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
function Na(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function Wd(e) {
  const { acquireSaveLock: t, compatibilityMode: r, dispatchPendingChanges: o, enqueueSave: i, pendingChanges: a, retargetSaveTasks: s, currentTime: l, detail: d, editorFilters: c, endInput: m, hideDerivedSegments: u, historyRef: b, mediaDuration: g, onConflict: f, onDetailChange: y, onReload: w, optimisticSegmentIdRef: A, pendingDuplicateRef: p, pendingFirstSegmentStartSecRef: G, pendingTagEditSegmentIdRef: P, performerSlots: q, replaceSegmentSelection: W, savingSegmentId: E, segments: T, selectedSegment: S, selectedSegmentIdRef: k, selectedSegments: R, selectionAnchorIdRef: z, selectionRangeBaseIdsRef: L, setCreatingSegmentId: C, setEditorFilters: O, setFirstSegmentTagOpen: H, setHideDerivedSegments: X, setHistory: me, setHistoryOpen: he, setPublishApprovedError: ce, setSaveMessage: M, setSelectedSegmentGroupKey: re, setSelectedSegmentId: de, setSelectedSegmentIds: Q, setTagEditing: ue, startInput: Se, tagEditingRef: te, timelineDuration: ve, video: ne } = e;
  function V(U) {
    b.current = U || Yt, me(b.current);
  }
  async function be(U, ie, N, _, j = null) {
    var Z;
    try {
      const xe = await Y(`/videos/${ne.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: b.current.revision,
          kind: U,
          label: ie,
          beforeState: N,
          afterState: _,
          receiptId: j
        })
      });
      return V(xe), !0;
    } catch (xe) {
      return xe.status === 409 && ((Z = xe.payload) != null && Z.current) && V(xe.payload.current), M("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function I(U, ie, N = !0, _ = null, j = !1, Z = ie, xe = !0) {
    if (!U || E != null) return null;
    const pe = t("segment", U.id);
    if (!pe) return null;
    try {
      return await ee(U, ie, {
        recordHistory: N,
        historyLabel: _,
        optimisticValues: j ? Z : null,
        restoreSelectionOnFailure: xe
      });
    } finally {
      pe();
    }
  }
  async function ee(U, ie, {
    recordHistory: N = !0,
    historyLabel: _ = null,
    optimisticValues: j = null,
    pendingChangeId: Z = null,
    restoreSelectionOnFailure: xe = !0,
    onReload: pe = w,
    onConflict: Te = f
  } = {}) {
    var lt;
    const yt = R.map((Ze) => Ze.id), Fe = k.current, Me = N && !r ? crypto.randomUUID() : null;
    M(N ? "Saving directly to Cove…" : "Restoring history…");
    const Ye = Z ?? (j ? _t() : null);
    j && !Z && o({
      type: "add",
      entry: { id: Ye, op: "patch", targets: [Rt(U)], values: j }
    });
    const st = (Ze) => {
      Ye && o({ type: "confirm", key: Ye, applied: Ze });
    };
    try {
      if (r && U.nativeSegmentId == null && U.itemId != null) {
        const gt = `draft-update:${ne.id}:${U.itemId}:${U.revision}:${ie.tagId}:${ie.startSec}:${ie.endSec ?? "open"}:${ie.reviewState ?? U.reviewState}`, Ue = await Y(`/videos/${ne.id}/drafts/${U.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: qe(gt),
            expectedRevision: U.revision,
            startSec: ie.startSec,
            endSec: ie.endSec,
            tagId: ie.tagId,
            reviewState: ie.reviewState
          })
        });
        _e(gt), Ue.performerSlots != null && y((Ve) => en(Ve, U.id, Ue.performerSlots, Ue.performerSlotRevision), ne.id);
        const Je = {
          ...U,
          ...Ue.draft,
          id: U.id,
          itemId: U.itemId
        };
        return N && await be(
          "segment.update",
          _ || "Changed segment",
          fr(U, r),
          fr(
            Je,
            r
          )
        ), Na(U, ie, r) ? st(await pe() != null) : (y((Ve) => ({
          ...Ve,
          approvedSetVersion: Ue.approvedSetVersion || Ve.approvedSetVersion,
          segments: (Ve.segments || []).map((ze) => ze.id === U.id ? Je : ze).sort((ze, dt) => ze.startSec - dt.startSec || ze.id - dt.id)
        }), ne.id), st(!0)), M(((lt = Ue.draft) == null ? void 0 : lt.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), Je;
      }
      const Ze = await Y(`/videos/${ne.id}/segments/${U.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...ie,
          expectedUpdatedAt: U.updatedAt,
          historyReceiptId: Me
        })
      }), mt = {
        ...U,
        ...Ze,
        reviewState: ie.reviewState ?? U.reviewState
      };
      return Na(U, ie, r) ? st(await pe() != null) : (y((gt) => ({
        ...gt,
        segments: (gt.segments || []).map((Ue) => Ue.id === U.id ? mt : Ue).sort((Ue, Je) => Ue.startSec - Je.startSec || Ue.id - Je.id)
      }), ne.id), st(!0)), N && await be(
        "segment.update",
        _ || "Changed segment",
        fr(U, r),
        fr(
          mt,
          r
        ),
        Me
      ), M(N ? "Saved to Cove" : "History restored"), mt;
    } catch (Ze) {
      return Ye && o({ type: "discard", key: Ye }), Ye && xe && (Q(yt), de(Fe), z.current = Fe, L.current = []), Ze.status === 409 ? (M("Conflict — loading the latest segment…"), await Te()) : M(Ze.message || "Unable to save the segment."), null;
    }
  }
  async function $() {
    if (!r) return !1;
    const U = T.filter((_) => !_.published && _.reviewState === "approved").length;
    if (U === 0 || E != null) return !1;
    const ie = `complete-review:${ne.id}:${d.approvedSetVersion}`, N = t("publish", -1);
    if (!N) return !1;
    ce(""), M(`Publishing ${U} Approved draft${U === 1 ? "" : "s"}…`);
    try {
      const _ = await Y(`/videos/${ne.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: qe(ie),
          expectedApprovedSetVersion: d.approvedSetVersion
        })
      });
      _e(ie), V(Yt), he(!1);
      const j = await w(), Z = $l(
        T,
        k.current,
        _.published
      ), xe = Z ? tt(j == null ? void 0 : j.segments, Z) : null;
      return xe && de(xe.id), M(`${_.published.length} Approved draft${_.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (_) {
      const j = _.status === 409 ? "The approved drafts changed. Review the updated list and try again." : _.message || "Unable to publish the approved drafts.";
      return _.status === 409 && await f(), ce(j), M(j), !1;
    } finally {
      N();
    }
  }
  async function v(U = null, ie = null) {
    if (E != null || h()) return;
    const N = U != null ? G.current : null, _ = Number.isFinite(N) ? N : l, j = Math.min(ve, _ + 20);
    if (j <= _) {
      M("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const Z = wl(T, S, U);
    if (Z.kind === "choose-tag") {
      G.current = _, M(""), H(!0);
      return;
    }
    if (Z.kind === "invalid-selection") {
      M("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: xe } = Z, pe = `create-draft:${ne.id}:${xe}:${_}`, Te = r ? null : crypto.randomUUID(), yt = k.current, Fe = {
      ...S || {},
      id: A.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: xe,
      tagName: ie || (S == null ? void 0 : S.tagName) || "Tag segment",
      tagSortName: xe === (S == null ? void 0 : S.tagId) && (S == null ? void 0 : S.tagSortName) || null,
      startSec: _,
      endSec: j,
      // Full mode creates manual drafts already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, Me = Pd(d, Fe), Ye = Gt(
      dn(Me.segments, Me.segmentGroups || [], Me.performerSlots || []),
      Fe.id
    ), st = i({
      kind: "create",
      lockId: -1,
      run: (Ze) => lt(Ze)
    });
    if (!st) return;
    await st.done;
    async function lt({ onReload: Ze, taskId: mt }) {
      var Ue;
      const gt = _t();
      o({ type: "add", entry: { id: gt, taskId: mt, op: "insert", segment: Fe } }), H(!1), Z.openTagEditor && (C(Fe.id), P.current = Fe.id, ue(!0)), W(Fe.id), re(Ye);
      try {
        let Je;
        if (r) {
          const dt = await Y(`/videos/${ne.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: qe(pe), tagId: xe, startSec: _, endSec: j })
          });
          _e(pe), Je = { itemId: (Ue = dt.draft) == null ? void 0 : Ue.itemId }, dt.performerSlots != null && y((ht) => en(ht, Fe.id, dt.performerSlots, dt.performerSlotRevision), ne.id);
        } else
          Je = { nativeSegmentId: (await Y(`/videos/${ne.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: xe,
              startSec: _,
              endSec: j,
              historyReceiptId: Te
            })
          })).id };
        G.current = null, H(!1);
        const Ve = await Ze();
        if (o({ type: "discard", key: gt }), !Ve) {
          y((dt) => en(dt, Fe.id, []), ne.id), W(yt), M(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${Z.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const ze = tt(Ve == null ? void 0 : Ve.segments, Je);
        ze ? (o({ type: "retarget", temporaryId: Fe.id, identity: Rt(ze) }), s(Fe.id, Rt(ze)), Z.openTagEditor && (te.current && (P.current = ze.id), C(ze.id)), W(ze.id), re(Gt(
          dn(Ve.segments || [], Ve.segmentGroups || [], Ve.performerSlots || []),
          ze.id
        )), r || await be(
          "segment.create",
          "Created segment",
          Pt([], !1),
          Pt([ze], !1),
          Te
        )) : (ue(!1), M(`Segment created, but it could not be selected${Z.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (Je) {
        throw o({ type: "discard", key: gt }), W(yt), U != null && H(!0), M(Je.message || "Unable to create the draft."), Je;
      } finally {
        C(null);
      }
    }
  }
  function h() {
    return Ri(a, S) ? (M("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function x() {
    if (R.length !== 1 || !S || E != null || h()) return;
    const U = l;
    if (U <= S.startSec || S.endSec != null && U >= S.endSec) {
      M("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const ie = `split-draft:${S.itemId}:${S.revision}:${U}`, N = r ? null : Pt([S], !1), _ = r ? null : crypto.randomUUID(), j = t("split", S.id);
    if (j)
      try {
        let Z = null;
        r && S.nativeSegmentId == null ? (await Y(`/videos/${ne.id}/drafts/${S.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: qe(ie),
            expectedRevision: S.revision,
            splitSec: U
          })
        }), _e(ie)) : Z = { nativeSegmentId: (await Y(`/videos/${ne.id}/segments/${S.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: S.updatedAt,
            splitSec: U,
            historyReceiptId: _
          })
        })).id };
        const xe = await w();
        if (!r) {
          const pe = [
            tt(xe == null ? void 0 : xe.segments, {
              nativeSegmentId: S.nativeSegmentId ?? S.id
            }),
            tt(
              xe == null ? void 0 : xe.segments,
              Z
            )
          ].filter(Boolean);
          await be(
            "segment.split",
            "Split segment",
            N,
            Pt(pe, !1),
            _
          );
        }
        M(r ? `Segment split; both ranges remain ${S.reviewState}.` : "Segment split.");
      } catch (Z) {
        Z.status === 409 ? await f() : M(Z.message || "Unable to split the draft.");
      } finally {
        j();
      }
  }
  async function D(U = !1) {
    if (R.length !== 1 || !S || E != null || h()) return;
    const ie = U ? l : S.startSec, N = kl(ne.id, S, U, ie), _ = r ? null : crypto.randomUUID(), j = S, Z = k.current, xe = j.endSec == null ? null : j.endSec - j.startSec, pe = {
      ...j,
      id: A.current--,
      itemId: null,
      nativeSegmentId: null,
      startSec: ie,
      endSec: xe == null ? null : ie + xe,
      // Full mode creates the copy already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : j.reviewState,
      revision: 0,
      updatedAt: null
    }, Te = (q || []).filter((Me) => Me.segmentId === j.id), yt = i({
      kind: "duplicate",
      lockId: -1,
      targets: [Rt(j)],
      run: (Me) => Fe(Me)
    });
    if (!yt) return;
    await yt.done;
    async function Fe({ onReload: Me, onConflict: Ye, taskId: st }) {
      var mt, gt;
      const lt = _t();
      o({ type: "add", entry: { id: lt, taskId: st, op: "insert", segment: pe } }), Te.length > 0 && y((Ue) => en(Ue, pe.id, Te), ne.id), U || (C(pe.id), P.current = pe.id, ue(!0)), W(pe.id);
      const Ze = () => {
        o({ type: "discard", key: lt }), Te.length > 0 && y((Ue) => en(Ue, pe.id, []), ne.id);
      };
      try {
        const Ue = ((mt = p.current) == null ? void 0 : mt.operationKey) === N ? p.current : null;
        let Je = (Ue == null ? void 0 : Ue.duplicateIdentity) ?? null;
        if (Je == null && r && j.nativeSegmentId == null) {
          const ht = await Y(`/videos/${ne.id}/drafts/${j.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: qe(N),
              expectedRevision: j.revision,
              startSec: U ? ie : null
            })
          });
          Je = aa(!1, ht), p.current = { operationKey: N, duplicateIdentity: Je };
        } else if (Je == null) {
          const ht = await Y(`/videos/${ne.id}/segments/${j.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: j.updatedAt,
              startSec: U ? ie : null,
              historyReceiptId: _
            })
          });
          Je = aa(!0, ht), p.current = { operationKey: N, duplicateIdentity: Je };
        }
        const Ve = await Me();
        Ze();
        const ze = tt(Ve == null ? void 0 : Ve.segments, Je);
        if (!ze) {
          ue(!1), W(Z), M(Ve ? "Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection." : "Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.");
          return;
        }
        o({ type: "retarget", temporaryId: pe.id, identity: Rt(ze) }), s(pe.id, Rt(ze));
        const dt = ni(
          ze,
          Ve.performerSlots || [],
          c,
          u,
          Ve.segmentGroups || []
        );
        O(dt.filters), X(dt.hideDerivedSegments), !U && te.current && (P.current = ze.id), W(ze.id), re(Gt(
          dn(Ve.segments || [], Ve.segmentGroups || [], Ve.performerSlots || []),
          ze.id
        )), r && j.nativeSegmentId == null && _e(N), p.current = null, M(U ? "Duplicate created at the playhead." : "Duplicate created in place."), r || await be(
          "segment.duplicate",
          "Duplicated segment",
          Pt([], !1),
          Pt([ze], !1),
          _
        );
      } catch (Ue) {
        throw Ze(), ue(!1), W(Z), ((gt = p.current) == null ? void 0 : gt.operationKey) === N ? M("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : Ue.status === 409 ? await Ye() : M(Ue.message || "Unable to duplicate the draft."), Ue;
      } finally {
        C(null);
      }
    }
  }
  async function ae() {
    if (R.length !== 1 || !S) return;
    const U = Number(Se), ie = m.trim() === "" ? null : Number(m), N = Yo(U, ie, g);
    if (N.error) {
      M(N.error);
      return;
    }
    if (U === S.startSec && ie === S.endSec) {
      M("Timing is unchanged.");
      return;
    }
    await I(S, { startSec: U, endSec: ie, tagId: S.tagId }, !0, null, !0);
  }
  async function oe(U, ie) {
    if (R.length !== 1 || !S) return;
    const N = Yo(U, ie, g);
    if (N.error) {
      M(N.error);
      return;
    }
    if (U === S.startSec && ie === S.endSec) {
      M("Timing is unchanged.");
      return;
    }
    await I(S, { startSec: U, endSec: ie, tagId: S.tagId }, !0, null, !0);
  }
  return { acceptHistory: V, recordHistoryAction: be, mutateSegment: I, runSegmentMutation: ee, completeReview: $, createSegment: v, splitSegment: x, duplicateSegment: D, saveTiming: ae, applyShortcutTiming: oe };
}
function Vd() {
  const [e, t] = K(() => typeof window < "u" && window.matchMedia(Wo).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Wo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Jd() {
  const [e, t] = K(() => typeof window < "u" && window.matchMedia(Vo).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Vo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Yd() {
  try {
    return Ws(window.localStorage.getItem(qa));
  } catch {
    return { ...Mt };
  }
}
function Qd() {
  try {
    return rn(JSON.parse(window.localStorage.getItem(_a) || "[]"));
  } catch {
    return [];
  }
}
function Zd(e) {
  try {
    window.localStorage.setItem(_a, JSON.stringify(rn(e)));
  } catch {
  }
}
function Xd(e) {
  try {
    window.localStorage.setItem(qa, JSON.stringify(e));
  } catch {
  }
}
function ec() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Va) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function tc(e) {
  try {
    return window.localStorage.setItem(Va, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function nc({ status: e }) {
  const t = xi[e];
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
function nn({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, It.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...hi(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${Ut[t].symbol}${e[t]}`)));
}
function rc({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: m, shortcutRef: u }) {
  const b = po(a), [g, f] = K(() => Qr(o, b)), [y, w] = K(!1), [A, p] = K(""), G = fe(!1), P = o.map((k) => `${k.slotDefinitionId}:${k.performerId || ""}`).join("|"), q = b.map((k) => ut(k)).join("|"), W = ui(
    o,
    b
  );
  ye(() => {
    f(Qr(o, b)), p("");
  }, [t, r, P, q]);
  async function E(k = g) {
    if (!G.current) {
      G.current = !0, w(!0), p("Saving performer slots…");
      try {
        const R = Qr(o.map((C) => ({
          ...C,
          performerId: k[C.slotDefinitionId] || null
        })), b), z = o.map((C) => {
          const O = R[C.slotDefinitionId] ? Number(R[C.slotDefinitionId]) : null, H = b.find((X) => String(ut(X)) === String(O));
          return {
            ...C,
            performerId: O,
            performerName: (H == null ? void 0 : H.name) || null
          };
        });
        if (s(z) === !1) {
          p("");
          return;
        }
        const L = await Y(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((C) => ({ slotDefinitionId: C.slotDefinitionId, performerId: R[C.slotDefinitionId] ? Number(R[C.slotDefinitionId]) : null }))
          })
        });
        p("Performer slots saved."), await l(L, {
          beforeState: $r([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: $r([{
            segmentId: t,
            itemId: r,
            revision: L.revision,
            slots: L.slots || []
          }])
        });
      } catch (R) {
        d && await d(o, R), R.status === 409 ? (p("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : p(R.message || "Unable to save performer slots.");
      } finally {
        G.current = !1, w(!1);
      }
    }
  }
  function T(k, R) {
    p(`Option ${R + 1} applied; save to confirm.`), f({ ...g, ...k.assignments });
  }
  async function S(k) {
    const R = { ...g, ...k.assignments };
    f(R), await E(R);
  }
  return ye(() => {
    if (u)
      return u.current = (k) => G.current || !W[k] ? !1 : (S(W[k]), !0), () => {
        u.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    W.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, W.map((k, R) => n("button", {
        key: R,
        type: "button",
        disabled: y,
        onClick: () => T(k, R),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${R + 1}: ${k.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, R + 1),
        n("span", { key: "description" }, k.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${W.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((k) => n("label", { key: k.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Ct(k)),
      (k.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(k.genderHints || []).map(Rr).join(" · ")}`) : null,
      n("select", { key: "select", value: g[k.slotDefinitionId] || "", disabled: y, onChange: (R) => f({ ...g, [k.slotDefinitionId]: R.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...mi(b, b, k.genderHints).map((R) => n("option", { key: ut(R), value: ut(R) }, R.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: m, type: "button", disabled: y, onClick: () => E(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, A)])
  ]);
}
function oc({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a, acquireSaveLock: s = () => () => {
} }) {
  var E;
  const l = ((E = t[0]) == null ? void 0 : E.slots) || [], d = po(r), c = ui(
    l,
    d
  ), m = "__mixed__", u = () => Object.fromEntries(l.map((T, S) => {
    const k = t.map((R) => {
      var z;
      return String(((z = R.slots[S]) == null ? void 0 : z.performerId) || "");
    });
    return [T.slotDefinitionId, k.every((R) => R === k[0]) ? k[0] : m];
  })), [b, g] = K(u), [f, y] = K(!1), [w, A] = K(""), p = fe(!1), G = t.map((T) => `${T.itemId ?? `native:${T.segmentId}`}:${T.revision}:${T.slots.map((S) => `${S.slotDefinitionId}:${S.performerId || ""}`).join(",")}`).join("|");
  ye(() => {
    g(u());
  }, [G]);
  async function P(T = b) {
    if (p.current) return;
    const S = s();
    if (!S) {
      A("Wait for the current save to finish before saving performer slots.");
      return;
    }
    p.current = !0, y(!0), A(`Saving performer slots for ${t.length} segments…`);
    const k = [];
    try {
      for (const R of t) {
        const z = R.slots.map((C, O) => {
          const H = T[l[O].slotDefinitionId];
          return {
            slotDefinitionId: C.slotDefinitionId,
            performerId: H === m ? C.performerId || null : H ? Number(H) : null
          };
        }), L = await Y(R.itemId != null ? `/videos/${e}/drafts/${R.itemId}/slots` : `/videos/${e}/segments/${R.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: R.revision, assignments: z })
        });
        k.push({
          segmentId: R.segmentId,
          itemId: R.itemId,
          revision: L.revision,
          slots: L.slots || []
        });
      }
      A("Performer slots saved."), await o({
        beforeState: $r(t),
        afterState: $r(k)
      });
    } catch (R) {
      const z = await i();
      R.status === 409 ? A(z ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : A(R.message || (z ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      p.current = !1, y(!1), S();
    }
  }
  function q(T, S) {
    A(`Option ${S + 1} applied; save to confirm.`), g({ ...b, ...T.assignments });
  }
  async function W(T) {
    const S = { ...b, ...T.assignments };
    g(S), await P(S);
  }
  return ye(() => {
    if (a)
      return a.current = (T) => p.current || !c[T] ? !1 : (W(c[T]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, c.map((T, S) => n("button", {
        key: S,
        type: "button",
        disabled: f,
        onClick: () => q(T, S),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${S + 1} to all selected segments: ${T.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, S + 1),
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
        onChange: (S) => g({ ...b, [T.slotDefinitionId]: S.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        b[T.slotDefinitionId] === m ? n("option", { key: "mixed", value: m }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...mi(d, d, T.genderHints).map((S) => n("option", {
          key: ut(S),
          value: ut(S)
        }, S.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: f,
        onClick: () => P(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, w)
    ])
  ]);
}
function Kt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function ac(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return Kt(t);
  const o = [...new Set(r.map((i) => Kt(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function Er() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function hr({ name: e }) {
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
function ic({ hidden: e }) {
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
    n(Er, { key: "derived" })
  ]);
}
function sc({ segment: e, provenance: t }) {
  var m;
  const [r, o] = K(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = ac(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
        const b = u.modelIdentifier || u.modelKey, g = u.value == null ? null : typeof u.value == "string" ? u.value : JSON.stringify(u.value);
        return n("div", { key: u.id || `${u.fieldKey}:${u.sourceKey}:${u.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            Kt(u.sourceKey, u.sourceDisplayName)
          ),
          u.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${u.fieldKey}${g == null ? "" : ` · ${g}`}`
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
function lc({
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
  const [u, b] = K([]), g = e.flatMap((A) => A.lanes.map((p) => p.key)), f = g.join("|");
  ye(() => {
    const A = new Set(g);
    b((p) => p.filter((G) => A.has(G)));
  }, [f]);
  const y = Tr(t), w = !!Ii(
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
      a ? n(nn, { key: "counts", counts: y }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      gd({ mergeable: w, reviewable: a, tagEditable: s, slotsEditable: l })
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
    ...e.map((A) => n("section", {
      key: A.key,
      "data-selected-segment-group": A.key,
      className: "space-y-1.5"
    }, [
      n("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        n("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, A.name),
        n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${A.selectedCount} selected`)
      ]),
      ...A.lanes.map((p) => {
        const G = u.includes(p.key), P = p.markers.some(({ segment: W }) => W.id === r), q = `selected-segment-lane-${p.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: p.key,
          "data-selected-segment-lane": p.key,
          className: `rounded-md border ${P ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": G,
            "aria-controls": q,
            "aria-current": P ? "true" : void 0,
            onClick: () => b((W) => G ? W.filter((E) => E !== p.key) : [...W, p.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, G ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, er(p)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(p.selectedCount)),
            a ? n(nn, { key: "states", counts: p.counts }) : null
          ]),
          G ? n("div", {
            key: "segments",
            id: q,
            className: "space-y-1 border-t border-border p-1.5"
          }, p.markers.map(({ segment: W }) => {
            const E = W.endSec == null ? Re(W.startSec) : `${Re(W.startSec)} – ${Re(W.endSec)}`;
            return n("button", {
              key: W.id,
              type: "button",
              onClick: () => i(W),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${W.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${W.tagName || "Segment"}, ${W.reviewState}, ${E}` : `${W.tagName || "Segment"}, ${E}`,
              "aria-current": W.id === r ? "true" : void 0
            }, [
              a ? n(un, {
                key: "state",
                state: W.reviewState,
                includeLabel: !1
              }) : null,
              W.isDerived ? n(Er, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, E),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                Kt(W.sourceKey)
              )
            ]);
          })) : null
        ]);
      })
    ]))
  ]);
}
const Vn = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"]
}, Ia = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], Ca = [
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
function rr(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function Pi(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function $a(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function vr(e, t, r, o = null) {
  const i = $a(t), a = $a(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function dc(e, t, r = null) {
  var u, b, g;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (u = t.hasSegmentsCriterion) == null ? void 0 : u.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), vr(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), vr(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), vr(o, t.performersCriterion, "performer"), vr(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = Ta(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = Ta(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((b = t.reviewStateCriterion) == null ? void 0 : b.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const m = (g = t.shotBoundariesCriterion) == null ? void 0 : g.value;
  return r && typeof m == "boolean" ? o.set("hasShotBoundaries", String(m)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function Ta(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function cc(e, t, r, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((m) => a.add(m));
  } else a.has(r) ? a.delete(r) : a.add(r);
  return a;
}
function Li({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(fa, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, It.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = Ut[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(fa, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function Fi({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
function uc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      onClick: (l) => rr(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      n(Fi, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, Rs(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(Li, { item: e, showReviewStates: r }))
    ])
  ]);
}
function mc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n(Fi, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
    n(i ? "div" : "a", {
      key: "link",
      href: i ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: i ? void 0 : (l) => rr(l, t, s),
      className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
      n("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
        n("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
        n(Li, { key: "segments", item: e, showReviewStates: r })
      ]),
      n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function ko({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = Ml(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => rr(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && An(
        o,
        Qt.recyclingBinView
      ) ? n(ji, { key: "bin", onNavigate: t }) : null,
      n(Bi, { key: "settings", onNavigate: t })
    ])
  ]);
}
const so = "segment-studio:recycling-bin-changed";
function gc(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function Qn() {
  window.dispatchEvent(new CustomEvent(so));
}
function ji({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = K(null);
  ye(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const m = await Y("/bin"), u = Number(m == null ? void 0 : m.totalCount);
        !a && c === s && o(Number.isFinite(u) && u >= 0 ? Math.trunc(u) : null);
      } catch {
        !a && c === s && o(null);
      }
    }, d = () => {
      l();
    };
    return l(), window.addEventListener(so, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(so, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = gc(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => rr(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function Bi({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => rr(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function pc({ mode: e, onModeChange: t, disabled: r = !1 }) {
  function o(i) {
    const a = oo(i.target.value);
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
function fc({ minimum: e, maximum: t, onChange: r }) {
  const o = fe(null), [i, a] = K("maximum"), s = (b, g) => {
    const f = nl(e, t, b, g);
    a(f.coincidentTop), r({ minimum: f.minimum, maximum: f.maximum });
  }, l = (b, g) => {
    var y;
    const f = (y = o.current) == null ? void 0 : y.getBoundingClientRect();
    f && s(b, tl(g.clientX, f.left, f.width));
  }, d = (b, g) => {
    var f, y;
    g.preventDefault(), (y = (f = g.currentTarget).setPointerCapture) == null || y.call(f, g.pointerId), l(b, g);
  }, c = (b, g) => {
    var f, y;
    (y = (f = g.currentTarget).hasPointerCapture) != null && y.call(f, g.pointerId) && l(b, g);
  }, m = (b, g) => {
    const f = b === "minimum" ? e : t, y = b === "minimum" ? 0 : e, w = b === "minimum" ? t : 1, A = g.shiftKey ? 0.1 : 0.01;
    let p = null;
    ["ArrowLeft", "ArrowDown"].includes(g.key) && (p = f - A), ["ArrowRight", "ArrowUp"].includes(g.key) && (p = f + A), g.key === "PageDown" && (p = f - 0.1), g.key === "PageUp" && (p = f + 0.1), g.key === "Home" && (p = y), g.key === "End" && (p = w), p != null && (g.preventDefault(), s(b, Math.min(w, Math.max(y, p))));
  }, u = (b, g) => n("span", {
    key: b,
    role: "slider",
    tabIndex: 0,
    "aria-label": b === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((b === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((b === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(g * 100),
    "aria-valuetext": `${Math.round(g * 100)} percent`,
    onPointerDown: (f) => d(b, f),
    onPointerMove: (f) => c(b, f),
    onKeyDown: (f) => m(b, f),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${g * 100}%`,
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
function yc({ saving: e, error: t, onSelect: r, onClose: o }) {
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
    onKeyDownCapture: (s) => Et(s, { onCancel: a })
  }, n("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: Wt,
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
    n(Zn, {
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
function bc({
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
  const u = Lt(e), b = [...new Map((a || []).map((p) => [
    Number(p.tagId),
    p.tagName || `Tag ${p.tagId}`
  ])).entries()].sort((p, G) => p[1].localeCompare(G[1]) || p[0] - G[0]), g = new Set((a || []).map((p) => Number(p.tagId))), f = (s || []).filter((p) => Number(p.id) === u.segmentGroupId || (p.tags || []).some((G) => g.has(Number(G.tagId)))), y = (p) => d(Lt({ ...u, ...p })), w = (p) => y({
    reviewStates: u.reviewStates.includes(p) ? u.reviewStates.filter((G) => G !== p) : [...u.reviewStates, p]
  }), A = (p) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${p ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (p) => {
      p.target === p.currentTarget && m();
    },
    onKeyDownCapture: (p) => Et(p, { onCancel: m })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: Wt,
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
        n("div", { className: "flex flex-wrap gap-2" }, It.map((p) => {
          const G = u.reviewStates.includes(p), P = Ut[p];
          return n("button", {
            key: p,
            type: "button",
            onClick: () => w(p),
            "aria-pressed": G,
            className: A(G)
          }, `${P.symbol} ${p} (${i[p] || 0})`);
        }))
      ]) : null,
      l ? n("fieldset", { key: "performer", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Performer"),
        n("p", { className: "text-xs text-secondary" }, "Any assigned slot may match the selected performer."),
        n("div", { className: "flex flex-wrap gap-2" }, [
          n("button", {
            key: "any",
            type: "button",
            onClick: () => y({ performerId: null }),
            "aria-pressed": u.performerId == null,
            className: A(u.performerId == null)
          }, "All performers"),
          ...r.map((p) => {
            const G = Number(ut(p));
            return n("button", {
              key: G,
              type: "button",
              onClick: () => y({ performerId: G }),
              "aria-pressed": u.performerId === G,
              className: A(u.performerId === G)
            }, p.name);
          })
        ])
      ]) : null,
      n("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        n("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Tag"),
          n("select", {
            key: "select",
            value: u.tagId ?? "",
            onChange: (p) => y({
              tagId: p.target.value === "" ? null : Number(p.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...b.map(([p, G]) => n("option", { key: p, value: p }, G))
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
            onChange: (p) => y({
              segmentGroupId: p.target.value === "" ? null : p.target.value === "ungrouped" ? "ungrouped" : Number(p.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All Segment groups"),
            ...f.map((p) => n("option", { key: p.id, value: p.id }, p.name)),
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
            onClick: () => y({ sourceKey: null }),
            "aria-pressed": u.sourceKey == null,
            className: A(u.sourceKey == null)
          }, "All provenance"),
          ...o.map((p) => n("button", {
            key: p,
            type: "button",
            onClick: () => y({ sourceKey: p }),
            "aria-pressed": u.sourceKey === p,
            title: p,
            className: A(u.sourceKey === p)
          }, Kt(p)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(fc, {
          minimum: u.confidenceMin,
          maximum: u.confidenceMax,
          onChange: ({ minimum: p, maximum: G }) => y({
            confidenceMin: p,
            confidenceMax: G
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
            onChange: (p) => y({
              includeUnscored: p.target.checked
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
          onChange: (p) => c(p.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]"
        }),
        n(ic, { key: "icon", hidden: t }),
        n("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    n("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(Lt({})), l && c(!1);
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
const Gi = "segment-studio-editor-history";
function hc({ history: e, historySaving: t, anchorRef: r, onRestore: o, onClose: i }) {
  const a = fe(null);
  return ye(() => {
    const s = (d) => {
      ld(d.target, a.current, r == null ? void 0 : r.current) && i();
    }, l = (d) => {
      var u, b, g;
      if (d.key !== "Escape" || d.defaultPrevented || document.querySelector("[role='dialog'], [aria-modal='true']")) return;
      const c = document.activeElement, m = c instanceof Element && (((u = a.current) == null ? void 0 : u.contains(c)) || ((b = r == null ? void 0 : r.current) == null ? void 0 : b.contains(c)));
      d.preventDefault(), i(), m && ((g = r == null ? void 0 : r.current) == null || g.focus({ preventScroll: !0 }));
    };
    return document.addEventListener("pointerdown", s), document.addEventListener("keydown", l), () => {
      document.removeEventListener("pointerdown", s), document.removeEventListener("keydown", l);
    };
  }, [r, i]), n("div", {
    ref: a,
    id: Gi,
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
function vc({ reviewMode: e, bindings: t, onClose: r }) {
  const o = nr.filter((l) => Tn(l, e)), i = ra(o, 1)[0], a = ra(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((m) => n("div", { key: m.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, m.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[m.id] ? t[m.id].length > 0 ? t[m.id] : ["Unassigned"] : m.bindings.map(ai)).map((u, b) => n("kbd", { key: `${m.id}:${b}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, u))
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
    onKeyDownCapture: (l) => Et(l, { onCancel: r })
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
function xc({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = Ed(e), [l, d] = K([]), c = s.map((m) => m.tagName).join("|");
  return ye(() => {
    const m = new Set(s.map((u) => u.tagName));
    d((u) => u.filter((b) => m.has(b)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (m) => Et(m, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: Wt,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", { key: "title", id: "segment-studio-examples-title", className: "text-lg font-semibold text-foreground" }, "AI Feedback"),
      n("p", { key: "description", className: "mt-1 text-sm text-secondary" }, `${e.length} registered-AI example${e.length === 1 ? "" : "s"} in this video. Expand a tag to inspect or restore examples before export.`)
    ]),
    n("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      n("div", { key: "items", className: "space-y-3" }, e.length ? s.map((m, u) => {
        const b = l.includes(m.tagName), g = `incorrect-example-tag-${u}`;
        return n("section", {
          key: m.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": b,
            "aria-controls": g,
            onClick: () => d((f) => b ? f.filter((y) => y !== m.tagName) : [...f, m.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: Ar(!1) }
          }, [
            n(
              "span",
              { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" },
              b ? "▾" : "▸"
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
          b ? n("div", {
            key: "examples",
            id: g,
            className: "divide-y divide-border border-t border-border"
          }, m.examples.map((f) => {
            const y = `${Re(f.startSec)}${f.endSec == null ? "" : ` – ${Re(f.endSec)}`}`, w = r === f.id;
            return n("div", {
              key: f.id,
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
                onClick: () => i(f),
                "aria-label": `${w ? "Restoring" : "Restore to review"} ${m.tagName} example at ${y}`,
                className: "rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
              }, w ? "Restoring…" : "Restore to review")
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
function Sc({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = K(""), [a, s] = K(0), l = fe(null), d = We(() => zl(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), m = ql(d);
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
      var g;
      if (b.key === "Tab")
        Wt(b);
      else if (b.key === "Escape")
        b.preventDefault(), b.stopPropagation(), r();
      else if (b.key === "ArrowDown" || b.key === "ArrowUp") {
        b.preventDefault(), b.stopPropagation();
        const f = b.key === "ArrowDown" ? 1 : -1;
        s((y) => d.length ? (y + f + d.length) % d.length : 0);
      } else b.key === "Enter" && !((g = b.nativeEvent) != null && g.isComposing) && (b.preventDefault(), b.stopPropagation(), u());
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
    }, d.length ? d.flatMap((b, g) => {
      var q;
      const f = b.segment || b, y = f.endSec == null ? Re(f.startSec) : `${Re(f.startSec)} – ${Re(f.endSec)}`, w = `${Kt(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`, A = g === c, p = g > 0 ? d[g - 1].groupKey : null, G = m && b.groupKey !== p ? n("div", {
        key: `group:${b.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, b.groupName) : null, P = n("button", {
        key: f.id,
        id: `segment-quick-search-${f.id}`,
        ref: A ? l : null,
        type: "button",
        role: "option",
        "aria-selected": A,
        onMouseEnter: () => s(g),
        onClick: () => t(f),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${A ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        m ? n("span", { key: "group", className: "sr-only" }, `${b.groupName} group`) : null,
        n(un, { key: "review", state: f.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          f.tagName || "Tag segment"
        ),
        (q = b.performers) != null && q.length ? n(Mr, {
          key: "performers",
          performers: b.performers,
          performerAssignments: b.performerAssignments
        }) : null,
        n(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          y
        ),
        n("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: w
        }, w)
      ]);
      return G ? [G, P] : [P];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function kc(e) {
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
function wc({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = We(() => kc(e), [e]), [l, d] = K([]), c = s.reduce((g, f) => g + f.drafts.length, 0), m = fe(null);
  bo({ confirmRef: m, cancelRef: o, confirmReady: !t && c > 0 });
  const u = (g) => d((f) => f.includes(g) ? f.filter((y) => y !== g) : [...f, g]), b = (g) => `segment-studio-publish-approved-${g.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && a();
    },
    onKeyDownCapture: (g) => Et(g, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: Wt,
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
            "aria-controls": b(g),
            onClick: () => u(g.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: Ar(!1) }
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
            id: b(g),
            className: "divide-y divide-border border-t border-border"
          }, g.drafts.map((y) => {
            const w = y.endSec == null ? Re(y.startSec) : `${Re(y.startSec)} – ${Re(y.endSec)}`, A = `${Kt(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`;
            return n("div", { key: y.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(un, { key: "review", state: y.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, w),
              n("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: A
              }, A)
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
function Nc({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = Kl(e), [s, l] = K(() => /* @__PURE__ */ new Set()), [d, c] = K(() => new Set(a.map((y) => y.key))), m = a.flatMap((y) => d.has(y.key) ? y.candidates : []), u = (y) => l((w) => {
    const A = new Set(w);
    return A.has(y) ? A.delete(y) : A.add(y), A;
  }), b = (y) => c((w) => {
    const A = new Set(w);
    return A.has(y) ? A.delete(y) : A.add(y), A;
  }), g = (y) => y.assignment.map(({ slot: w, performer: A }) => `${w.label || `Slot ${w.sortOrder + 1}`}: ${A.name}`).join(", "), f = (y) => `segment-studio-auto-assign-${y.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (y) => {
      y.target === y.currentTarget && !t && i();
    },
    onKeyDownCapture: (y) => {
      y.key === "Enter" && y.target instanceof HTMLInputElement || Et(y, {
        onCancel: t ? void 0 : i,
        onConfirm: m.length && !t ? () => o(m) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: Wt,
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
          style: { background: Ar(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(y.key),
            disabled: t,
            onChange: () => b(y.key),
            "aria-label": `Include ${y.tagName} assignment: ${g(y)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(y.key),
            "aria-controls": f(y),
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
            y.assignment.map(({ slot: w, performer: A }) => {
              const p = w.label || `Slot ${w.sortOrder + 1}`;
              return n("span", {
                key: w.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${p}: ${A.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${p}: ${A.name}`
                }, `${p}: ${A.name}`),
                n(tr, {
                  key: "avatar",
                  performer: { id: A.performerId, name: A.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(nn, { key: "states", counts: y.counts }),
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
          { key: "segments", id: f(y), className: "divide-y divide-border/70" },
          y.candidates.map((w) => {
            const A = w.endSec == null ? Re(w.startSec) : `${Re(w.startSec)} – ${Re(w.endSec)}`, p = `${Kt(w.sourceKey)}${w.confidence == null ? "" : ` · ${Math.round(w.confidence * 100)}%`}`;
            return n("div", {
              key: w.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(un, { key: "review", state: w.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                w.tagName || "Tag segment"
              ),
              n(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                A
              ),
              n("span", {
                key: "provenance",
                className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                title: p
              }, p)
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
function Ic({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => Et(d, { onCancel: r, onConfirm: t })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: Wt,
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
function Cc({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = K(!1), d = fe(null);
  if (bo({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Re(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && a();
    },
    onKeyDownCapture: (m) => Et(m, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: Wt,
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
function $c(e) {
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
function Tc({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var u, b;
  const l = e ? e.createCount + e.linkCount : 0, d = fe(null);
  bo({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((u = e == null ? void 0 : e.outputs) == null ? void 0 : u.slice(0, 200)) || [], m = $c(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !r && s();
    },
    onKeyDownCapture: (g) => Et(g, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: Wt,
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
              g.outputs.map((f, y) => n("div", {
                key: `${f.ruleId}:${f.depth}:${y}`,
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
function Ac({
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
  performerSlots: b,
  detail: g,
  video: f,
  slotButtonRef: y,
  tagSearchRef: w,
  onDetailChange: A,
  setSaveMessage: p,
  acquireSaveLock: G,
  onSlotsChanged: P,
  onRecordHistory: q,
  onCancelQueuedReview: W,
  splitSegment: E,
  duplicateSegment: T,
  provenance: S,
  lineage: k,
  onNavigateLineageItem: R,
  tagEditing: z,
  onCancelTagEditing: L,
  detailPanelRef: C,
  onReduceSelection: O
}) {
  var Se, te, ve, ne;
  const H = fe(null), X = fe(null), me = () => {
    var V;
    (V = X.current) == null || V.call(X), X.current = null;
  }, he = fe(null), ce = fe(null), M = fe(null), re = fe(null), [de, Q] = K(!1);
  ye(() => {
    H.current && (H.current.scrollTop = 0), Q(!1);
  }, [t == null ? void 0 : t.id]), ye(() => {
    var V, be;
    de && ((be = (V = he.current) == null ? void 0 : V.querySelector("input, select, button")) == null || be.focus({ preventScroll: !0 }));
  }, [de]);
  function ue() {
    Q(!1), requestAnimationFrame(() => {
      var V;
      return (V = y.current) == null ? void 0 : V.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const V = !r.some((ee) => ee.isDerived), be = e && m ? md(b, r) : null, I = (be == null ? void 0 : be.map((ee, $) => {
      var h;
      const v = r[$];
      return {
        segmentId: v.nativeSegmentId,
        itemId: v.published ? null : v.itemId,
        revision: (h = g.performerSlotRevisions) == null ? void 0 : h[v.id],
        slots: ee
      };
    })) || [];
    return n(lo.Fragment, null, [
      n(lc, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: C,
        onReduceSelection: O,
        reviewable: e,
        tagEditable: V,
        slotsEditable: I.length > 0 && a == null,
        onEditSlots: () => Q(!0),
        slotButtonRef: y,
        saveMessage: i
      }),
      z && V ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ee) => {
          ee.target === ee.currentTarget && L();
        },
        onKeyDownCapture: (ee) => Et(ee, { onCancel: L })
      }, n("section", {
        ref: w,
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
        n(Zn, {
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
      de && I.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ee) => {
          ee.target === ee.currentTarget && ue();
        },
        onKeyDownCapture: (ee) => {
          var v, h;
          if (!(typeof ((v = ee.target) == null ? void 0 : v.closest) == "function" ? ee.target.closest("input, textarea, select, [contenteditable='true']") : null) && !ee.repeat && !ee.ctrlKey && !ee.altKey && !ee.metaKey && !ee.shiftKey && /^[1-9]$/.test(ee.key) && ((h = re.current) != null && h.call(re, Number(ee.key) - 1))) {
            ee.preventDefault(), ee.stopPropagation();
            return;
          }
          Et(ee, { onCancel: ue });
        }
      }, n("section", {
        ref: he,
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
          n("button", { key: "close", type: "button", onClick: ue, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(oc, {
          videoId: f.id,
          targets: I,
          performerCandidates: g.performerCandidates || [],
          shortcutRef: re,
          acquireSaveLock: () => G("slots", -1),
          onSaved: async ({ beforeState: ee, afterState: $ }) => {
            await q(
              "performer-slots.assign",
              `Assigned performers to ${I.length} segments`,
              ee,
              $
            ), ue(), await P();
          },
          onConflict: P
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (V) => {
      H.current = V, C && (C.current = V);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(un, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(Er, { key: "derived" }) : null,
        t && z ? n("div", {
          key: "tag-editor",
          ref: w,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (V) => {
            V.key === "Escape" && (V.preventDefault(), V.stopPropagation(), L());
          },
          onKeyDown: (V) => {
            dd(V, t.tagName) && (V.preventDefault(), V.stopPropagation(), l(t.tagId));
          }
        }, n(Zn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (V, be) => V == null ? L() : l(V, be == null ? void 0 : be.label),
          disabled: Nl(a, t.id, s) || ((Se = k.data) == null ? void 0 : Se.tagReadOnly) === !0,
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
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(nc, { status: c })) : null,
      t && m && u.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(Ci, {
        assignments: u.map((V) => {
          const be = yd(V);
          return {
            key: String(V.slotDefinitionId),
            label: be.label,
            performer: be.filled ? { id: Number(V.performerId), name: be.performer } : null,
            title: be.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(sc, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: S
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
          (te = k.data.parents) != null && te.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...k.data.parents.map((V) => n("button", {
              key: V.nodeId,
              type: "button",
              onClick: () => R(V.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${V.ruleKey} ${V.ruleVersion}`))
          ]) : null,
          (ve = k.data.children) != null && ve.length ? n("p", { key: "children" }, `Children: ${k.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: y,
          type: "button",
          disabled: a != null || !m || u.length === 0,
          onClick: () => Q(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: m ? u.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, u.length === 0 ? "No performer slots" : "Edit performer slots") : null,
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
    de && e && t && m && u.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (V) => {
        V.target === V.currentTarget && ue();
      },
      onKeyDownCapture: (V) => {
        var I, ee;
        if (!(typeof ((I = V.target) == null ? void 0 : I.closest) == "function" ? V.target.closest("input, textarea, select, [contenteditable='true']") : null) && !V.repeat && !V.ctrlKey && !V.altKey && !V.metaKey && !V.shiftKey && /^[1-9]$/.test(V.key) && ((ee = M.current) != null && ee.call(M, Number(V.key) - 1))) {
          V.preventDefault(), V.stopPropagation();
          return;
        }
        Et(V, {
          onCancel: ue,
          onConfirm: () => {
            var $;
            return ($ = ce.current) == null ? void 0 : $.click();
          }
        });
      }
    }, n("section", {
      ref: he,
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
        n("button", { key: "close", type: "button", onClick: ue, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(rc, {
        key: `${t.id}:${g.performerSlotsRevision || g.slotRevision || ""}`,
        videoId: f.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: u,
        revision: (ne = g.performerSlotRevisions) == null ? void 0 : ne[t.id],
        performerCandidates: g.performerCandidates || [],
        confirmRef: ce,
        shortcutRef: M,
        onOptimisticSave: (V) => {
          const be = G("slots", t.id);
          if (!be)
            return p("Wait for the current save to finish before saving performer slots."), !1;
          X.current = be, A((I) => en(
            I,
            t.id,
            V
          ), f.id), p("Saving performer slots…"), ue();
        },
        onSaved: async (V, { beforeState: be, afterState: I }) => {
          A((ee) => en(
            ee,
            t.id,
            V.slots || [],
            V.revision
          ), f.id), p("Performer slots saved.");
          try {
            await q(
              "performer-slots.assign",
              "Assigned performers",
              be,
              I
            ), await P(V) || W([t]);
          } finally {
            me();
          }
        },
        onRollback: async (V, be) => {
          W([t]), A((I) => {
            var ee;
            return en(
              I,
              t.id,
              V,
              (ee = g.performerSlotRevisions) == null ? void 0 : ee[t.id]
            );
          }, f.id), p(be.message || "Unable to save performer slots.");
          try {
            be.status === 409 && await P();
          } finally {
            me();
          }
        },
        onConflict: P
      }))
    ])) : null
  ]);
}
function Rc({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: m, onZoomChange: u, onSelectGroup: b, onToggleGroup: g, onSelect: f, onSelectSegments: y, onSelectAll: w, onConfigureTag: A, onSeekTime: p, centerRef: G, showReviewState: P = !0, swimlaneTitleWidth: q, onSwimlaneTitleWidthChange: W }) {
  const E = fe(null), T = fe(null), [S, k] = K(0), [R, z] = K({ scrollTop: 0, height: 320 }), [L, C] = K(null), O = We(
    () => dn(e, r, o),
    [e, r, o]
  ), H = We(
    () => ki(o),
    [o]
  ), X = We(() => xo(O), [O]), me = We(
    () => Sd(X, i, wi(X)),
    [X, i]
  ), he = We(
    () => Ni(me.rows, Math.max(0, R.scrollTop - 24), R.height),
    [me, R]
  ), ce = Math.max(0, Number(d) || 0), M = _s(S), re = xr(q, M), de = re / 16, Q = Hs(c, ce, de), ue = Bs(ce), Se = Gs(ce, Math.max(1, S - de * 16), m), te = ue.filter((h, x) => x === 0 || x % Se === 0), ve = We(() => O.map((h) => `${h.key}:${h.trackCount}:${h.markers.map(({ segment: x, track: D }) => `${x.id}:${x.startSec}:${x.endSec ?? ""}:${D}`).join(",")}`).join("|"), [O]);
  function ne() {
    const h = T.current;
    if (!h) return;
    const x = h.querySelector("[data-timeline-track]"), D = h.firstElementChild, ae = x == null ? void 0 : x.getBoundingClientRect(), oe = D == null ? void 0 : D.getBoundingClientRect(), U = ae && oe ? Math.max(0, ae.left - oe.left) : de * 16, ie = (oe == null ? void 0 : oe.width) ?? h.scrollWidth;
    h.scrollTo({
      left: zs(c, ce, ie, h.clientWidth, U, Qa),
      behavior: "smooth"
    });
  }
  ye(() => (G.current = ne, () => {
    G.current === ne && (G.current = null);
  })), ye(() => {
    ne();
  }, [m]);
  function V() {
    const h = T.current, x = me.rows.find((ie) => ie.kind === "lane" && ie.lane.markers.some(({ segment: N }) => N.id === s));
    if (!h || !x) return;
    const D = 24, ae = x.top + D, oe = ae + x.height;
    let U = h.scrollTop;
    ae < h.scrollTop + D ? U = Math.max(0, ae - D) : oe > h.scrollTop + h.clientHeight && (U = Math.max(0, oe - h.clientHeight)), U !== h.scrollTop && (h.scrollTop = U), z({ scrollTop: U, height: h.clientHeight });
  }
  ye(() => {
    V();
  }, [s, ve, me]), ye(() => {
    const h = T.current, x = me.rows.find((ie) => ie.kind === "group" && ie.group.key === a);
    if (!h || !x) return;
    const D = 24, ae = x.top + D, oe = ae + x.height;
    let U = h.scrollTop;
    ae < h.scrollTop + D ? U = Math.max(0, ae - D) : oe > h.scrollTop + h.clientHeight && (U = Math.max(0, oe - h.clientHeight)), U !== h.scrollTop && (h.scrollTop = U), z({ scrollTop: U, height: h.clientHeight });
  }, [a, me]), ye(() => {
    const h = T.current;
    if (!h || typeof ResizeObserver > "u") return;
    const x = () => {
      k(h.clientWidth), z({ scrollTop: h.scrollTop, height: h.clientHeight }), V();
    }, D = new ResizeObserver(x);
    return D.observe(h), x(), () => D.disconnect();
  }, [s, ve, me]);
  function be(h) {
    if (!(ce > 0)) return;
    const x = h.currentTarget.getBoundingClientRect(), D = Math.min(1, Math.max(0, (h.clientX - x.left) / x.width));
    p(D * ce);
  }
  function I(h) {
    const x = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let D = null;
    Object.hasOwn(x, h.key) && (D = c + x[h.key]), h.key === "Home" && (D = 0), h.key === "End" && (D = ce), D != null && (h.preventDefault(), h.stopPropagation(), p(Math.min(ce, Math.max(0, D))));
  }
  function ee(h) {
    var D;
    const x = (D = E.current) == null ? void 0 : D.getBoundingClientRect();
    x && W(xr(h.clientX - x.left, M));
  }
  function $(h) {
    const x = h.shiftKey ? 40 : 16;
    let D = null;
    h.key === "ArrowLeft" && (D = re - x), h.key === "ArrowRight" && (D = re + x), h.key === "Home" && (D = 160), h.key === "End" && (D = M), D != null && (h.preventDefault(), h.stopPropagation(), W(xr(D, M)));
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
        onClick: (h) => {
          (h.metaKey || h.ctrlKey) && (h.preventDefault(), w == null || w());
        },
        onKeyDown: (h) => {
          h.key !== "Enter" && h.key !== " " || (h.preventDefault(), w == null || w());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: v, disabled: m <= 1, onClick: () => u(Cr(m - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: v, disabled: m === 1, onClick: () => u(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(m * 100)}%`),
      n("button", { key: "in", type: "button", className: v, disabled: m >= 8, onClick: () => u(Cr(m + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: v, onClick: ne, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(M),
      "aria-valuenow": Math.round(re),
      "aria-valuetext": `${Math.round(re)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (h) => {
        h.currentTarget.setPointerCapture(h.pointerId), ee(h);
      },
      onPointerMove: (h) => {
        h.currentTarget.hasPointerCapture(h.pointerId) && ee(h);
      },
      onKeyDown: $,
      onDoubleClick: () => W(Mt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${re - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: T,
      onScroll: (h) => z({
        scrollTop: h.currentTarget.scrollTop,
        height: h.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: qs(m) }, [
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
          "aria-valuemax": ce,
          "aria-valuenow": Math.min(ce, Math.max(0, c)),
          "aria-valuetext": Re(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: be,
          onKeyDown: I
        }, te.map((h, x) => n("span", {
          key: h,
          className: `absolute top-0 ${Us(x, te.length, ce > 0 ? h / ce * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Ks(x, te.length, ce > 0 ? h / ce * 100 : 0)
        }, Re(h))).concat(t.map((h) => {
          const x = ce > 0 ? h.startSec / ce * 100 : 0;
          return n("button", {
            key: `shot-boundary:${h.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Re(h.startSec)} – ${Re(h.endSec)}`,
            title: `Shot boundary · ${h.source || "manual"} · ${Re(h.startSec)} – ${Re(h.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${x}%`, width: "2px" },
            onClick: (D) => {
              D.stopPropagation(), p(h.startSec);
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
            ...Qo(Q),
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
        style: O.length > 0 ? { height: me.height } : void 0
      }, [
        O.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...Qo(Q, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        O.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : he.map((h) => {
          var _;
          const x = h.group, D = i.includes(x.key), ae = a === x.key, oe = Ar(ae);
          if (h.kind === "group") return n("div", {
            key: h.key,
            "data-segment-group": x.key,
            "data-segment-group-collapsed": D ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${de}rem minmax(0,1fr)`,
              backgroundColor: oe,
              top: h.top,
              height: h.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (j) => {
                if (j.metaKey || j.ctrlKey) {
                  y(x.lanes.flatMap((Z) => Z.markers.map((xe) => xe.segment.id)));
                  return;
                }
                b(x.key), g(x.key);
              },
              "aria-expanded": !D,
              "aria-current": ae ? "true" : void 0,
              "data-selected-timeline-group": ae ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: x.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: oe
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
                P ? n(nn, { key: "states", counts: x.counts }) : null
              ] : null
            )
          ]);
          const U = h.lane, ie = rd(h.laneIndex), N = U.markers.some(({ segment: j }) => j.id === s);
          return n("div", {
            key: h.key,
            "data-grouped-swimlane": x.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${de}rem minmax(0,1fr)`,
              top: h.top,
              height: h.height,
              backgroundColor: ie
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": N ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: od(N, ie),
              title: `${er(U)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": er(U),
              onClick: (j) => {
                (j.metaKey || j.ctrlKey) && y(U.markers.map((Z) => Z.segment.id));
              },
              onMouseEnter: () => C(U.key),
              onMouseLeave: () => C((j) => j === U.key ? null : j)
            }, [
              U.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (j) => {
                  j.stopPropagation(), A({ tagId: U.tagId, tagName: U.label, trigger: j.currentTarget });
                },
                "aria-label": `Configure ${U.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: L === U.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, U.label),
              (_ = U.performers) != null && _.length ? n(Mr, {
                key: "performers",
                performers: U.performers,
                performerAssignments: U.performerAssignments
              }) : null,
              P ? n(nn, { key: "counts", counts: U.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, U.markers.map(({ segment: j, track: Z }) => {
              var lt;
              const xe = Xr(j.startSec, ce), pe = j.endSec == null ? j.startSec : Math.max(j.startSec, j.endSec), Te = Math.max(0, Xr(pe, ce) - xe), yt = l.includes(j.id), Fe = j.id === s, Me = vo(H.get(j.id)), Ye = j.endSec == null ? Re(j.startSec) : `${Re(j.startSec)} – ${Re(j.endSec)}`, st = (lt = xi[Me]) == null ? void 0 : lt.label;
              return n("button", {
                key: j.id,
                type: "button",
                onClick: (Ze) => {
                  Ze.stopPropagation(), f(j, {
                    additive: Ze.metaKey || Ze.ctrlKey,
                    rangeSegmentIds: Ze.shiftKey ? U.markers.map((mt) => mt.segment.id) : null
                  });
                },
                "aria-pressed": yt,
                "aria-current": Fe ? "true" : void 0,
                "data-selected-timeline-marker": Fe ? "true" : void 0,
                "data-selected-segment-shortcut-target": Fe ? "true" : void 0,
                "aria-label": P ? `${j.tagName || "Tag segment"}${U.performerLabel ? `, ${U.performerLabel}` : ""}, ${j.reviewState}${st ? `, ${st}` : ""}, ${Ye}` : `${j.tagName || "Tag segment"}${U.performerLabel ? `, ${U.performerLabel}` : ""}, ${Ye}`,
                title: P ? `${j.tagName || "Tag segment"}${U.performerLabel ? ` · ${U.performerLabel}` : ""} · ${j.reviewState}${st ? ` · ${st}` : ""} · ${Ye}` : `${j.tagName || "Tag segment"}${U.performerLabel ? ` · ${U.performerLabel}` : ""} · ${Ye}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...P ? ed(j.reviewState, yt, Me, Fe) : td(yt, Fe),
                  left: `${xe}%`,
                  top: `${ad(Z)}rem`,
                  width: nd(j.endSec, Te),
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
function wo({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = K(null), [l, d] = K([]), [c, m] = K(null), [u, b] = K(""), [g, f] = K(!0), [y, w] = K(null), [A, p] = K(""), [G, P] = K(!1), q = fe(null), W = fe(0);
  ye(() => {
    const L = requestAnimationFrame(() => {
      var C;
      return (C = q.current) == null ? void 0 : C.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(L);
  }, [e]), ye(() => {
    const L = new AbortController();
    return f(!0), p(""), Promise.all([
      r ? Y(`/slot-definitions/${e}`, { signal: L.signal }) : Promise.resolve(null),
      Y("/segment-groups", { signal: L.signal })
    ]).then(([C, O]) => {
      const H = O.find((X) => (X.tags || []).some((me) => Number(me.tagId) === Number(e)));
      s(C), d(O), m((H == null ? void 0 : H.id) ?? null), b(H == null ? "" : String(H.id)), P(!1);
    }).catch((C) => {
      C.name !== "AbortError" && p(C.message || "Unable to load tag configuration.");
    }).finally(() => {
      L.signal.aborted || f(!1);
    }), () => L.abort();
  }, [r, e]);
  function E(L, C) {
    s({
      ...a,
      definitions: a.definitions.map((O, H) => H === L ? { ...O, ...C } : O)
    });
  }
  function T(L, C) {
    const O = L + C;
    if (O < 0 || O >= a.definitions.length) return;
    const H = [...a.definitions];
    [H[L], H[O]] = [H[O], H[L]], s({
      ...a,
      definitions: H.map((X, me) => ({ ...X, sortOrder: me }))
    });
  }
  function S(L) {
    const C = a.definitions[L], O = Number(C.assignmentCount) || 0, H = O === 0 ? "" : ` and its ${O} assignment${O === 1 ? "" : "s"}`;
    window.confirm(`Delete “${Ct(C)}”${H}?`) && (O > 0 && P(!0), s({
      ...a,
      definitions: a.definitions.filter((X, me) => me !== L).map((X, me) => ({ ...X, sortOrder: me }))
    }));
  }
  async function k() {
    var C;
    w("slots"), p("Saving performer slots…");
    let L;
    try {
      L = await Y(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: G,
          definitions: a.definitions.map((O, H) => {
            var X;
            return {
              id: O.id || void 0,
              label: ((X = O.label) == null ? void 0 : X.trim()) || null,
              sortOrder: H,
              genderHints: O.genderHints || []
            };
          })
        })
      }), s(L), P(!1);
    } catch (O) {
      O.status === 409 ? (p("Performer slots changed elsewhere; current values were reloaded."), (C = O.payload) != null && C.current && (s(O.payload.current), P(!1))) : p(O.message || "Unable to save performer slots."), w(null);
      return;
    }
    try {
      await o(), p("Performer slots saved.");
    } catch {
      p("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      w(null);
    }
  }
  async function R() {
    const L = u === "" ? null : Number(u);
    if (L !== c) {
      w("group"), p("Saving tag group…");
      try {
        await Y(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: L })
        });
      } catch (C) {
        p(C.message || "Unable to assign the tag group."), w(null);
        return;
      }
      try {
        const [C, O] = await Promise.allSettled([
          Y("/segment-groups"),
          o()
        ]);
        if (C.status === "fulfilled") {
          d(C.value);
          const H = C.value.find((me) => (me.tags || []).some((he) => Number(he.tagId) === Number(e))), X = (H == null ? void 0 : H.id) ?? null;
          m(X), b(X == null ? "" : String(X));
        }
        p(
          C.status === "fulfilled" && O.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        w(null);
      }
    }
  }
  l.find((L) => Number(L.id) === Number(c));
  const z = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (L) => {
      L.target === L.currentTarget && !y && i();
    },
    onKeyDownCapture: (L) => Et(L, {
      onCancel: y ? void 0 : i
    })
  }, n("section", {
    ref: q,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: Wt,
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
            onChange: (L) => b(L.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((L) => n("option", { key: L.id, value: String(L.id) }, L.name))
          ])
        ]),
        g ? null : n("button", {
          key: "save",
          type: "button",
          disabled: y != null || (u === "" ? null : Number(u)) === c,
          onClick: R,
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
              onChange: (L) => s({ ...a, allowSamePerformerInMultipleSlots: L.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((L, C) => n("article", {
            key: L.id || L._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: L.label || "",
                disabled: y != null,
                onChange: (O) => E(C, { label: O.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Ps.map((O) => n("label", { key: O, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: y != null,
                  checked: (L.genderHints || []).includes(O),
                  onChange: (H) => E(C, {
                    genderHints: H.target.checked ? [.../* @__PURE__ */ new Set([...L.genderHints || [], O])] : (L.genderHints || []).filter((X) => X !== O)
                  })
                }),
                n("span", { key: "text" }, Rr(O))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${L.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: y != null || C === 0, onClick: () => T(C, -1), className: z, "aria-label": `Move ${Ct(L)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: y != null || C === a.definitions.length - 1, onClick: () => T(C, 1), className: z, "aria-label": `Move ${Ct(L)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: y != null, onClick: () => S(C), className: `${z} text-red-300` }, "Delete")
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
              className: z
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: y != null,
              onClick: k,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, y === "slots" ? "Saving…" : "Save performer slots")
          ])
        ]) : null
      ]) : null,
      A ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, A) : null
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
function Mc(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function Ec(e) {
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, analysisError: i, analysisRun: a, analysisStatus: s, approvalFacetCounts: l, autoAssignCandidates: d, autoAssignError: c, autoAssignOpen: m, autoAssignPerformers: u, autoAssigning: b, cancelQueuedReviewsForSegments: g, canMoveSelectionToBin: f, captureTrainingExport: y, centerTimelineRef: w, closeEditorFilters: A, closeFirstSegmentTagDialog: p, closeMaterializeDialog: G, closeMergeConfirmation: P, closePublishApprovedDialog: q, closeTagEditing: W, collapsedSegmentGroups: E, commonActionsRef: T, compatibilityMode: S, configuringTag: k, createSegment: R, creatingSegmentId: z, currentTime: L, deleteRejectedSegments: C, detail: O, detailPanelRef: H, detailWidth: X, duplicateSegment: me, editorFilters: he, editorLayout: ce, editorRef: M, exportingExamples: re, filtersButtonRef: de, filtersOpen: Q, firstSegmentTagOpen: ue, focusRowRef: Se, handleSeparatorKeyDown: te, handleSeparatorPointerDown: ve, handleSeparatorPointerMove: ne, hasNextUnreviewed: V, hasPreviousUnreviewed: be, hideDerivedSegments: I, history: ee, historyOpen: $, historySaving: v, horizontalLayoutSize: h, importNativeSegments: x, incorrectExamples: D, incorrectExamplesOpen: ae, lineage: oe, markerRailWidth: U, materializeButtonRef: ie, materializeCancelButtonRef: N, materializeDerivedSegments: _, materializeError: j, materializeLoading: Z, materializeOpen: xe, materializePreview: pe, materializing: Te, mediaStackRef: yt, mergeCancelButtonRef: Fe, mergeConfirmation: Me, mergeSaving: Ye, mergeSelectedSwimlane: st, nativeImportState: lt, onDetailChange: Ze, onNavigate: mt, onReload: gt, onSlotsChanged: Ue, openPublishApprovedDialog: Je, panelSeparatorProps: Ve, pendingInitialSeekRef: ze, performerSlots: dt, performerSlotsAvailable: ht, playbackControlsRef: J, previewDerivedSegments: le, provenance: Ne, provenanceSources: Ae, publishApprovedCancelButtonRef: ke, publishApprovedDrafts: Xe, publishApprovedError: je, publishApprovedOpen: Qe, quickSearchOpen: Ie, railScrollRef: Oe, railToggleRef: He, recordHistoryAction: Ee, rejectedDeletionPreview: Le, removeIncorrectExample: et, removingExampleId: we, restoreHistoryTarget: Pe, runEditorAction: De, saveMessage: Dt, saveTag: rt, saveTiming: pt, savingSegmentId: vt, seekRef: at, segmentGroups: Ce, segmentRailLayout: $e, segments: Ke, selectAllVideoSegments: kt, selectSegment: ot, selectSegmentCollection: Zt, selectedGroups: $t, selectedPerformerSlots: Ft, selectedSegment: Ot, selectedSegmentGroupKey: on, selectedSegmentIds: mn, selectedSegments: an, selectedSlotStatus: Dr, setAutoAssignError: Mn, setAutoAssignOpen: En, setConfiguringTag: gn, setCurrentTime: sn, setEditorFilters: pn, setEditorLayout: or, setFiltersOpen: Or, setHideDerivedSegments: ar, setHistoryOpen: Dn, setIncorrectExamplesOpen: fn, setQuickSearchOpen: yn, setRailViewport: ir, setRejectedDeletionPreview: bn, setSaveMessage: Pr, setSelectedSegmentGroupKey: On, setSelectedSegmentId: Pn, setShortcutsOpen: Xt, setTimelineZoom: Ln, shotBoundaries: Fn, shortcutsOpen: wt, slotButtonRef: sr, splitLayout: jt, splitSegment: lr, startFullAnalysis: jn, stepVideoFrame: hn, tagEditing: Bn, tagSearchRef: Lr, timelineDuration: Fr, timelineRatioBounds: vn, timelineZoom: Gn, toggleSegmentGroup: xn, toggleSegmentRail: nt, updateTimelineRatio: xt, video: bt, videoPerformers: dr, visibleCounts: zt, visibleSegmentRailRows: Tt, visibleSegments: cr, wideLayout: Vt, workspaceRef: Un } = e, Sn = We(
    () => Ke.filter((B) => !B.published && B.reviewState === "approved"),
    [Ke]
  ), Kn = Ms(co), zn = Sn.length, Hn = fe(null), jr = We(() => () => Dn(!1), [Dn]), qn = pe ? pe.createCount + pe.linkCount : null, St = vt != null, At = an.length > 0, _n = an.length === 1, Br = At && an.every((B) => B.reviewState === "approved"), Gr = At && an.every((B) => B.reviewState === "rejected"), Ur = [
    { id: "marker.create", label: "New segment", disabled: St },
    { id: "marker.editTag", label: "Edit tag", disabled: St || !At },
    { id: "marker.setStart", label: "Set start", disabled: St || !_n },
    { id: "marker.setEnd", label: "Set end", disabled: St || !_n },
    { id: "marker.split", label: "Split", disabled: St || !_n },
    ...S ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !be, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Br ? "Unapprove" : "Approve", disabled: St || !At, tone: "approve" },
      { id: "marker.reject", label: Gr ? "Unreject" : "Reject", disabled: St || !At, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !V, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...S ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: St || !f, tone: "reject" }
    ]
  ];
  function Kr(B) {
    const Be = mn.includes(B.id), ge = B.id === (Ot == null ? void 0 : Ot.id), it = B.endSec == null ? Re(B.startSec) : `${Re(B.startSec)} – ${Re(B.endSec)}`, Jt = `${Kt(B.sourceKey)}${B.confidence != null ? ` · ${Math.round(B.confidence * 100)}%` : ""}`;
    return n("button", {
      key: B.id,
      type: "button",
      onClick: (qt) => ot(B, { additive: qt.metaKey || qt.ctrlKey }),
      "aria-pressed": Be,
      "aria-current": ge ? "true" : void 0,
      "data-selected-segment-shortcut-target": ge ? "true" : void 0,
      "aria-label": S ? `${B.tagName || "Tag segment"}, ${B.reviewState}${B.isDerived ? ", derived segment" : ""}, ${it}` : `${B.tagName || "Tag segment"}${B.isDerived ? ", derived segment" : ""}, ${it}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: vi(Be, ge)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        S ? n(un, { key: "review", state: B.reviewState, includeLabel: !1 }) : null,
        B.isDerived ? n(Er, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          B.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, it),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: Jt
        }, Jt)
      ])
    ]);
  }
  const ft = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", Ht = [...ee.actions || []].reverse().find((B) => B.sequence <= ee.cursorSequence);
  return n("section", {
    ref: M,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${jt ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "relative flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (B) => Pi(B, mt, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${bt.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: bt.title || `Video ${bt.id}`
          }, bt.title || `Video ${bt.id}`)),
          ...dr.map((B) => n(tr, {
            key: ut(B),
            performer: { id: ut(B), name: B.name },
            compact: !0,
            tooltip: B.name
          })),
          S ? n(nn, { key: "review-counts", counts: zt }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          S ? null : n(ji, { key: "bin", onNavigate: mt, compact: !0 }),
          n(Bi, { key: "settings", onNavigate: mt, compact: !0 })
        ])
      ]),
      S && O.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${O.nativeImportCount} Cove segment${O.nativeImportCount === 1 ? "" : "s"} ${O.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        lt.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, lt.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
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
        lt.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, lt.error) : null
      ]) : null,
      i && (s == null ? void 0 : s.configured) !== !1 ? n("div", {
        key: "analysis-error",
        role: "alert",
        className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300"
      }, i) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          S ? n("div", {
            key: "full-analysis",
            className: "inline-flex items-stretch"
          }, [
            n("button", {
              key: "run",
              type: "button",
              disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
              onClick: () => jn(),
              title: (s == null ? void 0 : s.error) || "Run AI tagging and shot boundary analysis into the Full review workflow",
              className: "segment-studio-full-scan-run inline-flex items-center justify-center bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
            }, (s == null ? void 0 : s.configured) === !1 ? "Full Scan not configured" : (s == null ? void 0 : s.ready) === !1 ? "Full Scan unavailable" : (a == null ? void 0 : a.status) === "queued" ? "Full Scan queued…" : (a == null ? void 0 : a.status) === "running" ? "Full Scan running…" : "Full Scan"),
            n("details", { key: "choices", className: "relative flex" }, [
              n("summary", {
                key: "summary",
                "aria-label": "Choose Full Scan analyses",
                "aria-disabled": (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
                title: "Choose analyses",
                onClick: (B) => {
                  ((s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running") && B.preventDefault();
                },
                onKeyDown: (B) => {
                  (B.key === "Enter" || B.key === " ") && ((s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running") && B.preventDefault();
                },
                className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${(s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running" ? "pointer-events-none cursor-default opacity-50" : "cursor-pointer hover:opacity-90"}`
              }, n(Ha, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([B, Be]) => n("button", {
                key: B,
                type: "button",
                disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
                onClick: (ge) => {
                  var it;
                  (it = ge.currentTarget.closest("details")) == null || it.removeAttribute("open"), jn(Be);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, B)))
            ])
          ]) : null,
          S ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: vt != null || d.length === 0,
            onClick: () => {
              Mn(""), En(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${d.length ? ` (${d.length})` : ""}`) : null,
          S ? n("button", {
            key: "materialize-derived",
            ref: ie,
            type: "button",
            disabled: vt != null || Z || Te || qn === 0,
            onClick: le,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, Z ? "Analyzing…" : `Auto-Materialize${qn != null ? ` (${qn})` : ""}`) : null,
          S ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: vt != null || zn === 0,
            onClick: (B) => Je(B.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": Qe,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${zn ? ` (${zn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: re || we != null || D.length === 0,
            onClick: () => fn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": ae,
            "aria-label": `Open AI feedback collection, ${D.length} example${D.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${D.length ? ` (${D.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: de,
            type: "button",
            onClick: () => Or(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": Q,
            className: `${ft} ${r ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(hr, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${r ? ` (${r})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => Xt(!0),
            className: ft
          }, [n(hr, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            ref: Hn,
            type: "button",
            disabled: (S ? ee.actions.length === 0 : Ht == null) || vt != null || v,
            onClick: S ? () => Dn((B) => !B) : () => Pe(
              Ht.sequence - 1
            ),
            "aria-controls": S ? Gi : void 0,
            "aria-expanded": S ? $ : void 0,
            className: ft
          }, [
            n(hr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, S ? `History${ee.actions.length ? ` (${ee.actions.length})` : ""}` : Ht ? `Undo ${Ht.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: He,
            type: "button",
            onClick: nt,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": ce.markerRailOpen,
            className: ft
          }, [
            n(hr, { key: "icon", name: "list" }),
            n("span", { key: "label" }, ce.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ]),
      S && $ ? n(hc, {
        key: "history-popover",
        history: ee,
        historySaving: v,
        anchorRef: Hn,
        onRestore: Pe,
        onClose: jr
      }) : null
    ]),
    Q ? n(bc, {
      key: "editor-filters",
      filters: he,
      hideDerivedSegments: I,
      performers: dr,
      provenanceSources: Ae,
      reviewCounts: l,
      segments: Ke,
      segmentGroups: Ce,
      reviewMode: S,
      onChange: pn,
      onHideDerivedChange: ar,
      onClose: A
    }) : null,
    ue ? n(yc, {
      key: "first-segment-tag-dialog",
      saving: vt != null,
      error: Dt,
      onSelect: (B, Be) => R(B, Be),
      onClose: p
    }) : null,
    Ie ? n(Sc, {
      key: "quick-search-dialog",
      segments: Hl(o),
      onSelect: (B) => {
        yn(!1), ot(B, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        yn(!1), requestAnimationFrame(() => {
          var B;
          return (B = M.current) == null ? void 0 : B.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    m ? n(Nc, {
      key: "auto-assign-dialog",
      candidates: d,
      processing: b,
      error: c,
      onConfirm: u,
      onClose: () => En(!1)
    }) : null,
    Me ? n(Cc, {
      key: "merge-selection-dialog",
      merge: Me,
      processing: Ye,
      undoable: !S,
      cancelButtonRef: Fe,
      onConfirm: (B) => st(!0, B, Me),
      onClose: P
    }) : null,
    xe ? n(Tc, {
      key: "materialize-derived-dialog",
      preview: pe,
      loading: Z,
      processing: Te,
      error: j,
      cancelButtonRef: N,
      onConfirm: _,
      onClose: () => {
        Te || G();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: Un,
      className: `${jt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      ce.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: Vt ? { position: "absolute", top: 0, right: 0, width: U, height: h.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        Ke.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : cr.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: Oe,
          onScroll: (B) => ir({
            scrollTop: B.currentTarget.scrollTop,
            height: B.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: $e.height }
        }, Tt.map((B) => {
          var ge;
          let Be;
          if (B.kind === "group") {
            const it = E.includes(B.group.key), Jt = B.group.lanes.reduce((qt, zr) => qt + zr.markers.length, 0);
            Be = n("button", {
              type: "button",
              onClick: () => {
                On(B.group.key), xn(B.group.key);
              },
              "aria-expanded": !it,
              "aria-current": on === B.group.key ? "true" : void 0,
              "data-segment-rail-group": B.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${on === B.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, it ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: B.group.name }, B.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Jt),
              S && it ? n(nn, { key: "states", counts: B.group.counts }) : null
            ]);
          } else B.kind === "lane" ? Be = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: er(B.lane),
            "aria-label": er(B.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, B.lane.label),
            (ge = B.lane.performers) != null && ge.length ? n(Mr, {
              key: "performers",
              performers: B.lane.performers,
              performerAssignments: B.lane.performerAssignments
            }) : null,
            S ? n(nn, { key: "states", counts: B.lane.counts }) : null
          ]) : Be = Kr(B.segment);
          return n("div", {
            key: B.key,
            className: "absolute left-0 right-0",
            style: { top: B.top, height: B.height }
          }, Be);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${jt ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: yt,
          className: `${jt ? "min-h-0 flex-1" : ""} grid`,
          style: jt ? {
            gridTemplateRows: `minmax(16rem, ${(1 - ce.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${ce.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: Se,
            className: "grid min-h-0 gap-2",
            style: Vt ? {
              gridTemplateColumns: ce.markerRailOpen ? `${X}px 0.5rem minmax(0,1fr) 0.5rem ${U}px` : `${X}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(Ac, {
              key: "tools",
              compatibilityMode: S,
              selectedSegment: Ot,
              selectedSegments: an,
              selectedGroups: $t,
              saveMessage: Dt,
              savingSegmentId: vt,
              creatingSegmentId: z,
              acquireSaveLock: t,
              setSaveMessage: Pr,
              saveTag: rt,
              slotStatus: Dr,
              performerSlotsAvailable: ht,
              selectedPerformerSlots: Ft,
              performerSlots: dt,
              detail: O,
              onDetailChange: Ze,
              onCancelQueuedReview: g,
              video: bt,
              slotButtonRef: sr,
              tagSearchRef: Lr,
              tagEditing: Bn,
              onCancelTagEditing: W,
              detailPanelRef: H,
              onReduceSelection: (B) => {
                ot(B), requestAnimationFrame(() => {
                  var Be;
                  return (Be = H.current) == null ? void 0 : Be.focus({ preventScroll: !0 });
                });
              },
              saveTiming: pt,
              onSlotsChanged: Ue,
              onRecordHistory: Ee,
              splitSegment: lr,
              duplicateSegment: me,
              provenance: Ne,
              lineage: oe,
              onNavigateLineageItem: (B) => {
                const Be = Ke.find((ge) => ge.itemId === B);
                Be && Pn(Be.id);
              }
            }),
            Vt ? n(
              "div",
              { key: "detail-separator", ...Ve("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            bt.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Ba, {
                streamUrl: `/api/stream/video/${bt.id}`,
                posterUrl: `/api/stream/video/${bt.id}/screenshot?v=${encodeURIComponent(bt.updatedAt || "")}`,
                format: bt.videoFile.format,
                audioCodec: bt.videoFile.audioCodec,
                duration: bt.videoFile.duration,
                videoId: bt.id,
                trackingEnabled: !1,
                onSeekRegister: (B) => {
                  at.current = B, Gl(ze.current, Ke, B) && (ze.current = null);
                },
                onPlaybackControlRegister: (B) => {
                  J.current = B;
                },
                onTimeUpdate: sn
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            Vt && ce.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...Ve("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Vt && ce.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: T,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...Ur.map((B) => {
              var it;
              const Be = (it = Kn[B.id]) == null ? void 0 : it[0], ge = B.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : B.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: B.id,
                type: "button",
                disabled: B.disabled,
                "data-action-id": B.id,
                onClick: (Jt) => {
                  const qt = Jt.currentTarget;
                  De(B.id, { target: qt, preserveFocus: !0 }), B.focusWhenDisabled && requestAnimationFrame(() => {
                    Mc(qt, T.current, B.focusWhenDisabled);
                  });
                },
                title: Be ? `${B.label} (${Be})` : B.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${ge}`
              }, [
                n("span", { key: "label" }, B.label),
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
                disabled: !bt.videoFile,
                onClick: () => hn(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(Es, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !bt.videoFile,
                onClick: () => hn(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(Ds, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          jt ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(vn.minimum * 100),
            "aria-valuemax": Math.round(vn.maximum * 100),
            "aria-valuenow": Math.round(ce.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(ce.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: ve,
            onPointerMove: ne,
            onKeyDown: te,
            onDoubleClick: () => xt(Mt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: jt ? void 0 : { height: "20rem" } }, n(Rc, {
            segments: cr,
            shotBoundaries: Fn,
            segmentGroups: Ce,
            performerSlots: dt,
            collapsedGroupKeys: E,
            selectedGroupKey: on,
            selectedSegmentId: Ot == null ? void 0 : Ot.id,
            selectedSegmentIds: mn,
            duration: Fr,
            currentTime: L,
            zoom: Gn,
            onZoomChange: Ln,
            onSelectGroup: On,
            onToggleGroup: xn,
            onSelect: (B, Be) => ot(B, Be),
            onSelectSegments: Zt,
            onSelectAll: kt,
            onConfigureTag: (B) => gn(B),
            onSeekTime: (B) => {
              var Be;
              return (Be = at.current) == null ? void 0 : Be.call(at, B, !1);
            },
            centerRef: w,
            showReviewState: S,
            swimlaneTitleWidth: ce.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (B) => or((Be) => ({ ...Be, swimlaneTitleWidth: B }))
          }))
        ])
      ])
    ]),
    k ? n(wo, {
      key: `configure-tag:${k.tagId}`,
      tagId: k.tagId,
      tagName: k.tagName,
      performerSlotsEnabled: S,
      onSaved: gt,
      onClose: () => {
        const B = k.trigger;
        gn(null), requestAnimationFrame(() => {
          var Be;
          B != null && B.isConnected ? B.focus({ preventScroll: !0 }) : (Be = M.current) == null || Be.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Qe ? n(wc, {
      key: "publish-approved-dialog",
      drafts: Sn,
      processing: vt === -1,
      error: je,
      cancelButtonRef: ke,
      onConfirm: Xe,
      onClose: q
    }) : null,
    Le ? n(Ic, {
      key: "rejected-deletion-dialog",
      preview: Le,
      onConfirm: () => {
        C(Le), requestAnimationFrame(() => {
          var B;
          return (B = M.current) == null ? void 0 : B.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        bn(null), requestAnimationFrame(() => {
          var B;
          return (B = M.current) == null ? void 0 : B.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    wt ? n(vc, {
      key: "shortcuts-dialog",
      reviewMode: S,
      bindings: Kn,
      onClose: () => Xt(!1)
    }) : null,
    ae ? n(xc, {
      key: "incorrect-examples-dialog",
      examples: D,
      exporting: re,
      removingExampleId: we,
      onExport: y,
      onRemove: et,
      onClose: () => fn(!1)
    }) : null
  ]);
}
function Dc(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: m, setCollapsedSegmentGroups: u, setEditorFilters: b, setHideDerivedSegments: g, setSaveMessage: f, setSelectedSegmentGroupKey: y, setSelectedSegmentId: w, setSelectedSegmentIds: A } = e;
  function p(E) {
    const T = Gt(t, E);
    T && u((S) => $i(S, T));
  }
  function G(E) {
    w(E), A(E == null ? [] : [E]), c.current = E, m.current = [];
  }
  function P(E, {
    focusEditor: T = !1,
    seekToSegment: S = !1,
    additive: k = !1,
    rangeSegmentIds: R = null
  } = {}) {
    var L, C;
    const z = il({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: m.current
    }, E.id, R, k);
    A(z.selectedSegmentIds), w(z.activeSegmentId), c.current = z.anchorSegmentId, m.current = z.rangeBaseSegmentIds, z.activeSegmentId != null && y(Gt(t, z.activeSegmentId)), p(E.id), T && ((L = r.current) == null || L.focus({ preventScroll: !0 })), S && ((C = i.current) == null || C.call(i, E.startSec, !1));
  }
  function q(E) {
    const T = ol(
      d,
      l,
      E
    );
    A(T.selectedSegmentIds), w(T.activeSegmentId), c.current = T.activeSegmentId, m.current = [], T.activeSegmentId != null && (y(Gt(t, T.activeSegmentId)), p(T.activeSegmentId));
  }
  function W() {
    var S;
    const E = ll(s), T = E.includes(l) ? l : E[0] ?? null;
    b(Lt({})), g(!1), A(E), w(T), c.current = T, m.current = [], T != null && y(Gt(
      dn(s, a, o),
      T
    )), f(E.length === 0 ? "There are no segments to select." : `${E.length} segments selected. Collapsed Segment groups keep their selected segments.`), (S = r.current) == null || S.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: p, replaceSegmentSelection: G, selectSegment: P, selectSegmentCollection: q, selectAllVideoSegments: W };
}
function Oc(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, stableSaveIdentity: c, historyRef: m, onConflict: u, onDetailChange: b, onReload: g, recordHistoryAction: f, revealSegmentGroupForSelection: y, savingSegmentId: w, selectedGroups: A, selectedSegment: p, selectedSegmentIdRef: G, selectedSegments: P, selectionAnchorIdRef: q, selectionRangeBaseIdsRef: W, setMergeConfirmation: E, setSaveMessage: T, setSelectedSegmentId: S, setSelectedSegmentIds: k, video: R } = e;
  function z() {
    E(null), requestAnimationFrame(() => {
      var H;
      return (H = a.current) == null ? void 0 : H.focus({ preventScroll: !0 });
    });
  }
  async function L(H = !1, X = !1, me = null) {
    if (w != null) return;
    const he = me || Ii(
      A,
      { nativeOnly: !o }
    );
    if (!he) {
      T("Select at least two segments from one swimlane.");
      return;
    }
    if (!H && ei()) {
      E(he);
      return;
    }
    X && ti(!1);
    const ce = he.endSec == null ? "open end" : Re(he.endSec);
    let M = he.segments[0];
    const re = o ? null : Pt(he.segments, !1), de = o ? null : crypto.randomUUID(), Q = he.segments.map((ne) => ne.id), ue = Ld(i, he.segments).segments.find((ne) => ne.id === M.id), Se = {
      startSec: ue.startSec,
      endSec: ue.endSec,
      sourceKey: ue.sourceKey,
      sourceRunId: ue.sourceRunId,
      confidence: ue.confidence,
      isDerived: ue.isDerived
    }, te = r("merge", he.segments[0].id);
    if (!te) return;
    z();
    const ve = _t();
    s({
      type: "add",
      entry: { id: ve, op: "merge", targets: he.segments.map(Rt), values: Se }
    }), k([M.id]), S(M.id), q.current = M.id, W.current = [];
    try {
      const ne = he.segments.slice(1);
      if (!o || M.nativeSegmentId != null) {
        const V = ne.map((I) => {
          const ee = `merge-native-selection:${R.id}:${M.id}:${I.id}:${M.updatedAt}:${I.updatedAt}`;
          return { key: ee, operationId: qe(ee), segmentId: I.id, expectedUpdatedAt: I.updatedAt };
        }), be = await Y(`/videos/${R.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: M.id,
            expectedSurvivorUpdatedAt: M.updatedAt,
            consumedSegments: V.map(({ key: I, ...ee }) => ee),
            historyReceiptId: de
          })
        });
        M = be.survivor, b((I) => ha(I, be), R.id), s({ type: "confirm", key: ve, applied: !0 }), V.forEach(({ key: I }) => _e(I));
      } else {
        const V = ne.map((I) => {
          const ee = `merge-draft-selection:${R.id}:${M.itemId}:${I.itemId}:${M.revision}:${I.revision}`;
          return { key: ee, operationId: qe(ee), itemId: I.itemId, expectedRevision: I.revision };
        }), be = await Y(`/videos/${R.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: M.itemId,
            expectedSurvivorRevision: M.revision,
            consumedDrafts: V.map(({ key: I, ...ee }) => ee)
          })
        });
        M = be.survivor, b((I) => ha(I, be), R.id), s({ type: "confirm", key: ve, applied: !0 }), V.forEach(({ key: I }) => _e(I));
      }
      k([M.id]), S(M.id), q.current = M.id, W.current = [], o ? t(Yt) : await f(
        "segments.merge",
        `Merged ${he.segments.length} segments`,
        re,
        Pt([M], !1),
        de
      ), y(M.id), T(`${he.segments.length} segments merged into ${Re(he.startSec)} – ${ce}.`);
    } catch (ne) {
      s({ type: "discard", key: ve }), k(Q), S((p == null ? void 0 : p.id) ?? Q[0] ?? null), q.current = (p == null ? void 0 : p.id) ?? Q[0] ?? null, W.current = [], ne.status === 409 ? await u() : T(ne.message || "Unable to merge selected segments.");
    } finally {
      te();
    }
  }
  function C(H, X = P, me = p) {
    if (X.length === 0) return Promise.resolve(null);
    const he = vl(H, X, me), ce = Math.max(0, he.identities.indexOf(he.activeIdentity)), M = d(), re = Ai(M) != null || M.queued.some((Q) => So(Q.targets, he.identities.map(c))), de = l({
      kind: "review",
      lockId: he.activeIdentity.id,
      targets: he.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (Q) => O(Q, {
        ...he,
        identities: Q.targets,
        activeIdentity: Q.targets[ce]
      })
    });
    return de ? (re && T(`${H === "approved" ? "Approval" : "Rejection"} queued…`), de.done) : (T("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function O({ detail: H, segments: X, onConflict: me, onReload: he }, ce) {
    var be;
    const M = xl(ce, X);
    if (!M) {
      T("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: re, selectedSegments: de, selectedSegment: Q } = M, ue = hl(de, re), Se = de.filter((I) => I.reviewState !== ue);
    if (Se.length === 0) return;
    const te = de.map((I) => ({
      id: I.id,
      itemId: I.itemId,
      nativeSegmentId: I.nativeSegmentId
    })), ve = te.find((I) => I.id === (Q == null ? void 0 : Q.id)) || te[0], ne = (I, ee = !1) => {
      if (!(I != null && I.segments) || !ee && !ro(G.current, ve.id))
        return;
      const $ = te.map((h) => tt(I == null ? void 0 : I.segments, h)).filter(Boolean), v = tt(I == null ? void 0 : I.segments, ve) || $[0] || null;
      k($.map((h) => h.id)), S((v == null ? void 0 : v.id) ?? null), q.current = (v == null ? void 0 : v.id) ?? null, W.current = [];
    };
    T(`Updating ${Se.length} selected segment${Se.length === 1 ? "" : "s"}…`);
    const V = _t();
    s({
      type: "add",
      entry: { id: V, op: "patch", targets: Se.map(Rt), values: { reviewState: ue } }
    });
    try {
      const I = await Y(`/videos/${R.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: m.current.revision,
          reviewState: ue,
          segments: de.map((h) => h.published ? {
            nativeSegmentId: h.nativeSegmentId,
            expectedUpdatedAt: h.updatedAt
          } : {
            itemId: h.itemId,
            expectedRevision: h.revision
          })
        })
      }), ee = new Map((I.items || []).map((h) => [
        h.requestedNativeSegmentId != null ? `native:${h.requestedNativeSegmentId}` : `item:${h.requestedItemId}`,
        h
      ]));
      if (te.forEach((h) => {
        const x = ee.get(h.nativeSegmentId != null ? `native:${h.nativeSegmentId}` : `item:${h.itemId}`);
        x && (h.nativeSegmentId = x.nativeSegmentId, h.itemId = x.itemId);
      }), I.history && t(I.history), ue === "rejected" || (I.items || []).some((h) => h.requestedNativeSegmentId != null && h.nativeSegmentId !== h.requestedNativeSegmentId)) {
        const h = await he();
        s({ type: "confirm", key: V, applied: h != null }), ne(h), T(`${I.updatedCount} selected segment${I.updatedCount === 1 ? "" : "s"} ${ue === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const v = (h) => ({
        ...h,
        approvedSetVersion: I.approvedSetVersion || h.approvedSetVersion,
        segments: (h.segments || []).map((x) => {
          const D = ee.get(x.nativeSegmentId != null ? `native:${x.nativeSegmentId}` : `item:${x.itemId}`);
          return D ? {
            ...x,
            id: D.nativeSegmentId != null ? D.nativeSegmentId : -D.itemId,
            itemId: D.itemId,
            nativeSegmentId: D.nativeSegmentId,
            published: D.nativeSegmentId != null,
            reviewState: ue,
            revision: D.nativeSegmentId != null ? x.revision : D.revision,
            updatedAt: D.updatedAt
          } : x;
        })
      });
      b(v, R.id), s({ type: "confirm", key: V, applied: !0 }), ne(v(H)), T(`${I.updatedCount} selected segment${I.updatedCount === 1 ? "" : "s"} ${ue === "approved" ? "approved" : ue === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (I) {
      s({ type: "discard", key: V }), I.status === 409 && ((be = I.payload) != null && be.currentHistory) && t(I.payload.currentHistory);
      const ee = I.status === 409 ? await me() : H;
      ne(ee, !0), T(I.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: z, mergeSelectedSwimlane: L, saveSelectedReviewState: C };
}
function Pc(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: m, detail: u, editorFilters: b, editorRef: g, cancelSaveTasks: f, dispatchPendingChanges: y, enqueueSave: w, stableSaveIdentity: A, exportingExamples: p, hideDerivedSegments: G, incorrectExamples: P, lineage: q, materializeButtonRef: W, materializePreview: E, materializeRestoreFocusRef: T, materializing: S, mutateSegment: k, runSegmentMutation: R, pendingChanges: z, onConflict: L, onDetailChange: C, onReload: O, performerSlots: H, recordHistoryAction: X, refreshMaterializationPreview: me, removingExampleId: he, revealSegmentGroupForSelection: ce, savingSegmentId: M, segmentGroups: re, segments: de, selectedSegment: Q, selectedSegmentIdRef: ue, selectedSegments: Se, selectionAnchorIdRef: te, selectionRangeBaseIdsRef: ve, setAutoAssignError: ne, setAutoAssignOpen: V, setAutoAssigning: be, setEditorFilters: I, setExportingExamples: ee, setHideDerivedSegments: $, setIncorrectExamples: v, setMaterializeError: h, setMaterializeLoading: x, setMaterializeOpen: D, setMaterializePreview: ae, setMaterializing: oe, setRejectedDeletionPreview: U, setRemovingExampleId: ie, setSaveMessage: N, setSelectedSegmentGroupKey: _, setSelectedSegmentId: j, setSelectedSegmentIds: Z, swimlanes: xe, video: pe } = e;
  async function Te() {
    var Ee, Le, et;
    if (Se.length === 0 || !Q || M != null) return;
    const J = Rd(Se, P), le = J.segments;
    if (le.length === 0) return;
    const Ne = Se.map((we) => ({
      id: we.id,
      itemId: we.itemId,
      nativeSegmentId: we.nativeSegmentId
    })), Ae = Ne.find((we) => we.id === Q.id) || Ne[0], ke = [], Xe = [];
    let je = !1, Qe = u, Ie = !1;
    const Oe = [], He = r("feedback", Ae.id);
    if (He) {
      N(J.action === "remove" ? `Removing ${le.length} selected incorrect example${le.length === 1 ? "" : "s"}…` : `Collecting ${le.length} selected segment${le.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const we = async (Ce, $e) => {
          const Ke = Ce.nativeSegmentId != null, kt = J.action === "remove" ? `incorrect-example-remove:${pe.id}:${$e == null ? void 0 : $e.id}:${$e == null ? void 0 : $e.revision}:${$e == null ? void 0 : $e.representationRevision}` : `incorrect-example-collect:${pe.id}:${Ke ? `native:${Ce.nativeSegmentId}:${Ce.updatedAt}` : `item:${Ce.itemId}:${Ce.revision}`}`;
          if (J.action === "remove" && !$e)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let ot;
          try {
            ot = J.action === "remove" ? await Y(
              `/videos/${pe.id}/incorrect-examples/${$e.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: qe(kt),
                  expectedExampleRevision: $e.revision,
                  expectedRepresentationRevision: $e.representationRevision
                })
              }
            ) : await Y(`/videos/${pe.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: qe(kt),
                nativeSegmentId: Ke ? Ce.nativeSegmentId : null,
                itemId: Ke ? null : Ce.itemId,
                expectedUpdatedAt: Ke ? Ce.updatedAt : null,
                expectedRevision: Ke ? null : Ce.revision
              })
            });
          } catch (Zt) {
            throw Zt.operationKey = kt, Zt;
          }
          if (!Md(J.action, ot))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return _e(kt), ot;
        };
        for (const Ce of le) {
          const $e = J.action === "remove" ? P.find((Ke) => Ke.itemId != null && Ke.itemId === Ce.itemId) : null;
          try {
            const Ke = Ne.find(($t) => $t.id === Ce.id);
            let kt = tt(
              Qe == null ? void 0 : Qe.segments,
              Ke
            ) || Ce, ot;
            try {
              ot = await we(kt, $e);
            } catch ($t) {
              if ($t.status === 409 && ((Le = (Ee = $t.payload) == null ? void 0 : Ee.result) == null ? void 0 : Le.code) === "OPERATION_REPLAYED")
                Qe = await Y(
                  `/videos/${pe.id}/editor`
                ), Ie = !0, Oe.length = 0, _e($t.operationKey), ot = $t.payload.result;
              else {
                if (J.action !== "collect" || $t.status !== 409) throw $t;
                const Ft = await Y(
                  `/videos/${pe.id}/editor`
                );
                Qe = Ft, Ie = !0, Oe.length = 0;
                const Ot = tt(
                  Ft == null ? void 0 : Ft.segments,
                  Ke
                );
                if (!Ot) throw $t;
                kt = Ot, ot = await we(kt, null);
              }
            }
            Ke && ot.itemId != null && (Ke.itemId = ot.itemId), Qe = wr(
              Qe,
              ot.editorDelta
            ), Oe.push(ot.editorDelta);
            const Zt = { segment: Ce, result: ot, example: $e };
            ke.push(Zt);
          } catch (Ke) {
            if (Xe.push(Ke), ![400, 404, 409].includes(Ke.status)) break;
          }
        }
        if (c && ke.length > 0) {
          const Ce = J.action === "remove", $e = ke.length;
          await X(
            Ce ? "feedback.remove" : "feedback.collect",
            Ce ? `Removed ${$e} incorrect AI example${$e === 1 ? "" : "s"}` : `Collected ${$e} incorrect AI example${$e === 1 ? "" : "s"}`,
            yr(ke, Ce),
            yr(ke, !Ce)
          ) || (je = !0);
        }
        ke.some(({ result: Ce }) => Ce.representation === "basicNativeBin") && Qn();
        const Pe = ro(
          ue.current,
          Ae.id
        ), De = J.action === "collect" && ke.some(({ segment: Ce }) => Ce.id === Ae.id), Dt = ke.map(({ segment: Ce }) => Ce.id), rt = De ? kr(
          xe,
          Sr(o, Ae.id),
          { removedIds: Dt }
        ) : null, pt = De ? (rt == null ? void 0 : rt.id) ?? null : Ae.id;
        Pe && De && (Z(rt ? [rt.id] : []), j((rt == null ? void 0 : rt.id) ?? $n), te.current = (rt == null ? void 0 : rt.id) ?? null, ve.current = []);
        const vt = await Y(`/videos/${pe.id}/incorrect-examples`);
        v(vt);
        const at = Qe;
        if (C(Ie ? at : (Ce) => Oe.reduce(wr, Ce), pe.id), Pe && ro(
          ue.current,
          pt
        )) {
          let Ce, $e;
          De ? ($e = rt ? tt(at == null ? void 0 : at.segments, {
            id: rt.id,
            itemId: rt.itemId,
            nativeSegmentId: rt.nativeSegmentId
          }) : null, Ce = $e ? [$e] : []) : (Ce = Ne.map((Ke) => tt(at == null ? void 0 : at.segments, Ke)).filter(Boolean), $e = tt(at == null ? void 0 : at.segments, Ae) || Ce[0] || null), Z(Ce.map((Ke) => Ke.id)), j(($e == null ? void 0 : $e.id) ?? (De ? $n : null)), te.current = ($e == null ? void 0 : $e.id) ?? null, ve.current = [], _($e ? Gt(o, $e.id) : null), $e && ce($e.id);
        }
        if (Xe.length > 0) {
          const Ce = ((et = Xe[0]) == null ? void 0 : et.message) || "Only segments with registered AI provenance can be collected.";
          ke.length === 0 ? N(Ce) : J.action === "remove" ? N(
            `Partially removed ${ke.length} of ${le.length} selected incorrect examples. ${Ce}`
          ) : N(
            `Partially collected ${ke.length} of ${le.length} selected segments. ${Ce}`
          );
        } else if (J.action === "remove")
          N(
            `${ke.length} incorrect example${ke.length === 1 ? "" : "s"} removed and ${ke.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const Ce = ke.filter(({ result: $e }) => $e.representation === "basicNativeBin").length;
          N(Ce === ke.length ? `${ke.length} incorrect AI example${ke.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ke.length} incorrect AI example${ke.length === 1 ? "" : "s"} collected and ${ke.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        je && N("The change saved, but editor history could not be updated.");
      } catch (we) {
        N(we.message || "Unable to update the selected incorrect examples.");
      } finally {
        He();
      }
    }
  }
  async function yt(J) {
    if (!J || he != null || p) return;
    const le = r("feedback", -1);
    if (!le) {
      N("Wait for the current save to finish before removing the incorrect example.");
      return;
    }
    try {
      await Fe(J);
    } finally {
      le();
    }
  }
  async function Fe(J) {
    var Ne, Ae;
    ie(J.id);
    const le = `incorrect-example-remove:${pe.id}:${J.id}:${J.revision}:${J.representationRevision}`;
    try {
      let ke, Xe = !1;
      try {
        ke = await Y(
          `/videos/${pe.id}/incorrect-examples/${J.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: qe(le),
              expectedExampleRevision: J.revision,
              expectedRepresentationRevision: J.representationRevision
            })
          }
        );
      } catch (Ie) {
        if (Ie.status !== 409 || ((Ae = (Ne = Ie.payload) == null ? void 0 : Ne.result) == null ? void 0 : Ae.code) !== "OPERATION_REPLAYED")
          throw Ie;
        ke = Ie.payload.result, Xe = !0;
      }
      _e(le);
      let je = !0;
      if (c) {
        const Oe = [{ segment: tt(u.segments, {
          itemId: J.itemId
        }) || {
          id: J.itemId == null ? null : -J.itemId,
          itemId: J.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: J.representationRevision
        }, result: ke, example: J }];
        je = await X(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          yr(Oe, !0),
          yr(Oe, !1)
        );
      }
      const Qe = await Y(
        `/videos/${pe.id}/incorrect-examples`
      );
      v(Qe), Xe ? await O() : C(
        (Ie) => wr(Ie, ke.editorDelta),
        pe.id
      ), J.representation === "basicNativeBin" && Qn(), N(je ? Xe ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : J.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (ke) {
      ke.status === 409 && await L(), N(ke.message || "Unable to remove the incorrect example.");
    } finally {
      ie(null);
    }
  }
  async function Me() {
    if (p || he != null || P.length === 0) return;
    ee(!0);
    const J = `incorrect-example-export:${pe.id}:${P.map((le) => `${le.id}:${le.revision}:${le.representationRevision}`).join(",")}`;
    try {
      const le = await Dd(
        pe.id,
        P
      ), Ne = new FormData();
      Ne.append("metadata", JSON.stringify({
        operationId: qe(J),
        examples: le.captures
      }));
      for (const Ie of le.files)
        Ne.append(Ie.fieldName, Ie.file);
      const Ae = await Y(
        `/videos/${pe.id}/incorrect-examples/export`,
        { method: "POST", body: Ne }
      ), ke = await Yl(Ae.downloadUrl), Xe = URL.createObjectURL(ke.blob), je = document.createElement("a");
      je.href = Xe, je.download = ke.fileName, je.click(), setTimeout(() => URL.revokeObjectURL(Xe), 1e3);
      const Qe = await Y(
        `/training-exports/${Ae.id}/complete`,
        { method: "POST" }
      );
      _e(J), v(await Y(
        `/videos/${pe.id}/incorrect-examples`
      )), N(
        `Downloaded ${Ae.exampleCount} incorrect example${Ae.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Qe.clearedExampleCount} from the working collection.`
      );
    } catch (le) {
      N(le.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      ee(!1);
    }
  }
  async function Ye(J = null) {
    const le = de.filter((Le) => Le.reviewState === "rejected"), Ne = le.length, Ae = P.some((Le) => Le.representation === "fullItem");
    if (J == null && Ne === 0 && !Ae) {
      N("There are no rejected segments to delete.");
      return;
    }
    if (J == null) {
      const Le = r("delete-rejected", -1);
      if (!Le) return;
      N("Preparing deletion summary…");
      try {
        const et = await Y(`/videos/${pe.id}/rejected/deletion/preview`, { method: "POST" }), we = Number(et.deletedSegmentCount) || 0, Pe = Number(et.deferredRejectedSegmentCount) || 0, De = Number(et.protectedIncorrectExampleCount) || 0;
        if (we === 0) {
          Pe > 0 ? N(
            `${Pe} feedback-protected rejected segment${Pe === 1 ? "" : "s"} kept. ${De} AI feedback example${De === 1 ? "" : "s"} must be exported before ${Pe === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : N("There are no rejected segments to delete.");
          return;
        }
        if (!fi(et, N)) return;
        U(et), N("");
      } catch (et) {
        N(et.message || "Unable to prepare rejected segment deletion.");
      } finally {
        Le();
      }
      return;
    }
    const ke = J, Xe = Number(ke.deferredRejectedSegmentCount) || 0, je = ue.current, Qe = le.map((Le) => Le.id), Ie = Xe === 0 && Qe.includes(je), Oe = Ie ? kr(
      xe,
      Sr(o, je),
      { removedIds: Qe }
    ) : null, He = r("delete-rejected", -1);
    if (!He) return;
    U(null), N("Deleting rejected segments…");
    const Ee = Xe === 0 ? _t() : null;
    Ee && y({
      type: "add",
      entry: { id: Ee, op: "remove", targets: le.map(Rt) }
    }), Ie && (Z(Oe ? [Oe.id] : []), j((Oe == null ? void 0 : Oe.id) ?? $n), te.current = (Oe == null ? void 0 : Oe.id) ?? null, ve.current = []);
    try {
      const Le = `rejected-dependency-delete:${pe.id}:${ke.fingerprint}`, et = await Y(`/videos/${pe.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: qe(Le),
          fingerprint: ke.fingerprint
        })
      });
      _e(Le);
      const we = await O();
      Ee && y({ type: "confirm", key: Ee, applied: we != null }), et.deletedSegmentCount > 0 && t(Yt);
      const Pe = Xe > 0 ? ` ${Xe} feedback-protected rejected segment${Xe === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      N(`${et.deletedSegmentCount} segment${et.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Pe}`);
    } catch (Le) {
      Ee && y({ type: "discard", key: Ee }), Ie && (Z(je == null ? [] : [je]), j(je), te.current = je, ve.current = []), N(Le.message || "Unable to delete rejected segments.");
    } finally {
      He();
    }
  }
  async function st(J = i) {
    if (a || J.length === 0) return;
    const le = r("auto-assign", -1);
    if (!le) {
      ne("Wait for the current save to finish before assigning performers.");
      return;
    }
    try {
      await lt(J);
    } finally {
      le();
    }
  }
  async function lt(J) {
    be(!0), ne("");
    try {
      const le = await Y(`/videos/${pe.id}/segments/auto-assign-performer-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeSegmentIds: J.flatMap((Ne) => Ne.nativeSegmentId == null ? [] : [Ne.nativeSegmentId]),
          itemIds: J.flatMap((Ne) => Ne.published || Ne.itemId == null ? [] : [Ne.itemId])
        })
      });
      V(!1), await O(), N(`${le.assignedSegmentCount} segment${le.assignedSegmentCount === 1 ? "" : "s"} received ${le.assignedSlotCount} performer-slot assignment${le.assignedSlotCount === 1 ? "" : "s"}.`);
    } catch (le) {
      ne(le.message || "Unable to auto-assign performers.");
    } finally {
      be(!1);
    }
  }
  async function Ze() {
    D(!0), h(""), !E && (x(!0), me());
  }
  function mt() {
    T.current = !0, D(!1), requestAnimationFrame(() => {
      var J;
      return (J = W.current) == null ? void 0 : J.focus({ preventScroll: !0 });
    });
  }
  async function gt() {
    if (!E || S || E.createCount + E.linkCount === 0)
      return;
    const J = r("materialize", -1);
    if (!J) {
      h("Wait for the current save to finish before materializing derived segments.");
      return;
    }
    try {
      await Ue();
    } finally {
      J();
    }
  }
  async function Ue() {
    oe(!0), h("");
    let J;
    try {
      const le = `materialize-derived:${pe.id}:${E.fingerprint}`;
      J = await Y(`/videos/${pe.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: qe(le),
          fingerprint: E.fingerprint,
          maxDepth: 3
        })
      }), _e(le);
    } catch (le) {
      le.status === 409 && ae(null), h(le.message || "Unable to materialize derived segments."), oe(!1);
      return;
    }
    ae((le) => le && { ...le, createCount: 0, linkCount: 0 });
    try {
      await O(), mt(), ae(null);
      const le = J.createdCount + J.linkedCount;
      N(`${J.createdCount} derived segment${J.createdCount === 1 ? "" : "s"} created and ${J.linkedCount} existing segment${J.linkedCount === 1 ? "" : "s"} linked.`), le === 0 && N("Every applicable derivation was already materialized.");
    } catch {
      h("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    oe(!1);
  }
  async function Je(J, le = null) {
    var ke, Xe, je, Qe;
    const Ne = {
      tagId: J,
      ...le ? { tagName: le } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (Se.length > 1) {
      const Ie = Se.filter((we) => we.tagId !== J);
      if (Ie.length === 0) {
        d();
        return;
      }
      const Oe = Se.map((we) => ({
        id: we.id,
        itemId: we.itemId,
        nativeSegmentId: we.nativeSegmentId
      })), He = Se.map((we) => !c || we.nativeSegmentId != null ? `native:${we.nativeSegmentId}:${we.updatedAt}` : `item:${we.itemId}:${we.revision}`).sort().join(","), Ee = `bulk-tag:${pe.id}:${J}:${He}`, Le = r("tag", (Q == null ? void 0 : Q.id) ?? Ie[0].id);
      if (!Le) return;
      N(`Changing tag for ${Ie.length} selected segment${Ie.length === 1 ? "" : "s"}…`);
      const et = _t();
      y({
        type: "add",
        entry: { id: et, op: "patch", targets: Ie.map(Rt), values: Ne }
      }), d();
      try {
        const we = c ? null : crypto.randomUUID();
        await Y(`/videos/${pe.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: qe(Ee),
            tagId: J,
            historyReceiptId: we,
            segments: Se.map((pt) => {
              const vt = !c || pt.nativeSegmentId != null;
              return {
                nativeSegmentId: vt ? pt.nativeSegmentId : null,
                itemId: vt ? null : pt.itemId,
                expectedUpdatedAt: vt ? pt.updatedAt : null,
                expectedRevision: vt ? null : pt.revision
              };
            })
          })
        }), _e(Ee);
        const Pe = Pt(
          Se,
          c
        ), De = await O();
        y({ type: "confirm", key: et, applied: De != null });
        const Dt = Oe.map((pt) => tt(De == null ? void 0 : De.segments, pt)).filter(Boolean);
        await X(
          "segments.tag",
          `Changed tag for ${Ie.length} segment${Ie.length === 1 ? "" : "s"}`,
          Pe,
          Pt(Dt, c),
          we
        );
        const rt = Oe.map((pt) => tt(De == null ? void 0 : De.segments, pt)).filter(Boolean);
        Z(rt.map((pt) => pt.id)), j(((ke = rt.find((pt) => pt.id === (Q == null ? void 0 : Q.id))) == null ? void 0 : ke.id) ?? ((Xe = rt[0]) == null ? void 0 : Xe.id) ?? null), d(), N(`${Ie.length} selected segment${Ie.length === 1 ? "" : "s"} retagged.`);
      } catch (we) {
        y({ type: "discard", key: et });
        const Pe = Oe.map((Dt) => tt(u.segments, Dt)).filter(Boolean), De = tt(u.segments, {
          id: Q == null ? void 0 : Q.id,
          itemId: Q == null ? void 0 : Q.itemId,
          nativeSegmentId: Q == null ? void 0 : Q.nativeSegmentId
        }) || Pe[0] || null;
        Z(Pe.map((Dt) => Dt.id)), j((De == null ? void 0 : De.id) ?? null), te.current = (De == null ? void 0 : De.id) ?? null, ve.current = [], we.status === 409 && await L(), N(we.message || "Unable to change the selected segment tags.");
      } finally {
        Le();
      }
      return;
    }
    if (Se.length !== 1 || !Q) return;
    const Ae = Ri(z, Q);
    if (Q.id === m || Ae) {
      const Ie = Ae ? { segmentId: Q.id, tagId: Ae.values.tagId, tagName: Ae.meta.tagName } : null, Oe = Il(Ie, Q, J, le);
      if (Oe && !Ve(Q, Oe)) {
        d();
        return;
      }
      if (Ae && (f((He) => {
        var Ee;
        return ((Ee = He.meta) == null ? void 0 : Ee.pendingChangeId) === Ae.id;
      }), y({ type: "discard", key: Ae.id })), Oe) {
        const He = ni(
          { ...Q, tagId: Oe.tagId },
          H,
          b,
          G,
          re
        );
        I(He.filters), $(He.hideDerivedSegments), N("Tag change queued…");
      } else Ae && N("");
      d();
      return;
    }
    if (J === Q.tagId) {
      d();
      return;
    }
    if (Q.itemId != null && ((Qe = (je = q.data) == null ? void 0 : je.children) == null ? void 0 : Qe.length) > 0) {
      const Ie = r("lineage-tag", Q.id);
      if (!Ie) return;
      N("Checking lineage impact…");
      let Oe = null;
      try {
        const He = await Y(`/items/${Q.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: Q.revision, tagId: J })
        }), Ee = He.deletedItemIds.length > 0 || He.removedEdgeIds.length > 0;
        if (Ee && !window.confirm(
          `Changing this tag removes ${He.removedEdgeIds.length} lineage edge${He.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${He.deletedItemIds.length} derived segment${He.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
        )) {
          N("Tag change canceled.");
          return;
        }
        Oe = _t(), y({
          type: "add",
          entry: { id: Oe, op: "patch", targets: [Rt(Q)], values: Ne }
        }), d();
        const Le = `tag-change:${Q.itemId}:${Q.revision}:${He.componentFingerprint}:${J}`;
        await Y(`/items/${Q.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: qe(Le),
            expectedRevision: Q.revision,
            componentFingerprint: He.componentFingerprint,
            tagId: J
          })
        }), _e(Le);
        const et = await O();
        y({ type: "confirm", key: Oe, applied: et != null }), d(), N(Ee ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch (He) {
        Oe && y({ type: "discard", key: Oe }), Z([Q.id]), j(Q.id), te.current = Q.id, ve.current = [], He.status === 409 ? (N("Lineage changed — loading the latest segments…"), await L()) : N(He.message || "Unable to reconcile the lineage.");
      } finally {
        Ie();
      }
      return;
    }
    d(), await k(Q, {
      startSec: Q.startSec,
      endSec: Q.endSec,
      tagId: J
    }, !0, null, !0, Ne);
  }
  function Ve(J, le) {
    const Ne = _t(), Ae = A(Rt(J));
    y({
      type: "add",
      entry: {
        id: Ne,
        op: "patch",
        targets: [Ae],
        values: { tagId: le.tagId, tagName: le.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: le.tagName }
      }
    });
    const ke = z.find((je) => je.op === "insert" && je.segment.id === J.id);
    return w({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [Ae],
      dependsOn: (ke == null ? void 0 : ke.taskId) ?? null,
      meta: { pendingChangeId: Ne },
      ready: (je, Qe) => {
        const Ie = Ti(je.segments, Qe.targets[0]);
        return !Ie || Cl(je, Ie.id);
      },
      run: (je) => ze(je, Ne, le)
    }) ? !0 : (y({ type: "discard", key: Ne }), N("Wait for the history restore to finish."), !1);
  }
  async function ze(J, le, Ne) {
    const [Ae] = J.resolveTargets();
    if (!Ae) {
      y({ type: "discard", key: le }), N(`The new segment was not retagged${Ne.tagName ? ` to ${Ne.tagName}` : ""}. Choose its tag again.`);
      return;
    }
    if (Ae.tagId === Ne.tagId) {
      y({ type: "discard", key: le });
      return;
    }
    await R(Ae, {
      startSec: Ae.startSec,
      endSec: Ae.endSec,
      tagId: Ne.tagId
    }, {
      pendingChangeId: le,
      restoreSelectionOnFailure: !1,
      onReload: J.onReload,
      onConflict: J.onConflict
    }) || N(`The new segment was not retagged${Ne.tagName ? ` to ${Ne.tagName}` : ""}. Choose its tag again.`);
  }
  async function dt() {
    var Qe, Ie, Oe, He;
    if (!l || !Q || M != null) return;
    const J = [...Se].sort((Ee, Le) => Number(Ee.nativeSegmentId ?? Ee.id) - Number(Le.nativeSegmentId ?? Le.id)), le = new Set(J.map((Ee) => Ee.id)), Ne = J.map((Ee) => `${Ee.nativeSegmentId ?? Ee.id}:${Ee.updatedAt}`).join("|"), Ae = r("bin", Q.id);
    if (!Ae) return;
    N(`Moving ${J.length} segment${J.length === 1 ? "" : "s"} to recycling bin…`);
    const ke = `bulk-move:${pe.id}:${Ne}`, Xe = qe(ke), je = c ? null : crypto.randomUUID();
    try {
      const Ee = (Pe = !1) => Y(`/videos/${pe.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Xe,
          segments: J.map((De) => ({
            segmentId: De.nativeSegmentId ?? De.id,
            expectedUpdatedAt: De.updatedAt
          })),
          discardMissingImage: Pe,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: je
        })
      });
      let Le;
      try {
        Le = await Ee(
          fo(ke)
        );
      } catch (Pe) {
        if (((Qe = Pe.payload) == null ? void 0 : Qe.code) !== "missing-image" || !window.confirm(`${Pe.message}

Continue and discard the missing image reference?`)) throw Pe;
        yo(ke), Le = await Ee(!0);
      }
      _e(ke), Qn();
      const et = new Map((Le.items || []).map((Pe) => [
        Number(Pe.segmentId),
        Pe
      ]));
      await X(
        "segments.moveToBin",
        `Moved ${J.length} segment${J.length === 1 ? "" : "s"} to recycling bin`,
        Pt(J, !1),
        Pt(J.map((Pe) => {
          const De = et.get(
            Number(Pe.nativeSegmentId ?? Pe.id)
          );
          return {
            ...Pe,
            recycleBinItemId: (De == null ? void 0 : De.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (De == null ? void 0 : De.revision) ?? null
          };
        }), !1),
        je
      );
      const we = kr(
        xe,
        Sr(o, Q.id),
        { removedIds: [...le] }
      );
      C((Pe) => ({
        ...Pe,
        segments: (Pe.segments || []).filter((De) => !le.has(De.id))
      }), pe.id), Z(we ? [we.id] : []), j((we == null ? void 0 : we.id) ?? $n), te.current = (we == null ? void 0 : we.id) ?? null, ve.current = [], we && (_(Gt(o, we.id)), ce(we.id)), requestAnimationFrame(() => {
        var Pe;
        return (Pe = g.current) == null ? void 0 : Pe.focus({ preventScroll: !0 });
      }), N(`Moved ${J.length} segment${J.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Ee) {
      const Le = ((Ie = Ee.payload) == null ? void 0 : Ie.code) || ((He = (Oe = Ee.payload) == null ? void 0 : Oe.result) == null ? void 0 : He.code);
      Ee.status === 409 && Le === "CANONICAL_SEGMENT_CHANGED" ? await L() : N(Ee.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Ae();
    }
  }
  async function ht() {
    if (!(c || s.current || M != null)) {
      s.current = !0, N("Checking the recycling bin…");
      try {
        const J = await Y("/bin"), le = await bi(J, () => N("Emptying the recycling bin…"));
        if (le.status === "empty") {
          N("The recycling bin is empty.");
          return;
        }
        if (le.status === "canceled") {
          N("The recycling bin was not emptied.");
          return;
        }
        N(`${le.segmentCount} segment${le.segmentCount === 1 ? "" : "s"} from ${le.sceneCount} scene${le.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (J) {
        N(J.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: Te, removeIncorrectExample: yt, captureTrainingExport: Me, deleteRejectedSegments: Ye, autoAssignPerformers: st, previewDerivedSegments: Ze, closeMaterializeDialog: mt, materializeDerivedSegments: gt, saveTag: Je, moveToBin: dt, emptyRecyclingBin: ht };
}
function Lc(e) {
  const { acceptHistory: t, acquireSaveLock: r, enqueueSave: o, getSaveQueueSnapshot: i, commonActionsRef: a, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: m, history: u, historyRef: b, historySaving: g, horizontalLayoutSize: f, mediaStackHeight: y, mediaStackRef: w, onDetailChange: A, onReload: p, railToggleRef: G, recordHistoryAction: P, savingSegmentId: q, setCollapsedSegmentGroups: W, setEditorLayout: E, setHistorySaving: T, setIncorrectExamples: S, setSaveMessage: k, shotBoundaries: R, timelineDuration: z, video: L, workspaceRef: C } = e;
  async function O($, v, h) {
    var oe, U, ie, N;
    const x = $.type === "segment" ? [$] : $.segments || [], D = (v == null ? void 0 : v.type) === "segment" ? [v] : (v == null ? void 0 : v.segments) || [];
    let ae = h;
    for (const [_, j] of x.entries()) {
      const Z = D[_], xe = ((oe = j.identity) == null ? void 0 : oe.nativeSegmentId) != null || ((U = j.identity) == null ? void 0 : U.published) === !0, pe = ((ie = Z == null ? void 0 : Z.identity) == null ? void 0 : ie.recycleBinItemId) ?? ((N = Z == null ? void 0 : Z.identity) == null ? void 0 : N.itemId);
      let Te = tt(ae.segments, Z == null ? void 0 : Z.identity) || tt(ae.segments, j.identity);
      if (!Te && xe && pe != null && Z.identity.revision != null) {
        const Me = `history-restore:${L.id}:${pe}:${Z.identity.revision}`;
        await Y(`/bin/${pe}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: qe(Me),
            expectedRevision: Z.identity.revision
          })
        }), _e(Me), ae = await p(), Te = ae.segments.find((Ye) => Ye.tagId === j.values.tagId && Ye.startSec === j.values.startSec && Ye.endSec === j.values.endSec);
      }
      if (!Te)
        throw new Error("A segment in this history state no longer exists.");
      if ((Te.nativeSegmentId != null || Te.published === !0) !== xe) {
        if (xe) {
          const Me = Te.recycleBinItemId ?? Te.itemId ?? pe;
          if (Me == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Ye = `history-restore:${L.id}:${Me}:${Te.revision}:${j.values.reviewState ?? "native"}`;
          await Y(`/bin/${Me}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: qe(Ye),
              expectedRevision: Te.revision
            })
          }), _e(Ye);
        } else {
          const Me = `history-bin:${L.id}:${Te.nativeSegmentId}:${Te.updatedAt}:${j.values.reviewState}`;
          await Y(`/videos/${L.id}/segments/${Te.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: qe(Me),
              expectedUpdatedAt: Te.updatedAt,
              reviewState: j.values.reviewState
            })
          }), _e(Me);
        }
        if (ae = await p(), !xe)
          continue;
        if (Te = tt(ae.segments, j.identity) || ae.segments.find((Me) => Me.tagId === j.values.tagId && Me.startSec === j.values.startSec && Me.endSec === j.values.endSec), !Te)
          throw new Error("The restored segment could not be found.");
      }
      const Fe = j.values;
      if (Te.nativeSegmentId == null && Te.itemId != null) {
        const Me = `history-draft-update:${L.id}:${Te.itemId}:${Te.revision}:${Fe.tagId}:${Fe.startSec}:${Fe.endSec ?? "open"}:${Fe.reviewState}`;
        await Y(`/videos/${L.id}/drafts/${Te.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: qe(Me),
            expectedRevision: Te.revision,
            ...Fe
          })
        }), _e(Me);
      } else
        await Y(`/videos/${L.id}/segments/${Te.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Fe, expectedUpdatedAt: Te.updatedAt })
        });
      ae = await p();
    }
    return ae;
  }
  async function H($, v) {
    var h;
    for (const x of $.targets || []) {
      const D = tt(v.segments, x.identity);
      if (!D)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const ae = (h = v.performerSlotRevisions) == null ? void 0 : h[D.id];
      await Y(D.published ? `/videos/${L.id}/segments/${D.nativeSegmentId}/slots` : `/videos/${L.id}/drafts/${D.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: ae,
          assignments: x.assignments
        })
      }), v = await p();
    }
    return v;
  }
  async function X($, v, h) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let x = v, D = await Y(`/videos/${L.id}/incorrect-examples`);
    const ae = (oe) => D.find((U) => {
      var ie;
      return U.id === oe.exampleId || ((ie = oe.collectedIdentity) == null ? void 0 : ie.itemId) != null && U.itemId === oe.collectedIdentity.itemId;
    });
    for (const [oe, U] of ($.entries || []).entries()) {
      const ie = `history-feedback:${L.id}:${h.action.sequence}:${h.direction}:${oe}`, N = ae(U);
      if ($.collected && N) {
        _e(ie);
        continue;
      }
      let _;
      if ($.collected) {
        const j = tt(
          x.segments,
          U.collectedIdentity
        ) || tt(
          x.segments,
          U.originalIdentity
        );
        if (!j)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const Z = j.nativeSegmentId != null;
        _ = await Y(`/videos/${L.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: qe(ie),
            nativeSegmentId: Z ? j.nativeSegmentId : null,
            itemId: Z ? null : j.itemId,
            expectedUpdatedAt: Z ? j.updatedAt : null,
            expectedRevision: Z ? null : j.revision
          })
        });
      } else {
        if (!N) {
          _e(ie);
          continue;
        }
        _ = await Y(
          `/videos/${L.id}/incorrect-examples/${N.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: qe(ie),
              expectedExampleRevision: N.revision,
              expectedRepresentationRevision: N.representationRevision
            })
          }
        );
      }
      _e(ie), x = wr(
        x,
        _.editorDelta
      ), D = await Y(
        `/videos/${L.id}/incorrect-examples`
      );
    }
    return S(D), x;
  }
  async function me($, v, h = []) {
    const x = $.state;
    if (!s && ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")) {
      const ae = `basic-history:${L.id}:${b.current.revision}:${$.action.sequence}:${$.direction}`, oe = await Y(`/videos/${L.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: qe(ae),
          expectedHistoryRevision: b.current.revision,
          actionSequence: $.action.sequence,
          direction: $.direction
        })
      });
      return t(oe.history), h.push(ae), p();
    }
    const D = $.direction === "backward" ? $.action.afterState : $.action.beforeState;
    if ((x == null ? void 0 : x.type) === "composite") {
      let ae = v;
      const oe = (D == null ? void 0 : D.type) === "composite" ? D.states || [] : [];
      for (const [U, ie] of (x.states || []).entries()) {
        const N = oe[U];
        ae = await me({
          ...$,
          state: ie,
          action: {
            ...$.action,
            beforeState: $.direction === "backward" ? ie : N,
            afterState: $.direction === "backward" ? N : ie
          }
        }, ae, h);
      }
      return ae;
    }
    if ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")
      return O(
        x,
        D,
        v
      );
    if ((x == null ? void 0 : x.type) === "performerSlots")
      return H(x, v);
    if ((x == null ? void 0 : x.type) === "incorrectExamples")
      return X(x, v, $);
    if ((x == null ? void 0 : x.type) === "shots") {
      const ae = Yn(v.shotBoundaries || []), oe = await Y(`/videos/${L.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: qe(`history-shots:${L.id}:${ae}:${x.fingerprint}`),
          expectedFingerprint: ae,
          boundaries: x.boundaries
        })
      });
      return { ...v, shotBoundaries: oe };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function he($) {
    if (g || $ === u.cursorSequence) return;
    if (q != null) {
      k("Finish the pending saves before restoring history.");
      return;
    }
    if (ya(u, $).length === 0) return;
    const h = o({
      kind: "history",
      lockId: -1,
      exclusive: !0,
      run: (x) => ce(x.detail, $)
    });
    if (!h) {
      k("Finish the pending saves before restoring history.");
      return;
    }
    await h.done;
  }
  async function ce($, v) {
    var x;
    const h = ya(b.current, v);
    if (h.length !== 0) {
      T(!0), k(`Restoring ${h.length} history ${h.length === 1 ? "action" : "actions"}…`);
      try {
        let D = $;
        const ae = [];
        for (const U of h)
          D = await me(
            U,
            D,
            ae
          );
        const oe = s ? await Y(`/videos/${L.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: b.current.revision,
            targetSequence: v
          })
        }) : b.current;
        ae.forEach(_e), t(oe), await p(), k("History restored.");
      } catch (D) {
        D.status === 409 && ((x = D.payload) != null && x.current) && t(D.payload.current), await p(), k(D.message || "Unable to restore editor history.");
      } finally {
        T(!1);
      }
    }
  }
  function M($) {
    E((v) => ({ ...v, timelineRatio: go($, y) }));
  }
  function re($) {
    var x, D;
    const v = (x = w.current) == null ? void 0 : x.getBoundingClientRect();
    if (!v) return;
    const h = ((D = a.current) == null ? void 0 : D.offsetHeight) || 0;
    M(Vs(
      $.clientY,
      v.top + h,
      Math.max(0, v.height - h)
    ));
  }
  function de($) {
    $.currentTarget.setPointerCapture($.pointerId), re($);
  }
  function Q($) {
    $.currentTarget.hasPointerCapture($.pointerId) && re($);
  }
  function ue($) {
    const v = $.shiftKey ? 0.1 : 0.05;
    let h = null;
    $.key === "ArrowUp" && (h = c.timelineRatio + v), $.key === "ArrowDown" && (h = c.timelineRatio - v);
    const x = mo(y);
    $.key === "Home" && (h = x.minimum), $.key === "End" && (h = x.maximum), h != null && ($.preventDefault(), $.stopPropagation(), M(h));
  }
  function Se($) {
    const v = $ === "detailWidth" ? f.focusRow : f.workspace, h = f.workspace > 0 ? eo(f.workspace, 600) : 560, x = ln(c.markerRailWidth, h), D = $ === "detailWidth" ? 344 + (c.markerRailOpen ? x + 24 : 0) : 600;
    return v > 0 ? eo(v, D) : 560;
  }
  function te($, v) {
    E((h) => ({ ...h, [$]: ln(v, Se($)) }));
  }
  function ve($, v) {
    var x, D;
    const h = v === "detailWidth" ? (x = m.current) == null ? void 0 : x.getBoundingClientRect() : (D = C.current) == null ? void 0 : D.getBoundingClientRect();
    h && te(v, v === "detailWidth" ? $.clientX - h.left : h.right - $.clientX);
  }
  function ne($, v) {
    const h = Se($), x = ln(c[$], h);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": v,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(h),
      "aria-valuenow": Math.round(x),
      "aria-valuetext": `${Math.round(x)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (D) => {
        D.currentTarget.setPointerCapture(D.pointerId), ve(D, $);
      },
      onPointerMove: (D) => {
        D.currentTarget.hasPointerCapture(D.pointerId) && ve(D, $);
      },
      onKeyDown: (D) => {
        const ae = D.shiftKey ? 40 : 16;
        let oe = null;
        D.key === "ArrowLeft" && (oe = $ === "detailWidth" ? -ae : ae), D.key === "ArrowRight" && (oe = $ === "detailWidth" ? ae : -ae);
        let U = oe == null ? null : x + oe;
        D.key === "Home" && (U = 240), D.key === "End" && (U = h), U != null && (D.preventDefault(), D.stopPropagation(), te($, U));
      },
      onDoubleClick: () => te($, Mt[$]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function V() {
    E(($) => ({ ...$, markerRailOpen: !$.markerRailOpen })), requestAnimationFrame(() => {
      var $;
      return ($ = G.current) == null ? void 0 : $.focus({ preventScroll: !0 });
    });
  }
  function be($) {
    W((v) => v.includes($) ? v.filter((h) => h !== $) : rn([...v, $]));
  }
  function I($, v = !0, h = l) {
    const x = i().running != null, D = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (ae) => ee(ae.detail, $, v, h)
    });
    return D ? (x && k($ === "split" ? "Shot boundary queued…" : "Shot merge queued…"), D.done.then((ae) => ae.value ?? null)) : (k("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function ee($, v, h, x) {
    var ie;
    const D = ($ == null ? void 0 : $.shotBoundaries) || [], ae = Number((ie = L.videoFile) == null ? void 0 : ie.duration) || z, oe = Yn(D), U = `shot-${v}:${L.id}:${x.toFixed(3)}:${ae.toFixed(3)}:${oe}`;
    k(v === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const N = await Y(`/videos/${L.id}/shot-boundaries/${v}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: qe(U), timeSec: x })
      });
      return _e(U), A((_) => ({ ..._, shotBoundaries: N }), L.id), h && await P(
        "shots.update",
        v === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: D,
          fingerprint: oe
        },
        {
          type: "shots",
          boundaries: N,
          fingerprint: Yn(N)
        }
      ), k(v === "split" ? "Shot boundary added." : "Shots merged."), N;
    } catch (N) {
      return k(N.message || "Unable to edit shot boundaries."), null;
    }
  }
  return { applySegmentHistoryState: O, applyPerformerSlotHistoryState: H, applyHistoryState: me, restoreHistoryTarget: he, updateTimelineRatio: M, updateTimelineRatioFromPointer: re, handleSeparatorPointerDown: de, handleSeparatorPointerMove: Q, handleSeparatorKeyDown: ue, panelWidthMaximum: Se, updatePanelWidth: te, handlePanelSeparatorPointer: ve, panelSeparatorProps: ne, toggleSegmentRail: V, toggleSegmentGroup: be, mutateShotBoundary: I };
}
function Fc(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: m, emptyRecyclingBin: u, lineage: b, mediaDuration: g, mergeSelectedSwimlane: f, moveToBin: y, mutateShotBoundary: w, openPublishApprovedDialog: A, playbackControlsRef: p, playbackShortcutConfig: G, saveSelectedReviewState: P, seekRef: q, segmentGroupKeys: W, selectSegment: E, selectedSegment: T, selectedSegmentGroupForSegment: S, selectedSegmentGroupKey: k, selectedSegments: R, setCollapsedSegmentGroups: z, setIncorrectExamplesOpen: L, setQuickSearchOpen: C, setSaveMessage: O, setSelectedSegmentGroupKey: H, setTagEditing: X, setTimelineZoom: me, shotBoundaries: he, slotButtonRef: ce, splitSegment: M, swimlanes: re, timelineDuration: de, toggleIncorrectExample: Q, toggleSegmentGroup: ue, updateTimelineRatio: Se, videoFrameRate: te, visibleSegments: ve } = e;
  function ne(I) {
    var ee, $;
    (ee = p.current) == null || ee.pause(), ($ = p.current) == null || $.seekBy(Al(I, te));
  }
  function V(I, ee) {
    if (R.length > 1 && gl(I.id))
      return;
    let $ = null;
    I.id === "video.playPause" && ($ = () => {
      var v;
      return (v = p.current) == null ? void 0 : v.toggle();
    }), I.id === "video.seekSmallBackward" && ($ = () => {
      var v;
      return (v = p.current) == null ? void 0 : v.seekBy(-G.smallSeekTime);
    }), I.id === "video.seekSmallForward" && ($ = () => {
      var v;
      return (v = p.current) == null ? void 0 : v.seekBy(G.smallSeekTime);
    }), I.id === "video.seekMediumBackward" && ($ = () => {
      var v;
      return (v = p.current) == null ? void 0 : v.seekBy(-G.mediumSeekTime);
    }), I.id === "video.seekMediumForward" && ($ = () => {
      var v;
      return (v = p.current) == null ? void 0 : v.seekBy(G.mediumSeekTime);
    }), I.id === "video.seekLongBackward" && ($ = () => {
      var v;
      return (v = p.current) == null ? void 0 : v.seekBy(-G.longSeekTime);
    }), I.id === "video.seekLongForward" && ($ = () => {
      var v;
      return (v = p.current) == null ? void 0 : v.seekBy(G.longSeekTime);
    }), I.id === "video.playSelected" && T && ($ = () => {
      var v;
      (v = q.current) == null || v.call(q, T.startSec, !0), requestAnimationFrame(() => {
        var h;
        return (h = m.current) == null ? void 0 : h.focus({ preventScroll: !0 });
      });
    }), (I.id === "video.playPreviousSegment" || I.id === "video.playNextSegment") && ($ = () => {
      var h;
      const v = io(
        re,
        T == null ? void 0 : T.id,
        I.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !v || v.id === (T == null ? void 0 : T.id) || (E(v, { focusEditor: !0, seekToSegment: !1 }), (h = q.current) == null || h.call(q, v.startSec, !0));
    }), I.id.startsWith("video.seekPercent") && ($ = () => {
      var h;
      const v = Number(I.id.slice(17)) / 10;
      (h = q.current) == null || h.call(q, dl(g ?? de, v), !1);
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
      return (v = q.current) == null ? void 0 : v.call(q, de, !1);
    }), I.id.startsWith("video.frame") && ($ = () => {
      const v = I.id.includes("Small") ? "small" : I.id.includes("Medium") ? "medium" : "long", h = G[`${v}FrameStep`] * (I.id.endsWith("Backward") ? -1 : 1);
      ne(h);
    }), I.id.startsWith("navigation.swimlane") && ($ = () => {
      const v = I.id.slice(19).toLowerCase(), h = io(re, T == null ? void 0 : T.id, v, s);
      h && E(h, { focusEditor: !0, seekToSegment: !1 });
    }), (I.id === "navigation.extendSwimlaneLeft" || I.id === "navigation.extendSwimlaneRight") && ($ = () => {
      const v = Cd(
        t,
        T == null ? void 0 : T.id,
        I.id.endsWith("Left") ? "left" : "right"
      );
      v && E(v.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: v.segmentIds
      });
    }), (I.id === "navigation.segmentGroupUp" || I.id === "navigation.segmentGroupDown") && ($ = () => {
      const v = $d(
        W,
        k ?? S,
        I.id.endsWith("Up") ? -1 : 1
      );
      v && H(v);
    }), (I.id === "navigation.previousAtPlayhead" || I.id === "navigation.nextAtPlayhead") && ($ = () => {
      const v = Js(ve, s, I.id === "navigation.previousAtPlayhead" ? -1 : 1, T == null ? void 0 : T.id);
      v && E(v, { focusEditor: !0, seekToSegment: !1 });
    }), I.id === "navigation.nearestInCurrentSwimlane" && ($ = () => {
      const v = js(
        re,
        T == null ? void 0 : T.id,
        s
      );
      v && E(v, { focusEditor: !0, seekToSegment: !1 });
    }), I.id.includes("Unreviewed") && ($ = () => {
      const v = Ir(
        re,
        T == null ? void 0 : T.id,
        I.id.startsWith("navigation.previous") ? -1 : 1,
        I.id.endsWith("Global")
      );
      v && E(v, { focusEditor: !ee.preserveFocus, seekToSegment: !1 });
    }), (I.id === "navigation.nextTouchingPlayhead" || I.id === "navigation.previousTouchingPlayhead") && ($ = () => {
      const v = Fs(re, s, I.id === "navigation.previousTouchingPlayhead" ? -1 : 1, T == null ? void 0 : T.id);
      v && E(v, { focusEditor: !0, seekToSegment: !1 });
    }), I.id === "navigation.quickSearch" && ($ = () => C(!0)), (I.id === "navigation.previousShot" || I.id === "navigation.nextShot") && ($ = () => {
      var h;
      const v = Tl(he, s, I.id === "navigation.previousShot" ? -1 : 1);
      v && ((h = q.current) == null || h.call(q, v.startSec, !1));
    }), I.id === "shot.split" && ($ = () => w("split")), I.id === "shot.merge" && ($ = () => w("merge")), I.id === "marker.create" && ($ = () => a()), I.id === "marker.duplicate" && ($ = () => d(!1)), I.id === "marker.duplicateAtPlayhead" && ($ = () => d(!0)), I.id === "marker.split" && ($ = () => M()), I.id === "marker.editTag" && ($ = () => {
      var v;
      if (R.length > 1 && R.some((h) => h.isDerived)) {
        O("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((v = b.data) != null && v.tagReadOnly) {
        O("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      X(!0);
    }), I.id === "marker.setStart" && T && ($ = () => r(s, T.endSec)), I.id === "marker.setEnd" && T && ($ = () => r(T.startSec, s)), I.id === "marker.copyTiming" && T && ($ = () => {
      O(tc(T) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), I.id === "marker.pasteTiming" && T && ($ = () => {
      const v = ec();
      if (!v) {
        O("No copied segment timing is available.");
        return;
      }
      r(v.startSec, v.endSec);
    }), I.id === "marker.mergeSelection" && ($ = () => f()), I.id === "marker.moveToBin" && ($ = () => y()), I.id === "marker.toggleIncorrectExample" && T && ($ = () => Q()), I.id === "marker.openIncorrectExamples" && ($ = () => L(!0)), I.id === "markerGroup.toggleCollapse" && k && ($ = () => ue(k)), I.id === "markerGroup.toggleAll" && ($ = () => z((v) => Id(v, W))), I.id === "marker.assignSlots" && ($ = () => {
      var v;
      return (v = ce.current) == null ? void 0 : v.click();
    }), I.id === "navigation.zoomIn" && ($ = () => me((v) => Cr(v + 0.5))), I.id === "navigation.zoomOut" && ($ = () => me((v) => Cr(v - 0.5))), I.id === "navigation.resetZoom" && ($ = () => me(1)), I.id === "navigation.centerPlayhead" && ($ = () => {
      var v;
      return (v = o.current) == null ? void 0 : v.call(o);
    }), I.id === "layout.growSwimlanes" && ($ = () => Se(c.timelineRatio + 0.05)), I.id === "layout.shrinkSwimlanes" && ($ = () => Se(c.timelineRatio - 0.05)), I.id === "marker.confirm" && T && ($ = () => P("approved")), I.id === "system.publishApproved" && ($ = () => A(ee.target)), I.id === "marker.reject" && T && ($ = () => P("rejected")), I.id === "system.emptyBin" && ($ = () => u()), I.id === "system.deleteRejected" && ($ = () => l()), $ && $();
  }
  function be(I, ee) {
    const $ = nr.find((v) => v.id === I);
    $ && Tn($, i) && V($, ee);
  }
  return {
    executeShortcutById: be,
    stepVideoFrame: (I) => ne(I < 0 ? -1 : 1)
  };
}
function Aa(e) {
  return e === !0;
}
function Ra() {
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
function jc(e, t, r = !1, o = 0, i = "", a = () => () => {
}) {
  const [s, l] = K(null), [d, c] = K(null), [m, u] = K(""), [b, g] = K({
    busy: !1,
    reviewState: null,
    error: ""
  }), f = fe(null);
  async function y(p) {
    const G = a("import", -1);
    if (!G) {
      g({ busy: !1, reviewState: null, error: "Wait for the current save to finish before importing Cove segments." });
      return;
    }
    g({ busy: !0, reviewState: p, error: "" });
    try {
      await Y(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: ao(), reviewState: p })
      }), await t(), g({ busy: !1, reviewState: null, error: "" });
    } catch (P) {
      g({
        busy: !1,
        reviewState: null,
        error: P.message || "Unable to import Cove segments."
      });
    } finally {
      G();
    }
  }
  async function w(p) {
    try {
      const G = await Y(`/videos/${e}/analysis-runs`, {
        signal: p.signal
      });
      if (!p.isActive()) return null;
      const P = (G == null ? void 0 : G[0]) || null;
      return l(P), (P == null ? void 0 : P.status) === "completed" && f.current !== P.id && (f.current = P.id, await t()), ((P == null ? void 0 : P.status) === "failed" || (P == null ? void 0 : P.status) === "cancelled") && u(P.errorMessage || "Video analysis did not complete."), P;
    } catch (G) {
      return p.isActive() && G.name !== "AbortError" && u(G.message || "Unable to load video analysis status."), null;
    }
  }
  async function A(p = null) {
    u("");
    const G = p || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), P = G.includes("omnishotcut") && o > 0;
    if (!(P && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const q = await Y(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: G,
            replaceShotBoundaries: P,
            expectedShotBoundaryFingerprint: P ? i : null
          })
        });
        l(q);
      } catch (q) {
        u(q.message || "Unable to start video analysis.");
      }
  }
  return ye(() => {
    if (!Aa(r)) {
      l(null), c(null), u("");
      return;
    }
    const p = Ra();
    return w(p), Y("/analysis/status", { signal: p.signal }).then((G) => {
      p.isActive() && (c(G), G.configured || u(""));
    }).catch((G) => {
      p.isActive() && G.name !== "AbortError" && u(G.message || "Unable to check video analysis readiness.");
    }), p.dispose;
  }, [e, r]), ye(() => {
    if (!Aa(r) || (s == null ? void 0 : s.status) !== "queued" && (s == null ? void 0 : s.status) !== "running") return;
    const p = Ra();
    let G = setTimeout(async function P() {
      await w(p), p.isActive() && (G = setTimeout(P, 2500));
    }, 2500);
    return () => {
      clearTimeout(G), p.dispose();
    };
  }, [s == null ? void 0 : s.id, s == null ? void 0 : s.status, r]), {
    analysisError: m,
    analysisRun: s,
    analysisStatus: d,
    importNativeSegments: y,
    nativeImportState: b,
    startFullAnalysis: A
  };
}
const Jn = Object.freeze([]);
function Bc(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Gc({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var Go, Uo, Ko, zo, Ho, qo;
  const m = fe(null), [u, b] = K(null), [g, f] = K([]), y = fe(null), w = fe(null), A = fe([]), p = fe(null), [G, P] = K(() => Lt({})), [q, W] = K(!1), [E, T] = K(cl), [S, k] = K(0), R = fe(null), [z] = K(() => jd({
    getContext: () => R.current,
    drainAfterSettle: !1
  })), L = Wl(z.subscribe, z.getSnapshot), C = Ai(L), O = (F, se) => z.acquire({ kind: F, lockId: se }), H = (F) => z.enqueue(F), X = (F) => z.stableIdentity(F), me = fe(!1);
  ye(() => (me.current = !0, () => {
    me.current = !1, queueMicrotask(() => {
      me.current || z.dispose();
    });
  }), []);
  const he = (F) => z.cancel(F), ce = (F, se) => z.retarget(F, se), M = z.getSnapshot, [re, de] = _l(_d, []), [Q, ue] = K(""), [Se, te] = K(""), [ve, ne] = K(""), [V, be] = K(1), [I, ee] = K(Yd), [$, v] = K(0), [h, x] = K({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [D, ae] = K(Yt), oe = fe(Yt), [U, ie] = K(!1), [N, _] = K(!1), [j, Z] = K(!1), xe = fe(!1);
  xe.current = j;
  const [pe, Te] = K(null), [yt, Fe] = K(!1), [Me, Ye] = K(null), [st, lt] = K(null), Ze = fe(null), [mt, gt] = K(!1), [Ue, Je] = K(""), Ve = fe(null), ze = fe(null), dt = fe(!1), [ht, J] = K(Qd), [le, Ne] = K(null), [Ae, ke] = K(!1), [Xe, je] = K(!1), [Qe, Ie] = K(!1), [Oe, He] = K(!1), [Ee, Le] = K(!1), [et, we] = K(""), {
    analysisError: Pe,
    analysisRun: De,
    analysisStatus: Dt,
    importNativeSegments: rt,
    nativeImportState: pt,
    startFullAnalysis: vt
  } = jc(
    e.video.id,
    o,
    l,
    ((Go = e.shotBoundaries) == null ? void 0 : Go.length) || 0,
    Yn(e.shotBoundaries || []),
    (F, se) => z.acquire({ kind: F, lockId: se })
  ), [at, Ce] = K(!1), [$e, Ke] = K(null), [kt, ot] = K(l), [Zt, $t] = K(0), [Ft, Ot] = K(!1), [on, mn] = K(""), [an, Dr] = K(null), Mn = fe(null), En = fe(null), gn = fe(!1), [sn, pn] = K([]), [or, Or] = K(!1), [ar, Dn] = K(null), fn = Vd(), yn = fe(null), ir = fe(null), bn = fe(null), Pr = fe(s), On = fe(null), Pn = fe(null), Xt = fe(null), Ln = fe(null), Fn = fe(null), wt = fe(null), sr = fe(null), jt = fe(null), lr = fe(null), jn = fe(null), hn = fe(null), Bn = fe(null), Lr = fe(-1e12), Fr = fe(null), vn = fe(null), [Gn, xn] = K({ scrollTop: 0, height: 512 });
  ye(() => {
    if (!at || Ft || !on) return;
    const F = requestAnimationFrame(() => {
      var se;
      return (se = En.current) == null ? void 0 : se.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(F);
  }, [at, Ft, on]), ye(() => {
    if (!gn.current || at || kt) return;
    const F = requestAnimationFrame(() => {
      var se;
      (se = Mn.current) == null || se.focus({ preventScroll: !0 }), gn.current = !1;
    });
    return () => cancelAnimationFrame(F);
  }, [at, kt]);
  const nt = e.video, xt = e.segments || Jn, bt = We(() => JSON.stringify({
    segments: xt.map((F) => [
      F.id,
      F.itemId,
      F.nativeSegmentId,
      F.tagId,
      F.startSec,
      F.endSec,
      F.reviewState,
      F.published,
      F.sourceKey,
      F.sourceRunId,
      F.confidence,
      F.revision,
      F.updatedAt
    ]),
    performerSlots: (e.performerSlots || Jn).map((F) => [
      F.segmentId,
      F.slotDefinitionId,
      F.performerId,
      F.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [xt, e.performerSlots, e.itemMetadata]);
  ye(() => {
    if (!l) {
      Ke(null), ot(!1);
      return;
    }
    if (C != null) {
      ot(!0);
      return;
    }
    let F = !0;
    ot(!0);
    const se = setTimeout(() => {
      Y(`/videos/${nt.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Ge) => {
        F && (Ke(Ge), mn(""));
      }).catch((Ge) => {
        F && (Ke(null), mn(Ge.message || "Unable to preview derived segments."));
      }).finally(() => {
        F && ot(!1);
      });
    }, 150);
    return () => {
      F = !1, clearTimeout(se);
    };
  }, [l, nt.id, bt, Zt, C]);
  const dr = () => $t((F) => F + 1), zt = e.segmentGroups || Jn, Tt = e.performerSlots || Jn, cr = l && e.performerSlotsAvailable !== !1, Vt = We(
    () => (e.performerCandidates || []).filter((F) => F.isVideoPerformer),
    [e.performerCandidates]
  ), Un = e.shotBoundaries || Jn, Sn = We(
    () => ki(Tt),
    [Tt]
  ), Kn = We(
    () => xt.map((F) => {
      const se = Sn.get(F.id) || [];
      return {
        ...F,
        slots: se,
        assignment: se.every((Ge) => Ge.performerId == null) ? Ul(se, Vt) : null
      };
    }).filter((F) => F.slots.length > 0 && F.assignment != null),
    [xt, Sn, Vt]
  ), zn = Number((Uo = nt.videoFile) == null ? void 0 : Uo.frameRate) > 0 ? Number(nt.videoFile.frameRate) : 30;
  function Hn() {
    const F = xe.current;
    Z(!1), F && requestAnimationFrame(() => {
      var se;
      return (se = wt.current) == null ? void 0 : se.focus({ preventScroll: !0 });
    });
  }
  function jr() {
    C == null && (Bn.current = null, Fe(!1), ue(""), requestAnimationFrame(() => {
      var F;
      return (F = wt.current) == null ? void 0 : F.focus({ preventScroll: !0 });
    }));
  }
  function qn() {
    W(!1), requestAnimationFrame(() => {
      var F, se;
      (F = jt.current) != null && F.isConnected ? jt.current.focus({ preventScroll: !0 }) : (se = wt.current) == null || se.focus({ preventScroll: !0 });
    });
  }
  ye(() => {
    hn.current === u ? (hn.current = null, Z(!0)) : Z(!1);
  }, [u]), ye(() => {
    var se;
    if (!j) return;
    const F = (se = jn.current) == null ? void 0 : se.querySelector("input");
    document.activeElement !== F && (F == null || F.focus({ preventScroll: !0 }), F == null || F.select());
  }, [j, u]), ye(() => {
    var se;
    if (j) return;
    const F = (se = wt.current) == null ? void 0 : se.ownerDocument;
    F && F.activeElement === F.body && wt.current.focus({ preventScroll: !0 });
  }, [j]), ye(() => {
    var Ge, ct, Bt;
    const F = dn(
      Wr(
        e.segments,
        e.performerSlots || [],
        Lt({}),
        l && E,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), se = ((Ge = e.segments.find((Nn) => Nn.id === s)) == null ? void 0 : Ge.id) ?? ((ct = Za(F)) == null ? void 0 : ct.id) ?? null;
    b(se), f(se == null ? [] : [se]), w.current = se, A.current = [], Ne(Gt(F, se)), P(Lt({})), W(!1), Bn.current = null, Fe(!1), be(1), ue(""), ae(Yt), oe.current = Yt, ie(!1), (Bt = wt.current) == null || Bt.focus({ preventScroll: !0 });
  }, [nt.id, s]), ye(() => {
    const F = new AbortController();
    return Y(`/videos/${nt.id}/incorrect-examples`, { signal: F.signal }).then(pn).catch((se) => {
      se.name !== "AbortError" && pn([]);
    }), () => F.abort();
  }, [nt.id, d == null ? void 0 : d.effectiveMode]), ye(() => {
    const F = new AbortController();
    return Y(`/videos/${nt.id}/history`, { signal: F.signal }).then((se) => {
      const Ge = se || Yt;
      oe.current = Ge, ae(Ge);
    }).catch((se) => {
      se.name !== "AbortError" && ue(se.message || "Unable to load editor history.");
    }), () => F.abort();
  }, [nt.id]), ye(() => {
    Xd(I);
  }, [I.timelineRatio, I.markerRailOpen, I.detailWidth, I.markerRailWidth, I.swimlaneTitleWidth]), ye(() => {
    Zd(ht);
  }, [ht]), ye(() => {
    ul(E);
  }, [E]), ye(() => {
    const F = Pn.current;
    if (!a || !F || typeof ResizeObserver > "u") return;
    const se = () => {
      var Bt;
      const ct = Math.max(0, F.clientHeight - (((Bt = Xt.current) == null ? void 0 : Bt.offsetHeight) || 0));
      v(ct), ee((Nn) => {
        const _o = go(Nn.timelineRatio, ct);
        return _o === Nn.timelineRatio ? Nn : { ...Nn, timelineRatio: _o };
      });
    }, Ge = new ResizeObserver(se);
    return Ge.observe(F), Xt.current && Ge.observe(Xt.current), se(), () => Ge.disconnect();
  }, [a]), ye(() => {
    if (!fn || typeof ResizeObserver > "u") return;
    const F = Fn.current, se = Ln.current;
    if (!F || !se) return;
    const Ge = () => x({
      workspace: F.clientWidth,
      focusRow: se.clientWidth,
      focusRowHeight: se.clientHeight
    }), ct = new ResizeObserver(Ge);
    return ct.observe(F), ct.observe(se), Ge(), () => ct.disconnect();
  }, [fn, I.markerRailOpen]);
  const St = We(
    () => Hd(xt, re),
    [xt, re]
  );
  pa(() => {
    Oi(re, e) !== re && de({ type: "prune", detail: e });
  }, [e, re]);
  const At = We(
    () => xa(
      Wr(
        St,
        Tt,
        G,
        l && E,
        zt
      ),
      sn,
      !0
    ),
    [
      St,
      Tt,
      G,
      E,
      zt,
      l,
      sn
    ]
  ), _n = Object.fromEntries(It.map((F) => [F, At.filter((se) => se.reviewState === F).length])), Br = xa(
    Wr(
      St,
      Tt,
      { ...G, reviewStates: It },
      l && E,
      zt
    ),
    sn,
    !0
  ), Gr = Object.fromEntries(It.map((F) => [F, Br.filter((se) => se.reviewState === F).length])), Ur = [...new Set(St.map((F) => F.sourceKey).filter(Boolean))].sort((F, se) => Kt(F).localeCompare(Kt(se))), Kr = el(
    G,
    l && E
  ), ft = We(
    () => dn(At, zt, Tt),
    [At, zt, Tt]
  ), Ht = We(
    () => Nd(ft, ht),
    [ft, ht]
  ), B = rl(
    ft,
    u,
    s,
    {
      visibleLanes: Ht,
      reference: ((Ko = m.current) == null ? void 0 : Ko.videoId) === nt.id ? m.current.reference : null
    }
  );
  ye(() => {
    const F = Sr(ft, B == null ? void 0 : B.id);
    F && (m.current = { videoId: nt.id, reference: F });
  }, [nt.id, B == null ? void 0 : B.id, ft]);
  const Be = We(() => {
    const F = Kd(re);
    return F.length === 0 ? xt : [...xt, ...F];
  }, [xt, re]), ge = B == null ? null : Be.find((F) => F.id === B.id) || B, it = na(Be, na(At, g).map((F) => F.id)), Jt = !l && it.length > 0 && it.every((F) => F.nativeSegmentId != null), qt = At.map((F) => F.id), zr = qt.join("|");
  y.current = (ge == null ? void 0 : ge.id) ?? null;
  const No = Sn.get(ge == null ? void 0 : ge.id) || [], Ui = vo(No), Io = We(
    () => kd(ft, g),
    [ft, g]
  ), ur = We(() => xo(ft), [ft]), Wn = We(
    () => xd(ur, ht),
    [ur, ht]
  ), Ki = We(
    () => Ni(
      Wn.rows,
      Gn.scrollTop,
      Gn.height
    ),
    [Wn, Gn]
  ), zi = Ir(Ht, ge == null ? void 0 : ge.id, -1, !0) != null, Hi = Ir(Ht, ge == null ? void 0 : ge.id, 1, !0) != null, kn = ge ? Gt(ft, ge.id) : null, Hr = wi(ur) ? ur.map((F) => F.key) : [], qi = Hr.join("|"), mr = Math.max(
    0,
    Number((zo = nt.videoFile) == null ? void 0 : zo.duration) || 0,
    ...St.map((F) => Number(F.endSec ?? F.startSec) || 0)
  ), Co = Number((Ho = nt.videoFile) == null ? void 0 : Ho.duration) > 0 ? Number(nt.videoFile.duration) : null;
  D.actions;
  const _i = si();
  ye(() => {
    const F = u === $n ? u : (ge == null ? void 0 : ge.id) ?? null;
    F !== u && b(F);
  }, [ge, u]), ye(() => {
    f((F) => {
      const se = sl(
        F,
        qt,
        (ge == null ? void 0 : ge.id) ?? null
      );
      return se.length === F.length && se.every((Ge, ct) => Ge === F[ct]) ? F : se;
    });
  }, [zr, ge == null ? void 0 : ge.id]);
  const wn = (ge == null ? void 0 : ge.itemId) == null ? null : ((qo = e.itemMetadata) == null ? void 0 : qo[ge.itemId]) || null, Wi = {
    key: (ge == null ? void 0 : ge.itemId) != null ? `item:${ge.itemId}` : (ge == null ? void 0 : ge.nativeSegmentId) != null ? `native:${ge.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (wn == null ? void 0 : wn.provenance) || (ge == null ? void 0 : ge.fieldProvenance) || [] : []
  }, qr = (ge == null ? void 0 : ge.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (wn == null ? void 0 : wn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  ye(() => {
    te(B == null ? "" : String(B.startSec)), ne((B == null ? void 0 : B.endSec) == null ? "" : String(B.endSec));
  }, [B == null ? void 0 : B.id, B == null ? void 0 : B.startSec, B == null ? void 0 : B.endSec]), ye(() => {
    kn && J((F) => $i(F, kn));
  }, [nt.id, s, kn]), ye(() => {
    Ne((F) => Td(Hr, F, kn));
  }, [nt.id, qi, kn]), ye(() => {
    if (!I.markerRailOpen || (ge == null ? void 0 : ge.id) == null) return;
    const F = vn.current, se = Wn.rows.find((Bt) => Bt.kind === "segment" && Bt.segment.id === ge.id);
    if (!F || !se) return;
    const Ge = se.top + se.height;
    let ct = F.scrollTop;
    se.top < F.scrollTop ? ct = se.top : Ge > F.scrollTop + F.clientHeight && (ct = Math.max(0, Ge - F.clientHeight)), ct !== F.scrollTop && (F.scrollTop = ct), xn({ scrollTop: ct, height: F.clientHeight });
  }, [ge == null ? void 0 : ge.id, Wn, I.markerRailOpen]), ye(() => {
    const F = vn.current;
    if (!I.markerRailOpen || !F) return;
    const se = () => xn({
      scrollTop: F.scrollTop,
      height: F.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      se();
      return;
    }
    const Ge = new ResizeObserver(se);
    return Ge.observe(F), se(), () => Ge.disconnect();
  }, [I.markerRailOpen]);
  const { revealSegmentGroupForSelection: $o, replaceSegmentSelection: Vi, selectSegment: To, selectSegmentCollection: Ji, selectAllVideoSegments: Yi } = Dc({
    allSwimlanes: ft,
    editorRef: wt,
    performerSlots: Tt,
    seekRef: yn,
    segmentGroups: zt,
    segments: xt,
    selectedSegmentId: u,
    selectedSegmentIds: g,
    selectionAnchorIdRef: w,
    selectionRangeBaseIdsRef: A,
    setCollapsedSegmentGroups: J,
    setEditorFilters: P,
    setHideDerivedSegments: T,
    setSaveMessage: ue,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: b,
    setSelectedSegmentIds: f
  }), { acceptHistory: _r, recordHistoryAction: gr, mutateSegment: Qi, runSegmentMutation: Zi, completeReview: Xi, createSegment: Ao, splitSegment: Ro, duplicateSegment: Mo, saveTiming: es, applyShortcutTiming: ts } = Wd({
    compatibilityMode: l,
    currentTime: S,
    detail: e,
    editorFilters: G,
    endInput: ve,
    hideDerivedSegments: E,
    historyRef: oe,
    mediaDuration: Co,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: Lr,
    pendingDuplicateRef: Fr,
    pendingFirstSegmentStartSecRef: Bn,
    pendingTagEditSegmentIdRef: hn,
    performerSlots: Tt,
    enqueueSave: H,
    pendingChanges: re,
    retargetSaveTasks: ce,
    replaceSegmentSelection: Vi,
    savingSegmentId: C,
    segments: xt,
    selectedSegment: ge,
    selectedSegmentIdRef: y,
    selectedSegments: it,
    selectionAnchorIdRef: w,
    selectionRangeBaseIdsRef: A,
    setCreatingSegmentId: Te,
    setEditorFilters: P,
    setFirstSegmentTagOpen: Fe,
    setHideDerivedSegments: T,
    setHistory: ae,
    setHistoryOpen: ie,
    setPublishApprovedError: Je,
    setSaveMessage: ue,
    acquireSaveLock: O,
    dispatchPendingChanges: de,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: b,
    setSelectedSegmentIds: f,
    setTagEditing: Z,
    startInput: Se,
    tagEditingRef: xe,
    timelineDuration: mr,
    video: nt
  });
  function Eo(F = null) {
    var ct;
    if (!l || C != null || !xt.some((Bt) => !Bt.published && Bt.reviewState === "approved")) return;
    const se = ((ct = wt.current) == null ? void 0 : ct.ownerDocument) ?? document, Ge = se.activeElement === se.body ? null : se.activeElement;
    ze.current = F != null && F.isConnected && F !== se.body ? F : Ge, Je(""), gt(!0);
  }
  function Do() {
    C == null && (gt(!1), Je(""), requestAnimationFrame(() => {
      Bc(
        ze.current,
        wt.current
      ), ze.current = null;
    }));
  }
  async function ns() {
    await Xi() && Do();
  }
  const { closeMergeConfirmation: rs, mergeSelectedSwimlane: Oo, saveSelectedReviewState: os } = Oc({
    acceptHistory: _r,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: p,
    getSaveQueueSnapshot: M,
    historyRef: oe,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: gr,
    revealSegmentGroupForSelection: $o,
    savingSegmentId: C,
    selectedGroups: Io,
    selectedSegment: ge,
    selectedSegmentIdRef: y,
    selectedSegments: it,
    selectionAnchorIdRef: w,
    selectionRangeBaseIdsRef: A,
    setMergeConfirmation: Ye,
    setSaveMessage: ue,
    acquireSaveLock: O,
    dispatchPendingChanges: de,
    enqueueSave: H,
    stableSaveIdentity: X,
    setSelectedSegmentId: b,
    setSelectedSegmentIds: f,
    video: nt
  }), as = (F) => {
    const se = (F || []).map(Rt);
    z.cancel((Ge) => Ge.kind === "review" && So(Ge.targets, se));
  }, is = z.settledCount();
  pa(() => {
    z.markCommitted(is), R.current = {
      detail: e,
      segments: xt,
      onConflict: r,
      onDetailChange: t,
      onReload: o,
      tagEditing: j,
      selectedSegmentIds: g,
      activeSegmentId: (ge == null ? void 0 : ge.id) ?? null
    };
  }), ye(() => {
    z.poke();
  });
  const { toggleIncorrectExample: ss, removeIncorrectExample: ls, captureTrainingExport: ds, deleteRejectedSegments: Po, autoAssignPerformers: cs, previewDerivedSegments: us, closeMaterializeDialog: ms, materializeDerivedSegments: gs, saveTag: ps, moveToBin: fs, emptyRecyclingBin: ys } = Pc({
    acceptHistory: _r,
    allSwimlanes: ft,
    autoAssignCandidates: Kn,
    autoAssigning: Ee,
    binEmptyingRef: dt,
    canMoveSelectionToBin: Jt,
    closeTagEditing: Hn,
    compatibilityMode: l,
    creatingSegmentId: pe,
    detail: e,
    editorFilters: G,
    editorRef: wt,
    exportingExamples: or,
    hideDerivedSegments: E,
    incorrectExamples: sn,
    lineage: qr,
    materializeButtonRef: Mn,
    materializePreview: $e,
    materializeRestoreFocusRef: gn,
    materializing: Ft,
    mutateSegment: Qi,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: Tt,
    cancelSaveTasks: he,
    dispatchPendingChanges: de,
    enqueueSave: H,
    stableSaveIdentity: X,
    pendingChanges: re,
    runSegmentMutation: Zi,
    recordHistoryAction: gr,
    refreshMaterializationPreview: dr,
    removingExampleId: ar,
    revealSegmentGroupForSelection: $o,
    savingSegmentId: C,
    segmentGroups: zt,
    segments: xt,
    selectedSegment: ge,
    selectedSegmentIdRef: y,
    selectedSegments: it,
    selectionAnchorIdRef: w,
    selectionRangeBaseIdsRef: A,
    setAutoAssignError: we,
    setAutoAssignOpen: He,
    setAutoAssigning: Le,
    setEditorFilters: P,
    setExportingExamples: Or,
    setHideDerivedSegments: T,
    setIncorrectExamples: pn,
    setMaterializeError: mn,
    setMaterializeLoading: ot,
    setMaterializeOpen: Ce,
    setMaterializePreview: Ke,
    setMaterializing: Ot,
    setRemovingExampleId: Dn,
    setRejectedDeletionPreview: lt,
    setSaveMessage: ue,
    acquireSaveLock: O,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: b,
    setSelectedSegmentIds: f,
    swimlanes: Ht,
    video: nt
  }), { restoreHistoryTarget: bs, updateTimelineRatio: Lo, handleSeparatorPointerDown: hs, handleSeparatorPointerMove: vs, handleSeparatorKeyDown: xs, panelWidthMaximum: Fo, panelSeparatorProps: Ss, toggleSegmentRail: ks, toggleSegmentGroup: jo, mutateShotBoundary: ws } = Lc({
    acceptHistory: _r,
    compatibilityMode: l,
    currentTime: S,
    detail: e,
    editorLayout: I,
    focusRowRef: Ln,
    history: D,
    historyRef: oe,
    historySaving: N,
    horizontalLayoutSize: h,
    mediaStackHeight: $,
    mediaStackRef: Pn,
    commonActionsRef: Xt,
    onDetailChange: t,
    onReload: o,
    railToggleRef: sr,
    recordHistoryAction: gr,
    savingSegmentId: C,
    setCollapsedSegmentGroups: J,
    setEditorLayout: ee,
    setHistorySaving: _,
    setIncorrectExamples: pn,
    setSaveMessage: ue,
    acquireSaveLock: O,
    enqueueSave: H,
    getSaveQueueSnapshot: M,
    shotBoundaries: Un,
    timelineDuration: mr,
    video: nt,
    workspaceRef: Fn
  }), { executeShortcutById: Bo, stepVideoFrame: Ns } = Fc({
    allSwimlanes: ft,
    applyShortcutTiming: ts,
    centerTimelineRef: On,
    compatibilityMode: l,
    createSegment: Ao,
    currentTime: S,
    deleteRejectedSegments: Po,
    duplicateSegment: Mo,
    editorLayout: I,
    editorRef: wt,
    emptyRecyclingBin: ys,
    lineage: qr,
    mediaDuration: Co,
    mergeSelectedSwimlane: Oo,
    moveToBin: fs,
    mutateShotBoundary: ws,
    openPublishApprovedDialog: Eo,
    playbackControlsRef: ir,
    playbackShortcutConfig: _i,
    saveSelectedReviewState: os,
    seekRef: yn,
    segmentGroupKeys: Hr,
    selectSegment: To,
    selectedSegment: ge,
    selectedSegmentGroupForSegment: kn,
    selectedSegmentGroupKey: le,
    selectedSegments: it,
    setCollapsedSegmentGroups: J,
    setIncorrectExamplesOpen: Ie,
    setQuickSearchOpen: je,
    setSaveMessage: ue,
    setSelectedSegmentGroupKey: Ne,
    setTagEditing: Z,
    setTimelineZoom: be,
    shotBoundaries: Un,
    slotButtonRef: lr,
    splitSegment: Ro,
    swimlanes: Ht,
    timelineDuration: mr,
    toggleIncorrectExample: ss,
    toggleSegmentGroup: jo,
    updateTimelineRatio: Lo,
    videoFrameRate: zn,
    visibleSegments: At
  });
  bn.current = Bo;
  const Is = We(() => nr.map((F) => ({
    id: F.id,
    enabled: Tn(F, l),
    surface: "local",
    action: (se) => {
      var Ge;
      return (Ge = bn.current) == null ? void 0 : Ge.call(bn, F.id, se);
    }
  })), [l]);
  Ga(co, Is);
  const Cs = mo($), $s = ln(I.markerRailWidth, Fo("markerRailWidth")), Ts = ln(I.detailWidth, Fo("detailWidth"));
  return n(Ec, {
    activeFilterCount: Kr,
    allSwimlanes: ft,
    analysisError: Pe,
    analysisRun: De,
    analysisStatus: Dt,
    approvalFacetCounts: Gr,
    autoAssignCandidates: Kn,
    autoAssignError: et,
    autoAssignOpen: Oe,
    autoAssignPerformers: cs,
    autoAssigning: Ee,
    canMoveSelectionToBin: Jt,
    captureTrainingExport: ds,
    cancelQueuedReviewsForSegments: as,
    removeIncorrectExample: ls,
    rejectedDeletionPreview: st,
    centerTimelineRef: On,
    closeEditorFilters: qn,
    closeFirstSegmentTagDialog: jr,
    closeMaterializeDialog: ms,
    closeMergeConfirmation: rs,
    closePublishApprovedDialog: Do,
    closeTagEditing: Hn,
    collapsedSegmentGroups: ht,
    commonActionsRef: Xt,
    compatibilityMode: l,
    configuringTag: an,
    createSegment: Ao,
    currentTime: S,
    deleteRejectedSegments: Po,
    detail: e,
    detailPanelRef: p,
    detailWidth: Ts,
    duplicateSegment: Mo,
    editorFilters: G,
    editorLayout: I,
    editorRef: wt,
    exportingExamples: or,
    filtersButtonRef: jt,
    filtersOpen: q,
    firstSegmentTagOpen: yt,
    focusRowRef: Ln,
    handleSeparatorKeyDown: xs,
    handleSeparatorPointerDown: hs,
    handleSeparatorPointerMove: vs,
    hideDerivedSegments: E,
    history: D,
    historyOpen: U,
    historySaving: N,
    hasNextUnreviewed: Hi,
    hasPreviousUnreviewed: zi,
    horizontalLayoutSize: h,
    importNativeSegments: rt,
    incorrectExamples: sn,
    incorrectExamplesOpen: Qe,
    removingExampleId: ar,
    lineage: qr,
    markerRailWidth: $s,
    materializeButtonRef: Mn,
    materializeCancelButtonRef: En,
    materializeDerivedSegments: gs,
    materializeError: on,
    materializeLoading: kt,
    materializeOpen: at,
    materializePreview: $e,
    materializing: Ft,
    mediaStackRef: Pn,
    mergeCancelButtonRef: Ze,
    mergeConfirmation: Me,
    mergeSaving: Fd(L, "merge"),
    mergeSelectedSwimlane: Oo,
    nativeImportState: pt,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: Eo,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: Ss,
    pendingInitialSeekRef: Pr,
    performerSlots: Tt,
    performerSlotsAvailable: cr,
    playbackControlsRef: ir,
    previewDerivedSegments: us,
    provenance: Wi,
    provenanceSources: Ur,
    publishApprovedCancelButtonRef: Ve,
    publishApprovedDrafts: ns,
    publishApprovedError: Ue,
    publishApprovedOpen: mt,
    quickSearchOpen: Xe,
    railScrollRef: vn,
    railToggleRef: sr,
    recordHistoryAction: gr,
    restoreHistoryTarget: bs,
    runEditorAction: Bo,
    stepVideoFrame: Ns,
    saveMessage: Q,
    setSaveMessage: ue,
    saveTag: ps,
    saveTiming: es,
    savingSegmentId: C,
    acquireSaveLock: O,
    seekRef: yn,
    segmentGroups: zt,
    segmentRailLayout: Wn,
    segments: St,
    selectAllVideoSegments: Yi,
    selectSegment: To,
    selectSegmentCollection: Ji,
    selectedGroups: Io,
    selectedPerformerSlots: No,
    selectedSegment: B,
    selectedSegmentGroupKey: le,
    selectedSegmentIds: g,
    selectedSegments: it,
    selectedSlotStatus: Ui,
    setAutoAssignError: we,
    setAutoAssignOpen: He,
    setConfiguringTag: Dr,
    setCurrentTime: k,
    setEditorFilters: P,
    setEditorLayout: ee,
    setFiltersOpen: W,
    setHideDerivedSegments: T,
    setHistoryOpen: ie,
    setIncorrectExamplesOpen: Ie,
    setQuickSearchOpen: je,
    setRejectedDeletionPreview: lt,
    setRailViewport: xn,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: b,
    setShortcutsOpen: ke,
    setTimelineZoom: be,
    shotBoundaries: Un,
    shortcutsOpen: Ae,
    slotButtonRef: lr,
    splitLayout: a,
    splitSegment: Ro,
    startFullAnalysis: vt,
    tagEditing: j,
    creatingSegmentId: pe,
    tagSearchRef: jn,
    timelineDuration: mr,
    timelineRatioBounds: Cs,
    timelineZoom: V,
    toggleSegmentGroup: jo,
    toggleSegmentRail: ks,
    updateTimelineRatio: Lo,
    video: nt,
    videoPerformers: Vt,
    visibleCounts: _n,
    visibleSegmentRailRows: Ki,
    visibleSegments: At,
    wideLayout: fn,
    workspaceRef: Fn
  });
}
const Uc = /* @__PURE__ */ new Set(["queued", "running"]);
async function Ma(e, t, r = 4) {
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
function Ea(e, t) {
  return { videoId: e, error: (t == null ? void 0 : t.message) || String(t || "Unable to start Full Scan.") };
}
function Kc() {
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
async function zc(e, t, r, o) {
  const i = [...new Set(e.map(Number).filter((g) => Number.isInteger(g) && g > 0))], a = [...new Set(t)].filter((g) => ["aiTagging", "omnishotcut"].includes(g));
  if (i.length === 0 || a.length === 0)
    return { queuedIds: [], failed: [], cancelled: !1 };
  const s = a.includes("omnishotcut"), l = await Ma(i, async (g) => {
    try {
      const [f, y] = await Promise.all([
        r(`/videos/${g}/analysis-runs`),
        s ? r(`/videos/${g}/editor`) : null
      ]);
      if ((f || []).some((A) => Uc.has(A == null ? void 0 : A.status)))
        throw new Error("A Full Scan is already queued or running.");
      const w = (y == null ? void 0 : y.shotBoundaries) || [];
      return { videoId: g, shotBoundaries: w };
    } catch (f) {
      return Ea(g, f);
    }
  }), d = l.filter((g) => !g.error), c = l.filter((g) => g.error), m = d.filter((g) => g.shotBoundaries.length > 0), u = m.reduce((g, f) => g + f.shotBoundaries.length, 0);
  if (u > 0 && !o(
    `Replace ${u} existing shot ${u === 1 ? "boundary" : "boundaries"} across ${m.length} selected ${m.length === 1 ? "video" : "videos"} when these scans succeed? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
  )) return { queuedIds: [], failed: c, cancelled: !0 };
  const b = await Ma(d, async ({ videoId: g, shotBoundaries: f }) => {
    const y = s && f.length > 0;
    try {
      return await r(`/videos/${g}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: a,
          replaceShotBoundaries: y,
          expectedShotBoundaryFingerprint: y ? Yn(f) : null
        })
      }), { videoId: g };
    } catch (w) {
      return Ea(g, w);
    }
  });
  return {
    queuedIds: b.filter((g) => !g.error).map((g) => g.videoId),
    failed: [...c, ...b.filter((g) => g.error)],
    cancelled: !1
  };
}
function Hc(e = [], t = []) {
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
function qc(e = [], t = "", r = "all") {
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
function _c(e = [], t = []) {
  var g;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((f, y) => (f.sortOrder ?? 0) - (y.sortOrder ?? 0) || Number(f.id) - Number(y.id)).forEach((f, y) => {
    [...f.tags || []].sort((w, A) => (w.sortOrder ?? 0) - (A.sortOrder ?? 0) || Number(w.tagId) - Number(A.tagId)).forEach((w, A) => r.set(Number(w.tagId), {
      key: `group:${f.id}`,
      id: f.id,
      name: f.name,
      sortOrder: f.sortOrder ?? y,
      tagSortOrder: w.sortOrder ?? A
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(f, y) {
    const w = Number(f);
    if (!o.has(w)) {
      const A = r.get(w);
      o.set(w, {
        tagId: w,
        name: y || `Tag ${w}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (A == null ? void 0 : A.key) || "ungrouped",
        segmentGroupId: (A == null ? void 0 : A.id) ?? null,
        segmentGroupName: (A == null ? void 0 : A.name) || "Ungrouped",
        segmentGroupSortOrder: (A == null ? void 0 : A.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (A == null ? void 0 : A.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(w);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((f) => {
    const y = i(f.sourceTagId, f.sourceTagName), w = i(f.derivedTagId, f.derivedTagName);
    y.outgoingRuleCount++, w.incomingRuleCount++;
    const A = `${y.tagId}:${w.tagId}`;
    a.has(A) || a.set(A, {
      id: A,
      sourceTagId: y.tagId,
      derivedTagId: w.tagId,
      rules: [],
      edgeCount: 0
    });
    const p = a.get(A);
    p.rules.push(f), p.edgeCount += Number(f.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((f) => [f.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((f) => {
    var y, w;
    (y = d.get(f.sourceTagId)) == null || y.add(f.derivedTagId), (w = d.get(f.derivedTagId)) == null || w.add(f.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), m = [];
  for (const f of s) {
    if (c.has(f.tagId)) continue;
    const y = [f.tagId], w = [];
    for (c.add(f.tagId); y.length > 0; ) {
      const E = y.shift();
      w.push(E);
      for (const T of d.get(E) || [])
        c.has(T) || (c.add(T), y.push(T));
    }
    const A = new Set(w), p = w.map((E) => o.get(E)), G = l.filter((E) => A.has(E.sourceTagId) && A.has(E.derivedTagId)), P = G.flatMap((E) => E.rules), q = p.filter((E) => E.outgoingRuleCount === 0).sort((E, T) => Nt(E.name, T.name)), W = q.length > 0 ? q : [...p].sort((E, T) => Nt(E.name, T.name));
    m.push({
      id: [...w].sort((E, T) => E - T).join(":"),
      label: W.length > 1 ? `${W[0].name} + ${W.length - 1}` : ((g = W[0]) == null ? void 0 : g.name) || "Derivation component",
      nodes: p,
      connections: G,
      rules: P,
      segmentGroupKeys: [...new Set(p.map((E) => E.segmentGroupKey))],
      materializedEdgeCount: P.reduce(
        (E, T) => E + (Number(T.edgeCount) || 0),
        0
      )
    });
  }
  m.sort((f, y) => y.rules.length - f.rules.length || Nt(f.label, y.label));
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
    f.nodes.forEach((y) => {
      var w;
      return (w = u.get(y.segmentGroupKey)) == null ? void 0 : w.componentIds.add(f.id);
    }), f.rules.forEach((y) => {
      var w, A;
      (w = u.get(o.get(Number(y.sourceTagId)).segmentGroupKey)) == null || w.ruleIds.add(y.id), (A = u.get(o.get(Number(y.derivedTagId)).segmentGroupKey)) == null || A.ruleIds.add(y.id);
    });
  });
  const b = [...u.values()].sort((f, y) => f.sortOrder - y.sortOrder || Nt(f.name, y.name)).map((f) => ({
    ...f,
    ruleCount: f.ruleIds.size,
    componentCount: f.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: m,
    segmentGroups: b
  };
}
function Wc(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const m = new Map(e.nodes.map((S) => [S.tagId, /* @__PURE__ */ new Set()])), u = new Map(e.nodes.map((S) => [S.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((S) => {
    var k, R;
    (k = m.get(S.sourceTagId)) == null || k.add(S.derivedTagId), (R = u.get(S.derivedTagId)) == null || R.add(S.sourceTagId);
  });
  const b = new Map(e.nodes.map((S) => {
    var k;
    return [
      S.tagId,
      ((k = u.get(S.tagId)) == null ? void 0 : k.size) || 0
    ];
  })), g = new Map(e.nodes.map((S) => [S.tagId, 0])), f = e.nodes.filter((S) => b.get(S.tagId) === 0).sort((S, k) => Nt(S.name, k.name)).map((S) => S.tagId), y = /* @__PURE__ */ new Set();
  for (; f.length > 0; ) {
    const S = f.shift();
    if (!y.has(S)) {
      y.add(S);
      for (const k of m.get(S) || [])
        g.set(k, Math.max(g.get(k) || 0, (g.get(S) || 0) + 1)), b.set(k, b.get(k) - 1), b.get(k) === 0 && f.push(k);
    }
  }
  y.size !== e.nodes.length && e.nodes.filter((S) => !y.has(S.tagId)).sort((S, k) => Nt(S.name, k.name)).forEach((S) => g.set(S.tagId, 0));
  const w = Math.max(0, ...g.values()), A = Math.max(
    t,
    240 + w * 296
  ), p = /* @__PURE__ */ new Map();
  e.nodes.forEach((S) => {
    p.has(S.segmentGroupKey) || p.set(S.segmentGroupKey, {
      key: S.segmentGroupKey,
      id: S.segmentGroupId,
      name: S.segmentGroupName,
      sortOrder: S.segmentGroupSortOrder,
      nodes: []
    }), p.get(S.segmentGroupKey).nodes.push(S);
  });
  const G = [...p.values()].sort((S, k) => S.sortOrder - k.sortOrder || Nt(S.name, k.name));
  let P = 28;
  const q = [], W = G.map((S) => {
    const k = /* @__PURE__ */ new Map();
    S.nodes.forEach((O) => {
      const H = g.get(O.tagId) || 0;
      k.has(H) || k.set(H, []), k.get(H).push(O);
    });
    for (const O of k.values())
      O.sort((H, X) => H.segmentGroupTagSortOrder - X.segmentGroupTagSortOrder || Nt(H.name, X.name));
    const R = Math.max(1, ...[...k.values()].map((O) => O.length)), z = R * 58 + (R - 1) * 18, L = 70 + z, C = {
      ...S,
      x: 12,
      y: P,
      width: A - 24,
      height: L
    };
    for (const [O, H] of k.entries()) {
      const X = H.length * 58 + Math.max(0, H.length - 1) * 18, me = (z - X) / 2;
      H.forEach((he, ce) => q.push({
        ...he,
        rank: O,
        x: 28 + O * 296,
        y: P + 34 + 18 + me + ce * 76,
        width: 184,
        height: 58
      }));
    }
    return P += L + 16, C;
  }), E = new Map(q.map((S) => [S.tagId, S])), T = e.connections.map((S) => {
    const k = E.get(S.sourceTagId), R = E.get(S.derivedTagId), z = k.x + k.width, L = k.y + k.height / 2, C = R.x, O = R.y + R.height / 2, H = Math.max(48, (C - z) * 0.48);
    return {
      ...S,
      path: `M ${z} ${L} C ${z + H} ${L}, ${C - H} ${O}, ${C} ${O}`
    };
  });
  return {
    width: A,
    height: Math.max(r, P - 16 + 28),
    nodes: q,
    connections: T,
    groups: W
  };
}
function Vc(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Wc(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), m = 20, u = o, b = c.nodes.map((f) => ({
      ...f,
      x: f.x + m,
      y: f.y + u
    })), g = new Map(b.map((f) => [f.tagId, f]));
    a.push(...b), l.push(...c.groups.map((f) => ({
      ...f,
      componentId: d.id,
      x: f.x + m,
      y: f.y + u
    }))), s.push(...c.connections.map((f) => {
      const y = g.get(f.sourceTagId), w = g.get(f.derivedTagId), A = y.x + y.width, p = y.y + y.height / 2, G = w.x, P = w.y + w.height / 2, q = Math.max(48, (G - A) * 0.48);
      return {
        ...f,
        componentId: d.id,
        path: `M ${A} ${p} C ${A + q} ${p}, ${G - q} ${P}, ${G} ${P}`
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
function Da(e, t = []) {
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
function Jc(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function Yc(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: m, editorRef: u, emptyDraft: b, graph: g, layout: f, listSort: y, materializationOffer: w, materializeOutgoingRules: A, materializeRule: p, message: G, normalizedQuery: P, query: q, refreshConfiguredTag: W, revealEditor: E, rules: T, save: S, segmentGroupKey: k, selectedNode: R, selectedRule: z, selection: L, setConfiguringTag: C, setDraft: O, setListSort: H, setMaterializationOffer: X, setQuery: me, setSegmentGroupKey: he, setSelection: ce, setView: M, sortedVisibleRules: re, sourceSlots: de, sourceSlotsLoading: Q, updateMapping: ue, updateTag: Se, view: te, visibleComponents: ve, visibleRules: ne } = e;
  function V(v) {
    const h = g.nodes.find((D) => D.tagId === Number(v.sourceTagId)), x = g.nodes.find((D) => D.tagId === Number(v.derivedTagId));
    return (h == null ? void 0 : h.segmentGroupKey) === (x == null ? void 0 : x.segmentGroupKey) ? h.segmentGroupKey : "cross-group";
  }
  function be() {
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
          onClick: () => O(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      n("div", { key: "tags", className: "space-y-3" }, [
        n("div", { key: "source", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Source tag (specific)"),
            n(Zn, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (v, h) => Se("source", v, h == null ? void 0 : h.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !Q && de.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (v) => C({
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
            n(Zn, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (v, h) => Se("derived", v, h == null ? void 0 : h.label),
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
              onClick: (v) => C({
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
            onClick: () => O((v) => ({
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
          ...d.slotMappings.map((v, h) => n("div", { key: h, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: v.sourceSlotDefinitionId,
              disabled: r,
              onChange: (x) => ue(h, "sourceSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${h + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...de.map((x) => n("option", { key: x.id, value: x.id }, Ct(x)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: v.derivedSlotDefinitionId,
              disabled: r,
              onChange: (x) => ue(h, "derivedSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${h + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((x) => n("option", { key: x.id, value: x.id }, Ct(x)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => O((x) => ({
                ...x,
                slotMappings: x.slotMappings.filter((D, ae) => ae !== h)
              })),
              className: `${o} shrink-0 text-red-300`,
              "aria-label": `Remove performer slot mapping ${h + 1}`,
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
          onClick: S,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => O(null), className: o }, "Cancel")
      ])
    ]);
  }
  function I() {
    if (R) {
      const x = ne.filter((oe) => Number(oe.derivedTagId) === R.tagId), D = ne.filter((oe) => Number(oe.sourceTagId) === R.tagId), ae = (oe, U, ie) => n("div", {
        key: oe.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, U),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${oe.sourceTagName} → ${oe.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          ie ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => p(oe),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => m(oe, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(oe),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, R.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, R.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${R.incomingRuleCount} incoming · ${R.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (oe) => C({
            tagId: R.tagId,
            tagName: R.name,
            trigger: oe.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        D.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => A(R, D),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${D.length})`) : null,
        D.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...D.map((oe) => ae(oe, "Derives", !0))
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
            x.map((oe) => ae(oe, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!z)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const v = g.nodes.find((x) => x.tagId === Number(z.sourceTagId)), h = g.nodes.find((x) => x.tagId === Number(z.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (v == null ? void 0 : v.segmentGroupName) || "Ungrouped"),
          (v == null ? void 0 : v.segmentGroupKey) !== (h == null ? void 0 : h.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(h == null ? void 0 : h.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${z.sourceTagName} → ${z.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${z.edgeCount} materialized lineage edge${z.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (w == null ? void 0 : w.ruleId) === z.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
        n(
          "p",
          { key: "summary", className: "text-sm font-medium text-foreground" },
          `${w.createCount + w.linkCount} pending derivation${w.createCount + w.linkCount === 1 ? "" : "s"}`
        ),
        n(
          "p",
          { key: "details", className: "text-xs text-secondary" },
          `${w.createCount} new segments · ${w.linkCount} existing segments to link`
        ),
        n("div", { key: "actions", className: "flex gap-2" }, [
          n("button", {
            key: "materialize",
            type: "button",
            disabled: r,
            onClick: () => p(z, w),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => X(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        z.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : z.slotMappings.map((x, D) => n("div", {
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
          z.createdAt ? new Date(z.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          z.updatedAt ? new Date(z.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => p(z),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => m(z),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(z),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function ee() {
    if (ve.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, P ? "No derivation relationships match your search." : "No derivation rules.");
    const v = R == null ? void 0 : R.tagId, h = /* @__PURE__ */ new Set();
    return R && (h.add(R.tagId), f.connections.forEach((x) => {
      (x.sourceTagId === R.tagId || x.derivedTagId === R.tagId) && (h.add(x.sourceTagId), h.add(x.derivedTagId));
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
            const D = v === x.sourceTagId || v === x.derivedTagId, ae = R != null, oe = D ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${x.id}:visible`,
              d: x.path,
              fill: "none",
              stroke: oe,
              strokeWidth: D ? 2.5 : 1.5,
              opacity: ae && !D ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...f.nodes.map((x) => {
          const D = !P || x.name.toLocaleLowerCase().includes(P), ae = R != null, oe = h.has(x.tagId), U = (R == null ? void 0 : R.tagId) === x.tagId;
          return n("button", {
            key: `node:${x.tagId}`,
            type: "button",
            onClick: () => ce({ type: "node", id: x.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${U ? "border-accent bg-accent/15 ring-2 ring-accent/25" : oe ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${x.x}px`,
              top: `${x.y}px`,
              width: `${x.width}px`,
              height: `${x.height}px`,
              opacity: !D || ae && !oe ? 0.62 : 1
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
          const D = f.nodes.find((oe) => oe.tagId === x.sourceTagId), ae = f.nodes.find((oe) => oe.tagId === x.derivedTagId);
          return n("div", {
            key: `bundle:${x.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(D.x + D.width + ae.x) / 2 - 24}px`,
              top: `${(D.y + D.height / 2 + ae.y + ae.height / 2) / 2 - 10}px`
            },
            "aria-label": `${x.rules.length} rules connect ${x.rules[0].sourceTagName} to ${x.rules[0].derivedTagName}`
          }, `${x.rules.length} rules`);
        })
      ])
    ]);
  }
  function $() {
    if (ve.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        P ? "No derivation relationships match your search." : "No derivation rules."
      );
    const v = /* @__PURE__ */ new Map();
    re.forEach((x) => {
      const D = V(x);
      v.has(D) || v.set(D, []), v.get(D).push(x);
    });
    const h = [
      ...g.segmentGroups.map((x) => x.key),
      "cross-group"
    ].filter((x) => v.has(x));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, h.map((x) => {
      const D = g.segmentGroups.find((U) => U.key === x), ae = x === "cross-group" ? "Cross-group relationships" : (D == null ? void 0 : D.name) || "Ungrouped", oe = v.get(x);
      return n("section", { key: x, "aria-label": ae }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, ae),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${oe.length} rule${oe.length === 1 ? "" : "s"}`
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
          ...oe.map((U) => n("button", {
            key: U.id,
            type: "button",
            role: "row",
            onClick: () => ce({ type: "rule", id: U.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(z == null ? void 0 : z.id) === U.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${U.sourceTagName} → ${U.derivedTagName}` },
              `${U.sourceTagName} → ${U.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(U.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(U.edgeCount))
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
          `${T.length} rules · ${g.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          O(b()), ce(null), E();
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
            me(v.target.value), ce(null);
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
            he(v.target.value), ce(null), O(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...g.segmentGroups.map((v) => n("option", { key: v.key, value: v.key }, v.name))
        ])
      ]),
      te === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: y,
          onChange: (v) => H(v.target.value),
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
        ].map(([v, h]) => n("button", {
          key: v,
          type: "button",
          onClick: () => {
            M(v), v === "graph" && (L == null ? void 0 : L.type) === "rule" && ce(null);
          },
          "aria-pressed": te === v,
          className: `rounded px-3 py-1.5 text-sm font-medium ${te === v ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
        }, h))
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
        te === "graph" ? ee() : $()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? be() : I()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      G ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, G) : null
    ]),
    i ? n(wo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => W(i),
      onClose: () => {
        const v = i.trigger;
        C(null), requestAnimationFrame(() => {
          v != null && v.isConnected && v.focus();
        });
      }
    }) : null
  ]);
}
function Qc({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = K([]), [a, s] = K(null), [l, d] = K([]), [c, m] = K([]), [u, b] = K(!1), [g, f] = K(!1), [y, w] = K(!1), [A, p] = K(""), [G, P] = K(""), [q, W] = K("graph"), [E, T] = K("all"), [S, k] = K(null), [R, z] = K("relationship"), [L, C] = K(null), [O, H] = K(null), X = fe(null), me = fe(null), he = gi().replace(/:/g, "");
  function ce() {
    requestAnimationFrame(() => {
      var N;
      return (N = X.current) == null ? void 0 : N.scrollIntoView({ block: "nearest" });
    });
  }
  async function M(N) {
    const _ = await Y("/derivation-rules", N ? { signal: N } : void 0);
    i(_ || []);
  }
  ye(() => {
    const N = new AbortController();
    return M(N.signal).catch((_) => {
      _.name !== "AbortError" && p(_.message || "Unable to load derived segment rules.");
    }), () => N.abort();
  }, []), ye(() => {
    const N = new AbortController();
    return a != null && a.sourceTagId ? (b(!0), Y(`/slot-definitions/${a.sourceTagId}`, { signal: N.signal }).then((_) => d(_.definitions || [])).catch((_) => {
      _.name !== "AbortError" && d([]);
    }).finally(() => {
      N.signal.aborted || b(!1);
    })) : (d([]), b(!1)), a != null && a.derivedTagId ? (f(!0), Y(`/slot-definitions/${a.derivedTagId}`, { signal: N.signal }).then((_) => m(_.definitions || [])).catch((_) => {
      _.name !== "AbortError" && m([]);
    }).finally(() => {
      N.signal.aborted || f(!1);
    })) : (m([]), f(!1)), () => N.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), ye(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || u || g)
      return;
    const N = `${a.sourceTagId}:${a.derivedTagId}`;
    me.current !== N && (me.current = N, s((_) => !_ || Number(_.sourceTagId) !== Number(a.sourceTagId) || Number(_.derivedTagId) !== Number(a.derivedTagId) ? _ : fd(_, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    u,
    g
  ]);
  function re(N, _ = !1) {
    _ || k({ type: "rule", id: N.id }), me.current = null, s({
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
    }), p(""), ce();
  }
  function de(N, _, j = "") {
    me.current = null, N === "source" ? (d([]), b(_ != null)) : (m([]), f(_ != null)), s((Z) => ({
      ...Z,
      [`${N}TagId`]: _ == null ? null : Number(_),
      [`${N}TagName`]: j || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function Q(N) {
    (a == null ? void 0 : a.ruleId) == null && (me.current = null);
    const _ = [M(), t == null ? void 0 : t()];
    return N.draftKind === "source" ? (b(!0), _.push(Y(`/slot-definitions/${N.tagId}`).then((j) => d(j.definitions || [])).finally(() => b(!1)))) : N.draftKind === "derived" && (f(!0), _.push(Y(`/slot-definitions/${N.tagId}`).then((j) => m(j.definitions || [])).finally(() => f(!1)))), Promise.all(_);
  }
  function ue(N, _, j) {
    s((Z) => ({
      ...Z,
      slotMappings: Z.slotMappings.map((xe, pe) => pe === N ? { ...xe, [_]: j } : xe)
    }));
  }
  async function Se() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const N = Da(a, o);
    if (N) {
      p(N.message);
      return;
    }
    if (a.slotMappings.some((_) => !_.sourceSlotDefinitionId || !_.derivedSlotDefinitionId)) {
      p("Complete or remove every performer slot mapping before saving.");
      return;
    }
    w(!0), p(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let _ = null;
      if (a.ruleId != null) {
        const Z = await Y(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${Z.deletedSegmentCount}
Removed lineage edges: ${Z.removedEdgeCount}
Shared derived segments retained: ${Z.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        _ = Z.fingerprint;
      }
      p("Saving derived segment rule…");
      const j = await Y("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: _
        })
      });
      if (await M(), k(q === "graph" ? { type: "node", id: Number(j.sourceTagId) } : { type: "rule", id: j.id }), s(null), a.ruleId == null)
        try {
          const Z = await Y(
            `/derivation-rules/${j.id}/materialization/preview`,
            { method: "POST" }
          );
          C(
            Z.createCount + Z.linkCount > 0 ? Z : null
          ), p(Z.createCount + Z.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          C(null), p("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        C(null), p("Derived segment rule saved. Previous materializations were removed.");
    } catch (_) {
      p(_.message || "Unable to save derived segment rule.");
    } finally {
      w(!1);
    }
  }
  async function te(N) {
    w(!0), p("Previewing rule deletion…");
    try {
      const _ = await Y(
        `/derivation-rules/${N.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${N.sourceTagName} → ${N.derivedTagName}?

Deleted segments: ${_.deletedSegmentCount}
Removed lineage edges: ${_.removedEdgeCount}
Shared derived segments retained: ${_.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const j = `derivation-rule-delete:${N.id}:${_.fingerprint}`;
      await Y(`/derivation-rules/${N.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: qe(j),
          fingerprint: _.fingerprint
        })
      }), _e(j), await M(), (a == null ? void 0 : a.ruleId) === N.id && s(null), (S == null ? void 0 : S.type) === "rule" && S.id === N.id && k(null), (L == null ? void 0 : L.ruleId) === N.id && C(null), p(`Rule deleted with ${_.deletedSegmentCount} exclusively derived segment${_.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (_) {
      p(_.message || "Unable to delete derived segment rule.");
    } finally {
      w(!1);
    }
  }
  async function ve(N, _ = null) {
    const j = _ || await Y(
      `/derivation-rules/${N.id}/materialization/preview`,
      { method: "POST" }
    );
    if (j.createCount + j.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const Z = `derivation-rule-materialize:${N.id}:${j.fingerprint}`, xe = await Y(`/derivation-rules/${N.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: qe(Z),
        fingerprint: j.fingerprint
      })
    });
    return _e(Z), xe;
  }
  async function ne(N, _ = null) {
    w(!0), p("Finding pending derivations…");
    try {
      const j = await ve(N, _);
      if (C(null), await M(), j.createdCount + j.linkedCount === 0) {
        p("Every applicable derivation is already materialized.");
        return;
      }
      p(
        `${j.createdCount} derived segment${j.createdCount === 1 ? "" : "s"} created and ${j.linkedCount} existing segment${j.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (j) {
      p(j.message || "Unable to materialize pending derivations.");
    } finally {
      w(!1);
    }
  }
  async function V(N, _) {
    if (_.length === 0) return;
    w(!0), p(`Finding pending derivations from ${N.name}…`);
    let j = 0, Z = 0;
    try {
      for (const xe of _) {
        const pe = await ve(xe);
        j += pe.createdCount, Z += pe.linkedCount;
      }
      C(null), await M(), p(j + Z === 0 ? `Every outgoing derivation from ${N.name} is already materialized.` : `${j} derived segment${j === 1 ? "" : "s"} created and ${Z} existing segment${Z === 1 ? "" : "s"} linked from ${N.name}.`);
    } catch (xe) {
      await M().catch(() => {
      }), p(xe.message || `Unable to materialize derivations from ${N.name}.`);
    } finally {
      w(!1);
    }
  }
  const be = Da(a, o), I = We(
    () => _c(o, e),
    [o, e]
  ), ee = G.trim().toLocaleLowerCase(), v = I.components.filter((N) => E === "all" || N.segmentGroupKeys.includes(E)).filter((N) => !ee || N.nodes.some((_) => _.name.toLocaleLowerCase().includes(ee))), h = v.flatMap((N) => N.rules), x = new Set(
    v.flatMap((N) => N.nodes.map((_) => _.tagId))
  ), D = We(
    () => Vc(v),
    [v]
  ), ae = q === "list" ? Jc(
    S,
    h,
    ee.length > 0
  ) : null, oe = (S == null ? void 0 : S.type) === "node" && I.nodes.find((N) => N.tagId === S.id && x.has(N.tagId)) || null, U = [...h].sort((N, _) => R === "source" ? Nt(N.sourceTagName, _.sourceTagName) || Nt(N.derivedTagName, _.derivedTagName) : R === "target" ? Nt(N.derivedTagName, _.derivedTagName) || Nt(N.sourceTagName, _.sourceTagName) : R === "materialized" ? (Number(_.edgeCount) || 0) - (Number(N.edgeCount) || 0) || Nt(N.sourceTagName, _.sourceTagName) : Nt(
    `${N.sourceTagName} ${N.derivedTagName}`,
    `${_.sourceTagName} ${_.derivedTagName}`
  ));
  return n(Yc, {
    arrowMarkerId: he,
    busy: y,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: O,
    deleteRule: te,
    derivedSlots: c,
    derivedSlotsLoading: g,
    draft: a,
    draftIssue: be,
    editRule: re,
    editorRef: X,
    emptyDraft: r,
    graph: I,
    layout: D,
    listSort: R,
    materializationOffer: L,
    materializeOutgoingRules: V,
    materializeRule: ne,
    message: A,
    normalizedQuery: ee,
    query: G,
    refreshConfiguredTag: Q,
    revealEditor: ce,
    rules: o,
    save: Se,
    segmentGroupKey: E,
    selectedNode: oe,
    selectedRule: ae,
    selection: S,
    setConfiguringTag: H,
    setDraft: s,
    setListSort: z,
    setMaterializationOffer: C,
    setQuery: P,
    setSegmentGroupKey: T,
    setSelection: k,
    setView: W,
    sortedVisibleRules: U,
    sourceSlots: l,
    sourceSlotsLoading: u,
    updateMapping: ue,
    updateTag: de,
    view: q,
    visibleComponents: v,
    visibleRules: h
  });
}
function Zc() {
  const [e, t] = K(si), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => sa({ ...l, [a]: s }));
  }
  function i() {
    t(sa(uo));
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
function Xc({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = K([]), [a, s] = K(!1), [l, d] = K(!1), [c, m] = K(""), [u, b] = K(""), [g, f] = K("all"), [y, w] = K(() => /* @__PURE__ */ new Set()), [A, p] = K(null);
  ye(() => {
    if (!e || a) return;
    const C = new AbortController();
    return d(!0), m(""), Y("/slot-definitions", { signal: C.signal }).then((O) => {
      i(O || []), s(!0);
    }).catch((O) => {
      O.name !== "AbortError" && m(O.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      C.signal.aborted || d(!1);
    }), () => C.abort();
  }, [e, a]);
  async function G() {
    d(!0), m("");
    try {
      const C = await Y("/slot-definitions");
      i(C || []), s(!0);
    } catch (C) {
      m(C.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function P() {
    const [C] = await Promise.all([
      Y("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(C || []), s(!0), m("");
  }
  function q() {
    const C = A == null ? void 0 : A.trigger;
    p(null), requestAnimationFrame(() => {
      C != null && C.isConnected && C.focus({ preventScroll: !0 });
    });
  }
  function W(C) {
    w((O) => {
      const H = new Set(O);
      return H.has(C) ? H.delete(C) : H.add(C), H;
    });
  }
  const E = We(
    () => Hc(t, o),
    [t, o]
  ), T = We(
    () => qc(E, u, g),
    [E, u, g]
  ), S = E.flatMap((C) => C.tags), k = S.filter((C) => C.definitions.length > 0).length, R = S.length - k, z = [
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
        `${S.length} tags · ${k} with slots · ${R} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: u,
          onChange: (C) => b(C.target.value),
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
          z.map(([C, O]) => n("button", {
            key: C,
            type: "button",
            onClick: () => f(C),
            "aria-pressed": g === C,
            className: `rounded px-3 py-1.5 text-xs font-medium ${g === C ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, O))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => w(/* @__PURE__ */ new Set()),
          className: L
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => w(new Set(E.map((C) => C.overviewKey))),
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
        onClick: G,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && T.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, T.map((C) => {
      const O = y.has(C.overviewKey), H = C.tags.filter((X) => X.definitions.length > 0).length;
      return n("article", {
        key: C.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => W(C.overviewKey),
          "aria-expanded": !O,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, O ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, C.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${C.tags.length} tag${C.tags.length === 1 ? "" : "s"} · ${H} with slots`
          )
        ]),
        O ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          C.tags.map((X) => n("li", {
            key: X.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: X.tagName }, X.tagName),
              X.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            X.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${X.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, X.definitions.map((me) => n("li", {
              key: me.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, Ct(me)),
              ...(me.genderHints || []).map((he) => n("span", {
                key: he,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, Rr(he)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (me) => p({
                tagId: X.tagId,
                tagName: X.tagName,
                trigger: me.currentTarget
              }),
              "aria-label": `Edit performer slots for ${X.tagName}`,
              className: `${L} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    A ? n(wo, {
      key: `performer-slots-configure:${A.tagId}`,
      tagId: A.tagId,
      tagName: A.tagName,
      onSaved: P,
      onClose: q
    }) : null
  ]);
}
function eu({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = K("general"), [a, s] = K([]), [l, d] = K(!1), [c, m] = K(""), [u, b] = K(""), [g, f] = K(null), [y, w] = K(!0), [A, p] = K(!1), [G, P] = K(""), [q, W] = K(!0), [E, T] = K(ei), S = El(t), k = S.map(([O]) => O);
  ye(() => {
    k.includes(o) || i(k[0] || "general");
  }, [t.effectiveMode]);
  async function R(O) {
    const H = await Y("/segment-groups", O ? { signal: O } : void 0);
    s(H || []);
  }
  ye(() => {
    const O = new AbortController();
    return R(O.signal).catch((H) => {
      H.name !== "AbortError" && m(H.message || "Unable to load tag groups.");
    }), () => O.abort();
  }, []), ye(() => {
    if (t.effectiveMode !== "full") {
      w(!1);
      return;
    }
    const O = new AbortController();
    return P(""), w(!0), Promise.all([
      Y("/analysis/settings", { signal: O.signal }),
      Y("/analysis/status", { signal: O.signal })
    ]).then(([H, X]) => {
      W(!0), b((H == null ? void 0 : H.baseUrl) || ""), f(X);
    }).catch((H) => {
      if (H.name !== "AbortError") {
        if (H.status === 403) {
          W(!1), P("You do not have permission to manage the analysis service connection.");
          return;
        }
        P(H.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      O.signal.aborted || w(!1);
    }), () => O.abort();
  }, [t.effectiveMode]);
  async function z(O) {
    if (O !== t.requestedMode) {
      d(!0), m("");
      try {
        const H = await Y(
          `/preferences/transition?mode=${encodeURIComponent(O)}`
        );
        let X = !1, me = null, he = null, ce = null, M = !1;
        if (t.requestedMode === "basic" && O === "full") {
          if (!window.confirm(Pl(
            H.recyclingBinCount,
            H.protectedRecyclingBinCount
          )))
            return;
          M = !0, H.recyclingBinCount > 0 && (X = !0, ce = H.recyclingBinFingerprint, me = `mode-switch-empty-bin:${ce}`, he = qe(me));
        }
        let re = !1;
        if (t.requestedMode === "full" && O === "basic") {
          if (!window.confirm(Ol(
            H.extensionOwnedSegmentCount
          )))
            return;
          re = !0;
        }
        const de = await Y("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: O,
            confirmHiddenExtensionOwnedSegments: re,
            confirmBasicHistoryCleanup: M,
            emptyRecyclingBin: X,
            operationId: he,
            expectedRecyclingBinFingerprint: ce
          })
        });
        me && _e(me), r == null || r(li(de)), m("Workflow mode saved.");
      } catch (H) {
        m(H.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function L(O) {
    O.preventDefault(), p(!0), P("");
    try {
      const H = await Y("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: u })
      });
      b((H == null ? void 0 : H.baseUrl) || "");
      const X = await Y("/analysis/status");
      f(X), P(H != null && H.baseUrl ? X != null && X.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(X == null ? void 0 : X.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (H) {
      P(H.message || "Unable to save analysis service settings.");
    } finally {
      p(!1);
    }
  }
  const C = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (O) => Pi(O, e, C), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      S.map(([O, H]) => n("button", {
        key: O,
        type: "button",
        onClick: () => i(O),
        "aria-current": o === O ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === O ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, H))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(Zc)
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
      n(pc, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: z,
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
          checked: E,
          onChange: (O) => {
            const H = O.target.checked;
            ti(H), T(H);
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
      n("form", { key: "form", onSubmit: L, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
        n("label", { key: "url", className: "min-w-0 flex-1 space-y-1" }, [
          n("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Server URL"),
          n("input", {
            key: "input",
            type: "url",
            value: u,
            onChange: (O) => b(O.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: y || A || !q,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: y || A || !q,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, A ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        G || (y ? "Loading analysis service settings…" : (g == null ? void 0 : g.configured) === !1 ? "Full Scan is not configured." : g != null && g.ready ? "Analysis service is ready." : (g == null ? void 0 : g.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    k.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(Qc, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => R()
      })
    ) : null,
    k.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(Xc, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => R()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function Oa({ facets: e, values: t, disabled: r, onChange: o }) {
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
function tu({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var m, u;
  const s = [...e.slots || []].sort((b, g) => b.sortOrder - g.sortOrder || String(b.slotDefinitionId).localeCompare(String(g.slotDefinitionId))), l = [...new Map(s.map((b) => [
    b.performerId,
    { id: b.performerId, name: b.performerName }
  ])).values()], d = s.map((b) => ({
    slotDefinitionId: b.slotDefinitionId,
    label: Ct(b),
    performer: { id: b.performerId, name: b.performerName }
  })), c = ci(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: vi(t)
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
          n(un, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((u = e.activity) == null ? void 0 : u.name) || "Tag segment"),
          l.length ? n(Mr, {
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
function nu({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(Ba, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: jl(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: ci(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Pa({ onNavigate: e, profile: t }) {
  const r = We(() => {
    const M = Ua("ext:com.midnightrider.segment-studio:segments");
    return M ? {
      ...Jr,
      defaultFilter: { ...Jr.defaultFilter, ...M.findFilter || {} },
      defaultObjectFilter: M.objectFilter || {}
    } : Jr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Ka(r), [l, d] = K(null), [c, m] = K({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [u, b] = K(null), [g, f] = K(null), [y, w] = K(0), [A, p] = K(""), [G, P] = K(!0), [q, W] = K(""), E = fe(0), T = da(o, i), S = T.activityTagId, k = Cn(i.slots), R = We(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (M) => Object.keys(Cn(M)).length > 0,
    sanitize: (M) => Yr(S, Cn(M)),
    summarize: (M) => `${Object.keys(Cn(M)).length} assigned`,
    renderEditor: (M, re) => S ? n(Oa, {
      facets: l,
      values: Cn(M),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (de, Q) => {
        const ue = { ...Cn(M) };
        Q ? ue[de] = Number(Q) : delete ue[de], re(Yr(S, ue));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [S, l, c.performerSlotsAvailable]), z = JSON.stringify(T);
  ye(() => {
    if (d(null), !S) return;
    const M = new AbortController();
    return Y(`/browse/activities/${S}/facets`, { signal: M.signal }).then(d).catch((re) => {
      re.status === 403 ? d({ slots: [], restricted: !0 }) : re.name !== "AbortError" && W(re.message);
    }), () => M.abort();
  }, [S]), ye(() => {
    const M = ++E.current, re = new AbortController();
    return P(!0), W(""), Y("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(T), signal: re.signal }).then((de) => {
      M === E.current && m({ ...de, totalCount: de.totalCount ?? de.total ?? 0 });
    }).catch((de) => {
      if (!(M !== E.current || de.name === "AbortError")) {
        if (de.status === 400 && de.message.includes("unrestricted performer read access")) {
          m((Q) => ({ ...Q, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), W("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        W(de.message);
      }
    }).finally(() => {
      M === E.current && P(!1);
    }), () => {
      E.current++, re.abort();
    };
  }, [z, y]);
  const L = c.items.findIndex((M) => M.key === u), C = c.items[L] || null;
  function O(M) {
    s(M), a({ ...o, page: 1 });
  }
  function H(M) {
    const re = da(o, M), de = M.slots && re.activityTagId != null && re.slotAssignments.length > 0 ? M.slots : void 0;
    O({ ...M, slots: de });
  }
  function X(M, re) {
    const de = { ...k };
    re ? de[M] = Number(re) : delete de[M], O({ ...i, slots: Yr(S, de) });
  }
  function me() {
    const M = document.querySelector(`[data-segment-key="${u}"]`);
    b(null), requestAnimationFrame(() => M == null ? void 0 : M.focus());
  }
  async function he(M) {
    var Q;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    f(M.key), p("");
    const re = `browse-restore:${M.itemId}:${M.revision}`, de = qe(re);
    try {
      const ue = (Se = !1) => Y(`/bin/${M.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: de,
          expectedRevision: M.revision,
          discardMissingImage: Se
        })
      });
      try {
        await ue(fo(re));
      } catch (Se) {
        if (((Q = Se.payload) == null ? void 0 : Q.code) !== "missing-image" || !window.confirm(`${Se.message}

Continue and discard the missing image reference?`))
          throw Se;
        yo(re), await ue(!0);
      }
      _e(re), u === M.key && b(null), p("Segment restored to Cove."), w((Se) => Se + 1);
    } catch (ue) {
      p(ue.message || "Unable to restore the segment."), ue.status === 409 && w((Se) => Se + 1);
    } finally {
      f(null);
    }
  }
  async function ce(M) {
    f(M.key), p("");
    try {
      const re = await Y(`/items/${M.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: M.revision })
      });
      if (!fi(re, p) || !Zl(re))
        return;
      const de = `browse-dependency-delete:${M.itemId}:${re.fingerprint}`;
      await Y(`/items/${M.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: qe(de),
          fingerprint: re.fingerprint
        })
      }), _e(de), u === M.key && b(null), p(`${re.deletedSegmentCount} segment${re.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), w((Q) => Q + 1);
    } catch (re) {
      p(re.message || "Unable to permanently delete the segment."), re.status === 409 && w((de) => de + 1);
    } finally {
      f(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(ko, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(za, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: a,
      totalCount: c.totalCount,
      isLoading: G,
      error: q ? new Error(q) : null,
      onRetry: () => w((M) => M + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? la.filter((M) => M.id !== "performers") : la,
      objectFilter: i,
      onObjectFilterChange: H,
      customFilterSections: R,
      searchPlaceholder: "Search segments..."
    }, [
      S ? n(Oa, { key: "slots", facets: l, values: k, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: X }) : null,
      n(nu, { key: "player", item: C, index: L, count: c.items.length, onPrevious: () => {
        var M;
        return b((M = c.items[L - 1]) == null ? void 0 : M.key);
      }, onNext: () => {
        var M;
        return b((M = c.items[L + 1]) == null ? void 0 : M.key);
      }, onClose: me, onNavigate: e }),
      A ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, A) : null,
      !G && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      G ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((M) => n(tu, {
        key: M.key,
        item: M,
        selected: M.key === u,
        busy: g === M.key,
        onSelect: () => b(M.key),
        onRestore: he,
        onPurge: ce
      })))
    ])
  ]);
}
function ru({ onNavigate: e, profile: t }) {
  const [r, o] = K([]), [i, a] = K(""), [s, l] = K(0), [d, c] = K(!0), [m, u] = K(null), [b, g] = K(""), f = fe(null);
  async function y(p) {
    const G = await Y("/bin", p ? { signal: p } : void 0);
    return o(G.items || []), a(G.fingerprint || ""), l(Number(G.totalCount) || 0), G;
  }
  ye(() => {
    const p = new AbortController();
    return c(!0), y(p.signal).catch((G) => {
      G.name !== "AbortError" && g(G.message);
    }).finally(() => {
      p.signal.aborted || c(!1);
    }), () => p.abort();
  }, []), Ga(co, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var p;
      return (p = f.current) == null ? void 0 : p.call(f);
    }
  }]);
  async function w(p) {
    var q;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    u(p.itemId), g("");
    const G = `restore:${p.itemId}:${p.revision}`, P = qe(G);
    try {
      const W = (E = !1) => Y(`/bin/${p.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: P, expectedRevision: p.revision, discardMissingImage: E })
      });
      try {
        await W(fo(G));
      } catch (E) {
        if (((q = E.payload) == null ? void 0 : q.code) !== "missing-image" || !window.confirm(`${E.message}

Continue and discard the missing image reference?`)) throw E;
        yo(G), await W(!0);
      }
      _e(G), await y(), Qn(), g("Segment restored with a new native ID.");
    } catch (W) {
      g(W.message || "Unable to restore the segment."), W.status === 409 && await y();
    } finally {
      u(null);
    }
  }
  async function A() {
    if (m == null)
      try {
        const p = await bi({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          u(-1), g("");
        });
        if (p.status !== "emptied") return;
        await y(), Qn(), g(`${p.segmentCount} segment${p.segmentCount === 1 ? "" : "s"} from ${p.sceneCount} scene${p.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (p) {
        g(p.message || "Unable to empty the recycling bin."), p.status === 409 && await y();
      } finally {
        u(null);
      }
  }
  return f.current = A, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    n(ko, {
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
        onClick: A,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, m === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    b ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, b) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((p) => n("article", { key: p.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${p.tagName || "Tag segment"} · ${p.videoTitle || `Video ${p.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, p.endSec == null ? Re(p.startSec) : `${Re(p.startSec)} – ${Re(p.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${p.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${p.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: m != null, onClick: () => w(p), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const La = "ext:com.midnightrider.segment-studio:videos";
function Zr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = We(() => {
    var ne;
    const te = Ua(La), ve = (ne = te == null ? void 0 : te.uiOptions) == null ? void 0 : ne.displayMode;
    return te ? {
      ...Vn,
      defaultFilter: { ...Vn.defaultFilter, ...te.findFilter || {} },
      defaultObjectFilter: te.objectFilter || {},
      defaultDisplayMode: Vn.allowedDisplayModes.includes(ve) ? ve : Vn.defaultDisplayMode
    } : Vn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: m } = Ka(i), [u, b] = K({ items: [], totalCount: 0 }), [g, f] = K(!0), [y, w] = K(""), [A, p] = K(0), [G, P] = K(/* @__PURE__ */ new Set()), [q, W] = K(null), [E, T] = K({ busy: !1, error: "", announcement: "" }), S = fe(0), k = fe(null), R = fe(null);
  R.current || (R.current = Kc());
  const z = JSON.stringify(a), L = JSON.stringify(s), C = t || r === "review";
  ye(() => {
    R.current.selectionChanged(), k.current = null, P(/* @__PURE__ */ new Set()), T((te) => ({ busy: te.busy, error: "", announcement: "" }));
  }, [z, L]), ye(() => {
    if (!C) return;
    const te = new AbortController();
    return Y("/analysis/status", { signal: te.signal }).then(W).catch((ve) => {
      ve.name !== "AbortError" && W({ configured: !0, ready: !1, error: ve.message || "Unable to check Full Scan readiness." });
    }), () => te.abort();
  }, [C]), ye(() => {
    const te = ++S.current, ve = new AbortController();
    return f(!0), w(""), Y(`/videos?${dc(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: ve.signal }).then((ne) => {
      te === S.current && b(ne);
    }).catch((ne) => {
      te === S.current && ne.name !== "AbortError" && w(ne.message || "Unable to discover videos.");
    }).finally(() => {
      te === S.current && f(!1);
    }), () => {
      S.current++, ve.abort();
    };
  }, [z, L, t, r, A]);
  function O(te) {
    d({ ...te, page: te.page || 1 });
  }
  function H(te) {
    c(te), d({ ...a, page: 1 });
  }
  function X(te, ve = !1) {
    P((ne) => cc(
      ne,
      u.items.map((V) => V.videoId),
      te,
      k.current,
      ve
    )), k.current = te;
  }
  function me() {
    k.current = null, P(new Set(u.items.map((te) => te.videoId)));
  }
  function he() {
    k.current = null, P(/* @__PURE__ */ new Set());
  }
  function ce() {
    k.current = null, P((te) => new Set(u.items.map((ve) => ve.videoId).filter((ve) => !te.has(ve))));
  }
  async function M(te = ["aiTagging", "omnishotcut"]) {
    const ve = R.current.begin();
    if (ve) {
      T({ busy: !0, error: "", announcement: "" });
      try {
        const ne = await zc(
          [...G],
          te,
          Y,
          (V) => window.confirm(V)
        );
        if (ne.cancelled) {
          T({ busy: !1, error: "", announcement: "" });
          return;
        }
        ne.queuedIds.length > 0 && R.current.ownsCurrentSelection(ve) && (ne.queuedIds.includes(k.current) && (k.current = null), P((V) => {
          const be = new Set(V);
          return ne.queuedIds.forEach((I) => be.delete(I)), be;
        })), T({
          busy: !1,
          announcement: ne.queuedIds.length > 0 ? `${ne.queuedIds.length} ${ne.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: ne.failed.length > 0 ? `${ne.failed.length} selected ${ne.failed.length === 1 ? "video could" : "videos could"} not be queued. ${ne.failed[0].error}` : ""
        });
      } catch (ne) {
        T({ busy: !1, error: ne.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        R.current.finish(ve);
      }
    }
  }
  const re = t || r === "review" ? Ca : Ca.filter((te) => !["reviewState", "shotBoundaries"].includes(te.id)), de = q === null || q.configured === !1 || q.ready === !1, Q = E.busy || de, ue = (q == null ? void 0 : q.error) || (q === null ? "Checking Full Scan availability" : q.configured === !1 ? "Configure the analysis service before running Full Scan" : q.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), Se = E.busy ? "Queueing scans…" : q === null ? "Checking Full Scan…" : q.configured === !1 ? "Full Scan not configured" : q.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
  return n("div", { className: "w-full space-y-5" }, [
    n(ko, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(za, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: La,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: O,
      totalCount: u.totalCount,
      isLoading: g,
      error: y ? new Error(y) : null,
      onRetry: () => p((te) => te + 1),
      sortOptions: t || r === "review" ? [...Ia, { value: "unreviewed_count", label: "Unreviewed count" }] : Ia,
      displayMode: l,
      onDisplayModeChange: m,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: re,
      objectFilter: s,
      onObjectFilterChange: H,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: C ? G : void 0,
      onSelectAll: C ? me : void 0,
      onSelectNone: C ? he : void 0,
      onInvertSelection: C ? ce : void 0,
      selectionActions: C ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: Q,
          onClick: () => M(),
          title: ue,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, Se),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": Q,
            title: ue,
            onClick: (te) => {
              Q && te.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${Q ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(Ha, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([te, ve]) => n("button", {
            key: te,
            type: "button",
            disabled: E.busy,
            onClick: (ne) => {
              var V;
              (V = ne.currentTarget.closest("details")) == null || V.removeAttribute("open"), M(ve);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, te)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, E.announcement),
      E.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, E.error) : null,
      !g && u.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !g && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, u.items.map((te) => n(uc, { key: te.videoId, item: te, onNavigate: e, showReviewStates: C, selected: G.has(te.videoId), selectionActive: G.size > 0, onSelect: C ? X : null }))) : null,
      !g && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, u.items.map((te) => n(mc, { key: te.videoId, item: te, onNavigate: e, showReviewStates: C, selected: G.has(te.videoId), selectionActive: G.size > 0, onSelect: C ? X : null }))) : null
    ])
  ]);
}
function Fa({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = K(null), [s, l] = K(!0), [d, c] = K(""), m = fe(0), u = fe(0), b = fe(e), g = Jd();
  b.current = e;
  const [f] = K(() => Ys({
    beginRequest: () => ({ requestId: ++u.current, videoId: b.current }),
    fetchDetail: (P) => Y(y(P.videoId)),
    isCurrent: (P) => pr(P.requestId, u.current, P.videoId, b.current),
    isSameVideo: (P) => P.videoId === b.current
  })), y = (P) => `/videos/${P}/editor`;
  async function w(P, q, W) {
    const E = await Y(y(q), W ? { signal: W.signal } : void 0);
    return pr(P, W ? m.current : u.current, q, b.current) ? (a(E), !0) : !1;
  }
  ye(() => {
    const P = ++m.current, q = e, W = new AbortController();
    return a(null), l(!0), c(""), w(P, q, W).catch((E) => {
      pr(P, m.current, q, b.current) && E.name !== "AbortError" && c(E.message || "Unable to load the editor.");
    }).finally(() => {
      pr(P, m.current, q, b.current) && l(!1);
    }), () => {
      m.current++, u.current++, W.abort();
    };
  }, [e]);
  function A(P, q) {
    a((W) => (W == null ? void 0 : W.video.id) !== q ? W : typeof P == "function" ? P(W) : P);
  }
  function p() {
    return f({
      onLoaded: (P) => {
        a(P), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: (P) => c(P.message || "Unable to reload the latest segment.")
    });
  }
  function G() {
    return f({
      onLoaded: (P) => {
        a(P), c("");
      },
      onError: (P) => c(P.message || "Unable to reload performer slots.")
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
      n(Os, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(Gc, {
      key: i.video.id,
      detail: i,
      onDetailChange: A,
      onConflict: p,
      onReload: G,
      onSlotsChanged: G,
      splitLayout: g,
      profile: o,
      initialSegmentId: ua() ? -ua() : Bl(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function ou(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function au(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function iu(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function su({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = Rl(o), l = ou(e, t, window.location.pathname), d = au(e, t, window.location.pathname), c = iu(e, t, window.location.pathname), m = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (Dl(m, o) === "videos" && m !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Zr, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(eu, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(Pa, { onNavigate: r, profile: o });
    const g = Number(e);
    return Number.isInteger(g) && g > 0 ? n(Fa, {
      videoId: g,
      onNavigate: r,
      compatibilityMode: !0,
      profile: o
    }) : n(Zr, {
      onNavigate: r,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return n(ru, { onNavigate: r, profile: o });
  const b = Number(e);
  return d ? n(Pa, { onNavigate: r, profile: o }) : Number.isInteger(b) && b > 0 ? n(Fa, {
    videoId: b,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(Zr, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function lu({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = K(null), [a, s] = K("");
  return ye(() => {
    const l = new AbortController();
    return Y("/preferences", { signal: l.signal }).then((d) => i(li(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(su, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function du(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function cu(e, t) {
  const r = du(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const Lu = {
  components: { SegmentStudioPage: lu },
  actionHandlers: { openSegmentStudio: cu }
};
export {
  $n as CLEARED_SEGMENT_SELECTION_ID,
  Ia as DISCOVERY_SORT_OPTIONS,
  Qt as SEGMENT_STUDIO_CAPABILITIES,
  co as SEGMENT_STUDIO_EXTENSION_ID,
  nr as SEGMENT_STUDIO_SHORTCUTS,
  el as activeEditorFilterCount,
  Ud as addPendingChange,
  fd as applyDerivationRuleSlotSuggestions,
  wr as applyFeedbackEditorDelta,
  Hd as applyPendingChanges,
  ha as applySegmentMergeDelta,
  td as basicSegmentTimelineStyle,
  jl as browseClipEnd,
  ci as browseEditorHref,
  da as buildBrowseRequest,
  _c as buildDerivationRuleGraph,
  dc as buildDiscoverySearchParams,
  Bs as buildMinuteTimelineTicks,
  Hc as buildPerformerSlotOverview,
  Hl as buildSegmentQuickSearchEntries,
  xd as buildSegmentRailRows,
  Sd as buildTimelineRows,
  yu as buildTimelineTicks,
  zs as calculateCenteredTimelineScroll,
  eo as calculateEditorPanelMaximum,
  Gs as calculateMinuteLabelStride,
  bu as calculateMinuteTimelineWidth,
  _s as calculateSwimlaneTitleMaximum,
  Hs as calculateTimelinePlayheadPosition,
  mo as calculateTimelineRatioBounds,
  Vs as calculateTimelineRatioFromPointer,
  hu as calculateVerticalRevealOffset,
  ln as clampEditorPanelWidth,
  xr as clampSwimlaneTitleWidth,
  Xa as clampTimelineRatio,
  go as clampTimelineRatioForHeight,
  Cr as clampTimelineZoom,
  ac as compactProvenanceSummary,
  qd as confirmPendingChange,
  Kc as createBulkAnalysisCoordinator,
  Ys as createEditorReloader,
  vl as createQueuedReviewRequest,
  jd as createSaveQueue,
  Ra as createSegmentAnalysisRequestScope,
  Lu as default,
  Ei as discardPendingChange,
  Ql as downloadFileNameFromContentDisposition,
  tl as dualRangeValueFromPointer,
  aa as duplicateIdentityFromResponse,
  kl as duplicateOperationKey,
  ni as editorVisibilityIncludingSegment,
  Nd as expandedSwimlanes,
  Ol as extensionOwnedSegmentsModeSwitchPrompt,
  Ad as feedbackFrameTimestamps,
  Md as feedbackResultMatchesAction,
  Rd as feedbackSelectionPlan,
  Xs as filterDerivedSegments,
  Wr as filterEditorSegments,
  qc as filterPerformerSlotOverview,
  zl as filterSegmentQuickSearch,
  wu as filterSegmentStudioShortcuts,
  $d as findAdjacentSegmentGroupKey,
  Tl as findAdjacentShot,
  yl as findEditorShortcut,
  Za as findInitialSegmentSelection,
  js as findNearestSegmentInCurrentSwimlane,
  kr as findNextUnprocessed,
  $l as findPublishedSelectionIdentity,
  tt as findSegmentByStableIdentity,
  Js as findSegmentFromPlayhead,
  Fs as findSegmentNearPlayhead,
  Cd as findSwimlaneRangeSelection,
  io as findSwimlaneSelection,
  Ul as findUniquePerformerSlotAssignment,
  Ir as findUnreviewedSelection,
  cd as focusDialogDefaultButton,
  Rr as formatGenderHint,
  Al as frameStepSeconds,
  ui as generatePerformerSlotAssignmentRecommendations,
  kc as groupApprovedDraftsForPublishing,
  Kl as groupAutoAssignCandidates,
  Ed as groupIncorrectExamplesByTag,
  $c as groupMaterializationOutputs,
  dn as groupSegmentsIntoSwimlanes,
  kd as groupSelectedSwimlanes,
  xo as groupSwimlanesBySegmentGroup,
  Et as handleModalKey,
  wi as hasGroupedSwimlanes,
  An as hasSegmentStudioCapability,
  Ri as heldTagChangeFor,
  Cl as heldTagReady,
  xa as hideCollectedFeedbackSegments,
  ya as historyActionsForTarget,
  yr as incorrectExampleHistoryState,
  ki as indexPerformerSlotsBySegment,
  Cu as initialReviewFilter,
  Pd as insertSegmentProjection,
  pr as isCurrentEditorRequest,
  id as isEditableTarget,
  Tu as isEditorShortcutOwner,
  Fd as isKindRunning,
  Pu as isSaveQueueBusy,
  iu as isSegmentStudioBinRoute,
  au as isSegmentStudioSegmentsRoute,
  ou as isSegmentStudioSettingsRoute,
  Wc as layoutDerivationRuleComponent,
  Vc as layoutDerivationRuleComponents,
  Ld as mergeSegmentsProjection,
  gd as multiSelectionActionHint,
  rn as normalizeCollapsedSegmentGroups,
  Ta as normalizeDiscoveryIds,
  Lt as normalizeEditorSegmentFilters,
  tn as normalizeGender,
  ia as normalizeReviewFilter,
  li as normalizeSegmentStudioFeatureProfile,
  Nu as normalizeSegmentStudioMode,
  oo as normalizeSegmentStudioPublicMode,
  Cn as parseBrowseSlotFilters,
  Ws as parseEditorLayout,
  Qs as parseHideDerivedSegmentsPreference,
  Zs as parseMergeConfirmationPreference,
  ii as parsePlaybackShortcutConfig,
  pl as parseShortcutBindingOverrides,
  en as patchPerformerSlotProjection,
  Mu as patchSegmentProjection,
  _d as pendingChangesReducer,
  Kd as pendingInsertedSegments,
  dl as percentageSeekTime,
  Gl as performInitialSegmentSeek,
  ut as performerOptionId,
  $r as performerSlotHistoryState,
  Ct as performerSlotLabel,
  yd as performerSlotPresentation,
  Ru as performerSlotStatus,
  vo as performerSlotStatusFromSegmentSlots,
  Si as performerSlotsForSegment,
  Kt as provenanceSourceLabel,
  Oi as prunePendingChanges,
  Il as queueCreatedSegmentTagChoice,
  mi as rankPerformerOptions,
  Td as reconcileSegmentGroupKey,
  sl as reconcileSelectedSegmentIds,
  gc as recyclingBinActionText,
  Xl as recyclingBinDeletionPrompt,
  yi as recyclingBinDeletionSummary,
  Pl as recyclingBinModeSwitchPrompt,
  Iu as removeQueuedReviewsForSegments,
  Eu as removeSegmentsProjection,
  ua as requestedOwnedItemId,
  Bl as requestedSegmentId,
  rl as resolveEditorSegmentSelection,
  xl as resolveQueuedReviewRequest,
  wl as resolveSegmentCreationAction,
  Dl as resolveSegmentStudioRoute,
  fl as resolveSegmentStudioShortcuts,
  Ti as resolveSegmentTarget,
  Jc as resolveSelectedDerivationRule,
  na as resolveSelectedSegments,
  Mc as restoreDisabledToolbarActionFocus,
  Bc as restorePublishApprovedFocus,
  Du as restoreSegmentFieldsProjection,
  Ou as restoreSegmentsProjection,
  zd as retargetPendingChanges,
  $i as revealCollapsedSegmentGroup,
  zc as runSelectedDiscoveryAnalysis,
  Rn as sameSegmentIdentity,
  Ai as savingSegmentIdFrom,
  hi as segmentBadgeStyle,
  Ar as segmentGroupHeaderBackground,
  Gt as segmentGroupKeyForSegment,
  ho as segmentHistoryIdentity,
  fr as segmentHistoryState,
  Rt as segmentIdentity,
  vi as segmentRailItemStyle,
  $u as segmentStateStyle,
  du as segmentStudioActionTarget,
  Rl as segmentStudioLegacyMode,
  ed as segmentTimelineStyle,
  Pt as segmentsHistoryState,
  ll as selectAllVideoSegmentIds,
  Ll as selectedBrowseStates,
  Ii as selectedSwimlaneMerge,
  Sr as selectionReferenceForSegment,
  Pi as setBackLinkNavigation,
  Di as settlePendingChange,
  ud as sharedPerformerSlotShape,
  md as sharedTagPerformerSlotShape,
  Tn as shortcutAvailableInMode,
  bl as shortcutBindingDisplayText,
  vu as shortcutBindingFromEvent,
  Su as shortcutBindingsOverlap,
  ku as shortcutModesOverlap,
  gl as shortcutRequiresSingleSegment,
  Yn as shotBoundaryFingerprint,
  dd as shouldAcceptCurrentTagFromEnter,
  ld as shouldDismissPopover,
  xu as shouldExitShortcutCapture,
  Au as shouldHandleEditorShortcut,
  Aa as shouldLoadSegmentAnalysis,
  Na as shouldReloadAfterSegmentMutation,
  ro as shouldRestoreTransitionSelection,
  ql as shouldShowQuickSearchGroups,
  ra as splitShortcutCategoriesIntoColumns,
  pd as suggestDerivationRuleSlotMappings,
  er as swimlaneDisplayLabel,
  ad as swimlaneMarkerTop,
  rd as swimlaneStripeBackground,
  Nl as tagEditorLockedBySave,
  So as targetsOverlap,
  qs as timelineContentStyle,
  Qo as timelinePlayheadHorizontalStyle,
  nd as timelineSegmentWidth,
  Us as timelineTickAlignment,
  Ks as timelineTickPosition,
  Xr as timelineTimePercent,
  Id as toggleAllCollapsedSegmentGroups,
  hl as toggledSelectionReviewState,
  Wt as trapModalFocus,
  Vl as tryParseJsonResponseText,
  il as updateAnchoredSegmentSelection,
  cc as updateDiscoverySelection,
  nl as updateDualRangeValues,
  ol as updateSegmentCollectionSelection,
  al as updateSegmentRangeSelection,
  ri as updateSegmentSelection,
  Da as validateDerivationRuleDraft,
  Yo as validateSegmentTiming,
  po as videoPerformerOptions,
  Qr as videoPerformerSlotAssignments,
  El as visibleSegmentStudioSettingsTabs,
  Ml as visibleSegmentStudioTabs,
  Ni as visibleVirtualRows
};
