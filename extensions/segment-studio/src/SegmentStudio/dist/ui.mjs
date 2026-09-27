import oo from "@cove/runtime/react";
import { createPortal as Ss } from "@cove/runtime/react-dom";
import { extensionFetch as Aa } from "@cove/runtime/api";
import { formatDuration as ks, EntityReferenceSelector as Wn, useExtensionKeyboardBindings as ws, VideoPlayer as Ea, useRegisterExtensionKeyboardActions as Da, getDefaultFilter as Oa, useListUrlState as Pa, ListPage as La } from "@cove/runtime/components";
import { StepBack as Ns, StepForward as Is, Loader2 as Cs } from "@cove/runtime/lucide-react";
const ao = "com.midnightrider.segment-studio", ja = "segment-studio.layout.v1", dn = "segment-studio.operations.v1", Fa = "segment-studio.collapsed-segment-groups.v1", Ba = "segment-studio.playback-shortcuts.v1", Ga = "segment-studio.timing-clipboard.v1", Ka = "segment-studio.hide-derived-segments.v1", za = "segment-studio.merge-confirmation.v1", $t = ["unreviewed", "approved", "rejected"], $s = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], zo = "(min-width: 1024px) and (min-height: 640px)", Uo = "(min-width: 1024px) and (min-height: 900px)", Vn = 1e-3, Ho = 15, Ts = 30, Ua = 12, Dt = {
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
}, Qt = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function _o(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function Ha(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((a) => a.segment));
  return r.find((o) => o.id === t) ?? xr(e, null, 1, !0) ?? r[0] ?? null;
}
function xr(e, t, r, o = !1) {
  var m;
  const a = e.findIndex((u) => u.markers.some((y) => y.segment.id === t));
  if (a < 0) {
    if (!o) return null;
    const u = e.flatMap((y) => y.markers.map((b) => b.segment)).filter((y) => y.reviewState === "unreviewed");
    return r < 0 ? u.at(-1) ?? null : u[0] ?? null;
  }
  const i = e[a], s = i.markers.findIndex((u) => u.segment.id === t);
  if (!o)
    return ((m = (r < 0 ? i.markers.slice(0, s).reverse() : i.markers.slice(s + 1)).find((y) => y.segment.reviewState === "unreviewed")) == null ? void 0 : m.segment) ?? null;
  const l = e.flatMap((u) => u.markers.map((y) => y.segment)), d = l.findIndex((u) => u.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((u) => u.reviewState === "unreviewed") ?? null;
}
function Rs(e, t, r, o = null) {
  var d, c;
  const a = Number(t);
  if (!Number.isFinite(a)) return null;
  const i = e.flatMap((m, u) => m.markers.filter(({ segment: y }) => {
    const b = Number(y.startSec), p = y.endSec == null ? b + Ts : Number(y.endSec);
    return Number.isFinite(b) && Number.isFinite(p) && p >= b && b <= a + Ho + Vn && p >= a - Ho - Vn;
  }).map(({ segment: y }) => ({ segment: y, laneIndex: u }))).sort((m, u) => m.laneIndex - u.laneIndex || Math.abs(m.segment.startSec - a) - Math.abs(u.segment.startSec - a) || m.segment.id - u.segment.id);
  if (i.length === 0) return null;
  const s = e.findIndex((m) => m.markers.some((u) => u.segment.id === o));
  if (s < 0) return r < 0 ? i.at(-1).segment : i[0].segment;
  const l = i.filter((m) => m.laneIndex !== s);
  return l.length === 0 ? r < 0 ? i.at(-1).segment : i[0].segment : r < 0 ? ((d = l.findLast((m) => m.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((m) => m.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function Ms(e, t, r) {
  var i;
  const o = Number(r);
  if (!Number.isFinite(o) || t == null) return null;
  const a = (Array.isArray(e) ? e : []).find((s) => {
    var l;
    return (l = s.markers) == null ? void 0 : l.some(({ segment: d }) => d.id === t);
  });
  return a ? ((i = a.markers.map(({ segment: s }) => {
    const l = Number(s.startSec), d = s.endSec == null ? l : Number(s.endSec), c = Number.isFinite(d) && d >= l ? d : l, m = o < l ? l - o : o > c ? o - c : 0;
    return { segment: s, distance: m, startDistance: Math.abs(l - o) };
  }).filter((s) => Number.isFinite(s.distance)).sort((s, l) => s.distance - l.distance || s.startDistance - l.startDistance || String(s.segment.id).localeCompare(String(l.segment.id)))[0]) == null ? void 0 : i.segment) ?? null : null;
}
function Sr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function au(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, a) => e * a / (r - 1));
}
function As(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function iu(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function Es(e, t, r = 1, o = 48) {
  const a = Math.max(1, Math.ceil((Number(e) || 0) / 60)), i = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(a * Math.max(1, o) / i));
}
function Ds(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Os(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function Ps(e, t, r, o, a = 160, i = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - a - Math.max(0, Number(i) || 0)), l = a + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Jr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function Ls(e, t, r = 10) {
  const o = Jr(e, t), a = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - a)
  };
}
function qo(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function js(e, t = Ua) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function _a(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : Dt.timelineRatio;
}
function Yr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function sn(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? Dt.detailWidth : Math.min(Yr(t, 0), Math.max(240, e));
}
function yr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? Dt.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function Fs(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function so(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: Dt.timelineRatio, maximum: Dt.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function lo(e, t) {
  const r = _a(e);
  if (!(t > 0)) return r;
  const o = so(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function Bs(e) {
  if (!e) return { ...Dt };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? _a(r) : Dt.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: sn(t == null ? void 0 : t.detailWidth),
      markerRailWidth: sn(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: yr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...Dt };
  }
}
function Gs(e, t, r) {
  return r > 0 ? lo((t + r - e) / r, r) : Dt.timelineRatio;
}
function su(e, t, r, o, a = 2) {
  const i = Math.max(0, Number(a) || 0);
  return e < r + i ? e - r - i : t > o - i ? t - o + i : 0;
}
function Ks(e, t, r, o = null) {
  var d;
  const a = [...e].sort((c, m) => c.startSec - m.startSec || c.id - m.id), i = a.findIndex((c) => c.id === o), s = Number((d = a[i]) == null ? void 0 : d.startSec), l = Number(t);
  return i >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= Vn ? a[i + (r < 0 ? -1 : 1)] ?? null : r < 0 ? a.findLast((c) => c.startSec < l) ?? null : a.find((c) => c.startSec > l) ?? null;
}
function cr(e, t, r, o) {
  return e === t && r === o;
}
function zs({ beginRequest: e, fetchDetail: t, isCurrent: r, isSameVideo: o }) {
  let a = null, i = null;
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
      return o(c) && a !== m && i.videoId === c.videoId ? a : null;
    })();
    return a = m, i = c, m;
  };
}
const Cn = "__segment-studio-cleared-selection__";
function Us(e) {
  return e === "true";
}
function Hs(e) {
  return e !== "false";
}
function qa() {
  try {
    return Hs(window.localStorage.getItem(za));
  } catch {
    return !0;
  }
}
function Wa(e) {
  try {
    window.localStorage.setItem(za, String(!!e));
  } catch {
  }
}
function _s(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function Lt(e = {}) {
  const t = $t.filter((m) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(m) : !0), r = Number(e.performerId), o = Number(e.tagId), a = Number(e.segmentGroupId), i = e.segmentGroupId === "ungrouped" ? "ungrouped" : a > 0 ? a : null, s = String(e.sourceKey || "").trim() || null, l = (m, u) => {
    const y = Number(m);
    return Number.isFinite(y) ? Math.min(1, Math.max(0, y)) : u;
  }, d = l(e.confidenceMin, 0), c = l(e.confidenceMax, 1);
  return {
    reviewStates: t,
    performerId: r > 0 ? r : null,
    tagId: o > 0 ? o : null,
    segmentGroupId: i,
    sourceKey: s,
    confidenceMin: Math.min(d, c),
    confidenceMax: Math.max(d, c),
    includeUnscored: e.includeUnscored !== !1
  };
}
function zr(e, t, r, o = !1, a = []) {
  var c, m;
  const i = Lt(r), s = i.performerId == null ? null : new Set((t || []).filter((u) => Number(u.performerId) === i.performerId).map((u) => u.segmentId)), l = new Set((a || []).flatMap((u) => u.tags || []).map((u) => Number(u.tagId))), d = i.segmentGroupId == null || i.segmentGroupId === "ungrouped" ? null : new Set(((m = (c = (a || []).find((u) => Number(u.id) === i.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : m.map((u) => Number(u.tagId))) || []);
  return _s(e || [], o).filter((u) => {
    if (u.reviewState != null && !i.reviewStates.includes(u.reviewState) || s && !s.has(u.id) || i.tagId != null && Number(u.tagId) !== i.tagId || d && !d.has(Number(u.tagId)) || i.segmentGroupId === "ungrouped" && l.has(Number(u.tagId)) || i.sourceKey != null && u.sourceKey !== i.sourceKey) return !1;
    const y = Number(u.confidence);
    return u.confidence == null || !Number.isFinite(y) ? i.includeUnscored : y >= i.confidenceMin && y <= i.confidenceMax;
  });
}
function Va(e, t, r, o = !1, a = []) {
  var l;
  const i = Lt(r);
  if (!e) return { filters: i, hideDerivedSegments: o };
  if (i.reviewStates.includes(e.reviewState) || (i.reviewStates = Lt({
    ...i,
    reviewStates: [...i.reviewStates, e.reviewState]
  }).reviewStates), i.performerId != null && !(t || []).some((d) => d.segmentId === e.id && Number(d.performerId) === i.performerId) && (i.performerId = null), i.tagId != null && Number(e.tagId) !== i.tagId && (i.tagId = null), i.segmentGroupId != null) {
    const d = new Set((a || []).flatMap((c) => c.tags || []).map((c) => Number(c.tagId)));
    if (i.segmentGroupId === "ungrouped")
      d.has(Number(e.tagId)) && (i.segmentGroupId = null);
    else {
      const c = (a || []).find((m) => Number(m.id) === i.segmentGroupId);
      (l = c == null ? void 0 : c.tags) != null && l.some((m) => Number(m.tagId) === Number(e.tagId)) || (i.segmentGroupId = null);
    }
  }
  i.sourceKey != null && e.sourceKey !== i.sourceKey && (i.sourceKey = null);
  const s = Number(e.confidence);
  return e.confidence != null && Number.isFinite(s) && (i.confidenceMin = Math.min(i.confidenceMin, Math.floor(s * 100) / 100), i.confidenceMax = Math.max(i.confidenceMax, Math.ceil(s * 100) / 100)), (e.confidence == null || !Number.isFinite(s)) && (i.includeUnscored = !0), {
    filters: Lt(i),
    hideDerivedSegments: o && !e.isDerived
  };
}
function qs(e, t = !1) {
  const r = Lt(e);
  return +(r.reviewStates.length !== $t.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function Ws(e, t, r) {
  const o = Number(e), a = Number(t), i = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(a) || !(i > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - a) / i)) * 100) / 100;
}
function Vs(e, t, r, o) {
  const a = Math.round(Math.min(1, Math.max(0, Number(o))) * 100) / 100;
  if (r === "minimum") {
    const s = Math.min(a, t);
    return {
      minimum: s,
      maximum: t,
      coincidentTop: s === t ? "maximum" : "minimum"
    };
  }
  const i = Math.max(a, e);
  return {
    minimum: e,
    maximum: i,
    coincidentTop: i === e ? "minimum" : "maximum"
  };
}
function Js(e, t, r = null, o = {}) {
  if (t === Cn) return null;
  const a = t ?? r, i = (e || []).flatMap((s) => (s.markers || []).map((l) => l.segment)).find((s) => s.id === a);
  if (i) return i;
  if (o.reference) {
    const s = o.visibleLanes ?? e;
    return s.flatMap((d) => (d.markers || []).map((c) => c.segment)).find((d) => d.id === o.reference.id) ?? hr(s, o.reference);
  }
  return Ha(e);
}
function Ja(e, t, r, o = !1) {
  const a = [...new Set((e || []).filter((s) => s != null))];
  if (!o) return { selectedSegmentIds: [r], activeSegmentId: r };
  if (!a.includes(r))
    return { selectedSegmentIds: [...a, r], activeSegmentId: r };
  const i = a.filter((s) => s !== r);
  return i.length === 0 ? { selectedSegmentIds: a, activeSegmentId: t } : {
    selectedSegmentIds: i,
    activeSegmentId: r === t ? i.at(-1) ?? null : t
  };
}
function Ys(e, t, r) {
  const o = [...new Set((e || []).filter((s) => s != null))], a = [...new Set((r || []).filter((s) => s != null))];
  if (a.length === 0)
    return { selectedSegmentIds: o, activeSegmentId: t };
  const i = new Set(a);
  if (a.every((s) => o.includes(s))) {
    const s = o.filter((l) => !i.has(l));
    return s.length === 0 ? { selectedSegmentIds: o, activeSegmentId: t } : {
      selectedSegmentIds: s,
      activeSegmentId: i.has(t) ? s.at(-1) : t
    };
  }
  return {
    selectedSegmentIds: [.../* @__PURE__ */ new Set([...o, ...a])],
    activeSegmentId: a[0]
  };
}
function Qs(e, t, r, o, a = !1) {
  const i = [...new Set((o || []).filter((c) => c != null))], s = i.indexOf(t), l = i.indexOf(r);
  if (s < 0 || l < 0)
    return Ja(e, t, r, a);
  const d = i.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: a ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function Zs(e, t, r = null, o = !1) {
  const a = (e == null ? void 0 : e.selectedSegmentIds) || [], i = (e == null ? void 0 : e.activeSegmentId) ?? null, s = (e == null ? void 0 : e.anchorSegmentId) ?? i, l = (e == null ? void 0 : e.rangeBaseSegmentIds) || [];
  if (r) {
    const m = [...new Set(r)];
    if (!m.includes(s) || !m.includes(t))
      return {
        selectedSegmentIds: [t],
        activeSegmentId: t,
        anchorSegmentId: t,
        rangeBaseSegmentIds: []
      };
    const u = o ? [.../* @__PURE__ */ new Set([...l, ...a])] : l;
    return {
      ...Qs(u, s, t, m, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: u
    };
  }
  const d = Ja(a, i, t, o);
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
function Xs(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], a = new Set(o), i = [...new Set((e || []).filter((s) => a.has(s)))];
  return r != null && a.has(r) && !i.includes(r) && i.push(r), i.length === 0 && (e || []).length > 0 && o.length > 0 && i.push(o[0]), i;
}
function el(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function Wo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), a = Number(t == null ? void 0 : t.startSec) || 0, i = Math.max(a, Number((t == null ? void 0 : t.endSec) ?? a) || a);
  return i < r ? r - i : a > o ? a - o : 0;
}
function Vo(e, t, r, o = () => !0) {
  return (e || []).map((a) => a.segment).filter((a) => a && !r.has(a.id) && o(a)).sort((a, i) => Wo(t, a) - Wo(t, i) || Math.abs(Number(a.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(a.startSec) - Number(i.startSec) || Number(a.id) - Number(i.id))[0] ?? null;
}
function Qr(e, t) {
  return ((e == null ? void 0 : e.markers) || []).map((r) => r.segment).filter((r) => r && !t.has(r.id));
}
function Ur(e) {
  return e.reviewState === "unreviewed";
}
function Jo(e, t) {
  const r = Number(e.startSec) || 0;
  return r !== t.startSec ? r > t.startSec : Number(e.id) > Number(t.id);
}
function Yo(e, t, r, o, a) {
  if (t < 0)
    return Vo(e.flatMap((s) => s.markers || []), r, o, a);
  const i = e.map((s, l) => ({ lane: s, index: l })).filter(({ lane: s }) => Qr(s, o).some(a)).sort((s, l) => Math.abs(s.index - t) - Math.abs(l.index - t) || +(s.index < t) - +(l.index < t) || s.index - l.index);
  for (const { lane: s } of i) {
    const l = Vo(s.markers, r, o, a);
    if (l) return l;
  }
  return null;
}
function br(e, t) {
  var i;
  const r = (e || []).find((s) => (s.markers || []).some(({ segment: l }) => l.id === t)), o = (i = r == null ? void 0 : r.markers.find((s) => s.segment.id === t)) == null ? void 0 : i.segment;
  if (!o) return null;
  const a = Number(o.startSec) || 0;
  return {
    laneKey: r.key,
    id: o.id,
    startSec: a,
    endSec: Number(o.endSec ?? a) || a
  };
}
function hr(e, t, r = {}) {
  const o = e || [];
  if (o.length === 0) return null;
  const a = new Set(r.removedIds || []);
  if (t == null) {
    const s = { markers: o.flatMap((d) => d.markers || []) }, l = Qr(s, a);
    return l.find(Ur) ?? l[0] ?? null;
  }
  a.add(t.id);
  const i = o.findIndex((s) => s.key === t.laneKey);
  if (i >= 0) {
    const s = Qr(o[i], a).filter(Ur), l = s.find((c) => Jo(c, t));
    if (l) return l;
    const d = s.filter((c) => !Jo(c, t)).at(-1);
    if (d) return d;
  }
  return Yo(o, i, t, a, Ur) ?? Yo(o, i, t, a, () => !0);
}
function tl(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function Qo(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function nl() {
  try {
    return Us(window.localStorage.getItem(Ka));
  } catch {
    return !1;
  }
}
function rl(e) {
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
], ol = /* @__PURE__ */ new Set([
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
function al(e) {
  return ol.has(e);
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
function il(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Qn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, a]) => r.has(o) && Array.isArray(a)).map(([o, a]) => [o, a.slice(0, 4).map(Ya).filter(Boolean)]));
  } catch {
    return {};
  }
}
function sl(e = {}) {
  const t = il(e);
  return Qn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function Zo(e, t = 2) {
  const o = [...new Set(e.map((s) => s.category))].map((s, l) => ({
    category: s,
    index: l,
    shortcuts: e.filter((d) => d.category === s)
  })), a = Math.max(1, Math.min(o.length || 1, Math.floor(t) || 1)), i = Array.from({ length: a }, () => ({ groups: [], weight: 0 }));
  return [...o].sort((s, l) => l.shortcuts.length - s.shortcuts.length || s.index - l.index).forEach((s) => {
    const l = i.reduce((d, c) => c.weight < d.weight ? c : d);
    l.groups.push(s), l.weight += s.shortcuts.length + 2;
  }), i.map((s) => s.groups.sort((l, d) => l.index - d.index));
}
function lu(e) {
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
function du(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function Zr(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), a = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !a) return !1;
  const i = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (i && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function Xo(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function cu(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), a = Xo(e.code, t.key), i = Xo(t.code, e.key);
  if (!r && !o && !a && !i) return !1;
  const s = a ? t.key : e.key, l = a ? e.code : i ? t.code : o ? e.code : e.code || t.code;
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
          if (Zr(y, e) && Zr(y, t)) return !0;
        }
  return !1;
}
function $n(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function uu(e, t) {
  return [!1, !0].some((r) => $n(e, r) && $n(t, r));
}
function ll(e, t = !1, r = {}) {
  return sl(r).find((o) => $n(o, t) && o.bindings.some((a) => Zr(e, a))) || null;
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
function dl(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Qa).join(" / ") : "Unassigned";
}
function mu(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, dl(o)].some((a) => String(a || "").toLowerCase().includes(r))) : e;
}
function gu(e) {
  return e === "review" ? "review" : "editor";
}
function nt(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((a) => a.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function cl(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function ul(e, t, r) {
  const o = t.map(({ id: i, itemId: s, nativeSegmentId: l }) => ({
    id: i,
    itemId: s,
    nativeSegmentId: l
  })), a = o.find((i) => i.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: a };
}
function ml(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((a) => nt(t, a)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: nt(t, e.activeIdentity) || r[0]
  };
}
function gl(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function pu(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((a) => gl(o, a))));
}
function ea(e, t) {
  var o;
  if (e) {
    const a = (t == null ? void 0 : t.nativeSegmentId) ?? (t == null ? void 0 : t.id) ?? null;
    if (a == null) throw new Error("Duplicate response did not include a stable native identity.");
    return { nativeSegmentId: a };
  }
  const r = ((o = t == null ? void 0 : t.createdDraft) == null ? void 0 : o.itemId) ?? null;
  if (r == null) throw new Error("Duplicate response did not include a stable item identity.");
  return { itemId: r };
}
function pl(e, t, r, o) {
  const a = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${a}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${a}`;
}
function fl(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const a = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(a) && a > 0 ? { kind: "create", tagId: a, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function yl(e, t, r) {
  return e != null && (r == null || t !== r);
}
function bl(e, t, r, o = null) {
  if (r === t.tagId) return null;
  const a = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: r,
    tagName: o || ((a == null ? void 0 : a.tagId) === r ? a.tagName : null)
  };
}
function hl({ tagEditing: e, selectedSegmentIds: t, activeSegmentId: r }, o) {
  return !(e && r === o && (t == null ? void 0 : t.length) === 1 && t[0] === o);
}
function Xr(e, t) {
  return e === t;
}
function vl(e, t, r) {
  const o = (e || []).find((a) => a.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((a) => a.itemId === o.itemId) || null;
}
function xl(e, t, r) {
  const o = [...e || []].sort((a, i) => a.startSec - i.startSec || a.id - i.id);
  return r < 0 ? o.filter((a) => a.startSec < t - Vn).at(-1) || null : o.find((a) => a.startSec > t + Vn) || null;
}
function Hr(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function ta(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: $t.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function fu(e, t = null, r = !1) {
  const o = ta(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function Nn(e, t, r, o) {
  const a = Number(e);
  return Number.isFinite(a) ? Math.min(o, Math.max(r, a)) : t;
}
function Za(e) {
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
function Sl(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function Xa() {
  try {
    return Za(window.localStorage.getItem(Ba));
  } catch {
    return { ...io };
  }
}
function na(e) {
  const t = Za(JSON.stringify(e));
  try {
    window.localStorage.setItem(Ba, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Zt = Object.freeze({
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
  analysisReview: "analysis.review",
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
function ei(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", a = t && r && o;
  return {
    schemaVersion: a ? 1 : 0,
    requestedMode: a ? eo(e.requestedMode) : "basic",
    effectiveMode: a ? eo(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: a && e.legacyCompatibilityRequired === !0,
    capabilities: a && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((i) => typeof i == "string"))] : []
  };
}
function Tn(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function kl(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function wl(e) {
  const t = [];
  return Tn(e, Zt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), Tn(e, Zt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function Nl(e) {
  return [
    ["general", "General", Zt.settingsGeneral],
    ["shortcuts", "Shortcuts", Zt.settingsShortcuts],
    ["performer-slots", "Performer slots", Zt.settingsPerformerSlots],
    ["derivation", "Derivation", Zt.settingsDerivation]
  ].filter(([, , r]) => Tn(e, r)).map(([r, o]) => [r, o]);
}
function Il(e, t) {
  return e === "segments" && !Tn(
    t,
    Zt.navigationSegmentInventory
  ) || e === "bin" && !Tn(
    t,
    Zt.recyclingBinView
  ) ? "videos" : e;
}
function Cl(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function $l(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, a = Number(t), i = Number.isFinite(a) && a >= 0 ? Math.trunc(a) : 0, s = i > 0 ? `

${i} collected incorrect ${i === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
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
}, ra = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: $t.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function Tl(e) {
  const t = String(e || "").split(",").filter((r) => $t.includes(r));
  return t.length === 0 ? [...$t] : [...new Set(t)];
}
function In(e) {
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
      values: Object.fromEntries(Object.entries(r).filter(([o, a]) => o && Number.isInteger(Number(a)) && Number(a) > 0))
    };
  } catch {
    return { activityTagId: null, values: {} };
  }
}
function qr(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function oa(e, t) {
  var l;
  const r = aa(t.activitiesCriterion, t.activityId), o = aa(t.performersCriterion, t.performerId), a = r.length === 1 ? r[0] : null, i = ti(t.slots), s = a && (i.activityTagId == null || i.activityTagId === a) ? Object.entries(i.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: a,
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
function aa(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function Rl(e, t) {
  return $t.includes(e == null ? void 0 : e.value) ? [e.value] : Tl(t);
}
function ni(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Ml(e) {
  var a;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((a = e.videoFile) == null ? void 0 : a.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Al(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function ia(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function El(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((a) => a.id === e);
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
function tn(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function sa(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(tn).sort().join(",")}`;
}
function ri(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((b) => String(b.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const a = e[0].allowSamePerformerInMultipleSlots === !0, i = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (i === 0) return [];
  if (o.length === 0 && e.every((b) => {
    var p;
    return !((p = b.genderHints) != null && p.length);
  }) && e.length === t.length && !a) {
    const b = [...e].sort((f, w) => String(f.slotDefinitionId).localeCompare(String(w.slotDefinitionId))), p = [...t].sort((f, w) => String(f.name).localeCompare(String(w.name)) || Number(ct(f)) - Number(ct(w)));
    return [{
      assignments: Object.fromEntries(b.map((f, w) => [String(f.slotDefinitionId), String(ct(p[w]))])),
      description: p.map((f) => f.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((b) => t.map((p, f) => ({ performer: p, index: f })).filter(({ performer: p }) => {
    var f;
    return !((f = b.genderHints) != null && f.length) || b.genderHints.some((w) => tn(w) === tn(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), m = a ? c.filter((b) => b.length > 0).length : la(c, t.length);
  if (m === 0) return [];
  const u = new Map(t.map((b, p) => [String(ct(b)), p]));
  function y(b, p, f) {
    if (s.length >= i) return;
    const w = c.slice(b), R = a ? w.filter((q) => q.length > 0).length : la(w.map((q) => q.filter((F) => !p.has(String(ct(t[F]))))), t.length);
    if (f + R < m) return;
    if (b === e.length) {
      if (f !== m) return;
      const q = Object.fromEntries(d.map(({ slot: M, performer: $ }) => [String(M.slotDefinitionId), $ ? String(ct($)) : ""])), F = o.length === 0 ? Object.values(q).sort().join(",") : [...new Set(e.map((M) => String(M.label || "")))].map((M) => `${M}:${d.filter(({ slot: $ }) => String($.label || "") === M).map(({ performer: $ }) => $ ? String(ct($)) : "").sort().join(",")}`).join("|");
      !l.has(F) && s.length < i && (l.add(F), s.push({
        assignments: q,
        description: d.map(({ slot: M, performer: $ }) => o.length ? `${M.label}: ${($ == null ? void 0 : $.name) || "Unassigned"}` : ($ == null ? void 0 : $.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const g = e[b], B = [...d].reverse().find(({ slot: q }) => sa(q) === sa(g)), U = B ? u.get(String(ct(B.performer))) : -1;
    for (const q of c[b]) {
      const F = t[q], M = ct(F);
      if (!(q < U) && !(M == null || !a && p.has(String(M))) && (d.push({ slot: g, performer: F }), a || p.add(String(M)), y(b + 1, p, f + 1), a || p.delete(String(M)), d.pop(), s.length >= i))
        return;
    }
    d.push({ slot: g, performer: null }), y(b + 1, p, f), d.pop();
  }
  return y(0, /* @__PURE__ */ new Set(), 0), s;
}
function la(e, t) {
  const r = Array(t).fill(-1);
  function o(a, i) {
    for (const s of e[a])
      if (!i.has(s) && (i.add(s), r[s] === -1 || o(r[s], i)))
        return r[s] = a, !0;
    return !1;
  }
  return e.reduce((a, i, s) => a + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Dl(e, t) {
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
  const a = /* @__PURE__ */ new Map(), i = [];
  function s(l, d) {
    var m;
    if (a.size > 1) return;
    if (l === e.length) {
      const u = [...new Set(e.map((y) => y.label || ""))].map((y) => `${y}:${i.filter((b) => (b.slot.label || "") === y).map((b) => b.performer.performerId).sort((b, p) => b - p).join(",")}`).join("|");
      a.has(u) || a.set(u, [...i]);
      return;
    }
    const c = e[l];
    for (const u of t)
      !o && d.has(u.performerId) || (m = c.genderHints) != null && m.length && !c.genderHints.some((y) => tn(y) === tn(u.gender)) || (i.push({ slot: c, performer: u }), o || d.add(u.performerId), s(l + 1, d), o || d.delete(u.performerId), i.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), a.size === 1 ? [...a.values()][0] : null;
}
function Ol(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = r.assignment || [], a = o.map(({ slot: l, performer: d }) => `${l.slotDefinitionId}:${d.performerId}`).join("|"), i = `${r.tagId}:${a}`;
    t.has(i) || t.set(i, {
      key: i,
      tagName: r.tagName || "Tag segment",
      candidates: [],
      assignment: o,
      counts: { unreviewed: 0, approved: 0, rejected: 0 }
    });
    const s = t.get(i);
    s.candidates.push(r), s.counts[r.reviewState] = (s.counts[r.reviewState] || 0) + 1;
  }
  return [...t.values()].map((r) => ({
    ...r,
    candidates: [...r.candidates].sort((o, a) => o.startSec - a.startSec || (o.endSec ?? o.startSec) - (a.endSec ?? a.startSec) || o.id - a.id)
  }));
}
function Pl(e, t, r = 20) {
  const o = String(t || "").trim().toLocaleLowerCase(), a = (i) => {
    var d;
    if (!o) return !0;
    const s = String(((d = i.segment) == null ? void 0 : d.tagName) || i.tagName || "").toLocaleLowerCase();
    if (s.includes(o)) return !0;
    let l = -1;
    for (const c of o) {
      const m = s.indexOf(c, l + 1);
      if (m < 0) return !1;
      l = m;
    }
    return !0;
  };
  return (e || []).filter(a).slice(0, Math.max(1, Number(r) || 20));
}
function Ll(e) {
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
function oi(e, t, r) {
  const o = ct, a = new Set((t || []).map(o)), i = new Set((r || []).map(tn));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? a.has(o(l)), m = d.isVideoPerformer ?? a.has(o(d));
    if (c !== m) return m - c;
    const u = tn(l.gender || l.genderIdentity), y = tn(d.gender || d.genderIdentity), b = l.matchesGenderHint ?? i.has(u);
    return (d.matchesGenderHint ?? i.has(y)) - b || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: pe, useId: ai, useLayoutEffect: da, useMemo: qe, useReducer: Fl, useRef: me, useState: z, useSyncExternalStore: Bl } = oo, n = oo.createElement, ii = "/api/plugins/segment-studio";
function Ue(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(dn) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = to();
    return t[e] = r, window.localStorage.setItem(dn, JSON.stringify(t)), r;
  } catch {
    return to();
  }
}
function He(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(dn) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(dn, JSON.stringify(t));
  } catch {
  }
}
function uo(e) {
  try {
    return JSON.parse(window.localStorage.getItem(dn) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function mo(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(dn) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(dn, JSON.stringify(t));
  } catch {
  }
}
function Gl(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function Kl(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const a = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(a), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function Z(e, t, r = 0) {
  var d;
  const o = await Aa(`${ii}${e}`, t);
  if (o.status === 204) return null;
  const a = await o.text(), i = Gl(a);
  if (!o.ok) {
    const c = new Error(((d = i.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = i.value, c;
  }
  if (i.parsed) return i.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await Kl(250 * (r + 1), t == null ? void 0 : t.signal), Z(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function zl(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${ii}${e}`, o = await Aa(r, t);
  if (!o.ok) {
    const a = await o.json().catch(() => null);
    throw new Error((a == null ? void 0 : a.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: Ul(
      o.headers.get("Content-Disposition")
    )
  };
}
function Ul(e, t = "segment-studio-ai-feedback.zip") {
  var s, l, d;
  const r = String(e || ""), o = (s = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(r)) == null ? void 0 : s[1];
  let a = null;
  if (o)
    try {
      a = decodeURIComponent(o.replace(/^"|"$/g, ""));
    } catch {
      a = null;
    }
  if (!a) {
    const c = /filename\s*=\s*(?:"([^"]+)"|([^;]+))/i.exec(r);
    a = (c == null ? void 0 : c[1]) || ((l = c == null ? void 0 : c[2]) == null ? void 0 : l.trim()) || null;
  }
  return ((d = a == null ? void 0 : a.split(/[\\/]/).pop()) == null ? void 0 : d.replace(/[\u0000-\u001f\u007f]/g, "").trim()) || t;
}
function Ae(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), a = Math.floor(o / 3600), i = Math.floor(o % 3600 / 60), s = o % 60, l = a > 0 ? `${a}:${String(i).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${i}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function to() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function si(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function Hl(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, a = Number(e.retainedSharedSegmentCount) || 0, i = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = a > 0 ? ` ${a} shared derived segment${a === 1 ? "" : "s"} will be kept.` : "", c = i > 0 ? ` ${i} feedback-protected rejected segment${i === 1 ? "" : "s"} will be kept until ${i === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function li(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), a = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: a };
}
function _l(e, t) {
  const { sceneCount: r, segmentCount: o } = li(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function di(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = li(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(_l(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const a = `bin-empty:${e.fingerprint}`, i = await Z("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Ue(a),
      expectedFingerprint: e.fingerprint
    })
  });
  return He(a), {
    status: "emptied",
    sceneCount: Array.isArray(i.videoIds) ? i.videoIds.length : o.sceneCount,
    segmentCount: Number(i.deletedCount) || o.segmentCount
  };
}
function ca({ children: e }) {
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
function yu(e, t) {
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
function ql(e, t, r = "not-applicable", o = !1) {
  const a = Bt[e] || Bt.unreviewed, i = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: a.row.borderLeftColor,
    backgroundColor: i,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Wl(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Vl(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function Jl(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function Yl(e, t) {
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
function Ql(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function cn({ state: e, includeLabel: t = !0 }) {
  const r = Bt[e] || Bt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: ci(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function Zl(e, t = null) {
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
function bu(e, t) {
  var i, s, l;
  if (!t) return !1;
  const r = e.target, o = ((i = e.view) == null ? void 0 : i.document) ?? (r == null ? void 0 : r.ownerDocument), a = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || a === t || ((l = t.contains) == null ? void 0 : l.call(t, a)) || r === (o == null ? void 0 : o.body) && a === o.body;
}
function Xl(e, t = document) {
  return !(e.defaultPrevented || Zl(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function hu(e, t = document, r = !1, o = {}) {
  return Xl(e, t) ? ll(e, r, o) != null : !1;
}
function ed(e, t, r = null) {
  return !(!t || e instanceof Element && (t.contains(e) || r != null && r.contains(e)));
}
function Ot(e, { onCancel: t, onConfirm: r } = {}) {
  var s, l;
  if (e.key === "Enter" && (e.isComposing || (s = e.nativeEvent) != null && s.isComposing || e.keyCode === 229)) return !1;
  const o = typeof ((l = e.target) == null ? void 0 : l.closest) == "function" ? e.target.closest("button, a, select, option, textarea") : e.target, a = String((o == null ? void 0 : o.tagName) || "").toLowerCase();
  if (a === "select" || a === "option") return !1;
  if (e.key === "Enter" && e.repeat && (a === "button" || a === "a"))
    return e.preventDefault(), !1;
  if (e.key === "Enter" && (e.repeat || ["button", "a", "textarea"].includes(a))) return !1;
  const i = e.key === "Escape" ? t : e.key === "Enter" ? r : null;
  return i ? (e.preventDefault(), e.stopPropagation(), i(), !0) : !1;
}
function td(e, t) {
  var o, a, i, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (i = (a = e.currentTarget) == null ? void 0 : a.querySelector) == null ? void 0 : i.call(a, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function nd({ confirm: e, cancel: t, confirmReady: r }) {
  const o = r && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function go({ confirmRef: e, cancelRef: t, confirmReady: r }) {
  pe(() => {
    const o = requestAnimationFrame(() => nd({
      confirm: e.current,
      cancel: t == null ? void 0 : t.current,
      confirmReady: r
    }));
    return () => cancelAnimationFrame(o);
  }, [r]);
}
function Wt(e) {
  var i;
  if (e.key !== "Tab") return !1;
  const t = [...e.currentTarget.querySelectorAll(
    "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
  )].filter((s) => !s.hidden && s.getAttribute("aria-hidden") !== "true");
  if (t.length === 0)
    return e.preventDefault(), e.currentTarget.focus(), !0;
  const r = t[0], o = t[t.length - 1], a = (i = e.currentTarget.ownerDocument) == null ? void 0 : i.activeElement;
  return !t.includes(a) || !e.shiftKey && a === o || e.shiftKey && a === r ? (e.preventDefault(), (e.shiftKey ? o : r).focus(), !0) : !1;
}
function ua(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, a = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? a.filter((i) => i.sequence > o && i.sequence <= r).sort((i, s) => s.sequence - i.sequence).map((i) => ({ action: i, direction: "backward", state: i.beforeState })) : a.filter((i) => i.sequence > r && i.sequence <= o).sort((i, s) => i.sequence - s.sequence).map((i) => ({ action: i, direction: "forward", state: i.afterState }));
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
function Pt(e, t = !0) {
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
    entries: (e || []).map(({ segment: r, result: o, example: a }) => ({
      exampleId: (o == null ? void 0 : o.exampleId) ?? (a == null ? void 0 : a.id) ?? null,
      originalIdentity: po(r),
      collectedIdentity: {
        itemId: (o == null ? void 0 : o.itemId) ?? (a == null ? void 0 : a.itemId) ?? null,
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
    r.sort((o, a) => o.sortOrder - a.sortOrder || String(o.slotDefinitionId).localeCompare(String(a.slotDefinitionId)));
  return t;
}
function fo(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function rd(e, t) {
  const r = (t || []).map((a) => gi(e, a.id));
  if (r.length === 0 || r.some((a) => a.length === 0)) return null;
  const o = (a) => a.map((i) => JSON.stringify({
    label: Tt(i),
    genderHints: [...i.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: i.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((a) => o(a) === o(r[0])) ? r : null;
}
function od(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : rd(e, t);
}
function ad({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const a = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return a.length === 0 ? "Choose one segment to edit it." : a.length === 1 ? `Selected segments can be ${a[0]}.` : `Selected segments can be ${a.slice(0, -1).join(", ")} or ${a.at(-1)}.`;
}
function vu(e, t) {
  return fo(gi(e, t));
}
function Tt(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function id(e, t) {
  const r = (d) => Tt(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), a = (d) => {
    const c = /* @__PURE__ */ new Map();
    for (const m of d || []) {
      const u = r(m);
      c.has(u) || c.set(u, []), c.get(u).push(m);
    }
    return c;
  }, i = a(e), s = a(t), l = [];
  for (const [d, c] of i) {
    const m = s.get(d);
    if (!m || c.length !== m.length)
      continue;
    const u = [...c].sort(o), y = [...m].sort(o);
    u.forEach((b, p) => l.push({
      sourceSlotDefinitionId: b.id,
      derivedSlotDefinitionId: y[p].id
    }));
  }
  return l;
}
function sd(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = id(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function ld(e) {
  const t = Tt(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, a = String((e == null ? void 0 : e.performerName) || "").trim(), i = o ? a || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(Ir).filter(Boolean);
  return {
    label: t,
    performer: i,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${i}`
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
function ma(e) {
  const t = [], r = [...e.segments].sort((i, s) => i.startSec - s.startSec || i.id - s.id).map((i) => {
    const s = Number(i.startSec) || 0, l = i.endSec == null ? s : Number(i.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((m) => m.end <= s && m.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: i, track: c };
  }), { segments: o, ...a } = e;
  return {
    ...a,
    markers: r,
    counts: wr(o),
    trackCount: Math.max(1, t.length)
  };
}
function dd(e) {
  const t = e.map(Tt), r = /* @__PURE__ */ new Map();
  for (const a of t) r.set(a, (r.get(a) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((a, i) => {
    const s = t[i], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(a.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function cd(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], m = d.length > 0 && d.every((u) => Number(u.performerId) > 0) ? d.map((u) => `${u.slotDefinitionId}:${Number(u.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: m };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [ma({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
  const a = o.map((l) => r.find((d) => d.signature === l).slots), i = new Set((a[0] || []).filter((l) => a.every((d) => d.some((c) => String(c.slotDefinitionId) === String(l.slotDefinitionId) && Number(c.performerId) === Number(l.performerId)))).map((l) => String(l.slotDefinitionId))), s = /* @__PURE__ */ new Map();
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
        const c = dd(l.slots), m = l.slots.filter((f) => !i.has(String(f.slotDefinitionId))), u = o.length === 1 ? l.slots : m, y = u.map((f) => `${c.get(String(f.slotDefinitionId))} · ${f.performerName || `Performer ${f.performerId}`}`).join(" · "), b = [...new Map(u.map((f) => [
          Number(f.performerId),
          { id: Number(f.performerId), name: f.performerName || `Performer ${f.performerId}` }
        ])).values()], p = l.slots.map((f) => ({
          slotDefinitionId: String(f.slotDefinitionId),
          label: c.get(String(f.slotDefinitionId)),
          performer: {
            id: Number(f.performerId),
            name: f.performerName || `Performer ${f.performerId}`
          }
        }));
        s.set(d, {
          ...e,
          key: `${e.key}:performers:${d}`,
          performerLabel: y,
          performers: b,
          performerAssignments: p,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(ma);
}
function ln(e, t = [], r = []) {
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
  const a = /* @__PURE__ */ new Map();
  for (const s of e) {
    const l = s.tagName || "Tag segment", d = s.tagId == null ? `name:${l}` : `tag:${s.tagId}`;
    if (!a.has(d)) {
      const m = o.get(s.tagId);
      a.set(d, {
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
    a.get(d).segments.push(s);
  }
  const i = /* @__PURE__ */ new Map();
  for (const s of r || [])
    i.has(s.segmentId) || i.set(s.segmentId, []), i.get(s.segmentId).push(s);
  for (const s of i.values())
    s.sort((l, d) => l.sortOrder - d.sortOrder || String(l.slotDefinitionId).localeCompare(String(d.slotDefinitionId)));
  return [...a.values()].sort((s, l) => s.segmentGroupSortOrder - l.segmentGroupSortOrder || s.segmentGroupTagSortOrder - l.segmentGroupTagSortOrder || (s.tagSortName || s.label).localeCompare(l.tagSortName || l.label, void 0, {
    sensitivity: "base"
  }) || s.key.localeCompare(l.key)).flatMap((s) => cd(s, i));
}
function yo(e) {
  var r;
  const t = [];
  for (const o of e) {
    const a = o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`;
    let i = t.at(-1);
    (!i || i.key !== a) && (i = {
      key: a,
      id: o.segmentGroupId,
      name: o.segmentGroupName || "Ungrouped",
      lanes: [],
      counts: { unreviewed: 0, approved: 0, rejected: 0 }
    }, t.push(i)), i.lanes.push(o);
    for (const s of $t)
      i.counts[s] += Number((r = o.counts) == null ? void 0 : r[s]) || 0;
  }
  return t;
}
function fi(e) {
  return (e || []).some((t) => t.id != null);
}
const ud = {
  group: 38,
  lane: 33,
  segment: 41
};
function md(e, t = []) {
  const r = new Set(t || []), o = [];
  let a = 0;
  const i = (s) => {
    const l = ud[s.kind];
    o.push({ ...s, top: a, height: l }), a += l;
  };
  for (const s of e || [])
    if (i({ kind: "group", key: `${s.key}:header`, group: s }), !r.has(s.key))
      for (const l of s.lanes || []) {
        i({ kind: "lane", key: `${l.key}:label`, group: s, lane: l });
        for (const d of l.markers || [])
          i({ kind: "segment", key: `segment:${d.segment.id}`, group: s, lane: l, segment: d.segment });
      }
  return { rows: o, height: a };
}
function yi(e, t, r, o = 240) {
  const a = Math.max(0, Number(t) - o), i = Math.max(a, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= a && s.top <= i);
}
function gd(e, t = [], r = !0) {
  const o = new Set(t || []), a = [];
  let i = 0;
  const s = (l, d) => {
    a.push({ ...l, top: i, height: d }), i += d;
  };
  for (const l of e || [])
    if (r && s({ kind: "group", key: `header:${l.key}`, group: l }, 32), !o.has(l.key))
      for (const [d, c] of (l.lanes || []).entries()) {
        const m = Math.max(1.75, c.trackCount * 1.25 + 0.5) * 16;
        s({ kind: "lane", key: c.key, group: l, lane: c, laneIndex: d }, m);
      }
  return { rows: a, height: i };
}
function pd(e, t) {
  const r = new Set(t || []), o = (e || []).map((a) => {
    const i = (a.markers || []).filter(({ segment: s }) => r.has(s.id));
    return i.length === 0 ? null : {
      ...a,
      selectedCount: i.length,
      counts: wr(i.map(({ segment: s }) => s)),
      markers: i
    };
  }).filter(Boolean);
  return yo(o).map((a) => {
    const i = a.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...a,
      selectedCount: i.length,
      counts: wr(i)
    };
  });
}
function bi(e, { nativeOnly: t = !1 } = {}) {
  const r = (e || []).flatMap((a) => a.lanes || []);
  if (r.length !== 1 || (r[0].markers || []).length < 2) return null;
  const o = r[0].markers.map(({ segment: a }) => a).sort((a, i) => a.startSec - i.startSec || (a.nativeSegmentId ?? a.itemId ?? a.id) - (i.nativeSegmentId ?? i.itemId ?? i.id));
  return t && o.some((a) => a.nativeSegmentId == null) || !t && new Set(o.map((a) => a.nativeSegmentId != null ? "native" : "extension")).size !== 1 ? null : {
    lane: r[0],
    segments: o,
    startSec: o[0].startSec,
    endSec: Math.max(...o.map((a) => a.endSec ?? a.startSec))
  };
}
function ga(e, t) {
  const r = new Set(t.removedSegmentIds || []), o = new Set(t.removedItemIds || []), a = t.survivor, i = (e.segments || []).filter((c) => !r.has(c.id)).map((c) => c.id === a.id ? { ...c, ...a } : c);
  i.some((c) => c.id === a.id) || i.push(a);
  const s = t.performerSlots == null ? e.performerSlots : (e.performerSlots || []).filter((c) => c.segmentId !== a.id && !r.has(c.segmentId)).concat(t.performerSlots), l = { ...e.performerSlotRevisions || {} };
  t.performerSlotRevisions != null && (delete l[a.id], r.forEach((c) => delete l[c]), Object.assign(l, t.performerSlotRevisions));
  const d = { ...e.itemMetadata || {} };
  return t.itemMetadata != null && (a.itemId != null && delete d[a.itemId], o.forEach((c) => delete d[c]), Object.assign(d, t.itemMetadata)), {
    ...e,
    segments: i,
    performerSlots: s,
    performerSlotRevisions: l,
    itemMetadata: d,
    approvedSetVersion: t.approvedSetVersion ?? e.approvedSetVersion
  };
}
function rn(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function Jn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function fd(e) {
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
    }, o ? fd(e.name) : "—"),
    o ? n("img", {
      key: "image",
      src: `/api/performers/${e.id}/image?max=64`,
      alt: "",
      loading: "lazy",
      className: "absolute inset-0 h-full w-full object-cover",
      onError: (a) => {
        a.currentTarget.style.display = "none";
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
  const o = me(null), a = `performer-slots-${ai()}`, [i, s] = z(null);
  function l() {
    var b;
    const c = (b = o.current) == null ? void 0 : b.getBoundingClientRect();
    if (!c) return;
    const m = Math.max(0, Math.min(256, window.innerWidth - 16)), u = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), y = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - m - 8, c.right - m)),
      top: y >= u + 8 ? c.bottom + 4 : Math.max(8, c.top - u - 4),
      width: m
    });
  }
  pe(() => {
    if (i)
      return window.addEventListener("scroll", l, !0), window.addEventListener("resize", l), () => {
        window.removeEventListener("scroll", l, !0), window.removeEventListener("resize", l);
      };
  }, [i != null, t == null ? void 0 : t.length]);
  const d = (t || []).map((c) => `${c.label}: ${c.performer.name}`).join(", ") || "Performer assignments";
  return r ? n("span", {
    ref: o,
    tabIndex: 0,
    className: "relative ml-auto flex shrink-0 -space-x-1 rounded-full focus:outline-none focus:ring-2 focus:ring-accent",
    "aria-label": d,
    "aria-describedby": a,
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
    i ? Ss(n("span", {
      id: a,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...i, maxHeight: "calc(100vh - 1rem)" }
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
function yd(e, t) {
  const r = new Set(rn(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function vi(e, t) {
  return t ? rn(e).filter((r) => r !== t) : rn(e);
}
function bd(e, t) {
  const r = rn(t), o = new Set(rn(e));
  return r.length > 0 && r.every((a) => o.has(a)) ? [] : r;
}
function Ft(e, t) {
  const r = (e || []).find((o) => o.markers.some((a) => a.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function pa(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const a = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), m = Number.isFinite(c) && c >= d ? c : d, u = d <= o && m >= o, y = u ? 0 : Math.min(Math.abs(o - d), Math.abs(o - m));
    return { contains: u, distance: y, duration: m - d, start: d };
  }, i = a(e), s = a(t);
  return Number(s.contains) - Number(i.contains) || (i.contains && s.contains ? s.duration - i.duration : i.distance - s.distance) || i.start - s.start || e.segment.id - t.segment.id;
}
function no(e, t, r, o = null) {
  var m, u, y, b, p, f;
  const a = e.findIndex((w) => w.markers.some((R) => R.segment.id === t));
  if (a < 0) {
    const w = [...((m = e[0]) == null ? void 0 : m.markers) || []];
    return o != null && Number.isFinite(Number(o)) && w.sort((R, g) => pa(R, g, o)), ((u = w[0]) == null ? void 0 : u.segment) ?? null;
  }
  const i = e[a], s = i.markers.findIndex((w) => w.segment.id === t);
  if (r === "left" || r === "right") {
    const w = r === "left" ? -1 : 1, R = Math.min(i.markers.length - 1, Math.max(0, s + w));
    return ((y = i.markers[R]) == null ? void 0 : y.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, a + (r === "up" ? -1 : 1))), d = Number((b = i.markers[s]) == null ? void 0 : b.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === a ? ((p = i.markers[s]) == null ? void 0 : p.segment) ?? null : ((f = [...e[l].markers].sort(c ? (w, R) => pa(w, R, Number(o)) : (w, R) => Math.abs(w.segment.startSec - d) - Math.abs(R.segment.startSec - d) || w.segment.startSec - R.segment.startSec || w.segment.id - R.segment.id)[0]) == null ? void 0 : f.segment) ?? null;
}
function hd(e, t, r) {
  const o = (e || []).find((i) => i.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const a = no([o], t, r);
  return a ? { segment: a, segmentIds: o.markers.map((i) => i.segment.id) } : null;
}
function vd(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function xd(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function Sd(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [ba(r)];
  const a = o - r, i = a < 30 ? [4] : a < 60 ? [4, 20] : a < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(i.map((l) => ba(Math.min(s, r + l))))];
}
function kd(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), a = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(a) ? "remove" : "collect",
    segments: r
  };
}
function wd(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function _n(e, t) {
  if (!e || !t) return e;
  const r = new Set(t.removedSegmentIds || []), o = new Map(
    (t.identityChanges || []).map((c) => [c.previousId, c.currentId])
  ), a = new Map(
    [...t.upsertedSegments || [], ...t.upsertedBasicSegments || []].map((c) => [c.id, c])
  ), i = (e.segments || []).filter((c) => !r.has(c.id)).map((c) => a.has(c.id) ? { ...c, ...a.get(c.id) } : c), s = new Set(i.map((c) => c.id));
  for (const c of a.values())
    s.has(c.id) || i.push(c);
  i.sort((c, m) => Number(c.startSec) - Number(m.startSec) || String(c.key || "").localeCompare(String(m.key || "")));
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
    segments: i,
    performerSlots: l,
    performerSlotRevisions: d
  };
}
function fa(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const a = new Set(
    (Array.isArray(t) ? t : []).map((i) => i == null ? void 0 : i.itemId).filter((i) => i != null)
  );
  return a.size === 0 ? o : o.filter((i) => (i == null ? void 0 : i.itemId) == null || !a.has(i.itemId));
}
function Nd(e) {
  if (!Array.isArray(e)) return [];
  const t = [], r = /* @__PURE__ */ new Map();
  for (const o of e) {
    if (!o) continue;
    const a = String(o.tagName || "").trim() || "Tag segment";
    let i = r.get(a);
    i || (i = { tagName: a, examples: [] }, r.set(a, i), t.push(i)), i.examples.push(o);
  }
  return t;
}
async function Id(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await ya(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const a = o.getContext("2d");
    if (!a)
      throw new Error("This browser cannot capture video frames.");
    const i = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], m = Sd(
        d.startSec,
        d.endSec
      );
      for (const [u, y] of m.entries()) {
        Math.abs(r.currentTime - y) > 5e-4 && (r.currentTime = y, await ya(r, "seeked")), a.drawImage(r, 0, 0, o.width, o.height);
        const b = await Cd(o), p = `example-${l + 1}-frame-${u + 1}`;
        c.push({ fieldName: p, timestampSec: y }), s.push({
          fieldName: p,
          file: new File(
            [b],
            `${p}.jpg`,
            { type: "image/jpeg" }
          )
        });
      }
      i.push({
        exampleId: d.id,
        expectedExampleRevision: d.revision,
        expectedRepresentationRevision: d.representationRevision,
        frames: c
      });
    }
    return { captures: i, files: s };
  } finally {
    r.pause(), r.removeAttribute("src"), r.load(), r.remove();
  }
}
function ya(e, t) {
  return t === "loadedmetadata" && e.readyState >= 1 || t === "loadeddata" && e.readyState >= 2 ? Promise.resolve() : new Promise((r, o) => {
    const a = setTimeout(
      () => l(
        o,
        new Error("Timed out while reading video frames.")
      ),
      3e4
    ), i = () => l(r), s = () => l(
      o,
      new Error("The video could not be decoded for frame capture.")
    ), l = (d, c) => {
      clearTimeout(a), e.removeEventListener(t, i), e.removeEventListener("error", s), d(c);
    };
    e.addEventListener(t, i, { once: !0 }), e.addEventListener("error", s, { once: !0 });
  });
}
function Cd(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function ba(e) {
  return Math.round(e * 1e3) / 1e3;
}
function xu(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((a) => o.has(a.id) ? { ...a, ...r } : a).sort((a, i) => a.startSec - i.startSec || a.id - i.id)
  };
}
function $d(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function Su(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function ku(e, t, r) {
  const o = new Map((t || []).map((a) => [a.id, a]));
  return {
    ...e,
    segments: (e.segments || []).map((a) => {
      const i = o.get(a.id);
      return i ? r.reduce((s, l) => ({ ...s, [l]: i[l] }), a) : a;
    }).sort((a, i) => a.startSec - i.startSec || a.id - i.id)
  };
}
function wu(e, t) {
  const r = t || [], o = new Set((e.segments || []).map((a) => a.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...r.filter((a) => !o.has(a.id))
    ].sort((a, i) => a.startSec - i.startSec || a.id - i.id)
  };
}
function en(e, t, r, o) {
  const a = (r || []).map((d) => ({ ...d, segmentId: t })), i = e.performerSlots || [], s = i.findIndex((d) => d.segmentId === t), l = i.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...a), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function Td(e, t) {
  const r = [...t || []].sort((s, l) => s.startSec - l.startSec || s.id - l.id), o = r[0];
  if (!o) return e;
  const a = new Set(r.slice(1).map((s) => s.id)), i = {
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
    segments: (e.segments || []).filter((s) => !a.has(s.id)).map((s) => s.id === o.id ? i : s).sort((s, l) => s.startSec - l.startSec || s.id - l.id)
  };
}
function Rn(e, t) {
  return !e || !t ? !1 : e.itemId != null && e.itemId === t.itemId || e.nativeSegmentId != null && e.nativeSegmentId === t.nativeSegmentId ? !0 : e.id != null && e.id === t.id;
}
function bo(e, t) {
  return (e || []).some((r) => (t || []).some((o) => Rn(r, o)));
}
function Et(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function xi(e, t) {
  return (e || []).find((r) => Rn(t, r)) || null;
}
function Si(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Rd(e, t) {
  var r;
  return ((r = e.running) == null ? void 0 : r.kind) === t;
}
function Nu(e) {
  return e.running != null || e.queued.length > 0;
}
const ha = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
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
function Md({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let r = 1, o = null, a = [], i = null, s = !1, l = 0, d = 0;
  const c = () => !t && d < l, m = /* @__PURE__ */ new Map();
  let u = ha;
  const y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Set();
  let p = [];
  function f() {
    u = o == null && a.length === 0 && i == null ? ha : Object.freeze({
      running: o ? gr(o) : null,
      queued: Object.freeze(a.map(gr)),
      lastFailure: i
    });
    for (const S of [...b]) S();
    if (o == null && a.length === 0) {
      const S = p;
      p = [];
      for (const A of S) A();
    }
  }
  function w(S, A) {
    y.set(S.id, A.status), S.resolve(A);
  }
  function R(S) {
    if (S.dependsOn == null) return "met";
    const A = y.get(S.dependsOn);
    return A === "fulfilled" ? "met" : A != null ? "failed" : "pending";
  }
  function g(S) {
    o = S;
    const A = { ...e(), taskId: S.id, targets: S.targets };
    A.resolveTargets = () => S.targets.map((L) => xi(A.segments, L)).filter(Boolean), f();
    let K;
    try {
      K = S.run(A);
    } catch (L) {
      K = Promise.reject(L);
    }
    Promise.resolve(K).then(
      (L) => B(S, { status: "fulfilled", value: L }),
      (L) => B(S, { status: "rejected", error: L })
    );
  }
  function B(S, A) {
    S.settled || (S.settled = !0, w(S, A), !s && (o = null, A.status === "rejected" && (i = Object.freeze({ id: S.id, kind: S.kind, error: A.error })), f(), l += 1, t && U()));
  }
  function U() {
    if (s || o != null || c()) return;
    let S = !1;
    for (let A = 0; A < a.length; A += 1) {
      const K = a[A], L = R(K);
      if (L === "failed") {
        a = a.filter((T) => T !== K), w(K, { status: "dropped", reason: "dependency-failed" }), S = !0, A -= 1;
        continue;
      }
      if (L !== "pending" && !(K.exclusive && A > 0) && !a.slice(0, A).some((T) => bo(T.targets, K.targets)) && !(K.ready && !K.ready(e(), gr(K)))) {
        a = a.filter((T) => T !== K), g(K);
        return;
      }
    }
    S && f();
  }
  function q(S) {
    if (s || (o == null ? void 0 : o.exclusive) || a.some((H) => H.exclusive) || o != null && S.whenBusy !== "enqueue" || S.exclusive && (o != null || a.length > 0 || c())) return null;
    let K;
    const L = new Promise((H) => {
      K = H;
    }), T = {
      id: r++,
      kind: S.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: S.lockId ?? -1,
      targets: Object.freeze((S.targets || []).map(M)),
      exclusive: S.exclusive === !0,
      dependsOn: S.dependsOn ?? null,
      ready: S.ready || null,
      meta: S.meta ?? null,
      run: S.run,
      resolve: K
    };
    return a = [...a, T], f(), U(), { id: T.id, done: L };
  }
  function F(S = {}) {
    let A = null;
    const K = q({
      ...S,
      whenBusy: "reject",
      run: () => new Promise((T) => {
        A = T;
      })
    });
    if (!K) return null;
    if (A == null)
      return k((T) => T.id === K.id), null;
    let L = !1;
    return () => {
      L || (L = !0, A(), (o == null ? void 0 : o.id) === K.id && B(o, { status: "fulfilled", value: void 0 }));
    };
  }
  function M(S) {
    return (S == null ? void 0 : S.id) == null || S.itemId != null || S.nativeSegmentId != null ? S : m.get(S.id) || S;
  }
  function $(S, A) {
    m.set(S, { ...A });
    let K = !1;
    for (const L of a)
      L.targets.some((T) => T.id === S && T.itemId == null && T.nativeSegmentId == null) && (L.targets = Object.freeze(L.targets.map((T) => T.id === S ? { ...A } : T)), K = !0);
    return K && f(), K;
  }
  function k(S) {
    const A = a.filter((K) => S(gr(K)));
    if (A.length === 0) return 0;
    a = a.filter((K) => !A.includes(K));
    for (const K of A) w(K, { status: "cancelled" });
    return f(), U(), A.length;
  }
  return {
    enqueue: q,
    acquire: F,
    cancel: k,
    retarget: $,
    stableIdentity: M,
    // The host reads `settledCount()` while rendering and reports it here once that render commits.
    settledCount: () => l,
    markCommitted(S = l) {
      d = Math.max(d, S);
    },
    poke: () => U(),
    subscribe(S) {
      return b.add(S), () => b.delete(S);
    },
    getSnapshot: () => u,
    whenIdle() {
      return o == null && a.length === 0 ? Promise.resolve() : new Promise((S) => p.push(S));
    },
    dispose() {
      if (s) return;
      const S = a;
      a = [], s = !0;
      for (const K of S) w(K, { status: "cancelled" });
      b.clear();
      const A = p;
      p = [];
      for (const K of A) K();
    }
  };
}
let Ad = 1;
function qt() {
  return `pending-${Ad++}`;
}
function Ed(e) {
  return e.sort((t, r) => t.startSec - r.startSec || t.id - r.id);
}
function vr(e, t) {
  return (t || []).some((r) => Rn(r, e));
}
function Dd(e, t) {
  return [...e || [], {
    id: t.id ?? qt(),
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
    return ((o = r.meta) == null ? void 0 : o.kind) === "held-tag" && !r.settled && vr(t, r.targets);
  }) || null;
}
function Od(e) {
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
  const o = (e || []).map((a) => a.settled || !wi(a, t) ? a : (r = !0, { ...a, settled: !0, settledDetail: null }));
  return r ? o : e;
}
function Pd(e, t, r) {
  let o = !1;
  const a = (e || []).map((i) => i.targets.some((s) => s.id === t && s.itemId == null && s.nativeSegmentId == null) ? (o = !0, {
    ...i,
    targets: i.targets.map((s) => s.id === t ? { ...r } : s)
  }) : i);
  return o ? a : e;
}
function Ld(e, t) {
  if (!t || t.length === 0) return e;
  let r = [...e || []];
  for (const o of t)
    if (o.op === "insert")
      r.some((a) => Rn(o.segment, a)) || r.push(o.segment);
    else if (o.op === "patch")
      r = r.map((a) => vr(a, o.targets) ? { ...a, ...o.values } : a);
    else if (o.op === "remove")
      r = r.filter((a) => !vr(a, o.targets));
    else if (o.op === "merge") {
      const [a, ...i] = o.targets;
      r = r.filter((s) => !vr(s, i)).map((s) => Rn(a, s) ? { ...s, ...o.values } : s);
    }
  return Ed(r);
}
function Ci(e, t) {
  if (!e || e.length === 0) return e;
  const r = [
    ...(t == null ? void 0 : t.segments) || [],
    ...e.filter((i) => i.op === "insert" && !i.settled).map((i) => i.segment)
  ];
  let o = !1;
  const a = [];
  for (const i of e) {
    if (i.op !== "insert" && !i.targets.some((s) => r.some((l) => Rn(s, l)))) {
      o = !0;
      continue;
    }
    if (i.settled) {
      i.settledDetail == null ? (a.push({ ...i, settledDetail: t }), o = !0) : i.settledDetail !== t ? o = !0 : a.push(i);
      continue;
    }
    a.push(i);
  }
  return o ? a : e;
}
function jd(e, t, r) {
  return r ? Ni(e, t) : Ii(e, t);
}
function Fd(e, t) {
  switch (t.type) {
    case "confirm":
      return jd(e, t.key, t.applied);
    case "add":
      return Dd(e, t.entry);
    case "discard":
      return Ni(e, t.key);
    case "settle":
      return Ii(e, t.key);
    case "retarget":
      return Pd(e, t.temporaryId, t.identity);
    case "prune":
      return Ci(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
function va(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function Bd(e) {
  const { acquireSaveLock: t, compatibilityMode: r, dispatchPendingChanges: o, enqueueSave: a, pendingChanges: i, retargetSaveTasks: s, currentTime: l, detail: d, editorFilters: c, endInput: m, hideDerivedSegments: u, historyRef: y, mediaDuration: b, onConflict: p, onDetailChange: f, onReload: w, optimisticSegmentIdRef: R, pendingDuplicateRef: g, pendingFirstSegmentStartSecRef: B, pendingTagEditSegmentIdRef: U, performerSlots: q, replaceSegmentSelection: F, savingSegmentId: M, segments: $, selectedSegment: k, selectedSegmentIdRef: S, selectedSegments: A, selectionAnchorIdRef: K, selectionRangeBaseIdsRef: L, setCreatingSegmentId: T, setEditorFilters: H, setFirstSegmentTagOpen: J, setHideDerivedSegments: _, setHistory: oe, setHistoryOpen: ue, setPublishApprovedError: be, setSaveMessage: E, setSelectedSegmentGroupKey: ae, setSelectedSegmentId: le, setSelectedSegmentIds: X, setTagEditing: de, startInput: xe, tagEditingRef: Ce, timelineDuration: Oe, video: fe } = e;
  function Y(j) {
    y.current = j || Qt, oe(y.current);
  }
  async function ye(j, re, N, W, O = null) {
    var Q;
    try {
      const he = await Z(`/videos/${fe.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: y.current.revision,
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
    const ge = t("segment", j.id);
    if (!ge) return null;
    try {
      return await ee(j, re, {
        recordHistory: N,
        historyLabel: W,
        optimisticValues: O ? Q : null,
        restoreSelectionOnFailure: he
      });
    } finally {
      ge();
    }
  }
  async function ee(j, re, {
    recordHistory: N = !0,
    historyLabel: W = null,
    optimisticValues: O = null,
    pendingChangeId: Q = null,
    restoreSelectionOnFailure: he = !0,
    onReload: ge = w,
    onConflict: $e = p
  } = {}) {
    var yt;
    const gt = A.map((Qe) => Qe.id), Le = S.current, Te = N && !r ? crypto.randomUUID() : null;
    E(N ? "Saving directly to Cove…" : "Restoring history…");
    const Je = Q ?? (O ? qt() : null);
    O && !Q && o({
      type: "add",
      entry: { id: Je, op: "patch", targets: [Et(j)], values: O }
    });
    const ot = (Qe) => {
      Je && o({ type: "confirm", key: Je, applied: Qe });
    };
    try {
      if (r && j.nativeSegmentId == null && j.itemId != null) {
        const lt = `draft-update:${fe.id}:${j.itemId}:${j.revision}:${re.tagId}:${re.startSec}:${re.endSec ?? "open"}:${re.reviewState ?? j.reviewState}`, Be = await Z(`/videos/${fe.id}/drafts/${j.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ue(lt),
            expectedRevision: j.revision,
            startSec: re.startSec,
            endSec: re.endSec,
            tagId: re.tagId,
            reviewState: re.reviewState
          })
        });
        He(lt), Be.performerSlots != null && f((Ve) => en(Ve, j.id, Be.performerSlots, Be.performerSlotRevision), fe.id);
        const We = {
          ...j,
          ...Be.draft,
          id: j.id,
          itemId: j.itemId
        };
        return N && await ye(
          "segment.update",
          W || "Changed segment",
          ur(j, r),
          ur(
            We,
            r
          )
        ), va(j, re, r) ? ot(await ge() != null) : (f((Ve) => ({
          ...Ve,
          approvedSetVersion: Be.approvedSetVersion || Ve.approvedSetVersion,
          segments: (Ve.segments || []).map((_e) => _e.id === j.id ? We : _e).sort((_e, ut) => _e.startSec - ut.startSec || _e.id - ut.id)
        }), fe.id), ot(!0)), E(((yt = Be.draft) == null ? void 0 : yt.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), We;
      }
      const Qe = await Z(`/videos/${fe.id}/segments/${j.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...re,
          expectedUpdatedAt: j.updatedAt,
          historyReceiptId: Te
        })
      }), bt = {
        ...j,
        ...Qe,
        reviewState: re.reviewState ?? j.reviewState
      };
      return va(j, re, r) ? ot(await ge() != null) : (f((lt) => ({
        ...lt,
        segments: (lt.segments || []).map((Be) => Be.id === j.id ? bt : Be).sort((Be, We) => Be.startSec - We.startSec || Be.id - We.id)
      }), fe.id), ot(!0)), N && await ye(
        "segment.update",
        W || "Changed segment",
        ur(j, r),
        ur(
          bt,
          r
        ),
        Te
      ), E(N ? "Saved to Cove" : "History restored"), bt;
    } catch (Qe) {
      return Je && o({ type: "discard", key: Je }), Je && he && (X(gt), le(Le), K.current = Le, L.current = []), Qe.status === 409 ? (E("Conflict — loading the latest segment…"), await $e()) : E(Qe.message || "Unable to save the segment."), null;
    }
  }
  async function C() {
    if (!r) return !1;
    const j = $.filter((W) => !W.published && W.reviewState === "approved").length;
    if (j === 0 || M != null) return !1;
    const re = `complete-review:${fe.id}:${d.approvedSetVersion}`, N = t("publish", -1);
    if (!N) return !1;
    be(""), E(`Publishing ${j} Approved draft${j === 1 ? "" : "s"}…`);
    try {
      const W = await Z(`/videos/${fe.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ue(re),
          expectedApprovedSetVersion: d.approvedSetVersion
        })
      });
      He(re), Y(Qt), ue(!1);
      const O = await w(), Q = vl(
        $,
        S.current,
        W.published
      ), he = Q ? nt(O == null ? void 0 : O.segments, Q) : null;
      return he && le(he.id), E(`${W.published.length} Approved draft${W.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (W) {
      const O = W.status === 409 ? "The approved drafts changed. Review the updated list and try again." : W.message || "Unable to publish the approved drafts.";
      return W.status === 409 && await p(), be(O), E(O), !1;
    } finally {
      N();
    }
  }
  async function v(j = null, re = null) {
    if (M != null || h()) return;
    const N = j != null ? B.current : null, W = Number.isFinite(N) ? N : l, O = Math.min(Oe, W + 20);
    if (O <= W) {
      E("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const Q = fl($, k, j);
    if (Q.kind === "choose-tag") {
      B.current = W, E(""), J(!0);
      return;
    }
    if (Q.kind === "invalid-selection") {
      E("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: he } = Q, ge = `create-draft:${fe.id}:${he}:${W}`, $e = r ? null : crypto.randomUUID(), gt = S.current, Le = {
      ...k || {},
      id: R.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: he,
      tagName: re || (k == null ? void 0 : k.tagName) || "Tag segment",
      tagSortName: he === (k == null ? void 0 : k.tagId) && (k == null ? void 0 : k.tagSortName) || null,
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
    }, Te = $d(d, Le), Je = Ft(
      ln(Te.segments, Te.segmentGroups || [], Te.performerSlots || []),
      Le.id
    ), ot = a({
      kind: "create",
      lockId: -1,
      run: (Qe) => yt(Qe)
    });
    if (!ot) return;
    await ot.done;
    async function yt({ onReload: Qe, taskId: bt }) {
      var Be;
      const lt = qt();
      o({ type: "add", entry: { id: lt, taskId: bt, op: "insert", segment: Le } }), J(!1), Q.openTagEditor && (T(Le.id), U.current = Le.id, de(!0)), F(Le.id), ae(Je);
      try {
        let We;
        if (r) {
          const ut = await Z(`/videos/${fe.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: Ue(ge), tagId: he, startSec: W, endSec: O })
          });
          He(ge), We = { itemId: (Be = ut.draft) == null ? void 0 : Be.itemId }, ut.performerSlots != null && f((ht) => en(ht, Le.id, ut.performerSlots, ut.performerSlotRevision), fe.id);
        } else
          We = { nativeSegmentId: (await Z(`/videos/${fe.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: he,
              startSec: W,
              endSec: O,
              historyReceiptId: $e
            })
          })).id };
        B.current = null, J(!1);
        const Ve = await Qe();
        if (o({ type: "discard", key: lt }), !Ve) {
          f((ut) => en(ut, Le.id, []), fe.id), F(gt), E(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${Q.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const _e = nt(Ve == null ? void 0 : Ve.segments, We);
        _e ? (o({ type: "retarget", temporaryId: Le.id, identity: Et(_e) }), s(Le.id, Et(_e)), Q.openTagEditor && (Ce.current && (U.current = _e.id), T(_e.id)), F(_e.id), ae(Ft(
          ln(Ve.segments || [], Ve.segmentGroups || [], Ve.performerSlots || []),
          _e.id
        )), r || await ye(
          "segment.create",
          "Created segment",
          Pt([], !1),
          Pt([_e], !1),
          $e
        )) : (de(!1), E(`Segment created, but it could not be selected${Q.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (We) {
        throw o({ type: "discard", key: lt }), F(gt), j != null && J(!0), E(We.message || "Unable to create the draft."), We;
      } finally {
        T(null);
      }
    }
  }
  function h() {
    return ki(i, k) ? (E("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function x() {
    if (A.length !== 1 || !k || M != null || h()) return;
    const j = l;
    if (j <= k.startSec || k.endSec != null && j >= k.endSec) {
      E("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const re = `split-draft:${k.itemId}:${k.revision}:${j}`, N = r ? null : Pt([k], !1), W = r ? null : crypto.randomUUID(), O = t("split", k.id);
    if (O)
      try {
        let Q = null;
        r && k.nativeSegmentId == null ? (await Z(`/videos/${fe.id}/drafts/${k.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ue(re),
            expectedRevision: k.revision,
            splitSec: j
          })
        }), He(re)) : Q = { nativeSegmentId: (await Z(`/videos/${fe.id}/segments/${k.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: k.updatedAt,
            splitSec: j,
            historyReceiptId: W
          })
        })).id };
        const he = await w();
        if (!r) {
          const ge = [
            nt(he == null ? void 0 : he.segments, {
              nativeSegmentId: k.nativeSegmentId ?? k.id
            }),
            nt(
              he == null ? void 0 : he.segments,
              Q
            )
          ].filter(Boolean);
          await ye(
            "segment.split",
            "Split segment",
            N,
            Pt(ge, !1),
            W
          );
        }
        E(r ? `Segment split; both ranges remain ${k.reviewState}.` : "Segment split.");
      } catch (Q) {
        Q.status === 409 ? await p() : E(Q.message || "Unable to split the draft.");
      } finally {
        O();
      }
  }
  async function D(j = !1) {
    if (A.length !== 1 || !k || M != null || h()) return;
    const re = j ? l : k.startSec, N = pl(fe.id, k, j, re), W = r ? null : crypto.randomUUID(), O = k, Q = S.current, he = O.endSec == null ? null : O.endSec - O.startSec, ge = {
      ...O,
      id: R.current--,
      itemId: null,
      nativeSegmentId: null,
      startSec: re,
      endSec: he == null ? null : re + he,
      // Full mode creates the copy already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : O.reviewState,
      revision: 0,
      updatedAt: null
    }, $e = (q || []).filter((Te) => Te.segmentId === O.id), gt = a({
      kind: "duplicate",
      lockId: -1,
      targets: [Et(O)],
      run: (Te) => Le(Te)
    });
    if (!gt) return;
    await gt.done;
    async function Le({ onReload: Te, onConflict: Je, taskId: ot }) {
      var bt, lt;
      const yt = qt();
      o({ type: "add", entry: { id: yt, taskId: ot, op: "insert", segment: ge } }), $e.length > 0 && f((Be) => en(Be, ge.id, $e), fe.id), j || (T(ge.id), U.current = ge.id, de(!0)), F(ge.id);
      const Qe = () => {
        o({ type: "discard", key: yt }), $e.length > 0 && f((Be) => en(Be, ge.id, []), fe.id);
      };
      try {
        const Be = ((bt = g.current) == null ? void 0 : bt.operationKey) === N ? g.current : null;
        let We = (Be == null ? void 0 : Be.duplicateIdentity) ?? null;
        if (We == null && r && O.nativeSegmentId == null) {
          const ht = await Z(`/videos/${fe.id}/drafts/${O.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ue(N),
              expectedRevision: O.revision,
              startSec: j ? re : null
            })
          });
          We = ea(!1, ht), g.current = { operationKey: N, duplicateIdentity: We };
        } else if (We == null) {
          const ht = await Z(`/videos/${fe.id}/segments/${O.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: O.updatedAt,
              startSec: j ? re : null,
              historyReceiptId: W
            })
          });
          We = ea(!0, ht), g.current = { operationKey: N, duplicateIdentity: We };
        }
        const Ve = await Te();
        Qe();
        const _e = nt(Ve == null ? void 0 : Ve.segments, We);
        if (!_e) {
          de(!1), F(Q), E(Ve ? "Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection." : "Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.");
          return;
        }
        o({ type: "retarget", temporaryId: ge.id, identity: Et(_e) }), s(ge.id, Et(_e));
        const ut = Va(
          _e,
          Ve.performerSlots || [],
          c,
          u,
          Ve.segmentGroups || []
        );
        H(ut.filters), _(ut.hideDerivedSegments), !j && Ce.current && (U.current = _e.id), F(_e.id), ae(Ft(
          ln(Ve.segments || [], Ve.segmentGroups || [], Ve.performerSlots || []),
          _e.id
        )), r && O.nativeSegmentId == null && He(N), g.current = null, E(j ? "Duplicate created at the playhead." : "Duplicate created in place."), r || await ye(
          "segment.duplicate",
          "Duplicated segment",
          Pt([], !1),
          Pt([_e], !1),
          W
        );
      } catch (Be) {
        throw Qe(), de(!1), F(Q), ((lt = g.current) == null ? void 0 : lt.operationKey) === N ? E("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : Be.status === 409 ? await Je() : E(Be.message || "Unable to duplicate the draft."), Be;
      } finally {
        T(null);
      }
    }
  }
  async function ne() {
    if (A.length !== 1 || !k) return;
    const j = Number(xe), re = m.trim() === "" ? null : Number(m), N = _o(j, re, b);
    if (N.error) {
      E(N.error);
      return;
    }
    if (j === k.startSec && re === k.endSec) {
      E("Timing is unchanged.");
      return;
    }
    await I(k, { startSec: j, endSec: re, tagId: k.tagId }, !0, null, !0);
  }
  async function te(j, re) {
    if (A.length !== 1 || !k) return;
    const N = _o(j, re, b);
    if (N.error) {
      E(N.error);
      return;
    }
    if (j === k.startSec && re === k.endSec) {
      E("Timing is unchanged.");
      return;
    }
    await I(k, { startSec: j, endSec: re, tagId: k.tagId }, !0, null, !0);
  }
  return { acceptHistory: Y, recordHistoryAction: ye, mutateSegment: I, runSegmentMutation: ee, completeReview: C, createSegment: v, splitSegment: x, duplicateSegment: D, saveTiming: ne, applyShortcutTiming: te };
}
function Gd() {
  const [e, t] = z(() => typeof window < "u" && window.matchMedia(zo).matches);
  return pe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(zo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Kd() {
  const [e, t] = z(() => typeof window < "u" && window.matchMedia(Uo).matches);
  return pe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Uo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function zd() {
  try {
    return Bs(window.localStorage.getItem(ja));
  } catch {
    return { ...Dt };
  }
}
function Ud() {
  try {
    return rn(JSON.parse(window.localStorage.getItem(Fa) || "[]"));
  } catch {
    return [];
  }
}
function Hd(e) {
  try {
    window.localStorage.setItem(Fa, JSON.stringify(rn(e)));
  } catch {
  }
}
function _d(e) {
  try {
    window.localStorage.setItem(ja, JSON.stringify(e));
  } catch {
  }
}
function qd() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Ga) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Wd(e) {
  try {
    return window.localStorage.setItem(Ga, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Vd({ status: e }) {
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
function nn({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, $t.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...ci(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${Bt[t].symbol}${e[t]}`)));
}
function Jd({ videoId: e, segmentId: t, itemId: r, slots: o, revision: a, performerCandidates: i, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: m, shortcutRef: u }) {
  const y = co(i), [b, p] = z(() => Wr(o, y)), [f, w] = z(!1), [R, g] = z(""), B = me(!1), U = o.map((S) => `${S.slotDefinitionId}:${S.performerId || ""}`).join("|"), q = y.map((S) => ct(S)).join("|"), F = ri(
    o,
    y
  );
  pe(() => {
    p(Wr(o, y)), g("");
  }, [t, r, U, q]);
  async function M(S = b) {
    if (!B.current) {
      B.current = !0, w(!0), g("Saving performer slots…");
      try {
        const A = Wr(o.map((T) => ({
          ...T,
          performerId: S[T.slotDefinitionId] || null
        })), y), K = o.map((T) => {
          const H = A[T.slotDefinitionId] ? Number(A[T.slotDefinitionId]) : null, J = y.find((_) => String(ct(_)) === String(H));
          return {
            ...T,
            performerId: H,
            performerName: (J == null ? void 0 : J.name) || null
          };
        });
        if (s(K) === !1) {
          g("");
          return;
        }
        const L = await Z(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: a,
            assignments: o.map((T) => ({ slotDefinitionId: T.slotDefinitionId, performerId: A[T.slotDefinitionId] ? Number(A[T.slotDefinitionId]) : null }))
          })
        });
        g("Performer slots saved."), await l(L, {
          beforeState: kr([{
            segmentId: t,
            itemId: r,
            revision: a,
            slots: o
          }]),
          afterState: kr([{
            segmentId: t,
            itemId: r,
            revision: L.revision,
            slots: L.slots || []
          }])
        });
      } catch (A) {
        d && await d(o, A), A.status === 409 ? (g("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : g(A.message || "Unable to save performer slots.");
      } finally {
        B.current = !1, w(!1);
      }
    }
  }
  function $(S, A) {
    g(`Option ${A + 1} applied; save to confirm.`), p({ ...b, ...S.assignments });
  }
  async function k(S) {
    const A = { ...b, ...S.assignments };
    p(A), await M(A);
  }
  return pe(() => {
    if (u)
      return u.current = (S) => B.current || !F[S] ? !1 : (k(F[S]), !0), () => {
        u.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    F.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, F.map((S, A) => n("button", {
        key: A,
        type: "button",
        disabled: f,
        onClick: () => $(S, A),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${A + 1}: ${S.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, A + 1),
        n("span", { key: "description" }, S.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${F.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((S) => n("label", { key: S.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Tt(S)),
      (S.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(S.genderHints || []).map(Ir).join(" · ")}`) : null,
      n("select", { key: "select", value: b[S.slotDefinitionId] || "", disabled: f, onChange: (A) => p({ ...b, [S.slotDefinitionId]: A.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...oi(y, y, S.genderHints).map((A) => n("option", { key: ct(A), value: ct(A) }, A.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: m, type: "button", disabled: f, onClick: () => M(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, R)])
  ]);
}
function Yd({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: a, shortcutRef: i, acquireSaveLock: s = () => () => {
} }) {
  var M;
  const l = ((M = t[0]) == null ? void 0 : M.slots) || [], d = co(r), c = ri(
    l,
    d
  ), m = "__mixed__", u = () => Object.fromEntries(l.map(($, k) => {
    const S = t.map((A) => {
      var K;
      return String(((K = A.slots[k]) == null ? void 0 : K.performerId) || "");
    });
    return [$.slotDefinitionId, S.every((A) => A === S[0]) ? S[0] : m];
  })), [y, b] = z(u), [p, f] = z(!1), [w, R] = z(""), g = me(!1), B = t.map(($) => `${$.itemId ?? `native:${$.segmentId}`}:${$.revision}:${$.slots.map((k) => `${k.slotDefinitionId}:${k.performerId || ""}`).join(",")}`).join("|");
  pe(() => {
    b(u());
  }, [B]);
  async function U($ = y) {
    if (g.current) return;
    const k = s();
    if (!k) {
      R("Wait for the current save to finish before saving performer slots.");
      return;
    }
    g.current = !0, f(!0), R(`Saving performer slots for ${t.length} segments…`);
    const S = [];
    try {
      for (const A of t) {
        const K = A.slots.map((T, H) => {
          const J = $[l[H].slotDefinitionId];
          return {
            slotDefinitionId: T.slotDefinitionId,
            performerId: J === m ? T.performerId || null : J ? Number(J) : null
          };
        }), L = await Z(A.itemId != null ? `/videos/${e}/drafts/${A.itemId}/slots` : `/videos/${e}/segments/${A.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: A.revision, assignments: K })
        });
        S.push({
          segmentId: A.segmentId,
          itemId: A.itemId,
          revision: L.revision,
          slots: L.slots || []
        });
      }
      R("Performer slots saved."), await o({
        beforeState: kr(t),
        afterState: kr(S)
      });
    } catch (A) {
      const K = await a();
      A.status === 409 ? R(K ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : R(A.message || (K ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      g.current = !1, f(!1), k();
    }
  }
  function q($, k) {
    R(`Option ${k + 1} applied; save to confirm.`), b({ ...y, ...$.assignments });
  }
  async function F($) {
    const k = { ...y, ...$.assignments };
    b(k), await U(k);
  }
  return pe(() => {
    if (i)
      return i.current = ($) => g.current || !c[$] ? !1 : (F(c[$]), !0), () => {
        i.current = null;
      };
  }), n("div", { className: "space-y-3" }, [
    n(
      "p",
      { key: "scope", className: "text-xs text-secondary" },
      `Changes apply to all ${t.length} selected segments. Mixed values remain unchanged unless replaced.`
    ),
    c.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, c.map(($, k) => n("button", {
        key: k,
        type: "button",
        disabled: p,
        onClick: () => q($, k),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${k + 1} to all selected segments: ${$.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, k + 1),
        n("span", { key: "description" }, $.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${c.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, l.map(($) => n("label", {
      key: $.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Tt($)),
      n("select", {
        key: "select",
        value: y[$.slotDefinitionId] || "",
        disabled: p,
        onChange: (k) => b({ ...y, [$.slotDefinitionId]: k.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        y[$.slotDefinitionId] === m ? n("option", { key: "mixed", value: m }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...oi(d, d, $.genderHints).map((k) => n("option", {
          key: ct(k),
          value: ct(k)
        }, k.name))
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
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, w)
    ])
  ]);
}
function Gt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function Qd(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return Gt(t);
  const o = [...new Set(r.map((a) => Gt(a.sourceKey, a.sourceDisplayName)))];
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
function Zd({ hidden: e }) {
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
function Xd({ segment: e, provenance: t }) {
  var m;
  const [r, o] = z(!1), a = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, i = t.key === a ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(i.items) ? i.items : [], l = `segment-provenance-${e.id}`, d = Qd(i, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
      i.loading ? n("p", { className: "text-xs text-secondary" }, "Loading provenance…") : i.error ? n("p", { className: "text-xs text-secondary" }, i.error) : s.length === 0 ? n(
        "p",
        { className: "text-xs text-secondary" },
        (m = e.sourceKey) != null && m.includes("stash-marker-studio") ? "Imported from Stash Marker Studio. Detailed run and model information was not recorded for this legacy segment." : "No detailed provenance was recorded for this segment."
      ) : s.map((u) => {
        const y = u.modelIdentifier || u.modelKey, b = u.value == null ? null : typeof u.value == "string" ? u.value : JSON.stringify(u.value);
        return n("div", { key: u.id || `${u.fieldKey}:${u.sourceKey}:${u.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            Gt(u.sourceKey, u.sourceDisplayName)
          ),
          u.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${u.fieldKey}${b == null ? "" : ` · ${b}`}`
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
function ec({
  selectedGroups: e,
  selectedSegments: t,
  activeSegmentId: r,
  detailPanelRef: o,
  onReduceSelection: a,
  reviewable: i,
  tagEditable: s,
  slotsEditable: l,
  onEditSlots: d,
  slotButtonRef: c,
  saveMessage: m
}) {
  const [u, y] = z([]), b = e.flatMap((R) => R.lanes.map((g) => g.key)), p = b.join("|");
  pe(() => {
    const R = new Set(b);
    y((g) => g.filter((B) => R.has(B)));
  }, [p]);
  const f = wr(t), w = !!bi(
    e,
    { nativeOnly: !i }
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
        `${b.length} swimlane${b.length === 1 ? "" : "s"} · ${e.length} group${e.length === 1 ? "" : "s"}`
      ),
      i ? n(nn, { key: "counts", counts: f }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      ad({ mergeable: w, reviewable: i, tagEditable: s, slotsEditable: l })
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
    ...e.map((R) => n("section", {
      key: R.key,
      "data-selected-segment-group": R.key,
      className: "space-y-1.5"
    }, [
      n("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        n("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, R.name),
        n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${R.selectedCount} selected`)
      ]),
      ...R.lanes.map((g) => {
        const B = u.includes(g.key), U = g.markers.some(({ segment: F }) => F.id === r), q = `selected-segment-lane-${g.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: g.key,
          "data-selected-segment-lane": g.key,
          className: `rounded-md border ${U ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": B,
            "aria-controls": q,
            "aria-current": U ? "true" : void 0,
            onClick: () => y((F) => B ? F.filter((M) => M !== g.key) : [...F, g.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, B ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Jn(g)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(g.selectedCount)),
            i ? n(nn, { key: "states", counts: g.counts }) : null
          ]),
          B ? n("div", {
            key: "segments",
            id: q,
            className: "space-y-1 border-t border-border p-1.5"
          }, g.markers.map(({ segment: F }) => {
            const M = F.endSec == null ? Ae(F.startSec) : `${Ae(F.startSec)} – ${Ae(F.endSec)}`;
            return n("button", {
              key: F.id,
              type: "button",
              onClick: () => a(F),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${F.id === r ? "bg-accent/15" : ""}`,
              "aria-label": i ? `${F.tagName || "Segment"}, ${F.reviewState}, ${M}` : `${F.tagName || "Segment"}, ${M}`,
              "aria-current": F.id === r ? "true" : void 0
            }, [
              i ? n(cn, {
                key: "state",
                state: F.reviewState,
                includeLabel: !1
              }) : null,
              F.isDerived ? n($r, { key: "derived" }) : null,
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
}, xa = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], Sa = [
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
function ka(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function fr(e, t, r, o = null) {
  const a = ka(t), i = ka(t, "excludes");
  a.forEach((l) => e.append(r, String(l))), i.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (a.length > 0 || i.length > 0) && e.set(o, "true");
}
function tc(e, t, r = null) {
  var u, y, b;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const a = (u = t.hasSegmentsCriterion) == null ? void 0 : u.value;
  typeof a == "boolean" ? o.set("hasSegments", String(a)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), fr(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), fr(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), fr(o, t.performersCriterion, "performer"), fr(o, t.studiosCriterion, "studio", "includeSubstudios");
  const i = Number(t.segmentTagId ?? t.tagId) || null;
  i && !o.has("segmentTag") && o.set("segmentTagId", String(i));
  const s = wa(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = wa(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((y = t.reviewStateCriterion) == null ? void 0 : y.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const m = (b = t.shotBoundariesCriterion) == null ? void 0 : b.value;
  return r && typeof m == "boolean" ? o.set("hasShotBoundaries", String(m)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function wa(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function nc(e, t, r, o = null, a = !1) {
  const i = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (a && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((m) => i.add(m));
  } else i.has(r) ? i.delete(r) : i.add(r);
  return i;
}
function Ti({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(ca, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, $t.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const a = Bt[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: a.badge
    }, `${a.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(ca, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function Ri({ item: e, selected: t, selectionActive: r, onSelect: o }) {
  return o ? n("button", {
    type: "button",
    "aria-label": t ? "Deselect item" : "Select item",
    "aria-pressed": t,
    onClick: (a) => {
      a.preventDefault(), a.stopPropagation(), o(e.videoId, a.shiftKey);
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
function rc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: a = !1, onSelect: i = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: a ? (l) => {
      l.button === 0 && i(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative flex min-h-full flex-col overflow-hidden rounded-md border bg-card shadow-sm transition-colors hover:border-accent/60 ${a ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    a ? null : n("a", {
      key: "link",
      href: `/segment-studio/${e.videoId}`,
      onClick: (l) => Zn(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      n(Ri, { key: "selection", item: e, selected: o, selectionActive: a, onSelect: i }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, ks(e.duration)) : null
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
function oc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: a = !1, onSelect: i = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: a ? (l) => {
      l.button === 0 && i(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${a ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n(Ri, { key: "selection", item: e, selected: o, selectionActive: a, onSelect: i }),
    n(a ? "div" : "a", {
      key: "link",
      href: a ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: a ? void 0 : (l) => Zn(l, t, s),
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
function ho({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const a = wl(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, a.map((i) => n("a", {
      key: i.key,
      href: i.href,
      onClick: (s) => Zn(s, t, i.route),
      "aria-current": e === i.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === i.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, i.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && Tn(
        o,
        Zt.recyclingBinView
      ) ? n(Mi, { key: "bin", onNavigate: t }) : null,
      n(Ai, { key: "settings", onNavigate: t })
    ])
  ]);
}
const ro = "segment-studio:recycling-bin-changed";
function ac(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function qn() {
  window.dispatchEvent(new CustomEvent(ro));
}
function Mi({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = z(null);
  pe(() => {
    let i = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const m = await Z("/bin"), u = Number(m == null ? void 0 : m.totalCount);
        !i && c === s && o(Number.isFinite(u) && u >= 0 ? Math.trunc(u) : null);
      } catch {
        !i && c === s && o(null);
      }
    }, d = () => {
      l();
    };
    return l(), window.addEventListener(ro, d), window.addEventListener("focus", d), () => {
      i = !0, window.removeEventListener(ro, d), window.removeEventListener("focus", d);
    };
  }, []);
  const a = ac(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (i) => Zn(i, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, a)]);
}
function Ai({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => Zn(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function ic({ mode: e, onModeChange: t, disabled: r = !1 }) {
  function o(a) {
    const i = eo(a.target.value);
    t == null || t(i);
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
function sc({ minimum: e, maximum: t, onChange: r }) {
  const o = me(null), [a, i] = z("maximum"), s = (y, b) => {
    const p = Vs(e, t, y, b);
    i(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (y, b) => {
    var f;
    const p = (f = o.current) == null ? void 0 : f.getBoundingClientRect();
    p && s(y, Ws(b.clientX, p.left, p.width));
  }, d = (y, b) => {
    var p, f;
    b.preventDefault(), (f = (p = b.currentTarget).setPointerCapture) == null || f.call(p, b.pointerId), l(y, b);
  }, c = (y, b) => {
    var p, f;
    (f = (p = b.currentTarget).hasPointerCapture) != null && f.call(p, b.pointerId) && l(y, b);
  }, m = (y, b) => {
    const p = y === "minimum" ? e : t, f = y === "minimum" ? 0 : e, w = y === "minimum" ? t : 1, R = b.shiftKey ? 0.1 : 0.01;
    let g = null;
    ["ArrowLeft", "ArrowDown"].includes(b.key) && (g = p - R), ["ArrowRight", "ArrowUp"].includes(b.key) && (g = p + R), b.key === "PageDown" && (g = p - 0.1), b.key === "PageUp" && (g = p + 0.1), b.key === "Home" && (g = f), b.key === "End" && (g = w), g != null && (b.preventDefault(), s(y, Math.min(w, Math.max(f, g))));
  }, u = (y, b) => n("span", {
    key: y,
    role: "slider",
    tabIndex: 0,
    "aria-label": y === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((y === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((y === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(b * 100),
    "aria-valuetext": `${Math.round(b * 100)} percent`,
    onPointerDown: (p) => d(y, p),
    onPointerMove: (p) => c(y, p),
    onKeyDown: (p) => m(y, p),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${b * 100}%`,
      touchAction: "none",
      zIndex: e === t && a === y ? 2 : 1
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
function lc({ saving: e, error: t, onSelect: r, onClose: o }) {
  const a = me(null);
  pe(() => {
    var l;
    const s = (l = a.current) == null ? void 0 : l.querySelector("input");
    s == null || s.focus({ preventScroll: !0 });
  }, []);
  const i = () => {
    e || o();
  };
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (s) => {
      s.target === s.currentTarget && i();
    },
    onKeyDownCapture: (s) => Ot(s, { onCancel: i })
  }, n("section", {
    ref: a,
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
      onClick: i,
      className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40 disabled:opacity-50"
    }, e ? "Creating…" : "Cancel"))
  ]));
}
function dc({
  filters: e,
  hideDerivedSegments: t,
  performers: r,
  provenanceSources: o,
  reviewCounts: a,
  segments: i,
  segmentGroups: s,
  reviewMode: l = !1,
  onChange: d,
  onHideDerivedChange: c,
  onClose: m
}) {
  const u = Lt(e), y = [...new Map((i || []).map((g) => [
    Number(g.tagId),
    g.tagName || `Tag ${g.tagId}`
  ])).entries()].sort((g, B) => g[1].localeCompare(B[1]) || g[0] - B[0]), b = new Set((i || []).map((g) => Number(g.tagId))), p = (s || []).filter((g) => Number(g.id) === u.segmentGroupId || (g.tags || []).some((B) => b.has(Number(B.tagId)))), f = (g) => d(Lt({ ...u, ...g })), w = (g) => f({
    reviewStates: u.reviewStates.includes(g) ? u.reviewStates.filter((B) => B !== g) : [...u.reviewStates, g]
  }), R = (g) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${g ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && m();
    },
    onKeyDownCapture: (g) => Ot(g, { onCancel: m })
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
        n("div", { className: "flex flex-wrap gap-2" }, $t.map((g) => {
          const B = u.reviewStates.includes(g), U = Bt[g];
          return n("button", {
            key: g,
            type: "button",
            onClick: () => w(g),
            "aria-pressed": B,
            className: R(B)
          }, `${U.symbol} ${g} (${a[g] || 0})`);
        }))
      ]) : null,
      l ? n("fieldset", { key: "performer", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Performer"),
        n("p", { className: "text-xs text-secondary" }, "Any assigned slot may match the selected performer."),
        n("div", { className: "flex flex-wrap gap-2" }, [
          n("button", {
            key: "any",
            type: "button",
            onClick: () => f({ performerId: null }),
            "aria-pressed": u.performerId == null,
            className: R(u.performerId == null)
          }, "All performers"),
          ...r.map((g) => {
            const B = Number(ct(g));
            return n("button", {
              key: B,
              type: "button",
              onClick: () => f({ performerId: B }),
              "aria-pressed": u.performerId === B,
              className: R(u.performerId === B)
            }, g.name);
          })
        ])
      ]) : null,
      n("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        n("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Tag"),
          n("select", {
            key: "select",
            value: u.tagId ?? "",
            onChange: (g) => f({
              tagId: g.target.value === "" ? null : Number(g.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...y.map(([g, B]) => n("option", { key: g, value: g }, B))
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
            onChange: (g) => f({
              segmentGroupId: g.target.value === "" ? null : g.target.value === "ungrouped" ? "ungrouped" : Number(g.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All Segment groups"),
            ...p.map((g) => n("option", { key: g.id, value: g.id }, g.name)),
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
            onClick: () => f({ sourceKey: null }),
            "aria-pressed": u.sourceKey == null,
            className: R(u.sourceKey == null)
          }, "All provenance"),
          ...o.map((g) => n("button", {
            key: g,
            type: "button",
            onClick: () => f({ sourceKey: g }),
            "aria-pressed": u.sourceKey === g,
            title: g,
            className: R(u.sourceKey === g)
          }, Gt(g)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(sc, {
          minimum: u.confidenceMin,
          maximum: u.confidenceMax,
          onChange: ({ minimum: g, maximum: B }) => f({
            confidenceMin: g,
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
            checked: u.includeUnscored,
            onChange: (g) => f({
              includeUnscored: g.target.checked
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
          onChange: (g) => c(g.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]"
        }),
        n(Zd, { key: "icon", hidden: t }),
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
const Ei = "segment-studio-editor-history";
function cc({ history: e, historySaving: t, anchorRef: r, onRestore: o, onClose: a }) {
  const i = me(null);
  return pe(() => {
    const s = (d) => {
      ed(d.target, i.current, r == null ? void 0 : r.current) && a();
    }, l = (d) => {
      var u, y, b;
      if (d.key !== "Escape" || d.defaultPrevented || document.querySelector("[role='dialog'], [aria-modal='true']")) return;
      const c = document.activeElement, m = c instanceof Element && (((u = i.current) == null ? void 0 : u.contains(c)) || ((y = r == null ? void 0 : r.current) == null ? void 0 : y.contains(c)));
      d.preventDefault(), a(), m && ((b = r == null ? void 0 : r.current) == null || b.focus({ preventScroll: !0 }));
    };
    return document.addEventListener("pointerdown", s), document.addEventListener("keydown", l), () => {
      document.removeEventListener("pointerdown", s), document.removeEventListener("keydown", l);
    };
  }, [r, a]), n("div", {
    ref: i,
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
        onClick: a,
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
function uc({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Qn.filter((l) => $n(l, e)), a = Zo(o, 1)[0], i = Zo(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((m) => n("div", { key: m.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, m.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[m.id] ? t[m.id].length > 0 ? t[m.id] : ["Unassigned"] : m.bindings.map(Qa)).map((u, y) => n("kbd", { key: `${m.id}:${y}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, u))
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
    onKeyDownCapture: (l) => Ot(l, { onCancel: r })
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
      n("div", { key: "mobile", className: "space-y-6 lg:hidden" }, a.map(s)),
      n(
        "div",
        { key: "desktop", className: "hidden items-start gap-6 lg:grid lg:grid-cols-2" },
        i.map((l, d) => n("div", { key: d, className: "space-y-6" }, l.map(s)))
      )
    ])
  ]));
}
function mc({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: a,
  onClose: i
}) {
  const s = Nd(e), [l, d] = z([]), c = s.map((m) => m.tagName).join("|");
  return pe(() => {
    const m = new Set(s.map((u) => u.tagName));
    d((u) => u.filter((y) => m.has(y)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && r == null && i();
    },
    onKeyDownCapture: (m) => Ot(m, {
      onCancel: t || r != null ? void 0 : i
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
        const y = l.includes(m.tagName), b = `incorrect-example-tag-${u}`;
        return n("section", {
          key: m.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": y,
            "aria-controls": b,
            onClick: () => d((p) => y ? p.filter((f) => f !== m.tagName) : [...p, m.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: Nr(!1) }
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
            id: b,
            className: "divide-y divide-border border-t border-border"
          }, m.examples.map((p) => {
            const f = `${Ae(p.startSec)}${p.endSec == null ? "" : ` – ${Ae(p.endSec)}`}`, w = r === p.id;
            return n("div", {
              key: p.id,
              className: "flex items-center justify-between gap-3 px-3 py-2 text-sm"
            }, [
              n(
                "span",
                { key: "time", className: "font-mono text-xs text-secondary" },
                f
              ),
              n("button", {
                key: "remove",
                type: "button",
                disabled: t || r != null,
                onClick: () => a(p),
                "aria-label": `${w ? "Restoring" : "Restore to review"} ${m.tagName} example at ${f}`,
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
        onClick: i,
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
  const [o, a] = z(""), [i, s] = z(0), l = me(null), d = qe(() => Pl(e, o), [e, o]), c = Math.min(i, Math.max(0, d.length - 1)), m = jl(d);
  pe(() => {
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
      var b;
      if (y.key === "Tab")
        Wt(y);
      else if (y.key === "Escape")
        y.preventDefault(), y.stopPropagation(), r();
      else if (y.key === "ArrowDown" || y.key === "ArrowUp") {
        y.preventDefault(), y.stopPropagation();
        const p = y.key === "ArrowDown" ? 1 : -1;
        s((f) => d.length ? (f + p + d.length) % d.length : 0);
      } else y.key === "Enter" && !((b = y.nativeEvent) != null && b.isComposing) && (y.preventDefault(), y.stopPropagation(), u());
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
          a(y.target.value), s(0);
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
    }, d.length ? d.flatMap((y, b) => {
      var q;
      const p = y.segment || y, f = p.endSec == null ? Ae(p.startSec) : `${Ae(p.startSec)} – ${Ae(p.endSec)}`, w = `${Gt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, R = b === c, g = b > 0 ? d[b - 1].groupKey : null, B = m && y.groupKey !== g ? n("div", {
        key: `group:${y.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, y.groupName) : null, U = n("button", {
        key: p.id,
        id: `segment-quick-search-${p.id}`,
        ref: R ? l : null,
        type: "button",
        role: "option",
        "aria-selected": R,
        onMouseEnter: () => s(b),
        onClick: () => t(p),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${R ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        m ? n("span", { key: "group", className: "sr-only" }, `${y.groupName} group`) : null,
        n(cn, { key: "review", state: p.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        (q = y.performers) != null && q.length ? n(Cr, {
          key: "performers",
          performers: y.performers,
          performerAssignments: y.performerAssignments
        }) : null,
        n(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          f
        ),
        n("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: w
        }, w)
      ]);
      return B ? [B, U] : [U];
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
    drafts: r.drafts.sort((o, a) => o.startSec - a.startSec || String(o.id).localeCompare(String(a.id)))
  })).sort((r, o) => r.tagName.localeCompare(o.tagName) || r.key.localeCompare(o.key));
}
function fc({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: a,
  onClose: i
}) {
  const s = qe(() => pc(e), [e]), [l, d] = z([]), c = s.reduce((b, p) => b + p.drafts.length, 0), m = me(null);
  go({ confirmRef: m, cancelRef: o, confirmReady: !t && c > 0 });
  const u = (b) => d((p) => p.includes(b) ? p.filter((f) => f !== b) : [...p, b]), y = (b) => `segment-studio-publish-approved-${b.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && !t && i();
    },
    onKeyDownCapture: (b) => Ot(b, {
      onCancel: t ? void 0 : i,
      onConfirm: c > 0 && !t ? a : void 0
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
      ].flatMap(([b, p]) => [
        n("dt", { key: `${b}:label`, className: "text-secondary" }, b),
        n("dd", { key: `${b}:value`, className: "font-semibold text-foreground" }, String(p))
      ])),
      s.length ? n("div", { key: "groups", className: "space-y-2" }, s.map((b) => {
        const p = l.includes(b.key);
        return n("section", { key: b.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": p,
            "aria-controls": y(b),
            onClick: () => u(b.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: Nr(!1) }
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, p ? "▾" : "▸"),
            n("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, b.tagName),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${b.drafts.length} draft${b.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          p ? n("div", {
            key: "drafts",
            id: y(b),
            className: "divide-y divide-border border-t border-border"
          }, b.drafts.map((f) => {
            const w = f.endSec == null ? Ae(f.startSec) : `${Ae(f.startSec)} – ${Ae(f.endSec)}`, R = `${Gt(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`;
            return n("div", { key: f.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(cn, { key: "review", state: f.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, w),
              n("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: R
              }, R)
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
        onClick: i,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Cancel"),
      n("button", {
        key: "confirm",
        ref: m,
        type: "button",
        disabled: t || c === 0,
        onClick: a,
        className: "rounded-md border border-emerald-500/60 bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-emerald-500/30 disabled:opacity-50"
      }, t ? "Publishing…" : `Publish ${c} approved draft${c === 1 ? "" : "s"}`)
    ])
  ]));
}
function yc({ candidates: e, processing: t, error: r, onConfirm: o, onClose: a }) {
  const i = Ol(e), [s, l] = z(() => /* @__PURE__ */ new Set()), [d, c] = z(() => new Set(i.map((f) => f.key))), m = i.flatMap((f) => d.has(f.key) ? f.candidates : []), u = (f) => l((w) => {
    const R = new Set(w);
    return R.has(f) ? R.delete(f) : R.add(f), R;
  }), y = (f) => c((w) => {
    const R = new Set(w);
    return R.has(f) ? R.delete(f) : R.add(f), R;
  }), b = (f) => f.assignment.map(({ slot: w, performer: R }) => `${w.label || `Slot ${w.sortOrder + 1}`}: ${R.name}`).join(", "), p = (f) => `segment-studio-auto-assign-${f.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (f) => {
      f.target === f.currentTarget && !t && a();
    },
    onKeyDownCapture: (f) => {
      f.key === "Enter" && f.target instanceof HTMLInputElement || Ot(f, {
        onCancel: t ? void 0 : a,
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
      e.length ? n("div", { className: "space-y-3" }, i.map((f) => n("section", { key: f.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
        n("header", {
          key: "header",
          className: "flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2",
          style: { background: Nr(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(f.key),
            disabled: t,
            onChange: () => y(f.key),
            "aria-label": `Include ${f.tagName} assignment: ${b(f)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(f.key),
            "aria-controls": p(f),
            "aria-label": `${s.has(f.key) ? "Collapse" : "Expand"} ${f.tagName} assignment: ${b(f)}`,
            onClick: () => u(f.key),
            className: "shrink-0 rounded px-1 text-sm text-secondary hover:bg-muted/50 hover:text-foreground disabled:opacity-50"
          }, s.has(f.key) ? "▾" : "▸"),
          n(
            "span",
            { key: "tag", className: "min-w-24 flex-1 truncate text-sm font-semibold text-foreground" },
            f.tagName
          ),
          n(
            "span",
            { key: "performers", className: "flex min-w-0 flex-wrap items-center gap-2" },
            f.assignment.map(({ slot: w, performer: R }) => {
              const g = w.label || `Slot ${w.sortOrder + 1}`;
              return n("span", {
                key: w.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${g}: ${R.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${g}: ${R.name}`
                }, `${g}: ${R.name}`),
                n(Yn, {
                  key: "avatar",
                  performer: { id: R.performerId, name: R.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(nn, { key: "states", counts: f.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(f.candidates),
            "aria-label": `Auto-Assign ${f.tagName}: ${b(f)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${f.candidates.length})`)
        ]),
        s.has(f.key) ? n(
          "div",
          { key: "segments", id: p(f), className: "divide-y divide-border/70" },
          f.candidates.map((w) => {
            const R = w.endSec == null ? Ae(w.startSec) : `${Ae(w.startSec)} – ${Ae(w.endSec)}`, g = `${Gt(w.sourceKey)}${w.confidence == null ? "" : ` · ${Math.round(w.confidence * 100)}%`}`;
            return n("div", {
              key: w.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(cn, { key: "review", state: w.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                w.tagName || "Tag segment"
              ),
              n(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                R
              ),
              n("span", {
                key: "provenance",
                className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                title: g
              }, g)
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
      n("button", { key: "cancel", type: "button", disabled: t, onClick: a, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Cancel"),
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
function bc({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, a = Number(e.dependentSegmentCount) || 0, i = Number(e.deletedSegmentCount) || o + a, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => Ot(d, { onCancel: r, onConfirm: t })
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
        `${o} rejected segment${o === 1 ? "" : "s"}${a ? ` and ${a} dependent derived segment${a === 1 ? "" : "s"}` : ""} will be deleted (${i} total).`
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
  onConfirm: a,
  onClose: i
}) {
  const [s, l] = z(!1), d = me(null);
  if (go({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Ae(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && i();
    },
    onKeyDownCapture: (m) => Ot(m, {
      onCancel: t ? void 0 : i,
      onConfirm: t ? void 0 : () => a(s)
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
        onClick: i,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Cancel"),
      n("button", {
        key: "confirm",
        ref: d,
        type: "button",
        disabled: t,
        onClick: () => a(s),
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
function xc({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: a, onConfirm: i, onClose: s }) {
  var u, y;
  const l = e ? e.createCount + e.linkCount : 0, d = me(null);
  go({ confirmRef: d, cancelRef: a, confirmReady: !t && !r && l > 0 && !o });
  const c = ((u = e == null ? void 0 : e.outputs) == null ? void 0 : u.slice(0, 200)) || [], m = vc(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && !r && s();
    },
    onKeyDownCapture: (b) => Ot(b, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? i : void 0
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
        ].flatMap(([b, p]) => [
          n("dt", { key: `${b}:label`, className: "text-secondary" }, b),
          n("dd", { key: `${b}:value`, className: "font-semibold text-foreground" }, String(p))
        ])),
        e.conflictCount > 0 ? n(
          "p",
          { key: "conflicts", role: "status", className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground" },
          `${e.conflictCount} existing derivation ${e.conflictCount === 1 ? "branch was" : "branches were"} skipped because its lineage no longer matches the active rule. Resolve these through lineage maintenance.`
        ) : null,
        m.length ? n("div", { key: "outputs", className: "space-y-2" }, [
          ...m.map((b) => n("article", {
            key: b.key,
            className: "rounded-md border border-border bg-surface p-3"
          }, [
            n("div", { key: "root", className: "flex min-w-0 items-center gap-2" }, [
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
                `${b.rootTagName} @ ${Ae(b.rootStartSec)}`
              ),
              n(
                "span",
                { key: "count", className: "shrink-0 text-xs font-medium text-secondary" },
                `${b.outputs.length} ${b.outputs.length === 1 ? "change" : "changes"}`
              )
            ]),
            n(
              "div",
              { key: "tree", className: "mt-2 space-y-1 border-l border-border pl-2" },
              b.outputs.map((p, f) => n("div", {
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
      n("button", { key: "cancel", ref: a, type: "button", disabled: r, onClick: s, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Cancel"),
      n("button", {
        key: "confirm",
        ref: d,
        type: "button",
        disabled: t || r || l === 0,
        onClick: i,
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
  saveMessage: a,
  savingSegmentId: i,
  creatingSegmentId: s = null,
  saveTag: l,
  saveTiming: d,
  slotStatus: c,
  performerSlotsAvailable: m,
  selectedPerformerSlots: u,
  performerSlots: y,
  detail: b,
  video: p,
  slotButtonRef: f,
  tagSearchRef: w,
  onDetailChange: R,
  setSaveMessage: g,
  acquireSaveLock: B,
  onSlotsChanged: U,
  onRecordHistory: q,
  onCancelQueuedReview: F,
  splitSegment: M,
  duplicateSegment: $,
  provenance: k,
  lineage: S,
  onNavigateLineageItem: A,
  tagEditing: K,
  onCancelTagEditing: L,
  detailPanelRef: T,
  onReduceSelection: H
}) {
  var xe, Ce, Oe, fe;
  const J = me(null), _ = me(null), oe = () => {
    var Y;
    (Y = _.current) == null || Y.call(_), _.current = null;
  }, ue = me(null), be = me(null), E = me(null), ae = me(null), [le, X] = z(!1);
  pe(() => {
    J.current && (J.current.scrollTop = 0), X(!1);
  }, [t == null ? void 0 : t.id]), pe(() => {
    var Y, ye;
    le && ((ye = (Y = ue.current) == null ? void 0 : Y.querySelector("input, select, button")) == null || ye.focus({ preventScroll: !0 }));
  }, [le]);
  function de() {
    X(!1), requestAnimationFrame(() => {
      var Y;
      return (Y = f.current) == null ? void 0 : Y.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const Y = !r.some((ee) => ee.isDerived), ye = e && m ? od(y, r) : null, I = (ye == null ? void 0 : ye.map((ee, C) => {
      var h;
      const v = r[C];
      return {
        segmentId: v.nativeSegmentId,
        itemId: v.published ? null : v.itemId,
        revision: (h = b.performerSlotRevisions) == null ? void 0 : h[v.id],
        slots: ee
      };
    })) || [];
    return n(oo.Fragment, null, [
      n(ec, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: T,
        onReduceSelection: H,
        reviewable: e,
        tagEditable: Y,
        slotsEditable: I.length > 0 && i == null,
        onEditSlots: () => X(!0),
        slotButtonRef: f,
        saveMessage: a
      }),
      K && Y ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ee) => {
          ee.target === ee.currentTarget && L();
        },
        onKeyDownCapture: (ee) => Ot(ee, { onCancel: L })
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
        n(Wn, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (ee, C) => ee == null ? L() : l(ee, C == null ? void 0 : C.label),
          disabled: i != null,
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
          var v, h;
          if (!(typeof ((v = ee.target) == null ? void 0 : v.closest) == "function" ? ee.target.closest("input, textarea, select, [contenteditable='true']") : null) && !ee.repeat && !ee.ctrlKey && !ee.altKey && !ee.metaKey && !ee.shiftKey && /^[1-9]$/.test(ee.key) && ((h = ae.current) != null && h.call(ae, Number(ee.key) - 1))) {
            ee.preventDefault(), ee.stopPropagation();
            return;
          }
          Ot(ee, { onCancel: de });
        }
      }, n("section", {
        ref: ue,
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
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Yd, {
          videoId: p.id,
          targets: I,
          performerCandidates: b.performerCandidates || [],
          shortcutRef: ae,
          acquireSaveLock: () => B("slots", -1),
          onSaved: async ({ beforeState: ee, afterState: C }) => {
            await q(
              "performer-slots.assign",
              `Assigned performers to ${I.length} segments`,
              ee,
              C
            ), de(), await U();
          },
          onConflict: U
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (Y) => {
      J.current = Y, T && (T.current = Y);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(cn, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n($r, { key: "derived" }) : null,
        t && K ? n("div", {
          key: "tag-editor",
          ref: w,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (Y) => {
            Y.key === "Escape" && (Y.preventDefault(), Y.stopPropagation(), L());
          },
          onKeyDown: (Y) => {
            td(Y, t.tagName) && (Y.preventDefault(), Y.stopPropagation(), l(t.tagId));
          }
        }, n(Wn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (Y, ye) => Y == null ? L() : l(Y, ye == null ? void 0 : ye.label),
          disabled: yl(i, t.id, s) || ((xe = S.data) == null ? void 0 : xe.tagReadOnly) === !0,
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
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(Vd, { status: c })) : null,
      t && m && u.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(hi, {
        assignments: u.map((Y) => {
          const ye = ld(Y);
          return {
            key: String(Y.slotDefinitionId),
            label: ye.label,
            performer: ye.filled ? { id: Number(Y.performerId), name: ye.performer } : null,
            title: ye.title
          };
        })
      })) : null,
      a ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, a) : null
    ]),
    t ? n(Xd, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: k
    }) : null,
    t ? n("div", { key: "controls", hidden: !0 }, [
      n("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        n("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        S.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : S.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, S.error) : S.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${S.data.derived ? "Derived segment" : "Root segment"} · ${S.data.componentSize} segment${S.data.componentSize === 1 ? "" : "s"} · ${S.data.integrityState}`
          ),
          (Ce = S.data.parents) != null && Ce.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...S.data.parents.map((Y) => n("button", {
              key: Y.nodeId,
              type: "button",
              onClick: () => A(Y.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${Y.ruleKey} ${Y.ruleVersion}`))
          ]) : null,
          (Oe = S.data.children) != null && Oe.length ? n("p", { key: "children" }, `Children: ${S.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: i != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: f,
          type: "button",
          disabled: i != null || !m || u.length === 0,
          onClick: () => X(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: m ? u.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, u.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: i != null,
          onClick: M,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        n("button", {
          key: "duplicate",
          type: "button",
          disabled: i != null,
          onClick: () => $(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        n("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: i != null,
          onClick: () => $(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    le && e && t && m && u.length > 0 ? n("div", {
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
        Ot(Y, {
          onCancel: de,
          onConfirm: () => {
            var C;
            return (C = be.current) == null ? void 0 : C.click();
          }
        });
      }
    }, n("section", {
      ref: ue,
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
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Jd, {
        key: `${t.id}:${b.performerSlotsRevision || b.slotRevision || ""}`,
        videoId: p.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: u,
        revision: (fe = b.performerSlotRevisions) == null ? void 0 : fe[t.id],
        performerCandidates: b.performerCandidates || [],
        confirmRef: be,
        shortcutRef: E,
        onOptimisticSave: (Y) => {
          const ye = B("slots", t.id);
          if (!ye)
            return g("Wait for the current save to finish before saving performer slots."), !1;
          _.current = ye, R((I) => en(
            I,
            t.id,
            Y
          ), p.id), g("Saving performer slots…"), de();
        },
        onSaved: async (Y, { beforeState: ye, afterState: I }) => {
          R((ee) => en(
            ee,
            t.id,
            Y.slots || [],
            Y.revision
          ), p.id), g("Performer slots saved.");
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
          F([t]), R((I) => {
            var ee;
            return en(
              I,
              t.id,
              Y,
              (ee = b.performerSlotRevisions) == null ? void 0 : ee[t.id]
            );
          }, p.id), g(ye.message || "Unable to save performer slots.");
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
function kc({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: a = [], selectedGroupKey: i, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: m, onZoomChange: u, onSelectGroup: y, onToggleGroup: b, onSelect: p, onSelectSegments: f, onSelectAll: w, onConfigureTag: R, onSeekTime: g, centerRef: B, showReviewState: U = !0, swimlaneTitleWidth: q, onSwimlaneTitleWidthChange: F }) {
  const M = me(null), $ = me(null), [k, S] = z(0), [A, K] = z({ scrollTop: 0, height: 320 }), [L, T] = z(null), H = qe(
    () => ln(e, r, o),
    [e, r, o]
  ), J = qe(
    () => pi(o),
    [o]
  ), _ = qe(() => yo(H), [H]), oe = qe(
    () => gd(_, a, fi(_)),
    [_, a]
  ), ue = qe(
    () => yi(oe.rows, Math.max(0, A.scrollTop - 24), A.height),
    [oe, A]
  ), be = Math.max(0, Number(d) || 0), E = Fs(k), ae = yr(q, E), le = ae / 16, X = Ls(c, be, le), de = As(be), xe = Es(be, Math.max(1, k - le * 16), m), Ce = de.filter((h, x) => x === 0 || x % xe === 0), Oe = qe(() => H.map((h) => `${h.key}:${h.trackCount}:${h.markers.map(({ segment: x, track: D }) => `${x.id}:${x.startSec}:${x.endSec ?? ""}:${D}`).join(",")}`).join("|"), [H]);
  function fe() {
    const h = $.current;
    if (!h) return;
    const x = h.querySelector("[data-timeline-track]"), D = h.firstElementChild, ne = x == null ? void 0 : x.getBoundingClientRect(), te = D == null ? void 0 : D.getBoundingClientRect(), j = ne && te ? Math.max(0, ne.left - te.left) : le * 16, re = (te == null ? void 0 : te.width) ?? h.scrollWidth;
    h.scrollTo({
      left: Ps(c, be, re, h.clientWidth, j, Ua),
      behavior: "smooth"
    });
  }
  pe(() => (B.current = fe, () => {
    B.current === fe && (B.current = null);
  })), pe(() => {
    fe();
  }, [m]);
  function Y() {
    const h = $.current, x = oe.rows.find((re) => re.kind === "lane" && re.lane.markers.some(({ segment: N }) => N.id === s));
    if (!h || !x) return;
    const D = 24, ne = x.top + D, te = ne + x.height;
    let j = h.scrollTop;
    ne < h.scrollTop + D ? j = Math.max(0, ne - D) : te > h.scrollTop + h.clientHeight && (j = Math.max(0, te - h.clientHeight)), j !== h.scrollTop && (h.scrollTop = j), K({ scrollTop: j, height: h.clientHeight });
  }
  pe(() => {
    Y();
  }, [s, Oe, oe]), pe(() => {
    const h = $.current, x = oe.rows.find((re) => re.kind === "group" && re.group.key === i);
    if (!h || !x) return;
    const D = 24, ne = x.top + D, te = ne + x.height;
    let j = h.scrollTop;
    ne < h.scrollTop + D ? j = Math.max(0, ne - D) : te > h.scrollTop + h.clientHeight && (j = Math.max(0, te - h.clientHeight)), j !== h.scrollTop && (h.scrollTop = j), K({ scrollTop: j, height: h.clientHeight });
  }, [i, oe]), pe(() => {
    const h = $.current;
    if (!h || typeof ResizeObserver > "u") return;
    const x = () => {
      S(h.clientWidth), K({ scrollTop: h.scrollTop, height: h.clientHeight }), Y();
    }, D = new ResizeObserver(x);
    return D.observe(h), x(), () => D.disconnect();
  }, [s, Oe, oe]);
  function ye(h) {
    if (!(be > 0)) return;
    const x = h.currentTarget.getBoundingClientRect(), D = Math.min(1, Math.max(0, (h.clientX - x.left) / x.width));
    g(D * be);
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
    Object.hasOwn(x, h.key) && (D = c + x[h.key]), h.key === "Home" && (D = 0), h.key === "End" && (D = be), D != null && (h.preventDefault(), h.stopPropagation(), g(Math.min(be, Math.max(0, D))));
  }
  function ee(h) {
    var D;
    const x = (D = M.current) == null ? void 0 : D.getBoundingClientRect();
    x && F(yr(h.clientX - x.left, E));
  }
  function C(h) {
    const x = h.shiftKey ? 40 : 16;
    let D = null;
    h.key === "ArrowLeft" && (D = ae - x), h.key === "ArrowRight" && (D = ae + x), h.key === "Home" && (D = 160), h.key === "End" && (D = E), D != null && (h.preventDefault(), h.stopPropagation(), F(yr(D, E)));
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
      n("button", { key: "out", type: "button", className: v, disabled: m <= 1, onClick: () => u(Sr(m - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: v, disabled: m === 1, onClick: () => u(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(m * 100)}%`),
      n("button", { key: "in", type: "button", className: v, disabled: m >= 8, onClick: () => u(Sr(m + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
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
      onPointerDown: (h) => {
        h.currentTarget.setPointerCapture(h.pointerId), ee(h);
      },
      onPointerMove: (h) => {
        h.currentTarget.hasPointerCapture(h.pointerId) && ee(h);
      },
      onKeyDown: C,
      onDoubleClick: () => F(Dt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${ae - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: $,
      onScroll: (h) => K({
        scrollTop: h.currentTarget.scrollTop,
        height: h.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: js(m) }, [
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
          "aria-valuetext": Ae(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: ye,
          onKeyDown: I
        }, Ce.map((h, x) => n("span", {
          key: h,
          className: `absolute top-0 ${Ds(x, Ce.length, be > 0 ? h / be * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Os(x, Ce.length, be > 0 ? h / be * 100 : 0)
        }, Ae(h))).concat(t.map((h) => {
          const x = be > 0 ? h.startSec / be * 100 : 0;
          return n("button", {
            key: `shot-boundary:${h.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Ae(h.startSec)} – ${Ae(h.endSec)}`,
            title: `Shot boundary · ${h.source || "manual"} · ${Ae(h.startSec)} – ${Ae(h.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${x}%`, width: "2px" },
            onClick: (D) => {
              D.stopPropagation(), g(h.startSec);
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
            ...qo(X),
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
            ...qo(X, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        H.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : ue.map((h) => {
          var W;
          const x = h.group, D = a.includes(x.key), ne = i === x.key, te = Nr(ne);
          if (h.kind === "group") return n("div", {
            key: h.key,
            "data-segment-group": x.key,
            "data-segment-group-collapsed": D ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${le}rem minmax(0,1fr)`,
              backgroundColor: te,
              top: h.top,
              height: h.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (O) => {
                if (O.metaKey || O.ctrlKey) {
                  f(x.lanes.flatMap((Q) => Q.markers.map((he) => he.segment.id)));
                  return;
                }
                y(x.key), b(x.key);
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
                U ? n(nn, { key: "states", counts: x.counts }) : null
              ] : null
            )
          ]);
          const j = h.lane, re = Jl(h.laneIndex), N = j.markers.some(({ segment: O }) => O.id === s);
          return n("div", {
            key: h.key,
            "data-grouped-swimlane": x.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${le}rem minmax(0,1fr)`,
              top: h.top,
              height: h.height,
              backgroundColor: re
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": N ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: Yl(N, re),
              title: `${Jn(j)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Jn(j),
              onClick: (O) => {
                (O.metaKey || O.ctrlKey) && f(j.markers.map((Q) => Q.segment.id));
              },
              onMouseEnter: () => T(j.key),
              onMouseLeave: () => T((O) => O === j.key ? null : O)
            }, [
              j.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (O) => {
                  O.stopPropagation(), R({ tagId: j.tagId, tagName: j.label, trigger: O.currentTarget });
                },
                "aria-label": `Configure ${j.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: L === j.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, j.label),
              (W = j.performers) != null && W.length ? n(Cr, {
                key: "performers",
                performers: j.performers,
                performerAssignments: j.performerAssignments
              }) : null,
              U ? n(nn, { key: "counts", counts: j.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, j.markers.map(({ segment: O, track: Q }) => {
              var yt;
              const he = Jr(O.startSec, be), ge = O.endSec == null ? O.startSec : Math.max(O.startSec, O.endSec), $e = Math.max(0, Jr(ge, be) - he), gt = l.includes(O.id), Le = O.id === s, Te = fo(J.get(O.id)), Je = O.endSec == null ? Ae(O.startSec) : `${Ae(O.startSec)} – ${Ae(O.endSec)}`, ot = (yt = mi[Te]) == null ? void 0 : yt.label;
              return n("button", {
                key: O.id,
                type: "button",
                onClick: (Qe) => {
                  Qe.stopPropagation(), p(O, {
                    additive: Qe.metaKey || Qe.ctrlKey,
                    rangeSegmentIds: Qe.shiftKey ? j.markers.map((bt) => bt.segment.id) : null
                  });
                },
                "aria-pressed": gt,
                "aria-current": Le ? "true" : void 0,
                "data-selected-timeline-marker": Le ? "true" : void 0,
                "data-selected-segment-shortcut-target": Le ? "true" : void 0,
                "aria-label": U ? `${O.tagName || "Tag segment"}${j.performerLabel ? `, ${j.performerLabel}` : ""}, ${O.reviewState}${ot ? `, ${ot}` : ""}, ${Je}` : `${O.tagName || "Tag segment"}${j.performerLabel ? `, ${j.performerLabel}` : ""}, ${Je}`,
                title: U ? `${O.tagName || "Tag segment"}${j.performerLabel ? ` · ${j.performerLabel}` : ""} · ${O.reviewState}${ot ? ` · ${ot}` : ""} · ${Je}` : `${O.tagName || "Tag segment"}${j.performerLabel ? ` · ${j.performerLabel}` : ""} · ${Je}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...U ? ql(O.reviewState, gt, Te, Le) : Wl(gt, Le),
                  left: `${he}%`,
                  top: `${Ql(Q)}rem`,
                  width: Vl(O.endSec, $e),
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
  onClose: a
}) {
  const [i, s] = z(null), [l, d] = z([]), [c, m] = z(null), [u, y] = z(""), [b, p] = z(!0), [f, w] = z(null), [R, g] = z(""), [B, U] = z(!1), q = me(null), F = me(0);
  pe(() => {
    const L = requestAnimationFrame(() => {
      var T;
      return (T = q.current) == null ? void 0 : T.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(L);
  }, [e]), pe(() => {
    const L = new AbortController();
    return p(!0), g(""), Promise.all([
      r ? Z(`/slot-definitions/${e}`, { signal: L.signal }) : Promise.resolve(null),
      Z("/segment-groups", { signal: L.signal })
    ]).then(([T, H]) => {
      const J = H.find((_) => (_.tags || []).some((oe) => Number(oe.tagId) === Number(e)));
      s(T), d(H), m((J == null ? void 0 : J.id) ?? null), y(J == null ? "" : String(J.id)), U(!1);
    }).catch((T) => {
      T.name !== "AbortError" && g(T.message || "Unable to load tag configuration.");
    }).finally(() => {
      L.signal.aborted || p(!1);
    }), () => L.abort();
  }, [r, e]);
  function M(L, T) {
    s({
      ...i,
      definitions: i.definitions.map((H, J) => J === L ? { ...H, ...T } : H)
    });
  }
  function $(L, T) {
    const H = L + T;
    if (H < 0 || H >= i.definitions.length) return;
    const J = [...i.definitions];
    [J[L], J[H]] = [J[H], J[L]], s({
      ...i,
      definitions: J.map((_, oe) => ({ ..._, sortOrder: oe }))
    });
  }
  function k(L) {
    const T = i.definitions[L], H = Number(T.assignmentCount) || 0, J = H === 0 ? "" : ` and its ${H} assignment${H === 1 ? "" : "s"}`;
    window.confirm(`Delete “${Tt(T)}”${J}?`) && (H > 0 && U(!0), s({
      ...i,
      definitions: i.definitions.filter((_, oe) => oe !== L).map((_, oe) => ({ ..._, sortOrder: oe }))
    }));
  }
  async function S() {
    var T;
    w("slots"), g("Saving performer slots…");
    let L;
    try {
      L = await Z(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: i.revision,
          allowSamePerformerInMultipleSlots: !!i.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: B,
          definitions: i.definitions.map((H, J) => {
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
      H.status === 409 ? (g("Performer slots changed elsewhere; current values were reloaded."), (T = H.payload) != null && T.current && (s(H.payload.current), U(!1))) : g(H.message || "Unable to save performer slots."), w(null);
      return;
    }
    try {
      await o(), g("Performer slots saved.");
    } catch {
      g("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      w(null);
    }
  }
  async function A() {
    const L = u === "" ? null : Number(u);
    if (L !== c) {
      w("group"), g("Saving tag group…");
      try {
        await Z(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: L })
        });
      } catch (T) {
        g(T.message || "Unable to assign the tag group."), w(null);
        return;
      }
      try {
        const [T, H] = await Promise.allSettled([
          Z("/segment-groups"),
          o()
        ]);
        if (T.status === "fulfilled") {
          d(T.value);
          const J = T.value.find((oe) => (oe.tags || []).some((ue) => Number(ue.tagId) === Number(e))), _ = (J == null ? void 0 : J.id) ?? null;
          m(_), y(_ == null ? "" : String(_));
        }
        g(
          T.status === "fulfilled" && H.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        w(null);
      }
    }
  }
  l.find((L) => Number(L.id) === Number(c));
  const K = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (L) => {
      L.target === L.currentTarget && !f && a();
    },
    onKeyDownCapture: (L) => Ot(L, {
      onCancel: f ? void 0 : a
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
        b ? null : n("label", { key: "choice", className: "block space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Assigned group"),
          n("select", {
            key: "select",
            value: u,
            disabled: f != null,
            onChange: (L) => y(L.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((L) => n("option", { key: L.id, value: String(L.id) }, L.name))
          ])
        ]),
        b ? null : n("button", {
          key: "save",
          type: "button",
          disabled: f != null || (u === "" ? null : Number(u)) === c,
          onClick: A,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, f === "group" ? "Saving…" : "Save tag group")
      ]),
      r ? n("section", { key: "slots", className: "space-y-3 border-t border-border pt-5", "aria-labelledby": "inline-tag-slots-heading" }, [
        n("div", { key: "heading" }, [
          n("h3", { key: "title", id: "inline-tag-slots-heading", className: "text-sm font-semibold text-foreground" }, "Performer slots"),
          n("p", { key: "copy", className: "text-xs text-secondary" }, "Define the ordered performer roles used by this tag.")
        ]),
        b ? n("p", { key: "loading", className: "rounded-md border border-dashed border-border p-4 text-sm text-secondary" }, "Loading performer slots…") : i ? n("div", { key: "editor", className: "space-y-3" }, [
          n("label", { key: "duplicates", className: "flex items-center gap-2 text-sm" }, [
            n("input", {
              key: "input",
              type: "checkbox",
              checked: !!i.allowSamePerformerInMultipleSlots,
              disabled: f != null,
              onChange: (L) => s({ ...i, allowSamePerformerInMultipleSlots: L.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(i.definitions || []).map((L, T) => n("article", {
            key: L.id || L._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: L.label || "",
                disabled: f != null,
                onChange: (H) => M(T, { label: H.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, $s.map((H) => n("label", { key: H, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: f != null,
                  checked: (L.genderHints || []).includes(H),
                  onChange: (J) => M(T, {
                    genderHints: J.target.checked ? [.../* @__PURE__ */ new Set([...L.genderHints || [], H])] : (L.genderHints || []).filter((_) => _ !== H)
                  })
                }),
                n("span", { key: "text" }, Ir(H))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${L.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: f != null || T === 0, onClick: () => $(T, -1), className: K, "aria-label": `Move ${Tt(L)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: f != null || T === i.definitions.length - 1, onClick: () => $(T, 1), className: K, "aria-label": `Move ${Tt(L)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: f != null, onClick: () => k(T), className: `${K} text-red-300` }, "Delete")
            ])
          ])),
          n("div", { key: "buttons", className: "flex items-center gap-2" }, [
            n("button", {
              key: "add",
              type: "button",
              disabled: f != null,
              onClick: () => s({
                ...i,
                definitions: [...i.definitions, {
                  _clientKey: `new-${++F.current}`,
                  label: "",
                  sortOrder: i.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: K
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: f != null,
              onClick: S,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, f === "slots" ? "Saving…" : "Save performer slots")
          ])
        ]) : null
      ]) : null,
      R ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, R) : null
    ]),
    n(
      "footer",
      { key: "footer", className: "flex items-center justify-end border-t border-border px-5 py-4" },
      n("button", {
        type: "button",
        disabled: f != null,
        onClick: a,
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
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, approvalFacetCounts: a, autoAssignCandidates: i, autoAssignError: s, autoAssignOpen: l, autoAssignPerformers: d, autoAssigning: c, cancelQueuedReviewsForSegments: m, canMoveSelectionToBin: u, captureTrainingExport: y, centerTimelineRef: b, closeEditorFilters: p, closeFirstSegmentTagDialog: f, closeMaterializeDialog: w, closeMergeConfirmation: R, closePublishApprovedDialog: g, closeTagEditing: B, collapsedSegmentGroups: U, commonActionsRef: q, compatibilityMode: F, configuringTag: M, createSegment: $, creatingSegmentId: k, currentTime: S, deleteRejectedSegments: A, detail: K, detailPanelRef: L, detailWidth: T, duplicateSegment: H, editorFilters: J, editorLayout: _, editorRef: oe, exportingExamples: ue, filtersButtonRef: be, filtersOpen: E, firstSegmentTagOpen: ae, focusRowRef: le, handleSeparatorKeyDown: X, handleSeparatorPointerDown: de, handleSeparatorPointerMove: xe, hasNextUnreviewed: Ce, hasPreviousUnreviewed: Oe, hideDerivedSegments: fe, history: Y, historyOpen: ye, historySaving: I, horizontalLayoutSize: ee, importNativeSegments: C, incorrectExamples: v, incorrectExamplesOpen: h, lineage: x, markerRailWidth: D, materializeButtonRef: ne, materializeCancelButtonRef: te, materializeDerivedSegments: j, materializeError: re, materializeLoading: N, materializeOpen: W, materializePreview: O, materializing: Q, mediaStackRef: he, mergeCancelButtonRef: ge, mergeConfirmation: $e, mergeSaving: gt, mergeSelectedSwimlane: Le, nativeImportState: Te, onDetailChange: Je, onNavigate: ot, onReload: yt, onSlotsChanged: Qe, openPublishApprovedDialog: bt, panelSeparatorProps: lt, pendingInitialSeekRef: Be, performerSlots: We, performerSlotsAvailable: Ve, playbackControlsRef: _e, previewDerivedSegments: ut, provenance: ht, provenanceSources: V, publishApprovedCancelButtonRef: se, publishApprovedDrafts: ke, publishApprovedError: Re, publishApprovedOpen: ve, quickSearchOpen: Ze, railScrollRef: Fe, railToggleRef: Ye, recordHistoryAction: Ie, rejectedDeletionPreview: Ee, removeIncorrectExample: ze, removingExampleId: Me, restoreHistoryTarget: je, runEditorAction: Xe, saveMessage: Se, saveTag: Pe, saveTiming: De, savingSegmentId: at, seekRef: et, segmentGroups: it, segmentRailLayout: Rt, segments: st, selectAllVideoSegments: we, selectSegment: Ne, selectSegmentCollection: tt, selectedGroups: wt, selectedPerformerSlots: xt, selectedSegment: St, selectedSegmentGroupKey: vt, selectedSegmentIds: Vt, selectedSegments: Kt, selectedSlotStatus: Mn, setAutoAssignError: Xn, setAutoAssignOpen: un, setConfiguringTag: Xt, setCurrentTime: mn, setEditorFilters: er, setEditorLayout: Tr, setFiltersOpen: tr, setHideDerivedSegments: Rr, setHistoryOpen: on, setIncorrectExamplesOpen: gn, setQuickSearchOpen: An, setRailViewport: pn, setRejectedDeletionPreview: Mr, setSaveMessage: nr, setSelectedSegmentGroupKey: fn, setSelectedSegmentId: an, setShortcutsOpen: yn, setTimelineZoom: En, shotBoundaries: It, shortcutsOpen: rr, slotButtonRef: Dn, splitLayout: zt, splitSegment: or, stepVideoFrame: bn, tagEditing: On, tagSearchRef: Ar, timelineDuration: Er, timelineRatioBounds: hn, timelineZoom: Pn, toggleSegmentGroup: vn, toggleSegmentRail: rt, updateTimelineRatio: kt, video: pt, videoPerformers: ar, visibleCounts: Ut, visibleSegmentRailRows: Mt, visibleSegments: ir, wideLayout: Jt, workspaceRef: Ln } = e, xn = qe(
    () => st.filter((G) => !G.published && G.reviewState === "approved"),
    [st]
  ), jn = ws(ao), Fn = xn.length, Bn = me(null), Dr = qe(() => () => on(!1), [on]), Gn = O ? O.createCount + O.linkCount : null, Nt = at != null, At = Kt.length > 0, Kn = Kt.length === 1, Or = At && Kt.every((G) => G.reviewState === "approved"), Pr = At && Kt.every((G) => G.reviewState === "rejected"), Lr = [
    { id: "marker.create", label: "New segment", disabled: Nt },
    { id: "marker.editTag", label: "Edit tag", disabled: Nt || !At },
    { id: "marker.setStart", label: "Set start", disabled: Nt || !Kn },
    { id: "marker.setEnd", label: "Set end", disabled: Nt || !Kn },
    { id: "marker.split", label: "Split", disabled: Nt || !Kn },
    ...F ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !Oe, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Or ? "Unapprove" : "Approve", disabled: Nt || !At, tone: "approve" },
      { id: "marker.reject", label: Pr ? "Unreject" : "Reject", disabled: Nt || !At, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !Ce, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...F ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: Nt || !u, tone: "reject" }
    ]
  ];
  function jr(G) {
    const Ke = Vt.includes(G.id), ce = G.id === (St == null ? void 0 : St.id), ft = G.endSec == null ? Ae(G.startSec) : `${Ae(G.startSec)} – ${Ae(G.endSec)}`, Yt = `${Gt(G.sourceKey)}${G.confidence != null ? ` · ${Math.round(G.confidence * 100)}%` : ""}`;
    return n("button", {
      key: G.id,
      type: "button",
      onClick: (_t) => Ne(G, { additive: _t.metaKey || _t.ctrlKey }),
      "aria-pressed": Ke,
      "aria-current": ce ? "true" : void 0,
      "data-selected-segment-shortcut-target": ce ? "true" : void 0,
      "aria-label": F ? `${G.tagName || "Tag segment"}, ${G.reviewState}${G.isDerived ? ", derived segment" : ""}, ${ft}` : `${G.tagName || "Tag segment"}${G.isDerived ? ", derived segment" : ""}, ${ft}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: ui(Ke, ce)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        F ? n(cn, { key: "review", state: G.reviewState, includeLabel: !1 }) : null,
        G.isDerived ? n($r, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          G.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, ft),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: Yt
        }, Yt)
      ])
    ]);
  }
  const mt = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", Ht = [...Y.actions || []].reverse().find((G) => G.sequence <= Y.cursorSequence);
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
            onClick: (G) => $i(G, ot, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${pt.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: pt.title || `Video ${pt.id}`
          }, pt.title || `Video ${pt.id}`)),
          ...ar.map((G) => n(Yn, {
            key: ct(G),
            performer: { id: ct(G), name: G.name },
            compact: !0,
            tooltip: G.name
          })),
          F ? n(nn, { key: "review-counts", counts: Ut }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          F ? null : n(Mi, { key: "bin", onNavigate: ot, compact: !0 }),
          n(Ai, { key: "settings", onNavigate: ot, compact: !0 })
        ])
      ]),
      F && K.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${K.nativeImportCount} Cove segment${K.nativeImportCount === 1 ? "" : "s"} ${K.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        Te.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, Te.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
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
        Te.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, Te.error) : null
      ]) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          F ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: at != null || i.length === 0,
            onClick: () => {
              Xn(""), un(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${i.length ? ` (${i.length})` : ""}`) : null,
          F ? n("button", {
            key: "materialize-derived",
            ref: ne,
            type: "button",
            disabled: at != null || N || Q || Gn === 0,
            onClick: ut,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, N ? "Analyzing…" : `Auto-Materialize${Gn != null ? ` (${Gn})` : ""}`) : null,
          F ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: at != null || Fn === 0,
            onClick: (G) => bt(G.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": ve,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${Fn ? ` (${Fn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: ue || Me != null || v.length === 0,
            onClick: () => gn(!0),
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
            ref: be,
            type: "button",
            onClick: () => tr(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": E,
            className: `${mt} ${r ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(pr, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${r ? ` (${r})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => yn(!0),
            className: mt
          }, [n(pr, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            ref: Bn,
            type: "button",
            disabled: (F ? Y.actions.length === 0 : Ht == null) || at != null || I,
            onClick: F ? () => on((G) => !G) : () => je(
              Ht.sequence - 1
            ),
            "aria-controls": F ? Ei : void 0,
            "aria-expanded": F ? ye : void 0,
            className: mt
          }, [
            n(pr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, F ? `History${Y.actions.length ? ` (${Y.actions.length})` : ""}` : Ht ? `Undo ${Ht.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: Ye,
            type: "button",
            onClick: rt,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": _.markerRailOpen,
            className: mt
          }, [
            n(pr, { key: "icon", name: "list" }),
            n("span", { key: "label" }, _.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ]),
      F && ye ? n(cc, {
        key: "history-popover",
        history: Y,
        historySaving: I,
        anchorRef: Bn,
        onRestore: je,
        onClose: Dr
      }) : null
    ]),
    E ? n(dc, {
      key: "editor-filters",
      filters: J,
      hideDerivedSegments: fe,
      performers: ar,
      provenanceSources: V,
      reviewCounts: a,
      segments: st,
      segmentGroups: it,
      reviewMode: F,
      onChange: er,
      onHideDerivedChange: Rr,
      onClose: p
    }) : null,
    ae ? n(lc, {
      key: "first-segment-tag-dialog",
      saving: at != null,
      error: Se,
      onSelect: (G, Ke) => $(G, Ke),
      onClose: f
    }) : null,
    Ze ? n(gc, {
      key: "quick-search-dialog",
      segments: Ll(o),
      onSelect: (G) => {
        An(!1), Ne(G, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        An(!1), requestAnimationFrame(() => {
          var G;
          return (G = oe.current) == null ? void 0 : G.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    l ? n(yc, {
      key: "auto-assign-dialog",
      candidates: i,
      processing: c,
      error: s,
      onConfirm: d,
      onClose: () => un(!1)
    }) : null,
    $e ? n(hc, {
      key: "merge-selection-dialog",
      merge: $e,
      processing: gt,
      undoable: !F,
      cancelButtonRef: ge,
      onConfirm: (G) => Le(!0, G, $e),
      onClose: R
    }) : null,
    W ? n(xc, {
      key: "materialize-derived-dialog",
      preview: O,
      loading: N,
      processing: Q,
      error: re,
      cancelButtonRef: te,
      onConfirm: j,
      onClose: () => {
        Q || w();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: Ln,
      className: `${zt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      _.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: Jt ? { position: "absolute", top: 0, right: 0, width: D, height: ee.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        st.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : ir.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: Fe,
          onScroll: (G) => pn({
            scrollTop: G.currentTarget.scrollTop,
            height: G.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: Rt.height }
        }, Mt.map((G) => {
          var ce;
          let Ke;
          if (G.kind === "group") {
            const ft = U.includes(G.group.key), Yt = G.group.lanes.reduce((_t, Fr) => _t + Fr.markers.length, 0);
            Ke = n("button", {
              type: "button",
              onClick: () => {
                fn(G.group.key), vn(G.group.key);
              },
              "aria-expanded": !ft,
              "aria-current": vt === G.group.key ? "true" : void 0,
              "data-segment-rail-group": G.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${vt === G.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, ft ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: G.group.name }, G.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Yt),
              F && ft ? n(nn, { key: "states", counts: G.group.counts }) : null
            ]);
          } else G.kind === "lane" ? Ke = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Jn(G.lane),
            "aria-label": Jn(G.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, G.lane.label),
            (ce = G.lane.performers) != null && ce.length ? n(Cr, {
              key: "performers",
              performers: G.lane.performers,
              performerAssignments: G.lane.performerAssignments
            }) : null,
            F ? n(nn, { key: "states", counts: G.lane.counts }) : null
          ]) : Ke = jr(G.segment);
          return n("div", {
            key: G.key,
            className: "absolute left-0 right-0",
            style: { top: G.top, height: G.height }
          }, Ke);
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
            style: Jt ? {
              gridTemplateColumns: _.markerRailOpen ? `${T}px 0.5rem minmax(0,1fr) 0.5rem ${D}px` : `${T}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(Sc, {
              key: "tools",
              compatibilityMode: F,
              selectedSegment: St,
              selectedSegments: Kt,
              selectedGroups: wt,
              saveMessage: Se,
              savingSegmentId: at,
              creatingSegmentId: k,
              acquireSaveLock: t,
              setSaveMessage: nr,
              saveTag: Pe,
              slotStatus: Mn,
              performerSlotsAvailable: Ve,
              selectedPerformerSlots: xt,
              performerSlots: We,
              detail: K,
              onDetailChange: Je,
              onCancelQueuedReview: m,
              video: pt,
              slotButtonRef: Dn,
              tagSearchRef: Ar,
              tagEditing: On,
              onCancelTagEditing: B,
              detailPanelRef: L,
              onReduceSelection: (G) => {
                Ne(G), requestAnimationFrame(() => {
                  var Ke;
                  return (Ke = L.current) == null ? void 0 : Ke.focus({ preventScroll: !0 });
                });
              },
              saveTiming: De,
              onSlotsChanged: Qe,
              onRecordHistory: Ie,
              splitSegment: or,
              duplicateSegment: H,
              provenance: ht,
              lineage: x,
              onNavigateLineageItem: (G) => {
                const Ke = st.find((ce) => ce.itemId === G);
                Ke && an(Ke.id);
              }
            }),
            Jt ? n(
              "div",
              { key: "detail-separator", ...lt("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            pt.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Ea, {
                streamUrl: `/api/stream/video/${pt.id}`,
                posterUrl: `/api/stream/video/${pt.id}/screenshot?v=${encodeURIComponent(pt.updatedAt || "")}`,
                format: pt.videoFile.format,
                audioCodec: pt.videoFile.audioCodec,
                duration: pt.videoFile.duration,
                videoId: pt.id,
                trackingEnabled: !1,
                onSeekRegister: (G) => {
                  et.current = G, El(Be.current, st, G) && (Be.current = null);
                },
                onPlaybackControlRegister: (G) => {
                  _e.current = G;
                },
                onTimeUpdate: mn
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            Jt && _.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...lt("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Jt && _.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: q,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...Lr.map((G) => {
              var ft;
              const Ke = (ft = jn[G.id]) == null ? void 0 : ft[0], ce = G.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : G.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: G.id,
                type: "button",
                disabled: G.disabled,
                "data-action-id": G.id,
                onClick: (Yt) => {
                  const _t = Yt.currentTarget;
                  Xe(G.id, { target: _t, preserveFocus: !0 }), G.focusWhenDisabled && requestAnimationFrame(() => {
                    wc(_t, q.current, G.focusWhenDisabled);
                  });
                },
                title: Ke ? `${G.label} (${Ke})` : G.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${ce}`
              }, [
                n("span", { key: "label" }, G.label),
                Ke ? n("kbd", {
                  key: "shortcut",
                  className: "rounded border border-border/70 bg-background/70 px-1 py-0.5 font-mono text-[10px] leading-none text-secondary"
                }, Ke) : null
              ]);
            }),
            n("div", { key: "frame-actions", className: "ml-auto flex items-center gap-1" }, [
              n("button", {
                key: "previous-frame",
                type: "button",
                disabled: !pt.videoFile,
                onClick: () => bn(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(Ns, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !pt.videoFile,
                onClick: () => bn(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(Is, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          zt ? n("div", {
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
            onPointerDown: de,
            onPointerMove: xe,
            onKeyDown: X,
            onDoubleClick: () => kt(Dt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: zt ? void 0 : { height: "20rem" } }, n(kc, {
            segments: ir,
            shotBoundaries: It,
            segmentGroups: it,
            performerSlots: We,
            collapsedGroupKeys: U,
            selectedGroupKey: vt,
            selectedSegmentId: St == null ? void 0 : St.id,
            selectedSegmentIds: Vt,
            duration: Er,
            currentTime: S,
            zoom: Pn,
            onZoomChange: En,
            onSelectGroup: fn,
            onToggleGroup: vn,
            onSelect: (G, Ke) => Ne(G, Ke),
            onSelectSegments: tt,
            onSelectAll: we,
            onConfigureTag: (G) => Xt(G),
            onSeekTime: (G) => {
              var Ke;
              return (Ke = et.current) == null ? void 0 : Ke.call(et, G, !1);
            },
            centerRef: b,
            showReviewState: F,
            swimlaneTitleWidth: _.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (G) => Tr((Ke) => ({ ...Ke, swimlaneTitleWidth: G }))
          }))
        ])
      ])
    ]),
    M ? n(vo, {
      key: `configure-tag:${M.tagId}`,
      tagId: M.tagId,
      tagName: M.tagName,
      performerSlotsEnabled: F,
      onSaved: yt,
      onClose: () => {
        const G = M.trigger;
        Xt(null), requestAnimationFrame(() => {
          var Ke;
          G != null && G.isConnected ? G.focus({ preventScroll: !0 }) : (Ke = oe.current) == null || Ke.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    ve ? n(fc, {
      key: "publish-approved-dialog",
      drafts: xn,
      processing: at === -1,
      error: Re,
      cancelButtonRef: se,
      onConfirm: ke,
      onClose: g
    }) : null,
    Ee ? n(bc, {
      key: "rejected-deletion-dialog",
      preview: Ee,
      onConfirm: () => {
        A(Ee), requestAnimationFrame(() => {
          var G;
          return (G = oe.current) == null ? void 0 : G.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Mr(null), requestAnimationFrame(() => {
          var G;
          return (G = oe.current) == null ? void 0 : G.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    rr ? n(uc, {
      key: "shortcuts-dialog",
      reviewMode: F,
      bindings: jn,
      onClose: () => yn(!1)
    }) : null,
    h ? n(mc, {
      key: "incorrect-examples-dialog",
      examples: v,
      exporting: ue,
      removingExampleId: Me,
      onExport: y,
      onRemove: ze,
      onClose: () => gn(!1)
    }) : null
  ]);
}
function Ic(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: a, segmentGroups: i, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: m, setCollapsedSegmentGroups: u, setEditorFilters: y, setHideDerivedSegments: b, setSaveMessage: p, setSelectedSegmentGroupKey: f, setSelectedSegmentId: w, setSelectedSegmentIds: R } = e;
  function g(M) {
    const $ = Ft(t, M);
    $ && u((k) => vi(k, $));
  }
  function B(M) {
    w(M), R(M == null ? [] : [M]), c.current = M, m.current = [];
  }
  function U(M, {
    focusEditor: $ = !1,
    seekToSegment: k = !1,
    additive: S = !1,
    rangeSegmentIds: A = null
  } = {}) {
    var L, T;
    const K = Zs({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: m.current
    }, M.id, A, S);
    R(K.selectedSegmentIds), w(K.activeSegmentId), c.current = K.anchorSegmentId, m.current = K.rangeBaseSegmentIds, K.activeSegmentId != null && f(Ft(t, K.activeSegmentId)), g(M.id), $ && ((L = r.current) == null || L.focus({ preventScroll: !0 })), k && ((T = a.current) == null || T.call(a, M.startSec, !1));
  }
  function q(M) {
    const $ = Ys(
      d,
      l,
      M
    );
    R($.selectedSegmentIds), w($.activeSegmentId), c.current = $.activeSegmentId, m.current = [], $.activeSegmentId != null && (f(Ft(t, $.activeSegmentId)), g($.activeSegmentId));
  }
  function F() {
    var k;
    const M = el(s), $ = M.includes(l) ? l : M[0] ?? null;
    y(Lt({})), b(!1), R(M), w($), c.current = $, m.current = [], $ != null && f(Ft(
      ln(s, i, o),
      $
    )), p(M.length === 0 ? "There are no segments to select." : `${M.length} segments selected. Collapsed Segment groups keep their selected segments.`), (k = r.current) == null || k.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: g, replaceSegmentSelection: B, selectSegment: U, selectSegmentCollection: q, selectAllVideoSegments: F };
}
function Cc(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: a, detailPanelRef: i, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, stableSaveIdentity: c, historyRef: m, onConflict: u, onDetailChange: y, onReload: b, recordHistoryAction: p, revealSegmentGroupForSelection: f, savingSegmentId: w, selectedGroups: R, selectedSegment: g, selectedSegmentIdRef: B, selectedSegments: U, selectionAnchorIdRef: q, selectionRangeBaseIdsRef: F, setMergeConfirmation: M, setSaveMessage: $, setSelectedSegmentId: k, setSelectedSegmentIds: S, video: A } = e;
  function K() {
    M(null), requestAnimationFrame(() => {
      var J;
      return (J = i.current) == null ? void 0 : J.focus({ preventScroll: !0 });
    });
  }
  async function L(J = !1, _ = !1, oe = null) {
    if (w != null) return;
    const ue = oe || bi(
      R,
      { nativeOnly: !o }
    );
    if (!ue) {
      $("Select at least two segments from one swimlane.");
      return;
    }
    if (!J && qa()) {
      M(ue);
      return;
    }
    _ && Wa(!1);
    const be = ue.endSec == null ? "open end" : Ae(ue.endSec);
    let E = ue.segments[0];
    const ae = o ? null : Pt(ue.segments, !1), le = o ? null : crypto.randomUUID(), X = ue.segments.map((fe) => fe.id), de = Td(a, ue.segments).segments.find((fe) => fe.id === E.id), xe = {
      startSec: de.startSec,
      endSec: de.endSec,
      sourceKey: de.sourceKey,
      sourceRunId: de.sourceRunId,
      confidence: de.confidence,
      isDerived: de.isDerived
    }, Ce = r("merge", ue.segments[0].id);
    if (!Ce) return;
    K();
    const Oe = qt();
    s({
      type: "add",
      entry: { id: Oe, op: "merge", targets: ue.segments.map(Et), values: xe }
    }), S([E.id]), k(E.id), q.current = E.id, F.current = [];
    try {
      const fe = ue.segments.slice(1);
      if (!o || E.nativeSegmentId != null) {
        const Y = fe.map((I) => {
          const ee = `merge-native-selection:${A.id}:${E.id}:${I.id}:${E.updatedAt}:${I.updatedAt}`;
          return { key: ee, operationId: Ue(ee), segmentId: I.id, expectedUpdatedAt: I.updatedAt };
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
        E = ye.survivor, y((I) => ga(I, ye), A.id), s({ type: "confirm", key: Oe, applied: !0 }), Y.forEach(({ key: I }) => He(I));
      } else {
        const Y = fe.map((I) => {
          const ee = `merge-draft-selection:${A.id}:${E.itemId}:${I.itemId}:${E.revision}:${I.revision}`;
          return { key: ee, operationId: Ue(ee), itemId: I.itemId, expectedRevision: I.revision };
        }), ye = await Z(`/videos/${A.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: E.itemId,
            expectedSurvivorRevision: E.revision,
            consumedDrafts: Y.map(({ key: I, ...ee }) => ee)
          })
        });
        E = ye.survivor, y((I) => ga(I, ye), A.id), s({ type: "confirm", key: Oe, applied: !0 }), Y.forEach(({ key: I }) => He(I));
      }
      S([E.id]), k(E.id), q.current = E.id, F.current = [], o ? t(Qt) : await p(
        "segments.merge",
        `Merged ${ue.segments.length} segments`,
        ae,
        Pt([E], !1),
        le
      ), f(E.id), $(`${ue.segments.length} segments merged into ${Ae(ue.startSec)} – ${be}.`);
    } catch (fe) {
      s({ type: "discard", key: Oe }), S(X), k((g == null ? void 0 : g.id) ?? X[0] ?? null), q.current = (g == null ? void 0 : g.id) ?? X[0] ?? null, F.current = [], fe.status === 409 ? await u() : $(fe.message || "Unable to merge selected segments.");
    } finally {
      Ce();
    }
  }
  function T(J, _ = U, oe = g) {
    if (_.length === 0) return Promise.resolve(null);
    const ue = ul(J, _, oe), be = Math.max(0, ue.identities.indexOf(ue.activeIdentity)), E = d(), ae = Si(E) != null || E.queued.some((X) => bo(X.targets, ue.identities.map(c))), le = l({
      kind: "review",
      lockId: ue.activeIdentity.id,
      targets: ue.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (X) => H(X, {
        ...ue,
        identities: X.targets,
        activeIdentity: X.targets[be]
      })
    });
    return le ? (ae && $(`${J === "approved" ? "Approval" : "Rejection"} queued…`), le.done) : ($("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function H({ detail: J, segments: _, onConflict: oe, onReload: ue }, be) {
    var ye;
    const E = ml(be, _);
    if (!E) {
      $("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: ae, selectedSegments: le, selectedSegment: X } = E, de = cl(le, ae), xe = le.filter((I) => I.reviewState !== de);
    if (xe.length === 0) return;
    const Ce = le.map((I) => ({
      id: I.id,
      itemId: I.itemId,
      nativeSegmentId: I.nativeSegmentId
    })), Oe = Ce.find((I) => I.id === (X == null ? void 0 : X.id)) || Ce[0], fe = (I, ee = !1) => {
      if (!(I != null && I.segments) || !ee && !Xr(B.current, Oe.id))
        return;
      const C = Ce.map((h) => nt(I == null ? void 0 : I.segments, h)).filter(Boolean), v = nt(I == null ? void 0 : I.segments, Oe) || C[0] || null;
      S(C.map((h) => h.id)), k((v == null ? void 0 : v.id) ?? null), q.current = (v == null ? void 0 : v.id) ?? null, F.current = [];
    };
    $(`Updating ${xe.length} selected segment${xe.length === 1 ? "" : "s"}…`);
    const Y = qt();
    s({
      type: "add",
      entry: { id: Y, op: "patch", targets: xe.map(Et), values: { reviewState: de } }
    });
    try {
      const I = await Z(`/videos/${A.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: m.current.revision,
          reviewState: de,
          segments: le.map((h) => h.published ? {
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
      if (Ce.forEach((h) => {
        const x = ee.get(h.nativeSegmentId != null ? `native:${h.nativeSegmentId}` : `item:${h.itemId}`);
        x && (h.nativeSegmentId = x.nativeSegmentId, h.itemId = x.itemId);
      }), I.history && t(I.history), de === "rejected" && !I.editorDelta || (I.items || []).some((h) => h.requestedNativeSegmentId != null && h.nativeSegmentId !== h.requestedNativeSegmentId)) {
        const h = await ue();
        s({ type: "confirm", key: Y, applied: h != null }), fe(h), $(`${I.updatedCount} selected segment${I.updatedCount === 1 ? "" : "s"} ${de === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const v = I.editorDelta ? (h) => _n(h, I.editorDelta) : (h) => ({
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
            reviewState: de,
            revision: D.nativeSegmentId != null ? x.revision : D.revision,
            updatedAt: D.updatedAt
          } : x;
        })
      });
      y(v, A.id), s({ type: "confirm", key: Y, applied: !0 }), fe(v(J)), $(`${I.updatedCount} selected segment${I.updatedCount === 1 ? "" : "s"} ${de === "approved" ? "approved" : de === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (I) {
      s({ type: "discard", key: Y }), I.status === 409 && ((ye = I.payload) != null && ye.currentHistory) && t(I.payload.currentHistory);
      const ee = I.status === 409 ? await oe() : J;
      fe(ee, !0), $(I.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: K, mergeSelectedSwimlane: L, saveSelectedReviewState: T };
}
function $c(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: a, autoAssigning: i, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: m, detail: u, editorFilters: y, editorRef: b, cancelSaveTasks: p, dispatchPendingChanges: f, enqueueSave: w, stableSaveIdentity: R, exportingExamples: g, hideDerivedSegments: B, incorrectExamples: U, lineage: q, materializeButtonRef: F, materializePreview: M, materializeRestoreFocusRef: $, materializing: k, mutateSegment: S, runSegmentMutation: A, pendingChanges: K, onConflict: L, onDetailChange: T, onReload: H, performerSlots: J, recordHistoryAction: _, refreshMaterializationPreview: oe, removingExampleId: ue, revealSegmentGroupForSelection: be, savingSegmentId: E, segmentGroups: ae, segments: le, selectedSegment: X, selectedSegmentIdRef: de, selectedSegments: xe, selectionAnchorIdRef: Ce, selectionRangeBaseIdsRef: Oe, setAutoAssignError: fe, setAutoAssignOpen: Y, setAutoAssigning: ye, setEditorFilters: I, setExportingExamples: ee, setHideDerivedSegments: C, setIncorrectExamples: v, setMaterializeError: h, setMaterializeLoading: x, setMaterializeOpen: D, setMaterializePreview: ne, setMaterializing: te, setRejectedDeletionPreview: j, setRemovingExampleId: re, setSaveMessage: N, setSelectedSegmentGroupKey: W, setSelectedSegmentId: O, setSelectedSegmentIds: Q, swimlanes: he, video: ge } = e;
  async function $e() {
    var Me, je, Xe;
    if (xe.length === 0 || !X || E != null) return;
    const V = kd(xe, U), se = V.segments;
    if (se.length === 0) return;
    const ke = xe.map((Se) => ({
      id: Se.id,
      itemId: Se.itemId,
      nativeSegmentId: Se.nativeSegmentId
    })), Re = ke.find((Se) => Se.id === X.id) || ke[0], ve = [], Ze = [];
    let Fe = !1, Ye = u, Ie = !1;
    const Ee = [], ze = r("feedback", Re.id);
    if (ze) {
      N(V.action === "remove" ? `Removing ${se.length} selected incorrect example${se.length === 1 ? "" : "s"}…` : `Collecting ${se.length} selected segment${se.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const Se = async (we, Ne) => {
          const tt = we.nativeSegmentId != null, wt = V.action === "remove" ? `incorrect-example-remove:${ge.id}:${Ne == null ? void 0 : Ne.id}:${Ne == null ? void 0 : Ne.revision}:${Ne == null ? void 0 : Ne.representationRevision}` : `incorrect-example-collect:${ge.id}:${tt ? `native:${we.nativeSegmentId}:${we.updatedAt}` : `item:${we.itemId}:${we.revision}`}`;
          if (V.action === "remove" && !Ne)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let xt;
          try {
            xt = V.action === "remove" ? await Z(
              `/videos/${ge.id}/incorrect-examples/${Ne.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: Ue(wt),
                  expectedExampleRevision: Ne.revision,
                  expectedRepresentationRevision: Ne.representationRevision
                })
              }
            ) : await Z(`/videos/${ge.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Ue(wt),
                nativeSegmentId: tt ? we.nativeSegmentId : null,
                itemId: tt ? null : we.itemId,
                expectedUpdatedAt: tt ? we.updatedAt : null,
                expectedRevision: tt ? null : we.revision
              })
            });
          } catch (St) {
            throw St.operationKey = wt, St;
          }
          if (!wd(V.action, xt))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return He(wt), xt;
        };
        for (const we of se) {
          const Ne = V.action === "remove" ? U.find((tt) => tt.itemId != null && tt.itemId === we.itemId) : null;
          try {
            const tt = ke.find((vt) => vt.id === we.id);
            let wt = nt(
              Ye == null ? void 0 : Ye.segments,
              tt
            ) || we, xt;
            try {
              xt = await Se(wt, Ne);
            } catch (vt) {
              if (vt.status === 409 && ((je = (Me = vt.payload) == null ? void 0 : Me.result) == null ? void 0 : je.code) === "OPERATION_REPLAYED")
                Ye = await Z(
                  `/videos/${ge.id}/editor`
                ), Ie = !0, Ee.length = 0, He(vt.operationKey), xt = vt.payload.result;
              else {
                if (V.action !== "collect" || vt.status !== 409) throw vt;
                const Vt = await Z(
                  `/videos/${ge.id}/editor`
                );
                Ye = Vt, Ie = !0, Ee.length = 0;
                const Kt = nt(
                  Vt == null ? void 0 : Vt.segments,
                  tt
                );
                if (!Kt) throw vt;
                wt = Kt, xt = await Se(wt, null);
              }
            }
            tt && xt.itemId != null && (tt.itemId = xt.itemId), Ye = _n(
              Ye,
              xt.editorDelta
            ), Ee.push(xt.editorDelta);
            const St = { segment: we, result: xt, example: Ne };
            ve.push(St);
          } catch (tt) {
            if (Ze.push(tt), ![400, 404, 409].includes(tt.status)) break;
          }
        }
        if (c && ve.length > 0) {
          const we = V.action === "remove", Ne = ve.length;
          await _(
            we ? "feedback.remove" : "feedback.collect",
            we ? `Removed ${Ne} incorrect AI example${Ne === 1 ? "" : "s"}` : `Collected ${Ne} incorrect AI example${Ne === 1 ? "" : "s"}`,
            mr(ve, we),
            mr(ve, !we)
          ) || (Fe = !0);
        }
        ve.some(({ result: we }) => we.representation === "basicNativeBin") && qn();
        const Pe = Xr(
          de.current,
          Re.id
        ), De = V.action === "collect" && ve.some(({ segment: we }) => we.id === Re.id), at = ve.map(({ segment: we }) => we.id), et = De ? hr(
          he,
          br(o, Re.id),
          { removedIds: at }
        ) : null, it = De ? (et == null ? void 0 : et.id) ?? null : Re.id;
        Pe && De && (Q(et ? [et.id] : []), O((et == null ? void 0 : et.id) ?? Cn), Ce.current = (et == null ? void 0 : et.id) ?? null, Oe.current = []);
        const Rt = await Z(`/videos/${ge.id}/incorrect-examples`);
        v(Rt);
        const st = Ye;
        if (T(Ie ? st : (we) => Ee.reduce(_n, we), ge.id), Pe && Xr(
          de.current,
          it
        )) {
          let we, Ne;
          De ? (Ne = et ? nt(st == null ? void 0 : st.segments, {
            id: et.id,
            itemId: et.itemId,
            nativeSegmentId: et.nativeSegmentId
          }) : null, we = Ne ? [Ne] : []) : (we = ke.map((tt) => nt(st == null ? void 0 : st.segments, tt)).filter(Boolean), Ne = nt(st == null ? void 0 : st.segments, Re) || we[0] || null), Q(we.map((tt) => tt.id)), O((Ne == null ? void 0 : Ne.id) ?? (De ? Cn : null)), Ce.current = (Ne == null ? void 0 : Ne.id) ?? null, Oe.current = [], W(Ne ? Ft(o, Ne.id) : null), Ne && be(Ne.id);
        }
        if (Ze.length > 0) {
          const we = ((Xe = Ze[0]) == null ? void 0 : Xe.message) || "Only segments with registered AI provenance can be collected.";
          ve.length === 0 ? N(we) : V.action === "remove" ? N(
            `Partially removed ${ve.length} of ${se.length} selected incorrect examples. ${we}`
          ) : N(
            `Partially collected ${ve.length} of ${se.length} selected segments. ${we}`
          );
        } else if (V.action === "remove")
          N(
            `${ve.length} incorrect example${ve.length === 1 ? "" : "s"} removed and ${ve.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const we = ve.filter(({ result: Ne }) => Ne.representation === "basicNativeBin").length;
          N(we === ve.length ? `${ve.length} incorrect AI example${ve.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ve.length} incorrect AI example${ve.length === 1 ? "" : "s"} collected and ${ve.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        Fe && N("The change saved, but editor history could not be updated.");
      } catch (Se) {
        N(Se.message || "Unable to update the selected incorrect examples.");
      } finally {
        ze();
      }
    }
  }
  async function gt(V) {
    if (!V || ue != null || g) return;
    const se = r("feedback", -1);
    if (!se) {
      N("Wait for the current save to finish before removing the incorrect example.");
      return;
    }
    try {
      await Le(V);
    } finally {
      se();
    }
  }
  async function Le(V) {
    var ke, Re;
    re(V.id);
    const se = `incorrect-example-remove:${ge.id}:${V.id}:${V.revision}:${V.representationRevision}`;
    try {
      let ve, Ze = !1;
      try {
        ve = await Z(
          `/videos/${ge.id}/incorrect-examples/${V.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ue(se),
              expectedExampleRevision: V.revision,
              expectedRepresentationRevision: V.representationRevision
            })
          }
        );
      } catch (Ie) {
        if (Ie.status !== 409 || ((Re = (ke = Ie.payload) == null ? void 0 : ke.result) == null ? void 0 : Re.code) !== "OPERATION_REPLAYED")
          throw Ie;
        ve = Ie.payload.result, Ze = !0;
      }
      He(se);
      let Fe = !0;
      if (c) {
        const Ee = [{ segment: nt(u.segments, {
          itemId: V.itemId
        }) || {
          id: V.itemId == null ? null : -V.itemId,
          itemId: V.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: V.representationRevision
        }, result: ve, example: V }];
        Fe = await _(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          mr(Ee, !0),
          mr(Ee, !1)
        );
      }
      const Ye = await Z(
        `/videos/${ge.id}/incorrect-examples`
      );
      v(Ye), Ze ? await H() : T(
        (Ie) => _n(Ie, ve.editorDelta),
        ge.id
      ), V.representation === "basicNativeBin" && qn(), N(Fe ? Ze ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : V.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (ve) {
      ve.status === 409 && await L(), N(ve.message || "Unable to remove the incorrect example.");
    } finally {
      re(null);
    }
  }
  async function Te() {
    if (g || ue != null || U.length === 0) return;
    ee(!0);
    const V = `incorrect-example-export:${ge.id}:${U.map((se) => `${se.id}:${se.revision}:${se.representationRevision}`).join(",")}`;
    try {
      const se = await Id(
        ge.id,
        U
      ), ke = new FormData();
      ke.append("metadata", JSON.stringify({
        operationId: Ue(V),
        examples: se.captures
      }));
      for (const Ie of se.files)
        ke.append(Ie.fieldName, Ie.file);
      const Re = await Z(
        `/videos/${ge.id}/incorrect-examples/export`,
        { method: "POST", body: ke }
      ), ve = await zl(Re.downloadUrl), Ze = URL.createObjectURL(ve.blob), Fe = document.createElement("a");
      Fe.href = Ze, Fe.download = ve.fileName, Fe.click(), setTimeout(() => URL.revokeObjectURL(Ze), 1e3);
      const Ye = await Z(
        `/training-exports/${Re.id}/complete`,
        { method: "POST" }
      );
      He(V), v(await Z(
        `/videos/${ge.id}/incorrect-examples`
      )), N(
        `Downloaded ${Re.exampleCount} incorrect example${Re.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Ye.clearedExampleCount} from the working collection.`
      );
    } catch (se) {
      N(se.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      ee(!1);
    }
  }
  async function Je(V = null) {
    const se = le.filter((je) => je.reviewState === "rejected"), ke = se.length, Re = U.some((je) => je.representation === "fullItem");
    if (V == null && ke === 0 && !Re) {
      N("There are no rejected segments to delete.");
      return;
    }
    if (V == null) {
      const je = r("delete-rejected", -1);
      if (!je) return;
      N("Preparing deletion summary…");
      try {
        const Xe = await Z(`/videos/${ge.id}/rejected/deletion/preview`, { method: "POST" }), Se = Number(Xe.deletedSegmentCount) || 0, Pe = Number(Xe.deferredRejectedSegmentCount) || 0, De = Number(Xe.protectedIncorrectExampleCount) || 0;
        if (Se === 0) {
          Pe > 0 ? N(
            `${Pe} feedback-protected rejected segment${Pe === 1 ? "" : "s"} kept. ${De} AI feedback example${De === 1 ? "" : "s"} must be exported before ${Pe === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : N("There are no rejected segments to delete.");
          return;
        }
        if (!si(Xe, N)) return;
        j(Xe), N("");
      } catch (Xe) {
        N(Xe.message || "Unable to prepare rejected segment deletion.");
      } finally {
        je();
      }
      return;
    }
    const ve = V, Ze = Number(ve.deferredRejectedSegmentCount) || 0, Fe = de.current, Ye = se.map((je) => je.id), Ie = Ze === 0 && Ye.includes(Fe), Ee = Ie ? hr(
      he,
      br(o, Fe),
      { removedIds: Ye }
    ) : null, ze = r("delete-rejected", -1);
    if (!ze) return;
    j(null), N("Deleting rejected segments…");
    const Me = Ze === 0 ? qt() : null;
    Me && f({
      type: "add",
      entry: { id: Me, op: "remove", targets: se.map(Et) }
    }), Ie && (Q(Ee ? [Ee.id] : []), O((Ee == null ? void 0 : Ee.id) ?? Cn), Ce.current = (Ee == null ? void 0 : Ee.id) ?? null, Oe.current = []);
    try {
      const je = `rejected-dependency-delete:${ge.id}:${ve.fingerprint}`, Xe = await Z(`/videos/${ge.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ue(je),
          fingerprint: ve.fingerprint
        })
      });
      He(je);
      const Se = await H();
      Me && f({ type: "confirm", key: Me, applied: Se != null }), Xe.deletedSegmentCount > 0 && t(Qt);
      const Pe = Ze > 0 ? ` ${Ze} feedback-protected rejected segment${Ze === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      N(`${Xe.deletedSegmentCount} segment${Xe.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Pe}`);
    } catch (je) {
      Me && f({ type: "discard", key: Me }), Ie && (Q(Fe == null ? [] : [Fe]), O(Fe), Ce.current = Fe, Oe.current = []), N(je.message || "Unable to delete rejected segments.");
    } finally {
      ze();
    }
  }
  async function ot(V = a) {
    if (i || V.length === 0) return;
    const se = r("auto-assign", -1);
    if (!se) {
      fe("Wait for the current save to finish before assigning performers.");
      return;
    }
    try {
      await yt(V);
    } finally {
      se();
    }
  }
  async function yt(V) {
    ye(!0), fe("");
    try {
      const se = await Z(`/videos/${ge.id}/segments/auto-assign-performer-slots`, {
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
  async function Qe() {
    D(!0), h(""), !M && (x(!0), oe());
  }
  function bt() {
    $.current = !0, D(!1), requestAnimationFrame(() => {
      var V;
      return (V = F.current) == null ? void 0 : V.focus({ preventScroll: !0 });
    });
  }
  async function lt() {
    if (!M || k || M.createCount + M.linkCount === 0)
      return;
    const V = r("materialize", -1);
    if (!V) {
      h("Wait for the current save to finish before materializing derived segments.");
      return;
    }
    try {
      await Be();
    } finally {
      V();
    }
  }
  async function Be() {
    te(!0), h("");
    let V;
    try {
      const se = `materialize-derived:${ge.id}:${M.fingerprint}`;
      V = await Z(`/videos/${ge.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ue(se),
          fingerprint: M.fingerprint,
          maxDepth: 3
        })
      }), He(se);
    } catch (se) {
      se.status === 409 && ne(null), h(se.message || "Unable to materialize derived segments."), te(!1);
      return;
    }
    ne((se) => se && { ...se, createCount: 0, linkCount: 0 });
    try {
      await H(), bt(), ne(null);
      const se = V.createdCount + V.linkedCount;
      N(`${V.createdCount} derived segment${V.createdCount === 1 ? "" : "s"} created and ${V.linkedCount} existing segment${V.linkedCount === 1 ? "" : "s"} linked.`), se === 0 && N("Every applicable derivation was already materialized.");
    } catch {
      h("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    te(!1);
  }
  async function We(V, se = null) {
    var ve, Ze, Fe, Ye;
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
      const Ee = xe.map((Se) => ({
        id: Se.id,
        itemId: Se.itemId,
        nativeSegmentId: Se.nativeSegmentId
      })), ze = xe.map((Se) => !c || Se.nativeSegmentId != null ? `native:${Se.nativeSegmentId}:${Se.updatedAt}` : `item:${Se.itemId}:${Se.revision}`).sort().join(","), Me = `bulk-tag:${ge.id}:${V}:${ze}`, je = r("tag", (X == null ? void 0 : X.id) ?? Ie[0].id);
      if (!je) return;
      N(`Changing tag for ${Ie.length} selected segment${Ie.length === 1 ? "" : "s"}…`);
      const Xe = qt();
      f({
        type: "add",
        entry: { id: Xe, op: "patch", targets: Ie.map(Et), values: ke }
      }), d();
      try {
        const Se = c ? null : crypto.randomUUID();
        await Z(`/videos/${ge.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ue(Me),
            tagId: V,
            historyReceiptId: Se,
            segments: xe.map((it) => {
              const Rt = !c || it.nativeSegmentId != null;
              return {
                nativeSegmentId: Rt ? it.nativeSegmentId : null,
                itemId: Rt ? null : it.itemId,
                expectedUpdatedAt: Rt ? it.updatedAt : null,
                expectedRevision: Rt ? null : it.revision
              };
            })
          })
        }), He(Me);
        const Pe = Pt(
          xe,
          c
        ), De = await H();
        f({ type: "confirm", key: Xe, applied: De != null });
        const at = Ee.map((it) => nt(De == null ? void 0 : De.segments, it)).filter(Boolean);
        await _(
          "segments.tag",
          `Changed tag for ${Ie.length} segment${Ie.length === 1 ? "" : "s"}`,
          Pe,
          Pt(at, c),
          Se
        );
        const et = Ee.map((it) => nt(De == null ? void 0 : De.segments, it)).filter(Boolean);
        Q(et.map((it) => it.id)), O(((ve = et.find((it) => it.id === (X == null ? void 0 : X.id))) == null ? void 0 : ve.id) ?? ((Ze = et[0]) == null ? void 0 : Ze.id) ?? null), d(), N(`${Ie.length} selected segment${Ie.length === 1 ? "" : "s"} retagged.`);
      } catch (Se) {
        f({ type: "discard", key: Xe });
        const Pe = Ee.map((at) => nt(u.segments, at)).filter(Boolean), De = nt(u.segments, {
          id: X == null ? void 0 : X.id,
          itemId: X == null ? void 0 : X.itemId,
          nativeSegmentId: X == null ? void 0 : X.nativeSegmentId
        }) || Pe[0] || null;
        Q(Pe.map((at) => at.id)), O((De == null ? void 0 : De.id) ?? null), Ce.current = (De == null ? void 0 : De.id) ?? null, Oe.current = [], Se.status === 409 && await L(), N(Se.message || "Unable to change the selected segment tags.");
      } finally {
        je();
      }
      return;
    }
    if (xe.length !== 1 || !X) return;
    const Re = ki(K, X);
    if (X.id === m || Re) {
      const Ie = Re ? { segmentId: X.id, tagId: Re.values.tagId, tagName: Re.meta.tagName } : null, Ee = bl(Ie, X, V, se);
      if (Ee && !Ve(X, Ee)) {
        d();
        return;
      }
      if (Re && (p((ze) => {
        var Me;
        return ((Me = ze.meta) == null ? void 0 : Me.pendingChangeId) === Re.id;
      }), f({ type: "discard", key: Re.id })), Ee) {
        const ze = Va(
          { ...X, tagId: Ee.tagId },
          J,
          y,
          B,
          ae
        );
        I(ze.filters), C(ze.hideDerivedSegments), N("Tag change queued…");
      } else Re && N("");
      d();
      return;
    }
    if (V === X.tagId) {
      d();
      return;
    }
    if (X.itemId != null && ((Ye = (Fe = q.data) == null ? void 0 : Fe.children) == null ? void 0 : Ye.length) > 0) {
      const Ie = r("lineage-tag", X.id);
      if (!Ie) return;
      N("Checking lineage impact…");
      let Ee = null;
      try {
        const ze = await Z(`/items/${X.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: X.revision, tagId: V })
        }), Me = ze.deletedItemIds.length > 0 || ze.removedEdgeIds.length > 0;
        if (Me && !window.confirm(
          `Changing this tag removes ${ze.removedEdgeIds.length} lineage edge${ze.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${ze.deletedItemIds.length} derived segment${ze.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
        )) {
          N("Tag change canceled.");
          return;
        }
        Ee = qt(), f({
          type: "add",
          entry: { id: Ee, op: "patch", targets: [Et(X)], values: ke }
        }), d();
        const je = `tag-change:${X.itemId}:${X.revision}:${ze.componentFingerprint}:${V}`;
        await Z(`/items/${X.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ue(je),
            expectedRevision: X.revision,
            componentFingerprint: ze.componentFingerprint,
            tagId: V
          })
        }), He(je);
        const Xe = await H();
        f({ type: "confirm", key: Ee, applied: Xe != null }), d(), N(Me ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch (ze) {
        Ee && f({ type: "discard", key: Ee }), Q([X.id]), O(X.id), Ce.current = X.id, Oe.current = [], ze.status === 409 ? (N("Lineage changed — loading the latest segments…"), await L()) : N(ze.message || "Unable to reconcile the lineage.");
      } finally {
        Ie();
      }
      return;
    }
    d(), await S(X, {
      startSec: X.startSec,
      endSec: X.endSec,
      tagId: V
    }, !0, null, !0, ke);
  }
  function Ve(V, se) {
    const ke = qt(), Re = R(Et(V));
    f({
      type: "add",
      entry: {
        id: ke,
        op: "patch",
        targets: [Re],
        values: { tagId: se.tagId, tagName: se.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: se.tagName }
      }
    });
    const ve = K.find((Fe) => Fe.op === "insert" && Fe.segment.id === V.id);
    return w({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [Re],
      dependsOn: (ve == null ? void 0 : ve.taskId) ?? null,
      meta: { pendingChangeId: ke },
      ready: (Fe, Ye) => {
        const Ie = xi(Fe.segments, Ye.targets[0]);
        return !Ie || hl(Fe, Ie.id);
      },
      run: (Fe) => _e(Fe, ke, se)
    }) ? !0 : (f({ type: "discard", key: ke }), N("Wait for the history restore to finish."), !1);
  }
  async function _e(V, se, ke) {
    const [Re] = V.resolveTargets();
    if (!Re) {
      f({ type: "discard", key: se }), N(`The new segment was not retagged${ke.tagName ? ` to ${ke.tagName}` : ""}. Choose its tag again.`);
      return;
    }
    if (Re.tagId === ke.tagId) {
      f({ type: "discard", key: se });
      return;
    }
    await A(Re, {
      startSec: Re.startSec,
      endSec: Re.endSec,
      tagId: ke.tagId
    }, {
      pendingChangeId: se,
      restoreSelectionOnFailure: !1,
      onReload: V.onReload,
      onConflict: V.onConflict
    }) || N(`The new segment was not retagged${ke.tagName ? ` to ${ke.tagName}` : ""}. Choose its tag again.`);
  }
  async function ut() {
    var Ye, Ie, Ee, ze;
    if (!l || !X || E != null) return;
    const V = [...xe].sort((Me, je) => Number(Me.nativeSegmentId ?? Me.id) - Number(je.nativeSegmentId ?? je.id)), se = new Set(V.map((Me) => Me.id)), ke = V.map((Me) => `${Me.nativeSegmentId ?? Me.id}:${Me.updatedAt}`).join("|"), Re = r("bin", X.id);
    if (!Re) return;
    N(`Moving ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin…`);
    const ve = `bulk-move:${ge.id}:${ke}`, Ze = Ue(ve), Fe = c ? null : crypto.randomUUID();
    try {
      const Me = (Pe = !1) => Z(`/videos/${ge.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ze,
          segments: V.map((De) => ({
            segmentId: De.nativeSegmentId ?? De.id,
            expectedUpdatedAt: De.updatedAt
          })),
          discardMissingImage: Pe,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: Fe
        })
      });
      let je;
      try {
        je = await Me(
          uo(ve)
        );
      } catch (Pe) {
        if (((Ye = Pe.payload) == null ? void 0 : Ye.code) !== "missing-image" || !window.confirm(`${Pe.message}

Continue and discard the missing image reference?`)) throw Pe;
        mo(ve), je = await Me(!0);
      }
      He(ve), qn();
      const Xe = new Map((je.items || []).map((Pe) => [
        Number(Pe.segmentId),
        Pe
      ]));
      await _(
        "segments.moveToBin",
        `Moved ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin`,
        Pt(V, !1),
        Pt(V.map((Pe) => {
          const De = Xe.get(
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
        Fe
      );
      const Se = hr(
        he,
        br(o, X.id),
        { removedIds: [...se] }
      );
      T((Pe) => ({
        ...Pe,
        segments: (Pe.segments || []).filter((De) => !se.has(De.id))
      }), ge.id), Q(Se ? [Se.id] : []), O((Se == null ? void 0 : Se.id) ?? Cn), Ce.current = (Se == null ? void 0 : Se.id) ?? null, Oe.current = [], Se && (W(Ft(o, Se.id)), be(Se.id)), requestAnimationFrame(() => {
        var Pe;
        return (Pe = b.current) == null ? void 0 : Pe.focus({ preventScroll: !0 });
      }), N(`Moved ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Me) {
      const je = ((Ie = Me.payload) == null ? void 0 : Ie.code) || ((ze = (Ee = Me.payload) == null ? void 0 : Ee.result) == null ? void 0 : ze.code);
      Me.status === 409 && je === "CANONICAL_SEGMENT_CHANGED" ? await L() : N(Me.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Re();
    }
  }
  async function ht() {
    if (!(c || s.current || E != null)) {
      s.current = !0, N("Checking the recycling bin…");
      try {
        const V = await Z("/bin"), se = await di(V, () => N("Emptying the recycling bin…"));
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
  return { toggleIncorrectExample: $e, removeIncorrectExample: gt, captureTrainingExport: Te, deleteRejectedSegments: Je, autoAssignPerformers: ot, previewDerivedSegments: Qe, closeMaterializeDialog: bt, materializeDerivedSegments: lt, saveTag: We, moveToBin: ut, emptyRecyclingBin: ht };
}
function Tc(e) {
  const { acceptHistory: t, acquireSaveLock: r, enqueueSave: o, getSaveQueueSnapshot: a, commonActionsRef: i, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: m, history: u, historyRef: y, historySaving: b, horizontalLayoutSize: p, mediaStackHeight: f, mediaStackRef: w, onDetailChange: R, onReload: g, railToggleRef: B, recordHistoryAction: U, savingSegmentId: q, setCollapsedSegmentGroups: F, setEditorLayout: M, setHistorySaving: $, setIncorrectExamples: k, setSaveMessage: S, shotBoundaries: A, timelineDuration: K, video: L, workspaceRef: T } = e;
  async function H(C, v, h) {
    var te, j, re, N;
    const x = C.type === "segment" ? [C] : C.segments || [], D = (v == null ? void 0 : v.type) === "segment" ? [v] : (v == null ? void 0 : v.segments) || [];
    let ne = h;
    for (const [W, O] of x.entries()) {
      const Q = D[W], he = ((te = O.identity) == null ? void 0 : te.nativeSegmentId) != null || ((j = O.identity) == null ? void 0 : j.published) === !0, ge = ((re = Q == null ? void 0 : Q.identity) == null ? void 0 : re.recycleBinItemId) ?? ((N = Q == null ? void 0 : Q.identity) == null ? void 0 : N.itemId);
      let $e = nt(ne.segments, Q == null ? void 0 : Q.identity) || nt(ne.segments, O.identity);
      if (!$e && he && ge != null && Q.identity.revision != null) {
        const Te = `history-restore:${L.id}:${ge}:${Q.identity.revision}`;
        await Z(`/bin/${ge}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ue(Te),
            expectedRevision: Q.identity.revision
          })
        }), He(Te), ne = await g(), $e = ne.segments.find((Je) => Je.tagId === O.values.tagId && Je.startSec === O.values.startSec && Je.endSec === O.values.endSec);
      }
      if (!$e)
        throw new Error("A segment in this history state no longer exists.");
      if (($e.nativeSegmentId != null || $e.published === !0) !== he) {
        if (he) {
          const Te = $e.recycleBinItemId ?? $e.itemId ?? ge;
          if (Te == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Je = `history-restore:${L.id}:${Te}:${$e.revision}:${O.values.reviewState ?? "native"}`;
          await Z(`/bin/${Te}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ue(Je),
              expectedRevision: $e.revision
            })
          }), He(Je);
        } else {
          const Te = `history-bin:${L.id}:${$e.nativeSegmentId}:${$e.updatedAt}:${O.values.reviewState}`;
          await Z(`/videos/${L.id}/segments/${$e.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ue(Te),
              expectedUpdatedAt: $e.updatedAt,
              reviewState: O.values.reviewState
            })
          }), He(Te);
        }
        if (ne = await g(), !he)
          continue;
        if ($e = nt(ne.segments, O.identity) || ne.segments.find((Te) => Te.tagId === O.values.tagId && Te.startSec === O.values.startSec && Te.endSec === O.values.endSec), !$e)
          throw new Error("The restored segment could not be found.");
      }
      const Le = O.values;
      if ($e.nativeSegmentId == null && $e.itemId != null) {
        const Te = `history-draft-update:${L.id}:${$e.itemId}:${$e.revision}:${Le.tagId}:${Le.startSec}:${Le.endSec ?? "open"}:${Le.reviewState}`;
        await Z(`/videos/${L.id}/drafts/${$e.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ue(Te),
            expectedRevision: $e.revision,
            ...Le
          })
        }), He(Te);
      } else
        await Z(`/videos/${L.id}/segments/${$e.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Le, expectedUpdatedAt: $e.updatedAt })
        });
      ne = await g();
    }
    return ne;
  }
  async function J(C, v) {
    var h;
    for (const x of C.targets || []) {
      const D = nt(v.segments, x.identity);
      if (!D)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const ne = (h = v.performerSlotRevisions) == null ? void 0 : h[D.id];
      await Z(D.published ? `/videos/${L.id}/segments/${D.nativeSegmentId}/slots` : `/videos/${L.id}/drafts/${D.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: ne,
          assignments: x.assignments
        })
      }), v = await g();
    }
    return v;
  }
  async function _(C, v, h) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let x = v, D = await Z(`/videos/${L.id}/incorrect-examples`);
    const ne = (te) => D.find((j) => {
      var re;
      return j.id === te.exampleId || ((re = te.collectedIdentity) == null ? void 0 : re.itemId) != null && j.itemId === te.collectedIdentity.itemId;
    });
    for (const [te, j] of (C.entries || []).entries()) {
      const re = `history-feedback:${L.id}:${h.action.sequence}:${h.direction}:${te}`, N = ne(j);
      if (C.collected && N) {
        He(re);
        continue;
      }
      let W;
      if (C.collected) {
        const O = nt(
          x.segments,
          j.collectedIdentity
        ) || nt(
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
            operationId: Ue(re),
            nativeSegmentId: Q ? O.nativeSegmentId : null,
            itemId: Q ? null : O.itemId,
            expectedUpdatedAt: Q ? O.updatedAt : null,
            expectedRevision: Q ? null : O.revision
          })
        });
      } else {
        if (!N) {
          He(re);
          continue;
        }
        W = await Z(
          `/videos/${L.id}/incorrect-examples/${N.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ue(re),
              expectedExampleRevision: N.revision,
              expectedRepresentationRevision: N.representationRevision
            })
          }
        );
      }
      He(re), x = _n(
        x,
        W.editorDelta
      ), D = await Z(
        `/videos/${L.id}/incorrect-examples`
      );
    }
    return k(D), x;
  }
  async function oe(C, v, h = []) {
    const x = C.state;
    if (!s && ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")) {
      const ne = `basic-history:${L.id}:${y.current.revision}:${C.action.sequence}:${C.direction}`, te = await Z(`/videos/${L.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ue(ne),
          expectedHistoryRevision: y.current.revision,
          actionSequence: C.action.sequence,
          direction: C.direction
        })
      });
      return t(te.history), h.push(ne), g();
    }
    const D = C.direction === "backward" ? C.action.afterState : C.action.beforeState;
    if ((x == null ? void 0 : x.type) === "composite") {
      let ne = v;
      const te = (D == null ? void 0 : D.type) === "composite" ? D.states || [] : [];
      for (const [j, re] of (x.states || []).entries()) {
        const N = te[j];
        ne = await oe({
          ...C,
          state: re,
          action: {
            ...C.action,
            beforeState: C.direction === "backward" ? re : N,
            afterState: C.direction === "backward" ? N : re
          }
        }, ne, h);
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
      return _(x, v, C);
    if ((x == null ? void 0 : x.type) === "shots") {
      const ne = Hr(v.shotBoundaries || []), te = await Z(`/videos/${L.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ue(`history-shots:${L.id}:${ne}:${x.fingerprint}`),
          expectedFingerprint: ne,
          boundaries: x.boundaries
        })
      });
      return { ...v, shotBoundaries: te };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function ue(C) {
    if (b || C === u.cursorSequence) return;
    if (q != null) {
      S("Finish the pending saves before restoring history.");
      return;
    }
    if (ua(u, C).length === 0) return;
    const h = o({
      kind: "history",
      lockId: -1,
      exclusive: !0,
      run: (x) => be(x.detail, C)
    });
    if (!h) {
      S("Finish the pending saves before restoring history.");
      return;
    }
    await h.done;
  }
  async function be(C, v) {
    var x;
    const h = ua(y.current, v);
    if (h.length !== 0) {
      $(!0), S(`Restoring ${h.length} history ${h.length === 1 ? "action" : "actions"}…`);
      try {
        let D = C;
        const ne = [];
        for (const j of h)
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
            expectedRevision: y.current.revision,
            targetSequence: v
          })
        }) : y.current;
        ne.forEach(He), t(te), await g(), S("History restored.");
      } catch (D) {
        D.status === 409 && ((x = D.payload) != null && x.current) && t(D.payload.current), await g(), S(D.message || "Unable to restore editor history.");
      } finally {
        $(!1);
      }
    }
  }
  function E(C) {
    M((v) => ({ ...v, timelineRatio: lo(C, f) }));
  }
  function ae(C) {
    var x, D;
    const v = (x = w.current) == null ? void 0 : x.getBoundingClientRect();
    if (!v) return;
    const h = ((D = i.current) == null ? void 0 : D.offsetHeight) || 0;
    E(Gs(
      C.clientY,
      v.top + h,
      Math.max(0, v.height - h)
    ));
  }
  function le(C) {
    C.currentTarget.setPointerCapture(C.pointerId), ae(C);
  }
  function X(C) {
    C.currentTarget.hasPointerCapture(C.pointerId) && ae(C);
  }
  function de(C) {
    const v = C.shiftKey ? 0.1 : 0.05;
    let h = null;
    C.key === "ArrowUp" && (h = c.timelineRatio + v), C.key === "ArrowDown" && (h = c.timelineRatio - v);
    const x = so(f);
    C.key === "Home" && (h = x.minimum), C.key === "End" && (h = x.maximum), h != null && (C.preventDefault(), C.stopPropagation(), E(h));
  }
  function xe(C) {
    const v = C === "detailWidth" ? p.focusRow : p.workspace, h = p.workspace > 0 ? Yr(p.workspace, 600) : 560, x = sn(c.markerRailWidth, h), D = C === "detailWidth" ? 344 + (c.markerRailOpen ? x + 24 : 0) : 600;
    return v > 0 ? Yr(v, D) : 560;
  }
  function Ce(C, v) {
    M((h) => ({ ...h, [C]: sn(v, xe(C)) }));
  }
  function Oe(C, v) {
    var x, D;
    const h = v === "detailWidth" ? (x = m.current) == null ? void 0 : x.getBoundingClientRect() : (D = T.current) == null ? void 0 : D.getBoundingClientRect();
    h && Ce(v, v === "detailWidth" ? C.clientX - h.left : h.right - C.clientX);
  }
  function fe(C, v) {
    const h = xe(C), x = sn(c[C], h);
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
        D.currentTarget.setPointerCapture(D.pointerId), Oe(D, C);
      },
      onPointerMove: (D) => {
        D.currentTarget.hasPointerCapture(D.pointerId) && Oe(D, C);
      },
      onKeyDown: (D) => {
        const ne = D.shiftKey ? 40 : 16;
        let te = null;
        D.key === "ArrowLeft" && (te = C === "detailWidth" ? -ne : ne), D.key === "ArrowRight" && (te = C === "detailWidth" ? ne : -ne);
        let j = te == null ? null : x + te;
        D.key === "Home" && (j = 240), D.key === "End" && (j = h), j != null && (D.preventDefault(), D.stopPropagation(), Ce(C, j));
      },
      onDoubleClick: () => Ce(C, Dt[C]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function Y() {
    M((C) => ({ ...C, markerRailOpen: !C.markerRailOpen })), requestAnimationFrame(() => {
      var C;
      return (C = B.current) == null ? void 0 : C.focus({ preventScroll: !0 });
    });
  }
  function ye(C) {
    F((v) => v.includes(C) ? v.filter((h) => h !== C) : rn([...v, C]));
  }
  function I(C, v = !0, h = l) {
    const x = a().running != null, D = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (ne) => ee(ne.detail, C, v, h)
    });
    return D ? (x && S(C === "split" ? "Shot boundary queued…" : "Shot merge queued…"), D.done.then((ne) => ne.value ?? null)) : (S("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function ee(C, v, h, x) {
    var re;
    const D = (C == null ? void 0 : C.shotBoundaries) || [], ne = Number((re = L.videoFile) == null ? void 0 : re.duration) || K, te = Hr(D), j = `shot-${v}:${L.id}:${x.toFixed(3)}:${ne.toFixed(3)}:${te}`;
    S(v === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const N = await Z(`/videos/${L.id}/shot-boundaries/${v}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Ue(j), timeSec: x })
      });
      return He(j), R((W) => ({ ...W, shotBoundaries: N }), L.id), h && await U(
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
          fingerprint: Hr(N)
        }
      ), S(v === "split" ? "Shot boundary added." : "Shots merged."), N;
    } catch (N) {
      return S(N.message || "Unable to edit shot boundaries."), null;
    }
  }
  return { applySegmentHistoryState: H, applyPerformerSlotHistoryState: J, applyHistoryState: oe, restoreHistoryTarget: ue, updateTimelineRatio: E, updateTimelineRatioFromPointer: ae, handleSeparatorPointerDown: le, handleSeparatorPointerMove: X, handleSeparatorKeyDown: de, panelWidthMaximum: xe, updatePanelWidth: Ce, handlePanelSeparatorPointer: Oe, panelSeparatorProps: fe, toggleSegmentRail: Y, toggleSegmentGroup: ye, mutateShotBoundary: I };
}
function Rc(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: a, createSegment: i, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: m, emptyRecyclingBin: u, lineage: y, mediaDuration: b, mergeSelectedSwimlane: p, moveToBin: f, mutateShotBoundary: w, openPublishApprovedDialog: R, playbackControlsRef: g, playbackShortcutConfig: B, saveSelectedReviewState: U, seekRef: q, segmentGroupKeys: F, selectSegment: M, selectedSegment: $, selectedSegmentGroupForSegment: k, selectedSegmentGroupKey: S, selectedSegments: A, setCollapsedSegmentGroups: K, setIncorrectExamplesOpen: L, setQuickSearchOpen: T, setSaveMessage: H, setSelectedSegmentGroupKey: J, setTagEditing: _, setTimelineZoom: oe, shotBoundaries: ue, slotButtonRef: be, splitSegment: E, swimlanes: ae, timelineDuration: le, toggleIncorrectExample: X, toggleSegmentGroup: de, updateTimelineRatio: xe, videoFrameRate: Ce, visibleSegments: Oe } = e;
  function fe(I) {
    var ee, C;
    (ee = g.current) == null || ee.pause(), (C = g.current) == null || C.seekBy(Sl(I, Ce));
  }
  function Y(I, ee) {
    if (A.length > 1 && al(I.id))
      return;
    let C = null;
    I.id === "video.playPause" && (C = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.toggle();
    }), I.id === "video.seekSmallBackward" && (C = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(-B.smallSeekTime);
    }), I.id === "video.seekSmallForward" && (C = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(B.smallSeekTime);
    }), I.id === "video.seekMediumBackward" && (C = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(-B.mediumSeekTime);
    }), I.id === "video.seekMediumForward" && (C = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(B.mediumSeekTime);
    }), I.id === "video.seekLongBackward" && (C = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(-B.longSeekTime);
    }), I.id === "video.seekLongForward" && (C = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(B.longSeekTime);
    }), I.id === "video.playSelected" && $ && (C = () => {
      var v;
      (v = q.current) == null || v.call(q, $.startSec, !0), requestAnimationFrame(() => {
        var h;
        return (h = m.current) == null ? void 0 : h.focus({ preventScroll: !0 });
      });
    }), (I.id === "video.playPreviousSegment" || I.id === "video.playNextSegment") && (C = () => {
      var h;
      const v = no(
        ae,
        $ == null ? void 0 : $.id,
        I.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !v || v.id === ($ == null ? void 0 : $.id) || (M(v, { focusEditor: !0, seekToSegment: !1 }), (h = q.current) == null || h.call(q, v.startSec, !0));
    }), I.id.startsWith("video.seekPercent") && (C = () => {
      var h;
      const v = Number(I.id.slice(17)) / 10;
      (h = q.current) == null || h.call(q, tl(b ?? le, v), !1);
    }), I.id === "video.jumpToSegmentStart" && $ && (C = () => {
      var v;
      return (v = q.current) == null ? void 0 : v.call(q, $.startSec, !1);
    }), I.id === "video.jumpToSegmentEnd" && $ && (C = () => {
      var v;
      return (v = q.current) == null ? void 0 : v.call(q, $.endSec ?? $.startSec, !1);
    }), I.id === "video.jumpToVideoStart" && (C = () => {
      var v;
      return (v = q.current) == null ? void 0 : v.call(q, 0, !1);
    }), I.id === "video.jumpToVideoEnd" && (C = () => {
      var v;
      return (v = q.current) == null ? void 0 : v.call(q, le, !1);
    }), I.id.startsWith("video.frame") && (C = () => {
      const v = I.id.includes("Small") ? "small" : I.id.includes("Medium") ? "medium" : "long", h = B[`${v}FrameStep`] * (I.id.endsWith("Backward") ? -1 : 1);
      fe(h);
    }), I.id.startsWith("navigation.swimlane") && (C = () => {
      const v = I.id.slice(19).toLowerCase(), h = no(ae, $ == null ? void 0 : $.id, v, s);
      h && M(h, { focusEditor: !0, seekToSegment: !1 });
    }), (I.id === "navigation.extendSwimlaneLeft" || I.id === "navigation.extendSwimlaneRight") && (C = () => {
      const v = hd(
        t,
        $ == null ? void 0 : $.id,
        I.id.endsWith("Left") ? "left" : "right"
      );
      v && M(v.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: v.segmentIds
      });
    }), (I.id === "navigation.segmentGroupUp" || I.id === "navigation.segmentGroupDown") && (C = () => {
      const v = vd(
        F,
        S ?? k,
        I.id.endsWith("Up") ? -1 : 1
      );
      v && J(v);
    }), (I.id === "navigation.previousAtPlayhead" || I.id === "navigation.nextAtPlayhead") && (C = () => {
      const v = Ks(Oe, s, I.id === "navigation.previousAtPlayhead" ? -1 : 1, $ == null ? void 0 : $.id);
      v && M(v, { focusEditor: !0, seekToSegment: !1 });
    }), I.id === "navigation.nearestInCurrentSwimlane" && (C = () => {
      const v = Ms(
        ae,
        $ == null ? void 0 : $.id,
        s
      );
      v && M(v, { focusEditor: !0, seekToSegment: !1 });
    }), I.id.includes("Unreviewed") && (C = () => {
      const v = xr(
        ae,
        $ == null ? void 0 : $.id,
        I.id.startsWith("navigation.previous") ? -1 : 1,
        I.id.endsWith("Global")
      );
      v && M(v, { focusEditor: !ee.preserveFocus, seekToSegment: !1 });
    }), (I.id === "navigation.nextTouchingPlayhead" || I.id === "navigation.previousTouchingPlayhead") && (C = () => {
      const v = Rs(ae, s, I.id === "navigation.previousTouchingPlayhead" ? -1 : 1, $ == null ? void 0 : $.id);
      v && M(v, { focusEditor: !0, seekToSegment: !1 });
    }), I.id === "navigation.quickSearch" && (C = () => T(!0)), (I.id === "navigation.previousShot" || I.id === "navigation.nextShot") && (C = () => {
      var h;
      const v = xl(ue, s, I.id === "navigation.previousShot" ? -1 : 1);
      v && ((h = q.current) == null || h.call(q, v.startSec, !1));
    }), I.id === "shot.split" && (C = () => w("split")), I.id === "shot.merge" && (C = () => w("merge")), I.id === "marker.create" && (C = () => i()), I.id === "marker.duplicate" && (C = () => d(!1)), I.id === "marker.duplicateAtPlayhead" && (C = () => d(!0)), I.id === "marker.split" && (C = () => E()), I.id === "marker.editTag" && (C = () => {
      var v;
      if (A.length > 1 && A.some((h) => h.isDerived)) {
        H("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((v = y.data) != null && v.tagReadOnly) {
        H("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      _(!0);
    }), I.id === "marker.setStart" && $ && (C = () => r(s, $.endSec)), I.id === "marker.setEnd" && $ && (C = () => r($.startSec, s)), I.id === "marker.copyTiming" && $ && (C = () => {
      H(Wd($) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), I.id === "marker.pasteTiming" && $ && (C = () => {
      const v = qd();
      if (!v) {
        H("No copied segment timing is available.");
        return;
      }
      r(v.startSec, v.endSec);
    }), I.id === "marker.mergeSelection" && (C = () => p()), I.id === "marker.moveToBin" && (C = () => f()), I.id === "marker.toggleIncorrectExample" && $ && (C = () => X()), I.id === "marker.openIncorrectExamples" && (C = () => L(!0)), I.id === "markerGroup.toggleCollapse" && S && (C = () => de(S)), I.id === "markerGroup.toggleAll" && (C = () => K((v) => bd(v, F))), I.id === "marker.assignSlots" && (C = () => {
      var v;
      return (v = be.current) == null ? void 0 : v.click();
    }), I.id === "navigation.zoomIn" && (C = () => oe((v) => Sr(v + 0.5))), I.id === "navigation.zoomOut" && (C = () => oe((v) => Sr(v - 0.5))), I.id === "navigation.resetZoom" && (C = () => oe(1)), I.id === "navigation.centerPlayhead" && (C = () => {
      var v;
      return (v = o.current) == null ? void 0 : v.call(o);
    }), I.id === "layout.growSwimlanes" && (C = () => xe(c.timelineRatio + 0.05)), I.id === "layout.shrinkSwimlanes" && (C = () => xe(c.timelineRatio - 0.05)), I.id === "marker.confirm" && $ && (C = () => U("approved")), I.id === "system.publishApproved" && (C = () => R(ee.target)), I.id === "marker.reject" && $ && (C = () => U("rejected")), I.id === "system.emptyBin" && (C = () => u()), I.id === "system.deleteRejected" && (C = () => l()), C && C();
  }
  function ye(I, ee) {
    const C = Qn.find((v) => v.id === I);
    C && $n(C, a) && Y(C, ee);
  }
  return {
    executeShortcutById: ye,
    stepVideoFrame: (I) => fe(I < 0 ? -1 : 1)
  };
}
function Na(e) {
  return e === !0;
}
function Ia() {
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
function Mc(e, t, r = !1, o = () => () => {
}) {
  const [a, i] = z(null), [s, l] = z({
    busy: !1,
    reviewState: null,
    error: ""
  }), d = me(null);
  async function c(u) {
    const y = o("import", -1);
    if (!y) {
      l({ busy: !1, reviewState: null, error: "Wait for the current save to finish before importing Cove segments." });
      return;
    }
    l({ busy: !0, reviewState: u, error: "" });
    try {
      await Z(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: to(), reviewState: u })
      }), await t(), l({ busy: !1, reviewState: null, error: "" });
    } catch (b) {
      l({
        busy: !1,
        reviewState: null,
        error: b.message || "Unable to import Cove segments."
      });
    } finally {
      y();
    }
  }
  async function m(u) {
    try {
      const y = await Z(`/videos/${e}/analysis-runs`, {
        signal: u.signal
      });
      if (!u.isActive()) return null;
      const b = (y == null ? void 0 : y[0]) || null;
      return i(b), (b == null ? void 0 : b.status) === "completed" && d.current !== b.id && (d.current = b.id, await t()), b;
    } catch {
      return null;
    }
  }
  return pe(() => {
    if (!Na(r)) {
      i(null);
      return;
    }
    const u = Ia();
    return m(u), u.dispose;
  }, [e, r]), pe(() => {
    if (!Na(r) || (a == null ? void 0 : a.status) !== "queued" && (a == null ? void 0 : a.status) !== "running") return;
    const u = Ia();
    let y = setTimeout(async function b() {
      await m(u), u.isActive() && (y = setTimeout(b, 2500));
    }, 2500);
    return () => {
      clearTimeout(y), u.dispose();
    };
  }, [a == null ? void 0 : a.id, a == null ? void 0 : a.status, r]), {
    importNativeSegments: c,
    nativeImportState: s
  };
}
const Hn = Object.freeze([]);
function Ac(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Ec({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: a, splitLayout: i, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var Lo, jo, Fo, Bo, Go;
  const m = me(null), [u, y] = z(null), [b, p] = z([]), f = me(null), w = me(null), R = me([]), g = me(null), [B, U] = z(() => Lt({})), [q, F] = z(!1), [M, $] = z(nl), [k, S] = z(0), A = me(null), [K] = z(() => Md({
    getContext: () => A.current,
    drainAfterSettle: !1
  })), L = Bl(K.subscribe, K.getSnapshot), T = Si(L), H = (P, ie) => K.acquire({ kind: P, lockId: ie }), J = (P) => K.enqueue(P), _ = (P) => K.stableIdentity(P), oe = me(!1);
  pe(() => (oe.current = !0, () => {
    oe.current = !1, queueMicrotask(() => {
      oe.current || K.dispose();
    });
  }), []);
  const ue = (P) => K.cancel(P), be = (P, ie) => K.retarget(P, ie), E = K.getSnapshot, [ae, le] = Fl(Fd, []), [X, de] = z(""), [xe, Ce] = z(""), [Oe, fe] = z(""), [Y, ye] = z(1), [I, ee] = z(zd), [C, v] = z(0), [h, x] = z({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [D, ne] = z(Qt), te = me(Qt), [j, re] = z(!1), [N, W] = z(!1), [O, Q] = z(!1), he = me(!1);
  he.current = O;
  const [ge, $e] = z(null), [gt, Le] = z(!1), [Te, Je] = z(null), [ot, yt] = z(null), Qe = me(null), [bt, lt] = z(!1), [Be, We] = z(""), Ve = me(null), _e = me(null), ut = me(!1), [ht, V] = z(Ud), [se, ke] = z(null), [Re, ve] = z(!1), [Ze, Fe] = z(!1), [Ye, Ie] = z(!1), [Ee, ze] = z(!1), [Me, je] = z(!1), [Xe, Se] = z(""), {
    importNativeSegments: Pe,
    nativeImportState: De
  } = Mc(
    e.video.id,
    o,
    l,
    (P, ie) => K.acquire({ kind: P, lockId: ie })
  ), [at, et] = z(!1), [it, Rt] = z(null), [st, we] = z(l), [Ne, tt] = z(0), [wt, xt] = z(!1), [St, vt] = z(""), [Vt, Kt] = z(null), Mn = me(null), Xn = me(null), un = me(!1), [Xt, mn] = z([]), [er, Tr] = z(!1), [tr, Rr] = z(null), on = Gd(), gn = me(null), An = me(null), pn = me(null), Mr = me(s), nr = me(null), fn = me(null), an = me(null), yn = me(null), En = me(null), It = me(null), rr = me(null), Dn = me(null), zt = me(null), or = me(null), bn = me(null), On = me(null), Ar = me(-1e12), Er = me(null), hn = me(null), [Pn, vn] = z({ scrollTop: 0, height: 512 });
  pe(() => {
    if (!at || wt || !St) return;
    const P = requestAnimationFrame(() => {
      var ie;
      return (ie = Xn.current) == null ? void 0 : ie.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(P);
  }, [at, wt, St]), pe(() => {
    if (!un.current || at || st) return;
    const P = requestAnimationFrame(() => {
      var ie;
      (ie = Mn.current) == null || ie.focus({ preventScroll: !0 }), un.current = !1;
    });
    return () => cancelAnimationFrame(P);
  }, [at, st]);
  const rt = e.video, kt = e.segments || Hn, pt = qe(() => JSON.stringify({
    segments: kt.map((P) => [
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
  }), [kt, e.performerSlots, e.itemMetadata]);
  pe(() => {
    if (!l) {
      Rt(null), we(!1);
      return;
    }
    if (T != null) {
      we(!0);
      return;
    }
    let P = !0;
    we(!0);
    const ie = setTimeout(() => {
      Z(`/videos/${rt.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Ge) => {
        P && (Rt(Ge), vt(""));
      }).catch((Ge) => {
        P && (Rt(null), vt(Ge.message || "Unable to preview derived segments."));
      }).finally(() => {
        P && we(!1);
      });
    }, 150);
    return () => {
      P = !1, clearTimeout(ie);
    };
  }, [l, rt.id, pt, Ne, T]);
  const ar = () => tt((P) => P + 1), Ut = e.segmentGroups || Hn, Mt = e.performerSlots || Hn, ir = l && e.performerSlotsAvailable !== !1, Jt = qe(
    () => (e.performerCandidates || []).filter((P) => P.isVideoPerformer),
    [e.performerCandidates]
  ), Ln = e.shotBoundaries || Hn, xn = qe(
    () => pi(Mt),
    [Mt]
  ), jn = qe(
    () => kt.map((P) => {
      const ie = xn.get(P.id) || [];
      return {
        ...P,
        slots: ie,
        assignment: ie.every((Ge) => Ge.performerId == null) ? Dl(ie, Jt) : null
      };
    }).filter((P) => P.slots.length > 0 && P.assignment != null),
    [kt, xn, Jt]
  ), Fn = Number((Lo = rt.videoFile) == null ? void 0 : Lo.frameRate) > 0 ? Number(rt.videoFile.frameRate) : 30;
  function Bn() {
    const P = he.current;
    Q(!1), P && requestAnimationFrame(() => {
      var ie;
      return (ie = It.current) == null ? void 0 : ie.focus({ preventScroll: !0 });
    });
  }
  function Dr() {
    T == null && (On.current = null, Le(!1), de(""), requestAnimationFrame(() => {
      var P;
      return (P = It.current) == null ? void 0 : P.focus({ preventScroll: !0 });
    }));
  }
  function Gn() {
    F(!1), requestAnimationFrame(() => {
      var P, ie;
      (P = Dn.current) != null && P.isConnected ? Dn.current.focus({ preventScroll: !0 }) : (ie = It.current) == null || ie.focus({ preventScroll: !0 });
    });
  }
  pe(() => {
    bn.current === u ? (bn.current = null, Q(!0)) : Q(!1);
  }, [u]), pe(() => {
    var ie;
    if (!O) return;
    const P = (ie = or.current) == null ? void 0 : ie.querySelector("input");
    document.activeElement !== P && (P == null || P.focus({ preventScroll: !0 }), P == null || P.select());
  }, [O, u]), pe(() => {
    var ie;
    if (O) return;
    const P = (ie = It.current) == null ? void 0 : ie.ownerDocument;
    P && P.activeElement === P.body && It.current.focus({ preventScroll: !0 });
  }, [O]), pe(() => {
    var Ge, dt, jt;
    const P = ln(
      zr(
        e.segments,
        e.performerSlots || [],
        Lt({}),
        l && M,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), ie = ((Ge = e.segments.find((wn) => wn.id === s)) == null ? void 0 : Ge.id) ?? ((dt = Ha(P)) == null ? void 0 : dt.id) ?? null;
    y(ie), p(ie == null ? [] : [ie]), w.current = ie, R.current = [], ke(Ft(P, ie)), U(Lt({})), F(!1), On.current = null, Le(!1), ye(1), de(""), ne(Qt), te.current = Qt, re(!1), (jt = It.current) == null || jt.focus({ preventScroll: !0 });
  }, [rt.id, s]), pe(() => {
    const P = new AbortController();
    return Z(`/videos/${rt.id}/incorrect-examples`, { signal: P.signal }).then(mn).catch((ie) => {
      ie.name !== "AbortError" && mn([]);
    }), () => P.abort();
  }, [rt.id, d == null ? void 0 : d.effectiveMode]), pe(() => {
    const P = new AbortController();
    return Z(`/videos/${rt.id}/history`, { signal: P.signal }).then((ie) => {
      const Ge = ie || Qt;
      te.current = Ge, ne(Ge);
    }).catch((ie) => {
      ie.name !== "AbortError" && de(ie.message || "Unable to load editor history.");
    }), () => P.abort();
  }, [rt.id]), pe(() => {
    _d(I);
  }, [I.timelineRatio, I.markerRailOpen, I.detailWidth, I.markerRailWidth, I.swimlaneTitleWidth]), pe(() => {
    Hd(ht);
  }, [ht]), pe(() => {
    rl(M);
  }, [M]), pe(() => {
    const P = fn.current;
    if (!i || !P || typeof ResizeObserver > "u") return;
    const ie = () => {
      var jt;
      const dt = Math.max(0, P.clientHeight - (((jt = an.current) == null ? void 0 : jt.offsetHeight) || 0));
      v(dt), ee((wn) => {
        const Ko = lo(wn.timelineRatio, dt);
        return Ko === wn.timelineRatio ? wn : { ...wn, timelineRatio: Ko };
      });
    }, Ge = new ResizeObserver(ie);
    return Ge.observe(P), an.current && Ge.observe(an.current), ie(), () => Ge.disconnect();
  }, [i]), pe(() => {
    if (!on || typeof ResizeObserver > "u") return;
    const P = En.current, ie = yn.current;
    if (!P || !ie) return;
    const Ge = () => x({
      workspace: P.clientWidth,
      focusRow: ie.clientWidth,
      focusRowHeight: ie.clientHeight
    }), dt = new ResizeObserver(Ge);
    return dt.observe(P), dt.observe(ie), Ge(), () => dt.disconnect();
  }, [on, I.markerRailOpen]);
  const Nt = qe(
    () => Ld(kt, ae),
    [kt, ae]
  );
  da(() => {
    Ci(ae, e) !== ae && le({ type: "prune", detail: e });
  }, [e, ae]);
  const At = qe(
    () => fa(
      zr(
        Nt,
        Mt,
        B,
        l && M,
        Ut
      ),
      Xt,
      !0
    ),
    [
      Nt,
      Mt,
      B,
      M,
      Ut,
      l,
      Xt
    ]
  ), Kn = Object.fromEntries($t.map((P) => [P, At.filter((ie) => ie.reviewState === P).length])), Or = fa(
    zr(
      Nt,
      Mt,
      { ...B, reviewStates: $t },
      l && M,
      Ut
    ),
    Xt,
    !0
  ), Pr = Object.fromEntries($t.map((P) => [P, Or.filter((ie) => ie.reviewState === P).length])), Lr = [...new Set(Nt.map((P) => P.sourceKey).filter(Boolean))].sort((P, ie) => Gt(P).localeCompare(Gt(ie))), jr = qs(
    B,
    l && M
  ), mt = qe(
    () => ln(At, Ut, Mt),
    [At, Ut, Mt]
  ), Ht = qe(
    () => yd(mt, ht),
    [mt, ht]
  ), G = Js(
    mt,
    u,
    s,
    {
      visibleLanes: Ht,
      reference: ((jo = m.current) == null ? void 0 : jo.videoId) === rt.id ? m.current.reference : null
    }
  );
  pe(() => {
    const P = br(mt, G == null ? void 0 : G.id);
    P && (m.current = { videoId: rt.id, reference: P });
  }, [rt.id, G == null ? void 0 : G.id, mt]);
  const Ke = qe(() => {
    const P = Od(ae);
    return P.length === 0 ? kt : [...kt, ...P];
  }, [kt, ae]), ce = G == null ? null : Ke.find((P) => P.id === G.id) || G, ft = Qo(Ke, Qo(At, b).map((P) => P.id)), Yt = !l && ft.length > 0 && ft.every((P) => P.nativeSegmentId != null), _t = At.map((P) => P.id), Fr = _t.join("|");
  f.current = (ce == null ? void 0 : ce.id) ?? null;
  const xo = xn.get(ce == null ? void 0 : ce.id) || [], Di = fo(xo), So = qe(
    () => pd(mt, b),
    [mt, b]
  ), sr = qe(() => yo(mt), [mt]), zn = qe(
    () => md(sr, ht),
    [sr, ht]
  ), Oi = qe(
    () => yi(
      zn.rows,
      Pn.scrollTop,
      Pn.height
    ),
    [zn, Pn]
  ), Pi = xr(Ht, ce == null ? void 0 : ce.id, -1, !0) != null, Li = xr(Ht, ce == null ? void 0 : ce.id, 1, !0) != null, Sn = ce ? Ft(mt, ce.id) : null, Br = fi(sr) ? sr.map((P) => P.key) : [], ji = Br.join("|"), lr = Math.max(
    0,
    Number((Fo = rt.videoFile) == null ? void 0 : Fo.duration) || 0,
    ...Nt.map((P) => Number(P.endSec ?? P.startSec) || 0)
  ), ko = Number((Bo = rt.videoFile) == null ? void 0 : Bo.duration) > 0 ? Number(rt.videoFile.duration) : null;
  D.actions;
  const Fi = Xa();
  pe(() => {
    const P = u === Cn ? u : (ce == null ? void 0 : ce.id) ?? null;
    P !== u && y(P);
  }, [ce, u]), pe(() => {
    p((P) => {
      const ie = Xs(
        P,
        _t,
        (ce == null ? void 0 : ce.id) ?? null
      );
      return ie.length === P.length && ie.every((Ge, dt) => Ge === P[dt]) ? P : ie;
    });
  }, [Fr, ce == null ? void 0 : ce.id]);
  const kn = (ce == null ? void 0 : ce.itemId) == null ? null : ((Go = e.itemMetadata) == null ? void 0 : Go[ce.itemId]) || null, Bi = {
    key: (ce == null ? void 0 : ce.itemId) != null ? `item:${ce.itemId}` : (ce == null ? void 0 : ce.nativeSegmentId) != null ? `native:${ce.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (kn == null ? void 0 : kn.provenance) || (ce == null ? void 0 : ce.fieldProvenance) || [] : []
  }, Gr = (ce == null ? void 0 : ce.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (kn == null ? void 0 : kn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  pe(() => {
    Ce(G == null ? "" : String(G.startSec)), fe((G == null ? void 0 : G.endSec) == null ? "" : String(G.endSec));
  }, [G == null ? void 0 : G.id, G == null ? void 0 : G.startSec, G == null ? void 0 : G.endSec]), pe(() => {
    Sn && V((P) => vi(P, Sn));
  }, [rt.id, s, Sn]), pe(() => {
    ke((P) => xd(Br, P, Sn));
  }, [rt.id, ji, Sn]), pe(() => {
    if (!I.markerRailOpen || (ce == null ? void 0 : ce.id) == null) return;
    const P = hn.current, ie = zn.rows.find((jt) => jt.kind === "segment" && jt.segment.id === ce.id);
    if (!P || !ie) return;
    const Ge = ie.top + ie.height;
    let dt = P.scrollTop;
    ie.top < P.scrollTop ? dt = ie.top : Ge > P.scrollTop + P.clientHeight && (dt = Math.max(0, Ge - P.clientHeight)), dt !== P.scrollTop && (P.scrollTop = dt), vn({ scrollTop: dt, height: P.clientHeight });
  }, [ce == null ? void 0 : ce.id, zn, I.markerRailOpen]), pe(() => {
    const P = hn.current;
    if (!I.markerRailOpen || !P) return;
    const ie = () => vn({
      scrollTop: P.scrollTop,
      height: P.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      ie();
      return;
    }
    const Ge = new ResizeObserver(ie);
    return Ge.observe(P), ie(), () => Ge.disconnect();
  }, [I.markerRailOpen]);
  const { revealSegmentGroupForSelection: wo, replaceSegmentSelection: Gi, selectSegment: No, selectSegmentCollection: Ki, selectAllVideoSegments: zi } = Ic({
    allSwimlanes: mt,
    editorRef: It,
    performerSlots: Mt,
    seekRef: gn,
    segmentGroups: Ut,
    segments: kt,
    selectedSegmentId: u,
    selectedSegmentIds: b,
    selectionAnchorIdRef: w,
    selectionRangeBaseIdsRef: R,
    setCollapsedSegmentGroups: V,
    setEditorFilters: U,
    setHideDerivedSegments: $,
    setSaveMessage: de,
    setSelectedSegmentGroupKey: ke,
    setSelectedSegmentId: y,
    setSelectedSegmentIds: p
  }), { acceptHistory: Kr, recordHistoryAction: dr, mutateSegment: Ui, runSegmentMutation: Hi, completeReview: _i, createSegment: Io, splitSegment: Co, duplicateSegment: $o, saveTiming: qi, applyShortcutTiming: Wi } = Bd({
    compatibilityMode: l,
    currentTime: k,
    detail: e,
    editorFilters: B,
    endInput: Oe,
    hideDerivedSegments: M,
    historyRef: te,
    mediaDuration: ko,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: Ar,
    pendingDuplicateRef: Er,
    pendingFirstSegmentStartSecRef: On,
    pendingTagEditSegmentIdRef: bn,
    performerSlots: Mt,
    enqueueSave: J,
    pendingChanges: ae,
    retargetSaveTasks: be,
    replaceSegmentSelection: Gi,
    savingSegmentId: T,
    segments: kt,
    selectedSegment: ce,
    selectedSegmentIdRef: f,
    selectedSegments: ft,
    selectionAnchorIdRef: w,
    selectionRangeBaseIdsRef: R,
    setCreatingSegmentId: $e,
    setEditorFilters: U,
    setFirstSegmentTagOpen: Le,
    setHideDerivedSegments: $,
    setHistory: ne,
    setHistoryOpen: re,
    setPublishApprovedError: We,
    setSaveMessage: de,
    acquireSaveLock: H,
    dispatchPendingChanges: le,
    setSelectedSegmentGroupKey: ke,
    setSelectedSegmentId: y,
    setSelectedSegmentIds: p,
    setTagEditing: Q,
    startInput: xe,
    tagEditingRef: he,
    timelineDuration: lr,
    video: rt
  });
  function To(P = null) {
    var dt;
    if (!l || T != null || !kt.some((jt) => !jt.published && jt.reviewState === "approved")) return;
    const ie = ((dt = It.current) == null ? void 0 : dt.ownerDocument) ?? document, Ge = ie.activeElement === ie.body ? null : ie.activeElement;
    _e.current = P != null && P.isConnected && P !== ie.body ? P : Ge, We(""), lt(!0);
  }
  function Ro() {
    T == null && (lt(!1), We(""), requestAnimationFrame(() => {
      Ac(
        _e.current,
        It.current
      ), _e.current = null;
    }));
  }
  async function Vi() {
    await _i() && Ro();
  }
  const { closeMergeConfirmation: Ji, mergeSelectedSwimlane: Mo, saveSelectedReviewState: Yi } = Cc({
    acceptHistory: Kr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: g,
    getSaveQueueSnapshot: E,
    historyRef: te,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: dr,
    revealSegmentGroupForSelection: wo,
    savingSegmentId: T,
    selectedGroups: So,
    selectedSegment: ce,
    selectedSegmentIdRef: f,
    selectedSegments: ft,
    selectionAnchorIdRef: w,
    selectionRangeBaseIdsRef: R,
    setMergeConfirmation: Je,
    setSaveMessage: de,
    acquireSaveLock: H,
    dispatchPendingChanges: le,
    enqueueSave: J,
    stableSaveIdentity: _,
    setSelectedSegmentId: y,
    setSelectedSegmentIds: p,
    video: rt
  }), Qi = (P) => {
    const ie = (P || []).map(Et);
    K.cancel((Ge) => Ge.kind === "review" && bo(Ge.targets, ie));
  }, Zi = K.settledCount();
  da(() => {
    K.markCommitted(Zi), A.current = {
      detail: e,
      segments: kt,
      onConflict: r,
      onDetailChange: t,
      onReload: o,
      tagEditing: O,
      selectedSegmentIds: b,
      activeSegmentId: (ce == null ? void 0 : ce.id) ?? null
    };
  }), pe(() => {
    K.poke();
  });
  const { toggleIncorrectExample: Xi, removeIncorrectExample: es, captureTrainingExport: ts, deleteRejectedSegments: Ao, autoAssignPerformers: ns, previewDerivedSegments: rs, closeMaterializeDialog: os, materializeDerivedSegments: as, saveTag: is, moveToBin: ss, emptyRecyclingBin: ls } = $c({
    acceptHistory: Kr,
    allSwimlanes: mt,
    autoAssignCandidates: jn,
    autoAssigning: Me,
    binEmptyingRef: ut,
    canMoveSelectionToBin: Yt,
    closeTagEditing: Bn,
    compatibilityMode: l,
    creatingSegmentId: ge,
    detail: e,
    editorFilters: B,
    editorRef: It,
    exportingExamples: er,
    hideDerivedSegments: M,
    incorrectExamples: Xt,
    lineage: Gr,
    materializeButtonRef: Mn,
    materializePreview: it,
    materializeRestoreFocusRef: un,
    materializing: wt,
    mutateSegment: Ui,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: Mt,
    cancelSaveTasks: ue,
    dispatchPendingChanges: le,
    enqueueSave: J,
    stableSaveIdentity: _,
    pendingChanges: ae,
    runSegmentMutation: Hi,
    recordHistoryAction: dr,
    refreshMaterializationPreview: ar,
    removingExampleId: tr,
    revealSegmentGroupForSelection: wo,
    savingSegmentId: T,
    segmentGroups: Ut,
    segments: kt,
    selectedSegment: ce,
    selectedSegmentIdRef: f,
    selectedSegments: ft,
    selectionAnchorIdRef: w,
    selectionRangeBaseIdsRef: R,
    setAutoAssignError: Se,
    setAutoAssignOpen: ze,
    setAutoAssigning: je,
    setEditorFilters: U,
    setExportingExamples: Tr,
    setHideDerivedSegments: $,
    setIncorrectExamples: mn,
    setMaterializeError: vt,
    setMaterializeLoading: we,
    setMaterializeOpen: et,
    setMaterializePreview: Rt,
    setMaterializing: xt,
    setRemovingExampleId: Rr,
    setRejectedDeletionPreview: yt,
    setSaveMessage: de,
    acquireSaveLock: H,
    setSelectedSegmentGroupKey: ke,
    setSelectedSegmentId: y,
    setSelectedSegmentIds: p,
    swimlanes: Ht,
    video: rt
  }), { restoreHistoryTarget: ds, updateTimelineRatio: Eo, handleSeparatorPointerDown: cs, handleSeparatorPointerMove: us, handleSeparatorKeyDown: ms, panelWidthMaximum: Do, panelSeparatorProps: gs, toggleSegmentRail: ps, toggleSegmentGroup: Oo, mutateShotBoundary: fs } = Tc({
    acceptHistory: Kr,
    compatibilityMode: l,
    currentTime: k,
    detail: e,
    editorLayout: I,
    focusRowRef: yn,
    history: D,
    historyRef: te,
    historySaving: N,
    horizontalLayoutSize: h,
    mediaStackHeight: C,
    mediaStackRef: fn,
    commonActionsRef: an,
    onDetailChange: t,
    onReload: o,
    railToggleRef: rr,
    recordHistoryAction: dr,
    savingSegmentId: T,
    setCollapsedSegmentGroups: V,
    setEditorLayout: ee,
    setHistorySaving: W,
    setIncorrectExamples: mn,
    setSaveMessage: de,
    acquireSaveLock: H,
    enqueueSave: J,
    getSaveQueueSnapshot: E,
    shotBoundaries: Ln,
    timelineDuration: lr,
    video: rt,
    workspaceRef: En
  }), { executeShortcutById: Po, stepVideoFrame: ys } = Rc({
    allSwimlanes: mt,
    applyShortcutTiming: Wi,
    centerTimelineRef: nr,
    compatibilityMode: l,
    createSegment: Io,
    currentTime: k,
    deleteRejectedSegments: Ao,
    duplicateSegment: $o,
    editorLayout: I,
    editorRef: It,
    emptyRecyclingBin: ls,
    lineage: Gr,
    mediaDuration: ko,
    mergeSelectedSwimlane: Mo,
    moveToBin: ss,
    mutateShotBoundary: fs,
    openPublishApprovedDialog: To,
    playbackControlsRef: An,
    playbackShortcutConfig: Fi,
    saveSelectedReviewState: Yi,
    seekRef: gn,
    segmentGroupKeys: Br,
    selectSegment: No,
    selectedSegment: ce,
    selectedSegmentGroupForSegment: Sn,
    selectedSegmentGroupKey: se,
    selectedSegments: ft,
    setCollapsedSegmentGroups: V,
    setIncorrectExamplesOpen: Ie,
    setQuickSearchOpen: Fe,
    setSaveMessage: de,
    setSelectedSegmentGroupKey: ke,
    setTagEditing: Q,
    setTimelineZoom: ye,
    shotBoundaries: Ln,
    slotButtonRef: zt,
    splitSegment: Co,
    swimlanes: Ht,
    timelineDuration: lr,
    toggleIncorrectExample: Xi,
    toggleSegmentGroup: Oo,
    updateTimelineRatio: Eo,
    videoFrameRate: Fn,
    visibleSegments: At
  });
  pn.current = Po;
  const bs = qe(() => Qn.map((P) => ({
    id: P.id,
    enabled: $n(P, l),
    surface: "local",
    action: (ie) => {
      var Ge;
      return (Ge = pn.current) == null ? void 0 : Ge.call(pn, P.id, ie);
    }
  })), [l]);
  Da(ao, bs);
  const hs = so(C), vs = sn(I.markerRailWidth, Do("markerRailWidth")), xs = sn(I.detailWidth, Do("detailWidth"));
  return n(Nc, {
    activeFilterCount: jr,
    allSwimlanes: mt,
    approvalFacetCounts: Pr,
    autoAssignCandidates: jn,
    autoAssignError: Xe,
    autoAssignOpen: Ee,
    autoAssignPerformers: ns,
    autoAssigning: Me,
    canMoveSelectionToBin: Yt,
    captureTrainingExport: ts,
    cancelQueuedReviewsForSegments: Qi,
    removeIncorrectExample: es,
    rejectedDeletionPreview: ot,
    centerTimelineRef: nr,
    closeEditorFilters: Gn,
    closeFirstSegmentTagDialog: Dr,
    closeMaterializeDialog: os,
    closeMergeConfirmation: Ji,
    closePublishApprovedDialog: Ro,
    closeTagEditing: Bn,
    collapsedSegmentGroups: ht,
    commonActionsRef: an,
    compatibilityMode: l,
    configuringTag: Vt,
    createSegment: Io,
    currentTime: k,
    deleteRejectedSegments: Ao,
    detail: e,
    detailPanelRef: g,
    detailWidth: xs,
    duplicateSegment: $o,
    editorFilters: B,
    editorLayout: I,
    editorRef: It,
    exportingExamples: er,
    filtersButtonRef: Dn,
    filtersOpen: q,
    firstSegmentTagOpen: gt,
    focusRowRef: yn,
    handleSeparatorKeyDown: ms,
    handleSeparatorPointerDown: cs,
    handleSeparatorPointerMove: us,
    hideDerivedSegments: M,
    history: D,
    historyOpen: j,
    historySaving: N,
    hasNextUnreviewed: Li,
    hasPreviousUnreviewed: Pi,
    horizontalLayoutSize: h,
    importNativeSegments: Pe,
    incorrectExamples: Xt,
    incorrectExamplesOpen: Ye,
    removingExampleId: tr,
    lineage: Gr,
    markerRailWidth: vs,
    materializeButtonRef: Mn,
    materializeCancelButtonRef: Xn,
    materializeDerivedSegments: as,
    materializeError: St,
    materializeLoading: st,
    materializeOpen: at,
    materializePreview: it,
    materializing: wt,
    mediaStackRef: fn,
    mergeCancelButtonRef: Qe,
    mergeConfirmation: Te,
    mergeSaving: Rd(L, "merge"),
    mergeSelectedSwimlane: Mo,
    nativeImportState: De,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: To,
    onReload: o,
    onSlotsChanged: a,
    panelSeparatorProps: gs,
    pendingInitialSeekRef: Mr,
    performerSlots: Mt,
    performerSlotsAvailable: ir,
    playbackControlsRef: An,
    previewDerivedSegments: rs,
    provenance: Bi,
    provenanceSources: Lr,
    publishApprovedCancelButtonRef: Ve,
    publishApprovedDrafts: Vi,
    publishApprovedError: Be,
    publishApprovedOpen: bt,
    quickSearchOpen: Ze,
    railScrollRef: hn,
    railToggleRef: rr,
    recordHistoryAction: dr,
    restoreHistoryTarget: ds,
    runEditorAction: Po,
    stepVideoFrame: ys,
    saveMessage: X,
    setSaveMessage: de,
    saveTag: is,
    saveTiming: qi,
    savingSegmentId: T,
    acquireSaveLock: H,
    seekRef: gn,
    segmentGroups: Ut,
    segmentRailLayout: zn,
    segments: Nt,
    selectAllVideoSegments: zi,
    selectSegment: No,
    selectSegmentCollection: Ki,
    selectedGroups: So,
    selectedPerformerSlots: xo,
    selectedSegment: G,
    selectedSegmentGroupKey: se,
    selectedSegmentIds: b,
    selectedSegments: ft,
    selectedSlotStatus: Di,
    setAutoAssignError: Se,
    setAutoAssignOpen: ze,
    setConfiguringTag: Kt,
    setCurrentTime: S,
    setEditorFilters: U,
    setEditorLayout: ee,
    setFiltersOpen: F,
    setHideDerivedSegments: $,
    setHistoryOpen: re,
    setIncorrectExamplesOpen: Ie,
    setQuickSearchOpen: Fe,
    setRejectedDeletionPreview: yt,
    setRailViewport: vn,
    setSelectedSegmentGroupKey: ke,
    setSelectedSegmentId: y,
    setShortcutsOpen: ve,
    setTimelineZoom: ye,
    shotBoundaries: Ln,
    shortcutsOpen: Re,
    slotButtonRef: zt,
    splitLayout: i,
    splitSegment: Co,
    tagEditing: O,
    creatingSegmentId: ge,
    tagSearchRef: or,
    timelineDuration: lr,
    timelineRatioBounds: hs,
    timelineZoom: Y,
    toggleSegmentGroup: Oo,
    toggleSegmentRail: ps,
    updateTimelineRatio: Eo,
    video: rt,
    videoPerformers: Jt,
    visibleCounts: Kn,
    visibleSegmentRailRows: Oi,
    visibleSegments: At,
    wideLayout: on,
    workspaceRef: En
  });
}
function Dc(e = [], t = []) {
  const r = new Map((t || []).map((s) => [
    Number(s.tagId),
    {
      ...s,
      tagId: Number(s.tagId),
      definitions: [...s.definitions || []].sort((l, d) => (l.sortOrder ?? 0) - (d.sortOrder ?? 0) || String(l.id).localeCompare(String(d.id)))
    }
  ])), o = /* @__PURE__ */ new Set(), a = [...e || []].sort((s, l) => (s.sortOrder ?? 0) - (l.sortOrder ?? 0) || Number(s.id) - Number(l.id)).map((s) => ({
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
  })), i = [...r.values()].filter((s) => !o.has(s.tagId) && s.definitions.length > 0).map((s) => ({
    tagId: s.tagId,
    tagName: s.tagName || `Tag ${s.tagId}`,
    sortOrder: 0,
    allowSamePerformerInMultipleSlots: !!s.allowSamePerformerInMultipleSlots,
    definitions: s.definitions
  })).sort((s, l) => String(s.tagName).localeCompare(String(l.tagName), void 0, {
    numeric: !0,
    sensitivity: "base"
  }) || s.tagId - l.tagId);
  return i.length > 0 && a.push({
    id: "ungrouped",
    overviewKey: "ungrouped",
    name: "Ungrouped",
    sortOrder: a.length,
    synthetic: !0,
    tags: i
  }), a;
}
function Oc(e = [], t = "", r = "all") {
  const o = String(t || "").trim().toLocaleLowerCase();
  return e.map((a) => ({
    ...a,
    tags: (a.tags || []).filter((i) => {
      const s = (i.definitions || []).length > 0;
      return r === "with" && !s || r === "without" && s ? !1 : o ? [
        i.tagName,
        ...(i.definitions || []).map((l) => l.label)
      ].some((l) => String(l || "").toLocaleLowerCase().includes(o)) : !0;
    })
  })).filter((a) => a.tags.length > 0);
}
function Ct(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function Pc(e = [], t = []) {
  var b;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((p, f) => (p.sortOrder ?? 0) - (f.sortOrder ?? 0) || Number(p.id) - Number(f.id)).forEach((p, f) => {
    [...p.tags || []].sort((w, R) => (w.sortOrder ?? 0) - (R.sortOrder ?? 0) || Number(w.tagId) - Number(R.tagId)).forEach((w, R) => r.set(Number(w.tagId), {
      key: `group:${p.id}`,
      id: p.id,
      name: p.name,
      sortOrder: p.sortOrder ?? f,
      tagSortOrder: w.sortOrder ?? R
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function a(p, f) {
    const w = Number(p);
    if (!o.has(w)) {
      const R = r.get(w);
      o.set(w, {
        tagId: w,
        name: f || `Tag ${w}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (R == null ? void 0 : R.key) || "ungrouped",
        segmentGroupId: (R == null ? void 0 : R.id) ?? null,
        segmentGroupName: (R == null ? void 0 : R.name) || "Ungrouped",
        segmentGroupSortOrder: (R == null ? void 0 : R.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (R == null ? void 0 : R.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(w);
  }
  const i = /* @__PURE__ */ new Map();
  e.forEach((p) => {
    const f = a(p.sourceTagId, p.sourceTagName), w = a(p.derivedTagId, p.derivedTagName);
    f.outgoingRuleCount++, w.incomingRuleCount++;
    const R = `${f.tagId}:${w.tagId}`;
    i.has(R) || i.set(R, {
      id: R,
      sourceTagId: f.tagId,
      derivedTagId: w.tagId,
      rules: [],
      edgeCount: 0
    });
    const g = i.get(R);
    g.rules.push(p), g.edgeCount += Number(p.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...i.values()], d = new Map(s.map((p) => [p.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((p) => {
    var f, w;
    (f = d.get(p.sourceTagId)) == null || f.add(p.derivedTagId), (w = d.get(p.derivedTagId)) == null || w.add(p.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), m = [];
  for (const p of s) {
    if (c.has(p.tagId)) continue;
    const f = [p.tagId], w = [];
    for (c.add(p.tagId); f.length > 0; ) {
      const M = f.shift();
      w.push(M);
      for (const $ of d.get(M) || [])
        c.has($) || (c.add($), f.push($));
    }
    const R = new Set(w), g = w.map((M) => o.get(M)), B = l.filter((M) => R.has(M.sourceTagId) && R.has(M.derivedTagId)), U = B.flatMap((M) => M.rules), q = g.filter((M) => M.outgoingRuleCount === 0).sort((M, $) => Ct(M.name, $.name)), F = q.length > 0 ? q : [...g].sort((M, $) => Ct(M.name, $.name));
    m.push({
      id: [...w].sort((M, $) => M - $).join(":"),
      label: F.length > 1 ? `${F[0].name} + ${F.length - 1}` : ((b = F[0]) == null ? void 0 : b.name) || "Derivation component",
      nodes: g,
      connections: B,
      rules: U,
      segmentGroupKeys: [...new Set(g.map((M) => M.segmentGroupKey))],
      materializedEdgeCount: U.reduce(
        (M, $) => M + (Number($.edgeCount) || 0),
        0
      )
    });
  }
  m.sort((p, f) => f.rules.length - p.rules.length || Ct(p.label, f.label));
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
    p.nodes.forEach((f) => {
      var w;
      return (w = u.get(f.segmentGroupKey)) == null ? void 0 : w.componentIds.add(p.id);
    }), p.rules.forEach((f) => {
      var w, R;
      (w = u.get(o.get(Number(f.sourceTagId)).segmentGroupKey)) == null || w.ruleIds.add(f.id), (R = u.get(o.get(Number(f.derivedTagId)).segmentGroupKey)) == null || R.ruleIds.add(f.id);
    });
  });
  const y = [...u.values()].sort((p, f) => p.sortOrder - f.sortOrder || Ct(p.name, f.name)).map((p) => ({
    ...p,
    ruleCount: p.ruleIds.size,
    componentCount: p.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: m,
    segmentGroups: y
  };
}
function Lc(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const m = new Map(e.nodes.map((k) => [k.tagId, /* @__PURE__ */ new Set()])), u = new Map(e.nodes.map((k) => [k.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((k) => {
    var S, A;
    (S = m.get(k.sourceTagId)) == null || S.add(k.derivedTagId), (A = u.get(k.derivedTagId)) == null || A.add(k.sourceTagId);
  });
  const y = new Map(e.nodes.map((k) => {
    var S;
    return [
      k.tagId,
      ((S = u.get(k.tagId)) == null ? void 0 : S.size) || 0
    ];
  })), b = new Map(e.nodes.map((k) => [k.tagId, 0])), p = e.nodes.filter((k) => y.get(k.tagId) === 0).sort((k, S) => Ct(k.name, S.name)).map((k) => k.tagId), f = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const k = p.shift();
    if (!f.has(k)) {
      f.add(k);
      for (const S of m.get(k) || [])
        b.set(S, Math.max(b.get(S) || 0, (b.get(k) || 0) + 1)), y.set(S, y.get(S) - 1), y.get(S) === 0 && p.push(S);
    }
  }
  f.size !== e.nodes.length && e.nodes.filter((k) => !f.has(k.tagId)).sort((k, S) => Ct(k.name, S.name)).forEach((k) => b.set(k.tagId, 0));
  const w = Math.max(0, ...b.values()), R = Math.max(
    t,
    240 + w * 296
  ), g = /* @__PURE__ */ new Map();
  e.nodes.forEach((k) => {
    g.has(k.segmentGroupKey) || g.set(k.segmentGroupKey, {
      key: k.segmentGroupKey,
      id: k.segmentGroupId,
      name: k.segmentGroupName,
      sortOrder: k.segmentGroupSortOrder,
      nodes: []
    }), g.get(k.segmentGroupKey).nodes.push(k);
  });
  const B = [...g.values()].sort((k, S) => k.sortOrder - S.sortOrder || Ct(k.name, S.name));
  let U = 28;
  const q = [], F = B.map((k) => {
    const S = /* @__PURE__ */ new Map();
    k.nodes.forEach((H) => {
      const J = b.get(H.tagId) || 0;
      S.has(J) || S.set(J, []), S.get(J).push(H);
    });
    for (const H of S.values())
      H.sort((J, _) => J.segmentGroupTagSortOrder - _.segmentGroupTagSortOrder || Ct(J.name, _.name));
    const A = Math.max(1, ...[...S.values()].map((H) => H.length)), K = A * 58 + (A - 1) * 18, L = 70 + K, T = {
      ...k,
      x: 12,
      y: U,
      width: R - 24,
      height: L
    };
    for (const [H, J] of S.entries()) {
      const _ = J.length * 58 + Math.max(0, J.length - 1) * 18, oe = (K - _) / 2;
      J.forEach((ue, be) => q.push({
        ...ue,
        rank: H,
        x: 28 + H * 296,
        y: U + 34 + 18 + oe + be * 76,
        width: 184,
        height: 58
      }));
    }
    return U += L + 16, T;
  }), M = new Map(q.map((k) => [k.tagId, k])), $ = e.connections.map((k) => {
    const S = M.get(k.sourceTagId), A = M.get(k.derivedTagId), K = S.x + S.width, L = S.y + S.height / 2, T = A.x, H = A.y + A.height / 2, J = Math.max(48, (T - K) * 0.48);
    return {
      ...k,
      path: `M ${K} ${L} C ${K + J} ${L}, ${T - J} ${H}, ${T} ${H}`
    };
  });
  return {
    width: R,
    height: Math.max(r, U - 16 + 28),
    nodes: q,
    connections: $,
    groups: F
  };
}
function jc(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, a = 0;
  const i = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Lc(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), m = 20, u = o, y = c.nodes.map((p) => ({
      ...p,
      x: p.x + m,
      y: p.y + u
    })), b = new Map(y.map((p) => [p.tagId, p]));
    i.push(...y), l.push(...c.groups.map((p) => ({
      ...p,
      componentId: d.id,
      x: p.x + m,
      y: p.y + u
    }))), s.push(...c.connections.map((p) => {
      const f = b.get(p.sourceTagId), w = b.get(p.derivedTagId), R = f.x + f.width, g = f.y + f.height / 2, B = w.x, U = w.y + w.height / 2, q = Math.max(48, (B - R) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${R} ${g} C ${R + q} ${g}, ${B - q} ${U}, ${B} ${U}`
      };
    })), a = Math.max(a, c.width), o += c.height + 32;
  }), {
    width: Math.max(720, a + 40),
    height: Math.max(420, o - 32 + 20),
    nodes: i,
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
  const a = t.filter((d) => d.id !== e.ruleId);
  if (a.some((d) => Number(d.sourceTagId) === r && Number(d.derivedTagId) === o))
    return {
      code: "LINEAGE_RULE_DUPLICATE",
      message: "A rule already maps this source tag to this derived tag."
    };
  const i = /* @__PURE__ */ new Map();
  a.forEach((d) => {
    const c = Number(d.sourceTagId);
    i.has(c) || i.set(c, /* @__PURE__ */ new Set()), i.get(c).add(Number(d.derivedTagId));
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
      for (const c of i.get(d) || []) s.push(c);
    }
  }
  return null;
}
function Fc(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function Bc(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: a, deleteRule: i, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: m, editorRef: u, emptyDraft: y, graph: b, layout: p, listSort: f, materializationOffer: w, materializeOutgoingRules: R, materializeRule: g, message: B, normalizedQuery: U, query: q, refreshConfiguredTag: F, revealEditor: M, rules: $, save: k, segmentGroupKey: S, selectedNode: A, selectedRule: K, selection: L, setConfiguringTag: T, setDraft: H, setListSort: J, setMaterializationOffer: _, setQuery: oe, setSegmentGroupKey: ue, setSelection: be, setView: E, sortedVisibleRules: ae, sourceSlots: le, sourceSlotsLoading: X, updateMapping: de, updateTag: xe, view: Ce, visibleComponents: Oe, visibleRules: fe } = e;
  function Y(v) {
    const h = b.nodes.find((D) => D.tagId === Number(v.sourceTagId)), x = b.nodes.find((D) => D.tagId === Number(v.derivedTagId));
    return (h == null ? void 0 : h.segmentGroupKey) === (x == null ? void 0 : x.segmentGroupKey) ? h.segmentGroupKey : "cross-group";
  }
  function ye() {
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
              onChange: (v, h) => xe("source", v, h == null ? void 0 : h.label),
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
              onClick: (v) => T({
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
              onChange: (v, h) => xe("derived", v, h == null ? void 0 : h.label),
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
              onClick: (v) => T({
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
          ...d.slotMappings.map((v, h) => n("div", { key: h, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: v.sourceSlotDefinitionId,
              disabled: r,
              onChange: (x) => de(h, "sourceSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${h + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...le.map((x) => n("option", { key: x.id, value: x.id }, Tt(x)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: v.derivedSlotDefinitionId,
              disabled: r,
              onChange: (x) => de(h, "derivedSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${h + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((x) => n("option", { key: x.id, value: x.id }, Tt(x)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => H((x) => ({
                ...x,
                slotMappings: x.slotMappings.filter((D, ne) => ne !== h)
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
          onClick: k,
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
            onClick: () => g(te),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => m(te, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => i(te),
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
          onClick: (te) => T({
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
          onClick: () => R(A, D),
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
    if (!K)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const v = b.nodes.find((x) => x.tagId === Number(K.sourceTagId)), h = b.nodes.find((x) => x.tagId === Number(K.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (v == null ? void 0 : v.segmentGroupName) || "Ungrouped"),
          (v == null ? void 0 : v.segmentGroupKey) !== (h == null ? void 0 : h.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(h == null ? void 0 : h.segmentGroupName) || "Ungrouped"}`) : null
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
      (w == null ? void 0 : w.ruleId) === K.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => g(K, w),
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
        K.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : K.slotMappings.map((x, D) => n("div", {
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
          onClick: () => g(K),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => m(K),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => i(K),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function ee() {
    if (Oe.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, U ? "No derivation relationships match your search." : "No derivation rules.");
    const v = A == null ? void 0 : A.tagId, h = /* @__PURE__ */ new Set();
    return A && (h.add(A.tagId), p.connections.forEach((x) => {
      (x.sourceTagId === A.tagId || x.derivedTagId === A.tagId) && (h.add(x.sourceTagId), h.add(x.derivedTagId));
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
          className: `absolute rounded-xl border ${S === x.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
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
        ...p.nodes.map((x) => {
          const D = !U || x.name.toLocaleLowerCase().includes(U), ne = A != null, te = h.has(x.tagId), j = (A == null ? void 0 : A.tagId) === x.tagId;
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
        ...p.connections.filter((x) => x.rules.length > 1).map((x) => {
          const D = p.nodes.find((te) => te.tagId === x.sourceTagId), ne = p.nodes.find((te) => te.tagId === x.derivedTagId);
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
  function C() {
    if (Oe.length === 0)
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
    const h = [
      ...b.segmentGroups.map((x) => x.key),
      "cross-group"
    ].filter((x) => v.has(x));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, h.map((x) => {
      const D = b.segmentGroups.find((j) => j.key === x), ne = x === "cross-group" ? "Cross-group relationships" : (D == null ? void 0 : D.name) || "Ungrouped", te = v.get(x);
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
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(K == null ? void 0 : K.id) === j.id ? "bg-accent/10" : ""}`,
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
          `${$.length} rules · ${b.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          H(y()), be(null), M();
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
          value: S,
          disabled: d != null,
          onChange: (v) => {
            ue(v.target.value), be(null), H(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...b.segmentGroups.map((v) => n("option", { key: v.key, value: v.key }, v.name))
        ])
      ]),
      Ce === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: f,
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
        ].map(([v, h]) => n("button", {
          key: v,
          type: "button",
          onClick: () => {
            E(v), v === "graph" && (L == null ? void 0 : L.type) === "rule" && be(null);
          },
          "aria-pressed": Ce === v,
          className: `rounded px-3 py-1.5 text-sm font-medium ${Ce === v ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
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
        Ce === "graph" ? ee() : C()
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
    a ? n(vo, {
      key: `derivation-configure-tag:${a.tagId}`,
      tagId: a.tagId,
      tagName: a.tagName,
      onSaved: () => F(a),
      onClose: () => {
        const v = a.trigger;
        T(null), requestAnimationFrame(() => {
          v != null && v.isConnected && v.focus();
        });
      }
    }) : null
  ]);
}
function Gc({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, a] = z([]), [i, s] = z(null), [l, d] = z([]), [c, m] = z([]), [u, y] = z(!1), [b, p] = z(!1), [f, w] = z(!1), [R, g] = z(""), [B, U] = z(""), [q, F] = z("graph"), [M, $] = z("all"), [k, S] = z(null), [A, K] = z("relationship"), [L, T] = z(null), [H, J] = z(null), _ = me(null), oe = me(null), ue = ai().replace(/:/g, "");
  function be() {
    requestAnimationFrame(() => {
      var N;
      return (N = _.current) == null ? void 0 : N.scrollIntoView({ block: "nearest" });
    });
  }
  async function E(N) {
    const W = await Z("/derivation-rules", N ? { signal: N } : void 0);
    a(W || []);
  }
  pe(() => {
    const N = new AbortController();
    return E(N.signal).catch((W) => {
      W.name !== "AbortError" && g(W.message || "Unable to load derived segment rules.");
    }), () => N.abort();
  }, []), pe(() => {
    const N = new AbortController();
    return i != null && i.sourceTagId ? (y(!0), Z(`/slot-definitions/${i.sourceTagId}`, { signal: N.signal }).then((W) => d(W.definitions || [])).catch((W) => {
      W.name !== "AbortError" && d([]);
    }).finally(() => {
      N.signal.aborted || y(!1);
    })) : (d([]), y(!1)), i != null && i.derivedTagId ? (p(!0), Z(`/slot-definitions/${i.derivedTagId}`, { signal: N.signal }).then((W) => m(W.definitions || [])).catch((W) => {
      W.name !== "AbortError" && m([]);
    }).finally(() => {
      N.signal.aborted || p(!1);
    })) : (m([]), p(!1)), () => N.abort();
  }, [i == null ? void 0 : i.sourceTagId, i == null ? void 0 : i.derivedTagId]), pe(() => {
    if (!(i != null && i.sourceTagId) || !(i != null && i.derivedTagId) || i.ruleId != null || u || b)
      return;
    const N = `${i.sourceTagId}:${i.derivedTagId}`;
    oe.current !== N && (oe.current = N, s((W) => !W || Number(W.sourceTagId) !== Number(i.sourceTagId) || Number(W.derivedTagId) !== Number(i.derivedTagId) ? W : sd(W, l, c)));
  }, [
    i == null ? void 0 : i.ruleId,
    i == null ? void 0 : i.sourceTagId,
    i == null ? void 0 : i.derivedTagId,
    l,
    c,
    u,
    b
  ]);
  function ae(N, W = !1) {
    W || S({ type: "rule", id: N.id }), oe.current = null, s({
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
    }), g(""), be();
  }
  function le(N, W, O = "") {
    oe.current = null, N === "source" ? (d([]), y(W != null)) : (m([]), p(W != null)), s((Q) => ({
      ...Q,
      [`${N}TagId`]: W == null ? null : Number(W),
      [`${N}TagName`]: O || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function X(N) {
    (i == null ? void 0 : i.ruleId) == null && (oe.current = null);
    const W = [E(), t == null ? void 0 : t()];
    return N.draftKind === "source" ? (y(!0), W.push(Z(`/slot-definitions/${N.tagId}`).then((O) => d(O.definitions || [])).finally(() => y(!1)))) : N.draftKind === "derived" && (p(!0), W.push(Z(`/slot-definitions/${N.tagId}`).then((O) => m(O.definitions || [])).finally(() => p(!1)))), Promise.all(W);
  }
  function de(N, W, O) {
    s((Q) => ({
      ...Q,
      slotMappings: Q.slotMappings.map((he, ge) => ge === N ? { ...he, [W]: O } : he)
    }));
  }
  async function xe() {
    if (!(i != null && i.sourceTagId) || !(i != null && i.derivedTagId)) return;
    const N = Ca(i, o);
    if (N) {
      g(N.message);
      return;
    }
    if (i.slotMappings.some((W) => !W.sourceSlotDefinitionId || !W.derivedSlotDefinitionId)) {
      g("Complete or remove every performer slot mapping before saving.");
      return;
    }
    w(!0), g(i.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let W = null;
      if (i.ruleId != null) {
        const Q = await Z(
          `/derivation-rules/${i.ruleId}/deletion/preview`,
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
      g("Saving derived segment rule…");
      const O = await Z("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: i.ruleId,
          sourceTagId: i.sourceTagId,
          derivedTagId: i.derivedTagId,
          slotMappings: i.slotMappings,
          cleanupFingerprint: W
        })
      });
      if (await E(), S(q === "graph" ? { type: "node", id: Number(O.sourceTagId) } : { type: "rule", id: O.id }), s(null), i.ruleId == null)
        try {
          const Q = await Z(
            `/derivation-rules/${O.id}/materialization/preview`,
            { method: "POST" }
          );
          T(
            Q.createCount + Q.linkCount > 0 ? Q : null
          ), g(Q.createCount + Q.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          T(null), g("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        T(null), g("Derived segment rule saved. Previous materializations were removed.");
    } catch (W) {
      g(W.message || "Unable to save derived segment rule.");
    } finally {
      w(!1);
    }
  }
  async function Ce(N) {
    w(!0), g("Previewing rule deletion…");
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
          operationId: Ue(O),
          fingerprint: W.fingerprint
        })
      }), He(O), await E(), (i == null ? void 0 : i.ruleId) === N.id && s(null), (k == null ? void 0 : k.type) === "rule" && k.id === N.id && S(null), (L == null ? void 0 : L.ruleId) === N.id && T(null), g(`Rule deleted with ${W.deletedSegmentCount} exclusively derived segment${W.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (W) {
      g(W.message || "Unable to delete derived segment rule.");
    } finally {
      w(!1);
    }
  }
  async function Oe(N, W = null) {
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
        operationId: Ue(Q),
        fingerprint: O.fingerprint
      })
    });
    return He(Q), he;
  }
  async function fe(N, W = null) {
    w(!0), g("Finding pending derivations…");
    try {
      const O = await Oe(N, W);
      if (T(null), await E(), O.createdCount + O.linkedCount === 0) {
        g("Every applicable derivation is already materialized.");
        return;
      }
      g(
        `${O.createdCount} derived segment${O.createdCount === 1 ? "" : "s"} created and ${O.linkedCount} existing segment${O.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (O) {
      g(O.message || "Unable to materialize pending derivations.");
    } finally {
      w(!1);
    }
  }
  async function Y(N, W) {
    if (W.length === 0) return;
    w(!0), g(`Finding pending derivations from ${N.name}…`);
    let O = 0, Q = 0;
    try {
      for (const he of W) {
        const ge = await Oe(he);
        O += ge.createdCount, Q += ge.linkedCount;
      }
      T(null), await E(), g(O + Q === 0 ? `Every outgoing derivation from ${N.name} is already materialized.` : `${O} derived segment${O === 1 ? "" : "s"} created and ${Q} existing segment${Q === 1 ? "" : "s"} linked from ${N.name}.`);
    } catch (he) {
      await E().catch(() => {
      }), g(he.message || `Unable to materialize derivations from ${N.name}.`);
    } finally {
      w(!1);
    }
  }
  const ye = Ca(i, o), I = qe(
    () => Pc(o, e),
    [o, e]
  ), ee = B.trim().toLocaleLowerCase(), v = I.components.filter((N) => M === "all" || N.segmentGroupKeys.includes(M)).filter((N) => !ee || N.nodes.some((W) => W.name.toLocaleLowerCase().includes(ee))), h = v.flatMap((N) => N.rules), x = new Set(
    v.flatMap((N) => N.nodes.map((W) => W.tagId))
  ), D = qe(
    () => jc(v),
    [v]
  ), ne = q === "list" ? Fc(
    k,
    h,
    ee.length > 0
  ) : null, te = (k == null ? void 0 : k.type) === "node" && I.nodes.find((N) => N.tagId === k.id && x.has(N.tagId)) || null, j = [...h].sort((N, W) => A === "source" ? Ct(N.sourceTagName, W.sourceTagName) || Ct(N.derivedTagName, W.derivedTagName) : A === "target" ? Ct(N.derivedTagName, W.derivedTagName) || Ct(N.sourceTagName, W.sourceTagName) : A === "materialized" ? (Number(W.edgeCount) || 0) - (Number(N.edgeCount) || 0) || Ct(N.sourceTagName, W.sourceTagName) : Ct(
    `${N.sourceTagName} ${N.derivedTagName}`,
    `${W.sourceTagName} ${W.derivedTagName}`
  ));
  return n(Bc, {
    arrowMarkerId: ue,
    busy: f,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: H,
    deleteRule: Ce,
    derivedSlots: c,
    derivedSlotsLoading: b,
    draft: i,
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
    message: R,
    normalizedQuery: ee,
    query: B,
    refreshConfiguredTag: X,
    revealEditor: be,
    rules: o,
    save: xe,
    segmentGroupKey: M,
    selectedNode: te,
    selectedRule: ne,
    selection: k,
    setConfiguringTag: J,
    setDraft: s,
    setListSort: K,
    setMaterializationOffer: T,
    setQuery: U,
    setSegmentGroupKey: $,
    setSelection: S,
    setView: F,
    sortedVisibleRules: j,
    sourceSlots: l,
    sourceSlotsLoading: u,
    updateMapping: de,
    updateTag: le,
    view: q,
    visibleComponents: v,
    visibleRules: h
  });
}
function Kc() {
  const [e, t] = z(Xa), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(i, s) {
    t((l) => na({ ...l, [i]: s }));
  }
  function a() {
    t(na(io));
  }
  return n("section", { className: "space-y-3 rounded-lg border border-border bg-surface p-4", "aria-labelledby": "segment-studio-playback-shortcuts-title" }, [
    n("div", { key: "heading", className: "flex flex-wrap items-start justify-between gap-3" }, [
      n("div", { key: "copy" }, [
        n("h2", { key: "title", id: "segment-studio-playback-shortcuts-title", className: "font-semibold text-foreground" }, "Playback shortcuts"),
        n("p", { key: "description", className: "mt-1 text-xs text-secondary" }, "Configure seek intervals and frame-step sizes used by the keyboard-first editor. These settings are stored in this browser.")
      ]),
      n("button", { key: "reset", type: "button", onClick: a, className: "rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted/40" }, "Reset defaults")
    ]),
    n("div", { key: "fields", className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, r.map(([i, s, l, d, c]) => n("label", { key: i, className: "space-y-1 text-xs text-secondary" }, [
      n("span", { key: "label" }, s),
      n("input", {
        key: "input",
        type: "number",
        min: l,
        max: d,
        step: c,
        value: e[i],
        onChange: (m) => o(i, m.target.value),
        className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
      })
    ])))
  ]);
}
function zc({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, a] = z([]), [i, s] = z(!1), [l, d] = z(!1), [c, m] = z(""), [u, y] = z(""), [b, p] = z("all"), [f, w] = z(() => /* @__PURE__ */ new Set()), [R, g] = z(null);
  pe(() => {
    if (!e || i) return;
    const T = new AbortController();
    return d(!0), m(""), Z("/slot-definitions", { signal: T.signal }).then((H) => {
      a(H || []), s(!0);
    }).catch((H) => {
      H.name !== "AbortError" && m(H.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      T.signal.aborted || d(!1);
    }), () => T.abort();
  }, [e, i]);
  async function B() {
    d(!0), m("");
    try {
      const T = await Z("/slot-definitions");
      a(T || []), s(!0);
    } catch (T) {
      m(T.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function U() {
    const [T] = await Promise.all([
      Z("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    a(T || []), s(!0), m("");
  }
  function q() {
    const T = R == null ? void 0 : R.trigger;
    g(null), requestAnimationFrame(() => {
      T != null && T.isConnected && T.focus({ preventScroll: !0 });
    });
  }
  function F(T) {
    w((H) => {
      const J = new Set(H);
      return J.has(T) ? J.delete(T) : J.add(T), J;
    });
  }
  const M = qe(
    () => Dc(t, o),
    [t, o]
  ), $ = qe(
    () => Oc(M, u, b),
    [M, u, b]
  ), k = M.flatMap((T) => T.tags), S = k.filter((T) => T.definitions.length > 0).length, A = k.length - S, K = [
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
      i ? n(
        "p",
        { key: "summary", className: "mt-2 text-xs text-secondary" },
        `${k.length} tags · ${S} with slots · ${A} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: u,
          onChange: (T) => y(T.target.value),
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
          K.map(([T, H]) => n("button", {
            key: T,
            type: "button",
            onClick: () => p(T),
            "aria-pressed": b === T,
            className: `rounded px-3 py-1.5 text-xs font-medium ${b === T ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, H))
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
          onClick: () => w(new Set(M.map((T) => T.overviewKey))),
          className: L
        }, "Collapse all")
      ])
    ]),
    l && !i ? n(
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
    i && $.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    i ? n("div", { key: "groups", className: "space-y-3" }, $.map((T) => {
      const H = f.has(T.overviewKey), J = T.tags.filter((_) => _.definitions.length > 0).length;
      return n("article", {
        key: T.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => F(T.overviewKey),
          "aria-expanded": !H,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, H ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, T.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${T.tags.length} tag${T.tags.length === 1 ? "" : "s"} · ${J} with slots`
          )
        ]),
        H ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          T.tags.map((_) => n("li", {
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
              n("span", { key: "label", className: "font-medium text-foreground" }, Tt(oe)),
              ...(oe.genderHints || []).map((ue) => n("span", {
                key: ue,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, Ir(ue)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (oe) => g({
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
    R ? n(vo, {
      key: `performer-slots-configure:${R.tagId}`,
      tagId: R.tagId,
      tagName: R.tagName,
      onSaved: U,
      onClose: q
    }) : null
  ]);
}
function Uc({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, a] = z("general"), [i, s] = z([]), [l, d] = z(!1), [c, m] = z(""), [u, y] = z(qa), b = Nl(t), p = b.map(([g]) => g);
  pe(() => {
    p.includes(o) || a(p[0] || "general");
  }, [t.effectiveMode]);
  async function f(g) {
    const B = await Z("/segment-groups", g ? { signal: g } : void 0);
    s(B || []);
  }
  pe(() => {
    const g = new AbortController();
    return f(g.signal).catch((B) => {
      B.name !== "AbortError" && m(B.message || "Unable to load tag groups.");
    }), () => g.abort();
  }, []);
  async function w(g) {
    if (g !== t.requestedMode) {
      d(!0), m("");
      try {
        const B = await Z(
          `/preferences/transition?mode=${encodeURIComponent(g)}`
        );
        let U = !1, q = null, F = null, M = null, $ = !1;
        if (t.requestedMode === "basic" && g === "full") {
          if (!window.confirm($l(
            B.recyclingBinCount,
            B.protectedRecyclingBinCount
          )))
            return;
          $ = !0, B.recyclingBinCount > 0 && (U = !0, M = B.recyclingBinFingerprint, q = `mode-switch-empty-bin:${M}`, F = Ue(q));
        }
        let k = !1;
        if (t.requestedMode === "full" && g === "basic") {
          if (!window.confirm(Cl(
            B.extensionOwnedSegmentCount
          )))
            return;
          k = !0;
        }
        const S = await Z("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: g,
            confirmHiddenExtensionOwnedSegments: k,
            confirmBasicHistoryCleanup: $,
            emptyRecyclingBin: U,
            operationId: F,
            expectedRecyclingBinFingerprint: M
          })
        });
        q && He(q), r == null || r(ei(S)), m("Workflow mode saved.");
      } catch (B) {
        m(B.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  const R = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (g) => $i(g, e, R), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      b.map(([g, B]) => n("button", {
        key: g,
        type: "button",
        onClick: () => a(g),
        "aria-current": o === g ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === g ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, B))
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
      n(ic, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: w,
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
          checked: u,
          onChange: (g) => {
            const B = g.target.checked;
            Wa(B), y(B);
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
    p.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(Gc, {
        segmentGroups: i,
        onSegmentGroupsChanged: () => f()
      })
    ) : null,
    p.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(zc, {
        active: o === "performer-slots",
        segmentGroups: i,
        onSegmentGroupsChanged: () => f()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function $a({ facets: e, values: t, disabled: r, onChange: o }) {
  var a;
  return r ? n(
    "p",
    { className: "rounded-md border border-dashed border-border p-3 text-xs text-secondary" },
    "Performer slot filters are unavailable for your current access. Browse and playback remain available."
  ) : (a = e == null ? void 0 : e.slots) != null && a.length ? n("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, e.slots.map((i) => n("label", { key: i.id, className: "space-y-1 text-xs text-secondary" }, [
    n("span", { key: "label" }, Tt(i)),
    n("select", {
      key: "select",
      value: t[i.id] || "",
      onChange: (s) => o(i.id, s.target.value),
      className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
    }, [
      n("option", { key: "all", value: "" }, "Any assigned performer"),
      ...(i.performers || []).map((s) => n("option", { key: s.id, value: s.id }, `${s.name} (${s.assignmentCount})`))
    ])
  ]))) : null;
}
function Hc({ item: e, selected: t, busy: r, onSelect: o, onRestore: a, onPurge: i }) {
  var m, u;
  const s = [...e.slots || []].sort((y, b) => y.sortOrder - b.sortOrder || String(y.slotDefinitionId).localeCompare(String(b.slotDefinitionId))), l = [...new Map(s.map((y) => [
    y.performerId,
    { id: y.performerId, name: y.performerName }
  ])).values()], d = s.map((y) => ({
    slotDefinitionId: y.slotDefinitionId,
    label: Tt(y),
    performer: { id: y.performerId, name: y.performerName }
  })), c = ni(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: ui(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((m = e.activity) == null ? void 0 : m.name) || "segment"}, ${e.reviewState}, ${Ae(e.startSec)} to ${e.endSec == null ? "end of video" : Ae(e.endSec)}` }, [
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
          n(cn, { key: "state", state: e.reviewState, includeLabel: !1 }),
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
        n("button", { key: "restore", type: "button", disabled: r, onClick: () => a(e), className: "text-xs font-semibold text-accent hover:underline disabled:opacity-50" }, "Restore"),
        n("button", { key: "purge", type: "button", disabled: r, onClick: () => i(e), className: "text-xs font-semibold text-red-400 hover:underline disabled:opacity-50" }, "Delete permanently")
      ] : n("a", {
        href: c,
        className: "text-xs font-semibold text-accent hover:underline"
      }, "Edit segment")
    )
  ]);
}
function _c({ item: e, index: t, count: r, onPrevious: o, onNext: a, onClose: i, onNavigate: s }) {
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
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: a, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: i, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: ni(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Ta({ onNavigate: e, profile: t }) {
  const r = qe(() => {
    const E = Oa("ext:com.midnightrider.segment-studio:segments");
    return E ? {
      ..._r,
      defaultFilter: { ..._r.defaultFilter, ...E.findFilter || {} },
      defaultObjectFilter: E.objectFilter || {}
    } : _r;
  }, []), { filter: o, objectFilter: a, setFilter: i, setObjectFilter: s } = Pa(r), [l, d] = z(null), [c, m] = z({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [u, y] = z(null), [b, p] = z(null), [f, w] = z(0), [R, g] = z(""), [B, U] = z(!0), [q, F] = z(""), M = me(0), $ = oa(o, a), k = $.activityTagId, S = In(a.slots), A = qe(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (E) => Object.keys(In(E)).length > 0,
    sanitize: (E) => qr(k, In(E)),
    summarize: (E) => `${Object.keys(In(E)).length} assigned`,
    renderEditor: (E, ae) => k ? n($a, {
      facets: l,
      values: In(E),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (le, X) => {
        const de = { ...In(E) };
        X ? de[le] = Number(X) : delete de[le], ae(qr(k, de));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [k, l, c.performerSlotsAvailable]), K = JSON.stringify($);
  pe(() => {
    if (d(null), !k) return;
    const E = new AbortController();
    return Z(`/browse/activities/${k}/facets`, { signal: E.signal }).then(d).catch((ae) => {
      ae.status === 403 ? d({ slots: [], restricted: !0 }) : ae.name !== "AbortError" && F(ae.message);
    }), () => E.abort();
  }, [k]), pe(() => {
    const E = ++M.current, ae = new AbortController();
    return U(!0), F(""), Z("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify($), signal: ae.signal }).then((le) => {
      E === M.current && m({ ...le, totalCount: le.totalCount ?? le.total ?? 0 });
    }).catch((le) => {
      if (!(E !== M.current || le.name === "AbortError")) {
        if (le.status === 400 && le.message.includes("unrestricted performer read access")) {
          m((X) => ({ ...X, performerSlotsAvailable: !1 })), s({ ...a, performerId: void 0, performersCriterion: void 0, slots: void 0 }), F("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        F(le.message);
      }
    }).finally(() => {
      E === M.current && U(!1);
    }), () => {
      M.current++, ae.abort();
    };
  }, [K, f]);
  const L = c.items.findIndex((E) => E.key === u), T = c.items[L] || null;
  function H(E) {
    s(E), i({ ...o, page: 1 });
  }
  function J(E) {
    const ae = oa(o, E), le = E.slots && ae.activityTagId != null && ae.slotAssignments.length > 0 ? E.slots : void 0;
    H({ ...E, slots: le });
  }
  function _(E, ae) {
    const le = { ...S };
    ae ? le[E] = Number(ae) : delete le[E], H({ ...a, slots: qr(k, le) });
  }
  function oe() {
    const E = document.querySelector(`[data-segment-key="${u}"]`);
    y(null), requestAnimationFrame(() => E == null ? void 0 : E.focus());
  }
  async function ue(E) {
    var X;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(E.key), g("");
    const ae = `browse-restore:${E.itemId}:${E.revision}`, le = Ue(ae);
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
      He(ae), u === E.key && y(null), g("Segment restored to Cove."), w((xe) => xe + 1);
    } catch (de) {
      g(de.message || "Unable to restore the segment."), de.status === 409 && w((xe) => xe + 1);
    } finally {
      p(null);
    }
  }
  async function be(E) {
    p(E.key), g("");
    try {
      const ae = await Z(`/items/${E.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: E.revision })
      });
      if (!si(ae, g) || !Hl(ae))
        return;
      const le = `browse-dependency-delete:${E.itemId}:${ae.fingerprint}`;
      await Z(`/items/${E.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ue(le),
          fingerprint: ae.fingerprint
        })
      }), He(le), u === E.key && y(null), g(`${ae.deletedSegmentCount} segment${ae.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), w((X) => X + 1);
    } catch (ae) {
      g(ae.message || "Unable to permanently delete the segment."), ae.status === 409 && w((le) => le + 1);
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
    n(La, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: i,
      totalCount: c.totalCount,
      isLoading: B,
      error: q ? new Error(q) : null,
      onRetry: () => w((E) => E + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? ra.filter((E) => E.id !== "performers") : ra,
      objectFilter: a,
      onObjectFilterChange: J,
      customFilterSections: A,
      searchPlaceholder: "Search segments..."
    }, [
      k ? n($a, { key: "slots", facets: l, values: S, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: _ }) : null,
      n(_c, { key: "player", item: T, index: L, count: c.items.length, onPrevious: () => {
        var E;
        return y((E = c.items[L - 1]) == null ? void 0 : E.key);
      }, onNext: () => {
        var E;
        return y((E = c.items[L + 1]) == null ? void 0 : E.key);
      }, onClose: oe, onNavigate: e }),
      R ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, R) : null,
      !B && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      B ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((E) => n(Hc, {
        key: E.key,
        item: E,
        selected: E.key === u,
        busy: b === E.key,
        onSelect: () => y(E.key),
        onRestore: ue,
        onPurge: be
      })))
    ])
  ]);
}
function qc({ onNavigate: e, profile: t }) {
  const [r, o] = z([]), [a, i] = z(""), [s, l] = z(0), [d, c] = z(!0), [m, u] = z(null), [y, b] = z(""), p = me(null);
  async function f(g) {
    const B = await Z("/bin", g ? { signal: g } : void 0);
    return o(B.items || []), i(B.fingerprint || ""), l(Number(B.totalCount) || 0), B;
  }
  pe(() => {
    const g = new AbortController();
    return c(!0), f(g.signal).catch((B) => {
      B.name !== "AbortError" && b(B.message);
    }).finally(() => {
      g.signal.aborted || c(!1);
    }), () => g.abort();
  }, []), Da(ao, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var g;
      return (g = p.current) == null ? void 0 : g.call(p);
    }
  }]);
  async function w(g) {
    var q;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    u(g.itemId), b("");
    const B = `restore:${g.itemId}:${g.revision}`, U = Ue(B);
    try {
      const F = (M = !1) => Z(`/bin/${g.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: U, expectedRevision: g.revision, discardMissingImage: M })
      });
      try {
        await F(uo(B));
      } catch (M) {
        if (((q = M.payload) == null ? void 0 : q.code) !== "missing-image" || !window.confirm(`${M.message}

Continue and discard the missing image reference?`)) throw M;
        mo(B), await F(!0);
      }
      He(B), await f(), qn(), b("Segment restored with a new native ID.");
    } catch (F) {
      b(F.message || "Unable to restore the segment."), F.status === 409 && await f();
    } finally {
      u(null);
    }
  }
  async function R() {
    if (m == null)
      try {
        const g = await di({
          items: r,
          fingerprint: a,
          totalCount: s
        }, () => {
          u(-1), b("");
        });
        if (g.status !== "emptied") return;
        await f(), qn(), b(`${g.segmentCount} segment${g.segmentCount === 1 ? "" : "s"} from ${g.sceneCount} scene${g.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (g) {
        b(g.message || "Unable to empty the recycling bin."), g.status === 409 && await f();
      } finally {
        u(null);
      }
  }
  return p.current = R, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
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
        disabled: d || m != null || s === 0,
        onClick: R,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, m === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    y ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, y) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((g) => n("article", { key: g.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${g.tagName || "Tag segment"} · ${g.videoTitle || `Video ${g.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, g.endSec == null ? Ae(g.startSec) : `${Ae(g.startSec)} – ${Ae(g.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${g.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${g.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: m != null, onClick: () => w(g), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const Ra = "ext:com.midnightrider.segment-studio:videos";
function Vr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const a = qe(() => {
    var ue;
    const _ = Oa(Ra), oe = (ue = _ == null ? void 0 : _.uiOptions) == null ? void 0 : ue.displayMode;
    return _ ? {
      ...Un,
      defaultFilter: { ...Un.defaultFilter, ..._.findFilter || {} },
      defaultObjectFilter: _.objectFilter || {},
      defaultDisplayMode: Un.allowedDisplayModes.includes(oe) ? oe : Un.defaultDisplayMode
    } : Un;
  }, []), { filter: i, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: m } = Pa(a), [u, y] = z({ items: [], totalCount: 0 }), [b, p] = z(!0), [f, w] = z(""), [R, g] = z(0), [B, U] = z(/* @__PURE__ */ new Set()), q = me(0), F = me(null), M = JSON.stringify(i), $ = JSON.stringify(s), k = t || r === "review";
  pe(() => {
    F.current = null, U(/* @__PURE__ */ new Set());
  }, [M, $]), pe(() => {
    const _ = ++q.current, oe = new AbortController();
    return p(!0), w(""), Z(`/videos?${tc(i, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: oe.signal }).then((ue) => {
      _ === q.current && y(ue);
    }).catch((ue) => {
      _ === q.current && ue.name !== "AbortError" && w(ue.message || "Unable to discover videos.");
    }).finally(() => {
      _ === q.current && p(!1);
    }), () => {
      q.current++, oe.abort();
    };
  }, [M, $, t, r, R]);
  function S(_) {
    d({ ..._, page: _.page || 1 });
  }
  function A(_) {
    c(_), d({ ...i, page: 1 });
  }
  function K(_, oe = !1) {
    U((ue) => nc(
      ue,
      u.items.map((be) => be.videoId),
      _,
      F.current,
      oe
    )), F.current = _;
  }
  function L() {
    F.current = null, U(new Set(u.items.map((_) => _.videoId)));
  }
  function T() {
    F.current = null, U(/* @__PURE__ */ new Set());
  }
  function H() {
    F.current = null, U((_) => new Set(u.items.map((oe) => oe.videoId).filter((oe) => !_.has(oe))));
  }
  const J = t || r === "review" ? Sa : Sa.filter((_) => !["reviewState", "shotBoundaries"].includes(_.id));
  return n("div", { className: "w-full space-y-5" }, [
    n(ho, {
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
      savedFilterScope: Ra,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: i,
      onFilterChange: S,
      totalCount: u.totalCount,
      isLoading: b,
      error: f ? new Error(f) : null,
      onRetry: () => g((_) => _ + 1),
      sortOptions: t || r === "review" ? [...xa, { value: "unreviewed_count", label: "Unreviewed count" }] : xa,
      displayMode: l,
      onDisplayModeChange: m,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: J,
      objectFilter: s,
      onObjectFilterChange: A,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: k ? B : void 0,
      onSelectAll: k ? L : void 0,
      onSelectNone: k ? T : void 0,
      onInvertSelection: k ? H : void 0
    }, [
      !b && u.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !b && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, u.items.map((_) => n(rc, { key: _.videoId, item: _, onNavigate: e, showReviewStates: k, selected: B.has(_.videoId), selectionActive: B.size > 0, onSelect: k ? K : null }))) : null,
      !b && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, u.items.map((_) => n(oc, { key: _.videoId, item: _, onNavigate: e, showReviewStates: k, selected: B.has(_.videoId), selectionActive: B.size > 0, onSelect: k ? K : null }))) : null
    ])
  ]);
}
function Ma({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [a, i] = z(null), [s, l] = z(!0), [d, c] = z(""), m = me(0), u = me(0), y = me(e), b = Kd();
  y.current = e;
  const [p] = z(() => zs({
    beginRequest: () => ({ requestId: ++u.current, videoId: y.current }),
    fetchDetail: (U) => Z(f(U.videoId)),
    isCurrent: (U) => cr(U.requestId, u.current, U.videoId, y.current),
    isSameVideo: (U) => U.videoId === y.current
  })), f = (U) => `/videos/${U}/editor`;
  async function w(U, q, F) {
    const M = await Z(f(q), F ? { signal: F.signal } : void 0);
    return cr(U, F ? m.current : u.current, q, y.current) ? (i(M), !0) : !1;
  }
  pe(() => {
    const U = ++m.current, q = e, F = new AbortController();
    return i(null), l(!0), c(""), w(U, q, F).catch((M) => {
      cr(U, m.current, q, y.current) && M.name !== "AbortError" && c(M.message || "Unable to load the editor.");
    }).finally(() => {
      cr(U, m.current, q, y.current) && l(!1);
    }), () => {
      m.current++, u.current++, F.abort();
    };
  }, [e]);
  function R(U, q) {
    i((F) => (F == null ? void 0 : F.video.id) !== q ? F : typeof U == "function" ? U(F) : U);
  }
  function g() {
    return p({
      onLoaded: (U) => {
        i(U), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: (U) => c(U.message || "Unable to reload the latest segment.")
    });
  }
  function B() {
    return p({
      onLoaded: (U) => {
        i(U), c("");
      },
      onError: (U) => c(U.message || "Unable to reload performer slots.")
    });
  }
  return n("div", {
    className: `mx-auto flex w-full flex-col gap-2 ${b ? "lg:overflow-hidden" : "p-3 sm:p-4"}`,
    style: b ? {
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
      n(Cs, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    a ? n(Ec, {
      key: a.video.id,
      detail: a,
      onDetailChange: R,
      onConflict: g,
      onReload: B,
      onSlotsChanged: B,
      splitLayout: b,
      profile: o,
      initialSegmentId: ia() ? -ia() : Al(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function Wc(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function Vc(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function Jc(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function Yc({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: a
}) {
  const i = o.legacyCompatibilityRequired, s = kl(o), l = Wc(e, t, window.location.pathname), d = Vc(e, t, window.location.pathname), c = Jc(e, t, window.location.pathname), m = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (Il(m, o) === "videos" && m !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Vr, {
      onNavigate: r,
      compatibilityMode: i,
      mode: s,
      profile: o
    });
  if (l) return n(Uc, {
    onNavigate: r,
    profile: o,
    onProfileChange: a
  });
  if (i) {
    if (d) return n(Ta, { onNavigate: r, profile: o });
    const b = Number(e);
    return Number.isInteger(b) && b > 0 ? n(Ma, {
      videoId: b,
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
  if (c) return n(qc, { onNavigate: r, profile: o });
  const y = Number(e);
  return d ? n(Ta, { onNavigate: r, profile: o }) : Number.isInteger(y) && y > 0 ? n(Ma, {
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
function Qc({ id: e, slug: t, onNavigate: r }) {
  const [o, a] = z(null), [i, s] = z("");
  return pe(() => {
    const l = new AbortController();
    return Z("/preferences", { signal: l.signal }).then((d) => a(ei(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), i ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, i) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(Yc, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: a
  });
}
function Zc(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function Xc(e, t) {
  const r = Zc(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const Iu = {
  components: { SegmentStudioPage: Qc },
  actionHandlers: { openSegmentStudio: Xc }
};
export {
  Cn as CLEARED_SEGMENT_SELECTION_ID,
  xa as DISCOVERY_SORT_OPTIONS,
  Zt as SEGMENT_STUDIO_CAPABILITIES,
  ao as SEGMENT_STUDIO_EXTENSION_ID,
  Qn as SEGMENT_STUDIO_SHORTCUTS,
  qs as activeEditorFilterCount,
  Dd as addPendingChange,
  sd as applyDerivationRuleSlotSuggestions,
  _n as applyFeedbackEditorDelta,
  Ld as applyPendingChanges,
  ga as applySegmentMergeDelta,
  Wl as basicSegmentTimelineStyle,
  Ml as browseClipEnd,
  ni as browseEditorHref,
  oa as buildBrowseRequest,
  Pc as buildDerivationRuleGraph,
  tc as buildDiscoverySearchParams,
  As as buildMinuteTimelineTicks,
  Dc as buildPerformerSlotOverview,
  Ll as buildSegmentQuickSearchEntries,
  md as buildSegmentRailRows,
  gd as buildTimelineRows,
  au as buildTimelineTicks,
  Ps as calculateCenteredTimelineScroll,
  Yr as calculateEditorPanelMaximum,
  Es as calculateMinuteLabelStride,
  iu as calculateMinuteTimelineWidth,
  Fs as calculateSwimlaneTitleMaximum,
  Ls as calculateTimelinePlayheadPosition,
  so as calculateTimelineRatioBounds,
  Gs as calculateTimelineRatioFromPointer,
  su as calculateVerticalRevealOffset,
  sn as clampEditorPanelWidth,
  yr as clampSwimlaneTitleWidth,
  _a as clampTimelineRatio,
  lo as clampTimelineRatioForHeight,
  Sr as clampTimelineZoom,
  Qd as compactProvenanceSummary,
  jd as confirmPendingChange,
  zs as createEditorReloader,
  ul as createQueuedReviewRequest,
  Md as createSaveQueue,
  Ia as createSegmentAnalysisRequestScope,
  Iu as default,
  Ni as discardPendingChange,
  Ul as downloadFileNameFromContentDisposition,
  Ws as dualRangeValueFromPointer,
  ea as duplicateIdentityFromResponse,
  pl as duplicateOperationKey,
  Va as editorVisibilityIncludingSegment,
  yd as expandedSwimlanes,
  Cl as extensionOwnedSegmentsModeSwitchPrompt,
  Sd as feedbackFrameTimestamps,
  wd as feedbackResultMatchesAction,
  kd as feedbackSelectionPlan,
  _s as filterDerivedSegments,
  zr as filterEditorSegments,
  Oc as filterPerformerSlotOverview,
  Pl as filterSegmentQuickSearch,
  mu as filterSegmentStudioShortcuts,
  vd as findAdjacentSegmentGroupKey,
  xl as findAdjacentShot,
  ll as findEditorShortcut,
  Ha as findInitialSegmentSelection,
  Ms as findNearestSegmentInCurrentSwimlane,
  hr as findNextUnprocessed,
  vl as findPublishedSelectionIdentity,
  nt as findSegmentByStableIdentity,
  Ks as findSegmentFromPlayhead,
  Rs as findSegmentNearPlayhead,
  hd as findSwimlaneRangeSelection,
  no as findSwimlaneSelection,
  Dl as findUniquePerformerSlotAssignment,
  xr as findUnreviewedSelection,
  nd as focusDialogDefaultButton,
  Ir as formatGenderHint,
  Sl as frameStepSeconds,
  ri as generatePerformerSlotAssignmentRecommendations,
  pc as groupApprovedDraftsForPublishing,
  Ol as groupAutoAssignCandidates,
  Nd as groupIncorrectExamplesByTag,
  vc as groupMaterializationOutputs,
  ln as groupSegmentsIntoSwimlanes,
  pd as groupSelectedSwimlanes,
  yo as groupSwimlanesBySegmentGroup,
  Ot as handleModalKey,
  fi as hasGroupedSwimlanes,
  Tn as hasSegmentStudioCapability,
  ki as heldTagChangeFor,
  hl as heldTagReady,
  fa as hideCollectedFeedbackSegments,
  ua as historyActionsForTarget,
  mr as incorrectExampleHistoryState,
  pi as indexPerformerSlotsBySegment,
  fu as initialReviewFilter,
  $d as insertSegmentProjection,
  cr as isCurrentEditorRequest,
  Zl as isEditableTarget,
  bu as isEditorShortcutOwner,
  Rd as isKindRunning,
  Nu as isSaveQueueBusy,
  Jc as isSegmentStudioBinRoute,
  Vc as isSegmentStudioSegmentsRoute,
  Wc as isSegmentStudioSettingsRoute,
  Lc as layoutDerivationRuleComponent,
  jc as layoutDerivationRuleComponents,
  Td as mergeSegmentsProjection,
  ad as multiSelectionActionHint,
  rn as normalizeCollapsedSegmentGroups,
  wa as normalizeDiscoveryIds,
  Lt as normalizeEditorSegmentFilters,
  tn as normalizeGender,
  ta as normalizeReviewFilter,
  ei as normalizeSegmentStudioFeatureProfile,
  gu as normalizeSegmentStudioMode,
  eo as normalizeSegmentStudioPublicMode,
  In as parseBrowseSlotFilters,
  Bs as parseEditorLayout,
  Us as parseHideDerivedSegmentsPreference,
  Hs as parseMergeConfirmationPreference,
  Za as parsePlaybackShortcutConfig,
  il as parseShortcutBindingOverrides,
  en as patchPerformerSlotProjection,
  xu as patchSegmentProjection,
  Fd as pendingChangesReducer,
  Od as pendingInsertedSegments,
  tl as percentageSeekTime,
  El as performInitialSegmentSeek,
  ct as performerOptionId,
  kr as performerSlotHistoryState,
  Tt as performerSlotLabel,
  ld as performerSlotPresentation,
  vu as performerSlotStatus,
  fo as performerSlotStatusFromSegmentSlots,
  gi as performerSlotsForSegment,
  Gt as provenanceSourceLabel,
  Ci as prunePendingChanges,
  bl as queueCreatedSegmentTagChoice,
  oi as rankPerformerOptions,
  xd as reconcileSegmentGroupKey,
  Xs as reconcileSelectedSegmentIds,
  ac as recyclingBinActionText,
  _l as recyclingBinDeletionPrompt,
  li as recyclingBinDeletionSummary,
  $l as recyclingBinModeSwitchPrompt,
  pu as removeQueuedReviewsForSegments,
  Su as removeSegmentsProjection,
  ia as requestedOwnedItemId,
  Al as requestedSegmentId,
  Js as resolveEditorSegmentSelection,
  ml as resolveQueuedReviewRequest,
  fl as resolveSegmentCreationAction,
  Il as resolveSegmentStudioRoute,
  sl as resolveSegmentStudioShortcuts,
  xi as resolveSegmentTarget,
  Fc as resolveSelectedDerivationRule,
  Qo as resolveSelectedSegments,
  wc as restoreDisabledToolbarActionFocus,
  Ac as restorePublishApprovedFocus,
  ku as restoreSegmentFieldsProjection,
  wu as restoreSegmentsProjection,
  Pd as retargetPendingChanges,
  vi as revealCollapsedSegmentGroup,
  Rn as sameSegmentIdentity,
  Si as savingSegmentIdFrom,
  ci as segmentBadgeStyle,
  Nr as segmentGroupHeaderBackground,
  Ft as segmentGroupKeyForSegment,
  po as segmentHistoryIdentity,
  ur as segmentHistoryState,
  Et as segmentIdentity,
  ui as segmentRailItemStyle,
  yu as segmentStateStyle,
  Zc as segmentStudioActionTarget,
  kl as segmentStudioLegacyMode,
  ql as segmentTimelineStyle,
  Pt as segmentsHistoryState,
  el as selectAllVideoSegmentIds,
  Tl as selectedBrowseStates,
  bi as selectedSwimlaneMerge,
  br as selectionReferenceForSegment,
  $i as setBackLinkNavigation,
  Ii as settlePendingChange,
  rd as sharedPerformerSlotShape,
  od as sharedTagPerformerSlotShape,
  $n as shortcutAvailableInMode,
  dl as shortcutBindingDisplayText,
  lu as shortcutBindingFromEvent,
  cu as shortcutBindingsOverlap,
  uu as shortcutModesOverlap,
  al as shortcutRequiresSingleSegment,
  Hr as shotBoundaryFingerprint,
  td as shouldAcceptCurrentTagFromEnter,
  ed as shouldDismissPopover,
  du as shouldExitShortcutCapture,
  hu as shouldHandleEditorShortcut,
  Na as shouldLoadSegmentAnalysis,
  va as shouldReloadAfterSegmentMutation,
  Xr as shouldRestoreTransitionSelection,
  jl as shouldShowQuickSearchGroups,
  Zo as splitShortcutCategoriesIntoColumns,
  id as suggestDerivationRuleSlotMappings,
  Jn as swimlaneDisplayLabel,
  Ql as swimlaneMarkerTop,
  Jl as swimlaneStripeBackground,
  yl as tagEditorLockedBySave,
  bo as targetsOverlap,
  js as timelineContentStyle,
  qo as timelinePlayheadHorizontalStyle,
  Vl as timelineSegmentWidth,
  Ds as timelineTickAlignment,
  Os as timelineTickPosition,
  Jr as timelineTimePercent,
  bd as toggleAllCollapsedSegmentGroups,
  cl as toggledSelectionReviewState,
  Wt as trapModalFocus,
  Gl as tryParseJsonResponseText,
  Zs as updateAnchoredSegmentSelection,
  nc as updateDiscoverySelection,
  Vs as updateDualRangeValues,
  Ys as updateSegmentCollectionSelection,
  Qs as updateSegmentRangeSelection,
  Ja as updateSegmentSelection,
  Ca as validateDerivationRuleDraft,
  _o as validateSegmentTiming,
  co as videoPerformerOptions,
  Wr as videoPerformerSlotAssignments,
  Nl as visibleSegmentStudioSettingsTabs,
  wl as visibleSegmentStudioTabs,
  yi as visibleVirtualRows
};
