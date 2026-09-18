import ao from "@cove/runtime/react";
import { createPortal as Ss } from "@cove/runtime/react-dom";
import { extensionFetch as Ma } from "@cove/runtime/api";
import { formatDuration as ks, EntityReferenceSelector as Vn, useExtensionKeyboardBindings as ws, VideoPlayer as Ea, useRegisterExtensionKeyboardActions as Da, getDefaultFilter as Pa, useListUrlState as Oa, ListPage as La } from "@cove/runtime/components";
import { ChevronDown as Fa, StepBack as Ns, StepForward as Is, Loader2 as Cs } from "@cove/runtime/lucide-react";
const io = "com.midnightrider.segment-studio", ja = "segment-studio.layout.v1", un = "segment-studio.operations.v1", Ba = "segment-studio.collapsed-segment-groups.v1", Ga = "segment-studio.playback-shortcuts.v1", Ua = "segment-studio.timing-clipboard.v1", Ka = "segment-studio.hide-derived-segments.v1", za = "segment-studio.merge-confirmation.v1", Nt = ["unreviewed", "approved", "rejected"], $s = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], Ko = "(min-width: 1024px) and (min-height: 640px)", zo = "(min-width: 1024px) and (min-height: 900px)", Jn = 1e-3, Ho = 15, Ts = 30, Ha = 12, $t = {
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
function Ps(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function Os(e, t, r, o, i = 160, a = 0) {
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
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : $t.timelineRatio;
}
function Zr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function dn(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? $t.detailWidth : Math.min(Zr(t, 0), Math.max(240, e));
}
function hr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? $t.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function js(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function lo(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: $t.timelineRatio, maximum: $t.timelineRatio };
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
  if (!e) return { ...$t };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? _a(r) : $t.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: dn(t == null ? void 0 : t.detailWidth),
      markerRailWidth: dn(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: hr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...$t };
  }
}
function Gs(e, t, r) {
  return r > 0 ? co((t + r - e) / r, r) : $t.timelineRatio;
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
function Mt(e = {}) {
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
  const a = Mt(r), s = a.performerId == null ? null : new Set((t || []).filter((u) => Number(u.performerId) === a.performerId).map((u) => u.segmentId)), l = new Set((i || []).flatMap((u) => u.tags || []).map((u) => Number(u.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((m = (c = (i || []).find((u) => Number(u.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : m.map((u) => Number(u.tagId))) || []);
  return qs(e || [], o).filter((u) => {
    if (u.reviewState != null && !a.reviewStates.includes(u.reviewState) || s && !s.has(u.id) || a.tagId != null && Number(u.tagId) !== a.tagId || d && !d.has(Number(u.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(u.tagId)) || a.sourceKey != null && u.sourceKey !== a.sourceKey) return !1;
    const b = Number(u.confidence);
    return u.confidence == null || !Number.isFinite(b) ? a.includeUnscored : b >= a.confidenceMin && b <= a.confidenceMax;
  });
}
function Ja(e, t, r, o = !1, i = []) {
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
      const c = (i || []).find((m) => Number(m.id) === a.segmentGroupId);
      (l = c == null ? void 0 : c.tags) != null && l.some((m) => Number(m.tagId) === Number(e.tagId)) || (a.segmentGroupId = null);
    }
  }
  a.sourceKey != null && e.sourceKey !== a.sourceKey && (a.sourceKey = null);
  const s = Number(e.confidence);
  return e.confidence != null && Number.isFinite(s) && (a.confidenceMin = Math.min(a.confidenceMin, Math.floor(s * 100) / 100), a.confidenceMax = Math.max(a.confidenceMax, Math.ceil(s * 100) / 100)), (e.confidence == null || !Number.isFinite(s)) && (a.includeUnscored = !0), {
    filters: Mt(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function _s(e, t = !1) {
  const r = Mt(e);
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
function Ye(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
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
  const r = e.identities.map((i) => Ye(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: Ye(t, e.activeIdentity) || r[0]
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
function En(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function Nl(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Il(e) {
  const t = [];
  return En(e, Jt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), En(e, Jt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function Cl(e) {
  return [
    ["general", "General", Jt.settingsGeneral],
    ["shortcuts", "Shortcuts", Jt.settingsShortcuts],
    ["performer-slots", "Performer slots", Jt.settingsPerformerSlots],
    ["derivation", "Derivation", Jt.settingsDerivation]
  ].filter(([, , r]) => En(e, r)).map(([r, o]) => [r, o]);
}
function $l(e, t) {
  return e === "segments" && !En(
    t,
    Jt.navigationSegmentInventory
  ) || e === "bin" && !En(
    t,
    Jt.recyclingBinView
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
function Pl(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function lt(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function uo(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Jr(e, t) {
  const r = new Set(uo(t).map((o) => String(lt(o))));
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
  const o = e.filter((p) => String(p.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((p) => {
    var f;
    return !((f = p.genderHints) != null && f.length);
  }) && e.length === t.length && !i) {
    const p = [...e].sort((y, w) => String(y.slotDefinitionId).localeCompare(String(w.slotDefinitionId))), f = [...t].sort((y, w) => String(y.name).localeCompare(String(w.name)) || Number(lt(y)) - Number(lt(w)));
    return [{
      assignments: Object.fromEntries(p.map((y, w) => [String(y.slotDefinitionId), String(lt(f[w]))])),
      description: f.map((y) => y.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((p) => t.map((f, y) => ({ performer: f, index: y })).filter(({ performer: f }) => {
    var y;
    return !((y = p.genderHints) != null && y.length) || p.genderHints.some((w) => Xt(w) === Xt(f.gender || f.genderIdentity));
  }).map(({ index: f }) => f)), m = i ? c.filter((p) => p.length > 0).length : ia(c, t.length);
  if (m === 0) return [];
  const u = new Map(t.map((p, f) => [String(lt(p)), f]));
  function b(p, f, y) {
    if (s.length >= a) return;
    const w = c.slice(p), R = i ? w.filter((z) => z.length > 0).length : ia(w.map((z) => z.filter((W) => !f.has(String(lt(t[W]))))), t.length);
    if (y + R < m) return;
    if (p === e.length) {
      if (y !== m) return;
      const z = Object.fromEntries(d.map(({ slot: O, performer: S }) => [String(O.slotDefinitionId), S ? String(lt(S)) : ""])), W = o.length === 0 ? Object.values(z).sort().join(",") : [...new Set(e.map((O) => String(O.label || "")))].map((O) => `${O}:${d.filter(({ slot: S }) => String(S.label || "") === O).map(({ performer: S }) => S ? String(lt(S)) : "").sort().join(",")}`).join("|");
      !l.has(W) && s.length < a && (l.add(W), s.push({
        assignments: z,
        description: d.map(({ slot: O, performer: S }) => o.length ? `${O.label}: ${(S == null ? void 0 : S.name) || "Unassigned"}` : (S == null ? void 0 : S.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const g = e[p], B = [...d].reverse().find(({ slot: z }) => aa(z) === aa(g)), F = B ? u.get(String(lt(B.performer))) : -1;
    for (const z of c[p]) {
      const W = t[z], O = lt(W);
      if (!(z < F) && !(O == null || !i && f.has(String(O))) && (d.push({ slot: g, performer: W }), i || f.add(String(O)), b(p + 1, f, y + 1), i || f.delete(String(O)), d.pop(), s.length >= a))
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
function Ol(e, t) {
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
      !o && d.has(u.performerId) || (m = c.genderHints) != null && m.length && !c.genderHints.some((b) => Xt(b) === Xt(u.gender)) || (a.push({ slot: c, performer: u }), o || d.add(u.performerId), s(l + 1, d), o || d.delete(u.performerId), a.pop());
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
  const o = lt, i = new Set((t || []).map(o)), a = new Set((r || []).map(Xt));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), m = d.isVideoPerformer ?? i.has(o(d));
    if (c !== m) return m - c;
    const u = Xt(l.gender || l.genderIdentity), b = Xt(d.gender || d.genderIdentity), p = l.matchesGenderHint ?? a.has(u);
    return (d.matchesGenderHint ?? a.has(b)) - p || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: ye, useId: ii, useLayoutEffect: sa, useMemo: He, useReducer: Gl, useRef: fe, useState: G, useSyncExternalStore: Ul } = ao, n = ao.createElement, si = "/api/plugins/segment-studio";
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
async function Z(e, t, r = 0) {
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
    return await zl(250 * (r + 1), t == null ? void 0 : t.signal), Z(e, t, r + 1);
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
function ku(e, t) {
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
function Vl(e, t, r = "not-applicable", o = !1) {
  const i = Bt[e] || Bt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
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
function mn({ state: e, includeLabel: t = !0 }) {
  const r = Bt[e] || Bt.unreviewed;
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
function Tt(e, { onCancel: t, onConfirm: r } = {}) {
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
  ye(() => {
    const o = requestAnimationFrame(() => od({
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
function Rt(e, t = !0) {
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
function cn(e, t = [], r = []) {
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
function tn(e) {
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
  const o = fe(null), i = `performer-slots-${ii()}`, [a, s] = G(null);
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
  const r = new Set(tn(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function xi(e, t) {
  return t ? tn(e).filter((r) => r !== t) : tn(e);
}
function vd(e, t) {
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
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), m = Number.isFinite(c) && c >= d ? c : d, u = d <= o && m >= o, b = u ? 0 : Math.min(Math.abs(o - d), Math.abs(o - m));
    return { contains: u, distance: b, duration: m - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function ro(e, t, r, o = null) {
  var m, u, b, p, f, y;
  const i = e.findIndex((w) => w.markers.some((R) => R.segment.id === t));
  if (i < 0) {
    const w = [...((m = e[0]) == null ? void 0 : m.markers) || []];
    return o != null && Number.isFinite(Number(o)) && w.sort((R, g) => ma(R, g, o)), ((u = w[0]) == null ? void 0 : u.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((w) => w.segment.id === t);
  if (r === "left" || r === "right") {
    const w = r === "left" ? -1 : 1, R = Math.min(a.markers.length - 1, Math.max(0, s + w));
    return ((b = a.markers[R]) == null ? void 0 : b.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((p = a.markers[s]) == null ? void 0 : p.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((f = a.markers[s]) == null ? void 0 : f.segment) ?? null : ((y = [...e[l].markers].sort(c ? (w, R) => ma(w, R, Number(o)) : (w, R) => Math.abs(w.segment.startSec - d) - Math.abs(R.segment.startSec - d) || w.segment.startSec - R.segment.startSec || w.segment.id - R.segment.id)[0]) == null ? void 0 : y.segment) ?? null;
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
function Rn(e, t, r, o) {
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
function qt(e) {
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
      for (const $ of k) $();
    }
  }
  function w(k, $) {
    b.set(k.id, $.status), k.resolve($);
  }
  function R(k) {
    if (k.dependsOn == null) return "met";
    const $ = b.get(k.dependsOn);
    return $ === "fulfilled" ? "met" : $ != null ? "failed" : "pending";
  }
  function g(k) {
    o = k;
    const $ = { ...e(), taskId: k.id, targets: k.targets };
    $.resolveTargets = () => k.targets.map((E) => Si($.segments, E)).filter(Boolean), y();
    let _;
    try {
      _ = k.run($);
    } catch (E) {
      _ = Promise.reject(E);
    }
    Promise.resolve(_).then(
      (E) => B(k, { status: "fulfilled", value: E }),
      (E) => B(k, { status: "rejected", error: E })
    );
  }
  function B(k, $) {
    k.settled || (k.settled = !0, w(k, $), !s && (o = null, $.status === "rejected" && (a = Object.freeze({ id: k.id, kind: k.kind, error: $.error })), y(), l += 1, t && F()));
  }
  function F() {
    if (s || o != null || c()) return;
    let k = !1;
    for (let $ = 0; $ < i.length; $ += 1) {
      const _ = i[$], E = R(_);
      if (E === "failed") {
        i = i.filter((A) => A !== _), w(_, { status: "dropped", reason: "dependency-failed" }), k = !0, $ -= 1;
        continue;
      }
      if (E !== "pending" && !(_.exclusive && $ > 0) && !i.slice(0, $).some((A) => ho(A.targets, _.targets)) && !(_.ready && !_.ready(e(), fr(_)))) {
        i = i.filter((A) => A !== _), g(_);
        return;
      }
    }
    k && y();
  }
  function z(k) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((D) => D.exclusive) || o != null && k.whenBusy !== "enqueue" || k.exclusive && (o != null || i.length > 0 || c())) return null;
    let _;
    const E = new Promise((D) => {
      _ = D;
    }), A = {
      id: r++,
      kind: k.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: k.lockId ?? -1,
      targets: Object.freeze((k.targets || []).map(O)),
      exclusive: k.exclusive === !0,
      dependsOn: k.dependsOn ?? null,
      ready: k.ready || null,
      meta: k.meta ?? null,
      run: k.run,
      resolve: _
    };
    return i = [...i, A], y(), F(), { id: A.id, done: E };
  }
  function W(k = {}) {
    let $ = null;
    const _ = z({
      ...k,
      whenBusy: "reject",
      run: () => new Promise((A) => {
        $ = A;
      })
    });
    if (!_) return null;
    if ($ == null)
      return T((A) => A.id === _.id), null;
    let E = !1;
    return () => {
      E || (E = !0, $(), (o == null ? void 0 : o.id) === _.id && B(o, { status: "fulfilled", value: void 0 }));
    };
  }
  function O(k) {
    return (k == null ? void 0 : k.id) == null || k.itemId != null || k.nativeSegmentId != null ? k : m.get(k.id) || k;
  }
  function S(k, $) {
    m.set(k, { ...$ });
    let _ = !1;
    for (const E of i)
      E.targets.some((A) => A.id === k && A.itemId == null && A.nativeSegmentId == null) && (E.targets = Object.freeze(E.targets.map((A) => A.id === k ? { ...$ } : A)), _ = !0);
    return _ && y(), _;
  }
  function T(k) {
    const $ = i.filter((_) => k(fr(_)));
    if ($.length === 0) return 0;
    i = i.filter((_) => !$.includes(_));
    for (const _ of $) w(_, { status: "cancelled" });
    return y(), F(), $.length;
  }
  return {
    enqueue: z,
    acquire: W,
    cancel: T,
    retarget: S,
    stableIdentity: O,
    // The host reads `settledCount()` while rendering and reports it here once that render commits.
    settledCount: () => l,
    markCommitted(k = l) {
      d = Math.max(d, k);
    },
    poke: () => F(),
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
      for (const _ of k) w(_, { status: "cancelled" });
      p.clear();
      const $ = f;
      f = [];
      for (const _ of $) _();
    }
  };
}
let Pd = 1;
function Yt() {
  return `pending-${Pd++}`;
}
function Od(e) {
  return e.sort((t, r) => t.startSec - r.startSec || t.id - r.id);
}
function xr(e, t) {
  return (t || []).some((r) => Dn(r, e));
}
function Ld(e, t) {
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
  return Od(r);
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
  const { acquireSaveLock: t, compatibilityMode: r, dispatchPendingChanges: o, enqueueSave: i, pendingChanges: a, retargetSaveTasks: s, currentTime: l, detail: d, editorFilters: c, endInput: m, hideDerivedSegments: u, historyRef: b, mediaDuration: p, onConflict: f, onDetailChange: y, onReload: w, optimisticSegmentIdRef: R, pendingDuplicateRef: g, pendingFirstSegmentStartSecRef: B, pendingTagEditSegmentIdRef: F, replaceSegmentSelection: z, savingSegmentId: W, segments: O, selectedSegment: S, selectedSegmentIdRef: T, selectedSegments: k, selectionAnchorIdRef: $, selectionRangeBaseIdsRef: _, setCreatingSegmentId: E, setEditorFilters: A, setFirstSegmentTagOpen: D, setHideDerivedSegments: q, setHistory: ee, setHistoryOpen: pe, setPublishApprovedError: be, setSaveMessage: X, setSelectedSegmentGroupKey: j, setSelectedSegmentId: ae, setSelectedSegmentIds: ce, setTagEditing: J, startInput: he, tagEditingRef: ve, timelineDuration: re, video: se } = e;
  function me(K) {
    b.current = K || Vt, ee(b.current);
  }
  async function Y(K, H, ue, N, V = null) {
    var U;
    try {
      const te = await Z(`/videos/${se.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: b.current.revision,
          kind: K,
          label: H,
          beforeState: ue,
          afterState: N,
          receiptId: V
        })
      });
      return me(te), !0;
    } catch (te) {
      return te.status === 409 && ((U = te.payload) != null && U.current) && me(te.payload.current), X("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function de(K, H, ue = !0, N = null, V = !1, U = H, te = !0) {
    if (!K || W != null) return null;
    const ge = t("segment", K.id);
    if (!ge) return null;
    try {
      return await M(K, H, {
        recordHistory: ue,
        historyLabel: N,
        optimisticValues: V ? U : null,
        restoreSelectionOnFailure: te
      });
    } finally {
      ge();
    }
  }
  async function M(K, H, {
    recordHistory: ue = !0,
    historyLabel: N = null,
    optimisticValues: V = null,
    pendingChangeId: U = null,
    restoreSelectionOnFailure: te = !0,
    onReload: ge = w,
    onConflict: Fe = f
  } = {}) {
    var ft;
    const Ie = k.map((Qe) => Qe.id), Pe = T.current, Ge = ue && !r ? crypto.randomUUID() : null;
    X(ue ? "Saving directly to Cove…" : "Restoring history…");
    const Ee = U ?? (V ? Yt() : null);
    V && !U && o({
      type: "add",
      entry: { id: Ee, op: "patch", targets: [qt(K)], values: V }
    });
    const Ve = (Qe) => {
      Ee && o({ type: "confirm", key: Ee, applied: Qe });
    };
    try {
      if (r && K.nativeSegmentId == null && K.itemId != null) {
        const ot = `draft-update:${se.id}:${K.itemId}:${K.revision}:${H.tagId}:${H.startSec}:${H.endSec ?? "open"}:${H.reviewState ?? K.reviewState}`, nt = await Z(`/videos/${se.id}/drafts/${K.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ke(ot),
            expectedRevision: K.revision,
            startSec: H.startSec,
            endSec: H.endSec,
            tagId: H.tagId,
            reviewState: H.reviewState
          })
        });
        ze(ot), nt.performerSlots != null && y((dt) => Rn(dt, K.id, nt.performerSlots, nt.performerSlotRevision), se.id);
        const rt = {
          ...K,
          ...nt.draft,
          id: K.id,
          itemId: K.itemId
        };
        return ue && await Y(
          "segment.update",
          N || "Changed segment",
          gr(K, r),
          gr(
            rt,
            r
          )
        ), ba(K, H, r) ? Ve(await ge() != null) : (y((dt) => ({
          ...dt,
          approvedSetVersion: nt.approvedSetVersion || dt.approvedSetVersion,
          segments: (dt.segments || []).map((et) => et.id === K.id ? rt : et).sort((et, pt) => et.startSec - pt.startSec || et.id - pt.id)
        }), se.id), Ve(!0)), X(((ft = nt.draft) == null ? void 0 : ft.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), rt;
      }
      const Qe = await Z(`/videos/${se.id}/segments/${K.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...H,
          expectedUpdatedAt: K.updatedAt,
          historyReceiptId: Ge
        })
      }), gt = {
        ...K,
        ...Qe,
        reviewState: H.reviewState ?? K.reviewState
      };
      return ba(K, H, r) ? Ve(await ge() != null) : (y((ot) => ({
        ...ot,
        segments: (ot.segments || []).map((nt) => nt.id === K.id ? gt : nt).sort((nt, rt) => nt.startSec - rt.startSec || nt.id - rt.id)
      }), se.id), Ve(!0)), ue && await Y(
        "segment.update",
        N || "Changed segment",
        gr(K, r),
        gr(
          gt,
          r
        ),
        Ge
      ), X(ue ? "Saved to Cove" : "History restored"), gt;
    } catch (Qe) {
      return Ee && o({ type: "discard", key: Ee }), Ee && te && (ce(Ie), ae(Pe), $.current = Pe, _.current = []), Qe.status === 409 ? (X("Conflict — loading the latest segment…"), await Fe()) : X(Qe.message || "Unable to save the segment."), null;
    }
  }
  async function ne() {
    if (!r) return !1;
    const K = O.filter((N) => !N.published && N.reviewState === "approved").length;
    if (K === 0 || W != null) return !1;
    const H = `complete-review:${se.id}:${d.approvedSetVersion}`, ue = t("publish", -1);
    if (!ue) return !1;
    be(""), X(`Publishing ${K} Approved draft${K === 1 ? "" : "s"}…`);
    try {
      const N = await Z(`/videos/${se.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ke(H),
          expectedApprovedSetVersion: d.approvedSetVersion
        })
      });
      ze(H), me(Vt), pe(!1);
      const V = await w(), U = Sl(
        O,
        T.current,
        N.published
      ), te = U ? Ye(V == null ? void 0 : V.segments, U) : null;
      return te && ae(te.id), X(`${N.published.length} Approved draft${N.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (N) {
      const V = N.status === 409 ? "The approved drafts changed. Review the updated list and try again." : N.message || "Unable to publish the approved drafts.";
      return N.status === 409 && await f(), be(V), X(V), !1;
    } finally {
      ue();
    }
  }
  async function C(K = null, H = null) {
    if (W != null || v()) return;
    const ue = K != null ? B.current : null, N = Number.isFinite(ue) ? ue : l, V = Math.min(re, N + 20);
    if (V <= N) {
      X("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const U = bl(O, S, K);
    if (U.kind === "choose-tag") {
      B.current = N, X(""), D(!0);
      return;
    }
    if (U.kind === "invalid-selection") {
      X("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: te } = U, ge = `create-draft:${se.id}:${te}:${N}`, Fe = r ? null : crypto.randomUUID(), Ie = T.current, Pe = {
      ...S || {},
      id: R.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: te,
      tagName: H || (S == null ? void 0 : S.tagName) || "Tag segment",
      tagSortName: te === (S == null ? void 0 : S.tagId) && (S == null ? void 0 : S.tagSortName) || null,
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
    }, Ge = Ad(d, Pe), Ee = jt(
      cn(Ge.segments, Ge.segmentGroups || [], Ge.performerSlots || []),
      Pe.id
    ), Ve = i({
      kind: "create",
      lockId: -1,
      run: (Qe) => ft(Qe)
    });
    if (!Ve) return;
    await Ve.done;
    async function ft({ onReload: Qe, taskId: gt }) {
      var nt;
      const ot = Yt();
      o({ type: "add", entry: { id: ot, taskId: gt, op: "insert", segment: Pe } }), D(!1), U.openTagEditor && (E(Pe.id), F.current = Pe.id, J(!0)), z(Pe.id), j(Ee);
      try {
        let rt;
        if (r) {
          const pt = await Z(`/videos/${se.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: Ke(ge), tagId: te, startSec: N, endSec: V })
          });
          ze(ge), rt = { itemId: (nt = pt.draft) == null ? void 0 : nt.itemId }, pt.performerSlots != null && y((xt) => Rn(xt, Pe.id, pt.performerSlots, pt.performerSlotRevision), se.id);
        } else
          rt = { nativeSegmentId: (await Z(`/videos/${se.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: te,
              startSec: N,
              endSec: V,
              historyReceiptId: Fe
            })
          })).id };
        B.current = null, D(!1);
        const dt = await Qe();
        if (o({ type: "discard", key: ot }), !dt) {
          y((pt) => Rn(pt, Pe.id, []), se.id), z(Ie), X(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${U.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const et = Ye(dt == null ? void 0 : dt.segments, rt);
        et ? (o({ type: "retarget", temporaryId: Pe.id, identity: qt(et) }), s(Pe.id, qt(et)), U.openTagEditor && (ve.current && (F.current = et.id), E(et.id)), z(et.id), j(jt(
          cn(dt.segments || [], dt.segmentGroups || [], dt.performerSlots || []),
          et.id
        )), r || await Y(
          "segment.create",
          "Created segment",
          Rt([], !1),
          Rt([et], !1),
          Fe
        )) : (J(!1), X(`Segment created, but it could not be selected${U.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (rt) {
        throw o({ type: "discard", key: ot }), z(Ie), K != null && D(!0), X(rt.message || "Unable to create the draft."), rt;
      } finally {
        E(null);
      }
    }
  }
  function v() {
    return wi(a, S) ? (X("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function h() {
    if (k.length !== 1 || !S || W != null || v()) return;
    const K = l;
    if (K <= S.startSec || S.endSec != null && K >= S.endSec) {
      X("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const H = `split-draft:${S.itemId}:${S.revision}:${K}`, ue = r ? null : Rt([S], !1), N = r ? null : crypto.randomUUID(), V = t("split", S.id);
    if (V)
      try {
        let U = null;
        r && S.nativeSegmentId == null ? (await Z(`/videos/${se.id}/drafts/${S.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ke(H),
            expectedRevision: S.revision,
            splitSec: K
          })
        }), ze(H)) : U = { nativeSegmentId: (await Z(`/videos/${se.id}/segments/${S.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: S.updatedAt,
            splitSec: K,
            historyReceiptId: N
          })
        })).id };
        const te = await w();
        if (!r) {
          const ge = [
            Ye(te == null ? void 0 : te.segments, {
              nativeSegmentId: S.nativeSegmentId ?? S.id
            }),
            Ye(
              te == null ? void 0 : te.segments,
              U
            )
          ].filter(Boolean);
          await Y(
            "segment.split",
            "Split segment",
            ue,
            Rt(ge, !1),
            N
          );
        }
        X(r ? `Segment split; both ranges remain ${S.reviewState}.` : "Segment split.");
      } catch (U) {
        U.status === 409 ? await f() : X(U.message || "Unable to split the draft.");
      } finally {
        V();
      }
  }
  async function x(K = !1) {
    var U, te;
    if (k.length !== 1 || !S || W != null || v()) return;
    const H = K ? l : S.startSec, ue = yl(se.id, S, K, H), N = r ? null : crypto.randomUUID(), V = t("duplicate", S.id);
    if (V)
      try {
        const ge = ((U = g.current) == null ? void 0 : U.operationKey) === ue ? g.current : null;
        let Fe = (ge == null ? void 0 : ge.duplicateIdentity) ?? null;
        if (Fe == null && r && S.nativeSegmentId == null) {
          const Ge = await Z(`/videos/${se.id}/drafts/${S.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ke(ue),
              expectedRevision: S.revision,
              startSec: K ? H : null
            })
          });
          Fe = Zo(!1, Ge), g.current = { operationKey: ue, duplicateIdentity: Fe };
        } else if (Fe == null) {
          const Ge = await Z(`/videos/${se.id}/segments/${S.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: S.updatedAt,
              startSec: K ? H : null,
              historyReceiptId: N
            })
          });
          Fe = Zo(!0, Ge), g.current = { operationKey: ue, duplicateIdentity: Fe };
        }
        const Ie = await w(), Pe = Ye(Ie == null ? void 0 : Ie.segments, Fe);
        if (Pe) {
          r || await Y(
            "segment.duplicate",
            "Duplicated segment",
            Rt([], !1),
            Rt([Pe], !1),
            N
          );
          const Ge = Ja(
            Pe,
            Ie.performerSlots || [],
            c,
            u,
            Ie.segmentGroups || []
          );
          A(Ge.filters), q(Ge.hideDerivedSegments), K || (F.current = Pe.id), ce([Pe.id]), ae(Pe.id), $.current = Pe.id, _.current = [], j(jt(
            cn(Ie.segments || [], Ie.segmentGroups || [], Ie.performerSlots || []),
            Pe.id
          )), r && S.nativeSegmentId == null && ze(ue), g.current = null, X(K ? "Duplicate created at the playhead." : "Duplicate created in place.");
        } else
          X("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
      } catch (ge) {
        ((te = g.current) == null ? void 0 : te.operationKey) === ue ? X("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : ge.status === 409 ? await f() : X(ge.message || "Unable to duplicate the draft.");
      } finally {
        V();
      }
  }
  async function P() {
    if (k.length !== 1 || !S) return;
    const K = Number(he), H = m.trim() === "" ? null : Number(m), ue = qo(K, H, p);
    if (ue.error) {
      X(ue.error);
      return;
    }
    if (K === S.startSec && H === S.endSec) {
      X("Timing is unchanged.");
      return;
    }
    await de(S, { startSec: K, endSec: H, tagId: S.tagId }, !0, null, !0);
  }
  async function oe(K, H) {
    if (k.length !== 1 || !S) return;
    const ue = qo(K, H, p);
    if (ue.error) {
      X(ue.error);
      return;
    }
    if (K === S.startSec && H === S.endSec) {
      X("Timing is unchanged.");
      return;
    }
    await de(S, { startSec: K, endSec: H, tagId: S.tagId }, !0, null, !0);
  }
  return { acceptHistory: me, recordHistoryAction: Y, mutateSegment: de, runSegmentMutation: M, completeReview: ne, createSegment: C, splitSegment: h, duplicateSegment: x, saveTiming: P, applyShortcutTiming: oe };
}
function zd() {
  const [e, t] = G(() => typeof window < "u" && window.matchMedia(Ko).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Ko), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Hd() {
  const [e, t] = G(() => typeof window < "u" && window.matchMedia(zo).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(zo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function qd() {
  try {
    return Bs(window.localStorage.getItem(ja));
  } catch {
    return { ...$t };
  }
}
function _d() {
  try {
    return tn(JSON.parse(window.localStorage.getItem(Ba) || "[]"));
  } catch {
    return [];
  }
}
function Wd(e) {
  try {
    window.localStorage.setItem(Ba, JSON.stringify(tn(e)));
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
function en({ counts: e }) {
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
  }, `${Bt[t].symbol}${e[t]}`)));
}
function Zd({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: m, shortcutRef: u }) {
  const b = uo(a), [p, f] = G(() => Jr(o, b)), [y, w] = G(!1), [R, g] = G(""), B = fe(!1), F = o.map((k) => `${k.slotDefinitionId}:${k.performerId || ""}`).join("|"), z = b.map((k) => lt(k)).join("|"), W = oi(
    o,
    b
  );
  ye(() => {
    f(Jr(o, b)), g("");
  }, [t, r, F, z]);
  async function O(k = p) {
    if (!B.current) {
      B.current = !0, w(!0), g("Saving performer slots…");
      try {
        const $ = Jr(o.map((A) => ({
          ...A,
          performerId: k[A.slotDefinitionId] || null
        })), b), _ = o.map((A) => {
          const D = $[A.slotDefinitionId] ? Number($[A.slotDefinitionId]) : null, q = b.find((ee) => String(lt(ee)) === String(D));
          return {
            ...A,
            performerId: D,
            performerName: (q == null ? void 0 : q.name) || null
          };
        });
        if (s(_) === !1) {
          g("");
          return;
        }
        const E = await Z(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((A) => ({ slotDefinitionId: A.slotDefinitionId, performerId: $[A.slotDefinitionId] ? Number($[A.slotDefinitionId]) : null }))
          })
        });
        g("Performer slots saved."), await l(E, {
          beforeState: Nr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: Nr([{
            segmentId: t,
            itemId: r,
            revision: E.revision,
            slots: E.slots || []
          }])
        });
      } catch ($) {
        d && await d(o, $), $.status === 409 ? (g("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : g($.message || "Unable to save performer slots.");
      } finally {
        B.current = !1, w(!1);
      }
    }
  }
  function S(k, $) {
    g(`Option ${$ + 1} applied; save to confirm.`), f({ ...p, ...k.assignments });
  }
  async function T(k) {
    const $ = { ...p, ...k.assignments };
    f($), await O($);
  }
  return ye(() => {
    if (u)
      return u.current = (k) => B.current || !W[k] ? !1 : (T(W[k]), !0), () => {
        u.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    W.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, W.map((k, $) => n("button", {
        key: $,
        type: "button",
        disabled: y,
        onClick: () => S(k, $),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${$ + 1}: ${k.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, $ + 1),
        n("span", { key: "description" }, k.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${W.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((k) => n("label", { key: k.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, It(k)),
      (k.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(k.genderHints || []).map($r).join(" · ")}`) : null,
      n("select", { key: "select", value: p[k.slotDefinitionId] || "", disabled: y, onChange: ($) => f({ ...p, [k.slotDefinitionId]: $.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ai(b, b, k.genderHints).map(($) => n("option", { key: lt($), value: lt($) }, $.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: m, type: "button", disabled: y, onClick: () => O(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, R)])
  ]);
}
function Xd({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a, acquireSaveLock: s = () => () => {
} }) {
  var O;
  const l = ((O = t[0]) == null ? void 0 : O.slots) || [], d = uo(r), c = oi(
    l,
    d
  ), m = "__mixed__", u = () => Object.fromEntries(l.map((S, T) => {
    const k = t.map(($) => {
      var _;
      return String(((_ = $.slots[T]) == null ? void 0 : _.performerId) || "");
    });
    return [S.slotDefinitionId, k.every(($) => $ === k[0]) ? k[0] : m];
  })), [b, p] = G(u), [f, y] = G(!1), [w, R] = G(""), g = fe(!1), B = t.map((S) => `${S.itemId ?? `native:${S.segmentId}`}:${S.revision}:${S.slots.map((T) => `${T.slotDefinitionId}:${T.performerId || ""}`).join(",")}`).join("|");
  ye(() => {
    p(u());
  }, [B]);
  async function F(S = b) {
    if (g.current) return;
    const T = s();
    if (!T) {
      R("Wait for the current save to finish before saving performer slots.");
      return;
    }
    g.current = !0, y(!0), R(`Saving performer slots for ${t.length} segments…`);
    const k = [];
    try {
      for (const $ of t) {
        const _ = $.slots.map((A, D) => {
          const q = S[l[D].slotDefinitionId];
          return {
            slotDefinitionId: A.slotDefinitionId,
            performerId: q === m ? A.performerId || null : q ? Number(q) : null
          };
        }), E = await Z($.itemId != null ? `/videos/${e}/drafts/${$.itemId}/slots` : `/videos/${e}/segments/${$.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: $.revision, assignments: _ })
        });
        k.push({
          segmentId: $.segmentId,
          itemId: $.itemId,
          revision: E.revision,
          slots: E.slots || []
        });
      }
      R("Performer slots saved."), await o({
        beforeState: Nr(t),
        afterState: Nr(k)
      });
    } catch ($) {
      const _ = await i();
      $.status === 409 ? R(_ ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : R($.message || (_ ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      g.current = !1, y(!1), T();
    }
  }
  function z(S, T) {
    R(`Option ${T + 1} applied; save to confirm.`), p({ ...b, ...S.assignments });
  }
  async function W(S) {
    const T = { ...b, ...S.assignments };
    p(T), await F(T);
  }
  return ye(() => {
    if (a)
      return a.current = (S) => g.current || !c[S] ? !1 : (W(c[S]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, c.map((S, T) => n("button", {
        key: T,
        type: "button",
        disabled: f,
        onClick: () => z(S, T),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${T + 1} to all selected segments: ${S.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, T + 1),
        n("span", { key: "description" }, S.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${c.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, l.map((S) => n("label", {
      key: S.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, It(S)),
      n("select", {
        key: "select",
        value: b[S.slotDefinitionId] || "",
        disabled: f,
        onChange: (T) => p({ ...b, [S.slotDefinitionId]: T.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        b[S.slotDefinitionId] === m ? n("option", { key: "mixed", value: m }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ai(d, d, S.genderHints).map((T) => n("option", {
          key: lt(T),
          value: lt(T)
        }, T.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: f,
        onClick: () => F(),
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
function ec(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return Gt(t);
  const o = [...new Set(r.map((i) => Gt(i.sourceKey, i.sourceDisplayName)))];
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
  const [r, o] = G(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = ec(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
            Gt(u.sourceKey, u.sourceDisplayName)
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
  const [u, b] = G([]), p = e.flatMap((R) => R.lanes.map((g) => g.key)), f = p.join("|");
  ye(() => {
    const R = new Set(p);
    b((g) => g.filter((B) => R.has(B)));
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
      a ? n(en, { key: "counts", counts: y }) : null
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
        const B = u.includes(g.key), F = g.markers.some(({ segment: W }) => W.id === r), z = `selected-segment-lane-${g.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: g.key,
          "data-selected-segment-lane": g.key,
          className: `rounded-md border ${F ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": B,
            "aria-controls": z,
            "aria-current": F ? "true" : void 0,
            onClick: () => b((W) => B ? W.filter((O) => O !== g.key) : [...W, g.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, B ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Yn(g)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(g.selectedCount)),
            a ? n(en, { key: "states", counts: g.counts }) : null
          ]),
          B ? n("div", {
            key: "segments",
            id: z,
            className: "space-y-1 border-t border-border p-1.5"
          }, g.markers.map(({ segment: W }) => {
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
              W.isDerived ? n(Ar, { key: "derived" }) : null,
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
        Jt.recyclingBinView
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
  const [r, o] = G(null);
  ye(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const m = await Z("/bin"), u = Number(m == null ? void 0 : m.totalCount);
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
  const o = fe(null), [i, a] = G("maximum"), s = (b, p) => {
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
    const f = b === "minimum" ? e : t, y = b === "minimum" ? 0 : e, w = b === "minimum" ? t : 1, R = p.shiftKey ? 0.1 : 0.01;
    let g = null;
    ["ArrowLeft", "ArrowDown"].includes(p.key) && (g = f - R), ["ArrowRight", "ArrowUp"].includes(p.key) && (g = f + R), p.key === "PageDown" && (g = f - 0.1), p.key === "PageUp" && (g = f + 0.1), p.key === "Home" && (g = y), p.key === "End" && (g = w), g != null && (p.preventDefault(), s(b, Math.min(w, Math.max(y, g))));
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
    onKeyDownCapture: (s) => Tt(s, { onCancel: a })
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
  const u = Mt(e), b = [...new Map((a || []).map((g) => [
    Number(g.tagId),
    g.tagName || `Tag ${g.tagId}`
  ])).entries()].sort((g, B) => g[1].localeCompare(B[1]) || g[0] - B[0]), p = new Set((a || []).map((g) => Number(g.tagId))), f = (s || []).filter((g) => Number(g.id) === u.segmentGroupId || (g.tags || []).some((B) => p.has(Number(B.tagId)))), y = (g) => d(Mt({ ...u, ...g })), w = (g) => y({
    reviewStates: u.reviewStates.includes(g) ? u.reviewStates.filter((B) => B !== g) : [...u.reviewStates, g]
  }), R = (g) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${g ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && m();
    },
    onKeyDownCapture: (g) => Tt(g, { onCancel: m })
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
        onClick: m,
        "aria-label": "Close editor filters",
        className: "rounded-md px-2 py-1 text-xl leading-none text-secondary hover:bg-muted/40 hover:text-foreground"
      }, "×")
    ]),
    n("div", { key: "body", className: "min-h-0 space-y-5 overflow-y-auto p-5" }, [
      l ? n("fieldset", { key: "approval", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Approval state"),
        n("div", { className: "flex flex-wrap gap-2" }, Nt.map((g) => {
          const B = u.reviewStates.includes(g), F = Bt[g];
          return n("button", {
            key: g,
            type: "button",
            onClick: () => w(g),
            "aria-pressed": B,
            className: R(B)
          }, `${F.symbol} ${g} (${i[g] || 0})`);
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
            className: R(u.performerId == null)
          }, "All performers"),
          ...r.map((g) => {
            const B = Number(lt(g));
            return n("button", {
              key: B,
              type: "button",
              onClick: () => y({ performerId: B }),
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
            onChange: (g) => y({
              tagId: g.target.value === "" ? null : Number(g.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...b.map(([g, B]) => n("option", { key: g, value: g }, B))
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
            className: R(u.sourceKey == null)
          }, "All provenance"),
          ...o.map((g) => n("button", {
            key: g,
            type: "button",
            onClick: () => y({ sourceKey: g }),
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
        n(cc, {
          minimum: u.confidenceMin,
          maximum: u.confidenceMax,
          onChange: ({ minimum: g, maximum: B }) => y({
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
          d(Mt({})), l && c(!1);
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
  const a = fe(null);
  return ye(() => {
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
    onKeyDownCapture: (l) => Tt(l, { onCancel: r })
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
  const s = Cd(e), [l, d] = G([]), c = s.map((m) => m.tagName).join("|");
  return ye(() => {
    const m = new Set(s.map((u) => u.tagName));
    d((u) => u.filter((b) => m.has(b)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (m) => Tt(m, {
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
            const y = `${Ae(f.startSec)}${f.endSec == null ? "" : ` – ${Ae(f.endSec)}`}`, w = r === f.id;
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
  const [o, i] = G(""), [a, s] = G(0), l = fe(null), d = He(() => Fl(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), m = Bl(d);
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
      var p;
      if (b.key === "Tab")
        _t(b);
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
      var z;
      const f = b.segment || b, y = f.endSec == null ? Ae(f.startSec) : `${Ae(f.startSec)} – ${Ae(f.endSec)}`, w = `${Gt(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`, R = p === c, g = p > 0 ? d[p - 1].groupKey : null, B = m && b.groupKey !== g ? n("div", {
        key: `group:${b.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, b.groupName) : null, F = n("button", {
        key: f.id,
        id: `segment-quick-search-${f.id}`,
        ref: R ? l : null,
        type: "button",
        role: "option",
        "aria-selected": R,
        onMouseEnter: () => s(p),
        onClick: () => t(f),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${R ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        m ? n("span", { key: "group", className: "sr-only" }, `${b.groupName} group`) : null,
        n(mn, { key: "review", state: f.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          f.tagName || "Tag segment"
        ),
        (z = b.performers) != null && z.length ? n(Tr, {
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
      return B ? [B, F] : [F];
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
  const s = He(() => bc(e), [e]), [l, d] = G([]), c = s.reduce((p, f) => p + f.drafts.length, 0), m = fe(null);
  po({ confirmRef: m, cancelRef: o, confirmReady: !t && c > 0 });
  const u = (p) => d((f) => f.includes(p) ? f.filter((y) => y !== p) : [...f, p]), b = (p) => `segment-studio-publish-approved-${p.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (p) => {
      p.target === p.currentTarget && !t && a();
    },
    onKeyDownCapture: (p) => Tt(p, {
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
            const w = y.endSec == null ? Ae(y.startSec) : `${Ae(y.startSec)} – ${Ae(y.endSec)}`, R = `${Gt(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`;
            return n("div", { key: y.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(mn, { key: "review", state: y.reviewState, includeLabel: !1 }),
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
  const a = Ll(e), [s, l] = G(() => /* @__PURE__ */ new Set()), [d, c] = G(() => new Set(a.map((y) => y.key))), m = a.flatMap((y) => d.has(y.key) ? y.candidates : []), u = (y) => l((w) => {
    const R = new Set(w);
    return R.has(y) ? R.delete(y) : R.add(y), R;
  }), b = (y) => c((w) => {
    const R = new Set(w);
    return R.has(y) ? R.delete(y) : R.add(y), R;
  }), p = (y) => y.assignment.map(({ slot: w, performer: R }) => `${w.label || `Slot ${w.sortOrder + 1}`}: ${R.name}`).join(", "), f = (y) => `segment-studio-auto-assign-${y.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (y) => {
      y.target === y.currentTarget && !t && i();
    },
    onKeyDownCapture: (y) => {
      y.key === "Enter" && y.target instanceof HTMLInputElement || Tt(y, {
        onCancel: t ? void 0 : i,
        onConfirm: m.length && !t ? () => o(m) : void 0
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
            y.assignment.map(({ slot: w, performer: R }) => {
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
                n(Qn, {
                  key: "avatar",
                  performer: { id: R.performerId, name: R.name },
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
            "aria-label": `Auto-Assign ${y.tagName}: ${p(y)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${y.candidates.length})`)
        ]),
        s.has(y.key) ? n(
          "div",
          { key: "segments", id: f(y), className: "divide-y divide-border/70" },
          y.candidates.map((w) => {
            const R = w.endSec == null ? Ae(w.startSec) : `${Ae(w.startSec)} – ${Ae(w.endSec)}`, g = `${Gt(w.sourceKey)}${w.confidence == null ? "" : ` · ${Math.round(w.confidence * 100)}%`}`;
            return n("div", {
              key: w.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(mn, { key: "review", state: w.reviewState, includeLabel: !1 }),
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
    onKeyDownCapture: (d) => Tt(d, { onCancel: r, onConfirm: t })
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
function Sc({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = G(!1), d = fe(null);
  if (po({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Ae(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && a();
    },
    onKeyDownCapture: (m) => Tt(m, {
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
  const l = e ? e.createCount + e.linkCount : 0, d = fe(null);
  po({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((u = e == null ? void 0 : e.outputs) == null ? void 0 : u.slice(0, 200)) || [], m = kc(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (p) => {
      p.target === p.currentTarget && !r && s();
    },
    onKeyDownCapture: (p) => Tt(p, {
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
                `${p.rootTagName} @ ${Ae(p.rootStartSec)}`
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
  onDetailChange: R,
  setSaveMessage: g,
  acquireSaveLock: B,
  onSlotsChanged: F,
  onRecordHistory: z,
  onCancelQueuedReview: W,
  splitSegment: O,
  duplicateSegment: S,
  provenance: T,
  lineage: k,
  onNavigateLineageItem: $,
  tagEditing: _,
  onCancelTagEditing: E,
  detailPanelRef: A,
  onReduceSelection: D
}) {
  var ve, re, se, me;
  const q = fe(null), ee = fe(null), pe = () => {
    var Y;
    (Y = ee.current) == null || Y.call(ee), ee.current = null;
  }, be = fe(null), X = fe(null), j = fe(null), ae = fe(null), [ce, J] = G(!1);
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
    const Y = !r.some((ne) => ne.isDerived), de = e && m ? id(b, r) : null, M = (de == null ? void 0 : de.map((ne, C) => {
      var h;
      const v = r[C];
      return {
        segmentId: v.nativeSegmentId,
        itemId: v.published ? null : v.itemId,
        revision: (h = p.performerSlotRevisions) == null ? void 0 : h[v.id],
        slots: ne
      };
    })) || [];
    return n(ao.Fragment, null, [
      n(rc, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: A,
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
        onKeyDownCapture: (ne) => Tt(ne, { onCancel: E })
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
          onChange: (ne, C) => ne == null ? E() : l(ne, C == null ? void 0 : C.label),
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
          var v, h;
          if (!(typeof ((v = ne.target) == null ? void 0 : v.closest) == "function" ? ne.target.closest("input, textarea, select, [contenteditable='true']") : null) && !ne.repeat && !ne.ctrlKey && !ne.altKey && !ne.metaKey && !ne.shiftKey && /^[1-9]$/.test(ne.key) && ((h = ae.current) != null && h.call(ae, Number(ne.key) - 1))) {
            ne.preventDefault(), ne.stopPropagation();
            return;
          }
          Tt(ne, { onCancel: he });
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
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Xd, {
          videoId: f.id,
          targets: M,
          performerCandidates: p.performerCandidates || [],
          shortcutRef: ae,
          acquireSaveLock: () => B("slots", -1),
          onSaved: async ({ beforeState: ne, afterState: C }) => {
            await z(
              "performer-slots.assign",
              `Assigned performers to ${M.length} segments`,
              ne,
              C
            ), he(), await F();
          },
          onConflict: F
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (Y) => {
      q.current = Y, A && (A.current = Y);
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
        t != null && t.isDerived ? n(Ar, { key: "derived" }) : null,
        t && _ ? n("div", {
          key: "tag-editor",
          ref: w,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (Y) => {
            Y.key === "Escape" && (Y.preventDefault(), Y.stopPropagation(), E());
          },
          onKeyDown: (Y) => {
            rd(Y, t.tagName) && (Y.preventDefault(), Y.stopPropagation(), l(t.tagId));
          }
        }, n(Vn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (Y, de) => Y == null ? E() : l(Y, de == null ? void 0 : de.label),
          disabled: hl(a, t.id, s) || ((ve = k.data) == null ? void 0 : ve.tagReadOnly) === !0,
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
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(Qd, { status: c })) : null,
      t && m && u.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(vi, {
        assignments: u.map((Y) => {
          const de = cd(Y);
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
    t ? n(nc, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: T
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
          (re = k.data.parents) != null && re.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...k.data.parents.map((Y) => n("button", {
              key: Y.nodeId,
              type: "button",
              onClick: () => $(Y.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${Y.ruleKey} ${Y.ruleVersion}`))
          ]) : null,
          (se = k.data.children) != null && se.length ? n("p", { key: "children" }, `Children: ${k.data.children.length}`) : null
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
          onClick: O,
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
    ce && e && t && m && u.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (Y) => {
        Y.target === Y.currentTarget && he();
      },
      onKeyDownCapture: (Y) => {
        var M, ne;
        if (!(typeof ((M = Y.target) == null ? void 0 : M.closest) == "function" ? Y.target.closest("input, textarea, select, [contenteditable='true']") : null) && !Y.repeat && !Y.ctrlKey && !Y.altKey && !Y.metaKey && !Y.shiftKey && /^[1-9]$/.test(Y.key) && ((ne = j.current) != null && ne.call(j, Number(Y.key) - 1))) {
          Y.preventDefault(), Y.stopPropagation();
          return;
        }
        Tt(Y, {
          onCancel: he,
          onConfirm: () => {
            var C;
            return (C = X.current) == null ? void 0 : C.click();
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
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Zd, {
        key: `${t.id}:${p.performerSlotsRevision || p.slotRevision || ""}`,
        videoId: f.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: u,
        revision: (me = p.performerSlotRevisions) == null ? void 0 : me[t.id],
        performerCandidates: p.performerCandidates || [],
        confirmRef: X,
        shortcutRef: j,
        onOptimisticSave: (Y) => {
          const de = B("slots", t.id);
          if (!de)
            return g("Wait for the current save to finish before saving performer slots."), !1;
          ee.current = de, R((M) => Rn(
            M,
            t.id,
            Y
          ), f.id), g("Saving performer slots…"), he();
        },
        onSaved: async (Y, { beforeState: de, afterState: M }) => {
          R((ne) => Rn(
            ne,
            t.id,
            Y.slots || [],
            Y.revision
          ), f.id), g("Performer slots saved.");
          try {
            await z(
              "performer-slots.assign",
              "Assigned performers",
              de,
              M
            ), await F(Y) || W([t]);
          } finally {
            pe();
          }
        },
        onRollback: async (Y, de) => {
          W([t]), R((M) => {
            var ne;
            return Rn(
              M,
              t.id,
              Y,
              (ne = p.performerSlotRevisions) == null ? void 0 : ne[t.id]
            );
          }, f.id), g(de.message || "Unable to save performer slots.");
          try {
            de.status === 409 && await F();
          } finally {
            pe();
          }
        },
        onConflict: F
      }))
    ])) : null
  ]);
}
function Ic({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: m, onZoomChange: u, onSelectGroup: b, onToggleGroup: p, onSelect: f, onSelectSegments: y, onSelectAll: w, onConfigureTag: R, onSeekTime: g, centerRef: B, showReviewState: F = !0, swimlaneTitleWidth: z, onSwimlaneTitleWidthChange: W }) {
  const O = fe(null), S = fe(null), [T, k] = G(0), [$, _] = G({ scrollTop: 0, height: 320 }), [E, A] = G(null), D = He(
    () => cn(e, r, o),
    [e, r, o]
  ), q = He(
    () => fi(o),
    [o]
  ), ee = He(() => bo(D), [D]), pe = He(
    () => fd(ee, i, yi(ee)),
    [ee, i]
  ), be = He(
    () => bi(pe.rows, Math.max(0, $.scrollTop - 24), $.height),
    [pe, $]
  ), X = Math.max(0, Number(d) || 0), j = js(T), ae = hr(z, j), ce = ae / 16, J = Ls(c, X, ce), he = Ms(X), ve = Es(X, Math.max(1, T - ce * 16), m), re = he.filter((h, x) => x === 0 || x % ve === 0), se = He(() => D.map((h) => `${h.key}:${h.trackCount}:${h.markers.map(({ segment: x, track: P }) => `${x.id}:${x.startSec}:${x.endSec ?? ""}:${P}`).join(",")}`).join("|"), [D]);
  function me() {
    const h = S.current;
    if (!h) return;
    const x = h.querySelector("[data-timeline-track]"), P = h.firstElementChild, oe = x == null ? void 0 : x.getBoundingClientRect(), K = P == null ? void 0 : P.getBoundingClientRect(), H = oe && K ? Math.max(0, oe.left - K.left) : ce * 16, ue = (K == null ? void 0 : K.width) ?? h.scrollWidth;
    h.scrollTo({
      left: Os(c, X, ue, h.clientWidth, H, Ha),
      behavior: "smooth"
    });
  }
  ye(() => (B.current = me, () => {
    B.current === me && (B.current = null);
  })), ye(() => {
    me();
  }, [m]);
  function Y() {
    const h = S.current, x = pe.rows.find((ue) => ue.kind === "lane" && ue.lane.markers.some(({ segment: N }) => N.id === s));
    if (!h || !x) return;
    const P = 24, oe = x.top + P, K = oe + x.height;
    let H = h.scrollTop;
    oe < h.scrollTop + P ? H = Math.max(0, oe - P) : K > h.scrollTop + h.clientHeight && (H = Math.max(0, K - h.clientHeight)), H !== h.scrollTop && (h.scrollTop = H), _({ scrollTop: H, height: h.clientHeight });
  }
  ye(() => {
    Y();
  }, [s, se, pe]), ye(() => {
    const h = S.current, x = pe.rows.find((ue) => ue.kind === "group" && ue.group.key === a);
    if (!h || !x) return;
    const P = 24, oe = x.top + P, K = oe + x.height;
    let H = h.scrollTop;
    oe < h.scrollTop + P ? H = Math.max(0, oe - P) : K > h.scrollTop + h.clientHeight && (H = Math.max(0, K - h.clientHeight)), H !== h.scrollTop && (h.scrollTop = H), _({ scrollTop: H, height: h.clientHeight });
  }, [a, pe]), ye(() => {
    const h = S.current;
    if (!h || typeof ResizeObserver > "u") return;
    const x = () => {
      k(h.clientWidth), _({ scrollTop: h.scrollTop, height: h.clientHeight }), Y();
    }, P = new ResizeObserver(x);
    return P.observe(h), x(), () => P.disconnect();
  }, [s, se, pe]);
  function de(h) {
    if (!(X > 0)) return;
    const x = h.currentTarget.getBoundingClientRect(), P = Math.min(1, Math.max(0, (h.clientX - x.left) / x.width));
    g(P * X);
  }
  function M(h) {
    const x = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let P = null;
    Object.hasOwn(x, h.key) && (P = c + x[h.key]), h.key === "Home" && (P = 0), h.key === "End" && (P = X), P != null && (h.preventDefault(), h.stopPropagation(), g(Math.min(X, Math.max(0, P))));
  }
  function ne(h) {
    var P;
    const x = (P = O.current) == null ? void 0 : P.getBoundingClientRect();
    x && W(hr(h.clientX - x.left, j));
  }
  function C(h) {
    const x = h.shiftKey ? 40 : 16;
    let P = null;
    h.key === "ArrowLeft" && (P = ae - x), h.key === "ArrowRight" && (P = ae + x), h.key === "Home" && (P = 160), h.key === "End" && (P = j), P != null && (h.preventDefault(), h.stopPropagation(), W(hr(P, j)));
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
      n("button", { key: "center", type: "button", className: v, onClick: me, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(j),
      "aria-valuenow": Math.round(ae),
      "aria-valuetext": `${Math.round(ae)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (h) => {
        h.currentTarget.setPointerCapture(h.pointerId), ne(h);
      },
      onPointerMove: (h) => {
        h.currentTarget.hasPointerCapture(h.pointerId) && ne(h);
      },
      onKeyDown: C,
      onDoubleClick: () => W($t.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${ae - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: S,
      onScroll: (h) => _({
        scrollTop: h.currentTarget.scrollTop,
        height: h.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: Fs(m) }, [
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
        }, re.map((h, x) => n("span", {
          key: h,
          className: `absolute top-0 ${Ds(x, re.length, X > 0 ? h / X * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Ps(x, re.length, X > 0 ? h / X * 100 : 0)
        }, Ae(h))).concat(t.map((h) => {
          const x = X > 0 ? h.startSec / X * 100 : 0;
          return n("button", {
            key: `shot-boundary:${h.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Ae(h.startSec)} – ${Ae(h.endSec)}`,
            title: `Shot boundary · ${h.source || "manual"} · ${Ae(h.startSec)} – ${Ae(h.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${x}%`, width: "2px" },
            onClick: (P) => {
              P.stopPropagation(), g(h.startSec);
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
        D.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : be.map((h) => {
          var V;
          const x = h.group, P = i.includes(x.key), oe = a === x.key, K = Cr(oe);
          if (h.kind === "group") return n("div", {
            key: h.key,
            "data-segment-group": x.key,
            "data-segment-group-collapsed": P ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ce}rem minmax(0,1fr)`,
              backgroundColor: K,
              top: h.top,
              height: h.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (U) => {
                if (U.metaKey || U.ctrlKey) {
                  y(x.lanes.flatMap((te) => te.markers.map((ge) => ge.segment.id)));
                  return;
                }
                b(x.key), p(x.key);
              },
              "aria-expanded": !P,
              "aria-current": oe ? "true" : void 0,
              "data-selected-timeline-group": oe ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: x.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: K
              },
              title: `${P ? "Expand" : "Collapse"} ${x.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, P ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, x.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              P ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${x.lanes.length} swimlane${x.lanes.length === 1 ? "" : "s"} hidden`
                ),
                F ? n(en, { key: "states", counts: x.counts }) : null
              ] : null
            )
          ]);
          const H = h.lane, ue = Ql(h.laneIndex), N = H.markers.some(({ segment: U }) => U.id === s);
          return n("div", {
            key: h.key,
            "data-grouped-swimlane": x.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ce}rem minmax(0,1fr)`,
              top: h.top,
              height: h.height,
              backgroundColor: ue
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": N ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: Zl(N, ue),
              title: `${Yn(H)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Yn(H),
              onClick: (U) => {
                (U.metaKey || U.ctrlKey) && y(H.markers.map((te) => te.segment.id));
              },
              onMouseEnter: () => A(H.key),
              onMouseLeave: () => A((U) => U === H.key ? null : U)
            }, [
              H.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (U) => {
                  U.stopPropagation(), R({ tagId: H.tagId, tagName: H.label, trigger: U.currentTarget });
                },
                "aria-label": `Configure ${H.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: E === H.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, H.label),
              (V = H.performers) != null && V.length ? n(Tr, {
                key: "performers",
                performers: H.performers,
                performerAssignments: H.performerAssignments
              }) : null,
              F ? n(en, { key: "counts", counts: H.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, H.markers.map(({ segment: U, track: te }) => {
              var Qe;
              const ge = Qr(U.startSec, X), Fe = U.endSec == null ? U.startSec : Math.max(U.startSec, U.endSec), Ie = Math.max(0, Qr(Fe, X) - ge), Pe = l.includes(U.id), Ge = U.id === s, Ee = yo(q.get(U.id)), Ve = U.endSec == null ? Ae(U.startSec) : `${Ae(U.startSec)} – ${Ae(U.endSec)}`, ft = (Qe = gi[Ee]) == null ? void 0 : Qe.label;
              return n("button", {
                key: U.id,
                type: "button",
                onClick: (gt) => {
                  gt.stopPropagation(), f(U, {
                    additive: gt.metaKey || gt.ctrlKey,
                    rangeSegmentIds: gt.shiftKey ? H.markers.map((ot) => ot.segment.id) : null
                  });
                },
                "aria-pressed": Pe,
                "aria-current": Ge ? "true" : void 0,
                "data-selected-timeline-marker": Ge ? "true" : void 0,
                "data-selected-segment-shortcut-target": Ge ? "true" : void 0,
                "aria-label": F ? `${U.tagName || "Tag segment"}${H.performerLabel ? `, ${H.performerLabel}` : ""}, ${U.reviewState}${ft ? `, ${ft}` : ""}, ${Ve}` : `${U.tagName || "Tag segment"}${H.performerLabel ? `, ${H.performerLabel}` : ""}, ${Ve}`,
                title: F ? `${U.tagName || "Tag segment"}${H.performerLabel ? ` · ${H.performerLabel}` : ""} · ${U.reviewState}${ft ? ` · ${ft}` : ""} · ${Ve}` : `${U.tagName || "Tag segment"}${H.performerLabel ? ` · ${H.performerLabel}` : ""} · ${Ve}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...F ? Vl(U.reviewState, Pe, Ee, Ge) : Jl(Pe, Ge),
                  left: `${ge}%`,
                  top: `${Xl(te)}rem`,
                  width: Yl(U.endSec, Ie),
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
  const [a, s] = G(null), [l, d] = G([]), [c, m] = G(null), [u, b] = G(""), [p, f] = G(!0), [y, w] = G(null), [R, g] = G(""), [B, F] = G(!1), z = fe(null), W = fe(0);
  ye(() => {
    const E = requestAnimationFrame(() => {
      var A;
      return (A = z.current) == null ? void 0 : A.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(E);
  }, [e]), ye(() => {
    const E = new AbortController();
    return f(!0), g(""), Promise.all([
      r ? Z(`/slot-definitions/${e}`, { signal: E.signal }) : Promise.resolve(null),
      Z("/segment-groups", { signal: E.signal })
    ]).then(([A, D]) => {
      const q = D.find((ee) => (ee.tags || []).some((pe) => Number(pe.tagId) === Number(e)));
      s(A), d(D), m((q == null ? void 0 : q.id) ?? null), b(q == null ? "" : String(q.id)), F(!1);
    }).catch((A) => {
      A.name !== "AbortError" && g(A.message || "Unable to load tag configuration.");
    }).finally(() => {
      E.signal.aborted || f(!1);
    }), () => E.abort();
  }, [r, e]);
  function O(E, A) {
    s({
      ...a,
      definitions: a.definitions.map((D, q) => q === E ? { ...D, ...A } : D)
    });
  }
  function S(E, A) {
    const D = E + A;
    if (D < 0 || D >= a.definitions.length) return;
    const q = [...a.definitions];
    [q[E], q[D]] = [q[D], q[E]], s({
      ...a,
      definitions: q.map((ee, pe) => ({ ...ee, sortOrder: pe }))
    });
  }
  function T(E) {
    const A = a.definitions[E], D = Number(A.assignmentCount) || 0, q = D === 0 ? "" : ` and its ${D} assignment${D === 1 ? "" : "s"}`;
    window.confirm(`Delete “${It(A)}”${q}?`) && (D > 0 && F(!0), s({
      ...a,
      definitions: a.definitions.filter((ee, pe) => pe !== E).map((ee, pe) => ({ ...ee, sortOrder: pe }))
    }));
  }
  async function k() {
    var A;
    w("slots"), g("Saving performer slots…");
    let E;
    try {
      E = await Z(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: B,
          definitions: a.definitions.map((D, q) => {
            var ee;
            return {
              id: D.id || void 0,
              label: ((ee = D.label) == null ? void 0 : ee.trim()) || null,
              sortOrder: q,
              genderHints: D.genderHints || []
            };
          })
        })
      }), s(E), F(!1);
    } catch (D) {
      D.status === 409 ? (g("Performer slots changed elsewhere; current values were reloaded."), (A = D.payload) != null && A.current && (s(D.payload.current), F(!1))) : g(D.message || "Unable to save performer slots."), w(null);
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
  async function $() {
    const E = u === "" ? null : Number(u);
    if (E !== c) {
      w("group"), g("Saving tag group…");
      try {
        await Z(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: E })
        });
      } catch (A) {
        g(A.message || "Unable to assign the tag group."), w(null);
        return;
      }
      try {
        const [A, D] = await Promise.allSettled([
          Z("/segment-groups"),
          o()
        ]);
        if (A.status === "fulfilled") {
          d(A.value);
          const q = A.value.find((pe) => (pe.tags || []).some((be) => Number(be.tagId) === Number(e))), ee = (q == null ? void 0 : q.id) ?? null;
          m(ee), b(ee == null ? "" : String(ee));
        }
        g(
          A.status === "fulfilled" && D.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        w(null);
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
    onKeyDownCapture: (E) => Tt(E, {
      onCancel: y ? void 0 : i
    })
  }, n("section", {
    ref: z,
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
        p ? null : n("label", { key: "choice", className: "block space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Assigned group"),
          n("select", {
            key: "select",
            value: u,
            disabled: y != null,
            onChange: (E) => b(E.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((E) => n("option", { key: E.id, value: String(E.id) }, E.name))
          ])
        ]),
        p ? null : n("button", {
          key: "save",
          type: "button",
          disabled: y != null || (u === "" ? null : Number(u)) === c,
          onClick: $,
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
              onChange: (E) => s({ ...a, allowSamePerformerInMultipleSlots: E.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((E, A) => n("article", {
            key: E.id || E._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: E.label || "",
                disabled: y != null,
                onChange: (D) => O(A, { label: D.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, $s.map((D) => n("label", { key: D, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: y != null,
                  checked: (E.genderHints || []).includes(D),
                  onChange: (q) => O(A, {
                    genderHints: q.target.checked ? [.../* @__PURE__ */ new Set([...E.genderHints || [], D])] : (E.genderHints || []).filter((ee) => ee !== D)
                  })
                }),
                n("span", { key: "text" }, $r(D))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${E.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: y != null || A === 0, onClick: () => S(A, -1), className: _, "aria-label": `Move ${It(E)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: y != null || A === a.definitions.length - 1, onClick: () => S(A, 1), className: _, "aria-label": `Move ${It(E)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: y != null, onClick: () => T(A), className: `${_} text-red-300` }, "Delete")
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
              onClick: k,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, y === "slots" ? "Saving…" : "Save performer slots")
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
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, analysisError: i, analysisRun: a, analysisStatus: s, approvalFacetCounts: l, autoAssignCandidates: d, autoAssignError: c, autoAssignOpen: m, autoAssignPerformers: u, autoAssigning: b, cancelQueuedReviewsForSegments: p, canMoveSelectionToBin: f, captureTrainingExport: y, centerTimelineRef: w, closeEditorFilters: R, closeFirstSegmentTagDialog: g, closeMaterializeDialog: B, closeMergeConfirmation: F, closePublishApprovedDialog: z, closeTagEditing: W, collapsedSegmentGroups: O, commonActionsRef: S, compatibilityMode: T, configuringTag: k, createSegment: $, creatingSegmentId: _, currentTime: E, deleteRejectedSegments: A, detail: D, detailPanelRef: q, detailWidth: ee, duplicateSegment: pe, editorFilters: be, editorLayout: X, editorRef: j, exportingExamples: ae, filtersButtonRef: ce, filtersOpen: J, firstSegmentTagOpen: he, focusRowRef: ve, handleSeparatorKeyDown: re, handleSeparatorPointerDown: se, handleSeparatorPointerMove: me, hasNextUnreviewed: Y, hasPreviousUnreviewed: de, hideDerivedSegments: M, history: ne, historyOpen: C, historySaving: v, horizontalLayoutSize: h, importNativeSegments: x, incorrectExamples: P, incorrectExamplesOpen: oe, lineage: K, markerRailWidth: H, materializeButtonRef: ue, materializeCancelButtonRef: N, materializeDerivedSegments: V, materializeError: U, materializeLoading: te, materializeOpen: ge, materializePreview: Fe, materializing: Ie, mediaStackRef: Pe, mergeCancelButtonRef: Ge, mergeConfirmation: Ee, mergeSaving: Ve, mergeSelectedSwimlane: ft, nativeImportState: Qe, onDetailChange: gt, onNavigate: ot, onReload: nt, onSlotsChanged: rt, openPublishApprovedDialog: dt, panelSeparatorProps: et, pendingInitialSeekRef: pt, performerSlots: xt, performerSlotsAvailable: Q, playbackControlsRef: le, previewDerivedSegments: Ne, provenance: Te, provenanceSources: xe, publishApprovedCancelButtonRef: We, publishApprovedDrafts: je, publishApprovedError: _e, publishApprovedOpen: ke, quickSearchOpen: Ue, railScrollRef: De, railToggleRef: we, recordHistoryAction: Be, rejectedDeletionPreview: at, removeIncorrectExample: Se, removingExampleId: Oe, restoreHistoryTarget: Me, runEditorAction: Et, saveMessage: Ze, saveTag: ct, saveTiming: Ut, savingSegmentId: Je, seekRef: Ce, segmentGroups: $e, segmentRailLayout: qe, segments: ut, selectAllVideoSegments: it, selectSegment: Dt, selectSegmentCollection: Ct, selectedGroups: Pt, selectedPerformerSlots: gn, selectedSegment: Ot, selectedSegmentGroupKey: nn, selectedSegmentIds: er, selectedSegments: rn, selectedSlotStatus: Pn, setAutoAssignError: tr, setAutoAssignOpen: pn, setConfiguringTag: Qt, setCurrentTime: fn, setEditorFilters: nr, setEditorLayout: Rr, setFiltersOpen: rr, setHideDerivedSegments: Mr, setHistoryOpen: on, setIncorrectExamplesOpen: yn, setQuickSearchOpen: On, setRailViewport: bn, setRejectedDeletionPreview: Er, setSaveMessage: or, setSelectedSegmentGroupKey: hn, setSelectedSegmentId: an, setShortcutsOpen: vn, setTimelineZoom: Ln, shotBoundaries: St, shortcutsOpen: ar, slotButtonRef: Fn, splitLayout: Kt, splitSegment: ir, startFullAnalysis: xn, stepVideoFrame: Sn, tagEditing: Dr, tagSearchRef: Pr, timelineDuration: jn, timelineRatioBounds: kn, timelineZoom: Bn, toggleSegmentGroup: tt, toggleSegmentRail: yt, updateTimelineRatio: Or, video: mt, videoPerformers: Lt, visibleCounts: At, visibleSegmentRailRows: Lr, visibleSegments: wn, wideLayout: Wt, workspaceRef: Gn } = e, Un = He(
    () => ut.filter((I) => !I.published && I.reviewState === "approved"),
    [ut]
  ), sr = ws(io), Nn = Un.length, lr = fe(null), Fr = He(() => () => on(!1), [on]), zt = Fe ? Fe.createCount + Fe.linkCount : null, bt = Je != null, sn = rn.length > 0, Kn = rn.length === 1, jr = sn && rn.every((I) => I.reviewState === "approved"), Br = sn && rn.every((I) => I.reviewState === "rejected"), Gr = [
    { id: "marker.create", label: "New segment", disabled: bt },
    { id: "marker.editTag", label: "Edit tag", disabled: bt || !sn },
    { id: "marker.setStart", label: "Set start", disabled: bt || !Kn },
    { id: "marker.setEnd", label: "Set end", disabled: bt || !Kn },
    { id: "marker.split", label: "Split", disabled: bt || !Kn },
    ...T ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !de, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: jr ? "Unapprove" : "Approve", disabled: bt || !sn, tone: "approve" },
      { id: "marker.reject", label: Br ? "Unreject" : "Reject", disabled: bt || !sn, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !Y, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...T ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: bt || !f, tone: "reject" }
    ]
  ];
  function kt(I) {
    const Re = er.includes(I.id), vt = I.id === (Ot == null ? void 0 : Ot.id), ht = I.endSec == null ? Ae(I.startSec) : `${Ae(I.startSec)} – ${Ae(I.endSec)}`, Zt = `${Gt(I.sourceKey)}${I.confidence != null ? ` · ${Math.round(I.confidence * 100)}%` : ""}`;
    return n("button", {
      key: I.id,
      type: "button",
      onClick: (Ht) => Dt(I, { additive: Ht.metaKey || Ht.ctrlKey }),
      "aria-pressed": Re,
      "aria-current": vt ? "true" : void 0,
      "data-selected-segment-shortcut-target": vt ? "true" : void 0,
      "aria-label": T ? `${I.tagName || "Tag segment"}, ${I.reviewState}${I.isDerived ? ", derived segment" : ""}, ${ht}` : `${I.tagName || "Tag segment"}${I.isDerived ? ", derived segment" : ""}, ${ht}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: mi(Re, vt)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        T ? n(mn, { key: "review", state: I.reviewState, includeLabel: !1 }) : null,
        I.isDerived ? n(Ar, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          I.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, ht),
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
    ref: j,
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
            onClick: (I) => Ti(I, ot, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${mt.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: mt.title || `Video ${mt.id}`
          }, mt.title || `Video ${mt.id}`)),
          ...Lt.map((I) => n(Qn, {
            key: lt(I),
            performer: { id: lt(I), name: I.name },
            compact: !0,
            tooltip: I.name
          })),
          T ? n(en, { key: "review-counts", counts: At }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          T ? null : n(Mi, { key: "bin", onNavigate: ot, compact: !0 }),
          n(Ei, { key: "settings", onNavigate: ot, compact: !0 })
        ])
      ]),
      T && D.nativeImportCount > 0 ? n("div", {
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
          T ? n("div", {
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
                onClick: (vt) => {
                  var ht;
                  (ht = vt.currentTarget.closest("details")) == null || ht.removeAttribute("open"), xn(Re);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, I)))
            ])
          ]) : null,
          T ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: Je != null || d.length === 0,
            onClick: () => {
              tr(""), pn(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${d.length ? ` (${d.length})` : ""}`) : null,
          T ? n("button", {
            key: "materialize-derived",
            ref: ue,
            type: "button",
            disabled: Je != null || te || Ie || zt === 0,
            onClick: Ne,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, te ? "Analyzing…" : `Auto-Materialize${zt != null ? ` (${zt})` : ""}`) : null,
          T ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: Je != null || Nn === 0,
            onClick: (I) => dt(I.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": ke,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${Nn ? ` (${Nn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: ae || Oe != null || P.length === 0,
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
            onClick: () => rr(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": J,
            className: `${Xe} ${r ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(yr, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${r ? ` (${r})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => vn(!0),
            className: Xe
          }, [n(yr, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            ref: lr,
            type: "button",
            disabled: (T ? ne.actions.length === 0 : ln == null) || Je != null || v,
            onClick: T ? () => on((I) => !I) : () => Me(
              ln.sequence - 1
            ),
            "aria-controls": T ? Di : void 0,
            "aria-expanded": T ? C : void 0,
            className: Xe
          }, [
            n(yr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, T ? `History${ne.actions.length ? ` (${ne.actions.length})` : ""}` : ln ? `Undo ${ln.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: we,
            type: "button",
            onClick: yt,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": X.markerRailOpen,
            className: Xe
          }, [
            n(yr, { key: "icon", name: "list" }),
            n("span", { key: "label" }, X.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ]),
      T && C ? n(gc, {
        key: "history-popover",
        history: ne,
        historySaving: v,
        anchorRef: lr,
        onRestore: Me,
        onClose: Fr
      }) : null
    ]),
    J ? n(mc, {
      key: "editor-filters",
      filters: be,
      hideDerivedSegments: M,
      performers: Lt,
      provenanceSources: xe,
      reviewCounts: l,
      segments: ut,
      segmentGroups: $e,
      reviewMode: T,
      onChange: nr,
      onHideDerivedChange: Mr,
      onClose: R
    }) : null,
    he ? n(uc, {
      key: "first-segment-tag-dialog",
      saving: Je != null,
      error: Ze,
      onSelect: (I, Re) => $(I, Re),
      onClose: g
    }) : null,
    Ue ? n(yc, {
      key: "quick-search-dialog",
      segments: jl(o),
      onSelect: (I) => {
        On(!1), Dt(I, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        On(!1), requestAnimationFrame(() => {
          var I;
          return (I = j.current) == null ? void 0 : I.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    m ? n(vc, {
      key: "auto-assign-dialog",
      candidates: d,
      processing: b,
      error: c,
      onConfirm: u,
      onClose: () => pn(!1)
    }) : null,
    Ee ? n(Sc, {
      key: "merge-selection-dialog",
      merge: Ee,
      processing: Ve,
      undoable: !T,
      cancelButtonRef: Ge,
      onConfirm: (I) => ft(!0, I, Ee),
      onClose: F
    }) : null,
    ge ? n(wc, {
      key: "materialize-derived-dialog",
      preview: Fe,
      loading: te,
      processing: Ie,
      error: U,
      cancelButtonRef: N,
      onConfirm: V,
      onClose: () => {
        Ie || B();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: Gn,
      className: `${Kt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      X.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: Wt ? { position: "absolute", top: 0, right: 0, width: H, height: h.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        ut.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : wn.length === 0 ? n(
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
        }, Lr.map((I) => {
          var vt;
          let Re;
          if (I.kind === "group") {
            const ht = O.includes(I.group.key), Zt = I.group.lanes.reduce((Ht, Ur) => Ht + Ur.markers.length, 0);
            Re = n("button", {
              type: "button",
              onClick: () => {
                hn(I.group.key), tt(I.group.key);
              },
              "aria-expanded": !ht,
              "aria-current": nn === I.group.key ? "true" : void 0,
              "data-segment-rail-group": I.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${nn === I.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, ht ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: I.group.name }, I.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Zt),
              T && ht ? n(en, { key: "states", counts: I.group.counts }) : null
            ]);
          } else I.kind === "lane" ? Re = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Yn(I.lane),
            "aria-label": Yn(I.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, I.lane.label),
            (vt = I.lane.performers) != null && vt.length ? n(Tr, {
              key: "performers",
              performers: I.lane.performers,
              performerAssignments: I.lane.performerAssignments
            }) : null,
            T ? n(en, { key: "states", counts: I.lane.counts }) : null
          ]) : Re = kt(I.segment);
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
          ref: Pe,
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
              gridTemplateColumns: X.markerRailOpen ? `${ee}px 0.5rem minmax(0,1fr) 0.5rem ${H}px` : `${ee}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(Nc, {
              key: "tools",
              compatibilityMode: T,
              selectedSegment: Ot,
              selectedSegments: rn,
              selectedGroups: Pt,
              saveMessage: Ze,
              savingSegmentId: Je,
              creatingSegmentId: _,
              acquireSaveLock: t,
              setSaveMessage: or,
              saveTag: ct,
              slotStatus: Pn,
              performerSlotsAvailable: Q,
              selectedPerformerSlots: gn,
              performerSlots: xt,
              detail: D,
              onDetailChange: gt,
              onCancelQueuedReview: p,
              video: mt,
              slotButtonRef: Fn,
              tagSearchRef: Pr,
              tagEditing: Dr,
              onCancelTagEditing: W,
              detailPanelRef: q,
              onReduceSelection: (I) => {
                Dt(I), requestAnimationFrame(() => {
                  var Re;
                  return (Re = q.current) == null ? void 0 : Re.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Ut,
              onSlotsChanged: rt,
              onRecordHistory: Be,
              splitSegment: ir,
              duplicateSegment: pe,
              provenance: Te,
              lineage: K,
              onNavigateLineageItem: (I) => {
                const Re = ut.find((vt) => vt.itemId === I);
                Re && an(Re.id);
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
              n("div", { className: "h-full min-h-0 w-full" }, n(Ea, {
                streamUrl: `/api/stream/video/${mt.id}`,
                posterUrl: `/api/stream/video/${mt.id}/screenshot?v=${encodeURIComponent(mt.updatedAt || "")}`,
                format: mt.videoFile.format,
                audioCodec: mt.videoFile.audioCodec,
                duration: mt.videoFile.duration,
                videoId: mt.id,
                trackingEnabled: !1,
                onSeekRegister: (I) => {
                  Ce.current = I, Pl(pt.current, ut, I) && (pt.current = null);
                },
                onPlaybackControlRegister: (I) => {
                  le.current = I;
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
            ref: S,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...Gr.map((I) => {
              var ht;
              const Re = (ht = sr[I.id]) == null ? void 0 : ht[0], vt = I.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : I.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: I.id,
                type: "button",
                disabled: I.disabled,
                "data-action-id": I.id,
                onClick: (Zt) => {
                  const Ht = Zt.currentTarget;
                  Et(I.id, { target: Ht, preserveFocus: !0 }), I.focusWhenDisabled && requestAnimationFrame(() => {
                    Cc(Ht, S.current, I.focusWhenDisabled);
                  });
                },
                title: Re ? `${I.label} (${Re})` : I.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${vt}`
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
                disabled: !mt.videoFile,
                onClick: () => Sn(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(Ns, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !mt.videoFile,
                onClick: () => Sn(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(Is, { className: "h-4 w-4", "aria-hidden": !0 }))
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
            onPointerDown: se,
            onPointerMove: me,
            onKeyDown: re,
            onDoubleClick: () => Or($t.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: Kt ? void 0 : { height: "20rem" } }, n(Ic, {
            segments: wn,
            shotBoundaries: St,
            segmentGroups: $e,
            performerSlots: xt,
            collapsedGroupKeys: O,
            selectedGroupKey: nn,
            selectedSegmentId: Ot == null ? void 0 : Ot.id,
            selectedSegmentIds: er,
            duration: jn,
            currentTime: E,
            zoom: Bn,
            onZoomChange: Ln,
            onSelectGroup: hn,
            onToggleGroup: tt,
            onSelect: (I, Re) => Dt(I, Re),
            onSelectSegments: Ct,
            onSelectAll: it,
            onConfigureTag: (I) => Qt(I),
            onSeekTime: (I) => {
              var Re;
              return (Re = Ce.current) == null ? void 0 : Re.call(Ce, I, !1);
            },
            centerRef: w,
            showReviewState: T,
            swimlaneTitleWidth: X.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (I) => Rr((Re) => ({ ...Re, swimlaneTitleWidth: I }))
          }))
        ])
      ])
    ]),
    k ? n(xo, {
      key: `configure-tag:${k.tagId}`,
      tagId: k.tagId,
      tagName: k.tagName,
      performerSlotsEnabled: T,
      onSaved: nt,
      onClose: () => {
        const I = k.trigger;
        Qt(null), requestAnimationFrame(() => {
          var Re;
          I != null && I.isConnected ? I.focus({ preventScroll: !0 }) : (Re = j.current) == null || Re.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    ke ? n(hc, {
      key: "publish-approved-dialog",
      drafts: Un,
      processing: Je === -1,
      error: _e,
      cancelButtonRef: We,
      onConfirm: je,
      onClose: z
    }) : null,
    at ? n(xc, {
      key: "rejected-deletion-dialog",
      preview: at,
      onConfirm: () => {
        A(at), requestAnimationFrame(() => {
          var I;
          return (I = j.current) == null ? void 0 : I.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Er(null), requestAnimationFrame(() => {
          var I;
          return (I = j.current) == null ? void 0 : I.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    ar ? n(pc, {
      key: "shortcuts-dialog",
      reviewMode: T,
      bindings: sr,
      onClose: () => vn(!1)
    }) : null,
    oe ? n(fc, {
      key: "incorrect-examples-dialog",
      examples: P,
      exporting: ae,
      removingExampleId: Oe,
      onExport: y,
      onRemove: Se,
      onClose: () => yn(!1)
    }) : null
  ]);
}
function Tc(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: m, setCollapsedSegmentGroups: u, setEditorFilters: b, setHideDerivedSegments: p, setSaveMessage: f, setSelectedSegmentGroupKey: y, setSelectedSegmentId: w, setSelectedSegmentIds: R } = e;
  function g(O) {
    const S = jt(t, O);
    S && u((T) => xi(T, S));
  }
  function B(O) {
    w(O), R(O == null ? [] : [O]), c.current = O, m.current = [];
  }
  function F(O, {
    focusEditor: S = !1,
    seekToSegment: T = !1,
    additive: k = !1,
    rangeSegmentIds: $ = null
  } = {}) {
    var E, A;
    const _ = Zs({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: m.current
    }, O.id, $, k);
    R(_.selectedSegmentIds), w(_.activeSegmentId), c.current = _.anchorSegmentId, m.current = _.rangeBaseSegmentIds, _.activeSegmentId != null && y(jt(t, _.activeSegmentId)), g(O.id), S && ((E = r.current) == null || E.focus({ preventScroll: !0 })), T && ((A = i.current) == null || A.call(i, O.startSec, !1));
  }
  function z(O) {
    const S = Ys(
      d,
      l,
      O
    );
    R(S.selectedSegmentIds), w(S.activeSegmentId), c.current = S.activeSegmentId, m.current = [], S.activeSegmentId != null && (y(jt(t, S.activeSegmentId)), g(S.activeSegmentId));
  }
  function W() {
    var T;
    const O = el(s), S = O.includes(l) ? l : O[0] ?? null;
    b(Mt({})), p(!1), R(O), w(S), c.current = S, m.current = [], S != null && y(jt(
      cn(s, a, o),
      S
    )), f(O.length === 0 ? "There are no segments to select." : `${O.length} segments selected. Collapsed Segment groups keep their selected segments.`), (T = r.current) == null || T.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: g, replaceSegmentSelection: B, selectSegment: F, selectSegmentCollection: z, selectAllVideoSegments: W };
}
function Ac(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, stableSaveIdentity: c, historyRef: m, onConflict: u, onDetailChange: b, onReload: p, recordHistoryAction: f, revealSegmentGroupForSelection: y, savingSegmentId: w, selectedGroups: R, selectedSegment: g, selectedSegmentIdRef: B, selectedSegments: F, selectionAnchorIdRef: z, selectionRangeBaseIdsRef: W, setMergeConfirmation: O, setSaveMessage: S, setSelectedSegmentId: T, setSelectedSegmentIds: k, video: $ } = e;
  function _() {
    O(null), requestAnimationFrame(() => {
      var q;
      return (q = a.current) == null ? void 0 : q.focus({ preventScroll: !0 });
    });
  }
  async function E(q = !1, ee = !1, pe = null) {
    if (w != null) return;
    const be = pe || hi(
      R,
      { nativeOnly: !o }
    );
    if (!be) {
      S("Select at least two segments from one swimlane.");
      return;
    }
    if (!q && Wa()) {
      O(be);
      return;
    }
    ee && Va(!1);
    const X = be.endSec == null ? "open end" : Ae(be.endSec);
    let j = be.segments[0];
    const ae = o ? null : Rt(be.segments, !1), ce = o ? null : crypto.randomUUID(), J = be.segments.map((me) => me.id), he = Md(i, be.segments).segments.find((me) => me.id === j.id), ve = {
      startSec: he.startSec,
      endSec: he.endSec,
      sourceKey: he.sourceKey,
      sourceRunId: he.sourceRunId,
      confidence: he.confidence,
      isDerived: he.isDerived
    }, re = r("merge", be.segments[0].id);
    if (!re) return;
    _();
    const se = Yt();
    s({
      type: "add",
      entry: { id: se, op: "merge", targets: be.segments.map(qt), values: ve }
    }), k([j.id]), T(j.id), z.current = j.id, W.current = [];
    try {
      const me = be.segments.slice(1);
      if (!o || j.nativeSegmentId != null) {
        const Y = me.map((M) => {
          const ne = `merge-native-selection:${$.id}:${j.id}:${M.id}:${j.updatedAt}:${M.updatedAt}`;
          return { key: ne, operationId: Ke(ne), segmentId: M.id, expectedUpdatedAt: M.updatedAt };
        }), de = await Z(`/videos/${$.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: j.id,
            expectedSurvivorUpdatedAt: j.updatedAt,
            consumedSegments: Y.map(({ key: M, ...ne }) => ne),
            historyReceiptId: ce
          })
        });
        j = de.survivor, b((M) => ua(M, de), $.id), s({ type: "confirm", key: se, applied: !0 }), Y.forEach(({ key: M }) => ze(M));
      } else {
        const Y = me.map((M) => {
          const ne = `merge-draft-selection:${$.id}:${j.itemId}:${M.itemId}:${j.revision}:${M.revision}`;
          return { key: ne, operationId: Ke(ne), itemId: M.itemId, expectedRevision: M.revision };
        }), de = await Z(`/videos/${$.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: j.itemId,
            expectedSurvivorRevision: j.revision,
            consumedDrafts: Y.map(({ key: M, ...ne }) => ne)
          })
        });
        j = de.survivor, b((M) => ua(M, de), $.id), s({ type: "confirm", key: se, applied: !0 }), Y.forEach(({ key: M }) => ze(M));
      }
      k([j.id]), T(j.id), z.current = j.id, W.current = [], o ? t(Vt) : await f(
        "segments.merge",
        `Merged ${be.segments.length} segments`,
        ae,
        Rt([j], !1),
        ce
      ), y(j.id), S(`${be.segments.length} segments merged into ${Ae(be.startSec)} – ${X}.`);
    } catch (me) {
      s({ type: "discard", key: se }), k(J), T((g == null ? void 0 : g.id) ?? J[0] ?? null), z.current = (g == null ? void 0 : g.id) ?? J[0] ?? null, W.current = [], me.status === 409 ? await u() : S(me.message || "Unable to merge selected segments.");
    } finally {
      re();
    }
  }
  function A(q, ee = F, pe = g) {
    if (ee.length === 0) return Promise.resolve(null);
    const be = gl(q, ee, pe), X = Math.max(0, be.identities.indexOf(be.activeIdentity)), j = d(), ae = ki(j) != null || j.queued.some((J) => ho(J.targets, be.identities.map(c))), ce = l({
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
    return ce ? (ae && S(`${q === "approved" ? "Approval" : "Rejection"} queued…`), ce.done) : (S("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function D({ detail: q, segments: ee, onConflict: pe, onReload: be }, X) {
    var de;
    const j = pl(X, ee);
    if (!j) {
      S("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: ae, selectedSegments: ce, selectedSegment: J } = j, he = ml(ce, ae), ve = ce.filter((M) => M.reviewState !== he);
    if (ve.length === 0) return;
    const re = ce.map((M) => ({
      id: M.id,
      itemId: M.itemId,
      nativeSegmentId: M.nativeSegmentId
    })), se = re.find((M) => M.id === (J == null ? void 0 : J.id)) || re[0], me = (M, ne = !1) => {
      if (!(M != null && M.segments) || !ne && !eo(B.current, se.id))
        return;
      const C = re.map((h) => Ye(M == null ? void 0 : M.segments, h)).filter(Boolean), v = Ye(M == null ? void 0 : M.segments, se) || C[0] || null;
      k(C.map((h) => h.id)), T((v == null ? void 0 : v.id) ?? null), z.current = (v == null ? void 0 : v.id) ?? null, W.current = [];
    };
    S(`Updating ${ve.length} selected segment${ve.length === 1 ? "" : "s"}…`);
    const Y = Yt();
    s({
      type: "add",
      entry: { id: Y, op: "patch", targets: ve.map(qt), values: { reviewState: he } }
    });
    try {
      const M = await Z(`/videos/${$.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: m.current.revision,
          reviewState: he,
          segments: ce.map((h) => h.published ? {
            nativeSegmentId: h.nativeSegmentId,
            expectedUpdatedAt: h.updatedAt
          } : {
            itemId: h.itemId,
            expectedRevision: h.revision
          })
        })
      }), ne = new Map((M.items || []).map((h) => [
        h.requestedNativeSegmentId != null ? `native:${h.requestedNativeSegmentId}` : `item:${h.requestedItemId}`,
        h
      ]));
      if (re.forEach((h) => {
        const x = ne.get(h.nativeSegmentId != null ? `native:${h.nativeSegmentId}` : `item:${h.itemId}`);
        x && (h.nativeSegmentId = x.nativeSegmentId, h.itemId = x.itemId);
      }), M.history && t(M.history), he === "rejected" || (M.items || []).some((h) => h.requestedNativeSegmentId != null && h.nativeSegmentId !== h.requestedNativeSegmentId)) {
        const h = await be();
        s({ type: "confirm", key: Y, applied: h != null }), me(h), S(`${M.updatedCount} selected segment${M.updatedCount === 1 ? "" : "s"} ${he === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const v = (h) => ({
        ...h,
        approvedSetVersion: M.approvedSetVersion || h.approvedSetVersion,
        segments: (h.segments || []).map((x) => {
          const P = ne.get(x.nativeSegmentId != null ? `native:${x.nativeSegmentId}` : `item:${x.itemId}`);
          return P ? {
            ...x,
            id: P.nativeSegmentId != null ? P.nativeSegmentId : -P.itemId,
            itemId: P.itemId,
            nativeSegmentId: P.nativeSegmentId,
            published: P.nativeSegmentId != null,
            reviewState: he,
            revision: P.nativeSegmentId != null ? x.revision : P.revision,
            updatedAt: P.updatedAt
          } : x;
        })
      });
      b(v, $.id), s({ type: "confirm", key: Y, applied: !0 }), me(v(q)), S(`${M.updatedCount} selected segment${M.updatedCount === 1 ? "" : "s"} ${he === "approved" ? "approved" : he === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (M) {
      s({ type: "discard", key: Y }), M.status === 409 && ((de = M.payload) != null && de.currentHistory) && t(M.payload.currentHistory);
      const ne = M.status === 409 ? await pe() : q;
      me(ne, !0), S(M.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: _, mergeSelectedSwimlane: E, saveSelectedReviewState: A };
}
function Rc(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: m, detail: u, editorFilters: b, editorRef: p, cancelSaveTasks: f, dispatchPendingChanges: y, enqueueSave: w, stableSaveIdentity: R, exportingExamples: g, hideDerivedSegments: B, incorrectExamples: F, lineage: z, materializeButtonRef: W, materializePreview: O, materializeRestoreFocusRef: S, materializing: T, mutateSegment: k, runSegmentMutation: $, pendingChanges: _, onConflict: E, onDetailChange: A, onReload: D, performerSlots: q, recordHistoryAction: ee, refreshMaterializationPreview: pe, removingExampleId: be, revealSegmentGroupForSelection: X, savingSegmentId: j, segmentGroups: ae, segments: ce, selectedSegment: J, selectedSegmentIdRef: he, selectedSegments: ve, selectionAnchorIdRef: re, selectionRangeBaseIdsRef: se, setAutoAssignError: me, setAutoAssignOpen: Y, setAutoAssigning: de, setEditorFilters: M, setExportingExamples: ne, setHideDerivedSegments: C, setIncorrectExamples: v, setMaterializeError: h, setMaterializeLoading: x, setMaterializeOpen: P, setMaterializePreview: oe, setMaterializing: K, setRejectedDeletionPreview: H, setRemovingExampleId: ue, setSaveMessage: N, setSelectedSegmentGroupKey: V, setSelectedSegmentId: U, setSelectedSegmentIds: te, video: ge } = e;
  async function Fe() {
    var we, Be, at;
    if (ve.length === 0 || !J || j != null) return;
    const Q = Nd(ve, F), le = Q.segments;
    if (le.length === 0) return;
    const Ne = ve.map((Se) => ({
      id: Se.id,
      itemId: Se.itemId,
      nativeSegmentId: Se.nativeSegmentId
    })), Te = Ne.find((Se) => Se.id === J.id) || Ne[0], xe = [], We = [];
    let je = !1, _e = u, ke = !1;
    const Ue = [], De = r("feedback", Te.id);
    if (De) {
      N(Q.action === "remove" ? `Removing ${le.length} selected incorrect example${le.length === 1 ? "" : "s"}…` : `Collecting ${le.length} selected segment${le.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const Se = async (Ce, $e) => {
          const qe = Ce.nativeSegmentId != null, ut = Q.action === "remove" ? `incorrect-example-remove:${ge.id}:${$e == null ? void 0 : $e.id}:${$e == null ? void 0 : $e.revision}:${$e == null ? void 0 : $e.representationRevision}` : `incorrect-example-collect:${ge.id}:${qe ? `native:${Ce.nativeSegmentId}:${Ce.updatedAt}` : `item:${Ce.itemId}:${Ce.revision}`}`;
          if (Q.action === "remove" && !$e)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let it;
          try {
            it = Q.action === "remove" ? await Z(
              `/videos/${ge.id}/incorrect-examples/${$e.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: Ke(ut),
                  expectedExampleRevision: $e.revision,
                  expectedRepresentationRevision: $e.representationRevision
                })
              }
            ) : await Z(`/videos/${ge.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Ke(ut),
                nativeSegmentId: qe ? Ce.nativeSegmentId : null,
                itemId: qe ? null : Ce.itemId,
                expectedUpdatedAt: qe ? Ce.updatedAt : null,
                expectedRevision: qe ? null : Ce.revision
              })
            });
          } catch (Dt) {
            throw Dt.operationKey = ut, Dt;
          }
          if (!Id(Q.action, it))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return ze(ut), it;
        };
        for (const Ce of le) {
          const $e = Q.action === "remove" ? F.find((qe) => qe.itemId != null && qe.itemId === Ce.itemId) : null;
          try {
            const qe = Ne.find((Ct) => Ct.id === Ce.id);
            let ut = Ye(
              _e == null ? void 0 : _e.segments,
              qe
            ) || Ce, it;
            try {
              it = await Se(ut, $e);
            } catch (Ct) {
              if (Ct.status === 409 && ((Be = (we = Ct.payload) == null ? void 0 : we.result) == null ? void 0 : Be.code) === "OPERATION_REPLAYED")
                _e = await Z(
                  `/videos/${ge.id}/editor`
                ), ke = !0, Ue.length = 0, ze(Ct.operationKey), it = Ct.payload.result;
              else {
                if (Q.action !== "collect" || Ct.status !== 409) throw Ct;
                const Pt = await Z(
                  `/videos/${ge.id}/editor`
                );
                _e = Pt, ke = !0, Ue.length = 0;
                const gn = Ye(
                  Pt == null ? void 0 : Pt.segments,
                  qe
                );
                if (!gn) throw Ct;
                ut = gn, it = await Se(ut, null);
              }
            }
            qe && it.itemId != null && (qe.itemId = it.itemId), _e = vr(
              _e,
              it.editorDelta
            ), Ue.push(it.editorDelta);
            const Dt = { segment: Ce, result: it, example: $e };
            xe.push(Dt);
          } catch (qe) {
            if (We.push(qe), ![400, 404, 409].includes(qe.status)) break;
          }
        }
        if (c && xe.length > 0) {
          const Ce = Q.action === "remove", $e = xe.length;
          await ee(
            Ce ? "feedback.remove" : "feedback.collect",
            Ce ? `Removed ${$e} incorrect AI example${$e === 1 ? "" : "s"}` : `Collected ${$e} incorrect AI example${$e === 1 ? "" : "s"}`,
            pr(xe, Ce),
            pr(xe, !Ce)
          ) || (je = !0);
        }
        xe.some(({ result: Ce }) => Ce.representation === "basicNativeBin") && Wn();
        const Oe = eo(
          he.current,
          Te.id
        ), Me = Q.action === "collect" && xe.some(({ segment: Ce }) => Ce.id === Te.id), Et = xe.map(({ segment: Ce }) => Ce.id), Ze = Me ? nl(
          o,
          Et,
          Te.id
        ) : null, ct = Me ? (Ze == null ? void 0 : Ze.id) ?? null : Te.id;
        Oe && Me && (te(Ze ? [Ze.id] : []), U((Ze == null ? void 0 : Ze.id) ?? wr), re.current = (Ze == null ? void 0 : Ze.id) ?? null, se.current = []);
        const Ut = await Z(`/videos/${ge.id}/incorrect-examples`);
        v(Ut);
        const Je = _e;
        if (A(ke ? Je : (Ce) => Ue.reduce(vr, Ce), ge.id), Oe && eo(
          he.current,
          ct
        )) {
          let Ce, $e;
          Me ? ($e = Ze ? Ye(Je == null ? void 0 : Je.segments, {
            id: Ze.id,
            itemId: Ze.itemId,
            nativeSegmentId: Ze.nativeSegmentId
          }) : null, Ce = $e ? [$e] : []) : (Ce = Ne.map((qe) => Ye(Je == null ? void 0 : Je.segments, qe)).filter(Boolean), $e = Ye(Je == null ? void 0 : Je.segments, Te) || Ce[0] || null), te(Ce.map((qe) => qe.id)), U(($e == null ? void 0 : $e.id) ?? (Me ? wr : null)), re.current = ($e == null ? void 0 : $e.id) ?? null, se.current = [], V($e ? jt(o, $e.id) : null), $e && X($e.id);
        }
        if (We.length > 0) {
          const Ce = ((at = We[0]) == null ? void 0 : at.message) || "Only segments with registered AI provenance can be collected.";
          xe.length === 0 ? N(Ce) : Q.action === "remove" ? N(
            `Partially removed ${xe.length} of ${le.length} selected incorrect examples. ${Ce}`
          ) : N(
            `Partially collected ${xe.length} of ${le.length} selected segments. ${Ce}`
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
    if (!Q || be != null || g) return;
    const le = r("feedback", -1);
    if (!le) {
      N("Wait for the current save to finish before removing the incorrect example.");
      return;
    }
    try {
      await Pe(Q);
    } finally {
      le();
    }
  }
  async function Pe(Q) {
    var Ne, Te;
    ue(Q.id);
    const le = `incorrect-example-remove:${ge.id}:${Q.id}:${Q.revision}:${Q.representationRevision}`;
    try {
      let xe, We = !1;
      try {
        xe = await Z(
          `/videos/${ge.id}/incorrect-examples/${Q.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ke(le),
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
      ze(le);
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
        je = await ee(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          pr(Ue, !0),
          pr(Ue, !1)
        );
      }
      const _e = await Z(
        `/videos/${ge.id}/incorrect-examples`
      );
      v(_e), We ? await D() : A(
        (ke) => vr(ke, xe.editorDelta),
        ge.id
      ), Q.representation === "basicNativeBin" && Wn(), N(je ? We ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : Q.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (xe) {
      xe.status === 409 && await E(), N(xe.message || "Unable to remove the incorrect example.");
    } finally {
      ue(null);
    }
  }
  async function Ge() {
    if (g || be != null || F.length === 0) return;
    ne(!0);
    const Q = `incorrect-example-export:${ge.id}:${F.map((le) => `${le.id}:${le.revision}:${le.representationRevision}`).join(",")}`;
    try {
      const le = await $d(
        ge.id,
        F
      ), Ne = new FormData();
      Ne.append("metadata", JSON.stringify({
        operationId: Ke(Q),
        examples: le.captures
      }));
      for (const ke of le.files)
        Ne.append(ke.fieldName, ke.file);
      const Te = await Z(
        `/videos/${ge.id}/incorrect-examples/export`,
        { method: "POST", body: Ne }
      ), xe = await Hl(Te.downloadUrl), We = URL.createObjectURL(xe.blob), je = document.createElement("a");
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
    } catch (le) {
      N(le.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      ne(!1);
    }
  }
  async function Ee(Q = null) {
    const le = ce.filter((we) => we.reviewState === "rejected"), Ne = le.length, Te = F.some((we) => we.representation === "fullItem");
    if (Q == null && Ne === 0 && !Te) {
      N("There are no rejected segments to delete.");
      return;
    }
    if (Q == null) {
      const we = r("delete-rejected", -1);
      if (!we) return;
      N("Preparing deletion summary…");
      try {
        const Be = await Z(`/videos/${ge.id}/rejected/deletion/preview`, { method: "POST" }), at = Number(Be.deletedSegmentCount) || 0, Se = Number(Be.deferredRejectedSegmentCount) || 0, Oe = Number(Be.protectedIncorrectExampleCount) || 0;
        if (at === 0) {
          Se > 0 ? N(
            `${Se} feedback-protected rejected segment${Se === 1 ? "" : "s"} kept. ${Oe} AI feedback example${Oe === 1 ? "" : "s"} must be exported before ${Se === 1 ? "this segment can" : "these segments can"} be deleted.`
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
    const xe = Q, We = Number(xe.deferredRejectedSegmentCount) || 0, je = he.current, _e = We === 0 ? Rd(u, le.map((we) => we.id)) : u, ke = _e.segments.find((we) => we.reviewState === "unreviewed") || _e.segments[0] || null, Ue = r("delete-rejected", -1);
    if (!Ue) return;
    H(null), N("Deleting rejected segments…");
    const De = We === 0 ? Yt() : null;
    De && (y({
      type: "add",
      entry: { id: De, op: "remove", targets: le.map(qt) }
    }), te(ke ? [ke.id] : []), U((ke == null ? void 0 : ke.id) ?? null), re.current = (ke == null ? void 0 : ke.id) ?? null, se.current = []);
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
      const at = await D();
      De && y({ type: "confirm", key: De, applied: at != null }), Be.deletedSegmentCount > 0 && t(Vt);
      const Se = We > 0 ? ` ${We} feedback-protected rejected segment${We === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      N(`${Be.deletedSegmentCount} segment${Be.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Se}`);
    } catch (we) {
      De && y({ type: "discard", key: De }), te(je == null ? [] : [je]), U(je), re.current = je, se.current = [], N(we.message || "Unable to delete rejected segments.");
    } finally {
      Ue();
    }
  }
  async function Ve(Q = i) {
    if (a || Q.length === 0) return;
    const le = r("auto-assign", -1);
    if (!le) {
      me("Wait for the current save to finish before assigning performers.");
      return;
    }
    try {
      await ft(Q);
    } finally {
      le();
    }
  }
  async function ft(Q) {
    de(!0), me("");
    try {
      const le = await Z(`/videos/${ge.id}/segments/auto-assign-performer-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeSegmentIds: Q.flatMap((Ne) => Ne.nativeSegmentId == null ? [] : [Ne.nativeSegmentId]),
          itemIds: Q.flatMap((Ne) => Ne.published || Ne.itemId == null ? [] : [Ne.itemId])
        })
      });
      Y(!1), await D(), N(`${le.assignedSegmentCount} segment${le.assignedSegmentCount === 1 ? "" : "s"} received ${le.assignedSlotCount} performer-slot assignment${le.assignedSlotCount === 1 ? "" : "s"}.`);
    } catch (le) {
      me(le.message || "Unable to auto-assign performers.");
    } finally {
      de(!1);
    }
  }
  async function Qe() {
    P(!0), h(""), !O && (x(!0), pe());
  }
  function gt() {
    S.current = !0, P(!1), requestAnimationFrame(() => {
      var Q;
      return (Q = W.current) == null ? void 0 : Q.focus({ preventScroll: !0 });
    });
  }
  async function ot() {
    if (!O || T || O.createCount + O.linkCount === 0)
      return;
    const Q = r("materialize", -1);
    if (!Q) {
      h("Wait for the current save to finish before materializing derived segments.");
      return;
    }
    try {
      await nt();
    } finally {
      Q();
    }
  }
  async function nt() {
    K(!0), h("");
    let Q;
    try {
      const le = `materialize-derived:${ge.id}:${O.fingerprint}`;
      Q = await Z(`/videos/${ge.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ke(le),
          fingerprint: O.fingerprint,
          maxDepth: 3
        })
      }), ze(le);
    } catch (le) {
      le.status === 409 && oe(null), h(le.message || "Unable to materialize derived segments."), K(!1);
      return;
    }
    oe((le) => le && { ...le, createCount: 0, linkCount: 0 });
    try {
      await D(), gt(), oe(null);
      const le = Q.createdCount + Q.linkedCount;
      N(`${Q.createdCount} derived segment${Q.createdCount === 1 ? "" : "s"} created and ${Q.linkedCount} existing segment${Q.linkedCount === 1 ? "" : "s"} linked.`), le === 0 && N("Every applicable derivation was already materialized.");
    } catch {
      h("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    K(!1);
  }
  async function rt(Q, le = null) {
    var xe, We, je, _e;
    const Ne = {
      tagId: Q,
      ...le ? { tagName: le } : {},
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
      const at = Yt();
      y({
        type: "add",
        entry: { id: at, op: "patch", targets: ke.map(qt), values: Ne }
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
            segments: ve.map((ct) => {
              const Ut = !c || ct.nativeSegmentId != null;
              return {
                nativeSegmentId: Ut ? ct.nativeSegmentId : null,
                itemId: Ut ? null : ct.itemId,
                expectedUpdatedAt: Ut ? ct.updatedAt : null,
                expectedRevision: Ut ? null : ct.revision
              };
            })
          })
        }), ze(we);
        const Oe = Rt(
          ve,
          c
        ), Me = await D();
        y({ type: "confirm", key: at, applied: Me != null });
        const Et = Ue.map((ct) => Ye(Me == null ? void 0 : Me.segments, ct)).filter(Boolean);
        await ee(
          "segments.tag",
          `Changed tag for ${ke.length} segment${ke.length === 1 ? "" : "s"}`,
          Oe,
          Rt(Et, c),
          Se
        );
        const Ze = Ue.map((ct) => Ye(Me == null ? void 0 : Me.segments, ct)).filter(Boolean);
        te(Ze.map((ct) => ct.id)), U(((xe = Ze.find((ct) => ct.id === (J == null ? void 0 : J.id))) == null ? void 0 : xe.id) ?? ((We = Ze[0]) == null ? void 0 : We.id) ?? null), d(), N(`${ke.length} selected segment${ke.length === 1 ? "" : "s"} retagged.`);
      } catch (Se) {
        y({ type: "discard", key: at });
        const Oe = Ue.map((Et) => Ye(u.segments, Et)).filter(Boolean), Me = Ye(u.segments, {
          id: J == null ? void 0 : J.id,
          itemId: J == null ? void 0 : J.itemId,
          nativeSegmentId: J == null ? void 0 : J.nativeSegmentId
        }) || Oe[0] || null;
        te(Oe.map((Et) => Et.id)), U((Me == null ? void 0 : Me.id) ?? null), re.current = (Me == null ? void 0 : Me.id) ?? null, se.current = [], Se.status === 409 && await E(), N(Se.message || "Unable to change the selected segment tags.");
      } finally {
        Be();
      }
      return;
    }
    if (ve.length !== 1 || !J) return;
    const Te = wi(_, J);
    if (J.id === m || Te) {
      const ke = Te ? { segmentId: J.id, tagId: Te.values.tagId, tagName: Te.meta.tagName } : null, Ue = vl(ke, J, Q, le);
      if (Ue && !dt(J, Ue)) {
        d();
        return;
      }
      if (Te && (f((De) => {
        var we;
        return ((we = De.meta) == null ? void 0 : we.pendingChangeId) === Te.id;
      }), y({ type: "discard", key: Te.id })), Ue) {
        const De = Ja(
          { ...J, tagId: Ue.tagId },
          q,
          b,
          B,
          ae
        );
        M(De.filters), C(De.hideDerivedSegments), N("Tag change queued…");
      } else Te && N("");
      d();
      return;
    }
    if (Q === J.tagId) {
      d();
      return;
    }
    if (J.itemId != null && ((_e = (je = z.data) == null ? void 0 : je.children) == null ? void 0 : _e.length) > 0) {
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
        const at = await D();
        y({ type: "confirm", key: Ue, applied: at != null }), d(), N(we ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch (De) {
        Ue && y({ type: "discard", key: Ue }), te([J.id]), U(J.id), re.current = J.id, se.current = [], De.status === 409 ? (N("Lineage changed — loading the latest segments…"), await E()) : N(De.message || "Unable to reconcile the lineage.");
      } finally {
        ke();
      }
      return;
    }
    d(), await k(J, {
      startSec: J.startSec,
      endSec: J.endSec,
      tagId: Q
    }, !0, null, !0, Ne);
  }
  function dt(Q, le) {
    const Ne = Yt(), Te = R(qt(Q));
    y({
      type: "add",
      entry: {
        id: Ne,
        op: "patch",
        targets: [Te],
        values: { tagId: le.tagId, tagName: le.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: le.tagName }
      }
    });
    const xe = _.find((je) => je.op === "insert" && je.segment.id === Q.id);
    return w({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [Te],
      dependsOn: (xe == null ? void 0 : xe.taskId) ?? null,
      meta: { pendingChangeId: Ne },
      ready: (je, _e) => {
        const ke = Si(je.segments, _e.targets[0]);
        return !ke || xl(je, ke.id);
      },
      run: (je) => et(je, Ne, le)
    }) ? !0 : (y({ type: "discard", key: Ne }), N("Wait for the history restore to finish."), !1);
  }
  async function et(Q, le, Ne) {
    const [Te] = Q.resolveTargets();
    if (!Te) {
      y({ type: "discard", key: le }), N(`The new segment was not retagged${Ne.tagName ? ` to ${Ne.tagName}` : ""}. Choose its tag again.`);
      return;
    }
    if (Te.tagId === Ne.tagId) {
      y({ type: "discard", key: le });
      return;
    }
    await $(Te, {
      startSec: Te.startSec,
      endSec: Te.endSec,
      tagId: Ne.tagId
    }, {
      pendingChangeId: le,
      restoreSelectionOnFailure: !1,
      onReload: Q.onReload,
      onConflict: Q.onConflict
    }) || N(`The new segment was not retagged${Ne.tagName ? ` to ${Ne.tagName}` : ""}. Choose its tag again.`);
  }
  async function pt() {
    var _e, ke, Ue, De;
    if (!l || !J || j != null) return;
    const Q = [...ve].sort((we, Be) => Number(we.nativeSegmentId ?? we.id) - Number(Be.nativeSegmentId ?? Be.id)), le = new Set(Q.map((we) => we.id)), Ne = Q.map((we) => `${we.nativeSegmentId ?? we.id}:${we.updatedAt}`).join("|"), Te = r("bin", J.id);
    if (!Te) return;
    N(`Moving ${Q.length} segment${Q.length === 1 ? "" : "s"} to recycling bin…`);
    const xe = `bulk-move:${ge.id}:${Ne}`, We = Ke(xe), je = c ? null : crypto.randomUUID();
    try {
      const we = (Oe = !1) => Z(`/videos/${ge.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: We,
          segments: Q.map((Me) => ({
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
          mo(xe)
        );
      } catch (Oe) {
        if (((_e = Oe.payload) == null ? void 0 : _e.code) !== "missing-image" || !window.confirm(`${Oe.message}

Continue and discard the missing image reference?`)) throw Oe;
        go(xe), Be = await we(!0);
      }
      ze(xe), Wn();
      const at = new Map((Be.items || []).map((Oe) => [
        Number(Oe.segmentId),
        Oe
      ]));
      await ee(
        "segments.moveToBin",
        `Moved ${Q.length} segment${Q.length === 1 ? "" : "s"} to recycling bin`,
        Rt(Q, !1),
        Rt(Q.map((Oe) => {
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
      const Se = tl(o, le, J.id);
      A((Oe) => ({
        ...Oe,
        segments: (Oe.segments || []).filter((Me) => !le.has(Me.id))
      }), ge.id), te(Se ? [Se.id] : []), U((Se == null ? void 0 : Se.id) ?? null), re.current = (Se == null ? void 0 : Se.id) ?? null, se.current = [], Se && (V(jt(o, Se.id)), X(Se.id)), requestAnimationFrame(() => {
        var Oe;
        return (Oe = p.current) == null ? void 0 : Oe.focus({ preventScroll: !0 });
      }), N(`Moved ${Q.length} segment${Q.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (we) {
      const Be = ((ke = we.payload) == null ? void 0 : ke.code) || ((De = (Ue = we.payload) == null ? void 0 : Ue.result) == null ? void 0 : De.code);
      we.status === 409 && Be === "CANONICAL_SEGMENT_CHANGED" ? await E() : N(we.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Te();
    }
  }
  async function xt() {
    if (!(c || s.current || j != null)) {
      s.current = !0, N("Checking the recycling bin…");
      try {
        const Q = await Z("/bin"), le = await ci(Q, () => N("Emptying the recycling bin…"));
        if (le.status === "empty") {
          N("The recycling bin is empty.");
          return;
        }
        if (le.status === "canceled") {
          N("The recycling bin was not emptied.");
          return;
        }
        N(`${le.segmentCount} segment${le.segmentCount === 1 ? "" : "s"} from ${le.sceneCount} scene${le.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (Q) {
        N(Q.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: Fe, removeIncorrectExample: Ie, captureTrainingExport: Ge, deleteRejectedSegments: Ee, autoAssignPerformers: Ve, previewDerivedSegments: Qe, closeMaterializeDialog: gt, materializeDerivedSegments: ot, saveTag: rt, moveToBin: pt, emptyRecyclingBin: xt };
}
function Mc(e) {
  const { acceptHistory: t, acquireSaveLock: r, enqueueSave: o, getSaveQueueSnapshot: i, commonActionsRef: a, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: m, history: u, historyRef: b, historySaving: p, horizontalLayoutSize: f, mediaStackHeight: y, mediaStackRef: w, onDetailChange: R, onReload: g, railToggleRef: B, recordHistoryAction: F, savingSegmentId: z, setCollapsedSegmentGroups: W, setEditorLayout: O, setHistorySaving: S, setIncorrectExamples: T, setSaveMessage: k, shotBoundaries: $, timelineDuration: _, video: E, workspaceRef: A } = e;
  async function D(C, v, h) {
    var K, H, ue, N;
    const x = C.type === "segment" ? [C] : C.segments || [], P = (v == null ? void 0 : v.type) === "segment" ? [v] : (v == null ? void 0 : v.segments) || [];
    let oe = h;
    for (const [V, U] of x.entries()) {
      const te = P[V], ge = ((K = U.identity) == null ? void 0 : K.nativeSegmentId) != null || ((H = U.identity) == null ? void 0 : H.published) === !0, Fe = ((ue = te == null ? void 0 : te.identity) == null ? void 0 : ue.recycleBinItemId) ?? ((N = te == null ? void 0 : te.identity) == null ? void 0 : N.itemId);
      let Ie = Ye(oe.segments, te == null ? void 0 : te.identity) || Ye(oe.segments, U.identity);
      if (!Ie && ge && Fe != null && te.identity.revision != null) {
        const Ee = `history-restore:${E.id}:${Fe}:${te.identity.revision}`;
        await Z(`/bin/${Fe}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ke(Ee),
            expectedRevision: te.identity.revision
          })
        }), ze(Ee), oe = await g(), Ie = oe.segments.find((Ve) => Ve.tagId === U.values.tagId && Ve.startSec === U.values.startSec && Ve.endSec === U.values.endSec);
      }
      if (!Ie)
        throw new Error("A segment in this history state no longer exists.");
      if ((Ie.nativeSegmentId != null || Ie.published === !0) !== ge) {
        if (ge) {
          const Ee = Ie.recycleBinItemId ?? Ie.itemId ?? Fe;
          if (Ee == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Ve = `history-restore:${E.id}:${Ee}:${Ie.revision}:${U.values.reviewState ?? "native"}`;
          await Z(`/bin/${Ee}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ke(Ve),
              expectedRevision: Ie.revision
            })
          }), ze(Ve);
        } else {
          const Ee = `history-bin:${E.id}:${Ie.nativeSegmentId}:${Ie.updatedAt}:${U.values.reviewState}`;
          await Z(`/videos/${E.id}/segments/${Ie.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ke(Ee),
              expectedUpdatedAt: Ie.updatedAt,
              reviewState: U.values.reviewState
            })
          }), ze(Ee);
        }
        if (oe = await g(), !ge)
          continue;
        if (Ie = Ye(oe.segments, U.identity) || oe.segments.find((Ee) => Ee.tagId === U.values.tagId && Ee.startSec === U.values.startSec && Ee.endSec === U.values.endSec), !Ie)
          throw new Error("The restored segment could not be found.");
      }
      const Ge = U.values;
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
      oe = await g();
    }
    return oe;
  }
  async function q(C, v) {
    var h;
    for (const x of C.targets || []) {
      const P = Ye(v.segments, x.identity);
      if (!P)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const oe = (h = v.performerSlotRevisions) == null ? void 0 : h[P.id];
      await Z(P.published ? `/videos/${E.id}/segments/${P.nativeSegmentId}/slots` : `/videos/${E.id}/drafts/${P.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: oe,
          assignments: x.assignments
        })
      }), v = await g();
    }
    return v;
  }
  async function ee(C, v, h) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let x = v, P = await Z(`/videos/${E.id}/incorrect-examples`);
    const oe = (K) => P.find((H) => {
      var ue;
      return H.id === K.exampleId || ((ue = K.collectedIdentity) == null ? void 0 : ue.itemId) != null && H.itemId === K.collectedIdentity.itemId;
    });
    for (const [K, H] of (C.entries || []).entries()) {
      const ue = `history-feedback:${E.id}:${h.action.sequence}:${h.direction}:${K}`, N = oe(H);
      if (C.collected && N) {
        ze(ue);
        continue;
      }
      let V;
      if (C.collected) {
        const U = Ye(
          x.segments,
          H.collectedIdentity
        ) || Ye(
          x.segments,
          H.originalIdentity
        );
        if (!U)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const te = U.nativeSegmentId != null;
        V = await Z(`/videos/${E.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ke(ue),
            nativeSegmentId: te ? U.nativeSegmentId : null,
            itemId: te ? null : U.itemId,
            expectedUpdatedAt: te ? U.updatedAt : null,
            expectedRevision: te ? null : U.revision
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
      ze(ue), x = vr(
        x,
        V.editorDelta
      ), P = await Z(
        `/videos/${E.id}/incorrect-examples`
      );
    }
    return T(P), x;
  }
  async function pe(C, v, h = []) {
    const x = C.state;
    if (!s && ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")) {
      const oe = `basic-history:${E.id}:${b.current.revision}:${C.action.sequence}:${C.direction}`, K = await Z(`/videos/${E.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ke(oe),
          expectedHistoryRevision: b.current.revision,
          actionSequence: C.action.sequence,
          direction: C.direction
        })
      });
      return t(K.history), h.push(oe), g();
    }
    const P = C.direction === "backward" ? C.action.afterState : C.action.beforeState;
    if ((x == null ? void 0 : x.type) === "composite") {
      let oe = v;
      const K = (P == null ? void 0 : P.type) === "composite" ? P.states || [] : [];
      for (const [H, ue] of (x.states || []).entries()) {
        const N = K[H];
        oe = await pe({
          ...C,
          state: ue,
          action: {
            ...C.action,
            beforeState: C.direction === "backward" ? ue : N,
            afterState: C.direction === "backward" ? N : ue
          }
        }, oe, h);
      }
      return oe;
    }
    if ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")
      return D(
        x,
        P,
        v
      );
    if ((x == null ? void 0 : x.type) === "performerSlots")
      return q(x, v);
    if ((x == null ? void 0 : x.type) === "incorrectExamples")
      return ee(x, v, C);
    if ((x == null ? void 0 : x.type) === "shots") {
      const oe = _n(v.shotBoundaries || []), K = await Z(`/videos/${E.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ke(`history-shots:${E.id}:${oe}:${x.fingerprint}`),
          expectedFingerprint: oe,
          boundaries: x.boundaries
        })
      });
      return { ...v, shotBoundaries: K };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function be(C) {
    if (p || C === u.cursorSequence) return;
    if (z != null) {
      k("Finish the pending saves before restoring history.");
      return;
    }
    if (da(u, C).length === 0) return;
    const h = o({
      kind: "history",
      lockId: -1,
      exclusive: !0,
      run: (x) => X(x.detail, C)
    });
    if (!h) {
      k("Finish the pending saves before restoring history.");
      return;
    }
    await h.done;
  }
  async function X(C, v) {
    var x;
    const h = da(b.current, v);
    if (h.length !== 0) {
      S(!0), k(`Restoring ${h.length} history ${h.length === 1 ? "action" : "actions"}…`);
      try {
        let P = C;
        const oe = [];
        for (const H of h)
          P = await pe(
            H,
            P,
            oe
          );
        const K = s ? await Z(`/videos/${E.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: b.current.revision,
            targetSequence: v
          })
        }) : b.current;
        oe.forEach(ze), t(K), await g(), k("History restored.");
      } catch (P) {
        P.status === 409 && ((x = P.payload) != null && x.current) && t(P.payload.current), await g(), k(P.message || "Unable to restore editor history.");
      } finally {
        S(!1);
      }
    }
  }
  function j(C) {
    O((v) => ({ ...v, timelineRatio: co(C, y) }));
  }
  function ae(C) {
    var x, P;
    const v = (x = w.current) == null ? void 0 : x.getBoundingClientRect();
    if (!v) return;
    const h = ((P = a.current) == null ? void 0 : P.offsetHeight) || 0;
    j(Gs(
      C.clientY,
      v.top + h,
      Math.max(0, v.height - h)
    ));
  }
  function ce(C) {
    C.currentTarget.setPointerCapture(C.pointerId), ae(C);
  }
  function J(C) {
    C.currentTarget.hasPointerCapture(C.pointerId) && ae(C);
  }
  function he(C) {
    const v = C.shiftKey ? 0.1 : 0.05;
    let h = null;
    C.key === "ArrowUp" && (h = c.timelineRatio + v), C.key === "ArrowDown" && (h = c.timelineRatio - v);
    const x = lo(y);
    C.key === "Home" && (h = x.minimum), C.key === "End" && (h = x.maximum), h != null && (C.preventDefault(), C.stopPropagation(), j(h));
  }
  function ve(C) {
    const v = C === "detailWidth" ? f.focusRow : f.workspace, h = f.workspace > 0 ? Zr(f.workspace, 600) : 560, x = dn(c.markerRailWidth, h), P = C === "detailWidth" ? 344 + (c.markerRailOpen ? x + 24 : 0) : 600;
    return v > 0 ? Zr(v, P) : 560;
  }
  function re(C, v) {
    O((h) => ({ ...h, [C]: dn(v, ve(C)) }));
  }
  function se(C, v) {
    var x, P;
    const h = v === "detailWidth" ? (x = m.current) == null ? void 0 : x.getBoundingClientRect() : (P = A.current) == null ? void 0 : P.getBoundingClientRect();
    h && re(v, v === "detailWidth" ? C.clientX - h.left : h.right - C.clientX);
  }
  function me(C, v) {
    const h = ve(C), x = dn(c[C], h);
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
      onPointerDown: (P) => {
        P.currentTarget.setPointerCapture(P.pointerId), se(P, C);
      },
      onPointerMove: (P) => {
        P.currentTarget.hasPointerCapture(P.pointerId) && se(P, C);
      },
      onKeyDown: (P) => {
        const oe = P.shiftKey ? 40 : 16;
        let K = null;
        P.key === "ArrowLeft" && (K = C === "detailWidth" ? -oe : oe), P.key === "ArrowRight" && (K = C === "detailWidth" ? oe : -oe);
        let H = K == null ? null : x + K;
        P.key === "Home" && (H = 240), P.key === "End" && (H = h), H != null && (P.preventDefault(), P.stopPropagation(), re(C, H));
      },
      onDoubleClick: () => re(C, $t[C]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function Y() {
    O((C) => ({ ...C, markerRailOpen: !C.markerRailOpen })), requestAnimationFrame(() => {
      var C;
      return (C = B.current) == null ? void 0 : C.focus({ preventScroll: !0 });
    });
  }
  function de(C) {
    W((v) => v.includes(C) ? v.filter((h) => h !== C) : tn([...v, C]));
  }
  function M(C, v = !0, h = l) {
    const x = i().running != null, P = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (oe) => ne(oe.detail, C, v, h)
    });
    return P ? (x && k(C === "split" ? "Shot boundary queued…" : "Shot merge queued…"), P.done.then((oe) => oe.value ?? null)) : (k("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function ne(C, v, h, x) {
    var ue;
    const P = (C == null ? void 0 : C.shotBoundaries) || [], oe = Number((ue = E.videoFile) == null ? void 0 : ue.duration) || _, K = _n(P), H = `shot-${v}:${E.id}:${x.toFixed(3)}:${oe.toFixed(3)}:${K}`;
    k(v === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const N = await Z(`/videos/${E.id}/shot-boundaries/${v}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Ke(H), timeSec: x })
      });
      return ze(H), R((V) => ({ ...V, shotBoundaries: N }), E.id), h && await F(
        "shots.update",
        v === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: P,
          fingerprint: K
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
  return { applySegmentHistoryState: D, applyPerformerSlotHistoryState: q, applyHistoryState: pe, restoreHistoryTarget: be, updateTimelineRatio: j, updateTimelineRatioFromPointer: ae, handleSeparatorPointerDown: ce, handleSeparatorPointerMove: J, handleSeparatorKeyDown: he, panelWidthMaximum: ve, updatePanelWidth: re, handlePanelSeparatorPointer: se, panelSeparatorProps: me, toggleSegmentRail: Y, toggleSegmentGroup: de, mutateShotBoundary: M };
}
function Ec(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: m, emptyRecyclingBin: u, lineage: b, mediaDuration: p, mergeSelectedSwimlane: f, moveToBin: y, mutateShotBoundary: w, openPublishApprovedDialog: R, playbackControlsRef: g, playbackShortcutConfig: B, saveSelectedReviewState: F, seekRef: z, segmentGroupKeys: W, selectSegment: O, selectedSegment: S, selectedSegmentGroupForSegment: T, selectedSegmentGroupKey: k, selectedSegments: $, setCollapsedSegmentGroups: _, setIncorrectExamplesOpen: E, setQuickSearchOpen: A, setSaveMessage: D, setSelectedSegmentGroupKey: q, setTagEditing: ee, setTimelineZoom: pe, shotBoundaries: be, slotButtonRef: X, splitSegment: j, swimlanes: ae, timelineDuration: ce, toggleIncorrectExample: J, toggleSegmentGroup: he, updateTimelineRatio: ve, videoFrameRate: re, visibleSegments: se } = e;
  function me(M) {
    var ne, C;
    (ne = g.current) == null || ne.pause(), (C = g.current) == null || C.seekBy(wl(M, re));
  }
  function Y(M, ne) {
    if ($.length > 1 && sl(M.id))
      return;
    let C = null;
    M.id === "video.playPause" && (C = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.toggle();
    }), M.id === "video.seekSmallBackward" && (C = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(-B.smallSeekTime);
    }), M.id === "video.seekSmallForward" && (C = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(B.smallSeekTime);
    }), M.id === "video.seekMediumBackward" && (C = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(-B.mediumSeekTime);
    }), M.id === "video.seekMediumForward" && (C = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(B.mediumSeekTime);
    }), M.id === "video.seekLongBackward" && (C = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(-B.longSeekTime);
    }), M.id === "video.seekLongForward" && (C = () => {
      var v;
      return (v = g.current) == null ? void 0 : v.seekBy(B.longSeekTime);
    }), M.id === "video.playSelected" && S && (C = () => {
      var v;
      (v = z.current) == null || v.call(z, S.startSec, !0), requestAnimationFrame(() => {
        var h;
        return (h = m.current) == null ? void 0 : h.focus({ preventScroll: !0 });
      });
    }), (M.id === "video.playPreviousSegment" || M.id === "video.playNextSegment") && (C = () => {
      var h;
      const v = ro(
        ae,
        S == null ? void 0 : S.id,
        M.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !v || v.id === (S == null ? void 0 : S.id) || (O(v, { focusEditor: !0, seekToSegment: !1 }), (h = z.current) == null || h.call(z, v.startSec, !0));
    }), M.id.startsWith("video.seekPercent") && (C = () => {
      var h;
      const v = Number(M.id.slice(17)) / 10;
      (h = z.current) == null || h.call(z, rl(p ?? ce, v), !1);
    }), M.id === "video.jumpToSegmentStart" && S && (C = () => {
      var v;
      return (v = z.current) == null ? void 0 : v.call(z, S.startSec, !1);
    }), M.id === "video.jumpToSegmentEnd" && S && (C = () => {
      var v;
      return (v = z.current) == null ? void 0 : v.call(z, S.endSec ?? S.startSec, !1);
    }), M.id === "video.jumpToVideoStart" && (C = () => {
      var v;
      return (v = z.current) == null ? void 0 : v.call(z, 0, !1);
    }), M.id === "video.jumpToVideoEnd" && (C = () => {
      var v;
      return (v = z.current) == null ? void 0 : v.call(z, ce, !1);
    }), M.id.startsWith("video.frame") && (C = () => {
      const v = M.id.includes("Small") ? "small" : M.id.includes("Medium") ? "medium" : "long", h = B[`${v}FrameStep`] * (M.id.endsWith("Backward") ? -1 : 1);
      me(h);
    }), M.id.startsWith("navigation.swimlane") && (C = () => {
      const v = M.id.slice(19).toLowerCase(), h = ro(ae, S == null ? void 0 : S.id, v, s);
      h && O(h, { focusEditor: !0, seekToSegment: !1 });
    }), (M.id === "navigation.extendSwimlaneLeft" || M.id === "navigation.extendSwimlaneRight") && (C = () => {
      const v = xd(
        t,
        S == null ? void 0 : S.id,
        M.id.endsWith("Left") ? "left" : "right"
      );
      v && O(v.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: v.segmentIds
      });
    }), (M.id === "navigation.segmentGroupUp" || M.id === "navigation.segmentGroupDown") && (C = () => {
      const v = Sd(
        W,
        k ?? T,
        M.id.endsWith("Up") ? -1 : 1
      );
      v && q(v);
    }), (M.id === "navigation.previousAtPlayhead" || M.id === "navigation.nextAtPlayhead") && (C = () => {
      const v = Us(se, s, M.id === "navigation.previousAtPlayhead" ? -1 : 1, S == null ? void 0 : S.id);
      v && O(v, { focusEditor: !0, seekToSegment: !1 });
    }), M.id === "navigation.nearestInCurrentSwimlane" && (C = () => {
      const v = Rs(
        ae,
        S == null ? void 0 : S.id,
        s
      );
      v && O(v, { focusEditor: !0, seekToSegment: !1 });
    }), M.id.includes("Unreviewed") && (C = () => {
      const v = Sr(
        ae,
        S == null ? void 0 : S.id,
        M.id.startsWith("navigation.previous") ? -1 : 1,
        M.id.endsWith("Global")
      );
      v && O(v, { focusEditor: !ne.preserveFocus, seekToSegment: !1 });
    }), (M.id === "navigation.nextTouchingPlayhead" || M.id === "navigation.previousTouchingPlayhead") && (C = () => {
      const v = As(ae, s, M.id === "navigation.previousTouchingPlayhead" ? -1 : 1, S == null ? void 0 : S.id);
      v && O(v, { focusEditor: !0, seekToSegment: !1 });
    }), M.id === "navigation.quickSearch" && (C = () => A(!0)), (M.id === "navigation.previousShot" || M.id === "navigation.nextShot") && (C = () => {
      var h;
      const v = kl(be, s, M.id === "navigation.previousShot" ? -1 : 1);
      v && ((h = z.current) == null || h.call(z, v.startSec, !1));
    }), M.id === "shot.split" && (C = () => w("split")), M.id === "shot.merge" && (C = () => w("merge")), M.id === "marker.create" && (C = () => a()), M.id === "marker.duplicate" && (C = () => d(!1)), M.id === "marker.duplicateAtPlayhead" && (C = () => d(!0)), M.id === "marker.split" && (C = () => j()), M.id === "marker.editTag" && (C = () => {
      var v;
      if ($.length > 1 && $.some((h) => h.isDerived)) {
        D("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((v = b.data) != null && v.tagReadOnly) {
        D("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      ee(!0);
    }), M.id === "marker.setStart" && S && (C = () => r(s, S.endSec)), M.id === "marker.setEnd" && S && (C = () => r(S.startSec, s)), M.id === "marker.copyTiming" && S && (C = () => {
      D(Yd(S) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), M.id === "marker.pasteTiming" && S && (C = () => {
      const v = Jd();
      if (!v) {
        D("No copied segment timing is available.");
        return;
      }
      r(v.startSec, v.endSec);
    }), M.id === "marker.mergeSelection" && (C = () => f()), M.id === "marker.moveToBin" && (C = () => y()), M.id === "marker.toggleIncorrectExample" && S && (C = () => J()), M.id === "marker.openIncorrectExamples" && (C = () => E(!0)), M.id === "markerGroup.toggleCollapse" && k && (C = () => he(k)), M.id === "markerGroup.toggleAll" && (C = () => _((v) => vd(v, W))), M.id === "marker.assignSlots" && (C = () => {
      var v;
      return (v = X.current) == null ? void 0 : v.click();
    }), M.id === "navigation.zoomIn" && (C = () => pe((v) => kr(v + 0.5))), M.id === "navigation.zoomOut" && (C = () => pe((v) => kr(v - 0.5))), M.id === "navigation.resetZoom" && (C = () => pe(1)), M.id === "navigation.centerPlayhead" && (C = () => {
      var v;
      return (v = o.current) == null ? void 0 : v.call(o);
    }), M.id === "layout.growSwimlanes" && (C = () => ve(c.timelineRatio + 0.05)), M.id === "layout.shrinkSwimlanes" && (C = () => ve(c.timelineRatio - 0.05)), M.id === "marker.confirm" && S && (C = () => F("approved")), M.id === "system.publishApproved" && (C = () => R(ne.target)), M.id === "marker.reject" && S && (C = () => F("rejected")), M.id === "system.emptyBin" && (C = () => u()), M.id === "system.deleteRejected" && (C = () => l()), C && C();
  }
  function de(M, ne) {
    const C = Zn.find((v) => v.id === M);
    C && Mn(C, i) && Y(C, ne);
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
function Dc(e, t, r = !1, o = 0, i = "", a = () => () => {
}) {
  const [s, l] = G(null), [d, c] = G(null), [m, u] = G(""), [b, p] = G({
    busy: !1,
    reviewState: null,
    error: ""
  }), f = fe(null);
  async function y(g) {
    const B = a("import", -1);
    if (!B) {
      p({ busy: !1, reviewState: null, error: "Wait for the current save to finish before importing Cove segments." });
      return;
    }
    p({ busy: !0, reviewState: g, error: "" });
    try {
      await Z(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: no(), reviewState: g })
      }), await t(), p({ busy: !1, reviewState: null, error: "" });
    } catch (F) {
      p({
        busy: !1,
        reviewState: null,
        error: F.message || "Unable to import Cove segments."
      });
    } finally {
      B();
    }
  }
  async function w(g) {
    try {
      const B = await Z(`/videos/${e}/analysis-runs`, {
        signal: g.signal
      });
      if (!g.isActive()) return null;
      const F = (B == null ? void 0 : B[0]) || null;
      return l(F), (F == null ? void 0 : F.status) === "completed" && f.current !== F.id && (f.current = F.id, await t()), ((F == null ? void 0 : F.status) === "failed" || (F == null ? void 0 : F.status) === "cancelled") && u(F.errorMessage || "Video analysis did not complete."), F;
    } catch (B) {
      return g.isActive() && B.name !== "AbortError" && u(B.message || "Unable to load video analysis status."), null;
    }
  }
  async function R(g = null) {
    u("");
    const B = g || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), F = B.includes("omnishotcut") && o > 0;
    if (!(F && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const z = await Z(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: B,
            replaceShotBoundaries: F,
            expectedShotBoundaryFingerprint: F ? i : null
          })
        });
        l(z);
      } catch (z) {
        u(z.message || "Unable to start video analysis.");
      }
  }
  return ye(() => {
    if (!ka(r)) {
      l(null), c(null), u("");
      return;
    }
    const g = wa();
    return w(g), Z("/analysis/status", { signal: g.signal }).then((B) => {
      g.isActive() && (c(B), B.configured || u(""));
    }).catch((B) => {
      g.isActive() && B.name !== "AbortError" && u(B.message || "Unable to check video analysis readiness.");
    }), g.dispose;
  }, [e, r]), ye(() => {
    if (!ka(r) || (s == null ? void 0 : s.status) !== "queued" && (s == null ? void 0 : s.status) !== "running") return;
    const g = wa();
    let B = setTimeout(async function F() {
      await w(g), g.isActive() && (B = setTimeout(F, 2500));
    }, 2500);
    return () => {
      clearTimeout(B), g.dispose();
    };
  }, [s == null ? void 0 : s.id, s == null ? void 0 : s.status, r]), {
    analysisError: m,
    analysisRun: s,
    analysisStatus: d,
    importNativeSegments: y,
    nativeImportState: b,
    startFullAnalysis: R
  };
}
const qn = Object.freeze([]);
function Pc(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Oc({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var Lo, Fo, jo, Bo, Go;
  const [m, u] = G(null), [b, p] = G([]), f = fe(null), y = fe(null), w = fe([]), R = fe(null), [g, B] = G(() => Mt({})), [F, z] = G(!1), [W, O] = G(ol), [S, T] = G(0), k = fe(null), [$] = G(() => Dd({
    getContext: () => k.current,
    drainAfterSettle: !1
  })), _ = Ul($.subscribe, $.getSnapshot), E = ki(_), A = (L, ie) => $.acquire({ kind: L, lockId: ie }), D = (L) => $.enqueue(L), q = (L) => $.stableIdentity(L), ee = fe(!1);
  ye(() => (ee.current = !0, () => {
    ee.current = !1, queueMicrotask(() => {
      ee.current || $.dispose();
    });
  }), []);
  const pe = (L) => $.cancel(L), be = (L, ie) => $.retarget(L, ie), X = $.getSnapshot, [j, ae] = Gl(Ud, []), [ce, J] = G(""), [he, ve] = G(""), [re, se] = G(""), [me, Y] = G(1), [de, M] = G(qd), [ne, C] = G(0), [v, h] = G({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [x, P] = G(Vt), oe = fe(Vt), [K, H] = G(!1), [ue, N] = G(!1), [V, U] = G(!1), te = fe(!1);
  te.current = V;
  const [ge, Fe] = G(null), [Ie, Pe] = G(!1), [Ge, Ee] = G(null), [Ve, ft] = G(null), Qe = fe(null), [gt, ot] = G(!1), [nt, rt] = G(""), dt = fe(null), et = fe(null), pt = fe(!1), [xt, Q] = G(_d), [le, Ne] = G(null), [Te, xe] = G(!1), [We, je] = G(!1), [_e, ke] = G(!1), [Ue, De] = G(!1), [we, Be] = G(!1), [at, Se] = G(""), {
    analysisError: Oe,
    analysisRun: Me,
    analysisStatus: Et,
    importNativeSegments: Ze,
    nativeImportState: ct,
    startFullAnalysis: Ut
  } = Dc(
    e.video.id,
    o,
    l,
    ((Lo = e.shotBoundaries) == null ? void 0 : Lo.length) || 0,
    _n(e.shotBoundaries || []),
    (L, ie) => $.acquire({ kind: L, lockId: ie })
  ), [Je, Ce] = G(!1), [$e, qe] = G(null), [ut, it] = G(l), [Dt, Ct] = G(0), [Pt, gn] = G(!1), [Ot, nn] = G(""), [er, rn] = G(null), Pn = fe(null), tr = fe(null), pn = fe(!1), [Qt, fn] = G([]), [nr, Rr] = G(!1), [rr, Mr] = G(null), on = zd(), yn = fe(null), On = fe(null), bn = fe(null), Er = fe(s), or = fe(null), hn = fe(null), an = fe(null), vn = fe(null), Ln = fe(null), St = fe(null), ar = fe(null), Fn = fe(null), Kt = fe(null), ir = fe(null), xn = fe(null), Sn = fe(null), Dr = fe(-1e12), Pr = fe(null), jn = fe(null), [kn, Bn] = G({ scrollTop: 0, height: 512 });
  ye(() => {
    if (!Je || Pt || !Ot) return;
    const L = requestAnimationFrame(() => {
      var ie;
      return (ie = tr.current) == null ? void 0 : ie.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(L);
  }, [Je, Pt, Ot]), ye(() => {
    if (!pn.current || Je || ut) return;
    const L = requestAnimationFrame(() => {
      var ie;
      (ie = Pn.current) == null || ie.focus({ preventScroll: !0 }), pn.current = !1;
    });
    return () => cancelAnimationFrame(L);
  }, [Je, ut]);
  const tt = e.video, yt = e.segments || qn, Or = He(() => JSON.stringify({
    segments: yt.map((L) => [
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
    performerSlots: (e.performerSlots || qn).map((L) => [
      L.segmentId,
      L.slotDefinitionId,
      L.performerId,
      L.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [yt, e.performerSlots, e.itemMetadata]);
  ye(() => {
    if (!l) {
      qe(null), it(!1);
      return;
    }
    if (E != null) {
      it(!0);
      return;
    }
    let L = !0;
    it(!0);
    const ie = setTimeout(() => {
      Z(`/videos/${tt.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Le) => {
        L && (qe(Le), nn(""));
      }).catch((Le) => {
        L && (qe(null), nn(Le.message || "Unable to preview derived segments."));
      }).finally(() => {
        L && it(!1);
      });
    }, 150);
    return () => {
      L = !1, clearTimeout(ie);
    };
  }, [l, tt.id, Or, Dt, E]);
  const mt = () => Ct((L) => L + 1), Lt = e.segmentGroups || qn, At = e.performerSlots || qn, Lr = l && e.performerSlotsAvailable !== !1, wn = He(
    () => (e.performerCandidates || []).filter((L) => L.isVideoPerformer),
    [e.performerCandidates]
  ), Wt = e.shotBoundaries || qn, Gn = He(
    () => fi(At),
    [At]
  ), Un = He(
    () => yt.map((L) => {
      const ie = Gn.get(L.id) || [];
      return {
        ...L,
        slots: ie,
        assignment: ie.every((Le) => Le.performerId == null) ? Ol(ie, wn) : null
      };
    }).filter((L) => L.slots.length > 0 && L.assignment != null),
    [yt, Gn, wn]
  ), sr = Number((Fo = tt.videoFile) == null ? void 0 : Fo.frameRate) > 0 ? Number(tt.videoFile.frameRate) : 30;
  function Nn() {
    const L = te.current;
    U(!1), L && requestAnimationFrame(() => {
      var ie;
      return (ie = St.current) == null ? void 0 : ie.focus({ preventScroll: !0 });
    });
  }
  function lr() {
    E == null && (Sn.current = null, Pe(!1), J(""), requestAnimationFrame(() => {
      var L;
      return (L = St.current) == null ? void 0 : L.focus({ preventScroll: !0 });
    }));
  }
  function Fr() {
    z(!1), requestAnimationFrame(() => {
      var L, ie;
      (L = Fn.current) != null && L.isConnected ? Fn.current.focus({ preventScroll: !0 }) : (ie = St.current) == null || ie.focus({ preventScroll: !0 });
    });
  }
  ye(() => {
    xn.current === m ? (xn.current = null, U(!0)) : U(!1);
  }, [m]), ye(() => {
    var ie;
    if (!V) return;
    const L = (ie = ir.current) == null ? void 0 : ie.querySelector("input");
    document.activeElement !== L && (L == null || L.focus({ preventScroll: !0 }), L == null || L.select());
  }, [V, m]), ye(() => {
    var ie;
    if (V) return;
    const L = (ie = St.current) == null ? void 0 : ie.ownerDocument;
    L && L.activeElement === L.body && St.current.focus({ preventScroll: !0 });
  }, [V]), ye(() => {
    var Le, st, Ft;
    const L = cn(
      _r(
        e.segments,
        e.performerSlots || [],
        Mt({}),
        l && W,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), ie = ((Le = e.segments.find(($n) => $n.id === s)) == null ? void 0 : Le.id) ?? ((st = qa(L)) == null ? void 0 : st.id) ?? null;
    u(ie), p(ie == null ? [] : [ie]), y.current = ie, w.current = [], Ne(jt(L, ie)), B(Mt({})), z(!1), Sn.current = null, Pe(!1), Y(1), J(""), P(Vt), oe.current = Vt, H(!1), (Ft = St.current) == null || Ft.focus({ preventScroll: !0 });
  }, [tt.id, s]), ye(() => {
    const L = new AbortController();
    return Z(`/videos/${tt.id}/incorrect-examples`, { signal: L.signal }).then(fn).catch((ie) => {
      ie.name !== "AbortError" && fn([]);
    }), () => L.abort();
  }, [tt.id, d == null ? void 0 : d.effectiveMode]), ye(() => {
    const L = new AbortController();
    return Z(`/videos/${tt.id}/history`, { signal: L.signal }).then((ie) => {
      const Le = ie || Vt;
      oe.current = Le, P(Le);
    }).catch((ie) => {
      ie.name !== "AbortError" && J(ie.message || "Unable to load editor history.");
    }), () => L.abort();
  }, [tt.id]), ye(() => {
    Vd(de);
  }, [de.timelineRatio, de.markerRailOpen, de.detailWidth, de.markerRailWidth, de.swimlaneTitleWidth]), ye(() => {
    Wd(xt);
  }, [xt]), ye(() => {
    al(W);
  }, [W]), ye(() => {
    const L = hn.current;
    if (!a || !L || typeof ResizeObserver > "u") return;
    const ie = () => {
      var Ft;
      const st = Math.max(0, L.clientHeight - (((Ft = an.current) == null ? void 0 : Ft.offsetHeight) || 0));
      C(st), M(($n) => {
        const Uo = co($n.timelineRatio, st);
        return Uo === $n.timelineRatio ? $n : { ...$n, timelineRatio: Uo };
      });
    }, Le = new ResizeObserver(ie);
    return Le.observe(L), an.current && Le.observe(an.current), ie(), () => Le.disconnect();
  }, [a]), ye(() => {
    if (!on || typeof ResizeObserver > "u") return;
    const L = Ln.current, ie = vn.current;
    if (!L || !ie) return;
    const Le = () => h({
      workspace: L.clientWidth,
      focusRow: ie.clientWidth,
      focusRowHeight: ie.clientHeight
    }), st = new ResizeObserver(Le);
    return st.observe(L), st.observe(ie), Le(), () => st.disconnect();
  }, [on, de.markerRailOpen]);
  const zt = He(
    () => Bd(yt, j),
    [yt, j]
  );
  sa(() => {
    $i(j, e) !== j && ae({ type: "prune", detail: e });
  }, [e, j]);
  const bt = He(
    () => ga(
      _r(
        zt,
        At,
        g,
        l && W,
        Lt
      ),
      Qt,
      !0
    ),
    [
      zt,
      At,
      g,
      W,
      Lt,
      l,
      Qt
    ]
  ), sn = Object.fromEntries(Nt.map((L) => [L, bt.filter((ie) => ie.reviewState === L).length])), Kn = ga(
    _r(
      zt,
      At,
      { ...g, reviewStates: Nt },
      l && W,
      Lt
    ),
    Qt,
    !0
  ), jr = Object.fromEntries(Nt.map((L) => [L, Kn.filter((ie) => ie.reviewState === L).length])), Br = [...new Set(zt.map((L) => L.sourceKey).filter(Boolean))].sort((L, ie) => Gt(L).localeCompare(Gt(ie))), Gr = _s(
    g,
    l && W
  ), kt = He(
    () => cn(bt, Lt, At),
    [bt, Lt, At]
  ), Xe = Js(
    kt,
    m,
    s
  ), ln = He(() => {
    const L = Fd(j);
    return L.length === 0 ? yt : [...yt, ...L];
  }, [yt, j]), I = Xe == null ? null : ln.find((L) => L.id === Xe.id) || Xe, Re = Jo(ln, Jo(bt, b).map((L) => L.id)), vt = !l && Re.length > 0 && Re.every((L) => L.nativeSegmentId != null), ht = bt.map((L) => L.id), Zt = ht.join("|");
  f.current = (I == null ? void 0 : I.id) ?? null;
  const Ht = Gn.get(I == null ? void 0 : I.id) || [], Ur = yo(Ht), So = He(
    () => yd(kt, b),
    [kt, b]
  ), dr = He(() => bo(kt), [kt]), zn = He(
    () => pd(dr, xt),
    [dr, xt]
  ), Pi = He(
    () => bi(
      zn.rows,
      kn.scrollTop,
      kn.height
    ),
    [zn, kn]
  ), Kr = He(
    () => hd(kt, xt),
    [kt, xt]
  ), Oi = Sr(Kr, I == null ? void 0 : I.id, -1, !0) != null, Li = Sr(Kr, I == null ? void 0 : I.id, 1, !0) != null, In = I ? jt(kt, I.id) : null, zr = yi(dr) ? dr.map((L) => L.key) : [], Fi = zr.join("|"), cr = Math.max(
    0,
    Number((jo = tt.videoFile) == null ? void 0 : jo.duration) || 0,
    ...zt.map((L) => Number(L.endSec ?? L.startSec) || 0)
  ), ko = Number((Bo = tt.videoFile) == null ? void 0 : Bo.duration) > 0 ? Number(tt.videoFile.duration) : null;
  x.actions;
  const ji = ei();
  ye(() => {
    const L = m === wr ? m : (I == null ? void 0 : I.id) ?? null;
    L !== m && u(L);
  }, [I, m]), ye(() => {
    p((L) => {
      const ie = Xs(
        L,
        ht,
        (I == null ? void 0 : I.id) ?? null
      );
      return ie.length === L.length && ie.every((Le, st) => Le === L[st]) ? L : ie;
    });
  }, [Zt, I == null ? void 0 : I.id]);
  const Cn = (I == null ? void 0 : I.itemId) == null ? null : ((Go = e.itemMetadata) == null ? void 0 : Go[I.itemId]) || null, Bi = {
    key: (I == null ? void 0 : I.itemId) != null ? `item:${I.itemId}` : (I == null ? void 0 : I.nativeSegmentId) != null ? `native:${I.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (Cn == null ? void 0 : Cn.provenance) || (I == null ? void 0 : I.fieldProvenance) || [] : []
  }, Hr = (I == null ? void 0 : I.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (Cn == null ? void 0 : Cn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  ye(() => {
    ve(Xe == null ? "" : String(Xe.startSec)), se((Xe == null ? void 0 : Xe.endSec) == null ? "" : String(Xe.endSec));
  }, [Xe == null ? void 0 : Xe.id, Xe == null ? void 0 : Xe.startSec, Xe == null ? void 0 : Xe.endSec]), ye(() => {
    In && Q((L) => xi(L, In));
  }, [tt.id, s, In]), ye(() => {
    Ne((L) => kd(zr, L, In));
  }, [tt.id, Fi, In]), ye(() => {
    if (!de.markerRailOpen || (I == null ? void 0 : I.id) == null) return;
    const L = jn.current, ie = zn.rows.find((Ft) => Ft.kind === "segment" && Ft.segment.id === I.id);
    if (!L || !ie) return;
    const Le = ie.top + ie.height;
    let st = L.scrollTop;
    ie.top < L.scrollTop ? st = ie.top : Le > L.scrollTop + L.clientHeight && (st = Math.max(0, Le - L.clientHeight)), st !== L.scrollTop && (L.scrollTop = st), Bn({ scrollTop: st, height: L.clientHeight });
  }, [I == null ? void 0 : I.id, zn, de.markerRailOpen]), ye(() => {
    const L = jn.current;
    if (!de.markerRailOpen || !L) return;
    const ie = () => Bn({
      scrollTop: L.scrollTop,
      height: L.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      ie();
      return;
    }
    const Le = new ResizeObserver(ie);
    return Le.observe(L), ie(), () => Le.disconnect();
  }, [de.markerRailOpen]);
  const { revealSegmentGroupForSelection: wo, replaceSegmentSelection: Gi, selectSegment: No, selectSegmentCollection: Ui, selectAllVideoSegments: Ki } = Tc({
    allSwimlanes: kt,
    editorRef: St,
    performerSlots: At,
    seekRef: yn,
    segmentGroups: Lt,
    segments: yt,
    selectedSegmentId: m,
    selectedSegmentIds: b,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: w,
    setCollapsedSegmentGroups: Q,
    setEditorFilters: B,
    setHideDerivedSegments: O,
    setSaveMessage: J,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: p
  }), { acceptHistory: qr, recordHistoryAction: ur, mutateSegment: zi, runSegmentMutation: Hi, completeReview: qi, createSegment: Io, splitSegment: Co, duplicateSegment: $o, saveTiming: _i, applyShortcutTiming: Wi } = Kd({
    compatibilityMode: l,
    currentTime: S,
    detail: e,
    editorFilters: g,
    endInput: re,
    hideDerivedSegments: W,
    historyRef: oe,
    mediaDuration: ko,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: Dr,
    pendingDuplicateRef: Pr,
    pendingFirstSegmentStartSecRef: Sn,
    pendingTagEditSegmentIdRef: xn,
    enqueueSave: D,
    pendingChanges: j,
    retargetSaveTasks: be,
    replaceSegmentSelection: Gi,
    savingSegmentId: E,
    segments: yt,
    selectedSegment: I,
    selectedSegmentIdRef: f,
    selectedSegments: Re,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: w,
    setCreatingSegmentId: Fe,
    setEditorFilters: B,
    setFirstSegmentTagOpen: Pe,
    setHideDerivedSegments: O,
    setHistory: P,
    setHistoryOpen: H,
    setPublishApprovedError: rt,
    setSaveMessage: J,
    acquireSaveLock: A,
    dispatchPendingChanges: ae,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: p,
    setTagEditing: U,
    startInput: he,
    tagEditingRef: te,
    timelineDuration: cr,
    video: tt
  });
  function To(L = null) {
    var st;
    if (!l || E != null || !yt.some((Ft) => !Ft.published && Ft.reviewState === "approved")) return;
    const ie = ((st = St.current) == null ? void 0 : st.ownerDocument) ?? document, Le = ie.activeElement === ie.body ? null : ie.activeElement;
    et.current = L != null && L.isConnected && L !== ie.body ? L : Le, rt(""), ot(!0);
  }
  function Ao() {
    E == null && (ot(!1), rt(""), requestAnimationFrame(() => {
      Pc(
        et.current,
        St.current
      ), et.current = null;
    }));
  }
  async function Vi() {
    await qi() && Ao();
  }
  const { closeMergeConfirmation: Ji, mergeSelectedSwimlane: Ro, saveSelectedReviewState: Yi } = Ac({
    acceptHistory: qr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: R,
    getSaveQueueSnapshot: X,
    historyRef: oe,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: ur,
    revealSegmentGroupForSelection: wo,
    savingSegmentId: E,
    selectedGroups: So,
    selectedSegment: I,
    selectedSegmentIdRef: f,
    selectedSegments: Re,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: w,
    setMergeConfirmation: Ee,
    setSaveMessage: J,
    acquireSaveLock: A,
    dispatchPendingChanges: ae,
    enqueueSave: D,
    stableSaveIdentity: q,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: p,
    video: tt
  }), Qi = (L) => {
    const ie = (L || []).map(qt);
    $.cancel((Le) => Le.kind === "review" && ho(Le.targets, ie));
  }, Zi = $.settledCount();
  sa(() => {
    $.markCommitted(Zi), k.current = {
      detail: e,
      segments: yt,
      onConflict: r,
      onDetailChange: t,
      onReload: o,
      tagEditing: V,
      selectedSegmentIds: b,
      activeSegmentId: (I == null ? void 0 : I.id) ?? null
    };
  }), ye(() => {
    $.poke();
  });
  const { toggleIncorrectExample: Xi, removeIncorrectExample: es, captureTrainingExport: ts, deleteRejectedSegments: Mo, autoAssignPerformers: ns, previewDerivedSegments: rs, closeMaterializeDialog: os, materializeDerivedSegments: as, saveTag: is, moveToBin: ss, emptyRecyclingBin: ls } = Rc({
    acceptHistory: qr,
    allSwimlanes: kt,
    autoAssignCandidates: Un,
    autoAssigning: we,
    binEmptyingRef: pt,
    canMoveSelectionToBin: vt,
    closeTagEditing: Nn,
    compatibilityMode: l,
    creatingSegmentId: ge,
    detail: e,
    editorFilters: g,
    editorRef: St,
    exportingExamples: nr,
    hideDerivedSegments: W,
    incorrectExamples: Qt,
    lineage: Hr,
    materializeButtonRef: Pn,
    materializePreview: $e,
    materializeRestoreFocusRef: pn,
    materializing: Pt,
    mutateSegment: zi,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: At,
    cancelSaveTasks: pe,
    dispatchPendingChanges: ae,
    enqueueSave: D,
    stableSaveIdentity: q,
    pendingChanges: j,
    runSegmentMutation: Hi,
    recordHistoryAction: ur,
    refreshMaterializationPreview: mt,
    removingExampleId: rr,
    revealSegmentGroupForSelection: wo,
    savingSegmentId: E,
    segmentGroups: Lt,
    segments: yt,
    selectedSegment: I,
    selectedSegmentIdRef: f,
    selectedSegments: Re,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: w,
    setAutoAssignError: Se,
    setAutoAssignOpen: De,
    setAutoAssigning: Be,
    setEditorFilters: B,
    setExportingExamples: Rr,
    setHideDerivedSegments: O,
    setIncorrectExamples: fn,
    setMaterializeError: nn,
    setMaterializeLoading: it,
    setMaterializeOpen: Ce,
    setMaterializePreview: qe,
    setMaterializing: gn,
    setRemovingExampleId: Mr,
    setRejectedDeletionPreview: ft,
    setSaveMessage: J,
    acquireSaveLock: A,
    setSelectedSegmentGroupKey: Ne,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: p,
    video: tt
  }), { restoreHistoryTarget: ds, updateTimelineRatio: Eo, handleSeparatorPointerDown: cs, handleSeparatorPointerMove: us, handleSeparatorKeyDown: ms, panelWidthMaximum: Do, panelSeparatorProps: gs, toggleSegmentRail: ps, toggleSegmentGroup: Po, mutateShotBoundary: fs } = Mc({
    acceptHistory: qr,
    compatibilityMode: l,
    currentTime: S,
    detail: e,
    editorLayout: de,
    focusRowRef: vn,
    history: x,
    historyRef: oe,
    historySaving: ue,
    horizontalLayoutSize: v,
    mediaStackHeight: ne,
    mediaStackRef: hn,
    commonActionsRef: an,
    onDetailChange: t,
    onReload: o,
    railToggleRef: ar,
    recordHistoryAction: ur,
    savingSegmentId: E,
    setCollapsedSegmentGroups: Q,
    setEditorLayout: M,
    setHistorySaving: N,
    setIncorrectExamples: fn,
    setSaveMessage: J,
    acquireSaveLock: A,
    enqueueSave: D,
    getSaveQueueSnapshot: X,
    shotBoundaries: Wt,
    timelineDuration: cr,
    video: tt,
    workspaceRef: Ln
  }), { executeShortcutById: Oo, stepVideoFrame: ys } = Ec({
    allSwimlanes: kt,
    applyShortcutTiming: Wi,
    centerTimelineRef: or,
    compatibilityMode: l,
    createSegment: Io,
    currentTime: S,
    deleteRejectedSegments: Mo,
    duplicateSegment: $o,
    editorLayout: de,
    editorRef: St,
    emptyRecyclingBin: ls,
    lineage: Hr,
    mediaDuration: ko,
    mergeSelectedSwimlane: Ro,
    moveToBin: ss,
    mutateShotBoundary: fs,
    openPublishApprovedDialog: To,
    playbackControlsRef: On,
    playbackShortcutConfig: ji,
    saveSelectedReviewState: Yi,
    seekRef: yn,
    segmentGroupKeys: zr,
    selectSegment: No,
    selectedSegment: I,
    selectedSegmentGroupForSegment: In,
    selectedSegmentGroupKey: le,
    selectedSegments: Re,
    setCollapsedSegmentGroups: Q,
    setIncorrectExamplesOpen: ke,
    setQuickSearchOpen: je,
    setSaveMessage: J,
    setSelectedSegmentGroupKey: Ne,
    setTagEditing: U,
    setTimelineZoom: Y,
    shotBoundaries: Wt,
    slotButtonRef: Kt,
    splitSegment: Co,
    swimlanes: Kr,
    timelineDuration: cr,
    toggleIncorrectExample: Xi,
    toggleSegmentGroup: Po,
    updateTimelineRatio: Eo,
    videoFrameRate: sr,
    visibleSegments: bt
  });
  bn.current = Oo;
  const bs = He(() => Zn.map((L) => ({
    id: L.id,
    enabled: Mn(L, l),
    surface: "local",
    action: (ie) => {
      var Le;
      return (Le = bn.current) == null ? void 0 : Le.call(bn, L.id, ie);
    }
  })), [l]);
  Da(io, bs);
  const hs = lo(ne), vs = dn(de.markerRailWidth, Do("markerRailWidth")), xs = dn(de.detailWidth, Do("detailWidth"));
  return n($c, {
    activeFilterCount: Gr,
    allSwimlanes: kt,
    analysisError: Oe,
    analysisRun: Me,
    analysisStatus: Et,
    approvalFacetCounts: jr,
    autoAssignCandidates: Un,
    autoAssignError: at,
    autoAssignOpen: Ue,
    autoAssignPerformers: ns,
    autoAssigning: we,
    canMoveSelectionToBin: vt,
    captureTrainingExport: ts,
    cancelQueuedReviewsForSegments: Qi,
    removeIncorrectExample: es,
    rejectedDeletionPreview: Ve,
    centerTimelineRef: or,
    closeEditorFilters: Fr,
    closeFirstSegmentTagDialog: lr,
    closeMaterializeDialog: os,
    closeMergeConfirmation: Ji,
    closePublishApprovedDialog: Ao,
    closeTagEditing: Nn,
    collapsedSegmentGroups: xt,
    commonActionsRef: an,
    compatibilityMode: l,
    configuringTag: er,
    createSegment: Io,
    currentTime: S,
    deleteRejectedSegments: Mo,
    detail: e,
    detailPanelRef: R,
    detailWidth: xs,
    duplicateSegment: $o,
    editorFilters: g,
    editorLayout: de,
    editorRef: St,
    exportingExamples: nr,
    filtersButtonRef: Fn,
    filtersOpen: F,
    firstSegmentTagOpen: Ie,
    focusRowRef: vn,
    handleSeparatorKeyDown: ms,
    handleSeparatorPointerDown: cs,
    handleSeparatorPointerMove: us,
    hideDerivedSegments: W,
    history: x,
    historyOpen: K,
    historySaving: ue,
    hasNextUnreviewed: Li,
    hasPreviousUnreviewed: Oi,
    horizontalLayoutSize: v,
    importNativeSegments: Ze,
    incorrectExamples: Qt,
    incorrectExamplesOpen: _e,
    removingExampleId: rr,
    lineage: Hr,
    markerRailWidth: vs,
    materializeButtonRef: Pn,
    materializeCancelButtonRef: tr,
    materializeDerivedSegments: as,
    materializeError: Ot,
    materializeLoading: ut,
    materializeOpen: Je,
    materializePreview: $e,
    materializing: Pt,
    mediaStackRef: hn,
    mergeCancelButtonRef: Qe,
    mergeConfirmation: Ge,
    mergeSaving: Ed(_, "merge"),
    mergeSelectedSwimlane: Ro,
    nativeImportState: ct,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: To,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: gs,
    pendingInitialSeekRef: Er,
    performerSlots: At,
    performerSlotsAvailable: Lr,
    playbackControlsRef: On,
    previewDerivedSegments: rs,
    provenance: Bi,
    provenanceSources: Br,
    publishApprovedCancelButtonRef: dt,
    publishApprovedDrafts: Vi,
    publishApprovedError: nt,
    publishApprovedOpen: gt,
    quickSearchOpen: We,
    railScrollRef: jn,
    railToggleRef: ar,
    recordHistoryAction: ur,
    restoreHistoryTarget: ds,
    runEditorAction: Oo,
    stepVideoFrame: ys,
    saveMessage: ce,
    setSaveMessage: J,
    saveTag: is,
    saveTiming: _i,
    savingSegmentId: E,
    acquireSaveLock: A,
    seekRef: yn,
    segmentGroups: Lt,
    segmentRailLayout: zn,
    segments: zt,
    selectAllVideoSegments: Ki,
    selectSegment: No,
    selectSegmentCollection: Ui,
    selectedGroups: So,
    selectedPerformerSlots: Ht,
    selectedSegment: Xe,
    selectedSegmentGroupKey: le,
    selectedSegmentIds: b,
    selectedSegments: Re,
    selectedSlotStatus: Ur,
    setAutoAssignError: Se,
    setAutoAssignOpen: De,
    setConfiguringTag: rn,
    setCurrentTime: T,
    setEditorFilters: B,
    setEditorLayout: M,
    setFiltersOpen: z,
    setHideDerivedSegments: O,
    setHistoryOpen: H,
    setIncorrectExamplesOpen: ke,
    setQuickSearchOpen: je,
    setRejectedDeletionPreview: ft,
    setRailViewport: Bn,
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
    tagSearchRef: ir,
    timelineDuration: cr,
    timelineRatioBounds: hs,
    timelineZoom: me,
    toggleSegmentGroup: Po,
    toggleSegmentRail: ps,
    updateTimelineRatio: Eo,
    video: tt,
    videoPerformers: wn,
    visibleCounts: sn,
    visibleSegmentRailRows: Pi,
    visibleSegments: bt,
    wideLayout: on,
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
      if ((f || []).some((R) => Lc.has(R == null ? void 0 : R.status)))
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
    [...f.tags || []].sort((w, R) => (w.sortOrder ?? 0) - (R.sortOrder ?? 0) || Number(w.tagId) - Number(R.tagId)).forEach((w, R) => r.set(Number(w.tagId), {
      key: `group:${f.id}`,
      id: f.id,
      name: f.name,
      sortOrder: f.sortOrder ?? y,
      tagSortOrder: w.sortOrder ?? R
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(f, y) {
    const w = Number(f);
    if (!o.has(w)) {
      const R = r.get(w);
      o.set(w, {
        tagId: w,
        name: y || `Tag ${w}`,
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
  const a = /* @__PURE__ */ new Map();
  e.forEach((f) => {
    const y = i(f.sourceTagId, f.sourceTagName), w = i(f.derivedTagId, f.derivedTagName);
    y.outgoingRuleCount++, w.incomingRuleCount++;
    const R = `${y.tagId}:${w.tagId}`;
    a.has(R) || a.set(R, {
      id: R,
      sourceTagId: y.tagId,
      derivedTagId: w.tagId,
      rules: [],
      edgeCount: 0
    });
    const g = a.get(R);
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
      const O = y.shift();
      w.push(O);
      for (const S of d.get(O) || [])
        c.has(S) || (c.add(S), y.push(S));
    }
    const R = new Set(w), g = w.map((O) => o.get(O)), B = l.filter((O) => R.has(O.sourceTagId) && R.has(O.derivedTagId)), F = B.flatMap((O) => O.rules), z = g.filter((O) => O.outgoingRuleCount === 0).sort((O, S) => wt(O.name, S.name)), W = z.length > 0 ? z : [...g].sort((O, S) => wt(O.name, S.name));
    m.push({
      id: [...w].sort((O, S) => O - S).join(":"),
      label: W.length > 1 ? `${W[0].name} + ${W.length - 1}` : ((p = W[0]) == null ? void 0 : p.name) || "Derivation component",
      nodes: g,
      connections: B,
      rules: F,
      segmentGroupKeys: [...new Set(g.map((O) => O.segmentGroupKey))],
      materializedEdgeCount: F.reduce(
        (O, S) => O + (Number(S.edgeCount) || 0),
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
      var w, R;
      (w = u.get(o.get(Number(y.sourceTagId)).segmentGroupKey)) == null || w.ruleIds.add(y.id), (R = u.get(o.get(Number(y.derivedTagId)).segmentGroupKey)) == null || R.ruleIds.add(y.id);
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
  const m = new Map(e.nodes.map((T) => [T.tagId, /* @__PURE__ */ new Set()])), u = new Map(e.nodes.map((T) => [T.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((T) => {
    var k, $;
    (k = m.get(T.sourceTagId)) == null || k.add(T.derivedTagId), ($ = u.get(T.derivedTagId)) == null || $.add(T.sourceTagId);
  });
  const b = new Map(e.nodes.map((T) => {
    var k;
    return [
      T.tagId,
      ((k = u.get(T.tagId)) == null ? void 0 : k.size) || 0
    ];
  })), p = new Map(e.nodes.map((T) => [T.tagId, 0])), f = e.nodes.filter((T) => b.get(T.tagId) === 0).sort((T, k) => wt(T.name, k.name)).map((T) => T.tagId), y = /* @__PURE__ */ new Set();
  for (; f.length > 0; ) {
    const T = f.shift();
    if (!y.has(T)) {
      y.add(T);
      for (const k of m.get(T) || [])
        p.set(k, Math.max(p.get(k) || 0, (p.get(T) || 0) + 1)), b.set(k, b.get(k) - 1), b.get(k) === 0 && f.push(k);
    }
  }
  y.size !== e.nodes.length && e.nodes.filter((T) => !y.has(T.tagId)).sort((T, k) => wt(T.name, k.name)).forEach((T) => p.set(T.tagId, 0));
  const w = Math.max(0, ...p.values()), R = Math.max(
    t,
    240 + w * 296
  ), g = /* @__PURE__ */ new Map();
  e.nodes.forEach((T) => {
    g.has(T.segmentGroupKey) || g.set(T.segmentGroupKey, {
      key: T.segmentGroupKey,
      id: T.segmentGroupId,
      name: T.segmentGroupName,
      sortOrder: T.segmentGroupSortOrder,
      nodes: []
    }), g.get(T.segmentGroupKey).nodes.push(T);
  });
  const B = [...g.values()].sort((T, k) => T.sortOrder - k.sortOrder || wt(T.name, k.name));
  let F = 28;
  const z = [], W = B.map((T) => {
    const k = /* @__PURE__ */ new Map();
    T.nodes.forEach((D) => {
      const q = p.get(D.tagId) || 0;
      k.has(q) || k.set(q, []), k.get(q).push(D);
    });
    for (const D of k.values())
      D.sort((q, ee) => q.segmentGroupTagSortOrder - ee.segmentGroupTagSortOrder || wt(q.name, ee.name));
    const $ = Math.max(1, ...[...k.values()].map((D) => D.length)), _ = $ * 58 + ($ - 1) * 18, E = 70 + _, A = {
      ...T,
      x: 12,
      y: F,
      width: R - 24,
      height: E
    };
    for (const [D, q] of k.entries()) {
      const ee = q.length * 58 + Math.max(0, q.length - 1) * 18, pe = (_ - ee) / 2;
      q.forEach((be, X) => z.push({
        ...be,
        rank: D,
        x: 28 + D * 296,
        y: F + 34 + 18 + pe + X * 76,
        width: 184,
        height: 58
      }));
    }
    return F += E + 16, A;
  }), O = new Map(z.map((T) => [T.tagId, T])), S = e.connections.map((T) => {
    const k = O.get(T.sourceTagId), $ = O.get(T.derivedTagId), _ = k.x + k.width, E = k.y + k.height / 2, A = $.x, D = $.y + $.height / 2, q = Math.max(48, (A - _) * 0.48);
    return {
      ...T,
      path: `M ${_} ${E} C ${_ + q} ${E}, ${A - q} ${D}, ${A} ${D}`
    };
  });
  return {
    width: R,
    height: Math.max(r, F - 16 + 28),
    nodes: z,
    connections: S,
    groups: W
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
      const y = p.get(f.sourceTagId), w = p.get(f.derivedTagId), R = y.x + y.width, g = y.y + y.height / 2, B = w.x, F = w.y + w.height / 2, z = Math.max(48, (B - R) * 0.48);
      return {
        ...f,
        componentId: d.id,
        path: `M ${R} ${g} C ${R + z} ${g}, ${B - z} ${F}, ${B} ${F}`
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
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: m, editorRef: u, emptyDraft: b, graph: p, layout: f, listSort: y, materializationOffer: w, materializeOutgoingRules: R, materializeRule: g, message: B, normalizedQuery: F, query: z, refreshConfiguredTag: W, revealEditor: O, rules: S, save: T, segmentGroupKey: k, selectedNode: $, selectedRule: _, selection: E, setConfiguringTag: A, setDraft: D, setListSort: q, setMaterializationOffer: ee, setQuery: pe, setSegmentGroupKey: be, setSelection: X, setView: j, sortedVisibleRules: ae, sourceSlots: ce, sourceSlotsLoading: J, updateMapping: he, updateTag: ve, view: re, visibleComponents: se, visibleRules: me } = e;
  function Y(v) {
    const h = p.nodes.find((P) => P.tagId === Number(v.sourceTagId)), x = p.nodes.find((P) => P.tagId === Number(v.derivedTagId));
    return (h == null ? void 0 : h.segmentGroupKey) === (x == null ? void 0 : x.segmentGroupKey) ? h.segmentGroupKey : "cross-group";
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
          d.ruleId == null && d.sourceTagId && !J && ce.length === 0 ? n("div", {
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
          ...d.slotMappings.map((v, h) => n("div", { key: h, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: v.sourceSlotDefinitionId,
              disabled: r,
              onChange: (x) => he(h, "sourceSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${h + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...ce.map((x) => n("option", { key: x.id, value: x.id }, It(x)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: v.derivedSlotDefinitionId,
              disabled: r,
              onChange: (x) => he(h, "derivedSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${h + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((x) => n("option", { key: x.id, value: x.id }, It(x)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => D((x) => ({
                ...x,
                slotMappings: x.slotMappings.filter((P, oe) => oe !== h)
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
          onClick: T,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => D(null), className: o }, "Cancel")
      ])
    ]);
  }
  function M() {
    if ($) {
      const x = me.filter((K) => Number(K.derivedTagId) === $.tagId), P = me.filter((K) => Number(K.sourceTagId) === $.tagId), oe = (K, H, ue) => n("div", {
        key: K.id,
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
            `${K.sourceTagName} → ${K.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          ue ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => g(K),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => m(K, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(K),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, $.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, $.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${$.incomingRuleCount} incoming · ${$.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (K) => A({
            tagId: $.tagId,
            tagName: $.name,
            trigger: K.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        P.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => R($, P),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${P.length})`) : null,
        P.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...P.map((K) => oe(K, "Derives", !0))
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
            x.map((K) => oe(K, "Derived by", !1))
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
    const v = p.nodes.find((x) => x.tagId === Number(_.sourceTagId)), h = p.nodes.find((x) => x.tagId === Number(_.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (v == null ? void 0 : v.segmentGroupName) || "Ungrouped"),
          (v == null ? void 0 : v.segmentGroupKey) !== (h == null ? void 0 : h.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(h == null ? void 0 : h.segmentGroupName) || "Ungrouped"}`) : null
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
      (w == null ? void 0 : w.ruleId) === _.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => g(_, w),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => ee(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        _.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : _.slotMappings.map((x, P) => n("div", {
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
          onClick: () => g(_),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => m(_),
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
    if (se.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, F ? "No derivation relationships match your search." : "No derivation rules.");
    const v = $ == null ? void 0 : $.tagId, h = /* @__PURE__ */ new Set();
    return $ && (h.add($.tagId), f.connections.forEach((x) => {
      (x.sourceTagId === $.tagId || x.derivedTagId === $.tagId) && (h.add(x.sourceTagId), h.add(x.derivedTagId));
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
            const P = v === x.sourceTagId || v === x.derivedTagId, oe = $ != null, K = P ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${x.id}:visible`,
              d: x.path,
              fill: "none",
              stroke: K,
              strokeWidth: P ? 2.5 : 1.5,
              opacity: oe && !P ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...f.nodes.map((x) => {
          const P = !F || x.name.toLocaleLowerCase().includes(F), oe = $ != null, K = h.has(x.tagId), H = ($ == null ? void 0 : $.tagId) === x.tagId;
          return n("button", {
            key: `node:${x.tagId}`,
            type: "button",
            onClick: () => X({ type: "node", id: x.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${H ? "border-accent bg-accent/15 ring-2 ring-accent/25" : K ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${x.x}px`,
              top: `${x.y}px`,
              width: `${x.width}px`,
              height: `${x.height}px`,
              opacity: !P || oe && !K ? 0.62 : 1
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
          const P = f.nodes.find((K) => K.tagId === x.sourceTagId), oe = f.nodes.find((K) => K.tagId === x.derivedTagId);
          return n("div", {
            key: `bundle:${x.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(P.x + P.width + oe.x) / 2 - 24}px`,
              top: `${(P.y + P.height / 2 + oe.y + oe.height / 2) / 2 - 10}px`
            },
            "aria-label": `${x.rules.length} rules connect ${x.rules[0].sourceTagName} to ${x.rules[0].derivedTagName}`
          }, `${x.rules.length} rules`);
        })
      ])
    ]);
  }
  function C() {
    if (se.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        F ? "No derivation relationships match your search." : "No derivation rules."
      );
    const v = /* @__PURE__ */ new Map();
    ae.forEach((x) => {
      const P = Y(x);
      v.has(P) || v.set(P, []), v.get(P).push(x);
    });
    const h = [
      ...p.segmentGroups.map((x) => x.key),
      "cross-group"
    ].filter((x) => v.has(x));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, h.map((x) => {
      const P = p.segmentGroups.find((H) => H.key === x), oe = x === "cross-group" ? "Cross-group relationships" : (P == null ? void 0 : P.name) || "Ungrouped", K = v.get(x);
      return n("section", { key: x, "aria-label": oe }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, oe),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${K.length} rule${K.length === 1 ? "" : "s"}`
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
          ...K.map((H) => n("button", {
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
          `${S.length} rules · ${p.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          D(b()), X(null), O();
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
          value: z,
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
          value: k,
          disabled: d != null,
          onChange: (v) => {
            be(v.target.value), X(null), D(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...p.segmentGroups.map((v) => n("option", { key: v.key, value: v.key }, v.name))
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
        ].map(([v, h]) => n("button", {
          key: v,
          type: "button",
          onClick: () => {
            j(v), v === "graph" && (E == null ? void 0 : E.type) === "rule" && X(null);
          },
          "aria-pressed": re === v,
          className: `rounded px-3 py-1.5 text-sm font-medium ${re === v ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
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
        re === "graph" ? ne() : C()
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
      B ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, B) : null
    ]),
    i ? n(xo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => W(i),
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
  }), [o, i] = G([]), [a, s] = G(null), [l, d] = G([]), [c, m] = G([]), [u, b] = G(!1), [p, f] = G(!1), [y, w] = G(!1), [R, g] = G(""), [B, F] = G(""), [z, W] = G("graph"), [O, S] = G("all"), [T, k] = G(null), [$, _] = G("relationship"), [E, A] = G(null), [D, q] = G(null), ee = fe(null), pe = fe(null), be = ii().replace(/:/g, "");
  function X() {
    requestAnimationFrame(() => {
      var N;
      return (N = ee.current) == null ? void 0 : N.scrollIntoView({ block: "nearest" });
    });
  }
  async function j(N) {
    const V = await Z("/derivation-rules", N ? { signal: N } : void 0);
    i(V || []);
  }
  ye(() => {
    const N = new AbortController();
    return j(N.signal).catch((V) => {
      V.name !== "AbortError" && g(V.message || "Unable to load derived segment rules.");
    }), () => N.abort();
  }, []), ye(() => {
    const N = new AbortController();
    return a != null && a.sourceTagId ? (b(!0), Z(`/slot-definitions/${a.sourceTagId}`, { signal: N.signal }).then((V) => d(V.definitions || [])).catch((V) => {
      V.name !== "AbortError" && d([]);
    }).finally(() => {
      N.signal.aborted || b(!1);
    })) : (d([]), b(!1)), a != null && a.derivedTagId ? (f(!0), Z(`/slot-definitions/${a.derivedTagId}`, { signal: N.signal }).then((V) => m(V.definitions || [])).catch((V) => {
      V.name !== "AbortError" && m([]);
    }).finally(() => {
      N.signal.aborted || f(!1);
    })) : (m([]), f(!1)), () => N.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), ye(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || u || p)
      return;
    const N = `${a.sourceTagId}:${a.derivedTagId}`;
    pe.current !== N && (pe.current = N, s((V) => !V || Number(V.sourceTagId) !== Number(a.sourceTagId) || Number(V.derivedTagId) !== Number(a.derivedTagId) ? V : dd(V, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    u,
    p
  ]);
  function ae(N, V = !1) {
    V || k({ type: "rule", id: N.id }), pe.current = null, s({
      ruleId: N.id,
      sourceTagId: N.sourceTagId,
      sourceTagName: N.sourceTagName,
      derivedTagId: N.derivedTagId,
      derivedTagName: N.derivedTagName,
      slotMappings: N.slotMappings.map((U) => ({
        sourceSlotDefinitionId: U.sourceSlotDefinitionId,
        derivedSlotDefinitionId: U.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), g(""), X();
  }
  function ce(N, V, U = "") {
    pe.current = null, N === "source" ? (d([]), b(V != null)) : (m([]), f(V != null)), s((te) => ({
      ...te,
      [`${N}TagId`]: V == null ? null : Number(V),
      [`${N}TagName`]: U || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function J(N) {
    (a == null ? void 0 : a.ruleId) == null && (pe.current = null);
    const V = [j(), t == null ? void 0 : t()];
    return N.draftKind === "source" ? (b(!0), V.push(Z(`/slot-definitions/${N.tagId}`).then((U) => d(U.definitions || [])).finally(() => b(!1)))) : N.draftKind === "derived" && (f(!0), V.push(Z(`/slot-definitions/${N.tagId}`).then((U) => m(U.definitions || [])).finally(() => f(!1)))), Promise.all(V);
  }
  function he(N, V, U) {
    s((te) => ({
      ...te,
      slotMappings: te.slotMappings.map((ge, Fe) => Fe === N ? { ...ge, [V]: U } : ge)
    }));
  }
  async function ve() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const N = Ca(a, o);
    if (N) {
      g(N.message);
      return;
    }
    if (a.slotMappings.some((V) => !V.sourceSlotDefinitionId || !V.derivedSlotDefinitionId)) {
      g("Complete or remove every performer slot mapping before saving.");
      return;
    }
    w(!0), g(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let V = null;
      if (a.ruleId != null) {
        const te = await Z(
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
        V = te.fingerprint;
      }
      g("Saving derived segment rule…");
      const U = await Z("/derivation-rules", {
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
      if (await j(), k(z === "graph" ? { type: "node", id: Number(U.sourceTagId) } : { type: "rule", id: U.id }), s(null), a.ruleId == null)
        try {
          const te = await Z(
            `/derivation-rules/${U.id}/materialization/preview`,
            { method: "POST" }
          );
          A(
            te.createCount + te.linkCount > 0 ? te : null
          ), g(te.createCount + te.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          A(null), g("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        A(null), g("Derived segment rule saved. Previous materializations were removed.");
    } catch (V) {
      g(V.message || "Unable to save derived segment rule.");
    } finally {
      w(!1);
    }
  }
  async function re(N) {
    w(!0), g("Previewing rule deletion…");
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
      const U = `derivation-rule-delete:${N.id}:${V.fingerprint}`;
      await Z(`/derivation-rules/${N.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ke(U),
          fingerprint: V.fingerprint
        })
      }), ze(U), await j(), (a == null ? void 0 : a.ruleId) === N.id && s(null), (T == null ? void 0 : T.type) === "rule" && T.id === N.id && k(null), (E == null ? void 0 : E.ruleId) === N.id && A(null), g(`Rule deleted with ${V.deletedSegmentCount} exclusively derived segment${V.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (V) {
      g(V.message || "Unable to delete derived segment rule.");
    } finally {
      w(!1);
    }
  }
  async function se(N, V = null) {
    const U = V || await Z(
      `/derivation-rules/${N.id}/materialization/preview`,
      { method: "POST" }
    );
    if (U.createCount + U.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const te = `derivation-rule-materialize:${N.id}:${U.fingerprint}`, ge = await Z(`/derivation-rules/${N.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Ke(te),
        fingerprint: U.fingerprint
      })
    });
    return ze(te), ge;
  }
  async function me(N, V = null) {
    w(!0), g("Finding pending derivations…");
    try {
      const U = await se(N, V);
      if (A(null), await j(), U.createdCount + U.linkedCount === 0) {
        g("Every applicable derivation is already materialized.");
        return;
      }
      g(
        `${U.createdCount} derived segment${U.createdCount === 1 ? "" : "s"} created and ${U.linkedCount} existing segment${U.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (U) {
      g(U.message || "Unable to materialize pending derivations.");
    } finally {
      w(!1);
    }
  }
  async function Y(N, V) {
    if (V.length === 0) return;
    w(!0), g(`Finding pending derivations from ${N.name}…`);
    let U = 0, te = 0;
    try {
      for (const ge of V) {
        const Fe = await se(ge);
        U += Fe.createdCount, te += Fe.linkedCount;
      }
      A(null), await j(), g(U + te === 0 ? `Every outgoing derivation from ${N.name} is already materialized.` : `${U} derived segment${U === 1 ? "" : "s"} created and ${te} existing segment${te === 1 ? "" : "s"} linked from ${N.name}.`);
    } catch (ge) {
      await j().catch(() => {
      }), g(ge.message || `Unable to materialize derivations from ${N.name}.`);
    } finally {
      w(!1);
    }
  }
  const de = Ca(a, o), M = He(
    () => Uc(o, e),
    [o, e]
  ), ne = B.trim().toLocaleLowerCase(), v = M.components.filter((N) => O === "all" || N.segmentGroupKeys.includes(O)).filter((N) => !ne || N.nodes.some((V) => V.name.toLocaleLowerCase().includes(ne))), h = v.flatMap((N) => N.rules), x = new Set(
    v.flatMap((N) => N.nodes.map((V) => V.tagId))
  ), P = He(
    () => zc(v),
    [v]
  ), oe = z === "list" ? Hc(
    T,
    h,
    ne.length > 0
  ) : null, K = (T == null ? void 0 : T.type) === "node" && M.nodes.find((N) => N.tagId === T.id && x.has(N.tagId)) || null, H = [...h].sort((N, V) => $ === "source" ? wt(N.sourceTagName, V.sourceTagName) || wt(N.derivedTagName, V.derivedTagName) : $ === "target" ? wt(N.derivedTagName, V.derivedTagName) || wt(N.sourceTagName, V.sourceTagName) : $ === "materialized" ? (Number(V.edgeCount) || 0) - (Number(N.edgeCount) || 0) || wt(N.sourceTagName, V.sourceTagName) : wt(
    `${N.sourceTagName} ${N.derivedTagName}`,
    `${V.sourceTagName} ${V.derivedTagName}`
  ));
  return n(qc, {
    arrowMarkerId: be,
    busy: y,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: D,
    deleteRule: re,
    derivedSlots: c,
    derivedSlotsLoading: p,
    draft: a,
    draftIssue: de,
    editRule: ae,
    editorRef: ee,
    emptyDraft: r,
    graph: M,
    layout: P,
    listSort: $,
    materializationOffer: E,
    materializeOutgoingRules: Y,
    materializeRule: me,
    message: R,
    normalizedQuery: ne,
    query: B,
    refreshConfiguredTag: J,
    revealEditor: X,
    rules: o,
    save: ve,
    segmentGroupKey: O,
    selectedNode: K,
    selectedRule: oe,
    selection: T,
    setConfiguringTag: q,
    setDraft: s,
    setListSort: _,
    setMaterializationOffer: A,
    setQuery: F,
    setSegmentGroupKey: S,
    setSelection: k,
    setView: W,
    sortedVisibleRules: H,
    sourceSlots: l,
    sourceSlotsLoading: u,
    updateMapping: he,
    updateTag: ce,
    view: z,
    visibleComponents: v,
    visibleRules: h
  });
}
function Wc() {
  const [e, t] = G(ei), r = [
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
  const [o, i] = G([]), [a, s] = G(!1), [l, d] = G(!1), [c, m] = G(""), [u, b] = G(""), [p, f] = G("all"), [y, w] = G(() => /* @__PURE__ */ new Set()), [R, g] = G(null);
  ye(() => {
    if (!e || a) return;
    const A = new AbortController();
    return d(!0), m(""), Z("/slot-definitions", { signal: A.signal }).then((D) => {
      i(D || []), s(!0);
    }).catch((D) => {
      D.name !== "AbortError" && m(D.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      A.signal.aborted || d(!1);
    }), () => A.abort();
  }, [e, a]);
  async function B() {
    d(!0), m("");
    try {
      const A = await Z("/slot-definitions");
      i(A || []), s(!0);
    } catch (A) {
      m(A.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function F() {
    const [A] = await Promise.all([
      Z("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(A || []), s(!0), m("");
  }
  function z() {
    const A = R == null ? void 0 : R.trigger;
    g(null), requestAnimationFrame(() => {
      A != null && A.isConnected && A.focus({ preventScroll: !0 });
    });
  }
  function W(A) {
    w((D) => {
      const q = new Set(D);
      return q.has(A) ? q.delete(A) : q.add(A), q;
    });
  }
  const O = He(
    () => Bc(t, o),
    [t, o]
  ), S = He(
    () => Gc(O, u, p),
    [O, u, p]
  ), T = O.flatMap((A) => A.tags), k = T.filter((A) => A.definitions.length > 0).length, $ = T.length - k, _ = [
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
        `${T.length} tags · ${k} with slots · ${$} without slots`
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
          _.map(([A, D]) => n("button", {
            key: A,
            type: "button",
            onClick: () => f(A),
            "aria-pressed": p === A,
            className: `rounded px-3 py-1.5 text-xs font-medium ${p === A ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, D))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => w(/* @__PURE__ */ new Set()),
          className: E
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => w(new Set(O.map((A) => A.overviewKey))),
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
        onClick: B,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && S.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, S.map((A) => {
      const D = y.has(A.overviewKey), q = A.tags.filter((ee) => ee.definitions.length > 0).length;
      return n("article", {
        key: A.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => W(A.overviewKey),
          "aria-expanded": !D,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, D ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, A.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${A.tags.length} tag${A.tags.length === 1 ? "" : "s"} · ${q} with slots`
          )
        ]),
        D ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          A.tags.map((ee) => n("li", {
            key: ee.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: ee.tagName }, ee.tagName),
              ee.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            ee.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${ee.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, ee.definitions.map((pe) => n("li", {
              key: pe.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, It(pe)),
              ...(pe.genderHints || []).map((be) => n("span", {
                key: be,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, $r(be)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (pe) => g({
                tagId: ee.tagId,
                tagName: ee.tagName,
                trigger: pe.currentTarget
              }),
              "aria-label": `Edit performer slots for ${ee.tagName}`,
              className: `${E} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    R ? n(xo, {
      key: `performer-slots-configure:${R.tagId}`,
      tagId: R.tagId,
      tagName: R.tagName,
      onSaved: F,
      onClose: z
    }) : null
  ]);
}
function Jc({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = G("general"), [a, s] = G([]), [l, d] = G(!1), [c, m] = G(""), [u, b] = G(""), [p, f] = G(null), [y, w] = G(!0), [R, g] = G(!1), [B, F] = G(""), [z, W] = G(!0), [O, S] = G(Wa), T = Cl(t), k = T.map(([D]) => D);
  ye(() => {
    k.includes(o) || i(k[0] || "general");
  }, [t.effectiveMode]);
  async function $(D) {
    const q = await Z("/segment-groups", D ? { signal: D } : void 0);
    s(q || []);
  }
  ye(() => {
    const D = new AbortController();
    return $(D.signal).catch((q) => {
      q.name !== "AbortError" && m(q.message || "Unable to load tag groups.");
    }), () => D.abort();
  }, []), ye(() => {
    if (t.effectiveMode !== "full") {
      w(!1);
      return;
    }
    const D = new AbortController();
    return F(""), w(!0), Promise.all([
      Z("/analysis/settings", { signal: D.signal }),
      Z("/analysis/status", { signal: D.signal })
    ]).then(([q, ee]) => {
      W(!0), b((q == null ? void 0 : q.baseUrl) || ""), f(ee);
    }).catch((q) => {
      if (q.name !== "AbortError") {
        if (q.status === 403) {
          W(!1), F("You do not have permission to manage the analysis service connection.");
          return;
        }
        F(q.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      D.signal.aborted || w(!1);
    }), () => D.abort();
  }, [t.effectiveMode]);
  async function _(D) {
    if (D !== t.requestedMode) {
      d(!0), m("");
      try {
        const q = await Z(
          `/preferences/transition?mode=${encodeURIComponent(D)}`
        );
        let ee = !1, pe = null, be = null, X = null, j = !1;
        if (t.requestedMode === "basic" && D === "full") {
          if (!window.confirm(Al(
            q.recyclingBinCount,
            q.protectedRecyclingBinCount
          )))
            return;
          j = !0, q.recyclingBinCount > 0 && (ee = !0, X = q.recyclingBinFingerprint, pe = `mode-switch-empty-bin:${X}`, be = Ke(pe));
        }
        let ae = !1;
        if (t.requestedMode === "full" && D === "basic") {
          if (!window.confirm(Tl(
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
            confirmBasicHistoryCleanup: j,
            emptyRecyclingBin: ee,
            operationId: be,
            expectedRecyclingBinFingerprint: X
          })
        });
        pe && ze(pe), r == null || r(ti(ce)), m("Workflow mode saved.");
      } catch (q) {
        m(q.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function E(D) {
    D.preventDefault(), g(!0), F("");
    try {
      const q = await Z("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: u })
      });
      b((q == null ? void 0 : q.baseUrl) || "");
      const ee = await Z("/analysis/status");
      f(ee), F(q != null && q.baseUrl ? ee != null && ee.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(ee == null ? void 0 : ee.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (q) {
      F(q.message || "Unable to save analysis service settings.");
    } finally {
      g(!1);
    }
  }
  const A = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (D) => Ti(D, e, A), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      T.map(([D, q]) => n("button", {
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
            Va(q), S(q);
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
            onChange: (D) => b(D.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: y || R || !z,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: y || R || !z,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, R ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        B || (y ? "Loading analysis service settings…" : (p == null ? void 0 : p.configured) === !1 ? "Full Scan is not configured." : p != null && p.ready ? "Analysis service is ready." : (p == null ? void 0 : p.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    k.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(_c, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => $()
      })
    ) : null,
    k.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(Vc, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => $()
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
          n(mn, { key: "state", state: e.reviewState, includeLabel: !1 }),
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
  const r = He(() => {
    const j = Pa("ext:com.midnightrider.segment-studio:segments");
    return j ? {
      ...Wr,
      defaultFilter: { ...Wr.defaultFilter, ...j.findFilter || {} },
      defaultObjectFilter: j.objectFilter || {}
    } : Wr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Oa(r), [l, d] = G(null), [c, m] = G({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [u, b] = G(null), [p, f] = G(null), [y, w] = G(0), [R, g] = G(""), [B, F] = G(!0), [z, W] = G(""), O = fe(0), S = na(o, i), T = S.activityTagId, k = An(i.slots), $ = He(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (j) => Object.keys(An(j)).length > 0,
    sanitize: (j) => Vr(T, An(j)),
    summarize: (j) => `${Object.keys(An(j)).length} assigned`,
    renderEditor: (j, ae) => T ? n($a, {
      facets: l,
      values: An(j),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (ce, J) => {
        const he = { ...An(j) };
        J ? he[ce] = Number(J) : delete he[ce], ae(Vr(T, he));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [T, l, c.performerSlotsAvailable]), _ = JSON.stringify(S);
  ye(() => {
    if (d(null), !T) return;
    const j = new AbortController();
    return Z(`/browse/activities/${T}/facets`, { signal: j.signal }).then(d).catch((ae) => {
      ae.status === 403 ? d({ slots: [], restricted: !0 }) : ae.name !== "AbortError" && W(ae.message);
    }), () => j.abort();
  }, [T]), ye(() => {
    const j = ++O.current, ae = new AbortController();
    return F(!0), W(""), Z("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(S), signal: ae.signal }).then((ce) => {
      j === O.current && m({ ...ce, totalCount: ce.totalCount ?? ce.total ?? 0 });
    }).catch((ce) => {
      if (!(j !== O.current || ce.name === "AbortError")) {
        if (ce.status === 400 && ce.message.includes("unrestricted performer read access")) {
          m((J) => ({ ...J, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), W("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        W(ce.message);
      }
    }).finally(() => {
      j === O.current && F(!1);
    }), () => {
      O.current++, ae.abort();
    };
  }, [_, y]);
  const E = c.items.findIndex((j) => j.key === u), A = c.items[E] || null;
  function D(j) {
    s(j), a({ ...o, page: 1 });
  }
  function q(j) {
    const ae = na(o, j), ce = j.slots && ae.activityTagId != null && ae.slotAssignments.length > 0 ? j.slots : void 0;
    D({ ...j, slots: ce });
  }
  function ee(j, ae) {
    const ce = { ...k };
    ae ? ce[j] = Number(ae) : delete ce[j], D({ ...i, slots: Vr(T, ce) });
  }
  function pe() {
    const j = document.querySelector(`[data-segment-key="${u}"]`);
    b(null), requestAnimationFrame(() => j == null ? void 0 : j.focus());
  }
  async function be(j) {
    var J;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    f(j.key), g("");
    const ae = `browse-restore:${j.itemId}:${j.revision}`, ce = Ke(ae);
    try {
      const he = (ve = !1) => Z(`/bin/${j.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ce,
          expectedRevision: j.revision,
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
      ze(ae), u === j.key && b(null), g("Segment restored to Cove."), w((ve) => ve + 1);
    } catch (he) {
      g(he.message || "Unable to restore the segment."), he.status === 409 && w((ve) => ve + 1);
    } finally {
      f(null);
    }
  }
  async function X(j) {
    f(j.key), g("");
    try {
      const ae = await Z(`/items/${j.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: j.revision })
      });
      if (!li(ae, g) || !_l(ae))
        return;
      const ce = `browse-dependency-delete:${j.itemId}:${ae.fingerprint}`;
      await Z(`/items/${j.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ke(ce),
          fingerprint: ae.fingerprint
        })
      }), ze(ce), u === j.key && b(null), g(`${ae.deletedSegmentCount} segment${ae.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), w((J) => J + 1);
    } catch (ae) {
      g(ae.message || "Unable to permanently delete the segment."), ae.status === 409 && w((ce) => ce + 1);
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
      isLoading: B,
      error: z ? new Error(z) : null,
      onRetry: () => w((j) => j + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? ta.filter((j) => j.id !== "performers") : ta,
      objectFilter: i,
      onObjectFilterChange: q,
      customFilterSections: $,
      searchPlaceholder: "Search segments..."
    }, [
      T ? n($a, { key: "slots", facets: l, values: k, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: ee }) : null,
      n(Qc, { key: "player", item: A, index: E, count: c.items.length, onPrevious: () => {
        var j;
        return b((j = c.items[E - 1]) == null ? void 0 : j.key);
      }, onNext: () => {
        var j;
        return b((j = c.items[E + 1]) == null ? void 0 : j.key);
      }, onClose: pe, onNavigate: e }),
      R ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, R) : null,
      !B && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      B ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((j) => n(Yc, {
        key: j.key,
        item: j,
        selected: j.key === u,
        busy: p === j.key,
        onSelect: () => b(j.key),
        onRestore: be,
        onPurge: X
      })))
    ])
  ]);
}
function Zc({ onNavigate: e, profile: t }) {
  const [r, o] = G([]), [i, a] = G(""), [s, l] = G(0), [d, c] = G(!0), [m, u] = G(null), [b, p] = G(""), f = fe(null);
  async function y(g) {
    const B = await Z("/bin", g ? { signal: g } : void 0);
    return o(B.items || []), a(B.fingerprint || ""), l(Number(B.totalCount) || 0), B;
  }
  ye(() => {
    const g = new AbortController();
    return c(!0), y(g.signal).catch((B) => {
      B.name !== "AbortError" && p(B.message);
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
    var z;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    u(g.itemId), p("");
    const B = `restore:${g.itemId}:${g.revision}`, F = Ke(B);
    try {
      const W = (O = !1) => Z(`/bin/${g.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: F, expectedRevision: g.revision, discardMissingImage: O })
      });
      try {
        await W(mo(B));
      } catch (O) {
        if (((z = O.payload) == null ? void 0 : z.code) !== "missing-image" || !window.confirm(`${O.message}

Continue and discard the missing image reference?`)) throw O;
        go(B), await W(!0);
      }
      ze(B), await y(), Wn(), p("Segment restored with a new native ID.");
    } catch (W) {
      p(W.message || "Unable to restore the segment."), W.status === 409 && await y();
    } finally {
      u(null);
    }
  }
  async function R() {
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
  return f.current = R, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
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
        onClick: R,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, m === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    b ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, b) : null,
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
const Aa = "ext:com.midnightrider.segment-studio:videos";
function Yr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = He(() => {
    var me;
    const re = Pa(Aa), se = (me = re == null ? void 0 : re.uiOptions) == null ? void 0 : me.displayMode;
    return re ? {
      ...Hn,
      defaultFilter: { ...Hn.defaultFilter, ...re.findFilter || {} },
      defaultObjectFilter: re.objectFilter || {},
      defaultDisplayMode: Hn.allowedDisplayModes.includes(se) ? se : Hn.defaultDisplayMode
    } : Hn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: m } = Oa(i), [u, b] = G({ items: [], totalCount: 0 }), [p, f] = G(!0), [y, w] = G(""), [R, g] = G(0), [B, F] = G(/* @__PURE__ */ new Set()), [z, W] = G(null), [O, S] = G({ busy: !1, error: "", announcement: "" }), T = fe(0), k = fe(null), $ = fe(null);
  $.current || ($.current = Fc());
  const _ = JSON.stringify(a), E = JSON.stringify(s), A = t || r === "review";
  ye(() => {
    $.current.selectionChanged(), k.current = null, F(/* @__PURE__ */ new Set()), S((re) => ({ busy: re.busy, error: "", announcement: "" }));
  }, [_, E]), ye(() => {
    if (!A) return;
    const re = new AbortController();
    return Z("/analysis/status", { signal: re.signal }).then(W).catch((se) => {
      se.name !== "AbortError" && W({ configured: !0, ready: !1, error: se.message || "Unable to check Full Scan readiness." });
    }), () => re.abort();
  }, [A]), ye(() => {
    const re = ++T.current, se = new AbortController();
    return f(!0), w(""), Z(`/videos?${oc(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: se.signal }).then((me) => {
      re === T.current && b(me);
    }).catch((me) => {
      re === T.current && me.name !== "AbortError" && w(me.message || "Unable to discover videos.");
    }).finally(() => {
      re === T.current && f(!1);
    }), () => {
      T.current++, se.abort();
    };
  }, [_, E, t, r, R]);
  function D(re) {
    d({ ...re, page: re.page || 1 });
  }
  function q(re) {
    c(re), d({ ...a, page: 1 });
  }
  function ee(re, se = !1) {
    F((me) => ac(
      me,
      u.items.map((Y) => Y.videoId),
      re,
      k.current,
      se
    )), k.current = re;
  }
  function pe() {
    k.current = null, F(new Set(u.items.map((re) => re.videoId)));
  }
  function be() {
    k.current = null, F(/* @__PURE__ */ new Set());
  }
  function X() {
    k.current = null, F((re) => new Set(u.items.map((se) => se.videoId).filter((se) => !re.has(se))));
  }
  async function j(re = ["aiTagging", "omnishotcut"]) {
    const se = $.current.begin();
    if (se) {
      S({ busy: !0, error: "", announcement: "" });
      try {
        const me = await jc(
          [...B],
          re,
          Z,
          (Y) => window.confirm(Y)
        );
        if (me.cancelled) {
          S({ busy: !1, error: "", announcement: "" });
          return;
        }
        me.queuedIds.length > 0 && $.current.ownsCurrentSelection(se) && (me.queuedIds.includes(k.current) && (k.current = null), F((Y) => {
          const de = new Set(Y);
          return me.queuedIds.forEach((M) => de.delete(M)), de;
        })), S({
          busy: !1,
          announcement: me.queuedIds.length > 0 ? `${me.queuedIds.length} ${me.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: me.failed.length > 0 ? `${me.failed.length} selected ${me.failed.length === 1 ? "video could" : "videos could"} not be queued. ${me.failed[0].error}` : ""
        });
      } catch (me) {
        S({ busy: !1, error: me.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        $.current.finish(se);
      }
    }
  }
  const ae = t || r === "review" ? va : va.filter((re) => !["reviewState", "shotBoundaries"].includes(re.id)), ce = z === null || z.configured === !1 || z.ready === !1, J = O.busy || ce, he = (z == null ? void 0 : z.error) || (z === null ? "Checking Full Scan availability" : z.configured === !1 ? "Configure the analysis service before running Full Scan" : z.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), ve = O.busy ? "Queueing scans…" : z === null ? "Checking Full Scan…" : z.configured === !1 ? "Full Scan not configured" : z.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
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
      isLoading: p,
      error: y ? new Error(y) : null,
      onRetry: () => g((re) => re + 1),
      sortOptions: t || r === "review" ? [...ha, { value: "unreviewed_count", label: "Unreviewed count" }] : ha,
      displayMode: l,
      onDisplayModeChange: m,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: ae,
      objectFilter: s,
      onObjectFilterChange: q,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: A ? B : void 0,
      onSelectAll: A ? pe : void 0,
      onSelectNone: A ? be : void 0,
      onInvertSelection: A ? X : void 0,
      selectionActions: A ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: J,
          onClick: () => j(),
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
          ].map(([re, se]) => n("button", {
            key: re,
            type: "button",
            disabled: O.busy,
            onClick: (me) => {
              var Y;
              (Y = me.currentTarget.closest("details")) == null || Y.removeAttribute("open"), j(se);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, re)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, O.announcement),
      O.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, O.error) : null,
      !p && u.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !p && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, u.items.map((re) => n(ic, { key: re.videoId, item: re, onNavigate: e, showReviewStates: A, selected: B.has(re.videoId), selectionActive: B.size > 0, onSelect: A ? ee : null }))) : null,
      !p && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, u.items.map((re) => n(sc, { key: re.videoId, item: re, onNavigate: e, showReviewStates: A, selected: B.has(re.videoId), selectionActive: B.size > 0, onSelect: A ? ee : null }))) : null
    ])
  ]);
}
function Ra({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = G(null), [s, l] = G(!0), [d, c] = G(""), m = fe(0), u = fe(0), b = fe(e), p = Hd();
  b.current = e;
  const [f] = G(() => Ks({
    beginRequest: () => ({ requestId: ++u.current, videoId: b.current }),
    fetchDetail: (F) => Z(y(F.videoId)),
    isCurrent: (F) => mr(F.requestId, u.current, F.videoId, b.current),
    isSameVideo: (F) => F.videoId === b.current
  })), y = (F) => `/videos/${F}/editor`;
  async function w(F, z, W) {
    const O = await Z(y(z), W ? { signal: W.signal } : void 0);
    return mr(F, W ? m.current : u.current, z, b.current) ? (a(O), !0) : !1;
  }
  ye(() => {
    const F = ++m.current, z = e, W = new AbortController();
    return a(null), l(!0), c(""), w(F, z, W).catch((O) => {
      mr(F, m.current, z, b.current) && O.name !== "AbortError" && c(O.message || "Unable to load the editor.");
    }).finally(() => {
      mr(F, m.current, z, b.current) && l(!1);
    }), () => {
      m.current++, u.current++, W.abort();
    };
  }, [e]);
  function R(F, z) {
    a((W) => (W == null ? void 0 : W.video.id) !== z ? W : typeof F == "function" ? F(W) : F);
  }
  function g() {
    return f({
      onLoaded: (F) => {
        a(F), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: (F) => c(F.message || "Unable to reload the latest segment.")
    });
  }
  function B() {
    return f({
      onLoaded: (F) => {
        a(F), c("");
      },
      onError: (F) => c(F.message || "Unable to reload performer slots.")
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
    i ? n(Oc, {
      key: i.video.id,
      detail: i,
      onDetailChange: R,
      onConflict: g,
      onReload: B,
      onSlotsChanged: B,
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
  const [o, i] = G(null), [a, s] = G("");
  return ye(() => {
    const l = new AbortController();
    return Z("/preferences", { signal: l.signal }).then((d) => i(ti(d))).catch((d) => {
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
  Jt as SEGMENT_STUDIO_CAPABILITIES,
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
  Os as calculateCenteredTimelineScroll,
  Zr as calculateEditorPanelMaximum,
  Es as calculateMinuteLabelStride,
  mu as calculateMinuteTimelineWidth,
  js as calculateSwimlaneTitleMaximum,
  Ls as calculateTimelinePlayheadPosition,
  lo as calculateTimelineRatioBounds,
  Gs as calculateTimelineRatioFromPointer,
  gu as calculateVerticalRevealOffset,
  dn as clampEditorPanelWidth,
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
  Ye as findSegmentByStableIdentity,
  Us as findSegmentFromPlayhead,
  As as findSegmentNearPlayhead,
  xd as findSwimlaneRangeSelection,
  ro as findSwimlaneSelection,
  Ol as findUniquePerformerSlotAssignment,
  Sr as findUnreviewedSelection,
  od as focusDialogDefaultButton,
  $r as formatGenderHint,
  wl as frameStepSeconds,
  oi as generatePerformerSlotAssignmentRecommendations,
  bc as groupApprovedDraftsForPublishing,
  Ll as groupAutoAssignCandidates,
  Cd as groupIncorrectExamplesByTag,
  kc as groupMaterializationOutputs,
  cn as groupSegmentsIntoSwimlanes,
  yd as groupSelectedSwimlanes,
  bo as groupSwimlanesBySegmentGroup,
  Tt as handleModalKey,
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
  tn as normalizeCollapsedSegmentGroups,
  Sa as normalizeDiscoveryIds,
  Mt as normalizeEditorSegmentFilters,
  Xt as normalizeGender,
  Xo as normalizeReviewFilter,
  ti as normalizeSegmentStudioFeatureProfile,
  vu as normalizeSegmentStudioMode,
  to as normalizeSegmentStudioPublicMode,
  An as parseBrowseSlotFilters,
  Bs as parseEditorLayout,
  zs as parseHideDerivedSegmentsPreference,
  Hs as parseMergeConfirmationPreference,
  Xa as parsePlaybackShortcutConfig,
  ll as parseShortcutBindingOverrides,
  Rn as patchPerformerSlotProjection,
  Cu as patchSegmentProjection,
  Ud as pendingChangesReducer,
  Fd as pendingInsertedSegments,
  rl as percentageSeekTime,
  Pl as performInitialSegmentSeek,
  lt as performerOptionId,
  Nr as performerSlotHistoryState,
  It as performerSlotLabel,
  cd as performerSlotPresentation,
  Iu as performerSlotStatus,
  yo as performerSlotStatusFromSegmentSlots,
  pi as performerSlotsForSegment,
  Gt as provenanceSourceLabel,
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
  Pc as restorePublishApprovedFocus,
  $u as restoreSegmentFieldsProjection,
  Tu as restoreSegmentsProjection,
  jd as retargetPendingChanges,
  xi as revealCollapsedSegmentGroup,
  jc as runSelectedDiscoveryAnalysis,
  Dn as sameSegmentIdentity,
  ki as savingSegmentIdFrom,
  ui as segmentBadgeStyle,
  Cr as segmentGroupHeaderBackground,
  jt as segmentGroupKeyForSegment,
  fo as segmentHistoryIdentity,
  gr as segmentHistoryState,
  qt as segmentIdentity,
  mi as segmentRailItemStyle,
  ku as segmentStateStyle,
  ou as segmentStudioActionTarget,
  Nl as segmentStudioLegacyMode,
  Vl as segmentTimelineStyle,
  Rt as segmentsHistoryState,
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
  Ps as timelineTickPosition,
  Qr as timelineTimePercent,
  vd as toggleAllCollapsedSegmentGroups,
  ml as toggledSelectionReviewState,
  _t as trapModalFocus,
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
