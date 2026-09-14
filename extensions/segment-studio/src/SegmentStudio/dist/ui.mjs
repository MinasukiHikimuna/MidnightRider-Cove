import ro from "@cove/runtime/react";
import { createPortal as ms } from "@cove/runtime/react-dom";
import { extensionFetch as Ca } from "@cove/runtime/api";
import { formatDuration as gs, EntityReferenceSelector as Wn, useExtensionKeyboardBindings as ps, VideoPlayer as $a, useRegisterExtensionKeyboardActions as Ta, getDefaultFilter as Aa, useListUrlState as Ra, ListPage as Ma } from "@cove/runtime/components";
import { ChevronDown as Ea, StepBack as fs, StepForward as ys, Loader2 as bs } from "@cove/runtime/lucide-react";
const oo = "com.midnightrider.segment-studio", Da = "segment-studio.layout.v1", cn = "segment-studio.operations.v1", Pa = "segment-studio.collapsed-segment-groups.v1", Oa = "segment-studio.playback-shortcuts.v1", La = "segment-studio.timing-clipboard.v1", Fa = "segment-studio.hide-derived-segments.v1", ja = "segment-studio.merge-confirmation.v1", It = ["unreviewed", "approved", "rejected"], hs = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], Bo = "(min-width: 1024px) and (min-height: 640px)", Go = "(min-width: 1024px) and (min-height: 900px)", Vn = 1e-3, Uo = 15, vs = 30, Ba = 12, Tt = {
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
}, zt = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function Ko(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function Ga(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? Sr(e, null, 1, !0) ?? r[0] ?? null;
}
function Sr(e, t, r, o = !1) {
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
function xs(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((g, u) => g.markers.filter(({ segment: f }) => {
    const m = Number(f.startSec), p = f.endSec == null ? m + vs : Number(f.endSec);
    return Number.isFinite(m) && Number.isFinite(p) && p >= m && m <= i + Uo + Vn && p >= i - Uo - Vn;
  }).map(({ segment: f }) => ({ segment: f, laneIndex: u }))).sort((g, u) => g.laneIndex - u.laneIndex || Math.abs(g.segment.startSec - i) - Math.abs(u.segment.startSec - i) || g.segment.id - u.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((g) => g.markers.some((u) => u.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((g) => g.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((g) => g.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((g) => g.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function Ss(e, t, r) {
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
function kr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function au(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function ks(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function iu(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function ws(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function Ns(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Is(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function Cs(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Jr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function $s(e, t, r = 10) {
  const o = Jr(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function zo(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function Ts(e, t = Ba) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function Ua(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : Tt.timelineRatio;
}
function Yr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function ln(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? Tt.detailWidth : Math.min(Yr(t, 0), Math.max(240, e));
}
function hr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? Tt.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function As(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function io(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: Tt.timelineRatio, maximum: Tt.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function so(e, t) {
  const r = Ua(e);
  if (!(t > 0)) return r;
  const o = io(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function Rs(e) {
  if (!e) return { ...Tt };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? Ua(r) : Tt.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: ln(t == null ? void 0 : t.detailWidth),
      markerRailWidth: ln(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: hr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...Tt };
  }
}
function Ms(e, t, r) {
  return r > 0 ? so((t + r - e) / r, r) : Tt.timelineRatio;
}
function su(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function Es(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, g) => c.startSec - g.startSec || c.id - g.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= Vn ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function mr(e, t, r, o) {
  return e === t && r === o;
}
function Ds({ beginRequest: e, fetchDetail: t, isCurrent: r, isSameVideo: o }) {
  let i = null;
  return function({ onLoaded: s, onError: l }) {
    const d = e(), c = (async () => {
      try {
        const g = await t(d);
        if (r(d))
          return s(g), g;
      } catch (g) {
        if (r(d))
          return l(g), null;
      }
      return o(d) && i !== c ? i : null;
    })();
    return i = c, c;
  };
}
const wr = "__segment-studio-cleared-selection__";
function Ps(e) {
  return e === "true";
}
function Os(e) {
  return e !== "false";
}
function Ka() {
  try {
    return Os(window.localStorage.getItem(ja));
  } catch {
    return !0;
  }
}
function za(e) {
  try {
    window.localStorage.setItem(ja, String(!!e));
  } catch {
  }
}
function Ls(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function Mt(e = {}) {
  const t = It.filter((g) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(g) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (g, u) => {
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
  return Ls(e || [], o).filter((u) => {
    if (u.reviewState != null && !a.reviewStates.includes(u.reviewState) || s && !s.has(u.id) || a.tagId != null && Number(u.tagId) !== a.tagId || d && !d.has(Number(u.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(u.tagId)) || a.sourceKey != null && u.sourceKey !== a.sourceKey) return !1;
    const f = Number(u.confidence);
    return u.confidence == null || !Number.isFinite(f) ? a.includeUnscored : f >= a.confidenceMin && f <= a.confidenceMax;
  });
}
function Ha(e, t, r, o = !1, i = []) {
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
function Fs(e, t = !1) {
  const r = Mt(e);
  return +(r.reviewStates.length !== It.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function js(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function Bs(e, t, r, o) {
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
function Gs(e, t, r = null) {
  return t === wr ? null : Ga(
    e,
    t ?? r
  );
}
function qa(e, t, r, o = !1) {
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
function Us(e, t, r) {
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
function Ks(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return qa(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function zs(e, t, r = null, o = !1) {
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
      ...Ks(u, s, t, g, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: u
    };
  }
  const d = qa(i, a, t, o);
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
function Hs(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function qs(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function Ho(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function qo(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => Ho(t, o) - Ho(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function _s(e, t, r) {
  var c, g;
  const o = e || [], i = new Set(t || []), a = o.findIndex((u) => (u.markers || []).some(({ segment: f }) => f.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: u }) => u.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const u of o) {
      const f = (u.markers || []).find(({ segment: m }) => !i.has(m.id));
      if (f) return f.segment;
    }
    return null;
  }
  const l = qo(
    o[a].markers,
    s,
    i
  );
  if (l) return l;
  const d = (g = o.map((u, f) => ({ lane: u, index: f })).filter(({ lane: u }) => (u.markers || []).some(({ segment: f }) => !i.has(f.id))).sort((u, f) => Math.abs(u.index - a) - Math.abs(f.index - a) || +(u.index < a) - +(f.index < a) || u.index - f.index)[0]) == null ? void 0 : g.lane;
  return qo(d == null ? void 0 : d.markers, s, i);
}
function Ws(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function Vs(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function _o(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function Js() {
  try {
    return Ps(window.localStorage.getItem(Fa));
  } catch {
    return !1;
  }
}
function Ys(e) {
  try {
    window.localStorage.setItem(Fa, String(!!e));
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
], Qs = /* @__PURE__ */ new Set([
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
function Zs(e) {
  return Qs.has(e);
}
function _a(e) {
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
function Xs(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Qn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(_a).filter(Boolean)]));
  } catch {
    return {};
  }
}
function el(e = {}) {
  const t = Xs(e);
  return Qn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function Wo(e, t = 2) {
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
function lu(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : _a({
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
function Qr(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function Vo(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function cu(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = Vo(e.code, t.key), a = Vo(t.code, e.key);
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
function xn(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function uu(e, t) {
  return [!1, !0].some((r) => xn(e, r) && xn(t, r));
}
function tl(e, t = !1, r = {}) {
  return el(r).find((o) => xn(o, t) && o.bindings.some((i) => Qr(e, i))) || null;
}
function Wa(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function nl(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Wa).join(" / ") : "Unassigned";
}
function mu(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, nl(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function gu(e) {
  return e === "review" ? "review" : "editor";
}
function Ye(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function rl(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function ol(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function al(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => Ye(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: Ye(t, e.activeIdentity) || r[0]
  };
}
function il(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function pu(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => il(o, i))));
}
function Jo(e, t) {
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
function sl(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function ll(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function dl(e, t, r) {
  return e != null && (r == null || t !== r);
}
function cl(e, t, r, o = null) {
  if (r === t.tagId) return null;
  const i = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: r,
    tagName: o || ((i == null ? void 0 : i.tagId) === r ? i.tagName : null)
  };
}
function ul({ tagEditing: e, selectedSegmentIds: t, activeSegmentId: r }, o) {
  return !(e && r === o && (t == null ? void 0 : t.length) === 1 && t[0] === o);
}
function Zr(e, t) {
  return e === t;
}
function ml(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function gl(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - Vn).at(-1) || null : o.find((i) => i.startSec > t + Vn) || null;
}
function qn(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function Yo(e) {
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
function fu(e, t = null, r = !1) {
  const o = Yo(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function hn(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function Va(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: hn(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: hn(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: hn(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(hn(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(hn(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(hn(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...ao };
  }
}
function pl(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function Ja() {
  try {
    return Va(window.localStorage.getItem(Oa));
  } catch {
    return { ...ao };
  }
}
function Qo(e) {
  const t = Va(JSON.stringify(e));
  try {
    window.localStorage.setItem(Oa, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Ht = Object.freeze({
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
function Ya(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? Xr(e.requestedMode) : "basic",
    effectiveMode: i ? Xr(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function Sn(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function fl(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function yl(e) {
  const t = [];
  return Sn(e, Ht.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), Sn(e, Ht.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function bl(e) {
  return [
    ["general", "General", Ht.settingsGeneral],
    ["shortcuts", "Shortcuts", Ht.settingsShortcuts],
    ["performer-slots", "Performer slots", Ht.settingsPerformerSlots],
    ["derivation", "Derivation", Ht.settingsDerivation]
  ].filter(([, , r]) => Sn(e, r)).map(([r, o]) => [r, o]);
}
function hl(e, t) {
  return e === "segments" && !Sn(
    t,
    Ht.navigationSegmentInventory
  ) || e === "bin" && !Sn(
    t,
    Ht.recyclingBinView
  ) ? "videos" : e;
}
function vl(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function xl(e, t = 0) {
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
}, Zo = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: It.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function Sl(e) {
  const t = String(e || "").split(",").filter((r) => It.includes(r));
  return t.length === 0 ? [...It] : [...new Set(t)];
}
function vn(e) {
  return Qa(e).values;
}
function Qa(e) {
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
function Xo(e, t) {
  var l;
  const r = ea(t.activitiesCriterion, t.activityId), o = ea(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = Qa(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: kl(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function ea(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function kl(e, t) {
  return It.includes(e == null ? void 0 : e.value) ? [e.value] : Sl(t);
}
function Za(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function wl(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Nl(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function ta(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Il(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function st(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function lo(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function _r(e, t) {
  const r = new Set(lo(t).map((o) => String(st(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function Zt(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function na(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(Zt).sort().join(",")}`;
}
function Xa(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((m) => String(m.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((m) => {
    var p;
    return !((p = m.genderHints) != null && p.length);
  }) && e.length === t.length && !i) {
    const m = [...e].sort((y, b) => String(y.slotDefinitionId).localeCompare(String(b.slotDefinitionId))), p = [...t].sort((y, b) => String(y.name).localeCompare(String(b.name)) || Number(st(y)) - Number(st(b)));
    return [{
      assignments: Object.fromEntries(m.map((y, b) => [String(y.slotDefinitionId), String(st(p[b]))])),
      description: p.map((y) => y.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((m) => t.map((p, y) => ({ performer: p, index: y })).filter(({ performer: p }) => {
    var y;
    return !((y = m.genderHints) != null && y.length) || m.genderHints.some((b) => Zt(b) === Zt(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), g = i ? c.filter((m) => m.length > 0).length : ra(c, t.length);
  if (g === 0) return [];
  const u = new Map(t.map((m, p) => [String(st(m)), p]));
  function f(m, p, y) {
    if (s.length >= a) return;
    const b = c.slice(m), I = i ? b.filter(($) => $.length > 0).length : ra(b.map(($) => $.filter((A) => !p.has(String(st(t[A]))))), t.length);
    if (y + I < g) return;
    if (m === e.length) {
      if (y !== g) return;
      const $ = Object.fromEntries(d.map(({ slot: C, performer: S }) => [String(C.slotDefinitionId), S ? String(st(S)) : ""])), A = o.length === 0 ? Object.values($).sort().join(",") : [...new Set(e.map((C) => String(C.label || "")))].map((C) => `${C}:${d.filter(({ slot: S }) => String(S.label || "") === C).map(({ performer: S }) => S ? String(st(S)) : "").sort().join(",")}`).join("|");
      !l.has(A) && s.length < a && (l.add(A), s.push({
        assignments: $,
        description: d.map(({ slot: C, performer: S }) => o.length ? `${C.label}: ${(S == null ? void 0 : S.name) || "Unassigned"}` : (S == null ? void 0 : S.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const x = e[m], K = [...d].reverse().find(({ slot: $ }) => na($) === na(x)), L = K ? u.get(String(st(K.performer))) : -1;
    for (const $ of c[m]) {
      const A = t[$], C = st(A);
      if (!($ < L) && !(C == null || !i && p.has(String(C))) && (d.push({ slot: x, performer: A }), i || p.add(String(C)), f(m + 1, p, y + 1), i || p.delete(String(C)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: x, performer: null }), f(m + 1, p, y), d.pop();
  }
  return f(0, /* @__PURE__ */ new Set(), 0), s;
}
function ra(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Cl(e, t) {
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
      !o && d.has(u.performerId) || (g = c.genderHints) != null && g.length && !c.genderHints.some((f) => Zt(f) === Zt(u.gender)) || (a.push({ slot: c, performer: u }), o || d.add(u.performerId), s(l + 1, d), o || d.delete(u.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function $l(e) {
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
function Tl(e, t, r = 20) {
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
function Al(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function Rl(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function ei(e, t, r) {
  const o = st, i = new Set((t || []).map(o)), a = new Set((r || []).map(Zt));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const u = Zt(l.gender || l.genderIdentity), f = Zt(d.gender || d.genderIdentity), m = l.matchesGenderHint ?? a.has(u);
    return (d.matchesGenderHint ?? a.has(f)) - m || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: pe, useId: ti, useLayoutEffect: Ml, useMemo: Ge, useReducer: El, useRef: ge, useState: F, useSyncExternalStore: Dl } = ro, n = ro.createElement, ni = "/api/plugins/segment-studio";
function je(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(cn) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = eo();
    return t[e] = r, window.localStorage.setItem(cn, JSON.stringify(t)), r;
  } catch {
    return eo();
  }
}
function Be(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(cn) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(cn, JSON.stringify(t));
  } catch {
  }
}
function co(e) {
  try {
    return JSON.parse(window.localStorage.getItem(cn) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function uo(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(cn) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(cn, JSON.stringify(t));
  } catch {
  }
}
function Pl(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function Ol(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function ee(e, t, r = 0) {
  var d;
  const o = await Ca(`${ni}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Pl(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await Ol(250 * (r + 1), t == null ? void 0 : t.signal), ee(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function Ll(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${ni}${e}`, o = await Ca(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: Fl(
      o.headers.get("Content-Disposition")
    )
  };
}
function Fl(e, t = "segment-studio-ai-feedback.zip") {
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
function eo() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function ri(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function jl(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function oi(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function Bl(e, t) {
  const { sceneCount: r, segmentCount: o } = oi(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function ai(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = oi(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(Bl(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await ee("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: je(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return Be(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function oa({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const Lt = {
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
    ...(Lt[e] || Lt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function ii(e) {
  return { ...(Lt[e] || Lt.unreviewed).badge };
}
function si(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const li = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function Gl(e, t, r = "not-applicable", o = !1) {
  const i = Lt[e] || Lt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Ul(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Kl(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function zl(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function Hl(e, t) {
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
function ql(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function un({ state: e, includeLabel: t = !0 }) {
  const r = Lt[e] || Lt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: ii(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function _l(e, t = null) {
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
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function Wl(e, t = document) {
  return !(e.defaultPrevented || _l(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function hu(e, t = document, r = !1, o = {}) {
  return Wl(e, t) ? tl(e, r, o) != null : !1;
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
function Vl(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function Jl({ confirm: e, cancel: t, confirmReady: r }) {
  const o = r && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function mo({ confirmRef: e, cancelRef: t, confirmReady: r }) {
  pe(() => {
    const o = requestAnimationFrame(() => Jl({
      confirm: e.current,
      cancel: t == null ? void 0 : t.current,
      confirmReady: r
    }));
    return () => cancelAnimationFrame(o);
  }, [r]);
}
function Ut(e) {
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
function Yl(e, t) {
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
function gr(e, t = !0) {
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
function pr(e, t) {
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
function di(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function ci(e) {
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
function Ql(e, t) {
  const r = (t || []).map((i) => di(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: Ct(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function Zl(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : Ql(e, t);
}
function Xl({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function vu(e, t) {
  return po(di(e, t));
}
function Ct(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function ed(e, t) {
  const r = (d) => Ct(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
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
function td(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = ed(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function nd(e) {
  const t = Ct(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map($r).filter(Boolean);
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
function aa(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((g) => g.end <= s && g.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: Ir(o),
    trackCount: Math.max(1, t.length)
  };
}
function rd(e) {
  const t = e.map(Ct), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function od(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], g = d.length > 0 && d.every((u) => Number(u.performerId) > 0) ? d.map((u) => `${u.slotDefinitionId}:${Number(u.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: g };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [aa({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = rd(l.slots), g = l.slots.filter((y) => !a.has(String(y.slotDefinitionId))), u = o.length === 1 ? l.slots : g, f = u.map((y) => `${c.get(String(y.slotDefinitionId))} · ${y.performerName || `Performer ${y.performerId}`}`).join(" · "), m = [...new Map(u.map((y) => [
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
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(aa);
}
function dn(e, t = [], r = []) {
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => od(s, a));
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
    for (const s of It)
      a.counts[s] += Number((r = o.counts) == null ? void 0 : r[s]) || 0;
  }
  return t;
}
const ad = {
  group: 38,
  lane: 33,
  segment: 41
};
function id(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = ad[s.kind];
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
function ui(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function sd(e, t = [], r = !0) {
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
function ld(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: Ir(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return fo(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: Ir(a)
    };
  });
}
function mi(e, { nativeOnly: t = !1 } = {}) {
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
function ia(e, t) {
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
function en(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function Jn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function dd(e) {
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
    }, o ? dd(e.name) : "—"),
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
function gi({ assignments: e, className: t = "" }) {
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
function Tr({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = ge(null), i = `performer-slots-${ti()}`, [a, s] = F(null);
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
    a ? ms(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(gi, {
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
function cd(e, t) {
  const r = new Set(en(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function pi(e, t) {
  return t ? en(e).filter((r) => r !== t) : en(e);
}
function ud(e, t) {
  const r = en(t), o = new Set(en(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function Ot(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function sa(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), g = Number.isFinite(c) && c >= d ? c : d, u = d <= o && g >= o, f = u ? 0 : Math.min(Math.abs(o - d), Math.abs(o - g));
    return { contains: u, distance: f, duration: g - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function to(e, t, r, o = null) {
  var g, u, f, m, p, y;
  const i = e.findIndex((b) => b.markers.some((I) => I.segment.id === t));
  if (i < 0) {
    const b = [...((g = e[0]) == null ? void 0 : g.markers) || []];
    return o != null && Number.isFinite(Number(o)) && b.sort((I, x) => sa(I, x, o)), ((u = b[0]) == null ? void 0 : u.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((b) => b.segment.id === t);
  if (r === "left" || r === "right") {
    const b = r === "left" ? -1 : 1, I = Math.min(a.markers.length - 1, Math.max(0, s + b));
    return ((f = a.markers[I]) == null ? void 0 : f.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((m = a.markers[s]) == null ? void 0 : m.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((p = a.markers[s]) == null ? void 0 : p.segment) ?? null : ((y = [...e[l].markers].sort(c ? (b, I) => sa(b, I, Number(o)) : (b, I) => Math.abs(b.segment.startSec - d) - Math.abs(I.segment.startSec - d) || b.segment.startSec - I.segment.startSec || b.segment.id - I.segment.id)[0]) == null ? void 0 : y.segment) ?? null;
}
function md(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = to([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function gd(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function pd(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function fd(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [ca(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => ca(Math.min(s, r + l))))];
}
function yd(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function bd(e, t) {
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
function la(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function hd(e) {
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
async function vd(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await da(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], g = fd(
        d.startSec,
        d.endSec
      );
      for (const [u, f] of g.entries()) {
        Math.abs(r.currentTime - f) > 5e-4 && (r.currentTime = f, await da(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const m = await xd(o), p = `example-${l + 1}-frame-${u + 1}`;
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
function da(e, t) {
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
function xd(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function ca(e) {
  return Math.round(e * 1e3) / 1e3;
}
function xu(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Sd(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function kd(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function wd(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Nd(e, t) {
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
function Id(e, t) {
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
function kn(e, t) {
  return !e || !t ? !1 : e.itemId != null && e.itemId === t.itemId || e.nativeSegmentId != null && e.nativeSegmentId === t.nativeSegmentId ? !0 : e.id != null && e.id === t.id;
}
function fi(e, t) {
  return (e || []).some((r) => (t || []).some((o) => kn(r, o)));
}
function Gt(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function yi(e, t) {
  return (e || []).find((r) => kn(t, r)) || null;
}
function bi(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Cd(e, t) {
  var r;
  return ((r = e.running) == null ? void 0 : r.kind) === t;
}
function Su(e) {
  return e.running != null || e.queued.length > 0;
}
const ua = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
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
function $d({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let r = 1, o = null, i = [], a = null, s = !1, l = ua;
  const d = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Set();
  let g = [];
  function u() {
    l = o == null && i.length === 0 && a == null ? ua : Object.freeze({
      running: o ? fr(o) : null,
      queued: Object.freeze(i.map(fr)),
      lastFailure: a
    });
    for (const $ of [...c]) $();
    if (o == null && i.length === 0) {
      const $ = g;
      g = [];
      for (const A of $) A();
    }
  }
  function f($, A) {
    d.set($.id, A.status), $.resolve(A);
  }
  function m($) {
    if ($.dependsOn == null) return "met";
    const A = d.get($.dependsOn);
    return A === "fulfilled" ? "met" : A != null ? "failed" : "pending";
  }
  function p($) {
    o = $;
    const A = { ...e(), taskId: $.id, targets: $.targets };
    A.resolveTargets = () => $.targets.map((S) => yi(A.segments, S)).filter(Boolean), u();
    let C;
    try {
      C = $.run(A);
    } catch (S) {
      C = Promise.reject(S);
    }
    Promise.resolve(C).then(
      (S) => y($, { status: "fulfilled", value: S }),
      (S) => y($, { status: "rejected", error: S })
    );
  }
  function y($, A) {
    $.settled || ($.settled = !0, f($, A), !s && (o = null, A.status === "rejected" && (a = Object.freeze({ id: $.id, kind: $.kind, error: A.error })), u(), t && b()));
  }
  function b() {
    if (s || o != null) return;
    let $ = !1;
    for (let A = 0; A < i.length; A += 1) {
      const C = i[A], S = m(C);
      if (S === "failed") {
        i = i.filter((w) => w !== C), f(C, { status: "dropped", reason: "dependency-failed" }), $ = !0, A -= 1;
        continue;
      }
      if (S !== "pending" && !(C.exclusive && A > 0) && !i.slice(0, A).some((w) => fi(w.targets, C.targets)) && !(C.ready && !C.ready(e(), fr(C)))) {
        i = i.filter((w) => w !== C), p(C);
        return;
      }
    }
    $ && u();
  }
  function I($) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((E) => E.exclusive) || o != null && $.whenBusy !== "enqueue") return null;
    let C;
    const S = new Promise((E) => {
      C = E;
    }), w = {
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
      resolve: C
    };
    return i = [...i, w], u(), b(), { id: w.id, done: S };
  }
  function x($ = {}) {
    let A = null;
    const C = I({
      ...$,
      whenBusy: "reject",
      run: () => new Promise((w) => {
        A = w;
      })
    });
    if (!C) return null;
    if (A == null)
      return L((w) => w.id === C.id), null;
    let S = !1;
    return () => {
      S || (S = !0, A(), (o == null ? void 0 : o.id) === C.id && y(o, { status: "fulfilled", value: void 0 }));
    };
  }
  function K($, A) {
    let C = !1;
    for (const S of i)
      S.targets.some((w) => w.id === $ && w.itemId == null && w.nativeSegmentId == null) && (S.targets = Object.freeze(S.targets.map((w) => w.id === $ ? { ...A } : w)), C = !0);
    return C && u(), C;
  }
  function L($) {
    const A = i.filter((C) => $(fr(C)));
    if (A.length === 0) return 0;
    i = i.filter((C) => !A.includes(C));
    for (const C of A) f(C, { status: "cancelled" });
    return u(), b(), A.length;
  }
  return {
    enqueue: I,
    acquire: x,
    cancel: L,
    retarget: K,
    poke: b,
    subscribe($) {
      return c.add($), () => c.delete($);
    },
    getSnapshot: () => l,
    whenIdle() {
      return o == null && i.length === 0 ? Promise.resolve() : new Promise(($) => g.push($));
    },
    dispose() {
      if (s) return;
      const $ = i;
      i = [], s = !0;
      for (const C of $) f(C, { status: "cancelled" });
      c.clear();
      const A = g;
      g = [];
      for (const C of A) C();
    }
  };
}
let Td = 1;
function Qt() {
  return `pending-${Td++}`;
}
function Ad(e) {
  return e.sort((t, r) => t.startSec - r.startSec || t.id - r.id);
}
function xr(e, t) {
  return (t || []).some((r) => kn(r, e));
}
function Rd(e, t) {
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
function hi(e, t) {
  return t && (e || []).find((r) => {
    var o;
    return ((o = r.meta) == null ? void 0 : o.kind) === "held-tag" && !r.settled && xr(t, r.targets);
  }) || null;
}
function Md(e) {
  return (e || []).filter((t) => t.op === "insert" && !t.settled).map((t) => t.segment);
}
function vi(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function Ed(e, t) {
  const r = (e || []).filter((o) => !vi(o, t));
  return r.length === (e || []).length ? e : r;
}
function Dd(e, t) {
  let r = !1;
  const o = (e || []).map((i) => i.settled || !vi(i, t) ? i : (r = !0, { ...i, settled: !0, settledDetail: null }));
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
      r.some((i) => kn(o.segment, i)) || r.push(o.segment);
    else if (o.op === "patch")
      r = r.map((i) => xr(i, o.targets) ? { ...i, ...o.values } : i);
    else if (o.op === "remove")
      r = r.filter((i) => !xr(i, o.targets));
    else if (o.op === "merge") {
      const [i, ...a] = o.targets;
      r = r.filter((s) => !xr(s, a)).map((s) => kn(i, s) ? { ...s, ...o.values } : s);
    }
  return Ad(r);
}
function xi(e, t) {
  if (!e || e.length === 0) return e;
  const r = [
    ...(t == null ? void 0 : t.segments) || [],
    ...e.filter((a) => a.op === "insert" && !a.settled).map((a) => a.segment)
  ];
  let o = !1;
  const i = [];
  for (const a of e) {
    if (a.op !== "insert" && !a.targets.some((s) => r.some((l) => kn(s, l)))) {
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
function Ld(e, t) {
  switch (t.type) {
    case "add":
      return Rd(e, t.entry);
    case "discard":
      return Ed(e, t.key);
    case "settle":
      return Dd(e, t.key);
    case "retarget":
      return Pd(e, t.temporaryId, t.identity);
    case "prune":
      return xi(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
function ma(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function Fd(e) {
  const { acquireSaveLock: t, compatibilityMode: r, dispatchPendingChanges: o, enqueueSave: i, pendingChanges: a, retargetSaveTasks: s, currentTime: l, detail: d, editorFilters: c, endInput: g, hideDerivedSegments: u, historyRef: f, mediaDuration: m, onConflict: p, onDetailChange: y, onReload: b, optimisticSegmentIdRef: I, pendingDuplicateRef: x, pendingFirstSegmentStartSecRef: K, pendingTagEditSegmentIdRef: L, replaceSegmentSelection: $, savingSegmentId: A, segments: C, selectedSegment: S, selectedSegmentIdRef: w, selectedSegments: E, selectionAnchorIdRef: z, selectionRangeBaseIdsRef: ae, setCreatingSegmentId: O, setEditorFilters: D, setFirstSegmentTagOpen: M, setHideDerivedSegments: q, setHistory: se, setHistoryOpen: ie, setPublishApprovedError: xe, setSaveMessage: J, setSelectedSegmentGroupKey: Y, setSelectedSegmentId: oe, setSelectedSegmentIds: Q, setTagEditing: ve, startInput: fe, tagEditingRef: be, timelineDuration: re, video: ue } = e;
  function ne(G) {
    f.current = G || zt, se(f.current);
  }
  async function Z(G, W, _, j, B = null) {
    var U;
    try {
      const te = await ee(`/videos/${ue.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: f.current.revision,
          kind: G,
          label: W,
          beforeState: _,
          afterState: j,
          receiptId: B
        })
      });
      return ne(te), !0;
    } catch (te) {
      return te.status === 409 && ((U = te.payload) != null && U.current) && ne(te.payload.current), J("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function le(G, W, _ = !0, j = null, B = !1, U = W, te = !0) {
    if (!G || A != null) return null;
    const Ce = t("segment", G.id);
    if (!Ce) return null;
    try {
      return await V(G, W, {
        recordHistory: _,
        historyLabel: j,
        optimisticValues: B ? U : null,
        restoreSelectionOnFailure: te
      });
    } finally {
      Ce();
    }
  }
  async function V(G, W, {
    recordHistory: _ = !0,
    historyLabel: j = null,
    optimisticValues: B = null,
    pendingChangeId: U = null,
    restoreSelectionOnFailure: te = !0,
    onReload: Ce = b,
    onConflict: he = p
  } = {}) {
    var bt;
    const Qe = E.map((Ze) => Ze.id), Pe = w.current, $e = _ && !r ? crypto.randomUUID() : null;
    J(_ ? "Saving directly to Cove…" : "Restoring history…");
    const ze = U ?? (B ? Qt() : null);
    B && !U && o({
      type: "add",
      entry: { id: ze, op: "patch", targets: [Gt(G)], values: B }
    });
    const ut = () => {
      ze && o({ type: "settle", key: ze });
    };
    try {
      if (r && G.nativeSegmentId == null && G.itemId != null) {
        const nt = `draft-update:${ue.id}:${G.itemId}:${G.revision}:${W.tagId}:${W.startSec}:${W.endSec ?? "open"}:${W.reviewState ?? G.reviewState}`, dt = await ee(`/videos/${ue.id}/drafts/${G.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(nt),
            expectedRevision: G.revision,
            startSec: W.startSec,
            endSec: W.endSec,
            tagId: W.tagId,
            reviewState: W.reviewState
          })
        });
        Be(nt);
        const rt = {
          ...G,
          ...dt.draft,
          id: G.id,
          itemId: G.itemId
        };
        return _ && await Z(
          "segment.update",
          j || "Changed segment",
          gr(G, r),
          gr(
            rt,
            r
          )
        ), ma(G, W, r) ? await Ce() : y((ct) => ({
          ...ct,
          approvedSetVersion: dt.approvedSetVersion || ct.approvedSetVersion,
          segments: (ct.segments || []).map((He) => He.id === G.id ? rt : He).sort((He, ht) => He.startSec - ht.startSec || He.id - ht.id)
        }), ue.id), ut(), J(((bt = dt.draft) == null ? void 0 : bt.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), rt;
      }
      const Ze = await ee(`/videos/${ue.id}/segments/${G.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...W,
          expectedUpdatedAt: G.updatedAt,
          historyReceiptId: $e
        })
      }), mt = {
        ...G,
        ...Ze,
        reviewState: W.reviewState ?? G.reviewState
      };
      return ma(G, W, r) ? await Ce() : y((nt) => ({
        ...nt,
        segments: (nt.segments || []).map((dt) => dt.id === G.id ? mt : dt).sort((dt, rt) => dt.startSec - rt.startSec || dt.id - rt.id)
      }), ue.id), ut(), _ && await Z(
        "segment.update",
        j || "Changed segment",
        gr(G, r),
        gr(
          mt,
          r
        ),
        $e
      ), J(_ ? "Saved to Cove" : "History restored"), mt;
    } catch (Ze) {
      return ze && o({ type: "discard", key: ze }), ze && te && (Q(Qe), oe(Pe), z.current = Pe, ae.current = []), Ze.status === 409 ? (J("Conflict — loading the latest segment…"), await he()) : J(Ze.message || "Unable to save the segment."), null;
    }
  }
  async function T() {
    if (!r) return !1;
    const G = C.filter((j) => !j.published && j.reviewState === "approved").length;
    if (G === 0 || A != null) return !1;
    const W = `complete-review:${ue.id}:${d.approvedSetVersion}`, _ = t("publish", -1);
    if (!_) return !1;
    xe(""), J(`Publishing ${G} Approved draft${G === 1 ? "" : "s"}…`);
    try {
      const j = await ee(`/videos/${ue.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(W),
          expectedApprovedSetVersion: d.approvedSetVersion
        })
      });
      Be(W), ne(zt), ie(!1);
      const B = await b(), U = ml(
        C,
        w.current,
        j.published
      ), te = U ? Ye(B == null ? void 0 : B.segments, U) : null;
      return te && oe(te.id), J(`${j.published.length} Approved draft${j.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (j) {
      const B = j.status === 409 ? "The approved drafts changed. Review the updated list and try again." : j.message || "Unable to publish the approved drafts.";
      return j.status === 409 && await p(), xe(B), J(B), !1;
    } finally {
      _();
    }
  }
  async function R(G = null, W = null) {
    if (A != null || h()) return;
    const _ = G != null ? K.current : null, j = Number.isFinite(_) ? _ : l, B = Math.min(re, j + 20);
    if (B <= j) {
      J("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const U = ll(C, S, G);
    if (U.kind === "choose-tag") {
      K.current = j, J(""), M(!0);
      return;
    }
    if (U.kind === "invalid-selection") {
      J("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: te } = U, Ce = `create-draft:${ue.id}:${te}:${j}`, he = r ? null : crypto.randomUUID(), Qe = w.current, Pe = {
      ...S || {},
      id: I.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: te,
      tagName: W || (S == null ? void 0 : S.tagName) || "Tag segment",
      tagSortName: te === (S == null ? void 0 : S.tagId) && (S == null ? void 0 : S.tagSortName) || null,
      startSec: j,
      endSec: B,
      // Full mode creates manual drafts already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, $e = Sd(d, Pe), ze = Ot(
      dn($e.segments, $e.segmentGroups || [], $e.performerSlots || []),
      Pe.id
    ), ut = i({
      kind: "create",
      lockId: -1,
      run: (Ze) => bt(Ze)
    });
    if (!ut) return;
    await ut.done;
    async function bt({ onReload: Ze, taskId: mt }) {
      var dt;
      const nt = Qt();
      o({ type: "add", entry: { id: nt, taskId: mt, op: "insert", segment: Pe } }), M(!1), U.openTagEditor && (O(Pe.id), L.current = Pe.id, ve(!0)), $(Pe.id), Y(ze);
      try {
        let rt;
        if (r) {
          const ht = await ee(`/videos/${ue.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: je(Ce), tagId: te, startSec: j, endSec: B })
          });
          Be(Ce), rt = { itemId: (dt = ht.draft) == null ? void 0 : dt.itemId };
        } else
          rt = { nativeSegmentId: (await ee(`/videos/${ue.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: te,
              startSec: j,
              endSec: B,
              historyReceiptId: he
            })
          })).id };
        K.current = null, M(!1);
        const ct = await Ze();
        if (o({ type: "discard", key: nt }), !ct) {
          $(Qe), J(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${U.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const He = Ye(ct == null ? void 0 : ct.segments, rt);
        He ? (o({ type: "retarget", temporaryId: Pe.id, identity: Gt(He) }), s(Pe.id, Gt(He)), U.openTagEditor && (be.current && (L.current = He.id), O(He.id)), $(He.id), Y(Ot(
          dn(ct.segments || [], ct.segmentGroups || [], ct.performerSlots || []),
          He.id
        )), r || await Z(
          "segment.create",
          "Created segment",
          Rt([], !1),
          Rt([He], !1),
          he
        )) : (ve(!1), J(`Segment created, but it could not be selected${U.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (rt) {
        throw o({ type: "discard", key: nt }), $(Qe), G != null && M(!0), J(rt.message || "Unable to create the draft."), rt;
      } finally {
        O(null);
      }
    }
  }
  function h() {
    return hi(a, S) ? (J("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function v() {
    if (E.length !== 1 || !S || A != null || h()) return;
    const G = l;
    if (G <= S.startSec || S.endSec != null && G >= S.endSec) {
      J("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const W = `split-draft:${S.itemId}:${S.revision}:${G}`, _ = r ? null : Rt([S], !1), j = r ? null : crypto.randomUUID(), B = t("split", S.id);
    if (B)
      try {
        let U = null;
        r && S.nativeSegmentId == null ? (await ee(`/videos/${ue.id}/drafts/${S.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(W),
            expectedRevision: S.revision,
            splitSec: G
          })
        }), Be(W)) : U = { nativeSegmentId: (await ee(`/videos/${ue.id}/segments/${S.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: S.updatedAt,
            splitSec: G,
            historyReceiptId: j
          })
        })).id };
        const te = await b();
        if (!r) {
          const Ce = [
            Ye(te == null ? void 0 : te.segments, {
              nativeSegmentId: S.nativeSegmentId ?? S.id
            }),
            Ye(
              te == null ? void 0 : te.segments,
              U
            )
          ].filter(Boolean);
          await Z(
            "segment.split",
            "Split segment",
            _,
            Rt(Ce, !1),
            j
          );
        }
        J(r ? `Segment split; both ranges remain ${S.reviewState}.` : "Segment split.");
      } catch (U) {
        U.status === 409 ? await p() : J(U.message || "Unable to split the draft.");
      } finally {
        B();
      }
  }
  async function k(G = !1) {
    var U, te;
    if (E.length !== 1 || !S || A != null || h()) return;
    const W = G ? l : S.startSec, _ = sl(ue.id, S, G, W), j = r ? null : crypto.randomUUID(), B = t("duplicate", S.id);
    if (B)
      try {
        const Ce = ((U = x.current) == null ? void 0 : U.operationKey) === _ ? x.current : null;
        let he = (Ce == null ? void 0 : Ce.duplicateIdentity) ?? null;
        if (he == null && r && S.nativeSegmentId == null) {
          const $e = await ee(`/videos/${ue.id}/drafts/${S.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(_),
              expectedRevision: S.revision,
              startSec: G ? W : null
            })
          });
          he = Jo(!1, $e), x.current = { operationKey: _, duplicateIdentity: he };
        } else if (he == null) {
          const $e = await ee(`/videos/${ue.id}/segments/${S.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: S.updatedAt,
              startSec: G ? W : null,
              historyReceiptId: j
            })
          });
          he = Jo(!0, $e), x.current = { operationKey: _, duplicateIdentity: he };
        }
        const Qe = await b(), Pe = Ye(Qe == null ? void 0 : Qe.segments, he);
        if (Pe) {
          r || await Z(
            "segment.duplicate",
            "Duplicated segment",
            Rt([], !1),
            Rt([Pe], !1),
            j
          );
          const $e = Ha(
            Pe,
            Qe.performerSlots || [],
            c,
            u,
            Qe.segmentGroups || []
          );
          D($e.filters), q($e.hideDerivedSegments), Q([Pe.id]), oe(Pe.id), z.current = Pe.id, ae.current = [], Y(Ot(
            dn(Qe.segments || [], Qe.segmentGroups || [], Qe.performerSlots || []),
            Pe.id
          )), r && S.nativeSegmentId == null && Be(_), x.current = null, J(G ? "Duplicate created at the playhead." : "Duplicate created in place.");
        } else
          J("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
      } catch (Ce) {
        ((te = x.current) == null ? void 0 : te.operationKey) === _ ? J("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : Ce.status === 409 ? await p() : J(Ce.message || "Unable to duplicate the draft.");
      } finally {
        B();
      }
  }
  async function H() {
    if (E.length !== 1 || !S) return;
    const G = Number(fe), W = g.trim() === "" ? null : Number(g), _ = Ko(G, W, m);
    if (_.error) {
      J(_.error);
      return;
    }
    if (G === S.startSec && W === S.endSec) {
      J("Timing is unchanged.");
      return;
    }
    await le(S, { startSec: G, endSec: W, tagId: S.tagId }, !0, null, !0);
  }
  async function me(G, W) {
    if (E.length !== 1 || !S) return;
    const _ = Ko(G, W, m);
    if (_.error) {
      J(_.error);
      return;
    }
    if (G === S.startSec && W === S.endSec) {
      J("Timing is unchanged.");
      return;
    }
    await le(S, { startSec: G, endSec: W, tagId: S.tagId }, !0, null, !0);
  }
  return { acceptHistory: ne, recordHistoryAction: Z, mutateSegment: le, runSegmentMutation: V, completeReview: T, createSegment: R, splitSegment: v, duplicateSegment: k, saveTiming: H, applyShortcutTiming: me };
}
function jd() {
  const [e, t] = F(() => typeof window < "u" && window.matchMedia(Bo).matches);
  return pe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Bo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Bd() {
  const [e, t] = F(() => typeof window < "u" && window.matchMedia(Go).matches);
  return pe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Go), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Gd() {
  try {
    return Rs(window.localStorage.getItem(Da));
  } catch {
    return { ...Tt };
  }
}
function Ud() {
  try {
    return en(JSON.parse(window.localStorage.getItem(Pa) || "[]"));
  } catch {
    return [];
  }
}
function Kd(e) {
  try {
    window.localStorage.setItem(Pa, JSON.stringify(en(e)));
  } catch {
  }
}
function zd(e) {
  try {
    window.localStorage.setItem(Da, JSON.stringify(e));
  } catch {
  }
}
function Hd() {
  try {
    const e = JSON.parse(window.localStorage.getItem(La) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function qd(e) {
  try {
    return window.localStorage.setItem(La, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function _d({ status: e }) {
  const t = li[e];
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
function Xt({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, It.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...ii(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${Lt[t].symbol}${e[t]}`)));
}
function Wd({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: g, shortcutRef: u }) {
  const f = lo(a), [m, p] = F(() => _r(o, f)), [y, b] = F(!1), [I, x] = F(""), K = ge(!1), L = o.map((E) => `${E.slotDefinitionId}:${E.performerId || ""}`).join("|"), $ = f.map((E) => st(E)).join("|"), A = Xa(
    o,
    f
  );
  pe(() => {
    p(_r(o, f)), x("");
  }, [t, r, L, $]);
  async function C(E = m) {
    if (!K.current) {
      K.current = !0, b(!0), x("Saving performer slots…");
      try {
        const z = _r(o.map((D) => ({
          ...D,
          performerId: E[D.slotDefinitionId] || null
        })), f), ae = o.map((D) => {
          const M = z[D.slotDefinitionId] ? Number(z[D.slotDefinitionId]) : null, q = f.find((se) => String(st(se)) === String(M));
          return {
            ...D,
            performerId: M,
            performerName: (q == null ? void 0 : q.name) || null
          };
        });
        if (s(ae) === !1) {
          x("");
          return;
        }
        const O = await ee(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((D) => ({ slotDefinitionId: D.slotDefinitionId, performerId: z[D.slotDefinitionId] ? Number(z[D.slotDefinitionId]) : null }))
          })
        });
        x("Performer slots saved."), await l(O, {
          beforeState: Nr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: Nr([{
            segmentId: t,
            itemId: r,
            revision: O.revision,
            slots: O.slots || []
          }])
        });
      } catch (z) {
        d && await d(o, z), z.status === 409 ? (x("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : x(z.message || "Unable to save performer slots.");
      } finally {
        K.current = !1, b(!1);
      }
    }
  }
  function S(E, z) {
    x(`Option ${z + 1} applied; save to confirm.`), p({ ...m, ...E.assignments });
  }
  async function w(E) {
    const z = { ...m, ...E.assignments };
    p(z), await C(z);
  }
  return pe(() => {
    if (u)
      return u.current = (E) => K.current || !A[E] ? !1 : (w(A[E]), !0), () => {
        u.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    A.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, A.map((E, z) => n("button", {
        key: z,
        type: "button",
        disabled: y,
        onClick: () => S(E, z),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${z + 1}: ${E.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, z + 1),
        n("span", { key: "description" }, E.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${A.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((E) => n("label", { key: E.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Ct(E)),
      (E.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(E.genderHints || []).map($r).join(" · ")}`) : null,
      n("select", { key: "select", value: m[E.slotDefinitionId] || "", disabled: y, onChange: (z) => p({ ...m, [E.slotDefinitionId]: z.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ei(f, f, E.genderHints).map((z) => n("option", { key: st(z), value: st(z) }, z.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: g, type: "button", disabled: y, onClick: () => C(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, I)])
  ]);
}
function Vd({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a, acquireSaveLock: s = () => () => {
} }) {
  var C;
  const l = ((C = t[0]) == null ? void 0 : C.slots) || [], d = lo(r), c = Xa(
    l,
    d
  ), g = "__mixed__", u = () => Object.fromEntries(l.map((S, w) => {
    const E = t.map((z) => {
      var ae;
      return String(((ae = z.slots[w]) == null ? void 0 : ae.performerId) || "");
    });
    return [S.slotDefinitionId, E.every((z) => z === E[0]) ? E[0] : g];
  })), [f, m] = F(u), [p, y] = F(!1), [b, I] = F(""), x = ge(!1), K = t.map((S) => `${S.itemId ?? `native:${S.segmentId}`}:${S.revision}:${S.slots.map((w) => `${w.slotDefinitionId}:${w.performerId || ""}`).join(",")}`).join("|");
  pe(() => {
    m(u());
  }, [K]);
  async function L(S = f) {
    if (x.current) return;
    const w = s();
    if (!w) {
      I("Wait for the current save to finish before saving performer slots.");
      return;
    }
    x.current = !0, y(!0), I(`Saving performer slots for ${t.length} segments…`);
    const E = [];
    try {
      for (const z of t) {
        const ae = z.slots.map((D, M) => {
          const q = S[l[M].slotDefinitionId];
          return {
            slotDefinitionId: D.slotDefinitionId,
            performerId: q === g ? D.performerId || null : q ? Number(q) : null
          };
        }), O = await ee(z.itemId != null ? `/videos/${e}/drafts/${z.itemId}/slots` : `/videos/${e}/segments/${z.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: z.revision, assignments: ae })
        });
        E.push({
          segmentId: z.segmentId,
          itemId: z.itemId,
          revision: O.revision,
          slots: O.slots || []
        });
      }
      I("Performer slots saved."), await o({
        beforeState: Nr(t),
        afterState: Nr(E)
      });
    } catch (z) {
      const ae = await i();
      z.status === 409 ? I(ae ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : I(z.message || (ae ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      x.current = !1, y(!1), w();
    }
  }
  function $(S, w) {
    I(`Option ${w + 1} applied; save to confirm.`), m({ ...f, ...S.assignments });
  }
  async function A(S) {
    const w = { ...f, ...S.assignments };
    m(w), await L(w);
  }
  return pe(() => {
    if (a)
      return a.current = (S) => x.current || !c[S] ? !1 : (A(c[S]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, c.map((S, w) => n("button", {
        key: w,
        type: "button",
        disabled: p,
        onClick: () => $(S, w),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${w + 1} to all selected segments: ${S.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, w + 1),
        n("span", { key: "description" }, S.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${c.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, l.map((S) => n("label", {
      key: S.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Ct(S)),
      n("select", {
        key: "select",
        value: f[S.slotDefinitionId] || "",
        disabled: p,
        onChange: (w) => m({ ...f, [S.slotDefinitionId]: w.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        f[S.slotDefinitionId] === g ? n("option", { key: "mixed", value: g }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ei(d, d, S.genderHints).map((w) => n("option", {
          key: st(w),
          value: st(w)
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
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, b)
    ])
  ]);
}
function Ft(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function Jd(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return Ft(t);
  const o = [...new Set(r.map((i) => Ft(i.sourceKey, i.sourceDisplayName)))];
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
function Yd({ hidden: e }) {
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
function Qd({ segment: e, provenance: t }) {
  var g;
  const [r, o] = F(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = Jd(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
            Ft(u.sourceKey, u.sourceDisplayName)
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
function Zd({
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
  pe(() => {
    const I = new Set(m);
    f((x) => x.filter((K) => I.has(K)));
  }, [p]);
  const y = Ir(t), b = !!mi(
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
      a ? n(Xt, { key: "counts", counts: y }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      Xl({ mergeable: b, reviewable: a, tagEditable: s, slotsEditable: l })
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
        const K = u.includes(x.key), L = x.markers.some(({ segment: A }) => A.id === r), $ = `selected-segment-lane-${x.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: x.key,
          "data-selected-segment-lane": x.key,
          className: `rounded-md border ${L ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": K,
            "aria-controls": $,
            "aria-current": L ? "true" : void 0,
            onClick: () => f((A) => K ? A.filter((C) => C !== x.key) : [...A, x.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, K ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Jn(x)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(x.selectedCount)),
            a ? n(Xt, { key: "states", counts: x.counts }) : null
          ]),
          K ? n("div", {
            key: "segments",
            id: $,
            className: "space-y-1 border-t border-border p-1.5"
          }, x.markers.map(({ segment: A }) => {
            const C = A.endSec == null ? Ae(A.startSec) : `${Ae(A.startSec)} – ${Ae(A.endSec)}`;
            return n("button", {
              key: A.id,
              type: "button",
              onClick: () => i(A),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${A.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${A.tagName || "Segment"}, ${A.reviewState}, ${C}` : `${A.tagName || "Segment"}, ${C}`,
              "aria-current": A.id === r ? "true" : void 0
            }, [
              a ? n(un, {
                key: "state",
                state: A.reviewState,
                includeLabel: !1
              }) : null,
              A.isDerived ? n(Ar, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, C),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                Ft(A.sourceKey)
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
}, ga = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], pa = [
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
function Si(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function fa(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function br(e, t, r, o = null) {
  const i = fa(t), a = fa(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function Xd(e, t, r = null) {
  var u, f, m;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (u = t.hasSegmentsCriterion) == null ? void 0 : u.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), br(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), br(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), br(o, t.performersCriterion, "performer"), br(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = ya(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = ya(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((f = t.reviewStateCriterion) == null ? void 0 : f.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const g = (m = t.shotBoundariesCriterion) == null ? void 0 : m.value;
  return r && typeof g == "boolean" ? o.set("hasShotBoundaries", String(g)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function ya(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function ec(e, t, r, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((g) => a.add(g));
  } else a.has(r) ? a.delete(r) : a.add(r);
  return a;
}
function ki({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(oa, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, It.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = Lt[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(oa, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function wi({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
function tc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      n(wi, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, gs(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(ki, { item: e, showReviewStates: r }))
    ])
  ]);
}
function nc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n(wi, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
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
        n(ki, { key: "segments", item: e, showReviewStates: r })
      ]),
      n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function yo({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = yl(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => Zn(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && Sn(
        o,
        Ht.recyclingBinView
      ) ? n(Ni, { key: "bin", onNavigate: t }) : null,
      n(Ii, { key: "settings", onNavigate: t })
    ])
  ]);
}
const no = "segment-studio:recycling-bin-changed";
function rc(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function _n() {
  window.dispatchEvent(new CustomEvent(no));
}
function Ni({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = F(null);
  pe(() => {
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
  const i = rc(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => Zn(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function Ii({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => Zn(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function oc({ mode: e, onModeChange: t, disabled: r = !1 }) {
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
function ac({ minimum: e, maximum: t, onChange: r }) {
  const o = ge(null), [i, a] = F("maximum"), s = (f, m) => {
    const p = Bs(e, t, f, m);
    a(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (f, m) => {
    var y;
    const p = (y = o.current) == null ? void 0 : y.getBoundingClientRect();
    p && s(f, js(m.clientX, p.left, p.width));
  }, d = (f, m) => {
    var p, y;
    m.preventDefault(), (y = (p = m.currentTarget).setPointerCapture) == null || y.call(p, m.pointerId), l(f, m);
  }, c = (f, m) => {
    var p, y;
    (y = (p = m.currentTarget).hasPointerCapture) != null && y.call(p, m.pointerId) && l(f, m);
  }, g = (f, m) => {
    const p = f === "minimum" ? e : t, y = f === "minimum" ? 0 : e, b = f === "minimum" ? t : 1, I = m.shiftKey ? 0.1 : 0.01;
    let x = null;
    ["ArrowLeft", "ArrowDown"].includes(m.key) && (x = p - I), ["ArrowRight", "ArrowUp"].includes(m.key) && (x = p + I), m.key === "PageDown" && (x = p - 0.1), m.key === "PageUp" && (x = p + 0.1), m.key === "Home" && (x = y), m.key === "End" && (x = b), x != null && (m.preventDefault(), s(f, Math.min(b, Math.max(y, x))));
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
function ic({ saving: e, error: t, onSelect: r, onClose: o }) {
  const i = ge(null);
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
    onKeyDownCapture: Ut,
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
function sc({
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
  const u = Mt(e), f = [...new Map((a || []).map((b) => [
    Number(b.tagId),
    b.tagName || `Tag ${b.tagId}`
  ])).entries()].sort((b, I) => b[1].localeCompare(I[1]) || b[0] - I[0]), m = (b) => d(Mt({ ...u, ...b })), p = (b) => m({
    reviewStates: u.reviewStates.includes(b) ? u.reviewStates.filter((I) => I !== b) : [...u.reviewStates, b]
  }), y = (b) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${b ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && g();
    },
    onKeyDownCapture: (b) => At(b, { onCancel: g })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: Ut,
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
        n("div", { className: "flex flex-wrap gap-2" }, It.map((b) => {
          const I = u.reviewStates.includes(b), x = Lt[b];
          return n("button", {
            key: b,
            type: "button",
            onClick: () => p(b),
            "aria-pressed": I,
            className: y(I)
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
            onClick: () => m({ performerId: null }),
            "aria-pressed": u.performerId == null,
            className: y(u.performerId == null)
          }, "All performers"),
          ...r.map((b) => {
            const I = Number(st(b));
            return n("button", {
              key: I,
              type: "button",
              onClick: () => m({ performerId: I }),
              "aria-pressed": u.performerId === I,
              className: y(u.performerId === I)
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
            onChange: (b) => m({
              tagId: b.target.value === "" ? null : Number(b.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...f.map(([b, I]) => n("option", { key: b, value: b }, I))
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
            onChange: (b) => m({
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
            onClick: () => m({ sourceKey: null }),
            "aria-pressed": u.sourceKey == null,
            className: y(u.sourceKey == null)
          }, "All provenance"),
          ...o.map((b) => n("button", {
            key: b,
            type: "button",
            onClick: () => m({ sourceKey: b }),
            "aria-pressed": u.sourceKey === b,
            title: b,
            className: y(u.sourceKey === b)
          }, Ft(b)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(ac, {
          minimum: u.confidenceMin,
          maximum: u.confidenceMax,
          onChange: ({ minimum: b, maximum: I }) => m({
            confidenceMin: b,
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
            onChange: (b) => m({
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
        n(Yd, { key: "icon", hidden: t }),
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
function lc({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Qn.filter((l) => xn(l, e)), i = Wo(o, 1)[0], a = Wo(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((g) => n("div", { key: g.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, g.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[g.id] ? t[g.id].length > 0 ? t[g.id] : ["Unassigned"] : g.bindings.map(Wa)).map((u, f) => n("kbd", { key: `${g.id}:${f}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, u))
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
function dc({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = hd(e), [l, d] = F([]), c = s.map((g) => g.tagName).join("|");
  return pe(() => {
    const g = new Set(s.map((u) => u.tagName));
    d((u) => u.filter((f) => g.has(f)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (g) => At(g, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: Ut,
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
            style: { background: Cr(!1) }
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
            const y = `${Ae(p.startSec)}${p.endSec == null ? "" : ` – ${Ae(p.endSec)}`}`, b = r === p.id;
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
                "aria-label": `${b ? "Restoring" : "Restore to review"} ${g.tagName} example at ${y}`,
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
function cc({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = F(""), [a, s] = F(0), l = ge(null), d = Ge(() => Tl(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = Rl(d);
  pe(() => {
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
        Ut(f);
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
      var $;
      const p = f.segment || f, y = p.endSec == null ? Ae(p.startSec) : `${Ae(p.startSec)} – ${Ae(p.endSec)}`, b = `${Ft(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, I = m === c, x = m > 0 ? d[m - 1].groupKey : null, K = g && f.groupKey !== x ? n("div", {
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
        n(un, { key: "review", state: p.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        ($ = f.performers) != null && $.length ? n(Tr, {
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
      return K ? [K, L] : [L];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function uc(e) {
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
function mc({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = Ge(() => uc(e), [e]), [l, d] = F([]), c = s.reduce((m, p) => m + p.drafts.length, 0), g = ge(null);
  mo({ confirmRef: g, cancelRef: o, confirmReady: !t && c > 0 });
  const u = (m) => d((p) => p.includes(m) ? p.filter((y) => y !== m) : [...p, m]), f = (m) => `segment-studio-publish-approved-${m.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && a();
    },
    onKeyDownCapture: (m) => At(m, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: Ut,
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
            style: { background: Cr(!1) }
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
            const b = y.endSec == null ? Ae(y.startSec) : `${Ae(y.startSec)} – ${Ae(y.endSec)}`, I = `${Ft(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`;
            return n("div", { key: y.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(un, { key: "review", state: y.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, b),
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
function gc({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = $l(e), [s, l] = F(() => /* @__PURE__ */ new Set()), [d, c] = F(() => new Set(a.map((y) => y.key))), g = a.flatMap((y) => d.has(y.key) ? y.candidates : []), u = (y) => l((b) => {
    const I = new Set(b);
    return I.has(y) ? I.delete(y) : I.add(y), I;
  }), f = (y) => c((b) => {
    const I = new Set(b);
    return I.has(y) ? I.delete(y) : I.add(y), I;
  }), m = (y) => y.assignment.map(({ slot: b, performer: I }) => `${b.label || `Slot ${b.sortOrder + 1}`}: ${I.name}`).join(", "), p = (y) => `segment-studio-auto-assign-${y.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (y) => {
      y.target === y.currentTarget && !t && i();
    },
    onKeyDownCapture: (y) => {
      y.key === "Enter" && y.target instanceof HTMLInputElement || At(y, {
        onCancel: t ? void 0 : i,
        onConfirm: g.length && !t ? () => o(g) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: Ut,
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
            y.assignment.map(({ slot: b, performer: I }) => {
              const x = b.label || `Slot ${b.sortOrder + 1}`;
              return n("span", {
                key: b.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${x}: ${I.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${x}: ${I.name}`
                }, `${x}: ${I.name}`),
                n(Yn, {
                  key: "avatar",
                  performer: { id: I.performerId, name: I.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(Xt, { key: "states", counts: y.counts }),
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
          y.candidates.map((b) => {
            const I = b.endSec == null ? Ae(b.startSec) : `${Ae(b.startSec)} – ${Ae(b.endSec)}`, x = `${Ft(b.sourceKey)}${b.confidence == null ? "" : ` · ${Math.round(b.confidence * 100)}%`}`;
            return n("div", {
              key: b.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(un, { key: "review", state: b.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                b.tagName || "Tag segment"
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
function pc({ preview: e, onConfirm: t, onClose: r }) {
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
    onKeyDownCapture: Ut,
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
function fc({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = F(!1), d = ge(null);
  if (mo({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Ae(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && a();
    },
    onKeyDownCapture: (g) => At(g, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: Ut,
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
function yc(e) {
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
function bc({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var u, f;
  const l = e ? e.createCount + e.linkCount : 0, d = ge(null);
  mo({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((u = e == null ? void 0 : e.outputs) == null ? void 0 : u.slice(0, 200)) || [], g = yc(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !r && s();
    },
    onKeyDownCapture: (m) => At(m, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: Ut,
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
function hc({
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
  tagSearchRef: b,
  onDetailChange: I,
  setSaveMessage: x,
  acquireSaveLock: K,
  onSlotsChanged: L,
  onRecordHistory: $,
  onCancelQueuedReview: A,
  splitSegment: C,
  duplicateSegment: S,
  provenance: w,
  lineage: E,
  onNavigateLineageItem: z,
  tagEditing: ae,
  onCancelTagEditing: O,
  detailPanelRef: D,
  onReduceSelection: M
}) {
  var be, re, ue, ne;
  const q = ge(null), se = ge(null), ie = () => {
    var Z;
    (Z = se.current) == null || Z.call(se), se.current = null;
  }, xe = ge(null), J = ge(null), Y = ge(null), oe = ge(null), [Q, ve] = F(!1);
  pe(() => {
    q.current && (q.current.scrollTop = 0), ve(!1);
  }, [t == null ? void 0 : t.id]), pe(() => {
    var Z, le;
    Q && ((le = (Z = xe.current) == null ? void 0 : Z.querySelector("input, select, button")) == null || le.focus({ preventScroll: !0 }));
  }, [Q]);
  function fe() {
    ve(!1), requestAnimationFrame(() => {
      var Z;
      return (Z = y.current) == null ? void 0 : Z.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const Z = !r.some((T) => T.isDerived), le = e && g ? Zl(f, r) : null, V = (le == null ? void 0 : le.map((T, R) => {
      var v;
      const h = r[R];
      return {
        segmentId: h.nativeSegmentId,
        itemId: h.published ? null : h.itemId,
        revision: (v = m.performerSlotRevisions) == null ? void 0 : v[h.id],
        slots: T
      };
    })) || [];
    return n(ro.Fragment, null, [
      n(Zd, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: D,
        onReduceSelection: M,
        reviewable: e,
        tagEditable: Z,
        slotsEditable: V.length > 0 && a == null,
        onEditSlots: () => ve(!0),
        slotButtonRef: y,
        saveMessage: i
      }),
      ae && Z ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (T) => {
          T.target === T.currentTarget && O();
        },
        onKeyDownCapture: (T) => At(T, { onCancel: O })
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
        n(Wn, {
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
      Q && V.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (T) => {
          T.target === T.currentTarget && fe();
        },
        onKeyDownCapture: (T) => {
          var h, v;
          if (!(typeof ((h = T.target) == null ? void 0 : h.closest) == "function" ? T.target.closest("input, textarea, select, [contenteditable='true']") : null) && !T.repeat && !T.ctrlKey && !T.altKey && !T.metaKey && !T.shiftKey && /^[1-9]$/.test(T.key) && ((v = oe.current) != null && v.call(oe, Number(T.key) - 1))) {
            T.preventDefault(), T.stopPropagation();
            return;
          }
          At(T, { onCancel: fe });
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
          n("button", { key: "close", type: "button", onClick: fe, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Vd, {
          videoId: p.id,
          targets: V,
          performerCandidates: m.performerCandidates || [],
          shortcutRef: oe,
          acquireSaveLock: () => K("slots", -1),
          onSaved: async ({ beforeState: T, afterState: R }) => {
            await $(
              "performer-slots.assign",
              `Assigned performers to ${V.length} segments`,
              T,
              R
            ), fe(), await L();
          },
          onConflict: L
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (Z) => {
      q.current = Z, D && (D.current = Z);
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
        t != null && t.isDerived ? n(Ar, { key: "derived" }) : null,
        t && ae ? n("div", {
          key: "tag-editor",
          ref: b,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (Z) => {
            Z.key === "Escape" && (Z.preventDefault(), Z.stopPropagation(), O());
          },
          onKeyDown: (Z) => {
            Vl(Z, t.tagName) && (Z.preventDefault(), Z.stopPropagation(), l(t.tagId));
          }
        }, n(Wn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (Z, le) => Z == null ? O() : l(Z, le == null ? void 0 : le.label),
          disabled: dl(a, t.id, s) || ((be = E.data) == null ? void 0 : be.tagReadOnly) === !0,
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
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(_d, { status: c })) : null,
      t && g && u.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(gi, {
        assignments: u.map((Z) => {
          const le = nd(Z);
          return {
            key: String(Z.slotDefinitionId),
            label: le.label,
            performer: le.filled ? { id: Number(Z.performerId), name: le.performer } : null,
            title: le.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(Qd, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: w
    }) : null,
    t ? n("div", { key: "controls", hidden: !0 }, [
      n("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        n("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        E.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : E.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, E.error) : E.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${E.data.derived ? "Derived segment" : "Root segment"} · ${E.data.componentSize} segment${E.data.componentSize === 1 ? "" : "s"} · ${E.data.integrityState}`
          ),
          (re = E.data.parents) != null && re.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...E.data.parents.map((Z) => n("button", {
              key: Z.nodeId,
              type: "button",
              onClick: () => z(Z.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${Z.ruleKey} ${Z.ruleVersion}`))
          ]) : null,
          (ue = E.data.children) != null && ue.length ? n("p", { key: "children" }, `Children: ${E.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: y,
          type: "button",
          disabled: a != null || !g || u.length === 0,
          onClick: () => ve(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: g ? u.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, u.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: C,
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
    Q && e && t && g && u.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (Z) => {
        Z.target === Z.currentTarget && fe();
      },
      onKeyDownCapture: (Z) => {
        var V, T;
        if (!(typeof ((V = Z.target) == null ? void 0 : V.closest) == "function" ? Z.target.closest("input, textarea, select, [contenteditable='true']") : null) && !Z.repeat && !Z.ctrlKey && !Z.altKey && !Z.metaKey && !Z.shiftKey && /^[1-9]$/.test(Z.key) && ((T = Y.current) != null && T.call(Y, Number(Z.key) - 1))) {
          Z.preventDefault(), Z.stopPropagation();
          return;
        }
        At(Z, {
          onCancel: fe,
          onConfirm: () => {
            var R;
            return (R = J.current) == null ? void 0 : R.click();
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
        n("button", { key: "close", type: "button", onClick: fe, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Wd, {
        key: `${t.id}:${m.performerSlotsRevision || m.slotRevision || ""}`,
        videoId: p.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: u,
        revision: (ne = m.performerSlotRevisions) == null ? void 0 : ne[t.id],
        performerCandidates: m.performerCandidates || [],
        confirmRef: J,
        shortcutRef: Y,
        onOptimisticSave: (Z) => {
          I((V) => Wr(
            V,
            t.id,
            Z
          ), p.id);
          const le = K("slots", t.id);
          if (!le)
            return x("Wait for the current save to finish before saving performer slots."), !1;
          se.current = le, x("Saving performer slots…"), fe();
        },
        onSaved: async (Z, { beforeState: le, afterState: V }) => {
          I((T) => Wr(
            T,
            t.id,
            Z.slots || [],
            Z.revision
          ), p.id), x("Performer slots saved.");
          try {
            await $(
              "performer-slots.assign",
              "Assigned performers",
              le,
              V
            ), await L(Z) || A([t]);
          } finally {
            ie();
          }
        },
        onRollback: async (Z, le) => {
          A([t]), I((V) => {
            var T;
            return Wr(
              V,
              t.id,
              Z,
              (T = m.performerSlotRevisions) == null ? void 0 : T[t.id]
            );
          }, p.id), x(le.message || "Unable to save performer slots.");
          try {
            le.status === 409 && await L();
          } finally {
            ie();
          }
        },
        onConflict: L
      }))
    ])) : null
  ]);
}
function vc({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: u, onSelectGroup: f, onToggleGroup: m, onSelect: p, onSelectSegments: y, onSelectAll: b, onConfigureTag: I, onSeekTime: x, centerRef: K, showReviewState: L = !0, swimlaneTitleWidth: $, onSwimlaneTitleWidthChange: A }) {
  const C = ge(null), S = ge(null), [w, E] = F(0), [z, ae] = F({ scrollTop: 0, height: 320 }), [O, D] = F(null), M = Ge(
    () => dn(e, r, o),
    [e, r, o]
  ), q = Ge(
    () => ci(o),
    [o]
  ), se = Ge(() => fo(M), [M]), ie = Ge(
    () => sd(se, i, r.length > 0),
    [se, i, r.length]
  ), xe = Ge(
    () => ui(ie.rows, Math.max(0, z.scrollTop - 24), z.height),
    [ie, z]
  ), J = Math.max(0, Number(d) || 0), Y = As(w), oe = hr($, Y), Q = oe / 16, ve = $s(c, J, Q), fe = ks(J), be = ws(J, Math.max(1, w - Q * 16), g), re = fe.filter((v, k) => k === 0 || k % be === 0), ue = Ge(() => M.map((v) => `${v.key}:${v.trackCount}:${v.markers.map(({ segment: k, track: H }) => `${k.id}:${k.startSec}:${k.endSec ?? ""}:${H}`).join(",")}`).join("|"), [M]);
  function ne() {
    const v = S.current;
    if (!v) return;
    const k = v.querySelector("[data-timeline-track]"), H = v.firstElementChild, me = k == null ? void 0 : k.getBoundingClientRect(), G = H == null ? void 0 : H.getBoundingClientRect(), W = me && G ? Math.max(0, me.left - G.left) : Q * 16, _ = (G == null ? void 0 : G.width) ?? v.scrollWidth;
    v.scrollTo({
      left: Cs(c, J, _, v.clientWidth, W, Ba),
      behavior: "smooth"
    });
  }
  pe(() => (K.current = ne, () => {
    K.current === ne && (K.current = null);
  })), pe(() => {
    ne();
  }, [g]);
  function Z() {
    const v = S.current, k = ie.rows.find((_) => _.kind === "lane" && _.lane.markers.some(({ segment: j }) => j.id === s));
    if (!v || !k) return;
    const H = 24, me = k.top + H, G = me + k.height;
    let W = v.scrollTop;
    me < v.scrollTop + H ? W = Math.max(0, me - H) : G > v.scrollTop + v.clientHeight && (W = Math.max(0, G - v.clientHeight)), W !== v.scrollTop && (v.scrollTop = W), ae({ scrollTop: W, height: v.clientHeight });
  }
  pe(() => {
    Z();
  }, [s, ue, ie]), pe(() => {
    const v = S.current, k = ie.rows.find((_) => _.kind === "group" && _.group.key === a);
    if (!v || !k) return;
    const H = 24, me = k.top + H, G = me + k.height;
    let W = v.scrollTop;
    me < v.scrollTop + H ? W = Math.max(0, me - H) : G > v.scrollTop + v.clientHeight && (W = Math.max(0, G - v.clientHeight)), W !== v.scrollTop && (v.scrollTop = W), ae({ scrollTop: W, height: v.clientHeight });
  }, [a, ie]), pe(() => {
    const v = S.current;
    if (!v || typeof ResizeObserver > "u") return;
    const k = () => {
      E(v.clientWidth), ae({ scrollTop: v.scrollTop, height: v.clientHeight }), Z();
    }, H = new ResizeObserver(k);
    return H.observe(v), k(), () => H.disconnect();
  }, [s, ue, ie]);
  function le(v) {
    if (!(J > 0)) return;
    const k = v.currentTarget.getBoundingClientRect(), H = Math.min(1, Math.max(0, (v.clientX - k.left) / k.width));
    x(H * J);
  }
  function V(v) {
    const k = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let H = null;
    Object.hasOwn(k, v.key) && (H = c + k[v.key]), v.key === "Home" && (H = 0), v.key === "End" && (H = J), H != null && (v.preventDefault(), v.stopPropagation(), x(Math.min(J, Math.max(0, H))));
  }
  function T(v) {
    var H;
    const k = (H = C.current) == null ? void 0 : H.getBoundingClientRect();
    k && A(hr(v.clientX - k.left, Y));
  }
  function R(v) {
    const k = v.shiftKey ? 40 : 16;
    let H = null;
    v.key === "ArrowLeft" && (H = oe - k), v.key === "ArrowRight" && (H = oe + k), v.key === "Home" && (H = 160), v.key === "End" && (H = Y), H != null && (v.preventDefault(), v.stopPropagation(), A(hr(H, Y)));
  }
  const h = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: C,
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
      n("button", { key: "out", type: "button", className: h, disabled: g <= 1, onClick: () => u(kr(g - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: h, disabled: g === 1, onClick: () => u(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(g * 100)}%`),
      n("button", { key: "in", type: "button", className: h, disabled: g >= 8, onClick: () => u(kr(g + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
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
      "aria-valuenow": Math.round(oe),
      "aria-valuetext": `${Math.round(oe)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (v) => {
        v.currentTarget.setPointerCapture(v.pointerId), T(v);
      },
      onPointerMove: (v) => {
        v.currentTarget.hasPointerCapture(v.pointerId) && T(v);
      },
      onKeyDown: R,
      onDoubleClick: () => A(Tt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${oe - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: S,
      onScroll: (v) => ae({
        scrollTop: v.currentTarget.scrollTop,
        height: v.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: Ts(g) }, [
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
          "aria-valuemax": J,
          "aria-valuenow": Math.min(J, Math.max(0, c)),
          "aria-valuetext": Ae(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: le,
          onKeyDown: V
        }, re.map((v, k) => n("span", {
          key: v,
          className: `absolute top-0 ${Ns(k, re.length, J > 0 ? v / J * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Is(k, re.length, J > 0 ? v / J * 100 : 0)
        }, Ae(v))).concat(t.map((v) => {
          const k = J > 0 ? v.startSec / J * 100 : 0;
          return n("button", {
            key: `shot-boundary:${v.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Ae(v.startSec)} – ${Ae(v.endSec)}`,
            title: `Shot boundary · ${v.source || "manual"} · ${Ae(v.startSec)} – ${Ae(v.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${k}%`, width: "2px" },
            onClick: (H) => {
              H.stopPropagation(), x(v.startSec);
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
            ...zo(ve),
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
        style: M.length > 0 ? { height: ie.height } : void 0
      }, [
        M.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...zo(ve, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        M.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : xe.map((v) => {
          var B;
          const k = v.group, H = i.includes(k.key), me = a === k.key, G = Cr(me);
          if (v.kind === "group") return n("div", {
            key: v.key,
            "data-segment-group": k.key,
            "data-segment-group-collapsed": H ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${Q}rem minmax(0,1fr)`,
              backgroundColor: G,
              top: v.top,
              height: v.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (U) => {
                if (U.metaKey || U.ctrlKey) {
                  y(k.lanes.flatMap((te) => te.markers.map((Ce) => Ce.segment.id)));
                  return;
                }
                f(k.key), m(k.key);
              },
              "aria-expanded": !H,
              "aria-current": me ? "true" : void 0,
              "data-selected-timeline-group": me ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: k.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: G
              },
              title: `${H ? "Expand" : "Collapse"} ${k.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, H ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, k.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              H ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${k.lanes.length} swimlane${k.lanes.length === 1 ? "" : "s"} hidden`
                ),
                L ? n(Xt, { key: "states", counts: k.counts }) : null
              ] : null
            )
          ]);
          const W = v.lane, _ = zl(v.laneIndex), j = W.markers.some(({ segment: U }) => U.id === s);
          return n("div", {
            key: v.key,
            "data-grouped-swimlane": k.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${Q}rem minmax(0,1fr)`,
              top: v.top,
              height: v.height,
              backgroundColor: _
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": j ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: Hl(j, _),
              title: `${Jn(W)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Jn(W),
              onClick: (U) => {
                (U.metaKey || U.ctrlKey) && y(W.markers.map((te) => te.segment.id));
              },
              onMouseEnter: () => D(W.key),
              onMouseLeave: () => D((U) => U === W.key ? null : U)
            }, [
              W.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (U) => {
                  U.stopPropagation(), I({ tagId: W.tagId, tagName: W.label, trigger: U.currentTarget });
                },
                "aria-label": `Configure ${W.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: O === W.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, W.label),
              (B = W.performers) != null && B.length ? n(Tr, {
                key: "performers",
                performers: W.performers,
                performerAssignments: W.performerAssignments
              }) : null,
              L ? n(Xt, { key: "counts", counts: W.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, W.markers.map(({ segment: U, track: te }) => {
              var Ze;
              const Ce = Jr(U.startSec, J), he = U.endSec == null ? U.startSec : Math.max(U.startSec, U.endSec), Qe = Math.max(0, Jr(he, J) - Ce), Pe = l.includes(U.id), $e = U.id === s, ze = po(q.get(U.id)), ut = U.endSec == null ? Ae(U.startSec) : `${Ae(U.startSec)} – ${Ae(U.endSec)}`, bt = (Ze = li[ze]) == null ? void 0 : Ze.label;
              return n("button", {
                key: U.id,
                type: "button",
                onClick: (mt) => {
                  mt.stopPropagation(), p(U, {
                    additive: mt.metaKey || mt.ctrlKey,
                    rangeSegmentIds: mt.shiftKey ? W.markers.map((nt) => nt.segment.id) : null
                  });
                },
                "aria-pressed": Pe,
                "aria-current": $e ? "true" : void 0,
                "data-selected-timeline-marker": $e ? "true" : void 0,
                "data-selected-segment-shortcut-target": $e ? "true" : void 0,
                "aria-label": L ? `${U.tagName || "Tag segment"}${W.performerLabel ? `, ${W.performerLabel}` : ""}, ${U.reviewState}${bt ? `, ${bt}` : ""}, ${ut}` : `${U.tagName || "Tag segment"}${W.performerLabel ? `, ${W.performerLabel}` : ""}, ${ut}`,
                title: L ? `${U.tagName || "Tag segment"}${W.performerLabel ? ` · ${W.performerLabel}` : ""} · ${U.reviewState}${bt ? ` · ${bt}` : ""} · ${ut}` : `${U.tagName || "Tag segment"}${W.performerLabel ? ` · ${W.performerLabel}` : ""} · ${ut}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...L ? Gl(U.reviewState, Pe, ze, $e) : Ul(Pe, $e),
                  left: `${Ce}%`,
                  top: `${ql(te)}rem`,
                  width: Kl(U.endSec, Qe),
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
function bo({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = F(null), [l, d] = F([]), [c, g] = F(null), [u, f] = F(""), [m, p] = F(!0), [y, b] = F(null), [I, x] = F(""), [K, L] = F(!1), $ = ge(null), A = ge(0);
  pe(() => {
    const O = requestAnimationFrame(() => {
      var D;
      return (D = $.current) == null ? void 0 : D.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(O);
  }, [e]), pe(() => {
    const O = new AbortController();
    return p(!0), x(""), Promise.all([
      r ? ee(`/slot-definitions/${e}`, { signal: O.signal }) : Promise.resolve(null),
      ee("/segment-groups", { signal: O.signal })
    ]).then(([D, M]) => {
      const q = M.find((se) => (se.tags || []).some((ie) => Number(ie.tagId) === Number(e)));
      s(D), d(M), g((q == null ? void 0 : q.id) ?? null), f(q == null ? "" : String(q.id)), L(!1);
    }).catch((D) => {
      D.name !== "AbortError" && x(D.message || "Unable to load tag configuration.");
    }).finally(() => {
      O.signal.aborted || p(!1);
    }), () => O.abort();
  }, [r, e]);
  function C(O, D) {
    s({
      ...a,
      definitions: a.definitions.map((M, q) => q === O ? { ...M, ...D } : M)
    });
  }
  function S(O, D) {
    const M = O + D;
    if (M < 0 || M >= a.definitions.length) return;
    const q = [...a.definitions];
    [q[O], q[M]] = [q[M], q[O]], s({
      ...a,
      definitions: q.map((se, ie) => ({ ...se, sortOrder: ie }))
    });
  }
  function w(O) {
    const D = a.definitions[O], M = Number(D.assignmentCount) || 0, q = M === 0 ? "" : ` and its ${M} assignment${M === 1 ? "" : "s"}`;
    window.confirm(`Delete “${Ct(D)}”${q}?`) && (M > 0 && L(!0), s({
      ...a,
      definitions: a.definitions.filter((se, ie) => ie !== O).map((se, ie) => ({ ...se, sortOrder: ie }))
    }));
  }
  async function E() {
    var D;
    b("slots"), x("Saving performer slots…");
    let O;
    try {
      O = await ee(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: K,
          definitions: a.definitions.map((M, q) => {
            var se;
            return {
              id: M.id || void 0,
              label: ((se = M.label) == null ? void 0 : se.trim()) || null,
              sortOrder: q,
              genderHints: M.genderHints || []
            };
          })
        })
      }), s(O), L(!1);
    } catch (M) {
      M.status === 409 ? (x("Performer slots changed elsewhere; current values were reloaded."), (D = M.payload) != null && D.current && (s(M.payload.current), L(!1))) : x(M.message || "Unable to save performer slots."), b(null);
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
  async function z() {
    const O = u === "" ? null : Number(u);
    if (O !== c) {
      b("group"), x("Saving tag group…");
      try {
        await ee(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: O })
        });
      } catch (D) {
        x(D.message || "Unable to assign the tag group."), b(null);
        return;
      }
      try {
        const [D, M] = await Promise.allSettled([
          ee("/segment-groups"),
          o()
        ]);
        if (D.status === "fulfilled") {
          d(D.value);
          const q = D.value.find((ie) => (ie.tags || []).some((xe) => Number(xe.tagId) === Number(e))), se = (q == null ? void 0 : q.id) ?? null;
          g(se), f(se == null ? "" : String(se));
        }
        x(
          D.status === "fulfilled" && M.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        b(null);
      }
    }
  }
  l.find((O) => Number(O.id) === Number(c));
  const ae = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (O) => {
      O.target === O.currentTarget && !y && i();
    },
    onKeyDownCapture: (O) => At(O, {
      onCancel: y ? void 0 : i
    })
  }, n("section", {
    ref: $,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: Ut,
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
            onChange: (O) => f(O.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((O) => n("option", { key: O.id, value: String(O.id) }, O.name))
          ])
        ]),
        m ? null : n("button", {
          key: "save",
          type: "button",
          disabled: y != null || (u === "" ? null : Number(u)) === c,
          onClick: z,
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
              onChange: (O) => s({ ...a, allowSamePerformerInMultipleSlots: O.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((O, D) => n("article", {
            key: O.id || O._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: O.label || "",
                disabled: y != null,
                onChange: (M) => C(D, { label: M.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, hs.map((M) => n("label", { key: M, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: y != null,
                  checked: (O.genderHints || []).includes(M),
                  onChange: (q) => C(D, {
                    genderHints: q.target.checked ? [.../* @__PURE__ */ new Set([...O.genderHints || [], M])] : (O.genderHints || []).filter((se) => se !== M)
                  })
                }),
                n("span", { key: "text" }, $r(M))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${O.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: y != null || D === 0, onClick: () => S(D, -1), className: ae, "aria-label": `Move ${Ct(O)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: y != null || D === a.definitions.length - 1, onClick: () => S(D, 1), className: ae, "aria-label": `Move ${Ct(O)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: y != null, onClick: () => w(D), className: `${ae} text-red-300` }, "Delete")
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
              className: ae
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: y != null,
              onClick: E,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, y === "slots" ? "Saving…" : "Save performer slots")
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
        disabled: y != null,
        onClick: i,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Close")
    )
  ]));
}
function xc(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function Sc(e) {
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, analysisError: i, analysisRun: a, analysisStatus: s, approvalFacetCounts: l, autoAssignCandidates: d, autoAssignError: c, autoAssignOpen: g, autoAssignPerformers: u, autoAssigning: f, cancelQueuedReviewsForSegments: m, canMoveSelectionToBin: p, captureTrainingExport: y, centerTimelineRef: b, closeEditorFilters: I, closeFirstSegmentTagDialog: x, closeMaterializeDialog: K, closeMergeConfirmation: L, closePublishApprovedDialog: $, closeTagEditing: A, collapsedSegmentGroups: C, commonActionsRef: S, compatibilityMode: w, configuringTag: E, createSegment: z, creatingSegmentId: ae, currentTime: O, deleteRejectedSegments: D, detail: M, detailPanelRef: q, detailWidth: se, duplicateSegment: ie, editorFilters: xe, editorLayout: J, editorRef: Y, exportingExamples: oe, filtersButtonRef: Q, filtersOpen: ve, firstSegmentTagOpen: fe, focusRowRef: be, handleSeparatorKeyDown: re, handleSeparatorPointerDown: ue, handleSeparatorPointerMove: ne, hasNextUnreviewed: Z, hasPreviousUnreviewed: le, hideDerivedSegments: V, history: T, historyOpen: R, historySaving: h, horizontalLayoutSize: v, importNativeSegments: k, incorrectExamples: H, incorrectExamplesOpen: me, lineage: G, markerRailWidth: W, materializeButtonRef: _, materializeCancelButtonRef: j, materializeDerivedSegments: B, materializeError: U, materializeLoading: te, materializeOpen: Ce, materializePreview: he, materializing: Qe, mediaStackRef: Pe, mergeCancelButtonRef: $e, mergeConfirmation: ze, mergeSaving: ut, mergeSelectedSwimlane: bt, nativeImportState: Ze, onDetailChange: mt, onNavigate: nt, onReload: dt, onSlotsChanged: rt, openPublishApprovedDialog: ct, panelSeparatorProps: He, pendingInitialSeekRef: ht, performerSlots: X, performerSlotsAvailable: de, playbackControlsRef: Me, previewDerivedSegments: Te, provenance: ye, provenanceSources: Ue, publishApprovedCancelButtonRef: qe, publishApprovedDrafts: Ve, publishApprovedError: Ie, publishApprovedOpen: Ee, quickSearchOpen: _e, railScrollRef: we, railToggleRef: Oe, recordHistoryAction: Je, rejectedDeletionPreview: Se, removeIncorrectExample: Fe, removingExampleId: De, restoreHistoryTarget: $t, runEditorAction: et, saveMessage: at, saveTag: St, saveTiming: kt, savingSegmentId: ke, seekRef: Ne, segmentGroups: Ke, segmentRailLayout: gt, segments: ot, selectAllVideoSegments: qt, selectSegment: lt, selectSegmentCollection: _t, selectedGroups: Wt, selectedPerformerSlots: wn, selectedSegment: Kt, selectedSegmentGroupKey: Nn, selectedSegmentIds: mn, selectedSegments: Vt, selectedSlotStatus: In, setAutoAssignError: tn, setAutoAssignOpen: nn, setConfiguringTag: Cn, setCurrentTime: Rr, setEditorFilters: Xn, setEditorLayout: Mr, setFiltersOpen: $n, setHideDerivedSegments: Tn, setHistoryOpen: An, setIncorrectExamplesOpen: rn, setQuickSearchOpen: er, setRailViewport: tr, setRejectedDeletionPreview: Rn, setSaveMessage: on, setSelectedSegmentGroupKey: gn, setSelectedSegmentId: Mn, setShortcutsOpen: vt, setTimelineZoom: nr, shotBoundaries: En, shortcutsOpen: rr, slotButtonRef: or, splitLayout: Et, splitSegment: Dn, startFullAnalysis: ar, stepVideoFrame: ir, tagEditing: Pn, tagSearchRef: On, timelineDuration: Ln, timelineRatioBounds: tt, timelineZoom: pt, toggleSegmentGroup: sr, toggleSegmentRail: Er, updateTimelineRatio: Dt, video: We, videoPerformers: lr, visibleCounts: Fn, visibleSegmentRailRows: jn, visibleSegments: pn, wideLayout: Jt, workspaceRef: Dr } = e, Bn = Ge(
    () => ot.filter((N) => !N.published && N.reviewState === "approved"),
    [ot]
  ), dr = ps(oo), Gn = Bn.length, jt = he ? he.createCount + he.linkCount : null, ft = ke != null, an = Vt.length > 0, Un = Vt.length === 1, Pr = an && Vt.every((N) => N.reviewState === "approved"), Or = an && Vt.every((N) => N.reviewState === "rejected"), Lr = [
    { id: "marker.create", label: "New segment", disabled: ft },
    { id: "marker.editTag", label: "Edit tag", disabled: ft || !an },
    { id: "marker.setStart", label: "Set start", disabled: ft || !Un },
    { id: "marker.setEnd", label: "Set end", disabled: ft || !Un },
    { id: "marker.split", label: "Split", disabled: ft || !Un },
    ...w ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !le, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Pr ? "Unapprove" : "Approve", disabled: ft || !an, tone: "approve" },
      { id: "marker.reject", label: Or ? "Unreject" : "Reject", disabled: ft || !an, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !Z, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...w ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: ft || !p, tone: "reject" }
    ]
  ];
  function wt(N) {
    const Re = mn.includes(N.id), xt = N.id === (Kt == null ? void 0 : Kt.id), yt = N.endSec == null ? Ae(N.startSec) : `${Ae(N.startSec)} – ${Ae(N.endSec)}`, Yt = `${Ft(N.sourceKey)}${N.confidence != null ? ` · ${Math.round(N.confidence * 100)}%` : ""}`;
    return n("button", {
      key: N.id,
      type: "button",
      onClick: (Bt) => lt(N, { additive: Bt.metaKey || Bt.ctrlKey }),
      "aria-pressed": Re,
      "aria-current": xt ? "true" : void 0,
      "data-selected-segment-shortcut-target": xt ? "true" : void 0,
      "aria-label": w ? `${N.tagName || "Tag segment"}, ${N.reviewState}${N.isDerived ? ", derived segment" : ""}, ${yt}` : `${N.tagName || "Tag segment"}${N.isDerived ? ", derived segment" : ""}, ${yt}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: si(Re, xt)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        w ? n(un, { key: "review", state: N.reviewState, includeLabel: !1 }) : null,
        N.isDerived ? n(Ar, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          N.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, yt),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: Yt
        }, Yt)
      ])
    ]);
  }
  const Xe = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", sn = [...T.actions || []].reverse().find((N) => N.sequence <= T.cursorSequence);
  return n("section", {
    ref: Y,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${Et ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (N) => Si(N, nt, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${We.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: We.title || `Video ${We.id}`
          }, We.title || `Video ${We.id}`)),
          ...lr.map((N) => n(Yn, {
            key: st(N),
            performer: { id: st(N), name: N.name },
            compact: !0,
            tooltip: N.name
          })),
          w ? n(Xt, { key: "review-counts", counts: Fn }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          w ? null : n(Ni, { key: "bin", onNavigate: nt, compact: !0 }),
          n(Ii, { key: "settings", onNavigate: nt, compact: !0 })
        ])
      ]),
      w && M.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${M.nativeImportCount} Cove segment${M.nativeImportCount === 1 ? "" : "s"} ${M.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
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
              onClick: () => ar(),
              title: (s == null ? void 0 : s.error) || "Run AI tagging and shot boundary analysis into the Full review workflow",
              className: "segment-studio-full-scan-run inline-flex items-center justify-center bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
            }, (s == null ? void 0 : s.configured) === !1 ? "Full Scan not configured" : (s == null ? void 0 : s.ready) === !1 ? "Full Scan unavailable" : (a == null ? void 0 : a.status) === "queued" ? "Full Scan queued…" : (a == null ? void 0 : a.status) === "running" ? "Full Scan running…" : "Full Scan"),
            n("details", { key: "choices", className: "relative flex" }, [
              n("summary", {
                key: "summary",
                "aria-label": "Choose Full Scan analyses",
                "aria-disabled": (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
                title: "Choose analyses",
                onClick: (N) => {
                  ((s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running") && N.preventDefault();
                },
                onKeyDown: (N) => {
                  (N.key === "Enter" || N.key === " ") && ((s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running") && N.preventDefault();
                },
                className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${(s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running" ? "pointer-events-none cursor-default opacity-50" : "cursor-pointer hover:opacity-90"}`
              }, n(Ea, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([N, Re]) => n("button", {
                key: N,
                type: "button",
                disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
                onClick: (xt) => {
                  var yt;
                  (yt = xt.currentTarget.closest("details")) == null || yt.removeAttribute("open"), ar(Re);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, N)))
            ])
          ]) : null,
          w ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: ke != null || d.length === 0,
            onClick: () => {
              tn(""), nn(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${d.length ? ` (${d.length})` : ""}`) : null,
          w ? n("button", {
            key: "materialize-derived",
            ref: _,
            type: "button",
            disabled: ke != null || te || Qe || jt === 0,
            onClick: Te,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, te ? "Analyzing…" : `Auto-Materialize${jt != null ? ` (${jt})` : ""}`) : null,
          w ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: ke != null || Gn === 0,
            onClick: (N) => ct(N.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": Ee,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${Gn ? ` (${Gn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: oe || De != null || H.length === 0,
            onClick: () => rn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": me,
            "aria-label": `Open AI feedback collection, ${H.length} example${H.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${H.length ? ` (${H.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: Q,
            type: "button",
            onClick: () => $n(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": ve,
            className: `${Xe} ${r ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(yr, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${r ? ` (${r})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => vt(!0),
            className: Xe
          }, [n(yr, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: (w ? T.actions.length === 0 : sn == null) || ke != null || h,
            onClick: w ? () => An((N) => !N) : () => $t(
              sn.sequence - 1
            ),
            "aria-haspopup": w ? "dialog" : void 0,
            "aria-expanded": w ? R : void 0,
            className: Xe
          }, [
            n(yr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, w ? `History${T.actions.length ? ` (${T.actions.length})` : ""}` : sn ? `Undo ${sn.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: Oe,
            type: "button",
            onClick: Er,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": J.markerRailOpen,
            className: Xe
          }, [
            n(yr, { key: "icon", name: "list" }),
            n("span", { key: "label" }, J.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    w && R ? n("section", {
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
          onClick: () => An(!1),
          className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
        }, "Close")
      ]),
      n("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
        ...[...T.actions].reverse().map((N) => n("button", {
          key: N.sequence,
          type: "button",
          disabled: h,
          onClick: () => $t(N.sequence),
          "aria-current": T.cursorSequence === N.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${N.sequence > T.cursorSequence ? "text-secondary" : "text-foreground"} ${T.cursorSequence === N.sequence ? "bg-accent/15" : ""}`
        }, [
          n("span", { key: "label", className: "min-w-0 flex-1 truncate" }, N.label),
          n("time", {
            key: "time",
            dateTime: N.createdAt,
            className: "shrink-0 text-[10px] text-secondary"
          }, new Date(N.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
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
    ve ? n(sc, {
      key: "editor-filters",
      filters: xe,
      hideDerivedSegments: V,
      performers: lr,
      provenanceSources: Ue,
      reviewCounts: l,
      segments: ot,
      segmentGroups: Ke,
      reviewMode: w,
      onChange: Xn,
      onHideDerivedChange: Tn,
      onClose: I
    }) : null,
    fe ? n(ic, {
      key: "first-segment-tag-dialog",
      saving: ke != null,
      error: at,
      onSelect: (N, Re) => z(N, Re),
      onClose: x
    }) : null,
    _e ? n(cc, {
      key: "quick-search-dialog",
      segments: Al(o),
      onSelect: (N) => {
        er(!1), lt(N, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        er(!1), requestAnimationFrame(() => {
          var N;
          return (N = Y.current) == null ? void 0 : N.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    g ? n(gc, {
      key: "auto-assign-dialog",
      candidates: d,
      processing: f,
      error: c,
      onConfirm: u,
      onClose: () => nn(!1)
    }) : null,
    ze ? n(fc, {
      key: "merge-selection-dialog",
      merge: ze,
      processing: ut,
      undoable: !w,
      cancelButtonRef: $e,
      onConfirm: (N) => bt(!0, N, ze),
      onClose: L
    }) : null,
    Ce ? n(bc, {
      key: "materialize-derived-dialog",
      preview: he,
      loading: te,
      processing: Qe,
      error: U,
      cancelButtonRef: j,
      onConfirm: B,
      onClose: () => {
        Qe || K();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: Dr,
      className: `${Et ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      J.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: Jt ? { position: "absolute", top: 0, right: 0, width: W, height: v.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        ot.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : pn.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: we,
          onScroll: (N) => tr({
            scrollTop: N.currentTarget.scrollTop,
            height: N.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: gt.height }
        }, jn.map((N) => {
          var xt;
          let Re;
          if (N.kind === "group") {
            const yt = C.includes(N.group.key), Yt = N.group.lanes.reduce((Bt, Fr) => Bt + Fr.markers.length, 0);
            Re = n("button", {
              type: "button",
              onClick: () => {
                gn(N.group.key), sr(N.group.key);
              },
              "aria-expanded": !yt,
              "aria-current": Nn === N.group.key ? "true" : void 0,
              "data-segment-rail-group": N.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${Nn === N.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, yt ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: N.group.name }, N.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Yt),
              w && yt ? n(Xt, { key: "states", counts: N.group.counts }) : null
            ]);
          } else N.kind === "lane" ? Re = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Jn(N.lane),
            "aria-label": Jn(N.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, N.lane.label),
            (xt = N.lane.performers) != null && xt.length ? n(Tr, {
              key: "performers",
              performers: N.lane.performers,
              performerAssignments: N.lane.performerAssignments
            }) : null,
            w ? n(Xt, { key: "states", counts: N.lane.counts }) : null
          ]) : Re = wt(N.segment);
          return n("div", {
            key: N.key,
            className: "absolute left-0 right-0",
            style: { top: N.top, height: N.height }
          }, Re);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${Et ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: Pe,
          className: `${Et ? "min-h-0 flex-1" : ""} grid`,
          style: Et ? {
            gridTemplateRows: `minmax(16rem, ${(1 - J.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${J.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: be,
            className: "grid min-h-0 gap-2",
            style: Jt ? {
              gridTemplateColumns: J.markerRailOpen ? `${se}px 0.5rem minmax(0,1fr) 0.5rem ${W}px` : `${se}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(hc, {
              key: "tools",
              compatibilityMode: w,
              selectedSegment: Kt,
              selectedSegments: Vt,
              selectedGroups: Wt,
              saveMessage: at,
              savingSegmentId: ke,
              creatingSegmentId: ae,
              acquireSaveLock: t,
              setSaveMessage: on,
              saveTag: St,
              slotStatus: In,
              performerSlotsAvailable: de,
              selectedPerformerSlots: wn,
              performerSlots: X,
              detail: M,
              onDetailChange: mt,
              onCancelQueuedReview: m,
              video: We,
              slotButtonRef: or,
              tagSearchRef: On,
              tagEditing: Pn,
              onCancelTagEditing: A,
              detailPanelRef: q,
              onReduceSelection: (N) => {
                lt(N), requestAnimationFrame(() => {
                  var Re;
                  return (Re = q.current) == null ? void 0 : Re.focus({ preventScroll: !0 });
                });
              },
              saveTiming: kt,
              onSlotsChanged: rt,
              onRecordHistory: Je,
              splitSegment: Dn,
              duplicateSegment: ie,
              provenance: ye,
              lineage: G,
              onNavigateLineageItem: (N) => {
                const Re = ot.find((xt) => xt.itemId === N);
                Re && Mn(Re.id);
              }
            }),
            Jt ? n(
              "div",
              { key: "detail-separator", ...He("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            We.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n($a, {
                streamUrl: `/api/stream/video/${We.id}`,
                posterUrl: `/api/stream/video/${We.id}/screenshot?v=${encodeURIComponent(We.updatedAt || "")}`,
                format: We.videoFile.format,
                audioCodec: We.videoFile.audioCodec,
                duration: We.videoFile.duration,
                videoId: We.id,
                trackingEnabled: !1,
                onSeekRegister: (N) => {
                  Ne.current = N, Il(ht.current, ot, N) && (ht.current = null);
                },
                onPlaybackControlRegister: (N) => {
                  Me.current = N;
                },
                onTimeUpdate: Rr
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            Jt && J.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...He("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Jt && J.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: S,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...Lr.map((N) => {
              var yt;
              const Re = (yt = dr[N.id]) == null ? void 0 : yt[0], xt = N.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : N.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: N.id,
                type: "button",
                disabled: N.disabled,
                "data-action-id": N.id,
                onClick: (Yt) => {
                  const Bt = Yt.currentTarget;
                  et(N.id, { target: Bt, preserveFocus: !0 }), N.focusWhenDisabled && requestAnimationFrame(() => {
                    xc(Bt, S.current, N.focusWhenDisabled);
                  });
                },
                title: Re ? `${N.label} (${Re})` : N.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${xt}`
              }, [
                n("span", { key: "label" }, N.label),
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
                disabled: !We.videoFile,
                onClick: () => ir(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(fs, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !We.videoFile,
                onClick: () => ir(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(ys, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          Et ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(tt.minimum * 100),
            "aria-valuemax": Math.round(tt.maximum * 100),
            "aria-valuenow": Math.round(J.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(J.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: ue,
            onPointerMove: ne,
            onKeyDown: re,
            onDoubleClick: () => Dt(Tt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: Et ? void 0 : { height: "20rem" } }, n(vc, {
            segments: pn,
            shotBoundaries: En,
            segmentGroups: Ke,
            performerSlots: X,
            collapsedGroupKeys: C,
            selectedGroupKey: Nn,
            selectedSegmentId: Kt == null ? void 0 : Kt.id,
            selectedSegmentIds: mn,
            duration: Ln,
            currentTime: O,
            zoom: pt,
            onZoomChange: nr,
            onSelectGroup: gn,
            onToggleGroup: sr,
            onSelect: (N, Re) => lt(N, Re),
            onSelectSegments: _t,
            onSelectAll: qt,
            onConfigureTag: (N) => Cn(N),
            onSeekTime: (N) => {
              var Re;
              return (Re = Ne.current) == null ? void 0 : Re.call(Ne, N, !1);
            },
            centerRef: b,
            showReviewState: w,
            swimlaneTitleWidth: J.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (N) => Mr((Re) => ({ ...Re, swimlaneTitleWidth: N }))
          }))
        ])
      ])
    ]),
    E ? n(bo, {
      key: `configure-tag:${E.tagId}`,
      tagId: E.tagId,
      tagName: E.tagName,
      performerSlotsEnabled: w,
      onSaved: dt,
      onClose: () => {
        const N = E.trigger;
        Cn(null), requestAnimationFrame(() => {
          var Re;
          N != null && N.isConnected ? N.focus({ preventScroll: !0 }) : (Re = Y.current) == null || Re.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Ee ? n(mc, {
      key: "publish-approved-dialog",
      drafts: Bn,
      processing: ke === -1,
      error: Ie,
      cancelButtonRef: qe,
      onConfirm: Ve,
      onClose: $
    }) : null,
    Se ? n(pc, {
      key: "rejected-deletion-dialog",
      preview: Se,
      onConfirm: () => {
        D(Se), requestAnimationFrame(() => {
          var N;
          return (N = Y.current) == null ? void 0 : N.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Rn(null), requestAnimationFrame(() => {
          var N;
          return (N = Y.current) == null ? void 0 : N.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    rr ? n(lc, {
      key: "shortcuts-dialog",
      reviewMode: w,
      bindings: dr,
      onClose: () => vt(!1)
    }) : null,
    me ? n(dc, {
      key: "incorrect-examples-dialog",
      examples: H,
      exporting: oe,
      removingExampleId: De,
      onExport: y,
      onRemove: Fe,
      onClose: () => rn(!1)
    }) : null
  ]);
}
function kc(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: u, setEditorFilters: f, setHideDerivedSegments: m, setSaveMessage: p, setSelectedSegmentGroupKey: y, setSelectedSegmentId: b, setSelectedSegmentIds: I } = e;
  function x(C) {
    const S = Ot(t, C);
    S && u((w) => pi(w, S));
  }
  function K(C) {
    b(C), I(C == null ? [] : [C]), c.current = C, g.current = [];
  }
  function L(C, {
    focusEditor: S = !1,
    seekToSegment: w = !1,
    additive: E = !1,
    rangeSegmentIds: z = null
  } = {}) {
    var O, D;
    const ae = zs({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, C.id, z, E);
    I(ae.selectedSegmentIds), b(ae.activeSegmentId), c.current = ae.anchorSegmentId, g.current = ae.rangeBaseSegmentIds, ae.activeSegmentId != null && y(Ot(t, ae.activeSegmentId)), x(C.id), S && ((O = r.current) == null || O.focus({ preventScroll: !0 })), w && ((D = i.current) == null || D.call(i, C.startSec, !1));
  }
  function $(C) {
    const S = Us(
      d,
      l,
      C
    );
    I(S.selectedSegmentIds), b(S.activeSegmentId), c.current = S.activeSegmentId, g.current = [], S.activeSegmentId != null && (y(Ot(t, S.activeSegmentId)), x(S.activeSegmentId));
  }
  function A() {
    var w;
    const C = qs(s), S = C.includes(l) ? l : C[0] ?? null;
    f(Mt({})), m(!1), I(C), b(S), c.current = S, g.current = [], S != null && y(Ot(
      dn(s, a, o),
      S
    )), p(C.length === 0 ? "There are no segments to select." : `${C.length} segments selected. Collapsed Segment groups keep their selected segments.`), (w = r.current) == null || w.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: x, replaceSegmentSelection: K, selectSegment: L, selectSegmentCollection: $, selectAllVideoSegments: A };
}
function wc(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, historyRef: c, onConflict: g, onDetailChange: u, onReload: f, recordHistoryAction: m, revealSegmentGroupForSelection: p, savingSegmentId: y, selectedGroups: b, selectedSegment: I, selectedSegmentIdRef: x, selectedSegments: K, selectionAnchorIdRef: L, selectionRangeBaseIdsRef: $, setMergeConfirmation: A, setSaveMessage: C, setSelectedSegmentId: S, setSelectedSegmentIds: w, video: E } = e;
  function z() {
    A(null), requestAnimationFrame(() => {
      var M;
      return (M = a.current) == null ? void 0 : M.focus({ preventScroll: !0 });
    });
  }
  async function ae(M = !1, q = !1, se = null) {
    if (y != null) return;
    const ie = se || mi(
      b,
      { nativeOnly: !o }
    );
    if (!ie) {
      C("Select at least two segments from one swimlane.");
      return;
    }
    if (!M && Ka()) {
      A(ie);
      return;
    }
    q && za(!1);
    const xe = ie.endSec == null ? "open end" : Ae(ie.endSec);
    let J = ie.segments[0];
    const Y = o ? null : Rt(ie.segments, !1), oe = o ? null : crypto.randomUUID(), Q = ie.segments.map((be) => be.id), ve = Id(i, ie.segments), fe = r("merge", ie.segments[0].id);
    if (fe) {
      z(), u(ve, E.id), w([J.id]), S(J.id), L.current = J.id, $.current = [];
      try {
        const be = ie.segments.slice(1);
        if (!o || J.nativeSegmentId != null) {
          const re = be.map((ne) => {
            const Z = `merge-native-selection:${E.id}:${J.id}:${ne.id}:${J.updatedAt}:${ne.updatedAt}`;
            return { key: Z, operationId: je(Z), segmentId: ne.id, expectedUpdatedAt: ne.updatedAt };
          }), ue = await ee(`/videos/${E.id}/segments/merge-selection`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              survivorSegmentId: J.id,
              expectedSurvivorUpdatedAt: J.updatedAt,
              consumedSegments: re.map(({ key: ne, ...Z }) => Z),
              historyReceiptId: oe
            })
          });
          J = ue.survivor, u((ne) => ia(ne, ue), E.id), re.forEach(({ key: ne }) => Be(ne));
        } else {
          const re = be.map((ne) => {
            const Z = `merge-draft-selection:${E.id}:${J.itemId}:${ne.itemId}:${J.revision}:${ne.revision}`;
            return { key: Z, operationId: je(Z), itemId: ne.itemId, expectedRevision: ne.revision };
          }), ue = await ee(`/videos/${E.id}/drafts/merge-selection`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              survivorItemId: J.itemId,
              expectedSurvivorRevision: J.revision,
              consumedDrafts: re.map(({ key: ne, ...Z }) => Z)
            })
          });
          J = ue.survivor, u((ne) => ia(ne, ue), E.id), re.forEach(({ key: ne }) => Be(ne));
        }
        w([J.id]), S(J.id), L.current = J.id, $.current = [], o ? t(zt) : await m(
          "segments.merge",
          `Merged ${ie.segments.length} segments`,
          Y,
          Rt([J], !1),
          oe
        ), p(J.id), C(`${ie.segments.length} segments merged into ${Ae(ie.startSec)} – ${xe}.`);
      } catch (be) {
        u((re) => Nd(
          wd(re, [ie.segments[0]], [
            "startSec",
            "endSec",
            "sourceKey",
            "sourceRunId",
            "confidence",
            "isDerived"
          ]),
          ie.segments.slice(1)
        ), E.id), w(Q), S((I == null ? void 0 : I.id) ?? Q[0] ?? null), L.current = (I == null ? void 0 : I.id) ?? Q[0] ?? null, $.current = [], be.status === 409 ? await g() : C(be.message || "Unable to merge selected segments.");
      } finally {
        fe();
      }
    }
  }
  function O(M, q = K, se = I) {
    if (q.length === 0) return Promise.resolve(null);
    const ie = ol(M, q, se), xe = Math.max(0, ie.identities.indexOf(ie.activeIdentity)), J = bi(d()) != null, Y = l({
      kind: "review",
      lockId: ie.activeIdentity.id,
      targets: ie.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (oe) => D(oe, {
        ...ie,
        identities: oe.targets,
        activeIdentity: oe.targets[xe]
      })
    });
    return Y ? (J && C(`${M === "approved" ? "Approval" : "Rejection"} queued…`), Y.done) : Promise.resolve(null);
  }
  async function D({ detail: M, segments: q, onConflict: se, onReload: ie }, xe) {
    var Z;
    const J = al(xe, q);
    if (!J) {
      C("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: Y, selectedSegments: oe, selectedSegment: Q } = J, ve = rl(oe, Y), fe = oe.filter((le) => le.reviewState !== ve);
    if (fe.length === 0) return;
    const be = oe.map((le) => ({
      id: le.id,
      itemId: le.itemId,
      nativeSegmentId: le.nativeSegmentId
    })), re = be.find((le) => le.id === (Q == null ? void 0 : Q.id)) || be[0], ue = (le, V = !1) => {
      if (!(le != null && le.segments) || !V && !Zr(x.current, re.id))
        return;
      const T = be.map((h) => Ye(le == null ? void 0 : le.segments, h)).filter(Boolean), R = Ye(le == null ? void 0 : le.segments, re) || T[0] || null;
      w(T.map((h) => h.id)), S((R == null ? void 0 : R.id) ?? null), L.current = (R == null ? void 0 : R.id) ?? null, $.current = [];
    };
    C(`Updating ${fe.length} selected segment${fe.length === 1 ? "" : "s"}…`);
    const ne = Qt();
    s({
      type: "add",
      entry: { id: ne, op: "patch", targets: fe.map(Gt), values: { reviewState: ve } }
    });
    try {
      const le = await ee(`/videos/${E.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: c.current.revision,
          reviewState: ve,
          segments: oe.map((h) => h.published ? {
            nativeSegmentId: h.nativeSegmentId,
            expectedUpdatedAt: h.updatedAt
          } : {
            itemId: h.itemId,
            expectedRevision: h.revision
          })
        })
      }), V = new Map((le.items || []).map((h) => [
        h.requestedNativeSegmentId != null ? `native:${h.requestedNativeSegmentId}` : `item:${h.requestedItemId}`,
        h
      ]));
      if (be.forEach((h) => {
        const v = V.get(h.nativeSegmentId != null ? `native:${h.nativeSegmentId}` : `item:${h.itemId}`);
        v && (h.nativeSegmentId = v.nativeSegmentId, h.itemId = v.itemId);
      }), le.history && t(le.history), ve === "rejected" || (le.items || []).some((h) => h.requestedNativeSegmentId != null && h.nativeSegmentId !== h.requestedNativeSegmentId)) {
        ue(await ie()), s({ type: "settle", key: ne }), C(`${le.updatedCount} selected segment${le.updatedCount === 1 ? "" : "s"} ${ve === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const R = (h) => ({
        ...h,
        approvedSetVersion: le.approvedSetVersion || h.approvedSetVersion,
        segments: (h.segments || []).map((v) => {
          const k = V.get(v.nativeSegmentId != null ? `native:${v.nativeSegmentId}` : `item:${v.itemId}`);
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
      u(R, E.id), s({ type: "settle", key: ne }), ue(R(M)), C(`${le.updatedCount} selected segment${le.updatedCount === 1 ? "" : "s"} ${ve === "approved" ? "approved" : ve === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (le) {
      s({ type: "discard", key: ne }), le.status === 409 && ((Z = le.payload) != null && Z.currentHistory) && t(le.payload.currentHistory);
      const V = le.status === 409 ? await se() : M;
      ue(V, !0), C(le.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: z, mergeSelectedSwimlane: ae, saveSelectedReviewState: O };
}
function Nc(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: g, detail: u, editorFilters: f, editorRef: m, cancelSaveTasks: p, dispatchPendingChanges: y, enqueueSave: b, exportingExamples: I, hideDerivedSegments: x, incorrectExamples: K, lineage: L, materializeButtonRef: $, materializePreview: A, materializeRestoreFocusRef: C, materializing: S, mutateSegment: w, runSegmentMutation: E, pendingChanges: z, onConflict: ae, onDetailChange: O, onReload: D, performerSlots: M, recordHistoryAction: q, refreshMaterializationPreview: se, removingExampleId: ie, revealSegmentGroupForSelection: xe, savingSegmentId: J, segmentGroups: Y, segments: oe, selectedSegment: Q, selectedSegmentIdRef: ve, selectedSegments: fe, selectionAnchorIdRef: be, selectionRangeBaseIdsRef: re, setAutoAssignError: ue, setAutoAssignOpen: ne, setAutoAssigning: Z, setEditorFilters: le, setExportingExamples: V, setHideDerivedSegments: T, setIncorrectExamples: R, setMaterializeError: h, setMaterializeLoading: v, setMaterializeOpen: k, setMaterializePreview: H, setMaterializing: me, setRejectedDeletionPreview: G, setRemovingExampleId: W, setSaveMessage: _, setSelectedSegmentGroupKey: j, setSelectedSegmentId: B, setSelectedSegmentIds: U, video: te } = e;
  async function Ce() {
    var we, Oe, Je;
    if (fe.length === 0 || !Q || J != null) return;
    const X = yd(fe, K), de = X.segments;
    if (de.length === 0) return;
    const Me = fe.map((Se) => ({
      id: Se.id,
      itemId: Se.itemId,
      nativeSegmentId: Se.nativeSegmentId
    })), Te = Me.find((Se) => Se.id === Q.id) || Me[0], ye = [], Ue = [];
    let qe = !1, Ve = u, Ie = !1;
    const Ee = [], _e = r("feedback", Te.id);
    if (_e) {
      _(X.action === "remove" ? `Removing ${de.length} selected incorrect example${de.length === 1 ? "" : "s"}…` : `Collecting ${de.length} selected segment${de.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const Se = async (ke, Ne) => {
          const Ke = ke.nativeSegmentId != null, gt = X.action === "remove" ? `incorrect-example-remove:${te.id}:${Ne == null ? void 0 : Ne.id}:${Ne == null ? void 0 : Ne.revision}:${Ne == null ? void 0 : Ne.representationRevision}` : `incorrect-example-collect:${te.id}:${Ke ? `native:${ke.nativeSegmentId}:${ke.updatedAt}` : `item:${ke.itemId}:${ke.revision}`}`;
          if (X.action === "remove" && !Ne)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let ot;
          try {
            ot = X.action === "remove" ? await ee(
              `/videos/${te.id}/incorrect-examples/${Ne.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: je(gt),
                  expectedExampleRevision: Ne.revision,
                  expectedRepresentationRevision: Ne.representationRevision
                })
              }
            ) : await ee(`/videos/${te.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: je(gt),
                nativeSegmentId: Ke ? ke.nativeSegmentId : null,
                itemId: Ke ? null : ke.itemId,
                expectedUpdatedAt: Ke ? ke.updatedAt : null,
                expectedRevision: Ke ? null : ke.revision
              })
            });
          } catch (qt) {
            throw qt.operationKey = gt, qt;
          }
          if (!bd(X.action, ot))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return Be(gt), ot;
        };
        for (const ke of de) {
          const Ne = X.action === "remove" ? K.find((Ke) => Ke.itemId != null && Ke.itemId === ke.itemId) : null;
          try {
            const Ke = Me.find((lt) => lt.id === ke.id);
            let gt = Ye(
              Ve == null ? void 0 : Ve.segments,
              Ke
            ) || ke, ot;
            try {
              ot = await Se(gt, Ne);
            } catch (lt) {
              if (lt.status === 409 && ((Oe = (we = lt.payload) == null ? void 0 : we.result) == null ? void 0 : Oe.code) === "OPERATION_REPLAYED")
                Ve = await ee(
                  `/videos/${te.id}/editor`
                ), Ie = !0, Ee.length = 0, Be(lt.operationKey), ot = lt.payload.result;
              else {
                if (X.action !== "collect" || lt.status !== 409) throw lt;
                const _t = await ee(
                  `/videos/${te.id}/editor`
                );
                Ve = _t, Ie = !0, Ee.length = 0;
                const Wt = Ye(
                  _t == null ? void 0 : _t.segments,
                  Ke
                );
                if (!Wt) throw lt;
                gt = Wt, ot = await Se(gt, null);
              }
            }
            Ke && ot.itemId != null && (Ke.itemId = ot.itemId), Ve = vr(
              Ve,
              ot.editorDelta
            ), Ee.push(ot.editorDelta);
            const qt = { segment: ke, result: ot, example: Ne };
            ye.push(qt);
          } catch (Ke) {
            if (Ue.push(Ke), ![400, 404, 409].includes(Ke.status)) break;
          }
        }
        if (c && ye.length > 0) {
          const ke = X.action === "remove", Ne = ye.length;
          await q(
            ke ? "feedback.remove" : "feedback.collect",
            ke ? `Removed ${Ne} incorrect AI example${Ne === 1 ? "" : "s"}` : `Collected ${Ne} incorrect AI example${Ne === 1 ? "" : "s"}`,
            pr(ye, ke),
            pr(ye, !ke)
          ) || (qe = !0);
        }
        ye.some(({ result: ke }) => ke.representation === "basicNativeBin") && _n();
        const Fe = Zr(
          ve.current,
          Te.id
        ), De = X.action === "collect" && ye.some(({ segment: ke }) => ke.id === Te.id), $t = ye.map(({ segment: ke }) => ke.id), et = De ? Ws(
          o,
          $t,
          Te.id
        ) : null, at = De ? (et == null ? void 0 : et.id) ?? null : Te.id;
        Fe && De && (U(et ? [et.id] : []), B((et == null ? void 0 : et.id) ?? wr), be.current = (et == null ? void 0 : et.id) ?? null, re.current = []);
        const St = await ee(`/videos/${te.id}/incorrect-examples`);
        R(St);
        const kt = Ve;
        if (O(Ie ? kt : (ke) => Ee.reduce(vr, ke), te.id), Fe && Zr(
          ve.current,
          at
        )) {
          let ke, Ne;
          De ? (Ne = et ? Ye(kt == null ? void 0 : kt.segments, {
            id: et.id,
            itemId: et.itemId,
            nativeSegmentId: et.nativeSegmentId
          }) : null, ke = Ne ? [Ne] : []) : (ke = Me.map((Ke) => Ye(kt == null ? void 0 : kt.segments, Ke)).filter(Boolean), Ne = Ye(kt == null ? void 0 : kt.segments, Te) || ke[0] || null), U(ke.map((Ke) => Ke.id)), B((Ne == null ? void 0 : Ne.id) ?? (De ? wr : null)), be.current = (Ne == null ? void 0 : Ne.id) ?? null, re.current = [], j(Ne ? Ot(o, Ne.id) : null), Ne && xe(Ne.id);
        }
        if (Ue.length > 0) {
          const ke = ((Je = Ue[0]) == null ? void 0 : Je.message) || "Only segments with registered AI provenance can be collected.";
          ye.length === 0 ? _(ke) : X.action === "remove" ? _(
            `Partially removed ${ye.length} of ${de.length} selected incorrect examples. ${ke}`
          ) : _(
            `Partially collected ${ye.length} of ${de.length} selected segments. ${ke}`
          );
        } else if (X.action === "remove")
          _(
            `${ye.length} incorrect example${ye.length === 1 ? "" : "s"} removed and ${ye.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const ke = ye.filter(({ result: Ne }) => Ne.representation === "basicNativeBin").length;
          _(ke === ye.length ? `${ye.length} incorrect AI example${ye.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ye.length} incorrect AI example${ye.length === 1 ? "" : "s"} collected and ${ye.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        qe && _("The change saved, but editor history could not be updated.");
      } catch (Se) {
        _(Se.message || "Unable to update the selected incorrect examples.");
      } finally {
        _e();
      }
    }
  }
  async function he(X) {
    if (!X || ie != null || I) return;
    const de = r("feedback", -1);
    if (!de) {
      _("Wait for the current save to finish before removing the incorrect example.");
      return;
    }
    try {
      await Qe(X);
    } finally {
      de();
    }
  }
  async function Qe(X) {
    var Me, Te;
    W(X.id);
    const de = `incorrect-example-remove:${te.id}:${X.id}:${X.revision}:${X.representationRevision}`;
    try {
      let ye, Ue = !1;
      try {
        ye = await ee(
          `/videos/${te.id}/incorrect-examples/${X.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(de),
              expectedExampleRevision: X.revision,
              expectedRepresentationRevision: X.representationRevision
            })
          }
        );
      } catch (Ie) {
        if (Ie.status !== 409 || ((Te = (Me = Ie.payload) == null ? void 0 : Me.result) == null ? void 0 : Te.code) !== "OPERATION_REPLAYED")
          throw Ie;
        ye = Ie.payload.result, Ue = !0;
      }
      Be(de);
      let qe = !0;
      if (c) {
        const Ee = [{ segment: Ye(u.segments, {
          itemId: X.itemId
        }) || {
          id: X.itemId == null ? null : -X.itemId,
          itemId: X.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: X.representationRevision
        }, result: ye, example: X }];
        qe = await q(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          pr(Ee, !0),
          pr(Ee, !1)
        );
      }
      const Ve = await ee(
        `/videos/${te.id}/incorrect-examples`
      );
      R(Ve), Ue ? await D() : O(
        (Ie) => vr(Ie, ye.editorDelta),
        te.id
      ), X.representation === "basicNativeBin" && _n(), _(qe ? Ue ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : X.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (ye) {
      ye.status === 409 && await ae(), _(ye.message || "Unable to remove the incorrect example.");
    } finally {
      W(null);
    }
  }
  async function Pe() {
    if (I || ie != null || K.length === 0) return;
    V(!0);
    const X = `incorrect-example-export:${te.id}:${K.map((de) => `${de.id}:${de.revision}:${de.representationRevision}`).join(",")}`;
    try {
      const de = await vd(
        te.id,
        K
      ), Me = new FormData();
      Me.append("metadata", JSON.stringify({
        operationId: je(X),
        examples: de.captures
      }));
      for (const Ie of de.files)
        Me.append(Ie.fieldName, Ie.file);
      const Te = await ee(
        `/videos/${te.id}/incorrect-examples/export`,
        { method: "POST", body: Me }
      ), ye = await Ll(Te.downloadUrl), Ue = URL.createObjectURL(ye.blob), qe = document.createElement("a");
      qe.href = Ue, qe.download = ye.fileName, qe.click(), setTimeout(() => URL.revokeObjectURL(Ue), 1e3);
      const Ve = await ee(
        `/training-exports/${Te.id}/complete`,
        { method: "POST" }
      );
      Be(X), R(await ee(
        `/videos/${te.id}/incorrect-examples`
      )), _(
        `Downloaded ${Te.exampleCount} incorrect example${Te.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Ve.clearedExampleCount} from the working collection.`
      );
    } catch (de) {
      _(de.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      V(!1);
    }
  }
  async function $e(X = null) {
    const de = oe.filter((we) => we.reviewState === "rejected"), Me = de.length, Te = K.some((we) => we.representation === "fullItem");
    if (X == null && Me === 0 && !Te) {
      _("There are no rejected segments to delete.");
      return;
    }
    if (X == null) {
      const we = r("delete-rejected", -1);
      if (!we) return;
      _("Preparing deletion summary…");
      try {
        const Oe = await ee(`/videos/${te.id}/rejected/deletion/preview`, { method: "POST" }), Je = Number(Oe.deletedSegmentCount) || 0, Se = Number(Oe.deferredRejectedSegmentCount) || 0, Fe = Number(Oe.protectedIncorrectExampleCount) || 0;
        if (Je === 0) {
          Se > 0 ? _(
            `${Se} feedback-protected rejected segment${Se === 1 ? "" : "s"} kept. ${Fe} AI feedback example${Fe === 1 ? "" : "s"} must be exported before ${Se === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : _("There are no rejected segments to delete.");
          return;
        }
        if (!ri(Oe, _)) return;
        G(Oe), _("");
      } catch (Oe) {
        _(Oe.message || "Unable to prepare rejected segment deletion.");
      } finally {
        we();
      }
      return;
    }
    const ye = X, Ue = Number(ye.deferredRejectedSegmentCount) || 0, qe = ve.current, Ve = Ue === 0 ? kd(u, de.map((we) => we.id)) : u, Ie = Ve.segments.find((we) => we.reviewState === "unreviewed") || Ve.segments[0] || null, Ee = r("delete-rejected", -1);
    if (!Ee) return;
    G(null), _("Deleting rejected segments…");
    const _e = Ue === 0 ? Qt() : null;
    _e && (y({
      type: "add",
      entry: { id: _e, op: "remove", targets: de.map(Gt) }
    }), U(Ie ? [Ie.id] : []), B((Ie == null ? void 0 : Ie.id) ?? null), be.current = (Ie == null ? void 0 : Ie.id) ?? null, re.current = []);
    try {
      const we = `rejected-dependency-delete:${te.id}:${ye.fingerprint}`, Oe = await ee(`/videos/${te.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(we),
          fingerprint: ye.fingerprint
        })
      });
      Be(we), await D(), _e && y({ type: "settle", key: _e }), Oe.deletedSegmentCount > 0 && t(zt);
      const Je = Ue > 0 ? ` ${Ue} feedback-protected rejected segment${Ue === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      _(`${Oe.deletedSegmentCount} segment${Oe.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Je}`);
    } catch (we) {
      _e && y({ type: "discard", key: _e }), U(qe == null ? [] : [qe]), B(qe), be.current = qe, re.current = [], _(we.message || "Unable to delete rejected segments.");
    } finally {
      Ee();
    }
  }
  async function ze(X = i) {
    if (a || X.length === 0) return;
    const de = r("auto-assign", -1);
    if (!de) {
      ue("Wait for the current save to finish before assigning performers.");
      return;
    }
    try {
      await ut(X);
    } finally {
      de();
    }
  }
  async function ut(X) {
    Z(!0), ue("");
    try {
      const de = await ee(`/videos/${te.id}/segments/auto-assign-performer-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeSegmentIds: X.flatMap((Me) => Me.nativeSegmentId == null ? [] : [Me.nativeSegmentId]),
          itemIds: X.flatMap((Me) => Me.published || Me.itemId == null ? [] : [Me.itemId])
        })
      });
      ne(!1), await D(), _(`${de.assignedSegmentCount} segment${de.assignedSegmentCount === 1 ? "" : "s"} received ${de.assignedSlotCount} performer-slot assignment${de.assignedSlotCount === 1 ? "" : "s"}.`);
    } catch (de) {
      ue(de.message || "Unable to auto-assign performers.");
    } finally {
      Z(!1);
    }
  }
  async function bt() {
    k(!0), h(""), !A && (v(!0), se());
  }
  function Ze() {
    C.current = !0, k(!1), requestAnimationFrame(() => {
      var X;
      return (X = $.current) == null ? void 0 : X.focus({ preventScroll: !0 });
    });
  }
  async function mt() {
    if (!A || S || A.createCount + A.linkCount === 0)
      return;
    const X = r("materialize", -1);
    if (!X) {
      h("Wait for the current save to finish before materializing derived segments.");
      return;
    }
    try {
      await nt();
    } finally {
      X();
    }
  }
  async function nt() {
    me(!0), h("");
    let X;
    try {
      const de = `materialize-derived:${te.id}:${A.fingerprint}`;
      X = await ee(`/videos/${te.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(de),
          fingerprint: A.fingerprint,
          maxDepth: 3
        })
      }), Be(de);
    } catch (de) {
      de.status === 409 && H(null), h(de.message || "Unable to materialize derived segments."), me(!1);
      return;
    }
    H((de) => de && { ...de, createCount: 0, linkCount: 0 });
    try {
      await D(), Ze(), H(null);
      const de = X.createdCount + X.linkedCount;
      _(`${X.createdCount} derived segment${X.createdCount === 1 ? "" : "s"} created and ${X.linkedCount} existing segment${X.linkedCount === 1 ? "" : "s"} linked.`), de === 0 && _("Every applicable derivation was already materialized.");
    } catch {
      h("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    me(!1);
  }
  async function dt(X, de = null) {
    var ye, Ue, qe, Ve;
    const Me = {
      tagId: X,
      ...de ? { tagName: de } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (fe.length > 1) {
      const Ie = fe.filter((Se) => Se.tagId !== X);
      if (Ie.length === 0) {
        d();
        return;
      }
      const Ee = fe.map((Se) => ({
        id: Se.id,
        itemId: Se.itemId,
        nativeSegmentId: Se.nativeSegmentId
      })), _e = fe.map((Se) => !c || Se.nativeSegmentId != null ? `native:${Se.nativeSegmentId}:${Se.updatedAt}` : `item:${Se.itemId}:${Se.revision}`).sort().join(","), we = `bulk-tag:${te.id}:${X}:${_e}`, Oe = r("tag", (Q == null ? void 0 : Q.id) ?? Ie[0].id);
      if (!Oe) return;
      _(`Changing tag for ${Ie.length} selected segment${Ie.length === 1 ? "" : "s"}…`);
      const Je = Qt();
      y({
        type: "add",
        entry: { id: Je, op: "patch", targets: Ie.map(Gt), values: Me }
      }), d();
      try {
        const Se = c ? null : crypto.randomUUID();
        await ee(`/videos/${te.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(we),
            tagId: X,
            historyReceiptId: Se,
            segments: fe.map((at) => {
              const St = !c || at.nativeSegmentId != null;
              return {
                nativeSegmentId: St ? at.nativeSegmentId : null,
                itemId: St ? null : at.itemId,
                expectedUpdatedAt: St ? at.updatedAt : null,
                expectedRevision: St ? null : at.revision
              };
            })
          })
        }), Be(we);
        const Fe = Rt(
          fe,
          c
        ), De = await D();
        y({ type: "settle", key: Je });
        const $t = Ee.map((at) => Ye(De == null ? void 0 : De.segments, at)).filter(Boolean);
        await q(
          "segments.tag",
          `Changed tag for ${Ie.length} segment${Ie.length === 1 ? "" : "s"}`,
          Fe,
          Rt($t, c),
          Se
        );
        const et = Ee.map((at) => Ye(De == null ? void 0 : De.segments, at)).filter(Boolean);
        U(et.map((at) => at.id)), B(((ye = et.find((at) => at.id === (Q == null ? void 0 : Q.id))) == null ? void 0 : ye.id) ?? ((Ue = et[0]) == null ? void 0 : Ue.id) ?? null), d(), _(`${Ie.length} selected segment${Ie.length === 1 ? "" : "s"} retagged.`);
      } catch (Se) {
        y({ type: "discard", key: Je });
        const Fe = Ee.map(($t) => Ye(u.segments, $t)).filter(Boolean), De = Ye(u.segments, {
          id: Q == null ? void 0 : Q.id,
          itemId: Q == null ? void 0 : Q.itemId,
          nativeSegmentId: Q == null ? void 0 : Q.nativeSegmentId
        }) || Fe[0] || null;
        U(Fe.map(($t) => $t.id)), B((De == null ? void 0 : De.id) ?? null), be.current = (De == null ? void 0 : De.id) ?? null, re.current = [], Se.status === 409 && await ae(), _(Se.message || "Unable to change the selected segment tags.");
      } finally {
        Oe();
      }
      return;
    }
    if (fe.length !== 1 || !Q) return;
    const Te = hi(z, Q);
    if (Q.id === g || Te) {
      const Ie = Te ? { segmentId: Q.id, tagId: Te.values.tagId, tagName: Te.meta.tagName } : null, Ee = cl(Ie, Q, X, de);
      if (Te && (p((_e) => {
        var we;
        return ((we = _e.meta) == null ? void 0 : we.pendingChangeId) === Te.id;
      }), y({ type: "discard", key: Te.id })), Ee && rt(Q, Ee), Ee) {
        const _e = Ha(
          { ...Q, tagId: Ee.tagId },
          M,
          f,
          x,
          Y
        );
        le(_e.filters), T(_e.hideDerivedSegments), _("Tag change queued…");
      } else Te && _("");
      d();
      return;
    }
    if (X === Q.tagId) {
      d();
      return;
    }
    if (Q.itemId != null && ((Ve = (qe = L.data) == null ? void 0 : qe.children) == null ? void 0 : Ve.length) > 0) {
      const Ie = r("lineage-tag", Q.id);
      if (!Ie) return;
      _("Checking lineage impact…");
      let Ee;
      try {
        Ee = await ee(`/items/${Q.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: Q.revision, tagId: X })
        });
      } catch (Je) {
        Je.status === 409 ? (_("Lineage changed — loading the latest segments…"), await ae()) : _(Je.message || "Unable to reconcile the lineage.");
        return;
      } finally {
        Ie();
      }
      const _e = Ee.deletedItemIds.length > 0 || Ee.removedEdgeIds.length > 0;
      if (_e && !window.confirm(
        `Changing this tag removes ${Ee.removedEdgeIds.length} lineage edge${Ee.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${Ee.deletedItemIds.length} derived segment${Ee.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
      )) {
        _("Tag change canceled.");
        return;
      }
      const we = r("lineage-tag", Q.id);
      if (!we) {
        _("Wait for the current save to finish before changing the tag.");
        return;
      }
      const Oe = Qt();
      y({
        type: "add",
        entry: { id: Oe, op: "patch", targets: [Gt(Q)], values: Me }
      }), d();
      try {
        const Je = `tag-change:${Q.itemId}:${Q.revision}:${Ee.componentFingerprint}:${X}`;
        await ee(`/items/${Q.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(Je),
            expectedRevision: Q.revision,
            componentFingerprint: Ee.componentFingerprint,
            tagId: X
          })
        }), Be(Je), await D(), y({ type: "settle", key: Oe }), d(), _(_e ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch (Je) {
        y({ type: "discard", key: Oe }), U([Q.id]), B(Q.id), be.current = Q.id, re.current = [], Je.status === 409 ? (_("Lineage changed — loading the latest segments…"), await ae()) : _(Je.message || "Unable to reconcile the lineage.");
      } finally {
        we();
      }
      return;
    }
    d(), await w(Q, {
      startSec: Q.startSec,
      endSec: Q.endSec,
      tagId: X
    }, !0, null, !0, Me);
  }
  function rt(X, de) {
    const Me = Qt();
    y({
      type: "add",
      entry: {
        id: Me,
        op: "patch",
        targets: [Gt(X)],
        values: { tagId: de.tagId, tagName: de.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: de.tagName }
      }
    });
    const Te = z.find((ye) => ye.op === "insert" && ye.segment.id === X.id);
    b({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [Gt(X)],
      dependsOn: (Te == null ? void 0 : Te.taskId) ?? null,
      meta: { pendingChangeId: Me },
      ready: (ye, Ue) => {
        const qe = yi(ye.segments, Ue.targets[0]);
        return !qe || ul(ye, qe.id);
      },
      run: (ye) => ct(ye, Me, de)
    });
  }
  async function ct(X, de, Me) {
    const [Te] = X.resolveTargets();
    if (!Te || Te.tagId === Me.tagId) {
      y({ type: "discard", key: de });
      return;
    }
    await E(Te, {
      startSec: Te.startSec,
      endSec: Te.endSec,
      tagId: Me.tagId
    }, {
      pendingChangeId: de,
      restoreSelectionOnFailure: !1,
      onReload: X.onReload,
      onConflict: X.onConflict
    }) || _(`The new segment was not retagged${Me.tagName ? ` to ${Me.tagName}` : ""}. Choose its tag again.`);
  }
  async function He() {
    var Ve, Ie, Ee, _e;
    if (!l || !Q || J != null) return;
    const X = [...fe].sort((we, Oe) => Number(we.nativeSegmentId ?? we.id) - Number(Oe.nativeSegmentId ?? Oe.id)), de = new Set(X.map((we) => we.id)), Me = X.map((we) => `${we.nativeSegmentId ?? we.id}:${we.updatedAt}`).join("|"), Te = r("bin", Q.id);
    if (!Te) return;
    _(`Moving ${X.length} segment${X.length === 1 ? "" : "s"} to recycling bin…`);
    const ye = `bulk-move:${te.id}:${Me}`, Ue = je(ye), qe = c ? null : crypto.randomUUID();
    try {
      const we = (Fe = !1) => ee(`/videos/${te.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ue,
          segments: X.map((De) => ({
            segmentId: De.nativeSegmentId ?? De.id,
            expectedUpdatedAt: De.updatedAt
          })),
          discardMissingImage: Fe,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: qe
        })
      });
      let Oe;
      try {
        Oe = await we(
          co(ye)
        );
      } catch (Fe) {
        if (((Ve = Fe.payload) == null ? void 0 : Ve.code) !== "missing-image" || !window.confirm(`${Fe.message}

Continue and discard the missing image reference?`)) throw Fe;
        uo(ye), Oe = await we(!0);
      }
      Be(ye), _n();
      const Je = new Map((Oe.items || []).map((Fe) => [
        Number(Fe.segmentId),
        Fe
      ]));
      await q(
        "segments.moveToBin",
        `Moved ${X.length} segment${X.length === 1 ? "" : "s"} to recycling bin`,
        Rt(X, !1),
        Rt(X.map((Fe) => {
          const De = Je.get(
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
        qe
      );
      const Se = _s(o, de, Q.id);
      O((Fe) => ({
        ...Fe,
        segments: (Fe.segments || []).filter((De) => !de.has(De.id))
      }), te.id), U(Se ? [Se.id] : []), B((Se == null ? void 0 : Se.id) ?? null), be.current = (Se == null ? void 0 : Se.id) ?? null, re.current = [], Se && (j(Ot(o, Se.id)), xe(Se.id)), requestAnimationFrame(() => {
        var Fe;
        return (Fe = m.current) == null ? void 0 : Fe.focus({ preventScroll: !0 });
      }), _(`Moved ${X.length} segment${X.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (we) {
      const Oe = ((Ie = we.payload) == null ? void 0 : Ie.code) || ((_e = (Ee = we.payload) == null ? void 0 : Ee.result) == null ? void 0 : _e.code);
      we.status === 409 && Oe === "CANONICAL_SEGMENT_CHANGED" ? await ae() : _(we.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Te();
    }
  }
  async function ht() {
    if (!(c || s.current || J != null)) {
      s.current = !0, _("Checking the recycling bin…");
      try {
        const X = await ee("/bin"), de = await ai(X, () => _("Emptying the recycling bin…"));
        if (de.status === "empty") {
          _("The recycling bin is empty.");
          return;
        }
        if (de.status === "canceled") {
          _("The recycling bin was not emptied.");
          return;
        }
        _(`${de.segmentCount} segment${de.segmentCount === 1 ? "" : "s"} from ${de.sceneCount} scene${de.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (X) {
        _(X.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: Ce, removeIncorrectExample: he, captureTrainingExport: Pe, deleteRejectedSegments: $e, autoAssignPerformers: ze, previewDerivedSegments: bt, closeMaterializeDialog: Ze, materializeDerivedSegments: mt, saveTag: dt, moveToBin: He, emptyRecyclingBin: ht };
}
function Ic(e) {
  const { acceptHistory: t, acquireSaveLock: r, enqueueSave: o, getSaveQueueSnapshot: i, commonActionsRef: a, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: g, history: u, historyRef: f, historySaving: m, horizontalLayoutSize: p, mediaStackHeight: y, mediaStackRef: b, onDetailChange: I, onReload: x, railToggleRef: K, recordHistoryAction: L, savingSegmentId: $, setCollapsedSegmentGroups: A, setEditorLayout: C, setHistorySaving: S, setIncorrectExamples: w, setSaveMessage: E, shotBoundaries: z, timelineDuration: ae, video: O, workspaceRef: D } = e;
  async function M(T, R, h) {
    var me, G, W, _;
    const v = T.type === "segment" ? [T] : T.segments || [], k = (R == null ? void 0 : R.type) === "segment" ? [R] : (R == null ? void 0 : R.segments) || [];
    let H = h;
    for (const [j, B] of v.entries()) {
      const U = k[j], te = ((me = B.identity) == null ? void 0 : me.nativeSegmentId) != null || ((G = B.identity) == null ? void 0 : G.published) === !0, Ce = ((W = U == null ? void 0 : U.identity) == null ? void 0 : W.recycleBinItemId) ?? ((_ = U == null ? void 0 : U.identity) == null ? void 0 : _.itemId);
      let he = Ye(H.segments, U == null ? void 0 : U.identity) || Ye(H.segments, B.identity);
      if (!he && te && Ce != null && U.identity.revision != null) {
        const $e = `history-restore:${O.id}:${Ce}:${U.identity.revision}`;
        await ee(`/bin/${Ce}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je($e),
            expectedRevision: U.identity.revision
          })
        }), Be($e), H = await x(), he = H.segments.find((ze) => ze.tagId === B.values.tagId && ze.startSec === B.values.startSec && ze.endSec === B.values.endSec);
      }
      if (!he)
        throw new Error("A segment in this history state no longer exists.");
      if ((he.nativeSegmentId != null || he.published === !0) !== te) {
        if (te) {
          const $e = he.recycleBinItemId ?? he.itemId ?? Ce;
          if ($e == null)
            throw new Error("This recycled segment can no longer be restored.");
          const ze = `history-restore:${O.id}:${$e}:${he.revision}:${B.values.reviewState ?? "native"}`;
          await ee(`/bin/${$e}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(ze),
              expectedRevision: he.revision
            })
          }), Be(ze);
        } else {
          const $e = `history-bin:${O.id}:${he.nativeSegmentId}:${he.updatedAt}:${B.values.reviewState}`;
          await ee(`/videos/${O.id}/segments/${he.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je($e),
              expectedUpdatedAt: he.updatedAt,
              reviewState: B.values.reviewState
            })
          }), Be($e);
        }
        if (H = await x(), !te)
          continue;
        if (he = Ye(H.segments, B.identity) || H.segments.find(($e) => $e.tagId === B.values.tagId && $e.startSec === B.values.startSec && $e.endSec === B.values.endSec), !he)
          throw new Error("The restored segment could not be found.");
      }
      const Pe = B.values;
      if (he.nativeSegmentId == null && he.itemId != null) {
        const $e = `history-draft-update:${O.id}:${he.itemId}:${he.revision}:${Pe.tagId}:${Pe.startSec}:${Pe.endSec ?? "open"}:${Pe.reviewState}`;
        await ee(`/videos/${O.id}/drafts/${he.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je($e),
            expectedRevision: he.revision,
            ...Pe
          })
        }), Be($e);
      } else
        await ee(`/videos/${O.id}/segments/${he.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Pe, expectedUpdatedAt: he.updatedAt })
        });
      H = await x();
    }
    return H;
  }
  async function q(T, R) {
    var h;
    for (const v of T.targets || []) {
      const k = Ye(R.segments, v.identity);
      if (!k)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const H = (h = R.performerSlotRevisions) == null ? void 0 : h[k.id];
      await ee(k.published ? `/videos/${O.id}/segments/${k.nativeSegmentId}/slots` : `/videos/${O.id}/drafts/${k.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: H,
          assignments: v.assignments
        })
      }), R = await x();
    }
    return R;
  }
  async function se(T, R, h) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let v = R, k = await ee(`/videos/${O.id}/incorrect-examples`);
    const H = (me) => k.find((G) => {
      var W;
      return G.id === me.exampleId || ((W = me.collectedIdentity) == null ? void 0 : W.itemId) != null && G.itemId === me.collectedIdentity.itemId;
    });
    for (const [me, G] of (T.entries || []).entries()) {
      const W = `history-feedback:${O.id}:${h.action.sequence}:${h.direction}:${me}`, _ = H(G);
      if (T.collected && _) {
        Be(W);
        continue;
      }
      let j;
      if (T.collected) {
        const B = Ye(
          v.segments,
          G.collectedIdentity
        ) || Ye(
          v.segments,
          G.originalIdentity
        );
        if (!B)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const U = B.nativeSegmentId != null;
        j = await ee(`/videos/${O.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(W),
            nativeSegmentId: U ? B.nativeSegmentId : null,
            itemId: U ? null : B.itemId,
            expectedUpdatedAt: U ? B.updatedAt : null,
            expectedRevision: U ? null : B.revision
          })
        });
      } else {
        if (!_) {
          Be(W);
          continue;
        }
        j = await ee(
          `/videos/${O.id}/incorrect-examples/${_.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(W),
              expectedExampleRevision: _.revision,
              expectedRepresentationRevision: _.representationRevision
            })
          }
        );
      }
      Be(W), v = vr(
        v,
        j.editorDelta
      ), k = await ee(
        `/videos/${O.id}/incorrect-examples`
      );
    }
    return w(k), v;
  }
  async function ie(T, R, h = []) {
    const v = T.state;
    if (!s && ((v == null ? void 0 : v.type) === "segment" || (v == null ? void 0 : v.type) === "segments")) {
      const H = `basic-history:${O.id}:${f.current.revision}:${T.action.sequence}:${T.direction}`, me = await ee(`/videos/${O.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(H),
          expectedHistoryRevision: f.current.revision,
          actionSequence: T.action.sequence,
          direction: T.direction
        })
      });
      return t(me.history), h.push(H), x();
    }
    const k = T.direction === "backward" ? T.action.afterState : T.action.beforeState;
    if ((v == null ? void 0 : v.type) === "composite") {
      let H = R;
      const me = (k == null ? void 0 : k.type) === "composite" ? k.states || [] : [];
      for (const [G, W] of (v.states || []).entries()) {
        const _ = me[G];
        H = await ie({
          ...T,
          state: W,
          action: {
            ...T.action,
            beforeState: T.direction === "backward" ? W : _,
            afterState: T.direction === "backward" ? _ : W
          }
        }, H, h);
      }
      return H;
    }
    if ((v == null ? void 0 : v.type) === "segment" || (v == null ? void 0 : v.type) === "segments")
      return M(
        v,
        k,
        R
      );
    if ((v == null ? void 0 : v.type) === "performerSlots")
      return q(v, R);
    if ((v == null ? void 0 : v.type) === "incorrectExamples")
      return se(v, R, T);
    if ((v == null ? void 0 : v.type) === "shots") {
      const H = qn(R.shotBoundaries || []), me = await ee(`/videos/${O.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(`history-shots:${O.id}:${H}:${v.fingerprint}`),
          expectedFingerprint: H,
          boundaries: v.boundaries
        })
      });
      return { ...R, shotBoundaries: me };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function xe(T) {
    var v;
    if (m || $ != null || T === u.cursorSequence)
      return;
    const R = Yl(u, T);
    if (R.length === 0) return;
    const h = r("history", -1);
    if (h) {
      S(!0), E(`Restoring ${R.length} history ${R.length === 1 ? "action" : "actions"}…`);
      try {
        let k = d;
        const H = [];
        for (const G of R)
          k = await ie(
            G,
            k,
            H
          );
        const me = s ? await ee(`/videos/${O.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: f.current.revision,
            targetSequence: T
          })
        }) : f.current;
        H.forEach(Be), t(me), await x(), E("History restored.");
      } catch (k) {
        k.status === 409 && ((v = k.payload) != null && v.current) && t(k.payload.current), await x(), E(k.message || "Unable to restore editor history.");
      } finally {
        h(), S(!1);
      }
    }
  }
  function J(T) {
    C((R) => ({ ...R, timelineRatio: so(T, y) }));
  }
  function Y(T) {
    var v, k;
    const R = (v = b.current) == null ? void 0 : v.getBoundingClientRect();
    if (!R) return;
    const h = ((k = a.current) == null ? void 0 : k.offsetHeight) || 0;
    J(Ms(
      T.clientY,
      R.top + h,
      Math.max(0, R.height - h)
    ));
  }
  function oe(T) {
    T.currentTarget.setPointerCapture(T.pointerId), Y(T);
  }
  function Q(T) {
    T.currentTarget.hasPointerCapture(T.pointerId) && Y(T);
  }
  function ve(T) {
    const R = T.shiftKey ? 0.1 : 0.05;
    let h = null;
    T.key === "ArrowUp" && (h = c.timelineRatio + R), T.key === "ArrowDown" && (h = c.timelineRatio - R);
    const v = io(y);
    T.key === "Home" && (h = v.minimum), T.key === "End" && (h = v.maximum), h != null && (T.preventDefault(), T.stopPropagation(), J(h));
  }
  function fe(T) {
    const R = T === "detailWidth" ? p.focusRow : p.workspace, h = p.workspace > 0 ? Yr(p.workspace, 600) : 560, v = ln(c.markerRailWidth, h), k = T === "detailWidth" ? 344 + (c.markerRailOpen ? v + 24 : 0) : 600;
    return R > 0 ? Yr(R, k) : 560;
  }
  function be(T, R) {
    C((h) => ({ ...h, [T]: ln(R, fe(T)) }));
  }
  function re(T, R) {
    var v, k;
    const h = R === "detailWidth" ? (v = g.current) == null ? void 0 : v.getBoundingClientRect() : (k = D.current) == null ? void 0 : k.getBoundingClientRect();
    h && be(R, R === "detailWidth" ? T.clientX - h.left : h.right - T.clientX);
  }
  function ue(T, R) {
    const h = fe(T), v = ln(c[T], h);
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
        const H = k.shiftKey ? 40 : 16;
        let me = null;
        k.key === "ArrowLeft" && (me = T === "detailWidth" ? -H : H), k.key === "ArrowRight" && (me = T === "detailWidth" ? H : -H);
        let G = me == null ? null : v + me;
        k.key === "Home" && (G = 240), k.key === "End" && (G = h), G != null && (k.preventDefault(), k.stopPropagation(), be(T, G));
      },
      onDoubleClick: () => be(T, Tt[T]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function ne() {
    C((T) => ({ ...T, markerRailOpen: !T.markerRailOpen })), requestAnimationFrame(() => {
      var T;
      return (T = K.current) == null ? void 0 : T.focus({ preventScroll: !0 });
    });
  }
  function Z(T) {
    A((R) => R.includes(T) ? R.filter((h) => h !== T) : en([...R, T]));
  }
  function le(T, R = !0, h = l) {
    const v = i().running != null, k = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (H) => V(H.detail, T, R, h)
    });
    return k ? (v && E(T === "split" ? "Shot boundary queued…" : "Shot merge queued…"), k.done.then((H) => H.value ?? null)) : Promise.resolve(null);
  }
  async function V(T, R, h, v) {
    var W;
    const k = (T == null ? void 0 : T.shotBoundaries) || [], H = Number((W = O.videoFile) == null ? void 0 : W.duration) || ae, me = qn(k), G = `shot-${R}:${O.id}:${v.toFixed(3)}:${H.toFixed(3)}:${me}`;
    E(R === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const _ = await ee(`/videos/${O.id}/shot-boundaries/${R}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: je(G), timeSec: v })
      });
      return Be(G), I((j) => ({ ...j, shotBoundaries: _ }), O.id), h && await L(
        "shots.update",
        R === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: k,
          fingerprint: me
        },
        {
          type: "shots",
          boundaries: _,
          fingerprint: qn(_)
        }
      ), E(R === "split" ? "Shot boundary added." : "Shots merged."), _;
    } catch (_) {
      return E(_.message || "Unable to edit shot boundaries."), null;
    }
  }
  return { applySegmentHistoryState: M, applyPerformerSlotHistoryState: q, applyHistoryState: ie, restoreHistoryTarget: xe, updateTimelineRatio: J, updateTimelineRatioFromPointer: Y, handleSeparatorPointerDown: oe, handleSeparatorPointerMove: Q, handleSeparatorKeyDown: ve, panelWidthMaximum: fe, updatePanelWidth: be, handlePanelSeparatorPointer: re, panelSeparatorProps: ue, toggleSegmentRail: ne, toggleSegmentGroup: Z, mutateShotBoundary: le };
}
function Cc(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: u, lineage: f, mediaDuration: m, mergeSelectedSwimlane: p, moveToBin: y, mutateShotBoundary: b, openPublishApprovedDialog: I, playbackControlsRef: x, playbackShortcutConfig: K, saveSelectedReviewState: L, seekRef: $, segmentGroupKeys: A, selectSegment: C, selectedSegment: S, selectedSegmentGroupForSegment: w, selectedSegmentGroupKey: E, selectedSegments: z, setCollapsedSegmentGroups: ae, setIncorrectExamplesOpen: O, setQuickSearchOpen: D, setSaveMessage: M, setSelectedSegmentGroupKey: q, setTagEditing: se, setTimelineZoom: ie, shotBoundaries: xe, slotButtonRef: J, splitSegment: Y, swimlanes: oe, timelineDuration: Q, toggleIncorrectExample: ve, toggleSegmentGroup: fe, updateTimelineRatio: be, videoFrameRate: re, visibleSegments: ue } = e;
  function ne(V) {
    var T, R;
    (T = x.current) == null || T.pause(), (R = x.current) == null || R.seekBy(pl(V, re));
  }
  function Z(V, T) {
    if (z.length > 1 && Zs(V.id))
      return;
    let R = null;
    V.id === "video.playPause" && (R = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.toggle();
    }), V.id === "video.seekSmallBackward" && (R = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(-K.smallSeekTime);
    }), V.id === "video.seekSmallForward" && (R = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(K.smallSeekTime);
    }), V.id === "video.seekMediumBackward" && (R = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(-K.mediumSeekTime);
    }), V.id === "video.seekMediumForward" && (R = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(K.mediumSeekTime);
    }), V.id === "video.seekLongBackward" && (R = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(-K.longSeekTime);
    }), V.id === "video.seekLongForward" && (R = () => {
      var h;
      return (h = x.current) == null ? void 0 : h.seekBy(K.longSeekTime);
    }), V.id === "video.playSelected" && S && (R = () => {
      var h;
      (h = $.current) == null || h.call($, S.startSec, !0), requestAnimationFrame(() => {
        var v;
        return (v = g.current) == null ? void 0 : v.focus({ preventScroll: !0 });
      });
    }), (V.id === "video.playPreviousSegment" || V.id === "video.playNextSegment") && (R = () => {
      var v;
      const h = to(
        oe,
        S == null ? void 0 : S.id,
        V.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !h || h.id === (S == null ? void 0 : S.id) || (C(h, { focusEditor: !0, seekToSegment: !1 }), (v = $.current) == null || v.call($, h.startSec, !0));
    }), V.id.startsWith("video.seekPercent") && (R = () => {
      var v;
      const h = Number(V.id.slice(17)) / 10;
      (v = $.current) == null || v.call($, Vs(m ?? Q, h), !1);
    }), V.id === "video.jumpToSegmentStart" && S && (R = () => {
      var h;
      return (h = $.current) == null ? void 0 : h.call($, S.startSec, !1);
    }), V.id === "video.jumpToSegmentEnd" && S && (R = () => {
      var h;
      return (h = $.current) == null ? void 0 : h.call($, S.endSec ?? S.startSec, !1);
    }), V.id === "video.jumpToVideoStart" && (R = () => {
      var h;
      return (h = $.current) == null ? void 0 : h.call($, 0, !1);
    }), V.id === "video.jumpToVideoEnd" && (R = () => {
      var h;
      return (h = $.current) == null ? void 0 : h.call($, Q, !1);
    }), V.id.startsWith("video.frame") && (R = () => {
      const h = V.id.includes("Small") ? "small" : V.id.includes("Medium") ? "medium" : "long", v = K[`${h}FrameStep`] * (V.id.endsWith("Backward") ? -1 : 1);
      ne(v);
    }), V.id.startsWith("navigation.swimlane") && (R = () => {
      const h = V.id.slice(19).toLowerCase(), v = to(oe, S == null ? void 0 : S.id, h, s);
      v && C(v, { focusEditor: !0, seekToSegment: !1 });
    }), (V.id === "navigation.extendSwimlaneLeft" || V.id === "navigation.extendSwimlaneRight") && (R = () => {
      const h = md(
        t,
        S == null ? void 0 : S.id,
        V.id.endsWith("Left") ? "left" : "right"
      );
      h && C(h.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: h.segmentIds
      });
    }), (V.id === "navigation.segmentGroupUp" || V.id === "navigation.segmentGroupDown") && (R = () => {
      const h = gd(
        A,
        E ?? w,
        V.id.endsWith("Up") ? -1 : 1
      );
      h && q(h);
    }), (V.id === "navigation.previousAtPlayhead" || V.id === "navigation.nextAtPlayhead") && (R = () => {
      const h = Es(ue, s, V.id === "navigation.previousAtPlayhead" ? -1 : 1, S == null ? void 0 : S.id);
      h && C(h, { focusEditor: !0, seekToSegment: !1 });
    }), V.id === "navigation.nearestInCurrentSwimlane" && (R = () => {
      const h = Ss(
        oe,
        S == null ? void 0 : S.id,
        s
      );
      h && C(h, { focusEditor: !0, seekToSegment: !1 });
    }), V.id.includes("Unreviewed") && (R = () => {
      const h = Sr(
        oe,
        S == null ? void 0 : S.id,
        V.id.startsWith("navigation.previous") ? -1 : 1,
        V.id.endsWith("Global")
      );
      h && C(h, { focusEditor: !T.preserveFocus, seekToSegment: !1 });
    }), (V.id === "navigation.nextTouchingPlayhead" || V.id === "navigation.previousTouchingPlayhead") && (R = () => {
      const h = xs(oe, s, V.id === "navigation.previousTouchingPlayhead" ? -1 : 1, S == null ? void 0 : S.id);
      h && C(h, { focusEditor: !0, seekToSegment: !1 });
    }), V.id === "navigation.quickSearch" && (R = () => D(!0)), (V.id === "navigation.previousShot" || V.id === "navigation.nextShot") && (R = () => {
      var v;
      const h = gl(xe, s, V.id === "navigation.previousShot" ? -1 : 1);
      h && ((v = $.current) == null || v.call($, h.startSec, !1));
    }), V.id === "shot.split" && (R = () => b("split")), V.id === "shot.merge" && (R = () => b("merge")), V.id === "marker.create" && (R = () => a()), V.id === "marker.duplicate" && (R = () => d(!1)), V.id === "marker.duplicateAtPlayhead" && (R = () => d(!0)), V.id === "marker.split" && (R = () => Y()), V.id === "marker.editTag" && (R = () => {
      var h;
      if (z.length > 1 && z.some((v) => v.isDerived)) {
        M("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((h = f.data) != null && h.tagReadOnly) {
        M("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      se(!0);
    }), V.id === "marker.setStart" && S && (R = () => r(s, S.endSec)), V.id === "marker.setEnd" && S && (R = () => r(S.startSec, s)), V.id === "marker.copyTiming" && S && (R = () => {
      M(qd(S) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), V.id === "marker.pasteTiming" && S && (R = () => {
      const h = Hd();
      if (!h) {
        M("No copied segment timing is available.");
        return;
      }
      r(h.startSec, h.endSec);
    }), V.id === "marker.mergeSelection" && (R = () => p()), V.id === "marker.moveToBin" && (R = () => y()), V.id === "marker.toggleIncorrectExample" && S && (R = () => ve()), V.id === "marker.openIncorrectExamples" && (R = () => O(!0)), V.id === "markerGroup.toggleCollapse" && E && (R = () => fe(E)), V.id === "markerGroup.toggleAll" && (R = () => ae((h) => ud(h, A))), V.id === "marker.assignSlots" && (R = () => {
      var h;
      return (h = J.current) == null ? void 0 : h.click();
    }), V.id === "navigation.zoomIn" && (R = () => ie((h) => kr(h + 0.5))), V.id === "navigation.zoomOut" && (R = () => ie((h) => kr(h - 0.5))), V.id === "navigation.resetZoom" && (R = () => ie(1)), V.id === "navigation.centerPlayhead" && (R = () => {
      var h;
      return (h = o.current) == null ? void 0 : h.call(o);
    }), V.id === "layout.growSwimlanes" && (R = () => be(c.timelineRatio + 0.05)), V.id === "layout.shrinkSwimlanes" && (R = () => be(c.timelineRatio - 0.05)), V.id === "marker.confirm" && S && (R = () => L("approved")), V.id === "system.publishApproved" && (R = () => I(T.target)), V.id === "marker.reject" && S && (R = () => L("rejected")), V.id === "system.emptyBin" && (R = () => u()), V.id === "system.deleteRejected" && (R = () => l()), R && R();
  }
  function le(V, T) {
    const R = Qn.find((h) => h.id === V);
    R && xn(R, i) && Z(R, T);
  }
  return {
    executeShortcutById: le,
    stepVideoFrame: (V) => ne(V < 0 ? -1 : 1)
  };
}
function ba(e) {
  return e === !0;
}
function ha() {
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
function $c(e, t, r = !1, o = 0, i = "", a = () => () => {
}) {
  const [s, l] = F(null), [d, c] = F(null), [g, u] = F(""), [f, m] = F({
    busy: !1,
    reviewState: null,
    error: ""
  }), p = ge(null);
  async function y(x) {
    const K = a("import", -1);
    if (!K) {
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
      K();
    }
  }
  async function b(x) {
    try {
      const K = await ee(`/videos/${e}/analysis-runs`, {
        signal: x.signal
      });
      if (!x.isActive()) return null;
      const L = (K == null ? void 0 : K[0]) || null;
      return l(L), (L == null ? void 0 : L.status) === "completed" && p.current !== L.id && (p.current = L.id, await t()), ((L == null ? void 0 : L.status) === "failed" || (L == null ? void 0 : L.status) === "cancelled") && u(L.errorMessage || "Video analysis did not complete."), L;
    } catch (K) {
      return x.isActive() && K.name !== "AbortError" && u(K.message || "Unable to load video analysis status."), null;
    }
  }
  async function I(x = null) {
    u("");
    const K = x || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), L = K.includes("omnishotcut") && o > 0;
    if (!(L && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const $ = await ee(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: K,
            replaceShotBoundaries: L,
            expectedShotBoundaryFingerprint: L ? i : null
          })
        });
        l($);
      } catch ($) {
        u($.message || "Unable to start video analysis.");
      }
  }
  return pe(() => {
    if (!ba(r)) {
      l(null), c(null), u("");
      return;
    }
    const x = ha();
    return b(x), ee("/analysis/status", { signal: x.signal }).then((K) => {
      x.isActive() && (c(K), K.configured || u(""));
    }).catch((K) => {
      x.isActive() && K.name !== "AbortError" && u(K.message || "Unable to check video analysis readiness.");
    }), x.dispose;
  }, [e, r]), pe(() => {
    if (!ba(r) || (s == null ? void 0 : s.status) !== "queued" && (s == null ? void 0 : s.status) !== "running") return;
    const x = ha();
    let K = setTimeout(async function L() {
      await b(x), x.isActive() && (K = setTimeout(L, 2500));
    }, 2500);
    return () => {
      clearTimeout(K), x.dispose();
    };
  }, [s == null ? void 0 : s.id, s == null ? void 0 : s.status, r]), {
    analysisError: g,
    analysisRun: s,
    analysisStatus: d,
    importNativeSegments: y,
    nativeImportState: f,
    startFullAnalysis: I
  };
}
const Hn = Object.freeze([]);
function Tc(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Ac({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var Do, Po, Oo, Lo, Fo;
  const [g, u] = F(null), [f, m] = F([]), p = ge(null), y = ge(null), b = ge([]), I = ge(null), [x, K] = F(() => Mt({})), [L, $] = F(!1), [A, C] = F(Js), [S, w] = F(0), E = ge(null), [z] = F(() => $d({
    getContext: () => E.current,
    drainAfterSettle: !1
  })), ae = Dl(z.subscribe, z.getSnapshot), O = bi(ae), D = (P, ce) => z.acquire({ kind: P, lockId: ce }), M = (P) => z.enqueue(P), q = (P) => z.cancel(P), se = (P, ce) => z.retarget(P, ce), ie = z.getSnapshot, [xe, J] = El(Ld, []), [Y, oe] = F(""), [Q, ve] = F(""), [fe, be] = F(""), [re, ue] = F(1), [ne, Z] = F(Gd), [le, V] = F(0), [T, R] = F({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [h, v] = F(zt), k = ge(zt), [H, me] = F(!1), [G, W] = F(!1), [_, j] = F(!1), B = ge(!1);
  B.current = _;
  const [U, te] = F(null), [Ce, he] = F(!1), [Qe, Pe] = F(null), [$e, ze] = F(null), ut = ge(null), [bt, Ze] = F(!1), [mt, nt] = F(""), dt = ge(null), rt = ge(null), ct = ge(!1), [He, ht] = F(Ud), [X, de] = F(null), [Me, Te] = F(!1), [ye, Ue] = F(!1), [qe, Ve] = F(!1), [Ie, Ee] = F(!1), [_e, we] = F(!1), [Oe, Je] = F(""), {
    analysisError: Se,
    analysisRun: Fe,
    analysisStatus: De,
    importNativeSegments: $t,
    nativeImportState: et,
    startFullAnalysis: at
  } = $c(
    e.video.id,
    o,
    l,
    ((Do = e.shotBoundaries) == null ? void 0 : Do.length) || 0,
    qn(e.shotBoundaries || []),
    (P, ce) => z.acquire({ kind: P, lockId: ce })
  ), [St, kt] = F(!1), [ke, Ne] = F(null), [Ke, gt] = F(l), [ot, qt] = F(0), [lt, _t] = F(!1), [Wt, wn] = F(""), [Kt, Nn] = F(null), mn = ge(null), Vt = ge(null), In = ge(!1), [tn, nn] = F([]), [Cn, Rr] = F(!1), [Xn, Mr] = F(null), $n = jd(), Tn = ge(null), An = ge(null), rn = ge(null), er = ge(s), tr = ge(null), Rn = ge(null), on = ge(null), gn = ge(null), Mn = ge(null), vt = ge(null), nr = ge(null), En = ge(null), rr = ge(null), or = ge(null), Et = ge(null), Dn = ge(null), ar = ge(-1e12), ir = ge(null), Pn = ge(null), [On, Ln] = F({ scrollTop: 0, height: 512 });
  pe(() => {
    if (!St || lt || !Wt) return;
    const P = requestAnimationFrame(() => {
      var ce;
      return (ce = Vt.current) == null ? void 0 : ce.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(P);
  }, [St, lt, Wt]), pe(() => {
    if (!In.current || St || Ke) return;
    const P = requestAnimationFrame(() => {
      var ce;
      (ce = mn.current) == null || ce.focus({ preventScroll: !0 }), In.current = !1;
    });
    return () => cancelAnimationFrame(P);
  }, [St, Ke]);
  const tt = e.video, pt = e.segments || Hn, sr = Ge(() => JSON.stringify({
    segments: pt.map((P) => [
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
  }), [pt, e.performerSlots, e.itemMetadata]);
  pe(() => {
    if (!l) {
      Ne(null), gt(!1);
      return;
    }
    if (O != null) {
      gt(!0);
      return;
    }
    let P = !0;
    gt(!0);
    const ce = setTimeout(() => {
      ee(`/videos/${tt.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Le) => {
        P && (Ne(Le), wn(""));
      }).catch((Le) => {
        P && (Ne(null), wn(Le.message || "Unable to preview derived segments."));
      }).finally(() => {
        P && gt(!1);
      });
    }, 150);
    return () => {
      P = !1, clearTimeout(ce);
    };
  }, [l, tt.id, sr, ot, O]);
  const Er = () => qt((P) => P + 1), Dt = e.segmentGroups || Hn, We = e.performerSlots || Hn, lr = l && e.performerSlotsAvailable !== !1, Fn = Ge(
    () => (e.performerCandidates || []).filter((P) => P.isVideoPerformer),
    [e.performerCandidates]
  ), jn = e.shotBoundaries || Hn, pn = Ge(
    () => ci(We),
    [We]
  ), Jt = Ge(
    () => pt.map((P) => {
      const ce = pn.get(P.id) || [];
      return {
        ...P,
        slots: ce,
        assignment: ce.every((Le) => Le.performerId == null) ? Cl(ce, Fn) : null
      };
    }).filter((P) => P.slots.length > 0 && P.assignment != null),
    [pt, pn, Fn]
  ), Dr = Number((Po = tt.videoFile) == null ? void 0 : Po.frameRate) > 0 ? Number(tt.videoFile.frameRate) : 30;
  function Bn() {
    const P = B.current;
    j(!1), P && requestAnimationFrame(() => {
      var ce;
      return (ce = vt.current) == null ? void 0 : ce.focus({ preventScroll: !0 });
    });
  }
  function dr() {
    O == null && (Dn.current = null, he(!1), oe(""), requestAnimationFrame(() => {
      var P;
      return (P = vt.current) == null ? void 0 : P.focus({ preventScroll: !0 });
    }));
  }
  function Gn() {
    $(!1), requestAnimationFrame(() => {
      var P, ce;
      (P = En.current) != null && P.isConnected ? En.current.focus({ preventScroll: !0 }) : (ce = vt.current) == null || ce.focus({ preventScroll: !0 });
    });
  }
  pe(() => {
    Et.current === g ? (Et.current = null, j(!0)) : j(!1);
  }, [g]), pe(() => {
    var ce;
    if (!_) return;
    const P = (ce = or.current) == null ? void 0 : ce.querySelector("input");
    document.activeElement !== P && (P == null || P.focus({ preventScroll: !0 }), P == null || P.select());
  }, [_, g]), pe(() => {
    var ce;
    if (_) return;
    const P = (ce = vt.current) == null ? void 0 : ce.ownerDocument;
    P && P.activeElement === P.body && vt.current.focus({ preventScroll: !0 });
  }, [_]), pe(() => {
    var Le, it, Pt;
    const P = dn(
      zr(
        e.segments,
        e.performerSlots || [],
        Mt({}),
        l && A,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), ce = ((Le = e.segments.find((bn) => bn.id === s)) == null ? void 0 : Le.id) ?? ((it = Ga(P)) == null ? void 0 : it.id) ?? null;
    u(ce), m(ce == null ? [] : [ce]), y.current = ce, b.current = [], de(Ot(P, ce)), K(Mt({})), $(!1), Dn.current = null, he(!1), ue(1), oe(""), v(zt), k.current = zt, me(!1), (Pt = vt.current) == null || Pt.focus({ preventScroll: !0 });
  }, [tt.id, s]), pe(() => {
    const P = new AbortController();
    return ee(`/videos/${tt.id}/incorrect-examples`, { signal: P.signal }).then(nn).catch((ce) => {
      ce.name !== "AbortError" && nn([]);
    }), () => P.abort();
  }, [tt.id, d == null ? void 0 : d.effectiveMode]), pe(() => {
    const P = new AbortController();
    return ee(`/videos/${tt.id}/history`, { signal: P.signal }).then((ce) => {
      const Le = ce || zt;
      k.current = Le, v(Le);
    }).catch((ce) => {
      ce.name !== "AbortError" && oe(ce.message || "Unable to load editor history.");
    }), () => P.abort();
  }, [tt.id]), pe(() => {
    zd(ne);
  }, [ne.timelineRatio, ne.markerRailOpen, ne.detailWidth, ne.markerRailWidth, ne.swimlaneTitleWidth]), pe(() => {
    Kd(He);
  }, [He]), pe(() => {
    Ys(A);
  }, [A]), pe(() => {
    const P = Rn.current;
    if (!a || !P || typeof ResizeObserver > "u") return;
    const ce = () => {
      var Pt;
      const it = Math.max(0, P.clientHeight - (((Pt = on.current) == null ? void 0 : Pt.offsetHeight) || 0));
      V(it), Z((bn) => {
        const jo = so(bn.timelineRatio, it);
        return jo === bn.timelineRatio ? bn : { ...bn, timelineRatio: jo };
      });
    }, Le = new ResizeObserver(ce);
    return Le.observe(P), on.current && Le.observe(on.current), ce(), () => Le.disconnect();
  }, [a]), pe(() => {
    if (!$n || typeof ResizeObserver > "u") return;
    const P = Mn.current, ce = gn.current;
    if (!P || !ce) return;
    const Le = () => R({
      workspace: P.clientWidth,
      focusRow: ce.clientWidth,
      focusRowHeight: ce.clientHeight
    }), it = new ResizeObserver(Le);
    return it.observe(P), it.observe(ce), Le(), () => it.disconnect();
  }, [$n, ne.markerRailOpen]);
  const jt = Ge(
    () => Od(pt, xe),
    [pt, xe]
  );
  Ml(() => {
    xi(xe, e) !== xe && J({ type: "prune", detail: e });
  }, [e, xe]);
  const ft = Ge(
    () => la(
      zr(
        jt,
        We,
        x,
        l && A,
        Dt
      ),
      tn,
      !0
    ),
    [
      jt,
      We,
      x,
      A,
      Dt,
      l,
      tn
    ]
  ), an = Object.fromEntries(It.map((P) => [P, ft.filter((ce) => ce.reviewState === P).length])), Un = la(
    zr(
      jt,
      We,
      { ...x, reviewStates: It },
      l && A,
      Dt
    ),
    tn,
    !0
  ), Pr = Object.fromEntries(It.map((P) => [P, Un.filter((ce) => ce.reviewState === P).length])), Or = [...new Set(jt.map((P) => P.sourceKey).filter(Boolean))].sort((P, ce) => Ft(P).localeCompare(Ft(ce))), Lr = Fs(
    x,
    l && A
  ), wt = Ge(
    () => dn(ft, Dt, We),
    [ft, Dt, We]
  ), Xe = Gs(
    wt,
    g,
    s
  ), sn = Ge(() => {
    const P = Md(xe);
    return P.length === 0 ? pt : [...pt, ...P];
  }, [pt, xe]), N = Xe == null ? null : sn.find((P) => P.id === Xe.id) || Xe, Re = _o(sn, _o(ft, f).map((P) => P.id)), xt = !l && Re.length > 0 && Re.every((P) => P.nativeSegmentId != null), yt = ft.map((P) => P.id), Yt = yt.join("|");
  p.current = (N == null ? void 0 : N.id) ?? null;
  const Bt = pn.get(N == null ? void 0 : N.id) || [], Fr = po(Bt), ho = Ge(
    () => ld(wt, f),
    [wt, f]
  ), jr = Ge(() => fo(wt), [wt]), Kn = Ge(
    () => id(jr, He),
    [jr, He]
  ), Ci = Ge(
    () => ui(
      Kn.rows,
      On.scrollTop,
      On.height
    ),
    [Kn, On]
  ), Br = Ge(
    () => cd(wt, He),
    [wt, He]
  ), $i = Sr(Br, N == null ? void 0 : N.id, -1, !0) != null, Ti = Sr(Br, N == null ? void 0 : N.id, 1, !0) != null, fn = N ? Ot(wt, N.id) : null, Gr = Dt.length > 0 ? jr.map((P) => P.key) : [], Ai = Gr.join("|"), cr = Math.max(
    0,
    Number((Oo = tt.videoFile) == null ? void 0 : Oo.duration) || 0,
    ...jt.map((P) => Number(P.endSec ?? P.startSec) || 0)
  ), vo = Number((Lo = tt.videoFile) == null ? void 0 : Lo.duration) > 0 ? Number(tt.videoFile.duration) : null;
  h.actions;
  const Ri = Ja();
  pe(() => {
    const P = g === wr ? g : (N == null ? void 0 : N.id) ?? null;
    P !== g && u(P);
  }, [N, g]), pe(() => {
    m((P) => {
      const ce = Hs(
        P,
        yt,
        (N == null ? void 0 : N.id) ?? null
      );
      return ce.length === P.length && ce.every((Le, it) => Le === P[it]) ? P : ce;
    });
  }, [Yt, N == null ? void 0 : N.id]);
  const yn = (N == null ? void 0 : N.itemId) == null ? null : ((Fo = e.itemMetadata) == null ? void 0 : Fo[N.itemId]) || null, Mi = {
    key: (N == null ? void 0 : N.itemId) != null ? `item:${N.itemId}` : (N == null ? void 0 : N.nativeSegmentId) != null ? `native:${N.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (yn == null ? void 0 : yn.provenance) || (N == null ? void 0 : N.fieldProvenance) || [] : []
  }, Ur = (N == null ? void 0 : N.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (yn == null ? void 0 : yn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  pe(() => {
    ve(Xe == null ? "" : String(Xe.startSec)), be((Xe == null ? void 0 : Xe.endSec) == null ? "" : String(Xe.endSec));
  }, [Xe == null ? void 0 : Xe.id, Xe == null ? void 0 : Xe.startSec, Xe == null ? void 0 : Xe.endSec]), pe(() => {
    fn && ht((P) => pi(P, fn));
  }, [tt.id, s, fn]), pe(() => {
    de((P) => pd(Gr, P, fn));
  }, [tt.id, Ai, fn]), pe(() => {
    if (!ne.markerRailOpen || (N == null ? void 0 : N.id) == null) return;
    const P = Pn.current, ce = Kn.rows.find((Pt) => Pt.kind === "segment" && Pt.segment.id === N.id);
    if (!P || !ce) return;
    const Le = ce.top + ce.height;
    let it = P.scrollTop;
    ce.top < P.scrollTop ? it = ce.top : Le > P.scrollTop + P.clientHeight && (it = Math.max(0, Le - P.clientHeight)), it !== P.scrollTop && (P.scrollTop = it), Ln({ scrollTop: it, height: P.clientHeight });
  }, [N == null ? void 0 : N.id, Kn, ne.markerRailOpen]), pe(() => {
    const P = Pn.current;
    if (!ne.markerRailOpen || !P) return;
    const ce = () => Ln({
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
  const { revealSegmentGroupForSelection: xo, replaceSegmentSelection: Ei, selectSegment: So, selectSegmentCollection: Di, selectAllVideoSegments: Pi } = kc({
    allSwimlanes: wt,
    editorRef: vt,
    performerSlots: We,
    seekRef: Tn,
    segmentGroups: Dt,
    segments: pt,
    selectedSegmentId: g,
    selectedSegmentIds: f,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: b,
    setCollapsedSegmentGroups: ht,
    setEditorFilters: K,
    setHideDerivedSegments: C,
    setSaveMessage: oe,
    setSelectedSegmentGroupKey: de,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m
  }), { acceptHistory: Kr, recordHistoryAction: ur, mutateSegment: Oi, runSegmentMutation: Li, completeReview: Fi, createSegment: ko, splitSegment: wo, duplicateSegment: No, saveTiming: ji, applyShortcutTiming: Bi } = Fd({
    compatibilityMode: l,
    currentTime: S,
    detail: e,
    editorFilters: x,
    endInput: fe,
    hideDerivedSegments: A,
    historyRef: k,
    mediaDuration: vo,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: ar,
    pendingDuplicateRef: ir,
    pendingFirstSegmentStartSecRef: Dn,
    pendingTagEditSegmentIdRef: Et,
    enqueueSave: M,
    pendingChanges: xe,
    retargetSaveTasks: se,
    replaceSegmentSelection: Ei,
    savingSegmentId: O,
    segments: pt,
    selectedSegment: N,
    selectedSegmentIdRef: p,
    selectedSegments: Re,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: b,
    setCreatingSegmentId: te,
    setEditorFilters: K,
    setFirstSegmentTagOpen: he,
    setHideDerivedSegments: C,
    setHistory: v,
    setHistoryOpen: me,
    setPublishApprovedError: nt,
    setSaveMessage: oe,
    acquireSaveLock: D,
    dispatchPendingChanges: J,
    setSelectedSegmentGroupKey: de,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    setTagEditing: j,
    startInput: Q,
    tagEditingRef: B,
    timelineDuration: cr,
    video: tt
  });
  function Io(P = null) {
    var it;
    if (!l || O != null || !pt.some((Pt) => !Pt.published && Pt.reviewState === "approved")) return;
    const ce = ((it = vt.current) == null ? void 0 : it.ownerDocument) ?? document, Le = ce.activeElement === ce.body ? null : ce.activeElement;
    rt.current = P != null && P.isConnected && P !== ce.body ? P : Le, nt(""), Ze(!0);
  }
  function Co() {
    O == null && (Ze(!1), nt(""), requestAnimationFrame(() => {
      Tc(
        rt.current,
        vt.current
      ), rt.current = null;
    }));
  }
  async function Gi() {
    await Fi() && Co();
  }
  const { closeMergeConfirmation: Ui, mergeSelectedSwimlane: $o, saveSelectedReviewState: Ki } = wc({
    acceptHistory: Kr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: I,
    getSaveQueueSnapshot: ie,
    historyRef: k,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: ur,
    revealSegmentGroupForSelection: xo,
    savingSegmentId: O,
    selectedGroups: ho,
    selectedSegment: N,
    selectedSegmentIdRef: p,
    selectedSegments: Re,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: b,
    setMergeConfirmation: Pe,
    setSaveMessage: oe,
    acquireSaveLock: D,
    dispatchPendingChanges: J,
    enqueueSave: M,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: tt
  }), zi = (P) => {
    const ce = (P || []).map(Gt);
    z.cancel((Le) => Le.kind === "review" && fi(Le.targets, ce));
  };
  E.current = {
    detail: e,
    segments: pt,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    tagEditing: _,
    selectedSegmentIds: f,
    activeSegmentId: (N == null ? void 0 : N.id) ?? null
  }, pe(() => {
    z.poke();
  });
  const { toggleIncorrectExample: Hi, removeIncorrectExample: qi, captureTrainingExport: _i, deleteRejectedSegments: To, autoAssignPerformers: Wi, previewDerivedSegments: Vi, closeMaterializeDialog: Ji, materializeDerivedSegments: Yi, saveTag: Qi, moveToBin: Zi, emptyRecyclingBin: Xi } = Nc({
    acceptHistory: Kr,
    allSwimlanes: wt,
    autoAssignCandidates: Jt,
    autoAssigning: _e,
    binEmptyingRef: ct,
    canMoveSelectionToBin: xt,
    closeTagEditing: Bn,
    compatibilityMode: l,
    creatingSegmentId: U,
    detail: e,
    editorFilters: x,
    editorRef: vt,
    exportingExamples: Cn,
    hideDerivedSegments: A,
    incorrectExamples: tn,
    lineage: Ur,
    materializeButtonRef: mn,
    materializePreview: ke,
    materializeRestoreFocusRef: In,
    materializing: lt,
    mutateSegment: Oi,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: We,
    cancelSaveTasks: q,
    dispatchPendingChanges: J,
    enqueueSave: M,
    pendingChanges: xe,
    runSegmentMutation: Li,
    recordHistoryAction: ur,
    refreshMaterializationPreview: Er,
    removingExampleId: Xn,
    revealSegmentGroupForSelection: xo,
    savingSegmentId: O,
    segmentGroups: Dt,
    segments: pt,
    selectedSegment: N,
    selectedSegmentIdRef: p,
    selectedSegments: Re,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: b,
    setAutoAssignError: Je,
    setAutoAssignOpen: Ee,
    setAutoAssigning: we,
    setEditorFilters: K,
    setExportingExamples: Rr,
    setHideDerivedSegments: C,
    setIncorrectExamples: nn,
    setMaterializeError: wn,
    setMaterializeLoading: gt,
    setMaterializeOpen: kt,
    setMaterializePreview: Ne,
    setMaterializing: _t,
    setRemovingExampleId: Mr,
    setRejectedDeletionPreview: ze,
    setSaveMessage: oe,
    acquireSaveLock: D,
    setSelectedSegmentGroupKey: de,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: tt
  }), { restoreHistoryTarget: es, updateTimelineRatio: Ao, handleSeparatorPointerDown: ts, handleSeparatorPointerMove: ns, handleSeparatorKeyDown: rs, panelWidthMaximum: Ro, panelSeparatorProps: os, toggleSegmentRail: as, toggleSegmentGroup: Mo, mutateShotBoundary: is } = Ic({
    acceptHistory: Kr,
    compatibilityMode: l,
    currentTime: S,
    detail: e,
    editorLayout: ne,
    focusRowRef: gn,
    history: h,
    historyRef: k,
    historySaving: G,
    horizontalLayoutSize: T,
    mediaStackHeight: le,
    mediaStackRef: Rn,
    commonActionsRef: on,
    onDetailChange: t,
    onReload: o,
    railToggleRef: nr,
    recordHistoryAction: ur,
    savingSegmentId: O,
    setCollapsedSegmentGroups: ht,
    setEditorLayout: Z,
    setHistorySaving: W,
    setIncorrectExamples: nn,
    setSaveMessage: oe,
    acquireSaveLock: D,
    enqueueSave: M,
    getSaveQueueSnapshot: ie,
    shotBoundaries: jn,
    timelineDuration: cr,
    video: tt,
    workspaceRef: Mn
  }), { executeShortcutById: Eo, stepVideoFrame: ss } = Cc({
    allSwimlanes: wt,
    applyShortcutTiming: Bi,
    centerTimelineRef: tr,
    compatibilityMode: l,
    createSegment: ko,
    currentTime: S,
    deleteRejectedSegments: To,
    duplicateSegment: No,
    editorLayout: ne,
    editorRef: vt,
    emptyRecyclingBin: Xi,
    lineage: Ur,
    mediaDuration: vo,
    mergeSelectedSwimlane: $o,
    moveToBin: Zi,
    mutateShotBoundary: is,
    openPublishApprovedDialog: Io,
    playbackControlsRef: An,
    playbackShortcutConfig: Ri,
    saveSelectedReviewState: Ki,
    seekRef: Tn,
    segmentGroupKeys: Gr,
    selectSegment: So,
    selectedSegment: N,
    selectedSegmentGroupForSegment: fn,
    selectedSegmentGroupKey: X,
    selectedSegments: Re,
    setCollapsedSegmentGroups: ht,
    setIncorrectExamplesOpen: Ve,
    setQuickSearchOpen: Ue,
    setSaveMessage: oe,
    setSelectedSegmentGroupKey: de,
    setTagEditing: j,
    setTimelineZoom: ue,
    shotBoundaries: jn,
    slotButtonRef: rr,
    splitSegment: wo,
    swimlanes: Br,
    timelineDuration: cr,
    toggleIncorrectExample: Hi,
    toggleSegmentGroup: Mo,
    updateTimelineRatio: Ao,
    videoFrameRate: Dr,
    visibleSegments: ft
  });
  rn.current = Eo;
  const ls = Ge(() => Qn.map((P) => ({
    id: P.id,
    enabled: xn(P, l),
    surface: "local",
    action: (ce) => {
      var Le;
      return (Le = rn.current) == null ? void 0 : Le.call(rn, P.id, ce);
    }
  })), [l]);
  Ta(oo, ls);
  const ds = io(le), cs = ln(ne.markerRailWidth, Ro("markerRailWidth")), us = ln(ne.detailWidth, Ro("detailWidth"));
  return n(Sc, {
    activeFilterCount: Lr,
    allSwimlanes: wt,
    analysisError: Se,
    analysisRun: Fe,
    analysisStatus: De,
    approvalFacetCounts: Pr,
    autoAssignCandidates: Jt,
    autoAssignError: Oe,
    autoAssignOpen: Ie,
    autoAssignPerformers: Wi,
    autoAssigning: _e,
    canMoveSelectionToBin: xt,
    captureTrainingExport: _i,
    cancelQueuedReviewsForSegments: zi,
    removeIncorrectExample: qi,
    rejectedDeletionPreview: $e,
    centerTimelineRef: tr,
    closeEditorFilters: Gn,
    closeFirstSegmentTagDialog: dr,
    closeMaterializeDialog: Ji,
    closeMergeConfirmation: Ui,
    closePublishApprovedDialog: Co,
    closeTagEditing: Bn,
    collapsedSegmentGroups: He,
    commonActionsRef: on,
    compatibilityMode: l,
    configuringTag: Kt,
    createSegment: ko,
    currentTime: S,
    deleteRejectedSegments: To,
    detail: e,
    detailPanelRef: I,
    detailWidth: us,
    duplicateSegment: No,
    editorFilters: x,
    editorLayout: ne,
    editorRef: vt,
    exportingExamples: Cn,
    filtersButtonRef: En,
    filtersOpen: L,
    firstSegmentTagOpen: Ce,
    focusRowRef: gn,
    handleSeparatorKeyDown: rs,
    handleSeparatorPointerDown: ts,
    handleSeparatorPointerMove: ns,
    hideDerivedSegments: A,
    history: h,
    historyOpen: H,
    historySaving: G,
    hasNextUnreviewed: Ti,
    hasPreviousUnreviewed: $i,
    horizontalLayoutSize: T,
    importNativeSegments: $t,
    incorrectExamples: tn,
    incorrectExamplesOpen: qe,
    removingExampleId: Xn,
    lineage: Ur,
    markerRailWidth: cs,
    materializeButtonRef: mn,
    materializeCancelButtonRef: Vt,
    materializeDerivedSegments: Yi,
    materializeError: Wt,
    materializeLoading: Ke,
    materializeOpen: St,
    materializePreview: ke,
    materializing: lt,
    mediaStackRef: Rn,
    mergeCancelButtonRef: ut,
    mergeConfirmation: Qe,
    mergeSaving: Cd(ae, "merge"),
    mergeSelectedSwimlane: $o,
    nativeImportState: et,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: Io,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: os,
    pendingInitialSeekRef: er,
    performerSlots: We,
    performerSlotsAvailable: lr,
    playbackControlsRef: An,
    previewDerivedSegments: Vi,
    provenance: Mi,
    provenanceSources: Or,
    publishApprovedCancelButtonRef: dt,
    publishApprovedDrafts: Gi,
    publishApprovedError: mt,
    publishApprovedOpen: bt,
    quickSearchOpen: ye,
    railScrollRef: Pn,
    railToggleRef: nr,
    recordHistoryAction: ur,
    restoreHistoryTarget: es,
    runEditorAction: Eo,
    stepVideoFrame: ss,
    saveMessage: Y,
    setSaveMessage: oe,
    saveTag: Qi,
    saveTiming: ji,
    savingSegmentId: O,
    acquireSaveLock: D,
    seekRef: Tn,
    segmentGroups: Dt,
    segmentRailLayout: Kn,
    segments: jt,
    selectAllVideoSegments: Pi,
    selectSegment: So,
    selectSegmentCollection: Di,
    selectedGroups: ho,
    selectedPerformerSlots: Bt,
    selectedSegment: Xe,
    selectedSegmentGroupKey: X,
    selectedSegmentIds: f,
    selectedSegments: Re,
    selectedSlotStatus: Fr,
    setAutoAssignError: Je,
    setAutoAssignOpen: Ee,
    setConfiguringTag: Nn,
    setCurrentTime: w,
    setEditorFilters: K,
    setEditorLayout: Z,
    setFiltersOpen: $,
    setHideDerivedSegments: C,
    setHistoryOpen: me,
    setIncorrectExamplesOpen: Ve,
    setQuickSearchOpen: Ue,
    setRejectedDeletionPreview: ze,
    setRailViewport: Ln,
    setSelectedSegmentGroupKey: de,
    setSelectedSegmentId: u,
    setShortcutsOpen: Te,
    setTimelineZoom: ue,
    shotBoundaries: jn,
    shortcutsOpen: Me,
    slotButtonRef: rr,
    splitLayout: a,
    splitSegment: wo,
    startFullAnalysis: at,
    tagEditing: _,
    creatingSegmentId: U,
    tagSearchRef: or,
    timelineDuration: cr,
    timelineRatioBounds: ds,
    timelineZoom: re,
    toggleSegmentGroup: Mo,
    toggleSegmentRail: as,
    updateTimelineRatio: Ao,
    video: tt,
    videoPerformers: Fn,
    visibleCounts: an,
    visibleSegmentRailRows: Ci,
    visibleSegments: ft,
    wideLayout: $n,
    workspaceRef: Mn
  });
}
const Rc = /* @__PURE__ */ new Set(["queued", "running"]);
async function va(e, t, r = 4) {
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
function xa(e, t) {
  return { videoId: e, error: (t == null ? void 0 : t.message) || String(t || "Unable to start Full Scan.") };
}
function Mc() {
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
async function Ec(e, t, r, o) {
  const i = [...new Set(e.map(Number).filter((m) => Number.isInteger(m) && m > 0))], a = [...new Set(t)].filter((m) => ["aiTagging", "omnishotcut"].includes(m));
  if (i.length === 0 || a.length === 0)
    return { queuedIds: [], failed: [], cancelled: !1 };
  const s = a.includes("omnishotcut"), l = await va(i, async (m) => {
    try {
      const [p, y] = await Promise.all([
        r(`/videos/${m}/analysis-runs`),
        s ? r(`/videos/${m}/editor`) : null
      ]);
      if ((p || []).some((I) => Rc.has(I == null ? void 0 : I.status)))
        throw new Error("A Full Scan is already queued or running.");
      const b = (y == null ? void 0 : y.shotBoundaries) || [];
      return { videoId: m, shotBoundaries: b };
    } catch (p) {
      return xa(m, p);
    }
  }), d = l.filter((m) => !m.error), c = l.filter((m) => m.error), g = d.filter((m) => m.shotBoundaries.length > 0), u = g.reduce((m, p) => m + p.shotBoundaries.length, 0);
  if (u > 0 && !o(
    `Replace ${u} existing shot ${u === 1 ? "boundary" : "boundaries"} across ${g.length} selected ${g.length === 1 ? "video" : "videos"} when these scans succeed? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
  )) return { queuedIds: [], failed: c, cancelled: !0 };
  const f = await va(d, async ({ videoId: m, shotBoundaries: p }) => {
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
    } catch (b) {
      return xa(m, b);
    }
  });
  return {
    queuedIds: f.filter((m) => !m.error).map((m) => m.videoId),
    failed: [...c, ...f.filter((m) => m.error)],
    cancelled: !1
  };
}
function Dc(e = [], t = []) {
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
function Nt(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function Oc(e = [], t = []) {
  var m;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((p, y) => (p.sortOrder ?? 0) - (y.sortOrder ?? 0) || Number(p.id) - Number(y.id)).forEach((p, y) => {
    [...p.tags || []].sort((b, I) => (b.sortOrder ?? 0) - (I.sortOrder ?? 0) || Number(b.tagId) - Number(I.tagId)).forEach((b, I) => r.set(Number(b.tagId), {
      key: `group:${p.id}`,
      id: p.id,
      name: p.name,
      sortOrder: p.sortOrder ?? y,
      tagSortOrder: b.sortOrder ?? I
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(p, y) {
    const b = Number(p);
    if (!o.has(b)) {
      const I = r.get(b);
      o.set(b, {
        tagId: b,
        name: y || `Tag ${b}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (I == null ? void 0 : I.key) || "ungrouped",
        segmentGroupId: (I == null ? void 0 : I.id) ?? null,
        segmentGroupName: (I == null ? void 0 : I.name) || "Ungrouped",
        segmentGroupSortOrder: (I == null ? void 0 : I.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (I == null ? void 0 : I.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(b);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((p) => {
    const y = i(p.sourceTagId, p.sourceTagName), b = i(p.derivedTagId, p.derivedTagName);
    y.outgoingRuleCount++, b.incomingRuleCount++;
    const I = `${y.tagId}:${b.tagId}`;
    a.has(I) || a.set(I, {
      id: I,
      sourceTagId: y.tagId,
      derivedTagId: b.tagId,
      rules: [],
      edgeCount: 0
    });
    const x = a.get(I);
    x.rules.push(p), x.edgeCount += Number(p.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((p) => [p.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((p) => {
    var y, b;
    (y = d.get(p.sourceTagId)) == null || y.add(p.derivedTagId), (b = d.get(p.derivedTagId)) == null || b.add(p.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), g = [];
  for (const p of s) {
    if (c.has(p.tagId)) continue;
    const y = [p.tagId], b = [];
    for (c.add(p.tagId); y.length > 0; ) {
      const C = y.shift();
      b.push(C);
      for (const S of d.get(C) || [])
        c.has(S) || (c.add(S), y.push(S));
    }
    const I = new Set(b), x = b.map((C) => o.get(C)), K = l.filter((C) => I.has(C.sourceTagId) && I.has(C.derivedTagId)), L = K.flatMap((C) => C.rules), $ = x.filter((C) => C.outgoingRuleCount === 0).sort((C, S) => Nt(C.name, S.name)), A = $.length > 0 ? $ : [...x].sort((C, S) => Nt(C.name, S.name));
    g.push({
      id: [...b].sort((C, S) => C - S).join(":"),
      label: A.length > 1 ? `${A[0].name} + ${A.length - 1}` : ((m = A[0]) == null ? void 0 : m.name) || "Derivation component",
      nodes: x,
      connections: K,
      rules: L,
      segmentGroupKeys: [...new Set(x.map((C) => C.segmentGroupKey))],
      materializedEdgeCount: L.reduce(
        (C, S) => C + (Number(S.edgeCount) || 0),
        0
      )
    });
  }
  g.sort((p, y) => y.rules.length - p.rules.length || Nt(p.label, y.label));
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
      var b;
      return (b = u.get(y.segmentGroupKey)) == null ? void 0 : b.componentIds.add(p.id);
    }), p.rules.forEach((y) => {
      var b, I;
      (b = u.get(o.get(Number(y.sourceTagId)).segmentGroupKey)) == null || b.ruleIds.add(y.id), (I = u.get(o.get(Number(y.derivedTagId)).segmentGroupKey)) == null || I.ruleIds.add(y.id);
    });
  });
  const f = [...u.values()].sort((p, y) => p.sortOrder - y.sortOrder || Nt(p.name, y.name)).map((p) => ({
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
function Lc(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const g = new Map(e.nodes.map((w) => [w.tagId, /* @__PURE__ */ new Set()])), u = new Map(e.nodes.map((w) => [w.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((w) => {
    var E, z;
    (E = g.get(w.sourceTagId)) == null || E.add(w.derivedTagId), (z = u.get(w.derivedTagId)) == null || z.add(w.sourceTagId);
  });
  const f = new Map(e.nodes.map((w) => {
    var E;
    return [
      w.tagId,
      ((E = u.get(w.tagId)) == null ? void 0 : E.size) || 0
    ];
  })), m = new Map(e.nodes.map((w) => [w.tagId, 0])), p = e.nodes.filter((w) => f.get(w.tagId) === 0).sort((w, E) => Nt(w.name, E.name)).map((w) => w.tagId), y = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const w = p.shift();
    if (!y.has(w)) {
      y.add(w);
      for (const E of g.get(w) || [])
        m.set(E, Math.max(m.get(E) || 0, (m.get(w) || 0) + 1)), f.set(E, f.get(E) - 1), f.get(E) === 0 && p.push(E);
    }
  }
  y.size !== e.nodes.length && e.nodes.filter((w) => !y.has(w.tagId)).sort((w, E) => Nt(w.name, E.name)).forEach((w) => m.set(w.tagId, 0));
  const b = Math.max(0, ...m.values()), I = Math.max(
    t,
    240 + b * 296
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
  const K = [...x.values()].sort((w, E) => w.sortOrder - E.sortOrder || Nt(w.name, E.name));
  let L = 28;
  const $ = [], A = K.map((w) => {
    const E = /* @__PURE__ */ new Map();
    w.nodes.forEach((M) => {
      const q = m.get(M.tagId) || 0;
      E.has(q) || E.set(q, []), E.get(q).push(M);
    });
    for (const M of E.values())
      M.sort((q, se) => q.segmentGroupTagSortOrder - se.segmentGroupTagSortOrder || Nt(q.name, se.name));
    const z = Math.max(1, ...[...E.values()].map((M) => M.length)), ae = z * 58 + (z - 1) * 18, O = 70 + ae, D = {
      ...w,
      x: 12,
      y: L,
      width: I - 24,
      height: O
    };
    for (const [M, q] of E.entries()) {
      const se = q.length * 58 + Math.max(0, q.length - 1) * 18, ie = (ae - se) / 2;
      q.forEach((xe, J) => $.push({
        ...xe,
        rank: M,
        x: 28 + M * 296,
        y: L + 34 + 18 + ie + J * 76,
        width: 184,
        height: 58
      }));
    }
    return L += O + 16, D;
  }), C = new Map($.map((w) => [w.tagId, w])), S = e.connections.map((w) => {
    const E = C.get(w.sourceTagId), z = C.get(w.derivedTagId), ae = E.x + E.width, O = E.y + E.height / 2, D = z.x, M = z.y + z.height / 2, q = Math.max(48, (D - ae) * 0.48);
    return {
      ...w,
      path: `M ${ae} ${O} C ${ae + q} ${O}, ${D - q} ${M}, ${D} ${M}`
    };
  });
  return {
    width: I,
    height: Math.max(r, L - 16 + 28),
    nodes: $,
    connections: S,
    groups: A
  };
}
function Fc(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Lc(d, {
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
      const y = m.get(p.sourceTagId), b = m.get(p.derivedTagId), I = y.x + y.width, x = y.y + y.height / 2, K = b.x, L = b.y + b.height / 2, $ = Math.max(48, (K - I) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${I} ${x} C ${I + $} ${x}, ${K - $} ${L}, ${K} ${L}`
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
function Sa(e, t = []) {
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
function jc(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function Bc(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: u, emptyDraft: f, graph: m, layout: p, listSort: y, materializationOffer: b, materializeOutgoingRules: I, materializeRule: x, message: K, normalizedQuery: L, query: $, refreshConfiguredTag: A, revealEditor: C, rules: S, save: w, segmentGroupKey: E, selectedNode: z, selectedRule: ae, selection: O, setConfiguringTag: D, setDraft: M, setListSort: q, setMaterializationOffer: se, setQuery: ie, setSegmentGroupKey: xe, setSelection: J, setView: Y, sortedVisibleRules: oe, sourceSlots: Q, sourceSlotsLoading: ve, updateMapping: fe, updateTag: be, view: re, visibleComponents: ue, visibleRules: ne } = e;
  function Z(h) {
    const v = m.nodes.find((H) => H.tagId === Number(h.sourceTagId)), k = m.nodes.find((H) => H.tagId === Number(h.derivedTagId));
    return (v == null ? void 0 : v.segmentGroupKey) === (k == null ? void 0 : k.segmentGroupKey) ? v.segmentGroupKey : "cross-group";
  }
  function le() {
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
          onClick: () => M(null),
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
              onClick: (h) => D({
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
            n(Wn, {
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
              onClick: (h) => D({
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
            onClick: () => M((h) => ({
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
              onChange: (k) => fe(v, "sourceSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${v + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...Q.map((k) => n("option", { key: k.id, value: k.id }, Ct(k)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: h.derivedSlotDefinitionId,
              disabled: r,
              onChange: (k) => fe(v, "derivedSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${v + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((k) => n("option", { key: k.id, value: k.id }, Ct(k)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => M((k) => ({
                ...k,
                slotMappings: k.slotMappings.filter((H, me) => me !== v)
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
          onClick: w,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => M(null), className: o }, "Cancel")
      ])
    ]);
  }
  function V() {
    if (z) {
      const k = ne.filter((G) => Number(G.derivedTagId) === z.tagId), H = ne.filter((G) => Number(G.sourceTagId) === z.tagId), me = (G, W, _) => n("div", {
        key: G.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, W),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${G.sourceTagName} → ${G.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          _ ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => x(G),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => g(G, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(G),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, z.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, z.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${z.incomingRuleCount} incoming · ${z.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (G) => D({
            tagId: z.tagId,
            tagName: z.name,
            trigger: G.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        H.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => I(z, H),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${H.length})`) : null,
        H.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...H.map((G) => me(G, "Derives", !0))
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
            k.map((G) => me(G, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!ae)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const h = m.nodes.find((k) => k.tagId === Number(ae.sourceTagId)), v = m.nodes.find((k) => k.tagId === Number(ae.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (h == null ? void 0 : h.segmentGroupName) || "Ungrouped"),
          (h == null ? void 0 : h.segmentGroupKey) !== (v == null ? void 0 : v.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(v == null ? void 0 : v.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${ae.sourceTagName} → ${ae.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${ae.edgeCount} materialized lineage edge${ae.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (b == null ? void 0 : b.ruleId) === ae.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => x(ae, b),
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
        ae.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : ae.slotMappings.map((k, H) => n("div", {
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
          ae.createdAt ? new Date(ae.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          ae.updatedAt ? new Date(ae.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => x(ae),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(ae),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(ae),
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
      }, L ? "No derivation relationships match your search." : "No derivation rules.");
    const h = z == null ? void 0 : z.tagId, v = /* @__PURE__ */ new Set();
    return z && (v.add(z.tagId), p.connections.forEach((k) => {
      (k.sourceTagId === z.tagId || k.derivedTagId === z.tagId) && (v.add(k.sourceTagId), v.add(k.derivedTagId));
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
          className: `absolute rounded-xl border ${E === k.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
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
            const H = h === k.sourceTagId || h === k.derivedTagId, me = z != null, G = H ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${k.id}:visible`,
              d: k.path,
              fill: "none",
              stroke: G,
              strokeWidth: H ? 2.5 : 1.5,
              opacity: me && !H ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((k) => {
          const H = !L || k.name.toLocaleLowerCase().includes(L), me = z != null, G = v.has(k.tagId), W = (z == null ? void 0 : z.tagId) === k.tagId;
          return n("button", {
            key: `node:${k.tagId}`,
            type: "button",
            onClick: () => J({ type: "node", id: k.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${W ? "border-accent bg-accent/15 ring-2 ring-accent/25" : G ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${k.x}px`,
              top: `${k.y}px`,
              width: `${k.width}px`,
              height: `${k.height}px`,
              opacity: !H || me && !G ? 0.62 : 1
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
          const H = p.nodes.find((G) => G.tagId === k.sourceTagId), me = p.nodes.find((G) => G.tagId === k.derivedTagId);
          return n("div", {
            key: `bundle:${k.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(H.x + H.width + me.x) / 2 - 24}px`,
              top: `${(H.y + H.height / 2 + me.y + me.height / 2) / 2 - 10}px`
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
        L ? "No derivation relationships match your search." : "No derivation rules."
      );
    const h = /* @__PURE__ */ new Map();
    oe.forEach((k) => {
      const H = Z(k);
      h.has(H) || h.set(H, []), h.get(H).push(k);
    });
    const v = [
      ...m.segmentGroups.map((k) => k.key),
      "cross-group"
    ].filter((k) => h.has(k));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, v.map((k) => {
      const H = m.segmentGroups.find((W) => W.key === k), me = k === "cross-group" ? "Cross-group relationships" : (H == null ? void 0 : H.name) || "Ungrouped", G = h.get(k);
      return n("section", { key: k, "aria-label": me }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, me),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${G.length} rule${G.length === 1 ? "" : "s"}`
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
          ...G.map((W) => n("button", {
            key: W.id,
            type: "button",
            role: "row",
            onClick: () => J({ type: "rule", id: W.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(ae == null ? void 0 : ae.id) === W.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${W.sourceTagName} → ${W.derivedTagName}` },
              `${W.sourceTagName} → ${W.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(W.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(W.edgeCount))
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
          `${S.length} rules · ${m.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          M(f()), J(null), C();
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
            ie(h.target.value), J(null);
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
          value: E,
          disabled: d != null,
          onChange: (h) => {
            xe(h.target.value), J(null), M(null);
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
          value: y,
          onChange: (h) => q(h.target.value),
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
            Y(h), h === "graph" && (O == null ? void 0 : O.type) === "rule" && J(null);
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
        d ? le() : V()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      K ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, K) : null
    ]),
    i ? n(bo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => A(i),
      onClose: () => {
        const h = i.trigger;
        D(null), requestAnimationFrame(() => {
          h != null && h.isConnected && h.focus();
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
  }), [o, i] = F([]), [a, s] = F(null), [l, d] = F([]), [c, g] = F([]), [u, f] = F(!1), [m, p] = F(!1), [y, b] = F(!1), [I, x] = F(""), [K, L] = F(""), [$, A] = F("graph"), [C, S] = F("all"), [w, E] = F(null), [z, ae] = F("relationship"), [O, D] = F(null), [M, q] = F(null), se = ge(null), ie = ge(null), xe = ti().replace(/:/g, "");
  function J() {
    requestAnimationFrame(() => {
      var j;
      return (j = se.current) == null ? void 0 : j.scrollIntoView({ block: "nearest" });
    });
  }
  async function Y(j) {
    const B = await ee("/derivation-rules", j ? { signal: j } : void 0);
    i(B || []);
  }
  pe(() => {
    const j = new AbortController();
    return Y(j.signal).catch((B) => {
      B.name !== "AbortError" && x(B.message || "Unable to load derived segment rules.");
    }), () => j.abort();
  }, []), pe(() => {
    const j = new AbortController();
    return a != null && a.sourceTagId ? (f(!0), ee(`/slot-definitions/${a.sourceTagId}`, { signal: j.signal }).then((B) => d(B.definitions || [])).catch((B) => {
      B.name !== "AbortError" && d([]);
    }).finally(() => {
      j.signal.aborted || f(!1);
    })) : (d([]), f(!1)), a != null && a.derivedTagId ? (p(!0), ee(`/slot-definitions/${a.derivedTagId}`, { signal: j.signal }).then((B) => g(B.definitions || [])).catch((B) => {
      B.name !== "AbortError" && g([]);
    }).finally(() => {
      j.signal.aborted || p(!1);
    })) : (g([]), p(!1)), () => j.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), pe(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || u || m)
      return;
    const j = `${a.sourceTagId}:${a.derivedTagId}`;
    ie.current !== j && (ie.current = j, s((B) => !B || Number(B.sourceTagId) !== Number(a.sourceTagId) || Number(B.derivedTagId) !== Number(a.derivedTagId) ? B : td(B, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    u,
    m
  ]);
  function oe(j, B = !1) {
    B || E({ type: "rule", id: j.id }), ie.current = null, s({
      ruleId: j.id,
      sourceTagId: j.sourceTagId,
      sourceTagName: j.sourceTagName,
      derivedTagId: j.derivedTagId,
      derivedTagName: j.derivedTagName,
      slotMappings: j.slotMappings.map((U) => ({
        sourceSlotDefinitionId: U.sourceSlotDefinitionId,
        derivedSlotDefinitionId: U.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), x(""), J();
  }
  function Q(j, B, U = "") {
    ie.current = null, j === "source" ? (d([]), f(B != null)) : (g([]), p(B != null)), s((te) => ({
      ...te,
      [`${j}TagId`]: B == null ? null : Number(B),
      [`${j}TagName`]: U || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function ve(j) {
    (a == null ? void 0 : a.ruleId) == null && (ie.current = null);
    const B = [Y(), t == null ? void 0 : t()];
    return j.draftKind === "source" ? (f(!0), B.push(ee(`/slot-definitions/${j.tagId}`).then((U) => d(U.definitions || [])).finally(() => f(!1)))) : j.draftKind === "derived" && (p(!0), B.push(ee(`/slot-definitions/${j.tagId}`).then((U) => g(U.definitions || [])).finally(() => p(!1)))), Promise.all(B);
  }
  function fe(j, B, U) {
    s((te) => ({
      ...te,
      slotMappings: te.slotMappings.map((Ce, he) => he === j ? { ...Ce, [B]: U } : Ce)
    }));
  }
  async function be() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const j = Sa(a, o);
    if (j) {
      x(j.message);
      return;
    }
    if (a.slotMappings.some((B) => !B.sourceSlotDefinitionId || !B.derivedSlotDefinitionId)) {
      x("Complete or remove every performer slot mapping before saving.");
      return;
    }
    b(!0), x(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let B = null;
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
        B = te.fingerprint;
      }
      x("Saving derived segment rule…");
      const U = await ee("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: B
        })
      });
      if (await Y(), E($ === "graph" ? { type: "node", id: Number(U.sourceTagId) } : { type: "rule", id: U.id }), s(null), a.ruleId == null)
        try {
          const te = await ee(
            `/derivation-rules/${U.id}/materialization/preview`,
            { method: "POST" }
          );
          D(
            te.createCount + te.linkCount > 0 ? te : null
          ), x(te.createCount + te.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          D(null), x("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        D(null), x("Derived segment rule saved. Previous materializations were removed.");
    } catch (B) {
      x(B.message || "Unable to save derived segment rule.");
    } finally {
      b(!1);
    }
  }
  async function re(j) {
    b(!0), x("Previewing rule deletion…");
    try {
      const B = await ee(
        `/derivation-rules/${j.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${j.sourceTagName} → ${j.derivedTagName}?

Deleted segments: ${B.deletedSegmentCount}
Removed lineage edges: ${B.removedEdgeCount}
Shared derived segments retained: ${B.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const U = `derivation-rule-delete:${j.id}:${B.fingerprint}`;
      await ee(`/derivation-rules/${j.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(U),
          fingerprint: B.fingerprint
        })
      }), Be(U), await Y(), (a == null ? void 0 : a.ruleId) === j.id && s(null), (w == null ? void 0 : w.type) === "rule" && w.id === j.id && E(null), (O == null ? void 0 : O.ruleId) === j.id && D(null), x(`Rule deleted with ${B.deletedSegmentCount} exclusively derived segment${B.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (B) {
      x(B.message || "Unable to delete derived segment rule.");
    } finally {
      b(!1);
    }
  }
  async function ue(j, B = null) {
    const U = B || await ee(
      `/derivation-rules/${j.id}/materialization/preview`,
      { method: "POST" }
    );
    if (U.createCount + U.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const te = `derivation-rule-materialize:${j.id}:${U.fingerprint}`, Ce = await ee(`/derivation-rules/${j.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: je(te),
        fingerprint: U.fingerprint
      })
    });
    return Be(te), Ce;
  }
  async function ne(j, B = null) {
    b(!0), x("Finding pending derivations…");
    try {
      const U = await ue(j, B);
      if (D(null), await Y(), U.createdCount + U.linkedCount === 0) {
        x("Every applicable derivation is already materialized.");
        return;
      }
      x(
        `${U.createdCount} derived segment${U.createdCount === 1 ? "" : "s"} created and ${U.linkedCount} existing segment${U.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (U) {
      x(U.message || "Unable to materialize pending derivations.");
    } finally {
      b(!1);
    }
  }
  async function Z(j, B) {
    if (B.length === 0) return;
    b(!0), x(`Finding pending derivations from ${j.name}…`);
    let U = 0, te = 0;
    try {
      for (const Ce of B) {
        const he = await ue(Ce);
        U += he.createdCount, te += he.linkedCount;
      }
      D(null), await Y(), x(U + te === 0 ? `Every outgoing derivation from ${j.name} is already materialized.` : `${U} derived segment${U === 1 ? "" : "s"} created and ${te} existing segment${te === 1 ? "" : "s"} linked from ${j.name}.`);
    } catch (Ce) {
      await Y().catch(() => {
      }), x(Ce.message || `Unable to materialize derivations from ${j.name}.`);
    } finally {
      b(!1);
    }
  }
  const le = Sa(a, o), V = Ge(
    () => Oc(o, e),
    [o, e]
  ), T = K.trim().toLocaleLowerCase(), h = V.components.filter((j) => C === "all" || j.segmentGroupKeys.includes(C)).filter((j) => !T || j.nodes.some((B) => B.name.toLocaleLowerCase().includes(T))), v = h.flatMap((j) => j.rules), k = new Set(
    h.flatMap((j) => j.nodes.map((B) => B.tagId))
  ), H = Ge(
    () => Fc(h),
    [h]
  ), me = $ === "list" ? jc(
    w,
    v,
    T.length > 0
  ) : null, G = (w == null ? void 0 : w.type) === "node" && V.nodes.find((j) => j.tagId === w.id && k.has(j.tagId)) || null, W = [...v].sort((j, B) => z === "source" ? Nt(j.sourceTagName, B.sourceTagName) || Nt(j.derivedTagName, B.derivedTagName) : z === "target" ? Nt(j.derivedTagName, B.derivedTagName) || Nt(j.sourceTagName, B.sourceTagName) : z === "materialized" ? (Number(B.edgeCount) || 0) - (Number(j.edgeCount) || 0) || Nt(j.sourceTagName, B.sourceTagName) : Nt(
    `${j.sourceTagName} ${j.derivedTagName}`,
    `${B.sourceTagName} ${B.derivedTagName}`
  ));
  return n(Bc, {
    arrowMarkerId: xe,
    busy: y,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: M,
    deleteRule: re,
    derivedSlots: c,
    derivedSlotsLoading: m,
    draft: a,
    draftIssue: le,
    editRule: oe,
    editorRef: se,
    emptyDraft: r,
    graph: V,
    layout: H,
    listSort: z,
    materializationOffer: O,
    materializeOutgoingRules: Z,
    materializeRule: ne,
    message: I,
    normalizedQuery: T,
    query: K,
    refreshConfiguredTag: ve,
    revealEditor: J,
    rules: o,
    save: be,
    segmentGroupKey: C,
    selectedNode: G,
    selectedRule: me,
    selection: w,
    setConfiguringTag: q,
    setDraft: s,
    setListSort: ae,
    setMaterializationOffer: D,
    setQuery: L,
    setSegmentGroupKey: S,
    setSelection: E,
    setView: A,
    sortedVisibleRules: W,
    sourceSlots: l,
    sourceSlotsLoading: u,
    updateMapping: fe,
    updateTag: Q,
    view: $,
    visibleComponents: h,
    visibleRules: v
  });
}
function Uc() {
  const [e, t] = F(Ja), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => Qo({ ...l, [a]: s }));
  }
  function i() {
    t(Qo(ao));
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
function Kc({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = F([]), [a, s] = F(!1), [l, d] = F(!1), [c, g] = F(""), [u, f] = F(""), [m, p] = F("all"), [y, b] = F(() => /* @__PURE__ */ new Set()), [I, x] = F(null);
  pe(() => {
    if (!e || a) return;
    const D = new AbortController();
    return d(!0), g(""), ee("/slot-definitions", { signal: D.signal }).then((M) => {
      i(M || []), s(!0);
    }).catch((M) => {
      M.name !== "AbortError" && g(M.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      D.signal.aborted || d(!1);
    }), () => D.abort();
  }, [e, a]);
  async function K() {
    d(!0), g("");
    try {
      const D = await ee("/slot-definitions");
      i(D || []), s(!0);
    } catch (D) {
      g(D.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function L() {
    const [D] = await Promise.all([
      ee("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(D || []), s(!0), g("");
  }
  function $() {
    const D = I == null ? void 0 : I.trigger;
    x(null), requestAnimationFrame(() => {
      D != null && D.isConnected && D.focus({ preventScroll: !0 });
    });
  }
  function A(D) {
    b((M) => {
      const q = new Set(M);
      return q.has(D) ? q.delete(D) : q.add(D), q;
    });
  }
  const C = Ge(
    () => Dc(t, o),
    [t, o]
  ), S = Ge(
    () => Pc(C, u, m),
    [C, u, m]
  ), w = C.flatMap((D) => D.tags), E = w.filter((D) => D.definitions.length > 0).length, z = w.length - E, ae = [
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
        `${w.length} tags · ${E} with slots · ${z} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: u,
          onChange: (D) => f(D.target.value),
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
          ae.map(([D, M]) => n("button", {
            key: D,
            type: "button",
            onClick: () => p(D),
            "aria-pressed": m === D,
            className: `rounded px-3 py-1.5 text-xs font-medium ${m === D ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, M))
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
          onClick: () => b(new Set(C.map((D) => D.overviewKey))),
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
        onClick: K,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && S.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, S.map((D) => {
      const M = y.has(D.overviewKey), q = D.tags.filter((se) => se.definitions.length > 0).length;
      return n("article", {
        key: D.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => A(D.overviewKey),
          "aria-expanded": !M,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, M ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, D.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${D.tags.length} tag${D.tags.length === 1 ? "" : "s"} · ${q} with slots`
          )
        ]),
        M ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          D.tags.map((se) => n("li", {
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
              n("span", { key: "label", className: "font-medium text-foreground" }, Ct(ie)),
              ...(ie.genderHints || []).map((xe) => n("span", {
                key: xe,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, $r(xe)))
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
    I ? n(bo, {
      key: `performer-slots-configure:${I.tagId}`,
      tagId: I.tagId,
      tagName: I.tagName,
      onSaved: L,
      onClose: $
    }) : null
  ]);
}
function zc({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = F("general"), [a, s] = F([]), [l, d] = F(!1), [c, g] = F(""), [u, f] = F(""), [m, p] = F(null), [y, b] = F(!0), [I, x] = F(!1), [K, L] = F(""), [$, A] = F(!0), [C, S] = F(Ka), w = bl(t), E = w.map(([M]) => M);
  pe(() => {
    E.includes(o) || i(E[0] || "general");
  }, [t.effectiveMode]);
  async function z(M) {
    const q = await ee("/segment-groups", M ? { signal: M } : void 0);
    s(q || []);
  }
  pe(() => {
    const M = new AbortController();
    return z(M.signal).catch((q) => {
      q.name !== "AbortError" && g(q.message || "Unable to load tag groups.");
    }), () => M.abort();
  }, []), pe(() => {
    if (t.effectiveMode !== "full") {
      b(!1);
      return;
    }
    const M = new AbortController();
    return L(""), b(!0), Promise.all([
      ee("/analysis/settings", { signal: M.signal }),
      ee("/analysis/status", { signal: M.signal })
    ]).then(([q, se]) => {
      A(!0), f((q == null ? void 0 : q.baseUrl) || ""), p(se);
    }).catch((q) => {
      if (q.name !== "AbortError") {
        if (q.status === 403) {
          A(!1), L("You do not have permission to manage the analysis service connection.");
          return;
        }
        L(q.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      M.signal.aborted || b(!1);
    }), () => M.abort();
  }, [t.effectiveMode]);
  async function ae(M) {
    if (M !== t.requestedMode) {
      d(!0), g("");
      try {
        const q = await ee(
          `/preferences/transition?mode=${encodeURIComponent(M)}`
        );
        let se = !1, ie = null, xe = null, J = null, Y = !1;
        if (t.requestedMode === "basic" && M === "full") {
          if (!window.confirm(xl(
            q.recyclingBinCount,
            q.protectedRecyclingBinCount
          )))
            return;
          Y = !0, q.recyclingBinCount > 0 && (se = !0, J = q.recyclingBinFingerprint, ie = `mode-switch-empty-bin:${J}`, xe = je(ie));
        }
        let oe = !1;
        if (t.requestedMode === "full" && M === "basic") {
          if (!window.confirm(vl(
            q.extensionOwnedSegmentCount
          )))
            return;
          oe = !0;
        }
        const Q = await ee("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: M,
            confirmHiddenExtensionOwnedSegments: oe,
            confirmBasicHistoryCleanup: Y,
            emptyRecyclingBin: se,
            operationId: xe,
            expectedRecyclingBinFingerprint: J
          })
        });
        ie && Be(ie), r == null || r(Ya(Q)), g("Workflow mode saved.");
      } catch (q) {
        g(q.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function O(M) {
    M.preventDefault(), x(!0), L("");
    try {
      const q = await ee("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: u })
      });
      f((q == null ? void 0 : q.baseUrl) || "");
      const se = await ee("/analysis/status");
      p(se), L(q != null && q.baseUrl ? se != null && se.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(se == null ? void 0 : se.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (q) {
      L(q.message || "Unable to save analysis service settings.");
    } finally {
      x(!1);
    }
  }
  const D = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (M) => Si(M, e, D), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      w.map(([M, q]) => n("button", {
        key: M,
        type: "button",
        onClick: () => i(M),
        "aria-current": o === M ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === M ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, q))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(Uc)
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
      n(oc, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: ae,
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
          checked: C,
          onChange: (M) => {
            const q = M.target.checked;
            za(q), S(q);
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
            onChange: (M) => f(M.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: y || I || !$,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: y || I || !$,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, I ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        K || (y ? "Loading analysis service settings…" : (m == null ? void 0 : m.configured) === !1 ? "Full Scan is not configured." : m != null && m.ready ? "Analysis service is ready." : (m == null ? void 0 : m.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    E.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(Gc, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => z()
      })
    ) : null,
    E.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(Kc, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => z()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function ka({ facets: e, values: t, disabled: r, onChange: o }) {
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
function Hc({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var g, u;
  const s = [...e.slots || []].sort((f, m) => f.sortOrder - m.sortOrder || String(f.slotDefinitionId).localeCompare(String(m.slotDefinitionId))), l = [...new Map(s.map((f) => [
    f.performerId,
    { id: f.performerId, name: f.performerName }
  ])).values()], d = s.map((f) => ({
    slotDefinitionId: f.slotDefinitionId,
    label: Ct(f),
    performer: { id: f.performerId, name: f.performerName }
  })), c = Za(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: si(t)
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
          n(un, { key: "state", state: e.reviewState, includeLabel: !1 }),
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
function qc({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n($a, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: wl(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: Za(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function wa({ onNavigate: e, profile: t }) {
  const r = Ge(() => {
    const Y = Aa("ext:com.midnightrider.segment-studio:segments");
    return Y ? {
      ...Hr,
      defaultFilter: { ...Hr.defaultFilter, ...Y.findFilter || {} },
      defaultObjectFilter: Y.objectFilter || {}
    } : Hr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Ra(r), [l, d] = F(null), [c, g] = F({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [u, f] = F(null), [m, p] = F(null), [y, b] = F(0), [I, x] = F(""), [K, L] = F(!0), [$, A] = F(""), C = ge(0), S = Xo(o, i), w = S.activityTagId, E = vn(i.slots), z = Ge(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (Y) => Object.keys(vn(Y)).length > 0,
    sanitize: (Y) => qr(w, vn(Y)),
    summarize: (Y) => `${Object.keys(vn(Y)).length} assigned`,
    renderEditor: (Y, oe) => w ? n(ka, {
      facets: l,
      values: vn(Y),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (Q, ve) => {
        const fe = { ...vn(Y) };
        ve ? fe[Q] = Number(ve) : delete fe[Q], oe(qr(w, fe));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [w, l, c.performerSlotsAvailable]), ae = JSON.stringify(S);
  pe(() => {
    if (d(null), !w) return;
    const Y = new AbortController();
    return ee(`/browse/activities/${w}/facets`, { signal: Y.signal }).then(d).catch((oe) => {
      oe.status === 403 ? d({ slots: [], restricted: !0 }) : oe.name !== "AbortError" && A(oe.message);
    }), () => Y.abort();
  }, [w]), pe(() => {
    const Y = ++C.current, oe = new AbortController();
    return L(!0), A(""), ee("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(S), signal: oe.signal }).then((Q) => {
      Y === C.current && g({ ...Q, totalCount: Q.totalCount ?? Q.total ?? 0 });
    }).catch((Q) => {
      if (!(Y !== C.current || Q.name === "AbortError")) {
        if (Q.status === 400 && Q.message.includes("unrestricted performer read access")) {
          g((ve) => ({ ...ve, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), A("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        A(Q.message);
      }
    }).finally(() => {
      Y === C.current && L(!1);
    }), () => {
      C.current++, oe.abort();
    };
  }, [ae, y]);
  const O = c.items.findIndex((Y) => Y.key === u), D = c.items[O] || null;
  function M(Y) {
    s(Y), a({ ...o, page: 1 });
  }
  function q(Y) {
    const oe = Xo(o, Y), Q = Y.slots && oe.activityTagId != null && oe.slotAssignments.length > 0 ? Y.slots : void 0;
    M({ ...Y, slots: Q });
  }
  function se(Y, oe) {
    const Q = { ...E };
    oe ? Q[Y] = Number(oe) : delete Q[Y], M({ ...i, slots: qr(w, Q) });
  }
  function ie() {
    const Y = document.querySelector(`[data-segment-key="${u}"]`);
    f(null), requestAnimationFrame(() => Y == null ? void 0 : Y.focus());
  }
  async function xe(Y) {
    var ve;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(Y.key), x("");
    const oe = `browse-restore:${Y.itemId}:${Y.revision}`, Q = je(oe);
    try {
      const fe = (be = !1) => ee(`/bin/${Y.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Q,
          expectedRevision: Y.revision,
          discardMissingImage: be
        })
      });
      try {
        await fe(co(oe));
      } catch (be) {
        if (((ve = be.payload) == null ? void 0 : ve.code) !== "missing-image" || !window.confirm(`${be.message}

Continue and discard the missing image reference?`))
          throw be;
        uo(oe), await fe(!0);
      }
      Be(oe), u === Y.key && f(null), x("Segment restored to Cove."), b((be) => be + 1);
    } catch (fe) {
      x(fe.message || "Unable to restore the segment."), fe.status === 409 && b((be) => be + 1);
    } finally {
      p(null);
    }
  }
  async function J(Y) {
    p(Y.key), x("");
    try {
      const oe = await ee(`/items/${Y.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: Y.revision })
      });
      if (!ri(oe, x) || !jl(oe))
        return;
      const Q = `browse-dependency-delete:${Y.itemId}:${oe.fingerprint}`;
      await ee(`/items/${Y.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(Q),
          fingerprint: oe.fingerprint
        })
      }), Be(Q), u === Y.key && f(null), x(`${oe.deletedSegmentCount} segment${oe.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), b((ve) => ve + 1);
    } catch (oe) {
      x(oe.message || "Unable to permanently delete the segment."), oe.status === 409 && b((Q) => Q + 1);
    } finally {
      p(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(yo, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(Ma, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: a,
      totalCount: c.totalCount,
      isLoading: K,
      error: $ ? new Error($) : null,
      onRetry: () => b((Y) => Y + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? Zo.filter((Y) => Y.id !== "performers") : Zo,
      objectFilter: i,
      onObjectFilterChange: q,
      customFilterSections: z,
      searchPlaceholder: "Search segments..."
    }, [
      w ? n(ka, { key: "slots", facets: l, values: E, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: se }) : null,
      n(qc, { key: "player", item: D, index: O, count: c.items.length, onPrevious: () => {
        var Y;
        return f((Y = c.items[O - 1]) == null ? void 0 : Y.key);
      }, onNext: () => {
        var Y;
        return f((Y = c.items[O + 1]) == null ? void 0 : Y.key);
      }, onClose: ie, onNavigate: e }),
      I ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, I) : null,
      !K && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      K ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((Y) => n(Hc, {
        key: Y.key,
        item: Y,
        selected: Y.key === u,
        busy: m === Y.key,
        onSelect: () => f(Y.key),
        onRestore: xe,
        onPurge: J
      })))
    ])
  ]);
}
function _c({ onNavigate: e, profile: t }) {
  const [r, o] = F([]), [i, a] = F(""), [s, l] = F(0), [d, c] = F(!0), [g, u] = F(null), [f, m] = F(""), p = ge(null);
  async function y(x) {
    const K = await ee("/bin", x ? { signal: x } : void 0);
    return o(K.items || []), a(K.fingerprint || ""), l(Number(K.totalCount) || 0), K;
  }
  pe(() => {
    const x = new AbortController();
    return c(!0), y(x.signal).catch((K) => {
      K.name !== "AbortError" && m(K.message);
    }).finally(() => {
      x.signal.aborted || c(!1);
    }), () => x.abort();
  }, []), Ta(oo, [{
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
    u(x.itemId), m("");
    const K = `restore:${x.itemId}:${x.revision}`, L = je(K);
    try {
      const A = (C = !1) => ee(`/bin/${x.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: L, expectedRevision: x.revision, discardMissingImage: C })
      });
      try {
        await A(co(K));
      } catch (C) {
        if ((($ = C.payload) == null ? void 0 : $.code) !== "missing-image" || !window.confirm(`${C.message}

Continue and discard the missing image reference?`)) throw C;
        uo(K), await A(!0);
      }
      Be(K), await y(), _n(), m("Segment restored with a new native ID.");
    } catch (A) {
      m(A.message || "Unable to restore the segment."), A.status === 409 && await y();
    } finally {
      u(null);
    }
  }
  async function I() {
    if (g == null)
      try {
        const x = await ai({
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
  return p.current = I, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    n(yo, {
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
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, x.endSec == null ? Ae(x.startSec) : `${Ae(x.startSec)} – ${Ae(x.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${x.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${x.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: g != null, onClick: () => b(x), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const Na = "ext:com.midnightrider.segment-studio:videos";
function Vr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = Ge(() => {
    var ne;
    const re = Aa(Na), ue = (ne = re == null ? void 0 : re.uiOptions) == null ? void 0 : ne.displayMode;
    return re ? {
      ...zn,
      defaultFilter: { ...zn.defaultFilter, ...re.findFilter || {} },
      defaultObjectFilter: re.objectFilter || {},
      defaultDisplayMode: zn.allowedDisplayModes.includes(ue) ? ue : zn.defaultDisplayMode
    } : zn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = Ra(i), [u, f] = F({ items: [], totalCount: 0 }), [m, p] = F(!0), [y, b] = F(""), [I, x] = F(0), [K, L] = F(/* @__PURE__ */ new Set()), [$, A] = F(null), [C, S] = F({ busy: !1, error: "", announcement: "" }), w = ge(0), E = ge(null), z = ge(null);
  z.current || (z.current = Mc());
  const ae = JSON.stringify(a), O = JSON.stringify(s), D = t || r === "review";
  pe(() => {
    z.current.selectionChanged(), E.current = null, L(/* @__PURE__ */ new Set()), S((re) => ({ busy: re.busy, error: "", announcement: "" }));
  }, [ae, O]), pe(() => {
    if (!D) return;
    const re = new AbortController();
    return ee("/analysis/status", { signal: re.signal }).then(A).catch((ue) => {
      ue.name !== "AbortError" && A({ configured: !0, ready: !1, error: ue.message || "Unable to check Full Scan readiness." });
    }), () => re.abort();
  }, [D]), pe(() => {
    const re = ++w.current, ue = new AbortController();
    return p(!0), b(""), ee(`/videos?${Xd(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: ue.signal }).then((ne) => {
      re === w.current && f(ne);
    }).catch((ne) => {
      re === w.current && ne.name !== "AbortError" && b(ne.message || "Unable to discover videos.");
    }).finally(() => {
      re === w.current && p(!1);
    }), () => {
      w.current++, ue.abort();
    };
  }, [ae, O, t, r, I]);
  function M(re) {
    d({ ...re, page: re.page || 1 });
  }
  function q(re) {
    c(re), d({ ...a, page: 1 });
  }
  function se(re, ue = !1) {
    L((ne) => ec(
      ne,
      u.items.map((Z) => Z.videoId),
      re,
      E.current,
      ue
    )), E.current = re;
  }
  function ie() {
    E.current = null, L(new Set(u.items.map((re) => re.videoId)));
  }
  function xe() {
    E.current = null, L(/* @__PURE__ */ new Set());
  }
  function J() {
    E.current = null, L((re) => new Set(u.items.map((ue) => ue.videoId).filter((ue) => !re.has(ue))));
  }
  async function Y(re = ["aiTagging", "omnishotcut"]) {
    const ue = z.current.begin();
    if (ue) {
      S({ busy: !0, error: "", announcement: "" });
      try {
        const ne = await Ec(
          [...K],
          re,
          ee,
          (Z) => window.confirm(Z)
        );
        if (ne.cancelled) {
          S({ busy: !1, error: "", announcement: "" });
          return;
        }
        ne.queuedIds.length > 0 && z.current.ownsCurrentSelection(ue) && (ne.queuedIds.includes(E.current) && (E.current = null), L((Z) => {
          const le = new Set(Z);
          return ne.queuedIds.forEach((V) => le.delete(V)), le;
        })), S({
          busy: !1,
          announcement: ne.queuedIds.length > 0 ? `${ne.queuedIds.length} ${ne.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: ne.failed.length > 0 ? `${ne.failed.length} selected ${ne.failed.length === 1 ? "video could" : "videos could"} not be queued. ${ne.failed[0].error}` : ""
        });
      } catch (ne) {
        S({ busy: !1, error: ne.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        z.current.finish(ue);
      }
    }
  }
  const oe = t || r === "review" ? pa : pa.filter((re) => !["reviewState", "shotBoundaries"].includes(re.id)), Q = $ === null || $.configured === !1 || $.ready === !1, ve = C.busy || Q, fe = ($ == null ? void 0 : $.error) || ($ === null ? "Checking Full Scan availability" : $.configured === !1 ? "Configure the analysis service before running Full Scan" : $.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), be = C.busy ? "Queueing scans…" : $ === null ? "Checking Full Scan…" : $.configured === !1 ? "Full Scan not configured" : $.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
  return n("div", { className: "w-full space-y-5" }, [
    n(yo, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(Ma, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: Na,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: M,
      totalCount: u.totalCount,
      isLoading: m,
      error: y ? new Error(y) : null,
      onRetry: () => x((re) => re + 1),
      sortOptions: t || r === "review" ? [...ga, { value: "unreviewed_count", label: "Unreviewed count" }] : ga,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: oe,
      objectFilter: s,
      onObjectFilterChange: q,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: D ? K : void 0,
      onSelectAll: D ? ie : void 0,
      onSelectNone: D ? xe : void 0,
      onInvertSelection: D ? J : void 0,
      selectionActions: D ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: ve,
          onClick: () => Y(),
          title: fe,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, be),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": ve,
            title: fe,
            onClick: (re) => {
              ve && re.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${ve ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(Ea, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([re, ue]) => n("button", {
            key: re,
            type: "button",
            disabled: C.busy,
            onClick: (ne) => {
              var Z;
              (Z = ne.currentTarget.closest("details")) == null || Z.removeAttribute("open"), Y(ue);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, re)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, C.announcement),
      C.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, C.error) : null,
      !m && u.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !m && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, u.items.map((re) => n(tc, { key: re.videoId, item: re, onNavigate: e, showReviewStates: D, selected: K.has(re.videoId), selectionActive: K.size > 0, onSelect: D ? se : null }))) : null,
      !m && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, u.items.map((re) => n(nc, { key: re.videoId, item: re, onNavigate: e, showReviewStates: D, selected: K.has(re.videoId), selectionActive: K.size > 0, onSelect: D ? se : null }))) : null
    ])
  ]);
}
function Ia({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = F(null), [s, l] = F(!0), [d, c] = F(""), g = ge(0), u = ge(0), f = ge(e), m = Bd();
  f.current = e;
  const [p] = F(() => Ds({
    beginRequest: () => ({ requestId: ++u.current, videoId: f.current }),
    fetchDetail: (L) => ee(y(L.videoId)),
    isCurrent: (L) => mr(L.requestId, u.current, L.videoId, f.current),
    isSameVideo: (L) => L.videoId === f.current
  })), y = (L) => `/videos/${L}/editor`;
  async function b(L, $, A) {
    const C = await ee(y($), A ? { signal: A.signal } : void 0);
    return mr(L, A ? g.current : u.current, $, f.current) ? (a(C), !0) : !1;
  }
  pe(() => {
    const L = ++g.current, $ = e, A = new AbortController();
    return a(null), l(!0), c(""), b(L, $, A).catch((C) => {
      mr(L, g.current, $, f.current) && C.name !== "AbortError" && c(C.message || "Unable to load the editor.");
    }).finally(() => {
      mr(L, g.current, $, f.current) && l(!1);
    }), () => {
      g.current++, u.current++, A.abort();
    };
  }, [e]);
  function I(L, $) {
    a((A) => (A == null ? void 0 : A.video.id) !== $ ? A : typeof L == "function" ? L(A) : L);
  }
  function x() {
    return p({
      onLoaded: (L) => {
        a(L), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: (L) => c(L.message || "Unable to reload the latest segment.")
    });
  }
  function K() {
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
      n(bs, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(Ac, {
      key: i.video.id,
      detail: i,
      onDetailChange: I,
      onConflict: x,
      onReload: K,
      onSlotsChanged: K,
      splitLayout: m,
      profile: o,
      initialSegmentId: ta() ? -ta() : Nl(),
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
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = fl(o), l = Wc(e, t, window.location.pathname), d = Vc(e, t, window.location.pathname), c = Jc(e, t, window.location.pathname), g = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (hl(g, o) === "videos" && g !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Vr, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(zc, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(wa, { onNavigate: r, profile: o });
    const m = Number(e);
    return Number.isInteger(m) && m > 0 ? n(Ia, {
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
  if (c) return n(_c, { onNavigate: r, profile: o });
  const f = Number(e);
  return d ? n(wa, { onNavigate: r, profile: o }) : Number.isInteger(f) && f > 0 ? n(Ia, {
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
function Qc({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = F(null), [a, s] = F("");
  return pe(() => {
    const l = new AbortController();
    return ee("/preferences", { signal: l.signal }).then((d) => i(Ya(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(Yc, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
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
const ku = {
  components: { SegmentStudioPage: Qc },
  actionHandlers: { openSegmentStudio: Xc }
};
export {
  wr as CLEARED_SEGMENT_SELECTION_ID,
  ga as DISCOVERY_SORT_OPTIONS,
  Ht as SEGMENT_STUDIO_CAPABILITIES,
  oo as SEGMENT_STUDIO_EXTENSION_ID,
  Qn as SEGMENT_STUDIO_SHORTCUTS,
  Fs as activeEditorFilterCount,
  Rd as addPendingChange,
  td as applyDerivationRuleSlotSuggestions,
  vr as applyFeedbackEditorDelta,
  Od as applyPendingChanges,
  ia as applySegmentMergeDelta,
  Ul as basicSegmentTimelineStyle,
  wl as browseClipEnd,
  Za as browseEditorHref,
  Xo as buildBrowseRequest,
  Oc as buildDerivationRuleGraph,
  Xd as buildDiscoverySearchParams,
  ks as buildMinuteTimelineTicks,
  Dc as buildPerformerSlotOverview,
  Al as buildSegmentQuickSearchEntries,
  id as buildSegmentRailRows,
  sd as buildTimelineRows,
  au as buildTimelineTicks,
  Cs as calculateCenteredTimelineScroll,
  Yr as calculateEditorPanelMaximum,
  ws as calculateMinuteLabelStride,
  iu as calculateMinuteTimelineWidth,
  As as calculateSwimlaneTitleMaximum,
  $s as calculateTimelinePlayheadPosition,
  io as calculateTimelineRatioBounds,
  Ms as calculateTimelineRatioFromPointer,
  su as calculateVerticalRevealOffset,
  ln as clampEditorPanelWidth,
  hr as clampSwimlaneTitleWidth,
  Ua as clampTimelineRatio,
  so as clampTimelineRatioForHeight,
  kr as clampTimelineZoom,
  Jd as compactProvenanceSummary,
  Mc as createBulkAnalysisCoordinator,
  Ds as createEditorReloader,
  ol as createQueuedReviewRequest,
  $d as createSaveQueue,
  ha as createSegmentAnalysisRequestScope,
  ku as default,
  Ed as discardPendingChange,
  Fl as downloadFileNameFromContentDisposition,
  js as dualRangeValueFromPointer,
  Jo as duplicateIdentityFromResponse,
  sl as duplicateOperationKey,
  Ha as editorVisibilityIncludingSegment,
  cd as expandedSwimlanes,
  vl as extensionOwnedSegmentsModeSwitchPrompt,
  fd as feedbackFrameTimestamps,
  bd as feedbackResultMatchesAction,
  yd as feedbackSelectionPlan,
  Ls as filterDerivedSegments,
  zr as filterEditorSegments,
  Pc as filterPerformerSlotOverview,
  Tl as filterSegmentQuickSearch,
  mu as filterSegmentStudioShortcuts,
  gd as findAdjacentSegmentGroupKey,
  gl as findAdjacentShot,
  tl as findEditorShortcut,
  Ga as findInitialSegmentSelection,
  Ss as findNearestSegmentInCurrentSwimlane,
  ml as findPublishedSelectionIdentity,
  Ye as findSegmentByStableIdentity,
  Es as findSegmentFromPlayhead,
  xs as findSegmentNearPlayhead,
  md as findSwimlaneRangeSelection,
  to as findSwimlaneSelection,
  Cl as findUniquePerformerSlotAssignment,
  Sr as findUnreviewedSelection,
  Jl as focusDialogDefaultButton,
  $r as formatGenderHint,
  pl as frameStepSeconds,
  Xa as generatePerformerSlotAssignmentRecommendations,
  uc as groupApprovedDraftsForPublishing,
  $l as groupAutoAssignCandidates,
  hd as groupIncorrectExamplesByTag,
  yc as groupMaterializationOutputs,
  dn as groupSegmentsIntoSwimlanes,
  ld as groupSelectedSwimlanes,
  fo as groupSwimlanesBySegmentGroup,
  At as handleModalKey,
  Sn as hasSegmentStudioCapability,
  hi as heldTagChangeFor,
  ul as heldTagReady,
  la as hideCollectedFeedbackSegments,
  Yl as historyActionsForTarget,
  pr as incorrectExampleHistoryState,
  ci as indexPerformerSlotsBySegment,
  fu as initialReviewFilter,
  Sd as insertSegmentProjection,
  mr as isCurrentEditorRequest,
  _l as isEditableTarget,
  bu as isEditorShortcutOwner,
  Cd as isKindRunning,
  Su as isSaveQueueBusy,
  Jc as isSegmentStudioBinRoute,
  Vc as isSegmentStudioSegmentsRoute,
  Wc as isSegmentStudioSettingsRoute,
  Lc as layoutDerivationRuleComponent,
  Fc as layoutDerivationRuleComponents,
  Id as mergeSegmentsProjection,
  Xl as multiSelectionActionHint,
  _s as nextSegmentAfterRemoval,
  Ws as nextUnreviewedAfterRemoval,
  en as normalizeCollapsedSegmentGroups,
  ya as normalizeDiscoveryIds,
  Mt as normalizeEditorSegmentFilters,
  Zt as normalizeGender,
  Yo as normalizeReviewFilter,
  Ya as normalizeSegmentStudioFeatureProfile,
  gu as normalizeSegmentStudioMode,
  Xr as normalizeSegmentStudioPublicMode,
  vn as parseBrowseSlotFilters,
  Rs as parseEditorLayout,
  Ps as parseHideDerivedSegmentsPreference,
  Os as parseMergeConfirmationPreference,
  Va as parsePlaybackShortcutConfig,
  Xs as parseShortcutBindingOverrides,
  Wr as patchPerformerSlotProjection,
  xu as patchSegmentProjection,
  Ld as pendingChangesReducer,
  Md as pendingInsertedSegments,
  Vs as percentageSeekTime,
  Il as performInitialSegmentSeek,
  st as performerOptionId,
  Nr as performerSlotHistoryState,
  Ct as performerSlotLabel,
  nd as performerSlotPresentation,
  vu as performerSlotStatus,
  po as performerSlotStatusFromSegmentSlots,
  di as performerSlotsForSegment,
  Ft as provenanceSourceLabel,
  xi as prunePendingChanges,
  cl as queueCreatedSegmentTagChoice,
  ei as rankPerformerOptions,
  pd as reconcileSegmentGroupKey,
  Hs as reconcileSelectedSegmentIds,
  rc as recyclingBinActionText,
  Bl as recyclingBinDeletionPrompt,
  oi as recyclingBinDeletionSummary,
  xl as recyclingBinModeSwitchPrompt,
  pu as removeQueuedReviewsForSegments,
  kd as removeSegmentsProjection,
  ta as requestedOwnedItemId,
  Nl as requestedSegmentId,
  Gs as resolveEditorSegmentSelection,
  al as resolveQueuedReviewRequest,
  ll as resolveSegmentCreationAction,
  hl as resolveSegmentStudioRoute,
  el as resolveSegmentStudioShortcuts,
  yi as resolveSegmentTarget,
  jc as resolveSelectedDerivationRule,
  _o as resolveSelectedSegments,
  xc as restoreDisabledToolbarActionFocus,
  Tc as restorePublishApprovedFocus,
  wd as restoreSegmentFieldsProjection,
  Nd as restoreSegmentsProjection,
  Pd as retargetPendingChanges,
  pi as revealCollapsedSegmentGroup,
  Ec as runSelectedDiscoveryAnalysis,
  kn as sameSegmentIdentity,
  bi as savingSegmentIdFrom,
  ii as segmentBadgeStyle,
  Cr as segmentGroupHeaderBackground,
  Ot as segmentGroupKeyForSegment,
  go as segmentHistoryIdentity,
  gr as segmentHistoryState,
  Gt as segmentIdentity,
  si as segmentRailItemStyle,
  yu as segmentStateStyle,
  Zc as segmentStudioActionTarget,
  fl as segmentStudioLegacyMode,
  Gl as segmentTimelineStyle,
  Rt as segmentsHistoryState,
  qs as selectAllVideoSegmentIds,
  Sl as selectedBrowseStates,
  mi as selectedSwimlaneMerge,
  Si as setBackLinkNavigation,
  Dd as settlePendingChange,
  Ql as sharedPerformerSlotShape,
  Zl as sharedTagPerformerSlotShape,
  xn as shortcutAvailableInMode,
  nl as shortcutBindingDisplayText,
  lu as shortcutBindingFromEvent,
  cu as shortcutBindingsOverlap,
  uu as shortcutModesOverlap,
  Zs as shortcutRequiresSingleSegment,
  qn as shotBoundaryFingerprint,
  Vl as shouldAcceptCurrentTagFromEnter,
  du as shouldExitShortcutCapture,
  hu as shouldHandleEditorShortcut,
  ba as shouldLoadSegmentAnalysis,
  ma as shouldReloadAfterSegmentMutation,
  Zr as shouldRestoreTransitionSelection,
  Rl as shouldShowQuickSearchGroups,
  Wo as splitShortcutCategoriesIntoColumns,
  ed as suggestDerivationRuleSlotMappings,
  Jn as swimlaneDisplayLabel,
  ql as swimlaneMarkerTop,
  zl as swimlaneStripeBackground,
  dl as tagEditorLockedBySave,
  fi as targetsOverlap,
  Ts as timelineContentStyle,
  zo as timelinePlayheadHorizontalStyle,
  Kl as timelineSegmentWidth,
  Ns as timelineTickAlignment,
  Is as timelineTickPosition,
  Jr as timelineTimePercent,
  ud as toggleAllCollapsedSegmentGroups,
  rl as toggledSelectionReviewState,
  Ut as trapModalFocus,
  Pl as tryParseJsonResponseText,
  zs as updateAnchoredSegmentSelection,
  ec as updateDiscoverySelection,
  Bs as updateDualRangeValues,
  Us as updateSegmentCollectionSelection,
  Ks as updateSegmentRangeSelection,
  qa as updateSegmentSelection,
  Sa as validateDerivationRuleDraft,
  Ko as validateSegmentTiming,
  lo as videoPerformerOptions,
  _r as videoPerformerSlotAssignments,
  bl as visibleSegmentStudioSettingsTabs,
  yl as visibleSegmentStudioTabs,
  ui as visibleVirtualRows
};
