import ao from "@cove/runtime/react";
import { createPortal as Ss } from "@cove/runtime/react-dom";
import { extensionFetch as Ma } from "@cove/runtime/api";
import { formatDuration as ks, EntityReferenceSelector as Vn, useExtensionKeyboardBindings as ws, VideoPlayer as Ea, useRegisterExtensionKeyboardActions as Da, getDefaultFilter as Oa, useListUrlState as Pa, ListPage as La } from "@cove/runtime/components";
import { ChevronDown as Fa, StepBack as Ns, StepForward as Is, Loader2 as Cs } from "@cove/runtime/lucide-react";
const io = "com.midnightrider.segment-studio", ja = "segment-studio.layout.v1", mn = "segment-studio.operations.v1", Ba = "segment-studio.collapsed-segment-groups.v1", Ga = "segment-studio.playback-shortcuts.v1", Ua = "segment-studio.timing-clipboard.v1", Ka = "segment-studio.hide-derived-segments.v1", za = "segment-studio.merge-confirmation.v1", Nt = ["unreviewed", "approved", "rejected"], $s = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], Ko = "(min-width: 1024px) and (min-height: 640px)", zo = "(min-width: 1024px) and (min-height: 900px)", Jn = 1e-3, Ho = 15, Ts = 30, Ha = 12, At = {
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
  return r.find((o) => o.id === t) ?? Sr(e, null, 1, !0) ?? r[0] ?? null;
}
function Sr(e, t, r, o = !1) {
  var m;
  const i = e.findIndex((u) => u.markers.some((b) => b.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const u = e.flatMap((b) => b.markers.map((p) => p.segment)).filter((b) => b.reviewState === "unreviewed");
    return r < 0 ? u.at(-1) ?? null : u[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((u) => u.segment.id === t);
  if (!o)
    return ((m = (r < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((b) => b.segment.reviewState === "unreviewed")) == null ? void 0 : m.segment) ?? null;
  const l = e.flatMap((u) => u.markers.map((b) => b.segment)), d = l.findIndex((u) => u.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((u) => u.reviewState === "unreviewed") ?? null;
}
function As(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((m, u) => m.markers.filter(({ segment: b }) => {
    const p = Number(b.startSec), f = b.endSec == null ? p + Ts : Number(b.endSec);
    return Number.isFinite(p) && Number.isFinite(f) && f >= p && p <= i + Ho + Jn && f >= i - Ho - Jn;
  }).map(({ segment: b }) => ({ segment: b, laneIndex: u }))).sort((m, u) => m.laneIndex - u.laneIndex || Math.abs(m.segment.startSec - i) - Math.abs(u.segment.startSec - i) || m.segment.id - u.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((m) => m.markers.some((u) => u.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((m) => m.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((m) => m.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((m) => m.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function Rs(e, t, r) {
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
function kr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function uu(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function Ms(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function mu(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function Es(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function Ds(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Os(e, t, r) {
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
function Ls(e, t, r = 10) {
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
function Fs(e, t = Ha) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function _a(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : At.timelineRatio;
}
function Zr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function cn(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? At.detailWidth : Math.min(Zr(t, 0), Math.max(240, e));
}
function hr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? At.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function js(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function lo(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: At.timelineRatio, maximum: At.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function co(e, t) {
  const r = _a(e);
  if (!(t > 0)) return r;
  const o = lo(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function Bs(e) {
  if (!e) return { ...At };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? _a(r) : At.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: cn(t == null ? void 0 : t.detailWidth),
      markerRailWidth: cn(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: hr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...At };
  }
}
function Gs(e, t, r) {
  return r > 0 ? co((t + r - e) / r, r) : At.timelineRatio;
}
function gu(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function Us(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, m) => c.startSec - m.startSec || c.id - m.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= Jn ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function mr(e, t, r, o) {
  return e === t && r === o;
}
function Ks({ beginRequest: e, fetchDetail: t, isCurrent: r, isSameVideo: o }) {
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
const wr = "__segment-studio-cleared-selection__";
function zs(e) {
  return e === "true";
}
function Hs(e) {
  return e !== "false";
}
function Wa() {
  try {
    return Hs(window.localStorage.getItem(za));
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
function qs(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function Et(e = {}) {
  const t = Nt.filter((m) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(m) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (m, u) => {
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
function _r(e, t, r, o = !1, i = []) {
  var c, m;
  const a = Et(r), s = a.performerId == null ? null : new Set((t || []).filter((u) => Number(u.performerId) === a.performerId).map((u) => u.segmentId)), l = new Set((i || []).flatMap((u) => u.tags || []).map((u) => Number(u.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((m = (c = (i || []).find((u) => Number(u.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : m.map((u) => Number(u.tagId))) || []);
  return qs(e || [], o).filter((u) => {
    if (u.reviewState != null && !a.reviewStates.includes(u.reviewState) || s && !s.has(u.id) || a.tagId != null && Number(u.tagId) !== a.tagId || d && !d.has(Number(u.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(u.tagId)) || a.sourceKey != null && u.sourceKey !== a.sourceKey) return !1;
    const b = Number(u.confidence);
    return u.confidence == null || !Number.isFinite(b) ? a.includeUnscored : b >= a.confidenceMin && b <= a.confidenceMax;
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
      const c = (i || []).find((m) => Number(m.id) === a.segmentGroupId);
      (l = c == null ? void 0 : c.tags) != null && l.some((m) => Number(m.tagId) === Number(e.tagId)) || (a.segmentGroupId = null);
    }
  }
  a.sourceKey != null && e.sourceKey !== a.sourceKey && (a.sourceKey = null);
  const s = Number(e.confidence);
  return e.confidence != null && Number.isFinite(s) && (a.confidenceMin = Math.min(a.confidenceMin, Math.floor(s * 100) / 100), a.confidenceMax = Math.max(a.confidenceMax, Math.ceil(s * 100) / 100)), (e.confidence == null || !Number.isFinite(s)) && (a.includeUnscored = !0), {
    filters: Et(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function _s(e, t = !1) {
  const r = Et(e);
  return +(r.reviewStates.length !== Nt.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function Ws(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function Vs(e, t, r, o) {
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
function Js(e, t, r = null) {
  return t === wr ? null : qa(
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
function Ys(e, t, r) {
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
function Qs(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return Ya(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function Zs(e, t, r = null, o = !1) {
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
      ...Qs(u, s, t, m, !0),
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
    rangeBaseSegmentIds: d.selectedSegmentIds.filter((m) => m !== c)
  };
}
function Xs(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function el(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function Wo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function Vo(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => Wo(t, o) - Wo(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function tl(e, t, r) {
  var c, m;
  const o = e || [], i = new Set(t || []), a = o.findIndex((u) => (u.markers || []).some(({ segment: b }) => b.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: u }) => u.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const u of o) {
      const b = (u.markers || []).find(({ segment: p }) => !i.has(p.id));
      if (b) return b.segment;
    }
    return null;
  }
  const l = Vo(
    o[a].markers,
    s,
    i
  );
  if (l) return l;
  const d = (m = o.map((u, b) => ({ lane: u, index: b })).filter(({ lane: u }) => (u.markers || []).some(({ segment: b }) => !i.has(b.id))).sort((u, b) => Math.abs(u.index - a) - Math.abs(b.index - a) || +(u.index < a) - +(b.index < a) || u.index - b.index)[0]) == null ? void 0 : m.lane;
  return Vo(d == null ? void 0 : d.markers, s, i);
}
function nl(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function rl(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function Jo(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function ol() {
  try {
    return zs(window.localStorage.getItem(Ka));
  } catch {
    return !1;
  }
}
function al(e) {
  try {
    window.localStorage.setItem(Ka, String(!!e));
  } catch {
  }
}
const Zn = [
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
], il = /* @__PURE__ */ new Set([
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
function sl(e) {
  return il.has(e);
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
function ll(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Zn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(Qa).filter(Boolean)]));
  } catch {
    return {};
  }
}
function dl(e = {}) {
  const t = ll(e);
  return Zn.map((r) => ({
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
function pu(e) {
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
function fu(e) {
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
function yu(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = Qo(e.code, t.key), a = Qo(t.code, e.key);
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
          if (Xr(b, e) && Xr(b, t)) return !0;
        }
  return !1;
}
function Mn(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function bu(e, t) {
  return [!1, !0].some((r) => Mn(e, r) && Mn(t, r));
}
function cl(e, t = !1, r = {}) {
  return dl(r).find((o) => Mn(o, t) && o.bindings.some((i) => Xr(e, i))) || null;
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
function ul(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Za).join(" / ") : "Unassigned";
}
function hu(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, ul(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function vu(e) {
  return e === "review" ? "review" : "editor";
}
function tt(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function ml(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function gl(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function pl(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => tt(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: tt(t, e.activeIdentity) || r[0]
  };
}
function fl(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function xu(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => fl(o, i))));
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
function yl(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function bl(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function hl(e, t, r) {
  return e != null && (r == null || t !== r);
}
function vl(e, t, r, o = null) {
  if (r === t.tagId) return null;
  const i = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: r,
    tagName: o || ((i == null ? void 0 : i.tagId) === r ? i.tagName : null)
  };
}
function xl({ tagEditing: e, selectedSegmentIds: t, activeSegmentId: r }, o) {
  return !(e && r === o && (t == null ? void 0 : t.length) === 1 && t[0] === o);
}
function eo(e, t) {
  return e === t;
}
function Sl(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function kl(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - Jn).at(-1) || null : o.find((i) => i.startSec > t + Jn) || null;
}
function _n(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function Xo(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: Nt.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function Su(e, t = null, r = !1) {
  const o = Xo(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function An(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function Xa(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: An(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: An(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: An(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(An(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(An(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(An(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...so };
  }
}
function wl(e, t = 30) {
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
function En(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function Nl(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Il(e) {
  const t = [];
  return En(e, Yt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), En(e, Yt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function Cl(e) {
  return [
    ["general", "General", Yt.settingsGeneral],
    ["shortcuts", "Shortcuts", Yt.settingsShortcuts],
    ["performer-slots", "Performer slots", Yt.settingsPerformerSlots],
    ["derivation", "Derivation", Yt.settingsDerivation]
  ].filter(([, , r]) => En(e, r)).map(([r, o]) => [r, o]);
}
function $l(e, t) {
  return e === "segments" && !En(
    t,
    Yt.navigationSegmentInventory
  ) || e === "bin" && !En(
    t,
    Yt.recyclingBinView
  ) ? "videos" : e;
}
function Tl(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Al(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const Wr = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, ta = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: Nt.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function Rl(e) {
  const t = String(e || "").split(",").filter((r) => Nt.includes(r));
  return t.length === 0 ? [...Nt] : [...new Set(t)];
}
function Rn(e) {
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
function Vr(e, t) {
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
    reviewStates: Ml(t.reviewStateCriterion, t.states),
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
function Ml(e, t) {
  return Nt.includes(e == null ? void 0 : e.value) ? [e.value] : Rl(t);
}
function ri(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function El(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Dl(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function oa(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Ol(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function ct(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function uo(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Jr(e, t) {
  const r = new Set(uo(t).map((o) => String(ct(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function en(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function aa(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(en).sort().join(",")}`;
}
function oi(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((p) => String(p.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((p) => {
    var f;
    return !((f = p.genderHints) != null && f.length);
  }) && e.length === t.length && !i) {
    const p = [...e].sort((y, w) => String(y.slotDefinitionId).localeCompare(String(w.slotDefinitionId))), f = [...t].sort((y, w) => String(y.name).localeCompare(String(w.name)) || Number(ct(y)) - Number(ct(w)));
    return [{
      assignments: Object.fromEntries(p.map((y, w) => [String(y.slotDefinitionId), String(ct(f[w]))])),
      description: f.map((y) => y.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((p) => t.map((f, y) => ({ performer: f, index: y })).filter(({ performer: f }) => {
    var y;
    return !((y = p.genderHints) != null && y.length) || p.genderHints.some((w) => en(w) === en(f.gender || f.genderIdentity));
  }).map(({ index: f }) => f)), m = i ? c.filter((p) => p.length > 0).length : ia(c, t.length);
  if (m === 0) return [];
  const u = new Map(t.map((p, f) => [String(ct(p)), f]));
  function b(p, f, y) {
    if (s.length >= a) return;
    const w = c.slice(p), M = i ? w.filter((H) => H.length > 0).length : ia(w.map((H) => H.filter((q) => !f.has(String(ct(t[q]))))), t.length);
    if (y + M < m) return;
    if (p === e.length) {
      if (y !== m) return;
      const H = Object.fromEntries(d.map(({ slot: L, performer: T }) => [String(L.slotDefinitionId), T ? String(ct(T)) : ""])), q = o.length === 0 ? Object.values(H).sort().join(",") : [...new Set(e.map((L) => String(L.label || "")))].map((L) => `${L}:${d.filter(({ slot: T }) => String(T.label || "") === L).map(({ performer: T }) => T ? String(ct(T)) : "").sort().join(",")}`).join("|");
      !l.has(q) && s.length < a && (l.add(q), s.push({
        assignments: H,
        description: d.map(({ slot: L, performer: T }) => o.length ? `${L.label}: ${(T == null ? void 0 : T.name) || "Unassigned"}` : (T == null ? void 0 : T.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const g = e[p], U = [...d].reverse().find(({ slot: H }) => aa(H) === aa(g)), B = U ? u.get(String(ct(U.performer))) : -1;
    for (const H of c[p]) {
      const q = t[H], L = ct(q);
      if (!(H < B) && !(L == null || !i && f.has(String(L))) && (d.push({ slot: g, performer: q }), i || f.add(String(L)), b(p + 1, f, y + 1), i || f.delete(String(L)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: g, performer: null }), b(p + 1, f, y), d.pop();
  }
  return b(0, /* @__PURE__ */ new Set(), 0), s;
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
    const l = [...e].sort((c, m) => String(c.slotDefinitionId).localeCompare(String(m.slotDefinitionId))), d = [...t].sort((c, m) => String(c.name).localeCompare(String(m.name)) || c.performerId - m.performerId);
    return l.map((c, m) => ({ slot: c, performer: d[m] }));
  }
  const i = /* @__PURE__ */ new Map(), a = [];
  function s(l, d) {
    var m;
    if (i.size > 1) return;
    if (l === e.length) {
      const u = [...new Set(e.map((b) => b.label || ""))].map((b) => `${b}:${a.filter((p) => (p.slot.label || "") === b).map((p) => p.performer.performerId).sort((p, f) => p - f).join(",")}`).join("|");
      i.has(u) || i.set(u, [...a]);
      return;
    }
    const c = e[l];
    for (const u of t)
      !o && d.has(u.performerId) || (m = c.genderHints) != null && m.length && !c.genderHints.some((b) => en(b) === en(u.gender)) || (a.push({ slot: c, performer: u }), o || d.add(u.performerId), s(l + 1, d), o || d.delete(u.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Ll(e) {
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
function Fl(e, t, r = 20) {
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
function jl(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function Bl(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function ai(e, t, r) {
  const o = ct, i = new Set((t || []).map(o)), a = new Set((r || []).map(en));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), m = d.isVideoPerformer ?? i.has(o(d));
    if (c !== m) return m - c;
    const u = en(l.gender || l.genderIdentity), b = en(d.gender || d.genderIdentity), p = l.matchesGenderHint ?? a.has(u);
    return (d.matchesGenderHint ?? a.has(b)) - p || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: fe, useId: ii, useLayoutEffect: sa, useMemo: qe, useReducer: Gl, useRef: pe, useState: K, useSyncExternalStore: Ul } = ao, n = ao.createElement, si = "/api/plugins/segment-studio";
function ze(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(mn) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = no();
    return t[e] = r, window.localStorage.setItem(mn, JSON.stringify(t)), r;
  } catch {
    return no();
  }
}
function He(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(mn) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(mn, JSON.stringify(t));
  } catch {
  }
}
function mo(e) {
  try {
    return JSON.parse(window.localStorage.getItem(mn) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function go(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(mn) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(mn, JSON.stringify(t));
  } catch {
  }
}
function Kl(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function zl(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function Q(e, t, r = 0) {
  var d;
  const o = await Ma(`${si}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Kl(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await zl(250 * (r + 1), t == null ? void 0 : t.signal), Q(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function Hl(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${si}${e}`, o = await Ma(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: ql(
      o.headers.get("Content-Disposition")
    )
  };
}
function ql(e, t = "segment-studio-ai-feedback.zip") {
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
function no() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function li(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function _l(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function di(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function Wl(e, t) {
  const { sceneCount: r, segmentCount: o } = di(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function ci(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = di(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(Wl(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await Q("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: ze(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return He(i), {
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
const Gt = {
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
function ku(e, t) {
  return {
    ...(Gt[e] || Gt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function ui(e) {
  return { ...(Gt[e] || Gt.unreviewed).badge };
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
function Vl(e, t, r = "not-applicable", o = !1) {
  const i = Gt[e] || Gt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Jl(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Yl(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function Ql(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function Zl(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function Cr(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function Xl(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function gn({ state: e, includeLabel: t = !0 }) {
  const r = Gt[e] || Gt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: ui(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function ed(e, t = null) {
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
function wu(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function td(e, t = document) {
  return !(e.defaultPrevented || ed(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function Nu(e, t = document, r = !1, o = {}) {
  return td(e, t) ? cl(e, r, o) != null : !1;
}
function nd(e, t, r = null) {
  return !(!t || e instanceof Element && (t.contains(e) || r != null && r.contains(e)));
}
function Rt(e, { onCancel: t, onConfirm: r } = {}) {
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
function rd(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function od({ confirm: e, cancel: t, confirmReady: r }) {
  const o = r && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function po({ confirmRef: e, cancelRef: t, confirmReady: r }) {
  fe(() => {
    const o = requestAnimationFrame(() => od({
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
function gr(e, t = !0) {
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
function pr(e, t) {
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
function Nr(e) {
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
function ad(e, t) {
  const r = (t || []).map((i) => pi(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: It(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function id(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : ad(e, t);
}
function sd({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function Iu(e, t) {
  return yo(pi(e, t));
}
function It(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function ld(e, t) {
  const r = (d) => It(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
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
    u.forEach((p, f) => l.push({
      sourceSlotDefinitionId: p.id,
      derivedSlotDefinitionId: b[f].id
    }));
  }
  return l;
}
function dd(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = ld(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function cd(e) {
  const t = It(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map($r).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function $r(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function Ir(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function ca(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((m) => m.end <= s && m.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: Ir(o),
    trackCount: Math.max(1, t.length)
  };
}
function ud(e) {
  const t = e.map(It), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function md(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], m = d.length > 0 && d.every((u) => Number(u.performerId) > 0) ? d.map((u) => `${u.slotDefinitionId}:${Number(u.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: m };
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
        const c = ud(l.slots), m = l.slots.filter((y) => !a.has(String(y.slotDefinitionId))), u = o.length === 1 ? l.slots : m, b = u.map((y) => `${c.get(String(y.slotDefinitionId))} · ${y.performerName || `Performer ${y.performerId}`}`).join(" · "), p = [...new Map(u.map((y) => [
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
          performers: p,
          performerAssignments: f,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(ca);
}
function un(e, t = [], r = []) {
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => md(s, a));
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
    for (const s of Nt)
      a.counts[s] += Number((r = o.counts) == null ? void 0 : r[s]) || 0;
  }
  return t;
}
function yi(e) {
  return (e || []).some((t) => t.id != null);
}
const gd = {
  group: 38,
  lane: 33,
  segment: 41
};
function pd(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = gd[s.kind];
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
function bi(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function fd(e, t = [], r = !0) {
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
function yd(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: Ir(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return bo(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: Ir(a)
    };
  });
}
function hi(e, { nativeOnly: t = !1 } = {}) {
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
function nn(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function Yn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function bd(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var r;
    return (r = t[0]) == null ? void 0 : r.toUpperCase();
  }).join("") || "?";
}
function Qn({ performer: e, compact: t = !1, tooltip: r = null }) {
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
    }, o ? bd(e.name) : "—"),
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
function vi({ assignments: e, className: t = "" }) {
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
      n(Qn, {
        key: `${r.key}:avatar`,
        performer: r.performer
      })
    ];
  }));
}
function Tr({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = pe(null), i = `performer-slots-${ii()}`, [a, s] = K(null);
  function l() {
    var p;
    const c = (p = o.current) == null ? void 0 : p.getBoundingClientRect();
    if (!c) return;
    const m = Math.max(0, Math.min(256, window.innerWidth - 16)), u = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), b = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - m - 8, c.right - m)),
      top: b >= u + 8 ? c.bottom + 4 : Math.max(8, c.top - u - 4),
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
    ...e.slice(0, 3).map((c) => n(Qn, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? Ss(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(vi, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : n("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => n(Qn, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function hd(e, t) {
  const r = new Set(nn(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function xi(e, t) {
  return t ? nn(e).filter((r) => r !== t) : nn(e);
}
function vd(e, t) {
  const r = nn(t), o = new Set(nn(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function Bt(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function ma(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), m = Number.isFinite(c) && c >= d ? c : d, u = d <= o && m >= o, b = u ? 0 : Math.min(Math.abs(o - d), Math.abs(o - m));
    return { contains: u, distance: b, duration: m - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function ro(e, t, r, o = null) {
  var m, u, b, p, f, y;
  const i = e.findIndex((w) => w.markers.some((M) => M.segment.id === t));
  if (i < 0) {
    const w = [...((m = e[0]) == null ? void 0 : m.markers) || []];
    return o != null && Number.isFinite(Number(o)) && w.sort((M, g) => ma(M, g, o)), ((u = w[0]) == null ? void 0 : u.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((w) => w.segment.id === t);
  if (r === "left" || r === "right") {
    const w = r === "left" ? -1 : 1, M = Math.min(a.markers.length - 1, Math.max(0, s + w));
    return ((b = a.markers[M]) == null ? void 0 : b.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((p = a.markers[s]) == null ? void 0 : p.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((f = a.markers[s]) == null ? void 0 : f.segment) ?? null : ((y = [...e[l].markers].sort(c ? (w, M) => ma(w, M, Number(o)) : (w, M) => Math.abs(w.segment.startSec - d) - Math.abs(M.segment.startSec - d) || w.segment.startSec - M.segment.startSec || w.segment.id - M.segment.id)[0]) == null ? void 0 : y.segment) ?? null;
}
function xd(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = ro([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function Sd(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function kd(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function wd(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [fa(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => fa(Math.min(s, r + l))))];
}
function Nd(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function Id(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function vr(e, t) {
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
function ga(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function Cd(e) {
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
async function $d(e, t) {
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
      const c = [], m = wd(
        d.startSec,
        d.endSec
      );
      for (const [u, b] of m.entries()) {
        Math.abs(r.currentTime - b) > 5e-4 && (r.currentTime = b, await pa(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const p = await Td(o), f = `example-${l + 1}-frame-${u + 1}`;
        c.push({ fieldName: f, timestampSec: b }), s.push({
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
function Td(e) {
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
function Cu(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Ad(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function Rd(e, t) {
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
function Xt(e, t, r, o) {
  const i = (r || []).map((d) => ({ ...d, segmentId: t })), a = e.performerSlots || [], s = a.findIndex((d) => d.segmentId === t), l = a.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...i), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function Md(e, t) {
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
function Dn(e, t) {
  return !e || !t ? !1 : e.itemId != null && e.itemId === t.itemId || e.nativeSegmentId != null && e.nativeSegmentId === t.nativeSegmentId ? !0 : e.id != null && e.id === t.id;
}
function ho(e, t) {
  return (e || []).some((r) => (t || []).some((o) => Dn(r, o)));
}
function Tt(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function Si(e, t) {
  return (e || []).find((r) => Dn(t, r)) || null;
}
function ki(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Ed(e, t) {
  var r;
  return ((r = e.running) == null ? void 0 : r.kind) === t;
}
function Au(e) {
  return e.running != null || e.queued.length > 0;
}
const ya = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
function fr(e) {
  return Object.freeze({
    id: e.id,
    kind: e.kind,
    lockId: e.lockId,
    targets: e.targets,
    exclusive: e.exclusive,
    meta: e.meta
  });
}
function Dd({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let r = 1, o = null, i = [], a = null, s = !1, l = 0, d = 0;
  const c = () => !t && d < l, m = /* @__PURE__ */ new Map();
  let u = ya;
  const b = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Set();
  let f = [];
  function y() {
    u = o == null && i.length === 0 && a == null ? ya : Object.freeze({
      running: o ? fr(o) : null,
      queued: Object.freeze(i.map(fr)),
      lastFailure: a
    });
    for (const k of [...p]) k();
    if (o == null && i.length === 0) {
      const k = f;
      f = [];
      for (const C of k) C();
    }
  }
  function w(k, C) {
    b.set(k.id, C.status), k.resolve(C);
  }
  function M(k) {
    if (k.dependsOn == null) return "met";
    const C = b.get(k.dependsOn);
    return C === "fulfilled" ? "met" : C != null ? "failed" : "pending";
  }
  function g(k) {
    o = k;
    const C = { ...e(), taskId: k.id, targets: k.targets };
    C.resolveTargets = () => k.targets.map((D) => Si(C.segments, D)).filter(Boolean), y();
    let W;
    try {
      W = k.run(C);
    } catch (D) {
      W = Promise.reject(D);
    }
    Promise.resolve(W).then(
      (D) => U(k, { status: "fulfilled", value: D }),
      (D) => U(k, { status: "rejected", error: D })
    );
  }
  function U(k, C) {
    k.settled || (k.settled = !0, w(k, C), !s && (o = null, C.status === "rejected" && (a = Object.freeze({ id: k.id, kind: k.kind, error: C.error })), y(), l += 1, t && B()));
  }
  function B() {
    if (s || o != null || c()) return;
    let k = !1;
    for (let C = 0; C < i.length; C += 1) {
      const W = i[C], D = M(W);
      if (D === "failed") {
        i = i.filter((A) => A !== W), w(W, { status: "dropped", reason: "dependency-failed" }), k = !0, C -= 1;
        continue;
      }
      if (D !== "pending" && !(W.exclusive && C > 0) && !i.slice(0, C).some((A) => ho(A.targets, W.targets)) && !(W.ready && !W.ready(e(), fr(W)))) {
        i = i.filter((A) => A !== W), g(W);
        return;
      }
    }
    k && y();
  }
  function H(k) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((P) => P.exclusive) || o != null && k.whenBusy !== "enqueue" || k.exclusive && (o != null || i.length > 0 || c())) return null;
    let W;
    const D = new Promise((P) => {
      W = P;
    }), A = {
      id: r++,
      kind: k.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: k.lockId ?? -1,
      targets: Object.freeze((k.targets || []).map(L)),
      exclusive: k.exclusive === !0,
      dependsOn: k.dependsOn ?? null,
      ready: k.ready || null,
      meta: k.meta ?? null,
      run: k.run,
      resolve: W
    };
    return i = [...i, A], y(), B(), { id: A.id, done: D };
  }
  function q(k = {}) {
    let C = null;
    const W = H({
      ...k,
      whenBusy: "reject",
      run: () => new Promise((A) => {
        C = A;
      })
    });
    if (!W) return null;
    if (C == null)
      return S((A) => A.id === W.id), null;
    let D = !1;
    return () => {
      D || (D = !0, C(), (o == null ? void 0 : o.id) === W.id && U(o, { status: "fulfilled", value: void 0 }));
    };
  }
  function L(k) {
    return (k == null ? void 0 : k.id) == null || k.itemId != null || k.nativeSegmentId != null ? k : m.get(k.id) || k;
  }
  function T(k, C) {
    m.set(k, { ...C });
    let W = !1;
    for (const D of i)
      D.targets.some((A) => A.id === k && A.itemId == null && A.nativeSegmentId == null) && (D.targets = Object.freeze(D.targets.map((A) => A.id === k ? { ...C } : A)), W = !0);
    return W && y(), W;
  }
  function S(k) {
    const C = i.filter((W) => k(fr(W)));
    if (C.length === 0) return 0;
    i = i.filter((W) => !C.includes(W));
    for (const W of C) w(W, { status: "cancelled" });
    return y(), B(), C.length;
  }
  return {
    enqueue: H,
    acquire: q,
    cancel: S,
    retarget: T,
    stableIdentity: L,
    // The host reads `settledCount()` while rendering and reports it here once that render commits.
    settledCount: () => l,
    markCommitted(k = l) {
      d = Math.max(d, k);
    },
    poke: () => B(),
    subscribe(k) {
      return p.add(k), () => p.delete(k);
    },
    getSnapshot: () => u,
    whenIdle() {
      return o == null && i.length === 0 ? Promise.resolve() : new Promise((k) => f.push(k));
    },
    dispose() {
      if (s) return;
      const k = i;
      i = [], s = !0;
      for (const W of k) w(W, { status: "cancelled" });
      p.clear();
      const C = f;
      f = [];
      for (const W of C) W();
    }
  };
}
let Od = 1;
function _t() {
  return `pending-${Od++}`;
}
function Pd(e) {
  return e.sort((t, r) => t.startSec - r.startSec || t.id - r.id);
}
function xr(e, t) {
  return (t || []).some((r) => Dn(r, e));
}
function Ld(e, t) {
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
function wi(e, t) {
  return t && (e || []).find((r) => {
    var o;
    return ((o = r.meta) == null ? void 0 : o.kind) === "held-tag" && !r.settled && xr(t, r.targets);
  }) || null;
}
function Fd(e) {
  return (e || []).filter((t) => t.op === "insert" && !t.settled).map((t) => t.segment);
}
function Ni(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function Ii(e, t) {
  const r = (e || []).filter((o) => !Ni(o, t));
  return r.length === (e || []).length ? e : r;
}
function Ci(e, t) {
  let r = !1;
  const o = (e || []).map((i) => i.settled || !Ni(i, t) ? i : (r = !0, { ...i, settled: !0, settledDetail: null }));
  return r ? o : e;
}
function jd(e, t, r) {
  let o = !1;
  const i = (e || []).map((a) => a.targets.some((s) => s.id === t && s.itemId == null && s.nativeSegmentId == null) ? (o = !0, {
    ...a,
    targets: a.targets.map((s) => s.id === t ? { ...r } : s)
  }) : a);
  return o ? i : e;
}
function Bd(e, t) {
  if (!t || t.length === 0) return e;
  let r = [...e || []];
  for (const o of t)
    if (o.op === "insert")
      r.some((i) => Dn(o.segment, i)) || r.push(o.segment);
    else if (o.op === "patch")
      r = r.map((i) => xr(i, o.targets) ? { ...i, ...o.values } : i);
    else if (o.op === "remove")
      r = r.filter((i) => !xr(i, o.targets));
    else if (o.op === "merge") {
      const [i, ...a] = o.targets;
      r = r.filter((s) => !xr(s, a)).map((s) => Dn(i, s) ? { ...s, ...o.values } : s);
    }
  return Pd(r);
}
function $i(e, t) {
  if (!e || e.length === 0) return e;
  const r = [
    ...(t == null ? void 0 : t.segments) || [],
    ...e.filter((a) => a.op === "insert" && !a.settled).map((a) => a.segment)
  ];
  let o = !1;
  const i = [];
  for (const a of e) {
    if (a.op !== "insert" && !a.targets.some((s) => r.some((l) => Dn(s, l)))) {
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
function Gd(e, t, r) {
  return r ? Ii(e, t) : Ci(e, t);
}
function Ud(e, t) {
  switch (t.type) {
    case "confirm":
      return Gd(e, t.key, t.applied);
    case "add":
      return Ld(e, t.entry);
    case "discard":
      return Ii(e, t.key);
    case "settle":
      return Ci(e, t.key);
    case "retarget":
      return jd(e, t.temporaryId, t.identity);
    case "prune":
      return $i(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
function ba(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function Kd(e) {
  const { acquireSaveLock: t, compatibilityMode: r, dispatchPendingChanges: o, enqueueSave: i, pendingChanges: a, retargetSaveTasks: s, currentTime: l, detail: d, editorFilters: c, endInput: m, hideDerivedSegments: u, historyRef: b, mediaDuration: p, onConflict: f, onDetailChange: y, onReload: w, optimisticSegmentIdRef: M, pendingDuplicateRef: g, pendingFirstSegmentStartSecRef: U, pendingTagEditSegmentIdRef: B, performerSlots: H, replaceSegmentSelection: q, savingSegmentId: L, segments: T, selectedSegment: S, selectedSegmentIdRef: k, selectedSegments: C, selectionAnchorIdRef: W, selectionRangeBaseIdsRef: D, setCreatingSegmentId: A, setEditorFilters: P, setFirstSegmentTagOpen: z, setHideDerivedSegments: Z, setHistory: ge, setHistoryOpen: be, setPublishApprovedError: ue, setSaveMessage: R, setSelectedSegmentGroupKey: ae, setSelectedSegmentId: me, setSelectedSegmentIds: J, setTagEditing: ye, startInput: ve, tagEditingRef: te, timelineDuration: he, video: ne } = e;
  function Y(F) {
    b.current = F || Jt, ge(b.current);
  }
  async function ce(F, ie, N, _, G = null) {
    var X;
    try {
      const se = await Q(`/videos/${ne.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: b.current.revision,
          kind: F,
          label: ie,
          beforeState: N,
          afterState: _,
          receiptId: G
        })
      });
      return Y(se), !0;
    } catch (se) {
      return se.status === 409 && ((X = se.payload) != null && X.current) && Y(se.payload.current), R("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function E(F, ie, N = !0, _ = null, G = !1, X = ie, se = !0) {
    if (!F || L != null) return null;
    const Te = t("segment", F.id);
    if (!Te) return null;
    try {
      return await ee(F, ie, {
        recordHistory: N,
        historyLabel: _,
        optimisticValues: G ? X : null,
        restoreSelectionOnFailure: se
      });
    } finally {
      Te();
    }
  }
  async function ee(F, ie, {
    recordHistory: N = !0,
    historyLabel: _ = null,
    optimisticValues: G = null,
    pendingChangeId: X = null,
    restoreSelectionOnFailure: se = !0,
    onReload: Te = w,
    onConflict: $e = f
  } = {}) {
    var ut;
    const it = C.map((Je) => Je.id), Le = k.current, Me = N && !r ? crypto.randomUUID() : null;
    R(N ? "Saving directly to Cove…" : "Restoring history…");
    const We = X ?? (G ? _t() : null);
    G && !X && o({
      type: "add",
      entry: { id: We, op: "patch", targets: [Tt(F)], values: G }
    });
    const at = (Je) => {
      We && o({ type: "confirm", key: We, applied: Je });
    };
    try {
      if (r && F.nativeSegmentId == null && F.itemId != null) {
        const ft = `draft-update:${ne.id}:${F.itemId}:${F.revision}:${ie.tagId}:${ie.startSec}:${ie.endSec ?? "open"}:${ie.reviewState ?? F.reviewState}`, Pe = await Q(`/videos/${ne.id}/drafts/${F.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: ze(ft),
            expectedRevision: F.revision,
            startSec: ie.startSec,
            endSec: ie.endSec,
            tagId: ie.tagId,
            reviewState: ie.reviewState
          })
        });
        He(ft), Pe.performerSlots != null && y((Ue) => Xt(Ue, F.id, Pe.performerSlots, Pe.performerSlotRevision), ne.id);
        const Ye = {
          ...F,
          ...Pe.draft,
          id: F.id,
          itemId: F.itemId
        };
        return N && await ce(
          "segment.update",
          _ || "Changed segment",
          gr(F, r),
          gr(
            Ye,
            r
          )
        ), ba(F, ie, r) ? at(await Te() != null) : (y((Ue) => ({
          ...Ue,
          approvedSetVersion: Pe.approvedSetVersion || Ue.approvedSetVersion,
          segments: (Ue.segments || []).map((_e) => _e.id === F.id ? Ye : _e).sort((_e, Ze) => _e.startSec - Ze.startSec || _e.id - Ze.id)
        }), ne.id), at(!0)), R(((ut = Pe.draft) == null ? void 0 : ut.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), Ye;
      }
      const Je = await Q(`/videos/${ne.id}/segments/${F.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...ie,
          expectedUpdatedAt: F.updatedAt,
          historyReceiptId: Me
        })
      }), mt = {
        ...F,
        ...Je,
        reviewState: ie.reviewState ?? F.reviewState
      };
      return ba(F, ie, r) ? at(await Te() != null) : (y((ft) => ({
        ...ft,
        segments: (ft.segments || []).map((Pe) => Pe.id === F.id ? mt : Pe).sort((Pe, Ye) => Pe.startSec - Ye.startSec || Pe.id - Ye.id)
      }), ne.id), at(!0)), N && await ce(
        "segment.update",
        _ || "Changed segment",
        gr(F, r),
        gr(
          mt,
          r
        ),
        Me
      ), R(N ? "Saved to Cove" : "History restored"), mt;
    } catch (Je) {
      return We && o({ type: "discard", key: We }), We && se && (J(it), me(Le), W.current = Le, D.current = []), Je.status === 409 ? (R("Conflict — loading the latest segment…"), await $e()) : R(Je.message || "Unable to save the segment."), null;
    }
  }
  async function $() {
    if (!r) return !1;
    const F = T.filter((_) => !_.published && _.reviewState === "approved").length;
    if (F === 0 || L != null) return !1;
    const ie = `complete-review:${ne.id}:${d.approvedSetVersion}`, N = t("publish", -1);
    if (!N) return !1;
    ue(""), R(`Publishing ${F} Approved draft${F === 1 ? "" : "s"}…`);
    try {
      const _ = await Q(`/videos/${ne.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ze(ie),
          expectedApprovedSetVersion: d.approvedSetVersion
        })
      });
      He(ie), Y(Jt), be(!1);
      const G = await w(), X = Sl(
        T,
        k.current,
        _.published
      ), se = X ? tt(G == null ? void 0 : G.segments, X) : null;
      return se && me(se.id), R(`${_.published.length} Approved draft${_.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (_) {
      const G = _.status === 409 ? "The approved drafts changed. Review the updated list and try again." : _.message || "Unable to publish the approved drafts.";
      return _.status === 409 && await f(), ue(G), R(G), !1;
    } finally {
      N();
    }
  }
  async function v(F = null, ie = null) {
    if (L != null || h()) return;
    const N = F != null ? U.current : null, _ = Number.isFinite(N) ? N : l, G = Math.min(he, _ + 20);
    if (G <= _) {
      R("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const X = bl(T, S, F);
    if (X.kind === "choose-tag") {
      U.current = _, R(""), z(!0);
      return;
    }
    if (X.kind === "invalid-selection") {
      R("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: se } = X, Te = `create-draft:${ne.id}:${se}:${_}`, $e = r ? null : crypto.randomUUID(), it = k.current, Le = {
      ...S || {},
      id: M.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: se,
      tagName: ie || (S == null ? void 0 : S.tagName) || "Tag segment",
      tagSortName: se === (S == null ? void 0 : S.tagId) && (S == null ? void 0 : S.tagSortName) || null,
      startSec: _,
      endSec: G,
      // Full mode creates manual drafts already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, Me = Ad(d, Le), We = Bt(
      un(Me.segments, Me.segmentGroups || [], Me.performerSlots || []),
      Le.id
    ), at = i({
      kind: "create",
      lockId: -1,
      run: (Je) => ut(Je)
    });
    if (!at) return;
    await at.done;
    async function ut({ onReload: Je, taskId: mt }) {
      var Pe;
      const ft = _t();
      o({ type: "add", entry: { id: ft, taskId: mt, op: "insert", segment: Le } }), z(!1), X.openTagEditor && (A(Le.id), B.current = Le.id, ye(!0)), q(Le.id), ae(We);
      try {
        let Ye;
        if (r) {
          const Ze = await Q(`/videos/${ne.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: ze(Te), tagId: se, startSec: _, endSec: G })
          });
          He(Te), Ye = { itemId: (Pe = Ze.draft) == null ? void 0 : Pe.itemId }, Ze.performerSlots != null && y((V) => Xt(V, Le.id, Ze.performerSlots, Ze.performerSlotRevision), ne.id);
        } else
          Ye = { nativeSegmentId: (await Q(`/videos/${ne.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: se,
              startSec: _,
              endSec: G,
              historyReceiptId: $e
            })
          })).id };
        U.current = null, z(!1);
        const Ue = await Je();
        if (o({ type: "discard", key: ft }), !Ue) {
          y((Ze) => Xt(Ze, Le.id, []), ne.id), q(it), R(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${X.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const _e = tt(Ue == null ? void 0 : Ue.segments, Ye);
        _e ? (o({ type: "retarget", temporaryId: Le.id, identity: Tt(_e) }), s(Le.id, Tt(_e)), X.openTagEditor && (te.current && (B.current = _e.id), A(_e.id)), q(_e.id), ae(Bt(
          un(Ue.segments || [], Ue.segmentGroups || [], Ue.performerSlots || []),
          _e.id
        )), r || await ce(
          "segment.create",
          "Created segment",
          Mt([], !1),
          Mt([_e], !1),
          $e
        )) : (ye(!1), R(`Segment created, but it could not be selected${X.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (Ye) {
        throw o({ type: "discard", key: ft }), q(it), F != null && z(!0), R(Ye.message || "Unable to create the draft."), Ye;
      } finally {
        A(null);
      }
    }
  }
  function h() {
    return wi(a, S) ? (R("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function x() {
    if (C.length !== 1 || !S || L != null || h()) return;
    const F = l;
    if (F <= S.startSec || S.endSec != null && F >= S.endSec) {
      R("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const ie = `split-draft:${S.itemId}:${S.revision}:${F}`, N = r ? null : Mt([S], !1), _ = r ? null : crypto.randomUUID(), G = t("split", S.id);
    if (G)
      try {
        let X = null;
        r && S.nativeSegmentId == null ? (await Q(`/videos/${ne.id}/drafts/${S.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: ze(ie),
            expectedRevision: S.revision,
            splitSec: F
          })
        }), He(ie)) : X = { nativeSegmentId: (await Q(`/videos/${ne.id}/segments/${S.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: S.updatedAt,
            splitSec: F,
            historyReceiptId: _
          })
        })).id };
        const se = await w();
        if (!r) {
          const Te = [
            tt(se == null ? void 0 : se.segments, {
              nativeSegmentId: S.nativeSegmentId ?? S.id
            }),
            tt(
              se == null ? void 0 : se.segments,
              X
            )
          ].filter(Boolean);
          await ce(
            "segment.split",
            "Split segment",
            N,
            Mt(Te, !1),
            _
          );
        }
        R(r ? `Segment split; both ranges remain ${S.reviewState}.` : "Segment split.");
      } catch (X) {
        X.status === 409 ? await f() : R(X.message || "Unable to split the draft.");
      } finally {
        G();
      }
  }
  async function O(F = !1) {
    if (C.length !== 1 || !S || L != null || h()) return;
    const ie = F ? l : S.startSec, N = yl(ne.id, S, F, ie), _ = r ? null : crypto.randomUUID(), G = S, X = k.current, se = G.endSec == null ? null : G.endSec - G.startSec, Te = {
      ...G,
      id: M.current--,
      itemId: null,
      nativeSegmentId: null,
      startSec: ie,
      endSec: se == null ? null : ie + se,
      // Full mode creates the copy already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : G.reviewState,
      revision: 0,
      updatedAt: null
    }, $e = (H || []).filter((Me) => Me.segmentId === G.id), it = i({
      kind: "duplicate",
      lockId: -1,
      targets: [Tt(G)],
      run: (Me) => Le(Me)
    });
    if (!it) return;
    await it.done;
    async function Le({ onReload: Me, onConflict: We, taskId: at }) {
      var mt, ft;
      const ut = _t();
      o({ type: "add", entry: { id: ut, taskId: at, op: "insert", segment: Te } }), $e.length > 0 && y((Pe) => Xt(Pe, Te.id, $e), ne.id), F || (A(Te.id), B.current = Te.id, ye(!0)), q(Te.id);
      const Je = () => {
        o({ type: "discard", key: ut }), $e.length > 0 && y((Pe) => Xt(Pe, Te.id, []), ne.id);
      };
      try {
        const Pe = ((mt = g.current) == null ? void 0 : mt.operationKey) === N ? g.current : null;
        let Ye = (Pe == null ? void 0 : Pe.duplicateIdentity) ?? null;
        if (Ye == null && r && G.nativeSegmentId == null) {
          const V = await Q(`/videos/${ne.id}/drafts/${G.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: ze(N),
              expectedRevision: G.revision,
              startSec: F ? ie : null
            })
          });
          Ye = Zo(!1, V), g.current = { operationKey: N, duplicateIdentity: Ye };
        } else if (Ye == null) {
          const V = await Q(`/videos/${ne.id}/segments/${G.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: G.updatedAt,
              startSec: F ? ie : null,
              historyReceiptId: _
            })
          });
          Ye = Zo(!0, V), g.current = { operationKey: N, duplicateIdentity: Ye };
        }
        const Ue = await Me();
        Je();
        const _e = tt(Ue == null ? void 0 : Ue.segments, Ye);
        if (!_e) {
          ye(!1), q(X), R(Ue ? "Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection." : "Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.");
          return;
        }
        o({ type: "retarget", temporaryId: Te.id, identity: Tt(_e) }), s(Te.id, Tt(_e));
        const Ze = Ja(
          _e,
          Ue.performerSlots || [],
          c,
          u,
          Ue.segmentGroups || []
        );
        P(Ze.filters), Z(Ze.hideDerivedSegments), !F && te.current && (B.current = _e.id), q(_e.id), ae(Bt(
          un(Ue.segments || [], Ue.segmentGroups || [], Ue.performerSlots || []),
          _e.id
        )), r && G.nativeSegmentId == null && He(N), g.current = null, R(F ? "Duplicate created at the playhead." : "Duplicate created in place."), r || await ce(
          "segment.duplicate",
          "Duplicated segment",
          Mt([], !1),
          Mt([_e], !1),
          _
        );
      } catch (Pe) {
        throw Je(), ye(!1), q(X), ((ft = g.current) == null ? void 0 : ft.operationKey) === N ? R("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : Pe.status === 409 ? await We() : R(Pe.message || "Unable to duplicate the draft."), Pe;
      } finally {
        A(null);
      }
    }
  }
  async function re() {
    if (C.length !== 1 || !S) return;
    const F = Number(ve), ie = m.trim() === "" ? null : Number(m), N = qo(F, ie, p);
    if (N.error) {
      R(N.error);
      return;
    }
    if (F === S.startSec && ie === S.endSec) {
      R("Timing is unchanged.");
      return;
    }
    await E(S, { startSec: F, endSec: ie, tagId: S.tagId }, !0, null, !0);
  }
  async function oe(F, ie) {
    if (C.length !== 1 || !S) return;
    const N = qo(F, ie, p);
    if (N.error) {
      R(N.error);
      return;
    }
    if (F === S.startSec && ie === S.endSec) {
      R("Timing is unchanged.");
      return;
    }
    await E(S, { startSec: F, endSec: ie, tagId: S.tagId }, !0, null, !0);
  }
  return { acceptHistory: Y, recordHistoryAction: ce, mutateSegment: E, runSegmentMutation: ee, completeReview: $, createSegment: v, splitSegment: x, duplicateSegment: O, saveTiming: re, applyShortcutTiming: oe };
}
function zd() {
  const [e, t] = K(() => typeof window < "u" && window.matchMedia(Ko).matches);
  return fe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Ko), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Hd() {
  const [e, t] = K(() => typeof window < "u" && window.matchMedia(zo).matches);
  return fe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(zo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function qd() {
  try {
    return Bs(window.localStorage.getItem(ja));
  } catch {
    return { ...At };
  }
}
function _d() {
  try {
    return nn(JSON.parse(window.localStorage.getItem(Ba) || "[]"));
  } catch {
    return [];
  }
}
function Wd(e) {
  try {
    window.localStorage.setItem(Ba, JSON.stringify(nn(e)));
  } catch {
  }
}
function Vd(e) {
  try {
    window.localStorage.setItem(ja, JSON.stringify(e));
  } catch {
  }
}
function Jd() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Ua) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Yd(e) {
  try {
    return window.localStorage.setItem(Ua, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Qd({ status: e }) {
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
function tn({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, Nt.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...ui(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${Gt[t].symbol}${e[t]}`)));
}
function Zd({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: m, shortcutRef: u }) {
  const b = uo(a), [p, f] = K(() => Jr(o, b)), [y, w] = K(!1), [M, g] = K(""), U = pe(!1), B = o.map((k) => `${k.slotDefinitionId}:${k.performerId || ""}`).join("|"), H = b.map((k) => ct(k)).join("|"), q = oi(
    o,
    b
  );
  fe(() => {
    f(Jr(o, b)), g("");
  }, [t, r, B, H]);
  async function L(k = p) {
    if (!U.current) {
      U.current = !0, w(!0), g("Saving performer slots…");
      try {
        const C = Jr(o.map((A) => ({
          ...A,
          performerId: k[A.slotDefinitionId] || null
        })), b), W = o.map((A) => {
          const P = C[A.slotDefinitionId] ? Number(C[A.slotDefinitionId]) : null, z = b.find((Z) => String(ct(Z)) === String(P));
          return {
            ...A,
            performerId: P,
            performerName: (z == null ? void 0 : z.name) || null
          };
        });
        if (s(W) === !1) {
          g("");
          return;
        }
        const D = await Q(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((A) => ({ slotDefinitionId: A.slotDefinitionId, performerId: C[A.slotDefinitionId] ? Number(C[A.slotDefinitionId]) : null }))
          })
        });
        g("Performer slots saved."), await l(D, {
          beforeState: Nr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: Nr([{
            segmentId: t,
            itemId: r,
            revision: D.revision,
            slots: D.slots || []
          }])
        });
      } catch (C) {
        d && await d(o, C), C.status === 409 ? (g("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : g(C.message || "Unable to save performer slots.");
      } finally {
        U.current = !1, w(!1);
      }
    }
  }
  function T(k, C) {
    g(`Option ${C + 1} applied; save to confirm.`), f({ ...p, ...k.assignments });
  }
  async function S(k) {
    const C = { ...p, ...k.assignments };
    f(C), await L(C);
  }
  return fe(() => {
    if (u)
      return u.current = (k) => U.current || !q[k] ? !1 : (S(q[k]), !0), () => {
        u.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    q.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, q.map((k, C) => n("button", {
        key: C,
        type: "button",
        disabled: y,
        onClick: () => T(k, C),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${C + 1}: ${k.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, C + 1),
        n("span", { key: "description" }, k.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${q.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((k) => n("label", { key: k.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, It(k)),
      (k.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(k.genderHints || []).map($r).join(" · ")}`) : null,
      n("select", { key: "select", value: p[k.slotDefinitionId] || "", disabled: y, onChange: (C) => f({ ...p, [k.slotDefinitionId]: C.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ai(b, b, k.genderHints).map((C) => n("option", { key: ct(C), value: ct(C) }, C.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: m, type: "button", disabled: y, onClick: () => L(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, M)])
  ]);
}
function Xd({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a, acquireSaveLock: s = () => () => {
} }) {
  var L;
  const l = ((L = t[0]) == null ? void 0 : L.slots) || [], d = uo(r), c = oi(
    l,
    d
  ), m = "__mixed__", u = () => Object.fromEntries(l.map((T, S) => {
    const k = t.map((C) => {
      var W;
      return String(((W = C.slots[S]) == null ? void 0 : W.performerId) || "");
    });
    return [T.slotDefinitionId, k.every((C) => C === k[0]) ? k[0] : m];
  })), [b, p] = K(u), [f, y] = K(!1), [w, M] = K(""), g = pe(!1), U = t.map((T) => `${T.itemId ?? `native:${T.segmentId}`}:${T.revision}:${T.slots.map((S) => `${S.slotDefinitionId}:${S.performerId || ""}`).join(",")}`).join("|");
  fe(() => {
    p(u());
  }, [U]);
  async function B(T = b) {
    if (g.current) return;
    const S = s();
    if (!S) {
      M("Wait for the current save to finish before saving performer slots.");
      return;
    }
    g.current = !0, y(!0), M(`Saving performer slots for ${t.length} segments…`);
    const k = [];
    try {
      for (const C of t) {
        const W = C.slots.map((A, P) => {
          const z = T[l[P].slotDefinitionId];
          return {
            slotDefinitionId: A.slotDefinitionId,
            performerId: z === m ? A.performerId || null : z ? Number(z) : null
          };
        }), D = await Q(C.itemId != null ? `/videos/${e}/drafts/${C.itemId}/slots` : `/videos/${e}/segments/${C.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: C.revision, assignments: W })
        });
        k.push({
          segmentId: C.segmentId,
          itemId: C.itemId,
          revision: D.revision,
          slots: D.slots || []
        });
      }
      M("Performer slots saved."), await o({
        beforeState: Nr(t),
        afterState: Nr(k)
      });
    } catch (C) {
      const W = await i();
      C.status === 409 ? M(W ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : M(C.message || (W ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      g.current = !1, y(!1), S();
    }
  }
  function H(T, S) {
    M(`Option ${S + 1} applied; save to confirm.`), p({ ...b, ...T.assignments });
  }
  async function q(T) {
    const S = { ...b, ...T.assignments };
    p(S), await B(S);
  }
  return fe(() => {
    if (a)
      return a.current = (T) => g.current || !c[T] ? !1 : (q(c[T]), !0), () => {
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
        onClick: () => H(T, S),
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
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, It(T)),
      n("select", {
        key: "select",
        value: b[T.slotDefinitionId] || "",
        disabled: f,
        onChange: (S) => p({ ...b, [T.slotDefinitionId]: S.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        b[T.slotDefinitionId] === m ? n("option", { key: "mixed", value: m }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ai(d, d, T.genderHints).map((S) => n("option", {
          key: ct(S),
          value: ct(S)
        }, S.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: f,
        onClick: () => B(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, w)
    ])
  ]);
}
function Ut(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function ec(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return Ut(t);
  const o = [...new Set(r.map((i) => Ut(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function Ar() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function yr({ name: e }) {
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
function tc({ hidden: e }) {
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
    n(Ar, { key: "derived" })
  ]);
}
function nc({ segment: e, provenance: t }) {
  var m;
  const [r, o] = K(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = ec(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
        const b = u.modelIdentifier || u.modelKey, p = u.value == null ? null : typeof u.value == "string" ? u.value : JSON.stringify(u.value);
        return n("div", { key: u.id || `${u.fieldKey}:${u.sourceKey}:${u.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            Ut(u.sourceKey, u.sourceDisplayName)
          ),
          u.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${u.fieldKey}${p == null ? "" : ` · ${p}`}`
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
function rc({
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
  const [u, b] = K([]), p = e.flatMap((M) => M.lanes.map((g) => g.key)), f = p.join("|");
  fe(() => {
    const M = new Set(p);
    b((g) => g.filter((U) => M.has(U)));
  }, [f]);
  const y = Ir(t), w = !!hi(
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
      a ? n(tn, { key: "counts", counts: y }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      sd({ mergeable: w, reviewable: a, tagEditable: s, slotsEditable: l })
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
    ...e.map((M) => n("section", {
      key: M.key,
      "data-selected-segment-group": M.key,
      className: "space-y-1.5"
    }, [
      n("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        n("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, M.name),
        n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${M.selectedCount} selected`)
      ]),
      ...M.lanes.map((g) => {
        const U = u.includes(g.key), B = g.markers.some(({ segment: q }) => q.id === r), H = `selected-segment-lane-${g.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: g.key,
          "data-selected-segment-lane": g.key,
          className: `rounded-md border ${B ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": U,
            "aria-controls": H,
            "aria-current": B ? "true" : void 0,
            onClick: () => b((q) => U ? q.filter((L) => L !== g.key) : [...q, g.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, U ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Yn(g)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(g.selectedCount)),
            a ? n(tn, { key: "states", counts: g.counts }) : null
          ]),
          U ? n("div", {
            key: "segments",
            id: H,
            className: "space-y-1 border-t border-border p-1.5"
          }, g.markers.map(({ segment: q }) => {
            const L = q.endSec == null ? Re(q.startSec) : `${Re(q.startSec)} – ${Re(q.endSec)}`;
            return n("button", {
              key: q.id,
              type: "button",
              onClick: () => i(q),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${q.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${q.tagName || "Segment"}, ${q.reviewState}, ${L}` : `${q.tagName || "Segment"}, ${L}`,
              "aria-current": q.id === r ? "true" : void 0
            }, [
              a ? n(gn, {
                key: "state",
                state: q.reviewState,
                includeLabel: !1
              }) : null,
              q.isDerived ? n(Ar, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, L),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                Ut(q.sourceKey)
              )
            ]);
          })) : null
        ]);
      })
    ]))
  ]);
}
const Hn = {
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
function Xn(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function Ti(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function xa(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function br(e, t, r, o = null) {
  const i = xa(t), a = xa(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function oc(e, t, r = null) {
  var u, b, p;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (u = t.hasSegmentsCriterion) == null ? void 0 : u.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), br(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), br(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), br(o, t.performersCriterion, "performer"), br(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = Sa(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = Sa(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((b = t.reviewStateCriterion) == null ? void 0 : b.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const m = (p = t.shotBoundariesCriterion) == null ? void 0 : p.value;
  return r && typeof m == "boolean" ? o.set("hasShotBoundaries", String(m)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function Sa(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function ac(e, t, r, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((m) => a.add(m));
  } else a.has(r) ? a.delete(r) : a.add(r);
  return a;
}
function Ai({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(la, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, Nt.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = Gt[r];
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
function Ri({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
function ic({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      onClick: (l) => Xn(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      n(Ri, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, ks(e.duration)) : null
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
function sc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n(Ri, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
    n(i ? "div" : "a", {
      key: "link",
      href: i ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: i ? void 0 : (l) => Xn(l, t, s),
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
function vo({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = Il(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => Xn(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && En(
        o,
        Yt.recyclingBinView
      ) ? n(Mi, { key: "bin", onNavigate: t }) : null,
      n(Ei, { key: "settings", onNavigate: t })
    ])
  ]);
}
const oo = "segment-studio:recycling-bin-changed";
function lc(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function Wn() {
  window.dispatchEvent(new CustomEvent(oo));
}
function Mi({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = K(null);
  fe(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const m = await Q("/bin"), u = Number(m == null ? void 0 : m.totalCount);
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
  const i = lc(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => Xn(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function Ei({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => Xn(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function dc({ mode: e, onModeChange: t, disabled: r = !1 }) {
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
function cc({ minimum: e, maximum: t, onChange: r }) {
  const o = pe(null), [i, a] = K("maximum"), s = (b, p) => {
    const f = Vs(e, t, b, p);
    a(f.coincidentTop), r({ minimum: f.minimum, maximum: f.maximum });
  }, l = (b, p) => {
    var y;
    const f = (y = o.current) == null ? void 0 : y.getBoundingClientRect();
    f && s(b, Ws(p.clientX, f.left, f.width));
  }, d = (b, p) => {
    var f, y;
    p.preventDefault(), (y = (f = p.currentTarget).setPointerCapture) == null || y.call(f, p.pointerId), l(b, p);
  }, c = (b, p) => {
    var f, y;
    (y = (f = p.currentTarget).hasPointerCapture) != null && y.call(f, p.pointerId) && l(b, p);
  }, m = (b, p) => {
    const f = b === "minimum" ? e : t, y = b === "minimum" ? 0 : e, w = b === "minimum" ? t : 1, M = p.shiftKey ? 0.1 : 0.01;
    let g = null;
    ["ArrowLeft", "ArrowDown"].includes(p.key) && (g = f - M), ["ArrowRight", "ArrowUp"].includes(p.key) && (g = f + M), p.key === "PageDown" && (g = f - 0.1), p.key === "PageUp" && (g = f + 0.1), p.key === "Home" && (g = y), p.key === "End" && (g = w), g != null && (p.preventDefault(), s(b, Math.min(w, Math.max(y, g))));
  }, u = (b, p) => n("span", {
    key: b,
    role: "slider",
    tabIndex: 0,
    "aria-label": b === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((b === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((b === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(p * 100),
    "aria-valuetext": `${Math.round(p * 100)} percent`,
    onPointerDown: (f) => d(b, f),
    onPointerMove: (f) => c(b, f),
    onKeyDown: (f) => m(b, f),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${p * 100}%`,
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
function uc({ saving: e, error: t, onSelect: r, onClose: o }) {
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
    onKeyDownCapture: (s) => Rt(s, { onCancel: a })
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
    n(Vn, {
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
function mc({
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
  const u = Et(e), b = [...new Map((a || []).map((g) => [
    Number(g.tagId),
    g.tagName || `Tag ${g.tagId}`
  ])).entries()].sort((g, U) => g[1].localeCompare(U[1]) || g[0] - U[0]), p = new Set((a || []).map((g) => Number(g.tagId))), f = (s || []).filter((g) => Number(g.id) === u.segmentGroupId || (g.tags || []).some((U) => p.has(Number(U.tagId)))), y = (g) => d(Et({ ...u, ...g })), w = (g) => y({
    reviewStates: u.reviewStates.includes(g) ? u.reviewStates.filter((U) => U !== g) : [...u.reviewStates, g]
  }), M = (g) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${g ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && m();
    },
    onKeyDownCapture: (g) => Rt(g, { onCancel: m })
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
        n("div", { className: "flex flex-wrap gap-2" }, Nt.map((g) => {
          const U = u.reviewStates.includes(g), B = Gt[g];
          return n("button", {
            key: g,
            type: "button",
            onClick: () => w(g),
            "aria-pressed": U,
            className: M(U)
          }, `${B.symbol} ${g} (${i[g] || 0})`);
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
            className: M(u.performerId == null)
          }, "All performers"),
          ...r.map((g) => {
            const U = Number(ct(g));
            return n("button", {
              key: U,
              type: "button",
              onClick: () => y({ performerId: U }),
              "aria-pressed": u.performerId === U,
              className: M(u.performerId === U)
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
            onChange: (g) => y({
              tagId: g.target.value === "" ? null : Number(g.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...b.map(([g, U]) => n("option", { key: g, value: g }, U))
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
            onChange: (g) => y({
              segmentGroupId: g.target.value === "" ? null : g.target.value === "ungrouped" ? "ungrouped" : Number(g.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All Segment groups"),
            ...f.map((g) => n("option", { key: g.id, value: g.id }, g.name)),
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
            className: M(u.sourceKey == null)
          }, "All provenance"),
          ...o.map((g) => n("button", {
            key: g,
            type: "button",
            onClick: () => y({ sourceKey: g }),
            "aria-pressed": u.sourceKey === g,
            title: g,
            className: M(u.sourceKey === g)
          }, Ut(g)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(cc, {
          minimum: u.confidenceMin,
          maximum: u.confidenceMax,
          onChange: ({ minimum: g, maximum: U }) => y({
            confidenceMin: g,
            confidenceMax: U
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
            onChange: (g) => y({
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
        n(tc, { key: "icon", hidden: t }),
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
        onClick: m,
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground"
      }, "Done")
    ])
  ]));
}
const Di = "segment-studio-editor-history";
function gc({ history: e, historySaving: t, anchorRef: r, onRestore: o, onClose: i }) {
  const a = pe(null);
  return fe(() => {
    const s = (d) => {
      nd(d.target, a.current, r == null ? void 0 : r.current) && i();
    }, l = (d) => {
      var u, b, p;
      if (d.key !== "Escape" || d.defaultPrevented || document.querySelector("[role='dialog'], [aria-modal='true']")) return;
      const c = document.activeElement, m = c instanceof Element && (((u = a.current) == null ? void 0 : u.contains(c)) || ((b = r == null ? void 0 : r.current) == null ? void 0 : b.contains(c)));
      d.preventDefault(), i(), m && ((p = r == null ? void 0 : r.current) == null || p.focus({ preventScroll: !0 }));
    };
    return document.addEventListener("pointerdown", s), document.addEventListener("keydown", l), () => {
      document.removeEventListener("pointerdown", s), document.removeEventListener("keydown", l);
    };
  }, [r, i]), n("div", {
    ref: a,
    id: Di,
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
function pc({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Zn.filter((l) => Mn(l, e)), i = Yo(o, 1)[0], a = Yo(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((m) => n("div", { key: m.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, m.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[m.id] ? t[m.id].length > 0 ? t[m.id] : ["Unassigned"] : m.bindings.map(Za)).map((u, b) => n("kbd", { key: `${m.id}:${b}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, u))
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
    onKeyDownCapture: (l) => Rt(l, { onCancel: r })
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
function fc({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = Cd(e), [l, d] = K([]), c = s.map((m) => m.tagName).join("|");
  return fe(() => {
    const m = new Set(s.map((u) => u.tagName));
    d((u) => u.filter((b) => m.has(b)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (m) => Rt(m, {
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
        const b = l.includes(m.tagName), p = `incorrect-example-tag-${u}`;
        return n("section", {
          key: m.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": b,
            "aria-controls": p,
            onClick: () => d((f) => b ? f.filter((y) => y !== m.tagName) : [...f, m.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: Cr(!1) }
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
            id: p,
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
function yc({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = K(""), [a, s] = K(0), l = pe(null), d = qe(() => Fl(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), m = Bl(d);
  fe(() => {
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
      var p;
      if (b.key === "Tab")
        Wt(b);
      else if (b.key === "Escape")
        b.preventDefault(), b.stopPropagation(), r();
      else if (b.key === "ArrowDown" || b.key === "ArrowUp") {
        b.preventDefault(), b.stopPropagation();
        const f = b.key === "ArrowDown" ? 1 : -1;
        s((y) => d.length ? (y + f + d.length) % d.length : 0);
      } else b.key === "Enter" && !((p = b.nativeEvent) != null && p.isComposing) && (b.preventDefault(), b.stopPropagation(), u());
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
    }, d.length ? d.flatMap((b, p) => {
      var H;
      const f = b.segment || b, y = f.endSec == null ? Re(f.startSec) : `${Re(f.startSec)} – ${Re(f.endSec)}`, w = `${Ut(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`, M = p === c, g = p > 0 ? d[p - 1].groupKey : null, U = m && b.groupKey !== g ? n("div", {
        key: `group:${b.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, b.groupName) : null, B = n("button", {
        key: f.id,
        id: `segment-quick-search-${f.id}`,
        ref: M ? l : null,
        type: "button",
        role: "option",
        "aria-selected": M,
        onMouseEnter: () => s(p),
        onClick: () => t(f),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${M ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        m ? n("span", { key: "group", className: "sr-only" }, `${b.groupName} group`) : null,
        n(gn, { key: "review", state: f.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          f.tagName || "Tag segment"
        ),
        (H = b.performers) != null && H.length ? n(Tr, {
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
      return U ? [U, B] : [B];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function bc(e) {
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
function hc({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = qe(() => bc(e), [e]), [l, d] = K([]), c = s.reduce((p, f) => p + f.drafts.length, 0), m = pe(null);
  po({ confirmRef: m, cancelRef: o, confirmReady: !t && c > 0 });
  const u = (p) => d((f) => f.includes(p) ? f.filter((y) => y !== p) : [...f, p]), b = (p) => `segment-studio-publish-approved-${p.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (p) => {
      p.target === p.currentTarget && !t && a();
    },
    onKeyDownCapture: (p) => Rt(p, {
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
      ].flatMap(([p, f]) => [
        n("dt", { key: `${p}:label`, className: "text-secondary" }, p),
        n("dd", { key: `${p}:value`, className: "font-semibold text-foreground" }, String(f))
      ])),
      s.length ? n("div", { key: "groups", className: "space-y-2" }, s.map((p) => {
        const f = l.includes(p.key);
        return n("section", { key: p.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": f,
            "aria-controls": b(p),
            onClick: () => u(p.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: Cr(!1) }
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, f ? "▾" : "▸"),
            n("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, p.tagName),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${p.drafts.length} draft${p.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          f ? n("div", {
            key: "drafts",
            id: b(p),
            className: "divide-y divide-border border-t border-border"
          }, p.drafts.map((y) => {
            const w = y.endSec == null ? Re(y.startSec) : `${Re(y.startSec)} – ${Re(y.endSec)}`, M = `${Ut(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`;
            return n("div", { key: y.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(gn, { key: "review", state: y.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, w),
              n("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: M
              }, M)
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
function vc({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = Ll(e), [s, l] = K(() => /* @__PURE__ */ new Set()), [d, c] = K(() => new Set(a.map((y) => y.key))), m = a.flatMap((y) => d.has(y.key) ? y.candidates : []), u = (y) => l((w) => {
    const M = new Set(w);
    return M.has(y) ? M.delete(y) : M.add(y), M;
  }), b = (y) => c((w) => {
    const M = new Set(w);
    return M.has(y) ? M.delete(y) : M.add(y), M;
  }), p = (y) => y.assignment.map(({ slot: w, performer: M }) => `${w.label || `Slot ${w.sortOrder + 1}`}: ${M.name}`).join(", "), f = (y) => `segment-studio-auto-assign-${y.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (y) => {
      y.target === y.currentTarget && !t && i();
    },
    onKeyDownCapture: (y) => {
      y.key === "Enter" && y.target instanceof HTMLInputElement || Rt(y, {
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
          style: { background: Cr(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(y.key),
            disabled: t,
            onChange: () => b(y.key),
            "aria-label": `Include ${y.tagName} assignment: ${p(y)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(y.key),
            "aria-controls": f(y),
            "aria-label": `${s.has(y.key) ? "Collapse" : "Expand"} ${y.tagName} assignment: ${p(y)}`,
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
            y.assignment.map(({ slot: w, performer: M }) => {
              const g = w.label || `Slot ${w.sortOrder + 1}`;
              return n("span", {
                key: w.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${g}: ${M.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${g}: ${M.name}`
                }, `${g}: ${M.name}`),
                n(Qn, {
                  key: "avatar",
                  performer: { id: M.performerId, name: M.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(tn, { key: "states", counts: y.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(y.candidates),
            "aria-label": `Auto-Assign ${y.tagName}: ${p(y)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${y.candidates.length})`)
        ]),
        s.has(y.key) ? n(
          "div",
          { key: "segments", id: f(y), className: "divide-y divide-border/70" },
          y.candidates.map((w) => {
            const M = w.endSec == null ? Re(w.startSec) : `${Re(w.startSec)} – ${Re(w.endSec)}`, g = `${Ut(w.sourceKey)}${w.confidence == null ? "" : ` · ${Math.round(w.confidence * 100)}%`}`;
            return n("div", {
              key: w.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(gn, { key: "review", state: w.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                w.tagName || "Tag segment"
              ),
              n(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                M
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
function xc({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => Rt(d, { onCancel: r, onConfirm: t })
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
function Sc({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = K(!1), d = pe(null);
  if (po({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Re(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && a();
    },
    onKeyDownCapture: (m) => Rt(m, {
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
function kc(e) {
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
function wc({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var u, b;
  const l = e ? e.createCount + e.linkCount : 0, d = pe(null);
  po({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((u = e == null ? void 0 : e.outputs) == null ? void 0 : u.slice(0, 200)) || [], m = kc(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (p) => {
      p.target === p.currentTarget && !r && s();
    },
    onKeyDownCapture: (p) => Rt(p, {
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
        ].flatMap(([p, f]) => [
          n("dt", { key: `${p}:label`, className: "text-secondary" }, p),
          n("dd", { key: `${p}:value`, className: "font-semibold text-foreground" }, String(f))
        ])),
        e.conflictCount > 0 ? n(
          "p",
          { key: "conflicts", role: "status", className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground" },
          `${e.conflictCount} existing derivation ${e.conflictCount === 1 ? "branch was" : "branches were"} skipped because its lineage no longer matches the active rule. Resolve these through lineage maintenance.`
        ) : null,
        m.length ? n("div", { key: "outputs", className: "space-y-2" }, [
          ...m.map((p) => n("article", {
            key: p.key,
            className: "rounded-md border border-border bg-surface p-3"
          }, [
            n("div", { key: "root", className: "flex min-w-0 items-center gap-2" }, [
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
                `${p.rootTagName} @ ${Re(p.rootStartSec)}`
              ),
              n(
                "span",
                { key: "count", className: "shrink-0 text-xs font-medium text-secondary" },
                `${p.outputs.length} ${p.outputs.length === 1 ? "change" : "changes"}`
              )
            ]),
            n(
              "div",
              { key: "tree", className: "mt-2 space-y-1 border-l border-border pl-2" },
              p.outputs.map((f, y) => n("div", {
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
function Nc({
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
  detail: p,
  video: f,
  slotButtonRef: y,
  tagSearchRef: w,
  onDetailChange: M,
  setSaveMessage: g,
  acquireSaveLock: U,
  onSlotsChanged: B,
  onRecordHistory: H,
  onCancelQueuedReview: q,
  splitSegment: L,
  duplicateSegment: T,
  provenance: S,
  lineage: k,
  onNavigateLineageItem: C,
  tagEditing: W,
  onCancelTagEditing: D,
  detailPanelRef: A,
  onReduceSelection: P
}) {
  var ve, te, he, ne;
  const z = pe(null), Z = pe(null), ge = () => {
    var Y;
    (Y = Z.current) == null || Y.call(Z), Z.current = null;
  }, be = pe(null), ue = pe(null), R = pe(null), ae = pe(null), [me, J] = K(!1);
  fe(() => {
    z.current && (z.current.scrollTop = 0), J(!1);
  }, [t == null ? void 0 : t.id]), fe(() => {
    var Y, ce;
    me && ((ce = (Y = be.current) == null ? void 0 : Y.querySelector("input, select, button")) == null || ce.focus({ preventScroll: !0 }));
  }, [me]);
  function ye() {
    J(!1), requestAnimationFrame(() => {
      var Y;
      return (Y = y.current) == null ? void 0 : Y.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const Y = !r.some((ee) => ee.isDerived), ce = e && m ? id(b, r) : null, E = (ce == null ? void 0 : ce.map((ee, $) => {
      var h;
      const v = r[$];
      return {
        segmentId: v.nativeSegmentId,
        itemId: v.published ? null : v.itemId,
        revision: (h = p.performerSlotRevisions) == null ? void 0 : h[v.id],
        slots: ee
      };
    })) || [];
    return n(ao.Fragment, null, [
      n(rc, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: A,
        onReduceSelection: P,
        reviewable: e,
        tagEditable: Y,
        slotsEditable: E.length > 0 && a == null,
        onEditSlots: () => J(!0),
        slotButtonRef: y,
        saveMessage: i
      }),
      W && Y ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ee) => {
          ee.target === ee.currentTarget && D();
        },
        onKeyDownCapture: (ee) => Rt(ee, { onCancel: D })
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
        n(Vn, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (ee, $) => ee == null ? D() : l(ee, $ == null ? void 0 : $.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: D,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      me && E.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ee) => {
          ee.target === ee.currentTarget && ye();
        },
        onKeyDownCapture: (ee) => {
          var v, h;
          if (!(typeof ((v = ee.target) == null ? void 0 : v.closest) == "function" ? ee.target.closest("input, textarea, select, [contenteditable='true']") : null) && !ee.repeat && !ee.ctrlKey && !ee.altKey && !ee.metaKey && !ee.shiftKey && /^[1-9]$/.test(ee.key) && ((h = ae.current) != null && h.call(ae, Number(ee.key) - 1))) {
            ee.preventDefault(), ee.stopPropagation();
            return;
          }
          Rt(ee, { onCancel: ye });
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
          n("button", { key: "close", type: "button", onClick: ye, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Xd, {
          videoId: f.id,
          targets: E,
          performerCandidates: p.performerCandidates || [],
          shortcutRef: ae,
          acquireSaveLock: () => U("slots", -1),
          onSaved: async ({ beforeState: ee, afterState: $ }) => {
            await H(
              "performer-slots.assign",
              `Assigned performers to ${E.length} segments`,
              ee,
              $
            ), ye(), await B();
          },
          onConflict: B
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (Y) => {
      z.current = Y, A && (A.current = Y);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(gn, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(Ar, { key: "derived" }) : null,
        t && W ? n("div", {
          key: "tag-editor",
          ref: w,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (Y) => {
            Y.key === "Escape" && (Y.preventDefault(), Y.stopPropagation(), D());
          },
          onKeyDown: (Y) => {
            rd(Y, t.tagName) && (Y.preventDefault(), Y.stopPropagation(), l(t.tagId));
          }
        }, n(Vn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (Y, ce) => Y == null ? D() : l(Y, ce == null ? void 0 : ce.label),
          disabled: hl(a, t.id, s) || ((ve = k.data) == null ? void 0 : ve.tagReadOnly) === !0,
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
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(Qd, { status: c })) : null,
      t && m && u.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(vi, {
        assignments: u.map((Y) => {
          const ce = cd(Y);
          return {
            key: String(Y.slotDefinitionId),
            label: ce.label,
            performer: ce.filled ? { id: Number(Y.performerId), name: ce.performer } : null,
            title: ce.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(nc, {
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
            ...k.data.parents.map((Y) => n("button", {
              key: Y.nodeId,
              type: "button",
              onClick: () => C(Y.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${Y.ruleKey} ${Y.ruleVersion}`))
          ]) : null,
          (he = k.data.children) != null && he.length ? n("p", { key: "children" }, `Children: ${k.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: y,
          type: "button",
          disabled: a != null || !m || u.length === 0,
          onClick: () => J(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: m ? u.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, u.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: L,
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
    me && e && t && m && u.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (Y) => {
        Y.target === Y.currentTarget && ye();
      },
      onKeyDownCapture: (Y) => {
        var E, ee;
        if (!(typeof ((E = Y.target) == null ? void 0 : E.closest) == "function" ? Y.target.closest("input, textarea, select, [contenteditable='true']") : null) && !Y.repeat && !Y.ctrlKey && !Y.altKey && !Y.metaKey && !Y.shiftKey && /^[1-9]$/.test(Y.key) && ((ee = R.current) != null && ee.call(R, Number(Y.key) - 1))) {
          Y.preventDefault(), Y.stopPropagation();
          return;
        }
        Rt(Y, {
          onCancel: ye,
          onConfirm: () => {
            var $;
            return ($ = ue.current) == null ? void 0 : $.click();
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
        n("button", { key: "close", type: "button", onClick: ye, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Zd, {
        key: `${t.id}:${p.performerSlotsRevision || p.slotRevision || ""}`,
        videoId: f.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: u,
        revision: (ne = p.performerSlotRevisions) == null ? void 0 : ne[t.id],
        performerCandidates: p.performerCandidates || [],
        confirmRef: ue,
        shortcutRef: R,
        onOptimisticSave: (Y) => {
          const ce = U("slots", t.id);
          if (!ce)
            return g("Wait for the current save to finish before saving performer slots."), !1;
          Z.current = ce, M((E) => Xt(
            E,
            t.id,
            Y
          ), f.id), g("Saving performer slots…"), ye();
        },
        onSaved: async (Y, { beforeState: ce, afterState: E }) => {
          M((ee) => Xt(
            ee,
            t.id,
            Y.slots || [],
            Y.revision
          ), f.id), g("Performer slots saved.");
          try {
            await H(
              "performer-slots.assign",
              "Assigned performers",
              ce,
              E
            ), await B(Y) || q([t]);
          } finally {
            ge();
          }
        },
        onRollback: async (Y, ce) => {
          q([t]), M((E) => {
            var ee;
            return Xt(
              E,
              t.id,
              Y,
              (ee = p.performerSlotRevisions) == null ? void 0 : ee[t.id]
            );
          }, f.id), g(ce.message || "Unable to save performer slots.");
          try {
            ce.status === 409 && await B();
          } finally {
            ge();
          }
        },
        onConflict: B
      }))
    ])) : null
  ]);
}
function Ic({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: m, onZoomChange: u, onSelectGroup: b, onToggleGroup: p, onSelect: f, onSelectSegments: y, onSelectAll: w, onConfigureTag: M, onSeekTime: g, centerRef: U, showReviewState: B = !0, swimlaneTitleWidth: H, onSwimlaneTitleWidthChange: q }) {
  const L = pe(null), T = pe(null), [S, k] = K(0), [C, W] = K({ scrollTop: 0, height: 320 }), [D, A] = K(null), P = qe(
    () => un(e, r, o),
    [e, r, o]
  ), z = qe(
    () => fi(o),
    [o]
  ), Z = qe(() => bo(P), [P]), ge = qe(
    () => fd(Z, i, yi(Z)),
    [Z, i]
  ), be = qe(
    () => bi(ge.rows, Math.max(0, C.scrollTop - 24), C.height),
    [ge, C]
  ), ue = Math.max(0, Number(d) || 0), R = js(S), ae = hr(H, R), me = ae / 16, J = Ls(c, ue, me), ye = Ms(ue), ve = Es(ue, Math.max(1, S - me * 16), m), te = ye.filter((h, x) => x === 0 || x % ve === 0), he = qe(() => P.map((h) => `${h.key}:${h.trackCount}:${h.markers.map(({ segment: x, track: O }) => `${x.id}:${x.startSec}:${x.endSec ?? ""}:${O}`).join(",")}`).join("|"), [P]);
  function ne() {
    const h = T.current;
    if (!h) return;
    const x = h.querySelector("[data-timeline-track]"), O = h.firstElementChild, re = x == null ? void 0 : x.getBoundingClientRect(), oe = O == null ? void 0 : O.getBoundingClientRect(), F = re && oe ? Math.max(0, re.left - oe.left) : me * 16, ie = (oe == null ? void 0 : oe.width) ?? h.scrollWidth;
    h.scrollTo({
      left: Ps(c, ue, ie, h.clientWidth, F, Ha),
      behavior: "smooth"
    });
  }
  fe(() => (U.current = ne, () => {
    U.current === ne && (U.current = null);
  })), fe(() => {
    ne();
  }, [m]);
  function Y() {
    const h = T.current, x = ge.rows.find((ie) => ie.kind === "lane" && ie.lane.markers.some(({ segment: N }) => N.id === s));
    if (!h || !x) return;
    const O = 24, re = x.top + O, oe = re + x.height;
    let F = h.scrollTop;
    re < h.scrollTop + O ? F = Math.max(0, re - O) : oe > h.scrollTop + h.clientHeight && (F = Math.max(0, oe - h.clientHeight)), F !== h.scrollTop && (h.scrollTop = F), W({ scrollTop: F, height: h.clientHeight });
  }
  fe(() => {
    Y();
  }, [s, he, ge]), fe(() => {
    const h = T.current, x = ge.rows.find((ie) => ie.kind === "group" && ie.group.key === a);
    if (!h || !x) return;
    const O = 24, re = x.top + O, oe = re + x.height;
    let F = h.scrollTop;
    re < h.scrollTop + O ? F = Math.max(0, re - O) : oe > h.scrollTop + h.clientHeight && (F = Math.max(0, oe - h.clientHeight)), F !== h.scrollTop && (h.scrollTop = F), W({ scrollTop: F, height: h.clientHeight });
  }, [a, ge]), fe(() => {
    const h = T.current;
    if (!h || typeof ResizeObserver > "u") return;
    const x = () => {
      k(h.clientWidth), W({ scrollTop: h.scrollTop, height: h.clientHeight }), Y();
    }, O = new ResizeObserver(x);
    return O.observe(h), x(), () => O.disconnect();
  }, [s, he, ge]);
  function ce(h) {
    if (!(ue > 0)) return;
    const x = h.currentTarget.getBoundingClientRect(), O = Math.min(1, Math.max(0, (h.clientX - x.left) / x.width));
    g(O * ue);
  }
  function E(h) {
    const x = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let O = null;
    Object.hasOwn(x, h.key) && (O = c + x[h.key]), h.key === "Home" && (O = 0), h.key === "End" && (O = ue), O != null && (h.preventDefault(), h.stopPropagation(), g(Math.min(ue, Math.max(0, O))));
  }
  function ee(h) {
    var O;
    const x = (O = L.current) == null ? void 0 : O.getBoundingClientRect();
    x && q(hr(h.clientX - x.left, R));
  }
  function $(h) {
    const x = h.shiftKey ? 40 : 16;
    let O = null;
    h.key === "ArrowLeft" && (O = ae - x), h.key === "ArrowRight" && (O = ae + x), h.key === "Home" && (O = 160), h.key === "End" && (O = R), O != null && (h.preventDefault(), h.stopPropagation(), q(hr(O, R)));
  }
  const v = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: L,
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
      n("button", { key: "out", type: "button", className: v, disabled: m <= 1, onClick: () => u(kr(m - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: v, disabled: m === 1, onClick: () => u(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(m * 100)}%`),
      n("button", { key: "in", type: "button", className: v, disabled: m >= 8, onClick: () => u(kr(m + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: v, onClick: ne, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(R),
      "aria-valuenow": Math.round(ae),
      "aria-valuetext": `${Math.round(ae)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (h) => {
        h.currentTarget.setPointerCapture(h.pointerId), ee(h);
      },
      onPointerMove: (h) => {
        h.currentTarget.hasPointerCapture(h.pointerId) && ee(h);
      },
      onKeyDown: $,
      onDoubleClick: () => q(At.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${ae - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: T,
      onScroll: (h) => W({
        scrollTop: h.currentTarget.scrollTop,
        height: h.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: Fs(m) }, [
      n("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${me}rem minmax(0,1fr)`, height: "1.5rem" } }, [
        n("div", { key: "axis-label", "data-timeline-label-gutter": "true", "aria-hidden": "true", className: "sticky left-0 z-40 border-r border-border", style: { backgroundColor: "var(--color-surface)" } }),
        n("div", {
          key: "ticks",
          role: "slider",
          tabIndex: 0,
          "data-timeline-seeker": "true",
          "data-timeline-track": "true",
          "aria-label": "Timeline seek",
          "aria-valuemin": 0,
          "aria-valuemax": ue,
          "aria-valuenow": Math.min(ue, Math.max(0, c)),
          "aria-valuetext": Re(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: ce,
          onKeyDown: E
        }, te.map((h, x) => n("span", {
          key: h,
          className: `absolute top-0 ${Ds(x, te.length, ue > 0 ? h / ue * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Os(x, te.length, ue > 0 ? h / ue * 100 : 0)
        }, Re(h))).concat(t.map((h) => {
          const x = ue > 0 ? h.startSec / ue * 100 : 0;
          return n("button", {
            key: `shot-boundary:${h.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Re(h.startSec)} – ${Re(h.endSec)}`,
            title: `Shot boundary · ${h.source || "manual"} · ${Re(h.startSec)} – ${Re(h.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${x}%`, width: "2px" },
            onClick: (O) => {
              O.stopPropagation(), g(h.startSec);
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
        style: P.length > 0 ? { height: ge.height } : void 0
      }, [
        P.length > 0 ? n("span", {
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
        P.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : be.map((h) => {
          var _;
          const x = h.group, O = i.includes(x.key), re = a === x.key, oe = Cr(re);
          if (h.kind === "group") return n("div", {
            key: h.key,
            "data-segment-group": x.key,
            "data-segment-group-collapsed": O ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${me}rem minmax(0,1fr)`,
              backgroundColor: oe,
              top: h.top,
              height: h.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (G) => {
                if (G.metaKey || G.ctrlKey) {
                  y(x.lanes.flatMap((X) => X.markers.map((se) => se.segment.id)));
                  return;
                }
                b(x.key), p(x.key);
              },
              "aria-expanded": !O,
              "aria-current": re ? "true" : void 0,
              "data-selected-timeline-group": re ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: x.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: oe
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
                B ? n(tn, { key: "states", counts: x.counts }) : null
              ] : null
            )
          ]);
          const F = h.lane, ie = Ql(h.laneIndex), N = F.markers.some(({ segment: G }) => G.id === s);
          return n("div", {
            key: h.key,
            "data-grouped-swimlane": x.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${me}rem minmax(0,1fr)`,
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
              style: Zl(N, ie),
              title: `${Yn(F)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Yn(F),
              onClick: (G) => {
                (G.metaKey || G.ctrlKey) && y(F.markers.map((X) => X.segment.id));
              },
              onMouseEnter: () => A(F.key),
              onMouseLeave: () => A((G) => G === F.key ? null : G)
            }, [
              F.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (G) => {
                  G.stopPropagation(), M({ tagId: F.tagId, tagName: F.label, trigger: G.currentTarget });
                },
                "aria-label": `Configure ${F.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: D === F.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, F.label),
              (_ = F.performers) != null && _.length ? n(Tr, {
                key: "performers",
                performers: F.performers,
                performerAssignments: F.performerAssignments
              }) : null,
              B ? n(tn, { key: "counts", counts: F.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, F.markers.map(({ segment: G, track: X }) => {
              var ut;
              const se = Qr(G.startSec, ue), Te = G.endSec == null ? G.startSec : Math.max(G.startSec, G.endSec), $e = Math.max(0, Qr(Te, ue) - se), it = l.includes(G.id), Le = G.id === s, Me = yo(z.get(G.id)), We = G.endSec == null ? Re(G.startSec) : `${Re(G.startSec)} – ${Re(G.endSec)}`, at = (ut = gi[Me]) == null ? void 0 : ut.label;
              return n("button", {
                key: G.id,
                type: "button",
                onClick: (Je) => {
                  Je.stopPropagation(), f(G, {
                    additive: Je.metaKey || Je.ctrlKey,
                    rangeSegmentIds: Je.shiftKey ? F.markers.map((mt) => mt.segment.id) : null
                  });
                },
                "aria-pressed": it,
                "aria-current": Le ? "true" : void 0,
                "data-selected-timeline-marker": Le ? "true" : void 0,
                "data-selected-segment-shortcut-target": Le ? "true" : void 0,
                "aria-label": B ? `${G.tagName || "Tag segment"}${F.performerLabel ? `, ${F.performerLabel}` : ""}, ${G.reviewState}${at ? `, ${at}` : ""}, ${We}` : `${G.tagName || "Tag segment"}${F.performerLabel ? `, ${F.performerLabel}` : ""}, ${We}`,
                title: B ? `${G.tagName || "Tag segment"}${F.performerLabel ? ` · ${F.performerLabel}` : ""} · ${G.reviewState}${at ? ` · ${at}` : ""} · ${We}` : `${G.tagName || "Tag segment"}${F.performerLabel ? ` · ${F.performerLabel}` : ""} · ${We}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...B ? Vl(G.reviewState, it, Me, Le) : Jl(it, Le),
                  left: `${se}%`,
                  top: `${Xl(X)}rem`,
                  width: Yl(G.endSec, $e),
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
  const [a, s] = K(null), [l, d] = K([]), [c, m] = K(null), [u, b] = K(""), [p, f] = K(!0), [y, w] = K(null), [M, g] = K(""), [U, B] = K(!1), H = pe(null), q = pe(0);
  fe(() => {
    const D = requestAnimationFrame(() => {
      var A;
      return (A = H.current) == null ? void 0 : A.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(D);
  }, [e]), fe(() => {
    const D = new AbortController();
    return f(!0), g(""), Promise.all([
      r ? Q(`/slot-definitions/${e}`, { signal: D.signal }) : Promise.resolve(null),
      Q("/segment-groups", { signal: D.signal })
    ]).then(([A, P]) => {
      const z = P.find((Z) => (Z.tags || []).some((ge) => Number(ge.tagId) === Number(e)));
      s(A), d(P), m((z == null ? void 0 : z.id) ?? null), b(z == null ? "" : String(z.id)), B(!1);
    }).catch((A) => {
      A.name !== "AbortError" && g(A.message || "Unable to load tag configuration.");
    }).finally(() => {
      D.signal.aborted || f(!1);
    }), () => D.abort();
  }, [r, e]);
  function L(D, A) {
    s({
      ...a,
      definitions: a.definitions.map((P, z) => z === D ? { ...P, ...A } : P)
    });
  }
  function T(D, A) {
    const P = D + A;
    if (P < 0 || P >= a.definitions.length) return;
    const z = [...a.definitions];
    [z[D], z[P]] = [z[P], z[D]], s({
      ...a,
      definitions: z.map((Z, ge) => ({ ...Z, sortOrder: ge }))
    });
  }
  function S(D) {
    const A = a.definitions[D], P = Number(A.assignmentCount) || 0, z = P === 0 ? "" : ` and its ${P} assignment${P === 1 ? "" : "s"}`;
    window.confirm(`Delete “${It(A)}”${z}?`) && (P > 0 && B(!0), s({
      ...a,
      definitions: a.definitions.filter((Z, ge) => ge !== D).map((Z, ge) => ({ ...Z, sortOrder: ge }))
    }));
  }
  async function k() {
    var A;
    w("slots"), g("Saving performer slots…");
    let D;
    try {
      D = await Q(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: U,
          definitions: a.definitions.map((P, z) => {
            var Z;
            return {
              id: P.id || void 0,
              label: ((Z = P.label) == null ? void 0 : Z.trim()) || null,
              sortOrder: z,
              genderHints: P.genderHints || []
            };
          })
        })
      }), s(D), B(!1);
    } catch (P) {
      P.status === 409 ? (g("Performer slots changed elsewhere; current values were reloaded."), (A = P.payload) != null && A.current && (s(P.payload.current), B(!1))) : g(P.message || "Unable to save performer slots."), w(null);
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
  async function C() {
    const D = u === "" ? null : Number(u);
    if (D !== c) {
      w("group"), g("Saving tag group…");
      try {
        await Q(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: D })
        });
      } catch (A) {
        g(A.message || "Unable to assign the tag group."), w(null);
        return;
      }
      try {
        const [A, P] = await Promise.allSettled([
          Q("/segment-groups"),
          o()
        ]);
        if (A.status === "fulfilled") {
          d(A.value);
          const z = A.value.find((ge) => (ge.tags || []).some((be) => Number(be.tagId) === Number(e))), Z = (z == null ? void 0 : z.id) ?? null;
          m(Z), b(Z == null ? "" : String(Z));
        }
        g(
          A.status === "fulfilled" && P.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        w(null);
      }
    }
  }
  l.find((D) => Number(D.id) === Number(c));
  const W = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (D) => {
      D.target === D.currentTarget && !y && i();
    },
    onKeyDownCapture: (D) => Rt(D, {
      onCancel: y ? void 0 : i
    })
  }, n("section", {
    ref: H,
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
        p ? null : n("label", { key: "choice", className: "block space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Assigned group"),
          n("select", {
            key: "select",
            value: u,
            disabled: y != null,
            onChange: (D) => b(D.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((D) => n("option", { key: D.id, value: String(D.id) }, D.name))
          ])
        ]),
        p ? null : n("button", {
          key: "save",
          type: "button",
          disabled: y != null || (u === "" ? null : Number(u)) === c,
          onClick: C,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, y === "group" ? "Saving…" : "Save tag group")
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
              disabled: y != null,
              onChange: (D) => s({ ...a, allowSamePerformerInMultipleSlots: D.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((D, A) => n("article", {
            key: D.id || D._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: D.label || "",
                disabled: y != null,
                onChange: (P) => L(A, { label: P.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, $s.map((P) => n("label", { key: P, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: y != null,
                  checked: (D.genderHints || []).includes(P),
                  onChange: (z) => L(A, {
                    genderHints: z.target.checked ? [.../* @__PURE__ */ new Set([...D.genderHints || [], P])] : (D.genderHints || []).filter((Z) => Z !== P)
                  })
                }),
                n("span", { key: "text" }, $r(P))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${D.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: y != null || A === 0, onClick: () => T(A, -1), className: W, "aria-label": `Move ${It(D)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: y != null || A === a.definitions.length - 1, onClick: () => T(A, 1), className: W, "aria-label": `Move ${It(D)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: y != null, onClick: () => S(A), className: `${W} text-red-300` }, "Delete")
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
              className: W
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
      M ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, M) : null
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
function Cc(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function $c(e) {
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, analysisError: i, analysisRun: a, analysisStatus: s, approvalFacetCounts: l, autoAssignCandidates: d, autoAssignError: c, autoAssignOpen: m, autoAssignPerformers: u, autoAssigning: b, cancelQueuedReviewsForSegments: p, canMoveSelectionToBin: f, captureTrainingExport: y, centerTimelineRef: w, closeEditorFilters: M, closeFirstSegmentTagDialog: g, closeMaterializeDialog: U, closeMergeConfirmation: B, closePublishApprovedDialog: H, closeTagEditing: q, collapsedSegmentGroups: L, commonActionsRef: T, compatibilityMode: S, configuringTag: k, createSegment: C, creatingSegmentId: W, currentTime: D, deleteRejectedSegments: A, detail: P, detailPanelRef: z, detailWidth: Z, duplicateSegment: ge, editorFilters: be, editorLayout: ue, editorRef: R, exportingExamples: ae, filtersButtonRef: me, filtersOpen: J, firstSegmentTagOpen: ye, focusRowRef: ve, handleSeparatorKeyDown: te, handleSeparatorPointerDown: he, handleSeparatorPointerMove: ne, hasNextUnreviewed: Y, hasPreviousUnreviewed: ce, hideDerivedSegments: E, history: ee, historyOpen: $, historySaving: v, horizontalLayoutSize: h, importNativeSegments: x, incorrectExamples: O, incorrectExamplesOpen: re, lineage: oe, markerRailWidth: F, materializeButtonRef: ie, materializeCancelButtonRef: N, materializeDerivedSegments: _, materializeError: G, materializeLoading: X, materializeOpen: se, materializePreview: Te, materializing: $e, mediaStackRef: it, mergeCancelButtonRef: Le, mergeConfirmation: Me, mergeSaving: We, mergeSelectedSwimlane: at, nativeImportState: ut, onDetailChange: Je, onNavigate: mt, onReload: ft, onSlotsChanged: Pe, openPublishApprovedDialog: Ye, panelSeparatorProps: Ue, pendingInitialSeekRef: _e, performerSlots: Ze, performerSlotsAvailable: V, playbackControlsRef: de, previewDerivedSegments: Ne, provenance: Ae, provenanceSources: xe, publishApprovedCancelButtonRef: Xe, publishApprovedDrafts: Be, publishApprovedError: Qe, publishApprovedOpen: ke, quickSearchOpen: Ke, railScrollRef: Oe, railToggleRef: we, recordHistoryAction: Ge, rejectedDeletionPreview: st, removeIncorrectExample: Se, removingExampleId: Fe, restoreHistoryTarget: De, runEditorAction: Dt, saveMessage: nt, saveTag: gt, saveTiming: Kt, savingSegmentId: et, seekRef: Ie, segmentGroups: Ce, segmentRailLayout: Ve, segments: pt, selectAllVideoSegments: lt, selectSegment: Ot, selectSegmentCollection: Ct, selectedGroups: Pt, selectedPerformerSlots: pn, selectedSegment: Lt, selectedSegmentGroupKey: rn, selectedSegmentIds: er, selectedSegments: on, selectedSlotStatus: On, setAutoAssignError: tr, setAutoAssignOpen: fn, setConfiguringTag: Qt, setCurrentTime: yn, setEditorFilters: nr, setEditorLayout: Rr, setFiltersOpen: rr, setHideDerivedSegments: Mr, setHistoryOpen: an, setIncorrectExamplesOpen: bn, setQuickSearchOpen: Pn, setRailViewport: hn, setRejectedDeletionPreview: Er, setSaveMessage: or, setSelectedSegmentGroupKey: vn, setSelectedSegmentId: sn, setShortcutsOpen: xn, setTimelineZoom: Ln, shotBoundaries: St, shortcutsOpen: ar, slotButtonRef: Fn, splitLayout: zt, splitSegment: ir, startFullAnalysis: Sn, stepVideoFrame: kn, tagEditing: Dr, tagSearchRef: Or, timelineDuration: jn, timelineRatioBounds: wn, timelineZoom: Bn, toggleSegmentGroup: ot, toggleSegmentRail: bt, updateTimelineRatio: Pr, video: yt, videoPerformers: Ft, visibleCounts: $t, visibleSegmentRailRows: Lr, visibleSegments: Nn, wideLayout: Vt, workspaceRef: Gn } = e, Un = qe(
    () => pt.filter((I) => !I.published && I.reviewState === "approved"),
    [pt]
  ), sr = ws(io), In = Un.length, lr = pe(null), Fr = qe(() => () => an(!1), [an]), Ht = Te ? Te.createCount + Te.linkCount : null, ht = et != null, ln = on.length > 0, Kn = on.length === 1, jr = ln && on.every((I) => I.reviewState === "approved"), Br = ln && on.every((I) => I.reviewState === "rejected"), Gr = [
    { id: "marker.create", label: "New segment", disabled: ht },
    { id: "marker.editTag", label: "Edit tag", disabled: ht || !ln },
    { id: "marker.setStart", label: "Set start", disabled: ht || !Kn },
    { id: "marker.setEnd", label: "Set end", disabled: ht || !Kn },
    { id: "marker.split", label: "Split", disabled: ht || !Kn },
    ...S ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !ce, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: jr ? "Unapprove" : "Approve", disabled: ht || !ln, tone: "approve" },
      { id: "marker.reject", label: Br ? "Unreject" : "Reject", disabled: ht || !ln, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !Y, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...S ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: ht || !f, tone: "reject" }
    ]
  ];
  function kt(I) {
    const Ee = er.includes(I.id), xt = I.id === (Lt == null ? void 0 : Lt.id), vt = I.endSec == null ? Re(I.startSec) : `${Re(I.startSec)} – ${Re(I.endSec)}`, Zt = `${Ut(I.sourceKey)}${I.confidence != null ? ` · ${Math.round(I.confidence * 100)}%` : ""}`;
    return n("button", {
      key: I.id,
      type: "button",
      onClick: (qt) => Ot(I, { additive: qt.metaKey || qt.ctrlKey }),
      "aria-pressed": Ee,
      "aria-current": xt ? "true" : void 0,
      "data-selected-segment-shortcut-target": xt ? "true" : void 0,
      "aria-label": S ? `${I.tagName || "Tag segment"}, ${I.reviewState}${I.isDerived ? ", derived segment" : ""}, ${vt}` : `${I.tagName || "Tag segment"}${I.isDerived ? ", derived segment" : ""}, ${vt}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: mi(Ee, xt)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        S ? n(gn, { key: "review", state: I.reviewState, includeLabel: !1 }) : null,
        I.isDerived ? n(Ar, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          I.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, vt),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: Zt
        }, Zt)
      ])
    ]);
  }
  const rt = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", dn = [...ee.actions || []].reverse().find((I) => I.sequence <= ee.cursorSequence);
  return n("section", {
    ref: R,
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
            onClick: (I) => Ti(I, mt, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${yt.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: yt.title || `Video ${yt.id}`
          }, yt.title || `Video ${yt.id}`)),
          ...Ft.map((I) => n(Qn, {
            key: ct(I),
            performer: { id: ct(I), name: I.name },
            compact: !0,
            tooltip: I.name
          })),
          S ? n(tn, { key: "review-counts", counts: $t }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          S ? null : n(Mi, { key: "bin", onNavigate: mt, compact: !0 }),
          n(Ei, { key: "settings", onNavigate: mt, compact: !0 })
        ])
      ]),
      S && P.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${P.nativeImportCount} Cove segment${P.nativeImportCount === 1 ? "" : "s"} ${P.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        ut.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, ut.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
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
        ut.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, ut.error) : null
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
              onClick: () => Sn(),
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
              ].map(([I, Ee]) => n("button", {
                key: I,
                type: "button",
                disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
                onClick: (xt) => {
                  var vt;
                  (vt = xt.currentTarget.closest("details")) == null || vt.removeAttribute("open"), Sn(Ee);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, I)))
            ])
          ]) : null,
          S ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: et != null || d.length === 0,
            onClick: () => {
              tr(""), fn(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${d.length ? ` (${d.length})` : ""}`) : null,
          S ? n("button", {
            key: "materialize-derived",
            ref: ie,
            type: "button",
            disabled: et != null || X || $e || Ht === 0,
            onClick: Ne,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, X ? "Analyzing…" : `Auto-Materialize${Ht != null ? ` (${Ht})` : ""}`) : null,
          S ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: et != null || In === 0,
            onClick: (I) => Ye(I.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": ke,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${In ? ` (${In})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: ae || Fe != null || O.length === 0,
            onClick: () => bn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": re,
            "aria-label": `Open AI feedback collection, ${O.length} example${O.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${O.length ? ` (${O.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: me,
            type: "button",
            onClick: () => rr(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": J,
            className: `${rt} ${r ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(yr, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${r ? ` (${r})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => xn(!0),
            className: rt
          }, [n(yr, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            ref: lr,
            type: "button",
            disabled: (S ? ee.actions.length === 0 : dn == null) || et != null || v,
            onClick: S ? () => an((I) => !I) : () => De(
              dn.sequence - 1
            ),
            "aria-controls": S ? Di : void 0,
            "aria-expanded": S ? $ : void 0,
            className: rt
          }, [
            n(yr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, S ? `History${ee.actions.length ? ` (${ee.actions.length})` : ""}` : dn ? `Undo ${dn.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: we,
            type: "button",
            onClick: bt,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": ue.markerRailOpen,
            className: rt
          }, [
            n(yr, { key: "icon", name: "list" }),
            n("span", { key: "label" }, ue.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ]),
      S && $ ? n(gc, {
        key: "history-popover",
        history: ee,
        historySaving: v,
        anchorRef: lr,
        onRestore: De,
        onClose: Fr
      }) : null
    ]),
    J ? n(mc, {
      key: "editor-filters",
      filters: be,
      hideDerivedSegments: E,
      performers: Ft,
      provenanceSources: xe,
      reviewCounts: l,
      segments: pt,
      segmentGroups: Ce,
      reviewMode: S,
      onChange: nr,
      onHideDerivedChange: Mr,
      onClose: M
    }) : null,
    ye ? n(uc, {
      key: "first-segment-tag-dialog",
      saving: et != null,
      error: nt,
      onSelect: (I, Ee) => C(I, Ee),
      onClose: g
    }) : null,
    Ke ? n(yc, {
      key: "quick-search-dialog",
      segments: jl(o),
      onSelect: (I) => {
        Pn(!1), Ot(I, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        Pn(!1), requestAnimationFrame(() => {
          var I;
          return (I = R.current) == null ? void 0 : I.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    m ? n(vc, {
      key: "auto-assign-dialog",
      candidates: d,
      processing: b,
      error: c,
      onConfirm: u,
      onClose: () => fn(!1)
    }) : null,
    Me ? n(Sc, {
      key: "merge-selection-dialog",
      merge: Me,
      processing: We,
      undoable: !S,
      cancelButtonRef: Le,
      onConfirm: (I) => at(!0, I, Me),
      onClose: B
    }) : null,
    se ? n(wc, {
      key: "materialize-derived-dialog",
      preview: Te,
      loading: X,
      processing: $e,
      error: G,
      cancelButtonRef: N,
      onConfirm: _,
      onClose: () => {
        $e || U();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: Gn,
      className: `${zt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      ue.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: Vt ? { position: "absolute", top: 0, right: 0, width: F, height: h.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        pt.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : Nn.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: Oe,
          onScroll: (I) => hn({
            scrollTop: I.currentTarget.scrollTop,
            height: I.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: Ve.height }
        }, Lr.map((I) => {
          var xt;
          let Ee;
          if (I.kind === "group") {
            const vt = L.includes(I.group.key), Zt = I.group.lanes.reduce((qt, Ur) => qt + Ur.markers.length, 0);
            Ee = n("button", {
              type: "button",
              onClick: () => {
                vn(I.group.key), ot(I.group.key);
              },
              "aria-expanded": !vt,
              "aria-current": rn === I.group.key ? "true" : void 0,
              "data-segment-rail-group": I.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${rn === I.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, vt ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: I.group.name }, I.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Zt),
              S && vt ? n(tn, { key: "states", counts: I.group.counts }) : null
            ]);
          } else I.kind === "lane" ? Ee = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Yn(I.lane),
            "aria-label": Yn(I.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, I.lane.label),
            (xt = I.lane.performers) != null && xt.length ? n(Tr, {
              key: "performers",
              performers: I.lane.performers,
              performerAssignments: I.lane.performerAssignments
            }) : null,
            S ? n(tn, { key: "states", counts: I.lane.counts }) : null
          ]) : Ee = kt(I.segment);
          return n("div", {
            key: I.key,
            className: "absolute left-0 right-0",
            style: { top: I.top, height: I.height }
          }, Ee);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${zt ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: it,
          className: `${zt ? "min-h-0 flex-1" : ""} grid`,
          style: zt ? {
            gridTemplateRows: `minmax(16rem, ${(1 - ue.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${ue.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: ve,
            className: "grid min-h-0 gap-2",
            style: Vt ? {
              gridTemplateColumns: ue.markerRailOpen ? `${Z}px 0.5rem minmax(0,1fr) 0.5rem ${F}px` : `${Z}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(Nc, {
              key: "tools",
              compatibilityMode: S,
              selectedSegment: Lt,
              selectedSegments: on,
              selectedGroups: Pt,
              saveMessage: nt,
              savingSegmentId: et,
              creatingSegmentId: W,
              acquireSaveLock: t,
              setSaveMessage: or,
              saveTag: gt,
              slotStatus: On,
              performerSlotsAvailable: V,
              selectedPerformerSlots: pn,
              performerSlots: Ze,
              detail: P,
              onDetailChange: Je,
              onCancelQueuedReview: p,
              video: yt,
              slotButtonRef: Fn,
              tagSearchRef: Or,
              tagEditing: Dr,
              onCancelTagEditing: q,
              detailPanelRef: z,
              onReduceSelection: (I) => {
                Ot(I), requestAnimationFrame(() => {
                  var Ee;
                  return (Ee = z.current) == null ? void 0 : Ee.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Kt,
              onSlotsChanged: Pe,
              onRecordHistory: Ge,
              splitSegment: ir,
              duplicateSegment: ge,
              provenance: Ae,
              lineage: oe,
              onNavigateLineageItem: (I) => {
                const Ee = pt.find((xt) => xt.itemId === I);
                Ee && sn(Ee.id);
              }
            }),
            Vt ? n(
              "div",
              { key: "detail-separator", ...Ue("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            yt.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Ea, {
                streamUrl: `/api/stream/video/${yt.id}`,
                posterUrl: `/api/stream/video/${yt.id}/screenshot?v=${encodeURIComponent(yt.updatedAt || "")}`,
                format: yt.videoFile.format,
                audioCodec: yt.videoFile.audioCodec,
                duration: yt.videoFile.duration,
                videoId: yt.id,
                trackingEnabled: !1,
                onSeekRegister: (I) => {
                  Ie.current = I, Ol(_e.current, pt, I) && (_e.current = null);
                },
                onPlaybackControlRegister: (I) => {
                  de.current = I;
                },
                onTimeUpdate: yn
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            Vt && ue.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...Ue("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Vt && ue.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: T,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...Gr.map((I) => {
              var vt;
              const Ee = (vt = sr[I.id]) == null ? void 0 : vt[0], xt = I.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : I.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: I.id,
                type: "button",
                disabled: I.disabled,
                "data-action-id": I.id,
                onClick: (Zt) => {
                  const qt = Zt.currentTarget;
                  Dt(I.id, { target: qt, preserveFocus: !0 }), I.focusWhenDisabled && requestAnimationFrame(() => {
                    Cc(qt, T.current, I.focusWhenDisabled);
                  });
                },
                title: Ee ? `${I.label} (${Ee})` : I.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${xt}`
              }, [
                n("span", { key: "label" }, I.label),
                Ee ? n("kbd", {
                  key: "shortcut",
                  className: "rounded border border-border/70 bg-background/70 px-1 py-0.5 font-mono text-[10px] leading-none text-secondary"
                }, Ee) : null
              ]);
            }),
            n("div", { key: "frame-actions", className: "ml-auto flex items-center gap-1" }, [
              n("button", {
                key: "previous-frame",
                type: "button",
                disabled: !yt.videoFile,
                onClick: () => kn(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(Ns, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !yt.videoFile,
                onClick: () => kn(1),
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
            "aria-valuemin": Math.round(wn.minimum * 100),
            "aria-valuemax": Math.round(wn.maximum * 100),
            "aria-valuenow": Math.round(ue.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(ue.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: he,
            onPointerMove: ne,
            onKeyDown: te,
            onDoubleClick: () => Pr(At.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: zt ? void 0 : { height: "20rem" } }, n(Ic, {
            segments: Nn,
            shotBoundaries: St,
            segmentGroups: Ce,
            performerSlots: Ze,
            collapsedGroupKeys: L,
            selectedGroupKey: rn,
            selectedSegmentId: Lt == null ? void 0 : Lt.id,
            selectedSegmentIds: er,
            duration: jn,
            currentTime: D,
            zoom: Bn,
            onZoomChange: Ln,
            onSelectGroup: vn,
            onToggleGroup: ot,
            onSelect: (I, Ee) => Ot(I, Ee),
            onSelectSegments: Ct,
            onSelectAll: lt,
            onConfigureTag: (I) => Qt(I),
            onSeekTime: (I) => {
              var Ee;
              return (Ee = Ie.current) == null ? void 0 : Ee.call(Ie, I, !1);
            },
            centerRef: w,
            showReviewState: S,
            swimlaneTitleWidth: ue.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (I) => Rr((Ee) => ({ ...Ee, swimlaneTitleWidth: I }))
          }))
        ])
      ])
    ]),
    k ? n(xo, {
      key: `configure-tag:${k.tagId}`,
      tagId: k.tagId,
      tagName: k.tagName,
      performerSlotsEnabled: S,
      onSaved: ft,
      onClose: () => {
        const I = k.trigger;
        Qt(null), requestAnimationFrame(() => {
          var Ee;
          I != null && I.isConnected ? I.focus({ preventScroll: !0 }) : (Ee = R.current) == null || Ee.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    ke ? n(hc, {
      key: "publish-approved-dialog",
      drafts: Un,
      processing: et === -1,
      error: Qe,
      cancelButtonRef: Xe,
      onConfirm: Be,
      onClose: H
    }) : null,
    st ? n(xc, {
      key: "rejected-deletion-dialog",
      preview: st,
      onConfirm: () => {
        A(st), requestAnimationFrame(() => {
          var I;
          return (I = R.current) == null ? void 0 : I.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Er(null), requestAnimationFrame(() => {
          var I;
          return (I = R.current) == null ? void 0 : I.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    ar ? n(pc, {
      key: "shortcuts-dialog",
      reviewMode: S,
      bindings: sr,
      onClose: () => xn(!1)
    }) : null,
    re ? n(fc, {
      key: "incorrect-examples-dialog",
      examples: O,
      exporting: ae,
      removingExampleId: Fe,
      onExport: y,
      onRemove: Se,
      onClose: () => bn(!1)
    }) : null
  ]);
}
function Tc(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: m, setCollapsedSegmentGroups: u, setEditorFilters: b, setHideDerivedSegments: p, setSaveMessage: f, setSelectedSegmentGroupKey: y, setSelectedSegmentId: w, setSelectedSegmentIds: M } = e;
  function g(L) {
    const T = Bt(t, L);
    T && u((S) => xi(S, T));
  }
  function U(L) {
    w(L), M(L == null ? [] : [L]), c.current = L, m.current = [];
  }
  function B(L, {
    focusEditor: T = !1,
    seekToSegment: S = !1,
    additive: k = !1,
    rangeSegmentIds: C = null
  } = {}) {
    var D, A;
    const W = Zs({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: m.current
    }, L.id, C, k);
    M(W.selectedSegmentIds), w(W.activeSegmentId), c.current = W.anchorSegmentId, m.current = W.rangeBaseSegmentIds, W.activeSegmentId != null && y(Bt(t, W.activeSegmentId)), g(L.id), T && ((D = r.current) == null || D.focus({ preventScroll: !0 })), S && ((A = i.current) == null || A.call(i, L.startSec, !1));
  }
  function H(L) {
    const T = Ys(
      d,
      l,
      L
    );
    M(T.selectedSegmentIds), w(T.activeSegmentId), c.current = T.activeSegmentId, m.current = [], T.activeSegmentId != null && (y(Bt(t, T.activeSegmentId)), g(T.activeSegmentId));
  }
  function q() {
    var S;
    const L = el(s), T = L.includes(l) ? l : L[0] ?? null;
    b(Et({})), p(!1), M(L), w(T), c.current = T, m.current = [], T != null && y(Bt(
      un(s, a, o),
      T
    )), f(L.length === 0 ? "There are no segments to select." : `${L.length} segments selected. Collapsed Segment groups keep their selected segments.`), (S = r.current) == null || S.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: g, replaceSegmentSelection: U, selectSegment: B, selectSegmentCollection: H, selectAllVideoSegments: q };
}
function Ac(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, stableSaveIdentity: c, historyRef: m, onConflict: u, onDetailChange: b, onReload: p, recordHistoryAction: f, revealSegmentGroupForSelection: y, savingSegmentId: w, selectedGroups: M, selectedSegment: g, selectedSegmentIdRef: U, selectedSegments: B, selectionAnchorIdRef: H, selectionRangeBaseIdsRef: q, setMergeConfirmation: L, setSaveMessage: T, setSelectedSegmentId: S, setSelectedSegmentIds: k, video: C } = e;
  function W() {
    L(null), requestAnimationFrame(() => {
      var z;
      return (z = a.current) == null ? void 0 : z.focus({ preventScroll: !0 });
    });
  }
  async function D(z = !1, Z = !1, ge = null) {
    if (w != null) return;
    const be = ge || hi(
      M,
      { nativeOnly: !o }
    );
    if (!be) {
      T("Select at least two segments from one swimlane.");
      return;
    }
    if (!z && Wa()) {
      L(be);
      return;
    }
    Z && Va(!1);
    const ue = be.endSec == null ? "open end" : Re(be.endSec);
    let R = be.segments[0];
    const ae = o ? null : Mt(be.segments, !1), me = o ? null : crypto.randomUUID(), J = be.segments.map((ne) => ne.id), ye = Md(i, be.segments).segments.find((ne) => ne.id === R.id), ve = {
      startSec: ye.startSec,
      endSec: ye.endSec,
      sourceKey: ye.sourceKey,
      sourceRunId: ye.sourceRunId,
      confidence: ye.confidence,
      isDerived: ye.isDerived
    }, te = r("merge", be.segments[0].id);
    if (!te) return;
    W();
    const he = _t();
    s({
      type: "add",
      entry: { id: he, op: "merge", targets: be.segments.map(Tt), values: ve }
    }), k([R.id]), S(R.id), H.current = R.id, q.current = [];
    try {
      const ne = be.segments.slice(1);
      if (!o || R.nativeSegmentId != null) {
        const Y = ne.map((E) => {
          const ee = `merge-native-selection:${C.id}:${R.id}:${E.id}:${R.updatedAt}:${E.updatedAt}`;
          return { key: ee, operationId: ze(ee), segmentId: E.id, expectedUpdatedAt: E.updatedAt };
        }), ce = await Q(`/videos/${C.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: R.id,
            expectedSurvivorUpdatedAt: R.updatedAt,
            consumedSegments: Y.map(({ key: E, ...ee }) => ee),
            historyReceiptId: me
          })
        });
        R = ce.survivor, b((E) => ua(E, ce), C.id), s({ type: "confirm", key: he, applied: !0 }), Y.forEach(({ key: E }) => He(E));
      } else {
        const Y = ne.map((E) => {
          const ee = `merge-draft-selection:${C.id}:${R.itemId}:${E.itemId}:${R.revision}:${E.revision}`;
          return { key: ee, operationId: ze(ee), itemId: E.itemId, expectedRevision: E.revision };
        }), ce = await Q(`/videos/${C.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: R.itemId,
            expectedSurvivorRevision: R.revision,
            consumedDrafts: Y.map(({ key: E, ...ee }) => ee)
          })
        });
        R = ce.survivor, b((E) => ua(E, ce), C.id), s({ type: "confirm", key: he, applied: !0 }), Y.forEach(({ key: E }) => He(E));
      }
      k([R.id]), S(R.id), H.current = R.id, q.current = [], o ? t(Jt) : await f(
        "segments.merge",
        `Merged ${be.segments.length} segments`,
        ae,
        Mt([R], !1),
        me
      ), y(R.id), T(`${be.segments.length} segments merged into ${Re(be.startSec)} – ${ue}.`);
    } catch (ne) {
      s({ type: "discard", key: he }), k(J), S((g == null ? void 0 : g.id) ?? J[0] ?? null), H.current = (g == null ? void 0 : g.id) ?? J[0] ?? null, q.current = [], ne.status === 409 ? await u() : T(ne.message || "Unable to merge selected segments.");
    } finally {
      te();
    }
  }
  function A(z, Z = B, ge = g) {
    if (Z.length === 0) return Promise.resolve(null);
    const be = gl(z, Z, ge), ue = Math.max(0, be.identities.indexOf(be.activeIdentity)), R = d(), ae = ki(R) != null || R.queued.some((J) => ho(J.targets, be.identities.map(c))), me = l({
      kind: "review",
      lockId: be.activeIdentity.id,
      targets: be.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (J) => P(J, {
        ...be,
        identities: J.targets,
        activeIdentity: J.targets[ue]
      })
    });
    return me ? (ae && T(`${z === "approved" ? "Approval" : "Rejection"} queued…`), me.done) : (T("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function P({ detail: z, segments: Z, onConflict: ge, onReload: be }, ue) {
    var ce;
    const R = pl(ue, Z);
    if (!R) {
      T("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: ae, selectedSegments: me, selectedSegment: J } = R, ye = ml(me, ae), ve = me.filter((E) => E.reviewState !== ye);
    if (ve.length === 0) return;
    const te = me.map((E) => ({
      id: E.id,
      itemId: E.itemId,
      nativeSegmentId: E.nativeSegmentId
    })), he = te.find((E) => E.id === (J == null ? void 0 : J.id)) || te[0], ne = (E, ee = !1) => {
      if (!(E != null && E.segments) || !ee && !eo(U.current, he.id))
        return;
      const $ = te.map((h) => tt(E == null ? void 0 : E.segments, h)).filter(Boolean), v = tt(E == null ? void 0 : E.segments, he) || $[0] || null;
      k($.map((h) => h.id)), S((v == null ? void 0 : v.id) ?? null), H.current = (v == null ? void 0 : v.id) ?? null, q.current = [];
    };
    T(`Updating ${ve.length} selected segment${ve.length === 1 ? "" : "s"}…`);
    const Y = _t();
    s({
      type: "add",
      entry: { id: Y, op: "patch", targets: ve.map(Tt), values: { reviewState: ye } }
    });
    try {
      const E = await Q(`/videos/${C.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: m.current.revision,
          reviewState: ye,
          segments: me.map((h) => h.published ? {
            nativeSegmentId: h.nativeSegmentId,
            expectedUpdatedAt: h.updatedAt
          } : {
            itemId: h.itemId,
            expectedRevision: h.revision
          })
        })
      }), ee = new Map((E.items || []).map((h) => [
        h.requestedNativeSegmentId != null ? `native:${h.requestedNativeSegmentId}` : `item:${h.requestedItemId}`,
        h
      ]));
      if (te.forEach((h) => {
        const x = ee.get(h.nativeSegmentId != null ? `native:${h.nativeSegmentId}` : `item:${h.itemId}`);
        x && (h.nativeSegmentId = x.nativeSegmentId, h.itemId = x.itemId);
      }), E.history && t(E.history), ye === "rejected" || (E.items || []).some((h) => h.requestedNativeSegmentId != null && h.nativeSegmentId !== h.requestedNativeSegmentId)) {
        const h = await be();
        s({ type: "confirm", key: Y, applied: h != null }), ne(h), T(`${E.updatedCount} selected segment${E.updatedCount === 1 ? "" : "s"} ${ye === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const v = (h) => ({
        ...h,
        approvedSetVersion: E.approvedSetVersion || h.approvedSetVersion,
        segments: (h.segments || []).map((x) => {
          const O = ee.get(x.nativeSegmentId != null ? `native:${x.nativeSegmentId}` : `item:${x.itemId}`);
          return O ? {
            ...x,
            id: O.nativeSegmentId != null ? O.nativeSegmentId : -O.itemId,
            itemId: O.itemId,
            nativeSegmentId: O.nativeSegmentId,
            published: O.nativeSegmentId != null,
            reviewState: ye,
            revision: O.nativeSegmentId != null ? x.revision : O.revision,
            updatedAt: O.updatedAt
          } : x;
        })
      });
      b(v, C.id), s({ type: "confirm", key: Y, applied: !0 }), ne(v(z)), T(`${E.updatedCount} selected segment${E.updatedCount === 1 ? "" : "s"} ${ye === "approved" ? "approved" : ye === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (E) {
      s({ type: "discard", key: Y }), E.status === 409 && ((ce = E.payload) != null && ce.currentHistory) && t(E.payload.currentHistory);
      const ee = E.status === 409 ? await ge() : z;
      ne(ee, !0), T(E.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: W, mergeSelectedSwimlane: D, saveSelectedReviewState: A };
}
function Rc(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: m, detail: u, editorFilters: b, editorRef: p, cancelSaveTasks: f, dispatchPendingChanges: y, enqueueSave: w, stableSaveIdentity: M, exportingExamples: g, hideDerivedSegments: U, incorrectExamples: B, lineage: H, materializeButtonRef: q, materializePreview: L, materializeRestoreFocusRef: T, materializing: S, mutateSegment: k, runSegmentMutation: C, pendingChanges: W, onConflict: D, onDetailChange: A, onReload: P, performerSlots: z, recordHistoryAction: Z, refreshMaterializationPreview: ge, removingExampleId: be, revealSegmentGroupForSelection: ue, savingSegmentId: R, segmentGroups: ae, segments: me, selectedSegment: J, selectedSegmentIdRef: ye, selectedSegments: ve, selectionAnchorIdRef: te, selectionRangeBaseIdsRef: he, setAutoAssignError: ne, setAutoAssignOpen: Y, setAutoAssigning: ce, setEditorFilters: E, setExportingExamples: ee, setHideDerivedSegments: $, setIncorrectExamples: v, setMaterializeError: h, setMaterializeLoading: x, setMaterializeOpen: O, setMaterializePreview: re, setMaterializing: oe, setRejectedDeletionPreview: F, setRemovingExampleId: ie, setSaveMessage: N, setSelectedSegmentGroupKey: _, setSelectedSegmentId: G, setSelectedSegmentIds: X, video: se } = e;
  async function Te() {
    var we, Ge, st;
    if (ve.length === 0 || !J || R != null) return;
    const V = Nd(ve, B), de = V.segments;
    if (de.length === 0) return;
    const Ne = ve.map((Se) => ({
      id: Se.id,
      itemId: Se.itemId,
      nativeSegmentId: Se.nativeSegmentId
    })), Ae = Ne.find((Se) => Se.id === J.id) || Ne[0], xe = [], Xe = [];
    let Be = !1, Qe = u, ke = !1;
    const Ke = [], Oe = r("feedback", Ae.id);
    if (Oe) {
      N(V.action === "remove" ? `Removing ${de.length} selected incorrect example${de.length === 1 ? "" : "s"}…` : `Collecting ${de.length} selected segment${de.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const Se = async (Ie, Ce) => {
          const Ve = Ie.nativeSegmentId != null, pt = V.action === "remove" ? `incorrect-example-remove:${se.id}:${Ce == null ? void 0 : Ce.id}:${Ce == null ? void 0 : Ce.revision}:${Ce == null ? void 0 : Ce.representationRevision}` : `incorrect-example-collect:${se.id}:${Ve ? `native:${Ie.nativeSegmentId}:${Ie.updatedAt}` : `item:${Ie.itemId}:${Ie.revision}`}`;
          if (V.action === "remove" && !Ce)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let lt;
          try {
            lt = V.action === "remove" ? await Q(
              `/videos/${se.id}/incorrect-examples/${Ce.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: ze(pt),
                  expectedExampleRevision: Ce.revision,
                  expectedRepresentationRevision: Ce.representationRevision
                })
              }
            ) : await Q(`/videos/${se.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: ze(pt),
                nativeSegmentId: Ve ? Ie.nativeSegmentId : null,
                itemId: Ve ? null : Ie.itemId,
                expectedUpdatedAt: Ve ? Ie.updatedAt : null,
                expectedRevision: Ve ? null : Ie.revision
              })
            });
          } catch (Ot) {
            throw Ot.operationKey = pt, Ot;
          }
          if (!Id(V.action, lt))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return He(pt), lt;
        };
        for (const Ie of de) {
          const Ce = V.action === "remove" ? B.find((Ve) => Ve.itemId != null && Ve.itemId === Ie.itemId) : null;
          try {
            const Ve = Ne.find((Ct) => Ct.id === Ie.id);
            let pt = tt(
              Qe == null ? void 0 : Qe.segments,
              Ve
            ) || Ie, lt;
            try {
              lt = await Se(pt, Ce);
            } catch (Ct) {
              if (Ct.status === 409 && ((Ge = (we = Ct.payload) == null ? void 0 : we.result) == null ? void 0 : Ge.code) === "OPERATION_REPLAYED")
                Qe = await Q(
                  `/videos/${se.id}/editor`
                ), ke = !0, Ke.length = 0, He(Ct.operationKey), lt = Ct.payload.result;
              else {
                if (V.action !== "collect" || Ct.status !== 409) throw Ct;
                const Pt = await Q(
                  `/videos/${se.id}/editor`
                );
                Qe = Pt, ke = !0, Ke.length = 0;
                const pn = tt(
                  Pt == null ? void 0 : Pt.segments,
                  Ve
                );
                if (!pn) throw Ct;
                pt = pn, lt = await Se(pt, null);
              }
            }
            Ve && lt.itemId != null && (Ve.itemId = lt.itemId), Qe = vr(
              Qe,
              lt.editorDelta
            ), Ke.push(lt.editorDelta);
            const Ot = { segment: Ie, result: lt, example: Ce };
            xe.push(Ot);
          } catch (Ve) {
            if (Xe.push(Ve), ![400, 404, 409].includes(Ve.status)) break;
          }
        }
        if (c && xe.length > 0) {
          const Ie = V.action === "remove", Ce = xe.length;
          await Z(
            Ie ? "feedback.remove" : "feedback.collect",
            Ie ? `Removed ${Ce} incorrect AI example${Ce === 1 ? "" : "s"}` : `Collected ${Ce} incorrect AI example${Ce === 1 ? "" : "s"}`,
            pr(xe, Ie),
            pr(xe, !Ie)
          ) || (Be = !0);
        }
        xe.some(({ result: Ie }) => Ie.representation === "basicNativeBin") && Wn();
        const Fe = eo(
          ye.current,
          Ae.id
        ), De = V.action === "collect" && xe.some(({ segment: Ie }) => Ie.id === Ae.id), Dt = xe.map(({ segment: Ie }) => Ie.id), nt = De ? nl(
          o,
          Dt,
          Ae.id
        ) : null, gt = De ? (nt == null ? void 0 : nt.id) ?? null : Ae.id;
        Fe && De && (X(nt ? [nt.id] : []), G((nt == null ? void 0 : nt.id) ?? wr), te.current = (nt == null ? void 0 : nt.id) ?? null, he.current = []);
        const Kt = await Q(`/videos/${se.id}/incorrect-examples`);
        v(Kt);
        const et = Qe;
        if (A(ke ? et : (Ie) => Ke.reduce(vr, Ie), se.id), Fe && eo(
          ye.current,
          gt
        )) {
          let Ie, Ce;
          De ? (Ce = nt ? tt(et == null ? void 0 : et.segments, {
            id: nt.id,
            itemId: nt.itemId,
            nativeSegmentId: nt.nativeSegmentId
          }) : null, Ie = Ce ? [Ce] : []) : (Ie = Ne.map((Ve) => tt(et == null ? void 0 : et.segments, Ve)).filter(Boolean), Ce = tt(et == null ? void 0 : et.segments, Ae) || Ie[0] || null), X(Ie.map((Ve) => Ve.id)), G((Ce == null ? void 0 : Ce.id) ?? (De ? wr : null)), te.current = (Ce == null ? void 0 : Ce.id) ?? null, he.current = [], _(Ce ? Bt(o, Ce.id) : null), Ce && ue(Ce.id);
        }
        if (Xe.length > 0) {
          const Ie = ((st = Xe[0]) == null ? void 0 : st.message) || "Only segments with registered AI provenance can be collected.";
          xe.length === 0 ? N(Ie) : V.action === "remove" ? N(
            `Partially removed ${xe.length} of ${de.length} selected incorrect examples. ${Ie}`
          ) : N(
            `Partially collected ${xe.length} of ${de.length} selected segments. ${Ie}`
          );
        } else if (V.action === "remove")
          N(
            `${xe.length} incorrect example${xe.length === 1 ? "" : "s"} removed and ${xe.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const Ie = xe.filter(({ result: Ce }) => Ce.representation === "basicNativeBin").length;
          N(Ie === xe.length ? `${xe.length} incorrect AI example${xe.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${xe.length} incorrect AI example${xe.length === 1 ? "" : "s"} collected and ${xe.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        Be && N("The change saved, but editor history could not be updated.");
      } catch (Se) {
        N(Se.message || "Unable to update the selected incorrect examples.");
      } finally {
        Oe();
      }
    }
  }
  async function $e(V) {
    if (!V || be != null || g) return;
    const de = r("feedback", -1);
    if (!de) {
      N("Wait for the current save to finish before removing the incorrect example.");
      return;
    }
    try {
      await it(V);
    } finally {
      de();
    }
  }
  async function it(V) {
    var Ne, Ae;
    ie(V.id);
    const de = `incorrect-example-remove:${se.id}:${V.id}:${V.revision}:${V.representationRevision}`;
    try {
      let xe, Xe = !1;
      try {
        xe = await Q(
          `/videos/${se.id}/incorrect-examples/${V.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: ze(de),
              expectedExampleRevision: V.revision,
              expectedRepresentationRevision: V.representationRevision
            })
          }
        );
      } catch (ke) {
        if (ke.status !== 409 || ((Ae = (Ne = ke.payload) == null ? void 0 : Ne.result) == null ? void 0 : Ae.code) !== "OPERATION_REPLAYED")
          throw ke;
        xe = ke.payload.result, Xe = !0;
      }
      He(de);
      let Be = !0;
      if (c) {
        const Ke = [{ segment: tt(u.segments, {
          itemId: V.itemId
        }) || {
          id: V.itemId == null ? null : -V.itemId,
          itemId: V.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: V.representationRevision
        }, result: xe, example: V }];
        Be = await Z(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          pr(Ke, !0),
          pr(Ke, !1)
        );
      }
      const Qe = await Q(
        `/videos/${se.id}/incorrect-examples`
      );
      v(Qe), Xe ? await P() : A(
        (ke) => vr(ke, xe.editorDelta),
        se.id
      ), V.representation === "basicNativeBin" && Wn(), N(Be ? Xe ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : V.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (xe) {
      xe.status === 409 && await D(), N(xe.message || "Unable to remove the incorrect example.");
    } finally {
      ie(null);
    }
  }
  async function Le() {
    if (g || be != null || B.length === 0) return;
    ee(!0);
    const V = `incorrect-example-export:${se.id}:${B.map((de) => `${de.id}:${de.revision}:${de.representationRevision}`).join(",")}`;
    try {
      const de = await $d(
        se.id,
        B
      ), Ne = new FormData();
      Ne.append("metadata", JSON.stringify({
        operationId: ze(V),
        examples: de.captures
      }));
      for (const ke of de.files)
        Ne.append(ke.fieldName, ke.file);
      const Ae = await Q(
        `/videos/${se.id}/incorrect-examples/export`,
        { method: "POST", body: Ne }
      ), xe = await Hl(Ae.downloadUrl), Xe = URL.createObjectURL(xe.blob), Be = document.createElement("a");
      Be.href = Xe, Be.download = xe.fileName, Be.click(), setTimeout(() => URL.revokeObjectURL(Xe), 1e3);
      const Qe = await Q(
        `/training-exports/${Ae.id}/complete`,
        { method: "POST" }
      );
      He(V), v(await Q(
        `/videos/${se.id}/incorrect-examples`
      )), N(
        `Downloaded ${Ae.exampleCount} incorrect example${Ae.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Qe.clearedExampleCount} from the working collection.`
      );
    } catch (de) {
      N(de.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      ee(!1);
    }
  }
  async function Me(V = null) {
    const de = me.filter((we) => we.reviewState === "rejected"), Ne = de.length, Ae = B.some((we) => we.representation === "fullItem");
    if (V == null && Ne === 0 && !Ae) {
      N("There are no rejected segments to delete.");
      return;
    }
    if (V == null) {
      const we = r("delete-rejected", -1);
      if (!we) return;
      N("Preparing deletion summary…");
      try {
        const Ge = await Q(`/videos/${se.id}/rejected/deletion/preview`, { method: "POST" }), st = Number(Ge.deletedSegmentCount) || 0, Se = Number(Ge.deferredRejectedSegmentCount) || 0, Fe = Number(Ge.protectedIncorrectExampleCount) || 0;
        if (st === 0) {
          Se > 0 ? N(
            `${Se} feedback-protected rejected segment${Se === 1 ? "" : "s"} kept. ${Fe} AI feedback example${Fe === 1 ? "" : "s"} must be exported before ${Se === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : N("There are no rejected segments to delete.");
          return;
        }
        if (!li(Ge, N)) return;
        F(Ge), N("");
      } catch (Ge) {
        N(Ge.message || "Unable to prepare rejected segment deletion.");
      } finally {
        we();
      }
      return;
    }
    const xe = V, Xe = Number(xe.deferredRejectedSegmentCount) || 0, Be = ye.current, Qe = Xe === 0 ? Rd(u, de.map((we) => we.id)) : u, ke = Qe.segments.find((we) => we.reviewState === "unreviewed") || Qe.segments[0] || null, Ke = r("delete-rejected", -1);
    if (!Ke) return;
    F(null), N("Deleting rejected segments…");
    const Oe = Xe === 0 ? _t() : null;
    Oe && (y({
      type: "add",
      entry: { id: Oe, op: "remove", targets: de.map(Tt) }
    }), X(ke ? [ke.id] : []), G((ke == null ? void 0 : ke.id) ?? null), te.current = (ke == null ? void 0 : ke.id) ?? null, he.current = []);
    try {
      const we = `rejected-dependency-delete:${se.id}:${xe.fingerprint}`, Ge = await Q(`/videos/${se.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ze(we),
          fingerprint: xe.fingerprint
        })
      });
      He(we);
      const st = await P();
      Oe && y({ type: "confirm", key: Oe, applied: st != null }), Ge.deletedSegmentCount > 0 && t(Jt);
      const Se = Xe > 0 ? ` ${Xe} feedback-protected rejected segment${Xe === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      N(`${Ge.deletedSegmentCount} segment${Ge.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Se}`);
    } catch (we) {
      Oe && y({ type: "discard", key: Oe }), X(Be == null ? [] : [Be]), G(Be), te.current = Be, he.current = [], N(we.message || "Unable to delete rejected segments.");
    } finally {
      Ke();
    }
  }
  async function We(V = i) {
    if (a || V.length === 0) return;
    const de = r("auto-assign", -1);
    if (!de) {
      ne("Wait for the current save to finish before assigning performers.");
      return;
    }
    try {
      await at(V);
    } finally {
      de();
    }
  }
  async function at(V) {
    ce(!0), ne("");
    try {
      const de = await Q(`/videos/${se.id}/segments/auto-assign-performer-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeSegmentIds: V.flatMap((Ne) => Ne.nativeSegmentId == null ? [] : [Ne.nativeSegmentId]),
          itemIds: V.flatMap((Ne) => Ne.published || Ne.itemId == null ? [] : [Ne.itemId])
        })
      });
      Y(!1), await P(), N(`${de.assignedSegmentCount} segment${de.assignedSegmentCount === 1 ? "" : "s"} received ${de.assignedSlotCount} performer-slot assignment${de.assignedSlotCount === 1 ? "" : "s"}.`);
    } catch (de) {
      ne(de.message || "Unable to auto-assign performers.");
    } finally {
      ce(!1);
    }
  }
  async function ut() {
    O(!0), h(""), !L && (x(!0), ge());
  }
  function Je() {
    T.current = !0, O(!1), requestAnimationFrame(() => {
      var V;
      return (V = q.current) == null ? void 0 : V.focus({ preventScroll: !0 });
    });
  }
  async function mt() {
    if (!L || S || L.createCount + L.linkCount === 0)
      return;
    const V = r("materialize", -1);
    if (!V) {
      h("Wait for the current save to finish before materializing derived segments.");
      return;
    }
    try {
      await ft();
    } finally {
      V();
    }
  }
  async function ft() {
    oe(!0), h("");
    let V;
    try {
      const de = `materialize-derived:${se.id}:${L.fingerprint}`;
      V = await Q(`/videos/${se.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ze(de),
          fingerprint: L.fingerprint,
          maxDepth: 3
        })
      }), He(de);
    } catch (de) {
      de.status === 409 && re(null), h(de.message || "Unable to materialize derived segments."), oe(!1);
      return;
    }
    re((de) => de && { ...de, createCount: 0, linkCount: 0 });
    try {
      await P(), Je(), re(null);
      const de = V.createdCount + V.linkedCount;
      N(`${V.createdCount} derived segment${V.createdCount === 1 ? "" : "s"} created and ${V.linkedCount} existing segment${V.linkedCount === 1 ? "" : "s"} linked.`), de === 0 && N("Every applicable derivation was already materialized.");
    } catch {
      h("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    oe(!1);
  }
  async function Pe(V, de = null) {
    var xe, Xe, Be, Qe;
    const Ne = {
      tagId: V,
      ...de ? { tagName: de } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (ve.length > 1) {
      const ke = ve.filter((Se) => Se.tagId !== V);
      if (ke.length === 0) {
        d();
        return;
      }
      const Ke = ve.map((Se) => ({
        id: Se.id,
        itemId: Se.itemId,
        nativeSegmentId: Se.nativeSegmentId
      })), Oe = ve.map((Se) => !c || Se.nativeSegmentId != null ? `native:${Se.nativeSegmentId}:${Se.updatedAt}` : `item:${Se.itemId}:${Se.revision}`).sort().join(","), we = `bulk-tag:${se.id}:${V}:${Oe}`, Ge = r("tag", (J == null ? void 0 : J.id) ?? ke[0].id);
      if (!Ge) return;
      N(`Changing tag for ${ke.length} selected segment${ke.length === 1 ? "" : "s"}…`);
      const st = _t();
      y({
        type: "add",
        entry: { id: st, op: "patch", targets: ke.map(Tt), values: Ne }
      }), d();
      try {
        const Se = c ? null : crypto.randomUUID();
        await Q(`/videos/${se.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: ze(we),
            tagId: V,
            historyReceiptId: Se,
            segments: ve.map((gt) => {
              const Kt = !c || gt.nativeSegmentId != null;
              return {
                nativeSegmentId: Kt ? gt.nativeSegmentId : null,
                itemId: Kt ? null : gt.itemId,
                expectedUpdatedAt: Kt ? gt.updatedAt : null,
                expectedRevision: Kt ? null : gt.revision
              };
            })
          })
        }), He(we);
        const Fe = Mt(
          ve,
          c
        ), De = await P();
        y({ type: "confirm", key: st, applied: De != null });
        const Dt = Ke.map((gt) => tt(De == null ? void 0 : De.segments, gt)).filter(Boolean);
        await Z(
          "segments.tag",
          `Changed tag for ${ke.length} segment${ke.length === 1 ? "" : "s"}`,
          Fe,
          Mt(Dt, c),
          Se
        );
        const nt = Ke.map((gt) => tt(De == null ? void 0 : De.segments, gt)).filter(Boolean);
        X(nt.map((gt) => gt.id)), G(((xe = nt.find((gt) => gt.id === (J == null ? void 0 : J.id))) == null ? void 0 : xe.id) ?? ((Xe = nt[0]) == null ? void 0 : Xe.id) ?? null), d(), N(`${ke.length} selected segment${ke.length === 1 ? "" : "s"} retagged.`);
      } catch (Se) {
        y({ type: "discard", key: st });
        const Fe = Ke.map((Dt) => tt(u.segments, Dt)).filter(Boolean), De = tt(u.segments, {
          id: J == null ? void 0 : J.id,
          itemId: J == null ? void 0 : J.itemId,
          nativeSegmentId: J == null ? void 0 : J.nativeSegmentId
        }) || Fe[0] || null;
        X(Fe.map((Dt) => Dt.id)), G((De == null ? void 0 : De.id) ?? null), te.current = (De == null ? void 0 : De.id) ?? null, he.current = [], Se.status === 409 && await D(), N(Se.message || "Unable to change the selected segment tags.");
      } finally {
        Ge();
      }
      return;
    }
    if (ve.length !== 1 || !J) return;
    const Ae = wi(W, J);
    if (J.id === m || Ae) {
      const ke = Ae ? { segmentId: J.id, tagId: Ae.values.tagId, tagName: Ae.meta.tagName } : null, Ke = vl(ke, J, V, de);
      if (Ke && !Ye(J, Ke)) {
        d();
        return;
      }
      if (Ae && (f((Oe) => {
        var we;
        return ((we = Oe.meta) == null ? void 0 : we.pendingChangeId) === Ae.id;
      }), y({ type: "discard", key: Ae.id })), Ke) {
        const Oe = Ja(
          { ...J, tagId: Ke.tagId },
          z,
          b,
          U,
          ae
        );
        E(Oe.filters), $(Oe.hideDerivedSegments), N("Tag change queued…");
      } else Ae && N("");
      d();
      return;
    }
    if (V === J.tagId) {
      d();
      return;
    }
    if (J.itemId != null && ((Qe = (Be = H.data) == null ? void 0 : Be.children) == null ? void 0 : Qe.length) > 0) {
      const ke = r("lineage-tag", J.id);
      if (!ke) return;
      N("Checking lineage impact…");
      let Ke = null;
      try {
        const Oe = await Q(`/items/${J.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: J.revision, tagId: V })
        }), we = Oe.deletedItemIds.length > 0 || Oe.removedEdgeIds.length > 0;
        if (we && !window.confirm(
          `Changing this tag removes ${Oe.removedEdgeIds.length} lineage edge${Oe.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${Oe.deletedItemIds.length} derived segment${Oe.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
        )) {
          N("Tag change canceled.");
          return;
        }
        Ke = _t(), y({
          type: "add",
          entry: { id: Ke, op: "patch", targets: [Tt(J)], values: Ne }
        }), d();
        const Ge = `tag-change:${J.itemId}:${J.revision}:${Oe.componentFingerprint}:${V}`;
        await Q(`/items/${J.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: ze(Ge),
            expectedRevision: J.revision,
            componentFingerprint: Oe.componentFingerprint,
            tagId: V
          })
        }), He(Ge);
        const st = await P();
        y({ type: "confirm", key: Ke, applied: st != null }), d(), N(we ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch (Oe) {
        Ke && y({ type: "discard", key: Ke }), X([J.id]), G(J.id), te.current = J.id, he.current = [], Oe.status === 409 ? (N("Lineage changed — loading the latest segments…"), await D()) : N(Oe.message || "Unable to reconcile the lineage.");
      } finally {
        ke();
      }
      return;
    }
    d(), await k(J, {
      startSec: J.startSec,
      endSec: J.endSec,
      tagId: V
    }, !0, null, !0, Ne);
  }
  function Ye(V, de) {
    const Ne = _t(), Ae = M(Tt(V));
    y({
      type: "add",
      entry: {
        id: Ne,
        op: "patch",
        targets: [Ae],
        values: { tagId: de.tagId, tagName: de.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: de.tagName }
      }
    });
    const xe = W.find((Be) => Be.op === "insert" && Be.segment.id === V.id);
    return w({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [Ae],
      dependsOn: (xe == null ? void 0 : xe.taskId) ?? null,
      meta: { pendingChangeId: Ne },
      ready: (Be, Qe) => {
        const ke = Si(Be.segments, Qe.targets[0]);
        return !ke || xl(Be, ke.id);
      },
      run: (Be) => Ue(Be, Ne, de)
    }) ? !0 : (y({ type: "discard", key: Ne }), N("Wait for the history restore to finish."), !1);
  }
  async function Ue(V, de, Ne) {
    const [Ae] = V.resolveTargets();
    if (!Ae) {
      y({ type: "discard", key: de }), N(`The new segment was not retagged${Ne.tagName ? ` to ${Ne.tagName}` : ""}. Choose its tag again.`);
      return;
    }
    if (Ae.tagId === Ne.tagId) {
      y({ type: "discard", key: de });
      return;
    }
    await C(Ae, {
      startSec: Ae.startSec,
      endSec: Ae.endSec,
      tagId: Ne.tagId
    }, {
      pendingChangeId: de,
      restoreSelectionOnFailure: !1,
      onReload: V.onReload,
      onConflict: V.onConflict
    }) || N(`The new segment was not retagged${Ne.tagName ? ` to ${Ne.tagName}` : ""}. Choose its tag again.`);
  }
  async function _e() {
    var Qe, ke, Ke, Oe;
    if (!l || !J || R != null) return;
    const V = [...ve].sort((we, Ge) => Number(we.nativeSegmentId ?? we.id) - Number(Ge.nativeSegmentId ?? Ge.id)), de = new Set(V.map((we) => we.id)), Ne = V.map((we) => `${we.nativeSegmentId ?? we.id}:${we.updatedAt}`).join("|"), Ae = r("bin", J.id);
    if (!Ae) return;
    N(`Moving ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin…`);
    const xe = `bulk-move:${se.id}:${Ne}`, Xe = ze(xe), Be = c ? null : crypto.randomUUID();
    try {
      const we = (Fe = !1) => Q(`/videos/${se.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Xe,
          segments: V.map((De) => ({
            segmentId: De.nativeSegmentId ?? De.id,
            expectedUpdatedAt: De.updatedAt
          })),
          discardMissingImage: Fe,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: Be
        })
      });
      let Ge;
      try {
        Ge = await we(
          mo(xe)
        );
      } catch (Fe) {
        if (((Qe = Fe.payload) == null ? void 0 : Qe.code) !== "missing-image" || !window.confirm(`${Fe.message}

Continue and discard the missing image reference?`)) throw Fe;
        go(xe), Ge = await we(!0);
      }
      He(xe), Wn();
      const st = new Map((Ge.items || []).map((Fe) => [
        Number(Fe.segmentId),
        Fe
      ]));
      await Z(
        "segments.moveToBin",
        `Moved ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin`,
        Mt(V, !1),
        Mt(V.map((Fe) => {
          const De = st.get(
            Number(Fe.nativeSegmentId ?? Fe.id)
          );
          return {
            ...Fe,
            recycleBinItemId: (De == null ? void 0 : De.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (De == null ? void 0 : De.revision) ?? null
          };
        }), !1),
        Be
      );
      const Se = tl(o, de, J.id);
      A((Fe) => ({
        ...Fe,
        segments: (Fe.segments || []).filter((De) => !de.has(De.id))
      }), se.id), X(Se ? [Se.id] : []), G((Se == null ? void 0 : Se.id) ?? null), te.current = (Se == null ? void 0 : Se.id) ?? null, he.current = [], Se && (_(Bt(o, Se.id)), ue(Se.id)), requestAnimationFrame(() => {
        var Fe;
        return (Fe = p.current) == null ? void 0 : Fe.focus({ preventScroll: !0 });
      }), N(`Moved ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (we) {
      const Ge = ((ke = we.payload) == null ? void 0 : ke.code) || ((Oe = (Ke = we.payload) == null ? void 0 : Ke.result) == null ? void 0 : Oe.code);
      we.status === 409 && Ge === "CANONICAL_SEGMENT_CHANGED" ? await D() : N(we.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Ae();
    }
  }
  async function Ze() {
    if (!(c || s.current || R != null)) {
      s.current = !0, N("Checking the recycling bin…");
      try {
        const V = await Q("/bin"), de = await ci(V, () => N("Emptying the recycling bin…"));
        if (de.status === "empty") {
          N("The recycling bin is empty.");
          return;
        }
        if (de.status === "canceled") {
          N("The recycling bin was not emptied.");
          return;
        }
        N(`${de.segmentCount} segment${de.segmentCount === 1 ? "" : "s"} from ${de.sceneCount} scene${de.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (V) {
        N(V.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: Te, removeIncorrectExample: $e, captureTrainingExport: Le, deleteRejectedSegments: Me, autoAssignPerformers: We, previewDerivedSegments: ut, closeMaterializeDialog: Je, materializeDerivedSegments: mt, saveTag: Pe, moveToBin: _e, emptyRecyclingBin: Ze };
}
function Mc(e) {
  const { acceptHistory: t, acquireSaveLock: r, enqueueSave: o, getSaveQueueSnapshot: i, commonActionsRef: a, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: m, history: u, historyRef: b, historySaving: p, horizontalLayoutSize: f, mediaStackHeight: y, mediaStackRef: w, onDetailChange: M, onReload: g, railToggleRef: U, recordHistoryAction: B, savingSegmentId: H, setCollapsedSegmentGroups: q, setEditorLayout: L, setHistorySaving: T, setIncorrectExamples: S, setSaveMessage: k, shotBoundaries: C, timelineDuration: W, video: D, workspaceRef: A } = e;
  async function P($, v, h) {
    var oe, F, ie, N;
    const x = $.type === "segment" ? [$] : $.segments || [], O = (v == null ? void 0 : v.type) === "segment" ? [v] : (v == null ? void 0 : v.segments) || [];
    let re = h;
    for (const [_, G] of x.entries()) {
      const X = O[_], se = ((oe = G.identity) == null ? void 0 : oe.nativeSegmentId) != null || ((F = G.identity) == null ? void 0 : F.published) === !0, Te = ((ie = X == null ? void 0 : X.identity) == null ? void 0 : ie.recycleBinItemId) ?? ((N = X == null ? void 0 : X.identity) == null ? void 0 : N.itemId);
      let $e = tt(re.segments, X == null ? void 0 : X.identity) || tt(re.segments, G.identity);
      if (!$e && se && Te != null && X.identity.revision != null) {
        const Me = `history-restore:${D.id}:${Te}:${X.identity.revision}`;
        await Q(`/bin/${Te}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: ze(Me),
            expectedRevision: X.identity.revision
          })
        }), He(Me), re = await g(), $e = re.segments.find((We) => We.tagId === G.values.tagId && We.startSec === G.values.startSec && We.endSec === G.values.endSec);
      }
      if (!$e)
        throw new Error("A segment in this history state no longer exists.");
      if (($e.nativeSegmentId != null || $e.published === !0) !== se) {
        if (se) {
          const Me = $e.recycleBinItemId ?? $e.itemId ?? Te;
          if (Me == null)
            throw new Error("This recycled segment can no longer be restored.");
          const We = `history-restore:${D.id}:${Me}:${$e.revision}:${G.values.reviewState ?? "native"}`;
          await Q(`/bin/${Me}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: ze(We),
              expectedRevision: $e.revision
            })
          }), He(We);
        } else {
          const Me = `history-bin:${D.id}:${$e.nativeSegmentId}:${$e.updatedAt}:${G.values.reviewState}`;
          await Q(`/videos/${D.id}/segments/${$e.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: ze(Me),
              expectedUpdatedAt: $e.updatedAt,
              reviewState: G.values.reviewState
            })
          }), He(Me);
        }
        if (re = await g(), !se)
          continue;
        if ($e = tt(re.segments, G.identity) || re.segments.find((Me) => Me.tagId === G.values.tagId && Me.startSec === G.values.startSec && Me.endSec === G.values.endSec), !$e)
          throw new Error("The restored segment could not be found.");
      }
      const Le = G.values;
      if ($e.nativeSegmentId == null && $e.itemId != null) {
        const Me = `history-draft-update:${D.id}:${$e.itemId}:${$e.revision}:${Le.tagId}:${Le.startSec}:${Le.endSec ?? "open"}:${Le.reviewState}`;
        await Q(`/videos/${D.id}/drafts/${$e.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: ze(Me),
            expectedRevision: $e.revision,
            ...Le
          })
        }), He(Me);
      } else
        await Q(`/videos/${D.id}/segments/${$e.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Le, expectedUpdatedAt: $e.updatedAt })
        });
      re = await g();
    }
    return re;
  }
  async function z($, v) {
    var h;
    for (const x of $.targets || []) {
      const O = tt(v.segments, x.identity);
      if (!O)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const re = (h = v.performerSlotRevisions) == null ? void 0 : h[O.id];
      await Q(O.published ? `/videos/${D.id}/segments/${O.nativeSegmentId}/slots` : `/videos/${D.id}/drafts/${O.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: re,
          assignments: x.assignments
        })
      }), v = await g();
    }
    return v;
  }
  async function Z($, v, h) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let x = v, O = await Q(`/videos/${D.id}/incorrect-examples`);
    const re = (oe) => O.find((F) => {
      var ie;
      return F.id === oe.exampleId || ((ie = oe.collectedIdentity) == null ? void 0 : ie.itemId) != null && F.itemId === oe.collectedIdentity.itemId;
    });
    for (const [oe, F] of ($.entries || []).entries()) {
      const ie = `history-feedback:${D.id}:${h.action.sequence}:${h.direction}:${oe}`, N = re(F);
      if ($.collected && N) {
        He(ie);
        continue;
      }
      let _;
      if ($.collected) {
        const G = tt(
          x.segments,
          F.collectedIdentity
        ) || tt(
          x.segments,
          F.originalIdentity
        );
        if (!G)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const X = G.nativeSegmentId != null;
        _ = await Q(`/videos/${D.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: ze(ie),
            nativeSegmentId: X ? G.nativeSegmentId : null,
            itemId: X ? null : G.itemId,
            expectedUpdatedAt: X ? G.updatedAt : null,
            expectedRevision: X ? null : G.revision
          })
        });
      } else {
        if (!N) {
          He(ie);
          continue;
        }
        _ = await Q(
          `/videos/${D.id}/incorrect-examples/${N.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: ze(ie),
              expectedExampleRevision: N.revision,
              expectedRepresentationRevision: N.representationRevision
            })
          }
        );
      }
      He(ie), x = vr(
        x,
        _.editorDelta
      ), O = await Q(
        `/videos/${D.id}/incorrect-examples`
      );
    }
    return S(O), x;
  }
  async function ge($, v, h = []) {
    const x = $.state;
    if (!s && ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")) {
      const re = `basic-history:${D.id}:${b.current.revision}:${$.action.sequence}:${$.direction}`, oe = await Q(`/videos/${D.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ze(re),
          expectedHistoryRevision: b.current.revision,
          actionSequence: $.action.sequence,
          direction: $.direction
        })
      });
      return t(oe.history), h.push(re), g();
    }
    const O = $.direction === "backward" ? $.action.afterState : $.action.beforeState;
    if ((x == null ? void 0 : x.type) === "composite") {
      let re = v;
      const oe = (O == null ? void 0 : O.type) === "composite" ? O.states || [] : [];
      for (const [F, ie] of (x.states || []).entries()) {
        const N = oe[F];
        re = await ge({
          ...$,
          state: ie,
          action: {
            ...$.action,
            beforeState: $.direction === "backward" ? ie : N,
            afterState: $.direction === "backward" ? N : ie
          }
        }, re, h);
      }
      return re;
    }
    if ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")
      return P(
        x,
        O,
        v
      );
    if ((x == null ? void 0 : x.type) === "performerSlots")
      return z(x, v);
    if ((x == null ? void 0 : x.type) === "incorrectExamples")
      return Z(x, v, $);
    if ((x == null ? void 0 : x.type) === "shots") {
      const re = _n(v.shotBoundaries || []), oe = await Q(`/videos/${D.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ze(`history-shots:${D.id}:${re}:${x.fingerprint}`),
          expectedFingerprint: re,
          boundaries: x.boundaries
        })
      });
      return { ...v, shotBoundaries: oe };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function be($) {
    if (p || $ === u.cursorSequence) return;
    if (H != null) {
      k("Finish the pending saves before restoring history.");
      return;
    }
    if (da(u, $).length === 0) return;
    const h = o({
      kind: "history",
      lockId: -1,
      exclusive: !0,
      run: (x) => ue(x.detail, $)
    });
    if (!h) {
      k("Finish the pending saves before restoring history.");
      return;
    }
    await h.done;
  }
  async function ue($, v) {
    var x;
    const h = da(b.current, v);
    if (h.length !== 0) {
      T(!0), k(`Restoring ${h.length} history ${h.length === 1 ? "action" : "actions"}…`);
      try {
        let O = $;
        const re = [];
        for (const F of h)
          O = await ge(
            F,
            O,
            re
          );
        const oe = s ? await Q(`/videos/${D.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: b.current.revision,
            targetSequence: v
          })
        }) : b.current;
        re.forEach(He), t(oe), await g(), k("History restored.");
      } catch (O) {
        O.status === 409 && ((x = O.payload) != null && x.current) && t(O.payload.current), await g(), k(O.message || "Unable to restore editor history.");
      } finally {
        T(!1);
      }
    }
  }
  function R($) {
    L((v) => ({ ...v, timelineRatio: co($, y) }));
  }
  function ae($) {
    var x, O;
    const v = (x = w.current) == null ? void 0 : x.getBoundingClientRect();
    if (!v) return;
    const h = ((O = a.current) == null ? void 0 : O.offsetHeight) || 0;
    R(Gs(
      $.clientY,
      v.top + h,
      Math.max(0, v.height - h)
    ));
  }
  function me($) {
    $.currentTarget.setPointerCapture($.pointerId), ae($);
  }
  function J($) {
    $.currentTarget.hasPointerCapture($.pointerId) && ae($);
  }
  function ye($) {
    const v = $.shiftKey ? 0.1 : 0.05;
    let h = null;
    $.key === "ArrowUp" && (h = c.timelineRatio + v), $.key === "ArrowDown" && (h = c.timelineRatio - v);
    const x = lo(y);
    $.key === "Home" && (h = x.minimum), $.key === "End" && (h = x.maximum), h != null && ($.preventDefault(), $.stopPropagation(), R(h));
  }
  function ve($) {
    const v = $ === "detailWidth" ? f.focusRow : f.workspace, h = f.workspace > 0 ? Zr(f.workspace, 600) : 560, x = cn(c.markerRailWidth, h), O = $ === "detailWidth" ? 344 + (c.markerRailOpen ? x + 24 : 0) : 600;
    return v > 0 ? Zr(v, O) : 560;
  }
  function te($, v) {
    L((h) => ({ ...h, [$]: cn(v, ve($)) }));
  }
  function he($, v) {
    var x, O;
    const h = v === "detailWidth" ? (x = m.current) == null ? void 0 : x.getBoundingClientRect() : (O = A.current) == null ? void 0 : O.getBoundingClientRect();
    h && te(v, v === "detailWidth" ? $.clientX - h.left : h.right - $.clientX);
  }
  function ne($, v) {
    const h = ve($), x = cn(c[$], h);
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
      onPointerDown: (O) => {
        O.currentTarget.setPointerCapture(O.pointerId), he(O, $);
      },
      onPointerMove: (O) => {
        O.currentTarget.hasPointerCapture(O.pointerId) && he(O, $);
      },
      onKeyDown: (O) => {
        const re = O.shiftKey ? 40 : 16;
        let oe = null;
        O.key === "ArrowLeft" && (oe = $ === "detailWidth" ? -re : re), O.key === "ArrowRight" && (oe = $ === "detailWidth" ? re : -re);
        let F = oe == null ? null : x + oe;
        O.key === "Home" && (F = 240), O.key === "End" && (F = h), F != null && (O.preventDefault(), O.stopPropagation(), te($, F));
      },
      onDoubleClick: () => te($, At[$]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function Y() {
    L(($) => ({ ...$, markerRailOpen: !$.markerRailOpen })), requestAnimationFrame(() => {
      var $;
      return ($ = U.current) == null ? void 0 : $.focus({ preventScroll: !0 });
    });
  }
  function ce($) {
    q((v) => v.includes($) ? v.filter((h) => h !== $) : nn([...v, $]));
  }
  function E($, v = !0, h = l) {
    const x = i().running != null, O = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (re) => ee(re.detail, $, v, h)
    });
    return O ? (x && k($ === "split" ? "Shot boundary queued…" : "Shot merge queued…"), O.done.then((re) => re.value ?? null)) : (k("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function ee($, v, h, x) {
    var ie;
    const O = ($ == null ? void 0 : $.shotBoundaries) || [], re = Number((ie = D.videoFile) == null ? void 0 : ie.duration) || W, oe = _n(O), F = `shot-${v}:${D.id}:${x.toFixed(3)}:${re.toFixed(3)}:${oe}`;
    k(v === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const N = await Q(`/videos/${D.id}/shot-boundaries/${v}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: ze(F), timeSec: x })
      });
      return He(F), M((_) => ({ ..._, shotBoundaries: N }), D.id), h && await B(
        "shots.update",
        v === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: O,
          fingerprint: oe
        },
        {
          type: "shots",
          boundaries: N,
          fingerprint: _n(N)
        }
      ), k(v === "split" ? "Shot boundary added." : "Shots merged."), N;
    } catch (N) {
      return k(N.message || "Unable to edit shot boundaries."), null;
    }
  }
  return { applySegmentHistoryState: P, applyPerformerSlotHistoryState: z, applyHistoryState: ge, restoreHistoryTarget: be, updateTimelineRatio: R, updateTimelineRatioFromPointer: ae, handleSeparatorPointerDown: me, handleSeparatorPointerMove: J, handleSeparatorKeyDown: ye, panelWidthMaximum: ve, updatePanelWidth: te, handlePanelSeparatorPointer: he, panelSeparatorProps: ne, toggleSegmentRail: Y, toggleSegmentGroup: ce, mutateShotBoundary: E };
}
function Ec(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: m, emptyRecyclingBin: u, lineage: b, mediaDuration: p, mergeSelectedSwimlane: f, moveToBin: y, mutateShotBoundary: w, openPublishApprovedDialog: M, playbackControlsRef: g, playbackShortcutConfig: U, saveSelectedReviewState: B, seekRef: H, segmentGroupKeys: q, selectSegment: L, selectedSegment: T, selectedSegmentGroupForSegment: S, selectedSegmentGroupKey: k, selectedSegments: C, setCollapsedSegmentGroups: W, setIncorrectExamplesOpen: D, setQuickSearchOpen: A, setSaveMessage: P, setSelectedSegmentGroupKey: z, setTagEditing: Z, setTimelineZoom: ge, shotBoundaries: be, slotButtonRef: ue, splitSegment: R, swimlanes: ae, timelineDuration: me, toggleIncorrectExample: J, toggleSegmentGroup: ye, updateTimelineRatio: ve, videoFrameRate: te, visibleSegments: he } = e;
  function ne(E) {
    var ee, $;
    (ee = g.current) == null || ee.pause(), ($ = g.current) == null || $.seekBy(wl(E, te));
  }
  function Y(E, ee) {
    if (C.length > 1 && sl(E.id))
      return;
    let $ = null;
    E.id === "video.playPause" && ($ = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.toggle();
    }), E.id === "video.seekSmallBackward" && ($ = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(-U.smallSeekTime);
    }), E.id === "video.seekSmallForward" && ($ = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(U.smallSeekTime);
    }), E.id === "video.seekMediumBackward" && ($ = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(-U.mediumSeekTime);
    }), E.id === "video.seekMediumForward" && ($ = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(U.mediumSeekTime);
    }), E.id === "video.seekLongBackward" && ($ = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(-U.longSeekTime);
    }), E.id === "video.seekLongForward" && ($ = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(U.longSeekTime);
    }), E.id === "video.playSelected" && T && ($ = () => {
      var v;
      (v = H.current) == null || v.call(H, T.startSec, !0), requestAnimationFrame(() => {
        var h;
        return (h = m.current) == null ? void 0 : h.focus({ preventScroll: !0 });
      });
    }), (E.id === "video.playPreviousSegment" || E.id === "video.playNextSegment") && ($ = () => {
      var h;
      const v = ro(
        ae,
        T == null ? void 0 : T.id,
        E.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !v || v.id === (T == null ? void 0 : T.id) || (L(v, { focusEditor: !0, seekToSegment: !1 }), (h = H.current) == null || h.call(H, v.startSec, !0));
    }), E.id.startsWith("video.seekPercent") && ($ = () => {
      var h;
      const v = Number(E.id.slice(17)) / 10;
      (h = H.current) == null || h.call(H, rl(p ?? me, v), !1);
    }), E.id === "video.jumpToSegmentStart" && T && ($ = () => {
      var v;
      return (v = H.current) == null ? void 0 : v.call(H, T.startSec, !1);
    }), E.id === "video.jumpToSegmentEnd" && T && ($ = () => {
      var v;
      return (v = H.current) == null ? void 0 : v.call(H, T.endSec ?? T.startSec, !1);
    }), E.id === "video.jumpToVideoStart" && ($ = () => {
      var v;
      return (v = H.current) == null ? void 0 : v.call(H, 0, !1);
    }), E.id === "video.jumpToVideoEnd" && ($ = () => {
      var v;
      return (v = H.current) == null ? void 0 : v.call(H, me, !1);
    }), E.id.startsWith("video.frame") && ($ = () => {
      const v = E.id.includes("Small") ? "small" : E.id.includes("Medium") ? "medium" : "long", h = U[`${v}FrameStep`] * (E.id.endsWith("Backward") ? -1 : 1);
      ne(h);
    }), E.id.startsWith("navigation.swimlane") && ($ = () => {
      const v = E.id.slice(19).toLowerCase(), h = ro(ae, T == null ? void 0 : T.id, v, s);
      h && L(h, { focusEditor: !0, seekToSegment: !1 });
    }), (E.id === "navigation.extendSwimlaneLeft" || E.id === "navigation.extendSwimlaneRight") && ($ = () => {
      const v = xd(
        t,
        T == null ? void 0 : T.id,
        E.id.endsWith("Left") ? "left" : "right"
      );
      v && L(v.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: v.segmentIds
      });
    }), (E.id === "navigation.segmentGroupUp" || E.id === "navigation.segmentGroupDown") && ($ = () => {
      const v = Sd(
        q,
        k ?? S,
        E.id.endsWith("Up") ? -1 : 1
      );
      v && z(v);
    }), (E.id === "navigation.previousAtPlayhead" || E.id === "navigation.nextAtPlayhead") && ($ = () => {
      const v = Us(he, s, E.id === "navigation.previousAtPlayhead" ? -1 : 1, T == null ? void 0 : T.id);
      v && L(v, { focusEditor: !0, seekToSegment: !1 });
    }), E.id === "navigation.nearestInCurrentSwimlane" && ($ = () => {
      const v = Rs(
        ae,
        T == null ? void 0 : T.id,
        s
      );
      v && L(v, { focusEditor: !0, seekToSegment: !1 });
    }), E.id.includes("Unreviewed") && ($ = () => {
      const v = Sr(
        ae,
        T == null ? void 0 : T.id,
        E.id.startsWith("navigation.previous") ? -1 : 1,
        E.id.endsWith("Global")
      );
      v && L(v, { focusEditor: !ee.preserveFocus, seekToSegment: !1 });
    }), (E.id === "navigation.nextTouchingPlayhead" || E.id === "navigation.previousTouchingPlayhead") && ($ = () => {
      const v = As(ae, s, E.id === "navigation.previousTouchingPlayhead" ? -1 : 1, T == null ? void 0 : T.id);
      v && L(v, { focusEditor: !0, seekToSegment: !1 });
    }), E.id === "navigation.quickSearch" && ($ = () => A(!0)), (E.id === "navigation.previousShot" || E.id === "navigation.nextShot") && ($ = () => {
      var h;
      const v = kl(be, s, E.id === "navigation.previousShot" ? -1 : 1);
      v && ((h = H.current) == null || h.call(H, v.startSec, !1));
    }), E.id === "shot.split" && ($ = () => w("split")), E.id === "shot.merge" && ($ = () => w("merge")), E.id === "marker.create" && ($ = () => a()), E.id === "marker.duplicate" && ($ = () => d(!1)), E.id === "marker.duplicateAtPlayhead" && ($ = () => d(!0)), E.id === "marker.split" && ($ = () => R()), E.id === "marker.editTag" && ($ = () => {
      var v;
      if (C.length > 1 && C.some((h) => h.isDerived)) {
        P("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((v = b.data) != null && v.tagReadOnly) {
        P("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      Z(!0);
    }), E.id === "marker.setStart" && T && ($ = () => r(s, T.endSec)), E.id === "marker.setEnd" && T && ($ = () => r(T.startSec, s)), E.id === "marker.copyTiming" && T && ($ = () => {
      P(Yd(T) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), E.id === "marker.pasteTiming" && T && ($ = () => {
      const v = Jd();
      if (!v) {
        P("No copied segment timing is available.");
        return;
      }
      r(v.startSec, v.endSec);
    }), E.id === "marker.mergeSelection" && ($ = () => f()), E.id === "marker.moveToBin" && ($ = () => y()), E.id === "marker.toggleIncorrectExample" && T && ($ = () => J()), E.id === "marker.openIncorrectExamples" && ($ = () => D(!0)), E.id === "markerGroup.toggleCollapse" && k && ($ = () => ye(k)), E.id === "markerGroup.toggleAll" && ($ = () => W((v) => vd(v, q))), E.id === "marker.assignSlots" && ($ = () => {
      var v;
      return (v = ue.current) == null ? void 0 : v.click();
    }), E.id === "navigation.zoomIn" && ($ = () => ge((v) => kr(v + 0.5))), E.id === "navigation.zoomOut" && ($ = () => ge((v) => kr(v - 0.5))), E.id === "navigation.resetZoom" && ($ = () => ge(1)), E.id === "navigation.centerPlayhead" && ($ = () => {
      var v;
      return (v = o.current) == null ? void 0 : v.call(o);
    }), E.id === "layout.growSwimlanes" && ($ = () => ve(c.timelineRatio + 0.05)), E.id === "layout.shrinkSwimlanes" && ($ = () => ve(c.timelineRatio - 0.05)), E.id === "marker.confirm" && T && ($ = () => B("approved")), E.id === "system.publishApproved" && ($ = () => M(ee.target)), E.id === "marker.reject" && T && ($ = () => B("rejected")), E.id === "system.emptyBin" && ($ = () => u()), E.id === "system.deleteRejected" && ($ = () => l()), $ && $();
  }
  function ce(E, ee) {
    const $ = Zn.find((v) => v.id === E);
    $ && Mn($, i) && Y($, ee);
  }
  return {
    executeShortcutById: ce,
    stepVideoFrame: (E) => ne(E < 0 ? -1 : 1)
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
function Dc(e, t, r = !1, o = 0, i = "", a = () => () => {
}) {
  const [s, l] = K(null), [d, c] = K(null), [m, u] = K(""), [b, p] = K({
    busy: !1,
    reviewState: null,
    error: ""
  }), f = pe(null);
  async function y(g) {
    const U = a("import", -1);
    if (!U) {
      p({ busy: !1, reviewState: null, error: "Wait for the current save to finish before importing Cove segments." });
      return;
    }
    p({ busy: !0, reviewState: g, error: "" });
    try {
      await Q(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: no(), reviewState: g })
      }), await t(), p({ busy: !1, reviewState: null, error: "" });
    } catch (B) {
      p({
        busy: !1,
        reviewState: null,
        error: B.message || "Unable to import Cove segments."
      });
    } finally {
      U();
    }
  }
  async function w(g) {
    try {
      const U = await Q(`/videos/${e}/analysis-runs`, {
        signal: g.signal
      });
      if (!g.isActive()) return null;
      const B = (U == null ? void 0 : U[0]) || null;
      return l(B), (B == null ? void 0 : B.status) === "completed" && f.current !== B.id && (f.current = B.id, await t()), ((B == null ? void 0 : B.status) === "failed" || (B == null ? void 0 : B.status) === "cancelled") && u(B.errorMessage || "Video analysis did not complete."), B;
    } catch (U) {
      return g.isActive() && U.name !== "AbortError" && u(U.message || "Unable to load video analysis status."), null;
    }
  }
  async function M(g = null) {
    u("");
    const U = g || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), B = U.includes("omnishotcut") && o > 0;
    if (!(B && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const H = await Q(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: U,
            replaceShotBoundaries: B,
            expectedShotBoundaryFingerprint: B ? i : null
          })
        });
        l(H);
      } catch (H) {
        u(H.message || "Unable to start video analysis.");
      }
  }
  return fe(() => {
    if (!ka(r)) {
      l(null), c(null), u("");
      return;
    }
    const g = wa();
    return w(g), Q("/analysis/status", { signal: g.signal }).then((U) => {
      g.isActive() && (c(U), U.configured || u(""));
    }).catch((U) => {
      g.isActive() && U.name !== "AbortError" && u(U.message || "Unable to check video analysis readiness.");
    }), g.dispose;
  }, [e, r]), fe(() => {
    if (!ka(r) || (s == null ? void 0 : s.status) !== "queued" && (s == null ? void 0 : s.status) !== "running") return;
    const g = wa();
    let U = setTimeout(async function B() {
      await w(g), g.isActive() && (U = setTimeout(B, 2500));
    }, 2500);
    return () => {
      clearTimeout(U), g.dispose();
    };
  }, [s == null ? void 0 : s.id, s == null ? void 0 : s.status, r]), {
    analysisError: m,
    analysisRun: s,
    analysisStatus: d,
    importNativeSegments: y,
    nativeImportState: b,
    startFullAnalysis: M
  };
}
const qn = Object.freeze([]);
function Oc(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Pc({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var Lo, Fo, jo, Bo, Go;
  const [m, u] = K(null), [b, p] = K([]), f = pe(null), y = pe(null), w = pe([]), M = pe(null), [g, U] = K(() => Et({})), [B, H] = K(!1), [q, L] = K(ol), [T, S] = K(0), k = pe(null), [C] = K(() => Dd({
    getContext: () => k.current,
    drainAfterSettle: !1
  })), W = Ul(C.subscribe, C.getSnapshot), D = ki(W), A = (j, le) => C.acquire({ kind: j, lockId: le }), P = (j) => C.enqueue(j), z = (j) => C.stableIdentity(j), Z = pe(!1);
  fe(() => (Z.current = !0, () => {
    Z.current = !1, queueMicrotask(() => {
      Z.current || C.dispose();
    });
  }), []);
  const ge = (j) => C.cancel(j), be = (j, le) => C.retarget(j, le), ue = C.getSnapshot, [R, ae] = Gl(Ud, []), [me, J] = K(""), [ye, ve] = K(""), [te, he] = K(""), [ne, Y] = K(1), [ce, E] = K(qd), [ee, $] = K(0), [v, h] = K({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [x, O] = K(Jt), re = pe(Jt), [oe, F] = K(!1), [ie, N] = K(!1), [_, G] = K(!1), X = pe(!1);
  X.current = _;
  const [se, Te] = K(null), [$e, it] = K(!1), [Le, Me] = K(null), [We, at] = K(null), ut = pe(null), [Je, mt] = K(!1), [ft, Pe] = K(""), Ye = pe(null), Ue = pe(null), _e = pe(!1), [Ze, V] = K(_d), [de, Ne] = K(null), [Ae, xe] = K(!1), [Xe, Be] = K(!1), [Qe, ke] = K(!1), [Ke, Oe] = K(!1), [we, Ge] = K(!1), [st, Se] = K(""), {
    analysisError: Fe,
    analysisRun: De,
    analysisStatus: Dt,
    importNativeSegments: nt,
    nativeImportState: gt,
    startFullAnalysis: Kt
  } = Dc(
    e.video.id,
    o,
    l,
    ((Lo = e.shotBoundaries) == null ? void 0 : Lo.length) || 0,
    _n(e.shotBoundaries || []),
    (j, le) => C.acquire({ kind: j, lockId: le })
  ), [et, Ie] = K(!1), [Ce, Ve] = K(null), [pt, lt] = K(l), [Ot, Ct] = K(0), [Pt, pn] = K(!1), [Lt, rn] = K(""), [er, on] = K(null), On = pe(null), tr = pe(null), fn = pe(!1), [Qt, yn] = K([]), [nr, Rr] = K(!1), [rr, Mr] = K(null), an = zd(), bn = pe(null), Pn = pe(null), hn = pe(null), Er = pe(s), or = pe(null), vn = pe(null), sn = pe(null), xn = pe(null), Ln = pe(null), St = pe(null), ar = pe(null), Fn = pe(null), zt = pe(null), ir = pe(null), Sn = pe(null), kn = pe(null), Dr = pe(-1e12), Or = pe(null), jn = pe(null), [wn, Bn] = K({ scrollTop: 0, height: 512 });
  fe(() => {
    if (!et || Pt || !Lt) return;
    const j = requestAnimationFrame(() => {
      var le;
      return (le = tr.current) == null ? void 0 : le.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(j);
  }, [et, Pt, Lt]), fe(() => {
    if (!fn.current || et || pt) return;
    const j = requestAnimationFrame(() => {
      var le;
      (le = On.current) == null || le.focus({ preventScroll: !0 }), fn.current = !1;
    });
    return () => cancelAnimationFrame(j);
  }, [et, pt]);
  const ot = e.video, bt = e.segments || qn, Pr = qe(() => JSON.stringify({
    segments: bt.map((j) => [
      j.id,
      j.itemId,
      j.nativeSegmentId,
      j.tagId,
      j.startSec,
      j.endSec,
      j.reviewState,
      j.published,
      j.sourceKey,
      j.sourceRunId,
      j.confidence,
      j.revision,
      j.updatedAt
    ]),
    performerSlots: (e.performerSlots || qn).map((j) => [
      j.segmentId,
      j.slotDefinitionId,
      j.performerId,
      j.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [bt, e.performerSlots, e.itemMetadata]);
  fe(() => {
    if (!l) {
      Ve(null), lt(!1);
      return;
    }
    if (D != null) {
      lt(!0);
      return;
    }
    let j = !0;
    lt(!0);
    const le = setTimeout(() => {
      Q(`/videos/${ot.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((je) => {
        j && (Ve(je), rn(""));
      }).catch((je) => {
        j && (Ve(null), rn(je.message || "Unable to preview derived segments."));
      }).finally(() => {
        j && lt(!1);
      });
    }, 150);
    return () => {
      j = !1, clearTimeout(le);
    };
  }, [l, ot.id, Pr, Ot, D]);
  const yt = () => Ct((j) => j + 1), Ft = e.segmentGroups || qn, $t = e.performerSlots || qn, Lr = l && e.performerSlotsAvailable !== !1, Nn = qe(
    () => (e.performerCandidates || []).filter((j) => j.isVideoPerformer),
    [e.performerCandidates]
  ), Vt = e.shotBoundaries || qn, Gn = qe(
    () => fi($t),
    [$t]
  ), Un = qe(
    () => bt.map((j) => {
      const le = Gn.get(j.id) || [];
      return {
        ...j,
        slots: le,
        assignment: le.every((je) => je.performerId == null) ? Pl(le, Nn) : null
      };
    }).filter((j) => j.slots.length > 0 && j.assignment != null),
    [bt, Gn, Nn]
  ), sr = Number((Fo = ot.videoFile) == null ? void 0 : Fo.frameRate) > 0 ? Number(ot.videoFile.frameRate) : 30;
  function In() {
    const j = X.current;
    G(!1), j && requestAnimationFrame(() => {
      var le;
      return (le = St.current) == null ? void 0 : le.focus({ preventScroll: !0 });
    });
  }
  function lr() {
    D == null && (kn.current = null, it(!1), J(""), requestAnimationFrame(() => {
      var j;
      return (j = St.current) == null ? void 0 : j.focus({ preventScroll: !0 });
    }));
  }
  function Fr() {
    H(!1), requestAnimationFrame(() => {
      var j, le;
      (j = Fn.current) != null && j.isConnected ? Fn.current.focus({ preventScroll: !0 }) : (le = St.current) == null || le.focus({ preventScroll: !0 });
    });
  }
  fe(() => {
    Sn.current === m ? (Sn.current = null, G(!0)) : G(!1);
  }, [m]), fe(() => {
    var le;
    if (!_) return;
    const j = (le = ir.current) == null ? void 0 : le.querySelector("input");
    document.activeElement !== j && (j == null || j.focus({ preventScroll: !0 }), j == null || j.select());
  }, [_, m]), fe(() => {
    var le;
    if (_) return;
    const j = (le = St.current) == null ? void 0 : le.ownerDocument;
    j && j.activeElement === j.body && St.current.focus({ preventScroll: !0 });
  }, [_]), fe(() => {
    var je, dt, jt;
    const j = un(
      _r(
        e.segments,
        e.performerSlots || [],
        Et({}),
        l && q,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), le = ((je = e.segments.find((Tn) => Tn.id === s)) == null ? void 0 : je.id) ?? ((dt = qa(j)) == null ? void 0 : dt.id) ?? null;
    u(le), p(le == null ? [] : [le]), y.current = le, w.current = [], Ne(Bt(j, le)), U(Et({})), H(!1), kn.current = null, it(!1), Y(1), J(""), O(Jt), re.current = Jt, F(!1), (jt = St.current) == null || jt.focus({ preventScroll: !0 });
  }, [ot.id, s]), fe(() => {
    const j = new AbortController();
    return Q(`/videos/${ot.id}/incorrect-examples`, { signal: j.signal }).then(yn).catch((le) => {
      le.name !== "AbortError" && yn([]);
    }), () => j.abort();
  }, [ot.id, d == null ? void 0 : d.effectiveMode]), fe(() => {
    const j = new AbortController();
    return Q(`/videos/${ot.id}/history`, { signal: j.signal }).then((le) => {
      const je = le || Jt;
      re.current = je, O(je);
    }).catch((le) => {
      le.name !== "AbortError" && J(le.message || "Unable to load editor history.");
    }), () => j.abort();
  }, [ot.id]), fe(() => {
    Vd(ce);
  }, [ce.timelineRatio, ce.markerRailOpen, ce.detailWidth, ce.markerRailWidth, ce.swimlaneTitleWidth]), fe(() => {
    Wd(Ze);
  }, [Ze]), fe(() => {
    al(q);
  }, [q]), fe(() => {
    const j = vn.current;
    if (!a || !j || typeof ResizeObserver > "u") return;
    const le = () => {
      var jt;
      const dt = Math.max(0, j.clientHeight - (((jt = sn.current) == null ? void 0 : jt.offsetHeight) || 0));
      $(dt), E((Tn) => {
        const Uo = co(Tn.timelineRatio, dt);
        return Uo === Tn.timelineRatio ? Tn : { ...Tn, timelineRatio: Uo };
      });
    }, je = new ResizeObserver(le);
    return je.observe(j), sn.current && je.observe(sn.current), le(), () => je.disconnect();
  }, [a]), fe(() => {
    if (!an || typeof ResizeObserver > "u") return;
    const j = Ln.current, le = xn.current;
    if (!j || !le) return;
    const je = () => h({
      workspace: j.clientWidth,
      focusRow: le.clientWidth,
      focusRowHeight: le.clientHeight
    }), dt = new ResizeObserver(je);
    return dt.observe(j), dt.observe(le), je(), () => dt.disconnect();
  }, [an, ce.markerRailOpen]);
  const Ht = qe(
    () => Bd(bt, R),
    [bt, R]
  );
  sa(() => {
    $i(R, e) !== R && ae({ type: "prune", detail: e });
  }, [e, R]);
  const ht = qe(
    () => ga(
      _r(
        Ht,
        $t,
        g,
        l && q,
        Ft
      ),
      Qt,
      !0
    ),
    [
      Ht,
      $t,
      g,
      q,
      Ft,
      l,
      Qt
    ]
  ), ln = Object.fromEntries(Nt.map((j) => [j, ht.filter((le) => le.reviewState === j).length])), Kn = ga(
    _r(
      Ht,
      $t,
      { ...g, reviewStates: Nt },
      l && q,
      Ft
    ),
    Qt,
    !0
  ), jr = Object.fromEntries(Nt.map((j) => [j, Kn.filter((le) => le.reviewState === j).length])), Br = [...new Set(Ht.map((j) => j.sourceKey).filter(Boolean))].sort((j, le) => Ut(j).localeCompare(Ut(le))), Gr = _s(
    g,
    l && q
  ), kt = qe(
    () => un(ht, Ft, $t),
    [ht, Ft, $t]
  ), rt = Js(
    kt,
    m,
    s
  ), dn = qe(() => {
    const j = Fd(R);
    return j.length === 0 ? bt : [...bt, ...j];
  }, [bt, R]), I = rt == null ? null : dn.find((j) => j.id === rt.id) || rt, Ee = Jo(dn, Jo(ht, b).map((j) => j.id)), xt = !l && Ee.length > 0 && Ee.every((j) => j.nativeSegmentId != null), vt = ht.map((j) => j.id), Zt = vt.join("|");
  f.current = (I == null ? void 0 : I.id) ?? null;
  const qt = Gn.get(I == null ? void 0 : I.id) || [], Ur = yo(qt), So = qe(
    () => yd(kt, b),
    [kt, b]
  ), dr = qe(() => bo(kt), [kt]), zn = qe(
    () => pd(dr, Ze),
    [dr, Ze]
  ), Oi = qe(
    () => bi(
      zn.rows,
      wn.scrollTop,
      wn.height
    ),
    [zn, wn]
  ), Kr = qe(
    () => hd(kt, Ze),
    [kt, Ze]
  ), Pi = Sr(Kr, I == null ? void 0 : I.id, -1, !0) != null, Li = Sr(Kr, I == null ? void 0 : I.id, 1, !0) != null, Cn = I ? Bt(kt, I.id) : null, zr = yi(dr) ? dr.map((j) => j.key) : [], Fi = zr.join("|"), cr = Math.max(
    0,
    Number((jo = ot.videoFile) == null ? void 0 : jo.duration) || 0,
    ...Ht.map((j) => Number(j.endSec ?? j.startSec) || 0)
  ), ko = Number((Bo = ot.videoFile) == null ? void 0 : Bo.duration) > 0 ? Number(ot.videoFile.duration) : null;
  x.actions;
  const ji = ei();
  fe(() => {
    const j = m === wr ? m : (I == null ? void 0 : I.id) ?? null;
    j !== m && u(j);
  }, [I, m]), fe(() => {
    p((j) => {
      const le = Xs(
        j,
        vt,
        (I == null ? void 0 : I.id) ?? null
      );
      return le.length === j.length && le.every((je, dt) => je === j[dt]) ? j : le;
    });
  }, [Zt, I == null ? void 0 : I.id]);
  const $n = (I == null ? void 0 : I.itemId) == null ? null : ((Go = e.itemMetadata) == null ? void 0 : Go[I.itemId]) || null, Bi = {
    key: (I == null ? void 0 : I.itemId) != null ? `item:${I.itemId}` : (I == null ? void 0 : I.nativeSegmentId) != null ? `native:${I.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? ($n == null ? void 0 : $n.provenance) || (I == null ? void 0 : I.fieldProvenance) || [] : []
  }, Hr = (I == null ? void 0 : I.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && ($n == null ? void 0 : $n.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  fe(() => {
    ve(rt == null ? "" : String(rt.startSec)), he((rt == null ? void 0 : rt.endSec) == null ? "" : String(rt.endSec));
  }, [rt == null ? void 0 : rt.id, rt == null ? void 0 : rt.startSec, rt == null ? void 0 : rt.endSec]), fe(() => {
    Cn && V((j) => xi(j, Cn));
  }, [ot.id, s, Cn]), fe(() => {
    Ne((j) => kd(zr, j, Cn));
  }, [ot.id, Fi, Cn]), fe(() => {
    if (!ce.markerRailOpen || (I == null ? void 0 : I.id) == null) return;
    const j = jn.current, le = zn.rows.find((jt) => jt.kind === "segment" && jt.segment.id === I.id);
    if (!j || !le) return;
    const je = le.top + le.height;
    let dt = j.scrollTop;
    le.top < j.scrollTop ? dt = le.top : je > j.scrollTop + j.clientHeight && (dt = Math.max(0, je - j.clientHeight)), dt !== j.scrollTop && (j.scrollTop = dt), Bn({ scrollTop: dt, height: j.clientHeight });
  }, [I == null ? void 0 : I.id, zn, ce.markerRailOpen]), fe(() => {
    const j = jn.current;
    if (!ce.markerRailOpen || !j) return;
    const le = () => Bn({
      scrollTop: j.scrollTop,
      height: j.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      le();
      return;
    }
    const je = new ResizeObserver(le);
    return je.observe(j), le(), () => je.disconnect();
  }, [ce.markerRailOpen]);
  const { revealSegmentGroupForSelection: wo, replaceSegmentSelection: Gi, selectSegment: No, selectSegmentCollection: Ui, selectAllVideoSegments: Ki } = Tc({
    allSwimlanes: kt,
    editorRef: St,
    performerSlots: $t,
    seekRef: bn,
    segmentGroups: Ft,
    segments: bt,
    selectedSegmentId: m,
    selectedSegmentIds: b,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: w,
    setCollapsedSegmentGroups: V,
    setEditorFilters: U,
    setHideDerivedSegments: L,
    setSaveMessage: J,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: p
  }), { acceptHistory: qr, recordHistoryAction: ur, mutateSegment: zi, runSegmentMutation: Hi, completeReview: qi, createSegment: Io, splitSegment: Co, duplicateSegment: $o, saveTiming: _i, applyShortcutTiming: Wi } = Kd({
    compatibilityMode: l,
    currentTime: T,
    detail: e,
    editorFilters: g,
    endInput: te,
    hideDerivedSegments: q,
    historyRef: re,
    mediaDuration: ko,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: Dr,
    pendingDuplicateRef: Or,
    pendingFirstSegmentStartSecRef: kn,
    pendingTagEditSegmentIdRef: Sn,
    performerSlots: $t,
    enqueueSave: P,
    pendingChanges: R,
    retargetSaveTasks: be,
    replaceSegmentSelection: Gi,
    savingSegmentId: D,
    segments: bt,
    selectedSegment: I,
    selectedSegmentIdRef: f,
    selectedSegments: Ee,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: w,
    setCreatingSegmentId: Te,
    setEditorFilters: U,
    setFirstSegmentTagOpen: it,
    setHideDerivedSegments: L,
    setHistory: O,
    setHistoryOpen: F,
    setPublishApprovedError: Pe,
    setSaveMessage: J,
    acquireSaveLock: A,
    dispatchPendingChanges: ae,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: p,
    setTagEditing: G,
    startInput: ye,
    tagEditingRef: X,
    timelineDuration: cr,
    video: ot
  });
  function To(j = null) {
    var dt;
    if (!l || D != null || !bt.some((jt) => !jt.published && jt.reviewState === "approved")) return;
    const le = ((dt = St.current) == null ? void 0 : dt.ownerDocument) ?? document, je = le.activeElement === le.body ? null : le.activeElement;
    Ue.current = j != null && j.isConnected && j !== le.body ? j : je, Pe(""), mt(!0);
  }
  function Ao() {
    D == null && (mt(!1), Pe(""), requestAnimationFrame(() => {
      Oc(
        Ue.current,
        St.current
      ), Ue.current = null;
    }));
  }
  async function Vi() {
    await qi() && Ao();
  }
  const { closeMergeConfirmation: Ji, mergeSelectedSwimlane: Ro, saveSelectedReviewState: Yi } = Ac({
    acceptHistory: qr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: M,
    getSaveQueueSnapshot: ue,
    historyRef: re,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: ur,
    revealSegmentGroupForSelection: wo,
    savingSegmentId: D,
    selectedGroups: So,
    selectedSegment: I,
    selectedSegmentIdRef: f,
    selectedSegments: Ee,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: w,
    setMergeConfirmation: Me,
    setSaveMessage: J,
    acquireSaveLock: A,
    dispatchPendingChanges: ae,
    enqueueSave: P,
    stableSaveIdentity: z,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: p,
    video: ot
  }), Qi = (j) => {
    const le = (j || []).map(Tt);
    C.cancel((je) => je.kind === "review" && ho(je.targets, le));
  }, Zi = C.settledCount();
  sa(() => {
    C.markCommitted(Zi), k.current = {
      detail: e,
      segments: bt,
      onConflict: r,
      onDetailChange: t,
      onReload: o,
      tagEditing: _,
      selectedSegmentIds: b,
      activeSegmentId: (I == null ? void 0 : I.id) ?? null
    };
  }), fe(() => {
    C.poke();
  });
  const { toggleIncorrectExample: Xi, removeIncorrectExample: es, captureTrainingExport: ts, deleteRejectedSegments: Mo, autoAssignPerformers: ns, previewDerivedSegments: rs, closeMaterializeDialog: os, materializeDerivedSegments: as, saveTag: is, moveToBin: ss, emptyRecyclingBin: ls } = Rc({
    acceptHistory: qr,
    allSwimlanes: kt,
    autoAssignCandidates: Un,
    autoAssigning: we,
    binEmptyingRef: _e,
    canMoveSelectionToBin: xt,
    closeTagEditing: In,
    compatibilityMode: l,
    creatingSegmentId: se,
    detail: e,
    editorFilters: g,
    editorRef: St,
    exportingExamples: nr,
    hideDerivedSegments: q,
    incorrectExamples: Qt,
    lineage: Hr,
    materializeButtonRef: On,
    materializePreview: Ce,
    materializeRestoreFocusRef: fn,
    materializing: Pt,
    mutateSegment: zi,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: $t,
    cancelSaveTasks: ge,
    dispatchPendingChanges: ae,
    enqueueSave: P,
    stableSaveIdentity: z,
    pendingChanges: R,
    runSegmentMutation: Hi,
    recordHistoryAction: ur,
    refreshMaterializationPreview: yt,
    removingExampleId: rr,
    revealSegmentGroupForSelection: wo,
    savingSegmentId: D,
    segmentGroups: Ft,
    segments: bt,
    selectedSegment: I,
    selectedSegmentIdRef: f,
    selectedSegments: Ee,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: w,
    setAutoAssignError: Se,
    setAutoAssignOpen: Oe,
    setAutoAssigning: Ge,
    setEditorFilters: U,
    setExportingExamples: Rr,
    setHideDerivedSegments: L,
    setIncorrectExamples: yn,
    setMaterializeError: rn,
    setMaterializeLoading: lt,
    setMaterializeOpen: Ie,
    setMaterializePreview: Ve,
    setMaterializing: pn,
    setRemovingExampleId: Mr,
    setRejectedDeletionPreview: at,
    setSaveMessage: J,
    acquireSaveLock: A,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: p,
    video: ot
  }), { restoreHistoryTarget: ds, updateTimelineRatio: Eo, handleSeparatorPointerDown: cs, handleSeparatorPointerMove: us, handleSeparatorKeyDown: ms, panelWidthMaximum: Do, panelSeparatorProps: gs, toggleSegmentRail: ps, toggleSegmentGroup: Oo, mutateShotBoundary: fs } = Mc({
    acceptHistory: qr,
    compatibilityMode: l,
    currentTime: T,
    detail: e,
    editorLayout: ce,
    focusRowRef: xn,
    history: x,
    historyRef: re,
    historySaving: ie,
    horizontalLayoutSize: v,
    mediaStackHeight: ee,
    mediaStackRef: vn,
    commonActionsRef: sn,
    onDetailChange: t,
    onReload: o,
    railToggleRef: ar,
    recordHistoryAction: ur,
    savingSegmentId: D,
    setCollapsedSegmentGroups: V,
    setEditorLayout: E,
    setHistorySaving: N,
    setIncorrectExamples: yn,
    setSaveMessage: J,
    acquireSaveLock: A,
    enqueueSave: P,
    getSaveQueueSnapshot: ue,
    shotBoundaries: Vt,
    timelineDuration: cr,
    video: ot,
    workspaceRef: Ln
  }), { executeShortcutById: Po, stepVideoFrame: ys } = Ec({
    allSwimlanes: kt,
    applyShortcutTiming: Wi,
    centerTimelineRef: or,
    compatibilityMode: l,
    createSegment: Io,
    currentTime: T,
    deleteRejectedSegments: Mo,
    duplicateSegment: $o,
    editorLayout: ce,
    editorRef: St,
    emptyRecyclingBin: ls,
    lineage: Hr,
    mediaDuration: ko,
    mergeSelectedSwimlane: Ro,
    moveToBin: ss,
    mutateShotBoundary: fs,
    openPublishApprovedDialog: To,
    playbackControlsRef: Pn,
    playbackShortcutConfig: ji,
    saveSelectedReviewState: Yi,
    seekRef: bn,
    segmentGroupKeys: zr,
    selectSegment: No,
    selectedSegment: I,
    selectedSegmentGroupForSegment: Cn,
    selectedSegmentGroupKey: de,
    selectedSegments: Ee,
    setCollapsedSegmentGroups: V,
    setIncorrectExamplesOpen: ke,
    setQuickSearchOpen: Be,
    setSaveMessage: J,
    setSelectedSegmentGroupKey: Ne,
    setTagEditing: G,
    setTimelineZoom: Y,
    shotBoundaries: Vt,
    slotButtonRef: zt,
    splitSegment: Co,
    swimlanes: Kr,
    timelineDuration: cr,
    toggleIncorrectExample: Xi,
    toggleSegmentGroup: Oo,
    updateTimelineRatio: Eo,
    videoFrameRate: sr,
    visibleSegments: ht
  });
  hn.current = Po;
  const bs = qe(() => Zn.map((j) => ({
    id: j.id,
    enabled: Mn(j, l),
    surface: "local",
    action: (le) => {
      var je;
      return (je = hn.current) == null ? void 0 : je.call(hn, j.id, le);
    }
  })), [l]);
  Da(io, bs);
  const hs = lo(ee), vs = cn(ce.markerRailWidth, Do("markerRailWidth")), xs = cn(ce.detailWidth, Do("detailWidth"));
  return n($c, {
    activeFilterCount: Gr,
    allSwimlanes: kt,
    analysisError: Fe,
    analysisRun: De,
    analysisStatus: Dt,
    approvalFacetCounts: jr,
    autoAssignCandidates: Un,
    autoAssignError: st,
    autoAssignOpen: Ke,
    autoAssignPerformers: ns,
    autoAssigning: we,
    canMoveSelectionToBin: xt,
    captureTrainingExport: ts,
    cancelQueuedReviewsForSegments: Qi,
    removeIncorrectExample: es,
    rejectedDeletionPreview: We,
    centerTimelineRef: or,
    closeEditorFilters: Fr,
    closeFirstSegmentTagDialog: lr,
    closeMaterializeDialog: os,
    closeMergeConfirmation: Ji,
    closePublishApprovedDialog: Ao,
    closeTagEditing: In,
    collapsedSegmentGroups: Ze,
    commonActionsRef: sn,
    compatibilityMode: l,
    configuringTag: er,
    createSegment: Io,
    currentTime: T,
    deleteRejectedSegments: Mo,
    detail: e,
    detailPanelRef: M,
    detailWidth: xs,
    duplicateSegment: $o,
    editorFilters: g,
    editorLayout: ce,
    editorRef: St,
    exportingExamples: nr,
    filtersButtonRef: Fn,
    filtersOpen: B,
    firstSegmentTagOpen: $e,
    focusRowRef: xn,
    handleSeparatorKeyDown: ms,
    handleSeparatorPointerDown: cs,
    handleSeparatorPointerMove: us,
    hideDerivedSegments: q,
    history: x,
    historyOpen: oe,
    historySaving: ie,
    hasNextUnreviewed: Li,
    hasPreviousUnreviewed: Pi,
    horizontalLayoutSize: v,
    importNativeSegments: nt,
    incorrectExamples: Qt,
    incorrectExamplesOpen: Qe,
    removingExampleId: rr,
    lineage: Hr,
    markerRailWidth: vs,
    materializeButtonRef: On,
    materializeCancelButtonRef: tr,
    materializeDerivedSegments: as,
    materializeError: Lt,
    materializeLoading: pt,
    materializeOpen: et,
    materializePreview: Ce,
    materializing: Pt,
    mediaStackRef: vn,
    mergeCancelButtonRef: ut,
    mergeConfirmation: Le,
    mergeSaving: Ed(W, "merge"),
    mergeSelectedSwimlane: Ro,
    nativeImportState: gt,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: To,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: gs,
    pendingInitialSeekRef: Er,
    performerSlots: $t,
    performerSlotsAvailable: Lr,
    playbackControlsRef: Pn,
    previewDerivedSegments: rs,
    provenance: Bi,
    provenanceSources: Br,
    publishApprovedCancelButtonRef: Ye,
    publishApprovedDrafts: Vi,
    publishApprovedError: ft,
    publishApprovedOpen: Je,
    quickSearchOpen: Xe,
    railScrollRef: jn,
    railToggleRef: ar,
    recordHistoryAction: ur,
    restoreHistoryTarget: ds,
    runEditorAction: Po,
    stepVideoFrame: ys,
    saveMessage: me,
    setSaveMessage: J,
    saveTag: is,
    saveTiming: _i,
    savingSegmentId: D,
    acquireSaveLock: A,
    seekRef: bn,
    segmentGroups: Ft,
    segmentRailLayout: zn,
    segments: Ht,
    selectAllVideoSegments: Ki,
    selectSegment: No,
    selectSegmentCollection: Ui,
    selectedGroups: So,
    selectedPerformerSlots: qt,
    selectedSegment: rt,
    selectedSegmentGroupKey: de,
    selectedSegmentIds: b,
    selectedSegments: Ee,
    selectedSlotStatus: Ur,
    setAutoAssignError: Se,
    setAutoAssignOpen: Oe,
    setConfiguringTag: on,
    setCurrentTime: S,
    setEditorFilters: U,
    setEditorLayout: E,
    setFiltersOpen: H,
    setHideDerivedSegments: L,
    setHistoryOpen: F,
    setIncorrectExamplesOpen: ke,
    setQuickSearchOpen: Be,
    setRejectedDeletionPreview: at,
    setRailViewport: Bn,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: u,
    setShortcutsOpen: xe,
    setTimelineZoom: Y,
    shotBoundaries: Vt,
    shortcutsOpen: Ae,
    slotButtonRef: zt,
    splitLayout: a,
    splitSegment: Co,
    startFullAnalysis: Kt,
    tagEditing: _,
    creatingSegmentId: se,
    tagSearchRef: ir,
    timelineDuration: cr,
    timelineRatioBounds: hs,
    timelineZoom: ne,
    toggleSegmentGroup: Oo,
    toggleSegmentRail: ps,
    updateTimelineRatio: Eo,
    video: ot,
    videoPerformers: Nn,
    visibleCounts: ln,
    visibleSegmentRailRows: Oi,
    visibleSegments: ht,
    wideLayout: an,
    workspaceRef: Ln
  });
}
const Lc = /* @__PURE__ */ new Set(["queued", "running"]);
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
function Fc() {
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
async function jc(e, t, r, o) {
  const i = [...new Set(e.map(Number).filter((p) => Number.isInteger(p) && p > 0))], a = [...new Set(t)].filter((p) => ["aiTagging", "omnishotcut"].includes(p));
  if (i.length === 0 || a.length === 0)
    return { queuedIds: [], failed: [], cancelled: !1 };
  const s = a.includes("omnishotcut"), l = await Na(i, async (p) => {
    try {
      const [f, y] = await Promise.all([
        r(`/videos/${p}/analysis-runs`),
        s ? r(`/videos/${p}/editor`) : null
      ]);
      if ((f || []).some((M) => Lc.has(M == null ? void 0 : M.status)))
        throw new Error("A Full Scan is already queued or running.");
      const w = (y == null ? void 0 : y.shotBoundaries) || [];
      return { videoId: p, shotBoundaries: w };
    } catch (f) {
      return Ia(p, f);
    }
  }), d = l.filter((p) => !p.error), c = l.filter((p) => p.error), m = d.filter((p) => p.shotBoundaries.length > 0), u = m.reduce((p, f) => p + f.shotBoundaries.length, 0);
  if (u > 0 && !o(
    `Replace ${u} existing shot ${u === 1 ? "boundary" : "boundaries"} across ${m.length} selected ${m.length === 1 ? "video" : "videos"} when these scans succeed? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
  )) return { queuedIds: [], failed: c, cancelled: !0 };
  const b = await Na(d, async ({ videoId: p, shotBoundaries: f }) => {
    const y = s && f.length > 0;
    try {
      return await r(`/videos/${p}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: a,
          replaceShotBoundaries: y,
          expectedShotBoundaryFingerprint: y ? _n(f) : null
        })
      }), { videoId: p };
    } catch (w) {
      return Ia(p, w);
    }
  });
  return {
    queuedIds: b.filter((p) => !p.error).map((p) => p.videoId),
    failed: [...c, ...b.filter((p) => p.error)],
    cancelled: !1
  };
}
function Bc(e = [], t = []) {
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
function Gc(e = [], t = "", r = "all") {
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
function wt(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function Uc(e = [], t = []) {
  var p;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((f, y) => (f.sortOrder ?? 0) - (y.sortOrder ?? 0) || Number(f.id) - Number(y.id)).forEach((f, y) => {
    [...f.tags || []].sort((w, M) => (w.sortOrder ?? 0) - (M.sortOrder ?? 0) || Number(w.tagId) - Number(M.tagId)).forEach((w, M) => r.set(Number(w.tagId), {
      key: `group:${f.id}`,
      id: f.id,
      name: f.name,
      sortOrder: f.sortOrder ?? y,
      tagSortOrder: w.sortOrder ?? M
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(f, y) {
    const w = Number(f);
    if (!o.has(w)) {
      const M = r.get(w);
      o.set(w, {
        tagId: w,
        name: y || `Tag ${w}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (M == null ? void 0 : M.key) || "ungrouped",
        segmentGroupId: (M == null ? void 0 : M.id) ?? null,
        segmentGroupName: (M == null ? void 0 : M.name) || "Ungrouped",
        segmentGroupSortOrder: (M == null ? void 0 : M.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (M == null ? void 0 : M.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(w);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((f) => {
    const y = i(f.sourceTagId, f.sourceTagName), w = i(f.derivedTagId, f.derivedTagName);
    y.outgoingRuleCount++, w.incomingRuleCount++;
    const M = `${y.tagId}:${w.tagId}`;
    a.has(M) || a.set(M, {
      id: M,
      sourceTagId: y.tagId,
      derivedTagId: w.tagId,
      rules: [],
      edgeCount: 0
    });
    const g = a.get(M);
    g.rules.push(f), g.edgeCount += Number(f.edgeCount) || 0;
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
      const L = y.shift();
      w.push(L);
      for (const T of d.get(L) || [])
        c.has(T) || (c.add(T), y.push(T));
    }
    const M = new Set(w), g = w.map((L) => o.get(L)), U = l.filter((L) => M.has(L.sourceTagId) && M.has(L.derivedTagId)), B = U.flatMap((L) => L.rules), H = g.filter((L) => L.outgoingRuleCount === 0).sort((L, T) => wt(L.name, T.name)), q = H.length > 0 ? H : [...g].sort((L, T) => wt(L.name, T.name));
    m.push({
      id: [...w].sort((L, T) => L - T).join(":"),
      label: q.length > 1 ? `${q[0].name} + ${q.length - 1}` : ((p = q[0]) == null ? void 0 : p.name) || "Derivation component",
      nodes: g,
      connections: U,
      rules: B,
      segmentGroupKeys: [...new Set(g.map((L) => L.segmentGroupKey))],
      materializedEdgeCount: B.reduce(
        (L, T) => L + (Number(T.edgeCount) || 0),
        0
      )
    });
  }
  m.sort((f, y) => y.rules.length - f.rules.length || wt(f.label, y.label));
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
      var w, M;
      (w = u.get(o.get(Number(y.sourceTagId)).segmentGroupKey)) == null || w.ruleIds.add(y.id), (M = u.get(o.get(Number(y.derivedTagId)).segmentGroupKey)) == null || M.ruleIds.add(y.id);
    });
  });
  const b = [...u.values()].sort((f, y) => f.sortOrder - y.sortOrder || wt(f.name, y.name)).map((f) => ({
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
function Kc(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const m = new Map(e.nodes.map((S) => [S.tagId, /* @__PURE__ */ new Set()])), u = new Map(e.nodes.map((S) => [S.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((S) => {
    var k, C;
    (k = m.get(S.sourceTagId)) == null || k.add(S.derivedTagId), (C = u.get(S.derivedTagId)) == null || C.add(S.sourceTagId);
  });
  const b = new Map(e.nodes.map((S) => {
    var k;
    return [
      S.tagId,
      ((k = u.get(S.tagId)) == null ? void 0 : k.size) || 0
    ];
  })), p = new Map(e.nodes.map((S) => [S.tagId, 0])), f = e.nodes.filter((S) => b.get(S.tagId) === 0).sort((S, k) => wt(S.name, k.name)).map((S) => S.tagId), y = /* @__PURE__ */ new Set();
  for (; f.length > 0; ) {
    const S = f.shift();
    if (!y.has(S)) {
      y.add(S);
      for (const k of m.get(S) || [])
        p.set(k, Math.max(p.get(k) || 0, (p.get(S) || 0) + 1)), b.set(k, b.get(k) - 1), b.get(k) === 0 && f.push(k);
    }
  }
  y.size !== e.nodes.length && e.nodes.filter((S) => !y.has(S.tagId)).sort((S, k) => wt(S.name, k.name)).forEach((S) => p.set(S.tagId, 0));
  const w = Math.max(0, ...p.values()), M = Math.max(
    t,
    240 + w * 296
  ), g = /* @__PURE__ */ new Map();
  e.nodes.forEach((S) => {
    g.has(S.segmentGroupKey) || g.set(S.segmentGroupKey, {
      key: S.segmentGroupKey,
      id: S.segmentGroupId,
      name: S.segmentGroupName,
      sortOrder: S.segmentGroupSortOrder,
      nodes: []
    }), g.get(S.segmentGroupKey).nodes.push(S);
  });
  const U = [...g.values()].sort((S, k) => S.sortOrder - k.sortOrder || wt(S.name, k.name));
  let B = 28;
  const H = [], q = U.map((S) => {
    const k = /* @__PURE__ */ new Map();
    S.nodes.forEach((P) => {
      const z = p.get(P.tagId) || 0;
      k.has(z) || k.set(z, []), k.get(z).push(P);
    });
    for (const P of k.values())
      P.sort((z, Z) => z.segmentGroupTagSortOrder - Z.segmentGroupTagSortOrder || wt(z.name, Z.name));
    const C = Math.max(1, ...[...k.values()].map((P) => P.length)), W = C * 58 + (C - 1) * 18, D = 70 + W, A = {
      ...S,
      x: 12,
      y: B,
      width: M - 24,
      height: D
    };
    for (const [P, z] of k.entries()) {
      const Z = z.length * 58 + Math.max(0, z.length - 1) * 18, ge = (W - Z) / 2;
      z.forEach((be, ue) => H.push({
        ...be,
        rank: P,
        x: 28 + P * 296,
        y: B + 34 + 18 + ge + ue * 76,
        width: 184,
        height: 58
      }));
    }
    return B += D + 16, A;
  }), L = new Map(H.map((S) => [S.tagId, S])), T = e.connections.map((S) => {
    const k = L.get(S.sourceTagId), C = L.get(S.derivedTagId), W = k.x + k.width, D = k.y + k.height / 2, A = C.x, P = C.y + C.height / 2, z = Math.max(48, (A - W) * 0.48);
    return {
      ...S,
      path: `M ${W} ${D} C ${W + z} ${D}, ${A - z} ${P}, ${A} ${P}`
    };
  });
  return {
    width: M,
    height: Math.max(r, B - 16 + 28),
    nodes: H,
    connections: T,
    groups: q
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
    }), m = 20, u = o, b = c.nodes.map((f) => ({
      ...f,
      x: f.x + m,
      y: f.y + u
    })), p = new Map(b.map((f) => [f.tagId, f]));
    a.push(...b), l.push(...c.groups.map((f) => ({
      ...f,
      componentId: d.id,
      x: f.x + m,
      y: f.y + u
    }))), s.push(...c.connections.map((f) => {
      const y = p.get(f.sourceTagId), w = p.get(f.derivedTagId), M = y.x + y.width, g = y.y + y.height / 2, U = w.x, B = w.y + w.height / 2, H = Math.max(48, (U - M) * 0.48);
      return {
        ...f,
        componentId: d.id,
        path: `M ${M} ${g} C ${M + H} ${g}, ${U - H} ${B}, ${U} ${B}`
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
function Hc(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function qc(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: m, editorRef: u, emptyDraft: b, graph: p, layout: f, listSort: y, materializationOffer: w, materializeOutgoingRules: M, materializeRule: g, message: U, normalizedQuery: B, query: H, refreshConfiguredTag: q, revealEditor: L, rules: T, save: S, segmentGroupKey: k, selectedNode: C, selectedRule: W, selection: D, setConfiguringTag: A, setDraft: P, setListSort: z, setMaterializationOffer: Z, setQuery: ge, setSegmentGroupKey: be, setSelection: ue, setView: R, sortedVisibleRules: ae, sourceSlots: me, sourceSlotsLoading: J, updateMapping: ye, updateTag: ve, view: te, visibleComponents: he, visibleRules: ne } = e;
  function Y(v) {
    const h = p.nodes.find((O) => O.tagId === Number(v.sourceTagId)), x = p.nodes.find((O) => O.tagId === Number(v.derivedTagId));
    return (h == null ? void 0 : h.segmentGroupKey) === (x == null ? void 0 : x.segmentGroupKey) ? h.segmentGroupKey : "cross-group";
  }
  function ce() {
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
          onClick: () => P(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      n("div", { key: "tags", className: "space-y-3" }, [
        n("div", { key: "source", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Source tag (specific)"),
            n(Vn, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (v, h) => ve("source", v, h == null ? void 0 : h.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !J && me.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (v) => A({
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
            n(Vn, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (v, h) => ve("derived", v, h == null ? void 0 : h.label),
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
              onClick: (v) => A({
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
            disabled: r || me.length === 0 || s.length === 0,
            onClick: () => P((v) => ({
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
              onChange: (x) => ye(h, "sourceSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${h + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...me.map((x) => n("option", { key: x.id, value: x.id }, It(x)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: v.derivedSlotDefinitionId,
              disabled: r,
              onChange: (x) => ye(h, "derivedSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${h + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((x) => n("option", { key: x.id, value: x.id }, It(x)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => P((x) => ({
                ...x,
                slotMappings: x.slotMappings.filter((O, re) => re !== h)
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
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => P(null), className: o }, "Cancel")
      ])
    ]);
  }
  function E() {
    if (C) {
      const x = ne.filter((oe) => Number(oe.derivedTagId) === C.tagId), O = ne.filter((oe) => Number(oe.sourceTagId) === C.tagId), re = (oe, F, ie) => n("div", {
        key: oe.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, F),
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
            onClick: () => g(oe),
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
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, C.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, C.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${C.incomingRuleCount} incoming · ${C.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (oe) => A({
            tagId: C.tagId,
            tagName: C.name,
            trigger: oe.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        O.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => M(C, O),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${O.length})`) : null,
        O.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...O.map((oe) => re(oe, "Derives", !0))
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
            x.map((oe) => re(oe, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!W)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const v = p.nodes.find((x) => x.tagId === Number(W.sourceTagId)), h = p.nodes.find((x) => x.tagId === Number(W.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (v == null ? void 0 : v.segmentGroupName) || "Ungrouped"),
          (v == null ? void 0 : v.segmentGroupKey) !== (h == null ? void 0 : h.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(h == null ? void 0 : h.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${W.sourceTagName} → ${W.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${W.edgeCount} materialized lineage edge${W.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (w == null ? void 0 : w.ruleId) === W.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => g(W, w),
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
        W.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : W.slotMappings.map((x, O) => n("div", {
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
          W.createdAt ? new Date(W.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          W.updatedAt ? new Date(W.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(W),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => m(W),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(W),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function ee() {
    if (he.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, B ? "No derivation relationships match your search." : "No derivation rules.");
    const v = C == null ? void 0 : C.tagId, h = /* @__PURE__ */ new Set();
    return C && (h.add(C.tagId), f.connections.forEach((x) => {
      (x.sourceTagId === C.tagId || x.derivedTagId === C.tagId) && (h.add(x.sourceTagId), h.add(x.derivedTagId));
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
            const O = v === x.sourceTagId || v === x.derivedTagId, re = C != null, oe = O ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${x.id}:visible`,
              d: x.path,
              fill: "none",
              stroke: oe,
              strokeWidth: O ? 2.5 : 1.5,
              opacity: re && !O ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...f.nodes.map((x) => {
          const O = !B || x.name.toLocaleLowerCase().includes(B), re = C != null, oe = h.has(x.tagId), F = (C == null ? void 0 : C.tagId) === x.tagId;
          return n("button", {
            key: `node:${x.tagId}`,
            type: "button",
            onClick: () => ue({ type: "node", id: x.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${F ? "border-accent bg-accent/15 ring-2 ring-accent/25" : oe ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${x.x}px`,
              top: `${x.y}px`,
              width: `${x.width}px`,
              height: `${x.height}px`,
              opacity: !O || re && !oe ? 0.62 : 1
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
          const O = f.nodes.find((oe) => oe.tagId === x.sourceTagId), re = f.nodes.find((oe) => oe.tagId === x.derivedTagId);
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
  function $() {
    if (he.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        B ? "No derivation relationships match your search." : "No derivation rules."
      );
    const v = /* @__PURE__ */ new Map();
    ae.forEach((x) => {
      const O = Y(x);
      v.has(O) || v.set(O, []), v.get(O).push(x);
    });
    const h = [
      ...p.segmentGroups.map((x) => x.key),
      "cross-group"
    ].filter((x) => v.has(x));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, h.map((x) => {
      const O = p.segmentGroups.find((F) => F.key === x), re = x === "cross-group" ? "Cross-group relationships" : (O == null ? void 0 : O.name) || "Ungrouped", oe = v.get(x);
      return n("section", { key: x, "aria-label": re }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, re),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${oe.length} rule${oe.length === 1 ? "" : "s"}`
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
          ...oe.map((F) => n("button", {
            key: F.id,
            type: "button",
            role: "row",
            onClick: () => ue({ type: "rule", id: F.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(W == null ? void 0 : W.id) === F.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${F.sourceTagName} → ${F.derivedTagName}` },
              `${F.sourceTagName} → ${F.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(F.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(F.edgeCount))
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
          `${T.length} rules · ${p.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          P(b()), ue(null), L();
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
          value: H,
          onChange: (v) => {
            ge(v.target.value), ue(null);
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
            be(v.target.value), ue(null), P(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...p.segmentGroups.map((v) => n("option", { key: v.key, value: v.key }, v.name))
        ])
      ]),
      te === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: y,
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
        ].map(([v, h]) => n("button", {
          key: v,
          type: "button",
          onClick: () => {
            R(v), v === "graph" && (D == null ? void 0 : D.type) === "rule" && ue(null);
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
        d ? ce() : E()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      U ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, U) : null
    ]),
    i ? n(xo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => q(i),
      onClose: () => {
        const v = i.trigger;
        A(null), requestAnimationFrame(() => {
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
  }), [o, i] = K([]), [a, s] = K(null), [l, d] = K([]), [c, m] = K([]), [u, b] = K(!1), [p, f] = K(!1), [y, w] = K(!1), [M, g] = K(""), [U, B] = K(""), [H, q] = K("graph"), [L, T] = K("all"), [S, k] = K(null), [C, W] = K("relationship"), [D, A] = K(null), [P, z] = K(null), Z = pe(null), ge = pe(null), be = ii().replace(/:/g, "");
  function ue() {
    requestAnimationFrame(() => {
      var N;
      return (N = Z.current) == null ? void 0 : N.scrollIntoView({ block: "nearest" });
    });
  }
  async function R(N) {
    const _ = await Q("/derivation-rules", N ? { signal: N } : void 0);
    i(_ || []);
  }
  fe(() => {
    const N = new AbortController();
    return R(N.signal).catch((_) => {
      _.name !== "AbortError" && g(_.message || "Unable to load derived segment rules.");
    }), () => N.abort();
  }, []), fe(() => {
    const N = new AbortController();
    return a != null && a.sourceTagId ? (b(!0), Q(`/slot-definitions/${a.sourceTagId}`, { signal: N.signal }).then((_) => d(_.definitions || [])).catch((_) => {
      _.name !== "AbortError" && d([]);
    }).finally(() => {
      N.signal.aborted || b(!1);
    })) : (d([]), b(!1)), a != null && a.derivedTagId ? (f(!0), Q(`/slot-definitions/${a.derivedTagId}`, { signal: N.signal }).then((_) => m(_.definitions || [])).catch((_) => {
      _.name !== "AbortError" && m([]);
    }).finally(() => {
      N.signal.aborted || f(!1);
    })) : (m([]), f(!1)), () => N.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), fe(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || u || p)
      return;
    const N = `${a.sourceTagId}:${a.derivedTagId}`;
    ge.current !== N && (ge.current = N, s((_) => !_ || Number(_.sourceTagId) !== Number(a.sourceTagId) || Number(_.derivedTagId) !== Number(a.derivedTagId) ? _ : dd(_, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    u,
    p
  ]);
  function ae(N, _ = !1) {
    _ || k({ type: "rule", id: N.id }), ge.current = null, s({
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
    }), g(""), ue();
  }
  function me(N, _, G = "") {
    ge.current = null, N === "source" ? (d([]), b(_ != null)) : (m([]), f(_ != null)), s((X) => ({
      ...X,
      [`${N}TagId`]: _ == null ? null : Number(_),
      [`${N}TagName`]: G || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function J(N) {
    (a == null ? void 0 : a.ruleId) == null && (ge.current = null);
    const _ = [R(), t == null ? void 0 : t()];
    return N.draftKind === "source" ? (b(!0), _.push(Q(`/slot-definitions/${N.tagId}`).then((G) => d(G.definitions || [])).finally(() => b(!1)))) : N.draftKind === "derived" && (f(!0), _.push(Q(`/slot-definitions/${N.tagId}`).then((G) => m(G.definitions || [])).finally(() => f(!1)))), Promise.all(_);
  }
  function ye(N, _, G) {
    s((X) => ({
      ...X,
      slotMappings: X.slotMappings.map((se, Te) => Te === N ? { ...se, [_]: G } : se)
    }));
  }
  async function ve() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const N = Ca(a, o);
    if (N) {
      g(N.message);
      return;
    }
    if (a.slotMappings.some((_) => !_.sourceSlotDefinitionId || !_.derivedSlotDefinitionId)) {
      g("Complete or remove every performer slot mapping before saving.");
      return;
    }
    w(!0), g(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let _ = null;
      if (a.ruleId != null) {
        const X = await Q(
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
        _ = X.fingerprint;
      }
      g("Saving derived segment rule…");
      const G = await Q("/derivation-rules", {
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
      if (await R(), k(H === "graph" ? { type: "node", id: Number(G.sourceTagId) } : { type: "rule", id: G.id }), s(null), a.ruleId == null)
        try {
          const X = await Q(
            `/derivation-rules/${G.id}/materialization/preview`,
            { method: "POST" }
          );
          A(
            X.createCount + X.linkCount > 0 ? X : null
          ), g(X.createCount + X.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          A(null), g("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        A(null), g("Derived segment rule saved. Previous materializations were removed.");
    } catch (_) {
      g(_.message || "Unable to save derived segment rule.");
    } finally {
      w(!1);
    }
  }
  async function te(N) {
    w(!0), g("Previewing rule deletion…");
    try {
      const _ = await Q(
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
      const G = `derivation-rule-delete:${N.id}:${_.fingerprint}`;
      await Q(`/derivation-rules/${N.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ze(G),
          fingerprint: _.fingerprint
        })
      }), He(G), await R(), (a == null ? void 0 : a.ruleId) === N.id && s(null), (S == null ? void 0 : S.type) === "rule" && S.id === N.id && k(null), (D == null ? void 0 : D.ruleId) === N.id && A(null), g(`Rule deleted with ${_.deletedSegmentCount} exclusively derived segment${_.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (_) {
      g(_.message || "Unable to delete derived segment rule.");
    } finally {
      w(!1);
    }
  }
  async function he(N, _ = null) {
    const G = _ || await Q(
      `/derivation-rules/${N.id}/materialization/preview`,
      { method: "POST" }
    );
    if (G.createCount + G.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const X = `derivation-rule-materialize:${N.id}:${G.fingerprint}`, se = await Q(`/derivation-rules/${N.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: ze(X),
        fingerprint: G.fingerprint
      })
    });
    return He(X), se;
  }
  async function ne(N, _ = null) {
    w(!0), g("Finding pending derivations…");
    try {
      const G = await he(N, _);
      if (A(null), await R(), G.createdCount + G.linkedCount === 0) {
        g("Every applicable derivation is already materialized.");
        return;
      }
      g(
        `${G.createdCount} derived segment${G.createdCount === 1 ? "" : "s"} created and ${G.linkedCount} existing segment${G.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (G) {
      g(G.message || "Unable to materialize pending derivations.");
    } finally {
      w(!1);
    }
  }
  async function Y(N, _) {
    if (_.length === 0) return;
    w(!0), g(`Finding pending derivations from ${N.name}…`);
    let G = 0, X = 0;
    try {
      for (const se of _) {
        const Te = await he(se);
        G += Te.createdCount, X += Te.linkedCount;
      }
      A(null), await R(), g(G + X === 0 ? `Every outgoing derivation from ${N.name} is already materialized.` : `${G} derived segment${G === 1 ? "" : "s"} created and ${X} existing segment${X === 1 ? "" : "s"} linked from ${N.name}.`);
    } catch (se) {
      await R().catch(() => {
      }), g(se.message || `Unable to materialize derivations from ${N.name}.`);
    } finally {
      w(!1);
    }
  }
  const ce = Ca(a, o), E = qe(
    () => Uc(o, e),
    [o, e]
  ), ee = U.trim().toLocaleLowerCase(), v = E.components.filter((N) => L === "all" || N.segmentGroupKeys.includes(L)).filter((N) => !ee || N.nodes.some((_) => _.name.toLocaleLowerCase().includes(ee))), h = v.flatMap((N) => N.rules), x = new Set(
    v.flatMap((N) => N.nodes.map((_) => _.tagId))
  ), O = qe(
    () => zc(v),
    [v]
  ), re = H === "list" ? Hc(
    S,
    h,
    ee.length > 0
  ) : null, oe = (S == null ? void 0 : S.type) === "node" && E.nodes.find((N) => N.tagId === S.id && x.has(N.tagId)) || null, F = [...h].sort((N, _) => C === "source" ? wt(N.sourceTagName, _.sourceTagName) || wt(N.derivedTagName, _.derivedTagName) : C === "target" ? wt(N.derivedTagName, _.derivedTagName) || wt(N.sourceTagName, _.sourceTagName) : C === "materialized" ? (Number(_.edgeCount) || 0) - (Number(N.edgeCount) || 0) || wt(N.sourceTagName, _.sourceTagName) : wt(
    `${N.sourceTagName} ${N.derivedTagName}`,
    `${_.sourceTagName} ${_.derivedTagName}`
  ));
  return n(qc, {
    arrowMarkerId: be,
    busy: y,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: P,
    deleteRule: te,
    derivedSlots: c,
    derivedSlotsLoading: p,
    draft: a,
    draftIssue: ce,
    editRule: ae,
    editorRef: Z,
    emptyDraft: r,
    graph: E,
    layout: O,
    listSort: C,
    materializationOffer: D,
    materializeOutgoingRules: Y,
    materializeRule: ne,
    message: M,
    normalizedQuery: ee,
    query: U,
    refreshConfiguredTag: J,
    revealEditor: ue,
    rules: o,
    save: ve,
    segmentGroupKey: L,
    selectedNode: oe,
    selectedRule: re,
    selection: S,
    setConfiguringTag: z,
    setDraft: s,
    setListSort: W,
    setMaterializationOffer: A,
    setQuery: B,
    setSegmentGroupKey: T,
    setSelection: k,
    setView: q,
    sortedVisibleRules: F,
    sourceSlots: l,
    sourceSlotsLoading: u,
    updateMapping: ye,
    updateTag: me,
    view: H,
    visibleComponents: v,
    visibleRules: h
  });
}
function Wc() {
  const [e, t] = K(ei), r = [
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
        onChange: (m) => o(a, m.target.value),
        className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
      })
    ])))
  ]);
}
function Vc({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = K([]), [a, s] = K(!1), [l, d] = K(!1), [c, m] = K(""), [u, b] = K(""), [p, f] = K("all"), [y, w] = K(() => /* @__PURE__ */ new Set()), [M, g] = K(null);
  fe(() => {
    if (!e || a) return;
    const A = new AbortController();
    return d(!0), m(""), Q("/slot-definitions", { signal: A.signal }).then((P) => {
      i(P || []), s(!0);
    }).catch((P) => {
      P.name !== "AbortError" && m(P.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      A.signal.aborted || d(!1);
    }), () => A.abort();
  }, [e, a]);
  async function U() {
    d(!0), m("");
    try {
      const A = await Q("/slot-definitions");
      i(A || []), s(!0);
    } catch (A) {
      m(A.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function B() {
    const [A] = await Promise.all([
      Q("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(A || []), s(!0), m("");
  }
  function H() {
    const A = M == null ? void 0 : M.trigger;
    g(null), requestAnimationFrame(() => {
      A != null && A.isConnected && A.focus({ preventScroll: !0 });
    });
  }
  function q(A) {
    w((P) => {
      const z = new Set(P);
      return z.has(A) ? z.delete(A) : z.add(A), z;
    });
  }
  const L = qe(
    () => Bc(t, o),
    [t, o]
  ), T = qe(
    () => Gc(L, u, p),
    [L, u, p]
  ), S = L.flatMap((A) => A.tags), k = S.filter((A) => A.definitions.length > 0).length, C = S.length - k, W = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], D = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${S.length} tags · ${k} with slots · ${C} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: u,
          onChange: (A) => b(A.target.value),
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
          W.map(([A, P]) => n("button", {
            key: A,
            type: "button",
            onClick: () => f(A),
            "aria-pressed": p === A,
            className: `rounded px-3 py-1.5 text-xs font-medium ${p === A ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, P))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => w(/* @__PURE__ */ new Set()),
          className: D
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => w(new Set(L.map((A) => A.overviewKey))),
          className: D
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
    a && T.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, T.map((A) => {
      const P = y.has(A.overviewKey), z = A.tags.filter((Z) => Z.definitions.length > 0).length;
      return n("article", {
        key: A.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => q(A.overviewKey),
          "aria-expanded": !P,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, P ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, A.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${A.tags.length} tag${A.tags.length === 1 ? "" : "s"} · ${z} with slots`
          )
        ]),
        P ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          A.tags.map((Z) => n("li", {
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
            }, Z.definitions.map((ge) => n("li", {
              key: ge.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, It(ge)),
              ...(ge.genderHints || []).map((be) => n("span", {
                key: be,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, $r(be)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (ge) => g({
                tagId: Z.tagId,
                tagName: Z.tagName,
                trigger: ge.currentTarget
              }),
              "aria-label": `Edit performer slots for ${Z.tagName}`,
              className: `${D} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    M ? n(xo, {
      key: `performer-slots-configure:${M.tagId}`,
      tagId: M.tagId,
      tagName: M.tagName,
      onSaved: B,
      onClose: H
    }) : null
  ]);
}
function Jc({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = K("general"), [a, s] = K([]), [l, d] = K(!1), [c, m] = K(""), [u, b] = K(""), [p, f] = K(null), [y, w] = K(!0), [M, g] = K(!1), [U, B] = K(""), [H, q] = K(!0), [L, T] = K(Wa), S = Cl(t), k = S.map(([P]) => P);
  fe(() => {
    k.includes(o) || i(k[0] || "general");
  }, [t.effectiveMode]);
  async function C(P) {
    const z = await Q("/segment-groups", P ? { signal: P } : void 0);
    s(z || []);
  }
  fe(() => {
    const P = new AbortController();
    return C(P.signal).catch((z) => {
      z.name !== "AbortError" && m(z.message || "Unable to load tag groups.");
    }), () => P.abort();
  }, []), fe(() => {
    if (t.effectiveMode !== "full") {
      w(!1);
      return;
    }
    const P = new AbortController();
    return B(""), w(!0), Promise.all([
      Q("/analysis/settings", { signal: P.signal }),
      Q("/analysis/status", { signal: P.signal })
    ]).then(([z, Z]) => {
      q(!0), b((z == null ? void 0 : z.baseUrl) || ""), f(Z);
    }).catch((z) => {
      if (z.name !== "AbortError") {
        if (z.status === 403) {
          q(!1), B("You do not have permission to manage the analysis service connection.");
          return;
        }
        B(z.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      P.signal.aborted || w(!1);
    }), () => P.abort();
  }, [t.effectiveMode]);
  async function W(P) {
    if (P !== t.requestedMode) {
      d(!0), m("");
      try {
        const z = await Q(
          `/preferences/transition?mode=${encodeURIComponent(P)}`
        );
        let Z = !1, ge = null, be = null, ue = null, R = !1;
        if (t.requestedMode === "basic" && P === "full") {
          if (!window.confirm(Al(
            z.recyclingBinCount,
            z.protectedRecyclingBinCount
          )))
            return;
          R = !0, z.recyclingBinCount > 0 && (Z = !0, ue = z.recyclingBinFingerprint, ge = `mode-switch-empty-bin:${ue}`, be = ze(ge));
        }
        let ae = !1;
        if (t.requestedMode === "full" && P === "basic") {
          if (!window.confirm(Tl(
            z.extensionOwnedSegmentCount
          )))
            return;
          ae = !0;
        }
        const me = await Q("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: P,
            confirmHiddenExtensionOwnedSegments: ae,
            confirmBasicHistoryCleanup: R,
            emptyRecyclingBin: Z,
            operationId: be,
            expectedRecyclingBinFingerprint: ue
          })
        });
        ge && He(ge), r == null || r(ti(me)), m("Workflow mode saved.");
      } catch (z) {
        m(z.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function D(P) {
    P.preventDefault(), g(!0), B("");
    try {
      const z = await Q("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: u })
      });
      b((z == null ? void 0 : z.baseUrl) || "");
      const Z = await Q("/analysis/status");
      f(Z), B(z != null && z.baseUrl ? Z != null && Z.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(Z == null ? void 0 : Z.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (z) {
      B(z.message || "Unable to save analysis service settings.");
    } finally {
      g(!1);
    }
  }
  const A = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (P) => Ti(P, e, A), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      S.map(([P, z]) => n("button", {
        key: P,
        type: "button",
        onClick: () => i(P),
        "aria-current": o === P ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === P ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, z))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(Wc)
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
      n(dc, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: W,
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
          checked: L,
          onChange: (P) => {
            const z = P.target.checked;
            Va(z), T(z);
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
      n("form", { key: "form", onSubmit: D, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
        n("label", { key: "url", className: "min-w-0 flex-1 space-y-1" }, [
          n("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Server URL"),
          n("input", {
            key: "input",
            type: "url",
            value: u,
            onChange: (P) => b(P.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: y || M || !H,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: y || M || !H,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, M ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        U || (y ? "Loading analysis service settings…" : (p == null ? void 0 : p.configured) === !1 ? "Full Scan is not configured." : p != null && p.ready ? "Analysis service is ready." : (p == null ? void 0 : p.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    k.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(_c, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => C()
      })
    ) : null,
    k.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(Vc, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => C()
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
    n("span", { key: "label" }, It(a)),
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
function Yc({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var m, u;
  const s = [...e.slots || []].sort((b, p) => b.sortOrder - p.sortOrder || String(b.slotDefinitionId).localeCompare(String(p.slotDefinitionId))), l = [...new Map(s.map((b) => [
    b.performerId,
    { id: b.performerId, name: b.performerName }
  ])).values()], d = s.map((b) => ({
    slotDefinitionId: b.slotDefinitionId,
    label: It(b),
    performer: { id: b.performerId, name: b.performerName }
  })), c = ri(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: mi(t)
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
          n(gn, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((u = e.activity) == null ? void 0 : u.name) || "Tag segment"),
          l.length ? n(Tr, {
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
function Qc({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
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
      clip: { start: e.startSec, end: El(e), loop: !1 },
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
  const r = qe(() => {
    const R = Oa("ext:com.midnightrider.segment-studio:segments");
    return R ? {
      ...Wr,
      defaultFilter: { ...Wr.defaultFilter, ...R.findFilter || {} },
      defaultObjectFilter: R.objectFilter || {}
    } : Wr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Pa(r), [l, d] = K(null), [c, m] = K({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [u, b] = K(null), [p, f] = K(null), [y, w] = K(0), [M, g] = K(""), [U, B] = K(!0), [H, q] = K(""), L = pe(0), T = na(o, i), S = T.activityTagId, k = Rn(i.slots), C = qe(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (R) => Object.keys(Rn(R)).length > 0,
    sanitize: (R) => Vr(S, Rn(R)),
    summarize: (R) => `${Object.keys(Rn(R)).length} assigned`,
    renderEditor: (R, ae) => S ? n($a, {
      facets: l,
      values: Rn(R),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (me, J) => {
        const ye = { ...Rn(R) };
        J ? ye[me] = Number(J) : delete ye[me], ae(Vr(S, ye));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [S, l, c.performerSlotsAvailable]), W = JSON.stringify(T);
  fe(() => {
    if (d(null), !S) return;
    const R = new AbortController();
    return Q(`/browse/activities/${S}/facets`, { signal: R.signal }).then(d).catch((ae) => {
      ae.status === 403 ? d({ slots: [], restricted: !0 }) : ae.name !== "AbortError" && q(ae.message);
    }), () => R.abort();
  }, [S]), fe(() => {
    const R = ++L.current, ae = new AbortController();
    return B(!0), q(""), Q("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(T), signal: ae.signal }).then((me) => {
      R === L.current && m({ ...me, totalCount: me.totalCount ?? me.total ?? 0 });
    }).catch((me) => {
      if (!(R !== L.current || me.name === "AbortError")) {
        if (me.status === 400 && me.message.includes("unrestricted performer read access")) {
          m((J) => ({ ...J, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), q("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        q(me.message);
      }
    }).finally(() => {
      R === L.current && B(!1);
    }), () => {
      L.current++, ae.abort();
    };
  }, [W, y]);
  const D = c.items.findIndex((R) => R.key === u), A = c.items[D] || null;
  function P(R) {
    s(R), a({ ...o, page: 1 });
  }
  function z(R) {
    const ae = na(o, R), me = R.slots && ae.activityTagId != null && ae.slotAssignments.length > 0 ? R.slots : void 0;
    P({ ...R, slots: me });
  }
  function Z(R, ae) {
    const me = { ...k };
    ae ? me[R] = Number(ae) : delete me[R], P({ ...i, slots: Vr(S, me) });
  }
  function ge() {
    const R = document.querySelector(`[data-segment-key="${u}"]`);
    b(null), requestAnimationFrame(() => R == null ? void 0 : R.focus());
  }
  async function be(R) {
    var J;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    f(R.key), g("");
    const ae = `browse-restore:${R.itemId}:${R.revision}`, me = ze(ae);
    try {
      const ye = (ve = !1) => Q(`/bin/${R.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: me,
          expectedRevision: R.revision,
          discardMissingImage: ve
        })
      });
      try {
        await ye(mo(ae));
      } catch (ve) {
        if (((J = ve.payload) == null ? void 0 : J.code) !== "missing-image" || !window.confirm(`${ve.message}

Continue and discard the missing image reference?`))
          throw ve;
        go(ae), await ye(!0);
      }
      He(ae), u === R.key && b(null), g("Segment restored to Cove."), w((ve) => ve + 1);
    } catch (ye) {
      g(ye.message || "Unable to restore the segment."), ye.status === 409 && w((ve) => ve + 1);
    } finally {
      f(null);
    }
  }
  async function ue(R) {
    f(R.key), g("");
    try {
      const ae = await Q(`/items/${R.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: R.revision })
      });
      if (!li(ae, g) || !_l(ae))
        return;
      const me = `browse-dependency-delete:${R.itemId}:${ae.fingerprint}`;
      await Q(`/items/${R.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ze(me),
          fingerprint: ae.fingerprint
        })
      }), He(me), u === R.key && b(null), g(`${ae.deletedSegmentCount} segment${ae.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), w((J) => J + 1);
    } catch (ae) {
      g(ae.message || "Unable to permanently delete the segment."), ae.status === 409 && w((me) => me + 1);
    } finally {
      f(null);
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
      isLoading: U,
      error: H ? new Error(H) : null,
      onRetry: () => w((R) => R + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? ta.filter((R) => R.id !== "performers") : ta,
      objectFilter: i,
      onObjectFilterChange: z,
      customFilterSections: C,
      searchPlaceholder: "Search segments..."
    }, [
      S ? n($a, { key: "slots", facets: l, values: k, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: Z }) : null,
      n(Qc, { key: "player", item: A, index: D, count: c.items.length, onPrevious: () => {
        var R;
        return b((R = c.items[D - 1]) == null ? void 0 : R.key);
      }, onNext: () => {
        var R;
        return b((R = c.items[D + 1]) == null ? void 0 : R.key);
      }, onClose: ge, onNavigate: e }),
      M ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, M) : null,
      !U && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      U ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((R) => n(Yc, {
        key: R.key,
        item: R,
        selected: R.key === u,
        busy: p === R.key,
        onSelect: () => b(R.key),
        onRestore: be,
        onPurge: ue
      })))
    ])
  ]);
}
function Zc({ onNavigate: e, profile: t }) {
  const [r, o] = K([]), [i, a] = K(""), [s, l] = K(0), [d, c] = K(!0), [m, u] = K(null), [b, p] = K(""), f = pe(null);
  async function y(g) {
    const U = await Q("/bin", g ? { signal: g } : void 0);
    return o(U.items || []), a(U.fingerprint || ""), l(Number(U.totalCount) || 0), U;
  }
  fe(() => {
    const g = new AbortController();
    return c(!0), y(g.signal).catch((U) => {
      U.name !== "AbortError" && p(U.message);
    }).finally(() => {
      g.signal.aborted || c(!1);
    }), () => g.abort();
  }, []), Da(io, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var g;
      return (g = f.current) == null ? void 0 : g.call(f);
    }
  }]);
  async function w(g) {
    var H;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    u(g.itemId), p("");
    const U = `restore:${g.itemId}:${g.revision}`, B = ze(U);
    try {
      const q = (L = !1) => Q(`/bin/${g.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: B, expectedRevision: g.revision, discardMissingImage: L })
      });
      try {
        await q(mo(U));
      } catch (L) {
        if (((H = L.payload) == null ? void 0 : H.code) !== "missing-image" || !window.confirm(`${L.message}

Continue and discard the missing image reference?`)) throw L;
        go(U), await q(!0);
      }
      He(U), await y(), Wn(), p("Segment restored with a new native ID.");
    } catch (q) {
      p(q.message || "Unable to restore the segment."), q.status === 409 && await y();
    } finally {
      u(null);
    }
  }
  async function M() {
    if (m == null)
      try {
        const g = await ci({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          u(-1), p("");
        });
        if (g.status !== "emptied") return;
        await y(), Wn(), p(`${g.segmentCount} segment${g.segmentCount === 1 ? "" : "s"} from ${g.sceneCount} scene${g.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (g) {
        p(g.message || "Unable to empty the recycling bin."), g.status === 409 && await y();
      } finally {
        u(null);
      }
  }
  return f.current = M, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
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
        disabled: d || m != null || s === 0,
        onClick: M,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, m === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    b ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, b) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((g) => n("article", { key: g.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${g.tagName || "Tag segment"} · ${g.videoTitle || `Video ${g.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, g.endSec == null ? Re(g.startSec) : `${Re(g.startSec)} – ${Re(g.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${g.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${g.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: m != null, onClick: () => w(g), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
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
  const i = qe(() => {
    var ne;
    const te = Oa(Aa), he = (ne = te == null ? void 0 : te.uiOptions) == null ? void 0 : ne.displayMode;
    return te ? {
      ...Hn,
      defaultFilter: { ...Hn.defaultFilter, ...te.findFilter || {} },
      defaultObjectFilter: te.objectFilter || {},
      defaultDisplayMode: Hn.allowedDisplayModes.includes(he) ? he : Hn.defaultDisplayMode
    } : Hn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: m } = Pa(i), [u, b] = K({ items: [], totalCount: 0 }), [p, f] = K(!0), [y, w] = K(""), [M, g] = K(0), [U, B] = K(/* @__PURE__ */ new Set()), [H, q] = K(null), [L, T] = K({ busy: !1, error: "", announcement: "" }), S = pe(0), k = pe(null), C = pe(null);
  C.current || (C.current = Fc());
  const W = JSON.stringify(a), D = JSON.stringify(s), A = t || r === "review";
  fe(() => {
    C.current.selectionChanged(), k.current = null, B(/* @__PURE__ */ new Set()), T((te) => ({ busy: te.busy, error: "", announcement: "" }));
  }, [W, D]), fe(() => {
    if (!A) return;
    const te = new AbortController();
    return Q("/analysis/status", { signal: te.signal }).then(q).catch((he) => {
      he.name !== "AbortError" && q({ configured: !0, ready: !1, error: he.message || "Unable to check Full Scan readiness." });
    }), () => te.abort();
  }, [A]), fe(() => {
    const te = ++S.current, he = new AbortController();
    return f(!0), w(""), Q(`/videos?${oc(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: he.signal }).then((ne) => {
      te === S.current && b(ne);
    }).catch((ne) => {
      te === S.current && ne.name !== "AbortError" && w(ne.message || "Unable to discover videos.");
    }).finally(() => {
      te === S.current && f(!1);
    }), () => {
      S.current++, he.abort();
    };
  }, [W, D, t, r, M]);
  function P(te) {
    d({ ...te, page: te.page || 1 });
  }
  function z(te) {
    c(te), d({ ...a, page: 1 });
  }
  function Z(te, he = !1) {
    B((ne) => ac(
      ne,
      u.items.map((Y) => Y.videoId),
      te,
      k.current,
      he
    )), k.current = te;
  }
  function ge() {
    k.current = null, B(new Set(u.items.map((te) => te.videoId)));
  }
  function be() {
    k.current = null, B(/* @__PURE__ */ new Set());
  }
  function ue() {
    k.current = null, B((te) => new Set(u.items.map((he) => he.videoId).filter((he) => !te.has(he))));
  }
  async function R(te = ["aiTagging", "omnishotcut"]) {
    const he = C.current.begin();
    if (he) {
      T({ busy: !0, error: "", announcement: "" });
      try {
        const ne = await jc(
          [...U],
          te,
          Q,
          (Y) => window.confirm(Y)
        );
        if (ne.cancelled) {
          T({ busy: !1, error: "", announcement: "" });
          return;
        }
        ne.queuedIds.length > 0 && C.current.ownsCurrentSelection(he) && (ne.queuedIds.includes(k.current) && (k.current = null), B((Y) => {
          const ce = new Set(Y);
          return ne.queuedIds.forEach((E) => ce.delete(E)), ce;
        })), T({
          busy: !1,
          announcement: ne.queuedIds.length > 0 ? `${ne.queuedIds.length} ${ne.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: ne.failed.length > 0 ? `${ne.failed.length} selected ${ne.failed.length === 1 ? "video could" : "videos could"} not be queued. ${ne.failed[0].error}` : ""
        });
      } catch (ne) {
        T({ busy: !1, error: ne.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        C.current.finish(he);
      }
    }
  }
  const ae = t || r === "review" ? va : va.filter((te) => !["reviewState", "shotBoundaries"].includes(te.id)), me = H === null || H.configured === !1 || H.ready === !1, J = L.busy || me, ye = (H == null ? void 0 : H.error) || (H === null ? "Checking Full Scan availability" : H.configured === !1 ? "Configure the analysis service before running Full Scan" : H.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), ve = L.busy ? "Queueing scans…" : H === null ? "Checking Full Scan…" : H.configured === !1 ? "Full Scan not configured" : H.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
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
      onFilterChange: P,
      totalCount: u.totalCount,
      isLoading: p,
      error: y ? new Error(y) : null,
      onRetry: () => g((te) => te + 1),
      sortOptions: t || r === "review" ? [...ha, { value: "unreviewed_count", label: "Unreviewed count" }] : ha,
      displayMode: l,
      onDisplayModeChange: m,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: ae,
      objectFilter: s,
      onObjectFilterChange: z,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: A ? U : void 0,
      onSelectAll: A ? ge : void 0,
      onSelectNone: A ? be : void 0,
      onInvertSelection: A ? ue : void 0,
      selectionActions: A ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: J,
          onClick: () => R(),
          title: ye,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, ve),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": J,
            title: ye,
            onClick: (te) => {
              J && te.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${J ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(Fa, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([te, he]) => n("button", {
            key: te,
            type: "button",
            disabled: L.busy,
            onClick: (ne) => {
              var Y;
              (Y = ne.currentTarget.closest("details")) == null || Y.removeAttribute("open"), R(he);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, te)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, L.announcement),
      L.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, L.error) : null,
      !p && u.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !p && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, u.items.map((te) => n(ic, { key: te.videoId, item: te, onNavigate: e, showReviewStates: A, selected: U.has(te.videoId), selectionActive: U.size > 0, onSelect: A ? Z : null }))) : null,
      !p && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, u.items.map((te) => n(sc, { key: te.videoId, item: te, onNavigate: e, showReviewStates: A, selected: U.has(te.videoId), selectionActive: U.size > 0, onSelect: A ? Z : null }))) : null
    ])
  ]);
}
function Ra({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = K(null), [s, l] = K(!0), [d, c] = K(""), m = pe(0), u = pe(0), b = pe(e), p = Hd();
  b.current = e;
  const [f] = K(() => Ks({
    beginRequest: () => ({ requestId: ++u.current, videoId: b.current }),
    fetchDetail: (B) => Q(y(B.videoId)),
    isCurrent: (B) => mr(B.requestId, u.current, B.videoId, b.current),
    isSameVideo: (B) => B.videoId === b.current
  })), y = (B) => `/videos/${B}/editor`;
  async function w(B, H, q) {
    const L = await Q(y(H), q ? { signal: q.signal } : void 0);
    return mr(B, q ? m.current : u.current, H, b.current) ? (a(L), !0) : !1;
  }
  fe(() => {
    const B = ++m.current, H = e, q = new AbortController();
    return a(null), l(!0), c(""), w(B, H, q).catch((L) => {
      mr(B, m.current, H, b.current) && L.name !== "AbortError" && c(L.message || "Unable to load the editor.");
    }).finally(() => {
      mr(B, m.current, H, b.current) && l(!1);
    }), () => {
      m.current++, u.current++, q.abort();
    };
  }, [e]);
  function M(B, H) {
    a((q) => (q == null ? void 0 : q.video.id) !== H ? q : typeof B == "function" ? B(q) : B);
  }
  function g() {
    return f({
      onLoaded: (B) => {
        a(B), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: (B) => c(B.message || "Unable to reload the latest segment.")
    });
  }
  function U() {
    return f({
      onLoaded: (B) => {
        a(B), c("");
      },
      onError: (B) => c(B.message || "Unable to reload performer slots.")
    });
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
      n(Cs, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(Pc, {
      key: i.video.id,
      detail: i,
      onDetailChange: M,
      onConflict: g,
      onReload: U,
      onSlotsChanged: U,
      splitLayout: p,
      profile: o,
      initialSegmentId: oa() ? -oa() : Dl(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function Xc(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function eu(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function tu(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function nu({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = Nl(o), l = Xc(e, t, window.location.pathname), d = eu(e, t, window.location.pathname), c = tu(e, t, window.location.pathname), m = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if ($l(m, o) === "videos" && m !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Yr, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(Jc, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(Ta, { onNavigate: r, profile: o });
    const p = Number(e);
    return Number.isInteger(p) && p > 0 ? n(Ra, {
      videoId: p,
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
  if (c) return n(Zc, { onNavigate: r, profile: o });
  const b = Number(e);
  return d ? n(Ta, { onNavigate: r, profile: o }) : Number.isInteger(b) && b > 0 ? n(Ra, {
    videoId: b,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(Yr, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function ru({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = K(null), [a, s] = K("");
  return fe(() => {
    const l = new AbortController();
    return Q("/preferences", { signal: l.signal }).then((d) => i(ti(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(nu, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function ou(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function au(e, t) {
  const r = ou(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const Ru = {
  components: { SegmentStudioPage: ru },
  actionHandlers: { openSegmentStudio: au }
};
export {
  wr as CLEARED_SEGMENT_SELECTION_ID,
  ha as DISCOVERY_SORT_OPTIONS,
  Yt as SEGMENT_STUDIO_CAPABILITIES,
  io as SEGMENT_STUDIO_EXTENSION_ID,
  Zn as SEGMENT_STUDIO_SHORTCUTS,
  _s as activeEditorFilterCount,
  Ld as addPendingChange,
  dd as applyDerivationRuleSlotSuggestions,
  vr as applyFeedbackEditorDelta,
  Bd as applyPendingChanges,
  ua as applySegmentMergeDelta,
  Jl as basicSegmentTimelineStyle,
  El as browseClipEnd,
  ri as browseEditorHref,
  na as buildBrowseRequest,
  Uc as buildDerivationRuleGraph,
  oc as buildDiscoverySearchParams,
  Ms as buildMinuteTimelineTicks,
  Bc as buildPerformerSlotOverview,
  jl as buildSegmentQuickSearchEntries,
  pd as buildSegmentRailRows,
  fd as buildTimelineRows,
  uu as buildTimelineTicks,
  Ps as calculateCenteredTimelineScroll,
  Zr as calculateEditorPanelMaximum,
  Es as calculateMinuteLabelStride,
  mu as calculateMinuteTimelineWidth,
  js as calculateSwimlaneTitleMaximum,
  Ls as calculateTimelinePlayheadPosition,
  lo as calculateTimelineRatioBounds,
  Gs as calculateTimelineRatioFromPointer,
  gu as calculateVerticalRevealOffset,
  cn as clampEditorPanelWidth,
  hr as clampSwimlaneTitleWidth,
  _a as clampTimelineRatio,
  co as clampTimelineRatioForHeight,
  kr as clampTimelineZoom,
  ec as compactProvenanceSummary,
  Gd as confirmPendingChange,
  Fc as createBulkAnalysisCoordinator,
  Ks as createEditorReloader,
  gl as createQueuedReviewRequest,
  Dd as createSaveQueue,
  wa as createSegmentAnalysisRequestScope,
  Ru as default,
  Ii as discardPendingChange,
  ql as downloadFileNameFromContentDisposition,
  Ws as dualRangeValueFromPointer,
  Zo as duplicateIdentityFromResponse,
  yl as duplicateOperationKey,
  Ja as editorVisibilityIncludingSegment,
  hd as expandedSwimlanes,
  Tl as extensionOwnedSegmentsModeSwitchPrompt,
  wd as feedbackFrameTimestamps,
  Id as feedbackResultMatchesAction,
  Nd as feedbackSelectionPlan,
  qs as filterDerivedSegments,
  _r as filterEditorSegments,
  Gc as filterPerformerSlotOverview,
  Fl as filterSegmentQuickSearch,
  hu as filterSegmentStudioShortcuts,
  Sd as findAdjacentSegmentGroupKey,
  kl as findAdjacentShot,
  cl as findEditorShortcut,
  qa as findInitialSegmentSelection,
  Rs as findNearestSegmentInCurrentSwimlane,
  Sl as findPublishedSelectionIdentity,
  tt as findSegmentByStableIdentity,
  Us as findSegmentFromPlayhead,
  As as findSegmentNearPlayhead,
  xd as findSwimlaneRangeSelection,
  ro as findSwimlaneSelection,
  Pl as findUniquePerformerSlotAssignment,
  Sr as findUnreviewedSelection,
  od as focusDialogDefaultButton,
  $r as formatGenderHint,
  wl as frameStepSeconds,
  oi as generatePerformerSlotAssignmentRecommendations,
  bc as groupApprovedDraftsForPublishing,
  Ll as groupAutoAssignCandidates,
  Cd as groupIncorrectExamplesByTag,
  kc as groupMaterializationOutputs,
  un as groupSegmentsIntoSwimlanes,
  yd as groupSelectedSwimlanes,
  bo as groupSwimlanesBySegmentGroup,
  Rt as handleModalKey,
  yi as hasGroupedSwimlanes,
  En as hasSegmentStudioCapability,
  wi as heldTagChangeFor,
  xl as heldTagReady,
  ga as hideCollectedFeedbackSegments,
  da as historyActionsForTarget,
  pr as incorrectExampleHistoryState,
  fi as indexPerformerSlotsBySegment,
  Su as initialReviewFilter,
  Ad as insertSegmentProjection,
  mr as isCurrentEditorRequest,
  ed as isEditableTarget,
  wu as isEditorShortcutOwner,
  Ed as isKindRunning,
  Au as isSaveQueueBusy,
  tu as isSegmentStudioBinRoute,
  eu as isSegmentStudioSegmentsRoute,
  Xc as isSegmentStudioSettingsRoute,
  Kc as layoutDerivationRuleComponent,
  zc as layoutDerivationRuleComponents,
  Md as mergeSegmentsProjection,
  sd as multiSelectionActionHint,
  tl as nextSegmentAfterRemoval,
  nl as nextUnreviewedAfterRemoval,
  nn as normalizeCollapsedSegmentGroups,
  Sa as normalizeDiscoveryIds,
  Et as normalizeEditorSegmentFilters,
  en as normalizeGender,
  Xo as normalizeReviewFilter,
  ti as normalizeSegmentStudioFeatureProfile,
  vu as normalizeSegmentStudioMode,
  to as normalizeSegmentStudioPublicMode,
  Rn as parseBrowseSlotFilters,
  Bs as parseEditorLayout,
  zs as parseHideDerivedSegmentsPreference,
  Hs as parseMergeConfirmationPreference,
  Xa as parsePlaybackShortcutConfig,
  ll as parseShortcutBindingOverrides,
  Xt as patchPerformerSlotProjection,
  Cu as patchSegmentProjection,
  Ud as pendingChangesReducer,
  Fd as pendingInsertedSegments,
  rl as percentageSeekTime,
  Ol as performInitialSegmentSeek,
  ct as performerOptionId,
  Nr as performerSlotHistoryState,
  It as performerSlotLabel,
  cd as performerSlotPresentation,
  Iu as performerSlotStatus,
  yo as performerSlotStatusFromSegmentSlots,
  pi as performerSlotsForSegment,
  Ut as provenanceSourceLabel,
  $i as prunePendingChanges,
  vl as queueCreatedSegmentTagChoice,
  ai as rankPerformerOptions,
  kd as reconcileSegmentGroupKey,
  Xs as reconcileSelectedSegmentIds,
  lc as recyclingBinActionText,
  Wl as recyclingBinDeletionPrompt,
  di as recyclingBinDeletionSummary,
  Al as recyclingBinModeSwitchPrompt,
  xu as removeQueuedReviewsForSegments,
  Rd as removeSegmentsProjection,
  oa as requestedOwnedItemId,
  Dl as requestedSegmentId,
  Js as resolveEditorSegmentSelection,
  pl as resolveQueuedReviewRequest,
  bl as resolveSegmentCreationAction,
  $l as resolveSegmentStudioRoute,
  dl as resolveSegmentStudioShortcuts,
  Si as resolveSegmentTarget,
  Hc as resolveSelectedDerivationRule,
  Jo as resolveSelectedSegments,
  Cc as restoreDisabledToolbarActionFocus,
  Oc as restorePublishApprovedFocus,
  $u as restoreSegmentFieldsProjection,
  Tu as restoreSegmentsProjection,
  jd as retargetPendingChanges,
  xi as revealCollapsedSegmentGroup,
  jc as runSelectedDiscoveryAnalysis,
  Dn as sameSegmentIdentity,
  ki as savingSegmentIdFrom,
  ui as segmentBadgeStyle,
  Cr as segmentGroupHeaderBackground,
  Bt as segmentGroupKeyForSegment,
  fo as segmentHistoryIdentity,
  gr as segmentHistoryState,
  Tt as segmentIdentity,
  mi as segmentRailItemStyle,
  ku as segmentStateStyle,
  ou as segmentStudioActionTarget,
  Nl as segmentStudioLegacyMode,
  Vl as segmentTimelineStyle,
  Mt as segmentsHistoryState,
  el as selectAllVideoSegmentIds,
  Rl as selectedBrowseStates,
  hi as selectedSwimlaneMerge,
  Ti as setBackLinkNavigation,
  Ci as settlePendingChange,
  ad as sharedPerformerSlotShape,
  id as sharedTagPerformerSlotShape,
  Mn as shortcutAvailableInMode,
  ul as shortcutBindingDisplayText,
  pu as shortcutBindingFromEvent,
  yu as shortcutBindingsOverlap,
  bu as shortcutModesOverlap,
  sl as shortcutRequiresSingleSegment,
  _n as shotBoundaryFingerprint,
  rd as shouldAcceptCurrentTagFromEnter,
  nd as shouldDismissPopover,
  fu as shouldExitShortcutCapture,
  Nu as shouldHandleEditorShortcut,
  ka as shouldLoadSegmentAnalysis,
  ba as shouldReloadAfterSegmentMutation,
  eo as shouldRestoreTransitionSelection,
  Bl as shouldShowQuickSearchGroups,
  Yo as splitShortcutCategoriesIntoColumns,
  ld as suggestDerivationRuleSlotMappings,
  Yn as swimlaneDisplayLabel,
  Xl as swimlaneMarkerTop,
  Ql as swimlaneStripeBackground,
  hl as tagEditorLockedBySave,
  ho as targetsOverlap,
  Fs as timelineContentStyle,
  _o as timelinePlayheadHorizontalStyle,
  Yl as timelineSegmentWidth,
  Ds as timelineTickAlignment,
  Os as timelineTickPosition,
  Qr as timelineTimePercent,
  vd as toggleAllCollapsedSegmentGroups,
  ml as toggledSelectionReviewState,
  Wt as trapModalFocus,
  Kl as tryParseJsonResponseText,
  Zs as updateAnchoredSegmentSelection,
  ac as updateDiscoverySelection,
  Vs as updateDualRangeValues,
  Ys as updateSegmentCollectionSelection,
  Qs as updateSegmentRangeSelection,
  Ya as updateSegmentSelection,
  Ca as validateDerivationRuleDraft,
  qo as validateSegmentTiming,
  uo as videoPerformerOptions,
  Jr as videoPerformerSlotAssignments,
  Cl as visibleSegmentStudioSettingsTabs,
  Il as visibleSegmentStudioTabs,
  bi as visibleVirtualRows
};
